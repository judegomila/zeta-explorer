/**
 * @fileoverview RH novel-routes roadmap (2026-09-23). A living list of the
 * genuinely NEW, testable routes to attack the Riemann Hypothesis, generated
 * from the statistical-mechanics reframing of the project's own machinery:
 *   ζ = primon-gas partition function (Bost–Connes),
 *   zeros = a 2D log-gas (Montgomery–Dyson, β=2 Coulomb),
 *   functional equation ξ(s)=ξ(1−s) = Kramers–Wannier self-duality about σ=½.
 * RH ⟺ the zero log-gas collapses onto the self-dual line σ=½.
 *
 * Each route carries a CONCRETE FIRST TEST (computable / provable now), the
 * RH-payoff if it works, and a status. This is a research roadmap, NOT a set
 * of results: nothing here is a bound or a proof. PT Λ≤0.2 is SOTA; RH open;
 * NO false QED. Import-light; holds() assertions (harness accepts holds()/check()).
 */

export const RH_NOVEL_ROUTES = Object.freeze({
  id: 'rh-novel-routes-roadmap',
  date: '2026-09-23',
  frame:
    'ζ = primon-gas partition function; zeros = 2D log-gas; functional equation = '
    + 'Kramers–Wannier self-duality about σ=½. RH ⟺ the log-gas collapses to the self-dual line.',
  status: 'ROADMAP — novel testable routes; no results claimed; no refereed bound is changed; RH open',

  routes: [
    {
      key: 'A',
      name: 'Reflection positivity of the primon gas about σ=½ (Osterwalder–Schrader)',
      idea:
        'The functional equation is a reflection about σ=½. If the primon gas is '
        + 'reflection-positive about that plane, Osterwalder–Schrader reconstruction '
        + 'yields a self-adjoint Hamiltonian whose spectrum is the zeros → RH AND '
        + 'Hilbert–Pólya in one stroke.',
      firstTest:
        'Build the finite-prime (first N primes) primon transfer operator; form the '
        + 'reflection Gram matrix G_ij = ⟨θ(f_i), f_j⟩ under reflection θ: s↦1−s at the '
        + 'self-dual point; test whether G ⪰ 0 (PSD) on N-prime truncations. PSD that '
        + 'persists as N→∞ is the go/no-go signal.',
      payoff: 'RH + the Hilbert–Pólya operator (highest ceiling)',
      status: 'first-test-done (rh-route-a-reflection-positivity-primon-gas-2026-09-23.js): finite-N '
        + 'gas RP REFUTED — the Pick reflection Gram of the completed N-prime gas is indefinite at every N '
        + 'with λ_min → −∞ like −p_N^{½−ν} (Euler product diverges on the strip; reflected Matsubara '
        + 'poles on σ=0); the infinite-N RP holds numerically but equals Weil positivity = RH '
        + '(Lagarias–Pick), not a stronger statement; RP transcriptions provable from gas structure '
        + '(Fock, Pólya Φ>0, KMS) have spectrum {log n} or ℝ, not the zeros. Route closed as stated.',
    },
    {
      key: 'B',
      name: 'Arithmetic freeze-flow: two-parameter deformation H_{t,τ}',
      idea:
        'The heat/de Bruijn flow is flow-BLIND (soft, never sees primes) — the proven '
        + 'reason it cannot give RH. Build the complementary ARITHMETIC flow: couple the '
        + 'primon external field with parameter τ (Euler-product coupling / octave-wise '
        + 'prime freezing as an RG/block-spin flow) alongside heat-time t. A flow carrying '
        + 'the prime field is exactly the input flow-blindness says is missing.',
      firstTest:
        'Write the Hellmann–Feynman force dρ/dτ on a zero under the prime-field coupling; '
        + 'test on the low ζ-zeros (and analytically) whether the force is monotone toward '
        + 'σ=½ (a confining drift). Monotonicity = a genuine non-soft lever.',
      payoff: 'Directly answers the flow-blindness no-go (arithmetic input the soft flow lacks)',
      status: 'first-test-done (imp-95999): reflection-symmetric additive prime-field source '
        + 'F(s,τ)=ξ(s)+τΨ(s), force dρ/dτ=−Ψ(ρ)/ξ′(ρ) (prime field / Coulomb field). '
        + 'VERDICT fixed-point-yes / stability-open: σ=½ is an EXACT fixed point of the '
        + 'arithmetic flow (Re Ψ even in δ), but the confining curvature 2Σ_p(log p)³p^{−½}cos(γ ln p) '
        + 'has a non-convergent finite-prime truncation (sign flips with cutoff) — sub-gap '
        + 'B-STABILITY-SIGN needs the Coulomb-regularized −ζ′/ζ. No bound; NO QED. '
        + 'SECOND PASS (rh-route-b-arithmetic-freeze-flow-2026-09-23.js): VERDICT NEGATIVE. Lemma M: every '
        + 'MULTIPLICATIVE prime coupling (Euler/Beurling factor, RG octave freeze, Λ-field −ζ′/ζ) has force 0 '
        + 'or a rigid translation (Euler shift 8e-31; Λ-field rate 1; FE-even Λ-coupling force 0 — this closes '
        + 'B-STABILITY-SIGN by reformulation). Lemma A: the FE-preserving ADDITIVE coefficient freeze has '
        + 'dγ_k/dτ = Z_S(γ_k)/(2Z′(γ_k)) (Riemann–Siegel partial sum, identity to 1.6e-27), REAL, so "σ=½ exact '
        + 'fixed point" is the open-condition triviality of every real pencil. On 17 GENUINE off-line zeros '
        + '(H_t, t<0) the heat force confines 17/17 while no coefficient set has a universal sign. HKO: pencil '
        + 'confinement ⟺ interlacing ⟺ RH-encoding; the n=1 pencil fails interlacing at the first pair. The '
        + 'one majority tendency (damp n≥2 ⇒ separate) confines AWAY from ζ — the de Bruijn trap. RH open.',
    },
    {
      key: 'C',
      name: 'Twisted-ladder signed interferometer',
      idea:
        'Varying signs across the χ-twisted family {L(s,χ)} is a basis for interference. '
        + 'Build a signed superposition Σ ε_χ L(s,χ) (or a character-averaged kernel) '
        + 'engineered so off-line zeros interfere DESTRUCTIVELY while the line stays '
        + 'constructive — character orthogonality is the mechanism that kills off-line '
        + 'contributions in the large sieve. Treat {ε_χ} as a design variable.',
      firstTest:
        'On a small modulus q, form Σ ε_χ L(s,χ); derive the off-line interference '
        + 'condition; optimize {ε_χ} to minimize |combination| off-line vs on-line; test '
        + 'numerically whether a sign pattern gives a nonvanishing off-line lower bound.',
      payoff: 'A constructive off-line-nonvanishing certificate (would give a zero-free region → RH if uniform)',
      status: 'tested — REFUTED (rh-route-c-signed-interferometer-2026-09-23.js): pair phases are pinned by the root number, '
        + 'every ≥2-arm design has ≫T off-line zeros (joint universality; DH zeros reproduced), orthogonality is mean-square only, '
        + 'and Φ_ε is blind to individual arm zeros',
    },
    {
      key: 'D',
      name: 'Peierls domain-wall confinement of the zero-gas',
      idea:
        'Treat an off-line zero as a defect; the functional equation forces a mirror '
        + 'defect. Compute the defect-pair free energy F(δ), δ=σ−½, from the explicit '
        + 'formula (2D-Coulomb self-energy + prime-field cost, the latter odd in δ). '
        + 'If F is convex with a strict min at δ=0, defects are confined → RH (the Ising '
        + 'domain-wall-confinement logic). This is Weil positivity in a Peierls dressing, '
        + 'which unlocks correlation-inequality (GKS/FKG) and transfer-matrix tools.',
      firstTest:
        'Compute F(δ) numerically from the actual prime sum for a test defect at several '
        + 'heights; check the sign of F′′(0) and monotonicity of F(δ). A confining shape '
        + 'is the signal.',
      payoff: 'RH via defect confinement; opens statistical-mechanics tooling on Weil positivity',
      status: 'tested — REFORMULATION, no lever (rh-route-d-peierls-defect-confinement-2026-09-23.js): the pure '
        + 'Coulomb self-energy of the mirror quadruple is exactly ANTI-confining (F_C″(0)=−4S<0, Earnshaw); probe '
        + 'convexity F_h″(0)=−4h″(t) is test-function geometry, not Weil positivity; the prime budget R_σ(t) confines '
        + 'a lone defect only non-uniformly in height (σ=1 fails below ½ at t≳3000) and its phase-free worst case is '
        + 'exactly the trivial strip; RH ⟺ R_σ(t) bounded as σ→0 = Weil’s criterion on Gaussian probes',
    },
    {
      key: 'E',
      name: 'Supercritical Widom line + large deviations',
      idea:
        'In the supercritical primon gas (σ<1, above condensation), zeros are the extreme '
        + 'fluctuations. RH ⟺ these are confined to the Widom line (response-function-'
        + 'maximum locus). |ζ(½+it)| moments peak on σ=½, evidence that σ=½ IS the Widom '
        + 'line. Attempt a large-deviations / concentration statement: extreme fluctuations '
        + '(zeros) of the primon gas concentrate on the Widom line.',
      firstTest:
        'Compute the primon-gas response functions (Cv(σ), correlation-length proxy) from '
        + 'the Euler product and locate their maxima; test whether the maximum-locus is σ=½. '
        + 'Then formulate the large-deviation rate function for an off-line zero.',
      payoff: 'RH as a concentration-of-measure statement (new proof paradigm)',
      status: 'first-test-done (imp-96002): primon-gas response functions from the Euler product '
        + '— U=−ζ′/ζ, susceptibility VarE=(ln ζ)″, heat capacity Cv=σ²VarE, ξ=√VarE — are all '
        + 'strictly monotone decreasing on σ>1, so their maximum-locus is the CONDENSATION EDGE '
        + 'σ=1 (Hagedorn), NOT σ=½. VERDICT widom-line-at-condensation / strip-inaccessible: the '
        + 'σ=½ Widom line / |ζ|-moment peak lives in the continued strip ½<σ<1 where the primon '
        + 'gas is undefined, and the large-deviation rate function positivity is RH-equivalent (a '
        + 'restatement) — sub-gap E-CONTINUATION-GAP. No bound; NO QED. '
        + 'E-CONTINUATION-GAP CLOSED, route ABSORBED (rh-route-e-widom-line-large-deviations-2026-09-23.js): '
        + 'the continuation IS available and RH-blind — the FLUCTUATION susceptibility V(σ)=Var_t log|ζ(σ+it)| '
        + '= ½Σ_k P(2kσ)/k² is finite for σ>½ (Bohr–Jessen, unconditional), diverges ~½ log log T only at σ=½ '
        + '(Selberg), reflection-symmetric, so σ=½ IS the Widom line by Parseval (mean-square at 2σ halves '
        + 'the Hagedorn point) plus the functional equation; (log ξ)″ has a symmetry-forced max at ½ '
        + '(=Σ_ρ γ⁻² = 0.0462100). Raw |ζ|² moments are monotone in σ (not peaked at ½); Var log|ζ| is. '
        + 'Finite-N gas has NO Fisher zeros (|Z_N| ≥ Π(1+p^{-σ})⁻¹, rate +∞); Cramér near-zero cost is '
        + 'monotone in σ, not minimised at ½. The concentration statement is Bohr–Landau 1914 via '
        + 'Littlewood’s lemma; the rate function is the zero-density exponent (Ingham / Guth–Maynard 30/13 / '
        + 'DH σ≥25/32); RH ⟺ Littlewood’s O(log T) criterion. No new lever.',
    },
    {
      key: 'F',
      name: 'Kramers–Wannier local-uniqueness',
      idea:
        'In 2D Ising, self-duality forces the singularity to the fixed point BECAUSE the '
        + 'transition is unique. ζ has infinitely many zeros, so global uniqueness fails — '
        + 'but a LOCAL (per-height-window) uniqueness of the "transition" would force each '
        + 'zero to the self-dual line via the functional equation.',
      firstTest:
        'Formulate a precise per-height-window uniqueness statement whose combination with '
        + 'the functional equation yields σ=½; test it against the known low zeros and check '
        + 'it is not itself trivially equivalent to RH.',
      payoff: 'RH via duality-fixed-point confinement, per height',
      status: 'refuted-as-lever (reformulation): every per-window uniqueness statement that duality '
        + 'upgrades to σ=½ is equivalent to RH(+simple) in the window — count form = Turing / '
        + 'distinct-ordinate program, parity form = Hardy/Levinson, order-parameter form = '
        + 'Sondow–Dumitrescu; missing ingredient = positive-measure correlation inequality (GKS analog) '
        + 'absent for complex weights n^{−it}; see rh-route-f-kramers-wannier-local-uniqueness-2026-09-23.js',
    },
    {
      key: 'G',
      name: 'Log-gas renormalization: block-spin prime freezing',
      idea:
        'Integrate out small primes one octave at a time as a Kadanoff/RG flow on the '
        + 'Euler product, tracking how the zeros move. Identify the RG fixed point and '
        + 'whether the flow preserves (or forces) reality of zeros — an arithmetic analog '
        + 'of the heat-flow real-rootedness preservation.',
      firstTest:
        'Define the octave-freezing RG step precisely; compute zero motion under one step '
        + 'on truncated ζ; test for a monotone drift or an RG fixed point with real zeros.',
      payoff: 'An arithmetic real-rootedness-preserving flow (RG complement to heat flow)',
      status: 'tested — NO-GO for a real-rootedness-preserving lever (rh-route-g-block-spin-rg-freezing-2026-09-23.js): '
        + 'the octave-freezing step zeta -> zeta·∏_{p≤P}(1−p^{−s}) is the P-rough Dirichlet series; the frozen factor '
        + 'is zero-free in the strip (|1−p^{−s}| ≥ 1−2^{−σ} > 0), so nontrivial zeros are EXACT RG fixed points — '
        + 'trivial reality-preservation with zero restoring force. Making the flow move zeros needs truncation, but '
        + 'partial sums have zeros with σ>½ whose rightmost climbs monotonically toward 1 (0.829..0.984, N=8..256; '
        + 'Turán/Montgomery), which the frozen factor cannot repair. RG analogue of the flow-blindness no-go; NO QED. '
        + 'Second pass (rh-route-g-log-gas-rg-prime-freezing-2026-09-23.js): the SELF-DUAL truncation '
        + 'f_w = D_w + χ D_w(1−s) (RS/AFE pair) is the one frame where freezing moves zeros while keeping them '
        + 'on the line; fixed point = half-Gram crystal 1+χ(s) (σ=½ by |χ|=1⟺σ=½, Archimedean, prime-free); '
        + 'freeze force = zero-mean sin(γ log p) mode along the line, no confining drift; reality at frozen stages '
        + '= vacuum dominance r_w<1 that the ζ line never has (r≈2(t/2π)^{1/4}); continuous and density-rescaled '
        + 'variants push zeros off the line; the k=0 end (RS main sum) is already off-line at Lehmer close pairs. '
        + 'No arithmetic real-rootedness-preserving flow found; NOT-A-LEVER',
    },
    // ---- 2026-09-23 second batch: NON-stat-mech paradigms (rh-routes-jkl-non-statmech-external-input-hunt-2026-09-23.js).
    // Route H (Connes–Consani scaling site) is recorded in the sweep synthesis; keys J–M continue the list.
    {
      key: 'J',
      name: 'Arithmetic-geometry import: Weil–Deligne template (Hodge index / tensor power / Künneth) to ℤ',
      idea:
        'RH is proven over function fields (Weil via Castelnuovo on X×X; Deligne via even tensor powers + Landau '
        + 'positivity + rationality; Künneth on X^m to kill the +½ excess). Identify the SHARPEST obstruction to '
        + 'each engine over ℤ and look for a computable finite analog that is a genuine partial.',
      firstTest:
        'Run engine (ii) over ℚ in its k=1 form: the nonnegative-trigonometric-polynomial zero-free region '
        + 'c = 2(√a₁−√a₀)²/S and its Fejér ceiling a₁/a₀ ≤ 2cos(π/(n+2)); identify the k=2 form (prime pairs / PCC) '
        + 'and the self-product needed by engines (i),(iii).',
      payoff: 'A ℤ-analog of Deligne’s weight argument (would give RH outright)',
      status: 'tested — NO external input: engine (ii) = de la Vallée Poussin (classical R = 34.82 reproduced; pure-scheme '
        + 'Fejér floor R ≥ 5.8284; Mossinghoff–Trudgian 5.573 via Stechkin weighting, still c/log t); k=2 = PCC '
        + '(Goldston–Montgomery); engines (i),(iii) need Spec Z ×_{F_1} Spec Z (Kurokawa ζ⊗ζ double Euler product '
        + 'converges only for Re s > 2; closed points are 2-tori since Frobenius = ℝ-flow; infinite-rank H^1 kills the '
        + 'Riemann–Roch count) = Route H. Local-RH import (Ramanujan) moves no archimedean zero-free region.',
    },
    {
      key: 'K',
      name: 'RMT / moments / ratios: pointwise zero constraints from moment identities',
      idea:
        'CFKRS ratios and Keating–Snaith moments are predictive, not provative. Is there a moment/ratio identity '
        + 'that, if proven, gives a zero-free region (pointwise) rather than statistics (on average)?',
      firstTest:
        'Compute Littlewood’s I(T) = ∫₀ᵀ log|ζ(½+it)|dt (RH ⟺ O(log T)) and the Jensen bounds (T/2k)log(M_k/T) from '
        + 'the proven 2nd/4th moments on [0,200]; check the k→0 limit and Keating–Snaith’s (log af)′(0).',
      payoff: 'A moment-provable zero-free region',
      status: 'tested — NO: moments reach zeros only through Littlewood’s INTEGRATED lemma; measured |I(200)| = 0.92 vs '
        + 'Jensen 130.4 (loss 141×, growing ~T/log T); k→0 moment IS Littlewood’s criterion; KS consistent ((log af)′(0)=0 '
        + 'to 3e-8) but not informative. Negative moments are the pointwise channel and are RH-EQUIVALENT (finite forms = '
        + 'mollifiers, Levinson κ lineage); ratios conjecture presupposes quasi-RH in its shift range. Ceiling = Lindelöf ⇒ '
        + 'Density Hypothesis. Wall = Jensen/integration, not Weil positivity.',
    },
    {
      key: 'L',
      name: 'Explicit operator: Li–Herglotz–CMV unitary truncation from Taylor data of ξ (no zeros)',
      idea:
        'Not "does a Hilbert–Pólya operator exist" but a CONCRETE finite candidate: the CMV (unitary five-diagonal) '
        + 'matrix of the Herglotz measure ν_a = Σ_ρ 4a²/(a²+γ²) δ_{θ_ρ} whose moments are second differences of the '
        + 'generalized Li coefficients λ_n(a) = Σ_ρ[1−((ρ−½−a)/(ρ−½+a))ⁿ], computable from ξ′/ξ at Re s ≥ 1.55 alone. '
        + 'Toeplitz PD ∀N ⟺ RH (Herglotz + Bombieri–Lagarias).',
      firstTest:
        'Compute λ_n(a) to 200 digits from ξ′/ξ (Cauchy on |z|=0.9), run Szegő/Levinson for the Verblunsky parameters, '
        + 'build the N×N CMV matrix, compare eigen-angles with θ_k = π−2atan(γ_k/a); splice a synthetic off-line '
        + 'quadruple into the exact moments and measure the detection order N_det(γ₀, δ).',
      payoff: 'A finite unitary operator whose spectrum tracks the zeros for a non-circular reason; a finite RH certificate',
      status: 'tested — reality forced NON-circularly, RH-content = resolved zeros only: at a=20 the form is PD through '
        + 'order 400 (min 1−|α| = 0.031), the 400×400 unitary matrix reproduces 39 of the first 40 zeros to 1e-12 in angle '
        + 'with exact weights; N_det ≈ N_res(γ₀) + O(log 1/δ) (γ₁: 9–14, γ₂₀: 96–115, γ₄₀ undetected at 400) — reach '
        + 'γ_{N/10}, linear in N, verified-height-dominated; completeness = Weil positivity (finer Schur filtration of Li). '
        + 'Exact Keiper λ_n (n ≤ 400) closes the imp-2426 sub-gap. NOT-A-LEVER; best finite-certificate infrastructure so far.',
    },
    {
      key: 'M',
      name: 'Nyman–Beurling Gram matrix via Vasyunin cotangent sums + Bettin–Conrey reciprocity',
      idea:
        'd_N² = 1 − bᵀG⁻¹b with Vasyunin’s exact cotangent-sum Gram entries; Bettin–Conrey’s period-function '
        + 'reciprocity is modular input absent from every soft route. RH ⟺ d_N → 0.',
      firstTest:
        'Compute G_N exactly to N ≤ 500, d_N² against (Σ_ρ|ρ|⁻²)/log N = 0.0462/log N; test whether the reciprocity '
        + 'bounds the Gram inverse non-perturbatively (the Möbius-coefficient version is the mollifier lineage).',
      payoff: 'A non-mollifier NB bound',
      status: 'tested — COLLAPSES to the mollifier lineage (rh-route-m-nyman-beurling-vasyunin-reciprocity-2026-09-23.js): '
        + 'exact Vasyunin Gram to N=500 gives d_N² log N / Σ|ρ|⁻² = 0.998 (on the Burnol floor; mpmath-30 agrees to 1e-12); '
        + 'G = rank-4 smooth + cotangent matrix with V(h/k) = −c₀(h̄/k) (Estermann-inverse argument); Bettin–Conrey reciprocity '
        + 'verified (ΔR·k² → ±0.1648, π/36k expansion) but every Euclid-depth truncation of the reciprocity descent and the '
        + '2-term period-function surrogate leave G INDEFINITE at 1e-3 relative error while positivity lives at λ_min/λ_max = 1e-6; '
        + 'λ_min ∝ N^{−1.92} is the zero-free [1/max(h,k)] law; residual |1+ζD_N|² = 1 at every zero, d_N² = Σ|ρ|⁻²/log N to 0.2%. '
        + 'Pinpoint: cot sum = Estermann D(0,x) = off-diagonal of the twisted 2nd moment; reciprocity = Estermann FE = functional '
        + 'equation of ζ (BC §3–4) = the Conrey-1989 θ<4/7 input. No partial escape; NOT-A-LEVER.',
    },
  ],

  honestNote:
    'These are exploratory routes, not results. Several will collapse to known obstructions '
    + '(Weil-positivity / PCC / verified-height); the value is that A, B, D use the '
    + 'functional equation and the primes as ACTIVE tools (reflection positivity, arithmetic '
    + 'flow, confinement) rather than soft inputs the flow-blindness no-go rules out. Worked '
    + 'in sequence A→G; each records a proof-sketch, a refutation, or a precise next test.',
});

export const RH_NOVEL_ROUTES_ASSERTIONS = Object.freeze([
  {
    id: 'roadmap-has-seven-routes',
    holds: () => RH_NOVEL_ROUTES.routes.length === 11
      && RH_NOVEL_ROUTES.routes.slice(0, 7).every((r) => /^[A-G]$/.test(r.key))
      && RH_NOVEL_ROUTES.routes.slice(7).map((r) => r.key).join('') === 'JKLM',
    why: 'Seven stat-mech routes A–G (first batch) plus the 2026-09-23 non-stat-mech batch J, K, L (first-tested) and M (proposed); Route H lives in the sweep synthesis.',
  },
  {
    id: 'every-route-has-a-concrete-first-test',
    holds: () => RH_NOVEL_ROUTES.routes.every((r) => typeof r.firstTest === 'string' && r.firstTest.length > 40),
    why: 'Each route must carry a concrete, computable/provable first test — a roadmap, not slogans.',
  },
  {
    id: 'honest-no-results-claimed',
    holds: () => /ROADMAP/.test(RH_NOVEL_ROUTES.status) && /RH open/.test(RH_NOVEL_ROUTES.status),
    why: 'No false QED: this is a roadmap of tests, not results; RH stays open.',
  },
]);

export default RH_NOVEL_ROUTES;
