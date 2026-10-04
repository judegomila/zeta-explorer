import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34645_EFLOW_ATTR_POLE_WINDOW_WIDEN_SE } from '../data/imp-34645-eflow-attr-pole-window-widen-se.js';
import { IMP34636_POLE_CENTROID_K } from '../data/imp-34636-eflow-attr-pole-centred-window-slope.js';
import { ED } from '../styles/tokens.js';

const DATA = IMP34645_EFLOW_ATTR_POLE_WINDOW_WIDEN_SE;
const { w5Baseline: W5, w7Window: W7, w9Window: W9, nearBaseline: NEAR, farBaseline: FAR, kStar: KSTAR } = DATA;

// Slope values are all within ~2.6e-4 of each other around -2.309, so plot in units of
// 1e-6 per k relative to a -2.309000 baseline for readability.
const BASE = -2.309;
const toUnits = (v) => (v - BASE) * 1e6;

const ROWS = [
  { label: 'W5', rungs: 5, slope: W5.leadingPerKSlope, se: W5.leadingSlopeSE, sigma: W5.departureSigma },
  { label: 'W7', rungs: 7, slope: W7.leadingPerKSlope, se: W7.leadingSlopeSE, sigma: W7.departureSigma },
  { label: 'W9', rungs: 9, slope: W9.leadingPerKSlope, se: W9.leadingSlopeSE, sigma: W9.departureSigma },
];

const CENTROID_ROWS = [
  { label: 'W5', rungs: 5, centroidK: IMP34636_POLE_CENTROID_K },
  { label: 'W7', rungs: 7, centroidK: W7.centroidK },
  { label: 'W9', rungs: 9, centroidK: W9.centroidK },
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

  const minX = 4;
  const maxX = 10;
  const minY = toUnits(Math.min(W5.leadingPerKSlope - W5.leadingSlopeSE, FAR.leadingPerKSlope)) - 10;
  const maxY = toUnits(Math.max(W5.leadingPerKSlope + W5.leadingSlopeSE, NEAR.leadingPerKSlope)) + 10;

  const xAt = (rungs) => padL + ((rungs - minX) / (maxX - minX)) * cW;
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
        const x = xAt(r.rungs);
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
              {r.sigma.toFixed(3)}&sigma;
            </text>
          </g>
        );
      })}
      <text x={16} y={padT + cH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10} transform={`rotate(-90 16 ${padT + cH / 2})`}>
        leading per-k slope, (value &minus; ({BASE})) &times; 1e6
      </text>
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        symmetric pole-centred window width (rungs)
      </text>
    </svg>
  );
}

function CentroidDriftChart() {
  const svgW = 640;
  const svgH = 200;
  const padL = 60;
  const padR = 24;
  const padT = 20;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const minX = 4;
  const maxX = 10;
  const minY = Math.min(...CENTROID_ROWS.map((r) => r.centroidK), KSTAR) - 0.005;
  const maxY = Math.max(...CENTROID_ROWS.map((r) => r.centroidK), KSTAR) + 0.005;

  const xAt = (rungs) => padL + ((rungs - minX) / (maxX - minX)) * cW;
  const yAt = (k) => padT + cH - ((k - minY) / (maxY - minY)) * cH;

  const kStarY = yAt(KSTAR);
  const linePoints = CENTROID_ROWS.map((r) => `${xAt(r.rungs)},${yAt(r.centroidK)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={kStarY} x2={padL + cW} y2={kStarY} stroke={ED.series5} strokeWidth={1} strokeDasharray="4,3" />
      <text x={padL + 4} y={kStarY - 4} fill={ED.series5} fontSize={9.5}>
        pole k* = {KSTAR}
      </text>
      <polyline points={linePoints} fill="none" stroke={ED.series3} strokeWidth={1.75} />
      {CENTROID_ROWS.map((r) => (
        <circle key={r.label} cx={xAt(r.rungs)} cy={yAt(r.centroidK)} r={5} fill={ED.series3} stroke={ED.paper} strokeWidth={0.75} />
      ))}
      {CENTROID_ROWS.map((r) => (
        <text key={`${r.label}-x`} x={xAt(r.rungs)} y={svgH - padB + 16} textAnchor="middle" fill={ED.inkSoft} fontSize={10.5}>
          {r.label}
        </text>
      ))}
      <text x={16} y={padT + cH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5} transform={`rotate(-90 16 ${padT + cH / 2})`}>
        centroid k
      </text>
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        symmetric pole-centred window width (rungs)
      </text>
    </svg>
  );
}

export default function Imp34664PoleWindowBiasVarianceViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Pole-Centred eflow_attr Window: Bias-Variance Tradeoff (imp-34645)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34636 fit the log-corrected eflow_attr on a 5-rung window centred exactly on the pole
        k* &asymp; {KSTAR}, finding a leading slope nominally steeper than both flanks but too
        underpowered (SE &asymp; {W5.leadingSlopeSE.toExponential(2)}) to test the departure at more than
        {' '}{W5.departureSigma}&sigma;. imp-34645 widened the window to symmetric 7- and 9-rung versions,
        reusing the imp-34406/imp-34572 rungs verbatim. The chart below plots each window's leading
        slope &plusmn; SE (units of 1e-6 per k relative to {BASE}) against the near/far flank slopes, and
        the departure from the window-centre-drift prediction in sigma.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Leading per-k slope &plusmn; SE vs window width, with flank references
      </p>
      <SlopeSeChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        Window centroid vs width: drift off the pole
      </p>
      <CentroidDriftChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Finding:</strong> widening 5 &rarr; 7 rungs collapses the
        slope SE ~{DATA.w5SEoverW7SE}x (below the drift scale), but the nominal W5 steepening dissolves
        to only {W7.departureSigma}&sigma; from the centre-drift prediction &mdash; a 5-rung small-sample
        artifact, not a real pole kink. Widening further to 9 rungs keeps the SE tight but the centroid
        drifts further off the pole, re-inflating the departure to {W9.departureSigma}&sigma;: the
        symmetric 7-rung window is the bias-variance sweet spot.
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
