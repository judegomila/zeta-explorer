import React from 'react';
import { Link } from 'react-router-dom';

export default function RelatedLinks({ links }) {
  if (!links || links.length === 0) return null;
  return (
    <div className="card" style={{ marginTop: 24, background: 'color-mix(in srgb, var(--series-1) 4%, transparent)' }}>
      <h3 style={{ color: 'var(--ink-faint)', fontSize: 13, marginBottom: 10 }}>Related Pages</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {links.map((link, i) => (
          <React.Fragment key={link.to}>
            {i > 0 && <span style={{ color: 'var(--ink-soft)' }}>|</span>}
            <Link to={link.to} style={{ color: link.color || 'var(--series-1)', fontSize: 13 }}>
              {link.label}
            </Link>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
