import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { effectiveHeightForN } from '../data/lambda-rh-height-mapping.js';
import { C_C_PINNED } from '../data/polymath15-constant-C-C.js';
import { IMP34929_KRAWCZYK_HEADROOM_MONOTONICITY_DERIVATIVE as D } from '../data/imp-34929-krawczyk-headroom-monotonicity-derivative.js';
import { ED } from '../styles/tokens.js';

// Reproduces the imp-34929 closed forms verbatim (same K_AMPL/DELTA constants, same a(N)/a-prime(N)
// kernels) purely to resample d(log S)/dN and its two competing terms on a dense N grid for plotting;
// no new math. Band bounds and summary literals are baked from D.constants / D.sweep / D.endpoints.
const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5;
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2;
const DELTA = 2e-4;

const aOf = (N) => {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return (TWO_PI * K_AMPL) / (T * u);
};
const aPrime = (N) => {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return (-4 * Math.PI * Math.PI * K_AMPL * (u + 1)) / (T * T * u * u * u);
};
function logDerivAt(N) {
  const G = 1 - aOf(N);
  const Gp = -aPrime(N);
  const M = N * (1 - DELTA);
  const FP_LO = 1 - aOf(M);
  const FPp = -aPrime(M) * (1 - DELTA);
  const up = Gp / (G * (1 + G));
  const down = FPp / FP_LO;
  return { up, down, dLnS: up - down, relMargin: 1 - up / down };
}

const BAND_LO = D.constants.band_lo_N;
const BAND_TOP = D.constants.band_top_N;
const N_CROSS = D.constants.N_cross;
const SAMPLE_POINTS = 200;
const CURVE = [];
for (let i = 0; i <= SAMPLE_POINTS; i++) {
  const N = BAND_LO + ((BAND_TOP - BAND_LO) * i) / SAMPLE_POINTS;
  CURVE.push({ N, ...logDerivAt(N) });
}
const WORST_REL_MARGIN = D.sweep.worst_case_relative_margin; // ~0.487834, attained at band-lo (imp-34949)

// d(log S)/dN across the band -- stays strictly negative, no interior turning point.
function LogDerivativeChart() {
  const svgW = 720;
  const svgH = 260;
  const padL = 70;
  const padR = 20;
  const padT = 20;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const scaled = CURVE.map((p) => p.dLnS * 1e12); // units of 1e-12
  const yMin = Math.min(...scaled) * 1.08;
  const yMax = 0;
  const xAt = (N) => padL + ((N - BAND_LO) / (BAND_TOP - BAND_LO)) * cW;
  const yAt = (v) => padT + cH - ((v - yMin) / (yMax - yMin)) * cH;

  const path = CURVE.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xAt(p.N)},${yAt(p.dLnS * 1e12)}`).join(' ');
  const yTicks = [yMin, yMin * 0.75, yMin * 0.5, yMin * 0.25, 0];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={yAt(0)} x2={padL + cW} y2={yAt(0)} stroke={ED.rule} strokeWidth={1} strokeDasharray="3 3" />
      {yTicks.map((t) => (
        <g key={t}>
          <line x1={padL - 4} y1={yAt(t)} x2={padL} y2={yAt(t)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yAt(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {t.toFixed(1)}
          </text>
        </g>
      ))}
      <path d={path} fill="none" stroke={ED.series2} strokeWidth={2} />
      <circle cx={xAt(N_CROSS)} cy={yAt(logDerivAt(N_CROSS).dLnS * 1e12)} r={4} fill={ED.series1} stroke={ED.paper} strokeWidth={1} />
      <text x={xAt(N_CROSS)} y={yAt(logDerivAt(N_CROSS).dLnS * 1e12) - 8} textAnchor="middle" fill={ED.series1} fontSize={9}>
        N_cross
      </text>
      <text x={padL + cW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        N across the widest imp-34693 k={D.constants.widest_band_k} band -- d(log S)/dN, units of 1e-12 (stays below zero)
      </text>
    </svg>
  );
}

// The two competing terms: UP-push G-prime/(G(1+G)) vs DOWN-push FP_LO-prime/FP_LO. DOWN always
// above UP, and the 1/(1+G) damping keeps the gap from closing across the whole band.
function CompetingTermsChart() {
  const svgW = 720;
  const svgH = 260;
  const padL = 70;
  const padR = 20;
  const padT = 20;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const upScaled = CURVE.map((p) => p.up * 1e12);
  const downScaled = CURVE.map((p) => p.down * 1e12);
  const yMin = Math.min(...upScaled) * 0.9;
  const yMax = Math.max(...downScaled) * 1.08;
  const xAt = (N) => padL + ((N - BAND_LO) / (BAND_TOP - BAND_LO)) * cW;
  const yAt = (v) => padT + cH - ((v - yMin) / (yMax - yMin)) * cH;

  const upPath = CURVE.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xAt(p.N)},${yAt(p.up * 1e12)}`).join(' ');
  const downPath = CURVE.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xAt(p.N)},${yAt(p.down * 1e12)}`).join(' ');
  const yTicks = [yMin, (yMin + yMax) / 2, yMax];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1} />
      {yTicks.map((t) => (
        <g key={t}>
          <line x1={padL - 4} y1={yAt(t)} x2={padL} y2={yAt(t)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yAt(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {t.toFixed(1)}
          </text>
        </g>
      ))}
      <path d={downPath} fill="none" stroke={ED.series2} strokeWidth={2} />
      <path d={upPath} fill="none" stroke={ED.series3} strokeWidth={2} />
      <text x={padL + 6} y={yAt(downScaled[0]) - 6} fill={ED.series2} fontSize={9.5} fontWeight={700}>
        DOWN-push: FP_LO&prime;/FP_LO
      </text>
      <text x={padL + 6} y={yAt(upScaled[0]) + 14} fill={ED.series3} fontSize={9.5} fontWeight={700}>
        UP-push: G&prime;/(G(1+G))
      </text>
      <text x={padL + cW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        N across the band -- both terms, units of 1e-12 (DOWN stays strictly above UP everywhere)
      </text>
    </svg>
  );
}

// The relative margin 1 - up/down stays bounded well away from zero across the whole band --
// the worst case (~0.4878, attained at band-lo per imp-34949) is far from a sign flip.
function RelativeMarginChart() {
  const svgW = 720;
  const svgH = 200;
  const padL = 70;
  const padR = 20;
  const padT = 20;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const margins = CURVE.map((p) => p.relMargin);
  const yMin = 0.485;
  const yMax = 0.492;
  const xAt = (N) => padL + ((N - BAND_LO) / (BAND_TOP - BAND_LO)) * cW;
  const yAt = (v) => padT + cH - ((v - yMin) / (yMax - yMin)) * cH;
  const path = CURVE.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xAt(p.N)},${yAt(p.relMargin)}`).join(' ');
  const yTicks = [0.485, 0.4878, 0.4895, 0.492];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      {yTicks.map((t) => (
        <g key={t}>
          <line x1={padL - 4} y1={yAt(t)} x2={padL + cW} y2={yAt(t)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yAt(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {t.toFixed(4)}
          </text>
        </g>
      ))}
      <line x1={padL} y1={yAt(WORST_REL_MARGIN)} x2={padL + cW} y2={yAt(WORST_REL_MARGIN)} stroke={ED.brassDeco} strokeWidth={1} strokeDasharray="4 3" />
      <path d={path} fill="none" stroke={ED.series1} strokeWidth={2} />
      <text x={padL + cW - 4} y={yAt(WORST_REL_MARGIN) - 6} textAnchor="end" fill={ED.brass} fontSize={9.5} fontWeight={700}>
        worst-case {WORST_REL_MARGIN.toFixed(6)}
      </text>
      <text x={padL + cW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        relative margin 1 - up/down across the band (bounded away from zero, no sign flip)
      </text>
    </svg>
  );
}

export default function Imp34962KrawczykHeadroomMonotonicityDerivativeViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Krawczyk Headroom Monotonicity Derivative (imp-34962 / imp-34929)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {D.question}
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        d(log S)/dN, resampled from the closed form across the widest imp-34693 k=
        {D.constants.widest_band_k} band, stays strictly negative throughout -- no interior turning
        point, matching the {D.sweep.sweep_points}-point sweep baked into imp-34929.
      </p>
      <LogDerivativeChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.5rem' }}>
        The two competing terms: the DOWN-push FP_LO&prime;/FP_LO stays strictly above the UP-push
        G&prime;/(G(1+G)) everywhere -- the 1/(1+G) damping factor keeps the UP-push weaker, forcing
        S = star_over_H2 to decrease across the whole band.
      </p>
      <CompetingTermsChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.5rem' }}>
        The relative margin 1 - up/down (&asymp; V/(1+V)) stays bounded in a narrow band around{' '}
        {WORST_REL_MARGIN.toFixed(4)}, far from the zero that would signal a sign flip -- reproducing
        the {D.constants.sweep_points}-point imp-34929 sweep worst case verbatim.
      </p>
      <RelativeMarginChart />

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
        imp-34929 closed-form d(log S)/dN and its two competing terms on a dense grid (no new math;
        band bounds and worst-case margin baked from imp-34929). Derivation/measurement only on the
        inherited imp-3220/imp-3406 surrogate crossover map; star_over_H2 rests on the gamma(n)/k eps
        surrogate models of the imp-34687a directed-rounding layer, not the layer itself; sub-gap
        imp-34714a REMAINS OPEN and F(m)=0 stays a double-precision artifact. C_C 1/8 ansatz
        (imp-2642/imp-2643) and C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a&ge;0
        untouched; changes no bound; establishes no operator positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
