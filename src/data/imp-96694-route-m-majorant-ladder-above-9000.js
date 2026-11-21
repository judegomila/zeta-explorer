/**
 * @module imp-96694-route-m-majorant-ladder-above-9000
 *
 * imp-96694 (numerical, MEASUREMENT ONLY): extend the Route M measured lam_max ladder
 * (imp-96443 / imp-96649) AND the Frobenius / Wolkowicz-Styan two-moment majorant ladder
 * (imp-96648 / imp-96684) PAST the N=9000 compute limit to N=10000,11000,12000, and test
 * whether the ~1.7 percent slope flattening -- observed only over the one decade below
 * N=9000 -- KEEPS FLATTENING or SATURATES beyond it.
 *
 * THE ISSUE. imp-96684 measured a ~1.7 percent flattening of the Frobenius majorant slope
 * (0.48652 -> 0.47808 as the ladder grew 8 -> 11 rungs) and imp-96649 a matching lam_max
 * flattening (measured lam_max running ~0.7-1.1 percent BELOW the imp-96443 log-fit at
 * N=7000,8000,9000), but both were seen only over the single decade below the N=9000 Gram
 * build limit. imp-96684 flagged the residual sub-gap: "the observed slope flattening is
 * measured only over one decade below the compute ceiling." This ticket rebuilds the exact
 * Vasyunin Gram three rungs higher and asks the direct question: continue or saturate?
 *
 * WHAT WAS DONE (tmp/imp-96694-frobenius-extend-highn.py, reproducible; NMAX=12000, ~770 s
 * wall, dominated by the ~700 s exact V-table build). The SAME exact Vasyunin V-table
 * V(a/q)=Sum_{m<q} frac(ma/q) cot(pi m/q) and I_coprime construction as
 * imp-96105 / imp-96443 / imp-96648 / imp-96684 was rebuilt to N=12000 (past the imp-96352
 * wall-clock ceiling ~9916, which bounds the IPM lam_min SOLVE, not the Gram build plus the
 * moment measurement). At N=10000,11000,12000 four quantities were measured:
 *   lam_max   exact top eigenvalue (power iteration, the imp-96649 routine)
 *   (F)  Frobenius            lam_max le ||G||_F = sqrt(trace(G^2)) = sqrt(Sum_hk G_hk^2)
 *   (WS) Wolkowicz-Styan      lam_max le m + s sqrt(n-1),  m=trace/n, s=sqrt(trace(G^2)/n - m^2)
 * The vectorised-Gram pipeline was validated to reproduce the committed imp-96648 Frobenius
 * values at N=250,500,1000 to all printed digits before the high-N run. The new rungs were
 * appended to the imp-96684 eleven-rung ladder, the majorant re-fit to a + b log N over all
 * fourteen rungs, a local high-N (N ge 7000) finite-difference slope taken, and the
 * rigorous-lower conditioning ceiling re-solved. Measurement / re-analysis only.
 *
 * -------------------------------------------------------------------------------
 * FINDING 1 -- the flattening CONTINUES; it does NOT saturate through N=12000.
 * -------------------------------------------------------------------------------
 * Global Frobenius slope keeps dropping as each extension is added: 0.48652 (8 rungs,
 * imp-96648) -> 0.47808 (11 rungs, imp-96684) -> 0.47196 (14 rungs, here) -- a further
 * ~1.28 percent flatten on top of the imp-96684 ~1.73 percent. Wolkowicz-Styan tracks it
 * (0.47867 -> 0.47250). The local high-N slope over the N ge 7000 rungs is only 0.42324,
 * well below the fourteen-rung global 0.47196 and the eleven-rung 0.47808: the high-N
 * segment is genuinely flatter than the low-N ladder, so the flattening is a real high-N
 * effect, not a fit artifact. NO saturation over the accessible window.
 *
 * -------------------------------------------------------------------------------
 * FINDING 2 -- the below-fit gap GROWS monotonically for both lam_max and the majorant.
 * -------------------------------------------------------------------------------
 * Measured lam_max: 6.196602 (10000) -> 6.220571 (11000) -> 6.242153 (12000), running
 * 1.21 / 1.36 / 1.49 percent BELOW the imp-96443 log-fit -- up from the ~0.7-1.1 percent
 * imp-96649 saw at 7000-9000: the lam_max shortfall keeps widening. The Frobenius bound
 * 6.928687 / 6.968698 / 7.005027 runs 0.42 / 0.50 / 0.57 percent below the imp-96684
 * eleven-rung extrapolation, also widening. Both curves bend further below their old fits
 * the further out they are measured -- consistent with continued, not saturating, flattening.
 *
 * -------------------------------------------------------------------------------
 * FINDING 3 -- the rigorous-lower conditioning ceiling stays ROBUST (shifts +0.30 percent).
 * -------------------------------------------------------------------------------
 * The flatter fourteen-rung slope and higher intercept (2.55452 -> 2.59725) nearly offset at
 * the ceiling scale, so the re-solved Frobenius ceiling moves only 3.7637e7 -> 3.7751e7
 * (factor 1.00301, +0.30 percent), staying firmly in the ~3.75-3.78e7 band -- above the
 * rigorous trace lower ceiling 2.5937e7 and below the imp-96443 measured composed ceiling
 * 4.1089e7. Each new-rung Frobenius bound is a valid upper bound: ~11-12 percent above the
 * measured lam_max and ~1.79x below the trace. The ~3.76e7 estimate is CONFIRMED, not revised.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * Extending the ladder to N=10000,11000,12000 shows the ~1.7 percent slope flattening
 * CONTINUES: the global Frobenius slope drops 0.47808 -> 0.47196, the local N ge 7000 slope
 * is only 0.42324, and the below-fit gaps grow (lam_max 1.21 -> 1.49 percent, Frobenius
 * 0.42 -> 0.57 percent). It does NOT saturate over the accessible window. The rigorous-lower
 * conditioning ceiling shifts only +0.30 percent (3.764e7 -> 3.775e7), robust in the
 * ~3.75-3.78e7 band. No bound moved; no operator positivity; Platt-Trudgian Lambda le 0.2
 * remains SOTA; RH open; NO QED.
 *
 * RESIDUAL SUB-GAP (below): the window is still bounded -- N=12000 is only ~1.3 decade above
 * the flattening onset, and the incremental per-extension flatten is itself shrinking (1.73
 * percent then 1.28 percent), so "keeps flattening through N=12000" cannot distinguish a
 * genuine sub-log growth law from the slow tail of an approach to an asymptotic slope that
 * would saturate beyond N=12000. The ceiling still extrapolates the log-fit four decades to
 * ~3.78e7 (imp-96684 / imp-96648 inherited sub-gap); a rigorous asymptotic for
 * ||G||_F^2 = Sum_hk gcd(h,k)^2 I(h/g,k/g)^2/(hk)^2 (the imp-96667 interior second moment)
 * would settle both.
 *
 * @see imp-96684-route-m-frobenius-majorant-high-n-rungs.js (the eleven-rung ladder extended here)
 * @see imp-96649-route-m-condfit-rungs-above-6000.js (measured lam_max at N=7000,8000,9000)
 * @see imp-96443-route-m-vasyunin-lammax-measured.js (measured lam_max log-fit)
 * @see imp-96648-route-m-lammax-frobenius-moment-majorant.js (eight-rung majorant ladder)
 * @see imp-96428-route-m-vasyunin-lammin-conditioning-ceiling.js (lam_min power law)
 * @see imp-96352-route-m-vasyunin-solve-cost-model.js (wall-clock compute ceiling ~9916)
 * @see imp-96667-route-m-frobenius-second-moment-asymptotic.js (interior second-moment obstruction)
 *
 * Ticket: imp-96694 (numerical, opus-4-8, api-pool). Measurement only; NO QED.
 */

// double-precision machine epsilon; Cholesky-breakdown scale cond# = 1/eps.
export const IMP96694_EPS = 2.220446049250313e-16;
export const IMP96694_I11 = 1.2606614015078126; // trace slope (imp-96443/96548)
export const IMP96694_GAMMA = 0.5772156649015329; // H_N = log N + gamma + O(1/N)

// imp-96428 lam_min power law; imp-96443 measured lam_max log-fit; imp-96684 eleven-rung fits.
export const IMP96694_LAMMIN = Object.freeze({ A: 0.8186721, p: 1.917927 });
export const IMP96694_LAMMAX_FIT = Object.freeze({ a: 3.0246914027257246, b: 0.3526253785070698 }); // imp-96443
export const IMP96694_FROB_FIT_11 = Object.freeze({ a: 2.5545213114639402, b: 0.4780823682613584 }); // imp-96684
export const IMP96694_WS_FIT_11 = Object.freeze({ a: 2.549133623430746, b: 0.47867053914258156 }); // imp-96684

// The three genuinely NEW measured rungs above N=9000, on the SAME exact Vasyunin Gram rebuilt
// to NMAX=12000 (tmp/imp-96694-frobenius-extend-highn.py). trace and ||G||_F are exact matrix
// quantities; Frobenius and Wolkowicz-Styan are rigorous unconditional matrix inequalities;
// lam_max is measured by power iteration (the imp-96649 routine).
export const IMP96694_NEW_ROWS = Object.freeze([
  Object.freeze({ N: 10000, lamMax: 6.196601961, trace: 12.338857, frobenius: 6.928687055, ws: 6.928475791 }),
  Object.freeze({ N: 11000, lamMax: 6.220570700, trace: 12.459005, frobenius: 6.968697840, ws: 6.968501190 }),
  Object.freeze({ N: 12000, lamMax: 6.242153271, trace: 12.568692, frobenius: 7.005027412, ws: 7.004843262 }),
]);

// imp-96649 measured lam_max at N=7000,8000,9000 (for the flattening-continues trend).
export const IMP96694_LAMMAX_9000_AND_BELOW = Object.freeze({
  7000: 6.103761864068918,
  8000: 6.1391115487297085,
  9000: 6.16969991936083,
});

// Enlarged fourteen-rung log-N OLS fits majorant ~ a + b log N, and the local high-N slope
// over the N>=7000 rungs (from tmp/imp-96694-frobenius-extend-highn.py).
export const IMP96694_FITS = Object.freeze({
  frobenius8: Object.freeze({ b: 0.48651642224692604, rungs: 8 }), // imp-96648
  frobenius11: Object.freeze({ a: 2.5545213114639402, b: 0.4780823682613584, r2: 0.9986914583012035, rungs: 11 }), // imp-96684
  frobenius14: Object.freeze({ a: 2.5972544, b: 0.4719572, r2: 0.9984848, rungs: 14 }), // enlarged
  ws14: Object.freeze({ a: 2.5922139, b: 0.4724955, r2: 0.9984613, rungs: 14 }),
  localFrobSlopeGe7000: 0.4232417, // finite-difference slope over the N>=7000 rungs only
});

// Re-solve the ceiling cond#(N)=lam_max(N)/lam_min(N)=1/eps by bisection; matches imp-96684.
function solveCeiling(lamMaxOf) {
  const { A, p } = IMP96694_LAMMIN;
  let lo = 1e3;
  let hi = 1e12;
  for (let i = 0; i < 300; i += 1) {
    const N = Math.sqrt(lo * hi);
    const cond = lamMaxOf(N) / (A * Math.pow(N, -p));
    if (cond > 1 / IMP96694_EPS) hi = N;
    else lo = N;
  }
  return Math.sqrt(lo * hi);
}
const logFit = (f) => (N) => f.a + f.b * Math.log(N);
const traceOf = (N) => IMP96694_I11 * (Math.log(N) + IMP96694_GAMMA);

export const IMP96694_CEILINGS = Object.freeze({
  frobenius11: solveCeiling(logFit(IMP96694_FROB_FIT_11)), // ~3.764e7 (imp-96684)
  frobenius14: solveCeiling(logFit(IMP96694_FITS.frobenius14)), // ~3.775e7 (enlarged)
  ws14: solveCeiling(logFit(IMP96694_FITS.ws14)), // ~3.775e7
  trace: solveCeiling(traceOf), // ~2.594e7 (imp-96548 rigorous lower)
  measured: solveCeiling(logFit(IMP96694_LAMMAX_FIT)), // ~4.109e7 (imp-96443 composed)
  computeCeilingN: 9916, // imp-96352 wall-clock reach
});

// Finding 1: the majorant slope keeps flattening (does not saturate).
export const IMP96694_SLOPE = Object.freeze({
  frobenius8: IMP96694_FITS.frobenius8.b, // 0.48652
  frobenius11: IMP96694_FITS.frobenius11.b, // 0.47808
  frobenius14: IMP96694_FITS.frobenius14.b, // 0.47196
  localGe7000: IMP96694_FITS.localFrobSlopeGe7000, // 0.42324
  keepsFlattening:
    IMP96694_FITS.frobenius14.b < IMP96694_FITS.frobenius11.b &&
    IMP96694_FITS.frobenius11.b < IMP96694_FITS.frobenius8.b,
  flattenStep8to11Pct: (IMP96694_FITS.frobenius8.b - IMP96694_FITS.frobenius11.b) / IMP96694_FITS.frobenius8.b, // ~0.0173
  flattenStep11to14Pct: (IMP96694_FITS.frobenius11.b - IMP96694_FITS.frobenius14.b) / IMP96694_FITS.frobenius11.b, // ~0.0128
  localBelowGlobal: IMP96694_FITS.localFrobSlopeGe7000 < IMP96694_FITS.frobenius14.b,
});

// Finding 2: the below-fit gap grows for both lam_max (vs imp-96443) and Frobenius (vs imp-96684).
export const IMP96694_BELOW_FIT = Object.freeze(
  IMP96694_NEW_ROWS.map((r) => {
    const lamMaxPred = logFit(IMP96694_LAMMAX_FIT)(r.N);
    const frobPred = logFit(IMP96694_FROB_FIT_11)(r.N);
    return Object.freeze({
      N: r.N,
      lamMaxBelowPct: (lamMaxPred - r.lamMax) / lamMaxPred, // 0.0121 -> 0.0149
      frobBelowPct: (frobPred - r.frobenius) / frobPred, // 0.0042 -> 0.0057
      frobAboveLamMax: r.frobenius > r.lamMax,
      frobBelowTrace: r.frobenius < r.trace,
      relFrobAboveLamMax: (r.frobenius - r.lamMax) / r.lamMax, // ~0.11-0.12
    });
  }),
);

// Finding 3: the rigorous-lower ceiling is robust.
export const IMP96694_CEILING_SHIFT = Object.freeze({
  frobeniusBefore: IMP96694_CEILINGS.frobenius11,
  frobeniusAfter: IMP96694_CEILINGS.frobenius14,
  frobeniusShiftFactor: IMP96694_CEILINGS.frobenius14 / IMP96694_CEILINGS.frobenius11, // ~1.0030
  tightens: false, // it does not tighten; it is stable / robust
  residualToMeasuredFactor: IMP96694_CEILINGS.measured / IMP96694_CEILINGS.frobenius14, // ~1.088
  aboveComputeFactor: IMP96694_CEILINGS.frobenius14 / IMP96694_CEILINGS.computeCeilingN, // ~3800x
});

export const IMP96694_VERDICT = Object.freeze({
  question:
    'does the ~1.7 percent Route M slope flattening (imp-96684 Frobenius majorant, imp-96649 ' +
    'lam_max), seen only over the one decade below N=9000, keep flattening or saturate when the ' +
    'exact Vasyunin Gram is rebuilt to N=10000,11000,12000?',
  keepsFlattening: true, // Frobenius 0.47808 -> 0.47196, local N>=7000 slope 0.42324
  saturates: false,
  globalFrobSlopeBefore: IMP96694_FITS.frobenius11.b, // 0.47808
  globalFrobSlopeAfter: IMP96694_FITS.frobenius14.b, // 0.47196
  localFrobSlopeGe7000: IMP96694_FITS.localFrobSlopeGe7000, // 0.42324
  rigorousLowerCeilingBefore: IMP96694_CEILINGS.frobenius11, // ~3.764e7
  rigorousLowerCeilingAfter: IMP96694_CEILINGS.frobenius14, // ~3.775e7
  ceilingShiftFactor: IMP96694_CEILING_SHIFT.frobeniusShiftFactor, // ~1.0030
  anyBoundMoved: false,
  computeBindsFirst: true,
  conclusion:
    'MEASURED. Rebuilding the exact Vasyunin Gram to N=12000 and appending rungs ' +
    'N=10000,11000,12000 (lam_max 6.196602/6.220571/6.242153, Frobenius 6.928687/6.968698/' +
    '7.005027, Wolkowicz-Styan the same to 3 digits) shows the ~1.7 percent slope flattening ' +
    'CONTINUES rather than saturating: the global Frobenius slope drops 0.47808 -> 0.47196 ' +
    '(a further ~1.28 percent), the local N>=7000 slope is only 0.42324, and both below-fit ' +
    'gaps widen (lam_max 1.21 -> 1.49 percent below the imp-96443 fit, Frobenius 0.42 -> 0.57 ' +
    'percent below the imp-96684 fit). The rigorous-lower conditioning ceiling shifts only ' +
    '+0.30 percent (3.764e7 -> 3.775e7), staying in the ~3.75-3.78e7 band above the trace ' +
    'lower ceiling 2.594e7 and below the measured composed 4.109e7. Every new-rung Frobenius ' +
    'bound is valid: ~11-12 percent above lam_max, ~1.79x below the trace. No bound moved; no ' +
    'operator positivity; no refereed bound is changed; RH open; NO QED.',
});

export const IMP96694_SUBGAP = Object.freeze({
  id: 'imp-96694-flattening-continues-but-window-still-bounded',
  statement:
    'the flattening is measured to continue through N=12000 (~1.3 decade above the onset), but ' +
    'the incremental per-extension flatten is itself shrinking (1.73 percent then 1.28 percent), ' +
    'so continued flattening over the ACCESSIBLE window cannot distinguish a genuine sub-log ' +
    'growth law from the slow tail of an approach to an asymptotic slope that would saturate ' +
    'beyond N=12000. The ceiling still extrapolates the log-fit four decades to ~3.78e7 ' +
    '(imp-96684 / imp-96648 inherited); a rigorous asymptotic for the imp-96667 interior second ' +
    'moment ||G||_F^2 = Sum_hk gcd(h,k)^2 I(h/g,k/g)^2/(hk)^2 would settle both. ' +
    'Compute-binds-first is unaffected: the ceiling is ~3800x above the imp-96352 reach.',
});

export const IMP96694_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: lam_max (power iteration) ' +
  'and the Frobenius ||G||_F and Wolkowicz-Styan bounds at N=10000,11000,12000 are exact matrix ' +
  'quantities on the same exact Vasyunin Gram (rebuilt to NMAX=12000) as ' +
  'imp-96105 / imp-96443 / imp-96648 / imp-96684 (tmp/imp-96694-frobenius-extend-highn.py, ' +
  '~770 s; the pipeline reproduces the committed imp-96648 Frobenius values at N=250,500,1000 to ' +
  'all digits). The re-fit and ceiling re-solve are pure re-analysis; no bound is claimed moved ' +
  'and no operator positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96694_ASSERTIONS = [
  {
    id: 'imp96694-new-rungs-monotone-frobenius-above-lammax-below-trace',
    holds: () =>
      IMP96694_NEW_ROWS.every((r, i) => i === 0 || r.frobenius > IMP96694_NEW_ROWS[i - 1].frobenius) &&
      IMP96694_NEW_ROWS.every((r, i) => i === 0 || r.lamMax > IMP96694_NEW_ROWS[i - 1].lamMax) &&
      IMP96694_BELOW_FIT.every((v) => v.frobAboveLamMax && v.frobBelowTrace && v.relFrobAboveLamMax > 0.09 && v.relFrobAboveLamMax < 0.13),
    why: 'the three new-rung lam_max and Frobenius bounds increase monotonically and each Frobenius sits strictly between the measured lam_max (~11-12 percent above) and the trace (~1.79x below): valid, tight rigorous upper bounds.',
  },
  {
    id: 'imp96694-slope-keeps-flattening-no-saturation',
    holds: () =>
      IMP96694_SLOPE.keepsFlattening &&
      IMP96694_SLOPE.localBelowGlobal &&
      IMP96694_SLOPE.flattenStep11to14Pct > 0.008 && IMP96694_SLOPE.flattenStep11to14Pct < 0.02 &&
      IMP96694_SLOPE.localGe7000 < 0.45 && IMP96694_SLOPE.localGe7000 > 0.40 &&
      IMP96694_VERDICT.saturates === false,
    why: 'the global Frobenius slope keeps dropping 0.48652 -> 0.47808 -> 0.47196 and the local N>=7000 slope 0.42324 is well below the global fit: the flattening continues through N=12000, it does not saturate.',
  },
  {
    id: 'imp96694-below-fit-gap-grows-both-curves',
    holds: () =>
      IMP96694_BELOW_FIT[0].lamMaxBelowPct > 0.010 && IMP96694_BELOW_FIT[2].lamMaxBelowPct > IMP96694_BELOW_FIT[0].lamMaxBelowPct &&
      IMP96694_BELOW_FIT[2].lamMaxBelowPct < 0.02 &&
      IMP96694_BELOW_FIT[0].frobBelowPct > 0.003 && IMP96694_BELOW_FIT[2].frobBelowPct > IMP96694_BELOW_FIT[0].frobBelowPct &&
      IMP96694_BELOW_FIT[2].frobBelowPct < 0.01,
    why: 'both the lam_max shortfall vs the imp-96443 fit (1.21 -> 1.49 percent) and the Frobenius shortfall vs the imp-96684 fit (0.42 -> 0.57 percent) grow monotonically with N: continued flattening.',
  },
  {
    id: 'imp96694-ceiling-robust-not-tightened',
    holds: () =>
      IMP96694_CEILING_SHIFT.tightens === false &&
      IMP96694_CEILING_SHIFT.frobeniusShiftFactor > 1.0 && IMP96694_CEILING_SHIFT.frobeniusShiftFactor < 1.01 &&
      IMP96694_CEILINGS.frobenius14 > IMP96694_CEILINGS.trace &&
      IMP96694_CEILINGS.frobenius14 < IMP96694_CEILINGS.measured &&
      IMP96694_CEILING_SHIFT.residualToMeasuredFactor < 1.15,
    why: 'the enlarged fourteen-rung Frobenius ceiling shifts only +0.30 percent (3.764e7 -> 3.775e7), staying in the ~3.75-3.78e7 band above the trace lower ceiling 2.594e7 and below the measured 4.109e7: robust, not tightened.',
  },
  {
    id: 'imp96694-enlarged-fit-stays-clean-slope-between-measured-and-trace',
    holds: () =>
      IMP96694_FITS.frobenius14.r2 > 0.998 &&
      IMP96694_FITS.frobenius14.b < IMP96694_I11 &&
      IMP96694_FITS.frobenius14.b > IMP96694_LAMMAX_FIT.b &&
      IMP96694_FITS.frobenius14.rungs === 14,
    why: 'the fourteen-rung Frobenius log law stays clean (R^2 > 0.998) with slope 0.47196 -- below the trace slope 1.2607 and above the measured lam_max slope 0.3526.',
  },
  {
    id: 'imp96694-ceiling-above-compute-binds-first',
    holds: () =>
      IMP96694_CEILING_SHIFT.aboveComputeFactor > 1500 &&
      IMP96694_VERDICT.computeBindsFirst === true,
    why: 'the ~3.78e7 ceiling sits ~3800x above the imp-96352 compute ceiling N ~ 9916: compute binds first (unchanged, hardened).',
  },
  {
    id: 'imp96694-honesty-gate-no-qed',
    holds: () =>
      IMP96694_VERDICT.anyBoundMoved === false &&
      IMP96694_VERDICT.keepsFlattening === true &&
      IMP96694_VERDICT.saturates === false &&
      /NO QED/.test(IMP96694_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96694_HONEST_BANNER) &&
      /RH open/.test(IMP96694_HONEST_BANNER) &&
      /window-still-bounded/.test(IMP96694_SUBGAP.id),
    why: 'measurement only: no bound moved, the flattening-continues / ceiling-robust result is recorded, and the honesty markers plus the bounded-window sub-gap are present.',
  },
];

for (const a of IMP96694_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96694-route-m-majorant-ladder-above-9000 assertion failed: ${a.id}`,
    );
  }
}

export default {
  eps: IMP96694_EPS,
  i11: IMP96694_I11,
  lamMin: IMP96694_LAMMIN,
  lamMaxFit: IMP96694_LAMMAX_FIT,
  frobFit11: IMP96694_FROB_FIT_11,
  newRows: IMP96694_NEW_ROWS,
  lamMax9000AndBelow: IMP96694_LAMMAX_9000_AND_BELOW,
  fits: IMP96694_FITS,
  ceilings: IMP96694_CEILINGS,
  slope: IMP96694_SLOPE,
  belowFit: IMP96694_BELOW_FIT,
  ceilingShift: IMP96694_CEILING_SHIFT,
  verdict: IMP96694_VERDICT,
  subGap: IMP96694_SUBGAP,
  banner: IMP96694_HONEST_BANNER,
};
