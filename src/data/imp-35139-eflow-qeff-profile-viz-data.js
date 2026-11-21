/**
 * @module imp-35139-eflow-qeff-profile-viz-data
 *
 * imp-35139 (ux, viz-only): imp-35039 mapped the full E_flow local decay exponent q_eff(x)
 * profile from the N ~ 1e9 crossing band out to the representable far tail (~1e300) and
 * CORRECTED the imp-34973 subGap premise of a turnover toward the imp-3463 far-tail 1/2 --
 * q_eff instead RISES MONOTONICALLY toward 1, with the single q_eff = 0.6 crossing an UPWARD
 * event far BELOW the band, and the 1/2 asymptote belonging to the separate E_coll term. This
 * module re-exports the imp-35039 literals VERBATIM (no re-derivation) for the viz page to
 * render.
 *
 * VIZ-ONLY. Measurement only, on the inherited imp-3220/imp-3406 surrogate; C_mb
 * GUE-conditional per imp-486 untouched; establishes no operator positivity; changes no
 * bound; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35039-eflow-qeff-profile-crossing-to-fartail (q_eff(x) profile, upward ladder, E_coll contrast)
 * @see imp-34973-pinned-product-slope-qeff-window-identity (subGap premise this corrects)
 * @see imp-3463-sigma-fartail-decay (far-tail 1/2, here shown to be the E_coll exponent)
 */
import { IMP35039_EFLOW_QEFF_PROFILE_CROSSING_TO_FARTAIL } from './imp-35039-eflow-qeff-profile-crossing-to-fartail.js';

const D39 = IMP35039_EFLOW_QEFF_PROFILE_CROSSING_TO_FARTAIL;

export const IMP35139_EFLOW_QEFF_PROFILE_VIZ_DATA = {
  id: 'imp-35139',
  proofSection: 'S-frontier',
  qEffProfile: D39.qEffProfile,
  ecollProfile: D39.ecollProfile,
  dexAtQeff0p6: D39.dexAtQeff0p6,
  upwardLadder: D39.upwardLadder,
  qEffBand: D39.qEffBand,
  qEffFar: D39.qEffFar,
  ecollBand: D39.ecollBand,
  ecollFar: D39.ecollFar,
  farTailExponent: D39.farTailExponent, // imp-3463 asymptote, 1/2 -- E_coll's, not E_flow's
  isRigorous: false,
  verdict:
    'VIZ-ONLY. Renders the imp-35039 q_eff(x) profile across dex 9..300 (18-point grid, no ' +
    'new computation) with the single upward q_eff = 0.6 crossing marked at N ~ 1e3.22 (far ' +
    'below the 1e9 crossing band), correcting the imp-34973 "descent toward 1/2" framing: ' +
    'q_eff rises MONOTONICALLY toward 1 while the imp-3463 far-tail 1/2 belongs to the ' +
    'separate E_coll log-derivative. Measurement on the inherited imp-3220/imp-3406 surrogate; ' +
    'C_mb GUE-conditional per imp-486 untouched; establishes no operator positivity; changes ' +
    'no bound; no RH verdict, NO QED. No refereed bound is changed.',
};

export const IMP35139_EFLOW_QEFF_PROFILE_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp35139-qeff-profile-monotonic-toward-one',
    description: 'imported q_eff profile is monotone increasing from ~0.8463 (1e9) toward ~0.9956 (1e300)',
    holds: () =>
      D39.qEffProfile.length === 18 &&
      D39.qEffProfile.every((p, i) => i === 0 || p.qEff > D39.qEffProfile[i - 1].qEff) &&
      Math.abs(D39.qEffBand - 0.8463) < 5e-3 &&
      Math.abs(D39.qEffFar - 0.9956) < 5e-3,
  },
  {
    id: 'imp35139-0p6-crossing-below-band',
    description: 'imported 0.6 crossing sits below the 1e9 band (dex ~3.22 < 9)',
    holds: () => D39.dexAtQeff0p6 < 9 && Math.abs(D39.dexAtQeff0p6 - 3.2245) < 5e-3,
  },
  {
    id: 'imp35139-ecoll-distinct-from-qeff',
    description: 'imported E_coll profile approaches 1/2 from below while q_eff approaches 1',
    holds: () =>
      D39.ecollProfile.length === 5 &&
      D39.ecollFar < D39.farTailExponent &&
      D39.qEffFar - D39.ecollFar > 0.4,
  },
  {
    id: 'imp35139-honesty-gate-no-qed',
    description: 'Viz-only: not rigorous, far-tail exponent 1/2 (E_coll), no QED, no refereed bound is changed',
    holds: () =>
      IMP35139_EFLOW_QEFF_PROFILE_VIZ_DATA.isRigorous === false &&
      IMP35139_EFLOW_QEFF_PROFILE_VIZ_DATA.farTailExponent === 0.5 &&
      /NO QED/.test(IMP35139_EFLOW_QEFF_PROFILE_VIZ_DATA.verdict) &&
      /refereed bound is changed/i.test(IMP35139_EFLOW_QEFF_PROFILE_VIZ_DATA.verdict),
  },
];

for (const a of IMP35139_EFLOW_QEFF_PROFILE_VIZ_DATA_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35139-eflow-qeff-profile-viz-data assertion failed: ${a.id}`);
  }
}
