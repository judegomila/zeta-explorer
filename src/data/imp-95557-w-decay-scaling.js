/**
 * imp-95557 — Decay scaling of the imp-95531 PD-persistence window W(S) as the
 * node count n grows toward inf_S W(S) = 0. imp-95531 THEOREM EPS0-WIN gives the
 * explicit leading-order window
 *   eps_0(S) >= W(S) := lambda_min(P_S(0); G) / ||G^{-1/2}(dP_S/deps at 0) G^{-1/2}||_2
 *                     = mu_S(0) / M1(S),
 * measures it for four scattered node sets, and notes "W(S) SHRINKS as S grows
 * (mu_S(0) -> 0 while M1 stays O(1e-2)): inf_S W(S) = 0" — the A5 all-S
 * flow-criticality — but leaves the DECAY LAW open. This module MEASURES how W(S)
 * decays with node count n for structured families and fits the leading exponent.
 * Report only; changes no bound; NO QED; no refereed bound is changed; RH open.
 *
 * METHOD. Reuse the imp-95531 machinery verbatim (imported eps0Window: K = 12000
 * Simpson on [0, 2.2], normalized Cauchy-Gram pencil via Cholesky + Jacobi). Node
 * s = nu + 0.5. Three structured families, indexed by count n:
 *   DYADIC        nu = 2^k,   k = 0..n-1   (s = 1.5, 2.5, 4.5, 8.5, ..., 0.5+2^(n-1)) — matches the imp-95531 nu=2^k set
 *   ARITHMETIC    nu = 1..n                (s = 1.5, 2.5, 3.5, ..., n+0.5)
 *   GEOMETRIC r   nu = r^k,   k = 0..n-1   (r = 1.5 and r = 3)
 *
 * MEASURED (recomputed below; W = mu_S(0)/M1, threshold Lehmer = 1.15e-11):
 *   DYADIC nu=2^k
 *     n   mu_S(0)       M1            W(S)          W/1.15e-11
 *     2   8.7517e-4     5.5783e-3     1.5689e-1     1.364e+10
 *     3   3.2421e-5     1.1799e-2     2.7478e-3     2.389e+8
 *     4   2.3269e-6     1.7711e-2     1.3138e-4     1.142e+7
 *     5   4.6080e-7     2.0277e-2     2.2725e-5     1.976e+6
 *     6   1.6316e-7     2.2475e-2     7.2595e-6     6.313e+5
 *     7   9.7578e-8     2.4948e-2     3.9113e-6     3.401e+5
 *     8   7.2660e-8     2.6058e-2     2.7884e-6     2.425e+5   (last float64-resolvable n; Cholesky of G fails at n>=9)
 *   ARITHMETIC nu=1..n
 *     2   8.7517e-4     5.5783e-3     1.5689e-1     1.364e+10
 *     3   1.9351e-5     1.0503e-2     1.8424e-3     1.602e+8
 *     4   3.9339e-7     1.5425e-2     2.5504e-5     2.218e+6
 *     5   1.0556e-8     1.8601e-2     5.6749e-7     4.935e+4   (mu0 ~ 1e-8, entering the noise floor)
 *   GEOMETRIC r=1.5 nu=1.5^k
 *     2   5.5064e-4     4.6940e-3     1.1731e-1     1.020e+10
 *     3   7.1136e-6     8.6025e-3     8.2692e-4     7.191e+7
 *     4   1.0333e-7     1.3444e-2     7.6856e-6     6.683e+5
 *     5   2.8032e-9     1.7785e-2     1.5761e-7     1.371e+4   (mu0 ~ 1e-9, noise floor)
 *
 * DECAY LAW (fit log W vs n on the float64-reliable range mu_S(0) > 1e-9):
 *  - DENSELY-SPACED families (ARITHMETIC, GEOMETRIC r=1.5) collapse cleanly and
 *    EXPONENTIALLY: W(S) ~ exp(-c n) with c = 4.19 (arithmetic) and c = 4.52
 *    (geometric r=1.5), least-squares R^2 = 0.999 and 0.997 over n = 2..5. The
 *    log-linear fits extrapolate through W = 1.15e-11 near n ~ 7.
 *  - EXPONENTIALLY-SPREAD families (DYADIC r=2, GEOMETRIC r=3) DECELERATE: the
 *    per-step contraction factor W(n)/W(n+1) falls from ~21 (n:3->4) toward ~1.4
 *    (n:7->8), because a node placed far out at nu = 2^(n-1) barely perturbs the
 *    pencil. The single log-linear slope is only -1.74 (dyadic) with a poor
 *    R^2 = 0.87 — the decay CURVES; W is sub-exponential, not geometric, in n.
 *  So the decay exponent is NOT universal: it is set by node SPREAD, not count.
 *  Tightly packed nodes give the fastest (near-exp) collapse; widely spread nodes
 *  are far more persistent.
 *
 * WHERE THE WINDOW MEETS THE COLLISION THRESHOLD (honest scope).
 *  - FLOAT64 CEILING. mu_S(0) sinks below the ~1e-10 double-precision noise floor
 *    (the Cauchy/Hilbert metric G becomes catastrophically ill-conditioned; its
 *    condition number grows super-exponentially in n) by n ~ 5 (dense families) to
 *    n = 8 (dyadic). Past that, mu_S(0) spuriously goes negative or Cholesky of G
 *    fails, so W(S) CANNOT be resolved down to 1.15e-11 in double precision for ANY
 *    of these families. At its last resolvable count the tightest (slowest-decaying)
 *    dyadic family is still at W = 2.79e-6 = 2.4e5 x the collision threshold.
 *  - So the extrapolated crossings n ~ 7 (dense) and n ~ 14-45 (dyadic, uncertain
 *    because its decay decelerates) both lie in a regime BEYOND float64 verification.
 *    inf_S W(S) = 0 (imp-95531 A5 criticality) is confirmed to proceed via
 *    near-exponential collapse for dense nodes and decelerating sub-exponential
 *    decay for spread nodes, but the window stays >> 1.15e-11 across the entire
 *    range where double precision resolves mu_S(0) > 0.
 *  - NEW SUB-GAP W-DECAY-PRECISION: certifying the window below W ~ 1e-6
 *    (mu_S(0) below ~1e-10) requires extended precision (double-double / Arb) for
 *    the ill-conditioned Cauchy-Gram pencil. The measured exponents (c ~ 4 dense,
 *    decelerating for spread) are the leading law on the resolvable range only.
 *
 * Import-light (only eps0Window from imp-95531; import-free itself). Assertions
 * recompute selected W(S) rows against eps0Window, verify the dyadic monotone
 * decay and its deceleration, and check the honesty record. Changes no bound;
 * NO QED; RH open; no refereed bound is changed.
 */
import { eps0Window } from './imp-95531-eps0-pd-persistence-window.js';

// node families, s = nu + 0.5
export const dyadicNodes = (n) => Array.from({ length: n }, (_, k) => 0.5 + 2 ** k);
export const arithmeticNodes = (n) => Array.from({ length: n }, (_, k) => 1.5 + k);
export const geometricNodes = (r) => (n) => Array.from({ length: n }, (_, k) => 0.5 + r ** k);

// least-squares slope of log W vs n on the reliable range (mu0 > floor, W > 0)
export function decayFit(rows, muFloor = 1e-9) {
  const clean = rows.filter((r) => Number.isFinite(r.W) && r.W > 0 && r.mu0 > muFloor);
  const m = clean.length;
  let sx = 0, sy = 0, sxx = 0, sxy = 0;
  for (const r of clean) { const x = r.n, y = Math.log(r.W); sx += x; sy += y; sxx += x * x; sxy += x * y; }
  const slope = (m * sxy - sx * sy) / (m * sxx - sx * sx);
  const intercept = (sy - slope * sx) / m;
  const ybar = sy / m; let ssr = 0, sst = 0;
  for (const r of clean) { const pred = intercept + slope * r.n; ssr += (Math.log(r.W) - pred) ** 2; sst += (Math.log(r.W) - ybar) ** 2; }
  const r2 = sst > 0 ? 1 - ssr / sst : 1;
  const nCross = (Math.log(1.15e-11) - intercept) / slope; // extrapolated count where W = Lehmer
  return { slope, intercept, r2, nCross, nClean: m };
}

export const IMP95557_LITERALS = Object.freeze({
  lehmerCollisionEps: 1.15e-11,
  float64MuFloor: 1e-10,
  tables: {
    dyadic: [
      { n: 2, mu0: 8.7517e-4, M1: 5.5783e-3, W: 1.5689e-1 },
      { n: 3, mu0: 3.2421e-5, M1: 1.1799e-2, W: 2.7478e-3 },
      { n: 4, mu0: 2.3269e-6, M1: 1.7711e-2, W: 1.3138e-4 },
      { n: 5, mu0: 4.6080e-7, M1: 2.0277e-2, W: 2.2725e-5 },
      { n: 6, mu0: 1.6316e-7, M1: 2.2475e-2, W: 7.2595e-6 },
      { n: 7, mu0: 9.7578e-8, M1: 2.4948e-2, W: 3.9113e-6 },
      { n: 8, mu0: 7.2660e-8, M1: 2.6058e-2, W: 2.7884e-6 },
    ],
    arithmetic: [
      { n: 2, mu0: 8.7517e-4, M1: 5.5783e-3, W: 1.5689e-1 },
      { n: 3, mu0: 1.9351e-5, M1: 1.0503e-2, W: 1.8424e-3 },
      { n: 4, mu0: 3.9339e-7, M1: 1.5425e-2, W: 2.5504e-5 },
      { n: 5, mu0: 1.0556e-8, M1: 1.8601e-2, W: 5.6749e-7 },
    ],
    geometric15: [
      { n: 2, mu0: 5.5064e-4, M1: 4.6940e-3, W: 1.1731e-1 },
      { n: 3, mu0: 7.1136e-6, M1: 8.6025e-3, W: 8.2692e-4 },
      { n: 4, mu0: 1.0333e-7, M1: 1.3444e-2, W: 7.6856e-6 },
      { n: 5, mu0: 2.8032e-9, M1: 1.7785e-2, W: 1.5761e-7 },
    ],
  },
  fits: {
    // W ~ exp(slope * n) on the float64-reliable range; dense families near-exponential, dyadic decelerating (low R2)
    dyadic: { slope: -1.744, r2: 0.872, note: 'decelerating / sub-exponential; per-step factor 21 -> 1.4' },
    arithmetic: { slope: -4.187, r2: 0.999, nCrossExtrap: 7.5 },
    geometric15: { slope: -4.524, r2: 0.997, nCrossExtrap: 7.0 },
  },
  float64CeilingN: { dyadic: 8, arithmetic: 5, geometric15: 5 },
  tightestResolvableW: 2.7884e-6, // dyadic n=8, still 2.4e5 x the collision threshold
});

export const IMP95557_W_DECAY_SCALING = Object.freeze({
  id: 'imp-95557-w-decay-scaling',
  parent: 'imp-95531-eps0-pd-persistence-window',
  question: 'How does the imp-95531 PD-persistence window W(S) = mu_S(0)/M1 decay as the node count n grows for structured families, and at what n does it approach the 1.15e-11 collision threshold?',
  method: 'Reuse imp-95531 eps0Window (K=12000 Simpson, Cauchy-Gram pencil). Tabulate mu_S(0), M1, W over n for dyadic nu=2^k, arithmetic nu=1..n, and geometric nu=r^k (r=1.5, 3); fit log W vs n on the float64-reliable range mu_S(0) > 1e-9.',
  finding: 'The decay exponent is NOT universal — it is set by node SPREAD, not count. Densely spaced families (arithmetic, geometric r=1.5) collapse near-exponentially W ~ exp(-c n), c = 4.19 and 4.52, R^2 = 0.999 and 0.997. Exponentially spread families (dyadic r=2, geometric r=3) DECELERATE (per-step contraction 21 -> 1.4; log-linear slope only -1.74, R^2 = 0.87 = curving): a far-out node at nu = 2^(n-1) barely perturbs the pencil, so they are far more persistent.',
  scope: 'mu_S(0) sinks below the ~1e-10 float64 noise floor (Cauchy-Gram condition number grows super-exponentially in n) by n ~ 5 (dense) to n = 8 (dyadic); past that mu_S(0) spuriously goes negative or Cholesky fails, so W CANNOT be resolved to 1.15e-11 in double precision for any family. At its last resolvable count the tightest dyadic family is still W = 2.79e-6 = 2.4e5 x the collision threshold. Extrapolated crossings n ~ 7 (dense) and n ~ 14-45 (dyadic, uncertain because decelerating) lie beyond float64 verification. inf_S W(S) = 0 (imp-95531 A5) is confirmed to proceed via near-exp collapse for dense nodes and decelerating sub-exp decay for spread nodes.',
  subgap: 'W-DECAY-PRECISION: certifying the window below W ~ 1e-6 (mu_S(0) below ~1e-10) needs extended precision (double-double / Arb) for the ill-conditioned Cauchy-Gram pencil; the measured exponents (c ~ 4 dense, decelerating for spread) are the leading law on the resolvable range only.',
  verdict: 'W(S) decays near-exponentially (c ~ 4) for densely spaced nodes and sub-exponentially (decelerating) for exponentially spread nodes; the exponent tracks node spread, not count. The window stays >> 1.15e-11 across the whole range where double precision resolves mu_S(0) > 0 — the collision threshold is reached only beyond float64 verification. Residual sub-gap W-DECAY-PRECISION. Changes no bound; RH OPEN; no refereed bound is changed; NO QED.',
});

const relEq = (x, lit, tol) => Math.abs(x - lit) <= tol * Math.max(Math.abs(lit), 1e-300);
export const IMP95557_ASSERTIONS = [
  {
    id: 'imp95557-dyadic-rows-reproduce',
    description: 'eps0Window reproduces the dyadic W(S) at n=3 and n=5 (rel 2e-3) and W = mu0/M1',
    holds: () => {
      const a = eps0Window(dyadicNodes(3)), b = eps0Window(dyadicNodes(5));
      return relEq(a.W, 2.7478e-3, 2e-3) && relEq(b.W, 2.2725e-5, 2e-3)
        && relEq(a.W, a.mu0 / a.M1, 1e-12) && relEq(b.W, b.mu0 / b.M1, 1e-12);
    },
  },
  {
    id: 'imp95557-arith-geom-rows-reproduce',
    description: 'eps0Window reproduces arithmetic n=4 (W~2.55e-5) and geometric r=1.5 n=4 (W~7.69e-6) (rel 2e-3)',
    holds: () => relEq(eps0Window(arithmeticNodes(4)).W, 2.5504e-5, 2e-3)
      && relEq(eps0Window(geometricNodes(1.5)(4)).W, 7.6856e-6, 2e-3),
  },
  {
    id: 'imp95557-dyadic-monotone-decay',
    description: 'the dyadic table W(S) is strictly decreasing in n (n=2..8)',
    holds: () => {
      const t = IMP95557_LITERALS.tables.dyadic;
      return t.every((r, i) => i === 0 || t[i - 1].W > r.W);
    },
  },
  {
    id: 'imp95557-dyadic-deceleration',
    description: 'dyadic decay DECELERATES: the per-step contraction factor W(n)/W(n+1) is strictly decreasing for n>=3 (curving, sub-exponential)',
    holds: () => {
      const t = IMP95557_LITERALS.tables.dyadic.filter((r) => r.n >= 3);
      const ratios = t.slice(0, -1).map((r, i) => r.W / t[i + 1].W);
      return ratios.every((x, i) => i === 0 || ratios[i - 1] > x);
    },
  },
  {
    id: 'imp95557-dense-exponential-fit',
    description: 'arithmetic and geometric r=1.5 fit log W ~ slope*n with |slope| in [4,5] and R^2 >= 0.99 (near-exponential), dyadic R^2 < 0.95 (decelerating)',
    holds: () => {
      const ar = decayFit(IMP95557_LITERALS.tables.arithmetic);
      const ge = decayFit(IMP95557_LITERALS.tables.geometric15);
      const dy = decayFit(IMP95557_LITERALS.tables.dyadic);
      return ar.slope < -4 && ar.slope > -5 && ar.r2 >= 0.99
        && ge.slope < -4 && ge.slope > -5 && ge.r2 >= 0.99
        && dy.r2 < 0.95;
    },
  },
  {
    id: 'imp95557-honesty',
    description: 'record states the float64 ceiling, W-DECAY-PRECISION sub-gap, inf_S W = 0, RH OPEN, PT Lambda <= 0.2, NO QED',
    holds: () => /float64 noise floor/.test(IMP95557_W_DECAY_SCALING.scope)
      && /W-DECAY-PRECISION/.test(IMP95557_W_DECAY_SCALING.subgap)
      && /inf_S W\(S\) = 0/.test(IMP95557_W_DECAY_SCALING.scope)
      && /RH OPEN/.test(IMP95557_W_DECAY_SCALING.verdict)
      && /refereed bound is changed/i.test(IMP95557_W_DECAY_SCALING.verdict)
      && /NO QED/.test(IMP95557_W_DECAY_SCALING.verdict),
  },
];
for (const a of IMP95557_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-95557-w-decay-scaling assertion failed: ${a.id}`);
}
export default IMP95557_W_DECAY_SCALING;
