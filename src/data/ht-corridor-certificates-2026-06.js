// ht-corridor-certificates-2026-06.js
//
// Rigorous interval-certified Rouché corridor certificates on the
// de Bruijn–Newman heat flow H_t, produced by the twin_ladder_rh_repo
// engine (sister repository) in June 2026, in the CORRECT literature
// (Polymath15 / Tao) normalization after a factor-4 kernel bug was
// caught and fixed.
//
// Source repo: ~/Downloads/twin_ladder_rh_repo, branch exp/corridor-audit-v0.
// Key commits: 4fb32e2 (direct E bound), 234139e (normalization fix),
//              167ae80 (corrected sweep results).
// Key docs:    docs/ht_corrected_sweep_results.md,
//              docs/M4_rigorous_V1_landing.md,
//              docs/theorem_ht_exterior_tail_plan.md.

export const htCorridorMeta = {
  title: 'H_t Corridor Certificates (interval-rigorous)',
  date: '2026-06-09',
  t: 0.18,
  eta: 0.14142,
  h: 0.22,
  conditionalLambdaTarget: 0.19,
  normalization:
    'Standard (Polymath15/Tao): H_t(x) = ∫₀^∞ e^{tu²} Φ(u) cos(xu) du, ' +
    'Φ(u) = Σ (2π²n⁴e^{9u} − 3πn²e^{5u}) e^{−πn²e^{4u}}; H_0 zeros at x = 2γ_n.',
  engineModulus:
    'Each PIN is unconditional modulo: (i) python-flint arb/acb ball arithmetic, ' +
    '(ii) closed-form Φ-derivative formulas (cross-checked vs finite differences ' +
    'and mpmath), (iii) the quintic-Hermite value-error formula with the ' +
    'Peano-verified constant 1/46080. No GRH. No sampling.',
};

// Certified corridor cells: H_{0.18} has exactly one zero in each
// conjugation-symmetric rectangle |Re x − x_n| ≤ h, |Im x| ≤ η, and by
// Schwarz symmetry that zero is real.
export const htCorridorCells = [
  { cell: 1, x: 28.1652, mesh: 0.0125,    nSeg: 4096,   E: 1.522e-10, m: 1.249e-5,  V: 1.218e-5, status: 'PIN',  runtime: '24 s' },
  { cell: 2, x: 41.9084, mesh: 0.0125,    nSeg: 4096,   E: 1.522e-10, m: 1.634e-7,  V: 9.315e-4, status: 'PIN',  runtime: '23 s' },
  { cell: 3, x: 49.9162, mesh: 0.0125,    nSeg: 4096,   E: 1.522e-10, m: 1.148e-8,  V: 1.326e-2, status: 'PIN',  runtime: '23 s' },
  { cell: 4, x: 60.6787, mesh: 0.00625,   nSeg: 16384,  E: 1.433e-12, m: 2.199e-10, V: 6.518e-3, status: 'PIN',  runtime: '187 s' },
  { cell: 5, x: 65.7855, mesh: 0.00625,   nSeg: 16384,  E: 1.433e-12, m: 2.899e-11, V: 4.945e-2, status: 'PIN',  runtime: '194 s' },
  { cell: 6, x: 75.0217, mesh: 0.00625,   nSeg: 131072, E: 1.433e-12, m: 1.646e-12, V: 8.710e-1, status: 'PIN',  runtime: '28 min' },
  { cell: 7, x: 81.6838, mesh: 0.003125,  nSeg: 262144, E: 1.519e-14, m: 6.437e-14, V: 2.359e-1, status: 'PIN',  runtime: '101 min' },
  { cell: 8, x: 86.5723, mesh: 0.0015625, nSeg: 524288, E: 1.816e-16, m: null,      V: null,     status: 'RETRY IN FLIGHT (predicted V ≈ 0.016)', runtime: '~7 h' },
];

// The verified error-bound toolkit behind the certificates.
export const boundToolkit = [
  {
    id: 'peano-constants',
    title: 'Peano-verified Hermite constants',
    detail:
      'Quintic-Hermite value error sup|K−P| ≤ (1/46080)·h⁶·sup|K⁽⁶⁾| and ' +
      '3rd-derivative error sup|K‴−P‴| ≤ (1/120)·h³·sup|K⁽⁶⁾|. Both constants ' +
      'derived via the Peano kernel and locked in by tests: the machinery ' +
      'reproduces the known 1/46080 to 20+ digits, and the 1/120 bound holds ' +
      'against exact arb derivatives with ≥ 2.9× margin on real K_t cells.',
  },
  {
    id: 'regime-map',
    title: 'Integration-by-parts regime map',
    detail:
      'For the oscillatory residual ∫(K−P)cos(zu)du the by-parts ladder has an ' +
      'exact crossover structure: E_direct/E_2parts = (h|z|)²/24 and ' +
      'E_3parts/E_2parts = 16/(h|z|). In the fine-mesh regime h|z| < √24 used ' +
      'here, the 0-parts DIRECT value-error bound is optimal — it beat the ' +
      '2-parts bound by 84–852× and collapsed what had looked like a hard wall ' +
      'at cell 6. More integrations by parts only pay on coarse meshes ' +
      '(h|z| > 16). Empirically confirmed to ~1% against predictions.',
  },
  {
    id: 'lipschitz-net-m',
    title: 'Lipschitz-and-net lower bound for m = inf|G_t|',
    detail:
      'At each of n boundary segments, |G_t| is evaluated tightly at the ' +
      'midpoint and the deviation over the segment is bounded by ' +
      '|G_t′|_box × radius (G_t′ in closed form via ∫(−uP)sin(zu)du in acb). ' +
      'Segments needed scale like 1/m ~ e^{πx/8} — the exponential m-resolution ' +
      'cost is the structural limit of fixed-precision corridor certification.',
  },
  {
    id: 'dependency-problem',
    title: 'Negative result: interval-subtraction 3-parts bound',
    detail:
      'Estimating sup|K‴−P‴| by subtracting two interval evaluations fails by ' +
      '~10⁵× regardless of coordinates: the difference width is dominated by ' +
      'the variation of K‴ over the box, not the true gap (interval dependency ' +
      'problem). The fix that works is the analytic Peano constant, which ' +
      'bounds the difference function directly.',
  },
];

// The normalization bug post-mortem — kept public per the project's
// audit-culture ethos.
export const normalizationPostMortem = {
  title: 'The factor-4 normalization bug (caught before any public claim)',
  body:
    'The first implementation of the kernel used exponents 9u/2, 5u/2, 2u — ' +
    'i.e. Φ_code(u) = Φ_lit(u/2), giving H_code_t(z) = 2·H_lit_{4t}(2z). Every ' +
    'early certificate at "t = 0.18" was therefore a TRUE rigorous statement ' +
    'about the literature H_{0.72} — where de Bruijn (1950) already proved all ' +
    'zeros real. Valid theorems, Λ-vacuous. The bug was found when a research ' +
    'agent auditing the exterior-tail plan against Polymath15 noticed the ' +
    'engine H_0 vanished at γ₁ = 14.1347 instead of 2γ₁ = 28.2695. It was ' +
    'independently verified (Φ_code(u) = Φ_lit(u/2) to 30 digits), the kernel ' +
    'and all derivative chains fixed (Faà di Bruno tables rescale by 2^k since ' +
    'c′ = 4c), a regression-guard test added asserting H_0 does NOT vanish at ' +
    'the raw ordinate, and the full sweep re-run in the correct normalization ' +
    'the same day. Lesson: normalization conventions are load-bearing; audit ' +
    'against the literature BEFORE quoting Λ-relevant numbers.',
};

// Honest scope assessment (from the exterior-tail research memo).
export const scopeAssessment = {
  title: 'What this does and does not mean for Λ',
  does: [
    'Demonstrates end-to-end, in the correct normalization, a locally ' +
      'checkable interval-certification technique for H_t zero localization ' +
      '(corridor + Rouché + verified Hermite bounds), per twin-ladder paper ' +
      '§14.18–14.19.',
    'Each certified cell is an unconditional theorem: H_{0.18} has exactly one ' +
      'zero in the corridor, and that zero is real.',
    'The configuration (t, η) = (0.18, 0.14142) has conditional target ' +
      'Λ ≤ t + η²/2 = 0.19.',
  ],
  doesNot: [
    'It does NOT yield Λ ≤ 0.19. The Newman-flow conclusion needs the strip ' +
      'certified for ALL x up to the Polymath15 analytic-tail handoff at ' +
      'x ≈ 2×10¹³ — eleven orders of magnitude beyond this window ' +
      '(≈10³ core-years at current per-cell cost).',
    'Platt-style RH verification + Polymath15 machinery already imply ' +
      'Λ ≤ ~0.19 without corridors; the contribution here is methodological, ' +
      'not a record.',
  ],
};

export const crossLinks = [
  { label: 'Twin-ladder paper §14.18 (Lyapunov barrier)', to: '/paper' },
  { label: 'Rigorous Numerics stages (§20)', to: '/rigorous-numerics-stages' },
  { label: 'Twin Ladder overview', to: '/twin-ladder' },
];
