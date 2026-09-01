import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import {
  HiSearch, HiX, HiSpeakerphone, HiAcademicCap,
  HiDownload, HiUserGroup, HiExternalLink
} from 'react-icons/hi';

const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({
    notices: [],
    programs: [],
    downloads: [],
    faculty: [],
  });
  const navigate = useNavigate();

  // Keyboard shortcut listener (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Perform search whenever query changes
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults({ notices: [], programs: [], downloads: [], faculty: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const q = query.toLowerCase();
        const [noticesRes, programsRes, downloadsRes, facultyRes] = await Promise.allSettled([
          api.get('/notices'),
          api.get('/programs'),
          api.get('/downloads'),
          api.get('/faculty'),
        ]);

        const filteredNotices = noticesRes.status === 'fulfilled' && noticesRes.value.data.success
          ? noticesRes.value.data.data.filter(n => n.title.toLowerCase().includes(q) || n.body?.toLowerCase().includes(q)).slice(0, 4)
          : [];

        const filteredPrograms = programsRes.status === 'fulfilled' && programsRes.value.data.success
          ? programsRes.value.data.data.filter(p => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)).slice(0, 4)
          : [];

        const filteredDownloads = downloadsRes.status === 'fulfilled' && downloadsRes.value.data.success
          ? downloadsRes.value.data.data.filter(d => d.title.toLowerCase().includes(q) || d.category?.toLowerCase().includes(q)).slice(0, 4)
          : [];

        const filteredFaculty = facultyRes.status === 'fulfilled' && facultyRes.value.data.success
          ? facultyRes.value.data.data.filter(f => f.name.toLowerCase().includes(q) || f.designation?.toLowerCase().includes(q)).slice(0, 4)
          : [];

        setResults({
          notices: filteredNotices,
          programs: filteredPrograms,
          downloads: filteredDownloads,
          faculty: filteredFaculty,
        });
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const totalResults = results.notices.length + results.programs.length + results.downloads.length + results.faculty.length;

  const handleNavigate = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(10, 25, 41, 0.7)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '4rem 1rem 2rem',
      }}
      className="animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '680px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-strong)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-2xl)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '80vh',
        }}
        className="animate-scale-in"
      >
        {/* Search Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '1rem 1.25rem',
          borderBottom: '1px solid var(--border-default)',
          gap: '0.875rem',
        }}>
          <HiSearch style={{ fontSize: '1.35rem', color: 'var(--color-primary)', flexShrink: 0 }} />
          <input
            type="text"
            autoFocus
            placeholder="Search notices, programs, downloads, faculty..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              outline: 'none',
              fontSize: '1.05rem',
              fontWeight: '500',
              color: 'var(--text-primary)',
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="btn btn-ghost btn-icon"
            aria-label="Close search"
            style={{ fontSize: '1.25rem' }}
          >
            <HiX />
          </button>
        </div>

        {/* Results Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
          {query.length > 0 && query.length < 2 && (
            <p style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: '2rem 0' }}>
              Type at least 2 characters to start searching...
            </p>
          )}

          {loading && (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 0' }}>
              Searching GDC Adilpur portal...
            </p>
          )}

          {!loading && query.length >= 2 && totalResults === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <HiSearch style={{ fontSize: '2.5rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }} />
              <p style={{ fontWeight: '600', color: 'var(--text-primary)' }}>No results found for &quot;{query}&quot;</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
                Try searching for terms like &quot;F.Sc&quot;, &quot;Pre-Medical&quot;, &quot;Exam&quot;, or &quot;Admission&quot;.
              </p>
            </div>
          )}

          {!loading && totalResults > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Notices */}
              {results.notices.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-tertiary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <HiSpeakerphone /> Notices ({results.notices.length})
                  </div>
                  {results.notices.map((n) => (
                    <div
                      key={n._id}
                      onClick={() => handleNavigate('/notices')}
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-muted)',
                        marginBottom: '0.375rem',
                        cursor: 'pointer',
                        transition: 'background var(--transition-fast)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                      className="hover-card"
                    >
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{n.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Category: {n.category}</div>
                      </div>
                      <HiExternalLink style={{ color: 'var(--color-primary)' }} />
                    </div>
                  ))}
                </div>
              )}

              {/* Programs */}
              {results.programs.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-tertiary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <HiAcademicCap /> Academic Programs ({results.programs.length})
                  </div>
                  {results.programs.map((p) => (
                    <div
                      key={p._id}
                      onClick={() => handleNavigate('/programs')}
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-muted)',
                        marginBottom: '0.375rem',
                        cursor: 'pointer',
                        transition: 'background var(--transition-fast)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                      className="hover-card"
                    >
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{p.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Level: {p.level} | Duration: {p.duration}</div>
                      </div>
                      <HiExternalLink style={{ color: 'var(--color-primary)' }} />
                    </div>
                  ))}
                </div>
              )}

              {/* Downloads */}
              {results.downloads.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-tertiary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <HiDownload /> Downloads ({results.downloads.length})
                  </div>
                  {results.downloads.map((d) => (
                    <div
                      key={d._id}
                      onClick={() => {
                        onClose();
                        window.open(d.fileUrl, '_blank');
                      }}
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-muted)',
                        marginBottom: '0.375rem',
                        cursor: 'pointer',
                        transition: 'background var(--transition-fast)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                      className="hover-card"
                    >
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{d.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Category: {d.category}</div>
                      </div>
                      <HiDownload style={{ color: 'var(--color-primary)' }} />
                    </div>
                  ))}
                </div>
              )}

              {/* Faculty */}
              {results.faculty.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-tertiary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <HiUserGroup /> Faculty Members ({results.faculty.length})
                  </div>
                  {results.faculty.map((f) => (
                    <div
                      key={f._id}
                      onClick={() => handleNavigate('/departments')}
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-muted)',
                        marginBottom: '0.375rem',
                        cursor: 'pointer',
                        transition: 'background var(--transition-fast)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                      className="hover-card"
                    >
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{f.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{f.designation} ({f.qualification})</div>
                      </div>
                      <HiExternalLink style={{ color: 'var(--color-primary)' }} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Shortcut Helper */}
        <div style={{
          padding: '0.625rem 1.25rem',
          borderTop: '1px solid var(--border-default)',
          background: 'var(--bg-muted)',
          fontSize: '0.75rem',
          color: 'var(--text-tertiary)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span>Press <kbd style={{ background: 'var(--bg-surface)', padding: '0.1rem 0.4rem', borderRadius: '4px', border: '1px solid var(--border-default)' }}>ESC</kbd> to close</span>
          <span>Quick Discovery Tool • GDC Adilpur</span>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
