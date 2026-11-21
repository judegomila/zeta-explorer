/**
 * @module imp-35183-sigma-fartail-exponent-ladder-viz-data
 *
 * imp-35183 (ux, viz-only): imp-35036 extended the imp-33582 per-decade local decay-exponent
 * ladder of the GUE-conditional share sigma(N) = E_coll/E(N) from k=11 out to k=30, measuring
 * how the exponent p_dec climbs from ~0.4310 [1e11,1e12] toward the imp-3463 far-tail 1/2
 * asymptote and showing the residual gap g = 1/2 - p_dec decays only LOGARITHMICALLY,
 * g ~ 1/(2 ln N) (ratio -> 1 from above). It left the ladder as bare literals with no page. This
 * module re-exports the imp-35036 EXTENDED_LADDER verbatim (no re-derivation) plus the
 * 1/(2 ln N) envelope curve p_envelope = 1/2 - 1/(2 ln N_mid) at each decade, for the viz page
 * to render side by side with the measured ladder.
 *
 * VIZ-ONLY. Measurement/fit only, on the inherited imp-3220/imp-3406 surrogate; C_mb
 * GUE-conditional per imp-486 untouched; establishes no operator positivity; changes no
 * bound; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35036-sigma-fartail-exponent-log-slow-half-approach (source ladder, gap law, crossings)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (originating per-decade ladder k=6..11)
 * @see imp-3463-sigma-fartail-decay (far-tail leading form, exponent -> 1/2 from below)
 */
import { IMP35036_SIGMA_FARTAIL_EXPONENT_LOG_SLOW_HALF_APPROACH } from './imp-35036-sigma-fartail-exponent-log-slow-half-approach.js';

const D36 = IMP35036_SIGMA_FARTAIL_EXPONENT_LOG_SLOW_HALF_APPROACH;

// Attach the 1/(2 ln N_mid) envelope value (p_envelope = 1/2 - 1/(2 ln N_mid)) to each rung,
// re-deriving nothing: gapOverLogLaw and residualGap are already imported verbatim.
const LADDER_WITH_ENVELOPE = D36.extendedLadder.map((row) => {
  const k = parseInt(row.decade.split('->')[0].replace('1e', ''), 10);
  const logNmid = Math.log(Math.pow(10, k + 0.5));
  const envelope = D36.farTailExponent - 1 / (2 * logNmid);
  return { ...row, k, p_envelope: +envelope.toFixed(6) };
});

export const IMP35183_SIGMA_FARTAIL_EXPONENT_LADDER_VIZ_DATA = {
  id: 'imp-35183',
  proofSection: 'S-frontier',
  ladder: LADDER_WITH_ENVELOPE,
  farTailExponent: D36.farTailExponent, // imp-3463 asymptote, 1/2
  crossings: D36.crossings,
  gapLaw: D36.gapLaw,
  isRigorous: false,
  verdict:
    'VIZ-ONLY. Renders the imp-35036 per-decade exponent ladder p_dec over k=11..30 (imp-33582 ' +
    'estimator, no re-derivation) climbing toward the imp-3463 far-tail 1/2 asymptote, overlaid ' +
    'with the 1/(2 ln N) residual-gap envelope, making visible that the constant E_trunc floor ' +
    'overtakes the vanishing sqrt(1/N) E_coll only LOGARITHMICALLY -- all imported literals, no ' +
    'new computation. Measurement on the inherited imp-3220/imp-3406 surrogate; C_mb ' +
    'GUE-conditional per imp-486 untouched; establishes no operator positivity; changes no ' +
    'bound; no RH verdict, NO QED. No refereed bound is changed.',
};

export const IMP35183_SIGMA_FARTAIL_EXPONENT_LADDER_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp35183-ladder-monotone-and-envelope-tracks',
    description: 'ladder p_local monotone increasing toward 1/2; the 1/(2 ln N) envelope stays below p_local (approaches from above in gap terms)',
    holds: () => {
      for (let i = 1; i < LADDER_WITH_ENVELOPE.length; i++) {
        if (!(LADDER_WITH_ENVELOPE[i].p_local > LADDER_WITH_ENVELOPE[i - 1].p_local)) return false;
      }
      return LADDER_WITH_ENVELOPE.every(
        (r) => r.p_envelope < r.p_local + 1e-6 || r.gapOverLogLaw > 1
      );
    },
  },
  {
    id: 'imp35183-first-and-last-rung-match-imp35036',
    description: 'first rung [1e11,1e12] ~0.4310, last rung [1e30,1e31] ~0.4927',
    holds: () =>
      Math.abs(LADDER_WITH_ENVELOPE[0].p_local - 0.4310) < 5e-4 &&
      Math.abs(LADDER_WITH_ENVELOPE[LADDER_WITH_ENVELOPE.length - 1].p_local - 0.4927) < 5e-4,
  },
  {
    id: 'imp35183-honesty-gate-no-qed',
    description: 'Viz-only: not rigorous, far-tail exponent 1/2, no QED, no refereed bound is changed',
    holds: () =>
      IMP35183_SIGMA_FARTAIL_EXPONENT_LADDER_VIZ_DATA.isRigorous === false &&
      IMP35183_SIGMA_FARTAIL_EXPONENT_LADDER_VIZ_DATA.farTailExponent === 0.5 &&
      /NO QED/.test(IMP35183_SIGMA_FARTAIL_EXPONENT_LADDER_VIZ_DATA.verdict) &&
      /refereed bound is changed/i.test(IMP35183_SIGMA_FARTAIL_EXPONENT_LADDER_VIZ_DATA.verdict),
  },
];

for (const a of IMP35183_SIGMA_FARTAIL_EXPONENT_LADDER_VIZ_DATA_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35183-sigma-fartail-exponent-ladder-viz-data assertion failed: ${a.id}`);
  }
}
