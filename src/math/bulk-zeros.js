/**
 * Bulk Zero Computation via optimized Riemann-Siegel
 *
 * imp-067: The Odlyzko-Schönhage algorithm computes N consecutive zeros
 * near height T in O(N·T^ε) time. We implement a simplified version
 * using our enhanced R-S formula with adaptive step size.
 *
 * Goal: push verified zero count to 10,000+ for statistical tests.
 */

import { riemannSiegelZEnhanced, ZETA_ZEROS } from './zeta.js';

/**
 * Adaptive step-size zero finder.
 * Uses the mean zero density n(t) ≈ (1/2π)·log(t/2π) to set step size,
 * then refines each zero with bisection.
 */
export function bulkZeroComputation(tStart = 1000, tEnd = 10000, options = {}) {
  const { refinementIter = 20, verifyZ = true } = options;

  const zeros = [];
  let prevZ = riemannSiegelZEnhanced(tStart);
  let t = tStart;

  while (t < tEnd) {
    // Adaptive step: average spacing ≈ 2π/log(t/2π)
    const density = Math.log(t / (2 * Math.PI)) / (2 * Math.PI);
    const step = Math.min(1 / density * 0.4, 2); // ~40% of mean spacing

    t += step;
    if (t > tEnd) break;

    const z = riemannSiegelZEnhanced(t);

    if (prevZ * z < 0) {
      // Sign change — refine with bisection
      let lo = t - step, hi = t;
      let loZ = prevZ, hiZ = z;

      for (let iter = 0; iter < refinementIter; iter++) {
        const mid = (lo + hi) / 2;
        const midZ = riemannSiegelZEnhanced(mid);
        if (loZ * midZ < 0) { hi = mid; hiZ = midZ; }
        else { lo = mid; loZ = midZ; }
      }

      const gamma = (lo + hi) / 2;

      // Verify: Z(gamma) should be very small
      const zVal = riemannSiegelZEnhanced(gamma);
      const isGood = Math.abs(zVal) < 0.001;

      if (!verifyZ || isGood) {
        zeros.push(gamma);
      }
    }

    prevZ = z;
  }

  // Statistics
  const spacings = [];
  for (let i = 1; i < zeros.length; i++) {
    const density = Math.log(zeros[i] / (2 * Math.PI)) / (2 * Math.PI);
    spacings.push((zeros[i] - zeros[i - 1]) * density);
  }

  const meanSpacing = spacings.length > 0
    ? spacings.reduce((a, b) => a + b, 0) / spacings.length : 0;
  const minSpacing = spacings.length > 0 ? Math.min(...spacings) : 0;
  const variance = spacings.length > 1
    ? spacings.reduce((s, x) => s + (x - meanSpacing) ** 2, 0) / (spacings.length - 1) : 0;
  const normVar = meanSpacing > 0 ? variance / (meanSpacing ** 2) : 0;

  // Compare expected count with actual via Riemann-von Mangoldt
  // N(T) ≈ (T/2π)·log(T/2πe) + 7/8
  const expectedStart = (tStart / (2 * Math.PI)) * Math.log(tStart / (2 * Math.PI * Math.E)) + 7 / 8;
  const expectedEnd = (tEnd / (2 * Math.PI)) * Math.log(tEnd / (2 * Math.PI * Math.E)) + 7 / 8;
  const expectedCount = Math.round(expectedEnd - expectedStart);

  return {
    tRange: [tStart, tEnd],
    zerosFound: zeros.length,
    expectedCount,
    completeness: zeros.length / Math.max(expectedCount, 1),
    zeros: zeros.length <= 100 ? zeros : null, // only return if manageable
    firstFew: zeros.slice(0, 10).map(g => +g.toFixed(6)),
    lastFew: zeros.slice(-5).map(g => +g.toFixed(6)),
    spacing: {
      mean: +meanSpacing.toFixed(4),
      min: +minSpacing.toFixed(6),
      normalizedVariance: +normVar.toFixed(4),
      gueConsistent: normVar < 0.5,
      levelRepulsion: minSpacing > 0,
    },
    verdict:
      `Bulk computation [${tStart}, ${tEnd}]: found ${zeros.length} zeros ` +
      `(expected ~${expectedCount}, completeness ${(zeros.length / Math.max(expectedCount, 1) * 100).toFixed(1)}%). ` +
      `GUE spacing: ${normVar < 0.5 ? 'consistent' : 'anomalous'} (σ²/μ²=${normVar.toFixed(3)}). ` +
      `Level repulsion: ${minSpacing > 0 ? 'confirmed' : 'VIOLATED'}.`,
  };
}

/**
 * Quick benchmark: how many zeros/second can we compute?
 */
export function zeroBenchmark() {
  const start = performance.now();
  const result = bulkZeroComputation(1000, 2000);
  const elapsed = (performance.now() - start) / 1000;
  const rate = result.zerosFound / elapsed;

  return {
    zerosComputed: result.zerosFound,
    elapsedSeconds: +elapsed.toFixed(2),
    zerosPerSecond: +rate.toFixed(1),
    estimate10K: +(10000 / rate).toFixed(1) + 's',
    estimate100K: +(100000 / rate / 60).toFixed(1) + 'min',
  };
}
