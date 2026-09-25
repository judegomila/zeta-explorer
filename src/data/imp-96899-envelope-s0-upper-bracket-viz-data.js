/**
 * @module imp-96899-envelope-s0-upper-bracket-viz-data
 * @fileoverview imp-96899 -- import-light viz-data leaf for the imp-96796 Route M homogeneous-envelope
 *   s0 UPPER BRACKET: the per-b envelope Q/b readout (7.59 -> 7.82) dominates the measured Q/b window
 *   means (1.69 -> 1.75) at every checked b, and the asymptotic envelope constant 5*K^2 ~ 7.94 brackets
 *   the s0 ~ 1.75 candidate from above by a factor ~4.53. Bakes the imp-96796 rows as plain literals so
 *   any consuming page avoids the heavy zeros-bundle import chain.
 *
 * SOURCE. imp-96796 (numerical, MEASUREMENT ONLY): combines the imp-96770 homogeneous log-envelope
 * (E) with the imp-96750 measured s0 candidate. No new heavy compute; no rigorous bound moved; NO QED.
 *
 * @see imp-96796-route-m-homogeneous-envelope-s0-upper-bracket.js (source finding, full derivation)
 * @see imp-96770-route-m-weighted-cotangent-homogeneous-envelope.js (the envelope (E) and K ~ 1.26)
 * @see imp-96750-route-m-interior-second-moment-upper-bound-reduction.js (the s0 ~ 1.75 candidate)
 */

// per-b readout: envelope Q/b bound = K^2 * [imp-96770 Sum(1+log(b/a))^2 / b] (K = 1.26).
export const IMP96899_PER_B = Object.freeze([
  Object.freeze({ b: 400, sumOverB: 4.778, envQoverB: 7.586 }),
  Object.freeze({ b: 800, sumOverB: 4.869, envQoverB: 7.730 }),
  Object.freeze({ b: 1600, sumOverB: 4.923, envQoverB: 7.816 }),
]);

// imp-96750 measured Q(b)/b window means (the s0 candidate approached from below).
export const IMP96899_MEASURED_QOVERB = Object.freeze([1.68979, 1.72902, 1.74478, 1.75127]);

export const IMP96899_SUMMARY = Object.freeze({
  kMeasured: 1.26, // imp-96770 measured envelope constant
  s0Candidate: 1.751, // imp-96750 top-window Q(b)/b -> s0
  s0Env: 7.938, // 5 * K^2, the asymptotic envelope upper constant
  bracketRatio: 4.533, // s0Env / s0Candidate
});

export const IMP96899_VERDICT = Object.freeze({
  ticket: 'imp-96899',
  sourceTicket: 'imp-96796',
  bracketsFromAbove: true,
  dominantAtEveryCheckedB: true,
  conditionalOnUnprovedEnvelope: true,
  anyBoundMoved: false,
  qed: false,
});

export default {
  perB: IMP96899_PER_B,
  measuredQoverB: IMP96899_MEASURED_QOVERB,
  summary: IMP96899_SUMMARY,
  verdict: IMP96899_VERDICT,
};

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96899_ASSERTIONS = [
  {
    id: 'imp96899-per-b-readout-dominates-measured',
    holds: () => {
      const maxMeasured = Math.max(...IMP96899_MEASURED_QOVERB);
      const minEnv = Math.min(...IMP96899_PER_B.map((r) => r.envQoverB));
      const climbing = IMP96899_PER_B.every(
        (r, i) => i === 0 || r.envQoverB >= IMP96899_PER_B[i - 1].envQoverB,
      );
      return minEnv > maxMeasured && climbing;
    },
    why: 'the per-b envelope readout 7.586 -> 7.730 -> 7.816 (climbing toward 5*K^2) exceeds the largest measured Q(b)/b window mean 1.75127 at every checked b.',
  },
  {
    id: 'imp96899-summary-brackets-candidate-from-above',
    holds: () =>
      IMP96899_SUMMARY.s0Env > IMP96899_SUMMARY.s0Candidate &&
      Math.abs(IMP96899_SUMMARY.bracketRatio - IMP96899_SUMMARY.s0Env / IMP96899_SUMMARY.s0Candidate) < 1e-2 &&
      IMP96899_SUMMARY.bracketRatio > 4 && IMP96899_SUMMARY.bracketRatio < 5,
    why: 'the asymptotic envelope constant 5*K^2 = 7.938 exceeds the imp-96750 candidate s0 = 1.751 by a factor ~4.53.',
  },
  {
    id: 'imp96899-measurement-only-no-qed',
    holds: () =>
      IMP96899_VERDICT.bracketsFromAbove === true &&
      IMP96899_VERDICT.conditionalOnUnprovedEnvelope === true &&
      IMP96899_VERDICT.anyBoundMoved === false &&
      IMP96899_VERDICT.qed === false,
    why: 'measurement only: the envelope brackets s0 from above but conditional on the unproved envelope (E), no bound is claimed moved, and no QED is claimed.',
  },
];

for (const a of IMP96899_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96899-envelope-s0-upper-bracket-viz-data assertion failed: ${a.id}`);
  }
}
