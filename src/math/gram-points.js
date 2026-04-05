/**
 * Gram Points, Gram's Law, and Rosser's Rule
 *
 * imp-173: Gram points g_n are defined by θ(g_n) = n·π where θ(t) is the
 * Riemann-Siegel theta function. The spacing between Gram points roughly
 * matches the spacing between ζ-zeros on the critical line.
 *
 * GRAM'S LAW (empirical, 1903):
 *   sgn Z(g_n) = (-1)^n       (where Z is the Hardy function)
 *
 * Equivalent form: each Gram interval (g_n, g_{n+1}) contains exactly one
 * ζ-zero γ, and that zero satisfies g_n < γ < g_{n+1}.
 *
 * GRAM EXCEPTION:
 *   A "bad" Gram point n is one where sgn Z(g_n) ≠ (-1)^n, OR where
 *   Gram's law fails (the interval contains 0 or 2 zeros).
 *
 * Historical: Gram exceptions are rare but infinite. First exception at
 * n = 126 (Hutchinson 1925).
 *
 * ROSSER'S RULE (1955):
 *   Block of consecutive Gram intervals has sum of Z-sign changes equal
 *   to the number of zeros in the block, giving CERTIFIED zero counting.
 *
 * Specifically: if Z(g_n) and Z(g_{n+k}) both satisfy Gram's law, and
 * all sign changes in between are accounted for, then there are exactly
 * k zeros in (g_n, g_{n+k}).
 *
 * THIS MODULE:
 *
 *   1. Compute Gram points g_n by inverting θ(t) = nπ (Newton iteration).
 *   2. Evaluate Z(g_n) using riemannSiegelZEnhanced.
 *   3. Check Gram's law: sgn Z(g_n) == (-1)^n?
 *   4. Count Gram exceptions in range.
 *   5. Verify zeros fall in predicted Gram intervals.
 */

import { riemannSiegelTheta, riemannSiegelZEnhanced, ZETA_ZEROS } from './zeta.js';

// ── Find Gram point g_n by Newton's method ──────────────────────────────────
//
// Solve θ(g_n) = nπ for g_n. The asymptotic leading term is:
//   g_n ≈ 2πn/W(n/e)  where W is Lambert W function.
// Or simpler: g_n ≈ 2π·(n+7/8)/log(n)  for large n.
// We use Newton iteration starting from a reasonable guess.

function gramPoint(n, tol = 1e-8, maxIter = 100) {
  if (n < 0) return null;
  // Initial guess: solve leading-order asymptotic θ(t) ≈ (t/2)log(t/(2π)) - t/2 - π/8 = nπ.
  // For small n, start at t = 2π.
  let t;
  if (n < 2) {
    t = 17.8;  // g_0 ≈ 17.846
  } else {
    // Solve (t/2) log(t/(2πe)) = nπ + π/8 iteratively.
    // Approx: t ≈ 2π(n+7/8)/W(...) — use simple bootstrap.
    t = 2 * Math.PI * (n + 0.875) / Math.log(n + 2);
    if (t < 10) t = 10;
  }

  // Newton iteration: F(t) = θ(t) - nπ, F'(t) = dθ/dt
  // dθ/dt = (1/2) log(t/(2π))   [leading order; exact via digamma]
  for (let i = 0; i < maxIter; i++) {
    const F = riemannSiegelTheta(t) - n * Math.PI;
    const Fprime = 0.5 * Math.log(t / (2 * Math.PI));
    const dt = -F / Fprime;
    t += dt;
    if (Math.abs(dt) < tol) return t;
  }
  return t;  // best effort
}

// ── Verify Gram's law at a single point ─────────────────────────────────────

function checkGramsLaw(n) {
  const g = gramPoint(n);
  if (g === null || g < 0.5) return null;
  const Z = riemannSiegelZEnhanced(g);
  const expectedSign = (n % 2 === 0) ? 1 : -1;
  const actualSign = Z > 0 ? 1 : (Z < 0 ? -1 : 0);
  return {
    n,
    g: +g.toFixed(4),
    Z: +Z.toFixed(6),
    expectedSign,
    actualSign,
    obeys: actualSign === expectedSign,
  };
}

// ── Scan range of Gram points ───────────────────────────────────────────────

function scanGramPoints(nMin, nMax) {
  const results = [];
  let numExceptions = 0;
  let numObeyed = 0;
  const exceptions = [];

  for (let n = nMin; n <= nMax; n++) {
    const r = checkGramsLaw(n);
    if (r === null) continue;
    results.push(r);
    if (r.obeys) numObeyed++;
    else {
      numExceptions++;
      exceptions.push(r);
    }
  }

  return { results, numObeyed, numExceptions, exceptions };
}

// ── Verify zeros fall in Gram intervals ─────────────────────────────────────
//
// For each known zero γ, find Gram interval (g_n, g_{n+1}) containing it.
// Count zeros per interval; usually 1, but exceptions have 0 or 2.

function verifyZerosInGramIntervals(zeros, nMax) {
  // Compute all Gram points up to nMax
  const grams = [];
  for (let n = 0; n <= nMax; n++) {
    const g = gramPoint(n);
    if (g !== null && g > 0) grams.push({ n, g });
  }

  // For each zero, find its Gram interval
  const intervalsWithZeros = {};
  for (const gamma of zeros) {
    let intervalIdx = -1;
    for (let i = 0; i < grams.length - 1; i++) {
      if (grams[i].g <= gamma && gamma < grams[i + 1].g) {
        intervalIdx = grams[i].n;
        break;
      }
    }
    if (intervalIdx >= 0) {
      intervalsWithZeros[intervalIdx] = (intervalsWithZeros[intervalIdx] || 0) + 1;
    }
  }

  // Count intervals with 0, 1, 2, 3+ zeros
  let empty = 0, one = 0, two = 0, threePlus = 0;
  const maxInterval = grams.length > 0 ? grams[grams.length - 1].n : 0;
  const lastZero = zeros[zeros.length - 1];

  // Only count intervals that end before last zero
  for (let n = 0; n < maxInterval; n++) {
    const gNext = grams.find(x => x.n === n + 1);
    if (!gNext || gNext.g > lastZero) break;
    const count = intervalsWithZeros[n] || 0;
    if (count === 0) empty++;
    else if (count === 1) one++;
    else if (count === 2) two++;
    else threePlus++;
  }

  return {
    totalIntervalsChecked: empty + one + two + threePlus,
    zeroCountDistribution: { empty, one, two, threePlus },
    percentGramsLawIntervals: +((one / (empty + one + two + threePlus)) * 100).toFixed(2),
  };
}

// ── Main test ────────────────────────────────────────────────────────────────

export function gramPointsTest() {
  // 1. Compute first Gram points and check Gram's law
  const firstScan = scanGramPoints(0, 50);
  const firstFewGramPoints = firstScan.results.slice(0, 10);

  // 2. Scan up to larger n to find first exception
  const largerScan = scanGramPoints(0, 200);

  // 3. Verify zeros-in-intervals for first 200 zeros
  const intervalVerification = verifyZerosInGramIntervals(ZETA_ZEROS.slice(0, 200), 200);

  // 4. Historical: first Gram exception at n=126 (Hutchinson 1925)
  const exceptionAt126 = checkGramsLaw(126);

  // 5. Spacing analysis: Gram intervals vs zero spacings
  const spacingAnalysis = (() => {
    const grams = [];
    for (let n = 0; n < 20; n++) {
      const g = gramPoint(n);
      if (g !== null) grams.push(g);
    }
    const gramSpacings = [];
    for (let i = 0; i < grams.length - 1; i++) {
      gramSpacings.push(grams[i + 1] - grams[i]);
    }
    const zeroSpacings = [];
    for (let i = 0; i < 19; i++) {
      zeroSpacings.push(ZETA_ZEROS[i + 1] - ZETA_ZEROS[i]);
    }
    return {
      gramSpacings: gramSpacings.slice(0, 5).map(s => +s.toFixed(4)),
      zeroSpacings: zeroSpacings.slice(0, 5).map(s => +s.toFixed(4)),
      ratio: +(gramSpacings.reduce((a, b) => a + b, 0) / zeroSpacings.reduce((a, b) => a + b, 0)).toFixed(4),
      note: 'Gram and zero spacings are asymptotically equal.',
    };
  })();

  return {
    concept: {
      definition: 'g_n := solution of θ(g_n) = nπ  (θ = Riemann-Siegel theta)',
      gramsLaw: 'sgn Z(g_n) = (-1)^n  (usually true, sometimes fails)',
      purpose: 'Gram points serve as "predicted zero boundaries"; deviations → Gram exceptions.',
      reference: 'Gram 1903, Hutchinson 1925, Rosser-Yohe-Schoenfeld 1969',
    },

    firstTenGramPoints: firstFewGramPoints,

    scanResults: {
      range: '[0, 200]',
      totalChecked: largerScan.numObeyed + largerScan.numExceptions,
      numObeyingGramsLaw: largerScan.numObeyed,
      numExceptions: largerScan.numExceptions,
      exceptionsFound: largerScan.exceptions.map(e => ({
        n: e.n,
        g: e.g,
        Z: e.Z,
        expectedSign: e.expectedSign,
        actualSign: e.actualSign,
      })),
    },

    historicalFirstException: exceptionAt126,

    zerosInGramIntervals: intervalVerification,

    spacingAnalysis,

    keyFindings: [
      `First 10 Gram points: ${firstFewGramPoints.map(g => g.g).join(', ')}`,
      `Gram's law checked at 201 points (n=0..200): ${largerScan.numObeyed} obey, ${largerScan.numExceptions} exceptions found.`,
      `Zeros-in-interval verification: ${intervalVerification.percentGramsLawIntervals}% of intervals contain exactly 1 zero.`,
      `Gram point spacing matches zero spacing; ratio = ${spacingAnalysis.ratio}.`,
      exceptionAt126 && !exceptionAt126.obeys
        ? `Historical first exception at n=126 VERIFIED: Z(${exceptionAt126.g}) = ${exceptionAt126.Z} has sign ${exceptionAt126.actualSign}, expected ${exceptionAt126.expectedSign}.`
        : `n=126 check: Z(g_126)=${exceptionAt126?.Z}; ${exceptionAt126?.obeys ? 'matches' : 'does not match'} Gram's law.`,
    ],

    relationToRH: {
      purpose:
        'Gram points provide EFFICIENT zero localization. Each zero should lie in exactly one Gram interval; ' +
        'Rosser\'s rule uses blocks to CERTIFY zero counts rigorously.',
      rhConnection:
        'Gram\'s law is a consequence of the critical-line density 1/(2π)·log(t/2π). ' +
        'If RH fails, the density would be perturbed and Gram exceptions would change pattern.',
      verificationChain:
        'Zero-counting via Gram/Rosser → Turing\'s method → certified RH on [0, T].',
    },

    nextStep:
      'Implement FULL Rosser\'s rule: detect Rosser blocks, certify zero count per block, ' +
      'combine into certified global N(T) verification. Use this to rigorously verify ' +
      'that our 870 zeros account for ALL zeros in the range (no missed zeros).',

    verdict:
      `GRAM POINTS COMPUTED and Gram's law checked at 201 points (n=0..200). ` +
      `${largerScan.numObeyed}/201 obey law (${(largerScan.numObeyed/201*100).toFixed(1)}%). ` +
      `${largerScan.numExceptions} exceptions found. ` +
      `Zeros-in-interval verification: ${intervalVerification.percentGramsLawIntervals}% of intervals contain exactly 1 zero (Gram's law consistency). ` +
      'Framework ready for Rosser-certified zero counting.',
  };
}
