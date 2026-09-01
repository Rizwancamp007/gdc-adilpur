import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { HiClipboardList, HiChevronLeft, HiChevronRight } from 'react-icons/hi';

const actionBadge = (action) => {
  const map = { create: 'badge-success', update: 'badge-info', delete: 'badge-danger', login: 'badge-primary', logout: 'badge-warning' };
  return <span className={`badge ${map[action] || 'badge-primary'}`} style={{ textTransform: 'capitalize' }}>{action}</span>;
};

const ActivityLogPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => { fetchLogs(); }, [page]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/activity-log?page=${page}&limit=30`);
      if (data.success) { setLogs(data.data); setPages(data.pages); setTotal(data.total); }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <HiClipboardList style={{ fontSize: '1.5rem', color: 'var(--color-primary)' }} />
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>Activity Log</h1>
        <span className="badge badge-primary">{total} entries</span>
      </div>

      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>Loading...</div>
        ) : logs.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>No activity recorded yet.</div>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-default)' }}>
                    {['Time', 'User', 'Action', 'Module', 'Description'].map((h) => (
                      <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.04em', background: 'var(--bg-muted)', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--text-tertiary)', whiteSpace: 'nowrap', fontSize: '0.8125rem' }}>
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: '500', color: 'var(--text-primary)' }}>{log.userName || '—'}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>{actionBadge(log.action)}</td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>{log.collectionName || '—'}</td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{log.description || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {pages > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', borderTop: '1px solid var(--border-default)', fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>
                <span>Page {page} of {pages}</span>
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  <button className="btn btn-ghost btn-sm btn-icon" disabled={page <= 1} onClick={() => setPage(page - 1)}><HiChevronLeft /></button>
                  <button className="btn btn-ghost btn-sm btn-icon" disabled={page >= pages} onClick={() => setPage(page + 1)}><HiChevronRight /></button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ActivityLogPage;
