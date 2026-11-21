/**
 * @module imp-3381-pcc-free-route-enumeration
 *
 * imp-3381 -- ENUMERATE + ASSESS which closure routes remain NOT-yet-shown
 * RH-equivalent, per the section26-mupass-operator-verdict-2026-06-30 nextMove
 * field: "do NOT re-attack mu^pass (both options closed); redirect to PCC-free
 * routes not yet shown RH-equivalent." That redirect names a TARGET SET but no
 * prior module actually enumerates it. This module is that enumeration.
 *
 * SCOPE: ASSESSMENT / SCOPING ONLY. No positivity, no reduction, NO QED. This
 * catalogues, for each candidate closure route tracked in src/data, (a) its
 * current RH-equivalence status, (b) whether the block is a Montgomery pair-
 * correlation-conjecture (PCC) wall or is PCC-FREE, and (c) the NAMED artifact
 * that establishes the status. No refereed bound is changed
 * ; nothing here changes it and imp-3066 stays the lone operator obstruction.
 *
 * TWO ORTHOGONAL AXES (kept separate on purpose):
 *   - rhEquiv: has the route ALREADY been shown information-preservingly
 *     RH-equivalent (a faithful reformulation that renames RH, no shortcut)?
 *   - pccFree: is the route free of the shared Montgomery-PCC 50-year wall (the
 *     v52-audit obstruction), or does it funnel into that wall?
 * A route is a live target for the mupass nextMove ONLY if it is pccFree=true AND
 * rhEquiv=false (genuinely PCC-free and NOT yet shown to just rename RH).
 *
 * HONEST HEADLINE FINDING. Among the closure routes named in the ticket
 * (twin-ladder A/B/C/D, Volterra ||V||<=1, normalized-R / mu^pass, endpoint-
 * Hankel imp-3066, ESY / Selberg-trace), the target set "PCC-free AND not yet
 * shown RH-equivalent" is EMPTY: every twin-ladder / Volterra / normalized-R
 * route is already shown RH-equivalent (Theorem 16.1 + the section26 verdicts),
 * and the one that is NOT RH-equivalent by reformulation -- ESY / Selberg-trace
 * -- is blocked precisely BY the Montgomery-PCC wall (so it is not PCC-free).
 * The genuinely PCC-free, non-RH-equivalent opportunities that survive live
 * OUTSIDE the K_a-positivity closure family entirely: the C_H / G6a Holder-1/2
 * shock modulus (Lambda-upper side, about the particle flow) and the
 * winding-under-heat-flow original thread. This is consistent with the
 * full-route-map "no hidden shortcut below RH in the closure family" verdict:
 * the mupass nextMove, read literally against the closure routes, points OUT of
 * the closure family, not to an untried closure route.
 *
 * @see section26-mupass-operator-verdict-2026-06-30 (the verdict whose nextMove this enumerates)
 * @see closure-routes-section (twin-ladder routes A/B/C/D, Theorem 16.1 equivalence)
 * @see full-route-map-2026-06-19 (the 38-route classification and the C_H funnel)
 * @see imp-3066-offdiagonal-hankel-obstruction (the lone endpoint-Hankel operator obstruction)
 */

export const IMP3381_PCC_FREE_ROUTE_ENUMERATION = {
  id: 'imp-3381-pcc-free-route-enumeration',
  ticket: 'imp-3381',
  date: '2026-07-02',
  scope: 'ASSESSMENT / SCOPING ONLY -- no positivity, no reduction, NO QED',
  sota: 'No refereed bound is changed; imp-3066 remains the lone operator obstruction',
  driver:
    'section26-mupass-operator-verdict-2026-06-30 nextMove: "do NOT re-attack mu^pass (both options closed); redirect to PCC-free routes not yet shown RH-equivalent". This module enumerates that target set.',

  // The scoped table. Each row: the route, whether it is ALREADY shown
  // RH-equivalent (rhEquiv), whether it is free of the Montgomery-PCC wall
  // (pccFree), the named artifact establishing the status, and a one-line note.
  // isLiveTarget := pccFree && !rhEquiv (genuinely PCC-free AND not yet a
  // rename of RH). No row in the closure family satisfies both.
  routes: [
    {
      route: 'Twin-ladder Route A -- Schur contractivity / horizontal monotonicity (Conj 16.4/16.6)',
      rhEquiv: true,
      pccFree: true,
      isLiveTarget: false,
      namedArtifact: 'closure-routes-section.js (routes[A]) + routeAMaximumPrincipleAttempt (imp-2423)',
      note:
        'RH-equivalent (Theorem 16.1). Block is the internal-witness circularity (Principle 16.2): needs a zero-free right half-plane a>Delta, which for a->0 IS RH. PCC-free (no Montgomery PCC) but already a faithful reformulation.',
    },
    {
      route: 'Twin-ladder Route B -- de Branges / Hermite-Biehler positivity of K_a',
      rhEquiv: true,
      pccFree: true,
      isLiveTarget: false,
      namedArtifact: 'closure-routes-section.js (routes[B])',
      note:
        'RH-equivalent (Theorem 16.1). K_a > 0 holds for a>Delta and fails for a<Delta; extending to every positive shift IS RH. PCC-free, already a reformulation.',
    },
    {
      route: 'Twin-ladder Route C -- hidden-square kernel factorization K_a = <B_a,B_a> (Conj 16.4)',
      rhEquiv: true,
      pccFree: true,
      isLiveTarget: false,
      namedArtifact: 'closure-routes-section.js (routes[C]) + conjecture16_4',
      note:
        'RH-equivalent (Theorem 16.1). Non-local Wronskian obstruction (sign-indefinite cross-terms); RH supplies the square abstractly. PCC-free, already a reformulation.',
    },
    {
      route: 'Twin-ladder Route D -- Weil / twin-ladder norm square Q_TL[h] >= 0',
      rhEquiv: true,
      pccFree: true,
      isLiveTarget: false,
      namedArtifact: 'closure-routes-section.js (routes[D])',
      note:
        'RH-equivalent (Theorem 16.1). The Weil explicit formula in log-prime delay coordinates; missing step is archimedean-side domination of every coherent prime-delay autocorrelation. PCC-free, already a reformulation.',
    },
    {
      route: 'Volterra ||V|| <= 1 collapse (imp-1258)',
      rhEquiv: true,
      pccFree: true,
      isLiveTarget: false,
      namedArtifact: 'section26-verdict-volterra-not-a-reduction-2026-06-18.js + full-route-map-2026-06-19.js (directRH cluster)',
      note:
        'RH-equivalent, ELIMINATED as a reduction: the 5000x saturation margin was a scale/homogeneity artifact. PCC-free but not a shortcut.',
    },
    {
      route: 'Normalized-R / mu^pass endpoint-bridge passive core (Conj-26.3)',
      rhEquiv: true,
      pccFree: true,
      isLiveTarget: false,
      namedArtifact: 'section26-mupass-operator-verdict-2026-06-30.js',
      note:
        'RH-equivalent at the OPERATOR level: mass-feasible but not independently constructible; residual = K_a>=0 no-ghost positivity. Both options closed by the verdict this ticket serves. PCC-free but not a shortcut.',
    },
    {
      route: 'Endpoint-Hankel off-diagonal operator step (imp-3066)',
      rhEquiv: true,
      pccFree: true,
      isLiveTarget: false,
      namedArtifact: 'imp-3066-offdiagonal-hankel-obstruction.js',
      note:
        'The LONE operator obstruction the complete scalar mu^pass cover leaves untouched (off-diagonal Hankel cross-terms of the shear Gram). It IS the K_a>=0 operator positivity -- RH-equivalent, PCC-free (archimedean/completed-kernel side, not Montgomery PCC), not yet closed but also not a sub-RH shortcut.',
    },
    {
      route: 'ESY / Selberg-trace closure (imp-1184)',
      rhEquiv: false,
      pccFree: false,
      isLiveTarget: false,
      namedArtifact: 'imp-1184-direct-selberg-esy-route-audit.js + full-route-map-2026-06-19.js (directRH cluster, DEAD-END-FORNOW)',
      note:
        'Not a rename of RH, but blocked squarely by the shared Montgomery pair-correlation-conjecture 50-year wall (v52 audit). NOT PCC-free, so not a live target for the mupass nextMove.',
    },
  ],

  // The genuinely PCC-free, non-RH-equivalent opportunities that DO survive --
  // but they sit OUTSIDE the K_a-positivity closure family. Listed for honest
  // completeness so the enumeration does not read as "nothing is open".
  liveTargetsOutsideClosureFamily: [
    {
      target: 'C_H / G6a Holder-1/2 shock modulus (Step-4 bridge)',
      why: 'PCC-free and NOT RH-equivalent: a concrete analytic estimate on a specific PDE shock, the single load-bearing object of the Lambda-upper side. Gated: RH-hard at the modulus, naive Gronwall refuted (imp-2640). About the particle flow, not the K_a closure.',
      namedArtifact: 'full-route-map-2026-06-19.js (RANKED_OPPORTUNITIES rank 1) + g6a-sub-hyperbolic-closure.js',
    },
    {
      target: 'Winding-under-heat-flow (quantized winding of arg H_tau as a Lyapunov quantity)',
      why: 'The one genuinely UNDER-EXPLORED original thread; PCC-free. Realistic ceiling = a topological re-derivation of Lambda>=0, will NOT beat PT. Not a closure route.',
      namedArtifact: 'full-route-map-2026-06-19.js (originalIdeas cluster, UNDER-EXPLORED; RANKED_OPPORTUNITIES rank 5)',
    },
  ],

  headlineFinding:
    'Among the closure routes named in the ticket the target set {pccFree AND NOT yet shown RH-equivalent} is EMPTY: twin-ladder A/B/C/D, Volterra, normalized-R/mu^pass and imp-3066 are all already RH-equivalent (Theorem 16.1 + section26 verdicts), and the sole non-reformulation route -- ESY/Selberg-trace -- is blocked by the Montgomery-PCC wall (not PCC-free). Read literally against the closure family, the mupass nextMove points OUT of that family: the surviving PCC-free non-RH-equivalent opportunities (C_H shock modulus, winding-under-heat-flow) are Lambda-upper / flow objects, not K_a-positivity closure routes. No shortcut below RH inside the closure family; no refereed bound is changed.',
};

// ── Build-time tripwires ─────────────────────────────────────────────────────
// SCOPING invariants: the table must stay honest -- no closure-family row may be
// silently promoted into a live sub-RH target, the empty-target-set finding must
// hold, and PT must stay SOTA. run-assertions.mjs invokes every .holds().
export const IMP3381_PCC_FREE_ROUTE_ENUMERATION_ASSERTIONS = [
  {
    id: 'imp3381-eight-closure-routes-enumerated',
    description: 'The scoped table enumerates the eight closure routes named in the ticket',
    holds: () => Array.isArray(IMP3381_PCC_FREE_ROUTE_ENUMERATION.routes) && IMP3381_PCC_FREE_ROUTE_ENUMERATION.routes.length === 8,
  },
  {
    id: 'imp3381-isLiveTarget-is-pccFree-and-not-rhEquiv',
    description: 'Every row obeys isLiveTarget := pccFree && !rhEquiv',
    holds: () =>
      IMP3381_PCC_FREE_ROUTE_ENUMERATION.routes.every(
        (r) => r.isLiveTarget === (r.pccFree === true && r.rhEquiv === false)
      ),
  },
  {
    id: 'imp3381-no-closure-route-is-a-live-target',
    description: 'The headline finding: no closure-family route is a live PCC-free non-RH-equivalent target (empty target set)',
    holds: () => IMP3381_PCC_FREE_ROUTE_ENUMERATION.routes.every((r) => r.isLiveTarget === false),
  },
  {
    id: 'imp3381-esy-is-pcc-blocked-not-reformulation',
    description: 'The ESY / Selberg-trace route is the one non-RH-equivalent closure route and it is blocked by the Montgomery-PCC wall (not PCC-free)',
    holds: () => {
      const esy = IMP3381_PCC_FREE_ROUTE_ENUMERATION.routes.find((r) => /ESY|Selberg-trace/.test(r.route));
      return !!esy && esy.rhEquiv === false && esy.pccFree === false && /Montgomery/.test(esy.note);
    },
  },
  {
    id: 'imp3381-every-row-has-named-artifact',
    description: 'Every enumerated route cites a named artifact establishing its status',
    holds: () =>
      IMP3381_PCC_FREE_ROUTE_ENUMERATION.routes.every(
        (r) => typeof r.namedArtifact === 'string' && r.namedArtifact.length >= 12
      ),
  },
  {
    id: 'imp3381-live-targets-live-outside-closure-family',
    description: 'The surviving PCC-free non-RH-equivalent opportunities (C_H, winding) are recorded as living OUTSIDE the closure family',
    holds: () => {
      const out = IMP3381_PCC_FREE_ROUTE_ENUMERATION.liveTargetsOutsideClosureFamily;
      return (
        Array.isArray(out) &&
        out.length === 2 &&
        out.some((t) => /C_H|G6a/.test(t.target)) &&
        out.some((t) => /winding/i.test(t.target))
      );
    },
  },
  {
    id: 'imp3381-scope-is-assessment-only-no-qed',
    description: 'Scope stays ASSESSMENT / SCOPING ONLY with no QED, and no refereed bound is changed',
    holds: () =>
      /ASSESSMENT/.test(IMP3381_PCC_FREE_ROUTE_ENUMERATION.scope) &&
      /NO QED/.test(IMP3381_PCC_FREE_ROUTE_ENUMERATION.scope) &&
      /refereed bound is changed/i.test(IMP3381_PCC_FREE_ROUTE_ENUMERATION.sota),
  },
];

for (const a of IMP3381_PCC_FREE_ROUTE_ENUMERATION_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-3381-pcc-free-route-enumeration assertion failed: ${a.id}`);
}
