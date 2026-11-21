/**
 * @module imp-34951-plus-one-impossibility-margin-band
 *
 * imp-34951 (numerical, frontier-direction): imp-34926 argued the +1 (over-count) residual is STRUCTURALLY
 *   IMPOSSIBLE on the measured band because the largest PENULTIMATE relative distance across all 34 off-by-one
 *   seeds (1.4536e-16) sits strictly below the model floor EPS_FP = 2.3e-16, so EPS_FP is a conservative
 *   (too-large) collapse floor and the terminal ceil can only ever round DOWN. imp-34926 reported only that
 *   single band-wide maximum; it never tabulated the impossibility MARGIN (EPS_FP minus the true bit-collapse
 *   threshold, proxied by the penultimate relative distance) rung-by-rung. This module reuses the imp-34926
 *   map g(N) = K log T0(N), the off-by-one detector, and the ceil-boundary geometry probe VERBATIM and MEASURES
 *   the margin at every off-by-one rung across [1e3,1e18], to assess whether the down-rounding guarantee is
 *   UNIFORM across rungs or NARROWS toward any one (which would weaken the structural-impossibility claim).
 *
 * WHAT IS MEASURED
 * ----------------
 * At each off-by-one seed the ceil-boundary probe returns the PENULTIMATE relative distance -- the last
 * non-zero relative distance to N_CROSS_FP before the iterate that snaps N to the bit-identical fixed point.
 * That penultimate distance is the tightest measurable proxy for the true bit-collapse threshold: the dynamics
 * demonstrably sit at that relative distance one iterate before collapse, so the true threshold is at-or-below
 * it. The impossibility margin at that rung is margin(seed) = EPS_FP - penultRelDist(seed); a POSITIVE margin
 * means EPS_FP over-estimates the collapse threshold at that rung (down-rounding guaranteed). The module
 * tabulates margin per rung, the min/max margin per decade sub-band and band-wide, and the COUNT OF DISTINCT
 * penultimate values -- the direct test of whether the margin is uniform or rung-dependent.
 *
 * THE RESULT: THE MARGIN IS EXACTLY UNIFORM -- ONE QUANTIZED VALUE ACROSS EVERY RUNG
 * ---------------------------------------------------------------------------------
 * All 34 off-by-one rungs share ONE bit-identical penultimate relative distance, 1.4536413720400559e-16, so
 * there is exactly ONE distinct value across [1e3,1e18]. The impossibility margin is therefore a single
 * quantized constant, EPS_FP - penult = 8.4636e-17, at EVERY rung -- min margin === max margin, zero spread.
 * The margin does NOT narrow toward any rung: the penultimate distance is 0.63202 * EPS_FP (equivalently
 * 0.65466 * machine epsilon), so the margin is a fixed 0.36798 * EPS_FP fraction band-wide. This is the
 * geometric signature of every off-by-one seed collapsing through the SAME terminal neighbourhood of the
 * fixed point: the last representable relative distance before the bit-identical snap is a property of the
 * fixed-point neighbourhood and the double-precision grid, not of the seed, so it is rung-independent.
 *
 * SO: the imp-34926 down-rounding guarantee is UNIFORM, not fragile. Because the margin is a single positive
 * quantized constant rather than a rung-shrinking quantity, there is no rung at which EPS_FP creeps toward the
 * collapse threshold on the measured band -- the structural-impossibility claim is strengthened, not weakened.
 *
 * NAMED RESIDUAL SUB-GAP (imp-34951a)
 * -----------------------------------
 * The measured margin is uniform and positive across all 34 off-by-one rungs on [1e3,1e18], but the penultimate
 * relative distance is only a PROXY for the true bit-collapse threshold (it is an upper witness: the threshold
 * is at-or-below it), and the measurement is confined to seeds that actually produced an off-by-one. What is
 * NOT established is a uniform-in-N LOWER bound on that margin -- that the penultimate distance can never
 * approach EPS_FP at some UNMEASURED N. That reduces to the same rate-mismatch bound as imp-34926a: sub-gap
 * imp-34951a = certify penultRelDist(N) <= c * EPS_FP with c < 1 uniformly in N. It inherits, and does not
 * discharge, imp-34926a.
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * A rung-by-rung margin tabulation of the imp-34926 penultimate-distance witness. MEASUREMENT / ASSESSMENT
 * ONLY on the inherited imp-3220/imp-3406 surrogate map, IEEE-754 double precision, no interval enclosure. The
 * C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) is UNTOUCHED; the C_mb GUE-conditional per imp-486 is
 * UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; establishes no operator positivity; no RH verdict,
 * NO QED. No refereed bound is changed.
 *
 * @see imp-34926-iters-to-floor-ceil-boundary-geometry (parent: +1 structurally impossible; single band-wide max penult)
 * @see imp-34903-iters-to-floor-residual-sign-wide-band (-1 sign band-wide on [1e6,1e15])
 * @see imp-34775-iters-to-floor-log-law (derives the closed-form log law and the ceil rounding floor)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-34775/imp-34903/imp-34926)
const EPS_FP = 2.3e-16; // the ~machine-epsilon relative agreement floor named in imp-34755/imp-34775/imp-34926

// The shared imp-33723/imp-34693/imp-34755/imp-34775/imp-34903/imp-34926 fixed-point map g(N) = K log T0(N).
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
function iterate(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = g(N);
  return N;
}

// The unique double-precision fixed point (route B, converged) -- identical to imp-34926/imp-34903.
const N_CROSS_FP = iterate(1e9, 200); // 3280294351.65240669

// Central-difference contraction rate (h=1 stencil; identical to imp-34926/imp-34903).
const gPrimeAtStep = (h) => (g(N_CROSS_FP + h) - g(N_CROSS_FP - h)) / (2 * h);
const R_CONTRACT = Math.abs(gPrimeAtStep(1)); // ~0.0454235
const LN_INV_R = Math.log(1 / R_CONTRACT); // ~3.09173 nats/iterate (the log-law constant)

// Post-collapse relative distance, ceil argument, single-rate predicted count (imp-34775/imp-34903/imp-34926).
const collapseDist = (seed) => Math.abs(g(seed) - N_CROSS_FP) / N_CROSS_FP;
const xArg = (seed) => Math.log(collapseDist(seed) / EPS_FP) / LN_INV_R;
const itersToFloorPredicted = (seed) => 1 + Math.ceil(xArg(seed));

// Directly-measured Picard count: iterates until bit-identical to the fixed point (matches imp-34926).
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

// The imp-34926 terminal ceil-boundary geometry probe, VERBATIM: the PENULTIMATE relative distance is the
// last non-zero relative distance before the collapsing iterate -- the tightest measurable upper witness for
// the true bit-collapse threshold.
function ceilBoundaryGeometry(seed, cap = 500) {
  let N = seed;
  let k = 0;
  let mEps = null;
  let penultRelDist = null;
  while (k < cap) {
    const prevRelDist = Math.abs(N - N_CROSS_FP) / N_CROSS_FP;
    N = g(N);
    k++;
    const d = Math.abs(N - N_CROSS_FP) / N_CROSS_FP;
    if (mEps === null && d <= EPS_FP) mEps = k;
    if (N === N_CROSS_FP) {
      penultRelDist = prevRelDist;
      return { mEps, mExact: k, penultRelDist };
    }
  }
  return { mEps, mExact: null, penultRelDist };
}

// Rung-by-rung impossibility-margin tabulation over a seed band on the 10^step grid. At every off-by-one seed
// (residual === -1, the only kind imp-34926 finds) record the penultimate relative distance and the margin
// margin = EPS_FP - penultRelDist, then aggregate min/max margin, min/max penult, and the count of DISTINCT
// penultimate values -- the direct uniform-vs-narrowing test.
function marginBand(loExp, hiExp, step) {
  const seeds = [];
  for (let e = loExp; e <= hiExp + 1e-9; e += step) seeds.push(Math.pow(10, e));
  let offByOne = 0;
  let maxPenult = 0;
  let minPenult = Infinity;
  const distinctPenult = new Set();
  for (const s of seeds) {
    const resid = itersToFloorPredicted(s) - itersToFloorMeasured(s);
    if (resid === -1) {
      const geo = ceilBoundaryGeometry(s);
      if (geo.penultRelDist !== null) {
        offByOne++;
        distinctPenult.add(geo.penultRelDist);
        if (geo.penultRelDist > maxPenult) maxPenult = geo.penultRelDist;
        if (geo.penultRelDist < minPenult) minPenult = geo.penultRelDist;
      }
    }
  }
  // Margin is monotone decreasing in penult, so min margin <-> max penult and max margin <-> min penult.
  const minMargin = offByOne ? EPS_FP - maxPenult : null;
  const maxMargin = offByOne ? EPS_FP - minPenult : null;
  return {
    points: seeds.length,
    offByOne,
    maxPenult: offByOne ? maxPenult : null,
    minPenult: offByOne ? minPenult : null,
    minMargin, // the TIGHTEST (worst-case) down-rounding margin on this band
    maxMargin, // the LOOSEST margin on this band
    marginSpread: offByOne ? maxMargin - minMargin : null, // 0 <=> exactly uniform across rungs
    distinctPenultValues: distinctPenult.size, // 1 <=> one quantized value across all rungs
    allMarginsPositive: offByOne ? minMargin > 0 : null,
  };
}

// The widened [1e3,1e18] band and its localizing sub-bands, on the 10^0.05 grid (same grid as imp-34926).
const BAND_WIDE = marginBand(3, 18, 0.05); // [1e3,1e18], 301 seeds
const SUB_FAR_BELOW = marginBand(3, 5.95, 0.05); // [1e3,1e6): empty
const SUB_BELOW = marginBand(6, 8.95, 0.05); // [1e6,1e9)
const SUB_WINDOW = marginBand(9, 12, 0.05); // [1e9,1e12] (the imp-34887 window)
const SUB_ABOVE = marginBand(12.05, 15, 0.05); // (1e12,1e15]: empty
const SUB_FAR_ABOVE = marginBand(15.05, 18, 0.05); // (1e15,1e18]: empty

// The impossibility margin as a fraction of the model floor (rung-independent, since penult is quantized).
const PENULT_OVER_EPS_FP = BAND_WIDE.maxPenult / EPS_FP; // ~0.63202
const MARGIN_OVER_EPS_FP = BAND_WIDE.minMargin / EPS_FP; // ~0.36798
const PENULT_OVER_MACHINE_EPS = BAND_WIDE.maxPenult / Number.EPSILON; // ~0.65466

// The two facts that make the guarantee UNIFORM: one distinct penult value (zero spread) and a positive margin.
const MARGIN_IS_UNIFORM = BAND_WIDE.distinctPenultValues === 1 && BAND_WIDE.marginSpread === 0;
const MARGIN_IS_POSITIVE = BAND_WIDE.allMarginsPositive === true;
const DOWN_ROUNDING_GUARANTEE_UNIFORM = MARGIN_IS_UNIFORM && MARGIN_IS_POSITIVE;

export const IMP34951_PLUS_ONE_IMPOSSIBILITY_MARGIN_BAND = {
  id: 'imp-34951',
  proofSection: 'S-frontier',
  question:
    'imp-34926 argued the +1 over-count residual is structurally impossible because the largest penultimate ' +
    'relative distance (1.4536e-16) sits below the model floor EPS_FP = 2.3e-16, but reported only that single ' +
    'band-wide maximum. Measure the impossibility margin (EPS_FP minus the true bit-collapse threshold, proxied ' +
    'by the penultimate relative distance) rung-by-rung across [1e3,1e18] on the 10^0.05 grid, to assess ' +
    'whether the terminal-ceil down-rounding guarantee is UNIFORM across rungs or NARROWS toward any one.',
  constants: {
    contraction_rate_r: +R_CONTRACT.toPrecision(6), // ~0.0454235 (h=1 stencil, as imp-34775/34903/34926)
    log_law_constant_ln_inv_r: +LN_INV_R.toPrecision(6), // ~3.09173 nats/iterate
    eps_fp: EPS_FP, // 2.3e-16 machine-epsilon agreement floor (the model collapse floor)
    machine_eps: Number.EPSILON, // 2.220446e-16
    band_lo_exp: 3, // 1e3
    band_hi_exp: 18, // 1e18
    grid_step_exp: 0.05, // 10^0.05 spacing (same grid as imp-34926 / imp-34903)
  },
  bands: {
    'band_wide_step_0p05_1e3_to_1e18': BAND_WIDE,
    sub_far_below_1e3_to_1e6: SUB_FAR_BELOW, // 0 off-by-one
    sub_below_1e6_to_1e9: SUB_BELOW, // 13 off-by-one, all sharing the one penult value
    sub_window_1e9_to_1e12: SUB_WINDOW, // 21 off-by-one, same penult value
    sub_above_1e12_to_1e15: SUB_ABOVE, // 0 off-by-one
    sub_far_above_1e15_to_1e18: SUB_FAR_ABOVE, // 0 off-by-one
  },
  summary: {
    wide_band_off_by_one: BAND_WIDE.offByOne, // 34 (reproduces imp-34926)
    distinct_penultimate_values: BAND_WIDE.distinctPenultValues, // 1 -- ONE quantized value across all rungs
    penultimate_rel_dist: BAND_WIDE.maxPenult, // 1.4536413720400559e-16 (bit-identical at every off-by-one rung)
    impossibility_margin: BAND_WIDE.minMargin, // 8.4636e-17 = EPS_FP - penult, identical at every rung
    margin_spread_across_rungs: BAND_WIDE.marginSpread, // 0 -- EXACTLY uniform, does NOT narrow anywhere
    penult_over_eps_fp: +PENULT_OVER_EPS_FP.toPrecision(8), // ~0.63202
    margin_over_eps_fp: +MARGIN_OVER_EPS_FP.toPrecision(8), // ~0.36798 -- the fixed margin fraction band-wide
    penult_over_machine_eps: +PENULT_OVER_MACHINE_EPS.toPrecision(8), // ~0.65466
    all_margins_positive: BAND_WIDE.allMarginsPositive, // true
    down_rounding_guarantee_uniform: DOWN_ROUNDING_GUARANTEE_UNIFORM, // true
    residual_sub_gap_imp_34951a:
      'The measured margin is uniform and positive across all 34 off-by-one rungs on [1e3,1e18], but the ' +
      'penultimate relative distance is only an UPPER witness for the true bit-collapse threshold and the ' +
      'measurement covers only seeds that produced an off-by-one. NOT established: a uniform-in-N LOWER bound ' +
      'on the margin (penultRelDist(N) <= c * EPS_FP with c < 1 for ALL N). Sub-gap imp-34951a = certify that ' +
      'uniform bound; it inherits and does not discharge imp-34926a.',
    verdict_on_ticket_question:
      'UNIFORM, not narrowing. Every one of the 34 off-by-one rungs across [1e3,1e18] shares ONE bit-identical ' +
      'penultimate relative distance (1.4536413720400559e-16, a single distinct value), so the impossibility ' +
      'margin EPS_FP - penult is a single quantized constant 8.4636e-17 = 0.36798 * EPS_FP at every rung -- ' +
      'zero spread, min margin === max margin. The margin does not creep toward zero at any rung because the ' +
      'penultimate distance is a property of the shared fixed-point neighbourhood and the double-precision ' +
      'grid, not of the seed. The imp-34926 down-rounding guarantee is therefore UNIFORM and the ' +
      'structural-impossibility claim is strengthened, subject only to the named sub-gap imp-34951a (a ' +
      'uniform-in-N lower bound on the margin).',
  },
  finding:
    'Tabulating the imp-34926 impossibility margin (EPS_FP - penultimate relative distance) rung-by-rung across ' +
    '[1e3,1e18] on the 10^0.05 grid shows the margin is EXACTLY UNIFORM: all 34 off-by-one rungs share ONE ' +
    'bit-identical penultimate relative distance 1.4536413720400559e-16 (a single distinct value), so the ' +
    'margin is a single quantized constant 8.4636e-17 = 0.36798 * EPS_FP at every rung, with zero spread and ' +
    'min margin equal to max margin. The margin never narrows toward any rung -- the penultimate distance is a ' +
    'property of the shared terminal fixed-point neighbourhood and the double-precision grid, not of the seed. ' +
    'The imp-34926 terminal-ceil down-rounding guarantee is thus UNIFORM across the band and the ' +
    'structural-impossibility claim is strengthened, subject only to the named sub-gap imp-34951a (a ' +
    'uniform-in-N lower bound certifying penultRelDist(N) <= c * EPS_FP with c < 1 for ALL N).',
  isRigorous: false,
  verdict:
    'MEASUREMENT / ASSESSMENT (frontier-direction, NOT an RH bound). Reusing the imp-34926 map, off-by-one ' +
    'detector, and ceil-boundary probe VERBATIM and tabulating the impossibility margin (EPS_FP - penultimate ' +
    'relative distance) rung-by-rung across [1e3,1e18] shows the margin is EXACTLY UNIFORM: all 34 off-by-one ' +
    'rungs share ONE bit-identical penultimate distance (1.4536413720400559e-16), so the margin is a single ' +
    'quantized constant 8.4636e-17 (0.36798 * EPS_FP) at every rung, zero spread, it never narrows anywhere. ' +
    'The imp-34926 down-rounding guarantee is therefore uniform and the +1-impossibility claim is strengthened, ' +
    'subject to the named residual sub-gap imp-34951a (a uniform-in-N lower bound on the margin, inheriting ' +
    'imp-34926a). IEEE-754 double precision; the component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; the C_C 1/8 ansatz (imp-2642/imp-2643) and the C_mb ' +
    'GUE-conditional per imp-486 are UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; establishes no ' +
    'operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34926 (parent: +1 structurally impossible; single band-wide max penultimate distance); imp-34903 ' +
    '(-1 residual sign band-wide on [1e6,1e15]); imp-34775 (derives the closed-form log law and the ceil ' +
    'rounding floor); imp-2642 (C_C = (1/8) sqrt(3 pi) ansatz); lambda-rh-height-mapping (effectiveHeightForN ' +
    'Riemann-von Mangoldt inverse).',
};

export const IMP34951_PLUS_ONE_IMPOSSIBILITY_MARGIN_BAND_ASSERTIONS = [
  {
    // The wide band reproduces the imp-34926 off-by-one population: 34 seeds, all -1.
    id: 'imp34951-wide-band-reproduces-34-off-by-one',
    description: 'across [1e3,1e18] (301 seeds) the off-by-one population is 34, matching imp-34926',
    holds: () => BAND_WIDE.points === 301 && BAND_WIDE.offByOne === 34,
  },
  {
    // The margin is EXACTLY UNIFORM: one distinct penultimate value, zero margin spread across all rungs.
    id: 'imp34951-margin-exactly-uniform-across-rungs',
    description: 'one distinct penultimate value and zero margin spread: the margin does NOT narrow at any rung',
    holds: () =>
      BAND_WIDE.distinctPenultValues === 1 &&
      BAND_WIDE.marginSpread === 0 &&
      BAND_WIDE.minMargin === BAND_WIDE.maxMargin &&
      MARGIN_IS_UNIFORM === true,
  },
  {
    // The impossibility margin is positive at every rung: EPS_FP - penult = 8.4636e-17 = 0.36798 * EPS_FP.
    id: 'imp34951-margin-positive-and-a-fixed-eps-fp-fraction',
    description: 'margin positive band-wide, 8.4636e-17 = 0.36798 * EPS_FP; penult = 0.63202 * EPS_FP',
    holds: () =>
      BAND_WIDE.allMarginsPositive === true &&
      Math.abs(BAND_WIDE.minMargin - 8.4636e-17) < 1e-20 &&
      Math.abs(MARGIN_OVER_EPS_FP - 0.36798201) < 1e-6 &&
      Math.abs(PENULT_OVER_EPS_FP - 0.63201799) < 1e-6 &&
      DOWN_ROUNDING_GUARANTEE_UNIFORM === true,
  },
  {
    // Localization: the off-by-one population lives in [1e6,1e12]; the extra decades each way are empty.
    id: 'imp34951-off-by-one-localized-in-1e6-to-1e12',
    description: 'sub-bands: [1e3,1e6) and (1e12,1e18] empty; [1e6,1e9)=13, [1e9,1e12]=21',
    holds: () =>
      SUB_FAR_BELOW.offByOne === 0 &&
      SUB_FAR_ABOVE.offByOne === 0 &&
      SUB_ABOVE.offByOne === 0 &&
      SUB_BELOW.offByOne === 13 &&
      SUB_WINDOW.offByOne === 21,
  },
  {
    // Honesty gate: measurement of a surrogate proxy, not rigorous, no QED, no refereed bound is changed, sub-gap named.
    id: 'imp34951-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed, sub-gap named',
    holds: () =>
      IMP34951_PLUS_ONE_IMPOSSIBILITY_MARGIN_BAND.isRigorous === false &&
      /NO QED/.test(IMP34951_PLUS_ONE_IMPOSSIBILITY_MARGIN_BAND.verdict) &&
      /refereed bound is changed/i.test(IMP34951_PLUS_ONE_IMPOSSIBILITY_MARGIN_BAND.verdict) &&
      /imp-34951a/.test(IMP34951_PLUS_ONE_IMPOSSIBILITY_MARGIN_BAND.summary.residual_sub_gap_imp_34951a),
  },
];

for (const a of IMP34951_PLUS_ONE_IMPOSSIBILITY_MARGIN_BAND_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34951-plus-one-impossibility-margin-band assertion failed: ${a.id}`);
  }
}
