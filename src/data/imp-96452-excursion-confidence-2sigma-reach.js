/**
 * imp-96452 -- ASSESSMENT: what drives the ~1.9-sigma excursion confidence repeatedly cited by
 * imp-96430 (and its GUE cross-validation siblings), and how much additional verified-zero height
 * or sample count would be needed to lift it from ~1.9-sigma to 2-sigma.
 *
 * PROVENANCE (where the ~1.9-sigma figure is actually set). imp-96430, imp-96184 and imp-96128 all
 * say the finding "does not touch / does not raise the ~1.9-sigma excursion confidence, which is set
 * by the excursion depth, not the correlation model", but none of them quantifies it. Tracing the
 * citation: the number originates in imp-96089 (mean-anchor window-count significance verdict), which
 * decided the single significant below-envelope number-variance dip at T = 1.5e5:
 *   z(T) = (|residual|/r) / sqrt(2 / n_w),
 * i.e. the dip depth in units of the chi-square variance-estimator sampling error, with the SIGNIFICANT
 * verdict at z >= 1. imp-96089 reports z = 1.923 at T = 1.5e5 -- this is the "~1.9-sigma" figure.
 *
 * THE THREE DRIVING INPUTS (re-derived import-light from the same imp-95562 sd(C - E) literals):
 *  1. relErr = |residual|/r = 0.159457 -- the FRACTIONAL DIP DEPTH at T = 1.5e5 (the ~16 percent
 *     below-envelope excursion). This is the "excursion depth" the sibling modules point to: a FIXED
 *     measured feature of the existing 10^6 Odlyzko ordinates in src/data/zeros-to-1e6.js.
 *  2. n_w = 291 -- the deterministic non-overlapping hard-box tiling count across the +/-30 percent
 *     span about T = 1.5e5, n_w(T) = floor((min(1.3T, T_max) - 0.7T) / (2*sqrt(T/2pi))). It grows as
 *     n_w ~ 0.3*sqrt(2pi*T), i.e. proportional to sqrt(T) while the span is unclipped.
 *  3. the chi-square first-order sampling model sqrt(2 / n_w) for the relative error on the variance
 *     estimator r.
 * Combined: z = relErr / sqrt(2 / n_w) = 0.159457 / sqrt(2/291) = 1.9234.
 *
 * SENSITIVITY -- what would lift z from 1.9234 to 2.0. Holding the dip depth relErr fixed, z scales as
 * sqrt(n_w), so the required window count is n_w* = n_w * (2 / z)^2 = 291 * 1.08121 = 314.63, i.e.
 * n_w >= 315 -- an increase of +24 windows (+8.12 percent). Equivalently the same dip would clear
 * 2-sigma at a slightly larger UNCLIPPED height, since n_w ~ sqrt(T): T* = T * (315/291)^2 ~ 1.755e5,
 * IF a comparably deep ~16 percent excursion happened to recur there (a different, hypothetical dip).
 *
 * THE OBSTRUCTION -- verified-zero HEIGHT is the wrong lever for THIS dip. The T = 1.5e5 dip's
 * +/-30 percent span [1.05e5, 1.95e5] is FULLY INTERIOR to the existing 10^6-ordinate range (top
 * ordinate T_max ~ 600269.68); it is NOT clipped by the ordinate ceiling. So the 291 windows are
 * already EVERY window the +/-30 percent tiling admits at that height -- the span is densely and
 * completely populated by the existing zeros. Adding verified zeros pushes the ceiling ABOVE ~6e5,
 * nowhere near 1.5e5, and adds exactly ZERO windows to this dip. More verified height cannot move the
 * ~1.9-sigma figure. The only mechanical ways to raise n_w at T = 1.5e5 are:
 *   (a) widen the tiling span from +/-30 percent to +/-32.4 percent -- but that mixes in neighbouring
 *       heights whose number variance is a DIFFERENT statistic, so it dilutes rather than resamples
 *       the same excursion; or
 *   (b) observe a comparably deep dip at a higher unclipped height (a new, distinct excursion).
 * Neither is "more of the same measurement".
 *
 * WHY THE QUOTED FIGURE IS CONSERVATIVE (and hence capped from below by the depth). imp-96128 computed
 * the exact GUE adjacent-box correlation rho_exact = -0.464 (strongly ANTI-correlated), which via the
 * AR-1 factor (1 - rho)/(1 + rho) = 2.731 raises the EFFECTIVE independent count from n_w = 291 to
 * n_eff ~ 795 -- that alone would push a naive z to ~3.18. Yet imp-96089/imp-96128/imp-96184 keep
 * quoting ~1.9-sigma: the figure is deliberately pinned to the NAIVE n_w (the conservative floor),
 * anchored to the dip DEPTH relErr, not to the (favourable) correlation model. So the ~1.9-sigma is a
 * lower bound on the true significance, and the correlation model already sits on the safe side.
 *
 * VERDICT. The ~1.9-sigma excursion confidence is CAPPED BY A FIXED DATA CEILING: it is z = relErr /
 * sqrt(2/n_w) at the single T = 1.5e5 dip, whose depth relErr = 0.1595 and window count n_w = 291 are
 * both fixed properties of the existing 10^6 Odlyzko ordinates. Reaching a clean 2-sigma would need
 * n_w >= 315 (+24 windows, +8.1 percent), but that increment CANNOT come from more verified-zero
 * height (the dip's window is fully interior, not clipped -- zeros above 6e5 add nothing at 1.5e5) nor
 * from the correlation model (already favourable, quoted conservatively). The only genuine lever is a
 * DEEPER excursion (larger relErr) drawn from new INTERIOR data at ~1.5e5, which the fixed ordinate set
 * does not supply. Assessment/measurement only; changes no bound; RH open; NO QED; no refereed bound is changed
 * ; the zero-side route stays PCC/GRH-gated.
 *
 * @see imp-96089-mean-anchor-window-count-significance-verdict (sets z = 1.923 at T = 1.5e5)
 * @see imp-96128-number-variance-two-interval-covariance-exact (n_eff ~ 795; ~1.9-sigma is conservative)
 * @see imp-96430-basis-c-corroboration-reach-crossover (cites the untouched ~1.9-sigma confidence)
 *
 * Import-light: no zeros bundle, no sibling imports. The six sd(C - E) values are the same measured
 * literals imp-95562 baked over the 10^6 Odlyzko ordinates; every other quantity is recomputed here.
 */

const TWO_PI = 2 * Math.PI;
const EULER = 0.5772156649015329;

const zeroDensity = (T) => Math.log(T / TWO_PI) / TWO_PI;
const halfWidth = (T) => Math.sqrt(T / TWO_PI); // Delta = sqrt(T/2pi)
const envelopeCount = (T) => 2 * halfWidth(T) * zeroDensity(T);
const gueNumberVariance = (L) => (Math.log(TWO_PI * L) + EULER + 1) / (Math.PI * Math.PI);
const SELBERG_C = 1 / (2 * Math.PI * Math.PI);
const logLog = (T) => Math.log(Math.log(T / TWO_PI));

// imp-95562 non-overlapping hard-box tiling across the +/-30% span, clipped to the ordinate ceiling.
const SPAN_FRACTION = 0.3;
const T_MAX_ORDINATE = 600269.68; // height of the 10^6-th Odlyzko ordinate (src/data/zeros-to-1e6.js)
const windowCount = (T) => {
  const upper = Math.min((1 + SPAN_FRACTION) * T, T_MAX_ORDINATE);
  const lower = (1 - SPAN_FRACTION) * T;
  return Math.floor((upper - lower) / (2 * halfWidth(T)));
};

// Same six measured literals imp-95562/imp-96049/imp-96089 baked; T = 1.5e5 is the significant dip.
const MEASURED = [
  { Tc: 1.0e4, sdDiscrepancy: 0.6218, nWindowsBaked: 75 },
  { Tc: 3.0e4, sdDiscrepancy: 0.5823, nWindowsBaked: 130 },
  { Tc: 7.0e4, sdDiscrepancy: 0.5689, nWindowsBaked: 198 },
  { Tc: 1.5e5, sdDiscrepancy: 0.6714, nWindowsBaked: 291 },
  { Tc: 3.0e5, sdDiscrepancy: 0.6199, nWindowsBaked: 411 },
  { Tc: 5.0e5, sdDiscrepancy: 0.6078, nWindowsBaked: 443 },
];

const offsets = MEASURED.map((m) => m.sdDiscrepancy * m.sdDiscrepancy - SELBERG_C * logLog(m.Tc));
const C0_mean = offsets.reduce((s, v) => s + v, 0) / offsets.length; // imp-95958/imp-96049 mean anchor
const cappedRatio = (T, C0) => (SELBERG_C * logLog(T) + C0) / gueNumberVariance(envelopeCount(T));

// --- the T = 1.5e5 significant dip: reconstruct its z and its inputs ---
const DIP = MEASURED[3]; // T = 1.5e5
const gueVar = gueNumberVariance(envelopeCount(DIP.Tc));
const rMeasured = (DIP.sdDiscrepancy * DIP.sdDiscrepancy) / gueVar; // imp-95710 r(T)
const rCap = cappedRatio(DIP.Tc, C0_mean);
const residual = rCap - rMeasured; // < 0: below-envelope dip
const relErr = Math.abs(residual) / rMeasured; // dip depth (the "excursion depth")
const nW = DIP.nWindowsBaked; // 291
const sigmaSampling = Math.sqrt(2 / nW); // chi-square relative sampling error on r
const zCurrent = relErr / sigmaSampling; // ~1.9234: the cited ~1.9-sigma figure

// --- 2-sigma reach (dip depth held fixed; z scales as sqrt(n_w)) ---
const Z_TARGET = 2.0;
const nwNeededExact = 2 * (Z_TARGET / relErr) ** 2; // n_w* = 2 (z_target/relErr)^2
const nwNeeded = Math.ceil(nwNeededExact);
const extraWindows = nwNeeded - nW;
const windowIncreasePct = (nwNeededExact / nW - 1) * 100; // = (z_target/z_current)^2 - 1

// n_w ~ 0.3 sqrt(2pi T) while unclipped => same-depth dip reaches 2-sigma at height T*.
const nwContinuous = (T) => SPAN_FRACTION * 2 * T / (2 * halfWidth(T)); // = 0.6 T / (2 Delta)
const TforTwoSigma = DIP.Tc * (nwNeededExact / nW) ** 2; // n_w ~ sqrt(T)

// Span-widening lever: fraction that would yield n_w = nwNeeded at the SAME height T = 1.5e5.
const spanFractionForTwoSigma = (nwNeeded * halfWidth(DIP.Tc)) / DIP.Tc;

// Is the T = 1.5e5 dip window clipped by the ordinate ceiling? (No => verified height adds no windows.)
const dipSpanUpper = (1 + SPAN_FRACTION) * DIP.Tc; // 1.95e5
const dipSpanClipped = dipSpanUpper > T_MAX_ORDINATE;

// imp-96128 anti-correlation context: the effective count is far ABOVE n_w, so ~1.9-sigma is conservative.
const RHO_EXACT_15E5 = -0.46398; // imp-96128 exact GUE adjacent-box lag-1 correlation
const arFactor = (1 - RHO_EXACT_15E5) / (1 + RHO_EXACT_15E5); // 2.7312
const nEff = nW * arFactor; // ~794.8
const zEffNaive = relErr / Math.sqrt(2 / nEff); // ~3.18 if the correlation model were used for the headline

export const IMP96452_EXCURSION_CONFIDENCE_2SIGMA_REACH = {
  ticket: 'imp-96452',
  question:
    'What drives the ~1.9-sigma excursion confidence cited (but never quantified) by imp-96430 and its GUE cross-validation siblings, and how much additional verified-zero height or sample count would lift it from ~1.9-sigma to 2-sigma?',
  source:
    'The ~1.9-sigma figure originates in imp-96089: the z-score of the single significant below-envelope number-variance dip at T = 1.5e5, z = (|residual|/r)/sqrt(2/n_w), with the SIGNIFICANT verdict at z >= 1. imp-96430/imp-96128/imp-96184 cite it as untouched. Measurements: the six imp-95562 sd(C - E) literals over the 10^6 Odlyzko ordinates in src/data/zeros-to-1e6.js.',
  drivingInputs: {
    excursionDepth_relErr: relErr, // ~0.159457: the ~16% below-envelope dip depth (fixed measured feature)
    windowCount_nW: nW, // 291: deterministic +/-30% tiling count, ~ 0.3 sqrt(2pi T)
    samplingModel: 'chi-square first-order relative error sqrt(2 / n_w) on the variance estimator r',
    sigmaSampling, // sqrt(2/291)
    zCurrent, // ~1.9234: the cited ~1.9-sigma
    note: 'z is set by the dip DEPTH (relErr) and the window count (n_w). The dip depth is a fixed property of the existing 10^6 ordinates; n_w ~ sqrt(T) but is already the FULL count at this height (span unclipped).',
  },
  twoSigmaReach: {
    zTarget: Z_TARGET,
    nWindowsNeeded: nwNeeded, // 315
    nWindowsNeededExact: nwNeededExact, // ~314.63
    extraWindows, // +24
    windowIncreasePct, // ~+8.12 percent = (2/z)^2 - 1
    scalingLaw: 'z ~ sqrt(n_w) at fixed dip depth, so n_w* = n_w (z_target/z_current)^2 = 291 * 1.08121.',
    sameDepthHeightForTwoSigma: TforTwoSigma, // ~1.755e5: where the SAME-depth dip would clear 2-sigma (n_w ~ sqrt(T)), IF it recurred
    spanFractionForTwoSigma, // ~0.3245: the widened +/-32.4% span that would give n_w = 315 at T = 1.5e5 (dilutes the measurement)
  },
  obstruction: {
    dipSpan: [(1 - SPAN_FRACTION) * DIP.Tc, dipSpanUpper], // [1.05e5, 1.95e5]
    ordinateCeiling: T_MAX_ORDINATE,
    dipSpanClipped, // false: the dip window is FULLY INTERIOR to the existing ordinate set
    verifiedHeightHelpsThisDip: false,
    statement:
      'The T = 1.5e5 dip window [1.05e5, 1.95e5] is fully interior to the 10^6-ordinate range (top ordinate ~600269.68), NOT clipped, so n_w = 291 is already every window the +/-30% tiling admits there. Additional verified-zero height adds zeros ABOVE ~6e5, nowhere near 1.5e5, contributing ZERO new windows to this dip -- verified height cannot move the ~1.9-sigma figure. The only mechanical alternatives are widening the span to +/-32.4% (mixes in neighbouring heights, a different statistic) or observing a comparably deep dip at a higher unclipped height (a distinct, hypothetical excursion). The ~1.9-sigma is capped by a FIXED DATA CEILING: the single measured dip depth relErr = 0.1595 over a complete interior window; only a DEEPER excursion from new interior data at ~1.5e5 -- not more height, not the (already favourable) correlation model -- would genuinely clear 2-sigma.',
  },
  conservativeQuotingContext: {
    rhoExact: RHO_EXACT_15E5, // imp-96128 exact anti-correlation
    arFactor, // 2.7312
    nEff, // ~794.8
    zEffNaive, // ~3.18
    note: 'imp-96128 shows adjacent boxes are strongly ANTI-correlated, raising the effective count to n_eff ~ 795 (a naive z ~ 3.18). The ~1.9-sigma figure is deliberately pinned to the NAIVE n_w (conservative floor) and to the dip depth, not to the favourable correlation model -- so ~1.9-sigma is a lower bound on the true significance.',
  },
  verdict:
    'The ~1.9-sigma excursion confidence is the imp-96089 z-score z = relErr/sqrt(2/n_w) = 0.159457/sqrt(2/291) = 1.9234 of the single significant below-envelope dip at T = 1.5e5. Its three inputs are the fixed ~16% dip depth relErr, the deterministic +/-30% tiling window count n_w = 291 (~ sqrt(T)), and the chi-square sqrt(2/n_w) sampling model. Reaching a clean 2-sigma at fixed depth needs n_w >= 315 (+24 windows, +8.1 percent). That increment CANNOT come from more verified-zero height: the dip window [1.05e5, 1.95e5] is fully interior to the existing 10^6-ordinate set (not clipped), so zeros above ~6e5 add nothing there. Nor from the correlation model: imp-96128 already puts n_eff ~ 795 (naive z ~ 3.18), so the ~1.9-sigma quote is a conservative floor. The confidence is capped by a fixed data ceiling -- the single measured dip depth over a complete interior window -- and only a DEEPER excursion from new interior data at ~1.5e5 would clear 2-sigma. Assessment/measurement only; changes no bound; RH open; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

export const IMP96452_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Assessment/measurement only: the ~1.9-sigma '
  + 'figure is capped by a FIXED DATA CEILING (the single measured T=1.5e5 dip depth over a '
  + 'complete interior window) -- more verified zero height does NOT lift it, since the dip '
  + 'window is already fully interior to the existing 10^6-ordinate set. The naive n_w=291 quote '
  + 'is deliberately conservative (imp-96128 anti-correlation would raise it to a naive z~3.18 '
  + 'if used); changes no bound; establishes no operator positivity; the zero-side route stays '
  + 'PCC/GRH-gated.';

// --- self-executing internal-consistency assertions (formula re-derivation only) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  // reproduce the imp-96089 mean anchor and z-score exactly
  if (!approx(C0_mean, 0.26184177603555076, 1e-9)) throw new Error('imp-96452: C0_mean drifted from imp-96089');
  if (!approx(relErr, 0.15945679221237827, 1e-9)) throw new Error('imp-96452: dip depth relErr drifted');
  if (nW !== 291) throw new Error('imp-96452: T = 1.5e5 window count not 291');
  if (!approx(zCurrent, 1.9234217, 1e-6)) throw new Error('imp-96452: cited z drifted from imp-96089 1.923');
  if (windowCount(DIP.Tc) !== 291) throw new Error('imp-96452: geometric window count not 291');
  // 2-sigma reach arithmetic
  if (nwNeeded !== 315) throw new Error('imp-96452: n_w needed for z=2 should ceil to 315');
  if (extraWindows !== 24) throw new Error('imp-96452: extra windows should be 24');
  if (!approx(windowIncreasePct, 8.1212, 1e-3)) throw new Error('imp-96452: window increase pct drifted');
  if (!approx(nwNeededExact / nW, (Z_TARGET / zCurrent) ** 2, 1e-12))
    throw new Error('imp-96452: n_w scaling law inconsistent with (z_target/z_current)^2');
  if (!approx(TforTwoSigma, 1.755e5, 2e3)) throw new Error('imp-96452: same-depth 2-sigma height drifted');
  if (!approx(spanFractionForTwoSigma, 0.32447, 1e-4)) throw new Error('imp-96452: widened span fraction drifted');
  // the obstruction: the dip window is NOT clipped
  if (dipSpanClipped) throw new Error('imp-96452: T = 1.5e5 dip window should be interior (unclipped)');
  if (dipSpanUpper >= T_MAX_ORDINATE) throw new Error('imp-96452: dip span upper edge should be below the ordinate ceiling');
  // n_w continuous check (unclipped ~ sqrt(T))
  if (!approx(nwContinuous(DIP.Tc), 291.24, 0.5)) throw new Error('imp-96452: continuous window count drifted');
  // conservative-quoting context: anti-correlation raises the effective count well above n_w
  if (!approx(nEff, 794.8, 1)) throw new Error('imp-96452: n_eff drifted from imp-96128 ~795');
  if (!(zEffNaive > zCurrent)) throw new Error('imp-96452: correlation model must raise (not lower) the naive z');
  // honesty gates
  if (!/NO QED/.test(IMP96452_EXCURSION_CONFIDENCE_2SIGMA_REACH.verdict))
    throw new Error('imp-96452: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96452_EXCURSION_CONFIDENCE_2SIGMA_REACH.verdict))
    throw new Error('imp-96452: verdict dropped the no-refereed-bound-change banner');
  if (!(/RH open/.test(IMP96452_HONEST_BANNER) && /PT Lambda <= 0\.2|refereed bound is changed/.test(IMP96452_HONEST_BANNER) && /NO QED/.test(IMP96452_HONEST_BANNER)))
    throw new Error('imp-96452: IMP96452_HONEST_BANNER missing RH-open / PT-Lambda / NO-QED markers');
})();

export default IMP96452_EXCURSION_CONFIDENCE_2SIGMA_REACH;
