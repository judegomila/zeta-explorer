/**
 * @module imp-97619-route-m-mcm-binf-mertens-closed-form
 *
 * imp-97619 (numerical -- DERIVATION/MEASUREMENT ONLY; MCM stays refuted from omega=11; NO QED).
 *
 * imp-97601 RESULT 2/3 established the Route M MCM per-order surrogate decrement
 *     dS(omega) = -(Pi_omega / p_{omega+1}) * (A_omega + c*log p_{omega+1}),  A_omega = lnA - c*Sigma_omega,
 * with the bracket A_omega + c*log p_{omega+1} = lnA + c*(log p_{omega+1} - Sigma_omega) converging to a
 * value B_inf ~ 0.296789 that was only MEASURED (through the 148933rd prime, p ~ 2e6), and a gap-to-limit
 * law gap ~ 0.166635/log p_omega with the constant 0.166635 asserted to equal e^{-gamma}*B_inf. Here
 * c = 1/12, Sigma_omega = Sum_{i<=omega} log p_i/(p_i - 1), lnA = 0.2487544770337842 is the
 * Glaisher-Kinkelin log-constant (= 1/12 - zeta-prime(-1)). This leaf DERIVES B_inf in closed form,
 * identifies the Mertens-type limit, and settles the next-order structure of the gap law.
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 -- CLOSED FORM: the bracket limit is a shifted Euler-Mascheroni constant.
 * -------------------------------------------------------------------------------
 * The only omega-dependent piece of the bracket is M_omega := log p_{omega+1} - Sigma_omega. Split the
 * summand log p/(p-1) = log p/p + log p/(p(p-1)). Then
 *     Sigma_omega = Sum_{p<=p_omega} log p/p + Sum_{p<=p_omega} log p/(p(p-1)).
 * By the standard prime-sum identity Sum_{n<=x} Lambda(n)/n = log x - gamma + o(1), and since the
 * prime-power part Sum_{p^k<=x, k>=2} log p/p^k -> Sum_p log p/(p(p-1)) converges, one gets
 *     Sum_{p<=x} log p/p = log x - gamma - Sum_p log p/(p(p-1)) + o(1).
 * Adding back Sum_{p<=x} log p/(p(p-1)) cancels the convergent constant up to the (vanishing) tail
 * Sum_{p>x} log p/(p(p-1)) -> 0, so
 *     Sigma_omega = log p_omega - gamma + o(1)   ==>   M_omega = log p_{omega+1} - Sigma_omega -> gamma
 * (the consecutive-prime shift log p_{omega+1} - log p_omega -> 0). Hence the CLOSED FORM
 *     B_inf = lnA + c*lim_{omega} (log p_{omega+1} - Sigma_omega) = lnA + gamma/12 = 0.2968557824422.
 * The imp-97601 "measured 0.296789" is the finite-height bracket value at p ~ 2e6 (recomputed here as
 * 0.296788637), which approaches the derived limit 0.2968557824 from BELOW -- the measurement was
 * ~6.7e-5 short of the true limit, exactly the slow o(1) undershoot predicted by this derivation.
 *
 * -------------------------------------------------------------------------------
 * RESULT 2 -- the gap-law constant in closed form; the "0.166635" refined.
 * -------------------------------------------------------------------------------
 * The identity gapConst = e^{-gamma}*B_inf is exact by construction; with the derived B_inf,
 *     gapConst = e^{-gamma}*(lnA + gamma/12) = 0.16667249.
 * The imp-97601 value 0.166635 was the finite-height evaluation e^{-gamma}*(measured 0.296789); it is
 * refined here to the closed-form 0.16667249. Re-fitting the deep-tail gaps against the DERIVED leading
 * law e^{-gamma}*B_inf/log p_omega gives a residual that is consistently NEGATIVE and monotone (with the
 * measured B_inf the residual flipped sign), confirming the derived constant is the correct leading term.
 *
 * -------------------------------------------------------------------------------
 * RESULT 3 (HONEST SUB-GAP) -- there is NO clean elementary 1/log^2 next-order term.
 * -------------------------------------------------------------------------------
 * Writing S(omega) = Pi_omega*(lnA - c*Sigma_omega) and using Sigma_omega = log p_omega - gamma - delta(omega),
 * A_omega = B_inf - c*log p_omega + c*delta(omega), and Pi_omega = (e^{-gamma}/log p_omega)(1 + eps(omega)),
 *     gap(omega) = S(omega) + e^{-gamma}/12
 *                = e^{-gamma}*B_inf/log p_omega  -  (e^{-gamma}/12)*eps(omega)  +  O(delta/log p_omega).
 * The two next-order pieces are (a) the arithmetic deficit delta(omega) = gamma - (log p_{omega+1} - Sigma_omega)
 * = the PNT error term in Sum_{n<=x} Lambda(n)/n (measured ~8.06e-4 at p ~ 2e6), and (b) the Mertens
 * third-theorem relative error eps(omega) = Pi_omega*log p_omega*e^{gamma} - 1. Both are smaller than any
 * fixed power of 1/log p (PNT-strength), so the correction is NOT a clean elementary constant / log^2:
 * numerically |gap - derived law|*log^2 p STRICTLY DECREASES along the tail (2.6e-3, 7.8e-4, 2.1e-4, 1.8e-4),
 * i.e. the next-order term decays faster than 1/log^2. Named sub-gap:
 * IMP97619_GAP_LAW_NEXT_ORDER_IS_PNT_ERROR_NOT_ELEMENTARY.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.  DERIVATION/MEASUREMENT ONLY. The bracket limit is the shifted Euler-Mascheroni constant
 * B_inf = lnA + gamma/12 = 0.2968557824 (Mertens-type: log p - Sigma_omega -> gamma), and the imp-97601
 * measured 0.296789 is the finite-height value approaching it from below. The gap-law constant is
 * e^{-gamma}*(lnA + gamma/12) = 0.16667249 (refining 0.166635). The next-order correction is the
 * PNT/Mertens error, NOT an elementary 1/log^2 constant (sub-gap named). MCM stays refuted from omega=11;
 * b/4 ceiling untouched; kappa_arith unchanged; no bound on Lambda moves; PT Lambda <= 0.2 SOTA; RH open; NO QED.
 *
 * @see imp-97601-route-m-mcm-margin-collapse-rate-law.js (B_inf ~ 0.296789 measured; gap ~ 0.166635/log p)
 * @see imp-97432-route-m-mcm-hypothesis-refuted-ceiling-safe.js (surrogate closed form + primorial limit; kernel)
 *
 * Ticket: imp-97619 (numerical, opus-4-8, api-pool). B_inf = lnA + gamma/12 (Mertens closed form); NO QED.
 */

import { IMP97432_KERNEL as K } from './imp-97432-route-m-mcm-hypothesis-refuted-ceiling-safe.js';
import { B_INF as B_INF_MEASURED, GAP_LAW_CONST as GAP_CONST_MEASURED } from './imp-97601-route-m-mcm-margin-collapse-rate-law.js';

const C_TWELFTH = 1 / 12;
const LN_A = K.LN_A;        // Glaisher-Kinkelin log-constant = 0.2487544770337842
const GAMMA = K.E_GAMMA;    // Euler-Mascheroni gamma = 0.5772156649015329 (K field misnamed; value is gamma)
const E_NEG_GAMMA = Math.exp(-GAMMA); // e^{-gamma} = 0.561459...

// CLOSED FORM derived here: B_inf = lnA + gamma/12 (the bracket limit).
export const B_INF_DERIVED = LN_A + C_TWELFTH * GAMMA; // = lnA + gamma/12 = 0.2968557824422
export const GAP_LAW_CONST_DERIVED = E_NEG_GAMMA * B_INF_DERIVED;            // e^{-gamma}*(lnA + gamma/12)
export const MERTENS_LIMIT_M = GAMMA;   // lim (log p_{omega+1} - Sigma_omega) = gamma

// baked convergence ladder for M_omega = log p_omega - Sigma_omega -> gamma and the bracket -> B_inf
// (sieve to ~2e6; heavy, so literals not live-sieved here). bracket = lnA + (1/12)*M_omega.
export const IMP97619_BRACKET_LADDER = Object.freeze([
  Object.freeze({ omega: 100, pOmega: 541, M: 0.535172796, bracket: 0.293352210 }),
  Object.freeze({ omega: 1000, pOmega: 7919, M: 0.564185370, bracket: 0.295769925 }),
  Object.freeze({ omega: 10000, pOmega: 104729, M: 0.573495500, bracket: 0.296545769 }),
  Object.freeze({ omega: 100000, pOmega: 1299709, M: 0.576272861, bracket: 0.296777215 }),
  Object.freeze({ omega: 148933, pOmega: 1999993, M: 0.576409917, bracket: 0.296788637 }),
]);

// baked deep-tail gap vs the DERIVED leading law e^{-gamma}*B_inf_derived/log p_omega; residual = gap - law.
export const IMP97619_GAP_TAIL = Object.freeze([
  Object.freeze({ omega: 1000, pOmega: 7919, gap: 1.853371e-2, lawDerived: 1.856657e-2, residual: -3.286e-5 }),
  Object.freeze({ omega: 10000, pOmega: 104729, gap: 1.441329e-2, lawDerived: 1.441912e-2, residual: -5.832e-6 }),
  Object.freeze({ omega: 100000, pOmega: 1299709, gap: 1.183846e-2, lawDerived: 1.183951e-2, residual: -1.047e-6 }),
  Object.freeze({ omega: 148933, pOmega: 1999993, gap: 1.148696e-2, lawDerived: 1.148780e-2, residual: -8.352e-7 }),
]);

export const IMP97619_RESULTS = Object.freeze({
  question: 'derive the imp-97601 bracket limit B_inf ~ 0.296789 (measured) in closed form as lnA + c*lim(log p - Sigma), identify the gap-law constant 0.166635 with known constants, and give the next-order term',
  bracketLimitClosedForm: 'B_inf = lnA + c*lim_{omega}(log p_{omega+1} - Sigma_omega) = lnA + gamma/12, with c = 1/12 and lim(log p_omega - Sigma_omega) = gamma (Euler-Mascheroni), from Sum_{n<=x} Lambda(n)/n = log x - gamma + o(1)',
  bracketLimitValue: B_INF_DERIVED,          // 0.2968557824422
  mertensLimitM: MERTENS_LIMIT_M,            // gamma = 0.5772156649
  measuredIsFiniteHeight: 'the imp-97601 measured 0.296789 is the bracket value at p ~ 2e6 (recomputed 0.296788637), approaching the derived limit 0.2968557824 from BELOW (~6.7e-5 short)',
  gapConstClosedForm: 'gapConst = e^{-gamma}*B_inf = e^{-gamma}*(lnA + gamma/12) = 0.16667249 (refines the finite-height 0.166635)',
  gapConstValue: GAP_LAW_CONST_DERIVED,      // 0.16667249
  nextOrderStructure: 'gap = e^{-gamma}*B_inf/log p - (e^{-gamma}/12)*eps + O(delta/log p), where delta = gamma - (log p - Sigma) is the PNT error in Sum Lambda(n)/n and eps is the Mertens-third relative error; both are sub-power-of-1/log',
  nextOrderIsElementary: false,              // key sub-gap answer: NOT a clean c/log^2
  subGap: 'IMP97619_GAP_LAW_NEXT_ORDER_IS_PNT_ERROR_NOT_ELEMENTARY',
  residualDecaysFasterThanInvLog2: '|gap - derived law|*log^2 p strictly decreases along the tail (2.6e-3, 7.8e-4, 2.1e-4, 1.8e-4)',
});

export const IMP97619_VERDICT = Object.freeze({
  question: 'is B_inf a closed-form shifted Mertens constant, and does the gap law have an elementary next-order 1/log^2 term?',
  bracketLimitClosedFormExact: true,         // B_inf = lnA + gamma/12
  mertensLimitIsGamma: true,                 // lim(log p - Sigma) = gamma
  measuredApproachesLimitFromBelow: true,
  gapConstClosedFormExact: true,             // e^{-gamma}*(lnA + gamma/12)
  nextOrderIsElementaryInvLog2: false,       // NO clean c/log^2; it is the PNT/Mertens error
  mcmRefuted: true,                          // (imp-97432/imp-97583) unchanged
  ceilingTouched: false,
  anyBoundMoved: false,
  qed: false,
  conclusion:
    'DERIVATION/MEASUREMENT ONLY. The bracket limit is the shifted Euler-Mascheroni constant ' +
    'B_inf = lnA + gamma/12 = 0.2968557824, because lim(log p_omega - Sigma_omega) = gamma (Mertens-type, ' +
    'from Sum_{n<=x} Lambda(n)/n = log x - gamma + o(1)). The imp-97601 measured 0.296789 is the ' +
    'finite-height value at p ~ 2e6 approaching the limit from below (~6.7e-5 short). The gap-law constant ' +
    'is e^{-gamma}*(lnA + gamma/12) = 0.16667249 (refining 0.166635). The next-order correction is the ' +
    'PNT/Mertens error term, NOT an elementary 1/log^2 constant (sub-gap IMP97619_GAP_LAW_NEXT_ORDER_IS_' +
    'PNT_ERROR_NOT_ELEMENTARY): |gap - derived law|*log^2 p strictly decreases. MCM stays refuted from ' +
    'omega=11; b/4 ceiling untouched; kappa_arith unchanged; no bound on Lambda moves; PT Lambda <= 0.2 SOTA; RH open; NO QED.',
});

export const IMP97619_HONEST_BANNER =
  'RH open; PT Lambda <= 0.2 remains SOTA; NO QED. Derivation of the Route M MCM bracket limit: ' +
  'B_inf = lnA + gamma/12 = 0.2968557824, a shifted Euler-Mascheroni constant (lim(log p - Sigma_omega) = gamma). ' +
  'The imp-97601 measured 0.296789 is the finite-height value at p ~ 2e6 approaching from below. The gap-law ' +
  'constant is e^{-gamma}*(lnA + gamma/12) = 0.16667249 (refines 0.166635). The next-order term is the ' +
  'PNT/Mertens error, not an elementary 1/log^2 constant (sub-gap named). MCM refuted from omega=11; no bound moved.';

// -- self-executing assertions (imp-3715 convention): recompute closed forms; any failure throws --

const IMP97619_ASSERTIONS = [
  {
    id: 'imp97619-binf-closed-form-lnA-plus-gamma-over-12',
    holds: () => {
      const expected = 0.2968557824422453;
      return Math.abs(B_INF_DERIVED - (LN_A + GAMMA / 12)) < 1e-15 &&
             Math.abs(B_INF_DERIVED - expected) < 1e-12 &&
             Math.abs(MERTENS_LIMIT_M - GAMMA) < 1e-15;
    },
    why: 'the derived bracket limit equals lnA + gamma/12 = 0.2968557824, with the Mertens-type limit lim(log p - Sigma_omega) = gamma.',
  },
  {
    id: 'imp97619-measured-approaches-derived-limit-from-below',
    holds: () => {
      // the imp-97601 measured B_inf is BELOW the derived limit (approach from below), within the slow o(1) undershoot.
      if (!(B_INF_MEASURED < B_INF_DERIVED)) return false;
      const shortfall = B_INF_DERIVED - B_INF_MEASURED;
      if (!(shortfall > 0 && shortfall < 1e-3)) return false; // ~6.7e-5
      // the recomputed finite-height bracket at p ~ 2e6 matches the imp-97601 measured value to 1e-6.
      const last = IMP97619_BRACKET_LADDER[IMP97619_BRACKET_LADDER.length - 1];
      return Math.abs(last.bracket - B_INF_MEASURED) < 1e-6 && last.bracket < B_INF_DERIVED;
    },
    why: 'the imp-97601 measured 0.296789 is the finite-height bracket at p ~ 2e6, below the derived limit 0.2968557824 and matching the recomputed value to 1e-6 -- convergence from below.',
  },
  {
    id: 'imp97619-bracket-ladder-monotone-below-limit',
    holds: () => {
      // bracket column strictly increases toward B_inf_derived and every entry is below it; bracket = lnA + M/12.
      let prev = -Infinity;
      for (const row of IMP97619_BRACKET_LADDER) {
        if (!(row.bracket > prev)) return false;             // strictly increasing
        if (!(row.bracket < B_INF_DERIVED)) return false;    // below the limit
        if (!(Math.abs((LN_A + row.M / 12) - row.bracket) < 1e-6)) return false; // internal consistency
        prev = row.bracket;
      }
      return true;
    },
    why: 'the baked bracket ladder increases monotonically toward B_inf_derived, stays below it, and satisfies bracket = lnA + M/12 at every row.',
  },
  {
    id: 'imp97619-gap-const-closed-form-refines-measured',
    holds: () => {
      const expected = 0.16667249;
      if (!(Math.abs(GAP_LAW_CONST_DERIVED - E_NEG_GAMMA * B_INF_DERIVED) < 1e-15)) return false;
      if (!(Math.abs(GAP_LAW_CONST_DERIVED - expected) < 1e-6)) return false;
      // the derived constant EXCEEDS the imp-97601 finite-height 0.166635 (since B_inf_derived > measured).
      return GAP_LAW_CONST_DERIVED > GAP_CONST_MEASURED;
    },
    why: 'the gap-law constant in closed form is e^{-gamma}*(lnA + gamma/12) = 0.16667249, refining (and exceeding) the finite-height 0.166635.',
  },
  {
    id: 'imp97619-next-order-not-elementary-invlog2',
    holds: () => {
      // with the DERIVED leading law the residual is consistently negative, and |residual|*log^2 p strictly
      // decreases along the tail => the next-order term decays faster than 1/log^2 (PNT/Mertens error, not elementary).
      let prevScaled = Infinity;
      for (const row of IMP97619_GAP_TAIL) {
        if (!(row.residual < 0)) return false;                       // consistent sign
        // residual bookkeeping: gap and lawDerived are 7-sig-fig literals, so their difference loses
        // precision by catastrophic cancellation (imp-2546 storage-precision rule) -- allow 1e-7.
        if (!(Math.abs(row.gap - row.lawDerived - row.residual) < 1e-7)) return false;
        const scaled = Math.abs(row.residual) * Math.log(row.pOmega) ** 2;
        if (!(scaled < prevScaled)) return false;                    // strictly decreasing
        prevScaled = scaled;
      }
      return IMP97619_VERDICT.nextOrderIsElementaryInvLog2 === false;
    },
    why: 'against the derived leading law the gap residual is consistently negative and |residual|*log^2 p strictly decreases -- the next-order correction decays faster than 1/log^2, so it is the PNT/Mertens error, not an elementary c/log^2 term.',
  },
  {
    id: 'imp97619-honesty-gate-no-qed',
    holds: () =>
      IMP97619_VERDICT.bracketLimitClosedFormExact === true &&
      IMP97619_VERDICT.mertensLimitIsGamma === true &&
      IMP97619_VERDICT.measuredApproachesLimitFromBelow === true &&
      IMP97619_VERDICT.gapConstClosedFormExact === true &&
      IMP97619_VERDICT.nextOrderIsElementaryInvLog2 === false &&
      IMP97619_VERDICT.mcmRefuted === true &&
      IMP97619_VERDICT.ceilingTouched === false &&
      IMP97619_VERDICT.anyBoundMoved === false &&
      IMP97619_VERDICT.qed === false &&
      /NO QED/.test(IMP97619_HONEST_BANNER) &&
      /PT Lambda <= 0.2/.test(IMP97619_HONEST_BANNER) &&
      /RH open/.test(IMP97619_HONEST_BANNER),
    why: 'derivation/measurement only -- closed form B_inf = lnA + gamma/12, gap const refined, next-order = PNT/Mertens error; MCM refuted from omega=11; no bound moved, no QED.',
  },
];

for (const a of IMP97619_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97619-route-m-mcm-binf-mertens-closed-form assertion failed: ${a.id}`);
  }
}

export default {
  bracketLadder: IMP97619_BRACKET_LADDER,
  gapTail: IMP97619_GAP_TAIL,
  results: IMP97619_RESULTS,
  verdict: IMP97619_VERDICT,
  banner: IMP97619_HONEST_BANNER,
};
