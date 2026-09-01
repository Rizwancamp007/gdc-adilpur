import { useState } from 'react';
import CrudTable from '../components/CrudTable';
import CrudForm from '../components/CrudForm';
import useCrud from '../../hooks/useCrud';
import toast from 'react-hot-toast';

const fields = [
  { name: 'studentName', label: 'Student Name', type: 'text', required: true },
  { name: 'achievement', label: 'Achievement', type: 'textarea', required: true, placeholder: 'What did this student achieve?' },
  { name: 'year', label: 'Year', type: 'text', placeholder: 'e.g. 2024' },
  { name: 'photoUrl', label: 'Photo URL', type: 'url', placeholder: 'https://res.cloudinary.com/...', hint: 'Upload photo to Cloudinary' },
];

const columns = [
  {
    key: 'photoUrl', label: 'Photo',
    render: (item) => item.photoUrl ? (
      <img src={item.photoUrl} alt={item.studentName} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '50%', border: '1px solid var(--border-default)' }} />
    ) : '—',
  },
  { key: 'studentName', label: 'Student Name' },
  { key: 'achievement', label: 'Achievement', render: (item) => (item.achievement || '').substring(0, 60) + (item.achievement?.length > 60 ? '...' : '') },
  { key: 'year', label: 'Year' },
];

const SuccessStoriesPage = () => {
  const { data, loading, search, setSearch, createItem, updateItem, deleteItem, pagination, setPage } = useCrud('/success-stories');
  const [mode, setMode] = useState('list');
  const [editItem, setEditItem] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (formData) => {
    setSaving(true);
    try {
      if (editItem) await updateItem(editItem._id, formData);
      else await createItem(formData);
      setMode('list'); setEditItem(null);
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  if (mode === 'form') {
    return <CrudForm title={editItem ? 'Edit Success Story' : 'Add Success Story'} fields={fields} initialData={editItem} onSubmit={handleSubmit} onCancel={() => { setMode('list'); setEditItem(null); }} loading={saving} />;
  }

  return (
    <CrudTable title="Success Stories" columns={columns} data={data} loading={loading}
      onAdd={() => { setEditItem(null); setMode('form'); }}
      onEdit={(item) => { setEditItem(item); setMode('form'); }}
      onDelete={(item) => deleteItem(item._id)}
      searchable={true} searchValue={search} onSearchChange={setSearch}
      pagination={{ ...pagination, onPageChange: setPage }} addLabel="Add Story"
    />
  );
};

export default SuccessStoriesPage;
