import { useState } from 'react';
import CrudTable from '../components/CrudTable';
import CrudForm from '../components/CrudForm';
import useCrud from '../../hooks/useCrud';
import toast from 'react-hot-toast';

const fields = [
  { name: 'mediaUrl', label: 'Media URL', type: 'url', required: true, placeholder: 'https://res.cloudinary.com/... or YouTube link', hint: 'Image/video URL from Cloudinary, YouTube, or Vimeo' },
  { name: 'mediaType', label: 'Media Type', type: 'select', options: ['image', 'video'], required: true },
  { name: 'caption', label: 'Caption', type: 'text', placeholder: 'Describe this media' },
  { name: 'eventCategory', label: 'Event / Category', type: 'text', placeholder: 'e.g. Annual Function 2024, Sports Day' },
];

const columns = [
  {
    key: 'mediaUrl', label: 'Preview',
    render: (item) => item.mediaType === 'image' && item.mediaUrl ? (
      <img src={item.mediaUrl} alt={item.caption || 'Gallery'} style={{ width: '60px', height: '45px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-default)' }} />
    ) : <span className="badge badge-info">{item.mediaType || 'video'}</span>,
  },
  { key: 'caption', label: 'Caption' },
  { key: 'eventCategory', label: 'Event / Category' },
  { key: 'mediaType', label: 'Type', render: (item) => <span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>{item.mediaType}</span> },
];

const GalleryPage = () => {
  const { data, loading, search, setSearch, createItem, updateItem, deleteItem, pagination, setPage } = useCrud('/gallery');
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
    return <CrudForm title={editItem ? 'Edit Gallery Item' : 'Add Gallery Item'} fields={fields} initialData={editItem} onSubmit={handleSubmit} onCancel={() => { setMode('list'); setEditItem(null); }} loading={saving} />;
  }

  return (
    <CrudTable title="Gallery" columns={columns} data={data} loading={loading}
      onAdd={() => { setEditItem(null); setMode('form'); }}
      onEdit={(item) => { setEditItem(item); setMode('form'); }}
      onDelete={(item) => deleteItem(item._id)}
      searchable={true} searchValue={search} onSearchChange={setSearch}
      pagination={{ ...pagination, onPageChange: setPage }} addLabel="Add Media"
    />
  );
};

export default GalleryPage;
