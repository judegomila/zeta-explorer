/**
 * @fileoverview route-39-lean-weil-small-support-2026-10-14 — roadmap route 39 (batch 9, group H, tool): Lean formalisation of the
 * small-support (Yoshida-type) Weil positivity reduction for ζ. One worker run plus one adversarial internal referee pass with an
 * independent Lean build, an independent normalisation check and independent Arb numerics (not refuted; severity minor: abstract zero side,
 * missed PNT+ Kadiri scaffold, integrability not formalised). Corrections applied below.
 *
 * PROVED (Lean 4.34.1, Mathlib d13f23b7, `lake env lean` in /tmp/qrh-verify/lean; file formalization/lean/Route39/WeilSmallSupport.lean,
 *  543 lines; no sorry, no custom axiom; referee re-build exit 0 in 20 s, 15 theorems all [propext, Classical.choice, Quot.sound]):
 *  primeSide_eq_zero_of_support (prime side Σ Λ(n) n^{−1/2}(g(log n) + g(−log n)) = 0 if supp g ⊆ [−b, b], b < log 2) and its sharpness;
 *  autocorr support doubling (supp f ⊆ [−a, a] ⇒ supp f⋆f* ⊆ [−2a, 2a]); poleTerm_nonneg_of_even (2|A(1/2)|² ≥ 0);
 *  uncertainty_toeplitz_nonneg (w ≥ m off [−T, T], deficit ≤ D, 2aD ≤ m ⇒ ∫ w‖𝓕f‖² ≥ 0); weilModel_nonneg; continuous_archSymbol;
 *  the Fubini identifications 𝓕(f⋆f*) = ‖𝓕f‖² and ∫(f⋆f*)e^{cx} = A(c)·conj A(−c); weilRHS_autocorr (model functional = weilRHS(f⋆f*)).
 *  Caveat (referee): integrability of archSymbol·‖𝓕f‖² is NOT proved in Lean; uncertainty_toeplitz_nonneg is trivially true in the
 *  non-integrable case (Bochner integral 0). The product is in fact integrable (log growth × Schwartz decay), so the content is genuine.
 * PAPER (classical, not formalised): Weil's explicit formula; monotonicity of Re ψ(1/4 + iy) in |y| (series ψ(z) = −γ + Σ(1/(n+1) − 1/(n+z)),
 *  each real part nondecreasing in y²; re-derived by the referee).
 * CERTIFIED (Arb, python-flint 128-bit; referee 100-bit independent): archSymbol(57/20) = 1.04718898431564499660 ± 1.03e-20 > 26/25 (hN1);
 *  deficit ∫_{[−57/20, 57/20]} (26/25 − archSymbol)^+ ≤ 5.91225653927938 < 6 (hN3; referee two-sided bracket [5.8894, 5.9260]);
 *  archSymbol(0) = −(γ + π/2 + 3 log 2 + log π) = −5.37218341922566558.
 * CONDITIONAL: weilModel_archSymbol_nonneg — the model Weil functional with ζ's archimedean symbol is ≥ 0 for every even Schwartz f with
 *  supp f ⊆ [−13/150, 13/150] (g = f⋆f* on [−0.1733, 0.1733]), given hN1, hN3. zeroSide_nonneg_small_support additionally takes the explicit
 *  formula as hypothesis hEF over an ABSTRACT functional Z : (ℝ → ℂ) → ℝ that Lean never ties to ζ zeros: formally it is 0 ≤ weilRHS(f⋆f*)
 *  restated (hEF is satisfiable with Z := weilRHS by rfl). "Re Σ_ρ ĝ(γ_ρ) ≥ 0" is the docstring reading only. Even f only; 2a = 0.1733 is far
 *  below log 2 and the project's 2a ≤ 0.9 interval certificate.
 * MEASURED: weilRHS normalisation vs mpmath zetazero: Gaussian s = 0.3 difference −1.7e-26, s = 0.5 −9.8e-27; referee modulated Gaussian
 *  e^{−x²/(2·0.35²)}cos(4x): −4.4e-22. Optimal uncertainty half-width a ≈ 0.0880 (T ≈ 2.851) vs 0.0146 for the two-level bound; zero of
 *  archSymbol at ξ0 = 1.00105848886.
 * HEURISTIC / inventory: Mathlib has Schwartz Plancherel, convolution support, Complex.digamma (11 lemmas), riemannZetaZeros, and the ζ'/ζ
 *  functional equation with digamma (NumberTheory/LSeries/RiemannZetaLogDeriv.lean), but no explicit formula or Weil functional. openai/math's
 *  smooth_explicit_identity covers only nontrivial primitive Dirichlet characters with one test function (primeMeanTest on [5/8, 7/8]).
 *  PNT+ (package in /tmp/qrh-verify/lean) has IEANTN/Kadiri.lean: a Weil-type explicit formula for ζ (kadiri_thm_3_1_q1, q = 1, χ trivial;
 *  prop_2_1) decomposed into sublemmas that depend on 14 sorries — a scaffold, not a proof. The uncertainty method caps near 0.18 support.
 *
 * Verdict: structural Yoshida reduction Lean-checked; explicit formula still a hypothesis. Nothing bears on RH or Λ. No refereed bound is changed;
 * RH open; NO QED. Import-free. ROUTE_39_ASSERTIONS recompute live (complex digamma by recurrence + Stirling series): archSymbol(0) and its
 * closed form, archSymbol(57/20) > 26/25, the deficit integral < 6, the zero crossing ξ0, 2aD = m, the log 2 window, the a ≈ 0.088 optimum.
 */

const { abs, log, PI, atan2, hypot } = Math;
const EG = 0.5772156649015329;

export const ROUTE_39 = Object.freeze({
  id: 'route-39-lean-weil-small-support-2026-10-14',
  route: 39,
  date: '2026-10-14',
  title: 'Route 39: Lean reduction of small-support Weil positivity for ζ (prime side below log 2, pole term, uncertainty bound) — explicit formula still a hypothesis',
  status: 'partial',
  headline: 'A 543-line Lean file (no sorry, standard axioms) proves the Yoshida-type reduction: prime side vanishes below log 2 (sharp), Fubini '
    + 'identification with the explicit-formula right-hand side, positivity via an uncertainty bound for g = f⋆f* on [−0.1733, 0.1733] given two '
    + 'Arb-certified digamma facts. Weil\'s explicit formula is a hypothesis over an abstract zero functional; PNT+ Kadiri.lean is a sorried scaffold for it.',
  lean: Object.freeze({ file: 'formalization/lean/Route39/WeilSmallSupport.lean', lines: 543, headline: 9, refereeChecked: 15, sorry: 0 }),
  params: Object.freeze({ a: 13 / 150, m: 26 / 25, T: 57 / 20, D: 6 }),
  arb: Object.freeze({ archAtT: 1.04718898431564499660, deficitUpper: 5.91225653927938, refereeBracket: Object.freeze([5.8894, 5.9260]), mpmathDeficit: 5.90769,
    archAt0: -5.37218341922566558, xi0: 1.00105848886, aOpt: 0.0880209, Topt: 2.851 }),
  normalisation: Object.freeze({ s03: -1.7e-26, s05: -9.8e-27, refereeModulated: -4.4e-22 }),
  kadiri: Object.freeze({ file: 'PrimeNumberTheoremAnd/IEANTN/Kadiri.lean', theorem: 'kadiri_thm_3_1_q1', sorries: 14 }),
  refereeKilled: Object.freeze([
    'the zero side Z in zeroSide_nonneg_small_support is an arbitrary functional never tied to ζ zeros: formally the theorem is 0 ≤ weilRHS(f⋆f*) restated; hEF is not a formal statement of Weil\'s explicit formula',
    'inventory omitted PNT+ IEANTN/Kadiri.lean (Weil-type explicit formula for ζ, kadiri_thm_3_1_q1, 14 sorries) and Mathlib\'s ζ\'/ζ functional equation with digamma; the nextStep should start from that scaffold',
    'integrability of archSymbol·‖𝓕f‖² not proved in Lean: the uncertainty theorem is trivially true when non-integrable (content genuine since the product is integrable)',
  ]),
  nextStep: 'Discharge hEF: fill the sorried sublemmas of PNT+ kadiri_thm_3_1_q1 (Laplace inversion, horizontal-segment vanishing, T → ∞ limit) and '
    + 'specialise to even C_c^∞ g, using RiemannZetaHadamard / ZeroCountCrude as inputs (build with ≤ 2 Lean processes, wait while load > 40); define '
    + 'the zero side over riemannZetaZeros with multiplicities so hEF becomes a real formal hypothesis; prepare (do not submit) an Aristotle job for the '
    + 'termwise monotonicity of Re ψ(1/4 + iy).',
  files: Object.freeze(['formalization/lean/Route39/WeilSmallSupport.lean', 'tmp/routes-b9-r39-lean/{check.sh,check.log,stage1-WeilSmallSupport.lean}',
    'tmp/routes-b9-r39-numerics/{certify_arch.py,certify_arch.out,check_normalisation.py,check_normalisation.out,scan.py,scan.out}',
    'tmp/routes-b9-ref39-lean/{Ref.lean,build.log}', 'tmp/routes-b9-ref39-num/{norm2.out,ref.out}']),
  verdict: 'Partial: the structural part of Yoshida-type positivity is Lean-checked (prime-side vanishing below log 2, pole positivity, the Fubini '
    + 'link to the explicit-formula right-hand side, uncertainty positivity of the archimedean form), reaching supp g ⊂ [−0.1733, 0.1733] for even f. '
    + 'The explicit formula itself is a hypothesis over an abstract zero functional (formally 0 ≤ weilRHS(f⋆f*)); digamma monotonicity and two '
    + 'Arb numbers are paper/Arb inputs; integrability is not formalised. Far short of log 2 and of the project\'s 2a ≤ 0.9 certificate. Nothing '
    + 'bears on RH or Λ. No refereed bound is changed; RH open; NO QED.',
});

const R = ROUTE_39;
// Re ψ(x + iy), x > 0: upward recurrence to |w| ≥ 12, then Stirling series
const cdiv = (ar, ai, br, bi) => { const d = br * br + bi * bi; return [(ar * br + ai * bi) / d, (ai * br - ar * bi) / d]; };
const cmul = (ar, ai, br, bi) => [ar * br - ai * bi, ar * bi + ai * br];
const rePsi = (x, y) => {
  let sr = 0; let si = 0; let wr = x; const wi = y;
  while (hypot(wr, wi) < 12) { const [qr, qi] = cdiv(1, 0, wr, wi); sr -= qr; si -= qi; wr += 1; }
  const [ir, ii] = cdiv(1, 0, wr, wi); const [i2r, i2i] = cmul(ir, ii, ir, ii);
  const B = [1 / 12, -1 / 120, 1 / 252, -1 / 240, 1 / 132, -691 / 32760];
  let pr = i2r; let pi = i2i; let ar = log(hypot(wr, wi)) - ir / 2; let ai = atan2(wi, wr) - ii / 2;
  for (const b of B) { ar -= b * pr; ai -= b * pi; [pr, pi] = cmul(pr, pi, i2r, i2i); }
  return ar + sr;
};
const arch = (xi) => rePsi(0.25, PI * xi) - log(PI);
const deficit = (T, m, K = 2000) => { // Simpson on [0, T], doubled by evenness
  const f = (x) => Math.max(0, m - arch(x)); const h = T / K; let s = f(0) + f(T);
  for (let k = 1; k < K; k += 1) s += (k % 2 ? 4 : 2) * f(k * h); return (2 * s * h) / 3; };

export const ROUTE_39_ASSERTIONS = Object.freeze([
  {
    id: 'r39-arch-at-zero-closed-form',
    holds: () => { const closed = -(EG + PI / 2 + 3 * log(2) + log(PI)); return abs(arch(0) - closed) < 1e-12 && abs(closed - R.arb.archAt0) < 1e-14; },
    why: 'archSymbol(0) = ψ(1/4) − log π = −(γ + π/2 + 3 log 2 + log π) = −5.3721834192 (live digamma vs closed form vs Arb).',
  },
  {
    id: 'r39-hN1-live',
    holds: () => abs(arch(R.params.T) - R.arb.archAtT) < 1e-12 && arch(R.params.T) > R.params.m && arch(R.params.T) - R.params.m > 0.0071,
    why: 'archSymbol(57/20) = 1.0471889843 > 26/25 (margin 0.00719; Arb 1.04718898431564499660 ± 1e-20).',
  },
  {
    id: 'r39-hN3-deficit-live',
    holds: () => { const d = deficit(R.params.T, R.params.m); const [lo, hi] = R.arb.refereeBracket;
      return abs(d - R.arb.mpmathDeficit) < 1e-3 && d >= lo && d <= hi && hi < R.params.D && R.arb.deficitUpper < R.params.D; },
    why: 'Deficit ∫_{[−57/20, 57/20]} (26/25 − archSymbol)^+ ≈ 5.9077 (live Simpson; mpmath 5.90769), inside the referee bracket [5.8894, 5.9260] and below D = 6.',
  },
  {
    id: 'r39-zero-crossing-and-monotone',
    holds: () => { const x0 = R.arb.xi0; let mono = true; let prev = -Infinity;
      for (let k = 0; k <= 200; k += 1) { const v = arch(k * 0.1); if (v < prev) mono = false; prev = v; }
      return abs(arch(x0)) < 1e-9 && arch(x0 - 1e-6) < 0 && arch(x0 + 1e-6) > 0 && mono; },
    why: 'archSymbol vanishes at ξ0 = 1.00105848886 and is nondecreasing in |ξ| on a grid over [0, 20] (paper input: termwise monotonicity of Re ψ(1/4 + iy)).',
  },
  {
    id: 'r39-uncertainty-arithmetic',
    holds: () => { const { a, m, D } = R.params; const tGrid = [2.6, 2.7, 2.8, 2.851, 2.9, 3.0, 3.1];
      const aOf = (T) => arch(T) / (2 * deficit(T, arch(T), 600)); const best = Math.max(...tGrid.map(aOf));
      return abs(2 * a * D - m) < 1e-15 && 2 * a < log(2) && abs(best - R.arb.aOpt) < 2e-4 && a < R.arb.aOpt && abs(2 * a - 0.17333) < 1e-5; },
    why: '2aD = 2·(13/150)·6 = 1.04 = m exactly; 2a = 0.1733 < log 2 (prime side vanishes); optimising a(T) = w(T)/(2·deficit(T)) over T gives a ≈ 0.0880 near T ≈ 2.85 (Lean uses 13/150 = 0.0867).',
  },
  {
    id: 'r39-honest-scope',
    holds: () => R.status === 'partial' && /abstract zero functional/.test(R.verdict) && /integrability/.test(R.verdict) && R.kadiri.sorries === 14
      && abs(R.normalisation.refereeModulated) < 1e-20 && /refereed bound is changed/i.test(R.verdict) && /NO QED/.test(R.verdict) && R.refereeKilled.length === 3,
    why: 'Explicit formula is an abstract hypothesis; Kadiri scaffold has 14 sorries; normalisation checked against real zeros; no Λ or RH content; no QED.',
  },
]);

export default ROUTE_39;
