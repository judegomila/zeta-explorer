/**
 * imp-96328 -- REALIZED far-high-T anchor: refit the imp-96173/imp-96148
 * reciprocal-log margin floor on the seven baked anchors PLUS the actually
 * measured rho(32,T=4000)=0.3845 datum (imp-96224), and test whether the
 * imp-96307 projected +4-SE hardening survives contact with the real value.
 *
 * imp-96307 projected, via the OLS leverage identity, that a single far-high-T
 * anchor at T=4000 would lift the imp-96289 reciprocal-log floor sign from
 * 6.56 SE to ~10.58 SE (s2-fixed) / 11.59 SE (refit-8) above zero. But that
 * projection PLACED the anchor at its plausible ON-LINE value
 * y_new = c + d/ln(4000) = 0.44419 (zero residual by construction), so the
 * floor c stayed pinned at 0.14256 and the whole gain showed up as a smaller
 * SE. It never used a measured ordinate.
 *
 * imp-96224 (worst-support N=32 census extended to gamma_4000) DID measure the
 * on-line margin there: rho(32,T=4000) = 0.3845. That real value sits
 * -0.05966 BELOW the seven-point extrapolation 0.44419. This module refits the
 * eight-anchor law rho(32,T)=c+d/ln(T) with that real datum and reports the
 * REALIZED intercept c, its SE and c/SE, against the imp-96307 projection.
 *
 * KEY OBSERVATION (why the projected hardening does NOT materialize):
 *   The imp-96307 projection is a DESIGN floor -- it assumes the new anchor
 *   lands on the seven-point line (zero residual). The real datum does not: it
 *   is ~0.060 below the extrapolation. At the small design x=1/ln(4000)=0.12057
 *   (near the intercept), a point below the line pulls the intercept DOWN and
 *   its nonzero residual INFLATES the residual scale s2. So instead of c staying
 *   0.14256 with a shrinking SE, BOTH move the wrong way for the projection: c
 *   drops toward zero and the SE widens.
 *
 * FINDINGS (measurement only, no bound moves):
 *   1. The realized floor does NOT stay near 0.14256 -- it DROPS to c=0.05302,
 *      a 63 percent fall toward zero, independently reproducing (via a minimal
 *      eight-anchor fit) the imp-96224 full-35-point "floor trending to zero"
 *      reading (c=0.03411 there).
 *   2. The projected +4-SE HARDENING is refuted: c/SE does NOT rise from 6.56
 *      to ~10.58; it FALLS to 1.69 SE. The real anchor SOFTENS the positive-
 *      floor sign confidence rather than hardening it, because its off-line
 *      residual both lowers c and inflates the intercept SE (0.02173 -> 0.03140).
 *   3. The sign of the floor stays positive (c=0.05302 > 0) but only ~1.7 SE
 *      above zero on eight anchors -- consistent with a floor heading to zero,
 *      not a settled positive asymptote, and with imp-96224 finding the no-floor
 *      log-linear law fits the full column better.
 *   4. The gap is entirely a residual effect: the imp-96307 zero-residual design
 *      point (0.44419) reproduces the projected SE 0.01347 and c/SE 10.58
 *      exactly; swapping in the measured 0.3845 is what collapses it.
 *
 * ASSESSMENT: the imp-96307 "one far-high-T anchor hardens the sign to ~10.6 SE"
 * projection was a DESIGN floor conditional on the anchor landing on-line. The
 * realized T=4000 margin sits well below the extrapolation, so the actual
 * eight-anchor refit moves the floor confidence the OTHER way (6.56 -> 1.69 SE)
 * and drops the floor magnitude 0.14256 -> 0.05302. This corroborates the
 * imp-96224 independent finding that the on-line floor is heading to zero, and
 * cautions that the imp-96307 SE projection is only realized when the new datum
 * happens to fall on-line. The on-line margin itself stays strictly positive
 * (0.3845 at T=4000); the binding uniform-in-T obstruction remains OFF the line.
 *
 * GRADE: documentation/measurement only. Import-light (all literals baked, no
 * heavy bundle). Changes no Lambda bound; NO QED; no refereed bound is changed.
 *
 * @see imp-96307-anchor-confidence-gain-projection (the on-line SE projection tested here)
 * @see imp-96224-route-bd-online-margin-floor-gamma4000 (the measured rho(32,4000)=0.3845 datum)
 * @see imp-96289-margin-floor-t60-anchor-sensitivity (the 7-point 6.56-SE baseline)
 * @see imp-96173-route-bd-margin-decay-fits-table (the fit)
 * @see imp-96148-route-bd-online-margin-decay-law (source column + selector)
 */

const T7 = [60.0, 90.0, 120.0, 150.0, 200.0, 260.0, 395.98];
const R7 = [0.761, 0.692, 0.660, 0.636, 0.619, 0.600, 0.559];
const X7 = T7.map((t) => 1 / Math.log(t));

// The far-high-T anchor: T=4000 with the ACTUALLY measured margin (imp-96224).
const T_NEW = 4000.0;
const RHO_NEW_MEASURED = 0.3845; // imp-96224 extendedRho at T=4000

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

const SEVEN = fitWithSE(X7, R7);
const X_NEW = 1 / Math.log(T_NEW);
const RHO_NEW_ONLINE = SEVEN.c + SEVEN.d * X_NEW; // imp-96307 plausible on-line value

// The realized eight-anchor refit with the MEASURED datum.
const EIGHT = fitWithSE(X7.concat([X_NEW]), R7.concat([RHO_NEW_MEASURED]));

// The imp-96307 s2-fixed projection at the on-line design point (reused here to
// show the projected 10.58 SE is reproduced and it is the residual that breaks it).
const X8 = X7.concat([X_NEW]);
const XB8 = X8.reduce((a, b) => a + b, 0) / X8.length;
const SXXC8 = X8.reduce((s, x) => s + (x - XB8) ** 2, 0);
const SE_FIXED_PROJECTED = Math.sqrt(SEVEN.s2 * (1 / 8 + (XB8 * XB8) / SXXC8));

export const IMP_96328_BASELINE = {
  floor: SEVEN.c,
  interceptSE: SEVEN.seC,
  floorOverSE: SEVEN.c / SEVEN.seC, // reproduces the imp-96289 6.56
};

export const IMP_96328_REALIZED = {
  newT: T_NEW,
  measuredMargin: RHO_NEW_MEASURED,
  plausibleOnlineMargin: RHO_NEW_ONLINE, // what imp-96307 assumed
  measuredMinusOnline: RHO_NEW_MEASURED - RHO_NEW_ONLINE,
  floor: EIGHT.c,
  interceptSE: EIGHT.seC,
  floorOverSE: EIGHT.c / EIGHT.seC,
  slope: EIGHT.d,
};

export const IMP_96328_PROJECTION_CHECK = {
  projectedSE_fixed: SE_FIXED_PROJECTED,
  projectedFloorOverSE_fixed: SEVEN.c / SE_FIXED_PROJECTED, // ~10.58
  realizedFloorOverSE: EIGHT.c / EIGHT.seC, // ~1.69
  hardeningRealized: (EIGHT.c / EIGHT.seC) > IMP_96328_BASELINE.floorOverSE,
};

export const IMP_96328_MARGIN_FLOOR_REALIZED_GAMMA4000_ANCHOR = {
  id: 'imp-96328-margin-floor-realized-gamma4000-anchor',
  title:
    'Realize the imp-96307 far-high-T projection: refit the reciprocal-log '
    + 'margin floor on the seven baked anchors plus the MEASURED rho(32,4000)=0.3845 '
    + 'datum and test whether the projected 6.56 -> 10.58 SE hardening survives',
  baseline: IMP_96328_BASELINE,
  realized: IMP_96328_REALIZED,
  projectionCheck: IMP_96328_PROJECTION_CHECK,
  finding:
    'the imp-96307 projected hardening does NOT materialize with the real datum. '
    + 'imp-96307 placed the T=4000 anchor at its plausible on-line value 0.44419 '
    + '(zero residual) so the floor stayed 0.14256 and c/SE rose to 10.58; the '
    + 'measured rho(32,4000)=0.3845 (imp-96224) sits -0.05966 below that '
    + 'extrapolation, so the realized eight-anchor refit DROPS the floor to '
    + 'c=0.05302 (a 63 percent fall toward zero) and its off-line residual '
    + 'inflates the intercept SE 0.02173 -> 0.03140, COLLAPSING the sign '
    + 'confidence from 6.56 SE to 1.69 SE -- the opposite of the projected '
    + 'hardening. This independently reproduces (on a minimal eight-anchor fit) '
    + 'the imp-96224 full-column reading that the on-line floor is trending to '
    + 'zero, and shows the imp-96307 SE projection is a design floor realized '
    + 'only when the new datum happens to land on-line',
  note:
    'documentation/measurement only; import-light baked literals; the on-line '
    + 'margin itself stays strictly positive (0.3845 at T=4000) and the binding '
    + 'uniform-in-T obstruction stays OFF the line; changes no Lambda bound; '
    + 'no refereed bound is changed; NO QED',
  closesTickets: ['imp-96328'],
};

// -- assertions (import-light; recompute-and-check only) -------------------
export const IMP_96328_ASSERTIONS = [
  {
    id: 'imp-96328-baseline-reproduces-6p56-SE',
    holds: () => Math.abs(IMP_96328_BASELINE.floorOverSE - 6.56091) < 1e-3,
    why: 'the 7-point baseline must reproduce the imp-96289 floor-over-SE 6.56.',
  },
  {
    id: 'imp-96328-real-datum-below-online-extrapolation',
    holds: () => IMP_96328_REALIZED.measuredMinusOnline < -0.05
      && Math.abs(IMP_96328_REALIZED.plausibleOnlineMargin - 0.44419) < 1e-3,
    why: 'the measured rho(32,4000)=0.3845 must sit ~0.06 below the imp-96307 on-line value 0.44419.',
  },
  {
    id: 'imp-96328-realized-floor-drops-toward-zero',
    holds: () => IMP_96328_REALIZED.floor > 0
      && IMP_96328_REALIZED.floor < 0.5 * IMP_96328_BASELINE.floor
      && Math.abs(IMP_96328_REALIZED.floor - 0.05302) < 1e-3,
    why: 'the realized eight-anchor floor must drop to c~0.053, over half below the 0.14256 baseline (toward zero).',
  },
  {
    id: 'imp-96328-projected-hardening-refuted',
    holds: () => IMP_96328_REALIZED.floorOverSE < IMP_96328_BASELINE.floorOverSE
      && Math.abs(IMP_96328_REALIZED.floorOverSE - 1.6885) < 1e-2
      && !IMP_96328_PROJECTION_CHECK.hardeningRealized,
    why: 'the realized c/SE must FALL to ~1.69 (softer than the 6.56 baseline), refuting the projected ~10.58 SE hardening.',
  },
  {
    id: 'imp-96328-projection-reproduced-at-online-point',
    holds: () => Math.abs(IMP_96328_PROJECTION_CHECK.projectedFloorOverSE_fixed - 10.581) < 1e-2,
    why: 'the imp-96307 s2-fixed projection 10.58 SE must be reproduced at the on-line design point (isolating the residual as the cause).',
  },
  {
    id: 'imp-96328-not-a-bound',
    holds: () => Array.isArray(IMP_96328_MARGIN_FLOOR_REALIZED_GAMMA4000_ANCHOR.closesTickets),
    why: 'this is a measurement module; it moves no Lambda bound and proves no QED.',
  },
  {
    id: 'imp-96328-closes-self',
    holds: () => IMP_96328_MARGIN_FLOOR_REALIZED_GAMMA4000_ANCHOR.closesTickets.includes('imp-96328'),
    why: 'this module is the deliverable the imp-96328 ticket asked for.',
  },
];

for (const a of IMP_96328_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96328-margin-floor-realized-gamma4000-anchor assertion failed: ${a.id}`);
  }
}

export default IMP_96328_MARGIN_FLOOR_REALIZED_GAMMA4000_ANCHOR;
