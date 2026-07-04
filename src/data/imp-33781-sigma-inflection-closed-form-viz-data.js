/**
 * @module imp-33781-sigma-inflection-closed-form-viz-data
 * @fileoverview imp-33781 -- lightweight viz-data module for the imp-33744
 *   sigma-inflection closed form sigma_infl = 1/2 - g_prime/(2 g^2). Samples
 *   the E_flow-negligible sigma(N) sigmoid across a log-spaced N ladder and
 *   marks two reference points on the same curve:
 *     - the PURE-POWER-LAW baseline: inflection forced to sigma = 1/2 EXACTLY
 *       (g constant, g_prime = 0);
 *     - the REAL closed-form inflection sigma_infl ~ 0.4977 (log-factor
 *       running g_prime ~ 1/(2 t^2) > 0), sitting the knee at N ~ +1.8% above
 *       the sigma = 1/2 halving landmark before any E_flow, widening to the
 *       full imp-33721 ~3.3% offset once E_flow is restored.
 *
 *   Self-computing from the same pinned constants imp-33744 already uses
 *   (effectiveHeightForN, C_C_PINNED) -- no heavy zeros-bundle import, no
 *   fresh model, no re-derivation. Viz data only; changes no bound; no QED.
 *
 *   @see imp-33744-sigma-inflection-vs-half-closed-form.js (the closed-form derivation)
 *   @see imp-33721-sigma-ramp-inflection-subdecade.js (the sub-decade knee this offset explains)
 *   @see imp-33582-sigma-postpeak-nearpeak-threshold-decay.js (the sigma=1/2 halving landmark)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP33744_SIGMA_INFLECTION_VS_HALF_CLOSED_FORM } from './imp-33744-sigma-inflection-vs-half-closed-form.js';

const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582/imp-33721)

// E_flow-negligible balance (imp-33708 shows E_flow negligible on the far tail) --
// identical sub-terms to imp-33744, reused here only to sample the curve for charting.
function sigmaNoFlow(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  return E_coll / (E_TRUNC_PT + E_coll);
}

// Log-spaced N ladder spanning the halving landmark (~3.27e9), one point per
// quarter-decade from 1e8 to 1e11, for a smooth sigmoid curve around the knee.
const N_LADDER = Object.freeze(
  Array.from({ length: 13 }, (_, i) => {
    const N = Math.pow(10, 8 + i * 0.25);
    return { N: +N.toExponential(4), sigma: +sigmaNoFlow(N).toFixed(6) };
  })
);

export const IMP33781_SIGMA_CURVE = N_LADDER;

// The flat pure-power-law baseline: inflection forced to sigma = 1/2 EXACTLY (g_prime = 0).
export const IMP33781_PURE_POWER_LAW_BASELINE = +IMP33744_SIGMA_INFLECTION_VS_HALF_CLOSED_FORM.purePowerLawSigmaAtInflection.toFixed(6);

// The real closed-form inflection marker (E_flow-negligible balance).
export const IMP33781_CLOSED_FORM_MARKER = Object.freeze({
  N: IMP33744_SIGMA_INFLECTION_VS_HALF_CLOSED_FORM.inflectionN_noFlow,
  sigma: IMP33744_SIGMA_INFLECTION_VS_HALF_CLOSED_FORM.sigmaInflectionClosedForm,
  offsetAboveHalving: IMP33744_SIGMA_INFLECTION_VS_HALF_CLOSED_FORM.offsetAboveHalving_noFlow,
});

// The halving landmark marker (imp-33582/imp-33721), sigma = 0.5 by definition.
export const IMP33781_HALVING_MARKER = Object.freeze({
  N: IMP33744_SIGMA_INFLECTION_VS_HALF_CLOSED_FORM.halvingLandmarkN,
  sigma: 0.5,
});

// The full-model (E_flow restored) exponent-ramp knee -- the ~3.3% offset imp-33721 measured.
export const IMP33781_FULL_MODEL_OFFSET_PCT = +(
  IMP33744_SIGMA_INFLECTION_VS_HALF_CLOSED_FORM.offsetAboveHalving_full_expRamp * 100
).toFixed(2);

export const IMP33781_ATTRIBUTION =
  'The offset is dominated by the log-factor curvature of E_coll’s own L = log T0(N) term ' +
  '(g_prime ~ 1/(2 t^2) > 0), NOT the Gronwall E_flow term -- E_flow only adds a same-order ' +
  'secondary shift (imp-33744 F2/F3).';

export const IMP33781_SIGMA_INFLECTION_CLOSED_FORM_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp33781-curve-is-monotone-decreasing',
    description: 'the E_flow-negligible sigma(N) curve decreases monotonically across the sampled N ladder',
    holds: () => IMP33781_SIGMA_CURVE.every((pt, i) => i === 0 || pt.sigma < IMP33781_SIGMA_CURVE[i - 1].sigma),
  },
  {
    id: 'imp33781-baseline-is-exact-half',
    description: 'pure-power-law baseline reproduces imp-33744 sigma = 1/2 EXACTLY (to 1e-5)',
    holds: () => Math.abs(IMP33781_PURE_POWER_LAW_BASELINE - 0.5) < 1e-5,
  },
  {
    id: 'imp33781-closed-form-marker-below-baseline',
    description: 'the real closed-form inflection marker sits below the 1/2 baseline (the log-factor displacement)',
    holds: () => IMP33781_CLOSED_FORM_MARKER.sigma < IMP33781_PURE_POWER_LAW_BASELINE,
  },
  {
    id: 'imp33781-full-model-offset-matches-imp33721-3pct',
    description: 'full-model exponent-ramp offset reproduces the imp-33721 ~3.3% knee-above-halving figure (2..5%)',
    holds: () => IMP33781_FULL_MODEL_OFFSET_PCT > 2 && IMP33781_FULL_MODEL_OFFSET_PCT < 5,
  },
  {
    id: 'imp33781-honesty-gate-no-qed',
    description: 'reused imp-33744 verdict carries isRigorous false and NO QED',
    holds: () =>
      IMP33744_SIGMA_INFLECTION_VS_HALF_CLOSED_FORM.isRigorous === false &&
      /NO QED/.test(IMP33744_SIGMA_INFLECTION_VS_HALF_CLOSED_FORM.verdict),
  },
];

for (const a of IMP33781_SIGMA_INFLECTION_CLOSED_FORM_VIZ_DATA_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33781-sigma-inflection-closed-form-viz-data assertion failed: ${a.id}`);
  }
}
