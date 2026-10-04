import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { effectiveHeightForN } from '../data/lambda-rh-height-mapping.js';
import { C_C_PINNED } from '../data/polymath15-constant-C-C.js';
import { IMP34886_EFLOW_STRENGTH_KNEE_INFLECTION_CROSSING } from '../data/imp-34886-eflow-strength-knee-inflection-crossing.js';
import { ED } from '../styles/tokens.js';

const D = IMP34886_EFLOW_STRENGTH_KNEE_INFLECTION_CROSSING;

// Reproduces the imp-34886/34837/34858/34820/34749 closed forms verbatim (same constants, same kernels)
// purely to resample Gap(s) = X*_knee(s) - X*_infl(s) on a dense s grid for plotting; no new math.
const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5;
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);
const A = C_C_PINNED / E_TRUNC_PT;

function eflowRatio(x) {
  const N = Math.exp(x);
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  return (C_F * (L / T0) * GRONWALL) / E_TRUNC_PT;
}
function Lof(x) {
  return Math.log(effectiveHeightForN(Math.exp(x)));
}
function u0(x) {
  return Math.log(A) + 0.5 * Math.log(Lof(x)) - x / 2;
}
function phi(x, s) {
  return -Math.log(1 + s * eflowRatio(x));
}
function uFull(x, s) {
  return u0(x) + phi(x, s);
}
function sigmaOf(x, s) {
  return 1 / (1 + Math.exp(-uFull(x, s)));
}

const H_ID = 1e-2;
function d1(f, x, h) {
  return (f(x + h) - f(x - h)) / (2 * h);
}
function d2(f, x, h) {
  return (f(x + h) - 2 * f(x) + f(x - h)) / (h * h);
}
function d3(f, x, h) {
  return (f(x + 2 * h) - 2 * f(x + h) + 2 * f(x - h) - f(x - 2 * h)) / (2 * h * h * h);
}
function d2Cond(x, s, h) {
  const S = sigmaOf(x, s);
  const up = d1((z) => uFull(z, s), x, h);
  const upp = d2((z) => uFull(z, s), x, h);
  return (1 - 2 * S) * up * up + upp;
}
function fKnee(x, s, h) {
  const S = sigmaOf(x, s);
  const v = -d1((z) => uFull(z, s), x, h);
  const vp = -d2((z) => uFull(z, s), x, h);
  const vpp = -d3((z) => uFull(z, s), x, h);
  return S * v * v * v * (2 * S - 1) + 3 * S * v * vp + vpp;
}
function bisect(f, a, b) {
  let fa = f(a);
  for (let i = 0; i < 200; i++) {
    const m = 0.5 * (a + b);
    const fm = f(m);
    if (Math.sign(fm) === Math.sign(fa)) {
      a = m;
      fa = fm;
    } else {
      b = m;
    }
  }
  return 0.5 * (a + b);
}
const LN10 = Math.LN10;
const LO = Math.log(1e9);
const HI = Math.log(1e11);
function kneeAt(s) {
  return bisect((x) => fKnee(x, s, H_ID), LO, HI);
}
function inflAt(s) {
  return bisect((x) => d2Cond(x, s, H_ID), LO, HI);
}
function gapAt(s) {
  return (kneeAt(s) - inflAt(s)) / LN10;
}

const SAMPLES = 41;
const S_GRID = Array.from({ length: SAMPLES }, (_, i) => i / (SAMPLES - 1));
const GAP_TRACE = S_GRID.map((s) => gapAt(s));

function GapCrossingChart() {
  const svgW = 720;
  const svgH = 300;
  const padL = 56;
  const padR = 20;
  const padT = 24;
  const padB = 36;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const yMin = Math.min(...GAP_TRACE, 0);
  const yMax = Math.max(...GAP_TRACE, 0);
  const span = yMax - yMin;
  const xAt = (s) => padL + s * cW;
  const yAt = (v) => padT + cH - ((v - yMin) / span) * cH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={yAt(0)} x2={padL + cW} y2={yAt(0)} stroke={ED.rule} strokeWidth={1} strokeDasharray="4 3" />
      <text x={padL - 8} y={yAt(0) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
        0
      </text>

      {[0, 0.25, 0.5, 0.75, 1].map((f) => (
        <text key={'x' + f} x={xAt(f)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          {f}
        </text>
      ))}

      <polyline
        points={S_GRID.map((s, i) => `${xAt(s)},${yAt(GAP_TRACE[i])}`).join(' ')}
        fill="none"
        stroke={ED.series1}
        strokeWidth={2}
      />

      {/* the bisected crossing s* */}
      <line x1={xAt(D.crossing.sStar)} y1={padT} x2={xAt(D.crossing.sStar)} y2={padT + cH} stroke={ED.brassDeco} strokeWidth={1} strokeDasharray="4 3" />
      <circle cx={xAt(D.crossing.sStar)} cy={yAt(0)} r={4.5} fill={ED.brassDeco} />
      <text x={xAt(D.crossing.sStar) + 6} y={padT + 12} fill={ED.brass} fontSize={10} fontFamily="monospace">
        s* = {D.crossing.sStar}
      </text>

      <text x={padL + 6} y={padT + 12} fill={ED.inkSoft} fontSize={10} fontFamily="monospace">
        Gap(0) = {D.endpoints.gapS0Log10} (knee above)
      </text>
      <text x={padL + cW - 6} y={padT + cH - 8} textAnchor="end" fill={ED.inkSoft} fontSize={10} fontFamily="monospace">
        Gap(1) = {D.endpoints.gapS1Log10}
      </text>

      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        E_flow strength s (0 = dropped, 1 = carried)
      </text>
      <text
        x={14}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 14 ${padT + cH / 2})`}
      >
        Gap(s) = X*_knee(s) - X*_infl(s), dex
      </text>
    </svg>
  );
}

export default function Imp34914EflowKneeInflectionCrossingViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="E_flow Strength Knee-vs-Inflection Crossing (imp-34914 / imp-34886)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {D.question}
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Gap(s) = X*_knee(s) - X*_infl(s) starts POSITIVE at s=0 ({D.endpoints.gapS0Log10} dex, knee above the
        inflection) and ends NEGATIVE at s=1 ({D.endpoints.gapS1Log10} dex, flipped), so bisection locates an
        interior crossing at s* = {D.crossing.sStar}, well inside [0,1], where the two landmarks coincide at
        log10 N* = {D.crossing.log10NstarAtCrossing}.
      </p>
      <GapCrossingChart />

      <p style={{ color: 'var(--ink-faint)', fontSize: '0.78rem', marginTop: '0.75rem' }}>
        The crossing is transversal: dGap/ds = {D.sensitivity.dGap_ds} dex per unit strength (the sum of the
        imp-34858 knee slope {D.sensitivity.dKnee_ds0_log10} and the imp-34837 inflection slope{' '}
        {D.sensitivity.dInfl_ds0_log10}, entering with a minus sign), so the linear estimate s* ~
        Gap(0)/|dGap/ds| = {D.crossing.sStarLinearCorroboration} corroborates the bisected root.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page resampling the
        imp-34886/34837/34858/34820/34749 closed forms verbatim across a dense s grid (no new computation).
        Measurement/derivation on the INHERITED imp-3220/imp-3406 surrogate crossover map; the C_mb
        GUE-conditional per imp-486 and the C_C 1/8 ansatz (imp-2642/imp-2643) are UNTOUCHED; changes no
        bound; establishes no operator positivity; far-tail exponent stays 1/2 (imp-3463); no RH verdict, NO
        QED.
      </div>
    </div>
  );
}
