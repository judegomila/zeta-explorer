/**
 * @module imp-95406-rzpen6-floor-gap-note-staleness-reconciliation
 *
 * imp-95406 (meta): reconciles the imp-95368 honest-status note ("the
 * imp-95332 RZ-PEN6 symbol-pencil floor still sits 3.0-5.1x below the
 * exact infimum at rho = e^6, gap lives in the {0, +-1} pair-truncation
 * and b-uniform t3 legs, both untouched") against the two modules that
 * subsequently executed exactly those two named legs: imp-95333
 * (RZ-PEN7 / LEMMA PAIR-2, pair-truncation leg) and imp-95334 (RZ-PEN8 /
 * LEMMA T-EXACT, b-uniform t3 leg, pointwise side).
 *
 * FINDING: the imp-95368 note is STALE. At rho = e^6, r = 2 the cited
 * looseness 5.060 fell to 3.957 under imp-95333 (pair leg EXECUTED,
 * NEAR-EXHAUSTED, <= 2.8 percent numerator headroom left at the binding
 * chart) and then to 1.084 under imp-95334 (b-uniform t3 leg decided
 * BOTH WAYS: pointwise EXECUTED with the exact per-term weight, chart
 * currency exhausted to within 0.5 percent at the binding chart; only
 * a b-UNIFORM improvement is obstructed, and only at large a, where it
 * affects the r-uniform corollary alone, not the per-(rho, r) floor).
 * The same pattern holds at every rho = e^6 cell imp-95368 cited: r =
 * e^3 (3.254 -> 3.232 -> 1.015) and r = e^5.9 (3.029 -> 2.323 -> 1.036).
 * Both named residual legs are no longer "untouched": the pointwise
 * pencil-floor program is now EFFECTIVELY TERMINAL per imp-95334's own
 * honest limits.
 *
 * CORRECTED RESIDUAL SCOPE (re-cited from imp-95334 HONEST LIMITS, not
 * rederived): (a) ~2.3 percent chart-refinement headroom (K = 4096 vs
 * 256) at rho = e^6; (b) ~2.8 percent kept-pair headroom at the binding
 * chart (imp-95333); (c) the b-uniform-only branch-L BCAP headroom
 * (~10 percent at a = 6), which affects ONLY the r-uniform corollary
 * A_unif, carried unchanged (A_unif8 = A_unif7), not the per-(rho, r)
 * floor; (d) off-lattice rates, unchanged (imp-95232 residual). None of
 * these are the {0, +-1} pair-truncation or b-uniform t3 legs imp-95368
 * named -- those two are closed out.
 *
 * WHAT DOES NOT CHANGE: every-octave firing onsets (13.297836 /
 * 13.071303 / 12.817538) are bitwise unchanged across the whole chain
 * through imp-95334; the rho = 2 certificate floor is bitwise
 * unchanged; Platt-Trudgian Lambda <= 0.2 remains the program's
 * certified bound. AUDIT/RECONCILIATION ONLY: no bound change, no page
 * fabricated; NO QED.
 *
 * Import-light (no imports, no zeros bundle). Numerics below are a
 * cross-check that the re-cited ledger figures from imp-95368,
 * imp-95333, and imp-95334 satisfy the claimed monotone-improvement
 * chain, not a new derivation.
 */

export const IMP95406_RZPEN6_FLOOR_GAP_NOTE_STALENESS_RECONCILIATION = {
  id: 'imp-95406',
  title:
    'Reconciliation: the imp-95368 large-rho floor-gap honest note is ' +
    'STALE -- imp-95333 (RZ-PEN7, pair leg) and imp-95334 (RZ-PEN8, ' +
    'b-uniform t3 leg) subsequently executed both legs it named as ' +
    'untouched',
  auditedNote: 'imp-95368-rzpen6-large-rho-floor-gap-honest-note.js',
  auditedAgainst: [
    'imp-95333-pair-extended-pencil-floor.js',
    'imp-95334-b-exact-trace-pencil-floor.js',
  ],
  loosenessChain: {
    rhoE6R2: { note95368: 5.06029829805588, pen7: 3.957118732272573, pen8: 1.084 },
    rhoE6Re3: { note95368: 3.254, pen7: 3.232, pen8: 1.015 },
    rhoE6Re59: { note95368: 3.029, pen7: 2.323, pen8: 1.036 },
  },
  namedLegsExecuted: {
    pairTruncation:
      'imp-95333 LEMMA PAIR-2: extends the {0, +-1} kept pairs to all ' +
      'distance-1 and distance-2 pairs among shells {-2..2}; EXECUTED ' +
      'and NEAR-EXHAUSTED (<= 2.8 percent numerator headroom at the ' +
      'binding chart)',
    bUniformT3:
      'imp-95334 LEMMA T-EXACT: decides the b-uniform t3 trace weight ' +
      'both ways -- b-uniform improvement OBSTRUCTED at onset scale, ' +
      'pointwise floor EXECUTED via the exact per-term weight ' +
      '2 (1 - s cos(w tau)) / A; pointwise trace currency EXHAUSTED',
  },
  correctedResidualScope: [
    'chart-refinement headroom (~2.3 percent, K = 4096 vs 256, rho = e^6)',
    'kept-pair headroom at the binding chart (~2.8 percent, imp-95333)',
    'b-uniform-only branch-L BCAP headroom (~10 percent at a = 6; ' +
      'r-uniform corollary A_unif only, carried unchanged)',
    'off-lattice rates (imp-95232, unchanged)',
  ],
  unchanged:
    'every-octave firing onsets (13.297836 / 13.071303 / 12.817538) and ' +
    'the rho = 2 certificate floor are bitwise unchanged through ' +
    'imp-95334; no certificate onset has moved across the whole RZ-PEN ' +
    'chain',
  verdict:
    'STALE: the imp-95368 note\'s named residual (pair-truncation and ' +
    'b-uniform t3 legs, both "untouched") no longer describes the ' +
    'current state -- both legs were subsequently EXECUTED by ' +
    'imp-95333 and imp-95334, dropping the rho = e^6 looseness from ' +
    '3.0-5.1x to 1.01-1.08x. The corrected residual scope is chart ' +
    'refinement, kept-pair endpoint headroom, the uniform-only ' +
    'BCAP branch, and off-lattice rates. AUDIT/RECONCILIATION ONLY: ' +
    'changes no bound; NO QED; no refereed bound is changed' +
    '.',
};

const REC = IMP95406_RZPEN6_FLOOR_GAP_NOTE_STALENESS_RECONCILIATION;

export const IMP95406_ASSERTIONS = [
  {
    id: 'imp95406-looseness-chain-monotone-improving',
    description:
      'at each of the three imp-95368-cited (rho, r) cells, the ' +
      're-cited looseness strictly decreases note95368 -> pen7 -> pen8',
    holds: () =>
      Object.values(REC.loosenessChain).every(
        (c) => c.note95368 > c.pen7 && c.pen7 > c.pen8,
      ),
  },
  {
    id: 'imp95406-pen8-below-one-point-one',
    description:
      'the pen8 (imp-95334) looseness at all three cited cells is at ' +
      'most 1.084, matching the "effectively terminal" 1.01-1.08 claim',
    holds: () => Object.values(REC.loosenessChain).every((c) => c.pen8 <= 1.084),
  },
  {
    id: 'imp95406-both-named-legs-recorded-executed',
    description:
      'both legs imp-95368 named as untouched (pair-truncation, ' +
      'b-uniform t3) have a corresponding EXECUTED record here',
    holds: () =>
      /EXECUTED/.test(REC.namedLegsExecuted.pairTruncation) &&
      /NEAR-EXHAUSTED/.test(REC.namedLegsExecuted.pairTruncation) &&
      /EXECUTED/.test(REC.namedLegsExecuted.bUniformT3) &&
      /EXHAUSTED/.test(REC.namedLegsExecuted.bUniformT3),
  },
  {
    id: 'imp95406-corrected-scope-excludes-closed-legs',
    description:
      'the corrected residual scope no longer lists the {0, +-1} ' +
      'pair-truncation or plain b-uniform-t3 legs as open items',
    holds: () =>
      REC.correctedResidualScope.every(
        (s) => !/^\{0, \+-1\}/.test(s) && s !== 'b-uniform t3 weight',
      ) && REC.correctedResidualScope.length === 4,
  },
  {
    id: 'imp95406-honesty-gate',
    description:
      'the verdict declares the prior note STALE, names the corrected ' +
      'scope, records unchanged onsets, is audit-only, and keeps NO ' +
      'QED / PT SOTA framing',
    holds: () =>
      /STALE/.test(REC.verdict) &&
      /corrected residual scope/.test(REC.verdict) &&
      /AUDIT\/RECONCILIATION ONLY/.test(REC.verdict) &&
      /changes no bound/.test(REC.verdict) &&
      /NO QED/.test(REC.verdict) &&
      /refereed bound is changed/i.test(REC.verdict) &&
      /bitwise unchanged/.test(REC.unchanged),
  },
];

for (const a of IMP95406_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95406-rzpen6-floor-gap-note-staleness-reconciliation assertion failed: ${a.id}`,
    );
  }
}

export default IMP95406_RZPEN6_FLOOR_GAP_NOTE_STALENESS_RECONCILIATION;
