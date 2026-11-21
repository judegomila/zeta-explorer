/**
 * @fileoverview route-42-formal-mv-cap-2026-10-10 — roadmap route 42 (batch 5): MV-CAP as a theorem (window-replacement counter-models
 * for the lane hypothesis H_desc). Write-up: formalization/paper/mv-cap-theorem.md (referee corrections block at the top).
 * One run plus one adversarial internal referee pass (not refuted; severity MAJOR); the referee corrections are applied below.
 *
 * PROVED (internal referee only): Lemma 1 (realisation: ξ_W = κ ξ Q_{W′}/Q_W keeps order 1, functional equation, reality, ξ_W(1) = ξ(1));
 *  Lemma 2 (counting: |E_{N_W}| ≤ B + K + 1e-10, independent of the unknown N(a)); Lemma 3 (outer zeros by integration by parts with
 *  Trudgian's B(T); kernel 2y/Δ² dominates the real-zero term of H_desc and the far K_Y term of H_desc-mirror). Theorem A: for
 *  (h, k0, y*) = (50, 2, 0.17) and any centre c0 ∈ [3.1e12, 7.50e16], z* = 2c + 0.17i is a nonreal zero of H_0^W, topmost within distance 2,
 *  with P_0(z*) ≤ M_0(z*) ≤ 3.0119 < p_req = 4.3743; n_W ≤ 605, K ≤ 1.4935, new pair β ≤ 0.585 (inside the classical zero-free region),
 *  N(σ, T) up by ≤ 1. So H_desc(p) fails for ζ_W for p > 3.0119 (and so does the mirror inequality at t = 0). Remark A′: the literal
 *  H_desc fails for a variant preserving every explicit N(T) bound exactly. Theorem B (formal MV-CAP for premise sets ζ_W satisfies);
 *  Theorem C (zero-side sensitivities: N0 ≤ 2 outside / 19.3 inside the window; N(σ, T) ≤ 1; linear statistics ≤ 1210 G; normalised pair
 *  sums ≤ 9.3e-9 at 3.1e12, 3.6e-13 at 7.5e16); Corollary D (a certifying zero-side premise needs slack < 19.3 zeros, relative precision
 *  ≤ 1.5e-12 at the seam … 4.5e-17 at the top).
 *  Referee-corrected Proposition E: the UNSHIFTED Theorem A model fails O-form function-side premises (ζ_W/ζ → κ ≠ 1, mean square moves
 *  by ≈ |κ² − 1| T log T); the κ = 1 SHIFTED variant satisfies every O-form premise with E(T) ≥ const, but has count inflation K′ ≈ 19
 *  (𝒜(≈ 19)), p_viol ≈ 3.014, and in-window sensitivities ≈ 36 zeros (outside: N0 2, density 1).
 * CERTIFIED (CERTIFIED-FLOAT: IEEE double with a 1e-6 margin, not interval arithmetic): lattice sums, uniform-in-height maxima and K over
 *  every admissible n ([416, 605] for h = 50; [201, 310] for h = 25). p_viol robust to the N(T)-error constant B ×2 / ×3: 3.1601 / 3.3218.
 * CONDITIONAL: failure of H_desc-mirror for t > 0 needs Lemma 5 (uniform zero counting for H_t^W, not written). Trudgian 2014 constants
 *  (0.112, 0.278, 2.510) and Mossinghoff–Trudgian–Yang 5.558691 used as quoted (the result tolerates B tripled).
 * MEASURED: proxy realisation at c0 = 5e5 (88 sign changes as designed, max|ΔN| = 2); function-side cost of a k0-slot deficit (local
 *  change in ∫Z²: −2.4, 4.7e3, 1.8e5, 7.2e6, 2.3e11, 1.6e18 for k0 = 1, 2, 3, 4, 6, 9); Euler-product detection |log(ζ_W/ζ)(3 + ic)| = 0.33 /
 *  3.55 / 26.9; heat-flow model: (iii) fails for holes ≥ 7 spacings at the seam (y* = 0.99, confirmed at L = 300) and ≥ 13 — possibly 15,
 *  truncation-dependent (Y(t0) = 0.1666 at L = 300) — at N1*; outer bound vs actual zeros ≤ 0.819 of the bound (1600 windows).
 *  Referee (proxy height 5e5, actual zeros): the Theorem A construction is EXCLUDED by an explicit σ = 2 Montgomery–Vaughan short-interval
 *  mean value — Δ∫_{c0±150}|ζ(2+it)|² = +2.18e4 (m1-matched 2.17e4; (100,1,0.17): 123; (25,2,0.17): 2455) against baseline 324 (≈ ζ(4)·300)
 *  and an error ≈ 10 — and by |ζ(1+it)| ≤ ¾ log t (|ζ_W(1 + ic)| ≈ 187 vs 9.8; |ζ_W(2 + ic)| = 82 > ζ(2)).
 * HEURISTIC: zero-side mean values plus structural axioms probably cannot prove any Λ bound below y_max²/2 ≈ 0.487 (model only, not claimed).
 *
 * Scope after the referee: MV-CAP is a theorem (internal) for zero-side statistics — outputs of mean-value methods — and for O-form
 * premises; it is NOT established for explicit function-side L² / large-sieve mean values, which MV-CAP names, and the constructed
 * counter-model is itself caught by them at the proxy height. Hence status 'partial'. No Λ bound moves.
 * No refereed bound is changed; RH open; NO QED. Import-free. ROUTE_42_ASSERTIONS recompute p_req, the p_viol decomposition, B-robustness,
 * the lane-top relation, the relative-precision requirement from N(T), ζ(4)·300, Heath-Brown's constant and the κ-shift bookkeeping live.
 */

const { log, abs, PI, sqrt } = Math;

export const ROUTE_42 = Object.freeze({
  id: 'route-42-formal-mv-cap-2026-10-10',
  route: 42,
  date: '2026-10-10',
  title: 'Route 42: MV-CAP as a theorem for zero-side premises; not established for explicit function-side mean values',
  status: 'partial',
  headline: 'At every window of the lane [3.1e12, 7.50e16] an explicit counter-model ζ_W (functional equation, order 1, residue 1, classical zero-free '
    + 'region, explicit N(T) bounds up to +1.4935, zeros of ζ outside a 100-unit window) violates H_desc: p_viol ≤ 3.0119 < p_req = 4.3743. So zero-side '
    + 'mean-value premises cannot certify H_desc unless they resolve one window (slack < 19.3 zeros). The referee showed the same model fails explicit '
    + 'function-side mean values (σ = 2 Montgomery–Vaughan, |ζ(1+it)| bound) at the proxy height and that Proposition E was false as stated; MV-CAP '
    + 'for function-side L² inputs stays open.',

  seam: Object.freeze({ y0: 0.165, t0: 0.1314, pReq: 4.3743 }),
  lane: Object.freeze({ bottom: 3.1e12, top: 7.502e16, lnN1star: 18.50934 }),
  theoremA: Object.freeze({ h: 50, k0: 2, yStar: 0.17, latticeMax: 2.9906, outer: 0.0213, outerParts: Object.freeze([0.020222, 0.001083]), pViol: 3.0119,
    nRange: Object.freeze([416, 605]), K: 1.4935, betaNewPair: 0.585 }),
  bRobust: Object.freeze([[1, 3.0119], [2, 3.1601], [3, 3.3218]]),
  tableA: Object.freeze([
    Object.freeze({ cfg: '(25,2,0.17)', pViol: 3.1811 }), Object.freeze({ cfg: '(100,1,0.17) on [3.1e12,1e15]', pViol: 4.2151, B2: 4.3303, B3: 4.4468 }),
    Object.freeze({ cfg: '(50,9,0.9)', pViol: 3.7369, K: 8.27 }), Object.freeze({ cfg: '(25,9,0.9)', pViol: 4.1082 }),
  ]),
  sensitivities: Object.freeze({ N0Outside: 2, N0Inside: 19.3, density: 1, NTinside: 17.3, pairSum: Object.freeze([9.3e-9, 3.6e-13]),
    relPrecision: Object.freeze([1.5e-12, 4.5e-17]), kappaShiftInside: 36, kappaShiftK: 19, kappaShiftPViol: 3.014 }),
  functionSideCost: Object.freeze([[1, -2.4], [2, 4.7e3], [3, 1.8e5], [4, 7.2e6], [6, 2.3e11], [9, 1.6e18]]),
  eulerDetection: Object.freeze([[1, 0.33], [2, 3.55], [9, 26.9]]),
  heatFlow: Object.freeze({ seamSpacings: 7, n1starSpacings: Object.freeze([13, 15]), YatT0L300: 0.16655, tY0L300: 0.13160, persistenceMax: 0.462 }),
  refereeSigma2: Object.freeze({ c0: 5e5, halfWidth: 150, baseline: 324.2, delta: 2.18e4, deltaM1: 2.17e4, delta100_1: 123, delta25_2: 2455, mvError: 10,
    zetaW1: 187, bound1: 9.8, zetaW2: 82, logKappaM1: 3.78e-9 }),
  heathBrownC: 10.30,

  refereeKilled: Object.freeze([
    'MAJOR: Proposition E false as stated — ζ_W/ζ → κ = Q_W(1)/Q_{W′}(1) ≠ 1, so the unshifted model moves a mean square by ≈ |κ² − 1| T log T and fails every O-form premise with error o(T log T); m1 = 0 does not give κ = 1 (log κ = 3.78e-9); corrected via the κ = 1 shifted variant, at the price K′ ≈ 19 and in-window sensitivities ≈ 36',
    'MAJOR: scope understated — the Theorem A model is excluded at the proxy height by an explicit σ = 2 Montgomery–Vaughan short-interval mean value (Δ ≈ 2.2e4 vs error ≈ 10) and by |ζ(1+it)| ≤ ¾ log t (187 vs 9.8); MV-CAP covers zero-side statistics, not the L² / large-sieve inputs it names; "cheap to violate on the function side" withdrawn',
    'heat-flow threshold at N1* truncation-dependent: 13 spacings marginal at L = 300 (Y(t0) = 0.1666); read "≥ 13, possibly 15"',
    'PROVED-section overstatements: Theorem C Weil-compression row unargued; Corollary D Levinson example unsupported; Levinson/Conrey/PRZZ effective-but-not-explicit, not "ineffective"; (R5) second-order O(nh²/a²); ⌊σ/2⌋ only outside every window; explicit-bound slack needs B̃ monotone and slowly varying',
    'H_desc-mirror failure for t > 0 conditional on the unwritten Lemma 5 (correctly flagged); Theorem A does refute the literal H_desc (t = 0 included)',
  ]),
  nextStep: '(1) Settle the function-side question: either a counter-model with |R(σ + it)| ≈ 1 off the line (surviving explicit σ ≥ 1 inputs) that still defeats '
    + 'H_desc, or a proof that explicit L² mean values at σ > 1/2 force the local count — the latter would make explicit short-interval mean values a genuine '
    + 'partial lane input. (2) Write Lemma 5 (uniform zero counting for H_t^W, t ∈ [0, t1]). (3) Move the lattice sums to python-flint intervals (seconds) '
    + 'and run the L = 600 heat-flow check when load allows.',
  files: Object.freeze(['formalization/paper/mv-cap-theorem.md', 'tmp/routes-b5-r42-pviol.py', 'tmp/routes-b5-r42-uniform.py', 'tmp/routes-b5-r42-checks.py',
    'tmp/routes-b5-r42-proxy.py', 'tmp/routes-b5-r42-profile.py', 'tmp/routes-b5-r42-mingap.py', 'tmp/routes-b5-r42-heatflow.py', 'tmp/routes-b5-r42-out/uniform.json',
    'tmp/routes-b5-r42-out/checks.json', 'tmp/routes-b5-r42-out/mingap.json', 'tmp/routes-b5-r42-out/heatflow.jsonl', 'tmp/routes-b5-ref42-indep.py',
    'tmp/routes-b5-ref42-sigma1.py', 'tmp/routes-b5-ref42-mvsigma2.py']),
  verdict: 'Route 42 is partial. MV-CAP is a theorem (internal referee only) for zero-side mean-value premises — counts, densities, N(T) bounds, linear '
    + 'statistics, pair and form-factor sums — and, via a κ = 1 shifted variant, for O-form premises: every window of [3.1e12, 7.50e16] admits an explicit '
    + 'admissible counter-model violating H_desc (p_viol ≤ 3.0119 < 4.3743, CERTIFIED-FLOAT, robust to B tripled), so a certifying premise needs one-window '
    + 'resolution (slack < 19.3 zeros, relative precision ≤ 1.5e-12). It is NOT established for explicit function-side L² / large-sieve mean values: the '
    + 'counter-model is excluded at the proxy height by an explicit σ = 2 Montgomery–Vaughan mean value and by the |ζ(1+it)| bound (measured), and the '
    + 'original Proposition E was false as stated. H_desc-mirror for t > 0 is conditional on Lemma 5. No Λ bound moves. No refereed bound is changed; RH open; NO QED.',
});

const R = ROUTE_42;
const descentConst = (p, y0) => (1 / p - y0 / p) - (log(1 + p) - log(1 + p * y0)) / (p * p);
const NT = (T) => (T / (2 * PI)) * (log(T / (2 * PI)) - 1);
const zetaSum = (s, n = 200000) => { let S = 0; for (let k = 1; k <= n; k += 1) S += k ** -s; return S + n ** (1 - s) / (s - 1) - 0.5 * n ** -s; };

export const ROUTE_42_ASSERTIONS = Object.freeze([
  {
    id: 'r42-p-req',
    holds: () => { let lo = 1, hi = 10; for (let k = 0; k < 80; k += 1) { const m = (lo + hi) / 2; if (descentConst(m, R.seam.y0) > R.seam.t0) lo = m; else hi = m; }
      return abs(lo - R.seam.pReq) < 1e-3; },
    why: 'p_req = 4.3743 from ∫_{0.165}^1 Y/(1 + pY) dY = 0.1314 (closed form).',
  },
  {
    id: 'r42-pviol-decomposition',
    holds: () => { const a = R.theoremA; return abs(a.latticeMax + a.outer - a.pViol) < 1e-4 && abs(a.outerParts[0] + a.outerParts[1] - a.outer) < 1e-4
      && R.bRobust.every(([, p], i) => p < R.seam.pReq && (i === 0 || p > R.bRobust[i - 1][1])) && a.betaNewPair < 1 && a.K < 1.5; },
    why: 'p_viol = lattice max 2.9906 + outer 0.0213 (0.020222 + 0.001083) = 3.0119; B ×1/×2/×3 give 3.0119 < 3.1601 < 3.3218, all below p_req.',
  },
  {
    id: 'r42-table-a-robustness',
    holds: () => { const r = R.tableA[1]; return r.pViol < R.seam.pReq && r.B2 < R.seam.pReq && r.B3 > R.seam.pReq
      && R.tableA.filter((x) => x !== r).every((x) => x.pViol < R.seam.pReq); },
    why: 'The k0 = 1 row (100,1,0.17) on [3.1e12, 1e15] holds with B and 2B (4.2151, 4.3303) but fails at 3B (4.4468 > 4.3743); the other rows sit below p_req.',
  },
  {
    id: 'r42-lane-and-precision',
    holds: () => { const ln1 = log(R.lane.top / (2 * PI)) / 2; const p0 = R.sensitivities.N0Inside / NT(R.lane.bottom); const p1 = R.sensitivities.N0Inside / NT(7.5e16);
      return abs(ln1 - R.lane.lnN1star) < 1e-4 && abs(p0 / R.sensitivities.relPrecision[0] - 1) < 0.02 && abs(p1 / R.sensitivities.relPrecision[1] - 1) < 0.02; },
    why: 'ln N1* = ½ log(Γ1/2π) = 18.50934 at Γ1 = 7.502e16; 19.3/N(T) with N(T) ≈ (T/2π)(log(T/2π) − 1) gives 1.51e-12 at 3.1e12 and 4.49e-17 at 7.5e16.',
  },
  {
    id: 'r42-referee-function-side',
    holds: () => { const s = R.refereeSigma2; const z4 = PI ** 4 / 90; return abs(z4 * 2 * s.halfWidth - 324.7) < 0.1 && abs(s.baseline / (z4 * 300) - 1) < 2e-3
      && s.delta / s.mvError > 1000 && s.delta100_1 > s.mvError && s.zetaW1 > s.bound1 && s.zetaW2 > PI * PI / 6
      && abs(0.75 * log(s.c0) - s.bound1) < 0.05; },
    why: 'Baseline ∫_{c0±150}|ζ(2+it)|² = 324.2 ≈ ζ(4)·300 = 324.7; the Theorem A model shifts it by 2.18e4 ≫ MV error ≈ 10 (even k0 = 1 gives 123); |ζ_W(1+ic)| ≈ 187 > ¾ log(5e5) = 9.84; |ζ_W(2+ic)| = 82 > ζ(2).',
  },
  {
    id: 'r42-kappa-shift',
    holds: () => { const s = R.sensitivities; return abs(R.theoremA.K + s.NTinside - s.kappaShiftK) < 0.5 && s.kappaShiftInside > s.N0Inside
      && s.kappaShiftPViol < R.seam.pReq && abs(s.kappaShiftPViol - R.theoremA.pViol) < 0.01 && R.refereeSigma2.logKappaM1 > 0; },
    why: 'κ = 1 shifted variant: K′ ≤ 1.4935 + (2B + K) = 1.4935 + 17.3 ≈ 19 (2B + K = the in-window N(T) movement of Theorem C), in-window sensitivities 19.3 → ≈ 36, p_viol ≈ 3.014; the m1-matched model still has log κ = 3.78e-9 ≠ 0.',
  },
  {
    id: 'r42-heath-brown-constant',
    holds: () => { const z32 = zetaSum(1.5); const z3 = zetaSum(3); const c = (2 / 3) * (1 / sqrt(2 * PI)) * z32 ** 4 / z3;
      return abs(z32 - 2.6123753) < 1e-5 && abs(c - R.heathBrownC) < 0.01; },
    why: 'Heath-Brown c = (2/3)(2π)^{−1/2} ζ(3/2)⁴/ζ(3) = 10.30 recomputed (Euler–Maclaurin-corrected ζ sums).',
  },
  {
    id: 'r42-cost-and-heatflow',
    holds: () => R.functionSideCost.every(([, v], i) => i < 2 || v > R.functionSideCost[i - 1][1]) && R.eulerDetection.every(([, v], i) => i === 0 || v > R.eulerDetection[i - 1][1])
      && R.heatFlow.YatT0L300 > R.seam.y0 && R.heatFlow.YatT0L300 - R.seam.y0 < 0.002 && R.heatFlow.tY0L300 > R.seam.t0 && R.heatFlow.persistenceMax < 0.99 ** 2 / 2,
    why: 'Function-side cost of a k0-slot deficit grows from 4.7e3 (k0 = 2) to 1.6e18 (k0 = 9); the N1* 13-spacing heat-flow case at L = 300 survives by only 0.0016 in Y (marginal); nonreal persistence 0.462 stays below y*²/2 = 0.490.',
  },
  {
    id: 'r42-honest-scope',
    holds: () => R.status === 'partial' && /NOT established/.test(R.verdict) && /conditional on Lemma 5/.test(R.verdict)
      && /refereed bound is changed/i.test(R.verdict) && /NO QED/.test(R.verdict) && /^MAJOR/.test(R.refereeKilled[0]) && /^MAJOR/.test(R.refereeKilled[1]),
    why: 'Theorem for zero-side and O-form premises only; function-side open (and the model is caught there); t > 0 conditional; no Λ change; no QED.',
  },
]);

export default ROUTE_42;
