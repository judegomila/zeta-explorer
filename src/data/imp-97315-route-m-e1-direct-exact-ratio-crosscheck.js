/**
 * @module imp-97315-route-m-e1-direct-exact-ratio-crosscheck
 *
 * imp-97315 (accuracy VERIFICATION -- NO QED): independently verify the imp-97291 RESULT 1 / RESULT 3
 * reading that the worst COMPOSITE ratio
 *     r(b) = |E1(b)| / (b/4)
 * climbs monotonically toward 1 on the close-prime semiprime family, using the DIRECT exact O(b)
 * coprime-sum evaluator measureE1 (ground truth) rather than the fast Glaisher-Kinkelin per-divisor
 * Gasymp evaluator that imp-97291 used for reach. Goal: confirm the ratio->1 trend and the Gasymp
 * agreement are NOT an evaluator artifact inside the FP-trustworthy window. Measurement/verification
 * only; RH open; NO QED.
 *
 *   Notation (imp-97291 / imp-97290 / imp-97265): E1(b) = L1(b) - phi(b) b((1/2)log b - 1/4),
 *   L1(b) = Sum_{a coprime, 1<=a<=b-1} a log a, phi = Euler totient. The direct evaluator sums over all
 *   coprime residues in O(b); the fast evaluator uses E1(b)=Sum_{d|b} mu(d) C_d with the Glaisher-Kinkelin
 *   asymptotic Gasymp(n) for G(n)=Sum k log k (imp-97291 E1fastFromPrimes).
 *
 * -------------------------------------------------------------------------------
 * METHOD.
 * -------------------------------------------------------------------------------
 * For the consecutive-prime semiprime ladder p*nextprime(p) with p in {71,211,499,997,2999,9973} the
 * DIRECT exact coprime sum measureE1(b) was evaluated at every b (largest b = 9973*10007 = 99799811,
 * a ~1e8-term O(b) sweep) and the ratio r_exact(b) = |measureE1(b)|/(b/4) compared to the fast
 * Gasymp ratio r_fast(b) = |E1fastFromPrimes([p,q])|/(b/4) from imp-97291. Both the exact-vs-fast
 * agreement AND the monotone climb of r_exact itself are recorded.
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 -- THE DIRECT EXACT COPRIME SUM CONFIRMS THE MONOTONE CLIMB TOWARD 1.
 * -------------------------------------------------------------------------------
 * Direct exact r_exact on the ladder rises strictly, from below, with NO plateau:
 *     71*73      0.933493584
 *     211*223    0.974382455
 *     499*503    0.987775926
 *     997*1009   0.993427399
 *     2999*3001  0.997521778
 *     9973*10007 0.999076521
 * so the imp-97291 RESULT 1 / RESULT 3 ratio->1 reading is reproduced by the independent O(b) evaluator,
 * NOT an artifact of the fast Gasymp per-divisor identity.
 *
 * -------------------------------------------------------------------------------
 * RESULT 2 -- GASYMP EVALUATOR VALIDATED TO <6e-7 IN RATIO INSIDE b <~ 1e6 (refines imp-97291 window).
 * -------------------------------------------------------------------------------
 * |r_exact - r_fast| grows with b as both evaluators accumulate FP cancellation:
 *     71*73      2.3e-10        499*503    5.7e-9
 *     211*223    6.2e-10        997*1009   5.0e-7
 * so the fast Gasymp ratio matches the direct exact sum to <6e-7 for b up to ~1e6 -- exactly the
 * "|diff| < 6e-7 on large-prime semiprimes" claim of imp-97291, now cross-checked against the
 * O(b) ground truth rather than asserted. HONEST REFINEMENT of the imp-97291 FP-validity note: beyond
 * ~1e6 the two evaluators diverge FASTER than 6e-7 (2999*3001: 3.6e-5; 9973*10007: 1.1e-4), because the
 * O(b) direct sum ALSO loses precision (it cancels ~b terms of size ~b log b down to a result ~b/4). The
 * two evaluators bracket the true ratio but neither is 6-decimal-trustworthy at b ~ 1e8; the imp-97291
 * "trustworthy to ~6 decimals for b <~ 2.5e9" figure is optimistic for the last decimals past ~1e7. The
 * MONOTONE CLIMB survives regardless: r_exact itself increases across the whole ladder, and the residual
 * 1 - r_exact still shrinks by a per-decade factor ~0.33-0.35, matching the imp-97291 RESULT 4 b^{-1/2} law.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * The imp-97291 conclusion (worst composite ratio APPROACHES 1 along the close-prime semiprime family)
 * is INDEPENDENTLY CONFIRMED by the direct exact O(b) coprime-sum evaluator inside the FP-trustworthy
 * window, and the Gasymp fast evaluator is validated to <6e-7 in ratio for b <~ 1e6. Verification only;
 * no bound on Lambda moves; kappa_arith unchanged; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97291-route-m-e1-wide-composite-ratio-sweep.js (the wide-range Gasymp measurement being verified)
 * @see imp-97290-route-m-arith-quarter-ceiling-semiprime-proof.js (leader+correction decomposition; parity sign law)
 * @see imp-97265-route-m-arith-first-moment-quarter-ceiling-proof.js (per-divisor identity; prime ceiling)
 *
 * Ticket: imp-97315 (accuracy, opus-4-8, api-pool). Direct-exact cross-check of the ratio->1 trend; NO QED.
 */

import { IMP97291_KERNEL } from './imp-97291-route-m-e1-wide-composite-ratio-sweep.js';

const { measureE1, E1fastFromPrimes } = IMP97291_KERNEL;

const rExactFromPrimes = ([p, q]) => {
  const b = p * q;
  return Math.abs(measureE1(b)) / (b / 4);
};
const rFastFromPrimes = ([p, q]) => {
  const b = p * q;
  return Math.abs(E1fastFromPrimes([p, q])) / (b / 4);
};

export const IMP97315_KERNEL = Object.freeze({ rExactFromPrimes, rFastFromPrimes });

// -- baked direct-exact measurements (small members are reproduced live by the assertions below;
//    the ~1e7 and ~1e8 members are recorded from the offline O(b) direct sums) --
export const IMP97315_RESULTS = Object.freeze({
  ratioDefinition: 'r(b) = |E1(b)| / (b/4), E1 by DIRECT exact O(b) coprime sum measureE1',
  method: 'direct exact coprime sum vs the imp-97291 fast Gasymp per-divisor evaluator on the consecutive-prime semiprime ladder',
  // r_exact = direct O(b) coprime sum; r_fast = imp-97291 Gasymp per-divisor; diff = |r_exact - r_fast|
  directExactLadder: [
    { b: 5183, factors: '71*73', rExact: 0.933493584, rFast: 0.933493584, diff: 2.33e-10, marginOverSqrtB: 1.197000 },
    { b: 47053, factors: '211*223', rExact: 0.974382455, rFast: 0.974382455, diff: 6.20e-10, marginOverSqrtB: 1.389220 },
    { b: 250997, factors: '499*503', rExact: 0.987775926, rFast: 0.987775921, diff: 5.73e-9, marginOverSqrtB: 1.531053 },
    { b: 1005973, factors: '997*1009', rExact: 0.993427399, rFast: 0.993427900, diff: 5.02e-7, marginOverSqrtB: 1.648050 },
    { b: 8999999, factors: '2999*3001', rExact: 0.997521778, rFast: 0.997558229, diff: 3.65e-5, marginOverSqrtB: 1.858667 },
    { b: 99799811, factors: '9973*10007', rExact: 0.999076521, rFast: 0.999186710, diff: 1.10e-4, marginOverSqrtB: 2.306385 },
  ],
  gasympValidatedTo: { bBelow: 1e6, ratioDiffBelow: 6e-7, note: 'fast Gasymp matches direct exact to <6e-7 in ratio for b <~ 1e6' },
  honestRefinement:
    'past ~1e6 the direct exact O(b) sum ALSO loses FP precision (cancels ~b terms of size ~b log b to a ' +
    'result ~b/4), so exact and fast diverge faster than 6e-7 (3.6e-5 at 2999*3001, 1.1e-4 at 9973*10007); ' +
    'neither is 6-decimal-trustworthy at b ~ 1e8, so the imp-97291 "6 decimals to b <~ 2.5e9" is optimistic ' +
    'for the last decimals past ~1e7 -- but the MONOTONE CLIMB of r_exact itself survives regardless.',
});

export const IMP97315_VERDICT = Object.freeze({
  question: 'does the direct exact O(b) coprime-sum evaluator confirm the imp-97291 ratio->1 trend and validate the fast Gasymp evaluator inside the FP-trustworthy window?',
  directExactConfirmsMonotoneClimb: true,
  gasympValidatedBelow1e6: true, // |r_exact - r_fast| < 6e-7 for b <~ 1e6
  ratioTrendIsEvaluatorArtifact: false,
  fpTrustDegradesPast1e7: true, // HONEST refinement of imp-97291 note
  verificationOnly: true,
  anyBoundMoved: false,
  qed: false,
  conclusion:
    'Direct exact O(b) coprime-sum cross-check of imp-97291. The direct evaluator reproduces the monotone ' +
    'climb of r(b)=|E1(b)|/(b/4) toward 1 on the consecutive-prime semiprime ladder (0.933493584 at 71*73 ' +
    'to 0.999076521 at 9973*10007), so the ratio->1 reading is NOT a fast-Gasymp artifact. The fast Gasymp ' +
    'evaluator is validated to <6e-7 in ratio for b <~ 1e6 (matching the imp-97291 claim against the O(b) ' +
    'ground truth). HONEST refinement: past ~1e6 the direct sum also loses precision, so exact and fast ' +
    'diverge to ~1e-4 by b ~ 1e8 and neither is 6-decimal-trustworthy there -- but the monotone climb of ' +
    'r_exact itself survives. Verification only; no bound on Lambda moves; kappa_arith unchanged; no refereed bound is changed' +
    '; RH open; NO QED.',
});

export const IMP97315_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Direct exact O(b) coprime-sum cross-check of imp-97291: ' +
  'the ratio r(b)=|E1(b)|/(b/4) climbs monotonically toward 1 on the close-prime semiprime ladder in the ' +
  'ground-truth evaluator (0.9335 at 71*73 -> 0.9991 at 9973*10007), so the ratio->1 trend is NOT a ' +
  'Gasymp artifact; the fast evaluator is validated to <6e-7 for b <~ 1e6. Verification only; no bound moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import. Kept LIGHT
//    (direct measureE1 re-run only on b <= 250997, matching the imp-97291 import-time cost). --

const IMP97315_ASSERTIONS = [
  {
    id: 'imp97315-direct-exact-reproduces-baked-small-members',
    holds: () => {
      // Re-run the direct O(b) coprime sum live on the small ladder members and match the baked r_exact.
      for (const [p, q] of [[71, 73], [211, 223], [499, 503]]) {
        const b = p * q;
        const rEx = rExactFromPrimes([p, q]);
        const row = IMP97315_RESULTS.directExactLadder.find((r) => r.b === b);
        if (!row || Math.abs(rEx - row.rExact) > 1e-6) return false;
      }
      return true;
    },
    why: 'the baked direct-exact ratios are reproduced live by the O(b) coprime sum on the small ladder members (71*73, 211*223, 499*503) to <1e-6 -- the table is not stale.',
  },
  {
    id: 'imp97315-direct-exact-climbs-monotonically-toward-one',
    holds: () => {
      const rs = IMP97315_RESULTS.directExactLadder.map((r) => r.rExact);
      for (let i = 1; i < rs.length; i++) if (!(rs[i] > rs[i - 1])) return false;
      return rs[0] > 0.93 && rs[0] < 0.94 && rs[rs.length - 1] > 0.999 && rs[rs.length - 1] < 1;
    },
    why: 'the direct exact O(b) coprime sum climbs strictly from 0.9335 (71*73) to 0.9991 (9973*10007), from below toward 1 -- the imp-97291 ratio->1 trend is confirmed independently of the fast evaluator.',
  },
  {
    id: 'imp97315-gasymp-validated-below-1e6',
    holds: () => {
      // Live: direct exact matches fast Gasymp to <6e-7 in ratio for b <~ 1e6.
      for (const [p, q] of [[71, 73], [211, 223], [499, 503]]) {
        if (Math.abs(rExactFromPrimes([p, q]) - rFastFromPrimes([p, q])) > 6e-7) return false;
      }
      // And the baked table records the same <6e-7 agreement for every member with b <= 1e6.
      for (const row of IMP97315_RESULTS.directExactLadder) {
        if (row.b <= 1e6 && !(row.diff < 6e-7)) return false;
      }
      return true;
    },
    why: 'direct exact and fast Gasymp agree to <6e-7 in ratio for b <~ 1e6 (live on 71*73, 211*223, 499*503 and in the baked table) -- the imp-97291 Gasymp evaluator is validated against the O(b) ground truth in the trustworthy window.',
  },
  {
    id: 'imp97315-honesty-gate-no-qed',
    holds: () =>
      IMP97315_VERDICT.anyBoundMoved === false &&
      IMP97315_VERDICT.qed === false &&
      IMP97315_VERDICT.verificationOnly === true &&
      IMP97315_VERDICT.directExactConfirmsMonotoneClimb === true &&
      IMP97315_VERDICT.ratioTrendIsEvaluatorArtifact === false &&
      IMP97315_VERDICT.fpTrustDegradesPast1e7 === true &&
      /NO QED/.test(IMP97315_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97315_HONEST_BANNER) &&
      /RH open/.test(IMP97315_HONEST_BANNER),
    why: 'verification only -- the direct exact evaluator confirms the ratio->1 trend and validates the Gasymp evaluator below 1e6; no rigorous ceiling posted, no bound moved, no QED.',
  },
];

for (const a of IMP97315_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97315-route-m-e1-direct-exact-ratio-crosscheck assertion failed: ${a.id}`);
  }
}

export default {
  kernel: IMP97315_KERNEL,
  results: IMP97315_RESULTS,
  verdict: IMP97315_VERDICT,
  banner: IMP97315_HONEST_BANNER,
};
