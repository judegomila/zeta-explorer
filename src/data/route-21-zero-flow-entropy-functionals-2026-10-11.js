/**
 * @fileoverview route-21-zero-flow-entropy-functionals-2026-10-11 — roadmap route 21 (batch 6): entropy-type Lyapunov functionals
 * for the zero flow of the heat equation (Burgers entropy inequality) beyond the pair law.
 * One run plus one adversarial internal referee pass (not refuted; severity minor); the referee corrections are applied below.
 *
 * PROVED (elementary, for polynomial heat flows ∂_t f = −f″; written here, internal referee only):
 *  - Flow form: dz/dt = L(z) conj(z), L the Laplacian of the zero graph with weights w_kj = 2/|z_k − z_j|²; so dx/dt = +Lx, dy/dt = −Ly
 *    (imaginary parts diffuse by a weighted-graph heat equation; real parts spread). Every complex polynomial.
 *  - Theorem A (majorization, complex polynomials): t1 < t2 ⇒ y(t2) ≺ y(t1) and x(t1) ≺ x(t2) (doubly stochastic propagator between the
 *    finitely many collision times; majorization is closed). Every Schur-convex function of y is nonincreasing (sum of the m largest
 *    imaginary parts, Σφ(y_k) for convex φ).
 *  - Theorem A′ (complex polynomials): Σ_k F(x_k, y_k), F ∈ C², is nonincreasing along every heat flow iff F_xx ≤ 0 ≤ F_yy (F_xy free).
 *    Conservation: Σz_k, Σx_k y_k constant; Σz_k² = Σz_k(0)² + 2n(n−1)t.
 *  - Theorem B (real polynomials): ψ continuous on [0,∞), C¹ on (0,∞), yψ′(y) nondecreasing ⇒ Σψ(|Im z_k|) nonincreasing. Covers y^p for
 *    every p > 0, log(1+y), log(1+y²). Four-zero cross term G(D) = 4[N/(D²+(s−r)²) + M/(D²+(s+r)²)] ≥ 0, G(0) = 8(sψ′(s) − rψ′(r))/(s²−r²).
 *    Pólya's count of non-real zeros is the p → 0 limit, de Bruijn's max-Im bound the p → ∞ limit.
 *  - The count of zeros above a fixed height is not monotone: {±0.9i, 0.001 ± 1.3i} goes from 1 to 2 zeros above height 1 by t = 0.02.
 *  - de Bruijn's Λ ≤ t0 + y_max(t0)²/2 is sharp as a function of y_max alone (isolated pair z² + Y² becomes real at t = Y²/2 exactly).
 *  - Flow-blindness (referee wording): Theorems A, A′, B hold for every complex or real polynomial heat flow, including those with non-real
 *    zeros, so they are forward-only soft inequalities in the SL2 no-go class; this does not rely on finiteness of the sums for H_{−ε}.
 * CERTIFIED: nothing.
 * CONDITIONAL: the H_t (t > 0) transfer of A, A′, B, assuming the zero ODE with principal-value sums (Csordas–Smith–Varga, Rodgers–Tao),
 *  Ki–Kim–Lee finiteness of non-real zeros for t > 0, and isolated collision times; the infinite-dimensional details are not written out.
 * MEASURED: 11 exact polynomial flows (degree 6–10, dps 60): Ky Fan violations ≤ 1.8e-15 (y), 1.1e-14 (x); conservation to 5.7e-14;
 *  real-class Nelder–Mead max normalised d/dt Σ|y|^p = −4p; 20,000 random/stacked configurations per ψ (in-class ψ never violate; arctan,
 *  tanh, sigmoid caps do). Lehmer pair γ = 7005.0629 / 7005.1006 under H_t (Gauss–Hermite convolution of ξ, dps 25, not interval):
 *  collision t_c = −7.1120473e-4 at x = 14010.1634294 (referee: Chebyshev interpolant + exact heat flow, N = 40 and 56; bisection value
 *  −7.112044e-4 within its tolerance; window ODE K = 400 within 1.5e-9); y²/(t_c − t) = 2.00002 … 2.0016, always above 2, as the pair law
 *  −2 − 4y²S (S = 0.608 > 0) predicts.
 * HEURISTIC: no member of the family improves on de Bruijn's bound (moved from proved by the referee: the isolated-pair example shows
 *  sharpness in y_max only); Burgers reading (imaginary parts carry the viscous part, real parts the anti-diffusive density); Theorem B may
 *  be known (no literature search); the exact necessary condition in the conjugate-symmetric class is open.
 *
 * Dissipation (referee-corrected direction): along a real flow the dissipation is AT LEAST the conjugate-pair term (2ψ′(r)/r per pair) plus
 * the real-zero term; the cross terms G(D) ≥ 0 add more. None of this gives a backward-in-time or t = 0 statement.
 *
 * No Λ bound moves. No refereed bound is changed; RH open; NO QED. Import-free. ROUTE_21_ASSERTIONS recompute live: the velocity identity,
 * exact heat flows of small polynomials (Durand–Kerner roots, warm-started) with conservation laws, Ky Fan majorization of y and x, a
 * non-quadratic saddle functional, Theorem B sums for p ∈ {0.25, 0.5, 1, 2, 4}, the G(0) identity, the height-1 count counterexample, the
 * isolated-pair law, and the isolated-pair estimate of the Lehmer-pair collision time.
 */

const { abs, hypot, max, sqrt, cosh } = Math;

export const ROUTE_21 = Object.freeze({
  id: 'route-21-zero-flow-entropy-functionals-2026-10-11',
  route: 21,
  date: '2026-10-11',
  title: 'Route 21: monotone functionals of the zero flow — a full family, flow-blind, no Λ information',
  status: 'done',
  headline: 'The zero flow is dz/dt = L(z) conj(z): imaginary parts diffuse by a graph heat equation (majorization), real parts spread. The '
    + 'monotone additive functionals are exactly the saddle functions (complex case); for real polynomials a log-convex family (Σ|y|^p, every '
    + 'p > 0) runs from Pólya\'s count to de Bruijn\'s max-Im bound. All are forward-only inequalities valid for every polynomial datum, '
    + 'including ones with non-real zeros, so they are flow-blind and give no Λ or zero-location information.',

  theorems: Object.freeze({
    flowForm: 'dz/dt = L(z) conj(z), w_kj = 2/|z_k − z_j|²; dx/dt = Lx, dy/dt = −Ly',
    A: 'y(t2) ≺ y(t1), x(t1) ≺ x(t2) for t1 < t2 (complex polynomials)',
    Aprime: 'Σ F(x_k, y_k) nonincreasing for every flow iff F_xx ≤ 0 ≤ F_yy',
    B: 'Σ ψ(|y_k|) nonincreasing for real polynomials when yψ′(y) is nondecreasing',
    conservation: 'Σz, Σxy constant; Σz² − 2n(n−1)t constant',
  }),
  counterexample: Object.freeze({ config: '{±0.9i, 0.001 ± 1.3i}', countAbove1: Object.freeze([1, 2]), atT: 0.02, initialDyLower: 2.98,
    sigmoidCapRate: Object.freeze({ value: 5.95, capHeight: 1.1 }), softCountIncrease: Object.freeze({ value: 0.81, capHeight: 1 }) }),
  polyMeasured: Object.freeze({ flows: 11, kyFanY: 1.8e-15, kyFanX: 1.1e-14, conservation: 5.7e-14, maxIncrement: 1.8e-15, dissipationIdentity: 2.7e-9,
    nelderMeadMaxRateOverP: -4 }),
  lehmer: Object.freeze({ gamma: Object.freeze([7005.062866175, 7005.100564673]), tcHt: -7.1120473e-4, tcBisection: -7.112044e-4, xc: 14010.1634294,
    tcWindow: Object.freeze([[25, -7.111805e-4], [100, -7.111985e-4], [400, -7.112032e-4]]), S: 0.608,
    ratioCorrected: Object.freeze([[1e-5, 2.0000244], [1e-4, 2.0002439], [6.4e-4, 2.0015616]]), grade: 'measured (dps 25, not interval)' }),

  refereeKilled: Object.freeze([
    'wrong direction: "dissipation is at most the conjugate-partner term plus the real-zero term" — Theorem B proves the cross terms G(D) ≥ 0, so it is AT LEAST that; and 2ψ′(r)/r is per conjugate PAIR, not per zero',
    'mislabelled: "no member of the family improves on de Bruijn" moved from proved to heuristic; proved content is only that t0 + y_max²/2 is sharp as a function of y_max (isolated pair)',
    'flow-blindness argument rested on H_{−ε}, where finiteness of Σ|y|^p is not established; restated via polynomial data (every complex/real polynomial, including non-real zeros)',
    'label mismatch: the +5.95 sigmoid-cap rate is for a cap at height 1.1, not 1; the hard count above height 1 goes 1 → 2 by t = 0.02 (referee integration)',
    'artifact: the low end 1.9996 of y²/(t_c − t) came from a t_c off by ≈ 3.7e-10; with t_c = −7.1120473e-4 the ratio is 2.00002 … 2.0016, always above 2 and increasing',
    'scope: the positive-t "3 sign changes" check covers a 4.4-wide z window only (local statement); H_t values are dps-25 floats, not certified',
  ]),
  nextStep: 'Optional, low priority, not a Λ lever: (1) write out the infinite-dimensional H_t transfer under Ki–Kim–Lee finiteness; (2) settle the '
    + 'exact necessary condition in the conjugate-symmetric class (lattice-cluster bound N/√u + M/√v ≥ 0). Do not re-attempt entropy or Lyapunov '
    + 'functionals of the zero configuration as a Λ or RH route: any forward-monotone functional is flow-blind.',
  files: Object.freeze(['tmp/routes-b6-r21-poly.py', 'tmp/routes-b6-r21-poly.json', 'tmp/routes-b6-r21-psearch.py', 'tmp/routes-b6-r21-logconvex.py',
    'tmp/routes-b6-r21-p01-clamp.py', 'tmp/routes-b6-r21-Ht-lehmer.py', 'tmp/routes-b6-r21-Ht-lehmer.json', 'tmp/routes-b6-ref21-inst.py', 'tmp/routes-b6-ref21-tc.py']),
  verdict: 'Route 21 is closed as a map; no bound moves. The zero flow is a graph heat equation in the imaginary parts; the monotone additive '
    + 'functionals are the saddle functions (complex case) and, for real polynomials, a log-convex family from Pólya\'s count to de Bruijn\'s max-Im '
    + 'bound. These are forward-only soft inequalities that hold for every polynomial heat flow, including ones with non-real zeros (the SL2 '
    + 'flow-blindness class); their dissipation is at least the conjugate-pair plus real-zero terms and gives no backward or t = 0 statement. '
    + 'Nothing interval-certified. No refereed bound is changed; RH open; NO QED.',
});

const R = ROUTE_21;
// complex helpers ([re, im])
const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const mul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const div = (a, b) => { const d = b[0] * b[0] + b[1] * b[1]; return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]; };
const fromRoots = (rs) => { let c = [[1, 0]]; for (const r of rs) { const n = c.map(() => [0, 0]); n.push([0, 0]);
  for (let i = 0; i < c.length; i += 1) { n[i + 1] = add(n[i + 1], c[i]); n[i] = sub(n[i], mul(r, c[i])); } c = n; } return c; };
const der = (c) => c.slice(1).map((v, i) => [v[0] * (i + 1), v[1] * (i + 1)]);
// exact heat flow exp(−t D²) on coefficients
const heat = (c, t) => { const out = c.map((v) => [v[0], v[1]]); let d = c; let f = 1;
  for (let k = 1; 2 * k < c.length; k += 1) { d = der(der(d)); f *= -t / k; for (let i = 0; i < d.length; i += 1) out[i] = add(out[i], [d[i][0] * f, d[i][1] * f]); }
  return out; };
const ev = (c, z) => { let s = [0, 0]; for (let i = c.length - 1; i >= 0; i -= 1) s = add(mul(s, z), c[i]); return s; };
const dk = (c, init, it = 3000) => { let z = init.map((v) => [v[0], v[1]]); const lead = c[c.length - 1];
  for (let k = 0; k < it; k += 1) { let mx = 0; z = z.map((zi, i) => { let den = lead; z.forEach((zj, j) => { if (j !== i) den = mul(den, sub(zi, zj)); });
    const dz = div(ev(c, zi), den); mx = max(mx, hypot(dz[0], dz[1])); return sub(zi, dz); }); if (mx < 1e-15) break; } return z; };
const track = (r0, ts) => { const c0 = fromRoots(r0); let z = r0; const out = []; let tp = 0;
  for (const t of ts) { const n = max(1, Math.ceil((t - tp) / 0.002)); for (let s = 1; s <= n; s += 1) z = dk(heat(c0, tp + ((t - tp) * s) / n), z); tp = t; out.push(z); }
  return out; };
const velocity = (z, k) => { let s = [0, 0]; z.forEach((w, j) => { if (j !== k) s = add(s, div([2, 0], sub(z[k], w))); }); return s; };
const partial = (v) => { const s = [...v].sort((a, b) => b - a); let acc = 0; return s.map((x) => { acc += x; return acc; }); };

const CX = [[0.3, 0.8], [-0.5, 0.2], [1.1, -0.4], [-0.9, -0.7], [0.1, 1.5], [0.6, -1.1]]; // complex polynomial, no symmetry
const RC = [[0, 0.9], [0, -0.9], [0.001, 1.3], [0.001, -1.3], [0.5, 0], [-0.7, 0], [0.2, 0.4], [0.2, -0.4]]; // real polynomial
let cache = null;
const flows = () => { if (!cache) cache = { tc: [0, 0.05, 0.1, 0.2], zc: track(CX, [0, 0.05, 0.1, 0.2]), tr: [0, 0.01, 0.02, 0.03, 0.04, 0.05],
  zr: track(RC, [0, 0.01, 0.02, 0.03, 0.04, 0.05]) }; return cache; };

export const ROUTE_21_ASSERTIONS = Object.freeze([
  {
    id: 'r21-velocity-identity',
    holds: () => { let worst = 0; for (let k = 0; k < CX.length; k += 1) { const v = velocity(CX, k); let lx = 0; let ly = 0;
      CX.forEach((w, j) => { if (j === k) return; const wkj = 2 / ((CX[k][0] - w[0]) ** 2 + (CX[k][1] - w[1]) ** 2); lx += wkj * (CX[k][0] - w[0]); ly -= wkj * (CX[k][1] - w[1]); });
      worst = max(worst, abs(v[0] - lx), abs(v[1] - ly)); } return worst < 1e-12; },
    why: '2/(z_k − z_j) = w_kj (conj z_k − conj z_j) with w_kj = 2/|z_k − z_j|²: dx/dt = +Lx, dy/dt = −Ly (graph heat equation in y).',
  },
  {
    id: 'r21-conservation-laws',
    holds: () => { const { tc, zc } = flows(); const n = CX.length; const s0 = zc[0].reduce(add, [0, 0]); const q0 = zc[0].reduce((a, b) => add(a, mul(b, b)), [0, 0]);
      return zc.every((z, i) => { const s = z.reduce(add, [0, 0]); const q = z.reduce((a, b) => add(a, mul(b, b)), [0, 0]);
        return abs(s[0] - s0[0]) < 1e-10 && abs(s[1] - s0[1]) < 1e-10 && abs(q[0] - 2 * n * (n - 1) * tc[i] - q0[0]) < 1e-9 && abs(q[1] - q0[1]) < 1e-9; }); },
    why: 'Exact heat flow exp(−tD²) of a degree-6 complex polynomial (roots by warm-started Durand–Kerner): Σz constant, Σxy = Im Σz²/2 constant, Re Σz² grows by 2n(n−1)t = 60t.',
  },
  {
    id: 'r21-theorem-a-majorization',
    holds: () => { const { zc } = flows(); for (let i = 0; i + 1 < zc.length; i += 1) {
      const a = partial(zc[i].map((z) => z[1])); const b = partial(zc[i + 1].map((z) => z[1])); const ax = partial(zc[i].map((z) => z[0])); const bx = partial(zc[i + 1].map((z) => z[0]));
      if (b.some((v, k) => v > a[k] + 1e-12) || ax.some((v, k) => v > bx[k] + 1e-12) || abs(a[a.length - 1] - b[b.length - 1]) > 1e-10) return false; }
      return true; },
    why: 'Ky Fan partial sums: y(t2) ≺ y(t1) and x(t1) ≺ x(t2) at t = 0, 0.05, 0.1, 0.2 (complex polynomial, no conjugate symmetry).',
  },
  {
    id: 'r21-theorem-a-prime-saddle',
    holds: () => { const { zc } = flows(); const F = (z) => z.reduce((a, w) => a + cosh(w[1]) - cosh(w[0]), 0); const X2 = (z) => z.reduce((a, w) => a + w[0] * w[0], 0);
      return zc.every((z, i) => i === 0 || (F(z) <= F(zc[i - 1]) + 1e-12 && X2(z) > X2(zc[i - 1]))); },
    why: 'F = cosh y − cosh x (F_xx ≤ 0 ≤ F_yy, not fixed by the conservation laws) never increases; Σx² (F_xx > 0) increases.',
  },
  {
    id: 'r21-theorem-b-log-convex-family',
    holds: () => { const { zr } = flows(); const S = (z, p) => z.reduce((a, w) => a + (abs(w[1]) < 1e-7 ? 0 : abs(w[1]) ** p), 0);
      const cnt = (z) => z.filter((w) => abs(w[1]) > 1e-6).length;
      return [0.25, 0.5, 1, 2, 4].every((p) => zr.every((z, i) => i === 0 || S(z, p) <= S(zr[i - 1], p) + 1e-12))
        && zr.every((z, i) => i === 0 || cnt(z) <= cnt(zr[i - 1])); },
    why: 'Real degree-8 polynomial {±0.9i, 0.001 ± 1.3i, 0.5, −0.7, 0.2 ± 0.4i}: Σ|y|^p nonincreasing for p = 0.25, 0.5, 1, 2, 4 and the Pólya count of non-real zeros never increases on t ∈ [0, 0.05].',
  },
  {
    id: 'r21-four-zero-term',
    holds: () => { let ok = true; for (const p of [0.1, 0.5, 1, 2]) for (const [r, s] of [[0.2, 0.9], [0.5, 0.6], [1, 3]]) {
      const dp = (y) => p * y ** (p - 1); const N = (s - r) * (dp(s) - dp(r)); const M = (s + r) * (dp(s) + dp(r));
      const G = (D) => 4 * (N / (D * D + (s - r) ** 2) + M / (D * D + (s + r) ** 2)); const G0 = (8 * (s * dp(s) - r * dp(r))) / (s * s - r * r);
      ok = ok && abs(G(0) - G0) < 1e-9 * abs(G0) && [0, 0.1, 0.5, 2, 10].every((D) => G(D) >= 0); } return ok; },
    why: 'G(0) = 4[N/(s−r)² + M/(s+r)²] = 8(sψ′(s) − rψ′(r))/(s² − r²) and G(D) ≥ 0 for ψ = y^p (yψ′ = p y^p nondecreasing).',
  },
  {
    id: 'r21-height-count-not-monotone',
    holds: () => { const ce = [[0, 0.9], [0, -0.9], [0.001, 1.3], [0.001, -1.3]]; const z = track(ce, [0, 0.02]);
      return z[0].filter((w) => w[1] > 1).length === 1 && z[1].filter((w) => w[1] > 1).length === 2 && abs(velocity(ce, 0)[1] - R.counterexample.initialDyLower) < 0.01; },
    why: '{±0.9i, 0.001 ± 1.3i}: one zero above height 1 at t = 0, two at t = 0.02 (≈ 1.036i and 1.090i); initial dy/dt of the lower zero = +2.98.',
  },
  {
    id: 'r21-isolated-pair-law',
    holds: () => [0.3, 0.7, 1].every((Y) => { const c = heat(fromRoots([[0, Y], [0, -Y]]), (Y * Y) / 2); return abs(c[0][0]) < 1e-14 && abs(c[1][0]) < 1e-14; }),
    why: 'z² + Y² under exp(−tD²) is z² + Y² − 2t: a double real zero at t = Y²/2 exactly, so t0 + y_max²/2 is sharp in y_max alone.',
  },
  {
    id: 'r21-lehmer-pair-scale',
    holds: () => { const d0 = 2 * (R.lehmer.gamma[1] - R.lehmer.gamma[0]); const iso = (d0 * d0) / 8; const L = R.lehmer;
      return abs(-L.tcHt / iso - 1) < 2e-3 && abs(L.tcBisection - L.tcHt) < 1e-9 && abs(L.tcWindow[2][1] - L.tcHt) < 1.6e-9
        && L.ratioCorrected.every(([, r], i, a) => r > 2 && (i === 0 || r > a[i - 1][1])) && L.S > 0; },
    why: 'Isolated-pair collision time d0²/8 = 7.1059e-4 (d0 = 2·0.0376985) is within 0.09% of the measured H_t value 7.1120473e-4; bisection and K = 400 window values agree to ≤ 1.5e-9; corrected y²/(t_c − t) is > 2 and increasing (pair law with S > 0).',
  },
  {
    id: 'r21-honest-scope',
    holds: () => R.status === 'done' && /flow-blindness/.test(R.verdict) && /refereed bound is changed/i.test(R.verdict) && /NO QED/.test(R.verdict)
      && /no bound moves/.test(R.verdict) && /at least/.test(R.verdict) && R.refereeKilled.length === 6,
    why: 'Forward-only soft inequalities (SL2 class); dissipation direction corrected; no Λ change; no QED.',
  },
]);

export default ROUTE_21;
