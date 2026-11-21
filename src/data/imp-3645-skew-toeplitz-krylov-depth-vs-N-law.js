/**
 * @module imp-3645-skew-toeplitz-krylov-depth-vs-N-law
 * @fileoverview imp-3645 -- UNIFY the two skew-Toeplitz converged-Krylov-depth
 *   anchors imp-3575 (lambda_3 locks at m >= 280 at N = 1600) and imp-3625
 *   (lambda_5 = lambda_6 locks at m >= 480 at N = 2000), fit whether the minimal
 *   converged depth m*(N) grows linearly / sqrt(N) / log(N), and predict the depth
 *   needed at N in {2400, 3200}.
 *
 *   CONTEXT
 *   -------
 *   imp-3575 traced the imp-3555 N = 1600 gap non-monotonicity to a Lanczos Krylov
 *   UNDER-resolution: the imp-3545 m = 200 reference was 4.03e-4 short in lambda_3
 *   and the top-3 gap rho = lambda_3/lambda_1 only LOCKED (change < 2e-14) at
 *   m >= 280. imp-3625 then found the SAME signature one pair and one ladder-rung
 *   deeper: the imp-3602 lambda_5 = lambda_6 third-pair degeneracy was
 *   Krylov-under-resolved at (N = 2000, m = 440) and locked at m >= 480. Both are
 *   the same converged-depth artifact -- the minimal reorthogonalized Krylov depth
 *   m* needed to pin a leading pair to the machine floor -- at different (N, pair),
 *   but the depth-vs-N growth law was never fit and no depth was ever predicted for
 *   the next ladder rungs.
 *
 *   THIS MODULE assembles the depth-lock anchors already MEASURED by imp-3575 and
 *   imp-3625 (baked from their offline Lanczos-to-m sweeps; no heavy assembly is
 *   re-run here) and fits candidate m*(N) forms through them. It does NOT run any
 *   new Lanczos: the predictions at N in {2400, 3200} are extrapolations of the
 *   existing measured anchors, whose discrimination is left as an explicit sub-gap.
 *
 *   FINDING
 *   -------
 *   (1) THE TWO TICKET-NAMED ANCHORS ARE HETEROGENEOUS IN PAIR INDEX, SO A NAIVE
 *       m*(N) LAW IS UNDER-DETERMINED. The named anchors are (N = 1600, lambda_3 =
 *       pair index 2, m* = 280) and (N = 2000, lambda_5 = lambda_6 = pair index 3,
 *       m* = 480). Two points fit ANY two-parameter form (linear m* = aN + b,
 *       sqrt m* = c sqrt(N) + d, log m* = a ln N + b) EXACTLY with zero residual,
 *       so the two anchors alone CANNOT discriminate linear from sqrt from log.
 *   (2) THE GROWTH BETWEEN THE NAMED ANCHORS IS SUPER-LINEAR IN N, WHICH IS THE
 *       PAIR-INDEX CONFOUND, NOT A GENUINE FIXED-PAIR N-LAW. m* rises 280 -> 480 (a
 *       factor 1.714) while N rises 1600 -> 2000 (a factor 1.25); the depth grows
 *       FASTER than N itself, and far faster than sqrt(N) (factor 1.118). A genuine
 *       fixed-pair Lanczos interior-eigenvalue depth requirement grows at most ~N
 *       (typically ~sqrt(N)) for a fixed relative gap, so a factor-1.71 jump over a
 *       1.25x N step is not a plausible N-only law: the jump is dominated by the
 *       PAIR INDEX (2 -> 3; interior Ritz values converge later than outer ones).
 *   (3) THE HOMOGENEOUS SAME-PAIR (lambda_3, pair 2) EVIDENCE SHOWS m* IS ~FLAT IN N
 *       OVER 1600..2000, CONFIRMING THE CONFOUND. imp-3575 measured lambda_3 locking
 *       at m <= 200 (N = 1200; already converged at the smallest swept depth),
 *       m = 280 (N = 1600) and m = 280 (N = 2000). For the SAME pair, m* does NOT
 *       grow from N = 1600 to N = 2000 -- it holds at 280. So the apparent
 *       280 -> 480 growth in (1) is a pair-index step (2 -> 3), not an N-growth.
 *   (4) PREDICTIONS AND A SAFE ENGINEERING FLOOR. Extrapolating the (undiscriminated)
 *       two-point named-anchor fits to the next rungs gives, at N = 2400: linear
 *       680, sqrt 661, log 644; at N = 3200: linear 1080, sqrt 982, log 902. The
 *       three forms agree to ~5% at N = 2400 but diverge to ~18% at N = 3200, so
 *       the extrapolation is only trustworthy one rung out. A conservative
 *       engineering recommendation for the NEXT pair (index 3+) is m >= ~680 at
 *       N = 2400 and m >= ~1080 at N = 3200 (the linear upper envelope), with a
 *       safety margin, PENDING the matched-pair sweep named below.
 *
 *   NAMED SUB-GAP -- sg-3645-matched-pair-depth-sweep: the m*(N) functional form is
 *   NOT discriminated by these two heterogeneous anchors. Resolving it requires a
 *   MATCHED-PAIR depth sweep -- measure m*(N, pair) for a FIXED pair index across at
 *   least three N (e.g. lambda_5 = lambda_6 at N in {1600, 2000, 2400}) -- to (a)
 *   separate the pair-index dependence from the N dependence and (b) obtain a third
 *   same-pair anchor that can distinguish linear from sqrt from log. Only then can a
 *   depth be PREDICTED (rather than bracketed) for N in {2400, 3200}.
 *
 *   @see imp-3575-skew-toeplitz-gap-N1600-krylov-reconverge.js (lambda_3 lock at m>=280, N=1600; same-pair anchors)
 *   @see imp-3625-skew-toeplitz-pair56-krylov-depth.js (lambda_5=lambda_6 lock at m>=480, N=2000)
 *   @see imp-3505-power-iteration-budget-convergence-sweep.js (the identical Ttilde assembly + Lanczos routine)
 *   @see imp-3602-skew-toeplitz-second-gap-exponent.js (the m=440 under-resolved reference imp-3625 corrected)
 *
 *   Ticket: imp-3645 (numerical, medium). MEASUREMENT/FIT only: unifies two already
 *   measured depth-lock anchors and assesses the depth-vs-N form; it does NOT run
 *   new Lanczos, does NOT construct the missing magnitude, and does NOT attempt the
 *   imp-3066 K_a >= 0 positivity. RH-EQUIVALENT. NO RH verdict, NO QED.
 *   No refereed bound is changed.
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// --- The two ticket-named converged-depth anchors, as MEASURED offline by imp-3575
//     (lambda_3 locks at m>=280 at N=1600) and imp-3625 (lambda_5=lambda_6 locks at
//     m>=480 at N=2000). pairIndex is the leading-pair index (pair 2 = lambda_3/lambda_4,
//     pair 3 = lambda_5/lambda_6). Baked from those modules; no Lanczos re-run here. ---
const NAMED_ANCHORS = Object.freeze([
  { N: 1600, pairIndex: 2, pair: 'lambda_3', mStar: 280, source: 'imp-3575-skew-toeplitz-gap-N1600-krylov-reconverge' },
  { N: 2000, pairIndex: 3, pair: 'lambda_5=lambda_6', mStar: 480, source: 'imp-3625-skew-toeplitz-pair56-krylov-depth' },
]);

// --- Homogeneous SAME-PAIR (lambda_3, pair index 2) depth-lock anchors from imp-3575,
//     used to test whether m* grows in N for a FIXED pair. At N=1200 lambda_3 is
//     already converged at the smallest swept depth m=200, so m* there is an UPPER
//     BOUND (<= 200), not an exact lock; flagged mStarIsUpperBound. ------------------
const SAME_PAIR2_ANCHORS = Object.freeze([
  { N: 1200, pairIndex: 2, mStar: 200, mStarIsUpperBound: true, note: 'converged at smallest swept m=200 -> m* <= 200' },
  { N: 1600, pairIndex: 2, mStar: 280, mStarIsUpperBound: false, note: 'imp-3575: lambda_3 locks at m>=280' },
  { N: 2000, pairIndex: 2, mStar: 280, mStarIsUpperBound: false, note: 'imp-3575: lambda_3 locks at m>=280 (N=2000 rho table)' },
]);

const PREDICT_AT_N = Object.freeze([2400, 3200]);

// --- (1) two-point fits through the named anchors. Two points fit any 2-param form
//     exactly (zero residual) -- so they cannot discriminate the functional form. ----
const a1 = NAMED_ANCHORS[0]; // (1600, 280)
const a2 = NAMED_ANCHORS[1]; // (2000, 480)

// linear  m* = aL*N + bL
const aL = (a2.mStar - a1.mStar) / (a2.N - a1.N);
const bL = a1.mStar - aL * a1.N;
// sqrt    m* = aS*sqrt(N) + bS
const s1 = Math.sqrt(a1.N);
const s2 = Math.sqrt(a2.N);
const aS = (a2.mStar - a1.mStar) / (s2 - s1);
const bS = a1.mStar - aS * s1;
// log     m* = aG*ln(N) + bG
const g1 = Math.log(a1.N);
const g2 = Math.log(a2.N);
const aG = (a2.mStar - a1.mStar) / (g2 - g1);
const bG = a1.mStar - aG * g1;

const predictLinear = (N) => aL * N + bL;
const predictSqrt = (N) => aS * Math.sqrt(N) + bS;
const predictLog = (N) => aG * Math.log(N) + bG;

const predictions = PREDICT_AT_N.map((N) => {
  const linear = predictLinear(N);
  const sqrt = predictSqrt(N);
  const log = predictLog(N);
  const vals = [linear, sqrt, log];
  const lo = Math.min(...vals);
  const hi = Math.max(...vals);
  return {
    N,
    linear,
    sqrt,
    log,
    lo,
    hi,
    spreadFrac: (hi - lo) / lo, // relative disagreement across the three forms
    recommendedFloor: Math.ceil(hi), // conservative upper-envelope engineering floor
  };
});

// --- (2) the growth between the two named anchors is super-linear in N -------------
const mStarGrowthFactor = a2.mStar / a1.mStar; // 480/280 = 1.714...
const nGrowthFactor = a2.N / a1.N; // 2000/1600 = 1.25
const sqrtNGrowthFactor = Math.sqrt(nGrowthFactor); // 1.118...
// depth grows faster than N (and far faster than sqrt N) => not a plausible fixed-pair N law
const growthIsSuperLinearInN = mStarGrowthFactor > nGrowthFactor;
const growthExceedsSqrtN = mStarGrowthFactor > sqrtNGrowthFactor;

// --- (3) same-pair (pair 2) m* is ~flat across N=1600..2000 (the pair-index confound) --
const p2_1600 = SAME_PAIR2_ANCHORS.find((r) => r.N === 1600).mStar;
const p2_2000 = SAME_PAIR2_ANCHORS.find((r) => r.N === 2000).mStar;
const samePairFlatOver1600to2000 = p2_1600 === p2_2000; // 280 == 280 -> no N-growth for fixed pair
// so the named-anchor 280->480 jump is a pair-index step (2->3), not an N-growth
const namedJumpIsPairIndexNotN = growthIsSuperLinearInN && samePairFlatOver1600to2000;

// --- (4) predictions agree one rung out, diverge two rungs out ---------------------
const pred2400 = predictions.find((p) => p.N === 2400);
const pred3200 = predictions.find((p) => p.N === 3200);
const formsAgreeOneRungOut = pred2400.spreadFrac < 0.06; // ~5% at N=2400
const formsDivergeTwoRungsOut = pred3200.spreadFrac > pred2400.spreadFrac * 2; // grows with N

const verdict =
  growthIsSuperLinearInN &&
  growthExceedsSqrtN &&
  samePairFlatOver1600to2000 &&
  namedJumpIsPairIndexNotN &&
  formsAgreeOneRungOut &&
  formsDivergeTwoRungsOut
    ? 'm*(N)-FORM-UNDER-DETERMINED-BY-TWO-HETEROGENEOUS-ANCHORS:-NAMED-280(N=1600,pair2)->480(N=2000,pair3)-IS-SUPER-LINEAR-IN-N-(x1.714-vs-x1.25),-A-PAIR-INDEX-STEP-NOT-AN-N-LAW-(SAME-PAIR-lambda_3-FLAT-AT-280-OVER-N=1600..2000);-TWO-POINT-LINEAR/SQRT/LOG-FITS-AGREE-~5%25-AT-N=2400-(661..680)-BUT-DIVERGE-~18%25-AT-N=3200-(902..1080);-DISCRIMINATION-NEEDS-A-MATCHED-PAIR-SWEEP-(sg-3645)'
    : 'INDETERMINATE';

export const IMP3645_SKEW_TOEPLITZ_KRYLOV_DEPTH_VS_N_LAW = Object.freeze({
  id: 'imp-3645-skew-toeplitz-krylov-depth-vs-N-law',
  ticket: 'imp-3645',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  unifies: [
    'imp-3575-skew-toeplitz-gap-N1600-krylov-reconverge.js',
    'imp-3625-skew-toeplitz-pair56-krylov-depth.js',
  ],

  summary:
    'UNIFIES the two skew-Toeplitz converged-Krylov-depth anchors -- imp-3575 (lambda_3 locks at m >= 280 at N = 1600) ' +
    'and imp-3625 (lambda_5 = lambda_6 locks at m >= 480 at N = 2000) -- and fits whether the minimal converged depth ' +
    'm*(N) grows linearly / sqrt / log, predicting the depth at N in {2400, 3200}. FINDING: the two ticket-named ' +
    'anchors are HETEROGENEOUS in pair index (pair 2 = lambda_3 at N = 1600; pair 3 = lambda_5 = lambda_6 at N = 2000), ' +
    'so a naive m*(N) law is UNDER-DETERMINED -- two points fit any two-parameter form (linear/sqrt/log) exactly with ' +
    'zero residual and cannot discriminate them. The named 280 -> 480 rise is a factor 1.714 while N rises only a ' +
    'factor 1.25, i.e. SUPER-LINEAR in N and far faster than sqrt(N) (1.118); a genuine fixed-pair Lanczos ' +
    'interior-eigenvalue depth grows at most ~N, so the jump is dominated by the PAIR INDEX (2 -> 3; interior Ritz ' +
    'values converge later), NOT an N-law. The HOMOGENEOUS same-pair (lambda_3, pair 2) evidence confirms this: ' +
    'imp-3575 locked lambda_3 at m <= 200 (N = 1200), m = 280 (N = 1600) and m = 280 (N = 2000), so for a FIXED pair ' +
    'm* is FLAT at 280 across N = 1600..2000 -- no N-growth. Extrapolating the (undiscriminated) two-point named-anchor ' +
    'fits gives at N = 2400: linear 680, sqrt 661, log 644 (agree to ~5%); at N = 3200: linear 1080, sqrt 982, log 902 ' +
    '(diverge to ~18%), so the extrapolation is trustworthy only one rung out. A conservative engineering floor for the ' +
    'next pair is m >= ~680 (N = 2400) and m >= ~1080 (N = 3200), with margin. NAMED SUB-GAP sg-3645-matched-pair-' +
    'depth-sweep: discriminating the form needs a MATCHED-PAIR sweep (fixed pair index, >= 3 values of N) to separate ' +
    'the pair-index dependence from the N dependence. Measurement/fit only; runs no new Lanczos; does NOT construct the ' +
    'missing magnitude and does NOT attempt the imp-3066 K_a >= 0 positivity; RH-EQUIVALENT; NO RH verdict, NO QED. ' +
    'No refereed bound is changed.',

  construction: Object.freeze({
    quantityFitted: 'm*(N, pair) = minimal reorthogonalized Lanczos Krylov depth that pins a leading pair to the < 2e-14 machine floor',
    namedAnchors: NAMED_ANCHORS,
    samePairAnchors: SAME_PAIR2_ANCHORS,
    candidateForms: ['linear m*=a N + b', 'sqrt m*=a sqrt(N) + b', 'log m*=a ln N + b'],
    fitMethod: 'exact two-point interpolation through the two ticket-named anchors (each two-parameter form is exactly determined, zero residual)',
    predictAtN: PREDICT_AT_N,
    runsNewLanczos: false,
    measuredOffline: 'all depth-lock anchors are baked from the imp-3575 / imp-3625 offline Lanczos-to-m sweeps; this module runs no heavy assembly and re-derives the fits/predictions arithmetically',
    selfComputing: true,
  }),

  measured: Object.freeze({
    namedAnchors: NAMED_ANCHORS,
    samePairAnchors: SAME_PAIR2_ANCHORS,
    linearFit: { slope: aL, intercept: bL }, // m* = 0.5 N - 520
    sqrtFit: { slope: aS, intercept: bS },
    logFit: { slope: aG, intercept: bG },
    predictions, // per-N linear/sqrt/log + spread + recommended floor
    pred2400,
    pred3200,
    mStarGrowthFactor, // 1.714 (480/280)
    nGrowthFactor, // 1.25 (2000/1600)
    sqrtNGrowthFactor, // 1.118
    growthIsSuperLinearInN, // true -- m* grows faster than N
    growthExceedsSqrtN, // true -- and far faster than sqrt(N)
    samePairFlatOver1600to2000, // true -- fixed-pair lambda_3 m* = 280 at both N
    namedJumpIsPairIndexNotN, // true -- the 280->480 jump is a pair-index step
    formsAgreeOneRungOut, // true -- ~5% spread at N=2400
    formsDivergeTwoRungsOut, // true -- spread grows to ~18% at N=3200
    subGap: 'sg-3645-matched-pair-depth-sweep',
    verdict,
  }),

  interpretation: Object.freeze({
    twoAnchorsUnderDetermineForm:
      'The ticket asks whether m*(N) grows linearly, sqrt, or log. With only two measured anchors -- and those two at ' +
      'DIFFERENT pair indices -- any two-parameter form fits exactly (zero residual), so the functional form is not ' +
      'discriminated. Fitting a growth law to two heterogeneous points is a mis-specified question until a third ' +
      'same-pair anchor exists.',
    pairIndexConfound:
      'The named 280 (N=1600, pair 2) -> 480 (N=2000, pair 3) rise is super-linear in N (factor 1.714 vs the N factor ' +
      '1.25, and vs the sqrt(N) factor 1.118). A genuine fixed-pair Lanczos interior-eigenvalue depth grows at most ' +
      '~N for a fixed relative gap, so a factor-1.71 jump over a 1.25x N step cannot be an N-only law -- it is driven ' +
      'by the pair index moving 2 -> 3 (interior Ritz values converge later than outer ones).',
    samePairIsFlat:
      'The homogeneous same-pair evidence settles it: imp-3575 locked lambda_3 (pair 2) at m <= 200 (N=1200), m=280 ' +
      '(N=1600) and m=280 (N=2000). For a FIXED pair, m* does NOT grow from N=1600 to N=2000 -- it holds at 280. So ' +
      'over this ladder range the N-dependence of the fixed-pair depth is negligible and the observed growth is ' +
      'pair-index-driven.',
    predictionsAndFloor:
      'Extrapolating the (undiscriminated) two-point fits: N=2400 gives linear 680 / sqrt 661 / log 644 (~5% spread), ' +
      'N=3200 gives linear 1080 / sqrt 982 / log 902 (~18% spread). Trustworthy one rung out only. Conservative ' +
      'engineering floor (linear upper envelope, add margin): m >= ~680 at N=2400, m >= ~1080 at N=3200 for the next ' +
      'pair index.',
    whatItAddsOverImp3575And3625:
      'imp-3575 and imp-3625 each located one depth-lock anchor and noted the shared under-resolution pattern. This ' +
      'module UNIFIES them into a single depth-vs-N picture, shows the naive m*(N) fit is under-determined and ' +
      'pair-index-confounded, gives bracketed predictions for the next two rungs, and names the matched-pair sweep ' +
      'needed to turn the bracket into a prediction.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    formNotDiscriminated:
      'Two measured anchors (at different pair indices) fit any two-parameter form exactly, so linear vs sqrt vs log ' +
      'is NOT discriminated. The predictions at N in {2400,3200} are extrapolations of an under-determined fit, not a ' +
      'measured or derived law.',
    predictionsAreBracketsNotMeasurements:
      'No new Lanczos was run: the N in {2400,3200} depths are the spread of three two-point extrapolations (~5% at ' +
      'N=2400, ~18% at N=3200), not measured lock depths. The recommended floors are conservative engineering ' +
      'brackets, not certified minima.',
    pairIndexConfoundUnresolved:
      'The two named anchors differ in pair index (2 vs 3), so their 280->480 jump conflates pair-index growth with ' +
      'N-growth. The same-pair evidence indicates the N-growth for a fixed pair is negligible over 1600..2000; the ' +
      'matched-pair sweep sg-3645-matched-pair-depth-sweep is needed to isolate the two dependences.',
    assessesNotConstructs:
      'This unifies and fits two previously measured depth-lock anchors; it does NOT construct the missing magnitude ' +
      'and does NOT attempt the imp-3066 K_a >= 0 positivity.',
    didNotAttemptPositivity: true,
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3645_SKEW_TOEPLITZ_KRYLOV_DEPTH_VS_N_LAW_ASSERTIONS = [
  {
    id: 'imp3645-named-anchors-reproduce-imp3575-imp3625',
    why: 'Self-check: the two unified anchors must be exactly the imp-3575 lambda_3 lock (N=1600, m*=280) and the ' +
      'imp-3625 lambda_5=lambda_6 lock (N=2000, m*=480), the two depths the ticket names.',
    holds: () =>
      a1.N === 1600 && a1.mStar === 280 && a1.pairIndex === 2 &&
      a2.N === 2000 && a2.mStar === 480 && a2.pairIndex === 3,
  },
  {
    id: 'imp3645-two-point-fits-are-exact-at-anchors',
    why: 'Each two-parameter form must interpolate BOTH anchors exactly (zero residual) -- this is precisely why two ' +
      'heterogeneous points cannot discriminate the functional form.',
    holds: () => {
      const ok = (f) => Math.abs(f(a1.N) - a1.mStar) < 1e-9 && Math.abs(f(a2.N) - a2.mStar) < 1e-9;
      return ok(predictLinear) && ok(predictSqrt) && ok(predictLog);
    },
  },
  {
    id: 'imp3645-growth-is-super-linear-in-N',
    why: 'THE PRIMARY DELIVERABLE (part 1): the named-anchor m* growth (480/280 ~ 1.714) must exceed the N growth ' +
      '(2000/1600 = 1.25) and far exceed sqrt(N) (1.118), so it is NOT a plausible fixed-pair N-only law.',
    holds: () => growthIsSuperLinearInN && growthExceedsSqrtN && Math.abs(mStarGrowthFactor - 480 / 280) < 1e-12,
  },
  {
    id: 'imp3645-same-pair-flat-confirms-pair-index-confound',
    why: 'THE PRIMARY DELIVERABLE (part 2): the homogeneous same-pair (lambda_3) m* must be FLAT at 280 across ' +
      'N=1600..2000, showing the named 280->480 jump is a pair-index step (2->3), not an N-growth.',
    holds: () => samePairFlatOver1600to2000 && p2_1600 === 280 && p2_2000 === 280 && namedJumpIsPairIndexNotN,
  },
  {
    id: 'imp3645-predictions-agree-one-rung-diverge-two-rungs',
    why: 'The three-form predictions must AGREE to ~5% one rung out (N=2400) but DIVERGE (>2x the N=2400 spread) two ' +
      'rungs out (N=3200), bounding how far the under-determined extrapolation is trustworthy.',
    holds: () =>
      formsAgreeOneRungOut && formsDivergeTwoRungsOut &&
      pred2400.lo > 600 && pred2400.hi < 720 &&
      pred3200.lo > 850 && pred3200.hi < 1150,
  },
  {
    id: 'imp3645-verdict-form-under-determined-located',
    why: 'The classified verdict must be the confirming under-determined / pair-index-confound result, not ' +
      'indeterminate; a flip means the super-linear growth, the same-pair flatness, or the prediction spread failed.',
    holds: () => verdict.startsWith('m*(N)-FORM-UNDER-DETERMINED-BY-TWO-HETEROGENEOUS-ANCHORS'),
  },
  {
    id: 'imp3645-honest-assessment-no-qed',
    why: 'Mandatory honesty: MEASUREMENT/FIT only -- form not discriminated, predictions are brackets, pair-index ' +
      'confound unresolved (sub-gap named), positivity not attempted, RH-equivalent, no refereed bound is changed. Any flip ' +
      'over-claims.',
    holds: () => {
      const c = IMP3645_SKEW_TOEPLITZ_KRYLOV_DEPTH_VS_N_LAW.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.didNotAttemptPositivity === true &&
        typeof c.formNotDiscriminated === 'string' &&
        typeof c.pairIndexConfoundUnresolved === 'string' &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3645_SKEW_TOEPLITZ_KRYLOV_DEPTH_VS_N_LAW_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3645-skew-toeplitz-krylov-depth-vs-N-law assertion failed: ${assertion.id}`);
  }
}

export default IMP3645_SKEW_TOEPLITZ_KRYLOV_DEPTH_VS_N_LAW;
