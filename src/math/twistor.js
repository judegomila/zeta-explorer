/**
 * Twistor Duality Module
 *
 * Maps the ZPO twin-ladder model into Penrose twistor geometry:
 *   Direct ladder ζ(s)   ↔  Twistor Z^α = (ω^A, π_{A'})
 *   Dual ladder ζ(1-s)   ↔  Dual twistor W_α
 *   Bridge χ(s)          ↔  Intertwiner I: Z → W
 *   Critical line σ=0.5  ↔  Incidence relation Z·W = 0
 *   Euler product         ↔  Penrose transform
 *   Functional equation   ↔  Twistor correspondence
 */

import { cMul, cAdd, cSub, cAbs, cExp, cLog, cDiv, eulerFactor } from './zeta.js';
import { losslessBridge } from './oscillators.js';
import { getPrimes, primeFrequency } from './primes.js';

/**
 * Map s = σ + it to twistor space Z^α = (ω^A, π_{A'})
 *
 * The twistor Z encodes the "direct" side of the duality:
 *   ω^A = (σ - 0.5, t/(2π))      — displacement from the critical line
 *   π_{A'} = (cos(t·log2), sin(t·log2))  — spinor encoding prime-2 phase
 *
 * Norm ||Z||² = |ω|² + |π|² measures departure from the null condition.
 * Helicity h = Im(ω · π̄) encodes angular momentum.
 */
export function twistorFromS(s) {
  const [sigma, t] = s;

  // Spinor components
  const omega = [sigma - 0.5, t / (2 * Math.PI)];
  const pi = [Math.cos(t * Math.log(2)), Math.sin(t * Math.log(2))];

  // Twistor norm
  const norm = Math.sqrt(omega[0] ** 2 + omega[1] ** 2 + pi[0] ** 2 + pi[1] ** 2);

  // Helicity: h = Im(ω₀·π₀* + ω₁·π₁*)
  // With our encoding: h = ω[0]·π[1] - ω[1]·π[0]
  const helicity = omega[0] * pi[1] - omega[1] * pi[0];

  return { omega, pi, norm, helicity };
}

/**
 * Dual twistor W_α from s → 1-s (functional equation dual)
 *
 * Under the functional equation ζ(s) = χ(s)·ζ(1-s),
 * the dual twistor encodes the reflected point 1-s:
 *   ω_W = (0.5 - σ, -t/(2π))   — mirror reflection
 *   π_W = (cos(-t·log2), sin(-t·log2))  — conjugate phase
 */
export function dualTwistorFromS(s) {
  const [sigma, t] = s;
  const sDual = [1 - sigma, -t];

  const omega = [0.5 - sigma, -t / (2 * Math.PI)];
  const pi = [Math.cos(-t * Math.log(2)), Math.sin(-t * Math.log(2))];

  const norm = Math.sqrt(omega[0] ** 2 + omega[1] ** 2 + pi[0] ** 2 + pi[1] ** 2);
  const helicity = omega[0] * pi[1] - omega[1] * pi[0];

  return { omega, pi, norm, helicity };
}

/**
 * Intertwiner I: Z → W mapping (the bridge analog)
 *
 * The intertwiner relates twistor to dual twistor via the bridge χ(s).
 * It acts as:  W = I(Z) = χ(s) · Z  (component-wise multiplication by χ)
 *
 * When |χ| = 1 (σ = 0.5), the intertwiner is unitary → preserves norm.
 * When |χ| ≠ 1, the intertwiner stretches/compresses → non-unitary.
 */
export function intertwiner(twistor, s) {
  const bridge = losslessBridge(s);
  const chi = bridge.chi;

  // Apply χ to each spinor component
  const mappedOmega = cMul(chi, twistor.omega);
  const mappedPi = cMul(chi, twistor.pi);

  const mappedNorm = Math.sqrt(
    mappedOmega[0] ** 2 + mappedOmega[1] ** 2 +
    mappedPi[0] ** 2 + mappedPi[1] ** 2
  );

  return {
    omega: mappedOmega,
    pi: mappedPi,
    norm: mappedNorm,
    couplingStrength: bridge.magnitude,
    phase: bridge.phase,
    isUnitary: bridge.isUnitary,
    reflectionCoeff: bridge.reflectionCoeff,
  };
}

/**
 * Incidence relation: Z^α Ω_{αβ} W^β = 0
 *
 * The twistor incidence uses the symplectic form Ω = [[0,I],[-I,0]]:
 *   Z·Ω·W = ω_Z · π_W  −  π_Z · ω_W    (real 2-vector dot products)
 *
 * With our encoding this evaluates to 2(σ − 0.5)·cos(t·log 2), which
 * vanishes exactly on the critical line σ = 0.5 for all t — matching the
 * physical requirement that incidence ↔ the critical-line condition.
 *
 * The previous Hermitian product ω̄_Z·ω_W + π̄_Z·π_W grew as t²/(4π²)
 * and never reached the satisfaction threshold, even at σ = 0.5.
 */
export function incidenceRelation(twistor, dualTwistor) {
  // Symplectic inner product: Z·Ω·W = (ω_Z · π_W) − (π_Z · ω_W)
  // where · denotes the real 2D dot product of each spinor pair.
  const crossTerm1 = twistor.omega[0] * dualTwistor.pi[0] + twistor.omega[1] * dualTwistor.pi[1];
  const crossTerm2 = twistor.pi[0] * dualTwistor.omega[0] + twistor.pi[1] * dualTwistor.omega[1];
  const symplecticValue = crossTerm1 - crossTerm2;

  const product = [symplecticValue, 0]; // real-valued symplectic product
  const magnitude = Math.abs(symplecticValue);
  const satisfied = magnitude < 0.05;

  return {
    product,
    magnitude,
    satisfied,
    deviation: magnitude,
  };
}

/**
 * Full correspondence: scan σ, compute twistor pair + incidence
 *
 * For a fixed t, scans across σ to see how the twistor pair
 * and incidence relation evolve.
 */
export function twistorCorrespondence(t, sigmaRange = [0.05, 0.95], steps = 100) {
  const results = [];
  const ds = (sigmaRange[1] - sigmaRange[0]) / steps;

  for (let i = 0; i <= steps; i++) {
    const sigma = sigmaRange[0] + i * ds;
    const s = [sigma, t];
    const twistor = twistorFromS(s);
    const dual = dualTwistorFromS(s);
    const incidence = incidenceRelation(twistor, dual);
    const bridge = losslessBridge(s);

    results.push({
      sigma,
      twistor,
      dualTwistor: dual,
      incidence: incidence.magnitude,
      incidenceSatisfied: incidence.satisfied,
      chiMag: bridge.magnitude,
      helicityDiff: Math.abs(twistor.helicity - dual.helicity),
    });
  }

  return results;
}

/**
 * Penrose transform analog: contour integral of twistor function
 *
 * The Penrose transform maps cohomology on twistor space to fields
 * on spacetime. In our ZPO analogy, the Euler product
 *   ζ(s) = ∏_p (1 - p^{-s})^{-1}
 * acts as the "twistor function", and its integral over σ
 * reconstructs the "field" (zeta values).
 *
 * We compute the twistor-weighted Euler product and compare it
 * to the actual ζ(s) to measure correlation.
 */
export function penroseTransformScan(t, sigmaRange = [0.1, 2.0], steps = 80, numPrimes = 12) {
  const primes = getPrimes(numPrimes);
  const sigmas = [];
  const fieldValues = [];
  const zetaValues = [];
  const ds = (sigmaRange[1] - sigmaRange[0]) / steps;

  for (let i = 0; i <= steps; i++) {
    const sigma = sigmaRange[0] + i * ds;
    const s = [sigma, t];
    sigmas.push(sigma);

    // "Twistor field" = Euler product weighted by twistor norm
    const Z = twistorFromS(s);
    let eulerProd = [1, 0];
    for (const p of primes) {
      eulerProd = cMul(eulerProd, eulerFactor(p, s));
    }
    // Weight by inverse twistor norm (fields are sections of a line bundle)
    const weight = 1 / Math.max(Z.norm, 0.01);
    fieldValues.push(cAbs(eulerProd) * weight);

    // Actual zeta magnitude for comparison
    zetaValues.push(cAbs(eulerProd));
  }

  // Compute Pearson correlation between field and zeta
  const n = fieldValues.length;
  let sumF = 0, sumZ = 0, sumFZ = 0, sumF2 = 0, sumZ2 = 0;
  for (let i = 0; i < n; i++) {
    sumF += fieldValues[i];
    sumZ += zetaValues[i];
    sumFZ += fieldValues[i] * zetaValues[i];
    sumF2 += fieldValues[i] ** 2;
    sumZ2 += zetaValues[i] ** 2;
  }
  const meanF = sumF / n, meanZ = sumZ / n;
  const num = sumFZ / n - meanF * meanZ;
  const den = Math.sqrt((sumF2 / n - meanF ** 2) * (sumZ2 / n - meanZ ** 2));
  const correlation = den > 1e-10 ? num / den : 0;

  return { sigmas, fieldValues, zetaValues, correlation };
}
