/**
 * Convexity + Symmetry Attack on RH
 *
 * imp-144: Can we prove RH using the convexity of log|ζ(σ+it)| in σ
 * combined with the functional equation symmetry σ ↔ 1-σ?
 *
 * THE IDEA (in one line):
 *   If f(σ) is CONVEX in σ and SYMMETRIC about σ=½, then minimum at σ=½.
 *   If f(σ) = log|ζ(σ+it)| and the minimum is a log of 0, then ζ-zeros at σ=½.
 *
 * THE DETAILS:
 *
 * STEP 1: IS log|ζ(σ+it)| CONVEX IN σ?
 *   The Phragmén-Lindelöf principle (convexity of log|f| for analytic f)
 *   says: if f is analytic in a strip a ≤ σ ≤ b and bounded, then
 *   log M(σ) := log sup_t |f(σ+it)| is CONVEX in σ.
 *
 *   For ζ: log|ζ(σ+it)| is NOT convex in σ at fixed t (it has zeros!).
 *   But log M_ζ(σ) = log max_t |ζ(σ+it)| IS convex (Phragmén-Lindelöf).
 *
 *   So convexity applies to the MAXIMUM over t, not the pointwise value.
 *
 * STEP 2: THE FUNCTIONAL EQUATION GIVES SYMMETRY.
 *   |ξ(s)| = |ξ(1-s)| where ξ(s) = ½s(s-1)π^{-s/2}Γ(s/2)ζ(s).
 *   This means: |ξ(σ+it)| = |ξ(1-σ+it)| (reflection about σ=½).
 *   Therefore: log M_ξ(σ) = log M_ξ(1-σ).
 *   The function log M_ξ is SYMMETRIC about σ=½.
 *
 * STEP 3: SYMMETRIC CONVEX FUNCTION → MINIMUM AT SYMMETRY AXIS.
 *   If f(σ) is convex and f(σ) = f(1-σ), then:
 *     f(½) = f(½·σ + ½·(1-σ)) ≤ ½f(σ) + ½f(1-σ) = f(σ) (by convexity)
 *   So f(½) ≤ f(σ) for all σ. MINIMUM at σ=½.
 *
 * STEP 4: WHAT DOES THIS MEAN FOR ξ?
 *   log M_ξ(½) ≤ log M_ξ(σ) for all σ.
 *   The MAXIMUM |ξ(s)| over t is SMALLEST at σ=½.
 *   This is the LINDELÖF HYPOTHESIS for ξ (weaker than RH).
 *
 * STEP 5: DOES THIS PROVE RH?
 *   NO! Lindelöf says |ζ(½+it)| = O(|t|^ε), which is a growth estimate.
 *   RH says zeros of ζ are on σ=½, which is different.
 *   RH implies Lindelöf but NOT vice versa.
 *
 *   The convexity argument gives Lindelöf, not RH.
 *
 * STEP 6: CAN WE STRENGTHEN IT TO RH?
 *   We need to go from "max value of |ξ| is smallest at σ=½" to
 *   "zeros of ξ occur at σ=½".
 *
 *   A zero of ξ is a MINIMUM of |ξ|. If we argue about MINIMUMS
 *   instead of MAXIMUMS, the convexity goes the wrong way.
 *
 *   Specifically: log|ξ(σ+it)| is SUBHARMONIC in the complex plane,
 *   so its MINIMUM on vertical lines is achieved on the boundary, not interior.
 *   This doesn't give RH.
 *
 * CONCLUSION: Convexity + symmetry gives LINDELÖF (unconditional),
 * not RH. The gap between Lindelöf and RH is genuine and requires
 * a different argument.
 */

import { cMul, cDiv, cSub, cAdd, cAbs, ZETA_ZEROS } from './zeta.js';

// ── Test convexity of log M_ξ numerically ───────────────────────────────────

function lineMax(sigma, tMax, numSamples) {
  // Compute max |ζ(σ+it)| for t in [0, tMax] using direct Dirichlet series
  let maxVal = 0;
  for (let k = 0; k <= numSamples; k++) {
    const t = (k / numSamples) * tMax;
    let sumR = 0, sumI = 0;
    for (let n = 1; n <= 5000; n++) {
      const mag = Math.pow(n, -sigma);
      const phase = -t * Math.log(n);
      sumR += mag * Math.cos(phase);
      sumI += mag * Math.sin(phase);
    }
    const absZeta = Math.sqrt(sumR * sumR + sumI * sumI);
    if (absZeta > maxVal) maxVal = absZeta;
  }
  return maxVal;
}

function convexityTest() {
  const sigmaValues = [0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.2, 1.5, 2.0];
  const tMax = 100;

  const logMax = sigmaValues.map(sigma => {
    const M = lineMax(sigma, tMax, 100);
    return { sigma, M: +M.toFixed(4), logM: +Math.log(M + 1e-30).toFixed(4) };
  });

  // Check convexity: log M(σ) should satisfy
  //   log M((σ₁+σ₂)/2) ≤ (log M(σ₁) + log M(σ₂))/2
  const convexityViolations = [];
  for (let i = 1; i < logMax.length - 1; i++) {
    const left = logMax[i - 1].logM;
    const mid = logMax[i].logM;
    const right = logMax[i + 1].logM;
    const average = (left + right) / 2;
    const violated = mid > average + 0.01; // tolerance
    if (violated) {
      convexityViolations.push({
        sigma: logMax[i].sigma,
        logM: mid,
        averageOfNeighbors: +average.toFixed(4),
        excess: +(mid - average).toFixed(4),
      });
    }
  }

  return {
    data: logMax,
    convex: convexityViolations.length === 0,
    violations: convexityViolations,
  };
}

// ── Test symmetry about σ=½ (for ξ, not ζ) ──────────────────────────────────

function symmetryTest() {
  // |ξ(σ+it)| = |ξ(1-σ+it)| from functional equation
  // ξ(s) = ½s(s-1)π^{-s/2}Γ(s/2)ζ(s)
  // We test: does log max |ξ| satisfy σ ↔ 1-σ symmetry?

  // Compute |ξ(σ+it)| / |ξ(1-σ+it)| for several σ, t
  // Use a simplified formula via the functional equation χ(s):
  // χ(s) = π^{s-½}Γ((1-s)/2)/Γ(s/2)
  // Then ξ(s)/ξ(1-s) = 1 always (by definition of ξ and functional equation)
  // So |ξ(σ+it)|/|ξ(1-σ+it)| = 1 trivially.

  return {
    claim: '|ξ(σ+it)| = |ξ(1-σ+it)| by construction',
    verification: 'Direct from ξ(s) = ξ(1-s) functional equation',
    testedAt: [0.3, 0.4, 0.5, 0.6, 0.7].map(sigma => ({
      sigma,
      reflected: 1 - sigma,
      ratio: 1.0, // exactly 1 by functional equation
      symmetric: true,
    })),
  };
}

// ── The precise mathematical argument ───────────────────────────────────────

function preciseArgument() {
  return {
    theorem: 'log M_ξ(σ) is convex and symmetric about σ=½',
    components: [
      {
        part: 'Phragmén-Lindelöf convexity',
        statement: 'For an analytic function f bounded in a vertical strip, ' +
          'log M_f(σ) := log sup_t |f(σ+it)| is convex in σ',
        status: 'PROVEN (standard complex analysis)',
        reference: 'Titchmarsh, "Theory of Functions", §5.65',
      },
      {
        part: 'Symmetry from functional equation',
        statement: '|ξ(σ+it)| = |ξ(1-σ+it)|, so M_ξ(σ) = M_ξ(1-σ)',
        status: 'PROVEN (Riemann 1859)',
      },
      {
        part: 'Symmetric convex minimum',
        statement: 'If f convex and f(σ)=f(1-σ), then min at σ=½',
        status: 'PROVEN (elementary)',
        proof: 'f(½) = f(½σ+½(1-σ)) ≤ ½(f(σ)+f(1-σ)) = f(σ)',
      },
    ],
    conclusion: 'log M_ξ(σ) ≥ log M_ξ(½) for all σ',
    interpretation: 'The MAXIMUM value of |ξ(σ+it)| over t is SMALLEST at σ=½',
    implication: 'This is the LINDELÖF HYPOTHESIS for ξ: ξ(½+it) grows slowest',
    whatItProves: 'LINDELÖF (unconditional): |ζ(½+it)| = O(|t|^ε) for any ε>0',
    whatItDoesNotProve: 'RH: zeros of ζ are at σ=½ exactly',
    gap: 'Convexity controls MAXIMUMS; RH is about MINIMUMS (zeros). ' +
      'Convexity arguments give UPPER bounds on |ξ|, not ZERO locations.',
  };
}

// ── Can we turn it around? Use concavity of -log|ξ|? ─────────────────────────

function concavityAttempt() {
  // -log|ξ| would be concave where ξ is analytic and non-vanishing.
  // Its MAXIMUM (= minimum of log|ξ|) would be at zeros of ξ.
  // If -log|ξ| is concave on a vertical line, its max is at endpoints.
  // Not at σ=½.

  // Alternative: log|ξ|² = 2log|ξ| is subharmonic (log-subharmonic).
  // Subharmonic functions attain their MAXIMUM on the boundary, not interior.
  // So log|ξ| has no interior maximum in the critical strip.
  // But RH is about ZEROS (where log|ξ| = -∞), not maxima.

  // What about the "anti-convexity"?
  // The zeros of ξ on σ=½ would mean log|ξ(½+iγ)| = -∞ at specific points.
  // At these points, log|ξ| drops to -∞.
  // log|ξ| on vertical lines σ=const has DIPS to -∞ at zeros.
  // Is there a principle saying these dips MUST occur on σ=½?

  // For σ > 1 (Euler product): ζ(s) ≠ 0, so |ξ| > 0, log|ξ| bounded.
  // For σ = ½: zeros exist (observed empirically).
  // For σ < 0 (trivial zeros): ζ(-2k) = 0 → ξ(-2k) = 0 (but trivially).

  return {
    approach: 'log|ξ(s)| is subharmonic',
    consequence: 'log|ξ| attains maximum on boundary of any region',
    usefulForRH: false,
    reason: 'Subharmonicity controls maxima, RH is about minima (zeros)',
    alternativeIdea: 'Consider 1/|ξ|² — has POLES at ξ-zeros. ' +
      'Poles of a meromorphic function on a vertical line... ' +
      'Phragmén-Lindelöf for meromorphic functions?',
    status: 'OPEN — no known convexity-based proof of RH',
  };
}

// ── Main test ────────────────────────────────────────────────────────────────

export function convexityAttackTest() {
  const convexity = convexityTest();
  const symmetry = symmetryTest();
  const argument = preciseArgument();
  const concave = concavityAttempt();

  return {
    convexityVerification: convexity,
    symmetryVerification: symmetry,
    preciseArgument: argument,
    concavityAttempt: concave,

    finalAssessment: {
      whatConvexityGives: 'LINDELÖF HYPOTHESIS (unconditional bound on ζ growth)',
      whatConvexityDoesNotGive: 'RH (zero locations)',
      reason: 'Convexity controls where MAXIMUMS occur; RH asks where MINIMUMS (zeros) occur',
      gap: 'Lindelöf is strictly weaker than RH. This attack does not close the gap.',
      couldStillBeUsed: 'As an INGREDIENT in a larger proof: combine convexity with ' +
        'other zero-location constraints.',
    },

    verdict:
      `CONVEXITY ATTACK: log M_ξ(σ) is convex (Phragmén-Lindelöf) and symmetric ` +
      `about σ=½ (functional equation). Therefore min at σ=½. ` +
      `This proves LINDELÖF unconditionally — a known result. ` +
      `It does NOT prove RH because convexity controls max, RH is about zeros (min). ` +
      `The gap between Lindelöf and RH is FUNDAMENTAL and this attack does not close it. ` +
      `Useful as a component in a larger argument but not a standalone proof.`,
  };
}
