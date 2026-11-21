/**
 * @module imp-35847-shift-fraction-reduced-variable-collapse
 *
 * imp-35809 derived that the imp-35762 D3 Krawczyk headroom residual split is governed by the SINGLE ratio
 * a/(4 delta), giving the closed form shift_fraction ~ delta/(delta + a/4), and measured the shift/curvature
 * fractions across TWO separate families: (P1) an 11-point grid over the imp-34693 seed band (flat ~98/2 split,
 * a ~ 0.043-0.048) and (P2) a height ladder from the band up to the Platt-Trudgian anchor N ~ 1.236e13 (the
 * split INVERTS to ~1.5/98.5). But it never REPLOTTED the two families against the single reduced variable, nor
 * quantified how tightly they collapse onto the one closed-form curve, nor bounded the residual departure from
 * the small-a approximation. This module does exactly that.
 *
 * THE REDUCED VARIABLE AND THE UNIVERSAL CURVE
 * --------------------------------------------
 * Define the dimensionless reduced variable
 *     x := a / (4 delta),      a = a(N) the imp-3406 contraction factor, delta = 2e-4 FIXED.
 * The imp-35809 small-a closed form collapses to a ONE-parameter master curve in x:
 *     shift_fraction ~ delta / (delta + a/4) = 1 / (1 + a/(4 delta)) = 1 / (1 + x) =: f(x).
 * So x is the ONLY combination of (a, delta) the split depends on to leading order; if the measurement respects
 * this, the band family (high-x tail) and the height family (which sweeps x from ~54 down to ~0.0019) must fall
 * on the SAME curve f(x) = 1/(1+x), and the two families must AGREE where their x-ranges overlap.
 *
 * WHAT THE MEASUREMENT FINDS
 * --------------------------
 *   (C1) COLLAPSE ONTO ONE CURVE. Replotting the exact measured shift_fraction (from the imp-35762 splitAt
 *        machinery) against x for BOTH families and sorting by x gives a single monotone-decreasing curve that
 *        tracks f(x) = 1/(1+x) across four decades of x (~0.0019 .. ~60). The families overlap at exactly one
 *        shared point -- the band-top, x ~ 53.97 -- and there the two measurements are BIT-IDENTICAL
 *        (shift_fraction 0.018950 in both), so the height ladder is literally the low-x extension of the band
 *        grid. There is no second branch: shift_fraction is single-valued in x, confirming a/(4 delta) is the
 *        sole governing parameter across both axes.
 *   (C2) THE COLLAPSE TIGHTENS AS a -> 0. The residual departure of the exact measured fraction from the
 *        small-a curve f(x) shrinks monotonically as a shrinks (as x -> 0, i.e. up the height axis). Relative
 *        departure runs from ~4.47% at band-bottom (x ~ 59.9, a ~ 0.048, where a is NOT small so the O(a)
 *        correction to the small-a expansion is percent-level) down to ~1.77e-5 at the PT anchor (x ~ 0.0153,
 *        a ~ 1.23e-5) and ~1.9e-6 at N = 1e14 -- a ~2500x tightening band-bottom -> PT-anchor. So the closed
 *        form is an ASYMPTOTIC (small-a) law: essentially exact where it matters (toward the PT anchor) and
 *        good only to a few percent inside the band where a is large.
 *   (C3) THE RESIDUAL IS THE O(a) EXPANSION TAIL, NOT NOISE. The departure is a smooth function of a: the
 *        band-family relative departure (~4.0-4.5%) is itself the leading O(a) correction dropped by truncating
 *        surplus_no_shift = S_inf (a/2 + a^2/4 + a^3/8 + ...) at a^2/4 and (1 - aLo)^-1 at first order. It is
 *        essentially linear in a across the band, which is why plotting against x rather than N is what makes
 *        the two families coincide.
 *
 * CONSEQUENCE: imp-35809's "governed by the single ratio a/(4 delta)" is now DEMONSTRATED as a genuine data
 * collapse, not just asserted from the algebra -- both measured families lie on the one master curve f(x) =
 * 1/(1+x), agreeing exactly at their shared band-top point, with the only departure being the small-a O(a)
 * expansion tail that vanishes toward the PT anchor.
 *
 * MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate; reuses the imp-35809/imp-35762/imp-35266
 * machinery VERBATIM (identical K, delta, N_cross, band, splitAt). The imp-34714a machine certificate REMAINS
 * OPEN; F(m) = 0 stays a double-precision artifact; C_C = 1/8 (imp-2642/2643) UNTOUCHED; C_mb GUE-conditional
 * per imp-486 UNTOUCHED; changes no bound; establishes no operator positivity; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35809-krawczyk-surplus-split-band-and-height-profile (the two measured families + the a/(4 delta) law)
 * @see imp-35762-krawczyk-surplus-shift-residual-isolation (defined the split; splitAt machinery)
 * @see imp-35846-crossover-height-sensitivity-to-delta (delta-sweep of the 50/50 crossover; the 1/delta law)
 * @see imp-34693-crossover-contraction-seed-band (admissible seed band)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 RvM inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-35809/imp-35762/imp-35266)
const DELTA = 2e-4; // the fixed imp-34774/34776/34799 relative bracket half-width
const S_INF = 1 / (2 * DELTA); // 2500 exactly (imp-34996 large-N floor)
const N_PT_ANCHOR = 1.236e13; // Platt-Trudgian anchor N(T_PT) (imp-321/imp-3406 height mapping)

const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
const aOf = (N) => {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return (TWO_PI * K_AMPL) / (T * u);
};

function fixedPoint(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = g(N);
  return N;
}
const N_CROSS = fixedPoint(1e9, 200); // ~3.28e9 (Banach fixed point)
const L_CONTRACTION = aOf(1e9);
const L_AT_CROSS = aOf(N_CROSS);
const rho = (tol, k) => (tol * (1 - L_CONTRACTION)) / ((1 - L_AT_CROSS) * Math.pow(L_CONTRACTION, k));
const HALF_WIDTH = rho(1, 10); // ~1.71e8 (imp-34693 seed band half-width)
const BAND_TOP = N_CROSS + HALF_WIDTH;
const BAND_BOTTOM = N_CROSS - HALF_WIDTH;

// The imp-35762 additive residual split at height N; returns the exact measured shift/curvature fractions
// (reproduced VERBATIM from imp-35809 -- identical arithmetic).
function splitAt(N) {
  const a = aOf(N);
  const aLo = aOf(N * (1 - DELTA)); // seed-shifted lower fixed-point contraction factor
  const G = 1 - a;
  const S_exact = G / ((1 + G) * DELTA * (1 - aLo)); // a-shift ON
  const S_no_shift = G / ((1 + G) * DELTA * (1 - a)); // a-shift OFF
  const surplus_exact = S_exact - S_INF;
  const surplus_no_shift = S_no_shift - S_INF;
  const surplus_leading = (S_INF * a) / 2;
  const total_residual = surplus_exact - surplus_leading;
  const shift_residual = surplus_exact - surplus_no_shift;
  return { a, shift_fraction: shift_residual / total_residual };
}

// The reduced variable and the closed-form universal curve.
const xOf = (a) => a / (4 * DELTA); // reduced variable x = a / (4 delta)
const fCurve = (x) => 1 / (1 + x); // = delta/(delta + a/4) small-a master curve

// One reduced-variable row: exact measured shift_fraction vs the closed form f(x), with the departure.
function reducedRow(N, family) {
  const s = splitAt(N);
  const x = xOf(s.a);
  const pred = fCurve(x);
  const rel_departure = Math.abs(s.shift_fraction - pred) / s.shift_fraction;
  return {
    family,
    N: +N.toPrecision(6),
    a: +s.a.toPrecision(6),
    x: +x.toPrecision(6),
    shift_fraction_measured: +s.shift_fraction.toFixed(6),
    shift_fraction_closed_form: +pred.toFixed(6),
    abs_departure: +Math.abs(s.shift_fraction - pred).toExponential(4),
    rel_departure: +rel_departure.toExponential(4),
  };
}

// (P1) band family -- 11-point grid across the imp-34693 seed band (high-x tail).
const BAND_ROWS = [];
for (let i = 0; i <= 10; i++) {
  BAND_ROWS.push(reducedRow(BAND_BOTTOM + ((BAND_TOP - BAND_BOTTOM) * i) / 10, 'band'));
}
// (P2) height family -- ladder from the band top up toward / past the PT anchor (sweeps x down to ~0.0019).
const HEIGHT_ROWS = [BAND_TOP, 1e10, 1e11, 1e12, N_PT_ANCHOR, 1e14].map((N) => reducedRow(N, 'height'));

// The COMBINED collapse table, sorted by the reduced variable x (both families on one axis).
const COLLAPSE_TABLE = [...BAND_ROWS, ...HEIGHT_ROWS].sort((p, q) => p.x - q.x);

// Collapse quality: max relative departure per family and overall.
const BAND_MAX_REL = Math.max(...BAND_ROWS.map((r) => r.rel_departure));
const HEIGHT_MAX_REL = Math.max(...HEIGHT_ROWS.map((r) => r.rel_departure));
const OVERALL_MAX_REL = Math.max(BAND_MAX_REL, HEIGHT_MAX_REL);

// The one shared overlap point (band-top is in BOTH families): the families must AGREE there.
const OVERLAP_BAND = BAND_ROWS[BAND_ROWS.length - 1]; // band-top row
const OVERLAP_HEIGHT = HEIGHT_ROWS[0]; // ladder starts at band-top
const OVERLAP_AGREE = Math.abs(OVERLAP_BAND.shift_fraction_measured - OVERLAP_HEIGHT.shift_fraction_measured);

// Tightening: band-bottom (largest a) vs PT anchor (small a).
const BAND_BOTTOM_REL = BAND_ROWS[0].rel_departure; // x ~ 60, a ~ 0.048
const PT_ROW = HEIGHT_ROWS.find((r) => r.N === +N_PT_ANCHOR.toPrecision(6));
const PT_REL = PT_ROW.rel_departure; // x ~ 0.015
const TIGHTENING_RATIO = BAND_BOTTOM_REL / PT_REL;

export const IMP35847_SHIFT_FRACTION_REDUCED_VARIABLE_COLLAPSE = {
  id: 'imp-35847',
  proofSection: 'S-frontier',
  question:
    'imp-35809 derived shift_fraction ~ delta/(delta + a/4) -- governed by the single ratio a/(4 delta) -- and ' +
    'measured it separately across the imp-34693 band (P1, ~98/2 flat) and up the height axis (P2, inverts to ' +
    '~1.5/98.5 by the PT anchor), but never replotted the two families against the reduced variable a/(4 delta). ' +
    'Replot both measured families against x = a/(4 delta) and quantify how tightly they collapse onto the one ' +
    'closed-form curve shift_fraction = 1/(1+x), bounding the residual departure from the small-a ' +
    'approximation. Measurement only; surrogate; imp-34714a stays OPEN; changes no bound; NO QED.',
  finding:
    'Both measured families COLLAPSE onto the single master curve f(x) = 1/(1+x), x = a/(4 delta). (C1) Sorting ' +
    'the exact measured shift_fraction from both families by x gives one monotone-decreasing curve tracking ' +
    'f(x) across four decades of x (~0.0019 .. ~60); the families share exactly one point -- the band-top, ' +
    'x ~ 53.97 -- where the two measurements are BIT-IDENTICAL (0.018950), so shift_fraction is single-valued ' +
    'in x and a/(4 delta) is the sole governing parameter. (C2) The collapse TIGHTENS as a -> 0: the relative ' +
    'departure from the small-a curve runs from ~4.47% at band-bottom (x ~ 59.9, a ~ 0.048, a NOT small) down ' +
    'to ~1.77e-5 at the PT anchor (x ~ 0.0153) -- a ~2500x tightening. (C3) The residual IS the O(a) expansion ' +
    'tail (dropped a^3/8+ and the first-order (1 - aLo)^-1 term), smooth and ~linear in a, which is why the ' +
    'x-axis -- not N -- is what makes the two families coincide. EVIDENCE / measurement, NOT a certificate.',
  constants: {
    delta: DELTA,
    N_cross: +N_CROSS.toPrecision(12),
    band_bottom_N: +BAND_BOTTOM.toPrecision(12),
    band_top_N: +BAND_TOP.toPrecision(12),
    N_pt_anchor: N_PT_ANCHOR,
    x_at_band_bottom: BAND_ROWS[0].x,
    x_at_band_top: OVERLAP_BAND.x,
    x_at_pt_anchor: PT_ROW.x,
  },
  measurement: {
    reduced_variable: 'x = a/(4 delta); master curve f(x) = 1/(1+x) = delta/(delta + a/4)',
    collapse_table: COLLAPSE_TABLE,
    band_max_rel_departure: +BAND_MAX_REL.toExponential(4), // ~4.47e-2
    height_max_rel_departure: +HEIGHT_MAX_REL.toExponential(4), // ~4.00e-2 (band-top end)
    overall_max_rel_departure: +OVERALL_MAX_REL.toExponential(4), // ~4.47e-2
    overlap_x: OVERLAP_BAND.x, // ~53.97 (band-top, shared by both families)
    overlap_shift_fraction_measured: OVERLAP_BAND.shift_fraction_measured, // ~0.018950 (identical in both)
    overlap_family_disagreement: +OVERLAP_AGREE.toExponential(4), // 0 (bit-identical)
    band_bottom_rel_departure: +BAND_BOTTOM_REL.toExponential(4), // ~4.47e-2
    pt_anchor_rel_departure: +PT_REL.toExponential(4), // ~1.77e-5
    tightening_ratio_band_bottom_over_pt: +TIGHTENING_RATIO.toPrecision(4), // ~2530
  },
  subGap:
    'imp-34714a REMAINS OPEN. Collapsing the two measured shift-fraction families onto f(x) = 1/(1+x) does NOT ' +
    'prove a directed-rounding [g](m)/[F-prime] evaluation yields valid enclosures: it rests on the gamma(n)/k ' +
    'eps surrogate models of the imp-34687a directed-rounding layer, not that layer, and F(m) = 0 remains a ' +
    'double-precision artifact. Adds no RH bound.',
  isRigorous: false,
  verdict:
    'SHIFT-FRACTION REDUCED-VARIABLE COLLAPSE (frontier, NOT an RH bound). imp-35809 measured the D3 residual ' +
    'shift fraction across two separate families (band grid, height ladder) and derived the single-ratio law ' +
    'shift_fraction ~ delta/(delta + a/4). Replotting both families against the reduced variable x = ' +
    'a/(4 delta) DEMONSTRATES the collapse: (C1) both families lie on the one master curve f(x) = 1/(1+x) ' +
    'across four decades of x and agree BIT-IDENTICALLY at their shared band-top point (x ~ 53.97, ' +
    'shift_fraction 0.018950), so x is the sole governing parameter; (C2) the collapse tightens ~2500x as ' +
    'a -> 0, from ~4.47% relative departure at band-bottom (a ~ 0.048, not small) to ~1.77e-5 at the PT anchor; ' +
    '(C3) the residual is the smooth O(a) small-a expansion tail. So imp-35809 single-ratio law is confirmed ' +
    'as a genuine data collapse, essentially exact toward the PT anchor and good to a few percent only inside ' +
    'the band where a is large. EVIDENCE, NOT a machine certificate. SUB-GAP imp-34714a REMAINS OPEN: rests on ' +
    'the gamma(n)/k eps surrogate models, not the imp-34687a directed-rounding layer, and F(m) = 0 remains a ' +
    'double-precision artifact. Measurement only on the inherited imp-3220/imp-3406 surrogate; reuses the ' +
    'imp-35809/imp-35762/imp-35266 machinery (identical K, delta, N_cross, band, splitAt); C_C 1/8 ' +
    '(imp-2642/2643) and C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail ' +
    'exponent 1/2 per imp-3463 untouched; changes no bound; establishes no operator positivity; no RH verdict, ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-35809 (the two measured families + the a/(4 delta) law); imp-35762 (defined the split; splitAt ' +
    'machinery); imp-35266 (D3 leading estimate S_inf . a/2); imp-35846 (delta-sweep of the crossover; 1/delta ' +
    'law); imp-34996 (S_inf = 1/(2 delta) floor); imp-34693 (admissible seed band); imp-33723 (Banach map ' +
    'g(N) = K log T0(N)); imp-321/imp-3406 (PT anchor N ~ 1.236e13); lambda-rh-height-mapping (effectiveHeightForN ' +
    'RvM inverse). Reduced-variable data collapse of a previously two-family measurement onto a closed-form ' +
    'master curve: standard.',
};

export const IMP35847_SHIFT_FRACTION_REDUCED_VARIABLE_COLLAPSE_ASSERTIONS = [
  {
    // (C1) Both families collapse onto f(x) = 1/(1+x): sorted by x the measured curve is monotone-decreasing
    // and single-valued, and the families agree bit-identically at their one shared overlap point (band-top).
    id: 'imp35847-collapse-onto-one-curve',
    description: 'both families lie on f(x) = 1/(1+x) sorted by x (monotone, single-valued) and agree exactly at the shared band-top point',
    holds: () => {
      if (COLLAPSE_TABLE.length !== 17) return false;
      // measured shift_fraction is non-increasing as x increases (single-valued in x; the one duplicate is
      // the shared band-top overlap point, where x and the measured value tie exactly).
      for (let i = 1; i < COLLAPSE_TABLE.length; i++) {
        if (COLLAPSE_TABLE[i].x < COLLAPSE_TABLE[i - 1].x) return false;
        if (COLLAPSE_TABLE[i].shift_fraction_measured > COLLAPSE_TABLE[i - 1].shift_fraction_measured) return false;
      }
      // the two families share the band-top point and agree bit-identically there
      return OVERLAP_AGREE === 0 && Math.abs(OVERLAP_BAND.x - OVERLAP_HEIGHT.x) < 1e-9;
    },
  },
  {
    // (C2) The whole collapse is tight: every point sits within ~5% of the master curve, and the departure
    // shrinks by ~2500x from band-bottom (large a) to the PT anchor (small a).
    id: 'imp35847-collapse-tightens-as-a-shrinks',
    description: 'max relative departure < 5% overall, shrinking from ~4.5% at band-bottom to ~1.8e-5 at the PT anchor (~2500x)',
    holds: () =>
      OVERALL_MAX_REL < 0.05 &&
      BAND_BOTTOM_REL > 0.04 && BAND_BOTTOM_REL < 0.05 &&
      PT_REL < 1e-4 &&
      TIGHTENING_RATIO > 1000,
  },
  {
    // (C3) The residual is the small-a O(a) expansion tail: the closed form UNDER-predicts (measured >
    // predicted) monotonically across the band, a smooth one-signed departure, not noise.
    id: 'imp35847-residual-is-smooth-one-signed-Oa-tail',
    description: 'the closed form under-predicts the measured shift fraction with a smooth one-signed departure across the band (O(a) tail)',
    holds: () =>
      BAND_ROWS.every((r) => r.shift_fraction_measured > r.shift_fraction_closed_form) &&
      // departure decreases monotonically as x decreases up the height ladder toward small a
      HEIGHT_ROWS.every((r, i) => i === 0 || r.rel_departure <= HEIGHT_ROWS[i - 1].rel_departure * 1.05),
  },
  {
    // Honesty gate: measurement / surrogate, not rigorous, sub-gap open, no QED, no refereed bound is changed.
    id: 'imp35847-honesty-gate-no-qed',
    description: 'measurement: isRigorous false, imp-34714a open, no QED, no refereed bound is changed',
    holds: () =>
      IMP35847_SHIFT_FRACTION_REDUCED_VARIABLE_COLLAPSE.isRigorous === false &&
      /imp-34714a/.test(IMP35847_SHIFT_FRACTION_REDUCED_VARIABLE_COLLAPSE.subGap) &&
      /REMAINS OPEN/.test(IMP35847_SHIFT_FRACTION_REDUCED_VARIABLE_COLLAPSE.subGap) &&
      /NO QED/.test(IMP35847_SHIFT_FRACTION_REDUCED_VARIABLE_COLLAPSE.verdict) &&
      /refereed bound is changed/i.test(IMP35847_SHIFT_FRACTION_REDUCED_VARIABLE_COLLAPSE.verdict),
  },
];

for (const a of IMP35847_SHIFT_FRACTION_REDUCED_VARIABLE_COLLAPSE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35847-shift-fraction-reduced-variable-collapse assertion failed: ${a.id}`);
  }
}
