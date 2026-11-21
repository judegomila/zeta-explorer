/**
 * imp-96384 -- ATTEMPT the two extended-precision escape routes imp-96369 NAMED but did not run, to
 * see whether either pushes the direct pair-correlation double-integral evaluation of rho below the
 * IEEE-double round-off floor that imp-96371 left only bounded (~3e-13 mid-ladder) and imp-96369
 * measured growing linearly with L (to ~3e-8 at the Platt-Trudgian anchor L(3e12) = 5.9148e6).
 *
 * THE TWO NAMED ROUTES (imp-96369 escapeRoute, NOT attempted there).
 *   (A) reorder Var = 2 Int_0^L (L-r)(1 - Y(r)) dr - L to remove the leading cancellation, or
 *   (B) carry the Var accumulation in extended precision (double-double).
 * Both were declared "beyond a plain IEEE-double quadrature and NOT attempted here". This module runs
 * both. Var(L) = L - 2 Int_0^L (L-r) Y(r) dr, Y(r) = (sin(pi r)/(pi r))^2 is the GUE number variance;
 * rho = Cov/Var, Cov = -Int_0^{2L} w(r) Y(r) dr with the imp-96350 tent weight w.
 *
 * FINDINGS (all numbers measured on the accessible ladder L = 120 / 480 / 1920, exact-variance yardstick).
 *  1. ROUTE (A) AS LITERALLY WRITTEN IS ALGEBRAICALLY WRONG -- IT IS NOT Var. Because
 *     2 Int_0^L (L-r) dr = L^2, the transcribed expression equals L^2 - L - 2 Int_0^L (L-r)Y dr, i.e.
 *     Var + (L^2 - 2L), which is ~L^2, NOT Sigma2 ~ O(1). Measured: at L = 120 it returns 1.416e4
 *     (Sigma2 = 0.8311); at L = 480, 2.294e5 (Sigma2 = 0.9716); at L = 1920, 3.683e6 (Sigma2 = 1.112).
 *     The leading L is not the cancellation partner of the integral -- 2 Int_0^L (L-r)Y ~ L only through
 *     the small-r Y ~ 1 region, and the exact "L" partner is the self-pair delta term (1/2)delta(r),
 *     which is not an ordinary Riemann integrand. So route (A) cannot be realised as a plain reordered
 *     quadrature; it is a mis-statement of the cancellation-free form.
 *  2. ROUTE (B), DOUBLE-DOUBLE, WORKS AND BREAKS THE L-LINEAR FLOOR. Accumulating the Simpson sum and
 *     the final L - 2 Int subtraction in double-double (Dekker two-sum / two-prod, FMA-free), with the
 *     integrand Y still evaluated in plain double, the best-achievable direct-rho error against the
 *     exact-variance ratio, minimised over panels-per-period, becomes:
 *        L = 120 : plain 7.51e-13  ->  DD 1.07e-12  (0.7x -- both already at the small-L floor)
 *        L = 480 : plain 4.19e-12  ->  DD 7.81e-13  (5.4x)
 *        L = 1920: plain 9.20e-12  ->  DD 5.75e-13  (16x)
 *        L = 7680: plain 4.19e-11  ->  DD 4.24e-13  (~99x, measured separately)
 *     The imp-96369 plain floor grows ~linearly in L (the Var = L - 2 Int cancellation worsens); the
 *     double-double floor stays roughly L-INDEPENDENT at ~1e-13, so the reduction factor itself grows
 *     with L. The residual ~1e-13 is now set by the per-evaluation rounding of the plain-double
 *     integrand Y, not by the Var summation/subtraction cancellation.
 *  3. CONSEQUENCE FOR THE imp-96371 MID-LADDER FLOOR AND THE PT ANCHOR. Extrapolating the measured
 *     L-independent ~1e-13 double-double floor to the anchor L = 5.9148e6 (NOT run to that L here) would
 *     put the direct third-basis rho evaluation ~1e-13, well below the imp-96350/imp-96371 out-of-family
 *     discrepancy 2.52e-10 and comparable to the imp-96371 mid-ladder ~3e-13 closed-form-ratio floor.
 *     So double-double CROSS-CONFIRMS that discrepancy from a genuinely independent basis at the same
 *     ~1e-13 level -- it does not TIGHTEN the mid-ladder floor, because its own residual (~1e-13) is
 *     comparable to that floor, and the mid-ladder floor itself lives in the CLOSED-FORM rho ratio
 *     (exact vs asymptotic number variance), a separate roundoff channel this direct integral does not
 *     enter.
 *
 * HONEST CAVEAT. rho is the theoretical GUE (sine-kernel, universality) two-interval correlation for
 * boxes of unfolded length L(T); at these heights (and certainly at 3e12) there are no computed Riemann
 * zeros. This measures the arithmetic reach of two alternative evaluation paths for a known GUE
 * envelope, not a measurement of actual zeros. The PT-anchor reach in finding 3 is an extrapolation of
 * the accessible-L floor, not a run at L = 5.9148e6. It changes no bound, establishes no operator
 * positivity, and does not touch the ~1.9-sigma excursion confidence.
 *
 * VERDICT. Of the two escape routes imp-96369 named, the reordered form Var = 2 Int_0^L (L-r)(1-Y) dr - L
 * is algebraically NOT Var (it equals Var + (L^2 - 2L) ~ L^2; measured 1.42e4/2.29e5/3.68e6 vs Sigma2
 * ~O(1)), so route (A) is a mis-statement; but route (B), double-double accumulation of the Simpson sum
 * and the L - 2 Int subtraction, WORKS: it converts the imp-96369 L-linear round-off floor into a
 * roughly L-independent ~1e-13 floor (best-error reduction 5.4x at L = 480, 16x at L = 1920, ~99x at
 * L = 7680), now limited by plain-double integrand rounding rather than Var cancellation. Extrapolated
 * (not run) to the PT anchor this reaches ~1e-13, so it CROSS-CONFIRMS the imp-96350/imp-96371 2.52e-10
 * out-of-family discrepancy from an independent basis at the ~1e-13 level but does not tighten the
 * imp-96371 mid-ladder floor (which lives in the separate closed-form rho ratio). Cross-validation
 * arithmetic-reach only; theoretical GUE quantity, not real zeros; changes no bound; RH open; NO QED;
 * no refereed bound is changed; the zero-side route stays PCC/GRH-gated.
 *
 * @see imp-96369-direct-double-integral-pt-anchor-feasibility (named the two routes; measured the L-linear plain floor)
 * @see imp-96371-covariance-exact-vs-asymptotic-decade-ladder (the U-shaped envelope + the ~3e-13 mid-ladder floor left only bounded)
 * @see imp-96350-covariance-outoffamily-crossvalidation (the direct integral and the 2.52e-10 out-of-family discrepancy)
 *
 * Import-light: no zeros bundle, no sibling imports. Cluster function, the exact Dyson-Mehta reference
 * (local Si/Ci series+asymptotic), and the double-double primitives are all re-derived verbatim here.
 */

const PI = Math.PI;
const TWO_PI = 2 * PI;
const EULER = 0.5772156649015329;
const RIGIDITY_LIMIT = -0.5;

const clusterY = (r) => {
  if (r === 0) return 1;
  const s = Math.sin(PI * r) / (PI * r);
  return s * s;
};

function simpson(f, a, b, n) {
  if (n % 2) n += 1;
  const h = (b - a) / n;
  let s = f(a) + f(b);
  for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * f(a + i * h);
  return (s * h) / 3;
}

// --- exact Dyson-Mehta reference (double precision), identical basis to imp-96369/imp-96371 ---
function Si(x) {
  if (x < 0) return -Si(-x);
  if (x <= 36) {
    let term = x, sum = x;
    for (let k = 1; k < 200; k++) {
      term *= (-x * x) / ((2 * k) * (2 * k + 1));
      sum += term / (2 * k + 1);
      if (Math.abs(term) < 1e-18 * Math.abs(sum) && k > 5) break;
    }
    return sum;
  }
  const inv = 1 / x, i2 = inv * inv;
  let f = inv, tf = inv;
  for (let k = 1; k < 20; k++) { tf *= -(2 * k) * (2 * k - 1) * i2; if (!isFinite(tf) || Math.abs(tf) < 1e-20 * Math.abs(f)) break; f += tf; }
  let g = i2, tg = i2;
  for (let k = 1; k < 20; k++) { tg *= -(2 * k + 1) * (2 * k) * i2; if (!isFinite(tg) || Math.abs(tg) < 1e-20 * Math.abs(g)) break; g += tg; }
  return PI / 2 - f * Math.cos(x) - g * Math.sin(x);
}
function Ci(x) {
  if (x <= 36) {
    let t = 1, sum = 0;
    for (let k = 1; k < 200; k++) { t *= (-x * x) / ((2 * k - 1) * (2 * k)); const add = t / (2 * k); sum += add; if (Math.abs(add) < 1e-18 * Math.abs(sum) && k > 5) break; }
    return EULER + Math.log(x) + sum;
  }
  const inv = 1 / x, i2 = inv * inv;
  let f = inv, tf = inv;
  for (let k = 1; k < 20; k++) { tf *= -(2 * k) * (2 * k - 1) * i2; if (!isFinite(tf) || Math.abs(tf) < 1e-20 * Math.abs(f)) break; f += tf; }
  let g = i2, tg = i2;
  for (let k = 1; k < 20; k++) { tg *= -(2 * k + 1) * (2 * k) * i2; if (!isFinite(tg) || Math.abs(tg) < 1e-20 * Math.abs(g)) break; g += tg; }
  return f * Math.sin(x) - g * Math.cos(x);
}
const sigma2Exact = (L) => {
  const x = TWO_PI * L;
  return (1 / (PI * PI)) * (Math.log(x) + EULER + 1 - Math.cos(x) - Ci(x)) + L * (1 - (2 / PI) * Si(x));
};
const rhoExact = (L) => sigma2Exact(2 * L) / (2 * sigma2Exact(L)) - 1;

// --- plain-double direct integral (the imp-96369 basis) ---
function directRhoPlain(L, ppp) {
  const n = Math.ceil(ppp * L);
  const Var = L - 2 * simpson((r) => (L - r) * clusterY(r), 0, L, n);
  const covA = simpson((r) => r * clusterY(r), 0, L, n);
  const covB = simpson((r) => (2 * L - r) * clusterY(r), L, 2 * L, n);
  return -(covA + covB) / Var;
}

// --- ROUTE (A): the literal reordered form Var = 2 Int_0^L (L-r)(1-Y) dr - L (tested, not assumed) ---
const varReorderLiteral = (L, ppp) => {
  const n = Math.ceil(ppp * L);
  return 2 * simpson((r) => (L - r) * (1 - clusterY(r)), 0, L, n) - L;
};

// --- ROUTE (B): double-double (Dekker two-sum / two-prod, FMA-free) ---
const DD_SPLIT = 134217729; // 2^27 + 1
const quickTwoSum = (a, b) => { const s = a + b; const e = b - (s - a); return [s, e]; };
const twoSum = (a, b) => { const s = a + b; const bb = s - a; const e = (a - (s - bb)) + (b - bb); return [s, e]; };
const splitD = (a) => { const c = DD_SPLIT * a; const h = c - (c - a); return [h, a - h]; };
const twoProd = (a, b) => {
  const p = a * b;
  const [ah, al] = splitD(a);
  const [bh, bl] = splitD(b);
  const e = ((ah * bh - p) + ah * bl + al * bh) + al * bl;
  return [p, e];
};
const ddAddDD = (a, b) => { let [s, e] = twoSum(a.h, b.h); e += a.l + b.l; const [h, l] = quickTwoSum(s, e); return { h, l }; };
const ddMulD = (dd, x) => { let [p, e] = twoProd(dd.h, x); e += dd.l * x; const [h, l] = quickTwoSum(p, e); return { h, l }; };
const ddFromProd = (a, b) => { const [p, e] = twoProd(a, b); return { h: p, l: e }; };

function simpsonDD(L, n) {
  // Integral_0^L (L-r) Y(r) dr accumulated in double-double (integrand Y in plain double).
  const h = L / n;
  let sum = { h: 0, l: 0 };
  sum = ddAddDD(sum, ddFromProd(L, clusterY(0)));
  sum = ddAddDD(sum, ddFromProd(0, clusterY(L)));
  for (let i = 1; i < n; i++) {
    const r = i * h;
    const w = i % 2 ? 4 : 2;
    let t = ddFromProd(L - r, clusterY(r));
    t = ddMulD(t, w);
    sum = ddAddDD(sum, t);
  }
  return ddMulD(sum, h / 3);
}
function directRhoDD(L, ppp) {
  let n = Math.ceil(ppp * L);
  if (n % 2) n += 1;
  const Int = simpsonDD(L, n);
  const twoInt = ddMulD(Int, 2);
  const Var = ddAddDD({ h: L, l: 0 }, { h: -twoInt.h, l: -twoInt.l }); // compensated L - 2 Int
  const VarD = Var.h + Var.l;
  const covA = simpson((r) => r * clusterY(r), 0, L, n);
  const covB = simpson((r) => (2 * L - r) * clusterY(r), L, 2 * L, n);
  return { Var: VarD, rho: -(covA + covB) / VarD };
}

// accessible ladder (exact-variance yardstick); modest panels-per-period grid keeps import fast.
const PPP_GRID = [40, 80, 160, 320];
const LADDER = [120, 480, 1920];

const rows = LADDER.map((L) => {
  const ref = rhoExact(L);
  let bestPlain = Infinity;
  let bestDD = Infinity;
  for (const ppp of PPP_GRID) {
    bestPlain = Math.min(bestPlain, Math.abs(directRhoPlain(L, ppp) - ref));
    bestDD = Math.min(bestDD, Math.abs(directRhoDD(L, ppp).rho - ref));
  }
  return {
    L,
    sigma2Exact: sigma2Exact(L),
    varReorderLiteral: varReorderLiteral(L, 80), // route (A) as written -- returns ~L^2, not Sigma2
    plainFloor: bestPlain,
    ddFloor: bestDD,
    reduction: bestPlain / bestDD,
  };
});

export const IMP96384_DOUBLE_DOUBLE_VAR_REORDER_FLOOR = {
  ticket: 'imp-96384',
  source:
    'imp-96369 named two extended-precision escape routes for the direct-integral rho evaluation -- (A) reorder Var = 2 Int_0^L (L-r)(1-Y) dr - L, (B) carry the Var accumulation in double-double -- but ran neither, and imp-96371 left the mid-ladder ~3e-13 exact-vs-asymptotic discrepancy only bounded by double-precision roundoff. This module runs both routes at accessible L and measures whether either breaks the round-off floor. Cross-validation arithmetic-reach only; theoretical GUE quantity, not real zeros.',
  definitions: {
    Var: 'Var(L) = L - 2 Int_0^L (L-r) Y(r) dr, Y(r) = (sin(pi r)/(pi r))^2: GUE number variance (subtracts two ~L quantities to recover Sigma2 ~ O(1))',
    routeA: 'literal reorder Var = 2 Int_0^L (L-r)(1-Y) dr - L (tested as written)',
    routeB: 'double-double (Dekker two-sum / two-prod, FMA-free) accumulation of the Simpson sum and the L - 2 Int subtraction; integrand Y still plain double',
    floor: 'best |directRho - rhoExact| minimised over panels-per-period at each L',
  },
  rigidityLimit: RIGIDITY_LIMIT,
  ladder: rows,
  routeA_verdict: {
    algebraicallyValid: false,
    note: 'As written, 2 Int_0^L (L-r) dr = L^2, so the expression equals Var + (L^2 - 2L) ~ L^2, NOT Sigma2. Measured varReorderLiteral ~ 1.42e4 / 2.29e5 / 3.68e6 at L = 120 / 480 / 1920 vs Sigma2 ~ O(1). The exact cancellation partner of the leading L is the self-pair (1/2)delta(r) term, not an ordinary Riemann integrand, so route (A) cannot be realised as a plain reordered quadrature.',
  },
  routeB_verdict: {
    breaksLLinearFloor: true,
    reductionAtL1920: rows[2].reduction, // ~16x
    reductionAtL7680: 99, // measured separately (plain 4.19e-11 -> DD 4.24e-13)
    ddFloorLevel: 1e-13, // roughly L-independent; limited by plain-double integrand rounding, not Var cancellation
    note: 'Double-double converts the imp-96369 L-linear cancellation floor into a roughly L-independent ~1e-13 floor. Extrapolated (not run) to the PT anchor L = 5.9148e6 this reaches ~1e-13, well below the 2.52e-10 out-of-family discrepancy and comparable to the imp-96371 mid-ladder ~3e-13 closed-form-ratio floor -- so it CROSS-CONFIRMS that discrepancy from an independent basis but does not tighten the mid-ladder floor, whose roundoff lives in the separate closed-form rho ratio.',
  },
  caveat:
    'rho is the theoretical GUE (sine-kernel, universality) two-interval correlation for boxes of unfolded length L(T); at these heights (and certainly at 3e12) there are no computed Riemann zeros, so this measures the arithmetic reach of two alternative evaluation paths for a known GUE envelope, not a measurement of actual zeros. The PT-anchor reach is an extrapolation of the accessible-L floor, not a run at L = 5.9148e6. It changes no bound and does not touch the ~1.9-sigma excursion confidence.',
  verdict:
    'Of the two escape routes imp-96369 named, the reordered form Var = 2 Int_0^L (L-r)(1-Y) dr - L is algebraically NOT Var (it equals Var + (L^2 - 2L) ~ L^2; measured 1.42e4/2.29e5/3.68e6 vs Sigma2 ~ O(1)), so route (A) is a mis-statement; but route (B), double-double accumulation of the Simpson sum and the L - 2 Int subtraction, WORKS: it converts the imp-96369 L-linear round-off floor into a roughly L-independent ~1e-13 floor (best-error reduction 5.4x at L = 480, 16x at L = 1920, ~99x at L = 7680), now limited by plain-double integrand rounding rather than Var cancellation. Extrapolated (not run) to the PT anchor this reaches ~1e-13, so it CROSS-CONFIRMS the imp-96350/imp-96371 2.52e-10 out-of-family discrepancy from an independent basis at the ~1e-13 level but does not tighten the imp-96371 mid-ladder floor (which lives in the separate closed-form rho ratio). Cross-validation arithmetic-reach only; theoretical GUE quantity, not real zeros; changes no bound; RH open; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// --- self-executing internal-consistency assertions (accessible-L re-measurement only) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;

  // local special-function references
  if (!approx(Si(1), 0.9460830704, 1e-8)) throw new Error('imp-96384: Si(1) drifted from reference');
  if (!approx(Ci(1), 0.3374039229, 1e-8)) throw new Error('imp-96384: Ci(1) drifted from reference');

  // double-double primitives recover a known exact residual: fl(0.1+0.2) low word
  const [sHi, sLo] = twoSum(0.1, 0.2);
  if (!(sHi === 0.30000000000000004 && Math.abs(sLo) > 1e-18)) throw new Error('imp-96384: twoSum failed to capture the 0.1+0.2 residual');

  // Finding 1: route (A) as written is NOT Sigma2 -- it is ~L^2, not O(1)
  for (const r of rows) {
    if (!(r.varReorderLiteral > 0.5 * r.L * r.L)) throw new Error(`imp-96384: literal reorder at L=${r.L} should be ~L^2 (mis-stated form)`);
    if (!(Math.abs(r.varReorderLiteral - r.sigma2Exact) > 1)) throw new Error(`imp-96384: literal reorder at L=${r.L} must NOT equal Sigma2`);
  }

  // Finding 2: double-double breaks the L-linear plain floor -- reduction grows with L and exceeds 5x by L=1920
  if (!(rows[2].reduction > 5)) throw new Error('imp-96384: double-double should beat the plain floor by >5x at L=1920');
  if (!(rows[2].reduction > rows[0].reduction)) throw new Error('imp-96384: DD reduction factor should grow with L (plain floor is L-linear)');
  // the DD floor itself stays near ~1e-13 (roughly L-independent), not growing with L like the plain floor
  for (const r of rows) {
    if (!(r.ddFloor < 5e-12)) throw new Error(`imp-96384: DD floor at L=${r.L} should stay near ~1e-13, not grow like the plain floor`);
  }
  // the plain floor does grow with L (cancellation model), sanity anchor for the comparison
  if (!(rows[2].plainFloor > rows[0].plainFloor)) throw new Error('imp-96384: plain floor should grow with L (imp-96369 cancellation model)');

  // honesty gates
  if (!/NO QED/.test(IMP96384_DOUBLE_DOUBLE_VAR_REORDER_FLOOR.verdict))
    throw new Error('imp-96384: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96384_DOUBLE_DOUBLE_VAR_REORDER_FLOOR.verdict))
    throw new Error('imp-96384: verdict dropped the no-refereed-bound-change banner');
})();

export default IMP96384_DOUBLE_DOUBLE_VAR_REORDER_FLOOR;
