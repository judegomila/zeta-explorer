import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34931_SIGMA_KNEE_RAW_TOTAL_CROSSING as D } from '../data/imp-34931-sigma-knee-raw-total-crossing.js';
import { ED } from '../styles/tokens.js';

const CURVE = D.rawTotalCurve; // [{eps, rawTotalRelDev}] over [40,100]
const EPS_5PCT = D.crossings.epsAt5pct; // ~79.24
const EPS_25PCT = D.crossings.epsAt25pct; // ~91.13
const R_DOMB_SYKES = D.radiusContext.dombSykesRadius; // 91
const R_DOMB_SYKES_RANGE = D.radiusContext.dombSykesRange; // [79, 106]
const R_ROOT = D.radiusContext.rootTestRadius; // ~138.74

// Curve of dev(eps) across the convergent window with the two pinned crossings and the
// Domb-Sykes radius marked; the raw literals are baked in imp-34931, no new computation here.
function RawTotalDeviationChart() {
  const svgW = 720;
  const svgH = 320;
  const padL = 56;
  const padR = 24;
  const padT = 20;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const xMin = 35;
  const xMax = 100;
  const yMin = 0;
  const yMax = 0.8;
  const xAt = (eps) => padL + ((eps - xMin) / (xMax - xMin)) * cW;
  const yAt = (dev) => padT + cH - (dev / yMax) * cH;

  const points = CURVE.map((r) => `${xAt(r.eps)},${yAt(r.rawTotalRelDev)}`).join(' ');

  const yTicks = [0, 0.05, 0.25, 0.4, 0.6, 0.8];
  const xTicks = [40, 50, 60, 70, 80, 90, 100];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* axes */}
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      {yTicks.map((t) => (
        <g key={t}>
          <line x1={padL - 4} y1={yAt(t)} x2={padL} y2={yAt(t)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yAt(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {(t * 100).toFixed(0)}%
          </text>
        </g>
      ))}
      {xTicks.map((t) => (
        <g key={t}>
          <line x1={xAt(t)} y1={padT + cH} x2={xAt(t)} y2={padT + cH + 4} stroke={ED.rule} strokeWidth={1} />
          <text x={xAt(t)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {t}
          </text>
        </g>
      ))}

      {/* Domb-Sykes uncertainty band [79,106] intersected with plotted window */}
      <rect
        x={xAt(Math.max(R_DOMB_SYKES_RANGE[0], xMin))}
        y={padT}
        width={xAt(Math.min(R_DOMB_SYKES_RANGE[1], xMax)) - xAt(Math.max(R_DOMB_SYKES_RANGE[0], xMin))}
        height={cH}
        fill={ED.series1}
        opacity={0.06}
      />

      {/* dev(eps) curve */}
      <polyline points={points} fill="none" stroke={ED.series3} strokeWidth={2} />
      {CURVE.map((r) => (
        <circle key={r.eps} cx={xAt(r.eps)} cy={yAt(r.rawTotalRelDev)} r={2.5} fill={ED.series3} />
      ))}

      {/* 5% and 25% reference lines */}
      <line x1={padL} y1={yAt(0.05)} x2={padL + cW} y2={yAt(0.05)} stroke={ED.brassDeco} strokeWidth={1} strokeDasharray="4 3" />
      <line x1={padL} y1={yAt(0.25)} x2={padL + cW} y2={yAt(0.25)} stroke={ED.series2} strokeWidth={1} strokeDasharray="4 3" />

      {/* Domb-Sykes radius R~91 */}
      <line x1={xAt(R_DOMB_SYKES)} y1={padT} x2={xAt(R_DOMB_SYKES)} y2={padT + cH} stroke={ED.series1} strokeWidth={1.5} strokeDasharray="2 2" />
      <text x={xAt(R_DOMB_SYKES) + 4} y={padT + 10} fill={ED.series1} fontSize={9}>
        R_DombSykes&asymp;{R_DOMB_SYKES}
      </text>

      {/* pinned crossings */}
      <circle cx={xAt(EPS_5PCT)} cy={yAt(0.05)} r={4.5} fill={ED.brassDeco} stroke={ED.paper} strokeWidth={1} />
      <text x={xAt(EPS_5PCT)} y={yAt(0.05) - 8} textAnchor="middle" fill={ED.brass} fontSize={9}>
        5% @ {EPS_5PCT}
      </text>
      <circle cx={xAt(EPS_25PCT)} cy={yAt(0.25)} r={4.5} fill={ED.series2} stroke={ED.paper} strokeWidth={1} />
      <text x={xAt(EPS_25PCT)} y={yAt(0.25) - 8} textAnchor="middle" fill={ED.series2} fontSize={9}>
        25% @ {EPS_25PCT}
      </text>

      <text x={padL + cW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        eps (bookkeeping point); shaded band = Domb-Sykes uncertainty range [{R_DOMB_SYKES_RANGE[0]},{R_DOMB_SYKES_RANGE[1]}]
      </text>
    </svg>
  );
}

export default function Imp34960RawTotalCrossingViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Raw-Total Resummation-Deviation Crossings (imp-34960 / imp-34931)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {D.question}
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        The raw cross-method resummed-total relative deviation dev(eps) is smooth and monotone
        across [1,~100], crossing 5% at eps &asymp; {EPS_5PCT} and 25% at eps &asymp; {EPS_25PCT}.
        The 25% crossing lands essentially ON the imp-34882 Domb-Sykes radius R &asymp;{' '}
        {R_DOMB_SYKES} ({(D.crossings.cross25OverRDombSykes * 100).toFixed(2)}% of it), and both
        crossings sit far interior to the imp-34863 root-test radius R &asymp; {R_ROOT.toFixed(1)}.
      </p>
      <RawTotalDeviationChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page rendering the
        imp-34931 raw-total resummation-deviation crossing literals verbatim (fine grid, bisected
        5%/25% crossings, radius cross-checks), no new computation. Measurement on the INHERITED
        imp-3220/imp-3406 surrogate crossover map, NOT a rigorous asymptotic; C_mb GUE-conditional
        per imp-486 UNTOUCHED; imp-3066 K_a&ge;0 untouched; far-tail exponent stays 1/2
        (imp-3463); changes no bound; establishes no operator positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
