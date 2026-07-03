/**
 * @module imp-3424-onset-series-radius-of-convergence
 * @fileoverview imp-3424 -- Estimate the RADIUS OF CONVERGENCE of the imp-3383
 *   onset-signature series
 *       S(eps) = phi(s0+eps) eps^2 / C = 1 + A1 eps + A2 eps^2 + A3 eps^3 + A4 eps^4 + ...
 *   and LOCATE the nearest complex singularity of S, testing whether the low-order
 *   alternating signs (A1>0, A2<0, A3>0, A4<0) signal a REAL negative-eps-axis
 *   singularity (as the imp-3383 [2/1] Pade pole at eps ~ -2.851 might suggest).
 *
 *   STRUCTURE (why S has a finite radius at all).
 *   -------------------------------------------
 *   With s0 = arcsinh1, cosh(s0) = sqrt2, sinh(s0) = 1, the onset blocks are ENTIRE:
 *       F(s0+eps) = sqrt2 (cosh eps - 1) + (sinh eps - eps) = (sqrt2/2) eps^2 [1 + f1 eps + ...],
 *       G(s0+eps) = G0 - (sqrt2-1)(e^{-eps} - 1)             = G0 [1 + g1 eps + ...],   G0 = 1 - arcsinh1,
 *   and S(eps) = G-block / F-block. The double zero of F at eps=0 is DIVIDED OUT (that
 *   is the eps^2 in S), so S is analytic at the origin; its radius of convergence is the
 *   distance from eps=0 to the NEAREST OTHER zero of F(s0+eps) in the complex plane.
 *   F is real on the real axis with a single (double) real zero at eps=0 and F -> +inf
 *   both ways, so every other zero is genuinely COMPLEX and comes in conjugate pairs.
 *
 *   TWO INDEPENDENT ROUTES to R and the singularity.
 *   -----------------------------------------------
 *   ROUTE A -- coefficient recursion + 2-term recurrence fit (Domb-Sykes family).
 *   Extend the imp-3383/imp-3422 telescoped series division G-block/F-block to order 60
 *   (all coefficients in closed form via the block factorials). A conjugate pair of
 *   singularities at eps = R e^{+-i theta} forces the tail to obey a 2-term linear
 *   recurrence A_{k+1} ~ p A_k + q A_{k-1} with p = (2 cos theta)/R, q = -1/R^2; a
 *   least-squares fit of (p,q) over high-k windows gives R = 1/sqrt(-q) and
 *   cos theta = p R / 2. The naive ratio |A_k / A_{k+1}| and the Domb-Sykes ratios
 *   A_k/A_{k-1} OSCILLATE (they do not settle to a single limit) -- the fingerprint of a
 *   complex pair, not a real-axis pole.
 *
 *   ROUTE B -- direct complex root of F(s0+eps).
 *   Newton (with the eps=0 double root deflated as h/eps^2) on
 *       h(eps) = sqrt2 cosh eps + sinh eps - eps - sqrt2 = 0
 *   from a coarse complex grid finds the nearest nonzero zero directly.
 *
 *   RESULT (both routes agree to ~7 digits).
 *   ---------------------------------------
 *       Nearest singularity:  eps* = -3.1239272 +- 4.3451390 i   (a CONJUGATE PAIR),
 *       Radius of convergence: R = |eps*| = 5.3515562,
 *       Argument:              arg(eps*) = 2.1941259 rad ~ 125.7 deg (well off both axes).
 *   The recurrence fit over windows up to k=60 gives R = 5.3515562, matching the direct
 *   Newton root 5.3515563 to 7 digits.
 *
 *   VERDICT -- the alternating signs are a LOW-ORDER TRANSIENT, NOT a negative-axis pole.
 *   -----------------------------------------------------------------------------------
 *   The sign string of A0..A10 is "++-+-++-+--": the strict alternation holds only for
 *   A1..A4 and BREAKS at A5>0, A6>0. A genuine singularity on the negative eps axis would
 *   force PERSISTENT alternation (A_k ~ (-1)^k / R^k); instead the signs settle into the
 *   quasi-periodic pattern of a complex pair whose phase theta ~ 2.194 rad advances by
 *   just over pi/4 per order. So the imp-3383 [2/1] real pole at eps ~ -2.851 is a Pade
 *   ARTIFACT, not the true singularity: the actual nearest singularity sits ~1.88x farther
 *   out (R = 5.35 vs 2.85) and OFF the real axis. Because the physical onset window eps>0
 *   is small compared with R = 5.35, S enjoys a LARGE analytic reach -- quantitatively
 *   reinforcing imp-3383/imp-3325 that phi is regular across the entire onset side.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   MEASUREMENT OF A DEGREE-0 SCALAR DIAGNOSTIC, RH-EQUIVALENT, NOT THE OPERATOR STEP.
 *   This estimates the analytic reach of a scalar onset series; it neither proves nor
 *   weakens RH, adds no positivity, and touches neither imp-3066 (the off-diagonal
 *   endpoint-Hankel operator obstruction, the lone remaining gap) nor the bare pilot.
 *   Measurement/diagnostic only, no QED. Platt-Trudgian Lambda &lt;= 0.2 REMAINS the
 *   rigorous SOTA.
 *
 *   @see imp-3383-onset-third-order-higher-pade.js (parent: closed-form A1..A4 + higher Pade)
 *   @see imp-3422-onset-coefficient-certification.js (certifies A3, A4)
 *   @see imp-3423-onset-pade-denominator-poles.js (Pade denominator pole locations)
 *
 *   Ticket: imp-3424 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

const SQRT2 = Math.SQRT2;
const ASINH1 = Math.asinh(1);           // s0: sinh(s0) = 1, cosh(s0) = sqrt2
const G0 = 1 - ASINH1;                    // G(s0)

// -- Onset Taylor blocks to high order (closed form via factorials) -----------
const SERIES_ORDER = 60;
const factorial = (n) => { let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; };

// F-block: F(s0+eps) = (sqrt2/2) eps^2 [1 + f1 eps + ...]; F_{2k}=sqrt2/(2k)!,
// F_{2k+1}=1/(2k+1)!, k>=1, and f_k = F_{k+2} * sqrt2 (dividing by the sqrt2/2 lead).
const F_BLOCK = [1];
for (let k = 1; k <= SERIES_ORDER; k++) {
  const n = k + 2;
  const Fn = (n % 2 === 0) ? SQRT2 / factorial(n) : 1 / factorial(n);
  F_BLOCK[k] = Fn * SQRT2;
}
// G-block: g0=1, g_k = (sqrt2-1)(-1)^{k+1}/(G0 k!).
const G_BLOCK = [1];
for (let k = 1; k <= SERIES_ORDER; k++) {
  G_BLOCK[k] = (SQRT2 - 1) * Math.pow(-1, k + 1) / (G0 * factorial(k));
}

// S = G-block / F-block via forward long division (imp-3422 recurrence).
const seriesDiv = (num, den, N) => {
  const c = new Array(N + 1).fill(0);
  for (let n = 0; n <= N; n++) {
    let acc = num[n] || 0;
    for (let k = 1; k <= n; k++) acc -= (den[k] || 0) * c[n - k];
    c[n] = acc / den[0];
  }
  return c;
};
const A = seriesDiv(G_BLOCK, F_BLOCK, SERIES_ORDER);   // A[0..60], A[k] = coefficient of eps^k
const SIGN_STRING = A.slice(0, 11).map((x) => (x > 0 ? '+' : '-')).join('');

// -- ROUTE A: 2-term recurrence fit A_{k+1} ~ p A_k + q A_{k-1} over a high-k window
// A conjugate pair eps = R e^{+-i theta} gives p = (2 cos theta)/R, q = -1/R^2.
const fitRecurrence = (lo, hi) => {
  let s11 = 0, s12 = 0, s22 = 0, t1 = 0, t2 = 0;
  for (let k = lo; k < hi; k++) {
    const a = A[k], b = A[k - 1], y = A[k + 1];
    s11 += a * a; s12 += a * b; s22 += b * b; t1 += a * y; t2 += b * y;
  }
  const det = s11 * s22 - s12 * s12;
  const p = (t1 * s22 - t2 * s12) / det;
  const q = (s11 * t2 - s12 * t1) / det;
  const disc = p * p + 4 * q;                 // <0 for a genuine complex pair
  const re = p / 2, im = Math.sqrt(Math.max(0, -disc)) / 2;
  const mag = Math.hypot(re, im);             // characteristic-root modulus = 1/R
  const R = 1 / mag;
  const theta = Math.atan2(im, re);
  return { p, q, disc, R, theta, epsRe: R * Math.cos(theta), epsIm: R * Math.sin(theta) };
};
const FIT = fitRecurrence(45, SERIES_ORDER);

// -- ROUTE B: direct nearest complex zero of F(s0+eps) via deflated Newton ----
// Minimal complex arithmetic on {re,im}.
const cAdd = (a, b) => ({ re: a.re + b.re, im: a.im + b.im });
const cSub = (a, b) => ({ re: a.re - b.re, im: a.im - b.im });
const cMul = (a, b) => ({ re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re });
const cScale = (a, s) => ({ re: a.re * s, im: a.im * s });
const cDiv = (a, b) => { const d = b.re * b.re + b.im * b.im; return { re: (a.re * b.re + a.im * b.im) / d, im: (a.im * b.re - a.re * b.im) / d }; };
const cAbs = (a) => Math.hypot(a.re, a.im);
const cExp = (z) => { const e = Math.exp(z.re); return { re: e * Math.cos(z.im), im: e * Math.sin(z.im) }; };
// h(eps) = sqrt2 cosh eps + sinh eps - eps - sqrt2 ; hp = sqrt2 sinh eps + cosh eps - 1.
const hVal = (z) => {
  const ez = cExp(z), emz = cExp(cScale(z, -1));
  const cosh = cScale(cAdd(ez, emz), 0.5), sinh = cScale(cSub(ez, emz), 0.5);
  return cSub(cSub(cAdd(cScale(cosh, SQRT2), sinh), z), { re: SQRT2, im: 0 });
};
const hDer = (z) => {
  const ez = cExp(z), emz = cExp(cScale(z, -1));
  const cosh = cScale(cAdd(ez, emz), 0.5), sinh = cScale(cSub(ez, emz), 0.5);
  return cSub(cAdd(cScale(sinh, SQRT2), cosh), { re: 1, im: 0 });
};
// Newton on g = h/eps^2 (deflates the eps=0 double root): g' = hp/eps^2 - 2 h/eps^3.
const newtonRoot = (z0) => {
  let z = z0;
  for (let i = 0; i < 200; i++) {
    const f = hVal(z), fp = hDer(z);
    const z2 = cMul(z, z), z3 = cMul(z2, z);
    const g = cDiv(f, z2);
    const gp = cSub(cDiv(fp, z2), cScale(cDiv(f, z3), 2));
    const step = cDiv(g, gp);
    z = cSub(z, step);
    if (cAbs(step) < 1e-15) break;
  }
  return z;
};
// Coarse grid -> collect distinct nonzero roots -> nearest.
const roots = [];
for (let x = -6; x <= 6; x += 0.5) {
  for (let y = -9; y <= 9; y += 0.5) {
    if (Math.hypot(x, y) < 0.4) continue;
    const r = newtonRoot({ re: x, im: y });
    if (!isFinite(r.re) || !isFinite(r.im)) continue;
    if (cAbs(r) < 0.3) continue;                       // the removed double root
    if (cAbs(hVal(r)) > 1e-8) continue;
    if (!roots.some((q) => cAbs(cSub(q, r)) < 1e-6)) roots.push(r);
  }
}
roots.sort((a, b) => cAbs(a) - cAbs(b));
const NEAREST = roots[0];
const R_DIRECT = cAbs(NEAREST);
const R_RECUR = FIT.R;

export const IMP3424_ONSET_SERIES_RADIUS_OF_CONVERGENCE = Object.freeze({
  id: 'imp-3424-onset-series-radius-of-convergence',
  ticket: 'imp-3424',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  parent: 'imp-3383-onset-third-order-higher-pade.js',

  summary:
    'Estimates the RADIUS OF CONVERGENCE of the imp-3383 onset-signature series S(eps) = ' +
    '1 + A1 eps + A2 eps^2 + ... and LOCATES its nearest complex singularity by two independent ' +
    'routes: (A) a 2-term recurrence fit A_{k+1}~p A_k + q A_{k-1} of the order-60 telescoped ' +
    'coefficients (Domb-Sykes ratios OSCILLATE -> a complex pair, not a real pole), and (B) a ' +
    'deflated-Newton complex root of F(s0+eps). Both give a CONJUGATE PAIR at eps* = -3.1239272 ' +
    '+- 4.3451390 i, R = |eps*| = 5.3515562 (agree to ~7 digits). The low-order alternating signs ' +
    'A1>0,A2<0,A3>0,A4<0 are a 4-term transient (A5>0,A6>0 break it), so they do NOT signal a real ' +
    'negative-axis singularity; the imp-3383 [2/1] real pole at eps~-2.851 is a Pade artifact ~1.88x ' +
    'nearer than the true off-axis singularity. RH-EQUIVALENT; degree-0 scalar measurement only.',

  onsetCoefficients: Object.freeze({
    note: 'Order-60 series division G-block/F-block; leading coefficients match imp-3383/imp-3422.',
    A0: A[0], A1: A[1], A2: A[2], A3: A[3], A4: A[4], A5: A[5], A6: A[6], A7: A[7],
    signStringA0toA10: SIGN_STRING,               // "++-+-++-+--"
    alternationBreaksAtOrder: 5,                  // A5 > 0 breaks the A1..A4 alternation
  }),

  routeARecurrenceFit: Object.freeze({
    note: 'A conjugate pair eps=R e^{+-i theta} forces A_{k+1}~p A_k + q A_{k-1} with ' +
          'p=(2 cos theta)/R, q=-1/R^2; least-squares over k in [45,60).',
    window: [45, SERIES_ORDER],
    p: FIT.p,
    q: FIT.q,
    discriminant: FIT.disc,                       // < 0 confirms a genuine complex pair
    isComplexPair: FIT.disc < 0,
    R: R_RECUR,
    thetaRad: FIT.theta,
    epsRe: FIT.epsRe,
    epsIm: FIT.epsIm,
  }),

  routeBDirectRoot: Object.freeze({
    note: 'Nearest nonzero complex zero of h(eps)=sqrt2 cosh eps + sinh eps - eps - sqrt2 ' +
          '(the eps=0 double zero deflated as h/eps^2) by grid + Newton.',
    epsRe: NEAREST.re,
    epsIm: Math.abs(NEAREST.im),
    R: R_DIRECT,
    argRad: Math.atan2(Math.abs(NEAREST.im), NEAREST.re),
    argDeg: Math.atan2(Math.abs(NEAREST.im), NEAREST.re) * 180 / Math.PI,
    isConjugatePair: true,
  }),

  radiusOfConvergence: Object.freeze({
    R: R_DIRECT,
    routeAgreementDigits: 7,
    routeSpread: Math.abs(R_RECUR - R_DIRECT),    // ~1e-7
    imp3383Pade21PoleAbs: 2.851,                  // real-axis Pade pole (imp-3383/imp-3423)
    trueSingularityFartherByFactor: R_DIRECT / 2.851,   // ~1.88
    onOrNearRealAxis: false,
  }),

  verdict: Object.freeze({
    nearestIsComplexConjugatePair: true,
    alternatingSignsAreTransientNotRealAxisPole: true,
    statement:
      'The onset series S(eps) has radius of convergence R = 5.3516, set by a COMPLEX-CONJUGATE ' +
      'pair of singularities at eps* = -3.1239272 +- 4.3451390 i (arg ~ 125.7 deg, well off both ' +
      'axes). Recurrence fit and direct Newton root agree to ~7 digits. The low-order alternating ' +
      'signs are a 4-term transient (A5, A6 both positive), NOT the persistent alternation a real ' +
      'negative-axis pole would force; the imp-3383 [2/1] real pole (eps~-2.851) is a Pade artifact ' +
      'nearer than the true off-axis singularity. Since the physical onset window eps>0 is small ' +
      'against R=5.35, S has a large analytic reach, reinforcing imp-3383/imp-3325 that phi is ' +
      'regular across the onset side.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isMeasurementOnly: true,
    operatorStepUntouched:
      'Estimates the analytic reach of a scalar onset series; adds no positivity and touches ' +
      'neither imp-3066 (the off-diagonal endpoint-Hankel operator obstruction, the lone ' +
      'remaining gap) nor the bare pilot.',
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
    didNotRerunBarePilot: true,
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3424_ONSET_SERIES_RADIUS_OF_CONVERGENCE_ASSERTIONS = [
  {
    id: 'imp3424-leading-coefficients-match-parents',
    why: 'The order-60 series division must reproduce the imp-3383/imp-3422 leading coefficients ' +
         'A1~3.25605, A2~-2.59666, A3~0.91088, A4~-0.18495; a mismatch would flag a block error.',
    holds: () =>
      Math.abs(A[1] - 3.25604592593) < 1e-8 &&
      Math.abs(A[2] + 2.59666481116) < 1e-8 &&
      Math.abs(A[3] - 0.91087552302) < 1e-8 &&
      Math.abs(A[4] + 0.18494684023) < 1e-8,
  },
  {
    id: 'imp3424-two-routes-agree-on-radius',
    why: 'The recurrence fit R and the direct-Newton complex root R must agree to ~1e-5, ' +
         'independently pinning the radius of convergence of S(eps).',
    holds: () => Math.abs(R_RECUR - R_DIRECT) < 1e-5,
  },
  {
    id: 'imp3424-radius-is-about-5p35',
    why: 'Both routes must place the nearest singularity at |eps*| ~ 5.3516, far outside the ' +
         'physical onset window, giving S a large analytic reach.',
    holds: () => Math.abs(R_DIRECT - 5.3515562) < 1e-4 && Math.abs(R_RECUR - 5.3515562) < 1e-4,
  },
  {
    id: 'imp3424-nearest-singularity-is-complex-pair-off-axis',
    why: 'The discriminant of the recurrence characteristic must be negative (complex pair) and the ' +
         'nearest zero must have a substantial imaginary part -- NOT a real negative-axis pole.',
    holds: () =>
      FIT.disc < 0 &&
      Math.abs(NEAREST.im) > 1 &&
      Math.abs(NEAREST.im - 4.3451390) < 1e-4 &&
      Math.abs(NEAREST.re + 3.1239272) < 1e-4,
  },
  {
    id: 'imp3424-alternating-signs-are-transient',
    why: 'The strict sign alternation holds only for A1..A4 and must BREAK by A5>0 (and A6>0): a ' +
         'real negative-axis singularity would instead force persistent A_k ~ (-1)^k / R^k alternation.',
    holds: () =>
      A[1] > 0 && A[2] < 0 && A[3] > 0 && A[4] < 0 && A[5] > 0 && A[6] > 0 &&
      IMP3424_ONSET_SERIES_RADIUS_OF_CONVERGENCE.onsetCoefficients.signStringA0toA10 === '++-+-++-+--',
  },
  {
    id: 'imp3424-true-singularity-farther-than-pade-pole',
    why: 'The genuine nearest singularity (R~5.35) must sit strictly farther out than the imp-3383 ' +
         '[2/1] real Pade pole at eps~-2.851, confirming that pole is a rational-fit artifact.',
    holds: () => R_DIRECT > 2.851 && R_DIRECT / 2.851 > 1.8,
  },
  {
    id: 'imp3424-honest-rh-equivalent-measurement-only',
    why: 'Mandatory honesty: this is a radius-of-convergence MEASUREMENT, RH-EQUIVALENT, not a proof, ' +
         'not a reduction below RH, leaves the imp-3066 operator step untouched, does not rerun the ' +
         'bare pilot, and PT 0.2 stays SOTA. If any of these flip the module over-claims.',
    holds: () => {
      const c = IMP3424_ONSET_SERIES_RADIUS_OF_CONVERGENCE.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.isMeasurementOnly === true &&
        c.didNotRerunBarePilot === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const a of IMP3424_ONSET_SERIES_RADIUS_OF_CONVERGENCE_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-3424-onset-series-radius-of-convergence assertion failed: ${a.id}`);
}

export default IMP3424_ONSET_SERIES_RADIUS_OF_CONVERGENCE;
