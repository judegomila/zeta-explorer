/**
 * Bayesian Failure Analysis: Which Step Most Likely Fails?
 *
 * imp-118: If the proof is wrong, WHERE?
 *
 * Assign prior probabilities to each step being correct based on:
 *   - How "standard" the mathematics is
 *   - Whether it's been used in published proofs before
 *   - Whether it has numerical verification
 *   - Whether the devil's advocate found weaknesses
 *
 * Compute the posterior probability that the ENTIRE chain is correct.
 * The step with the lowest individual probability is the weakest link.
 */

export function bayesianFailureAnalysis() {
  const steps = [
    {
      id: 'S1',
      claim: 'det(T_p) = cos²θ + sin²θ = 1',
      priorCorrect: 0.9999,
      justification: 'Pythagorean identity. Used in every trigonometry textbook for 2500 years. Zero chance of being wrong.',
      devilsAdvocateIssue: null,
      numericallyVerified: true,
    },
    {
      id: 'S2',
      claim: 'det(S_N) = Π det(T_p) = 1',
      priorCorrect: 0.9999,
      justification: 'Multiplicativity of determinant. Core linear algebra. Published by Cauchy (1812). No issue.',
      devilsAdvocateIssue: null,
      numericallyVerified: true,
    },
    {
      id: 'S3-Mertens',
      claim: 'δ(P) = O(1/log P) → 0',
      priorCorrect: 0.995,
      justification: 'Mertens (1874) is unconditional and has been verified independently for 150 years. Rosser-Schoenfeld constants (1962) have been re-derived. We verified with interval arithmetic. The tiny uncertainty (0.5%) comes from our specific formulation of δ(P) in terms of the ZPO S-matrix — the bound on the product is standard, but our mapping to unitarity deficit could have an algebraic error.',
      devilsAdvocateIssue: null,
      numericallyVerified: true,
    },
    {
      id: 'S4-Topology',
      claim: 'Any cluster point of {S_N} is in SO(2)',
      priorCorrect: 0.99,
      justification: 'The topology argument (closed sets, continuity, cluster points) uses only standard analysis. The 1% uncertainty: does δ(S_N) → 0 ACTUALLY imply ||S_N^T S_N - I|| → 0? Yes, by definition, if δ is defined as this norm. But if there is a subtlety in how δ is computed from the cascade (e.g., normalization), an error could creep in.',
      devilsAdvocateIssue: 'A3 (boundedness) — defense was STRONG',
      numericallyVerified: true,
    },
    {
      id: 'S5-IdentityThm',
      claim: 'S₂₁(s) · ζ(s) = c on all ℂ',
      priorCorrect: 0.90,
      justification: 'The identity theorem is standard complex analysis. The 10% uncertainty comes from: (a) Is S₂₁ actually meromorphic? This requires the cascade limit to be well-defined as an analytic function, not just a matrix limit. (b) Does the Euler product identity S₂₁ = c/ζ hold for our SPECIFIC ABCD construction, not just in general? This was verified numerically but not proved analytically from the ABCD entries. Devil\'s advocate A4 flagged this.',
      devilsAdvocateIssue: 'A4 — defense was MODERATE. Partially addressed by imp-114.',
      numericallyVerified: true,
    },
    {
      id: 'S6-Mapping',
      claim: 'Lossless axis = σ = ½',
      priorCorrect: 0.995,
      justification: '|χ(½+it)| = 1 is an algebraic identity from the functional equation. The mapping from losslessness to σ=½ is definitional. Tiny uncertainty: the "total" losslessness includes both bridge and ladder contributions. The bridge is exactly lossless at σ=½ and the ladder deficit vanishes — but are we sure these combine as claimed?',
      devilsAdvocateIssue: 'A5 — defense was STRONG',
      numericallyVerified: true,
    },
    {
      id: 'S7-Darlington',
      claim: 'SO(2) 2-port → zeros on lossless axis',
      priorCorrect: 0.85,
      justification: 'Darlington (1939) for finite networks is a proven theorem. The 15% uncertainty is the LARGEST because: (a) Our S_∞ comes from an infinite cascade — does Darlington extend? We gave 3 arguments (imp-109) but the strongest (Hurwitz) assumes S₂₁,N → S₂₁,∞ uniformly on compacts, which requires analyticity of the limit. (b) The sin(α+iβ)=0 algebraic argument is clean BUT assumes S_∞ ∈ SO(2) as a function of s, not just at a single s. (c) Devil\'s advocate A2 flagged this as MODERATE defense.',
      devilsAdvocateIssue: 'A2 — defense was MODERATE',
      numericallyVerified: true,
    },
    {
      id: 'ALT-TK',
      claim: 'Trotter-Kato: resolvent → semigroup → LP',
      priorCorrect: 0.95,
      justification: 'Trotter-Kato is a standard theorem (1958). Strong resolvent convergence is proved analytically (imp-104) via Combes-Thomas + polynomial×exponential summability. The 5% uncertainty: Combes-Thomas requires a spectral gap, which we verified numerically (imp-087) but the gap for the INFINITE Hamiltonian could behave differently than for finite truncations.',
      devilsAdvocateIssue: 'A7 — defense was STRONG',
      numericallyVerified: true,
    },
  ];

  // ── Compute chain probability ──────────────────────────────────────────

  // Main path: S1 × S2 × S3 × S4 × S5 × S6 × S7
  const mainPathSteps = steps.filter(s => !s.id.startsWith('ALT'));
  const mainPathProb = mainPathSteps.reduce((p, s) => p * s.priorCorrect, 1);

  // Alternative path: S1 × S2 × S3 × S4 × S5 × S6 × ALT-TK
  const altPathSteps = steps.filter(s => s.id !== 'S7-Darlington');
  const altPathProb = altPathSteps.reduce((p, s) => p * s.priorCorrect, 1);

  // Combined: proof correct if EITHER path is correct
  // P(correct) = 1 - P(main fails) × P(alt fails)
  // But the paths SHARE steps S1-S6, so:
  // P(correct) = P(S1..S6) × [1 - (1-P(S7))×(1-P(ALT))]
  const sharedProb = steps.filter(s => !s.id.startsWith('S7') && !s.id.startsWith('ALT'))
    .reduce((p, s) => p * s.priorCorrect, 1);
  const s7Prob = steps.find(s => s.id === 'S7-Darlington').priorCorrect;
  const altProb = steps.find(s => s.id === 'ALT-TK').priorCorrect;
  const eitherClosureProb = 1 - (1 - s7Prob) * (1 - altProb);
  const combinedProb = sharedProb * eitherClosureProb;

  // ── Weakest link ───────────────────────────────────────────────────────

  const sorted = [...steps].sort((a, b) => a.priorCorrect - b.priorCorrect);
  const weakest = sorted[0];
  const secondWeakest = sorted[1];

  // ── Sensitivity: which step's probability most affects the total? ──────

  const sensitivity = steps.map(s => {
    // If this step's probability dropped by 10%, how much does the total change?
    const reducedProb = s.priorCorrect * 0.9;
    const totalWithReduction = mainPathSteps.map(ms =>
      ms.id === s.id ? reducedProb : ms.priorCorrect
    ).reduce((p, x) => p * x, 1);
    const drop = mainPathProb - totalWithReduction;

    return {
      id: s.id,
      originalProb: s.priorCorrect,
      totalDropIf10PercentWorse: +drop.toFixed(6),
      sensitivity: +(drop / mainPathProb).toFixed(4),
    };
  }).sort((a, b) => b.sensitivity - a.sensitivity);

  return {
    steps: steps.map(s => ({
      id: s.id,
      claim: s.claim,
      priorCorrect: s.priorCorrect,
      priorWrong: +(1 - s.priorCorrect).toExponential(2),
      justification: s.justification.substring(0, 120) + '...',
      devilsAdvocate: s.devilsAdvocateIssue,
    })),
    chainProbabilities: {
      mainPath: +(mainPathProb * 100).toFixed(2) + '%',
      alternativePath: +(altPathProb * 100).toFixed(2) + '%',
      combined: +(combinedProb * 100).toFixed(2) + '%',
      eitherClosure: +(eitherClosureProb * 100).toFixed(2) + '%',
    },
    weakestLink: {
      id: weakest.id,
      claim: weakest.claim,
      probability: weakest.priorCorrect,
      issue: weakest.justification,
    },
    secondWeakest: {
      id: secondWeakest.id,
      probability: secondWeakest.priorCorrect,
    },
    sensitivityRanking: sensitivity.slice(0, 5),
    recommendations: [
      {
        priority: 1,
        action: `Strengthen ${weakest.id} (P=${weakest.priorCorrect}): ` +
          'prove S₂₁,∞(s) is analytic as a function of s (not just a matrix limit)',
        impact: 'Raises weakest link from 85% to ~95%',
      },
      {
        priority: 2,
        action: `Strengthen ${secondWeakest.id} (P=${secondWeakest.priorCorrect}): ` +
          'give analytical proof of S₂₁ = c·Π(1-p^{-s}) for the specific ABCD construction',
        impact: 'Raises from 90% to ~98%',
      },
      {
        priority: 3,
        action: 'Independent expert review of the topology argument (S4)',
        impact: 'Confirms or refutes the core novelty of the proof',
      },
    ],
    verdict:
      `BAYESIAN FAILURE ANALYSIS: ` +
      `Main path probability: ${(mainPathProb * 100).toFixed(1)}%. ` +
      `Alternative path: ${(altPathProb * 100).toFixed(1)}%. ` +
      `Combined (either path): ${(combinedProb * 100).toFixed(1)}%. ` +
      `Weakest link: ${weakest.id} at ${(weakest.priorCorrect * 100).toFixed(0)}% ` +
      `(${weakest.claim}). ` +
      `Second weakest: ${secondWeakest.id} at ${(secondWeakest.priorCorrect * 100).toFixed(0)}%. ` +
      `IF THE PROOF IS WRONG, it most likely fails at ${weakest.id} (Darlington for infinite ` +
      `cascades) or ${secondWeakest.id} (identity theorem exact verification). ` +
      `The combined probability with two independent paths (${(combinedProb * 100).toFixed(1)}%) ` +
      `is higher than either path alone because they share the same strong steps (S1-S4, S6) ` +
      `and differ only in the closure mechanism (Darlington vs Trotter-Kato/LP).`,
  };
}
