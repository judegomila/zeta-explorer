import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { effectiveHeightForN } from '../data/lambda-rh-height-mapping.js';
import { C_C_PINNED } from '../data/polymath15-constant-C-C.js';
import { IMP34926_ITERS_TO_FLOOR_CEIL_BOUNDARY_GEOMETRY as D } from '../data/imp-34926-iters-to-floor-ceil-boundary-geometry.js';
import { ED } from '../styles/tokens.js';

// Reproduces the imp-34926 fixed-point map, log-law constants and ceil-boundary geometry verbatim
// purely to resample the per-seed frac(x) and penultimate-relative-distance values across the
// [1e3,1e18] band for plotting; no new math. Aggregate literals (counts, min/max) are baked from D.
const E_TRUNC_PT = 3.06e-5;
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2;
const EPS_FP = D.constants.eps_fp;

const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
function iterate(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = g(N);
  return N;
}
const N_CROSS_FP = iterate(1e9, 200);
const gPrimeAtStep = (h) => (g(N_CROSS_FP + h) - g(N_CROSS_FP - h)) / (2 * h);
const R_CONTRACT = Math.abs(gPrimeAtStep(1));
const LN_INV_R = Math.log(1 / R_CONTRACT);
const collapseDist = (seed) => Math.abs(g(seed) - N_CROSS_FP) / N_CROSS_FP;
const xArg = (seed) => Math.log(collapseDist(seed) / EPS_FP) / LN_INV_R;
const itersToFloorPredicted = (seed) => 1 + Math.ceil(xArg(seed));
function itersToFloorMeasured(seed, cap = 500) {
  let N = seed;
  let k = 0;
  while (k < cap) {
    N = g(N);
    k++;
    if (N === N_CROSS_FP) break;
  }
  return k;
}
function ceilBoundaryGeometry(seed, cap = 500) {
  let N = seed;
  let k = 0;
  let penultRelDist = null;
  while (k < cap) {
    const prevRelDist = Math.abs(N - N_CROSS_FP) / N_CROSS_FP;
    N = g(N);
    k++;
    if (N === N_CROSS_FP) {
      penultRelDist = prevRelDist;
      return { mExact: k, penultRelDist };
    }
  }
  return { mExact: null, penultRelDist };
}

// Resample the 301-point [1e3,1e18] 10^0.05 grid and collect the (frac(x), penultRelDist) pair at
// every off-by-one (-1) seed -- reproduces D.wide_band aggregates but keeps the per-seed points.
const OFF_BY_ONE_SEEDS = [];
for (let e = 3; e <= 18 + 1e-9; e += 0.05) {
  const s = Math.pow(10, e);
  const resid = itersToFloorPredicted(s) - itersToFloorMeasured(s);
  if (resid === -1) {
    const x = xArg(s);
    const frac = x - Math.floor(x);
    const geo = ceilBoundaryGeometry(s);
    OFF_BY_ONE_SEEDS.push({ exp: e, frac, penultRelDist: geo.penultRelDist });
  }
}

function FracDistributionChart() {
  const svgW = 720;
  const svgH = 240;
  const padL = 60;
  const padR = 20;
  const padT = 20;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const xMin = 0.5;
  const xMax = 1.0;
  const xAt = (frac) => padL + ((frac - xMin) / (xMax - xMin)) * cW;
  const yAt = (exp) => padT + cH - ((exp - 6) / (12 - 6)) * cH;
  const xTicks = [0.5, 0.6, 0.7, 0.8, 0.9, 1.0];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      {xTicks.map((t) => (
        <g key={t}>
          <line x1={xAt(t)} y1={padT + cH} x2={xAt(t)} y2={padT + cH + 4} stroke={ED.rule} strokeWidth={1} />
          <text x={xAt(t)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {t.toFixed(1)}
          </text>
        </g>
      ))}
      <line
        x1={xAt(D.summary.ceil_boundary_geometry.minus_one_frac_x_lo)}
        y1={padT}
        x2={xAt(D.summary.ceil_boundary_geometry.minus_one_frac_x_lo)}
        y2={padT + cH}
        stroke={ED.brassDeco}
        strokeWidth={1}
        strokeDasharray="4 3"
      />
      <line
        x1={xAt(D.summary.ceil_boundary_geometry.minus_one_frac_x_hi)}
        y1={padT}
        x2={xAt(D.summary.ceil_boundary_geometry.minus_one_frac_x_hi)}
        y2={padT + cH}
        stroke={ED.brassDeco}
        strokeWidth={1}
        strokeDasharray="4 3"
      />
      {OFF_BY_ONE_SEEDS.map((p, i) => (
        <circle key={i} cx={xAt(p.frac)} cy={yAt(p.exp)} r={3.5} fill={ED.series2} opacity={0.85} />
      ))}
      <text x={padL + cW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        frac(x) of each off-by-one seed (dot height = log10(seed)) -- clustered in [0.5622, 0.9986]
      </text>
    </svg>
  );
}

function PenultDistanceChart() {
  const svgW = 720;
  const svgH = 240;
  const padL = 70;
  const padR = 20;
  const padT = 20;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const xMin = 6;
  const xMax = 12;
  const yMinLog = -17;
  const yMaxLog = -15.5;
  const xAt = (exp) => padL + ((exp - xMin) / (xMax - xMin)) * cW;
  const yAt = (dist) => padT + cH - ((Math.log10(dist) - yMinLog) / (yMaxLog - yMinLog)) * cH;
  const yTicks = [-17, -16.5, -16, -15.5];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      {yTicks.map((t) => (
        <g key={t}>
          <line x1={padL - 4} y1={yAt(Math.pow(10, t))} x2={padL} y2={yAt(Math.pow(10, t))} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yAt(Math.pow(10, t)) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            1e{t.toFixed(1)}
          </text>
        </g>
      ))}
      <line x1={padL} y1={yAt(EPS_FP)} x2={padL + cW} y2={yAt(EPS_FP)} stroke={ED.series1} strokeWidth={1.5} strokeDasharray="5 3" />
      <text x={padL + cW - 4} y={yAt(EPS_FP) - 6} textAnchor="end" fill={ED.series1} fontSize={9.5} fontWeight={700}>
        EPS_FP floor = {EPS_FP.toExponential(2)}
      </text>
      {OFF_BY_ONE_SEEDS.filter((p) => p.penultRelDist !== null).map((p, i) => (
        <circle key={i} cx={xAt(p.exp)} cy={yAt(p.penultRelDist)} r={3.5} fill={ED.series3} opacity={0.85} />
      ))}
      <text x={padL + cW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        penultimate relative distance at each off-by-one seed (log10 seed on x) -- every point sits below the EPS_FP floor
      </text>
    </svg>
  );
}

export default function Imp34965ItersToFloorCeilBoundaryGeometryViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Iters-to-Floor Ceil-Boundary Geometry (imp-34965 / imp-34926)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {D.question}
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        frac(x) at each of the {D.summary.wide_band_off_by_one} off-by-one seeds across the widened
        [1e3,1e18] band -- every point sits in the TOP of the ceil cell, between{' '}
        {D.summary.ceil_boundary_geometry.minus_one_frac_x_lo.toFixed(4)} and{' '}
        {D.summary.ceil_boundary_geometry.minus_one_frac_x_hi.toFixed(4)} (dashed guides), the
        geometry of a single-rate prediction that falls one iterate short.
      </p>
      <FracDistributionChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.5rem' }}>
        The penultimate relative distance -- the last non-zero relative distance to N_CROSS_FP before
        bit-collapse -- at every off-by-one seed sits strictly below the EPS_FP model floor (dashed
        line), the decisive witness that the floor is conservative and the terminal ceil can only ever
        round down (max {D.summary.ceil_boundary_geometry.max_penultimate_rel_dist.toExponential(4)}).
      </p>
      <PenultDistanceChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page resampling the
        imp-34926 fixed-point map and ceil-boundary geometry on the same [1e3,1e18] 10^0.05 grid (no
        new math; aggregate counts and bounds baked from imp-34926). MEASUREMENT / ASSESSMENT ONLY on
        the inherited imp-3220/imp-3406 surrogate map, IEEE-754 double precision, no interval
        enclosure. The C_C 1/8 ansatz (imp-2642/imp-2643) and the C_mb GUE-conditional per imp-486 are
        UNTOUCHED; imp-3066 K_a&ge;0 untouched; changes no bound; establishes no operator positivity;
        no RH verdict, NO QED. Named residual
        sub-gap imp-34926a (uniform-in-N ceil(x) &le; m_exact) remains OPEN.
      </div>
    </div>
  );
}
