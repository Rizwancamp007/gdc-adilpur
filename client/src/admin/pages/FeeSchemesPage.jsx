import { useState } from 'react';
import CrudTable from '../components/CrudTable';
import CrudForm from '../components/CrudForm';
import useCrud from '../../hooks/useCrud';
import toast from 'react-hot-toast';

const fields = [
  { name: 'programName', label: 'Program Name', type: 'text', required: true, placeholder: 'e.g. B.A., B.Sc.' },
  { name: 'effectiveYear', label: 'Effective Year', type: 'text', placeholder: 'e.g. 2024-25' },
  { name: 'feeBreakdown', label: 'Fee Breakdown', type: 'feeBreakdown' },
];

const columns = [
  { key: 'programName', label: 'Program' },
  { key: 'effectiveYear', label: 'Year' },
  {
    key: 'feeBreakdown', label: 'Total Fee',
    render: (item) => {
      const total = (item.feeBreakdown || []).reduce((sum, f) => sum + (f.amount || 0), 0);
      return `PKR ${total.toLocaleString()}`;
    },
  },
  {
    key: 'items', label: 'Items',
    render: (item) => `${(item.feeBreakdown || []).length} items`,
  },
];

const FeeSchemesPage = () => {
  const { data, loading, search, setSearch, createItem, updateItem, deleteItem, pagination, setPage } = useCrud('/fee-schemes');
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
    return <CrudForm title={editItem ? 'Edit Fee Scheme' : 'Add Fee Scheme'} fields={fields} initialData={editItem} onSubmit={handleSubmit} onCancel={() => { setMode('list'); setEditItem(null); }} loading={saving} />;
  }

  return (
    <CrudTable title="Fee Schemes" columns={columns} data={data} loading={loading}
      onAdd={() => { setEditItem(null); setMode('form'); }}
      onEdit={(item) => { setEditItem(item); setMode('form'); }}
      onDelete={(item) => deleteItem(item._id)}
      searchable={true} searchValue={search} onSearchChange={setSearch}
      pagination={{ ...pagination, onPageChange: setPage }} addLabel="Add Fee Scheme"
    />
  );
};

export default FeeSchemesPage;
