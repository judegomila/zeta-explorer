/**
 * @module imp-97639-route-m-mcm-binf-deep-mertens-crosscheck
 *
 * imp-97639 (accuracy -- INDEPENDENT CROSS-VALIDATION ONLY; MCM stays refuted from omega=11; NO QED).
 *
 * imp-97619 RESULT 1 derived the Route M MCM bracket limit in closed form
 *     B_inf = lnA + gamma/12 = 0.2968557824,   bracket(omega) = lnA + (1/12)*M_omega,
 *     M_omega = log p_{omega+1} - Sigma_omega,  Sigma_omega = Sum_{i<=omega} log p_i/(p_i - 1),
 * with lim M_omega = gamma (Mertens-type: Sum_{n<=x} Lambda(n)/n = log x - gamma + o(1)), and reported the
 * imp-97601 measured 0.296789 as the finite-height (p ~ 2e6, omega = 148933) value approaching from below.
 *
 * This leaf INDEPENDENTLY recomputes the bracket by a fresh Sieve-of-Eratosthenes Mertens sum to
 * N = 5e7 (25x deeper than the imp-97619 ladder top, ~3.0e6 primes; script
 * tmp/imp-97639-deep-mertens-bracket.py), to stress-test the two RESULT-1 claims: (i) monotone approach to
 * 0.2968557824 from below, and (ii) the derived gap-law constant e^{-gamma}*(lnA + gamma/12) = 0.16667249.
 *
 * -------------------------------------------------------------------------------
 * FINDING 1 -- APPROACH FROM BELOW is CONFIRMED at 25x deeper height.
 * -------------------------------------------------------------------------------
 * Every recomputed bracket out to p ~ 5e7 stays STRICTLY BELOW the derived limit B_inf = 0.2968557824; the
 * shortfall B_inf - bracket stays positive (range ~1.2e-5 .. 6.7e-5) and never crosses zero. The
 * independent p ~ 2e6 checkpoint reproduces the imp-97619 baked bracket 0.296788637 to < 5e-7 (the ~4e-7
 * residual is the log p_omega vs log p_{omega+1} choice in M_omega, which shares the same limit). The
 * closed form is not exceeded anywhere in the extended range.
 *
 * -------------------------------------------------------------------------------
 * FINDING 2 (HONEST NUANCE) -- strict monotonicity is NOT clean in the fine deep tail.
 * -------------------------------------------------------------------------------
 * At fine (non-decade) checkpoint spacing the bracket does NOT increase monotonically: it dips from
 * 0.2968437280 (p ~ 1.5e7) to 0.2968382204 (p ~ 3.2e7) before rising to 0.2968413461 (p ~ 5e7). The
 * undershoot delta = gamma - M_omega behaves like the PNT/Mertens error term (imp-97619 RESULT 3 sub-gap
 * IMP97619_GAP_LAW_NEXT_ORDER_IS_PNT_ERROR_NOT_ELEMENTARY), so it FLUCTUATES rather than decreasing
 * smoothly. The imp-97619 decade-spaced ladder (omega = 100, 1000, ..., 148933) was monotone only because
 * of coarse checkpoint spacing; the true approach carries PNT-strength wiggle. This REFINES (does not
 * refute) imp-97619: "approach from below" holds, "strictly monotone" is a coarse-grid artifact.
 *
 * -------------------------------------------------------------------------------
 * FINDING 3 -- the gap-law constant is refined toward the closed form from below.
 * -------------------------------------------------------------------------------
 * e^{-gamma}*bracket rises from 0.166635 (imp-97601, p ~ 2e6) toward the derived 0.16667249; the deepest
 * recomputed value (p ~ 5e7) is 0.16666439, still below the closed-form limit and approaching from below,
 * consistent with e^{-gamma}*(lnA + gamma/12) being the true leading constant.
 *
 * VERDICT. CROSS-VALIDATION ONLY. The imp-97619 closed form B_inf = lnA + gamma/12 = 0.2968557824 and its
 * approach-from-below are CONFIRMED at 25x deeper prime height; the gap-law constant 0.16667249 is
 * confirmed as the from-below limit. The one honest correction: the finite-height approach is
 * non-monotone at fine resolution (PNT/Mertens wiggle), so only "from below" -- not "strictly monotone" --
 * survives deeper sampling. MCM stays refuted from omega=11; b/4 ceiling untouched; kappa_arith unchanged;
 * no bound on Lambda moves; PT Lambda <= 0.2 SOTA; RH open; NO QED.
 *
 * @see imp-97619-route-m-mcm-binf-mertens-closed-form.js (closed form B_inf = lnA + gamma/12; measured from below)
 * @see imp-97601-route-m-mcm-margin-collapse-rate-law.js (B_inf ~ 0.296789 measured; gap ~ 0.166635/log p)
 *
 * Ticket: imp-97639 (accuracy, opus-4-8, api-pool). Deep-Mertens cross-check of B_inf; NO QED.
 */

// Constants baked as literals (import-light; no heavy transitive imports -- imp-2546/heavy-import rule).
const LN_A = 0.2487544770337842;          // Glaisher-Kinkelin log-constant = 1/12 - zeta-prime(-1)
const GAMMA = 0.5772156649015329;         // Euler-Mascheroni
const E_NEG_GAMMA = Math.exp(-GAMMA);     // e^{-gamma} = 0.561459...

export const IMP97639_B_INF_DERIVED = LN_A + GAMMA / 12; // 0.2968557824422453 (imp-97619 closed form)
export const IMP97639_GAP_CONST_DERIVED = E_NEG_GAMMA * IMP97639_B_INF_DERIVED; // 0.16667249
export const IMP97639_MEASURED_GAP_CONST_2E6 = 0.166635; // imp-97601 finite-height gap const at p ~ 2e6

// Independently sieved deep ladder (bracket = lnA + M/12, M = log p_{omega+1} - Sum log p_i/(p_i-1)),
// recomputed to N = 5e7 by tmp/imp-97639-deep-mertens-bracket.py. shortfall = B_inf - bracket; delta = gamma - M.
export const IMP97639_DEEP_LADDER = Object.freeze([
  Object.freeze({ omega: 148933, pOmega: 1999993, pNext: 2000003, M: 0.576414917, bracket: 0.2967890535, shortfall: 6.673e-5, delta: 8.007e-4 }),
  Object.freeze({ omega: 200000, pOmega: 2750159, pNext: 2750161, M: 0.576705119, bracket: 0.2968132370, shortfall: 4.255e-5, delta: 5.105e-4 }),
  Object.freeze({ omega: 500000, pOmega: 7368787, pNext: 7368791, M: 0.576759296, bracket: 0.2968177517, shortfall: 3.803e-5, delta: 4.564e-4 }),
  Object.freeze({ omega: 1000000, pOmega: 15485863, pNext: 15485867, M: 0.577071011, bracket: 0.2968437280, shortfall: 1.205e-5, delta: 1.447e-4 }),
  Object.freeze({ omega: 2000000, pOmega: 32452843, pNext: 32452867, M: 0.577004920, bracket: 0.2968382204, shortfall: 1.756e-5, delta: 2.107e-4 }),
  Object.freeze({ omega: 3000000, pOmega: 49979687, pNext: 49979693, M: 0.577042429, bracket: 0.2968413461, shortfall: 1.444e-5, delta: 1.732e-4 }),
]);

export const IMP97639_RESULTS = Object.freeze({
  question: 'independently cross-validate the imp-97619 closed form B_inf = lnA + gamma/12 = 0.2968557824 at deeper prime height and confirm the from-below approach and the derived gap-law constant',
  sieveBound: 5e7,                          // 25x deeper than the imp-97619 ladder top (p ~ 2e6)
  approachFromBelowConfirmed: true,         // every bracket < B_inf out to p ~ 5e7
  strictlyMonotone: false,                  // HONEST: fine-tail bracket dips (PNT/Mertens wiggle) then rises
  monotoneWasCoarseGridArtifact: true,      // imp-97619 decade ladder monotone only from coarse spacing
  reproduces2e6Checkpoint: 'independent p ~ 2e6 bracket 0.2967890535 matches imp-97619 baked 0.296788637 to < 5e-7',
  gapConstApproachesDerivedFromBelow: true, // e^-gamma*bracket rises 0.166635 -> 0.16666439 -> 0.16667249
  gapConstDerived: IMP97639_GAP_CONST_DERIVED, // 0.16667249
  gapConstDeepest: E_NEG_GAMMA * 0.2968413461, // 0.16666439 at p ~ 5e7
  nextOrderIsPntError: true,                // consistent with imp-97619 sub-gap
  subGap: 'IMP97619_GAP_LAW_NEXT_ORDER_IS_PNT_ERROR_NOT_ELEMENTARY',
});

export const IMP97639_VERDICT = Object.freeze({
  question: 'does the imp-97619 closed form B_inf = lnA + gamma/12 survive an independent deeper Mertens recompute, and is the approach monotone from below?',
  closedFormConfirmed: true,                // B_inf = lnA + gamma/12 not exceeded to p ~ 5e7
  approachFromBelowConfirmed: true,
  strictlyMonotoneConfirmed: false,         // only from-below survives; monotone fails at fine resolution
  gapConstConfirmed: true,                  // 0.16667249 as the from-below limit
  mcmRefuted: true,                         // (imp-97432/imp-97583) unchanged
  ceilingTouched: false,
  anyBoundMoved: false,
  qed: false,
  conclusion:
    'CROSS-VALIDATION ONLY. An independent Sieve-of-Eratosthenes Mertens recompute to N = 5e7 (25x deeper ' +
    'than the imp-97619 p ~ 2e6 ladder) CONFIRMS the closed form B_inf = lnA + gamma/12 = 0.2968557824 and ' +
    'its approach from below: every bracket stays strictly below the limit and the p ~ 2e6 checkpoint ' +
    'reproduces the baked 0.296788637 to < 5e-7. The gap-law constant e^{-gamma}*(lnA + gamma/12) = ' +
    '0.16667249 is confirmed as the from-below limit (0.166635 -> 0.16666439 -> 0.16667249). HONEST ' +
    'correction: the finite-height approach is NON-monotone at fine resolution (bracket dips at p ~ 3.2e7 ' +
    'then rises), a PNT/Mertens wiggle -- imp-97619 "strictly monotone" was a coarse decade-grid artifact; ' +
    'only "from below" survives. MCM stays refuted from omega=11; b/4 ceiling untouched; kappa_arith ' +
    'unchanged; no bound on Lambda moves; PT Lambda <= 0.2 SOTA; RH open; NO QED.',
});

export const IMP97639_HONEST_BANNER =
  'RH open; PT Lambda <= 0.2 remains SOTA; NO QED. Independent deeper-Mertens cross-check (N = 5e7, 25x ' +
  'deeper than p ~ 2e6): the imp-97619 closed form B_inf = lnA + gamma/12 = 0.2968557824 and its approach ' +
  'from below are CONFIRMED; the gap-law constant e^{-gamma}*(lnA + gamma/12) = 0.16667249 is the from-below ' +
  'limit. HONEST correction: the approach is NON-monotone at fine resolution (PNT/Mertens wiggle) -- only ' +
  'from below, not strictly monotone, survives deeper sampling. MCM refuted from omega=11; no bound moved.';

// -- self-executing assertions (imp-3715 convention): recompute; any failure throws --

const IMP97639_ASSERTIONS = [
  {
    id: 'imp97639-binf-closed-form-reproduced',
    holds: () =>
      Math.abs(IMP97639_B_INF_DERIVED - (LN_A + GAMMA / 12)) < 1e-15 &&
      Math.abs(IMP97639_B_INF_DERIVED - 0.2968557824422453) < 1e-12,
    why: 'the derived limit B_inf = lnA + gamma/12 = 0.2968557824 is reproduced from the primitive constants.',
  },
  {
    id: 'imp97639-deep-ladder-approach-from-below',
    holds: () => {
      for (const row of IMP97639_DEEP_LADDER) {
        if (!(row.bracket < IMP97639_B_INF_DERIVED)) return false;    // strictly below the limit
        if (!(row.shortfall > 0)) return false;                       // positive shortfall (from below)
        // internal consistency bracket = lnA + M/12 (7-sig-fig literals -> allow 1e-6)
        if (!(Math.abs((LN_A + row.M / 12) - row.bracket) < 1e-6)) return false;
        // shortfall bookkeeping (catastrophic-cancellation of stored literals -> allow 1e-6)
        if (!(Math.abs((IMP97639_B_INF_DERIVED - row.bracket) - row.shortfall) < 1e-6)) return false;
      }
      return true;
    },
    why: 'every independently sieved bracket to p ~ 5e7 stays strictly below B_inf with a positive shortfall -- approach from below confirmed 25x deeper than the imp-97619 ladder.',
  },
  {
    id: 'imp97639-deep-ladder-reproduces-2e6-checkpoint',
    holds: () => {
      const at2e6 = IMP97639_DEEP_LADDER[0];
      // independent recompute matches the imp-97619 baked bracket 0.296788637 to < 5e-7.
      return at2e6.omega === 148933 && Math.abs(at2e6.bracket - 0.296788637) < 5e-7;
    },
    why: 'the independent p ~ 2e6 checkpoint reproduces the imp-97619 baked bracket 0.296788637 to < 5e-7 (residual = log p_omega vs log p_{omega+1} in M).',
  },
  {
    id: 'imp97639-honest-nonmonotone-fine-tail',
    holds: () => {
      // HONEST: there is at least one consecutive pair where the bracket DECREASES (PNT/Mertens wiggle),
      // so the finite-height approach is not strictly monotone at fine resolution.
      let sawDip = false;
      for (let i = 1; i < IMP97639_DEEP_LADDER.length; i++) {
        if (IMP97639_DEEP_LADDER[i].bracket < IMP97639_DEEP_LADDER[i - 1].bracket) sawDip = true;
      }
      return sawDip && IMP97639_VERDICT.strictlyMonotoneConfirmed === false;
    },
    why: 'the fine deep tail contains a bracket dip (0.2968437 at p ~ 1.5e7 -> 0.2968382 at p ~ 3.2e7), so only from-below -- not strict monotonicity -- survives deeper sampling.',
  },
  {
    id: 'imp97639-gap-const-approaches-derived-from-below',
    holds: () => {
      const derived = IMP97639_GAP_CONST_DERIVED;
      const deepest = E_NEG_GAMMA * IMP97639_DEEP_LADDER[IMP97639_DEEP_LADDER.length - 1].bracket;
      // deepest e^-gamma*bracket lies strictly between the p ~ 2e6 measured 0.166635 and the derived 0.16667249.
      return Math.abs(derived - 0.16667249) < 1e-6 &&
             deepest > IMP97639_MEASURED_GAP_CONST_2E6 &&
             deepest < derived;
    },
    why: 'e^-gamma*bracket rises from 0.166635 (p ~ 2e6) to 0.16666439 (p ~ 5e7), still below and approaching the derived 0.16667249 from below.',
  },
  {
    id: 'imp97639-honesty-gate-no-qed',
    holds: () =>
      IMP97639_VERDICT.closedFormConfirmed === true &&
      IMP97639_VERDICT.approachFromBelowConfirmed === true &&
      IMP97639_VERDICT.strictlyMonotoneConfirmed === false &&
      IMP97639_VERDICT.gapConstConfirmed === true &&
      IMP97639_VERDICT.mcmRefuted === true &&
      IMP97639_VERDICT.ceilingTouched === false &&
      IMP97639_VERDICT.anyBoundMoved === false &&
      IMP97639_VERDICT.qed === false &&
      /NO QED/.test(IMP97639_HONEST_BANNER) &&
      /PT Lambda <= 0.2/.test(IMP97639_HONEST_BANNER) &&
      /RH open/.test(IMP97639_HONEST_BANNER),
    why: 'cross-validation only -- closed form and from-below approach confirmed, strict monotonicity corrected; MCM refuted from omega=11; no bound moved, no QED.',
  },
];

for (const a of IMP97639_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97639-route-m-mcm-binf-deep-mertens-crosscheck assertion failed: ${a.id}`);
  }
}

export default {
  deepLadder: IMP97639_DEEP_LADDER,
  results: IMP97639_RESULTS,
  verdict: IMP97639_VERDICT,
  banner: IMP97639_HONEST_BANNER,
};
