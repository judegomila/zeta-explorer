/**
 * imp-086: Adversarial S7 closure-path tests using the Davenport-Heilbronn function.
 *
 * The D-H function satisfies a functional equation but has zeros OFF the critical
 * line, so it violates RH. Any S7 closure path that claims to prove RH must
 * correctly FAIL when applied to D-H. Paths that pass are "generic" (not RH-specific)
 * and cannot be part of a valid proof.
 *
 * f(s) = [(1 - iκ)·L(s,χ₁) + (1 + iκ)·L(s,χ̄₁)] / 2
 * where χ₁ is a Dirichlet character mod 5 and
 *   κ = (√(10 - 2√5) - 2) / (√5 - 1)
 */

import { cMul, cDiv, cSub, cAdd, cAbs, cExp, cLog, cPow } from './zeta.js';
import { getPrimes } from './primes.js';

// ---------------------------------------------------------------------------
// Dirichlet character χ₁ mod 5:  χ(1)=1, χ(2)=i, χ(3)=-i, χ(4)=-1, χ(0)=0
// ---------------------------------------------------------------------------
const CHI_TABLE = [
  [0, 0],   // χ(0)
  [1, 0],   // χ(1)
  [0, 1],   // χ(2) = i
  [0, -1],  // χ(3) = -i
  [-1, 0],  // χ(4) = -1
];

function chi(n) {
  const r = ((n % 5) + 5) % 5;
  return CHI_TABLE[r];
}

/** Conjugate character χ̄₁: complex conjugate of χ₁ values */
function chiBar(n) {
  const c = chi(n);
  return [c[0], -c[1]];
}

// ---------------------------------------------------------------------------
// κ constant
// ---------------------------------------------------------------------------
const KAPPA = (Math.sqrt(10 - 2 * Math.sqrt(5)) - 2) / (Math.sqrt(5) - 1);

// Precomputed complex coefficients for D-H
// α = (1 - iκ) / 2,  β = (1 + iκ) / 2
const ALPHA = [0.5, -KAPPA / 2];
const BETA  = [0.5,  KAPPA / 2];

// ---------------------------------------------------------------------------
// Dirichlet L-function L(s, χ) via partial sum (works for all s with enough terms)
// ---------------------------------------------------------------------------
function dirichletL(s, charFn, N = 2000) {
  let re = 0, im = 0;
  const sigma = s[0], t = s[1];
  for (let n = 1; n <= N; n++) {
    const cv = charFn(n);
    if (cv[0] === 0 && cv[1] === 0) continue; // χ(n)=0 when 5|n
    const logN = Math.log(n);
    const mag = Math.exp(-sigma * logN);   // n^{-σ}
    const phase = -t * logN;               // -t·log(n)
    // n^{-s} = mag · e^{i·phase}
    const nRe = mag * Math.cos(phase);
    const nIm = mag * Math.sin(phase);
    // χ(n) · n^{-s}
    re += cv[0] * nRe - cv[1] * nIm;
    im += cv[0] * nIm + cv[1] * nRe;
  }
  return [re, im];
}

/** L(s, χ₁) via Euler product — only valid for Re(s) > 1 */
function dirichletLEuler(s, charFn, numPrimes = 100) {
  const primes = getPrimes(numPrimes);
  let result = [1, 0];
  for (const p of primes) {
    const cv = charFn(p);
    if (cv[0] === 0 && cv[1] === 0) continue;
    const logP = Math.log(p);
    const mag = Math.exp(-s[0] * logP);
    const phase = -s[1] * logP;
    // χ(p)·p^{-s}
    const term = cMul(cv, [mag * Math.cos(phase), mag * Math.sin(phase)]);
    // (1 - χ(p)·p^{-s})^{-1}
    const factor = cDiv([1, 0], cSub([1, 0], term));
    result = cMul(result, factor);
  }
  return result;
}

// ---------------------------------------------------------------------------
// Davenport-Heilbronn function f(s)
// ---------------------------------------------------------------------------
function dhFunction(s, { method = 'auto', N = 2000, numPrimes = 100 } = {}) {
  const useEuler = method === 'euler' || (method === 'auto' && s[0] > 1.1);
  let L1, L1bar;
  if (useEuler) {
    L1    = dirichletLEuler(s, chi, numPrimes);
    L1bar = dirichletLEuler(s, chiBar, numPrimes);
  } else {
    L1    = dirichletL(s, chi, N);
    L1bar = dirichletL(s, chiBar, N);
  }
  // f(s) = α·L(s,χ₁) + β·L(s,χ̄₁)
  return cAdd(cMul(ALPHA, L1), cMul(BETA, L1bar));
}

// ---------------------------------------------------------------------------
// Euler factor for D-H: the local factor at prime p
// For ζ(s), the Euler factor is (1 - p^{-s})^{-1}.
// For D-H, the Euler factor combines two characters:
//   F_p(s) = α·(1 - χ(p)p^{-s})^{-1} + β·(1 - χ̄(p)p^{-s})^{-1}
// (This is NOT multiplicative — that's the key structural difference.)
// ---------------------------------------------------------------------------
function dhEulerFactor(p, s) {
  const logP = Math.log(p);
  const mag = Math.exp(-s[0] * logP);
  const phase = -s[1] * logP;
  const ps = [mag * Math.cos(phase), mag * Math.sin(phase)]; // p^{-s}

  const cv = chi(p);
  const cvBar = chiBar(p);

  const f1 = cDiv([1, 0], cSub([1, 0], cMul(cv, ps)));
  const f2 = cDiv([1, 0], cSub([1, 0], cMul(cvBar, ps)));

  return cAdd(cMul(ALPHA, f1), cMul(BETA, f2));
}

// ---------------------------------------------------------------------------
// Zeta Euler factor for comparison: (1 - p^{-s})^{-1}
// ---------------------------------------------------------------------------
function zetaEulerFactor(p, s) {
  const logP = Math.log(p);
  const mag = Math.exp(-s[0] * logP);
  const phase = -s[1] * logP;
  const ps = [mag * Math.cos(phase), mag * Math.sin(phase)];
  return cDiv([1, 0], cSub([1, 0], ps));
}

// ---------------------------------------------------------------------------
// 2×2 transfer matrix from an Euler factor
// Models the scattering/transfer at each prime as a matrix:
//   T_p = [[F_p, F_p - 1], [1, 1]]
// normalized so det ≈ 1 for SL(2,R) comparison.
// ---------------------------------------------------------------------------
function transferMatrix(factor) {
  const a = factor[0], b = factor[1];
  // T = [[a+bi, (a-1)+bi], [1, 1]]
  return {
    m00: [a, b],
    m01: [a - 1, b],
    m10: [1, 0],
    m11: [1, 0],
  };
}

function matMul2x2(A, B) {
  return {
    m00: cAdd(cMul(A.m00, B.m00), cMul(A.m01, B.m10)),
    m01: cAdd(cMul(A.m00, B.m01), cMul(A.m01, B.m11)),
    m10: cAdd(cMul(A.m10, B.m00), cMul(A.m11, B.m10)),
    m11: cAdd(cMul(A.m10, B.m01), cMul(A.m11, B.m11)),
  };
}

function matDet(M) {
  return cSub(cMul(M.m00, M.m11), cMul(M.m01, M.m10));
}

function matFrobeniusNorm(M) {
  return Math.sqrt(
    cAbs(M.m00) ** 2 + cAbs(M.m01) ** 2 +
    cAbs(M.m10) ** 2 + cAbs(M.m11) ** 2
  );
}

// =========================================================================
// S7 CLOSURE PATH DISCRIMINATION TESTS
// =========================================================================

/**
 * Path A — Weyl law test.
 * For ζ(s) the eigenvalue counting function N(T) ~ (T/2π)log(T/2πe) + 7/8.
 * We approximate by counting sign changes of Re(f(0.5+it)) for t in [0,T].
 * D-H has a different zero distribution; the density ratio should deviate from 1.
 */
function testWeylLaw() {
  const T = 50;
  const dt = 0.05;
  let zetaSignChanges = 0;
  let dhSignChanges = 0;
  let prevZetaSign = 0;
  let prevDhSign = 0;

  for (let t = 1; t <= T; t += dt) {
    const s = [0.5, t];

    // Approximate ζ on critical line via Dirichlet sum
    const zVal = dirichletL(s, (n) => [1, 0], 1000); // ζ = L(s, trivial char)
    const dhVal = dhFunction(s, { N: 1000 });

    const zSign = Math.sign(zVal[0]);
    const dhSign = Math.sign(dhVal[0]);

    if (prevZetaSign !== 0 && zSign !== 0 && zSign !== prevZetaSign) zetaSignChanges++;
    if (prevDhSign !== 0 && dhSign !== 0 && dhSign !== prevDhSign) dhSignChanges++;

    if (zSign !== 0) prevZetaSign = zSign;
    if (dhSign !== 0) prevDhSign = dhSign;
  }

  // Weyl law predicts N(T) ~ (T/(2π))·ln(T/(2πe))
  const weylExpected = (T / (2 * Math.PI)) * Math.log(T / (2 * Math.PI * Math.E));
  const zetaRatio = zetaSignChanges / Math.max(weylExpected, 1);
  const dhRatio = dhSignChanges / Math.max(weylExpected, 1);

  // D-H should deviate more from the Weyl prediction than ζ
  const deviation = Math.abs(zetaRatio - dhRatio);
  const discriminates = deviation > 0.05;

  return {
    name: 'Weyl law (eigenvalue density)',
    discriminates,
    zetaSignChanges,
    dhSignChanges,
    weylExpected: Math.round(weylExpected),
    zetaRatio: +zetaRatio.toFixed(4),
    dhRatio: +dhRatio.toFixed(4),
    deviation: +deviation.toFixed(4),
    detail: discriminates
      ? `D-H zero density deviates from Weyl prediction (Δ=${deviation.toFixed(3)})`
      : 'WARN: Could not distinguish D-H from ζ via Weyl counting',
  };
}

/**
 * Path B — Trace class test.
 * Build partial products S_N from Euler factors and check ||S_{N+1} - S_N|| decay.
 * For ζ(s), convergence is controlled by RH. For D-H, the non-multiplicative
 * structure should produce different convergence behavior.
 */
function testTraceClass() {
  const primes = getPrimes(60);
  const s = [0.5, 14.134725]; // first zeta zero height

  // Accumulate partial products and measure successive differences
  let zetaProd = { m00: [1, 0], m01: [0, 0], m10: [0, 0], m11: [1, 0] };
  let dhProd   = { m00: [1, 0], m01: [0, 0], m10: [0, 0], m11: [1, 0] };

  const zetaDiffs = [];
  const dhDiffs = [];

  for (let i = 0; i < primes.length; i++) {
    const p = primes[i];

    const zetaF = transferMatrix(zetaEulerFactor(p, s));
    const dhF   = transferMatrix(dhEulerFactor(p, s));

    const zetaNext = matMul2x2(zetaProd, zetaF);
    const dhNext   = matMul2x2(dhProd, dhF);

    if (i > 0) {
      // ||S_{N+1} - S_N|| via Frobenius norm of the difference
      const zetaDiff = {
        m00: cSub(zetaNext.m00, zetaProd.m00),
        m01: cSub(zetaNext.m01, zetaProd.m01),
        m10: cSub(zetaNext.m10, zetaProd.m10),
        m11: cSub(zetaNext.m11, zetaProd.m11),
      };
      const dhDiff = {
        m00: cSub(dhNext.m00, dhProd.m00),
        m01: cSub(dhNext.m01, dhProd.m01),
        m10: cSub(dhNext.m10, dhProd.m10),
        m11: cSub(dhNext.m11, dhProd.m11),
      };
      zetaDiffs.push(matFrobeniusNorm(zetaDiff));
      dhDiffs.push(matFrobeniusNorm(dhDiff));
    }

    zetaProd = zetaNext;
    dhProd = dhNext;
  }

  // Compare decay rates: fit log(diff) ~ -γ·log(index)
  function fitDecayRate(diffs) {
    if (diffs.length < 5) return 0;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0, n = 0;
    for (let i = 0; i < diffs.length; i++) {
      if (diffs[i] <= 0) continue;
      const x = Math.log(i + 2); // log(prime index)
      const y = Math.log(diffs[i]);
      sumX += x; sumY += y; sumXY += x * y; sumXX += x * x; n++;
    }
    if (n < 3) return 0;
    return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  }

  const zetaDecay = fitDecayRate(zetaDiffs);
  const dhDecay = fitDecayRate(dhDiffs);
  const decayDiff = Math.abs(zetaDecay - dhDecay);

  // Different decay rates indicate different spectral structures
  const discriminates = decayDiff > 0.1;

  return {
    name: 'Trace class (convergence rate)',
    discriminates,
    zetaDecayExponent: +zetaDecay.toFixed(4),
    dhDecayExponent: +dhDecay.toFixed(4),
    decayDifference: +decayDiff.toFixed(4),
    detail: discriminates
      ? `Decay rates differ: ζ=${zetaDecay.toFixed(3)} vs D-H=${dhDecay.toFixed(3)}`
      : 'WARN: Decay rates too similar — path may be generic',
  };
}

/**
 * Path C — Szegő / SL(2,R) test.
 * Check if the cumulative transfer matrix product lies in SL(2,R).
 * For ζ(s) on the critical line, the Euler product has real log-phases and
 * the transfer matrices should be real with det=1.
 * For D-H, the complex character values break SL(2,R) membership.
 */
function testSzego() {
  const primes = getPrimes(40);
  const s = [0.5, 20.0];

  let zetaProd = { m00: [1, 0], m01: [0, 0], m10: [0, 0], m11: [1, 0] };
  let dhProd   = { m00: [1, 0], m01: [0, 0], m10: [0, 0], m11: [1, 0] };

  for (const p of primes) {
    zetaProd = matMul2x2(zetaProd, transferMatrix(zetaEulerFactor(p, s)));
    dhProd   = matMul2x2(dhProd, transferMatrix(dhEulerFactor(p, s)));
  }

  // SL(2,R) check: (1) entries should be real, (2) det should be 1
  function sl2rScore(M) {
    const det = matDet(M);
    const detDeviation = cAbs(cSub(det, [1, 0]));

    // Imaginary content of entries
    const imagContent = (
      Math.abs(M.m00[1]) + Math.abs(M.m01[1]) +
      Math.abs(M.m10[1]) + Math.abs(M.m11[1])
    ) / (matFrobeniusNorm(M) + 1e-15);

    return { detDeviation, imagContent };
  }

  const zetaScore = sl2rScore(zetaProd);
  const dhScore   = sl2rScore(dhProd);

  // D-H should have much higher imaginary content due to complex character values
  const imagRatio = (dhScore.imagContent + 1e-10) / (zetaScore.imagContent + 1e-10);
  const detRatio  = (dhScore.detDeviation + 1e-10) / (zetaScore.detDeviation + 1e-10);

  const discriminates = imagRatio > 1.5 || detRatio > 2.0;

  return {
    name: 'Szegő / SL(2,R) membership',
    discriminates,
    zetaImagContent: +zetaScore.imagContent.toFixed(6),
    dhImagContent: +dhScore.imagContent.toFixed(6),
    imagRatio: +imagRatio.toFixed(4),
    zetaDetDev: +zetaScore.detDeviation.toFixed(6),
    dhDetDev: +dhScore.detDeviation.toFixed(6),
    detRatio: +detRatio.toFixed(4),
    detail: discriminates
      ? `D-H transfer matrix departs SL(2,R) (imag ratio=${imagRatio.toFixed(2)}, det ratio=${detRatio.toFixed(2)})`
      : 'WARN: SL(2,R) test cannot distinguish D-H from ζ — path may be generic',
  };
}

/**
 * Path D — de Branges / Hermite-Biehler test.
 * A function E(z) is Hermite-Biehler if |E(z)| > |E(z̄)| for Im(z) > 0.
 * Equivalently, the "HB ratio" |f(σ+it)|/|f(σ-it)| should be > 1 for σ > 0.5.
 * For ζ(s) this holds (by RH). For D-H it should fail at some points
 * because D-H has zeros off the critical line.
 */
function testDeBranges() {
  // Sample at several points in the upper half of the critical strip
  const testPoints = [
    [0.6, 10], [0.7, 15], [0.55, 20], [0.8, 25], [0.65, 30],
    [0.75, 12], [0.6, 18], [0.55, 22], [0.7, 28], [0.9, 5],
  ];

  let zetaViolations = 0;
  let dhViolations = 0;
  const dhRatios = [];
  const zetaRatios = [];

  for (const [sigma, t] of testPoints) {
    const sUp   = [sigma, t];
    const sDown = [sigma, -t];

    // ζ approximation via trivial character L-function
    const zUp   = dirichletL(sUp, (n) => [1, 0], 1500);
    const zDown = dirichletL(sDown, (n) => [1, 0], 1500);
    const zRatio = cAbs(zUp) / (cAbs(zDown) + 1e-30);

    const dhUp   = dhFunction(sUp, { N: 1500 });
    const dhDown = dhFunction(sDown, { N: 1500 });
    const dhRatio = cAbs(dhUp) / (cAbs(dhDown) + 1e-30);

    zetaRatios.push(zRatio);
    dhRatios.push(dhRatio);

    // HB violation: ratio < 1 means |E(z̄)| > |E(z)| — zeros off line
    if (zRatio < 0.95) zetaViolations++;
    if (dhRatio < 0.95) dhViolations++;
  }

  // D-H should have more HB violations or larger deviations from 1
  const zetaAvgDev = zetaRatios.reduce((a, r) => a + Math.abs(r - 1), 0) / zetaRatios.length;
  const dhAvgDev   = dhRatios.reduce((a, r) => a + Math.abs(r - 1), 0) / dhRatios.length;

  const discriminates = dhViolations > zetaViolations || dhAvgDev > zetaAvgDev * 1.5;

  return {
    name: 'de Branges (Hermite-Biehler)',
    discriminates,
    zetaViolations,
    dhViolations,
    zetaAvgDeviation: +zetaAvgDev.toFixed(6),
    dhAvgDeviation: +dhAvgDev.toFixed(6),
    detail: discriminates
      ? `D-H fails HB condition (${dhViolations} violations vs ζ's ${zetaViolations})`
      : 'WARN: HB test cannot distinguish D-H from ζ — path may be generic',
  };
}

/**
 * Path E — Marchenko (inverse scattering) test.
 * Recover a "potential" from the Euler factor data via discrete inverse scattering.
 * For ζ(s), the potential should be real and summable (L¹).
 * For D-H, the complex character mixing should produce a non-real or non-summable potential.
 */
function testMarchenko() {
  const primes = getPrimes(50);
  const t = 14.134725;

  // Build reflection coefficients from Euler factors at σ = 0.5
  function reflectionCoeffs(factorFn) {
    return primes.map(p => {
      const s = [0.5, t];
      const f = factorFn(p, s);
      // Reflection coefficient: r_p = (F_p - 1) / (F_p + 1)
      return cDiv(cSub(f, [1, 0]), cAdd(f, [1, 0]));
    });
  }

  const zetaRefl = reflectionCoeffs(zetaEulerFactor);
  const dhRefl   = reflectionCoeffs(dhEulerFactor);

  // "Potential" via discrete Marchenko: q_n ≈ -2·d/dn(r_n)
  // approximated as finite differences of reflection coefficients
  function potential(refl) {
    const q = [];
    for (let i = 1; i < refl.length; i++) {
      const diff = cSub(refl[i], refl[i - 1]);
      q.push([-2 * diff[0], -2 * diff[1]]);
    }
    return q;
  }

  const zetaPot = potential(zetaRefl);
  const dhPot   = potential(dhRefl);

  // Check realness: sum of |Im(q_n)| / sum of |q_n|
  function imagFraction(pot) {
    let imagSum = 0, totalSum = 0;
    for (const q of pot) {
      imagSum  += Math.abs(q[1]);
      totalSum += cAbs(q);
    }
    return totalSum > 0 ? imagSum / totalSum : 0;
  }

  // Check L¹ summability: sum of |q_n|
  function l1Norm(pot) {
    return pot.reduce((a, q) => a + cAbs(q), 0);
  }

  const zetaImagFrac = imagFraction(zetaPot);
  const dhImagFrac   = imagFraction(dhPot);
  const zetaL1       = l1Norm(zetaPot);
  const dhL1         = l1Norm(dhPot);

  // D-H potential should be less real and/or have different L¹ behavior
  const imagRatio = (dhImagFrac + 1e-10) / (zetaImagFrac + 1e-10);
  const l1Ratio   = dhL1 / (zetaL1 + 1e-10);

  const discriminates = imagRatio > 1.3 || Math.abs(l1Ratio - 1) > 0.2;

  return {
    name: 'Marchenko (inverse scattering potential)',
    discriminates,
    zetaImagFraction: +zetaImagFrac.toFixed(6),
    dhImagFraction: +dhImagFrac.toFixed(6),
    imagRatio: +imagRatio.toFixed(4),
    zetaL1: +zetaL1.toFixed(4),
    dhL1: +dhL1.toFixed(4),
    l1Ratio: +l1Ratio.toFixed(4),
    detail: discriminates
      ? `D-H potential deviates (imag ratio=${imagRatio.toFixed(2)}, L¹ ratio=${l1Ratio.toFixed(2)})`
      : 'WARN: Marchenko test cannot distinguish D-H from ζ — path may be generic',
  };
}

// ---------------------------------------------------------------------------
// Unitarity deficit: |f(σ+it)| / |f(σ-it)| at σ=0.5
// For ζ(s), the functional equation gives |ζ(½+it)| = |ζ(½-it)| → ratio ≈ 1
// For D-H, this ratio should deviate due to off-line zeros
// ---------------------------------------------------------------------------
function testUnitarityDeficit() {
  const testTs = [10, 14.134725, 20, 25, 30, 35, 40];
  const ratios = [];

  for (const t of testTs) {
    const fUp   = dhFunction([0.5, t], { N: 2000 });
    const fDown = dhFunction([0.5, -t], { N: 2000 });
    const ratio = cAbs(fUp) / (cAbs(fDown) + 1e-30);
    ratios.push(ratio);
  }

  const avgDeviation = ratios.reduce((a, r) => a + Math.abs(r - 1), 0) / ratios.length;
  const maxDeviation = Math.max(...ratios.map(r => Math.abs(r - 1)));

  return {
    name: 'Unitarity deficit (|f(½+it)|/|f(½-it)|)',
    avgDeviation: +avgDeviation.toFixed(6),
    maxDeviation: +maxDeviation.toFixed(6),
    ratios: ratios.map(r => +r.toFixed(6)),
    detail: maxDeviation > 0.01
      ? `D-H unitarity deficit detected (max dev=${maxDeviation.toFixed(4)})`
      : 'D-H appears unitary on critical line at sampled points',
  };
}

// =========================================================================
// Main adversarial test runner
// =========================================================================

/**
 * Run all 5 S7 closure-path discrimination tests against the Davenport-Heilbronn
 * function. Returns a structured report.
 *
 * Any path that correctly FAILS for D-H is RH-specific.
 * Any path that incorrectly PASSES is generic and not a valid proof path.
 */
export function adversarialS7Test() {
  const results = [];
  const pathTests = [
    testWeylLaw,
    testTraceClass,
    testSzego,
    testDeBranges,
    testMarchenko,
  ];

  for (const test of pathTests) {
    try {
      results.push(test());
    } catch (e) {
      results.push({
        name: test.name.replace('test', ''),
        discriminates: false,
        error: e.message,
        detail: `ERROR: ${e.message}`,
      });
    }
  }

  // Run unitarity deficit as supplementary
  let unitarity;
  try {
    unitarity = testUnitarityDeficit();
  } catch (e) {
    unitarity = { error: e.message, avgDeviation: 0, maxDeviation: 0, ratios: [] };
  }

  const passed = results.filter(r => !r.discriminates);
  const failed = results.filter(r => r.discriminates);

  const score = failed.length / results.length;

  return {
    summary: {
      totalPaths: results.length,
      rhSpecific: failed.length,
      generic: passed.length,
      discriminationScore: +score.toFixed(2),
      verdict: score >= 0.6
        ? `${failed.length}/5 paths correctly discriminate D-H from ζ — closure framework has substance`
        : score >= 0.4
          ? `${failed.length}/5 paths discriminate — partial validation, some paths may be generic`
          : `Only ${failed.length}/5 paths discriminate — most paths are generic, framework needs strengthening`,
    },
    pathResults: results.map(r => ({
      path: r.name,
      rhSpecific: r.discriminates,
      status: r.discriminates ? 'CORRECTLY FAILS for D-H' : 'INCORRECTLY PASSES — generic',
      detail: r.detail,
      ...(r.error ? { error: r.error } : {}),
    })),
    unitarityDeficit: unitarity,
    metadata: {
      dhKappa: +KAPPA.toFixed(8),
      dhAlpha: ALPHA,
      dhBeta: BETA,
      description: 'Davenport-Heilbronn adversarial test: f(s) satisfies functional equation but has off-line zeros',
    },
  };
}
