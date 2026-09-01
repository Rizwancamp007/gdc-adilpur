import { useState } from 'react';
import CrudTable from '../components/CrudTable';
import CrudForm from '../components/CrudForm';
import useCrud from '../../hooks/useCrud';
import toast from 'react-hot-toast';

const fields = [
  { name: 'title', label: 'Page Title', type: 'text', required: true, placeholder: 'e.g. Examination Rules' },
  { name: 'slug', label: 'URL Slug', type: 'text', required: true, placeholder: 'e.g. examination-rules', hint: 'Used in URL: /info/your-slug' },
  { name: 'body', label: 'Page Content', type: 'textarea', rows: 10, placeholder: 'Page content...' },
  { name: 'isActive', label: 'Published', type: 'toggle', defaultValue: true },
];

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'slug', label: 'Slug', render: (item) => <code style={{ fontSize: '0.8125rem', color: 'var(--color-info)', background: 'var(--bg-muted)', padding: '0.125rem 0.375rem', borderRadius: '4px' }}>/info/{item.slug}</code> },
  { key: 'isActive', label: 'Status', render: (item) => <span className={`badge ${item.isActive ? 'badge-success' : 'badge-danger'}`}>{item.isActive ? 'Published' : 'Draft'}</span> },
];

const PagesPage = () => {
  const { data, loading, search, setSearch, createItem, updateItem, deleteItem, pagination, setPage } = useCrud('/pages');
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
    return <CrudForm title={editItem ? 'Edit Page' : 'Create Page'} fields={fields} initialData={editItem} onSubmit={handleSubmit} onCancel={() => { setMode('list'); setEditItem(null); }} loading={saving} />;
  }

  return (
    <CrudTable title="Custom Pages" columns={columns} data={data} loading={loading}
      onAdd={() => { setEditItem(null); setMode('form'); }}
      onEdit={(item) => { setEditItem(item); setMode('form'); }}
      onDelete={(item) => deleteItem(item._id)}
      searchable={true} searchValue={search} onSearchChange={setSearch}
      pagination={{ ...pagination, onPageChange: setPage }} addLabel="Create Page"
    />
  );
};

export default PagesPage;
