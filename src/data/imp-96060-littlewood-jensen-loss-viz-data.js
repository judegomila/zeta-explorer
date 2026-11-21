/**
 * @module imp-96060-littlewood-jensen-loss-viz-data
 *
 * imp-96060 (ux): lightweight, import-light viz-data module for a chart of the Route K
 * (rh-routes-jkl-non-statmech-external-input-hunt-2026-09-23.js) Littlewood integral I(T) vs the
 * Jensen-from-first-moment upper bound J_1(T): I(T) stays O(log T) (in fact |I|/log T shrinks) while
 * J_1(T) grows like (T/2) log log T, so the loss factor J_1/|I| widens from 10x at T=50 to 141x at
 * T=200 to 2828x at T=500 -- moments only see zeros through Littlewood's INTEGRATED lemma, never
 * pointwise.
 *
 * Reference literals are copied verbatim from ROUTE_K.littlewoodVsJensen -- no re-derivation here.
 * Presentation only; changes no bound; NO QED.
 *
 * @see rh-routes-jkl-non-statmech-external-input-hunt-2026-09-23.js (source module: ROUTE_K)
 *
 * Ticket: imp-96060 (ux, low). RH-equivalent; no refereed bound is changed; NO QED.
 */

// [T, I(T), J_1(T) = (T/2) log(M_1/T), loss = J_1/|I|]
export const IMP96060_LITTLEWOOD_VS_JENSEN = [
  { T: 50, I: -2.067564, J1: 21.01831, loss: 10.165735 },
  { T: 100, I: -1.75593, J1: 53.501557, loss: 30.469078 },
  { T: 150, I: -1.347885, J1: 89.270729, loss: 66.230246 },
  { T: 200, I: -0.924121, J1: 130.404351, loss: 141.111837 },
  { T: 500, I: -0.134003, J1: 378.9379, loss: 2827.826 },
];

export const IMP96060_HEADLINE = { T: 200, absI: 0.924121, J1: 130.404351, loss: 141.111837 };
