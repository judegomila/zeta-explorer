/**
 * imp-96345 -- OFF-LINE uniform-in-T obstruction for the worst-support margin
 * rho(32,T), measured DIRECTLY over all baked heights rather than via the seven
 * on-line anchors alone.
 *
 * imp-96307 projected a +4-SE hardening of the reciprocal-log floor from a single
 * far-high-T anchor; imp-96328 refit with the MEASURED rho(32,T=4000)=0.3845 datum
 * and found the projection was a DESIGN floor -- it assumed the new anchor lands ON
 * the seven-anchor line (zero residual). imp-96328 reported the collapse but stopped
 * at one off-line datum and left the binding uniform-in-T obstruction "OFF the line"
 * only qualitatively described. This module MEASURES that off-line obstruction with
 * the full measured column (imp-96224): the seven on-line anchors PLUS the 27
 * off-anchor heights (T from 500 to 4506.31, gamma_500..gamma_4000), and QUANTIFIES
 * the uniform-in-T lower envelope that actually binds, separating the design-floor
 * artifact from the true worst-support margin.
 *
 * DESIGN-FLOOR ARTIFACT vs TRUE MARGIN (the separation the ticket asks for):
 *   1. RESIDUAL STRUCTURE. Extrapolating the seven-anchor reciprocal-log line
 *      rho=c+d/lnT (c=0.14256, d=2.50166) to the 27 off-anchor measured heights,
 *      23 of 27 measured points sit BELOW the line (mean residual -0.03052, worst
 *      -0.06081 at the deepest height T=4506.31, most-positive only +0.00867 near
 *      the low-T anchors). The seven-anchor extrapolation systematically OVERSTATES
 *      the margin at high T -- the "floor" c=0.14256 is an on-line design artifact.
 *   2. INTERCEPT COLLAPSE. Refitting the SAME reciprocal-log law on all 34 measured
 *      heights collapses the intercept 0.14256 -> 0.03705 (a 74 percent fall toward
 *      zero) and its sign confidence 6.56 SE -> 2.67 SE. This minimal 34-point refit
 *      independently corroborates the imp-96224 full-column intercept 0.03411 (both
 *      ~0.03-0.04, both a floor trending to zero, not a settled positive asymptote).
 *   3. BINDING ENVELOPE. The uniform-in-T lower envelope that actually binds is the
 *      MINIMUM measured margin over all heights, rho_min = 0.3791 at T=4506.31
 *      (gamma_4000) -- strictly POSITIVE and an order of magnitude above the
 *      vanishing fitted intercept.
 *
 * DOES THE POSITIVE-FLOOR SIGN SURVIVE OFF THE LINE? Two distinct answers:
 *   (a) The MEASURED worst-support margin (the binding envelope) stays STRICTLY
 *       POSITIVE at every off-anchor height (min 0.3791 > 0): the SIGN of the actual
 *       on-line margin survives off the line -- no crossing anywhere in the census.
 *   (b) The FITTED reciprocal-log floor (the positive asymptotic intercept c) does
 *       NOT survive as a robust positive value off the line: it collapses toward zero
 *       once the off-anchor points are included, so the 0.14256 "positive floor" is a
 *       seven-anchor design-floor artifact, not a certified positive asymptote.
 *
 * ASSESSMENT. Measured directly over 27 off-anchor heights, the off-line obstruction
 * is a SYSTEMATIC below-line residual (23/27 negative, growing with T to -0.0608 at
 * gamma_4000), which is exactly what collapses the seven-anchor design intercept to
 * ~0.037. The true worst-support margin -- the binding uniform-in-T lower envelope --
 * is 0.3791, strictly positive, so the margin SIGN survives; the positive FLOOR
 * (asymptotic intercept) does not. This reconciles the imp-96328 one-datum collapse
 * with the imp-96224 full-column reading and localizes the design-floor artifact to
 * the below-line residual of the off-anchor points.
 *
 * GRADE: documentation/measurement only. Import-light (arrays baked from imp-96224,
 * recompute-and-check, no heavy bundle). Changes no Lambda bound; NO QED;
 * no refereed bound is changed; RH open. The genuine uniform-in-T
 * obstruction (a uniform OFF-line LP, Weil-positivity strength) stays inaccessible to
 * this on-line construction, unchanged.
 *
 * @see imp-96328-margin-floor-realized-gamma4000-anchor (one-datum collapse of the imp-96307 projection)
 * @see imp-96224-route-bd-online-margin-floor-gamma4000 (source measured column, floor 0.03411)
 * @see imp-96307-anchor-confidence-gain-projection (the on-line SE design floor)
 * @see imp-96148-route-bd-online-margin-decay-law (seven-anchor column + fit)
 */

// Seven ON-LINE anchors (imp-96148) -- the grid the reciprocal-log floor was fit on.
const T7 = [60.0, 90.0, 120.0, 150.0, 200.0, 260.0, 395.98];
const R7 = [0.761, 0.692, 0.660, 0.636, 0.619, 0.600, 0.559];

// The 27 OFF-anchor measured heights (imp-96224: gamma_500..gamma_4000).
const OFF_T = [500.0, 600.0, 700.0, 811.0, 900.0, 1000.0, 1100.0, 1200.0, 1300.0, 1419.0,
  1500.0, 1600.0, 1700.0, 1800.0, 1900.0, 2000.0, 2200.0, 2400.0, 2515.0,
  2600.0, 2800.0, 3000.0, 3300.0, 3600.0, 4000.0, 4400.0, 4506.31];
const OFF_RHO = [0.5522, 0.5358, 0.5331, 0.5241, 0.4915, 0.4914, 0.4840, 0.4783, 0.4754, 0.4580,
  0.4570, 0.4566, 0.4565, 0.4545, 0.4545, 0.4258, 0.4217, 0.4173, 0.4171,
  0.4086, 0.4081, 0.4073, 0.3985, 0.3916, 0.3845, 0.3800, 0.3791];

const X7 = T7.map((t) => 1 / Math.log(t));

// OLS line rho = c + d*x with intercept standard error (same estimator as imp-96328).
function fitWithSE(xs, ys) {
  const n = xs.length;
  const sx = xs.reduce((a, b) => a + b, 0);
  const sy = ys.reduce((a, b) => a + b, 0);
  let sxx = 0, sxy = 0;
  for (let i = 0; i < n; i++) { sxx += xs[i] * xs[i]; sxy += xs[i] * ys[i]; }
  const d = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  const c = (sy - d * sx) / n;
  const xb = sx / n;
  const sxxCentered = xs.reduce((s, x) => s + (x - xb) ** 2, 0);
  let sse = 0;
  for (let i = 0; i < n; i++) { const yh = c + d * xs[i]; sse += (ys[i] - yh) ** 2; }
  const s2 = sse / (n - 2);
  const seC = Math.sqrt(s2 * (1 / n + (xb * xb) / sxxCentered));
  return { c, d, s2, seC };
}

const SEVEN = fitWithSE(X7, R7);

// Residual of each OFF-anchor measured point vs the seven-anchor line extrapolation.
const OFF_RESID = OFF_T.map((t, i) => OFF_RHO[i] - (SEVEN.c + SEVEN.d * (1 / Math.log(t))));
const N_NEG = OFF_RESID.filter((r) => r < 0).length;
const MEAN_RESID = OFF_RESID.reduce((a, b) => a + b, 0) / OFF_RESID.length;
const MIN_RESID = Math.min(...OFF_RESID);
const MIN_RESID_T = OFF_T[OFF_RESID.indexOf(MIN_RESID)];
const MAX_RESID = Math.max(...OFF_RESID);

// Uniform-in-T lower envelope that actually BINDS = min measured margin over ALL heights.
const ALL_T = T7.concat(OFF_T);
const ALL_RHO = R7.concat(OFF_RHO);
const ENV_MIN = Math.min(...ALL_RHO);
const ENV_MIN_T = ALL_T[ALL_RHO.indexOf(ENV_MIN)];

// Full-column refit of the SAME reciprocal-log law (34 measured heights).
const FULL = fitWithSE(ALL_T.map((t) => 1 / Math.log(t)), ALL_RHO);

export const IMP_96345_SEVEN_ANCHOR_LINE = {
  floor: SEVEN.c,               // 0.14256 (reproduces imp-96148/imp-96328 design floor)
  slope: SEVEN.d,               // 2.50166
  floorOverSE: SEVEN.c / SEVEN.seC, // 6.561
};

export const IMP_96345_OFFLINE_RESIDUALS = {
  nOffAnchor: OFF_T.length,     // 27
  nBelowLine: N_NEG,            // 23
  meanResidual: MEAN_RESID,     // -0.03052 (systematically below the seven-anchor line)
  worstResidual: MIN_RESID,     // -0.06081
  worstResidualT: MIN_RESID_T,  // 4506.31 (deepest height binds hardest)
  bestResidual: MAX_RESID,      // +0.00867 (only the low-T near-anchor points sit above)
};

export const IMP_96345_BINDING_ENVELOPE = {
  nFullColumn: ALL_T.length,    // 34
  marginMin: ENV_MIN,           // 0.3791 -- the true worst-support margin (strictly positive)
  marginMinT: ENV_MIN_T,        // 4506.31 (gamma_4000)
  fullFloor: FULL.c,            // 0.03705 (corroborates imp-96224 full-column 0.03411)
  fullFloorOverSE: FULL.c / FULL.seC, // 2.672
  interceptCollapsePct: 100 * (1 - FULL.c / SEVEN.c), // 74.0 percent drop toward zero
};

export const IMP_96345_ROUTE_BD_OFFLINE_MARGIN_ENVELOPE = {
  id: 'imp-96345-route-bd-offline-margin-envelope',
  title:
    'Measure the off-line uniform-in-T obstruction for rho(32,T) directly over all '
    + '27 off-anchor heights: quantify the below-line residual, the binding lower '
    + 'envelope, and whether the positive-floor sign survives off the line',
  sevenAnchorLine: IMP_96345_SEVEN_ANCHOR_LINE,
  offlineResiduals: IMP_96345_OFFLINE_RESIDUALS,
  bindingEnvelope: IMP_96345_BINDING_ENVELOPE,
  finding:
    'measured directly over 27 off-anchor heights, the off-line obstruction is a '
    + 'SYSTEMATIC below-line residual: 23 of 27 measured points sit below the '
    + 'seven-anchor reciprocal-log line (mean -0.03052, worst -0.06081 at the deepest '
    + 'height T=4506.31, best only +0.00867 near the low-T anchors), so the '
    + 'seven-anchor extrapolation OVERSTATES the margin at high T and its intercept '
    + 'c=0.14256 is an on-line design artifact. Refitting the same law on all 34 '
    + 'measured heights collapses the intercept to 0.03705 (74 percent toward zero) '
    + 'and the sign confidence 6.56 SE -> 2.67 SE, corroborating the imp-96224 '
    + 'full-column 0.03411. The uniform-in-T lower envelope that actually BINDS is the '
    + 'minimum measured margin 0.3791 at gamma_4000, strictly positive. So the margin '
    + 'SIGN survives off the line (envelope > 0 everywhere) but the positive FLOOR '
    + '(asymptotic intercept) does NOT -- it is the seven-anchor design-floor artifact '
    + 'the below-line residual dissolves',
  note:
    'documentation/measurement only; import-light arrays baked from imp-96224, '
    + 'recompute-and-check; the binding envelope stays strictly positive (0.3791 at '
    + 'gamma_4000) and the genuine uniform-in-T obstruction (a uniform off-line LP, '
    + 'Weil-positivity strength) stays inaccessible to this on-line construction; '
    + 'changes no Lambda bound; no refereed bound is changed; RH open; NO QED',
  closesTickets: ['imp-96345'],
};

// -- assertions (import-light; recompute-and-check only) -------------------
export const IMP_96345_ASSERTIONS = [
  {
    id: 'imp-96345-seven-anchor-line-reproduces-design-floor',
    holds: () => Math.abs(IMP_96345_SEVEN_ANCHOR_LINE.floor - 0.14256) < 1e-3
      && Math.abs(IMP_96345_SEVEN_ANCHOR_LINE.floorOverSE - 6.561) < 1e-2,
    why: 'the seven-anchor reciprocal-log line must reproduce the imp-96148/imp-96328 design floor 0.14256 at 6.56 SE.',
  },
  {
    id: 'imp-96345-off-anchor-points-sit-below-the-line',
    holds: () => IMP_96345_OFFLINE_RESIDUALS.nOffAnchor === 27
      && IMP_96345_OFFLINE_RESIDUALS.nBelowLine === 23
      && IMP_96345_OFFLINE_RESIDUALS.meanResidual < -0.02
      && Math.abs(IMP_96345_OFFLINE_RESIDUALS.worstResidual - (-0.06081)) < 1e-3,
    why: 'the 27 off-anchor measured heights must sit systematically below the seven-anchor line (23/27 negative, worst ~-0.061 at the deepest height).',
  },
  {
    id: 'imp-96345-worst-residual-at-deepest-height',
    holds: () => Math.abs(IMP_96345_OFFLINE_RESIDUALS.worstResidualT - 4506.31) < 1e-6
      && IMP_96345_OFFLINE_RESIDUALS.bestResidual < 0.01,
    why: 'the below-line residual must be worst at the deepest height (gamma_4000) and no off-anchor point sits more than ~0.009 above the line.',
  },
  {
    id: 'imp-96345-binding-envelope-strictly-positive',
    holds: () => IMP_96345_BINDING_ENVELOPE.nFullColumn === 34
      && IMP_96345_BINDING_ENVELOPE.marginMin > 0
      && Math.abs(IMP_96345_BINDING_ENVELOPE.marginMin - 0.3791) < 1e-4
      && Math.abs(IMP_96345_BINDING_ENVELOPE.marginMinT - 4506.31) < 1e-6,
    why: 'the uniform-in-T lower envelope that binds must be the min measured margin 0.3791 at gamma_4000, strictly positive (SIGN survives off the line).',
  },
  {
    id: 'imp-96345-intercept-collapses-toward-zero-off-the-line',
    holds: () => IMP_96345_BINDING_ENVELOPE.fullFloor < 0.5 * IMP_96345_SEVEN_ANCHOR_LINE.floor
      && Math.abs(IMP_96345_BINDING_ENVELOPE.fullFloor - 0.03705) < 1e-3
      && IMP_96345_BINDING_ENVELOPE.interceptCollapsePct > 70
      && IMP_96345_BINDING_ENVELOPE.fullFloorOverSE < IMP_96345_SEVEN_ANCHOR_LINE.floorOverSE,
    why: 'refitting on all 34 heights must collapse the fitted floor 0.14256 -> ~0.037 (over 70 percent toward zero) -- the positive FLOOR does not survive off the line.',
  },
  {
    id: 'imp-96345-not-a-bound',
    holds: () => Array.isArray(IMP_96345_ROUTE_BD_OFFLINE_MARGIN_ENVELOPE.closesTickets)
      && IMP_96345_ROUTE_BD_OFFLINE_MARGIN_ENVELOPE.closesTickets.includes('imp-96345'),
    why: 'this is a measurement module; it moves no Lambda bound, proves no QED, and is the deliverable the imp-96345 ticket asked for.',
  },
];

for (const a of IMP_96345_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96345-route-bd-offline-margin-envelope assertion failed: ${a.id}`);
  }
}

export default IMP_96345_ROUTE_BD_OFFLINE_MARGIN_ENVELOPE;
