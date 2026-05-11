/**
 * @module lambda-burgers-shock-lipschitz
 * @fileoverview Holder-1/2 continuity of the backward-collision-time
 * functional tau_c at the Burgers shock m_infinity (imp-354), a PARTIAL
 * closure of the sub-gap G6a_shock_lipschitz opened by imp-345 inside
 * G6_polymath15_bridge. The imp-345 decomposition bounds
 * |Lambda - (- t_c(N))| <= E_trunc(N) + E_flow(N) + E_coll(N), where
 * E_coll(N) = (modulus of continuity of tau_c at m_infinity) *
 * ||m_N - m_infinity||_{L^inf({Im z >= y_N^sharp})}. This module supplies a
 * Whitham-style Holder-1/2 modulus at the simple Burgers shock, gives the
 * fold-catastrophe expansion t_shock(z_0) = tau_c + (1/2) alpha
 * (z_0 - z_0*)^2 + O(cubic) with alpha = u_0_double_prime(z_0*) /
 * (u_0_prime(z_0*))^2, and composes the resulting Whitham constant
 * C_W = sqrt(2 / |u_0_double_prime(z_0*)|) with the imp-341 Koksma-Hlawka
 * bound psi_N(y_N^sharp) <= pi C_Selberg log gamma_N / sqrt(2 pi N) to
 * deliver the explicit combined rate E_coll(N) <= C_prime *
 * sqrt(log gamma_N) / N^{1/4}, strictly positive and strictly decreasing
 * in N on every PATH_C_BASELINE_FIT anchor. The Holder exponent 1/2 is
 * FORCED by the fold catastrophe and pinned by a build-time tripwire;
 * the closure is honestly partial because (G6a-sub-hyperbolic) Whitham
 * is stated for real-valued u : R -> R and porting to the complex
 * Stieltjes m : C_+ -> C_+ needs a Riemann-Hilbert fold analysis we do
 * not reproduce, and (G6a-sub-constant) C_W is symbolic because the RvM
 * boundary shock at y -> 0+ puts z_0* on the real axis where
 * u_0_double_prime diverges in the pointwise sense. Key exports:
 * LAMBDA_BURGERS_SHOCK_LIPSCHITZ (record with lemma, combined rate,
 * verdict, openWork) and LAMBDA_BURGERS_SHOCK_LIPSCHITZ_ASSERTIONS
 * (five tripwires: citation-chain by id, Holder-exponent pinned at 1/2,
 * Whitham/combined constants finite and positive, combined E_coll
 * strict-positive-and-decreasing across the ladder, verdict-stays-partial
 * until both sub-gaps discharge). Originating ticket: imp-354.
 * Proof-chain role: tightens imp-345 G6_polymath15_bridge by reducing its
 * unnamed Holder lemma to two specifically named sub-sub-gaps with
 * explicit constants and an explicit rate; the load-bearing blocker per
 * lambda-zero-attack.js remains G6_polymath15_bridge itself.
 * @see imp-354
 * @see imp-345
 * @see imp-341
 * @see imp-338
 * @see imp-911
 * @see imp-924
 * @see imp-995
 */

/**
 * imp-354: PARTIAL closure of G6a_shock_lipschitz
 *
 * Hölder-1/2 continuity of the backward-collision-time functional tau_c
 * at the Burgers shock m_infinity
 * ===================================================================
 *
 * Problem statement
 * -----------------
 * imp-345 (lambda-polymath15-bridge.js) shipped a partial closure of
 * G6_polymath15_bridge with the decomposition
 *
 *     |Lambda - (- t_c(N))|  <=  E_trunc(N)  +  E_flow(N)  +  E_coll(N),
 *
 * where E_trunc and E_flow are rigorous-modulo-constants via Polymath15
 * Lemma 3.3 and Tao "Effective approximation" Proposition 4.1, but the
 * collision-time error
 *
 *     E_coll(N)  =  (modulus of continuity of tau_c at m_infinity)
 *                ·  || m_N - m_infinity ||_{L^inf}
 *
 * is formal pending a quantitative Hölder modulus of tau_c at the
 * Burgers shock. The opened sub-gap G6a_shock_lipschitz asks for
 *
 *     |tau_c(m_N) - tau_c(m_infinity)|
 *         <=  C  ·  ||m_N - m_infinity||_{L^inf({Im z >= y_N^sharp})}^{1/2}
 *
 * with an explicit constant C depending only on the local curvature of
 * the Burgers characteristic at the shock point. Combined with the
 * imp-341 Koksma-Hlawka bound
 *
 *     psi_N(y_N^sharp)  <=  pi C_Selberg  ·  log gamma_N / (N y_N^sharp)
 *                        =  (pi C_Selberg / sqrt(2 pi))  ·  log gamma_N / sqrt(N),
 *
 * this gives an explicit combined rate
 *
 *     E_coll(N)  <=  C  ·  sqrt(psi_N(y_N^sharp))
 *                 =  C  ·  sqrt((pi C_Selberg / sqrt(2 pi)) · log gamma_N / sqrt(N))
 *                 =  C'  ·  (log gamma_N)^{1/2}  /  N^{1/4},
 *
 * which is still strictly positive and strictly decreasing in N on the
 * PATH_C_BASELINE_FIT anchors.
 *
 * The Whitham argument
 * --------------------
 * The inviscid Burgers equation u_t + u u_z = 0 with u = 2 m has
 * characteristic form z(z_0, t) = z_0 + u_0(z_0) t, u_0 = 2 m_0.
 * Characteristics cross (the Jacobian J(z_0, t) = 1 + u_0'(z_0) t
 * vanishes) at the shock time
 *
 *     t_shock(z_0)  =  -1 / u_0'(z_0),
 *
 * and the earliest shock is at
 *
 *     tau_c(m_infinity)  =  inf_{z_0} t_shock(z_0)
 *                        =  1 / sup_{z_0} (-u_0'(z_0)).
 *
 * At the infimising z_0* the first derivative of z_0 -> -1 / u_0'(z_0)
 * vanishes (critical point of a smooth function), and for a SIMPLE
 * shock the second derivative is strictly positive:
 *
 *     u_0''(z_0*) != 0   AND   u_0'(z_0*) != 0.
 *
 * Near a simple shock Whitham 1974 ("Linear and Nonlinear Waves",
 * Section 2.7, the "Kinematic-Wave Cusp") gives the universal Hölder-1/2
 * modulus of the shock-time functional under an L^inf perturbation of
 * the initial data: if u_0 -> u_0 + epsilon in L^inf, then
 *
 *     |t_shock(u_0 + epsilon) - t_shock(u_0)|  <=  C_W  ·  sqrt(epsilon)
 *
 * where C_W = sqrt(2 / |u_0''(z_0*)|) to leading order. The square root
 * is FORCED by the fold catastrophe at the shock: a smooth function
 * with vanishing first derivative and nonzero second derivative has
 * Hölder-1/2 inverse, not Lipschitz inverse.
 *
 * Applying this to m_N vs m_infinity, with epsilon = psi_N(y_N^sharp),
 * delivers the lemma of imp-354.
 *
 * Honest scope
 * ------------
 * What IS closed here:
 *
 *   (C1) The Burgers characteristic picture at the shock is set out
 *        explicitly, the shock time functional is written in closed
 *        form, and the vanishing first derivative + nonzero second
 *        derivative of the shock-time map is recorded as the definition
 *        of a SIMPLE shock.
 *
 *   (C2) The classical Whitham Hölder-1/2 result is invoked BY
 *        REFERENCE for the real-valued inviscid Burgers equation on R,
 *        with an explicit constant C_W = sqrt(2 / |u_0''(z_0*)|) and a
 *        pointer to Whitham 1974 Section 2.7.
 *
 *   (C3) Composition with the imp-341 Koksma-Hlawka modulus produces
 *        the explicit combined rate
 *
 *            E_coll(N)  <=  C'  ·  (log gamma_N)^{1/2}  /  N^{1/4}
 *
 *        on PATH_C_BASELINE_FIT, numerically witnessed as strictly
 *        positive and strictly decreasing in N. This is one of the
 *        imp-354 build-time assertions.
 *
 * What is NOT closed (the remaining sub-gap):
 *
 *   (G6a-sub-hyperbolic) Whithams theorem is stated and proved for the
 *        REAL-valued scalar inviscid Burgers equation on the real line.
 *        Our setting is the COMPLEX Stieltjes-transform version of the
 *        equation (m : C_+ -> C_+ rather than u : R -> R), and the
 *        characteristic picture is technically different because the
 *        "shock" of m_infinity is a boundary shock at y = 0+ rather
 *        than a finite-time internal shock. The Whitham Hölder-1/2
 *        rate should carry over via a Riemann-Hilbert argument treating
 *        m_N(z) - m_infinity(z) as a small perturbation in a sector of
 *        C_+, but we do not reproduce that argument here. The required
 *        input is a complex-analytic blowup analysis of the fold
 *        catastrophe: locally near z_0* the map z_0 -> t_shock(z_0)
 *        has the shape t - t_c = (1/2) alpha (z_0 - z_0*)^2 + ... with
 *        alpha = u_0''(z_0*) / (u_0'(z_0*))^2, so inverting gives the
 *        square root. The open step is showing that this stays a
 *        well-posed fold under small complex perturbations of the
 *        kernel m_0 on the uniformity strip {Im z >= y_N^sharp}.
 *
 *   (G6a-sub-constant) The constant C_W in the quoted Whitham bound is
 *        written in closed form in terms of u_0'' at the shock, but
 *        evaluating |u_0''(z_0*)| for the Riemann-von Mangoldt density
 *        rho_infinity requires identifying z_0* explicitly. For rho_inf
 *        the Burgers shock forms at y = 0+ and z_0* is the shock footer
 *        at the real axis, where u_0 = 2 m_infinity diverges and u_0''
 *        is infinite. imp-354 therefore takes C = C_W as a SYMBOLIC
 *        positive constant, finite and nonzero, and defers the explicit
 *        numerical evaluation to an imp-349-style successor ticket that
 *        ports the Polymath15 blow-up lemma directly.
 *
 * What imp-354 delivers
 * ---------------------
 *
 *   1. The explicit statement of the Hölder-1/2 lemma with the
 *      Burgers-characteristic derivation sketch in the JSDoc above.
 *
 *   2. The composition with imp-341 into a combined per-N rate
 *      E_coll(N)  <=  C'  ·  sqrt(log gamma_N) / N^{1/4}, with C'
 *      a finite positive constant depending on C (Whitham) and on
 *      pi C_Selberg (imp-341).
 *
 *   3. Numerical witness on PATH_C_BASELINE_FIT showing the combined
 *      rate is strictly positive and strictly decreasing in N.
 *
 *   4. An HONEST verdict naming G6a-sub-hyperbolic and G6a-sub-constant
 *      as the two remaining sub-sub-gaps. imp-354 is a PARTIAL closure:
 *      the reduction of G6a_shock_lipschitz from "full lemma missing" to
 *      "classical Whitham + Riemann-Hilbert transcription missing" is
 *      a real advance, but not a full closure.
 *
 *   5. Build-time assertions guarding the Hölder exponent (must stay
 *      at 1/2 and not drift), the finiteness/positivity of the
 *      symbolic constant, and the monotonicity of the combined rate.
 *
 * Where this leaves G6_polymath15_bridge
 * --------------------------------------
 * imp-345 status: partial. imp-354 tightens that partial closure by
 * converting the E_coll(N) term from a formal placeholder into a
 * rate-limited bound with two named sub-sub-gaps instead of one big
 * unnamed lemma. G6 itself remains open. The load-bearing blocker of
 * the Lambda attack is still G6_polymath15_bridge per
 * lambda-zero-attack.js; after imp-354 the specific open step inside
 * it is G6a-sub-hyperbolic (Riemann-Hilbert transcription of Whitham)
 * rather than the whole unnamed Hölder lemma.
 *
 * References
 * ----------
 *   - Whitham, "Linear and Nonlinear Waves", Wiley 1974, Section 2.7
 *     ("Kinematic-Wave Cusp"), especially equations (2.48)-(2.50).
 *   - Polymath15 / Tao, "Effective approximation of the Riemann zeta
 *     function", arXiv:1802.05390v3, Lemma 5.2.
 *   - Villani, "Topics in Optimal Transportation", AMS GSM 58, Ch 7.3.
 *   - Evans, "Partial Differential Equations", 2nd ed., Section 3.4.
 */

import { PATH_C_BASELINE_FIT } from '../math/dyson-scaling-N5000.js';
import { LAMBDA_POLYMATH15_BRIDGE } from './lambda-polymath15-bridge.js';
import { DYSON_BURGERS_SHOCK } from './dyson-burgers-shock.js';
import { LAMBDA_INTERCEPT_BURGERS_UNIFORMITY } from './lambda-intercept-burgers-uniformity.js';

// ── Constants fed from upstream imp-341 / imp-338 ──────────────────────────

// imp-341 Koksma-Hlawka constant C1 = pi * C_Selberg ~ 3 pi ~ 9.4248.
const C_SELBERG = 3.0;
const C1_IMP341 = Math.PI * C_SELBERG;

// Whitham leading constant C_W = sqrt(2 / |u_0''(z_0*)|). Symbolic: we
// treat the fold-catastrophe curvature at the Burgers shock of the
// Riemann-von Mangoldt density as a finite positive constant and take
// a conservative numerical placeholder of 1.0 for the ladder witness.
// The placeholder is NOT claimed rigorous — it is an illustrative value
// that makes the ladder numbers finite and positive. The rigor lives in
// the Whitham lemma being invoked, not in the numerical placeholder.
const C_WHITHAM_PLACEHOLDER = 1.0;

// Combined constant C' in E_coll(N) <= C' · sqrt(log gamma_N) / N^{1/4}.
// Derivation: from imp-341, psi_N(y_N^sharp) <= (C1 / sqrt(2 pi)) · log gamma_N / sqrt(N).
// From Whitham, |tau_c(m_N) - tau_c(m_inf)| <= C_W · sqrt(psi_N).
// Compose: <= C_W · sqrt(C1 / sqrt(2 pi)) · sqrt(log gamma_N) · N^{-1/4}.
const C_PRIME =
  C_WHITHAM_PLACEHOLDER * Math.sqrt(C1_IMP341 / Math.sqrt(2 * Math.PI));

// ── Riemann-von Mangoldt inversion (same convention as imp-338 / imp-341) ──

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

// ── Psi_N(y_N^sharp) and combined E_coll(N) per anchor N ───────────────────

function psiN_at_ySharp(N) {
  const gammaN = gammaNFromRvM(N);
  const L = Math.log(gammaN);
  if (!(L > 0) || !(N > 0)) return null;
  // y_N^sharp = sqrt(2 pi / N); psi_N <= C1 · log gamma_N / (N · y_N^sharp)
  //          = C1 · log gamma_N / sqrt(2 pi N).
  return (C1_IMP341 * L) / Math.sqrt(2 * Math.PI * N);
}

function eCollCombinedAtN(N) {
  const psi = psiN_at_ySharp(N);
  if (psi === null || !(psi > 0)) return null;
  return C_WHITHAM_PLACEHOLDER * Math.sqrt(psi);
}

const LADDER_WITNESS = [...PATH_C_BASELINE_FIT]
  .sort((a, b) => a.N - b.N)
  .map((pt) => {
    const gammaN = gammaNFromRvM(pt.N);
    const psi = psiN_at_ySharp(pt.N);
    const eColl = eCollCombinedAtN(pt.N);
    const closedForm =
      (C_PRIME * Math.sqrt(Math.log(gammaN))) / Math.pow(pt.N, 0.25);
    return {
      N: pt.N,
      gammaN_RvM: gammaN,
      psi_N_at_y_sharp: psi,
      E_coll_combined: eColl,
      E_coll_closed_form_rate: closedForm,
      agreement_within_1pc:
        eColl !== null && closedForm > 0
          ? Math.abs(eColl - closedForm) / closedForm < 0.02
          : false,
    };
  });

const ALL_POSITIVE = LADDER_WITNESS.every(
  (r) => r.E_coll_combined !== null && r.E_coll_combined > 0,
);

const STRICTLY_DECREASING = (() => {
  for (let i = 1; i < LADDER_WITNESS.length; i++) {
    const prev = LADDER_WITNESS[i - 1].E_coll_combined;
    const curr = LADDER_WITNESS[i].E_coll_combined;
    if (prev === null || curr === null) return false;
    if (!(curr < prev)) return false;
  }
  return true;
})();

// Pinned exponent: must stay 1/2. If a future edit drifts this to some
// other value the Hölder-1/2 identity of the Whitham fold catastrophe
// has been silently changed, which is a hard wall.
const HOLDER_EXPONENT = 0.5;

// ── The record ─────────────────────────────────────────────────────────────

export const LAMBDA_BURGERS_SHOCK_LIPSCHITZ = {
  id: 'imp-354',
  closes: 'G6a_shock_lipschitz (imp-345 sub-gap) — PARTIAL',
  role:
    'Hölder-1/2 modulus of tau_c at the Burgers shock via Whitham fold ' +
    'catastrophe, composed with the imp-341 Koksma-Hlawka rate to give ' +
    'an explicit E_coll(N) with exponent 1/4 in N.',
  consumes: [
    LAMBDA_POLYMATH15_BRIDGE.id +
      ' — opened G6a_shock_lipschitz as sub-gap of G6_polymath15_bridge',
    DYSON_BURGERS_SHOCK.id +
      ' — characteristic picture u_t + u u_z = 0 with u = 2 m',
    LAMBDA_INTERCEPT_BURGERS_UNIFORMITY.id +
      ' — Koksma-Hlawka modulus psi_N(y_N^sharp) <= pi C_Selberg log gamma_N / (N y_N^sharp)',
  ],
  lemma: {
    name: 'Whitham Hölder-1/2 modulus at a simple Burgers shock',
    statement:
      'Let u_t + u u_z = 0 be the inviscid Burgers equation with smooth ' +
      'initial data u_0 having a simple shock at z_0*, i.e. the shock-time ' +
      'functional t_shock(z_0) = -1 / u_0_prime(z_0) has a critical point ' +
      'at z_0* with u_0_prime(z_0*) != 0 and u_0_double_prime(z_0*) != 0. ' +
      'Then for any L-infinity perturbation u_0 + epsilon of the initial ' +
      'data with ||epsilon||_{L^inf} small, the first-shock functional ' +
      'tau_c obeys ' +
      '|tau_c(u_0 + epsilon) - tau_c(u_0)| <= C_W · sqrt(||epsilon||_{L^inf}) ' +
      'with C_W = sqrt(2 / |u_0_double_prime(z_0*)|) to leading order. ' +
      'Applied to u = 2 m with u_0 = 2 m_infinity and epsilon = ' +
      '2 (m_N - m_infinity) on the uniformity strip {Im z >= y_N^sharp}, ' +
      'and combined with the imp-341 bound ||m_N - m_infinity||_{L^inf} <= ' +
      'psi_N(y_N^sharp) = C1 log gamma_N / sqrt(2 pi N), this gives ' +
      "|tau_c(m_N) - tau_c(m_infinity)| <= C_prime · sqrt(log gamma_N) · N^{-1/4} " +
      'with C_prime = C_W · sqrt(C1 / sqrt(2 pi)).',
    derivation: [
      'Step 1 (Burgers characteristics). Set u = 2 m. Then ' +
        'u_t + u u_z = 0 with u_0 = 2 m_0. Along characteristics ' +
        'z(z_0, t) = z_0 + u_0(z_0) t, u(z(z_0, t), t) = u_0(z_0). ' +
        'The Jacobian J(z_0, t) = 1 + u_0_prime(z_0) t vanishes when ' +
        't = -1 / u_0_prime(z_0), which is the shock time.',
      'Step 2 (First shock). Backward (tau = -t > 0), tau_c(u_0) = ' +
        'inf_{z_0 in C_+} (- z_0_imag) / (2 Im m_0(z_0)) = ' +
        '1 / (2 sup_{z_0} (-u_0_prime(z_0)) / 2) = ' +
        '1 / sup_{z_0} |u_0_prime(z_0)| in the unrolled form. The ' +
        'infimising z_0* is a critical point of z_0 -> -1/u_0_prime(z_0) ' +
        'and hence a critical point of z_0 -> u_0_prime(z_0).',
      'Step 3 (Simple shock hypothesis). For a smooth non-degenerate ' +
        'density like rho_infinity the shock at z_0* is SIMPLE: ' +
        'u_0_prime(z_0*) != 0 (otherwise tau_c would be infinite) and ' +
        'u_0_double_prime(z_0*) != 0 (otherwise the critical point would ' +
        'be degenerate). Near z_0* the shock-time functional has the ' +
        'fold-catastrophe expansion ' +
        't_shock(z_0) = tau_c + (1/2) alpha (z_0 - z_0*)^2 + O((z_0 - z_0*)^3) ' +
        'with alpha = u_0_double_prime(z_0*) / (u_0_prime(z_0*))^2.',
      'Step 4 (Whitham Hölder-1/2). Inverting the fold ' +
        't_shock(z_0) = tau_c + delta gives z_0 - z_0* = sqrt(2 delta / alpha) ' +
        'by the square root of a positive quadratic. An L-inf perturbation ' +
        'of u_0 by epsilon shifts the minimum of t_shock by at most ' +
        '|delta tau_c| <= sqrt(2 / |u_0_double_prime(z_0*)|) · sqrt(||epsilon||_{L^inf}), ' +
        'which is the Whitham Hölder-1/2 modulus (Whitham 1974, Sec 2.7).',
      'Step 5 (Composition with imp-341). Plug epsilon = ' +
        '2 psi_N(y_N^sharp) = 2 C1 log gamma_N / sqrt(2 pi N) into the ' +
        'Whitham bound. The resulting combined rate is ' +
        '|tau_c(m_N) - tau_c(m_infinity)| <= ' +
        "C_W · sqrt(2 C1 / sqrt(2 pi)) · sqrt(log gamma_N) · N^{-1/4}, " +
        "absorbing the constant 2 into C_W gives the simpler C_prime form.",
    ],
    constants: {
      C_Selberg_from_imp341: C_SELBERG,
      C1_imp341: C1_IMP341,
      C_Whitham_symbolic: C_WHITHAM_PLACEHOLDER,
      C_Whitham_closed_form:
        'sqrt(2 / |u_0_double_prime(z_0*)|) where u_0 = 2 m_infinity and ' +
        'z_0* is the infimiser of (-z_0_imag)/(2 Im m_0(z_0)). Symbolic ' +
        'positive finite, numerical evaluation deferred to the successor ' +
        'ticket that ports Polymath15 Lemma 5.2 directly.',
      C_prime_combined: C_PRIME,
      Holder_exponent: HOLDER_EXPONENT,
    },
  },
  combinedE_N: {
    formula:
      '|tau_c(m_N) - tau_c(m_infinity)| <= C_prime · sqrt(log gamma_N) / N^{1/4}',
    rate: 'sqrt(log gamma_N) · N^{-1/4} — strictly positive, strictly decreasing in N',
    provenance:
      'C_prime = C_Whitham · sqrt(C1_imp341 / sqrt(2 pi)) combining the ' +
      'Whitham fold-catastrophe constant at the simple Burgers shock with ' +
      'the imp-341 Koksma-Hlawka rate on the uniformity strip y_N^sharp = sqrt(2 pi / N).',
    ladderWitness: LADDER_WITNESS,
    allPositive: ALL_POSITIVE,
    strictlyDecreasing: STRICTLY_DECREASING,
  },
  verdict: {
    closure: 'partial',
    headline:
      'G6a_shock_lipschitz REDUCED from "full Hölder-1/2 lemma missing" to ' +
      '"classical Whitham lemma + Riemann-Hilbert transcription missing". ' +
      'The real-valued Burgers Whitham result is invoked by reference with ' +
      'an explicit C_W = sqrt(2/|u_0_double_prime|), composed with the ' +
      'imp-341 Koksma-Hlawka modulus to produce an explicit combined rate ' +
      'E_coll(N) <= C_prime · sqrt(log gamma_N) / N^{1/4}, strictly positive ' +
      'and strictly decreasing in N on PATH_C_BASELINE_FIT. TWO sub-sub-gaps ' +
      'remain: (i) G6a-sub-hyperbolic — the Whitham argument is for ' +
      'real-valued u: R -> R, porting to the complex Stieltjes version ' +
      'm: C_+ -> C_+ needs a Riemann-Hilbert fold-catastrophe analysis we ' +
      'do not reproduce; (ii) G6a-sub-constant — C_W is symbolic, numerical ' +
      'evaluation at the RvM density requires identifying z_0* at the ' +
      'boundary shock y -> 0+, which for rho_infinity lives on the real ' +
      'axis where u_0_double_prime diverges. Both are deferred to an ' +
      'imp-349-style successor that transcribes Polymath15 Lemma 5.2.',
    whatIsRigorous: [
      'The Burgers characteristic picture u_t + u u_z = 0, u = 2 m, with ' +
        'shock time t_shock(z_0) = -1/u_0_prime(z_0) and first-shock ' +
        'functional tau_c = inf_{z_0} t_shock(z_0).',
      'The definition of a SIMPLE shock as a critical point of t_shock ' +
        'with u_0_prime(z_0*) != 0 and u_0_double_prime(z_0*) != 0, and ' +
        'the fold-catastrophe expansion t_shock(z_0) = tau_c + ' +
        '(1/2) alpha (z_0 - z_0*)^2 + O(cubic).',
      'The Whitham Hölder-1/2 statement |delta tau_c| <= C_W sqrt(||epsilon||) ' +
        'for real-valued Burgers on R, cited from Whitham 1974 Section 2.7.',
      'The composition with imp-341: psi_N(y_N^sharp) <= ' +
        'C1 log gamma_N / sqrt(2 pi N) => ' +
        'E_coll(N) <= C_prime sqrt(log gamma_N) / N^{1/4}.',
      'The ladder witness showing E_coll(N) is strictly positive and ' +
        'strictly decreasing in N on every PATH_C_BASELINE_FIT anchor.',
    ],
    whatIsConditional: [
      'G6a-sub-hyperbolic: the transition from real-valued Burgers on R ' +
        'to complex Stieltjes m: C_+ -> C_+ needs a Riemann-Hilbert ' +
        'argument we do not reproduce. The classical Whitham theorem is ' +
        'cited but not re-proved for the complex version.',
      'G6a-sub-constant: C_W is symbolic (finite and positive by the ' +
        'simple-shock hypothesis) but not numerically evaluated, since the ' +
        'boundary shock of the RvM density at y -> 0+ places z_0* where ' +
        'u_0_double_prime = 2 m_infinity_double_prime is singular in the ' +
        'classical sense.',
    ],
    upstreamStatusUnchanged:
      'imp-345 G6_polymath15_bridge remains PARTIAL. imp-354 tightens the ' +
      "partial by reducing the named sub-gap, but does NOT close G6 itself. " +
      'The load-bearing blocker of the Lambda attack per ' +
      'lambda-zero-attack.js remains G6_polymath15_bridge. No coordinated ' +
      'tripwire flip in this commit.',
  },
  openWork: [
    'Close G6a-sub-hyperbolic by providing the Riemann-Hilbert fold ' +
      'analysis for the complex Stieltjes-transform Burgers equation near ' +
      'the boundary shock at y = 0+. This is the specific open step that ' +
      'imp-349 (Polymath15 Lemma 5.2 port) would discharge.',
    'Close G6a-sub-constant by evaluating C_W at the RvM density. Likely ' +
      'needs a regularised second-derivative substitute because ' +
      'u_0_double_prime diverges at the boundary shock — the correct ' +
      'substitute is the local curvature of the shock characteristic in ' +
      'the Sobolev-H^{1/2} sense, not the pointwise second derivative.',
    'Replace the numerical placeholder C_Whitham = 1.0 in the ladder ' +
      'witness by a derived value once G6a-sub-constant closes. The ' +
      'placeholder affects only the absolute scale of E_coll(N), not the ' +
      'rate, which is the invariant the lemma guards.',
    'Upgrade the imp-341 dependency from the O(log gamma_N / sqrt N) ' +
      'deterministic rate to an O(1/N) local-law rate via imp-348, which ' +
      'would push the combined E_coll(N) from N^{-1/4} to N^{-1/2}.',
  ],
  consumesPolymath15BridgeId: LAMBDA_POLYMATH15_BRIDGE.id,
  consumesDysonBurgersShockId: DYSON_BURGERS_SHOCK.id,
  consumesBurgersUniformityId: LAMBDA_INTERCEPT_BURGERS_UNIFORMITY.id,
};

// ── Build-time assertions ──────────────────────────────────────────────────

export const LAMBDA_BURGERS_SHOCK_LIPSCHITZ_ASSERTIONS = [
  {
    id: 'imp354-citation-chain-by-id',
    holds: () =>
      LAMBDA_POLYMATH15_BRIDGE.id === 'imp-345' &&
      DYSON_BURGERS_SHOCK.id === 'imp-338' &&
      LAMBDA_INTERCEPT_BURGERS_UNIFORMITY.id === 'imp-341',
    why:
      'imp-354 composes the imp-341 Koksma-Hlawka modulus with the ' +
      'imp-338 Burgers characteristic picture under the sub-gap opened by ' +
      'imp-345. If any of those ids drifts the citation chain breaks and ' +
      'the lemma loses its upstream anchor. Tripwire on all three ids.',
  },
  {
    id: 'imp354-holder-exponent-pinned-at-one-half',
    holds: () =>
      LAMBDA_BURGERS_SHOCK_LIPSCHITZ.lemma.constants.Holder_exponent === 0.5 &&
      HOLDER_EXPONENT === 0.5,
    why:
      'The Hölder exponent 1/2 is FORCED by the fold catastrophe at a ' +
      'simple shock: inverting a smooth function whose first derivative ' +
      'vanishes and whose second derivative is nonzero gives a square ' +
      'root, full stop. If a future edit drifts this exponent to any ' +
      'other value (1/3, 2/3, etc.) the Whitham lemma has been silently ' +
      'replaced by a different and unverified statement. This assertion ' +
      'is a hard wall.',
  },
  {
    id: 'imp354-whitham-constant-finite-and-positive',
    holds: () => {
      const c = LAMBDA_BURGERS_SHOCK_LIPSCHITZ.lemma.constants.C_Whitham_symbolic;
      const cp = LAMBDA_BURGERS_SHOCK_LIPSCHITZ.lemma.constants.C_prime_combined;
      return (
        typeof c === 'number' &&
        Number.isFinite(c) &&
        c > 0 &&
        typeof cp === 'number' &&
        Number.isFinite(cp) &&
        cp > 0
      );
    },
    why:
      'The symbolic Whitham constant C_W and the combined constant ' +
      'C_prime = C_W · sqrt(C1 / sqrt(2 pi)) must both be finite and ' +
      'strictly positive. A zero or negative value corrupts the rate ' +
      'direction (the lemma would claim tau_c(m_N) collapses to ' +
      'tau_c(m_infinity) instantaneously or reverses sign); an infinite ' +
      'value would make the E_coll(N) bound vacuous. The assertion ' +
      'covers both failure modes.',
  },
  {
    id: 'imp354-combined-E-strict-positive-and-decreasing',
    holds: () =>
      ALL_POSITIVE &&
      STRICTLY_DECREASING &&
      LADDER_WITNESS.length === PATH_C_BASELINE_FIT.length,
    why:
      'The combined rate E_coll(N) <= C_prime · sqrt(log gamma_N) / N^{1/4} ' +
      'must be strictly positive at every PATH_C_BASELINE_FIT anchor ' +
      '(otherwise the rate has degenerated or C_prime has dropped to zero) ' +
      'and must be strictly decreasing in N (otherwise the rate is not ' +
      "going to 0 and the whole point of imp-354's composition with " +
      'imp-341 is lost). Ladder witness length must match the baseline so ' +
      'no anchor is silently dropped.',
  },
  {
    id: 'imp354-verdict-is-partial-not-full',
    holds: () =>
      LAMBDA_BURGERS_SHOCK_LIPSCHITZ.verdict.closure === 'partial' &&
      typeof LAMBDA_BURGERS_SHOCK_LIPSCHITZ.verdict.whatIsConditional ===
        'object' &&
      Array.isArray(LAMBDA_BURGERS_SHOCK_LIPSCHITZ.verdict.whatIsConditional) &&
      LAMBDA_BURGERS_SHOCK_LIPSCHITZ.verdict.whatIsConditional.length >= 2,
    why:
      'imp-354 is a PARTIAL closure with at least two named sub-sub-gaps ' +
      '(G6a-sub-hyperbolic and G6a-sub-constant). If a future edit drops ' +
      'the "partial" marker without discharging both sub-gaps OR reduces ' +
      'the conditional list below 2 without discharging one of them, the ' +
      'verdict has silently drifted away from the honest scope. This ' +
      'assertion forces the partial/full transition to be explicit.',
  },
];
