import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { HiArrowLeft } from 'react-icons/hi';
import SEO from '../components/SEO';
import Loader from '../components/Loader';

const DynamicPage = () => {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    api.get(`/pages/slug/${slug}`).then(({ data }) => {
      if (data.success) setPage(data.data);
      else setNotFound(true);
    }).catch(() => setNotFound(true)).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Loader />;

  if (notFound) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Page Not Found</h1>
        <p style={{ color: 'var(--text-tertiary)', marginBottom: '1.5rem' }}>The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn btn-primary"><HiArrowLeft /> Go Home</Link>
      </div>
    );
  }

  return (
    <div>
      <SEO title={page.title} description={page.body?.substring(0, 160)} />
      <section style={{ background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))', padding: '3.5rem 1.5rem', textAlign: 'center', color: '#fff' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: '800', fontFamily: "'Playfair Display', serif" }}>{page.title}</h1>
      </section>
      <section className="section-padding">
        <div className="container-custom" style={{ maxWidth: '800px' }}>
          <div className="card" style={{ padding: '2.5rem' }}>
            <div style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: '1.9', whiteSpace: 'pre-wrap' }}>
              {page.body}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DynamicPage;
