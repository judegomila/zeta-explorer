/**
 * ζ(2s)/ζ(s) and the Möbius Function: RH Equivalence
 *
 * imp-153: Our ZPO formula S₂₁ = ζ(2s)/ζ(s) (imp-121) connects directly
 * to the Möbius function and gives a Mertens-form equivalence for RH.
 *
 * THE DIRICHLET SERIES IDENTITY:
 *
 *   1/ζ(s) = Σ_{n=1}^∞ μ(n)/n^s   (standard)
 *   ζ(2s)/ζ(s) = ζ(2s) · (1/ζ(s)) = Σ_{n=1}^∞ a(n)/n^s
 *
 *   where a(n) = Σ_{d²|n} μ(n/d²) (Dirichlet convolution).
 *
 *   Equivalently: ζ(2s)/ζ(s) = Π_p (1-p^{-s})/(1-p^{-2s}) = Π_p 1/(1+p^{-s}).
 *
 *   And: 1/(1+p^{-s}) = Σ_{k=0}^∞ (-1)^k p^{-ks}, so
 *   ζ(2s)/ζ(s) = Σ_{n=1}^∞ λ(n)/n^s
 *   where λ(n) is the LIOUVILLE FUNCTION: λ(n) = (-1)^{Ω(n)} with
 *   Ω(n) = total number of prime factors (with multiplicity).
 *
 *   So: S₂₁(s) = ζ(2s)/ζ(s) = L(s) := Σ_{n=1}^∞ λ(n)/n^s
 *
 *   where λ is the Liouville function.
 *
 * THE LIOUVILLE FUNCTION FORM OF RH:
 *
 *   Define L(x) := Σ_{n≤x} λ(n) (partial sum of Liouville).
 *
 *   RH ⟺ L(x) = O(x^{½+ε}) for every ε > 0.
 *
 *   This is one of the classical equivalences of RH.
 *
 * CONNECTION TO ZPO:
 *
 *   Our cascade S₂₁(s) = ζ(2s)/ζ(s) IS the Dirichlet series of the
 *   Liouville function.
 *
 *   Cascade poles at ζ(s) = 0 ⟺ divergence of Σ λ(n)/n^ρ at zeros ρ.
 *   Cascade analyticity for σ > 1 ⟺ absolute convergence of Σ λ(n)/n^s.
 *
 * PHYSICAL INTERPRETATION:
 *
 *   The Liouville function λ(n) = +1 if n has EVEN # prime factors,
 *                                 = -1 if ODD # prime factors.
 *
 *   Think of n as a "state" with some number of prime-factor-quanta:
 *     λ(n) = (-1)^{#quanta} = PARITY of the state.
 *
 *   L(x) = (excess of even-parity states over odd-parity) up to x.
 *
 *   RH (Liouville form): this parity excess is O(√x) — maximally BALANCED.
 *
 *   In physics: this is a STATISTICAL MECHANICS statement about a gas
 *   of particles labeled by integers n with charge λ(n) = (-1)^{Ω(n)}.
 *   RH = "the gas has zero net charge density at infinity (up to fluctuations)."
 *
 * THE LIOUVILLE SERIES AS PARITY GENERATING FUNCTION:
 *
 *   S₂₁(s) = L(s) = Σ λ(n)/n^s is the GRAND CANONICAL partition function
 *   of a gas of integer-labeled particles with parity charge.
 *
 *   Zeros of ζ(s) are where this parity partition function diverges —
 *   the CRITICAL POINTS of parity balance.
 *
 *   RH = "all critical parity points are at σ=½" = "parity is balanced
 *   uniformly across scales."
 */

import { getPrimes } from './primes.js';

// ── Liouville function ───────────────────────────────────────────────────────

/**
 * λ(n) = (-1)^{Ω(n)} where Ω(n) = total prime factors with multiplicity.
 */
function liouville(n) {
  if (n === 1) return 1;
  let count = 0;
  let m = n;
  // Factor out primes
  for (let p = 2; p * p <= m; p++) {
    while (m % p === 0) {
      count++;
      m /= p;
    }
  }
  if (m > 1) count++;
  return count % 2 === 0 ? 1 : -1;
}

// ── Liouville partial sum L(x) ───────────────────────────────────────────────

function liouvilleSum(x) {
  let sum = 0;
  for (let n = 1; n <= x; n++) sum += liouville(n);
  return sum;
}

// ── Verify: L(s) = ζ(2s)/ζ(s) numerically ──────────────────────────────────

function verifyLiouvilleIdentity(sigma, t, maxTerms) {
  // Direct sum Σ λ(n)/n^s
  let sumR = 0, sumI = 0;
  for (let n = 1; n <= maxTerms; n++) {
    const lam = liouville(n);
    const mag = lam * Math.pow(n, -sigma);
    const phase = -t * Math.log(n);
    sumR += mag * Math.cos(phase);
    sumI += mag * Math.sin(phase);
  }

  // ζ(2s)/ζ(s) via Euler products
  const primes = getPrimes(200);
  let zR = 1, zI = 0, z2R = 1, z2I = 0;
  for (const p of primes) {
    // ζ(s) = 1/(1-p^{-s})
    const mag1 = Math.pow(p, -sigma);
    const rR = 1 - mag1 * Math.cos(t * Math.log(p));
    const rI = mag1 * Math.sin(t * Math.log(p));
    const rMag2 = rR * rR + rI * rI;
    if (rMag2 < 1e-30) continue;
    const invR = rR / rMag2, invI = -rI / rMag2;
    const nzR = zR * invR - zI * invI;
    const nzI = zR * invI + zI * invR;
    zR = nzR; zI = nzI;
    // ζ(2s)
    const mag2 = Math.pow(p, -2 * sigma);
    const rR2 = 1 - mag2 * Math.cos(2 * t * Math.log(p));
    const rI2 = mag2 * Math.sin(2 * t * Math.log(p));
    const r2Mag2 = rR2 * rR2 + rI2 * rI2;
    if (r2Mag2 < 1e-30) continue;
    const inv2R = rR2 / r2Mag2, inv2I = -rI2 / r2Mag2;
    const nz2R = z2R * inv2R - z2I * inv2I;
    const nz2I = z2R * inv2I + z2I * inv2R;
    z2R = nz2R; z2I = nz2I;
  }
  // ζ(2s)/ζ(s)
  const zMag2 = zR * zR + zI * zI;
  const ratioR = (z2R * zR + z2I * zI) / zMag2;
  const ratioI = (z2I * zR - z2R * zI) / zMag2;

  const diff = Math.sqrt((sumR - ratioR) ** 2 + (sumI - ratioI) ** 2);
  const eulerMag = Math.sqrt(ratioR * ratioR + ratioI * ratioI);
  const sumMag = Math.sqrt(sumR * sumR + sumI * sumI);

  return {
    sigma, t,
    directSum: { re: +sumR.toFixed(6), im: +sumI.toFixed(6), mag: +sumMag.toFixed(6) },
    eulerRatio: { re: +ratioR.toFixed(6), im: +ratioI.toFixed(6), mag: +eulerMag.toFixed(6) },
    relativeDiff: eulerMag > 1e-20 ? +(diff / eulerMag).toFixed(6) : 'N/A',
    match: eulerMag > 1e-20 && diff / eulerMag < 0.05,
  };
}

// ── L(x) growth analysis ─────────────────────────────────────────────────────

/**
 * Compute L(x) for various x and compare with √x (RH prediction).
 */
function liouvilleGrowthAnalysis() {
  const xValues = [10, 100, 1000, 10000, 100000];

  return xValues.map(x => {
    const Lx = liouvilleSum(x);
    const sqrtX = Math.sqrt(x);
    const ratio = Lx / sqrtX;
    return {
      x,
      Lx,
      sqrtX: +sqrtX.toFixed(2),
      ratio: +ratio.toFixed(4),
      consistentWithRH: Math.abs(ratio) < 3, // allow factor of ~3
      note: `|L(${x})| = ${Math.abs(Lx)} vs √x = ${sqrtX.toFixed(0)}`,
    };
  });
}

// ── Main test ────────────────────────────────────────────────────────────────

export function mobiusRHConnectionTest() {
  // Verify identity at test points
  const verifications = [
    { sigma: 2, t: 0 },
    { sigma: 2, t: 5 },
    { sigma: 1.5, t: 14.13 },
    { sigma: 3, t: 10 },
  ].map(p => verifyLiouvilleIdentity(p.sigma, p.t, 2000));

  const allMatch = verifications.every(v => v.match);

  // L(x) growth
  const growth = liouvilleGrowthAnalysis();
  const rhConsistent = growth.every(g => g.consistentWithRH);

  return {
    identity: {
      formula: 'ζ(2s)/ζ(s) = Σ λ(n)/n^s (Liouville function)',
      proof: 'From Euler product: Π 1/(1+p^{-s}) = Π Σ(-p^{-s})^k = Σ (-1)^{Ω(n)}/n^s',
      verifications,
      allMatch,
    },

    rhEquivalentForm: {
      statement: 'RH ⟺ L(x) = Σ_{n≤x} λ(n) = O(x^{½+ε})',
      reference: 'Classical result (Landau 1899)',
      physicalMeaning: 'Prime-factor PARITY is balanced at order √x',
    },

    liouvilleGrowth: {
      data: growth,
      rhConsistent,
      note: '|L(x)|/√x stays O(1) → consistent with RH (empirical)',
    },

    zpoInterpretation: {
      cascadeS21: 'S₂₁(s) = ζ(2s)/ζ(s) = Liouville Dirichlet series L(s)',
      polesOfS21: 'At ζ-zeros ρ: L(ρ) = ζ(2ρ)/0 = ∞',
      physicalMeaning: 'Cascade poles = points of parity divergence',
      rh: 'RH = all parity divergences at σ=½',
    },

    statisticalMechanics: {
      gas: 'Integers n as particles with charge λ(n) = (-1)^{Ω(n)}',
      partitionFunction: 'Z(β) = Σ λ(n)/n^β (alternating partition function)',
      grandCanonical: 'Includes fugacity = Im(s)',
      rh: 'Z(β+it) diverges exactly at β=½ = critical balanced-charge temperature',
    },

    openDirection:
      'Since S₂₁ = Liouville Dirichlet series, the scattering setup needed (imp-151) ' +
      'is one that encodes PARITY of prime factorizations. Candidates: ' +
      '(a) Z/2-graded modular surface (parity twist), ' +
      '(b) Quantum graph with sign = (-1)^{# edges traversed}, ' +
      '(c) Fermionic version of the integer gas on T^∞.',

    verdict:
      'KEY IDENTIFICATION: S₂₁(s) = ζ(2s)/ζ(s) = L(s) = Σ λ(n)/n^s (LIOUVILLE Dirichlet series). ' +
      `Numerical verification: ${allMatch ? 'all 4 test points match' : 'partial match'}. ` +
      'RH ⟺ L(x) = O(x^{½+ε}) = parity of prime factorizations balanced at √x scale. ' +
      `Liouville growth empirically consistent with RH: ${rhConsistent ? 'YES' : 'partial'}. ` +
      'PHYSICAL MEANING: ZPO cascade captures PARITY structure of integers. ' +
      'Cascade poles = points where parity divergence occurs. ' +
      'Next step: find the scattering setup that naturally encodes prime-factor parity.',
  };
}
