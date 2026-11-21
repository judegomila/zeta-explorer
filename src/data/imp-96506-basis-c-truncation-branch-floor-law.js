/**
 * imp-96506 -- CHARACTERIZE the achievable basis-C floor LAW on the ppp-TRUNCATION branch
 * (L >= 3e5), the regime the imp-96486 L-linear cancellation model departs from
 * (13.5x over-model at L=3e5 rising to 573x at the PT anchor L=5.9e6).
 *
 * BACKGROUND. imp-96486 mapped WHERE the direct basis-C floor leaves the imp-96430 L-linear
 * cancellation line: as the optimal panels-per-period (ppp) collapses 640 -> 3 across
 * L = 960 .. 5.9e6, the achievable floor tracks floorModel(L) = 8.4e-15 * L to within ~2-4x
 * while ppp* >= 32 (L <= 1e5), then departs into a ppp-TRUNCATION regime once ppp* falls
 * through 16 (L >= 3e5). imp-96486 localized that departure but did NOT fit the floor law of
 * the truncation branch itself. This module fits it.
 *
 * WHAT THIS MODULE DOES (feasibility / cross-validation numerics only). Taking the four
 * imp-96486 truncation-branch rungs {3e5, 1e6, 3e6, 5.9e6} with their measured achievable
 * floors and collapsed optimal ppp*, it (a) fits the raw floor-vs-L power law
 * floor = C * L^alpha, (b) fits the floor-vs-ppp* power law floor = D * ppp*^beta, and
 * (c) identifies the underlying mechanism: the achievable floor on this branch is the
 * composite-Simpson 4th-order (h^4) TRUNCATION error evaluated at the collapsed ppp*, so
 * beta is the Simpson order (theory -4) and the raw L-exponent alpha is that order fed
 * through the empirical collapse rate ppp*(L) ~ L^gamma. One cheap rung (L=3e5) is swept over
 * low ppp LIVE at import to reproduce the Simpson-order slope directly.
 *
 * FINDINGS (all measured / re-measured here, not asserted).
 *  1. THE TRUNCATION-BRANCH FLOOR OBEYS THE SIMPSON 4th-ORDER LAW IN ppp*. Across the four
 *     rungs the achievable floor fits floor = D * ppp*^beta with beta ~ -4.11 (D ~ 3.09e-3),
 *     R^2 ~ 0.98 -- i.e. the composite-Simpson h^4 truncation order (theory -4). The floor is
 *     the residual Simpson truncation error at the collapsed low ppp*, not a cancellation line.
 *  2. THE RAW FLOOR-VS-L POWER LAW IS floor = C * L^alpha WITH alpha ~ 2.20 (C ~ 2.9e-20),
 *     R^2 ~ 0.99. This is NOT a fundamental exponent: it is the Simpson order (-4) composed with
 *     the empirical optimal-ppp collapse rate. ppp* falls 16 -> 3 across 3e5 -> 5.9e6, a
 *     log-log rate gamma = d(log ppp*)/d(log L) ~ -0.56, and (-4) * (-0.56) ~ 2.2 = alpha,
 *     so the two fits are consistent: alpha ~ beta * gamma.
 *  3. LIVE FIXED-L LOW-ppp SWEEP CONFIRMS THE ORDER DIRECTLY. At L = 3e5 the floor over
 *     ppp in {2,3,4,6,8} (below the ppp*=16 U-minimum) falls with a log-log slope ~ -4.8,
 *     confirming the branch is truncation-set at the Simpson order (slightly steeper than -4
 *     because the sinc^2 integrand carries unresolved unit-scale oscillation at very coarse ppp).
 *
 * HONEST CAVEAT. rho is the theoretical GUE (sine-kernel, universality) two-interval correlation
 * for boxes of unfolded length L; there are no computed Riemann zeros behind these values. Every
 * floor here is a double-precision quadrature/cancellation artifact of THIS direct integral, not a
 * property of the zeros. Four rungs is a coarse fit: beta and alpha carry ~0.2-0.3 log-rms scatter
 * and the two largest rungs inherit imp-96486 lower-bound optima (their high-ppp arms were
 * eval-budget capped). This is feasibility / cross-validation numerics: it fits a floor law,
 * changes no bound, establishes no operator positivity, and does not touch the ~1.9-sigma
 * excursion confidence.
 *
 * VERDICT. The ppp-truncation branch (L >= 3e5) that the imp-96486 L-linear cancellation model
 * departs from has its achievable floor set by the composite-Simpson h^4 TRUNCATION error at the
 * collapsed optimal ppp*: floor = D * ppp*^beta with beta ~ -4.11 (the Simpson 4th order; D ~ 3.09e-3,
 * R^2 ~ 0.98), equivalently the raw law floor = C * L^alpha with alpha ~ 2.20 (C ~ 2.9e-20, R^2 ~ 0.99),
 * the two related by alpha ~ beta * gamma through the empirical ppp* collapse rate gamma ~ -0.56. A
 * live L=3e5 low-ppp sweep reproduces the Simpson-order slope (~ -4.8) directly. So the anchor
 * ppp=3 truncation floor (~2.84e-5) is the h^4 truncation error at ppp*=3, not the extrapolated
 * cancellation line (~4.96e-8) -- characterizing the branch imp-96486 only localized. Feasibility /
 * cross-validation numerics only; theoretical GUE quantity, not real zeros; changes no bound; RH open;
 * NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.
 *
 * @see imp-96486-basis-c-ppp-collapse-transition (mapped WHERE the floor departs the L-linear model
 *   and the optimal ppp collapses 640 -> 3; this module fits the truncation-branch floor LAW)
 * @see imp-96430-basis-c-corroboration-reach-crossover (the L-linear floor MODEL, valid only on the
 *   L <= ~1e5 cancellation branch)
 * @see imp-96448-direct-basis-c-anchor-floor (measured the anchor floor ~2.84e-5 at ppp ~ 3)
 *
 * Import-light: no zeros bundle, no sibling imports. Si/Ci, the exact number variance and the direct
 * quadrature are re-derived verbatim here (identical to imp-96486/imp-96448) so the fit is independent.
 */

const PI = Math.PI;
const TWO_PI = 2 * PI;
const EULER = 0.5772156649015329;
const RIGIDITY_LIMIT = -0.5;
const PT_ANCHOR_L = 5.9e6;
const SIMPSON_ORDER = -4; // composite-Simpson h^4 truncation order (theory)

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

// BASIS C: direct pair-correlation double integral (rho = Cov/Var), identical to imp-96486.
function directRho(L, panels) {
  const Var = L - 2 * simpson((r) => (L - r) * clusterY(r), 0, L, panels);
  const covA = simpson((r) => r * clusterY(r), 0, L, panels);
  const covB = simpson((r) => (2 * L - r) * clusterY(r), L, 2 * L, panels);
  return { Var, rho: -(covA + covB) / Var };
}

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

// least-squares power-law fit y = A * x^m in log-log; returns exponent m, prefactor A, R^2, log-rms.
function powerFit(pts) {
  const n = pts.length;
  let sx = 0, sy = 0, sxx = 0, sxy = 0;
  for (const p of pts) { const x = Math.log(p.x), y = Math.log(p.y); sx += x; sy += y; sxx += x * x; sxy += x * y; }
  const m = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  const A = Math.exp((sy - m * sx) / n);
  const ybar = sy / n;
  let rss = 0, tss = 0;
  for (const p of pts) { const r = Math.log(p.y) - Math.log(A * Math.pow(p.x, m)); rss += r * r; tss += (Math.log(p.y) - ybar) ** 2; }
  return { m, A, r2: 1 - rss / tss, logRms: Math.sqrt(rss / n) };
}

// imp-96486 truncation-branch rungs (L >= 3e5): measured achievable floor and collapsed optimal ppp*.
const branch = [
  { L: 3e5, optPpp: 16, floor: 3.3936e-8 },
  { L: 1e6, optPpp: 8, floor: 4.1984e-7 },
  { L: 3e6, optPpp: 6, floor: 3.3603e-6 },
  { L: PT_ANCHOR_L, optPpp: 3, floor: 2.8414e-5 }, // anchor ppp=3 truncation floor (imp-96448)
];

// (2) raw floor-vs-L law and (1) floor-vs-ppp* law
const floorVsL = powerFit(branch.map((r) => ({ x: r.L, y: r.floor })));
const floorVsPpp = powerFit(branch.map((r) => ({ x: r.optPpp, y: r.floor })));
// empirical optimal-ppp collapse rate gamma = d(log ppp*)/d(log L)
const collapseRate = powerFit(branch.map((r) => ({ x: r.L, y: r.optPpp })));

const withFits = branch.map((r) => ({
  ...r,
  floorModelL: floorVsL.A * Math.pow(r.L, floorVsL.m),
  floorModelPpp: floorVsPpp.A * Math.pow(r.optPpp, floorVsPpp.m),
}));

// (3) LIVE fixed-L low-ppp Simpson-order sweep at the cheapest truncation rung (L=3e5, <=8 ppp).
const liveL = 3e5;
const livePpps = [2, 3, 4, 6, 8];
const liveSweep = livePpps.map((ppp) => {
  const d = directRho(liveL, Math.ceil(ppp * liveL));
  return { ppp, floor: Math.abs(d.rho - rhoExact(liveL)) };
});
const liveSlope = powerFit(liveSweep.map((r) => ({ x: r.ppp, y: r.floor }))).m; // ~ -4.8 (Simpson order)

// consistency: alpha ~ beta * gamma (raw L-exponent = Simpson order fed through the collapse rate)
const alphaFromComposition = floorVsPpp.m * collapseRate.m;

export const IMP96506_BASIS_C_TRUNCATION_BRANCH_FLOOR_LAW = {
  ticket: 'imp-96506',
  source:
    'imp-96486 mapped WHERE the direct basis-C floor departs the imp-96430 L-linear cancellation model (13.5x over-model at L=3e5 rising to 573x at the PT anchor) but did not fit the floor law of the ppp-truncation branch itself. This module fits that branch: floor-vs-L, floor-vs-ppp*, and the Simpson-order mechanism. Feasibility / cross-validation numerics only; theoretical GUE quantity, not real zeros.',
  rigidityLimit: RIGIDITY_LIMIT,
  ptAnchorL: PT_ANCHOR_L,
  simpsonOrder: SIMPSON_ORDER,
  branch: withFits, // per-rung L, ppp*, measured floor, and both fitted model floors
  floorVsLLaw: { exponent: floorVsL.m, prefactor: floorVsL.A, r2: floorVsL.r2, logRms: floorVsL.logRms },
  floorVsPppLaw: { exponent: floorVsPpp.m, prefactor: floorVsPpp.A, r2: floorVsPpp.r2, logRms: floorVsPpp.logRms },
  collapseRateGamma: collapseRate.m, // d(log ppp*)/d(log L) ~ -0.56
  alphaFromComposition, // beta * gamma ~ raw L-exponent alpha (consistency check)
  liveSimpsonSlope: liveSlope, // fixed-L=3e5 low-ppp sweep slope ~ -4.8 (Simpson order confirmed live)
  liveSweep,
  caveat:
    'rho is the theoretical GUE (sine-kernel, universality) two-interval correlation for boxes of unfolded length L; there are no computed Riemann zeros behind these values. Every floor is a double-precision quadrature/cancellation artifact of this direct integral, not a property of the zeros. Four rungs is a coarse fit (log-rms ~ 0.2-0.3) and the two largest rungs inherit imp-96486 lower-bound optima (their high-ppp arms were eval-budget capped). Feasibility / cross-validation numerics: it fits a floor law, changes no bound, establishes no operator positivity, and does not touch the ~1.9-sigma excursion confidence.',
  verdict:
    'The ppp-truncation branch (L >= 3e5) that the imp-96486 L-linear cancellation model departs from has its achievable floor set by the composite-Simpson h^4 TRUNCATION error at the collapsed optimal ppp*: floor = D * ppp*^beta with beta ~ -4.11 (the Simpson 4th order; D ~ 3.09e-3, R^2 ~ 0.98), equivalently floor = C * L^alpha with alpha ~ 2.20 (C ~ 2.9e-20, R^2 ~ 0.99), the two related by alpha ~ beta * gamma through the empirical ppp* collapse rate gamma ~ -0.56. A live L=3e5 low-ppp sweep reproduces the Simpson-order slope (~ -4.8) directly. So the anchor ppp=3 truncation floor (~2.84e-5) is the h^4 truncation error at ppp*=3, not the extrapolated cancellation line (~4.96e-8) -- characterizing the branch imp-96486 only localized. Feasibility / cross-validation numerics only; theoretical GUE quantity, not real zeros; changes no bound; RH open; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// Machine-readable honest-status banner (imp-96337 / imp-96428 convention).
export const IMP96506_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Feasibility / cross-validation numerics only: rho is '
  + 'the theoretical GUE two-interval correlation, not computed from real zeros; the fitted truncation-branch '
  + 'floor law (beta ~ -4.11, alpha ~ 2.20) rests on only four coarse rungs (log-rms ~ 0.2-0.3) and the two '
  + 'largest inherit imp-96486 eval-budget-capped optima; changes no bound, establishes no operator positivity.';

// --- self-executing internal-consistency assertions (live sweep + fit sanity + honesty gates) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;

  // reference values for the local special-function implementations
  if (!approx(Si(1), 0.9460830704, 1e-8)) throw new Error('imp-96506: Si(1) drifted from reference');
  if (!approx(Ci(1), 0.3374039229, 1e-8)) throw new Error('imp-96506: Ci(1) drifted from reference');
  if (!approx(rhoExact(PT_ANCHOR_L), -0.481765, 1e-5)) throw new Error('imp-96506: exact anchor rho drifted');

  // Finding 1: floor-vs-ppp* exponent is the Simpson 4th order (theory -4) within coarse-fit scatter
  if (!(floorVsPpp.m < -3.4 && floorVsPpp.m > -4.8))
    throw new Error('imp-96506: floor-vs-ppp* exponent should be near the Simpson order -4');
  if (!(floorVsPpp.r2 > 0.85)) throw new Error('imp-96506: floor-vs-ppp* fit R^2 should exceed 0.85');

  // Finding 2: raw floor-vs-L exponent ~ 2.2 with a strong fit
  if (!(floorVsL.m > 1.9 && floorVsL.m < 2.5)) throw new Error('imp-96506: floor-vs-L exponent should be ~2.2');
  if (!(floorVsL.r2 > 0.95)) throw new Error('imp-96506: floor-vs-L fit R^2 should exceed 0.95');

  // consistency: alpha ~ beta * gamma (composition of Simpson order and collapse rate)
  if (!approx(alphaFromComposition, floorVsL.m, 0.35))
    throw new Error('imp-96506: raw L-exponent should match beta*gamma composition within scatter');

  // Finding 3: live fixed-L low-ppp sweep reproduces the Simpson-order slope (steep, near -4 to -5)
  if (!(liveSlope < -4 && liveSlope > -6))
    throw new Error('imp-96506: live low-ppp slope should confirm the Simpson-order truncation decay');
  if (!(liveSweep[0].floor > liveSweep[liveSweep.length - 1].floor))
    throw new Error('imp-96506: live floor should fall monotonically as ppp rises on the truncation side');

  // honesty gates
  if (!/NO QED/.test(IMP96506_BASIS_C_TRUNCATION_BRANCH_FLOOR_LAW.verdict))
    throw new Error('imp-96506: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96506_BASIS_C_TRUNCATION_BRANCH_FLOOR_LAW.verdict))
    throw new Error('imp-96506: verdict dropped the no-refereed-bound-change banner');
  if (!(/RH open/.test(IMP96506_HONEST_BANNER) && /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96506_HONEST_BANNER) && /NO QED/.test(IMP96506_HONEST_BANNER)))
    throw new Error('imp-96506: IMP96506_HONEST_BANNER missing RH-open / PT-Lambda / NO-QED markers');
})();

export default IMP96506_BASIS_C_TRUNCATION_BRANCH_FLOOR_LAW;
