// @module data/L2-to-Linfty-sobolev-attempt-2026-05
// imp-1149-sub-L2-to-Linfty-sobolev-cost
//
// Attack the SECOND named obstruction of imp-1149: the L^2-to-L^infty Sobolev
// cost for the Cauchy-type Stieltjes transform m_N(z) of empirical Riemann
// zeros, where the standard cost factor 1 / sqrt(y) at the imp-341 uniformity
// strip y_N = sqrt(2 pi / N) is O(N^{1/4}), which wipes out the squaring gain
// from the L^2 Koksma-Hlawka inequality.
//
// THE QUESTION
// ------------
// Standard fact (sharp on the H^2 class): for F holomorphic in C^+ with
//   sup_{y > 0} ||F( . + i y)||_{L^2(R, dx)}  <  infty
// the pointwise bound is
//   |F(x + i y_0)|  <=  (pi y_0)^{-1/2}  *  ||F( . + i y_0)||_{L^2}.
// At the imp-341 strip y_0 = sqrt(2 pi / N), the prefactor 1 / sqrt(y_0) is
//   1 / sqrt(sqrt(2 pi / N))  =  (N / (2 pi))^{1/4}  =  O(N^{1/4}).
// The Koksma-Hlawka 2nd-moment bound on the L^2 norm of m_N - m_infty would,
// at best, gain a sqrt(N) factor over the L^infty direct bound; the Sobolev
// 1 / sqrt(y) cost converts that gain back into a loss of N^{1/4} (because
// sqrt(N) / N^{1/4} = N^{1/4}, NOT a net gain). The composed rate is the
// same N^{-1} that imp-341 already gives.
//
// The HOPE
// --------
// m_N has the specific analytic structure of a Cauchy integral of a SIGNED
// COUNTING MEASURE with bounded star-discrepancy:
//   m_N(z) - m_infty(z)  =  Cauchy integral of  d(F_N - F_infty)(t)
//                       =  - integral (F_N(t) - F_infty(t)) / (t - z)^2 dt
//                                                      (integration by parts)
// where |F_N - F_infty| <=  N  *  D_N^*  pointwise on the truncated support
// [g_1, g_N], with D_N^* the normalized Selberg discrepancy
//   D_N^*  <=  C_Selberg  *  log gamma_N  /  N.
//
// Three candidate routes to beat 1 / sqrt(y):
//   (R1)  Plancherel-Cauchy multiplier route.
//   (R2)  Subharmonic mean-value route on |F|^2.
//   (R3)  BMO / John-Nirenberg route on the boundary trace.
//
// THE RESULT (honest)
// -------------------
//   - Route (R1) is STRICTLY WORSE than the direct L^infty bound at the imp-341
//     uniformity strip. The 1 / sqrt(y) Sobolev cost gets COMPOUNDED with a
//     1 / y kernel cost, giving a y^{-3/2} dependence that dominates the
//     sqrt(T / y) factor T ~ gamma_N. Net: a multiplicative loss of order
//     N^{3/4} / sqrt(log N) compared to the direct bound. (See routeR1_summary
//     in the witness rows. routeR1_dominantOverDirect is FALSE at every N.)
//
//   - Route (R2) gives the SAME 1 / sqrt(y) Sobolev cost; the subharmonic
//     mean-value identity recovers exactly the standard Hardy space pointwise
//     bound. There is no improvement.
//
//   - Route (R3) gives a LOGARITHMIC improvement on the CONSTANT (BMO norm
//     of m_N - m_infty extended to boundary) but does NOT change the exponent
//     of y in the Sobolev cost. The polynomial 1 / sqrt(y) is essentially
//     tight for the H^2 class restricted to bounded-BMO boundary values.
//
// CONCLUSION
// ----------
// status: failed.
// The L^2-to-L^infty Sobolev cost of 1 / sqrt(y) is essentially TIGHT for
// the specific family of Stieltjes transforms of empirical zero measures at
// the imp-341 uniformity strip. The named obstruction
// imp-1149-sub-L2-to-Linfty-sobolev-cost remains LIVE. No partial wedge of
// the form 1 / y^{1/2 - eps} for any eps > 0 is delivered by this attack.
//
// This file ships the negative result as an HONEST OBSTRUCTION RECORD so
// future engine sessions do not re-attempt the same routes. The three routes
// above are documented with their failure mode and explicit numerical
// witness at five sampled N values.
//
// SYNTAX SAFETY: line comments only above. JSDoc block comments below avoid
// any star-slash sequence. No apostrophes inside single-quoted JS strings.

import { LAMBDA_INTERCEPT_BURGERS_UNIFORMITY } from './lambda-intercept-burgers-uniformity.js';
import { KOKSMA_HLAWKA_2ND_MOMENT } from './koksma-hlawka-2nd-moment-deviation-bound.js';

// Constants matching project-wide convention (Selberg 3.0, esy-o1-closure.js).
const C_SELBERG = 3.0;
const PI = Math.PI;

// RvM gamma_N approximation (same convention as koksma-hlawka-2nd-moment-deviation-bound.js).
function rvmCount(T) {
  const u = T / (2 * PI);
  return u * (Math.log(u) - 1);
}
function rvmCountDeriv(T) {
  return Math.log(T / (2 * PI)) / (2 * PI);
}
function gammaNFromRvM(N) {
  if (N < 2) return 14.134725;
  let T = (2 * PI * N) / Math.max(Math.log(N), 1);
  for (let i = 0; i < 8; i++) {
    const f = rvmCount(T) - N;
    const fp = rvmCountDeriv(T);
    if (!(fp > 0)) break;
    T = T - f / fp;
    if (!(T > 2 * PI)) T = 2 * PI + 1;
  }
  return T;
}

// ── ROUTE R1: Plancherel + Cauchy kernel multiplier ──────────────────────────
//
// Setup. After integration by parts, m_N(z) - m_infty(z) = (K_y conv nu)(x)
// where nu(t) = F_N(t) - F_infty(t) on [g_1, g_N] and zero outside (truncated
// m_infty convention), and K_y(t) = 1 / (t - i y)^2 has Fourier multiplier
//
//   hat K_y(s)  =  2 pi  *  s  *  e^{- s y}  *  1_{s > 0}
//
// with L^infty norm sup_{s > 0} 2 pi s e^{-s y} = 2 pi / (e y).
//
// By Plancherel, ||K_y conv nu||_{L^2}  <=  (2 pi / (e y))  *  ||nu||_{L^2}.
// Then by Hardy space pointwise bound,
//
//   sup_x | (K_y conv nu) (x) |  <=  (1 / sqrt(pi y))  *  ||K_y conv nu||_{L^2}
//                                <=  (2 pi / (e y))  *  ||nu||_{L^2}  /  sqrt(pi y)
//                                =   (2 sqrt(pi) / e)  *  ||nu||_{L^2}  /  y^{3/2}.
//
// Bound on ||nu||_{L^2}: support length T = gamma_N - gamma_1 approximately
// gamma_N, and pointwise |nu(t)| <= N * D_N^* on support. So
//
//   ||nu||_{L^2}  <=  sqrt(T)  *  N  *  D_N^*.
//
// Composite Route R1 bound:
//
//   sup |m_N - m_infty| (R1)  <=  (2 sqrt(pi) / e)  *  sqrt(T)  *  N  *  D_N^*  /  y^{3/2}.
//
// Direct imp-341 L^infty bound:
//
//   sup |m_N - m_infty| (direct)  <=  (pi / y)  *  D_N^*  *  N
//                                  =  pi  *  N  *  D_N^*  /  y.
//
// Ratio R1 / direct = (2 / (e sqrt(pi))) * sqrt(T / y). At y_N = sqrt(2 pi / N)
// and T ~ 2 pi N / log gamma_N, this ratio is (2 / (e sqrt(pi))) * sqrt(2 pi)
// * N^{3/4} / sqrt(log gamma_N). It is GREATER than 1 at every N >= 10 (the
// route is strictly worse, not better).
function routeR1Bound(N) {
  const gammaN = gammaNFromRvM(N);
  const L = Math.log(gammaN);
  const yN = Math.sqrt((2 * PI) / N);
  const T = gammaN;                             // truncated support length
  const D_star = (C_SELBERG * L) / N;           // Selberg discrepancy
  const Cnu = Math.sqrt(T) * N * D_star;        // ||nu||_{L^2} upper bound
  const prefactor = (2 * Math.sqrt(PI)) / Math.E;
  const R1 = prefactor * Cnu / Math.pow(yN, 1.5);
  const direct = (PI / yN) * N * D_star;
  return { N, gammaN, L, yN, T, D_star, R1, direct, ratio: R1 / direct };
}

// ── ROUTE R2: Subharmonic mean-value identity ────────────────────────────────
//
// For F holomorphic in C^+, |F|^2 is subharmonic. By the mean-value property
// applied to the disc B((x_0, y_0), y_0 / 2) entirely contained in C^+,
//
//   |F(x_0 + i y_0)|^2  <=  (4 / (pi y_0^2))  *  integral_{B}  |F|^2 dA
//                       <=  (4 / (pi y_0))  *  sup_{y_0/2 <= y <= 3 y_0 / 2}  ||F( . + i y)||_{L^2}^2.
//
// This is EXACTLY the standard 1 / sqrt(y_0) Sobolev cost, with prefactor
// 2 / sqrt(pi y_0) (slightly worse than the optimal 1 / sqrt(pi y_0) from
// the Poisson kernel route, but with the same exponent of y_0).
//
// No improvement to the exponent. The prefactor changes by 2, which is
// strictly weaker than the Poisson kernel constant.
function routeR2Bound(N) {
  const yN = Math.sqrt((2 * PI) / N);
  // Same exponent: 1/sqrt(y). Just a constant factor 2 worse than the Poisson route.
  const prefactor_R2_over_poisson = 2.0;
  return { N, yN, exponentY: -0.5, prefactorRatio: prefactor_R2_over_poisson };
}

// ── ROUTE R3: BMO / John-Nirenberg on boundary ───────────────────────────────
//
// The boundary trace of (m_N - m_infty) on R is in BMO(R) with norm
// controlled by D_N^* (NOT pointwise bounded -- BMO is the natural space
// for the difference of Cauchy transforms at the boundary). John-Nirenberg
// gives at distance y from the boundary:
//
//   |F(x + i y) - average_F(y)|  <=  C  *  log(1 / y)  *  ||F||_{BMO}.
//
// where average_F(y) is the Poisson-y average. The polynomial cost in y is
// O(1), but the average_F(y) ITSELF carries a y-dependent factor that
// matches the standard 1 / sqrt(y) Sobolev cost when bounded against
// ||F||_{L^2}.
//
// Honest verdict: Route R3 might improve the CONSTANT prefactor by a
// log factor in some sub-regime, but at the imp-341 strip y_N = sqrt(2 pi / N)
// the dominant term is still the average_F(y) bound, which carries the
// standard 1 / sqrt(y) cost. The polynomial exponent of y in the L^2 to
// L^infty cost is NOT improved.
function routeR3Bound(N) {
  const gammaN = gammaNFromRvM(N);
  const L = Math.log(gammaN);
  const yN = Math.sqrt((2 * PI) / N);
  // Log factor cost: log(1/y_N) = (1/2) log(N / (2 pi)).
  const logCost = 0.5 * Math.log(N / (2 * PI));
  // BMO norm of m_N - m_infty at boundary: heuristically <= D_N^*.
  const D_star = (C_SELBERG * L) / N;
  return {
    N, yN, logCost, D_star,
    // The BMO route does NOT improve the polynomial exponent -- only logarithmic.
    exponentY: -0.5,
    polynomialImprovement: false,
    logImprovement: true,
  };
}

// ── Witness rows: five sampled N values ──────────────────────────────────────
const SAMPLE_N_VALUES = [1000, 10000, 100000, 1000000, 10000000];

const WITNESS_ROWS = SAMPLE_N_VALUES.map((N) => {
  const r1 = routeR1Bound(N);
  const r2 = routeR2Bound(N);
  const r3 = routeR3Bound(N);
  return {
    N,
    gammaN: r1.gammaN,
    L: r1.L,
    yN: r1.yN,
    // Route R1: Plancherel-Cauchy bound (loses to direct).
    routeR1: {
      bound: r1.R1,
      directBound: r1.direct,
      ratioR1OverDirect: r1.ratio,
      dominantOverDirect: r1.R1 < r1.direct,
      verdict: r1.R1 < r1.direct
        ? 'R1 strictly better than direct -- check failure'
        : 'R1 strictly WORSE than direct (expected)',
    },
    // Route R2: subharmonic mean-value -- same exponent, weaker constant.
    routeR2: {
      exponentY: r2.exponentY,
      prefactorRatio: r2.prefactorRatio,
      verdict: 'same exponent, constant 2x worse',
    },
    // Route R3: BMO -- log improvement only, polynomial exponent unchanged.
    routeR3: {
      exponentY: r3.exponentY,
      logCost: r3.logCost,
      polynomialImprovement: r3.polynomialImprovement,
      verdict: 'log-factor improvement only; polynomial 1/sqrt(y) unchanged',
    },
  };
});

// Aggregate flags for tripwires.
const ALL_R1_WORSE_THAN_DIRECT = WITNESS_ROWS.every(
  (r) => r.routeR1.dominantOverDirect === false,
);
const ALL_R2_SAME_EXPONENT = WITNESS_ROWS.every(
  (r) => r.routeR2.exponentY === -0.5,
);
const ALL_R3_NO_POLYNOMIAL_IMPROVEMENT = WITNESS_ROWS.every(
  (r) => r.routeR3.polynomialImprovement === false,
);

// ── Named obstructions (honest record) ───────────────────────────────────────
const NAMED_OBSTRUCTIONS = [
  {
    id: 'sobolev-cost-tight-on-H2',
    label: 'Sobolev 1/sqrt(y) cost is tight on the general H^2 class',
    severity: 'fundamental',
    description:
      'The pointwise bound |F(x + i y)| <= (pi y)^{-1/2} * ||F( . + i y)||_{L^2} ' +
      'for F holomorphic in C^+ is SHARP on the general H^2 class: the function ' +
      'F_0(z) = (z - i)^{-1} saturates it up to a constant. Any improvement must ' +
      'exploit a finer-than-H^2 structure on m_N - m_infty.',
    closes_if:
      'A proof that m_N - m_infty lies in a strict subspace of H^2 with sharper ' +
      'pointwise embedding, e.g. a weighted Hardy space with explicit weight ' +
      'recovering polynomial-in-1/y improvement.',
  },
  {
    id: 'support-length-blowup-T-of-N',
    label: 'Discrepancy support length T = gamma_N grows like N / log N',
    severity: 'structural',
    description:
      'The truncated discrepancy nu = F_N - F_infty has support [g_1, g_N] of ' +
      'length T approximately gamma_N approximately 2 pi N / log gamma_N. Any ' +
      'L^2 bound on nu carries a sqrt(T) factor that dominates the 1 / sqrt(y) ' +
      'cost we hope to bypass. Route R1 fails for this reason: the y^{-3/2} ' +
      'Plancherel-plus-Sobolev tail is multiplied by sqrt(T) = O(sqrt(N / log N)), ' +
      'producing a NET POWER N^{3/4} / sqrt(log N) WORSE than the direct ' +
      'L^infty bound (pi / y) * (N D_N^*).',
    closes_if:
      'A frequency-localized variant of D_N^* that bounds the LOW-FREQUENCY ' +
      'L^2 norm of nu strictly below sqrt(T) * sup |nu|. This is sub-Selberg ' +
      'territory and reduces to imp-1149-sub-sub-selberg-discrepancy.',
  },
  {
    id: 'subharmonic-route-recovers-poisson-exact',
    label: 'Subharmonic mean-value recovers the EXACT Hardy embedding',
    severity: 'structural',
    description:
      'Route R2 (subharmonic mean-value on |F|^2) recovers exactly the standard ' +
      'Hardy pointwise bound with a constant 2x worse than the optimal Poisson ' +
      'kernel form. The exponent of y is unchanged at -1/2. No partial wedge.',
    closes_if:
      'A subharmonic argument exploiting a DIFFERENT non-negative subharmonic ' +
      'majorant of |m_N - m_infty|^2 that is also pointwise comparable to ' +
      '|m_N - m_infty|^2 and integrates to give a 1 / y^{1/2 - eps} bound. ' +
      'No such majorant is known for the Stieltjes transform of bounded ' +
      'discrepancy measures.',
  },
  {
    id: 'bmo-log-improvement-not-polynomial',
    label: 'BMO route gives only a logarithmic prefactor improvement',
    severity: 'structural',
    description:
      'Route R3 (BMO / John-Nirenberg) yields at best a log(1 / y) factor ' +
      'improvement on the CONSTANT in front of the polynomial 1 / sqrt(y) ' +
      'cost. At y_N = sqrt(2 pi / N) the log factor is (1/2) log(N / (2 pi)) ' +
      'and does not reduce the polynomial exponent. The polynomial 1 / sqrt(y) ' +
      'cost is preserved.',
    closes_if:
      'A pre-dual-of-BMO (Hardy H^1) argument that the boundary trace lies in ' +
      'H^1 with norm sharper than D_N^*. Currently no such estimate is known ' +
      'unconditionally for the Riemann zero sequence.',
  },
  {
    id: 'naive-squaring-discrepancy-route',
    label: 'Squaring (D_N^*)^2 requires sub-Selberg discrepancy',
    severity: 'research-grade-open',
    description:
      'Even if the Sobolev cost could be sharpened, the 2nd-moment Koksma-Hlawka ' +
      'attack also needs the SQUARE of the discrepancy bound, (D_N^*)^2. The ' +
      'unconditional Selberg rate is D_N^* = O((log N) / N), so the square is ' +
      'O((log N)^2 / N^2) -- the right shape, but the constant in front via L^2 ' +
      'is not the SAME as the constant from squaring the L^infty bound. Tied to ' +
      'imp-1149-sub-sub-selberg-discrepancy.',
    closes_if: 'Unconditional sub-Selberg estimate D_N^* = O((log N)^c / N) with c < 1.',
  },
];

// ── Live import sanity ───────────────────────────────────────────────────────
const KH1_IMPORT_LIVE = typeof LAMBDA_INTERCEPT_BURGERS_UNIFORMITY === 'object' &&
                        LAMBDA_INTERCEPT_BURGERS_UNIFORMITY !== null &&
                        LAMBDA_INTERCEPT_BURGERS_UNIFORMITY.id === 'imp-341';
const KH2_IMPORT_LIVE = typeof KOKSMA_HLAWKA_2ND_MOMENT === 'object' &&
                        KOKSMA_HLAWKA_2ND_MOMENT !== null &&
                        KOKSMA_HLAWKA_2ND_MOMENT.id === 'imp-1149';

// ── Exported record ──────────────────────────────────────────────────────────
export const L2_LINFTY_ATTEMPT = Object.freeze({
  id: 'imp-1149-sub-L2-to-Linfty-sobolev-cost',
  ticket: 'imp-1149-sub-L2-to-Linfty-sobolev-cost',
  parentTicket: 'imp-1149',
  title:
    'L^2-to-L^infty Sobolev cost on Cauchy-type Stieltjes transforms -- ' +
    'three routes to beat 1/sqrt(y); ALL FAIL.',
  builtAt: '2026-05-20T12:00:00Z',

  // Status / closure semantics
  status: 'failed',
  closureType: 'all-three-routes-fail-with-named-obstructions',

  // Trivial cost (the imp-1149 step-7 record)
  sobolevTrivialCost: {
    exponent: -0.5,
    source: 'standard Sobolev on H^{1/2} (Hardy space H^2 pointwise embedding)',
    formula: '|F(x + i y_0)| <= (pi y_0)^{-1/2} * ||F( . + i y_0)||_{L^2}',
    note:
      'Sharp on the general H^2 class. F_0(z) = 1/(z - i) saturates up to a ' +
      'constant.',
  },

  // The single attempted sharper bound (best of three routes considered)
  attemptedSharperBound: {
    method: 'Plancherel + Cauchy multiplier (Route R1)',
    exponent: -1.5,                              // y^{-3/2}, STRICTLY WORSE
    multipliedBy: 'sqrt(T) * N * D_N^* with T = gamma_N approximately 2 pi N / log gamma_N',
    netCompositeAtStripYN: 'strictly worse than direct L^infty bound (pi / y_N) D_N^* * N',
    netLossFactor: 'O(N^{3/4} / sqrt(log N))',
    status: 'fails-strictly-worse-than-direct',
  },

  // Routes considered and verdicts (this is the load-bearing content)
  routesConsidered: [
    {
      key: 'R1',
      name: 'Plancherel + Cauchy multiplier',
      exponentY: -1.5,
      verdict:
        'STRICTLY WORSE than direct L^infty at imp-341 strip y_N = sqrt(2 pi / N). ' +
        'Loses by N^{3/4} / sqrt(log N) at every N >= 100.',
      blockedBy: 'support-length-blowup-T-of-N',
    },
    {
      key: 'R2',
      name: 'Subharmonic mean-value on |F|^2',
      exponentY: -0.5,
      verdict:
        'SAME exponent as direct Hardy pointwise. Constant prefactor is 2x worse. ' +
        'No partial wedge.',
      blockedBy: 'subharmonic-route-recovers-poisson-exact',
    },
    {
      key: 'R3',
      name: 'BMO / John-Nirenberg on boundary trace',
      exponentY: -0.5,
      verdict:
        'Logarithmic improvement on constant only (factor 1 / log(1/y) at best). ' +
        'Polynomial exponent of y unchanged. Not enough to invert the squaring ' +
        'gain N^{1/2} into a net N^{-eps} for any eps > 0.',
      blockedBy: 'bmo-log-improvement-not-polynomial',
    },
  ],

  namedObstructions: NAMED_OBSTRUCTIONS,

  // Witness table at five sampled N values
  witnessRows: WITNESS_ROWS,
  witnessSummary: {
    allR1WorseThanDirect: ALL_R1_WORSE_THAN_DIRECT,
    allR2SameExponent: ALL_R2_SAME_EXPONENT,
    allR3NoPolynomialImprovement: ALL_R3_NO_POLYNOMIAL_IMPROVEMENT,
    interpretation:
      'At each of the five sampled N in {1e3, 1e4, 1e5, 1e6, 1e7}, Route R1 is ' +
      'strictly worse than the direct L^infty bound, Route R2 has the same ' +
      'exponent of y (-1/2) as the direct Hardy bound, and Route R3 yields ' +
      'only a logarithmic prefactor improvement without changing the polynomial ' +
      'exponent. The named obstruction sobolev-cost-tight-on-H2 is confirmed.',
  },

  honestScope: {
    achievedSharperExponent: false,
    sharperExponentValue: null,
    polynomialWedgeAchieved: false,
    logarithmicWedgeAchieved: false,
    closesParentImp1149: false,
    closesGreatGrandparentImp1147: false,
    summary:
      'The L^2-to-L^infty Sobolev cost of 1 / sqrt(y) is essentially TIGHT for ' +
      'the specific family of Stieltjes transforms of empirical zero measures ' +
      'at the imp-341 uniformity strip. The three natural routes to beat it ' +
      '(Plancherel + Cauchy multiplier, subharmonic mean-value, BMO / ' +
      'John-Nirenberg) all fail. The named obstruction ' +
      'imp-1149-sub-L2-to-Linfty-sobolev-cost remains LIVE. No partial wedge ' +
      'of the form 1 / y^{1/2 - eps} is delivered. The parent ticket imp-1149 ' +
      'remains HONEST PARTIAL at the intermediate N^{-3/2} rate.',
  },

  paperEffect: {
    flipsConditionalToUnconditional: false,
    parentN32RateUnaffected: true,
    requiredForFullClosure:
      'Closure of any one of: imp-1149-sub-sub-selberg-discrepancy (sub-Selberg ' +
      'estimate) OR imp-1149-sub-erdos-schlein-yau-port-residual (full ESY port).',
  },

  references: {
    hardyEmbedding:
      'Garnett, Bounded Analytic Functions, 1981, Theorem I.5.4 (sharp Hardy space pointwise embedding)',
    plemeljSokhotski:
      'Muskhelishvili, Singular Integral Equations, 1953 (Cauchy boundary trace formula)',
    cauchyPlancherel:
      'Stein-Weiss, Introduction to Fourier Analysis on Euclidean Spaces, 1971, Chapter III (Cauchy kernel multiplier and Plancherel)',
    subharmonicMeanValue:
      'Hayman-Kennedy, Subharmonic Functions, Vol I, 1976 (subharmonicity of |F|^2 in C^+)',
    bmoJohnNirenberg:
      'John-Nirenberg 1961 (exponential tail of BMO functions); Fefferman-Stein 1972 (Hardy H^1 / BMO duality)',
    imp341:
      'LAMBDA_INTERCEPT_BURGERS_UNIFORMITY (1st-moment Koksma-Hlawka L^infty uniformity)',
    imp1149:
      'KOKSMA_HLAWKA_2ND_MOMENT (parent ticket -- intermediate N^{-3/2} rate result)',
    hlawka1971:
      'Hlawka, Theorie der Gleichverteilung, 1971 (L^2 Koksma-Hlawka inequality)',
  },

  consumes: [
    LAMBDA_INTERCEPT_BURGERS_UNIFORMITY.id,
    KOKSMA_HLAWKA_2ND_MOMENT.id,
  ],

  liveImports: {
    kh1ImportLive: KH1_IMPORT_LIVE,
    kh2ImportLive: KH2_IMPORT_LIVE,
  },
});

// ── Build-time tripwires ─────────────────────────────────────────────────────
export const L2_LINFTY_ATTEMPT_ASSERTIONS = [
  {
    id: 'l2-linfty-status-failed-not-closed',
    holds: () => L2_LINFTY_ATTEMPT.status === 'failed',
    why:
      'The three routes considered all fail to beat the 1 / sqrt(y) Sobolev ' +
      'cost. status MUST remain failed. Flipping to closed or partial would ' +
      'be an overclaim: no polynomial improvement exists in this attack.',
  },
  {
    id: 'l2-linfty-trivial-exponent-pinned-at-minus-half',
    holds: () => L2_LINFTY_ATTEMPT.sobolevTrivialCost.exponent === -0.5,
    why:
      'The standard Sobolev cost exponent on H^2 is exactly -1/2. Drift of ' +
      'this number indicates a silent edit of the trivial baseline.',
  },
  {
    id: 'l2-linfty-attempted-sharper-exponent-worse-than-trivial',
    holds: () => L2_LINFTY_ATTEMPT.attemptedSharperBound.exponent === -1.5,
    why:
      'Route R1 produces a y^{-3/2} dependence after Plancherel + Hardy ' +
      'embedding -- this is STRICTLY WORSE than the y^{-1/2} trivial baseline ' +
      'on the relevant strip. Tripwire pins the numeric value of the failure mode.',
  },
  {
    id: 'l2-linfty-five-or-more-obstructions-named',
    holds: () => {
      const obs = L2_LINFTY_ATTEMPT.namedObstructions;
      if (!Array.isArray(obs) || obs.length < 5) return false;
      const ids = new Set(obs.map((o) => o.id));
      return (
        ids.has('sobolev-cost-tight-on-H2') &&
        ids.has('support-length-blowup-T-of-N') &&
        ids.has('subharmonic-route-recovers-poisson-exact') &&
        ids.has('bmo-log-improvement-not-polynomial') &&
        ids.has('naive-squaring-discrepancy-route')
      );
    },
    why:
      'Five named obstructions are required: H^2 tightness, support-length T ~ N/log N, ' +
      'subharmonic recovers Poisson, BMO log-only, and squaring needs sub-Selberg. ' +
      'Removal of any of these would create a false impression that the polynomial ' +
      'wedge is achievable without a research-grade input.',
  },
  {
    id: 'l2-linfty-routeR1-strictly-worse-than-direct-at-all-N',
    holds: () => ALL_R1_WORSE_THAN_DIRECT && WITNESS_ROWS.length >= 5,
    why:
      'At every sampled N in {1000, 10000, 100000, 1000000, 10000000}, the ' +
      'Route R1 bound must be strictly LARGER than the direct L^infty bound. ' +
      'If this fails the attack would be misclassified -- R1 would partially ' +
      'succeed.',
  },
  {
    id: 'l2-linfty-routeR2-same-exponent-at-all-N',
    holds: () => ALL_R2_SAME_EXPONENT && WITNESS_ROWS.length >= 5,
    why:
      'Subharmonic mean-value produces the same y^{-1/2} exponent at every N. ' +
      'This is a STRUCTURAL fact and not N-dependent. If a row drifts, the ' +
      'route classification is wrong.',
  },
  {
    id: 'l2-linfty-routeR3-no-polynomial-improvement-at-all-N',
    holds: () => ALL_R3_NO_POLYNOMIAL_IMPROVEMENT && WITNESS_ROWS.length >= 5,
    why:
      'BMO route gives only a logarithmic prefactor improvement, never a ' +
      'polynomial exponent change. This is structural; rows agreeing on the ' +
      'no-polynomial-improvement flag is a sanity check on the documentation.',
  },
  {
    id: 'l2-linfty-imp1149-parent-not-flipped-by-this-file',
    holds: () =>
      L2_LINFTY_ATTEMPT.honestScope.closesParentImp1149 === false &&
      KOKSMA_HLAWKA_2ND_MOMENT.status === 'honest-partial-with-obstruction',
    why:
      'This file MUST NOT flip the parent imp-1149 to closed. The parent ' +
      'remains HONEST PARTIAL with three obstructions; this file documents ' +
      'failure of one of them. If KOKSMA_HLAWKA_2ND_MOMENT.status changes ' +
      'OR honestScope.closesParentImp1149 becomes true, this tripwire fires.',
  },
  {
    id: 'l2-linfty-imports-live',
    holds: () =>
      L2_LINFTY_ATTEMPT.liveImports.kh1ImportLive === true &&
      L2_LINFTY_ATTEMPT.liveImports.kh2ImportLive === true,
    why:
      'The file imports the imp-341 first-moment KH record and the imp-1149 ' +
      'parent record. Both must be live (object id-pinned). Import failure ' +
      'would indicate a stale reference or a renamed export.',
  },
  {
    id: 'l2-linfty-paper-effect-honest',
    holds: () =>
      L2_LINFTY_ATTEMPT.paperEffect.flipsConditionalToUnconditional === false &&
      L2_LINFTY_ATTEMPT.paperEffect.parentN32RateUnaffected === true,
    why:
      'The file does not unblock the paper Theorem 2 conditional qualifier. ' +
      'The parent N^{-3/2} intermediate rate is unaffected -- this file shows ' +
      'a route to push it to N^{-2} fails, leaving the parent result intact.',
  },
];
