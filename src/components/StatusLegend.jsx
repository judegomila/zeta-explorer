import React from 'react';

// Canonical status colors for the full route map taxonomy.
// Source: full-route-map-2026-06-19.js STATUS LEGEND header.
export const STATUS_COLOR = {
  'RIGOROUS-SOTA':  { bg: 'rgba(16,185,129,0.13)',  bd: 'rgba(16,185,129,0.45)',  fg: '#4c7a4a' },
  'UNDER-EXPLORED': { bg: 'rgba(34,211,238,0.13)',  bd: 'rgba(34,211,238,0.5)',   fg: '#3f6b86' },
  'OPEN-HARD':      { bg: 'rgba(139,92,246,0.13)',  bd: 'rgba(139,92,246,0.45)',  fg: '#6d55b8' },
  'CONDITIONAL':    { bg: 'rgba(245,158,11,0.13)',  bd: 'rgba(245,158,11,0.45)',  fg: '#b58a2e' },
  'ESTIMATE':       { bg: 'rgba(59,130,246,0.13)',  bd: 'rgba(59,130,246,0.4)',   fg: '#3f6b86' },
  'RH-EQUIVALENT':  { bg: 'rgba(148,163,184,0.12)', bd: 'rgba(148,163,184,0.35)', fg: '#877b67' },
  'DEAD-END-FORNOW':       { bg: 'rgba(239,68,68,0.10)',   bd: 'rgba(239,68,68,0.35)',   fg: '#c23a1c' },
  'REFUTED':        { bg: 'rgba(194,58,28,0.12)',   bd: 'rgba(239,68,68,0.5)',    fg: '#c23a1c' },
};

const STATUS_DESC = {
  'RIGOROUS-SOTA':  'unconditionally established (the floor we stand on)',
  'CONDITIONAL':    'rigorous modulo a named unproven input',
  'ESTIMATE':       'numerical only — not a rigorous bound',
  'OPEN-HARD':      'genuine open problem, not a reformulation',
  'RH-EQUIVALENT':  'faithful reformulation — renames RH, no shortcut',
  'DEAD-END-FORNOW':       'structurally closed',
  'REFUTED':        'caught overclaim, withdrawn',
  'UNDER-EXPLORED': 'genuine unexploited thread remains',
};

export function StatusTag({ status }) {
  const c = STATUS_COLOR[status] || STATUS_COLOR['ESTIMATE'];
  return (
    <span style={{
      display: 'inline-block', padding: '2px 8px', borderRadius: 4,
      background: c.bg, border: `1px solid ${c.bd}`, color: c.fg,
      fontSize: 10.5, fontWeight: 700, fontFamily: 'var(--font-mono, monospace)',
      letterSpacing: '0.02em', whiteSpace: 'nowrap',
    }}>{status}</span>
  );
}

export function StatusLegend({ statuses }) {
  const keys = statuses || Object.keys(STATUS_COLOR);
  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', gap: 10,
      padding: '10px 14px',
      background: 'transparent',
      border: '1px solid var(--border, #1e293b)',
      borderRadius: 8,
    }}>
      <span style={{
        fontFamily: 'var(--font-mono, monospace)', fontSize: 11,
        color: '#877b67', alignSelf: 'center', marginRight: 4,
      }}>
        STATUS LEGEND:
      </span>
      {keys.map(key => {
        const c = STATUS_COLOR[key];
        if (!c) return null;
        return (
          <span key={key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <StatusTag status={key} />
            <span style={{ fontSize: 11, color: '#877b67' }}>{STATUS_DESC[key] || ''}</span>
          </span>
        );
      })}
    </div>
  );
}
