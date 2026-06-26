import React from 'react';

/**
 * Compact inline freshness badge for page headers.
 * Use FreshnessBanner for full-width strip; use this for inline/header placement.
 */
export default function FreshnessStamp({ date, note }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      padding: '3px 8px',
      borderRadius: 4,
      background: 'rgba(148,163,184,0.06)',
      border: '1px solid rgba(148,163,184,0.15)',
      fontSize: 10,
      fontFamily: 'var(--font-mono)',
      color: '#64748b',
      verticalAlign: 'middle',
      lineHeight: 1.4,
    }}>
      <span style={{ opacity: 0.65, textTransform: 'uppercase', letterSpacing: '0.04em' }}>snapshot</span>
      <span style={{ color: '#94a3b8', fontWeight: 600 }}>{date}</span>
      {note && <><span style={{ opacity: 0.4 }}>·</span><span style={{ opacity: 0.7 }}>{note}</span></>}
    </span>
  );
}
