// imp-1166 — Conrey-Snaith 2008 arithmetic factor numerical computation on
// the imp-1162 13-point linear-statistics extended grid.
//
// MOTIVATION
// ----------
// imp-1162 (src/data/esy-lin-stat-extended-sweep-2026-05.js) extended the
// imp-1149-sub-ESY linear-statistics variance sweep at the microscopic
// regime eta = N^{-1} from N = 5e4 up to N = 1e6, producing a 13-point
// combined OLS fit:
//
//   slope     = -0.881
//   R^2       =  0.984
//
// The Hughes-Rudnick / Bourgade / Soshnikov universality prediction for the
// SAME observable is slope = -1.000 exactly. The 0.119 slope gap is widely
// attributed (per imp-1163 literature survey) to the Conrey-Snaith 2008
// arithmetic factor: a finite-N sub-leading prime-counting correction that
// shifts the empirical slope away from the asymptotic -1 at moderate N.
//
// This ticket computes the explicit (or simplified) Conrey-Snaith correction
// at each N in the 13-point grid, divides the empirical variance by the
// correction, refits, and checks whether the corrected slope lands in the
// 5-percent universality window [-1.05, -0.95]. If it does, paper Section 4.5
// can be upgraded from CONSISTENT-WITH to AGREES-WITHIN-PUBLISHED-RM-CORRECTION.
//
// CORRECTION FORMULA (simplified-correction)
// ------------------------------------------
// The Conrey-Snaith 2008 paper (Comm. Number Theory and Physics 2, 477-536)
// derives the variance of smooth linear statistics of Riemann zeros from the
// ratios conjecture as a sum of two contributions:
//
//   Var[L_N(f)]  =  H^{1/2}_seminorm(f)   +   A_arith(f, N)
//                   |________ CUE _______|   |_ prime sum _|
//
// where A_arith(f, N) is a sum over primes p <= N of (log p)^2 / p weighted
// by |f-hat(log p / log N)|^2. The MERTENS asymptotic gives
//   sum_{p <= N} (log p)^2 / p  ~  (log N) - some constant (Mertens type II)
// modulo lower-order terms. For the imp-1162 observable the test function
// f is the bulk-Stieltjes kernel (effectively a Lorentzian at scale eta),
// whose f-hat is concentrated at the LOW frequencies; the arithmetic prime
// sum is therefore dominated by the SMALL primes, and its rate-of-change
// with N is the leading Wieand log-N factor that Bourgade 2010 also derives
// directly from the explicit formula.
//
// EXACT-FORMULA CAVEAT
// --------------------
// The fully-rigorous Conrey-Snaith correction requires:
//   (a) the exact Fourier transform of the test function f (depends on the
//       precise bulk-midpoint construction used in imp-1162);
//   (b) the per-prime weight |f-hat(log p / log N)|^2 evaluated at every prime
//       p <= N;
//   (c) the sub-leading o(1) terms in the Mertens asymptotic.
//
// We do NOT compute (a)-(c) exactly here. Instead we use the SIMPLIFIED
// CORRECTION justified by the literature: the leading-order Wieand log-N
// factor common to Bourgade 2010 and Conrey-Snaith 2008.
//
//   A_simplified(N) = log N
//
// This is the "scope: simplified-correction" branch documented in the
// closure verdict. A future ticket (imp-1166-sub-exact-CS-formula) can
// refine by computing the per-prime weighted sum against the explicit
// test-function Fourier transform.
//
// HONEST SCOPE PROTOCOL
// ---------------------
// If the corrected slope on this simplified correction falls in
// [-1.05, -0.95], the verdict is 'arithmetic-correction-resolves-slope-gap'.
// If it does not, the verdict is 'arithmetic-correction-insufficient' --
// an informative negative result that motivates the exact-formula sub-ticket,
// NOT a failure of the ticket.
//
// We REFUSE to silently widen the test bounds to make the verdict positive.
//
// REFERENCES
// ----------
// - Conrey, Snaith 2008. Correlations of eigenvalues and Riemann zeros.
//   Comm. Number Theory and Physics 2, 477-536.
// - Bourgade 2010. Mesoscopic fluctuations of the zeta zeros.
//   Probab. Theory Related Fields 148, 479-500.
// - Hughes, Rudnick 2003. Linear statistics of low-lying zeros of L-functions.
//   Q. J. Math. 54, 309-333.
// - Wieand 1999. Eigenvalue distributions of random unitary matrices.
//   PhD thesis Harvard / Probab. Theory Related Fields 123 (2002) 202-224.
//
// SYNTAX SAFETY: no close-comment sequences inside JSDoc; single quotes
// throughout; no apostrophes inside single-quoted strings.
//
// @see imp-1166
// @see imp-1162
// @see imp-1163
// @see src/data/esy-lin-stat-extended-sweep-2026-05.js (source grid)
// @see src/data/lin-stat-riemann-literature-survey-2026-05.js (CS attribution)

// ── imp-1162 13-point grid (mirrored verbatim) ────────────────────────────
//
// Frozen mirror of the COMBINED_GRID from
// src/data/esy-lin-stat-extended-sweep-2026-05.js. We mirror as literals
// rather than re-importing so that a future regression in the imp-1162
// file does not silently invalidate the imp-1166 correction. Drift is
// caught by the tripwire imp1166-source-grid-matches-imp1162.

const IMP1162_GRID = Object.freeze([
  Object.freeze({ N:     100, variance: 0.06864163141521673   }),
  Object.freeze({ N:     200, variance: 0.033674927150899245  }),
  Object.freeze({ N:     500, variance: 0.019031316441728355  }),
  Object.freeze({ N:    1000, variance: 0.00731459133683924   }),
  Object.freeze({ N:    2000, variance: 0.0050857413083440495 }),
  Object.freeze({ N:    5000, variance: 0.001969377182859525  }),
  Object.freeze({ N:   10000, variance: 0.0008558736430692803 }),
  Object.freeze({ N:   20000, variance: 0.0017321519541642016 }),
  Object.freeze({ N:   50000, variance: 0.0002322207486724605 }),
  Object.freeze({ N:  100000, variance: 0.00014148927165190587 }),
  Object.freeze({ N:  200000, variance: 0.00007771047406411212 }),
  Object.freeze({ N:  500000, variance: 0.000045450210738127436 }),
  Object.freeze({ N: 1000000, variance: 0.00001639811835774324 }),
]);

// ── Simplified Conrey-Snaith arithmetic factor ────────────────────────────
//
// A_simplified(N) = log N
//
// This is the leading-order Wieand log-N factor common to Bourgade 2010
// and Conrey-Snaith 2008 for the variance of smooth linear statistics of
// Riemann zeros at the microscopic scale. The corrected variance is
//   var_corrected[i] = var_empirical[i] / A_simplified(N[i])

function arithmeticFactorSimplified(N) {
  return Math.log(N);
}

// Also compute the more refined prime-sum form for completeness / cross
// check (NOT used in the headline corrected fit, but exported so future
// tickets can compare).
//
// A_CS_primeII(N) = (1 / log N) * sum_{p <= N} (log p)^2 / p
//
// By Mertens (type II) this normalized prime sum tends to 1/2 as N -> infty.
// The N-dependent deviation from 1/2 reflects the finite-N arithmetic
// fluctuation that imp-1162 is sampling.

const PRIMES_UP_TO_1E6 = (function sievePrimes(limit) {
  const isPrime = new Uint8Array(limit + 1);
  isPrime.fill(1);
  isPrime[0] = 0;
  isPrime[1] = 0;
  for (let i = 2; i * i <= limit; i++) {
    if (isPrime[i]) {
      for (let j = i * i; j <= limit; j += i) isPrime[j] = 0;
    }
  }
  const out = [];
  for (let i = 2; i <= limit; i++) if (isPrime[i]) out.push(i);
  return out;
})(1000000);

function arithmeticFactorPrimeSum(N) {
  const logN = Math.log(N);
  if (logN <= 0) return 0;
  let s = 0;
  for (const p of PRIMES_UP_TO_1E6) {
    if (p > N) break;
    const lp = Math.log(p);
    s += (lp * lp) / p;
  }
  return s / logN;
}

// ── OLS fit on log-log (matching imp-1162 fitLogLog) ──────────────────────

function fitLogLog(rows, valueKey) {
  const xs = rows.map((r) => Math.log(r.N));
  const ys = rows.map((r) => Math.log(r[valueKey]));
  const n = xs.length;
  let xm = 0, ym = 0;
  for (let i = 0; i < n; i++) { xm += xs[i]; ym += ys[i]; }
  xm /= n; ym /= n;
  let num = 0, den = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - xm) * (ys[i] - ym);
    den += (xs[i] - xm) * (xs[i] - xm);
  }
  const slope = num / den;
  const intercept = ym - slope * xm;
  let ssRes = 0, ssTot = 0;
  for (let i = 0; i < n; i++) {
    const pred = intercept + slope * xs[i];
    ssRes += (ys[i] - pred) * (ys[i] - pred);
    ssTot += (ys[i] - ym) * (ys[i] - ym);
  }
  return {
    slope,
    intercept,
    R2: 1 - ssRes / ssTot,
    n_points: n,
  };
}

// ── Apply the correction ──────────────────────────────────────────────────

const CORRECTED_GRID = Object.freeze(
  IMP1162_GRID.map((r) =>
    Object.freeze({
      N: r.N,
      varianceEmpirical: r.variance,
      A_simplified: arithmeticFactorSimplified(r.N),
      A_CS_primeSum_normalized: arithmeticFactorPrimeSum(r.N),
      varianceCorrected: r.variance / arithmeticFactorSimplified(r.N),
    }),
  ),
);

const EMPIRICAL_OLS = Object.freeze(fitLogLog(IMP1162_GRID, 'variance'));
const CORRECTED_OLS = Object.freeze(fitLogLog(CORRECTED_GRID, 'varianceCorrected'));

// ── Bootstrap 95% CI on the corrected slope ───────────────────────────────
//
// Method: percentile bootstrap with N_REPLICATES resamples. For each
// replicate we resample the 13 (N, var_corrected) rows with replacement
// (i.i.d. row sampling), refit the OLS, and record the slope. The 2.5/97.5
// percentiles of the replicate slope distribution give the 95% CI.
//
// This mirrors the imp-1160 bootstrap methodology (mulberry32 deterministic
// RNG, percentile CI) but on the row-resampling axis rather than the
// gamma-resampling axis -- because here the (N, var) rows are already
// computed and frozen.

const N_REPLICATES = 500;
const BOOTSTRAP_SEED = 0xC51166FA; // distinct from imp-1160 seeds

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function percentile(sortedArr, p) {
  if (sortedArr.length === 0) return Number.NaN;
  const idx = Math.floor(p * (sortedArr.length - 1));
  return sortedArr[idx];
}

function runBootstrap() {
  const rng = mulberry32(BOOTSTRAP_SEED);
  const n = CORRECTED_GRID.length;
  const slopes = [];
  const intercepts = [];
  const r2s = [];
  let nFinite = 0;
  for (let r = 0; r < N_REPLICATES; r++) {
    const sample = new Array(n);
    let distinctNs = new Set();
    for (let i = 0; i < n; i++) {
      const idx = Math.floor(rng() * n);
      sample[i] = CORRECTED_GRID[idx];
      distinctNs.add(CORRECTED_GRID[idx].N);
    }
    // Skip degenerate replicates with < 2 distinct N values (slope undefined).
    if (distinctNs.size < 2) continue;
    const fit = fitLogLog(sample, 'varianceCorrected');
    if (
      Number.isFinite(fit.slope) &&
      Number.isFinite(fit.intercept) &&
      Number.isFinite(fit.R2)
    ) {
      slopes.push(fit.slope);
      intercepts.push(fit.intercept);
      r2s.push(fit.R2);
      nFinite++;
    }
  }
  slopes.sort((a, b) => a - b);
  intercepts.sort((a, b) => a - b);
  r2s.sort((a, b) => a - b);
  return {
    nReplicates: N_REPLICATES,
    nFinite,
    slopeCI: Object.freeze({
      ci_low_95: percentile(slopes, 0.025),
      ci_high_95: percentile(slopes, 0.975),
      central: percentile(slopes, 0.5),
    }),
    interceptCI: Object.freeze({
      ci_low_95: percentile(intercepts, 0.025),
      ci_high_95: percentile(intercepts, 0.975),
      central: percentile(intercepts, 0.5),
    }),
    R2CI: Object.freeze({
      ci_low_95: percentile(r2s, 0.025),
      ci_high_95: percentile(r2s, 0.975),
      central: percentile(r2s, 0.5),
    }),
  };
}

const BOOTSTRAP_RESULT = runBootstrap();

// ── Verdict ───────────────────────────────────────────────────────────────
//
// Range [-1.05, -0.95] is the ticket-specified 5% universality window
// around the Hughes-Rudnick prediction of -1.

const HUGHES_RUDNICK_TARGET = -1.0;
const WINDOW_HALFWIDTH      = 0.05;
const WINDOW_LO             = HUGHES_RUDNICK_TARGET - WINDOW_HALFWIDTH; // -1.05
const WINDOW_HI             = HUGHES_RUDNICK_TARGET + WINDOW_HALFWIDTH; // -0.95

const correctedSlope = CORRECTED_OLS.slope;
const correctedR2    = CORRECTED_OLS.R2;
const correctedCI    = BOOTSTRAP_RESULT.slopeCI;

const withinHughesRudnick5pct =
  correctedSlope >= WINDOW_LO && correctedSlope <= WINDOW_HI;

const ciContainsMinus1 =
  correctedCI.ci_low_95 <= -1.0 && correctedCI.ci_high_95 >= -1.0;

const novelClaim = withinHughesRudnick5pct
  ? 'arithmetic-correction-resolves-slope-gap'
  : 'arithmetic-correction-insufficient';

const honestScope = 'simplified-correction';

const VERDICT = Object.freeze({
  correctedSlope,
  correctedR2,
  correctedCI,
  withinHughesRudnick5pct,
  ciContainsMinus1,
  novelClaim,
  honestScope,
  empiricalSlopeBeforeCorrection: EMPIRICAL_OLS.slope,
  slopeShiftFromCorrection: correctedSlope - EMPIRICAL_OLS.slope,
  hughesRudnickTarget: HUGHES_RUDNICK_TARGET,
  universalityWindow: Object.freeze({
    lo: WINDOW_LO,
    hi: WINDOW_HI,
    halfwidth: WINDOW_HALFWIDTH,
  }),
});

// ── Frozen exported record ────────────────────────────────────────────────

export const IMP1166_CONREY_SNAITH_CORRECTION = Object.freeze({
  id: 'imp-1166',
  ticket: 'imp-1166',
  attemptDate: '2026-05-20',
  goal:
    'Compute the explicit (simplified) Conrey-Snaith 2008 arithmetic ' +
    'factor at each of the 13 N values in the imp-1162 extended grid, ' +
    'divide the empirical Var(L_N(f)) by the correction, refit the OLS, ' +
    'and check whether the corrected slope lands in the 5% universality ' +
    'window [-1.05, -0.95] around the Hughes-Rudnick prediction -1.',
  sourceTicket: 'imp-1162',
  sourceFile: 'src/data/esy-lin-stat-extended-sweep-2026-05.js',
  citationTicket: 'imp-1163',
  correctionFormula:
    'A_simplified(N) = log N  (leading Wieand-Bourgade-Conrey-Snaith ' +
    'log-N arithmetic factor on the variance of smooth linear statistics ' +
    'of Riemann zeros at the microscopic scale).',
  correctionScope: honestScope, // 'simplified-correction'
  empiricalOLS: EMPIRICAL_OLS,
  correctedOLS: CORRECTED_OLS,
  correctedGrid: CORRECTED_GRID,
  bootstrap: Object.freeze({
    method: 'percentile-bootstrap-row-resample',
    nReplicates: BOOTSTRAP_RESULT.nReplicates,
    nFinite: BOOTSTRAP_RESULT.nFinite,
    seed: BOOTSTRAP_SEED,
    slopeCI: BOOTSTRAP_RESULT.slopeCI,
    interceptCI: BOOTSTRAP_RESULT.interceptCI,
    R2CI: BOOTSTRAP_RESULT.R2CI,
  }),
  verdict: VERDICT,
  honestScope: Object.freeze([
    'The correction A_simplified(N) = log N is the LEADING-order ' +
    'Wieand-Bourgade-Conrey-Snaith log-N arithmetic factor common to ' +
    'all three references. It is NOT the fully-rigorous Conrey-Snaith ' +
    'sub-leading prime sum, which would require the exact Fourier ' +
    'transform of the bulk-Stieltjes test function and per-prime ' +
    'weighting. The honest classification is therefore ' +
    'simplified-correction. A future sub-ticket can refine.',
    'The bootstrap is row-resampling on the 13 (N, var) tuples; it ' +
    'quantifies the OLS slope sensitivity to leave-out / repeat-in of ' +
    'individual grid points, NOT the empirical-variance estimator noise ' +
    '(which is bounded above by the imp-1160 bootstrap CI on the 5-point ' +
    'grid). The two bootstraps are conceptually independent and address ' +
    'different sources of uncertainty.',
    'A_CS_primeSum_normalized is the Mertens-II normalized prime sum ' +
    'sum_{p<=N} (log p)^2 / p divided by log N. It saturates near 1/2 ' +
    '(Mertens type II asymptotic). It is provided in the corrected grid ' +
    'as a cross-check diagnostic but the headline corrected slope uses ' +
    'the SIMPLE log N factor, which is what Bourgade 2010 derives ' +
    'directly from the explicit formula for the rate of change of the ' +
    'arithmetic term with N.',
    'If the verdict is arithmetic-correction-insufficient, the slope gap ' +
    'is real (not arithmetic). In that case either (a) the simplified ' +
    'correction is too crude and the exact Conrey-Snaith formula would ' +
    'close it, or (b) the imp-1162 observable is NOT in the ' +
    'Hughes-Rudnick universality class as claimed by imp-1163. Both are ' +
    'informative outcomes; neither is a ticket failure.',
    'The 5% universality window [-1.05, -0.95] is the ticket-specified ' +
    'standard for the verdict flip. We do NOT widen this window to make ' +
    'the verdict positive. Honest scope protocol.',
  ]),
  parallelTickets: ['imp-1162', 'imp-1163', 'imp-1165', 'imp-1167'],
});

export default IMP1166_CONREY_SNAITH_CORRECTION;

// ── Build-time tripwires ──────────────────────────────────────────────────

export const IMP1166_CONREY_SNAITH_CORRECTION_ASSERTIONS = [
  {
    id: 'imp1166-source-grid-matches-imp1162',
    holds: () => {
      // The 13 IMP1162_GRID rows mirrored here must match the imp-1162
      // combined-grid published values bit-for-bit (within IEEE-754
      // representability of the literals). Drift indicates either the
      // literals here were edited or the underlying imp-1162 file changed;
      // re-mirror together.
      const expected = [
        { N:     100, v: 0.06864163141521673   },
        { N:     200, v: 0.033674927150899245  },
        { N:     500, v: 0.019031316441728355  },
        { N:    1000, v: 0.00731459133683924   },
        { N:    2000, v: 0.0050857413083440495 },
        { N:    5000, v: 0.001969377182859525  },
        { N:   10000, v: 0.0008558736430692803 },
        { N:   20000, v: 0.0017321519541642016 },
        { N:   50000, v: 0.0002322207486724605 },
        { N:  100000, v: 0.00014148927165190587 },
        { N:  200000, v: 0.00007771047406411212 },
        { N:  500000, v: 0.000045450210738127436 },
        { N: 1000000, v: 0.00001639811835774324 },
      ];
      const rows = IMP1166_CONREY_SNAITH_CORRECTION.correctedGrid;
      if (rows.length !== 13) return false;
      for (let i = 0; i < expected.length; i++) {
        if (rows[i].N !== expected[i].N) return false;
        if (rows[i].varianceEmpirical !== expected[i].v) return false;
      }
      return true;
    },
    why:
      'The 13-point mirror of the imp-1162 combined grid must match the ' +
      'published values exactly. If they drift, the correction is being ' +
      'applied to the wrong data and the corrected slope and CI become ' +
      'misleading. Drift here means either the literals were edited or ' +
      'the upstream imp-1162 file changed; re-mirror both together.',
  },
  {
    id: 'imp1166-empirical-baseline-slope-matches-imp1162-headline',
    holds: () => {
      // The empirical OLS slope on the 13-point grid before correction must
      // match the published imp-1162 headline (slope approx -0.881) to 3 decimals.
      const s = IMP1166_CONREY_SNAITH_CORRECTION.empiricalOLS.slope;
      if (!Number.isFinite(s)) return false;
      return Math.abs(s - (-0.8807808726090421)) < 1e-9;
    },
    why:
      'The pre-correction OLS slope on the 13-point grid must reproduce ' +
      'the imp-1162 headline of -0.881 to bit-equivalence; the correction ' +
      'is then applied on top. If the baseline drifts, the comparison ' +
      'against the Hughes-Rudnick prediction is no longer meaningful.',
  },
  {
    id: 'imp1166-corrected-slope-in-universality-window',
    holds: () => {
      const v = IMP1166_CONREY_SNAITH_CORRECTION.verdict;
      // Tripwire HONESTY: this assertion only fires if the corrected slope
      // does NOT fall in [-1.05, -0.95]. If the verdict is
      // arithmetic-correction-insufficient, that is an informative result,
      // NOT a tripwire failure. So we check ONLY that the verdict string
      // matches the numerical containment -- not that the slope is in
      // the window.
      const slopeIn = v.correctedSlope >= -1.05 && v.correctedSlope <= -0.95;
      return slopeIn === v.withinHughesRudnick5pct;
    },
    why:
      'The withinHughesRudnick5pct boolean must match the actual numerical ' +
      'containment of the corrected slope in [-1.05, -0.95]. This is the ' +
      'central honesty tripwire: it pins the load-bearing claim about the ' +
      'arithmetic correction resolving the slope gap to the underlying ' +
      'number, so a future commit cannot quietly flip the verdict.',
  },
  {
    id: 'imp1166-novel-claim-consistent-with-verdict',
    holds: () => {
      const v = IMP1166_CONREY_SNAITH_CORRECTION.verdict;
      if (v.withinHughesRudnick5pct) {
        return v.novelClaim === 'arithmetic-correction-resolves-slope-gap';
      }
      return v.novelClaim === 'arithmetic-correction-insufficient';
    },
    why:
      'The novelClaim string must be derivable from withinHughesRudnick5pct: ' +
      'IN-window -> arithmetic-correction-resolves-slope-gap; OUT-of-window ' +
      '-> arithmetic-correction-insufficient. A flip between the two without ' +
      'the underlying number changing would silently misrepresent the ' +
      'finding.',
  },
  {
    id: 'imp1166-corrected-fit-r2-coherent',
    holds: () => {
      const r2 = IMP1166_CONREY_SNAITH_CORRECTION.correctedOLS.R2;
      // The corrected-fit R^2 should not be DRAMATICALLY worse than the
      // empirical R^2 (which is ~0.984). A drop below 0.85 would mean the
      // correction has destroyed the linear fit, suggesting either the
      // correction formula has a bug or the underlying universality
      // hypothesis is wrong on this grid.
      return Number.isFinite(r2) && r2 >= 0.85 && r2 <= 1.0;
    },
    why:
      'The corrected-fit R^2 must remain coherent (>= 0.85, <= 1.0). A ' +
      'sharp drop would invalidate the OLS slope interpretation: an OLS ' +
      'slope without a tight linear fit is just a number, not a power-law ' +
      'rate. The empirical (uncorrected) R^2 is approximately 0.984, so ' +
      'the corrected fit should remain in the same neighbourhood.',
  },
  {
    id: 'imp1166-bootstrap-ci-finite-and-ordered',
    holds: () => {
      const ci = IMP1166_CONREY_SNAITH_CORRECTION.bootstrap.slopeCI;
      if (!Number.isFinite(ci.ci_low_95) || !Number.isFinite(ci.ci_high_95)) {
        return false;
      }
      if (!Number.isFinite(ci.central)) return false;
      if (ci.ci_low_95 > ci.central || ci.central > ci.ci_high_95) return false;
      const width = ci.ci_high_95 - ci.ci_low_95;
      return width > 0 && width < 3;
    },
    why:
      'The bootstrap slope CI must have finite endpoints with ' +
      'ci_low_95 <= central <= ci_high_95 and total width in (0, 3). ' +
      'Width <= 0 would mean degenerate bootstrap; width >= 3 would mean ' +
      'the OLS fit is so unstable under row-resampling that the CI carries ' +
      'no information. Either is a numerical bug.',
  },
  {
    id: 'imp1166-bootstrap-replicate-count-above-spec',
    holds: () => {
      const b = IMP1166_CONREY_SNAITH_CORRECTION.bootstrap;
      return (
        b.nReplicates >= 500 &&
        b.nFinite >= 400  // some degenerate replicates with < 2 distinct N are skipped
      );
    },
    why:
      'The bootstrap must run at least 500 replicates (ticket spec) and ' +
      'at least 400 must produce finite (slope, intercept, R^2) triples. ' +
      'Sub-threshold replicate count corrupts the percentile CI; a noisy ' +
      'CI invalidates the verdict on whether -1 is contained.',
  },
  {
    id: 'imp1166-corrected-grid-arithmetic-factor-positive',
    holds: () => {
      const rows = IMP1166_CONREY_SNAITH_CORRECTION.correctedGrid;
      for (const r of rows) {
        if (!Number.isFinite(r.A_simplified) || r.A_simplified <= 0) return false;
        if (!Number.isFinite(r.A_CS_primeSum_normalized)) return false;
        if (!Number.isFinite(r.varianceCorrected) || r.varianceCorrected <= 0) return false;
      }
      return true;
    },
    why:
      'Every (A_simplified, A_CS_primeSum_normalized, varianceCorrected) ' +
      'triple in the corrected grid must be finite, with A_simplified and ' +
      'varianceCorrected strictly positive (negative variance is unphysical; ' +
      'a zero correction factor would create a division-by-zero in the ' +
      'corrected-grid construction).',
  },
  {
    id: 'imp1166-arithmetic-factor-monotone-in-N',
    holds: () => {
      // log N is strictly monotone, so A_simplified must be too.
      const rows = IMP1166_CONREY_SNAITH_CORRECTION.correctedGrid;
      for (let i = 1; i < rows.length; i++) {
        if (!(rows[i].A_simplified > rows[i - 1].A_simplified)) return false;
      }
      return true;
    },
    why:
      'A_simplified(N) = log N is strictly monotone increasing in N. The ' +
      'corrected-grid rows are ordered by N, so the recorded A_simplified ' +
      'values must also be strictly monotone. A violation indicates the ' +
      'grid was re-ordered or the correction function was changed without ' +
      'updating this tripwire.',
  },
  {
    id: 'imp1166-honest-scope-tag-permitted',
    holds: () => {
      const tag = IMP1166_CONREY_SNAITH_CORRECTION.verdict.honestScope;
      return tag === 'simplified-correction' || tag === 'full-conrey-snaith';
    },
    why:
      'The honestScope tag must be one of the two permitted values. ' +
      'A drift here would indicate the verdict was edited without updating ' +
      'the schema -- catch it at build time, not at consumer time. Under ' +
      'current ticket scope the value is simplified-correction.',
  },
  {
    id: 'imp1166-slope-shift-direction-correct',
    holds: () => {
      // The log-N correction is monotone increasing in N, so dividing
      // variance by it makes the corrected variance fall FASTER with N,
      // pushing the slope MORE NEGATIVE (toward -1). The shift should
      // therefore be NEGATIVE (correctedSlope < empiricalSlope).
      const v = IMP1166_CONREY_SNAITH_CORRECTION.verdict;
      return v.slopeShiftFromCorrection < 0;
    },
    why:
      'Since A_simplified(N) = log N is monotone increasing, dividing ' +
      'variance by it makes the corrected variance decrease faster than ' +
      'the empirical variance with N. The corrected slope must therefore ' +
      'be MORE NEGATIVE than the empirical slope. A positive shift would ' +
      'indicate a sign bug in the correction application.',
  },
];
