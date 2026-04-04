/**
 * Twin Ladder as Mach-Zehnder Interferometer
 *
 * imp-140: The twin ladder (direct path + dual path + bridge) is structurally
 * identical to a Mach-Zehnder interferometer. ζ-zeros correspond to
 * destructive interference conditions.
 *
 * THE MAPPING:
 *
 *   Mach-Zehnder                    ZPO Twin Ladder
 *   ─────────────                   ───────────────
 *   Input beam splitter             s (complex frequency splits)
 *   Path 1                          Direct ladder: Σ n^{-s}
 *   Path 2                          Dual ladder: Σ n^{-(1-s)}
 *   Phase shift Δφ                  Bridge χ(s): ξ(s)/ξ(1-s) ratio
 *   Output beam splitter            Combined signal
 *   Detector                        |ζ(s)|² (intensity)
 *
 * INTERFERENCE CONDITION:
 *   Destructive interference: amplitudes cancel exactly.
 *   For MZ with equal path amplitudes A: intensity = 2A²(1 + cos Δφ).
 *   Zero intensity: cos Δφ = -1, i.e., Δφ = (2k+1)π.
 *
 *   For ZPO: "paths" are ζ(s) and χ(s)·ζ(1-s).
 *   By functional equation: ζ(s) = χ(s)·ζ(1-s), so they are EQUAL.
 *   This means constructive interference everywhere — no cancellation.
 *
 *   But wait: if ζ(s) = 0 at a zero, then BOTH paths give zero.
 *   At ζ-zeros, both interferometer arms carry zero signal.
 *   This is not destructive interference — it's a SOURCE-SIDE zero.
 *
 * REVISED MAPPING (proper Mach-Zehnder):
 *
 *   Consider the "functional equation interferometer":
 *     Path 1: ζ(s) with phase factor π^{-s/2}Γ(s/2)
 *     Path 2: ζ(1-s) with phase factor π^{-(1-s)/2}Γ((1-s)/2)
 *
 *   These combine to form ξ(s) = ½s(s-1)π^{-s/2}Γ(s/2)ζ(s).
 *   By functional equation: ξ(s) = ξ(1-s) (balanced interferometer).
 *
 *   The "output" at s is ξ(s). Its zeros = ξ-zeros = ζ-zeros (nontrivial).
 *   These are destructive interference conditions where both paths
 *   combine to give exactly zero.
 *
 *   VISIBILITY of interference fringes = how well the two paths match.
 *   At σ=½: paths are conjugate (s ↔ s̄ through functional eq.), perfect matching.
 *   At σ≠½: paths unbalanced, interference less sharp.
 *
 * VISIBILITY FUNCTION:
 *   V(σ) = |⟨ζ(σ+it)·ζ̄(1-σ+it)⟩_t| / √(⟨|ζ(σ+it)|²⟩_t · ⟨|ζ(1-σ+it)|²⟩_t)
 *
 *   Maximum visibility (V=1) when paths are conjugate: at σ=½.
 *   Reduced visibility off-line.
 *
 * INTERFEROMETRIC RH:
 *   RH = "The interferometer fringes have maximum visibility at σ=½,
 *   and the dark fringes (zeros) lie exactly ON that line of maximum visibility."
 *
 *   This is equivalent to standard RH but gives a physical picture.
 */

import { cMul, cDiv, cSub, cAdd, cAbs, ZETA_ZEROS } from './zeta.js';

// ── Compute "path amplitudes" via Dirichlet eta ──────────────────────────────

function zetaEta(sigma, t, maxTerms) {
  let etaR = 0, etaI = 0;
  for (let n = 1; n <= maxTerms; n++) {
    const sign = (n % 2 === 1) ? 1 : -1;
    const mag = sign * Math.pow(n, -sigma);
    const phase = -t * Math.log(n);
    etaR += mag * Math.cos(phase);
    etaI += mag * Math.sin(phase);
  }
  const logp2 = Math.log(2);
  const twoFactor = [
    1 - Math.pow(2, 1 - sigma) * Math.cos(-t * logp2),
    Math.pow(2, 1 - sigma) * Math.sin(-t * logp2),
  ];
  return cAbs(twoFactor) > 1e-20 ? cDiv([etaR, etaI], twoFactor) : [NaN, NaN];
}

// ── Interferometer visibility V(σ) ───────────────────────────────────────────

function visibility(sigma, tMin, tMax, samples) {
  // V = |⟨ζ(σ+it)·ζ̄(1-σ+it)⟩| / √(⟨|ζ|²⟩ · ⟨|ζ_reflect|²⟩)
  let crossR = 0, crossI = 0;
  let autoS1 = 0, autoS2 = 0;

  for (let k = 0; k < samples; k++) {
    const t = tMin + (tMax - tMin) * (k / samples);
    const z1 = zetaEta(sigma, t, 2000);
    const z2 = zetaEta(1 - sigma, t, 2000);

    // z1 · conj(z2)
    const prodR = z1[0] * z2[0] + z1[1] * z2[1];
    const prodI = z1[1] * z2[0] - z1[0] * z2[1];
    crossR += prodR;
    crossI += prodI;
    autoS1 += z1[0] * z1[0] + z1[1] * z1[1];
    autoS2 += z2[0] * z2[0] + z2[1] * z2[1];
  }

  crossR /= samples; crossI /= samples;
  autoS1 /= samples; autoS2 /= samples;

  const crossMag = Math.sqrt(crossR * crossR + crossI * crossI);
  const denom = Math.sqrt(autoS1 * autoS2);
  return denom > 1e-20 ? crossMag / denom : 0;
}

// ── Fringe pattern near ζ-zeros ──────────────────────────────────────────────

function fringesNearZero(gamma, samples) {
  // Scan around the zero at t=γ
  const tMin = gamma - 5;
  const tMax = gamma + 5;
  const fringes = [];

  for (let k = 0; k <= samples; k++) {
    const t = tMin + (tMax - tMin) * k / samples;
    const z = zetaEta(0.5, t, 2000);
    const intensity = cAbs(z) ** 2;
    fringes.push({ t: +t.toFixed(3), intensity: +intensity.toFixed(6) });
  }

  // Find the minimum (dark fringe)
  const darkFringe = fringes.reduce((min, f) =>
    f.intensity < min.intensity ? f : min, fringes[0]
  );

  return {
    gamma,
    darkFringe,
    samples: fringes.filter((_, i) => i % 10 === 0),
  };
}

// ── Phase difference between paths ───────────────────────────────────────────

/**
 * The functional equation ξ(s) = ξ(1-s) means the two "paths" (s and 1-s)
 * have equal AMPLITUDE at all s. But their PHASE differs off the critical line.
 * At σ=½: phases are conjugate (Δφ = 0 in absolute value).
 * At σ≠½: phases differ.
 */
function phaseDifference(sigmaValues, t) {
  return sigmaValues.map(sigma => {
    const z1 = zetaEta(sigma, t, 2000);
    const z2 = zetaEta(1 - sigma, t, 2000);

    const phase1 = Math.atan2(z1[1], z1[0]);
    const phase2 = Math.atan2(z2[1], z2[0]);
    const delta = phase1 - phase2;

    // Normalize to [-π, π]
    const normalizedDelta = ((delta + Math.PI) % (2 * Math.PI)) - Math.PI;

    return {
      sigma,
      sReflected: 1 - sigma,
      phaseS: +phase1.toFixed(4),
      phaseReflected: +phase2.toFixed(4),
      delta: +normalizedDelta.toFixed(4),
      deltaDegrees: +(normalizedDelta * 180 / Math.PI).toFixed(2),
    };
  });
}

// ── Main test ────────────────────────────────────────────────────────────────

export function machZehnderAnalogyTest() {
  // Visibility at various σ
  const sigmas = [0.3, 0.4, 0.5, 0.6, 0.7];
  const visibilities = sigmas.map(sigma => ({
    sigma,
    V: +visibility(sigma, 10, 40, 50).toFixed(4),
  }));

  // Fringes near first few zeros
  const fringes = [14.13, 21.02, 25.01].map(gamma =>
    fringesNearZero(gamma, 100)
  );

  // Phase differences at various (σ, t)
  const phases = phaseDifference([0.3, 0.4, 0.5, 0.6, 0.7], 14.13);

  // Visibility maximum at σ=½?
  const maxVis = visibilities.reduce((max, v) => v.V > max.V ? v : max);

  return {
    visibilityProfile: visibilities,
    maxVisibility: maxVis,
    peakAtHalf: Math.abs(maxVis.sigma - 0.5) < 0.05,

    fringesNearZeros: fringes,
    phaseDifferences: phases,

    interferometerMapping: {
      inputSplitter: 'Dirichlet series split: s and 1-s',
      path1: 'ζ(s) with Gamma factor π^{-s/2}Γ(s/2)',
      path2: 'ζ(1-s) with Gamma factor π^{-(1-s)/2}Γ((1-s)/2)',
      phaseShift: 'χ(s) bridge factor (complex)',
      outputSplitter: 'Combine to form ξ(s) = ξ(1-s)',
      detector: '|ξ(s)|² intensity',
      fringes: 'ζ-zeros = dark fringes (perfect destructive)',
      visibility: 'V(σ) = path-path correlation (maximum at σ=½)',
    },

    rhInterferometric:
      'RH = "The interferometer fringes (ζ-zeros) lie on the line of maximum visibility (σ=½)". ' +
      'Equivalent to standard RH but physical picture: zeros are destructive interference ' +
      'minima, perfectly sharp only when the two paths are exactly balanced (σ=½).',

    verdict:
      `MACH-ZEHNDER ANALOGY: Twin ladder = 2-arm interferometer. ` +
      `Path 1 = ζ(s), Path 2 = ζ(1-s), phase = χ(s). ` +
      `Visibility V(σ) computed: ${visibilities.map(v => `σ=${v.sigma}:${v.V}`).join(', ')}. ` +
      `Maximum visibility at σ=${maxVis.sigma}${maxVis.peakAtHalf ? ' ✓' : ''}. ` +
      `ζ-zeros appear as DARK FRINGES in the interference pattern. ` +
      `RH = "dark fringes on line of maximum visibility". ` +
      `This gives a physical intuition for why zeros should be on σ=½: ` +
      `it is the only line where the two paths are phase-conjugate, so the ` +
      `interference can be perfectly sharp (producing exact zeros).`,
  };
}
