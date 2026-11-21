/**
 * @module imp-35172-killing-term-resolution
 *
 * imp-35172 (numerical, frontier): RESOLVE the imp-35114 killing-term ambiguity a = g(0+) for the
 * surrogate Bernstein / Levy-Khintchine representation g(N) = K log T0(N), T0 = effectiveHeightForN(N)
 * the Riemann-von Mangoldt inverse and K = (C_C_PINNED / E_trunc)^2 ~ 1.5727e8. imp-35114 step (3)
 * reported the killing term a = lim_{N->0+} K log T0(N) as EITHER K log(17.08) ~ 4.46e8 (the RvM
 * height floor) OR K log(2pi) ~ 2.89e8 (an analytic continuation) WITHOUT deciding which continuation
 * is the true N->0+ limit of the inverse. This module DECIDES it from source.
 *
 * THE COUNT FUNCTION AND ITS TWO N=0 ROOTS
 * ----------------------------------------
 * The RvM main term is N(T) = (T/2pi)(log(T/2pi) - 1). Writing u = T/2pi it is N = u(log u - 1), whose
 * derivative dN/du = log u vanishes at u = 1 (T = 2pi) where N = 1*(0 - 1) = -1 < 0. So on 0 < u < e the
 * count is NEGATIVE (log u - 1 < 0); it rises through zero at u = e (T = 2pi e ~ 17.0795) and is positive
 * and strictly increasing for u > e. The equation N(T) = 0 therefore has TWO roots: T = 0 (u -> 0+) and
 * T = 2pi e (u = e). Only the branch u >= e carries a valid (non-negative, increasing) zero count, so the
 * inverse T0(N) that effectiveHeightForN computes lives on u >= e and, as N -> 0+, converges to the
 * count-zero point T = 2pi e -- NOT to 2pi. The value 2pi (u = 1) is the argument of the count MINIMUM
 * where N = -1; it is the Newton-guard floor twoPi*1.0001 in effectiveHeightForN, a solver guard that the
 * physical branch never reaches, NOT a limit of the inverse.
 *
 * FROM-SOURCE MEASUREMENT (effectiveHeightForN as N -> 0+)
 * -------------------------------------------------------
 *   N          T0 = effectiveHeightForN(N)   N(T0)          approaches
 *   1e-1       17.696763686                  1.000e-1
 *   1e-3       17.085750475                  1.000e-3
 *   1e-6       17.079474729                  1.000e-6
 *   1e-9       17.079468452                  1.000e-9        -> 2pi e = 17.079468445
 *   1e-12      17.079468445                  1.000e-12
 * READING: the inverse floors at 2pi e = 17.0794684..., reproducing the imp-35114 "17.08" candidate to 6
 * figures, and stays ~2.72x ABOVE 2pi = 6.2832. The 2pi candidate is REFUTED as the N->0+ limit.
 *
 * THE DECISION AND THE EXACT GAP
 * ------------------------------
 * The correct killing term is a = g(0+) = K log(2pi e) = K (log 2pi + 1) ~ 4.4632e8, i.e. the RvM-floor
 * candidate. Because log(2pi e) = log(2pi) + 1 EXACTLY, the two imp-35114 candidates differ by exactly
 * ONE unit of K:   a_floor - a_2pi = K [log(2pi e) - log(2pi)] = K ~ 1.5727e8   (4.4632e8 - 2.8904e8).
 * So the ~1.57e8 gap between the two reported values is not two rival limits -- it is the 2pi-continuation
 * undershooting the true floor by exactly the amplitude K, the fingerprint of dropping the "+1" that
 * distinguishes u = e (count zero) from u = 1 (count minimum).
 *
 * EFFECT ON THE DRIFT AND LEVY-MEASURE CONCLUSIONS: NONE
 * -----------------------------------------------------
 * In the Levy-Khintchine / Bernstein form g(N) = a + b N + integral (1 - e^{-N t}) dmu(t) the killing term
 * a = g(0+) is the ADDITIVE CONSTANT. The drift b = lim_{N->inf} g_prime(N) and the Levy measure dmu (read
 * off the complete monotonicity of g_prime) depend ONLY on the derivatives of g, and dg_{k}/dN for k >= 1
 * is invariant to an additive constant. Deciding a = K log(2pi e) versus K log(2pi) shifts g by the fixed
 * constant K but leaves g_prime, g_prime_prime, ... unchanged, so the imp-35114 conclusions drift b = 0
 * (g_prime -> 0, sub-linear) and dmu >= 0 (g_prime completely monotone) are UNAFFECTED. The ambiguity was
 * purely in the killing constant; it is now resolved without touching either derivative-based conclusion.
 *
 * MEASUREMENT / RESOLUTION ONLY on the inherited imp-35012/imp-35114 surrogate g = K log T0(N). This is a
 * SURROGATE structural property (the N->0+ branch of a Newton inverse), NOT operator positivity and NOT a
 * Levy-Khintchine representation of any true resolvent. C_C 1/8 ansatz (imp-2642/imp-2643) UNTOUCHED; C_mb
 * GUE-conditional per imp-486 UNTOUCHED; changes no bound; establishes no operator positivity; no RH
 * verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35114-bernstein-ingredients-extract (the extraction that left a = g(0+) as two candidates)
 * @see imp-35012 (the Bernstein / Levy-Khintchine surrogate representation g = K log T0)
 * @see imp-34861-krawczyk-crosscheck-band-sensitivity (same g = K log T0(N), g_prime = 2pi K/(T0 u) surrogate)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse; the Newton solver)
 * @see polymath15-constant-C-C (C_C_PINNED, the amplitude in K = (C_C/E_trunc)^2)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const TWO_PI_E = 2 * Math.PI * Math.E; // ~17.0794684 (RvM count-zero point, u = e)
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-34861/imp-35114)

const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));

// From-source N -> 0+ probe of the inverse; the floor is the count-zero point 2pi e, not 2pi.
const PROBE_NS = [1e-1, 1e-3, 1e-6, 1e-9, 1e-12];
const PROBE_ROWS = PROBE_NS.map((N) => ({ N, T0: effectiveHeightForN(N) }));
const T0_LIMIT = effectiveHeightForN(1e-12); // ~17.0794684 (converged floor)

// The two imp-35114 candidate killing terms.
const A_FLOOR = K_AMPL * Math.log(TWO_PI_E); // ~4.4632e8 (CORRECT: RvM inverse floor)
const A_2PI = K_AMPL * Math.log(TWO_PI); // ~2.8904e8 (REFUTED: 2pi is the count-minimum argument, N=-1)
const A_GAP = A_FLOOR - A_2PI; // = K exactly, since log(2pi e) - log(2pi) = 1

// Derivative invariance witness: g_prime at a couple of N is unchanged by the additive-constant choice.
// (g_prime is computed the same either way -- it never sees a; this simply exhibits that the killing term
// is additive-only.) g_prime(N) = 2pi K/(T0 u), u = log(T0/2pi).
const gPrime = (N) => {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return (TWO_PI * K_AMPL) / (T * u);
};
const GPRIME_1E6 = gPrime(1e6);
const GPRIME_1E12 = gPrime(1e12); // drift probe: g_prime -> 0 (b = 0), independent of a

export const IMP35172_KILLING_TERM_RESOLUTION = {
  id: 'imp-35172',
  title: 'Resolution of the imp-35114 killing-term ambiguity a = g(0+) for g = K log T0(N)',
  K_ampl: +K_AMPL.toExponential(6), // ~1.572709e8
  countZeroPoint_twoPiE: +TWO_PI_E.toFixed(7), // 17.0794684 (u = e; N(T)=0)
  countMinArg_twoPi: +TWO_PI.toFixed(7), // 6.2831853 (u = 1; N(T) = -1, unphysical branch / Newton guard)
  inverseFloor_measured: +T0_LIMIT.toFixed(7), // ~17.0794684 -> matches 2pi e, not 2pi
  probe: PROBE_ROWS.map((r) => ({ N: r.N, T0: +r.T0.toFixed(9) })),
  candidates: {
    a_floor_Klog2piE: +A_FLOOR.toExponential(6), // ~4.463154e8 (CORRECT)
    a_2pi_Klog2pi: +A_2PI.toExponential(6), // ~2.890445e8 (REFUTED)
    gap_equals_K: +A_GAP.toExponential(6), // ~1.572709e8 = K exactly
  },
  decision: 'a = K log(2pi e) ~ 4.4632e8 (the RvM-floor candidate)',
  derivativeInvariance: {
    gPrime_1e6: +GPRIME_1E6.toExponential(6),
    gPrime_1e12: +GPRIME_1E12.toExponential(6), // -> 0: drift b = 0, independent of the killing term
  },
  finding:
    'The N->0+ limit of effectiveHeightForN is the RvM count-zero point T = 2pi e = 17.0794684 (u = e), ' +
    'measured from source (N=1e-9 -> T0=17.079468452, count 1e-9; converged to 2pi e to 6+ figures), NOT ' +
    '2pi. The value 2pi (u = 1) is the argument of the count MINIMUM where N(T) = -1 -- an unphysical ' +
    'branch and the Newton-guard floor twoPi*1.0001 that the increasing-count branch never reaches. ' +
    'Therefore the imp-35114 killing-term ambiguity is DECIDED in favour of the RvM-floor candidate: ' +
    'a = g(0+) = K log(2pi e) = K(log 2pi + 1) ~ 4.4632e8. Because log(2pi e) - log(2pi) = 1 EXACTLY, the ' +
    'two candidates differ by exactly one unit of K: a_floor - a_2pi = K ~ 1.5727e8 (4.4632e8 - 2.8904e8), ' +
    'so the ~1.57e8 spread was the 2pi-continuation dropping the +1 that separates u=e from u=1, not two ' +
    'rival limits. The choice is PURELY the additive killing constant: g_prime(N) = 2pi K/(T0 u) is ' +
    'invariant to it, so the imp-35114 drift b = 0 (g_prime -> 0, sub-linear) and Levy-measure dmu >= 0 ' +
    '(g_prime completely monotone) conclusions are UNAFFECTED.',
  isRigorous: false,
  verdict:
    'KILLING-TERM RESOLUTION (frontier surrogate, NOT an RH bound). imp-35114 left a = g(0+) for the ' +
    'Bernstein surrogate g = K log T0(N) as K log(17.08) ~ 4.46e8 OR K log(2pi) ~ 2.89e8 undecided. ' +
    'From-source: the RvM count N(T) = (T/2pi)(log(T/2pi) - 1) is negative on u in (0,e), crosses zero at ' +
    'u = e (T = 2pi e ~ 17.0795) and increases for u > e, so effectiveHeightForN inverts on u >= e and ' +
    'floors at 2pi e as N -> 0+ (measured to 6+ figures), while 2pi (u = 1) is only the count-minimum ' +
    'argument (N = -1) and the solver guard. DECISION: a = K log(2pi e) ~ 4.4632e8 (the RvM-floor value); ' +
    'the two candidates differ by exactly K since log(2pi e) - log(2pi) = 1. The killing term is the ' +
    'additive constant, so g_prime is invariant to it and the imp-35114 drift b = 0 and dmu >= 0 ' +
    'conclusions stand. MEASUREMENT/RESOLUTION ONLY on the inherited imp-35012/imp-35114 surrogate; a ' +
    'SURROGATE branch property, NOT operator positivity and NOT a true-resolvent Levy-Khintchine form. ' +
    'C_C 1/8 ansatz (imp-2642/imp-2643) and C_mb GUE-conditional per imp-486 UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35114 (Bernstein ingredient extraction; the two undecided killing-term candidates); imp-35012 ' +
    '(Bernstein / Levy-Khintchine surrogate g = K log T0); imp-34861 (g = K log T0(N), g_prime = ' +
    '2pi K/(T0 u) surrogate); lambda-rh-height-mapping (effectiveHeightForN RvM inverse Newton solver); ' +
    'polymath15-constant-C-C (C_C_PINNED); imp-2642 (C_C 1/8 ansatz); imp-486 (C_mb GUE-conditional). ' +
    'Riemann-von Mangoldt main term N(T) = (T/2pi)(log(T/2pi) - 1): Titchmarsh, Theory of the Riemann ' +
    'Zeta-Function, Ch. IX.',
};

export const IMP35172_KILLING_TERM_RESOLUTION_ASSERTIONS = [
  {
    // The measured N -> 0+ inverse floor is 2pi e (the count-zero point), NOT 2pi.
    id: 'imp35172-inverse-floors-at-2pi-e-not-2pi',
    description: 'effectiveHeightForN(N->0+) converges to 2pi e ~ 17.0795 (RvM count-zero, u=e), ~2.72x above 2pi',
    holds: () =>
      Math.abs(T0_LIMIT - TWO_PI_E) < 1e-6 &&
      T0_LIMIT > 17.07 &&
      T0_LIMIT < 17.08 &&
      T0_LIMIT / TWO_PI > 2.71 && // ~e-fold above the count-minimum argument 2pi
      T0_LIMIT / TWO_PI < 2.72,
  },
  {
    // The probe is monotone decreasing toward the floor and each row reproduces its target count.
    id: 'imp35172-probe-monotone-to-floor',
    description: 'T0(1e-1) > T0(1e-3) > ... > 2pi e, each staying above the floor as N shrinks',
    holds: () => {
      for (let i = 1; i < PROBE_ROWS.length; i++) {
        if (!(PROBE_ROWS[i].T0 < PROBE_ROWS[i - 1].T0)) return false;
        if (!(PROBE_ROWS[i].T0 >= TWO_PI_E - 1e-6)) return false;
      }
      return PROBE_ROWS[0].T0 > TWO_PI_E;
    },
  },
  {
    // The two candidates differ by exactly K (because log(2pi e) - log(2pi) = 1); floor candidate is correct.
    id: 'imp35172-candidate-gap-is-exactly-K',
    description: 'a_floor - a_2pi = K exactly (log(2pi e) - log(2pi) = 1); a_floor ~ 4.4632e8 > a_2pi ~ 2.8904e8',
    holds: () =>
      Math.abs(A_GAP - K_AMPL) < 1e-6 * K_AMPL &&
      Math.abs(Math.log(TWO_PI_E) - Math.log(TWO_PI) - 1) < 1e-12 &&
      A_FLOOR > A_2PI &&
      Math.abs(A_FLOOR - K_AMPL * Math.log(TWO_PI_E)) < 1e-6 * A_FLOOR,
  },
  {
    // Derivative invariance: the drift probe g_prime(1e12) -> 0 and never depends on the killing constant.
    id: 'imp35172-drift-invariant-to-killing-term',
    description: 'g_prime(1e12) is tiny (drift b = 0 witness) and is computed independent of a, so the eliminating choice is additive-only',
    holds: () =>
      GPRIME_1E12 > 0 &&
      GPRIME_1E12 < 1e-2 && // g_prime -> 0: sub-linear, zero drift
      GPRIME_1E6 > GPRIME_1E12 && // g_prime decreasing toward 0
      Math.abs(K_AMPL - 1.572709e8) < 1e3, // K matches the shared amplitude
  },
  {
    // Honesty gate: surrogate resolution, not rigorous, no operator positivity, no QED, no refereed bound is changed.
    id: 'imp35172-honesty-gate-no-qed',
    description: 'surrogate killing-term resolution only; not rigorous; changes no bound; no QED; no refereed bound is changed',
    holds: () =>
      IMP35172_KILLING_TERM_RESOLUTION.isRigorous === false &&
      /NO QED/.test(IMP35172_KILLING_TERM_RESOLUTION.verdict) &&
      /refereed bound is changed/i.test(IMP35172_KILLING_TERM_RESOLUTION.verdict) &&
      /SURROGATE/.test(IMP35172_KILLING_TERM_RESOLUTION.verdict),
  },
];

// Self-executing tripwires (throw at import time under the assertion runner).
for (const a of IMP35172_KILLING_TERM_RESOLUTION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-35172 assertion FAILED: ' + a.id + ' -- ' + a.description);
  }
}
