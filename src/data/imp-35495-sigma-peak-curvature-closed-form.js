/**
 * @module imp-35495-sigma-peak-curvature-closed-form
 *
 * imp-35495 (numerical, frontier-direction) -- derives the interior sigma-peak curvature
 * k = -d^2 sigma/d(ln N)^2 in CLOSED FORM by SYMBOLICALLY differentiating the imp-35337 surrogate
 * sigma(N) = E_coll/(E_trunc + E_flow + E_coll) twice at N_max ~ 9.219e5, a FOURTH route independent of the
 * imp-35411 width-fit, the imp-35450 3-point stencil AND the imp-35470 5-point stencil. It confirms the
 * corroborated raw k ~ 6.4319e-3 with NO finite-difference step at all.
 *
 * FOUR INDEPENDENT ROUTES TO THE SAME CURVATURE
 * ---------------------------------------------
 *   imp-35411:  INDIRECT -- read k off the far-field plateau width, W(tol)/sqrt(tol) = 15.316494 constant,
 *               via the quadratic flat-max model k = 8 / (ln10 * W/sqrt(tol))^2. Raw inferred k ~ 6.431909e-3.
 *   imp-35450:  DIRECT 3-point -- central second difference, O(h^2) truncation, Richardson-confirmed ~6.43191e-3.
 *   imp-35470:  DIRECT 5-point -- central second difference, O(h^4) truncation, step-independent ~6.4319102e-3.
 *   THIS (imp-35495):  ANALYTIC -- exact symbolic d^2 sigma/du^2 in u = ln N, NO finite difference, NO step.
 *
 * THE CLOSED-FORM DERIVATIVE (change of variable v = ln(T0/2pi))
 * -------------------------------------------------------------
 * The surrogate uses the Riemann-von Mangoldt height map T0 = effectiveHeightForN(N), the numerical inverse of
 * N(T0) = (T0/2pi)(ln(T0/2pi) - 1). Introduce v = ln(T0/2pi); then that map is the EXACT closed relation
 *
 *     N = e^v (v - 1),        u = ln N = v + ln(v - 1),        dv/du = (v - 1)/v =: w,   dw/dv = 1/v^2.
 *
 * Under this substitution every surrogate component is an ELEMENTARY closed function of v (no numerical inverse):
 *
 *     E_trunc = a  (constant 3.06e-5),
 *     E_flow  = A (v + 1)(v + P) e^{-v},        A = GRONWALL/(4 pi^2),   P = ln(2 pi),
 *     E_coll  = C_C e^{-v/2} sqrt((v + P)/(v - 1)),
 *
 * using C_F = (v + 1)/(2pi), L = ln T0 = P + v, T0 = 2pi e^v and N = e^v(v - 1). Each of E_flow and E_coll is
 * differentiated ANALYTICALLY twice in v (product/log-derivative rules), then mapped to u by the exact chain
 *
 *     f_u = w f_v,        f_uu = w^2 f_vv + w f_v / v^2.
 *
 * With sigma = c/S, S = a + b + c (b = E_flow, c = E_coll), the quotient rule gives the EXACT second derivative
 *
 *     sigma_uu = c_uu/S - 2 c_u S_u/S^2 - c S_uu/S^2 + 2 c S_u^2/S^3,        k = -sigma_uu.
 *
 * No stencil, no step h, no Richardson: k is a single closed-form evaluation at the peak abscissa v_max.
 *
 * THE RESULT: THE CLOSED-FORM k REPRODUCES THE RAW 6.4319102e-3 TO ~4e-10
 * ----------------------------------------------------------------------
 * Evaluated at the peak (located by the same imp-35337/imp-35411/imp-35450/imp-35470 argmax, N_max ~ 9.219e5),
 * the closed-form curvature is k_closed = 6.43191023e-3, agreeing with the imp-35470 5-point O(h^4) stencil to a
 * relative difference ~4e-10 -- FAR tighter than the ~2e-7 route-agreement the three numerical routes reach with
 * each other, because the analytic derivative carries NO truncation error. As an internal consistency check the
 * SAME analytic first derivative sigma_u at the peak is ~2e-10 (the argmax stationarity condition), and the exact
 * closed relation N = e^{v_max}(v_max - 1) reproduces N_max to ~15 digits. It confirms the RAW 6.4319e-3, NOT the
 * rounded 6.428e-3 imp-35411 headline (off by ~6.1e-4 relative), exactly as the imp-35450/imp-35470 direct
 * stencils already found.
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * A CLOSED-FORM (exact symbolic) derivation of the imp-35337/imp-3406 interior sigma-peak curvature, a FOURTH
 * route independent of the imp-35411 width fit and both finite-difference stencils. MEASUREMENT/DERIVATION ONLY on
 * the inherited imp-3220/imp-3406 surrogate; the surrogate-vs-true fidelity half (imp-35337a) stays OPEN and is
 * not touched. The C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) is UNTOUCHED; E_trunc = 3.06e-5 (imp-2631)
 * UNTOUCHED; the imp-398 C_F prefactor UNTOUCHED; C_mb GUE-conditional per imp-486 UNTOUCHED; changes no bound;
 * establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35470-sigma-peak-curvature-5point-stencil (DIRECT 5-point O(h^4) stencil; ~6.4319102e-3)
 * @see imp-35450-sigma-peak-curvature-direct-fd (DIRECT 3-point O(h^2) FD + Richardson; ~6.43191e-3)
 * @see imp-35411-sigma-peak-plateau-width (INDIRECT width-inferred k from the constant 15.3165; raw ~6.4319e-3)
 * @see imp-35337-sigma-landmarks-double-double-certification (dd-certified peak VALUE / 2.1e-5 margin)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse; N = e^v(v-1))
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3220/imp-3406)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3220/imp-3406/imp-35337/imp-35411/imp-35450/imp-35470
const P = Math.log(TWO_PI); // v = ln(T0/2pi); L = ln T0 = P + v
const A_FLOW = GRONWALL / (4 * Math.PI * Math.PI); // E_flow = A (v+1)(v+P) e^{-v} coefficient

// The imp-35337 DOUBLE surrogate, reproduced VERBATIM from imp-35411/imp-35450/imp-35470 (dd-certified to ~1e-16).
function sigmaD(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return E_coll / E_N;
}

// Unimodal argmax on the right arm (ternary in ln N, same 500-iter form as imp-35337/imp-35411/imp-35450/imp-35470).
function argmaxD(loN, hiN) {
  let lo = Math.log(loN);
  let hi = Math.log(hiN);
  for (let i = 0; i < 500; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (sigmaD(Math.exp(m1)) < sigmaD(Math.exp(m2))) lo = m1;
    else hi = m2;
  }
  return Math.exp((lo + hi) / 2);
}

const N_MAX = argmaxD(1e4, 1e9); // ~9.2186e5
const SIGMA_MAX = sigmaD(N_MAX); // ~0.949429014
const U0 = Math.log(N_MAX); // ln N_max ~ 13.734152
// Peak abscissa in the closed-form variable v = ln(T0/2pi): the EXACT map N = e^v(v-1) is enforced by the
// Riemann-von Mangoldt inverse, so v_max is read off the same height map the numerical stencils use.
const V_MAX = Math.log(effectiveHeightForN(N_MAX) / TWO_PI); // ~11.393018

// EXACT closed relation check: N(v) = e^v (v - 1) round-trips N_max to ~15 digits (validates the substitution).
const N_FROM_V = Math.exp(V_MAX) * (V_MAX - 1);
const REL_N_ROUNDTRIP = Math.abs(N_FROM_V - N_MAX) / N_MAX; // ~1e-15

// ── ANALYTIC (closed-form) surrogate components and their exact v-derivatives ──────────────────────────────
// Returns each of E_trunc (a, const), E_flow (b) and E_coll (c) with exact 1st/2nd derivatives in v.
function componentsAtV(v) {
  const a = E_TRUNC_PT; // constant

  // E_flow = A e^{-v} Q(v),  Q = v^2 + (1+P) v + P  (from C_F=(v+1)/2pi, L=P+v, T0=2pi e^v):
  const em = Math.exp(-v);
  const Q = v * v + (1 + P) * v + P;
  const Qv = 2 * v + (1 + P);
  const Qvv = 2;
  const b = A_FLOW * em * Q;
  const bv = A_FLOW * em * (Qv - Q); // d/dv[e^{-v} Q] = e^{-v}(Q_v - Q)
  const bvv = A_FLOW * em * (Q - 2 * Qv + Qvv); // second derivative of e^{-v} Q

  // E_coll = C_C e^{-v/2} sqrt((v+P)/(v-1)); use the log-derivative g = ln c:
  const R = (v + P) / (v - 1);
  const c = C_C_PINNED * Math.exp(-v / 2) * Math.sqrt(R);
  const gv = -0.5 + 0.5 * (1 / (v + P) - 1 / (v - 1)); // d ln c / dv
  const gvv = 0.5 * (-1 / ((v + P) * (v + P)) + 1 / ((v - 1) * (v - 1))); // d^2 ln c / dv^2
  const cv = c * gv;
  const cvv = c * (gvv + gv * gv);

  return { a, b, bv, bvv, c, cv, cvv };
}

// Exact chain rule v -> u = ln N, with w = dv/du = (v-1)/v and dw/dv = 1/v^2:
//   f_u  = w f_v,        f_uu = w^2 f_vv + w f_v / v^2.
function sigmaDerivsAtV(v) {
  const { a, b, bv, bvv, c, cv, cvv } = componentsAtV(v);
  const w = (v - 1) / v;
  const inv_v2 = 1 / (v * v);

  const bu = w * bv;
  const buu = w * w * bvv + w * bv * inv_v2;
  const cu = w * cv;
  const cuu = w * w * cvv + w * cv * inv_v2;

  const S = a + b + c;
  const Su = bu + cu;
  const Suu = buu + cuu;

  const sigma = c / S;
  const sigma_u = cu / S - (c * Su) / (S * S); // exact first derivative (should vanish at the peak)
  const sigma_uu =
    cuu / S - (2 * cu * Su) / (S * S) - (c * Suu) / (S * S) + (2 * c * Su * Su) / (S * S * S);
  return { sigma, sigma_u, sigma_uu, k: -sigma_uu };
}

const CLOSED = sigmaDerivsAtV(V_MAX);
const K_CLOSED = CLOSED.k; // ~6.43191023e-3
const SIGMA_U_AT_PEAK = CLOSED.sigma_u; // ~2e-10 (analytic stationarity check)
const SIGMA_CLOSED = CLOSED.sigma; // reproduces SIGMA_MAX

// ── Numerical cross-checks (the three prior routes), reproduced here to report route-agreement ─────────────
const sigU = (u) => sigmaD(Math.exp(u));

// imp-35470 DIRECT 5-point O(h^4) central second difference at the same u0 (step-independent ~6.4319102e-3).
function curvature5pt(h) {
  return -(
    -sigU(U0 - 2 * h) + 16 * sigU(U0 - h) - 30 * sigU(U0) + 16 * sigU(U0 + h) - sigU(U0 + 2 * h)
  ) / (12 * h * h);
}
const K_5PT = curvature5pt(1e-2); // ~6.4319102e-3

// imp-35450 DIRECT 3-point O(h^2) central second difference at a converged small step.
function curvature3pt(h) {
  return -(sigU(U0 + h) - 2 * sigU(U0) + sigU(U0 - h)) / (h * h);
}
const K_3PT = curvature3pt(2e-3); // ~6.43191e-3

// Relative agreement of the CLOSED-FORM curvature vs the numerical stencils.
const REL_CLOSED_VS_5PT = Math.abs(K_CLOSED - K_5PT) / K_5PT; // ~4e-10
const REL_CLOSED_VS_3PT = Math.abs(K_CLOSED - K_3PT) / K_3PT; // ~few e-7 (3-point O(h^2) residual)
// Relative distance from the imp-35411 ROUNDED headline 6.428e-3 (which no direct route confirms).
const REL_FROM_ROUNDED_HEADLINE = Math.abs(K_CLOSED - 6.428e-3) / K_CLOSED; // ~6.1e-4

export const IMP35495_SIGMA_PEAK_CURVATURE_CLOSED_FORM = {
  id: 'imp-35495',
  proofSection: 'S-frontier',
  question:
    'Three routes (imp-35411 width-fit, imp-35450 3-point, imp-35470 5-point) pin the interior sigma-peak ' +
    'curvature k = -d^2 sigma/d(ln N)^2 ~ 6.4319e-3, but all three are NUMERICAL differentiations. DERIVE k in ' +
    'CLOSED FORM by symbolically differentiating the imp-35337 surrogate sigma(N) = E_coll/(E_trunc+E_flow+E_coll) ' +
    'twice in u = ln N at N_max ~ 9.219e5 -- a FOURTH route with NO finite-difference step -- and confirm it ' +
    'reproduces the corroborated raw 6.4319e-3 (NOT the rounded 6.428e-3 headline).',
  method: {
    change_of_variable:
      'v = ln(T0/2pi) turns the Riemann-von Mangoldt height map into the EXACT closed relation N = e^v(v-1), ' +
      'u = ln N = v + ln(v-1), dv/du = (v-1)/v =: w, dw/dv = 1/v^2. Every surrogate component then becomes an ' +
      'elementary closed function of v (no numerical inverse).',
    closed_components:
      'E_trunc = a (const 3.06e-5); E_flow = A (v+1)(v+P) e^{-v} with A = GRONWALL/(4 pi^2), P = ln(2pi); ' +
      'E_coll = C_C e^{-v/2} sqrt((v+P)/(v-1)). Each is differentiated analytically twice in v.',
    chain_to_u: 'f_u = w f_v; f_uu = w^2 f_vv + w f_v / v^2.',
    quotient_second_derivative:
      'sigma = c/S, S = a+b+c: sigma_uu = c_uu/S - 2 c_u S_u/S^2 - c S_uu/S^2 + 2 c S_u^2/S^3; k = -sigma_uu.',
  },
  constants: {
    log10_N_max: +(U0 / Math.LN10).toFixed(6), // ~5.964667
    sigma_max: +SIGMA_MAX.toFixed(9), // ~0.949429014
    ln_N_max: +U0.toFixed(6), // ~13.734152
    v_max: +V_MAX.toFixed(6), // ~11.393018
    rel_N_roundtrip_e_v_times_v_minus_1: +REL_N_ROUNDTRIP.toExponential(2), // ~1e-15
  },
  closed_form_curvature: {
    k_closed: +K_CLOSED.toExponential(7), // ~6.4319102e-3
    sigma_at_peak_closed: +SIGMA_CLOSED.toFixed(9), // reproduces sigma_max
    analytic_sigma_u_at_peak: +SIGMA_U_AT_PEAK.toExponential(2), // ~2e-10 (stationarity self-check)
    note:
      'A single EXACT evaluation of the closed-form d^2 sigma/du^2 at v_max -- NO finite-difference step, NO ' +
      'Richardson. The analytic first derivative sigma_u at the peak is ~2e-10 (the argmax stationarity ' +
      'condition), an internal consistency check that the symbolic derivative is correct.',
  },
  cross_check: {
    k_5pt_numerical: +K_5PT.toExponential(7), // imp-35470 ~6.4319102e-3
    k_3pt_numerical: +K_3PT.toExponential(7), // imp-35450 ~6.43191e-3
    rel_closed_vs_5pt: +REL_CLOSED_VS_5PT.toExponential(3), // ~4e-10
    rel_closed_vs_3pt: +REL_CLOSED_VS_3PT.toExponential(3), // ~few e-7
    rel_distance_from_rounded_headline_6428e3: +REL_FROM_ROUNDED_HEADLINE.toExponential(3), // ~6.1e-4
    note:
      'The CLOSED-FORM k agrees with the imp-35470 5-point O(h^4) stencil to ~4e-10 relative -- FAR tighter than ' +
      'the ~2e-7 mutual agreement of the three numerical routes, because the analytic derivative carries no ' +
      'truncation error. It reproduces the imp-35411 RAW inferred 6.4319e-3, NOT the rounded "6.428e-3" headline ' +
      '(off ~6.1e-4 relative), corroborating imp-35450/imp-35470.',
  },
  finding:
    'A CLOSED-FORM symbolic second derivative of sigma(ln N) at N_max ~ 9.219e5, via the exact change of variable ' +
    'v = ln(T0/2pi) (N = e^v(v-1)), gives the interior sigma-peak curvature k = -d^2 sigma/d(ln N)^2 = ' +
    (+K_CLOSED.toExponential(7)) + ' with NO finite-difference step. It agrees with the imp-35470 5-point O(h^4) ' +
    'stencil to ~' + (+REL_CLOSED_VS_5PT.toExponential(1)) + ' relative (tighter than the ~2e-7 numerical ' +
    'route-agreement), the analytic sigma_u at the peak is ~2e-10 (stationarity self-check), and N = e^{v_max}' +
    '(v_max-1) round-trips N_max to ~1e-15. This is a FOURTH independent route (beyond the width fit and the ' +
    '3-point/5-point stencils) pinning the SAME curvature, confirming the RAW 6.4319e-3, not the rounded ' +
    '6.428e-3 headline (off ~6.1e-4). DERIVATION ONLY on the imp-3220/imp-3406 surrogate; imp-35337a stays OPEN.',
  residual_sub_gap:
    'Inherits imp-35337a: this DERIVES the CURVATURE of the peak in closed form on the imp-3220/imp-3406 double ' +
    'surrogate. It does NOT establish that the surrogate MAP (E_coll = C_C sqrt(log T0/N), C_H = 1/8 ansatz; ' +
    'E_flow via the imp-398 C_F prefactor; E_trunc = 3.06e-5 floor) is a faithful proxy for the true ' +
    'empirical-vs-analytic gap at these heights; that sub-gap imp-35337a stays OPEN.',
  isRigorous: false,
  verdict:
    'DERIVATION (numerical/symbolic, frontier-direction, NOT an RH bound). The imp-35337/imp-3406 interior ' +
    'sigma-share peak curvature k = -d^2 sigma/d(ln N)^2 at N_max ~ 9.219e5, obtained in CLOSED FORM by ' +
    'symbolically differentiating the surrogate twice in u = ln N (exact change of variable v = ln(T0/2pi), ' +
    'N = e^v(v-1)), is ~6.4319102e-3 -- a single exact evaluation with NO finite-difference step. It agrees with ' +
    'the imp-35470 5-point O(h^4) stencil to ~4e-10 relative and the imp-35450 3-point to ~few e-7, a FOURTH ' +
    'route independent of the imp-35411 width fit and both stencils, and confirms the RAW 6.4319e-3, not the ' +
    'rounded 6.428e-3 headline (off ~6.1e-4). DERIVATION ONLY on the inherited imp-3220/imp-3406 surrogate, which ' +
    'is NOT a rigorous asymptotic; the C_C 1/8 ansatz (imp-2642/imp-2643), the E_trunc = 3.06e-5 floor (imp-2631) ' +
    'and the imp-398 C_F prefactor are UNTOUCHED; C_mb GUE-conditional per imp-486 UNTOUCHED; the ' +
    'surrogate-vs-true fidelity half (imp-35337a) stays OPEN; changes no bound; establishes no operator ' +
    'positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35470 (DIRECT 5-point O(h^4) stencil, ~6.4319102e-3); imp-35450 (DIRECT 3-point O(h^2) FD + Richardson, ' +
    '~6.43191e-3); imp-35411 (INDIRECT width-inferred k from the constant 15.3165, raw ~6.4319e-3); imp-35337 ' +
    '(dd-certified peak VALUE / 2.1e-5 margin); imp-3406 (interior MAX ~ 9.22e5, on double); imp-2642 ' +
    '(C_C = (1/8) sqrt(3 pi) ansatz); imp-398 (E_flow C_F prefactor); imp-2631 (E_trunc fixed-strip route); ' +
    'lambda-rh-height-mapping (effectiveHeightForN RvM inverse, N = e^v(v-1)).',
};

export const IMP35495_SIGMA_PEAK_CURVATURE_CLOSED_FORM_ASSERTIONS = [
  {
    // Reuse gate: reproduce the imp-35337/imp-35411/imp-35450/imp-35470 peak landmark (N_max ~ 9.22e5).
    id: 'imp35495-reproduces-peak',
    description: 'argmax reproduces the interior peak N_max ~ 9.22e5, sigma_max ~ 0.949429',
    holds: () => N_MAX > 5e5 && N_MAX < 2e6 && Math.abs(SIGMA_MAX - 0.94942901) < 1e-6,
  },
  {
    // The exact change of variable is valid: N = e^{v_max}(v_max-1) round-trips N_max to ~1e-12 or better.
    id: 'imp35495-exact-change-of-variable',
    description: 'N = e^v(v-1) reproduces N_max to ~1e-12 (validates v = ln(T0/2pi) substitution)',
    holds: () => REL_N_ROUNDTRIP < 1e-12,
  },
  {
    // Closed-form curvature lands on the raw 6.4319102e-3.
    id: 'imp35495-closed-form-curvature',
    description: 'closed-form symbolic curvature k ~ 6.4319102e-3',
    holds: () => Math.abs(K_CLOSED - 6.4319102e-3) < 5e-7,
  },
  {
    // Analytic stationarity self-check: the symbolic first derivative vanishes at the peak.
    id: 'imp35495-analytic-stationarity',
    description: 'analytic sigma_u at the peak is ~0 (|sigma_u| < 1e-7), confirming the symbolic derivative',
    holds: () => Math.abs(SIGMA_U_AT_PEAK) < 1e-7,
  },
  {
    // Headline cross-check: closed-form agrees with the imp-35470 5-point stencil to < 1e-6 relative (no truncation).
    id: 'imp35495-closed-vs-5pt-agree',
    description: 'closed-form k agrees with the imp-35470 5-point stencil to < 1e-6 relative',
    holds: () => REL_CLOSED_VS_5PT < 1e-6,
  },
  {
    // Honesty on the rounding: the closed-form route confirms the RAW 6.4319e-3, NOT the rounded 6.428e-3 headline.
    id: 'imp35495-confirms-raw-not-rounded',
    description: 'the closed-form k confirms the raw 6.4319e-3, not the rounded 6.428e-3 headline (off ~6e-4)',
    holds: () => REL_FROM_ROUNDED_HEADLINE > 1e-4 && Math.abs(K_CLOSED - 6.43191e-3) < 1e-6,
  },
  {
    // Honesty gate: measurement/derivation only, not rigorous, no QED, no refereed bound is changed, sub-gap imp-35337a named.
    id: 'imp35495-honesty-gate-no-qed',
    description: 'Derivation only: isRigorous false, no QED, no refereed bound is changed, imp-35337a stays OPEN',
    holds: () =>
      IMP35495_SIGMA_PEAK_CURVATURE_CLOSED_FORM.isRigorous === false &&
      /NO QED/.test(IMP35495_SIGMA_PEAK_CURVATURE_CLOSED_FORM.verdict) &&
      /refereed bound is changed/i.test(IMP35495_SIGMA_PEAK_CURVATURE_CLOSED_FORM.verdict) &&
      /imp-35337a/.test(IMP35495_SIGMA_PEAK_CURVATURE_CLOSED_FORM.residual_sub_gap),
  },
];

for (const a of IMP35495_SIGMA_PEAK_CURVATURE_CLOSED_FORM_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35495-sigma-peak-curvature-closed-form assertion failed: ${a.id}`);
  }
}
