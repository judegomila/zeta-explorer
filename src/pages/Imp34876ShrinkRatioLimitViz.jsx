import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34839_CROSSOVER_GPP_SHRINK_RATIO_LIMIT } from '../data/imp-34839-crossover-gpp-shrink-ratio-limit.js';
import { ED } from '../styles/tokens.js';

const D = IMP34839_CROSSOVER_GPP_SHRINK_RATIO_LIMIT;
const ROWS = [...D.ladder, ...D.deepProbes];

// Two-panel chart: (left) the exact per-decade shrink ratio r(N) rising toward 100,
// (right) the fitted constant C_k = (100-r_k) u_k^2 rising toward 100 log 10 = 230.2585.
function ShrinkRatioChart() {
  const svgW = 720;
  const padL = 56;
  const padR = 20;
  const padT = 26;
  const padB = 40;
  const plotW = (svgW - padL - padR - 40) / 2;
  const plotH = 220;
  const svgH = padT + plotH + padB;
  const gap = 40;

  const ratios = ROWS.map((r) => r.shrink_ratio);
  const rMin = Math.min(...ratios) - 0.15;
  const rMax = 100.05;
  const yOfRatio = (v) => padT + plotH - ((v - rMin) / (rMax - rMin)) * plotH;

  const cVals = ROWS.map((r) => r.fitted_C_residual_times_u2);
  const cMin = Math.min(...cVals) - 5;
  const cMax = D.residualLawConstant_100ln10 + 5;
  const yOfC = (v) => padT + plotH - ((v - cMin) / (cMax - cMin)) * plotH;

  const xOf = (i) => padL + (i / (ROWS.length - 1)) * plotW;
  const xOf2 = (i) => padL + plotW + gap + (i / (ROWS.length - 1)) * plotW;

  const pathFor = (getY, xFn) =>
    ROWS.map((r, i) => `${i === 0 ? 'M' : 'L'} ${xFn(i)} ${getY(r)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* Left panel: shrink ratio r(N) -> 100 */}
      <line x1={padL} y1={yOfRatio(100)} x2={padL + plotW} y2={yOfRatio(100)} stroke={ED.rule} strokeDasharray="4 3" />
      <text x={padL + plotW} y={yOfRatio(100) - 5} textAnchor="end" fill={ED.inkSoft} fontSize={9} fontFamily="monospace">
        limit = 100
      </text>
      <path d={pathFor((r) => yOfRatio(r.shrink_ratio), xOf)} fill="none" stroke={ED.series1} strokeWidth={2} />
      {ROWS.map((r, i) => (
        <circle key={i} cx={xOf(i)} cy={yOfRatio(r.shrink_ratio)} r={2.4} fill={ED.series1} />
      ))}
      <text x={padL} y={svgH - padB + 16} fill={ED.inkFaint} fontSize={9} fontFamily="monospace">
        log10 N: 9..30, 40, 80, 150
      </text>
      <text x={padL} y={padT - 10} fill={ED.inkSoft} fontSize={10}>
        shrink ratio r(N) &rarr; 100
      </text>

      {/* Right panel: fitted C_k = (100-r_k) u_k^2 -> 100 log 10 */}
      <line
        x1={padL + plotW + gap}
        y1={yOfC(D.residualLawConstant_100ln10)}
        x2={padL + plotW + gap + plotW}
        y2={yOfC(D.residualLawConstant_100ln10)}
        stroke={ED.rule}
        strokeDasharray="4 3"
      />
      <text
        x={padL + plotW + gap + plotW}
        y={yOfC(D.residualLawConstant_100ln10) - 5}
        textAnchor="end"
        fill={ED.inkSoft}
        fontSize={9}
        fontFamily="monospace"
      >
        100 log 10 = {D.residualLawConstant_100ln10}
      </text>
      <path d={pathFor((r) => yOfC(r.fitted_C_residual_times_u2), xOf2)} fill="none" stroke={ED.brassDeco} strokeWidth={2} />
      {ROWS.map((r, i) => (
        <circle key={i} cx={xOf2(i)} cy={yOfC(r.fitted_C_residual_times_u2)} r={2.4} fill={ED.brassDeco} />
      ))}
      <text x={padL + plotW + gap} y={padT - 10} fill={ED.inkSoft} fontSize={10}>
        fitted C_k = (100-r_k) u_k&sup2; &rarr; 100 log 10
      </text>
    </svg>
  );
}

export default function Imp34876ShrinkRatioLimitViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Far-Tail 100x/Decade Shrink-Ratio Limit (imp-34876 / imp-34839)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34819 reported the crossover-map curvature-envelope per-decade shrink ratios
        {' '}{'{99.30, 99.44, 99.54, 99.62}'} rising toward a clean 100x/decade as the far tail nears the
        imp-3463 1/2 density asymptote, without deriving the limit or measuring the rate of approach.
        imp-34839 derives the limit is EXACTLY 100 and that the residual obeys 100 - r(N) &sim; (100 log 10)/u&sup2;
        with u = log(T0/2&pi;). The left panel plots the exact ratio r(N) rising toward 100 across the
        ladder [1e9..1e30] plus deep probes at {'{1e40, 1e80, 1e150}'}; the right panel plots the fitted
        constant C_k = (100 - r_k) u_k&sup2; converging to 100 log 10 = {D.residualLawConstant_100ln10}.
      </p>

      <ShrinkRatioChart />

      <p style={{ color: 'var(--ink-faint)', fontSize: '0.78rem', marginTop: '0.75rem' }}>
        The fitted constant rises monotonically from {D.ladder[0].ratio_to_100ln10} of the limit at 1e9 to
        {' '}{D.deepProbes[D.deepProbes.length - 1].ratio_to_100ln10} at 1e150 (relative error{' '}
        {D.deepestFittedC_relerrVsLaw}), confirming the approach is quadratic in 1/u &mdash; algebraic, not
        geometric &mdash; which is why the imp-34819 ladder (u &sim; 18-24) still sits 0.3-0.7 below 100.
        The four imp-34819 published ratios are reproduced to a max relative drift of{' '}
        {D.maxPublishedRatioDriftVsImp34819}.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page rendering the imp-34839
        ladder/deepProbes literals verbatim (no new computation). Accuracy assessment on the inherited
        imp-3220/imp-3406 surrogate crossover map; the C_mb GUE-conditional per imp-486 and the C_C 1/8 ansatz
        (imp-2642/imp-2643) are UNTOUCHED; changes no bound; establishes no operator positivity; no RH
        verdict, NO QED.
      </div>
    </div>
  );
}
