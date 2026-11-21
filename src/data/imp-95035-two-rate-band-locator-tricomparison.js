/**
 * @module imp-95035-two-rate-band-locator-tricomparison
 *
 * imp-95035 (numerical, frontier-direction) -- TABULATES the three imp-34997/imp-35111 two-rate REENTRY-band
 * locators SIDE BY SIDE across p in {1,2,3} and quantifies the imp-35331 linear-drift UNDERSHOOT as a function
 * of decade depth. imp-35259 directly root-found the two-rate frac-window band edges and noted (for p=1 only)
 * that the imp-35331 constant-drift extrapolation undershoots by ~11.8 decades and ~6.8x in width, attributing
 * the gap to the imp-35332 decaying drift 1/(K log T0 - N_cross). This module puts all THREE locators in one
 * table for every p and shows, at increasing decade depth, exactly how the constant-drift line runs ahead of the
 * true (decaying) two-rate phase. ASSESSMENT / MEASUREMENT ONLY: it discharges NOTHING; the surrogate-fidelity
 * sub-gap imp-35243a stays OPEN; NO QED.
 *
 * THE THREE LOCATORS (all on the inherited imp-3220/imp-3406 double surrogate, verbatim machinery)
 * ----------------------------------------------------------------------------------------------
 *   (A) DIRECT ROOTFIND (imp-35259): bisect the two-rate phase x_two(seed) directly for the seed where it
 *       re-enters the off-by-one window (x_two = 11 + W) and where it exits (x_two = 12). Exact locator.
 *   (B) LINEAR-DRIFT EXTRAPOLATION (imp-35331): hold the two-rate drift at its nominal-band edge-to-edge
 *       average and extrapolate the reentry decade REENTRY_EXP + (W - frac(x_two))/drift and the width
 *       OFFSET/drift. imp-35331 reported this only for p=1 (~10^48.85, width ~17.4); here for every p.
 *   (C) DECAYING-DRIFT INTEGRAL (imp-35332): forward-integrate the LOCAL two-rate drift d(x_two)/d(log10 N)
 *       -- which decays like 1/(K log T0 - N_cross) -- from the nominal reentry until the accumulated phase
 *       reaches 11 + W (reentry) and 12 (exit). By construction this integral reconstructs x_two, so it
 *       reproduces the direct edges; it is the locator that ACCOUNTS for the decay the linear line omits.
 *
 * WHAT IS MEASURED
 * ----------------
 * For p in {1,2,3}: the reentry decade, exit decade and width under each of the three locators, side by side;
 * the direct-minus-linear undershoot (reentry in decades, width as a factor); and the direct-minus-decay
 * residual (confirming the decaying-drift integral closes the gap the linear line leaves). Separately, for
 * p=1, an undershoot-vs-decade-depth probe: at increasing depth Delta above the nominal reentry, the phase the
 * constant-drift line predicts minus the true two-rate phase, showing the gap grows monotonically from ~0 near
 * the edge to ~0.95 phase units at Delta = 150 -- the mechanism of the undershoot.
 *
 * THE RESULT: THE LINEAR LINE UNDERSHOOTS MORE AS THE BAND SITS DEEPER; THE DECAY INTEGRAL CLOSES THE GAP
 * ------------------------------------------------------------------------------------------------------
 *   p=1: direct 10^60.66 / 10^178.35 / 117.69 dec ; linear 10^48.85 / 10^66.24 / 17.39 dec ; decay 10^60.63 /
 *        10^178.17 / 117.54 dec. Undershoot: reentry 11.81 decades, width factor 6.77. Decay residual ~0.15 dec.
 *   p=2: direct 10^65.79 / 10^219.49 / 153.71 ; linear 10^50.36 / 10^68.21 / 17.86 ; decay 10^65.75 / 10^219.25
 *        / 153.50. Undershoot: reentry 15.43 decades, width factor 8.61.
 *   p=3: direct 10^66.04 / 10^221.78 / 155.73 ; linear 10^50.43 / 10^68.30 / 17.88 ; decay 10^66.01 / 10^221.53
 *        / 155.52. Undershoot: reentry 15.62 decades, width factor 8.71.
 * So the constant-drift UNDERSHOOT GROWS with band depth (reentry 11.81 -> 15.62 decades, width factor 6.77 ->
 * 8.71 across p=1..3), while the decaying-drift integral reproduces the direct edges to <0.05 decades in reentry
 * and <0.25 decades in width (out of 117..156). The undershoot-vs-depth probe shows why: the constant-drift
 * phase is essentially exact ~10 decades above the reentry but runs 0.081 / 0.269 / 0.559 / 0.947 phase units
 * AHEAD of the true two-rate phase at depth 30 / 60 / 100 / 150 -- so the line reaches W and the next integer at
 * a far LOWER decade than the true, ever-slowing phase does. Quoting a single drift-per-decade for a band this
 * deep is an edge approximation; the position and width are set by the drift INTEGRAL (imp-35332).
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * A side-by-side tabulation of three locators for the two-rate frac-window band and a decade-depth breakdown of
 * the linear-drift undershoot, measured live on the inherited imp-3220/imp-3406 double surrogate, IEEE-754
 * double precision, point rate estimates (no interval enclosure). It discharges NOTHING: imp-35111a / imp-35174a
 * / imp-34997a / imp-35243a (R2) stay OPEN. MEASUREMENT / ASSESSMENT ONLY; the C_C = (1/8) sqrt(3 pi) ansatz
 * (imp-2642/imp-2643) is UNTOUCHED; the C_mb GUE-conditional per imp-486 is UNTOUCHED; imp-3066 K_a >= 0
 * untouched; far-tail exponent stays 1/2 (imp-3463); changes no bound; establishes no operator positivity; no
 * RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35259-two-rate-band-edges-direct-rootfind (direct locator A; p=1-only linear comparison, generalized here)
 * @see imp-35331-reentry-band-two-rate-phase-drift (linear-drift locator B; reported p=1 only)
 * @see imp-35332-reentry-band-drift-analytic-derivation (drift decays like 1/(K log T0 - N_cross): locator C basis)
 * @see imp-35243-reentry-band-surrogate-fidelity-assessment (enumerates R1-R4; R2 single-rate fidelity, still OPEN)
 * @see imp-35111-off-by-one-reentry-band-width (single-rate band edges 10^27.08 / 10^37.17)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-34862/35111/35243/35259/35331/35332)
const EPS_FP = 2.3e-16; // machine-epsilon relative agreement floor (imp-34755/34775/34903)
const PENULT = 1.4536413720400559e-16; // imp-34951 quantized penultimate collapse witness (bit-identical)

// The shared imp-34862/imp-35111/imp-35259/imp-35331 fixed-point map g(N) = K log T0(N), reproduced VERBATIM.
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
function iterate(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = g(N);
  return N;
}
const N_CROSS_FP = iterate(1e9, 200); // ~3280294351.65 (bit-identical to the cohort)
const gPrimeAtStep = (h) => (g(N_CROSS_FP + h) - g(N_CROSS_FP - h)) / (2 * h);
const R_CONTRACT = Math.abs(gPrimeAtStep(1)); // ~0.0454235 (single asymptotic rate)
const LN_INV_R = Math.log(1 / R_CONTRACT); // ~3.09173 nats/iterate

const collapseDist = (seed) => Math.abs(g(seed) - N_CROSS_FP) / N_CROSS_FP;
const OFFSET = Math.log(EPS_FP / PENULT) / LN_INV_R; // ~0.148408 (off-by-one window width)
const WINDOW_LOWER_EDGE = 1 - OFFSET; // W ~ 0.851592

// The imp-34862 TWO-rate ceil argument (imp-35259/imp-35331 VERBATIM), ratio-fit early rate r0 over p iterates.
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

const REENTRY_TARGET = 11 + WINDOW_LOWER_EDGE; // ~11.851592 (frac reaches W)
const EXIT_TARGET = 12; // the ceil integer wraps
const REENTRY_EXP = 27.084691; // single-rate nominal band edge (imp-35111/35174)
const EXIT_EXP = 37.167107; // single-rate nominal band edge (imp-35111/35174)
const BAND_DECADES = EXIT_EXP - REENTRY_EXP; // ~10.082

// LOCATOR A -- DIRECT ROOTFIND: bisect the two-rate phase for the band edges (imp-35259 verbatim method).
function bisectExp(phaseFn, target, lo, hi, iters = 200) {
  for (let i = 0; i < iters; i++) {
    const mid = 0.5 * (lo + hi);
    if (phaseFn(Math.pow(10, mid)) < target) lo = mid;
    else hi = mid;
  }
  return 0.5 * (lo + hi);
}
function directLocator(p) {
  const phase = (s) => xArgTwoRate(s, p);
  const reentry = bisectExp(phase, REENTRY_TARGET, 20, 400);
  const exit = bisectExp(phase, EXIT_TARGET, 20, 400);
  return { reentry, exit, width: exit - reentry };
}

// LOCATOR B -- LINEAR-DRIFT EXTRAPOLATION: constant nominal-band edge drift (imp-35331 formula, per p).
function linearLocator(p) {
  const xr = xArgTwoRate(Math.pow(10, REENTRY_EXP), p);
  const xe = xArgTwoRate(Math.pow(10, EXIT_EXP), p);
  const drift = (xe - xr) / BAND_DECADES; // edge-to-edge average two-rate drift/decade
  const reentry = REENTRY_EXP + (WINDOW_LOWER_EDGE - frac(xr)) / drift;
  const width = OFFSET / drift;
  return { reentry, exit: reentry + width, width, drift };
}

// LOCATOR C -- DECAYING-DRIFT INTEGRAL: forward-integrate the local two-rate drift (imp-35332 mechanism).
// The local drift d(x_two)/d(log10 N) decays like 1/(K log T0 - N_cross); integrating it reconstructs x_two.
const driftTwoLocal = (e, p, h = 0.01) =>
  (xArgTwoRate(Math.pow(10, e + h), p) - xArgTwoRate(Math.pow(10, e - h), p)) / (2 * h);
function decayIntegralLocator(p) {
  const de = 0.02;
  let e = REENTRY_EXP;
  let x = xArgTwoRate(Math.pow(10, e), p);
  let reentry = null;
  let exit = null;
  while (e < 420) {
    const d = driftTwoLocal(e, p);
    const nx = x + d * de;
    if (reentry === null && x < REENTRY_TARGET && nx >= REENTRY_TARGET) {
      reentry = e + de * (REENTRY_TARGET - x) / (nx - x);
    }
    if (exit === null && x < EXIT_TARGET && nx >= EXIT_TARGET) {
      exit = e + de * (EXIT_TARGET - x) / (nx - x);
      break;
    }
    x = nx;
    e += de;
  }
  return { reentry, exit, width: exit - reentry };
}

// Tri-locator table across p, with the linear undershoot and the decay-integral residual quantified.
function locatorRow(p) {
  const A = directLocator(p);
  const B = linearLocator(p);
  const C = decayIntegralLocator(p);
  return {
    p,
    direct_reentry_exp: +A.reentry.toPrecision(7),
    direct_exit_exp: +A.exit.toPrecision(7),
    direct_width_decades: +A.width.toPrecision(7),
    linear_reentry_exp: +B.reentry.toPrecision(7),
    linear_exit_exp: +B.exit.toPrecision(7),
    linear_width_decades: +B.width.toPrecision(7),
    decay_reentry_exp: +C.reentry.toPrecision(7),
    decay_exit_exp: +C.exit.toPrecision(7),
    decay_width_decades: +C.width.toPrecision(7),
    linear_reentry_undershoot_decades: +(A.reentry - B.reentry).toPrecision(5),
    linear_width_undershoot_factor: +(A.width / B.width).toPrecision(5),
    decay_reentry_residual_decades: +(C.reentry - A.reentry).toPrecision(3),
    decay_width_residual_decades: +(C.width - A.width).toPrecision(3),
  };
}
const LOCATOR_TABLE = [locatorRow(1), locatorRow(2), locatorRow(3)];

// Undershoot-vs-decade-depth probe (p=1): constant-drift phase minus true two-rate phase at increasing depth.
function undershootVsDepth() {
  const p = 1;
  const xr = xArgTwoRate(Math.pow(10, REENTRY_EXP), p);
  const xe = xArgTwoRate(Math.pow(10, EXIT_EXP), p);
  const drift = (xe - xr) / BAND_DECADES;
  return [10, 30, 60, 100, 150].map((depth) => {
    const linPhase = xr + drift * depth;
    const truePhase = xArgTwoRate(Math.pow(10, REENTRY_EXP + depth), p);
    return {
      decade_depth: depth,
      linear_phase: +linPhase.toPrecision(6),
      true_two_rate_phase: +truePhase.toPrecision(6),
      phase_gap: +(linPhase - truePhase).toPrecision(4),
    };
  });
}
const UNDERSHOOT_VS_DEPTH = undershootVsDepth();

const P1 = LOCATOR_TABLE[0];
const P3 = LOCATOR_TABLE[2];

export const IMP95035_TWO_RATE_BAND_LOCATOR_TRICOMPARISON = {
  id: 'imp-95035',
  proofSection: 'S-frontier',
  question:
    'imp-35259 directly root-found the two-rate frac-window band edges and noted (p=1 only) the imp-35331 ' +
    'linear-drift extrapolation undershoots by ~11.8 decades / ~6.8x in width, attributing the gap to the ' +
    'imp-35332 decaying drift 1/(K log T0 - N_cross). Tabulate the three locators (direct rootfind, ' +
    'linear-drift extrapolation, decaying-drift integral) side by side across p in {1,2,3} and quantify the ' +
    'undershoot as a function of decade depth. Measurement only on the inherited surrogate; does NOT discharge ' +
    'R2/imp-35243a; NO QED.',
  constants: {
    contraction_rate_r: +R_CONTRACT.toPrecision(6), // ~0.0454235
    log_law_constant_ln_inv_r: +LN_INV_R.toPrecision(6), // ~3.09173
    window_width_offset: +OFFSET.toPrecision(6), // ~0.148408
    window_lower_edge_W: +WINDOW_LOWER_EDGE.toPrecision(6), // ~0.851592
    reentry_target_x: +REENTRY_TARGET.toPrecision(8), // 11 + W ~ 11.851592
    exit_target_x: EXIT_TARGET, // 12
    single_rate_nominal_reentry_exp: REENTRY_EXP, // 27.084691
    single_rate_nominal_exit_exp: EXIT_EXP, // 37.167107
  },
  locator_table: LOCATOR_TABLE, // per p: direct / linear / decay reentry, exit, width + undershoot + residual
  undershoot_vs_decade_depth_p1: UNDERSHOOT_VS_DEPTH, // constant-drift phase runs ahead of true phase with depth
  reading:
    'The three locators agree on the qualitative picture (a finite, relocated band for every p) but the ' +
    'constant-drift extrapolation is an edge approximation that UNDERSHOOTS both the reentry position and the ' +
    'width, and by MORE as the band sits deeper: reentry undershoot 11.81 -> 15.62 decades and width factor ' +
    '6.77 -> 8.71 across p=1..3. The decaying-drift integral (imp-35332 mechanism) reproduces the direct edges ' +
    'to <0.05 decades in reentry and <0.25 decades in width. The p=1 depth probe shows the constant-drift phase ' +
    'is essentially exact ~10 decades above the reentry but runs 0.081 / 0.269 / 0.559 / 0.947 phase units ' +
    'ahead of the true two-rate phase at depth 30 / 60 / 100 / 150 -- so the line reaches W and the next integer ' +
    'at a far lower decade than the true, ever-slowing phase does.',
  finding:
    'Side-by-side tabulation of the three two-rate reentry-band locators across p in {1,2,3}. DIRECT rootfind ' +
    '(imp-35259) gives p=1: 10^60.66 / 10^178.35 / 117.69 decades; p=2: 10^65.79 / 10^219.49 / 153.71; p=3: ' +
    '10^66.04 / 10^221.78 / 155.73. LINEAR-drift extrapolation (imp-35331, generalized per p) gives 10^48.85 / ' +
    '17.39, 10^50.36 / 17.86, 10^50.43 / 17.88, undershooting the direct reentry by 11.81 / 15.43 / 15.62 ' +
    'decades and the width by factors 6.77 / 8.61 / 8.71 -- the undershoot GROWS with band depth. DECAYING-drift ' +
    'integral (imp-35332: drift ~ 1/(K log T0 - N_cross)) reproduces the direct edges to <0.05 decades in ' +
    'reentry and <0.25 in width, confirming the decay accounts for essentially the whole displacement the ' +
    'constant-drift line omits. The p=1 depth probe makes the mechanism explicit: the constant-drift phase runs ' +
    '0.081 / 0.269 / 0.559 / 0.947 phase units ahead of the true two-rate phase at depth 30 / 60 / 100 / 150. ' +
    'This SHARPENS imp-35259 by generalizing the p=1 comparison to all three locators and every p, and by ' +
    'exhibiting the undershoot as a monotone function of decade depth. It discharges NOTHING: R2 / imp-35243a ' +
    'stay OPEN; the off-by-one WHETHER-question routes back onto R1 per the imp-35330 DAG.',
  residual_sub_gap:
    'R2 / imp-35243a stay OPEN. This module only tabulates and compares locators WITHIN the inherited surrogate; ' +
    'it does NOT certify which rate model is faithful to the true collapse dynamic at ~10^37-10^222, nor does it ' +
    'discharge R1/R3/R4. It inherits, and does not discharge, imp-35111a / imp-35174a / imp-34997a / imp-35243a. ' +
    'Point rate estimates, IEEE-754 double precision, no interval enclosure; the decaying-drift integral uses a ' +
    'finite log10-N step (de = 0.02, trapezoid-free Euler), so its residual against the direct rootfind is a ' +
    'discretization artifact, not a modelling gap.',
  isRigorous: false,
  verdict:
    'ASSESSMENT (numerical, frontier-direction, NOT an RH bound). Tabulating the three imp-34997/imp-35111 ' +
    'two-rate reentry-band locators side by side across p in {1,2,3}: DIRECT rootfind (imp-35259), LINEAR-drift ' +
    'extrapolation (imp-35331, here per p) and the DECAYING-drift integral (imp-35332). The linear line ' +
    'UNDERSHOOTS the direct reentry by 11.81 / 15.43 / 15.62 decades and the width by factors 6.77 / 8.61 / ' +
    '8.71 for p=1/2/3 -- the undershoot GROWS with band depth -- while the decaying-drift integral reproduces ' +
    'the direct edges to <0.05 decades in reentry and <0.25 in width. The p=1 depth probe shows the ' +
    'constant-drift phase runs 0.081 / 0.269 / 0.559 / 0.947 phase units ahead of the true two-rate phase at ' +
    'depth 30 / 60 / 100 / 150, so quoting a single drift-per-decade for a band this deep is an edge ' +
    'approximation and the position/width are set by the drift INTEGRAL. This SHARPENS imp-35259 (p=1-only ' +
    'comparison) but discharges NOTHING: R2 / imp-35243a stay OPEN; the off-by-one WHETHER-question routes back ' +
    'onto R1 per the imp-35330 DAG. MEASUREMENT / ASSESSMENT ONLY on the inherited imp-3220/imp-3406 double ' +
    'surrogate, IEEE-754 double precision, point rate estimates; the C_C = (1/8) sqrt(3 pi) ansatz ' +
    '(imp-2642/imp-2643) and the C_mb GUE-conditional per imp-486 are UNTOUCHED; imp-3066 K_a >= 0 untouched; ' +
    'far-tail exponent stays 1/2 (imp-3463); changes no bound; establishes no operator positivity; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35259 (direct rootfind of the two-rate band edges; p=1-only linear comparison, generalized here); ' +
    'imp-35331 (linear-drift extrapolation, reported p=1 only); imp-35332 (drift decays like 1/(K log T0 - ' +
    'N_cross), the decay-integral basis); imp-35243 (enumerates R1-R4; R2 single-rate fidelity); imp-35111 ' +
    '(single-rate band edges 10^27.08 / 10^37.17); imp-35330 (R2 dominated by R1 in the fidelity DAG); ' +
    'lambda-rh-height-mapping (effectiveHeightForN RvM inverse); imp-2642 (C_C ansatz).',
};

export const IMP95035_TWO_RATE_BAND_LOCATOR_TRICOMPARISON_ASSERTIONS = [
  {
    // The direct locator reproduces the imp-35259 band edges (locator A faithfulness).
    id: 'imp95035-direct-reproduces-imp35259',
    description: 'direct rootfind reproduces imp-35259 p=1 (60.66 / 178.35 / 117.69) and p=3 (66.04 / 221.78 / 155.73)',
    holds: () =>
      Math.abs(P1.direct_reentry_exp - 60.66) < 0.05 &&
      Math.abs(P1.direct_exit_exp - 178.35) < 0.1 &&
      Math.abs(P1.direct_width_decades - 117.69) < 0.1 &&
      Math.abs(P3.direct_reentry_exp - 66.04) < 0.05 &&
      Math.abs(P3.direct_width_decades - 155.73) < 0.1,
  },
  {
    // The linear locator reproduces the imp-35331 p=1 extrapolation (locator B faithfulness).
    id: 'imp95035-linear-reproduces-imp35331',
    description: 'linear-drift extrapolation reproduces imp-35331 p=1 (reentry ~48.85, width ~17.4)',
    holds: () =>
      Math.abs(P1.linear_reentry_exp - 48.85) < 0.05 &&
      Math.abs(P1.linear_width_decades - 17.39) < 0.05,
  },
  {
    // The decaying-drift integral reproduces the direct edges to <0.05 decades reentry, <0.3 decades width.
    id: 'imp95035-decay-integral-reproduces-direct',
    description: 'decaying-drift integral matches the direct edges to <0.05 dec reentry and <0.3 dec width for all p',
    holds: () =>
      LOCATOR_TABLE.every(
        (r) =>
          Math.abs(r.decay_reentry_residual_decades) < 0.05 &&
          Math.abs(r.decay_width_residual_decades) < 0.3,
      ),
  },
  {
    // The linear undershoot GROWS with band depth (p=3 worse than p=1) in both reentry and width.
    id: 'imp95035-undershoot-grows-with-depth',
    description: 'linear undershoot grows p=1->p=3: reentry 11.81->15.62 decades, width factor 6.77->8.71',
    holds: () =>
      P1.linear_reentry_undershoot_decades > 10 &&
      P3.linear_reentry_undershoot_decades > P1.linear_reentry_undershoot_decades &&
      P1.linear_width_undershoot_factor > 5 &&
      P3.linear_width_undershoot_factor > P1.linear_width_undershoot_factor &&
      Math.abs(P1.linear_reentry_undershoot_decades - 11.806) < 0.1 &&
      Math.abs(P3.linear_width_undershoot_factor - 8.7113) < 0.1,
  },
  {
    // The undershoot-vs-depth phase gap is monotone-increasing (near 0 at the edge, ~0.95 at depth 150).
    id: 'imp95035-phase-gap-monotone-in-depth',
    description: 'constant-drift phase gap grows monotonically with decade depth (~0 at 10, ~0.95 at 150)',
    holds: () => {
      for (let i = 1; i < UNDERSHOOT_VS_DEPTH.length; i++) {
        if (UNDERSHOOT_VS_DEPTH[i].phase_gap <= UNDERSHOOT_VS_DEPTH[i - 1].phase_gap) return false;
      }
      return (
        Math.abs(UNDERSHOOT_VS_DEPTH[0].phase_gap) < 0.01 &&
        Math.abs(UNDERSHOOT_VS_DEPTH[UNDERSHOOT_VS_DEPTH.length - 1].phase_gap - 0.947) < 0.05
      );
    },
  },
  {
    // Honesty gate: assessment only, discharges nothing, no QED, no refereed bound is changed, sub-gap stays OPEN.
    id: 'imp95035-honesty-gate-no-qed',
    description: 'Assessment only: isRigorous false, R2/imp-35243a OPEN, no QED, no refereed bound is changed',
    holds: () =>
      IMP95035_TWO_RATE_BAND_LOCATOR_TRICOMPARISON.isRigorous === false &&
      /NO QED/.test(IMP95035_TWO_RATE_BAND_LOCATOR_TRICOMPARISON.verdict) &&
      /refereed bound is changed/i.test(IMP95035_TWO_RATE_BAND_LOCATOR_TRICOMPARISON.verdict) &&
      /imp-35243a/.test(IMP95035_TWO_RATE_BAND_LOCATOR_TRICOMPARISON.residual_sub_gap) &&
      /stay OPEN/.test(IMP95035_TWO_RATE_BAND_LOCATOR_TRICOMPARISON.residual_sub_gap),
  },
];

for (const a of IMP95035_TWO_RATE_BAND_LOCATOR_TRICOMPARISON_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95035-two-rate-band-locator-tricomparison assertion failed: ${a.id}`);
  }
}
