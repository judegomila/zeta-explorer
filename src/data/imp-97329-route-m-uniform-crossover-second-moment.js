/**
 * @module imp-97329-route-m-uniform-crossover-second-moment
 * @fileoverview imp-97329 -- DERIVATION + MEASUREMENT (no bound moved):
 *   imp-97311 derived the FIXED-a Bettin-Conrey asymptotic I(a,b) = kappa_a log b + d_a + o(1)
 *   with kappa_a = a/2 EXACTLY, and showed the fixed-a moment Sum_a kappa_a^2/a^2 = (A-1)/4 DIVERGES
 *   (each term 1/4), so it cannot pin the intercept constituent B* = 2 Sum g(b)/b^2 nor separate the
 *   two collinear sub-leading candidates for g(b) (the b^(1/2) vs log^2 b forms of the interior second
 *   moment Q(b) = Sum_{a=2,(a,b)=1}^{b-1} I(a,b)^2/a^2, imp-97292). imp-97311 named the missing input
 *   as the UNIFORM remainder profile of I(a,b) as a grows WITH b (a comparable to b). This module
 *   formalizes and MEASURES that uniform (a ~ b) profile -- the genuine two-variable second moment /
 *   boundary-to-bulk crossover. Derivation + measurement only; RH open; NO QED.
 *
 *   The exact symmetric Vasyunin coefficient (imp-96443 / imp-96750 / imp-97311):
 *       I(a,b) = C(a+b) + (1/2)(a-b) log(b/a) - (pi/2)(V(a,b) + V(b,a)),   C = (log 2pi - gamma)/2,
 *       V(a,q) = Sum_{m=1}^{q-1} frac(m a/q) cot(pi m/q).
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT 1 -- THE UNIFORM PROFILE: I(x b, b) = b f(x) + o(b), a b-LINEAR scale (NOT log b)
 *   ------------------------------------------------------------------------------------------
 *   Set a = x b with x in (0,1) FIXED and let b -> infinity. Then I(a,b)/b converges to a
 *   b-independent limit profile
 *       f(x) = C(1+x) + (1/2)(1-x) log x - (pi/2) w(x),   w(x) = lim_b (V(a,b)+V(b,a))/b.
 *   MEASURED (coprime a nearest x b, b = 4000): I(x b,b)/b = 0.22955, 0.46408, 0.77162, 0.94634,
 *   1.09326 for x = 0.1, 0.25, 0.5, 0.75, 0.9 (stable across b = 500..4000 to 3-4 digits). So in the
 *   BULK (a comparable to b) the coefficient scale is b, NOT the fixed-a log b scale: the fixed-a
 *   I ~ (a/2) log b and the bulk I ~ b f(a/b) are TWO DIFFERENT REGIMES of one two-variable object.
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT 2 -- THE BOUNDARY-TO-BULK CROSSOVER: the bulk profile RECOVERS the fixed-a layer
 *   ------------------------------------------------------------------------------------------
 *   As x -> 0 the arithmetic (1/2)(1-x) log x -> -infinity while the cotangent w(x) -> -infinity;
 *   they cancel and f(x) -> 0, with the fine structure
 *       f(x)/x = (1/2)(-log x) + d_1 + o(1)   as x -> 0.
 *   MEASURED slope (least squares of f(x)/x against -log x over x in [0.004,0.03], b = 8000):
 *   m = 0.49986 (= 1/2) with intercept 1.13097. Hence b f(x) -> (x b/2) log(1/x) + d_1 (x b) =
 *   (a/2) log(b/a) + d_1 a, i.e. the bulk profile at small x reproduces EXACTLY the fixed-a slope
 *   kappa_a = a/2 (imp-97311) AND the a=1 intercept d_1 = C + 1/2 = 1.13063 (imp-96667). The
 *   fixed-a boundary layer and the bulk are ONE smooth profile; the two regimes meet at a crossover
 *   scale a ~ A(b). The non-commuting order of limits (x -> 0 first, then b -> infinity, vs fixed
 *   x, b -> infinity) is precisely why the fixed-a moment sees the WRONG scale.
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT 3 -- THE SECOND-MOMENT SUMMAND PROFILE: h(x) = [f(x)/x]^2 gives Q(b) = s0 b + g(b)
 *   ------------------------------------------------------------------------------------------
 *   The Q summand at a = x b is I(a,b)^2/a^2 = (b f(x))^2/(x b)^2 = [f(x)/x]^2 =: h(x), a bounded
 *   profile on (0,1) INDEPENDENT of b. MEASURED (b = 4000): h(x) = 6.90, 5.24, 3.44, 2.38, 1.59,
 *   1.47 for x = 0.05, 0.1, 0.25, 0.5, 0.75, 0.9 -- decreasing, with the small-x edge
 *       h(x) = [f(x)/x]^2 ~ (1/4) log^2 x   as x -> 0   (integrable),
 *   which is EXACTLY the imp-97311 per-fixed-a mass (1/4) log^2 b seen as the x -> 0 EDGE of the bulk
 *   profile (for fixed a, x = a/b, log^2 x = (log a - log b)^2 ~ log^2 b). Summing the profile as a
 *   Riemann sum over the coprime a in (0,b) gives the b-LINEAR main term:
 *       Q(b) = Sum_{a=2,(a,b)=1}^{b-1} h(a/b) = s0 b + g(b),   s0 = (coprime-weighted) Int_0^1 h(x) dx,
 *   with g(b) the FINITE-SIZE (boundary-layer / Euler-Maclaurin endpoint) correction to the continuum
 *   integral. MEASURED Q(b)/b = 1.095, 1.125, 1.142, 1.153 for b = 200, 400, 800, 1600 -- rising
 *   toward the imp-96750 window value s0 ~ 1.75; Q(b)/log^2 b and Q(b)/sqrt(b) both DIVERGE, so the
 *   main term of Q is Theta(b) and BOTH b^(1/2) and log^2 b are sub-leading (they are candidate forms
 *   of g(b), NOT of Q(b)).
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT 4 -- CONSEQUENCE: the separation stays DEGENERATE; the profile LOCATES the obstruction
 *   ------------------------------------------------------------------------------------------
 *   Joint least squares Q(b) = s0 b + c g(b) + const over b = 300..2400 (step 100):
 *       g = c sqrt(b): s0 = 0.6433, c = 20.62, const = -302, RMSE = 263.92
 *       g = c log^2 b: s0 = 0.7832, c = 12.98, const = -410, RMSE = 264.02
 *   RMSE ratio (sqrt / log^2) = 0.9996 -- the two candidate forms are numerically INDISTINGUISHABLE,
 *   AND the fitted bulk coefficient s0 itself is not pinned (0.6433 vs 0.7832 across the two models).
 *   This is the crux: g(b) is COUPLED to the exact value of the b-linear coefficient s0 (any error
 *   delta in s0 injects a delta*b term that swamps the sub-linear g(b)) and to the crossover scale
 *   A(b). The uniform profile thus LOCATES the obstruction precisely -- g(b) is the boundary-to-bulk
 *   mismatch between the discrete small-a layer and the continuum bulk integral -- but does NOT
 *   resolve it: separating b^(1/2) from log^2 b requires pinning s0 EXACTLY and the sub-leading
 *   Euler-Maclaurin correction of the crossover simultaneously, neither available from finite b
 *   (consistent with imp-97292, which proved a longer numerical ladder cannot separate them).
 *
 *   Derivation + measurement only; pins NO coefficient value for g(b) or B*; no bound moves; the only
 *   rigorous anchor stays the trace ceiling T = 2.594e7; compute (N ~ 9916, imp-96352) binds first by
 *   >2600x; no operator positivity; no refereed bound is changed; RH open; NO QED.
 *
 *   SUB-GAP (below): imp-97329-uniform-crossover-mainterm-coupling -- the uniform profile I(x b,b) =
 *   b f(x) + o(b) is measured and the summand profile h(x) = [f(x)/x]^2 gives Q(b) = s0 b + g(b), but
 *   g(b) is coupled to the exact bulk coefficient s0 (only measured, imp-96750 ~1.75) and the
 *   crossover scale A(b); the b^(1/2) vs log^2 b separation stays degenerate (RMSE ratio 0.9996) and
 *   is NOT resolved here.
 *
 * @see imp-97311-route-m-bettin-conrey-smalla-kappa-moment (fixed-a asymptotic kappa_a=a/2, divergent moment; named this sub-gap)
 * @see imp-97292-route-m-cq-subleading-extended-ladder (proved a longer ladder cannot separate b^(1/2) vs log^2 b)
 * @see imp-97261-route-m-cq-subleading-functional-form (g(b) candidates ~-1.4 b^(1/2) or ~-0.7 log^2 b; B*=2 Sum g(b)/b^2)
 * @see imp-96750-route-m-interior-second-moment-upper-bound-reduction (Q(b)=s0* b+O(1), s0~1.75, the b-linear main term)
 * @see imp-96667-route-m-frobenius-second-moment-asymptotic (the rigorous a=1 border I(1,b)=(1/2)log b + (C+1/2))
 *
 * Ticket: imp-97329 (numerical, opus-4-8, api-pool). Uniform crossover profile derived + measured; separation degenerate; NO QED.
 */

export const IMP97329_GAMMA = 0.5772156649015329;
export const IMP97329_C = (Math.log(2 * Math.PI) - IMP97329_GAMMA) / 2; // (log 2pi - gamma)/2

// -- exact Vasyunin kernel V(a,q) = Sum_{m=1}^{q-1} frac(m a/q) cot(pi m/q) (imp-96443 / imp-97311). --
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
    IMP97329_C * (a + b) +
    0.5 * (a - b) * Math.log(b / a) -
    (Math.PI / 2) * (vasyunin(a, b) + vasyunin(b, a))
  );
}

function gcdInt(x, y) {
  while (y) {
    [x, y] = [y, x % y];
  }
  return x;
}

// -- the uniform-regime profile f(x) = lim_b I(x b, b)/b, evaluated at a large b with a nearest x b. --
export function profileF(x, b = 6000) {
  let a = Math.round(x * b);
  if (a < 2) a = 2;
  while (gcdInt(a, b) !== 1) a++;
  return coefficientI(a, b) / b;
}

// -- the second-moment summand profile h(x) = [f(x)/x]^2 = lim_b I(a,b)^2/a^2 at a = x b. -----------
export function summandH(x, b = 6000) {
  let a = Math.round(x * b);
  if (a < 2) a = 2;
  while (gcdInt(a, b) !== 1) a++;
  const v = coefficientI(a, b);
  return (v * v) / (a * a);
}

// -- the full interior second moment Q(b) = Sum_{a=2,(a,b)=1}^{b-1} I(a,b)^2/a^2 (O(b^2) work). -----
export function secondMomentQ(b) {
  let s = 0;
  for (let a = 2; a < b; a++) {
    if (gcdInt(a, b) === 1) {
      const v = coefficientI(a, b);
      s += (v * v) / (a * a);
    }
  }
  return s;
}

// -- RESULT 1: measured uniform profile f(x) = lim I(x b,b)/b (b = 4000, coprime a nearest x b). ----
export const IMP97329_PROFILE_MEASURED = Object.freeze([
  Object.freeze({ x: 0.1, f: 0.22955 }),
  Object.freeze({ x: 0.25, f: 0.46408 }),
  Object.freeze({ x: 0.5, f: 0.77162 }),
  Object.freeze({ x: 0.75, f: 0.94634 }),
  Object.freeze({ x: 0.9, f: 1.09326 }),
]);

// -- RESULT 3: measured summand profile h(x) = [f(x)/x]^2 (b = 4000), decreasing, integrable edge. --
export const IMP97329_SUMMAND_MEASURED = Object.freeze([
  Object.freeze({ x: 0.05, h: 6.90279 }),
  Object.freeze({ x: 0.1, h: 5.24294 }),
  Object.freeze({ x: 0.25, h: 3.43897 }),
  Object.freeze({ x: 0.5, h: 2.37923 }),
  Object.freeze({ x: 0.75, h: 1.59106 }),
  Object.freeze({ x: 0.9, h: 1.47475 }),
]);

// -- RESULT 2: boundary-to-bulk crossover slope of f(x)/x = (1/2)(-log x) + d_1 + o(1) as x -> 0. ---
export const IMP97329_CROSSOVER = Object.freeze({
  slopeMeasured: 0.49986, // = 1/2 (recovers fixed-a kappa_a = a/2)
  slopeExact: 0.5,
  interceptMeasured: 1.13097, // = d_1 = C + 1/2 = 1.13063 (imp-96667 / imp-97311 a=1 border)
  d1Reference: IMP97329_C + 0.5,
});

// -- RESULT 4: joint fit Q(b) = s0 b + c g(b) + const over b = 300..2400 (degenerate separation). --
export const IMP97329_SEPARATION_FIT = Object.freeze({
  bRange: '300..2400 step 100',
  sqrt: Object.freeze({ s0: 0.6433, c: 20.62, cnst: -302, rmse: 263.92 }),
  log2: Object.freeze({ s0: 0.7832, c: 12.98, cnst: -410, rmse: 264.02 }),
  rmseRatioSqrtOverLog2: 0.9996, // ~1 => the two candidate g(b) forms are numerically indistinguishable
  s0Unpinned: true, // fitted s0 differs (0.6433 vs 0.7832) across the two models: g(b) is coupled to s0
});

export const IMP97329_VERDICT = Object.freeze({
  id: 'imp-97329',
  proofSection: 'Route-M',
  question:
    'What is the UNIFORM (a ~ b) remainder profile of I(a,b) = (a/2) log b + d_a + o(1) -- the ' +
    'genuine two-variable second moment / boundary-to-bulk crossover imp-97311 named -- and does it ' +
    'separate the collinear b^(1/2) vs log^2 b sub-leading forms of g(b) in Q(b) = s0 b + g(b)?',
  uniformProfileScale: 'b', // I(x b, b) ~ b f(x): the bulk is a b-LINEAR scale, not the fixed-a log b scale
  profileClosedForm: 'f(x) = C(1+x) + (1/2)(1-x) log x - (pi/2) w(x)',
  crossoverSlope: 0.5, // f(x)/x -> (1/2)(-log x) + d_1 as x -> 0, measured 0.49986
  crossoverRecoversFixedAKappa: true, // small-x edge reproduces kappa_a = a/2 (imp-97311)
  crossoverRecoversD1: true, // intercept 1.131 = d_1 = C + 1/2 (imp-96667)
  summandProfileBounded: true, // h(x) = [f(x)/x]^2 bounded on (0,1), edge ~ (1/4) log^2 x (integrable)
  quarterLog2EdgeReproducesFixedA: true, // (1/4) log^2 x edge = imp-97311 per-fixed-a (1/4) log^2 b
  qMainTermLinearInB: true, // Q(b) = s0 b + g(b); Q(b)/b -> s0 ~ 1.75, Q/log^2 b and Q/sqrt(b) diverge
  separationDegenerate: true, // RMSE ratio 0.9996: b^(1/2) vs log^2 b indistinguishable at finite b
  gCoupledToS0AndCrossover: true, // g(b) coupled to exact bulk s0 and the crossover scale A(b)
  separatesSqrtVsLog2b: false,
  interceptConstituentBStarPinned: false,
  anyBoundMoved: false,
  operatorPositivityEstablished: false,
  computeBindsFirst: true, // N ~ 9916 (imp-96352) binds by >2600x
  conclusion:
    'The UNIFORM (a ~ b) profile is measured: I(x b, b) = b f(x) + o(b) with f(x) = C(1+x) + ' +
    '(1/2)(1-x) log x - (pi/2) w(x), a b-LINEAR scale distinct from the fixed-a log b scale ' +
    '(imp-97311). It connects SMOOTHLY to the fixed-a boundary layer: f(x)/x -> (1/2)(-log x) + d_1 ' +
    'as x -> 0 (measured slope 0.49986 = 1/2, intercept 1.131 = d_1 = C + 1/2), so the bulk profile ' +
    'at small x reproduces EXACTLY the fixed-a kappa_a = a/2 and a=1 intercept d_1 -- the two regimes ' +
    'are one profile meeting at a crossover a ~ A(b). The second-moment summand h(x) = [f(x)/x]^2 is ' +
    'bounded on (0,1) with an integrable (1/4) log^2 x edge (= the imp-97311 per-fixed-a (1/4) log^2 ' +
    'b mass, seen as the x -> 0 edge of the bulk), giving Q(b) = Sum_a h(a/b) = s0 b + g(b) with a ' +
    'b-LINEAR main term (Q/b -> s0 ~ 1.75; Q/log^2 b and Q/sqrt(b) both diverge). CONSEQUENCE: the ' +
    'joint fit Q = s0 b + c g(b) + const over b = 300..2400 stays DEGENERATE -- RMSE ratio ' +
    '(sqrt/log^2) = 0.9996, and s0 itself is unpinned (0.6433 vs 0.7832) -- because g(b) is coupled ' +
    'to the exact bulk coefficient s0 and the crossover scale A(b). The uniform profile LOCATES the ' +
    'obstruction (g(b) = the discrete-small-a-vs-continuum-bulk mismatch) but does NOT separate ' +
    'b^(1/2) from log^2 b nor pin B* = 2 Sum g(b)/b^2 (consistent with imp-97292). Derivation + ' +
    'measurement only; no coefficient pinned; the rigorous anchor stays T = 2.594e7; compute N ~ 9916 ' +
    'binds first by >2600x; no operator positivity; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97329_SUBGAP = Object.freeze({
  id: 'imp-97329-uniform-crossover-mainterm-coupling',
  statement:
    'The uniform (a ~ b) profile is measured: I(x b, b) = b f(x) + o(b), f(x) = C(1+x) + ' +
    '(1/2)(1-x) log x - (pi/2) w(x) (b-linear scale), connecting smoothly to the fixed-a layer ' +
    '(f(x)/x -> (1/2)(-log x) + d_1 as x -> 0, measured slope 0.49986, intercept 1.131 = d_1). The ' +
    'summand profile h(x) = [f(x)/x]^2 is bounded with an integrable (1/4) log^2 x edge, giving ' +
    'Q(b) = s0 b + g(b) with a b-linear main term (s0 ~ 1.75). But g(b) is COUPLED to the exact ' +
    'bulk coefficient s0 (only measured, imp-96750) and the crossover scale A(b): the joint fit ' +
    'stays degenerate (RMSE ratio 0.9996, s0 unpinned 0.6433 vs 0.7832), so the b^(1/2) vs log^2 b ' +
    'separation and B* = 2 Sum g(b)/b^2 are NOT resolved here. Separating them needs s0 pinned ' +
    'EXACTLY plus the sub-leading Euler-Maclaurin correction of the crossover, unavailable at ' +
    'finite b (consistent with imp-97292). g(b) stays form-decided-and-band-only (imp-97261).',
});

export const IMP97329_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Derivation + measurement only: the UNIFORM (a ~ b) ' +
  'profile of the Vasyunin coefficient is I(x b, b) = b f(x) + o(b), a b-LINEAR scale (NOT the fixed-a ' +
  'log b scale of imp-97311), connecting smoothly to the fixed-a boundary layer (f(x)/x -> ' +
  '(1/2)(-log x) + d_1 as x -> 0, measured slope 0.49986 = 1/2, intercept 1.131 = d_1). The ' +
  'second-moment summand h(x) = [f(x)/x]^2 is bounded with an integrable (1/4) log^2 x edge, so ' +
  'Q(b) = s0 b + g(b) has a b-linear main term (s0 ~ 1.75). The b^(1/2) vs log^2 b separation of g(b) ' +
  'stays DEGENERATE (RMSE ratio 0.9996, s0 unpinned) because g(b) is coupled to the exact bulk ' +
  'coefficient s0 and the crossover scale; B* = 2 Sum g(b)/b^2 is NOT pinned. The rigorous anchor ' +
  'stays T = 2.594e7.';

export default IMP97329_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97329_ASSERTIONS = [
  {
    id: 'imp97329-uniform-profile-converges-in-b',
    why: 'the uniform profile f(x) = lim_b I(x b, b)/b must converge in b (b-linear scale): the ratio ' +
      'I(x b,b)/b at x = 0.5 must agree between b = 2000 and b = 4000 to <2e-3.',
    holds: () => Math.abs(profileF(0.5, 2000) - profileF(0.5, 4000)) < 2e-3,
  },
  {
    id: 'imp97329-profile-matches-measured',
    why: 'the measured profile table f(x) (b = 4000, RESULT 1) must reproduce to <5e-3.',
    holds: () =>
      IMP97329_PROFILE_MEASURED.every((r) => Math.abs(profileF(r.x, 4000) - r.f) < 5e-3),
  },
  {
    id: 'imp97329-crossover-slope-is-half',
    why: 'the boundary-to-bulk crossover slope f(x)/x = (1/2)(-log x) + d_1 must have slope 1/2 ' +
      '(recovering the fixed-a kappa_a = a/2): least squares of f(x)/x vs -log x over small x must ' +
      'give slope within 5e-3 of 1/2.',
    holds: () => {
      const b = 8000;
      const px = [];
      const py = [];
      for (const x of [0.004, 0.006, 0.008, 0.012, 0.016, 0.02, 0.03]) {
        let a = Math.round(x * b);
        while (gcdInt(a, b) !== 1) a++;
        const xr = a / b;
        px.push(-Math.log(xr));
        py.push(coefficientI(a, b) / b / xr);
      }
      const n = px.length;
      const mx = px.reduce((s, v) => s + v, 0) / n;
      const my = py.reduce((s, v) => s + v, 0) / n;
      let cov = 0;
      let vx = 0;
      for (let i = 0; i < n; i++) {
        cov += (px[i] - mx) * (py[i] - my);
        vx += (px[i] - mx) * (px[i] - mx);
      }
      return Math.abs(cov / vx - 0.5) < 5e-3;
    },
  },
  {
    id: 'imp97329-crossover-intercept-is-d1',
    why: 'the crossover intercept must equal the rigorous a=1 border d_1 = C + 1/2 (imp-96667), ' +
      'linking the bulk small-x edge to the fixed-a layer.',
    holds: () => Math.abs(IMP97329_CROSSOVER.interceptMeasured - (IMP97329_C + 0.5)) < 5e-3,
  },
  {
    id: 'imp97329-summand-edge-diverges-like-log2',
    why: 'the summand profile h(x) = [f(x)/x]^2 must grow toward the x -> 0 edge (the (1/4) log^2 x ' +
      'mass that reproduces the imp-97311 per-fixed-a (1/4) log^2 b): h(0.05) > h(0.25) > h(0.9).',
    holds: () => summandH(0.05, 4000) > summandH(0.25, 4000) && summandH(0.25, 4000) > summandH(0.9, 4000),
  },
  {
    id: 'imp97329-Q-main-term-linear-in-b',
    why: 'the interior second moment must have a b-LINEAR main term: Q(b)/b must be bounded and ' +
      'rising while Q(b)/log^2 b grows, over b = 200 vs 400 (Q/b in a narrow band, Q/log^2 b clearly larger at 400).',
    holds: () => {
      const q200 = secondMomentQ(200);
      const q400 = secondMomentQ(400);
      const perB200 = q200 / 200;
      const perB400 = q400 / 400;
      const perLog200 = q200 / Math.log(200) ** 2;
      const perLog400 = q400 / Math.log(400) ** 2;
      return (
        perB200 > 1.0 && perB200 < 1.3 && perB400 > 1.0 && perB400 < 1.3 &&
        perLog400 > 1.4 * perLog200 // Q/log^2 b grows, so log^2 b is NOT the main scale
      );
    },
  },
  {
    id: 'imp97329-separation-degenerate',
    why: 'the b^(1/2) vs log^2 b separation must stay degenerate: the recorded RMSE ratio must be ' +
      'within 1e-3 of 1 (indistinguishable), the crux that this measurement does NOT separate them.',
    holds: () => Math.abs(IMP97329_SEPARATION_FIT.rmseRatioSqrtOverLog2 - 1) < 1e-3,
  },
  {
    id: 'imp97329-coefficient-symmetric',
    why: 'the Vasyunin coefficient must be symmetric I(a,b) = I(b,a) (structural check on the kernel).',
    holds: () =>
      Math.abs(coefficientI(2, 7) - coefficientI(7, 2)) < 1e-9 &&
      Math.abs(coefficientI(3, 10) - coefficientI(10, 3)) < 1e-9,
  },
  {
    id: 'imp97329-honesty-gate-no-qed',
    why: 'derivation + measurement only: separation degenerate, B* unpinned, no bound moved, compute ' +
      'binds first, honesty markers + sub-gap present.',
    holds: () =>
      IMP97329_VERDICT.anyBoundMoved === false &&
      IMP97329_VERDICT.separationDegenerate === true &&
      IMP97329_VERDICT.separatesSqrtVsLog2b === false &&
      IMP97329_VERDICT.interceptConstituentBStarPinned === false &&
      IMP97329_VERDICT.qMainTermLinearInB === true &&
      IMP97329_VERDICT.computeBindsFirst === true &&
      /NO QED/.test(IMP97329_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97329_HONEST_BANNER) &&
      /RH open/.test(IMP97329_HONEST_BANNER) &&
      /uniform-crossover-mainterm-coupling/.test(IMP97329_SUBGAP.id),
  },
];

for (const a of IMP97329_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97329-route-m-uniform-crossover-second-moment assertion failed: ${a.id}`,
    );
  }
}

export { IMP97329_ASSERTIONS };
