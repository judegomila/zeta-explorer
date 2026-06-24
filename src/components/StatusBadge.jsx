import React from 'react';

const LEVEL_COLORS = {
  rigorous:    { bg: 'rgba(16,185,129,0.15)',  border: 'rgba(16,185,129,0.35)',  text: '#10b981',  label: 'RIGOROUS' },
  conditional: { bg: 'rgba(245,158,11,0.15)',  border: 'rgba(245,158,11,0.35)',  text: '#f59e0b',  label: 'CONDITIONAL' },
  estimate:    { bg: 'rgba(59,130,246,0.15)',   border: 'rgba(59,130,246,0.35)',  text: '#60a5fa',  label: 'ESTIMATE' },
  'dead-end':  { bg: 'rgba(239,68,68,0.12)',    border: 'rgba(239,68,68,0.35)',   text: '#f87171',  label: 'DEAD-END' },
  refuted:     { bg: 'rgba(127,29,29,0.25)',    border: 'rgba(239,68,68,0.5)',    text: '#fca5a5',  label: 'REFUTED' },
  rh_equiv:    { bg: 'rgba(148,163,184,0.12)',  border: 'rgba(148,163,184,0.35)', text: '#94a3b8',  label: 'RH-EQUIVALENT' },
};

/**
 * Shared inline badge for page-level honest-status labeling.
 * level: "rigorous" | "conditional" | "estimate" | "dead-end" | "refuted" | "rh_equiv"
 * children: optional custom label text (overrides default)
 */
export function StatusBadge({ level, children }) {
  const c = LEVEL_COLORS[level] || LEVEL_COLORS.estimate;
  return (
    <span style={{
      display: 'inline-block', padding: '2px 8px', borderRadius: 4,
      background: c.bg, border: `1px solid ${c.border}`, color: c.text,
      fontSize: 10.5, fontWeight: 700, fontFamily: 'var(--font-mono, monospace)',
      letterSpacing: '0.04em', whiteSpace: 'nowrap', verticalAlign: 'middle',
    }}>
      {children || c.label}
    </span>
  );
}

/**
 * Honest callout block — a bordered paragraph for anti-overclaim disclosures.
 * level: same as StatusBadge
 * title: bold header (optional)
 * children: callout body text
 */
export function HonestCallout({ level, title, children }) {
  const c = LEVEL_COLORS[level] || LEVEL_COLORS.estimate;
  return (
    <div style={{
      padding: '10px 14px',
      background: c.bg,
      border: `1px solid ${c.border}`,
      borderRadius: 6,
      marginBottom: 12,
    }}>
      {title && (
        <div style={{
          fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono, monospace)',
          color: c.text, marginBottom: 4, letterSpacing: '0.03em',
        }}>
          {title}
        </div>
      )}
      <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.55 }}>
        {children}
      </div>
    </div>
  );
}
