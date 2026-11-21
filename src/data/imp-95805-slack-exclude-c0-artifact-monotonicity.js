/**
 * @module imp-95805-slack-exclude-c0-artifact-monotonicity
 *
 * imp-95805 -- ASSESSING whether EXCLUDING the C0-artifact T = 1.5e5 touch from the
 * imp-95783 measured-regime slack sequence leaves a MONOTONE (or cleanly-trending)
 * five-height sub-family s(T) = r(T)/r_cap(T) that could supply a TWO-SIDED bracket
 * r_lo(T) <= r(T) <= r_cap(T) below the imp-95750 ceiling gamma_1e6 = 6.003e5, sharpening
 * the current one-sided r(T) in (0, r_cap(T)].
 *
 * WHY. imp-95783 measured the six-height slack s = measuredVar/cappedVariance and reported
 * it NON-MONOTONE (0.889 -> 0.767 -> 0.724 -> 1.000 -> 0.846 -> 0.809), with the s = 1
 * touch at T = 1.5e5 shown to be an ARTIFACT of the max-anchored offset C0 pinned there
 * (imp-95783 F2). The natural follow-up the ticket poses: does the non-monotonicity survive
 * removing that single artifact point? If the remaining five heights trended cleanly, the
 * trend could bound r(T) from BELOW as well as above, tightening the imp-95766 one-sided
 * envelope. This module answers that honest binary.
 *
 * WHAT IS COMPUTED. The same imp-95783/imp-95766 closed forms and the same six imp-95562
 * measured literals are reproduced verbatim (import-light, no zeros bundle). The slack is
 * recomputed at all six heights, the T = 1.5e5 C0-anchor point is dropped, and the ordered
 * five-point sub-sequence over (1e4, 3e4, 7e4, 3e5, 5e5) is tested for monotonicity.
 *
 * RESULT (assessment only).
 *  (F1) EXCLUSION DOES NOT RESTORE MONOTONICITY. The five remaining slacks in height order
 *       are 0.888962, 0.767194, 0.724375, 0.846149, 0.809257 -- step directions
 *       down, down, UP, down. The sub-family is neither non-increasing nor non-decreasing:
 *       it is a U-shape with a minimum at T = 7e4 (s = 0.7244), then a reversal UP to
 *       T = 3e5 (s = 0.8461) and back down at T = 5e5 (s = 0.8093). So removing the
 *       artifact leaves the slack still NON-MONOTONE.
 *  (F2) THE ONLY MONOTONE STRETCH IS THE LOW-T BRANCH, AND IT ALREADY REVERSES BELOW THE
 *       CEILING. The first three heights (1e4, 3e4, 7e4) do fall monotonically
 *       (0.8890 -> 0.7672 -> 0.7244), but that branch turns back UP at T = 3e5 -- still
 *       an order of magnitude BELOW the ceiling gamma_1e6 = 6.003e5. So even the local
 *       low-T trend cannot be extended toward the dead zone: the data reverse it first.
 *  (F3) NO TWO-SIDED BRACKET. With no monotone or cleanly-trending sub-family, there is no
 *       height-indexed lower proxy r_lo(T) to pair with r_cap(T); the slack range over the
 *       five points [0.7244, 0.8890] is a plain finite-sample spread, not an extrapolable
 *       envelope. The one-sided r(T) in (0, r_cap(T)] is unchanged.
 *
 * VERDICT. Excluding the C0-artifact T = 1.5e5 touch does NOT yield a monotone or
 * cleanly-trending slack sub-family: the five remaining heights step down, down, UP, down
 * (U-shape, minimum at T = 7e4, reversal up at T = 3e5), so the non-monotonicity is NOT an
 * artifact of the single anchor point. The only monotone stretch (the low-T branch
 * 1e4 -> 7e4) reverses at T = 3e5, still far below the imp-95750 ceiling
 * gamma_1e6 = 6.003e5, so it supplies no extrapolable trend into the dead zone. Hence no
 * two-sided bracket r_lo(T) <= r(T) <= r_cap(T) can be formed even below the ceiling, and
 * the imp-95766 one-sided bound r(T) in (0, r_cap(T)] stands unchanged. Assessment only;
 * does NOT extend into the dead zone; adds no cited input; changes no bound; NO QED; the
 * zero-side route stays PCC/GRH-gated; no refereed bound is changed.
 *
 * Import-light: no zeros bundle, no sibling imports. The six sd(C - E) values are the same
 * measured literals imp-95710/imp-95722/imp-95766/imp-95783 baked (imp-95562 over the 10^6
 * Odlyzko ordinates); every derived quantity is recomputed here from the imp-95766 forms.
 *
 * @see imp-95783-rtrue-vs-rcap-gap-deadzone (six-height slack, C0 artifact, non-monotone)
 * @see imp-95766-number-variance-cap-crossover-deadzone (derived envelope r_cap, offset C0)
 * @see imp-95750-number-variance-deadzone-measurement-reach (ceiling gamma_1e6 = 6.003e5)
 * @see imp-95562-meansquare-vs-pointwise-gap (six measured sd(C - E) literals)
 */

const TWO_PI = 2 * Math.PI;
const EULER = 0.5772156649015329;
const SELBERG_C = 1 / (2 * Math.PI * Math.PI);
const logLog = (T) => Math.log(Math.log(T / TWO_PI));

// Same six measured literals imp-95783/imp-95722/imp-95766 baked (imp-95562 over 10^6 ordinates).
const MEASURED = [
  { Tc: 1.0e4, sdDiscrepancy: 0.6218 },
  { Tc: 3.0e4, sdDiscrepancy: 0.5823 },
  { Tc: 7.0e4, sdDiscrepancy: 0.5689 },
  { Tc: 1.5e5, sdDiscrepancy: 0.6714 },
  { Tc: 3.0e5, sdDiscrepancy: 0.6199 },
  { Tc: 5.0e5, sdDiscrepancy: 0.6078 },
];

// Reproduce the imp-95766/imp-95722 finite-height offset C0 (max-anchored, NOT a fit).
const C0 = Math.max(...MEASURED.map((m) => m.sdDiscrepancy * m.sdDiscrepancy - SELBERG_C * logLog(m.Tc)));
const cappedVariance = (T) => SELBERG_C * logLog(T) + C0; // imp-95766 envelope variance >= true var

const CEILING_GAMMA_1E6 = 600269.6770124451; // imp-95750 direct-measurement ceiling
const C0_ANCHOR_HEIGHT = 1.5e5; // the max-anchored s = 1 artifact height (imp-95783 F2)

// Slack s(T) = measuredVar/cappedVariance at every height (reproduces imp-95783).
const allRows = MEASURED.map((m) => {
  const measuredVar = m.sdDiscrepancy * m.sdDiscrepancy;
  const capVar = cappedVariance(m.Tc);
  return {
    Tc: m.Tc,
    log10Tc: +Math.log10(m.Tc).toFixed(4),
    slack: +(measuredVar / capVar).toFixed(6), // s = r/r_cap in (0,1]
    isC0Artifact: m.Tc === C0_ANCHOR_HEIGHT,
  };
});

// The five-height sub-family with the C0-artifact touch removed (height order preserved).
const fiveRows = allRows.filter((row) => !row.isC0Artifact);
const s5 = fiveRows.map((row) => row.slack);

// Monotonicity test on the five-point sub-sequence.
const nonIncreasing = s5.every((v, i) => i === 0 || v <= s5[i - 1] + 1e-12);
const nonDecreasing = s5.every((v, i) => i === 0 || v >= s5[i - 1] - 1e-12);
const fiveIsMonotone = nonIncreasing || nonDecreasing;
const stepDirections = s5.map((v, i) => (i === 0 ? 'start' : v > s5[i - 1] + 1e-12 ? 'up' : 'down'));

// Landmarks of the residual U-shape.
const minSlackFive = Math.min(...s5);
const maxSlackFive = Math.max(...s5);
const argminHeight = fiveRows[s5.indexOf(minSlackFive)].Tc; // 7e4: the U-shape minimum
const reversalHeight = fiveRows.find((row, i) => i > 0 && row.slack > s5[i - 1] + 1e-12)?.Tc; // 3e5: first up-step

// The low-T branch (heights below the reversal) is the only monotone stretch.
const lowTBranch = fiveRows.filter((row) => row.Tc < reversalHeight);
const lowTSlacks = lowTBranch.map((row) => row.slack);
const lowTMonotoneDown = lowTSlacks.every((v, i) => i === 0 || v <= lowTSlacks[i - 1] + 1e-12);

export const IMP95805_SLACK_EXCLUDE_C0_ARTIFACT_MONOTONICITY = {
  ticket: 'imp-95805',
  proofSection: 'S-frontier',
  question:
    'Does EXCLUDING the C0-artifact T = 1.5e5 touch from the imp-95783 measured-regime slack ' +
    's(T) = r(T)/r_cap(T) leave a MONOTONE (or cleanly-trending) five-height sub-family that could ' +
    'bracket the true ratio r(T) from BELOW as well as above (r_lo(T) <= r(T) <= r_cap(T)) below the ' +
    'imp-95750 ceiling gamma_1e6 = 6.003e5? Assess only; changes no bound; NO QED.',
  definitions: {
    slack: 's(T) = r(T)/r_cap(T) = measuredVar/cappedVariance in (0,1]; how far below the envelope the true ratio sits',
    c0Artifact: 'the s = 1 touch at T = 1.5e5, pinned by the max-anchored offset C0 (imp-95783 F2), excluded here',
    twoSidedBracket: 'r_lo(T) <= r(T) <= r_cap(T); would require a height-indexed lower proxy r_lo from a clean slack trend',
  },
  offsetC0: C0, // reproduces imp-95766/imp-95722/imp-95783
  allRows,
  fiveRows, // C0-artifact removed
  fiveSlackSequence: s5,
  stepDirections, // start, down, down, up, down
  fiveIsMonotone, // false: still non-monotone after exclusion
  residualUShape: {
    argminHeight, // 7e4
    minSlack: +minSlackFive.toFixed(6),
    maxSlack: +maxSlackFive.toFixed(6),
    reversalHeight, // 3e5: slack turns back UP here, still << ceiling
    ceilingGamma1e6: +CEILING_GAMMA_1E6.toExponential(6),
  },
  lowTBranch: {
    heights: lowTBranch.map((row) => row.Tc), // 1e4, 3e4, 7e4
    slacks: lowTSlacks,
    monotoneDecreasing: lowTMonotoneDown, // true, but reverses at reversalHeight below the ceiling
  },
  twoSidedBracketPossible: false,
  isRigorous: false,
  verdict:
    'ASSESSMENT (frontier, NOT rigorous). Excluding the C0-artifact T = 1.5e5 touch does NOT yield a ' +
    'monotone or cleanly-trending slack sub-family: the five remaining heights step down, down, UP, ' +
    'down (0.888962, 0.767194, 0.724375, 0.846149, 0.809257), a U-shape with minimum at T = 7e4 and a ' +
    'reversal up at T = 3e5, so the non-monotonicity is NOT an artifact of the single anchor point. The ' +
    'only monotone stretch (the low-T branch 1e4 -> 7e4) reverses at T = 3e5, still far below the ' +
    'imp-95750 ceiling gamma_1e6 = 6.003e5, so it supplies no extrapolable trend into the dead zone. ' +
    'Hence no two-sided bracket r_lo(T) <= r(T) <= r_cap(T) can be formed even below the ceiling, and the ' +
    'imp-95766 one-sided bound r(T) in (0, r_cap(T)] stands unchanged. Assessment only; does NOT extend ' +
    'into the dead zone; adds no cited input; changes no bound; NO QED; the zero-side route stays ' +
    'PCC/GRH-gated; no refereed bound is changed.',
  citation:
    'imp-95783 (six-height slack, C0 artifact, non-monotone); imp-95766 (derived envelope r_cap, offset ' +
    'C0, r in (0, r_cap]); imp-95750 (ceiling gamma_1e6 = 6.003e5); imp-95562 (six measured sd(C - E)).',
};

// --- self-executing internal-consistency assertions (formula re-derivation only) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  // C0 reproduces the imp-95783/imp-95766 pinned offset (same six literals, same closed form).
  if (!approx(C0, 0.3337213835371905, 1e-12)) throw new Error('imp-95805: C0 drifted from the imp-95766 pinned offset');
  // Exactly one row is the C0 artifact, and the five-point sub-family drops it.
  if (allRows.filter((row) => row.isC0Artifact).length !== 1) throw new Error('imp-95805: C0 artifact point not uniquely identified');
  if (fiveRows.length !== 5) throw new Error('imp-95805: five-height sub-family is not five points');
  if (fiveRows.some((row) => row.Tc === C0_ANCHOR_HEIGHT)) throw new Error('imp-95805: C0 artifact height still present in sub-family');
  // The five-point slack sequence is the expected literals.
  const expected = [0.888962, 0.767194, 0.724375, 0.846149, 0.809257];
  if (!s5.every((v, i) => approx(v, expected[i], 1e-6))) throw new Error('imp-95805: five-point slack sequence drifted');
  // Core finding: still non-monotone after exclusion (down, down, up, down).
  if (fiveIsMonotone) throw new Error('imp-95805: exclusion unexpectedly restored monotonicity -- assessment claim invalid');
  if (stepDirections.join(',') !== 'start,down,down,up,down') throw new Error('imp-95805: step-direction pattern drifted');
  // The residual U-shape minimum is at T = 7e4 and the reversal is at T = 3e5, below the ceiling.
  if (argminHeight !== 7e4) throw new Error('imp-95805: U-shape minimum is not at T = 7e4');
  if (reversalHeight !== 3e5) throw new Error('imp-95805: slack reversal is not at T = 3e5');
  if (!(reversalHeight < CEILING_GAMMA_1E6)) throw new Error('imp-95805: reversal is not below the imp-95750 ceiling');
  // The low-T branch is the only monotone stretch and it decreases.
  if (!lowTMonotoneDown) throw new Error('imp-95805: low-T branch is not monotone decreasing');
  // No two-sided bracket is claimed.
  if (IMP95805_SLACK_EXCLUDE_C0_ARTIFACT_MONOTONICITY.twoSidedBracketPossible !== false)
    throw new Error('imp-95805: twoSidedBracketPossible must be false');
  // honesty gates.
  if (IMP95805_SLACK_EXCLUDE_C0_ARTIFACT_MONOTONICITY.isRigorous !== false)
    throw new Error('imp-95805: isRigorous must be false');
  if (!/NO QED/.test(IMP95805_SLACK_EXCLUDE_C0_ARTIFACT_MONOTONICITY.verdict))
    throw new Error('imp-95805: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP95805_SLACK_EXCLUDE_C0_ARTIFACT_MONOTONICITY.verdict))
    throw new Error('imp-95805: verdict dropped the no-refereed-bound-change banner');
})();

export default IMP95805_SLACK_EXCLUDE_C0_ARTIFACT_MONOTONICITY;
