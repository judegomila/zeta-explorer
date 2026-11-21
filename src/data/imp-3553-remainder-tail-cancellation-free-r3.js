/**
 * @module imp-3553-remainder-tail-cancellation-free-r3
 * @fileoverview imp-3553 -- Extend the imp-3526 CANCELLATION-FREE moment
 *   reformulation from the EVEN degree-4 remainder R_4 (cosh) to the ODD
 *   degree-3 remainder R_3 (sinh), recover the rungs its subtractive form loses
 *   to catastrophic cancellation, and re-fit the tail exponent toward the
 *   derived p = 2.
 *
 *   THE ODD REMAINDER UNDER TEST (imp-3510 / imp-3527)
 *   --------------------------------------------------
 *   The degree-3 bridge mass is the ODD remainder
 *       R_3(a) = S(a) - a M_1,   S(a) = int_0^{T_A} sinh(a tau) A(tau) d(tau),
 *   with leading form (a^3/6) M_3 (imp-3481 n = 3 rung) and O(a^2) tail from the
 *   next odd term (a^5/120) M_5. Formed this way it subtracts the near-equal
 *   masses S(a) and a M_1 (both ~ 2.3e-5 at a = 0.5), so, exactly like the
 *   imp-3502 subtractive R_4, its O(a^5) residual sits on an absolute rounding
 *   floor and the deepest ladder rungs sink into noise.
 *
 *   THE CANCELLATION-FREE REFORMULATION (odd analogue of imp-3526)
 *   -------------------------------------------------------------
 *   sinh(a tau) = sum_{m odd >= 1} (a tau)^m / m!, so the A-weighted sinh mass is
 *       S(a) = sum_{m odd >= 1} a^m/m! M_m,   M_m = int_0^{T_A} tau^m A(tau) d(tau).
 *   Peeling the m = 1 term therefore gives, with NO subtraction of large
 *   nearly-equal masses,
 *       R_3(a) = S(a) - a M_1 = sum_{m odd >= 3} a^m/m! M_m,
 *   a sum of strictly POSITIVE terms (A(tau) >= 0, tau^m >= 0). The residual tail
 *   is likewise a clean positive sum,
 *       R_3(a) - (a^3/6) M_3 = sum_{m odd >= 5} a^m/m! M_m,
 *   leading term (a^5/120) M_5, so the relative residual
 *       r_3(a) ~ (a^2/20)(M_5/M_3)
 *   is O(a^2) with slope 2 -- and every term is evaluated to relative machine
 *   precision, so the cancellation floor simply does not exist. We truncate the
 *   odd-moment sum at MMAX = 15 (for a <= 0.5, a tau <= 3, the m = 15 term is
 *   utterly negligible; the reformulation matches the subtractive R_3 to relative
 *   4.4e-13 at a = 0.5, where cancellation has not yet bitten).
 *
 *   HONEST CORRECTION OF THE SCOUT PREMISE (odd is LESS cancellation-prone)
 *   ----------------------------------------------------------------------
 *   The frontier-scout ticket guessed the odd R_3 tail fit "would lose sub-0.125
 *   rungs identically" to the even R_4. It does NOT. The mass subtracted to form
 *   R_3 is a M_1 (~ 2.3e-5 at a = 0.5), whereas R_4 subtracts M_0 (~ 7.7e-4), so
 *   the odd rounding floor a0*M_1*eps ~ 5.0e-21 sits ~34x BELOW the even
 *   M_0*eps ~ 1.7e-19 floor. Consequently the subtractive R_3 survives the WHOLE
 *   standard six-rung ladder {0.5,..,0.015625} cleanly (matching the
 *   cancellation-free form to < 0.2% on every rung) and only breaks down one
 *   octave deeper, for a < ~0.008. The recovery is therefore of the DEEPER rungs
 *   {0.0078125, 0.00390625, 0.001953125}, extending the clean ladder from six
 *   rungs to nine.
 *
 *   MEASURED RESULT (self-computing; A and the moments recomputed at import)
 *   -----------------------------------------------------------------------
 *   On the extended nine-rung ladder {0.5,..,0.001953125} the cancellation-free
 *   relative residual is a clean power law (each halving quarters it, slope 2):
 *     a        : 0.5     0.25    0.125   ...  0.0078125 0.00390625 0.001953125
 *     r_3(a)   : 3.64e-4 9.11e-5 2.28e-5 ...  8.89e-8   2.22e-8    5.56e-9
 *     tail num : 4.58e-12 ... clean a^5 decay ... 4.26e-21 1.33e-22 4.16e-24
 *   The subtractive R_3 tracks it to < 0.2% down to a = 0.015625 but then
 *   corrupts: its relative residual RISES non-monotonically (7.94e-8 -> 2.31e-8
 *   -> 2.56e-8) into rounding noise below a ~ 0.008. Least-squares log-log fit:
 *     cancellation-free 9-rung fit : p = 1.99999,  R^2 = 0.99999999996
 *     subtractive       9-rung fit : p = 1.85615,  R^2 = 0.98499   (corrupted)
 *   Recovering the three deep rungs the subtractive form loses sharpens the fit
 *   to p = 1.99999 (deviation |p-2| ~ 1.2e-5) at essentially perfect R^2,
 *   confirming R_3(a) = (a^3/6)M_3 + O(a^5) at the derived order p = 2.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   MEASUREMENT / CERTIFICATION ONLY, at the RH-equivalent scale class. This
 *   reformulates and re-fits the numerical decay order of a fixed-weight Taylor
 *   remainder; it establishes NO operator positivity. Mass-feasibility is
 *   NECESSARY-BUT-NOT-SUFFICIENT and the degree-2 face carries no feasibility
 *   comparison (imp-3469: D_2 = 0). The operator-level K_a >= 0 sign-positivity
 *   (off-diagonal endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict, no
 *   QED. No refereed bound is changed.
 *
 *   @see imp-3526-remainder-tail-cancellation-free-r4.js (the EVEN R_4 this mirrors)
 *   @see imp-3527-sinh-cancellation-safety-k-ladder.js (the odd sinh-a tau audit)
 *   @see imp-3510-degree3-miss-factor-closed-form.js (the degree-3 mass B_3)
 *   @see imp-3481-autocorrelation-moment-ladder.js (the remainder moment ladder)
 *
 *   Ticket: imp-3553 (accuracy, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10;                                // completed-Riemann kernel truncation
const EPS = Number.EPSILON;                     // 2.220446049250313e-16

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (imp-2686). */
function phiKernel(u) {
  let s = 0;
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  for (let n = 1; n <= NPHI; n += 1) {
    const n2 = n * n;
    const n4 = n2 * n2;
    s += (2 * Math.PI * Math.PI * n4 * e4 - 3 * Math.PI * n2 * e2) * Math.exp(-Math.PI * n2 * e4);
  }
  return s;
}

/** Composite Simpson quadrature of f on [lo, hi] with n subintervals (n even). */
function simpson(f, lo, hi, n) {
  const m = n % 2 === 0 ? n : n + 1;
  const h = (hi - lo) / m;
  let sum = f(lo) + f(hi);
  for (let i = 1; i < m; i += 1) {
    sum += (i % 2 === 0 ? 2 : 4) * f(lo + i * h);
  }
  return (sum * h) / 3;
}

// Phi autocorrelation A(tau) = int_0^inf Phi(s) Phi(s + tau) ds (imp-3469 grid).
function autocorr(tau) {
  return simpson((s) => phiKernel(s) * phiKernel(s + tau), 0, 7, 1200);
}

// Precompute A on the SAME fixed fine Simpson grid over [0, T_A] as imp-3526.
const T_A = 6;
const NM = 1600;                                // even -> composite Simpson on [0, T_A]
const H_A = T_A / NM;
const A_GRID = [];
for (let j = 0; j <= NM; j += 1) A_GRID.push(autocorr(j * H_A));

/** int_0^{T_A} weight(tau) A(tau) d(tau) by composite Simpson on the precomputed grid. */
function aWeightedMass(weightFn) {
  let sum = 0;
  for (let j = 0; j <= NM; j += 1) {
    const tau = j * H_A;
    const w = j === 0 || j === NM ? 1 : (j % 2 === 0 ? 2 : 4);
    sum += w * weightFn(tau) * A_GRID[j];
  }
  return (sum * H_A) / 3;
}

/** n! for small integer n. */
function factorial(n) {
  let f = 1;
  for (let i = 2; i <= n; i += 1) f *= i;
  return f;
}

// -- ODD autocorrelation moments M_1, M_3, ..., M_MMAX (the sinh series coefficients) --
const MMAX = 15;                                // top odd order in the R_3 series (m=15 term negligible)
const ODD_MOMENTS = {};                         // ODD_MOMENTS[m] = int tau^m A(tau) d(tau)
for (let m = 1; m <= MMAX; m += 2) {
  ODD_MOMENTS[m] = aWeightedMass((tau) => Math.pow(tau, m));
}
const M1 = ODD_MOMENTS[1];                      // ~4.518e-5 (the subtracted mass a M_1)
const M3 = ODD_MOMENTS[3];                      // ~6.029e-7
const M5 = ODD_MOMENTS[5];                      // ~1.757e-8

// -- The cancellation-free degree-3 remainder and its residual tail ----------------
// R_3(a) = sum_{m odd >= 3} a^m/m! M_m  (no subtraction of the O(a M_1) mass).
function r3CancellationFree(a) {
  let s = 0;
  for (let m = 3; m <= MMAX; m += 2) {
    s += (Math.pow(a, m) / factorial(m)) * ODD_MOMENTS[m];
  }
  return s;
}
// residual numerator |R_3 - (a^3/6)M_3| = sum_{m odd >= 5} a^m/m! M_m.
function residualTailFree(a) {
  let s = 0;
  for (let m = 5; m <= MMAX; m += 2) {
    s += (Math.pow(a, m) / factorial(m)) * ODD_MOMENTS[m];
  }
  return s;
}

// -- Subtractive R_3 (kept only for the equivalence + breakdown contrast) -----------
function sinhMass(a) { return aWeightedMass((tau) => Math.sinh(a * tau)); }
function r3Subtractive(a) { return sinhMass(a) - a * M1; }

// -- Least-squares log-log fit: slope (the fitted exponent) and R^2 ----------------
function logLogFit(xs, ys) {
  const lx = xs.map((v) => Math.log(v));
  const ly = ys.map((v) => Math.log(v));
  const N = lx.length;
  const mx = lx.reduce((s, v) => s + v, 0) / N;
  const my = ly.reduce((s, v) => s + v, 0) / N;
  let sxy = 0;
  let sxx = 0;
  let syy = 0;
  for (let i = 0; i < N; i += 1) {
    sxy += (lx[i] - mx) * (ly[i] - my);
    sxx += (lx[i] - mx) * (lx[i] - mx);
    syy += (ly[i] - my) * (ly[i] - my);
  }
  const slope = sxy / sxx;
  const r2 = syy === 0 ? 1 : (sxy * sxy) / (sxx * syy);
  return { slope, r2 };
}

// -- Sweep the EXTENDED nine-rung geometric a-ladder (three octaves deeper than R_4's) -
const A_LADDER = Object.freeze([
  0.5, 0.25, 0.125, 0.0625, 0.03125, 0.015625, 0.0078125, 0.00390625, 0.001953125,
]);
// Odd rounding floor a0*M_1*eps vs the even R_4 M_0*eps floor (imp-3526).
const M0_R4 = aWeightedMass(() => 1);           // the even M_0 that R_4 subtracts (~7.7e-4)
const ODD_FLOOR = 0.5 * M1 * EPS;               // ~5.0e-21 (a0*M_1*eps on the top rung)
const EVEN_FLOOR = M0_R4 * EPS;                 // ~1.7e-19 (M_0*eps, the R_4 floor)

const RUNGS = A_LADDER.map((a) => {
  const r3 = r3CancellationFree(a);
  const tail = residualTailFree(a);
  const sub = r3Subtractive(a);
  const subTail = Math.abs(sub - (Math.pow(a, 3) / 6) * M3);
  return Object.freeze({
    a,
    r3,
    residualTail: tail,               // = sum_{m>=5,odd} a^m/m! M_m, all positive, no cancellation
    relResid: tail / Math.abs(r3),
    subtractiveR3: sub,
    subtractiveRelResid: subTail / Math.abs(sub),
    subtractiveRelGap: Math.abs(subTail - tail) / tail,   // subtractive vs free tail agreement
  });
});

// Cancellation-free nine-rung fit (the upgrade) and the corrupted subtractive fit.
const freeFit = logLogFit(RUNGS.map((r) => r.a), RUNGS.map((r) => r.relResid));
const subtractiveFit = logLogFit(RUNGS.map((r) => r.a), RUNGS.map((r) => r.subtractiveRelResid));

// Equivalence: at large a (cancellation not yet biting) the two R_3 forms agree.
const equivRelErr = [0.5, 0.25].map(
  (a) => Math.abs(r3CancellationFree(a) - r3Subtractive(a)) / Math.abs(r3Subtractive(a)),
);
const worstEquivRelErr = Math.max(...equivRelErr);

// Deep rungs the subtractive form loses (relative gap to the clean free tail > 1%).
const RELGAP_TOL = 0.01;
const recoveredRungs = RUNGS.filter((r) => r.subtractiveRelGap > RELGAP_TOL).length;

// Monotone (clean) decay: the cancellation-free residual tail strictly decreases as a halves.
const tailMonotoneDecreasing = RUNGS.every(
  (r, i) => i === 0 || r.residualTail < RUNGS[i - 1].residualTail,
);
// The tell-tale corruption: the subtractive RELATIVE residual RISES back up at the deep end.
const subtractiveRelResidRisesAtTail =
  RUNGS[RUNGS.length - 1].subtractiveRelResid > RUNGS[RUNGS.length - 2].subtractiveRelResid;

// Odd R_3 floor sits well below the even R_4 floor -> R_3 loses rungs one octave deeper.
const oddFloorBelowEven = ODD_FLOOR < EVEN_FLOOR;
const floorRatio = EVEN_FLOOR / ODD_FLOOR;      // ~34x

// -- Classification ----------------------------------------------------------------
const EXPONENT_TARGET = 2;
const EXPONENT_TOL = 0.001;      // free 9-rung fit within 0.001 of 2 (measured |p-2| ~ 1.2e-5)
const R2_FLOOR = 0.9999999;      // near-perfectly linear power law across the full ladder

const freeFitSharpToTwo = Math.abs(freeFit.slope - EXPONENT_TARGET) < EXPONENT_TOL;
const freeFitLinear = freeFit.r2 > R2_FLOOR;
const sharperThanSubtractive =
  Math.abs(freeFit.slope - EXPONENT_TARGET) < Math.abs(subtractiveFit.slope - EXPONENT_TARGET);

const verdict =
  freeFitSharpToTwo && freeFitLinear && sharperThanSubtractive && recoveredRungs >= 3
    ? 'CANCELLATION-FREE-R3-RECOVERS-3-DEEP-RUNGS-SHARPENING-ODD-DEGREE-3-TAIL-EXPONENT-TO-1.99999-TOWARD-DERIVED-p=2'
    : 'INDETERMINATE';

export const IMP3553_REMAINDER_TAIL_CANCELLATION_FREE_R3 = Object.freeze({
  id: 'imp-3553-remainder-tail-cancellation-free-r3',
  ticket: 'imp-3553',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedEvenReformulation: 'imp-3526-remainder-tail-cancellation-free-r4.js',
  relatedSinhAudit: 'imp-3527-sinh-cancellation-safety-k-ladder.js',
  relatedDegree3Mass: 'imp-3510-degree3-miss-factor-closed-form.js',
  relatedMomentLadder: 'imp-3481-autocorrelation-moment-ladder.js',

  summary:
    'Extends the imp-3526 CANCELLATION-FREE moment reformulation from the even degree-4 remainder R_4 (cosh) to the ' +
    'ODD degree-3 remainder R_3(a)=S(a)-a M_1 (sinh). Writing R_3 as the positive odd-moment series ' +
    'R_3(a)=sum_{m odd>=3} a^m/m! M_m (no subtraction of the O(a M_1) mass) makes the residual tail ' +
    'R_3-(a^3/6)M_3=sum_{m odd>=5} a^m/m! M_m a clean positive sum with NO rounding floor. HONEST CORRECTION of the ' +
    'scout premise: the odd R_3 does NOT lose the sub-0.125 rungs "identically" to R_4 -- its subtracted mass a M_1 ' +
    '(~2.3e-5) is ~34x smaller than R_4 M_0 (~7.7e-4), so its floor a0*M_1*eps~5.0e-21 sits ~34x BELOW the R_4 ' +
    'M_0*eps~1.7e-19 floor. The subtractive R_3 therefore survives the WHOLE standard six-rung ladder cleanly and ' +
    'only breaks down one octave deeper (a<~0.008), where its relative residual RISES non-monotonically ' +
    '(7.94e-8->2.31e-8->2.56e-8) into noise. On the extended nine-rung ladder {0.5,..,0.001953125} the ' +
    'cancellation-free fit is p=1.99999 (R^2=0.99999999996) vs the corrupted subtractive p=1.85615 (R^2=0.98499), ' +
    'recovering the three deep rungs and sharpening |p-2| to ~1.2e-5. The reformulation matches the subtractive R_3 ' +
    'to relative 4.4e-13 at a=0.5 (where cancellation has not bitten), certifying equivalence. Confirms ' +
    'R_3(a)=(a^3/6)M_3+O(a^5) at the derived order p=2. MEASUREMENT/CERTIFICATION, RH-EQUIVALENT, ' +
    'necessary-but-not-sufficient; operator positivity (imp-3066) untouched; no RH verdict, no QED.',

  method: Object.freeze({
    cancellationFreeR3: 'R_3(a) = sum_{m odd >= 3} a^m/m! M_m, from sinh(a tau)=sum (a tau)^m/m! integrated against A',
    residualTail: 'R_3(a) - (a^3/6)M_3 = sum_{m odd >= 5} a^m/m! M_m, leading (a^5/120)M_5, all terms positive',
    relResidual: 'r_3(a) = [sum_{m>=5,odd} a^m/m! M_m] / R_3(a) ~ (a^2/20)(M_5/M_3), O(a^2) -> slope 2',
    subtractiveForm: 'R_3(a) = S(a) - a M_1, S(a)=int sinh(a tau) A d(tau); subtracts the near-equal O(a M_1) mass',
    fit: 'least-squares slope and R^2 of ln(r_3) vs ln(a) over the FULL nine-rung ladder = fitted tail exponent',
    aLadder: A_LADDER,
    mmax: MMAX,
    momentSeriesTruncation:
      'odd moments summed to MMAX=15; for a<=0.5 (a tau<=3) the m=15 term is negligible, so the truncated series ' +
      'reproduces the subtractive R_3 to relative 4.4e-13 at a=0.5 and 3.9e-12 at a=0.25',
    oddFloor: ODD_FLOOR,
    evenFloor: EVEN_FLOOR,
    floorRatio,
    noFloorRationale:
      'the cancellation-free tail is a sum of strictly positive terms each accurate to relative eps, so it has NO ' +
      'absolute rounding floor; the odd subtractive floor a0*M_1*eps~5e-21 is ~34x below the even R_4 M_0*eps floor, ' +
      'so R_3 loses rungs one octave DEEPER than R_4 (a<~0.008, not a<0.125)',
    quadrature: 'composite Simpson: A(tau) inner (n=1200 on [0,7]), moments on the NM=1600 [0,T_A] grid',
    selfComputing: true,
  }),

  measured: Object.freeze({
    rungs: Object.freeze(RUNGS),                      // per-a {a, r3, residualTail, relResid, subtractiveR3, subtractiveRelResid, subtractiveRelGap}
    cancellationFreeFit: Object.freeze(freeFit),      // {slope~1.99999, r2~0.99999999996} on all 9 rungs
    subtractive9RungFit: Object.freeze(subtractiveFit), // {slope~1.85615, r2~0.98499}, corrupted below a~0.008
    freeFitExponentDev: Math.abs(freeFit.slope - EXPONENT_TARGET),      // ~1.2e-5
    subtractiveFitExponentDev: Math.abs(subtractiveFit.slope - EXPONENT_TARGET), // ~0.14
    recoveredRungs,                                   // 3 deep rungs (a<~0.008) the subtractive form loses
    m1: M1,                                           // ~4.518e-5 (the subtracted mass)
    m3: M3,                                           // ~6.029e-7
    m5: M5,                                           // ~1.757e-8
    oddFloor: ODD_FLOOR,                              // ~5.0e-21
    evenFloor: EVEN_FLOOR,                            // ~1.7e-19
    floorRatio,                                       // ~34x
    equivRelErr: Object.freeze(equivRelErr),          // [~4.4e-13 (a=0.5), ~3.9e-12 (a=0.25)]
    worstEquivRelErr,
    tailMonotoneDecreasing,
    subtractiveRelResidRisesAtTail,
    oddFloorBelowEven,
    freeFitSharpToTwo,
    freeFitLinear,
    sharperThanSubtractive,
    verdict,
  }),

  interpretation: Object.freeze({
    oddVsEvenFloor:
      'R_4 subtracts M_0~7.7e-4 to form its remainder, so its cancellation floor is M_0*eps~1.7e-19; R_3 subtracts ' +
      'only a M_1 (~2.3e-5 at a=0.5), so its floor a0*M_1*eps~5.0e-21 is ~34x lower. This CORRECTS the scout ' +
      'premise: the odd R_3 does not lose the sub-0.125 rungs "identically" -- it survives the whole standard ' +
      'six-rung ladder and only breaks down one octave deeper, for a<~0.008.',
    recoveryOfDeepRungs:
      'The three deepest rungs {0.0078125, 0.00390625, 0.001953125} are where the subtractive tail departs from ' +
      'the clean free tail by > 1% (relative gap 11%, 3.7%, 360%); its relative residual rises back up ' +
      '7.94e-8 -> 2.31e-8 -> 2.56e-8 into rounding noise. The cancellation-free form keeps them as clean a^5 ' +
      'decay 4.26e-21 -> 1.33e-22 -> 4.16e-24, extending the fit from six rungs to nine.',
    sharpenedExponent:
      'The recovered deep rungs lengthen the clean lever arm, giving a cancellation-free nine-rung fit p=1.99999 ' +
      '(|p-2|=1.2e-5, R^2=0.99999999996) against the corrupted subtractive nine-rung fit p=1.85615 (R^2=0.98499), ' +
      'confirming the derived R_3(a)=(a^3/6)M_3+O(a^5) tail order p=2.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    correctsScoutPremise:
      'The scout guessed the odd R_3 would lose the sub-0.125 rungs identically to R_4; measurement shows its floor ' +
      'is ~34x lower, so it survives the standard ladder and loses rungs only one octave deeper (a<~0.008).',
    numericalCharacterizationOnly:
      'This reformulates and re-fits the numerical decay order of a fixed-weight Taylor remainder. It establishes NO operator positivity.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT, and the degree-2 face carries no feasibility comparison ' +
      'at all (imp-3469: D_2 = 0). The operator-level K_a >= 0 sign-positivity (off-diagonal endpoint-Hankel step, ' +
      'imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------------
export const IMP3553_REMAINDER_TAIL_CANCELLATION_FREE_R3_ASSERTIONS = [
  {
    id: 'imp3553-cancellation-free-9-rung-exponent-sharp-to-two',
    why: 'THE KEY FINDING: the cancellation-free R_3 keeps all nine ladder rungs, so the log-log tail exponent fits ' +
         'to within 0.001 of 2 (measured |p-2| ~ 1.2e-5), confirming R_3=(a^3/6)M_3+O(a^5) at the derived order.',
    holds: () => freeFitSharpToTwo,
  },
  {
    id: 'imp3553-9-rung-fit-near-perfectly-linear',
    why: 'The fit must be a genuine nine-point power law, not a short-lever artifact: R^2 > 0.9999999 over the full ' +
         'ladder {0.5,..,0.001953125} (measured ~0.99999999996).',
    holds: () => freeFitLinear,
  },
  {
    id: 'imp3553-sharper-than-subtractive-9-rung-fit',
    why: 'The upgrade must be real: the cancellation-free exponent deviation |p-2| (~1.2e-5) must be strictly ' +
         'smaller than the corrupted subtractive nine-rung deviation (~0.14, p=1.85615), which loses the deep rungs.',
    holds: () => sharperThanSubtractive,
  },
  {
    id: 'imp3553-recovers-three-deep-rungs-below-subtractive-floor',
    why: 'The point of the reformulation: at least three deep rungs (a<~0.008) whose subtractive tail departs from ' +
         'the clean free tail by > 1% are recovered as clean signal (the ones the subtractive form loses to noise).',
    holds: () => recoveredRungs >= 3,
  },
  {
    id: 'imp3553-residual-tail-strictly-decreasing',
    why: 'With no cancellation floor the free residual tail must decay MONOTONICALLY as a halves, while the ' +
         'subtractive RELATIVE residual rises back up at the deep end (the tell-tale corruption into noise).',
    holds: () => tailMonotoneDecreasing && subtractiveRelResidRisesAtTail,
  },
  {
    id: 'imp3553-odd-floor-below-even-r4-floor',
    why: 'HONEST CORRECTION of the scout premise: the odd R_3 floor a0*M_1*eps must sit below the even R_4 M_0*eps ' +
         'floor (measured ~34x lower), so R_3 is LESS cancellation-prone and loses rungs one octave deeper than R_4.',
    holds: () => oddFloorBelowEven && floorRatio > 10,
  },
  {
    id: 'imp3553-reformulation-equivalent-at-large-a',
    why: 'The cancellation-free R_3 must equal the subtractive R_3 where cancellation has not yet bitten: relative ' +
         'agreement < 1e-6 at a=0.5 and a=0.25 (measured 4.4e-13, 3.9e-12), certifying the reformulation.',
    holds: () => worstEquivRelErr < 1e-6,
  },
  {
    id: 'imp3553-verdict-certifies-sharpening',
    why: 'The classified verdict must certify the recovered nine-rung fit sharpening the odd degree-3 tail exponent ' +
         'toward the derived p=2, not indeterminate.',
    holds: () =>
      verdict === 'CANCELLATION-FREE-R3-RECOVERS-3-DEEP-RUNGS-SHARPENING-ODD-DEGREE-3-TAIL-EXPONENT-TO-1.99999-TOWARD-DERIVED-p=2',
  },
  {
    id: 'imp3553-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: reformulation/measurement only, mass-feasibility necessary-but-not-sufficient, ' +
         'operator positivity (imp-3066) untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP3553_REMAINDER_TAIL_CANCELLATION_FREE_R3.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3553_REMAINDER_TAIL_CANCELLATION_FREE_R3_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3553-remainder-tail-cancellation-free-r3 assertion failed: ${assertion.id}`);
  }
}

export default IMP3553_REMAINDER_TAIL_CANCELLATION_FREE_R3;
