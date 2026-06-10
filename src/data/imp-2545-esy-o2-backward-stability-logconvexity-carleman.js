// @module imp-2545-esy-o2-backward-stability-logconvexity-carleman
// imp-2545 (improvement for ticket imp-370, critical, proof): the CONSTRUCTIVE
// backward-stability estimate for obstacle O2. imp-2492 pinned O2 qualitatively
// (the backward de Bruijn-Newman heat flow amplifies wavenumber-k data by
// exp(+t k^2), the ill-posed backward heat equation). imp-2498 catalogued the
// available backward-control theory with ORDINAL strength handles (uniqueness =
// 0, conditional-log = 1, power-law = 2) but never wrote the actual estimate.
// This module does the constructive job imp-2545 asks for: it STATES the
// conditional backward-stability lemma with EXPLICIT constants, identifies
// EXACTLY which frequency cutoff makes the Carleman weight close, witnesses both
// numerically, and pins the precise residual obstruction. No false QED: O2 stays
// research-grade open, consistent with imp-2492 / imp-2498.
//
// WHAT IS GENUINELY PROVED HERE (the strongest honest version)
// ------------------------------------------------------------
// For the linearized flow u_t = A u with A self-adjoint (here A = Laplacian, the
// heat generator), the energy E(t) = ||u(t)||^2 is LOGARITHMICALLY CONVEX in t.
// This is a real, unconditional theorem (Agmon-Nirenberg 1967; Payne 1975) and
// it is the entire engine of backward control. Two estimates fall out of it,
// both with explicit constants:
//
//   LEMMA A (log-convexity / three-lines Hoelder bound, NO frequency cutoff).
//     E(t) = ||u(t)||^2 satisfies  E E'' - (E')^2 >= 0  (Cauchy-Schwarz on the
//     self-adjoint generator), so log E is convex. Hadamard three-lines on
//     [0, T] gives, for every t in [0, T],
//         ||u(t)|| <= ||u(0)||^{1 - t/T} * ||u(T)||^{t/T}.
//     Conditional stability: if the observed data is small, ||u(0)|| <= eps, and
//     an a priori bound ||u(T)|| <= M is supplied, then
//         ||u(t)|| <= eps^{theta(t)} * M^{1 - theta(t)},  theta(t) = 1 - t/T.
//     This IS a stability estimate -- but the Hoelder exponent theta(t) on the
//     small observed quantity DEGENERATES to 0 as t -> T, i.e. there is NO rate
//     at the reconstruction endpoint. (Residual obstruction O2a.)
//
//   LEMMA B (band-limited Carleman / frequency-cutoff stability, EXPLICIT const).
//     Restrict to the frequency band |k| <= K. On the band the backward flow is
//     genuinely stable, with the explicit constant
//         ||P_{<=K} u(t)|| <= exp(+ t K^2) * ||P_{<=K} u(0)||,  t in [0, T],
//     worst case exp(+ T K^2). The cutoff that CLOSES the weight against the ESY
//     rigidity scale is exactly K = k_{max} ~ log(gamma_N) / (2 pi), the inverse
//     mean spacing the rigidity bound controls. At that cutoff the constant is
//         C_N = exp(+ T k_{max}^2) = exp( T (log gamma_N)^2 / (4 pi^2) ),
//     which DIVERGES with N. So band-limited stability is a real theorem, but its
//     constant is NOT uniform in N. (Residual obstruction O2b.)
//
// WHY THIS IS AN HONEST PARTIAL, NOT A CLOSURE
// --------------------------------------------
// O2 needs to transfer the forward ESY rigidity (a power-law, ~1/N fluctuation
// bound at k_{max}) onto the backward flow UNCONDITIONALLY and uniformly in N.
// Lemma A is unconditional but its exponent vanishes at the endpoint of interest
// (O2a); Lemma B is uniform-in-frequency-on-the-band but its constant explodes
// with N exactly at the rigidity cutoff (O2b). These are the SAME two shortfalls
// imp-2498 named ordinally (endpoint-degeneration = the logarithmic-modulus
// shortfall; N-divergent constant = the conditionality shortfall), now upgraded
// to explicit closed-form constants. Neither lemma, nor their combination,
// delivers the unconditional uniform-in-N power-law transfer O2 requires.
//
// SYNTAX SAFETY: no star-slash sequences in comments; single-quoted strings carry
// no apostrophes; subscripts written k_{max} in prose.
//
// @see imp-370   -- the ticket (close imp-348 angle (b) via local-law rigidity)
// @see imp-407   -- esy-rigidity-port.js (obstacle2; approachSuggestions)
// @see imp-2492  -- O2 backward-flow ill-posedness audit (qualitative obstruction)
// @see imp-2498  -- O2 backward-stability availability audit (ordinal strengths)

// =========================================================================
// SECTION (a) -- Log-convexity engine, witnessed on a concrete spectral sum.
// =========================================================================
//
// A solution of u_t = A u with A self-adjoint, diagonalized in the eigenbasis
// {phi_k} with A phi_k = -lambda_k phi_k (heat: lambda_k = k^2 >= 0), is
//     u(t) = sum_k a_k exp(-lambda_k t) phi_k,
// so the energy is a positive combination of decaying exponentials
//     E(t) = ||u(t)||^2 = sum_k a_k^2 exp(-2 lambda_k t).
// A finite positive sum of exponentials exp(c_k t) is log-convex in t (the
// standard moment / Cauchy-Schwarz inequality), which is the spectral shadow of
// the abstract Agmon-Nirenberg identity E E'' - (E')^2 >= 0. We witness this on
// the three-mode example a_k = 1, lambda_k = k^2, k in {1, 2, 3}, T = 1.

const T_FLOW = 1.0; // dimensionless flow-time window [0, T].
const MODES = Object.freeze([
  { k: 1, a2: 1, lambda: 1 },  // lambda_k = k^2
  { k: 2, a2: 1, lambda: 4 },
  { k: 3, a2: 1, lambda: 9 },
]);

function energyE(t) {
  // E(t) = sum a_k^2 exp(-2 lambda_k t): the squared L2 norm of the solution.
  let s = 0;
  for (const m of MODES) s += m.a2 * Math.exp(-2 * m.lambda * t);
  return s;
}

function logE(t) {
  return Math.log(energyE(t));
}

// Discrete second derivative of log E on a grid: must be >= 0 (convexity).
function minSecondDifferenceLogE(nGrid) {
  const h = T_FLOW / nGrid;
  let worst = Infinity;
  for (let i = 1; i < nGrid; i++) {
    const t = i * h;
    const d2 = (logE(t + h) - 2 * logE(t) + logE(t - h)) / (h * h);
    if (d2 < worst) worst = d2;
  }
  return worst; // >= 0 (up to rounding) iff log E is convex on the grid.
}

// =========================================================================
// SECTION (b) -- LEMMA A: the three-lines Hoelder conditional-stability bound.
// =========================================================================
//
// Convexity of log E on [0, T] gives the Hadamard three-lines inequality
//     log E(t) <= (1 - t/T) log E(0) + (t/T) log E(T),
// i.e.  ||u(t)|| <= ||u(0)||^{1 - t/T} ||u(T)||^{t/T}. We expose both the bound
// itself (so an assertion can confirm E(t) never exceeds the interpolant) and
// the conditional-stability Hoelder exponent theta(t) = 1 - t/T on the small
// observed quantity, whose endpoint degeneration is residual obstruction O2a.

function threeLinesUpperBound(t) {
  // ||u(t)||^2 <= E(0)^{1-t/T} E(T)^{t/T}: the log-linear interpolant of E.
  const s = t / T_FLOW;
  return Math.pow(energyE(0), 1 - s) * Math.pow(energyE(T_FLOW), s);
}

function hoelderExponentTheta(t) {
  // Weight on the SMALL observed quantity ||u(0)|| <= eps in
  //   ||u(t)|| <= eps^{theta} M^{1-theta}.  theta(0) = 1 (full stability at the
  //   observation), theta(T) = 0 (NO rate at the reconstruction endpoint).
  return 1 - t / T_FLOW;
}

// Maximum gap E(t) - bound(t) over an interior grid; must be <= 0 (bound holds).
function maxThreeLinesViolation(nGrid) {
  const h = T_FLOW / nGrid;
  let worst = -Infinity;
  for (let i = 0; i <= nGrid; i++) {
    const t = i * h;
    const gap = energyE(t) - threeLinesUpperBound(t);
    if (gap > worst) worst = gap;
  }
  return worst; // <= 0 (up to rounding) iff the three-lines bound holds.
}

const LEMMA_A = Object.freeze({
  name: 'Log-convexity three-lines conditional backward-stability (Agmon-Nirenberg / Payne)',
  estimate: '||u(t)|| <= ||u(0)||^{1 - t/T} * ||u(T)||^{t/T}',
  conditionalForm: '||u(t)|| <= eps^{theta(t)} * M^{1 - theta(t)},  theta(t) = 1 - t/T',
  unconditional: true,          // the inequality itself needs no a priori bound
  hoelderExponentAtObservation: hoelderExponentTheta(0),     // = 1 (full rate)
  hoelderExponentAtEndpoint: hoelderExponentTheta(T_FLOW),   // = 0 (NO rate)
  residualObstruction: 'O2a',
  obstructionText:
    'The Hoelder exponent theta(t) = 1 - t/T on the small observed data ' +
    'degenerates to 0 as t -> T. The de Bruijn collision time is exactly this ' +
    'reconstruction endpoint, so the bound supplies NO quantitative rate there.',
});

// =========================================================================
// SECTION (c) -- LEMMA B: band-limited Carleman constant and the closing cutoff.
// =========================================================================
//
// Projecting onto |k| <= K, every mode is amplified by at most exp(+ t K^2)
// (heat eigenvalue lambda_k = k^2 <= K^2 on the band), so the backward flow is
// stable on the band with the explicit constant exp(+ T K^2). The cutoff that
// closes the Carleman weight against the ESY rigidity scale is K = k_{max}, the
// inverse mean spacing ~ log(gamma_N) / (2 pi). We evaluate the resulting
// constant C_N = exp(T k_{max}^2) at illustrative N and exhibit its divergence.

function carlemanBandConstant(K) {
  // Worst-case band-limited backward amplification over [0, T] at cutoff K.
  return Math.exp(T_FLOW * K * K);
}

function kMaxFromHeight(gammaN) {
  // Microscopic inverse mean spacing of the zeta zeros near height gamma_N:
  //   k_{max} ~ rho_N ~ log(gamma_N) / (2 pi).
  return Math.log(gammaN) / (2 * Math.PI);
}

// Illustrative heights gamma_N (NOT physical magnitudes): used only to exhibit
// that C_N is strictly increasing and unbounded as N (hence gamma_N) grows.
const ILLUSTRATIVE_HEIGHTS = Object.freeze([1e3, 1e6, 1e12, 1e24]);

const CARLEMAN_CONSTANTS = Object.freeze(
  ILLUSTRATIVE_HEIGHTS.map((g) => {
    const K = kMaxFromHeight(g);
    return Object.freeze({ gammaN: g, kMax: K, constant: carlemanBandConstant(K) });
  })
);

const LEMMA_B = Object.freeze({
  name: 'Band-limited Carleman backward-stability with explicit constant',
  estimate: '||P_{<=K} u(t)|| <= exp(+ t K^2) ||P_{<=K} u(0)||,  worst case exp(+ T K^2)',
  closingCutoff: 'K = k_{max} ~ log(gamma_N) / (2 pi)  (the inverse mean spacing)',
  constantClosedForm: 'C_N = exp( T (log gamma_N)^2 / (4 pi^2) )',
  uniformInFrequencyOnBand: true, // stable on the band for any fixed K
  uniformInN: false,              // C_N -> infinity with N
  residualObstruction: 'O2b',
  obstructionText:
    'The band-limited constant exp(+ T k_{max}^2) closes the weight at the ' +
    'rigidity cutoff K = k_{max}, but C_N = exp(T (log gamma_N)^2 / (4 pi^2)) ' +
    'DIVERGES with N. So the transfer constant is not uniform in N and cannot ' +
    'preserve a power-law psi_N ~ 1/N fluctuation bound at the microscopic scale.',
});

// =========================================================================
// SECTION (d) -- Named residual sub-gap (honest, anchored to the O2 entry).
// =========================================================================

const NAMED_SUBGAP = Object.freeze({
  id: 'imp-2545-sub-backward-stability-endpoint-and-N-divergence',
  anchors: 'esy-port-O2-backward-flow-coupling',
  refines: 'imp-2498-sub-O2-backward-stability-conditional-log-weak',
  difficulty: 'research-grade',
  statement:
    'The strongest honest backward-stability estimates are now explicit. Lemma A ' +
    '(log-convexity three-lines) is unconditional but its Hoelder exponent ' +
    'theta(t) = 1 - t/T vanishes at the collision-time endpoint (O2a). Lemma B ' +
    '(band-limited Carleman) is uniform on |k| <= K but its constant ' +
    'exp(T k_{max}^2) = exp(T (log gamma_N)^2 / (4 pi^2)) diverges with N at the ' +
    'rigidity cutoff K = k_{max} (O2b). Closing O2 needs an UNCONDITIONAL, ' +
    'uniform-in-N, power-law-strength transfer at k_{max}, which neither lemma ' +
    'supplies and which is not established for the de Bruijn-Newman zeta flow.',
  closesIfResolved:
    'A backward-stability estimate whose rate survives to the endpoint AND whose ' +
    'constant is uniform in N at K = k_{max} (e.g. an established Tao-Vu ' +
    'time-reversal coupling). Open.',
});

const VERDICT = 'o2-backward-stability-explicit-but-endpoint-degenerate-and-N-divergent';

// =========================================================================
// FROZEN EXPORTED RECORD
// =========================================================================

export const IMP2545_ESY_O2_BACKWARD_STABILITY_LOGCONVEXITY_CARLEMAN = Object.freeze({
  id: 'imp-2545',
  ticket: 'imp-370',
  obstacle: 'O2',
  axis: 'pde (backward-flow well-posedness) -- constructive estimate with explicit constants',
  refines: 'imp-2498 (upgrades its ordinal strength handles to explicit closed-form constants)',
  flowTimeWindow: T_FLOW,
  modes: MODES,
  lemmaA: LEMMA_A,
  lemmaB: LEMMA_B,
  carlemanConstants: CARLEMAN_CONSTANTS,
  namedSubGap: NAMED_SUBGAP,
  verdict: VERDICT,
  closesO2: false,
  closesTicket: false,
  // Convenience scalars for downstream readers / assertions.
  logConvexityHolds: true,
  threeLinesBoundHolds: true,
  endpointExponentVanishes: hoelderExponentTheta(T_FLOW) === 0,
  carlemanConstantDivergesInN:
    CARLEMAN_CONSTANTS[CARLEMAN_CONSTANTS.length - 1].constant > CARLEMAN_CONSTANTS[0].constant,
  honestScope: Object.freeze([
    'This module does NOT close obstacle O2 or imp-370 angle (b). It delivers the ' +
    'strongest honest CONSTRUCTIVE backward-stability content: two explicit ' +
    'conditional-stability lemmas (log-convexity three-lines; band-limited ' +
    'Carleman) with closed-form constants and the exact closing cutoff K = ' +
    'k_{max}, plus the two precise residual obstructions (O2a endpoint exponent ' +
    'vanishes; O2b constant diverges in N).',
    'The defensible core is unconditional: log-convexity of E(t) = ||u(t)||^2 is ' +
    'the Agmon-Nirenberg identity E E′′ - (E′)^2 >= 0, witnessed here as a ' +
    'positive sum of exponentials being log-convex; the three-lines bound and the ' +
    'band constant exp(T K^2) follow by elementary interpolation and spectral ' +
    'projection. What is NOT proved is the O2 requirement an unconditional, ' +
    'uniform-in-N, power-law transfer at k_{max}; both lemmas fall short in the ' +
    'two named ways.',
    'This refines imp-2498: its modulusStrength=1 logarithmic shortfall is the ' +
    'O2a endpoint degeneration, and its conditionality / circular a-priori-bound ' +
    'shortfall is the O2b N-divergent constant. The ordinal handles are now ' +
    'explicit functions of t and gamma_N. O2 and imp-370 angle (b) stay ' +
    'research-grade open; the route remains conditional.',
  ]),
  parallelTickets: Object.freeze(['imp-370', 'imp-407', 'imp-2491', 'imp-2492', 'imp-2498']),
});

export default IMP2545_ESY_O2_BACKWARD_STABILITY_LOGCONVEXITY_CARLEMAN;

// =========================================================================
// BUILD-TIME TRIPWIRES
// =========================================================================

export const IMP2545_ESY_O2_BACKWARD_STABILITY_LOGCONVEXITY_CARLEMAN_ASSERTIONS = [
  {
    id: 'imp2545-log-convexity-holds-on-grid',
    holds: () => {
      // log E(t) must be convex: discrete second derivative >= 0 everywhere.
      // Small negative rounding tolerance only.
      return minSecondDifferenceLogE(64) > -1e-9;
    },
    why:
      'Log-convexity of E(t) = ||u(t)||^2 is the entire engine of backward ' +
      'control (Agmon-Nirenberg E E-doubleprime - (E-prime)^2 >= 0). If the ' +
      'witnessed energy stopped being log-convex, both Lemma A and the structural ' +
      'basis of the backward-stability story would be broken.',
  },
  {
    id: 'imp2545-three-lines-bound-holds',
    holds: () => {
      // E(t) must never exceed its log-linear interpolant E(0)^{1-s} E(T)^{s}.
      return maxThreeLinesViolation(64) < 1e-9 &&
        IMP2545_ESY_O2_BACKWARD_STABILITY_LOGCONVEXITY_CARLEMAN.threeLinesBoundHolds === true;
    },
    why:
      'Lemma A is exactly the three-lines bound ||u(t)|| <= ||u(0)||^{1-t/T} ' +
      '||u(T)||^{t/T}. A positive violation on the grid would mean the explicit ' +
      'conditional-stability estimate this module ships does not actually hold.',
  },
  {
    id: 'imp2545-endpoint-exponent-vanishes-O2a',
    holds: () => {
      const a = IMP2545_ESY_O2_BACKWARD_STABILITY_LOGCONVEXITY_CARLEMAN.lemmaA;
      // theta(0) = 1 (full rate at observation), theta(T) = 0 (no rate at endpoint).
      return Math.abs(a.hoelderExponentAtObservation - 1) < 1e-12 &&
        Math.abs(a.hoelderExponentAtEndpoint - 0) < 1e-12 &&
        a.residualObstruction === 'O2a';
    },
    why:
      'Residual obstruction O2a: the Hoelder exponent theta(t) = 1 - t/T on the ' +
      'small observed quantity vanishes at the reconstruction endpoint t = T (the ' +
      'collision time). If the endpoint exponent were nonzero the module would ' +
      'falsely claim a usable rate exactly where O2 needs one and none exists.',
  },
  {
    id: 'imp2545-carleman-constant-explicit-and-closing-cutoff',
    holds: () => {
      // The band constant must be exp(T K^2) with K = k_{max} = log(gamma)/(2 pi).
      const rows = IMP2545_ESY_O2_BACKWARD_STABILITY_LOGCONVEXITY_CARLEMAN.carlemanConstants;
      return rows.every((r) => {
        const kExpected = Math.log(r.gammaN) / (2 * Math.PI);
        const cExpected = Math.exp(T_FLOW * kExpected * kExpected);
        return Math.abs(r.kMax - kExpected) < 1e-12 && Math.abs(r.constant - cExpected) < 1e-6 * cExpected;
      });
    },
    why:
      'Lemma B closes the Carleman weight at the cutoff K = k_{max} ~ ' +
      'log(gamma_N)/(2 pi) with explicit constant exp(T k_{max}^2). If the cutoff ' +
      'or the closed-form constant drifted, the explicit band-limited stability ' +
      'estimate would no longer match what the module claims.',
  },
  {
    id: 'imp2545-carleman-constant-diverges-in-N-O2b',
    holds: () => {
      const rows = IMP2545_ESY_O2_BACKWARD_STABILITY_LOGCONVEXITY_CARLEMAN.carlemanConstants;
      // Constant must be strictly increasing in gamma_N (hence unbounded in N).
      for (let i = 1; i < rows.length; i++) {
        if (!(rows[i].constant > rows[i - 1].constant)) return false;
      }
      return IMP2545_ESY_O2_BACKWARD_STABILITY_LOGCONVEXITY_CARLEMAN.carlemanConstantDivergesInN === true;
    },
    why:
      'Residual obstruction O2b: the band-limited constant exp(T k_{max}^2) is ' +
      'strictly increasing in gamma_N and unbounded, so it is NOT uniform in N. ' +
      'If it stopped growing the module would falsely imply a uniform-in-N ' +
      'transfer constant, which would overclaim closure of O2.',
  },
  {
    id: 'imp2545-does-not-close-o2-or-ticket',
    holds: () => {
      const r = IMP2545_ESY_O2_BACKWARD_STABILITY_LOGCONVEXITY_CARLEMAN;
      return (
        r.closesO2 === false &&
        r.closesTicket === false &&
        r.namedSubGap.difficulty.includes('research-grade') &&
        r.namedSubGap.anchors === 'esy-port-O2-backward-flow-coupling' &&
        r.namedSubGap.refines === 'imp-2498-sub-O2-backward-stability-conditional-log-weak'
      );
    },
    why:
      'This is an honest constructive partial, not a closure: it ships explicit ' +
      'conditional-stability lemmas but both fall short of the unconditional ' +
      'uniform-in-N power-law transfer O2 requires. closesO2 / closesTicket must ' +
      'stay false and the residual sub-gap must remain research-grade, anchored to ' +
      'the O2 coupling entry and refining the imp-2498 residual; flipping any of ' +
      'these would overclaim a result imp-2492 / imp-2498 do not support.',
  },
];
