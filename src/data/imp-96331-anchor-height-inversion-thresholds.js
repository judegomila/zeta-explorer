/**
 * imp-96331 -- invert the imp-96307 OLS-leverage projection to the THRESHOLD
 * anchor heights that lift the reciprocal-log floor-sign SE past a target
 * 8 SE / 10 SE, under both the s2-fixed and refit-8 conventions.
 *
 * imp-96307 sampled only three anchor heights (T=30, T=500, T=4000) and read
 * off the c/SE each buys (10.32, 7.81, 10.58 s2-fixed). Because the intercept
 * standard error SE(c) = sqrt( s2 * (1/n + xbar^2 / Sxx) ) depends ONLY on the
 * x-design {1/ln(T_i)} and the residual scale s2 -- NOT on the realized ordinate
 * of the on-line anchor -- the map height -> projected floor-sign SE is smooth
 * and (on each side of the leverage centroid) monotone, hence invertible. This
 * module inverts it: it reports the minimum extreme-HIGH height and the maximum
 * (least-extreme) LOW height whose single on-line datum lifts the 6.56-SE floor
 * sign past 8 SE and past 10 SE, plus the monotone height -> SE curve and the
 * finite branch ceilings.
 *
 * WHY THE TWO BRANCHES (the curve is U-shaped in T, not monotone):
 *   The added anchor tightens SE(c) only by widening the x-spread Sxx. An anchor
 *   at the leverage centroid x = xbar (here T* ~= 133) adds no spread and leaves
 *   the floor-sign SE at the 7-point baseline 6.56; moving the anchor away in
 *   EITHER direction -- to higher T (smaller x) or lower T (larger x) -- widens
 *   Sxx and raises c/SE. So the invertible design has TWO monotone arms:
 *     - HIGH arm (T > T*): c/SE rises with T; invert for the MIN height reaching
 *       the target (the cheapest far-high-T anchor).
 *     - LOW arm  (T < T*): c/SE rises as T falls; invert for the MAX height
 *       reaching the target (the least-extreme low-T anchor still sufficient).
 *
 * REFIT-8 IS A T-INDEPENDENT RESCALE OF S2-FIXED (clean analytic link):
 *   Placing the anchor at its on-line value gives it a zero residual, so SSE is
 *   unchanged and the fitted floor c is unchanged; only the divisor n-2 rises
 *   5 -> 6. Hence s2_refit = s2_fixed * 5/6 for EVERY height, so
 *     SE_refit(T) = SE_fixed(T) * sqrt(5/6),  c/SE_refit(T) = c/SE_fixed(T) * sqrt(6/5).
 *   The refit curve is the fixed curve scaled by sqrt(6/5) = 1.095445; inverting
 *   refit at target tau is inverting fixed at tau*sqrt(5/6).
 *
 * FINDINGS (measurement / design only, no bound moves):
 *   1. Reach 8 SE: s2-fixed needs a high anchor at T >= 573.9 OR a low anchor at
 *      T <= 51.0; refit-8 (looser target) needs only T >= 343.5 OR T <= 65.6.
 *   2. Reach 10 SE: s2-fixed needs T >= 2477.0 OR T <= 31.8; refit-8 needs
 *      T >= 1278.9 OR T <= 38.1.
 *   3. The curve bottoms at the leverage centroid T* ~= 133 (c/SE = 6.56, the
 *      bare baseline -- a mid-band anchor buys nothing), matching the imp-96307
 *      finding that the extremes, not the middle, are where a new anchor pays.
 *   4. Each arm saturates at a finite ceiling: the far-high-T arm at 18.25 SE
 *      (s2-fixed) / 19.99 (refit), the low-T arm (T -> 1+) at 54.87 / 60.10. Any
 *      target below those ceilings is reachable on that arm; both 8 and 10 are.
 *
 * ASSESSMENT: the imp-96307 three-point sample is here inverted into continuous
 * threshold heights -- the exact minimum extreme-high anchor and maximum
 * least-extreme low anchor that reach 8 SE and 10 SE. This sharpens the DESIGN of
 * where a single future on-line anchor would have to sit to harden the positive
 * floor SIGN to a target confidence; it does not change the loose 0.14256
 * MAGNITUDE and moves no Lambda bound.
 *
 * GRADE: documentation/measurement/design only. Import-light (all inputs baked,
 * no heavy bundle). Changes no Lambda bound; NO QED; no refereed bound is changed.
 *
 * @see imp-96307-anchor-confidence-gain-projection (the three-point projection inverted here)
 * @see imp-96289-margin-floor-t60-anchor-sensitivity (fractional SE tightening)
 * @see imp-96173-route-bd-margin-decay-fits-table (the fit)
 * @see imp-96148-route-bd-online-margin-decay-law (source column + selector)
 */

const T = [60.0, 90.0, 120.0, 150.0, 200.0, 260.0, 395.98];
const RHO = [0.761, 0.692, 0.660, 0.636, 0.619, 0.600, 0.559];
const X = T.map((t) => 1 / Math.log(t));

// OLS line rho = c + d*x with the intercept standard error (imp-96307 fit).
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

const SEVEN = fitWithSE(X, RHO);
const REFIT_FACTOR = Math.sqrt(6 / 5); // c/SE_refit = c/SE_fixed * sqrt(6/5)

// Leverage factor of the 8-point design with an on-line anchor at height newT.
function leverageFactor(newT) {
  const xn = 1 / Math.log(newT);
  const xs = X.concat([xn]);
  const n = xs.length;
  const sx = xs.reduce((a, b) => a + b, 0);
  const xb = sx / n;
  const sxxCentered = xs.reduce((s, x) => s + (x - xb) ** 2, 0);
  return 1 / n + (xb * xb) / sxxCentered;
}

// Projected floor-sign SE multiple as a function of anchor height.
function floorOverSEfixed(newT) {
  return SEVEN.c / Math.sqrt(SEVEN.s2 * leverageFactor(newT));
}
function floorOverSErefit(newT) {
  return floorOverSEfixed(newT) * REFIT_FACTOR;
}

// Leverage centroid T* (global minimum of the U-shaped curve) via ternary search.
function findCentroid() {
  let lo = 1.001, hi = 1e6;
  for (let i = 0; i < 400; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (floorOverSEfixed(m1) < floorOverSEfixed(m2)) hi = m2; else lo = m1;
  }
  return (lo + hi) / 2;
}
const CENTROID_T = findCentroid();

// Invert on the HIGH arm (T > T*, c/SE increasing in T): min height reaching tau.
function solveHigh(tau, fn) {
  let lo = CENTROID_T, hi = 1e15;
  if (fn(hi) < tau) return null; // target above the arm ceiling
  for (let i = 0; i < 300; i++) { const m = Math.sqrt(lo * hi); if (fn(m) < tau) lo = m; else hi = m; }
  return hi;
}
// Invert on the LOW arm (T < T*, c/SE increasing as T falls): max height reaching tau.
function solveLow(tau, fn) {
  let lo = 1.0000001, hi = CENTROID_T;
  if (fn(lo) < tau) return null; // target above the arm ceiling
  for (let i = 0; i < 300; i++) { const m = Math.sqrt(lo * hi); if (fn(m) >= tau) lo = m; else hi = m; }
  return lo;
}

function invertTarget(tau) {
  return {
    targetSE: tau,
    fixed: { highMinT: solveHigh(tau, floorOverSEfixed), lowMaxT: solveLow(tau, floorOverSEfixed) },
    refit: { highMinT: solveHigh(tau, floorOverSErefit), lowMaxT: solveLow(tau, floorOverSErefit) },
  };
}

export const IMP_96331_BASELINE = {
  floor: SEVEN.c,
  interceptSE: SEVEN.seC,
  floorOverSE: SEVEN.c / SEVEN.seC, // reproduces imp-96289/imp-96307 6.56
  centroidT: CENTROID_T,            // U-shaped curve bottoms here at the baseline
  refitFactor: REFIT_FACTOR,
};

export const IMP_96331_THRESHOLDS = [8, 10].map(invertTarget);

// Finite branch ceilings (the highest c/SE each arm can ever buy).
export const IMP_96331_ARM_CEILINGS = {
  highArm_fixed: floorOverSEfixed(1e12),
  highArm_refit: floorOverSErefit(1e12),
  lowArm_fixed: floorOverSEfixed(1.0000001),
  lowArm_refit: floorOverSErefit(1.0000001),
};

// Monotone height -> SE curve (both arms, spanning the U).
export const IMP_96331_CURVE = [1.5, 3, 10, 30, 60, 133.11, 150, 396, 1000, 4000, 1e5, 1e8]
  .map((t) => ({ T: t, floorOverSE_fixed: floorOverSEfixed(t), floorOverSE_refit: floorOverSErefit(t) }));

export const IMP_96331_ANCHOR_HEIGHT_INVERSION_THRESHOLDS = {
  id: 'imp-96331-anchor-height-inversion-thresholds',
  title:
    'Invert the imp-96307 OLS-leverage projection to the minimum extreme-high '
    + 'and maximum least-extreme low anchor heights that lift the reciprocal-log '
    + 'floor-sign SE past a target 8 SE / 10 SE (s2-fixed and refit-8)',
  baseline: IMP_96331_BASELINE,
  thresholds: IMP_96331_THRESHOLDS,
  armCeilings: IMP_96331_ARM_CEILINGS,
  curve: IMP_96331_CURVE,
  finding:
    'the imp-96307 three-point sample inverted into continuous threshold heights: '
    + 'to reach 8 SE the s2-fixed design needs a high anchor at T >= 573.9 or a '
    + 'low anchor at T <= 51.0 (refit-8: T >= 343.5 or T <= 65.6); to reach 10 SE '
    + 'it needs T >= 2477.0 or T <= 31.8 (refit-8: T >= 1278.9 or T <= 38.1). The '
    + 'height -> SE curve is U-shaped, bottoming at the leverage centroid T ~= 133 '
    + 'where a mid-band anchor buys nothing (c/SE = 6.56, the bare baseline), and '
    + 'each arm saturates at a finite ceiling (high arm 18.25/19.99 SE, low arm '
    + '54.87/60.10 SE), so both 8 and 10 SE targets are reachable on either arm. '
    + 'Refit-8 is a T-independent sqrt(6/5) rescale of the s2-fixed curve, so the '
    + 'whole inversion reduces to inverting one monotone arm per side',
  note:
    'documentation/measurement/design only; import-light baked literals; changes '
    + 'no Lambda bound; no refereed bound is changed',
  closesTickets: ['imp-96331'],
};

// -- assertions (import-light; recompute-and-check only) -------------------
export const IMP_96331_ASSERTIONS = [
  {
    id: 'imp-96331-baseline-reproduces-6p56-SE',
    holds: () => Math.abs(IMP_96331_BASELINE.floorOverSE - 6.56091) < 1e-3,
    why: 'the 7-point baseline must reproduce the imp-96289/imp-96307 floor-over-SE 6.56.',
  },
  {
    id: 'imp-96331-inversion-round-trips-imp-96307-samples',
    holds: () =>
      Math.abs(floorOverSEfixed(4000) - 10.581) < 1e-2
      && Math.abs(floorOverSEfixed(30) - 10.322) < 1e-2
      && Math.abs(floorOverSEfixed(500) - 7.806) < 1e-2,
    why: 'the height->SE map inverted here must reproduce the three imp-96307 sample projections.',
  },
  {
    id: 'imp-96331-refit-is-sqrt-6-over-5-rescale',
    holds: () => Math.abs(floorOverSErefit(4000) / floorOverSEfixed(4000) - Math.sqrt(6 / 5)) < 1e-9,
    why: 'refit-8 must be a T-independent sqrt(6/5) rescale of the s2-fixed curve.',
  },
  {
    id: 'imp-96331-target8-fixed-thresholds',
    holds: () => {
      const t8 = IMP_96331_THRESHOLDS.find((r) => r.targetSE === 8);
      return Math.abs(t8.fixed.highMinT - 573.89) < 0.5 && Math.abs(t8.fixed.lowMaxT - 50.96) < 0.1;
    },
    why: 'target 8 SE (s2-fixed) must invert to high T >= 573.9 and low T <= 51.0.',
  },
  {
    id: 'imp-96331-target10-fixed-thresholds',
    holds: () => {
      const t10 = IMP_96331_THRESHOLDS.find((r) => r.targetSE === 10);
      return Math.abs(t10.fixed.highMinT - 2477.04) < 1 && Math.abs(t10.fixed.lowMaxT - 31.85) < 0.1;
    },
    why: 'target 10 SE (s2-fixed) must invert to high T >= 2477.0 and low T <= 31.8.',
  },
  {
    id: 'imp-96331-target10-refit-thresholds',
    holds: () => {
      const t10 = IMP_96331_THRESHOLDS.find((r) => r.targetSE === 10);
      return Math.abs(t10.refit.highMinT - 1278.92) < 1 && Math.abs(t10.refit.lowMaxT - 38.08) < 0.1;
    },
    why: 'target 10 SE (refit-8) must invert to high T >= 1278.9 and low T <= 38.1.',
  },
  {
    id: 'imp-96331-curve-is-U-shaped-at-centroid',
    holds: () =>
      Math.abs(floorOverSEfixed(CENTROID_T) - IMP_96331_BASELINE.floorOverSE) < 1e-3
      && CENTROID_T > 100 && CENTROID_T < 170,
    why: 'the curve must bottom at the leverage centroid (~133) at the bare baseline SE.',
  },
  {
    id: 'imp-96331-arms-saturate-finite',
    holds: () =>
      IMP_96331_ARM_CEILINGS.highArm_fixed > 10 && IMP_96331_ARM_CEILINGS.highArm_fixed < 25
      && IMP_96331_ARM_CEILINGS.lowArm_fixed > 40 && IMP_96331_ARM_CEILINGS.lowArm_fixed < 70,
    why: 'both arms must saturate at a finite ceiling above the 10 SE target.',
  },
  {
    id: 'imp-96331-not-a-bound',
    holds: () => Array.isArray(IMP_96331_ANCHOR_HEIGHT_INVERSION_THRESHOLDS.closesTickets),
    why: 'this is a measurement/design module; it moves no Lambda bound and proves no QED.',
  },
  {
    id: 'imp-96331-closes-self',
    holds: () => IMP_96331_ANCHOR_HEIGHT_INVERSION_THRESHOLDS.closesTickets.includes('imp-96331'),
    why: 'this module is the deliverable the imp-96331 ticket asked for.',
  },
];

for (const a of IMP_96331_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96331-anchor-height-inversion-thresholds assertion failed: ${a.id}`);
  }
}

export default IMP_96331_ANCHOR_HEIGHT_INVERSION_THRESHOLDS;
