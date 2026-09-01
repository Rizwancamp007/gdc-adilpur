import { useState } from 'react';
import CrudTable from '../components/CrudTable';
import CrudForm from '../components/CrudForm';
import useCrud from '../../hooks/useCrud';
import toast from 'react-hot-toast';

const fields = [
  { name: 'name', label: 'Full Name', type: 'text', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'password', label: 'Password', type: 'text', required: false, placeholder: 'Min 6 characters (leave blank to keep current)', hint: 'Required for new users. Leave blank when editing to keep current password.' },
  { name: 'role', label: 'Role', type: 'select', required: true, options: [{ value: 'Admin', label: 'Admin — Full access' }, { value: 'Clerk', label: 'Clerk — Content access only' }] },
  { name: 'isActive', label: 'Active', type: 'toggle', defaultValue: true },
];

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role', render: (item) => <span className={`badge ${item.role === 'Admin' ? 'badge-warning' : 'badge-primary'}`}>{item.role}</span> },
  { key: 'isActive', label: 'Status', render: (item) => <span className={`badge ${item.isActive ? 'badge-success' : 'badge-danger'}`}>{item.isActive ? 'Active' : 'Inactive'}</span> },
];

const UsersPage = () => {
  const { data, loading, search, setSearch, pagination, setPage } = useCrud('/users');
  const { createItem, updateItem, deleteItem, fetchData } = useCrud('/users', { autoFetch: false });
  const [mode, setMode] = useState('list');
  const [editItem, setEditItem] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (formData) => {
    setSaving(true);
    try {
      if (editItem) await updateItem(editItem._id, formData);
      else await createItem(formData);
      setMode('list'); setEditItem(null);
      window.location.reload(); // Refresh user list
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  if (mode === 'form') {
    const editFields = editItem
      ? fields.map((f) => f.name === 'password' ? { ...f, required: false, placeholder: 'Leave blank to keep current password' } : f)
      : fields.map((f) => f.name === 'password' ? { ...f, required: true } : f);

    return <CrudForm title={editItem ? 'Edit User' : 'Add User'} fields={editFields} initialData={editItem} onSubmit={handleSubmit} onCancel={() => { setMode('list'); setEditItem(null); }} loading={saving} />;
  }

  return (
    <CrudTable title="User Management" columns={columns} data={data} loading={loading}
      onAdd={() => { setEditItem(null); setMode('form'); }}
      onEdit={(item) => { setEditItem(item); setMode('form'); }}
      onDelete={(item) => deleteItem(item._id)}
      searchable={true} searchValue={search} onSearchChange={setSearch}
      pagination={{ ...pagination, onPageChange: setPage }} addLabel="Add User"
    />
  );
};

export default UsersPage;
