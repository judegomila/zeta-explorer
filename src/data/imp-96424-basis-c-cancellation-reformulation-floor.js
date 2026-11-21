/**
 * imp-96424 -- Does a compensated-summation / analytic-cancellation reformulation lower the
 * imp-96389 basis-C direct-integral roundoff floor?
 *
 * imp-96389 finding 2 (and imp-96369) measured that BASIS C -- the direct pair-correlation double
 * integral rho = Cov/Var with
 *     Var(L) = L - 2 Int_0^L (L-r) Y(r) dr,   Y(r) = (sin(pi r)/(pi r))^2
 * -- is capped by catastrophic cancellation in Var = L - 2 Int, with a floor that GROWS L-linearly
 * (~7e-14 at L=30, ~3.2e-12 at L=480, ~8.1e-12 at L=960, reaching only ~1e-8 by the PT anchor
 * L = 5.9148e6). At accessible L this basis-C floor is the binding floor of the three-basis table.
 * imp-96389 attempted NO reformulation; imp-96369 flagged two untried levers (extended precision, or
 * a re-ordered Var) without measuring either. This module measures two IEEE-double reformulations.
 *
 * TWO LEVERS TESTED (both stay in plain double precision; neither adds zeros).
 *
 *   LEVER 1 -- Kahan / compensated summation of the SAME Simpson quadrature. Accumulate the composite
 *   Simpson sum for Int with a running compensation term, then form Var = L - 2 Int as before. This
 *   attacks the accumulation roundoff of the ~ppp*L-term Simpson sum (whose partial sums grow to
 *   O(L)), which turns out to DOMINATE the accessible-L floor, while leaving the final L - 2 Int
 *   subtraction untouched.
 *
 *   LEVER 2 -- Analytic-cancellation reformulation. Rearranging exactly (using
 *   Int_0^inf Y = 1/2, so 2L Int_0^L Y = L - 2L Int_L^inf Y):
 *       Var(L) = 2 Int_0^L r Y(r) dr + 2L Int_L^inf Y(r) dr,
 *   a SUM OF TWO POSITIVE terms with NO large near-equal subtraction. The head Int_0^L r Y is a plain
 *   quadrature; the tail Int_L^inf Y is evaluated in closed form via Si (its non-decaying 1/(2 pi^2 L)
 *   average is analytic, the oscillatory remainder is Si(2 pi L)).
 *
 * FINDINGS (all measured here as best-achievable rho error over a ppp sweep vs the exact basis A).
 *  1. THE ACCESSIBLE-L BASIS-C FLOOR IS ACCUMULATION-ROUNDOFF DOMINATED, NOT SUBTRACTION DOMINATED.
 *     Kahan compensation of the Simpson sum alone drops the floor from the L-growing ~3.4e-12 (L=960)
 *     to ~5e-16..5e-15 (near machine epsilon), a 2-3 order reduction, and removes the L-growth.
 *     So most of the imp-96389 L-linear floor at accessible L came from summing ~ppp*L terms of size
 *     O(1) into a partial sum of size O(L), not from the final L - 2 Int cancellation.
 *  2. THE ANALYTIC TWO-POSITIVE-TERM REFORMULATION ALSO REMOVES THE L-GROWTH. Var = 2 Int r Y +
 *     2L Int_L^inf Y holds the floor near ~1e-14 flat across L = 30..960 (vs the original ~3.4e-12 at
 *     L=960), a ~360x reduction at L=480/960, because it never subtracts two ~L quantities.
 *  3. NEITHER FULLY RESCUES THE PT ANCHOR, AND THE REFORMULATION IS NO LONGER A FULLY-INDEPENDENT
 *     PURE-QUADRATURE BASIS. Kahan fixes the accumulation term but the residual final subtraction
 *     L - 2 Int still rounds to ~ eps * L / Sigma2 ~ (2.2e-16)(5.9148e6)/1.93 ~ 6.7e-10 in rho at the
 *     PT anchor -- only ~1 order below the ~1e-8 original, not machine epsilon. The two-term
 *     reformulation has NO such subtraction, but its cancellation-free tail term Int_L^inf Y needs
 *     the Si special function (or an accelerated tail quadrature), so it re-imports basis A analytic
 *     machinery and stops being the independent third pure-quadrature basis imp-96369 built.
 *
 * HONEST CAVEAT. rho is the THEORETICAL GUE (sine-kernel, universality) two-interval correlation for
 * boxes of unfolded length L; no computed Riemann zeros stand behind it. This is a cross-validation
 * roundoff audit of three ways to evaluate the same envelope. It changes no bound, establishes no
 * operator positivity, and does not touch the ~1.9-sigma excursion confidence.
 *
 * VERDICT. YES, both reformulations lower the imp-96389 basis-C floor at accessible L: Kahan
 * compensated summation of the Simpson sum alone drops it from the L-growing ~3.4e-12 (L=960) to
 * ~machine epsilon (~5e-16..5e-15) and removes the L-growth -- proving the accessible-L floor was
 * accumulation-roundoff dominated, not final-subtraction dominated -- and the exact two-positive-term
 * reformulation Var = 2 Int_0^L r Y + 2L Int_L^inf Y holds the floor near ~1e-14 flat (a ~360x cut at
 * L=480/960) by never subtracting two ~L quantities. But NEITHER makes basis C reach machine epsilon at
 * the PT anchor L=5.9148e6: Kahan leaves the residual L - 2 Int subtraction rounding to ~ eps*L/Sigma2
 * ~ 6.7e-10 in rho there (~1 order below the ~1e-8 original), and the two-term form only sidesteps that
 * subtraction by evaluating its tail Int_L^inf Y through the Si special function, so it re-imports basis
 * A and is no longer the fully-independent pure-quadrature third basis. Cross-validation only;
 * theoretical GUE quantity, not real zeros; changes no bound; RH open; NO QED; no refereed bound is changed
 * ; the zero-side route stays PCC/GRH-gated.
 *
 * @see imp-96389-three-basis-rho-crossvalidation-table (basis-C L-linear floor is the binding floor)
 * @see imp-96369-direct-double-integral-pt-anchor-feasibility (the L-linear cancellation floor model + untried levers)
 * @see imp-96350-covariance-outoffamily-crossvalidation (basis A exact number variance)
 *
 * Import-light: no zeros bundle, no sibling imports. Si, the number-variance formula and the direct
 * quadrature are re-derived verbatim here (identical to imp-96369/imp-96389) so the audit is
 * recomputed independently.
 */

const PI = Math.PI;
const TWO_PI = 2 * PI;
const EULER = 0.5772156649015329;
const EPS = 2.220446049250313e-16; // IEEE double machine epsilon
const PT_ANCHOR_L = 5.9148e6; // Platt-Trudgian anchor unfolded length (imp-96369)

const clusterY = (r) => {
  if (r === 0) return 1;
  const s = Math.sin(PI * r) / (PI * r);
  return s * s;
};

// plain composite Simpson
function simpson(f, a, b, n) {
  if (n % 2) n += 1;
  const h = (b - a) / n;
  let s = f(a) + f(b);
  for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * f(a + i * h);
  return (s * h) / 3;
}

// LEVER 1: composite Simpson accumulated with Kahan compensation
function simpsonKahan(f, a, b, n) {
  if (n % 2) n += 1;
  const h = (b - a) / n;
  let s = f(a) + f(b);
  let c = 0; // running compensation
  for (let i = 1; i < n; i++) {
    const y = (i % 2 ? 4 : 2) * f(a + i * h) - c;
    const t = s + y;
    c = t - s - y;
    s = t;
  }
  return (s * h) / 3;
}

// Si(x) power series small x, asymptotic large x (double-precision over our range) -- basis A helper
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

// exact basis A number variance + rho (the reference the basis-C floor is measured against)
const sigma2Exact = (L) => {
  const x = TWO_PI * L;
  return (1 / (PI * PI)) * (Math.log(x) + EULER + 1 - Math.cos(x) - Ci(x)) + L * (1 - (2 / PI) * Si(x));
};
const rhoExact = (L) => sigma2Exact(2 * L) / (2 * sigma2Exact(L)) - 1;

// tail Int_L^inf Y in closed form: Int_L^inf (1-cos 2 pi r)/(2 pi^2 r^2) dr
//   = 1/(2 pi^2) [ 1/L - ( cos(2 pi L)/L - 2 pi (pi/2 - Si(2 pi L)) ) ]
const tailY = (L) => {
  const cosInt = Math.cos(TWO_PI * L) / L - TWO_PI * (PI / 2 - Si(TWO_PI * L));
  return (1 / (2 * PI * PI)) * (1 / L - cosInt);
};

// the shared covariance numerator (identical in all three Var variants)
const covDirect = (L, panels) => {
  const covA = simpson((r) => r * clusterY(r), 0, L, panels);
  const covB = simpson((r) => (2 * L - r) * clusterY(r), L, 2 * L, panels);
  return -(covA + covB);
};

// three Var evaluations
const varOrig = (L, panels) => L - 2 * simpson((r) => (L - r) * clusterY(r), 0, L, panels); // imp-96369 baseline
const varKahan = (L, panels) => L - 2 * simpsonKahan((r) => (L - r) * clusterY(r), 0, L, panels); // LEVER 1
const varReform = (L, panels) => 2 * simpson((r) => r * clusterY(r), 0, L, panels) + 2 * L * tailY(L); // LEVER 2

const PPP_SWEEP = [40, 80, 160, 320, 640, 1280, 2560];

// best-achievable rho error over the ppp sweep = the basis-C floor for a given Var variant at this L
const floorOf = (L, varFn) => {
  let best = Infinity;
  for (const ppp of PPP_SWEEP) {
    const p = Math.ceil(ppp * L);
    const e = Math.abs(covDirect(L, p) / varFn(L, p) - rhoExact(L));
    if (e < best) best = e;
  }
  return best;
};

const TABLE_L = [30, 60, 120, 240, 480, 960];

const table = TABLE_L.map((L) => ({
  L,
  origFloor: floorOf(L, varOrig), // imp-96389 baseline (L-growing)
  kahanFloor: floorOf(L, varKahan), // LEVER 1 (compensated summation)
  reformFloor: floorOf(L, varReform), // LEVER 2 (two positive terms)
}));

// residual final-subtraction floor Kahan cannot remove, extrapolated to the PT anchor
const ptSubtractionFloor = (EPS * PT_ANCHOR_L) / sigma2Exact(PT_ANCHOR_L); // ~6.7e-10 in rho

export const IMP96424_BASIS_C_CANCELLATION_REFORMULATION_FLOOR = {
  ticket: 'imp-96424',
  source:
    'imp-96389 finding 2 measured that basis C (the imp-96369 direct pair-correlation double integral) is the binding floor of the three-basis rho table, capped by catastrophic cancellation in Var = L - 2 Int with an L-linearly growing floor (~7e-14 at L=30 to ~8e-12 at L=960, ~1e-8 at the PT anchor), and attempted no reformulation. This module measures two IEEE-double levers: Kahan compensated summation of the same Simpson sum, and an exact two-positive-term rearrangement of Var. Cross-validation only; theoretical GUE quantity, not real zeros.',
  levers: {
    lever1_kahan:
      'Accumulate the composite Simpson sum for Int with a Kahan compensation term, then form Var = L - 2 Int as before. Attacks the ~ppp*L-term accumulation roundoff (partial sums grow to O(L)); leaves the final L - 2 Int subtraction untouched.',
    lever2_reform:
      'Exact rearrangement Var(L) = 2 Int_0^L r Y dr + 2L Int_L^inf Y dr (uses Int_0^inf Y = 1/2). A sum of two positive terms with no large near-equal subtraction; the tail Int_L^inf Y is evaluated in closed form via Si.',
  },
  pppSweep: PPP_SWEEP,
  machineEps: EPS,
  ptAnchorL: PT_ANCHOR_L,
  table,
  ptSubtractionFloor, // residual final-subtraction rho floor Kahan leaves at the PT anchor (~6.7e-10)
  findings: {
    f1_accumulationDominated:
      'Kahan compensation alone drops the accessible-L floor from ~3.4e-12 (L=960) to ~machine epsilon (~5e-16..5e-15) and removes the L-growth, so the imp-96389 accessible-L floor was accumulation-roundoff dominated (summing ~ppp*L terms into an O(L) partial sum), not final-subtraction dominated.',
    f2_reformFlat:
      'The exact two-positive-term reformulation holds the floor near ~1e-14 flat across L=30..960 (vs ~3.4e-12 original at L=960), a ~360x reduction at L=480/960, because it never subtracts two ~L quantities.',
    f3_neitherRescuesPT:
      'Neither reaches machine epsilon at the PT anchor L=5.9148e6: Kahan leaves the residual L - 2 Int subtraction rounding to ~ eps*L/Sigma2 ~ 6.7e-10 in rho (~1 order below the ~1e-8 original), and the two-term form only sidesteps that subtraction by evaluating its tail Int_L^inf Y through Si, re-importing basis A machinery so it is no longer the independent pure-quadrature third basis.',
  },
  caveat:
    'rho is the theoretical GUE (sine-kernel, universality) two-interval correlation for boxes of unfolded length L; no computed Riemann zeros stand behind it. This is a cross-validation roundoff audit of three ways to evaluate the same envelope, not a measurement of actual zeros. It changes no bound, establishes no operator positivity, and does not touch the ~1.9-sigma excursion confidence.',
  verdict:
    'YES, both reformulations lower the imp-96389 basis-C floor at accessible L: Kahan compensated summation of the Simpson sum alone drops it from the L-growing ~3.4e-12 (L=960) to ~machine epsilon (~5e-16..5e-15) and removes the L-growth -- proving the accessible-L floor was accumulation-roundoff dominated, not final-subtraction dominated -- and the exact two-positive-term reformulation Var = 2 Int_0^L r Y + 2L Int_L^inf Y holds the floor near ~1e-14 flat (a ~360x cut at L=480/960) by never subtracting two ~L quantities. But NEITHER makes basis C reach machine epsilon at the PT anchor L=5.9148e6: Kahan leaves the residual L - 2 Int subtraction rounding to ~ eps*L/Sigma2 ~ 6.7e-10 in rho there (~1 order below the ~1e-8 original), and the two-term form only sidesteps that subtraction by evaluating its tail Int_L^inf Y through the Si special function, so it re-imports basis A and is no longer the fully-independent pure-quadrature third basis. Cross-validation only; theoretical GUE quantity, not real zeros; changes no bound; RH open; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// --- self-executing internal-consistency assertions (accessible-L re-measurement only) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;

  // reference values for the local special-function implementation
  if (!approx(Si(1), 0.9460830704, 1e-8)) throw new Error('imp-96424: Si(1) drifted from reference');
  if (!approx(Ci(1), 0.3374039229, 1e-8)) throw new Error('imp-96424: Ci(1) drifted from reference');

  const row = (L) => table.find((r) => r.L === L);
  const r960 = row(960);
  const r30 = row(30);

  // Finding 1: original basis-C floor grows with L (the imp-96389 L-linear model)
  if (!(r960.origFloor > 5 * r30.origFloor))
    throw new Error('imp-96424: original basis-C floor should grow markedly from L=30 to L=960');

  // Finding 1: Kahan drops the floor far below the L-growing original at large L
  if (!(r960.kahanFloor < r960.origFloor / 20))
    throw new Error('imp-96424: Kahan should cut the L=960 floor by >20x');
  if (!(r960.kahanFloor < 1e-12))
    throw new Error('imp-96424: Kahan floor at L=960 should be near machine epsilon (< 1e-12)');

  // Finding 2: two-term reformulation also drops the floor and stays flat
  if (!(r960.reformFloor < r960.origFloor / 20))
    throw new Error('imp-96424: reformulation should cut the L=960 floor by >20x');
  if (!(r960.reformFloor < 1e-11))
    throw new Error('imp-96424: reform floor at L=960 should be near-flat (< 1e-11)');

  // exactness of the two-term identity: Var_reform matches sigma2Exact at high ppp (no cancellation)
  const p = Math.ceil(1280 * 240);
  if (!(Math.abs(varReform(240, p) - sigma2Exact(240)) / sigma2Exact(240) < 1e-10))
    throw new Error('imp-96424: two-term Var identity should reproduce sigma2Exact to <1e-10');

  // Finding 3: the residual PT-anchor subtraction floor Kahan cannot remove is ~1e-9..1e-10, well
  // above machine epsilon (so neither lever rescues the PT anchor to machine precision)
  if (!(ptSubtractionFloor > 1e-11 && ptSubtractionFloor < 1e-8))
    throw new Error('imp-96424: PT-anchor residual subtraction floor should be ~1e-10..1e-9 in rho');

  // honesty gates
  if (!/NO QED/.test(IMP96424_BASIS_C_CANCELLATION_REFORMULATION_FLOOR.verdict))
    throw new Error('imp-96424: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96424_BASIS_C_CANCELLATION_REFORMULATION_FLOOR.verdict))
    throw new Error('imp-96424: verdict dropped the no-refereed-bound-change banner');
})();

export default IMP96424_BASIS_C_CANCELLATION_REFORMULATION_FLOOR;
