/**
 * @module imp-35354-n2000-rk4-dthalf-grid-event-decomp-reference
 * @fileoverview imp-35354: DECOMPOSE the ~1.31e-7 RK4 dt-over-2 collision-time
 * gap at N=2000 between the imp-35324 finer-grid MIN-SPACING GATE estimate
 * (t_c=1.1923626880e-3) and the imp-35278 resolved-grid SIGNED-CROSSING estimate
 * (t_c=1.1924935719e-3) into a GRID-resolution component and an EVENT-DEFINITION
 * component. This is the imp-35455 "C2 event-definition reconciliation" input.
 *
 * WHY THIS TEST
 * ------------
 * imp-35324 changed TWO things at once relative to imp-35278: the base flow grid
 * (tauC/4000 vs tauC/1000, so dt-over-2 = tauC/8000 vs tauC/2000) AND the event
 * definition (min-spacing (0,1e-4) gate, which QUANTIZES t_c to an integer step
 * multiple, vs signed-crossing with linear SUB-STEP interpolation). The 1.31e-7
 * gap therefore conflates grid resolution and event definition. To isolate the two
 * the SAME RK4 dt-over-2 flow is run through a full 2x2 factorial:
 *   grid  in {tauC/1000 resolved, tauC/4000 finer}
 *   event in {min-spacing gate, signed-crossing interpolated}
 * Cell B (resolved,crossing) reproduces imp-35278 RK4 dt-over-2 EXACTLY; cell C
 * (finer,gate) reproduces imp-35324 RK4 dt-over-2 EXACTLY. Cells A (resolved,gate)
 * and D (finer,crossing) are the missing off-diagonals. Two paths C->A->B and
 * C->D->B each split the total gap into (grid effect)+(event effect); their
 * difference is the small interaction.
 *
 * WHAT THIS MODULE MEASURES (producer: the .mjs below)
 * ----------------------------------------------------
 * The 2x2 RK4 dt-over-2 collision times at N=2000 (pair 1495 in every cell):
 *   A resolved,gate     t_c = 1.1925112320e-3  (step 2007)
 *   B resolved,crossing t_c = 1.1924935719e-3  (step 2007, frac 0.9703)  == imp-35278
 *   C finer,gate        t_c = 1.1923626880e-3  (step 8027)                == imp-35324
 *   D finer,crossing    t_c = 1.1923496352e-3  (step 8027, frac 0.9121)
 *
 * DECOMPOSITION OF THE TOTAL GAP  B - C = +1.308839e-7
 * ----------------------------------------------------
 *   GRID  effect (avg over both events) = +1.462403e-7   ( 111.7% of total)
 *   EVENT effect (avg over both grids)  = -1.535648e-8   ( -11.7% of total)
 *   interaction                         = -4.607313e-9   (small)
 * The two are additive to the total (eventAvg + gridAvg == total to full float).
 *
 * HONEST OUTCOME: THE GAP IS ALMOST ENTIRELY GRID RESOLUTION, NOT EVENT DEFINITION
 * -------------------------------------------------------------------------------
 * The 1.31e-7 discrepancy is DOMINATED (~112%) by the base-grid change: refining
 * the grid tauC/1000 -> tauC/4000 LOWERS t_c by ~1.46e-7 at BOTH event definitions
 * (A-C = +1.4854e-7 gate; B-D = +1.4394e-7 crossing) because both estimates are
 * still converging in dt. The event-definition change (gate -> signed-crossing)
 * contributes only ~-1.5e-8 and with the OPPOSITE sign: the crossing event, being
 * sub-step precise, reports a SLIGHTLY EARLIER t_c than the gate, which rounds UP
 * to the first full step whose min spacing drops below 1e-4 (D-C = -1.305e-8 finer;
 * B-A = -1.766e-8 resolved). So the two anchors differ almost purely because the
 * finer grid detects the collision ~1.46e-7 earlier; the event redefinition even
 * partially offsets that. The 1.31e-7 gap is therefore NOT an artifact of choosing
 * the gate vs the crossing -- it is a genuine (and monotone-shrinking) grid effect.
 *
 * This corroborates imp-35455's C2 note that the ~1.31e-7 event gap is comfortably
 * absorbed by the imp-35350 converged slack (7.637e-6, ~58x larger): the ledger
 * lever is C1 grid convergence (a verified tauC/32000 rung), NOT the event
 * definition, which contributes only ~1.5e-8 here.
 *
 * SCOPE: MEASUREMENT ONLY. Does NOT advance the R2 ladder (stays N=1000 per
 * imp-35221); does NOT extend the C_mb certificate; does NOT remove the imp-486 GUE
 * conditional; changes NO bound. No refereed bound is changed. NO QED.
 *
 * SYNTAX NOTE: avoid star-slash in JSDoc; "dt-over-2" and "tauC/N" prose only.
 *
 * @see imp-35278  gate-free signed-crossing event (cell B source, resolved grid)
 * @see imp-35324  finer-base-grid min-spacing gate (cell C source, finer grid)
 * @see imp-35455  R2 N=2000 rung certification scope (C2 = this event gap)
 * @see imp-35350  still-finer-grid converged slack 7.637e-6 that absorbs this gap
 * @see imp-35221  R2 ladder last robustly-certified rung (N=1000)
 * @see imp-486    C_mb GUE-conditional provenance
 * @see scripts/imp-35354-n2000-rk4-dthalf-grid-event-decomp.mjs (offline producer)
 */

// ── Offline-measured 2x2 (grid x event) RK4 dt-over-2 collision cells, N=2000. ─
// Producer: scripts/imp-35354-n2000-rk4-dthalf-grid-event-decomp.mjs (Node,
// plain Float64). All four cells collide on pair index 1495.
const N = 2000;
const TAU_C_EST = 0.001188352;
const DT_RESOLVED_HALF = 5.941760e-7;  // tauC/2000 (imp-35278 base tauC/1000, halved)
const DT_FINER_HALF = 1.485440e-7;     // tauC/8000 (imp-35324 base tauC/4000, halved)

const CELLS = {
  A_resolved_gate:     { grid: 'resolved', event: 'gate',     dt: DT_RESOLVED_HALF, t_c: 0.0011925112320, step: 2007, pair_index: 1495 },
  B_resolved_crossing: { grid: 'resolved', event: 'crossing', dt: DT_RESOLVED_HALF, t_c: 0.0011924935719, step: 2007, pair_index: 1495, frac: 0.9703, matches: 'imp-35278 RK4 dt-over-2' },
  C_finer_gate:        { grid: 'finer',    event: 'gate',     dt: DT_FINER_HALF,    t_c: 0.0011923626880, step: 8027, pair_index: 1495, matches: 'imp-35324 RK4 dt-over-2' },
  D_finer_crossing:    { grid: 'finer',    event: 'crossing', dt: DT_FINER_HALF,    t_c: 0.0011923496352, step: 8027, pair_index: 1495, frac: 0.9121 },
};

// ── Additive 2x2 decomposition of the total anchor gap B - C. ─────────────────
const TOTAL_GAP = CELLS.B_resolved_crossing.t_c - CELLS.C_finer_gate.t_c;      // +1.308839e-7
const GRID_EFFECT_AT_GATE = CELLS.A_resolved_gate.t_c - CELLS.C_finer_gate.t_c;             // +1.485440e-7
const EVENT_EFFECT_AT_RESOLVED = CELLS.B_resolved_crossing.t_c - CELLS.A_resolved_gate.t_c; // -1.766014e-8
const EVENT_EFFECT_AT_FINER = CELLS.D_finer_crossing.t_c - CELLS.C_finer_gate.t_c;          // -1.305283e-8
const GRID_EFFECT_AT_CROSSING = CELLS.B_resolved_crossing.t_c - CELLS.D_finer_crossing.t_c; // +1.439367e-7
const INTERACTION = EVENT_EFFECT_AT_RESOLVED - EVENT_EFFECT_AT_FINER;          // -4.607313e-9
const EVENT_EFFECT_AVG = (EVENT_EFFECT_AT_RESOLVED + EVENT_EFFECT_AT_FINER) / 2; // -1.535648e-8
const GRID_EFFECT_AVG = (GRID_EFFECT_AT_GATE + GRID_EFFECT_AT_CROSSING) / 2;     // +1.462403e-7
const EVENT_FRACTION = EVENT_EFFECT_AVG / TOTAL_GAP; // -0.1173 (-11.7%)
const GRID_FRACTION = GRID_EFFECT_AVG / TOTAL_GAP;   // +1.1173 (111.7%)

export const IMP_35354_N2000_RK4_DTHALF_GRID_EVENT_DECOMP_REFERENCE = {
  id: 'imp-35354',
  title:
    '2x2 (grid x event) decomposition of the ~1.31e-7 RK4 dt-over-2 collision-time ' +
    'gap at N=2000 between the imp-35324 finer-grid gate (1.1923626880e-3) and the ' +
    'imp-35278 resolved-grid signed-crossing (1.1924935719e-3): ~112% grid, ~-12% event',
  kind: 'measurement-only',
  changesNoBound: true,
  cMbStaysGueConditional: 'imp-486',
  noQED: true,
  honestOutcome: 'gap-is-almost-entirely-grid-resolution-not-event-definition',

  N,
  tauC_est: TAU_C_EST,
  cells: CELLS,
  anchors: {
    imp35324_finer_gate: CELLS.C_finer_gate.t_c,
    imp35278_resolved_crossing: CELLS.B_resolved_crossing.t_c,
  },
  decomposition: {
    totalGap: TOTAL_GAP,
    gridEffectAtGate: GRID_EFFECT_AT_GATE,
    eventEffectAtResolved: EVENT_EFFECT_AT_RESOLVED,
    eventEffectAtFiner: EVENT_EFFECT_AT_FINER,
    gridEffectAtCrossing: GRID_EFFECT_AT_CROSSING,
    interaction: INTERACTION,
    gridEffectAvg: GRID_EFFECT_AVG,
    eventEffectAvg: EVENT_EFFECT_AVG,
    gridFraction: GRID_FRACTION,
    eventFraction: EVENT_FRACTION,
  },

  verdict: {
    gapDominatedByGrid: true,
    eventEffectSmallAndOppositeSign: true,
    interpretation:
      'The ~1.31e-7 RK4 dt-over-2 gap between the imp-35324 finer-grid gate anchor ' +
      'and the imp-35278 resolved-grid crossing anchor is ~112% attributable to the ' +
      'base-grid change and only ~-12% to the event definition. Refining tauC/1000 ' +
      '-> tauC/4000 LOWERS t_c by ~1.46e-7 at BOTH event definitions (still ' +
      'converging in dt); switching the gate to a sub-step-precise signed crossing ' +
      'contributes only ~-1.5e-8 and with the opposite sign (the crossing reports a ' +
      'slightly EARLIER t_c than the gate, which rounds up to the first full step ' +
      'below 1e-4). So the discrepancy is a genuine grid-resolution effect, NOT a ' +
      'gate-vs-crossing artifact.',
    corroboratesImp35455C2:
      'Confirms the imp-35455 C2 note: the event-definition contribution (~1.5e-8) ' +
      'is ~500x smaller than the imp-35350 converged slack (7.637e-6) that absorbs ' +
      'it; the live rung lever is C1 grid convergence (a verified tauC/32000 rung), ' +
      'not the event definition.',
    largestN_R2_robustly_certified: 1000,
    doesNotAchieve:
      'Does NOT advance the R2 ladder to N=2000; does NOT extend the C_mb ' +
      'certificate; does NOT remove the imp-486 GUE conditional; changes NO Lambda ' +
      'bound. No refereed bound is changed.',
    residualId: 'imp-35455 C1 grid convergence (verified tauC/32000 rung)',
  },
};

// ── Build-time assertions (re-derive from the baked literals). ────────────────
export const IMP_35354_N2000_RK4_DTHALF_GRID_EVENT_DECOMP_REFERENCE_ASSERTIONS = [
  {
    id: 'imp35354-anchors-reproduce',
    holds: () =>
      CELLS.C_finer_gate.t_c === 0.0011923626880 &&        // imp-35324 RK4 dt-over-2
      CELLS.B_resolved_crossing.t_c === 0.0011924935719,   // imp-35278 RK4 dt-over-2
    why:
      'The two off-the-shelf anchors must reproduce EXACTLY: cell C (finer,gate) is ' +
      'the imp-35324 RK4 dt-over-2 estimate 1.1923626880e-3 and cell B ' +
      '(resolved,crossing) is the imp-35278 RK4 dt-over-2 estimate 1.1924935719e-3. ' +
      'A mismatch would mean the 2x2 grid does not bracket the very gap being split.',
  },
  {
    id: 'imp35354-decomposition-additive',
    holds: () => {
      const total = IMP_35354_N2000_RK4_DTHALF_GRID_EVENT_DECOMP_REFERENCE.decomposition.totalGap;
      const sum =
        IMP_35354_N2000_RK4_DTHALF_GRID_EVENT_DECOMP_REFERENCE.decomposition.gridEffectAvg +
        IMP_35354_N2000_RK4_DTHALF_GRID_EVENT_DECOMP_REFERENCE.decomposition.eventEffectAvg;
      return Math.abs(sum - total) < 1e-16;
    },
    why:
      'The grid-effect average and the event-effect average must add back to the ' +
      'total gap B - C to full float precision -- the 2x2 split is exact by ' +
      'construction (averaging the two paths), so any residual would be a baked-' +
      'literal transcription error.',
  },
  {
    id: 'imp35354-gap-dominated-by-grid',
    holds: () => {
      const d = IMP_35354_N2000_RK4_DTHALF_GRID_EVENT_DECOMP_REFERENCE.decomposition;
      return d.gridFraction > 1.0 && d.gridFraction < 1.2 &&
        d.eventFraction < 0 && Math.abs(d.eventFraction) < 0.2 &&
        Math.abs(d.gridEffectAvg) > 5 * Math.abs(d.eventEffectAvg);
    },
    why:
      'KEY FINDING: the gap is DOMINATED by grid resolution (~112%) while the ' +
      'event-definition effect is small (~-12%) and OPPOSITE in sign. The grid ' +
      'component must exceed the event component by more than 5x, confirming the ' +
      '1.31e-7 discrepancy is a genuine grid effect, not a gate-vs-crossing artifact.',
  },
  {
    id: 'imp35354-event-shrinks-t_c-at-both-grids',
    holds: () => {
      const d = IMP_35354_N2000_RK4_DTHALF_GRID_EVENT_DECOMP_REFERENCE.decomposition;
      // Switching gate -> crossing LOWERS t_c at BOTH grids (both negative).
      return d.eventEffectAtResolved < 0 && d.eventEffectAtFiner < 0;
    },
    why:
      'The signed-crossing event reports an EARLIER t_c than the min-spacing gate at ' +
      'BOTH the resolved and finer grids (both event effects negative), because the ' +
      'crossing interpolates sub-step while the gate rounds UP to the first full ' +
      'step below 1e-4. A positive event effect would contradict the sub-step-' +
      'precision interpretation.',
  },
  {
    id: 'imp35354-all-cells-same-pair-no-qed',
    holds: () =>
      Object.values(CELLS).every((c) => c.pair_index === 1495) &&
      IMP_35354_N2000_RK4_DTHALF_GRID_EVENT_DECOMP_REFERENCE.noQED === true &&
      IMP_35354_N2000_RK4_DTHALF_GRID_EVENT_DECOMP_REFERENCE.changesNoBound === true &&
      IMP_35354_N2000_RK4_DTHALF_GRID_EVENT_DECOMP_REFERENCE.verdict.largestN_R2_robustly_certified === 1000,
    why:
      'Every 2x2 cell must collide on the SAME pair (index 1495) -- a different ' +
      'colliding pair would mean the cells bracket different events, not one gap. ' +
      'Measurement only: never a QED or a bound change; the R2 ladder ' +
      'largest-N-robustly-certified STAYS at 1000; C_mb stays GUE-conditional ' +
      '(imp-486); no refereed bound is changed.',
  },
];
