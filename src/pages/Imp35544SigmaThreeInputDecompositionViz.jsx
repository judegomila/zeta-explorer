import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP35544_SHARE_POINTS,
  IMP35544_PEAK_LOG10N,
  IMP35544_PEAK_SIGMA,
  IMP35544_CROSSOVER_LOG10N,
  IMP35544_CROSSOVER_SHARE,
  IMP35544_SUMMARY,
} from '../data/imp-35544-sigma-three-input-decomposition-viz-data.js';
import { ED } from '../styles/tokens.js';

const LINES = [
  { key: 'collShare', label: 'E_coll share = sigma(N) (GUE-conditional)', color: ED.series2 },
  { key: 'truncShare', label: 'E_trunc share (fixed floor)', color: ED.series1 },
  { key: 'flowShare', label: 'E_flow share (unconditionally rigorous)', color: ED.series3 },
];

// Three share curves vs log10(N): E_coll share (sigma) is a HUMP peaking at the
// imp-35337/imp-35411 flat-cap landmark; E_trunc share rises monotonically and
// E_flow share falls monotonically, so their sum (1 - sigma) is the mirror U-shape
// dipping to its minimum at the same N.
function ShareDecompositionChart() {
  const svgW = 680;
  const padL = 48;
  const padR = 20;
  const plotW = svgW - padL - padR;
  const svgH = 340;
  const padT = 20;
  const padB = 46;
  const plotH = svgH - padT - padB;

  const minX = IMP35544_SHARE_POINTS[0].log10N;
  const maxX = IMP35544_SHARE_POINTS[IMP35544_SHARE_POINTS.length - 1].log10N;
  const xOf = (v) => padL + ((v - minX) / (maxX - minX)) * plotW;
  const yOf = (v) => padT + plotH - v * plotH; // shares live in [0, 1]

  const xTicks = [4, 6, 8, 10, 12, 14];
  const yTicks = [0, 0.25, 0.5, 0.75, 1.0];

  const pathFor = (key) =>
    IMP35544_SHARE_POINTS.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.log10N)} ${yOf(p[key])}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {xTicks.map((v) => (
        <g key={`x${v}`}>
          <line x1={xOf(v)} y1={padT + plotH} x2={xOf(v)} y2={padT + plotH + 4} stroke={ED.rule} strokeWidth={1} />
          <text x={xOf(v)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
            {v}
          </text>
        </g>
      ))}
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL} y2={yOf(v)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
            {v.toFixed(2)}
          </text>
        </g>
      ))}

      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        log10(N)
      </text>
      <text
        x={12}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={9.5}
        transform={`rotate(-90 12 ${padT + plotH / 2})`}
      >
        share of E(N)
      </text>

      {LINES.map((line) => (
        <path key={line.key} d={pathFor(line.key)} fill="none" stroke={line.color} strokeWidth={2} opacity={0.85} />
      ))}

      {/* PEAK marker on the E_coll share = sigma(N) curve */}
      <circle cx={xOf(IMP35544_PEAK_LOG10N)} cy={yOf(IMP35544_PEAK_SIGMA)} r={5} fill={ED.series2} stroke={ED.paper} strokeWidth={1.5} />
      <text x={xOf(IMP35544_PEAK_LOG10N) + 8} y={yOf(IMP35544_PEAK_SIGMA) - 8} fill={ED.series2} fontSize={8.5} fontFamily="monospace">
        peak {IMP35544_PEAK_SIGMA.toFixed(5)}
      </text>

      {/* CROSSOVER marker where E_coll share = E_trunc share */}
      <circle cx={xOf(IMP35544_CROSSOVER_LOG10N)} cy={yOf(IMP35544_CROSSOVER_SHARE)} r={5} fill={ED.brassDeco} stroke={ED.paper} strokeWidth={1.5} />
      <text
        x={xOf(IMP35544_CROSSOVER_LOG10N) - 8}
        y={yOf(IMP35544_CROSSOVER_SHARE) + 16}
        textAnchor="end"
        fill={ED.brass}
        fontSize={8.5}
        fontFamily="monospace"
      >
        crossover
      </text>
    </svg>
  );
}

export default function Imp35544SigmaThreeInputDecompositionViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Sigma(N) Three-Input Decomposition: E_trunc / E_flow / E_coll Shares vs N (imp-35544 / imp-35475)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        sigma(N) = E_coll(N) / E(N), with E(N) = E_trunc + E_flow(N) + E_coll(N), is assembled from
        three inputs of different epistemic status (imp-35475 Part A). E_coll&apos;s share (the red
        curve, which IS sigma(N)) rises to a flat interior peak of {IMP35544_PEAK_SIGMA.toFixed(5)}{' '}
        near log10(N) ~ {IMP35544_PEAK_LOG10N} (the imp-35337/imp-35411 flat-cap landmark), then falls.
        E_flow&apos;s share (green, unconditionally rigorous per imp-398) falls monotonically throughout.
        E_trunc&apos;s share (blue, a fixed 3.06e-5 floor per imp-2631) rises monotonically and crosses
        the E_coll share at the E_coll = E_trunc CROSSOVER landmark near log10(N) ~{' '}
        {IMP35544_CROSSOVER_LOG10N} (imp-35337/imp-3444), where both sit at ~
        {IMP35544_CROSSOVER_SHARE.toFixed(4)}. The complement 1 - sigma (trunc share + flow share) is
        the mirror-image U-shape: it dips to its minimum at exactly the same N as sigma&apos;s peak.
      </p>

      <ShareDecompositionChart />

      <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
        {LINES.map((line) => (
          <div key={line.key} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--ink-soft)' }}>
            <span style={{ width: 14, height: 3, background: line.color, display: 'inline-block' }} />
            {line.label}
          </div>
        ))}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', marginTop: '1.25rem' }}>
        {IMP35544_SUMMARY.pointCount} baked (log10N, share) rows span log10(N) = 4..14; the three
        shares sum to 1 at every point to within {IMP35544_SUMMARY.maxShareSumResidual.toExponential(1)}
        , confirming they exhaust the E(N) denominator (imp-35475 Part A) exactly.
      </p>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Epistemic status -- measurement only:</strong> viz-data
        only, baked literals offline-reproduced from the imp-35475 surrogate formulas (no fresh
        computation at load, no heavy import). The E_coll share (sigma) is a GUE-CONDITIONAL modeled
        asymptotic (C_C = (1/8)&nbsp;sqrt(3&nbsp;pi) ansatz, imp-2642/imp-2643) inheriting imp-486; only
        E_flow is unconditionally rigorous (imp-398). imp-35337a (surrogate-vs-true fidelity) stays
        OPEN; E_trunc = 3.06e-5 (imp-2631) is a separate barrier artifact (imp-35459), UNTOUCHED here.
        sigma is a diagnostic share, not a way to move Lambda: this chart discharges nothing, changes no
        bound, establishes no operator positivity, no RH verdict, NO QED.
      </div>
    </div>
  );
}
