import { useState } from 'react';
import useCrud from '../../hooks/useCrud';
import toast from 'react-hot-toast';
import { HiChatAlt2, HiCheckCircle, HiClock, HiExclamation } from 'react-icons/hi';

const statusBadge = (status) => {
  const map = {
    New: { cls: 'badge-warning', icon: <HiExclamation /> },
    'In Review': { cls: 'badge-info', icon: <HiClock /> },
    Resolved: { cls: 'badge-success', icon: <HiCheckCircle /> },
  };
  const s = map[status] || map['New'];
  return <span className={`badge ${s.cls}`} style={{ gap: '0.25rem', display: 'inline-flex', alignItems: 'center' }}>{s.icon} {status}</span>;
};

const FeedbackPage = () => {
  const { data, loading, updateItem, deleteItem } = useCrud('/feedback');
  const [selected, setSelected] = useState(null);

  const handleStatusChange = async (item, newStatus) => {
    try {
      await updateItem(item._id, { status: newStatus });
    } catch (e) { toast.error('Failed to update status'); }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <HiChatAlt2 style={{ fontSize: '1.5rem', color: 'var(--color-primary)' }} />
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>Feedback & Grievances</h1>
      </div>

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>Loading...</div>
      ) : data.length === 0 ? (
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', padding: '3rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
          No feedback or grievances received yet.
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: selected ? '1fr 1fr' : '1fr' }}>
          {/* List */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            {data.map((item) => (
              <div key={item._id} onClick={() => setSelected(item)}
                style={{
                  padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-light)',
                  cursor: 'pointer', transition: 'background var(--transition-fast)',
                  background: selected?._id === item._id ? 'var(--color-primary-50)' : 'transparent',
                }}
                onMouseEnter={(e) => { if (selected?._id !== item._id) e.currentTarget.style.background = 'var(--bg-surface-hover)'; }}
                onMouseLeave={(e) => { if (selected?._id !== item._id) e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
                  <span style={{ fontWeight: '600', fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{item.name}</span>
                  {statusBadge(item.status)}
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>
                  <span className={`badge ${item.type === 'Grievance' ? 'badge-danger' : 'badge-primary'}`} style={{ marginRight: '0.5rem' }}>{item.type}</span>
                  {new Date(item.submittedAt).toLocaleDateString()}
                </p>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  {(item.message || '').substring(0, 80)}{item.message?.length > 80 ? '...' : ''}
                </p>
              </div>
            ))}
          </div>

          {/* Detail Panel */}
          {selected && (
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
              <div style={{ marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{selected.name}</h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>{selected.email} · {new Date(selected.submittedAt).toLocaleString()}</p>
                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                  <span className={`badge ${selected.type === 'Grievance' ? 'badge-danger' : 'badge-primary'}`}>{selected.type}</span>
                  {statusBadge(selected.status)}
                </div>
              </div>
              <div style={{ padding: '1rem', background: 'var(--bg-muted)', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
                <p style={{ fontSize: '0.9375rem', color: 'var(--text-primary)', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>{selected.message}</p>
              </div>
              <div>
                <label className="form-label">Update Status</label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {['New', 'In Review', 'Resolved'].map((s) => (
                    <button key={s}
                      className={`btn btn-sm ${selected.status === s ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => { handleStatusChange(selected, s); setSelected({ ...selected, status: s }); }}
                    >{s}</button>
                  ))}
                </div>
              </div>
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
                <button className="btn btn-danger btn-sm" onClick={() => { deleteItem(selected._id); setSelected(null); }}>
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FeedbackPage;
