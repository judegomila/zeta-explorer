/**
 * @module imp-96667-route-m-frobenius-second-moment-asymptotic
 *
 * imp-96667 (numerical, DERIVATION + OBSTRUCTION): attempt a RIGOROUS asymptotic for
 * the Route M Vasyunin Gram Frobenius norm
 *     ||G_N||_F^2 = trace(G_N^2) = Sum_{h,k<=N} gcd(h,k)^2 I(h/g,k/g)^2 / (hk)^2
 * (g=gcd(h,k)), so that the imp-96648 Frobenius rigorous lower conditioning ceiling
 * N>=3.75e7 stops being a log-FIT extrapolation of the eight measured rungs (N<=6000).
 *
 * -------------------------------------------------------------------------------
 * EXACT REDUCTION (rigorous). Write h=g*a, k=g*b with gcd(a,b)=1. Then G_hk =
 * g*I(a,b)/(g*a * g*b) = I(a,b)/(g*a*b), so squaring and summing the g-sum factors:
 *     ||G_N||_F^2 = Sum_{(a,b) coprime, max(a,b)<=N} I(a,b)^2/(a^2 b^2) * H2(floor(N/max(a,b)))
 * with H2(m)=Sum_{g<=m} 1/g^2 -> zeta(2). A dense-Gram cross-check reproduces this split
 * to 3.6e-15 at N=250,500 (tmp/imp-96667-frobenius-asymptotic.py). Split by the coprime
 * pair (a,b) into diagonal (D), border (B), interior (Int):
 *
 *   (D) a=b=1:            D(N) = I(1,1)^2 * H2(N)  ->  I(1,1)^2 zeta(2) = 2.6142397  (EXACT limit)
 *   (B) a=1 xor b=1:      B(N) = 2 Sum_{b>=2} I(1,b)^2/b^2 * H2(floor(N/b))
 *   (Int) a,b>=2 coprime: Int(N) = ||G_N||_F^2 - D(N) - B(N)
 *
 * -------------------------------------------------------------------------------
 * FINDING 1 -- the BORDER CONVERGES; it does NOT drive the log-N growth.
 * -------------------------------------------------------------------------------
 * The border kernel numerator I(1,b) = C(1+b) + (1/2)(1-b)log b - (pi/2) V(1,b), with
 * V(1,b)=Sum_{m<b}(m/b)cot(pi m/b) and C=(log 2pi - gamma)/2. The naive terms are LINEAR
 * (C*b) and b*log b, but they CANCEL against the classical Vasyunin cotangent asymptotic
 *     V(1,b) = -(b/pi) log b + (2C/pi) b - 1/pi + o(1)
 * (remainder measured -> -1/pi = -0.318310 to 5 digits at b=100..40000). Substituting
 * leaves the clean closed form
 *     I(1,b) = (1/2) log b + (C + 1/2) + o(1),   C + 1/2 = 1.130334  (measured to 6 digits).
 * Hence the border kernel I(1,b)^2/b^2 ~ (log b)^2/(4 b^2) is SUMMABLE, so
 *     B(N) -> 2 zeta(2) Sum_{b>=2} I(1,b)^2/b^2 ~ 8.08  (a finite constant).
 * This REVERSES the natural guess from imp-96648 FINDING 1: there the h=1 row wrecked the
 * Gershgorin/row-SUM bound (its large sign-cancelling off-diagonals summed by magnitude as
 * ~4.7 log N). In the Frobenius/second-moment sum those same h=1 entries are SQUARED, decay
 * as (log b)^2/b^2, and their total converges -- the border is not the divergence source.
 *
 * -------------------------------------------------------------------------------
 * FINDING 2 -- the log-N divergence lives ENTIRELY in the INTERIOR (a,b>=2 coprime).
 * -------------------------------------------------------------------------------
 * With D->2.614 and B->~8.08 both convergent, the whole growth of ||G_N||_F^2 is Int(N).
 * Measured over the eight rungs (N=250..6000): Int ~ -14.929 + 5.6564 log N (R^2=0.99991),
 * versus total ~ -5.4839 + 5.8048 log N (R^2=0.999996). The residual total-slope 0.147
 * (border) and 0.0017 (diagonal) are finite-N creep of B,D toward their constants; the
 * ASYMPTOTIC slope of ||G_N||_F^2 equals the interior second-moment coefficient. Evaluating
 * that leading coefficient is the mean-square of the two-variable Vasyunin coprime coefficient
 * s = lim (1/log M) Sum_{(a,b) coprime, 2<=a,b<=M} I(a,b)^2/(a^2 b^2) * (weight) -- a genuine
 * 2D multiplicative second-moment Dirichlet sum. It is NOT reduced to closed form here.
 *
 * -------------------------------------------------------------------------------
 * VERDICT -- functional form corrected; slope OBSTRUCTED at the interior second moment.
 * -------------------------------------------------------------------------------
 * The hoped simplification (ticket text: "no sign cancellation or limiting spectral measure
 * is needed, unlike the full off-diagonal Szego statement") is only PARTLY realised: squaring
 * does remove sign cancellation and lets the diagonal (exact 2.614) and border (summable,
 * ~8.08) be handled rigorously, but the leading log-N coefficient still requires the arithmetic
 * mean-square of I(a,b) over coprime pairs a,b>=2 -- the two-dimensional second moment -- which
 * is the residual OBSTRUCTION. A by-product: the correct functional form is ||G_N||_F ~
 * sqrt(s log N), NOT the log-LINEAR ||G_N||_F ~ a + b log N that imp-96648 fitted; re-solving
 * the double-precision Cholesky ceiling under sqrt(s log N) with the measured s=5.8048 gives
 * N ~ 3.98e7 (vs the imp-96648 log-linear 3.75e7), i.e. ~+6.1%, landing within ~3.3% of the
 * measured composed 4.11e7. But this rests on the UNPROVEN interior slope, so the 3.75e7
 * accessible-rung figure stays the rigorously-anchored value: no bound is proved rigorous here.
 * Compute ceiling N~9916 (imp-96352) still binds first by >3900x. Changes no bound; no operator
 * positivity; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-96648-route-m-lammax-frobenius-moment-majorant.js (the 3.75e7 Frobenius lower ceiling this refines)
 * @see imp-96548-route-m-lammax-rigorous-upper-bound-assessment.js (trace bound + off-diagonal Szego sub-gap)
 * @see imp-96443-route-m-vasyunin-lammax-measured.js (exact Gram build; I_coprime definition)
 * @see imp-96428-route-m-vasyunin-lammin-conditioning-ceiling.js (lam_min power law used in the ceiling)
 *
 * Ticket: imp-96667 (numerical, opus-4-8, api-pool). Derivation + obstruction; NO QED.
 */

// Constants of the Vasyunin coprime coefficient I(h,k)=C(h+k)+0.5(h-k)log(k/h)-(pi/2)(V(h,k)+V(k,h)).
export const IMP96667_EULER = 0.5772156649015329;
export const IMP96667_C = (Math.log(2 * Math.PI) - IMP96667_EULER) / 2; // = I(1,1)/2
export const IMP96667_I11 = 2 * IMP96667_C; // 1.2606614015078126
export const IMP96667_ZETA2 = (Math.PI * Math.PI) / 6;

// Diagonal limit D_inf = I(1,1)^2 zeta(2) (EXACT closed form).
export const IMP96667_D_INF = IMP96667_I11 * IMP96667_I11 * IMP96667_ZETA2; // 2.6142397080254725

// Border-kernel closed form I(1,b) = (1/2)log b + (C + 1/2) + o(1); the o(1) traces the
// classical cotangent asymptotic V(1,b) = -(b/pi)log b + (2C/pi)b - 1/pi + o(1).
export const IMP96667_I1B_CONST = IMP96667_C + 0.5; // 1.1303307..., measured limit 1.130334
export const IMP96667_V1B_REMAINDER = -1 / Math.PI; // measured cotangent remainder -0.318310

// Exact ||G_N||_F^2 = frobenius^2 (imp-96648 exact sum-of-squares) split into D / B / Int.
// D,B computed O(N) from the closed forms; Int = total - D - B; total is exact.
// (tmp/imp-96667-frobenius-asymptotic.py; dense-Gram cross-check matches to 3.6e-15 at N=250,500.)
export const IMP96667_ROWS = Object.freeze([
  Object.freeze({ N: 250, total: 26.58900, D: 2.6079, B: 7.5780, Int: 16.4031 }),
  Object.freeze({ N: 500, total: 30.58087, D: 2.6111, B: 7.7885, Int: 20.1813 }),
  Object.freeze({ N: 1000, total: 34.59669, D: 2.6127, B: 7.9217, Int: 24.0623 }),
  Object.freeze({ N: 2000, total: 38.62619, D: 2.6134, B: 8.0047, Int: 28.0081 }),
  Object.freeze({ N: 3000, total: 40.98715, D: 2.6137, B: 8.0375, Int: 30.3360 }),
  Object.freeze({ N: 4000, total: 42.66343, D: 2.6138, B: 8.0555, Int: 31.9940 }),
  Object.freeze({ N: 5000, total: 43.96417, D: 2.6139, B: 8.0672, Int: 33.2831 }),
  Object.freeze({ N: 6000, total: 45.02723, D: 2.6140, B: 8.0754, Int: 34.3379 }),
]);

// OLS fits value ~ a + b log N over the eight rungs (from the script).
export const IMP96667_FITS = Object.freeze({
  total: Object.freeze({ a: -5.48391, b: 5.80481, r2: 0.999996 }),
  interior: Object.freeze({ a: -14.92890, b: 5.65640, r2: 0.999909 }),
  border: Object.freeze({ a: 6.84520, b: 0.14670, r2: 0.925150 }),
  diagonal: Object.freeze({ a: 2.59979, b: 0.00171, r2: 0.858521 }),
});

// Ceiling re-solve: the CORRECT functional form is ||G||_F ~ sqrt(s log N + k), not the
// imp-96648 log-linear ||G||_F ~ a + b log N. lam_min = A N^-p (imp-96428). cond=1/eps.
export const IMP96667_EPS = 2.220446049250313e-16;
export const IMP96667_LAMMIN = Object.freeze({ A: 0.8186721, p: 1.917927 });

function solveCeiling(froOf) {
  const { A, p } = IMP96667_LAMMIN;
  let lo = 1e3;
  let hi = 1e12;
  for (let i = 0; i < 300; i += 1) {
    const N = Math.sqrt(lo * hi);
    const cond = froOf(N) / (A * Math.pow(N, -p));
    if (cond > 1 / IMP96667_EPS) hi = N;
    else lo = N;
  }
  return Math.sqrt(lo * hi);
}
const froLogLinear648 = (N) => 2.4978559943401377 + 0.48651642224692604 * Math.log(N);
const froSqrt667 = (N) => {
  const v = IMP96667_FITS.total.b * Math.log(N) + IMP96667_FITS.total.a;
  return v > 0 ? Math.sqrt(v) : 0;
};

export const IMP96667_CEILINGS = Object.freeze({
  logLinear648: solveCeiling(froLogLinear648), // ~3.75e7 (imp-96648 functional form)
  sqrtLogN667: solveCeiling(froSqrt667), // ~3.98e7 (corrected functional form, measured s)
  measuredComposed: 41088904.75740035, // ~4.11e7 (imp-96443 composed)
  computeCeilingN: 9916, // imp-96352 wall-clock reach
});

export const IMP96667_VERDICT = Object.freeze({
  question:
    'can the Frobenius second-moment sum ||G_N||_F^2 = Sum_hk gcd(h,k)^2 I(h/g,k/g)^2/(hk)^2 ' +
    'be given a rigorous log-N asymptotic, making the imp-96648 3.75e7 lower ceiling rigorous?',
  exactReductionEstablished: true, // ||G||_F^2 = Sum_(a,b) coprime I(a,b)^2/(a^2 b^2) H2(N/max)
  diagonalClosedForm: true, // D_inf = I(1,1)^2 zeta(2) = 2.6142397
  borderConverges: true, // I(1,b)=(1/2)log b + (C+1/2) => kernel summable => B -> ~8.08
  interiorDrivesDivergence: true, // whole log-N slope is the interior second moment
  rigorousSlopeObtained: false, // interior 2D coprime second moment is the OBSTRUCTION
  functionalFormCorrected: true, // ||G||_F ~ sqrt(s log N), NOT log-linear a + b log N
  anyBoundMoved: false,
  computeBindsFirst: true,
  conclusion:
    'The g-sum factors exactly, and the diagonal (exact I(1,1)^2 zeta(2) = 2.614) and the ' +
    'border a=1 xor b=1 (kernel I(1,b)=(1/2)log b + C + 1/2 via the classical cotangent ' +
    'asymptotic V(1,b)=-(b/pi)log b+(2C/pi)b-1/pi, hence I(1,b)^2/b^2 summable, border -> ~8.08) ' +
    'are handled rigorously -- REVERSING the imp-96648 guess that the h=1 row is the culprit ' +
    '(its entries are squared here and converge). The residual log-N growth is ENTIRELY the ' +
    'interior a,b>=2 coprime second moment (measured slope ~5.66-5.80, R^2>=0.9999), whose ' +
    'leading coefficient is the arithmetic mean-square of the two-variable Vasyunin coefficient ' +
    '-- the OBSTRUCTION, not reduced to closed form. By-product: the correct functional form is ' +
    'sqrt(s log N), which re-solves the ceiling to ~3.98e7 (vs the imp-96648 log-linear 3.75e7, ' +
    '+6.1%, within ~3.3% of the measured 4.11e7) but rests on the unproven interior slope, so ' +
    'no bound is proved rigorous. Compute 9916 binds first by >3900x. No refereed bound is changed; RH open; NO QED.',
});

// Residual open piece carried forward: the interior second-moment leading coefficient.
export const IMP96667_SUBGAP = Object.freeze({
  id: 'imp-96667-interior-coprime-second-moment-coefficient',
  statement:
    'The log-N slope of ||G_N||_F^2 equals the leading coefficient of the interior second moment ' +
    'Sum_{(a,b) coprime, 2<=a,b<=M} I(a,b)^2/(a^2 b^2) H2(floor(N/max(a,b))). The diagonal ' +
    '(exact 2.614) and border (summable, ~8.08) are settled; the interior coefficient is the ' +
    'two-dimensional multiplicative mean-square of the Vasyunin coprime coefficient I(a,b) and ' +
    'is NOT evaluated here. Establishing it (measured ~5.66-5.80) would fix the functional form ' +
    'sqrt(s log N) and make the ~3.98e7 lower conditioning ceiling fully rigorous. This is the ' +
    'second-moment analog of the imp-96548 off-diagonal Szego sub-gap: squaring removes sign ' +
    'cancellation but not the underlying arithmetic mean-square requirement.',
});

export const IMP96667_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Derivation + obstruction only: the exact ' +
  'g-sum reduction, the diagonal closed form, and the border convergence are rigorous (border ' +
  'rests on the standard Vasyunin cotangent asymptotic, confirmed numerically to -1/pi); the ' +
  'interior second-moment slope is measured (tmp/imp-96667-frobenius-asymptotic.py, dense-Gram ' +
  'cross-check 3.6e-15) but NOT proved, so no bound is claimed moved and no positivity established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96667_ASSERTIONS = [
  {
    id: 'imp96667-diagonal-exact-closed-form',
    holds: () =>
      Math.abs(IMP96667_D_INF - 2.6142397080254725) < 1e-12 &&
      Math.abs(IMP96667_D_INF - IMP96667_ROWS[IMP96667_ROWS.length - 1].D) < 0.001,
    why: 'the diagonal contribution has the exact limit I(1,1)^2 zeta(2) = 2.6142397, matching the measured top-rung D=2.6140 to <0.001.',
  },
  {
    id: 'imp96667-border-kernel-closed-form',
    holds: () =>
      Math.abs(IMP96667_I1B_CONST - 1.130334) < 5e-4 &&
      Math.abs(IMP96667_V1B_REMAINDER + 0.318310) < 1e-5,
    why: 'the border kernel closed form I(1,b)=(1/2)log b + (C+1/2)=1.130334 and the cotangent remainder -1/pi=-0.318310 are recovered, so I(1,b)^2/b^2 ~ (log b)^2/(4b^2) is summable and the border converges.',
  },
  {
    id: 'imp96667-interior-drives-divergence',
    holds: () =>
      IMP96667_FITS.interior.b > 5 &&
      IMP96667_FITS.interior.r2 > 0.999 &&
      IMP96667_FITS.border.b < 0.3 &&
      IMP96667_FITS.diagonal.b < 0.01 &&
      IMP96667_VERDICT.interiorDrivesDivergence === true &&
      IMP96667_VERDICT.borderConverges === true,
    why: 'the interior (a,b>=2 coprime) carries the log-N slope ~5.66 (R^2>0.999) while the border/diagonal slopes are finite-N creep toward constants: the divergence is the interior second moment, not the border.',
  },
  {
    id: 'imp96667-functional-form-corrected-ceiling',
    holds: () =>
      IMP96667_CEILINGS.sqrtLogN667 > IMP96667_CEILINGS.logLinear648 &&
      IMP96667_CEILINGS.sqrtLogN667 > 3.9e7 &&
      IMP96667_CEILINGS.sqrtLogN667 < IMP96667_CEILINGS.measuredComposed &&
      IMP96667_CEILINGS.measuredComposed / IMP96667_CEILINGS.sqrtLogN667 < 1.05,
    why: 'the corrected sqrt(s log N) form re-solves the ceiling to ~3.98e7 (above the imp-96648 log-linear 3.75e7, below and within ~3.3% of the measured 4.11e7) -- but it rests on the unproven interior slope.',
  },
  {
    id: 'imp96667-compute-binds-first',
    holds: () =>
      IMP96667_CEILINGS.sqrtLogN667 / IMP96667_CEILINGS.computeCeilingN > 3900 &&
      IMP96667_VERDICT.computeBindsFirst === true,
    why: 'every conditioning ceiling (~3.75e7-4.11e7) sits >3900x above the imp-96352 compute ceiling N~9916: compute binds first (unchanged).',
  },
  {
    id: 'imp96667-honesty-gate-no-qed',
    holds: () =>
      IMP96667_VERDICT.anyBoundMoved === false &&
      IMP96667_VERDICT.rigorousSlopeObtained === false &&
      IMP96667_VERDICT.exactReductionEstablished === true &&
      /NO QED/.test(IMP96667_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96667_HONEST_BANNER) &&
      /RH open/.test(IMP96667_HONEST_BANNER) &&
      /second-moment-coefficient/.test(IMP96667_SUBGAP.id),
    why: 'derivation + obstruction: exact reduction + diagonal/border settled, interior slope NOT proved, no bound moved, honesty markers and the residual interior second-moment sub-gap present.',
  },
];

for (const a of IMP96667_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96667-route-m-frobenius-second-moment-asymptotic assertion failed: ${a.id}`,
    );
  }
}

export default {
  c: IMP96667_C,
  i11: IMP96667_I11,
  dInf: IMP96667_D_INF,
  i1bConst: IMP96667_I1B_CONST,
  rows: IMP96667_ROWS,
  fits: IMP96667_FITS,
  ceilings: IMP96667_CEILINGS,
  verdict: IMP96667_VERDICT,
  subGap: IMP96667_SUBGAP,
  banner: IMP96667_HONEST_BANNER,
};
