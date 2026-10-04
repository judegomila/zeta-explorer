import React from 'react';
import { ED, alpha, TINT } from '../styles/tokens.js';

const LEVEL_COLORS = {
  rigorous:    { bg: alpha(ED.series3, 0.15),  border: alpha(ED.series3, 0.35),  text: ED.series3,  label: 'RIGOROUS' },
  conditional: { bg: alpha(ED.brassDeco, 0.15),  border: alpha(ED.brassDeco, 0.35),  text: ED.brass,  label: 'CONDITIONAL' },
  estimate:    { bg: alpha(ED.series1, 0.15),   border: alpha(ED.series1, 0.35),  text: ED.series1,  label: 'ESTIMATE' },
  'dead-end-fornow':  { bg: alpha(ED.series2, 0.12),    border: alpha(ED.series2, 0.35),   text: ED.series2,  label: 'DEAD-END-FORNOW' },
  refuted:     { bg: alpha(TINT.terra, 0.25),    border: alpha(ED.series2, 0.5),    text: ED.series2,  label: 'REFUTED' },
  rh_equiv:    { bg: alpha(ED.inkSoft, 0.12),  border: alpha(ED.rule, 0.35), text: ED.inkSoft,  label: 'RH-EQUIVALENT' },
};

/**
 * Shared inline badge for page-level status labeling.
 * level: "rigorous" | "conditional" | "estimate" | "dead-end-fornow" | "refuted" | "rh_equiv"
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
 * callout block — a bordered paragraph for anti-overclaim disclosures.
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
      <div style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.55 }}>
        {children}
      </div>
    </div>
  );
}
