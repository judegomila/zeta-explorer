import React from 'react';
import { ED, alpha } from '../styles/tokens.js';

// Canonical status colors for the full route map taxonomy.
// Source: full-route-map-2026-06-19.js STATUS LEGEND header.
export const STATUS_COLOR = {
  'RIGOROUS-SOTA':  { bg: alpha(ED.series3, 0.13),  bd: alpha(ED.series3, 0.45),  fg: ED.series3 },
  'UNDER-EXPLORED': { bg: alpha(ED.series6, 0.13),  bd: alpha(ED.series6, 0.5),   fg: ED.series1 },
  'OPEN-HARD':      { bg: alpha(ED.series5, 0.13),  bd: alpha(ED.series5, 0.45),  fg: ED.series5 },
  'CONDITIONAL':    { bg: alpha(ED.brassDeco, 0.13),  bd: alpha(ED.series4, 0.45),  fg: ED.brass },
  'ESTIMATE':       { bg: alpha(ED.series1, 0.13),  bd: alpha(ED.series1, 0.4),   fg: ED.series1 },
  'RH-EQUIVALENT':  { bg: alpha(ED.inkSoft, 0.12), bd: alpha(ED.series8, 0.35), fg: ED.inkFaint },
  'DEAD-END-FORNOW':       { bg: alpha(ED.series2, 0.1),   bd: alpha(ED.series2, 0.35),   fg: ED.accent },
  'REFUTED':        { bg: alpha(ED.series2, 0.12),   bd: alpha(ED.series2, 0.5),    fg: ED.accent },
};

const STATUS_DESC = {
  'RIGOROUS-SOTA':  'unconditionally established (the floor we stand on)',
  'CONDITIONAL':    'rigorous modulo a named unproven input',
  'ESTIMATE':       'numerical only — not a rigorous bound',
  'OPEN-HARD':      'genuine open problem, not a reformulation',
  'RH-EQUIVALENT':  'faithful reformulation — renames RH, no shortcut',
  'DEAD-END-FORNOW':       'structurally closed',
  'REFUTED':        'caught overclaim, withdrawn',
  'UNDER-EXPLORED': 'genuine untapped thread remains',
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
        color: 'var(--ink-faint)', alignSelf: 'center', marginRight: 4,
      }}>
        STATUS LEGEND:
      </span>
      {keys.map(key => {
        const c = STATUS_COLOR[key];
        if (!c) return null;
        return (
          <span key={key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <StatusTag status={key} />
            <span style={{ fontSize: 11, color: 'var(--ink-faint)' }}>{STATUS_DESC[key] || ''}</span>
          </span>
        );
      })}
    </div>
  );
}
