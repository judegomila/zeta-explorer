/**
 * @module imp-97569-confined-well-sign-map-viz-data
 *
 * imp-97569 (ux): import-light viz-data leaf charting the imp-97537
 * confined-well vs projected-positivity assessment as two panels: (1) a
 * sign map of sigma_2(t) = (t^2+1/4)^2 w_1(t) over t >= 0 -- the confined
 * negative well [0,3.306] u [6.945,10.532], the intervening positive band
 * (3.306,6.945), the measured-but-not-rigorously-proven positive stretch
 * (10.532, 27), and the imp-97501 rigorous positive region t >= 27 -- and
 * (2) the true (finite-N Galerkin) soft lambda_min(T_a[sigma_2]) curve
 * against 2a, showing it stays positive through 2a = ln3 and crosses zero
 * only at 2a* ~ 1.1316, PAST ln3.
 *
 * PRESENTATION ONLY. Sign-map boundaries and lambda_min samples are reused
 * verbatim from imp-97537 (well/band boundaries, far-field threshold) and
 * TOEPLITZ_KREIN_LITERALS.lambdaMinSigma2 (imp-96609/imp-96677 baked LP
 * table). Establishes no operator positivity; changes no bound;
 * interval-rigorous reach stays 2a<=0.96; Platt-Trudgian Lambda<=0.2
 * remains SOTA; RH open; NO QED.
 *
 * @see imp-97537-confined-well-vs-projected-positivity-assessment.js (the source assessment)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (sigma2, lambdaMinSigma2 table)
 *
 * Ticket: imp-97569 (ux, sonnet-4-6, low). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import { sigma2, TOEPLITZ_KREIN_LITERALS } from './rh-route-i-toeplitz-krein-certificate-2026-09-24.js';
import { IMP97537_WELL, IMP97537_ASSESSMENT } from './imp-97537-confined-well-vs-projected-positivity-assessment.js';

const LN3 = Math.log(3);

// Sign-map segments over t >= 0 (mirrored at t < 0 by evenness of sigma_2).
export const IMP97569_SIGN_MAP = Object.freeze([
  Object.freeze({ tStart: 0, tEnd: 3.306, sign: 'negative', status: 'well', label: 'confined well' }),
  Object.freeze({ tStart: 3.306, tEnd: 6.945, sign: 'positive', status: 'band', label: 'intervening positive band (peak ~615 at t~6)' }),
  Object.freeze({ tStart: 6.945, tEnd: 10.532, sign: 'negative', status: 'well', label: 'confined well (dip ~-4336 at t~9.35)' }),
  Object.freeze({ tStart: 10.532, tEnd: IMP97537_WELL.farFieldRigorousThresholdT0, sign: 'positive', status: 'measured', label: 'measured positive, not rigorously proven' }),
  Object.freeze({ tStart: IMP97537_WELL.farFieldRigorousThresholdT0, tEnd: 40, sign: 'positive', status: 'rigorous', label: 'rigorously proven positive (imp-97501)' }),
]);

// True (finite-N Galerkin) soft lambda_min(T_a[sigma_2]) vs 2a, most-conservative
// (deepest N = 36) entry per row of TOEPLITZ_KREIN_LITERALS.lambdaMinSigma2.
const L = TOEPLITZ_KREIN_LITERALS.lambdaMinSigma2;
export const IMP97569_LAMBDA_MIN_CURVE = Object.freeze([
  Object.freeze({ twoA: 0.90, lambdaMin: L.a045[2] }),
  Object.freeze({ twoA: 1.00, lambdaMin: L.a050[2] }),
  Object.freeze({ twoA: 1.04, lambdaMin: L.a052[2] }),
  Object.freeze({ twoA: 1.08, lambdaMin: L.a054[2] }),
  Object.freeze({ twoA: 2 * (LN3 / 2), lambdaMin: L.aLn3Half[2] }), // 2a = ln3
  Object.freeze({ twoA: 1.11, lambdaMin: L.a0555[2] }),
  Object.freeze({ twoA: 1.12, lambdaMin: L.a056[2] }),
  Object.freeze({ twoA: 1.1316, lambdaMin: L.a05658[2] }), // 2a* crossing
  Object.freeze({ twoA: 1.16, lambdaMin: L.a058[2] }),
]);

export const IMP97569_CROSSING = Object.freeze({
  ln3: LN3, // 1.098612...
  twoAStar: IMP97537_ASSESSMENT.crossingTwoAStar, // 1.1316
  lambdaMinAtLn3Half: IMP97537_ASSESSMENT.lambdaMinAtLn3Half, // 0.5786 (N=28 mid entry, matches module prose)
});

export const IMP97569_VERDICT = Object.freeze({
  ticket: 'imp-97569',
  sourceTicket: 'imp-97537',
  claim:
    'charts the imp-97537 sigma_2 sign map (confined well, positive band, far-field t0=27) alongside the ' +
    'soft lambda_min(T_a[sigma_2]) crossing at 2a* ~ 1.1316, past ln3: positivity of the projected operator ' +
    'is compatible with the confined well for every 2a <= ln3.',
  rowsReusedVerbatim: true,
  operatorPositivityProved: false,
  boundMoves: false,
  qed: false,
});
export default IMP97569_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97569_ASSERTIONS = [
  {
    id: 'imp97569-sign-map-covers-well-band-and-farfield',
    holds: () => {
      const segs = IMP97569_SIGN_MAP;
      return segs.length === 5 &&
        segs[0].sign === 'negative' && segs[1].sign === 'positive' && segs[2].sign === 'negative' &&
        segs[3].sign === 'positive' && segs[4].sign === 'positive' &&
        segs[3].status === 'measured' && segs[4].status === 'rigorous' &&
        segs[4].tStart === 27;
    },
    why: 'the sign map must match imp-97537: negative well [0,3.306], positive band (3.306,6.945), negative well (6.945,10.532), measured-only positive (10.532,27), rigorously-proven positive t>=27.',
  },
  {
    id: 'imp97569-sigma2-samples-match-segments',
    holds: () => {
      const wellNeg = [0.5, 2, 3.2, 7, 8, 9.35, 10.5].every((t) => sigma2(t) < 0);
      const bandPos = [3.5, 5, 6, 6.9].every((t) => sigma2(t) > 0);
      const measuredPos = [11, 15, 20].every((t) => sigma2(t) > 0);
      const rigorousPos = [27, 30, 40].every((t) => sigma2(t) > 0);
      return wellNeg && bandPos && measuredPos && rigorousPos;
    },
    why: 'direct sigma_2 evaluation must confirm the sign-map segments: negative on both well pieces, positive on the intervening band, and positive throughout the measured and rigorous far-field stretches.',
  },
  {
    id: 'imp97569-lambda-min-curve-stays-positive-through-ln3-crosses-past',
    holds: () => {
      const c = IMP97569_LAMBDA_MIN_CURVE;
      const throughLn3 = c.filter((p) => p.twoA <= LN3 + 1e-9);
      const pastLn3 = c.filter((p) => p.twoA > LN3 + 1e-9);
      return throughLn3.every((p) => p.lambdaMin > 0) &&
        pastLn3.some((p) => p.lambdaMin < 0) &&
        Math.abs(IMP97569_CROSSING.twoAStar - 1.1316) < 1e-9 &&
        IMP97569_CROSSING.twoAStar > LN3;
    },
    why: 'the charted soft lambda_min curve must stay positive for every 2a <= ln3 (1.0986) and turn negative only past the crossing 2a* = 1.1316, matching the imp-97537 assessment.',
  },
  {
    id: 'imp97569-presentation-only-no-qed',
    holds: () =>
      IMP97569_VERDICT.rowsReusedVerbatim === true &&
      IMP97569_VERDICT.operatorPositivityProved === false &&
      IMP97569_VERDICT.boundMoves === false &&
      IMP97569_VERDICT.qed === false &&
      IMP97537_ASSESSMENT.qed === false &&
      IMP97537_ASSESSMENT.wellIsObstructionToPositivityItself === false,
    why: 'presentation only: sign-map boundaries and lambda_min samples reused verbatim from imp-97537; no operator positivity; no bound moves; NO QED.',
  },
];

for (const t of IMP97569_ASSERTIONS) {
  if (!t.holds()) {
    throw new Error(`imp-97569-confined-well-sign-map-viz-data assertion FAILED: ${t.id} -- ${t.why}`);
  }
}
