/**
 * @module scattering-literature
 * @fileoverview Curated database of scattering-theory papers connecting
 * zeta / L-functions to scattering theory. Exports
 * {@link scatteringLiterature} (entries), {@link literatureStats},
 * {@link byAuthor}, and {@link criticalPapers}. Background reference for
 * the LP path; NOT part of the formal proof chain. Module-doc added by
 * imp-915.
 * @see imp-146
 */

/**
 * Scattering Theory Literature Database
 *
 * imp-146: Papers connecting zeta functions, L-functions, and scattering theory.
 * The LP path (our current primary approach) builds on this literature.
 */

export const scatteringLiterature = [
  // ═══════════════════════════════════════════════════════════════════════
  // FOUNDATIONAL PAPERS
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: 'lax-phillips-1967',
    authors: 'P.D. Lax, R.S. Phillips',
    year: 1967,
    title: 'Scattering Theory',
    journal: 'Academic Press (book)',
    keyResult:
      'General framework for scattering theory with incoming/outgoing subspaces. ' +
      'Theorem IV.3.1: contraction semigroup Z(t) = P·U(t)·P → S-matrix poles in lower half-plane.',
    relevance: 'PRIMARY: the theoretical framework for our LP path. Directly provides the ' +
      'pole confinement theorem we need.',
    zpoConnection: 'Z_∞(t) from the ZPO Hamiltonian H_∞ is a contraction semigroup; ' +
      'LP Theorem IV.3.1 gives pole confinement in the lower half-plane.',
  },
  {
    id: 'lax-phillips-1976',
    authors: 'P.D. Lax, R.S. Phillips',
    year: 1976,
    title: 'Scattering Theory for Automorphic Functions',
    journal: 'Annals of Mathematics Studies 87',
    keyResult:
      'Applied LP scattering theory to automorphic forms on hyperbolic surfaces. ' +
      'Showed that resonances (S-matrix poles) correspond to Maass wave forms.',
    relevance: 'CRITICAL: Lax-Phillips themselves applied their theorem to ZETA-LIKE functions ' +
      '(Selberg zeta). This IS the precedent for our approach.',
    zpoConnection: 'The automorphic setup relates to ζ via the Selberg zeta function of ' +
      'the modular surface Γ=PSL(2,Z). For compact surfaces: Selberg RH is PROVED.',
  },
  {
    id: 'pavlov-faddeev-1972',
    authors: 'B.S. Pavlov, L.D. Faddeev',
    year: 1972,
    title: 'Scattering theory and automorphic functions',
    journal: 'J. Soviet Math. 3, 522-548',
    keyResult:
      'Independent development of scattering theory for automorphic functions. ' +
      'Constructed a model operator whose spectrum relates to ζ-zeros.',
    relevance: 'HIGH: Parallel approach to Lax-Phillips. The Pavlov-Faddeev model operator ' +
      'is a candidate for the Hilbert-Pólya operator.',
    zpoConnection: 'Model operator on L²(0,∞) with specific boundary conditions mimics ' +
      'the ZPO Hamiltonian structure.',
  },

  // ═══════════════════════════════════════════════════════════════════════
  // HYPERBOLIC SURFACES & SELBERG ZETA
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: 'selberg-1956',
    authors: 'A. Selberg',
    year: 1956,
    title: 'Harmonic analysis and discontinuous groups in weakly symmetric Riemannian spaces with applications to Dirichlet series',
    journal: 'J. Indian Math. Soc. 20, 47-87',
    keyResult:
      'The Selberg trace formula: ∑_λ h(λ) = (Area/4π)·∫ h(r)·r·tanh(πr)·dr + ∑_γ (geodesic contributions). ' +
      'Connects Laplacian spectrum to primitive geodesic lengths.',
    relevance: 'CRITICAL: Prime geodesics on Γ\\H have lengths ~ 2·log(p). The Selberg zeta ' +
      'function Z_Γ(s) has all zeros on the critical line for compact surfaces.',
    zpoConnection: 'The ZPO "primes as resonant modes" framework is exactly the Selberg setup ' +
      'where primes ARE the primitive geodesics.',
  },
  {
    id: 'colin-de-verdiere-1983',
    authors: 'Y. Colin de Verdière',
    year: 1983,
    title: 'Pseudo-laplaciens II',
    journal: 'Ann. Inst. Fourier 33, 87-113',
    keyResult:
      'Scattering theory on non-compact hyperbolic surfaces. Showed that the scattering ' +
      'determinant φ(s) has poles at the zeros of ζ for Γ = PSL(2,Z).',
    relevance: 'VERY HIGH: Direct connection between ζ-zeros and scattering poles on the ' +
      'modular surface.',
    zpoConnection: 'φ(s) = ζ(2s-1)/ζ(2s) — similar to our S₂₁ = ζ(2s)/ζ(s) from imp-121!',
  },
  {
    id: 'borthwick-2016',
    authors: 'D. Borthwick',
    year: 2016,
    title: 'Spectral Theory of Infinite-Area Hyperbolic Surfaces',
    journal: 'Birkhäuser (book, 2nd ed.)',
    keyResult:
      'Modern treatment of scattering theory on hyperbolic surfaces. Explicit formulas ' +
      'for resonances in terms of ζ-zeros for the modular surface.',
    relevance: 'HIGH: Contemporary reference for the Selberg/scattering connection.',
    zpoConnection: 'Provides explicit formulas we can compare with S₂₁ = ζ(2s)/ζ(s).',
  },

  // ═══════════════════════════════════════════════════════════════════════
  // QUANTUM CHAOS & BERRY-KEATING
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: 'berry-keating-1999',
    authors: 'M.V. Berry, J.P. Keating',
    year: 1999,
    title: 'H = xp and the Riemann zeros',
    journal: 'Supersymmetry and Trace Formulae, 355-367',
    keyResult:
      'Proposed the Hamiltonian H = ½(xp + px) as the Hilbert-Pólya operator. ' +
      'Classical Hamiltonian xp on bounded phase space has quantum spectrum matching ζ-zeros.',
    relevance: 'HIGH: The "xp" Hamiltonian is the most studied Hilbert-Pólya candidate.',
    zpoConnection: 'ZPO Hamiltonian is tridiagonal with log²(p) eigenvalues — different from xp ' +
      'but same spirit (find operator with ζ-zeros as spectrum).',
  },
  {
    id: 'sierra-2007',
    authors: 'G. Sierra',
    year: 2007,
    title: 'The Riemann zeros as spectrum and the Riemann hypothesis',
    journal: 'arXiv:1601.01797',
    keyResult:
      'Regularized xp Hamiltonian with physical boundary conditions. ' +
      'Spectrum approximates ζ-zeros asymptotically.',
    relevance: 'MEDIUM: Extension of Berry-Keating. Shows xp has difficulties near x=0.',
    zpoConnection: 'ZPO avoids the x=0 singularity by using a discrete prime index.',
  },
  {
    id: 'bender-brody-muller-2017',
    authors: 'C.M. Bender, D.C. Brody, M.P. Müller',
    year: 2017,
    title: 'Hamiltonian for the Zeros of the Riemann Zeta Function',
    journal: 'Phys. Rev. Lett. 118, 130201',
    keyResult:
      'Claimed construction of a non-Hermitian Hamiltonian with PT symmetry whose ' +
      'eigenvalues are the imaginary parts of ζ-zeros.',
    relevance: 'CONTROVERSIAL: The construction has technical issues (see Bellissard 2017).',
    zpoConnection: 'ZPO uses Hermitian operators (tridiagonal real symmetric) — avoids the ' +
      'PT-symmetry technicalities.',
  },

  // ═══════════════════════════════════════════════════════════════════════
  // FRACTAL STRINGS (LAPIDUS)
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: 'lapidus-frankenhuijsen-2000',
    authors: 'M.L. Lapidus, M. van Frankenhuijsen',
    year: 2000,
    title: 'Fractal Geometry and Number Theory: Complex Dimensions of Fractal Strings and Zeros of Zeta Functions',
    journal: 'Birkhäuser (book)',
    keyResult:
      'Fractal string: sequence of interval lengths {ℓ_j}. Geometric zeta function ' +
      'ζ_L(s) = ∑ ℓ_j^s. "Complex dimensions" = poles of ζ_L. For the prime string ' +
      '{1/p}: complex dimensions relate to zeros of ζ.',
    relevance: 'HIGH: Alternative geometric framework connecting primes to ζ-zeros.',
    zpoConnection: 'Fractal string language maps to ZPO cascade via L_k = log(p_k) and ' +
      'spectral zeta functions.',
  },

  // ═══════════════════════════════════════════════════════════════════════
  // CONNES NONCOMMUTATIVE GEOMETRY
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: 'connes-1999',
    authors: 'A. Connes',
    year: 1999,
    title: 'Trace formula in noncommutative geometry and the zeros of the Riemann zeta function',
    journal: 'Selecta Mathematica 5, 29-106',
    keyResult:
      'Noncommutative geometry approach: constructs an adelic space whose spectral ' +
      'triple has ζ-zeros as the spectrum. RH equivalent to a positivity condition.',
    relevance: 'CRITICAL: Deepest known framework connecting ζ-zeros to operators.',
    zpoConnection: 'ZPO Hamiltonian diagonal = Connes D² (imp-119). ZPO off-diagonal = ' +
      'additional coupling beyond Connes diagonal model.',
  },
  {
    id: 'deninger-1998',
    authors: 'C. Deninger',
    year: 1998,
    title: 'Some analogies between number theory and dynamical systems on foliated spaces',
    journal: 'Proc. ICM Berlin 1998, Vol. I, 163-186',
    keyResult:
      'Proposed "regularized determinant" approach: ζ(s) as det(Δ-s) for a hypothetical ' +
      'operator Δ on a hypothetical space.',
    relevance: 'HIGH: The regularized determinant is an alternative Hilbert-Pólya approach.',
    zpoConnection: 'ZPO cascade = regularized determinant of the prime Hamiltonian.',
  },

  // ═══════════════════════════════════════════════════════════════════════
  // DE BRUIJN-NEWMAN
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: 'de-bruijn-1950',
    authors: 'N.G. de Bruijn',
    year: 1950,
    title: 'The Roots of Trigonometric Integrals',
    journal: 'Duke Math. J. 17, 197-226',
    keyResult:
      'Defined the heat flow evolution of Riemann\'s Ξ function. Proved Λ ≤ ½.',
    relevance: 'HIGH: Founded the de Bruijn-Newman constant approach to RH.',
    zpoConnection: 'Heat flow interpretation connects to surface tension Hamiltonian (imp-143).',
  },
  {
    id: 'newman-1976',
    authors: 'C.M. Newman',
    year: 1976,
    title: 'Fourier transforms with only real zeros',
    journal: 'Proc. AMS 61, 245-251',
    keyResult:
      'Introduced the Newman constant Λ. Conjectured Λ ≥ 0, equivalent to RH.',
    relevance: 'HIGH: Defined the critical constant for RH via heat flow.',
    zpoConnection: 'RH ⟺ Λ = 0 = critical annealing temperature (imp-142).',
  },
  {
    id: 'rodgers-tao-2020',
    authors: 'B. Rodgers, T. Tao',
    year: 2020,
    title: 'The De Bruijn-Newman constant is non-negative',
    journal: 'Forum Math. Pi 8, e6',
    keyResult:
      'PROVED Λ ≥ 0 (previously conjectured). Combined with De Bruijn\'s Λ ≤ ½, now ' +
      '0 ≤ Λ ≤ ½. RH ⟺ Λ = 0.',
    relevance: 'RECENT MAJOR RESULT: Narrowed the gap to RH.',
    zpoConnection: 'Rodgers-Tao method involves Brownian motion of zeros — connects to vacuum ' +
      'bubble dynamics (imp-142).',
  },

  // ═══════════════════════════════════════════════════════════════════════
  // RANDOM MATRIX THEORY
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: 'montgomery-1973',
    authors: 'H.L. Montgomery',
    year: 1973,
    title: 'The pair correlation of zeros of the zeta function',
    journal: 'Analytic Number Theory (AMS), 181-193',
    keyResult:
      'Conjectured that the pair correlation of ζ-zeros matches that of eigenvalues ' +
      'of random Hermitian matrices (GUE).',
    relevance: 'FOUNDATIONAL: Random matrix connection to ζ-zeros.',
    zpoConnection: 'GUE statistics verified for ZPO (imp-074).',
  },
  {
    id: 'odlyzko-1987',
    authors: 'A.M. Odlyzko',
    year: 1987,
    title: 'On the distribution of spacings between zeros of the zeta function',
    journal: 'Math. Comp. 48, 273-308',
    keyResult:
      'Computed millions of ζ-zeros and verified Montgomery\'s pair correlation ' +
      'conjecture numerically with extraordinary precision.',
    relevance: 'HIGH: Empirical confirmation of GUE statistics.',
    zpoConnection: 'Our 870 zeros from Odlyzko\'s tables (imp-067).',
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// Statistics
// ═══════════════════════════════════════════════════════════════════════════

export function literatureStats() {
  const byRelevance = {};
  const byDecade = {};
  scatteringLiterature.forEach(p => {
    const rel = p.relevance.split(':')[0];
    byRelevance[rel] = (byRelevance[rel] || 0) + 1;
    const decade = `${Math.floor(p.year / 10) * 10}s`;
    byDecade[decade] = (byDecade[decade] || 0) + 1;
  });
  return { total: scatteringLiterature.length, byRelevance, byDecade };
}

export function byAuthor(authorName) {
  return scatteringLiterature.filter(p =>
    p.authors.toLowerCase().includes(authorName.toLowerCase())
  );
}

export function criticalPapers() {
  return scatteringLiterature.filter(p =>
    p.relevance.startsWith('CRITICAL') || p.relevance.startsWith('PRIMARY')
  );
}
