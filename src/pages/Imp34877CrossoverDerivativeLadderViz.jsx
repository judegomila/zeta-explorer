import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { effectiveHeightForN } from '../data/lambda-rh-height-mapping.js';
import { C_C_PINNED } from '../data/polymath15-constant-C-C.js';
import { IMP34842_CROSSOVER_GPPPP5_FIFTH_DERIV_FOURTH_BAND } from '../data/imp-34842-crossover-gpppp5-fifth-deriv-fourth-band.js';
import { ED } from '../styles/tokens.js';

const D = IMP34842_CROSSOVER_GPPPP5_FIFTH_DERIV_FOURTH_BAND;

// Reproduces the imp-34842/imp-34822/imp-34793/imp-34768/imp-34731 closed forms verbatim
// (same constants, same band) purely to sample the four curves for plotting; no new math.
const TWO_PI = 2 * Math.PI;
const PI2 = Math.PI * Math.PI;
const PI3 = PI2 * Math.PI;
const PI4 = PI2 * PI2;
const PI5 = PI4 * Math.PI;
const E_TRUNC_PT = 3.06e-5;
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2;

function gDoublePrime(N) {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return -(4 * PI2 * K_AMPL * (u + 1)) / (T * T * u ** 3);
}
function gTriplePrime(N) {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return (8 * PI3 * K_AMPL * (2 * u * u + 4 * u + 3)) / (T ** 3 * u ** 5);
}
function gQuadruplePrime(N) {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return -(16 * PI4 * K_AMPL * (6 * u ** 3 + 18 * u * u + 25 * u + 15)) / (T ** 4 * u ** 7);
}
function gFifthDeriv(N) {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return (32 * PI5 * K_AMPL * (24 * u ** 4 + 96 * u ** 3 + 190 * u * u + 210 * u + 105)) / (T ** 5 * u ** 9);
}

const [BAND_LO, BAND_HI] = D.fourthBand;
const SAMPLES = 60;
const NS = Array.from({ length: SAMPLES }, (_, i) => BAND_LO * Math.pow(BAND_HI / BAND_LO, i / (SAMPLES - 1)));

const SERIES = [
  { key: 'g2', label: "g''", color: ED.series1, fn: gDoublePrime },
  { key: 'g3', label: "g'''", color: ED.brass, fn: gTriplePrime },
  { key: 'g4', label: 'g⁴ᵇ', color: ED.series2, fn: gQuadruplePrime },
  { key: 'g5', label: 'g⁵ᵇ', color: ED.series3, fn: gFifthDeriv },
];

// Each derivative's magnitude scales differently across the band (T^-n u^{2n-1}), so each curve
// is normalized by its own max |value| on the band -- this makes the sign alternation visible on a
// shared axis without one curve's tiny magnitude vanishing next to the others.
const NORMALIZED = SERIES.map((s) => {
  const vals = NS.map((N) => s.fn(N));
  const maxAbs = Math.max(...vals.map((v) => Math.abs(v)));
  return { ...s, norm: vals.map((v) => v / maxAbs) };
});

function LadderChart() {
  const svgW = 720;
  const svgH = 340;
  const padL = 46;
  const padR = 20;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const xAt = (i) => padL + (i / (SAMPLES - 1)) * cW;
  const yAt = (v) => padT + cH / 2 - (v * cH) / 2.2;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={yAt(0)} x2={padL + cW} y2={yAt(0)} stroke={ED.rule} strokeWidth={1} />

      {[-1, -0.5, 0, 0.5, 1].map((v) => (
        <g key={v}>
          <line x1={padL - 4} y1={yAt(v)} x2={padL + cW} y2={yAt(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yAt(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v}
          </text>
        </g>
      ))}
      {[0, 0.25, 0.5, 0.75, 1].map((f) => (
        <text
          key={'x' + f}
          x={padL + f * cW}
          y={padT + cH + 16}
          textAnchor="middle"
          fill={ED.inkFaint}
          fontSize={9}
        >
          {(BAND_LO * Math.pow(BAND_HI / BAND_LO, f)).toExponential(0)}
        </text>
      ))}

      {NORMALIZED.map((s) => (
        <polyline
          key={s.key}
          points={s.norm.map((v, i) => `${xAt(i)},${yAt(v)}`).join(' ')}
          fill="none"
          stroke={s.color}
          strokeWidth={2}
        />
      ))}

      {NORMALIZED.map((s, idx) => (
        <g key={'legend' + s.key}>
          <line x1={padL + 10 + idx * 90} y1={padT - 12} x2={padL + 28 + idx * 90} y2={padT - 12} stroke={s.color} strokeWidth={2.5} />
          <text x={padL + 32 + idx * 90} y={padT - 8} fill={ED.inkSoft} fontSize={10} fontFamily="monospace">
            {s.label}
          </text>
        </g>
      ))}

      <text x={padL + cW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        N (fourth band, log scale)
      </text>
      <text
        x={12}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 12 ${padT + cH / 2})`}
      >
        value / max|value| on band
      </text>
    </svg>
  );
}

export default function Imp34877CrossoverDerivativeLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Crossover-Map Alternating Derivative-Sign Ladder (imp-34877 / imp-34842)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {D.question}
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Each derivative g&Prime; through g&#8309;&#7495; is normalized by its own max |value| on the band
        [1e12,1e13] so all four fit on one axis. The ladder is a definite -, +, -, + alternation with no
        interior sign change across any of the {D.probes} probes sampled here.
      </p>
      <LadderChart />

      <p style={{ color: 'var(--ink-faint)', fontSize: '0.78rem', marginTop: '0.75rem' }}>
        Ladder signs at the band midpoint: {JSON.stringify(D.ladderSignsAtBandMid)}. The fifth derivative
        stays strictly positive across the whole band (least value {D.fifthDerivLeastOnBand}, greatest{' '}
        {D.fifthDerivGreatestOnBand}), matching the fifth-derivative central-difference stencil to a max
        relative error of {D.maxClosedVsFdRelErrOnBand}.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page recomputing the
        imp-34842/imp-34822/imp-34793/imp-34768/imp-34731 closed forms verbatim on the same band and
        constants (no new computation). Measurement/derivation on the INHERITED imp-3220/imp-3406
        surrogate crossover map; the C_mb GUE-conditional per imp-486 and the C_C 1/8 ansatz
        (imp-2642/imp-2643) are UNTOUCHED; changes no bound; establishes no operator positivity; no RH
        verdict, NO QED.
      </div>
    </div>
  );
}
