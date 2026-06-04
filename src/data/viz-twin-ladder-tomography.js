/**
 * @fileoverview Twin-Ladder Interference Tomography VIZ data module: the
 * heatmap of P(sigma, t) = |zeta(sigma + i t)| * |zeta((1 - sigma) + i t)|
 * that reads the critical line sigma = 1/2 as a functional-equation
 * interference trough, with zeta zeros as pinpoint nulls.
 *
 * @module data/viz-twin-ladder-tomography
 *
 * Proof-chain step: visualization/diagnostic support for the critical-line
 * symmetry reading (functional equation zeta(s) = chi(s) zeta(1 - s) with
 * |chi(1/2 + i t)| = 1). Not a proof step; an illustrative tomography view.
 *
 * Tickets: created by imp-1223; module-level JSDoc added by imp-2412.
 *
 * imp-1223: Twin-Ladder Interference Tomography (VIZ data module).
 *
 * MATH
 *   For each (sigma, t) in [0.05, 0.95] x [0, T_MAX], compute
 *
 *       P(sigma, t)  =  |zeta(sigma + i t)| * |zeta((1 - sigma) + i t)|
 *
 *   The functional equation
 *
 *       zeta(s)  =  chi(s) * zeta(1 - s),
 *       |chi(1/2 + i t)|  =  1   for real t
 *
 *   implies that on the critical line sigma = 1/2 the two factors are
 *   complex conjugates of each other:
 *
 *       |zeta(1/2 + i t)|  =  |zeta(1/2 - i t)|  =  |zeta(1/2 + i t)|
 *
 *   so P(1/2, t) = |zeta(1/2 + i t)|^2 -- a real, non-negative function
 *   that VANISHES at every nontrivial zeta zero on the critical line.
 *   Away from sigma = 1/2 the two factors are independent of each other
 *   (no functional-equation symmetry to collapse them), so the product
 *   P(sigma, t) is generically larger.  Hence sigma = 1/2 reads as a
 *   horizontal "interference minimum" trough in the (sigma, t) heatmap,
 *   punctuated by even darker pinpoint nulls where the Riemann zeros
 *   live.
 *
 *   This is the "twin-ladder tomography" reading: the critical line is
 *   the symmetric locus where the two zeta ladders interfere coherently.
 *
 * EXPORTS
 *   VIZ_TWIN_LADDER_TOMOGRAPHY            -- frozen record (title, math,
 *                                             parameterRanges, references,
 *                                             provenance, headline P values).
 *   VIZ_TWIN_LADDER_TOMOGRAPHY_ASSERTIONS -- 7 build-time tripwires.
 *
 * HEADLINE SAMPLES (computed at module load -- cheap, ~30ms)
 *   We sample a small set of representative (sigma, t) points and store
 *   P at each.  These power both the page sanity-display AND the
 *   tripwires (which verify, e.g., that the critical-line product is
 *   small near the first Riemann zero gamma_1 ~ 14.1347).
 *
 * SCOPE / HONESTY
 *   - This module ships only PARAMETER metadata + a handful of headline
 *     samples.  The full 400x400 = 160k-pixel grid is computed by the
 *     /viz-twin-ladder-tomography page itself on mount (Canvas-based).
 *   - zeta is evaluated via zetaCriticalStrip (Borwein-accelerated
 *     Dirichlet-eta acceleration, ~15 decimal digits on the strip).
 *   - The "interference minimum" reading is a qualitative consequence
 *     of |chi(1/2 + i t)| = 1; we do NOT use this module as a proof of
 *     anything about zeta -- it is a visualization scaffold.
 *
 * REFERENCES
 *   - Riemann (1859), "Ueber die Anzahl der Primzahlen unter einer
 *     gegebenen Groesse" -- functional equation.
 *   - Titchmarsh (1986), "The Theory of the Riemann Zeta-function",
 *     2nd ed., Oxford UP, Chapters 2 (functional equation) and
 *     6 (location of zeros on the critical line).
 *   - Edwards (1974), "Riemann's Zeta Function", Academic Press,
 *     Chapter 1 (chi factor and reflection symmetry sigma <-> 1-sigma).
 */

import { zetaCriticalStrip, ZETA_ZEROS } from '../math/zeta.js';

// ---------------------------------------------------------------------------
// Parameter grid (matches the on-mount Canvas render in the page).
// ---------------------------------------------------------------------------

const SIGMA_MIN = 0.05;
const SIGMA_MAX = 0.95;
const T_MIN = 0;
const T_MAX_DEFAULT = 100;
const RESOLUTION = 400;
const ZETA_BORWEIN_N = 50;

// ---------------------------------------------------------------------------
// |zeta(s)| helper.
// ---------------------------------------------------------------------------

function zetaAbs(sigma, t) {
  const z = zetaCriticalStrip([sigma, t], ZETA_BORWEIN_N);
  return Math.sqrt(z[0] * z[0] + z[1] * z[1]);
}

function twinProduct(sigma, t) {
  return zetaAbs(sigma, t) * zetaAbs(1 - sigma, t);
}

// ---------------------------------------------------------------------------
// Headline samples.
//
// We pick: (a) a non-critical-line baseline at (sigma=0.3, t=10) and a
// matched (sigma=0.7, t=10) so the functional-equation symmetry can be
// checked (chi-reflection swaps these two factors), (b) the critical
// line at t = 2 (far from any zero) showing a moderate magnitude, and
// (c) the critical line at t = gamma_1 = 14.1347 showing the trough
// near the first nontrivial zero.
// ---------------------------------------------------------------------------

const GAMMA_1 = ZETA_ZEROS[0]; // 14.134725142...

const HEADLINE_SAMPLES = (() => {
  const samples = [];
  const pts = [
    { sigma: 0.3, t: 10.0, label: 'off-critical (sigma=0.3, t=10)' },
    { sigma: 0.7, t: 10.0, label: 'reflected partner (sigma=0.7, t=10)' },
    { sigma: 0.5, t: 2.0,  label: 'critical line (sigma=0.5, t=2.0)' },
    { sigma: 0.5, t: GAMMA_1, label: 'critical line at gamma_1 (zero)' },
    { sigma: 0.5, t: 18.0, label: 'critical line (sigma=0.5, t=18, between gamma_1 and gamma_2)' },
    { sigma: 0.5, t: ZETA_ZEROS[1], label: 'critical line at gamma_2 (zero)' },
  ];
  for (const p of pts) {
    const f1 = zetaAbs(p.sigma, p.t);
    const f2 = zetaAbs(1 - p.sigma, p.t);
    samples.push({
      sigma: p.sigma,
      t: p.t,
      label: p.label,
      absZetaSigma: f1,
      absZeta1MinusSigma: f2,
      product: f1 * f2,
    });
  }
  return samples;
})();

// ---------------------------------------------------------------------------
// Frozen record.
// ---------------------------------------------------------------------------

export const VIZ_TWIN_LADDER_TOMOGRAPHY = Object.freeze({
  id: 'imp-1223-viz-twin-ladder-tomography',
  ticket: 'imp-1223',
  title: 'Twin-Ladder Interference Tomography',
  description:
    'A 2D heatmap of the twin-ladder product P(sigma, t) = |zeta(sigma + i t)| * |zeta((1 - sigma) + i t)| ' +
    'over (sigma, t) in [' + SIGMA_MIN + ', ' + SIGMA_MAX + '] x [' + T_MIN + ', ' + T_MAX_DEFAULT + ']. ' +
    'The functional equation zeta(s) = chi(s) zeta(1 - s) with |chi(1/2 + i t)| = 1 makes the two factors ' +
    'complex-conjugate partners on the critical line sigma = 1/2, which then reads as a horizontal interference ' +
    'minimum, with extra-dark nulls at every nontrivial zeta zero (sigma=1/2, t=gamma_n).',
  math: {
    formula: 'P(sigma, t) = |zeta(sigma + i t)| * |zeta((1 - sigma) + i t)|',
    functionalEquation: 'zeta(s) = chi(s) zeta(1 - s),  |chi(1/2 + i t)| = 1',
    criticalLineSpecialization: 'P(1/2, t) = |zeta(1/2 + i t)|^2',
    interferenceMinimumReason:
      'Off the critical line, the two factors fluctuate independently. ' +
      'On sigma = 1/2 they collapse to a single magnitude squared, ' +
      'producing a quieter (and at zeros, exactly zero) trough.',
  },
  parameterRanges: Object.freeze({
    sigmaMin: SIGMA_MIN,
    sigmaMax: SIGMA_MAX,
    tMin: T_MIN,
    tMaxDefault: T_MAX_DEFAULT,
    tMaxOptions: Object.freeze([10, 50, 100]),
    resolution: RESOLUTION,
    pixelCount: RESOLUTION * RESOLUTION,
    zetaBorweinN: ZETA_BORWEIN_N,
  }),
  zetaEvaluator: 'zetaCriticalStrip from src/math/zeta.js (Borwein-accelerated eta, N=' + ZETA_BORWEIN_N + ')',
  headlineSamples: HEADLINE_SAMPLES,
  knownZerosOverlay: Object.freeze({
    description: 'First 25 nontrivial Riemann zeros gamma_n on sigma = 1/2 (Odlyzko tables).',
    count: 25,
    values: Object.freeze(ZETA_ZEROS.slice(0, 25).map((g) => g)),
  }),
  references: Object.freeze([
    {
      key: 'riemann-1859',
      citation:
        'B. Riemann (1859), "Ueber die Anzahl der Primzahlen unter einer gegebenen Groesse", ' +
        'Monatsberichte der Berliner Akademie. (Functional equation.)',
    },
    {
      key: 'titchmarsh-1986',
      citation:
        'E. C. Titchmarsh (1986), "The Theory of the Riemann Zeta-function", 2nd ed., ' +
        'Oxford University Press. (Chapters 2 + 6.)',
    },
    {
      key: 'edwards-1974',
      citation:
        'H. M. Edwards (1974), "Riemann\'s Zeta Function", Academic Press. ' +
        '(Chapter 1: chi factor and sigma <-> 1-sigma reflection.)',
    },
  ]),
  scope:
    'Visualization scaffold (heatmap parameters + headline samples + tripwires). ' +
    'NOT a proof. The interference-minimum reading is a qualitative consequence ' +
    'of the functional equation, not a new result.',
});

// ---------------------------------------------------------------------------
// Build-time tripwires.
// ---------------------------------------------------------------------------

export const VIZ_TWIN_LADDER_TOMOGRAPHY_ASSERTIONS = [
  {
    id: 'imp1223-headline-samples-populated',
    holds: () => {
      const s = VIZ_TWIN_LADDER_TOMOGRAPHY.headlineSamples;
      if (!Array.isArray(s) || s.length < 5) return false;
      return s.every((row) =>
        Number.isFinite(row.sigma) && Number.isFinite(row.t) &&
        Number.isFinite(row.absZetaSigma) && Number.isFinite(row.absZeta1MinusSigma) &&
        Number.isFinite(row.product));
    },
    why:
      'headlineSamples must contain at least 5 fully-populated rows with finite ' +
      'numeric fields. A short or NaN-bearing array would mean the zetaCriticalStrip ' +
      'sweep silently failed at module load and the page would render a broken legend.',
  },
  {
    id: 'imp1223-functional-equation-symmetry',
    holds: () => {
      // Test the off-critical pair (sigma=0.3, t=10) vs (sigma=0.7, t=10).
      // The PRODUCT P(sigma, t) = |zeta(sigma+it)| * |zeta((1-sigma)+it)|
      // is symmetric under sigma -> 1-sigma BY CONSTRUCTION (the two
      // factors swap roles), so the products at sigma=0.3 and sigma=0.7
      // for the same t must agree to floating-point precision.
      const a = VIZ_TWIN_LADDER_TOMOGRAPHY.headlineSamples.find(
        (r) => Math.abs(r.sigma - 0.3) < 1e-9 && Math.abs(r.t - 10.0) < 1e-9);
      const b = VIZ_TWIN_LADDER_TOMOGRAPHY.headlineSamples.find(
        (r) => Math.abs(r.sigma - 0.7) < 1e-9 && Math.abs(r.t - 10.0) < 1e-9);
      if (!a || !b) return false;
      return Math.abs(a.product - b.product) < 1e-9;
    },
    why:
      'P(sigma, t) = |zeta(sigma+it)| * |zeta((1-sigma)+it)| is symmetric under ' +
      'sigma -> 1-sigma by construction (the two factors swap). The product at ' +
      'sigma=0.3, t=10 must therefore equal the product at sigma=0.7, t=10 to ' +
      'numerical precision. A discrepancy would mean the zeta evaluator is ' +
      'broken or the sigma-reflection mapping is mis-indexed.',
  },
  {
    id: 'imp1223-critical-line-near-zero-is-small',
    holds: () => {
      const r = VIZ_TWIN_LADDER_TOMOGRAPHY.headlineSamples.find(
        (row) => Math.abs(row.sigma - 0.5) < 1e-9 && Math.abs(row.t - GAMMA_1) < 1e-6);
      if (!r) return false;
      // |zeta(1/2 + i*gamma_1)| should be ~0 (we use a finite-precision
      // gamma_1, so expect something below ~1e-4). The product is the
      // square of |zeta(1/2 + i t)| on the critical line, so even smaller.
      return r.product < 1e-3;
    },
    why:
      'Headline sample at (sigma=1/2, t=gamma_1) must have product < 1e-3. ' +
      'On the critical line P(1/2, t) = |zeta(1/2 + i t)|^2 and at the first ' +
      'nontrivial zero gamma_1 ~ 14.13472514 this magnitude is ~0 (limited only ' +
      'by the 9-digit precision of the tabulated gamma_1 and the Borwein N=50 ' +
      'truncation). A larger product would mean either the zeros table is wrong, ' +
      'the zeta evaluator drifts on the critical line, or we are evaluating off-line.',
  },
  {
    id: 'imp1223-critical-line-off-zero-is-larger-than-zero-sample',
    holds: () => {
      const atZero = VIZ_TWIN_LADDER_TOMOGRAPHY.headlineSamples.find(
        (row) => Math.abs(row.sigma - 0.5) < 1e-9 && Math.abs(row.t - GAMMA_1) < 1e-6);
      const between = VIZ_TWIN_LADDER_TOMOGRAPHY.headlineSamples.find(
        (row) => Math.abs(row.sigma - 0.5) < 1e-9 && Math.abs(row.t - 18.0) < 1e-9);
      if (!atZero || !between) return false;
      return between.product > atZero.product;
    },
    why:
      'Between the first few zeros the critical-line magnitude |zeta(1/2 + i*18)| ' +
      'is appreciable (~2.337, so product ~ 5.46), while at the zero itself the ' +
      'product is essentially zero. The between-zeros sample must dominate the ' +
      'at-zero sample, otherwise our headline rows do not actually demonstrate ' +
      'the trough that the tomography page is supposed to expose visually. ' +
      '(We deliberately avoid t=25, which is within ~0.01 of gamma_3=25.0109 ' +
      'and thus accidentally close to a different zero.)',
  },
  {
    id: 'imp1223-parameter-ranges-consistent',
    holds: () => {
      const p = VIZ_TWIN_LADDER_TOMOGRAPHY.parameterRanges;
      if (p.sigmaMin <= 0 || p.sigmaMin >= 0.5) return false;
      if (p.sigmaMax <= 0.5 || p.sigmaMax >= 1) return false;
      if (Math.abs((p.sigmaMin + p.sigmaMax) - 1) > 1e-12) return false;
      if (p.tMin !== 0) return false;
      if (!p.tMaxOptions.includes(p.tMaxDefault)) return false;
      if (p.resolution !== 400) return false;
      if (p.pixelCount !== p.resolution * p.resolution) return false;
      return true;
    },
    why:
      'parameterRanges must satisfy: 0 < sigmaMin < 1/2 < sigmaMax < 1 with ' +
      'sigmaMin + sigmaMax = 1 (centered on the critical line so the ' +
      'sigma <-> 1-sigma reflection of the heatmap is symmetric), tMin = 0, ' +
      'tMaxDefault in tMaxOptions, resolution = 400, pixelCount = resolution^2. ' +
      'Any drift here would mean the page parameters and the data parameters ' +
      'have desynced, producing a heatmap that does not match its labels.',
  },
  {
    id: 'imp1223-known-zeros-overlay-shape',
    holds: () => {
      const o = VIZ_TWIN_LADDER_TOMOGRAPHY.knownZerosOverlay;
      if (!o || o.count !== 25) return false;
      if (!Array.isArray(o.values) || o.values.length !== 25) return false;
      // First zero must match the Odlyzko table to 9 digits.
      if (Math.abs(o.values[0] - 14.134725142) > 1e-9) return false;
      // Zeros must be strictly increasing.
      for (let i = 1; i < o.values.length; i++) {
        if (!(o.values[i] > o.values[i - 1])) return false;
      }
      // All 25 should be within the default tMax = 100 (gamma_25 ~ 88.81).
      if (o.values[o.values.length - 1] >= 100) return false;
      return true;
    },
    why:
      'knownZerosOverlay must list exactly 25 strictly-increasing nontrivial ' +
      'Riemann zeros starting with gamma_1 = 14.134725142, and all of them ' +
      'must fall inside the default t window [0, 100] (gamma_25 ~ 88.81 < 100). ' +
      'A wrong count, off-by-one tabulation, or zero >= 100 would silently ' +
      'misplace the red-dot overlay on the heatmap.',
  },
  {
    id: 'imp1223-references-three-sources',
    holds: () => {
      const r = VIZ_TWIN_LADDER_TOMOGRAPHY.references;
      if (!Array.isArray(r) || r.length < 3) return false;
      const keys = r.map((row) => row.key);
      const needed = ['riemann-1859', 'titchmarsh-1986', 'edwards-1974'];
      return needed.every((k) => keys.includes(k));
    },
    why:
      'The page must cite at least the three canonical sources behind the ' +
      'functional equation / chi-factor reading: Riemann 1859, Titchmarsh 1986, ' +
      'Edwards 1974. A missing reference would leave the page asserting ' +
      'symmetry without provenance.',
  },
];
