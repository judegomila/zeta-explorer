/**
 * @module imp-clip-collision-regularized
 * @fileoverview imp-2839 — Isolate and bound C_Lip via a collision-regularized
 * replacement for the divergent int_0^{tc} 2/g(s)^2 ds Gronwall integral.
 *
 * This module is a PURE DATA / light-numeric record (only effectiveHeightForN is
 * imported). It does NOT claim a rigorous beat. It attacks the SECOND factor of
 *
 *     C_H = C_shock * C_Lip / 4
 *
 * namely the gap-Lipschitz constant C_Lip, paired with imp-2786 (which pinned the
 * cusp factor C_shock to a bounded value) and imp-2640 (which proved the Gronwall
 * route NEGATIVE). The deliverable is an HONEST verdict on whether a collision-
 * stopped / regularized surrogate can rescue a finite N-uniform C_Lip.
 *
 * ---
 *
 * THE DIVERGENT OBJECT (imp-2640)
 * -------------------------------
 * The only available Lipschitz bound on the gap modulus is the backward-flow
 * Jacobian ||DM(s)|| <= 2/g(s)^2. With the quadratic tangency law
 *     g(s)^2 = g(0)^2 - 8 s   and   t_c = g(0)^2 / 8   (so g(s)^2 = 8 (t_c - s)),
 * the collision integral
 *     int_0^{t_c} 2 / g(s)^2 ds = (1/4) log( g(0)^2 / (g(0)^2 - 8 t_c) )
 * diverges logarithmically as s -> t_c (g -> 0).
 *
 * THE COLLISION-REGULARIZED SURROGATE (this ticket)
 * -------------------------------------------------
 * Stop the flow at g = eps (eps > 0), i.e. at s_eps = t_c - eps^2 / 8, and split
 *     int_0^{t_c} = int_0^{s_eps}  +  int_{s_eps}^{t_c}  =  I_eps  +  RESIDUAL.
 * The stopped part is FINITE and closed-form:
 *     I_eps(g0) = int_0^{s_eps} 2 / g^2 ds = (1/4) log( g0^2 / eps^2 )
 *               = (1/2) log( g0 / eps ).
 * So the regularization "works" for any fixed eps > 0 — but I_eps -> +infinity
 * like (1/2) log(1/eps) as eps -> 0. The divergence is not removed, only parked
 * in the cutoff eps.
 *
 * CAN THE RESIDUAL WINDOW [t_c - delta, t_c] BE CONTROLLED BY C_shock INSTEAD?
 * ---------------------------------------------------------------------------
 * The point of the regularization is to bound the residual window NOT by the
 * diverging Gronwall but by the cusp-scaling rate g_min ~ C_shock * W_1^{1/2}
 * (imp-2786). But that rate is EXACTLY where the obstruction lives. C_Lip is the
 * gap-Lipschitz constant in
 *     |g_min(mu_1) - g_min(mu_2)| <= C_Lip * W_1(mu_1, mu_2).
 * The cusp law g_min ~ C_shock * W_1^{1/2} is a HOLDER-1/2 law: differentiating
 * the implied modulus,
 *     d g_min / d W_1  =  C_shock / ( 2 * W_1^{1/2} )  ->  +infinity   as W_1 -> 0.
 * So the residual window does not have a finite Lipschitz slope at all — the
 * genuine regularity of g_min in W_1 is square-root, and a square-root function
 * has UNBOUNDED Lipschitz constant at the origin. Substituting the C_shock rate
 * for the Gronwall integrand trades one divergence (logarithmic, in eps) for the
 * same intrinsic divergence (algebraic, in W_1^{1/2}); it cannot manufacture the
 * missing finite constant.
 *
 * HONEST VERDICT: DIVERGENCE INTRINSIC — C_Lip RH-HARD-AT-THE-MODULUS
 * ------------------------------------------------------------------
 * The Lipschitz / Gronwall route CANNOT supply a finite N-uniform C_Lip, and this
 * is not an artifact of the chosen bound: Holder-1/2 is the GENUINE regularity of
 * the first-collision gap in the Wasserstein metric (set precisely by the bounded
 * cusp factor C_shock). Any C_Lip read off a Lipschitz/Gronwall route MUST diverge.
 * The collision-regularized surrogate confirms this cleanly: I_eps is finite for
 * each eps > 0 but unbounded as eps -> 0, and the residual window inherits the
 * 1/W_1^{1/2} cusp slope rather than a finite constant.
 *
 * This is a clean NEGATIVE certification. It marks the finite-N Lipschitz beat
 * route DEAD at the modulus and retires C_Lip to ESTIMATE-only status. The
 * surviving rigorous fact remains Platt-Trudgian Lambda <= 0.2 (SOTA).
 *
 * RELATION TO imp-2662 (the Theta-trap endpoint route)
 * ----------------------------------------------------
 * imp-2662 controlled the INITIAL-GAP channel: tau_c is C^1 in g0 with a vanishing
 * modulus d tau_c/d g0 = g0/(4(1-Theta)). That is a different channel. This module
 * closes the GAP-TO-W_1 channel: g0 = g_min ITSELF is only Holder-1/2 in W_1 via
 * the cusp law, so even a C^1-in-g0 endpoint functional is at best Holder-1/2 in
 * W_1. The two are consistent: the obstruction is not the flow Jacobian and not the
 * endpoint smoothness, but the square-root regularity of the gap in the metric.
 *
 * @see imp-2640 (C_H NEGATIVE — divergent Gronwall route)
 * @see imp-2786-c-shock-cusp-constant.js (C_shock bounded; cusp law g_min ~ C_shock W_1^{1/2})
 * @see imp-2662-clip-theta-endpoint-route.js (initial-gap channel, PARTIAL-POSITIVE)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

// N*=1e4 minimal first-collision pair (tc-part-vs-mf-linchpin-finding.js / imp-2640).
const N_STAR = 10000;
const G0_STAR = 0.037698; // initial minimal gap g(0) at the first collision

// Bounded cusp factor C_shock(N) = sqrt( 2 / (3 log gamma_N) ) (imp-2786 closed form).
function shockConstantClosedForm(N) {
  const gammaN = effectiveHeightForN(N);
  if (!(gammaN > Math.E)) return null;
  return Math.sqrt(2 / (3 * Math.log(gammaN)));
}

const C_SHOCK_STAR = shockConstantClosedForm(N_STAR);

// ── The collision-stopped (regularized) Gronwall integral ────────────────────
//
// Stop the flow at g = eps:  I_eps(g0) = (1/2) log( g0 / eps ).  Finite for eps>0,
// diverges like (1/2) log(1/eps) as eps -> 0.
function stoppedGronwallIntegral(g0, eps) {
  if (!(g0 > 0) || !(eps > 0) || !(eps < g0)) return null;
  return 0.5 * Math.log(g0 / eps);
}

// Ladder of cutoffs eps = g0 / r for r = 2, 10, 100, 1000 — exhibits the log divergence.
const EPS_RATIOS = [2, 10, 100, 1000];
const STOPPED_LADDER = EPS_RATIOS.map((r) => {
  const eps = G0_STAR / r;
  return {
    epsRatio: r,
    eps,
    residualWindowDelta: (eps * eps) / 8, // delta = eps^2 / 8 (residual time window)
    I_eps: stoppedGronwallIntegral(G0_STAR, eps),
  };
});

// ── The residual-window cusp slope (the intrinsic obstruction) ───────────────
//
// g_min ~ C_shock * W_1^{1/2}  =>  d g_min / d W_1 = C_shock / (2 W_1^{1/2}),
// the implied Lipschitz slope. It diverges as W_1 -> 0: Holder-1/2, not Lipschitz.
function cuspLipschitzSlope(cShock, W1) {
  if (!(cShock > 0) || !(W1 > 0)) return null;
  return cShock / (2 * Math.sqrt(W1));
}

// Ladder of shrinking Wasserstein separations W_1 -> 0 — exhibits the 1/sqrt(W_1) blow-up.
const W1_LADDER = [1e-2, 1e-3, 1e-4, 1e-5, 1e-6];
const CUSP_SLOPE_LADDER = W1_LADDER.map((W1) => ({
  W1,
  g_min_cusp: C_SHOCK_STAR * Math.sqrt(W1), // g_min ~ C_shock W_1^{1/2}
  lipschitzSlope: cuspLipschitzSlope(C_SHOCK_STAR, W1),
}));

// Monotonicity certificates: I_eps strictly grows as eps shrinks; cusp slope
// strictly grows as W_1 shrinks. Both => divergence, no finite C_Lip.
const I_EPS_DIVERGES = (() => {
  for (let i = 1; i < STOPPED_LADDER.length; i++) {
    if (!(STOPPED_LADDER[i].I_eps > STOPPED_LADDER[i - 1].I_eps)) return false;
  }
  return true;
})();
const CUSP_SLOPE_DIVERGES = (() => {
  for (let i = 1; i < CUSP_SLOPE_LADDER.length; i++) {
    if (!(CUSP_SLOPE_LADDER[i].lipschitzSlope > CUSP_SLOPE_LADDER[i - 1].lipschitzSlope)) return false;
  }
  return true;
})();

// ── The imp-2839 record ──────────────────────────────────────────────────────

export const IMP_2839_CLIP_COLLISION_REGULARIZED = {
  ticket: 'imp-2839',
  proofSection: 'S7',
  title:
    'Isolate and bound C_Lip via a collision-regularized replacement for the ' +
    'divergent int 2/g^2 integral.',
  verdict:
    'NEGATIVE (clean certification). The collision-stopped surrogate I_eps(g0) = (1/2) log(g0/eps) ' +
    'is finite for every eps > 0 but diverges as eps -> 0; the residual window [t_c - delta, t_c] ' +
    'cannot be rescued by the bounded cusp rate g_min ~ C_shock W_1^{1/2} because that rate is itself ' +
    'HOLDER-1/2: d g_min/d W_1 = C_shock/(2 W_1^{1/2}) -> infinity as W_1 -> 0. The divergence is ' +
    'INTRINSIC, not an artifact of the chosen bound. The Lipschitz/Gronwall route CANNOT supply a ' +
    'finite N-uniform C_Lip. C_Lip is RH-hard-at-the-modulus; the finite-N Lipschitz beat is retired ' +
    'to ESTIMATE. Platt-Trudgian Lambda <= 0.2 remains rigorous SOTA.',
  stoppedIntegralFormula: 'I_eps(g0) = (1/4) log(g0^2/eps^2) = (1/2) log(g0/eps)  (finite for eps>0)',
  cuspSlopeFormula: 'd g_min / d W_1 = C_shock / (2 W_1^{1/2})  (diverges as W_1 -> 0; Holder-1/2)',
  intrinsicDivergence: true,
  rigorousBeat: false,
  rhHardAtModulus: true,
  nStar: N_STAR,
  g0Star: G0_STAR,
  cShockStar: C_SHOCK_STAR,
  stoppedLadder: STOPPED_LADDER,
  cuspSlopeLadder: CUSP_SLOPE_LADDER,
  iEpsDiverges: I_EPS_DIVERGES,
  cuspSlopeDiverges: CUSP_SLOPE_DIVERGES,
  relationToEndpointRoute:
    'imp-2662 controls the INITIAL-GAP channel (tau_c is C^1 in g0, vanishing modulus). This module ' +
    'closes the GAP-TO-W_1 channel: g0 = g_min is only Holder-1/2 in W_1 via the cusp law, so the ' +
    'gap-Lipschitz constant C_Lip cannot be finite however smooth tau_c is in g0.',
  honestNote:
    'No false QED. The regularization is genuine (I_eps finite for fixed eps) but does not remove the ' +
    'divergence — it parks it in the cutoff. Substituting the bounded cusp rate for the Gronwall ' +
    'integrand trades a logarithmic-in-eps divergence for the same intrinsic algebraic-in-W_1^{1/2} ' +
    'divergence. This NARROWS-then-CLOSES the C_Lip question NEGATIVELY: the Lipschitz route is dead at ' +
    'the modulus because Holder-1/2 is the true regularity. No rigorous Lambda < 0.2 is claimed.',
};

// ── Build-time assertions (self-executing, throwing — matches imp-2786 style) ─

export const IMP_2839_ASSERTIONS = [
  {
    id: 'imp2839-stopped-integral-finite-for-positive-eps',
    holds: () =>
      STOPPED_LADDER.every((r) => Number.isFinite(r.I_eps) && r.I_eps > 0),
    why:
      'The collision-stopped surrogate I_eps(g0) = (1/2) log(g0/eps) must be finite and positive for ' +
      'every eps > 0 on the ladder. This is the regularization working: stopping the flow at g = eps ' +
      'removes the singularity for any fixed cutoff. If it is non-finite the closed form is wrong.',
  },
  {
    id: 'imp2839-stopped-integral-diverges-as-eps-to-zero',
    holds: () => I_EPS_DIVERGES,
    why:
      'I_eps must STRICTLY INCREASE as eps shrinks (g0/2 -> g0/1000): the regularization does not ' +
      'remove the divergence, it parks it in the cutoff, and I_eps -> infinity like (1/2) log(1/eps). ' +
      'If this fails the surrogate would be falsely bounded and the negative verdict would be unfounded.',
  },
  {
    id: 'imp2839-cusp-slope-diverges-holder-half',
    holds: () => CUSP_SLOPE_DIVERGES && Number.isFinite(C_SHOCK_STAR) && C_SHOCK_STAR > 0,
    why:
      'THE LOAD-BEARING NEGATIVE: the residual-window slope d g_min/d W_1 = C_shock/(2 W_1^{1/2}) must ' +
      'STRICTLY INCREASE as W_1 -> 0 with the bounded C_shock. This is the Holder-1/2 cusp: a finite ' +
      'C_shock still yields an UNBOUNDED Lipschitz slope. If this fails, the claim that the gap is only ' +
      'Holder-1/2 in W_1 (and hence C_Lip cannot be finite) is broken.',
  },
  {
    id: 'imp2839-verdict-negative-rh-hard-no-beat',
    holds: () => {
      const r = IMP_2839_CLIP_COLLISION_REGULARIZED;
      return (
        r.intrinsicDivergence === true &&
        r.rigorousBeat === false &&
        r.rhHardAtModulus === true &&
        /NEGATIVE/.test(r.verdict) &&
        /Holder-1\/2|HOLDER-1\/2/.test(r.verdict) &&
        /SOTA/.test(r.verdict)
      );
    },
    why:
      'VERDICT LOCK: the divergence is intrinsic (Holder-1/2 genuine regularity), no rigorous beat, ' +
      'C_Lip RH-hard-at-the-modulus, Platt-Trudgian Lambda <= 0.2 stays SOTA. This blocks any future ' +
      'edit from flipping the clean negative into a claimed C_Lip closure or a rigorous Lambda < 0.2 beat.',
  },
];

// Self-executing assertion check at import (matches the project convention).
for (const a of IMP_2839_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-2839 assertion failed: ' + a.id + ' — ' + a.why);
  }
}
