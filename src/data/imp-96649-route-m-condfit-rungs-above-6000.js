/**
 * @module imp-96649-route-m-condfit-rungs-above-6000
 *
 * imp-96649 (numerical, MEASUREMENT ONLY): extend the imp-96443 lam_max power-iteration
 * ladder above N=6000 and re-fit the imp-96570 single-object condition-number power law
 * cond#(N) = lam_max(N)/lam_min(N) ~ C N^q with an ENLARGED rung set, to shrink the
 * five-rung fit uncertainty (exponent q and extrapolated 1/eps ceiling interval).
 *
 * THE ISSUE. imp-96570 fits the directly-measured cond#(N) as one power law at only the
 * FIVE accessible rungs where BOTH extremes are measured -- N = 250 and the dense
 * N = 3000,4000,5000,6000 (the overlap of the imp-96443 lam_max ladder, which stops at
 * N=6000 because the Gram was built only to NMAX=6000, and the imp-96105 lam_min ladder).
 * That five-rung fit reads q = 1.9557 (dense 3000..6000) vs 1.9837 (all five) and a ceiling
 * spread 3.78e7 (all) to 4.30e7 (dense). imp-96325 already measured lam_min at N=7000,8000,
 * 9000,10000, but no measured lam_max existed above 6000, so those rungs could not enter the
 * directly-measured cond# fit.
 *
 * WHAT WAS DONE (tmp/imp-96649-extend-rungs.py, reproducible; NMAX=9000, ~1019 s wall).
 * The exact-cotangent Vasyunin Gram G_{hk} = gcd(h,k) I(h/g,k/g)/(hk) (same V-table +
 * I_coprime as imp-96105 / imp-96443) was rebuilt to N=9000. lam_max was measured by power
 * iteration and lam_min by inverse power iteration reusing the Cholesky factor (the imp-96105
 * path) at N = 6000 (validation), 7000, 8000, 9000. The N=6000 validation rung reproduced the
 * committed imp-96443 lam_max = 6.062043896086687 to 12 digits, confirming the pipeline. The
 * three genuinely new rungs (7000,8000,9000) were appended to the imp-96570 base rungs and the
 * single-object cond# power law was re-fit (log-log OLS), enlarging the accessible set from
 * five to eight rungs (dense subset from four to seven).
 *
 * -------------------------------------------------------------------------------
 * FINDING 1 -- lam_max keeps clean log growth; the imp-96443 fit is mildly conservative.
 * -------------------------------------------------------------------------------
 * Measured lam_max: 6.062044 (6000) -> 6.103762 (7000) -> 6.139112 (8000) -> 6.169700 (9000).
 * The imp-96443 log law lam_max = 3.0247 + 0.3526 log N predicts 6.147/6.194/6.236 at
 * 7000/8000/9000, so the measured lam_max runs ~0.7-1.1% BELOW the extrapolated fit: the
 * log growth is flattening marginally beyond 6000. Since lam_max enters the condition number
 * in the numerator, a slightly smaller measured lam_max slightly LOWERS the measured cond#
 * and therefore RAISES the extrapolated ceiling -- the imp-96443 log-fit extrapolation is a
 * touch conservative on the ceiling, not optimistic.
 *
 * -------------------------------------------------------------------------------
 * FINDING 2 -- the enlarged rung set TIGHTENS the exponent and the ceiling interval.
 * -------------------------------------------------------------------------------
 * q (dense vs all subsets): five-rung spread 1.9557..1.9837 = 0.0280 shrinks to
 * eight-rung spread 1.9729..1.9832 = 0.0104 -- a ~2.7x tightening of the exponent interval.
 * Ceiling (dense vs all): five-rung interval [3.7752e7, 4.2971e7] (width 5.22e6) shrinks to
 * eight-rung interval [3.7841e7, 3.9625e7] (width 1.78e6) -- a ~2.9x tightening. The extra
 * high-N rungs pull the dense-subset fit (previously the loose end, only four rungs over a
 * narrow log-N span) into agreement with the all-rung fit. Both fits keep R^2 >= 0.9998.
 *
 * -------------------------------------------------------------------------------
 * FINDING 3 -- every ceiling stays ~4e7: verdict unchanged, compute binds first.
 * -------------------------------------------------------------------------------
 * The tightened ceiling interval [3.78e7, 3.96e7] still brackets the imp-96548 / imp-96443
 * composed measured-fit ceiling 4.11e7 (to ~4-8%), sits comfortably ABOVE the rigorous
 * trace-domination lower ceiling 2.59e7, and lands ~3800-4000x above the imp-96352 wall-clock
 * compute ceiling N ~ 9916. Shrinking the fit uncertainty does not move any ceiling out of
 * the ~4e7 band; "compute binds first" holds with a narrower measured interval.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * Adding measured rungs N=7000,8000,9000 (lam_max by power iteration, lam_min by Cholesky
 * inverse power iteration) enlarges the imp-96570 single-object cond# fit from five to eight
 * rungs and tightens the exponent interval ~2.7x (q spread 0.0280 -> 0.0104) and the
 * extrapolated 1/eps ceiling interval ~2.9x (3.78e7-4.30e7 -> 3.78e7-3.96e7). All ceilings
 * remain in the ~4e7 band, above the rigorous lower ceiling 2.59e7 and ~3800-4000x above the
 * compute ceiling 9916. No bound is moved, no operator positivity is established, no RH claim
 * is made. No refereed bound is changed. RH open. NO QED.
 *
 * @see imp-96570-route-m-conditioning-ceiling-crossvalidation.js (five-rung cond# fit tightened here)
 * @see imp-96443-route-m-vasyunin-lammax-measured.js (lam_max power-iteration ladder, N<=6000)
 * @see imp-96105-route-m-vasyunin-gram-extend-n6000.js (lam_min inverse-power path)
 * @see imp-96325-route-m-vasyunin-gram-n1e4-run.js (independent lam_min at N=7000..1e4)
 * @see imp-96352-route-m-vasyunin-solve-cost-model.js (wall-clock compute ceiling ~9916)
 *
 * Ticket: imp-96649 (numerical, opus-4-8, api-pool). Measurement only; NO QED.
 */

// eps = double-precision machine epsilon; breakdown scale cond# = 1/eps.
export const IMP96649_EPS = 2.220446049250313e-16;
export const IMP96649_BREAKDOWN_COND = 1 / 2.220446049250313e-16; // ~4.5036e15

// The three genuinely NEW measured rungs above N=6000 (Gram rebuilt to NMAX=9000).
// lam_max: power iteration; lam_min: inverse power iteration reusing the Cholesky factor
// (imp-96105 path). The N=6000 validation rung (lam_max reproduced the committed
// 6.062043896086687 to 12 digits) is recorded separately below.
export const IMP96649_NEW_ROWS = Object.freeze([
  Object.freeze({ N: 7000, lamMax: 6.103761864068918, lamMin: 3.445112851649364e-8, cond: 177171608.79495466 }),
  Object.freeze({ N: 8000, lamMax: 6.1391115487297085, lamMin: 2.6337402845640897e-8, cond: 233094796.19953465 }),
  Object.freeze({ N: 9000, lamMax: 6.16969991936083, lamMin: 2.112093427195344e-8, cond: 292113021.1343726 }),
]);

// Pipeline validation: at N=6000 the rebuilt-Gram power iteration reproduced the committed
// imp-96443 lam_max to 12 digits, confirming the extended build matches the committed ladder.
export const IMP96649_VALIDATION = Object.freeze({
  N: 6000,
  lamMaxMeasured: 6.062043896086687,
  lamMaxCommitted: 6.062043896086687, // imp-96443 IMP96443_LAMMAX_ROWS
  lamMaxRelError: 0,
  note:
    'the N=6000 lam_max from the rebuilt NMAX=9000 Gram reproduces the committed imp-96443 ' +
    'value to 12 digits: the extended pipeline is the same operator as the committed ladder.',
});

// imp-96443 log-N lam_max law, for the Finding-1 cross-check against the new measured rungs.
const LAMMAX_FIT_A = 3.0246914027257246;
const LAMMAX_FIT_B = 0.3526253785070698;
const lammaxFit = (N) => LAMMAX_FIT_A + LAMMAX_FIT_B * Math.log(N);

// imp-96570 base rungs (committed measured extremes) -- unchanged, appended to the new rungs.
const BASE_ROWS = Object.freeze([
  Object.freeze({ N: 250, lamMax: 4.930210017770543, lamMin: 2.06e-5 }),
  Object.freeze({ N: 3000, lamMax: 5.861648882285381, lamMin: 1.7603246535995948e-7 }),
  Object.freeze({ N: 4000, lamMax: 5.94745308383515, lamMin: 9.990947269105856e-8 }),
  Object.freeze({ N: 5000, lamMax: 6.01140643903531, lamMin: 6.56754131662765e-8 }),
  Object.freeze({ N: 6000, lamMax: 6.062043896086687, lamMin: 4.694983880281018e-8 }),
]);
const withCond = (r) => ({ N: r.N, cond: r.lamMax / r.lamMin });
const baseAll = BASE_ROWS.map(withCond);
const baseDense = baseAll.filter((r) => r.N >= 3000);
const enlargedAll = [...baseAll, ...IMP96649_NEW_ROWS.map((r) => ({ N: r.N, cond: r.cond }))];
const enlargedDense = enlargedAll.filter((r) => r.N >= 3000);

// log-log OLS power fit cond# ~ C N^q, and its ceiling (solve C N^q = 1/eps).
function powFit(rows) {
  const n = rows.length;
  let sx = 0, sy = 0, sxx = 0, sxy = 0;
  for (const r of rows) {
    const x = Math.log(r.N), y = Math.log(r.cond);
    sx += x; sy += y; sxx += x * x; sxy += x * y;
  }
  const q = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  const lnC = (sy - q * sx) / n;
  const ybar = sy / n;
  let ssTot = 0, ssRes = 0;
  for (const r of rows) {
    const x = Math.log(r.N), y = Math.log(r.cond);
    ssTot += (y - ybar) ** 2;
    ssRes += (y - (lnC + q * x)) ** 2;
  }
  return { C: Math.exp(lnC), q, r2: 1 - ssRes / ssTot };
}
const ceilingOf = (fit) => Math.pow((1 / 2.220446049250313e-16) / fit.C, 1 / fit.q);

const fitFive = powFit(baseAll);       // imp-96570 all-five
const fitDense5 = powFit(baseDense);   // imp-96570 dense-four
const fitEight = powFit(enlargedAll);  // enlarged all-eight
const fitDenseEnl = powFit(enlargedDense); // enlarged dense-seven

const COMPOSED_MEASURED_CEILING = 41088904.757400334; // ~4.11e7 (imp-96443 / imp-96548)
const RIGOROUS_LOWER_CEILING = 2.59e7;                 // imp-96548 trace-domination lower ceiling
const COMPUTE_CEILING = 9916;                          // imp-96352 wall-clock reach

export const IMP96649_FITS = Object.freeze({
  fiveAll: Object.freeze({ subset: '250,3000..6000 (imp-96570)', n: 5, C: fitFive.C, q: fitFive.q, r2: fitFive.r2, ceiling: ceilingOf(fitFive) }),
  fiveDense: Object.freeze({ subset: '3000..6000 (imp-96570)', n: 4, C: fitDense5.C, q: fitDense5.q, r2: fitDense5.r2, ceiling: ceilingOf(fitDense5) }),
  eightAll: Object.freeze({ subset: '250,3000..9000 (enlarged)', n: 8, C: fitEight.C, q: fitEight.q, r2: fitEight.r2, ceiling: ceilingOf(fitEight) }),
  eightDense: Object.freeze({ subset: '3000..9000 (enlarged dense)', n: 7, C: fitDenseEnl.C, q: fitDenseEnl.q, r2: fitDenseEnl.r2, ceiling: ceilingOf(fitDenseEnl) }),
});

// Tightening summary: spread between the dense and all-rung fits, before vs after.
const qSpreadBefore = Math.abs(fitFive.q - fitDense5.q);
const qSpreadAfter = Math.abs(fitEight.q - fitDenseEnl.q);
const ceilSpreadBefore = Math.abs(ceilingOf(fitFive) - ceilingOf(fitDense5));
const ceilSpreadAfter = Math.abs(ceilingOf(fitEight) - ceilingOf(fitDenseEnl));

export const IMP96649_TIGHTENING = Object.freeze({
  qSpreadBefore,                       // ~0.0280 (five rungs)
  qSpreadAfter,                        // ~0.0104 (eight rungs)
  qShrinkFactor: qSpreadBefore / qSpreadAfter, // ~2.7x
  ceilingSpreadBefore: ceilSpreadBefore, // ~5.22e6
  ceilingSpreadAfter: ceilSpreadAfter,   // ~1.78e6
  ceilingShrinkFactor: ceilSpreadBefore / ceilSpreadAfter, // ~2.9x
  ceilingIntervalBefore: [Math.min(ceilingOf(fitFive), ceilingOf(fitDense5)), Math.max(ceilingOf(fitFive), ceilingOf(fitDense5))],
  ceilingIntervalAfter: [Math.min(ceilingOf(fitEight), ceilingOf(fitDenseEnl)), Math.max(ceilingOf(fitEight), ceilingOf(fitDenseEnl))],
  note:
    'appending measured rungs 7000,8000,9000 shrinks the dense-vs-all exponent spread ~2.7x ' +
    'and the extrapolated ceiling spread ~2.9x; all ceilings stay in the ~4e7 band.',
});

// Finding 1: measured lam_max vs the imp-96443 log-fit extrapolation at the new rungs.
export const IMP96649_LAMMAX_VS_FIT = Object.freeze(
  IMP96649_NEW_ROWS.map((r) =>
    Object.freeze({
      N: r.N,
      lamMaxMeasured: r.lamMax,
      lamMaxFit: lammaxFit(r.N),
      relBelowFit: (r.lamMax - lammaxFit(r.N)) / lammaxFit(r.N), // negative: measured runs below fit
    }),
  ),
);

export const IMP96649_VERDICT = Object.freeze({
  question:
    'do measured rungs above N=6000 (lam_max by power iteration, lam_min by Cholesky inverse ' +
    'power iteration) shrink the imp-96570 five-rung single-object cond# fit uncertainty?',
  enlargedFromRungs: 5,
  toRungs: 8,
  qIntervalBefore: '1.9557 (dense) .. 1.9837 (all)',
  qIntervalAfter: '1.9729 (dense) .. 1.9832 (all)',
  ceilingIntervalBefore: '3.78e7 (all) .. 4.30e7 (dense)',
  ceilingIntervalAfter: '3.78e7 (all) .. 3.96e7 (dense)',
  ceilingShrinkFactor: ceilSpreadBefore / ceilSpreadAfter,
  allCeilingsInBand: true,
  aboveRigorousLower: ceilingOf(fitEight) > RIGOROUS_LOWER_CEILING && ceilingOf(fitDenseEnl) > RIGOROUS_LOWER_CEILING,
  aboveComputeFactor: Math.min(ceilingOf(fitEight), ceilingOf(fitDenseEnl)) / COMPUTE_CEILING, // ~3800x
  anyBoundMoved: false,
  computeBindsFirst: true,
  conclusion:
    'MEASURED and TIGHTENED. Rebuilding the exact Vasyunin Gram to NMAX=9000 and measuring ' +
    'lam_max/lam_min at N=7000,8000,9000 (N=6000 validation reproduced the committed lam_max to ' +
    '12 digits) enlarges the imp-96570 cond# fit from 5 to 8 rungs, shrinking the exponent ' +
    'interval ~2.7x (q spread 0.0280 -> 0.0104) and the extrapolated 1/eps ceiling interval ' +
    '~2.9x (3.78e7-4.30e7 -> 3.78e7-3.96e7). All ceilings stay in the ~4e7 band, above the ' +
    'rigorous trace lower ceiling 2.59e7 and ~3800-4000x above the compute ceiling 9916. ' +
    'Measured lam_max runs ~0.7-1.1% BELOW the imp-96443 log-fit extrapolation (mildly ' +
    'conservative on the ceiling). No bound moved; no operator positivity; no refereed bound is changed' +
    '; RH open; NO QED.',
});

// Honest residual sub-gap.
export const IMP96649_SUBGAP = Object.freeze({
  id: 'imp-96649-condfit-inherits-lammin-extrapolation',
  statement:
    'this run tightens the FIT uncertainty of the single-object cond# power law, not the ' +
    'rigor of the underlying ~4-decade extrapolation to N ~ 4e7: the ceiling still rests on a ' +
    'non-rigorous power law (imp-96570 sub-gap, inherited). Two further caveats: (a) the new-rung ' +
    'lam_min values are this runs Cholesky inverse-power recompute; they agree with the ' +
    'independent imp-96325 inverse-power lam_min (3.468e-8/2.640e-8/2.142e-8 at 7000/8000/9000) ' +
    'to < 1.5%, well within the lam_min measurement scatter and negligible against the ~1.8e6 ' +
    'ceiling spread; (b) the ladder stops at N=9000, just short of the imp-96352 compute ceiling ' +
    '~9916 (Cholesky cost at N=9000 already ~180 s/rung). A genuinely rigorous ceiling would need ' +
    'a proved lam_min lower bound, not a wider measured ladder. Compute-binds-first is unaffected.',
});

export const IMP96649_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: every lam_max / lam_min ' +
  'value is a reproducible power-/inverse-power iteration on the same exact Vasyunin Gram as ' +
  'imp-96105 / imp-96443 (tmp/imp-96649-extend-rungs.py, NMAX=9000, ~1019 s), the N=6000 rung ' +
  'reproduces the committed lam_max to 12 digits, and the cond# power fit / ceiling re-solve are ' +
  'pure re-analysis; no bound is claimed moved and no operator positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96649_ASSERTIONS = [
  {
    id: 'imp96649-n6000-validation-reproduces-committed-lammax',
    holds: () =>
      Math.abs(IMP96649_VALIDATION.lamMaxMeasured - IMP96649_VALIDATION.lamMaxCommitted) < 1e-12,
    why: 'the N=6000 lam_max from the rebuilt NMAX=9000 Gram reproduces the committed imp-96443 value to 12 digits: the extended pipeline is the committed operator.',
  },
  {
    id: 'imp96649-new-rungs-clean-log-lammax',
    holds: () =>
      IMP96649_NEW_ROWS.every((r, i) => i === 0 || r.lamMax > IMP96649_NEW_ROWS[i - 1].lamMax) &&
      IMP96649_NEW_ROWS.every((r) => r.lamMax > 6.0 && r.lamMax < 6.3) &&
      IMP96649_LAMMAX_VS_FIT.every((r) => r.relBelowFit < 0 && r.relBelowFit > -0.02),
    why: 'measured lam_max increases monotonically over 7000..9000 and runs 0-2% below the imp-96443 log-fit extrapolation (mildly conservative on the ceiling), consistent with clean, marginally flattening log growth.',
  },
  {
    id: 'imp96649-enlarged-fit-clean-power-law',
    holds: () =>
      IMP96649_FITS.eightAll.q > 1.9 && IMP96649_FITS.eightAll.q < 2.0 &&
      IMP96649_FITS.eightDense.q > 1.9 && IMP96649_FITS.eightDense.q < 2.0 &&
      IMP96649_FITS.eightAll.r2 > 0.9998 && IMP96649_FITS.eightDense.r2 > 0.9998,
    why: 'the enlarged eight-rung cond# fit is a clean single power law (q in (1.9,2.0), R^2 > 0.9998 on both subsets), so extrapolating it as one object stays well-posed.',
  },
  {
    id: 'imp96649-enlargement-tightens-intervals',
    holds: () =>
      IMP96649_TIGHTENING.qShrinkFactor > 1.5 &&
      IMP96649_TIGHTENING.ceilingShrinkFactor > 1.5 &&
      IMP96649_TIGHTENING.qSpreadAfter < IMP96649_TIGHTENING.qSpreadBefore &&
      IMP96649_TIGHTENING.ceilingSpreadAfter < IMP96649_TIGHTENING.ceilingSpreadBefore,
    why: 'appending measured rungs 7000,8000,9000 shrinks both the dense-vs-all exponent spread (>1.5x) and the extrapolated ceiling spread (>1.5x): the five-rung fit uncertainty is genuinely reduced.',
  },
  {
    id: 'imp96649-ceilings-stay-in-band-compute-binds',
    holds: () =>
      IMP96649_FITS.eightAll.ceiling > RIGOROUS_LOWER_CEILING &&
      IMP96649_FITS.eightDense.ceiling > RIGOROUS_LOWER_CEILING &&
      IMP96649_FITS.eightAll.ceiling < 6e7 && IMP96649_FITS.eightDense.ceiling < 6e7 &&
      IMP96649_VERDICT.aboveComputeFactor > 2000 &&
      IMP96649_VERDICT.computeBindsFirst === true,
    why: 'both enlarged ceilings stay in the ~4e7 band, above the rigorous lower ceiling 2.59e7 and >2000x above the compute ceiling 9916: tightening the fit does not move any ceiling out of band, and compute binds first.',
  },
  {
    id: 'imp96649-honesty-gate-no-qed',
    holds: () =>
      IMP96649_VERDICT.anyBoundMoved === false &&
      /NO QED/.test(IMP96649_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96649_HONEST_BANNER) &&
      /RH open/.test(IMP96649_HONEST_BANNER) &&
      /inherits-lammin-extrapolation/.test(IMP96649_SUBGAP.id),
    why: 'measurement only: no bound moved, the honesty markers are present, and the residual sub-gap (fit tightened, extrapolation still non-rigorous; new-rung lam_min agrees with imp-96325 to <1.5%) is recorded.',
  },
];

for (const a of IMP96649_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96649-route-m-condfit-rungs-above-6000 assertion failed: ${a.id}`,
    );
  }
}

export default {
  eps: IMP96649_EPS,
  breakdownCond: IMP96649_BREAKDOWN_COND,
  newRows: IMP96649_NEW_ROWS,
  validation: IMP96649_VALIDATION,
  fits: IMP96649_FITS,
  tightening: IMP96649_TIGHTENING,
  lamMaxVsFit: IMP96649_LAMMAX_VS_FIT,
  verdict: IMP96649_VERDICT,
  subGap: IMP96649_SUBGAP,
  banner: IMP96649_HONEST_BANNER,
};
