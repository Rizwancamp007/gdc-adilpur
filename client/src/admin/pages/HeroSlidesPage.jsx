import { useState } from 'react';
import CrudTable from '../components/CrudTable';
import CrudForm from '../components/CrudForm';
import useCrud from '../../hooks/useCrud';
import toast from 'react-hot-toast';

const heroFields = [
  { name: 'imageUrl', label: 'Image URL', type: 'url', required: true, placeholder: 'https://res.cloudinary.com/...', hint: 'Upload image to Cloudinary and paste URL here' },
  { name: 'caption', label: 'Caption', type: 'text', placeholder: 'Slide caption text' },
  { name: 'linkUrl', label: 'Link URL', type: 'url', placeholder: 'Optional link when slide is clicked' },
  { name: 'order', label: 'Display Order', type: 'number', placeholder: '0', hint: 'Lower numbers appear first' },
  { name: 'isActive', label: 'Active', type: 'toggle', defaultValue: true },
];

const columns = [
  {
    key: 'imageUrl', label: 'Image',
    render: (item) => item.imageUrl ? (
      <img src={item.imageUrl} alt={item.caption || 'Slide'} style={{ width: '80px', height: '45px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-default)' }} />
    ) : '—',
  },
  { key: 'caption', label: 'Caption' },
  { key: 'order', label: 'Order' },
];

const HeroSlidesPage = () => {
  const { data, loading, search, setSearch, createItem, updateItem, deleteItem, pagination, setPage } = useCrud('/hero-slides');
  const [mode, setMode] = useState('list');
  const [editItem, setEditItem] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleAdd = () => { setEditItem(null); setMode('form'); };
  const handleEdit = (item) => { setEditItem(item); setMode('form'); };
  const handleCancel = () => { setMode('list'); setEditItem(null); };

  const handleSubmit = async (formData) => {
    setSaving(true);
    try {
      if (editItem) {
        await updateItem(editItem._id, formData);
      } else {
        await createItem(formData);
      }
      setMode('list');
      setEditItem(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  if (mode === 'form') {
    return (
      <CrudForm
        title={editItem ? 'Edit Hero Slide' : 'Add Hero Slide'}
        fields={heroFields}
        initialData={editItem}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={saving}
      />
    );
  }

  return (
    <CrudTable
      title="Hero Slides"
      columns={columns}
      data={data}
      loading={loading}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={(item) => deleteItem(item._id)}
      searchable={true}
      searchValue={search}
      onSearchChange={setSearch}
      softDelete={true}
      pagination={{ ...pagination, onPageChange: setPage }}
    />
  );
};

export default HeroSlidesPage;
