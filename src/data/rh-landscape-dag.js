// rh-landscape-dag.js — general (literature-level) dependency graph of the Riemann Hypothesis.
//
// Scope: equivalent formulations, partial results, records, analogues and the standing walls of the
// field, with citations. One interface node (project-lambda-candidate) links to the project's own
// attempts graph in src/data/project-attempts-dag.js; every other node is an external result or an
// open problem. Status wording: Platt–Trudgian Λ ≤ 0.2 (2021) is the accepted peer-reviewed upper
// bound; the project's Λ ≤ 0.1758354 is a computer-assisted candidate (four barrier gates certified in
// Arb, y-transfer reduction and Lemma B3 Lean-checked), unreviewed and unpublished (src/data/lambda-roadmap.js). RH is open.
//
// Edge convention: {from, to, type}. 'equivalent' / 'implies' are logical; 'partial-toward' = the
// `from` result is progress toward `to`; 'blocked-by' = `from` is stopped by the wall `to`;
// 'supersedes' = `from` improves or replaces `to`; 'uses' = `from` takes `to` as input; 'analog' =
// structural analogue; 'closes' = `from` proves `to`'s open conjecture; 'feeds' = `from` supplies a
// premise of `to`.
//
// Import-free (page- and assertion-safe). Anchor ids used by project-attempts-dag.js: rh, lambda-le-0,
// weil-positivity, pt-lambda-02, rt-lambda-ge-0, verified-height, pair-correlation-wall,
// pointwise-wall, flow-rigidity-wall, zero-free-region, proportion-on-line, connes-trace-formula.

const n = (id, label, kind, statusKind, status, date, summary, source, route) =>
  Object.freeze({ id, label, kind, statusKind, status, date, summary, source, ...(route ? { route } : {}) });

const NODES = [
  // ── target and equivalent formulations ──
  n('rh', 'Riemann Hypothesis', 'target', 'open', 'open', '1859',
    'Every nontrivial zero of ζ(s) has real part 1/2. Given Rodgers–Tao (Λ ≥ 0), RH is equivalent to Λ = 0. RH implies that 100% of zeros lie on the critical line; a 100% density statement alone does not imply RH.',
    'B. Riemann, Monatsber. Berlin Akad. (1859); E. Bombieri, Clay Millennium problem statement (2000)', '/rh-equivalents'),
  n('lambda-le-0', 'de Bruijn–Newman: Λ ≤ 0', 'equivalent-formulation', 'open', 'open', '1950/1976',
    'H_t (heat-flow deformation of the Riemann Ξ function) has only real zeros for t ≥ Λ. RH is equivalent to Λ ≤ 0; with Λ ≥ 0 (Rodgers–Tao), RH is equivalent to Λ = 0.',
    'N.G. de Bruijn, Duke Math. J. 17 (1950) 197–226; C.M. Newman, Proc. AMS 61 (1976) 245–251; src/data/rh-equivalents-reference.js', '/lambda-bounds'),
  n('weil-positivity', 'Weil positivity (explicit-formula criterion)', 'equivalent-formulation', 'open', 'open', '1952',
    'RH is equivalent to W(f ∗ f̃) ≥ 0 for all admissible test functions f, where W is the prime/archimedean side of the explicit formula.',
    'A. Weil, Comm. Sém. Math. Univ. Lund (1952) 252–265; E. Bombieri, Rend. Mat. Acc. Lincei 11 (2000) 183–233'),
  n('zero-free-region', 'Zero-free regions and strips', 'equivalent-formulation', 'open', 'open', '1896–',
    'RH is equivalent to: no zero with Re s > 1/2 + a, for every a > 0. In the peer-reviewed literature no strip Re s > 1 − δ with fixed δ > 0 is known to be zero-free; the proved regions (classical, Vinogradov–Korobov) approach Re s = 1 as t grows. The strip Re s > 7/8 is claimed by an internal OpenAI model in openai/math (2026-10-06); its Lean proof is formalized in the repository and was re-built locally; not peer-reviewed (node qrh-openai-2026).',
    'Titchmarsh, The Theory of the Riemann Zeta-Function, 2nd ed. (1986) Ch. 3, 6; Ivić, The Riemann Zeta-Function (1985)'),
  n('proportion-on-line', 'Proportion of zeros on the critical line', 'program', 'open', 'open (lower bounds known)', '1942–',
    'Lower bounds for the proportion κ of nontrivial zeros on Re s = 1/2. RH implies κ = 1; κ = 1 as a density statement does not imply RH. Peer-reviewed record κ > 5/12 (PRZZ 2020).',
    'Selberg (1942); Levinson (1974); Conrey (1989); Pratt–Robles–Zaharescu–Zeindler (2020); src/data/critical-line-proportion.js', '/critical-line-proportion'),
  n('li-criterion', 'Li criterion', 'equivalent-formulation', 'open', 'open', '1997',
    'RH is equivalent to λ_n = Σ_ρ [1 − (1 − 1/ρ)^n] ≥ 0 for all n ≥ 1. Bombieri–Lagarias identified the Li coefficients as values of the Weil functional.',
    'X.-J. Li, J. Number Theory 65 (1997) 325–333; E. Bombieri, J.C. Lagarias, J. Number Theory 77 (1999) 274–287'),
  n('nyman-beurling', 'Nyman–Beurling / Báez-Duarte criterion', 'equivalent-formulation', 'open', 'open', '1950/1955/2003',
    'RH is equivalent to the constant 1 lying in the L²(0,1) closure of dilations of the fractional-part function {θ/x}; Báez-Duarte reduced this to natural-number dilations {1/(nx)}.',
    'B. Nyman, thesis Uppsala (1950); A. Beurling, PNAS 41 (1955) 312–314; L. Báez-Duarte, Rend. Mat. Acc. Lincei 14 (2003) 5–11'),
  n('robin', 'Robin inequality', 'equivalent-formulation', 'open', 'open', '1984',
    'RH is equivalent to σ(n) < e^γ n log log n for all n > 5040.',
    'G. Robin, J. Math. Pures Appl. 63 (1984) 187–213'),
  n('lagarias', 'Lagarias harmonic-number criterion', 'equivalent-formulation', 'open', 'open', '2002',
    'RH is equivalent to σ(n) ≤ H_n + exp(H_n) log H_n for all n ≥ 1 (derived from Robin).',
    'J.C. Lagarias, Amer. Math. Monthly 109 (2002) 534–543'),
  n('hermite-biehler-de-branges', 'Hermite–Biehler / de Branges spaces', 'equivalent-formulation', 'open', 'open', '1968/2006',
    'RH is equivalent to structural properties of associated entire functions (Hermite–Biehler class, de Branges space structure). de Branges’ proposed positivity condition fails in the stated form (Conrey–Li 2000).',
    'L. de Branges, Hilbert Spaces of Entire Functions (1968); J.C. Lagarias, in Frontiers in Number Theory, Physics and Geometry I (2006); J.B. Conrey, X.-J. Li, IMRN 2000'),
  n('connes-trace-formula', 'Connes adelic trace formula', 'equivalent-formulation', 'open', 'open', '1999',
    'Spectral realization of the zeros as an absorption spectrum on the adele class space; RH is equivalent to positivity of a global trace formula, equivalently Weil positivity.',
    'A. Connes, Selecta Math. 5 (1999) 29–106', '/connes-adelic'),
  n('mertens-bound', 'Mertens-type bound M(x) = O(x^{1/2+ε})', 'equivalent-formulation', 'open', 'open', '1912',
    'RH is equivalent to M(x) = Σ_{n≤x} μ(n) = O(x^{1/2+ε}) for every ε > 0.',
    'J.E. Littlewood, C. R. Acad. Sci. Paris 154 (1912) 263–266; Titchmarsh (1986) §14.25'),
  n('pnt-error', 'PNT error term π(x) = li(x) + O(√x log x)', 'equivalent-formulation', 'open', 'open', '1901',
    'RH is equivalent to the square-root error term in the prime number theorem; under RH Schoenfeld gives |π(x) − li(x)| < √x log x/(8π) for x ≥ 2657.',
    'H. von Koch, Acta Math. 24 (1901) 159–182; L. Schoenfeld, Math. Comp. 30 (1976) 337–360'),
  n('jensen-hyperbolicity', 'Pólya–Jensen polynomial hyperbolicity', 'equivalent-formulation', 'open', 'open', '1927',
    'RH is equivalent to hyperbolicity (only real roots) of all Jensen polynomials J^{d,n} attached to the Taylor coefficients of Ξ.',
    'G. Pólya, J. reine angew. Math. 158 (1927) 6–18'),
  n('speiser', 'Speiser criterion (zeros of ζ′)', 'equivalent-formulation', 'open', 'open', '1934',
    'RH is equivalent to ζ′(s) having no zeros in 0 < Re s < 1/2.',
    'A. Speiser, Math. Ann. 110 (1934) 514–521; N. Levinson, H.L. Montgomery, Acta Math. 133 (1974) 49–65'),
  n('riesz', 'Riesz series criterion', 'equivalent-formulation', 'open', 'open', '1916',
    'RH is equivalent to Σ_k (−1)^{k+1} x^k/((k−1)! ζ(2k)) = O(x^{1/4+ε}).',
    'M. Riesz, Acta Math. 40 (1916) 185–190'),
  n('bagchi-universality', 'Bagchi strong-recurrence criterion', 'equivalent-formulation', 'open', 'open', '1981',
    'RH is equivalent to ζ being strongly recurrent (approximating its own translates in the sense of Voronin universality) in 1/2 < Re s < 1.',
    'B. Bagchi, thesis ISI Calcutta (1981); Acta Math. Hungar. 50 (1987) 227–240', '/voronin-universality'),
  n('hilbert-polya', 'Hilbert–Pólya spectral realization', 'program', 'open', 'open (conjectural program)', 'c.1914/1999',
    'Zeros as eigenvalues 1/2 + iE of a self-adjoint operator would imply RH. Candidate Hamiltonians (Berry–Keating xp and variants) are not established.',
    'M.V. Berry, J.P. Keating, SIAM Rev. 41 (1999) 236–266; src/data/rh-equivalents-reference.js', '/berry-keating-xp'),
  n('mertens-conjecture', 'Mertens conjecture |M(x)| < √x', 'stronger-statement', 'disproved', 'disproved', '1897/1985',
    'The strong bound |M(x)| < √x would imply RH; Odlyzko–te Riele disproved it (lim sup M(x)/√x > 1.06). The disproof does not affect M(x) = O(x^{1/2+ε}).',
    'A.M. Odlyzko, H.J.J. te Riele, J. reine angew. Math. 357 (1985) 138–160'),
  n('grh', 'Generalized Riemann Hypothesis', 'generalization', 'open', 'open', '1884+',
    'RH for all Dirichlet L-functions and, more generally, automorphic L-functions. Contains RH as the trivial-character case.',
    'H. Iwaniec, E. Kowalski, Analytic Number Theory (2004) Ch. 5'),
  n('lindelof', 'Lindelöf hypothesis', 'consequence', 'open', 'open', '1908',
    'ζ(1/2 + it) = O(t^ε). Implied by RH. Best proved exponent μ(1/2) ≤ 13/84 (Bourgain).',
    'J. Bourgain, J. AMS 30 (2017) 205–224'),
  n('density-hypothesis', 'Density hypothesis N(σ,T) ≪ T^{2(1−σ)+ε}', 'consequence', 'open', 'open', '1940s',
    'Zero-density bound implied by Lindelöf (hence by RH). Controls counts of off-line zeros, not their existence.',
    'Titchmarsh (1986) Ch. 9; Ivić (1985) Ch. 11', '/zero-density-scoping'),

  // ── partial results: zero-free regions and density ──
  n('pnt-1896', 'Prime number theorem: no zeros on Re s = 1', 'partial-result', 'proven', 'proven', '1896',
    'ζ(1 + it) ≠ 0, giving π(x) ~ x/log x.',
    'J. Hadamard, Bull. SMF 24 (1896) 199–220; C.J. de la Vallée Poussin, Ann. Soc. Sci. Bruxelles 20 (1896) 183–256'),
  n('zfr-classical', 'Classical zero-free region σ > 1 − 1/(R log t)', 'partial-result', 'proven', 'proven, peer-reviewed', '1899/2022',
    'de la Vallée Poussin region; explicit constant R = 5.558691 (Mossinghoff–Trudgian–Yang).',
    'C.J. de la Vallée Poussin (1899); M.J. Mossinghoff, T.S. Trudgian, A. Yang, arXiv:2212.06867'),
  n('zfr-vk', 'Vinogradov–Korobov zero-free region', 'partial-result', 'proven', 'proven, peer-reviewed', '1958/2002/2024',
    'σ > 1 − c/((log t)^{2/3}(log log t)^{1/3}); the exponent 2/3 is unchanged since 1958. Explicit constant 1/57.54 (Ford 2002), 1/53.989 (Bellotti 2024) for large t.',
    'I.M. Vinogradov, N.M. Korobov (1958); K. Ford, Proc. LMS 85 (2002) 565–633; C. Bellotti, arXiv:2306.10680'),
  n('qrh-openai-2026', 'Quasi-Riemann hypothesis: ζ and Dirichlet L zero-free in Re s > 7/8 (external claim)', 'record-claim', 'claimed', 'external claim, Lean-formalized (Lean proof re-built locally; official comparator and independent kernel check not run); not peer-reviewed', '2026',
    'Claimed by an internal OpenAI model in openai/math (2026-10-06), family 003: ζ(s) ≠ 0 and L(s,χ) ≠ 0 for every Dirichlet character when Re s > 7/8 (alternate 11/12 proof in a human-edited writeup; a uniform Landau–Siegel gap is also claimed). The Lean theorem OAI.riemannZeta_ne_zero_of_seven_eighths_lt_re builds locally (Lean 4.34.1, Mathlib d13f23b7) with axioms propext, Classical.choice, Quot.sound, and its statement matches the comparator challenge on Mathlib’s riemannZeta. With de Bruijn (1950) it gives Λ ≤ 9/32 conditionally, above PT’s 0.2. RH is open.',
    'github.com/openai/math, preprints/The-Quasi-Riemann-Hypothesis-September-30-2026 and lean/ComparatorChallenges/QuasiRiemannHypothesis.lean; formalization/external/openai-math-qrh-verification.md; src/data/openai-math-integration-2026-10-08.js'),
  n('qrh-liu-2026', 'Liu: zero-free half-plane Re s > 0.874957019… (external preprint)', 'record-claim', 'claimed', 'external preprint, reported Lean-formalized; not peer-reviewed', '2026',
    'B. Liu re-tunes the parameters of the openai/math 7/8 argument and obtains B = (18ξ + 7)/(18ξ + 9) = 0.874957019420098946…, ξ the root in (0.38858, 0.38859) of 1188ξ³ − 2160ξ² + 171ξ + 190; the paper proves this value optimal within the stated exponent comparison system and reports a Lean formalization (not re-built here). A later preprint by the same author (arXiv:2610.26835) extends the method to finite-order Hecke L-functions over every number field with boundary ≈ 0.874886647, building on this paper, the OpenAI work and Xu–Sang. Effect on the project’s Raymond-chain value at PT height: about −1·10⁻⁵ (interpolated). RH is open.',
    'B. Liu, arXiv:2610.12234 (v1 8 Oct 2026, v2 12 Oct 2026); B. Liu, arXiv:2610.26835 (v1 19 Oct 2026, v2 29 Oct 2026)'),
  n('qrh-xu-sang-2026', 'Xu–Sang: zero-free half-plane Re s > 0.8748867, conditional (external preprint)', 'record-claim', 'claimed', 'external preprint, conditional on the analytic inputs of the openai/math 7/8 work; not peer-reviewed', '2026',
    'Y. Xu and H. Sang use amplified moments to obtain 0.8748867, taking the OpenAI 7/8 inputs (cubic-theta half-plane over Q(√−3) and its transfer to Dirichlet L-functions) and an existing fourth-moment estimate as given. This project re-derived the ceiling of that system: B*(κ) increases in κ, B*(3/4) = 49619/53814 − √715621/17938 ≈ 0.8748870, B*(29991/40000) ≈ 0.874886650; the PR #14 value 0.87488665 is within 4·10⁻¹⁰ of it. Raymond’s chain at θ = 0.8748888 ends at 0.1184742 against 0.118506 at 7/8, so the half-plane moves the conditional Λ value by about −3·10⁻⁵. RH is open.',
    'Y. Xu, H. Sang, arXiv:2610.15291 (v1 11 Oct 2026, v2 15 Oct 2026); src/data/zero-free-campaign-2026-11-01.js; src/data/sextic-theta-campaign-2026-11-03.js', '/lambda-0116091'),
  n('zero-density-ingham', 'Ingham zero-density estimate', 'partial-result', 'proven', 'proven', '1940',
    'N(σ,T) ≪ T^{3(1−σ)/(2−σ)} log^5 T; the benchmark near σ = 3/4 for 80 years (Huxley 1972 for σ ≥ 3/4).',
    'A.E. Ingham, Quart. J. Math. Oxford 11 (1940) 291–292; M.N. Huxley, Invent. Math. 15 (1972) 164–170'),
  n('guth-maynard', 'Guth–Maynard zero-density estimate', 'partial-result', 'proven', 'proven, peer-reviewed', '2024/2026',
    'Large-value estimates for Dirichlet polynomials give N(σ,T) ≪ T^{30(1−σ)/13+o(1)}, improving Ingham near σ = 3/4; primes in intervals of length x^{17/30+o(1)}.',
    'L. Guth, J. Maynard, arXiv:2405.20552; Ann. of Math. 203(2) (2026) 623–675', '/guth-maynard-scoping'),

  // ── partial results: zeros on the line ──
  n('hardy-1914', 'Hardy: infinitely many zeros on the line', 'partial-result', 'proven', 'proven', '1914',
    'Infinitely many nontrivial zeros lie on Re s = 1/2.',
    'G.H. Hardy, C. R. Acad. Sci. Paris 158 (1914) 1012–1014', '/hardy-z'),
  n('selberg-1942', 'Selberg: positive proportion on the line', 'partial-result', 'proven', 'proven', '1942',
    'A positive (small, unspecified) proportion of zeros lies on the critical line.',
    'A. Selberg, Skr. Norske Vid. Akad. Oslo (1942) no. 10'),
  n('levinson-1974', 'Levinson: ≥ 1/3 on the line', 'partial-result', 'proven', 'proven', '1974',
    'Mollifier method: at least one third of the zeros lie on the critical line.',
    'N. Levinson, Adv. Math. 13 (1974) 383–436'),
  n('conrey-1989', 'Conrey: ≥ 40.88% on the line', 'partial-result', 'proven', 'proven', '1989',
    'Mollifier of length θ = 4/7 via Deshouillers–Iwaniec Kloosterman-sum bounds; at least 2/5 of zeros on the line and simple. Refinements: Bui–Conrey–Young 41.05% (2011), Feng 41.28% (2012).',
    'J.B. Conrey, J. reine angew. Math. 399 (1989) 1–26; src/data/critical-line-proportion.js'),
  n('przz-2020', 'Pratt–Robles–Zaharescu–Zeindler: > 5/12 on the line', 'record', 'proven', 'proven, peer-reviewed (current peer-reviewed record)', '2020',
    'More than 5/12 (41.67%) of the zeros lie on the critical line; Levinson-mollifier lineage.',
    'K. Pratt, N. Robles, A. Zaharescu, D. Zeindler, Res. Math. Sci. 7 (2020) no. 2; src/data/critical-line-proportion.js', '/critical-line-proportion'),
  n('alpoge-furman-2026', 'Alpöge–Furman: ≥ 2/3 simple and on the line (external claim)', 'record-claim', 'claimed', 'claimed, Lean-verified, independently reproved, not peer-reviewed', '2026',
    'External result with proof discovered by Claude (Anthropic): at least 2/3 (0.6725 with the Montgomery–Taylor window) of zeros are simple and on the critical line, via Sylvester inertia and a rank-trace inequality on a finite compression of Weil’s Hermitian form, using the unconditional pair-correlation form factor on [−1,1]. Lean 4 formalized; reproved by Lamzouri. Not peer-reviewed. Not this project’s result.',
    'L. Alpöge, R. Furman, arXiv:2608.13637; Y. Lamzouri, arXiv:2609.02882; src/data/critical-line-proportion.js', '/critical-line-proportion'),

  // ── de Bruijn–Newman constant ──
  n('verified-height', 'Rigorous verification to height 3·10^12', 'record', 'proven', 'proven, peer-reviewed', '2021',
    'All nontrivial zeros with 0 < t ≤ 3·10^12 lie on the critical line (interval arithmetic). Finite verification cannot prove RH; it is an input to Λ upper bounds.',
    'D.J. Platt, T.S. Trudgian, Bull. LMS 53 (2021) 792–797, doi:10.1112/blms.12460', '/verified-height-lever'),
  n('de-bruijn-1950', 'de Bruijn: Λ ≤ 1/2', 'partial-result', 'proven', 'proven', '1950',
    'H_t has only real zeros for t ≥ 1/2.',
    'N.G. de Bruijn, Duke Math. J. 17 (1950) 197–226'),
  n('newman-1976', 'Newman: Λ finite; conjecture Λ ≥ 0', 'partial-result', 'proven', 'proven (finiteness); conjecture proved by Rodgers–Tao', '1976',
    'Λ is a finite constant with −∞ < Λ ≤ 1/2; Newman conjectured Λ ≥ 0.',
    'C.M. Newman, Proc. AMS 61 (1976) 245–251'),
  n('lambda-lower-bounds-numeric', 'Numerical lower bounds on Λ', 'partial-result', 'proven', 'proven, superseded', '1988–2011',
    'Close zero pairs give lower bounds; last numerical record Λ > −1.14541·10^−11 (Saouter–Gourdon–Demichel 2011).',
    'G. Csordas, T.S. Norfolk, R.S. Varga, Numer. Math. 52 (1988); Y. Saouter, X. Gourdon, P. Demichel, Math. Comp. 80 (2011) 2281–2287'),
  n('rt-lambda-ge-0', 'Rodgers–Tao: Λ ≥ 0', 'partial-result', 'proven', 'proven, peer-reviewed', '2018/2020',
    'Proves Newman’s conjecture; RH is therefore equivalent to Λ = 0 exactly.',
    'B. Rodgers, T. Tao, arXiv:1801.05914; Forum Math. Pi 8 (2020) e6', '/lambda-timeline'),
  n('ki-kim-lee', 'Ki–Kim–Lee: Λ < 1/2', 'partial-result', 'proven', 'proven, peer-reviewed', '2009',
    'Strict improvement of de Bruijn’s bound; for each t > 0 the zeros of H_t are eventually real and simple at large height.',
    'H. Ki, Y.-O. Kim, J. Lee, Adv. Math. 222 (2009) 281–306'),
  n('polymath15', 'Polymath15: Λ ≤ 0.22', 'partial-result', 'proven', 'proven, peer-reviewed, superseded', '2019',
    'Effective heat-flow approximation of H_t plus barrier computation and zero verification.',
    'D.H.J. Polymath, Res. Math. Sci. 6 (2019) 31'),
  n('pt-lambda-02', 'Platt–Trudgian: Λ ≤ 0.2', 'record', 'proven', 'proven, peer-reviewed (accepted benchmark)', '2021',
    'Polymath15 method with verified height 3·10^12 gives Λ ≤ 0.2; the current accepted peer-reviewed upper bound.',
    'D.J. Platt, T.S. Trudgian, Bull. LMS 53 (2021) 792–797', '/lambda-bounds'),
  n('project-lambda-candidate', 'This project: Λ ≤ 0.1758354 (candidate)', 'project-link', 'project', 'computer-assisted candidate, unreviewed, unpublished', '2026',
    'Interface node to the project DAG: four barrier gates certified in Arb interval arithmetic, y-transfer reduction and Lemma B3 Lean-checked; marked unreviewed and unpublished in src/data/lambda-roadmap.js. Platt–Trudgian Λ ≤ 0.2 remains the accepted benchmark.',
    'src/data/lambda-roadmap.js (local-sharper-candidate-01758354)', '/lambda-01758354-candidate'),

  // ── Weil positivity partial results ──
  n('yoshida-1992', 'Yoshida: Weil positivity for small support', 'partial-result', 'proven', 'proven, peer-reviewed', '1992',
    'Weil’s functional is positive on test functions of sufficiently small support.',
    'H. Yoshida, On Hermitian forms attached to zeta functions, Adv. Stud. Pure Math. 21 (1992) 281–325'),
  n('connes-consani-2021', 'Connes–Consani: Weil positivity, archimedean place', 'partial-result', 'proven', 'proven, peer-reviewed', '2021',
    'Positivity of the Weil functional for test functions supported in [2^{−1/2}, 2^{1/2}] (log-support width ln 2, where only the archimedean place contributes), via the semilocal trace formula and prolate spheroidal functions.',
    'A. Connes, C. Consani, Selecta Math. 27 (2021) 77, arXiv:2006.13771'),
  n('connes-consani-scaling-site', 'Connes–Consani arithmetic/scaling site (F1) program', 'program', 'open', 'open (program)', '2014–2023',
    'Attempt to transport the Weil curve proof (Riemann–Roch, Hodge-index positivity) to Spec Z via the arithmetic site, scaling site and F1 geometry.',
    'A. Connes, C. Consani, C. R. Math. 352 (2014); Adv. Math. 291 (2016) 274–329; Selecta Math. 23 (2017) 1803–1850'),

  // ── pair correlation and random matrices ──
  n('montgomery-pair-correlation', 'Montgomery pair correlation (conditional on RH)', 'conditional-result', 'proven', 'proven under RH for |α| < 1; full conjecture open', '1973',
    'Form factor F(α) = |α| + o(1) for |α| < 1 under RH; conjectured 1 for |α| ≥ 1 (GUE). Gives ≥ 2/3 simple zeros under RH.',
    'H.L. Montgomery, Proc. Sympos. Pure Math. 24 (1973) 181–193', '/pair-correlation'),
  n('pair-correlation-unconditional', 'Unconditional pair-correlation form factor on [−1,1]', 'partial-result', 'proven', 'proven (Aryan; BGST preprint)', '2022/2025',
    'Removes the RH hypothesis from Montgomery’s form-factor evaluation on Fourier support [−1,1]; the analytic input for the 2026 ≥ 2/3 claim.',
    'F. Aryan (2022); S. Baluyot, D.A. Goldston, A.I. Suriajaya, C.L. Turnage-Butterbaugh, arXiv:2501.14545'),
  n('gue-random-matrix', 'GUE / random-matrix statistics', 'evidence', 'evidence', 'numerical evidence; conjectural', '1987/1999',
    'Zero spacings match GUE to high precision near the 10^20-th to 10^23-rd zero (Odlyzko); Katz–Sarnak symmetry types proven in function-field families.',
    'A.M. Odlyzko, Math. Comp. 48 (1987) 273–308; N. Katz, P. Sarnak, Bull. AMS 36 (1999) 1–26', '/gue-comparison'),
  n('griffin-ono-rolen-zagier', 'Griffin–Ono–Rolen–Zagier: Jensen polynomials hyperbolic for large shift', 'partial-result', 'proven', 'proven, peer-reviewed', '2019',
    'For each fixed degree d, J^{d,n} is hyperbolic for all sufficiently large shifts n (and all n for d ≤ 8). Does not give all (d, n).',
    'M. Griffin, K. Ono, L. Rolen, D. Zagier, PNAS 116 (2019) 11103–11110'),

  // ── analogues ──
  n('lee-yang-analogy', 'Lee–Yang circle theorem analogy', 'analog', 'proven', 'proven (analogue)', '1952/1976',
    'Lee–Yang proved partition-function zeros of ferromagnetic Ising models lie on a circle; Newman framed Λ as a Lee–Yang-type constant and conjectured Λ ≥ 0 ("RH, if true, is only barely so").',
    'T.D. Lee, C.N. Yang, Phys. Rev. 87 (1952) 410–419; C.M. Newman, Proc. AMS 61 (1976) 245–251'),
  n('weil-curves', 'RH for curves over finite fields', 'analog', 'proven', 'proven', '1948',
    'Weil’s proof via the Castelnuovo–Severi inequality: a positivity statement on C × C, the model for Weil positivity over Q.',
    'A. Weil, Sur les courbes algébriques et les variétés qui s’en déduisent (1948)'),
  n('deligne', 'Deligne: Weil conjectures (RH over F_q)', 'analog', 'proven', 'proven', '1974',
    'RH for zeta functions of smooth projective varieties over finite fields, via étale cohomology and Lefschetz pencils rather than positivity. Grothendieck’s standard conjectures (Hodge-type positivity) remain open.',
    'P. Deligne, Publ. Math. IHÉS 43 (1974) 273–307'),
  n('selberg-zeta', 'Selberg zeta and trace formula', 'analog', 'proven', 'proven', '1956',
    'For compact hyperbolic surfaces the Selberg zeta zeros correspond to Laplacian eigenvalues, so an RH analogue holds apart from finitely many exceptional small eigenvalues: a working Hilbert–Pólya model.',
    'A. Selberg, J. Indian Math. Soc. 20 (1956) 47–87', '/selberg-trace'),

  // ── walls ──
  n('pointwise-wall', 'Wall: pointwise vs average control', 'wall', 'obstruction', 'standing obstruction', '—',
    'Zero-density, moment and proportion methods bound counts or averages of off-line zeros; none excludes a single off-line zero. RH is a pointwise statement about every zero.',
    'Ivić (1985) Ch. 11; Guth–Maynard (2024) introduction'),
  n('wall-exponential-sum', 'Wall: exponential-sum strength (VK exponent 2/3)', 'wall', 'obstruction', 'standing obstruction', '1958–',
    'Zero-free regions rest on bounds for ζ near Re s = 1 from exponential sums; the Vinogradov–Korobov exponent 2/3 has not been improved since 1958, and regions of this type stay asymptotically below any fixed line σ = 1 − δ.',
    'K. Ford (2002); Titchmarsh (1986) Ch. 6'),
  n('pair-correlation-wall', 'Wall: pair-correlation support barrier', 'wall', 'obstruction', 'standing obstruction', '1973–',
    'The form factor is known only on Fourier support |α| ≤ 1; extending past 1 (toward GUE) is equivalent to strong twin-prime-type correlation input. This caps simplicity/proportion bounds from pair correlation below 100%.',
    'Montgomery (1973); D.A. Goldston, H.L. Montgomery, in Analytic Number Theory and Diophantine Problems (1987)'),
  n('wall-mollifier-length', 'Wall: mollifier length', 'wall', 'obstruction', 'standing obstruction', '1989–',
    'The Levinson–Conrey proportion depends on mollifier length θ; θ = 4/7 is the Kloosterman-sum limit; Farmer’s θ = ∞ conjecture: arbitrarily long mollifiers would give 100%, so the method needs θ well beyond current distribution results.',
    'J.B. Conrey (1989); D.W. Farmer, Mathematika 40 (1993) 71–87'),
  n('wall-parity', 'Wall: parity (sieve) barrier', 'wall', 'obstruction', 'standing obstruction', '1949–',
    'Selberg’s parity problem: sieve weights cannot distinguish integers with an even vs odd number of prime factors, blocking sieve routes to square-root cancellation in M(x).',
    'A. Selberg, Lectures on Sieves (Collected Papers II); J. Friedlander, H. Iwaniec, Opera de Cribro (2010)'),
  n('flow-rigidity-wall', 'Wall: soft methods vs flow rigidity', 'wall', 'obstruction', 'heuristic in the literature; project-internal no-go theorem (unreviewed)', '2018–',
    'Given Λ ≥ 0, RH holds only at the boundary of the heat flow; a hypothesis stable under the backward flow H_t, t < 0, cannot distinguish RH from its failure, so arithmetic input is required. The project states this as the flow-blindness no-go (internal, unreviewed).',
    'Rodgers–Tao (2020) introduction; Newman (1976); project page /flow-blindness-no-go', '/flow-blindness-no-go'),
  n('wall-verification-height', 'Wall: finite verification height', 'wall', 'obstruction', 'standing obstruction', '—',
    'No finite computation proves RH; Λ upper bounds by the Polymath15 method need verified zero height, which binds the attainable bound (roughly inverse-logarithmic in height).',
    'Polymath15 (2019); Platt–Trudgian (2021)'),
  n('wall-weil-support', 'Wall: Weil positivity past the first prime', 'wall', 'obstruction', 'standing obstruction', '2021–',
    'Known positivity proofs control the archimedean place only; once log-support exceeds ln 2 the p = 2 term (and then every prime) enters and the archimedean arguments no longer suffice.',
    'Connes–Consani, Selecta Math. 27 (2021); Yoshida (1992)'),
  n('wall-siegel-zero', 'Wall: Landau–Siegel exceptional zero (GRH)', 'wall', 'obstruction', 'standing obstruction', '1935–',
    'For Dirichlet L-functions, ineffective Siegel bounds cannot exclude a real zero near 1; no analogue for ζ itself, but a central obstruction to GRH-type results. Peer-reviewed status unchanged; openai/math family 003 (2026-10-06, internal OpenAI model) claims a uniform gap (1 − β) log q ≥ c, with a SiegelZeros comparator statement in the repository (not checked locally); not peer-reviewed.',
    'C.L. Siegel, Acta Arith. 1 (1935) 83–86; Iwaniec–Kowalski (2004) Ch. 5'),
];

const e = (from, to, type, note) => Object.freeze({ from, to, type, ...(note ? { note } : {}) });

const EDGES = [
  // equivalences and implications
  e('lambda-le-0', 'rh', 'equivalent', 'de Bruijn/Newman; with Rodgers–Tao, RH ⇔ Λ = 0'),
  e('weil-positivity', 'rh', 'equivalent'),
  e('zero-free-region', 'rh', 'equivalent', 'for every a > 0, no zero with Re s > 1/2 + a'),
  e('li-criterion', 'rh', 'equivalent'),
  e('li-criterion', 'weil-positivity', 'equivalent', 'Bombieri–Lagarias: Li coefficients are Weil-functional values'),
  e('nyman-beurling', 'rh', 'equivalent'),
  e('robin', 'rh', 'equivalent'),
  e('lagarias', 'robin', 'equivalent', 'derived from Robin'),
  e('lagarias', 'rh', 'equivalent'),
  e('hermite-biehler-de-branges', 'rh', 'equivalent'),
  e('hilbert-polya', 'rh', 'implies', 'a self-adjoint spectral realization would imply RH'),
  e('connes-trace-formula', 'weil-positivity', 'equivalent', 'global trace-formula positivity = Weil positivity'),
  e('connes-trace-formula', 'hilbert-polya', 'analog', 'absorption-spectrum version of the spectral realization'),
  e('mertens-bound', 'rh', 'equivalent'),
  e('mertens-conjecture', 'mertens-bound', 'implies', 'would imply; the strong form is disproved, the O(x^{1/2+ε}) bound stays open'),
  e('pnt-error', 'rh', 'equivalent'),
  e('jensen-hyperbolicity', 'rh', 'equivalent'),
  e('jensen-hyperbolicity', 'lambda-le-0', 'analog', 'both are real-zero properties of the Ξ Taylor/Fourier data (Pólya)'),
  e('griffin-ono-rolen-zagier', 'jensen-hyperbolicity', 'partial-toward'),
  e('speiser', 'rh', 'equivalent'),
  e('riesz', 'rh', 'equivalent'),
  e('bagchi-universality', 'rh', 'equivalent'),
  e('lee-yang-analogy', 'lambda-le-0', 'analog'),
  e('hermite-biehler-de-branges', 'hilbert-polya', 'analog', 'canonical-system / operator model'),
  e('grh', 'rh', 'implies'),
  e('rh', 'lindelof', 'implies'),
  e('lindelof', 'density-hypothesis', 'implies'),
  e('rh', 'density-hypothesis', 'implies'),
  e('rh', 'proportion-on-line', 'implies', 'RH ⇒ κ = 1; the converse fails'),
  // zero-free regions and density
  e('pnt-1896', 'zero-free-region', 'partial-toward'),
  e('zfr-classical', 'pnt-1896', 'supersedes'),
  e('zfr-classical', 'zero-free-region', 'partial-toward'),
  e('zfr-vk', 'zfr-classical', 'supersedes', 'asymptotically, for large t'),
  e('zfr-vk', 'zero-free-region', 'partial-toward'),
  e('zfr-vk', 'wall-exponential-sum', 'blocked-by'),
  e('qrh-openai-2026', 'zero-free-region', 'partial-toward', 'claimed fixed strip Re s > 7/8; Lean-formalized; not peer-reviewed'),
  e('qrh-openai-2026', 'zfr-vk', 'supersedes', 'claimed; a fixed-width strip contains every region approaching Re s = 1'),
  e('qrh-openai-2026', 'grh', 'partial-toward', 'claimed for every Dirichlet L-function'),
  e('qrh-openai-2026', 'de-bruijn-1950', 'feeds', 'with de Bruijn Thm 13: Λ ≤ 9/32 conditionally (not below PT 0.2)'),
  e('qrh-liu-2026', 'qrh-openai-2026', 'supersedes', 'claimed; parameter re-tuning of the same argument, 7/8 → 0.874957'),
  e('qrh-liu-2026', 'qrh-openai-2026', 'uses', 'same exponent system and lemmas'),
  e('qrh-xu-sang-2026', 'qrh-openai-2026', 'uses', 'conditional on the 7/8 analytic inputs'),
  e('qrh-xu-sang-2026', 'qrh-openai-2026', 'supersedes', 'claimed, conditionally; 7/8 → 0.8748867'),
  e('qrh-xu-sang-2026', 'qrh-liu-2026', 'supersedes', 'claimed, conditionally; 0.874957 → 0.8748867'),
  e('zero-free-region', 'wall-exponential-sum', 'blocked-by', 'no fixed strip σ > 1 − δ is known'),
  e('zero-density-ingham', 'density-hypothesis', 'partial-toward'),
  e('guth-maynard', 'zero-density-ingham', 'supersedes', 'near σ = 3/4'),
  e('guth-maynard', 'density-hypothesis', 'partial-toward'),
  e('density-hypothesis', 'pointwise-wall', 'blocked-by', 'even the full density hypothesis does not exclude single off-line zeros'),
  e('guth-maynard', 'pointwise-wall', 'blocked-by'),
  // proportion on the line
  e('hardy-1914', 'proportion-on-line', 'partial-toward'),
  e('selberg-1942', 'hardy-1914', 'supersedes'),
  e('levinson-1974', 'selberg-1942', 'supersedes'),
  e('conrey-1989', 'levinson-1974', 'supersedes'),
  e('przz-2020', 'conrey-1989', 'supersedes'),
  e('przz-2020', 'proportion-on-line', 'partial-toward', 'peer-reviewed record κ > 5/12'),
  e('przz-2020', 'wall-mollifier-length', 'blocked-by'),
  e('conrey-1989', 'wall-mollifier-length', 'blocked-by'),
  e('proportion-on-line', 'pointwise-wall', 'blocked-by', 'a proportion, even 100%, is an average statement'),
  e('alpoge-furman-2026', 'przz-2020', 'supersedes', 'claimed; not peer-reviewed; mollifier-free method'),
  e('alpoge-furman-2026', 'pair-correlation-unconditional', 'uses'),
  e('alpoge-furman-2026', 'weil-positivity', 'uses', 'finite compression of Weil’s Hermitian form'),
  e('alpoge-furman-2026', 'proportion-on-line', 'partial-toward'),
  e('alpoge-furman-2026', 'pair-correlation-wall', 'blocked-by'),
  e('pair-correlation-unconditional', 'montgomery-pair-correlation', 'partial-toward', 'removes the RH hypothesis on |α| ≤ 1'),
  e('montgomery-pair-correlation', 'rh', 'uses', 'conditional on RH'),
  e('montgomery-pair-correlation', 'pair-correlation-wall', 'blocked-by'),
  e('gue-random-matrix', 'montgomery-pair-correlation', 'analog'),
  e('gue-random-matrix', 'hilbert-polya', 'partial-toward', 'heuristic support for a Hermitian operator'),
  // de Bruijn–Newman
  e('verified-height', 'rh', 'partial-toward'),
  e('verified-height', 'wall-verification-height', 'blocked-by'),
  e('de-bruijn-1950', 'lambda-le-0', 'partial-toward'),
  e('newman-1976', 'lambda-le-0', 'partial-toward'),
  e('ki-kim-lee', 'de-bruijn-1950', 'supersedes'),
  e('polymath15', 'ki-kim-lee', 'supersedes'),
  e('pt-lambda-02', 'polymath15', 'supersedes'),
  e('pt-lambda-02', 'verified-height', 'uses'),
  e('polymath15', 'lambda-le-0', 'partial-toward'),
  e('pt-lambda-02', 'lambda-le-0', 'partial-toward'),
  e('pt-lambda-02', 'wall-verification-height', 'blocked-by'),
  e('pt-lambda-02', 'flow-rigidity-wall', 'blocked-by', 'the upper-bound method cannot reach 0 without arithmetic input'),
  e('rt-lambda-ge-0', 'newman-1976', 'closes', 'proves Newman’s conjecture Λ ≥ 0'),
  e('rt-lambda-ge-0', 'lambda-lower-bounds-numeric', 'supersedes'),
  e('lambda-lower-bounds-numeric', 'newman-1976', 'partial-toward'),
  e('rt-lambda-ge-0', 'flow-rigidity-wall', 'feeds', 'Λ ≥ 0 is the premise of the flow-rigidity obstruction'),
  e('project-lambda-candidate', 'pt-lambda-02', 'partial-toward', 'candidate improvement; unreviewed, unpublished'),
  e('project-lambda-candidate', 'lambda-le-0', 'partial-toward'),
  e('project-lambda-candidate', 'verified-height', 'uses'),
  e('project-lambda-candidate', 'flow-rigidity-wall', 'blocked-by'),
  // Weil positivity
  e('yoshida-1992', 'weil-positivity', 'partial-toward'),
  e('connes-consani-2021', 'yoshida-1992', 'supersedes', 'explicit support [2^{−1/2}, 2^{1/2}] with a trace-formula mechanism'),
  e('connes-consani-2021', 'weil-positivity', 'partial-toward'),
  e('connes-consani-2021', 'connes-trace-formula', 'uses', 'semilocal trace formula, archimedean place'),
  e('connes-consani-2021', 'wall-weil-support', 'blocked-by'),
  e('connes-consani-scaling-site', 'connes-trace-formula', 'partial-toward'),
  e('connes-consani-scaling-site', 'weil-curves', 'analog'),
  e('weil-curves', 'weil-positivity', 'analog', 'Castelnuovo–Severi positivity is the function-field Weil positivity'),
  e('weil-curves', 'rh', 'analog'),
  e('deligne', 'weil-curves', 'supersedes', 'generalizes to all smooth projective varieties'),
  e('deligne', 'grh', 'analog'),
  e('selberg-zeta', 'hilbert-polya', 'analog'),
  // walls
  e('mertens-bound', 'wall-parity', 'blocked-by'),
  e('grh', 'wall-siegel-zero', 'blocked-by'),
  e('hermite-biehler-de-branges', 'flow-rigidity-wall', 'blocked-by', 'structural positivity conditions insufficient without arithmetic input (Conrey–Li 2000)'),
];

const LEGEND = Object.freeze({
  kinds: Object.freeze({
    target: 'The statement to prove',
    'equivalent-formulation': 'Statement proved equivalent to RH',
    program: 'Research program or family of results',
    'stronger-statement': 'Statement that would imply RH',
    generalization: 'Statement containing RH as a special case',
    consequence: 'Statement implied by RH',
    'partial-result': 'Proved partial result',
    record: 'Current record',
    'record-claim': 'Claimed record, not peer-reviewed',
    'conditional-result': 'Result proved under a hypothesis',
    evidence: 'Numerical or heuristic evidence',
    analog: 'Proved analogue in another setting',
    wall: 'Standing obstruction',
    'project-link': 'Interface to the project DAG',
  }),
  statusKinds: Object.freeze({
    open: 'open',
    proven: 'proven',
    claimed: 'claimed, not peer-reviewed',
    disproved: 'disproved',
    evidence: 'evidence only',
    obstruction: 'standing obstruction',
    project: 'project candidate (unreviewed)',
  }),
  edgeTypes: Object.freeze({
    equivalent: 'from ⇔ to',
    implies: 'from ⇒ to',
    'partial-toward': 'from is progress toward to',
    'blocked-by': 'from is stopped by wall to',
    supersedes: 'from improves or replaces to',
    uses: 'from takes to as input',
    analog: 'structural analogue',
    closes: 'from proves the conjecture in to',
    feeds: 'from supplies a premise of to',
  }),
});

export const RH_LANDSCAPE_DAG = Object.freeze({
  id: 'rh-landscape-dag',
  date: '2026-09-28',
  title: 'The Riemann Hypothesis: general dependency graph',
  status: 'RH open. Platt–Trudgian Λ ≤ 0.2 (2021) is the accepted peer-reviewed upper bound; Rodgers–Tao Λ ≥ 0. The project Λ ≤ 0.1758354 is a computer-assisted candidate (four barrier gates certified in Arb, y-transfer reduction and Lemma B3 Lean-checked), unreviewed and unpublished.',
  nodes: Object.freeze(NODES),
  edges: Object.freeze(EDGES),
  legend: LEGEND,
  anchors: Object.freeze([
    'rh', 'lambda-le-0', 'weil-positivity', 'pt-lambda-02', 'rt-lambda-ge-0', 'verified-height',
    'pair-correlation-wall', 'pointwise-wall', 'flow-rigidity-wall', 'zero-free-region',
    'proportion-on-line', 'connes-trace-formula',
  ]),
});

const IDS = new Set(NODES.map((x) => x.id));

export const RH_LANDSCAPE_DAG_ASSERTIONS = Object.freeze([
  {
    id: 'landscape-no-duplicate-ids',
    name: 'node ids are unique',
    why: 'graph integrity',
    holds: () => IDS.size === NODES.length,
  },
  {
    id: 'landscape-no-dangling-edges',
    name: 'every edge endpoint is a node id and every edge type is in the legend',
    why: 'graph integrity',
    holds: () => EDGES.every((x) => IDS.has(x.from) && IDS.has(x.to) && x.from !== x.to && x.type in LEGEND.edgeTypes),
  },
  {
    id: 'landscape-no-duplicate-edges',
    name: 'no (from, to, type) triple repeats',
    why: 'graph integrity',
    holds: () => new Set(EDGES.map((x) => `${x.from}|${x.to}|${x.type}`)).size === EDGES.length,
  },
  {
    id: 'landscape-rh-and-anchors-exist',
    name: 'rh node exists and is open; every anchor id used by the project DAG exists',
    why: 'project-attempts-dag.js cross-links resolve against these ids',
    holds: () => {
      const rh = NODES.find((x) => x.id === 'rh');
      return !!rh && rh.statusKind === 'open' && RH_LANDSCAPE_DAG.anchors.every((a) => IDS.has(a));
    },
  },
  {
    id: 'landscape-every-node-sourced',
    name: 'every node has a nonempty source, summary, kind and statusKind from the legend',
    why: 'citation rule',
    holds: () => NODES.every((x) => typeof x.source === 'string' && x.source.length > 5 && x.summary.length > 10 &&
      x.kind in LEGEND.kinds && x.statusKind in LEGEND.statusKinds),
  },
  {
    id: 'landscape-acyclic',
    name: 'the typed graph has no directed cycle',
    why: 'it is presented as a DAG',
    holds: () => {
      const adj = new Map(NODES.map((x) => [x.id, []]));
      EDGES.forEach((x) => adj.get(x.from).push(x.to));
      const state = new Map();
      const visit = (v) => {
        if (state.get(v) === 1) return false;
        if (state.get(v) === 2) return true;
        state.set(v, 1);
        for (const w of adj.get(v)) if (!visit(w)) return false;
        state.set(v, 2);
        return true;
      };
      return NODES.every((x) => visit(x.id));
    },
  },
  {
    id: 'landscape-honest-status',
    name: 'PT is the accepted benchmark, the project node is an unreviewed candidate, the 2/3 and quasi-RH claims are not peer-reviewed, RH open',
    why: 'no false QED; no implied publication',
    holds: () => {
      const g = (id) => NODES.find((x) => x.id === id);
      return /accepted benchmark/.test(g('pt-lambda-02').status) &&
        /unreviewed/.test(g('project-lambda-candidate').status) && /unpublished/.test(g('project-lambda-candidate').status) &&
        /not peer-reviewed/.test(g('alpoge-furman-2026').status) && g('rh').status === 'open' &&
        g('qrh-openai-2026').statusKind === 'claimed' && /^external claim, Lean-formalized/.test(g('qrh-openai-2026').status) &&
        /not peer-reviewed/.test(g('qrh-openai-2026').status) && /RH is open/.test(g('qrh-openai-2026').summary) &&
        ['qrh-liu-2026', 'qrh-xu-sang-2026'].every((id) => g(id).statusKind === 'claimed' && /^external preprint/.test(g(id).status) &&
          /not peer-reviewed/.test(g(id).status) && /RH is open/.test(g(id).summary)) &&
        /RH open/.test(RH_LANDSCAPE_DAG.status);
    },
  },
]);

export default RH_LANDSCAPE_DAG;
