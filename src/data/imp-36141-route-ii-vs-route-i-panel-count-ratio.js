/**
 * @module imp-36141-route-ii-vs-route-i-panel-count-ratio
 * @fileoverview imp-36141 -- MEASUREMENT-ONLY tabulation converting the imp-36054 qualitative
 *   "few percent marginal" panel-count verdict into an explicit number, for the two admissible
 *   derivative-error-cap routes imp-35832 named for the imp-35777 I2 panel cap
 *   L_panel . (B/delta) < pi, B = sup|H_t prime|.
 *
 *   The I2 cap fixes the maximum panel WIDTH at L_panel = pi . delta / B, so with delta shared
 *   between the two routes the panel width is inversely proportional to the derivative cap B, and
 *   the panel COUNT over a fixed abscissa interval is directly proportional to B. Hence:
 *
 *       panel-count ratio   n_II / n_I     = B_II / B_I
 *       panel-width ratio   L_II / L_I      = B_I / B_II   (reciprocal)
 *
 *   imp-35988 pinned the FREQUENCY-FACTOR component of B_II / B_I to the exact value w / log N via
 *   the identity log N = w - (1/2) log 2, giving w / log N ~ 1.0265 at T_PT (N ~ 4.886e5). Because
 *   the frequency factor is one of three SAME-SIGNED axes on which Route I beats Route II
 *   (imp-36054), w / log N is an exact LOWER BOUND on the true panel-count ratio: the main-term and
 *   disk-sup axes only push it higher, all still within "a few percent". This module tabulates the
 *   frequency-floor panel-count ratio (~1.0265, +2.65% panels) and its reciprocal panel-width ratio
 *   (~0.9742, -2.58% width), turning the imp-36054 word "marginal" into a figure.
 *
 *   Ticket: imp-36141 (numerical, medium). Measurement only; certifies no cap; changes no bound;
 *   C_mb GUE-conditional (imp-486) untouched; no refereed bound is changed; NO QED.
 *
 *   @see imp-35988-i2-derivative-cap-route-comparison.js (source of the frequency-floor numbers)
 *   @see imp-36054-route-i-tighter-than-route-ii-honest-status.js (the qualitative verdict quantified here)
 *   @see imp-35777-i2-logderivative-panel-cap-scope (I2 cap L_panel . (B/delta) < pi; B = sup|H_t prime|)
 *   @see imp-35845-d2-differentiated-truncation-cap-amplification (route I sharp constant A_amp = log N)
 */

import { IMP35988_I2_DERIVATIVE_CAP_ROUTE_COMPARISON } from './imp-35988-i2-derivative-cap-route-comparison.js';

const SRC = IMP35988_I2_DERIVATIVE_CAP_ROUTE_COMPARISON;
const F = SRC.frequencyFloor;

// panel COUNT scales with B (shared delta); the frequency-floor B-ratio is the exact lower bound.
const PANEL_COUNT_RATIO_FLOOR = F.bRatioFreqFloor; // n_II / n_I >= w / log N ~ 1.0265
const PANEL_WIDTH_RATIO_CEIL = 1 / F.bRatioFreqFloor; // L_II / L_I <= log N / w ~ 0.9742
const EXTRA_PANEL_PCT = F.extraPanelPct; // ~ +2.65% panels for Route II (floor)
const PANEL_WIDTH_SHRINK_PCT = 100 * (1 - PANEL_WIDTH_RATIO_CEIL); // ~ -2.58% width for Route II

export const IMP36141_ROUTE_II_VS_ROUTE_I_PANEL_COUNT_RATIO = Object.freeze({
  id: 'imp-36141',
  proofSection: 'S-frontier',
  title:
    'Tabulated panel-count ratio L_panel(Route II)/L_panel(Route I) for the imp-35777 I2 ' +
    'sup|H_t prime| cap: the imp-36054 "few percent marginal" verdict pinned to the exact ' +
    'frequency-floor value w/log N ~ 1.0265 (+2.65% panels for the looser Route II)',
  sourceModule: 'imp-35988-i2-derivative-cap-route-comparison.js',

  // The tabulation the ticket asks for: qualitative "a few percent" -> explicit ratios.
  panelRatios: Object.freeze({
    routeI_freqFactor_logN: F.routeI_logN, // log N ~ 13.10
    routeII_freqFactor_w: F.routeII_w, // w ~ 13.446
    exactGap_halfLog2: F.exactGap_halfLog2, // w - log N = (1/2) log 2 EXACTLY
    panelCountRatioFloor: PANEL_COUNT_RATIO_FLOOR, // n_II/n_I >= w/log N ~ 1.0265
    panelWidthRatioCeil: PANEL_WIDTH_RATIO_CEIL, // L_II/L_I <= log N/w ~ 0.9742
    extraPanelPct: EXTRA_PANEL_PCT, // ~ +2.65%
    panelWidthShrinkPct: PANEL_WIDTH_SHRINK_PCT, // ~ -2.58%
  }),

  interpretation:
    'The imp-35777 I2 cap L_panel . (B/delta) < pi fixes the maximum admissible panel WIDTH at ' +
    'L_panel = pi . delta / B, so with delta shared by both routes the panel width is inversely ' +
    'proportional to the derivative cap B, and the panel COUNT over a fixed abscissa interval is ' +
    'directly proportional to B. The panel-count ratio n_II/n_I therefore equals the B-cap ratio ' +
    'B_II/B_I, and the panel-width ratio L_II/L_I is its reciprocal. imp-35988 pins the ' +
    'frequency-factor component of B_II/B_I to the EXACT value w/log N via log N = w - (1/2) log 2, ' +
    'so the panel-count ratio has an exact lower bound of w/log N ~ 1.0265: Route II costs +2.65% ' +
    'more panels (equivalently ~2.58% narrower panels) from the frequency factor ALONE. Because the ' +
    'main-term-sharpness and uniform-fold+disk-sup axes are same-signed (imp-36054), the true ratio ' +
    'is strictly larger than 1.0265 but stays within a few percent -- confirming the imp-36054 ' +
    '"MARGINAL, not an order of magnitude" verdict as a tabulated number, not a word.',

  isFloorNotExact: true, // 1.0265 is the exact frequency-floor LOWER bound on the full ratio
  isRigorous: false,

  honestCaveat: Object.freeze({
    isProof: false,
    isRigorous: false,
    isUnconditional: false,
    certifiesDerivativeBoundB: false,
    certifiesI2Cap: false,
    changesAnyBound: false,
    ratioIsFrequencyFloorLowerBound: true,
    sota: 'No refereed bound is changed',
  }),

  verdict:
    'The imp-36054 qualitative panel-count verdict ("only a few percent, not an order of magnitude") ' +
    'is now a tabulated number: the frequency-floor panel-count ratio n_II/n_I = w/log N ~ 1.0265 ' +
    '(+2.65% panels), equivalently a panel-width ratio L_II/L_I ~ 0.9742 (~2.58% narrower panels), ' +
    'is an EXACT lower bound on the full ratio (the two remaining same-signed axes push it higher but ' +
    'keep it within a few percent). Measurement only; certifies no cap; changes no bound; C_mb ' +
    'GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.',
});

export const IMP36141_ROUTE_II_VS_ROUTE_I_PANEL_COUNT_RATIO_ASSERTIONS = [
  {
    id: 'imp36141-count-ratio-equals-source-b-ratio',
    why: 'The panel-count ratio floor must equal the imp-35988 frequency-floor B-ratio w/log N verbatim -- panel count scales linearly with B.',
    holds: () =>
      IMP36141_ROUTE_II_VS_ROUTE_I_PANEL_COUNT_RATIO.panelRatios.panelCountRatioFloor === F.bRatioFreqFloor &&
      F.bRatioFreqFloor > 1.02 && F.bRatioFreqFloor < 1.03,
  },
  {
    id: 'imp36141-width-ratio-is-reciprocal',
    why: 'The panel-width ratio must be the exact reciprocal of the panel-count ratio (L_panel = pi.delta/B, delta shared).',
    holds: () => {
      const r = IMP36141_ROUTE_II_VS_ROUTE_I_PANEL_COUNT_RATIO.panelRatios;
      return Math.abs(r.panelWidthRatioCeil - 1 / r.panelCountRatioFloor) < 1e-15 &&
        r.panelWidthRatioCeil > 0.97 && r.panelWidthRatioCeil < 0.98;
    },
  },
  {
    id: 'imp36141-exact-gap-is-half-log2',
    why: 'The frequency-factor gap w - log N must be exactly (1/2) log 2, the identity driving the whole ratio.',
    holds: () => {
      const r = IMP36141_ROUTE_II_VS_ROUTE_I_PANEL_COUNT_RATIO.panelRatios;
      return Math.abs((r.routeII_freqFactor_w - r.routeI_freqFactor_logN) - r.exactGap_halfLog2) < 1e-5 &&
        Math.abs(r.exactGap_halfLog2 - 0.5 * Math.LN2) < 1e-12;
    },
  },
  {
    id: 'imp36141-extra-panel-pct-is-a-few-percent',
    why: 'The tabulated extra-panel percentage must confirm the "few percent, not order of magnitude" verdict (strictly between 2% and 3%).',
    holds: () => {
      const r = IMP36141_ROUTE_II_VS_ROUTE_I_PANEL_COUNT_RATIO.panelRatios;
      return r.extraPanelPct > 2 && r.extraPanelPct < 3 &&
        Math.abs(r.extraPanelPct - 100 * (r.panelCountRatioFloor - 1)) < 1e-9;
    },
  },
  {
    id: 'imp36141-ratio-is-floor-not-exact',
    why: 'The module must record that 1.0265 is the frequency-floor LOWER bound on the full ratio, not the exact full B-ratio.',
    holds: () =>
      IMP36141_ROUTE_II_VS_ROUTE_I_PANEL_COUNT_RATIO.isFloorNotExact === true &&
      IMP36141_ROUTE_II_VS_ROUTE_I_PANEL_COUNT_RATIO.honestCaveat.ratioIsFrequencyFloorLowerBound === true,
  },
  {
    id: 'imp36141-honesty-gate',
    why: 'This is a measurement-only tabulation: it must not claim it certifies B or the I2 cap, nor claim a bound change.',
    holds: () =>
      IMP36141_ROUTE_II_VS_ROUTE_I_PANEL_COUNT_RATIO.honestCaveat.certifiesDerivativeBoundB === false &&
      IMP36141_ROUTE_II_VS_ROUTE_I_PANEL_COUNT_RATIO.honestCaveat.certifiesI2Cap === false &&
      IMP36141_ROUTE_II_VS_ROUTE_I_PANEL_COUNT_RATIO.honestCaveat.changesAnyBound === false &&
      /Platt-Trudgian|refereed bound is changed/.test(IMP36141_ROUTE_II_VS_ROUTE_I_PANEL_COUNT_RATIO.honestCaveat.sota),
  },
  {
    id: 'imp36141-verdict-no-qed',
    why: 'The verdict must record NO QED, matching the standing no-refereed-bound-change caveat.',
    holds: () => /NO QED/.test(IMP36141_ROUTE_II_VS_ROUTE_I_PANEL_COUNT_RATIO.verdict),
  },
];

for (const assertion of IMP36141_ROUTE_II_VS_ROUTE_I_PANEL_COUNT_RATIO_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-36141-route-ii-vs-route-i-panel-count-ratio assertion failed: ${assertion.id}`);
  }
}

export default IMP36141_ROUTE_II_VS_ROUTE_I_PANEL_COUNT_RATIO;
