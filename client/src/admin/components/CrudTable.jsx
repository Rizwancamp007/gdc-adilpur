import { useState } from 'react';
import { HiSearch, HiPlus, HiPencil, HiTrash, HiRefresh, HiChevronLeft, HiChevronRight, HiEye } from 'react-icons/hi';

/**
 * Generic CRUD Table component.
 *
 * Props:
 *  - title: string — page title
 *  - columns: [{key, label, render?}] — column definitions
 *  - data: array — row data
 *  - loading: bool
 *  - onAdd: () => void — called when Add button clicked
 *  - onEdit: (item) => void
 *  - onDelete: (item) => void
 *  - onRestore?: (item) => void — for soft-delete models
 *  - onView?: (item) => void
 *  - extraActions?: (item) => JSX — additional action buttons
 *  - searchable?: bool (default true)
 *  - pagination?: { page, pages, total, onPageChange }
 *  - softDelete?: bool — show isActive column
 *  - addLabel?: string — custom add button text
 */
const CrudTable = ({
  title,
  columns,
  data = [],
  loading = false,
  onAdd,
  onEdit,
  onDelete,
  onRestore,
  onView,
  extraActions,
  searchable = true,
  searchValue = '',
  onSearchChange,
  pagination,
  softDelete = false,
  addLabel = 'Add New',
}) => {
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleDeleteClick = (item) => {
    setConfirmDelete(item._id);
  };

  const handleConfirmDelete = (item) => {
    onDelete(item);
    setConfirmDelete(null);
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>
          {title}
        </h1>
        {onAdd && (
          <button className="btn btn-primary" onClick={onAdd}>
            <HiPlus /> {addLabel}
          </button>
        )}
      </div>

      {/* Search Bar */}
      {searchable && onSearchChange && (
        <div style={{ marginBottom: '1rem', maxWidth: '360px' }}>
          <div style={{ position: 'relative' }}>
            <HiSearch style={{
              position: 'absolute', left: '0.75rem', top: '50%',
              transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '1.125rem',
            }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
        </div>
      )}

      {/* Table Card */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
      }}>
        {loading ? (
          <div style={{
            padding: '3rem', textAlign: 'center', color: 'var(--text-tertiary)',
          }}>
            <div style={{
              width: '36px', height: '36px',
              border: '3px solid var(--border-default)', borderTopColor: 'var(--color-primary)',
              borderRadius: '50%', animation: 'spin 0.8s linear infinite',
              margin: '0 auto 1rem',
            }} />
            Loading...
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : data.length === 0 ? (
          <div style={{
            padding: '3rem', textAlign: 'center', color: 'var(--text-tertiary)',
          }}>
            <p style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>No records found</p>
            <p style={{ fontSize: '0.8125rem' }}>
              {onAdd ? 'Click "Add New" to create your first entry.' : 'No data available.'}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem',
            }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-default)' }}>
                  {columns.map((col) => (
                    <th key={col.key} style={{
                      padding: '0.75rem 1rem', textAlign: 'left', fontWeight: '600',
                      color: 'var(--text-secondary)', fontSize: '0.8125rem',
                      textTransform: 'uppercase', letterSpacing: '0.04em',
                      whiteSpace: 'nowrap', background: 'var(--bg-muted)',
                    }}>
                      {col.label}
                    </th>
                  ))}
                  {softDelete && (
                    <th style={{
                      padding: '0.75rem 1rem', textAlign: 'center', fontWeight: '600',
                      color: 'var(--text-secondary)', fontSize: '0.8125rem',
                      textTransform: 'uppercase', letterSpacing: '0.04em',
                      background: 'var(--bg-muted)', whiteSpace: 'nowrap',
                    }}>Status</th>
                  )}
                  <th style={{
                    padding: '0.75rem 1rem', textAlign: 'right', fontWeight: '600',
                    color: 'var(--text-secondary)', fontSize: '0.8125rem',
                    textTransform: 'uppercase', letterSpacing: '0.04em',
                    background: 'var(--bg-muted)', whiteSpace: 'nowrap', minWidth: '140px',
                  }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, idx) => (
                  <tr key={item._id || idx} style={{
                    borderBottom: '1px solid var(--border-light)',
                    transition: 'background var(--transition-fast)',
                    background: item.isActive === false ? 'var(--color-danger-bg)' : 'transparent',
                    cursor: 'default',
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.background = item.isActive === false ? 'var(--color-danger-bg)' : 'var(--bg-surface-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = item.isActive === false ? 'var(--color-danger-bg)' : 'transparent'}
                  >
                    {columns.map((col) => (
                      <td key={col.key} style={{
                        padding: '0.75rem 1rem', color: 'var(--text-primary)',
                        maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>
                        {col.render ? col.render(item) : (item[col.key] ?? '—')}
                      </td>
                    ))}
                    {softDelete && (
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                        <span className={`badge ${item.isActive !== false ? 'badge-success' : 'badge-danger'}`}>
                          {item.isActive !== false ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    )}
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.375rem', justifyContent: 'flex-end' }}>
                        {onView && (
                          <button className="btn btn-ghost btn-sm btn-icon" onClick={() => onView(item)} title="View">
                            <HiEye />
                          </button>
                        )}
                        {onEdit && (
                          <button className="btn btn-ghost btn-sm btn-icon" onClick={() => onEdit(item)} title="Edit"
                            style={{ color: 'var(--color-primary)' }}>
                            <HiPencil />
                          </button>
                        )}
                        {extraActions && extraActions(item)}
                        {onRestore && item.isActive === false && (
                          <button className="btn btn-outline btn-sm" onClick={() => onRestore(item)} title="Restore"
                            style={{ color: 'var(--color-success)', borderColor: 'var(--color-success)', fontSize: '0.75rem' }}>
                            <HiRefresh /> Restore
                          </button>
                        )}
                        {onDelete && confirmDelete !== item._id && (
                          <button className="btn btn-ghost btn-sm btn-icon" onClick={() => handleDeleteClick(item)} title="Delete"
                            style={{ color: 'var(--color-danger)' }}>
                            <HiTrash />
                          </button>
                        )}
                        {onDelete && confirmDelete === item._id && (
                          <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                            <button className="btn btn-danger btn-sm" onClick={() => handleConfirmDelete(item)}
                              style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>
                              Confirm
                            </button>
                            <button className="btn btn-ghost btn-sm" onClick={() => setConfirmDelete(null)}
                              style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0.75rem 1rem', borderTop: '1px solid var(--border-default)',
            fontSize: '0.8125rem', color: 'var(--text-tertiary)',
          }}>
            <span>Page {pagination.page} of {pagination.pages} ({pagination.total} records)</span>
            <div style={{ display: 'flex', gap: '0.375rem' }}>
              <button
                className="btn btn-ghost btn-sm btn-icon"
                disabled={pagination.page <= 1}
                onClick={() => pagination.onPageChange(pagination.page - 1)}
              >
                <HiChevronLeft />
              </button>
              <button
                className="btn btn-ghost btn-sm btn-icon"
                disabled={pagination.page >= pagination.pages}
                onClick={() => pagination.onPageChange(pagination.page + 1)}
              >
                <HiChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CrudTable;
