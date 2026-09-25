/**
 * @module imp-96898-katotemple-residual-viz-data
 * @fileoverview imp-96898 -- import-light viz-data leaf for the imp-96875 Kato-Temple residual
 *   scout: a residual-vs-Nbig divergence curve at fixed N=20 (1.65e3 -> 2.60e4, the unbounded-
 *   operator signature) and a floor-vs-N bar showing the direct Kato-Temple floor worsening
 *   (-8.3e5 -> -4.0e7) despite a positive provisional Ritz seed beta ~ 1e2. Bakes the imp-96875
 *   rows as plain literals so any consuming page avoids the heavy zeros-bundle import chain.
 *
 * SOURCE. imp-96875 (numerical, SCOUT): granting a provisional Ritz lambda_2 as the Kato-Temple
 * seed beta clears KT2 (mu < beta) comfortably, but the out-of-space residual ||T g - mu g||
 * diverges as the evaluation space grows (trial in the form domain, not the operator domain),
 * so the direct floor mu - residual^2/(beta-mu) is massively negative and WORSENS with N. No
 * operator positivity established; NO QED.
 *
 * @see imp-96875-krein-katotemple-residual-scout.js (source finding, full derivation)
 * @see imp-96865-krein-katotemple-lambda2-lowerbound-obstruction.js (complementary certified-seed obstruction)
 */

// residual-vs-Nbig divergence curve at fixed N=20 (imp-96875 IMP96875_RESIDUAL_GROWTH_N20):
// the out-of-space Kato-Temple residual grows without bound as the evaluation space widens.
export const IMP96898_RESIDUAL_GROWTH_N20 = Object.freeze([
  Object.freeze({ Nbig: 24, residual: 1.6464e3 }),
  Object.freeze({ Nbig: 30, residual: 4.6009e3 }),
  Object.freeze({ Nbig: 40, residual: 9.5885e3 }),
  Object.freeze({ Nbig: 60, residual: 1.6248e4 }),
  Object.freeze({ Nbig: 80, residual: 1.9930e4 }),
  Object.freeze({ Nbig: 120, residual: 2.6036e4 }),
]);

// floor-vs-N bar (imp-96875 IMP96875_SCOUT): direct Kato-Temple floor worsens with N even
// though the provisional seed beta ~ 1e2 comfortably clears KT2 (mu < beta).
export const IMP96898_FLOOR_VS_N = Object.freeze([
  Object.freeze({ N: 20, mu: 0.625397, betaN: 110.734672, floorBetaN: -834980.47 }),
  Object.freeze({ N: 28, mu: 0.598141, betaN: 104.284155, floorBetaN: -7677116.9 }),
  Object.freeze({ N: 36, mu: 0.588067, betaN: 101.641337, floorBetaN: -24660459.1 }),
  Object.freeze({ N: 44, mu: 0.583422, betaN: 99.527635, floorBetaN: -39561536.5 }),
]);

export const IMP96898_VERDICT = Object.freeze({
  ticket: 'imp-96898',
  sourceTicket: 'imp-96875',
  seedClearsKT2: true,             // beta ~ 1e2 >> mu ~ 0.6 at every rung
  residualDivergesWithEvalSpace: true, // 1.65e3 -> 2.60e4 at fixed N=20
  floorWorsensWithN: true,         // -8.3e5 -> -4.0e7
  directFloorPositive: false,
  bindingObstruction: 'residual (operator-domain) leg, not the beta seed',
  operatorPositivityProved: false,
  qed: false,
});

export default {
  residualGrowthN20: IMP96898_RESIDUAL_GROWTH_N20,
  floorVsN: IMP96898_FLOOR_VS_N,
  verdict: IMP96898_VERDICT,
};

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96898_ASSERTIONS = [
  {
    id: 'imp96898-residual-monotone-and-in-range',
    holds: () =>
      IMP96898_RESIDUAL_GROWTH_N20.every((r, i) => i === 0 || r.residual > IMP96898_RESIDUAL_GROWTH_N20[i - 1].residual) &&
      IMP96898_RESIDUAL_GROWTH_N20[0].residual > 1e3 && IMP96898_RESIDUAL_GROWTH_N20[0].residual < 2e3 &&
      IMP96898_RESIDUAL_GROWTH_N20[5].residual > 2.5e4 && IMP96898_RESIDUAL_GROWTH_N20[5].residual < 2.7e4,
    why: 'the imp-96875 out-of-space residual grows monotonically from 1.65e3 (Nbig=24) to 2.60e4 (Nbig=120) at fixed N=20: the unbounded-operator signature, not a converging quantity.',
  },
  {
    id: 'imp96898-floor-worsens-and-seed-clears-kt2',
    holds: () =>
      IMP96898_FLOOR_VS_N.every((r) => r.betaN > r.mu) &&
      IMP96898_FLOOR_VS_N.every((r) => r.floorBetaN < 0) &&
      IMP96898_FLOOR_VS_N.every((r, i) => i === 0 || r.floorBetaN < IMP96898_FLOOR_VS_N[i - 1].floorBetaN),
    why: 'the provisional Ritz seed beta ~ 1e2 clears KT2 (mu < beta) at every N, yet the direct Kato-Temple floor is negative and gets MORE negative as N grows (-8.3e5 at N=20 to -4.0e7 at N=44).',
  },
  {
    id: 'imp96898-scout-only-no-qed',
    holds: () =>
      IMP96898_VERDICT.directFloorPositive === false &&
      IMP96898_VERDICT.operatorPositivityProved === false &&
      IMP96898_VERDICT.qed === false,
    why: 'scouting only: no positive direct floor, no operator-positivity theorem, and no QED is claimed.',
  },
];

for (const a of IMP96898_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96898-katotemple-residual-viz-data assertion failed: ${a.id}`);
  }
}
