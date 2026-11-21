/**
 * @module imp-36274-panel-count-ratio-envelope
 * @fileoverview imp-36274 -- MEASUREMENT / DERIVATION ONLY. Upgrade the imp-36141 frequency-FLOOR
 *   panel-count ratio for the imp-35777 I2 sup|H_t prime| cap into an explicit ENVELOPE with a
 *   numeric upper witness, by combining the two same-signed axes imp-36141 left qualitative
 *   ("main-term sharpness" and "uniform-fold + disk-sup") with the numbers already on the record.
 *
 *   BACKGROUND. The imp-35777 I2 cap L_panel . (B/delta) < pi makes the panel count scale linearly
 *   with the derivative cap B = sup|H_t prime|, so the Route-II-vs-Route-I panel-count ratio is
 *   n_II/n_I = B_II/B_I. imp-36254 reduced this ratio algebraically to FLOOR . E with
 *
 *       FLOOR = w/logN ~ 1.0265   (the exactly-pinned frequency axis, imp-35988/imp-36141),
 *       E     = delta_disk . (1 + rho) / ((mu/logN) + rho)  >= 1,
 *
 *   and reported the full ratio as NOT-A-NUMBER because the three inputs (mu/logN, rho, delta_disk)
 *   are un-pinned by the recorded route-comparison modules (sub-gap imp-36254a). That honest partial
 *   left ONE of the three inputs -- delta_disk, the 2D-disk-sup inflation of the Cauchy route (axis
 *   3) -- treated as fully open, even though a numeric worst-case witness for it ALREADY EXISTS on
 *   the record and was not incorporated: imp-36040.
 *
 *   THE INCREMENT. imp-36040 minimised the Route-II Cauchy cap B_II(r) = M(r)/r under the Gronwall
 *   disk-sup growth model M(r) <= M(0) e^{g r} (g = disk log-derivative rate <= w). At the optimal
 *   radius r* = 1/g the dropped disk-sup growth factor is EXACTLY M(r*)/M(0) = e ~ 2.718, i.e. in
 *   this model the disk-sup inflation delta_disk = sup_disk|H_t|/sup_segment|H_t| is bracketed
 *
 *       delta_disk in [1, e],   1 = flat/naive disk,   e = worst-case (g = w) growth at r*.
 *
 *   In the error-DOMINATED regime rho -> infinity the main-term axis drops out of E (E -> delta_disk;
 *   this is the regime where the amplified error half sets B, exactly where the route gap bites), so
 *   the full ratio there is n_II/n_I = FLOOR . delta_disk and the imp-36040 bracket gives an EXPLICIT
 *   model-conditional ENVELOPE:
 *
 *       n_II/n_I  in  [ w/logN ,  (e . w)/logN ]  =  [ 1.0265 ,  2.79 ]  (T_PT, N ~ 4.886e5),
 *       extra panels  in  [ +2.65% ,  +179% ].
 *
 *   The lower end is the imp-36141 frequency floor (delta_disk = 1); the upper end is the imp-36040
 *   growth-aware optimal ratio (e . w)/logN (delta_disk = e). This CONVERTS imp-36254a's fully-open
 *   delta_disk into a numeric [1, e] bracket and turns the imp-36141 floor into a two-sided envelope.
 *
 *   HONEST STATUS. (i) The upper witness e is MODEL-CONDITIONAL: it is the Gronwall worst-case
 *   (g = w) growth factor, an upper model NOT a measurement of the actual disk-sup growth rate g
 *   (imp-36040 measures no g). (ii) The envelope is the error-dominated (rho -> infinity) slice; the
 *   remaining main-term axis mu/logN in (0,1] can push the ratio ABOVE 2.79 in main-dominated
 *   regimes and stays un-pinned (imp-36254a). (iii) The imp-36054 "within a few percent" verdict is
 *   therefore REGIME-CONDITIONAL: it holds only when the disk-sup grows slowly, g < w/e ~ 0.368 w;
 *   at the worst-case growth the honest ratio is ~2.79 (+179%), not a few percent. Nothing here
 *   certifies B or the I2 cap or changes any bound.
 *
 *   Ticket: imp-36274 (numerical, medium). Measurement/derivation only; certifies no cap; instantiates
 *   no enclosure; changes no bound; C_mb GUE-conditional (imp-486) untouched; imp-35337a OPEN;
 *   imp-36254a (pin mu/logN, rho, delta_disk exactly) OPEN; no RH verdict, NO QED. No refereed bound is changed.
 *
 *   @see imp-36141-route-ii-vs-route-i-panel-count-ratio.js (the frequency FLOOR this envelopes -- lower end)
 *   @see imp-36040-route-ii-optimal-cauchy-radius.js (the Gronwall e-factor disk-sup witness -- upper end)
 *   @see imp-36254-full-panel-count-ratio-decomposition.js (FLOOR . E decomposition; sub-gap imp-36254a)
 *   @see imp-35988-i2-derivative-cap-route-comparison.js (the three same-signed slack axes)
 *   @see imp-35777-i2-logderivative-panel-cap-scope (I2 cap L_panel . (B/delta) < pi; B = sup|H_t prime|)
 */

import { IMP36141_ROUTE_II_VS_ROUTE_I_PANEL_COUNT_RATIO } from './imp-36141-route-ii-vs-route-i-panel-count-ratio.js';
import { IMP36040_ROUTE_II_OPTIMAL_CAUCHY_RADIUS } from './imp-36040-route-ii-optimal-cauchy-radius.js';

// Lower end: the exactly-pinned frequency floor w/logN ~ 1.0265 (delta_disk = 1, axis-3 inactive).
const ENVELOPE_LO = IMP36141_ROUTE_II_VS_ROUTE_I_PANEL_COUNT_RATIO.panelRatios.panelCountRatioFloor;

// The Gronwall worst-case disk-sup inflation delta_disk = M(r*)/M(0) = e ~ 2.718 (imp-36040).
const DELTA_DISK_MAX = IMP36040_ROUTE_II_OPTIMAL_CAUCHY_RADIUS.optimum.mGrowthFactorAtOpt; // = e

// Upper end (error-dominated regime, rho -> infinity): FLOOR . delta_disk = (e . w)/logN ~ 2.79.
const ENVELOPE_HI = ENVELOPE_LO * DELTA_DISK_MAX;

// Cross-check: this must equal the imp-36040 growth-aware optimal ratio (e . w)/logN verbatim.
const IMP36040_OPT_RATIO = IMP36040_ROUTE_II_OPTIMAL_CAUCHY_RADIUS.assessment.optFreqRatio;

const EXTRA_PCT_LO = 100 * (ENVELOPE_LO - 1); // ~ +2.65%
const EXTRA_PCT_HI = 100 * (ENVELOPE_HI - 1); // ~ +179%

// Below this disk-sup growth rate the "few percent" verdict holds (imp-36040 break-even g < w/e).
const BREAKEVEN_GROWTH_RATE = IMP36040_ROUTE_II_OPTIMAL_CAUCHY_RADIUS.assessment.breakevenGrowthRate;

export const IMP36274_PANEL_COUNT_RATIO_ENVELOPE = Object.freeze({
  id: 'imp-36274',
  proofSection: 'S-frontier',
  title:
    'Explicit ENVELOPE for the imp-36141 I2 Route-II/Route-I panel-count ratio n_II/n_I: the ' +
    'frequency floor w/logN ~ 1.0265 (lower) combined with the recorded imp-36040 Gronwall ' +
    'worst-case disk-sup inflation delta_disk = e (upper) gives [1.0265, 2.79] in the ' +
    'error-dominated regime -- turning the imp-36054 "few percent" verdict regime-conditional',
  sourceModules: Object.freeze([
    'imp-36141-route-ii-vs-route-i-panel-count-ratio.js',
    'imp-36040-route-ii-optimal-cauchy-radius.js',
  ]),

  // The two same-signed axes above the frequency floor, now with the disk axis numerically witnessed.
  axesAboveFloor: Object.freeze({
    diskSupAxis: Object.freeze({
      key: 'delta-disk (axis 3)',
      meaning: 'delta_disk = sup_disk|H_t| / sup_segment|H_t| -- the 2D-disk-sup over 1D-segment inflation of the Cauchy route',
      bracket: Object.freeze({ lo: 1, hi: DELTA_DISK_MAX }), // [1, e]: naive/flat disk .. Gronwall worst-case
      witnessSource: 'imp-36040 (M(r*)/M(0) = e at the optimal Cauchy radius r* = 1/g, worst case g = w)',
      isModelConditional: true, // Gronwall worst-case upper model, NOT a measured growth rate
    }),
    mainTermAxis: Object.freeze({
      key: 'mu/logN (axis 1)',
      meaning: 'Exact-termwise effective log-frequency mu <= logN of A_t + B_t; drops out of E as rho -> infinity',
      status: 'un-pinned (imp-36254a); can push the ratio ABOVE the envelope upper end in main-dominated regimes',
    }),
  }),

  // The explicit envelope the ticket asks for (error-dominated rho -> infinity slice).
  envelope: Object.freeze({
    regime: 'error-dominated (rho -> infinity): E -> delta_disk, main-term axis mu/logN drops out',
    lo: ENVELOPE_LO, // w/logN ~ 1.0265  (delta_disk = 1)
    hi: ENVELOPE_HI, // (e . w)/logN ~ 2.79 (delta_disk = e, Gronwall worst case)
    extraPanelPctLo: EXTRA_PCT_LO, // ~ +2.65%
    extraPanelPctHi: EXTRA_PCT_HI, // ~ +179%
    hiEqualsImp36040OptRatio: IMP36040_OPT_RATIO, // (e . w)/logN, cross-check target
    loIsFrequencyFloor: true,
    hiIsGronwallWorstCase: true,
  }),

  interpretation:
    'imp-36254 reduced the panel-count ratio to n_II/n_I = FLOOR . E, FLOOR = w/logN ~ 1.0265, ' +
    'E = delta_disk . (1+rho)/((mu/logN)+rho) >= 1, and reported the full ratio as NOT-a-number ' +
    'because the three inputs are un-pinned. This module supplies a numeric bracket for ONE of them ' +
    'that was already on the record: imp-36040 pins the Gronwall worst-case disk-sup growth factor ' +
    'M(r*)/M(0) = e at the optimal Cauchy radius, i.e. delta_disk in [1, e]. In the error-dominated ' +
    'regime rho -> infinity the main-term axis mu/logN drops out (E -> delta_disk), so the full ratio ' +
    'is FLOOR . delta_disk and the [1, e] bracket gives the explicit envelope n_II/n_I in ' +
    '[w/logN, (e . w)/logN] = [1.0265, 2.79] (+2.65% .. +179% panels). The lower end is the ' +
    'imp-36141 frequency floor; the upper end is the imp-36040 growth-aware optimal ratio verbatim.',

  // The reconciliation this makes explicit.
  regimeConditionalVerdict:
    'The imp-36054 "within a few percent" panel-count verdict is REGIME-CONDITIONAL, not universal: ' +
    'it holds only when the disk-sup grows slowly (g < w/e ~ 0.368 w, the imp-36040 break-even), ' +
    'where delta_disk stays near 1 and the ratio near the floor 1.0265. At the worst-case growth ' +
    'g = w the honest ratio is ~2.79 (+179% panels), an order-of-a-factor-3 penalty, not a few ' +
    'percent. The envelope thus reconciles imp-36054 (few percent) with imp-36040 (Route II ~179% ' +
    'looser): both are endpoints of the same [1.0265, 2.79] bracket.',

  breakevenGrowthRate: BREAKEVEN_GROWTH_RATE, // g < w/e ~ 0.368 w: below this, "few percent" holds

  isRigorous: false,
  honestCaveat: Object.freeze({
    isProof: false,
    isRigorous: false,
    isUnconditional: false,
    upperEndIsModelConditional: true, // Gronwall worst-case, not a measured disk-sup growth rate
    envelopeIsErrorDominatedSlice: true, // main-term axis mu/logN un-pinned (imp-36254a), can exceed hi
    diskAxisNowBracketed: true, // delta_disk in [1, e] from imp-36040 (was fully open in imp-36254)
    fullRatioReducedToSingleNumber: false, // still an envelope, not a point value
    certifiesDerivativeBoundB: false,
    certifiesI2Cap: false,
    changesAnyBound: false,
    openSubGaps: Object.freeze(['imp-36254a', 'imp-35337a']),
    sota: 'No refereed bound is changed',
  }),

  verdict:
    'The imp-36141 frequency floor is upgraded from a one-sided lower bound to a two-sided ENVELOPE ' +
    'n_II/n_I in [w/logN, (e . w)/logN] = [1.0265, 2.79] (+2.65% .. +179% panels) by combining it ' +
    'with the recorded imp-36040 Gronwall worst-case disk-sup inflation delta_disk in [1, e] -- the ' +
    'axis imp-36254 left fully open now carries a numeric [1, e] bracket. Valid in the ' +
    'error-dominated regime rho -> infinity (main-term axis mu/logN drops out); the un-pinned ' +
    'mu/logN can push above 2.79 in main-dominated regimes (imp-36254a still OPEN). The upper end is ' +
    'MODEL-CONDITIONAL (Gronwall worst-case g = w, not a measured growth rate). Net: the imp-36054 ' +
    '"few percent" verdict is regime-conditional, holding only for slow disk growth g < w/e ~ ' +
    '0.368 w. Measurement/derivation only; certifies no cap; instantiates no enclosure; changes no ' +
    'bound; C_mb GUE-conditional (imp-486) untouched; imp-35337a OPEN; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
});

export const IMP36274_PANEL_COUNT_RATIO_ENVELOPE_ASSERTIONS = [
  {
    id: 'imp36274-lo-is-imp36141-frequency-floor',
    why: 'The envelope lower end must equal the imp-36141 frequency-floor panel-count ratio w/logN ~ 1.0265 verbatim.',
    holds: () =>
      IMP36274_PANEL_COUNT_RATIO_ENVELOPE.envelope.lo ===
        IMP36141_ROUTE_II_VS_ROUTE_I_PANEL_COUNT_RATIO.panelRatios.panelCountRatioFloor &&
      IMP36274_PANEL_COUNT_RATIO_ENVELOPE.envelope.lo > 1.02 &&
      IMP36274_PANEL_COUNT_RATIO_ENVELOPE.envelope.lo < 1.03,
  },
  {
    id: 'imp36274-disk-bracket-upper-is-e',
    why: 'The disk-sup inflation upper bracket delta_disk = e must equal the imp-36040 optimal-radius growth factor M(r*)/M(0) = e ~ 2.718.',
    holds: () =>
      Math.abs(DELTA_DISK_MAX - Math.E) < 1e-12 &&
      IMP36274_PANEL_COUNT_RATIO_ENVELOPE.axesAboveFloor.diskSupAxis.bracket.lo === 1 &&
      Math.abs(IMP36274_PANEL_COUNT_RATIO_ENVELOPE.axesAboveFloor.diskSupAxis.bracket.hi - Math.E) < 1e-12,
  },
  {
    id: 'imp36274-hi-equals-imp36040-optimal-ratio',
    why: 'The envelope upper end FLOOR . e must equal the imp-36040 growth-aware optimal ratio (e . w)/logN ~ 2.79 verbatim (cross-module consistency).',
    holds: () =>
      Math.abs(IMP36274_PANEL_COUNT_RATIO_ENVELOPE.envelope.hi - IMP36040_OPT_RATIO) < 1e-9 &&
      IMP36274_PANEL_COUNT_RATIO_ENVELOPE.envelope.hi > 2.7 &&
      IMP36274_PANEL_COUNT_RATIO_ENVELOPE.envelope.hi < 2.9,
  },
  {
    id: 'imp36274-envelope-is-floor-times-disk-bracket',
    why: 'The envelope must be exactly FLOOR . [1, e]: lo = FLOOR . 1 and hi = FLOOR . e.',
    holds: () => {
      const e = IMP36274_PANEL_COUNT_RATIO_ENVELOPE.envelope;
      return Math.abs(e.lo - ENVELOPE_LO * 1) < 1e-15 &&
        Math.abs(e.hi - ENVELOPE_LO * DELTA_DISK_MAX) < 1e-15 &&
        e.hi > e.lo;
    },
  },
  {
    id: 'imp36274-extra-panel-pcts-span-few-percent-to-179',
    why: 'The extra-panel percentages must span the reconciliation: ~+2.65% (floor) to ~+179% (Gronwall worst case).',
    holds: () => {
      const e = IMP36274_PANEL_COUNT_RATIO_ENVELOPE.envelope;
      return e.extraPanelPctLo > 2 && e.extraPanelPctLo < 3 &&
        e.extraPanelPctHi > 170 && e.extraPanelPctHi < 185 &&
        Math.abs(e.extraPanelPctLo - 100 * (e.lo - 1)) < 1e-9 &&
        Math.abs(e.extraPanelPctHi - 100 * (e.hi - 1)) < 1e-9;
    },
  },
  {
    id: 'imp36274-upper-end-model-conditional-and-slice',
    why: 'Honest partial: the upper end is Gronwall-model-conditional and the envelope is the error-dominated slice; the main-term axis stays un-pinned (imp-36254a) and can exceed hi.',
    holds: () =>
      IMP36274_PANEL_COUNT_RATIO_ENVELOPE.honestCaveat.upperEndIsModelConditional === true &&
      IMP36274_PANEL_COUNT_RATIO_ENVELOPE.honestCaveat.envelopeIsErrorDominatedSlice === true &&
      IMP36274_PANEL_COUNT_RATIO_ENVELOPE.honestCaveat.fullRatioReducedToSingleNumber === false &&
      IMP36274_PANEL_COUNT_RATIO_ENVELOPE.honestCaveat.openSubGaps.includes('imp-36254a'),
  },
  {
    id: 'imp36274-breakeven-matches-imp36040',
    why: 'The "few percent" regime boundary must be the imp-36040 break-even growth rate g < w/e ~ 0.368 w.',
    holds: () =>
      IMP36274_PANEL_COUNT_RATIO_ENVELOPE.breakevenGrowthRate ===
        IMP36040_ROUTE_II_OPTIMAL_CAUCHY_RADIUS.assessment.breakevenGrowthRate &&
      IMP36274_PANEL_COUNT_RATIO_ENVELOPE.breakevenGrowthRate > 0,
  },
  {
    id: 'imp36274-honesty-gate',
    why: 'Measurement/derivation only: it must not claim it certifies B or the I2 cap, nor a bound change, and must keep the no-refereed-bound-change caveat.',
    holds: () =>
      IMP36274_PANEL_COUNT_RATIO_ENVELOPE.honestCaveat.certifiesDerivativeBoundB === false &&
      IMP36274_PANEL_COUNT_RATIO_ENVELOPE.honestCaveat.certifiesI2Cap === false &&
      IMP36274_PANEL_COUNT_RATIO_ENVELOPE.honestCaveat.changesAnyBound === false &&
      /Platt-Trudgian|refereed bound is changed/.test(IMP36274_PANEL_COUNT_RATIO_ENVELOPE.honestCaveat.sota),
  },
  {
    id: 'imp36274-verdict-no-qed',
    why: 'The verdict must record NO QED, matching the standing no-refereed-bound-change caveat.',
    holds: () => /NO QED/.test(IMP36274_PANEL_COUNT_RATIO_ENVELOPE.verdict),
  },
];

for (const assertion of IMP36274_PANEL_COUNT_RATIO_ENVELOPE_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-36274-panel-count-ratio-envelope assertion failed: ${assertion.id}`);
  }
}

export default IMP36274_PANEL_COUNT_RATIO_ENVELOPE;
