/**
 * @module imp-33976-model-cusp-onset-family-honest-banner
 * @fileoverview imp-33976 -- consolidated honest-status banner for the model-cusp ONSET family:
 * imp-33853 (closed-form 4/3 onset coefficient, on-axis theta = pi/2, alpha = 1/2), imp-33882
 * (coefficient C(alpha) = 2/(alpha+1) as a function of the cusp exponent alpha), imp-33883
 * (off-axis angle robustness of the leading amplitude modulus C_PS and its phase winding), and
 * imp-33924 (the joint (alpha, theta) map unifying all three).
 *
 * WHY THIS BANNER. Each of the four modules already carries its OWN honesty gate (isRigorous:
 * false, dischargesH4: false, "G6a_shock_lipschitz STAYS OPEN"), but there is no SINGLE place
 * that states the shared caveat for the family as a whole: the 4/3 coefficient, the C_PS = pi/
 * sqrt(2) modulus, and the phase-winding results are ALL derived on the MODEL cusp
 * rho(x) = |x|^{-alpha} (the idealized Holder-cusp density used throughout this family), not on
 * the real fold-modulus back-conversion m_prime(z_0) -> C_ren the H4 minimal-input condition
 * (imp-33766) actually needs. None of the four re-derives that map. H4 stays undischarged and
 * G6a_shock_lipschitz stays open across the WHOLE family, not just module-by-module.
 *
 * This banner reads the four modules' live exported objects (not a frozen audit snapshot) so it
 * cannot silently drift out of sync if a member module's honesty fields ever change.
 *
 * @see imp-33853-cren-gap-coefficient-closed-form (4/3 coefficient, on-axis anchor)
 * @see imp-33882-cusp-exponent-onset-coefficient-robustness (C(alpha) = 2/(alpha+1) general form)
 * @see imp-33883-off-axis-onset-angle-robustness (C_PS modulus + phase winding, angle sweep)
 * @see imp-33924-joint-cusp-angle-onset-robustness-map (joint (alpha, theta) unification)
 * @see imp-33766-h4-independent-discharge-scoping (the H4 minimal-input condition this family does not meet)
 */

import { IMP33853_CREN_GAP_COEFFICIENT_CLOSED_FORM } from './imp-33853-cren-gap-coefficient-closed-form.js';
import { IMP33882_CUSP_EXPONENT_ONSET_COEFFICIENT_ROBUSTNESS } from './imp-33882-cusp-exponent-onset-coefficient-robustness.js';
import { IMP33883_OFF_AXIS_ONSET_ANGLE_ROBUSTNESS } from './imp-33883-off-axis-onset-angle-robustness.js';
import { IMP33924_JOINT_CUSP_ANGLE_ONSET_ROBUSTNESS_MAP } from './imp-33924-joint-cusp-angle-onset-robustness-map.js';

const FAMILY = Object.freeze([
  Object.freeze({ ticket: 'imp-33853', module: IMP33853_CREN_GAP_COEFFICIENT_CLOSED_FORM, result: '4/3 onset coefficient (on-axis anchor)' }),
  Object.freeze({ ticket: 'imp-33882', module: IMP33882_CUSP_EXPONENT_ONSET_COEFFICIENT_ROBUSTNESS, result: 'C(alpha) = 2/(alpha+1) general coefficient law' }),
  Object.freeze({ ticket: 'imp-33883', module: IMP33883_OFF_AXIS_ONSET_ANGLE_ROBUSTNESS, result: 'C_PS modulus angle-robustness + phase winding' }),
  Object.freeze({ ticket: 'imp-33924', module: IMP33924_JOINT_CUSP_ANGLE_ONSET_ROBUSTNESS_MAP, result: 'joint (alpha, theta) unification' }),
]);

const ALL_ISRIGOROUS_FALSE = FAMILY.every((m) => m.module.isRigorous === false);
const ALL_DISCHARGES_H4_FALSE = FAMILY.every((m) => m.module.dischargesH4 === false);

export const IMP33976_MODEL_CUSP_ONSET_FAMILY_HONEST_BANNER = Object.freeze({
  id: 'imp-33976-model-cusp-onset-family-honest-banner',
  ticket: 'imp-33976',
  family: FAMILY.map((m) => ({ ticket: m.ticket, result: m.result })),

  banner:
    'MODEL-CUSP CAVEAT: the 4/3 onset coefficient (imp-33853), the general C(alpha) = 2/(alpha+1) ' +
    'law (imp-33882), the C_PS = pi/sqrt(2) modulus and its phase winding (imp-33883), and their ' +
    'joint (alpha, theta) unification (imp-33924) are ALL derived on the MODEL cusp density ' +
    'rho(x) = |x|^{-alpha} -- an idealized Holder-cusp stand-in, not the real fold-modulus ' +
    'back-conversion. None of the four re-derives the m_prime -> C_ren map that the H4 ' +
    'minimal-input condition (imp-33766) actually requires. H4 is NOT discharged by this family. ' +
    'G6a_shock_lipschitz STAYS OPEN. No positivity result changes; imp-3066 K_a >= 0 stays ' +
    'UNTOUCHED. NO QED. No refereed bound is changed.',

  allIsRigorousFalse: ALL_ISRIGOROUS_FALSE,
  allDischargesH4False: ALL_DISCHARGES_H4_FALSE,

  honest:
    'This module only CONSOLIDATES the pre-existing per-module honesty gates of imp-33853/33882/ ' +
    '33883/33924 into one cross-family banner; it changes no bound and derives no new result of ' +
    'its own.',
});

export const IMP33976_MODEL_CUSP_ONSET_FAMILY_HONEST_BANNER_ASSERTIONS = [
  {
    id: 'imp33976-family-has-four-members',
    description: 'the banner names exactly the four imp-33853/33882/33883/33924 family members',
    holds: () => IMP33976_MODEL_CUSP_ONSET_FAMILY_HONEST_BANNER.family.length === 4
      && ['imp-33853', 'imp-33882', 'imp-33883', 'imp-33924'].every(
        (t) => IMP33976_MODEL_CUSP_ONSET_FAMILY_HONEST_BANNER.family.some((m) => m.ticket === t)
      ),
  },
  {
    id: 'imp33976-all-four-isrigorous-false',
    description: 'every family member module live-reports isRigorous === false',
    holds: () => ALL_ISRIGOROUS_FALSE && IMP33976_MODEL_CUSP_ONSET_FAMILY_HONEST_BANNER.allIsRigorousFalse === true,
  },
  {
    id: 'imp33976-all-four-do-not-discharge-h4',
    description: 'every family member module live-reports dischargesH4 === false',
    holds: () => ALL_DISCHARGES_H4_FALSE && IMP33976_MODEL_CUSP_ONSET_FAMILY_HONEST_BANNER.allDischargesH4False === true,
  },
  {
    id: 'imp33976-banner-names-model-cusp-and-open-status',
    description: 'the banner text explicitly names the model cusp, H4, and G6a_shock_lipschitz open status',
    holds: () => /MODEL cusp density/.test(IMP33976_MODEL_CUSP_ONSET_FAMILY_HONEST_BANNER.banner)
      && /H4 is NOT discharged/.test(IMP33976_MODEL_CUSP_ONSET_FAMILY_HONEST_BANNER.banner)
      && /G6a_shock_lipschitz STAYS OPEN/.test(IMP33976_MODEL_CUSP_ONSET_FAMILY_HONEST_BANNER.banner)
      && /NO QED/.test(IMP33976_MODEL_CUSP_ONSET_FAMILY_HONEST_BANNER.banner)
      && /refereed bound is changed/i.test(IMP33976_MODEL_CUSP_ONSET_FAMILY_HONEST_BANNER.banner),
  },
];

for (const a of IMP33976_MODEL_CUSP_ONSET_FAMILY_HONEST_BANNER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33976-model-cusp-onset-family-honest-banner assertion failed: ${a.id}`);
  }
}

export default IMP33976_MODEL_CUSP_ONSET_FAMILY_HONEST_BANNER;
