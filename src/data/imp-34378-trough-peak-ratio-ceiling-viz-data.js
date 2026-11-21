/**
 * @module imp-34378-trough-peak-ratio-ceiling-viz-data
 * @fileoverview imp-34378 -- lightweight viz-data module (baked literals, no heavy
 *   imports, per [[no_heavy_imports_in_pages]]) for the imp-34288 |trough|/|peak|
 *   amplitude-ratio ceiling extension.
 *
 *   imp-34288 extended the imp-34214/imp-34085 window-width grid past w=7 (kEnd=13.0
 *   to 20.0, quarter-decade steps) and found the ratio keeps climbing to a maximum
 *   ~0.9072 at w=9.25 (kEnd=15.25), SATURATES BELOW the amplitude ceiling of 1 (no
 *   overshoot), then recedes to ~0.6184 by kEnd=20 (w=14). The turnaround is a REGIME
 *   CHANGE: the argmax peak stays locked to the receding right endpoint through
 *   kEnd=15.25, then at kEnd=15.5 (w=9.5) jumps to the near-left rung k=6.5 and stays
 *   there, after which the left-endpoint peak grows quickly while the trough saturates,
 *   pulling the ratio back down.
 *
 *   All numbers are baked reference literals copied from the imp-34288 module's
 *   extendedGrid export -- this module does not import imp-34288 (or its
 *   lambda-rh-height-mapping / polymath15-constant-C-C dependency chain) so pages
 *   consuming it stay import-light.
 *
 *   @see imp-34288-trough-peak-ratio-ceiling-extension.js (source measurement)
 *   @see imp-34214-trough-peak-ratio-limit-fit.js (the convergence refuted at w=7, extended here)
 *   @see imp-34085-trough-peak-ratio-convergence.js (the |trough|/|peak| ratio sequence reused)
 *   @see imp-34268-fixed-band-peak-reaccel-convexity-stitch-viz-data.js (same viz-data pattern)
 *
 *   Ticket: imp-34378 (ux, low). Viz-data only, presentation/no-bound-change;
 *   RH-equivalent untouched; imp-3066 untouched; NO QED.
 */

// The extended window-width grid, kEnd = 13.00 .. 20.00 (w = 7.00 .. 14.00, quarter-decade step).
export const IMP34378_K_ENDS = Object.freeze([
  13, 13.25, 13.5, 13.75, 14, 14.25, 14.5, 14.75, 15, 15.25, 15.5, 15.75, 16, 16.25, 16.5, 16.75, 17, 17.25, 17.5,
  17.75, 18, 18.25, 18.5, 18.75, 19, 19.25, 19.5, 19.75, 20,
]);
export const IMP34378_WS = Object.freeze(IMP34378_K_ENDS.map((k) => +(k - 6).toFixed(2)));

// |trough| / |peak| ratio at each grid point -- rises to a maximum ~0.9072 at w=9.25, then recedes.
export const IMP34378_RATIOS = Object.freeze([
  0.72, 0.7423, 0.7631, 0.7828, 0.8015, 0.8226, 0.8451, 0.8666, 0.8873, 0.9072, 0.8946, 0.8752, 0.8561, 0.8375,
  0.8193, 0.8017, 0.7846, 0.769, 0.7549, 0.7409, 0.7273, 0.7138, 0.7006, 0.6874, 0.6734, 0.6596, 0.6465, 0.6328,
  0.6184,
]);

// argmax-peak location per grid point -- endpoint-locked (peakK === kEnd) through w=9.25, then jumps
// to the near-left rung k=6.5 (later 6.25) at w=9.5 and stays there.
export const IMP34378_PEAK_IS_ENDPOINT = Object.freeze([
  true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false,
  false, false, false, false, false, false, false, false, false, false, false, false,
]);

export const IMP34378_AMPLITUDE_RATIO_CEILING = 1.0;
export const IMP34378_MAX_RATIO = 0.9072;
export const IMP34378_MAX_RATIO_KEND = 15.25;
export const IMP34378_MAX_RATIO_W = 9.25;
export const IMP34378_CROSSOVER_KEND = 15.5; // first row where the argmax leaves the right endpoint
export const IMP34378_CROSSOVER_W = 9.5;
export const IMP34378_CROSSOVER_PEAK_K = 6.5; // migrates to the near-left rung
export const IMP34378_LAST_ROW_RATIO = 0.6184; // at kEnd = 20 (w = 14)

export const IMP34378_TROUGH_PEAK_RATIO_CEILING_VIZ_DATA = {
  ticket: 'imp-34378',
  sourceTicket: 'imp-34288',
  kEnds: IMP34378_K_ENDS,
  ws: IMP34378_WS,
  ratios: IMP34378_RATIOS,
  peakIsEndpoint: IMP34378_PEAK_IS_ENDPOINT,
  amplitudeRatioCeiling: IMP34378_AMPLITUDE_RATIO_CEILING,
  maxRatio: IMP34378_MAX_RATIO,
  maxRatioKEnd: IMP34378_MAX_RATIO_KEND,
  maxRatioW: IMP34378_MAX_RATIO_W,
  crossoverKEnd: IMP34378_CROSSOVER_KEND,
  crossoverW: IMP34378_CROSSOVER_W,
  crossoverPeakK: IMP34378_CROSSOVER_PEAK_K,
  lastRowRatio: IMP34378_LAST_ROW_RATIO,
  note:
    'Extending the imp-34214/imp-34085 window-width grid past w=7 shows the |trough|/|peak| ratio keeps ' +
    'climbing to a maximum ~0.9072 at w=9.25 (kEnd=15.25), saturating BELOW the amplitude ceiling of 1 ' +
    '(no overshoot), then recedes to ~0.6184 by w=14 (kEnd=20). The turnaround is a REGIME CHANGE: the ' +
    'argmax peak stays locked to the receding right endpoint through w=9.25, then jumps to the ' +
    'near-left rung k~6.5 at w=9.5 and stays there, after which the left-endpoint peak grows quickly ' +
    'while the trough saturates, pulling the ratio back down.',
  honest:
    'VIZ-DATA ONLY -- baked literals reproducing the imp-34288 measurement; adds no new derivation and ' +
    'changes no bound. Descriptive OLS surrogate/fit, NOT a rigorous asymptotic; C_mb GUE-conditional per ' +
    'imp-486 UNTOUCHED; imp-3066 K_a>=0 untouched; NO QED; no refereed bound is changed.',
};

export const IMP34378_VIZ_ASSERTIONS = [
  {
    id: 'imp34378-grid-29-windows-matches-source-anchors',
    description: '29-window 0.25 grid kEnd=13..20 (w=7..14); kEnd=13 -> ratio 0.72 (imp-34085 anchor)',
    holds: () =>
      IMP34378_K_ENDS.length === 29 &&
      IMP34378_K_ENDS[0] === 13 &&
      IMP34378_K_ENDS[IMP34378_K_ENDS.length - 1] === 20 &&
      IMP34378_RATIOS.length === 29 &&
      IMP34378_PEAK_IS_ENDPOINT.length === 29 &&
      Math.abs(IMP34378_RATIOS[0] - 0.72) < 1e-9,
  },
  {
    id: 'imp34378-max-ratio-saturates-below-ceiling',
    description: 'max ratio ~0.9072 at kEnd=15.25 (w=9.25), below ceiling 1, no overshoot',
    holds: () =>
      Math.abs(IMP34378_MAX_RATIO - 0.9072) < 1e-9 &&
      IMP34378_MAX_RATIO_KEND === 15.25 &&
      Math.abs(IMP34378_MAX_RATIO_W - 9.25) < 1e-9 &&
      IMP34378_MAX_RATIO < IMP34378_AMPLITUDE_RATIO_CEILING &&
      IMP34378_RATIOS.every((r) => r < IMP34378_AMPLITUDE_RATIO_CEILING),
  },
  {
    id: 'imp34378-regime-change-crossover-matches-source',
    description: 'argmax endpoint-locked through the max, migrates to k=6.5 at kEnd=15.5, ratio recedes to ~0.6184',
    holds: () => {
      const maxIdx = IMP34378_K_ENDS.indexOf(IMP34378_MAX_RATIO_KEND);
      const crossIdx = IMP34378_K_ENDS.indexOf(IMP34378_CROSSOVER_KEND);
      return (
        IMP34378_PEAK_IS_ENDPOINT.slice(0, maxIdx + 1).every((v) => v === true) &&
        IMP34378_PEAK_IS_ENDPOINT.slice(crossIdx).every((v) => v === false) &&
        IMP34378_CROSSOVER_KEND === 15.5 &&
        Math.abs(IMP34378_CROSSOVER_PEAK_K - 6.5) < 1e-9 &&
        Math.abs(IMP34378_LAST_ROW_RATIO - 0.6184) < 1e-9 &&
        IMP34378_LAST_ROW_RATIO < IMP34378_MAX_RATIO
      );
    },
  },
  {
    id: 'imp34378-honesty-gate-no-qed',
    description: 'honest status references no-bound-change, NOT rigorous, NO QED, no refereed bound is changed',
    holds: () =>
      /NOT a rigorous asymptotic/.test(IMP34378_TROUGH_PEAK_RATIO_CEILING_VIZ_DATA.honest) &&
      /NO QED/.test(IMP34378_TROUGH_PEAK_RATIO_CEILING_VIZ_DATA.honest) &&
      /refereed bound is changed/i.test(IMP34378_TROUGH_PEAK_RATIO_CEILING_VIZ_DATA.honest),
  },
];

for (const a of IMP34378_VIZ_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34378-trough-peak-ratio-ceiling-viz-data assertion failed: ${a.id}`);
  }
}
