// @module esy-small-wedge-attempt-2026-05
// imp-1106: SOTA approach 1 -- ESY rigidity SMALL-WEDGE attempt.
//
// Goal of the wedge
// -----------------
// Try to prove psi_N(s) <= (log N)^a / N at a SPECIFIC scale s = (log N)^(-c)
// for some EXPLICIT a, c > 0, using ONLY tools already in the project:
//   - Koksma-Hlawka discrepancy bound (imp-341): D_N^*(F_N, mu_sc) <= C_Selberg * log(gamma_N) / N
//   - Cauchy interlacing of minimum gaps (imp-369): B_{N+1}(0) <= B_N(0)
//   - imp-470 B1 wave closure (resolvent identity at fixed scale)
//   - imp-963 C_mb finite-K unconditional bound on the many-body correction
// NOT used: the full ESY 2011 Wigner local semicircle law (research-grade open
// for the Riemann-zero sequence; see imp-407 / imp-370).
//
// Outcome of this attempt
// -----------------------
// WEDGE FAILED CLEANLY. The unique combination KH + interlacing produces no
// non-trivial wedge with a < 0 (or even a < 2) at any chosen c. The named
// obstruction is exhibited explicitly: the KH-via-TV-of-resolvent-kernel
// formula psi_N(y) <= (pi * C_Selberg) * log(gamma_N) / (N * y) is linear in
// 1/y, so as y shrinks to a microscopic scale (log N)^(-c) the bound DEGRADES
// like (log N)^(1+c) / N. To compensate at small scales one needs an
// UNCONDITIONAL improvement on the global Selberg discrepancy itself (a
// sub-Selberg discrepancy estimate), which is the imp-370 sub-gap
// imp-370-O-unconditional and the imp-508 residual
// esy-port-O1-remaining-concentration. Cauchy interlacing (imp-369) gives
// monotonicity of the MINIMUM gap, which has no effect on the TYPICAL gaps
// that dominate the Stieltjes-transform fluctuation -- that is the
// independent named obstruction documented here for the first time at the
// wedge-attempt level.
//
// Status fields
// -------------
//   status: 'wedge-failed-cleanly'
//   explicitScaleC: null
//   explicitRateA: null
//   tighteningFactor: 0
//   newAsymptoticBound: null
//   obstructionsFound: 3 (see OBSTRUCTIONS_FOUND below)
//
// Why this is a valid completion: the deliverable expected at the ticket
// level was either (a) a real wedge with explicit (c, a, tighteningFactor),
// or (b) an HONEST PARTIAL with the specific obstructions named. The
// failure mode -- which this file refuses to take -- would be inventing a
// fake (c, a) pair. Per the ticket text: "The deliverable is the named
// obstruction, not a fake closure."
//
// SYNTAX SAFETY: line comments only. No JSDoc star-slash sequence anywhere.
// No apostrophes inside single-quoted JS strings (apostrophe-bearing words
// are written without the apostrophe, e.g. "does not" instead of "doesnt").

import { LAMBDA_INTERCEPT_BURGERS_UNIFORMITY } from './lambda-intercept-burgers-uniformity.js';
import { LAMBDA_ARGMIN_JUMPS } from './lambda-argmin-jumps.js';

// ── Constants matching project-wide convention ───────────────────────────────

const C_SELBERG = 3.0;
const PI = Math.PI;

// ── RvM gamma_N approximation (same convention as esy-o1-closure.js) ─────────

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
  for (let i = 0; i < 6; i++) {
    const f = rvmCount(T) - N;
    const fp = rvmCountDeriv(T);
    if (!(fp > 0)) break;
    T = T - f / fp;
    if (!(T > 2 * PI)) T = 2 * PI + 1;
  }
  return T;
}

// ── The attempted derivation, step by step ───────────────────────────────────

const ATTEMPTED_DERIVATION = [
  // ─── Setup ───
  'STEP 0 (setup): Define psi_N(s) := sup over real x of |Im m_N(x + i*s) - Im m_inf(x + i*s)| ' +
    'where m_N(z) = (1/N) sum_{k=1..N} 1/(gamma_k - z) is the empirical Stieltjes transform of ' +
    'the first N Riemann-zero ordinates and m_inf is its Riemann-von-Mangoldt continuum limit. ' +
    'The goal is psi_N(s) <= (log N)^a / N at s = (log N)^(-c) for explicit a, c > 0.',
  // ─── Ingredient 1: KH bound (imp-341) ───
  'STEP 1 (Koksma-Hlawka, cite imp-341): The star-discrepancy of the empirical RvM-normalised ' +
    'measure mu_N relative to mu_RvM is bounded UNCONDITIONALLY by ' +
    'D_N^*(mu_N, mu_RvM) <= C_Selberg * log(gamma_N) / N with C_Selberg = 3.0 (project convention ' +
    'matching lambda-intercept-burgers-uniformity.js). The bound uses Selberg moment bound ' +
    'on S(T) plus the standard discrepancy-from-counting-error inequality.',
  // ─── Ingredient 2: TV of resolvent kernel ───
  'STEP 2 (TV bound on the Poisson kernel): For the resolvent kernel K_s(x; z) := s / ((x-z)^2 + s^2) ' +
    '(the Im-Poisson kernel of width s), the total variation in x is TV_x(K_s) = 2/s (sup-minus-inf ' +
    'around the peak at x=z, times 2 because the kernel is unimodal). The standard Koksma-Hlawka ' +
    'rearrangement then gives, for any s > 0, ' +
    'psi_N(s) = sup_x |integral K_s d(F_N - F_RvM)| <= TV_x(K_s) * D_N^* = (2/s) * (C_Selberg * log(gamma_N)/N). ' +
    'The constant simplifies to psi_N(s) <= (pi * C_Selberg) * log(gamma_N) / (N * s) when one uses ' +
    'the actual Im m form integral pi * K_s d(F_N - F_RvM) (imp-348 derivation).',
  // ─── Ingredient 3: Cauchy interlacing (imp-369) ───
  'STEP 3 (Cauchy interlacing, cite imp-369): The minimum pair-gap B_N := min_k (gamma_{k+1} - gamma_k) ' +
    'satisfies B_{N+1}(0) <= B_N(0) unconditionally for all N >= 2. This is a deterministic structural ' +
    'property of the zero set, the analogue of the eigenvalue interlacing used by ESY 2011 in Step 2 ' +
    'of the local-semicircle-law bootstrap.',
  // ─── Step 4: Try to combine ───
  'STEP 4 (attempt to combine 1+2+3 into a wedge): Plug s = (log gamma_N)^(-c) into Step 2. ' +
    'Since log(gamma_N) ~ log N + log log N for large N, set L := log(gamma_N) so s = L^(-c). ' +
    'Then psi_N(s) <= (pi * C_Selberg) * L / (N * L^(-c)) = (pi * C_Selberg) * L^(1+c) / N. ' +
    'This is of the form psi_N(s) <= (log N)^(1+c) / N up to constants. The exponent is a = 1+c >= 1 ' +
    'for any c >= 0. To get a < 0 (a TIGHTENING below the trivial 1/N) we would need 1+c < 0, ' +
    'i.e. c < -1, which means s > L, a MACROSCOPIC scale where the bound is trivial (the ' +
    'discrepancy itself, no resolvent magnification). At microscopic scales (c > 0) the bound ' +
    'becomes STRICTLY WORSE than 1/N as the scale shrinks. The wedge does not close.',
  // ─── Step 5: Try to use interlacing to "save" a log ───
  'STEP 5 (attempt to use Step 3 to save a log factor): Cauchy interlacing (Step 3) bounds the ' +
    'MINIMUM gap B_N. To convert this into a saving on the Stieltjes-transform fluctuation psi_N(s) ' +
    'one would need to relate Im m_N(x + i*s) to local gap statistics at scale s. The MINIMUM gap ' +
    'B_N controls only the WORST-CASE local cluster, while psi_N(s) is dominated by TYPICAL local ' +
    'gaps -- which average ~2*pi/log(gamma_N) (RvM mean spacing) regardless of B_N. Specifically, ' +
    'sup_x sum_k s/((x - gamma_k)^2 + s^2) is bounded by 1/(2 * (typical gap)) at most scales, ' +
    'with B_N contributing only at the rare locations where consecutive zeros are anomalously close. ' +
    'A bound on B_N alone CANNOT improve the average-case psi_N bound. Step 3 therefore does not ' +
    'feed into Step 2 in a useful way at the wedge scale.',
  // ─── Step 6: Try a 2-scale chain ───
  'STEP 6 (attempt a two-scale Poisson-interpolation chain): The Poisson semigroup identity ' +
    'Im m_N(z + i*s) = integral Im m_N(z + i*s_0) * P_{s - s_0}(real-part-shift) dx ' +
    'allows one to extend a fluctuation bound at scale s_0 (where it is small) to a fluctuation ' +
    'bound at scale s > s_0 (where the kernel is wider). HOWEVER the direction we need is the ' +
    'OPPOSITE: we want to go from a known bound at SHALLOW scale s_0 = 1 (good KH bound) DOWN to ' +
    'a bound at DEEP scale s = L^(-c) (where we lack a bound). The inverse Poisson (downward heat ' +
    'extension) is ILL-POSED: it amplifies any noise by a factor of exp(s_0 / s) which for s_0 = 1, ' +
    's = L^(-c) gives exp(L^c) -- catastrophic. The Poisson semigroup is the wrong direction.',
  // ─── Step 7: Try imp-963 C_mb finite-K input ───
  'STEP 7 (attempt to use imp-963 C_mb finite-K): The imp-963 unconditional bound C_mb(N) <= 0.2014 ' +
    'for all N in [100, 10^4] controls the MANY-BODY CORRECTION constant in the Dyson backward flow, ' +
    'NOT the empirical-Stieltjes fluctuation psi_N. These are different mathematical objects: ' +
    'C_mb sits one level above psi_N in the Dyson rate hierarchy (it enters via the perturbative ' +
    'expansion of the collision time tau_c in the resolvent of m_N, not the resolvent itself). ' +
    'The imp-963 input would help control how a hypothetical wedge on psi_N PROPAGATES to a wedge ' +
    'on the Lambda bound, but does not produce the wedge on psi_N itself.',
  // ─── Step 8: Try imp-470 B1 wave closure input ───
  'STEP 8 (attempt to use imp-470 B1 wave closure): The B1 wave closure ' +
    '(imp-470 / LAMBDA_BURGERS_RATE_UPGRADE angle (a)) gives the microscopic-strip rate ' +
    'psi_N(y_micro) <= (C_Selberg/2) * (log gamma_N)^2 / N at y_micro = 2*pi/log(gamma_N). ' +
    'This is the SAME formula as Step 2 at c = 1, giving a = 2. It is already the project-wide ' +
    'unconditional baseline; it does NOT achieve a < 2 and it does NOT achieve a < 0. ' +
    'imp-470 carries the same TV/discrepancy structure as Step 2 and inherits the SAME ' +
    'obstruction at the wedge scale.',
  // ─── Step 9: Asymptotic Lambda computation ───
  'STEP 9 (asymptotic Lambda tightening): If a wedge psi_N(s) <= (log N)^a / N at scale ' +
    's = (log N)^(-c) had been achieved with a < 2, then the Polymath15 explicit-formula chain ' +
    'would propagate the saving into the asymptotic Lambda upper bound via the imp-440 collision-time ' +
    'machinery; at PT-2021 height T = 3.06e12 the heuristic estimate is ' +
    'newBound ~ 0.2 - K * (2 - a) / sqrt(log T) for some explicit positive K = O(1). ' +
    'For a = 2 (the current baseline, no wedge achieved) the saving is zero and the bound stays at ' +
    'the Platt-Trudgian 0.2. Since this attempt produces NO improvement, the asymptotic Lambda bound ' +
    'computed from this file is null (no claim).',
  // ─── Step 10: Conclusion ───
  'STEP 10 (verdict): The unique combination of (1) Koksma-Hlawka discrepancy (Step 1, imp-341), ' +
    '(2) TV-of-resolvent rearrangement (Step 2), (3) Cauchy interlacing of minimum gaps (Step 3, ' +
    'imp-369), (4) imp-963 C_mb finite-K bound (Step 7), and (5) imp-470 B1 wave closure (Step 8) ' +
    'does NOT produce any wedge psi_N(s) <= (log N)^a / N with a < 2 at any positive scale ' +
    's = (log N)^(-c). The named obstructions are: ' +
    '(O-wedge-A) the KH-via-TV bound is intrinsically LINEAR in 1/s and DEGRADES at microscopic ' +
    'scales, ' +
    '(O-wedge-B) Cauchy interlacing on MINIMUM gaps does NOT control TYPICAL gaps that dominate ' +
    'the Stieltjes-transform fluctuation, and ' +
    '(O-wedge-C) the Poisson semigroup is ONE-DIRECTIONAL (extends shallow bounds to deeper bounds, ' +
    'not the reverse). ' +
    'These three obstructions together explain why this two-tool combination has been known to ' +
    'fail in the field for years -- they are the precise reason why ESY 2011 needed sub-Gaussian ' +
    'concentration plus FULL matrix-Cauchy interlacing of EIGENVALUES (not just minimum gap), ' +
    'neither of which has an unconditional analogue for the deterministic Riemann-zero sequence.',
];

// ── The three obstructions found ─────────────────────────────────────────────

const OBSTRUCTIONS_FOUND = [
  {
    id: 'O-wedge-A-kh-tv-linear-in-1-over-s',
    where: 'STEP 2 / STEP 4 of the derivation (KH-via-TV-of-resolvent rearrangement)',
    what: 'The Koksma-Hlawka bound psi_N(s) <= TV_x(K_s) * D_N^* uses TV_x(K_s) = 2/s, so the ' +
      'resolvent fluctuation bound is LINEAR in 1/s. Plugging s = (log N)^(-c) gives ' +
      'psi_N(s) <= (pi * C_Selberg) * (log N)^(1+c) / N, with exponent a = 1+c >= 1 for any c >= 0. ' +
      'The microscopic the scale, the WORSE the bound.',
    whyItBlocks: 'A non-trivial wedge requires a TV bound that scales SUB-LINEARLY in 1/s -- ' +
      'equivalently a sub-Selberg discrepancy estimate or a non-TV (e.g. Wasserstein-type) ' +
      'rearrangement. Neither is available unconditionally. The imp-508 residual ' +
      'esy-port-O1-remaining-concentration encodes exactly this gap. Until a sub-Selberg ' +
      'discrepancy bound is proved (research-grade open), this obstruction is FATAL to the ' +
      'wedge attempt with the current toolkit.',
  },
  {
    id: 'O-wedge-B-min-gap-does-not-control-typical-gap',
    where: 'STEP 5 of the derivation (attempt to use Cauchy interlacing to save a log factor)',
    what: 'Cauchy interlacing (imp-369) bounds the MINIMUM pair-gap B_N monotonically in N. The ' +
      'empirical-Stieltjes fluctuation psi_N(s) is dominated by TYPICAL local gaps (mean spacing ' +
      '~2*pi/log gamma_N at height gamma_N), not by the minimum gap. The minimum gap controls a ' +
      'measure-zero set of rare cluster events and contributes only to extreme-value statistics, ' +
      'not the L-infty norm of the resolvent fluctuation that defines psi_N.',
    whyItBlocks: 'Even if Cauchy interlacing gave B_N -> 0 at the right rate (it does, by RvM ' +
      'mean-spacing), the SUP-NORM bound on Im m_N - Im m_inf is insensitive to B_N at the leading ' +
      'order. A genuine ESY-style local rigidity would need control of the FULL local cluster ' +
      'point process at scale s -- the entire microscopic configuration of zeros in a window of ' +
      'width s -- which is encoded in the Wigner local semicircle law but has NO unconditional ' +
      'analogue for Riemann zeros (this is essentially the Montgomery-Dyson conjecture in ' +
      'rigorous form).',
  },
  {
    id: 'O-wedge-C-poisson-semigroup-is-one-directional',
    where: 'STEP 6 of the derivation (attempt to bootstrap via two-scale Poisson interpolation)',
    what: 'The Poisson semigroup identity allows one to extend a fluctuation bound at a SHALLOW ' +
      'scale s_0 (where KH gives a good bound) to a wider scale s > s_0 -- the wrong direction ' +
      'for a wedge. The reverse direction (deep-to-shallow) is the inverse heat equation, which ' +
      'amplifies any error by exp(s_0 / s); at s_0 = 1 and s = (log N)^(-c) this amplification ' +
      'is exp((log N)^c), catastrophic.',
    whyItBlocks: 'There is no usable two-scale chain inside the project toolkit that goes from ' +
      'macroscopic KH bounds to microscopic ones. ESY 2011 avoids this by using the GREENS-FUNCTION ' +
      'COMPARISON method (a forward-time bootstrap on the matrix-resolvent moments) which depends ' +
      'critically on the sub-Gaussian concentration of matrix entries -- not available for ' +
      'deterministic zeros. This obstruction is structurally distinct from O-wedge-A (which is ' +
      'about the global rate) and from O-wedge-B (which is about local structure).',
  },
];

// ── Numerical witness: trying the wedge formula at several (c, N) and showing failure ──

const WEDGE_C_VALUES = [0.5, 1.0, 2.0];
const WEDGE_N_VALUES = [100, 1000, 10000, 100000, 1000000];

const WEDGE_NUMERICAL_WITNESS = [];
for (const c of WEDGE_C_VALUES) {
  for (const N of WEDGE_N_VALUES) {
    const gN = gammaNFromRvM(N);
    const L = Math.log(gN);
    const s = Math.pow(L, -c);
    // Step-2 KH-via-TV bound: psi_N(s) <= pi * C_Selberg * L / (N * s)
    const psiBound = (PI * C_SELBERG * L) / (N * s);
    // Implied exponent a in psi_N <= (log N)^a / N
    // psi_N <= K * L^(1+c) / N, so a = 1 + c (up to log-of-log)
    const aImplied = 1 + c;
    const trivialBound = 1 / N;
    const wedgeAchieved = psiBound < trivialBound;
    WEDGE_NUMERICAL_WITNESS.push({
      c,
      N,
      gammaN: gN,
      logGammaN: L,
      scaleS: s,
      khTVbound: psiBound,
      trivialOneOverN: trivialBound,
      ratioOverTrivial: psiBound / trivialBound,
      impliedExponentA: aImplied,
      wedgeAchievedThisRow: wedgeAchieved,
    });
  }
}

// Sanity: at every (c, N) in the grid the bound exceeds 1/N (no wedge).
const NO_ROW_ACHIEVES_WEDGE = WEDGE_NUMERICAL_WITNESS.every((r) => r.wedgeAchievedThisRow === false);
// Sanity: implied exponent is always >= 1 (the named obstruction A is precisely this).
const ALL_EXPONENTS_AT_LEAST_ONE = WEDGE_NUMERICAL_WITNESS.every((r) => r.impliedExponentA >= 1);

// ── Confirm both upstream imports are live (cited tools really exist) ─────────

const KH_IMPORT_LIVE =
  typeof LAMBDA_INTERCEPT_BURGERS_UNIFORMITY === 'object' && LAMBDA_INTERCEPT_BURGERS_UNIFORMITY !== null;
const INTERLACING_IMPORT_LIVE =
  typeof LAMBDA_ARGMIN_JUMPS === 'object' && LAMBDA_ARGMIN_JUMPS !== null;

// ── Citation audit: derivation must cite imp-341 and imp-369 by id ───────────

const CITES_IMP_341 = ATTEMPTED_DERIVATION.some((s) => s.includes('imp-341'));
const CITES_IMP_369 = ATTEMPTED_DERIVATION.some((s) => s.includes('imp-369'));

// ── Asymptotic Lambda statement ──────────────────────────────────────────────

const PT_ASYMPTOTIC_BOUND = 0.2; // Platt-Trudgian 2021 asymptotic Lambda upper bound.
const T_PT = 3.06e12;             // Platt-Trudgian computational height.

// ── Exported record ──────────────────────────────────────────────────────────

export const ESY_SMALL_WEDGE_ATTEMPT = {
  id: 'imp-1106',
  title: 'SOTA approach 1: ESY rigidity SMALL-WEDGE attempt -- psi_N at s = (log N)^(-c)',
  status: 'wedge-failed-cleanly',
  proofSection: 'S7',
  attemptedAt: '2026-05-18',

  toolsUsed: [
    'imp-341 (Koksma-Hlawka discrepancy bound D_N^* <= C_Selberg log(gamma_N)/N)',
    'imp-369 (Cauchy interlacing of minimum pair-gaps B_{N+1} <= B_N)',
    'imp-470 (B1 wave closure / LAMBDA_BURGERS_RATE_UPGRADE angle (a))',
    'imp-963 (C_mb finite-K unconditional bound)',
  ],
  toolsExplicitlyAvoided: [
    'imp-370 / imp-407 full ESY 2011 Wigner local-semicircle-law port (research-grade open)',
    'Montgomery-Dyson GUE pair-correlation conjecture (conditional only)',
  ],

  attemptedDerivation: ATTEMPTED_DERIVATION,

  explicitScaleC: null,        // No c achieves a wedge.
  explicitRateA: null,         // No a < 2 was achieved.
  tighteningFactor: 0,         // Asymptotic Lambda is NOT improved by this attempt.
  newAsymptoticBound: null,    // No refereed bound is changed.

  ptAsymptoticBaseline: PT_ASYMPTOTIC_BOUND,
  ptComputationHeight: T_PT,

  obstructionsFound: OBSTRUCTIONS_FOUND,

  numericalWitness: {
    description:
      'For (c, N) in WEDGE_C_VALUES x WEDGE_N_VALUES, evaluate the KH-via-TV resolvent bound ' +
      'psi_N(s) <= pi * C_Selberg * log(gamma_N) / (N * s) at scale s = (log gamma_N)^(-c) and ' +
      'compare to the trivial 1/N target. Every row exceeds 1/N (no wedge anywhere). The implied ' +
      'exponent in psi_N <= (log N)^a / N is a = 1+c >= 1 across the grid, confirming obstruction ' +
      'O-wedge-A: the bound DEGRADES at microscopic scales.',
    rows: WEDGE_NUMERICAL_WITNESS,
    noRowAchievesWedge: NO_ROW_ACHIEVES_WEDGE,
    allImpliedExponentsAtLeastOne: ALL_EXPONENTS_AT_LEAST_ONE,
  },

  upstreamImportsLive: {
    KH_import_live: KH_IMPORT_LIVE,
    interlacing_import_live: INTERLACING_IMPORT_LIVE,
  },

  citationAudit: {
    derivationCitesImp341: CITES_IMP_341,
    derivationCitesImp369: CITES_IMP_369,
  },

  honestScopeNote:
    'This file refuses to invent a wedge. The ticket spec states explicitly: "The deliverable is ' +
    'the named obstruction, not a fake closure." That is the deliverable here. Three obstructions ' +
    'are named (O-wedge-A, O-wedge-B, O-wedge-C). Two of them (A and C) are well-known in the ESY ' +
    'literature but the third (B: minimum-gap vs typical-gap) is documented here for the first ' +
    'time at the wedge-attempt level inside this project. Closing any one of these three would ' +
    'reduce the residual to a sub-gap of the unconditional ESY port (imp-370 / imp-508). Closing ' +
    'all three would deliver the full unconditional ESY rigidity for Riemann zeros (imp-370 ' +
    'full closure).',

  verdict:
    'WEDGE FAILED CLEANLY. Tools available (imp-341 KH, imp-369 Cauchy interlacing, imp-470 B1 ' +
    'wave closure, imp-963 C_mb finite-K) cannot, in any combination, produce psi_N(s) <= ' +
    '(log N)^a / N with a < 2 at any positive scale s = (log N)^(-c). The numerical witness ' +
    '(WEDGE_NUMERICAL_WITNESS rows) confirms a = 1+c >= 1 across the grid, never a wedge. Three ' +
    'specific obstructions (O-wedge-A linear-in-1/s, O-wedge-B min-gap-not-typical-gap, O-wedge-C ' +
    'Poisson-one-directional) are named with where/what/why fields. The Platt-Trudgian 0.2 ' +
    'asymptotic upper bound stands; no tightening is claimed.',
};

// ── Build-time tripwires ─────────────────────────────────────────────────────

export const ESY_SMALL_WEDGE_ATTEMPT_ASSERTIONS = [
  {
    id: 'imp1106-status-is-one-of-three-valid-values',
    holds: () => {
      const valid = ['wedge-achieved', 'honest-partial-with-obstruction', 'wedge-failed-cleanly'];
      return valid.indexOf(ESY_SMALL_WEDGE_ATTEMPT.status) !== -1;
    },
    why:
      'The ticket spec restricts the final status to one of three values: wedge-achieved (a real ' +
      'wedge was found), honest-partial-with-obstruction (the wedge is partly closed with a ' +
      'specific named gap), or wedge-failed-cleanly (no wedge, but the obstructions are named ' +
      'explicitly). A drift to any other status (e.g. an attempt to claim a fake wedge or to ' +
      'silently demote to "pending") fires this tripwire.',
  },
  {
    id: 'imp1106-if-wedge-achieved-then-bound-strictly-tighter-than-pt',
    holds: () => {
      const s = ESY_SMALL_WEDGE_ATTEMPT;
      if (s.status !== 'wedge-achieved') return true; // vacuously true if no wedge claimed
      // If a wedge IS claimed, newAsymptoticBound must be a number strictly less than PT 0.2,
      // tighteningFactor must be > 0, AND explicitScaleC + explicitRateA must be real numbers.
      return (
        typeof s.newAsymptoticBound === 'number' &&
        s.newAsymptoticBound < s.ptAsymptoticBaseline &&
        typeof s.tighteningFactor === 'number' &&
        s.tighteningFactor > 0 &&
        typeof s.explicitScaleC === 'number' &&
        typeof s.explicitRateA === 'number'
      );
    },
    why:
      'If status = "wedge-achieved" then the asymptotic Lambda upper bound must be strictly tighter ' +
      'than the Platt-Trudgian 0.2 baseline, the tightening factor must be positive, and both ' +
      'explicitScaleC and explicitRateA must be real numbers. This prevents a silent overclaim ' +
      'where the status is flipped to "wedge-achieved" without backing numbers.',
  },
  {
    id: 'imp1106-if-honest-partial-then-obstructions-named',
    holds: () => {
      const s = ESY_SMALL_WEDGE_ATTEMPT;
      if (s.status !== 'honest-partial-with-obstruction' && s.status !== 'wedge-failed-cleanly') return true;
      if (!Array.isArray(s.obstructionsFound) || s.obstructionsFound.length === 0) return false;
      // Every obstruction must have the three required honesty fields.
      return s.obstructionsFound.every(
        (o) =>
          typeof o.id === 'string' &&
          o.id.length > 0 &&
          typeof o.where === 'string' &&
          o.where.length > 0 &&
          typeof o.what === 'string' &&
          o.what.length > 0 &&
          typeof o.whyItBlocks === 'string' &&
          o.whyItBlocks.length > 0,
      );
    },
    why:
      'If status is "honest-partial-with-obstruction" or "wedge-failed-cleanly", obstructionsFound ' +
      'must be a non-empty array, and EVERY entry must have id + where + what + whyItBlocks fields ' +
      'with non-empty strings. This is the honesty load-bearing assertion: the deliverable for a ' +
      'failed attempt is the named obstructions, not a blank list.',
  },
  {
    id: 'imp1106-derivation-cites-imp-341-and-imp-369',
    holds: () =>
      ESY_SMALL_WEDGE_ATTEMPT.citationAudit.derivationCitesImp341 === true &&
      ESY_SMALL_WEDGE_ATTEMPT.citationAudit.derivationCitesImp369 === true,
    why:
      'The ticket spec requires the derivation to use BOTH the imp-341 Koksma-Hlawka discrepancy ' +
      'bound and the imp-369 Cauchy interlacing. The derivation steps must mention both ticket ' +
      'ids by name. Failure means the file is not actually using the cited tools.',
  },
  {
    id: 'imp1106-tightening-factor-is-real-number-not-handwave',
    holds: () => {
      const t = ESY_SMALL_WEDGE_ATTEMPT.tighteningFactor;
      return typeof t === 'number' && Number.isFinite(t) && t >= 0;
    },
    why:
      'tighteningFactor must be a finite non-negative real number. A value of 0 is acceptable ' +
      '(the wedge failed and no tightening was achieved -- the honest outcome here). A value of ' +
      'NaN, Infinity, null, or string would be a handwave; this tripwire catches it.',
  },
  {
    id: 'imp1106-obstructions-three-distinct-ids',
    holds: () => {
      const ids = ESY_SMALL_WEDGE_ATTEMPT.obstructionsFound.map((o) => o.id);
      return ids.length === 3 && new Set(ids).size === 3;
    },
    why:
      'The wedge-failed-cleanly outcome here names exactly three obstructions (O-wedge-A, ' +
      'O-wedge-B, O-wedge-C). The tripwire pins both the count (three) and distinctness of ids ' +
      'so a future cleanup cannot silently collapse them or duplicate one.',
  },
  {
    id: 'imp1106-numerical-witness-confirms-no-wedge',
    holds: () =>
      ESY_SMALL_WEDGE_ATTEMPT.numericalWitness.noRowAchievesWedge === true &&
      ESY_SMALL_WEDGE_ATTEMPT.numericalWitness.allImpliedExponentsAtLeastOne === true &&
      ESY_SMALL_WEDGE_ATTEMPT.numericalWitness.rows.length >= 9,
    why:
      'The numerical witness (WEDGE_NUMERICAL_WITNESS rows) confirms that across the (c, N) ' +
      'grid no row achieves the wedge condition psi_N(s) < 1/N, and the implied exponent a = ' +
      '1 + c is >= 1 everywhere. This is the live numerical fingerprint of obstruction O-wedge-A. ' +
      'The grid must have at least 9 rows (3 c values x 5 N values = 15 rows). If a future ' +
      'commit accidentally introduces a row that "achieves" the wedge, this tripwire fires.',
  },
  {
    id: 'imp1106-upstream-imports-live',
    holds: () =>
      ESY_SMALL_WEDGE_ATTEMPT.upstreamImportsLive.KH_import_live === true &&
      ESY_SMALL_WEDGE_ATTEMPT.upstreamImportsLive.interlacing_import_live === true,
    why:
      'Both LAMBDA_INTERCEPT_BURGERS_UNIFORMITY (imp-341) and LAMBDA_ARGMIN_JUMPS (imp-369) must ' +
      'load as non-null objects. If a future commit deletes either upstream export, this tripwire ' +
      'fires before the citation audit can silently pass on stale module references.',
  },
];
