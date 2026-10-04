import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP3882_RUNGS,
  IMP3882_PREDICTED_CROSSING_N,
  IMP3882_MEASURED_CROSSING_N,
  IMP3882_SKEW_KURT_BOUND,
} from '../data/imp-3882-saddle-correction-ladder-viz-data.js';
import { ED } from '../styles/tokens.js';

const N_MIN = 10;
const N_MAX = 80;

function CorrectionTermsChart() {
  const svgW = 640;
  const padL = 56;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 220;
  const svgH = padT + cH + padB;

  const yMin = -1.2;
  const yMax = 0.5;

  const xS = (n) => padL + ((n - N_MIN) / (N_MAX - N_MIN)) * cW;
  const yS = (v) => padT + cH * (1 - (v - yMin) / (yMax - yMin));

  const lineFor = (key) =>
    IMP3882_RUNGS.map((r, i) => (i === 0 ? 'M' : 'L') + xS(r.n).toFixed(1) + ',' + yS(r[key]).toFixed(2)).join(' ');

  const yTicks = [-1.2, -0.9, -0.6, -0.3, 0, 0.3];
  const xTicks = [10, 20, 30, 40, 50, 60, 70, 80];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />
      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 4} y={yS(v) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toFixed(1)}
          </text>
        </g>
      ))}
      <line x1={padL} y1={yS(0)} x2={padL + cW} y2={yS(0)} stroke={ED.rule} strokeWidth={1} />

      <path d={lineFor('c1')} fill="none" stroke={ED.series2} strokeWidth={2.2} />
      <path d={lineFor('c2')} fill="none" stroke={ED.series1} strokeWidth={2} />
      <path d={lineFor('c3')} fill="none" stroke={ED.brassDeco} strokeWidth={2} />
      {IMP3882_RUNGS.map((r) => (
        <g key={r.n}>
          <circle cx={xS(r.n)} cy={yS(r.c1)} r={2.4} fill={ED.series2} />
          <circle cx={xS(r.n)} cy={yS(r.c2)} r={2.2} fill={ED.series1} />
          <circle cx={xS(r.n)} cy={yS(r.c3)} r={2.2} fill={ED.brassDeco} />
        </g>
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />
      {xTicks.map((n) => (
        <g key={'x' + n}>
          <line x1={xS(n)} y1={padT + cH} x2={xS(n)} y2={padT + cH + 5} stroke={ED.rule} strokeWidth={1} />
          <text x={xS(n)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {n}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        n
      </text>
      <text
        x={12}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={'rotate(-90,12,' + (padT + cH / 2) + ')'}
      >
        term value
      </text>

      <circle cx={padL + 10} cy={padT + 12} r={2.8} fill={ED.series2} />
      <text x={padL + 18} y={padT + 15} fill={ED.series2} fontSize={9}>C1 (dominant)</text>
      <circle cx={padL + 118} cy={padT + 12} r={2.6} fill={ED.series1} />
      <text x={padL + 126} y={padT + 15} fill={ED.series1} fontSize={9}>C2</text>
      <circle cx={padL + 160} cy={padT + 12} r={2.6} fill={ED.brassDeco} />
      <text x={padL + 168} y={padT + 15} fill={ED.brass} fontSize={9}>C3</text>
    </svg>
  );
}

function SkewKurtChart() {
  const svgW = 640;
  const padL = 56;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 160;
  const svgH = padT + cH + padB;

  const yMin = -0.22;
  const yMax = 0.22;

  const xS = (n) => padL + ((n - N_MIN) / (N_MAX - N_MIN)) * cW;
  const yS = (v) => padT + cH * (1 - (v - yMin) / (yMax - yMin));

  const skewPath = IMP3882_RUNGS.map(
    (r, i) => (i === 0 ? 'M' : 'L') + xS(r.n).toFixed(1) + ',' + yS(r.skewness).toFixed(2),
  ).join(' ');
  const kurtPath = IMP3882_RUNGS.map(
    (r, i) => (i === 0 ? 'M' : 'L') + xS(r.n).toFixed(1) + ',' + yS(r.kurtosis).toFixed(2),
  ).join(' ');

  const yTicks = [-0.2, -0.1, 0, 0.1, 0.2];
  const xTicks = [10, 20, 30, 40, 50, 60, 70, 80];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />
      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 4} y={yS(v) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toFixed(2)}
          </text>
        </g>
      ))}

      {/* smallness bound |.| < 0.2 asserted by imp-3848 */}
      <line
        x1={padL}
        y1={yS(IMP3882_SKEW_KURT_BOUND)}
        x2={padL + cW}
        y2={yS(IMP3882_SKEW_KURT_BOUND)}
        stroke={ED.rule}
        strokeWidth={1}
        strokeDasharray="3,3"
      />
      <line
        x1={padL}
        y1={yS(-IMP3882_SKEW_KURT_BOUND)}
        x2={padL + cW}
        y2={yS(-IMP3882_SKEW_KURT_BOUND)}
        stroke={ED.rule}
        strokeWidth={1}
        strokeDasharray="3,3"
      />

      <path d={skewPath} fill="none" stroke={ED.series5} strokeWidth={2} />
      <path d={kurtPath} fill="none" stroke={ED.series3} strokeWidth={2} />
      {IMP3882_RUNGS.map((r) => (
        <g key={r.n}>
          <circle cx={xS(r.n)} cy={yS(r.skewness)} r={2.2} fill={ED.series5} />
          <circle cx={xS(r.n)} cy={yS(r.kurtosis)} r={2.2} fill={ED.series3} />
        </g>
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />
      {xTicks.map((n) => (
        <g key={'x' + n}>
          <line x1={xS(n)} y1={padT + cH} x2={xS(n)} y2={padT + cH + 5} stroke={ED.rule} strokeWidth={1} />
          <text x={xS(n)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {n}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        n
      </text>

      <circle cx={padL + 10} cy={padT + 12} r={2.6} fill={ED.series5} />
      <text x={padL + 18} y={padT + 15} fill={ED.series5} fontSize={9}>skewness f_ppp*sigma^3</text>
      <circle cx={padL + 168} cy={padT + 12} r={2.6} fill={ED.series3} />
      <text x={padL + 176} y={padT + 15} fill={ED.series3} fontSize={9}>kurtosis f_pppp*sigma^4</text>
    </svg>
  );
}

const CROSS_N_MIN = 10;
const CROSS_N_MAX = 55;
const CROSS_RUNGS = IMP3882_RUNGS.filter((r) => r.n <= CROSS_N_MAX);

function CrossingComparisonChart() {
  const svgW = 640;
  const padL = 56;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 220;
  const svgH = padT + cH + padB;

  const yMin = -0.2;
  const yMax = 2.2;

  const xS = (n) => padL + ((n - CROSS_N_MIN) / (CROSS_N_MAX - CROSS_N_MIN)) * cW;
  const yS = (v) => padT + cH * (1 - (v - yMin) / (yMax - yMin));

  const predictedPath = CROSS_RUNGS.map(
    (r, i) => (i === 0 ? 'M' : 'L') + xS(r.n).toFixed(1) + ',' + yS(r.driftPredicted).toFixed(2),
  ).join(' ');
  const measuredPath = CROSS_RUNGS.map(
    (r, i) => (i === 0 ? 'M' : 'L') + xS(r.n).toFixed(1) + ',' + yS(r.driftMeasured).toFixed(2),
  ).join(' ');

  const yTicks = [0, 0.5, 1, 1.5, 2];
  const xTicks = [10, 20, 30, 40, 50];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />
      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 4} y={yS(v) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toFixed(1)}
          </text>
        </g>
      ))}

      {/* L_n = 1 target line */}
      <line x1={padL} y1={yS(1)} x2={padL + cW} y2={yS(1)} stroke={ED.series7} strokeWidth={1.2} strokeDasharray="4,3" />

      {/* predicted crossing n* ~ 17.1 */}
      <line
        x1={xS(IMP3882_PREDICTED_CROSSING_N)}
        y1={padT}
        x2={xS(IMP3882_PREDICTED_CROSSING_N)}
        y2={padT + cH}
        stroke={ED.series2}
        strokeWidth={1}
        strokeDasharray="2,3"
      />
      <text x={xS(IMP3882_PREDICTED_CROSSING_N) + 4} y={padT + 12} fill={ED.series2} fontSize={8.5}>
        predicted n*~{IMP3882_PREDICTED_CROSSING_N.toFixed(1)}
      </text>

      {/* measured crossing n* ~ 48.6, clamped inside the plotted range */}
      {IMP3882_MEASURED_CROSSING_N <= CROSS_N_MAX && (
        <>
          <line
            x1={xS(IMP3882_MEASURED_CROSSING_N)}
            y1={padT}
            x2={xS(IMP3882_MEASURED_CROSSING_N)}
            y2={padT + cH}
            stroke={ED.series1}
            strokeWidth={1}
            strokeDasharray="2,3"
          />
          <text x={xS(IMP3882_MEASURED_CROSSING_N) + 4} y={padT + 24} fill={ED.series1} fontSize={8.5}>
            measured n*~{IMP3882_MEASURED_CROSSING_N.toFixed(1)}
          </text>
        </>
      )}

      <path d={predictedPath} fill="none" stroke={ED.series2} strokeWidth={2.2} />
      <path d={measuredPath} fill="none" stroke={ED.series1} strokeWidth={2.2} />
      {CROSS_RUNGS.map((r) => (
        <g key={r.n}>
          <circle cx={xS(r.n)} cy={yS(r.driftPredicted)} r={2.2} fill={ED.series2} />
          <circle cx={xS(r.n)} cy={yS(r.driftMeasured)} r={2.2} fill={ED.series1} />
        </g>
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />
      {xTicks.map((n) => (
        <g key={'x' + n}>
          <line x1={xS(n)} y1={padT + cH} x2={xS(n)} y2={padT + cH + 5} stroke={ED.rule} strokeWidth={1} />
          <text x={xS(n)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {n}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        n
      </text>
      <text
        x={12}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={'rotate(-90,12,' + (padT + cH / 2) + ')'}
      >
        L_n
      </text>

      <circle cx={padL + 10} cy={padT + 12} r={2.6} fill={ED.series2} />
      <text x={padL + 18} y={padT + 15} fill={ED.series2} fontSize={9}>predicted 1+C1+C2+C3</text>
      <circle cx={padL + 172} cy={padT + 12} r={2.6} fill={ED.series1} />
      <text x={padL + 180} y={padT + 15} fill={ED.series1} fontSize={9}>measured L_n (imp-3735)</text>
    </svg>
  );
}

export default function Imp3882SaddleCorrectionLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Next-Order Saddle-Correction Ladder C1, C2, C3, n=10..80 (imp-3848 / imp-3882)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-3848 expands the imp-3735 reduced moment-ratio drift factor L_n around the Laplace
        saddle as L_n = 1 + C1 + C2 + C3, with C1 = f_ppp&middot;sigma<sup>2</sup>&middot;tau*,
        C2 = (f_pppp/2)&middot;sigma<sup>4</sup>, C3 = (5/4)&middot;f_ppp<sup>2</sup>&middot;sigma
        <sup>6</sup>. The top panel shows C1 dominating and changing sign near n~18 (tau* =
        1/&radic;8), while C2 and C3 stay an order of magnitude smaller throughout.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        C1, C2, C3 vs n, n=10..80 (linear): C1 dominates and changes sign
      </p>
      <CorrectionTermsChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        dimensionless skewness f_ppp&middot;sigma<sup>3</sup> and kurtosis f_pppp&middot;sigma
        <sup>4</sup> vs n: both stay inside the |.| &lt; 0.2 smallness band (dashed) that
        justifies the perturbative saddle expansion
      </p>
      <SkewKurtChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        1+C1+C2+C3 (predicted) vs the imp-3735 measured L_n, n=10..55: the truncated prediction
        crosses 1 near n~17.1, far earlier than the measured crossing near n~48.6
      </p>
      <CrossingComparisonChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the third-derivative term
        C1 flips sign at tau* = 1/&radic;8 (n~18) and grows without bound toward -4&middot;tau*,
        pulling the truncated prediction below 1 at n~17.1 -- roughly 31 rungs earlier than the
        measured L_n crossing at n~48.6. The skewness and kurtosis stay small (&lt;0.2 in
        magnitude) across the whole range, so the near-Gaussian saddle expansion is legitimate --
        but this single-next-order truncation only confirms the DIRECTION of the drift, not its
        quantitative rate: the growing higher-order terms must partially cancel to reproduce the
        slower measured descent.
      </div>

      <div
        style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> measurement/visualization
        only -- no proof, no reduction below RH. This illustrates a truncated ASYMPTOTIC Laplace
        expansion (direction-confirming, not a certified error bound); mass-feasibility is
        necessary-but-not-sufficient and the operator-level K_a &ge; 0 sign-positivity residual
        (imp-3066) remains untouched.
      </div>
    </div>
  );
}
