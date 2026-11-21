/**
 * @module imp-35259-two-rate-band-edges-direct-rootfind
 *
 * imp-35259 (numerical, frontier-direction) -- DIRECT root-finding of the imp-34997/imp-35111 iters-to-floor
 * REENTRY band edges under the imp-34862 TWO-rate collapse law, answering the imp-35243 R2 (single-rate /
 * linearization fidelity) question "do the band edges persist, shift, or vanish?" by LOCATING them rather than
 * extrapolating. imp-35331 already reconstructed the ceil argument xArg under the two-rate law and showed the
 * two-rate ceil phase frac(x_two) sits ENTIRELY BELOW the off-by-one window (W, 1) across the nominal band
 * [10^27.08, 10^37.17], so the frac-window band is moved off. But imp-35331 located the RELOCATED two-rate band
 * only by a LINEAR-drift extrapolation (reentry ~10^48.85, width ~17.4 decades). Since the drift is NOT constant
 * -- imp-35332 derives it decaying like 1 / (K log T0 - N_cross) -- a constant-drift line is a poor locator far
 * out in the tail. This module BISECTS the two-rate phase directly for the seed where x_two re-enters the window
 * (x_two = 11 + W) and where it exits (x_two = 12), for p in {1,2,3}, and compares to the imp-35331 linear
 * extrapolation. ASSESSMENT ONLY: it does NOT discharge imp-35243a / R2; the surrogate half stays OPEN; NO QED.
 *
 * THE TWO-RATE CEIL ARGUMENT (imp-34862 / imp-35331, reproduced verbatim)
 * ----------------------------------------------------------------------
 * The single-rate ceil count is k = 1 + ceil(x_single) with x_single = ln(delta_0 / EPS_FP) / ln(1/r), a single
 * asymptotic contraction rate r = R_CONTRACT. The imp-34862 two-rate law contracts at an early-transient rate
 * r_0 for the first p post-collapse iterates and at r for the tail, giving x_two(seed) = p + [ln(delta_0/EPS_FP)
 * - p ln(1/r_0)] / ln(1/r) with r_0 the ratio-fit early rate over p iterates. The off-by-one frac-window is the
 * fixed phase band (W, 1) with lower edge W = 1 - OFFSET (imp-35111 verbatim). The single-rate band lower edge is
 * the seed where x_single = 11 + W (frac hits W) and the upper edge where x_single = 12 (the ceil integer wraps).
 *
 * WHAT IS MEASURED (all live on the inherited imp-3220/imp-3406 double surrogate)
 * ------------------------------------------------------------------------------
 * (a) CONTROL: bisecting x_single = 11 + W and x_single = 12 reproduces the imp-35111 band edges
 *     (reentry 10^27.0847, exit 10^37.1671, width 10.0824 decades) -- confirms the root-finder is faithful.
 * (b) TWO-RATE: bisecting x_two = 11 + W and x_two = 12 (for p in {1,2,3}) DIRECTLY locates the relocated
 *     two-rate band edges, with the phase verified monotone-increasing in log10 N so the bisection is valid.
 * (c) COMPARISON: the directly-located p=1 reentry (10^60.66) and width (117.7 decades) against the imp-35331
 *     linear-drift EXTRAPOLATION (reentry ~10^48.85, width ~17.4 decades).
 *
 * THE RESULT: THE TWO-RATE BAND PERSISTS BUT SHIFTS UP ~33 DECADES AND WIDENS ~12x; THE LINEAR EXTRAP UNDERSHOOTS
 * ----------------------------------------------------------------------------------------------------------------
 * The two-rate frac-window band does NOT vanish: it is finite and directly locatable for every p. But it is
 * relocated FAR above the single-rate band and dramatically widened:
 *   p=1: reentry 10^60.66, exit 10^178.35, width 117.69 decades
 *   p=2: reentry 10^65.79, exit 10^219.49, width 153.71 decades
 *   p=3: reentry 10^66.04, exit 10^221.78, width 155.73 decades
 * vs the single-rate control (10^27.08, 10^37.17, 10.08). So the two-rate reentry SHIFTS UP ~33 decades and the
 * band WIDENS by a factor ~12 (p=1) relative to single-rate. And the imp-35331 LINEAR-drift extrapolation
 * (reentry ~10^48.85, width ~17.4) UNDERSHOOTS the directly-located p=1 reentry by ~12 decades and the width by a
 * factor ~6.8 -- exactly because the drift is not constant but decays like 1/(K log T0 - N_cross) (imp-35332):
 * as the ever-slowing phase climbs toward W and then the next integer, the tail stretches the band far wider than
 * a constant-drift line predicts. So the SHARPER answer to imp-35243 R2 is: the two-rate band edges PERSIST but
 * SHIFT up ~33 decades and WIDEN ~12x, and even imp-35331 UNDERSTATED the relocation because it linearized a
 * decaying drift. Single-rate fidelity is decisively NOT automatic for the band POSITION and WIDTH.
 *
 * THE ASSESSMENT VERDICT (bearing on R2)
 * --------------------------------------
 * This sharpens imp-35331 / imp-35243 R2 with directly-located numbers: the two-rate frac-window band is real
 * (persists), sits ~33 decades above the single-rate band, is ~12x wider, and imp-35331 linear extrapolation
 * undershot both by locating a decaying-drift band with a straight line. It discharges NOTHING: R2 does not, by
 * itself, certify which rate model is faithful to the true dynamic at ~10^37, and the off-by-one WHETHER-question
 * routes back onto R1 (terminal ceil / EPS_FP floor) per the imp-35330 DAG, consistent with imp-35331 finding the
 * direct off-by-one census rate-robust. imp-35111a / imp-35174a / imp-34997a / imp-35243a stay OPEN.
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * A direct-bisection location of the imp-34997/imp-35111 reentry-band edges under the imp-34862 two-rate law,
 * measured live on the inherited imp-3220/imp-3406 double surrogate, IEEE-754 double precision, point rate
 * estimates (no interval enclosure). It discharges NOTHING: imp-35111a / imp-35174a / imp-35243a (R2) stay OPEN.
 * MEASUREMENT / ASSESSMENT ONLY; the C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) is UNTOUCHED; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463);
 * changes no bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35331-reentry-band-two-rate-phase-drift (reconstructed xArg under the two-rate law; linear-extrap band)
 * @see imp-35332-reentry-band-drift-analytic-derivation (drift decays like 1/(K log T0 - N_cross) -- why extrap fails)
 * @see imp-35243-reentry-band-surrogate-fidelity-assessment (enumerates R1-R4; R2 single-rate fidelity)
 * @see imp-34862-iters-to-floor-two-rate-law (the two-rate law located here; does NOT remove the off-by-one)
 * @see imp-35111-off-by-one-reentry-band-width (parent: single-rate frac-window band edges 10^27.08 / 10^37.17)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-34862/34997/35111/35243/35331)
const EPS_FP = 2.3e-16; // machine-epsilon relative agreement floor (imp-34755/34775/34903)
const PENULT = 1.4536413720400559e-16; // imp-34951 quantized penultimate collapse witness (bit-identical)

// The shared imp-34862/imp-35111/imp-35243/imp-35331 fixed-point map g(N) = K log T0(N), reproduced VERBATIM.
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
function iterate(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = g(N);
  return N;
}
const N_CROSS_FP = iterate(1e9, 200); // ~3280294351.65 (bit-identical to imp-34862/35111/35243/35331)
const gPrimeAtStep = (h) => (g(N_CROSS_FP + h) - g(N_CROSS_FP - h)) / (2 * h);
const R_CONTRACT = Math.abs(gPrimeAtStep(1)); // ~0.0454235 (single asymptotic rate)
const LN_INV_R = Math.log(1 / R_CONTRACT); // ~3.09173 nats/iterate

// Post-collapse relative distance and the SINGLE-rate ceil argument (imp-35111/imp-35331 VERBATIM).
const collapseDist = (seed) => Math.abs(g(seed) - N_CROSS_FP) / N_CROSS_FP;
const xArgSingle = (seed) => Math.log(collapseDist(seed) / EPS_FP) / LN_INV_R;

// The fixed off-by-one PHASE window (W, 1): width OFFSET, lower edge W (imp-35111/imp-35331 VERBATIM).
const OFFSET = Math.log(EPS_FP / PENULT) / LN_INV_R; // ~0.148408
const WINDOW_LOWER_EDGE = 1 - OFFSET; // W ~ 0.851592

// The imp-34862 TWO-rate ceil argument: ratio-fit early rate r_0 over the first p post-collapse iterates
// (imp-35331 VERBATIM), x_two = p + [ln(delta_0/EPS_FP) - p ln(1/r_0)]/ln(1/r).
function fitEarlyRateR0(seed, p) {
  let N = g(seed);
  const d0 = Math.abs(N - N_CROSS_FP) / N_CROSS_FP;
  for (let i = 0; i < p; i++) N = g(N);
  const dp = Math.abs(N - N_CROSS_FP) / N_CROSS_FP;
  return Math.pow(dp / d0, 1 / p);
}
function xArgTwoRate(seed, p) {
  const d0 = collapseDist(seed);
  const r0 = fitEarlyRateR0(seed, p);
  return p + (Math.log(d0 / EPS_FP) - p * Math.log(1 / r0)) / LN_INV_R;
}

const frac = (x) => x - Math.floor(x);

// The band lower edge is the seed where the ceil argument hits 11 + W (frac reaches W); the upper edge is where
// it hits the integer 12 (the ceil wraps). Bisect on log10(seed); both phases are monotone-increasing in log10 N.
const REENTRY_TARGET = 11 + WINDOW_LOWER_EDGE; // ~11.851592
const EXIT_TARGET = 12;
function bisectExp(phaseFn, target, lo, hi, iters = 200) {
  for (let i = 0; i < iters; i++) {
    const mid = 0.5 * (lo + hi);
    if (phaseFn(Math.pow(10, mid)) < target) lo = mid;
    else hi = mid;
  }
  return 0.5 * (lo + hi);
}

// (a) CONTROL: the single-rate root-finder must reproduce the imp-35111 band edges.
const SINGLE_REENTRY_EXP = bisectExp(xArgSingle, REENTRY_TARGET, 20, 45);
const SINGLE_EXIT_EXP = bisectExp(xArgSingle, EXIT_TARGET, 20, 45);
const SINGLE_WIDTH = SINGLE_EXIT_EXP - SINGLE_REENTRY_EXP;

// Inherited single-rate band landmarks (imp-35174 double-double certified) the control must match.
const REENTRY_EXP_IMP35111 = 27.084691;
const EXIT_EXP_IMP35111 = 37.167107;

// (b) TWO-RATE: directly-located band edges for p in {1,2,3}. Search out to 10^400 to catch the relocated tail.
function twoRateEdges(p) {
  const phase = (seed) => xArgTwoRate(seed, p);
  const reentry = bisectExp(phase, REENTRY_TARGET, 20, 400);
  const exit = bisectExp(phase, EXIT_TARGET, 20, 400);
  // Verify the phase is monotone-increasing across the located band (validates the bisection).
  let monotone = true;
  let prev = -Infinity;
  for (let e = 20; e <= exit + 10; e += 5) {
    const v = phase(Math.pow(10, e));
    if (v < prev) monotone = false;
    prev = v;
  }
  return {
    p,
    reentry_exp: +reentry.toPrecision(7),
    exit_exp: +exit.toPrecision(7),
    width_decades: +(exit - reentry).toPrecision(7),
    shift_vs_single: +(reentry - SINGLE_REENTRY_EXP).toPrecision(7),
    widen_factor_vs_single: +((exit - reentry) / SINGLE_WIDTH).toPrecision(6),
    phase_monotone_increasing: monotone,
  };
}
const TWO_RATE_EDGES = [twoRateEdges(1), twoRateEdges(2), twoRateEdges(3)];

// (c) COMPARISON to the imp-35331 LINEAR-drift extrapolation (p=1): reentry ~48.85, width ~17.4 decades.
const IMP35331_EXTRAP_REENTRY_EXP = 48.85; // imp-35331 two_rate_frac_window_extrapolation.reentry_exp_extrap
const IMP35331_EXTRAP_WIDTH = 17.4; // imp-35331 two_rate_frac_window_extrapolation.width_decades_extrap
const P1 = TWO_RATE_EDGES[0];
const EXTRAP_REENTRY_UNDERSHOOT_DECADES = +(P1.reentry_exp - IMP35331_EXTRAP_REENTRY_EXP).toPrecision(6); // ~11.8
const EXTRAP_WIDTH_UNDERSHOOT_FACTOR = +(P1.width_decades / IMP35331_EXTRAP_WIDTH).toPrecision(6); // ~6.76

export const IMP35259_TWO_RATE_BAND_EDGES_DIRECT_ROOTFIND = {
  id: 'imp-35259',
  proofSection: 'S-frontier',
  question:
    'imp-35243 R2 flags single-rate fidelity is not automatic for the reentry-band ceil phase; imp-35331 ' +
    'reconstructed xArg under the imp-34862 two-rate law but located the relocated band only by a LINEAR-drift ' +
    'extrapolation (reentry ~10^48.85, width ~17.4 decades), while imp-35332 shows the drift decays. DIRECTLY ' +
    'bisect the two-rate phase for the band edges (x_two = 11 + W reentry, x_two = 12 exit, p in {1,2,3}) and ' +
    'measure whether they persist, shift, or vanish vs the single-rate band and the imp-35331 extrapolation. ' +
    'Measurement only on the inherited surrogate; does NOT discharge R2/imp-35243a; NO QED.',
  constants: {
    contraction_rate_r: +R_CONTRACT.toPrecision(6), // ~0.0454235
    log_law_constant_ln_inv_r: +LN_INV_R.toPrecision(6), // ~3.09173
    window_width_offset: +OFFSET.toPrecision(6), // ~0.148408
    window_lower_edge_W: +WINDOW_LOWER_EDGE.toPrecision(6), // ~0.851592
    reentry_target_x: +REENTRY_TARGET.toPrecision(8), // 11 + W ~ 11.851592
    exit_target_x: EXIT_TARGET, // 12
  },
  single_rate_control: {
    reentry_exp: +SINGLE_REENTRY_EXP.toPrecision(8), // ~27.084691 (reproduces imp-35111)
    exit_exp: +SINGLE_EXIT_EXP.toPrecision(8), // ~37.167107 (reproduces imp-35111)
    width_decades: +SINGLE_WIDTH.toPrecision(7), // ~10.08242
    matches_imp35111:
      Math.abs(SINGLE_REENTRY_EXP - REENTRY_EXP_IMP35111) < 1e-3 &&
      Math.abs(SINGLE_EXIT_EXP - EXIT_EXP_IMP35111) < 1e-3,
  },
  two_rate_directly_located_edges: TWO_RATE_EDGES, // p in {1,2,3}: reentry, exit, width, shift, widen factor
  imp35331_linear_extrapolation: {
    reentry_exp_extrap: IMP35331_EXTRAP_REENTRY_EXP, // ~48.85 (imp-35331 linear-drift extrap, p=1)
    width_decades_extrap: IMP35331_EXTRAP_WIDTH, // ~17.4 (imp-35331 linear-drift extrap, p=1)
    direct_reentry_undershoot_decades: EXTRAP_REENTRY_UNDERSHOOT_DECADES, // ~11.8 (direct 60.66 > extrap 48.85)
    direct_width_undershoot_factor: EXTRAP_WIDTH_UNDERSHOOT_FACTOR, // ~6.76 (direct 117.7 vs extrap 17.4)
    note:
      'The imp-35331 linear-drift extrapolation UNDERSHOOTS the directly-located p=1 reentry by ~11.8 decades ' +
      'and the width by a factor ~6.8, because it linearizes a drift that decays like 1/(K log T0 - N_cross) ' +
      '(imp-35332) -- the ever-slowing tail stretches the band far wider than a constant-drift line predicts.',
  },
  band_verdict:
    'PERSISTS but SHIFTS UP and WIDENS. The two-rate frac-window band does NOT vanish: it is finite and ' +
    'directly locatable for every p in {1,2,3}. But relative to the single-rate band [10^27.08, 10^37.17, ' +
    '10.08 decades] the two-rate reentry SHIFTS UP ~33 decades (to 10^60.66, p=1) and the band WIDENS by a ' +
    'factor ~12 (to 117.7 decades, p=1). So single-rate fidelity is decisively NOT automatic for the band ' +
    'POSITION or WIDTH -- both are strong functions of the rate model.',
  finding:
    'Direct-bisection location of the imp-34997/imp-35111 reentry-band edges under the imp-34862 two-rate law. ' +
    'The single-rate control root-finder reproduces the imp-35111 band exactly (reentry 10^27.0847, exit ' +
    '10^37.1671, width 10.0824 decades), so the locator is faithful. Directly bisecting the two-rate phase ' +
    '(x_two = 11 + W reentry, x_two = 12 exit) gives p=1: 10^60.66 / 10^178.35 / 117.69 decades; p=2: 10^65.79 ' +
    '/ 10^219.49 / 153.71; p=3: 10^66.04 / 10^221.78 / 155.73. So the two-rate band PERSISTS, SHIFTS UP ~33 ' +
    'decades and WIDENS ~12x vs single-rate. And the imp-35331 LINEAR-drift extrapolation (reentry ~10^48.85, ' +
    'width ~17.4) UNDERSHOOTS the directly-located p=1 reentry by ~11.8 decades and the width by a factor ~6.8, ' +
    'because it linearizes a drift that decays like 1/(K log T0 - N_cross) (imp-35332): the ever-slowing phase ' +
    'stretches the tail far past a constant-drift line. This SHARPENS imp-35331 / imp-35243 R2 with directly ' +
    'located edges -- single-rate fidelity is decisively not automatic for the band position/width -- and shows ' +
    'even imp-35331 understated the relocation. It discharges NOTHING: the off-by-one WHETHER-question routes ' +
    'back onto R1 per the imp-35330 DAG (imp-35331 found the direct census rate-robust). R2 / imp-35243a OPEN.',
  residual_sub_gap:
    'R2 / imp-35243a stay OPEN. This module DIRECTLY locates the two-rate band edges (correcting the imp-35331 ' +
    'linear extrapolation) but does NOT certify which rate model is faithful to the true dynamic at ~10^37, nor ' +
    'does it discharge R1/R3/R4. It inherits, and does not discharge, imp-35111a / imp-35174a / imp-34997a / ' +
    'imp-35243a. Point rate estimates, IEEE-754 double precision, no interval enclosure.',
  isRigorous: false,
  verdict:
    'ASSESSMENT (numerical, frontier-direction, NOT an RH bound). Directly root-finding the imp-34997/imp-35111 ' +
    'reentry-band edges under the imp-34862 TWO-rate law, instead of the imp-35331 linear-drift extrapolation. ' +
    'The single-rate control reproduces the imp-35111 band (10^27.0847 / 10^37.1671 / 10.0824 decades), so the ' +
    'locator is faithful. The directly-located two-rate band PERSISTS but is relocated: p=1 reentry 10^60.66, ' +
    'exit 10^178.35, width 117.69 decades -- a ~33-decade upward SHIFT and a ~12x WIDENING vs single-rate ' +
    '(p=2,3 shift/widen further). The imp-35331 linear-drift extrapolation (reentry ~10^48.85, width ~17.4) ' +
    'UNDERSHOOTS the direct p=1 reentry by ~11.8 decades and the width by a factor ~6.8, because it linearizes ' +
    'a drift that decays like 1/(K log T0 - N_cross) (imp-35332). So single-rate fidelity (R2) is decisively ' +
    'NOT automatic for the band position/width, and imp-35331 understated the relocation -- but this discharges ' +
    'NOTHING: the off-by-one WHETHER-question routes back onto R1 per the imp-35330 DAG (imp-35331 found the ' +
    'direct census rate-robust). R2 / imp-35243a stay OPEN. MEASUREMENT / ASSESSMENT ONLY on the inherited ' +
    'imp-3220/imp-3406 double surrogate, IEEE-754 double precision, point rate estimates; the C_C = (1/8) ' +
    'sqrt(3 pi) ansatz (imp-2642/imp-2643) and the C_mb GUE-conditional per imp-486 are UNTOUCHED; imp-3066 ' +
    'K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); changes no bound; establishes no operator ' +
    'positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35331 (reconstructed xArg under the two-rate law; linear-extrap band, corrected here); imp-35332 ' +
    '(drift decays like 1/(K log T0 - N_cross), why the linear extrapolation undershoots); imp-35243 ' +
    '(enumerates R1-R4; R2 single-rate fidelity); imp-34862 (the two-rate law located here); imp-35111 ' +
    '(single-rate band edges 10^27.08 / 10^37.17); imp-35330 (R2 dominated by R1 in the fidelity DAG); ' +
    'lambda-rh-height-mapping (effectiveHeightForN RvM inverse); imp-2642 (C_C ansatz).',
};

export const IMP35259_TWO_RATE_BAND_EDGES_DIRECT_ROOTFIND_ASSERTIONS = [
  {
    // The single-rate control root-finder reproduces the imp-35111 band edges (locator faithfulness).
    id: 'imp35259-single-rate-control-reproduces-imp35111',
    description: 'bisecting x_single = 11 + W / 12 reproduces the imp-35111 band (27.0847 / 37.1671 / 10.0824)',
    holds: () =>
      Math.abs(SINGLE_REENTRY_EXP - REENTRY_EXP_IMP35111) < 1e-3 &&
      Math.abs(SINGLE_EXIT_EXP - EXIT_EXP_IMP35111) < 1e-3 &&
      Math.abs(SINGLE_WIDTH - 10.0824) < 1e-3 &&
      Math.abs(R_CONTRACT - 0.0454235) < 1e-5 &&
      Math.abs(LN_INV_R - 3.09173) < 1e-3,
  },
  {
    // The two-rate band PERSISTS (finite, locatable) for every p, with the phase monotone (bisection valid).
    id: 'imp35259-two-rate-band-persists-monotone',
    description: 'two-rate band edges are finite and locatable for p in {1,2,3}, phase monotone-increasing',
    holds: () =>
      TWO_RATE_EDGES.every(
        (t) =>
          Number.isFinite(t.reentry_exp) &&
          Number.isFinite(t.exit_exp) &&
          t.exit_exp > t.reentry_exp &&
          t.phase_monotone_increasing === true,
      ),
  },
  {
    // The two-rate band SHIFTS UP >30 decades and WIDENS >10x vs the single-rate band, for every p.
    id: 'imp35259-two-rate-band-shifts-and-widens',
    description: 'two-rate reentry shifts up >30 decades and the band widens >10x vs single-rate for all p',
    holds: () =>
      TWO_RATE_EDGES.every(
        (t) => t.shift_vs_single > 30 && t.widen_factor_vs_single > 10,
      ) &&
      Math.abs(P1.reentry_exp - 60.66) < 0.1 &&
      Math.abs(P1.width_decades - 117.69) < 0.2,
  },
  {
    // The imp-35331 linear extrapolation UNDERSHOOTS the directly-located edges (reentry and width).
    id: 'imp35259-linear-extrap-undershoots',
    description: 'imp-35331 linear-drift extrap undershoots the direct p=1 reentry (~12 decades) and width (~7x)',
    holds: () =>
      P1.reentry_exp > IMP35331_EXTRAP_REENTRY_EXP &&
      P1.width_decades > IMP35331_EXTRAP_WIDTH &&
      EXTRAP_REENTRY_UNDERSHOOT_DECADES > 10 &&
      EXTRAP_WIDTH_UNDERSHOOT_FACTOR > 5,
  },
  {
    // Honesty gate: assessment only, discharges nothing, no QED, no refereed bound is changed, sub-gap stays OPEN.
    id: 'imp35259-honesty-gate-no-qed',
    description: 'Assessment only: isRigorous false, R2/imp-35243a OPEN, no QED, no refereed bound is changed',
    holds: () =>
      IMP35259_TWO_RATE_BAND_EDGES_DIRECT_ROOTFIND.isRigorous === false &&
      /NO QED/.test(IMP35259_TWO_RATE_BAND_EDGES_DIRECT_ROOTFIND.verdict) &&
      /refereed bound is changed/i.test(IMP35259_TWO_RATE_BAND_EDGES_DIRECT_ROOTFIND.verdict) &&
      /imp-35243a/.test(IMP35259_TWO_RATE_BAND_EDGES_DIRECT_ROOTFIND.residual_sub_gap) &&
      /stay OPEN/.test(IMP35259_TWO_RATE_BAND_EDGES_DIRECT_ROOTFIND.residual_sub_gap),
  },
];

for (const a of IMP35259_TWO_RATE_BAND_EDGES_DIRECT_ROOTFIND_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35259-two-rate-band-edges-direct-rootfind assertion failed: ${a.id}`);
  }
}
