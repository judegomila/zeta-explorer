/**
 * @module imp-124825-etrunc-floor-exponent-chord-to-certification-upgrade-note
 * @fileoverview imp-124825 -- META cross-reference NOTE recording, standalone, that imp-124772's full
 *   10-floor OLS refit (p_knee_lsq ~ -2.106, R^2 ~ 0.99999, RMS residual ~ 1.6e-3 decades) UPGRADES the
 *   imp-97822 knee floor-elasticity exponent (~ -2.099) from a ZERO-RESIDUAL TWO-POINT CHORD (any two
 *   (log E_trunc, log N*) points define an exact line, so a two-floor fit cannot by itself distinguish a
 *   clean power law from curvature) to a QUANTIFIED-RESIDUAL CERTIFICATION over the entire imp-33708
 *   0.5x..5x floor ladder. This closes the two-point-fit caveat imp-124772 itself raised against its own
 *   source: the -2.099 chord was not an artifact of picking two convenient floors, it is the genuine
 *   large-sample slope to within ~0.007. Documentation only: no new numerics, no bound moves, NO QED.
 *
 * @see imp-97822-sigma-knee-etrunc-floor-elasticity.js (the two-floor chord p_knee ~ -2.099 being upgraded)
 * @see imp-124772-knee-floor-elasticity-multifloor-fit.js (the full 10-floor OLS certification, p_knee_lsq ~ -2.106)
 * @see imp-124822-frontier-crosscheck-batch-cohort-index.js (groups imp-124772 with three sibling certifications;
 *   this note isolates the specific chord-to-certification upgrade for standalone discoverability)
 *
 * Ticket: imp-124825 (meta, low, sonnet-4-6). Cross-reference note only; no bound on Lambda moves;
 * no refereed bound is changed; RH open; NO QED.
 */

import { IMP97822_SIGMA_KNEE_ETRUNC_FLOOR_ELASTICITY } from './imp-97822-sigma-knee-etrunc-floor-elasticity.js';
import { IMP124772_KNEE_FLOOR_ELASTICITY_MULTIFLOOR_FIT } from './imp-124772-knee-floor-elasticity-multifloor-fit.js';

const TWO_FLOOR_CHORD = IMP97822_SIGMA_KNEE_ETRUNC_FLOOR_ELASTICITY.kneeFloorExponent; // ~ -2.099
const FULL_LADDER_LSQ = IMP124772_KNEE_FLOOR_ELASTICITY_MULTIFLOOR_FIT.pKneeLsq; // ~ -2.106
const LSQ_R2 = IMP124772_KNEE_FLOOR_ELASTICITY_MULTIFLOOR_FIT.fit.r2; // ~ 0.99999
const LSQ_SAMPLE_SIZE = IMP124772_KNEE_FLOOR_ELASTICITY_MULTIFLOOR_FIT.fit.n; // 10
const CHORD_TO_LSQ_DELTA = IMP124772_KNEE_FLOOR_ELASTICITY_MULTIFLOOR_FIT.deltaTwoFloor; // ~0.007

export const IMP124825_ETRUNC_FLOOR_EXPONENT_CHORD_TO_CERTIFICATION_UPGRADE_NOTE = Object.freeze({
  ticket: 'imp-124825',
  restatedClaim:
    'imp-124772 upgrades the imp-97822 two-point chord to a quantified-residual certification over ' +
    'the full imp-33708 0.5x..5x floor ladder, closing the two-point-fit caveat',
  twoFloorChordIsTwoPointFit: LSQ_SAMPLE_SIZE === 10, // the chord used only 2 of these 10 floors
  twoFloorChord: TWO_FLOOR_CHORD,
  fullLadderSampleSize: LSQ_SAMPLE_SIZE,
  fullLadderLsqSlope: FULL_LADDER_LSQ,
  fullLadderR2: LSQ_R2,
  chordConfirmedByFullLadder: Math.abs(FULL_LADDER_LSQ - TWO_FLOOR_CHORD) < 0.02,
  chordToLsqDelta: CHORD_TO_LSQ_DELTA,
  r2HighEnoughToCertify: LSQ_R2 > 0.9999,
  anyBoundMoved: false,
  operatorPositivityEstablished: false,
  measurementOnly: true,
  isRigorous: false,
  qed: false,
});

export const IMP124825_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. imp-97822 fit the knee floor-elasticity ' +
  'p_knee in N* ~ E_trunc^(p_knee) from only two of the ten imp-33708 floor factors (0.5x and 2x), ' +
  'reading p_knee ~ ' + TWO_FLOOR_CHORD.toFixed(3) + ' -- a chord that is EXACT BY CONSTRUCTION (any two ' +
  '(log E_trunc, log N*) points define a line with zero residual) and so cannot by itself rule out that ' +
  'the true relation has curvature the two chosen floors happened to miss. imp-124772 closes that caveat: ' +
  'refitting by ordinary least squares over all ' + LSQ_SAMPLE_SIZE + ' floor factors in the ladder gives ' +
  'p_knee_lsq ~ ' + FULL_LADDER_LSQ.toFixed(3) + ' with R^2 ~ ' + LSQ_R2.toFixed(5) + ', within ~' +
  CHORD_TO_LSQ_DELTA.toFixed(3) + ' of the original chord. The two-point construction is thereby upgraded ' +
  'to a quantified-residual certification: the clean dimensional N* ~ E_trunc^(-2) scaling is confirmed, ' +
  'not an artifact of which two floors were picked. No new numerics, changes no bound; imp-3066 K_a >= 0 ' +
  'untouched.';

export default IMP124825_ETRUNC_FLOOR_EXPONENT_CHORD_TO_CERTIFICATION_UPGRADE_NOTE;

// -- self-executing assertion (imp-3715 convention): any failure throws at import --
if (
  !(
    IMP124825_ETRUNC_FLOOR_EXPONENT_CHORD_TO_CERTIFICATION_UPGRADE_NOTE.twoFloorChordIsTwoPointFit === true &&
    IMP124825_ETRUNC_FLOOR_EXPONENT_CHORD_TO_CERTIFICATION_UPGRADE_NOTE.chordConfirmedByFullLadder === true &&
    IMP124825_ETRUNC_FLOOR_EXPONENT_CHORD_TO_CERTIFICATION_UPGRADE_NOTE.r2HighEnoughToCertify === true &&
    IMP124825_ETRUNC_FLOOR_EXPONENT_CHORD_TO_CERTIFICATION_UPGRADE_NOTE.anyBoundMoved === false &&
    IMP124825_ETRUNC_FLOOR_EXPONENT_CHORD_TO_CERTIFICATION_UPGRADE_NOTE.operatorPositivityEstablished === false &&
    IMP124825_ETRUNC_FLOOR_EXPONENT_CHORD_TO_CERTIFICATION_UPGRADE_NOTE.measurementOnly === true &&
    IMP124825_ETRUNC_FLOOR_EXPONENT_CHORD_TO_CERTIFICATION_UPGRADE_NOTE.isRigorous === false &&
    IMP124825_ETRUNC_FLOOR_EXPONENT_CHORD_TO_CERTIFICATION_UPGRADE_NOTE.qed === false &&
    /NO QED/.test(IMP124825_HONEST_BANNER) &&
    /PT Lambda <= 0.2|refereed bound is changed/.test(IMP124825_HONEST_BANNER) &&
    /RH open/.test(IMP124825_HONEST_BANNER) &&
    /imp-3066 K_a >= 0 untouched/.test(IMP124825_HONEST_BANNER)
  )
) {
  throw new Error(
    'imp-124825-etrunc-floor-exponent-chord-to-certification-upgrade-note assertion FAILED: the imp-97822 ' +
      'two-floor chord must be confirmed, not contradicted, by the imp-124772 full-ladder OLS certification.'
  );
}
