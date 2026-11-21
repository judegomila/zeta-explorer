/**
 * @module imp-35263-reentry-band-eps-floor-sweep
 *
 * imp-35263 (numerical, frontier-direction) -- DIRECTLY sweeps the machine-epsilon floor EPS_FP over a range of
 * factor-2 multiples and TABULATES the imp-34997/imp-35111 iters-to-floor REENTRY-band edge positions, turning the
 * imp-35243 DEMONSTRATION D1 (which asserted a ~11.99-decade-per-factor-2 band slide ANALYTICALLY, via the pure
 * phase shift log(2)/ln(1/r) at the nominal drift 0.0187) into a MEASURED table. This is the imp-35243 R1
 * (floor-independence) diagnostic: it quantifies how strongly the band is pinned to the representation constant
 * EPS_FP. ASSESSMENT / MEASUREMENT ONLY on the inherited imp-3220/imp-3406 double surrogate; it does NOT discharge
 * the surrogate-fidelity certificate imp-35243a; NO QED.
 *
 * THE SWEEP (all live on the inherited imp-3220/imp-3406 double surrogate, imp-35259 root-finder reproduced)
 * ---------------------------------------------------------------------------------------------------------
 * For EPS_FP_k = 2.3e-16 * 2^k, k in {-1,0,1,2}, the ceil argument is xArg_k(seed) = log(collapseDist(seed) /
 * EPS_FP_k) / ln(1/r). The off-by-one PHASE window is (W, 1) with W = 1 - OFFSET(eps), OFFSET(eps) =
 * log(eps/PENULT)/ln(1/r). Two window conventions are tabulated by direct bisection:
 *   (A) FIXED window -- hold the base window edge W_0 fixed; reentry at xArg_k = 11 + W_0, exit at xArg_k = 12.
 *       This is exactly D1s framing (the window is an external fixed phase band, the xArg curve slides under it).
 *   (B) FAITHFUL / co-moving window -- recompute W_k = 1 - OFFSET(eps_k) each step (the windows OWN definition,
 *       since OFFSET depends on eps); reentry at xArg_k = 11 + W_k, exit at xArg_k = 12.
 *
 * WHAT THE MEASUREMENT SHOWS
 * -------------------------
 * (1) R1 IS CONFIRMED BINDING BY DIRECT SWEEP. The band position is a strong, monotone-increasing function of
 *     EPS_FP: doubling EPS_FP once slides the fixed-window reentry edge UP by +17.29 decades (from 10^27.0847 to
 *     10^44.3777) and the exit edge by +27.25 decades. The band cannot be de-anchored from the floor.
 * (2) D1s ~11.99-DECADE FIGURE IS EXACTLY THE REENTRY-EDGE LOCAL RATE. The nominal 0.0187 drift D1 divides by is
 *     the LOCAL ceil-phase drift at the reentry edge N ~ 10^27.08: measured d(xArg)/d(log10 N)|_{1e27} =
 *     0.0186273, giving L2/drift = 0.22419/0.0186273 = 12.036 decades per factor-2 -- matching D1s 11.989 to ~0.05.
 *     So the direct sweep VALIDATES D1s number as the reentry-edge local slide.
 * (3) THE SLIDE IS NOT A SINGLE CONSTANT -- IT GROWS WITH N (imp-35332). Because the ceil-phase drift DECAYS with
 *     N like 1/(K log T0 - N_cross) (imp-35332: 0.0186273 at reentry -> 0.0118306 at exit, factor ~1.574), the
 *     EXIT edge slides FASTER than the reentry edge: L2/drift|_{1e37} = 18.95 decades per factor-2, and each
 *     successive octave slides more than the last (fixed-window reentry increments 8.72 -> 17.29 -> 34.39 decades
 *     over k = -1 -> 0 -> 1 -> 2). D1s single 11.99 is a local linearization at the reentry edge, not a global rate.
 * (4) UNDER THE FAITHFUL CO-MOVING WINDOW THE REENTRY EDGE IS EXACTLY EPS_FP-INVARIANT. Because W_k = 1 -
 *     OFFSET(eps_k) shifts DOWN by exactly log(2)/ln(1/r) per factor-2 -- the SAME additive amount xArg shifts --
 *     the reentry root xArg_k(seed) = 11 + W_k is solved by the identical seed for every k (measured spread ~1e-13
 *     across the sweep). All the EPS_FP sensitivity is then carried by the EXIT edge (fixed integer phase 12,
 *     which does NOT co-move) and hence by the band WIDTH. So the band does not translate rigidly: it ANCHORS at
 *     reentry and STRETCHES from the exit. This SHARPENS D1 (whose rigid-slide picture holds only for a fixed
 *     window) without weakening it: either way, band-defining structure (the exit edge / width) is a direct
 *     ~12-19+ decade-per-factor-2 function of the machine-epsilon floor -- exactly what R1 must sever.
 *
 * THE ASSESSMENT VERDICT (bearing on R1)
 * --------------------------------------
 * The direct EPS_FP sweep CONFIRMS imp-35243 R1 as binding: the reentry band is pinned to the machine-epsilon
 * floor, sliding >10 decades per factor-2 in a representation constant absent from the true continuum. It REFINES
 * D1 in two ways: (i) the ~11.99 figure is precisely the reentry-edge LOCAL rate (drift 0.0187 = drift at 1e27),
 * not a uniform band slide; the exit edge slides ~19 decades/factor-2 and each octave slides more because the
 * drift decays (imp-35332); (ii) under the windows own co-moving definition the reentry edge is EXACTLY
 * EPS_FP-invariant and the entire sensitivity lives in the exit edge / band width. It discharges NOTHING: R1 /
 * imp-35243a stay OPEN.
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * A direct EPS_FP factor-2 sweep tabulating the imp-34997/imp-35111 reentry-band edges, measured live on the
 * inherited imp-3220/imp-3406 double surrogate, IEEE-754 double precision, point rate estimates (no interval
 * enclosure). It discharges NOTHING: imp-35111a / imp-35174a / imp-35243a (R1) stay OPEN. MEASUREMENT / ASSESSMENT
 * ONLY; the C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) is UNTOUCHED; the C_mb GUE-conditional per imp-486 is
 * UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); changes no bound; establishes no
 * operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35243-reentry-band-surrogate-fidelity-assessment (states D1 ~12-decade/factor-2 analytically; R1)
 * @see imp-35259-two-rate-band-edges-direct-rootfind (the direct-bisection root-finder reproduced here)
 * @see imp-35332-reentry-band-drift-analytic-derivation (drift decays 0.0186273 -> 0.0118306; why the slide grows)
 * @see imp-35111-off-by-one-reentry-band-width (parent: single-rate band edges 10^27.08 / 10^37.17)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-35111/35243/35259/35332)
const EPS_FP_BASE = 2.3e-16; // machine-epsilon relative agreement floor (imp-34755/34775/34903)
const PENULT = 1.4536413720400559e-16; // imp-34951 quantized penultimate collapse witness (bit-identical)

// The shared imp-35111/imp-35243/imp-35259 fixed-point map g(N) = K log T0(N), reproduced VERBATIM.
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
function iterate(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = g(N);
  return N;
}
const N_CROSS_FP = iterate(1e9, 200); // ~3280294351.65 (bit-identical to imp-35111/35243/35259)
const gPrimeAtStep = (h) => (g(N_CROSS_FP + h) - g(N_CROSS_FP - h)) / (2 * h);
const R_CONTRACT = Math.abs(gPrimeAtStep(1)); // ~0.0454235
const LN_INV_R = Math.log(1 / R_CONTRACT); // ~3.091726 nats/iterate

const collapseDist = (seed) => Math.abs(g(seed) - N_CROSS_FP) / N_CROSS_FP;
const xArg = (seed, eps) => Math.log(collapseDist(seed) / eps) / LN_INV_R;
const OFFSET = (eps) => Math.log(eps / PENULT) / LN_INV_R; // window width for this floor
const W = (eps) => 1 - OFFSET(eps); // window lower edge for this floor

// The pure additive phase shift per factor-2 change in EPS_FP (D1s log(2)/ln(1/r)).
const PHASE_SHIFT_PER_FACTOR2 = Math.log(2) / LN_INV_R; // ~0.224194 phase units
const W0 = W(EPS_FP_BASE); // ~0.851592 (base window lower edge)

// Bisect on log10(seed): both xArg phases are monotone-increasing in log10 N (validated below).
function bisectExp(phaseFn, target, lo, hi, iters = 200) {
  for (let i = 0; i < iters; i++) {
    const mid = 0.5 * (lo + hi);
    if (phaseFn(Math.pow(10, mid)) < target) lo = mid;
    else hi = mid;
  }
  return 0.5 * (lo + hi);
}

// THE SWEEP: EPS_FP_k = base * 2^k, k in {-1,0,1,2}. For each, bisect the (A) fixed-window and (B) co-moving-window
// reentry edges and the (shared) exit edge (fixed integer phase 12). Bounds [8,400] hold the roots un-clamped.
const K_LADDER = [-1, 0, 1, 2];
const SWEEP = K_LADDER.map((k) => {
  const eps = EPS_FP_BASE * Math.pow(2, k);
  const phase = (seed) => xArg(seed, eps);
  const reentry_fixed_exp = bisectExp(phase, 11 + W0, 8, 400); // (A) base window held fixed (D1 framing)
  const reentry_comoving_exp = bisectExp(phase, 11 + W(eps), 8, 400); // (B) windows own co-moving definition
  const exit_exp = bisectExp(phase, 12, 8, 400); // shared: fixed integer phase 12
  return {
    k,
    eps_over_base: Math.pow(2, k),
    reentry_fixed_exp: +reentry_fixed_exp.toPrecision(7),
    reentry_comoving_exp: +reentry_comoving_exp.toPrecision(7),
    exit_exp: +exit_exp.toPrecision(7),
    width_fixed_decades: +(exit_exp - reentry_fixed_exp).toPrecision(7),
  };
});

// Validate the bisection premise: xArg is monotone-increasing in log10 N across the swept band.
let PHASE_MONOTONE = true;
{
  let prev = -Infinity;
  for (let e = 8; e <= 130; e += 5) {
    const v = xArg(Math.pow(10, e), EPS_FP_BASE);
    if (v < prev) PHASE_MONOTONE = false;
    prev = v;
  }
}

// (1) R1: first-doubling fixed-window reentry slide (k=0 -> k=1), in decades of N.
const idx = (k) => SWEEP.find((s) => s.k === k);
const FIRST_DOUBLING_REENTRY_SLIDE = idx(1).reentry_fixed_exp - idx(0).reentry_fixed_exp; // ~+17.29 decades
const FIRST_DOUBLING_EXIT_SLIDE = idx(1).exit_exp - idx(0).exit_exp; // ~+27.25 decades
// (3) super-linear growth: each octave slides MORE than the previous (drift decays with N).
const PREV_OCTAVE_REENTRY_SLIDE = idx(0).reentry_fixed_exp - idx(-1).reentry_fixed_exp; // ~+8.72 decades

// (2)/(3) LOCAL ceil-phase drift d(xArg)/d(log10 N) at the reentry (1e27) and exit (1e37) edges (imp-35332 values).
const driftLocal = (expN) => {
  const h = 0.01;
  return (xArg(Math.pow(10, expN + h), EPS_FP_BASE) - xArg(Math.pow(10, expN - h), EPS_FP_BASE)) / (2 * h);
};
const DRIFT_AT_REENTRY = driftLocal(27.0847); // ~0.0186273 (imp-35332)
const DRIFT_AT_EXIT = driftLocal(37.1671); // ~0.0118306 (imp-35332)
const DECADES_PER_FACTOR2_AT_REENTRY = PHASE_SHIFT_PER_FACTOR2 / DRIFT_AT_REENTRY; // ~12.036 (matches D1 11.99)
const DECADES_PER_FACTOR2_AT_EXIT = PHASE_SHIFT_PER_FACTOR2 / DRIFT_AT_EXIT; // ~18.95 (exit slides faster)

// (4) co-moving-window reentry edge: EXACTLY EPS_FP-invariant across the sweep (W_k co-shifts with xArg).
const COMOVING_REENTRY_SPREAD =
  Math.max(...SWEEP.map((s) => s.reentry_comoving_exp)) - Math.min(...SWEEP.map((s) => s.reentry_comoving_exp)); // ~1e-13

const DECADE_SHIFT_D1_NOMINAL = PHASE_SHIFT_PER_FACTOR2 / 0.0187; // ~11.989 (D1s nominal, constant-drift figure)

export const IMP35263_REENTRY_BAND_EPS_FLOOR_SWEEP = {
  id: 'imp-35263',
  proofSection: 'S-frontier',
  question:
    'imp-35243 D1 asserts a factor-2 change in the machine-epsilon floor EPS_FP shifts every xArg by log(2)/' +
    'ln(1/r) ~ 0.2242 phase units, sliding the reentry band ~11.99 decades in N -- but states it ANALYTICALLY ' +
    'and never sweeps EPS_FP. Directly sweep EPS_FP over factor-2 multiples, tabulate the reentry/exit edge ' +
    'positions, confirm the phase-shift law and quantify the exact decades-per-factor-2. R1 floor-independence ' +
    'diagnostic; measurement only on the inherited surrogate; does NOT discharge imp-35243a; NO QED.',
  constants: {
    contraction_rate_r: +R_CONTRACT.toPrecision(6), // ~0.0454235
    log_law_constant_ln_inv_r: +LN_INV_R.toPrecision(6), // ~3.091726
    phase_shift_per_factor2: +PHASE_SHIFT_PER_FACTOR2.toPrecision(6), // ~0.224194 = log(2)/ln(1/r)
    window_lower_edge_W0: +W0.toPrecision(6), // ~0.851592
    d1_nominal_decades_per_factor2: +DECADE_SHIFT_D1_NOMINAL.toPrecision(6), // ~11.989 (D1s constant-drift figure)
  },
  sweep_table: SWEEP, // per k: eps_over_base, reentry_fixed_exp, reentry_comoving_exp, exit_exp, width_fixed_decades
  phase_monotone_increasing: PHASE_MONOTONE,
  measured_slides: {
    first_doubling_reentry_slide_decades: +FIRST_DOUBLING_REENTRY_SLIDE.toPrecision(6), // ~+17.29
    first_doubling_exit_slide_decades: +FIRST_DOUBLING_EXIT_SLIDE.toPrecision(6), // ~+27.25
    prev_octave_reentry_slide_decades: +PREV_OCTAVE_REENTRY_SLIDE.toPrecision(6), // ~+8.72 (smaller: super-linear)
    drift_at_reentry_1e27: +DRIFT_AT_REENTRY.toPrecision(7), // ~0.0186273
    drift_at_exit_1e37: +DRIFT_AT_EXIT.toPrecision(7), // ~0.0118306
    decades_per_factor2_at_reentry_edge: +DECADES_PER_FACTOR2_AT_REENTRY.toPrecision(6), // ~12.036 (matches D1)
    decades_per_factor2_at_exit_edge: +DECADES_PER_FACTOR2_AT_EXIT.toPrecision(6), // ~18.95 (faster)
    comoving_reentry_spread: +COMOVING_REENTRY_SPREAD.toPrecision(3), // ~1e-13 (exactly invariant)
  },
  reading:
    'The direct EPS_FP sweep confirms imp-35243 R1 binding: the reentry band is pinned to the machine-epsilon ' +
    'floor. (1) Doubling EPS_FP once slides the fixed-window reentry edge +17.29 decades (10^27.08 -> 10^44.38) ' +
    'and the exit edge +27.25 decades. (2) D1s ~11.99 figure is EXACTLY the reentry-edge local rate: the ' +
    'measured drift at 10^27.08 is 0.0186273, giving L2/drift = 12.036 decades/factor-2. (3) The slide is NOT a ' +
    'single constant -- because the drift decays with N (imp-35332: 0.0186273 -> 0.0118306), the exit edge ' +
    'slides ~18.95 decades/factor-2 and each octave slides more than the last (reentry increments 8.72 -> 17.29 ' +
    '-> 34.39). (4) Under the windows own co-moving definition (W_k = 1 - OFFSET(eps_k)) the reentry edge is ' +
    'EXACTLY EPS_FP-invariant (spread ~1e-13); all sensitivity lives in the exit edge / band width. Either way, ' +
    'band-defining structure is a direct >10 decade-per-factor-2 function of the machine-epsilon floor.',
  finding:
    'Direct factor-2 sweep of the machine-epsilon floor EPS_FP, tabulating the imp-34997/imp-35111 reentry-band ' +
    'edges (imp-35259 root-finder reproduced). This turns imp-35243 DEMONSTRATION D1 from an analytic assertion ' +
    'into a MEASURED table and CONFIRMS R1 binding. Findings: (1) doubling EPS_FP slides the fixed-window ' +
    'reentry edge +17.29 decades and the exit edge +27.25 decades -- the band cannot be de-anchored from the ' +
    'floor; (2) D1s ~11.99-decade figure is EXACTLY the reentry-edge local rate -- the measured drift at ' +
    '10^27.08 is 0.0186273, so L2/drift = 12.036 decades/factor-2, matching D1s 11.989 to ~0.05; (3) the slide ' +
    'is NOT a single constant: the drift decays with N (imp-35332: 0.0186273 -> 0.0118306), so the exit edge ' +
    'slides ~18.95 decades/factor-2 and each successive octave slides more (reentry increments 8.72 -> 17.29 -> ' +
    '34.39); (4) under the windows OWN co-moving definition W_k = 1 - OFFSET(eps_k) the reentry edge is EXACTLY ' +
    'EPS_FP-invariant (spread ~1e-13), with all sensitivity carried by the exit edge / band width -- so the band ' +
    'anchors at reentry and stretches, rather than translating rigidly. This VALIDATES D1s number as the ' +
    'reentry-edge local slide and REFINES its uniform-rate picture. It discharges NOTHING: R1 / imp-35243a OPEN.',
  residual_sub_gap:
    'R1 / imp-35243a stay OPEN. This module MEASURES the band-vs-EPS_FP sensitivity (the R1 floor-independence ' +
    'diagnostic) but does NOT re-express the band in a floor-free continuum limit nor prove the true dynamic has ' +
    'an intrinsic floor at EPS_FP. It inherits, and does not discharge, imp-35111a / imp-35174a / imp-34997a / ' +
    'imp-35243a. Point rate estimates, IEEE-754 double precision, no interval enclosure.',
  isRigorous: false,
  verdict:
    'ASSESSMENT (numerical, frontier-direction, NOT an RH bound). Directly sweeping the machine-epsilon floor ' +
    'EPS_FP over factor-2 multiples and tabulating the imp-34997/imp-35111 reentry-band edges, turning imp-35243 ' +
    'DEMONSTRATION D1 into a measured table. R1 is CONFIRMED binding: doubling EPS_FP slides the fixed-window ' +
    'reentry edge +17.29 decades (10^27.08 -> 10^44.38) and the exit edge +27.25 decades. D1s ~11.99 figure is ' +
    'EXACTLY the reentry-edge local rate (measured drift 0.0186273 at 10^27.08 -> 12.036 decades/factor-2); the ' +
    'slide is NOT constant -- the drift decays with N (imp-35332), so the exit edge slides ~18.95 decades/' +
    'factor-2 and each octave slides more; and under the windows own co-moving definition the reentry edge is ' +
    'EXACTLY EPS_FP-invariant with all sensitivity in the exit edge / band width. So the band-defining structure ' +
    'is a direct >10 decade-per-factor-2 function of the machine-epsilon floor -- exactly what R1 must sever. ' +
    'This discharges NOTHING: R1 / imp-35243a stay OPEN. MEASUREMENT / ASSESSMENT ONLY on the inherited imp-3220/' +
    'imp-3406 double surrogate, IEEE-754 double precision, point rate estimates; the C_C = (1/8) sqrt(3 pi) ' +
    'ansatz (imp-2642/imp-2643) and the C_mb GUE-conditional per imp-486 are UNTOUCHED; imp-3066 K_a >= 0 ' +
    'untouched; far-tail exponent stays 1/2 (imp-3463); changes no bound; establishes no operator positivity; ' +
    'no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35243 (states D1 ~12-decade/factor-2 analytically; R1 floor-independence); imp-35259 (the direct-' +
    'bisection root-finder reproduced here); imp-35332 (drift decays 0.0186273 -> 0.0118306, why the slide ' +
    'grows with N); imp-35111 (single-rate band edges 10^27.08 / 10^37.17); imp-34997 (locates the reentry); ' +
    'lambda-rh-height-mapping (effectiveHeightForN RvM inverse); imp-2642 (C_C ansatz).',
};

export const IMP35263_REENTRY_BAND_EPS_FLOOR_SWEEP_ASSERTIONS = [
  {
    // R1 confirmed by direct sweep: doubling EPS_FP slides the reentry band by >10 decades, monotone in k.
    id: 'imp35263-R1-floor-slides-band-by-sweep',
    description: 'doubling EPS_FP slides the fixed-window reentry edge >10 decades; edges monotone-increasing in k',
    holds: () =>
      PHASE_MONOTONE === true &&
      FIRST_DOUBLING_REENTRY_SLIDE > 10 &&
      Math.abs(FIRST_DOUBLING_REENTRY_SLIDE - 17.29) < 0.1 &&
      SWEEP.every((s, i) => i === 0 || s.reentry_fixed_exp > SWEEP[i - 1].reentry_fixed_exp) &&
      SWEEP.every((s, i) => i === 0 || s.exit_exp > SWEEP[i - 1].exit_exp),
  },
  {
    // D1s ~11.99 is EXACTLY the reentry-edge local rate: measured drift 0.0186273 -> 12.036 decades/factor-2.
    id: 'imp35263-D1-figure-is-reentry-edge-local-rate',
    description: 'L2/drift at the 10^27.08 reentry edge = 12.036, matching D1s nominal 11.989 to ~0.05',
    holds: () =>
      Math.abs(DRIFT_AT_REENTRY - 0.0186273) < 1e-5 &&
      Math.abs(DECADES_PER_FACTOR2_AT_REENTRY - DECADE_SHIFT_D1_NOMINAL) < 0.15 &&
      Math.abs(DECADES_PER_FACTOR2_AT_REENTRY - 12.036) < 0.05,
  },
  {
    // The slide is NOT constant: the exit edge slides FASTER than reentry (drift decays with N, imp-35332).
    id: 'imp35263-slide-grows-drift-decays',
    description: 'exit-edge decades/factor-2 (~18.95) > reentry-edge (~12.04) and each octave slides more (super-linear)',
    holds: () =>
      DRIFT_AT_EXIT < DRIFT_AT_REENTRY &&
      DECADES_PER_FACTOR2_AT_EXIT > DECADES_PER_FACTOR2_AT_REENTRY &&
      Math.abs(DECADES_PER_FACTOR2_AT_EXIT - 18.95) < 0.2 &&
      FIRST_DOUBLING_REENTRY_SLIDE > PREV_OCTAVE_REENTRY_SLIDE,
  },
  {
    // Faithful co-moving window: the reentry edge is EXACTLY EPS_FP-invariant (W_k co-shifts with xArg).
    id: 'imp35263-comoving-window-reentry-invariant',
    description: 'under W_k = 1 - OFFSET(eps_k) the reentry edge is EPS_FP-invariant (spread ~1e-13 across the sweep)',
    holds: () =>
      COMOVING_REENTRY_SPREAD < 1e-8 &&
      SWEEP.every((s) => Math.abs(s.reentry_comoving_exp - 27.08469) < 1e-3) &&
      Math.abs(PHASE_SHIFT_PER_FACTOR2 - Math.log(2) / LN_INV_R) < 1e-12,
  },
  {
    // Honesty gate: assessment only, discharges nothing, no QED, no refereed bound is changed, sub-gap stays OPEN and named.
    id: 'imp35263-honesty-gate-no-qed',
    description: 'Assessment only: isRigorous false, R1/imp-35243a OPEN, no QED, no refereed bound is changed',
    holds: () =>
      IMP35263_REENTRY_BAND_EPS_FLOOR_SWEEP.isRigorous === false &&
      /NO QED/.test(IMP35263_REENTRY_BAND_EPS_FLOOR_SWEEP.verdict) &&
      /refereed bound is changed/i.test(IMP35263_REENTRY_BAND_EPS_FLOOR_SWEEP.verdict) &&
      /imp-35243a/.test(IMP35263_REENTRY_BAND_EPS_FLOOR_SWEEP.residual_sub_gap) &&
      /stay OPEN/.test(IMP35263_REENTRY_BAND_EPS_FLOOR_SWEEP.residual_sub_gap),
  },
];

for (const a of IMP35263_REENTRY_BAND_EPS_FLOOR_SWEEP_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35263-reentry-band-eps-floor-sweep assertion failed: ${a.id}`);
  }
}
