/**
 * @module imp-97024-rayleigh-tail-enclosure-viz-data
 * @fileoverview imp-97024 -- import-light viz-data leaf for the imp-96993 step-3 Rayleigh
 *   tail-integral interval enclosure: the rq_lo/rq_hi brackets and the trial-vector slack
 *   band [1.12,1.20] across the three imp-96973 rungs. Bakes the imp-96993 rows as plain
 *   literals so any consuming page avoids the heavy zeros-bundle import chain.
 *
 * SOURCE. imp-96993 upgraded the imp-96973 step-3 Rayleigh quadratic form <v0|R_T|v0> from a
 * single quadrature evaluation to a rigorous interval enclosure [rq_lo, rq_hi] at three rungs,
 * and measured how much the ~1.17x trial-vector slack (rayleigh/actual) widens under it. The
 * enclosure relative half-width is ~4e-4 (~0.04%) at every rung and the slack widens by only
 * ~0.08%, staying inside the imp-96973 benign band [1.12,1.20]. Measurement only: no operator
 * positivity established, IMP96888_RAYLEIGH_TAIL_MAJORANT stays open, NO QED.
 *
 * @see imp-96993-rayleigh-tail-interval-enclosure.js (source finding, full derivation + assertions)
 * @see imp-96973-krein-tailtrace-vacuity-factorisation.js (the three-factor factorisation; step 3 = this slack)
 */

// rq (the step-3 Rayleigh scalar) interval enclosure + slack band per rung
// (verbatim from imp-96993-rayleigh-tail-interval-enclosure.js IMP96993_ENCLOSURE)
export const IMP97024_ENCLOSURE_RUNGS = Object.freeze([
  Object.freeze({
    rung: 'ln3-N100',
    twoA: Math.log(3),
    N: 100,
    rqLo: 0.0005381115665168691,
    rqHi: 0.0005385446590896109,
    rqRelHalfWidth: 0.00040225706445696374,
    actualResid: 0.0004585862096558868,
    slackLo: 1.1734141916754461,
    slackHi: 1.1743585998665838,
  }),
  Object.freeze({
    rung: 'ln3-N88',
    twoA: Math.log(3),
    N: 88,
    rqLo: 0.0003430448602953839,
    rqHi: 0.000343306382566691,
    rqRelHalfWidth: 0.0003810327059604921,
    actualResid: 0.00030627781768866047,
    slackLo: 1.1200447452714257,
    slackHi: 1.1208986179850315,
  }),
  Object.freeze({
    rung: '0p96-N100',
    twoA: 0.96,
    N: 100,
    rqLo: 0.02953544919445797,
    rqHi: 0.02956033819006449,
    rqRelHalfWidth: 0.00042116361771397774,
    actualResid: 0.024728044178580433,
    slackLo: 1.1944110492993107,
    slackHi: 1.1954175581613453,
  }),
]);

// the imp-96973 benign trial-vector-slack band the enclosure stays inside at every rung
export const IMP97024_SLACK_BAND = Object.freeze({ lo: 1.12, hi: 1.2 });

export const IMP97024_VERDICT = Object.freeze({
  ticket: 'imp-97024',
  sourceTicket: 'imp-96993',
  enclosureRelHalfWidthMax: 0.00042116361771397774, // ~0.04% at every rung
  slackWidensBy: 'less than 0.1% at every rung',
  slackStaysInsideBenignBand: true, // slackLo/slackHi in [1.12, 1.20] at every rung
  enclosureIsRigorousUpper: true, // rqLo >= actualResid at every rung
  operatorPositivityProved: false,
  rayleighTailMajorantOpen: true, // IMP96888_RAYLEIGH_TAIL_MAJORANT stays open
  qed: false,
});

export default {
  rungs: IMP97024_ENCLOSURE_RUNGS,
  slackBand: IMP97024_SLACK_BAND,
  verdict: IMP97024_VERDICT,
};

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97024_ASSERTIONS = [
  {
    id: 'imp97024-enclosure-valid-and-upper-bound-preserved',
    holds: () =>
      IMP97024_ENCLOSURE_RUNGS.every((r) => r.rqLo <= r.rqHi && r.rqLo >= r.actualResid),
    why: 'each rung interval is valid (lo<=hi) and its lower edge still exceeds the actual residual, so the step-3 Rayleigh scalar stays a rigorous min-max upper bound.',
  },
  {
    id: 'imp97024-slack-inside-benign-band',
    holds: () =>
      IMP97024_ENCLOSURE_RUNGS.every(
        (r) => r.slackLo >= IMP97024_SLACK_BAND.lo && r.slackHi <= IMP97024_SLACK_BAND.hi,
      ),
    why: 'the slack enclosure [slackLo, slackHi] stays inside the imp-96973 benign band [1.12,1.20] at every rung.',
  },
  {
    id: 'imp97024-measurement-only-no-qed',
    holds: () =>
      IMP97024_VERDICT.slackStaysInsideBenignBand === true &&
      IMP97024_VERDICT.enclosureIsRigorousUpper === true &&
      IMP97024_VERDICT.operatorPositivityProved === false &&
      IMP97024_VERDICT.rayleighTailMajorantOpen === true &&
      IMP97024_VERDICT.qed === false,
    why: 'measurement only: the slack survives inside the benign band and the enclosure preserves the rigorous upper bound, but no operator-positivity theorem is claimed and the Rayleigh tail majorant stays open.',
  },
];

for (const a of IMP97024_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97024-rayleigh-tail-enclosure-viz-data assertion failed: ${a.id}`);
  }
}
