/**
 * @module imp-97321-signed-half-creep-ladder-viz-data
 *
 * imp-97321 (ux): import-light viz-data leaf for the imp-97286 signed-half creep ladder
 * (imp-97286-route-m-signed-half-creep-ladder.js), which had baked the extended
 * S(b)/(phi(b) b) ladder (b=24001..64007) and its winning C/b creep fit but no chart-ready
 * surface pairing the measured points against the fitted curve and the extrapolated asymptote.
 *
 * Reshapes the baked imp-97286 IMP97286_LADDER rows into a single chart-ready series: each row
 * carries the measured signed(b), the C/b-model prediction L + C/b at that b, and the residual
 * between them (how far the finite-b value still sits from the extrapolated asymptote). Also
 * exposes the asymptote L ~ -0.079575 and creep constant C ~ 1.45 as a flat summary object for an
 * asymptote reference line.
 *
 * MEASUREMENT / PRESENTATION ONLY. Every (b, signed) value below is copied verbatim from the
 * imp-97286 baked IMP97286_LADDER (no re-derivation of the V(h,k) cotangent sums); the C/b curve
 * uses the imp-97286 baked IMP97286_CREEP asymptoteL/creepConstantC. Changes no bound, establishes
 * no operator positivity, no RH claim; no refereed bound is changed. RH open. NO QED.
 *
 * @see imp-97286-route-m-signed-half-creep-ladder.js (IMP97286_LADDER, IMP97286_CREEP, IMP97286_VERDICT)
 *
 * Ticket: imp-97321 (ux, sonnet-4-6, low). Presentation only, RH-free; changes no bound; NO QED.
 */

import {
  IMP97286_LADDER,
  IMP97286_CREEP,
  IMP97286_VERDICT,
} from './imp-97286-route-m-signed-half-creep-ladder.js';

// one row per ladder point, ascending b, with the C/b-model prediction and its residual.
export const IMP97321_CREEP_ROWS = IMP97286_LADDER.map((row) => {
  const predicted = IMP97286_CREEP.asymptoteL + IMP97286_CREEP.creepConstantC / row.b;
  return {
    ...row,
    predictedCb: predicted,
    residual: row.signed - predicted,
  };
});

export const IMP97321_ASYMPTOTE = Object.freeze({
  form: IMP97286_CREEP.form, // 'signed(b) = L + C/b'
  asymptoteL: IMP97286_CREEP.asymptoteL, // ~-0.079575
  creepConstantC: IMP97286_CREEP.creepConstantC, // ~1.45
  lastMeasured: IMP97286_LADDER[IMP97286_LADDER.length - 1].signed, // -0.079551 at b=64007
});

export const IMP97321_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every (b, signed) row is ' +
  'copied verbatim from the imp-97286 baked IMP97286_LADDER (no re-derivation of the V(h,k) ' +
  'cotangent sums); the C/b curve reuses the imp-97286 baked asymptoteL/creepConstantC. No bound ' +
  'is claimed and no operator positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97321_ASSERTIONS = [
  {
    id: 'imp97321-five-rows-present',
    holds: () => IMP97321_CREEP_ROWS.length === 5,
    why: 'imp-97286 extends the ladder at exactly five b values (24001,32003,40009,48017,64007).',
  },
  {
    id: 'imp97321-ascending-b-order',
    holds: () =>
      IMP97321_CREEP_ROWS.every((r, i) => i === 0 || r.b > IMP97321_CREEP_ROWS[i - 1].b),
    why: 'the ladder rows are sorted ascending by b for chart rendering.',
  },
  {
    id: 'imp97321-signed-negative-and-monotone-in-magnitude',
    holds: () =>
      IMP97321_CREEP_ROWS.every(
        (r, i) => r.signed < 0 && (i === 0 || Math.abs(r.signed) >= Math.abs(IMP97321_CREEP_ROWS[i - 1].signed)),
      ),
    why: 'the signed half stays negative and grows in magnitude monotonically across the extended ladder, approaching the asymptote from above.',
  },
  {
    id: 'imp97321-predicted-close-to-measured',
    holds: () => IMP97321_CREEP_ROWS.every((r) => Math.abs(r.residual) < 5e-4),
    why: 'the C/b-model prediction must sit within 5e-4 of every measured ladder value -- the winning fit tracked in imp-97286.',
  },
  {
    id: 'imp97321-asymptote-past-last-measured',
    holds: () => Math.abs(IMP97321_ASYMPTOTE.asymptoteL) > Math.abs(IMP97321_ASYMPTOTE.lastMeasured),
    why: 'the extrapolated asymptote L~-0.079575 must sit past the last measured point -0.079551 (b=64007), consistent with approach from above.',
  },
  {
    id: 'imp97321-verdict-cross-check',
    holds: () =>
      IMP97286_VERDICT.creepIsInverseB === true &&
      IMP97286_VERDICT.asymptoteStillMeasured === true &&
      IMP97286_VERDICT.anyBoundMoved === false &&
      IMP97286_VERDICT.qed === false,
    why: 'the viz leaf must agree with the source imp-97286 verdict flags: C/b creep, asymptote still measured, no bound moved, no QED.',
  },
  {
    id: 'imp97321-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP97321_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97321_HONEST_BANNER) &&
      /NO QED/.test(IMP97321_HONEST_BANNER),
    why: 'every Route M viz surface carries the RH-open / PT-Lambda / NO-QED markers.',
  },
];

for (const a of IMP97321_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97321-signed-half-creep-ladder-viz-data assertion failed: ${a.id}`,
    );
  }
}

export default {
  rows: IMP97321_CREEP_ROWS,
  asymptote: IMP97321_ASYMPTOTE,
  banner: IMP97321_HONEST_BANNER,
};
