/**
 * @module rh-no-go-theorems
 * @fileoverview The principal NO-GO / fundamental-limitation results bearing on
 * the Riemann Hypothesis — the ways a proof is known NOT to be reachable by a
 * given method. Two tiers: results this program (zetaexplorer) found, at the top,
 * then the established results and recognized barriers from the wider field
 * (cited). Each entry is labelled by kind:
 *   theorem     — a proven no-go / refutation
 *   barrier     — a recognized structural obstruction (not a single theorem)
 *   equivalence — a reformulation proven exactly as hard as RH (no shortcut)
 * This is a curated list of the principal results, not a claim of exhaustiveness.
 * None of these proves or disproves RH; RH remains open.
 */

export const ZETAEXPLORER_NO_GOS = Object.freeze([
  {
    title: 'Flow-blindness no-go',
    kind: 'theorem',
    by: 'zetaexplorer',
    statement:
      'No soft / backward-heat-flow hypothesis can prove RH on its own: an SL2 flow-blindness argument exhibits flows that stay "soft" yet break RH, so a proof needs genuine arithmetic input. The operator-language form is the modulus-barrier + no-gain rule.',
    route: '/flow-blindness-no-go',
  },
  {
    title: 'Freezing the rungs = Platt–Trudgian',
    kind: 'theorem',
    by: 'zetaexplorer',
    statement:
      'Freezing the twin-ladder rungs (inertia-locking the frozen ladder) caps the barrier route at the verified zero height — it is exactly the Platt–Trudgian mechanism in operator language, so it cannot cross below the verified-height floor.',
    route: '/frozen-rung-pt-equivalence',
  },
  {
    title: 'The no-gain rule (isometry cannot sharpen a margin)',
    kind: 'theorem',
    by: 'zetaexplorer',
    statement:
      'An isometric change of coordinates — bicomplex direct sum, unitary twistor rotation, exact Fourier transform — preserves norms, spectra and zero multiplicity, so it cannot by itself improve a zero-free margin. It helps only when followed by a nontrivial invariant compression, a positivity theorem, or a coercive elimination. (With the modulus barrier: recombine packets before taking a modulus.)',
    route: '/permutation-architecture',
  },
  {
    title: 'The C_H / C_Lip wall is closed three ways',
    kind: 'theorem',
    by: 'zetaexplorer',
    statement:
      'The finite-height Lipschitz route to the collision constant is provably closed: a Hölder-½ lower bound forces C_Lip → ∞; a linear-N norm-mismatch dilutes a 2-particle collision across all N; every squared-gap surrogate is refuted. The famous ∫2/g² divergence is a coordinate artifact that cancels exactly in h = g².',
    route: '/route-map',
  },
  {
    title: 'No hidden shortcut below RH in the mapped routes',
    kind: 'barrier',
    by: 'zetaexplorer',
    statement:
      'Across all 38 mapped closure routes, a uniform pattern: every promising route is either not rigorous (funnelling into the C_H wall) or RH-equivalent (a reformulation). There is no route that lands below RH; they all meet the same two-sided pair-correlation / GUE wall.',
    route: '/route-map',
  },
]);

export const FIELD_NO_GOS = Object.freeze([
  {
    title: 'Λ ≥ 0 — "RH is barely true"',
    kind: 'theorem',
    by: 'Rodgers–Tao (2020)',
    statement:
      'The de Bruijn–Newman constant is non-negative, so (with RH ⟺ Λ ≤ 0) RH, if true, is true by an arbitrarily thin margin (Λ = 0 exactly). An arbitrarily small amount of backward heat flow destroys the reality of the zeros — so no soft or perturbation-stable argument can prove RH.',
    ref: 'Forum of Mathematics, Pi (2020); arXiv:1801.05914',
  },
  {
    title: 'de Branges’ Hilbert-space approach is refuted as formulated',
    kind: 'theorem',
    by: 'Conrey–Li (1998)',
    statement:
      'The positivity conditions de Branges’ method requires demonstrably FAIL for the zeta function and for L(s, χ₄). The approach as stated cannot prove RH.',
    ref: 'arXiv:math/9812166',
  },
  {
    title: 'Positivity criteria are equivalences, not shortcuts',
    kind: 'equivalence',
    by: 'Li; Weil; Beurling–Nyman; Báez-Duarte',
    statement:
      'RH ⟺ λ_n ≥ 0 for all n (Li), ⟺ the Weil explicit-formula functional is positive-semidefinite, ⟺ the constant 1 lies in the L²-closure of dilated fractional-part functions (Beurling–Nyman / Báez-Duarte). Each encodes RH exactly; proving any is exactly as hard as RH.',
    ref: 'Bombieri–Lagarias (1999); Báez-Duarte arXiv:math/0202141',
  },
  {
    title: 'No self-adjoint xp operator with the zeros as its spectrum',
    kind: 'barrier',
    by: 'Berry–Keating; Bender–Brody–Müller (critiqued)',
    statement:
      'The Hilbert–Pólya hope has no known realization: H = xp reproduces only the MEAN zero density (continuous spectrum), and PT-symmetric constructions assume the hard part (self-adjointness / reality) rather than proving it. Montgomery–Odlyzko GUE statistics constrain the shape of such a spectrum but do not construct it.',
    ref: 'Berry–Keating (1999); Bellissard, arXiv:1704.02644',
  },
  {
    title: 'Jensen–Pólya hyperbolicity is too generic to distinguish RH',
    kind: 'barrier',
    by: 'critique of Griffin–Ono–Rolen–Zagier',
    statement:
      'The proven degree-by-degree hyperbolicity of the Jensen polynomials (via convergence to Hermite polynomials) is a generic phenomenon: it cannot separate RH from near-misses, so it is not a plausible route to RH.',
    ref: 'arXiv:2008.07206 (critique); GORZ arXiv:1902.07321 (the positive result)',
  },
  {
    title: 'The sieve parity barrier',
    kind: 'barrier',
    by: 'Selberg; general sieve theory',
    statement:
      'Purely sieve-theoretic / analytic methods cannot detect the parity of the number of prime factors without new arithmetic input — the analytic analogue of the flow-blindness obstruction. Soft methods capture average behaviour but not the rigidity that forces every zero onto the line.',
    ref: 'classical; see Friedlander–Iwaniec, Opera de Cribro',
  },
  {
    title: 'The Montgomery pair-correlation wall',
    kind: 'barrier',
    by: 'Montgomery (1973); 50 years open',
    statement:
      'Pair-correlation / n-level routes hit a decades-old wall: the unconditional three-point (Rudnick–Sarnak) input holds only for restricted Fourier support, and pushing it to full support IS the open conjecture. This is the recurring obstruction across the literature-port routes.',
    ref: 'Montgomery pair-correlation conjecture; Rudnick–Sarnak (1996)',
  },
  {
    title: 'The function-field / number-field gap',
    kind: 'barrier',
    by: 'Weil; Deligne (function field); open for ℤ',
    statement:
      'RH is proven for curves over finite fields (Weil) because a real geometric object exists — the curve, Frobenius, and intersection positivity. The number-field analogue of that geometry (an H¹ for Spec ℤ, a Frobenius) is exactly what is missing; supplying it is the deep problem.',
    ref: 'Weil (1948); Deligne (1974)',
  },
]);
