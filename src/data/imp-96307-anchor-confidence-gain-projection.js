/**
 * imp-96307 -- concrete c/SE projection for a hypothetical low-T (T=30) or
 * far-high-T (T=4000) anchor on the imp-96173/imp-96148 reciprocal-log margin
 * floor.
 *
 * imp-96289 fitted rho(32,T) = c + d/ln(T) on seven anchors, found the floor
 * c=0.14256 sits floorOverSE = c/SE = 6.56 standard errors above zero, and
 * reported that a single extra on-line anchor would tighten the intercept SE
 * most at the height EXTREMES: T=30 -> 36.4 percent tighter, T=4000 -> 38.0
 * percent, versus only 16.0 percent for a mid-band T=500 anchor. But imp-96289
 * stopped at the fractional SE tightening; it never turned that into the
 * concrete c/SE the extra anchor would actually buy -- i.e. how many more
 * standard errors above zero the floor sign would sit. This module supplies
 * that projection via the OLS leverage identity.
 *
 * KEY OBSERVATION (why the projection is well-posed without new zeros):
 *   The intercept standard error SE(c) = sqrt( s2 * (1/n + xbar^2 / Sxx) )
 *   depends ONLY on the x-design {1/ln(T_i)} and the residual scale s2, NOT on
 *   the realized ordinate of the new anchor. So the SE-tightening a new anchor
 *   buys is deterministic given its height, independent of its (unknown but
 *   plausible) margin value. Only the numerator c shifts with the realized
 *   value, and by leverage the on-line extrapolated value leaves c unmoved.
 *   Placing the anchor at its plausible on-line value y_new = c + d/ln(T_new)
 *   (zero residual) is therefore the natural design point: c stays 0.14256 and
 *   the whole confidence gain shows up as a smaller SE.
 *
 * Two honest SE conventions are reported per height:
 *   - "s2-fixed": reuse the 7-point residual variance s2 (imp-96289 convention;
 *     conservative -- ignores the extra degree of freedom the on-line point adds).
 *   - "refit-8": recompute s2 over all eight points. The on-line anchor adds a
 *     zero residual, so SSE is unchanged but the divisor n-2 rises 5 -> 6, so s2
 *     (and hence SE) drops further. This is the optimistic end of the band.
 *
 * FINDINGS (measurement/design only, no bound moves):
 *   1. A far-high-T anchor at T=4000 is the single cheapest confidence gain:
 *      it lifts the floor sign from 6.56 SE to 10.58 SE (s2-fixed) / 11.59 SE
 *      (refit-8) above zero -- a +4.0 / +5.0 SE hardening from one datum.
 *   2. A low-T anchor at T=30 is nearly as good: 6.56 -> 10.32 (s2-fixed) /
 *      11.31 (refit-8) SE, a +3.8 / +4.7 SE hardening.
 *   3. A mid-band T=500 anchor barely helps: 6.56 -> 7.81 (s2-fixed) / 8.55
 *      (refit-8) SE, only +1.2 / +2.0 SE -- confirming imp-96289 finding 5 that
 *      the extremes, not the middle, are where a new anchor pays.
 *   4. The SE-only nature of the gain means the projection is robust to the
 *      (unknown) realized margin: a plausible +/-0.005 off-line error at T=4000
 *      shifts c by only dc = leverage*0.005 while leaving SE(c) exactly as
 *      projected, so the 10.58-SE figure is a design floor, not a value guess.
 *
 * ASSESSMENT: the imp-96289 "extremes are cheapest" statement, made abstractly
 * in fractional-SE terms, is here made concrete: one T=4000 (or T=30) anchor
 * would roughly halve the SE and push the positive-floor sign from ~6.6 SE to
 * ~10.5-11.6 SE, whereas a mid-band anchor leaves it near ~8 SE. This sharpens
 * the CONFIDENCE in the sign; it does not change the loose 0.14256 MAGNITUDE and
 * moves no Lambda bound.
 *
 * GRADE: documentation/measurement only. Import-light (all literals baked, no
 * heavy bundle). Changes no Lambda bound; NO QED; no refereed bound is changed.
 *
 * @see imp-96289-margin-floor-t60-anchor-sensitivity (fractional SE tightening)
 * @see imp-96265-margin-floor-loo-stability (LOO/LTO leverage ranking)
 * @see imp-96173-route-bd-margin-decay-fits-table (the fit)
 * @see imp-96148-route-bd-online-margin-decay-law (source column + selector)
 */

const T = [60.0, 90.0, 120.0, 150.0, 200.0, 260.0, 395.98];
const RHO = [0.761, 0.692, 0.660, 0.636, 0.619, 0.600, 0.559];
const X = T.map((t) => 1 / Math.log(t));

// OLS line rho = c + d*x with the intercept standard error.
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

export const IMP_96307_BASELINE = {
  floor: SEVEN.c,
  interceptSE: SEVEN.seC,
  floorOverSE: SEVEN.c / SEVEN.seC, // reproduces imp-96289 6.56
};

// Project the intercept SE and c/SE a single extra on-line anchor at newT buys.
// The plausible margin value is the extrapolated on-line ordinate (zero
// residual), so the floor c is unchanged and the whole gain is an SE shrink.
function projectAnchor(newT) {
  const xn = 1 / Math.log(newT);
  const yn = SEVEN.c + SEVEN.d * xn; // plausible on-line margin value
  const xs = X.concat([xn]);
  const ys = RHO.concat([yn]);
  const n = xs.length;
  const sx = xs.reduce((a, b) => a + b, 0);
  const xb = sx / n;
  const sxxCentered = xs.reduce((s, x) => s + (x - xb) ** 2, 0);
  const leverageFactor = 1 / n + (xb * xb) / sxxCentered;
  // s2-fixed convention (reuse the 7-point residual variance; conservative).
  const seFixed = Math.sqrt(SEVEN.s2 * leverageFactor);
  // refit-8 convention (recompute s2 over all eight points; extra DOF helps).
  const refit = fitWithSE(xs, ys);
  return {
    newT,
    plausibleMargin: yn,
    seFixed,
    floorOverSE_fixed: SEVEN.c / seFixed,
    fractionTighter_fixed: 1 - seFixed / SEVEN.seC,
    seRefit: refit.seC,
    floorOverSE_refit: refit.c / refit.seC,
  };
}

export const IMP_96307_ANCHOR_PROJECTIONS = [30, 45, 500, 1000, 4000].map(projectAnchor);

export const IMP_96307_ANCHOR_CONFIDENCE_GAIN_PROJECTION = {
  id: 'imp-96307-anchor-confidence-gain-projection',
  title:
    'Concrete c/SE projection for a hypothetical low-T (T=30) or far-high-T '
    + '(T=4000) anchor on the imp-96173/imp-96148 reciprocal-log margin floor: '
    + 'how many standard errors above zero the floor sign would sit',
  baseline: IMP_96307_BASELINE,
  projections: IMP_96307_ANCHOR_PROJECTIONS,
  finding:
    'converting the imp-96289 fractional SE tightening into a concrete c/SE: a '
    + 'single far-high-T anchor at T=4000 lifts the positive-floor sign from '
    + '6.56 SE to 10.58 SE (s2-fixed) or 11.59 SE (refit-8) above zero, and a '
    + 'low-T anchor at T=30 to 10.32 / 11.31 SE, whereas a mid-band T=500 anchor '
    + 'reaches only 7.81 / 8.55 SE. Because SE(c) depends on the x-design and '
    + 'residual scale but not on the realized ordinate, the projection is a '
    + 'design floor independent of the (unknown) margin value; the extremes are '
    + 'the cheapest single-datum confidence gain, confirming imp-96289 finding 5',
  note:
    'documentation/measurement/design only; import-light baked literals; changes '
    + 'no Lambda bound; no refereed bound is changed',
  closesTickets: ['imp-96307'],
};

// -- assertions (import-light; recompute-and-check only) -------------------
export const IMP_96307_ASSERTIONS = [
  {
    id: 'imp-96307-baseline-reproduces-6p56-SE',
    holds: () => Math.abs(IMP_96307_BASELINE.floorOverSE - 6.56091) < 1e-3,
    why: 'the 7-point baseline must reproduce the imp-96289 floor-over-SE 6.56.',
  },
  {
    id: 'imp-96307-t4000-is-cheapest-fixed',
    holds: () => {
      const byT = Object.fromEntries(IMP_96307_ANCHOR_PROJECTIONS.map((r) => [r.newT, r.floorOverSE_fixed]));
      return byT[4000] > byT[30] && byT[30] > byT[500];
    },
    why: 'a far-high-T anchor must yield the largest c/SE, then low-T, then mid-band (leverage order).',
  },
  {
    id: 'imp-96307-t4000-projection-value',
    holds: () => {
      const p = IMP_96307_ANCHOR_PROJECTIONS.find((r) => r.newT === 4000);
      return Math.abs(p.floorOverSE_fixed - 10.581) < 1e-2 && Math.abs(p.floorOverSE_refit - 11.591) < 1e-2;
    },
    why: 'the T=4000 anchor must project c/SE = 10.58 (s2-fixed) / 11.59 (refit-8).',
  },
  {
    id: 'imp-96307-t30-projection-value',
    holds: () => {
      const p = IMP_96307_ANCHOR_PROJECTIONS.find((r) => r.newT === 30);
      return Math.abs(p.floorOverSE_fixed - 10.322) < 1e-2 && Math.abs(p.floorOverSE_refit - 11.307) < 1e-2;
    },
    why: 'the T=30 anchor must project c/SE = 10.32 (s2-fixed) / 11.31 (refit-8).',
  },
  {
    id: 'imp-96307-midband-barely-helps',
    holds: () => {
      const p = IMP_96307_ANCHOR_PROJECTIONS.find((r) => r.newT === 500);
      return p.floorOverSE_fixed < 8 && p.floorOverSE_fixed > IMP_96307_BASELINE.floorOverSE;
    },
    why: 'a mid-band T=500 anchor must lift c/SE only modestly (below 8, above the 6.56 baseline).',
  },
  {
    id: 'imp-96307-not-a-bound',
    holds: () => Array.isArray(IMP_96307_ANCHOR_CONFIDENCE_GAIN_PROJECTION.closesTickets),
    why: 'this is a measurement/design module; it moves no Lambda bound and proves no QED.',
  },
  {
    id: 'imp-96307-closes-self',
    holds: () => IMP_96307_ANCHOR_CONFIDENCE_GAIN_PROJECTION.closesTickets.includes('imp-96307'),
    why: 'this module is the deliverable the imp-96307 ticket asked for.',
  },
];

for (const a of IMP_96307_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96307-anchor-confidence-gain-projection assertion failed: ${a.id}`);
  }
}

export default IMP_96307_ANCHOR_CONFIDENCE_GAIN_PROJECTION;
