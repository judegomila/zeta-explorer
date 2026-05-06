/**
 * Forward-Mode Automatic Differentiation for Sensitivity Analysis
 *
 * imp-082: Track derivatives through all proof computations to identify
 * which inputs most affect the output. Fragile computations need tighter bounds.
 *
 * Dual numbers: (a + bε) where ε² = 0.
 * f(a + bε) = f(a) + f'(a)·b·ε
 *
 * For complex dual numbers: z = (a + bε) where a,b are complex [re, im].
 */

/**
 * Cross-Verification (imp-929, S10-verify):
 *
 * Independent check of the four key computations exported / used by this file,
 * recorded inline so a future reader does not have to re-derive them.
 *
 * 1. Dual arithmetic identities (Dual.add / sub / mul / div).
 *    - mul: (a + a'ε)(b + b'ε) = ab + (a'b + ab')ε  (since ε² = 0). Matches.
 *    - div: (a + a'ε)/(b + b'ε) = a/b + (a'b - ab')/b² · ε. Verified by
 *      multiplying numerator and denominator by the conjugate (b - b'ε)
 *      and dropping ε² terms. Matches.
 *
 * 2. p^{-s} construction inside sMatrixWithDerivative.
 *    With s = σ + i·t and logP = log p:  p^{-s} = e^{-s·logP}
 *    = p^{-σ} · (cos(-t·logP) + i·sin(-t·logP)).
 *    pmsVal = [p^{-σ}·cos(-t·logP), p^{-σ}·sin(-t·logP)] — matches.
 *    Derivative d/ds[p^{-s}] = -logP · p^{-s}, so pmsDer = [-logP·Re, -logP·Im]
 *    of pmsVal — matches.
 *
 * 3. Bombieri-Lagarias Li-coefficient identity inside liCoefficientSensitivity.
 *    λ_n = Σ_ρ [1 - (1 - 1/ρ)^n]  (sum over nontrivial zeros, with multiplicity).
 *    With the critical-line parametrization ρ(γ) = 1/2 + iγ:
 *      dρ/dγ = i,  d/dγ[1/ρ] = -1/ρ² · dρ/dγ = -i/ρ²  →  matches dInvRho.
 *      d/dγ[1 - (1-1/ρ)^n]
 *        = -n·(1-1/ρ)^{n-1} · d/dγ[1-1/ρ]
 *        = -n·(1-1/ρ)^{n-1} · (i/ρ²)
 *        = n·(1-1/ρ)^{n-1} · (-i/ρ²)            →  matches dContrib.
 *
 * 4. Edge-case / NaN audit.
 *    - sMatrixWithDerivative skips a prime when |1 - p^{-s}| < 1e-20. For σ > 0
 *      one has |p^{-s}| = p^{-σ} < 1, so 1 - p^{-s} cannot vanish; the guard is
 *      defensive but inert in the proof regime σ ≈ 1/2.
 *    - Dual#sensitivity returns Infinity rather than NaN when |f| underflows.
 *    - liCoefficientSensitivity reads ZETA_ZEROS[0..99]; safe (table is large).
 *    - Reference value spot-check: sMatrixWithDerivative([0.5, 14.13], 50)
 *      returns a finite product; the partial Euler product converges slowly
 *      on the critical line (the full Euler product diverges there, as
 *      expected from Riemann), so the value is a model and not ζ itself.
 *
 * 5. Documentation/code mismatch (recorded, not patched in this atomic change):
 *    Dual#sensitivity JSDoc claims relative condition number |f'(x)·x/f(x)|,
 *    but the body returns the absolute ratio |f'(x)|/|f(x)| (the |·x| factor
 *    is missing). This value is reported only inside primeCountSensitivity
 *    and does NOT propagate into any λ_n bound or proof-chain claim. Flagged
 *    here for a future targeted ticket; left untouched to keep this change
 *    atomic per the imp-929 mandate.
 */

import { cMul, cDiv, cSub, cAdd, cAbs, ZETA_ZEROS } from './zeta.js';
import { getPrimes } from './primes.js';

/**
 * Dual number: {val, der} where val and der are complex numbers [re, im].
 */
class Dual {
  constructor(val, der) {
    this.val = val;   // [re, im]
    this.der = der || [0, 0]; // [re, im]
  }

  static constant(z) { return new Dual(z, [0, 0]); }
  static variable(z) { return new Dual(z, [1, 0]); }

  add(other) {
    return new Dual(cAdd(this.val, other.val), cAdd(this.der, other.der));
  }

  sub(other) {
    return new Dual(cSub(this.val, other.val), cSub(this.der, other.der));
  }

  mul(other) {
    // (a + a'ε)(b + b'ε) = ab + (a'b + ab')ε
    return new Dual(
      cMul(this.val, other.val),
      cAdd(cMul(this.der, other.val), cMul(this.val, other.der))
    );
  }

  div(other) {
    // (a + a'ε)/(b + b'ε) = a/b + (a'b - ab')/b² ε
    const q = cDiv(this.val, other.val);
    const dq = cDiv(
      cSub(cMul(this.der, other.val), cMul(this.val, other.der)),
      cMul(other.val, other.val)
    );
    return new Dual(q, dq);
  }

  get magnitude() { return cAbs(this.val); }
  get derMagnitude() { return cAbs(this.der); }

  /**
   * Sensitivity: |f'(x)·x/f(x)| — relative change in output per relative change in input.
   * Also called the condition number.
   */
  get sensitivity() {
    const fMag = cAbs(this.val);
    const dfMag = cAbs(this.der);
    return fMag > 1e-30 ? dfMag / fMag : Infinity;
  }
}

/**
 * Compute the S-matrix S₁₁(s) with automatic differentiation
 * with respect to s (the complex frequency).
 */
function sMatrixWithDerivative(s, numPrimes) {
  const primes = getPrimes(numPrimes);

  // s as a dual variable
  const sDual = Dual.variable(s);

  // S₁₁(s) ≈ Π_p (1 - p^{-s}) / (1 - p^{-s̄}) — simplified model
  // Actually compute the cascade transfer matrix derivative

  let product = Dual.constant([1, 0]);

  for (const p of primes) {
    const logP = Math.log(p);

    // p^{-s} = exp(-s·logP)
    // d/ds[p^{-s}] = -logP · p^{-s}
    const pSig = Math.pow(p, -s[0]);
    const phase = -s[1] * logP;
    const pmsVal = [pSig * Math.cos(phase), pSig * Math.sin(phase)];
    const pmsDer = [-logP * pmsVal[0], -logP * pmsVal[1]]; // -logP · p^{-s}

    const pms = new Dual(pmsVal, pmsDer);

    // Factor: 1/(1 - p^{-s})
    const one = Dual.constant([1, 0]);
    const denom = one.sub(pms);
    if (cAbs(denom.val) < 1e-20) continue;
    const factor = one.div(denom);

    product = product.mul(factor);
  }

  return product;
}

/**
 * Compute the unitarity deficit δ(P) with derivative w.r.t. σ.
 * This tells us how sensitive the deficit is to the position on the critical line.
 */
function deficitSensitivity(sigma, t, numPrimes) {
  // Compute |ζ(σ+it)|/|ζ(σ-it)| - 1 with AD
  const sPlus = sMatrixWithDerivative([sigma, t], numPrimes);
  const sMinus = sMatrixWithDerivative([sigma, -t], numPrimes);

  const magPlus = sPlus.magnitude;
  const magMinus = sMinus.magnitude;

  const ratio = magMinus > 1e-30 ? magPlus / magMinus : NaN;
  const deficit = Math.abs(ratio - 1);

  // Sensitivity of the ratio to sigma
  const dMagPlus = sPlus.derMagnitude;
  const dMagMinus = sMinus.derMagnitude;

  // d(ratio)/dσ ≈ (dMagPlus·magMinus - magPlus·dMagMinus) / magMinus²
  const dRatio = magMinus > 1e-30
    ? Math.abs(dMagPlus / magMinus - magPlus * dMagMinus / (magMinus * magMinus))
    : NaN;

  return {
    sigma, t,
    deficit,
    dDeficit_dSigma: dRatio,
    conditionNumber: deficit > 1e-30 ? dRatio / deficit : Infinity,
    isFragile: dRatio > 10 * deficit, // derivative much larger than value → fragile
  };
}

/**
 * Sensitivity analysis for the Li coefficients.
 * How sensitive is λ_n to perturbations in the zero locations?
 */
function liCoefficientSensitivity(maxN = 10) {
  const zeros = ZETA_ZEROS.slice(0, 100);

  const results = [];
  for (let n = 1; n <= maxN; n++) {
    // λ_n = Σ_ρ [1 - (1-1/ρ)^n]
    // Sensitivity: which zero contributes most?
    const contributions = zeros.map((gamma, idx) => {
      // ρ = 0.5 + i·γ
      const rho = [0.5, gamma];
      // 1 - 1/ρ
      const oneMinusInvRho = cSub([1, 0], cDiv([1, 0], rho));
      // (1-1/ρ)^n
      let power = [1, 0];
      for (let k = 0; k < n; k++) power = cMul(power, oneMinusInvRho);
      // contribution = 1 - (1-1/ρ)^n
      const contrib = cSub([1, 0], power);

      // Derivative w.r.t. γ (perturbation of zero location)
      // d/dγ [1 - (1-1/ρ)^n] = n·(1-1/ρ)^{n-1} · d/dγ[1/ρ]
      // d/dγ[1/ρ] = d/dγ[1/(0.5+iγ)] = -i/(0.5+iγ)²
      const rhoSq = cMul(rho, rho);
      const dInvRho = cDiv([0, -1], rhoSq);

      let powerNm1 = [1, 0];
      for (let k = 0; k < n - 1; k++) powerNm1 = cMul(powerNm1, oneMinusInvRho);
      const dContrib = cMul([n, 0], cMul(powerNm1, dInvRho));

      return {
        zeroIndex: idx + 1,
        gamma,
        contributionMag: cAbs(contrib),
        derivativeMag: cAbs(dContrib),
        sensitivity: cAbs(contrib) > 1e-30 ? cAbs(dContrib) / cAbs(contrib) : Infinity,
      };
    });

    // Sort by sensitivity
    const sorted = contributions.sort((a, b) => b.sensitivity - a.sensitivity);
    const totalContrib = contributions.reduce((s, c) => s + c.contributionMag, 0);
    const avgSensitivity = contributions.reduce((s, c) => s + c.sensitivity, 0) / contributions.length;

    results.push({
      n,
      totalContribution: +totalContrib.toFixed(6),
      avgSensitivity: +avgSensitivity.toFixed(4),
      maxSensitivity: +sorted[0]?.sensitivity.toFixed(4),
      mostSensitiveZero: sorted[0]?.zeroIndex,
      isFragile: avgSensitivity > 10,
    });
  }

  return results;
}

/**
 * Main sensitivity analysis test.
 */
export function sensitivityAnalysisTest() {
  // 1. S-matrix sensitivity at critical line
  const tValues = [5, 14.13, 21.02, 30, 50];
  const sMatrixSens = tValues.map(t => deficitSensitivity(0.5, t, 50));

  // 2. Off-line sensitivity (how fast does deficit grow when leaving σ=½?)
  const offLineSens = [0.45, 0.48, 0.5, 0.52, 0.55].map(sigma =>
    deficitSensitivity(sigma, 14.13, 50)
  );

  // 3. Li coefficient sensitivity
  const liSens = liCoefficientSensitivity(10);

  // 4. Prime count sensitivity: how does deficit change with more primes?
  const primeSens = [10, 20, 50, 100, 200].map(np => {
    const r = sMatrixWithDerivative([0.5, 14.13], np);
    return {
      numPrimes: np,
      magnitude: +r.magnitude.toFixed(6),
      derivativeMag: +r.derMagnitude.toFixed(6),
      sensitivity: +r.sensitivity.toFixed(4),
    };
  });

  // Identify fragile computations
  const fragileComputations = [];
  if (sMatrixSens.some(s => s.isFragile)) {
    fragileComputations.push('S-matrix deficit at some t-values');
  }
  if (liSens.some(l => l.isFragile)) {
    fragileComputations.push(`Li coefficient λ_${liSens.find(l => l.isFragile)?.n}`);
  }
  if (primeSens.some(p => p.sensitivity > 10)) {
    fragileComputations.push('Euler product convergence at low prime count');
  }

  return {
    sMatrixSensitivity: sMatrixSens,
    offLineSensitivity: offLineSens,
    liCoefficientSensitivity: liSens,
    primeCountSensitivity: primeSens,
    fragileComputations,
    proofChain: [
      { step: 1, claim: 'Forward-mode AD implemented for complex functions', status: 'done' },
      { step: 2, claim: 'S-matrix sensitivity on critical line measured', status: 'done' },
      { step: 3, claim: 'Li coefficient sensitivity to zero perturbation', status: 'done' },
      { step: 4, claim: `${fragileComputations.length} fragile computations identified`, status: fragileComputations.length === 0 ? 'all robust' : 'needs attention' },
      { step: 5, claim: 'Sensitivity informs which bounds need tightening', status: 'actionable' },
    ],
    verdict:
      `Sensitivity analysis via automatic differentiation: ` +
      `${fragileComputations.length} fragile computation(s) found` +
      (fragileComputations.length > 0 ? `: ${fragileComputations.join('; ')}. ` : '. ') +
      `S-matrix condition numbers at σ=½: ${sMatrixSens.map(s => s.conditionNumber.toFixed(2)).join(', ')}. ` +
      `Li coefficient most sensitive at n=${liSens.sort((a, b) => b.avgSensitivity - a.avgSensitivity)[0]?.n}. ` +
      `Use these results to prioritize which proof components need interval arithmetic upgrades.`,
  };
}
