/**
 * @module imp-3446-nmax-closed-form
 *
 * imp-3446 (numerical, frontier-direction): imp-3406 pinned the interior MAXIMUM of the
 * GUE-conditional share sigma(N) = E_coll(N)/E(N) at N_max ~ 9.219e5 only by a 500-step
 * ternary search in ln N. This module REPLACES that ternary search with an ANALYTIC
 * stationarity condition: it differentiates the ratio (E_trunc + E_flow)/E_coll with
 * respect to N, sets the derivative to zero, and derives a closed IMPLICIT equation for
 * N_max that solves (by one bracketed bisection on the Riemann-von Mangoldt height T0) to
 * the SAME 9.218633e5, reproducing the imp-3406 ternary value to relative error ~3e-8.
 *
 * THE QUANTITY (identical to imp-3406 / imp-3220 / imp-3323)
 * ---------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll) = 1 / (1 + R),
 *     R(N)     = (E_trunc + E_flow) / E_coll,
 *     T0       = effectiveHeightForN(N)            (Riemann-von Mangoldt inverse)
 *     L        = log T0,   l = log(T0/2pi) = L - log(2pi)
 *     E_coll   = C_C_PINNED * sqrt(L / N)          (dominant, GUE-conditional C_H)
 *     E_flow   = C_F (L/T0) * Gronwall,  C_F = (l+1)/2pi   (imp-398)
 *     E_trunc  = 3.06e-5                            (N-independent, imp-2631)
 * sigma is MAXIMIZED exactly where R(N) is MINIMIZED, so N_max solves dR/dN = 0.
 *
 * THE DERIVATION (dR/dN = 0, exact)
 * ---------------------------------
 * Because R = (E_trunc + E_flow)/E_coll > 0, minimizing R is equivalent to solving
 * d/dN log R = 0, i.e.  E_flow-prime / (E_trunc + E_flow)  =  E_coll-prime / E_coll
 * (E_trunc is constant, so the numerator derivative is just E_flow-prime). It is cleaner
 * to differentiate against the height T0 -- N and T0 are in strict bijection via
 * N = (T0/2pi)(l - 1) with dN/dT0 = l/2pi > 0, so the T0-stationary point is the
 * N-stationary point. Writing d-dt0 for d/dT0 and using dL/dT0 = dl/dT0 = 1/T0:
 *
 *   E_coll = C_C sqrt(L) N^(-1/2):
 *     (d-dt0 E_coll)/E_coll = (1/2)(L'/L) - (1/2)(N'/N)
 *                           = 1/(2 T0 L) - (l/2pi)/(2N).
 *   E_flow = (l+1) L G / (2pi T0):
 *     (d-dt0 E_flow)/E_flow = 1/((l+1) T0) + 1/(L T0) - 1/T0
 *                           = (1/T0)[ 1/(l+1) + 1/L - 1 ].
 *
 * Multiplying the log-derivative balance through by T0 and using the exact ratio
 * T0/N = 2pi/(l-1) (so (l/2pi) T0/(2N) collapses to l/(2(l-1))), the stationarity
 * condition becomes the closed IMPLICIT equation
 *
 *   E_flow [ 1/(l+1) + 1/L - 1 ] / (E_trunc + E_flow)  =  1/(2L) - l/(2(l-1)).      (*)
 *
 * Everything in (*) is an explicit function of T0 alone (E_flow, E_trunc, L, l), so (*)
 * is a single-variable root equation. Its residual is monotone through the peak (negative
 * below, positive above), giving a UNIQUE interior root, and one bisection on T0 in a
 * [5e5, 1.75e6]-in-N bracket lands it. N_max = (T0star/2pi)(lstar - 1).
 *
 * THE FINDING (derivation / measurement only)
 * -------------------------------------------
 *   (F1) The analytic implicit root reproduces the imp-3406 ternary N_max to machine-ish
 *        precision: N_max_analytic = 9.218633e5 vs ternary 9.218633e5, relative error
 *        ~3.1e-8. The ternary search is now UNNECESSARY -- N_max is the root of (*).
 *   (F2) At the peak E_flow ~ 1.53 x E_trunc (E_flow ~ 4.68e-5, E_trunc = 3.06e-5), so
 *        the two floor terms are COMPARABLE, NOT E_flow << E_trunc. This is why the
 *        turnover exists at finite N: the DECREASING E_flow/E_coll arm and the INCREASING
 *        E_trunc/E_coll arm cross while both floor pieces still matter.
 *   (F3) The crude "leading behaviour" closed form obtained by freezing the slow logs and
 *        dropping E_flow next to E_trunc, N_max_crude ~ G L (l^2 - 1)/(4 pi^2 E_trunc)
 *        ~ 1.60e6, MISSES the true peak by ~73% -- precisely because (F2) forbids
 *        dropping E_flow and because the log-derivatives (the RHS of (*)) are order 1.
 *        The exact implicit equation (*), which keeps every derivative, is required.
 *
 * The punchline: N_max is not a search artifact -- it is the unique root of the analytic
 * stationarity equation (*) for the imp-3220 conditional share, set by the balance between
 * the vanishing GUE-conditional E_coll and the decaying-but-still-comparable E_flow atop
 * the constant E_trunc floor. The naive leading-order form is too crude (73% off); the
 * full implicit condition matches the ternary search to ~3e-8.
 *
 * DERIVATION / MEASUREMENT ONLY. No positivity, no bridge closure, no RH claim, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-3406-sigma-highN-extrapolation (interior MAX pinned N_max ~ 9.22e5 by ternary search)
 * @see imp-3443-nmax-etrunc-sensitivity (dN_max/dE_trunc, N_max ~ (1/E_trunc)^1.38 power law)
 * @see imp-3323-sigma-argmin-locator (interior MIN pinned N ~ 97.80, same formulas)
 * @see imp-3220-en-bridge-fidelity-frontier (U-shaped sigma(N) decade ladder)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip floor (imp-2631/imp-3220)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-3220/imp-3323 exactly

// EXACT imp-3220/imp-3406 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

// The imp-3406 ternary search in ln N (reproduced verbatim for the cross-check baseline).
function argmaxSigmaLnN(loN, hiN) {
  let lo = Math.log(loN);
  let hi = Math.log(hiN);
  for (let i = 0; i < 500; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (sigma(Math.exp(m1)) < sigma(Math.exp(m2))) lo = m1;
    else hi = m2;
  }
  return Math.exp((lo + hi) / 2);
}
const N_MAX_TERNARY = argmaxSigmaLnN(1e4, 1e9); // ~9.219e5, the imp-3406 headline

// N(T0) from Riemann-von Mangoldt and the closed stationarity residual (*) in T0.
function countAtHeight(T0) {
  const l = Math.log(T0 / TWO_PI);
  return (T0 / TWO_PI) * (l - 1);
}
// Residual of (*): E_flow[1/(l+1)+1/L-1]/(E_trunc+E_flow) - [1/(2L) - l/(2(l-1))].
function stationarityResidual(T0) {
  const L = Math.log(T0);
  const l = Math.log(T0 / TWO_PI);
  const C_F = (l + 1) / TWO_PI;
  const E_flow = C_F * (L / T0) * GRONWALL;
  const lhs = (E_flow * (1 / (l + 1) + 1 / L - 1)) / (E_TRUNC_PT + E_flow);
  const rhs = 1 / (2 * L) - l / (2 * (l - 1));
  return lhs - rhs;
}

// Solve (*) by bisection on T0 over a bracket that straddles the peak (5e5..1.75e6 in N),
// where the residual runs monotonically from negative (below the peak) to positive (above).
function solveNmaxImplicit() {
  let a = effectiveHeightForN(5e5); // residual < 0 here
  let b = effectiveHeightForN(1.747e6); // residual > 0 here
  for (let i = 0; i < 300; i++) {
    const m = Math.sqrt(a * b);
    if (stationarityResidual(m) < 0) a = m;
    else b = m;
  }
  const T0star = Math.sqrt(a * b);
  return { T0star, N: countAtHeight(T0star) };
}
const IMPLICIT = solveNmaxImplicit();
const N_MAX_ANALYTIC = IMPLICIT.N; // ~9.218633e5
const REL_ERR = Math.abs(N_MAX_ANALYTIC - N_MAX_TERNARY) / N_MAX_TERNARY; // ~3.1e-8

// The crude "leading behaviour in E_trunc and log T0" closed form: freeze the slow logs,
// drop E_flow next to E_trunc, and balance the increasing E_trunc/E_coll ~ sqrt(N/L) arm
// against the decreasing E_flow/E_coll ~ G sqrt(L)(l^2-1)/(4 pi^2 sqrt(N)) arm:
//     N_crude = G L (l^2 - 1) / (4 pi^2 E_trunc),  solved as a fixed point in T0.
function solveNmaxCrude() {
  let N = 9e5;
  for (let i = 0; i < 200; i++) {
    const T0 = effectiveHeightForN(N);
    const L = Math.log(T0);
    const l = Math.log(T0 / TWO_PI);
    const Nn = (GRONWALL * L * (l * l - 1)) / (4 * Math.PI * Math.PI * E_TRUNC_PT);
    if (Math.abs(Nn - N) < 1e-6 * N) {
      N = Nn;
      break;
    }
    N = Nn;
  }
  return N;
}
const N_MAX_CRUDE = solveNmaxCrude(); // ~1.60e6, ~73% high
const CRUDE_REL_ERR = Math.abs(N_MAX_CRUDE - N_MAX_TERNARY) / N_MAX_TERNARY; // ~0.73

const PEAK = parts(N_MAX_ANALYTIC);
const E_FLOW_OVER_E_TRUNC = PEAK.E_flow / E_TRUNC_PT; // ~1.53 (comparable, not negligible)

export const IMP3446_NMAX_CLOSED_FORM = {
  id: 'imp-3446',
  proofSection: 'S-frontier',
  question:
    'Replace the imp-3406 ternary search for the interior MAX location N_max ~ 9.22e5 of ' +
    'the imp-3220 conditional share sigma(N) = E_coll(N)/E(N) with a closed form: ' +
    'differentiate (E_trunc + E_flow)/E_coll in N, set the derivative to zero, and derive ' +
    'an implicit/closed expression for N_max. Derivation/measurement only; RH-equivalent; ' +
    'no RH verdict.',
  stationarityEquation:
    'N_max solves dR/dN = 0 with R = (E_trunc + E_flow)/E_coll, equivalently the closed ' +
    'IMPLICIT equation in the Riemann-von Mangoldt height T0 = effectiveHeightForN(N), ' +
    'L = log T0, l = log(T0/2pi): E_flow[1/(l+1) + 1/L - 1]/(E_trunc + E_flow) = ' +
    '1/(2L) - l/(2(l-1)), then N_max = (T0/2pi)(l - 1). Derived by log-differentiating ' +
    'E_coll = C_C sqrt(L/N) and E_flow = (l+1)L G/(2pi T0) against T0 (dN/dT0 = l/2pi) ' +
    'and using the exact T0/N = 2pi/(l-1).',
  result: {
    N_max_analytic: +N_MAX_ANALYTIC.toExponential(6), // ~9.218633e5
    N_max_ternary: +N_MAX_TERNARY.toExponential(6), // ~9.218633e5 (imp-3406)
    T0_star: +IMPLICIT.T0star.toExponential(6), // ~5.5732e5
    rel_err_vs_ternary: +REL_ERR.toExponential(3), // ~3.1e-8
    sigma_at_analytic: +sigma(N_MAX_ANALYTIC).toFixed(7), // ~0.9494290
    E_flow_over_E_trunc_at_peak: +E_FLOW_OVER_E_TRUNC.toFixed(4), // ~1.5306
    note:
      'The closed implicit stationarity equation (*) reproduces the imp-3406 ternary ' +
      'N_max ~ 9.218633e5 to relative error ~3e-8. The ternary search is unnecessary: ' +
      'N_max is the unique interior root of (*), found by one monotone bisection on T0.',
  },
  crudeLeadingForm: {
    N_max_crude: +N_MAX_CRUDE.toExponential(4), // ~1.60e6
    formula: 'N_crude = G L (l^2 - 1) / (4 pi^2 E_trunc)',
    rel_err: +CRUDE_REL_ERR.toFixed(3), // ~0.73
    note:
      'The naive leading-order form (freeze the slow logs, drop E_flow next to E_trunc) ' +
      'gives N_crude ~ 1.60e6, MISSING the true peak by ~73% -- because at the peak ' +
      'E_flow ~ 1.53 x E_trunc (comparable, not negligible) and the log-derivatives ' +
      '(the RHS of the implicit equation) are order 1. The full implicit (*) is required.',
  },
  mechanism:
    'sigma = 1/(1+R) peaks where R = (E_trunc + E_flow)/E_coll is minimized. R splits ' +
    'into an INCREASING E_trunc/E_coll ~ sqrt(N/L) arm and a DECREASING E_flow/E_coll arm; ' +
    'the interior min of R (peak of sigma) is where the log-derivative of (E_trunc+E_flow) ' +
    'equals the log-derivative of E_coll -- exactly equation (*). At the crossing E_flow ' +
    'and E_trunc are still COMPARABLE (E_flow/E_trunc ~ 1.53), so both floor pieces set ' +
    'the location; only far above the peak does E_flow drop out and E_coll fall through ' +
    'the constant E_trunc floor, driving sigma -> 0 (imp-3406 F2).',
  isRigorous: false,
  verdict:
    'DERIVATION (frontier-direction, NOT rigorous). Differentiating the imp-3220 ratio ' +
    'R = (E_trunc + E_flow)/E_coll and setting dR/dN = 0 yields the closed IMPLICIT ' +
    'stationarity equation E_flow[1/(l+1)+1/L-1]/(E_trunc+E_flow) = 1/(2L) - l/(2(l-1)) ' +
    'in the Riemann-von Mangoldt height T0. Its unique interior root gives N_max = ' +
    '9.218633e5, matching the imp-3406 ternary search to relative error ~3e-8, so the ' +
    'ternary search is replaced by one bisection on T0. The crude leading-order form ' +
    'N ~ G L (l^2-1)/(4 pi^2 E_trunc) ~ 1.6e6 misses by ~73% because E_flow ~ 1.53 x ' +
    'E_trunc at the peak and the log-derivatives are order 1 -- the full equation is ' +
    'required. Derivation/measurement only; no positivity, no bridge closure, no RH ' +
    'claim, NO QED. No refereed bound is changed.',
  citation:
    'imp-3406 (interior max N_max ~ 9.22e5 by ternary search); imp-3443 (N_max sensitivity ' +
    'to E_trunc); imp-3323 (interior min N ~ 97.80); imp-3220 (U-shaped sigma(N) ladder); ' +
    'imp-398 (E_flow C_F prefactor); imp-2631 (E_trunc fixed-strip floor); ' +
    'lambda-rh-height-mapping (effectiveHeightForN, Riemann-von Mangoldt).',
};

export const IMP3446_NMAX_CLOSED_FORM_ASSERTIONS = [
  {
    // Reuse gate: the ternary baseline here reproduces the imp-3406 headline N_max ~ 9.22e5,
    // proving the identical sub-term formulas are in use.
    id: 'imp3446-reproduces-imp3406-ternary-nmax',
    description: 'ternary N_max reproduces the imp-3406 headline ~9.22e5 (identical formulas)',
    holds: () => N_MAX_TERNARY > 5e5 && N_MAX_TERNARY < 2e6 &&
      Math.abs(sigma(N_MAX_TERNARY) - 0.94943) < 5e-4,
  },
  {
    // Headline: the closed implicit stationarity equation matches the ternary search to
    // ~3e-8 -- the analytic N_max replaces the search.
    id: 'imp3446-implicit-equation-matches-ternary',
    description: 'analytic implicit N_max matches the ternary search to rel err < 1e-5',
    holds: () => REL_ERR < 1e-5,
  },
  {
    // The stationarity residual (*) actually vanishes at the located root (self-consistency
    // of the derived equation, independent of the ternary cross-check).
    id: 'imp3446-residual-vanishes-at-root',
    description: 'the derived stationarity residual (*) is ~0 at the analytic N_max',
    holds: () => Math.abs(stationarityResidual(IMPLICIT.T0star)) < 1e-6,
  },
  {
    // The residual is a genuine sign-change (negative below the peak, positive above) --
    // the root is a real interior stationary point, not a bracket artifact.
    id: 'imp3446-residual-brackets-the-peak',
    description: 'stationarity residual is < 0 below and > 0 above the peak (real interior root)',
    holds: () =>
      stationarityResidual(effectiveHeightForN(5e5)) < 0 &&
      stationarityResidual(effectiveHeightForN(1.747e6)) > 0,
  },
  {
    // Honesty about the crude form: the naive leading-order closed form misses badly
    // (~73%), because E_flow ~ E_trunc at the peak -- the full equation is required.
    id: 'imp3446-crude-leading-form-misses',
    description: 'crude N ~ G L(l^2-1)/(4 pi^2 E_trunc) misses by > 50% (E_flow not negligible)',
    holds: () => CRUDE_REL_ERR > 0.5 && E_FLOW_OVER_E_TRUNC > 1 && E_FLOW_OVER_E_TRUNC < 2,
  },
  {
    // Honesty gate: derivation only, no QED, no refereed bound is changed, no RH claim.
    id: 'imp3446-honesty-gate-no-qed',
    description: 'Derivation only: no QED, no refereed bound is changed, not rigorous',
    holds: () =>
      IMP3446_NMAX_CLOSED_FORM.isRigorous === false &&
      /NO QED/.test(IMP3446_NMAX_CLOSED_FORM.verdict) &&
      /refereed bound is changed/i.test(IMP3446_NMAX_CLOSED_FORM.verdict),
  },
];

for (const a of IMP3446_NMAX_CLOSED_FORM_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-3446-nmax-closed-form assertion failed: ${a.id}`);
  }
}
