/**
 * @fileoverview route-23-ht-vs-dyson-bm-2026-10-11 — roadmap route 23 (batch 6): H_t zero dynamics against Dyson Brownian motion on
 * Odlyzko's zeros, looking for arithmetic deviations. PARTIAL: the t = 0 loop-identity test is done; the finite-τ production runs were still
 * running at report time. One run plus one adversarial internal referee pass (not refuted; severity minor); corrections applied below.
 *
 * PROVED: (i) zero ODE in the convention ∂_t H = −H_zz (zeros at z = 2γ at t = 0): dz_k/dt = 2Σ′[1/(z_k − z_j) + 1/(z_k + z_j)] + 1/z_k,
 *  exact for simple zeros (H_0 even of order 1); in unfolded units τ = t/Δz², Δz = 4π/log(γ/2π), it is dx_k/dτ = 2Σ′ 1/(x_k − x_j) up to
 *  density-gradient corrections. (ii) For CUE_N with the cot kernel (π/N)cot(πw/N), E[g·D] = −1 exactly (integration by parts against
 *  Π sin², rigorous for finite N; the standard loop/Ward identity of the β = 2 log-gas, E[gD] = −2/β in general — not new). For the noise-free
 *  H_t flow, dV/dτ(0) = 4 cov(g, D), which equals 4Q when E[D] = 0. The infinite-volume version ("any translation-invariant process
 *  stationary under infinite Dyson BM") is standard but its well-posedness and integrability conditions were NOT checked.
 * CERTIFIED: nothing.
 * CONDITIONAL / INTERPRETATION: reading the deviation as arithmetic uses the BBLM constant Λ_B = 1.57314 (recalled, not re-derived). Q is a
 *  long-range 3-point sum (m ≥ 2 neighbours carry ≈ 45% of the zeros-minus-sine difference), so Q is NOT evaluable in the BBLM effective-N
 *  model (which fixes short-range statistics) — the run's "BBLM fails for this quantity" is withdrawn. Equivalently the zeros behave as
 *  β_eff = 2/|Q| ≈ 2.13 for this loop identity.
 * MEASURED: Q_zeros (idx 1.5e6–2.0e6, T ≈ 1e6, L = 11.98) = −0.9414 (referee, raw γ, no unfolding: −0.9413), error 0.003–0.004 under
 *  heavy-tail-aware estimates (P(gD < −y) ~ y^{−3}, infinite fourth moment; bootstrap 0.0022–0.0034 by block size, iid 0.0040); deviation
 *  Q + 1 = 0.059, more than 12σ (the run's "22σ" is not quoted). Q + 1 consistent with c·12Λ_B/L², c = 0.434 ± 0.008 (statistical, pure-1/L²
 *  model), over L ∈ [7, 12] only (8 bins, factor 1.7 in L); the three high blocks (T = 2.68e11, 1.44e20, 1.37e21 — the run mislabelled them
 *  by zero index) are consistent with 0 and alone give c = 0.58 ± 0.89. CUE_N controls Q = −1 within errors (N = 2…50; error bars fragile:
 *  N = 4 gave −1.0072 ± 0.0028 at 2e5 matrices, −0.9999 ± 0.0009 at 2e6). One window at idx 1.8e6 (reproduced exactly by an exact trig heat
 *  flow): forward V(core) = 0.1618, 0.1119, 0.0350, 0.0106 at τ = 0, 0.02, 0.1, 0.2; backward to τ = −0.03: 84 pairs leave the line in the
 *  1000-zero window, 49 in the 600-zero core vs 56 from the isolated-pair rule τ_c = s²/8; first collision in (−0.00240, −0.00235) vs
 *  0.137²/8 = 0.00235; numerical dV/dτ(0) = −3.4299 vs 4cov(g, D) = −3.4289. t = 0 small gaps: P(s < 0.2) = 0.00726 ± 0.00012 vs 1 − 12Λ_B/L²
 *  deficit ≈ 0.85; V = 0.16733 ± 0.00016 vs GUE 0.1800 (deficit about half the CUE_Neff prediction).
 * HEURISTIC: linearised lattice mode rate 2πθ − θ² suggests zero/GUE differences shrink with τ (untested); the m = 1 / m ≥ 2 split
 *  (+0.026 ± 0.008, ≈ 3σ against a noisy CUE400 reference summing to −0.9888) and "m ≥ 2 is what the smaller V gives" (crude g² scaling gives
 *  0.014 vs 0.021) are heuristic.
 *
 * No Λ claim. PT Lambda <= 0.2 stands; RH open; NO QED. Import-free. ROUTE_23_ASSERTIONS recompute live: E[gD] = −1 for CUE_2 and CUE_3
 * by quadrature against the exact Weyl densities, the weighted 1/L² fit (c, its error, χ²) from the stored bins, the high-block-only fit,
 * β_eff, the unfolding scale, and the isolated-pair collision rule against the first measured collision.
 */

const { PI, abs, sin, tan, sqrt, log } = Math;

export const ROUTE_23 = Object.freeze({
  id: 'route-23-ht-vs-dyson-bm-2026-10-11',
  route: 23,
  date: '2026-10-11',
  title: 'Route 23 (partial): the zeros miss the Dyson loop identity dV/dτ(0) = −4 by (0.434 ± 0.008)·12Λ_B/L²',
  status: 'partial',
  headline: 'The H_t flow is the drift part of Dyson BM, so any Dyson-stationary statistics (every CUE_N) satisfy the loop identity E[gD] = −1, '
    + 'i.e. dV/dτ(0) = −4 for the gap variance. Zeros near T ≈ 1e6 give Q = −0.9414 (deviation > 12σ), consistent with c·12Λ_B/L², c = 0.434 ± '
    + '0.008, over L ∈ [7, 12]; equivalently β_eff ≈ 2.13. The finite-τ production runs had not finished.',

  Q: Object.freeze({ zeros1e6: -0.9414, zeros1e6Referee: -0.9413, err: Object.freeze([0.003, 0.004]), sigmaFloor: 12, LBin: 11.98, LambdaB: 1.57314 }),
  bins: Object.freeze([ // [L, Q, sigma] — 8 low bins (Odlyzko zeros6) + 3 high blocks (T = 2.68e11, 1.44e20, 1.37e21)
    [6.99, -0.8485, 0.0154], [7.96, -0.8843, 0.0095], [9.00, -0.8981, 0.0056], [10.01, -0.9135, 0.0034], [10.74, -0.9329, 0.0033],
    [11.26, -0.9346, 0.0029], [11.67, -0.9400, 0.0029], [11.98, -0.9414, 0.0027], [24.48, -0.9994, 0.0325], [44.58, -0.9953, 0.0223], [46.83, -0.9592, 0.0240],
  ]),
  highBlockHeights: Object.freeze([2.677e11, 1.442e20, 1.371e21]),
  fit: Object.freeze({ c: 0.434, err: 0.008, chi2: 9.4, points: 11, chi2OneOverL: 41.6, highOnly: Object.freeze({ c: 0.58, err: 0.89 }) }),
  cue: Object.freeze({ N4small: Object.freeze([-1.0072, 0.0028]), N4large: Object.freeze([-0.9999, 0.0009]), N3: Object.freeze([-0.9987, 0.0010]) }),
  window: Object.freeze({ idx: 1.8e6, forwardV: Object.freeze([[0, 0.1618], [0.02, 0.1119], [0.1, 0.0350], [0.2, 0.0106]]),
    backward: Object.freeze({ tau: -0.03, lostWindow: 84, lostCore: 49, ruleWindow: 96, ruleCore: 56, firstCollision: Object.freeze([-0.00240, -0.00235]), smallestGap: 0.137 }),
    dVdtau0: Object.freeze({ numerical: -3.4299, fourCov: -3.4289, fourQwindow: -3.4086 }) }),
  t0Stats: Object.freeze({ P02: 0.00726, P02err: 0.00012, P02GUE: 0.0085, V: 0.16733, Verr: 0.00016, VGUE: 0.1800 }),
  running: Object.freeze({ pids: Object.freeze([51915, 52264]), scripts: Object.freeze(['tmp/routes-b6-r23-forward.py', 'tmp/routes-b6-r23-backward.py 0.02']),
    outputs: Object.freeze(['tmp/routes-b6-r23-out/forward.json', 'tmp/routes-b6-r23-out/backward_0.02.json']), note: 'alive at 2026-10-07 11:5x (≈ 2.5 h elapsed); the window model prints "invalid value in log" warnings (RK stages leave the window) — audit with numchecks.py before using finite-τ results' }),

  refereeKilled: Object.freeze([
    'not new / overstated: E[gD] = −1 is the standard β = 2 log-gas loop (Ward) identity (E[gD] = −2/β); rigorous for finite CUE_N; the infinite-Dyson-BM version needs unchecked well-posedness/integrability conditions',
    'non-sequitur: "the BBLM effective-N model does not capture it" withdrawn — Q is a long-range 3-point sum (m ≥ 2 carry ≈ 45% of the difference), not evaluable in BBLM, which fixes short-range statistics',
    'overstated law: the 1/L² fit, c error and 1/L rejection come from 8 bins with L ∈ [7, 12] only; high blocks alone give c = 0.58 ± 0.89; not "from 7e3 to 1e22"',
    'mislabelled heights: "1e12, 1e21, 1e22" are zero indices; heights are T = 2.68e11, 1.44e20, 1.37e21',
    'optimistic errors: g·D is heavy-tailed (P(gD < −y) ~ y^{−3}); CUE control χ² ≈ 33 for 11 dof; the deviation is robustly > 12σ but "22σ" is not quoted',
    'tier: the m = 1 / m ≥ 2 split is ≈ 3σ against a noisy reference (CUE400 total −0.9888) and the "smaller V" explanation is unverified (0.014 vs 0.021) — moved to heuristic',
    'unsaved/unaudited: single-window flow numbers had no saved log (now reproduced exactly by the referee\'s trig heat flow; core counts 49 vs 56); production runs print log warnings — window numerics need the numchecks audit',
  ]),
  nextStep: 'Resume: PIDs 51915 (forward.py) and 52264 (backward.py 0.02), ≈ 125 MB each at launch, write tmp/routes-b6-r23-out/forward.json and '
    + 'backward_0.02.json incrementally; if dead, re-run from the repo root with OMP_NUM_THREADS=1 (.venv-arb/bin/python tmp/routes-b6-r23-forward.py, '
    + 'then tmp/routes-b6-r23-backward.py 0.02; ≈ 1.5–2 h) only when uptime load < 40. Then: run numchecks.py FIRST (tolerance, window buffer, '
    + 'collision threshold, exact-γ ODE; the log warnings), then analyze-backward.py (non-real fraction F(τ) vs CUE600 sine reference and the s²/8 '
    + 'baseline), compare V(τ) and P(s < 0.3/0.5)(τ) across heights and CUE3/4/6, and look up the Bogomolny–Keating 3-point prediction for c ≈ 0.43.',
  files: Object.freeze(['tmp/routes-b6-r23-lib.py', 'tmp/routes-b6-r23-instant.py', 'tmp/routes-b6-r23-cue-instant.py', 'tmp/routes-b6-r23-qprofile.py',
    'tmp/routes-b6-r23-fitQ.py', 'tmp/routes-b6-r23-forward.py', 'tmp/routes-b6-r23-backward.py', 'tmp/routes-b6-r23-numchecks.py', 'tmp/routes-b6-r23-out/instant.json',
    'tmp/routes-b6-r23-out/instant.log', 'tmp/routes-b6-r23-out/qprofile.json', 'tmp/routes-b6-ref23-out/Q.log', 'tmp/routes-b6-ref23-out/cue2.log', 'tmp/routes-b6-ref23-out/trigflow.log']),
  verdict: 'Route 23 is partial; a mapping result, not progress on Λ or RH. The H_t flow is exactly the drift of Dyson BM, so the β = 2 loop '
    + 'identity gives an exact test dV/dτ(0) = −4 (proved for finite CUE_N; standard). Finite-height zeros miss it: Q + 1 = 0.059 at T ≈ 1e6 '
    + '(> 12σ under heavy-tail-aware errors), consistent with (0.434 ± 0.008)·12Λ_B/L² over L ∈ [7, 12] only (β_eff ≈ 2.13). Q is not evaluable in '
    + 'the BBLM effective-N model. Finite-τ evolution and its numerical audit are unfinished. Nothing certified. PT Lambda <= 0.2 stands; RH open; NO QED.',
});

const R = ROUTE_23;
const K = (w, N) => (PI / N) / tan((PI * w) / N); // periodic (cot) Coulomb kernel on a circle of length N (unit density)
const cue2 = (n = 20000) => { let num = 0; let den = 0; for (let i = 0; i < n; i += 1) { const g = ((i + 0.5) * 2) / n; const r = sin((PI * g) / 2) ** 2;
  num += g * 2 * K(g, 2) * r; den += r; } return num / den; };
const cue3 = (M = 600) => { let num = 0; let den = 0; const h = 3 / M;
  for (let i = 0; i < M; i += 1) for (let j = 0; j < M - i; j += 1) { const a = (i + 0.5) * h; const b = (j + 0.5) * h; if (a + b >= 3) continue;
    const r = sin((PI * a) / 3) ** 2 * sin((PI * b) / 3) ** 2 * sin((PI * (a + b)) / 3) ** 2; const D = 2 * K(a, 3) - K(b, 3) + K(a + b, 3); num += a * D * r; den += r; }
  return num / den; };
const fit = (pts) => { let sxx = 0; let sxy = 0; for (const [L, q, s] of pts) { const x = (12 * R.Q.LambdaB) / (L * L); sxx += (x * x) / (s * s); sxy += (x * (q + 1)) / (s * s); }
  const c = sxy / sxx; let chi2 = 0; for (const [L, q, s] of pts) { const x = (12 * R.Q.LambdaB) / (L * L); chi2 += ((q + 1 - c * x) / s) ** 2; }
  return { c, err: 1 / sqrt(sxx), chi2 }; };

export const ROUTE_23_ASSERTIONS = Object.freeze([
  {
    id: 'r23-cue2-loop-identity',
    holds: () => abs(cue2() + 1) < 1e-6,
    why: 'CUE_2 unfolded to a circle of length 2: gap density ∝ sin²(πg/2), D = 2K(g) = π cot(πg/2); E[gD] = ∫ g π sin cos dg = −1 exactly (quadrature 1e-8).',
  },
  {
    id: 'r23-cue3-loop-identity',
    holds: () => abs(cue3() + 1) < 1e-4,
    why: 'CUE_3 (points 0, a, a+b on a circle of length 3, Weyl density Π sin²): D = 2K(a) − K(b) + K(a+b), E[gD] = −1 (midpoint quadrature over the simplex, ≈ 2e-6).',
  },
  {
    id: 'r23-one-over-L2-fit',
    holds: () => { const f = fit(R.bins); const h = fit(R.bins.slice(8)); const lo = fit(R.bins.slice(0, 8));
      return abs(f.c - R.fit.c) < 0.002 && abs(f.err - R.fit.err) < 5e-4 && abs(f.chi2 - R.fit.chi2) < 0.2 && abs(h.c - R.fit.highOnly.c) < 0.01
        && abs(h.err - R.fit.highOnly.err) < 0.01 && abs(lo.c - f.c) < 0.002 && R.bins.slice(0, 8).every(([L]) => L >= 6.9 && L <= 12); },
    why: 'Weighted LS of Q + 1 = c·12Λ_B/L² over the 11 stored points: c = 0.4335 ± 0.0079, χ² = 9.46; the 3 high blocks alone give 0.58 ± 0.89, and the 8 low bins (L ∈ [7, 12]) alone reproduce c — the law rests on L ∈ [7, 12].',
  },
  {
    id: 'r23-deviation-and-beta-eff',
    holds: () => { const q = R.Q; const dev = q.zeros1e6 + 1; const pred = (R.fit.c * 12 * q.LambdaB) / (q.LBin * q.LBin);
      return abs(dev - 0.0586) < 1e-3 && dev / q.err[1] > q.sigmaFloor && abs(2 / abs(q.zeros1e6) - 2.1245) < 1e-3 && abs(dev - pred) < 0.003 && abs(q.zeros1e6Referee - q.zeros1e6) < 2e-4; },
    why: 'Q + 1 = 0.0586 > 12σ even at the conservative 0.004 error; β_eff = 2/|Q| = 2.1245; the fit predicts 0.057 at L = 11.98; the referee\'s raw-γ value agrees to 1e-4.',
  },
  {
    id: 'r23-unfolding-and-pair-rule',
    holds: () => { const dz = (4 * PI) / log(1e6 / (2 * PI)); const w = R.window; const tc = w.backward.smallestGap ** 2 / 8;
      return abs(dz - 1.0492) < 1e-3 && -tc <= w.backward.firstCollision[1] + 1e-4 && -tc >= w.backward.firstCollision[0] - 1e-4
        && w.backward.lostCore < w.backward.ruleCore && w.backward.lostWindow < w.backward.ruleWindow
        && abs(w.dVdtau0.numerical - w.dVdtau0.fourCov) < 2e-3 && w.forwardV.every(([, v], i, a) => i === 0 || v < a[i - 1][1]); },
    why: 'Δz = 4π/log(γ/2π) = 1.0492 at γ = 1e6; isolated-pair rule τ_c = s²/8 = 0.00235 for the smallest gap 0.137 sits at the measured first collision (−0.00240, −0.00235); fewer pairs lost than the s²/8 rule (49 < 56 core); numerical dV/dτ(0) ≈ 4cov(g, D); V(τ) decreasing forward.',
  },
  {
    id: 'r23-heights-relabelled',
    holds: () => R.highBlockHeights.every((T, i) => T < [1e12, 1e21, 1e22][i]) && R.bins.slice(8).every(([L], i) => abs(log(R.highBlockHeights[i] / (2 * PI)) - L) < 0.05),
    why: 'High blocks sit at heights 2.68e11, 1.44e20, 1.37e21 (L = log(T/2π) = 24.48, 44.58, 46.83), not 1e12/1e21/1e22 (those are zero indices).',
  },
  {
    id: 'r23-honest-scope',
    holds: () => R.status === 'partial' && /not evaluable in the BBLM/.test(R.verdict) && /L ∈ \[7, 12\] only/.test(R.verdict) && /PT Lambda <= 0\.2 stands/.test(R.verdict)
      && /NO QED/.test(R.verdict) && !/22σ/.test(R.headline + R.verdict) && R.running.pids.length === 2,
    why: 'Partial (production runs in flight); BBLM inference withdrawn; 1/L² law scoped to L ∈ [7, 12]; no 22σ claim; no Λ claim; no QED.',
  },
]);

export default ROUTE_23;
