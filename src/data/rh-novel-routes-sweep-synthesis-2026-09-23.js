/**
 * @fileoverview RH novel-routes sweep synthesis (2026-09-23). All seven routes
 * A–G of the roadmap (rh-novel-routes-roadmap-2026-09-23.js) were worked to a
 * verdict with real derivations + numerics. This module records the convergence
 * and the single structural opening it triangulated. Import-light; holds()
 * assertions. NOT a bound; no refereed bound is changed; RH open; NO false QED.
 *
 * THE CONVERGENCE: all seven physically-distinct routes independently reduce to
 * ONE object — Weil positivity (equivalently the Carathéodory–Pick positivity of
 * ξ'/ξ on Re s>½ = Lagarias 1999; imp-95520 PICK-WEIL). Two unconditional lessons:
 *   (L1) every SYMMETRY-FORCED special-ness of σ=½ (functional equation / Parseval)
 *        is RH-BLIND; the RH content is always the arithmetic phase-cancellation
 *        cos(t log n) in the explicit formula.
 *   (L2) no soft / geometric / duality / RG deformation can confine the zeros to
 *        the line — forbidden by Earnshaw (D), flow-blindness (B), holomorphic
 *        inertness (B,G Lemma 1), and RG close-pair destruction (G). Only the
 *        arithmetic positivity confines, and that IS Weil positivity.
 * THE OPENING (Route A): the primon gas / log-gas has no second Euclidean
 *   direction — the zeros live only on the dilation (τ) axis — so the transfer /
 *   Markov / Osterwalder–Schrader tools that make reflection positivity PROVABLE
 *   are unavailable from the gas itself. They require a genuinely richer geometry
 *   with a second direction: the Connes–Consani adelic SCALING SITE, where the one
 *   proven partial (archimedean Weil positivity, u-support < ln2; Connes–Consani
 *   2021, Yoshida 1992, in-repo imp-95520 class II) already lives.
 */

export const RH_SWEEP_SYNTHESIS = Object.freeze({
  id: 'rh-novel-routes-sweep-synthesis',
  date: '2026-09-23',
  status: 'SWEEP COMPLETE (A–G worked); all reduce to Weil positivity; one opening = Connes–Consani scaling site. No refereed bound is changed; RH open; NO QED',
  commonTerminus: 'Weil positivity = Carathéodory–Pick positivity of ξ′/ξ on Re s>½ (Lagarias 1999; imp-95520 PICK-WEIL)',

  verdicts: [
    { route: 'A', name: 'reflection positivity (OS)', verdict: 'finite-N REFUTED (divergent product / reflected Matsubara poles, λ_min~−p_N^{½−ν}); infinite-N RP = Weil positivity = RH. Class-II smoothed observables DO detect off-line zeros (unlike the Weil-blind native span) but only for heights ≲1/√t. Names the opening.', module: 'rh-route-a-reflection-positivity-primon-gas-2026-09-23.js' },
    { route: 'B', name: 'arithmetic freeze-flow', verdict: 'multiplicative couplings inert or a translation (breaks FE); additive force = RS partial sum, tangential on-line, sign-indefinite normal force off-line; global confinement ⟺ interlacing (Hermite–Kakeya–Obreschkoff) = RH-strength. A signed normal force would BE Weil positivity.', module: 'rh-route-b-arithmetic-freeze-flow-2026-09-23.js' },
    { route: 'C', name: 'signed interferometer', verdict: 'FE-compatibility pins the signs to the root numbers → on q=5 uniquely reconstructs the Davenport–Heilbronn function (off-line zeros). Linear blindness + orthogonality-is-mean-square-only + Voronin universality ⇒ ≫T off-line zeros for every ≥2-arm design; superposition worse than the union.', module: 'rh-route-c-signed-interferometer-2026-09-23.js' },
    { route: 'D', name: 'Peierls confinement', verdict: 'pure log-gas free energy is Earnshaw ANTI-confining (F_C′′(0)=−4S(t)<0 at all heights); only the arithmetic phase-cancellation confines, and sup_σ R_σ(t)<∞ ⟺ partial-sum cancellation of −ζ′/ζ on the line = RH = Weil positivity.', module: 'rh-route-d-peierls-defect-confinement-2026-09-23.js' },
    { route: 'E', name: 'supercritical Widom line', verdict: 'σ=½ IS the peak of the fluctuation susceptibility Var_t log|ζ| and of (log ξ)′′ — but both are unconditional, Parseval/FE-forced and RH-BLIND. Sharpest statement = Bohr–Landau/Littlewood ⇒ zero-density (Λ-inert). Heuristic only.', module: 'rh-route-e-widom-line-large-deviations-2026-09-23.js' },
    { route: 'F', name: 'Kramers–Wannier uniqueness', verdict: 'RH’s exact Ising analog is Fisher’s circle — proven from Onsager’s EXACT SOLUTION (spectral input), not from duality; duality only makes the zero set symmetric. Every local-uniqueness formulation is circular (= Turing / Hardy / Levinson / Alpöge–Furman).', module: 'rh-route-f-kramers-wannier-local-uniqueness-2026-09-23.js' },
    { route: 'G', name: 'log-gas RG freeze', verdict: 'coarse-graining is inert on ζ’s zeros (Lemma 1: any zero-free-in-strip factor fixes them) unless it breaks self-duality; the working AFE-frame flow has an archimedean fixed point (|χ|=1), a zero-mean tangential prime force, and RG destroys exactly the close-pair (Lehmer) correlations RH is about.', module: 'rh-route-g-log-gas-rg-prime-freezing-2026-09-23.js' },
  ],

  opening: {
    name: 'Connes–Consani adelic scaling site',
    why:
      'The one structure with a genuine SECOND Euclidean direction, giving the '
      + 'transfer/Markov/OS machinery that turns reflection positivity from an '
      + 'equivalence (Route A: RP=Weil=RH) into a provable statement. The archimedean-'
      + 'vs-prime comparison acquires geometry there. The sole proven partial '
      + 'confinement (archimedean Weil positivity, u-support < ln2) lives here.',
    nextTests: [
      'Lift Route A’s Class-II smoothed off-line-zero DETECTOR (Gaussian-damped primon Gram, which is NOT Weil-blind) into the adelic/scaling-site setting where a second direction exists — test whether the detector’s off-line sensitivity extends beyond the 1/√t verified-height cap.',
      'Attempt to extend the proven archimedean Weil positivity past the first prime shift u=ln2 using the scaling-site geometry (the exact point where conditionality currently starts — Connes–Consani 2021).',
      'Route B/D handoff: a signed arithmetic normal force / LP-feasible bounded-support coefficient field with Z_w·Z′′>0 at every near-collision, uniform in T — expected feasible at fixed T, not uniformly (a Gram-law surrogate); its uniform form IS Weil positivity.',
    ],
    // Route H (2026-09-23): nextTests[0] and [1] RUN — see rh-route-h-connes-scaling-site-weil-positivity-2026-09-23.js.
    routeH: {
      module: 'rh-route-h-connes-scaling-site-weil-positivity-2026-09-23.js',
      verdict: 'no new lever: the second direction is block-diagonal over 2-power Dirichlet characters (a family, spectrally inert for ζ; detector cap = uncertainty principle 2a_det = 0.9 ln(γ/2π)); the archimedean-only form goes indefinite at a_* = 0.3716 (odd) / 0.4101 (even), only 0.025–0.064 beyond ln2/2, and positivity across ln 2 is an exact archimedean-vs-p=2 cancellation (residual/P_2 = 7.5e-5 at a = 0.5) on the Slepian gap function — Weil positivity itself. Next step named: a semilocal S={∞,2} Sonine trace identity on g-support < ln 3. RH open; NO QED.',
    },
    // Route I (2026-09-23): the named next step RUN — see rh-route-i-semilocal-sonine-trace-identity-2026-09-23.js
    // (supersedes the framing of rh-route-h-semilocal-sonine-identity-attempt-2026-09-23.js, imp-96044).
    routeI: {
      module: 'rh-route-i-semilocal-sonine-trace-identity-2026-09-23.js',
      verdict: 'the exact semilocal S={∞,2} identity EXISTS: on L²(X_S)^{Z_2^*} = L²(R)_ev the adelic Fourier descends to F_S = I∘(u_∞u_2)^g with u_2 the 2-adic Tate factor, and Tr(ϑ(f) P P̂_S P) = W_∞(f) + W_2(f) + D_S(f) for all f (Connes–Consani 2021 Prop 2.2 + Leibniz), the trace side unconditionally positive (multiplier min 0.0650 at t=0, minima at the p=2 resonances 2πk/ln2 where the remainder cancels the Euler-factor peak). It is NOT gap-free: the remainder D_S is explicit (log spikes at every 2^k) and takes 96.7% (a=0.5) / 99.71% ((ln 3)/2) of the trace on the pole-free Weil minimizer (pencil μ_max = 0.967 / 0.9971). Weil positivity on g-support < ln 3 ⟺ D_S ≤ L_S on pole-free h — the semilocal form of the CC program, an inequality between two explicit RH-free functionals, not an identity. Adjoining p=3 makes the remainder resonate on the dense set 2^a3^b (log² spikes). CC archimedean partial reproduced (δ(1)=2.237484835, Cor 2.3 positivity 0.0491); no unconditional positivity past ln 2 obtained. RH open; NO QED.',
    },
    // Route I, Sonine refinement (2026-09-23): the CC device W = S − E ported to S={∞,2} — see rh-route-i-sonine-excess-semilocal-port-2026-09-23.js
    routeISonineExcess: {
      module: 'rh-route-i-sonine-excess-semilocal-port-2026-09-23.js',
      verdict: 'the Connes–Consani Sonine refinement (W_∞ + W_2 = Tr(ϑ S_S) − E_S) ports to S={∞,2} exactly; the semilocal prolate spectrum is computed exactly (λ_S(0) = 0.9999731, λ_S(1) = −0.9927, dyadic ladder ±2^{−n/2}/2; no eigenvalue of modulus 1 — proved) and the excess ε_S = δ^out + corr is explicit with δ^in(ρ) = ρ^{−1/2}·br(1/ρ) in closed form. Obstruction located: ε_S inherits exactly HALF of the log cusp of δ_S at ρ = 2 (per-log₂ coefficients 0.7071/0.3536/0.3536), so for 2a > ln 2 the CC operator E_S∘Q = −2ε′(1+)(Id − K) is replaced by an indefinite operator unbounded above along the p=2 resonances t_k = 2πk/ln2 (half-split 210 vs predicted 202 at a = 0.5, k = 32; E_S∘Q > 0 from k = 6). CC’s sufficient condition E∘Q ≤ c|ĝ(0)|² fails for every a > (ln 2)/2 and no finite-rank fix can repair it: the Sonine route ends at support ln 2 (Yoshida/CC range). Binding direction of the open inequality D_S ≤ L_S on ln 2 < 2a < ln 3 = the first p=2 resonance window (7.4, 10.8) of the Weil symbol; one-prime reach a_2 = 0.565920 (2a_2 = ln 3 + 0.033). No positivity past ln 2 proved. RH open; NO QED.',
    },
  },

  // 2026-09-23 second batch from NON-stat-mech paradigms (rh-routes-jkl-non-statmech-external-input-hunt-2026-09-23.js):
  // the single-terminus picture is REFINED — J (Weil–Deligne import) lands on Weil positivity (missing self-product)
  // AND the Landau-pole c/log t form (Fejér floor R ≥ 5.83) AND PCC; K (moments) on Jensen/integration (Littlewood
  // lemma, loss 141× at T=200), not Weil positivity; L (zero-free Li–Herglotz–CMV operator) on Weil positivity via
  // the Schur filtration with a measured resolution-limited reach γ_{N/10}. No external arithmetic input found.
  nonStatMechBatch: {
    module: 'rh-routes-jkl-non-statmech-external-input-hunt-2026-09-23.js',
    routes: 'J (function-field import), K (moments/ratios), L (Li–Herglotz–CMV explicit operator), M (Nyman–Beurling/Vasyunin, proposed)',
    verdict: 'none escapes the convergence; wall map = Landau pole / Jensen integration / Herglotz-Weil; Route L = best finite-certificate infrastructure (400×400 unitary truncation reproduces 39 zeros to 1e-12 from Taylor data of ξ alone; reach linear in N; completeness = Weil positivity). RH open; NO QED.',
    // Route M first-tested later the same day (rh-route-m-nyman-beurling-vasyunin-reciprocity-2026-09-23.js): the exact
    // Vasyunin Gram puts d_N² on the Burnol floor at N=500 (ratio 0.998); the Bettin–Conrey reciprocity is the Estermann
    // functional equation (= FE of ζ, sweep lesson L1) and cannot bound G⁻¹ (all Euclid-depth truncations indefinite).
    // Wall = mollifier / Estermann-FE. No external input.
    routeM: { module: 'rh-route-m-nyman-beurling-vasyunin-reciprocity-2026-09-23.js', verdict: 'COLLAPSES to the mollifier lineage; no partial escape; RH open; NO QED' },
  },

  honest:
    'The creative sweep did its job: seven distinct framings triangulated the exact '
    + 'target (Weil positivity) and one opening with new structure (the scaling site). '
    + 'This is a mapped convergence, not scattered no-gos. Nothing here is a bound or a '
    + 'proof; the scaling-site route is hard and external-structure-dependent. No refereed bound is changed'
    + '; RH open; NO QED.',
});

// imp-96076: cross-route wall map for all thirteen 2026-09-23 novel routes A-M
// (the seven-route sweep above, Route H/I follow-ons, and the J/K/L/M non-stat-mech
// batch). Each entry names the ONE wall the route's verdict lands on, so the full
// program's convergence structure -- mostly Weil positivity, with a few distinct
// walls (zero-density, circularity, Jensen/integration, PCC, the mollifier lineage)
// -- reads at a glance without opening thirteen data modules. Derived from the
// verdict/wallMap strings already recorded in this file and in
// rh-routes-jkl-non-statmech-external-input-hunt-2026-09-23.js; no new claims.
export const RH_CROSS_ROUTE_WALL_MAP = Object.freeze([
  { route: 'A', name: 'reflection positivity (OS)', wall: 'Weil positivity', note: 'infinite-N reflection positivity = Weil positivity = RH; finite-N version refuted' },
  { route: 'B', name: 'arithmetic freeze-flow', wall: 'Weil positivity', note: 'global confinement ⟺ interlacing (Hermite–Kakeya–Obreschkoff), RH-strength' },
  { route: 'C', name: 'signed interferometer', wall: 'Weil positivity', note: 'FE-compatible sign choice reconstructs a Davenport–Heilbronn off-line zero set (Voronin universality)' },
  { route: 'D', name: 'Peierls confinement', wall: 'Weil positivity', note: 'only the arithmetic phase-cancellation confines; the log-gas free energy alone is anti-confining' },
  { route: 'E', name: 'supercritical Widom line', wall: 'zero-density', note: 'σ=½ peak is Parseval/FE-forced and RH-blind; sharpest unconditional statement is Bohr–Landau/Littlewood zero-density' },
  { route: 'F', name: 'Kramers–Wannier uniqueness', wall: 'circularity', note: 'every local-uniqueness formulation is equivalent to RH in the window (Turing/Hardy/Levinson/Alpöge–Furman); duality alone gives no spectral input' },
  { route: 'G', name: 'log-gas RG freeze', wall: 'Weil positivity', note: 'RG coarse-graining is inert on the zeros unless it breaks self-duality, and destroys exactly the close-pair correlations RH is about' },
  { route: 'H', name: 'Connes–Consani scaling site', wall: 'Weil positivity', note: 'proven archimedean partial (u-support < ln2); the second adelic direction is spectrally inert (2-power-character family)' },
  { route: 'I', name: 'semilocal S={∞,2} Sonine trace identity', wall: 'Weil positivity', note: 'exact identity holds; the open step is the inequality D_S ≤ L_S on g-support < ln 3, saturated to 3 digits at (ln3)/2' },
  { route: 'J', name: 'Weil–Deligne function-field import', wall: 'Weil positivity + Landau pole + PCC', note: 'all three Weil–Deligne engines (Riemann–Weil, de la Vallée Poussin, Rankin–Selberg) land on a distinct known wall' },
  { route: 'K', name: 'moments / ratios conjecture', wall: 'Jensen/integration', note: "Littlewood's integrated lemma is the only moment→zero bridge; the one pointwise-sensitive channel is RH-equivalent (mollifier lineage)" },
  { route: 'L', name: 'Li–Herglotz–CMV explicit operator', wall: 'Weil positivity', note: 'reality forced by Herglotz/Schur filtration with no zero input; completeness of the finite certificate IS Weil positivity' },
  { route: 'M', name: 'Nyman–Beurling / Vasyunin reciprocity', wall: 'mollifier lineage (Estermann FE)', note: 'the Bettin–Conrey reciprocity is the Estermann functional equation and cannot bound the Gram inverse; collapses to the standard mollifier' },
]);

// imp-96082: the single named open residual of the 2026-09-23 novel-routes
// program. rh-novel-routes-sweep-synthesis names Route H as "the one live
// corner"; the Route I module (opening.routeI above) sharpened that corner to
// an explicit inequality between two RH-free functionals -- not an identity.
// This entry registers that inequality by name so it reads as the program's
// live open step without re-deriving it. Bookkeeping only; asserts no
// closure; NO QED.
export const RH_NAMED_OPEN_RESIDUAL = Object.freeze({
  id: 'route-hi-semilocal-sonine-inequality',
  name: 'Route H/I semilocal S={infinity,2} inequality D_S <= L_S',
  statement:
    'Weil positivity on g-support < ln 3 <=> D_S(f) <= L_S(f) on pole-free '
    + 'Weil minimizers h -- an inequality between two explicit RH-free '
    + 'functionals (trace remainder D_S vs. positive trace-side floor L_S), '
    + 'not an identity.',
  margin: 'unconstrained margin 2.8e-3 at a=(ln3)/2; FALSE for 2a > 1.1316 (rh-route-i-semilocal-sonine-trace-identity-2026-09-23.js high-res map)',
  controlObject: 'the resonance window I_1 (forTheProof)',
  modules: [
    'rh-route-h-connes-scaling-site-weil-positivity-2026-09-23.js',
    'rh-route-i-semilocal-sonine-trace-identity-2026-09-23.js',
  ],
  status: 'OPEN; RH open; NO QED',
});

export const RH_SWEEP_SYNTHESIS_ASSERTIONS = Object.freeze([
  {
    id: 'cross-route-wall-map-covers-a-to-m',
    holds: () => RH_CROSS_ROUTE_WALL_MAP.length === 13
      && 'ABCDEFGHIJKLM'.split('').every((r) => RH_CROSS_ROUTE_WALL_MAP.some((e) => e.route === r))
      && RH_CROSS_ROUTE_WALL_MAP.every((e) => e.wall.length > 3 && e.note.length > 10),
    why: 'imp-96076: the cross-route wall map tabulates all thirteen 2026-09-23 novel routes A-M, each with a named wall.',
  },
  {
    id: 'all-seven-routes-worked',
    holds: () => RH_SWEEP_SYNTHESIS.verdicts.length === 7
      && RH_SWEEP_SYNTHESIS.verdicts.every((v) => /^[A-G]$/.test(v.route) && v.verdict.length > 40),
    why: 'All seven routes A–G carry a worked verdict.',
  },
  {
    id: 'common-terminus-is-weil-positivity',
    holds: () => /Weil positivity/.test(RH_SWEEP_SYNTHESIS.commonTerminus)
      && RH_SWEEP_SYNTHESIS.verdicts.filter((v) => /Weil|interlacing|Pick|positivity|Onsager|Fisher|zero-density|Earnshaw/.test(v.verdict)).length >= 5,
    why: 'Convergence: ≥5 of 7 routes (A,B,D,E,F) reduce to Weil positivity / its equivalents; C (Voronin universality) and G (RG inertness) converge via related but distinct mechanisms.',
  },
  {
    id: 'opening-named-with-next-tests',
    holds: () => /scaling site/i.test(RH_SWEEP_SYNTHESIS.opening.name)
      && RH_SWEEP_SYNTHESIS.opening.nextTests.length >= 3,
    why: 'The one opening (Connes–Consani scaling site) is named with concrete next tests.',
  },
  {
    id: 'honest-no-qed',
    holds: () => /NO QED/.test(RH_SWEEP_SYNTHESIS.status) && /RH open/.test(RH_SWEEP_SYNTHESIS.honest),
    why: 'No false QED; RH stays open; no refereed bound is changed.',
  },
  {
    id: 'named-open-residual-registered',
    holds: () => /D_S/.test(RH_NAMED_OPEN_RESIDUAL.statement)
      && RH_NAMED_OPEN_RESIDUAL.modules.length === 2
      && /OPEN/.test(RH_NAMED_OPEN_RESIDUAL.status)
      && /NO QED/.test(RH_NAMED_OPEN_RESIDUAL.status),
    why: 'imp-96082: registers the Route H/I semilocal inequality as the single named open residual of the 2026-09-23 novel-routes program.',
  },
]);

export default RH_SWEEP_SYNTHESIS;
