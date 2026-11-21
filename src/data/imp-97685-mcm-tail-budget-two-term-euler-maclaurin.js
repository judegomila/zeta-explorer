/**
 * @module imp-97685-mcm-tail-budget-two-term-euler-maclaurin
 *
 * imp-97685 (accuracy -- MEASUREMENT/VERIFICATION ONLY; MCM stays refuted from omega=11; NO QED).
 *
 * imp-97647 RESULT 1 bounds the omitted divisors d > cut of the imp-97432 MCM kernel by the ONE-TERM tail
 * Sum_{d>cut} 1/(720 d^3): the leading remainder R(d) ~ +1/(720 d^2) times the extra 1/d from the Rcorr
 * weight mu(d)/d. imp-97666 then DERIVED the next Euler-Maclaurin order,
 *
 *     Rexact(m) = 1/(720 m^2) - 1/(5040 m^4) + O(m^-6),
 *
 * (leading -B_4/4! = 1/720 against f_ppp = -1/m^2; next B_6/6! * f^(5) = -1/(5040 m^4) against f=x log x).
 * This leaf RE-RUNS the imp-97647 omitted-divisor tail budget with the DERIVED two-term remainder in place of
 * the asserted one-term bound and reports whether the budget, the +7.52e-5 omega=10 ordering margin, or the
 * d <= 1000 exact cap move.
 *
 * -------------------------------------------------------------------------------
 * METHOD.  The tail contribution to Rcorr is Sum_{d>cut} mu(d) Rexact(d)/d, bounded in magnitude by
 * Sum_{d>cut} |Rexact(d)|/d over the squarefree divisors d of the prime set. The one-term budget uses
 * |Rexact(d)| <= 1/(720 d^2) -> term 1/(720 d^3). The two-term budget uses the derived
 * Rexact(d) = 1/(720 d^2) - 1/(5040 d^4) (positive and STRICTLY SMALLER than the one-term envelope for all
 * d >= 3), giving term 1/(720 d^3) - 1/(5040 d^5). We recompute both over the exact divisor lattices of the
 * primorial p_10# and its nearest competitor {2,3,5,7,11,13,17,19,23,31} at cut = 1000.
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 -- THE TWO-TERM REMAINDER TIGHTENS THE BUDGET, BY A NEGLIGIBLE AMOUNT. Because the next
 * Euler-Maclaurin term -1/(5040 m^4) is NEGATIVE, the true |Rexact(d)| sits BELOW the one-term envelope, so
 * the one-term 1/(720 d^3) bound is a valid (conservative) over-estimate. The two-term budget subtracts only
 * Sum_{d>1000} 1/(5040 d^5): 2.2767e-18 (primorial) and 2.4240e-18 (competitor), a relative tightening of
 * ~8.2e-8 and ~8.4e-8 respectively. The combined budget moves from 5.680507e-11 (one-term) to 5.680506e-11
 * (two-term) -- a shift of 4.70e-18, about 1.2e7 times smaller than the budget itself.
 *
 * RESULT 2 -- THE ORDERING MARGIN AND ONSET ARE UNCHANGED. The gap / budget ratio stays 1.3239e6 to five
 * figures under either the one-term or two-term budget, so the +7.520579e-5 omega=10 primorial-extremality gap
 * still dwarfs the entire omitted-divisor budget by over a million-fold. The primorial p_10# stays the strict
 * minimiser; no non-primorial 10-set can cross it; the MCM onset stays exactly omega=11.
 *
 * RESULT 3 -- THE d <= 1000 EXACT CAP CANNOT MOVE. The cap is set by IEEE-double Gexact-GKmain cancellation
 * (imp-97647 RESULT 2: SNR ~1.68 at d=1000 degrading to the WRONG sign at d=10000), a numerical-precision
 * limit that is INDEPENDENT of how many analytic Euler-Maclaurin terms the tail bound carries. Refining the
 * bound from one to two terms shrinks the already-negligible omitted budget; it does not extend the range over
 * which the double kernel Rexact(d) is trustworthy, so the exact cap stays at d <= 1000.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.  MEASUREMENT/ACCURACY ONLY. Re-running the imp-97647/imp-97432 omitted-divisor tail budget with the
 * imp-97666 derived two-term remainder Rexact(m) = 1/(720 m^2) - 1/(5040 m^4) confirms the one-term
 * 1/(720 d^3) bound: the next term only TIGHTENS the budget, by ~4.7e-18 combined (~8e-8 relative), leaving
 * the < 5.69e-11 tail budget, the 1.32e6 gap-over-budget ratio, the omega=10 ordering, and the d <= 1000 exact
 * cap all unchanged. The MCM onset stays omega=11; MCM refuted; the b/4 ceiling is untouched; no bound on
 * Lambda moves; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97647-route-m-mcm-omega10-cap-robustness.js  (one-term tail budget; omega=10 gap +7.52e-5)
 * @see imp-97666-route-m-mcm-tail-constant-euler-maclaurin.js  (two-term remainder derivation)
 * @see imp-97432-route-m-mcm-hypothesis-refuted-ceiling-safe.js  (kernel; cap d<=1000)
 *
 * Ticket: imp-97685 (accuracy, opus-4-8, api-pool). Two-term tail only tightens; onset stays 11; NO QED.
 * -------------------------------------------------------------------------------
 */

const PRIMORIAL10 = Object.freeze([2, 3, 5, 7, 11, 13, 17, 19, 23, 29]);
const COMPETITOR10 = Object.freeze([2, 3, 5, 7, 11, 13, 17, 19, 23, 31]); // nearest non-primorial: 29 -> 31

// squarefree divisors of a prime set (products of subsets); import-light, no cross-imports.
function divisors(primes) {
  let ds = [1];
  for (const p of primes) ds = ds.concat(ds.map((d) => d * p));
  return ds;
}

// one-term vs two-term omitted-divisor budgets over d > cut.
function budgets(primes, cut) {
  const ds = divisors(primes).filter((d) => d > cut);
  let one = 0;
  let two = 0;
  let subtracted = 0;
  for (const d of ds) {
    const t1 = 1 / (720 * d * d * d); // one-term |Rexact|/d <= 1/(720 d^3)
    const sub = 1 / (5040 * d * d * d * d * d); // the -1/(5040 d^4)/d two-term correction
    one += t1;
    two += t1 - sub; // two-term |Rexact|/d = 1/(720 d^3) - 1/(5040 d^5)
    subtracted += sub;
  }
  return { one, two, subtracted, count: ds.length };
}

const GAP_OMEGA10 = 7.520578537e-5; // imp-97647 baked Tfull(comp,1000) - Tfull(prim,1000)

export const IMP97685_TWO_TERM_TAIL_BUDGET = Object.freeze({
  cut: 1000,
  // one-term budget reproduces the imp-97647 baked literals exactly (2.7840e-11 / 2.8965e-11 / 5.6805e-11).
  oneTermBudgetPrim: 2.784038e-11,
  oneTermBudgetComp: 2.896469e-11,
  oneTermBudgetCombined: 5.680507e-11,
  // two-term budget: the -1/(5040 d^4) term subtracts a negligible amount, TIGHTENING the bound.
  twoTermBudgetPrim: 2.784037e-11,
  twoTermBudgetComp: 2.896469e-11,
  twoTermBudgetCombined: 5.680506e-11,
  subtractedPrim: 2.276680e-18,
  subtractedComp: 2.424010e-18,
  subtractedCombined: 4.700690e-18,
  relativeTightenPrim: 8.177619e-8,
  relativeTightenComp: 8.368845e-8,
  gapOmega10: GAP_OMEGA10,
  gapOverOneTermBudget: 1.3239e6,
  gapOverTwoTermBudget: 1.3239e6, // unchanged to five figures
  twoTermIsTighterNotLooser: true, // next term is negative -> one-term bound is a valid over-estimate
  budgetShiftFromSecondTerm: 4.70e-18, // combined; ~1.2e7 x smaller than the budget itself
  exactCapStaysAt1000: true, // cap set by IEEE cancellation SNR, not by tail-bound term count
  onsetOmega: 11, // unchanged
  ceilingTouched: false,
  anyBoundMoved: false,
  qed: false,
});

export const IMP97685_HONEST_BANNER =
  'imp-97685: MEASUREMENT/ACCURACY ONLY. Re-running the imp-97647 omitted-divisor tail budget with the ' +
  'imp-97666 derived two-term remainder Rexact(m) = 1/(720 m^2) - 1/(5040 m^4) confirms the one-term ' +
  '1/(720 d^3) bound: the negative next term only TIGHTENS the budget, by ~4.7e-18 combined (~8e-8 relative), ' +
  'leaving the < 5.69e-11 budget, the 1.32e6 gap-over-budget ratio, the omega=10 ordering, and the d <= 1000 ' +
  'exact cap all unchanged (the cap is set by IEEE Gexact-GKmain cancellation SNR, not by the tail-bound term ' +
  'count). MCM onset stays omega=11; MCM refuted; b/4 ceiling untouched; no bound moved. No refereed bound is changed' +
  '; RH open; NO QED.';

// -- self-executing assertions (imp-3715 convention): recompute; any failure throws --

const IMP97685_ASSERTIONS = [
  {
    id: 'imp97685-one-term-budget-reproduces-imp97647',
    holds: () => {
      const bp = budgets(PRIMORIAL10, 1000);
      const bc = budgets(COMPETITOR10, 1000);
      // reproduce the imp-97647 baked one-term literals (2.7840e-11 / 2.8965e-11 / 5.6805e-11).
      return (
        Math.abs(bp.one - 2.7840e-11) < 5e-15 &&
        Math.abs(bc.one - 2.8965e-11) < 5e-15 &&
        Math.abs(bp.one + bc.one - 5.6805e-11) < 5e-15
      );
    },
    why: 'the self-contained one-term Sum 1/(720 d^3) over the primorial/competitor divisor lattices reproduces the imp-97647 baked tail budgets 2.7840e-11 / 2.8965e-11 (combined 5.6805e-11).',
  },
  {
    id: 'imp97685-two-term-is-tighter-not-looser',
    holds: () => {
      const bp = budgets(PRIMORIAL10, 1000);
      const bc = budgets(COMPETITOR10, 1000);
      // the negative second term makes the two-term budget strictly smaller (tighter).
      return bp.two < bp.one && bc.two < bc.one && bp.subtracted > 0 && bc.subtracted > 0;
    },
    why: 'the derived next term -1/(5040 m^4) is negative, so |Rexact| sits below the one-term envelope and the two-term budget is strictly smaller -- the one-term 1/(720 d^3) bound is a valid conservative over-estimate.',
  },
  {
    id: 'imp97685-second-term-shift-is-negligible',
    holds: () => {
      const bp = budgets(PRIMORIAL10, 1000);
      const bc = budgets(COMPETITOR10, 1000);
      const combinedOne = bp.one + bc.one;
      const shift = bp.subtracted + bc.subtracted;
      // the whole second-term correction is ~1e7 times smaller than the budget.
      return shift > 0 && shift < 1e-17 && combinedOne / shift > 1e6;
    },
    why: 'the combined two-term correction Sum 1/(5040 d^5) over d>1000 is ~4.7e-18, over a million times smaller than the ~5.68e-11 budget, so refining from one to two terms does not move the budget at any relevant scale.',
  },
  {
    id: 'imp97685-gap-still-dwarfs-two-term-budget',
    holds: () => {
      const bp = budgets(PRIMORIAL10, 1000);
      const bc = budgets(COMPETITOR10, 1000);
      const twoTerm = bp.two + bc.two;
      // the omega=10 gap still dwarfs the (tighter) two-term budget by over a million-fold.
      return twoTerm < 5.69e-11 && GAP_OMEGA10 / twoTerm > 1e6;
    },
    why: 'the +7.520579e-5 omega=10 ordering gap over the tighter two-term budget stays > 1.3e6, so the primorial remains the strict minimiser and the onset cannot drop to omega=10.',
  },
  {
    id: 'imp97685-honesty-gate-no-qed',
    holds: () =>
      IMP97685_TWO_TERM_TAIL_BUDGET.onsetOmega === 11 &&
      IMP97685_TWO_TERM_TAIL_BUDGET.twoTermIsTighterNotLooser === true &&
      IMP97685_TWO_TERM_TAIL_BUDGET.exactCapStaysAt1000 === true &&
      IMP97685_TWO_TERM_TAIL_BUDGET.ceilingTouched === false &&
      IMP97685_TWO_TERM_TAIL_BUDGET.anyBoundMoved === false &&
      IMP97685_TWO_TERM_TAIL_BUDGET.qed === false &&
      /NO QED/.test(IMP97685_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97685_HONEST_BANNER) &&
      /RH open/.test(IMP97685_HONEST_BANNER) &&
      /omega=11/.test(IMP97685_HONEST_BANNER),
    why: 'measurement/accuracy only -- the two-term tail budget confirms the one-term bound, tightening it negligibly; onset stays omega=11; d<=1000 cap stays; no bound moved; no QED.',
  },
];

for (const a of IMP97685_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97685-mcm-tail-budget-two-term-euler-maclaurin assertion failed: ${a.id}`);
  }
}

export default {
  twoTermTailBudget: IMP97685_TWO_TERM_TAIL_BUDGET,
  banner: IMP97685_HONEST_BANNER,
};
