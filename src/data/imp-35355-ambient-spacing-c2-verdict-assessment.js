/**
 * @module imp-35355-ambient-spacing-c2-verdict-assessment
 *
 * imp-35355 (proof, ASSESSMENT ONLY): imp-35284 found that its candidate form C2 (the self-referential
 * front-coupling beta = 1/g_min) DOES close into an AUTONOMOUS ODE du/ds = -8 + 4 sqrt(u), but that ODE
 * REPRODUCES the finite-time collision (collapse time T_SR(u0) -> g0^2/8, the imp-2563 horizon), so it
 * yields NO floor. That C2 ODE used the imp-35215 near-front identity beta * g_min -> 1, which was
 * DERIVED under UNIT ambient spacing. THIS module RESTORES the ambient-spacing dependence imp-35215
 * dropped and asks whether the true, N-dependent ambient span (which varies along the backward-Dyson
 * trajectory) modifies the coefficient in the closed C2 ODE, and whether ANY admissible ambient-spacing
 * profile could stabilize the fixed point into a REACHABLE floor. Assessment only; discharges nothing;
 * I3/M5 stay OPEN; changes no bound; NO QED.
 *
 * WHAT imp-35215 ACTUALLY DERIVED (before the unit-spacing simplification)
 * -----------------------------------------------------------------------
 * The EXACT scale-invariant identity imp-35215 established is not beta * g_min -> 1 but the three-factor
 * form carrying the ambient span h = x_2 - x_0 = g_min + g_1 (the span of the collapsing edge pair plus
 * its neighbour):
 *
 *     beta * g_min * h  ->  1        (exact, every N)   =>   beta = 1 / (h * g_min) = 1 / (h * sqrt(u)).
 *
 * imp-35215 then set h -> 1 because, on the equally-spaced UNIT-spacing surrogate, the second gap g_1
 * relaxes back up toward the unit ambient spacing (g_1 -> 1^-, deficit ~0.377/N), so h -> 1. Restoring h
 * as a live, trajectory-varying quantity is EXACTLY the ambient-spacing dependence the ticket asks to
 * reinstate.
 *
 * THE GENERAL C2 ODE WITH AMBIENT SPACING RESTORED
 * ------------------------------------------------
 * Substitute the honest self-referential coupling beta = B_p = 1/(h * sqrt(u)) into the exact linearised
 * gap ODE (imp-2563) du/ds = -8 + 4 B_p u:
 *
 *     du/ds = -8 + 4 * (1 / (h * sqrt(u))) * u = -8 + (4 / h) * sqrt(u).                    (SR-h)
 *
 * At h = 1 this is EXACTLY the imp-35284 C2 ODE du/ds = -8 + 4 sqrt(u). So ambient spacing enters ONLY
 * through the FEEDBACK coefficient 4 -> 4/h; the COLLAPSE coefficient -8 is ambient-INDEPENDENT.
 *
 * THE THREE FACTS THAT KEEP C2 COLLISION-REPRODUCING
 * --------------------------------------------------
 *  (F1) FIXED POINT rescales but stays UNSTABLE. -8 + (4/h) sqrt(u*) = 0 gives u* = 4 h^2 (g* = 2h),
 *       with RHS-prime(u) = (2/h)/sqrt(u) > 0: still repelling. So restoring h moves g* from 2 to 2h but
 *       does not change its character.
 *  (F2) THE FIXED POINT IS UNREACHABLE BY CONSTRUCTION. g_min is by definition the MINIMUM gap, so the
 *       ambient span h = g_min + g_1 >= g_min with g_1 >= 0. The fixed point g* = 2h would require
 *       g_min = 2h = 2(g_min + g_1), i.e. -g_min = 2 g_1 -- impossible for positive gaps. Hence u < u*
 *       for EVERY admissible configuration and every profile h(s); the collapsing min gap never reaches
 *       g* = 2h from below. imp-35215 moreover shows h RELAXES UP (deficit ~0.377/N), pushing g* = 2h
 *       further away, never toward the gap.
 *  (F3) THE SIGN IS LOCKED NEGATIVE ACROSS THE WHOLE ADMISSIBLE AMBIENT RANGE. Admissibility h >= g_min
 *       = sqrt(u) gives (4/h) sqrt(u) <= 4 sqrt(u)/sqrt(u) = 4, and h -> infinity gives it -> 0, so
 *
 *           -8  <=  du/ds  =  -8 + (4/h) sqrt(u)  <=  -4  <  0    for ALL admissible h >= sqrt(u).
 *
 *       The gap strictly COLLAPSES under every admissible ambient profile, with collapse time bounded in
 *       [u0/8, u0/4] (rate in [4, 8]) -- always finite, never a positive floor. The tightest admissible
 *       ambient (equal local spacing, h = g_min) only halves the collapse rate (-4), it does not stop it.
 *
 * THE HORIZON IS AMBIENT-INDEPENDENT (closed form)
 * ------------------------------------------------
 * For constant h the collapse time of (SR-h) from u0 < 4h^2 integrates in closed form (a = sqrt(u0)):
 *
 *     T_SR^h(u0) = integral_0^{u0} du / (8 - (4/h) sqrt(u)) = h^2 log( 2h / (2h - a) ) - h a / 2.
 *
 * At h = 1 this is imp-35284 T_SR(u0) = log(2/(2 - sqrt(u0))) - sqrt(u0)/2 exactly. As u0 -> 0 the
 * expansion gives T_SR^h(u0) -> u0/8 for EVERY h (the feedback term (4/h) sqrt(u) -> 0 faster than the
 * -8 collapse, independent of h): the imp-2563 horizon g^2/8 is UNCHANGED by ambient spacing.
 *
 * THE VERDICT
 * -----------
 * Restoring the ambient-spacing dependence imp-35215 dropped does NOT change the imp-35284 C2 verdict.
 * Ambient spacing rescales the feedback coefficient (4 -> 4/h) and the fixed point (g* = 2 -> 2h), but
 * (F2) that fixed point is unreachable by construction (g_min = 2h is impossible), (F3) the sign of
 * du/ds is locked strictly negative (in [-8, -4]) across the ENTIRE admissible ambient range h >= g_min,
 * and the horizon g^2/8 is ambient-independent. No admissible ambient-spacing profile stabilizes the
 * u* = 4h^2 fixed point into a reachable floor -- C2 stays collision-reproducing, not a strictly-positive
 * g_min floor. This CONFIRMS the imp-35284 verdict at the finer resolution of the restored ambient
 * dependence. Assessment only; discharges nothing; establishes no operator positivity; changes no bound;
 * the imp-2563 sandwich stays a valid CONDITIONAL bracket; C_mb GUE-conditional per imp-486 UNTOUCHED;
 * I3/M5 stay OPEN; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35284-apriori-gmin-bound-forms-assessment (C2 verdict at unit spacing; parent)
 * @see imp-35215-beta-gmin-near-front-limit (beta * g_min * (x_2 - x_0) -> 1; the dropped ambient factor)
 * @see imp-35167-g-min-non-collision-certificate-scope (M2/M5 obstructions)
 * @see imp-2563-min-gap-sandwich-theorem (gap ODE du/ds = -8 + 4 B(s) u; Gronwall lower branch)
 * @see imp-486 (C_mb GUE-conditional)
 */

// ---------------------------------------------------------------------------
// The general C2 ODE with ambient spacing restored: du/ds = -8 + (4/h) sqrt(u).
// h = 1 recovers the imp-35284 C2 form du/ds = -8 + 4 sqrt(u).
// ---------------------------------------------------------------------------
function srRhsH(u, h) {
  return -8 + (4 / h) * Math.sqrt(u);
}
function srRhsPrimeH(u, h) {
  return (2 / h) / Math.sqrt(u); // > 0 for u > 0: the fixed point u* = 4h^2 is UNSTABLE (repelling)
}
function fixedPointU(h) {
  return 4 * h * h; // -8 + (4/h) sqrt(u*) = 0  =>  u* = 4 h^2  (g* = 2h)
}

// Closed-form collapse time of (SR-h) from u0 < 4h^2 to u = 0 (a = sqrt(u0)):
//   T_SR^h(u0) = h^2 log(2h / (2h - a)) - h a / 2.
function srCollapseTimeH(u0, h) {
  const a = Math.sqrt(u0);
  return h * h * Math.log((2 * h) / (2 * h - a)) - (h * a) / 2;
}

// Independent numeric cross-check by composite-Simpson quadrature of int_0^{u0} du/(8 - (4/h) sqrt(u)).
function srCollapseTimeHQuad(u0, h, panels) {
  const n = panels % 2 === 0 ? panels : panels + 1;
  const step = u0 / n;
  let acc = 0;
  for (let i = 0; i <= n; i += 1) {
    const u = i * step;
    const f = 1 / (8 - (4 / h) * Math.sqrt(u));
    const w = i === 0 || i === n ? 1 : i % 2 === 1 ? 4 : 2;
    acc += w * f;
  }
  return (acc * step) / 3;
}

// The imp-35284 unit-spacing C2 collapse time, for the h = 1 reduction check.
function srCollapseTimeUnit(u0) {
  const a = Math.sqrt(u0);
  return Math.log(2 / (2 - a)) - a / 2;
}

// ---------------------------------------------------------------------------
// (F1) Fixed point across ambient scales h: u* = 4h^2, RHS(u*) = 0, RHS-prime > 0 (unstable).
// ---------------------------------------------------------------------------
const H_LIST = [0.5, 1, 2, 4];
const FIXED_POINT_ROWS = H_LIST.map((h) => {
  const uStar = fixedPointU(h);
  return {
    h,
    uStar: +uStar.toFixed(6), // 4 h^2
    gStar: +(2 * h).toFixed(6), // g* = 2h
    rhsAtStar: +srRhsH(uStar, h).toFixed(12), // 0
    rhsPrimeAtStar: +srRhsPrimeH(uStar, h).toFixed(6), // > 0 (unstable)
  };
});

// ---------------------------------------------------------------------------
// (F3) Sign lock across the WHOLE admissible ambient band h >= g_min = sqrt(u):
//   -8 <= du/ds <= -4 < 0.  Sample a grid of (u, h) with h in [sqrt(u), large].
// ---------------------------------------------------------------------------
const U_GRID = [4, 1, 0.25, 1e-2, 1e-4, 1e-6];
const SIGN_LOCK_ROWS = U_GRID.map((u) => {
  const gmin = Math.sqrt(u);
  // tightest admissible ambient (equal local spacing h = g_min) gives the LEAST-negative RHS.
  const rhsTightest = srRhsH(u, gmin); // = -8 + 4 = -4 exactly
  // a large ambient gives RHS -> -8.
  const rhsWide = srRhsH(u, 1e6 * gmin + 10);
  return {
    u,
    gmin: +gmin.toExponential(3),
    rhsTightestAdmissible: +rhsTightest.toFixed(9), // -4 for every u
    rhsWideAmbient: +rhsWide.toFixed(6), // -> -8
  };
});
const maxAdmissibleRhs = Math.max(...SIGN_LOCK_ROWS.map((r) => r.rhsTightestAdmissible)); // -4

// ---------------------------------------------------------------------------
// Closed-form vs quadrature, and the ambient-independent horizon T_SR^h(u0) -> u0/8.
// ---------------------------------------------------------------------------
const U0_SWEEP = [1, 0.25, 1e-2, 1e-4, 1e-6];
const HORIZON_ROWS = [];
for (const h of H_LIST) {
  for (const u0 of U0_SWEEP) {
    if (u0 >= fixedPointU(h)) continue; // stay below the fixed point (front side)
    const closed = srCollapseTimeH(u0, h);
    const quad = srCollapseTimeHQuad(u0, h, 20000);
    HORIZON_ROWS.push({
      h,
      u0,
      tClosed: +closed.toExponential(6),
      tQuad: +quad.toExponential(6),
      ratioToHorizon: +(closed / (u0 / 8)).toFixed(6), // -> 1 as u0 -> 0, for EVERY h
    });
  }
}
// The finest rung per h: ratio to the g^2/8 horizon, and the [u0/8, u0/4] time bracket.
const H1_FINEST = HORIZON_ROWS.filter((r) => r.h === 1).slice(-1)[0];
const H2_FINEST = HORIZON_ROWS.filter((r) => r.h === 2).slice(-1)[0];

// ---------------------------------------------------------------------------
// (F3, dynamic) A trajectory-varying admissible ambient profile still collapses.
//   RK4 on du/ds = -8 + (4/h(s)) sqrt(u) with h(s) growing (relaxing up, imp-35215), h >= sqrt(u).
// ---------------------------------------------------------------------------
function integrateVariableAmbient(u0, hProfile, ds, maxSteps) {
  let u = u0;
  let s = 0;
  let steps = 0;
  let minRhs = Infinity;
  let maxRhs = -Infinity;
  while (u > 0 && steps < maxSteps) {
    const rhs = (uu, ss) => srRhsH(Math.max(uu, 0), hProfile(ss, Math.max(uu, 0)));
    const r0 = rhs(u, s);
    if (r0 < minRhs) minRhs = r0;
    if (r0 > maxRhs) maxRhs = r0;
    const k1 = r0;
    const k2 = rhs(u + (ds / 2) * k1, s + ds / 2);
    const k3 = rhs(u + (ds / 2) * k2, s + ds / 2);
    const k4 = rhs(u + ds * k3, s + ds);
    u += (ds / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
    s += ds;
    steps += 1;
  }
  return { collapseTime: s, reachedZero: u <= 0, minRhs, maxRhs };
}
// Growing ambient h(s) = max(1 + s, sqrt(u) + 0.1): relaxes UP, always admissible (h >= g_min).
const growingAmbient = (s, u) => Math.max(1 + s, Math.sqrt(u) + 0.1);
const VAR_U0 = 1;
const VAR_RUN = integrateVariableAmbient(VAR_U0, growingAmbient, 2e-5, 400000);

export const IMP35355_AMBIENT_SPACING_C2_VERDICT_ASSESSMENT = {
  id: 'imp-35355',
  proofSection: 'S-frontier',
  question:
    'Restore the ambient-spacing dependence the imp-35215 unit-spacing identity beta * g_min -> 1 ' +
    'dropped (the true identity is beta * g_min * h -> 1, h = x_2 - x_0). Does the trajectory-varying ' +
    'ambient span h(s) modify the closed imp-35284 C2 ODE du/ds = -8 + 4 sqrt(u), and could any ' +
    'admissible ambient profile stabilize its fixed point into a reachable strictly-positive g_min ' +
    'floor? Assessment only; discharges nothing; I3/M5 stay OPEN; NO QED.',
  generalOde: 'du/ds = -8 + (4/h) sqrt(u)  (h = ambient span x_2 - x_0; h = 1 recovers imp-35284 C2)',
  ambientEntersOnlyFeedback:
    'Ambient spacing enters ONLY the feedback coefficient 4 -> 4/h; the collapse coefficient -8 is ' +
    'ambient-INDEPENDENT.',
  f1_fixedPointRows: FIXED_POINT_ROWS, // u* = 4h^2, g* = 2h, unstable at every ambient scale
  f2_fixedPointUnreachable:
    'g* = 2h requires g_min = 2(g_min + g_1), i.e. -g_min = 2 g_1 -- impossible for positive gaps. So ' +
    'u < u* = 4h^2 for every admissible configuration and every profile h(s); the collapsing min gap ' +
    'never reaches g* = 2h. imp-35215 shows h relaxes UP (~0.377/N deficit), pushing g* further away.',
  f3_signLockRows: SIGN_LOCK_ROWS, // -8 <= du/ds <= -4 < 0 across the admissible band h >= sqrt(u)
  f3_maxAdmissibleRhs: +maxAdmissibleRhs.toFixed(9), // -4 (tightest admissible ambient h = g_min)
  horizonRows: HORIZON_ROWS, // T_SR^h(u0) closed vs quad; ratioToHorizon -> 1 for every h
  horizonIsAmbientIndependent:
    'T_SR^h(u0) = h^2 log(2h/(2h - sqrt(u0))) - h sqrt(u0)/2 -> u0/8 as u0 -> 0 for EVERY h; the ' +
    'imp-2563 horizon g^2/8 is unchanged by ambient spacing.',
  variableAmbientRun: {
    u0: VAR_U0,
    profile: 'h(s) = max(1 + s, sqrt(u) + 0.1) (growing, always admissible h >= g_min)',
    reachedZero: VAR_RUN.reachedZero, // collapses in finite time
    collapseTime: +VAR_RUN.collapseTime.toExponential(4),
    rhsBracket: [+VAR_RUN.minRhs.toFixed(4), +VAR_RUN.maxRhs.toFixed(4)], // inside [-8, -4]
  },
  reducesToImp35284AtUnitSpacing: true,
  anyAdmissibleProfileStabilizes: false,
  c2StaysCollisionReproducing: true,
  suppliesPositiveGminFloor: false,
  isRigorous: false,
  verdict:
    'ASSESSMENT (frontier-direction, NOT rigorous). Restoring the ambient-spacing dependence the ' +
    'imp-35215 unit-spacing identity beta * g_min -> 1 dropped does NOT change the imp-35284 C2 verdict. ' +
    'The true imp-35215 identity is beta * g_min * h -> 1 (h = x_2 - x_0), so the honest self-referential ' +
    'coupling is beta = 1/(h sqrt(u)); substituting into the exact gap ODE du/ds = -8 + 4 B_p u gives the ' +
    'GENERAL C2 ODE du/ds = -8 + (4/h) sqrt(u), which reduces to the imp-35284 form du/ds = -8 + ' +
    '4 sqrt(u) at h = 1. Ambient spacing enters ONLY the feedback coefficient (4 -> 4/h); the collapse ' +
    'coefficient -8 is ambient-independent. (F1) The fixed point rescales to u* = 4h^2 (g* = 2h) but ' +
    'stays UNSTABLE (RHS-prime = (2/h)/sqrt(u) > 0). (F2) It is unreachable by construction -- g* = 2h ' +
    'requires g_min = 2(g_min + g_1), impossible for positive gaps -- so u < u* for every admissible ' +
    'configuration and profile; imp-35215 shows h relaxes UP, pushing g* further away. (F3) The sign of ' +
    'du/ds is LOCKED strictly negative across the ENTIRE admissible ambient band h >= g_min = sqrt(u): ' +
    '-8 <= du/ds <= -4 < 0 (the tightest admissible ambient, equal local spacing h = g_min, only halves ' +
    'the collapse rate to -4, it does not stop it), and the horizon T_SR^h(u0) -> u0/8 is ambient-' +
    'independent. So NO admissible ambient-spacing profile stabilizes the u* = 4h^2 fixed point into a ' +
    'reachable floor -- C2 stays collision-reproducing, NOT a strictly-positive g_min floor. This ' +
    'CONFIRMS the imp-35284 verdict at the finer resolution of the restored ambient dependence. ' +
    'Assessment only; discharges nothing; establishes no operator positivity; changes no bound; the ' +
    'imp-2563 sandwich stays a valid CONDITIONAL bracket; C_mb GUE-conditional per imp-486 UNTOUCHED; ' +
    'I3/M5 stay OPEN; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35284-apriori-gmin-bound-forms-assessment (C2 verdict at unit spacing; parent); ' +
    'imp-35215-beta-gmin-near-front-limit (beta * g_min * (x_2 - x_0) -> 1; the dropped ambient factor); ' +
    'imp-35167-g-min-non-collision-certificate-scope (M2/M5 obstructions); ' +
    'imp-2563-min-gap-sandwich-theorem (gap ODE + Gronwall lower branch); imp-486 (C_mb GUE-conditional).',
};

export const IMP35355_AMBIENT_SPACING_C2_VERDICT_ASSESSMENT_ASSERTIONS = [
  {
    // The general C2 ODE reduces to the imp-35284 unit-spacing form at h = 1 (RHS and collapse time).
    id: 'imp35355-general-ode-reduces-to-imp35284-at-unit-spacing',
    description: 'du/ds = -8 + (4/h) sqrt(u) at h = 1 equals -8 + 4 sqrt(u), and T_SR^1 matches imp-35284 T_SR',
    holds: () =>
      U0_SWEEP.every((u0) => {
        const rhsMatch = Math.abs(srRhsH(u0, 1) - (-8 + 4 * Math.sqrt(u0))) < 1e-12;
        const timeMatch = Math.abs(srCollapseTimeH(u0, 1) - srCollapseTimeUnit(u0)) < 1e-12;
        return rhsMatch && timeMatch;
      }),
  },
  {
    // (F1) The fixed point is u* = 4h^2 with RHS(u*) = 0 and RHS-prime > 0 (unstable) at every ambient scale.
    id: 'imp35355-fixed-point-scales-as-4h2-unstable',
    description: 'u* = 4h^2 (g* = 2h): RHS(u*) = 0 and RHS-prime = (2/h)/sqrt(u*) > 0 (unstable) for all h',
    holds: () =>
      FIXED_POINT_ROWS.every(
        (r) =>
          Math.abs(r.uStar - 4 * r.h * r.h) < 1e-9 &&
          Math.abs(r.rhsAtStar) < 1e-9 &&
          r.rhsPrimeAtStar > 0 &&
          Math.abs(r.gStar - 2 * r.h) < 1e-9,
      ),
  },
  {
    // (F3) Sign lock: -8 <= du/ds <= -4 < 0 across the admissible band; tightest admissible ambient gives -4.
    id: 'imp35355-du-ds-sign-locked-negative-across-admissible-ambient',
    description: 'for every admissible h >= g_min = sqrt(u), du/ds in [-8, -4] < 0: the gap collapses under EVERY ambient profile',
    holds: () =>
      SIGN_LOCK_ROWS.every(
        (r) =>
          Math.abs(r.rhsTightestAdmissible - -4) < 1e-9 && // h = g_min gives exactly -4
          r.rhsWideAmbient <= -4 &&
          r.rhsWideAmbient >= -8.0000001,
      ) && Math.abs(maxAdmissibleRhs - -4) < 1e-9,
  },
  {
    // The closed-form collapse time matches an independent Simpson quadrature at every (h, u0).
    id: 'imp35355-closed-form-collapse-matches-quadrature',
    description: 'T_SR^h(u0) = h^2 log(2h/(2h-sqrt(u0))) - h sqrt(u0)/2 agrees with composite-Simpson quadrature',
    holds: () =>
      HORIZON_ROWS.every((r) => {
        const closed = srCollapseTimeH(r.u0, r.h);
        const quad = srCollapseTimeHQuad(r.u0, r.h, 20000);
        return Math.abs(closed - quad) < 1e-7 * Math.max(closed, 1e-9);
      }),
  },
  {
    // The horizon is ambient-independent: T_SR^h(u0)/(u0/8) -> 1 as u0 -> 0, for every h; time in [u0/8, u0/4].
    id: 'imp35355-horizon-is-ambient-independent',
    description: 'T_SR^h(u0)/(u0/8) -> 1 as u0 -> 0 for every h, and T_SR^h(u0) in [u0/8, u0/4] (rate in [4,8])',
    holds: () => {
      // Finest rungs at h = 1 and h = 2 both within 1% of the g^2/8 horizon.
      if (!(H1_FINEST.ratioToHorizon < 1.01 && H1_FINEST.ratioToHorizon >= 1)) return false;
      if (!(H2_FINEST.ratioToHorizon < 1.01 && H2_FINEST.ratioToHorizon >= 1)) return false;
      // Every row: collapse time bracketed by the [u0/8, u0/4] rate bounds (feedback in [0,4]).
      return HORIZON_ROWS.every((r) => {
        const t = srCollapseTimeH(r.u0, r.h);
        return t >= r.u0 / 8 - 1e-12 && t <= r.u0 / 4 + 1e-12;
      });
    },
  },
  {
    // (F3 dynamic) A trajectory-varying admissible ambient profile still collapses in finite time.
    id: 'imp35355-variable-admissible-profile-still-collapses',
    description: 'RK4 on du/ds = -8 + (4/h(s)) sqrt(u) with growing admissible h(s) reaches u = 0, RHS staying in [-8, -4]',
    holds: () =>
      VAR_RUN.reachedZero === true &&
      VAR_RUN.minRhs >= -8.0000001 &&
      VAR_RUN.maxRhs <= -4 + 1e-6 &&
      VAR_RUN.collapseTime <= VAR_U0 / 4 + 1e-3 &&
      VAR_RUN.collapseTime >= VAR_U0 / 8 - 1e-3,
  },
  {
    // Honesty gate: no admissible profile stabilizes, C2 stays collision-reproducing, no floor, NO QED, no refereed bound is changed.
    id: 'imp35355-honesty-gate-no-qed',
    description: 'Assessment only: anyAdmissibleProfileStabilizes false, c2StaysCollisionReproducing true, suppliesPositiveGminFloor false, isRigorous false, NO QED, no refereed bound is changed',
    holds: () =>
      IMP35355_AMBIENT_SPACING_C2_VERDICT_ASSESSMENT.anyAdmissibleProfileStabilizes === false &&
      IMP35355_AMBIENT_SPACING_C2_VERDICT_ASSESSMENT.c2StaysCollisionReproducing === true &&
      IMP35355_AMBIENT_SPACING_C2_VERDICT_ASSESSMENT.suppliesPositiveGminFloor === false &&
      IMP35355_AMBIENT_SPACING_C2_VERDICT_ASSESSMENT.reducesToImp35284AtUnitSpacing === true &&
      IMP35355_AMBIENT_SPACING_C2_VERDICT_ASSESSMENT.isRigorous === false &&
      /NO QED/.test(IMP35355_AMBIENT_SPACING_C2_VERDICT_ASSESSMENT.verdict) &&
      /refereed bound is changed/i.test(IMP35355_AMBIENT_SPACING_C2_VERDICT_ASSESSMENT.verdict),
  },
];

for (const a of IMP35355_AMBIENT_SPACING_C2_VERDICT_ASSESSMENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35355-ambient-spacing-c2-verdict-assessment assertion failed: ${a.id}`);
  }
}
