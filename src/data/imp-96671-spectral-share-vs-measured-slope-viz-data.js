/**
 * @module imp-96671-spectral-share-vs-measured-slope-viz-data
 *
 * imp-96671 (ux, sonnet-4-6): import-light viz data for the imp-96652 structural
 * derivation of the imp-96636 sigmoidal rank-r accumulation onset. Baked literals only --
 * no live import of imp-96652 (kept import-light per imp-96644 lazy-import guard).
 *
 * Two series compared, both already reported in imp-96652:
 *   (1) the TWO-SCALE CLOSED-FORM top-eigenpair weight share
 *         s_r = 1 / (1 + exp(-(r - r0)/k)),
 *       with
 *         k  = 1 / ln(lam1/lam2)      -- width, fixed by the top spectral GAP ratio (~2.60)
 *         r0 = k * ln((1-w1)/w1)      -- half-saturation, fixed by the small top OVERLAP w1 (~8.7%)
 *       evaluated at the N=1000..3000 ladder-averaged spectral quantities
 *       (IMP96652_TWOSCALE_AVG: w1=0.08675, gap=2.6038 -> r0=2.4599, k=1.045);
 *   (2) the MEASURED rank-r Rayleigh log-slope fraction b_r/L (imp-96612 table, L = the
 *       imp-96443 asymptote 0.3526253785070698) -- the same 12 points imp-96636 fit to the
 *       empirical logistic (r0=2.940802, k=0.863214, R^2=0.996) this derivation explains.
 * Also carries the EXACT (non-two-scale) top-eigenpair share s_r at N=3000 from the full
 * eigendecomposition (IMP96652_SHARE_N3000), shown as a light reference curve so the
 * two-scale idealization's departure from the true finite-N spectrum is visible.
 *
 * @see imp-96652-route-m-lammax-sigmoid-onset-spectral-derivation.js (source derivation, measurement only)
 * @see imp-96662-lammax-rankr-slope-onset-viz-data.js (the same b_r/L measured points, different overlay)
 * Ticket: imp-96671 (ux, sonnet-4-6, sonnet). Presentation only; NO QED.
 */

// imp-96443 measured lam_max leading log-slope (asymptote L of b_r).
export const IMP96671_TARGET_SLOPE = 0.3526253785070698;

// two-scale closed-form params: k = 1/ln(gap), r0 = k*ln((1-w1)/w1), ladder-averaged N=1000..3000
// (imp-96652 IMP96652_TWOSCALE_AVG).
export const IMP96671_TWOSCALE_PARAMS = Object.freeze({
  w1: 0.08675,
  gap: 2.6038,
  r0: 2.4599,
  k: 1.045,
});

// imp-96636 empirical logistic fit to the measured b_r/L points (the honest summary imp-96652 derives).
export const IMP96671_MEASURED_LOGISTIC = Object.freeze({
  r0: 2.940802,
  k: 0.863214,
  r2: 0.996115,
});

// measured rank-r Rayleigh log-slope b_r (imp-96612 table, r = 0..11), reported as the fraction b_r/L.
export const IMP96671_MEASURED_FRACTION = Object.freeze(
  [
    0.0, 0.01661333, 0.09286438, 0.19357364, 0.26902421, 0.31227912,
    0.33404105, 0.34428597, 0.34894019, 0.35101219, 0.35192347, 0.35232119,
  ].map((b, r) => Object.freeze([r, b / IMP96671_TARGET_SLOPE])),
);

// exact top-eigenpair weight share s_r at N=3000 (full eigendecomposition; imp-96652 IMP96652_SHARE_N3000).
export const IMP96671_EXACT_SHARE_N3000 = Object.freeze(
  [0.0777, 0.3613, 0.6592, 0.841, 0.9309, 0.971, 0.9881, 0.9951, 0.998, 0.9992, 0.9997, 0.9999].map(
    (s, r) => Object.freeze([r, s]),
  ),
);
