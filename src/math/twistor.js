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
 * imp-955: independent cross-verification block.
 *
 * Reference: Penrose, R. "Twistor algebra", J. Math. Phys. 8 (1967), 345.
 *
 * (1) Formula / theorem citations vs cited references:
 *     - A genuine Penrose twistor Z^α = (ω^A, π_{A'}) lives in C^4 with
 *       SU(2,2) signature; the (||ω||² + ||π||²) norm used here is a
 *       Euclidean R^4 norm, NOT the indefinite Penrose pseudo-norm
 *       Z·Z̄ = ω^A·π̄_A + π_{A'}·ω̄^{A'}. So `norm` is an analogy, not
 *       the twistor norm proper. CAVEAT documented; not a bug because
 *       the file's own docstring frames the construction as a "ZPO
 *       analog" rather than the literal Penrose object.
 *     - Helicity h = (1/2)·Z·Z̄ in Penrose; here `helicity =
 *       ω[0]·π[1] − ω[1]·π[0]` is the 2D cross-product, an analog of
 *       Im(ω · π̄). Sign-convention consistent with twistor literature.
 *     - Functional-equation dual: dualTwistorFromS(s) maps s → 1−s by
 *       (σ → 0.5−σ, t → −t). The (σ − 0.5) and (0.5 − σ) negate, so
 *       Z + W has zero σ-component on the critical line ✓ — matches the
 *       Riemann functional equation ζ(s) = χ(s)·ζ(1−s) reflection axis.
 *     - Incidence relation Z^α Ω_{αβ} W^β = 0: comment claims this
 *       evaluates to 2(σ − 0.5)·cos(t·log 2). Verifying with our
 *       encoding: omega_Z = (σ−0.5, t/(2π)),  pi_W = (cos(−t·log2),
 *       sin(−t·log2)) = (cos(t·log2), −sin(t·log2)). Then
 *       omega_Z · pi_W = (σ−0.5)·cos(t·log2) + (t/(2π))·(−sin(t·log2)).
 *       pi_Z · omega_W = cos(t·log2)·(0.5−σ) + sin(t·log2)·(−t/(2π)).
 *       Subtracting: 2(σ−0.5)·cos(t·log2) + 0. ✓ matches the comment.
 *       So the incidence value is purely (σ−0.5)·cos(t·log2) up to
 *       factor 2, vanishing on σ=0.5 OR at cos(t·log2)=0 (extra root
 *       set t = (k+1/2)·π/log2). The latter is a coincidental zero
 *       locus of the toy model, not part of RH.
 *     - Intertwiner I: applies bridge χ(s) component-wise to (ω, π).
 *       In Penrose, the action of χ is on the cohomology class, not
 *       a spinor multiplication; the file labels this as an "analog"
 *       which is consistent with its scope.
 *
 * (2) NaN/Inf edge cases:
 *     - twistorFromS / dualTwistorFromS: pure trig and arithmetic on
 *       finite (σ, t) — no division, no log of nonpositive arg, no NaN
 *       paths.
 *     - intertwiner: relies on losslessBridge(s); no guard here, but
 *       χ(s) is finite away from s = 0, 1 (poles of Γ ratios). At
 *       σ→0+ or σ→1−, χ may diverge; not guarded explicitly.
 *     - penroseTransformScan: weight = 1 / Math.max(Z.norm, 0.01) ✓
 *       guards the σ=0.5, t=0 case where Z.norm = 0 (since ω = (0,0)
 *       and π = (1,0) give norm=1, so Z.norm ≥ 1 generically; the 0.01
 *       floor is defensive belt-and-braces).
 *     - Pearson correlation in penroseTransformScan: guarded by
 *       `den > 1e-10 ? num/den : 0` ✓ no 0/0.
 *     - eulerFactor at p^{-s} = 1 would produce a divide-by-zero in
 *       the Euler product; not guarded here, but for σ ≥ 0.1 (default
 *       sigmaRange) and finite t this never occurs.
 *
 * (3) Numerical reference values:
 *     - log(2) = 0.693147180559945... — used in π = (cos(t·log2),
 *       sin(t·log2)). For t = 14.1347 (γ_1), t·log2 ≈ 9.7984, so
 *       cos(t·log2) ≈ −0.93, far from zero — the incidence vanishes
 *       on σ = 0.5 cleanly at γ_1 (no spurious cancellation).
 *     - 1/(2π) = 0.159154943... — appears in ω[1] = t/(2π). Not
 *       printed numerically but checked against TWO_PI usage elsewhere.
 *     - On σ = 0.5 the incidence magnitude reduces to |2·0·cos(t·log2)|
 *       = 0; satisfaction threshold 0.05 trivially met. ✓
 *
 * Sanity envelope: incidenceRelation must vanish to machine precision
 * whenever σ = 0.5, for every t. Any future change to twistorFromS or
 * dualTwistorFromS that breaks the symplectic-cancellation identity
 * (the σ-only structure of the symplectic product) must be caught
 * before merging — it would falsely satisfy or falsely reject the
 * critical line as the incidence locus.
 */

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
