/**
 * @module imp-34490-residue-error-bar-propagation
 * @fileoverview imp-34490 -- PROPAGATE the imp-34449 measured residue error bar
 *   R = -1.756e-8 +/- 0.019e-8 (~+/-1.1% half-width) into the THREE downstream residue-channel
 *   consumers that quote the point residue in isolation, and report whether carrying the band
 *   changes any qualitative verdict:
 *     - imp-34310 (raw-ratio channel): the SIMPLE-POLE (order-1) classification of the
 *       eflow_over_resid pole at k* ~ 21.28095.
 *     - imp-34398 (channel reconciliation): the R = E_star/m COEFFICIENT identity and the
 *       two-readings-of-one-monomial (coefficient vs dimensionless exponent) verdict.
 *     - imp-34454 (bridge-slope three-rung table): the resid_exp local slope m the bar
 *       implies, relative to the inherited ~8.4% three-rung m-band.
 *   The bar was reported in imp-34449 in isolation and never carried into these consumers.
 *   Re-evaluating each reading with the +/-1.1% band should leave all three verdicts robust --
 *   but that must be MEASURED, not assumed.
 *
 *   Import-light per [[no_heavy_imports_in_pages]] and [[verify_heavy_assertion_modules]]: this
 *   module imports ONLY the imp-34449 error-bar exports and the imp-34310 amplitude E_star (both
 *   import-light, tracing back to the imp-34237 zero-import baked rows -- no zeros-bundle chain).
 *   The propagation is a self-contained algebraic re-read of the SAME band, not a re-run of any
 *   pipeline.
 *
 *   THE PROPAGATION (three consumers, one band).
 *   -------------------------------------------
 *   The imp-34449 bar is R in [-1.77880e-8, -1.74023e-8], central (quartic) -1.75589e-8,
 *   half-width 1.929e-10 = 1.108% of |R|. Carry it through each reading:
 *
 *     (P1) SIMPLE-POLE CLASSIFICATION (imp-34310 F2). The order-1 verdict rests on resid_exp
 *          CHANGING SIGN across k* (odd-order zero), a magnitude-INDEPENDENT criterion. The band
 *          never touches R = 0: the least-negative endpoint R = -1.74023e-8 sits ~90 half-widths
 *          from zero, so R stays strictly negative (and eflow_attr > 0) across the whole band.
 *          A +/-1.1% amplitude wobble cannot flip a sign change or promote an odd zero to even.
 *          => simple-pole classification ROBUST.
 *
 *     (P2) R = E_star/m COEFFICIENT IDENTITY (imp-34398 T1/T3). R = E_star/m is an EXACT algebraic
 *          identity; the band moves R and the implied m = E_star/R together ALONG that identity
 *          curve, never off it. Inverting the band endpoints (E_star = 4.582753e-15 fixed) gives
 *          an implied slope band m in [-2.63341e-7, -2.57631e-7] (these are exactly the imp-34449
 *          quad/cubic slopes, by construction), central -2.60992e-7, a ~1.09% half-width -- i.e.
 *          the ~1.1% R-band maps to a ~1.1% m-band. The identity holds at every point of the band.
 *          => R = E_star/m identity ROBUST (unbreakable by construction; the bar only slides m).
 *
 *     (P3) TWO-READINGS-OF-ONE-MONOMIAL VERDICT (imp-34398 T2/T4, imp-34454). The exponent
 *          p = -1 is COEFFICIENT-INDEPENDENT (amplitude cancels in g_prime/g, imp-34333 /
 *          imp-34398 D3), so a +/-1.1% change in R leaves the log-derivative residue +1 unchanged.
 *          The coefficient-vs-exponent separation |+1|/|R| stays in [5.62e7, 5.75e7], safely inside
 *          the [1e7, 1e9] "differ by ~8 orders and by sign" window at BOTH band endpoints. So the
 *          two channels remain a coefficient and a dimensionless order, not two readings of one
 *          number. => two-readings verdict ROBUST.
 *
 *   HONEST DOMINANCE CAVEAT.
 *   -----------------------
 *   The +/-1.1% bar is SUBDOMINANT to the systematic raw-to-curvature-corrected offset it lives
 *   inside: the imp-34310 raw-ratio residue -1.97909e-8 and the imp-34449/imp-34397 curvature-
 *   corrected central -1.75589e-8 differ by ~11.3%, an order of magnitude LARGER than the ~1.1%
 *   bar. And the implied ~1.1% m-band [-2.63341e-7, -2.57631e-7] does NOT overlap the imp-34454
 *   three-rung m-band [-2.510e-7, -2.316e-7] -- the curvature-corrected slope reads systematically
 *   STEEPER than the imp-34310 secant m -2.3156e-7 (imp-34397 F: the secant under-reads |slope| in
 *   the convex tail by ~13.7%). So the residue-channel uncertainty is dominated by the raw-vs-
 *   corrected model choice, not by the +/-1.1% statistical bar; none of the three verdicts is
 *   sensitive to EITHER, but the honest error budget is the ~11% systematic, with the bar a small
 *   rider on top.
 *
 *   VERDICT: carrying the imp-34449 measured residue bar R = -1.756e-8 +/- 0.019e-8 (~+/-1.1%)
 *   through the imp-34310 / imp-34398 / imp-34454 consumers leaves ALL THREE verdicts ROBUST --
 *   the simple-pole (order-1) classification (magnitude-independent sign change; R ~90 half-widths
 *   from zero), the R = E_star/m coefficient identity (exact; the bar slides m ~1.1% along it), and
 *   the two-readings-of-one-monomial reconciliation (exponent coefficient-independent; ~8-orders-
 *   and-sign separation preserved at both band endpoints). The bar is SUBDOMINANT to the ~11%
 *   raw-vs-curvature-corrected systematic. PROPAGATION / measurement only on the self-contained
 *   band; the component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous
 *   asymptotic; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no
 *   bound; NO QED; no refereed bound is changed.
 *
 *   @see imp-34449-residue-curvature-error-bar-extended-rungs.js (the measured bar this propagates)
 *   @see imp-34310-eflow-over-resid-pole-residue-simple-pole.js (simple-pole classification; E_star)
 *   @see imp-34398-eflow-resid-pole-residue-channel-reconciliation.js (R=E_star/m; two-readings verdict)
 *   @see imp-34454-bridge-slope-three-rung-tabulation.js (three-rung m-band this compares against)
 */

import {
  IMP34449_RESIDUE_CENTRAL,
  IMP34449_RESIDUE_MIN,
  IMP34449_RESIDUE_MAX,
  IMP34449_ERROR_BAR_HALFWIDTH,
  IMP34449_ERROR_BAR_REL,
} from './imp-34449-residue-curvature-error-bar-extended-rungs.js';
import {
  IMP34310_EFLOW_ATTR_AT_KSTAR,
  IMP34310_POLE_RESIDUE,
} from './imp-34310-eflow-over-resid-pole-residue-simple-pole.js';

// --- baked reference literals from the downstream consumers -------------------
const E_STAR = IMP34310_EFLOW_ATTR_AT_KSTAR; // 4.582753e-15, imp-34310 F2 amplitude (fixed under the bar)
const IMP34454_M_BAND = [-2.51e-7, -2.316e-7]; // imp-34454 three-rung bridge-slope band
const IMP34454_M_NEARZERO = -2.3156e-7; // imp-34310 F1 secant slope (imp-34454 RUNG 1)

// --- (P1) simple-pole classification: how far the band sits from R = 0 --------
// order-1 rests on the resid_exp sign change (magnitude-independent); the band must not reach zero.
export const IMP34490_R_MIN = IMP34449_RESIDUE_MIN; // -1.77880e-8 (most negative)
export const IMP34490_R_MAX = IMP34449_RESIDUE_MAX; // -1.74023e-8 (least negative, nearest zero)
export const IMP34490_HALFWIDTHS_FROM_ZERO =
  Math.abs(IMP34490_R_MAX) / IMP34449_ERROR_BAR_HALFWIDTH; // ~90.2
export const IMP34490_SIGN_PRESERVED_ACROSS_BAND =
  IMP34490_R_MIN < 0 && IMP34490_R_MAX < 0; // true -> simple-pole robust

// --- (P2) R = E_star/m identity: implied slope band m = E_star/R --------------
// the bar slides m ALONG the identity curve; endpoints invert to the imp-34449 quad/cubic slopes.
export const IMP34490_M_FROM_R_CENTRAL = E_STAR / IMP34449_RESIDUE_CENTRAL; // -2.60992e-7
export const IMP34490_M_FROM_R_MIN = E_STAR / IMP34490_R_MIN; // -2.57631e-7 (R most negative -> m least)
export const IMP34490_M_FROM_R_MAX = E_STAR / IMP34490_R_MAX; // -2.63341e-7 (R least negative -> m most)
export const IMP34490_M_BAND_REL_HALFWIDTH =
  (Math.abs(IMP34490_M_FROM_R_MAX) - Math.abs(IMP34490_M_FROM_R_MIN)) /
  2 /
  Math.abs(IMP34490_M_FROM_R_CENTRAL); // ~0.0109 (~1.1%, mirrors the R band)

// --- (P3) two-readings verdict: coefficient-vs-exponent separation across band -
// the exponent p = -1 is coefficient-independent; |+1|/|R| must stay in [1e7, 1e9] at both ends.
export const IMP34490_SEPARATION_AT_R_MIN = 1 / Math.abs(IMP34490_R_MIN); // ~5.62e7
export const IMP34490_SEPARATION_AT_R_MAX = 1 / Math.abs(IMP34490_R_MAX); // ~5.75e7
export const IMP34490_SEPARATION_HOLDS_ACROSS_BAND =
  IMP34490_SEPARATION_AT_R_MIN > 1e7 &&
  IMP34490_SEPARATION_AT_R_MIN < 1e9 &&
  IMP34490_SEPARATION_AT_R_MAX > 1e7 &&
  IMP34490_SEPARATION_AT_R_MAX < 1e9; // true -> two-readings verdict robust

// --- honest dominance caveat: bar vs the raw-to-corrected systematic ----------
export const IMP34490_RAW_VS_CORRECTED_SYSTEMATIC_PCT =
  Math.abs(
    (IMP34449_RESIDUE_CENTRAL - IMP34310_POLE_RESIDUE) / IMP34310_POLE_RESIDUE,
  ) * 100; // ~11.3% (order of magnitude larger than the ~1.1% bar)

export const IMP34490_RESIDUE_ERROR_BAR_PROPAGATION = {
  ticket: 'imp-34490',
  proofSection: 'S-frontier',
  question:
    'Propagate the imp-34449 measured residue error bar R = -1.756e-8 +/- 0.019e-8 (~+/-1.1%) into the ' +
    'imp-34310 / imp-34398 / imp-34454 residue-channel consumers and report whether carrying the band ' +
    'changes the simple-pole (order-1) classification, the R = E_star/m coefficient identity, or the ' +
    'two-readings-of-one-monomial verdict. Measurement only; NO QED.',
  eStar: E_STAR,
  band: { rMin: IMP34490_R_MIN, rCentral: IMP34449_RESIDUE_CENTRAL, rMax: IMP34490_R_MAX },
  errorBarRel: IMP34449_ERROR_BAR_REL, // ~0.01108
  halfwidthsFromZero: IMP34490_HALFWIDTHS_FROM_ZERO, // ~90.2
  impliedSlopeBand: {
    mFromRMin: IMP34490_M_FROM_R_MIN,
    mCentral: IMP34490_M_FROM_R_CENTRAL,
    mFromRMax: IMP34490_M_FROM_R_MAX,
    relHalfwidth: IMP34490_M_BAND_REL_HALFWIDTH, // ~0.0109
  },
  imp34454MBand: IMP34454_M_BAND, // [-2.510e-7, -2.316e-7]
  imp34454MNearzero: IMP34454_M_NEARZERO, // -2.3156e-7
  separationAcrossBand: {
    atRMin: IMP34490_SEPARATION_AT_R_MIN,
    atRMax: IMP34490_SEPARATION_AT_R_MAX,
  },
  rawVsCorrectedSystematicPct: IMP34490_RAW_VS_CORRECTED_SYSTEMATIC_PCT, // ~11.3%
  finding: {
    P1_simple_pole_robust:
      'The order-1 classification is a magnitude-INDEPENDENT sign-change criterion; the least-negative ' +
      'band endpoint R = -1.74023e-8 sits ~90 half-widths from R = 0, so R stays strictly negative and ' +
      'eflow_attr > 0 across the whole band -- a +/-1.1% amplitude wobble cannot flip the sign change. ' +
      'Simple-pole classification ROBUST.',
    P2_coefficient_identity_robust:
      'R = E_star/m is an EXACT identity; the bar slides R and the implied m = E_star/R together along ' +
      'it. The band inverts to an implied slope m in [-2.63341e-7, -2.57631e-7] (the imp-34449 quad/cubic ' +
      'slopes), a ~1.1% half-width mirroring the R band. The identity holds at every point. ROBUST.',
    P3_two_readings_robust:
      'The exponent p = -1 is coefficient-independent (amplitude cancels in g_prime/g), so the bar leaves ' +
      'the log-derivative residue +1 unchanged; the coefficient-vs-exponent separation |+1|/|R| stays in ' +
      '[5.62e7, 5.75e7], inside the [1e7,1e9] ~8-orders-and-sign window at both band endpoints. ROBUST.',
    dominance_caveat:
      'The +/-1.1% bar is SUBDOMINANT to the ~11.3% raw-to-curvature-corrected systematic (imp-34310 ' +
      '-1.97909e-8 vs imp-34449 central -1.75589e-8); the implied slope band [-2.63341e-7, -2.57631e-7] ' +
      'sits STEEPER than and does not overlap the imp-34454 three-rung band [-2.510e-7, -2.316e-7], since ' +
      'the curvature-corrected slope under-corrected by the imp-34310 secant. No verdict is sensitive to ' +
      'either, but the honest residue-channel error budget is the ~11% systematic, not the ~1.1% bar.',
  },
  isRigorous: false,
  verdict:
    'PROPAGATION / MEASUREMENT. Carrying the imp-34449 measured residue bar R = -1.756e-8 +/- 0.019e-8 ' +
    '(~+/-1.1% half-width) through the imp-34310 / imp-34398 / imp-34454 consumers leaves ALL THREE ' +
    'verdicts ROBUST: the simple-pole (order-1) classification (magnitude-independent sign change; the ' +
    'band sits ~90 half-widths from R = 0, sign preserved), the R = E_star/m coefficient identity (exact; ' +
    'the bar slides the implied slope m ~1.1% along the identity into [-2.63341e-7, -2.57631e-7]), and ' +
    'the two-readings-of-one-monomial reconciliation (exponent p = -1 coefficient-independent; the ' +
    '~8-orders-and-sign separation |+1|/|R| in [5.62e7, 5.75e7] holds at both endpoints). The bar is ' +
    'SUBDOMINANT to the ~11.3% raw-vs-curvature-corrected systematic and the implied slope band does not ' +
    'overlap the imp-34454 three-rung m-band -- the residue-channel uncertainty is model-choice-dominated, ' +
    'not statistical-bar-dominated. PROPAGATION on the self-contained band, NOT the inherited pipeline; ' +
    'the component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; ' +
    'C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; NO QED; ' +
    'no refereed bound is changed.',
  citation:
    'imp-34449 (measured bar R = -1.756e-8 +/- 0.019e-8); imp-34310 (raw-ratio residue, simple-pole ' +
    'classification, E_star); imp-34398 (R=E_star/m; two-readings-of-one-monomial verdict); imp-34454 ' +
    '(three-rung bridge-slope m-band); imp-34397 (curvature correction); imp-486 (C_mb GUE-conditional); ' +
    'imp-3066 (K_a >= 0).',
};

export const IMP34490_RESIDUE_ERROR_BAR_PROPAGATION_ASSERTIONS = [
  {
    // (P1) the band never reaches R = 0 -> the sign-change simple-pole classification is untouched.
    id: 'imp34490-simple-pole-sign-preserved-across-band',
    description:
      'both band endpoints are strictly negative and the band sits ~90 half-widths from R = 0, so the order-1 sign-change verdict is robust',
    holds: () =>
      IMP34490_SIGN_PRESERVED_ACROSS_BAND === true &&
      IMP34490_HALFWIDTHS_FROM_ZERO > 50 &&
      Math.abs(IMP34490_HALFWIDTHS_FROM_ZERO - 90.24) < 0.5,
  },
  {
    // (P2) the identity R = E_star/m inverts the band to the imp-34449 quad/cubic slopes exactly.
    id: 'imp34490-implied-slope-band-mirrors-r-band',
    description:
      'R = E_star/m inverts the band to an implied slope m in [-2.63341e-7, -2.57631e-7], a ~1.1% half-width mirroring the R band',
    holds: () =>
      IMP34490_M_FROM_R_CENTRAL < 0 &&
      Math.abs(IMP34490_M_FROM_R_MAX - -2.63341e-7) < 1e-11 &&
      Math.abs(IMP34490_M_FROM_R_MIN - -2.57631e-7) < 1e-11 &&
      Math.abs(IMP34490_M_BAND_REL_HALFWIDTH - IMP34449_ERROR_BAR_REL) < 2e-3,
  },
  {
    // (P3) coefficient-vs-exponent separation stays in [1e7,1e9] at both band endpoints.
    id: 'imp34490-two-readings-separation-holds-across-band',
    description:
      'the |+1|/|R| separation stays in [1e7,1e9] (~5.6e7 to ~5.7e7) at both band endpoints, so the coefficient-vs-exponent verdict is robust',
    holds: () =>
      IMP34490_SEPARATION_HOLDS_ACROSS_BAND === true &&
      IMP34490_SEPARATION_AT_R_MIN < IMP34490_SEPARATION_AT_R_MAX,
  },
  {
    // Honest dominance: the ~1.1% bar is subdominant to the ~11% raw-vs-corrected systematic,
    // and the implied slope band does NOT overlap the imp-34454 three-rung band.
    id: 'imp34490-bar-subdominant-to-systematic',
    description:
      'the ~1.1% bar is an order of magnitude below the ~11.3% raw-vs-curvature-corrected systematic, and the implied slope band does not overlap the imp-34454 band',
    holds: () =>
      IMP34490_RAW_VS_CORRECTED_SYSTEMATIC_PCT > 10 &&
      IMP34490_RAW_VS_CORRECTED_SYSTEMATIC_PCT > 5 * (IMP34449_ERROR_BAR_REL * 100) &&
      IMP34490_M_FROM_R_MIN < IMP34454_M_BAND[0], // -2.576e-7 < -2.510e-7 (steeper, no overlap)
  },
  {
    // Honesty gate: propagation/measurement only, isRigorous false, no QED, K_a >= 0 untouched, no refereed bound is changed.
    id: 'imp34490-honesty-gate-no-qed',
    description: 'propagation/measurement only; isRigorous false; NO QED; imp-3066 K_a>=0 untouched; no refereed bound is changed',
    holds: () =>
      IMP34490_RESIDUE_ERROR_BAR_PROPAGATION.isRigorous === false &&
      /NO QED/.test(IMP34490_RESIDUE_ERROR_BAR_PROPAGATION.verdict) &&
      /refereed bound is changed/i.test(IMP34490_RESIDUE_ERROR_BAR_PROPAGATION.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34490_RESIDUE_ERROR_BAR_PROPAGATION.verdict),
  },
];

for (const a of IMP34490_RESIDUE_ERROR_BAR_PROPAGATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34490-residue-error-bar-propagation assertion failed: ${a.id}`);
  }
}
