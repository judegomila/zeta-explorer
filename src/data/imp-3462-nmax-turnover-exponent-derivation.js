/**
 * @module imp-3462-nmax-turnover-exponent-derivation
 *
 * imp-3462 (numerical, frontier-direction): imp-3443 MEASURED that the imp-3406 interior-MAX
 * location N_max of the GUE-conditional share sigma(N) follows a near power law
 * N_max ~ (1/E_trunc)^p with p ~ 1.376 (R^2 ~ 0.99992) and local elasticity
 * dlnN_max/dlnE_trunc ~ -1.373, but never DERIVED the exponent. imp-3446 supplies the exact
 * closed IMPLICIT stationarity equation for N_max in the Riemann-von Mangoldt height T0.
 * This module DERIVES the exponent by implicitly differentiating that stationarity condition
 * with respect to E_trunc (treating T0star as the root), obtaining dlnN_max/dlnE_trunc as an
 * EXPLICIT function of the sub-term log-derivatives at the peak, and checks it reproduces the
 * measured ~-1.376 and its slow drift across the half-to-double floor grid.
 *
 * THE STATIONARITY CONDITION (imp-3446, unchanged)
 * ------------------------------------------------
 * With x = ln T0 (so dl/dx = dL/dx = 1 for L = log T0, l = log(T0/2pi)) and the exact
 * imp-3220/imp-3446 sub-terms
 *     E_flow(x) = (l+1) L G / (2pi) * e^(-x)     (imp-398 prefactor, Gronwall G)
 *     E_coll    = C_C sqrt(L/N),   E_trunc = floor
 * N_max is the unique interior root T0star of the imp-3446 residual
 *     F(x, E_trunc) = E_flow * A / (E_trunc + E_flow)  -  B  =  0,
 *     A(x) = 1/(l+1) + 1/L - 1,   B(x) = 1/(2L) - l/(2(l-1)),
 * then N_max = (T0/2pi)(l - 1) = countAtHeight(T0star).
 *
 * THE DERIVATION (implicit differentiation of F = 0 w.r.t. E_trunc)
 * ----------------------------------------------------------------
 * KEY SIMPLIFICATION: the x-log-derivative of E_flow IS exactly A. From
 * ln E_flow = const + ln(l+1) + ln L - x we get E_flow-prime / E_flow = 1/(l+1) + 1/L - 1 = A,
 * i.e. E_flow-prime = E_flow * A. This is the same A that appears in the numerator of (*), so
 * the whole differentiation closes on A, A-prime, B-prime alone. Writing S = E_trunc + E_flow:
 *
 *   d/dx [E_flow A / S] = [ E_flow (A^2 + A-prime) S  -  E_flow^2 A^2 ] / S^2,
 *   A-prime = -1/(l+1)^2 - 1/L^2,
 *   B-prime = -1/(2 L^2) + 1/(2 (l-1)^2),
 *   dF/dx           = d/dx[E_flow A / S]  -  B-prime,
 *   dF/d(lnE_trunc) = E_trunc * dF/dE_trunc = -E_trunc E_flow A / S^2.
 *
 * The implicit-function theorem on F(x, lnE_trunc) = 0 gives the height response
 *     dx / d(lnE_trunc) = -(dF/d lnE_trunc) / (dF/dx) = (E_trunc E_flow A / S^2) / (dF/dx),
 * and since ln N_max = x + ln(l - 1) - ln(2pi) has dlnN/dx = 1 + 1/(l-1) = l/(l-1),
 *
 *     dlnN_max / dlnE_trunc = (l/(l-1)) * dx/dlnE_trunc,    p = - dlnN_max / dlnE_trunc.     (**)
 *
 * Equation (**) is the closed exponent: an EXPLICIT rational function of the peak values
 * E_flow, E_trunc, A, A-prime, B-prime and l -- no fitting, no ternary search.
 *
 * THE FINDING (derivation / measurement only)
 * -------------------------------------------
 *   (D1) At the baseline floor E_trunc = 3.06e-5 the closed form (**) gives
 *        p_analytic ~ 1.373, matching the imp-3443 LOCAL elasticity (-1.373) to ~1e-3 and
 *        reproducing the super-linear-in-(1/E_trunc) scaling.
 *   (D2) The analytic (**) agrees with a direct finite-difference elasticity obtained by
 *        RE-SOLVING the imp-3446 implicit root at E_trunc(1 +- 1e-4) to ~1e-4 -- confirming
 *        the implicit differentiation is correct, not a lucky coincidence with the fit.
 *   (D3) SLOW DRIFT. Evaluating (**) at each half-to-double grid floor, p drifts monotonically
 *        and gently from ~1.36 (half floor) to ~1.39 (double floor); the imp-3443 GLOBAL
 *        log-log chord slope 1.376 is the grid AVERAGE of this drifting local exponent, so the
 *        "power law" is a slowly-varying local exponent, not an exact monomial. The drift is
 *        driven entirely by the order-1 log-derivatives A, A-prime, B-prime evolving with T0.
 *
 * The punchline: the measured N_max ~ (1/E_trunc)^1.376 is not an empirical accident -- it is
 * the value of the closed implicit-differentiation exponent (**) at the baseline floor, and
 * its ~0.99992-tight "power law" is a slowly-drifting local elasticity whose grid average is
 * 1.376. Everything reduces to the peak log-derivatives of the imp-3220 sub-terms.
 *
 * DERIVATION / MEASUREMENT ONLY. No positivity, no bridge closure, no RH claim, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-3446-nmax-closed-form (the implicit stationarity equation F = 0 differentiated here)
 * @see imp-3443-nmax-etrunc-sensitivity (measured p ~ 1.376, local elasticity -1.373)
 * @see imp-3406-sigma-highN-extrapolation (interior MAX pinned N_max ~ 9.22e5 by ternary search)
 * @see imp-3220-en-bridge-fidelity-frontier (U-shaped sigma(N) decade ladder, exact sub-terms)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_BASE = 3.06e-5; // imp-2631/imp-3220/imp-3406/imp-3446 truncation floor
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3220/imp-3406/imp-3446 exactly

// N(T0) from Riemann-von Mangoldt (identical to imp-3446 countAtHeight).
function countAtHeight(T0) {
  const l = Math.log(T0 / TWO_PI);
  return (T0 / TWO_PI) * (l - 1);
}

// The imp-3446 stationarity residual F(x, E_trunc), parametrized by the floor.
function stationarityResidual(T0, eTrunc) {
  const L = Math.log(T0);
  const l = Math.log(T0 / TWO_PI);
  const E_flow = ((l + 1) / TWO_PI) * (L / T0) * GRONWALL;
  const A = 1 / (l + 1) + 1 / L - 1;
  const B = 1 / (2 * L) - l / (2 * (l - 1));
  return (E_flow * A) / (eTrunc + E_flow) - B;
}

// Solve F = 0 for T0star by monotone bisection (residual < 0 below the peak, > 0 above).
// Wide N-bracket so the interior root is captured across the whole half-to-double floor grid.
function solveT0star(eTrunc) {
  let a = effectiveHeightForN(1e5); // residual < 0
  let b = effectiveHeightForN(1e7); // residual > 0
  for (let i = 0; i < 300; i++) {
    const m = Math.sqrt(a * b);
    if (stationarityResidual(m, eTrunc) < 0) a = m;
    else b = m;
  }
  return Math.sqrt(a * b);
}
const solveNmax = (eTrunc) => countAtHeight(solveT0star(eTrunc));

// The CLOSED exponent (**): implicit differentiation of F = 0 w.r.t. ln E_trunc, evaluated
// at the peak T0star. Returns the explicit local exponent p = -dlnN_max/dlnE_trunc plus the
// intermediate log-derivatives so the mechanism is inspectable.
function analyticExponent(eTrunc) {
  const T0 = solveT0star(eTrunc);
  const L = Math.log(T0);
  const l = Math.log(T0 / TWO_PI);
  const E_flow = ((l + 1) / TWO_PI) * (L / T0) * GRONWALL;
  const S = eTrunc + E_flow;
  // Peak log-derivatives (x = ln T0): note E_flow-prime/E_flow = A exactly.
  const A = 1 / (l + 1) + 1 / L - 1;
  const Aprime = -1 / ((l + 1) * (l + 1)) - 1 / (L * L);
  const Bprime = -1 / (2 * L * L) + 1 / (2 * (l - 1) * (l - 1));
  // d/dx [E_flow A / S] with E_flow-prime = E_flow A, S-prime = E_flow A.
  const dRatio_dx =
    (E_flow * (A * A + Aprime) * S - E_flow * E_flow * A * A) / (S * S);
  const dF_dx = dRatio_dx - Bprime;
  const dF_dlnEtrunc = (-eTrunc * E_flow * A) / (S * S);
  const dx_dlnEtrunc = -dF_dlnEtrunc / dF_dx; // implicit-function theorem
  const dlnN_dx = l / (l - 1); // = 1 + 1/(l-1)
  const dlnNmax_dlnEtrunc = dlnN_dx * dx_dlnEtrunc;
  return {
    T0,
    E_flow,
    A,
    Aprime,
    Bprime,
    dlnNmax_dlnEtrunc,
    p: -dlnNmax_dlnEtrunc,
  };
}

// Baseline: closed exponent + reuse gate against the imp-3446/imp-3406 peak N_max ~ 9.219e5.
const BASE = analyticExponent(E_TRUNC_BASE);
const N_MAX_BASE = countAtHeight(BASE.T0); // must reproduce ~9.219e5
const P_ANALYTIC = BASE.p; // ~1.373

// Direct finite-difference elasticity by RE-SOLVING the implicit root at E_trunc(1 +- eps).
// This confirms the implicit differentiation independently of the imp-3443 fit.
const EPS = 1e-4;
const N_PLUS = solveNmax(E_TRUNC_BASE * (1 + EPS));
const N_MINUS = solveNmax(E_TRUNC_BASE * (1 - EPS));
const P_FINITE_DIFF =
  -(Math.log(N_PLUS) - Math.log(N_MINUS)) /
  (Math.log(1 + EPS) - Math.log(1 - EPS));

// Slow drift of the local exponent across the imp-3443 half-to-double floor grid, plus the
// global log-log chord slope of the analytic N_max grid (should reproduce the imp-3443 1.376).
const FACTORS = [0.5, 0.625, 0.75, 0.875, 1.0, 1.25, 1.5, 1.75, 2.0];
const GRID = FACTORS.map((f) => {
  const eTrunc = f * E_TRUNC_BASE;
  const ex = analyticExponent(eTrunc);
  return {
    factor: f,
    E_trunc: +eTrunc.toExponential(4),
    N_max: +countAtHeight(ex.T0).toExponential(5),
    p_local: +ex.p.toFixed(5),
  };
});
function logLogSlope(rows) {
  const xs = rows.map((r) => Math.log(r.E_trunc));
  const ys = rows.map((r) => Math.log(r.N_max));
  const n = xs.length;
  const sx = xs.reduce((a, b) => a + b, 0);
  const sy = ys.reduce((a, b) => a + b, 0);
  const sxx = xs.reduce((a, b) => a + b * b, 0);
  const sxy = xs.reduce((a, b, i) => a + b * ys[i], 0);
  return (n * sxy - sx * sy) / (n * sxx - sx * sx);
}
const CHORD_SLOPE = logLogSlope(GRID); // ~ -1.376
const P_CHORD = -CHORD_SLOPE;
const P_MIN = Math.min(...GRID.map((r) => r.p_local));
const P_MAX = Math.max(...GRID.map((r) => r.p_local));

export const IMP3462_NMAX_TURNOVER_EXPONENT = {
  id: 'imp-3462',
  proofSection: 'S-frontier',
  question:
    'Derive the imp-3443 measured turnover exponent p ~ 1.376 (N_max ~ (1/E_trunc)^p) in ' +
    'closed form by implicitly differentiating the imp-3446 dR/dN = 0 stationarity equation ' +
    'with respect to E_trunc, obtaining dlnN_max/dlnE_trunc as an explicit function of the ' +
    'peak sub-term log-derivatives, and check it reproduces ~-1.376 and its grid drift. ' +
    'Derivation/measurement only; RH-equivalent; no RH verdict.',
  closedForm:
    'p = -dlnN_max/dlnE_trunc = -(l/(l-1)) * dx/dlnE_trunc, with x = ln T0 and (implicit ' +
    'function theorem on F(x,lnE_trunc)=0) dx/dlnE_trunc = -(dF/dlnE_trunc)/(dF/dx). Here ' +
    'F = E_flow A/(E_trunc+E_flow) - B (imp-3446), A = 1/(l+1)+1/L-1, B = 1/(2L)-l/(2(l-1)), ' +
    'and the key collapse E_flow-prime/E_flow = A gives dF/dlnE_trunc = -E_trunc E_flow A/S^2 ' +
    'and dF/dx = [E_flow(A^2+A-prime)S - E_flow^2 A^2]/S^2 - B-prime, S = E_trunc+E_flow, ' +
    'A-prime = -1/(l+1)^2 - 1/L^2, B-prime = -1/(2L^2) + 1/(2(l-1)^2).',
  result: {
    p_analytic: +P_ANALYTIC.toFixed(5), // ~1.373
    p_finite_diff: +P_FINITE_DIFF.toFixed(5), // ~1.373 (re-solved implicit root)
    p_chord_grid: +P_CHORD.toFixed(5), // ~1.376 (imp-3443 global log-log slope)
    measured_local_elasticity: -1.373, // imp-3443 F3
    measured_power_exponent: 1.376, // imp-3443 F2
    N_max_at_baseline: +N_MAX_BASE.toExponential(5), // ~9.2186e5, reproduces imp-3406/imp-3446
    rel_err_analytic_vs_fd: +(Math.abs(P_ANALYTIC - P_FINITE_DIFF) / P_FINITE_DIFF).toExponential(3),
    note:
      'The closed implicit-differentiation exponent (**) gives p_analytic ~ 1.373 at the ' +
      'baseline floor, matching the imp-3443 LOCAL elasticity (-1.373) and agreeing with a ' +
      'direct re-solved-root finite difference to ~1e-4. The imp-3443 GLOBAL log-log slope ' +
      '1.376 is the grid average (chord) of the slowly-drifting local exponent.',
  },
  drift: {
    grid: GRID,
    p_min: +P_MIN.toFixed(5),
    p_max: +P_MAX.toFixed(5),
    note:
      'The local exponent drifts monotonically and gently from ~1.36 (half floor) to ~1.39 ' +
      '(double floor); the ~0.99992-tight imp-3443 "power law" is this slowly-varying local ' +
      'elasticity, not an exact monomial. The drift is set by the order-1 log-derivatives ' +
      'A, A-prime, B-prime evolving with the Riemann-von Mangoldt height T0.',
  },
  mechanism:
    'sigma peaks where R = (E_trunc+E_flow)/E_coll is stationary (imp-3446). Perturbing the ' +
    'floor E_trunc shifts that balance; the implicit-function theorem converts the floor ' +
    'perturbation into a height response dx/dlnE_trunc, and the Riemann-von Mangoldt map ' +
    'ln N = x + ln(l-1) amplifies it by l/(l-1). Because E_flow-prime/E_flow equals the SAME ' +
    'A that sits in the stationarity numerator, the exponent closes on the peak log-derivatives ' +
    'A, A-prime, B-prime alone -- no free parameters, no fit.',
  isRigorous: false,
  verdict:
    'DERIVATION (frontier-direction, NOT rigorous). Implicitly differentiating the imp-3446 ' +
    'stationarity equation F = E_flow A/(E_trunc+E_flow) - B = 0 with respect to ln E_trunc, ' +
    'using the collapse E_flow-prime/E_flow = A, yields the closed exponent p = ' +
    '-(l/(l-1)) dx/dlnE_trunc = -(l/(l-1))(dF/dlnE_trunc)/(dF/dx) as an explicit rational ' +
    'function of the peak log-derivatives. At the baseline floor it gives p ~ 1.373, matching ' +
    'the imp-3443 local elasticity (-1.373), agreeing with a re-solved-root finite difference ' +
    'to ~1e-4, and (grid chord) reproducing the imp-3443 global 1.376; the local exponent ' +
    'drifts gently ~1.36 -> ~1.39 across the half-to-double floor grid, so the measured power ' +
    'law is a slowly-varying local elasticity. Derivation/measurement only; no positivity, no ' +
    'bridge closure, no RH claim, NO QED. No refereed bound is changed.',
  citation:
    'imp-3446 (implicit stationarity equation, differentiated here); imp-3443 (measured p ~ ' +
    '1.376, local elasticity -1.373); imp-3406 (interior MAX N_max ~ 9.22e5); imp-3220 ' +
    '(U-shaped sigma(N) sub-terms); imp-398 (E_flow C_F prefactor); imp-2631 (E_trunc floor); ' +
    'lambda-rh-height-mapping (effectiveHeightForN, Riemann-von Mangoldt).',
};

export const IMP3462_NMAX_TURNOVER_EXPONENT_ASSERTIONS = [
  {
    // Reuse gate: the peak located by the differentiated equation reproduces the imp-3406/
    // imp-3446 interior maximum N_max ~ 9.22e5, proving the identical sub-terms are in use.
    id: 'imp3462-reproduces-imp3446-baseline-Nmax',
    description: 'Baseline peak reproduces the imp-3406/imp-3446 interior maximum ~ 9.22e5',
    holds: () => N_MAX_BASE > 8.5e5 && N_MAX_BASE < 1.0e6,
  },
  {
    // Headline: the closed implicit-differentiation exponent matches the imp-3443 LOCAL
    // elasticity magnitude (~1.373) -- the exponent is derived, not fitted.
    id: 'imp3462-analytic-matches-measured-local-elasticity',
    description: 'Closed-form p ~ 1.373 matches the imp-3443 local elasticity |-1.373|',
    holds: () => Math.abs(P_ANALYTIC - 1.373) < 0.01,
  },
  {
    // Independent correctness: the analytic exponent agrees with a direct finite-difference
    // elasticity from RE-SOLVING the implicit root -- the implicit differentiation is correct.
    id: 'imp3462-analytic-matches-finite-difference',
    description: 'Closed-form p agrees with the re-solved-root finite-difference elasticity to < 1e-3',
    holds: () => Math.abs(P_ANALYTIC - P_FINITE_DIFF) < 1e-3,
  },
  {
    // The global log-log chord slope over the analytic N_max grid reproduces the imp-3443
    // measured power exponent ~1.376, and lies between the drifting local endpoints.
    id: 'imp3462-chord-reproduces-imp3443-power-exponent',
    description: 'Grid chord slope reproduces the imp-3443 global exponent ~1.376',
    holds: () => Math.abs(P_CHORD - 1.376) < 0.01 && P_CHORD >= P_MIN && P_CHORD <= P_MAX,
  },
  {
    // The local exponent drifts slowly and monotonically across the floor grid (super-linear
    // p in (1.3, 1.45)) -- the "power law" is a slowly-varying local elasticity, not a monomial.
    id: 'imp3462-local-exponent-slow-monotone-drift',
    description: 'Local exponent drifts gently and monotonically, all in (1.3, 1.45)',
    holds: () =>
      P_MIN > 1.3 &&
      P_MAX < 1.45 &&
      P_MAX - P_MIN < 0.1 &&
      GRID.every((r, i) => i === 0 || GRID[i - 1].p_local < r.p_local),
  },
  {
    // Honesty gate: derivation only, no QED, no refereed bound is changed, no rigorous or RH claim.
    id: 'imp3462-honesty-gate-no-qed',
    description: 'Derivation only: no QED, no refereed bound is changed, not rigorous',
    holds: () =>
      IMP3462_NMAX_TURNOVER_EXPONENT.isRigorous === false &&
      /NO QED/.test(IMP3462_NMAX_TURNOVER_EXPONENT.verdict) &&
      /refereed bound is changed/i.test(IMP3462_NMAX_TURNOVER_EXPONENT.verdict),
  },
];

for (const a of IMP3462_NMAX_TURNOVER_EXPONENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-3462-nmax-turnover-exponent-derivation assertion failed: ${a.id}`);
  }
}
