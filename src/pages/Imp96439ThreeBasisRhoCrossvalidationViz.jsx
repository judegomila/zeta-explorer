import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96439_RHO_SERIES,
  IMP96439_AGREEMENT_SERIES,
  IMP96439_LANDMARKS,
  IMP96439_HONEST_BANNER,
} from '../data/imp-96439-three-basis-rho-crossvalidation-viz-data.js';
import { ED } from '../styles/tokens.js';

function RhoChart() {
  const svgW = 680;
  const svgH = 300;
  const padL = 68;
  const padR = 16;
  const padT = 16;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const xMin = 1.4;
  const xMax = 2.75;
  const yMin = -0.5;
  const yMax = -0.44;

  const xOf = (log10L) => padL + ((log10L - xMin) / (xMax - xMin)) * plotW;
  const yOf = (rho) => padT + plotH - ((rho - yMin) / (yMax - yMin)) * plotH;

  const lineD = (key) =>
    IMP96439_RHO_SERIES
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.log10L).toFixed(2)} ${yOf(p[key]).toFixed(2)}`)
      .join(' ');

  const xTicks = [1.5, 1.75, 2, 2.25, 2.5, 2.75];
  const yTicks = [-0.5, -0.48, -0.46, -0.44];

  const rigidityY = yOf(-0.5);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.rule} strokeWidth={0.5} opacity={0.4} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>{v.toFixed(2)}</text>
        </g>
      ))}
      {xTicks.map((v) => (
        <text key={`x${v}`} x={xOf(v)} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
          {v}
        </text>
      ))}

      {/* rigidity limit -1/2 */}
      <line x1={padL} y1={rigidityY} x2={padL + plotW} y2={rigidityY} stroke={ED.brassDeco} strokeWidth={1} strokeDasharray="3 3" opacity={0.55} />
      <text x={padL + plotW - 4} y={rigidityY - 4} textAnchor="end" fill={ED.brass} fontSize={8}>
        rigidity limit -1/2
      </text>

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      <path d={lineD('rhoExact')} fill="none" stroke={ED.series1} strokeWidth={2.5} opacity={0.9} />
      <path d={lineD('rhoAsymp')} fill="none" stroke={ED.series2} strokeWidth={1.5} strokeDasharray="5 3" opacity={0.9} />
      <path d={lineD('rhoDirect')} fill="none" stroke={ED.series3} strokeWidth={1} strokeDasharray="1 3" opacity={0.9} />

      {IMP96439_RHO_SERIES.map((p) => (
        <circle key={`r-${p.L}`} cx={xOf(p.log10L)} cy={yOf(p.rhoExact)} r={2.4} fill={ED.series1} />
      ))}

      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        log10 L (L = 30..480)
      </text>

      <g transform={`translate(${padL + 8}, ${padT + 8})`}>
        <line x1={0} y1={0} x2={18} y2={0} stroke={ED.series1} strokeWidth={2.5} />
        <text x={22} y={3} fill={ED.inkSoft} fontSize={8.5}>basis A (exact Dyson-Mehta)</text>
        <line x1={0} y1={14} x2={18} y2={14} stroke={ED.series2} strokeWidth={1.5} strokeDasharray="5 3" />
        <text x={22} y={17} fill={ED.inkSoft} fontSize={8.5}>basis B (asymptotic)</text>
        <line x1={0} y1={28} x2={18} y2={28} stroke={ED.series3} strokeWidth={1} strokeDasharray="1 3" />
        <text x={22} y={31} fill={ED.inkSoft} fontSize={8.5}>basis C (direct integral)</text>
      </g>
    </svg>
  );
}

function AgreementChart() {
  const svgW = 680;
  const svgH = 320;
  const padL = 68;
  const padR = 16;
  const padT = 16;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const xMin = 1.4;
  const xMax = 2.75;
  const yMin = -14;
  const yMax = -5;

  const xOf = (log10L) => padL + ((log10L - xMin) / (xMax - xMin)) * plotW;
  const yOf = (log10v) => padT + plotH - ((log10v - yMin) / (yMax - yMin)) * plotH;

  const lineD = (key) =>
    IMP96439_AGREEMENT_SERIES
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.log10L).toFixed(2)} ${yOf(p[key]).toFixed(2)}`)
      .join(' ');

  const xTicks = [1.5, 1.75, 2, 2.25, 2.5, 2.75];
  const yTicks = [-14, -12, -10, -8, -6];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.rule} strokeWidth={0.5} opacity={0.4} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>{`1e${v}`}</text>
        </g>
      ))}
      {xTicks.map((v) => (
        <text key={`x${v}`} x={xOf(v)} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
          {v}
        </text>
      ))}

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      <path d={lineD('log10AgreeAB')} fill="none" stroke={ED.series2} strokeWidth={2} opacity={0.9} />
      <path d={lineD('log10AgreeAC')} fill="none" stroke={ED.series1} strokeWidth={1.5} strokeDasharray="5 3" opacity={0.9} />
      <path d={lineD('log10DirectFloor')} fill="none" stroke={ED.brassDeco} strokeWidth={1.5} strokeDasharray="1 3" opacity={0.9} />

      {IMP96439_AGREEMENT_SERIES.map((p) => (
        <circle key={`a-${p.L}`} cx={xOf(p.log10L)} cy={yOf(p.log10AgreeAB)} r={2.4} fill={ED.series2} />
      ))}

      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        log10 L (L = 30..480)
      </text>

      <g transform={`translate(${padL + 8}, ${padT + 8})`}>
        <line x1={0} y1={0} x2={18} y2={0} stroke={ED.series2} strokeWidth={2} />
        <text x={22} y={3} fill={ED.inkSoft} fontSize={8.5}>|A-B| analytic truncation (shrinks)</text>
        <line x1={0} y1={14} x2={18} y2={14} stroke={ED.series1} strokeWidth={1.5} strokeDasharray="5 3" />
        <text x={22} y={17} fill={ED.inkSoft} fontSize={8.5}>|A-C| quadrature roundoff (flat, ~1e-11)</text>
        <line x1={0} y1={28} x2={18} y2={28} stroke={ED.brassDeco} strokeWidth={1.5} strokeDasharray="1 3" />
        <text x={22} y={31} fill={ED.inkSoft} fontSize={8.5}>basis-C direct floor (grows with L)</text>
      </g>
    </svg>
  );
}

export default function Imp96439ThreeBasisRhoCrossvalidationViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-96389: Three-Basis GUE Rho Cross-Validation" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
          borderLeft: '3px solid var(--series-2)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 760,
        }}
      >
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96439_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-96389 assembled three independent evaluations of the GUE two-interval correlation rho(L)
        into one per-L table: the exact Dyson&ndash;Mehta number variance (basis A), the asymptotic
        module that drops the oscillatory Ci/Si terms (basis B), and a direct pair-correlation
        double integral evaluated by Simpson quadrature (basis C). The three bases agree on rho to
        &ge; 6 figures at every accessible rung (L = 30..480), but for two distinct reasons: |A-C| is
        pure quadrature roundoff (C samples the same sine kernel A evaluates in closed form), while
        |A-B| is a genuine analytic truncation of the dropped oscillatory terms.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        rho vs log10 L (all three bases overlap, drifting toward the -0.5 rigidity limit)
      </h3>
      <RhoChart />

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '1.5rem 0 0.5rem' }}>
        Pairwise agreement and basis-C roundoff floor vs log10 L (log scale)
      </h3>
      <AgreementChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the charts:</strong> in the top chart the three
        rho curves are visually indistinguishable because they agree to &ge; 6 figures at every
        rung. The bottom chart separates the two disagreement mechanisms the top chart hides: |A-B|
        (red) shrinks steadily from {IMP96439_LANDMARKS.worstPairwiseGap.agreeAB.toExponential(2)}{' '}
        at L = {IMP96439_LANDMARKS.worstPairwiseGap.L} toward ~4.7e-9 at L = 480, while |A-C| (blue)
        stays essentially flat near 1e-11 across the whole range and the basis-C direct floor
        (yellow) grows with L instead of shrinking &mdash; the opposite trend. That crossing pattern
        is why basis C ({IMP96439_LANDMARKS.binding}) is the binding floor of the table at accessible
        L, not basis A or B.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the imp-96389
        baked three-basis table verbatim (only the chart-axis reshaping is computed here). rho is
        the theoretical GUE (sine-kernel, universality) two-interval correlation for boxes of
        unfolded length L; these are theoretical envelope values with no computed Riemann zeros
        behind them. Changes no bound, establishes no operator positivity, no RH claim. NO QED.
      </div>
    </div>
  );
}
