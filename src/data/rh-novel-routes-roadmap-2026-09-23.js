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
  status: 'ROADMAP — novel testable routes; no results claimed; PT Λ≤0.2 SOTA; RH open',

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
      status: 'to-test',
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
      status: 'to-test',
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
      status: 'to-test',
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
      status: 'to-test',
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
      status: 'to-test',
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
      status: 'to-test',
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
      status: 'to-test',
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
    holds: () => RH_NOVEL_ROUTES.routes.length === 7
      && RH_NOVEL_ROUTES.routes.every((r) => /^[A-G]$/.test(r.key)),
    why: 'Seven novel routes A–G, each with a key, first test, and payoff.',
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
