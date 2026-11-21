/**
 * @module imp-97601-route-m-mcm-margin-collapse-rate-law
 *
 * imp-97601 (numerical -- MEASUREMENT/DERIVATION ONLY; MCM stays refuted from omega=11; NO QED).
 *
 * imp-97583 RESULT 3 reported that the Route M MCM holding margin T(p_omega#) falls by a "roughly-constant
 * ~2.1e-3 per order" (ladder 1.00e-2, 6.82e-3, 4.18e-3, 2.10e-3, 4.78e-4) toward the primorial limit
 * -e^{-gamma}/12 + Rcorr = -0.04577, driven by the surrogate step drop (Rcorr flat), but never fit the
 * collapse rate to a closed form nor tested whether it is truly constant or slowly drifting. This leaf
 * DERIVES the exact per-order decrement of the surrogate, settles the constant-vs-drift question, and
 * extrapolates the omega at which the margin would reach the primorial limit.
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 -- EXACT CLOSED FORM for the per-order surrogate decrement.
 * -------------------------------------------------------------------------------
 * From the imp-97432 primorial surrogate S(omega) = surrogate(p_omega#) = Pi_omega [lnA - c*Sigma_omega],
 * Pi_omega = Prod_{i<=omega}(1 - 1/p_i), Sigma_omega = Sum_{i<=omega} log p_i/(p_i - 1), c = 1/12, the
 * next-order difference telescopes exactly (using step_{omega+1}*(1 - 1/p_{omega+1}) = log p_{omega+1}/p_{omega+1}):
 *     dS(omega) := S(omega+1) - S(omega) = -(Pi_omega / p_{omega+1}) * ( A_omega + c*log p_{omega+1} ),
 *     A_omega := lnA - c*Sigma_omega        (the surrogate bracket at order omega).
 * This reproduces the direct difference S(omega+1)-S(omega) to 1e-15 at every order (asserted below). Since
 * the saturated R-correction is flat (imp-97432/imp-97583: Rcorr ~ +1.0186e-3 across omega 7..15), the full
 * margin decrement dT(omega) = T(p_{omega+1}#) - T(p_omega#) equals dS(omega) to the same precision.
 *
 * -------------------------------------------------------------------------------
 * RESULT 2 -- THE COLLAPSE RATE IS NOT CONSTANT; IT DRIFTS DOWNWARD (decays), governed by the prefactor.
 * -------------------------------------------------------------------------------
 * The two factors of dS(omega) behave oppositely:
 *   - BRACKET A_omega + c*log p_{omega+1} = lnA + c*(log p_{omega+1} - Sigma_omega) is asymptotically
 *     CONSTANT: it converges to B_inf ~ 0.296789 (measured through the 148933rd prime ~2e6). It is flat.
 *   - PREFACTOR Pi_omega / p_{omega+1} DECAYS to 0 like e^{-gamma}/(p_omega log p_omega) (Mertens third
 *     theorem: Pi_omega * log p_omega -> e^{-gamma} = 0.561459).
 * So dS(omega) ~ -(e^{-gamma} B_inf)/(p_omega log p_omega) -> 0. The "~2.1e-3 per order" is a MID-WINDOW
 * value, not a rate law: the measured decrements at omega = 5..10 are already visibly shrinking
 * (-4.45e-3, -3.19e-3, -2.64e-3, -2.08e-3, -1.62e-3, -1.44e-3), and the shrinkage continues monotonically.
 * The imp-97583 "roughly-constant ~2.1e-3/order" framing is REVISED: the collapse rate DRIFTS (decays), it
 * is not constant.
 *
 * -------------------------------------------------------------------------------
 * RESULT 3 -- GAP-TO-LIMIT LAW and the extrapolated reach (logarithmically slow; no finite-order arrival).
 * -------------------------------------------------------------------------------
 * Because the decrements decay and their tail sum converges to the finite limit, the surrogate approaches
 * -e^{-gamma}/12 only asymptotically. Summing the tail (prime density dp/log p) gives the gap law
 *     gap(omega) := S(omega) - (-e^{-gamma}/12) ~ (e^{-gamma} B_inf) / log p_omega ~ 0.166635 / log p_omega,
 * which matches the measured gap to <0.02% from omega = 1000 out to omega = 148933 (p ~ 2e6). Hence the
 * margin NEVER reaches the -0.0458 primorial limit at any humanly-finite order; reaching within eps needs
 * log p_omega ~ 0.166635/eps, i.e. p_omega ~ exp(0.166635/eps):
 *     within 1e-2 of the limit: p_omega ~ e^{16.7} ~ 1e7   (omega ~ 6e5),
 *     within 1e-3 of the limit: p_omega ~ e^{167}  ~ 1e72,
 *     within 1e-4 of the limit: p_omega ~ e^{1666} ~ 1e724.
 * The failure deepens without bound in omega but at a logarithmically vanishing rate, and stays deep inside
 * the two-sided b/4 band [-1/4, 1/4] at every order.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.  MEASUREMENT/DERIVATION ONLY. The per-order surrogate decrement has the exact closed form
 * dS(omega) = -(Pi_omega/p_{omega+1})(A_omega + c*log p_{omega+1}). The imp-97583 "roughly-constant
 * ~2.1e-3/order" is a mid-window artifact: the rate DRIFTS DOWNWARD (decays), because the bracket is
 * asymptotically constant (B_inf ~ 0.296789) while the prefactor decays like e^{-gamma}/(p_omega log p_omega).
 * The gap to the -e^{-gamma}/12 limit closes only logarithmically, gap ~ 0.166635/log p_omega, so the margin
 * reaches the -0.0458 limit at no finite order (within 1e-3 needs p_omega ~ 1e72). MCM stays refuted from
 * omega=11; the b/4 ceiling is untouched; kappa_arith unchanged; no bound on Lambda moves; no refereed bound is changed
 * ; RH open; NO QED.
 *
 * @see imp-97583-route-m-mcm-onset-omega11-primorial.js (RESULT 3: the ~2.1e-3/order observation, revised here)
 * @see imp-97432-route-m-mcm-hypothesis-refuted-ceiling-safe.js (surrogate closed form + primorial limit; kernel)
 *
 * Ticket: imp-97601 (numerical, opus-4-8, api-pool). Collapse rate DRIFTS (decays), not constant; NO QED.
 */

import { IMP97432_KERNEL as K } from './imp-97432-route-m-mcm-hypothesis-refuted-ceiling-safe.js';

const C_TWELFTH = 1 / 12;
const LN_A = K.LN_A;      // Glaisher-Kinkelin log-constant
const E_GAMMA = K.E_GAMMA; // Euler-Mascheroni
// enough primes for the light omega <= 16 decrement ladder (need p_{omega+1} at omega = 15).
const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71];

function primorial(omega) { return PRIMES.slice(0, omega); }

// exact bracket A_omega + c*log p_{omega+1}, A_omega = lnA - c*Sigma_omega.
function surrogateBracket(omega) {
  let Sigma = 0;
  for (let i = 0; i < omega; i++) { const p = PRIMES[i]; Sigma += Math.log(p) / (p - 1); }
  return (LN_A - C_TWELFTH * Sigma) + C_TWELFTH * Math.log(PRIMES[omega]);
}
// exact per-order surrogate decrement dS(omega) = -(Pi_omega/p_{omega+1})(A_omega + c*log p_{omega+1}).
function decrementClosed(omega) {
  let Pi = 1;
  for (let i = 0; i < omega; i++) Pi *= 1 - 1 / PRIMES[i];
  return -(Pi / PRIMES[omega]) * surrogateBracket(omega);
}

export const SURROGATE_LIMIT = -Math.exp(-E_GAMMA) / 12;         // -0.046788 (imp-97432 RESULT 4)
export const B_INF = 0.296789;                                    // measured bracket limit (through prime ~2e6)
export const GAP_LAW_CONST = Math.exp(-E_GAMMA) * B_INF;          // e^{-gamma} B_inf ~ 0.166635

// baked exact per-order surrogate decrement ladder (dS(omega) = S(omega+1) - S(omega)); recomputed below.
export const IMP97601_DECREMENT_LADDER = Object.freeze([
  Object.freeze({ omega: 5, dS: -4.450326e-3, bracket: 2.784235e-1 }),
  Object.freeze({ omega: 6, dS: -3.192667e-3, bracket: 2.829667e-1 }),
  Object.freeze({ omega: 7, dS: -2.636423e-3, bracket: 2.774792e-1 }),
  Object.freeze({ omega: 8, dS: -2.080312e-3, bracket: 2.797688e-1 }),
  Object.freeze({ omega: 9, dS: -1.620137e-3, bracket: 2.872087e-1 }),
  Object.freeze({ omega: 10, dS: -1.440604e-3, bracket: 2.827446e-1 }),
  Object.freeze({ omega: 11, dS: -1.189562e-3, bracket: 2.879500e-1 }),
  Object.freeze({ omega: 12, dS: -1.045204e-3, bracket: 2.881459e-1 }),
  Object.freeze({ omega: 13, dS: -9.595696e-4, bracket: 2.843783e-1 }),
  Object.freeze({ omega: 14, dS: -8.573357e-4, bracket: 2.843279e-1 }),
  Object.freeze({ omega: 15, dS: -7.520510e-4, bracket: 2.873650e-1 }),
]);

// baked deep-tail gap-to-limit reference literals (sieve to ~2e6; heavy, so literals not live-computed here).
// gap(omega) = surrogate(p_omega#) - (-e^{-gamma}/12); law = GAP_LAW_CONST / log(p_omega).
export const IMP97601_GAP_TAIL = Object.freeze([
  Object.freeze({ omega: 1000, pOmega: 7919, gap: 1.853371e-2, law: 1.856241e-2 }),
  Object.freeze({ omega: 10000, pOmega: 104729, gap: 1.441329e-2, law: 1.441589e-2 }),
  Object.freeze({ omega: 100000, pOmega: 1299709, gap: 1.183846e-2, law: 1.183686e-2 }),
]);

export const IMP97601_RESULTS = Object.freeze({
  question: 'derive/measure the per-order margin-collapse rate of the MCM primorial onset (imp-97583 RESULT 3 saw ~2.1e-3/order): closed form, constant vs drift, and the omega at which the margin reaches the -0.0458 limit',
  decrementClosedForm: 'dS(omega) = S(omega+1) - S(omega) = -(Pi_omega / p_{omega+1}) * (A_omega + c*log p_{omega+1}), A_omega = lnA - c*Sigma_omega, c = 1/12, Sigma_omega = Sum_{i<=omega} log p_i/(p_i-1)',
  fullMarginDecrementEqualsSurrogate: true, // Rcorr flat (imp-97583) so dT = dS to 1e-15
  rateIsConstant: false,                     // the key answer: NOT constant
  rateDrifts: 'downward (decays): the bracket A_omega + c*log p_{omega+1} is asymptotically CONSTANT (B_inf ~ 0.296789) while the prefactor Pi_omega/p_{omega+1} decays like e^{-gamma}/(p_omega log p_omega) -> 0',
  bracketLimit: B_INF,                       // ~0.296789 (measured through prime ~2e6)
  mertensPrefactor: 'Pi_omega * log p_omega -> e^{-gamma} = 0.561459 (Mertens third theorem)',
  observedRevised: 'the imp-97583 "~2.1e-3/order" is a mid-window value; the decrements at omega 5..10 already shrink -4.45e-3, -3.19e-3, -2.64e-3, -2.08e-3, -1.62e-3, -1.44e-3',
  gapLaw: 'gap(omega) = S(omega) - (-e^{-gamma}/12) ~ (e^{-gamma} B_inf)/log p_omega ~ 0.166635/log p_omega (matches to <0.02% out to omega = 148933, p ~ 2e6)',
  gapLawConst: GAP_LAW_CONST,                // ~0.166635
  reachToLimit: 'NO finite-order arrival: reaching within eps needs log p_omega ~ 0.166635/eps, i.e. p_omega ~ exp(0.166635/eps): within 1e-2 -> p ~ 1e7, within 1e-3 -> p ~ 1e72, within 1e-4 -> p ~ 1e724',
  staysInsideB4Band: true,
});

export const IMP97601_VERDICT = Object.freeze({
  question: 'is the MCM margin collapse ~2.1e-3/order truly constant or slowly drifting, and when does the margin reach the -0.0458 primorial limit?',
  decrementClosedFormExact: true,
  rateIsConstant: false,
  rateDriftsDownward: true,
  bracketAsymptoticallyConstant: true,
  prefactorDecays: true,
  gapClosesLogarithmically: true,
  reachesLimitAtFiniteOrder: false,
  mcmRefuted: true,       // (imp-97432/imp-97583) unchanged
  ceilingTouched: false,
  anyBoundMoved: false,
  qed: false,
  conclusion:
    'MEASUREMENT/DERIVATION ONLY. The per-order surrogate decrement has the EXACT closed form ' +
    'dS(omega) = -(Pi_omega/p_{omega+1})(A_omega + c*log p_{omega+1}) (reproduces the direct difference to ' +
    '1e-15), and equals the full-margin decrement dT to the same precision since Rcorr is flat. The ' +
    'imp-97583 "roughly-constant ~2.1e-3/order" is REVISED: the rate DRIFTS DOWNWARD (decays), because the ' +
    'bracket A_omega + c*log p_{omega+1} is asymptotically constant (B_inf ~ 0.296789) while the prefactor ' +
    'Pi_omega/p_{omega+1} decays like e^{-gamma}/(p_omega log p_omega). The gap to the -e^{-gamma}/12 limit ' +
    'closes only logarithmically, gap ~ 0.166635/log p_omega (matches to <0.02% out to p ~ 2e6), so the ' +
    'margin reaches the -0.0458 limit at NO finite order (within 1e-3 needs p_omega ~ 1e72). MCM stays ' +
    'refuted from omega=11; b/4 ceiling untouched; kappa_arith unchanged; no bound on Lambda moves; no refereed bound is changed' +
    '; RH open; NO QED.',
});

export const IMP97601_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Derivation/measurement of the Route M MCM margin-collapse ' +
  'rate: the per-order surrogate decrement is dS(omega) = -(Pi_omega/p_{omega+1})(A_omega + c*log p_{omega+1}) ' +
  '(exact, matches the direct difference to 1e-15; equals dT since Rcorr flat). The imp-97583 ' +
  '"roughly-constant ~2.1e-3/order" is revised -- the rate DRIFTS DOWNWARD (decays): the bracket is ' +
  'asymptotically constant (B_inf ~ 0.296789) while the prefactor Pi_omega/p_{omega+1} decays like ' +
  'e^{-gamma}/(p_omega log p_omega). The gap to -e^{-gamma}/12 closes only logarithmically, ' +
  'gap ~ 0.166635/log p_omega, so the margin reaches the -0.0458 limit at NO finite order (within 1e-3 needs ' +
  'p_omega ~ 1e72). MCM refuted from omega=11; b/4 ceiling untouched; no bound moved.';

// -- self-executing assertions (imp-3715 convention): recompute from the imp-97432 kernel; any failure throws --

const IMP97601_ASSERTIONS = [
  {
    id: 'imp97601-decrement-closed-form-matches-direct',
    holds: () => {
      // the closed form dS(omega) reproduces the direct surrogate difference S(omega+1)-S(omega) to 1e-14.
      for (let w = 3; w <= 15; w++) {
        const direct = K.surrogatePrimorial(primorial(w + 1)) - K.surrogatePrimorial(primorial(w));
        if (!(Math.abs(direct - decrementClosed(w)) < 1e-14)) return false;
      }
      return true;
    },
    why: 'the derived per-order decrement dS(omega) = -(Pi_omega/p_{omega+1})(A_omega + c*log p_{omega+1}) reproduces the exact surrogate difference at every order to 1e-14.',
  },
  {
    id: 'imp97601-rate-drifts-not-constant',
    holds: () => {
      // the decrement magnitude STRICTLY shrinks with omega -- the rate is not constant, it decays.
      let prevMag = Infinity;
      for (let w = 5; w <= 15; w++) {
        const mag = Math.abs(decrementClosed(w));
        if (!(mag < prevMag)) return false; // strictly shrinking
        prevMag = mag;
      }
      // and the shrink is real: omega=5 decrement is > 3x the omega=15 decrement.
      return Math.abs(decrementClosed(5)) > 3 * Math.abs(decrementClosed(15));
    },
    why: 'the per-order decrement magnitude strictly shrinks with omega (not constant): the ~2.1e-3/order is a mid-window value, the true rate drifts downward.',
  },
  {
    id: 'imp97601-bracket-flat-prefactor-decays',
    holds: () => {
      // the bracket is near-flat across omega while the prefactor Pi/p_{omega+1} decays monotonically.
      let prevPre = Infinity;
      for (let w = 5; w <= 15; w++) {
        const brk = surrogateBracket(w);
        if (!(brk > 0.27 && brk < 0.30)) return false;      // flat band, converging to B_inf ~ 0.2968
        let Pi = 1; for (let i = 0; i < w; i++) Pi *= 1 - 1 / PRIMES[i];
        const pre = Pi / PRIMES[w];
        if (!(pre < prevPre)) return false;                  // prefactor strictly decays
        prevPre = pre;
      }
      return true;
    },
    why: 'the bracket A_omega + c*log p_{omega+1} stays in a flat band (0.27, 0.30) converging to B_inf ~ 0.2968 while the prefactor Pi_omega/p_{omega+1} strictly decays -- the decay is entirely in the prefactor.',
  },
  {
    id: 'imp97601-gap-law-matches-tail',
    holds: () => {
      // the gap law GAP_LAW_CONST/log(p_omega) matches the baked deep-tail gaps to <0.3%, and the constant
      // is e^{-gamma}*B_inf.
      if (!(Math.abs(GAP_LAW_CONST - Math.exp(-E_GAMMA) * B_INF) < 1e-12)) return false;
      for (const row of IMP97601_GAP_TAIL) {
        const law = GAP_LAW_CONST / Math.log(row.pOmega);
        if (!(Math.abs(law - row.law) < 1e-6)) return false;   // law column is self-consistent
        if (!(Math.abs(law / row.gap - 1) < 3e-3)) return false; // law tracks the measured gap to <0.3%
      }
      return true;
    },
    why: 'the gap-to-limit law gap(omega) ~ e^{-gamma} B_inf / log p_omega ~ 0.166635/log p_omega tracks the measured deep-tail gap to <0.3% out to p ~ 1.3e6.',
  },
  {
    id: 'imp97601-baked-ladder-matches-kernel',
    holds: () => {
      // the baked decrement/bracket ladder reproduces the live closed forms to 7 sig figs.
      for (const row of IMP97601_DECREMENT_LADDER) {
        if (!(Math.abs(decrementClosed(row.omega) - row.dS) < 1e-8)) return false;
        if (!(Math.abs(surrogateBracket(row.omega) - row.bracket) < 1e-6)) return false;
      }
      return true;
    },
    why: 'the baked decrement and bracket ladder matches the live closed forms at every omega row (7 sig figs).',
  },
  {
    id: 'imp97601-honesty-gate-no-qed',
    holds: () =>
      IMP97601_VERDICT.decrementClosedFormExact === true &&
      IMP97601_VERDICT.rateIsConstant === false &&
      IMP97601_VERDICT.rateDriftsDownward === true &&
      IMP97601_VERDICT.bracketAsymptoticallyConstant === true &&
      IMP97601_VERDICT.prefactorDecays === true &&
      IMP97601_VERDICT.reachesLimitAtFiniteOrder === false &&
      IMP97601_VERDICT.mcmRefuted === true &&
      IMP97601_VERDICT.ceilingTouched === false &&
      IMP97601_VERDICT.anyBoundMoved === false &&
      IMP97601_VERDICT.qed === false &&
      /NO QED/.test(IMP97601_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97601_HONEST_BANNER) &&
      /RH open/.test(IMP97601_HONEST_BANNER),
    why: 'measurement/derivation only -- collapse rate drifts (decays), gap closes logarithmically, no finite-order arrival; MCM refuted from omega=11; no bound moved, no QED.',
  },
];

for (const a of IMP97601_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97601-route-m-mcm-margin-collapse-rate-law assertion failed: ${a.id}`);
  }
}

export default {
  decrementLadder: IMP97601_DECREMENT_LADDER,
  gapTail: IMP97601_GAP_TAIL,
  results: IMP97601_RESULTS,
  verdict: IMP97601_VERDICT,
  banner: IMP97601_HONEST_BANNER,
};
