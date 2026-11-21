/**
 * @module imp-36168-route-derivative-cap-tightness-viz-data
 * @fileoverview imp-36168 -- lightweight viz-data module (baked literals, no heavy
 *   imports, per [[no_heavy_imports_in_pages]]) for the imp-36054 / imp-35988 Route I
 *   vs Route II derivative-error-cap tightness comparison for the I2 sup|H_t prime|
 *   panel cap:
 *
 *   - Route I (separate additive cap C_t prime = E_A prime + E_B prime + E_{C_0}
 *     prime): exact termwise differentiation of the finite main terms, frequency
 *     amplification log N ~ 13.10 at T_PT.
 *   - Route II (Cauchy estimate on the I1 value enclosure): uniform 1/r inflation
 *     over a 2D disk, naive radius r ~ 1/w gives frequency factor w ~ 13.446 at T_PT.
 *
 *   Three structural slack sources ALL favour Route I (same-signed): (1) exact
 *   termwise main-term differentiation vs coarse Cauchy-analytic 1/r; (2) the exact
 *   identity w = log N + (1/2) log 2, so Route II's frequency factor is larger by
 *   half a nat, w/logN ~ 1.0265 (~2.65% at T_PT); (3) Route II folds the uniform 1/r
 *   over the WHOLE sup|H_t| via a 2D disk-sup (>= boundary value), while Route I
 *   applies the large factor only to the small error half.
 *
 *   This module does not import imp-36054 or imp-35988 (no re-deriving the ordering
 *   at page-load time); it only bakes the recorded literals for direct charting.
 *
 *   @see imp-35988-i2-derivative-cap-route-comparison.js (source derivation, three axes, w/logN ratio)
 *   @see imp-36054-honest-status note (Route I tighter on all three axes, recorded verdict)
 *   @see imp-36073-i3-two-route-floor-comparison-viz-data.js (sibling two-route viz-data pattern)
 *   @see imp-35777-i2-logderivative-panel-cap-scope.js (I2 cap L_panel . (B/delta) < pi consumer)
 *
 *   Ticket: imp-36168 (ux, low). Viz-data only, presentation/no-bound-change;
 *   certifies no cap; I2 stays GREENFIELD; imp-35337a OPEN; NO QED.
 *   No refereed bound is changed.
 */

const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const TWO_PI = 2 * Math.PI;

// Winding rate w(T) = (1/2) log(T / 2 pi) (imp-35757 / imp-35777).
const WINDING_RATE = 0.5 * Math.log(T_PT / TWO_PI); // ~13.446 (Route II frequency factor)

// Retained-term count N = floor(sqrt(T / 4 pi)) (imp-35674 Part D).
const N_AT_TPT = Math.floor(Math.sqrt(T_PT / (4 * Math.PI))); // ~488602
const LOG_N_TPT = Math.log(N_AT_TPT); // ~13.10 (Route I frequency factor)

const HALF_LOG2 = 0.5 * Math.LN2; // ~0.34657 -- the EXACT gap w - log N
const FREQ_RATIO = WINDING_RATE / LOG_N_TPT; // w / log N ~ 1.0265
const EXTRA_PANEL_PCT = 100 * (FREQ_RATIO - 1); // ~2.65% more panels for Route II

export const IMP36168_SLACK_AXES = Object.freeze([
  {
    key: 'main-term-sharpness',
    label: 'Main-term differentiation',
    routeI: 'exact termwise (n^{-s} -> (-log n) n^{-s}); the sharpest possible bound',
    routeII: 'coarse Cauchy-analytic 1/r inflation applied uniformly to everything',
    favours: 'I',
  },
  {
    key: 'frequency-constant',
    label: 'Frequency amplification',
    routeI: 'log N ~ 13.10 (tail-weighted amplification, imp-35845)',
    routeII: 'w ~ 13.446 (uniform 1/r at naive radius r ~ 1/w)',
    favours: 'I',
  },
  {
    key: 'uniform-fold-disk-sup',
    label: 'Uniform-fold + disk-sup',
    routeI: 'large factor applied only to the small error half; main term stays exact',
    routeII: '1/r folds the WHOLE sup|H_t| over a 2D disk-sup (>= 1D boundary value)',
    favours: 'I',
  },
]);

export const IMP36168_FREQUENCY_GAP = Object.freeze({
  routeI_logN: +LOG_N_TPT.toFixed(9),
  routeII_w: +WINDING_RATE.toFixed(9),
  exactGap_halfLog2: +HALF_LOG2.toFixed(9), // w - log N = (1/2) log 2, EXACT identity
  freqRatio_wOverLogN: +FREQ_RATIO.toFixed(9), // ~1.0265
  extraPanelPct: +EXTRA_PANEL_PCT.toFixed(6), // ~2.65%
});

export const IMP36168_ROUTE_TIGHTNESS_VIZ_DATA = {
  ticket: 'imp-36168',
  sourceTickets: ['imp-36054', 'imp-35988'],
  slackAxes: IMP36168_SLACK_AXES,
  frequencyGap: IMP36168_FREQUENCY_GAP,
  note:
    'Route I (separate additive derivative-error cap) is structurally TIGHTER than Route II ' +
    '(Cauchy estimate) on all three same-signed slack axes, with the exact identity ' +
    'w = log N + (1/2) log 2 giving w/logN ~ 1.0265 (~2.65% frequency-factor gap at T_PT ' +
    '~ 3e12, N ~ 4.886e5). Route II costs only a MARGINAL few-percent more panels, not an ' +
    'order of magnitude.',
  honest:
    'VIZ-DATA ONLY -- baked literals reproducing the imp-35988/imp-36054 tightness ordering ' +
    'exactly; adds no new derivation and changes no bound. Certifies no cap; instantiates no ' +
    'enclosure; I2 remains GREENFIELD downstream of W1; imp-35337a OPEN; NO QED. ' +
    'No refereed bound is changed.',
};

export const IMP36168_VIZ_ASSERTIONS = [
  {
    id: 'imp36168-three-slack-axes',
    description: 'exactly 3 slack axes, all favouring Route I',
    holds: () =>
      IMP36168_SLACK_AXES.length === 3 && IMP36168_SLACK_AXES.every((a) => a.favours === 'I'),
  },
  {
    id: 'imp36168-frequency-factors-match-source',
    description: 'Route I freq = log N ~ 13.10, Route II freq = w ~ 13.446, matching imp-35988',
    holds: () =>
      Math.abs(IMP36168_FREQUENCY_GAP.routeI_logN - LOG_N_TPT) < 1e-9 &&
      Math.abs(IMP36168_FREQUENCY_GAP.routeII_w - WINDING_RATE) < 1e-9 &&
      IMP36168_FREQUENCY_GAP.routeI_logN < IMP36168_FREQUENCY_GAP.routeII_w,
  },
  {
    id: 'imp36168-exact-gap-is-half-log2',
    description: 'w - log N = (1/2) log 2 EXACTLY (structural identity, not a fit)',
    holds: () =>
      Math.abs(
        IMP36168_FREQUENCY_GAP.routeII_w -
          IMP36168_FREQUENCY_GAP.routeI_logN -
          IMP36168_FREQUENCY_GAP.exactGap_halfLog2
      ) < 1e-5 && Math.abs(IMP36168_FREQUENCY_GAP.exactGap_halfLog2 - 0.5 * Math.LN2) < 1e-9,
  },
  {
    id: 'imp36168-freq-ratio-in-expected-band',
    description: 'w/logN ratio ~1.0265, extra panel pct in (2,3)%',
    holds: () =>
      IMP36168_FREQUENCY_GAP.freqRatio_wOverLogN > 1.02 &&
      IMP36168_FREQUENCY_GAP.freqRatio_wOverLogN < 1.03 &&
      IMP36168_FREQUENCY_GAP.extraPanelPct > 2 &&
      IMP36168_FREQUENCY_GAP.extraPanelPct < 3 &&
      Math.abs(
        IMP36168_FREQUENCY_GAP.extraPanelPct -
          100 * (IMP36168_FREQUENCY_GAP.freqRatio_wOverLogN - 1)
      ) < 1e-6,
  },
  {
    id: 'imp36168-honesty-gate-no-qed',
    description: 'honest status references viz-data-only, greenfield, imp-35337a OPEN, NO QED, no refereed bound is changed',
    holds: () =>
      /VIZ-DATA ONLY/.test(IMP36168_ROUTE_TIGHTNESS_VIZ_DATA.honest) &&
      /GREENFIELD/.test(IMP36168_ROUTE_TIGHTNESS_VIZ_DATA.honest) &&
      /imp-35337a OPEN/.test(IMP36168_ROUTE_TIGHTNESS_VIZ_DATA.honest) &&
      /NO QED/.test(IMP36168_ROUTE_TIGHTNESS_VIZ_DATA.honest) &&
      /refereed bound is changed/i.test(IMP36168_ROUTE_TIGHTNESS_VIZ_DATA.honest),
  },
];

for (const a of IMP36168_VIZ_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36168-route-derivative-cap-tightness-viz-data assertion failed: ${a.id}`);
  }
}
