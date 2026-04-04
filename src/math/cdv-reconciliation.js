/**
 * Reconciling Colin de Verdière with Our ZPO Formula
 *
 * imp-151: Colin de Verdière (1983) proved that the scattering determinant
 * on the modular surface Γ = PSL(2,Z) is:
 *
 *   φ(s) = ζ(2s-1) / ζ(2s)
 *
 * Our imp-121 induction gives:
 *
 *   S₂₁(s) = ζ(2s) / ζ(s)
 *
 * These are DIFFERENT functions. Reconcile them.
 *
 * TRANSFORMATION ANALYSIS:
 *
 *   Let s → s + ½ in CdV: φ(s+½) = ζ(2s) / ζ(2s+1)
 *   Let s → 2s in our formula: S₂₁(2s) = ζ(4s) / ζ(2s)
 *   Neither matches.
 *
 *   Try inverse: 1/φ(s) = ζ(2s)/ζ(2s-1)
 *   Compare: S₂₁(s) = ζ(2s)/ζ(s).
 *   Set 2s-1 = s → s = 1. Only agrees at single point.
 *
 *   Both functions have POLES at ζ-zeros (of the denominator):
 *   - CdV: poles at s where ζ(2s) = 0, i.e., 2s = ρ → s = ρ/2 ≈ σ=¼
 *   - Ours: poles at s where ζ(s) = 0, i.e., s = ρ ≈ σ=½
 *
 *   So CdV pole locations are HALF of our pole locations.
 *
 * THE KEY DIFFERENCE:
 *
 *   CdV scattering determinant on Γ\H:
 *   - The spectral parameter is related to eigenvalue of Δ on the surface
 *   - Eisenstein series E(s) has functional equation E(s) = φ(s)·E(1-s)
 *   - Pole at s=1 of E(s) corresponds to constant eigenfunction
 *   - φ(s) = ζ(2s-1)/ζ(2s) controls the reflection from the cusp
 *
 *   Our ZPO cascade:
 *   - Tridiagonal operator with prime-indexed entries
 *   - S-matrix from ABCD transfer-matrix construction
 *   - S₂₁ = ζ(2s)/ζ(s) by direct induction
 *
 *   BOTH are "scattering determinants" in their respective contexts,
 *   but the underlying Hilbert spaces and Hamiltonians are different.
 *
 * WHY CdV WORKS AND ZPO DOESN'T (YET):
 *
 *   CdV works because:
 *   1. The modular surface Γ\H has a GENUINE continuous spectrum from the cusp
 *   2. Eisenstein series E(s) are the scattering states
 *   3. The functional equation of ζ is the SCATTERING RELATION
 *   4. Maass cusp forms correspond to bound states
 *
 *   For ZPO:
 *   1. Our tridiagonal H_N has only POINT spectrum (discrete)
 *   2. No natural continuous spectrum from which to scatter
 *   3. The "scattering" is algebraic (transfer matrices), not genuine wave scattering
 *   4. The identification S₂₁ = ζ(2s)/ζ(s) is ALGEBRAIC, not operator-theoretic
 *
 *   INSIGHT: The ZPO framework is ALGEBRAIC. To connect to LP, we need
 *   to promote H_N to an operator with CONTINUOUS spectrum. This means
 *   attaching infinite leads, but those leads need the RIGHT structure
 *   (perhaps hyperbolic, not Euclidean).
 */

import { ZETA_ZEROS } from './zeta.js';

// ── The mismatch ────────────────────────────────────────────────────────────

function formulaComparison() {
  return {
    cdvFormula: 'φ(s) = ζ(2s-1) / ζ(2s)',
    ourFormula: 'S₂₁(s) = ζ(2s) / ζ(s)',
    cdvPoles: 'At s = ρ/2 where ρ is a ζ-zero (so σ ≈ ¼)',
    ourPoles: 'At s = ρ (ζ-zeros themselves, σ ≈ ½ if RH)',
    cdvZeros: 'At s = (ρ+1)/2 (trivial or nontrivial ζ-zeros)',
    ourZeros: 'At s = ρ/2 (same as CdV poles)',
    factor: 'S₂₁(s) · φ(s)? = ζ(2s)/ζ(s) · ζ(2s-1)/ζ(2s) = ζ(2s-1)/ζ(s) — still ζ-ratio but different',
  };
}

// ── Functional equation perspective ─────────────────────────────────────────

function functionalEquationAnalysis() {
  // ζ(1-s) = χ(s)^{-1} · ζ(s) where χ(s) is our bridge.
  // So ζ(2s-1) = χ(2-2s)^{-1} · ζ(2-2s).
  // CdV: φ(s) = ζ(2s-1)/ζ(2s) = [χ(2-2s)^{-1} · ζ(2-2s)] / ζ(2s)

  // On critical line s = ½+it: 2s = 1+2it, 2s-1 = 2it, 2-2s = 1-2it.
  // φ(½+it) = ζ(2it) / ζ(1+2it)
  // Our S₂₁(½+it) = ζ(1+2it) / ζ(½+it)

  // Ratio: φ/S₂₁ = [ζ(2it)/ζ(1+2it)] · [ζ(½+it)/ζ(1+2it)] = ζ(2it)·ζ(½+it)/ζ(1+2it)²

  // This is complicated. The two formulas capture DIFFERENT aspects of
  // the ζ zero structure.

  return {
    onCriticalLine: {
      cdv: 'φ(½+it) = ζ(2it)/ζ(1+2it)',
      ours: 'S₂₁(½+it) = ζ(1+2it)/ζ(½+it)',
      ratio: 'φ/S₂₁ depends on ζ(2it), ζ(1+2it), ζ(½+it)',
    },
    insight: 'The two formulas are DIFFERENT scattering coefficients for ' +
      'DIFFERENT operators. Both relate to ζ but through different mechanisms.',
  };
}

// ── The missing ingredient ──────────────────────────────────────────────────

function missingIngredient() {
  return {
    question: 'What Hamiltonian has LP S-matrix = ζ(2s)/ζ(s)?',

    cdvCase: {
      operator: 'Laplacian Δ on Γ\\H = PSL(2,Z)\\H (modular surface)',
      spectrum: 'Continuous ∪ cusp forms, bottom at λ=¼',
      scatteringSetup: 'Eisenstein series E(s) = Σ_{γ∈Γ_∞\\Γ} Im(γz)^s',
      result: 'Scattering matrix φ(s) = ζ(2s-1)/ζ(2s) (proven)',
    },

    ourGoal: {
      formula: 'S(s) = ζ(2s)/ζ(s)',
      candidateOperator1: 'Modified modular surface (different group action?)',
      candidateOperator2: 'Quantum graph with primes as node labels',
      candidateOperator3: 'Tridiagonal H_N with DIFFERENT lead attachment',
    },

    conjecture:
      'The ZPO formula S₂₁ = ζ(2s)/ζ(s) may be the scattering coefficient of ' +
      'a NON-STANDARD operator — perhaps the Laplacian on a HYPERBOLIC CONE ' +
      'with angle 2π (not the standard 2π·1 modular surface). Or the operator ' +
      'on SL(2,Z)\\H but with DIFFERENT boundary conditions at the cusp.',

    researchDirection:
      'Find the arithmetic surface Σ whose scattering determinant is ζ(2s)/ζ(s). ' +
      'Such a Σ may be related to the modular surface via a degree-2 cover or quotient.',
  };
}

// ── Direct comparison: poles and zeros ──────────────────────────────────────

function polesZerosComparison() {
  const firstFewZeros = ZETA_ZEROS.slice(0, 5);

  return firstFewZeros.map((gamma, idx) => {
    return {
      zetaZero: `½ + ${gamma.toFixed(4)}i`,
      cdvPoleAt: `s = ρ/2 = ¼ + ${(gamma / 2).toFixed(4)}i`,
      ourPoleAt: `s = ρ = ½ + ${gamma.toFixed(4)}i`,
      cdvSigma: 0.25,
      ourSigma: 0.5,
      difference: 'CdV poles at σ=¼, ours at σ=½',
    };
  });
}

// ── Main analysis ────────────────────────────────────────────────────────────

export function cdvReconciliationTest() {
  const comparison = formulaComparison();
  const fe = functionalEquationAnalysis();
  const missing = missingIngredient();
  const polesZeros = polesZerosComparison();

  return {
    formulaComparison: comparison,
    functionalEquationAnalysis: fe,
    missingIngredient: missing,
    polesZerosComparison: polesZeros,

    mainFinding:
      'CdV (1983): φ(s) = ζ(2s-1)/ζ(2s) — proven, scattering on Γ\\H. ' +
      'ZPO (imp-121): S₂₁ = ζ(2s)/ζ(s) — algebraic, from tridiagonal cascade. ' +
      'These are DIFFERENT functions capturing DIFFERENT zero structures. ' +
      'They are NOT the same scattering matrix.',

    implication:
      'The ZPO formula S₂₁ = ζ(2s)/ζ(s) may not correspond to any standard scattering setup. ' +
      'The identification with LP theory (imp-131) requires finding the RIGHT underlying operator. ' +
      'Current best candidates: modified modular surface, quantum graph with prime labels, ' +
      'or a non-standard variant of CdV\'s construction.',

    honestAssessment:
      'We have two meromorphic functions that BOTH relate to ζ-zeros in some way: ' +
      'CdV\'s scattering determinant has a rigorous operator-theoretic origin. ' +
      'Our algebraic S₂₁ has no such origin yet. ' +
      'Bridging the gap is essential for rigorous application of LP to RH. ' +
      'This is an open research problem, not a quick computation.',

    verdict:
      'CDV RECONCILIATION: φ(s)=ζ(2s-1)/ζ(2s) ≠ S₂₁(s)=ζ(2s)/ζ(s). ' +
      'DIFFERENT functions with DIFFERENT pole locations (σ=¼ vs σ=½). ' +
      'CdV has rigorous operator-theoretic origin (Laplacian on modular surface). ' +
      'Our S₂₁ is algebraic (from tridiagonal ABCD cascade). ' +
      'Bridging: find the arithmetic surface whose scattering determinant is ζ(2s)/ζ(s). ' +
      'This is the CONCRETE OPEN PROBLEM for the LP path.',
  };
}
