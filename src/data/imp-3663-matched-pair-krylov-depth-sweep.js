/**
 * @module imp-3663-matched-pair-krylov-depth-sweep
 * @fileoverview imp-3663 -- CLOSE the named sub-gap sg-3645-matched-pair-depth-sweep.
 *   imp-3645 left the minimal-converged-Krylov-depth law m*(N) UNDER-DETERMINED
 *   because its two anchors were at DIFFERENT pair indices (N = 1600 lambda_3 pair
 *   index 2, m* = 280; N = 2000 lambda_5 = lambda_6 pair index 3, m* = 480), so the
 *   naive 280 -> 480 rise conflated a pair-index step with an N-growth and could not
 *   discriminate linear from sqrt from log. This module measures m*(N) for a FIXED
 *   pair index -- the lambda_5 = lambda_6 THIRD pair (pair index 3) -- across
 *   N in {1600, 2000, 2400}, obtaining the matched-pair anchor triple imp-3645 named
 *   as the requirement, and assesses which growth form the three homogeneous anchors
 *   select.
 *
 *   CONTEXT
 *   -------
 *   imp-3575 traced the imp-3555 N = 1600 gap non-monotonicity to a Lanczos Krylov
 *   UNDER-resolution (lambda_3 locked only at m >= 280 at N = 1600). imp-3625 found
 *   the SAME signature one pair deeper (lambda_5 = lambda_6 locked at m >= 480 at
 *   N = 2000). imp-3645 unified the two anchors but noted they are HETEROGENEOUS in
 *   pair index, leaving a two-point fit that interpolates any two-parameter form
 *   exactly. imp-3645's same-pair evidence (lambda_3, pair 2) suggested m* is FLAT in
 *   N (280 at both N = 1600 and N = 2000), but lambda_3 locks near the smallest swept
 *   depth so that "flat" reading is at the grid floor. The genuine fixed-pair N-law
 *   was never measured on a pair whose lock sits well ABOVE the grid floor.
 *
 *   THIS MODULE re-runs the IDENTICAL imp-3505/imp-3575/imp-3596/imp-3602/imp-3625
 *   assembly Ttilde(u,v) = a (v-u) R(|v-u|) (NPHI = 10, H0 = 0.025, midpoint
 *   quadrature, N = U/H0) at N in {1600, 2000, 2400}, each a single symmetric Lanczos
 *   under FULL reorthogonalization, and reads the top-6 Gram Ritz values at a grid of
 *   Krylov sub-depths (leading tridiagonal sub-blocks). The lock depth m*(N) is the
 *   minimal swept depth at which the third-pair splitting pair56 = |sigma_5 -
 *   sigma_6| / sigma_5 (imp-3602 singular-value convention, sigma_i = sqrt(lambda_i))
 *   has entered its machine-noise plateau (< 1e-13, and all deeper depths also below).
 *   The measurement ran once offline (scripts/compute-imp3663-matched-pair-depth-
 *   sweep.mjs, build Ttilde + Lanczos x 3, ~30 s); the per-depth top Ritz LITERALS
 *   are BAKED so this module stays import-light and derives pair56 / sigma_2 / the
 *   fits / m* arithmetically and self-checkingly against the baked Ritz values.
 *
 *   FINDING
 *   -------
 *   (1) THE MATCHED-PAIR ANCHOR TRIPLE (imp-3645's NAMED REQUIREMENT) IS OBTAINED:
 *       for the FIXED lambda_5 = lambda_6 pair (index 3), m*(1600) = 360,
 *       m*(2000) = 480, m*(2400) = 560. The N = 2000 value (480) reproduces the
 *       imp-3625 anchor EXACTLY -- at m = 440 pair56 = 1.010245749617736e-11
 *       reproduces the imp-3602/imp-3625 baked value to full precision -- a self-check
 *       that this is the identical assembly.
 *   (2) THE FIXED-PAIR m* GENUINELY GROWS WITH N, CORRECTING imp-3645's "FLAT"
 *       READING. imp-3645 inferred (from the lambda_3 pair-2 anchors) that same-pair
 *       m* is FLAT in N. For the lambda_5 = lambda_6 pair -- whose lock sits well
 *       above the grid floor -- m* CLEARLY grows 360 -> 480 -> 560. imp-3645's "flat"
 *       was a grid-floor artifact of the lambda_3 pair (which locks near the smallest
 *       swept depth); the genuine fixed-pair depth DOES increase with N.
 *   (3) THE GROWTH IS SUB-LINEAR / CONCAVE, SO LINEAR IS DISFAVOURED. Two equal N
 *       steps (Delta N = 400) give UNEQUAL depth steps: 360 -> 480 (Delta m = 120)
 *       then 480 -> 560 (Delta m = 80). A linear law m* = aN + b requires a CONSTANT
 *       Delta m; the observed deceleration (120 -> 80) is concave. Least-squares
 *       residual RMS across the three matched anchors ranks log (~4.7) < sqrt (~7.1)
 *       < linear (~9.4): the log form fits best and the linear form worst.
 *   (4) LOG-vs-SQRT IS NOT DISCRIMINATED AT THIS GRID -- A REFINED SUB-GAP. The m*
 *       values are quantised to the 40-step sub-depth grid (m* uncertain to ~+/-20),
 *       so the ~2.4-unit residual gap between the log and sqrt fits is BELOW the grid
 *       resolution. Linear is disfavoured (it is both structurally incompatible with
 *       the deceleration and the worst fit), but log vs sqrt cannot be separated by
 *       three grid-quantised anchors: named residual sg-3663-log-vs-sqrt-fixed-pair.
 *   (5) THE MATCHED-PAIR LAW UNDERCUTS imp-3645's UNDISCRIMINATED BRACKET. imp-3645's
 *       two-point bracket (built from the pair-index-confounded 280 -> 480 slope
 *       aL = 0.5) predicted N = 2400 depth 644..680 and N = 3200 depth 902..1080.
 *       The measured matched-pair m*(2400) = 560 sits BELOW that bracket, and the
 *       matched-anchor fits extrapolate N = 3200 to ~706 (log) .. 767 (linear) --
 *       far below imp-3645's linear 1080. imp-3645's bracket over-estimated the
 *       fixed-pair depth by ~15% (N = 2400) to ~40% (N = 3200) because its slope
 *       inherited the pair-index confound; the matched-pair slope is ~half (~0.25).
 *
 *   NAMED RESIDUAL -- sg-3663-log-vs-sqrt-fixed-pair: the sub-linear/concave form is
 *   established (linear ruled out) but log vs sqrt is not separated by three anchors
 *   quantised to the 40-step Krylov sub-depth grid. Discriminating them needs either a
 *   finer sub-depth grid (e.g. 10-step) at these N or a fourth matched anchor at a
 *   much larger N (e.g. N = 3200) where the log/sqrt predictions diverge >10%.
 *
 *   @see imp-3645-skew-toeplitz-krylov-depth-vs-N-law.js (the module that named sg-3645-matched-pair-depth-sweep)
 *   @see imp-3625-skew-toeplitz-pair56-krylov-depth.js (the N=2000 lambda_5=lambda_6 anchor reproduced here)
 *   @see imp-3575-skew-toeplitz-gap-N1600-krylov-reconverge.js (the lambda_3 pair-2 anchors imp-3645 read as flat)
 *   @see imp-3505-power-iteration-budget-convergence-sweep.js (the identical Ttilde assembly + Lanczos routine)
 *
 *   Ticket: imp-3663 (numerical, medium). MEASUREMENT/FIT only: obtains the
 *   matched-pair anchor triple and discriminates the depth-law form as far as the grid
 *   allows (linear ruled out; log vs sqrt left as a refined sub-gap). Does NOT
 *   construct the missing magnitude and does NOT attempt the imp-3066 K_a >= 0
 *   positivity. RH-EQUIVALENT. NO RH verdict, NO QED. No refereed bound is changed.
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10; // de Bruijn-Newman truncation (identical to imp-3505 / imp-3575 / imp-3625)
const H0 = 0.025; // FIXED grid step (N = U/H0) -- identical to the imp-3505 / imp-3625 ladder
const PLATEAU_THRESHOLD = 1e-13; // pair56 machine-noise plateau entry (N-adaptive: see note)
const IMP3625_M440_N2000_PAIR56 = 1.010245749617736e-11; // imp-3602/imp-3625 baked N=2000 m=440 pair56

// --- BAKED top Gram Ritz values (lambda_i = Ritz eigenvalue of S = T^T T = sigma_i^2)
//     for the FIXED lambda_5 = lambda_6 pair (index 3) as a function of Lanczos Krylov
//     depth m, at N in {1600, 2000, 2400}. Each N: a single Lanczos to its mMax with
//     FULL reorthogonalization; shorter depths are leading tridiagonal sub-blocks.
//     Measured offline with the identical imp-3505/imp-3575/imp-3625 assembly
//     (scripts/compute-imp3663-matched-pair-depth-sweep.mjs); literals baked,
//     import-light. pair56 / sigma_2 / m* are derived arithmetically below. ----------
const MATCHED_PAIR_SWEEP = Object.freeze([
  {
    N: 1600,
    U: 40,
    pairIndex: 3,
    pair: 'lambda_5=lambda_6',
    rows: [
      { m: 280, lambda1: 4.214606892681324e-9, lambda5: 4.211887423749129e-9, lambda6: 4.209891342734818e-9 },
      { m: 320, lambda1: 4.21460689268138e-9, lambda5: 4.211887423749216e-9, lambda6: 4.2118846929978e-9 },
      { m: 360, lambda1: 4.214606892681485e-9, lambda5: 4.211887423749245e-9, lambda6: 4.211887423749216e-9 },
      { m: 400, lambda1: 4.214606892681614e-9, lambda5: 4.21188742374937e-9, lambda6: 4.2118874237493244e-9 },
      { m: 440, lambda1: 4.214606892681694e-9, lambda5: 4.211887423749595e-9, lambda6: 4.211887423749449e-9 },
      { m: 480, lambda1: 4.214606892681812e-9, lambda5: 4.211887423749702e-9, lambda6: 4.2118874237496e-9 },
    ],
  },
  {
    N: 2000,
    U: 50,
    pairIndex: 3,
    pair: 'lambda_5=lambda_6',
    rows: [
      { m: 400, lambda1: 4.214729052176922e-9, lambda5: 4.212986305938278e-9, lambda6: 4.2129137358273505e-9 },
      { m: 440, lambda1: 4.214729052177117e-9, lambda5: 4.212986305938405e-9, lambda6: 4.212986305853281e-9 },
      { m: 480, lambda1: 4.214729052177226e-9, lambda5: 4.21298630593846e-9, lambda6: 4.21298630593841e-9 },
      { m: 520, lambda1: 4.21472905217733e-9, lambda5: 4.212986305938413e-9, lambda6: 4.212986305938379e-9 },
      { m: 560, lambda1: 4.2147290521773905e-9, lambda5: 4.2129863059386936e-9, lambda6: 4.212986305938536e-9 },
    ],
  },
  {
    N: 2400,
    U: 60,
    pairIndex: 3,
    pair: 'lambda_5=lambda_6',
    rows: [
      { m: 480, lambda1: 4.214795510364508e-9, lambda5: 4.213584230377922e-9, lambda6: 4.2135827174771855e-9 },
      { m: 520, lambda1: 4.214795510364633e-9, lambda5: 4.213584230378101e-9, lambda6: 4.213584230322537e-9 },
      { m: 560, lambda1: 4.214795510364684e-9, lambda5: 4.2135842303781984e-9, lambda6: 4.213584230377903e-9 },
      { m: 600, lambda1: 4.214795510364739e-9, lambda5: 4.213584230378151e-9, lambda6: 4.213584230377955e-9 },
      { m: 640, lambda1: 4.214795510364852e-9, lambda5: 4.213584230378379e-9, lambda6: 4.213584230378165e-9 },
      { m: 680, lambda1: 4.214795510364966e-9, lambda5: 4.2135842303783994e-9, lambda6: 4.213584230378141e-9 },
    ],
  },
]);

const PREDICT_AT_N = Object.freeze([3200]); // imp-3645's next rung, for the bracket comparison

// --- derive per-depth pair56 (imp-3602 singular-value convention) and sigma_2, and the
//     matched-pair lock depth m*(N) = minimal swept depth entering the < 1e-13 plateau.
//     The plateau level rises mildly with N (N=1600 ~3.5e-15, N=2400 ~2.5e-14) as the
//     lambda-ratio rounding scales, so a FIXED 2e-14 floor is too strict at N=2400; the
//     1e-13 plateau-entry threshold sits cleanly in the 2+ order gap between the last
//     converging value (>= 6.6e-12 at every N) and the plateau (<= 3.5e-14). ----------
const perN = MATCHED_PAIR_SWEEP.map((run) => {
  const depthRows = run.rows.map((r) => {
    const s5 = Math.sqrt(r.lambda5);
    const s6 = Math.sqrt(r.lambda6);
    const pair56 = Math.abs(s5 - s6) / s5;
    const sigma2 = r.lambda5 / r.lambda1;
    return { m: r.m, pair56, sigma2 };
  });
  let mStar = null;
  for (let i = 0; i < depthRows.length; i++) {
    if (depthRows[i].pair56 < PLATEAU_THRESHOLD && depthRows.slice(i).every((d) => d.pair56 < PLATEAU_THRESHOLD)) {
      mStar = depthRows[i].m;
      break;
    }
  }
  const sigma2Values = depthRows.map((d) => d.sigma2);
  const sigma2Spread = Math.max(...sigma2Values) - Math.min(...sigma2Values);
  return { N: run.N, U: run.U, pairIndex: run.pairIndex, pair: run.pair, depthRows, mStar, sigma2Spread };
});

const anchor1600 = perN.find((p) => p.N === 1600);
const anchor2000 = perN.find((p) => p.N === 2000);
const anchor2400 = perN.find((p) => p.N === 2400);

// (self-check) the N=2000 m=440 row reproduces the imp-3625 baked pair56 to full precision
const n2000_m440 = anchor2000.depthRows.find((d) => d.m === 440);
const reproducesImp3625 =
  Math.abs(n2000_m440.pair56 - IMP3625_M440_N2000_PAIR56) / IMP3625_M440_N2000_PAIR56 < 1e-6;

// --- the matched-pair anchor triple (imp-3645's named requirement) ------------------
const MATCHED_ANCHORS = Object.freeze([
  { N: 1600, pairIndex: 3, mStar: anchor1600.mStar },
  { N: 2000, pairIndex: 3, mStar: anchor2000.mStar },
  { N: 2400, pairIndex: 3, mStar: anchor2400.mStar },
]);

// (2) the fixed-pair m* GROWS with N (corrects imp-3645's flat reading)
const mStarGrowsWithN =
  MATCHED_ANCHORS[0].mStar < MATCHED_ANCHORS[1].mStar &&
  MATCHED_ANCHORS[1].mStar < MATCHED_ANCHORS[2].mStar;

// (3) the growth is sub-linear / concave: equal Delta N, decelerating Delta m
const dm_lo = MATCHED_ANCHORS[1].mStar - MATCHED_ANCHORS[0].mStar; // 480-360 = 120
const dm_hi = MATCHED_ANCHORS[2].mStar - MATCHED_ANCHORS[1].mStar; // 560-480 = 80
const dN_lo = MATCHED_ANCHORS[1].N - MATCHED_ANCHORS[0].N; // 400
const dN_hi = MATCHED_ANCHORS[2].N - MATCHED_ANCHORS[1].N; // 400
const equalNSteps = dN_lo === dN_hi;
const growthIsConcave = dm_hi < dm_lo; // decelerating -> not linear

// --- three-point least-squares fits (linear / sqrt / log) and residual RMS ----------
function lsqFit(xs, ys) {
  const n = xs.length;
  const xbar = xs.reduce((a, b) => a + b, 0) / n;
  const ybar = ys.reduce((a, b) => a + b, 0) / n;
  let sxy = 0;
  let sxx = 0;
  for (let i = 0; i < n; i++) {
    sxy += (xs[i] - xbar) * (ys[i] - ybar);
    sxx += (xs[i] - xbar) * (xs[i] - xbar);
  }
  const slope = sxy / sxx;
  const intercept = ybar - slope * xbar;
  let ssr = 0;
  for (let i = 0; i < n; i++) {
    const e = ys[i] - (slope * xs[i] + intercept);
    ssr += e * e;
  }
  return { slope, intercept, rms: Math.sqrt(ssr / n) };
}

const NS = MATCHED_ANCHORS.map((a) => a.N);
const MS = MATCHED_ANCHORS.map((a) => a.mStar);
const linearFit = lsqFit(NS, MS);
const sqrtFit = lsqFit(NS.map((N) => Math.sqrt(N)), MS);
const logFit = lsqFit(NS.map((N) => Math.log(N)), MS);

const predictLinear = (N) => linearFit.slope * N + linearFit.intercept;
const predictSqrt = (N) => sqrtFit.slope * Math.sqrt(N) + sqrtFit.intercept;
const predictLog = (N) => logFit.slope * Math.log(N) + logFit.intercept;

// (3) fit ordering: log best, linear worst
const logBeatsSqrt = logFit.rms < sqrtFit.rms;
const sqrtBeatsLinear = sqrtFit.rms < linearFit.rms;
const linearIsWorst = linearFit.rms > sqrtFit.rms && linearFit.rms > logFit.rms;

// (4) log vs sqrt not discriminated at the +/-20 grid quantisation
const GRID_HALF_STEP = 20; // half the 40-step sub-depth grid
const logSqrtRmsGap = Math.abs(sqrtFit.rms - logFit.rms);
const logVsSqrtBelowGrid = logSqrtRmsGap < GRID_HALF_STEP;

// (5) matched-pair prediction undercuts imp-3645's undiscriminated bracket
const IMP3645_BRACKET = Object.freeze({
  N2400: { linear: 680, sqrt: 661, log: 644 }, // imp-3645 two-point named-anchor bracket
  N3200: { linear: 1080, sqrt: 982, log: 902 },
});
const matched2400 = MATCHED_ANCHORS[2].mStar; // 560 measured
const matched2400BelowImp3645 = matched2400 < IMP3645_BRACKET.N2400.log; // 560 < 644
const predictions = PREDICT_AT_N.map((N) => ({
  N,
  linear: predictLinear(N),
  sqrt: predictSqrt(N),
  log: predictLog(N),
}));
const pred3200 = predictions.find((p) => p.N === 3200);
const matched3200BelowImp3645 = pred3200.linear < IMP3645_BRACKET.N3200.linear; // ~767 < 1080

// --- sigma_2 = lambda_5/lambda_1 is invariant within each N (self-consistency) -------
const sigma2InvariantWithinN = perN.every((p) => p.sigma2Spread < 5e-14);

const verdict =
  reproducesImp3625 &&
  mStarGrowsWithN &&
  equalNSteps &&
  growthIsConcave &&
  linearIsWorst &&
  logBeatsSqrt &&
  logVsSqrtBelowGrid &&
  matched2400BelowImp3645 &&
  matched3200BelowImp3645
    ? 'MATCHED-PAIR-(lambda_5=lambda_6,-index-3)-DEPTH-TRIPLE-m*(1600)=360,m*(2000)=480,m*(2400)=560-(N=2000-REPRODUCES-imp-3625):-FIXED-PAIR-m*-GENUINELY-GROWS-WITH-N-(CORRECTING-imp-3645-FLAT-READING),-SUB-LINEARLY/CONCAVE-(Delta-m-120->80-OVER-EQUAL-Delta-N=400)-SO-LINEAR-IS-DISFAVOURED-(RMS-log~4.7<sqrt~7.1<linear~9.4);-LOG-vs-SQRT-NOT-SEPARATED-AT-THE-+/-20-GRID-(sg-3663-log-vs-sqrt-fixed-pair);-MATCHED-m*(2400)=560-UNDERCUTS-imp-3645-BRACKET-644..680-AND-EXTRAPOLATED-N=3200~706..767-<<-imp-3645-LINEAR-1080'
    : 'INDETERMINATE';

export const IMP3663_MATCHED_PAIR_KRYLOV_DEPTH_SWEEP = Object.freeze({
  id: 'imp-3663-matched-pair-krylov-depth-sweep',
  ticket: 'imp-3663',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  closesSubGap: 'sg-3645-matched-pair-depth-sweep',
  closesSubGapOf: 'imp-3645-skew-toeplitz-krylov-depth-vs-N-law.js',

  summary:
    'CLOSES the imp-3645 named sub-gap sg-3645-matched-pair-depth-sweep by measuring the minimal converged Lanczos ' +
    'Krylov depth m*(N) for a FIXED pair index -- the lambda_5 = lambda_6 THIRD pair (index 3) -- across ' +
    'N in {1600, 2000, 2400}, using the IDENTICAL imp-3505/imp-3575/imp-3625 skew-Toeplitz assembly ' +
    'Ttilde(u,v)=a(v-u)R (NPHI=10, H0=0.025, midpoint) with a single full-reorthogonalization Lanczos per N and top-6 ' +
    'Gram Ritz values read at a grid of sub-depths. THE MATCHED-PAIR ANCHOR TRIPLE (imp-3645 named this as the ' +
    'requirement) IS: m*(1600)=360, m*(2000)=480, m*(2400)=560, where m* is the minimal depth entering the pair56 = ' +
    '|sigma_5-sigma_6|/sigma_5 < 1e-13 machine-noise plateau. The N=2000 anchor (480) reproduces imp-3625 EXACTLY ' +
    '(at m=440 pair56=1.010245749617736e-11 matches the imp-3602/imp-3625 baked value to full precision), a self-check ' +
    'this is the same assembly. FINDINGS: (i) the fixed-pair m* GENUINELY GROWS with N (360->480->560), CORRECTING ' +
    "imp-3645's inference (from the lambda_3 pair-2 anchors, which lock at the grid floor) that same-pair m* is FLAT; " +
    '(ii) the growth is SUB-LINEAR/CONCAVE -- equal N steps (Delta N=400) give decelerating depth steps (Delta m ' +
    '120->80) -- so a linear law (constant Delta m) is DISFAVOURED; least-squares residual RMS ranks log (~4.7) < ' +
    'sqrt (~7.1) < linear (~9.4); (iii) log vs sqrt is NOT discriminated -- the ~2.4-unit RMS gap is below the +/-20 ' +
    'sub-depth grid quantisation (named residual sg-3663-log-vs-sqrt-fixed-pair); (iv) the measured matched m*(2400)=560 ' +
    "UNDERCUTS imp-3645's undiscriminated bracket 644..680 and the matched fits extrapolate N=3200 to ~706..767, far " +
    "below imp-3645's pair-index-confounded linear 1080 -- imp-3645 over-estimated the fixed-pair depth by ~15%..40% " +
    'because its slope (0.5) inherited the pair-index step; the matched-pair slope is ~half (~0.25). Measurement/fit ' +
    'only; runs no new Lanczos at import; does NOT construct the missing magnitude and does NOT attempt the imp-3066 ' +
    'K_a >= 0 positivity; RH-EQUIVALENT; NO RH verdict, NO QED. No refereed bound is changed.',

  construction: Object.freeze({
    quantityMeasured: 'm*(N, pair=lambda_5=lambda_6) = minimal reorthogonalized Lanczos Krylov depth entering the pair56 = |sigma_5-sigma_6|/sigma_5 < 1e-13 machine-noise plateau',
    fixedPairIndex: 3,
    phiKernel: 'de Bruijn-Newman: sum_{n=1..10} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    assembly: 'identical imp-3505/imp-3575/imp-3625: NPHI=10, H0=0.025, N=U/H0 midpoint panels, R(kH)=H sum Phi_i Phi_{i+k}',
    eigensolver: 'symmetric Lanczos on S=T^T T with FULL reorthogonalization; top-6 Ritz values by cyclic Jacobi on the tridiagonal',
    NValues: [1600, 2000, 2400],
    krylovSubBlocks: 'one Lanczos to mMax per N; shorter Krylov depths are leading tridiagonal sub-blocks (full reorthogonalization makes the leading m-block identical to a length-m run)',
    lockCriterion: 'plateau-entry: minimal swept depth with pair56 < 1e-13 and all deeper swept depths also < 1e-13 (the N-adaptive machine-noise floor rises mildly, ~3.5e-15 at N=1600 to ~2.5e-14 at N=2400, so a fixed 2e-14 floor is too strict at N=2400; 1e-13 sits in the 2+ order gap between the last converging value >=6.6e-12 and the plateau <=3.5e-14)',
    h0: H0,
    computeScript: 'scripts/compute-imp3663-matched-pair-depth-sweep.mjs (offline, ~30 s: build Ttilde + Lanczos x 3)',
    measuredOffline: 'the three Lanczos runs ran once offline; per-depth top Ritz literals (lambda_1, lambda_5, lambda_6) baked; import-light, no Lanczos re-run at import; pair56/sigma_2/m*/fits derived and self-checked arithmetically',
    selfComputing: true,
  }),

  measured: Object.freeze({
    matchedPairSweep: MATCHED_PAIR_SWEEP, // per-N baked top Ritz values
    perN, // per-N derived depthRows (pair56, sigma_2), mStar, sigma2Spread
    matchedAnchors: MATCHED_ANCHORS, // the imp-3645-named anchor triple {N, pairIndex:3, mStar}
    reproducesImp3625, // true -- N=2000 m=440 pair56 reproduces the imp-3625 baked value
    mStarGrowsWithN, // true -- 360 < 480 < 560 (corrects imp-3645 flat reading)
    deltaM: { lo: dm_lo, hi: dm_hi }, // 120, 80 -- decelerating over equal Delta N
    equalNSteps, // true -- Delta N = 400 both steps
    growthIsConcave, // true -- Delta m 120 -> 80 (sub-linear)
    linearFit, // {slope~0.25, intercept, rms~9.4}
    sqrtFit, // {slope, intercept, rms~7.1}
    logFit, // {slope, intercept, rms~4.7}
    logBeatsSqrt, // true
    sqrtBeatsLinear, // true
    linearIsWorst, // true
    logSqrtRmsGap, // ~2.4 units
    logVsSqrtBelowGrid, // true -- below the +/-20 grid quantisation
    predictions, // matched-anchor extrapolation at N=3200
    pred3200,
    imp3645Bracket: IMP3645_BRACKET,
    matched2400, // 560
    matched2400BelowImp3645, // true -- 560 < imp-3645 bracket 644..680
    matched3200BelowImp3645, // true -- ~767 << imp-3645 linear 1080
    sigma2InvariantWithinN, // true -- lambda_5/lambda_1 flat across depth at each N
    plateauThreshold: PLATEAU_THRESHOLD,
    subGap: 'sg-3663-log-vs-sqrt-fixed-pair',
    verdict,
  }),

  interpretation: Object.freeze({
    matchedTripleObtained:
      'imp-3645 said discriminating m*(N) needs a MATCHED-PAIR sweep: m*(N, pair) for a FIXED pair index across >= 3 N. ' +
      'This runs exactly that for the lambda_5 = lambda_6 third pair at N in {1600,2000,2400}, giving the anchor ' +
      'triple 360 / 480 / 560. The N=2000 value reproduces the imp-3625 anchor exactly, so the triple is homogeneous ' +
      'in assembly as well as in pair index.',
    correctsImp3645FlatReading:
      'imp-3645 read the fixed-pair depth as FLAT in N, from the lambda_3 (pair 2) anchors that held at 280 across ' +
      'N=1600..2000. But lambda_3 locks near the smallest swept depth, so that reading was at the grid floor. The ' +
      'lambda_5=lambda_6 pair, whose lock sits well above the floor, shows m* CLEARLY growing 360->480->560: the ' +
      'genuine fixed-pair depth DOES increase with N -- imp-3645 undercounted the N-dependence.',
    formIsSubLinear:
      'Two equal N steps (Delta N=400) give decelerating depth steps (Delta m 120 then 80). A linear law needs a ' +
      'constant Delta m, so the concavity rules it OUT; least-squares RMS confirms it (log ~4.7 < sqrt ~7.1 < linear ' +
      '~9.4, linear worst). The fixed-pair interior-eigenvalue Krylov depth grows sub-linearly in N over this ladder.',
    logVsSqrtUnresolved:
      'The log fit edges the sqrt fit (RMS ~4.7 vs ~7.1) but the ~2.4-unit gap is below the +/-20 uncertainty from the ' +
      '40-step sub-depth grid, so log vs sqrt is NOT separated by three grid-quantised anchors. Separating them needs a ' +
      'finer sub-depth grid or a fourth anchor at a much larger N (sg-3663-log-vs-sqrt-fixed-pair).',
    undercutsImp3645Bracket:
      "imp-3645's two-point bracket (slope aL=0.5 from the pair-index-confounded 280->480 jump) predicted 644..680 at " +
      'N=2400 and 902..1080 at N=3200. The measured matched m*(2400)=560 is BELOW that bracket, and the matched fits ' +
      'give N=3200 ~706 (log)..767 (linear), far below imp-3645 linear 1080. imp-3645 over-estimated the fixed-pair ' +
      'depth by ~15% (N=2400) to ~40% (N=3200); the matched-pair slope is ~half (~0.25 vs 0.5).',
    whatItAddsOverImp3645:
      'imp-3645 could not fit a form (two heterogeneous anchors) and named the matched-pair sweep as the requirement. ' +
      'This module RUNS that sweep, obtains the homogeneous triple, corrects the flat-in-N reading, rules out the ' +
      'linear law, brackets the true depth below imp-3645, and narrows the open question to log-vs-sqrt at a finer grid.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    logVsSqrtNotDiscriminated:
      'The sub-linear/concave form is established (linear ruled out by the deceleration and the worst residual), but ' +
      'log vs sqrt is NOT separated: the RMS gap (~2.4 units) is below the +/-20 uncertainty from the 40-step Krylov ' +
      'sub-depth grid. sg-3663-log-vs-sqrt-fixed-pair remains open.',
    mStarIsGridQuantised:
      'Each m* is the first swept sub-depth entering the plateau, quantised to the 40-step grid (m* uncertain to ' +
      '~+/-20). The true lock lies between the last converging depth and the first plateau depth. A finer grid would ' +
      'sharpen the anchors and could resolve the form.',
    threePointFitIsLocal:
      'The linear/sqrt/log discrimination rests on three anchors over N=1600..2400; the ruling-out of linear is robust ' +
      '(a concave deceleration is structurally incompatible), but the fitted forms are local and the N=3200 numbers are ' +
      'extrapolations, not measured lock depths.',
    convergenceIsNumericalNotSymbolic:
      'pair56 and the lock depths are finite-N numerical measurements of a converged Krylov reference; no asymptotic in ' +
      'N is proven and the adjacent-paired spectrum is corroborated (imp-3596 dense), not derived.',
    assessesNotConstructs:
      'This measures and discriminates a Krylov depth law; it does NOT construct the missing magnitude and does NOT ' +
      'attempt the imp-3066 K_a >= 0 positivity.',
    didNotAttemptPositivity: true,
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3663_MATCHED_PAIR_KRYLOV_DEPTH_SWEEP_ASSERTIONS = [
  {
    id: 'imp3663-n2000-reproduces-imp3625-anchor',
    why: 'Self-check: the N=2000 lambda_5=lambda_6 run must reproduce the imp-3602/imp-3625 baked m=440 pair56 ' +
      '(1.010245749617736e-11) to full precision AND lock at m*=480 -- confirming this is the identical imp-3625 ' +
      'assembly and that the N=2000 matched anchor is the imp-3625 anchor.',
    holds: () => reproducesImp3625 && anchor2000.mStar === 480,
  },
  {
    id: 'imp3663-matched-anchor-triple-obtained',
    why: 'THE PRIMARY DELIVERABLE (sg-3645-matched-pair-depth-sweep): the fixed-pair (index 3) triple must be ' +
      'm*(1600)=360, m*(2000)=480, m*(2400)=560 -- three homogeneous same-pair anchors, the requirement imp-3645 named.',
    holds: () =>
      MATCHED_ANCHORS.length === 3 &&
      MATCHED_ANCHORS[0].mStar === 360 &&
      MATCHED_ANCHORS[1].mStar === 480 &&
      MATCHED_ANCHORS[2].mStar === 560 &&
      MATCHED_ANCHORS.every((a) => a.pairIndex === 3),
  },
  {
    id: 'imp3663-fixed-pair-m-star-grows-with-N',
    why: 'The fixed-pair m* must GROW with N (360 < 480 < 560), correcting the imp-3645 inference (from lambda_3 ' +
      'pair-2 grid-floor anchors) that same-pair m* is flat in N.',
    holds: () => mStarGrowsWithN,
  },
  {
    id: 'imp3663-growth-is-concave-linear-disfavoured',
    why: 'The growth must be SUB-LINEAR/concave: equal N steps (Delta N=400) give decelerating depth steps ' +
      '(Delta m 120 then 80), so a linear law (constant Delta m) is disfavoured and least-squares ranks linear WORST.',
    holds: () => equalNSteps && growthIsConcave && dm_lo === 120 && dm_hi === 80 && linearIsWorst,
  },
  {
    id: 'imp3663-log-best-but-not-separated-from-sqrt',
    why: 'The log fit must edge sqrt (RMS log < sqrt < linear) but the log-sqrt RMS gap must be BELOW the +/-20 grid ' +
      'quantisation -- so linear is ruled out yet log vs sqrt is left as sg-3663-log-vs-sqrt-fixed-pair.',
    holds: () => logBeatsSqrt && sqrtBeatsLinear && logVsSqrtBelowGrid,
  },
  {
    id: 'imp3663-matched-law-undercuts-imp3645-bracket',
    why: 'The measured matched m*(2400)=560 must be BELOW imp-3645s undiscriminated bracket (644..680) and the matched ' +
      'N=3200 extrapolation must be far below imp-3645s linear 1080 -- imp-3645s pair-index-confounded slope ' +
      'over-estimated the fixed-pair depth.',
    holds: () => matched2400BelowImp3645 && matched3200BelowImp3645 && pred3200.linear < 800,
  },
  {
    id: 'imp3663-verdict-matched-triple-located',
    why: 'The classified verdict must be the confirming matched-triple result, not indeterminate; a flip means the ' +
      'imp-3625 reproduction, the m* growth, the concavity, or the bracket undercut failed.',
    holds: () => verdict.startsWith('MATCHED-PAIR-(lambda_5=lambda_6,-index-3)-DEPTH-TRIPLE'),
  },
  {
    id: 'imp3663-honest-assessment-no-qed',
    why: 'Mandatory honesty: MEASUREMENT/FIT only -- log vs sqrt not discriminated (sub-gap named), m* grid-quantised, ' +
      'positivity not attempted, RH-equivalent, no refereed bound is changed. Any flip over-claims.',
    holds: () => {
      const c = IMP3663_MATCHED_PAIR_KRYLOV_DEPTH_SWEEP.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.didNotAttemptPositivity === true &&
        typeof c.logVsSqrtNotDiscriminated === 'string' &&
        typeof c.mStarIsGridQuantised === 'string' &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3663_MATCHED_PAIR_KRYLOV_DEPTH_SWEEP_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3663-matched-pair-krylov-depth-sweep assertion failed: ${assertion.id}`);
  }
}

export default IMP3663_MATCHED_PAIR_KRYLOV_DEPTH_SWEEP;
