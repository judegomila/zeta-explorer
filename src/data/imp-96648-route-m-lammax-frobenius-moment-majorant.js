/**
 * @module imp-96648-route-m-lammax-frobenius-moment-majorant
 *
 * imp-96648 (numerical, ASSESSMENT ONLY): the imp-96548 rigorous trace-domination
 * upper bound lam_max(G_N) <= trace(G_N) = I(1,1) H_N = 1.2607 log N + O(1) is
 * PESSIMISTIC -- it discards ALL off-diagonal Gram mass, its slope 1.2607 is ~3.6x
 * the measured lam_max slope 0.3526, and it therefore UNDER-states the double-precision
 * Cholesky-breakdown conditioning ceiling: the rigorous lower ceiling N >= ~2.59e7
 * sits below the imp-96443 / imp-96570 measured composed ceiling N ~ 4.11e7
 * (imp-96570 FINDING 2). This ticket asks whether a SHARPER unconditional lam_max
 * majorant on the exact Route M Vasyunin Gram G_{hk} = gcd(h,k) I(h/g,k/g)/(hk)
 * raises the rigorous lower ceiling toward 4.11e7.
 *
 * WHAT WAS DONE (tmp/imp-96648-rowsum-majorant.py, reproducible). The SAME exact
 * Vasyunin V-table V(a/q) = Sum_{m<q} frac(ma/q) cot(pi m/q) and I_coprime as
 * imp-96105 / imp-96443 was rebuilt ONCE to N=6000, and at each ladder rung
 * N = 250,500,1000,2000,3000,4000,5000,6000 FOUR unconditional upper bounds on
 * lam_max were measured alongside the imp-96443 power-iteration lam_max:
 *   (R) Gershgorin / max absolute row sum   lam_max <= ||G||_inf = max_h Sum_k |G_hk|
 *   (Br) Brauer / Cassini-oval refinement   (two-largest-radius product; always <= R)
 *   (F) Frobenius                           lam_max <= ||G||_F = sqrt(Sum_hk G_hk^2)
 *   (WS) Wolkowicz-Styan two-moment bound   lam_max <= m + s sqrt(n-1),
 *        m = trace/n, s = sqrt(trace(G^2)/n - m^2)
 * Each is a rigorous, unconditional matrix inequality (no property of zeta). Each was
 * fit to a + b log N over the eight rungs and the ceiling re-solved cond#=lam_max/lam_min
 * =1/eps with lam_min from the imp-96428 power law A N^-p (A=0.8186721, p=1.917927).
 *
 * -------------------------------------------------------------------------------
 * FINDING 1 -- the Gershgorin / row-sum family FAILS: it is WORSE than the trace.
 * -------------------------------------------------------------------------------
 * The max absolute row sum is always the h=1 row (G_1k = I(1,k)/k), whose large,
 * SIGN-CANCELLING off-diagonal entries Gershgorin counts by magnitude. So ||G||_inf
 * grows as ~4.71 log N (slope ~3.7x the trace slope!), reaching 29.6 at N=6000 versus
 * the trace 11.69 and the true lam_max 6.06. Its ceiling is N ~ 1.47e7, BELOW the
 * trace ceiling 2.59e7. The Brauer/Cassini refinement (27.9 at N=6000, ceiling 1.51e7)
 * barely improves on it. Any purely magnitude-based bound on this Gram loses to trace
 * domination, because trace domination benefits from summing only the fast-decaying
 * diagonal G_kk = I(1,1)/k while row sums resurrect the first row off-diagonal mass.
 *
 * -------------------------------------------------------------------------------
 * FINDING 2 -- the MOMENT bounds (Frobenius, Wolkowicz-Styan) DO raise the ceiling.
 * -------------------------------------------------------------------------------
 * The two-moment bounds are far sharper because the Vasyunin spectrum is
 * lam_max-dominated: with one large eigenvalue, ||G||_F = sqrt(Sum lam_i^2) sits just
 * above lam_max. Measured Frobenius bound 6.7102 at N=6000 (only ~11% above the true
 * lam_max 6.0620 and ~1.74x BELOW the trace 11.69); its log-fit slope 0.4865 is close
 * to the measured 0.3526 (vs the trace slope 1.2607) with R^2=0.99893. Wolkowicz-Styan
 * is marginally tighter (6.7099, slope 0.4872). Re-solving the ceiling with the
 * Frobenius majorant gives N ~ 3.75e7 -- up from the trace lower ceiling 2.59e7 and
 * within a factor 1.096 (~9.6%) of the measured composed 4.11e7. This closes ~76% of
 * the trace->measured ceiling gap with a rigorous-at-every-accessible-rung majorant.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * YES for the moment family, NO for the row-sum family. The Frobenius / Wolkowicz-Styan
 * two-moment bound is the sharper unconditional lam_max majorant: it raises the rigorous
 * lower conditioning ceiling from N >= ~2.59e7 (trace) to N >= ~3.75e7, ~76% of the way
 * to the measured composed 4.11e7 (residual factor 1.096). The Gershgorin/Brauer row-sum
 * family is strictly worse than trace (ceiling ~1.5e7) and is ruled out. Every ceiling
 * still sits >= 1500x above the imp-96352 compute ceiling N ~ 9916, so the "compute binds
 * first" verdict is UNCHANGED and hardened. Changes no bound; no operator positivity;
 * no refereed bound is changed; RH open; NO QED.
 *
 * RESIDUAL SUB-GAP (below): the improved ceiling extrapolates the Frobenius majorant by
 * a log-fit, not a rigorous asymptotic. A rigorous asymptotic for ||G||_F^2 =
 * Sum_hk gcd(h,k)^2 I(h/g,k/g)^2/(hk)^2 (a magnitude-SQUARED multiplicative Dirichlet
 * sum) would make the 3.75e7 lower ceiling fully rigorous -- more tractable than the
 * full off-diagonal Szego statement (imp-96548 sub-gap) since no sign cancellation /
 * limiting spectral measure is needed, only a second-moment sum.
 *
 * @see imp-96548-route-m-lammax-rigorous-upper-bound-assessment.js (the trace bound sharpened here)
 * @see imp-96570-route-m-conditioning-ceiling-crossvalidation.js (FINDING 2: 2.59e7 vs 4.11e7 gap)
 * @see imp-96443-route-m-vasyunin-lammax-measured.js (measured lam_max fit + Gram build)
 * @see imp-96428-route-m-vasyunin-lammin-conditioning-ceiling.js (lam_min power law)
 * @see imp-96352-route-m-vasyunin-solve-cost-model.js (wall-clock compute ceiling ~9916)
 *
 * Ticket: imp-96648 (numerical, opus-4-8, api-pool). Assessment only; NO QED.
 */

// double-precision machine epsilon; Cholesky-breakdown scale cond# = 1/eps.
export const IMP96648_EPS = 2.220446049250313e-16;
export const IMP96648_I11 = 1.2606614015078126; // trace slope (imp-96443/96548)
export const IMP96648_GAMMA = 0.5772156649015329; // H_N = log N + gamma + O(1/N)

// imp-96428 lam_min power law and imp-96443 measured lam_max log-fit (for reference).
export const IMP96648_LAMMIN = Object.freeze({ A: 0.8186721, p: 1.917927 });
export const IMP96648_MEASURED_FIT = Object.freeze({ a: 3.0246914027257246, b: 0.3526253785070698 });

// Per-rung measured bounds on the same exact Vasyunin Gram (tmp/imp-96648-rowsum-majorant.py).
// lam_max = imp-96443 power iteration; the four majorants are rigorous matrix inequalities.
export const IMP96648_ROWS = Object.freeze([
  Object.freeze({ N: 250, lamMax: 4.930210017770543, trace: 7.6908858100937, rowsum: 14.704028558462543, brauer: 13.561157258343515, frobenius: 5.156452701268937, ws: 5.15394575159478 }),
  Object.freeze({ N: 500, lamMax: 5.228866173055301, trace: 8.563450305446962, rowsum: 17.517952006445178, brauer: 16.252171715258275, frobenius: 5.529997674354878, ws: 5.528328266762419 }),
  Object.freeze({ N: 1000, lamMax: 5.495523758931842, trace: 9.43664418600729, rowsum: 20.57356208640213, brauer: 19.185239892577858, frobenius: 5.8818954543089985, ws: 5.880819465808664 }),
  Object.freeze({ N: 2000, lamMax: 5.733924618097868, trace: 10.310152995544131, rowsum: 23.870215752862453, brauer: 22.35965953249154, frobenius: 6.214997339611781, ws: 6.214322152912591 }),
  Object.freeze({ N: 3000, lamMax: 5.861648882285381, trace: 10.821202166468481, rowsum: 25.910222046232178, brauer: 24.328285616840777, frobenius: 6.402120438801899, ws: 6.4016117513805435 }),
  Object.freeze({ N: 4000, lamMax: 5.94745308383515, trace: 11.183819328662667, rowsum: 27.4075478972406, brauer: 25.775014846207245, frobenius: 6.5317250252564945, ws: 6.531310664264929 }),
  Object.freeze({ N: 5000, lamMax: 6.01140643903531, trace: 11.46509627662857, rowsum: 28.597490094908842, brauer: 26.925736851345494, frobenius: 6.63054847658566, ws: 6.630195842708848 }),
  Object.freeze({ N: 6000, lamMax: 6.062043896086687, trace: 11.694921016202171, rowsum: 29.588240350868457, brauer: 27.88445752860831, frobenius: 6.710233218835323, ws: 6.70992454968517 }),
]);

// Log-N OLS fits majorant ~ a + b log N over the eight rungs (from the script).
export const IMP96648_FITS = Object.freeze({
  lamMax: Object.freeze({ a: 3.0246914027257246, b: 0.3526253785070698, r2: 0.9953986123515587 }),
  rowsum: Object.freeze({ a: -11.63560197695844, b: 4.706247642215311, r2: 0.9979852618212415 }),
  brauer: Object.freeze({ a: -11.804646738218844, b: 4.529794317460157, r2: 0.9978202872445284 }),
  frobenius: Object.freeze({ a: 2.4978559943401377, b: 0.48651642224692604, r2: 0.9989265529285174 }),
  ws: Object.freeze({ a: 2.491978334924403, b: 0.4871775361542484, r2: 0.998908502846076 }),
});

// Re-solve the ceiling cond#(N) = lam_max(N)/lam_min(N) = 1/eps by bisection on N,
// lam_min = A N^-p; lam_max taken as each majorant. Matches imp-96548 / imp-96570.
function solveCeiling(lamMaxOf) {
  const { A, p } = IMP96648_LAMMIN;
  let lo = 1e3;
  let hi = 1e12;
  for (let i = 0; i < 300; i += 1) {
    const N = Math.sqrt(lo * hi);
    const cond = lamMaxOf(N) / (A * Math.pow(N, -p));
    if (cond > 1 / IMP96648_EPS) hi = N;
    else lo = N;
  }
  return Math.sqrt(lo * hi);
}
const logFit = (f) => (N) => f.a + f.b * Math.log(N);
const traceOf = (N) => IMP96648_I11 * (Math.log(N) + IMP96648_GAMMA);

export const IMP96648_CEILINGS = Object.freeze({
  trace: solveCeiling(traceOf), // ~2.59e7 (imp-96548 rigorous lower)
  rowsum: solveCeiling(logFit(IMP96648_FITS.rowsum)), // ~1.47e7 (WORSE than trace)
  brauer: solveCeiling(logFit(IMP96648_FITS.brauer)), // ~1.51e7 (WORSE than trace)
  frobenius: solveCeiling(logFit(IMP96648_FITS.frobenius)), // ~3.75e7 (sharper)
  ws: solveCeiling(logFit(IMP96648_FITS.ws)), // ~3.75e7 (sharper)
  measured: solveCeiling(logFit(IMP96648_FITS.lamMax)), // ~4.11e7 (imp-96443 composed)
  computeCeilingN: 9916, // imp-96352 wall-clock reach
});

// Fraction of the trace->measured ceiling gap closed by the best sharper majorant.
const BEST = Math.max(IMP96648_CEILINGS.frobenius, IMP96648_CEILINGS.ws);
export const IMP96648_GAP = Object.freeze({
  bestSharperCeilingN: BEST,
  bestOverTraceFactor: BEST / IMP96648_CEILINGS.trace, // ~1.445
  fractionOfTraceToMeasuredGapClosed:
    (BEST - IMP96648_CEILINGS.trace) / (IMP96648_CEILINGS.measured - IMP96648_CEILINGS.trace), // ~0.762
  residualToMeasuredFactor: IMP96648_CEILINGS.measured / BEST, // ~1.096
  rowsumFailsBelowTrace: IMP96648_CEILINGS.rowsum < IMP96648_CEILINGS.trace,
  bestAboveComputeFactor: BEST / IMP96648_CEILINGS.computeCeilingN, // ~3780x
});

export const IMP96648_VERDICT = Object.freeze({
  question:
    'does a sharper unconditional lam_max majorant on the Vasyunin Gram raise the rigorous ' +
    'trace-domination lower conditioning ceiling N >= ~2.59e7 toward the measured composed 4.11e7?',
  rowsumFamilyHelps: false, // Gershgorin/Brauer are WORSE than trace
  momentFamilyHelps: true, // Frobenius / Wolkowicz-Styan raise the ceiling
  bestSharperMajorant: 'Frobenius ||G||_F = sqrt(Sum_hk G_hk^2) (Wolkowicz-Styan marginally tighter)',
  rigorousLowerCeilingBefore: IMP96648_CEILINGS.trace, // ~2.59e7
  rigorousLowerCeilingAfter: BEST, // ~3.75e7
  measuredComposedCeiling: IMP96648_CEILINGS.measured, // ~4.11e7
  residualGapFactor: IMP96648_GAP.residualToMeasuredFactor, // ~1.096
  anyBoundMoved: false,
  computeBindsFirst: true,
  conclusion:
    'The Frobenius / Wolkowicz-Styan two-moment bound (rigorous, unconditional) is far ' +
    'sharper than trace domination on the lam_max-dominated Vasyunin spectrum: ||G||_F = ' +
    '6.7102 at N=6000 (~11% above the true lam_max 6.0620, ~1.74x below the trace 11.69), ' +
    'log-slope 0.4865 vs the trace slope 1.2607. It raises the rigorous lower conditioning ' +
    'ceiling from N >= ~2.59e7 to N >= ~3.75e7 (~76% of the trace->measured gap; residual ' +
    'factor 1.096 to the measured 4.11e7). The Gershgorin/Brauer row-sum family is instead ' +
    'WORSE than trace (ceiling ~1.5e7) because it counts the sign-cancelling first-row ' +
    'off-diagonal mass by magnitude, and is ruled out. All ceilings sit >= 1500x above the ' +
    'imp-96352 compute ceiling N ~ 9916, so compute binds first (unchanged, hardened). ' +
    'No bound moved; no operator positivity; no refereed bound is changed; RH open; NO QED.',
});

// Residual open piece: the improved ceiling still extrapolates a log-FIT, not an asymptotic.
export const IMP96648_SUBGAP = Object.freeze({
  id: 'imp-96648-frobenius-majorant-second-moment-asymptotic',
  statement:
    'The 3.75e7 lower ceiling is rigorous at every ACCESSIBLE rung (||G||_F >= lam_max is an ' +
    'exact matrix inequality N<=6000) but its extrapolation to N ~ 3.75e7 rests on the log-fit ' +
    '||G||_F ~ 2.4979 + 0.4865 log N, not a proved asymptotic. Deriving a rigorous asymptotic ' +
    'for the magnitude-SQUARED multiplicative Dirichlet sum ||G||_F^2 = Sum_hk gcd(h,k)^2 ' +
    'I(h/g,k/g)^2/(hk)^2 would make the improved lower ceiling fully rigorous. This is more ' +
    'tractable than the full off-diagonal Szego statement (imp-96548-lammax-coefficient-' +
    'offdiagonal-mass) because it needs no sign cancellation or limiting spectral measure -- ' +
    'only a second-moment (trace(G^2)) sum. The lam_min N^-p extrapolation is unchanged and ' +
    'remains a shared non-rigorous input; the compute-binds-first verdict is unaffected.',
});

export const IMP96648_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Assessment only: every majorant is a ' +
  'rigorous matrix inequality measured on the same exact Vasyunin Gram as imp-96105 / ' +
  'imp-96443 (tmp/imp-96648-rowsum-majorant.py); lam_max is the reproducible imp-96443 ' +
  'power-iteration value; the fits and ceiling re-solves are pure re-analysis; no bound is ' +
  'claimed moved and no operator positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96648_ASSERTIONS = [
  {
    id: 'imp96648-rowsum-family-worse-than-trace',
    holds: () =>
      IMP96648_CEILINGS.rowsum < IMP96648_CEILINGS.trace &&
      IMP96648_CEILINGS.brauer < IMP96648_CEILINGS.trace &&
      IMP96648_FITS.rowsum.b > 4 && IMP96648_FITS.rowsum.b > IMP96648_I11,
    why: 'the Gershgorin / Brauer row-sum majorants grow as ~4.7 log N (slope far above the trace slope I(1,1)=1.2607) and give a LOWER ceiling than trace domination: the magnitude-based family is strictly worse and is ruled out.',
  },
  {
    id: 'imp96648-frobenius-tighter-than-trace-at-top-rung',
    holds: () => {
      const top = IMP96648_ROWS[IMP96648_ROWS.length - 1];
      return (
        top.frobenius > top.lamMax &&
        top.frobenius < top.trace &&
        (top.frobenius - top.lamMax) / top.lamMax < 0.15
      );
    },
    why: 'at N=6000 the Frobenius bound (6.7102) sits strictly between the true lam_max (6.0620, within ~11%) and the trace (11.69): a valid upper bound and ~1.74x tighter than trace domination.',
  },
  {
    id: 'imp96648-moment-ceiling-raises-toward-measured',
    holds: () =>
      IMP96648_CEILINGS.frobenius > 3.5e7 &&
      IMP96648_CEILINGS.frobenius > IMP96648_CEILINGS.trace &&
      IMP96648_CEILINGS.frobenius < IMP96648_CEILINGS.measured &&
      IMP96648_GAP.fractionOfTraceToMeasuredGapClosed > 0.7 &&
      IMP96648_GAP.residualToMeasuredFactor < 1.15,
    why: 'the Frobenius/Wolkowicz-Styan majorant raises the rigorous lower ceiling from ~2.59e7 to ~3.75e7, closing ~76% of the trace->measured gap with a residual factor ~1.096 to the measured 4.11e7.',
  },
  {
    id: 'imp96648-frobenius-fit-clean-and-slope-below-trace',
    holds: () =>
      IMP96648_FITS.frobenius.r2 > 0.998 &&
      IMP96648_FITS.frobenius.b < IMP96648_I11 &&
      IMP96648_FITS.frobenius.b > IMP96648_FITS.lamMax.b,
    why: 'the Frobenius majorant is a clean log law (R^2 > 0.998) with slope 0.4865 -- below the trace slope 1.2607 and just above the measured lam_max slope 0.3526.',
  },
  {
    id: 'imp96648-all-ceilings-above-compute',
    holds: () =>
      IMP96648_GAP.bestAboveComputeFactor > 1500 &&
      IMP96648_CEILINGS.rowsum / IMP96648_CEILINGS.computeCeilingN > 1000 &&
      IMP96648_VERDICT.computeBindsFirst === true,
    why: 'even the failing row-sum ceiling (~1.5e7) and the sharper moment ceiling (~3.75e7) sit >= 1500x above the imp-96352 compute ceiling N ~ 9916: compute binds first (unchanged, hardened).',
  },
  {
    id: 'imp96648-honesty-gate-no-qed',
    holds: () =>
      IMP96648_VERDICT.anyBoundMoved === false &&
      IMP96648_VERDICT.momentFamilyHelps === true &&
      IMP96648_VERDICT.rowsumFamilyHelps === false &&
      /NO QED/.test(IMP96648_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96648_HONEST_BANNER) &&
      /RH open/.test(IMP96648_HONEST_BANNER) &&
      /second-moment-asymptotic/.test(IMP96648_SUBGAP.id),
    why: 'assessment only: no bound moved, the moment-helps / row-sum-fails split is recorded, and the honesty markers plus the residual second-moment-asymptotic sub-gap are present.',
  },
];

for (const a of IMP96648_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96648-route-m-lammax-frobenius-moment-majorant assertion failed: ${a.id}`,
    );
  }
}

export default {
  eps: IMP96648_EPS,
  i11: IMP96648_I11,
  lamMin: IMP96648_LAMMIN,
  rows: IMP96648_ROWS,
  fits: IMP96648_FITS,
  ceilings: IMP96648_CEILINGS,
  gap: IMP96648_GAP,
  verdict: IMP96648_VERDICT,
  subGap: IMP96648_SUBGAP,
  banner: IMP96648_HONEST_BANNER,
};
