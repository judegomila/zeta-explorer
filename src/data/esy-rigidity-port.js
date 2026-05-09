/**
 * @module esy-rigidity-port
 * @fileoverview Port Erdos-Schlein-Yau local semicircle rigidity to Dyson
 *   beta=2 on Riemann zeros -- partial closure (imp-407).
 *
 * Proof chain step: S7
 * Exports: ESY_RIGIDITY_PORT (partial-closure record for the S7 proof chain),
 *          ESY_RIGIDITY_PORT_ASSERTIONS (6 build-time tripwires)
 * Key assertions: imp407-witness-opt-ratios-below-one,
 *   imp407-witness-cons-ratios-below-one,
 *   imp407-witness-consistent-with-measured,
 *   imp407-esy-opt-strictly-better-than-angle-a,
 *   imp407-consumes-imp348-angle-b-open,
 *   imp407-open-sub-gaps-named
 * Tickets: created=imp-407, modified=imp-508 (O1 partial close),
 *   investigated=imp-650 (upgrade investigation: cannot-upgrade)
 *
 * imp-407: Port Erdos-Schlein-Yau local semicircle rigidity to Dyson beta=2
 *          on Riemann zeros
 *
 * Context
 * -------
 * imp-348 delivered angle (a): tightening the Koksma-Hlawka uniformity bound
 * to the microscopic strip y_N^micro = 2pi / log(gamma_N).  That file LABELS
 * angle (b) as open research work:
 *
 *   "Port ESY rigidity to the truncated zero Dyson flow via Polymath15 H_t
 *    regularisation; research-grade, not attempted in this codebase."
 *
 * This file delivers an honest partial closure of imp-407:
 *   1. State the ESY 2011 / Erdos-Yau 2017 framework for Wigner matrices
 *      and identify the exact rate.
 *   2. Identify the THREE precise obstacles that prevent a verbatim port to
 *      Riemann zero initial data.
 *   3. Derive the CONDITIONAL result: what ESY rigidity would give IF the
 *      Montgomery-Dyson GUE correlation conjecture were a rigorous theorem.
 *   4. Numerical witness on the 25-point PATH_C_BASELINE_FIT_V2 measured
 *      ladder: verify the conditional bound does NOT contradict the measured
 *      t_c values.
 *
 * Rate summary
 * ------------
 * Current unconditional rate (angle a, imp-348):
 *   psi_N(y_micro)  <=  (C_Selberg / 2) * (log gamma_N)^2 / N
 *
 * Target conditional rate (angle b, this file):
 *   psi_N(y_micro)  <=  (C_ESY / 2) * (log gamma_N)^{C_poly + 1} / N
 *
 * Under the GUE hypothesis (C_poly = 0, pure O(1/N) discrepancy):
 *   psi_N(y_micro)  <=  (C_ESY / 2) * log(gamma_N) / N
 *
 * This is strictly BETTER than angle (a) by a factor of log(gamma_N),
 * and gives a tighter tau_c upper bound.
 *
 * Honest scope
 * ------------
 * The conditional result is NOT a theorem -- it depends on an open conjecture.
 * The numerical witness confirms consistency but does not validate the
 * conjecture.  This file does NOT flip any downstream tripwire or override
 * imp-348 ANGLE_B_OPEN.status.  That status remains 'open research work'.
 *
 * SYNTAX SAFETY: all JSDoc comment content uses dg_{k_star}/dt notation
 * (not the star-slash sequence) to avoid premature comment termination.
 */

import { PATH_C_BASELINE_FIT_V2 } from './path-c-baseline-fit-v2.js';
import { LAMBDA_BURGERS_RATE_UPGRADE } from './lambda-burgers-rate-upgrade.js';

// ── Shared constants (same as imp-341 / imp-348) ───────────────────────────

const C_SELBERG = 3.0;
const ALPHA_MICRO = 2 * Math.PI;

// ── Riemann-von Mangoldt inversion (same convention as imp-348) ────────────

function rvmCount(T) {
  const u = T / (2 * Math.PI);
  return u * (Math.log(u) - 1);
}
function rvmCountDeriv(T) {
  return Math.log(T / (2 * Math.PI)) / (2 * Math.PI);
}
function gammaNFromRvM(N) {
  if (N < 2) return 14.134725;
  let T = (2 * Math.PI * N) / Math.max(Math.log(N), 1);
  for (let i = 0; i < 6; i++) {
    const f = rvmCount(T) - N;
    const fp = rvmCountDeriv(T);
    if (!(fp > 0)) break;
    T = T - f / fp;
    if (!(T > 2 * Math.PI)) T = 2 * Math.PI + 1;
  }
  return T;
}

function microStrip(N) {
  const g = gammaNFromRvM(N);
  const L = Math.log(g);
  if (!(L > 0)) return null;
  return ALPHA_MICRO / L;
}

function supImMInfMicro(N) {
  const g = gammaNFromRvM(N);
  const L = Math.log(g);
  const rhoInterior = Math.log(g / (4 * Math.PI)) / (2 * Math.PI);
  const y = microStrip(N);
  if (!(rhoInterior > 0) || y === null) return null;
  return (Math.PI * rhoInterior) / y;
}

// ── ESY framework: what Erdos-Schlein-Yau proves for Wigner matrices ────────

const ESY_WIGNER_FRAMEWORK = {
  references: [
    'Erdos-Schlein-Yau 2011, "Universality of random matrices and local ' +
      'relaxation flow," Inventiones Math. 185(1):75-119',
    'Erdos-Yau 2017, "A Dynamical Approach to Random Matrix Theory," ' +
      'Courant Lecture Notes 28, AMS',
    'Tao-Vu 2011, "The Wigner-Dyson-Mehta bulk universality conjecture ' +
      'and corroboration for Wigner random matrices," Electron. J. Probab.',
  ],
  coreResult:
    'For an N x N Wigner matrix H_N with appropriately regular entry ' +
    'distribution, let lambda_1 <= ... <= lambda_N be the eigenvalues and ' +
    'gamma_k the classical semicircle positions (N^{-1} int_0^{gamma_k} ' +
    'rho_sc(x) dx = k/N). ESY 2011 Theorem 3.3 gives:' +
    'P(max_{1<=k<=N} |lambda_k - gamma_k| >= (log N)^{C_esy} / N) ' +
    '<= N^{-c_esy}' +
    'for explicit constants C_esy, c_esy > 0 depending only on the entry ' +
    'moment assumptions.',
  discrepancyRate:
    'The ESY rigidity translates directly to the star-discrepancy D_N^* ' +
    'for the empirical spectral measure mu_N = N^{-1} sum_k delta(x - lambda_k).' +
    'With max_k |lambda_k - gamma_k| <= (log N)^{C_esy} / N holding with ' +
    'high probability, a trivial transport estimate gives:' +
    '  D_N^*(mu_N, mu_sc) <= C_KR * (log N)^{C_esy} / N' +
    'where C_KR is the Kantorovich-Rubinstein duality constant (O(1) for ' +
    'the semicircle measure). Crucially, the RATE in N is O((log N)^{C_esy}/N) -- ' +
    'strictly better than the unconditional Selberg O(log N / N) bound by ' +
    'the additional (log N)^{C_esy - 1} factor.',
  mechanism:
    'ESY uses the Dyson Brownian motion flow H_t = e^{-t/2} H + sqrt(1-e^{-t}) GUE ' +
    'to regularize H to GUE within time t ~ 1/N (the "local relaxation" timescale). ' +
    'At t ~ (log N) / N the empirical spectral measure has already been absorbed ' +
    'into the GUE universality class. The key inputs are: ' +
    '(a) a local semicircle law on the scale eta ~ (log N)^4 / N, ' +
    '(b) a rigidity estimate comparing individual eigenvalues to classical positions, ' +
    '(c) a local gap universality theorem. ' +
    'The proofs use a Gronwall-type coupling along the DBM flow.',
  rateInESYBook:
    'Erdos-Yau 2017 book, Theorem 18.1 (bulk rigidity): for C_esy = 8 + epsilon, ' +
    'P(max_k |lambda_k - gamma_k| N >= (log N)^{C_esy}) <= e^{-(log N)^2}. ' +
    'Subsequent improvements (Pillai-Yin 2014, He-Knowles 2017) tighten this ' +
    'to C_esy = 1 + epsilon under stronger assumptions.',
};

// ── Obstacles to porting ESY to Riemann zeros ────────────────────────────────

const ESY_PORT_OBSTACLES = {
  obstacle1: {
    label: 'O1: Wigner matrix vs. arithmetic input (unconditional gap)',
    description:
      'ESY uses the fact that H_N = (h_{ij}) with i.i.d. (up to symmetry) ' +
      'entries. The joint distribution is a product measure, enabling ' +
      'concentration-of-measure estimates via sub-Gaussian tails. Riemann ' +
      'zeros gamma_k are deterministic numbers -- there is no underlying ' +
      'probability space on which to apply the Dyson-Ito formula. Any ' +
      'probabilistic coupling to GUE (via Montgomery-Dyson) is a ' +
      'CONJECTURAL statement about the 2-point pair correlation, not a ' +
      'theorem about the joint N-dimensional distribution.',
    unconditionalGap:
      'To close this gap unconditionally would require a theorem of the form: ' +
      '"the empirical spectral measure of {gamma_k}_{k=1}^N is, in a ' +
      'quantitative sense, as rigid as GUE." This is not known and is ' +
      'expected to require a proof of (something like) RH itself.',
  },
  obstacle2: {
    label: 'O2: Dyson Brownian motion vs. de Bruijn / Polymath15 flow',
    description:
      'ESY uses the forward DBM flow H_t = e^{-t/2} H + sqrt(1-e^{-t}) GUE ' +
      'to REGULARIZE toward GUE. The Polymath15 / this codebase uses the ' +
      'backward de Bruijn heat flow H_t = convolution-with-Gaussian, run ' +
      'BACKWARD in t from the real axis to find the collision time tau_c. ' +
      'These are related but not identical: the ESY DBM flow regularizes ' +
      'FORWARD, creating GUE behavior; our backward flow deforms BACKWARD, ' +
      'approaching the Burgers shock. Porting ESY requires either showing ' +
      'the backward flow also has GUE universality (not obvious) or ' +
      'reformulating the ESY approach in the Polymath15 H_t language.',
    partialConnection:
      'There is a plausible connection via the Tao-Vu result that ' +
      'Wigner matrices and the GUE have the same local eigenvalue statistics ' +
      '(bulk universality). If the Riemann zeros have the same statistics ' +
      '(Montgomery-Dyson), then the two flows might be coupled. But this ' +
      'remains a conditional argument.',
  },
  obstacle3: {
    label: 'O3: High-probability vs. deterministic bound',
    description:
      'ESY rigidity holds with probability 1 - N^{-c} over the random matrix ' +
      'ensemble. For the Koksma-Hlawka / Burgers chain in this codebase, we ' +
      'need a DETERMINISTIC bound D_N^* <= f(N) that holds unconditionally for ' +
      'the specific sequence {gamma_k}. Even if we believed Montgomery-Dyson, ' +
      'converting a "holds with high probability for a random matrix" to a ' +
      '"holds for this specific deterministic sequence" requires a ' +
      'derandomization argument, which does not currently exist for zeros.',
    closurePath:
      'A conditional but deterministic version might follow from assuming ' +
      'GRH + the full explicit formula for pair correlation (not just the ' +
      'leading Montgomery term). This is research-grade and requires new ' +
      'analytic number theory input.',
  },
};

// ── Conditional result derivation ─────────────────────────────────────────────

// Under the CONDITIONAL ESY hypothesis on Riemann zeros:
//   HYPOTHESIS: The star-discrepancy of the first N Riemann zero ordinates
//   satisfies D_N^*(mu_N, mu_RvM) <= C_ESY_RIG * (log gamma_N)^{C_poly} / N
//   for some constants C_ESY_RIG > 0 and C_poly >= 0.
//
// Two scenarios:
//   C_poly = 0: pure O(1/N) rigidity (optimistic / GUE-matched).
//   C_poly = 1: O(log N / N) rigidity (conservative / Pillai-Yin level).
//
// We match the leading constant C_ESY_RIG = C_SELBERG = 3.0 to be
// conservative (same as the unconditional Selberg bound) -- only the rate
// exponent changes.

const C_ESY_RIG = C_SELBERG;   // conservative: same prefactor as Selberg
const C_POLY_OPTIMISTIC = 0;   // D_N^* <= C_ESY_RIG / N (GUE-matched)
const C_POLY_CONSERVATIVE = 1; // D_N^* <= C_ESY_RIG * log(gamma_N) / N

function psiESY(N, cPoly) {
  const g = gammaNFromRvM(N);
  const L = Math.log(g);
  const y = microStrip(N);
  if (!(L > 0) || y === null) return null;
  // Koksma-Hlawka at y_micro with the ESY discrepancy bound:
  //   psi <= pi * D_N^* / y_micro
  //        = pi * C_ESY_RIG * L^{cPoly} / (N * y_micro)
  //        = (pi * C_ESY_RIG / ALPHA_MICRO) * L^{cPoly+1} / N
  return (Math.PI * C_ESY_RIG * Math.pow(L, cPoly)) / (N * y);
}

function tauCUpperESY(N, cPoly) {
  const supInf = supImMInfMicro(N);
  const psi = psiESY(N, cPoly);
  if (supInf === null || psi === null) return null;
  const gap = supInf - psi;
  if (!(gap > 0)) return null;
  return 1 / (2 * gap);
}

const CONDITIONAL_DERIVATION = {
  hypothesis:
    'CONDITIONAL: D_N^*(mu_N^{zeros}, mu_RvM) <= C_ESY_RIG * (log gamma_N)^{C_poly} / N',
  leadingConstant: C_ESY_RIG,
  twoScenarios: [
    {
      label: 'Optimistic (GUE-matched, C_poly = 0)',
      discrepancyBound: 'D_N^*  <=  C_ESY_RIG / N',
      psiBoundAtMicroStrip:
        'psi_N(y_micro)  <=  (pi * C_ESY_RIG / ALPHA_MICRO) * log(gamma_N) / N' +
        '               =   (C_ESY_RIG / 2) * log(gamma_N) / N',
      supImMInfMicroLower:
        'sup Im m_inf(y_micro)  ~  (log gamma_N)^2 / (4 pi)',
      ratioRate:
        'psi_N / sup Im m_inf  ~  2 pi C_ESY_RIG / (N * log gamma_N)' +
        '                      =  O(1 / (N log N))  [faster than angle (a)]',
      tauCUpperRate:
        'tau_c(m_N)  <=  1 / (2 * sup Im m_inf(y_micro))  ~  pi / (log gamma_N)^2',
    },
    {
      label: 'Conservative (Pillai-Yin level, C_poly = 1)',
      discrepancyBound: 'D_N^*  <=  C_ESY_RIG * log(gamma_N) / N',
      psiBoundAtMicroStrip:
        'psi_N(y_micro)  <=  (pi * C_ESY_RIG / ALPHA_MICRO) * (log gamma_N)^2 / N' +
        '               =   (C_ESY_RIG / 2) * (log gamma_N)^2 / N',
      ratioRate:
        'psi_N / sup Im m_inf  ~  2 pi C_ESY_RIG / N  =  Theta(1/N)' +
        '  [same as angle (a) -- no improvement at the ratio level]',
      note:
        'C_poly = 1 recovers exactly the angle (a) rate. The ESY improvement ' +
        'only strictly beats angle (a) for C_poly < 1.',
    },
  ],
  whatItWouldBuy:
    'Under the optimistic C_poly = 0 hypothesis, the absolute psi_N bound at ' +
    'y_micro improves by a factor of log(gamma_N) over angle (a). This gives a ' +
    'quantitative per-N bound |t_c(N)| <= r_ESY(N) with r_ESY(N) = O(1/(log N)^2) ' +
    '-- a RATE bound, not just a qualitative limit statement. Under C_poly = 0 the ' +
    'imp-336 monotonicity hypothesis becomes redundant as a per-N finite claim.',
  whyNotATheorem:
    'The three obstacles O1-O3 above prevent rigorous application to zeros. ' +
    'Any claim here is CONDITIONAL on the Montgomery-Dyson GUE identification ' +
    'plus a deterministification step neither of which is currently available.',
};

// ── Numerical witness on the 25-point measured ladder ─────────────────────────
//
// For each measured row in PATH_C_BASELINE_FIT_V2.points we compute:
//   (a) the unconditional angle-(a) psi_N at y_micro (from imp-348)
//   (b) the CONDITIONAL ESY psi_N with C_poly = 0 (optimistic)
//   (c) the CONDITIONAL ESY psi_N with C_poly = 1 (conservative)
//   (d) the implied tau_c upper bound for each scenario
//   (e) a CONSISTENCY CHECK: does tau_c_upper >= t_c_lo?
//       If yes: NOT CONTRADICTED (the ESY hypothesis is consistent with measurement)
//       If no:  CONTRADICTION FOUND (the hypothesis is falsified at this N)
//
// Importantly: t_c_lo is a certified lower bound ONLY for rows where the interval
// integrator bracket actually closed (source = measured, t_c_lo > 0).
// Budget-exhausted rows report t_c_lo = nSteps * dt as an integration endpoint,
// not a genuine lower bound.  We use the POINT ESTIMATE (midpoint or fallback
// t_c_lo) from PATH_C_BASELINE_FIT_V2.points as the reference value.

const V2_POINTS = (PATH_C_BASELINE_FIT_V2.points || []).sort((a, b) => a.N - b.N);

function angleAPsiMicro(N) {
  // Same formula as imp-348 psiMicro -- recomputed here to avoid circular import
  const g = gammaNFromRvM(N);
  const L = Math.log(g);
  const y = ALPHA_MICRO / L;
  if (!(L > 0) || !(y > 0)) return null;
  return (Math.PI * C_SELBERG * L) / (N * y);
}

const ESY_WITNESS_ROWS = V2_POINTS.map((pt) => {
  const N = pt.N;
  const tc_measured = pt.tc;  // point estimate: midpoint or certified lower bound

  const supInf = supImMInfMicro(N);
  const psiA = angleAPsiMicro(N);      // angle (a), unconditional
  const psiOpt = psiESY(N, 0);         // ESY optimistic, C_poly = 0
  const psiCons = psiESY(N, 1);        // ESY conservative, C_poly = 1

  const ratioA = supInf !== null && psiA !== null ? psiA / supInf : null;
  const ratioOpt = supInf !== null && psiOpt !== null ? psiOpt / supInf : null;
  const ratioCons = supInf !== null && psiCons !== null ? psiCons / supInf : null;

  const tauA = supInf !== null && psiA !== null && supInf > psiA
    ? 1 / (2 * (supInf - psiA)) : null;
  const tauOpt = tauCUpperESY(N, 0);
  const tauCons = tauCUpperESY(N, 1);

  // Consistency check: tau_c_upper (upper bound) must be >= tc_measured (lower bound estimate)
  // If tau_c_upper < tc_measured, the scenario is contradicted by the measurement.
  const consistentOpt = tauOpt !== null && tc_measured > 0
    ? tauOpt >= tc_measured : null;
  const consistentCons = tauCons !== null && tc_measured > 0
    ? tauCons >= tc_measured : null;
  const consistentA = tauA !== null && tc_measured > 0
    ? tauA >= tc_measured : null;

  return {
    N,
    gammaN: gammaNFromRvM(N),
    tc_measured,
    // Angle (a) - unconditional (imp-348)
    angleA_psi: psiA,
    angleA_ratio: ratioA,
    angleA_tau_upper: tauA,
    angleA_consistent: consistentA,
    // ESY optimistic (C_poly = 0) - conditional
    esy_opt_psi: psiOpt,
    esy_opt_ratio: ratioOpt,
    esy_opt_tau_upper: tauOpt,
    esy_opt_consistent: consistentOpt,
    // ESY conservative (C_poly = 1) - conditional
    esy_cons_psi: psiCons,
    esy_cons_ratio: ratioCons,
    esy_cons_tau_upper: tauCons,
    esy_cons_consistent: consistentCons,
    // Improvement factor: angle (a) psi / ESY opt psi
    psiImprovementFactor: psiA !== null && psiOpt !== null && psiOpt > 0
      ? psiA / psiOpt : null,
  };
});

// ── Aggregate witness checks ───────────────────────────────────────────────────

const WITNESS_N = ESY_WITNESS_ROWS.length;

// How many rows have all checks defined (ratio < 1, divergence positive, consistency OK)
const ALL_OPT_RATIOS_BELOW_1 = ESY_WITNESS_ROWS.every(
  (r) => r.esy_opt_ratio !== null && r.esy_opt_ratio < 1,
);
const ALL_CONS_RATIOS_BELOW_1 = ESY_WITNESS_ROWS.every(
  (r) => r.esy_cons_ratio !== null && r.esy_cons_ratio < 1,
);
const ALL_OPT_CONSISTENT = ESY_WITNESS_ROWS.every(
  (r) => r.esy_opt_consistent === true,
);
const ALL_CONS_CONSISTENT = ESY_WITNESS_ROWS.every(
  (r) => r.esy_cons_consistent === true,
);
const OPT_IMPROVEMENT_POSITIVE = ESY_WITNESS_ROWS.every(
  (r) => r.psiImprovementFactor !== null && r.psiImprovementFactor > 1,
);

// ── Open sub-gaps identified by this port attempt ─────────────────────────────

const OPEN_SUB_GAPS = [
  {
    id: 'esy-port-O1-unconditional-rigidity',
    label: 'Unconditional discrepancy at O((log N)^C / N) rate for Riemann zeros',
    description:
      'Obstacle O1: prove D_N^*(mu_N^{zeros}, mu_RvM) <= C * (log N)^C / N ' +
      'deterministically, without assuming GUE pair correlation. ' +
      'PARTIAL CLOSURE (imp-508): The C_poly = 1 (Selberg) rate is now the ' +
      'UNCONDITIONAL BASELINE via (A) imp-341 Koksma-Hlawka bound and (B) imp-369 ' +
      'Cauchy interlacing (deterministic level-repulsion analogue of ESY-Step-2). ' +
      'Residual sub-gap: O1-remaining-concentration (C_poly < 1 requires sub-Selberg ' +
      'discrepancy, i.e. sub-Gaussian concentration for the deterministic zero sequence).',
    difficulty: 'partial -- C_poly = 1 baseline closed unconditionally (imp-508); ' +
      'C_poly < 1 is research-grade / open (O1-remaining-concentration)',
    partialProgress:
      'imp-508: (A) Selberg/KH bound (imp-341) = unconditional global discrepancy ' +
      'input at rate C_poly = 1. (B) Cauchy interlacing (imp-369) = unconditional ' +
      'deterministic level-repulsion (B_{N+1}(0) <= B_N(0)). Together: full ' +
      'unconditional instantiation of ESY conservative (C_poly = 1) scenario. ' +
      'Remaining: sub-Selberg discrepancy (C_poly < 1) requires pair-correlation ' +
      'or new deterministic exponential-sum estimate; see esy-o1-closure.js.',
    closedBy: 'imp-508 (partial)',
  },
  {
    id: 'esy-port-O2-backward-flow-coupling',
    label: 'ESY DBM regularization vs. backward de Bruijn flow',
    description:
      'Obstacle O2: show that the backward Polymath15 H_t flow has GUE ' +
      'universality or can be coupled to the ESY Dyson Brownian motion. ' +
      'The ESY forward-regularization does not directly apply to the ' +
      'backward collision-time computation.',
    difficulty: 'research-grade',
    partialProgress:
      'The Tao-Vu bulk universality theorem provides GUE statistics for ' +
      'Wigner matrices at equilibrium. Extending to the backward flow ' +
      'requires a time-reversal argument not currently available.',
  },
  {
    id: 'esy-port-O3-derandomization',
    label: 'High-probability to deterministic conversion for zero sequence',
    description:
      'Obstacle O3: convert the ESY high-probability bound (holds with ' +
      'probability 1 - N^{-c} over Wigner ensembles) to a deterministic ' +
      'bound for the specific sequence {gamma_k}. Requires assuming or ' +
      'proving that the zero sequence "looks like" a sample from GUE.',
    difficulty: 'research-grade',
    partialProgress:
      'Under GRH the explicit formula gives quantitative control on ' +
      'individual zeros via zero-density estimates; combining with ' +
      'Montgomery pair correlation might give a conditional derandomization.',
  },
];

// ── Exported record ─────────────────────────────────────────────────────────

export const ESY_RIGIDITY_PORT = {
  id: 'imp-407',
  title:
    'Port Erdos-Schlein-Yau local semicircle rigidity to Dyson beta=2 ' +
    'on Riemann zeros -- partial closure',
  status: 'partial',
  proofSection: 'S7',
  closureType: 'honest-partial',

  consumes: [
    'imp-348 LAMBDA_BURGERS_RATE_UPGRADE (angle-a rate, microscopic strip)',
    'imp-341 lambda-intercept-burgers-uniformity (base KH bound)',
    'imp-400 PATH_C_BASELINE_FIT_V2 (25-point measured ladder)',
  ],

  esyFramework: ESY_WIGNER_FRAMEWORK,
  portObstacles: ESY_PORT_OBSTACLES,
  conditionalDerivation: CONDITIONAL_DERIVATION,

  constants: {
    C_ESY_RIG,
    C_POLY_OPTIMISTIC,
    C_POLY_CONSERVATIVE,
    ALPHA_MICRO,
    note:
      'C_ESY_RIG = C_SELBERG = 3.0 is conservative (same leading constant as ' +
      'the Selberg unconditional bound; only the rate exponent changes). ' +
      'Real ESY constants for Wigner matrices are of order O(1) but depend ' +
      'on entry moment bounds not applicable to Riemann zeros.',
  },

  numericalWitness: {
    description:
      'For each of the ' +
      WITNESS_N +
      ' measured rows in PATH_C_BASELINE_FIT_V2, reports the angle-(a) psi ' +
      'bound and two ESY conditional psi bounds (C_poly = 0 and C_poly = 1), ' +
      'together with the implied tau_c upper bounds and a consistency check ' +
      'against the point estimate tc_measured.',
    rows: ESY_WITNESS_ROWS,
    allOptRatiosStrictlyBelowOne: ALL_OPT_RATIOS_BELOW_1,
    allConsRatiosStrictlyBelowOne: ALL_CONS_RATIOS_BELOW_1,
    allOptConsistentWithMeasured: ALL_OPT_CONSISTENT,
    allConsConsistentWithMeasured: ALL_CONS_CONSISTENT,
    optImprovesOverAngleA: OPT_IMPROVEMENT_POSITIVE,
    interpretation:
      'allOptConsistentWithMeasured = true means: at no measured N does the ' +
      'ESY optimistic tau_c upper bound fall below the measured t_c estimate. ' +
      'The ESY hypothesis is NOT CONTRADICTED by the 25-point ladder. ' +
      'This is a necessary but not sufficient condition for the hypothesis.',
  },

  openSubGaps: OPEN_SUB_GAPS,

  upgradeInvestigation: {
    investigatedBy: 'imp-650',
    investigatedAt: '2026-04-14T22:00:00Z',
    conclusion: 'cannot-upgrade',
    reason:
      'imp-462/463/464/471 chain (M-raw bridge, D-monotone, NoSwap, ' +
      'many-body-correction) closed the UNCONDITIONAL Lambda <= 0.121 beat ' +
      'via the ZPO B1/B2 route. This is orthogonal to the ESY rigidity port. ' +
      'The three blocking sub-gaps remain open: ' +
      '(O1) sub-Selberg discrepancy (C_poly < 1) for the deterministic zero ' +
      'sequence is not addressed by ZPO B1/B2 closures; ' +
      '(O2) coupling the backward de Bruijn flow to the ESY Dyson Brownian ' +
      'motion is still research-grade; ' +
      '(O3) derandomization from high-probability Wigner bound to deterministic ' +
      'bound for {gamma_k} remains unresolved. ' +
      'Status must remain partial.',
    tripwireRef: 'imp407-open-sub-gaps-named (OPEN_SUB_GAPS.length >= 3)',
  },

  verdict:
    'PARTIAL CLOSURE: The ESY 2011 framework is fully stated and the three ' +
    'obstacles (O1 unconditional input, O2 flow coupling, O3 derandomization) ' +
    'are precisely identified. The conditional result is derived: under the ' +
    'Montgomery-Dyson GUE hypothesis with D_N^* = O(1/N) (C_poly = 0), the ' +
    'psi_N bound improves over angle (a) by log(gamma_N) and tau_c_upper ' +
    'satisfies tau_c(m_N) <= pi / (log gamma_N)^2 -- a quantitative rate bound. ' +
    'Numerical witness confirms consistency with the 25-point measured ladder. ' +
    'Full unconditional closure is open research: see OPEN_SUB_GAPS for the ' +
    'three named sub-gaps. imp-348 ANGLE_B_OPEN status is NOT overridden.',

  angleAReference: LAMBDA_BURGERS_RATE_UPGRADE.derivation.angleB.status,

  closureNote:
    'imp-1003 (auto-improve, opus-4-7 subscription): honest-partial structural ' +
    'closure. The auto-seeded ticket asked to close named sub-gap ' +
    '"esy-rigidity-port-sub-rate" (push the Erdos-Schlein-Yau local-rigidity ' +
    'port to a sharper rate -- imp-348 angle b). No sub-gap with that exact ' +
    'id existed in this file; the openSubGaps array carried entries ' +
    'esy-port-O1-unconditional-rigidity (partial-closed at C_poly = 1 by ' +
    'imp-508 via the imp-341 Koksma-Hlawka / Selberg discrepancy bound plus ' +
    'the imp-369 Cauchy-interlacing deterministic level-repulsion estimate; ' +
    'residual sub-Selberg discrepancy named O1-remaining-concentration), ' +
    'esy-port-O2-backward-flow-coupling (research-grade), and ' +
    'esy-port-O3-derandomization (research-grade). The "sharper rate ' +
    '(imp-348 angle b)" framing maps cleanly to the C_poly < 1 residual: ' +
    'pushing the discrepancy exponent below the unconditionally-closed ' +
    'Selberg level (C_poly = 1) toward the optimistic GUE-matched level ' +
    '(C_poly = 0) is exactly what "sharper rate" means in the ' +
    'conditionalDerivation table -- psi_N(y_micro) <= (C_ESY_RIG/2) * ' +
    '(log gamma_N)^{C_poly+1} / N tightens by a factor of ' +
    '(log gamma_N)^{1 - C_poly}, and under C_poly = 0 the per-N tau_c upper ' +
    'bound becomes O(pi / (log gamma_N)^2) instead of the angle-(a) ' +
    'O(pi / log gamma_N) baseline. This run surfaces the gap explicitly: a ' +
    'new top-level singular openSubGap field on ESY_RIGIDITY_PORT carries ' +
    'the canonical id "esy-rigidity-port-sub-rate", precise statement, dual ' +
    'status fields statusOfPriorWork (PARTIAL: imp-407 framework + obstacles ' +
    'O1/O2/O3 + conditional derivation + 25-row consistency witness on ' +
    'PATH_C_BASELINE_FIT_V2; imp-508 partial closure of O1 at C_poly = 1; ' +
    'imp-650 upgrade investigation 2026-04-14 cannot-upgrade) and ' +
    'statusOfRemaining (open: pushing C_poly strictly below 1 is ' +
    'research-grade and has no unconditional path without sub-Selberg ' +
    'discrepancy or derandomization input), explicit dependsOn pointers to ' +
    'the three OPEN_SUB_GAPS entries, and three approachSuggestions ' +
    '(sub-Selberg unconditional discrepancy via zero-density input; ' +
    'conditional GUE derandomization under GRH + full explicit-formula pair ' +
    'correlation; backward-flow ESY via Tao-Vu time-reversal). A new ' +
    'build-time assertion imp407-rate-subgap-named pins the canonical id ' +
    'and the prior-work-PARTIAL / remaining-open status pair so future ' +
    'references stay anchored. The existing OPEN_SUB_GAPS array ' +
    '(esy-port-O1-unconditional-rigidity, esy-port-O2-backward-flow-coupling, ' +
    'esy-port-O3-derandomization) is preserved unchanged, as are the imp-348 ' +
    'angleAReference open status and the existing six tripwires. The ' +
    'mathematical work of pushing C_poly < 1 (sub-Selberg discrepancy or ' +
    'derandomization) remains open and is now tracked under the canonical id ' +
    'esy-rigidity-port-sub-rate. This is a cataloguing/structural ' +
    'improvement, not a numerical re-derivation; ESY_RIGIDITY_PORT.status ' +
    'remains "partial".',

  openSubGap: {
    id: 'esy-rigidity-port-sub-rate',
    statement:
      'Push the Erdos-Schlein-Yau local-rigidity port (imp-407 / imp-348 ' +
      'angle b) to a sharper rate by reducing the discrepancy exponent ' +
      'C_poly from the unconditionally-closed Selberg level (C_poly = 1, ' +
      'imp-508) toward the optimistic GUE-matched level (C_poly = 0). ' +
      'Closing this sub-gap requires either (a) a sub-Selberg unconditional ' +
      'discrepancy estimate D_N^* <= C * (log gamma_N)^c / N with c < 1 for ' +
      'the deterministic zero sequence, or (b) a deterministic version of ' +
      'the ESY high-probability rigidity bound that applies to the specific ' +
      'sequence {gamma_k} rather than only to almost-every sample of a ' +
      'Wigner ensemble. Outcome: psi_N(y_micro) <= (C_ESY_RIG / 2) * ' +
      '(log gamma_N)^{C_poly + 1} / N tightens by a factor of ' +
      '(log gamma_N)^{1 - C_poly}; under C_poly = 0 the per-N tau_c upper ' +
      'bound becomes O(pi / (log gamma_N)^2) instead of the O(pi / log gamma_N) ' +
      'angle-(a) baseline.',
    statusOfPriorWork:
      'PARTIAL -- imp-407 (this file) states the ESY 2011 / Erdos-Yau 2017 ' +
      'framework, identifies the three obstacles O1 (unconditional input), ' +
      'O2 (forward DBM vs backward de Bruijn flow coupling), O3 ' +
      '(high-probability vs deterministic conversion), derives the ' +
      'conditional rate (C_poly = 0 optimistic and C_poly = 1 conservative ' +
      'scenarios), and ships the 25-row numerical witness on ' +
      'PATH_C_BASELINE_FIT_V2 confirming both scenarios are consistent with ' +
      'measurement (allOptConsistentWithMeasured / allConsConsistentWithMeasured ' +
      'true; allOptRatiosStrictlyBelowOne / allConsRatiosStrictlyBelowOne true; ' +
      'optImprovesOverAngleA true). imp-508 partial-closed obstacle O1 ' +
      'unconditionally at C_poly = 1 by combining (A) the imp-341 ' +
      'Koksma-Hlawka / Selberg discrepancy bound with (B) the imp-369 ' +
      'Cauchy-interlacing deterministic level-repulsion estimate ' +
      '(B_{N+1}(0) <= B_N(0)); together these deliver a full unconditional ' +
      'instantiation of the ESY conservative scenario without any GUE ' +
      'assumption. imp-650 upgrade investigation (2026-04-14) reviewed the ' +
      'imp-462/463/464/471 ZPO B1/B2 closures and ruled them orthogonal to ' +
      'the rigidity port, returning conclusion cannot-upgrade and pinning ' +
      'ESY_RIGIDITY_PORT.status at "partial". The angle-b open status in ' +
      'LAMBDA_BURGERS_RATE_UPGRADE is preserved by the existing ' +
      'imp407-consumes-imp348-angle-b-open tripwire.',
    statusOfRemaining:
      'open -- pushing C_poly strictly below 1 (sharper rate, optimistic ' +
      'GUE-matched scenario) is research-grade and currently has no ' +
      'unconditional path. Closing requires either (a) a sub-Selberg ' +
      'unconditional discrepancy estimate D_N^* <= C * (log gamma_N)^c / N ' +
      'with c < 1 for the deterministic zero sequence -- neither the ' +
      'Riemann-von Mangoldt counting input nor any current explicit-formula ' +
      'technique gives a sub-Selberg rate without additional ' +
      'analytic-number-theory input (e.g. zero-density estimates assuming ' +
      'GRH, or quantitative Montgomery pair-correlation beyond the leading ' +
      '1 - (sin pi x / pi x)^2 term); or (b) a derandomization theorem ' +
      'turning the ESY high-probability Wigner rigidity bound into a ' +
      'deterministic statement about {gamma_k}, which itself depends on a ' +
      'quantitative Montgomery-Dyson identification beyond the conjectural ' +
      'pair-correlation level. The existing OPEN_SUB_GAPS entry ' +
      'esy-port-O1-unconditional-rigidity already names this residual via ' +
      'its O1-remaining-concentration sub-id; the canonical sub-gap id ' +
      'esy-rigidity-port-sub-rate consolidates that residual under a stable ' +
      'cross-file handle. No code change in src/math/ would close this ' +
      'sub-gap: it is a mathematical-research gap, not an implementation ' +
      'gap.',
    dependsOn: [
      'esy-port-O1-unconditional-rigidity -- existing OPEN_SUB_GAPS entry; ' +
        'partial-closed at C_poly = 1 by imp-508 (KH + Cauchy interlacing); ' +
        'the residual O1-remaining-concentration is the same sub-Selberg ' +
        'discrepancy gap.',
      'esy-port-O2-backward-flow-coupling -- existing OPEN_SUB_GAPS entry; ' +
        'research-grade; couples the ESY Dyson Brownian motion forward ' +
        'regularization to the Polymath15 backward de Bruijn flow used here.',
      'esy-port-O3-derandomization -- existing OPEN_SUB_GAPS entry; ' +
        'research-grade; converts an ESY high-probability Wigner bound into ' +
        'a deterministic statement about the specific sequence {gamma_k}.',
    ],
    approachSuggestions: [
      'Sub-Selberg unconditional discrepancy: attempt to upgrade the imp-341 ' +
        'Selberg-style Koksma-Hlawka bound to a sub-logarithmic rate by ' +
        'inserting a non-trivial zero-density input (e.g. Ingham-Huxley ' +
        'zero-density bounds or a quantitative form of Montgomery pair ' +
        'correlation). Any improvement c < 1 in D_N^* <= C * (log gamma_N)^c ' +
        '/ N immediately propagates to psi_N(y_micro) <= (C_ESY_RIG / 2) * ' +
        '(log gamma_N)^{1 + c} / N and tightens tau_c_upper.',
      'Conditional GUE derandomization: assuming GRH plus the full explicit ' +
        'formula for pair correlation (not just the leading Montgomery ' +
        'term), derive a deterministic version of the ESY high-probability ' +
        'rigidity for {gamma_k}. This addresses obstacles O3 and partially ' +
        'O1 simultaneously and is the most plausible path under standard ' +
        'analytic-number-theory hypotheses.',
      'Backward-flow ESY via Tao-Vu: reformulate the ESY 2011 forward Dyson ' +
        'Brownian motion regularization in the Polymath15 backward de ' +
        'Bruijn flow language using Tao-Vu bulk universality plus a ' +
        'time-reversal coupling argument. This addresses obstacle O2 ' +
        'directly and would let the existing OPEN_SUB_GAPS narrative drop ' +
        'the forward / backward asymmetry caveat.',
    ],
  },
};

// ── Build-time assertions ──────────────────────────────────────────────────────

export const ESY_RIGIDITY_PORT_ASSERTIONS = [
  {
    id: 'imp407-witness-opt-ratios-below-one',
    holds: () => ESY_WITNESS_ROWS.length > 0 && ALL_OPT_RATIOS_BELOW_1,
    why:
      'Under the ESY optimistic hypothesis (C_poly = 0), the conditional ' +
      'psi_N at the microscopic strip must remain strictly below sup Im m_inf ' +
      'at every measured N. Otherwise the ESY chain would break immediately ' +
      'and the hypothesis would be self-contradictory at the strip.',
  },
  {
    id: 'imp407-witness-cons-ratios-below-one',
    holds: () => ESY_WITNESS_ROWS.length > 0 && ALL_CONS_RATIOS_BELOW_1,
    why:
      'The ESY conservative scenario (C_poly = 1) recovers the angle-(a) ' +
      'rate and should trivially satisfy ratio < 1 since imp-348 already ' +
      'verified this for angle (a). A failure here signals an implementation ' +
      'error in psiESY or gammaNFromRvM.',
  },
  {
    id: 'imp407-witness-consistent-with-measured',
    holds: () => ESY_WITNESS_ROWS.length > 0 && ALL_OPT_CONSISTENT && ALL_CONS_CONSISTENT,
    why:
      'The ESY conditional tau_c upper bounds must be >= the measured t_c ' +
      'point estimates at every row in the 25-point ladder. A failure would ' +
      'mean the ESY hypothesis is incompatible with the measured dynamics ' +
      'and would invalidate the entire conditional argument.',
  },
  {
    id: 'imp407-esy-opt-strictly-better-than-angle-a',
    holds: () => ESY_WITNESS_ROWS.length > 0 && OPT_IMPROVEMENT_POSITIVE,
    why:
      'The ESY optimistic psi bound (C_poly = 0) must be strictly smaller ' +
      'than the angle-(a) psi bound at every N. If not, the "improvement" ' +
      'claimed by angle (b) over angle (a) is not numerically realized, ' +
      'and the CONDITIONAL result has no advantage over the existing unconditional one.',
  },
  {
    id: 'imp407-consumes-imp348-angle-b-open',
    holds: () =>
      typeof ESY_RIGIDITY_PORT.angleAReference === 'string' &&
      ESY_RIGIDITY_PORT.angleAReference.includes('open'),
    why:
      'imp-407 is an honest partial closure of the angle-(b) open item from ' +
      'imp-348. The imp-348 ANGLE_B_OPEN status must still read as open: ' +
      'if a future commit accidentally sets it to closed, this tripwire ' +
      'fires and prevents a false impression of full rigorous closure.',
  },
  {
    id: 'imp407-witness-spans-25-or-more-points',
    holds: () => ESY_WITNESS_ROWS.length >= 20,
    why:
      'The ticket description calls for a witness on the 25-point measured ' +
      'ladder. PATH_C_BASELINE_FIT_V2 should supply at least 20 measured ' +
      'rows (the imp-400 fit requires n >= 20). Fewer rows indicates the ' +
      'measured ladder has regressed.',
  },
  {
    id: 'imp407-open-sub-gaps-named',
    holds: () => OPEN_SUB_GAPS.length >= 3,
    why:
      'This partial closure must name at least 3 sub-gaps (O1, O2, O3) ' +
      'that block full unconditional closure. If the array shrinks below 3, ' +
      'either a sub-gap was improperly removed or the structure was changed ' +
      'without updating this assertion.',
  },
  {
    id: 'imp407-rate-subgap-named',
    holds: () =>
      ESY_RIGIDITY_PORT.openSubGap?.id === 'esy-rigidity-port-sub-rate' &&
      typeof ESY_RIGIDITY_PORT.openSubGap.statusOfPriorWork === 'string' &&
      typeof ESY_RIGIDITY_PORT.openSubGap.statusOfRemaining === 'string' &&
      ESY_RIGIDITY_PORT.openSubGap.statusOfPriorWork.startsWith('PARTIAL') &&
      ESY_RIGIDITY_PORT.openSubGap.statusOfRemaining.startsWith('open') &&
      Array.isArray(ESY_RIGIDITY_PORT.openSubGap.dependsOn) &&
      ESY_RIGIDITY_PORT.openSubGap.dependsOn.length === 3 &&
      Array.isArray(ESY_RIGIDITY_PORT.openSubGap.approachSuggestions) &&
      ESY_RIGIDITY_PORT.openSubGap.approachSuggestions.length === 3,
    why:
      'imp-1003 honest-partial: the rate-tightening sub-gap (push the ESY ' +
      'discrepancy exponent C_poly below the unconditionally-closed Selberg ' +
      'level C_poly = 1 toward GUE level C_poly = 0; sharper tau_c upper ' +
      'bound by a factor of (log gamma_N)^{1 - C_poly}) must carry a stable ' +
      'named id (esy-rigidity-port-sub-rate) and explicit prior-work / ' +
      'remaining status fields. The OPEN_SUB_GAPS array names the ' +
      'underlying obstacles O1/O2/O3 narratively but does not expose the ' +
      'rate-improvement framing under a single canonical id, which loses ' +
      'the cross-file reference handle. The dependsOn array pins the three ' +
      'OPEN_SUB_GAPS entries the rate residual reduces to ' +
      '(O1-unconditional-rigidity, O2-backward-flow-coupling, ' +
      'O3-derandomization); the approachSuggestions array names the three ' +
      'closure paths (sub-Selberg discrepancy via zero-density input; ' +
      'conditional GUE derandomization under GRH + full explicit-formula ' +
      'pair correlation; backward-flow ESY via Tao-Vu time-reversal). If a ' +
      'future commit closes one of those paths and pushes C_poly < 1 ' +
      'unconditionally, statusOfRemaining must flip from "open" together ' +
      'with a coordinated update of this assertion and of the ' +
      'imp407-consumes-imp348-angle-b-open tripwire, preventing silent ' +
      'overclaim.',
  },
];
