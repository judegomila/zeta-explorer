/**
 * @module imp-97257-primorial-collapse-viz-data
 *
 * imp-97257 (ux): import-light viz-data leaf for the imp-97156 primorial-collapse ladder
 * (imp-97156-route-m-primorial-signlaw-extension.js), which had baked the primorial and
 * near-primorial rows but no chart-ready surface for the collapse.
 *
 * Reshapes the baked rows into a single chart-ready series: |r(b)| at the primorials P5..P8
 * (2310, 30030, 510510, 9699690) falling 1.068e-6 -> 2.485e-9, with the cancellation depth
 * ratio (relative to the imp-97140 omega=1 scale) growing 632 -> 2.72e5; alongside the two
 * near-primorial squarefree moduli that also flip (570570, 690690) and the non-flipping
 * repeated-prime-power control (1021020 = 2^2.3.5.7.11.13.17).
 *
 * MEASUREMENT / PRESENTATION ONLY. Every (b, r, omega) value below is copied verbatim from the
 * imp-97156 baked `IMP97156_PRIMORIALS` and `IMP97156_NEAR_PRIMORIAL` (no re-derivation of the
 * coprime-sum residual). Changes no bound, establishes no operator positivity, no RH claim;
 * no refereed bound is changed. RH open. NO QED.
 *
 * @see imp-97156-route-m-primorial-signlaw-extension.js (IMP97156_PRIMORIALS, IMP97156_NEAR_PRIMORIAL, IMP97156_VERDICT)
 *
 * Ticket: imp-97257 (ux, sonnet-4-6, low). Presentation only, RH-free; changes no bound; NO QED.
 */

import {
  IMP97156_PRIMORIALS,
  IMP97156_NEAR_PRIMORIAL,
  IMP97156_VERDICT,
} from './imp-97156-route-m-primorial-signlaw-extension.js';

// imp-97140 omega=1 geometric-mean |r| scale, used only as the cancellation-depth reference.
const GM_ABS_R_OMEGA1 = 6.75e-4;

// one row per primorial P5..P8, ascending b, with the cancellation depth ratio gm1/|r|.
export const IMP97257_PRIMORIAL_ROWS = IMP97156_PRIMORIALS.map((row) => ({
  ...row,
  absR: Math.abs(row.r),
  depthRatio: GM_ABS_R_OMEGA1 / Math.abs(row.r),
}));

// near-primorial squarefree moduli (2 flipping, 1 non-flipping repeated-prime-power control).
export const IMP97257_NEAR_PRIMORIAL_ROWS = IMP97156_NEAR_PRIMORIAL.map((row) => ({
  ...row,
  absR: Math.abs(row.r),
}));

export const IMP97257_GM_ABS_R_OMEGA1 = GM_ABS_R_OMEGA1;

export const IMP97257_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every (b, r, omega) row is copied ' +
  'verbatim from the imp-97156 baked IMP97156_PRIMORIALS / IMP97156_NEAR_PRIMORIAL (no re-derivation of the ' +
  'coprime-sum residual); no bound is claimed and no operator positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97257_ASSERTIONS = [
  {
    id: 'imp97257-four-primorial-rows-present',
    holds: () => IMP97257_PRIMORIAL_ROWS.length === 4,
    why: 'imp-97156 measures exactly four primorials P5..P8 (2310, 30030, 510510, 9699690).',
  },
  {
    id: 'imp97257-ascending-b-order',
    holds: () => IMP97257_PRIMORIAL_ROWS.every((r, i) => i === 0 || r.b > IMP97257_PRIMORIAL_ROWS[i - 1].b),
    why: 'the primorial rows are sorted ascending by b for chart rendering.',
  },
  {
    id: 'imp97257-abs-r-monotone-decreasing',
    holds: () => IMP97257_PRIMORIAL_ROWS.every((r, i) => i === 0 || r.absR < IMP97257_PRIMORIAL_ROWS[i - 1].absR),
    why: '|r| collapses monotonically P5->P6->P7->P8 (1.068e-6 -> 2.485e-9), the primorial-collapse phenomenon.',
  },
  {
    id: 'imp97257-depth-ratio-monotone-increasing',
    holds: () => IMP97257_PRIMORIAL_ROWS.every((r, i) => i === 0 || r.depthRatio > IMP97257_PRIMORIAL_ROWS[i - 1].depthRatio),
    why: 'the cancellation depth gm1/|r| grows monotonically (632 -> 2.72e5) as each primorial adds one more small prime.',
  },
  {
    id: 'imp97257-endpoint-depth-ratios-match-doc',
    holds: () =>
      Math.abs(IMP97257_PRIMORIAL_ROWS[0].depthRatio - 632) < 1 &&
      Math.abs(IMP97257_PRIMORIAL_ROWS[3].depthRatio - 2.72e5) < 2e3,
    why: 'the P5 and P8 depth ratios must match the imp-97156 module-doc comment (632 -> 2.72e5).',
  },
  {
    id: 'imp97257-three-near-primorial-rows-present',
    holds: () => IMP97257_NEAR_PRIMORIAL_ROWS.length === 3,
    why: 'imp-97156 measures two flipping near-primorial moduli (570570, 690690) plus one non-flipping repeated-prime-power control (1021020).',
  },
  {
    id: 'imp97257-flip-flags-match-sign',
    holds: () =>
      IMP97257_NEAR_PRIMORIAL_ROWS.every((r) => (r.flips ? r.r < 0 : r.r > 0)),
    why: 'the two flipping rows carry r<0 (opposite the leading Liouville-parity prediction) and the non-flipping control carries r>0.',
  },
  {
    id: 'imp97257-verdict-cross-check',
    holds: () =>
      IMP97156_VERDICT.primorialTakeoverIsUniversal === true &&
      IMP97156_VERDICT.suppliesUniformRemainderBound === false &&
      IMP97156_VERDICT.qed === false,
    why: 'the viz leaf must agree with the source imp-97156 verdict flags: universal takeover, no uniform bound supplied, no QED.',
  },
  {
    id: 'imp97257-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP97257_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97257_HONEST_BANNER) &&
      /NO QED/.test(IMP97257_HONEST_BANNER),
    why: 'every Route M viz surface carries the RH-open / PT-Lambda / NO-QED markers.',
  },
];

for (const a of IMP97257_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97257-primorial-collapse-viz-data assertion failed: ${a.id}`);
  }
}

export default {
  primorials: IMP97257_PRIMORIAL_ROWS,
  nearPrimorial: IMP97257_NEAR_PRIMORIAL_ROWS,
  gmAbsROmega1: IMP97257_GM_ABS_R_OMEGA1,
  banner: IMP97257_HONEST_BANNER,
};
