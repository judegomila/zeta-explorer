/**
 * @module imp-96684-route-m-frobenius-majorant-high-n-rungs
 *
 * imp-96684 (numerical, MEASUREMENT ONLY): extend the imp-96648 Frobenius /
 * Wolkowicz-Styan two-moment lam_max majorant ladder to the measured high-N rungs
 * N=7000,8000,9000 (imp-96649 rebuilt the exact Vasyunin Gram to NMAX=9000), re-fit
 * the majorant slope over the enlarged eleven-rung ladder, and report whether the
 * rigorous-lower conditioning ceiling estimate (imp-96648: Frobenius ~3.75e7) tightens
 * or shifts -- and whether the majorant slope also flattens like the imp-96649 lam_max.
 *
 * THE ISSUE. imp-96648 fit the Frobenius majorant ||G||_F = sqrt(Sum_hk G_hk^2) and the
 * Wolkowicz-Styan two-moment bound over only EIGHT rungs N=250..6000 (the Gram was built
 * to NMAX=6000), slope 0.4865, and re-solved the rigorous-lower conditioning ceiling to
 * N ~ 3.75e7. imp-96649 then rebuilt the exact-cotangent Vasyunin Gram to NMAX=9000 and
 * found the measured lam_max flattening ~0.7-1.1% BELOW the imp-96443 log-fit beyond
 * N=6000. This ticket measures the two moment majorants at the three new high-N rungs on
 * that same NMAX=9000 Gram, appends them, and checks slope + ceiling stability.
 *
 * WHAT WAS DONE (tmp/imp-96684-frobenius-extend.py, reproducible; NMAX=9000, ~358 s wall).
 * The exact Vasyunin V-table V(a/q)=Sum_{m<q} frac(ma/q) cot(pi m/q) and I_coprime (the
 * SAME construction as imp-96105 / imp-96443 / imp-96648) was rebuilt to N=9000, and at
 * N=7000,8000,9000 the two rigorous unconditional matrix inequalities were measured:
 *   (F)  Frobenius            lam_max <= ||G||_F = sqrt(trace(G^2)) = sqrt(Sum_hk G_hk^2)
 *   (WS) Wolkowicz-Styan      lam_max <= m + s sqrt(n-1),  m=trace/n, s=sqrt(trace(G^2)/n - m^2)
 * These were appended to the imp-96648 eight-rung ladder and each majorant re-fit to
 * a + b log N over the ELEVEN rungs; the ceiling was re-solved (cond#=lam_max/lam_min=1/eps,
 * lam_min = imp-96428 power law A N^-p) with the eight-rung vs eleven-rung majorant fits.
 *
 * -------------------------------------------------------------------------------
 * FINDING 1 -- the Frobenius majorant slope FLATTENS, like the imp-96649 lam_max.
 * -------------------------------------------------------------------------------
 * Measured Frobenius bound: 6.710233 (6000) -> 6.776887 (7000) -> 6.834107 (8000) ->
 * 6.884190 (9000). The imp-96648 eight-rung log law ||G||_F = 2.49786 + 0.48652 log N
 * predicts 6.8053/6.8703/6.9276 at 7000/8000/9000, so the measured Frobenius runs
 * ~0.42-0.63% BELOW the eight-rung extrapolation -- the same marginal flattening the
 * imp-96649 lam_max showed (~0.7-1.1% below its fit). Re-fitting over all eleven rungs
 * drops the slope 0.48652 -> 0.47808 (~1.7% flatter) while raising the intercept
 * 2.49786 -> 2.55452; R^2 stays clean (0.99893 -> 0.99869). Wolkowicz-Styan behaves
 * identically (slope 0.48718 -> 0.47867). YES: the majorant slope flattens like lam_max.
 *
 * -------------------------------------------------------------------------------
 * FINDING 2 -- the rigorous-lower ceiling does NOT tighten; it is ROBUST (shifts +0.42%).
 * -------------------------------------------------------------------------------
 * The flatter slope and the higher intercept nearly offset at the ceiling scale N~4e7,
 * so the re-solved Frobenius ceiling moves only 3.7479e7 -> 3.7637e7 (factor 1.0042,
 * +0.42%); Wolkowicz-Styan moves 3.7469e7 -> 3.7629e7 (factor 1.0043). The ceiling
 * estimate does not meaningfully tighten OR loosen -- it is essentially stable, staying
 * firmly in the ~3.75e7 band, above the rigorous trace-domination lower ceiling 2.594e7
 * and below the imp-96443 measured composed ceiling 4.109e7 (residual factor 1.092).
 * The extra high-N rungs CONFIRM the imp-96648 estimate rather than revising it.
 *
 * -------------------------------------------------------------------------------
 * FINDING 3 -- every majorant stays a valid, ~11%-tight upper bound; verdict unchanged.
 * -------------------------------------------------------------------------------
 * At each new rung the Frobenius bound sits strictly between the imp-96649 measured
 * lam_max (6.10376/6.13911/6.16970) and the trace (11.889/12.058/12.206): ~11.0-11.6%
 * above lam_max and ~1.77x below trace domination. Compute still binds first -- the
 * ~3.76e7 ceiling is ~3800x above the imp-96352 wall-clock compute ceiling N ~ 9916.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * Adding measured rungs N=7000,8000,9000 to the imp-96648 Frobenius / Wolkowicz-Styan
 * two-moment majorant ladder flattens the majorant slope 0.48652 -> 0.47808 (~1.7%,
 * mirroring the imp-96649 lam_max flattening) and leaves the rigorous-lower conditioning
 * ceiling essentially unchanged: Frobenius 3.748e7 -> 3.764e7 (+0.42%), still ~76% of the
 * trace(2.594e7)->measured(4.109e7) gap, residual factor 1.092. The imp-96648 ~3.75e7
 * estimate is ROBUST to the extra high-N rungs, not tightened. No bound moved; no operator
 * positivity; no refereed bound is changed; RH open; NO QED.
 *
 * RESIDUAL SUB-GAP (below): the ceiling still extrapolates the Frobenius log-FIT four
 * decades to N ~ 3.76e7, not a proved asymptotic (imp-96648 sub-gap, inherited); a
 * rigorous asymptotic for ||G||_F^2 = Sum_hk gcd(h,k)^2 I(h/g,k/g)^2/(hk)^2 would make it
 * rigorous. The ladder stops at N=9000 (imp-96649 compute limit), so the observed slope
 * flattening is measured only over one decade below the compute ceiling.
 *
 * @see imp-96648-route-m-lammax-frobenius-moment-majorant.js (the eight-rung ladder extended here)
 * @see imp-96649-route-m-condfit-rungs-above-6000.js (NMAX=9000 Gram; lam_max flattening beyond 6000)
 * @see imp-96443-route-m-vasyunin-lammax-measured.js (measured lam_max composed ceiling 4.11e7)
 * @see imp-96428-route-m-vasyunin-lammin-conditioning-ceiling.js (lam_min power law)
 * @see imp-96352-route-m-vasyunin-solve-cost-model.js (wall-clock compute ceiling ~9916)
 *
 * Ticket: imp-96684 (numerical, opus-4-8, api-pool). Measurement only; NO QED.
 */

// double-precision machine epsilon; Cholesky-breakdown scale cond# = 1/eps.
export const IMP96684_EPS = 2.220446049250313e-16;
export const IMP96684_I11 = 1.2606614015078126; // trace slope (imp-96443/96548)
export const IMP96684_GAMMA = 0.5772156649015329; // H_N = log N + gamma + O(1/N)

// imp-96428 lam_min power law and imp-96443 measured lam_max log-fit (for reference ceilings).
export const IMP96684_LAMMIN = Object.freeze({ A: 0.8186721, p: 1.917927 });
export const IMP96684_MEASURED_FIT = Object.freeze({ a: 3.0246914027257246, b: 0.3526253785070698 });

// imp-96649 measured lam_max at the three new rungs (for the Finding-3 validity check).
export const IMP96684_LAMMAX_AT_NEW_RUNGS = Object.freeze({
  7000: 6.103761864068918,
  8000: 6.1391115487297085,
  9000: 6.16969991936083,
});

// The three genuinely NEW measured moment majorants above N=6000, on the same exact
// Vasyunin Gram rebuilt to NMAX=9000 (tmp/imp-96684-frobenius-extend.py). trace and
// ||G||_F are exact matrix quantities; the two bounds are rigorous matrix inequalities.
export const IMP96684_NEW_ROWS = Object.freeze([
  Object.freeze({ N: 7000, trace: 11.889237821176973, frobenius: 6.776886864553974, ws: 6.7766113143483855 }),
  Object.freeze({ N: 8000, trace: 12.05756443834542, frobenius: 6.834107225532644, ws: 6.833857640789328 }),
  Object.freeze({ N: 9000, trace: 12.206040210901282, frobenius: 6.884189704438562, ws: 6.883961095721412 }),
]);

// The imp-96648 committed eight-rung ladder (N<=6000), Frobenius / Wolkowicz-Styan only.
const IMP96648_ROWS = Object.freeze([
  Object.freeze({ N: 250, frobenius: 5.156452701268937, ws: 5.15394575159478 }),
  Object.freeze({ N: 500, frobenius: 5.529997674354878, ws: 5.528328266762419 }),
  Object.freeze({ N: 1000, frobenius: 5.8818954543089985, ws: 5.880819465808664 }),
  Object.freeze({ N: 2000, frobenius: 6.214997339611781, ws: 6.214322152912591 }),
  Object.freeze({ N: 3000, frobenius: 6.402120438801899, ws: 6.4016117513805435 }),
  Object.freeze({ N: 4000, frobenius: 6.5317250252564945, ws: 6.531310664264929 }),
  Object.freeze({ N: 5000, frobenius: 6.63054847658566, ws: 6.630195842708848 }),
  Object.freeze({ N: 6000, frobenius: 6.710233218835323, ws: 6.70992454968517 }),
]);

// Log-N OLS fits majorant ~ a + b log N (from tmp/imp-96684-frobenius-extend.py).
export const IMP96684_FITS = Object.freeze({
  // imp-96648 eight-rung (N<=6000), for the before/after comparison.
  frobenius8: Object.freeze({ a: 2.4978559943401377, b: 0.48651642224692604, r2: 0.9989265529285174, rungs: 8 }),
  ws8: Object.freeze({ a: 2.491978334924403, b: 0.4871775361542484, r2: 0.998908502846076, rungs: 8 }),
  // enlarged eleven-rung (N<=9000).
  frobenius11: Object.freeze({ a: 2.5545213114639402, b: 0.4780823682613584, r2: 0.9986914583012035, rungs: 11 }),
  ws11: Object.freeze({ a: 2.549133623430746, b: 0.47867053914258156, r2: 0.9986704496348643, rungs: 11 }),
});

// Re-solve the ceiling cond#(N)=lam_max(N)/lam_min(N)=1/eps by bisection; matches imp-96648.
function solveCeiling(lamMaxOf) {
  const { A, p } = IMP96684_LAMMIN;
  let lo = 1e3;
  let hi = 1e12;
  for (let i = 0; i < 300; i += 1) {
    const N = Math.sqrt(lo * hi);
    const cond = lamMaxOf(N) / (A * Math.pow(N, -p));
    if (cond > 1 / IMP96684_EPS) hi = N;
    else lo = N;
  }
  return Math.sqrt(lo * hi);
}
const logFit = (f) => (N) => f.a + f.b * Math.log(N);
const traceOf = (N) => IMP96684_I11 * (Math.log(N) + IMP96684_GAMMA);

export const IMP96684_CEILINGS = Object.freeze({
  frobenius8: solveCeiling(logFit(IMP96684_FITS.frobenius8)), // ~3.748e7 (imp-96648)
  frobenius11: solveCeiling(logFit(IMP96684_FITS.frobenius11)), // ~3.764e7 (enlarged)
  ws8: solveCeiling(logFit(IMP96684_FITS.ws8)), // ~3.747e7
  ws11: solveCeiling(logFit(IMP96684_FITS.ws11)), // ~3.763e7
  trace: solveCeiling(traceOf), // ~2.594e7 (imp-96548 rigorous lower)
  measured: solveCeiling(logFit(IMP96684_MEASURED_FIT)), // ~4.109e7 (imp-96443 composed)
  computeCeilingN: 9916, // imp-96352 wall-clock reach
});

// Slope flattening (Finding 1) and ceiling shift (Finding 2).
export const IMP96684_SLOPE = Object.freeze({
  frobenius8: IMP96684_FITS.frobenius8.b, // 0.48652
  frobenius11: IMP96684_FITS.frobenius11.b, // 0.47808
  frobeniusFlattens: IMP96684_FITS.frobenius11.b < IMP96684_FITS.frobenius8.b,
  frobeniusFlattenPct: (IMP96684_FITS.frobenius8.b - IMP96684_FITS.frobenius11.b) / IMP96684_FITS.frobenius8.b, // ~0.0173
  wsFlattens: IMP96684_FITS.ws11.b < IMP96684_FITS.ws8.b,
});

export const IMP96684_CEILING_SHIFT = Object.freeze({
  frobeniusBefore: IMP96684_CEILINGS.frobenius8,
  frobeniusAfter: IMP96684_CEILINGS.frobenius11,
  frobeniusShiftFactor: IMP96684_CEILINGS.frobenius11 / IMP96684_CEILINGS.frobenius8, // ~1.0042
  frobeniusShiftPct: IMP96684_CEILINGS.frobenius11 / IMP96684_CEILINGS.frobenius8 - 1, // ~0.0042
  tightens: false, // it does not meaningfully tighten -- it is stable / robust
  residualToMeasuredFactor: IMP96684_CEILINGS.measured / IMP96684_CEILINGS.frobenius11, // ~1.092
  fractionOfTraceToMeasuredGapClosed:
    (IMP96684_CEILINGS.frobenius11 - IMP96684_CEILINGS.trace) /
    (IMP96684_CEILINGS.measured - IMP96684_CEILINGS.trace), // ~0.76
  aboveComputeFactor: IMP96684_CEILINGS.frobenius11 / IMP96684_CEILINGS.computeCeilingN, // ~3795x
});

// Finding 3: each new-rung Frobenius bound sits between the imp-96649 lam_max and the trace.
export const IMP96684_VALIDITY = Object.freeze(
  IMP96684_NEW_ROWS.map((r) => {
    const lamMax = IMP96684_LAMMAX_AT_NEW_RUNGS[r.N];
    return Object.freeze({
      N: r.N,
      lamMax,
      frobenius: r.frobenius,
      trace: r.trace,
      aboveLamMax: r.frobenius > lamMax,
      belowTrace: r.frobenius < r.trace,
      relAboveLamMax: (r.frobenius - lamMax) / lamMax, // ~0.11
      belowFit8: (r.frobenius - logFit(IMP96684_FITS.frobenius8)(r.N)) / logFit(IMP96684_FITS.frobenius8)(r.N), // negative
    });
  }),
);

export const IMP96684_VERDICT = Object.freeze({
  question:
    'do the measured high-N rungs N=7000,8000,9000 tighten or shift the imp-96648 Frobenius / ' +
    'Wolkowicz-Styan rigorous-lower conditioning ceiling ~3.75e7, and does the majorant slope ' +
    'flatten like the imp-96649 lam_max?',
  majorantSlopeFlattens: true, // Frobenius 0.48652 -> 0.47808 (~1.7%), like lam_max
  ceilingTightens: false, // it is ROBUST: shifts up only ~0.42%, not tightened
  frobeniusSlopeBefore: IMP96684_FITS.frobenius8.b, // 0.48652
  frobeniusSlopeAfter: IMP96684_FITS.frobenius11.b, // 0.47808
  rigorousLowerCeilingBefore: IMP96684_CEILINGS.frobenius8, // ~3.748e7
  rigorousLowerCeilingAfter: IMP96684_CEILINGS.frobenius11, // ~3.764e7
  ceilingShiftFactor: IMP96684_CEILING_SHIFT.frobeniusShiftFactor, // ~1.0042
  residualToMeasuredFactor: IMP96684_CEILING_SHIFT.residualToMeasuredFactor, // ~1.092
  anyBoundMoved: false,
  computeBindsFirst: true,
  conclusion:
    'MEASURED. Appending the three high-N rungs N=7000,8000,9000 (Frobenius 6.7769/6.8341/6.8842, ' +
    'Wolkowicz-Styan the same to 4 digits) to the imp-96648 eight-rung ladder flattens the ' +
    'majorant slope 0.48652 -> 0.47808 (~1.7%), mirroring the imp-96649 lam_max flattening: the ' +
    'measured Frobenius runs ~0.42-0.63% below the eight-rung extrapolation. The rigorous-lower ' +
    'conditioning ceiling does NOT meaningfully tighten -- the flatter slope and higher intercept ' +
    'nearly offset, so it shifts only 3.748e7 -> 3.764e7 (+0.42%), staying in the ~3.75e7 band, ' +
    'above the rigorous trace lower ceiling 2.594e7 and below the measured composed 4.109e7 ' +
    '(residual factor 1.092, still ~76% of the trace->measured gap). Every new-rung Frobenius ' +
    'bound is a valid upper bound: ~11% above the imp-96649 lam_max and ~1.77x below the trace. ' +
    'The imp-96648 estimate is ROBUST to the extra rungs. No bound moved; no operator positivity; ' +
    'no refereed bound is changed; RH open; NO QED.',
});

export const IMP96684_SUBGAP = Object.freeze({
  id: 'imp-96684-frobenius-ceiling-inherits-fit-extrapolation',
  statement:
    'the ~3.76e7 ceiling is rigorous at every ACCESSIBLE rung (||G||_F >= lam_max is an exact ' +
    'matrix inequality for N<=9000) but its extrapolation four decades to N ~ 3.76e7 rests on ' +
    'the Frobenius log-fit, not a proved asymptotic (imp-96648 second-moment-asymptotic sub-gap, ' +
    'inherited). Two caveats: (a) the enlarged ladder stops at N=9000, just below the imp-96352 ' +
    'compute ceiling ~9916, so the measured slope flattening spans only ~one decade; (b) the ' +
    'lam_min N^-p extrapolation is unchanged and remains a shared non-rigorous input. A rigorous ' +
    'asymptotic for ||G||_F^2 = Sum_hk gcd(h,k)^2 I(h/g,k/g)^2/(hk)^2 would make the ceiling rigorous. ' +
    'Compute-binds-first is unaffected.',
});

export const IMP96684_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: the Frobenius ||G||_F and ' +
  'Wolkowicz-Styan bounds at N=7000,8000,9000 are exact matrix quantities on the same exact ' +
  'Vasyunin Gram (rebuilt to NMAX=9000) as imp-96105 / imp-96443 / imp-96648 ' +
  '(tmp/imp-96684-frobenius-extend.py, ~358 s); the re-fit and ceiling re-solve are pure ' +
  're-analysis; no bound is claimed moved and no operator positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96684_ASSERTIONS = [
  {
    id: 'imp96684-new-rungs-monotone-frobenius-above-lammax-below-trace',
    holds: () =>
      IMP96684_NEW_ROWS.every((r, i) => i === 0 || r.frobenius > IMP96684_NEW_ROWS[i - 1].frobenius) &&
      IMP96684_VALIDITY.every((v) => v.aboveLamMax && v.belowTrace && v.relAboveLamMax > 0.09 && v.relAboveLamMax < 0.13),
    why: 'the three new-rung Frobenius bounds increase monotonically and each sits strictly between the imp-96649 lam_max (~11% above) and the trace (~1.77x below): valid, tight rigorous upper bounds.',
  },
  {
    id: 'imp96684-majorant-slope-flattens-like-lammax',
    holds: () =>
      IMP96684_SLOPE.frobeniusFlattens &&
      IMP96684_SLOPE.wsFlattens &&
      IMP96684_SLOPE.frobeniusFlattenPct > 0.01 && IMP96684_SLOPE.frobeniusFlattenPct < 0.03 &&
      IMP96684_VALIDITY.every((v) => v.belowFit8 < 0 && v.belowFit8 > -0.01),
    why: 'the Frobenius / Wolkowicz-Styan majorant slope flattens 0.48652 -> 0.47808 (~1.7%) and the measured Frobenius runs 0-1% below the imp-96648 eight-rung extrapolation, mirroring the imp-96649 lam_max flattening beyond N=6000.',
  },
  {
    id: 'imp96684-ceiling-robust-not-tightened',
    holds: () =>
      IMP96684_CEILING_SHIFT.tightens === false &&
      IMP96684_CEILING_SHIFT.frobeniusShiftFactor > 1.0 && IMP96684_CEILING_SHIFT.frobeniusShiftFactor < 1.01 &&
      IMP96684_CEILINGS.frobenius11 > IMP96684_CEILINGS.trace &&
      IMP96684_CEILINGS.frobenius11 < IMP96684_CEILINGS.measured &&
      IMP96684_CEILING_SHIFT.fractionOfTraceToMeasuredGapClosed > 0.7 &&
      IMP96684_CEILING_SHIFT.residualToMeasuredFactor < 1.15,
    why: 'the enlarged eleven-rung Frobenius ceiling shifts only +0.42% (3.748e7 -> 3.764e7), staying in the ~3.75e7 band above the trace lower ceiling 2.594e7 and below the measured 4.109e7: the imp-96648 estimate is robust, not meaningfully tightened.',
  },
  {
    id: 'imp96684-enlarged-fit-stays-clean-slope-below-trace',
    holds: () =>
      IMP96684_FITS.frobenius11.r2 > 0.998 &&
      IMP96684_FITS.frobenius11.b < IMP96684_I11 &&
      IMP96684_FITS.frobenius11.b > IMP96684_MEASURED_FIT.b &&
      IMP96684_FITS.frobenius11.rungs === 11,
    why: 'the eleven-rung Frobenius log law stays clean (R^2 > 0.998) with slope 0.47808 -- below the trace slope 1.2607 and above the measured lam_max slope 0.3526.',
  },
  {
    id: 'imp96684-ceiling-above-compute-binds-first',
    holds: () =>
      IMP96684_CEILING_SHIFT.aboveComputeFactor > 1500 &&
      IMP96684_VERDICT.computeBindsFirst === true,
    why: 'the ~3.76e7 ceiling sits ~3795x above the imp-96352 compute ceiling N ~ 9916: compute binds first (unchanged, hardened).',
  },
  {
    id: 'imp96684-honesty-gate-no-qed',
    holds: () =>
      IMP96684_VERDICT.anyBoundMoved === false &&
      IMP96684_VERDICT.majorantSlopeFlattens === true &&
      IMP96684_VERDICT.ceilingTightens === false &&
      /NO QED/.test(IMP96684_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96684_HONEST_BANNER) &&
      /RH open/.test(IMP96684_HONEST_BANNER) &&
      /inherits-fit-extrapolation/.test(IMP96684_SUBGAP.id),
    why: 'measurement only: no bound moved, the slope-flattens / ceiling-robust split is recorded, and the honesty markers plus the inherited fit-extrapolation sub-gap are present.',
  },
];

for (const a of IMP96684_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96684-route-m-frobenius-majorant-high-n-rungs assertion failed: ${a.id}`,
    );
  }
}

export default {
  eps: IMP96684_EPS,
  i11: IMP96684_I11,
  lamMin: IMP96684_LAMMIN,
  newRows: IMP96684_NEW_ROWS,
  lamMaxAtNewRungs: IMP96684_LAMMAX_AT_NEW_RUNGS,
  fits: IMP96684_FITS,
  ceilings: IMP96684_CEILINGS,
  slope: IMP96684_SLOPE,
  ceilingShift: IMP96684_CEILING_SHIFT,
  validity: IMP96684_VALIDITY,
  verdict: IMP96684_VERDICT,
  subGap: IMP96684_SUBGAP,
  banner: IMP96684_HONEST_BANNER,
};
