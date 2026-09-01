import { useState } from 'react';
import CrudTable from '../components/CrudTable';
import CrudForm from '../components/CrudForm';
import useCrud from '../../hooks/useCrud';
import toast from 'react-hot-toast';

const fields = [
  { name: 'title', label: 'Document Title', type: 'text', required: true, placeholder: 'e.g. Admission Form 2024' },
  { name: 'category', label: 'Category', type: 'select', required: true, options: ['Form', 'Policy', 'Prospectus', 'Other'] },
  { name: 'fileUrl', label: 'File URL', type: 'url', required: true, placeholder: 'https://res.cloudinary.com/...', hint: 'Upload file to Cloudinary and paste URL' },
  { name: 'isActive', label: 'Active', type: 'toggle', defaultValue: true },
];

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'category', label: 'Category', render: (item) => <span className="badge badge-info">{item.category}</span> },
  { key: 'fileUrl', label: 'File', render: (item) => item.fileUrl ? <a href={item.fileUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--color-info)', fontSize: '0.8125rem' }}>Download</a> : '—' },
  { key: 'uploadDate', label: 'Uploaded', render: (item) => item.uploadDate ? new Date(item.uploadDate).toLocaleDateString() : '—' },
];

const DownloadsPage = () => {
  const { data, loading, search, setSearch, createItem, updateItem, deleteItem, restoreItem, pagination, setPage } = useCrud('/downloads');
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
    return <CrudForm title={editItem ? 'Edit Download' : 'Add Download'} fields={fields} initialData={editItem} onSubmit={handleSubmit} onCancel={() => { setMode('list'); setEditItem(null); }} loading={saving} />;
  }

  return (
    <CrudTable title="Downloads" columns={columns} data={data} loading={loading}
      onAdd={() => { setEditItem(null); setMode('form'); }}
      onEdit={(item) => { setEditItem(item); setMode('form'); }}
      onDelete={(item) => deleteItem(item._id)}
      onRestore={(item) => restoreItem(item._id)}
      softDelete={true}
      searchable={true} searchValue={search} onSearchChange={setSearch}
      pagination={{ ...pagination, onPageChange: setPage }} addLabel="Add Download"
    />
  );
};

export default DownloadsPage;
