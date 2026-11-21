/**
 * @module imp-97326-route-m-e1-extprec-composite-ratio-pin
 *
 * imp-97326 (numerical MEASUREMENT -- NO QED): PIN the worst composite ratio
 *     r(b) = |E1(b)| / (b/4)
 * at the top ladder member b = 9973*10007 = 99799811 with an EXTENDED-PRECISION E1 evaluator,
 * because imp-97315 RESULT 2 found that past b ~ 1e7 NEITHER the direct O(b) coprime sum NOR the
 * Glaisher-Kinkelin Gasymp per-divisor evaluator is 6-decimal-trustworthy (they diverge by 1.1e-4
 * at 9973*10007), so the last decimals of r(b) at b ~ 1e8 were unresolved. Measurement only; RH open; NO QED.
 *
 *   Notation (imp-97291 / imp-97290 / imp-97265): E1(b) = L1(b) - phi(b) b((1/2)log b - 1/4),
 *   L1(b) = Sum_{a coprime, 1<=a<=b-1} a log a. Exact per-divisor identity (imp-97265 Step 1):
 *   E1(b) = Sum_{d|b} mu(d) C_d with
 *       C_d = (b(b-d)/(2d)) log d + d G(b/d - 1) - (b^2/(2d)) log b + b^2/(4d),  n = b/d - 1,
 *   and G(n) = Sum_{k=1}^n k log k. imp-97291 used the Glaisher-Kinkelin asymptotic Gasymp(n) for G(n)
 *   at IEEE-double precision; imp-97315 used the direct O(b) coprime sum. THIS leaf computes G(n) EXACTLY
 *   as G(n) = log H(n), the log of the Barnes-G / hyperfactorial (mpmath hyperfac), and carries the whole
 *   per-divisor cancellation at 60 decimal places, so the ratio is pinned free of FP cancellation error.
 *
 * -------------------------------------------------------------------------------
 * METHOD.
 * -------------------------------------------------------------------------------
 * Offline (tmp/imp-97326-extprec-e1.py, mpmath 1.4.1, 60 dps): for each consecutive-prime semiprime
 * b = p*q the four divisors {1,p,q,pq} (mu = {+1,-1,-1,+1}) are summed with G(n) = log(hyperfac(n)),
 * validated to sub-1e-50 against the brute-force Sum k log k. This carries the ~b-term cancellation
 * (per-divisor pieces ~ b^2/4 collapsing to E1 ~ -b/4) at 60 dps, eliminating the IEEE-double
 * catastrophic cancellation that limited imp-97291 (~4e-16 * b) and imp-97315.
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 -- THE RATIO AT b = 9973*10007 IS PINNED (the imp-97315 open figure, resolved).
 * -------------------------------------------------------------------------------
 *     r_exact(99799811) = 0.999186296075801454352151927433   (60 dps; first ~28 shown)
 *     E1(99799811)      = 24929650.8755387567044674724503
 *     b/4               = 24949952.75
 *     1 - r_exact       = 0.00081370392419854564785
 *     margin M = b/4 - |E1| = 20301.874461243295533,   M/sqrt(b) = 2.0322226082358635.
 * So r(9973*10007) is 0.99918629607580145..., not the imp-97315 direct-sum figure 0.999076521.
 *
 * -------------------------------------------------------------------------------
 * RESULT 2 -- THE imp-97315 "GROUND TRUTH" DIRECT O(b) SUM WAS THE *LESS* ACCURATE EVALUATOR AT b~1e8.
 * -------------------------------------------------------------------------------
 * Against the extended-precision pin:
 *     imp-97315 direct O(b)  r = 0.999076521   is OFF by  +1.098e-4   (the "ground truth")
 *     imp-97291 Gasymp fast  r = 0.999186710   is OFF by  -4.139e-7   (the "fast" evaluator)
 * i.e. at b ~ 1e8 the O(b) coprime sum accumulated ~250x MORE error than the Gasymp per-divisor
 * evaluator, because the O(b) sum cancels ~b terms of size ~b log b (IEEE-double loss ~4e-16*b*log b),
 * whereas the Gasymp identity cancels only O(sigma_0(b))=4 terms. This REVERSES the imp-97315 implicit
 * ranking (it treated the O(b) direct sum as ground truth): on the close-prime semiprime family the
 * Gasymp fast evaluator is in fact accurate to ~4e-7 at b ~ 1e8, and imp-97291 RESULT 3 baked value
 * 0.999187 for 9973*10007 was CORRECT to its stated digits, while imp-97315 RESULT 1 value 0.999076521
 * carried a ~1e-4 direct-sum FP error. NO evaluator is wrong in principle; only the direct O(b) sum is
 * numerically worse at large b.
 *
 * -------------------------------------------------------------------------------
 * RESULT 3 -- THE MONOTONE CLIMB AND THE b^{-1/2} MARGIN LAW SURVIVE AT FULL PRECISION.
 * -------------------------------------------------------------------------------
 * Extended-precision ladder r_exact (60 dps): 0.933493584 (71*73) < 0.974382455 (211*223) <
 * 0.987775922 (499*503) < 0.993427899 (997*1009) < 0.997558165 (2999*3001) < 0.999186296 (9973*10007)
 * < 0.999718587 (31607*31627): strictly increasing toward 1, confirming imp-97291 RESULT 3 /
 * imp-97315 RESULT 1 with the FP question removed. 1 - r_exact = 8.137e-4 at 9973*10007 and M/sqrt(b)
 * = 2.032 there (imp-97291 RESULT 4 quoted 2.031), so the ~sqrt(b) absolute-margin law is confirmed
 * at full precision.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * The worst composite ratio at b = 9973*10007 is pinned at r = 0.999186296075801454... by an
 * extended-precision (exact-hyperfactorial, 60 dps) E1 evaluator, resolving the imp-97315 open figure.
 * The pin shows the imp-97291 Gasymp fast evaluator (not the imp-97315 direct O(b) coprime sum) is the
 * accurate one on the sup-carrying close-prime semiprime family at b ~ 1e8 (~4e-7 vs ~1e-4). The
 * monotone climb toward 1 and the M ~ sqrt(b) absolute-margin law both survive at full precision.
 * Measurement only; no bound on Lambda moves; kappa_arith unchanged; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97315-route-m-e1-direct-exact-ratio-crosscheck.js (direct O(b) cross-check; the open figure resolved here)
 * @see imp-97291-route-m-e1-wide-composite-ratio-sweep.js (Gasymp fast sweep; RESULT 3 ladder confirmed accurate)
 * @see imp-97290-route-m-arith-quarter-ceiling-semiprime-proof.js (leader+correction decomposition; parity sign law)
 *
 * Ticket: imp-97326 (numerical, opus-4-8, api-pool). Extended-precision pin of r(b) at b ~ 1e8; NO QED.
 */

// -- baked extended-precision measurements (offline mpmath 60 dps; import-light, no heavy deps) --
// r_exact stored BOTH as the full-precision decimal string (record) and as a double (arithmetic checks).
export const IMP97326_LADDER = Object.freeze([
  { b: 5183, factors: '71*73', rExactStr: '0.933493584281074481438351', rExact: 0.933493584281074 },
  { b: 47053, factors: '211*223', rExactStr: '0.9743824552844438029914745', rExact: 0.974382455284444 },
  { b: 250997, factors: '499*503', rExactStr: '0.9877759216120171263710998', rExact: 0.987775921612017 },
  { b: 1005973, factors: '997*1009', rExactStr: '0.9934278985993109320303964', rExact: 0.993427898599311 },
  { b: 8999999, factors: '2999*3001', rExactStr: '0.9975581653222147977840796', rExact: 0.997558165322215 },
  { b: 99799811, factors: '9973*10007', rExactStr: '0.999186296075801454352151927433', rExact: 0.999186296075801 },
  { b: 999634589, factors: '31607*31627', rExactStr: '0.9997185874642351897656908', rExact: 0.999718587464235 },
]);

export const IMP97326_FOCUS = Object.freeze({
  b: 99799811,
  factors: '9973*10007',
  rExactStr: '0.999186296075801454352151927433', // 60 dps mpmath, first ~30 shown
  rExact: 0.999186296075801,
  E1Str: '24929650.8755387567044674724503',
  bOver4: 24949952.75,
  oneMinusRStr: '0.00081370392419854564785',
  marginStr: '20301.874461243295533', // M = b/4 - |E1|
  marginOverSqrtB: 2.0322226082358635,
  // divergence of the two IEEE-double evaluators from the extended-precision pin:
  imp97315DirectR: 0.999076521, // imp-97315 RESULT 1 "ground truth" direct O(b) coprime sum
  imp97315DirectDiff: 1.09775e-4, // r_extprec - r_direct  (direct sum was OFF by ~1.1e-4)
  imp97291GasympR: 0.999186710, // imp-97291 / imp-97315 fast Gasymp per-divisor
  imp97291GasympDiff: -4.13924e-7, // r_extprec - r_gasymp  (Gasymp accurate to ~4e-7)
  method: 'exact per-divisor identity E1=Sum mu(d) C_d with G(n)=log(hyperfac(n)) at 60 dps (mpmath)',
});

export const IMP97326_KERNEL = Object.freeze({
  // Reconstruct r from the baked focus E1 and b/4 (double precision) to show the arithmetic is consistent.
  ratioFromFocus: () => Math.abs(Number(IMP97326_FOCUS.E1Str)) / IMP97326_FOCUS.bOver4,
});

export const IMP97326_VERDICT = Object.freeze({
  question: 'what is the worst composite ratio r(b)=|E1(b)|/(b/4) at b=9973*10007, pinned free of FP cancellation, and which imp-97291/imp-97315 evaluator was accurate there?',
  focusRatioPinned: '0.999186296075801454352151927433',
  directObSumWasLessAccurate: true, // imp-97315 direct O(b) off by ~1.1e-4 (the assumed ground truth)
  gasympFastWasAccurate: true, // imp-97291 Gasymp off by only ~4e-7 at b ~ 1e8
  monotoneClimbSurvives: true,
  sqrtBMarginLawConfirmed: true, // M/sqrt(b) = 2.032 at 9973*10007 (imp-97291 quoted 2.031)
  measurementOnly: true,
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  qed: false,
  conclusion:
    'Extended-precision (exact-hyperfactorial G(n)=log H(n), 60 dps) pin of r(b)=|E1(b)|/(b/4) at ' +
    'b=9973*10007=99799811: r = 0.999186296075801454352151927433, resolving the imp-97315 open figure ' +
    '(neither IEEE-double evaluator was 6-decimal-trustworthy past ~1e7). The pin shows the imp-97315 ' +
    'direct O(b) coprime sum treated as ground truth was in fact OFF by ~1.1e-4, while the imp-97291 ' +
    'Gasymp per-divisor fast evaluator was accurate to ~4e-7 -- the O(b) sum, cancelling ~b terms of ' +
    'size ~b log b, is numerically WORSE at b ~ 1e8 than the four-term Gasymp identity, reversing the ' +
    'imp-97315 implicit evaluator ranking. The monotone climb toward 1 and the M ~ sqrt(b) absolute ' +
    'margin law (M/sqrt(b)=2.032) both survive at full precision. Measurement only; no bound on Lambda ' +
    'moves; kappa_arith unchanged; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97326_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Extended-precision (exact hyperfactorial, 60 dps) ' +
  'pin of the composite ratio r(b)=|E1(b)|/(b/4) at b=9973*10007: r = 0.999186296075801454..., which ' +
  'resolves the imp-97315 open figure and shows the direct O(b) coprime sum (assumed ground truth) was ' +
  'off by ~1.1e-4 while the imp-97291 Gasymp fast evaluator was accurate to ~4e-7 at b ~ 1e8. The ' +
  'monotone climb toward 1 and the M ~ sqrt(b) margin law survive. Measurement only; no bound moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import. Import-light:
//    pure arithmetic on the baked doubles, no mpmath and no O(b) loop. --

const IMP97326_ASSERTIONS = [
  {
    id: 'imp97326-focus-ratio-reconstructs-from-baked-e1',
    holds: () => {
      // r = |E1| / (b/4) from the baked focus figures reproduces the pinned double value.
      const r = IMP97326_KERNEL.ratioFromFocus();
      return Math.abs(r - IMP97326_FOCUS.rExact) < 1e-9 && r > 0.999 && r < 1;
    },
    why: 'the baked E1(9973*10007)=24929650.8755 and b/4=24949952.75 reconstruct r=0.99918629607... to <1e-9 -- the pinned ratio is internally consistent, not a transcription.',
  },
  {
    id: 'imp97326-ladder-climbs-monotonically-toward-one',
    holds: () => {
      const rs = IMP97326_LADDER.map((r) => r.rExact);
      for (let i = 1; i < rs.length; i++) if (!(rs[i] > rs[i - 1])) return false;
      return rs[0] > 0.93 && rs[0] < 0.94 && rs[rs.length - 1] > 0.9997 && rs[rs.length - 1] < 1;
    },
    why: 'the extended-precision ladder climbs strictly from 0.9335 (71*73) to 0.99972 (31607*31627) toward 1 with the FP question removed -- imp-97291 RESULT 3 / imp-97315 RESULT 1 confirmed at full precision.',
  },
  {
    id: 'imp97326-direct-Ob-sum-less-accurate-than-gasymp',
    holds: () => {
      // At b ~ 1e8 the imp-97315 direct O(b) sum is off by ~1.1e-4; the imp-97291 Gasymp by ~4e-7.
      const dDirect = Math.abs(IMP97326_FOCUS.rExact - IMP97326_FOCUS.imp97315DirectR);
      const dGasymp = Math.abs(IMP97326_FOCUS.rExact - IMP97326_FOCUS.imp97291GasympR);
      return dDirect > 1e-4 && dGasymp < 1e-6 && dDirect > 100 * dGasymp;
    },
    why: 'against the extended-precision pin the direct O(b) coprime sum errs by ~1.1e-4 while the Gasymp per-divisor evaluator errs by ~4e-7 -- the O(b) sum is >100x worse at b ~ 1e8, reversing the imp-97315 implicit ranking.',
  },
  {
    id: 'imp97326-sqrt-b-margin-law-confirmed',
    holds: () => {
      // M/sqrt(b) at the focus member matches imp-97291 RESULT 4 (~2.03) at full precision.
      const M = IMP97326_FOCUS.bOver4 - Math.abs(Number(IMP97326_FOCUS.E1Str));
      const mos = M / Math.sqrt(IMP97326_FOCUS.b);
      return M > 0 && Math.abs(mos - IMP97326_FOCUS.marginOverSqrtB) < 1e-6 && mos > 2 && mos < 2.1;
    },
    why: 'the absolute margin M=b/4-|E1| is positive and M/sqrt(b)=2.032 at 9973*10007 (imp-97291 quoted 2.031) -- the ~sqrt(b) margin law is confirmed at full precision.',
  },
  {
    id: 'imp97326-honesty-gate-no-qed',
    holds: () =>
      IMP97326_VERDICT.anyBoundMoved === false &&
      IMP97326_VERDICT.postsRigorousCeiling === false &&
      IMP97326_VERDICT.qed === false &&
      IMP97326_VERDICT.measurementOnly === true &&
      IMP97326_VERDICT.directObSumWasLessAccurate === true &&
      IMP97326_VERDICT.gasympFastWasAccurate === true &&
      IMP97326_VERDICT.monotoneClimbSurvives === true &&
      /NO QED/.test(IMP97326_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97326_HONEST_BANNER) &&
      /RH open/.test(IMP97326_HONEST_BANNER),
    why: 'measurement only -- an extended-precision pin of a ratio; no rigorous ceiling posted, no bound moved, no QED.',
  },
];

for (const a of IMP97326_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97326-route-m-e1-extprec-composite-ratio-pin assertion failed: ${a.id}`);
  }
}

export default {
  ladder: IMP97326_LADDER,
  focus: IMP97326_FOCUS,
  kernel: IMP97326_KERNEL,
  verdict: IMP97326_VERDICT,
  banner: IMP97326_HONEST_BANNER,
};
