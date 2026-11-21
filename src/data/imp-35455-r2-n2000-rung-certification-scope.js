/**
 * @module imp-35455-r2-n2000-rung-certification-scope
 * @fileoverview imp-35455: SCOPE what a finer-grid endpoint confirmation would
 * require to PROMOTE the imp-35412 N=2000 R2 rung (Imp35288R2FlowLadderSlackViz
 * RUNGS[5]) from PROVISIONAL to certified -- enumerate the grid-refinement,
 * event-definition, and dense-envelope-max conditions under which the endpoint
 * DP45 dt-over-2 worst-case t_c = 1.1999384320e-3 becomes a ROBUST one-sided
 * upper bound t_c_flow(2000) <= t_c_hi(2000) rather than a provisional reading.
 *
 * WHERE THE RUNG STANDS
 * ---------------------
 * imp-35412 keeps RUNGS[5] baking the imp-35324 FINER-grid (dt = tauC/4000)
 * ENDPOINT DP45 dt-over-2 worst-case 1.1999384320e-3, giving a razor-thin slack
 * t_c_hi - t_c_flow = +6.16e-8 against the imp-857 map bracket t_c_hi = 1.2e-3.
 * The R2 predicate is a ONE-SIDED UPPER bound (imp-2528), so the largest tested
 * collision time is the correct conservative reading. But that largest value is
 * itself a DP45-dt-over-2 SINGLE-GRID RESONANCE (imp-35452: the only cell in the
 * 2x3 order-by-grid map whose endpoint gap stays positive; refining dt ->
 * dt-over-2 -> dt-over-4 flips the endpoint sign NEG->POS->NEG), and imp-35350
 * showed that on the STILL-finer tauC/16000 grid the DP45 dt-over-2 overshoot
 * VANISHES and both families tie at the converged t_c = 1.1923626880e-3. So the
 * baked +6.16e-8 slack is a resolution artifact of ONE grid, not a grid-converged
 * bound -- which is exactly why the rung is only PROVISIONAL.
 *
 * WHAT A CERTIFICATION WOULD REQUIRE (four conditions)
 * ----------------------------------------------------
 *   (C1) GRID CONVERGENCE. Demonstrate two consecutive base-grid halvings agree
 *        for BOTH families: imp-35350 already shows tauC/8000 reproduces the
 *        imp-35324 knife-edge and tauC/16000 collapses the DP45-vs-RK4 dt-over-2
 *        cross-family gap 7.576e-6 -> 0 (tie at 1.1923626880e-3). Certification
 *        needs the envelope MAX over {RK4,DP45} x {dt, dt-over-2} to be
 *        grid-converged at a resolution where the DP45 dt-over-2 resonance is
 *        resolved -- i.e. one more confirming rung (tauC/32000, deferred by
 *        imp-35350) showing the tie is stable, not a second resonance node.
 *
 *   (C2) EVENT-DEFINITION RECONCILIATION. Adopt ONE event definition uniformly.
 *        imp-35354 measured the min-spacing-gate collision (1.1923626880e-3) vs
 *        the imp-35278 signed-crossing collision (1.1924935719e-3) differing by
 *        ~1.31e-7 at N=2000; imp-35325/imp-35416 established the within-step
 *        crossing is scheme-INDEPENDENT (physical pass-through, ~4.5e-5 relative
 *        agreement across DP45-CONTD5 and RK4-Hermite dense output). The residual
 *        event-definition gap (1.31e-7) must be folded into the reported bound,
 *        not left ambiguous between two competing t_c definitions.
 *
 *   (C3) CONSERVATIVE ENVELOPE MAX. Per the imp-35412 one-sided-upper rule, the
 *        reported slack must use the MAX over the full folded envelope (every
 *        order-by-grid cell AND both event definitions), never a single cell.
 *        Once the DP45 dt-over-2 resonance is resolved (C1), that max drops from
 *        the baked 1.1999384320e-3 (+6.16e-8) toward the grid-converged
 *        1.1923626880e-3 (+7.637e-6) -- but only the folded max is admissible.
 *
 *   (C4) SAFETY-MARGIN PREDICATE. A ROBUST one-sided bound requires
 *        t_c_converged + (Delta_grid + Delta_event + Delta_fp) <= t_c_hi, where
 *        Delta_grid is the residual grid-truncation bound (Richardson gap between
 *        the two confirming grids of C1), Delta_event the event-definition gap of
 *        C2 (1.31e-7), and Delta_fp the floating-point/rounding budget. The
 *        current converged slack (7.637e-6) comfortably absorbs the known
 *        Delta_event (1.31e-7); the missing piece is a CERTIFIED Delta_grid from a
 *        confirming still-finer rung so the sum is a rigorous upper bound.
 *
 * FEASIBILITY READ (assessment, NOT a discharge)
 * ----------------------------------------------
 * On present evidence the four conditions are ACHIEVABLE: imp-35350 supplies a
 * grid-converged t_c = 1.1923626880e-3 with a ~7.64e-6 slack that dwarfs the
 * ~1.31e-7 event-definition gap (imp-35354). What is MISSING is a single dedicated
 * verified run bundling C1-C4 -- a confirming tauC/32000 (or interval-rigorous)
 * rung that certifies Delta_grid, applied under one event definition, reporting
 * the folded envelope max plus safety margin. Until that run exists, RUNGS[5]
 * correctly bakes the conservative single-grid endpoint value and the rung stays
 * PROVISIONAL; the ladder stays robustly certified only through N=1000
 * (imp-35221/imp-35324).
 *
 * SCOPE: ASSESSMENT / SCOPING ONLY. Discharges nothing; advances no rung (stays
 * N=1000); recommends NO page edit (RUNGS[5] already correct per imp-35412); does
 * NOT touch the imp-486 GUE conditional. Changes NO bound. No refereed bound is changed
 * . NO QED.
 *
 * SYNTAX NOTE: "dt-over-2"/"dt-over-4" prose used in place of the slash form to
 * avoid the star-slash JSDoc terminator.
 *
 * @see imp-35324  finer-grid (tauC/4000) endpoint DP45 dt-over-2 worst-case (baked in RUNGS[5])
 * @see imp-35350  still-finer grid (tauC/16000) -- DP45 dt-over-2 overshoot vanishes, tie at 1.1923626880e-3
 * @see imp-35354  event-definition gap (min-spacing gate vs signed-crossing) ~1.31e-7 at N=2000
 * @see imp-35412  one-sided-upper conservatism: report the folded envelope MAX, not a single cell
 * @see imp-35452  DP45 dt-over-2 endpoint positivity is a single-grid resonance, not an order-5 trend
 */

// imp-857 map upper-bracket the one-sided bound is tested against.
const T_C_HI = 0.0012;

// imp-35324 FINER-grid (tauC/4000) ENDPOINT DP45 dt-over-2 worst-case -- the
// value RUNGS[5] currently bakes (conservative single-grid resonance reading).
const ENDPOINT_DP45_DT_HALF = 0.0011999384320;

// imp-35350 STILL-finer-grid (tauC/16000) GRID-CONVERGED tie value -- both RK4
// and DP45 dt-over-2 land here once the DP45 dt-over-2 resonance is resolved.
const CONVERGED_TC = 0.0011923626880;

// imp-35278 signed-crossing / dense-envelope-max RK4 dt-over-2 collision time --
// the ALTERNATIVE event definition (the C2 reconciliation target).
const SIGNED_CROSSING_TC = 0.0011924935719;

const endpointSlack = T_C_HI - ENDPOINT_DP45_DT_HALF; // +6.15680e-8 (baked, single-grid)
const convergedSlack = T_C_HI - CONVERGED_TC; // +7.637312e-6 (grid-converged, imp-35350)
const signedCrossingSlack = T_C_HI - SIGNED_CROSSING_TC; // +7.506428e-6 (signed-crossing event)
const eventDefGap = SIGNED_CROSSING_TC - CONVERGED_TC; // +1.308839e-7 (C2 residual, imp-35354)

export const IMP_35455_R2_N2000_RUNG_CERTIFICATION_SCOPE = {
  ticket: 'imp-35455',
  category: 'proof',
  status: 'PROVISIONAL -- scoping the promotion requirements, no rung advanced',
  predicate: 't_c_flow(2000) <= t_c_hi(2000)  (imp-2528 one-sided true-flow upper bound)',
  tcHi: T_C_HI,
  bakedEndpoint: ENDPOINT_DP45_DT_HALF,
  bakedSlack: endpointSlack,
  gridConvergedTc: CONVERGED_TC,
  gridConvergedSlack: convergedSlack,
  signedCrossingTc: SIGNED_CROSSING_TC,
  signedCrossingSlack,
  eventDefinitionGap: eventDefGap,
  certificationConditions: {
    C1_gridConvergence:
      'Two consecutive base-grid halvings must agree for BOTH families; imp-35350 gives the ' +
      'tauC/8000 -> tauC/16000 collapse (cross-family gap 7.576e-6 -> 0, tie at 1.1923626880e-3). ' +
      'A confirming tauC/32000 rung is still needed to rule out a second resonance node.',
    C2_eventReconciliation:
      'Adopt ONE event definition uniformly and fold in the residual gap. Min-spacing gate ' +
      '(1.1923626880e-3) vs signed-crossing (1.1924935719e-3) differ ~1.31e-7 (imp-35354); the ' +
      'within-step crossing is scheme-independent (imp-35325/imp-35416).',
    C3_envelopeMax:
      'Report the MAX over the full folded envelope (all order-by-grid cells AND both event ' +
      'definitions), never a single cell (imp-35412 one-sided-upper rule). Resolving the resonance ' +
      'drops that max from 1.1999384320e-3 toward the converged 1.1923626880e-3.',
    C4_safetyMargin:
      't_c_converged + (Delta_grid + Delta_event + Delta_fp) <= t_c_hi. The converged slack ' +
      '7.637e-6 absorbs the known Delta_event 1.31e-7; the missing piece is a CERTIFIED Delta_grid ' +
      'from a confirming still-finer rung so the sum is a rigorous upper bound.',
  },
  feasibility:
    'ACHIEVABLE on present evidence -- imp-35350 supplies a grid-converged t_c with a ~7.64e-6 slack ' +
    'dwarfing the ~1.31e-7 event gap; MISSING is one dedicated verified run bundling C1-C4 (a ' +
    'confirming tauC/32000 or interval-rigorous rung certifying Delta_grid under a single event def).',
  scope:
    'ASSESSMENT / SCOPING ONLY; discharges nothing; advances no rung (stays N=1000); recommends NO ' +
    'page edit; does not touch imp-486 GUE conditional; changes NO bound; NO QED',
};

// -- Build-time assertions (import-light; only baked literals). ------------------
export const IMP_35455_R2_N2000_RUNG_CERTIFICATION_SCOPE_ASSERTIONS = [
  {
    name: 'imp-35455: baked endpoint slack is the razor-thin +6.16e-8 (single-grid resonance reading)',
    run: () => endpointSlack > 0 && Math.abs(endpointSlack - 6.15680e-8) < 1e-12,
    detail:
      'RUNGS[5] bakes t_c_hi - 1.1999384320e-3 = +6.156800e-8 (imp-35324/imp-35412); this is the DP45 ' +
      'dt-over-2 single-grid resonance value, not a grid-converged bound -- hence PROVISIONAL.',
  },
  {
    name: 'imp-35455: grid convergence (C1) lifts the slack ~124x once the resonance is resolved',
    run: () =>
      convergedSlack > 0 &&
      Math.abs(convergedSlack - 7.637312e-6) < 1e-11 &&
      convergedSlack / endpointSlack > 100,
    detail:
      'On the imp-35350 tauC/16000 grid both families tie at 1.1923626880e-3, giving slack +7.637e-6, ' +
      'over 100x the baked knife-edge -- the converged bound a certified rung would report.',
  },
  {
    name: 'imp-35455: event-definition gap (C2) is ~1.31e-7, far below the converged slack',
    run: () =>
      Math.abs(eventDefGap - 1.308839e-7) < 1e-12 &&
      eventDefGap > 0 &&
      eventDefGap < convergedSlack / 50,
    detail:
      'The imp-35354 min-spacing-gate vs signed-crossing gap 1.1924935719e-3 - 1.1923626880e-3 = ' +
      '+1.308839e-7 is more than 50x smaller than the grid-converged slack, so C2 is comfortably absorbable.',
  },
  {
    name: 'imp-35455: all candidate collision times clear t_c_hi (bound holds under every definition)',
    run: () =>
      ENDPOINT_DP45_DT_HALF < T_C_HI && CONVERGED_TC < T_C_HI && SIGNED_CROSSING_TC < T_C_HI,
    detail:
      'The predicate t_c_flow < t_c_hi holds for the baked endpoint, the grid-converged tie, and the ' +
      'signed-crossing value; the scoping is about ROBUSTNESS of the reported slack, not whether it clears.',
  },
  {
    name: 'imp-35455: safety-margin sum (C4) t_c_converged + Delta_event stays below t_c_hi',
    run: () => CONVERGED_TC + eventDefGap < T_C_HI && T_C_HI - (CONVERGED_TC + eventDefGap) > 7e-6,
    detail:
      'Folding the known event-definition gap into the converged collision time still clears t_c_hi with ' +
      '>7e-6 to spare; the only uncertified term left is Delta_grid from a confirming still-finer rung.',
  },
];

// Execute at import so any regression trips the build-time assertion sweep.
for (const a of IMP_35455_R2_N2000_RUNG_CERTIFICATION_SCOPE_ASSERTIONS) {
  if (!a.run()) {
    throw new Error(`[imp-35455 R2 N=2000 rung certification scope] FAILED: ${a.name}`);
  }
}
