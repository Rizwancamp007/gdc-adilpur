import { useState, useEffect } from 'react';
import api from '../utils/api';
import SEO from '../components/SEO';
import Loader from '../components/Loader';
import { HiStar } from 'react-icons/hi';

const SuccessStoriesPage = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/success-stories?limit=100').then(({ data }) => {
      if (data.success) setStories(data.data || []);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <SEO title="Success Stories" description="Read inspiring success stories of GDC Adilpur alumni and students." />
      <section style={{ background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))', padding: '3.5rem 1.5rem', textAlign: 'center', color: '#fff' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: '800', fontFamily: "'Playfair Display', serif", marginBottom: '0.5rem' }}>Success Stories</h1>
        <p style={{ color: 'rgba(255,255,255,0.8)' }}>Our students, our pride</p>
      </section>
      <section className="section-padding">
        <div className="container-custom">
          {loading ? (
            <Loader />
          ) : stories.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-tertiary)' }}>No success stories yet.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {stories.map((story, idx) => (
                <div key={story._id} className="card" style={{ textAlign: 'center', animationDelay: `${idx * 0.08}s` }}>
                  <div className="card-body" style={{ padding: '2.5rem 1.5rem' }}>
                    {story.photoUrl ? (
                      <img src={story.photoUrl} alt={story.studentName} style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 1.25rem', border: '3px solid var(--color-accent)', boxShadow: 'var(--shadow-md)' }} />
                    ) : (
                      <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--bg-muted)', margin: '0 auto 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <HiStar style={{ fontSize: '2.5rem', color: 'var(--color-accent)' }} />
                      </div>
                    )}
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.375rem' }}>{story.studentName}</h3>
                    {story.year && <span className="badge badge-info" style={{ marginBottom: '0.75rem', display: 'inline-flex' }}>{story.year}</span>}
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.7', marginTop: '0.5rem' }}>{story.achievement}</p>
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

export default SuccessStoriesPage;

