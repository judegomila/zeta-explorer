import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP3541_S3_RUNGS,
  IMP3541_S4_RUNGS,
  IMP3541_K_STAR_S3,
  IMP3541_K_STAR_S4,
  IMP3541_MAX_TESTED_K,
} from '../data/imp-3541-cosh-cancellation-margin-viz-data.js';
import { ED } from '../styles/tokens.js';

const K_MIN = 2;
const K_MAX = 2000;

function logScaleHelpers(cW, cH, padL, padT, kMin, kMax, yMin, yMax) {
  const logKMin = Math.log10(kMin);
  const logKMax = Math.log10(kMax);
  const xS = (k) => padL + ((Math.log10(k) - logKMin) / (logKMax - logKMin)) * cW;
  const yS = (v) => padT + cH * (1 - (Math.log10(v) - yMin) / (yMax - yMin));
  return { xS, yS };
}

function RhoTailChart() {
  const svgW = 620;
  const padL = 68;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 220;
  const svgH = padT + cH + padB;

  const yMin = -16;
  const yMax = -3;
  const { xS, yS } = logScaleHelpers(cW, cH, padL, padT, K_MIN, IMP3541_MAX_TESTED_K, yMin, yMax);

  const measuredS3 = IMP3541_S3_RUNGS.filter((r) => r.measured);
  const rhoPath = measuredS3.map((r, i) => (i === 0 ? 'M' : 'L') + xS(r.k).toFixed(1) + ',' + yS(r.rho).toFixed(2)).join(' ');
  const tailPath = measuredS3.map((r, i) => (i === 0 ? 'M' : 'L') + xS(r.k).toFixed(1) + ',' + yS(r.tail).toFixed(2)).join(' ');

  const yTicks = [1e-15, 1e-12, 1e-9, 1e-6, 1e-3];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 4} y={yS(v) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toExponential(0)}
          </text>
        </g>
      ))}

      <path d={tailPath} fill="none" stroke={ED.brassDeco} strokeWidth={2.4} />
      {measuredS3.map((r) => (
        <circle key={'tail' + r.k} cx={xS(r.k)} cy={yS(r.tail)} r={3.5} fill={ED.brassDeco} />
      ))}

      <path d={rhoPath} fill="none" stroke={ED.series2} strokeWidth={2.4} />
      {measuredS3.map((r) => (
        <circle key={'rho' + r.k} cx={xS(r.k)} cy={yS(r.rho)} r={3.5} fill={ED.series2} />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      {[2, 4, 8, 16, 24].map((k) => (
        <g key={'x' + k}>
          <line x1={xS(k)} y1={padT + cH} x2={xS(k)} y2={padT + cH + 5} stroke={ED.rule} strokeWidth={1} />
          <text x={xS(k)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {k}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        ladder index k (log scale, S3 cell)
      </text>

      <text
        x={12}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={'rotate(-90,12,' + (padT + cH / 2) + ')'}
      >
        relative error (log scale)
      </text>

      <g>
        <circle cx={padL + 14} cy={padT + 14} r={4} fill={ED.series2} />
        <text x={padL + 22} y={padT + 17} fill={ED.series2} fontSize={9}>
          rho(k) cancellation error (~k^2, grows)
        </text>
        <circle cx={padL + 14} cy={padT + 30} r={4} fill={ED.brassDeco} />
        <text x={padL + 22} y={padT + 33} fill={ED.brass} fontSize={9}>
          tail(k) O(a^2) miss (~1/k^2, shrinks)
        </text>
      </g>
    </svg>
  );
}

function MarginChart() {
  const svgW = 620;
  const padL = 68;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 260;
  const svgH = padT + cH + padB;

  const yMin = -0.3;
  const yMax = 12;
  const { xS, yS } = logScaleHelpers(cW, cH, padL, padT, K_MIN, K_MAX, yMin, yMax);

  const pathFor = (rungs) => rungs.map((r, i) => (i === 0 ? 'M' : 'L') + xS(r.k).toFixed(1) + ',' + yS(r.margin).toFixed(2)).join(' ');

  const measuredPath3 = pathFor(IMP3541_S3_RUNGS.filter((r) => r.measured));
  const extPath3 = pathFor(IMP3541_S3_RUNGS.filter((r) => !r.measured || r.k === IMP3541_MAX_TESTED_K));
  const measuredPath4 = pathFor(IMP3541_S4_RUNGS.filter((r) => r.measured));
  const extPath4 = pathFor(IMP3541_S4_RUNGS.filter((r) => !r.measured || r.k === IMP3541_MAX_TESTED_K));

  const yTicks = [1, 1e3, 1e6, 1e9, 1e12];
  const xTicks = [2, 24, 100, 1000];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 4} y={yS(v) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v >= 1000 ? v.toExponential(0) : v}
          </text>
        </g>
      ))}

      {/* margin = 1 reference line: below this the cancellation error would overtake the tail */}
      <line x1={padL} y1={yS(1)} x2={padL + cW} y2={yS(1)} stroke={ED.rule} strokeWidth={1} strokeDasharray="4 3" />

      <path d={extPath4} fill="none" stroke={ED.series3} strokeWidth={1.6} strokeDasharray="5 4" />
      <path d={measuredPath4} fill="none" stroke={ED.series3} strokeWidth={2.2} />

      <path d={extPath3} fill="none" stroke={ED.series5} strokeWidth={1.6} strokeDasharray="5 4" />
      <path d={measuredPath3} fill="none" stroke={ED.series5} strokeWidth={2.2} />

      {IMP3541_S3_RUNGS.filter((r) => r.measured).map((r) => (
        <circle key={'m3' + r.k} cx={xS(r.k)} cy={yS(r.margin)} r={3.5} fill={ED.series5} />
      ))}
      {IMP3541_S4_RUNGS.filter((r) => r.measured).map((r) => (
        <circle key={'m4' + r.k} cx={xS(r.k)} cy={yS(r.margin)} r={3.5} fill={ED.series3} />
      ))}

      {/* crossover markers k* (closed form, margin = 1) */}
      <line x1={xS(IMP3541_K_STAR_S4)} y1={padT} x2={xS(IMP3541_K_STAR_S4)} y2={padT + cH} stroke={ED.series3} strokeWidth={1} strokeDasharray="2 3" opacity={0.6} />
      <line x1={xS(IMP3541_K_STAR_S3)} y1={padT} x2={xS(IMP3541_K_STAR_S3)} y2={padT + cH} stroke={ED.series5} strokeWidth={1} strokeDasharray="2 3" opacity={0.6} />
      <circle cx={xS(IMP3541_K_STAR_S3)} cy={yS(1)} r={4} fill="none" stroke={ED.series5} strokeWidth={1.5} />
      <circle cx={xS(IMP3541_K_STAR_S4)} cy={yS(1)} r={4} fill="none" stroke={ED.series3} strokeWidth={1.5} />

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      {xTicks.map((k) => (
        <g key={'x' + k}>
          <line x1={xS(k)} y1={padT + cH} x2={xS(k)} y2={padT + cH + 5} stroke={ED.rule} strokeWidth={1} />
          <text x={xS(k)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {k}
          </text>
        </g>
      ))}
      <text x={xS(IMP3541_K_STAR_S4) - 4} y={padT + 12} textAnchor="end" fill={ED.series3} fontSize={8.5}>
        k*S4&#8776;1384
      </text>
      <text x={xS(IMP3541_K_STAR_S3) + 4} y={padT + 24} textAnchor="start" fill={ED.series5} fontSize={8.5}>
        k*S3&#8776;1730
      </text>

      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        ladder index k (log scale)
      </text>

      <text
        x={12}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={'rotate(-90,12,' + (padT + cH / 2) + ')'}
      >
        safety margin tail(k)/rho(k) (log scale)
      </text>

      <g>
        <circle cx={padL + 14} cy={padT + 14} r={4} fill={ED.series5} />
        <text x={padL + 22} y={padT + 17} fill={ED.series5} fontSize={9}>
          S3 cell (a0=0.5): solid=measured k&le;24, dashed=closed-form extrapolation
        </text>
        <circle cx={padL + 14} cy={padT + 30} r={4} fill={ED.series3} />
        <text x={padL + 22} y={padT + 33} fill={ED.series3} fontSize={9}>
          S4 cell (a0=0.4): solid=measured k&le;24, dashed=closed-form extrapolation
        </text>
      </g>
    </svg>
  );
}

export default function Imp3541CoshCancellationMarginViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Cosh Cancellation-Safety Margin vs. Ladder Index k (imp-3509 / imp-3541)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-3509 certified the imp-3490 catastrophic-cancellation safety of the near-cancelling
        cosh(a&thinsp;tau)&minus;1 term as a closed function of the ladder index k. The relative
        cancellation error rho(k) grows like k<sup>2</sup> while the competing O(a<sup>2</sup>)
        leading-form tail shrinks like 1/k<sup>2</sup>, so the safety margin tail(k)/rho(k)
        collapses like k<sup>&minus;4</sup>. It stays at least seven orders of magnitude above 1
        through the tested ladder (k&le;24) and only reaches 1 at the closed-form crossover
        k* &asymp; 1384&ndash;1730, roughly 60&ndash;70&times; beyond any tested rung.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        rho(k) (cancellation error, grows) vs. tail(k) (O(a&sup2;) miss, shrinks) &mdash; S3 cell
      </p>
      <RhoTailChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        Safety margin tail(k)/rho(k), collapsing like k<sup>&minus;4</sup>, with the closed-form
        crossover k* marked on both base cells
      </p>
      <MarginChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> measurement/visualization
        only &mdash; no proof, no reduction below RH. This certifies floating-point
        cancellation-safety of a degree-2 integrand term across k; it establishes no operator
        positivity. Mass-feasibility is necessary-but-not-sufficient and the degree-2 face carries
        no feasibility comparison at all (imp-3469). The operator-level K_a &ge; 0 sign-positivity
        residual (imp-3066) remains untouched.
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--ink-faint)' }}>
        <strong>Related:</strong>{' '}
        <Link to="/viz-imp3540-power-iteration-budget" style={{ color: 'var(--series-5)' }}>
          Power-Iteration Budget-to-1e-9 Growth (imp-3540)
        </Link>
      </div>
    </div>
  );
}
