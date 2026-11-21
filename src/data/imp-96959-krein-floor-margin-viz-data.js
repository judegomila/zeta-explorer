/**
 * @module imp-96959-krein-floor-margin-viz-data
 *
 * imp-96959 (ux): import-light viz-data leaf for the imp-96938 IMP96938_ETA_NBIG_T800 /
 * IMP96938_T_SENSITIVITY tables (imp-96938-krein-drift-calibration-096.js), which shipped the
 * ln3-vs-2a=0.96 Ritz floor-drift calibration with no viz surface.
 *
 * Reshapes the two per-endpoint Nbig ladders (identical Nbig grid at both 2a=ln3 and 2a=0.96)
 * into a chart-ready side-by-side floor comparison, plus the headline margin contrast that is the
 * whole point of the calibration: the two endpoints share the SAME drift sign structure (eta up /
 * floor down with Nbig, eta down / floor up with T) but differ by a ~25x gap in the absolute
 * floor level (order 12 at 2a=0.96 vs order 0.5 at 2a=ln3).
 *
 * MEASUREMENT / PRESENTATION ONLY. Every number below is copied verbatim from the imp-96938 baked
 * IMP96938_ETA_NBIG_T800 and IMP96938_VERDICT exports (no re-derivation of the Ritz eigenvalue or
 * the Gegenbauer Galerkin build). Ritz floor is an UPPER estimate, not a certified lower bound;
 * interval-rigorous certificate reach stays 2a<=0.96; changes no bound; RH open;
 * no refereed bound is changed. NO QED.
 *
 * @see imp-96938-krein-drift-calibration-096.js (IMP96938_ETA_NBIG_T800, IMP96938_VERDICT)
 *
 * Ticket: imp-96959 (ux, sonnet-4-6, low). Presentation only, RH-free; changes no bound; NO QED.
 */

import { IMP96938_ETA_NBIG_T800, IMP96938_VERDICT } from './imp-96938-krein-drift-calibration-096.js';

// one row per Nbig rung, floor at both endpoints side by side (same Nbig grid at both endpoints)
export const IMP96959_FLOOR_LADDER = IMP96938_ETA_NBIG_T800.ln3.map((row, i) => {
  const a096Row = IMP96938_ETA_NBIG_T800.a096[i];
  return {
    Nbig: row.Nbig,
    floorLn3: row.floor,
    floorA096: a096Row.Nbig === row.Nbig ? a096Row.floor : null,
  };
});

export const IMP96959_MARGIN_CONTRAST = {
  floorMin_ln3: IMP96938_VERDICT.floorMin_ln3,
  floorMin_a096: IMP96938_VERDICT.floorMin_a096,
  ratio: IMP96938_VERDICT.floorMin_a096 / IMP96938_VERDICT.floorMin_ln3,
  driftDirectionsIdenticalBothEndpoints: IMP96938_VERDICT.driftDirectionsIdenticalBothEndpoints,
  marginIsTheOnlyDiscriminant: IMP96938_VERDICT.marginIsTheOnlyDiscriminant,
};

export const IMP96959_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every floor and margin value is copied verbatim from the imp-96938 baked IMP96938_ETA_NBIG_T800 table and IMP96938_VERDICT block (no re-derivation of the Ritz eigenvalue or the Gegenbauer Galerkin build); Ritz floor is an UPPER estimate not a certified lower bound; interval-rigorous certificate reach stays 2a<=0.96; no bound is claimed and no operator positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96959_ASSERTIONS = [
  {
    id: 'imp96959-ladder-matches-source-row-count',
    holds: () =>
      IMP96959_FLOOR_LADDER.length === IMP96938_ETA_NBIG_T800.ln3.length &&
      IMP96959_FLOOR_LADDER.length === IMP96938_ETA_NBIG_T800.a096.length,
    why: 'the reshaped ladder must carry one row per Nbig rung present in both source endpoint arrays.',
  },
  {
    id: 'imp96959-both-floors-present-every-row',
    holds: () => IMP96959_FLOOR_LADDER.every((r) => r.floorLn3 != null && r.floorA096 != null),
    why: 'the two endpoints share the same Nbig grid, so every ladder row must carry a floor value at both 2a=ln3 and 2a=0.96.',
  },
  {
    id: 'imp96959-a096-floor-always-exceeds-ln3-floor',
    holds: () => IMP96959_FLOOR_LADDER.every((r) => r.floorA096 > r.floorLn3),
    why: 'the certified-positive 2a=0.96 endpoint floor must exceed the open-positivity 2a=ln3 floor at every Nbig rung (order 12+ vs order 0.5).',
  },
  {
    id: 'imp96959-margin-contrast-matches-baked-verdict',
    holds: () =>
      Math.abs(IMP96959_MARGIN_CONTRAST.floorMin_ln3 - 0.4756055) < 1e-6 &&
      Math.abs(IMP96959_MARGIN_CONTRAST.floorMin_a096 - 12.0088505) < 1e-6 &&
      Math.abs(IMP96959_MARGIN_CONTRAST.ratio - 25.2496) < 1e-3,
    why: 'the headline margin contrast (~25x gap between the two floor minima) must match the imp-96938 baked verdict literals.',
  },
  {
    id: 'imp96959-drift-and-discriminant-flags-preserved',
    holds: () =>
      IMP96959_MARGIN_CONTRAST.driftDirectionsIdenticalBothEndpoints === true &&
      IMP96959_MARGIN_CONTRAST.marginIsTheOnlyDiscriminant === true,
    why: 'the reshaped module must preserve the imp-96938 finding that drift direction is scheme-generic and the floor margin is the only discriminant between the two endpoints.',
  },
  {
    id: 'imp96959-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP96959_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96959_HONEST_BANNER) &&
      /NO QED/.test(IMP96959_HONEST_BANNER),
    why: 'every Route A-M viz surface carries the RH-open / PT-Lambda / NO-QED markers.',
  },
];

for (const a of IMP96959_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96959-krein-floor-margin-viz-data assertion failed: ${a.id}`);
  }
}
