/**
 * @module formalization-review-2026-07-20
 * @fileoverview Shareable review dashboard for the machine-checked polynomial
 * de Bruijn / Pólya–Schur formalization: the result, its significance, the
 * shareable gist, and how to verify. Pre-submission review artifact.
 */

export const REVIEW_META = {
  title: 'Polynomial de Bruijn / Pólya–Schur theorem — machine-checked in Lean 4',
  oneLiner:
    'The heat operator e^{−t·D²} preserves real-rootedness of real polynomials (t ≥ 0) — proved ' +
    'sorry-free, axiom-clean, on mathlib v4.22.0. Classical (Pólya–Schur 1914 / de Bruijn 1950); ' +
    'fills a genuine mathlib gap. NOT the Riemann Hypothesis.',
  statement: 'theorem heat_preserves_LP (t : ℝ) (ht : 0 ≤ t) {p : ℝ[X]} (hp : HasOnlyRealRoots p) : HasOnlyRealRoots (heatOp t p)',
  gist: 'https://gist.github.com/judegomila/7fcce4803c58844a166d04123b0f2aae',
  repoPath: 'formalization/review-packet/  (RealRootedPreservation.lean · REVIEW.md · POLYNOMIAL_DE_BRUIJN.md · SUBMISSION.md · ZULIP_POST.md)',
};

export const RESULTS = [
  { name: 'hasOnlyRealRoots_derivative', desc: 'Differentiation D preserves real-rootedness (multiplicity-counting Rolle).' },
  { name: 'hermitePoulain_shift', desc: 'The Hermite–Poulain shift p ↦ p′ + c·p preserves real-rootedness (incl. the “root at infinity” via EVT/Fermat on e^{cx}·p).' },
  { name: 'oneMinusCD2_realRooted', desc: 'The finite heat factor 1 − c·D² preserves real-rootedness (via (1+√c·D)(1−√c·D)).' },
  { name: 'hasOnlyRealRoots_of_tendsto_coeff', desc: 'Real-rootedness is closed under coefficient-wise limits — a real-variable Hurwitz theorem via root-vector compactness (no complex analysis).' },
  { name: 'heat_preserves_LP', desc: 'The heat operator e^{−t·D²} preserves real-rootedness for t ≥ 0 (headline; polynomial case of Pólya–Schur / de Bruijn).' },
];

export const SIGNIFICANCE = [
  {
    h: 'A cornerstone of classical analysis',
    b: 'The Laguerre–Pólya class and the Pólya–Schur (1914) theory of multiplier sequences are foundational in the theory of entire functions and real-rooted ("hyperbolic") polynomials. That the heat/Gaussian multiplier e^{−t·D²} preserves real-rootedness is the structural fact underlying de Bruijn’s 1950 work on the de Bruijn–Newman constant. This is bedrock, not a niche curiosity.',
  },
  {
    h: 'Real-rootedness is load-bearing across mathematics',
    b: 'It recurs far beyond number theory: in COMBINATORICS a real-rooted generating polynomial has log-concave, unimodal coefficients (Newton’s inequalities) — the standard route to log-concavity proofs; in PROBABILITY real-rootedness ⇔ negative dependence / strongly-Rayleigh measures (Borcea–Brändén), with the Hermite–Poulain operators exactly the maps preserving them; in OPTIMIZATION hyperbolic polynomials underpin hyperbolic programming (a generalization of SDP); and in ANALYTIC NUMBER THEORY the LP class is precisely where the Riemann ξ must lie, and the Jensen-polynomial hyperbolicity program (Griffin–Ono–Rolen–Zagier, PNAS 2019) turns on exactly this real-rootedness.',
  },
  {
    h: 'What the formalization contributes',
    b: 'mathlib has real-rootedness only implicitly (via Splits/roots), Hermite polynomials but not the Hermite–Poulain operators, and nothing on multiplier / LP preservation. This provides a verified, reusable toolbox — in particular the real-variable Hurwitz lemma (real-rootedness closed under coefficient limits, proved by compactness rather than the argument principle mathlib lacks) is exactly the kind of general-purpose brick that future formalizations (log-concavity, strongly-Rayleigh, Jensen-polynomial hyperbolicity) would build on. It also machine-checks a delicate step (the “root at infinity”).',
  },
  {
    h: 'Honest calibration',
    b: 'This is NOT new mathematics — every result is classical (1914–1950) — and it is NOT progress on the Riemann Hypothesis (the project’s own adversarial analysis established a no-go “obstruction seam”). Its significance is as verified, reusable foundational infrastructure: a mathlib gap filled in a concept that matters across several fields, machine-checked so downstream results can rest on it with kernel-level confidence. Modest but genuine.',
  },
];

export const UNLOCKS = [
  {
    name: 'Hermite polynomials are real-rooted',
    status: 'proved',
    desc: 'HeatCorollaries.hermite_map_hasOnlyRealRoots — stated on mathlib’s own Polynomial.hermite, ' +
      'proved sorry-free and axiom-audited via the operator identity He_n = e^{−D²/2}·xⁿ = heatOp(1/2)(Xⁿ). ' +
      'A direct application of the theorem: Xⁿ is real-rooted, the heat operator preserves that. New to mathlib.',
  },
  {
    name: 'Real-rooted ⇒ log-concave coefficients (Newton’s inequalities)',
    status: 'in-progress',
    desc: 'HeatCorollaries.newton_inequality — the correct statement is committed with one honest, documented ' +
      'sorry; the proof (repeated-differentiation reduction to the degree-2 discriminant base case) is not yet built. ' +
      'mathlib has the symmetric-function Newton identities but not the polynomial inequalities.',
  },
];

export const VERIFY = [
  'Toolchain pinned: leanprover/lean4 v4.22.0 + mathlib v4.22.0 (lean-toolchain + lakefile.toml in the packet).',
  'lake exe cache get   # one-time mathlib oleans',
  'lake build           # compiles RealRootedPreservation.lean, exit 0',
  "echo 'import RealRootedPreservation\\n#print axioms Polynomial.heat_preserves_LP' | lake env lean /dev/stdin",
  '→ [propext, Classical.choice, Quot.sound]   (NO sorryAx). All 30 declarations audited clean; #lint passes.',
];

export const OPEN_QUESTIONS = [
  'API: bespoke predicate HasOnlyRealRoots vs mathlib’s existing Splits (RingHom.id ℝ) — the decisive maintainer question (Zulip-first).',
  'Naming/placement: heatOp / oneMinusCD2 (abbreviations) will need mathlib-conforming names + target files.',
  'Provenance: AI-drafted, kernel-verified — the #print axioms output is the guarantee; re-run it.',
];

export const FORMALIZATION_REVIEW = {
  meta: REVIEW_META,
  results: RESULTS,
  unlocks: UNLOCKS,
  significance: SIGNIFICANCE,
  verify: VERIFY,
  openQuestions: OPEN_QUESTIONS,
};
