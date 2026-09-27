/**
 * @module imp-97588-mcm-baseterm-K0-approach-viz-data
 *
 * imp-97588 (ux): import-light viz-data leaf charting the imp-97519 Route M
 * MCM level-1 base-term scaled quantity c(x)*x/ln x approaching its limit
 * K0 = 1/24 as x runs 1e6..1e40, with the two named crossings (0.045 at
 * x~2.77e12, 0.043 at x~1.2737e31) marked and the residual-vs-1/ln x law
 * plotted on a log-log axis.
 *
 * PRESENTATION ONLY. All curve values are the closed-form law
 * scaled(x) = K0 + M0/ln x (imp-97499 RESULT 3, confirmed to 1e-67 by the
 * imp-97519 direct exact-kernel spot-check) evaluated at plotted x, plus the
 * imp-97519 baked ladder/crossing points reused verbatim. Nothing re-derived;
 * no bound moves; MCM stays VERIFIED at omega<=6, FALSE from omega=11
 * (imp-97432); Platt-Trudgian Lambda<=0.2 remains SOTA; RH open; NO QED.
 *
 * @see imp-97519-route-m-mcm-baseterm-043-crossing-spotcheck.js (K0, M0, crossing043, driftLadder baked verbatim)
 * @see imp-97432-route-m-mcm-hypothesis-refuted-ceiling-safe.js (MCM refuted at omega=11)
 *
 * Ticket: imp-97588 (ux, sonnet-4-6, sonnet). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import { IMP97519_SPOTCHECK } from './imp-97519-route-m-mcm-baseterm-043-crossing-spotcheck.js';

const K0 = IMP97519_SPOTCHECK.limitK0; // 1/24
const M0 = IMP97519_SPOTCHECK.driftConstantM0; // 0.09549610599...

// Closed-form law (imp-97499 RESULT 3, confirmed by imp-97519): scaled(x) = K0 + M0/ln x.
const scaledLaw = (x) => K0 + M0 / Math.log(x);

// Main curve: scaled(x) = c(x)*x/ln x sampled log-uniformly across x = 1e6..1e40, approaching K0 = 1/24 from above.
export const IMP97588_CURVE_SAMPLES = Object.freeze(
  Array.from({ length: 121 }, (_, i) => {
    const logX = 6 + (i * (40 - 6)) / 120;
    const x = Math.pow(10, logX);
    return Object.freeze({ logX, x, scaled: scaledLaw(x) });
  })
);

// The two named crossings from imp-97499/imp-97519: scaled(x) falls below 0.045 at x~2.77e12,
// and below 0.043 at x~1.2737e31 (confirmed by imp-97519 direct exact-kernel evaluation to 1e-67).
export const IMP97588_CROSSINGS = Object.freeze([
  Object.freeze({ label: '0.045 crossing', threshold: 0.045, x: 2.77e12, logX: Math.log10(2.77e12) }),
  Object.freeze({
    label: '0.043 crossing',
    threshold: 0.043,
    x: IMP97519_SPOTCHECK.crossing043.xApprox,
    logX: Math.log10(IMP97519_SPOTCHECK.crossing043.xApprox),
  }),
]);

// Residual-vs-1/ln x panel: residual = scaled(x) - K0, plotted against 1/ln x on a log-log axis,
// using the imp-97519 direct-kernel drift ladder (x = 1e14..1e40) plus the 0.043 crossing point.
export const IMP97588_RESIDUAL_SAMPLES = Object.freeze(
  [...IMP97519_SPOTCHECK.driftLadder, IMP97519_SPOTCHECK.crossing043].map((row) => {
    const x = row.x !== undefined ? row.x : row.xApprox;
    return Object.freeze({ x, residual: row.residual, invLnX: 1 / Math.log(x) });
  })
);

export const IMP97588_VERDICT = Object.freeze({
  ticket: 'imp-97588',
  sourceTicket: 'imp-97519',
  claim:
    'The Route M MCM level-1 base term scaled quantity c(x)*x/ln x follows the closed-form law ' +
    'K0 + M0/ln x (K0=1/24, M0=0.09549610599) across x=1e6..1e40, crossing 0.045 at x~2.77e12 and ' +
    '0.043 at x~1.2737e31 (confirmed by imp-97519 direct exact-kernel evaluation to 1e-67), with the ' +
    'residual = scaled(x) - K0 tracking 1/ln x, not any power law.',
  limitK0: K0,
  driftConstantM0: M0,
  driftIsLogarithmic: true,
  driftIsPowerLaw: false,
  mcmProved: false,
  mcmVerifiedThroughOmega: 6,
  mcmFalseFromOmega: 11,
  boundMoves: false,
  qed: false,
});
export default IMP97588_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97588_ASSERTIONS = [
  {
    id: 'imp97588-curve-samples-monotone-toward-K0',
    holds: () => {
      const s = IMP97588_CURVE_SAMPLES;
      if (s.length !== 121) return false;
      for (let i = 1; i < s.length; i++) {
        if (!(s[i].scaled < s[i - 1].scaled)) return false; // strictly decreasing toward K0
        if (!(s[i].scaled > K0)) return false; // always stays above the K0=1/24 limit
      }
      return true;
    },
    why: 'the closed-form law K0 + M0/ln x must decrease strictly and monotonically toward K0=1/24 as x grows, never crossing it.',
  },
  {
    id: 'imp97588-crossings-match-law',
    holds: () =>
      IMP97588_CROSSINGS.length === 2 &&
      IMP97588_CROSSINGS.every((c) => Math.abs(scaledLaw(c.x) - c.threshold) < 1e-4),
    why: 'both named crossings (0.045 at x~2.77e12, 0.043 at x~1.2737e31) must satisfy scaledLaw(x) = threshold.',
  },
  {
    id: 'imp97588-residual-tracks-inverse-log',
    holds: () =>
      IMP97588_RESIDUAL_SAMPLES.length >= 5 &&
      IMP97588_RESIDUAL_SAMPLES.every((row) => Math.abs(row.residual - M0 * row.invLnX) < 1e-6),
    why: 'the residual scaled(x)-K0 must equal M0/ln x (M0 * invLnX) to within 1e-6 at every baked ladder point.',
  },
  {
    id: 'imp97588-honesty-gate-no-qed',
    holds: () =>
      IMP97588_VERDICT.qed === false &&
      IMP97588_VERDICT.mcmProved === false &&
      IMP97588_VERDICT.mcmFalseFromOmega === 11 &&
      IMP97588_VERDICT.boundMoves === false,
    why: 'presentation-only leaf charting an already-measured closed-form law: no bound moves, MCM stays verified<=6/false-from-11, NO QED.',
  },
];

for (const t of IMP97588_ASSERTIONS) {
  if (!t.holds()) {
    throw new Error(`imp-97588-mcm-baseterm-K0-approach-viz-data assertion FAILED: ${t.id} -- ${t.why}`);
  }
}
