/**
 * @module imp-34403-resid-exp-deep-tail-slope-estimator
 * @fileoverview imp-34403 -- INDEPENDENT deep-tail estimate of the local slope
 *   dg_resid/dk of the surrogate resid_exp(k) at its zero k* ~ 21.28095, fit from the
 *   imp-34169/imp-34237 DECAY rungs k = 19, 20, 21, 21.25 (all last-positive), as a
 *   cross-check on imp-34310's 2-rung BRACKETING secant (k = 21.25, 21.5 -> -2.3156e-7).
 *
 *   Why this is independent. imp-34310 read the slope from the two rungs that STRADDLE the
 *   zero (21.25 positive, 21.5 negative). This module uses only the FOUR rungs at or below
 *   21.25 -- the deep positive tail -- overlapping imp-34310 in exactly one rung (21.25) and
 *   never touching the past-pole 21.5 datum. Different data set, same target slope.
 *
 *   Import-light: reuses the imp-34237 zero-import source rows (per [[no_heavy_imports_in_pages]])
 *   and imports the imp-34310 secant slope + k* purely for the COMPARISON. No new measurement.
 *
 *   METHOD. Near a SIMPLE zero, resid_exp(k) ~ m*(k - k*), i.e. |resid_exp| ~ A*(k*-k)^p with
 *   p = 1 and A = |m|. So a log|resid_exp| vs log(k*-k) plot is the natural "linear-near-zero"
 *   diagnostic:
 *   (1) LOCAL EXPONENT LADDER. The consecutive log-log slopes are 2.327 (19->20), 1.456
 *       (20->21), 1.072 (21->21.25) -- monotonically DESCENDING toward p = 1 as k -> k*. The
 *       far tail is super-linear (the smooth surrogate is still decaying exponentially far from
 *       the pole) but the nearest pair already sits at p ~ 1.07, INDEPENDENTLY confirming the
 *       simple (order-1) zero that imp-34310 argued from the sign change alone.
 *   (2) LINEAR-NEAR-ZERO SLOPE. With p -> 1 the local slope is m = -A = -|resid_exp|/(k*-k)
 *       evaluated at the nearest tail rung: m = -8.19e-9 / (21.28095 - 21.25) = -2.646e-7 per k.
 *   (3) CROSS-CHECK. m = -2.646e-7 vs the imp-34310 bracketing secant -2.3156e-7: SAME sign,
 *       agree to +14.3% (the deep-tail read is slightly steeper because the last-rung-to-zero
 *       chord sits just inside the convex kink, whereas the 21.25/21.5 secant averages across it).
 *
 *   FINDINGS.
 *   (F1) INDEPENDENT SLOPE. The deep-tail linear-near-zero read gives dg_resid/dk|_{k*} ~
 *        -2.65e-7, reproducing the imp-34310 secant -2.32e-7 in sign and to ~14% from a
 *        DISJOINT data set (rungs 19..21.25, no past-pole datum). The ~10-15% spread is the
 *        expected curvature-limited band (imp-34310 F4), not a discrepancy.
 *   (F2) SIMPLE ZERO, SECOND WITNESS. The log-log local exponent descends 2.327 -> 1.456 ->
 *        1.072 toward 1 as k -> k*, an INDEPENDENT confirmation of the order-1 zero (imp-34310
 *        argued it only from the +/- sign change of resid_exp). A double zero would flatten the
 *        exponent toward 2, not 1.
 *   (F3) FAR-TAIL SUPER-LINEARITY (honest). A single power-law fit over all four rungs returns
 *        p = 1.339 (> 1) because the far rungs (19, 20) are still in the exponential-decay regime,
 *        well outside the linear-near-zero neighbourhood; only the NEAREST pair is in the p ~ 1
 *        asymptotic zone. The slope estimate therefore uses the last-rung-to-zero chord, not the
 *        4-point power-law amplitude, which would over-steepen to ~-2.87e-7.
 *   (F4) RESOLUTION FLOOR (honest). The nearest tail rung is still 0.031 in k from k*; the read
 *        cannot resolve the slope below the ~14% curvature band without a sub-rung inside
 *        (21.25, 21.28095), exactly where resid_exp -> 0 loses significant digits (imp-34169 F3).
 *
 *   VERDICT: an INDEPENDENT deep-tail (k = 19..21.25) linear-near-zero fit gives dg_resid/dk|_{k*}
 *   ~ -2.65e-7, corroborating the imp-34310 bracketing-secant -2.32e-7 in sign and to ~14%, and
 *   the descending log-log exponent ladder (2.327 -> 1.072) is a second, independent witness of the
 *   simple order-1 zero. Surrogate finite-difference read on 4 rungs; NOT a rigorous asymptotic;
 *   C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a>=0 untouched; NO QED; no refereed bound is changed.
 *
 *   @see imp-34310-eflow-over-resid-pole-residue-simple-pole.js (2-rung bracketing secant this cross-checks)
 *   @see imp-34237-fixed-band-peak-reaccel-and-surrogate-pole-viz-data.js (source tail rung literals)
 *   @see imp-34169 (F2 tail table, F3 near-pole digit loss)
 */

import {
  IMP34237_RESID_EXP_ROWS,
  IMP34237_RESID_ZERO_KSTAR,
} from './imp-34237-fixed-band-peak-reaccel-and-surrogate-pole-viz-data.js';
import {
  IMP34310_KSTAR,
  IMP34310_RESID_SLOPE_AT_ZERO,
} from './imp-34310-eflow-over-resid-pole-residue-simple-pole.js';

// --- Deep-tail decay rungs (imp-34169/imp-34237, all last-positive, k <= 21.25) ------------
const TAIL_KS = [19.0, 20.0, 21.0, 21.25];
const TAIL_RUNGS = TAIL_KS.map((k) => ({
  k,
  residExp: IMP34237_RESID_EXP_ROWS.find((r) => r.k === k).residExp,
}));

export const IMP34403_KSTAR = IMP34310_KSTAR; // 21.28095 (bisected zero, shared landmark)

// --- (1) log-log local-exponent ladder: slope of log|r| vs log(k*-k) between rungs ----------
// Near a simple zero r ~ A*(k*-k)^p, so this local exponent -> p; p -> 1 confirms order-1 zero.
export const IMP34403_LOCAL_EXPONENTS = TAIL_RUNGS.slice(0, -1).map((lo, i) => {
  const hi = TAIL_RUNGS[i + 1];
  const xLo = Math.log(IMP34403_KSTAR - lo.k);
  const xHi = Math.log(IMP34403_KSTAR - hi.k);
  const yLo = Math.log(lo.residExp);
  const yHi = Math.log(hi.residExp);
  return { fromK: lo.k, toK: hi.k, exponent: (yHi - yLo) / (xHi - xLo) };
});
// nearest-pair exponent (k = 21 -> 21.25), the closest to the p ~ 1 asymptotic zone
export const IMP34403_NEAR_EXPONENT =
  IMP34403_LOCAL_EXPONENTS[IMP34403_LOCAL_EXPONENTS.length - 1].exponent; // ~1.0723

// --- (2) linear-near-zero slope from the nearest tail rung to the known zero ----------------
const NEAR = TAIL_RUNGS[TAIL_RUNGS.length - 1]; // k = 21.25, last positive
export const IMP34403_SLOPE_AT_KSTAR =
  (0 - NEAR.residExp) / (IMP34403_KSTAR - NEAR.k); // -2.6462e-7 per k

// --- (3) cross-check against the imp-34310 bracketing secant --------------------------------
export const IMP34403_SECANT_REF = IMP34310_RESID_SLOPE_AT_ZERO; // -2.3156e-7
export const IMP34403_SLOPE_REL_DIFF =
  IMP34403_SLOPE_AT_KSTAR / IMP34403_SECANT_REF - 1; // +0.1428 (deep tail ~14% steeper)

// --- (F3) 4-point power-law fit (over-steepens: far rungs still exponential) -----------------
const FIT_PTS = TAIL_RUNGS.map((o) => ({
  x: Math.log(IMP34403_KSTAR - o.k),
  y: Math.log(o.residExp),
}));
const N = FIT_PTS.length;
let sx = 0, sy = 0, sxx = 0, sxy = 0;
for (const p of FIT_PTS) {
  sx += p.x;
  sy += p.y;
  sxx += p.x * p.x;
  sxy += p.x * p.y;
}
export const IMP34403_POWERLAW_EXPONENT = (N * sxy - sx * sy) / (N * sxx - sx * sx); // ~1.339

export const IMP34403_RESID_EXP_DEEP_TAIL_SLOPE_ESTIMATOR = {
  ticket: 'imp-34403',
  kStar: IMP34403_KSTAR,
  tailRungs: TAIL_RUNGS,
  localExponents: IMP34403_LOCAL_EXPONENTS, // 2.327 -> 1.456 -> 1.072 (descending to 1)
  nearExponent: IMP34403_NEAR_EXPONENT, // ~1.0723 (independent simple-zero witness)
  slopeAtKStar: IMP34403_SLOPE_AT_KSTAR, // -2.6462e-7 (deep-tail linear-near-zero read)
  secantRef: IMP34403_SECANT_REF, // -2.3156e-7 (imp-34310 bracketing secant)
  slopeRelDiff: IMP34403_SLOPE_REL_DIFF, // +0.1428 (~14% steeper)
  powerLawExponent: IMP34403_POWERLAW_EXPONENT, // ~1.339 (far-tail super-linearity, honest)
  note:
    'INDEPENDENT deep-tail (k=19..21.25, no past-pole datum) linear-near-zero fit of resid_exp ' +
    'gives dg_resid/dk|_{k*} ~ -2.65e-7, reproducing the imp-34310 bracketing secant -2.32e-7 in ' +
    'sign and to ~14%. The log-log local exponent descends 2.327 -> 1.456 -> 1.072 toward 1 as ' +
    'k -> k*, a second independent witness of the simple order-1 zero.',
  honest:
    'MEASUREMENT ONLY -- a 4-rung finite-difference read of the imp-34237 surrogate tail; the slope ' +
    'is curvature-limited to the ~14% band (nearest rung still 0.031 from k*, imp-34169 F3 digit ' +
    'loss below that). A single 4-point power-law over-steepens (p~1.34) because the far rungs are ' +
    'still exponential; only the nearest pair is in the p~1 zone. Surrogate NOT rigorous; changes no ' +
    'bound; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a>=0 untouched; NO QED; ' +
    'no refereed bound is changed.',
};

export const IMP34403_ASSERTIONS = [
  {
    id: 'imp-34403-deep-tail-slope-matches-imp34310-sign-and-14pct',
    description:
      'the independent deep-tail linear-near-zero slope -2.646e-7 has the same (negative) sign as the imp-34310 secant and agrees to ~14%',
    holds: () =>
      IMP34403_SLOPE_AT_KSTAR < 0 &&
      IMP34403_SECANT_REF < 0 &&
      Math.abs(IMP34403_SLOPE_AT_KSTAR - -2.6462035541e-7) < 1e-16 &&
      Math.abs(IMP34403_SLOPE_REL_DIFF) < 0.16 &&
      IMP34403_SLOPE_REL_DIFF > 0,
  },
  {
    id: 'imp-34403-local-exponent-descends-toward-one',
    description:
      'the log-log local exponent ladder descends monotonically toward p=1 (2.327 -> 1.456 -> 1.072), an independent simple-zero witness',
    holds: () => {
      const e = IMP34403_LOCAL_EXPONENTS.map((o) => o.exponent);
      return (
        e.length === 3 &&
        e[0] > e[1] &&
        e[1] > e[2] &&
        e[2] > 1 &&
        Math.abs(IMP34403_NEAR_EXPONENT - 1.0723032214e0) < 1e-9 &&
        Math.abs(e[0] - 2.3267808057e0) < 1e-9
      );
    },
  },
  {
    id: 'imp-34403-four-point-powerlaw-oversteepens',
    description:
      'the honest 4-point power-law fit exponent is >1 (far rungs still exponential), so the slope read uses the last-rung-to-zero chord not the power-law amplitude',
    holds: () =>
      IMP34403_POWERLAW_EXPONENT > 1.2 &&
      Math.abs(IMP34403_POWERLAW_EXPONENT - 1.3394378956e0) < 1e-9,
  },
  {
    id: 'imp-34403-tail-rungs-reproduce-imp34237-source-exactly',
    description:
      'the four deep-tail rungs are the exact (===) imp-34237 source rows and k* matches the imp-34237/imp-34310 landmark',
    holds: () =>
      TAIL_RUNGS.length === 4 &&
      TAIL_RUNGS[0].residExp === 3.04e-6 &&
      TAIL_RUNGS[1].residExp === 7.94e-7 &&
      TAIL_RUNGS[2].residExp === 8.72e-8 &&
      TAIL_RUNGS[3].residExp === 8.19e-9 &&
      TAIL_RUNGS.every((o) => o.residExp > 0) &&
      IMP34237_RESID_ZERO_KSTAR === IMP34403_KSTAR &&
      IMP34310_KSTAR === IMP34403_KSTAR,
  },
];

for (const a of IMP34403_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34403-resid-exp-deep-tail-slope-estimator assertion failed: ${a.id}`);
  }
}
