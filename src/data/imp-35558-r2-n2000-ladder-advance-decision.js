/**
 * @module imp-35558-r2-n2000-ladder-advance-decision
 * @fileoverview imp-35558: the explicit LADDER-ADVANCE DECISION record for the
 * imp-35324 finer-base-grid (dt = tauC_est/4000) N=2000 R2 clearance. Assesses
 * ONE question: is the imp-35324 four-of-four (0, 1e-4)-gate clearance below
 * t_c_hi=1.2e-3 sufficient to advance the imp-35104 R2 order-robust ladder PAST
 * its imp-35221 N=1000 rung to N=2000, or does it leave residual blockers?
 *
 * WHY THIS WAS OPEN (the decision was never scoped in one place)
 * -------------------------------------------------------------
 * imp-35324 established the finer grid RESOLVES the imp-35235 DP45 dt/2 gate-skip
 * and the worst-case envelope [1.1923626880e-3, 1.1999384320e-3] CLEARS
 * t_c_hi=1.2e-3 (slack +6.156800e-8). A string of downstream modules
 * (imp-35350 still-finer grid, imp-35353 N=3000/4000 extension, imp-35416/35452/
 * 35490 endpoint-positivity, imp-35455 rung-certification scope, imp-35412 slack
 * denominator) each independently ENDED with "ladder stays N=1000", but no single
 * record COLLECTED the decision and its residual blockers. The frontier scout
 * flagged exactly this: the finer-grid clearance is real, yet "the ladder-advance
 * decision never scoped". This module is that scoping -- ASSESSMENT ONLY.
 *
 * DECISION: NOT SUFFICIENT -- LADDER STAYS AT N=1000 (imp-35221)
 * -------------------------------------------------------------
 * The imp-35324 finer-grid clearance is NECESSARY strengthening (it upgrades the
 * imp-35235 three-of-four worst-case FAILURE to a four-of-four PASS) but is NOT
 * SUFFICIENT to advance the certified rung to N=2000. The N=2000 clearance is
 * qualitatively weaker than the N=1000 rung it would supersede:
 *   - N=1000 (imp-35221, CERTIFIED): worst-case slack 9.72e-5, all four RK4/DP45
 *     dt,dt/2 references clean, dt/2 cross-family FULL-PRECISION tie
 *     (both families land the identical t_c=3.2995116440e-3).
 *   - N=2000 (imp-35324, PROVISIONAL): worst-case slack 6.156800e-8 (~1579x
 *     SMALLER, ~1600x below one 1e-4 map cell), dt/2 cross-family gap 7.576e-6
 *     NONZERO -- the full-precision tie is BROKEN.
 * A conservative one-sided upper bound (imp-2528 semantics) may not rest its
 * largest certified rung on a knife-edge that a coarser sibling rung clears by
 * three orders of magnitude.
 *
 * RESIDUAL BLOCKERS (enumerated -- what advancing to N=2000 still needs)
 * ---------------------------------------------------------------------
 * B1 MARGINAL-CLEARANCE KNIFE-EDGE. The 6.156800e-8 slack and the nonzero
 *    7.576e-6 dt/2 cross-family gap. MITIGATED by imp-35350 (on tauC/16000 the
 *    DP45 dt/2 overshoot vanishes, the gap collapses to 0, clearance grows ~124x
 *    to 7.637e-6) BUT the resolution trend is NON-MONOTONE and the confirming
 *    tauC/32000 rung is DEFERRED (open sub-gap imp-35350-sub-tauC32000-rung).
 * B2 ENDPOINT-POSITIVITY / dt/2 SCHEME SPLIT (imp-35416). The DP45 dt/2
 *    step-endpoint gap is POSITIVE (a within-step step-over: the pair re-separates
 *    before the step end) while the RK4 dt/2 endpoint gap is NEGATIVE. imp-35452
 *    shows DP45 dt/2 is the LONE endpoint-positive cell across the 2x3
 *    order x grid matrix (a single-grid resonance, sign flips NEG->POS->NEG under
 *    dt->dt/2->dt/4), and imp-35490 confirms the positivity is a GENUINE order-5
 *    step-over, not a rounding artifact (survives double-double). So the
 *    min-spacing GATE event definition is scheme-fragile at this one cell, even
 *    though the crossing LOCATION is scheme-invariant (imp-35416/35471/35477).
 * B3 NO UP-LADDER GENERALIZATION (imp-35353). The self-scaling finer grid does
 *    NOT keep the near-gate order-5 sampling invariant: the four-of-four clearing
 *    envelope PERSISTS at N=3000 (slack +4.53e-6) but BREAKS at N=4000, where the
 *    DP45 dt/2 step-over RECURS (spurious pair-1495 event above t_c_hi). A rung
 *    advance that fails two rungs higher on the same grid is not a robust ladder.
 * B4 RUNG STAYS PROVISIONAL (imp-35455). Promoting the N=2000 rung from
 *    PROVISIONAL to certified needs a dedicated verified run certifying the
 *    grid-convergence term Delta_grid (the imp-35455 C1 condition); the imp-35354
 *    decomposition shows the ~1.31e-7 event gap is ~500x below the converged
 *    slack, so B4 is the DECISIVE missing piece, not the event definition.
 *
 * NET: the finer-grid lever is the RIGHT direction and CONFIRMS the gate-skip was
 * a resolution artifact, but the N=2000 rung remains PROVISIONAL. Closing B1 (a
 * confirming tauC/32000 monotone rung) plus B4 (a certified Delta_grid) would
 * clear the way; B2/B3 are characterized (scheme-invariant crossing, N-specific
 * resonance) and do not independently block once B1/B4 land. Until then the R2
 * ladder largest-N-robustly-certified STAYS at 1000.
 *
 * SCOPE: ASSESSMENT / DECISION-RECORD ONLY. Advances NO rung by fiat; changes NO
 * bound; extends NO C_mb certificate; removes NO imp-486 GUE conditional; claims
 * NO operator positivity and NO RH verdict. No refereed bound is changed
 * . NO QED.
 *
 * SYNTAX NOTE: avoid star-slash in JSDoc; use "dt/2", "dt/4", "2/diff" prose.
 *
 * @see imp-35324  finer-grid N=2000 clearance (the input this decision scopes)
 * @see imp-35221  R2 ladder N=1000 rung (the last robustly-certified rung)
 * @see imp-35350  still-finer grid (tauC/16000 restores the dt/2 tie) -- B1
 * @see imp-35416  RK4-Hermite endpoint-positivity scheme split -- B2
 * @see imp-35452  endpoint-positivity knife-edge across the order x grid matrix
 * @see imp-35490  double-double confirms the DP45 dt/2 positivity is genuine
 * @see imp-35353  N=3000/4000 extension (envelope breaks at N=4000) -- B3
 * @see imp-35455  N=2000 rung certification scope (C1..C4) -- B4
 * @see imp-35354  grid-vs-event decomposition of the ~1.31e-7 gap
 * @see imp-35412  KEEP the endpoint DP45 dt/2 worst-case slack denominator
 * @see imp-35104  C_MB_WEAKER_K_INTERVAL_SCOPE (requirement R2)
 * @see imp-2528   mapVsFlowSemantics one-sided-flow-bound reclassification
 * @see imp-486    C_mb GUE-conditional provenance
 */

import { IMP_35324_R2_N2000_FINER_GRID_REFERENCE } from './imp-35324-r2-n2000-finer-grid-reference.js';

// ── The two rungs the decision compares (baked literals from the references). ─
// N=1000: imp-35221 certified rung. N=2000: imp-35324 finer-grid clearance.
const N1000_RUNG = {
  N: 1000,
  source: 'imp-35221',
  status: 'certified',
  worstCaseSlack: 9.72e-5,               // t_c_hi(1000)=3.4e-3 minus envelope max 3.3027720310e-3
  dtHalfCrossFamilyGap: 0,               // full-precision tie: both dt/2 families land 3.2995116440e-3
  dtHalfTieFullPrecision: true,
};
const N2000_RUNG = {
  N: 2000,
  source: 'imp-35324',
  status: 'provisional',
  worstCaseSlack: IMP_35324_R2_N2000_FINER_GRID_REFERENCE.r2SlackWorstCase, // +6.156800e-8
  dtHalfCrossFamilyGap: IMP_35324_R2_N2000_FINER_GRID_REFERENCE.crossFamilyGap.dtHalf, // 7.576e-6
  dtHalfTieFullPrecision: false,
};

// Ratio: how much larger the certified N=1000 slack is than the N=2000 knife-edge.
const SLACK_RATIO_N1000_OVER_N2000 = N1000_RUNG.worstCaseSlack / N2000_RUNG.worstCaseSlack; // ~1579x

// ── Residual blockers enumerated. ────────────────────────────────────────────
const RESIDUAL_BLOCKERS = [
  {
    id: 'B1',
    tag: 'marginal-clearance-knife-edge',
    source: 'imp-35324 / imp-35350',
    statement:
      'Worst-case slack 6.156800e-8 with nonzero 7.576e-6 dt/2 cross-family gap. ' +
      'Mitigated on tauC/16000 (overshoot vanishes, gap -> 0, clearance ~124x to ' +
      '7.637e-6) but the resolution trend is NON-MONOTONE and the confirming ' +
      'tauC/32000 rung is DEFERRED.',
    residual: 'imp-35350-sub-tauC32000-rung',
    decisive: true,
  },
  {
    id: 'B2',
    tag: 'endpoint-positivity-scheme-split',
    source: 'imp-35416 / imp-35452 / imp-35490',
    statement:
      'DP45 dt/2 step-endpoint gap POSITIVE (within-step step-over) vs RK4 dt/2 ' +
      'NEGATIVE. Lone endpoint-positive cell in the order x grid matrix ' +
      '(single-grid resonance, GENUINE per double-double). Gate event definition ' +
      'is scheme-fragile at this cell, though the crossing LOCATION is ' +
      'scheme-invariant.',
    residual: 'characterized; not independently blocking once B1/B4 land',
    decisive: false,
  },
  {
    id: 'B3',
    tag: 'no-up-ladder-generalization',
    source: 'imp-35353',
    statement:
      'The self-scaling finer grid does NOT keep the near-gate order-5 sampling ' +
      'invariant: four-of-four envelope PERSISTS at N=3000 (slack +4.53e-6) but ' +
      'BREAKS at N=4000 (DP45 dt/2 step-over recurs above t_c_hi).',
    residual: 'characterized; N-specific resonance, not a monotone up-ladder pass',
    decisive: false,
  },
  {
    id: 'B4',
    tag: 'rung-stays-provisional',
    source: 'imp-35455 / imp-35354',
    statement:
      'Promoting the N=2000 rung from PROVISIONAL to certified needs a dedicated ' +
      'verified run certifying the grid-convergence term Delta_grid (imp-35455 ' +
      'C1). The imp-35354 decomposition shows the ~1.31e-7 event gap is ~500x ' +
      'below the converged slack, so Delta_grid is the decisive missing piece.',
    residual: 'imp-35455 C1 (certified Delta_grid run)',
    decisive: true,
  },
];

export const IMP_35558_R2_N2000_LADDER_ADVANCE_DECISION = {
  id: 'imp-35558',
  title:
    'Ladder-advance decision for the imp-35324 finer-grid (dt=tauC/4000) N=2000 ' +
    'R2 clearance: NOT sufficient to advance past the imp-35221 N=1000 rung; ' +
    'four residual blockers enumerated',
  kind: 'assessment-decision-record',
  changesNoBound: true,
  cMbStaysGueConditional: 'imp-486',
  noQED: true,

  question:
    'Is the imp-35324 four-of-four (0,1e-4)-gate clearance below t_c_hi=1.2e-3 ' +
    'sufficient to advance the R2 order-robust ladder past its imp-35221 N=1000 ' +
    'rung to N=2000?',
  decision: 'NOT-SUFFICIENT',
  ladderStaysAt: 1000,
  ladderWouldAdvanceTo: 2000,

  rungComparison: { n1000: N1000_RUNG, n2000: N2000_RUNG },
  slackRatioN1000OverN2000: SLACK_RATIO_N1000_OVER_N2000,

  residualBlockers: RESIDUAL_BLOCKERS,
  decisiveBlockers: RESIDUAL_BLOCKERS.filter((b) => b.decisive).map((b) => b.id), // B1, B4

  rationale:
    'The finer-grid clearance is NECESSARY strengthening (three-of-four FAILURE ' +
    '-> four-of-four PASS) but the N=2000 worst-case slack (6.156800e-8) is ' +
    '~1579x smaller than the N=1000 certified rung it would supersede (9.72e-5), ' +
    'and its dt/2 cross-family tie is BROKEN (gap 7.576e-6 vs the N=1000 ' +
    'full-precision 0). A conservative one-sided upper bound may not rest its ' +
    'largest certified rung on a knife-edge a coarser rung clears by ~3 orders of ' +
    'magnitude. Closing B1 (confirming tauC/32000 monotone rung) + B4 (certified ' +
    'Delta_grid) would clear the way; B2/B3 are characterized and non-blocking.',

  scope:
    'Assessment / decision-record ONLY. Advances no rung by fiat; changes no ' +
    'bound; extends no C_mb certificate; removes no imp-486 GUE conditional; no ' +
    'operator positivity; no RH verdict. No refereed bound is changed. ' +
    'NO QED.',
};

// ── Build-time assertions (re-derive from the baked literals). ────────────────
export const IMP_35558_R2_N2000_LADDER_ADVANCE_DECISION_ASSERTIONS = [
  {
    id: 'imp35558-decision-not-sufficient-ladder-stays-1000',
    holds: () =>
      IMP_35558_R2_N2000_LADDER_ADVANCE_DECISION.decision === 'NOT-SUFFICIENT' &&
      IMP_35558_R2_N2000_LADDER_ADVANCE_DECISION.ladderStaysAt === 1000 &&
      IMP_35558_R2_N2000_LADDER_ADVANCE_DECISION.ladderStaysAt ===
        IMP_35324_R2_N2000_FINER_GRID_REFERENCE.verdict.largestN_R2_robustly_certified,
    why:
      'The decision must be NOT-SUFFICIENT and keep the ladder at N=1000, ' +
      'consistent with the imp-35324 verdict largestN_R2_robustly_certified=1000.',
  },
  {
    id: 'imp35558-n2000-slack-is-the-knife-edge',
    holds: () => {
      const n2000 = IMP_35558_R2_N2000_LADDER_ADVANCE_DECISION.rungComparison.n2000;
      return (
        n2000.worstCaseSlack === IMP_35324_R2_N2000_FINER_GRID_REFERENCE.r2SlackWorstCase &&
        n2000.worstCaseSlack > 0 &&
        n2000.worstCaseSlack < 1e-6 &&
        n2000.dtHalfCrossFamilyGap ===
          IMP_35324_R2_N2000_FINER_GRID_REFERENCE.crossFamilyGap.dtHalf &&
        n2000.dtHalfCrossFamilyGap > 1e-6 &&
        n2000.dtHalfTieFullPrecision === false
      );
    },
    why:
      'The N=2000 rung must carry the imp-35324 knife-edge slack (positive, ' +
      '< 1e-6) and the BROKEN dt/2 cross-family tie (gap > 1e-6), both sourced ' +
      'from the imp-35324 reference so the record cannot drift from it.',
  },
  {
    id: 'imp35558-n1000-rung-is-cleanly-stronger',
    holds: () => {
      const n1000 = IMP_35558_R2_N2000_LADDER_ADVANCE_DECISION.rungComparison.n1000;
      return (
        n1000.worstCaseSlack > 1e-5 &&
        n1000.dtHalfCrossFamilyGap === 0 &&
        n1000.dtHalfTieFullPrecision === true &&
        IMP_35558_R2_N2000_LADDER_ADVANCE_DECISION.slackRatioN1000OverN2000 > 1000
      );
    },
    why:
      'The certified N=1000 rung must be qualitatively stronger: slack > 1e-5, ' +
      'full-precision dt/2 tie (gap exactly 0), and > 1000x the N=2000 slack -- ' +
      'this is why the conservative ladder does not swap it for the knife-edge.',
  },
  {
    id: 'imp35558-blockers-enumerated-two-decisive',
    holds: () => {
      const b = IMP_35558_R2_N2000_LADDER_ADVANCE_DECISION.residualBlockers;
      const ids = b.map((x) => x.id);
      const decisive = IMP_35558_R2_N2000_LADDER_ADVANCE_DECISION.decisiveBlockers;
      return (
        b.length === 4 &&
        ['B1', 'B2', 'B3', 'B4'].every((k) => ids.includes(k)) &&
        b.every((x) => typeof x.statement === 'string' && x.statement.length > 0) &&
        decisive.length === 2 &&
        decisive.includes('B1') &&
        decisive.includes('B4')
      );
    },
    why:
      'Exactly four residual blockers (B1..B4) must be enumerated with nonempty ' +
      'statements, and the two DECISIVE ones (B1 confirming-finer-rung, B4 ' +
      'certified Delta_grid) flagged -- B2/B3 are characterized, not blocking.',
  },
  {
    id: 'imp35558-assessment-only-no-qed',
    holds: () =>
      IMP_35558_R2_N2000_LADDER_ADVANCE_DECISION.noQED === true &&
      IMP_35558_R2_N2000_LADDER_ADVANCE_DECISION.changesNoBound === true &&
      IMP_35558_R2_N2000_LADDER_ADVANCE_DECISION.cMbStaysGueConditional === 'imp-486' &&
      IMP_35558_R2_N2000_LADDER_ADVANCE_DECISION.kind === 'assessment-decision-record',
    why:
      'Assessment/decision-record only: no QED, changes no bound, C_mb stays ' +
      'GUE-conditional per imp-486. The record advances no rung by fiat.',
  },
];
