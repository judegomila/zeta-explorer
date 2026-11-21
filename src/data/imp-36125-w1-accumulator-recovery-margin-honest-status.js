/**
 * @module imp-36125-w1-accumulator-recovery-margin-honest-status
 * @fileoverview imp-36125 -- standalone HONEST-STATUS note (imp-36004-style restatement pattern)
 *   recording the imp-36061 finding that the concrete run-time-monitoring detuning margin needed
 *   to RECOVER the imp-35812 baseline running-accumulator ratio r_base ~ 1.18e-3 (not merely drop
 *   under the imp-35991 r < 1e-2 basin edge) is ~16x wider on the alpha / resonance-proximity axis
 *   and ~12x wider on the beta / sqrt-drift axis, and that the two axes are ASYMMETRIC: the alpha
 *   recovery edges sit just INSIDE the baseline alpha detuning (the baseline alpha alone already
 *   reaches the 1% recovery edge) while the beta recovery edges lie BEYOND the baseline beta (the
 *   sqrt drift alone at the baseline's own beta under-recovers, landing at r ~ 1.65 r_base). Read-
 *   only note: imports the imp-36061 module verbatim (no re-derivation, no new numerics) and
 *   states the honesty boundary plainly for a reader who lands on this ticket without reading
 *   imp-36061 in full -- a run-time monitor keyed on RECOVERING the baseline needs a margin an
 *   order of magnitude wider than one keyed merely on staying under 1e-2, and cannot rely on
 *   either axis alone symmetrically.
 *
 *   Ticket: imp-36125 (content, medium). Note only; re-reads nothing new; changes no bound;
 *   C_mb GUE-conditional (imp-486) untouched; no refereed bound is changed; NO QED.
 *
 *   @see imp-36061-w1-accumulator-recovery-detuning-width.js (source module this note restates)
 *   @see imp-35991-w1-accumulator-baseline-margin-to-resonance (the r < 1e-2 basin edge this widens)
 *   @see imp-35812-w1-summation-scheme-measured-cost (baseline (alpha,beta) term family)
 *   @see imp-36004-w1-accumulator-frequency-contingent-honest-status.js (the restatement pattern this note follows)
 */

import { IMP36061_W1_ACCUMULATOR_RECOVERY_DETUNING_WIDTH } from './imp-36061-w1-accumulator-recovery-detuning-width.js';

const SRC = IMP36061_W1_ACCUMULATOR_RECOVERY_DETUNING_WIDTH;

export const IMP36125_W1_ACCUMULATOR_RECOVERY_MARGIN_HONEST_STATUS = Object.freeze({
  id: 'imp-36125',
  proofSection: 'S-frontier',
  title:
    'Honest-status note: the imp-36061 recover-to-baseline detuning margin is ~16x (alpha) / ' +
    '~12x (beta) WIDER than the imp-35991 r < 1e-2 basin edge, and ASYMMETRIC across the two axes',
  sourceModule: 'imp-36061-w1-accumulator-recovery-detuning-width.js',

  alphaEdge10: SRC.alphaAxis.edge10,
  alphaEdge1: SRC.alphaAxis.edge1,
  alphaWideningFactor: SRC.comparisonToBasinEdge.alphaWideningFactor,
  betaEdge10: SRC.betaAxis.edge10,
  betaEdge1: SRC.betaAxis.edge1,
  betaWideningFactor: SRC.comparisonToBasinEdge.betaWideningFactor,
  basinEdgeAlpha1e2: SRC.comparisonToBasinEdge.basinEdgeAlpha1e2,
  basinEdgeBeta1e2: SRC.comparisonToBasinEdge.basinEdgeBeta1e2,
  isRigorous: SRC.isRigorous,

  honestyBoundary:
    'The imp-35991 basin edge (r < 1e-2, a modest "still O(1)" threshold) sits at |delta| ~ 0.0356 ' +
    'rad on the alpha axis and beta ~ 0.269 on the beta axis. RECOVERING the imp-35812 baseline ' +
    'ratio r_base ~ 1.18e-3 is a far tighter target and needs a detuning ~16x wider on the alpha ' +
    'axis (|delta| ~ 0.560 / 0.611 rad for 10% / 1% recovery) and ~12x wider on the beta axis ' +
    '(beta ~ 3.19 / 3.32). The two axes are also ASYMMETRIC: the alpha-recovery edges land JUST ' +
    'INSIDE the baseline alpha detuning (~0.618 rad) -- the baseline alpha alone already sits ' +
    'essentially at the 1%-recovery edge -- while the beta-recovery edges land BEYOND the baseline ' +
    'beta (~2.400): the sqrt drift alone at the baseline own beta gives only r ~ 1.95e-3 ~ 1.65 ' +
    'r_base, under-recovering. So the baseline cancellation is carried by the alpha detuning, not ' +
    'the drift, and a run-time monitor cannot assume symmetric margin on both axes.',

  conclusion:
    'imp-36061 measures, from the q=1 resonance, the phase-detuning width at which the imp-35890 ' +
    'running-accumulator ratio r first recovers to within 10% (1%) of the imp-35812 baseline r_base ' +
    'on both the alpha (resonance-proximity) and beta (sqrt-drift) axes, finding recovery windows ' +
    'an order of magnitude wider than the imp-35991 r < 1e-2 basin edge and markedly asymmetric ' +
    'between the two axes. Even at the full-breakdown r = 1 corner the classic gamma_{N-1} ~ 5.4e-11 ' +
    'stays ~4 orders under the imp-35760 barrier margin, so precision remains NOT the binding ' +
    'constraint; the obstruction stays the ENGINEERING of the certified length-N interval sum, which ' +
    'remains GREENFIELD (imp-35681 Part A) and MECHANICAL (imp-35725). This note changes no bound ' +
    'and certifies nothing new.',

  honestCaveat: Object.freeze({
    isProof: false,
    isRigorous: false,
    isUnconditional: false,
    isSymmetricAcrossAxes: false,
    mustMonitorAtRuntime: true,
    changesAnyBound: false,
    reDerivesAnything: false,
    sota: 'No refereed bound is changed',
  }),

  verdict:
    'MEASUREMENT-ONLY restatement of imp-36061: the run-time-monitoring detuning margin needed to ' +
    'RECOVER the imp-35812 baseline running-accumulator ratio r_base ~ 1.18e-3 (not merely drop ' +
    'under the imp-35991 r < 1e-2 basin edge) is ~16x wider on the alpha axis (|delta| ~ 0.560 / ' +
    '0.611 rad for 10% / 1% recovery) and ~12x wider on the beta axis (beta ~ 3.19 / 3.32), and the ' +
    'two axes are ASYMMETRIC: the alpha edges sit just inside the baseline alpha detuning while the ' +
    'beta edges lie beyond the baseline beta (drift alone under-recovers). Precision stays NOT the ' +
    'binding constraint even at full collapse; the obstruction stays the ENGINEERING of the ' +
    'certified length-N interval sum (GREENFIELD / MECHANICAL). Restatement only; changes no ' +
    'bound; C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
});

export const IMP36125_W1_ACCUMULATOR_RECOVERY_MARGIN_HONEST_STATUS_ASSERTIONS = [
  {
    id: 'imp36125-source-is-not-rigorous',
    why: 'The core claim of this note is that the imp-36061 finding is a measurement, not a certified result -- the source module must itself be marked isRigorous:false.',
    holds: () =>
      IMP36125_W1_ACCUMULATOR_RECOVERY_MARGIN_HONEST_STATUS.isRigorous === false &&
      SRC.isRigorous === false,
  },
  {
    id: 'imp36125-alpha-widening-matches-source',
    why: 'The recorded alpha widening factor must match the imp-36061 source literal (~16x).',
    holds: () =>
      Math.abs(
        IMP36125_W1_ACCUMULATOR_RECOVERY_MARGIN_HONEST_STATUS.alphaWideningFactor -
          SRC.comparisonToBasinEdge.alphaWideningFactor
      ) < 1e-12 && IMP36125_W1_ACCUMULATOR_RECOVERY_MARGIN_HONEST_STATUS.alphaWideningFactor > 8,
  },
  {
    id: 'imp36125-beta-widening-matches-source',
    why: 'The recorded beta widening factor must match the imp-36061 source literal (~12x).',
    holds: () =>
      Math.abs(
        IMP36125_W1_ACCUMULATOR_RECOVERY_MARGIN_HONEST_STATUS.betaWideningFactor -
          SRC.comparisonToBasinEdge.betaWideningFactor
      ) < 1e-12 && IMP36125_W1_ACCUMULATOR_RECOVERY_MARGIN_HONEST_STATUS.betaWideningFactor > 5,
  },
  {
    id: 'imp36125-alpha-edge-inside-beta-edge-beyond',
    why: 'The asymmetry claim must hold numerically: alpha recovery edge < baseline alpha detuning, beta recovery edge > baseline beta.',
    holds: () =>
      IMP36125_W1_ACCUMULATOR_RECOVERY_MARGIN_HONEST_STATUS.alphaEdge1 < SRC.alphaAxis.baselineDetuning &&
      IMP36125_W1_ACCUMULATOR_RECOVERY_MARGIN_HONEST_STATUS.betaEdge10 > SRC.betaAxis.baselineBeta,
  },
  {
    id: 'imp36125-honesty-boundary-mentions-asymmetry',
    why: 'The honesty-boundary text must plainly name the ASYMMETRIC recovery margins, distinguishing it from a symmetric-margin claim.',
    holds: () =>
      /ASYMMETRIC/.test(IMP36125_W1_ACCUMULATOR_RECOVERY_MARGIN_HONEST_STATUS.honestyBoundary) &&
      /under-recovering/.test(IMP36125_W1_ACCUMULATOR_RECOVERY_MARGIN_HONEST_STATUS.honestyBoundary),
  },
  {
    id: 'imp36125-honesty-gate',
    why: 'This is a read-only restatement note: it must not claim symmetric margins, nor claim a bound change.',
    holds: () =>
      IMP36125_W1_ACCUMULATOR_RECOVERY_MARGIN_HONEST_STATUS.honestCaveat.isSymmetricAcrossAxes === false &&
      IMP36125_W1_ACCUMULATOR_RECOVERY_MARGIN_HONEST_STATUS.honestCaveat.mustMonitorAtRuntime === true &&
      IMP36125_W1_ACCUMULATOR_RECOVERY_MARGIN_HONEST_STATUS.honestCaveat.changesAnyBound === false &&
      /Platt-Trudgian|refereed bound is changed/.test(IMP36125_W1_ACCUMULATOR_RECOVERY_MARGIN_HONEST_STATUS.honestCaveat.sota),
  },
  {
    id: 'imp36125-verdict-no-qed',
    why: 'The verdict must record NO QED, matching the standing no-refereed-bound-change caveat.',
    holds: () => /NO QED/.test(IMP36125_W1_ACCUMULATOR_RECOVERY_MARGIN_HONEST_STATUS.verdict),
  },
];

for (const assertion of IMP36125_W1_ACCUMULATOR_RECOVERY_MARGIN_HONEST_STATUS_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-36125-w1-accumulator-recovery-margin-honest-status assertion failed: ${assertion.id}`
    );
  }
}

export default IMP36125_W1_ACCUMULATOR_RECOVERY_MARGIN_HONEST_STATUS;
