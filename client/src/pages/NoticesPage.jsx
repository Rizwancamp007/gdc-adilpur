import { useState, useEffect } from 'react';
import api from '../utils/api';
import SEO from '../components/SEO';
import Loader from '../components/Loader';
import { HiSearch, HiDocumentText, HiDownload } from 'react-icons/hi';

const categories = ['All', 'General', 'Academic', 'Examination', 'Admission', 'Administrative', 'Other'];

const NoticesPage = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    api.get('/notices?isActive=true&limit=100').then(({ data }) => {
      if (data.success) setNotices(data.data || []);
    }).finally(() => setLoading(false));
  }, []);

  const filtered = notices.filter((n) => {
    const matchSearch = !search || n.title.toLowerCase().includes(search.toLowerCase()) || (n.body || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || n.category === category;
    return matchSearch && matchCat;
  });

  // Sort: pinned first, then by date
  const sorted = [...filtered].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.publishDate || b.createdAt) - new Date(a.publishDate || a.createdAt);
  });

  return (
    <div>
      <SEO title="Notices" description="Official notices and announcements from Government Degree College Adilpur." />
      <section style={{ background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))', padding: '3.5rem 1.5rem', textAlign: 'center', color: '#fff' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: '800', fontFamily: "'Playfair Display', serif", marginBottom: '0.5rem' }}>Notices & Announcements</h1>
        <p style={{ color: 'rgba(255,255,255,0.8)' }}>Stay updated with the latest from GDC Adilpur</p>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          {/* Search + Filter */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: '1 1 300px' }}>
              <HiSearch style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input className="form-input" placeholder="Search notices..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: '2.5rem' }} />
            </div>
            <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
              {categories.map((cat) => (
                <button key={cat}
                  className={`btn btn-sm ${category === cat ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setCategory(cat)}
                >{cat}</button>
              ))}
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-tertiary)' }}>Loading notices...</div>
          ) : sorted.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-tertiary)' }}>No notices found.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {sorted.map((notice, idx) => (
                <div key={notice._id} className="card" style={{ animationDelay: `${idx * 0.05}s`, borderLeft: notice.isPinned ? '4px solid var(--color-accent)' : 'none' }}>
                  <div className="card-body" style={{ padding: '1.5rem 2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                          {notice.isPinned && <span className="badge badge-warning"> Pinned</span>}
                          <span className="badge badge-primary">{notice.category}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {notice.publishDate ? new Date(notice.publishDate).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
                          </span>
                        </div>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{notice.title}</h3>
                        {notice.body && <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>{notice.body}</p>}
                      </div>
                      {notice.attachmentUrl && (
                        <a href={notice.attachmentUrl} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm" style={{ flexShrink: 0 }}>
                          <HiDownload /> PDF
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default NoticesPage;

