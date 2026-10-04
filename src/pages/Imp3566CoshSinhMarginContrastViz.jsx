import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP3566_COSH_RUNGS,
  IMP3566_SINH_RUNGS,
  IMP3566_K_STAR_COSH,
  IMP3566_K_STAR_SINH,
  IMP3566_MAX_TESTED_K,
  IMP3566_MIN_MARGIN_COSH,
  IMP3566_MIN_MARGIN_SINH,
} from '../data/imp-3566-cosh-sinh-margin-contrast-viz-data.js';
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

function MarginContrastChart() {
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

  const measuredCosh = pathFor(IMP3566_COSH_RUNGS.filter((r) => r.measured));
  const extCosh = pathFor(IMP3566_COSH_RUNGS.filter((r) => !r.measured || r.k === IMP3566_MAX_TESTED_K));
  const measuredSinh = pathFor(IMP3566_SINH_RUNGS.filter((r) => r.measured));
  const extSinh = pathFor(IMP3566_SINH_RUNGS.filter((r) => !r.measured || r.k === IMP3566_MAX_TESTED_K));

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

      <path d={extCosh} fill="none" stroke={ED.series5} strokeWidth={1.6} strokeDasharray="5 4" />
      <path d={measuredCosh} fill="none" stroke={ED.series5} strokeWidth={2.2} />

      <path d={extSinh} fill="none" stroke={ED.series2} strokeWidth={1.6} strokeDasharray="5 4" />
      <path d={measuredSinh} fill="none" stroke={ED.series2} strokeWidth={2.2} />

      {IMP3566_COSH_RUNGS.filter((r) => r.measured).map((r) => (
        <circle key={'cosh' + r.k} cx={xS(r.k)} cy={yS(r.margin)} r={3.5} fill={ED.series5} />
      ))}
      {IMP3566_SINH_RUNGS.filter((r) => r.measured).map((r) => (
        <circle key={'sinh' + r.k} cx={xS(r.k)} cy={yS(r.margin)} r={3.5} fill={ED.series2} />
      ))}

      {/* crossover markers k* (closed form, margin = 1) */}
      <line x1={xS(IMP3566_K_STAR_SINH)} y1={padT} x2={xS(IMP3566_K_STAR_SINH)} y2={padT + cH} stroke={ED.series2} strokeWidth={1} strokeDasharray="2 3" opacity={0.6} />
      <line x1={xS(IMP3566_K_STAR_COSH)} y1={padT} x2={xS(IMP3566_K_STAR_COSH)} y2={padT + cH} stroke={ED.series5} strokeWidth={1} strokeDasharray="2 3" opacity={0.6} />
      <circle cx={xS(IMP3566_K_STAR_SINH)} cy={yS(1)} r={4} fill="none" stroke={ED.series2} strokeWidth={1.5} />
      <circle cx={xS(IMP3566_K_STAR_COSH)} cy={yS(1)} r={4} fill="none" stroke={ED.series5} strokeWidth={1.5} />

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      {xTicks.map((k) => (
        <g key={'x' + k}>
          <line x1={xS(k)} y1={padT + cH} x2={xS(k)} y2={padT + cH + 5} stroke={ED.rule} strokeWidth={1} />
          <text x={xS(k)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {k}
          </text>
        </g>
      ))}
      <text x={xS(IMP3566_K_STAR_SINH) - 4} y={padT + 12} textAnchor="end" fill={ED.series2} fontSize={8.5}>
        k*sinh&#8776;1253
      </text>
      <text x={xS(IMP3566_K_STAR_COSH) + 4} y={padT + 24} textAnchor="start" fill={ED.series5} fontSize={8.5}>
        k*cosh&#8776;1730
      </text>

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
        safety margin tail(k)/rho(k) (log scale)
      </text>

      <g>
        <circle cx={padL + 14} cy={padT + 14} r={4} fill={ED.series5} />
        <text x={padL + 22} y={padT + 17} fill={ED.series5} fontSize={9}>
          cosh (imp-3509, even, degree-2): solid=measured k&le;24, dashed=closed-form extrapolation
        </text>
        <circle cx={padL + 14} cy={padT + 30} r={4} fill={ED.series2} />
        <text x={padL + 22} y={padT + 33} fill={ED.series2} fontSize={9}>
          sinh (imp-3527, odd, degree-3): solid=measured k&le;24, dashed=closed-form extrapolation
        </text>
      </g>
    </svg>
  );
}

export default function Imp3566CoshSinhMarginContrastViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Even vs. Odd Cancellation-Safety Margins vs. Ladder Index k (imp-3509 / imp-3527 / imp-3566)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-3509 certified the EVEN (cosh, degree-2) catastrophic-cancellation safety margin
        tail(k)/rho(k) as a closed function of the ladder index k; imp-3527 supplied the missing
        ODD (sinh, degree-3) counterpart. Both margins collapse like k<sup>&minus;4</sup> (rho(k)
        grows ~k<sup>2</sup>, tail(k) shrinks ~1/k<sup>2</sup>), but the sinh curve sits uniformly
        below the cosh curve &mdash; its leading cancellation coefficient (6&thinsp;&epsilon;k<sup>2</sup>/
        (a<sub>0</sub>T<sub>A</sub>)<sup>2</sup>) is 3&times; the cosh coefficient, since sinh(x)&minus;x
        cancels one order deeper than cosh(x)&minus;1. Through the tested ladder (k&le;24) both stay
        at least SIX orders of magnitude above 1 (sinh: &asymp;7.42e6; cosh: &asymp;2.70e7 at k=24), and
        each reaches 1 only at its own closed-form crossover: k*&#8776;1253 (sinh) before
        k*&#8776;1730 (cosh), both far beyond any tested rung.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Safety margin tail(k)/rho(k) for cosh (imp-3509) vs. sinh (imp-3527), with the closed-form
        crossovers k* marked
      </p>
      <MarginContrastChart />

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
        cancellation-safety of the degree-2 and degree-3 integrand terms across k; it establishes
        no operator positivity. Mass-feasibility is necessary-but-not-sufficient. The
        operator-level K_a &ge; 0 sign-positivity residual (imp-3066) remains untouched. (Min margins measured:
        cosh {IMP3566_MIN_MARGIN_COSH.toExponential(2)}, sinh {IMP3566_MIN_MARGIN_SINH.toExponential(2)}.)
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--ink-faint)' }}>
        <strong>Related:</strong>{' '}
        <Link to="/viz-imp3541-cosh-cancellation-margin" style={{ color: 'var(--series-5)' }}>
          Cosh Cancellation-Safety Margin (imp-3509 / imp-3541)
        </Link>
      </div>
    </div>
  );
}
