import React from 'react';

export default function FreshnessBanner({ date, note }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '6px 14px',
      borderRadius: 6,
      marginBottom: 20,
      background: 'rgba(148,163,184,0.06)',
      border: '1px solid rgba(148,163,184,0.12)',
      fontSize: 11,
      fontFamily: 'var(--font-mono)',
      color: '#64748b',
    }}>
      <span style={{ color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Data snapshot
      </span>
      <span style={{ color: '#334155', fontWeight: 600 }}>{date}</span>
      {note && (
        <>
          <span style={{ color: '#334155', opacity: 0.4 }}>·</span>
          <span>{note}</span>
        </>
      )}
    </div>
  );
}
