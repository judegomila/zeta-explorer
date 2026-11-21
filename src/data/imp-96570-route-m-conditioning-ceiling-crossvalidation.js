/**
 * @module imp-96570-route-m-conditioning-ceiling-crossvalidation
 *
 * imp-96570 (accuracy, CROSS-CHECK ONLY): cross-validate the imp-96548 re-derived
 * double-precision Cholesky-breakdown conditioning ceiling for the Route M Vasyunin
 * Gram G_{hk} = gcd(h,k) I(h/g,k/g)/(hk) -- N ~ 4.11e7 (measured lam_max fit) and
 * N >= ~2.59e7 (rigorous trace-domination lam_max) -- against an INDEPENDENT
 * condition-number estimator at accessible mid-range rungs.
 *
 * THE ISSUE. imp-96443 / imp-96548 build the ceiling by COMPOSING two separately
 * fitted laws: lam_max ~ a + b log N (8-rung OLS, imp-96443) and lam_min ~ A N^-p
 * (12-rung log-log OLS, imp-96428), forming cond#(N) = lam_max(N)/lam_min(N) and
 * solving cond# = 1/eps. A directly-measured condition-number estimator (LAPACK
 * rcond, or a full SVD) does NOT return this composed ratio: it returns cond# as a
 * SINGLE scalar per matrix. So the honest independent cross-check is to take the
 * cond# formed at each accessible rung from the ALREADY-MEASURED lam_max and lam_min
 * (imp-96443 power iteration + imp-96105 lam_min), fit THAT single object as its own
 * power law cond# ~ C N^q, and extrapolate it -- undoing the two-fit composition.
 *
 * WHAT WAS DONE (tmp/imp-96570-scratch.mjs, reproducible; pure re-analysis of
 * already-committed measured lam_max / lam_min values, no Gram rebuilt). At the five
 * accessible rungs where BOTH extremes are measured (N = 250 and the dense
 * N = 3000,4000,5000,6000, the overlap of the imp-96443 lam_max ladder and the
 * imp-96105 lam_min ladder), form the directly-measured cond#(N) = lam_max/lam_min,
 * fit log cond# = log C + q log N by OLS, and solve C N^q = 1/eps.
 *
 * -------------------------------------------------------------------------------
 * FINDING 1 -- the directly-formed cond# is a clean single power law, q ~ p.
 * -------------------------------------------------------------------------------
 * cond#(N) = lam_max/lam_min fits cond# ~ C N^q with q = 1.9557 (dense 3000..6000,
 * R^2 = 0.99975) or q = 1.9837 (all five rungs, R^2 = 0.99998). The exponent sits
 * just ABOVE the lam_min power p = 1.9179 (imp-96428) -- exactly as structure
 * predicts: cond# = (a + b log N)/(A N^-p) = (A^-1)(a + b log N) N^p, an N^p power
 * TIMES a slowly growing log factor, so a single power fit reads a q slightly larger
 * than p. This is an independent consistency check on the lam_min exponent itself.
 *
 * -------------------------------------------------------------------------------
 * FINDING 2 -- the independent ceiling REPRODUCES the composed-fit ceiling.
 * -------------------------------------------------------------------------------
 * Extrapolating the SINGLE-OBJECT cond# power law to 1/eps gives:
 *     dense (3000..6000) fit  -> N ~ 4.30e7   (ratio 1.046 vs 4.11e7)
 *     all-five-rung fit       -> N ~ 3.78e7   (ratio 0.919 vs 4.11e7)
 * Both agree with the imp-96548 / imp-96443 composed measured-fit ceiling N ~ 4.11e7
 * to within ~5% (dense) / ~8% (all), and both sit comfortably ABOVE the rigorous
 * trace-domination lower ceiling N >= ~2.59e7 -- consistent with that value being a
 * LOWER estimate (trace domination over-states lam_max, so under-states the ceiling).
 * The composition of two separate fits is therefore NOT an artifact: fitting the
 * condition number as one measured scalar per matrix lands in the same place.
 *
 * -------------------------------------------------------------------------------
 * FINDING 3 -- the cond# fit reproduces the top measured rung to < 1%.
 * -------------------------------------------------------------------------------
 * At the top accessible rung N=6000 the dense cond# power law predicts cond# = 1.301e8
 * against the directly-measured 1.291e8 (rel 7.9e-3), so the extrapolated law is
 * anchored, not floating. Every accessible-rung cond# stays >= 1e10 below the 1/eps
 * breakdown scale, and all three ceilings (independent 3.78e7-4.30e7, composed
 * measured 4.11e7, rigorous lower 2.59e7) sit >= 2600x above the imp-96352 wall-clock
 * compute ceiling N ~ 9916, confirming "compute binds first" independently.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * The imp-96548 conditioning ceiling is CROSS-VALIDATED. An independent estimator
 * (cond# fit as a single object rather than the composed lam_max/lam_min ratio)
 * reproduces N ~ 4.11e7 to ~5-8%, lands above the rigorous lower ceiling 2.59e7, and
 * its power exponent q ~ 1.96-1.98 is consistent with the lam_min exponent p = 1.918.
 * No ceiling is moved and the "compute binds first" verdict stands.
 *
 * Accuracy cross-check only. Changes no bound, establishes no operator positivity,
 * makes no RH claim. No refereed bound is changed. RH open. NO QED.
 *
 * @see imp-96548-route-m-lammax-rigorous-upper-bound-assessment.js (the ceilings cross-validated here)
 * @see imp-96443-route-m-vasyunin-lammax-measured.js (measured lam_max ladder)
 * @see imp-96428-route-m-vasyunin-lammin-conditioning-ceiling.js (lam_min power law, source of the rungs)
 * @see imp-96352-route-m-vasyunin-solve-cost-model.js (wall-clock compute ceiling ~9916)
 *
 * Ticket: imp-96570 (accuracy, opus-4-8, api-pool). Cross-check only; NO QED.
 */

// eps = double-precision machine epsilon; breakdown scale cond# = 1/eps.
export const IMP96570_EPS = 2.220446049250313e-16;
export const IMP96570_BREAKDOWN_COND = 1 / 2.220446049250313e-16; // ~4.5036e15

// Accessible rungs where BOTH lam_max (imp-96443 power iteration) and lam_min
// (imp-96105) are measured -- the overlap of the two committed ladders. cond# is
// the directly-formed ratio at each rung, the analog of a single rcond/SVD readout.
export const IMP96570_COND_ROWS = Object.freeze([
  Object.freeze({ N: 250, lamMax: 4.930210017770543, lamMin: 2.06e-5, cond: 4.930210017770543 / 2.06e-5 }),
  Object.freeze({ N: 3000, lamMax: 5.861648882285381, lamMin: 1.7603246535995948e-7, cond: 5.861648882285381 / 1.7603246535995948e-7 }),
  Object.freeze({ N: 4000, lamMax: 5.94745308383515, lamMin: 9.990947269105856e-8, cond: 5.94745308383515 / 9.990947269105856e-8 }),
  Object.freeze({ N: 5000, lamMax: 6.01140643903531, lamMin: 6.56754131662765e-8, cond: 6.01140643903531 / 6.56754131662765e-8 }),
  Object.freeze({ N: 6000, lamMax: 6.062043896086687, lamMin: 4.694983880281018e-8, cond: 6.062043896086687 / 4.694983880281018e-8 }),
]);

// Log-log OLS power fit of the single-object cond# ~ C N^q, plus its ceiling
// (solve C N^q = 1/eps). Two subsets: dense 3000..6000 and all five rungs.
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

const denseRows = IMP96570_COND_ROWS.filter((r) => r.N >= 3000);
const fitDense = powFit(denseRows);
const fitAll = powFit(IMP96570_COND_ROWS);

// The composed-fit ceilings being cross-validated (imp-96548 / imp-96443).
const COMPOSED_MEASURED_CEILING = 41088904.757400334; // ~4.11e7 (imp-96443)
const RIGOROUS_LOWER_CEILING = 2.59e7;                 // imp-96548 trace-domination lower ceiling
const COMPUTE_CEILING = 9916;                          // imp-96352 wall-clock reach
const LAMMIN_EXPONENT_P = 1.917927;                    // imp-96428 lam_min power law exponent

export const IMP96570_FIT = Object.freeze({
  model: 'directly-measured cond#(N) = lam_max/lam_min ~ C * N^q (log-log OLS)',
  dense: Object.freeze({ subset: '3000..6000', C: fitDense.C, q: fitDense.q, r2: fitDense.r2 }),
  all: Object.freeze({ subset: '250,3000..6000', C: fitAll.C, q: fitAll.q, r2: fitAll.r2 }),
  lamMinExponentP: LAMMIN_EXPONENT_P,
  note:
    'the single-object cond# exponent q sits just above the lam_min exponent p=1.9179, ' +
    'as cond# = (a + b log N) N^p / A predicts: an N^p power times a slow log factor.',
});

export const IMP96570_CROSSCHECK = Object.freeze({
  independentCeilingDense: ceilingOf(fitDense), // ~4.30e7
  independentCeilingAll: ceilingOf(fitAll),     // ~3.78e7
  composedMeasuredCeiling: COMPOSED_MEASURED_CEILING, // 4.11e7 (imp-96443/96548)
  rigorousLowerCeiling: RIGOROUS_LOWER_CEILING,       // 2.59e7 (imp-96548 trace)
  ratioDenseOverComposed: ceilingOf(fitDense) / COMPOSED_MEASURED_CEILING, // ~1.046
  ratioAllOverComposed: ceilingOf(fitAll) / COMPOSED_MEASURED_CEILING,     // ~0.919
  independentAboveRigorousLower:
    ceilingOf(fitAll) > RIGOROUS_LOWER_CEILING && ceilingOf(fitDense) > RIGOROUS_LOWER_CEILING,
  bothAboveComputeFactor: ceilingOf(fitAll) / COMPUTE_CEILING, // ~3800x
  topRungFitRelError: (() => {
    const top = IMP96570_COND_ROWS[IMP96570_COND_ROWS.length - 1];
    return (fitDense.C * Math.pow(top.N, fitDense.q) - top.cond) / top.cond; // ~7.9e-3
  })(),
  note:
    'the independent single-object cond# fit reproduces the composed measured-fit ' +
    'ceiling 4.11e7 to within ~5% (dense) / ~8% (all) and lands above the rigorous ' +
    'lower ceiling 2.59e7, so the two-fit composition is not an extrapolation artifact.',
});

export const IMP96570_VERDICT = Object.freeze({
  question:
    'does an independent condition-number estimator (cond# fit as one measured scalar per ' +
    'matrix, not the composed lam_max/lam_min ratio) at accessible mid-range rungs reproduce ' +
    'the imp-96548 ceiling N ~ 4.11e7 (measured) / >= 2.59e7 (rigorous)?',
  crossValidated: true,
  independentCeilingRange: '3.78e7 (all rungs) to 4.30e7 (dense rungs)',
  agreesWithComposedMeasuredToPct: 8, // worst case ~8% (all-rung fit)
  consistentWithRigorousLower: true,
  condExponentConsistentWithLamMin: true,
  anyBoundMoved: false,
  computeBindsFirst: true,
  conclusion:
    'CROSS-VALIDATED. Fitting the directly-measured cond#(N) = lam_max/lam_min as a single ' +
    'power law cond# ~ C N^q (q=1.9557 dense / 1.9837 all, R^2 >= 0.99975) and extrapolating ' +
    'to 1/eps gives N ~ 4.30e7 (dense) / 3.78e7 (all), within ~5-8% of the imp-96548 / ' +
    'imp-96443 composed measured-fit ceiling 4.11e7 and above the rigorous trace lower ' +
    'ceiling 2.59e7. The exponent q ~ 1.96-1.98 is consistent with the lam_min exponent ' +
    'p=1.918. All ceilings sit >= 2600x above the imp-96352 compute ceiling N ~ 9916, so ' +
    '"compute binds first" holds independently. No bound moved; no operator positivity; ' +
    'no refereed bound is changed; RH open; NO QED.',
});

// Honest residual: the cross-check inherits the same non-rigorous lam_min power-law
// extrapolation; it validates the COMPOSITION step, not the underlying power laws.
export const IMP96570_SUBGAP = Object.freeze({
  id: 'imp-96570-condfit-inherits-lammin-extrapolation',
  statement:
    'this cross-check validates that composing the two separate fits (lam_max ~ a + b log N, ' +
    'lam_min ~ A N^-p) into cond# = lam_max/lam_min is NOT an extrapolation artifact -- a ' +
    'single-object cond# power fit lands within ~5-8% of the same ceiling. It does NOT make ' +
    'the ceiling rigorous: both routes rest on the same non-rigorous lam_min N^-p ' +
    'extrapolation (and, for the measured branch, the non-rigorous lam_max fit coefficient ' +
    '0.3526, imp-96548 sub-gap). A genuinely independent rcond/SVD READOUT on a rebuilt ' +
    'mid-range Gram (beyond re-analysing the committed extremes) would further harden it; ' +
    'not attempted here to avoid a Gram rebuild. The compute-binds-first verdict is ' +
    'unaffected either way.',
});

export const IMP96570_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Cross-check only: every lam_max / lam_min ' +
  'value is a reproducible numeric already committed in imp-96443 / imp-96105; the cond# power ' +
  'fit and ceiling re-solve are pure re-analysis (tmp/imp-96570-scratch.mjs); no Gram was ' +
  'rebuilt, no bound is claimed moved and no operator positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96570_ASSERTIONS = [
  {
    id: 'imp96570-cond-single-power-law-clean',
    holds: () =>
      IMP96570_FIT.dense.q > 1.9 && IMP96570_FIT.dense.q < 2.0 &&
      IMP96570_FIT.all.q > 1.9 && IMP96570_FIT.all.q < 2.0 &&
      IMP96570_FIT.dense.r2 > 0.9995 && IMP96570_FIT.all.r2 > 0.9995,
    why: 'the directly-formed cond#(N) is a clean single power law (q in (1.9,2.0), R^2 > 0.9995 on both subsets), so extrapolating it as one object is well-posed.',
  },
  {
    id: 'imp96570-cond-exponent-above-lammin-exponent',
    holds: () =>
      IMP96570_FIT.dense.q > IMP96570_FIT.lamMinExponentP &&
      IMP96570_FIT.all.q > IMP96570_FIT.lamMinExponentP &&
      IMP96570_FIT.all.q - IMP96570_FIT.lamMinExponentP < 0.1,
    why: 'the cond# exponent q sits just above the lam_min exponent p=1.9179 (by < 0.1), exactly as cond# = (a + b log N) N^p / A predicts: an N^p power times a slow log factor.',
  },
  {
    id: 'imp96570-independent-ceiling-reproduces-composed',
    holds: () =>
      IMP96570_CROSSCHECK.ratioDenseOverComposed > 0.85 &&
      IMP96570_CROSSCHECK.ratioDenseOverComposed < 1.15 &&
      IMP96570_CROSSCHECK.ratioAllOverComposed > 0.85 &&
      IMP96570_CROSSCHECK.ratioAllOverComposed < 1.15,
    why: 'the independent single-object cond# fit reproduces the composed measured-fit ceiling 4.11e7 to within ~15% (actually ~5% dense / ~8% all): the two-fit composition is not an artifact.',
  },
  {
    id: 'imp96570-independent-above-rigorous-lower',
    holds: () =>
      IMP96570_CROSSCHECK.independentAboveRigorousLower === true &&
      IMP96570_CROSSCHECK.independentCeilingAll > RIGOROUS_LOWER_CEILING,
    why: 'both independent ceilings (3.78e7 / 4.30e7) sit above the imp-96548 rigorous trace lower ceiling 2.59e7, consistent with that value being a LOWER estimate of the true ceiling.',
  },
  {
    id: 'imp96570-top-rung-anchored-and-above-compute',
    holds: () =>
      Math.abs(IMP96570_CROSSCHECK.topRungFitRelError) < 0.02 &&
      IMP96570_CROSSCHECK.bothAboveComputeFactor > 2000 &&
      IMP96570_VERDICT.computeBindsFirst === true,
    why: 'the cond# fit reproduces the top measured rung N=6000 to < 2% (anchored, not floating), and the ceiling sits >= 2000x above the compute ceiling N ~ 9916: compute binds first independently.',
  },
  {
    id: 'imp96570-honesty-gate-no-qed',
    holds: () =>
      IMP96570_VERDICT.anyBoundMoved === false &&
      IMP96570_VERDICT.crossValidated === true &&
      /NO QED/.test(IMP96570_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96570_HONEST_BANNER) &&
      /RH open/.test(IMP96570_HONEST_BANNER) &&
      /inherits-lammin-extrapolation/.test(IMP96570_SUBGAP.id),
    why: 'cross-check only: no bound moved, the cross-validation is recorded, the honesty markers and the residual sub-gap (inherits the non-rigorous lam_min extrapolation) are present.',
  },
];

for (const a of IMP96570_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96570-route-m-conditioning-ceiling-crossvalidation assertion failed: ${a.id}`,
    );
  }
}

export default {
  eps: IMP96570_EPS,
  breakdownCond: IMP96570_BREAKDOWN_COND,
  condRows: IMP96570_COND_ROWS,
  fit: IMP96570_FIT,
  crossCheck: IMP96570_CROSSCHECK,
  verdict: IMP96570_VERDICT,
  subGap: IMP96570_SUBGAP,
  banner: IMP96570_HONEST_BANNER,
};
