import { useState } from 'react';
import CrudTable from '../components/CrudTable';
import CrudForm from '../components/CrudForm';
import useCrud from '../../hooks/useCrud';
import toast from 'react-hot-toast';

const fields = [
  { name: 'name', label: 'Program Name', type: 'text', required: true, placeholder: 'e.g. B.A., B.Sc., B.Com.' },
  { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Brief program description' },
  { name: 'eligibility', label: 'Eligibility', type: 'textarea', placeholder: 'Eligibility criteria' },
  { name: 'subjectsOffered', label: 'Subjects Offered', type: 'array', placeholder: 'Subject name' },
];

const columns = [
  { key: 'name', label: 'Program' },
  { key: 'eligibility', label: 'Eligibility', render: (item) => (item.eligibility || '—').substring(0, 60) },
  { key: 'subjectsOffered', label: 'Subjects', render: (item) => (item.subjectsOffered || []).length + ' subjects' },
];

const ProgramsPage = () => {
  const { data, loading, search, setSearch, createItem, updateItem, deleteItem, pagination, setPage } = useCrud('/programs');
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
    return <CrudForm title={editItem ? 'Edit Program' : 'Add Program'} fields={fields} initialData={editItem} onSubmit={handleSubmit} onCancel={() => { setMode('list'); setEditItem(null); }} loading={saving} />;
  }

  return (
    <CrudTable title="Academic Programs" columns={columns} data={data} loading={loading}
      onAdd={() => { setEditItem(null); setMode('form'); }}
      onEdit={(item) => { setEditItem(item); setMode('form'); }}
      onDelete={(item) => deleteItem(item._id)}
      searchable={true} searchValue={search} onSearchChange={setSearch}
      pagination={{ ...pagination, onPageChange: setPage }} addLabel="Add Program"
    />
  );
};

export default ProgramsPage;
