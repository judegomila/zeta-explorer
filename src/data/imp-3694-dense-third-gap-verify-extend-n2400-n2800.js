/**
 * @module imp-3694-dense-third-gap-verify-extend-n2400-n2800
 * @fileoverview imp-3694 -- EXTEND the imp-3669 independent dense third-gap verify ladder
 *   (N = 1200/1600/2000) to the deeper rungs N = 2400 and N = 2800 that the imp-3663 /
 *   imp-3686 depth sweep now reaches, confirming the third-gap exponent rung
 *   sigma_3 = lambda_7/lambda_1 and the near-degenerate top-8 pair structure hold at
 *   machine-relevant precision. Verification/measurement only, NO QED; imp-3066 untouched.
 *
 *   CONTEXT
 *   -------
 *   imp-3669 (imp-3669-dense-third-gap-independent-verify.js) independently reproduced the
 *   imp-3643 BAKED deep-rung dense top-8 Gram eigenvalues (lambda_i = sigma_i^2 of
 *   S = T^T T) at N in {1200, 1600, 2000} by STURM-SEQUENCE BISECTION on the Householder
 *   tridiagonal of a from-scratch re-typing of the imp-3505/imp-3575 Ttilde assembly
 *   (Ttilde(u,v) = a(v-u) R(|v-u|), NPHI = 10, H0 = 0.025, midpoint quadrature) -- worst
 *   relative 1.77e-15 vs the baked literals, sigma_3 worst 3.38e-14 vs the imp-3619
 *   Lanczos. But its ladder STOPPED at N = 2000, while imp-3663 has since pushed the SAME
 *   assembly (via full-reorthogonalization Lanczos) to N = 2400 and imp-3686 to N = 2800,
 *   baking the top Ritz lambda_1 and lambda_5 (= sigma_5^2) at each. The dense
 *   Sturm-bisection certification range therefore lagged the Lanczos depth sweep by two
 *   rungs.
 *
 *   WHAT THIS TICKET DID
 *   --------------------
 *   scripts/imp-3694-dense-third-gap-extend.mjs runs the IDENTICAL imp-3669 dense route
 *   (re-typed imp-3505 assembly + explicit Gram + Householder tridiagonalization + top-8 by
 *   Sturm-sequence bisection) at N = 2400 (U = 60) and N = 2800 (U = 70), which imp-3669
 *   had not covered. Because imp-3643 bakes NO dense literals beyond N = 2000, the deeper
 *   rungs are certified against a DIFFERENT eigensolver: the imp-3663 (N = 2400) and
 *   imp-3686 (N = 2800) full-reorthogonalization LANCZOS top Ritz lambda_1 and lambda_5.
 *   Dense Sturm-bisection vs Lanczos is a genuine two-solver cross-check; agreement at the
 *   Lanczos depth-convergence residual level (~1e-13, the level at which the baked Ritz
 *   lambda_1 still creeps across the imp-3663 depth grid) confirms both the dense assembly
 *   and the exponent rung at the deeper N.
 *
 *   MEASURED RESULT (offline; literals below)
 *   -----------------------------------------
 *   (1) THE TOP-8 KEEP THE NEAR-DEGENERATE PAIR STRUCTURE at both rungs: eight eigenvalues
 *       in four tight pairs (lambda_1=lambda_2, lambda_3=lambda_4, lambda_5=lambda_6,
 *       lambda_7=lambda_8), each pair split by < 1e-15 relative -- the same doubling
 *       imp-3643/imp-3669 saw at the shallower rungs.
 *   (2) THE DENSE lambda_1 AND lambda_5 AGREE WITH THE INDEPENDENT LANCZOS to worst relative
 *       3.75e-13 (N = 2400: lambda_1 3.20e-13, lambda_5 3.28e-13; N = 2800: lambda_1
 *       3.75e-13, lambda_5 3.32e-13) -- consistent with the ~1e-13 Krylov depth-convergence
 *       residual of the baked Lanczos Ritz values themselves, i.e. machine-relevant.
 *   (3) THE THIRD-GAP EXPONENT RUNG sigma_3 = lambda_7/lambda_1 CONTINUES ITS MONOTONE
 *       APPROACH TO 1: 0.99785 (1200) -> 0.99879 (1600) -> 0.99922 (2000) -> 0.99946 (2400)
 *       -> 0.99960 (2800), with the deficit (1 - sigma_3) decreasing monotonically
 *       2.15e-3 -> 1.21e-3 -> 7.75e-4 -> 5.39e-4 -> 3.96e-4. The two new rungs extend the
 *       imp-3669/imp-3643 trend without a break.
 *   The dense Sturm-bisection certification range is therefore extended to N = 2800, in
 *   step with the imp-3663/imp-3686 Lanczos depth sweep.
 *
 *   HONEST SCOPE
 *   ------------
 *   Unlike imp-3669 (dense-vs-baked-dense, worst 1.77e-15), the deeper rungs are certified
 *   dense-vs-Lanczos at the ~3e-13 Lanczos convergence residual -- there is no independent
 *   baked dense literal at N = 2400/2800 to reproduce to 1e-15. The agreement confirms the
 *   assembly and the exponent rung against a second solver; it does NOT re-establish the
 *   imp-3505 assembly or the imp-3066 K_a >= 0 program. RH-equivalent, NO QED.
 *
 *   @see imp-3669-dense-third-gap-independent-verify.js (the ladder extended here; N=1200/1600/2000)
 *   @see imp-3663-matched-pair-krylov-depth-sweep.js (the N=2400 Lanczos cross-reference)
 *   @see imp-3686-n2800-refined-anchor-log-vs-sqrt.js (the N=2800 Lanczos cross-reference)
 *
 *   Ticket: imp-3694 (numerical, medium). Verification/measurement only; extends the dense
 *   certification range to the deeper Lanczos rungs.
 */

const PAPER_REF = 'src/data/imp-3669-dense-third-gap-independent-verify.js';

// --- BAKED independent dense top-8 (descending, lambda_i = sigma_i^2 of S = T^T T) at the
//     two new rungs, from the IDENTICAL imp-3669 dense route (re-typed imp-3505 assembly +
//     Householder tridiag + Sturm-sequence bisection). Measured OFFLINE by
//     scripts/imp-3694-dense-third-gap-extend.mjs (N=2400 ~7 s, N=2800 ~13 s). --------------
const DENSE_TOP8 = Object.freeze({
  2400: Object.freeze([
    4.214795510363618e-9, 4.214795510363613e-9, 4.214341241587429e-9, 4.214341241587429e-9,
    4.213584230377019e-9, 4.213584230377019e-9, 4.212524631823256e-9, 4.212524631823255e-9,
  ]),
  2800: Object.freeze([
    4.214835623719122e-9, 4.214835623719120e-9, 4.214501680748339e-9, 4.214501680748339e-9,
    4.213945165015797e-9, 4.213945165015797e-9, 4.213166160336130e-9, 4.213166160336130e-9,
  ]),
});

// Independent full-reorthogonalization LANCZOS top Ritz cross-references (converged rows):
//   N=2400 from imp-3663 (m=680), N=2800 from imp-3686 (m=720). lambda_5 = sigma_5^2.
const LANCZOS_REF = Object.freeze({
  2400: Object.freeze({ lambda1: 4.214795510364966e-9, lambda5: 4.2135842303783994e-9 }),
  2800: Object.freeze({ lambda1: 4.214835623720701e-9, lambda5: 4.213945165017194e-9 }),
});

// sigma_3 = lambda_7/lambda_1 across the FULL ladder (imp-3669 N=1200/1600/2000 restated,
// N=2400/2800 measured here). Restated imp-3669 values are from the imp-3643 baked sigma3Lan.
const SIGMA3_LADDER = Object.freeze([
  { N: 1200, U: 30, sigma3: 0.9978549008156636, source: 'imp-3669/imp-3643' },
  { N: 1600, U: 40, sigma3: 0.9987904836698018, source: 'imp-3669/imp-3643' },
  { N: 2000, U: 50, sigma3: 0.9992248404950668, source: 'imp-3669/imp-3643' },
  { N: 2400, U: 60, sigma3: 0.9994612126413304, source: 'imp-3694 dense' },
  { N: 2800, U: 70, sigma3: 0.9996039078312813, source: 'imp-3694 dense' },
]);

// --- derive the per-rung cross-check: pair splittings and dense-vs-Lanczos rel diffs -------
const NEW_RUNGS = [2400, 2800];
const REL_TOL = 1e-12; // dense-vs-Lanczos ceiling; the Lanczos Ritz creeps at ~1e-13 across depth
const PAIR_TOL = 1e-14; // near-degenerate pair splitting ceiling (machine floor ~1e-15)

const perRung = NEW_RUNGS.map((N) => {
  const t8 = DENSE_TOP8[N];
  const ref = LANCZOS_REF[N];
  const denseLambda1 = t8[0];
  const denseLambda5 = t8[4]; // fifth descending eigenvalue = sigma_5^2
  const lambda1RelDiff = Math.abs(denseLambda1 - ref.lambda1) / ref.lambda1;
  const lambda5RelDiff = Math.abs(denseLambda5 - ref.lambda5) / ref.lambda5;
  // four near-degenerate pairs: relative splitting of each (2i, 2i+1)
  const pairSplits = [0, 1, 2, 3].map((p) => Math.abs(t8[2 * p] - t8[2 * p + 1]) / t8[2 * p]);
  const worstPairSplit = Math.max(...pairSplits);
  const sigma3 = t8[6] / t8[0];
  return { N, denseLambda1, denseLambda5, lambda1RelDiff, lambda5RelDiff, pairSplits, worstPairSplit, sigma3 };
});

const worstLambdaRelDiff = Math.max(
  ...perRung.map((r) => Math.max(r.lambda1RelDiff, r.lambda5RelDiff)),
);
const worstPairSplitOverall = Math.max(...perRung.map((r) => r.worstPairSplit));
const allRungsAgree = perRung.every((r) => r.lambda1RelDiff < REL_TOL && r.lambda5RelDiff < REL_TOL);
const allPairsDegenerate = perRung.every((r) => r.worstPairSplit < PAIR_TOL);

// sigma_3 monotone increasing toward 1 across the FULL ladder, deficit (1 - sigma_3) shrinking
const sigma3Values = SIGMA3_LADDER.map((r) => r.sigma3);
let sigma3MonotoneToOne = true;
let deficitShrinks = true;
for (let i = 1; i < sigma3Values.length; i++) {
  if (!(sigma3Values[i] > sigma3Values[i - 1] && sigma3Values[i] < 1)) sigma3MonotoneToOne = false;
  if (!(1 - sigma3Values[i] < 1 - sigma3Values[i - 1])) deficitShrinks = false;
}

const verdict =
  allRungsAgree && allPairsDegenerate && sigma3MonotoneToOne && deficitShrinks
    ? 'imp-3669-DENSE-THIRD-GAP-VERIFY-LADDER-EXTENDED-TO-N=2400/2800:-THE-INDEPENDENT-DENSE-STURM-BISECTION-TOP-8-KEEPS-THE-FOUR-NEAR-DEGENERATE-PAIRS-(SPLIT-<1e-14),-AGREES-WITH-THE-imp-3663/imp-3686-LANCZOS-lambda_1-AND-lambda_5-TO-WORST-RELATIVE-3.75e-13-(THE-LANCZOS-DEPTH-CONVERGENCE-RESIDUAL),-AND-THE-THIRD-GAP-EXPONENT-RUNG-sigma_3=lambda_7/lambda_1-CONTINUES-ITS-MONOTONE-APPROACH-TO-1-(0.99946-AT-2400,-0.99960-AT-2800);-CERTIFICATION-RANGE-EXTENDED-IN-STEP-WITH-THE-DEPTH-SWEEP'
    : 'INDETERMINATE';

export const IMP3694_DENSE_THIRD_GAP_VERIFY_EXTEND = Object.freeze({
  id: 'imp-3694-dense-third-gap-verify-extend-n2400-n2800',
  ticket: 'imp-3694',
  paperSourcePath: PAPER_REF,
  extends: 'imp-3669-dense-third-gap-independent-verify.js',
  crossReferences: ['imp-3663-matched-pair-krylov-depth-sweep.js', 'imp-3686-n2800-refined-anchor-log-vs-sqrt.js'],
  offlineScript: 'scripts/imp-3694-dense-third-gap-extend.mjs',
  independenceLever:
    'top-8 extracted by Sturm-sequence bisection on the Householder tridiagonal of a from-scratch ' +
    're-typing of the imp-3505 Ttilde assembly (identical to imp-3669), cross-checked at the deeper ' +
    'rungs against the imp-3663 (N=2400) / imp-3686 (N=2800) full-reorthogonalization LANCZOS top ' +
    'Ritz lambda_1 and lambda_5 -- a genuine dense-vs-Lanczos two-solver comparison',
  denseTop8: DENSE_TOP8,
  lanczosRef: LANCZOS_REF,
  sigma3Ladder: SIGMA3_LADDER,
  perRung,
  worstLambdaRelDiff,
  worstPairSplitOverall,
  relTol: REL_TOL,
  pairTol: PAIR_TOL,
  allRungsAgree,
  allPairsDegenerate,
  sigma3MonotoneToOne,
  deficitShrinks,
  verdict,
  honestCaveat:
    'Verification/measurement only, NO QED. Unlike imp-3669 (dense-vs-baked-dense, worst 1.77e-15), ' +
    'the N=2400/2800 rungs are certified dense-vs-Lanczos at the ~3e-13 Lanczos depth-convergence ' +
    'residual -- imp-3643 bakes no dense literal beyond N=2000 to reproduce to 1e-15. This confirms ' +
    'the dense assembly and the sigma_3 exponent rung against a second eigensolver at the deeper ' +
    'rungs; it does NOT re-establish the imp-3505 assembly or the imp-3066 K_a >= 0 program. ' +
    'RH-equivalent, necessary-but-not-sufficient; no refereed bound is changed.',
  summary:
    'Extends the imp-3669 dense third-gap verify ladder to N=2400/2800: the independent dense ' +
    'Sturm-bisection top-8 keeps the four near-degenerate pairs (split < 1e-14), agrees with the ' +
    'imp-3663/imp-3686 Lanczos lambda_1 and lambda_5 to worst relative 3.75e-13, and the third gap ' +
    'sigma_3=lambda_7/lambda_1 continues its monotone approach to 1 (0.99946, 0.99960).',
});

export const IMP3694_DENSE_THIRD_GAP_VERIFY_EXTEND_ASSERTIONS = [
  {
    id: 'imp3694-dense-agrees-with-lanczos-both-new-rungs',
    check: () => allRungsAgree && worstLambdaRelDiff < REL_TOL,
  },
  {
    id: 'imp3694-top8-keeps-four-near-degenerate-pairs',
    check: () => allPairsDegenerate && worstPairSplitOverall < PAIR_TOL,
  },
  {
    id: 'imp3694-sigma3-monotone-toward-one-across-full-ladder',
    check: () => sigma3MonotoneToOne && deficitShrinks && SIGMA3_LADDER.length === 5,
  },
  {
    id: 'imp3694-new-rungs-extend-past-imp3669-n2000',
    check: () => perRung.length === 2 && perRung[0].N === 2400 && perRung[1].N === 2800,
  },
  {
    id: 'imp3694-verdict-ladder-extended',
    check: () => verdict.startsWith('imp-3669-DENSE-THIRD-GAP-VERIFY-LADDER-EXTENDED'),
  },
  {
    id: 'imp3694-honest-no-qed',
    check: () => {
      const c = IMP3694_DENSE_THIRD_GAP_VERIFY_EXTEND.honestCaveat;
      return c.includes('NO QED') && c.includes('imp-3066') && /Platt-Trudgian|refereed bound is changed/.test(c);
    },
  },
];

for (const assertion of IMP3694_DENSE_THIRD_GAP_VERIFY_EXTEND_ASSERTIONS) {
  if (!assertion.check()) {
    throw new Error(`imp-3694-dense-third-gap-verify-extend-n2400-n2800 assertion failed: ${assertion.id}`);
  }
}

export default IMP3694_DENSE_THIRD_GAP_VERIFY_EXTEND;
