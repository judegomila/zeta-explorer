/**
 * @module guth-maynard-alpha-half-scoping-2026-07-10
 * @fileoverview
 * RH-ADJACENT scoping of the α=1/2 large-value case for Dirichlet polynomials —
 * the named bottleneck toward the Density Hypothesis A(σ)≤2 near σ=3/4.
 *
 * FIREWALL (read first): this is frontier analytic number theory about *upper*
 * bounds on off-line zeros (zero-density). It is Λ-INERT and NOT RH progress —
 * a density bound is a positive count bound, can never certify N=0, so it cannot
 * move the rigorous de Bruijn–Newman Λ≤0.2 in either direction. No Λ movement,
 * no RH progress claimed. See [[project_pt_floor_binds_on_verified_height]].
 */

export const GM_SCOPING_META = {
  date: '2026-07-10',
  label: 'RH-ADJACENT frontier (Λ-inert, not RH progress)',
  problem:
    'C(σ,α) = least exponent with #{1-separated t : |D(t)| ≥ N^σ} ≤ T^{C+o(1)} for D(t)=Σ b_n n^{-it}, ' +
    '|b_n|≤1, n≍N=T^α, t≍T. Two mechanisms: C(σ,α) ≤ min( (2−2σ)α , 1+(4−6σ)α ) (L²/large-sieve vs ' +
    'Halász–Montgomery double-sum), crossing at value exponent σ=3/4.',
};

// The task's "α=1/2 ⇔ N^{1/2}" was imprecise — four distinct scales:
export const SCALE_CLARIFICATION = [
  { scale: 'N^{1/2}', role: 'L² RMS floor — ∫|D|²≍N, so "large" only begins here (not the hard case).' },
  { scale: 'N^{3/4}', role: 'THE critical L²/Halász–Montgomery crossover — Guth–Maynard’s "critical situation"; where neither mechanism has slack.' },
  { scale: 'α = 1/2', role: 'the LENGTH bottleneck (N≍T^{1/2}, from Riemann–Siegel). Tao: "only the α=0.5 case prevents improving A(0.9)."' },
  { scale: 'σ = 3/4', role: 'the zeta-zero abscissa where the density exponent A(σ) is maximal — the Density-Hypothesis worst point. The confluence with α=1/2 is why this region is the wall.' },
];

export const CURRENT_STATE = {
  guthMaynard: 'Broke the classical ‖A‖∞ = 12/5 (Huxley/Ingham-1940) down to 30/13 ≈ 2.3077, giving N(σ,T) ≤ T^{30(1−σ)/13+o(1)} — but did NOT reach the Density-Hypothesis value 2. The residual gap is precisely the α=1/2 case.',
  gmGainLocation: 'GM’s new mechanism gains around length α≈5/6, on 0.7≤σ≤0.8; at α=1/2 the best available bounds are still the classical Montgomery–Halász L² + Halász–Montgomery double-sum (6th-moment / Heath-Brown double-zeta-sum input).',
  montgomeryConjecture: 'Target: for σ>1/2 the count is governed by the L² term alone. Known only for σ large; OPEN exactly in the σ≤3/4 / α≈1/2 regime.',
};

export const LEVER = {
  inequalityToImprove:
    'The Halász–Montgomery large-values inequality and its additive-energy input — the double sum ' +
    'Σ_{r,s}|Σ_n n^{i(t_r−t_s)}| (additive energy of the frequency/zero set; the Heath-Brown "double ' +
    'zeta sum"). In TTY/ANTEDB terms: the additive-energy exponent of the zeta zeros feeding LV(σ,τ).',
  obstruction: [
    'At α=1/2 the natural analytic input is the SIXTH moment of ζ (Heath-Brown), essentially sharp with current technology; the next honest input is an eighth moment — itself open and RH-hard.',
    'GM’s winning geometry-of-the-frequency-set + Huxley-reflection argument does NOT extend to α=1/2: the point configuration is "too generic" for the subdivision savings.',
    'The L² and double-sum bounds CROSS exactly at N^{3/4} — no free margin on either side there.',
  ],
};

export const FEASIBILITY = {
  core: 'HARD WALL — reaching A(3/4)=2 needs a genuinely NEW estimate at α=1/2 (a new ζ moment near T^{1/2}, or a new incidence/additive-energy bound). GM’s method demonstrably does not extend; ANTEDB optimization does not close it.',
  periphery: 'INCREMENTAL & real — any improvement to the additive-energy exponent of the zeros propagates automatically through the Tao–Trudgian–Yang ANTEDB harness (arXiv:2501.16779) to marginally better A(σ) on σ away from 3/4. But TTY added no new analytic input; the harness squeezes existing inputs, it does not manufacture the missing α=1/2 one.',
};

export const PAYOFF_LADDER = [
  'Primes in short intervals: current unconditional x^{17/30+o(1)} (17/30≈0.5667, Guth–Maynard) → toward the DH consequence x^{1/2+ε}. (Follow-on arXiv:2509.04883 pushes the AP version past 17/30.)',
  'Zero-density N(σ,T): the 30(1−σ)/13 exponent improving toward 2(1−σ).',
  'Prime gaps and PNT error terms: sharper density → sharper error terms and shorter guaranteed gaps.',
  'L-function analogues (q-aspect): Bin Chen (arXiv:2507.08296) transferred GM to Dirichlet L-functions, (qT)^{7(1−σ)/3+ε} (7/3 improves Huxley 12/5); least-prime / least-Goldbach-in-AP (Linnik-type) consequences.',
];

export const FIREWALL =
  'Every item above is a positive upper bound on off-line zeros or a prime-distribution consequence ' +
  'downstream of one. None certifies the ABSENCE of off-line zeros, so it is consistent with but does ' +
  'not imply RH, and does not touch Λ (density can never force N=0). RH-ADJACENT only. NO QED.';

export const GM_CITATIONS = [
  { text: 'Guth, Maynard — New large value estimates for Dirichlet polynomials. arXiv:2405.20552; accepted Annals of Math (2025).', url: 'https://arxiv.org/abs/2405.20552', status: 'verified' },
  { text: 'Tao, Trudgian, Yang — New exponent pairs, zero density & zero additive energy estimates: a systematic approach (ANTEDB). arXiv:2501.16779 (2025).', url: 'https://arxiv.org/abs/2501.16779', status: 'verified' },
  { text: 'Tao — A computation-outsourced discussion of zero density theorems (blog, 7 Jul 2024) — the α=0.5 bottleneck statement.', url: 'https://terrytao.wordpress.com/2024/07/07/', status: 'verified' },
  { text: 'Chen, Bin — Large value estimates for Dirichlet polynomials & density of zeros of Dirichlet L-functions. arXiv:2507.08296 (2025).', url: 'https://arxiv.org/abs/2507.08296', status: 'verified (preprint; peer-review unconfirmed)' },
  { text: 'Arithmetic progressions of primes in short intervals beyond the 17/30 barrier. arXiv:2509.04883 (2025).', url: 'https://arxiv.org/abs/2509.04883', status: 'surfaced in search, not read in detail' },
];

export const GM_ALPHA_HALF_SCOPING = {
  meta: GM_SCOPING_META,
  scales: SCALE_CLARIFICATION,
  currentState: CURRENT_STATE,
  lever: LEVER,
  feasibility: FEASIBILITY,
  payoffLadder: PAYOFF_LADDER,
  firewall: FIREWALL,
  citations: GM_CITATIONS,
};
