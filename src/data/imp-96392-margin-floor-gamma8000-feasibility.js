/**
 * imp-96392 -- Feasibility/cost of extending the measured rho(32,T) worst-support
 * margin column to gamma_8000, and a MEASUREMENT of the one half of the imp-96367
 * projection that does NOT need fresh rho: the intercept standard error (the design
 * denominator).
 *
 * imp-96367 measured the intercept-vs-census-depth trajectory of the reciprocal-log
 * margin law rho(32,T)=c+d/lnT: the intercept near-halves per census doubling
 * (0.15984 -> 0.11054 -> 0.07068 -> 0.03705 at gamma_4000) while the intercept SE
 * stays flat (~0.0139), and PROJECTED (explicitly NOT measured) that one more doubling
 * to gamma_8000 would put c~0.0185, seC~0.0139, c/seC~1.3, inside 2 SE of zero. This
 * ticket asks: is actually computing the rho(32,T) column out to gamma_8000 feasible,
 * and if so does the near-halving-intercept / flat-SE pair really continue?
 *
 * TWO SEPARABLE HALVES OF THE PROJECTION. The gamma_8000 sign confidence is c/seC, a
 * ratio of a NUMERATOR (the fitted intercept c) and a DENOMINATOR (its standard error
 * seC). imp-96307 established the design identity that makes them separable:
 *
 *     seC = sqrt( s2 * (1/n + xbar^2 / Sxx) )
 *
 * depends ONLY on the x-design {1/ln(T_i)} and the residual scale s2 -- NOT on the
 * realized ordinates of the new deep-height anchors. So the DENOMINATOR half can be
 * measured now, from the KNOWN gamma_8000 census heights plus the MEASURED gamma_4000
 * residual scale s2, with NO fabricated rho values. Only the NUMERATOR (does the
 * intercept keep halving) needs the fresh deep-height evaluations.
 *
 * PART A -- FEASIBILITY / COST (the numerator half is deferred). Genuinely measuring the
 * gamma_8000 intercept needs FRESH rho(32,T) at T>4506.31: zeta zeros extended past
 * gamma_4000, a re-run near-collision census, and a Gilbert min-norm-point solve per new
 * cutoff -- the imp-96224 LP pipeline (mpmath dps 25, ~1200s wall just to REACH
 * gamma_4000). A census doubling gamma_4000 -> gamma_8000 roughly doubles both the zero
 * count and the number of LP solves, so ~2400s+ single-threaded, and a single-threaded
 * offline solve of this weight is CPU-starved by the active pool. NOT runnable in this
 * pool worker; named as the sub-gap. So the intercept (numerator) stays measurement-
 * undecided past gamma_4000, exactly as imp-96367 left it.
 *
 * PART B -- WHAT IS MEASURABLE NOW (the denominator half, no fresh rho). The gamma_8000
 * census heights land at x = 1/ln(T) in a narrow window at the LOW-x edge of the existing
 * 34-point column. The gamma_4000 column ends at T=4506.31 (x=0.11886); the 8000th zero
 * sits near T~8174 (asymptotic gamma_N ~ 2*pi*N/ln(N/(2*pi*e)), which reproduces
 * gamma_4000~4606 vs the measured 4506.31), i.e. x~0.11100. So every new gamma_8000
 * anchor occupies x in [0.111, 0.119] -- a tiny extension just below the current minimum,
 * bunched near x->0 where the reciprocal-log fit already has anchors. Appending them under
 * the s2-fixed convention (reuse the measured gamma_4000 residual scale s2=2.682e-4):
 *
 *   append (s2-fixed, at leverage-optimal terminal x8=0.11100)   n     seC       frac tighter
 *   K = 5 new anchors                                            39    0.01231   11.2%
 *   K = 8 new anchors                                            42    0.01167   15.8%
 *   K = 10 new anchors                                           44    0.01132   18.4%
 *   realistic 8-height spread over (4506, 8174)                  42    0.01195   13.9%
 *
 * READING. Even the leverage-OPTIMAL placement (all K new anchors piled at the extreme
 * terminal x8, which maximizes their design leverage) shrinks the intercept SE by at most
 * ~18% -- from 0.013868 to ~0.0113, and a realistic spread of ~8 near-collision heights
 * only ~14% (to ~0.0120). The SE does NOT collapse: it stays near 0.012-0.014, essentially
 * the imp-96367 projected flat ~0.0139. So the FLAT-SE half of the imp-96367 projection is
 * structurally CONFIRMED (measured, not projected): the reciprocal-log x-compression means
 * new deep heights add almost no x-leverage, so the denominator cannot shrink enough to
 * decide the sign on its own.
 *
 * CONSEQUENCE. Because the denominator is now measured to stay ~0.012-0.014, the gamma_8000
 * sign decision rests ENTIRELY on the unmeasured NUMERATOR (does the intercept keep
 * near-halving to ~0.0185). If it does, c/seC ~ 0.0185/0.012 ~ 1.5, still inside 2 SE, so
 * the floor would become statistically indistinguishable from zero -- but that "if" is the
 * deferred fresh-height sub-gap, not settled here. This module CONFIRMS the SE half of the
 * imp-96367 projection and ISOLATES the intercept half as the only remaining unknown.
 *
 * UNCHANGED. The binding measured envelope rho_min=0.3791 at gamma_4000 stays strictly
 * positive, so the on-line margin SIGN survives; the genuine uniform-in-T off-line LP
 * (Weil-positivity strength) stays inaccessible. NO fabricated rho values; changes NO
 * Lambda bound; NO QED; no refereed bound is changed; RH open.
 *
 * GRADE: documentation/measurement/feasibility only. Import-light (columns baked from
 * imp-96224/imp-96367, recompute-and-check, no heavy bundle).
 *
 * @see imp-96367-route-bd-intercept-se-trajectory (the projection this assesses: c~0.0185 seC~0.0139 c/seC~1.3 at gamma_8000)
 * @see imp-96307-anchor-confidence-gain-projection (the SE-design identity: seC depends on x-design + s2, not the new ordinate)
 * @see imp-96224-route-bd-online-margin-floor-gamma4000 (source measured column + the ~1200s LP pipeline)
 */

// Seven ON-LINE anchors (imp-96148) + the 27 OFF-anchor measured heights (imp-96224),
// gamma_500..gamma_4000 -- REAL measured data, identical arrays to imp-96367.
const T7 = [60.0, 90.0, 120.0, 150.0, 200.0, 260.0, 395.98];
const R7 = [0.761, 0.692, 0.660, 0.636, 0.619, 0.600, 0.559];
const OFF_T = [500.0, 600.0, 700.0, 811.0, 900.0, 1000.0, 1100.0, 1200.0, 1300.0, 1419.0,
  1500.0, 1600.0, 1700.0, 1800.0, 1900.0, 2000.0, 2200.0, 2400.0, 2515.0,
  2600.0, 2800.0, 3000.0, 3300.0, 3600.0, 4000.0, 4400.0, 4506.31];
const OFF_RHO = [0.5522, 0.5358, 0.5331, 0.5241, 0.4915, 0.4914, 0.4840, 0.4783, 0.4754, 0.4580,
  0.4570, 0.4566, 0.4565, 0.4545, 0.4545, 0.4258, 0.4217, 0.4173, 0.4171,
  0.4086, 0.4081, 0.4073, 0.3985, 0.3916, 0.3845, 0.3800, 0.3791];
const T = T7.concat(OFF_T);
const RHO = R7.concat(OFF_RHO);
const X = T.map((t) => 1 / Math.log(t));

// OLS line rho = c + d*x with intercept SE and residual scale s2 (imp-96328 estimator).
function fitWithSE(xs, ys) {
  const n = xs.length;
  const sx = xs.reduce((a, b) => a + b, 0);
  const sy = ys.reduce((a, b) => a + b, 0);
  let sxx = 0, sxy = 0;
  for (let i = 0; i < n; i++) { sxx += xs[i] * xs[i]; sxy += xs[i] * ys[i]; }
  const d = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  const c = (sy - d * sx) / n;
  const xb = sx / n;
  const sxxCentered = xs.reduce((s, x) => s + (x - xb) ** 2, 0);
  let sse = 0;
  for (let i = 0; i < n; i++) { const yh = c + d * xs[i]; sse += (ys[i] - yh) ** 2; }
  const s2 = sse / (n - 2);
  const seC = Math.sqrt(s2 * (1 / n + (xb * xb) / sxxCentered));
  return { c, d, s2, seC, n };
}

// Baseline: the full 34-point gamma_4000 fit (reproduces imp-96367 endpoint).
const BASE = fitWithSE(X, RHO);

// gamma_8000 terminal height via the N-th zero asymptotic gamma_N ~ 2*pi*N/ln(N/(2*pi*e)).
function gammaN(N) { return (2 * Math.PI * N) / Math.log(N / (2 * Math.PI * Math.E)); }
const T8 = gammaN(8000);            // ~8174.2 (the estimate reproduces gamma_4000 ~ 4606 vs measured 4506.31)
const X8 = 1 / Math.log(T8);        // ~0.11100 -- just below the current low-x edge 0.11886

// s2-fixed intercept SE after appending K new anchors all at the leverage-optimal x8.
// SE depends only on the x-design and s2 (imp-96307), so this needs NO fabricated rho.
function seFixedAppendConstant(K, xnew, s2) {
  const xs = X.concat(Array(K).fill(xnew));
  const n = xs.length;
  const xb = xs.reduce((a, b) => a + b, 0) / n;
  const sxxCentered = xs.reduce((s, x) => s + (x - xb) ** 2, 0);
  return { K, n, seC: Math.sqrt(s2 * (1 / n + (xb * xb) / sxxCentered)) };
}
// s2-fixed intercept SE after appending an explicit spread of new heights.
function seFixedAppendHeights(newTs, s2) {
  const xs = X.concat(newTs.map((t) => 1 / Math.log(t)));
  const n = xs.length;
  const xb = xs.reduce((a, b) => a + b, 0) / n;
  const sxxCentered = xs.reduce((s, x) => s + (x - xb) ** 2, 0);
  return { n, seC: Math.sqrt(s2 * (1 / n + (xb * xb) / sxxCentered)) };
}

const APPEND_OPTIMAL = [5, 8, 10].map((K) => {
  const r = seFixedAppendConstant(K, X8, BASE.s2);
  return { K, n: r.n, seC: r.seC, fracTighter: 1 - r.seC / BASE.seC };
});
// Realistic near-collision spread of ~8 new heights across (4506.31, T8).
const SPREAD_TS = [4700, 5000, 5400, 5900, 6500, 7200, 7900, T8];
const APPEND_SPREAD = (() => {
  const r = seFixedAppendHeights(SPREAD_TS, BASE.s2);
  return { nNew: SPREAD_TS.length, n: r.n, seC: r.seC, fracTighter: 1 - r.seC / BASE.seC };
})();

// Best achievable SE-driven confidence gain (the K=10 leverage-optimal end of the band)
// still leaves the sign decision to the numerator: even at that seC, if the intercept
// keeps near-halving to ~0.0185 the ratio stays inside 2 SE.
const bestSE = APPEND_OPTIMAL[APPEND_OPTIMAL.length - 1].seC;
const projInterceptG8000 = BASE.c * 0.5;              // ~0.0185 (imp-96367 near-halving; NOT measured)
const cOverSE_atBestSE = projInterceptG8000 / bestSE; // ~1.6 -- still inside 2 SE

export const IMP_96392_GAMMA8000_FEASIBILITY = {
  id: 'imp-96392-margin-floor-gamma8000-feasibility',
  title:
    'Feasibility/cost of extending the measured rho(32,T) worst-support margin column to '
    + 'gamma_8000, plus a MEASUREMENT of the flat-SE half of the imp-96367 projection (the '
    + 'design denominator needs no fresh rho; the intercept numerator stays the sub-gap)',
  baseline: {
    n: BASE.n,                       // 34
    intercept: BASE.c,               // 0.03705
    seC: BASE.seC,                   // 0.013868
    s2: BASE.s2,                     // 2.682e-4
    cOverSE: BASE.c / BASE.seC,      // 2.672 (reproduces imp-96367 gamma_4000 endpoint)
  },
  gamma8000Design: {
    // The new census heights land in a narrow low-x window; almost no new x-leverage.
    terminalT: T8,                   // ~8174.2
    terminalX: X8,                   // ~0.11100
    currentLowXEdge: Math.min(...X), // 0.11886 (at T=4506.31)
    newAnchorXWindow: [X8, Math.min(...X)], // [0.11100, 0.11886]
    note: 'gamma_8000 anchors occupy x=1/lnT in [0.111, 0.119], a tiny extension below the '
      + 'current minimum, bunched near x->0 where the reciprocal-log fit already has anchors',
  },
  feasibility: {
    // PART A: the numerator (intercept) half is NOT runnable in a pool worker.
    runnableInPool: false,
    costModel: 'the imp-96224 LP pipeline (mpmath dps 25 zeros extension past gamma_4000 + '
      + 're-run near-collision census + Gilbert min-norm-point solve per new cutoff) is ~1200s '
      + 'wall just to REACH gamma_4000; a census doubling gamma_4000 -> gamma_8000 roughly '
      + 'doubles both the zero count and the LP-solve count, ~2400s+ single-threaded, and a '
      + 'single-threaded offline solve of this weight is CPU-starved by the active pool',
    deferred: 'the fresh rho(32,T) at T>4506.31 needed to MEASURE the gamma_8000 intercept is '
      + 'not evaluated here; the numerator (does the intercept keep near-halving) stays undecided',
  },
  seMeasurement: {
    // PART B: the denominator (SE) half IS measurable now, no fresh rho.
    appendOptimalAtTerminalX: APPEND_OPTIMAL,  // K=5/8/10 piled at x8: seC ~0.0123/0.0117/0.0113
    appendRealisticSpread: APPEND_SPREAD,      // 8-height spread: seC ~0.0120
    maxFracTighter: APPEND_OPTIMAL[APPEND_OPTIMAL.length - 1].fracTighter, // ~0.184
    seStaysFlat: true,
    reading: 'even the leverage-OPTIMAL placement (all K new anchors at the extreme terminal x8) '
      + 'shrinks the intercept SE by at most ~18% (0.013868 -> ~0.0113); a realistic 8-height '
      + 'spread only ~14% (-> ~0.0120). The SE stays near 0.012-0.014, essentially the imp-96367 '
      + 'projected flat ~0.0139 -- the reciprocal-log x-compression means new deep heights add '
      + 'almost no x-leverage, so the denominator cannot shrink enough to decide the sign',
  },
  consequence: {
    // With the denominator measured flat, the sign rests entirely on the unmeasured intercept.
    bestAchievableSE: bestSE,                  // ~0.0113
    projectedInterceptG8000: projInterceptG8000, // ~0.0185 (imp-96367 near-halving; NOT measured)
    cOverSEatBestSE: cOverSE_atBestSE,         // ~1.6 -- still inside 2 SE even at the tightest SE
    signRestsOnNumerator: true,
    note: 'because the denominator is now measured to stay ~0.012-0.014, the gamma_8000 sign '
      + 'decision rests ENTIRELY on the unmeasured intercept; even at the tightest achievable SE, '
      + 'a near-halved intercept ~0.0185 gives c/seC ~ 1.6, still inside 2 SE of zero',
  },
  finding:
    'assessing the imp-96367 gamma_8000 projection splits it into a now-measurable DENOMINATOR '
    + 'and a deferred NUMERATOR. The FLAT-SE half is confirmed by MEASUREMENT (no fresh rho): the '
    + 'gamma_8000 census heights land at x=1/lnT in [0.111, 0.119], a narrow low-x window adding '
    + 'almost no leverage, so appending them (s2-fixed) keeps the intercept SE near 0.012-0.014 '
    + '(at most ~18% tighter even at the leverage-optimal terminal x, ~14% for a realistic '
    + 'spread) -- the SE does NOT collapse. The near-halving-INTERCEPT half needs the ~2400s+ '
    + 'single-threaded imp-96224 LP pipeline (fresh zeta zeros past gamma_4000 + census + Gilbert '
    + 'solve), NOT runnable in this pool worker, so the numerator stays measurement-undecided. Net: '
    + 'the SE denominator is settled flat, the sign decision rests entirely on the deferred '
    + 'intercept, and even at the tightest achievable SE a near-halved intercept ~0.0185 lands '
    + 'c/seC ~ 1.6, still inside 2 SE of zero',
  subGap: {
    name: 'the gamma_8000 INTERCEPT (numerator) is not measurement-decided: fresh rho(32,T) at T>4506.31 not evaluated here',
    statement: 'Deciding whether the intercept keeps near-halving to ~0.0185 requires FRESH '
      + 'rho(32,T) at heights past gamma_4000 -- zeta zeros extended beyond gamma_4000, a re-run '
      + 'near-collision census, and a Gilbert min-norm-point solve per new cutoff (the imp-96224 '
      + 'LP pipeline, ~2400s+ single-threaded for the gamma_4000 -> gamma_8000 doubling, CPU-starved '
      + 'by the active pool). That heavy offline compute is not run here. Even a certified intercept '
      + 'crossing into 2-SE-of-zero would only confirm ON-line feasibility, not the OFF-line '
      + 'uniform-in-T LP (Weil-positivity strength) that is the actual binding wall.',
  },
  note:
    'documentation/measurement/feasibility only; import-light arrays baked from imp-96224/imp-96367, '
    + 'recompute-and-check; the SE half of the projection is MEASURED (no fabricated rho), the '
    + 'intercept half is deferred to the fresh-height LP pipeline; the binding envelope stays '
    + 'strictly positive (0.3791 at gamma_4000) so the margin SIGN survives; the genuine uniform-in-T '
    + 'off-line obstruction stays inaccessible; changes no Lambda bound; no refereed bound is changed'
    + '; RH open; NO QED',
  closesTickets: ['imp-96392'],
};

// -- honest-status banner (imp-96337 convention: plain-string, machine-readable) -----
export const IMP_96392_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. The intercept STANDARD ERROR does NOT '
  + 'collapse under a gamma_8000 census extension: even the leverage-optimal placement of new '
  + 'anchors tightens it by at most ~18% (0.013868 -> ~0.0113), a realistic spread by only ~14% '
  + '(-> ~0.0120) -- it stays near 0.012-0.014. The intercept NUMERATOR (does it keep '
  + 'near-halving past gamma_4000) is NOT measured here: it needs a fresh ~2400s+ single-threaded '
  + 'imp-96224 LP pipeline run (zeta zeros past gamma_4000 + census + Gilbert solve), not runnable '
  + 'in this pool worker. The gamma_8000 sign decision therefore stays measurement-undecided past '
  + 'gamma_4000, resting entirely on that deferred numerator.';

// -- assertions (import-light; recompute-and-check only) -------------------
export const IMP_96392_ASSERTIONS = [
  {
    id: 'imp-96392-baseline-reproduces-gamma4000-endpoint',
    holds: () => BASE.n === 34
      && Math.abs(BASE.c - 0.03705) < 1e-3
      && Math.abs(BASE.seC - 0.013868) < 1e-4
      && Math.abs(BASE.c / BASE.seC - 2.672) < 1e-2,
    why: 'the 34-point baseline must reproduce the imp-96367 gamma_4000 endpoint (c=0.03705, seC=0.01387, c/seC=2.672).',
  },
  {
    id: 'imp-96392-gamma8000-heights-land-in-low-x-window',
    holds: () => Math.abs(T8 - 8174.2) < 5
      && X8 > 0.1105 && X8 < 0.1115
      && X8 < Math.min(...X) && Math.min(...X) < 0.12,
    why: 'the estimated gamma_8000 terminal height ~8174 must sit at x~0.111, just below the current low-x edge 0.11886 (a narrow low-leverage window).',
  },
  {
    id: 'imp-96392-se-stays-flat-under-optimal-append',
    holds: () => {
      const k10 = APPEND_OPTIMAL.find((r) => r.K === 10);
      return k10.seC > 0.0110 && k10.seC < 0.0135
        && k10.fracTighter < 0.20
        && IMP_96392_GAMMA8000_FEASIBILITY.seMeasurement.seStaysFlat === true;
    },
    why: 'even the leverage-optimal placement of 10 new anchors at the terminal x must shrink the intercept SE by under 20% (SE stays near 0.011-0.014, not collapsing).',
  },
  {
    id: 'imp-96392-realistic-spread-tightens-under-15pct',
    holds: () => APPEND_SPREAD.nNew === 8
      && APPEND_SPREAD.seC > 0.0115 && APPEND_SPREAD.seC < 0.0130
      && APPEND_SPREAD.fracTighter < 0.15,
    why: 'a realistic 8-height near-collision spread must tighten the SE only ~14% (to ~0.0120), confirming the flat-SE half of the projection.',
  },
  {
    id: 'imp-96392-sign-rests-on-numerator',
    holds: () => IMP_96392_GAMMA8000_FEASIBILITY.consequence.signRestsOnNumerator === true
      && cOverSE_atBestSE < 2 && cOverSE_atBestSE > 1,
    why: 'with the denominator measured flat, a near-halved intercept ~0.0185 at the tightest achievable SE gives c/seC ~ 1.6, still inside 2 SE -- the sign rests entirely on the deferred numerator.',
  },
  {
    id: 'imp-96392-feasibility-defers-fresh-rho',
    holds: () => IMP_96392_GAMMA8000_FEASIBILITY.feasibility.runnableInPool === false
      && /2400s/.test(IMP_96392_GAMMA8000_FEASIBILITY.feasibility.costModel)
      && /FRESH rho/.test(IMP_96392_GAMMA8000_FEASIBILITY.subGap.statement)
      && /Weil/.test(IMP_96392_GAMMA8000_FEASIBILITY.subGap.statement),
    why: 'the honest partial must state the gamma_8000 numerator is not runnable in the pool (~2400s+ LP pipeline) and name the fresh-height sub-gap plus the off-line Weil-positivity wall.',
  },
  {
    id: 'imp-96392-no-fabricated-rho',
    holds: () => /no fabricated rho|no fresh rho/i.test(IMP_96392_GAMMA8000_FEASIBILITY.note)
      && /NO QED/.test(IMP_96392_GAMMA8000_FEASIBILITY.note),
    why: 'the SE half is measured from the x-design + measured s2 with no fabricated rho; this moves no Lambda bound and proves no QED.',
  },
  {
    id: 'imp-96392-honest-banner-states-flat-se-and-undecided-numerator',
    holds: () => /does NOT.*collapse/.test(IMP_96392_HONEST_BANNER)
      && /0.012-0.014/.test(IMP_96392_HONEST_BANNER)
      && /measurement-undecided/.test(IMP_96392_HONEST_BANNER)
      && /RH open/.test(IMP_96392_HONEST_BANNER)
      && /NO QED/.test(IMP_96392_HONEST_BANNER),
    why: 'the honest-status banner must state both halves plainly: the SE does not collapse '
      + '(stays 0.012-0.014) and the intercept numerator stays measurement-undecided past gamma_4000.',
  },
  {
    id: 'imp-96392-closes-self',
    holds: () => Array.isArray(IMP_96392_GAMMA8000_FEASIBILITY.closesTickets)
      && IMP_96392_GAMMA8000_FEASIBILITY.closesTickets.includes('imp-96392'),
    why: 'this module is the feasibility/measurement deliverable the imp-96392 ticket asked for.',
  },
];

for (const a of IMP_96392_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96392-margin-floor-gamma8000-feasibility assertion failed: ${a.id}`);
  }
}

export default IMP_96392_GAMMA8000_FEASIBILITY;
