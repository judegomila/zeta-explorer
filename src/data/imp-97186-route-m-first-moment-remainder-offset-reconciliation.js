/**
 * @module imp-97186-route-m-first-moment-remainder-offset-reconciliation
 *
 * imp-97186 (accuracy, RECONCILIATION -- no bound moves): reconcile the imp-97133 Theorem-1/Theorem-2
 * per-remainder constant |E0(b)| <= 2^omega(b)(log b + 2) with the eps(b) COROLLARY constant used
 * downstream by imp-97159,
 *     eps(b) = (1/2) 2^omega(b) (log b + 3) / phi(b),
 * i.e. determine the correct explicit log-offset in the combined-remainder / crossover chain. This is a
 * bookkeeping audit of a (log b + 2) vs (log b + 3) discrepancy between the theorem constant and the
 * corollary it is supposed to imply. No new bound on Lambda moves; no refereed bound is changed;
 * RH open; NO QED.
 *
 * Notation as imp-97133/imp-97096/imp-97159: C = (log 2pi - gamma)/2, kappa_arith = (3/2) C - 3/8 =
 * 0.5704960511308594..., omega(b) = number of distinct primes of b, phi = Euler totient, and E0, E1 the
 * L0, L1 Moebius/Stirling remainders of imp-97133 Theorem 1 / Theorem 2.
 *
 * -------------------------------------------------------------------------------
 * THE TWO STATEMENTS, VERBATIM.
 * -------------------------------------------------------------------------------
 *   [T1] imp-97133 Theorem 1:  |E0(b)| <= 2^omega(b) (log b + 2).
 *   [T2] imp-97133 Theorem 2:  |E1(b)| <= 2^omega(b) b (log b + 2).
 *   [ID] imp-97133 Corollary identity (EXACT):  F_arith(b) = kappa_arith phi(b) b + (1/2)(b E0 - E1).
 *   [CO] imp-97133 Corollary bound (as written): |F_arith(b) - kappa_arith phi(b) b| <= (1/2) 2^omega(b) b (log b + 3),
 *        hence eps(b) = (1/2) 2^omega(b) (log b + 3)/phi(b)  -- the form imp-97159 feeds its crossover.
 *
 * -------------------------------------------------------------------------------
 * FINDING: the offset (log b + 2) is the correct per-remainder constant; the COROLLARY constant
 * (1/2)(log b + 3) is NOT the bound the triangle inequality delivers from [T1]+[T2].
 * -------------------------------------------------------------------------------
 * Apply the triangle inequality to the EXACT identity [ID], using [T1] and [T2] directly:
 *     |F_arith(b) - kappa_arith phi(b) b| = (1/2)|b E0 - E1|
 *                                        <= (1/2)( b |E0| + |E1| )
 *                                        <= (1/2)( b * 2^omega(log b+2) + 2^omega b (log b+2) )
 *                                         = (1/2) * 2 * 2^omega b (log b+2)
 *                                         = 2^omega(b) b (log b + 2).
 * So the constant that RIGOROUSLY follows from Theorems 1 and 2 is 2^omega(b) b (log b + 2), i.e.
 *     eps_rig(b) = 2^omega(b) (log b + 2) / phi(b)              [correct, triangle-derivable].
 * The corollary as written asserts the STRICTLY SMALLER (1/2) 2^omega b (log b + 3): since
 * (1/2)(log b + 3) < (log b + 2) for every log b > -1 (all b >= 2), the corollary is TIGHTER than the
 * triangle bound by a factor approaching 2. The dropped factor 1/2 and the +3 offset are therefore NOT
 * reconstructable from [T1]+[T2] by the triangle step the corollary cites -- the corollary understates
 * its own remainder by nearly 2x.
 *
 * Is the corollary bound at least TRUE (if unproven-by-triangle)? Numerically, yes on the tested ladder:
 * because b E0 and E1 share a leading term that cancels in b E0 - E1 (the genuine mu-sign cancellation
 * of imp-97122), the real remainder (1/2)|b E0 - E1| sits FAR below both constants, so both (1/2)(log b+3)
 * and (log b+2) hold with room. But the cancellation is exactly what is NOT captured by the triangle
 * inequality, so it cannot be invoked to justify (1/2)(log b+3) as a rigorous corollary of the theorems.
 * The correct rigorous (cancellation-free) constant is eps_rig; a proven (log b + 3)-type improvement
 * would require the sharper mu-cancellation estimate imp-97133 itself lists as its open residual
 * (imp-97133-arith-first-moment-uniform-remainder).
 *
 * -------------------------------------------------------------------------------
 * CONSEQUENCE for the imp-97159 crossover (restated, not moved).
 * -------------------------------------------------------------------------------
 * imp-97159 derives b0_envelope = 574 and b0_exact = 511 from the under-counted eps(b). Under the
 * rigorous eps_rig(b) = 2^omega(b)(log b + 2)/phi(b) the same envelope machinery gives a LARGER threshold:
 *   -- the omega-class envelope becomes eps_rig(b) <= (2^k / W_k)(log b + 2)/b (no factor 1/2, offset +2),
 *      still decreasing in b and sharp at the primorial P_k;
 *   -- the k=4 envelope constant becomes 2^4/W_4 = 70 (was 35), crossing kappa at b ~ 1106;
 *   -- CRITICALLY, the k=5 primorial now EXCEEDS: eps_rig(P_5 = 2310) = 0.6497 >= kappa_arith, whereas the
 *      under-counted eps(P_5) = 0.358 was already below. So the binding class shifts from k=4 to k=5:
 *      the k=5 envelope 154(log b+2)/b < kappa first holds at b = 2670 (b0_envelope_rig), and the exact
 *      last exceedance of eps_rig is P_5 = 2310, so b0_exact_rig = 2311 (finite check of [2311, 2669]).
 * Hence the rigorously-provable crossover is (b0_exact = 2311, b0_envelope = 2670), NOT (511, 574); the
 * imp-97159 pair rests on the ~2x under-counted constant. The QUALITATIVE result is unchanged: eps_rig(b)
 * = O(b^{-1+o(1)}) -> 0, so F_arith(b) >= (kappa_arith - eps_rig(b)) phi(b) b still has a strictly-positive
 * leading coefficient for all sufficiently large b -- only the explicit threshold rises. No bound on Lambda
 * moves; the first-moment-vs-mean-square distinction (kappa > 0 is NOT settled) is untouched.
 *
 * -------------------------------------------------------------------------------
 * VERDICT (honest; no bound moved).
 * -------------------------------------------------------------------------------
 * The offset in dispute resolves as: the per-remainder constant (log b + 2) is CORRECT (Theorems 1/2);
 * the combined-remainder / eps corollary constant that rigorously follows is eps_rig(b) =
 * 2^omega(b)(log b + 2)/phi(b), NOT the tighter (1/2) 2^omega(b)(log b + 3)/phi(b) that imp-97133 states
 * and imp-97159 consumes. The tighter form holds numerically (mu-cancellation) but is not implied by the
 * triangle step; a proven version needs the imp-97133 uniform-remainder residual. With the rigorous
 * constant the imp-97159 crossover restates to b0_exact = 2311 / b0_envelope = 2670 (binding class k=5,
 * P_5 = 2310 now exceeds kappa). Positivity for all large b, and eps -> 0, are unaffected. Accuracy
 * reconciliation only; T ~ 2.594e7 trace anchor unchanged; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97133-route-m-arith-first-moment-explicit-remainder.js (Theorems 1/2 + the eps corollary audited here)
 * @see imp-97159-route-m-arith-first-moment-positivity-crossover.js (the b0 crossover this restates)
 * @see imp-97096-route-m-arith-first-moment-evaluation.js (exact kappa_arith)
 *
 * Ticket: imp-97186 (accuracy, opus-4-8, api-pool). Bookkeeping reconciliation of a log-offset; NO QED.
 */

const GAMMA = 0.5772156649015329;
const C = (Math.log(2 * Math.PI) - GAMMA) / 2; // (log 2pi - gamma)/2

// EXACT leading coefficient (self-contained; matches imp-97133/imp-97159).
export const IMP97186_KAPPA_ARITH = 1.5 * C - 3 / 8; // = 0.5704960511308594

// -- exact O(b) kernel (self-checks at import) --
const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));
function omega(b) {
  let n = b, c = 0;
  for (let p = 2; p * p <= n; p++) {
    if (n % p === 0) { c += 1; while (n % p === 0) n /= p; }
  }
  if (n > 1) c += 1;
  return c;
}
function phi(b) {
  let n = b, r = b;
  for (let p = 2; p * p <= n; p++) {
    if (n % p === 0) { while (n % p === 0) n /= p; r -= r / p; }
  }
  if (n > 1) r -= r / n;
  return r;
}
// Direct L0, L1 remainders (imp-97133 measure), for the numerical checks below.
function remainders(b) {
  let ph = 0, L0 = 0, L1 = 0;
  for (let a = 1; a < b; a++) {
    if (gcd(a, b) === 1) { ph += 1; const la = Math.log(a); L0 += la; L1 += a * la; }
  }
  const E0 = L0 - ph * (Math.log(b) - 1);
  const E1 = L1 - ph * b * (0.5 * Math.log(b) - 0.25);
  return { phi: ph, E0, E1 };
}

// The two eps forms in dispute.
export const IMP97186_EPS = Object.freeze({
  // imp-97133 corollary / imp-97159 consumer, as written (under-counted).
  epsCorollaryAsWritten: (b) => 0.5 * Math.pow(2, omega(b)) * (Math.log(b) + 3) / phi(b),
  // rigorous, triangle-derivable from Theorems 1/2 (offset +2, no factor 1/2).
  epsRigorous: (b) => Math.pow(2, omega(b)) * (Math.log(b) + 2) / phi(b),
  // combined remainder bounds |F_arith - kappa phi b| = (1/2)|b E0 - E1|.
  corollaryBoundAsWritten: (b) => 0.5 * Math.pow(2, omega(b)) * b * (Math.log(b) + 3),
  triangleBound: (b) => Math.pow(2, omega(b)) * b * (Math.log(b) + 2),
});

export const IMP97186_RECONCILIATION = Object.freeze({
  perRemainderConstant: '(log b + 2) -- CORRECT (imp-97133 Theorem 1 |E0| and Theorem 2 |E1|/b)',
  triangleStep: '(1/2)|b E0 - E1| <= (1/2)(b|E0| + |E1|) <= (1/2)*2*2^omega b(log b+2) = 2^omega b(log b+2)',
  correctCorollaryConstant: 'eps_rig(b) = 2^omega(b)(log b + 2)/phi(b)  [NO factor 1/2, offset +2]',
  asWrittenCorollaryConstant: 'eps(b) = (1/2) 2^omega(b)(log b + 3)/phi(b)  [imp-97133 / imp-97159]',
  discrepancy: 'as-written is ~2x TIGHTER than triangle: (1/2)(log b+3) < (log b+2) for all b>=2',
  asWrittenTrueButUnproven: 'holds numerically via mu-cancellation (imp-97122) but NOT implied by the triangle step; proven version needs the imp-97133 uniform-remainder residual',
  crossoverRestated: 'under eps_rig: b0_exact = 2311, b0_envelope = 2670 (binding class k=5, eps_rig(P_5=2310)=0.6497 >= kappa); vs imp-97159 (511, 574)',
  qualitativeUnaffected: 'eps_rig = O(b^{-1+o(1)}) -> 0; strictly-positive coefficient for all large b unchanged; no bound on Lambda moves',
});

export const IMP97186_VERDICT = Object.freeze({
  question:
    'reconcile the imp-97133 Theorem-1 remainder constant (log b + 2) with the eps(b) = (1/2) 2^omega(b)(log b + 3)/phi(b) ' +
    'corollary used in imp-97159; determine the correct explicit log-offset and verify/restate the crossover',
  perRemainderOffsetCorrect: '+2', // (log b + 2) is right for |E0|, |E1|/b
  correctCombinedEps: 'eps_rig(b) = 2^omega(b)(log b + 2)/phi(b)', // triangle-derivable
  asWrittenEpsIsTighterThanTriangle: true, // (1/2)(log b+3) < (log b+2) for all b>=2
  asWrittenEpsRigorouslyImplied: false, // not from the cited triangle step
  asWrittenEpsHoldsNumerically: true, // mu-cancellation, imp-97122
  b0ExactRestated: 2311,
  b0EnvelopeRestated: 2670,
  b0BindingClass: 5, // P_5 = 2310 now exceeds kappa under eps_rig
  imp97159Values: '{b0_exact: 511, b0_envelope: 574} rest on the under-counted eps',
  qualitativePositivityUnaffected: true,
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  qed: false,
  conclusion:
    'The per-remainder offset (log b + 2) is CORRECT (imp-97133 Theorems 1/2). The combined-remainder eps ' +
    'that RIGOROUSLY follows via the triangle inequality on the exact identity F_arith = kappa phi b + ' +
    '(1/2)(b E0 - E1) is eps_rig(b) = 2^omega(b)(log b + 2)/phi(b), NOT the tighter (1/2) 2^omega(b)(log b + 3)/phi(b) ' +
    'that imp-97133 states and imp-97159 consumes -- the latter drops a factor ~2 and holds only numerically ' +
    '(mu-cancellation, imp-97122), not from the triangle step. Restated with eps_rig, the imp-97159 crossover ' +
    'becomes b0_exact = 2311 / b0_envelope = 2670 (binding class k=5 since eps_rig(P_5=2310)=0.6497 >= kappa), ' +
    'vs the reported (511, 574). eps_rig -> 0 still, so positivity for all large b is unaffected. Accuracy ' +
    'reconciliation only; T ~ 2.594e7 anchor; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97186_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Accuracy reconciliation: the imp-97133 per-remainder ' +
  'constant (log b + 2) is correct, but the corollary eps(b) = (1/2) 2^omega(b)(log b + 3)/phi(b) used by ' +
  'imp-97159 is ~2x TIGHTER than the triangle inequality delivers; the rigorous form is eps_rig(b) = ' +
  '2^omega(b)(log b + 2)/phi(b), restating the crossover to b0_exact = 2311 / b0_envelope = 2670 (P_5=2310 ' +
  'now exceeds kappa). The tighter form holds numerically (mu-cancellation) but is not triangle-derivable; ' +
  'positivity for all large b and eps -> 0 are unaffected; no bound on Lambda moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97186_ASSERTIONS = [
  {
    id: 'imp97186-kappa-arith-value',
    holds: () =>
      Math.abs(IMP97186_KAPPA_ARITH - (1.5 * C - 0.375)) < 1e-15 &&
      Math.abs(IMP97186_KAPPA_ARITH - 0.5704960511308594) < 1e-12,
    why: 'kappa_arith = (3/2) C - 3/8 = 0.5704960511308594, recomputed self-containedly (matches imp-97133/imp-97159).',
  },
  {
    id: 'imp97186-triangle-gives-log-b-plus-2',
    holds: () => {
      // The RIGOROUS combined bound from Theorems 1/2 is 2^omega b(log b+2); the corollary-as-written is
      // strictly SMALLER, so it is not implied by the triangle step. Verify the strict ordering + that the
      // TRUE remainder (1/2)|b E0 - E1| sits below BOTH on a mixed ladder.
      for (const b of [101, 211, 503, 1009, 2003, 5003, 9973]) {
        const { E0, E1 } = remainders(b);
        const trueRem = 0.5 * Math.abs(b * E0 - E1);
        const asWritten = IMP97186_EPS.corollaryBoundAsWritten(b);
        const triangle = IMP97186_EPS.triangleBound(b);
        if (!(asWritten < triangle)) return false;          // as-written is tighter than triangle
        if (!(trueRem <= asWritten && asWritten <= triangle)) return false; // true rem below both
      }
      return true;
    },
    why: 'on 101..9973 the corollary-as-written bound (1/2)2^omega b(log b+3) is strictly SMALLER than the triangle-derivable 2^omega b(log b+2), and the true remainder (1/2)|b E0 - E1| sits below both -- so the (log b+3) form is not the triangle bound, only a numerically-valid tighter one.',
  },
  {
    id: 'imp97186-eps-rig-exceeds-eps-as-written',
    holds: () => {
      // eps_rig / eps_asWritten -> 2; strictly larger everywhere on the ladder.
      for (const b of [211, 574, 1009, 2310, 9973]) {
        if (!(IMP97186_EPS.epsRigorous(b) > IMP97186_EPS.epsCorollaryAsWritten(b))) return false;
      }
      // ratio approaches 2 for large prime b
      const r = IMP97186_EPS.epsRigorous(1000003) / IMP97186_EPS.epsCorollaryAsWritten(1000003);
      return r > 1.85 && r < 2.0;
    },
    why: 'eps_rig(b) = 2^omega(log b+2)/phi is strictly larger than the as-written (1/2)2^omega(log b+3)/phi on every b, with ratio 2(log b+2)/(log b+3) -> 2, confirming the ~2x under-count.',
  },
  {
    id: 'imp97186-rigorous-crossover-restated-2311-2670',
    holds: () => {
      const K = IMP97186_KAPPA_ARITH;
      const epsR = IMP97186_EPS.epsRigorous;
      // P_5 = 2310 EXCEEDS under eps_rig (binding class shift to k=5), P_5+1 is far below.
      if (!(epsR(2310) >= K)) return false;
      if (!(epsR(2311) < K)) return false;
      // exact: 2310 is the last exceedance (finite check to a comfortable ceiling).
      for (let b = 2311; b <= 40000; b++) if (epsR(b) >= K) return false;
      // envelope: k=5 constant 2^5/W_5 = 154, threshold 154(log b+2)/b < kappa first at b=2670.
      const env5 = Math.pow(2, 5) * 2310 / 480; // W_5 = phi(2310)/2310 = 480/2310
      const f = (b) => env5 * (Math.log(b) + 2) / b;
      return Math.abs(env5 - 154) < 1e-9 && f(2670) < K && f(2669) >= K;
    },
    why: 'under eps_rig the last exceedance is P_5=2310 (eps_rig=0.6497 >= kappa, then [2311,40000] clean), so b0_exact_rig = 2311; the k=5 envelope 154(log b+2)/b first drops below kappa at b=2670, so b0_envelope_rig = 2670 -- both larger than the imp-97159 (511, 574).',
  },
  {
    id: 'imp97186-qualitative-positivity-unaffected',
    holds: () => {
      // eps_rig -> 0: strictly decreasing along primes and primorials, and coefficient positive past 2311.
      const epsR = IMP97186_EPS.epsRigorous;
      if (!(epsR(1000003) < epsR(9973) && epsR(9973) < epsR(211))) return false; // decays on primes
      if (!(epsR(30030) < epsR(2310))) return false;                              // decays on primorials
      for (const b of [2311, 5003, 10007, 100003]) if (!(IMP97186_KAPPA_ARITH - epsR(b) > 0)) return false;
      return true;
    },
    why: 'eps_rig(b) = O(b^{-1+o(1)}) -> 0 (decays along primes and primorials) and kappa_arith - eps_rig(b) > 0 for representative b >= 2311, so the strictly-positive first-moment coefficient for all large b is unaffected by the constant correction.',
  },
  {
    id: 'imp97186-honesty-gate-no-qed',
    holds: () =>
      IMP97186_VERDICT.anyBoundMoved === false &&
      IMP97186_VERDICT.postsRigorousCeiling === false &&
      IMP97186_VERDICT.qed === false &&
      IMP97186_VERDICT.asWrittenEpsRigorouslyImplied === false &&
      IMP97186_VERDICT.asWrittenEpsHoldsNumerically === true &&
      IMP97186_VERDICT.perRemainderOffsetCorrect === '+2' &&
      IMP97186_VERDICT.b0ExactRestated === 2311 &&
      IMP97186_VERDICT.b0EnvelopeRestated === 2670 &&
      /NO QED/.test(IMP97186_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97186_HONEST_BANNER) &&
      /RH open/.test(IMP97186_HONEST_BANNER),
    why: 'accuracy reconciliation of a log-offset: (log b + 2) per-remainder is correct, the corollary eps is ~2x under-counted (true numerically, not triangle-derivable), crossover restated to (2311, 2670) -- no bound moved, no rigorous ceiling, no QED.',
  },
];

for (const a of IMP97186_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97186-route-m-first-moment-remainder-offset-reconciliation assertion failed: ${a.id}`,
    );
  }
}

export default {
  kappaArith: IMP97186_KAPPA_ARITH,
  eps: IMP97186_EPS,
  reconciliation: IMP97186_RECONCILIATION,
  verdict: IMP97186_VERDICT,
  banner: IMP97186_HONEST_BANNER,
};
