/**
 * @module imp-mingap-beta-bound
 * @fileoverview imp-2849 (proof): EXPOSE exactly what the unproven field bound
 * beta must satisfy for the two-sided MIN-GAP SANDWICH (Theorem B,
 * imp-2563-min-gap-sandwich-theorem.js / route-map opportunity #4) to be worth
 * having. Sibling imp-2683-sandwich-beta-field-bound.js attacked beta on the
 * EXISTENCE / size side (positivity, the telescope ceiling beta_0 g^2 < 2 at
 * s = 0, the RvM density estimate, the named punctured-min-gap residual). THIS
 * module attacks the QUESTION OF SUFFICIENCY: for which beta is the conditional
 * sandwich actually a sharper upper bound than the unconditional A1 trap that
 * the program already owns? It (a) restates beta precisely, (b) writes the
 * bracket [T_-, T_+] as an explicit FUNCTION of beta at the verified-zero gap
 * g_min(N* = 1e4), (c) gives a measured/density beta estimate over the
 * verified-zero HEIGHT window [100, 1e4], and (d) marks the EXACT beta band for
 * which the sandwich UPPER bound beats the A1 pinch -- while keeping the whole
 * thing honestly CONDITIONAL on beta being proven uniform.
 *
 * BETA, STATED PRECISELY.
 * -----------------------
 * For the colliding adjacent pair a = x_lo < b = x_hi (gap g = b - a) under the
 * attractive flow dx_k/ds = -2 sum_{j != k} 1/(x_k - x_j), the net background
 * field of the other N-2 particles on that pair is
 *
 *     B_p(s) = sum_{j != lo,hi} 1 / ((b - x_j)(a - x_j)),
 *
 * and the sandwich gating constant is
 *
 *     beta = sup_{0 <= s < t_c} |B_p(s)|       (assumed finite, with beta g^2 < 2).
 *
 * Because a, b are ADJACENT no particle lies in (a, b), so each factor pair
 * shares a sign and B_p > 0 (imp-2683 Observation 1); hence beta = sup_s B_p(s).
 *
 * THE BRACKET AS A FUNCTION OF BETA (Theorem B, verbatim).
 * -------------------------------------------------------
 *     T_-(g, beta) = (1 / (4 beta)) log( 1 + beta g^2 / 2 )   <=  t_c(N)
 *     T_+(g, beta) = (1 / (4 beta)) log( 2 / (2 - beta g^2) ) >=  t_c(N)
 *
 * with leading order t_c = (g^2/8)(1 +/- beta g^2/4 + O(g^4)) and relative
 * width beta g^2 / 2. Everything below sweeps these as functions of beta at the
 * fixed verified gap g = g_min(N* = 1e4) = 0.0376985 (the Odlyzko-certified
 * Lehmer-pair minimum gap carried as a literal by
 * imp-2762-tc-a1-trap-interval.js).
 *
 * THE A1 PINCH (the unconditional incumbent the sandwich must beat).
 * -----------------------------------------------------------------
 * The program already owns an UNCONDITIONAL one-sided upper bound on the
 * per-particle collision time from the Theta(0) <= 1/4 trap (route-map A1,
 * imp-2644 / imp-2762):
 *
 *     t_c <= A1(g) := g^2 / 6.
 *
 * The sandwich is only WORTH its conditionality if its conditional upper bound
 * T_+(g, beta) is SHARPER than this free A1(g). Write x = beta g^2 (the single
 * dimensionless gate variable). Then T_+ = (g^2 / (4x)) log(2/(2 - x)), so
 *
 *     T_+(g, beta) < A1(g)
 *       <=>  (1/(4x)) log(2/(2 - x)) < 1/6
 *       <=>  F(x) := log( 2 / (2 - x) ) - (2x / 3) < 0.
 *
 * F(0) = 0, F'(0) = 1/2 - 2/3 = -1/6 < 0 (so the sandwich DOES beat A1 for small
 * x, as expected since the leading g^2/8 < g^2/6), F dips to a minimum at
 * x = 1/2, then climbs back through zero at a unique x* in (1/2, 2). Solving
 * F(x*) = 0 numerically gives
 *
 *     x* = 0.90879...      (the beta g^2 break-even with the A1 trap)
 *
 * Hence the SANDWICH UPPER BOUND BEATS THE A1 PINCH precisely when
 *
 *     beta g^2 < x*  ~ 0.9088,    i.e.    beta < beta_crit := x* / g^2.
 *
 * At g = g_min(1e4) this is beta < 639.46. This is STRICTLY STRONGER than the
 * mere existence gate beta g^2 < 2 (beta < 1407.28): a beta in
 * (639.46, 1407.28) keeps the sandwich well-defined but LOOSER on the upper side
 * than the free A1 trap, so the conditionality would buy nothing on top. The
 * sandwich is only a strict upper-bound improvement in the band beta < 639.46;
 * its UNIQUE asset across the whole gate beta g^2 < 2 is the matched LOWER bound
 * T_-, which A1 has no analogue of.
 *
 * MEASURED / DENSITY BETA OVER THE VERIFIED-ZERO HEIGHT WINDOW [100, 1e4].
 * -----------------------------------------------------------------------
 * The raw 16.7MB verified-zeros bundle is intentionally NOT imported (build-hang
 * constraint: heavy-import assertion modules hang under ssrLoadModule). Instead
 * beta is estimated from the Riemann-von-Mangoldt LOCAL DENSITY at height T:
 * with mean spacing l(T) = 2 pi / log(T / 2 pi), a mean-spacing-l background
 * around an embedded gap gives B_p -> 2 zeta(2) / l^2 = pi^2 / (3 l^2)
 * (imp-2683 Observation 3), so
 *
 *     beta_density(T) ~ pi^2 / (3 l(T)^2),
 *
 * RISING with T as the spacing tightens. Over the verified-zero window
 * T in [100, 1e4] this stays a few units in size; multiplied by the verified
 * g_min(1e4)^2 it gives beta g^2 ~ 6e-3 -- two orders of magnitude inside the
 * break-even x* ~ 0.909. So ON THE DENSITY MODEL the sandwich would beat A1 with
 * vast room. The RIGOROUS N-uniform ceiling is the telescope bound
 * beta <= 2 / g^2 (imp-2683 Observation 2); the gap between the ~4 density value
 * and that 1407 ceiling is exactly the unproven punctured-min-gap residual.
 *
 * HONEST VERDICT -- STILL CONDITIONAL.
 * ------------------------------------
 * None of this proves beta is uniform. The density estimate is a MODEL, not a
 * sup over the true backward flow; the only RIGOROUS control is the telescope
 * ceiling, which only certifies beta g^2 < 2 at the instants where the colliding
 * pair realises the GLOBAL min gap (e.g. s = 0), not the sup_s with a fixed
 * initial g that Theorem B demands. So the bracket stays CONDITIONAL on the
 * named imp-2683-sub-punctured-min-gap residual. What this module adds is the
 * crisp TARGET: a uniform proof of beta < 639.46 / (g/g_min(1e4))^2 (equivalently
 * beta g^2 < 0.9088) is what would make the sandwich a strict, unconditional
 * improvement on the A1 pinch -- anything weaker (up to beta g^2 < 2) buys only
 * the lower bound T_-, not a sharper upper bound.
 *
 * @see imp-2563-min-gap-sandwich-theorem (Theorem B; beta is its gating input)
 * @see imp-2683-sandwich-beta-field-bound (beta positivity, telescope ceiling, residual)
 * @see imp-2762-tc-a1-trap-interval (A1 trap t_c <= g^2/6; g_min literal 0.0376985)
 * @see imp-2561 / imp-2562 one-sided pinch (constant S read off as beta)
 */

// ── Verified-zero anchors (light literals; no heavy bundle import) ────────────

/** Odlyzko-certified Lehmer-pair minimum gap at N* = 1e4 (imp-2762 literal). */
const G_MIN_1E4 = 0.0376985;

/** A1 pinch: unconditional upper bound t_c <= g^2/6 (Theta(0) <= 1/4 trap). */
function a1Trap(g) {
  return (g * g) / 6;
}

// ── Theorem B bracket as a function of (g, beta) ──────────────────────────────

/** Lower sandwich bound T_-(g, beta) = (1/(4 beta)) log(1 + beta g^2 / 2). */
function tMinus(g, beta) {
  return (1 / (4 * beta)) * Math.log(1 + (beta * g * g) / 2);
}

/** Upper sandwich bound T_+(g, beta) = (1/(4 beta)) log(2 / (2 - beta g^2)). */
function tPlus(g, beta) {
  return (1 / (4 * beta)) * Math.log(2 / (2 - beta * g * g));
}

/**
 * The full conditional record at one (g, beta): both bounds, the leading value
 * g^2/8, the relative width beta g^2/2, the free A1 incumbent, and the verdict
 * of whether the conditional upper bound T_+ actually beats A1.
 */
function bracketAt(g, beta) {
  const lo = tMinus(g, beta);
  const hi = tPlus(g, beta);
  const lead = (g * g) / 8;
  const a1 = a1Trap(g);
  return {
    g,
    beta,
    betaGsq: beta * g * g,
    tMinus: lo,
    tPlus: hi,
    lead,
    relWidth: (hi - lo) / lead,
    a1Trap: a1,
    gateHolds: beta * g * g < 2, // Theorem B is well-defined at all
    beatsA1: hi < a1, // conditional upper bound is sharper than the free trap
    bracketsLead: lo < lead && lead < hi,
  };
}

// ── The A1 break-even x* : F(x) = log(2/(2-x)) - 2x/3 = 0 in (1/2, 2) ──────────

/** Break-even function: T_+ beats A1 iff F(beta g^2) < 0. */
function breakEvenF(x) {
  return Math.log(2 / (2 - x)) - (2 * x) / 3;
}

/** Bisect the unique nontrivial root x* of F in (1/2, 2). */
function solveBreakEven() {
  let lo = 0.5; // F(1/2) < 0 (the minimum), F(2^-) -> +infinity
  let hi = 1.999;
  for (let i = 0; i < 200; i++) {
    const m = (lo + hi) / 2;
    if (breakEvenF(m) < 0) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}

const X_STAR = solveBreakEven(); // beta g^2 break-even with the A1 trap
const BETA_CRIT_1E4 = X_STAR / (G_MIN_1E4 * G_MIN_1E4); // beat-A1 ceiling on beta
const BETA_GATE_1E4 = 2 / (G_MIN_1E4 * G_MIN_1E4); // mere existence ceiling on beta

// ── (b) beta-sweep of the bracket at the verified gap g_min(1e4) ──────────────

// A geometric ladder of beta straddling the density estimate (~4), the beat-A1
// ceiling (~639), and the existence gate (~1407): shows the bracket collapsing
// to g^2/8 for small beta and the upper bound crossing A1 at beta_crit.
const BETA_GRID = [1, 4, 10, 100, 639.46, 1000, 1400];
const SWEEP = BETA_GRID.map((b) => bracketAt(G_MIN_1E4, b));

// ── (c) density beta over the verified-zero height window [100, 1e4] ──────────

/** RvM local mean spacing l(T) = 2 pi / log(T / 2 pi) at height T. */
function meanSpacing(T) {
  return (2 * Math.PI) / Math.log(T / (2 * Math.PI));
}

/** Density-model field strength beta(T) ~ pi^2 / (3 l(T)^2) at height T. */
function betaDensity(T) {
  const l = meanSpacing(T);
  return (Math.PI * Math.PI) / (3 * l * l);
}

// Sample beta across the verified-zero height window [100, 1e4]. beta RISES with
// T as the spacing tightens; the row carries beta g^2 using the verified
// g_min(1e4) so the comparison to x* is apples-to-apples.
const HEIGHT_WINDOW = [100, 300, 1000, 3000, 10000].map((T) => {
  const beta = betaDensity(T);
  return {
    height: T,
    meanSpacing: meanSpacing(T),
    betaDensity: beta,
    betaGsqAtGmin1e4: beta * G_MIN_1E4 * G_MIN_1E4,
    beatsA1AtGmin1e4: beta * G_MIN_1E4 * G_MIN_1E4 < X_STAR,
  };
});
const BETA_AT_TOP = HEIGHT_WINDOW[HEIGHT_WINDOW.length - 1]; // T = 1e4 row

// ── Exported record ───────────────────────────────────────────────────────────

export const MINGAP_BETA_BOUND = {
  id: 'imp-2849',
  parent: 'imp-2563',
  attacks:
    'the unproven uniform field bound beta throttling the two-sided min-gap ' +
    'sandwich (Theorem B); route-map opportunity #4',
  verdict:
    'CONDITIONAL TARGET EXPOSED -- the sandwich upper bound beats the free A1 ' +
    'trap iff beta g^2 < x* ~ 0.909 (strictly inside the existence gate ' +
    'beta g^2 < 2); the density estimate sits two orders inside, but the bound ' +
    'stays CONDITIONAL on a uniform proof of beta (punctured-min-gap residual).',

  betaDefinition:
    'beta = sup_{0<=s<t_c} |B_p(s)|, B_p(s) = sum_{j!=lo,hi} 1/((b-x_j)(a-x_j)) > 0',

  bracketAsFunctionOfBeta: {
    lower: 'T_-(g,beta) = (1/(4 beta)) log(1 + beta g^2/2)',
    upper: 'T_+(g,beta) = (1/(4 beta)) log(2/(2 - beta g^2))',
    relWidth: 'beta g^2 / 2 (-> 0 as beta g^2 -> 0)',
    note: 'swept at the verified gap g_min(1e4) = ' + G_MIN_1E4 + ' over BETA_GRID',
  },

  a1Pinch: {
    statement: 't_c <= A1(g) = g^2/6 (UNCONDITIONAL; Theta(0) <= 1/4 trap, imp-2644/2762)',
    a1AtGmin1e4: a1Trap(G_MIN_1E4),
  },

  beatA1Threshold: {
    breakEvenEquation: 'F(x) = log(2/(2-x)) - 2x/3 = 0, x = beta g^2, root in (1/2,2)',
    xStar: X_STAR,
    betaCritAtGmin1e4: BETA_CRIT_1E4,
    betaGateAtGmin1e4: BETA_GATE_1E4,
    reading:
      'T_+ beats A1 iff beta g^2 < ' + X_STAR.toFixed(5) + ' (beta < ' +
      BETA_CRIT_1E4.toFixed(2) + ' at g_min(1e4)); a beta in (' +
      BETA_CRIT_1E4.toFixed(0) + ', ' + BETA_GATE_1E4.toFixed(0) + ') keeps the ' +
      'sandwich well-defined but LOOSER on the upper side than the free A1 trap. ' +
      'Across the whole gate the sandwich UNIQUE asset is the lower bound T_-.',
  },

  betaSweep: SWEEP,

  heightWindowEstimate: {
    window: '[100, 1e4] (verified-zero heights; RvM density model, no heavy bundle)',
    rows: HEIGHT_WINDOW,
    atTop: {
      height: BETA_AT_TOP.height,
      betaDensity: BETA_AT_TOP.betaDensity,
      betaGsqAtGmin1e4: BETA_AT_TOP.betaGsqAtGmin1e4,
      beatsA1: BETA_AT_TOP.beatsA1AtGmin1e4,
      note:
        'density beta ~ ' + BETA_AT_TOP.betaDensity.toFixed(3) + ' at T = 1e4, so ' +
        'beta g^2 ~ ' + BETA_AT_TOP.betaGsqAtGmin1e4.toExponential(3) + ' << x* ~ ' +
        X_STAR.toFixed(3) + ': the sandwich would beat A1 with room to spare ON ' +
        'THE MODEL. Rigorous control is only the telescope ceiling beta <= 2/g^2 ' +
        '(= ' + BETA_GATE_1E4.toFixed(0) + '); the gap is the unproven residual.',
    },
  },

  honestStatus:
    'STILL CONDITIONAL. The beta estimate over [100,1e4] is the RvM density ' +
    'MODEL, not a sup over the true backward flow; the only RIGOROUS bound is the ' +
    'telescope ceiling beta g^2 < 2 (imp-2683 Obs 2), valid only where the pair ' +
    'realises the GLOBAL min gap, not the sup_s with fixed initial g Theorem B ' +
    'needs. The target this module exposes: a uniform proof of beta g^2 < x* ~ ' +
    '0.909 makes the sandwich a STRICT improvement on the A1 pinch; anything ' +
    'weaker (up to beta g^2 < 2) buys only the matched lower bound T_-, not a ' +
    'sharper upper bound. Closing it needs the named punctured-min-gap residual ' +
    'imp-2683-sub-punctured-min-gap.',

  sources: [
    'src/data/imp-2563-min-gap-sandwich-theorem.js (Theorem B; beta is its gating input)',
    'src/data/imp-2683-sandwich-beta-field-bound.js (beta positivity, telescope ceiling, residual)',
    'src/data/imp-2762-tc-a1-trap-interval.js (A1 trap t_c <= g^2/6; g_min literal)',
    'imp-2561 / imp-2562 one-sided pinch (constant S read off as beta)',
  ],
};

// ── Build-time assertions ─────────────────────────────────────────────────────

export const MINGAP_BETA_BOUND_ASSERTIONS = [
  {
    id: 'imp2849-breakeven-root-bracketed',
    holds: () =>
      X_STAR > 0.5 &&
      X_STAR < 2 &&
      Math.abs(breakEvenF(X_STAR)) < 1e-9 &&
      X_STAR > 0.9087 &&
      X_STAR < 0.9089,
    why:
      'The A1 break-even x* solving F(x) = log(2/(2-x)) - 2x/3 = 0 must be the ' +
      'unique nontrivial root in (1/2, 2) and equal 0.90879...; this is the exact ' +
      'beta g^2 at which the conditional upper bound T_+ equals the free A1 trap ' +
      'g^2/6. A wrong root would misplace the entire beat-A1 band.',
  },
  {
    id: 'imp2849-beat-A1-band-strictly-inside-gate',
    holds: () =>
      X_STAR < 2 &&
      BETA_CRIT_1E4 < BETA_GATE_1E4 &&
      BETA_CRIT_1E4 > 0 &&
      bracketAt(G_MIN_1E4, BETA_CRIT_1E4 * 0.99).beatsA1 === true &&
      bracketAt(G_MIN_1E4, BETA_CRIT_1E4 * 1.01).beatsA1 === false,
    why:
      'The beat-A1 ceiling beta_crit = x*/g^2 must be STRICTLY below the mere ' +
      'existence gate 2/g^2 (since x* < 2), and the beatsA1 verdict must actually ' +
      'flip across beta_crit: just under it T_+ < A1, just over it T_+ >= A1. This ' +
      'is the substance of the deliverable -- marking which beta make the bracket ' +
      'beat the A1 pinch.',
  },
  {
    id: 'imp2849-bracket-collapses-and-contains-lead',
    holds: () =>
      SWEEP.every((r) => r.bracketsLead === true) &&
      SWEEP.every((r) => r.gateHolds === true) &&
      SWEEP[0].relWidth < SWEEP[SWEEP.length - 1].relWidth &&
      SWEEP[0].relWidth > 0,
    why:
      'Theorem B sanity across the beta sweep at g_min(1e4): the leading value ' +
      'g^2/8 must lie strictly inside [T_-, T_+] at every beta, every swept beta ' +
      'must satisfy the existence gate, and the relative width (~ beta g^2/2) must ' +
      'GROW with beta. Failure means the bracket closed forms are mis-coded.',
  },
  {
    id: 'imp2849-density-beta-beats-A1-on-model',
    holds: () =>
      HEIGHT_WINDOW.every((r) => r.betaDensity > 0) &&
      HEIGHT_WINDOW[0].betaDensity < HEIGHT_WINDOW[HEIGHT_WINDOW.length - 1].betaDensity &&
      BETA_AT_TOP.betaGsqAtGmin1e4 < X_STAR &&
      BETA_AT_TOP.beatsA1AtGmin1e4 === true,
    why:
      'Over the verified-zero height window [100,1e4] the RvM density beta must be ' +
      'positive and RISE with height (spacing tightens), and at the top (T=1e4) ' +
      'beta g^2 with the verified g_min must sit BELOW the break-even x* -- so on ' +
      'the density model the sandwich beats A1. This is the measured-estimate ' +
      'half of the deliverable; it is a MODEL bound, not a proof of uniformity.',
  },
];

// ── Self-executing tripwire (matches the imp-2563 sibling pattern) ────────────
for (const a of MINGAP_BETA_BOUND_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `[imp-mingap-beta-bound] build-time assertion failed: ${a.id} - ${a.why}`,
    );
  }
}
