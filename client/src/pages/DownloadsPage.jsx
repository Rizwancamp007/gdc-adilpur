import { useState, useEffect } from 'react';
import api from '../utils/api';
import SEO from '../components/SEO';
import Loader from '../components/Loader';
import { HiDownload } from 'react-icons/hi';

const categories = ['All', 'Form', 'Policy', 'Prospectus', 'Other'];

const DownloadsPage = () => {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');

  useEffect(() => {
    api.get('/downloads?isActive=true&limit=100').then(({ data }) => {
      if (data.success) setDownloads(data.data || []);
    }).finally(() => setLoading(false));
  }, []);

  const filtered = category === 'All' ? downloads : downloads.filter((d) => d.category === category);

  return (
    <div>
      <SEO title="Downloads" description="Download forms, policies, and documents from GDC Adilpur." />
      <section style={{ background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))', padding: '3.5rem 1.5rem', textAlign: 'center', color: '#fff' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: '800', fontFamily: "'Playfair Display', serif", marginBottom: '0.5rem' }}>Downloads</h1>
        <p style={{ color: 'rgba(255,255,255,0.8)' }}>Forms, policies, prospectus, and other documents</p>
      </section>
      <section className="section-padding">
        <div className="container-custom">
          <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button key={cat} className={`btn btn-sm ${category === cat ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setCategory(cat)}>{cat}</button>
            ))}
          </div>
          {loading ? (
            <Loader />
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-tertiary)' }}>No downloads available.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
              {filtered.map((dl, idx) => (
                <a key={dl._id} href={dl.fileUrl} target="_blank" rel="noreferrer" className="card" style={{ textDecoration: 'none', animationDelay: `${idx * 0.05}s` }}>
                  <div className="card-body" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'var(--color-danger-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <HiDownload style={{ fontSize: '1.25rem', color: 'var(--color-danger)' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ fontSize: '0.9375rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{dl.title}</h3>
                      <span className="badge badge-info">{dl.category}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default DownloadsPage;

