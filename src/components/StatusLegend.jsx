import React from 'react';

// Canonical status colors for the full route map taxonomy.
// Source: full-route-map-2026-06-19.js STATUS LEGEND header.
export const STATUS_COLOR = {
  'RIGOROUS-SOTA':  { bg: 'rgba(16,185,129,0.13)',  bd: 'rgba(16,185,129,0.45)',  fg: '#10b981' },
  'UNDER-EXPLORED': { bg: 'rgba(34,211,238,0.13)',  bd: 'rgba(34,211,238,0.5)',   fg: '#22d3ee' },
  'OPEN-HARD':      { bg: 'rgba(139,92,246,0.13)',  bd: 'rgba(139,92,246,0.45)',  fg: '#a78bfa' },
  'CONDITIONAL':    { bg: 'rgba(245,158,11,0.13)',  bd: 'rgba(245,158,11,0.45)',  fg: '#f59e0b' },
  'ESTIMATE':       { bg: 'rgba(59,130,246,0.13)',  bd: 'rgba(59,130,246,0.4)',   fg: '#60a5fa' },
  'RH-EQUIVALENT':  { bg: 'rgba(148,163,184,0.12)', bd: 'rgba(148,163,184,0.35)', fg: '#94a3b8' },
  'DEAD-END':       { bg: 'rgba(239,68,68,0.10)',   bd: 'rgba(239,68,68,0.35)',   fg: '#f87171' },
  'REFUTED':        { bg: 'rgba(127,29,29,0.25)',   bd: 'rgba(239,68,68,0.5)',    fg: '#fca5a5' },
};

const STATUS_DESC = {
  'RIGOROUS-SOTA':  'unconditionally established (the floor we stand on)',
  'CONDITIONAL':    'rigorous modulo a named unproven input',
  'ESTIMATE':       'numerical only — not a rigorous bound',
  'OPEN-HARD':      'genuine open problem, not a reformulation',
  'RH-EQUIVALENT':  'faithful reformulation — renames RH, no shortcut',
  'DEAD-END':       'structurally closed',
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
      background: 'rgba(15,23,42,0.6)',
      border: '1px solid var(--border, #1e293b)',
      borderRadius: 8,
    }}>
      <span style={{
        fontFamily: 'var(--font-mono, monospace)', fontSize: 11,
        color: '#64748b', alignSelf: 'center', marginRight: 4,
      }}>
        STATUS LEGEND:
      </span>
      {keys.map(key => {
        const c = STATUS_COLOR[key];
        if (!c) return null;
        return (
          <span key={key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <StatusTag status={key} />
            <span style={{ fontSize: 11, color: '#64748b' }}>{STATUS_DESC[key] || ''}</span>
          </span>
        );
      })}
    </div>
  );
}
