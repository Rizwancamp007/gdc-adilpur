import { useState, useEffect } from 'react';
import CrudTable from '../components/CrudTable';
import CrudForm from '../components/CrudForm';
import useCrud from '../../hooks/useCrud';
import toast from 'react-hot-toast';
import { HiArrowLeft, HiUserGroup } from 'react-icons/hi';

const deptFields = [
  { name: 'name', label: 'Department Name', type: 'text', required: true, placeholder: 'e.g. Department of English' },
  { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Brief department description' },
];

const deptColumns = [
  { key: 'name', label: 'Department Name' },
  { key: 'description', label: 'Description', render: (item) => (item.description || '—').substring(0, 80) + (item.description?.length > 80 ? '...' : '') },
];

const DepartmentsFacultyPage = () => {
  // Departments CRUD
  const deptCrud = useCrud('/departments');
  // Faculty CRUD
  const facultyCrud = useCrud('/faculty', { autoFetch: false });

  const [view, setView] = useState('deptList'); // deptList | deptForm | facultyList | facultyForm
  const [editDept, setEditDept] = useState(null);
  const [editFaculty, setEditFaculty] = useState(null);
  const [selectedDept, setSelectedDept] = useState(null);
  const [saving, setSaving] = useState(false);

  // Load faculty when dept selected
  useEffect(() => {
    if (selectedDept) {
      facultyCrud.fetchData({ departmentId: selectedDept._id });
    }
  }, [selectedDept]);

  // ─── Department Handlers ───
  const handleAddDept = () => { setEditDept(null); setView('deptForm'); };
  const handleEditDept = (item) => { setEditDept(item); setView('deptForm'); };
  const handleDeptSubmit = async (data) => {
    setSaving(true);
    try {
      if (editDept) await deptCrud.updateItem(editDept._id, data);
      else await deptCrud.createItem(data);
      setView('deptList');
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  // View faculty for a department
  const handleViewFaculty = (dept) => {
    setSelectedDept(dept);
    setView('facultyList');
  };

  // ─── Faculty Handlers ───
  const handleAddFaculty = () => { setEditFaculty(null); setView('facultyForm'); };
  const handleEditFaculty = (item) => { setEditFaculty(item); setView('facultyForm'); };

  const facultyFields = [
    { name: 'name', label: 'Full Name', type: 'text', required: true },
    { name: 'designation', label: 'Designation', type: 'text', placeholder: 'e.g. Lecturer, Assistant Professor' },
    { name: 'qualification', label: 'Qualification', type: 'text', placeholder: 'e.g. M.A., M.Phil., Ph.D.' },
    { name: 'subject', label: 'Subject', type: 'text', placeholder: 'e.g. English Literature' },
    { name: 'photoUrl', label: 'Photo URL', type: 'url', placeholder: 'https://res.cloudinary.com/...', hint: 'Upload photo to Cloudinary and paste URL' },
    { name: 'isActive', label: 'Active', type: 'toggle', defaultValue: true },
  ];

  const facultyColumns = [
    {
      key: 'photoUrl', label: 'Photo',
      render: (item) => item.photoUrl ? (
        <img src={item.photoUrl} alt={item.name} style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '50%', border: '1px solid var(--border-default)' }} />
      ) : <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.75rem' }}>N/A</div>,
    },
    { key: 'name', label: 'Name' },
    { key: 'designation', label: 'Designation' },
    { key: 'qualification', label: 'Qualification' },
    { key: 'subject', label: 'Subject' },
  ];

  const handleFacultySubmit = async (data) => {
    setSaving(true);
    try {
      const payload = { ...data, departmentId: selectedDept._id };
      if (editFaculty) await facultyCrud.updateItem(editFaculty._id, payload);
      else await facultyCrud.createItem(payload);
      setView('facultyList');
      setEditFaculty(null);
      facultyCrud.fetchData({ departmentId: selectedDept._id });
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  // ─── Render ───
  if (view === 'deptForm') {
    return (
      <CrudForm
        title={editDept ? 'Edit Department' : 'Add Department'}
        fields={deptFields}
        initialData={editDept}
        onSubmit={handleDeptSubmit}
        onCancel={() => setView('deptList')}
        loading={saving}
      />
    );
  }

  if (view === 'facultyForm') {
    return (
      <CrudForm
        title={editFaculty ? 'Edit Faculty Member' : 'Add Faculty Member'}
        fields={facultyFields}
        initialData={editFaculty}
        onSubmit={handleFacultySubmit}
        onCancel={() => { setView('facultyList'); setEditFaculty(null); }}
        loading={saving}
      />
    );
  }

  if (view === 'facultyList' && selectedDept) {
    return (
      <div className="animate-fade-in">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <button className="btn btn-ghost btn-icon" onClick={() => { setView('deptList'); setSelectedDept(null); }}>
            <HiArrowLeft style={{ fontSize: '1.25rem' }} />
          </button>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              {selectedDept.name}
            </h1>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>Faculty Members</p>
          </div>
        </div>
        <CrudTable
          title=""
          columns={facultyColumns}
          data={facultyCrud.data}
          loading={facultyCrud.loading}
          onAdd={handleAddFaculty}
          onEdit={handleEditFaculty}
          onDelete={(item) => { facultyCrud.deleteItem(item._id); setTimeout(() => facultyCrud.fetchData({ departmentId: selectedDept._id }), 500); }}
          onRestore={(item) => { facultyCrud.restoreItem(item._id); setTimeout(() => facultyCrud.fetchData({ departmentId: selectedDept._id }), 500); }}
          softDelete={true}
          addLabel="Add Faculty"
          searchable={false}
        />
      </div>
    );
  }

  // Default: Department list
  return (
    <CrudTable
      title="Departments & Faculty"
      columns={deptColumns}
      data={deptCrud.data}
      loading={deptCrud.loading}
      onAdd={handleAddDept}
      onEdit={handleEditDept}
      onDelete={(item) => deptCrud.deleteItem(item._id)}
      onView={handleViewFaculty}
      searchable={true}
      searchValue={deptCrud.search}
      onSearchChange={deptCrud.setSearch}
      addLabel="Add Department"
      extraActions={(item) => (
        <button className="btn btn-outline btn-sm" onClick={() => handleViewFaculty(item)}
          style={{ fontSize: '0.75rem' }}>
          <HiUserGroup /> Faculty
        </button>
      )}
    />
  );
};

export default DepartmentsFacultyPage;
