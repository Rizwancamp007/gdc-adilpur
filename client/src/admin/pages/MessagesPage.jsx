import { useState } from 'react';
import useCrud from '../../hooks/useCrud';
import toast from 'react-hot-toast';
import { HiMail, HiMailOpen, HiTrash } from 'react-icons/hi';

const MessagesPage = () => {
  const { data, loading, updateItem, deleteItem } = useCrud('/contact-messages');
  const [selected, setSelected] = useState(null);

  const handleMarkRead = async (item) => {
    try {
      await updateItem(item._id, { status: item.status === 'Read' ? 'Unread' : 'Read' });
      if (selected?._id === item._id) setSelected({ ...item, status: item.status === 'Read' ? 'Unread' : 'Read' });
    } catch { toast.error('Failed'); }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <HiMail style={{ fontSize: '1.5rem', color: 'var(--color-primary)' }} />
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>Contact Messages</h1>
        {data.filter((m) => m.status === 'Unread').length > 0 && (
          <span className="badge badge-warning">{data.filter((m) => m.status === 'Unread').length} unread</span>
        )}
      </div>

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>Loading...</div>
      ) : data.length === 0 ? (
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', padding: '3rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
          No messages received yet.
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: selected ? '1fr 1fr' : '1fr' }}>
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            {data.map((item) => (
              <div key={item._id} onClick={() => { setSelected(item); if (item.status === 'Unread') handleMarkRead(item); }}
                style={{
                  padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-light)',
                  cursor: 'pointer', transition: 'background var(--transition-fast)',
                  background: selected?._id === item._id ? 'var(--color-primary-50)' : 'transparent',
                  borderLeft: item.status === 'Unread' ? '3px solid var(--color-primary)' : '3px solid transparent',
                }}
                onMouseEnter={(e) => { if (selected?._id !== item._id) e.currentTarget.style.background = 'var(--bg-surface-hover)'; }}
                onMouseLeave={(e) => { if (selected?._id !== item._id) e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: item.status === 'Unread' ? '700' : '500', fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{item.name}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(item.submittedAt).toLocaleDateString()}</span>
                </div>
                {item.subject && <p style={{ fontSize: '0.8125rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.125rem' }}>{item.subject}</p>}
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>
                  {(item.message || '').substring(0, 70)}{item.message?.length > 70 ? '...' : ''}
                </p>
              </div>
            ))}
          </div>

          {selected && (
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{selected.name}</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', marginBottom: '0.25rem' }}>
                {selected.email}{selected.phone ? ` · ${selected.phone}` : ''} · {new Date(selected.submittedAt).toLocaleString()}
              </p>
              {selected.subject && <p style={{ fontSize: '0.9375rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Subject: {selected.subject}</p>}
              <div style={{ padding: '1rem', background: 'var(--bg-muted)', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.9375rem', color: 'var(--text-primary)', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>{selected.message}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-outline btn-sm" onClick={() => handleMarkRead(selected)}>
                  {selected.status === 'Read' ? <><HiMail /> Mark Unread</> : <><HiMailOpen /> Mark Read</>}
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => { deleteItem(selected._id); setSelected(null); }}>
                  <HiTrash /> Delete
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MessagesPage;
