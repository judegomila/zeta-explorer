/**
 * @module imp-97344-primorial-plateau-signlaw-viz-data
 *
 * imp-97344 (ux): import-light viz-data leaf for the imp-97309 RESULT 4 measurement
 * (imp-97309-route-m-arith-tail-cancellation-assessment.js) -- the measured sign law
 * R(b) = -mu(b)|R(b)| and the monotone approach of |R(b)| to a plateau on the primorial
 * ladder omega = 1..12. That module computes the twelve-row primorialLadder internally
 * but does not export it or a chart-ready reshape; this leaf bakes the twelve (omega, b,
 * mu, R, absR) rows as literals (independently recomputed from the same self-contained
 * J(n)/mobius arithmetic and cross-checked against the source module's comments and
 * assertions) and adds only presentation-layer derived columns -- no re-derivation of the
 * Binet-kernel integral or the complementary-divisor identity.
 *
 * Adds: the sign-law prediction -mu(b)|R(b)| alongside R(b) (RESULT 4's signLaw), the
 * divergent level-1 sum A_1(b) (RESULT 2, climbs 0.081 -> 0.194 and overtakes |R(b)| from
 * omega = 2 on -- the numerical signature that the cancellation is inter-level), the
 * step-to-step delta of |R(b)| (should shrink monotonically as |R(b)| flattens toward its
 * plateau), and the ratio of |R(b)| to the imp-97309 RESULT 5 CONJECTURED plateau value
 * 0.1395 (approached from below, never proved as a bound).
 *
 * MEASUREMENT / PRESENTATION ONLY. Changes no bound, establishes no operator positivity,
 * no RH claim; no refereed bound is changed. RH open. NO QED.
 *
 * @see imp-97309-route-m-arith-tail-cancellation-assessment.js (IMP97309_SIGN_LAW, IMP97309_PLATEAU_CONJECTURE)
 *
 * Ticket: imp-97344 (ux, sonnet-4-6, low). Presentation only, RH-free; changes no bound; NO QED.
 */

// -- baked primorial-ladder rows (omega, b, mu, R, A1), independently recomputed from the
// imp-97309 self-contained J(n)/mobius arithmetic; absR = |R| derived here. A1(b) is the
// RESULT 2 divergent single-prime level Sum_{p|b} J(p-1).
const RAW_LADDER = [
  { omega: 1, b: 2, mu: -1, R: 0.08106146679532733, A1: 0.08106146679532733 },
  { omega: 2, b: 6, mu: 1, R: -0.10575747156091375, A1: 0.12240216275073768 },
  { omega: 3, b: 30, mu: -1, R: 0.11421476073154158, A1: 0.1431928348545013 },
  { omega: 4, b: 210, mu: 1, R: -0.11870742278403548, A1: 0.15706896367757328 },
  { omega: 5, b: 2310, mu: -1, R: 0.12092641447643007, A1: 0.16539952711093453 },
  { omega: 6, b: 30030, mu: 1, R: -0.12259815211667098, A1: 0.17234236721813834 },
  { omega: 7, b: 510510, mu: -1, R: 0.12373113826597502, A1: 0.17755002313774715 },
  { omega: 8, b: 9699690, mu: 1, R: -0.12467543340432298, A1: 0.18217917688708174 },
  { omega: 9, b: 223092870, mu: -1, R: 0.1253976132845584, A1: 0.18596679495551105 },
  { omega: 10, b: 6469693230, mu: 1, R: -0.12593129212923715, A1: 0.18894285893904983 },
  { omega: 11, b: 200560490130, mu: -1, R: 0.1264113081054656, A1: 0.19172053386879573 },
  { omega: 12, b: 7420738134810, mu: 1, R: -0.12679416637744945, A1: 0.1940352891593229 },
];

// imp-97309 RESULT 5: the CONJECTURED (not proved) plateau value tying L to the Abel limit
// of the Moebius series; the interchange and the constant evaluation are open.
export const IMP97344_CONJECTURED_PLATEAU = 0.1395;

export const IMP97344_PLATEAU_SERIES = Object.freeze(
  RAW_LADDER.map((row, i) => {
    const absR = Math.abs(row.R);
    const signPrediction = -row.mu * absR;
    const prevAbsR = i > 0 ? Math.abs(RAW_LADDER[i - 1].R) : null;
    return Object.freeze({
      omega: row.omega,
      b: row.b,
      mu: row.mu,
      R: row.R,
      absR,
      A1: row.A1,
      A1ExceedsAbsR: row.A1 > absR,
      signPrediction,
      signMatches: Math.abs(row.R - signPrediction) < 1e-12,
      deltaFromPrev: prevAbsR === null ? null : absR - prevAbsR,
      gapToConjecturedPlateau: IMP97344_CONJECTURED_PLATEAU - absR,
      ratioToConjecturedPlateau: absR / IMP97344_CONJECTURED_PLATEAU,
    });
  }),
);

export const IMP97344_SUMMARY = Object.freeze({
  firstAbsR: IMP97344_PLATEAU_SERIES[0].absR,
  lastAbsR: IMP97344_PLATEAU_SERIES[IMP97344_PLATEAU_SERIES.length - 1].absR,
  conjecturedPlateau: IMP97344_CONJECTURED_PLATEAU,
  lastRatioToConjecturedPlateau: IMP97344_PLATEAU_SERIES[IMP97344_PLATEAU_SERIES.length - 1].ratioToConjecturedPlateau,
  stillClimbingAtOmega12: true, // imp-97309 RESULT 4: "still climbing" at omega = 12, plateau not reached
});

export const IMP97344_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: the twelve (omega, b, mu, R) rows ' +
  'are baked literals independently recomputed from the imp-97309 self-contained J(n)/mobius arithmetic ' +
  '(no re-derivation of the Binet-kernel integral or the complementary-divisor identity); the plateau value ' +
  '0.1395 is the imp-97309 RESULT 5 CONJECTURE, not a proved bound.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97344_ASSERTIONS = [
  {
    id: 'imp97344-twelve-ladder-rows',
    holds: () => IMP97344_PLATEAU_SERIES.length === 12,
    why: 'the imp-97309 primorial ladder runs over the first twelve primes, omega = 1..12.',
  },
  {
    id: 'imp97344-sign-law-holds-every-row',
    holds: () => IMP97344_PLATEAU_SERIES.every((r) => r.signMatches),
    why: 'RESULT 4: R(b) = -mu(b)|R(b)| (sign (-1)^{omega(b)-1}) must hold to < 1e-12 on every baked row.',
  },
  {
    id: 'imp97344-absR-strictly-increasing',
    holds: () => IMP97344_PLATEAU_SERIES.every((r, i) => i === 0 || r.absR > IMP97344_PLATEAU_SERIES[i - 1].absR),
    why: 'RESULT 4: |R(b)| is strictly increasing in omega on the primorial ladder.',
  },
  {
    id: 'imp97344-delta-shrinks-monotonically',
    holds: () =>
      IMP97344_PLATEAU_SERIES.slice(2).every(
        (r, i) => r.deltaFromPrev > 0 && r.deltaFromPrev < IMP97344_PLATEAU_SERIES[i + 1].deltaFromPrev,
      ),
    why: 'the step-to-step increase in |R(b)| shrinks monotonically from omega = 3 on, the numerical signature of a flattening approach to a plateau (not unbounded growth).',
  },
  {
    id: 'imp97344-ratio-to-plateau-below-one-and-increasing',
    holds: () =>
      IMP97344_PLATEAU_SERIES.every((r) => r.ratioToConjecturedPlateau > 0 && r.ratioToConjecturedPlateau < 1) &&
      IMP97344_PLATEAU_SERIES.every(
        (r, i) => i === 0 || r.ratioToConjecturedPlateau > IMP97344_PLATEAU_SERIES[i - 1].ratioToConjecturedPlateau,
      ) &&
      IMP97344_PLATEAU_SERIES[IMP97344_PLATEAU_SERIES.length - 1].ratioToConjecturedPlateau > 0.9,
    why: '|R(b)| approaches the imp-97309 CONJECTURED plateau 0.1395 monotonically from below, reaching >90% of it by omega = 12, consistent with "still climbing" (not yet at the plateau).',
  },
  {
    id: 'imp97344-level-one-diverges-past-absR',
    holds: () => {
      let mono = true;
      for (let i = 1; i < IMP97344_PLATEAU_SERIES.length; i += 1) {
        if (!(IMP97344_PLATEAU_SERIES[i].A1 > IMP97344_PLATEAU_SERIES[i - 1].A1)) mono = false;
      }
      return mono && IMP97344_PLATEAU_SERIES.slice(1).every((r) => r.A1ExceedsAbsR);
    },
    why: 'RESULT 2: the level-1 sum A_1(b) increases monotonically and exceeds |R(b)| from omega = 2 on -- the numerical signature that the O(1) plateau of |R(b)| is an inter-level cancellation against a divergent single-prime level.',
  },
  {
    id: 'imp97344-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP97344_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97344_HONEST_BANNER) &&
      /NO QED/.test(IMP97344_HONEST_BANNER),
    why: 'every Route-M viz surface carries the RH-open / PT-Lambda / NO-QED markers.',
  },
];

for (const a of IMP97344_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97344-primorial-plateau-signlaw-viz-data assertion failed: ${a.id}`);
  }
}

export default {
  plateauSeries: IMP97344_PLATEAU_SERIES,
  conjecturedPlateau: IMP97344_CONJECTURED_PLATEAU,
  summary: IMP97344_SUMMARY,
  banner: IMP97344_HONEST_BANNER,
};
