import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { effectiveHeightForN } from '../data/lambda-rh-height-mapping.js';
import { C_C_PINNED } from '../data/polymath15-constant-C-C.js';
import { IMP34949_KRAWCZYK_MARGIN_INFIMUM_BAND_ENDPOINT as D } from '../data/imp-34949-krawczyk-margin-infimum-band-endpoint.js';
import { ED } from '../styles/tokens.js';

// Reproduces the imp-34949 closed forms verbatim (same K_AMPL/DELTA constants, same a(N)/a-prime(N)
// kernels) purely to resample the exact margin m(N) and its delta -> 0 closed form m_0(N) on a dense
// N grid for plotting; no new math. Band bounds and summary literals are baked from D.constants /
// D.measurement.
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
function marginExact(N) {
  const a = aOf(N);
  const ap = aPrime(N);
  const M = N * (1 - DELTA);
  const aM = aOf(M);
  const apM = aPrime(M);
  const up = -ap / ((1 - a) * (2 - a));
  const down = (-apM * (1 - DELTA)) / (1 - aM);
  return 1 - up / down;
}
function marginLimit(N) {
  const a = aOf(N);
  return (1 - a) / (2 - a);
}

const BAND_LO = D.constants.band_lo_N;
const BAND_TOP = D.constants.band_top_N;
const N_CROSS = D.constants.N_cross;
const SAMPLE_POINTS = 200;
const CURVE = [];
for (let i = 0; i <= SAMPLE_POINTS; i++) {
  const N = BAND_LO + ((BAND_TOP - BAND_LO) * i) / SAMPLE_POINTS;
  CURVE.push({ N, m: marginExact(N), m0: marginLimit(N) });
}
const INFIMUM = D.measurement.margin_infimum_exact; // ~0.4878337, attained at band-lo

// The exact margin m(N), monotonically rising across the band, boundary infimum at band-lo.
function MarginChart() {
  const svgW = 720;
  const svgH = 260;
  const padL = 70;
  const padR = 20;
  const padT = 20;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const yMin = 0.4875;
  const yMax = 0.4895;
  const xAt = (N) => padL + ((N - BAND_LO) / (BAND_TOP - BAND_LO)) * cW;
  const yAt = (v) => padT + cH - ((v - yMin) / (yMax - yMin)) * cH;

  const path = CURVE.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xAt(p.N)},${yAt(p.m)}`).join(' ');
  const yTicks = [0.4875, 0.488, 0.4885, 0.489, 0.4895];

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
      <line x1={padL} y1={yAt(INFIMUM)} x2={padL + cW} y2={yAt(INFIMUM)} stroke={ED.brassDeco} strokeWidth={1} strokeDasharray="4 3" />
      <path d={path} fill="none" stroke={ED.series1} strokeWidth={2} />
      <circle cx={xAt(BAND_LO)} cy={yAt(CURVE[0].m)} r={4} fill={ED.brassDeco} stroke={ED.paper} strokeWidth={1} />
      <circle cx={xAt(N_CROSS)} cy={yAt(marginExact(N_CROSS))} r={4} fill={ED.series1} stroke={ED.paper} strokeWidth={1} />
      <text x={xAt(BAND_LO) + 6} y={yAt(CURVE[0].m) + 14} fill={ED.brass} fontSize={9.5} fontWeight={700}>
        infimum {INFIMUM.toFixed(7)} (band-lo)
      </text>
      <text x={xAt(N_CROSS)} y={yAt(marginExact(N_CROSS)) - 8} textAnchor="middle" fill={ED.series1} fontSize={9}>
        N_cross
      </text>
      <text x={padL + cW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        exact margin m(N) across the widest imp-34693 k={D.constants.widest_band_k} band -- strictly
        increasing, boundary infimum at band-lo
      </text>
    </svg>
  );
}

// The finite-delta perturbation |m(N) - m_0(N)|, three orders of magnitude below the margin itself.
function PerturbationChart() {
  const svgW = 720;
  const svgH = 220;
  const padL = 70;
  const padR = 20;
  const padT = 20;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const scaled = CURVE.map((p) => Math.abs(p.m - p.m0) * 1e4); // units of 1e-4
  const yMax = Math.max(...scaled) * 1.1;
  const xAt = (N) => padL + ((N - BAND_LO) / (BAND_TOP - BAND_LO)) * cW;
  const yAt = (v) => padT + cH - (v / yMax) * cH;

  const path = CURVE.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xAt(p.N)},${yAt(Math.abs(p.m - p.m0) * 1e4)}`).join(' ');
  const yTicks = [0, yMax * 0.5, yMax];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1} />
      {yTicks.map((t) => (
        <g key={t}>
          <line x1={padL - 4} y1={yAt(t)} x2={padL} y2={yAt(t)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yAt(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {t.toFixed(2)}
          </text>
        </g>
      ))}
      <path d={path} fill="none" stroke={ED.series2} strokeWidth={2} />
      <text x={padL + cW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        |m(N) - m&#8320;(N)| across the band, units of 1e-4 -- peaks at{' '}
        {D.measurement.max_abs_delta_perturbation}, three orders below the ~0.488 margin
      </text>
    </svg>
  );
}

export default function Imp34999KrawczykMarginInfimumBandEndpointViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Krawczyk Monotonicity-Margin Infimum (imp-34999 / imp-34949)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {D.question}
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        The exact closed-form margin m(N) = 1 - a&prime;(N)(1-a(M)) / [a&prime;(M)(1-&delta;)
        (1-a(N))(2-a(N))], M = N(1-&delta;), resampled across the widest imp-34693 k=
        {D.constants.widest_band_k} band: strictly increasing, with the boundary-attained worst-case
        infimum {INFIMUM.toFixed(7)} at band-lo (matching the imp-34929 sampled 0.487834).
      </p>
      <MarginChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.5rem' }}>
        The O(&delta; &asymp; 2e-4) correction between the exact margin m(N) and the &delta; &rarr; 0
        closed form m&#8320;(N) = (1-a)/(2-a) = V/(1+V) stays roughly three orders of magnitude below
        the margin itself, so it cannot close the gap to a sign flip.
      </p>
      <PerturbationChart />

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
        imp-34949 closed-form exact margin m(N) and its &delta; &rarr; 0 limit m&#8320;(N) on a dense
        grid (no new math; band bounds and infimum baked from imp-34949). Derivation/measurement only
        on the inherited imp-3220/imp-3406 surrogate crossover map; the headroom rests on the
        gamma(n)/k eps surrogate models of the imp-34687a directed-rounding layer, not the layer
        itself; sub-gap imp-34714a REMAINS OPEN and F(m)=0 stays a double-precision artifact. C_C 1/8
        ansatz (imp-2642/imp-2643) and C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a&ge;0
        untouched; changes no bound; establishes no operator positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
