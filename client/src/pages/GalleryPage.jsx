import { useState, useEffect } from 'react';
import api from '../utils/api';
import SEO from '../components/SEO';
import Loader from '../components/Loader';
import { HiX, HiChevronLeft, HiChevronRight, HiPhotograph, HiFilm } from 'react-icons/hi';

const GalleryPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  useEffect(() => {
    api.get('/gallery?limit=200').then(({ data }) => {
      if (data.success) setItems(data.data || []);
    }).finally(() => setLoading(false));
  }, []);

  const eventCategories = ['All', ...new Set(items.map((i) => i.eventCategory).filter(Boolean))];
  const filtered = filter === 'All' ? items : items.filter((i) => i.eventCategory === filter);

  const openLightbox = (idx) => setLightboxIndex(idx);
  const closeLightbox = () => setLightboxIndex(-1);
  const prevImage = () => setLightboxIndex((p) => (p - 1 + filtered.length) % filtered.length);
  const nextImage = () => setLightboxIndex((p) => (p + 1) % filtered.length);

  return (
    <div>
      <SEO title="Gallery" description="Photo and video gallery of events and activities at GDC Adilpur." />
      <section style={{ background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))', padding: '3.5rem 1.5rem', textAlign: 'center', color: '#fff' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: '800', fontFamily: "'Playfair Display', serif", marginBottom: '0.5rem' }}>Gallery</h1>
        <p style={{ color: 'rgba(255,255,255,0.8)' }}>Capturing moments at GDC Adilpur</p>
      </section>
      <section className="section-padding">
        <div className="container-custom">
          {eventCategories.length > 1 && (
            <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              {eventCategories.map((cat) => (
                <button key={cat} className={`btn btn-sm ${filter === cat ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilter(cat)}>{cat}</button>
              ))}
            </div>
          )}
          {loading ? (
            <Loader />
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-tertiary)' }}>No gallery items yet.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
              {filtered.map((item, idx) => (
                <div key={item._id} onClick={() => item.mediaType === 'image' && openLightbox(idx)}
                  style={{
                    position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-lg)',
                    cursor: item.mediaType === 'image' ? 'pointer' : 'default',
                    aspectRatio: '4/3', border: '1px solid var(--border-default)',
                    transition: 'all var(--transition-base)',
                  }}
                  className="card"
                >
                  {item.mediaType === 'image' ? (
                    <img src={item.mediaUrl} alt={item.caption || 'Gallery'} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-muted)' }}>
                      <a href={item.mediaUrl} target="_blank" rel="noreferrer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', textDecoration: 'none' }}>
                        <HiFilm style={{ fontSize: '2rem' }} />
                        <span style={{ fontSize: '0.875rem' }}>Watch Video</span>
                      </a>
                    </div>
                  )}
                  {(item.caption || item.eventCategory) && (
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', padding: '1.5rem 0.75rem 0.75rem', color: '#fff' }}>
                      {item.caption && <p style={{ fontSize: '0.8125rem', fontWeight: '500' }}>{item.caption}</p>}
                      {item.eventCategory && <p style={{ fontSize: '0.6875rem', opacity: 0.8, marginTop: '0.125rem' }}>{item.eventCategory}</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex >= 0 && filtered[lightboxIndex] && (
        <div onClick={closeLightbox} style={{
          position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.92)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
        }}>
          <button onClick={(e) => { e.stopPropagation(); closeLightbox(); }} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#fff', fontSize: '2rem', cursor: 'pointer', zIndex: 210 }}><HiX /></button>
          <button onClick={(e) => { e.stopPropagation(); prevImage(); }} style={{ position: 'absolute', left: '1rem', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><HiChevronLeft /></button>
          <img src={filtered[lightboxIndex].mediaUrl} alt={filtered[lightboxIndex].caption || ''} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: 'var(--radius-md)' }} />
          <button onClick={(e) => { e.stopPropagation(); nextImage(); }} style={{ position: 'absolute', right: '1rem', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><HiChevronRight /></button>
          {filtered[lightboxIndex].caption && (
            <div style={{ position: 'absolute', bottom: '1.5rem', textAlign: 'center', color: '#fff', fontSize: '0.9375rem' }}>{filtered[lightboxIndex].caption}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default GalleryPage;

