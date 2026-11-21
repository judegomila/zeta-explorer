/**
 * @module imp-96594-vasyunin-lammax-pre-asymptotic-reach
 *
 * imp-96594 (numerical, MEASUREMENT ONLY -- NO QED): put a concrete number on the
 * "astronomically large N" that imp-96562 FINDING 3 asserts only qualitatively.
 *
 * imp-96562 FINDING 3 measured the normalized Vasyunin edge ratio lam_max / log N
 * falling 0.8929 (N=250) -> 0.6968 (N=6000) toward its conjectured asymptotic slope
 * 0.3526, and lam_max / trace behaving the same way, both still ~2x their limits at
 * the top accessible rung. It attributed this to the pre-asymptotic INTERCEPT
 * a = 3.0247 dominating the log term in the imp-96443 fit
 *
 *     lam_max(N)  ~  b log N + a,   b = 0.3526,  a = 3.0247   (natural log),
 *
 * and concluded 0.3526 survives "only as a fitted slope until N is astronomically
 * large." This ticket quantifies that reach.
 *
 * ---------------------------------------------------------------------------------
 * METHOD (closed form, reproducible).
 * ---------------------------------------------------------------------------------
 * Under the fitted form the normalized ratio is
 *
 *     r(N) = lam_max(N) / log N = b + a / log N,
 *
 * a monotone decrease from +infinity toward the slope b as N grows. "Within a
 * relative fraction p of the target b" means r(N) <= (1 + p) b, i.e.
 *
 *     a / log N <= p b   <=>   log N >= a / (p b)   <=>   N >= exp( a / (p b) ).
 *
 * The reach is therefore an explicit function of p with NO free parameters beyond
 * the published (a, b). Sanity check against imp-96562: r(250) = 0.9004 and
 * r(6000) = 0.7003 from the fit (the raw measured 0.8929 / 0.6968 differ only by
 * the fit residual), reproducing the "still ~2x the 0.3526 limit" observation.
 *
 * ---------------------------------------------------------------------------------
 * FINDING -- the pre-asymptotic reach is genuinely astronomical, and unreachable.
 * ---------------------------------------------------------------------------------
 *   10% reach:  log N >= 85.7828  =>  N >= 1.799e37  (10^37.255).
 *    1% reach:  log N >= 857.828  =>  N >= 3.546e372 (10^372.550).
 *
 * The imp-96352 verified compute ceiling is N = 9916, where r = 0.6813, still
 * 93.2% ABOVE the 0.3526 target. The 10% reach exceeds that ceiling by a factor
 * 10^33.26; the 1% reach (10^372) dwarfs the ~10^80 atoms in the observable
 * universe by nearly 300 orders of magnitude. So no direct finite-N Gram
 * computation can ever bring lam_max / log N near its conjectured slope: the claim
 * 0.3526 is and will remain a FITTED extrapolation, exactly as imp-96562 FINDING 3
 * asserted -- now with a hard number, 10^37 (10%) / 10^372 (1%), on "astronomical."
 *
 * This does NOT bound Lambda, prove the 0.3526 slope, or touch RH. It only converts
 * a qualitative reach statement into a reproducible closed-form threshold.
 * State of the art remains Platt-Trudgian Lambda <= 0.2; RH open.
 */

// Published imp-96443 fit coefficients (natural log), as used by imp-96562 FINDING 3.
export const IMP96594_SLOPE_B = 0.3526;
export const IMP96594_INTERCEPT_A = 3.0247;

// imp-96352 verified compute ceiling for the Vasyunin Gram spectrum.
export const IMP96594_COMPUTE_CEILING_N = 9916;

// r(N) = b + a / ln N  (fitted normalized edge ratio).
export function imp96594Ratio(N) {
  return IMP96594_SLOPE_B + IMP96594_INTERCEPT_A / Math.log(N);
}

// Relative fraction above the slope target b: (r(N)/b - 1).
export function imp96594FractionAboveTarget(N) {
  return imp96594Ratio(N) / IMP96594_SLOPE_B - 1;
}

// Smallest N with r(N) within relative fraction p of b: N = exp( a / (p*b) ).
export function imp96594ReachN(p) {
  const lnN = IMP96594_INTERCEPT_A / (p * IMP96594_SLOPE_B);
  return { lnN, log10N: lnN / Math.LN10 };
}

const reach10 = imp96594ReachN(0.1);
const reach01 = imp96594ReachN(0.01);

export const IMP96594_REACH = {
  within10pct: { lnN: reach10.lnN, log10N: reach10.log10N }, // ln N >= 85.7828, N >= 10^37.255
  within1pct: { lnN: reach01.lnN, log10N: reach01.log10N }, //  ln N >= 857.828, N >= 10^372.550
};

// Reproducibility rows: the fitted ratio at imp-96562 rungs plus the compute ceiling.
export const IMP96594_ROWS = [250, 6000, IMP96594_COMPUTE_CEILING_N].map((N) => ({
  N,
  ratio: imp96594Ratio(N),
  fractionAboveTarget: imp96594FractionAboveTarget(N),
}));

export const IMP96594_VERDICT = {
  measurementOnly: true,
  reach10pctLog10N: reach10.log10N, // 37.255
  reach1pctLog10N: reach01.log10N, //  372.550
  reachExceedsCeilingByLog10: reach10.log10N - Math.log10(IMP96594_COMPUTE_CEILING_N), // 33.26
  ceilingFractionAboveTarget: imp96594FractionAboveTarget(IMP96594_COMPUTE_CEILING_N), // 0.932
  boundMoved: false,
  slopeProven: false,
};

export const IMP96594_HONEST_BANNER =
  'imp-96594: MEASUREMENT ONLY, NO QED. Closed-form pre-asymptotic reach for the ' +
  'fitted Vasyunin lam_max = 0.3526 log N + 3.0247: lam_max/log N reaches within ' +
  '10% of 0.3526 only at N >= 10^37.26 and within 1% at N >= 10^372.55, both far ' +
  'beyond the imp-96352 compute ceiling N = 9916 (still 93.2% above target). The ' +
  '0.3526 slope stays a fitted extrapolation; no bound moved. No refereed bound is changed' +
  '; RH open.';

const IMP96594_ASSERTIONS = [
  {
    id: 'ratio-monotone-check',
    holds: () =>
      imp96594Ratio(250) > imp96594Ratio(6000) &&
      imp96594Ratio(6000) > imp96594Ratio(IMP96594_COMPUTE_CEILING_N) &&
      imp96594Ratio(IMP96594_COMPUTE_CEILING_N) > IMP96594_SLOPE_B,
    why: 'the fitted normalized ratio decreases monotonically toward the slope b but stays strictly above it at every finite rung.',
  },
  {
    id: 'reach-thresholds',
    holds: () =>
      Math.abs(IMP96594_REACH.within10pct.log10N - 37.254978) < 1e-3 &&
      Math.abs(IMP96594_REACH.within1pct.log10N - 372.549779) < 1e-3,
    why: 'the 10% and 1% reach thresholds reproduce N >= 10^37.255 and N >= 10^372.550 from the published (a, b).',
  },
  {
    id: 'ceiling-still-far',
    holds: () =>
      IMP96594_VERDICT.ceilingFractionAboveTarget > 0.9 &&
      IMP96594_VERDICT.reachExceedsCeilingByLog10 > 33,
    why: 'at the imp-96352 ceiling N = 9916 the ratio is still >90% above target, and the 10% reach exceeds the ceiling by >10^33.',
  },
  {
    id: 'no-qed-markers',
    holds: () =>
      IMP96594_VERDICT.measurementOnly === true &&
      IMP96594_VERDICT.boundMoved === false &&
      IMP96594_VERDICT.slopeProven === false &&
      /NO QED/.test(IMP96594_HONEST_BANNER) &&
      /Lambda <= 0.2|refereed bound is changed/.test(IMP96594_HONEST_BANNER) &&
      /RH open/.test(IMP96594_HONEST_BANNER),
    why: 'measurement-only honesty markers are present: no bound moved, slope not proven, SOTA and RH-open banners intact.',
  },
];

for (const a of IMP96594_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96594-vasyunin-lammax-pre-asymptotic-reach assertion failed: ${a.id}`,
    );
  }
}

export default {
  slopeB: IMP96594_SLOPE_B,
  interceptA: IMP96594_INTERCEPT_A,
  computeCeilingN: IMP96594_COMPUTE_CEILING_N,
  reach: IMP96594_REACH,
  rows: IMP96594_ROWS,
  verdict: IMP96594_VERDICT,
  banner: IMP96594_HONEST_BANNER,
};
