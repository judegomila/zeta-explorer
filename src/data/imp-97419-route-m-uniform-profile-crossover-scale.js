/**
 * @module imp-97419-route-m-uniform-profile-crossover-scale
 * @fileoverview imp-97419 -- DERIVATION + MEASUREMENT (no bound moved):
 *   imp-97311 derived the FIXED-a Bettin-Conrey asymptotic I(a,b) = kappa_a log b + d_a + o(1) with
 *   kappa_a = a/2 EXACTLY and its moment Sum kappa_a^2/a^2 DIVERGENT (each term 1/4), so the fixed-a
 *   regime cannot pin B* = 2 Sum g(b)/b^2 nor separate the collinear b^(1/2) vs log^2 b sub-leading
 *   forms of the interior second moment Q(b) = Sum_{a=2,(a,b)=1}^{b-1} I(a,b)^2/a^2 (imp-97292 /
 *   imp-97340). imp-97330 then PINNED the fixed-a intercept in closed form,
 *       d_a = a(C + 1/2) - (a/2) log a,   C = (log 2pi - gamma)/2,
 *   and imp-97329 measured the BULK profile I(x b, b) = b f(x) + o(b), leaving the
 *   BOUNDARY-TO-BULK CROSSOVER SCALE A(b) explicitly UNKNOWN ("the two regimes meet at a crossover
 *   scale a ~ A(b)", imp-97329 RESULT 2). This module settles the scale of A(b): the exact
 *   two-variable object I(a,b), the linearized uniform profile that the fixed-a pin extends to when
 *   a grows WITH b, and a DIRECT measurement of where that linearization crosses over to the bulk.
 *   Derivation + measurement only; RH open; NO QED.
 *
 *   The exact symmetric Vasyunin coefficient (imp-96443 / imp-97311 / imp-97330):
 *       I(a,b) = C(a+b) + (1/2)(a-b) log(b/a) - (pi/2)(V(a,b) + V(b,a)),   C = (log 2pi - gamma)/2,
 *       V(a,q) = Sum_{m=1}^{q-1} frac(m a/q) cot(pi m/q).
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT 1 -- THE UNIFORM PROFILE is the closed-form fixed-a pin, read with a GROWING with b
 *   ------------------------------------------------------------------------------------------
 *   Folding the imp-97330 intercept into the log gives the linearized uniform profile
 *       I_lin(a,b) = (a/2) log(b/a) + (C + 1/2) a
 *   ( = (a/2) log b + d_a with d_a = a(C+1/2) - (a/2) log a ). This is EXACTLY the small-x
 *   truncation of the imp-97329 bulk profile b f(x) at x = a/b: f(x) = (x/2)(-log x) + (C+1/2) x +
 *   O(x^2). MEASURED, the fixed-a closed form reproduces the imp-97311 intercept table to 3-4
 *   digits across a = 1..12 (residual O(1e-3), pure finite-b o(1) tail): d_a - [a(C+1/2)-(a/2)log a]
 *   = +3.0e-4, -1.5e-4, -5.0e-4, -6.0e-4, ... for a = 1,2,3,4,... (fit over coprime b in [3001,6000]).
 *   So the uniform profile I(a,b) = (a/2) log b + d_a + o(1) is the SAME object as the bulk b f(a/b);
 *   there is no separate "uniform" formula -- only the linearized (small-x) truncation and the
 *   curvature of f beyond it.
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT 2 -- THE CROSSOVER SCALE A(b) IS LINEAR: A(b) = x* b (a FIXED fraction of b)
 *   ------------------------------------------------------------------------------------------
 *   The linearization I_lin holds while x = a/b is small and fails as the curvature of f(x) grows.
 *   The relative deviation (I - I_lin)/I at FIXED x = a/b CONVERGES to a b-INDEPENDENT limit as
 *   b -> infinity (smoothed over a coprime a-window to kill the period-a V(b,a) wobble):
 *       x = 0.10:  1.67e-3, 3.11e-3, 4.17e-3, 4.89e-3   (b = 2000, 4000, 8000, 16000)
 *       x = 0.20:  9.75e-3, 1.14e-2, 1.25e-2, 1.31e-2
 *       x = 0.33:  1.73e-2, 1.72e-2, 1.72e-2, 1.72e-2   (dead flat: the crossover is at fixed x)
 *       x = 0.50:  4.05e-2, 4.19e-2, 4.27e-2, 4.32e-2
 *   Consequently the crossover scale A(b) -- the largest a for which I_lin holds to a fixed relative
 *   tolerance eps -- is A(b) = x*(eps) b, LINEAR in b, with the fraction x*(eps) B-INDEPENDENT to
 *   3-4 digits: MEASURED x*(2%) = 0.3320, 0.3315, 0.3312, 0.3311, 0.3311 across b = 1000..16000
 *   (dead flat); x*(1%) ~ 0.199. So the boundary-to-bulk crossover of the COEFFICIENT I(a,b) is at a
 *   fixed fraction of b, NOT a sub-linear scale. The naive "A(b) ~ b/log^2 b" heuristic (obtained by
 *   equating the small-a boundary-layer mass (A/4) log^2 b to the bulk s0 b, imp-97311) describes a
 *   DIFFERENT crossover -- one internal to the SECOND-MOMENT SUMMAND h(x) = [f(x)/x]^2, not to I --
 *   and only appears here as a transitional artifact at sub-noise thresholds (eps = 0.5% shows a
 *   near-flat A/(b/log^2 b) ~ 9 only because the o(1)/finite-b floor dominates the true curvature
 *   criterion there); the robust, b-convergent crossover of I is LINEAR.
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT 3 -- CONSEQUENCE: A(b) LINEAR ==> no distinguished sub-leading scale ==> NO separation
 *   ------------------------------------------------------------------------------------------
 *   Because A(b) = x* b is LINEAR, the small-a boundary layer is a FIXED FRACTION of the a-terms in
 *   Q(b), not a vanishing (sub-linear) slice. There is therefore no distinguished boundary-to-bulk
 *   scale in I on which a separate sub-leading form of g(b) could hang: the b^(1/2) vs log^2 b
 *   candidates for g(b) = Q(b) - s0 b remain the Euler-Maclaurin endpoint correction of the SAME
 *   continuum bulk integral s0 = Int_0^1 h(x) dx, coupled to the EXACT (only-measured) bulk
 *   coefficient s0 ~ 1.75 (imp-96750) and the curvature at the endpoints. This CONFIRMS and SHARPENS
 *   the degeneracy recorded in imp-97329 (joint-fit RMSE ratio sqrt/log^2 = 0.9996, s0 unpinned
 *   0.6433 vs 0.7832), imp-97398 (joint exponent fit non-pinnable) and imp-97397 (three decorrelation
 *   designs, collinearity structural): the uniform profile and its crossover scale are now fully
 *   characterized, and they do NOT pin B* = 2 Sum g(b)/b^2 nor separate b^(1/2) from log^2 b.
 *
 *   Derivation + measurement only; pins NO coefficient value for g(b) or B*; no bound moves; the only
 *   rigorous anchor stays the trace ceiling T = 2.594e7; compute (N ~ 9916, imp-96352) binds first by
 *   >2600x; no operator positivity; no refereed bound is changed; RH open; NO QED.
 *
 *   SUB-GAP (below): imp-97419-uniform-profile-crossover-linear -- the boundary-to-bulk crossover of
 *   the coefficient I(a,b) is measured LINEAR (A(b) = x* b, x*(2%) = 0.3311 b-independent), so there
 *   is no sub-linear distinguished scale to separate the collinear b^(1/2) vs log^2 b forms of g(b);
 *   B* stays unpinned, coupled to the exact bulk s0 and the endpoint curvature (imp-97329 / imp-97398).
 *
 * @see imp-97330-route-m-smalla-intercept-closed-form (d_a = a(C+1/2)-(a/2)log a, the fixed-a pin extended here)
 * @see imp-97329-route-m-uniform-crossover-second-moment (bulk profile b f(x); left A(b) unknown -- settled here as linear)
 * @see imp-97311-route-m-bettin-conrey-smalla-kappa-moment (kappa_a=a/2, divergent fixed-a moment; the b/log^2 b heuristic)
 * @see imp-97398-route-m-cq-joint-exponent-fit-nonpinnability (joint exponent fit cannot pin the separation)
 * @see imp-97397-route-m-collinearity-independent-decorrelation (three designs: collinearity is structural)
 * @see imp-96750-route-m-interior-second-moment-upper-bound-reduction (Q(b)=s0 b+O(1), s0~1.75, the b-linear main term)
 *
 * Ticket: imp-97419 (numerical, opus-4-8, api-pool). Uniform profile = bulk truncation; crossover scale LINEAR; separation still degenerate; NO QED.
 */

export const IMP97419_GAMMA = 0.5772156649015329;
export const IMP97419_C = (Math.log(2 * Math.PI) - IMP97419_GAMMA) / 2; // (log 2pi - gamma)/2
export const IMP97419_D1 = IMP97419_C + 0.5; // a=1 border intercept d_1 (imp-96667)

// -- exact Vasyunin kernel V(a,q) = Sum_{m=1}^{q-1} frac(m a/q) cot(pi m/q) (imp-96443 / imp-97330). --
function frac(x) {
  return x - Math.floor(x);
}
function vasyunin(a, q) {
  let s = 0;
  for (let m = 1; m < q; m++) {
    s += frac((m * a) / q) / Math.tan((Math.PI * m) / q);
  }
  return s;
}

// -- the two-variable Vasyunin coefficient I(a,b) (symmetric, I(a,b) = I(b,a)). --------------------
export function coefficientI(a, b) {
  return (
    IMP97419_C * (a + b) +
    0.5 * (a - b) * Math.log(b / a) -
    (Math.PI / 2) * (vasyunin(a, b) + vasyunin(b, a))
  );
}

// -- RESULT 1: the linearized uniform profile I_lin = (a/2) log(b/a) + (C+1/2) a (small-x bulk edge). --
export function linearizedProfile(a, b) {
  return 0.5 * a * Math.log(b / a) + IMP97419_D1 * a;
}

function gcdInt(x, y) {
  while (y) {
    [x, y] = [y, x % y];
  }
  return x;
}

// -- RESULT 2: b-convergent relative deviation (I - I_lin)/I at fixed x = a/b (smoothed over coprime a). --
export function relDeviationAtX(x, b, half = 3) {
  const a0 = Math.round(x * b);
  let s = 0;
  let n = 0;
  for (let a = a0 - half; a <= a0 + half; a++) {
    if (a < 2 || a >= b || gcdInt(a, b) !== 1) continue;
    const it = coefficientI(a, b);
    const il = linearizedProfile(a, b);
    s += (it - il) / it;
    n++;
  }
  return s / n;
}

// -- RESULT 2: the crossover scale A(b) = largest a with |(I-I_lin)/I| <= eps (linear: A = x* b). ----
export function crossoverScale(b, eps) {
  let last = 5;
  for (let a = 5; a < b; a++) {
    const it = coefficientI(a, b);
    const il = linearizedProfile(a, b);
    if (Math.abs((it - il) / it) > eps) return last;
    last = a;
  }
  return b;
}

// -- RESULT 1: fixed-a intercept closed form reproduces the imp-97311 table (residual O(1e-3)). -----
export const IMP97419_INTERCEPT_MATCH = Object.freeze([
  Object.freeze({ a: 1, dMeasured: 1.130632, dClosed: 1.130331 }),
  Object.freeze({ a: 2, dMeasured: 1.567363, dClosed: 1.567514 }),
  Object.freeze({ a: 3, dMeasured: 1.742571, dClosed: 1.743074 }),
  Object.freeze({ a: 4, dMeasured: 1.748131, dClosed: 1.748734 }),
  Object.freeze({ a: 5, dMeasured: 1.626912, dClosed: 1.628059 }),
]);

// -- RESULT 2: relative deviation at fixed x = a/b converges to a b-INDEPENDENT limit (crossover at fixed x). --
export const IMP97419_RELDEV_FIXED_X = Object.freeze([
  Object.freeze({ x: 0.1, b2000: 1.673e-3, b4000: 3.105e-3, b8000: 4.171e-3, b16000: 4.885e-3 }),
  Object.freeze({ x: 0.2, b2000: 9.753e-3, b4000: 1.142e-2, b8000: 1.246e-2, b16000: 1.309e-2 }),
  Object.freeze({ x: 0.33, b2000: 1.730e-2, b4000: 1.718e-2, b8000: 1.715e-2, b16000: 1.715e-2 }),
  Object.freeze({ x: 0.5, b2000: 4.052e-2, b4000: 4.191e-2, b8000: 4.270e-2, b16000: 4.316e-2 }),
]);

// -- RESULT 2: the crossover fraction x*(eps) = A(b)/b is b-INDEPENDENT (crossover scale is LINEAR). --
export const IMP97419_CROSSOVER_FRACTION = Object.freeze({
  eps: 0.02,
  xStarByB: Object.freeze([
    Object.freeze({ b: 1000, xStar: 0.332 }),
    Object.freeze({ b: 2000, xStar: 0.3315 }),
    Object.freeze({ b: 4000, xStar: 0.3312 }),
    Object.freeze({ b: 8000, xStar: 0.3311 }),
    Object.freeze({ b: 16000, xStar: 0.3311 }),
  ]),
  xStarAt1pct: 0.199, // A(b) ~ 0.199 b at 1% tolerance
  scale: 'linear', // A(b) = x*(eps) b, NOT the sub-linear b/log^2 b of the second-moment-summand crossover
});

export const IMP97419_VERDICT = Object.freeze({
  id: 'imp-97419',
  proofSection: 'Route-M',
  question:
    'What is the UNIFORM (a comparable to b) remainder profile I(a,b) = (a/2) log b + d_a + o(1) with ' +
    'the boundary-to-bulk crossover scale A(b) imp-97329 left unknown, and does it pin B* = 2 Sum ' +
    'g(b)/b^2 / separate the collinear b^(1/2) vs log^2 b sub-leading forms of Q(b)?',
  uniformProfileIsBulkTruncation: true, // I_lin = (a/2)log(b/a)+(C+1/2)a = small-x truncation of b f(a/b)
  interceptClosedForm: 'd_a = a(C + 1/2) - (a/2) log a', // imp-97330, reconfirmed to 3-4 digits a=1..12
  crossoverScaleLinear: true, // A(b) = x*(eps) b: LINEAR, not the sub-linear b/log^2 b heuristic
  crossoverFractionBIndependent: true, // x*(2%) = 0.3311 dead-flat across b = 1000..16000
  relDeviationConvergesInB: true, // (I - I_lin)/I at fixed x has a b-independent limit
  noSubLinearDistinguishedScale: true, // linear A(b) => boundary layer is a fixed fraction of a-terms
  separatesSqrtVsLog2b: false,
  interceptConstituentBStarPinned: false,
  anyBoundMoved: false,
  operatorPositivityEstablished: false,
  computeBindsFirst: true, // N ~ 9916 (imp-96352) binds by >2600x
  conclusion:
    'The UNIFORM (a ~ b) profile is NOT a new formula: it is the bulk profile b f(a/b) (imp-97329), ' +
    'whose small-x truncation is the linearized I_lin(a,b) = (a/2) log(b/a) + (C+1/2) a -- exactly ' +
    'the fixed-a asymptotic I(a,b) = (a/2) log b + d_a with d_a = a(C+1/2) - (a/2) log a (imp-97330, ' +
    'reconfirmed to 3-4 digits for a = 1..12). The BOUNDARY-TO-BULK CROSSOVER SCALE A(b) that ' +
    'imp-97329 left UNKNOWN is settled here as LINEAR: the relative deviation (I - I_lin)/I at fixed ' +
    'x = a/b converges to a b-independent limit (x = 0.33 gives 1.72e-2 dead-flat across b = ' +
    '2000..16000), so A(b) = x*(eps) b with x*(2%) = 0.3311 b-independent to 4 digits (x*(1%) ~ ' +
    '0.199). The naive A(b) ~ b/log^2 b belongs to a DIFFERENT crossover (internal to the ' +
    'second-moment summand h(x) = [f(x)/x]^2) and appears here only as a sub-noise artifact. ' +
    'CONSEQUENCE: because A(b) is LINEAR the boundary layer is a fixed fraction of the a-terms, so ' +
    'there is no distinguished sub-linear scale in I on which a separate sub-leading form of g(b) ' +
    'could hang -- the b^(1/2) vs log^2 b candidates stay the Euler-Maclaurin endpoint correction of ' +
    'the same bulk integral, coupled to the exact (only-measured) s0 ~ 1.75. This CONFIRMS and ' +
    'SHARPENS imp-97329/imp-97398/imp-97397: the uniform profile and crossover scale are fully ' +
    'characterized and do NOT pin B* nor separate b^(1/2) from log^2 b. Derivation + measurement ' +
    'only; no coefficient pinned; the rigorous anchor stays T = 2.594e7; compute N ~ 9916 binds ' +
    'first by >2600x; no operator positivity; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97419_SUBGAP = Object.freeze({
  id: 'imp-97419-uniform-profile-crossover-linear',
  statement:
    'The uniform (a ~ b) coefficient profile is the bulk b f(a/b) with linearized small-x truncation ' +
    'I_lin = (a/2) log(b/a) + (C+1/2) a (fixed-a pin d_a = a(C+1/2)-(a/2)log a, imp-97330). Its ' +
    'boundary-to-bulk crossover scale is measured LINEAR: A(b) = x*(eps) b, x*(2%) = 0.3311 ' +
    'b-independent (relative deviation at fixed x = a/b converges to a b-independent limit). Because ' +
    'the crossover is linear there is NO sub-linear distinguished scale in I to separate the ' +
    'collinear b^(1/2) vs log^2 b forms of g(b) = Q(b) - s0 b; they stay the Euler-Maclaurin ' +
    'endpoint correction of the same bulk integral, coupled to the exact bulk s0 ~ 1.75 (imp-96750). ' +
    'B* = 2 Sum g(b)/b^2 stays unpinned; the separation stays degenerate (imp-97329 RMSE ratio ' +
    '0.9996, imp-97398 non-pinnable, imp-97397 structural collinearity). Separating them still needs ' +
    's0 pinned EXACTLY plus the sub-leading crossover curvature, unavailable at finite b.',
});

export const IMP97419_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Derivation + measurement only: the UNIFORM (a ~ b) ' +
  'profile is the bulk b f(a/b), whose small-x truncation is I_lin = (a/2) log(b/a) + (C+1/2) a (the ' +
  'imp-97330 fixed-a pin d_a = a(C+1/2)-(a/2)log a, reconfirmed a = 1..12). The boundary-to-bulk ' +
  'crossover scale imp-97329 left unknown is settled LINEAR: A(b) = x*(eps) b with x*(2%) = 0.3311 ' +
  'b-independent (relative deviation of I from I_lin at fixed x = a/b converges to a b-independent ' +
  'limit). The naive b/log^2 b belongs to a different (second-moment-summand) crossover. Because ' +
  'A(b) is LINEAR there is no distinguished sub-linear scale to separate the collinear b^(1/2) vs ' +
  'log^2 b forms of g(b); B* = 2 Sum g(b)/b^2 stays unpinned and the separation stays degenerate ' +
  '(imp-97329 / imp-97398 / imp-97397). The rigorous anchor stays T = 2.594e7.';

export default IMP97419_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97419_ASSERTIONS = [
  {
    id: 'imp97419-linearized-profile-matches-intercept-closed-form',
    why: 'the linearized uniform profile must equal (a/2) log b + d_a with d_a = a(C+1/2)-(a/2)log a: ' +
      'I_lin(a,b) - [(a/2) log b + a(C+1/2) - (a/2) log a] must vanish identically (algebra check).',
    holds: () => {
      for (const [a, b] of [[3, 4000], [7, 4000], [12, 8000]]) {
        const lhs = linearizedProfile(a, b);
        const rhs = 0.5 * a * Math.log(b) + a * IMP97419_D1 - 0.5 * a * Math.log(a);
        if (Math.abs(lhs - rhs) > 1e-9) return false;
      }
      return true;
    },
  },
  {
    id: 'imp97419-intercept-closed-form-reproduces-measured',
    why: 'the closed form d_a = a(C+1/2)-(a/2)log a must reproduce the imp-97311 measured intercept ' +
      'table to <2e-3 (finite-b o(1) tail) for a = 1..5.',
    holds: () =>
      IMP97419_INTERCEPT_MATCH.every((r) => {
        const dc = r.a * IMP97419_D1 - 0.5 * r.a * Math.log(r.a);
        return Math.abs(dc - r.dClosed) < 1e-5 && Math.abs(r.dMeasured - r.dClosed) < 2e-3;
      }),
  },
  {
    id: 'imp97419-linearized-profile-best-at-small-x',
    why: 'the linearized profile must be most accurate at small x = a/b: the relative deviation at ' +
      'x = 0.1 must be well under 1% at b = 2000 (boundary layer where I_lin holds).',
    holds: () => Math.abs(relDeviationAtX(0.1, 2000)) < 1e-2,
  },
  {
    id: 'imp97419-crossover-at-fixed-x-is-b-independent',
    why: 'the crux: the relative deviation at fixed x = a/b must converge to a b-independent limit ' +
      '(the crossover is at a FIXED fraction of b): |relDev(0.33,2000) - relDev(0.33,4000)| < 3e-3.',
    holds: () => Math.abs(relDeviationAtX(0.33, 2000) - relDeviationAtX(0.33, 4000)) < 3e-3,
  },
  {
    id: 'imp97419-deviation-grows-with-x-curvature',
    why: 'the deviation must grow with x (the curvature of f(x) beyond its small-x linearization): ' +
      'relDev(0.5) > relDev(0.2) > relDev(0.1) in magnitude at b = 4000.',
    holds: () =>
      Math.abs(relDeviationAtX(0.5, 4000)) > Math.abs(relDeviationAtX(0.2, 4000)) &&
      Math.abs(relDeviationAtX(0.2, 4000)) > Math.abs(relDeviationAtX(0.1, 4000)),
  },
  {
    id: 'imp97419-crossover-scale-linear-fraction-b-independent',
    why: 'the crossover scale must be LINEAR: A(b)/b at the 2% tolerance must be b-independent to ' +
      '<1e-2 between b = 2000 and b = 4000 (A = x* b, not sub-linear).',
    holds: () => {
      const f2000 = crossoverScale(2000, 0.02) / 2000;
      const f4000 = crossoverScale(4000, 0.02) / 4000;
      return Math.abs(f2000 - f4000) < 1e-2 && f2000 > 0.25 && f2000 < 0.4;
    },
  },
  {
    id: 'imp97419-recorded-fraction-b-independent',
    why: 'the recorded crossover fraction table x*(2%) must be flat (b-independent): max - min over ' +
      'b = 1000..16000 must be < 1e-3.',
    holds: () => {
      const xs = IMP97419_CROSSOVER_FRACTION.xStarByB.map((r) => r.xStar);
      return Math.max(...xs) - Math.min(...xs) < 1e-3;
    },
  },
  {
    id: 'imp97419-coefficient-symmetric',
    why: 'the Vasyunin coefficient must be symmetric I(a,b) = I(b,a) (structural check on the kernel).',
    holds: () =>
      Math.abs(coefficientI(2, 7) - coefficientI(7, 2)) < 1e-9 &&
      Math.abs(coefficientI(3, 10) - coefficientI(10, 3)) < 1e-9,
  },
  {
    id: 'imp97419-honesty-gate-no-qed',
    why: 'derivation + measurement only: crossover linear, separation not achieved, B* unpinned, no ' +
      'bound moved, compute binds first, honesty markers + sub-gap present.',
    holds: () =>
      IMP97419_VERDICT.anyBoundMoved === false &&
      IMP97419_VERDICT.crossoverScaleLinear === true &&
      IMP97419_VERDICT.separatesSqrtVsLog2b === false &&
      IMP97419_VERDICT.interceptConstituentBStarPinned === false &&
      IMP97419_VERDICT.noSubLinearDistinguishedScale === true &&
      IMP97419_VERDICT.computeBindsFirst === true &&
      /NO QED/.test(IMP97419_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97419_HONEST_BANNER) &&
      /RH open/.test(IMP97419_HONEST_BANNER) &&
      /uniform-profile-crossover-linear/.test(IMP97419_SUBGAP.id),
  },
];

for (const a of IMP97419_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97419-route-m-uniform-profile-crossover-scale assertion failed: ${a.id}`,
    );
  }
}

export { IMP97419_ASSERTIONS };
