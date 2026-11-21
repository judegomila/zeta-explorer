/**
 * @module imp-35846-crossover-height-sensitivity-to-delta
 *
 * imp-35809 (P3) located the D3 shift-fraction = curvature-fraction 50/50 crossover at the closed form
 * a = 4 . delta (with the relative bracket half-width HELD FIXED at delta = 2e-4), landing at N ~ 1.88e11,
 * and showed the whole imp-35762 curvature/shift split is governed by the single ratio a/(4 delta) via
 * shift_fraction ~ delta / (delta + a/4). It never varied delta. This module MEASURES the sensitivity of the
 * crossover height N_cross50(delta) to that fixed delta, tabulating it across a ladder delta in [5e-5, 1e-3]
 * on the SAME imp-3406 surrogate, and confirms the a = 4 . delta law scales as expected while tracking how the
 * band-local (~98/2) split and its height-axis inversion move with delta.
 *
 * THE MACHINERY (reproducing imp-35809 / imp-35762 verbatim, now parameterized by delta)
 * -------------------------------------------------------------------------------------
 * a(N) = 2 pi K / (T u), T = effectiveHeightForN(N), u = log(T / 2pi), is delta-INDEPENDENT. The split at
 * height N with bracket half-width delta:
 *   S_inf = 1/(2 delta);  G = 1 - a;
 *   S_exact    = G / ((1+G) delta (1 - a(N(1-delta))))   (a-shift ON)
 *   S_no_shift = G / ((1+G) delta (1 - a))               (a-shift OFF)
 *   total_residual = (S_exact - S_inf) - S_inf . a/2,  shift = S_exact - S_no_shift,  curvature = rest.
 * Small-a: shift_fraction ~ delta / (delta + a/4), so the 50/50 point is a = 4 delta. Since a(N) is fixed by
 * height alone, N_cross50(delta) = a^{-1}(4 delta): larger delta needs a larger contraction factor a, hence a
 * LOWER height. Bisection on log N gives N_cross50 for each delta.
 *
 * WHAT THE MEASUREMENT FINDS
 * --------------------------
 *   (M1) THE a = 4 . delta LAW HOLDS ACROSS THE LADDER. For every delta in {5e-5, 1e-4, 2e-4, 4e-4, 1e-3} the
 *        measured crossover contraction factor a_cross matches 4 . delta to within the small-a correction: the
 *        ratio a_cross / (4 delta) stays in ~[0.9985, 1.0028] over the whole 20x delta range (tightest at small
 *        delta, drifting up only ~0.3% by delta = 1e-3 where a ~ 4e-3 is no longer negligible).
 *   (M2) N_cross50(delta) . delta IS A NEAR-INVARIANT. The crossover height falls almost exactly as 1/delta:
 *        delta = 5e-5 -> N ~ 7.55e11, doubling delta roughly halves N (2e-4 -> 1.88e11, 1e-3 -> 3.74e10). The
 *        product N_cross50 . delta sits at ~3.76e7, drifting under ~1.1% end-to-end -- the residual drift is the
 *        slowly-varying T . u factor (a = 4 delta => T u = pi K / (2 delta), and T ~ N / log N grows slightly
 *        faster than linearly, so N_cross50 . delta creeps down as delta grows).
 *   (M3) THE BAND-LOCAL SPLIT AND ITS INVERSION MOVE MONOTONICALLY WITH delta. At a FIXED height the shift
 *        fraction rises with delta (it enters the ratio a/(4 delta) linearly): at the imp-34693 band top the
 *        shift share climbs from ~0.5% (delta = 5e-5) to ~9.3% (delta = 1e-3), while at the PT anchor
 *        N ~ 1.236e13 the shift share -- already inverted to dominance -- climbs from ~94.2% to ~99.7%. So the
 *        ~98/2 band-local split of imp-35762/imp-35809 is a delta = 2e-4 artifact; shrinking delta pushes the
 *        crossover up-height and sharpens the band-top curvature dominance, enlarging delta does the reverse.
 *
 * CONSEQUENCE: the imp-35809 a = 4 . delta crossover is robust and its N ~ 1.88e11 landing is a delta = 2e-4
 * SLICE of a one-parameter family N_cross50(delta) ~ 3.76e7 / delta. Nothing about the split is intrinsic to the
 * specific 98/2 numbers -- they are read off at the fixed operational delta; the invariant content is the single
 * ratio a/(4 delta) and its near-1/delta crossover-height law.
 *
 * MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate; reproduces the imp-35809/imp-35762/imp-35266
 * machinery (identical K, a(N), split form). The imp-34714a machine certificate REMAINS OPEN; F(m) = 0 stays a
 * double-precision artifact; C_C = 1/8 (imp-2642/2643) UNTOUCHED; C_mb GUE-conditional per imp-486 UNTOUCHED;
 * imp-3066 K_a >= 0 untouched; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35809-krawczyk-surplus-split-band-and-height-profile (a = 4 delta crossover at fixed delta = 2e-4)
 * @see imp-35762-krawczyk-surplus-shift-residual-isolation (defined the shift/curvature split)
 * @see imp-35266-krawczyk-headroom-surplus-decomposition (D3 leading estimate S_inf . a/2)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 RvM inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-35809/imp-35762)
const DELTA_REF = 2e-4; // the imp-35809 fixed bracket half-width (reference slice)
const N_PT_ANCHOR = 1.236e13; // Platt-Trudgian anchor N(T_PT) (imp-321/imp-3406 height mapping)

const aOf = (N) => {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return (TWO_PI * K_AMPL) / (T * u);
};

// A fixed reference band-top height in the imp-34693 seed band (matches imp-35809 to ~1e-3 in fractions);
// used only to report how the band-LOCAL split moves with delta, not to redefine the band.
const BAND_TOP_REF = 3.28029e9 + 1.7124e8; // ~3.4515e9

// The additive imp-35762 residual split at height N with bracket half-width delta; delta is a PARAMETER here.
function splitAt(N, delta) {
  const S_inf = 1 / (2 * delta);
  const a = aOf(N);
  const aLo = aOf(N * (1 - delta)); // seed-shifted lower fixed-point contraction factor
  const G = 1 - a;
  const S_exact = G / ((1 + G) * delta * (1 - aLo)); // a-shift ON
  const S_no_shift = G / ((1 + G) * delta * (1 - a)); // a-shift OFF (a_lo -> a(N))
  const total_residual = S_exact - S_inf - (S_inf * a) / 2;
  const shift_residual = S_exact - S_no_shift;
  const curvature_residual = S_no_shift - S_inf - (S_inf * a) / 2;
  return {
    a,
    shift_fraction: shift_residual / total_residual,
    curvature_fraction: curvature_residual / total_residual,
  };
}

// Crossover height where shift_fraction = 0.5, by bisection on log N. a(N) is monotone-decreasing in N, so
// shift_fraction is monotone-increasing in N; a wide [1e9, 1e17] bracket contains N_cross50 for the whole ladder.
function crossoverN(delta) {
  let lo = 1e9, hi = 1e17;
  for (let i = 0; i < 200; i++) {
    const mid = Math.sqrt(lo * hi);
    if (splitAt(mid, delta).shift_fraction < 0.5) lo = mid;
    else hi = mid;
  }
  return Math.sqrt(lo * hi);
}

// (M1)/(M2)/(M3) the delta ladder.
const DELTA_LADDER = [5e-5, 1e-4, 2e-4, 4e-4, 1e-3];
const TABLE = DELTA_LADDER.map((delta) => {
  const N = crossoverN(delta);
  const a = aOf(N);
  const top = splitAt(BAND_TOP_REF, delta);
  const pt = splitAt(N_PT_ANCHOR, delta);
  return {
    delta,
    N_cross50: +N.toPrecision(6),
    a_cross: +a.toPrecision(6),
    four_delta: 4 * delta,
    a_over_4delta: +(a / (4 * delta)).toFixed(6),
    N_cross50_times_delta: +(N * delta).toPrecision(6),
    band_top_shift_fraction: +top.shift_fraction.toFixed(6),
    pt_anchor_shift_fraction: +pt.shift_fraction.toFixed(6),
  };
});

const RATIO_MIN = Math.min(...TABLE.map((r) => r.a_over_4delta));
const RATIO_MAX = Math.max(...TABLE.map((r) => r.a_over_4delta));
const PRODUCT_MIN = Math.min(...TABLE.map((r) => r.N_cross50_times_delta));
const PRODUCT_MAX = Math.max(...TABLE.map((r) => r.N_cross50_times_delta));
const PRODUCT_DRIFT = (PRODUCT_MAX - PRODUCT_MIN) / PRODUCT_MAX; // relative spread of the near-invariant
const REF_ROW = TABLE.find((r) => r.delta === DELTA_REF);

export const IMP35846_CROSSOVER_HEIGHT_SENSITIVITY_TO_DELTA = {
  id: 'imp-35846',
  proofSection: 'S-frontier',
  question:
    'imp-35809 (P3) located the shift-vs-curvature 50/50 crossover at the closed form a = 4 . delta ' +
    '(N ~ 1.88e11) with delta held fixed at 2e-4, and showed the split is governed by the single ratio ' +
    'a/(4 delta). Measure the sensitivity of the crossover height N_cross50(delta) to delta, tabulating it ' +
    'across a delta ladder and confirming the a = 4 . delta law scales as expected. Measurement only; ' +
    'surrogate; imp-34714a stays OPEN; changes no bound; NO QED.',
  finding:
    'The a = 4 . delta crossover is robust and N_cross50(delta) ~ 3.76e7 / delta. (M1) Across the ladder ' +
    'delta in {5e-5, 1e-4, 2e-4, 4e-4, 1e-3} the measured a_cross tracks 4 . delta with a_cross/(4 delta) in ' +
    '~[0.9985, 1.0028] -- tight at small delta, drifting up only ~0.3% by delta = 1e-3. (M2) N_cross50 falls ' +
    'almost exactly as 1/delta: the product N_cross50 . delta stays ~3.76e7, drifting under ~1.1% end-to-end ' +
    '(the residual is the slowly-varying T . u factor). (M3) At a fixed height the shift fraction rises ' +
    'monotonically with delta: at the band top ~0.5% (delta = 5e-5) -> ~9.3% (delta = 1e-3); at the PT anchor ' +
    'N ~ 1.236e13 ~94.2% -> ~99.7%. So the imp-35762/imp-35809 ~98/2 band-local split is a delta = 2e-4 slice ' +
    'of a one-parameter family; only the ratio a/(4 delta) and the ~1/delta crossover-height law are intrinsic. ' +
    'EVIDENCE / measurement, NOT a machine certificate.',
  constants: {
    delta_ref: DELTA_REF,
    K_amplitude: +K_AMPL.toPrecision(10),
    N_pt_anchor: N_PT_ANCHOR,
    band_top_ref_N: +BAND_TOP_REF.toPrecision(10),
    N_cross50_at_delta_ref: REF_ROW.N_cross50, // ~1.88e11, matches imp-35809 P3
    a_cross_at_delta_ref: REF_ROW.a_cross, // ~7.99e-4
  },
  measurement: {
    delta_ladder: DELTA_LADDER,
    table: TABLE,
    a_over_4delta_range: [+RATIO_MIN.toFixed(4), +RATIO_MAX.toFixed(4)], // ~[0.9985, 1.0028]
    N_cross50_times_delta_range: [+PRODUCT_MIN.toPrecision(4), +PRODUCT_MAX.toPrecision(4)], // ~[3.74e7, 3.78e7]
    N_cross50_times_delta_relative_drift: +PRODUCT_DRIFT.toFixed(4), // ~0.011 (< 1.1%)
  },
  subGap:
    'imp-34714a REMAINS OPEN. Tabulating the crossover-height sensitivity to delta does NOT prove a ' +
    'directed-rounding [g](m)/[F-prime] evaluation yields valid enclosures: it rests on the gamma(n)/k eps ' +
    'surrogate models of the imp-34687a directed-rounding layer, not that layer, and F(m) = 0 remains a ' +
    'double-precision artifact. Adds no RH bound.',
  isRigorous: false,
  verdict:
    'CROSSOVER-HEIGHT SENSITIVITY TO delta (frontier, NOT an RH bound). imp-35809 P3 fixed the shift/curvature ' +
    '50/50 crossover at a = 4 . delta (N ~ 1.88e11) with delta = 2e-4 held fixed. Sweeping delta across ' +
    '{5e-5..1e-3} on the same imp-3406 surrogate: (M1) a_cross/(4 delta) stays in ~[0.9985, 1.0028], so the ' +
    'closed-form law holds across the ladder (drifting up only ~0.3% at delta = 1e-3 where a ~ 4e-3); ' +
    '(M2) N_cross50(delta) . delta is a near-invariant ~3.76e7 (relative drift < 1.1%), i.e. the crossover ' +
    'height falls as ~1/delta; (M3) at a fixed height the shift fraction rises monotonically with delta ' +
    '(band top ~0.5% -> ~9.3%, PT anchor ~94.2% -> ~99.7%). So the imp-35762/imp-35809 ~98/2 split is a ' +
    'delta = 2e-4 slice of a one-parameter family; the invariant content is the ratio a/(4 delta) and the ' +
    '~1/delta crossover law. EVIDENCE, NOT a machine certificate. SUB-GAP imp-34714a REMAINS OPEN: rests on ' +
    'the gamma(n)/k eps surrogate models, not the imp-34687a directed-rounding layer, and F(m) = 0 remains a ' +
    'double-precision artifact. Measurement only on the inherited imp-3220/imp-3406 surrogate; reproduces the ' +
    'imp-35809/imp-35762/imp-35266 machinery (identical K, a(N), split form); C_C 1/8 (imp-2642/2643) and ' +
    'C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; establishes ' +
    'no operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35809 (a = 4 delta crossover at fixed delta = 2e-4, N ~ 1.88e11); imp-35762 (shift/curvature split); ' +
    'imp-35266 (D3 leading estimate S_inf . a/2); imp-34996 (S_inf = 1/(2 delta) floor); imp-34693 (seed band); ' +
    'imp-321/imp-3406 (PT anchor N ~ 1.236e13); lambda-rh-height-mapping (effectiveHeightForN RvM inverse). ' +
    'One-parameter sensitivity sweep of a previously single-delta crossover measurement: standard.',
};

export const IMP35846_CROSSOVER_HEIGHT_SENSITIVITY_TO_DELTA_ASSERTIONS = [
  {
    // (M1) The a = 4 . delta law holds across the whole delta ladder.
    id: 'imp35846-a-equals-4delta-holds-across-ladder',
    description: 'a_cross / (4 delta) stays within ~0.3% of 1 across delta in [5e-5, 1e-3]',
    holds: () =>
      TABLE.length === 5 &&
      RATIO_MIN > 0.995 && RATIO_MAX < 1.005 &&
      // the reference slice reproduces imp-35809 P3 (N ~ 1.88e11, a ~ 7.99e-4 = 4 . delta)
      Math.abs(REF_ROW.a_cross - 4 * DELTA_REF) < 4e-5 &&
      REF_ROW.N_cross50 > 1.5e11 && REF_ROW.N_cross50 < 2.5e11,
  },
  {
    // (M2) N_cross50 . delta is a near-invariant: the crossover height falls as ~1/delta.
    id: 'imp35846-crossover-height-scales-as-inverse-delta',
    description: 'N_cross50(delta) . delta is a near-invariant ~3.76e7 (relative drift < 2%)',
    holds: () =>
      PRODUCT_DRIFT < 0.02 &&
      PRODUCT_MIN > 3.5e7 && PRODUCT_MAX < 4.0e7 &&
      // monotone: larger delta => lower crossover height
      TABLE[0].N_cross50 > TABLE[4].N_cross50,
  },
  {
    // (M3) At a fixed height the shift fraction rises monotonically with delta (band-top and PT anchor).
    id: 'imp35846-fixed-height-shift-fraction-rises-with-delta',
    description: 'at band top and PT anchor the shift fraction increases monotonically with delta',
    holds: () => {
      const topRises = TABLE.every((r, i) => i === 0 || r.band_top_shift_fraction > TABLE[i - 1].band_top_shift_fraction);
      const ptRises = TABLE.every((r, i) => i === 0 || r.pt_anchor_shift_fraction > TABLE[i - 1].pt_anchor_shift_fraction);
      return topRises && ptRises &&
        TABLE[0].band_top_shift_fraction < 0.02 && TABLE[4].band_top_shift_fraction > 0.05 &&
        TABLE[0].pt_anchor_shift_fraction > 0.9 && TABLE[4].pt_anchor_shift_fraction > 0.99;
    },
  },
  {
    // Honesty gate: measurement / surrogate, not rigorous, sub-gap open, no QED, no refereed bound is changed.
    id: 'imp35846-honesty-gate-no-qed',
    description: 'measurement: isRigorous false, imp-34714a open, no QED, no refereed bound is changed',
    holds: () =>
      IMP35846_CROSSOVER_HEIGHT_SENSITIVITY_TO_DELTA.isRigorous === false &&
      /imp-34714a/.test(IMP35846_CROSSOVER_HEIGHT_SENSITIVITY_TO_DELTA.subGap) &&
      /REMAINS OPEN/.test(IMP35846_CROSSOVER_HEIGHT_SENSITIVITY_TO_DELTA.subGap) &&
      /NO QED/.test(IMP35846_CROSSOVER_HEIGHT_SENSITIVITY_TO_DELTA.verdict) &&
      /refereed bound is changed/i.test(IMP35846_CROSSOVER_HEIGHT_SENSITIVITY_TO_DELTA.verdict),
  },
];

for (const a of IMP35846_CROSSOVER_HEIGHT_SENSITIVITY_TO_DELTA_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35846-crossover-height-sensitivity-to-delta assertion failed: ${a.id}`);
  }
}
