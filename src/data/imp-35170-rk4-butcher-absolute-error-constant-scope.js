/**
 * @module imp-35170-rk4-butcher-absolute-error-constant-scope
 *
 * imp-35170 (proof, frontier-direction, SCOPING ONLY): imp-35127 named I4 -- an ABSOLUTE per-scheme
 * a-priori error bound for classic RK4 on the backward Dyson flow, derived from RK4s OWN order
 * conditions / Butcher error constant against the TRUE flow, NOT the scheme-vs-scheme difference
 * |t_c_RK4 - t_c_DP5| (imp-2466). The empirical two-method gap structurally CANNOT supply it: a
 * systematic error common to both the RK4 and the DP5 = RK5(4) tableaux cancels in the difference.
 * THIS module enumerates the concrete ingredients B1..B5 that the RK4 order-5 elementary-differential
 * error constant needs to become an ABSOLUTE per-scheme bound on the 1/(x_k - x_j) desingularized
 * pole form (imp-362), maps each to already-present artifacts vs OPEN pieces, and identifies the
 * binding input. Discharges NONE of the bound. SCOPING ONLY; NO QED.
 *
 * THE ABSOLUTE PER-SCHEME LOCAL-TRUNCATION-ERROR STRUCTURE (Butcher)
 * ----------------------------------------------------------------
 * For a p = 4 method the leading local truncation error over one step dt is a sum over the ROOTED
 * TREES tau of order p + 1 = 5 (there are exactly 9 such trees),
 *
 *     E_local(y)  =  dt^5  sum_{tau in T5}  ( 1 / sigma(tau) )  e(tau)  F(tau)(y)  +  O(dt^6),   (E)
 *
 * where sigma(tau) is the tree symmetry order, F(tau)(y) is the elementary differential (a product of
 * derivatives of the field f evaluated at y), and e(tau) = 1/gamma(tau) - sum_i b_i Phi_i(tau) is the
 * SCHEME-FIXED residual of the classic RK4 tableau on tree tau (zero for orders <= 4, nonzero at order
 * 5). An ABSOLUTE per-scheme bound follows from the triangle inequality on (E),
 *
 *     |E_local(y)|  <=  dt^5  ( sum_{tau in T5} ( |e(tau)| / sigma(tau) ) || F(tau)(y) || ).        (B)
 *
 * The two factors are structurally DIFFERENT in kind:
 *   - the residual weights e(tau)/sigma(tau) are a FINITE rational table fixed by the RK4 Butcher
 *     tableau alone -- no g_min, no N. This is precisely the PER-SCHEME object a scheme DIFFERENCE
 *     cannot isolate: |t_c_RK4 - t_c_DP5| carries e_RK4(tau) - e_DP5(tau), in which any common-mode
 *     part cancels, so the empirical gap never exposes e_RK4(tau) itself.
 *   - the elementary differentials || F(tau)(y) || are field magnitudes that, on the singular Dyson
 *     pole form, blow up as inverse powers of the minimum gap g_min -- exactly the imp-35127 I1
 *     derivative bounds, gated by the I2 non-collision lower bound.
 *
 * THE POLE-FIELD ELEMENTARY-DIFFERENTIAL POWER LAW (self-contained, exact)
 * -----------------------------------------------------------------------
 * For the scalar desingularization proxy f(y) = 1/(y - a) (the imp-362 1/(x_k - x_j) pole form on one
 * pair), |f^{(m)}(y)| = m! / g^{m+1} at gap g = |y - a|. The elementary differential of a tree tau is a
 * product over its vertices v of f^{(d(v))}, where d(v) is the number of children of v. Hence its
 * magnitude is (prod_v d(v)!) times g^{-sum_v (d(v) + 1)}. For a tree of order q the child-count sum is
 * the edge count q - 1, and the vertex count is q, so the inverse-gap exponent is
 *
 *     sum_v ( d(v) + 1 )  =  (q - 1) + q  =  2q - 1,   TOPOLOGY-INDEPENDENT.                       (P)
 *
 * For q = 5 EVERY one of the 9 order-5 elementary differentials scales as g^{-9}; only the rational
 * prefactor prod_v d(v)! differs per tree (largest = 24 for the bushy tree, root of degree 4). So the
 * field factor of (B) is bounded by K5 g^{-9} with K5 a finite tree-combinatorial constant, and it
 * blows up by 10^9 per decade of gap reduction -- three decades steeper than the g^{-6} of the top
 * single derivative alone (imp-35127 S2), because the FULL elementary differential multiplies up to
 * four derivative factors. Finite only through the I1 order-1..4 derivative bounds, themselves gated by
 * the I2 g_min lower bound.
 *
 * THE FIVE INGREDIENTS B1..B5 (present vs OPEN)
 * --------------------------------------------
 *   B1 SCHEME-FIXED RESIDUAL WEIGHTS e(tau)/sigma(tau).  The finite rational table of RK4 order-5
 *      residuals (equivalently, on the scalar linear test y' = lambda y where only the tall path tree
 *      survives, the principal error constant e^z - R_RK4(z) = z^5/120 + O(z^6), i.e. 1/120 = 1/5!).
 *      PRESENT and CLOSED -- a per-scheme constant with no g_min and no N; this is the object the
 *      empirical two-method gap structurally CANNOT supply.
 *   B2 ELEMENTARY-DIFFERENTIAL MAGNITUDES || F(tau)(y) || ON THE POLE FIELD.  Bounds on the 9 order-5
 *      products of field derivatives. On the pole proxy each is (prod d(v)!) g^{-(2q-1)} = O(g^{-9}) by
 *      (P). OPEN -- finite only through I1/I2; the g_min factor of (B).
 *   B3 I1 DERIVATIVE BOUNDS THROUGH ORDER p = 4 ON THE 1/(x_k - x_j) DESINGULARIZED FIELD.  The
 *      per-order sup |f^{(m)}|, m = 1..4, of the true N-body Dyson field (not the scalar proxy),
 *      carried on the imp-362 pole reduction. OPEN -- exactly the imp-35127 I1 bounds, gated by the I2
 *      minimum-gap lower bound (imp-35167). The BINDING input.
 *   B4 TREE ENUMERATION + SYMMETRY-FACTOR BOOKKEEPING.  The 9 order-5 rooted trees with their sigma(tau)
 *      and gamma(tau). PRESENT -- finite Butcher combinatorics, no g_min, no N.
 *   B5 N-UNIFORM ACCUMULATION OF THE PER-STEP ABSOLUTE LTE TO A GLOBAL ABSOLUTE ERROR.  The step-to-
 *      global conversion via an N-uniform Lipschitz/stability constant. OPEN but SEPARATE from the
 *      per-scheme LOCAL constant (B1..B4) -- it is the imp-35127 I3, COUPLED to G-gronwall (imp-2520).
 *
 * THE HONEST SCOPING CONCLUSION (I4 adds NO new obstruction beyond I1/I2)
 * ---------------------------------------------------------------------
 * The absolute per-scheme LOCAL error constant FACTORS as (B) = (scheme weights B1, CLOSED) times
 * (field magnitudes B2, gated by the I1 bounds B3, gated by I2). The distinctively per-scheme content
 * of I4 -- the part a scheme DIFFERENCE cancels away -- is B1, and B1 is available in closed form (the
 * finite RK4 residual table; principal constant 1/120). So closing I4 introduces NO new analytic
 * obstruction beyond the I1/I2 field-derivative bounds already scoped by imp-35127/imp-35167; what it
 * DOES require is actually MULTIPLYING the closed scheme constant by the g_min-gated elementary
 * differentials -- the step the empirical imp-2466 agreement never performs. BINDING input: B3 (the I1
 * derivative bounds, gated by I2). Global accumulation (B5) is the separate I3/G-gronwall obligation.
 *
 * THE NUMERICAL ILLUSTRATIONS (scoping evidence, NOT a bound)
 * ----------------------------------------------------------
 *   (S1) THE RK4 PRINCIPAL ERROR CONSTANT IS SCHEME-FIXED (B1, CLOSED).  A single RK4 step on the
 *        linear test y' = -y isolates the tall-path tree; the per-step error / dt^5 -> 1/120 = 1/5! as
 *        dt -> 0 (verified to < 1%), a constant with NO g_min and NO N. The DP5 = RK5(4) step on the
 *        SAME test has error ~ dt^6 (order 5), so its z^5 residual is 0 -- confirming e_RK4 and e_DP5
 *        are DIFFERENT per-scheme constants, hence the scalar linear case is NOT itself common-mode.
 *   (S2) THE ORDER-5 ELEMENTARY-DIFFERENTIAL POWER LAW g^{-9} (B2/B3, OPEN).  All 9 order-5 rooted
 *        trees have inverse-gap exponent 2q - 1 = 9 by (P) (verified tree-by-tree), so the field factor
 *        of (B) blows up by 10^9 per decade of gap reduction -- three decades steeper than the g^{-6}
 *        of the top single derivative (imp-35127 S2). Finite only through I1/I2.
 *
 * SCOPING ONLY. Enumerates the ingredients B1..B5 for an ABSOLUTE per-scheme RK4 Butcher error-constant
 * bound on the desingularized pole form and maps present (B1 closed scheme residual / 1/120; B4 tree
 * combinatorics) vs OPEN (B2/B3 pole-field elementary differentials gated by I1/I2; B5 global
 * accumulation = I3). CONCLUSION: I4 adds no new obstruction beyond I1/I2 -- its per-scheme part (B1)
 * is closed; the binding input is B3, the I1 derivative bounds gated by the I2 minimum-gap lower bound.
 * Derives NONE of the bound; the imp-2466 cross-check is UNTOUCHED and remains a valid non-certifying
 * cross-check; establishes no operator positivity; C_mb GUE-conditional per imp-486 UNTOUCHED; no RH
 * verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35127-g-step-error-certified-bound-scope (I4 named this the distinguishing ingredient; parent)
 * @see imp-35167-g-min-non-collision-certificate-scope (I2 minimum-gap lower bound; gates B3)
 * @see imp-2466-dyson-tc-interval-ladder (empirical two-method gap; the DIFFERENCE B1 cannot come from)
 * @see imp-2520 backward-flow-stability-gronwall (I3 / G-gronwall; the B5 accumulation constant)
 * @see imp-362 (interval RK4 witness, 1/(x_k - x_j) pole reduction; the desingularized field of B2/B3)
 */

// ---------------------------------------------------------------------------
// Self-contained RK4 and Dormand-Prince DP5 = RK5(4) single steps (scalar,
// autonomous f), reproducing the two tableaux whose empirical gap imp-2466
// reports. Used ONLY to exhibit the scheme-fixed principal error constant.
// ---------------------------------------------------------------------------
function rk4Step(f, y, dt) {
  const k1 = f(y);
  const k2 = f(y + (dt / 2) * k1);
  const k3 = f(y + (dt / 2) * k2);
  const k4 = f(y + dt * k3);
  return y + (dt / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
}
function dp5Step(f, y, dt) {
  const k1 = f(y);
  const k2 = f(y + dt * ((1 / 5) * k1));
  const k3 = f(y + dt * ((3 / 40) * k1 + (9 / 40) * k2));
  const k4 = f(y + dt * ((44 / 45) * k1 - (56 / 15) * k2 + (32 / 9) * k3));
  const k5 = f(
    y + dt * ((19372 / 6561) * k1 - (25360 / 2187) * k2 + (64448 / 6561) * k3 - (212 / 729) * k4),
  );
  const k6 = f(
    y +
      dt *
        ((9017 / 3168) * k1 -
          (355 / 33) * k2 +
          (46732 / 5247) * k3 +
          (49 / 176) * k4 -
          (5103 / 18656) * k5),
  );
  return (
    y +
    dt *
      ((35 / 384) * k1 +
        (500 / 1113) * k3 +
        (125 / 192) * k4 -
        (2187 / 6784) * k5 +
        (11 / 84) * k6)
  );
}

function factorial(m) {
  let r = 1;
  for (let i = 2; i <= m; i++) r *= i;
  return r;
}

// ---------------------------------------------------------------------------
// (S1) The RK4 principal error constant is scheme-fixed (B1, CLOSED). On the
// linear test y' = -y a single step isolates the tall-path tree; the per-step
// error / dt^5 -> 1/120 = 1/5!. DP5 on the SAME test is order 5 (error ~ dt^6),
// so its z^5 residual is 0: e_RK4 != e_DP5, the scalar case is NOT common-mode.
// ---------------------------------------------------------------------------
const S1_LAMBDA = -1;
const fLin = (y) => S1_LAMBDA * y;
const S1_DT = 0.04; // large enough that the DP5 dt/2 step stays above the roundoff floor

function oneStepError(step, dt) {
  const yExact = Math.exp(S1_LAMBDA * dt); // true solution of y' = -y at t = dt, y0 = 1
  return Math.abs(step(fLin, 1, dt) - yExact);
}
const S1_RK4_ERR = oneStepError(rk4Step, S1_DT);
const S1_RK4_PRINCIPAL = S1_RK4_ERR / Math.pow(S1_DT, 5); // -> 1/120 = 1/5!
const S1_RK4_CONST_TRUE = 1 / factorial(5); // 1/120
// Order check via the error ratio at dt and dt/2: RK4 -> (1/2)^5, DP5 -> (1/2)^6.
const S1_RK4_RATIO = oneStepError(rk4Step, S1_DT / 2) / oneStepError(rk4Step, S1_DT);
const S1_DP5_RATIO = oneStepError(dp5Step, S1_DT / 2) / oneStepError(dp5Step, S1_DT);
const S1_RK4_ORDER_RATIO = Math.pow(0.5, 5); // 1/32
const S1_DP5_ORDER_RATIO = Math.pow(0.5, 6); // 1/64

// ---------------------------------------------------------------------------
// (S2) The order-5 elementary-differential power law g^{-9} (B2/B3, OPEN).
// A rooted tree is an array of child-subtrees. On the pole proxy f = 1/(y - a),
// |f^{(m)}| = m!/g^{m+1}, so the elementary differential magnitude is
// (prod_v d(v)!) * g^{-sum_v (d(v)+1)}; by (P) the exponent is 2*order - 1,
// TOPOLOGY-INDEPENDENT. Enumerate all 9 order-5 rooted trees and verify it.
// ---------------------------------------------------------------------------
function treeOrder(tree) {
  let n = 1;
  for (const c of tree) n += treeOrder(c);
  return n;
}
function poleInverseGapExponent(tree) {
  // sum over vertices of (childCount + 1)
  let p = tree.length + 1;
  for (const c of tree) p += poleInverseGapExponent(c);
  return p;
}
function poleTreePrefactor(tree) {
  // product over vertices of (childCount)!
  let pf = factorial(tree.length);
  for (const c of tree) pf *= poleTreePrefactor(c);
  return pf;
}

// Rooted-tree basis by order (children arrays). A = order 1 leaf, etc.
const A = [];
const B = [A]; // order 2
const C1 = [A, A]; // order 3
const C2 = [B]; // order 3
const D1 = [A, A, A]; // order 4
const D2 = [A, B]; // order 4
const D3 = [C1]; // order 4
const D4 = [C2]; // order 4
// The 9 order-5 rooted trees (root children multiset sums to order 4).
const T5 = [
  [A, A, A, A], // bushy: root degree 4  -> prefactor 24 (largest)
  [A, A, B], // 2+1+1
  [B, B], // 2+2
  [A, C1], // 3+1
  [A, C2], // 3+1
  [D1], // 4
  [D2], // 4
  [D3], // 4
  [D4], // 4
];
const S2_TREE_ROWS = T5.map((tau, i) => ({
  idx: i,
  order: treeOrder(tau),
  inverseGapExponent: poleInverseGapExponent(tau),
  prefactor: poleTreePrefactor(tau),
}));
const S2_ALL_ORDER5 = S2_TREE_ROWS.every((r) => r.order === 5);
const S2_ALL_EXPONENT9 = S2_TREE_ROWS.every((r) => r.inverseGapExponent === 9);
const S2_EXPONENT_LAW = 2 * 5 - 1; // (P): 2q - 1 = 9
const S2_MAX_PREFACTOR = Math.max(...S2_TREE_ROWS.map((r) => r.prefactor)); // 24 (bushy)
const S2_TREE_COUNT = T5.length; // 9
// Field factor of (B) blows up by g^{-9} per decade -> 10^9 for a 10x gap reduction.
const S2_PER_DECADE_BLOWUP = Math.pow(10, 9);
// Contrast: the top single 5th-derivative alone (imp-35127 S2) is only g^{-6} -> 10^6/decade.
const S2_TOP_DERIV_PER_DECADE = Math.pow(10, 6);

const INGREDIENTS = [
  {
    id: 'B1',
    name: 'scheme-fixed-residual-weights',
    statement:
      'The finite rational table of RK4 order-5 residuals e(tau)/sigma(tau) (on the linear test the ' +
      'tall-tree principal constant e^z - R_RK4(z) = z^5/120 + O(z^6), i.e. 1/120 = 1/5!). A per-scheme ' +
      'constant with no g_min and no N.',
    status: 'PRESENT / CLOSED -- the object the empirical two-method gap CANNOT supply',
  },
  {
    id: 'B2',
    name: 'pole-field-elementary-differential-magnitudes',
    statement:
      'Bounds on the 9 order-5 elementary differentials || F(tau)(y) ||. On the pole proxy each is ' +
      '(prod d(v)!) g^{-(2q-1)} = O(g^{-9}) by the exponent law (P); finite only through I1/I2.',
    status: 'OPEN -- the g_min factor of the absolute bound (I1/I2 gated)',
  },
  {
    id: 'B3',
    name: 'i1-derivative-bounds-through-order-4-on-pole-field',
    statement:
      'The per-order sup |f^{(m)}|, m = 1..4, of the TRUE N-body Dyson field carried on the imp-362 ' +
      '1/(x_k - x_j) pole reduction -- exactly the imp-35127 I1 bounds, gated by the I2 minimum-gap ' +
      'lower bound (imp-35167).',
    status: 'OPEN -- the BINDING input (I1 gated by I2)',
  },
  {
    id: 'B4',
    name: 'tree-enumeration-symmetry-bookkeeping',
    statement:
      'The 9 order-5 rooted trees with their symmetry orders sigma(tau) and densities gamma(tau). ' +
      'Finite Butcher combinatorics, no g_min, no N.',
    status: 'PRESENT -- finite tree combinatorics',
  },
  {
    id: 'B5',
    name: 'n-uniform-accumulation-per-step-to-global',
    statement:
      'The step-to-global conversion of the per-step absolute LTE via an N-uniform Lipschitz/stability ' +
      'constant -- the imp-35127 I3, COUPLED to G-gronwall (imp-2520). SEPARATE from the per-scheme ' +
      'LOCAL constant B1..B4.',
    status: 'OPEN -- SEPARATE (I3 / G-gronwall)',
  },
];

export const IMP35170_RK4_BUTCHER_ABSOLUTE_ERROR_CONSTANT_SCOPE = {
  id: 'imp-35170',
  proofSection: 'S-frontier',
  question:
    'Scope the imp-35127 I4 ingredient: what the RK4 order-5 elementary-differential (Butcher) error ' +
    'constant needs to yield an ABSOLUTE per-scheme a-priori bound on the 1/(x_k - x_j) desingularized ' +
    'pole form (imp-362), rather than the scheme-vs-scheme difference |t_c_RK4 - t_c_DP5| (imp-2466) ' +
    'which cancels any common-mode systematic error. Scoping only; enumerates ingredients B1..B5; ' +
    'discharges NONE; changes no bound; imp-2466 cross-check untouched; C_mb GUE-conditional per ' +
    'imp-486; NO QED.',
  whyGapCannotSupplyIt:
    'The absolute per-scheme LTE factors as (scheme residual weights e(tau)/sigma(tau)) times ' +
    '(elementary differentials || F(tau) ||). The residual weights are the per-scheme object a scheme ' +
    'DIFFERENCE cancels: |t_c_RK4 - t_c_DP5| carries e_RK4(tau) - e_DP5(tau), so any common-mode part ' +
    'is invisible; only the per-scheme e_RK4(tau) (B1) is a certificate ingredient.',
  poleFieldExponentLaw:
    'On the pole proxy f = 1/(y - a), |f^{(m)}| = m!/g^{m+1}, so the order-q elementary differential ' +
    'magnitude is (prod_v d(v)!) g^{-(2q-1)} -- inverse-gap exponent 2q - 1 = 9 at q = 5, ' +
    'TOPOLOGY-INDEPENDENT across all 9 order-5 trees; the field factor blows up 10^9 per decade of gap.',
  ingredients: INGREDIENTS,
  distinguishingIngredient: 'B1', // the closed per-scheme residual the empirical gap cannot isolate
  bindingInput: 'B3', // the I1 derivative bounds, gated by I2
  separateAccumulation: 'B5', // global accumulation = I3 / G-gronwall, not the per-scheme local constant
  conclusion:
    'I4 adds NO new analytic obstruction beyond I1/I2: its distinctively per-scheme part B1 is CLOSED ' +
    '(the finite RK4 residual table; principal constant 1/120), and the absolute local bound is B1 ' +
    'times the I1/I2-gated elementary differentials (B2/B3). Closing I4 = multiplying the closed scheme ' +
    'constant by the g_min-gated field magnitudes -- the step the empirical imp-2466 agreement never ' +
    'performs. Binding input B3; global accumulation B5 is the separate I3 obligation.',
  couplings: {
    B3_to_i1_i2: 'B3 is the imp-35127 I1 derivative bounds gated by the I2 minimum-gap lower bound (imp-35167).',
    B5_to_i3_g_gronwall: 'B5 is the imp-35127 I3 N-uniform accumulation, COUPLED to G-gronwall (imp-2520).',
  },
  s1_schemeFixedPrincipalConstant: {
    test: 'y_prime = -y, y0 = 1, single step; error / dt^5 -> 1/120 = 1/5! (RK4 tall-tree residual)',
    dt: S1_DT,
    rk4PrincipalMeasured: +S1_RK4_PRINCIPAL.toExponential(6), // -> 1/120
    rk4PrincipalTrue: +S1_RK4_CONST_TRUE.toExponential(6), // 1/120 exactly
    rk4OrderRatioMeasured: +S1_RK4_RATIO.toExponential(4), // -> (1/2)^5 = 1/32
    rk4OrderRatioTrue: +S1_RK4_ORDER_RATIO.toExponential(4),
    dp5OrderRatioMeasured: +S1_DP5_RATIO.toExponential(4), // -> (1/2)^6 = 1/64 (order 5, z^5 residual 0)
    dp5OrderRatioTrue: +S1_DP5_ORDER_RATIO.toExponential(4),
  },
  s2_elementaryDifferentialPowerLaw: {
    proxy: 'f(y) = 1/(y - a), |f^{(m)}| = m!/g^{m+1}; F(tau) magnitude = (prod d(v)!) g^{-(2q-1)}',
    treeCount: S2_TREE_COUNT, // 9 order-5 rooted trees
    exponentLaw: S2_EXPONENT_LAW, // 2q - 1 = 9
    allOrder5: S2_ALL_ORDER5,
    allExponent9: S2_ALL_EXPONENT9,
    maxPrefactor: S2_MAX_PREFACTOR, // 24 (bushy tree, root degree 4)
    perDecadeBlowup: +S2_PER_DECADE_BLOWUP.toExponential(3), // 1e9 (g^{-9})
    topSingleDerivPerDecade: +S2_TOP_DERIV_PER_DECADE.toExponential(3), // 1e6 (g^{-6}, imp-35127 S2)
    treeRows: S2_TREE_ROWS,
  },
  isRigorous: false,
  verdict:
    'SCOPING (frontier-direction, NOT rigorous). An ABSOLUTE per-scheme RK4 Butcher error-constant ' +
    'bound on the desingularized pole form reduces to FIVE ingredients via the leading-LTE identity ' +
    'E_local(y) = dt^5 sum_{tau in T5} (1/sigma(tau)) e(tau) F(tau)(y) + O(dt^6): B1 (the scheme-fixed ' +
    'residual weights e(tau)/sigma(tau) -- PRESENT and CLOSED, a per-scheme rational table with the ' +
    'linear-test principal constant 1/120 = 1/5!, and precisely the object the empirical two-method gap ' +
    'CANNOT supply because a scheme DIFFERENCE cancels any common-mode part), B2 (the 9 order-5 ' +
    'elementary-differential magnitudes || F(tau) || -- OPEN, each = (prod d(v)!) g^{-9} on the pole ' +
    'field), B3 (the I1 order-1..4 derivative bounds on the 1/(x_k - x_j) field -- OPEN, the BINDING ' +
    'input, gated by the I2 minimum-gap lower bound imp-35167), B4 (the 9-tree symmetry/density ' +
    'bookkeeping -- PRESENT, finite Butcher combinatorics), and B5 (the N-uniform accumulation to a ' +
    'global error -- OPEN but SEPARATE, the imp-35127 I3 coupled to G-gronwall). The illustrations ' +
    'confirm the crux: (S1) a single RK4 step on y_prime = -y isolates the tall tree and its per-step ' +
    'error / dt^5 -> 1/120, a scheme-fixed constant with no g_min and no N, while DP5 on the same test ' +
    'is order 5 (error ~ dt^6, z^5 residual 0) -- so e_RK4 and e_DP5 differ and the scalar linear case ' +
    'is not itself common-mode; (S2) all 9 order-5 elementary differentials share the ' +
    'TOPOLOGY-INDEPENDENT inverse-gap exponent 2q - 1 = 9, so the field factor blows up 10^9 per decade ' +
    'of gap reduction -- three decades steeper than the g^{-6} of the top single derivative (imp-35127 ' +
    'S2). CONCLUSION: I4 adds NO new analytic obstruction beyond I1/I2 -- its per-scheme part B1 is ' +
    'closed, and the absolute local bound is B1 times the I1/I2-gated elementary differentials; the ' +
    'binding input is B3 (I1 gated by I2), and global accumulation B5 is the separate I3 obligation. ' +
    'SCOPING ONLY: discharges NONE of B1..B5 (only B1/B4 are already present); changes no bound; ' +
    'establishes no operator positivity; the imp-2466 cross-check is UNTOUCHED and remains a valid ' +
    'non-certifying cross-check; C_mb GUE-conditional per imp-486 UNTOUCHED; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35127 (I4 named the distinguishing ingredient; parent, B1); imp-35167 (I2 minimum-gap lower ' +
    'bound, gates B3); imp-2466 (empirical two-method gap, the DIFFERENCE B1 cannot come from); ' +
    'imp-2520 (G-gronwall, B5 accumulation); imp-362 (pole reduction, the desingularized field of ' +
    'B2/B3); imp-486 (C_mb GUE-conditional).',
};

export const IMP35170_RK4_BUTCHER_ABSOLUTE_ERROR_CONSTANT_SCOPE_ASSERTIONS = [
  {
    // (S1) The RK4 linear-test principal error constant is the scheme-fixed 1/120 = 1/5! (B1 closed).
    id: 'imp35170-rk4-principal-constant-is-one-over-120',
    description: 'RK4 single-step error / dt^5 -> 1/120 = 1/5! (a scheme-fixed per-scheme constant, no g_min, no N)',
    holds: () => Math.abs(S1_RK4_PRINCIPAL / S1_RK4_CONST_TRUE - 1) < 1e-2,
  },
  {
    // (S1) RK4 is order 4 (error ratio -> 1/32) while DP5 is order 5 (-> 1/64): e_RK4 != e_DP5.
    id: 'imp35170-rk4-order4-dp5-order5-distinct',
    description: 'RK4 error ratio ~ (1/2)^5 and DP5 ~ (1/2)^6 -> distinct per-scheme constants (scalar case not common-mode)',
    holds: () =>
      Math.abs(S1_RK4_RATIO / S1_RK4_ORDER_RATIO - 1) < 0.1 &&
      Math.abs(S1_DP5_RATIO / S1_DP5_ORDER_RATIO - 1) < 0.15,
  },
  {
    // (S2) There are exactly 9 order-5 rooted trees and every one has order 5.
    id: 'imp35170-nine-order5-trees',
    description: 'exactly 9 rooted trees enumerated, all of order 5 (the RK4 p+1=5 LTE tree set)',
    holds: () => S2_TREE_COUNT === 9 && S2_ALL_ORDER5 === true,
  },
  {
    // (S2) Every order-5 elementary differential on the pole field has inverse-gap exponent 2q-1=9.
    id: 'imp35170-pole-exponent-law-9',
    description: 'all 9 order-5 elementary differentials share the topology-independent inverse-gap exponent 2q-1=9',
    holds: () => S2_ALL_EXPONENT9 === true && S2_EXPONENT_LAW === 9,
  },
  {
    // (S2) The field factor blows up 10^9 per decade -- three decades steeper than the g^{-6} top derivative.
    id: 'imp35170-field-factor-blowup-1e9-per-decade',
    description: 'the g^{-9} field factor blows up 1e9 per decade (1000x steeper than the g^{-6} top single derivative)',
    holds: () =>
      Math.abs(S2_PER_DECADE_BLOWUP / 1e9 - 1) < 1e-9 &&
      Math.abs(S2_PER_DECADE_BLOWUP / S2_TOP_DERIV_PER_DECADE - 1e3) < 1e-6,
  },
  {
    // B-mapping: B1/B4 present, B3 open and binding, B1 distinguishing; conclusion "no new obstruction".
    id: 'imp35170-b-mapping-b1-distinguishing-b3-binding',
    description: 'B1 present/distinguishing, B3 OPEN/binding, conclusion: I4 adds no new obstruction beyond I1/I2',
    holds: () =>
      IMP35170_RK4_BUTCHER_ABSOLUTE_ERROR_CONSTANT_SCOPE.distinguishingIngredient === 'B1' &&
      IMP35170_RK4_BUTCHER_ABSOLUTE_ERROR_CONSTANT_SCOPE.bindingInput === 'B3' &&
      /PRESENT/.test(INGREDIENTS.find((r) => r.id === 'B1').status) &&
      /OPEN/.test(INGREDIENTS.find((r) => r.id === 'B3').status) &&
      /no new/i.test(IMP35170_RK4_BUTCHER_ABSOLUTE_ERROR_CONSTANT_SCOPE.conclusion),
  },
  {
    // Honesty gate: scoping only, no QED, imp-2466 untouched, no refereed bound is changed.
    id: 'imp35170-honesty-gate-no-qed',
    description: 'Scoping only: isRigorous false, NO QED, imp-2466 cross-check untouched, no refereed bound is changed',
    holds: () =>
      IMP35170_RK4_BUTCHER_ABSOLUTE_ERROR_CONSTANT_SCOPE.isRigorous === false &&
      /NO QED/.test(IMP35170_RK4_BUTCHER_ABSOLUTE_ERROR_CONSTANT_SCOPE.verdict) &&
      /imp-2466 cross-check is UNTOUCHED/.test(IMP35170_RK4_BUTCHER_ABSOLUTE_ERROR_CONSTANT_SCOPE.verdict) &&
      /refereed bound is changed/i.test(IMP35170_RK4_BUTCHER_ABSOLUTE_ERROR_CONSTANT_SCOPE.verdict),
  },
];

for (const a of IMP35170_RK4_BUTCHER_ABSOLUTE_ERROR_CONSTANT_SCOPE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35170-rk4-butcher-absolute-error-constant-scope assertion failed: ${a.id}`);
  }
}
