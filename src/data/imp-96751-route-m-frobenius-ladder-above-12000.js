/**
 * @module imp-96751-route-m-frobenius-ladder-above-12000
 *
 * imp-96751 (numerical, MEASUREMENT ONLY): extend the exact ||G_N||_F Vasyunin-Gram rows
 * PAST N=12000 (imp-96694 stopped there) to N=13000,14000,15000,16000, tighten the empirical
 * bracket on the interior second-moment coefficient s (imp-96667 measured the total second
 * moment ||G||_F^2 ~ -5.4839 + 5.8048 log N on rows N<=6000; imp-96731 Finding 4), refit the
 * candidate one-sided s* and the log vs sqrt(s log N) functional form, and re-solve how far a
 * rigorous interior asymptotic would raise the Route M rigorous-lower conditioning ceiling.
 *
 * THE ISSUE. imp-96731 Finding 4 estimates that a PROVEN interior upper asymptotic would raise
 * the rigorous-lower conditioning ceiling from the trace lower T=2.594e7 toward ~3.78e7 (the
 * log-linear form, =F) or ~3.98e7 (the imp-96667 sqrt(s log N) form with measured s=5.8048),
 * within ~3 percent of the imp-96443 measured composed M=4.109e7. But s and the Int(N) growth
 * shape were known only through the exact Gram rows to N=12000 (imp-96694). This ticket rebuilds
 * the exact Vasyunin Gram four rungs higher and asks the direct measurement question: does the
 * interior coefficient s hold near 5.80, and does the sqrt(s log N) form's higher ceiling survive?
 *
 * WHAT WAS DONE (tmp/imp-96751-frobenius-extend-16000.py, reproducible; NMAX=16000, ~1916 s
 * wall). The SAME exact Vasyunin V-table V(a/q)=Sum_{m<q} frac(ma/q) cot(pi m/q) and I_coprime
 * construction as imp-96105 / imp-96443 / imp-96684 / imp-96694 was rebuilt to N=16000. At
 * N=13000,14000,15000,16000 five quantities were measured:
 *   trace     exact matrix trace
 *   (F)  Frobenius       lam_max le ||G||_F = sqrt(trace(G^2)) = sqrt(Sum_hk G_hk^2)
 *   frob2     ||G||_F^2 = the total second moment (the imp-96667 object)
 *   (WS) Wolkowicz-Styan lam_max le m + s sqrt(n-1),  m=trace/n, s=sqrt(trace(G^2)/n - m^2)
 *   lam_max   exact top eigenvalue (power iteration, the imp-96649 routine)
 * All are exact matrix quantities / rigorous unconditional matrix inequalities (no property of
 * zeta); lam_max is measured. Over the full exact ladder (250..16000, 18 rungs) s was refit as
 * the slope of ||G||_F^2 vs log N, a local high-N (N ge 7000) slope taken, the log-linear norm
 * ||G||_F ~ a + b log N refit, and the four candidate ceilings re-solved. Measurement / re-fit
 * only; posts no rigorous ceiling; changes no bound; NO QED.
 *
 * -------------------------------------------------------------------------------
 * FINDING 1 -- the interior coefficient s HOLDS near 5.81; it drifts slightly UP, not down.
 * -------------------------------------------------------------------------------
 * Refitting s = d(||G||_F^2)/d(log N) over the full 18-rung exact ladder (250..16000) gives
 * s=5.81528 (R^2=0.9999965, near-perfect log law), a hair ABOVE the imp-96667 N<=6000 value
 * 5.80481; the local high-N slope over the N ge 7000 rungs is 5.83406, above both. So the
 * interior second-moment coefficient is stable in the tight ~5.80-5.83 band and, if anything,
 * edges upward at large N -- the opposite of the ||G||_F log-linear-norm slope, which flattens.
 * A candidate one-sided upper s* would need to sit at or above ~5.834 to dominate the measured
 * high-N behaviour; the measurement neither proves nor refutes such a bound (that is imp-96750).
 *
 * -------------------------------------------------------------------------------
 * FINDING 2 -- the sqrt(s log N) form's HIGHER ceiling survives: ~3.98e7, closing 91 percent
 * of the trace->measured gap.
 * -------------------------------------------------------------------------------
 * The imp-96667 correct functional form ||G||_F = sqrt(s_a + s log N) (with the refit s_a,s)
 * re-solves the ceiling to 3.9755e7 -- ABOVE the log-linear-norm fit's 3.7865e7 -- and closes
 * 91.20 percent of the trace-lower->measured-composed gap (2.5937e7 -> 4.1089e7). The two
 * candidate rigorous forms therefore bracket the achievable ceiling at ~3.79e7 (log-linear
 * norm) to ~3.98e7 (sqrt second moment), both firmly above the trace lower ceiling 2.594e7 and
 * below the measured composed ceiling 4.109e7. The imp-96731 Finding-4 estimate is CONFIRMED
 * and sharpened: a proven interior asymptotic buys ~1.46x-1.53x over the trace lower ceiling.
 *
 * -------------------------------------------------------------------------------
 * FINDING 3 -- every new-rung Frobenius bound stays valid and tight.
 * -------------------------------------------------------------------------------
 * The four new rungs are monotone (Frobenius 7.038283 -> 7.123836, lam_max 6.261759 ->
 * 6.311535, trace 12.669595 -> 12.931349) and each Frobenius bound sits strictly between the
 * measured lam_max (~12-13 percent above) and the trace (~1.81x below): valid, tight rigorous
 * upper bounds at every rung, extending the imp-96694 ladder cleanly by four rungs.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * Extending the exact Vasyunin Gram to N=16000 shows the interior second-moment coefficient s
 * holds near 5.81 (full-ladder 5.81528, local N ge 7000 5.83406, vs imp-96667 5.80481 --
 * stable, edging up), and the imp-96667 sqrt(s log N) form's higher ceiling ~3.98e7 survives,
 * closing 91 percent of the trace->measured gap. The two candidate rigorous forms bracket the
 * achievable ceiling at ~3.79e7-3.98e7. No rigorous ceiling is posted (that needs the imp-96750
 * one-sided s* bound); no bound moved; no operator positivity; no refereed bound is changed;
 * RH open; NO QED.
 *
 * RESIDUAL SUB-GAP (below): s is measured, not proven -- the ~5.80-5.83 bracket and the ~3.98e7
 * ceiling both rest on an empirical log law over an exact but still bounded window (N=16000 is
 * ~0.4 decade above N=12000, ~2 decades below the ceiling scale). The higher sqrt-form ceiling
 * is only realised if a rigorous one-sided upper bound Int(N) <= s* log N is proved (imp-96750);
 * the s edging up at large N means a naive s*=5.8048 upper bound would already be VIOLATED by the
 * measured N ge 7000 slope 5.834, so the one-sided constant must be chosen above the measured
 * high-N slope, not at the low-N fit.
 *
 * @see imp-96694-route-m-majorant-ladder-above-9000.js (the ladder extended here, to N=12000)
 * @see imp-96667-route-m-frobenius-second-moment-asymptotic.js (interior second moment, s=5.8048 on N<=6000)
 * @see imp-96708-route-m-interior-second-moment-dichotomy.js (Int(N) diverges with genuine log-N growth)
 * @see imp-96731-route-m-trace-ceiling-tightening-assessment.js (Finding 4: lever buys T->~3.78-3.98e7)
 * @see imp-96443-route-m-vasyunin-lammax-measured.js (measured lam_max composed ceiling ~4.109e7)
 *
 * Ticket: imp-96751 (numerical, opus-4-8, api-pool). Measurement only; NO QED.
 */

// double-precision machine epsilon; Cholesky-breakdown scale cond# = 1/eps.
export const IMP96751_EPS = 2.220446049250313e-16;
export const IMP96751_I11 = 1.2606614015078126; // trace slope (imp-96443/96548)
export const IMP96751_GAMMA = 0.5772156649015329; // H_N = log N + gamma + O(1/N)

// imp-96428 lam_min power law; imp-96443 measured lam_max log-fit.
export const IMP96751_LAMMIN = Object.freeze({ A: 0.8186721, p: 1.917927 });
export const IMP96751_LAMMAX_FIT = Object.freeze({ a: 3.0246914027257246, b: 0.3526253785070698 }); // imp-96443

// The four genuinely NEW measured rungs above N=12000, on the SAME exact Vasyunin Gram rebuilt
// to NMAX=16000 (tmp/imp-96751-frobenius-extend-16000.py). trace, frob2 and ||G||_F are exact
// matrix quantities; Frobenius and Wolkowicz-Styan are rigorous unconditional matrix
// inequalities; lam_max is measured by power iteration (the imp-96649 routine).
export const IMP96751_NEW_ROWS = Object.freeze([
  Object.freeze({ N: 13000, trace: 12.669595098, frob2: 49.537433808, frobenius: 7.038283442, ws: 7.038110124, lamMax: 6.261759163 }),
  Object.freeze({ N: 14000, trace: 12.763016695, frob2: 49.969849819, frobenius: 7.068935551, ws: 7.068771720, lamMax: 6.279702484 }),
  Object.freeze({ N: 15000, trace: 12.849990344, frob2: 50.372434632, frobenius: 7.097354059, ws: 7.097198615, lamMax: 6.296229224 }),
  Object.freeze({ N: 16000, trace: 12.931348940, frob2: 50.749040001, frobenius: 7.123836045, ws: 7.123688077, lamMax: 6.311535458 }),
]);

// Interior second-moment coefficient s = slope of ||G||_F^2 vs log N.
// imp-96667 measured s=5.80481 on rows N<=6000; here refit over the full exact ladder and locally.
export const IMP96751_S = Object.freeze({
  imp96667Le6000: 5.80481, // imp-96667 (rows N<=6000)
  full250to16000: 5.81527999466881, // 18-rung full exact ladder
  full250to16000Intercept: -5.556434847136,
  full250to16000R2: 0.9999964977139947,
  localGe7000: 5.834064964356038, // local high-N slope over N>=7000 rungs
  driftsUp:
    5.81527999466881 > 5.80481 && 5.834064964356038 > 5.81527999466881,
});

// log-linear norm form ||G||_F ~ a + b log N over the full 18-rung exact ladder.
export const IMP96751_LOGLINEAR_NORM = Object.freeze({
  a: 2.642452826108074,
  b: 0.4656959846866509,
  r2: 0.998245309673608,
});

// Re-solve the ceiling cond#(N)=lam_max(N)/lam_min(N)=1/eps by bisection; matches imp-96694.
function solveCeiling(froOf) {
  const { A, p } = IMP96751_LAMMIN;
  let lo = 1e3;
  let hi = 1e12;
  for (let i = 0; i < 300; i += 1) {
    const N = Math.sqrt(lo * hi);
    const cond = froOf(N) / (A * Math.pow(N, -p));
    if (cond > 1 / IMP96751_EPS) hi = N;
    else lo = N;
  }
  return Math.sqrt(lo * hi);
}
// imp-96667 correct functional form: ||G||_F = sqrt(s_a + s log N).
const froSqrt = (N) => {
  const v = IMP96751_S.full250to16000Intercept + IMP96751_S.full250to16000 * Math.log(N);
  return v > 0 ? Math.sqrt(v) : 0;
};
const froLogLin = (N) => IMP96751_LOGLINEAR_NORM.a + IMP96751_LOGLINEAR_NORM.b * Math.log(N);
const traceOf = (N) => IMP96751_I11 * (Math.log(N) + IMP96751_GAMMA);
const measOf = (N) => IMP96751_LAMMAX_FIT.a + IMP96751_LAMMAX_FIT.b * Math.log(N);

export const IMP96751_CEILINGS = Object.freeze({
  sqrtSLogN: solveCeiling(froSqrt), // ~3.976e7 (imp-96667 second-moment form)
  logLinearNorm: solveCeiling(froLogLin), // ~3.787e7 (log-linear norm)
  trace: solveCeiling(traceOf), // ~2.594e7 (imp-96548 rigorous lower)
  measured: solveCeiling(measOf), // ~4.109e7 (imp-96443 composed)
});

// Finding 2: the sqrt form closes most of the trace -> measured gap.
export const IMP96751_GAP = Object.freeze({
  sqrtClosesFracOfGap:
    (IMP96751_CEILINGS.sqrtSLogN - IMP96751_CEILINGS.trace) /
    (IMP96751_CEILINGS.measured - IMP96751_CEILINGS.trace), // ~0.912
  sqrtOverTrace: IMP96751_CEILINGS.sqrtSLogN / IMP96751_CEILINGS.trace, // ~1.53x
  logLinOverTrace: IMP96751_CEILINGS.logLinearNorm / IMP96751_CEILINGS.trace, // ~1.46x
});

// Finding 3: each new-rung Frobenius bound stays valid and tight.
export const IMP96751_BOUND_CHECK = Object.freeze(
  IMP96751_NEW_ROWS.map((r) =>
    Object.freeze({
      N: r.N,
      frobAboveLamMax: r.frobenius > r.lamMax,
      frobBelowTrace: r.frobenius < r.trace,
      relFrobAboveLamMax: (r.frobenius - r.lamMax) / r.lamMax, // ~0.12-0.13
      traceOverFrob: r.trace / r.frobenius, // ~1.79-1.81
    }),
  ),
);

export const IMP96751_VERDICT = Object.freeze({
  question:
    'does the interior second-moment coefficient s (imp-96667 measured 5.8048 on rows N<=6000) ' +
    'hold when the exact Vasyunin Gram is extended to N=13000,14000,15000,16000, and does the ' +
    'imp-96667 sqrt(s log N) form higher ceiling ~3.98e7 (imp-96731 Finding 4) survive?',
  sHolds: true, // full-ladder 5.81528, local N>=7000 5.83406, vs imp-96667 5.80481
  sDriftsUp: IMP96751_S.driftsUp,
  sqrtCeilingSurvives: IMP96751_CEILINGS.sqrtSLogN > IMP96751_CEILINGS.logLinearNorm,
  ceilingBracketLo: IMP96751_CEILINGS.logLinearNorm, // ~3.787e7
  ceilingBracketHi: IMP96751_CEILINGS.sqrtSLogN, // ~3.976e7
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  conclusion:
    'MEASURED. Extending the exact Vasyunin Gram to N=16000 (new rungs Frobenius ' +
    '7.038283/7.068936/7.097354/7.123836, lam_max 6.261759/6.279702/6.296229/6.311535, all ' +
    'valid rigorous upper bounds ~12-13 percent above lam_max and ~1.81x below the trace) shows ' +
    'the interior coefficient s holds near 5.81 (full-ladder 5.81528 R^2=0.9999965, local ' +
    'N>=7000 5.83406, vs imp-96667 5.80481 -- stable, edging up). The imp-96667 sqrt(s log N) ' +
    'form re-solves the ceiling to 3.9755e7, above the log-linear-norm 3.7865e7, closing 91.2 ' +
    'percent of the trace-lower 2.5937e7 -> measured-composed 4.1089e7 gap. The two candidate ' +
    'rigorous forms bracket the achievable ceiling at ~3.79e7-3.98e7 (~1.46x-1.53x over the ' +
    'trace lower ceiling). No rigorous ceiling is posted (that needs the imp-96750 one-sided s* ' +
    'bound); no bound moved; no refereed bound is changed; RH open; NO QED.',
});

export const IMP96751_SUBGAP = Object.freeze({
  id: 'imp-96751-s-measured-not-proven-and-drifts-above-the-low-n-fit',
  statement:
    'the ~5.80-5.83 bracket on s and the ~3.98e7 sqrt-form ceiling both rest on an empirical log ' +
    'law over an exact but still bounded window (N=16000 is ~0.4 decade above N=12000, ~2 decades ' +
    'below the ceiling scale). The higher ceiling is only realised if a rigorous one-sided upper ' +
    'bound Int(N) <= s* log N is proved (imp-96750); because the measured slope edges up at large ' +
    'N (5.80481 -> 5.81528 -> 5.83406), a naive s*=5.8048 upper constant would already be violated ' +
    'by the measured N>=7000 slope 5.834 -- the one-sided constant must be chosen above the ' +
    'measured high-N slope, not at the imp-96667 low-N fit.',
});

export const IMP96751_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: trace, ||G||_F, ||G||_F^2 ' +
  'and the Wolkowicz-Styan bound at N=13000,14000,15000,16000 are exact matrix quantities / ' +
  'rigorous unconditional matrix inequalities on the same exact Vasyunin Gram (rebuilt to ' +
  'NMAX=16000) as imp-96105 / imp-96443 / imp-96684 / imp-96694 ' +
  '(tmp/imp-96751-frobenius-extend-16000.py, ~1916 s); lam_max is measured by power iteration. ' +
  'The s re-fit and ceiling re-solve are pure re-analysis; no rigorous ceiling is posted, no ' +
  'bound is claimed moved, and no operator positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96751_ASSERTIONS = [
  {
    id: 'imp96751-new-rungs-monotone-frobenius-above-lammax-below-trace',
    holds: () =>
      IMP96751_NEW_ROWS.every((r, i) => i === 0 || r.frobenius > IMP96751_NEW_ROWS[i - 1].frobenius) &&
      IMP96751_NEW_ROWS.every((r, i) => i === 0 || r.lamMax > IMP96751_NEW_ROWS[i - 1].lamMax) &&
      IMP96751_NEW_ROWS.every((r, i) => i === 0 || r.trace > IMP96751_NEW_ROWS[i - 1].trace) &&
      IMP96751_BOUND_CHECK.every(
        (v) => v.frobAboveLamMax && v.frobBelowTrace && v.relFrobAboveLamMax > 0.10 && v.relFrobAboveLamMax < 0.15 && v.traceOverFrob > 1.75 && v.traceOverFrob < 1.85,
      ),
    why: 'the four new-rung trace, lam_max and Frobenius values increase monotonically and each Frobenius sits strictly between the measured lam_max (~12-13 percent above) and the trace (~1.81x below): valid, tight rigorous upper bounds extending the imp-96694 ladder.',
  },
  {
    id: 'imp96751-interior-coefficient-s-holds-near-5p81-and-drifts-up',
    holds: () =>
      IMP96751_S.full250to16000 > 5.80 && IMP96751_S.full250to16000 < 5.83 &&
      IMP96751_S.full250to16000R2 > 0.9999 &&
      IMP96751_S.localGe7000 > 5.83 && IMP96751_S.localGe7000 < 5.85 &&
      IMP96751_S.driftsUp === true,
    why: 'the interior second-moment coefficient refits to 5.81528 over the full exact ladder (R^2>0.9999) with local N>=7000 slope 5.83406, both at or above the imp-96667 N<=6000 value 5.80481: s holds near 5.81 and edges up, it does not fall.',
  },
  {
    id: 'imp96751-sqrt-form-ceiling-survives-above-loglinear-closes-most-of-gap',
    holds: () =>
      IMP96751_CEILINGS.sqrtSLogN > IMP96751_CEILINGS.logLinearNorm &&
      IMP96751_CEILINGS.sqrtSLogN > 3.9e7 && IMP96751_CEILINGS.sqrtSLogN < 4.05e7 &&
      IMP96751_CEILINGS.logLinearNorm > 3.7e7 && IMP96751_CEILINGS.logLinearNorm < 3.85e7 &&
      IMP96751_GAP.sqrtClosesFracOfGap > 0.90 && IMP96751_GAP.sqrtClosesFracOfGap < 0.92,
    why: 'the imp-96667 sqrt(s log N) form re-solves the ceiling to 3.9755e7, above the log-linear-norm 3.7865e7, closing 91.2 percent of the trace-lower -> measured-composed gap: the higher ceiling survives the extension.',
  },
  {
    id: 'imp96751-ceilings-bracketed-trace-below-measured-above',
    holds: () =>
      IMP96751_CEILINGS.trace < IMP96751_CEILINGS.logLinearNorm &&
      IMP96751_CEILINGS.sqrtSLogN < IMP96751_CEILINGS.measured &&
      IMP96751_GAP.sqrtOverTrace > 1.45 && IMP96751_GAP.sqrtOverTrace < 1.60 &&
      IMP96751_GAP.logLinOverTrace > 1.40 && IMP96751_GAP.logLinOverTrace < 1.50,
    why: 'both candidate rigorous ceilings sit strictly above the trace lower ceiling 2.594e7 and below the measured composed 4.109e7 (~1.46x-1.53x over the trace lower ceiling): the imp-96731 Finding-4 estimate is confirmed and sharpened.',
  },
  {
    id: 'imp96751-honesty-gate-no-qed',
    holds: () =>
      IMP96751_VERDICT.anyBoundMoved === false &&
      IMP96751_VERDICT.postsRigorousCeiling === false &&
      IMP96751_VERDICT.sHolds === true &&
      IMP96751_VERDICT.sqrtCeilingSurvives === true &&
      /NO QED/.test(IMP96751_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96751_HONEST_BANNER) &&
      /RH open/.test(IMP96751_HONEST_BANNER) &&
      /measured-not-proven/.test(IMP96751_SUBGAP.id),
    why: 'measurement only: no rigorous ceiling posted, no bound moved, the s-holds / sqrt-ceiling-survives result is recorded, and the honesty markers plus the s-measured-not-proven sub-gap are present.',
  },
];

for (const a of IMP96751_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96751-route-m-frobenius-ladder-above-12000 assertion failed: ${a.id}`,
    );
  }
}

export default {
  eps: IMP96751_EPS,
  i11: IMP96751_I11,
  lamMin: IMP96751_LAMMIN,
  lamMaxFit: IMP96751_LAMMAX_FIT,
  newRows: IMP96751_NEW_ROWS,
  s: IMP96751_S,
  logLinearNorm: IMP96751_LOGLINEAR_NORM,
  ceilings: IMP96751_CEILINGS,
  gap: IMP96751_GAP,
  boundCheck: IMP96751_BOUND_CHECK,
  verdict: IMP96751_VERDICT,
  subGap: IMP96751_SUBGAP,
  banner: IMP96751_HONEST_BANNER,
};
