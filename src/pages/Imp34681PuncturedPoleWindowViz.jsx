import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34652_EFLOW_ATTR_PUNCTURED_POLE_WINDOW_SLOPE } from '../data/imp-34652-eflow-attr-punctured-pole-window-slope.js';
import { ED } from '../styles/tokens.js';

const DATA = IMP34652_EFLOW_ATTR_PUNCTURED_POLE_WINDOW_SLOPE;
const { fullPoleBaseline: FULL, puncturedWindow: PUNC, nearBaseline: NEAR, farBaseline: FAR, kStar: KSTAR } = DATA;

// All slopes sit within ~3e-4 of -2.309, so plot in units of 1e-6 per k relative to
// a -2.309000 baseline for readability, matching the imp-34664 viz convention.
const BASE = -2.309;
const toUnits = (v) => (v - BASE) * 1e6;

const ROWS = [
  { label: 'Full (5 rungs)', x: 1, slope: FULL.leadingPerKSlope, se: FULL.leadingSlopeSE, dof: 2 },
  { label: 'Punctured (4 rungs)', x: 2, slope: PUNC.leadingPerKSlope, se: PUNC.leadingSlopeSE, dof: PUNC.residualDof },
];

function SlopeSeChart() {
  const svgW = 640;
  const svgH = 320;
  const padL = 60;
  const padR = 24;
  const padT = 20;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const minX = 0.4;
  const maxX = 2.6;
  const minY = toUnits(Math.min(PUNC.leadingPerKSlope - PUNC.leadingSlopeSE, NEAR.leadingPerKSlope)) - 10;
  const maxY = toUnits(Math.max(FULL.leadingPerKSlope + FULL.leadingSlopeSE, FAR.leadingPerKSlope)) + 10;

  const xAt = (x) => padL + ((x - minX) / (maxX - minX)) * cW;
  const yAt = (u) => padT + cH - ((u - minY) / (maxY - minY)) * cH;

  const nearY = yAt(toUnits(NEAR.leadingPerKSlope));
  const farY = yAt(toUnits(FAR.leadingPerKSlope));

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={nearY} x2={padL + cW} y2={nearY} stroke={ED.series1} strokeWidth={1} strokeDasharray="4,3" />
      <text x={padL + cW - 4} y={nearY - 4} textAnchor="end" fill={ED.series1} fontSize={9.5}>
        near flank {NEAR.leadingPerKSlope.toFixed(6)}
      </text>
      <line x1={padL} y1={farY} x2={padL + cW} y2={farY} stroke={ED.brassDeco} strokeWidth={1} strokeDasharray="4,3" />
      <text x={padL + cW - 4} y={farY + 12} textAnchor="end" fill={ED.brass} fontSize={9.5}>
        far flank {FAR.leadingPerKSlope.toFixed(6)}
      </text>
      {ROWS.map((r) => {
        const x = xAt(r.x);
        const yMid = yAt(toUnits(r.slope));
        const yLo = yAt(toUnits(r.slope - r.se));
        const yHi = yAt(toUnits(r.slope + r.se));
        return (
          <g key={r.label}>
            <line x1={x} y1={yLo} x2={x} y2={yHi} stroke={ED.series7} strokeWidth={1.75} />
            <line x1={x - 6} y1={yLo} x2={x + 6} y2={yLo} stroke={ED.series7} strokeWidth={1.5} />
            <line x1={x - 6} y1={yHi} x2={x + 6} y2={yHi} stroke={ED.series7} strokeWidth={1.5} />
            <circle cx={x} cy={yMid} r={5} fill={ED.series2} stroke={ED.paper} strokeWidth={0.75} />
            <text x={x} y={svgH - padB + 16} textAnchor="middle" fill={ED.inkSoft} fontSize={10.5}>
              {r.label}
            </text>
            <text x={x} y={padT + cH + 30} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
              SE={r.se.toExponential(2)}, dof={r.dof}
            </text>
          </g>
        );
      })}
      <text x={16} y={padT + cH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10} transform={`rotate(-90 16 ${padT + cH / 2})`}>
        leading per-k slope, (value &minus; ({BASE})) &times; 1e6
      </text>
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        pole-centred window: full vs AT-pole-punctured
      </text>
    </svg>
  );
}

function SeBarChart() {
  const svgW = 640;
  const svgH = 180;
  const padL = 60;
  const padR = 24;
  const padT = 20;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const maxSE = Math.max(FULL.leadingSlopeSE, PUNC.leadingSlopeSE) * 1.15;
  const barW = 90;
  const gap = 140;
  const x0 = padL + cW / 2 - gap / 2 - barW / 2;
  const x1 = padL + cW / 2 + gap / 2 - barW / 2;

  const hAt = (se) => (se / maxSE) * cH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {[FULL, PUNC].map((d, i) => {
        const x = i === 0 ? x0 : x1;
        const h = hAt(d.leadingSlopeSE);
        const y = padT + cH - h;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={h} fill={i === 0 ? ED.series1 : ED.series7} opacity={0.85} />
            <text x={x + barW / 2} y={y - 8} textAnchor="middle" fill={ED.ink} fontSize={11}>
              {d.leadingSlopeSE.toExponential(3)}
            </text>
            <text x={x + barW / 2} y={svgH - padB + 16} textAnchor="middle" fill={ED.inkSoft} fontSize={10.5}>
              {i === 0 ? 'Full (5 rungs, 2 dof)' : 'Punctured (4 rungs, 1 dof)'}
            </text>
          </g>
        );
      })}
      <text x={16} y={padT + cH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5} transform={`rotate(-90 16 ${padT + cH / 2})`}>
        slope SE (per k)
      </text>
    </svg>
  );
}

export default function Imp34681PuncturedPoleWindowViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Punctured vs Full Pole-Centred eflow_attr Window (imp-34652)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34636 fit the log-corrected eflow_attr on a 5-rung window centred exactly on the pole
        k* &asymp; {KSTAR}, where resid_exp &rarr; 0 makes eflow_attr a near-cancellation at the
        median rung. imp-34652 tested whether PUNCTURING that AT-pole rung out (leaving 4 rungs)
        sharpens the leading-slope determination. The chart below plots each window's leading slope
        &plusmn; SE (units of 1e-6 per k relative to {BASE}) against the near/far flank references,
        and the raw SE values side by side.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Leading per-k slope &plusmn; SE: full vs punctured window
      </p>
      <SlopeSeChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        Slope SE: full (5 rungs) vs punctured (4 rungs)
      </p>
      <SeBarChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Finding:</strong> puncturing the AT-pole rung does NOT
        sharpen the fit &mdash; the SE INFLATES ~{DATA.seRatioPuncOverFullPole}x ({FULL.leadingSlopeSE.toExponential(3)}
        {' '}&rarr; {PUNC.leadingSlopeSE.toExponential(3)}) because the fit loses a degree of freedom (2 &rarr; 1).
        But the puncture is diagnostically decisive: the full-pole steepening (slope steeper than both
        flanks) DISSOLVES once the AT-pole rung is removed &mdash; the punctured slope
        ({PUNC.leadingPerKSlope.toFixed(6)}) sits SHALLOWER than both the near ({NEAR.leadingPerKSlope.toFixed(6)})
        and far ({FAR.leadingPerKSlope.toFixed(6)}) flanks, confirming the single AT-pole
        near-cancellation rung &mdash; not a genuine pole kink &mdash; drove the imp-34636 outlier.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> measurement only, isRigorous false.
        Descriptive surrogate fit of the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous
        asymptotic; the C_mb GUE-conditional per imp-486 is untouched; changes no bound; establishes no
        operator positivity; imp-3066 K_a&gt;=0 untouched; no RH verdict, NO QED.
      </div>
    </div>
  );
}
