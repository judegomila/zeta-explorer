/**
 * @fileoverview route-13-lacunary-muntz-cones-2026-10-09 — roadmap route 13 (batch 4): Weil positivity on lacunary (Müntz-incomplete)
 * cones C_Λ = {g*g̃ : g ∈ span e^{−νt}1_{t>0}, ν ∈ Λ}, the one loophole NS-RIGID leaves inside the native span (imp-95530, its A6 remark).
 * One run plus one adversarial internal referee pass (not refuted, minor); the referee corrections are applied below.
 *
 * Outcome: for Λ_4 = {4^k : k ≥ 0} the infinite normalised Pick operator of ξ satisfies M ≥ 3.6346e-4·I (Arb, reproduced bit for bit
 * by the referee), so Weil positivity on C_{Λ_4} is an unconditional certified theorem. On SEPARATED lacunary lattices the A6 loophole
 * carries no zero information beyond the verified height (Λ_4: horizon 80 in a double-zero → quadruple model, under stated conditions;
 * other lattices measured). Near the Müntz threshold (non-separated Blaschke sets, e.g. ν_k = k^p, p ≲ 1.13) the question is OPEN at the
 * heuristic level: the resolution law allows horizons beyond 3e12, margins tend to 0, and the reduction to the RES-T pointwise wall is
 * an analogy, not a theorem.
 *
 * PROVED (project-internal, standard tools):
 *  - LAC-EQ: W(Λ) ⇔ a Carathéodory G on Re w > 0 interpolates c(ν) = ξ′/ξ(1/2 + ν) on Λ ⇔ Stieltjes interpolation in x = ν²
 *    (Nevanlinna–Pick + normal families; P_S ≥ 0 for every finite S via PICK-WEIL). For Blaschke (lacunary, Σ1/ν < ∞) Λ the problem is
 *    indeterminate — A6 made precise. Referee correction: "complete discrete Λ forces G = c, hence RH" is CONDITIONAL on a bounded-type
 *    lemma for ξ′/ξ(1/2 + w) in Re w > 0 (A5 as written uses the identity theorem on the whole interval (1, ∞)).
 *  - LAC-OPEN (Schur perturbation), LAC-SENS (horizontal displacement changes the data by ≤ δ²·sup|g_γ″| ≤ 2.914 δ²/γ³), the Toeplitz
 *    tail lemma for geometric lattices (Poisson symbol (π/h)Σ sech(π(θ + 2πn)/h), ψ bounds, |ζ′/ζ(s)| ≤ 2^{1−s} for s ≥ 10, monotone c
 *    by log-convexity), IMS localisation λ_min(M) ≥ min(λ_H, λ_T) − ‖R‖_Schur.
 * CERTIFIED (arb/FLINT; referee re-ran cert_q4.py 4 60 400 160 6e-4 and reproduced every line): λ_min(M_∞(Λ_4)) ≥ 3.6346e-4 =
 *  head M_[0,400] ≥ 6.12e-4 (float Cholesky + interval residual 5.59e-46) − IMS ‖R‖ ≤ 2.4854e-4; tail (k ≥ 60) λ_T ≥ 0.014671 − 8.311e-4
 *  = 0.013840. Benign non-interval inputs: symbol minimum at θ = π (classical, dn/theta form), slope sup attained at k = a = 60 (checked:
 *  0.00844982), omitted-entry tail beyond m = 2000 (≈ e^{−1386}).
 * CONDITIONAL: horizon corollary for Λ_4 — in the model where a projected double zero on the line is replaced by an off-line quadruple
 *  at the same ordinate, W(Λ_4) is insensitive above T = 80 (2ε(80)S = 3.07e-4 < 3.6346e-4). Rests on float constants S = 5.109 and B(γ),
 *  and on a heuristic Riemann–von Mangoldt boundary term 2R(T)B(T); the physical merger of adjacent pairs (vertical second-order terms,
 *  comparable at gaps ≈ 2.5 near γ = 80) is NOT covered. Same scheme for any separated lacunary cone with a certified margin η
 *  (q = 2: η = 3.9e-9 measured, horizon ≈ 1e4).
 * MEASURED: infinite-lattice λ_min 3.8899e-9 (2^k), 8.265e-12 (0.55·2^k), 1.06e-21 (2^{k/2}), 6.7178e-4 (4^k; referee 6.71782009e-4);
 *  positivity is a real shape constraint (monotone/concave data give λ_min ≈ −0.08 … −0.22); detection horizons on 2^{k/m}: none, 23.0,
 *  31.7, 39.3, 60.1 (m = 1, 2, 3, 4, 6), T·h ≈ 7 — lower bounds that depend on working precision; Δ_S band [1.35, 4.6] over 87 cases
 *  (rows with d* = 0.0 are precision-marginal). Flow: ε_0(q = 4) ≈ 364 (margin ≈ 1e-6 at ε = 100); ε_0(q = 2) = 52.8 is
 *  quadrature-limited (φ_ε relative error 3.6e-9 ≫ margins 1e-10 … 1e-13), not robust. Xi_10: one non-real zero located
 *  (z = 146.89508 + 2.4793098i); more inferred from the sign-change deficit (21 → 6 on [0, 160]).
 * HEURISTIC: resolution law Δ_Λ(γ) = 1/Σ 2ν/(ν² + γ²) ~ 1 for detection; horizon T_p ~ (2.2·C_p)^{p/(p−1)} for ν_k = k^p (≈ 1e8 at
 *  p = 1.2, crosses 3e12 near p ≈ 1.13); reaching the verified height with geometric lattices needs h ~ 1e-11 and margins ~ e^{−π²/h}.
 *
 * No refereed bound is changed; no bound changes; RH open; NO QED. Import-free. ROUTE_13_ASSERTIONS recompute the Poisson symbol minimum, the
 * tail and IMS arithmetic, max|G″|, the horizon inequality, the T·h ≈ 7 scaling and the Blaschke/Müntz sums live.
 */

const sech = (x) => 1 / Math.cosh(x);
const symbolPoisson = (theta, h) => { let s = 0; for (let n = -8; n <= 8; n += 1) s += sech((Math.PI * (theta + 2 * Math.PI * n)) / h); return (Math.PI / h) * s; };
const symbolDirect = (theta, h) => { let s = 0.5; for (let m = 1; m <= 400; m += 1) s += 2 * Math.cos(m * theta) / (2 * Math.cosh((m * h) / 2)); return s; };
const G2 = (u) => (4 * u * (u * u - 3)) / (1 + u * u) ** 3; // second derivative of G(u) = 2u/(1 + u²)

export const ROUTE_13 = Object.freeze({
  id: 'route-13-lacunary-muntz-cones-2026-10-09',
  route: 13,
  date: '2026-10-09',
  title: 'Route 13: Weil positivity on the lacunary cone {4^k} is certified; no zero information on separated lattices; near-threshold regime open (heuristic)',
  status: 'done',
  headline: 'For Λ = {4^k} the infinite normalised Pick operator of ξ is ≥ 3.6346e-4 (Arb, referee reproduced), so Weil positivity on that Müntz-incomplete '
    + 'cone is an unconditional certified theorem. On separated lacunary lattices it sees no zero above a finite horizon (80 for 4^k in a double-zero model, '
    + 'under stated conditions; T·h ≈ 7 measured for 2^{k/m}), so the A6 loophole adds nothing there. For non-separated Blaschke sets near the Müntz threshold '
    + 'the question stays open at the heuristic level.',

  lac4: Object.freeze({
    q: 4, a: 60, b: 400, head: 6.12e-4, residual: 5.59e-46, slopeL: 0.0084498, twoMinSymbol: 0.014671, Enorm: 8.311e-4, lambdaT: 0.013840, imsR: 2.4854e-4,
    lambdaMin: 3.6346e-4, symbolMinReferee: 0.0073355369, floatLambdaInf: 6.71782009e-4,
  }),
  horizon: Object.freeze({ T: 80, eps80: 3.0e-5, schurS: 5.109, schurSReferee: 5.10934, maxG2: 2.9142, q2Eta: 3.9e-9, q2Horizon: 1e4 }),
  latticeLambdaMin: Object.freeze({ '2^k': 3.8899e-9, '0.55*2^k': 8.265e-12, '2^{k/2}': 1.06e-21, '4^k': 6.7178e-4 }),
  detection: Object.freeze({ m: Object.freeze([2, 3, 4, 6]), height: Object.freeze([23.0, 31.7, 39.3, 60.1]), deltaSBand: Object.freeze([1.35, 4.6]), cases: 87 }),
  flow: Object.freeze({ eps0q2: 52.8, eps0q4: 364.0, q2Grade: 'quadrature-limited, not robust', q4Grade: 'measured', xi10Zero: '146.89508 + 2.4793098i', realZeros: Object.freeze({ 0: 21, 1: 21, 10: 6, 100: 2 }) }),

  refereeKilled: Object.freeze([
    'LAC-EQ "complete Λ forces G = c, i.e. RH" — for a discrete Müntz-complete Λ this needs a bounded-type lemma for ξ′/ξ(1/2 + w); conditional (A5 uses the whole interval)',
    'verdict "the loophole is closed as a source of new zero information" — closed for separated/geometric lattices only; near the Müntz threshold horizons > 3e12 are not excluded and the RES-T reduction is an analogy',
    'horizon-80 corollary "conditional only on S and B(γ)" — it is a double-zero → quadruple model; the adjacent-pair merger (vertical terms) is not covered and the 2R(T)B(T) boundary term is heuristic',
    '"implies no density statement" — shown only inside the double-zero perturbation model for Λ_4 and separated lattices',
    'ε_0 = 52.8 (q = 2) as robust — quadrature error 3.6e-9 exceeds the 1e-10 … 1e-13 margins near threshold',
    '"Xi_10 has many low off-line zeros" — one located; the rest inferred from a sign-change deficit',
    'LAC-4 non-interval steps beyond the symbol minimum (slope sup at k = 60, tail beyond m = 2000) — benign, now listed',
    'detection rows with d* = 0.0 at 150 digits — at the noise floor (min pivot² 5.25e-125 vs 7.78e-125 at 400 digits); horizons are precision-dependent lower bounds',
  ]),
  nextStep: '(1) Interval-certify S and B(γ) and replace the double-zero model by the adjacent-pair merger (with the vertical term) to make the Λ_4 horizon a '
    + 'theorem. (2) Prove (or refute) the bounded-type lemma for ξ′/ξ(1/2 + w) that would make the complete-discrete-Λ ⇒ RH contrast rigorous. (3) The only '
    + 'regime that could carry new zero information: test the Δ_S law on ν_k = k^p (p = 1.1–1.25, K ≥ 200, ≥ 300 digits). Cross-reference A6 in imp-95530.',
  files: Object.freeze(['tmp/routes-b4-13-lacunary/cert_q4.py', 'tmp/routes-b4-13-lacunary/cert_q4_a60_b400.out', 'tmp/routes-b4-13-lacunary/results.json',
    'tmp/routes-b4-13-lacunary/sens.py', 'tmp/routes-b4-13-lacunary/t6_reslaw.py', 'tmp/routes-b4-13-lacunary/t7_flow.py', 'tmp/routes-b4-ref-13-indep.py',
    'tmp/routes-b4-ref-13-prec.py', 'tmp/routes-b4-ref-13-cert-rerun.out']),
  verdict: 'Lacunary Weil positivity is Carathéodory/Stieltjes interpolation of ξ′/ξ on a Blaschke node set (indeterminate, A6 made precise). For Λ = {4^k} it is a '
    + 'certified unconditional theorem (λ_min ≥ 3.6346e-4), with a finite horizon (80 in the double-zero model, conditional on float constants and a heuristic '
    + 'boundary term), and it survives the backward flow (ε_0 ≈ 364 for q = 4), i.e. it is soft in the SL2 sense. On separated lattices the loophole carries no '
    + 'zero information beyond the verified height; near the Müntz threshold it is open (heuristic). No bound changes. No refereed bound is changed; RH open; NO QED.',
});

const R = ROUTE_13;

export const ROUTE_13_ASSERTIONS = Object.freeze([
  {
    id: 'r13-poisson-symbol',
    holds: () => { const h = Math.log(4); const grid = Array.from({ length: 201 }, (_, i) => (2 * Math.PI * i) / 200);
      const vals = grid.map((t) => symbolPoisson(t, h)); const mn = Math.min(...vals); const at = grid[vals.indexOf(mn)];
      return Math.abs(symbolPoisson(Math.PI, h) - symbolDirect(Math.PI, h)) < 1e-12 && Math.abs(at - Math.PI) < 1e-9
        && Math.abs(symbolPoisson(Math.PI, h) - R.lac4.symbolMinReferee) < 1e-9 && Math.abs(2 * mn - R.lac4.twoMinSymbol) < 1e-6; },
    why: 'Symbol of K_ij = 1/(2cosh((i−j)h/2)), h = ln 4: Poisson form (π/h)Σ sech(π(θ + 2πn)/h) equals the direct cosine series; minimum at θ = π, value 0.0073355, 2·min = 0.014671.',
  },
  {
    id: 'r13-lac4-arithmetic',
    holds: () => Math.abs(R.lac4.twoMinSymbol - R.lac4.Enorm - R.lac4.lambdaT) < 1e-6 && Math.abs(Math.min(R.lac4.head, R.lac4.lambdaT) - R.lac4.imsR - R.lac4.lambdaMin) < 1e-9
      && R.lac4.lambdaMin > 0 && R.lac4.floatLambdaInf > R.lac4.head && R.lac4.residual < 1e-40,
    why: 'λ_T = 0.014671 − 8.311e-4 = 0.013840; λ_min ≥ min(6.12e-4, 0.013840) − 2.4854e-4 = 3.6346e-4 > 0; float λ_min of the infinite lattice 6.7178e-4 sits above the certified head bound.',
  },
  {
    id: 'r13-sensitivity-constant',
    holds: () => { let mx = 0, arg = 0; for (let i = 0; i <= 200000; i += 1) { const u = i * 5e-5; const v = Math.abs(G2(u)); if (v > mx) { mx = v; arg = u; } }
      return Math.abs(mx - R.horizon.maxG2) < 1e-3 && Math.abs(arg - (Math.SQRT2 - 1)) < 1e-3; },
    why: 'max_u |G″(u)| for G(u) = 2u/(1 + u²) is 2.9142 at u = √2 − 1, so |g_γ″| ≤ 2.914/γ³ with g_γ(x) = 2x/(x² + γ²).',
  },
  {
    id: 'r13-horizon-inequality',
    holds: () => 2 * R.horizon.eps80 * R.horizon.schurS < R.lac4.lambdaMin && 2 * R.horizon.eps80 * R.horizon.schurS < 3.1e-4
      && Math.abs(R.horizon.schurS - R.horizon.schurSReferee) < 1e-3 && R.horizon.q2Horizon < 3e12,
    why: '2ε(80)·S = 2·3.0e-5·5.109 = 3.07e-4 < η = 3.6346e-4 (model-dependent corollary); the q = 2 horizon ≈ 1e4 is far below 3e12.',
  },
  {
    id: 'r13-th-scaling',
    holds: () => R.detection.m.every((m, i) => { const th = R.detection.height[i] * Math.log(2) / m; return th > 6.5 && th < 8.1; }),
    why: 'Detection horizon × lattice step h = ln 2/m: 7.97, 7.32, 6.81, 6.94 for m = 2, 3, 4, 6 (T·h ≈ 7, measured lower bounds).',
  },
  {
    id: 'r13-blaschke-muntz',
    holds: () => { let s4 = 0; for (let k = 0; k < 60; k += 1) s4 += 4 ** -k; let hk = 0, pk = 0;
      for (let k = 1; k <= 1e5; k += 1) { hk += 1 / k; pk += k ** -1.13; }
      return Math.abs(s4 - 4 / 3) < 1e-12 && hk > 12 && pk < 1 / 0.13 + 1; },
    why: 'Σ 4^{−k} = 4/3 < ∞ (Blaschke, lacunary); Σ 1/k diverges (complete); Σ k^{−1.13} converges (≤ 1 + 1/0.13): the near-threshold family p ≈ 1.13 is still Blaschke.',
  },
  {
    id: 'r13-flow-and-lattices',
    holds: () => R.flow.eps0q4 > R.flow.eps0q2 && /not robust/.test(R.flow.q2Grade) && R.flow.realZeros[10] < R.flow.realZeros[0]
      && R.latticeLambdaMin['4^k'] > R.latticeLambdaMin['2^k'] && R.latticeLambdaMin['2^k'] > R.latticeLambdaMin['2^{k/2}'],
    why: 'Sparser lattices have larger margins (4^k ≫ 2^k ≫ 2^{k/2}); ε_0(q = 4) ≈ 364 measured, ε_0(q = 2) = 52.8 quadrature-limited.',
  },
  {
    id: 'r13-honest-scope',
    holds: () => R.status === 'done' && /open \(heuristic\)/.test(R.verdict) && /No bound changes/.test(R.verdict) && /refereed bound is changed/i.test(R.verdict)
      && /NO QED/.test(R.verdict) && /bounded-type/.test(R.refereeKilled[0]),
    why: 'Near-threshold regime graded open/heuristic; complete-Λ ⇒ RH contrast conditional; no Λ change; no QED.',
  },
]);

export default ROUTE_13;
