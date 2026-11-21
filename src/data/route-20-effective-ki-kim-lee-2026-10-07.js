/**
 * @fileoverview route-20-effective-ki-kim-lee-2026-10-07 — roadmap route 20 (batch 2): an explicit, Arb-certified threshold
 * x0(t) beyond which all zeros of H_t are real and simple. One run plus one adversarial internal referee pass (not refuted,
 * minor); the referee corrections are applied below.
 *
 * Outcome: for every t ∈ [t_lo, 1/2], all zeros of H_t with Re z ≥ x0(t_lo) + SP (SP < 0.47) are real and simple — conditional on
 * Polymath15 Theorem 1.3 and de Bruijn's theorem (cited, not re-proved). Referee correction: this is an explicit-constant version
 * of Polymath15 Theorem Zero(i) (x ≥ exp(C/t), C unspecified), not a new shape; the new content is the constant
 * (t·log(x0/4π) ≈ 5.31–5.76 on [0.1, 0.2]) and its Arb certificate. At X = 6e12 it covers only t ≥ 0.217, so it cannot replace
 * any verified-height input.
 *
 * PROVED (analytic, conditional on Polymath15 Thm 1.3 + de Bruijn Thm 13; internal referee re-derived it):
 *  - Block lemma: on a block [a, b] with arg B_t dropping by Kπ, alternating real samples G(x_k) ≥ 2(1 − δ_B) − e > 0 and Re G > 0 on
 *    the upper path give exactly K zeros in [a, b] × [−1, 1], all real and simple (sign changes + argument principle + conjugate
 *    symmetry; de Bruijn keeps zeros in |Im z| ≤ √(1 − 2t) < 1).
 *  - Explicit γ / φ log-derivative bounds; sample spacing ≤ 2π/(L/2 − c1) = 4π/(L − 2c1) (referee correction: ≈ 0.44–0.47 at
 *    L0 ≈ 26.9–28.8, 0.24 at L0 = 53.1 — not "about 0.9").
 *  - Reduction to finitely many checks (monotone in L at fixed v = yL/2; gates M1–M4; log-convex tail bound) covering all t ∈ [t_lo, 1/2].
 *  - Structural: an explicit KKL statement only feeds the canopy hypothesis (ii) of Polymath15 Theorem ubc-0 for x ≥ x0(t0), never the
 *    RH-verification hypothesis (i), since x0(t) → ∞ as t → 0.
 * CERTIFIED (Arb ball arithmetic, 128 bit; referee re-ran with python-flint 0.9.0): x0(t_lo) for t_lo = 0.10 … 0.20 (1.461e24 … 4.065e13);
 *  at X: t_lo = 0.217 with x0 = 5.99966e12, real-axis margin ≥ 0.0185. Minimum Re G lower bound 3.3e-7 … 5.6e-5; error total e ≤ 7.3e-8
 *  (with the conservative 10.50 for e_C0). Negative controls fail as intended (t = 0.2 at L0 = 28.76: −0.0097; at X: −0.647).
 * CONDITIONAL: Polymath15 Theorem 1.3 (arXiv:1904.12438v2) bounds and de Bruijn Theorem 13, cited; internal referee only; no Lean.
 * MEASURED: the binding condition is the real-axis one D(1/2) < 1 − e/2 with D = Σ_{2≤n≤N} n^{−1/2 − (t/4)(L − log n)}. Referee
 *  correction: the vertical-edge minimum sits at small v > 0 (v ≈ 0.016 at t = 0.2, ≈ 0.06 at t*), 0.4–1.5% below the v = 0 value; the
 *  certificate checks the whole edge, so only the prose changes. Exact-sum limits of the method (referee, float): L = 28.7866 (x ≈ 3.99e13)
 *  at t = 0.2, L = 36.9958 (1.47e17) at t = 0.15, L = 53.066 (1.40e24) at t = 0.1; t* = 0.21634 at X — the certified rows are within
 *  0.02–0.05 in L of this limit, so the triangle-inequality method cannot do materially better.
 * HEURISTIC: an Euler-mollified |F_B| floor (P = {2,3,5,7}) would cross at t ≈ 0.176 at X — parity with the internal ≈ 0.1758 figure, not a
 *  gain, and it needs unproved lemmas. Under RH every zero of H_t is real for t ≥ 0; x0(t) measures the technique.
 *
 * PT Λ ≤ 0.2 is the accepted benchmark; RH open; NO QED. Import-free. ROUTE_20_ASSERTIONS recompute live (float64, ≈ 50 ms): the
 * D-sum at X (≈ 1.3214, fails), at the t = 0.2 certified row (margin ≈ 0.005) and at the exact-sum limit (≈ 1), the t* row margin,
 * N = 690988 at X, t·L0 ∈ [5.30, 5.77] for every row, monotonicity of x0(t) and the spacing bound SP < 0.47.
 */

const X = 6e12;
const FOUR_PI = 4 * Math.PI;

export const ROUTE_20 = Object.freeze({
  id: 'route-20-effective-ki-kim-lee-2026-10-07',
  route: 20,
  date: '2026-10-07',
  title: 'Route 20: explicit Arb-certified Ki–Kim–Lee threshold x0(t) ≈ 4π·exp(c/t), c ≈ 5.3–5.8; at X = 6e12 only t ≥ 0.217',
  status: 'done',
  headline: 'An explicit-constant version of Polymath15 Theorem Zero(i) is Arb-certified: for every t ∈ [t_lo, 1/2], all zeros of H_t with Re z ≥ x0(t_lo) + 0.47 '
    + 'are real and simple, conditional on Polymath15 Theorem 1.3 and de Bruijn\'s theorem (x0 = 4.07e13 for t ≥ 0.20, 1.50e17 for t ≥ 0.15, 1.46e24 '
    + 'for t ≥ 0.10). At the verified height X = 6e12 it covers only t ≥ 0.217, so it replaces no verified-height input.',

  rows: Object.freeze([ // certified: t_lo, x0 (all t ∈ [t_lo, 1/2], zeros with Re z ≥ x0 + SP real and simple)
    [0.10, 1.461e24], [0.11, 1.848e22], [0.12, 4.827e20], [0.13, 2.186e19], [0.14, 1.529e18], [0.15, 1.502e17],
    [0.16, 1.963e16], [0.17, 3.229e15], [0.18, 6.423e14], [0.19, 1.507e14], [0.20, 4.065e13],
  ].map(([t, x0]) => Object.freeze({ t, x0 }))),
  tStarRow: Object.freeze({ t: 0.217, x0: 5.99966e12, realAxisMargin: 0.0185 }),
  certStats: Object.freeze({ minReGLo: 3.3e-7, minReGHi: 5.6e-5, errorTotalMax: 7.3e-8, eC0Constant: 10.50, eC0Paper: 10.44, precisionBits: 128 }),
  negativeControls: Object.freeze([Object.freeze({ t: 0.20, L0: 28.76, margin: -0.0097 }), Object.freeze({ t: 0.20, x: 6e12, margin: -0.647 })]),
  exactSumLimits: Object.freeze([Object.freeze({ t: 0.2, L: 28.7866 }), Object.freeze({ t: 0.15, L: 36.9958 }), Object.freeze({ t: 0.1, L: 53.066 })]),
  tStarExactLimit: 0.21634,
  verticalEdgeMin: Object.freeze({ t02: Object.freeze({ v: 0.016, atMin: 0.004959, atZero: 0.004978 }), tStar: Object.freeze({ v: 0.06, atMin: 0.02024, atZero: 0.02054 }) }),
  heuristicMollifierCrossing: 0.176,
  ptBenchmark: 0.2,

  refereeKilled: Object.freeze([
    'prior art missing: Polymath15 Theorem Zero(i) already gives x ≥ exp(C/t) ⇒ real zeros (C unspecified); the exp(c/t) shape is known, only the explicit constant and certificate are new',
    'sample-point spacing "about 0.9" — the proof\'s own bound is 4π/(L − 2c1) ≈ 0.44–0.47 (safe side); coverage reads Re z ≥ x0 + SP, SP < 0.47',
    '"binding point is v = 0" — the vertical-edge minimum is at small v > 0, 0.4–1.5% lower (certificate unaffected)',
    'conditionality (Polymath15 Thm 1.3, de Bruijn) must sit next to the numbers, not only in the conditional section',
    '/tmp/s145venv is broken; certify.py re-run with python3.14 + tmp/routes-b2-r6-pylib (python-flint 0.9.0)',
  ]),
  nextStep: '(1) Independent referee on the block lemma, the γ/φ bounds and gates M1–M4 in tmp/routes-b2-r20-kkl/certify.py; then feed the x0(t) curve into '
    + 'route 50 as its verification-free baseline. (2) Treat route 20 as closed as a way to reduce verified height. (3) Only for parity: a Φ = F_B block '
    + 'lemma (second-order vertical-edge drift, jumps in N) plus a small-y0 barrier at t0 ≈ 0.176.',
  files: Object.freeze(['tmp/routes-b2-r20-kkl/certify.py', 'tmp/routes-b2-r20-kkl/summary.json', 'tmp/routes-b2-r20-kkl/out_t0.20.json',
    'tmp/routes-b2-r20-kkl/out_tstar_6e12.json', 'tmp/routes-b2-r20-kkl/out_neg_t0.20_6e12.json', 'tmp/routes-b2-ref20-exact.py', 'tmp/routes-b2-ref20-htcheck.py']),
  verdict: 'Ki–Kim–Lee with explicit constants (an explicit version of Polymath15 Theorem Zero(i)) is Arb-certified on [0.1, 0.2]: x0(t) ≈ 4π·exp(c/t), '
    + 'c ≈ 5.3–5.8, conditional on Polymath15 Theorem 1.3 and de Bruijn\'s theorem. It does not replace verified height: it can only stand in for the far '
    + 'part of the canopy hypothesis (ii), never hypothesis (i); at X = 6e12 it covers only t ≥ 0.217 (Λ ≤ 0.217 + y0²/2, weaker than PT). A verification-free '
    + 'route would need ≈ 6.8X for Λ ≤ 0.2. Internal referee only. No refereed bound is changed; RH open; NO QED.',
});

const R = ROUTE_20;
const Nof = (t, x) => Math.floor(Math.sqrt(x / FOUR_PI + t / 16));
// Real-axis triangle-inequality sum D = Σ_{2≤n≤N} n^{−1/2 − (t/4)(L − log n)}, L = log(x/4π) (Polymath15 F_B moduli at y = 0).
const Dsum = (t, x) => { const L = Math.log(x / FOUR_PI); let s = 0; for (let n = Nof(t, x); n >= 2; n--) { const ln = Math.log(n); s += Math.exp(-(0.5 + (t / 4) * (L - ln)) * ln); } return s; };

export const ROUTE_20_ASSERTIONS = Object.freeze([
  {
    id: 'r20-N-at-X',
    holds: () => Nof(0.2, X) === 690988,
    why: 'N = ⌊√(x/4π + t/16)⌋ = 690988 at X = 6e12 (the same N as the stored-sum producer at PT height).',
  },
  {
    id: 'r20-D-fails-at-X',
    holds: () => { const D = Dsum(0.2, X); return D > 1.32 && D < 1.323 && 2 * (1 - D) < -0.64 && 2 * (1 - D) > -0.65; },
    why: 'At X and t = 0.2 the triangle-inequality sum is ≈ 1.3214 > 1 (real-axis margin ≈ −0.643; negative control −0.647 after e and η).',
  },
  {
    id: 'r20-D-certified-row-and-limit',
    holds: () => { const r = R.rows.find((x) => x.t === 0.2); const m = 2 * (1 - Dsum(0.2, r.x0));
      const lim = Dsum(0.2, FOUR_PI * Math.exp(R.exactSumLimits[0].L));
      return m > 0.0044 && m < 0.0057 && Math.abs(lim - 1) < 1e-4 && Math.log(r.x0 / FOUR_PI) - R.exactSumLimits[0].L > 0.01
        && Math.log(r.x0 / FOUR_PI) - R.exactSumLimits[0].L < 0.05; },
    why: 'At x0(0.20) = 4.065e13 the exact real-axis margin 2(1 − D) ≈ 0.0050; D = 1 at L = 28.7866, 0.018 in L below the certified row.',
  },
  {
    id: 'r20-tstar-row',
    holds: () => { const m = 2 * (1 - Dsum(R.tStarRow.t, R.tStarRow.x0)); const lim = Dsum(R.tStarExactLimit, X);
      return m > R.tStarRow.realAxisMargin && m < 0.021 && Math.abs(lim - 1) < 2e-4 && R.tStarRow.x0 < X && R.tStarRow.t > R.ptBenchmark; },
    why: 'At X the certified row t = 0.217 has exact margin ≈ 0.0205 (≥ the certified 0.0185 after e); D = 1 at t* ≈ 0.21634; 0.217 > 0.2, so no gain on PT.',
  },
  {
    id: 'r20-tL0-band',
    holds: () => R.rows.every(({ t, x0 }) => { const c = t * Math.log(x0 / FOUR_PI); return c > 5.30 && c < 5.77; })
      && R.rows.every((r, i) => i === 0 || (r.t > R.rows[i - 1].t && r.x0 < R.rows[i - 1].x0)),
    why: 't·log(x0/4π) ∈ [5.31, 5.76] on every certified row (x0 ≈ 4π·exp(c/t)), and x0 decreases as t_lo increases.',
  },
  {
    id: 'r20-spacing',
    holds: () => [R.tStarRow.x0, ...R.rows.map((r) => r.x0)].every((x) => FOUR_PI / (Math.log(x / FOUR_PI) - 0.01) < 0.47)
      && FOUR_PI / Math.log(1.461e24 / FOUR_PI) < 0.25,
    why: 'Referee correction: sample spacing 4π/(L − 2c1) < 0.47 on every row (≈ 0.24 at t = 0.1), not ≈ 0.9.',
  },
  {
    id: 'r20-controls-and-edge',
    holds: () => R.negativeControls.every((c) => c.margin < 0) && R.certStats.minReGLo > 0 && R.certStats.eC0Constant > R.certStats.eC0Paper
      && ['t02', 'tStar'].every((k) => { const e = R.verticalEdgeMin[k]; return e.v > 0 && e.atMin < e.atZero && (e.atZero - e.atMin) / e.atZero < 0.016; }),
    why: 'Negative controls fail as intended; every certified Re G bound is positive; e_C0 uses 10.50 ≥ 10.44; the edge minimum is at v > 0 but < 1.6% below v = 0.',
  },
  {
    id: 'r20-honest-scope',
    holds: () => R.status === 'done' && /Theorem Zero\(i\)/.test(R.verdict) && /conditional on Polymath15 Theorem 1\.3/.test(R.verdict)
      && /does not replace verified height/.test(R.verdict) && /refereed bound is changed/i.test(R.verdict) && /NO QED/.test(R.verdict)
      && R.heuristicMollifierCrossing < R.ptBenchmark,
    why: 'Prior art attributed; conditionality stated with the numbers; no verified-height replacement; no QED.',
  },
]);

export default ROUTE_20;
