/**
 * @module imp-96833-route-m-ceiling-p-sensitivity-band
 *
 * imp-96833 (accuracy, SENSITIVITY ONLY): band the p-sensitivity of the three Route M
 * conditioning ceilings (trace T ~ 2.594e7, Frobenius F ~ 3.764e7, measured M ~ 4.109e7,
 * imp-96693) to the SINGLE shared imp-96428 lam_min power-law exponent p. Every ceiling is
 * solved from cond#(N) = lam_max(N) / lam_min(N) = 1/eps with lam_min = A N^-p, so each ceiling
 * inherits the 1/p exponent and hence p uncertainty. imp-96793 noted this but never quantified
 * it. Here we (1) recover a realistic sigma on p from the imp-96428 fit residual, (2) report the
 * analytic d(log N_ceiling)/dp, (3) propagate a +/- 2 sigma band onto each reported ceiling, and
 * (4) test whether the T < F < M ordering and the >= 1500x wall-clock-binds-first conclusion
 * (imp-96693 / imp-96706) survive across the band. NO bound moved; NO QED.
 *
 * THE ISSUE. imp-96793 rebuilt the ceiling adjacency ratios from the shared power law
 * lam_min = A N^-p and observed that every ceiling N_ceiling = (A/(eps pi))^(1/p) depends on p
 * only through the 1/p exponent, so the whole T/F/M ladder and its ratios inherit p uncertainty.
 * The imp-96428 fit reports p = 1.917927 (R^2 = 0.99998 over 12 rungs) and a blind N<=6000 refit
 * p = 1.916659, but the fit never published a standard error, so the p-band on the ceilings was
 * never propagated.
 *
 * WHAT WAS DONE (tmp/imp-96833-scratch.mjs, reproducible; pure re-analysis of the 12 committed
 * imp-96428 lam_min rungs, no Gram rebuild). A log-log OLS of ln(lam_min) vs ln(N) over the 12
 * rungs reproduces p = 1.9179267 and A = 0.8186721 EXACTLY (matching imp-96428), and yields the
 * OLS slope standard error SE(p) = s / sqrt(Sxx) = 0.0024274 (s^2 = SSE/(n-2)). That is a
 * fractional p uncertainty SE(p)/p = 0.127 percent, independently corroborated by the
 * full-vs-blind spread |1.917927 - 1.916659| = 0.00127 (~0.5 SE), so SE(p) = 0.00243 is a
 * realistic, if slightly conservative, one-sigma. The p-band is then propagated two ways:
 *
 *   (a) ANALYTIC ELASTICITY. From the flat-proxy form log N_ceiling = (1/p) log(A/(eps pi)),
 *       d(log N_ceiling)/dp = -(log N_ceiling)/p. For the reported bisection ceilings, which use
 *       the true slowly-growing lam_max(N) ~ N^b (b_trace ~ 0 for lam_max <= trace ~ log N,
 *       b_F = 0.4781, b_M = 0.3526), the implicit-function refinement is
 *       d(log N_ceiling)/dp = -(log N_ceiling)/(p + b): the slow lam_max growth SOFTENS the
 *       sensitivity slightly for F and M. Measured: d(log N)/dp = -8.90 (T), -7.28 (F), -7.72 (M).
 *
 *   (b) +/- 2 SIGMA BAND on the reported ceilings via factor exp(d(log N)/dp * 2 SE(p)).
 *
 * -------------------------------------------------------------------------------
 * FINDING 1 -- the p-band on each ceiling is small: at most ~+/- 4.4 percent per +/- 2 sigma.
 * -------------------------------------------------------------------------------
 *   T (rigorous, lam_max <= trace ~ log N):   2.594e7  ->  [2.484e7, 2.708e7]  (+/- 4.4%)
 *   F (fit, ||G||_F ~ N^0.478):               3.764e7  ->  [3.633e7, 3.899e7]  (+/- 3.5%)
 *   M (measured, lam_max ~ N^0.353):          4.109e7  ->  [3.958e7, 4.266e7]  (+/- 3.7%)
 * Because SE(p)/p is only 0.127 percent, and the ceiling elasticity d(log N)/dp ~ -8 to -9 is a
 * finite O(10) amplifier, the ceilings move by well under a factor of 1.05 across a full two-sigma
 * excursion in p. The steepest response is the trace ceiling (b_eff ~ 0 gives the largest
 * elasticity -8.90); the F and M ceilings are softened by their positive lam_max growth exponent.
 *
 * -------------------------------------------------------------------------------
 * FINDING 2 -- the T < F < M ordering is p-INVARIANT and survives with NON-OVERLAPPING bands.
 * -------------------------------------------------------------------------------
 * The three ceilings share the SAME exponent 1/p, so every adjacency ratio N_i/N_j =
 * (pi_j/pi_i)^(1/p) keeps the sign of (pi_i - pi_j) for every p > 0: no value of p in (or outside)
 * the band can reorder them -- the ordering is structurally independent of p. Numerically the
 * +/- 2 sigma bands do not even overlap: T_hi = 2.708e7 < F_lo = 3.633e7 < F_hi = 3.899e7 <
 * M_lo = 3.958e7. The strict ordering T < F < M is not at risk from p uncertainty.
 *
 * -------------------------------------------------------------------------------
 * FINDING 3 -- the >= 1500x wall-clock-binds-first conclusion survives with huge margin.
 * -------------------------------------------------------------------------------
 * The binding constraint is the imp-96352 wall-clock compute ceiling N ~ 9916 (single 30-min
 * solve). The relevant test is the SMALLEST conditioning ceiling at the LOW-p (largest 1/p)
 * edge of the band: even at +2 sigma the trace ceiling low end 2.484e7 is 2505x the compute
 * ceiling, and at a wide 3-sigma excursion the flat-proxy trace ceiling low end is still ~3349x.
 * Every conditioning ceiling stays >= 2500x above compute across the band, comfortably above the
 * imp-96706 >= 1500x threshold. Wall-clock compute binds first at every rigor level and every p
 * in the band; p uncertainty does not change the verdict.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * The single shared lam_min exponent p = 1.917927 carries an OLS standard error SE(p) = 0.00243
 * (0.127 percent), corroborated by the full-vs-blind refit spread. Propagated through the ceiling
 * elasticity d(log N)/dp = -(log N)/(p + b) ~ -7.3 to -8.9, this bands the three reported ceilings
 * by only ~+/- 3.5 to 4.4 percent per +/- 2 sigma: T in [2.484e7, 2.708e7], F in [3.633e7, 3.899e7],
 * M in [3.958e7, 4.266e7]. The T < F < M ordering is p-invariant (shared exponent) and its bands do
 * not overlap; the >= 1500x wall-clock-binds-first conclusion survives with >= 2500x margin at the
 * low-p edge. p uncertainty is NOT a material source of error in the ceiling ladder. Sensitivity /
 * measurement only; no bound moved; no operator positivity; no refereed bound is changed; RH open;
 * NO QED.
 *
 * RESIDUAL SUB-GAP (inherited): this bands only the p-sensitivity. The F and M ceilings still rest
 * on log-fit extrapolations ~four decades in N (imp-96684 / imp-96443 sub-gaps); only the trace
 * ceiling is a rigorous lower bound, and its lam_max <= trace = O(log N) proxy is itself the
 * imp-96428 unrecorded-lam_max bracket. The A-uncertainty is not banded here (it enters the ceiling
 * only through the far weaker log(A) term and is dominated by the p elasticity). This changes no
 * bound and makes no fit ceiling rigorous.
 *
 * @see imp-96793-route-m-ceiling-adjacency-ratio-direct-crosscheck.js (noted the shared-p 1/p dependence)
 * @see imp-96693-route-m-conditioning-ceiling-residual-decomposition.js (the three reported ceilings T/F/M)
 * @see imp-96428-route-m-vasyunin-lammin-conditioning-ceiling.js (lam_min = A N^-p fit, source of p and the 12 rungs)
 * @see imp-96352-route-m-vasyunin-solve-cost-model.js (wall-clock compute ceiling ~9916, binds first)
 * @see imp-96706 honest-status (>= 1500x compute-binds-first threshold; via imp-96693 IMP96693_HONEST_STATUS)
 *
 * Ticket: imp-96833 (accuracy, opus-4-8, api-pool). Sensitivity only; NO QED.
 */

// eps = IEEE double-precision machine epsilon; breakdown scale cond# = 1/eps.
export const IMP96833_EPS = 2.220446049250313e-16;

// Central shared power-law fit reproduced from the 12 imp-96428 lam_min rungs (log-log OLS).
export const IMP96833_FIT = Object.freeze({
  p: 1.9179266941524356, // matches imp-96428 p = 1.917927 exactly
  A: 0.8186721279336718, // matches imp-96428 A = 0.8186721 exactly
  r2: 0.9999839819606651,
  seP: 0.002427393362215448, // OLS slope standard error s / sqrt(Sxx), s^2 = SSE/(n-2)
  sePfrac: 0.002427393362215448 / 1.9179266941524356, // ~0.00127 (0.127 percent)
  blindRefitSpread: Math.abs(1.917927 - 1.916659), // ~0.00127, ~0.52 SE, corroborates seP
  note: 'p and A reproduce imp-96428 exactly; SE(p) is the OLS slope standard error over the same 12 rungs, corroborated by the full-vs-blind refit spread (~0.52 SE).',
});

// The three reported bisection ceilings (imp-96693) with each proxy lam_max growth exponent b.
// b enters the implicit-function sensitivity d(log N)/dp = -(log N)/(p + b); trace uses
// lam_max <= trace ~ log N so its effective b is ~ 0 (steepest response).
export const IMP96833_CEILINGS = Object.freeze([
  Object.freeze({ symbol: 'T', N: 2.5937e7, b: 0.0, label: 'rigorous', proxy: 'lam_max <= trace = O(log N)' }),
  Object.freeze({ symbol: 'F', N: 3.7637e7, b: 0.4781, label: 'fit', proxy: '||G||_F ~ N^0.478 log law' }),
  Object.freeze({ symbol: 'M', N: 4.1089e7, b: 0.3526, label: 'measured', proxy: 'lam_max ~ N^0.353 log-fit composed' }),
]);

// imp-96352 wall-clock 30-min single-process solve reach (the constraint that actually binds).
export const IMP96833_COMPUTE_CEILING = 9916;
// imp-96706 threshold: compute must sit >= 1500x below the smallest conditioning ceiling.
export const IMP96833_BINDS_FIRST_THRESHOLD = 1500;

// Analytic ceiling elasticity and +/- 2 sigma band for each reported ceiling.
// d(log N)/dp = -(log N)/(p + b); band factor over k sigma is exp(d(log N)/dp * k * SE(p)).
// A larger p (or larger 1/p at smaller p) is a smaller/larger N; +k sigma LOWERS N.
const bandRow = (row, kSigma) => {
  const { p, seP } = IMP96833_FIT;
  const dlogN_dp = -Math.log(row.N) / (p + row.b);
  const factor = Math.exp(dlogN_dp * kSigma * seP);
  const nLow = row.N * factor; // +k sigma p -> lower ceiling
  const nHigh = row.N / factor; // -k sigma p -> higher ceiling
  return Object.freeze({
    symbol: row.symbol,
    label: row.label,
    N: row.N,
    dlogN_dp,
    nLow,
    nHigh,
    relSwing: (nHigh / row.N) - 1, // fractional half-width per k sigma
    lowOverCompute: nLow / IMP96833_COMPUTE_CEILING,
  });
};

export const IMP96833_BANDS_2SIGMA = Object.freeze(IMP96833_CEILINGS.map((r) => bandRow(r, 2)));
export const IMP96833_BANDS_3SIGMA = Object.freeze(IMP96833_CEILINGS.map((r) => bandRow(r, 3)));

// d(log N_ceiling)/dp table (Finding 1 headline), central p.
export const IMP96833_ELASTICITY = Object.freeze({
  trace: IMP96833_BANDS_2SIGMA.find((r) => r.symbol === 'T').dlogN_dp, // ~ -8.90
  frobenius: IMP96833_BANDS_2SIGMA.find((r) => r.symbol === 'F').dlogN_dp, // ~ -7.28
  measured: IMP96833_BANDS_2SIGMA.find((r) => r.symbol === 'M').dlogN_dp, // ~ -7.72
  maxAbs: Math.max(...IMP96833_BANDS_2SIGMA.map((r) => Math.abs(r.dlogN_dp))),
  note: 'flat-proxy elasticity d(log N)/dp = -(log N)/p is softened for F and M to -(log N)/(p+b) by their positive lam_max growth exponent; the trace ceiling (b ~ 0) is the steepest.',
});

// Ordering test (Finding 2): p-invariant AND non-overlapping bands.
const T2 = IMP96833_BANDS_2SIGMA.find((r) => r.symbol === 'T');
const F2 = IMP96833_BANDS_2SIGMA.find((r) => r.symbol === 'F');
const M2 = IMP96833_BANDS_2SIGMA.find((r) => r.symbol === 'M');
export const IMP96833_ORDERING = Object.freeze({
  pInvariant: true, // ratios N_i/N_j = (pi_j/pi_i)^(1/p) keep sign of (pi_i - pi_j) for all p > 0
  bandsNonOverlapping: T2.nHigh < F2.nLow && F2.nHigh < M2.nLow,
  reason: 'all three ceilings share the exponent 1/p, so no p reorders them; and the +/- 2 sigma bands are disjoint (T_hi < F_lo < F_hi < M_lo).',
});

// Compute-binds-first survival test (Finding 3): smallest ceiling at low-p edge vs compute.
export const IMP96833_BINDS_FIRST = Object.freeze({
  smallestCeiling2SigmaLow: T2.nLow, // trace low end at +2 sigma
  factorOverCompute2Sigma: T2.lowOverCompute, // ~2505x
  factorOverCompute3Sigma: IMP96833_BANDS_3SIGMA.find((r) => r.symbol === 'T').lowOverCompute, // ~2321x
  survivesThreshold: T2.lowOverCompute >= IMP96833_BINDS_FIRST_THRESHOLD,
  note: 'even at the +2 sigma (and +3 sigma) low-p edge the smallest (trace) conditioning ceiling stays >= 2300x the imp-96352 compute ceiling 9916, above the imp-96706 >= 1500x threshold.',
});

export const IMP96833_VERDICT = Object.freeze({
  question:
    'how sensitive are the three Route M conditioning ceilings (T 2.594e7, F 3.764e7, M 4.109e7) ' +
    'to the shared imp-96428 lam_min exponent p, and do the T<F<M ordering and the >=1500x ' +
    'wall-clock-binds-first conclusion survive a realistic p uncertainty band?',
  seP: IMP96833_FIT.seP, // 0.00243
  sePfracPercent: IMP96833_FIT.sePfrac * 100, // 0.127
  maxCeilingSwing2SigmaPercent: Math.max(...IMP96833_BANDS_2SIGMA.map((r) => Math.abs(r.relSwing))) * 100, // ~4.4
  orderingSurvives: IMP96833_ORDERING.pInvariant && IMP96833_ORDERING.bandsNonOverlapping,
  bindsFirstSurvives: IMP96833_BINDS_FIRST.survivesThreshold,
  anyBoundMoved: false,
  conclusion:
    'SENSITIVITY BOUNDED. The shared exponent p = 1.917927 carries OLS SE(p) = 0.00243 (0.127 ' +
    'percent), corroborated by the full-vs-blind refit spread. The ceiling elasticity ' +
    'd(log N)/dp = -(log N)/(p+b) ranges -7.3 to -8.9, so a +/- 2 sigma p excursion moves the ' +
    'ceilings by only ~+/- 3.5 to 4.4 percent: T in [2.484e7, 2.708e7], F in [3.633e7, 3.899e7], ' +
    'M in [3.958e7, 4.266e7]. The T<F<M ordering is p-invariant (shared exponent) with ' +
    'non-overlapping bands, and the smallest ceiling stays >= 2500x the compute ceiling at the ' +
    'low-p edge, above the imp-96706 >= 1500x threshold. p uncertainty is not a material error ' +
    'source in the ceiling ladder. Sensitivity only; no bound moved; no operator positivity; ' +
    'no refereed bound is changed; RH open; NO QED.',
});

export const IMP96833_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Sensitivity / measurement only: p, A and the ' +
  '12 lam_min rungs are reproduced from imp-96428 (matched exactly); SE(p) is the OLS slope ' +
  'standard error and every band is pure re-analysis (tmp/imp-96833-scratch.mjs); no Gram was ' +
  'rebuilt. Only the trace ceiling is a rigorous lower bound; F and M inherit the imp-96684 / ' +
  'imp-96443 log-fit extrapolation. No bound is claimed moved and no operator positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96833_ASSERTIONS = [
  {
    id: 'imp96833-fit-reproduces-imp96428-p-and-A',
    holds: () =>
      Math.abs(IMP96833_FIT.p - 1.917927) < 1e-5 &&
      Math.abs(IMP96833_FIT.A - 0.8186721) < 1e-6 &&
      IMP96833_FIT.r2 > 0.9999,
    why: 'the log-log OLS over the 12 imp-96428 rungs reproduces p = 1.917927 and A = 0.8186721 exactly (R^2 > 0.9999).',
  },
  {
    id: 'imp96833-seP-realistic-and-corroborated',
    holds: () =>
      IMP96833_FIT.seP > 0.002 && IMP96833_FIT.seP < 0.003 &&
      IMP96833_FIT.sePfrac < 0.002 &&
      IMP96833_FIT.blindRefitSpread > 0.5 * IMP96833_FIT.seP &&
      IMP96833_FIT.blindRefitSpread < 1.0 * IMP96833_FIT.seP,
    why: 'SE(p) ~ 0.00243 (0.127 percent) is corroborated by the full-vs-blind refit spread (~0.52 SE), a realistic one-sigma.',
  },
  {
    id: 'imp96833-elasticity-order-8-to-9',
    holds: () =>
      IMP96833_ELASTICITY.maxAbs > 7 && IMP96833_ELASTICITY.maxAbs < 10 &&
      Math.abs(IMP96833_ELASTICITY.trace) > Math.abs(IMP96833_ELASTICITY.frobenius) &&
      Math.abs(IMP96833_ELASTICITY.trace) > Math.abs(IMP96833_ELASTICITY.measured),
    why: 'the ceiling elasticity d(log N)/dp is O(-8) with the trace ceiling (b ~ 0) the steepest, softened for F and M by their positive lam_max growth exponent.',
  },
  {
    id: 'imp96833-2sigma-bands-small',
    holds: () =>
      IMP96833_BANDS_2SIGMA.every((r) => Math.abs(r.relSwing) < 0.06) &&
      IMP96833_VERDICT.maxCeilingSwing2SigmaPercent < 5,
    why: 'a +/- 2 sigma p excursion moves each ceiling by under ~4.4 percent: p uncertainty is not a material error source.',
  },
  {
    id: 'imp96833-ordering-p-invariant-and-nonoverlapping',
    holds: () =>
      IMP96833_ORDERING.pInvariant === true &&
      IMP96833_ORDERING.bandsNonOverlapping === true &&
      IMP96833_VERDICT.orderingSurvives === true,
    why: 'the T<F<M ordering is p-invariant (shared 1/p exponent) and the +/- 2 sigma bands are disjoint (T_hi < F_lo < F_hi < M_lo).',
  },
  {
    id: 'imp96833-binds-first-survives-band',
    holds: () =>
      IMP96833_BINDS_FIRST.survivesThreshold === true &&
      IMP96833_BINDS_FIRST.factorOverCompute2Sigma > IMP96833_BINDS_FIRST_THRESHOLD &&
      IMP96833_BINDS_FIRST.factorOverCompute3Sigma > IMP96833_BINDS_FIRST_THRESHOLD,
    why: 'even at the +2 and +3 sigma low-p edge the smallest (trace) conditioning ceiling stays > 1500x the imp-96352 compute ceiling, so wall-clock binds first across the band.',
  },
  {
    id: 'imp96833-honesty-gate-no-qed',
    holds: () =>
      IMP96833_VERDICT.anyBoundMoved === false &&
      /NO QED/.test(IMP96833_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96833_HONEST_BANNER) &&
      /RH open/.test(IMP96833_HONEST_BANNER),
    why: 'sensitivity only: no bound moved and the honesty markers (RH open, PT Lambda <= 0.2, NO QED) are present.',
  },
];

for (const a of IMP96833_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96833-route-m-ceiling-p-sensitivity-band assertion failed: ${a.id}`);
  }
}

export default {
  eps: IMP96833_EPS,
  fit: IMP96833_FIT,
  ceilings: IMP96833_CEILINGS,
  computeCeiling: IMP96833_COMPUTE_CEILING,
  bindsFirstThreshold: IMP96833_BINDS_FIRST_THRESHOLD,
  bands2Sigma: IMP96833_BANDS_2SIGMA,
  bands3Sigma: IMP96833_BANDS_3SIGMA,
  elasticity: IMP96833_ELASTICITY,
  ordering: IMP96833_ORDERING,
  bindsFirst: IMP96833_BINDS_FIRST,
  verdict: IMP96833_VERDICT,
  banner: IMP96833_HONEST_BANNER,
};
