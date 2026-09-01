import { useState } from 'react';
import CrudTable from '../components/CrudTable';
import CrudForm from '../components/CrudForm';
import useCrud from '../../hooks/useCrud';
import toast from 'react-hot-toast';

const fields = [
  { name: 'title', label: 'Notice Title', type: 'text', required: true, placeholder: 'Enter notice title' },
  { name: 'body', label: 'Notice Body', type: 'textarea', rows: 6, placeholder: 'Full notice content...' },
  { name: 'category', label: 'Category', type: 'select', options: ['General', 'Academic', 'Examination', 'Admission', 'Administrative', 'Other'] },
  { name: 'attachmentUrl', label: 'Attachment URL (PDF)', type: 'url', placeholder: 'https://res.cloudinary.com/...', hint: 'Upload PDF to Cloudinary and paste URL here' },
  { name: 'isPinned', label: 'Pin to Top', type: 'toggle', defaultValue: false },
  { name: 'publishDate', label: 'Publish Date', type: 'date' },
  { name: 'expiryDate', label: 'Expiry Date', type: 'date', hint: 'Leave blank for no expiry' },
  { name: 'isActive', label: 'Active', type: 'toggle', defaultValue: true },
];

const columns = [
  { key: 'title', label: 'Title', render: (item) => (
    <div>
      <span style={{ fontWeight: '500' }}>{item.title}</span>
      {item.isPinned && <span className="badge badge-warning" style={{ marginLeft: '0.5rem' }}>Pinned</span>}
    </div>
  )},
  { key: 'category', label: 'Category', render: (item) => <span className="badge badge-primary">{item.category}</span> },
  { key: 'publishDate', label: 'Published', render: (item) => item.publishDate ? new Date(item.publishDate).toLocaleDateString() : '—' },
  { key: 'attachmentUrl', label: 'Attachment', render: (item) => item.attachmentUrl ? <a href={item.attachmentUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--color-info)', fontSize: '0.8125rem' }}>View PDF</a> : '—' },
];

const NoticesPage = () => {
  const { data, loading, search, setSearch, createItem, updateItem, deleteItem, restoreItem, pagination, setPage } = useCrud('/notices');
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
    return <CrudForm title={editItem ? 'Edit Notice' : 'Add Notice'} fields={fields} initialData={editItem} onSubmit={handleSubmit} onCancel={() => { setMode('list'); setEditItem(null); }} loading={saving} />;
  }

  return (
    <CrudTable title="Notices" columns={columns} data={data} loading={loading}
      onAdd={() => { setEditItem(null); setMode('form'); }}
      onEdit={(item) => { setEditItem(item); setMode('form'); }}
      onDelete={(item) => deleteItem(item._id)}
      onRestore={(item) => restoreItem(item._id)}
      softDelete={true}
      searchable={true} searchValue={search} onSearchChange={setSearch}
      pagination={{ ...pagination, onPageChange: setPage }} addLabel="Add Notice"
    />
  );
};

export default NoticesPage;
