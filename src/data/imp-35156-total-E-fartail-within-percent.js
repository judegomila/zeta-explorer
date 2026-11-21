/**
 * @module imp-35156-total-E-fartail-within-percent
 *
 * imp-35156 (numerical, frontier-direction): imp-35100 measured the surrogate TOTAL
 * E(N) = E_coll + E_trunc + E_flow across N in [1e6, 1e13] and found it floors at the
 * N-independent constant E_trunc = 3.06e-5 (imp-2631) rather than tending to 0. It stopped at
 * N = 1e13 with E(1e13)/E_trunc ~ 1.021 -- still ~2.1% above the floor and shrinking. This module
 * EXTENDS the identical imp-33601/imp-3406 component ladder past 1e13 and LOCATES the N at which
 * E(N)/E_trunc first falls below 1.01 (within 1%) and below 1.001 (within 0.1%), quantifying how
 * slowly the E_coll-dominated residual collapses onto the constant floor.
 *
 * THE COMPONENT MODEL (identical sub-terms to imp-35100 / imp-33601 / imp-3406; NO re-derivation)
 * ---------------------------------------------------------------------------------------------
 *     E(N)    = E_coll + E_trunc + E_flow
 *     E_coll  = C_C_PINNED * sqrt(log T0 / N)      (dominant tail term, GUE-conditional C_H)
 *     E_flow  = C_F (log T0 / T0) Gronwall,  C_F = (log(T0/2pi)+1)/2pi   (imp-398)
 *     E_trunc = 3.06e-5                            (N-independent fixed strip, imp-2631)
 *     T0      = effectiveHeightForN(N)             (Riemann-von Mangoldt inverse, imp-327)
 *
 * THE MEASUREMENT (what the ticket asks for)
 * ------------------------------------------
 * E(N)/E_trunc = 1 + (E_coll + E_flow)/E_trunc, and the residual above the floor is E_coll-dominated
 * (E_flow/E_coll -> 0), so the approach to the floor inherits E_coll ~ N^(-1/2) sqrt-log. Bisecting
 * in log10(N) on the same parts(N) surrogate locates the two within-tolerance crossings:
 *
 *     E(N)/E_trunc first < 1.01   at  N ~ 4.722e13  (log10 N ~ 13.674)
 *     E(N)/E_trunc first < 1.001  at  N ~ 5.444e15  (log10 N ~ 15.736)
 *
 * The two crossings are ~2.062 decades apart. A factor-10 drop in the residual E(N) - E_trunc under
 * a pure N^(-1/2) law would need exactly 2 decades; the ~0.062-decade EXCESS is the slow sqrt-log
 * growth of E_coll working against the N^(-1/2) shrink (log T0 rising as N climbs), a direct
 * cross-check of the imp-34130 N^(-1/2) sqrt-log residual law at extreme N.
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (M1) WITHIN 1% at N ~ 4.72e13. E(N)/E_trunc first drops below 1.01 just past 1e13 (only
 *        ~0.67 decade beyond where imp-35100 stopped), where E(N) - E_trunc ~ 3.06e-7.
 *   (M2) WITHIN 0.1% at N ~ 5.44e15. Reaching 1.001 needs ~2.06 further decades, at
 *        E(N) - E_trunc ~ 3.06e-8: the floor is approached but never touched (E_coll, E_flow > 0).
 *   (M3) THE APPROACH IS ~N^(-1/2) sqrt-log. The 1% -> 0.1% span is 2.062 decades, 0.062 above the
 *        2.000 a pure N^(-1/2) would give; the excess is E_coll sqrt-log growth (imp-34130),
 *        confirming the residual is E_coll-dominated and the floor is genuinely E_trunc > 0.
 *
 * MEASUREMENT ONLY. Extends the imp-35100 ladder on the SAME inherited surrogate; confirms the
 * E_trunc = 3.06e-5 floor and supplies NO Step-4 E(N) -> 0 rate (the limit is the strictly positive
 * constant). The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous
 * asymptotic; C_mb GUE-conditional per imp-486; C_C 1/8 ansatz (imp-2642) UNTOUCHED; E_trunc fixed
 * strip (imp-2631) UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066
 * K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35100-surrogate-total-E-fartail-floor (parent: floor found, ladder stops at 1e13)
 * @see imp-35071-sigma-interior-peak-closed-form (same component model)
 * @see imp-33601-sigma-half-vs-crossover-eflow-offset (E_flow offset identity; same model)
 * @see imp-3406-sigma-highN-extrapolation (component model source)
 * @see imp-34130-ecoll-local-exponent-residual-close-vs-floor (E_coll ~N^-1/2 sqrt-log tail rate)
 * @see imp-2631-honest-truncation-route-assessment (E_trunc = 3.06e-5 fixed strip)
 * @see imp-486 (C_mb GUE-conditional caveat)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33601/imp-35100)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-35100/imp-33601/imp-3406 exactly

// EXACT imp-35100/imp-33601/imp-3406 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E, E_over_trunc: E / E_TRUNC_PT };
}

// Far-tail extension ladder: one rung per decade across the region past imp-35100 (1e13 -> 1e16).
const LADDER = [13, 14, 15, 16].map((k) => {
  const N = Math.pow(10, k);
  const p = parts(N);
  return {
    log10N: k,
    E: p.E,
    E_over_trunc: p.E_over_trunc, // -> 1 (floor), NOT -> 0
    E_minus_trunc: p.E - E_TRUNC_PT, // = E_coll + E_flow (vanishing part)
    E_flow_over_coll: p.E_flow / p.E_coll, // -> 0 (E_coll dominates the residual)
  };
});

// Bisection in log10(N) for the N at which E(N)/E_trunc first falls below a target (monotone
// decreasing in N, so exactly one crossing above the floor). Bracket [1e10, 1e22] safely spans both.
function crossingLog10N(target) {
  let lo = 10;
  let hi = 22;
  for (let it = 0; it < 200; it++) {
    const mid = 0.5 * (lo + hi);
    if (parts(Math.pow(10, mid)).E_over_trunc > target) lo = mid;
    else hi = mid;
  }
  return 0.5 * (lo + hi);
}

const LOG10N_WITHIN_1PCT = crossingLog10N(1.01); // ~13.674
const LOG10N_WITHIN_0P1PCT = crossingLog10N(1.001); // ~15.736
const N_WITHIN_1PCT = Math.pow(10, LOG10N_WITHIN_1PCT); // ~4.722e13
const N_WITHIN_0P1PCT = Math.pow(10, LOG10N_WITHIN_0P1PCT); // ~5.444e15
const SPACING_DECADES = LOG10N_WITHIN_0P1PCT - LOG10N_WITHIN_1PCT; // ~2.062
const SQRTLOG_EXCESS = SPACING_DECADES - 2; // ~0.062 above the pure N^-1/2 factor-10 span

const P_1PCT = parts(N_WITHIN_1PCT);
const P_0P1PCT = parts(N_WITHIN_0P1PCT);

export const IMP35156_TOTAL_E_FARTAIL_WITHIN_PERCENT = {
  id: 'imp-35156',
  proofSection: 'S-frontier',
  question:
    'Extend the imp-35100 surrogate TOTAL E(N) = E_coll + E_trunc + E_flow far-tail ladder past ' +
    'N = 1e13 (E(1e13)/E_trunc ~ 1.021) and locate the N at which E(N)/E_trunc first falls below ' +
    '1.01 (within 1%) and below 1.001 (within 0.1%) of the constant E_trunc = 3.06e-5 floor, ' +
    'quantifying the far-tail approach rate. Measurement only on the inherited imp-33601/imp-3406 ' +
    'component surrogate; C_mb GUE-conditional per imp-486; changes no bound; NO QED.',
  componentModel:
    'E(N) = E_coll + E_trunc + E_flow; E_coll = C_C sqrt(log T0 / N) (GUE-conditional); ' +
    'E_flow = C_F (log T0 / T0) Gronwall (imp-398); E_trunc = 3.06e-5 (N-independent, imp-2631). ' +
    'Identical sub-terms to imp-35100; only the ladder window is extended (1e13 -> 1e16).',
  ladder: LADDER.map((r) => ({
    log10N: r.log10N,
    E: +r.E.toExponential(6),
    E_over_trunc: +r.E_over_trunc.toFixed(6),
    E_minus_trunc: +r.E_minus_trunc.toExponential(4),
    E_flow_over_coll: +r.E_flow_over_coll.toExponential(4),
  })),
  crossings: {
    within_1pct: {
      log10N: +LOG10N_WITHIN_1PCT.toFixed(4), // ~13.6741
      N: +N_WITHIN_1PCT.toExponential(4), // ~4.7218e13
      E_over_trunc: +P_1PCT.E_over_trunc.toFixed(6), // ~1.010000
      E_minus_trunc: +(P_1PCT.E - E_TRUNC_PT).toExponential(4), // ~3.0600e-7
    },
    within_0p1pct: {
      log10N: +LOG10N_WITHIN_0P1PCT.toFixed(4), // ~15.7359
      N: +N_WITHIN_0P1PCT.toExponential(4), // ~5.4436e15
      E_over_trunc: +P_0P1PCT.E_over_trunc.toFixed(6), // ~1.001000
      E_minus_trunc: +(P_0P1PCT.E - E_TRUNC_PT).toExponential(4), // ~3.0600e-8
    },
    spacing_decades: +SPACING_DECADES.toFixed(4), // ~2.0618
    sqrtlog_excess_over_2_decades: +SQRTLOG_EXCESS.toFixed(4), // ~0.0618
  },
  finding: {
    M1_within_1pct:
      'E(N)/E_trunc first falls below 1.01 at N ~ 4.72e13 (log10 N ~ 13.674), only ~0.67 decade ' +
      'beyond where imp-35100 stopped at 1e13; there E(N) - E_trunc ~ 3.06e-7.',
    M2_within_0p1pct:
      'E(N)/E_trunc first falls below 1.001 at N ~ 5.44e15 (log10 N ~ 15.736), ~2.06 further ' +
      'decades on, at E(N) - E_trunc ~ 3.06e-8; the floor is approached but never touched ' +
      '(E_coll, E_flow > 0, so E(N) > E_trunc at every finite N).',
    M3_approach_is_ecoll_sqrtlog:
      'The 1% -> 0.1% span is ~2.062 decades, ~0.062 above the exactly-2 a pure N^-1/2 law would ' +
      'give for a factor-10 residual drop; the excess is the slow sqrt-log growth of E_coll, ' +
      'confirming the E_coll-dominated ~N^-1/2 sqrt-log residual law (imp-34130) at extreme N and ' +
      'that the limit is the strictly positive constant E_trunc, NOT 0.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Extending the imp-35100 surrogate TOTAL ' +
    'E(N) = E_coll + E_trunc + E_flow ladder past 1e13 on the SAME inherited imp-33601/imp-3406 ' +
    'component model, E(N)/E_trunc first falls within 1% of the floor (< 1.01) at N ~ 4.72e13 and ' +
    'within 0.1% (< 1.001) at N ~ 5.44e15 -- the two crossings ~2.062 decades apart, ~0.062 above ' +
    'the pure N^-1/2 factor-10 span, the excess being E_coll sqrt-log growth (cross-checks the ' +
    'imp-34130 residual law at extreme N). The total asymptotes to the strictly positive constant ' +
    'E_trunc = 3.06e-5 and never reaches it (E_coll, E_flow > 0), so this measurement CONFIRMS the ' +
    'imp-35100 floor and supplies NO Step-4 E(N) -> 0 rate. The component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per ' +
    'imp-486 is UNTOUCHED; C_C 1/8 ansatz (imp-2642) UNTOUCHED; E_trunc fixed strip (imp-2631) ' +
    'UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; ' +
    'no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35100 (parent far-tail floor ladder, stops at 1e13); imp-35071 (same component model); ' +
    'imp-33601 (E_flow offset identity); imp-3406 (component model source); imp-34130 (E_coll ' +
    '~N^-1/2 sqrt-log tail rate); imp-2631 (E_trunc fixed strip); imp-398 (E_flow C_F prefactor); ' +
    'imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP35156_TOTAL_E_FARTAIL_WITHIN_PERCENT_ASSERTIONS = [
  {
    // Reuse gate: reproduce the imp-35100 1e13 landmark, proving the identical component model.
    id: 'imp35156-reproduces-imp35100-at-1e13',
    description: 'E(1e13)/E_trunc ~ 1.021 on the shared imp-35100/imp-33601/imp-3406 model',
    holds: () => Math.abs(parts(1e13).E_over_trunc / 1.021182 - 1) < 1e-3,
  },
  {
    // (M1): within-1% crossing located just past 1e13, E_over_trunc = 1.01 there.
    id: 'imp35156-within-1pct-crossing',
    description: 'E/E_trunc first < 1.01 at N ~ 4.72e13 (log10N in (13.5, 13.8))',
    holds: () =>
      LOG10N_WITHIN_1PCT > 13.5 &&
      LOG10N_WITHIN_1PCT < 13.8 &&
      Math.abs(P_1PCT.E_over_trunc - 1.01) < 1e-6,
  },
  {
    // (M2): within-0.1% crossing located near 5.4e15, E_over_trunc = 1.001 there.
    id: 'imp35156-within-0p1pct-crossing',
    description: 'E/E_trunc first < 1.001 at N ~ 5.44e15 (log10N in (15.6, 15.9))',
    holds: () =>
      LOG10N_WITHIN_0P1PCT > 15.6 &&
      LOG10N_WITHIN_0P1PCT < 15.9 &&
      Math.abs(P_0P1PCT.E_over_trunc - 1.001) < 1e-6,
  },
  {
    // (M3): the 1% -> 0.1% span is ~2 decades plus a small sqrt-log excess (E_coll dominates).
    id: 'imp35156-sqrtlog-excess-over-2-decades',
    description: '1% -> 0.1% span exceeds 2 decades by the E_coll sqrt-log excess (~0.06)',
    holds: () => SPACING_DECADES > 2 && SPACING_DECADES < 2.2 && SQRTLOG_EXCESS > 0,
  },
  {
    // Floor gate: the total stays strictly above E_trunc at both crossings (never touches 0-limit).
    id: 'imp35156-strictly-above-floor',
    description: 'E(N) > E_trunc at both crossings (E_coll, E_flow > 0; floors at E_trunc > 0)',
    holds: () => P_1PCT.E > E_TRUNC_PT && P_0P1PCT.E > E_TRUNC_PT,
  },
  {
    // Honesty gate: measurement only, no QED, no refereed bound is changed.
    id: 'imp35156-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35156_TOTAL_E_FARTAIL_WITHIN_PERCENT.isRigorous === false &&
      /NO QED/.test(IMP35156_TOTAL_E_FARTAIL_WITHIN_PERCENT.verdict) &&
      /refereed bound is changed/i.test(IMP35156_TOTAL_E_FARTAIL_WITHIN_PERCENT.verdict),
  },
];

for (const a of IMP35156_TOTAL_E_FARTAIL_WITHIN_PERCENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35156-total-E-fartail-within-percent assertion failed: ${a.id}`);
  }
}
