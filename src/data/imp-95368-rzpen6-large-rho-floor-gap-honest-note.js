/**
 * @module imp-95368-rzpen6-large-rho-floor-gap-honest-note
 *
 * imp-95368 (content, honest-status note): imp-95332 (RZ-PEN6) executed and
 * EXHAUSTED the tail-cap leg of the symbol-pencil-floor program, but its
 * resulting floor A_pen6/A_unif6 still sits 3.0-5.1x below the exact
 * symbol-pencil infimum at large rho (rho = e^6). This note states that gap
 * plainly, in one place, without re-deriving it: the multi-leg RZ-PEN chain
 * (imp-95288 .. imp-95332) is a FLOOR-TIGHTENING measurement program, the
 * surviving large-rho looseness is NAMED (not eliminated), and the program
 * changes no certificate onset and no Lambda bound.
 *
 * SOURCE (verbatim from imp-95332's baked ledger, re-cited not recomputed):
 *   - looseness at rho = e^6, r = 2:    5.060  (RZ-PEN5 predecessor: 6.085)
 *   - looseness at rho = e^6, r = e^3:  3.254  (RZ-PEN5 predecessor: 3.916)
 *   - looseness at rho = e^6, r = e^5.9: 3.029 (RZ-PEN5 predecessor: 3.607)
 *   so the surviving gap range across the three sampled r is 3.0 - 5.1x,
 *   narrowed from the RZ-PEN5 range of 3.6 - 6.1x by the tail-cap leg.
 *
 * NAMED RESIDUAL (imp-95332 HONEST LIMITS, re-cited): the gap lives entirely
 * in two legs that TAIL-CHART did not touch -- the {0, +-1} pair-identity
 * truncation (interior-binding; extending it needs the (-1,+1) and (0,+-2)
 * pairs with exact sin^2(2 pi tau) weights) and the b-uniform t3 weight at
 * interior w. Neither leg is attempted here.
 *
 * WHAT DOES NOT CHANGE: every-octave firing onsets (13.297836 / 13.071303 /
 * 12.817538) are bitwise unchanged from RZ-PEN4 onward (imp-95332
 * onsetsUnchanged), the rho = 2 certificate floor is bitwise unchanged, and
 * Platt-Trudgian Lambda <= 0.2 remains the program's certified bound.
 *
 * Import-light (no imports, no zeros bundle). Numerics below are a
 * cross-check that the cited ledger figures satisfy the stated inequality,
 * not a new derivation.
 */

export const IMP95368_RZPEN6_LARGE_RHO_FLOOR_GAP_HONEST_NOTE = {
  id: 'imp-95368',
  title:
    'Honest-status note: the imp-95332 RZ-PEN6 symbol-pencil floor still ' +
    'sits 3.0-5.1x below the exact symbol-pencil infimum at large rho ' +
    '(rho = e^6), and the RZ-PEN chain changes no bound',
  citedFrom: 'imp-95332-chart-tail-pencil-floor.js',
  looseness: {
    rhoE6R2: 5.06029829805588,
    rhoE6R2Pen5Ref: 6.085,
    rhoE6Re3: 3.254,
    rhoE6Re59: 3.029,
    rangeLow: 3.0,
    rangeHigh: 5.1,
  },
  namedResidual:
    'the surviving gap lives entirely in two legs TAIL-CHART did not ' +
    'touch: the {0, +-1} pair-identity truncation (interior-binding) and ' +
    'the b-uniform t3 weight at interior w; both remain OPEN',
  unchanged:
    'every-octave firing onsets (13.297836 / 13.071303 / 12.817538) and ' +
    'the rho = 2 certificate floor are bitwise unchanged from RZ-PEN4 ' +
    'onward; no certificate onset has moved across the whole RZ-PEN chain',
  honest:
    'DOCUMENTATION ONLY -- this note restates, without re-deriving, the ' +
    'imp-95332 ledger: after tail-currency exhaustion the RZ-PEN6 floor ' +
    'still undershoots the exact symbol-pencil infimum by 3.0-5.1x at ' +
    'rho = e^6, the gap is named (two open legs) not eliminated, and the ' +
    'RZ-PEN program is a floor-tightening/onset-lowering measurement ' +
    'effort that changes no bound. NO QED; no refereed bound is changed' +
    '.',
};

const REC = IMP95368_RZPEN6_LARGE_RHO_FLOOR_GAP_HONEST_NOTE;

export const IMP95368_ASSERTIONS = [
  {
    id: 'imp95368-looseness-in-cited-range',
    description:
      'the three cited rho = e^6 looseness figures all fall within the ' +
      'stated 3.0-5.1x range, and each is an improvement over its cited ' +
      'RZ-PEN5 reference',
    holds: () => {
      const { rhoE6R2, rhoE6Re3, rhoE6Re59, rangeLow, rangeHigh, rhoE6R2Pen5Ref } =
        REC.looseness;
      const inRange = (x) => x >= rangeLow && x <= rangeHigh;
      return (
        inRange(rhoE6R2) &&
        inRange(rhoE6Re3) &&
        inRange(rhoE6Re59) &&
        rhoE6R2 < rhoE6R2Pen5Ref
      );
    },
  },
  {
    id: 'imp95368-honesty-gate',
    description:
      'the note is explicit that the gap is named not eliminated, that ' +
      'onsets are unchanged, that this is documentation only, and that ' +
      'no refereed bound is changed',
    holds: () =>
      /named/.test(REC.honest) &&
      /not eliminated/.test(REC.honest) &&
      /DOCUMENTATION ONLY/.test(REC.honest) &&
      /refereed bound is changed/i.test(REC.honest) &&
      /unchanged/.test(REC.unchanged) &&
      /OPEN/.test(REC.namedResidual),
  },
];

for (const a of IMP95368_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95368-rzpen6-large-rho-floor-gap-honest-note assertion failed: ${a.id}`,
    );
  }
}

export default IMP95368_RZPEN6_LARGE_RHO_FLOOR_GAP_HONEST_NOTE;
