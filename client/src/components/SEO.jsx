import { useEffect } from 'react';

/**
 * Lightweight SEO component — sets document title and meta description.
 * No external dependency needed (no react-helmet).
 */
const SEO = ({ title, description }) => {
  useEffect(() => {
    const base = 'GDC Adilpur';
    document.title = title ? `${title} | ${base}` : `${base} — Government Degree College Adilpur`;

    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'description';
        document.head.appendChild(meta);
      }
      meta.content = description;
    }
  }, [title, description]);

  return null;
};

export default SEO;
