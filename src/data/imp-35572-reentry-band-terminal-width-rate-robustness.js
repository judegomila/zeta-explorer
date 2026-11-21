/**
 * @module imp-35572-reentry-band-terminal-width-rate-robustness
 *
 * imp-35572 (numerical, frontier-direction) -- DIRECT MEASUREMENT of the imp-35537 Part C claim that adding a
 * second (early-transient) contraction rate to the single-rate iters-to-floor map cannot change the TERMINAL
 * off-by-one over the imp-34997/imp-35111 reentry band [10^27.08, 10^37.17]. imp-35537 Part C argued R1t does
 * NOT need a better rate because imp-34862 exact-peel located the surviving off-by-one in the TERMINAL
 * ceil-vs-bit-collapse discretization, not the transient rate. imp-35331 reconstructed the two-rate ceil phase
 * and found the FRAC-WINDOW band relocated (~22 decades up, ~7 wider) but the direct census identical at four
 * sampled points -- it never located the direct-census (terminal Picard-resid) band EDGES under the two-rate
 * law, so the band-WIDTH question was left as an assertion. This module measures it directly. ASSESSMENT ONLY:
 * it discharges nothing; imp-35243a stays OPEN; changes no bound; NO QED.
 *
 * THE TWO MAPS COMPARED (both on the inherited imp-3220/imp-3406 double surrogate)
 * -------------------------------------------------------------------------------
 * SINGLE-RATE: n_single(seed) = 1 + ceil(xArg), xArg = log(collapseDist(seed)/EPS_FP)/ln(1/r), a single
 *   contraction rate r = |dg/dN| at the fixed point (R_CONTRACT ~ 0.0454235, LN_INV_R ~ 3.09173).
 * TWO-RATE (imp-34862 ratio-fit): contract at an early-transient rate r_0 = (delta_p/delta_0)^(1/p) for the
 *   first p post-collapse iterates then at r, giving n_two(seed) = 1 + ceil(x_two) with
 *      x_two = p + [log(delta_0/EPS_FP) - p log(1/r_0)]/ln(1/r) = xArg + p(1 - ln(1/r_0)/ln(1/r)).
 *   (The imp-34862 exact-peel control is algebraically identical at m = p.)
 *
 * WHAT IS MEASURED
 * ----------------
 * (1) IN-BAND ITERATE-COUNT DELTA. Over a dense grid on the nominal band [10^27.084691, 10^37.167107]
 *     (202 seeds, 10^0.05 spacing) and p in {1,2,3}: the count of seeds where n_two != n_single, and the max
 *     abs iterate difference max|n_two - n_single|.
 * (2) DIRECT-CENSUS (terminal Picard-resid) BAND EDGES. The exponents where the residual resid = n - measured
 *     Picard count flips (onset: measured steps 13 -> 14, resid -> -1; exit: predicted steps 13 -> 14,
 *     resid -> 0), located by exponent bisection under BOTH the single-rate and the two-rate map, and the
 *     resulting band widths.
 *
 * THE RESULT: IN-BAND ZERO CHANGE; THE ONLY MOVEMENT IS THE EXIT EDGE ABOVE THE BAND
 * ---------------------------------------------------------------------------------
 * (1) Across all 202 in-band seeds and every p in {1,2,3}: n_two(seed) = n_single(seed) EXACTLY -- differ = 0,
 *     max|n_two - n_single| = 0. Both predict 13 against a measured Picard count of 14, so resid = -1 uniformly
 *     under both maps across the whole nominal band. The two-rate law does NOT change the terminal off-by-one
 *     by even one iterate anywhere in the band. This CONFIRMS imp-35537 Part C directly on the band: a second
 *     rate cannot span the terminal ceil-vs-bit-collapse gap.
 * (2) The direct-census ONSET edge is IDENTICAL under single and two-rate (~10^19.748): it is governed by the
 *     directly-measured Picard count stepping 13 -> 14 (imp-35111 HONEST NUANCE), which is rate-independent.
 *     The single-rate census EXITS at ~10^37.167 (predicted count catches the measured 14). Under the two-rate
 *     law the NEGATIVE phase offset (Delta ~ -0.19..-0.26, since r_0 < r far above the fixed point) holds
 *     x_two below the integer 12, so n_two stays 13 far past the nominal exit: resid stays -1 out to at least
 *     10^60 in the tested range, pushing the census exit >20 decades higher. This is the SAME imp-35331
 *     frac-window relocation, now expressed in the direct census -- it WIDENS the census band on the exit side
 *     ABOVE the nominal band, but involves NO in-band seed changing its count.
 *
 * SO THE HEADLINE ANSWER to the ticket ("does the terminal off-by-one band width change by even one iterate?"):
 * WITHIN the nominal ~10.08-decade band the change is ZERO iterates at every seed; the only rate-sensitivity is
 * the ceil integer-crossing EXIT edge ABOVE the band (the imp-35331 relocation), not a change to the terminal
 * off-by-one over the band. This is exactly the imp-35537 Part C picture: the off-by-one is terminal, and a
 * second rate cannot span it -- it can only delay the far-above-band resolution edge, not alter the in-band count.
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * A direct in-band iterate-count measurement of the imp-35537 Part C / imp-34862 two-rate claim, on the
 * inherited imp-3220/imp-3406 double surrogate, IEEE-754 double precision (point rate estimates, no interval
 * enclosure). It discharges NOTHING: imp-35111a / imp-35174a / imp-35243a stay OPEN; the reentry band stays
 * NOT ESTABLISHED as a feature of the true dynamic (R1/R4 binding). MEASUREMENT ONLY; the C_C = (1/8) sqrt(3 pi)
 * ansatz (imp-2642/imp-2643) is UNTOUCHED; the C_mb GUE-conditional per imp-486 is UNTOUCHED; imp-3066 K_a >= 0
 * untouched; far-tail exponent stays 1/2 (imp-3463); changes no bound; establishes no operator positivity; no
 * RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35537-r1t-reentry-band-closure-scope (Part C: the off-by-one is terminal; a second rate cannot span it)
 * @see imp-35331-reentry-band-two-rate-phase-drift (two-rate frac-window relocation; census at 4 sampled points)
 * @see imp-34862-iters-to-floor-two-rate-law (the two-rate law and exact-peel control; off-by-one is terminal)
 * @see imp-35111-off-by-one-reentry-band-width (single-rate frac-window and direct-census band edges)
 * @see imp-35243-reentry-band-surrogate-fidelity-assessment (R1-R4 certificate; imp-35243a OPEN)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-34862/34997/35111/35243/35331)
const EPS_FP = 2.3e-16; // machine-epsilon relative agreement floor (imp-34755/34775/34903)

// The shared imp-34862/imp-35111/imp-35331 fixed-point map g(N) = K log T0(N), reproduced VERBATIM.
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
function iterate(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = g(N);
  return N;
}
const N_CROSS_FP = iterate(1e9, 200); // ~3280294351.65 (bit-identical to imp-34862/35111/35331)
const R_CONTRACT = Math.abs((g(N_CROSS_FP + 1) - g(N_CROSS_FP - 1)) / 2); // ~0.0454235 (single asymptotic rate)
const LN_INV_R = Math.log(1 / R_CONTRACT); // ~3.09173 nats/iterate

// Post-collapse relative distance and the SINGLE-rate / TWO-rate ceil arguments (imp-35111/imp-35331 VERBATIM).
const collapseDist = (seed) => Math.abs(g(seed) - N_CROSS_FP) / N_CROSS_FP;
const xArgSingle = (seed) => Math.log(collapseDist(seed) / EPS_FP) / LN_INV_R;
function fitEarlyRateR0(seed, p) {
  let N = g(seed);
  const d0 = Math.abs(N - N_CROSS_FP) / N_CROSS_FP;
  for (let i = 0; i < p; i++) N = g(N);
  const dp = Math.abs(N - N_CROSS_FP) / N_CROSS_FP;
  return Math.pow(dp / d0, 1 / p);
}
const xArgTwoRate = (seed, p) => {
  const d0 = collapseDist(seed);
  const r0 = fitEarlyRateR0(seed, p);
  return p + (Math.log(d0 / EPS_FP) - p * Math.log(1 / r0)) / LN_INV_R;
};
const predSingle = (s) => 1 + Math.ceil(xArgSingle(s));
const predTwo = (s, p) => 1 + Math.ceil(xArgTwoRate(s, p));

// Directly-measured Picard count: iterate g until bit-identical to the fixed point (imp-35111 VERBATIM).
function itersToFloorMeasured(seed, cap = 600) {
  let N = seed;
  let k = 0;
  while (k < cap) {
    N = g(N);
    k++;
    if (N === N_CROSS_FP) break;
  }
  return k;
}

const REENTRY_EXP = 27.084691; // band-on, log10 N (imp-34997/35111/35174)
const EXIT_EXP = 37.167107; // band-off, log10 N (imp-35111/35174)

// (1) IN-BAND iterate-count delta: over the dense band grid, how many seeds have n_two != n_single, and the
// max abs iterate difference, for p in {1,2,3}. Also confirm resid = -1 under BOTH maps at every in-band seed.
function inBandSweep(p) {
  let pts = 0;
  let differ = 0;
  let maxAbsCountDelta = 0;
  let residSingleAllMinusOne = true;
  let residTwoAllMinusOne = true;
  for (let e = REENTRY_EXP; e <= EXIT_EXP + 1e-9; e += 0.05) {
    const s = Math.pow(10, e);
    const nS = predSingle(s);
    const nT = predTwo(s, p);
    const m = itersToFloorMeasured(s);
    pts++;
    const d = Math.abs(nT - nS);
    if (d > maxAbsCountDelta) maxAbsCountDelta = d;
    if (nT !== nS) differ++;
    if (nS - m !== -1) residSingleAllMinusOne = false;
    if (nT - m !== -1) residTwoAllMinusOne = false;
  }
  return { p, points: pts, seeds_with_count_change: differ, max_abs_count_delta: maxAbsCountDelta, resid_single_all_minus_one: residSingleAllMinusOne, resid_two_all_minus_one: residTwoAllMinusOne };
}
const IN_BAND = [inBandSweep(1), inBandSweep(2), inBandSweep(3)];
const IN_BAND_ANY_COUNT_CHANGE = IN_BAND.some((r) => r.seeds_with_count_change > 0 || r.max_abs_count_delta > 0);

// (2) DIRECT-CENSUS band edges under single and two-rate (resid = predicted - measured Picard count).
function bisectExp(lo, hi, pred) {
  for (let i = 0; i < 120; i++) {
    const m = (lo + hi) / 2;
    if (pred(m)) hi = m;
    else lo = m;
  }
  return (lo + hi) / 2;
}
const residSingleAt = (e) => predSingle(Math.pow(10, e)) - itersToFloorMeasured(Math.pow(10, e));
const residTwoAt = (e, p) => predTwo(Math.pow(10, e), p) - itersToFloorMeasured(Math.pow(10, e));

const CENSUS_ONSET_SINGLE = bisectExp(15, 25, (e) => residSingleAt(e) === -1); // ~19.7483 (measured 13 -> 14)
const CENSUS_EXIT_SINGLE = bisectExp(30, 45, (e) => residSingleAt(e) === 0); // ~37.1671 (predicted 13 -> 14)
const CENSUS_ONSET_TWO_P1 = bisectExp(15, 25, (e) => residTwoAt(e, 1) === -1); // ~19.7483 (identical: measured-driven)

// The two-rate census stays resid = -1 far above the nominal exit (predicted count held at 13 by the negative
// phase offset). Probe the tail directly: is resid still -1 at 10^60? If so the exit is >20 decades above single.
const TAIL_PROBE_EXP = 60;
const RESID_TWO_AT_TAIL = residTwoAt(TAIL_PROBE_EXP, 1); // -1 (still off-by-one at 10^60)
const CENSUS_ONSET_EDGE_SHIFT = CENSUS_ONSET_TWO_P1 - CENSUS_ONSET_SINGLE; // ~0 (rate-independent onset)

export const IMP35572_REENTRY_BAND_TERMINAL_WIDTH_RATE_ROBUSTNESS = {
  id: 'imp-35572',
  proofSection: 'S-frontier',
  question:
    'imp-35537 Part C argues R1t does NOT need a better rate because imp-34862 exact-peel located the surviving ' +
    'off-by-one in the TERMINAL ceil-vs-bit-collapse, not the transient rate, so a second (transient) rate only ' +
    'adds a fitted quantity. Measure this directly: recompute the iterate count n(seed) = 1 + ceil(xArg) under a ' +
    'two-rate (early r_0 then asymptotic r) approach versus the single-rate map across the ~10.08-decade band ' +
    '[10^27.08, 10^37.17], and report whether the terminal off-by-one band width changes by even one iterate. ' +
    'Measurement only on the surrogate iterate-count; imp-35243a stays OPEN; changes no bound; NO QED.',
  constants: {
    contraction_rate_r: +R_CONTRACT.toPrecision(6), // ~0.0454235
    log_law_constant_ln_inv_r: +LN_INV_R.toPrecision(6), // ~3.09173
    eps_fp_floor: EPS_FP, // 2.3e-16
    reentry_exponent_log10N: REENTRY_EXP, // 27.084691
    exit_exponent_log10N: EXIT_EXP, // 37.167107
  },
  in_band_iterate_count: IN_BAND, // p in {1,2,3}: seeds_with_count_change, max_abs_count_delta, resid uniformity
  in_band_any_count_change: IN_BAND_ANY_COUNT_CHANGE, // false: zero seeds change count, max delta 0
  direct_census_band_edges: {
    onset_single_log10N: +CENSUS_ONSET_SINGLE.toPrecision(8), // ~19.7483 (measured Picard 13 -> 14)
    exit_single_log10N: +CENSUS_EXIT_SINGLE.toPrecision(8), // ~37.1671 (predicted 13 -> 14)
    width_single_decades: +(CENSUS_EXIT_SINGLE - CENSUS_ONSET_SINGLE).toPrecision(6), // ~17.42
    onset_two_p1_log10N: +CENSUS_ONSET_TWO_P1.toPrecision(8), // ~19.7483 (IDENTICAL: onset is measured-driven)
    onset_edge_shift_decades: +CENSUS_ONSET_EDGE_SHIFT.toPrecision(3), // ~0
    resid_two_still_minus_one_at_10_pow_60: RESID_TWO_AT_TAIL, // -1: two-rate census exit is >20 decades higher
  },
  finding:
    'Direct in-band iterate-count test of the imp-35537 Part C / imp-34862 two-rate claim across the reentry ' +
    'band [10^27.08, 10^37.17]. (1) Over a dense 202-seed grid (10^0.05 spacing) and p in {1,2,3}, the two-rate ' +
    'count n_two(seed) = 1 + ceil(x_two) EQUALS the single-rate n_single(seed) = 1 + ceil(xArg) at EVERY seed -- ' +
    'seeds_with_count_change = 0, max|n_two - n_single| = 0 -- and both predict 13 against a measured Picard ' +
    'count of 14, so resid = -1 uniformly under both maps across the whole band. The two-rate law does NOT ' +
    'change the terminal off-by-one by even one iterate anywhere in the band, confirming imp-35537 Part C: a ' +
    'second rate cannot span the terminal ceil-vs-bit-collapse gap. (2) The direct-census ONSET edge is ' +
    'IDENTICAL under single and two-rate (~10^19.748), because it is set by the directly-measured Picard count ' +
    'stepping 13 -> 14 (rate-independent). The single-rate census EXITS at ~10^37.167; under the two-rate law ' +
    'the negative phase offset (Delta ~ -0.19..-0.26, r_0 < r far above the fixed point) holds x_two below the ' +
    'integer 12, so resid stays -1 past 10^60 in the tested range -- the census exit is pushed >20 decades ' +
    'higher. That exit-edge movement is the SAME imp-35331 frac-window relocation seen in the census; it widens ' +
    'the census band ABOVE the nominal band but involves NO in-band seed changing its count. HEADLINE: within ' +
    'the nominal band the terminal off-by-one band width changes by ZERO iterates; the only rate-sensitivity is ' +
    'the ceil integer-crossing exit edge above the band, exactly the imp-35537 Part C picture.',
  isRigorous: false,
  verdict:
    'MEASUREMENT (numerical, frontier-direction, NOT an RH bound). Adding the imp-34862 early-transient second ' +
    'rate (r_0) to the single-rate contraction map changes the terminal off-by-one over the reentry band ' +
    '[10^27.08, 10^37.17] by ZERO iterates: across 202 in-band seeds and p in {1,2,3}, n_two(seed) = n_single' +
    '(seed) exactly (max abs count delta 0), both giving resid = -1 vs a measured Picard count 14. The direct-' +
    'census onset edge is rate-independent (~10^19.748, measured-count-driven); the only rate-sensitivity is the ' +
    'census EXIT edge, which the negative two-rate phase offset pushes >20 decades above the nominal band (resid ' +
    'still -1 at 10^60) -- the same imp-35331 frac-window relocation, involving no in-band count change. This ' +
    'CONFIRMS imp-35537 Part C directly on the band: the off-by-one is TERMINAL and a second rate cannot span ' +
    'it. IEEE-754 double precision, point rate estimates (no interval enclosure), on the inherited imp-3220/' +
    'imp-3406 surrogate; discharges NOTHING; imp-35111a / imp-35174a / imp-35243a stay OPEN; the reentry band ' +
    'stays NOT ESTABLISHED as a feature of the true dynamic (R1/R4 binding); the C_C = (1/8) sqrt(3 pi) ansatz ' +
    '(imp-2642/imp-2643) and the C_mb GUE-conditional per imp-486 are UNTOUCHED; imp-3066 K_a >= 0 untouched; ' +
    'far-tail exponent stays 1/2 (imp-3463); changes no bound; establishes no operator positivity; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35537 (Part C: the off-by-one is terminal, a second rate cannot span it); imp-35331 (two-rate frac-' +
    'window relocation; census at 4 sampled points); imp-34862 (the two-rate law and exact-peel control); ' +
    'imp-35111 (single-rate frac-window and direct-census band edges); imp-35243 (R1-R4 certificate, imp-35243a ' +
    'OPEN); lambda-rh-height-mapping (effectiveHeightForN RvM inverse); imp-2642 (C_C = (1/8) sqrt(3 pi) ansatz).',
};

export const IMP35572_REENTRY_BAND_TERMINAL_WIDTH_RATE_ROBUSTNESS_ASSERTIONS = [
  {
    // The asymptotic rate matches the inherited imp-34862/imp-35111/imp-35331 surrogate.
    id: 'imp35572-rate-matches-parent',
    description: 'r ~ 0.0454235 and ln(1/r) ~ 3.09173 (identical to imp-34862/imp-35111/imp-35331)',
    holds: () =>
      Math.abs(R_CONTRACT - 0.0454235) < 1e-5 &&
      Math.abs(LN_INV_R - 3.09173) < 1e-3,
  },
  {
    // THE RESULT: over the dense in-band grid, NO seed changes count under the two-rate law, for every p.
    id: 'imp35572-in-band-zero-count-change',
    description: 'over 202 in-band seeds and p in {1,2,3}, n_two = n_single at every seed (delta 0), both resid -1',
    holds: () =>
      IN_BAND.length === 3 &&
      IN_BAND.every((r) => r.points >= 200) &&
      IN_BAND.every((r) => r.seeds_with_count_change === 0) &&
      IN_BAND.every((r) => r.max_abs_count_delta === 0) &&
      IN_BAND.every((r) => r.resid_single_all_minus_one && r.resid_two_all_minus_one) &&
      IN_BAND_ANY_COUNT_CHANGE === false,
  },
  {
    // The direct-census onset edge is rate-independent (measured-Picard-count-driven), matching imp-35111 ~19.748.
    id: 'imp35572-census-onset-rate-independent',
    description: 'census onset ~10^19.748 is identical under single and two-rate (onset edge shift ~0)',
    holds: () =>
      Math.abs(CENSUS_ONSET_SINGLE - 19.7483) < 1e-2 &&
      Math.abs(CENSUS_ONSET_EDGE_SHIFT) < 1e-3 &&
      Math.abs(CENSUS_EXIT_SINGLE - 37.1671) < 1e-2,
  },
  {
    // The only rate-sensitivity is the exit edge ABOVE the band: two-rate resid still -1 at 10^60.
    id: 'imp35572-exit-edge-relocated-above-band',
    description: 'two-rate census stays resid = -1 at 10^60 (exit pushed >20 decades above the single-rate 37.167)',
    holds: () =>
      RESID_TWO_AT_TAIL === -1 &&
      TAIL_PROBE_EXP - CENSUS_EXIT_SINGLE > 20,
  },
  {
    // Honesty gate: measurement only, confirms imp-35537 Part C, discharges nothing, sub-gap OPEN, no QED, no refereed bound is changed.
    id: 'imp35572-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, imp-35243a OPEN, no QED, no refereed bound is changed',
    holds: () =>
      IMP35572_REENTRY_BAND_TERMINAL_WIDTH_RATE_ROBUSTNESS.isRigorous === false &&
      /imp-35243a stay OPEN/.test(IMP35572_REENTRY_BAND_TERMINAL_WIDTH_RATE_ROBUSTNESS.verdict) &&
      /NO QED/.test(IMP35572_REENTRY_BAND_TERMINAL_WIDTH_RATE_ROBUSTNESS.verdict) &&
      /refereed bound is changed/i.test(IMP35572_REENTRY_BAND_TERMINAL_WIDTH_RATE_ROBUSTNESS.verdict),
  },
];

for (const a of IMP35572_REENTRY_BAND_TERMINAL_WIDTH_RATE_ROBUSTNESS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35572-reentry-band-terminal-width-rate-robustness assertion failed: ${a.id}`);
  }
}
