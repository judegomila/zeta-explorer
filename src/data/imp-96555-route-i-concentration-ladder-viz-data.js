/**
 * @module imp-96555-route-i-concentration-ladder-viz-data
 *
 * imp-96555 (ux): import-light viz-data leaf for the Route I uncertainty/concentration
 * analysis (rh-route-i-uncertainty-concentration-certificate-2026-09-24, layer (I)). Reshapes
 * the classical prolate/Slepian eigenvalue curve lambda_0(c), the dip-concentration moment
 * ladder at a = (ln3)/2 (free / pole-free / two-moment / three-moment), and the pole-free
 * sharp-pencil ratio nu_max into chart-ready rows, so the page can render the "pure
 * concentration bound fails, quantifiably" story without re-deriving anything.
 *
 * No re-derivation: every lambda_0(c), dip-concentration, and nu_max value is copied verbatim
 * from UNCERTAINTY_CERTIFICATE_LITERALS.slepian. Presentation only; changes no bound;
 * establishes no operator positivity; RH open; NO QED; no refereed bound is changed.
 *
 * @see rh-route-i-uncertainty-concentration-certificate-2026-09-24.js (the source module this reshapes)
 *
 * Ticket: imp-96555 (ux, sonnet-4-6, low). Plain exported validation object (imp-96294
 * convention), no self-executing assertion throw.
 */

import { UNCERTAINTY_CERTIFICATE_LITERALS as SRC } from './rh-route-i-uncertainty-concentration-certificate-2026-09-24.js';

// classical prolate/Slepian eigenvalue curve lambda_0(c), general (non-pole-free) bandwidth.
export const IMP96555_CLASSICAL_PROLATE_CURVE = Object.freeze(
  SRC.slepian.classical.map(([c, lambda0]) => Object.freeze({ c, lambda0 })),
);

// the time-bandwidth product at the dip for a = (ln3)/2, and its concentration value read
// off the classical curve (nearest tabulated point c = 0.475 -> lambda_0 = 0.294985).
export const IMP96555_C_DIP = Object.freeze({
  a: 'aLn3Half',
  c: SRC.slepian.cDip.aLn3Half, // 0.4751
  lambda0: SRC.slepian.classical.find((row) => row[0] === 0.475)[1], // 0.294985
});

// dip two-sided concentration ladder at a = (ln3)/2: how much energy of h in L^2(-a,a) the
// dip window I_1 u (-I_1) can carry, as vanishing-moment constraints are added (the pf+1 duplicate
// entry from the source array, identical to pole-free per hhat(0)=0, is folded out).
export const IMP96555_MOMENT_LADDER = Object.freeze([
  Object.freeze({ label: 'free', value: SRC.slepian.aLn3Half.dip[0] }), // 0.30779
  Object.freeze({ label: 'pole-free', value: SRC.slepian.aLn3Half.dip[1] }), // 0.29517
  Object.freeze({ label: '2 moments', value: SRC.slepian.aLn3Half.dip[3] }), // 0.20105
  Object.freeze({ label: '3 moments', value: SRC.slepian.aLn3Half.dip[4] }), // 0.07662
]);

// sharp pencil ratio nu_max = max <T[w_-]h,h>/<T[w_+]h,h> at a = (ln3)/2, pole-free h.
export const IMP96555_PENCIL_RATIO = Object.freeze({
  poleFree: SRC.slepian.aLn3Half.nuMax[0], // 0.997689
  oneMoment: SRC.slepian.aLn3Half.nuMax[1], // 0.955799
  twoMoments: SRC.slepian.aLn3Half.nuMax[2], // 0.493335
  threeMoments: SRC.slepian.aLn3Half.nuMax[3], // 0.258977
});

export const IMP96555_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every lambda_0(c), '
  + 'dip-concentration, and pencil-ratio value plotted here is copied verbatim from the Route I '
  + 'uncertainty/concentration certificate (rh-route-i-uncertainty-concentration-certificate-2026-09-24). '
  + 'The pure concentration bound FAILS on its own (nu_max = 0.997689 means only a 0.23% cancellation '
  + 'separates the negative and positive windows); the certificate module closes D_S <= L_S '
  + 'unconditionally by a different route (Theorem III, constant 9.04e-4), not via this concentration '
  + 'argument. Derivation/measurement diagnostic only, not rigorous; changes no bound, '
  + 'establishes no operator positivity.';

// -- plain validation object (no self-executing throw; the imp-96294 convention) --
export const IMP96555_VALIDATION = Object.freeze({
  classicalCurveMonotoneRising: IMP96555_CLASSICAL_PROLATE_CURVE.every(
    (r, i) => i === 0 || r.lambda0 > IMP96555_CLASSICAL_PROLATE_CURVE[i - 1].lambda0,
  ),
  cDipInClassicalRange: IMP96555_C_DIP.c > 0 && IMP96555_C_DIP.c < 1,
  fourMomentStages: IMP96555_MOMENT_LADDER.length === 4,
  momentLadderMonotoneFalling: IMP96555_MOMENT_LADDER.every(
    (r, i) => i === 0 || r.value < IMP96555_MOMENT_LADDER[i - 1].value,
  ),
  pencilRatioMonotoneFalling:
    IMP96555_PENCIL_RATIO.poleFree > IMP96555_PENCIL_RATIO.oneMoment
    && IMP96555_PENCIL_RATIO.oneMoment > IMP96555_PENCIL_RATIO.twoMoments
    && IMP96555_PENCIL_RATIO.twoMoments > IMP96555_PENCIL_RATIO.threeMoments,
  poleFreeRatioNearOne: IMP96555_PENCIL_RATIO.poleFree > 0.99 && IMP96555_PENCIL_RATIO.poleFree < 1,
});
