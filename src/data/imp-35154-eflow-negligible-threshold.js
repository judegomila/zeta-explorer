/**
 * @module imp-35154-eflow-negligible-threshold
 *
 * imp-35154 (numerical, frontier-direction): imp-35100 M3 established that the vanishing part of
 * the surrogate error, E(N) - E_trunc = E_coll + E_flow, is E_coll-DOMINATED, with the ratio
 * E_flow/E_coll -> 0 (E_flow decays ~1/T0, E_coll ~ N^(-1/2)); by 1e13 E_flow is ~8e-5 of E_coll.
 * What imp-35100 gave only at the endpoints is the fractional CONTAMINATION of E_flow inside the
 * above-floor residual. This module pins the two N-THRESHOLDS at which E_flow first drops below a
 * 1% and a 0.1% share of the above-floor residual E_coll + E_flow, i.e. where the residual is
 * effectively pure E_coll, and reports them relative to the imp-33723 N_cross landmark.
 *
 * THE COMPONENT MODEL (identical sub-terms to imp-35100 / imp-33601 / imp-3406; no re-derivation)
 * ---------------------------------------------------------------------------------------------
 *     E_coll  = C_C_PINNED * sqrt(log T0 / N)      (dominant tail term, GUE-conditional C_H)
 *     E_flow  = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi   (imp-398)
 *     E_trunc = 3.06e-5                            (N-independent fixed strip, imp-2631)
 *     T0      = effectiveHeightForN(N)             (Riemann-von Mangoldt inverse, imp-327)
 *
 * THE MEASUREMENT (what the ticket asks for)
 * ------------------------------------------
 * Define the E_flow SHARE of the above-floor residual
 *
 *     s(N) = E_flow / (E_coll + E_flow) .
 *
 * Since E_flow/E_coll ~ N^(-1/2) (up to slow log factors) is strictly decreasing, s(N) is strictly
 * decreasing. Bisecting s(N) against the two targets locates:
 *
 *     s(N) < 1e-2  first at  N_1pct   ~ 3.247e7   (log10 ~ 7.51)
 *     s(N) < 1e-3  first at  N_0p1pct ~ 1.755e10  (log10 ~ 10.24)
 *
 * Relative to N_cross = 3.280294e9 (E_coll = E_trunc closed form, imp-33723):
 *
 *     N_1pct   sits ~2.00 decades BELOW N_cross,
 *     N_0p1pct sits ~0.73 decades ABOVE N_cross,
 *
 * and AT N_cross itself the E_flow share is already only s(N_cross) ~ 1.90e-3 (~0.19%). So across
 * the entire E_coll = E_trunc crossover neighborhood -- and everywhere above ~3.25e7 -- the
 * above-floor residual is E_coll to better than 1%, and to better than 0.1% by ~1.76e10, well
 * inside the deep-tail window imp-35100 measures.
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (M1) E_flow SHARE s(N) IS STRICTLY DECREASING (E_flow/E_coll ~ N^(-1/2)); at 1e6 s ~ 3.05e-2,
 *        at 1e13 s ~ 7.93e-5, so the flow term monotonically loses weight in the residual.
 *   (M2) THE 1% THRESHOLD IS N_1pct ~ 3.247e7, ~2.00 decades below N_cross: from N ~ 3.25e7 up,
 *        E_flow is a <1% correction to E_coll + E_flow.
 *   (M3) THE 0.1% THRESHOLD IS N_0p1pct ~ 1.755e10, ~0.73 decades above N_cross: by N ~ 1.76e10
 *        the above-floor residual is pure E_coll to better than 0.1%. At N_cross itself
 *        s ~ 0.19%, already between the two thresholds, so the crossover neighborhood is
 *        essentially E_coll-only.
 *
 * MEASUREMENT ONLY. Conditional-share/component diagnostic, NOT an RH bound. The component model is
 * the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; C_C 1/8 ansatz (imp-2642) UNTOUCHED; E_trunc fixed
 * strip (imp-2631) UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066
 * K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35100-surrogate-total-E-fartail-floor (M3: E_flow/E_coll -> 0, ~8e-5 by 1e13; same model)
 * @see imp-33601-sigma-half-vs-crossover-eflow-offset (E_flow offset identity; same model)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (N_cross = 3.280294e9 closed form)
 * @see imp-3406-sigma-highN-extrapolation (component model source)
 * @see imp-34130-ecoll-local-exponent-residual-close-vs-floor (E_coll ~N^-1/2 sqrt-log tail rate)
 * @see imp-486 (C_mb GUE-conditional caveat)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-35100)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33601/imp-35100 exactly
const N_CROSS = 3.280294e9; // imp-33723 closed-form E_coll = E_trunc crossover

// EXACT imp-35100/imp-3406/imp-33601 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  return { T0, L, E_flow, E_coll };
}

// E_flow share of the above-floor residual E_coll + E_flow (the vanishing part of imp-35100).
function flowShare(N) {
  const p = parts(N);
  return p.E_flow / (p.E_coll + p.E_flow);
}

// s(N) is strictly decreasing (E_flow/E_coll ~ N^-1/2), so bisect for the first N below a target.
function thresholdN(target) {
  let lo = 1e2; // s(lo) > target
  let hi = 1e18; // s(hi) < target
  for (let i = 0; i < 200; i++) {
    const mid = Math.sqrt(lo * hi);
    if (flowShare(mid) > target) lo = mid;
    else hi = mid;
  }
  return Math.sqrt(lo * hi);
}

const N_1PCT = thresholdN(1e-2); // ~3.247e7
const N_0P1PCT = thresholdN(1e-3); // ~1.755e10
const SHARE_AT_1E6 = flowShare(1e6); // ~3.05e-2
const SHARE_AT_1E13 = flowShare(1e13); // ~7.93e-5
const SHARE_AT_NCROSS = flowShare(N_CROSS); // ~1.90e-3

const DECADES_1PCT = Math.log10(N_1PCT) - Math.log10(N_CROSS); // ~-2.00 (below N_cross)
const DECADES_0P1PCT = Math.log10(N_0P1PCT) - Math.log10(N_CROSS); // ~+0.73 (above N_cross)

// (M1) the E_flow share is strictly decreasing across the sampled ladder.
const SHARE_LADDER = [6, 7, 8, 9, 10, 11, 12, 13].map((k) => ({
  log10N: k,
  flowShare: flowShare(Math.pow(10, k)),
}));
let shareStrictlyDecreasing = true;
for (let i = 1; i < SHARE_LADDER.length; i++) {
  if (!(SHARE_LADDER[i].flowShare < SHARE_LADDER[i - 1].flowShare)) shareStrictlyDecreasing = false;
}

export const IMP35154_EFLOW_NEGLIGIBLE_THRESHOLD = {
  id: 'imp-35154',
  proofSection: 'S-frontier',
  question:
    'On the inherited imp-33601/imp-3406 component surrogate, locate the N-thresholds at which the ' +
    'flow term E_flow first drops below a 1% and a 0.1% share of the above-floor residual ' +
    'E_coll + E_flow (imp-35100 M3 gave the ratio only at 1e13, ~8e-5), and report both relative ' +
    'to the imp-33723 N_cross = 3.280294e9 landmark. Measurement only; C_mb GUE-conditional per ' +
    'imp-486; changes no bound; NO QED.',
  componentModel:
    'E_coll = C_C sqrt(log T0 / N) (GUE-conditional); E_flow = C_F (log T0 / T0) Gronwall ' +
    '(imp-398); E_trunc = 3.06e-5 (N-independent, imp-2631); s(N) = E_flow/(E_coll+E_flow)',
  metric:
    'E_flow share of the above-floor residual s(N) = E_flow / (E_coll + E_flow); strictly ' +
    'decreasing because E_flow/E_coll ~ N^-1/2 up to slow log factors.',
  thresholds: {
    N_flow_below_1pct: +N_1PCT.toExponential(6), // ~3.246862e7
    log10_N_1pct: +Math.log10(N_1PCT).toFixed(4), // ~7.5115
    N_flow_below_0p1pct: +N_0P1PCT.toExponential(6), // ~1.754552e10
    log10_N_0p1pct: +Math.log10(N_0P1PCT).toFixed(4), // ~10.2442
    decades_1pct_vs_Ncross: +DECADES_1PCT.toFixed(4), // ~-2.0044 (below N_cross)
    decades_0p1pct_vs_Ncross: +DECADES_0P1PCT.toFixed(4), // ~+0.7283 (above N_cross)
  },
  landmarks: {
    N_cross_imp33723: +N_CROSS.toExponential(6), // 3.280294e9
    flow_share_at_Ncross: +SHARE_AT_NCROSS.toExponential(4), // ~1.8956e-3 (~0.19%)
    flow_share_at_1e6: +SHARE_AT_1E6.toExponential(4), // ~3.0470e-2
    flow_share_at_1e13: +SHARE_AT_1E13.toExponential(4), // ~7.9303e-5 (matches imp-35100 M3)
  },
  shareLadder: SHARE_LADDER.map((r) => ({
    log10N: r.log10N,
    flowShare: +r.flowShare.toExponential(4),
  })),
  finding: {
    M1_share_strictly_decreasing:
      'The E_flow share s(N) = E_flow/(E_coll+E_flow) is strictly decreasing across [1e6,1e13] ' +
      '(E_flow/E_coll ~ N^-1/2): s(1e6) ~ 3.05e-2 falls to s(1e13) ~ 7.93e-5, so the flow term ' +
      'monotonically loses weight in the above-floor residual.',
    M2_one_percent_threshold:
      'E_flow drops below a 1% share at N_1pct ~ 3.247e7 (log10 ~ 7.51), ~2.00 decades BELOW ' +
      'N_cross = 3.280294e9. From N ~ 3.25e7 up, E_flow is a <1% correction to E_coll + E_flow.',
    M3_tenth_percent_threshold:
      'E_flow drops below a 0.1% share at N_0p1pct ~ 1.755e10 (log10 ~ 10.24), ~0.73 decades ' +
      'ABOVE N_cross. At N_cross itself the share is already only ~0.19%, between the two ' +
      'thresholds, so the E_coll = E_trunc crossover neighborhood is essentially E_coll-only.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). On the inherited imp-33601/imp-3406 component ' +
    'surrogate the E_flow share of the above-floor residual s(N) = E_flow/(E_coll+E_flow) is ' +
    'strictly decreasing and crosses 1% at N_1pct ~ 3.247e7 (~2.00 decades below the imp-33723 ' +
    'N_cross = 3.280294e9) and 0.1% at N_0p1pct ~ 1.755e10 (~0.73 decades above N_cross); at ' +
    'N_cross itself E_flow is already only ~0.19% of the residual. This pins where imp-35100 M3s ' +
    'E_flow/E_coll -> 0 becomes quantitatively negligible: the above-floor residual is pure E_coll ' +
    'to <1% for all N above ~3.25e7 and to <0.1% by ~1.76e10, spanning the whole crossover ' +
    'neighborhood. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a ' +
    'rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; C_C 1/8 ansatz ' +
    '(imp-2642) UNTOUCHED; E_trunc fixed strip (imp-2631) UNTOUCHED; changes no bound; establishes ' +
    'no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35100 (M3: E_flow/E_coll -> 0, ~8e-5 by 1e13, same model); imp-33601 (E_flow offset ' +
    'identity); imp-33723 (N_cross = 3.280294e9 closed form); imp-3406 (component model source); ' +
    'imp-34130 (E_coll ~N^-1/2 sqrt-log tail rate); imp-2631 (E_trunc fixed strip); imp-398 ' +
    '(E_flow C_F prefactor); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping ' +
    '(effectiveHeightForN).',
};

export const IMP35154_EFLOW_NEGLIGIBLE_THRESHOLD_ASSERTIONS = [
  {
    // Reuse gate: reproduce the imp-35100 M3 endpoint E_flow/E_coll ~ 7.9e-5 at 1e13, proving the
    // identical inherited component model is in use (share ~ ratio when ratio << 1).
    id: 'imp35154-reproduces-imp35100-M3-endpoint',
    description: 'E_flow share at 1e13 ~ 7.93e-5, matching imp-35100 M3 E_flow/E_coll',
    holds: () => Math.abs(SHARE_AT_1E13 / 7.9303e-5 - 1) < 1e-3,
  },
  {
    // (M1): the E_flow share is strictly decreasing across the sampled ladder.
    id: 'imp35154-share-strictly-decreasing',
    description: 'E_flow share s(N) strictly decreasing across [1e6,1e13]',
    holds: () => shareStrictlyDecreasing && SHARE_AT_1E6 > SHARE_AT_1E13,
  },
  {
    // (M2): the 1% threshold sits ~2 decades below N_cross.
    id: 'imp35154-one-percent-threshold-below-Ncross',
    description: 'N_1pct ~ 3.25e7 and ~2 decades below N_cross',
    holds: () =>
      Math.abs(N_1PCT / 3.246862e7 - 1) < 1e-3 && DECADES_1PCT < -1.9 && DECADES_1PCT > -2.1,
  },
  {
    // (M3): the 0.1% threshold sits ~0.73 decades above N_cross; share at N_cross ~ 0.19%.
    id: 'imp35154-tenth-percent-threshold-above-Ncross',
    description: 'N_0p1pct ~ 1.75e10, ~0.73 decades above N_cross; share at N_cross ~ 0.19%',
    holds: () =>
      Math.abs(N_0P1PCT / 1.754552e10 - 1) < 1e-3 &&
      DECADES_0P1PCT > 0.6 &&
      DECADES_0P1PCT < 0.85 &&
      SHARE_AT_NCROSS < 1e-2 &&
      SHARE_AT_NCROSS > 1e-3,
  },
  {
    // Ordering gate: N_1pct < N_cross < N_0p1pct (share monotone through the crossover).
    id: 'imp35154-threshold-ordering-brackets-Ncross',
    description: 'N_1pct < N_cross < N_0p1pct (thresholds bracket the crossover)',
    holds: () => N_1PCT < N_CROSS && N_CROSS < N_0P1PCT,
  },
  {
    // Honesty gate: measurement only, no QED, no refereed bound is changed.
    id: 'imp35154-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35154_EFLOW_NEGLIGIBLE_THRESHOLD.isRigorous === false &&
      /NO QED/.test(IMP35154_EFLOW_NEGLIGIBLE_THRESHOLD.verdict) &&
      /refereed bound is changed/i.test(IMP35154_EFLOW_NEGLIGIBLE_THRESHOLD.verdict),
  },
];

for (const a of IMP35154_EFLOW_NEGLIGIBLE_THRESHOLD_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35154-eflow-negligible-threshold assertion failed: ${a.id}`);
  }
}
