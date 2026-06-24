import React from 'react';
import { Link } from 'react-router-dom';

export default function RelatedLinks({ links }) {
  if (!links || links.length === 0) return null;
  return (
    <div className="card" style={{ marginTop: 24, background: 'rgba(59,130,246,0.04)' }}>
      <h3 style={{ color: '#64748b', fontSize: 13, marginBottom: 10 }}>Related Pages</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {links.map((link, i) => (
          <React.Fragment key={link.to}>
            {i > 0 && <span style={{ color: '#334155' }}>|</span>}
            <Link to={link.to} style={{ color: link.color || '#3b82f6', fontSize: 13 }}>
              {link.label}
            </Link>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
