/**
 * @module imp-97019-rq-enclosure-upperbound-assertion
 *
 * imp-97019 (accuracy, VERIFICATION / ASSERTION ONLY): machine-check the imp-96993 RESULT against the
 * committed enclosure literals. imp-96993 upgraded the imp-96973 step-3 Rayleigh quadratic form
 *     rq = <v0|R_T|v0> = (1/(pi B)) int_T^Tfar sigma_2(t) |v0 . Phi(t)|^2 dt
 * from a single QUADRATURE evaluation to an INTERVAL ENCLOSURE [rqLo, rqHi] and reported that
 *   (1) the enclosure is a valid interval (rqLo <= rqHi) at every rung;
 *   (2) its lower edge stays >= the actual residual (rqLo >= actualResid), so <v0|R_T|v0> remains a
 *       rigorous min-max UPPER bound on the residual for the fixed A_T ground vector v0; and
 *   (3) the trial-vector slack rq/actual widens only ~0.08% under rigour, staying inside the
 *       imp-96973 benign band [1.12, 1.20] (slacks 1.1734, 1.1200, 1.1944).
 *
 * imp-96993 STATED these three properties (and self-checks a LOOSER [1.1, 1.2] band). This module
 * walks the frozen imp-96993 IMP96993_ENCLOSURE literals and confirms, as a reproducible import-light
 * assertion, that:
 *   (A) rqLo <= rqHi at all three rungs (a valid interval);
 *   (B) rqLo >= actualResid at all three rungs (the enclosure stays a rigorous upper bound on the
 *       residual -- the min-max property is preserved under the interval upgrade);
 *   (C) the slack, recomputed INDEPENDENTLY as rqLo/actualResid and rqHi/actualResid from the raw
 *       enclosure literals (not read back from the stored slackLo/slackHi fields), lands inside the
 *       TIGHTER imp-96973 benign band [1.12, 1.20] at both edges of every rung.
 *
 * VERIFICATION / ASSERTION ONLY. Asserts NO operator positivity; moves NO bound; makes NO ceiling
 * rigorous. It stays CONDITIONAL on IMP96993_SPECFUN_INTERVAL (the special functions at the quadrature
 * nodes are IEEE-double, not interval arithmetic) -- this checks the reported enclosure literals are
 * internally consistent and carry the claimed upper-bound / benign-band properties, NOT that the
 * enclosure is a fully verified interval majorant. IMP96888_RAYLEIGH_TAIL_MAJORANT and
 * IMP96749_UNIFORM_N_GAP_UNSETTLED stay open; interval-rigorous reach stays 2a <= 0.96;
 * no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-96993-rayleigh-tail-interval-enclosure.js (the enclosure literals checked here)
 * @see imp-96973-krein-tailtrace-vacuity-factorisation.js (the three-factor factorisation; step 3 = this slack)
 * @see imp-96888-krein-tresidual-rayleigh-permode-bound.js (the min-max Rayleigh diagnosis; IMP96888_RAYLEIGH_TAIL_MAJORANT)
 *
 * Ticket: imp-97019 (accuracy, opus-4-8, api-pool). Verification / assertion only; NO QED.
 */

import { IMP96993_ENCLOSURE } from './imp-96993-rayleigh-tail-interval-enclosure.js';

// tighter imp-96973 benign band for the trial-vector slack rq/actual (imp-97019 target band)
const BENIGN_LO = 1.12;
const BENIGN_HI = 1.2;

// Walk the frozen enclosure and recompute, for each rung, the interval-validity, the rigorous-upper
// property, and the slack edges INDEPENDENTLY as rq/actual (not read back from stored slack fields).
const rungs = Object.entries(IMP96993_ENCLOSURE);

const IMP97019_ROWS = Object.freeze(
  rungs.map(([key, r]) =>
    Object.freeze({
      key,
      twoA: r.twoA,
      N: r.N,
      rqLo: r.rqLo,
      rqHi: r.rqHi,
      actualResid: r.actualResid,
      intervalValid: r.rqLo <= r.rqHi, // (A) valid interval
      lowerAboveActual: r.rqLo >= r.actualResid, // (B) rigorous upper bound on the residual preserved
      slackLoRecomputed: r.rqLo / r.actualResid, // (C) independent slack lower edge
      slackHiRecomputed: r.rqHi / r.actualResid, // (C) independent slack upper edge
    }),
  ),
);

// smallest slack lower edge and largest slack upper edge across the three rungs (band extremes)
const slackLos = IMP97019_ROWS.map((r) => r.slackLoRecomputed);
const slackHis = IMP97019_ROWS.map((r) => r.slackHiRecomputed);
const minSlackLo = Math.min(...slackLos); // ~1.1200 (N=88, band lower extreme)
const maxSlackHi = Math.max(...slackHis); // ~1.1954 (2a=0.96,N=100, band upper extreme)

export const IMP97019_ENCLOSURE_CHECK = Object.freeze({
  rungCount: IMP97019_ROWS.length, // 3
  allIntervalsValid: IMP97019_ROWS.every((r) => r.intervalValid), // (A)
  allLowerAboveActual: IMP97019_ROWS.every((r) => r.lowerAboveActual), // (B)
  allSlacksInBenignBand: IMP97019_ROWS.every(
    (r) => r.slackLoRecomputed >= BENIGN_LO && r.slackHiRecomputed <= BENIGN_HI, // (C)
  ),
  benignBandLo: BENIGN_LO,
  benignBandHi: BENIGN_HI,
  minSlackLo, // tightest margin above 1.12 (the N=88 rung)
  maxSlackHi, // tightest margin below 1.20 (the 2a=0.96 rung)
  rows: IMP97019_ROWS,
});

export const IMP97019_VERDICT = Object.freeze({
  claim:
    'the imp-96993 RESULT -- the rq interval enclosure is a valid interval whose lower edge stays >= ' +
    'the actual residual (a rigorous min-max upper bound), and the recomputed slack rq/actual lands in ' +
    'the tighter benign band [1.12, 1.20] -- holds on the committed imp-96993 enclosure literals',
  intervalValidityMachineChecked: true, // rqLo <= rqHi at every rung
  rigorousUpperBoundMachineChecked: true, // rqLo >= actualResid at every rung
  slackBandMachineChecked: true, // recomputed slack in [1.12, 1.20] at every rung edge
  assertsOperatorPositivity: false,
  anyBoundMoved: false,
  conditionalOnSpecfunInterval: true, // IMP96993_SPECFUN_INTERVAL stays open (specfun IEEE-double)
  rayleighTailMajorantOpen: true, // IMP96888_RAYLEIGH_TAIL_MAJORANT stays open
  uniformNGapSettled: false, // IMP96749_UNIFORM_N_GAP_UNSETTLED stays open
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
  conclusion:
    'THE imp-96993 rq INTERVAL ENCLOSURE (three rungs: 2a=ln3 N=100/88 and 2a=0.96 N=100) IS A VALID ' +
    'INTERVAL WHOSE LOWER EDGE STAYS >= THE ACTUAL RESIDUAL, AND THE SLACK -- RECOMPUTED INDEPENDENTLY ' +
    'AS rq/actual FROM THE RAW LITERALS -- LANDS IN THE TIGHTER BENIGN BAND [1.12, 1.20] AT BOTH EDGES ' +
    'OF EVERY RUNG. This machine-checks the imp-96993 upper-bound-survival RESULT against the committed ' +
    'enclosure literals (imp-96993 stated it and self-checks only the looser [1.1, 1.2] band). ' +
    'Verification only: no operator positivity is asserted, no bound is moved, and the check stays ' +
    'CONDITIONAL on IMP96993_SPECFUN_INTERVAL (the node special functions are IEEE-double, not interval ' +
    'arithmetic). IMP96888_RAYLEIGH_TAIL_MAJORANT and IMP96749_UNIFORM_N_GAP_UNSETTLED stay open; ' +
    'interval-rigorous reach stays 2a <= 0.96; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97019_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Verification / assertion only: this module walks the ' +
  'frozen imp-96993 rq enclosure literals and confirms each rung is a valid interval whose lower edge ' +
  'stays >= the actual residual, with the recomputed slack in [1.12, 1.20]. It rebuilds no quadrature, ' +
  'asserts no operator positivity, moves no bound, and stays CONDITIONAL on IMP96993_SPECFUN_INTERVAL ' +
  '(the node special functions are IEEE-double); IMP96888_RAYLEIGH_TAIL_MAJORANT stays open.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97019_ASSERTIONS = [
  {
    id: 'imp97019-three-rungs-valid-intervals',
    holds: () =>
      IMP97019_ENCLOSURE_CHECK.rungCount === 3 &&
      IMP97019_ENCLOSURE_CHECK.allIntervalsValid === true,
    why: 'the committed enclosure carries exactly three rungs and rqLo <= rqHi at every one, so each is a valid interval.',
  },
  {
    id: 'imp97019-lower-edge-above-actual-residual',
    holds: () =>
      IMP97019_ENCLOSURE_CHECK.allLowerAboveActual === true &&
      IMP97019_ROWS.every((r) => r.rqLo >= r.actualResid),
    why: 'rqLo >= actualResid at every rung: the interval upgrade preserves the min-max property, so <v0|R_T|v0> stays a rigorous upper bound on the residual.',
  },
  {
    id: 'imp97019-recomputed-slack-in-tight-benign-band',
    holds: () =>
      IMP97019_ENCLOSURE_CHECK.allSlacksInBenignBand === true &&
      IMP97019_ENCLOSURE_CHECK.minSlackLo >= BENIGN_LO &&
      IMP97019_ENCLOSURE_CHECK.maxSlackHi <= BENIGN_HI &&
      // the recomputed edges reproduce the stored slack fields (independent cross-check)
      IMP97019_ROWS.every((r, i) => {
        const stored = Object.values(IMP96993_ENCLOSURE)[i];
        return (
          Math.abs(r.slackLoRecomputed - stored.slackLo) / stored.slackLo < 1e-12 &&
          Math.abs(r.slackHiRecomputed - stored.slackHi) / stored.slackHi < 1e-12
        );
      }),
    why: 'the slack recomputed independently as rq/actual from the raw literals lands in the tighter [1.12, 1.20] band at both edges of every rung and matches the stored slackLo/slackHi to ~1e-12.',
  },
  {
    id: 'imp97019-honesty-gate-no-qed',
    holds: () =>
      IMP97019_VERDICT.anyBoundMoved === false &&
      IMP97019_VERDICT.qed === false &&
      IMP97019_VERDICT.assertsOperatorPositivity === false &&
      IMP97019_VERDICT.intervalValidityMachineChecked === true &&
      IMP97019_VERDICT.rigorousUpperBoundMachineChecked === true &&
      IMP97019_VERDICT.slackBandMachineChecked === true &&
      IMP97019_VERDICT.conditionalOnSpecfunInterval === true &&
      IMP97019_VERDICT.rayleighTailMajorantOpen === true &&
      IMP97019_VERDICT.uniformNGapSettled === false &&
      IMP97019_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      /NO QED/.test(IMP97019_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97019_HONEST_BANNER) &&
      /RH open/.test(IMP97019_HONEST_BANNER),
    why: 'verification only: no bound moved, no operator positivity asserted, the three properties are machine-checked, the check stays conditional on IMP96993_SPECFUN_INTERVAL, the open sub-gaps stand, reach is 2a<=0.96, and the honesty markers are present.',
  },
];

for (const a of IMP97019_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97019-rq-enclosure-upperbound-assertion assertion failed: ${a.id}`);
  }
}

export default {
  enclosureCheck: IMP97019_ENCLOSURE_CHECK,
  verdict: IMP97019_VERDICT,
  banner: IMP97019_HONEST_BANNER,
};
