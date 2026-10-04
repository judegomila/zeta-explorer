import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { CERTIFIED_SLICE, WINDOW_WIDTH_U } from '../data/imp-95213-tier-certifier-build.js';
import { FULLWINDOW_RUN_DECISION } from '../data/imp-95238-fullwindow-run-decision.js';
import { ED } from '../styles/tokens.js';

// Figures baked verbatim from the imp-95213 CERTIFIED_SLICE / WINDOW_WIDTH_U
// literals and the imp-95238 windowsBeyondWindow1Untouched literal; no new
// computation is performed here (viz/UX only).
const CERTIFIED_Q_UNITS = CERTIFIED_SLICE.uHi - CERTIFIED_SLICE.uLo; // 800
const CERTIFIED_FRACTION_OF_WINDOW1 = CERTIFIED_Q_UNITS / WINDOW_WIDTH_U; // 0.058%
const TOTAL_WINDOWS = 1 + FULLWINDOW_RUN_DECISION.windowsBeyondWindow1Untouched; // 54,109,012

function CoverageBar({ fraction, label }) {
  const svgW = 640;
  const barH = 40;
  const padT = 24;
  const padB = 44;
  const svgH = padT + barH + padB;
  const pctWidth = Math.max(fraction * svgW, 1.5); // floor so the sliver stays visible

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={0} y={padT} width={svgW} height={barH} fill={ED.paper} rx={3} />
      <rect x={0} y={padT} width={pctWidth} height={barH} fill={ED.series1} opacity={0.9} rx={3} />
      <text x={8} y={padT + barH / 2 + 4} fill={ED.ink} fontSize={11} fontWeight={700}>
        {label}
      </text>
      <text x={svgW - 8} y={padT + barH + 18} textAnchor="end" fill={ED.inkFaint} fontSize={10}>
        {(fraction * 100).toFixed(3)}% of window 1
      </text>
    </svg>
  );
}

export default function Imp95278Window1CoverageBarViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Window-1 Coverage: 800 of 1,381,977 q-units Certified (imp-95278 / imp-95213)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-95213 tier-P/B/S certifier produced the Gate-2 program&rsquo;s first
        continuum-certified statement: {CERTIFIED_Q_UNITS} of {WINDOW_WIDTH_U.toLocaleString()}{' '}
        q-units of window 1 ({(CERTIFIED_FRACTION_OF_WINDOW1 * 100).toFixed(3)}%), both seam
        charts. Zoomed out to the full Gate-2 family, that certified slice is a sliver of a
        sliver: window 1 is one window of {TOTAL_WINDOWS.toLocaleString()}, so{' '}
        {FULLWINDOW_RUN_DECISION.windowsBeyondWindow1Untouched.toLocaleString()} windows beyond
        window 1 stay untouched regardless.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Certified slice within window 1
      </h3>
      <CoverageBar
        fraction={CERTIFIED_FRACTION_OF_WINDOW1}
        label={`${CERTIFIED_Q_UNITS} / ${WINDOW_WIDTH_U.toLocaleString()} q-units`}
      />

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '1.5rem 0 0.5rem' }}>
        Window 1 within the full Gate-2 window family
      </h3>
      <CoverageBar fraction={1 / TOTAL_WINDOWS} label={`1 / ${TOTAL_WINDOWS.toLocaleString()} windows`} />

      <div
        style={{
          marginTop: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page reusing the imp-95213
        CERTIFIED_SLICE / WINDOW_WIDTH_U literals and the imp-95238
        windowsBeyondWindow1Untouched literal verbatim (no new computation). The certified slice
        sets no G5 window-promotion flag and changes no bound. Platt&ndash;Trudgian &Lambda; &le;
        0.2 remains SOTA. No QED.
      </div>
    </div>
  );
}
