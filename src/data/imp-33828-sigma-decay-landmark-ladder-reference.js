/**
 * @module imp-33828-sigma-decay-landmark-ladder-reference
 * @fileoverview imp-33828 -- CONTENT REFERENCE (read-only). The lambda-roadmap.js currentStatus
 * paragraph accumulates the sigma(N) = E_coll(N)/E(N) decay landmarks (imp-3220/imp-3406/imp-33582/
 * imp-33721/imp-33723/imp-33743) one PHASE at a time in prose, so no single place lists them in
 * N-order with provenance. This module tabulates the ladder once, in N-order, each entry citing the
 * imp-id that established it -- a pure reference, no new derivation or measurement.
 *
 * THE LADDER (N-order, from lambda-roadmap.js currentStatus)
 * ------------------------------------------------------------
 *   N ~ 9.22e5    interior peak, sigma_max ~ 0.9494       (imp-3406)
 *   N ~ 2.57e7    sigma last above 0.9                    (imp-33582)
 *   N ~ 3.267e9   sigma = 0.5 (halving)                   (imp-33582; bisected imp-3444)
 *   N ~ 3.280e9   E_coll = E_trunc crossover (closed form) (imp-3444 bisection; imp-33723 closed form)
 *   N ~ 3.38e9    sigma decay-exponent inflection knee     (imp-33721; closed form imp-33744)
 *   N ~ 3.21e11   sigma last above 0.1 (closed form)        (imp-33582; closed form imp-33743)
 *
 * All six sit on the single monotone-decreasing right arm of the imp-3406 N-shape past the interior
 * peak (imp-3444 F3). This module changes no value and adds no new landmark -- it is a cross-reference
 * only, collecting figures already on record in lambda-roadmap.js currentStatus.
 *
 * ASSESSMENT ONLY. No positivity, no bridge closure, no RH claim, NO QED.
 * No refereed bound is changed. imp-3066 K_a >= 0 untouched.
 *
 * @see imp-3406-sigma-highN-extrapolation (interior peak N ~ 9.22e5)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (sigma>0.9 / halving / sigma<0.1 empirical landmarks)
 * @see imp-3444-sigma-nshape-landmark-ladder (bisected halving / E_coll=E_trunc crossover, monotone-arm proof)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (E_coll=E_trunc crossover closed form)
 * @see imp-33721-sigma-subdecade-exponent-curvature (inflection knee relocated to N* ~ 3.38e9)
 * @see imp-33743 (sigma<0.1 far-tail landmark closed form)
 */

const SIGMA_DECAY_LANDMARK_LADDER = [
  {
    name: 'interior_peak',
    N: 9.22e5,
    label: 'interior maximum, sigma_max ~ 0.9494',
    source: 'imp-3406',
  },
  {
    name: 'sigma_above_0.9_until',
    N: 2.57e7,
    label: 'sigma stays above 0.9 until this N',
    source: 'imp-33582',
  },
  {
    name: 'halving',
    N: 3.267e9,
    label: 'sigma = 0.5 (halving landmark)',
    source: 'imp-33582',
  },
  {
    name: 'Ecoll_eq_Etrunc_crossover',
    N: 3.280294e9,
    label: 'E_coll = E_trunc crossover (closed-form Banach fixed point)',
    source: 'imp-33723',
  },
  {
    name: 'inflection_knee',
    N: 3.38e9,
    label: 'sigma decay-exponent sub-decade inflection knee',
    source: 'imp-33721',
  },
  {
    name: 'sigma_below_0.1',
    N: 3.21e11,
    label: 'sigma first drops below 0.1 (closed-form residual ~7.4e-5)',
    source: 'imp-33582',
  },
];

export const IMP_33828_SIGMA_DECAY_LANDMARK_LADDER_REFERENCE = {
  id: 'imp-33828',
  quantity: 'sigma(N) = E_coll(N)/E(N), the E(N) bridge GUE-conditional share (imp-3220)',
  ladder: SIGMA_DECAY_LANDMARK_LADDER,
  isRigorous: false,
  verdict:
    'REFERENCE ONLY (no QED). Collects the six sigma(N)-decay landmarks already recorded across ' +
    'lambda-roadmap.js currentStatus PHASEs, in strict N-order, each tagged with the imp-id that ' +
    'established it: interior peak (imp-3406) < sigma>0.9 threshold (imp-33582) < halving (imp-33582) ' +
    '< E_coll=E_trunc crossover (imp-33723) < inflection knee (imp-33721) < sigma<0.1 threshold ' +
    '(imp-33582). No new value is derived and no bound changes. No refereed bound is changed' +
    '; imp-3066 K_a >= 0 is untouched.',
};

const IMP_33828_ASSERTIONS = [
  {
    id: 'imp33828-exactly-six-landmarks',
    holds: () => SIGMA_DECAY_LANDMARK_LADDER.length === 6,
    why: 'The ladder tabulates exactly the six named currentStatus landmarks, no more, no fewer.',
  },
  {
    id: 'imp33828-strict-N-order',
    holds: () =>
      SIGMA_DECAY_LANDMARK_LADDER.every(
        (entry, i) => i === 0 || SIGMA_DECAY_LANDMARK_LADDER[i - 1].N < entry.N
      ),
    why: 'The ladder must be listed in strictly increasing N -- the requested N-order.',
  },
  {
    id: 'imp33828-every-entry-has-provenance',
    holds: () => SIGMA_DECAY_LANDMARK_LADDER.every((entry) => /^imp-\d+$/.test(entry.source)),
    why: 'Every landmark cites a single imp-NNN provenance id, per the ticket requirement.',
  },
  {
    id: 'imp33828-honesty-gate-no-qed',
    holds: () =>
      IMP_33828_SIGMA_DECAY_LANDMARK_LADDER_REFERENCE.isRigorous === false &&
      /no QED/i.test(IMP_33828_SIGMA_DECAY_LANDMARK_LADDER_REFERENCE.verdict) &&
      /refereed bound is changed/i.test(IMP_33828_SIGMA_DECAY_LANDMARK_LADDER_REFERENCE.verdict) &&
      /imp-3066/.test(IMP_33828_SIGMA_DECAY_LANDMARK_LADDER_REFERENCE.verdict),
    why: 'VERDICT LOCK: reference-only, no bound changed, imp-3066 untouched, no refereed bound is changed.',
  },
];

for (const a of IMP_33828_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-33828 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_33828_ASSERTIONS };
