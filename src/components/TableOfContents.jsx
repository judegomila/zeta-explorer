import React from 'react';

/**
 * Reusable sticky table of contents for long single-column reference pages.
 * sections: [{ id: string, label: string }]
 */
export default function TableOfContents({ sections, title = 'Contents' }) {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="docs-toc">
      <h3>{title}</h3>
      <div className="docs-toc-links">
        {sections.map(s => (
          <a key={s.id} onClick={() => scrollTo(s.id)} style={{ cursor: 'pointer' }}>
            {s.label}
          </a>
        ))}
      </div>
    </div>
  );
}
