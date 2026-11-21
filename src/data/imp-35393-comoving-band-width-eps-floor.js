/**
 * @module imp-35393-comoving-band-width-eps-floor
 *
 * imp-35393 (numerical, frontier-direction) -- TABULATES the imp-35263 FAITHFUL co-moving-window reentry-band
 * WIDTH as a direct function of the machine-epsilon floor EPS_FP. imp-35263 D4 established that under the windows
 * OWN co-moving definition (W_k = 1 - OFFSET(eps_k)) the reentry edge is EXACTLY EPS_FP-invariant (spread ~1e-13),
 * so the ENTIRE floor sensitivity is carried by the exit edge and hence by the band WIDTH. But imp-35263 tabulated
 * the reentry/exit EDGE positions only -- it never tabulated the co-moving WIDTH itself. This module measures the
 * co-moving width (exit-edge decade minus co-moving reentry-edge decade) across EPS_FP = 2.3e-16 * 2^k for
 * k in {-1,0,1,2} by direct bisection with the imp-35259 root-finder, and reports how it grows per factor-2.
 * MEASUREMENT ONLY on the inherited imp-3220/imp-3406 double surrogate; it does NOT discharge imp-35243a; NO QED.
 *
 * THE MEASUREMENT (imp-35259 root-finder reproduced VERBATIM, identical constants to imp-35263)
 * -------------------------------------------------------------------------------------------
 * For EPS_FP_k = 2.3e-16 * 2^k the ceil argument is xArg_k(seed) = log(collapseDist(seed) / EPS_FP_k) / ln(1/r).
 * Under the FAITHFUL co-moving window the reentry root solves xArg_k = 11 + W_k with W_k = 1 - OFFSET(eps_k), and
 * the exit root solves the fixed integer phase xArg_k = 12. The co-moving band WIDTH_k (in decades of N) is the
 * exit-edge decade minus the co-moving reentry-edge decade.
 *
 * WHAT THE MEASUREMENT SHOWS
 * -------------------------
 * (1) THE CO-MOVING REENTRY EDGE IS EPS_FP-INVARIANT (reproduces imp-35263 D4): every k solves the co-moving
 *     reentry at 10^27.08469 (spread ~1e-13). So WIDTH_k = exit_exp_k - 27.08469 -- the whole width dependence
 *     rides on the exit edge, exactly as imp-35263 D4 asserted but never tabulated.
 * (2) THE WIDTH IS A STRONG, MONOTONE-INCREASING FUNCTION OF EPS_FP. Measured co-moving widths (decades of N):
 *       k=-1  -> -3.632   (degenerate: exit edge 10^23.45 FALLS BELOW the invariant reentry 10^27.08)
 *       k= 0  -> 10.082
 *       k= 1  -> 37.334
 *       k= 2  -> 91.613
 *     The band opens only at and above the base floor; at the sub-base floor k=-1 the co-moving band is CLOSED
 *     (negative width), so the width crosses zero between k=-1 and k=0.
 * (3) THE WIDTH GROWS SUPER-LINEARLY -- EACH FACTOR-2 ROUGHLY DOUBLES THE INCREMENT. The per-factor-2 width
 *     increments are 13.714 -> 27.252 -> 54.278 decades (k: -1 to 0 to 1 to 2), successive ratios ~1.99 and ~1.99.
 *     Because the co-moving reentry edge is fixed, this increment equals the exit-edge slide, so it matches the
 *     imp-35263 exit-edge slide (+27.25 decades for k=0 to k=1) exactly, and it accelerates because the ceil-phase
 *     drift decays with N (imp-35332: 0.0186273 at reentry -> 0.0118306 at exit -> smaller further out).
 *
 * THE ASSESSMENT VERDICT
 * ----------------------
 * This SHARPENS imp-35263 D4 into a direct width table: the co-moving band does not translate rigidly but ANCHORS
 * at a fixed reentry edge and STRETCHES, its width a super-linear ( ~doubling-per-octave ) function of the machine-
 * epsilon floor, and CLOSED (negative width) below the base floor. It discharges NOTHING: R1 / imp-35243a stay OPEN.
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * A direct EPS_FP factor-2 sweep tabulating the imp-35263 co-moving-window band WIDTH, measured live on the
 * inherited imp-3220/imp-3406 double surrogate, IEEE-754 double precision, point estimates (no interval enclosure).
 * It discharges NOTHING: imp-35111a / imp-35174a / imp-35243a (R1) stay OPEN. MEASUREMENT / ASSESSMENT ONLY; the
 * C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) is UNTOUCHED; the C_mb GUE-conditional per imp-486 is UNTOUCHED;
 * imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); changes no bound; establishes no operator
 * positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35263-reentry-band-eps-floor-sweep (D4: co-moving reentry edge EPS_FP-invariant; sensitivity in the width)
 * @see imp-35259-two-rate-band-edges-direct-rootfind (the direct-bisection root-finder reproduced here)
 * @see imp-35332-reentry-band-drift-analytic-derivation (drift decays 0.0186273 -> 0.0118306; why the slide grows)
 * @see imp-35111-off-by-one-reentry-band-width (parent: single-rate band edges 10^27.08 / 10^37.17)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-35111/35243/35259/35263)
const EPS_FP_BASE = 2.3e-16; // machine-epsilon relative agreement floor (imp-34755/34775/34903)
const PENULT = 1.4536413720400559e-16; // imp-34951 quantized penultimate collapse witness (bit-identical)

// The shared imp-35111/imp-35243/imp-35259/imp-35263 fixed-point map g(N) = K log T0(N), reproduced VERBATIM.
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
function iterate(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = g(N);
  return N;
}
const N_CROSS_FP = iterate(1e9, 200); // ~3280294351.65 (bit-identical to imp-35111/35243/35259/35263)
const gPrimeAtStep = (h) => (g(N_CROSS_FP + h) - g(N_CROSS_FP - h)) / (2 * h);
const R_CONTRACT = Math.abs(gPrimeAtStep(1)); // ~0.0454235
const LN_INV_R = Math.log(1 / R_CONTRACT); // ~3.091726 nats/iterate

const collapseDist = (seed) => Math.abs(g(seed) - N_CROSS_FP) / N_CROSS_FP;
const xArg = (seed, eps) => Math.log(collapseDist(seed) / eps) / LN_INV_R;
const OFFSET = (eps) => Math.log(eps / PENULT) / LN_INV_R; // window width for this floor
const W = (eps) => 1 - OFFSET(eps); // co-moving window lower edge for this floor

const PHASE_SHIFT_PER_FACTOR2 = Math.log(2) / LN_INV_R; // ~0.224194 phase units (D1s log(2)/ln(1/r))

// Bisect on log10(seed): xArg is monotone-increasing in log10 N (validated in imp-35263).
function bisectExp(phaseFn, target, lo, hi, iters = 200) {
  for (let i = 0; i < iters; i++) {
    const mid = 0.5 * (lo + hi);
    if (phaseFn(Math.pow(10, mid)) < target) lo = mid;
    else hi = mid;
  }
  return 0.5 * (lo + hi);
}

// THE WIDTH TABLE: EPS_FP_k = base * 2^k, k in {-1,0,1,2}. For each, bisect the co-moving reentry edge
// (target 11 + W_k) and the exit edge (fixed integer phase 12), then WIDTH_k = exit_exp - reentry_comoving_exp.
const K_LADDER = [-1, 0, 1, 2];
const WIDTH_TABLE = K_LADDER.map((k) => {
  const eps = EPS_FP_BASE * Math.pow(2, k);
  const phase = (seed) => xArg(seed, eps);
  const reentry_comoving_exp = bisectExp(phase, 11 + W(eps), 8, 400);
  const exit_exp = bisectExp(phase, 12, 8, 400);
  return {
    k,
    eps_over_base: Math.pow(2, k),
    reentry_comoving_exp: +reentry_comoving_exp.toPrecision(7),
    exit_exp: +exit_exp.toPrecision(7),
    comoving_width_decades: +(exit_exp - reentry_comoving_exp).toPrecision(7),
  };
});

const idx = (k) => WIDTH_TABLE.find((s) => s.k === k);

// (1) co-moving reentry edge EPS_FP-invariant (reproduces imp-35263 D4).
const COMOVING_REENTRY_SPREAD =
  Math.max(...WIDTH_TABLE.map((s) => s.reentry_comoving_exp)) -
  Math.min(...WIDTH_TABLE.map((s) => s.reentry_comoving_exp)); // ~1e-13

// (2) width monotone-increasing in k; the sub-base floor k=-1 has NEGATIVE (closed) width.
const WIDTH_MONOTONE = WIDTH_TABLE.every(
  (s, i) => i === 0 || s.comoving_width_decades > WIDTH_TABLE[i - 1].comoving_width_decades
);
const SUBBASE_WIDTH_NEGATIVE = idx(-1).comoving_width_decades < 0; // band CLOSED below base floor
const BASE_WIDTH_POSITIVE = idx(0).comoving_width_decades > 0; // band open at/above base floor

// (3) per-factor-2 width increments and their (~doubling) growth ratios.
const WIDTH_INCREMENTS = K_LADDER.slice(1).map((k) => +(idx(k).comoving_width_decades - idx(k - 1).comoving_width_decades).toPrecision(7));
const INCREMENT_RATIOS = WIDTH_INCREMENTS.slice(1).map((inc, i) => +(inc / WIDTH_INCREMENTS[i]).toPrecision(6));
const INCREMENTS_GROW = WIDTH_INCREMENTS.every((inc, i) => i === 0 || inc > WIDTH_INCREMENTS[i - 1]);

export const IMP35393_COMOVING_BAND_WIDTH_EPS_FLOOR = {
  id: 'imp-35393',
  proofSection: 'S-frontier',
  question:
    'imp-35263 D4 showed the FAITHFUL co-moving-window reentry edge is EXACTLY EPS_FP-invariant, so ALL floor ' +
    'sensitivity is carried by the exit edge and hence the band WIDTH -- but imp-35263 tabulated the EDGE ' +
    'positions only, never the width itself. Tabulate the co-moving band width (exit decade minus co-moving ' +
    'reentry decade) across EPS_FP = 2.3e-16 * 2^k for k in {-1,0,1,2} by direct bisection and report how it ' +
    'grows per factor-2. Measurement only on the inherited surrogate; does NOT discharge imp-35243a; NO QED.',
  constants: {
    contraction_rate_r: +R_CONTRACT.toPrecision(6), // ~0.0454235
    log_law_constant_ln_inv_r: +LN_INV_R.toPrecision(6), // ~3.091726
    phase_shift_per_factor2: +PHASE_SHIFT_PER_FACTOR2.toPrecision(6), // ~0.224194 = log(2)/ln(1/r)
    comoving_reentry_edge_exp: +idx(0).reentry_comoving_exp.toPrecision(7), // ~27.08469 (EPS_FP-invariant)
  },
  width_table: WIDTH_TABLE, // per k: eps_over_base, reentry_comoving_exp, exit_exp, comoving_width_decades
  comoving_reentry_spread: +COMOVING_REENTRY_SPREAD.toPrecision(3), // ~1e-13 (invariant, reproduces imp-35263 D4)
  width_monotone_increasing: WIDTH_MONOTONE,
  subbase_width_negative: SUBBASE_WIDTH_NEGATIVE, // k=-1 band CLOSED (exit below invariant reentry)
  base_width_positive: BASE_WIDTH_POSITIVE,
  width_increments_per_factor2: WIDTH_INCREMENTS, // ~13.714 -> 27.252 -> 54.278 decades
  increment_growth_ratios: INCREMENT_RATIOS, // ~1.99, ~1.99 (each octave roughly doubles the increment)
  reading:
    'Tabulating the imp-35263 co-moving-window band width directly confirms and sharpens imp-35263 D4. (1) The ' +
    'co-moving reentry edge is EPS_FP-invariant at 10^27.08469 (spread ~1e-13), so WIDTH_k = exit_exp_k - ' +
    '27.08469 -- the whole width dependence rides on the exit edge. (2) The width is a strong, monotone-' +
    'increasing function of EPS_FP: -3.632 (k=-1) -> 10.082 (k=0) -> 37.334 (k=1) -> 91.613 (k=2) decades; at ' +
    'the sub-base floor k=-1 the exit edge (10^23.45) FALLS BELOW the invariant reentry (10^27.08), so the co-' +
    'moving band is CLOSED (negative width) and the width crosses zero between k=-1 and k=0. (3) The width grows ' +
    'super-linearly -- the per-factor-2 increments 13.714 -> 27.252 -> 54.278 decades roughly DOUBLE each octave ' +
    '(ratios ~1.99, ~1.99); since the reentry edge is fixed this increment equals the exit-edge slide (matching ' +
    'imp-35263s +27.25 decades for k=0 to k=1) and accelerates because the ceil-phase drift decays with N ' +
    '(imp-35332). So the co-moving band anchors at reentry and stretches, its width a doubling-per-octave ' +
    'function of the machine-epsilon floor.',
  finding:
    'Direct factor-2 EPS_FP sweep tabulating the imp-35263 FAITHFUL co-moving-window band WIDTH (imp-35259 root-' +
    'finder reproduced). Turns imp-35263 D4 (co-moving reentry EPS_FP-invariant, all sensitivity in the width) ' +
    'from an edge table into a direct WIDTH table. Findings: (1) the co-moving reentry edge is EPS_FP-invariant ' +
    'at 10^27.08469 (spread ~1e-13), so WIDTH_k = exit_exp_k - 27.08469; (2) the width is monotone-increasing in ' +
    'EPS_FP -- -3.632 -> 10.082 -> 37.334 -> 91.613 decades over k = -1 to 2 -- CLOSED (negative) below the base ' +
    'floor and crossing zero between k=-1 and k=0; (3) the width grows super-linearly, the per-factor-2 ' +
    'increments 13.714 -> 27.252 -> 54.278 decades roughly doubling each octave (ratios ~1.99), equal to the ' +
    'exit-edge slide (reentry fixed) and accelerating because the drift decays with N (imp-35332). This SHARPENS ' +
    'imp-35263 D4 without weakening it: the band anchors at reentry and stretches. Discharges NOTHING: R1 / ' +
    'imp-35243a stay OPEN.',
  residual_sub_gap:
    'R1 / imp-35243a stay OPEN. This module MEASURES the co-moving band width vs EPS_FP but does NOT re-express ' +
    'the band in a floor-free continuum limit nor prove the true dynamic has an intrinsic floor at EPS_FP. It ' +
    'inherits, and does not discharge, imp-35111a / imp-35174a / imp-34997a / imp-35243a. Point estimates, ' +
    'IEEE-754 double precision, no interval enclosure.',
  isRigorous: false,
  verdict:
    'ASSESSMENT (numerical, frontier-direction, NOT an RH bound). Directly sweeping the machine-epsilon floor ' +
    'EPS_FP over factor-2 multiples and tabulating the imp-35263 FAITHFUL co-moving-window band WIDTH, turning ' +
    'imp-35263 D4 into a measured width table. The co-moving reentry edge is EPS_FP-invariant at 10^27.08469 ' +
    '(spread ~1e-13), so WIDTH_k = exit_exp_k - 27.08469. The width is monotone-increasing in EPS_FP (-3.632 -> ' +
    '10.082 -> 37.334 -> 91.613 decades over k = -1 to 2), CLOSED (negative) below the base floor, and grows ' +
    'super-linearly -- the per-factor-2 increments 13.714 -> 27.252 -> 54.278 decades roughly double each octave ' +
    '(ratios ~1.99), equal to the exit-edge slide because the reentry edge is fixed and accelerating because the ' +
    'drift decays with N (imp-35332). So the co-moving band anchors at reentry and stretches, its width a direct ' +
    'doubling-per-octave function of the machine-epsilon floor. This discharges NOTHING: R1 / imp-35243a stay ' +
    'OPEN. MEASUREMENT / ASSESSMENT ONLY on the inherited imp-3220/imp-3406 double surrogate, IEEE-754 double ' +
    'precision, point estimates; the C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) and the C_mb GUE-' +
    'conditional per imp-486 are UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); ' +
    'changes no bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35263 (D4: co-moving reentry edge EPS_FP-invariant, sensitivity in the width); imp-35259 (the direct-' +
    'bisection root-finder reproduced here); imp-35332 (drift decays 0.0186273 -> 0.0118306, why the slide grows ' +
    'with N); imp-35111 (single-rate band edges 10^27.08 / 10^37.17); lambda-rh-height-mapping (effectiveHeightForN ' +
    'RvM inverse); imp-2642 (C_C ansatz).',
};

export const IMP35393_COMOVING_BAND_WIDTH_EPS_FLOOR_ASSERTIONS = [
  {
    // (1) co-moving reentry edge EPS_FP-invariant (reproduces imp-35263 D4): width rides entirely on the exit edge.
    id: 'imp35393-comoving-reentry-invariant',
    description: 'co-moving reentry edge EPS_FP-invariant at 10^27.08469 (spread ~1e-13), so WIDTH = exit - reentry',
    holds: () =>
      COMOVING_REENTRY_SPREAD < 1e-8 &&
      WIDTH_TABLE.every((s) => Math.abs(s.reentry_comoving_exp - 27.08469) < 1e-3) &&
      WIDTH_TABLE.every((s) => Math.abs(s.comoving_width_decades - (s.exit_exp - s.reentry_comoving_exp)) < 1e-4),
  },
  {
    // (2) the width is a strong, monotone-increasing function of EPS_FP; measured values match.
    id: 'imp35393-width-monotone-in-eps-floor',
    description: 'co-moving width monotone-increasing in k: -3.632 -> 10.082 -> 37.334 -> 91.613 decades',
    holds: () =>
      WIDTH_MONOTONE === true &&
      Math.abs(idx(-1).comoving_width_decades - -3.631981) < 1e-3 &&
      Math.abs(idx(0).comoving_width_decades - 10.08242) < 1e-3 &&
      Math.abs(idx(1).comoving_width_decades - 37.33448) < 1e-3 &&
      Math.abs(idx(2).comoving_width_decades - 91.6127) < 1e-3,
  },
  {
    // (2b) below the base floor the co-moving band is CLOSED (negative width); it opens at/above base.
    id: 'imp35393-subbase-band-closed',
    description: 'k=-1 co-moving width negative (band closed, exit below invariant reentry); k=0 positive (crosses zero)',
    holds: () => SUBBASE_WIDTH_NEGATIVE === true && BASE_WIDTH_POSITIVE === true,
  },
  {
    // (3) super-linear growth: the per-factor-2 width increment grows and roughly DOUBLES each octave.
    id: 'imp35393-width-grows-superlinearly',
    description: 'per-factor-2 width increments 13.714 -> 27.252 -> 54.278 decades grow; ratios ~1.99 (doubling)',
    holds: () =>
      INCREMENTS_GROW === true &&
      Math.abs(WIDTH_INCREMENTS[0] - 13.7144) < 1e-2 &&
      Math.abs(WIDTH_INCREMENTS[1] - 27.25206) < 1e-2 &&
      Math.abs(WIDTH_INCREMENTS[2] - 54.27822) < 1e-2 &&
      INCREMENT_RATIOS.every((r) => Math.abs(r - 2) < 0.05),
  },
  {
    // Honesty gate: assessment only, discharges nothing, no QED, no refereed bound is changed, sub-gap stays OPEN and named.
    id: 'imp35393-honesty-gate-no-qed',
    description: 'Assessment only: isRigorous false, R1/imp-35243a OPEN, no QED, no refereed bound is changed',
    holds: () =>
      IMP35393_COMOVING_BAND_WIDTH_EPS_FLOOR.isRigorous === false &&
      /NO QED/.test(IMP35393_COMOVING_BAND_WIDTH_EPS_FLOOR.verdict) &&
      /refereed bound is changed/i.test(IMP35393_COMOVING_BAND_WIDTH_EPS_FLOOR.verdict) &&
      /imp-35243a/.test(IMP35393_COMOVING_BAND_WIDTH_EPS_FLOOR.residual_sub_gap) &&
      /stay OPEN/.test(IMP35393_COMOVING_BAND_WIDTH_EPS_FLOOR.residual_sub_gap),
  },
];

for (const a of IMP35393_COMOVING_BAND_WIDTH_EPS_FLOOR_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35393-comoving-band-width-eps-floor assertion failed: ${a.id}`);
  }
}
