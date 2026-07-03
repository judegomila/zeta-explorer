/**
 * @module imp-3502-remainder-tail-exponent-fit
 * @fileoverview imp-3502 -- MEASURE the O(a^{n+2}) tail EXPONENT of each imp-3481
 *   remainder R_n(a) by halving a on a geometric ladder, certifying the imp-3481
 *   claim that "the relative residual must shrink like a^2 as a halves" as a
 *   FITTED log-log exponent close to 2 on the full n = 0..4 moment ladder.
 *
 *   WHAT imp-3481 LEFT UNMEASURED
 *   -----------------------------
 *   imp-3481 built the remainder ladder R_0 = C, R_1 = S, R_2 = C - M_0,
 *   R_3 = S - a M_1, R_4 = C - M_0 - (a^2/2) M_2 (C, S the A-weighted cosh/sinh
 *   masses, M_n the Phi-autocorrelation moments) and asserted each relative
 *   residual |R_n(a) - (a^n/n!)M_n| / |R_n(a)| shrinks at order a^2. But it
 *   certified only a WORST-CASE ratio > 3.5 over the three-point ladder
 *   {0.5, 0.25, 0.125} -- never a fitted decay exponent. This module fits it.
 *
 *   THE MEASUREMENT
 *   ---------------
 *   For each n = 0..4 sweep a on the geometric ladder a, a/2, a/4, ... and record
 *   the relative residual r_n(a). Since R_n(a) = (a^n/n!) M_n + O(a^{n+2}), the
 *   numerator is O(a^{n+2}) and the denominator is O(a^n), so
 *       r_n(a) = |O(a^{n+2})| / |O(a^n)|  ~  const * a^2 * (1 + O(a^2)).
 *   Hence ln r_n(a) = const + 2 ln a + O(a^2), and the least-squares slope of
 *   ln r_n vs ln a is the tail exponent, expected ~ 2, with R^2 ~ 1.
 *
 *   CANCELLATION NOISE FLOOR (why the ladder is adaptively truncated)
 *   ----------------------------------------------------------------
 *   R_n for n >= 2 is formed by subtracting O(M_0) ~ 7.7e-4 magnitude masses, so
 *   the residual NUMERATOR |R_n - leading| carries an absolute rounding floor of
 *   order M_0 * eps ~ 1e-18. Once the O(a^{n+2}) tail sinks below that floor the
 *   measured slope decorrelates (for n = 4 this happens just below a = 0.125:
 *   numerators fall from 1.96e-17 at a = 0.125 to 4.9e-19 at a = 0.0625, and the
 *   local slope collapses 1.94 -> 1.33 -> negative). We therefore include a rung
 *   in the fit ONLY while its residual numerator exceeds ABS_FLOOR = 5e-18
 *   (a ~4x margin above the observed noise, ~4x below the last clean point). The
 *   per-moment rung count is reported so the truncation is explicit.
 *
 *   MEASURED RESULT (self-computing; A recomputed at import, no frozen data)
 *   -----------------------------------------------------------------------
 *   Fitted tail exponent p_n and R^2 on the retained rungs of the ladder
 *   {0.5, 0.25, 0.125, 0.0625, 0.03125, 0.015625}:
 *     n=0: p=1.99993, R^2=1.0000000 (6 rungs)   n=3: p=1.99995, R^2=1.0000000 (4 rungs)
 *     n=1: p=1.99995, R^2=1.0000000 (6 rungs)   n=4: p=1.97083, R^2=0.9999323 (3 rungs)
 *     n=2: p=1.99878, R^2=0.9999996 (6 rungs)
 *   Every fitted exponent lies within 0.03 of 2 with R^2 > 0.9999, upgrading the
 *   imp-3481 worst-case ratio > 3.5 to a genuine fitted decay exponent ~2 on the
 *   full n = 0..4 ladder.
 *
 *   VERDICT: the imp-3481 "residual shrinks like a^2" claim is CERTIFIED as a
 *   fitted log-log tail exponent p_n ~ 2 (all n = 0..4), confirming each remainder
 *   R_n(a) = (a^n/n!) M_n + O(a^{n+2}) at the measured order.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   MEASUREMENT / CERTIFICATION ONLY, at the RH-equivalent scale class. This fits
 *   the numerical decay order of a fixed-weight Taylor remainder; it establishes
 *   NO operator positivity. Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT and
 *   the degree-2 face carries no feasibility comparison (imp-3469: D_2 = 0). The
 *   operator-level K_a >= 0 sign-positivity (off-diagonal endpoint-Hankel step,
 *   imp-3066) is UNTOUCHED. No RH verdict, no QED. Platt-Trudgian Lambda &lt;= 0.2
 *   remains the rigorous SOTA.
 *
 *   @see imp-3481-autocorrelation-moment-ladder.js (the ladder whose tail this fits)
 *   @see imp-3469-degree2-bridge-mass-scaling.js (the n=2 leading form)
 *
 *   Ticket: imp-3502 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10;                                // completed-Riemann kernel truncation

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

// Phi autocorrelation A(tau) = int_0^inf Phi(s) Phi(s + tau) ds. The kernel decays
// super-exponentially so the upper limit 7 captures the whole overlap (imp-3469).
function autocorr(tau) {
  return simpson((s) => phiKernel(s) * phiKernel(s + tau), 0, 7, 1200);
}

// Precompute A on the SAME fixed fine Simpson grid over [0, T_A] as imp-3469/imp-3481.
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

// -- The imp-3481 autocorrelation moment ladder M_n = int tau^n A(tau) d(tau) -----
const MOMENT_MAX = 4;
const MOMENTS = [];
for (let n = 0; n <= MOMENT_MAX; n += 1) {
  MOMENTS.push(aWeightedMass((tau) => Math.pow(tau, n)));
}
const M0 = MOMENTS[0];
const M1 = MOMENTS[1];
const M2 = MOMENTS[2];

// -- The two A-weighted generating masses at a given shear a (imp-3481, verbatim) --
function coshMass(a) { return aWeightedMass((tau) => Math.cosh(a * tau)); }  // = C(a)
function sinhMass(a) { return aWeightedMass((tau) => Math.sinh(a * tau)); }  // = S(a)

/**
 * The imp-3481 remainder ladder at shear a. R_n(a) peels the Taylor terms below
 * order n from the appropriate parity mass so its leading term is (a^n/n!) M_n.
 * Returns per-n the remainder, its predicted leading form, the residual numerator
 * |R_n - leading| (the truncated O(a^{n+2}) tail), and the relative residual.
 */
function remainderLadder(a) {
  const C = coshMass(a);
  const S = sinhMass(a);
  const remainders = [
    C,                              // R_0 -> M_0
    S,                              // R_1 -> a M_1
    C - M0,                         // R_2 -> a^2/2! M_2  (= imp-3469 B_2)
    S - a * M1,                     // R_3 -> a^3/3! M_3
    C - M0 - (a * a / 2) * M2,      // R_4 -> a^4/4! M_4
  ];
  return remainders.map((rem, n) => {
    const leading = (Math.pow(a, n) / factorial(n)) * MOMENTS[n];
    const numerator = Math.abs(rem - leading);
    const relResid = numerator / Math.abs(rem);
    return Object.freeze({ n, remainder: rem, leadingForm: leading, numerator, relResid });
  });
}

// -- Least-squares log-log fit: slope (the fitted exponent) and R^2 ---------------
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

// -- Sweep the geometric a-ladder and fit the tail exponent per moment ------------
// Adaptive truncation: a rung enters the fit only while its residual numerator
// clears the cancellation noise floor (see the header CANCELLATION NOISE FLOOR).
const A_LADDER = Object.freeze([0.5, 0.25, 0.125, 0.0625, 0.03125, 0.015625]);
const ABS_FLOOR = 5e-18;         // ~4x above observed rounding noise, ~4x below last clean rung
const MIN_RUNGS = 3;             // require at least a three-point fit per moment

const LADDER_RUNGS = A_LADDER.map((a) => remainderLadder(a));

const TAIL_FITS = [];
for (let n = 0; n <= MOMENT_MAX; n += 1) {
  const keptA = [];
  const keptResid = [];
  for (let i = 0; i < A_LADDER.length; i += 1) {
    const rung = LADDER_RUNGS[i][n];
    if (rung.numerator > ABS_FLOOR) {
      keptA.push(A_LADDER[i]);
      keptResid.push(rung.relResid);
    }
  }
  const { slope, r2 } = logLogFit(keptA, keptResid);
  TAIL_FITS.push(Object.freeze({
    n,
    rungsUsed: keptA.length,
    aRetained: Object.freeze(keptA.slice()),
    fittedExponent: slope,
    r2,
  }));
}

// -- Classification ----------------------------------------------------------------
const EXPONENT_TARGET = 2;
const EXPONENT_TOL = 0.1;        // every fitted exponent within 0.1 of 2 (worst is n=4 ~1.971)
const R2_FLOOR = 0.999;          // every log-log fit near-perfectly linear

const allExponentsNearTwo = TAIL_FITS.every(
  (f) => Math.abs(f.fittedExponent - EXPONENT_TARGET) < EXPONENT_TOL,
);
const allFitsLinear = TAIL_FITS.every((f) => f.r2 > R2_FLOOR);
const allHaveEnoughRungs = TAIL_FITS.every((f) => f.rungsUsed >= MIN_RUNGS);

const worstExponentDev = Math.max(
  ...TAIL_FITS.map((f) => Math.abs(f.fittedExponent - EXPONENT_TARGET)),
);
const worstR2 = Math.min(...TAIL_FITS.map((f) => f.r2));

const verdict =
  allExponentsNearTwo && allFitsLinear && allHaveEnoughRungs
    ? 'REMAINDER-TAIL-EXPONENT-p_n~2-FITTED-FOR-EVERY-MOMENT-n=0..4-CERTIFYING-imp-3481-ORDER-a^2-RESIDUAL-DECAY'
    : 'INDETERMINATE';

export const IMP3502_REMAINDER_TAIL_EXPONENT_FIT = Object.freeze({
  id: 'imp-3502-remainder-tail-exponent-fit',
  ticket: 'imp-3502',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedMomentLadder: 'imp-3481-autocorrelation-moment-ladder.js',
  relatedDegree2Scaling: 'imp-3469-degree2-bridge-mass-scaling.js',

  summary:
    'Fits the O(a^{n+2}) tail EXPONENT of each imp-3481 remainder R_n(a) by sweeping a on the geometric ' +
    'ladder {0.5, 0.25, 0.125, 0.0625, 0.03125, 0.015625} and least-squares fitting ln(relative residual) ' +
    'vs ln(a). Since R_n(a)=(a^n/n!)M_n+O(a^{n+2}) the relative residual ~ const*a^2, so the log-log slope ' +
    'is the tail exponent, expected ~2. MEASURED fitted exponents (R^2): n=0 1.99993 (1.0000000), n=1 1.99995 ' +
    '(1.0000000), n=2 1.99878 (0.9999996), n=3 1.99995 (1.0000000), n=4 1.97083 (0.9999323); rungs below the ' +
    'M_0*eps ~ 5e-18 cancellation noise floor are dropped, leaving 6/6/6/4/3 rungs for n=0..4. Every exponent ' +
    'is within 0.03 of 2 with R^2 > 0.9999, upgrading the imp-3481 worst-case ratio > 3.5 to a genuine fitted ' +
    'decay exponent ~2 on the full ladder. MEASUREMENT/CERTIFICATION, RH-EQUIVALENT, necessary-but-not-sufficient; ' +
    'operator positivity (imp-3066) untouched; no RH verdict.',

  method: Object.freeze({
    remainderLadder: 'imp-3481 verbatim: R_0=C, R_1=S, R_2=C-M_0, R_3=S-a M_1, R_4=C-M_0-(a^2/2)M_2',
    relResidual: 'r_n(a) = |R_n(a) - (a^n/n!)M_n| / |R_n(a)|, the truncated O(a^{n+2}) tail over the leading O(a^n)',
    fit: 'least-squares slope and R^2 of ln(r_n) vs ln(a) over the retained ladder rungs = fitted tail exponent',
    aLadder: A_LADDER,
    absFloor: ABS_FLOOR,
    noiseFloorRationale:
      'R_n (n>=2) subtracts O(M_0)~7.7e-4 masses, so the residual numerator carries an M_0*eps~1e-18 absolute ' +
      'rounding floor; rungs whose numerator falls below ABS_FLOOR=5e-18 are excluded before fitting.',
    minRungs: MIN_RUNGS,
    quadrature: 'composite Simpson: A(tau) inner (n=1200 on [0,7]), moments/masses on the NM=1600 [0,T_A] grid',
    selfComputing: true,
  }),

  measured: Object.freeze({
    tailFits: Object.freeze(TAIL_FITS),      // per-moment {n, rungsUsed, aRetained, fittedExponent, r2}
    ladderRungs: Object.freeze(LADDER_RUNGS),
    worstExponentDev,                        // max |p_n - 2| (~0.029 at n=4)
    worstR2,                                 // min R^2 (~0.99993 at n=4)
    allExponentsNearTwo,
    allFitsLinear,
    allHaveEnoughRungs,
    verdict,
  }),

  interpretation: Object.freeze({
    certifiesImp3481Claim:
      'imp-3481 recorded only a worst-case per-halving ratio > 3.5 on a three-point ladder. Fitting the log-log ' +
      'slope over the full ladder yields a tail exponent p_n = 2.000 +/- 0.03 for every n=0..4, certifying the ' +
      '"relative residual shrinks like a^2" claim as a measured decay exponent, not an unfitted ratio.',
    exponentIsTaylorOrder:
      'The exponent is exactly 2 for every n because the O(a^{n+2}) remainder tail divided by the O(a^n) leading ' +
      'form is O(a^2); the fitted slope is the order of the next Taylor term relative to the leading one.',
    cancellationLimitsHighN:
      'The n=4 fit truncates to three rungs: below a=0.125 the a^6-scale tail sinks under the M_0*eps rounding ' +
      'floor of the C-M_0-(a^2/2)M_2 subtraction, so smaller-a rungs carry noise, not signal, and are excluded.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    numericalCharacterizationOnly:
      'This module fits the numerical decay order of a fixed-weight Taylor remainder. It establishes NO operator positivity.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT, and the degree-2 face carries no feasibility comparison ' +
      'at all (imp-3469: D_2 = 0). The operator-level K_a >= 0 sign-positivity (off-diagonal endpoint-Hankel step, ' +
      'imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ------------------------------------------------------------
export const IMP3502_REMAINDER_TAIL_EXPONENT_FIT_ASSERTIONS = [
  {
    id: 'imp3502-every-moment-fitted-exponent-near-two',
    why: 'THE KEY FINDING: for every moment n=0..4 the least-squares log-log slope of the relative residual vs a ' +
         '(the tail exponent) must sit within 0.1 of 2, certifying R_n(a)=(a^n/n!)M_n+O(a^{n+2}) as a fitted order.',
    holds: () => allExponentsNearTwo,
  },
  {
    id: 'imp3502-every-fit-near-perfectly-linear',
    why: 'The fitted exponent must be genuine, not a two-point artifact: every ln(residual)-vs-ln(a) fit must have ' +
         'R^2 > 0.999, i.e. the residual really is a clean power law over the retained ladder.',
    holds: () => allFitsLinear,
  },
  {
    id: 'imp3502-every-moment-keeps-enough-rungs',
    why: 'Each per-moment fit must retain at least three ladder rungs above the cancellation noise floor so the ' +
         'exponent is a fit, not an interpolation; n=4 keeps exactly the imp-3481-validated {0.5,0.25,0.125}.',
    holds: () => allHaveEnoughRungs,
  },
  {
    id: 'imp3502-worst-exponent-deviation-small',
    why: 'The worst per-moment deviation |p_n - 2| across n=0..4 must be small (<0.05); the largest is n=4 (~0.029), ' +
         'bounded by its three-rung truncation and the higher-order tail.',
    holds: () => worstExponentDev < 0.05,
  },
  {
    id: 'imp3502-verdict-certifies-order-a2-decay',
    why: 'The classified verdict must certify the fitted tail exponent ~2 for every moment, upgrading the imp-3481 ' +
         'unfitted ratio claim, not indeterminate.',
    holds: () => verdict === 'REMAINDER-TAIL-EXPONENT-p_n~2-FITTED-FOR-EVERY-MOMENT-n=0..4-CERTIFYING-imp-3481-ORDER-a^2-RESIDUAL-DECAY',
  },
  {
    id: 'imp3502-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: tail-exponent measurement only, mass-feasibility necessary-but-not-sufficient, ' +
         'operator positivity (imp-3066) untouched, PT 0.2 stays SOTA.',
    holds: () => {
      const c = IMP3502_REMAINDER_TAIL_EXPONENT_FIT.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3502_REMAINDER_TAIL_EXPONENT_FIT_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3502-remainder-tail-exponent-fit assertion failed: ${assertion.id}`);
  }
}

export default IMP3502_REMAINDER_TAIL_EXPONENT_FIT;
