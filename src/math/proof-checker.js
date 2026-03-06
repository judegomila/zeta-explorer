/**
 * Skeptical proof-checker for the ZPO (Zero-Point Oscillator) model of the Riemann Hypothesis.
 *
 * Adversarial by design: actively hunts for counterexamples, logical gaps, and circular
 * reasoning. The critical test is the Davenport-Heilbronn zeta function, which has a
 * functional equation but zeros OFF the critical line — any argument that "works" for
 * D-H is necessarily wrong.
 */

import { cMul, cAdd, cSub, cAbs, cExp, cLog, cDiv, cPow,
         zetaCriticalStrip, zetaEulerProduct, eulerFactor, ZETA_ZEROS } from './zeta.js';
import { losslessBridge, directLadder, dualLadder } from './oscillators.js';
import { getPrimes } from './primes.js';

// ===========================================================================
// Section 1: Identity Verification
// ===========================================================================

/**
 * Test zeta(s) = chi(s)*zeta(1-s) at multiple points in the critical strip.
 * @param {Array<{sigma:number,t:number}>} [testPoints]
 * @returns {{tests:Array, allPass:boolean, worstError:number, verdict:string}}
 */
export function verifyFunctionalEquation(testPoints) {
  const pts = testPoints || [
    { sigma: 0.3, t: 15 }, { sigma: 0.7, t: 25 }, { sigma: 0.25, t: 40 },
    { sigma: 0.6, t: 50 }, { sigma: 0.4, t: 14.5 }, { sigma: 0.8, t: 30 },
    { sigma: 0.35, t: 60 }, { sigma: 0.75, t: 21 },
  ];
  const tests = pts.map(({ sigma, t }) => {
    const s = [sigma, t];
    const zetaS = zetaCriticalStrip(s);
    const zeta1s = zetaCriticalStrip([1 - sigma, -t]);
    const chi = losslessBridge(s).chi;
    const chiTimesZeta1s = cMul(chi, zeta1s);
    const norm = cAbs(zetaS);
    const relativeError = norm > 1e-12 ? cAbs(cSub(zetaS, chiTimesZeta1s)) / norm : cAbs(cSub(zetaS, chiTimesZeta1s));
    return { s, zetaS, chiTimesZeta1s, relativeError, passes: relativeError < 0.05 };
  });
  const worstError = Math.max(...tests.map(r => r.relativeError));
  const allPass = tests.every(r => r.passes);
  return { tests, allPass, worstError,
    verdict: allPass
      ? `Functional equation verified at ${tests.length} points (worst error: ${worstError.toExponential(3)}). This is a necessary identity, not evidence for RH.`
      : `Functional equation FAILED at some points (worst error: ${worstError.toExponential(3)}). Numerical issues detected.` };
}

/**
 * Verify |chi(1/2 + it)| = 1 for all t (bridge unitarity on the critical line).
 * @param {number[]} [tValues]
 * @returns {{tests:Array, allPass:boolean, worstError:number}}
 */
export function verifyBridgeUnitarity(tValues) {
  const ts = tValues || [10, 14.13, 21.02, 30, 50, 100, 200, 500];
  const tests = ts.map(t => {
    const mag = losslessBridge([0.5, t]).magnitude;
    const error = Math.abs(mag - 1);
    return { t, chiMagnitude: mag, error, passes: error < 0.02 };
  });
  return { tests, allPass: tests.every(r => r.passes), worstError: Math.max(...tests.map(r => r.error)) };
}

/**
 * Check Euler product convergence for sigma > 1 and divergence for sigma < 1.
 * @param {number[]} [sigmaValues]
 * @param {number} [numPrimes=200]
 * @returns {{tests:Array, convergenceBoundary:number}}
 */
export function verifyEulerProductConvergence(sigmaValues, numPrimes = 200) {
  const sigmas = sigmaValues || [0.5, 0.8, 1.0, 1.2, 1.5, 2.0];
  const half = Math.floor(numPrimes / 2);
  const tests = sigmas.map(sigma => {
    const s = [sigma, 0];
    const hp = zetaEulerProduct(s, half), fp = zetaEulerProduct(s, numPrimes);
    const zetaTrue = zetaCriticalStrip(s);
    return { sigma, converges: cAbs(cSub(fp, hp)) < 0.5, limitValue: fp, zetaTrue, error: cAbs(cSub(fp, zetaTrue)) };
  });
  let boundary = 1.0;
  for (let sig = 0.5; sig <= 2.0; sig += 0.05) {
    const s = [sig, 0];
    if (cAbs(cSub(zetaEulerProduct(s, numPrimes), zetaEulerProduct(s, half))) < 0.1) { boundary = sig; break; }
  }
  return { tests, convergenceBoundary: boundary };
}

// ===========================================================================
// Section 2: Model Claims Verification (ZPO-Specific)
// ===========================================================================

/** Compute raw Hamiltonian value (scalar, no gradient). */
function rawH(sigma, t, np) {
  const s = [sigma, t];
  const d = directLadder(s, np), u = dualLadder(s, np), b = losslessBridge(s);
  const T = d.totalEnergy + u.totalEnergy;
  const V = 0.5 * cAbs(cSub(d.totalImpedance, u.totalImpedance)) ** 2;
  return T + V + (1 - b.magnitude) ** 2 * 100;
}

/**
 * Scan sigma to find where H(sigma,t) is minimized. ZPO claims it is always at 0.5.
 * @param {number[]} [tValues]
 * @param {number} [numPrimes=15]
 * @returns {{tests:Array, allAtHalf:boolean, maxDeviation:number, verdict:string}}
 */
export function testHamiltonianMinimum(tValues, numPrimes = 15) {
  const ts = tValues || [14.13, 21.02, 30.42, 50, 100];
  const tests = ts.map(t => {
    let minSigma = 0.5, minH = Infinity;
    for (let sigma = 0.1; sigma <= 0.9; sigma += 0.02) {
      const H = rawH(sigma, t, numPrimes);
      if (H < minH) { minH = H; minSigma = sigma; }
    }
    const deviation = Math.abs(minSigma - 0.5);
    return { t, minSigma: Math.round(minSigma * 100) / 100, minH, isAtHalf: deviation < 0.05, deviation };
  });
  const maxDeviation = Math.max(...tests.map(r => r.deviation));
  const allAtHalf = tests.every(r => r.isAtHalf);
  return { tests, allAtHalf, maxDeviation,
    verdict: allAtHalf
      ? `Hamiltonian minimized near sigma=0.5 for all ${tests.length} t-values (max deviation: ${maxDeviation.toFixed(3)}). WARNING: this is a property of the model construction — the impedance and bridge terms were DEFINED to be minimal at sigma=0.5.`
      : `Hamiltonian NOT always minimized at sigma=0.5. Max deviation: ${maxDeviation.toFixed(3)}.` };
}

/**
 * At each known zero gamma, check if impedance mismatch |Z_direct - Z_dual| -> 0.
 * @param {number} [numZeros=10]
 * @param {number} [numPrimes=15]
 * @returns {{tests:Array, avgMismatch:number, worstMismatch:number, verdict:string}}
 */
export function testImpedanceMatching(numZeros = 10, numPrimes = 15) {
  const tests = ZETA_ZEROS.slice(0, numZeros).map(gamma => {
    const s = [0.5, gamma];
    const d = directLadder(s, numPrimes), u = dualLadder(s, numPrimes);
    const mismatch = cAbs(cSub(d.totalImpedance, u.totalImpedance));
    return { gamma, mismatch, bridgeMag: losslessBridge(s).magnitude, nearZero: mismatch < 1.0 };
  });
  const avg = tests.reduce((s, r) => s + r.mismatch, 0) / tests.length;
  return { tests, avgMismatch: avg, worstMismatch: Math.max(...tests.map(r => r.mismatch)),
    verdict: `Average mismatch: ${avg.toFixed(4)}. Finite product (${numPrimes} primes) cannot reach zero. The claim requires an unverifiable infinite limit, and impedance matching restates the functional equation, which D-H also satisfies.` };
}

/**
 * Check if Shannon entropy of Euler factor phases is maximized at sigma = 0.5.
 * @param {number[]} [tValues]
 * @param {number} [numPrimes=20]
 * @returns {{tests:Array, allAtHalf:boolean, verdict:string}}
 */
export function testEntropyMaximum(tValues, numPrimes = 20) {
  const ts = tValues || [14.13, 25, 40, 60, 100];
  const BINS = 12;
  function entropy(sigma, t) {
    const primes = getPrimes(numPrimes), bins = new Float64Array(BINS);
    for (const p of primes) {
      const ef = eulerFactor(p, [sigma, t]);
      const ph = ((Math.atan2(ef[1], ef[0]) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
      bins[Math.min(Math.floor(ph / (2 * Math.PI) * BINS), BINS - 1)]++;
    }
    let H = 0;
    for (let i = 0; i < BINS; i++) { const q = bins[i] / numPrimes; if (q > 0) H -= q * Math.log2(q); }
    return H;
  }
  const tests = ts.map(t => {
    let maxS = 0.5, maxE = -Infinity;
    const eHalf = entropy(0.5, t);
    for (let sigma = 0.1; sigma <= 0.9; sigma += 0.02) { const e = entropy(sigma, t); if (e > maxE) { maxE = e; maxS = sigma; } }
    return { t, maxEntropySigma: Math.round(maxS * 100) / 100, entropyAtHalf: eHalf, entropyAtMax: maxE, isAtHalf: Math.abs(maxS - 0.5) < 0.1 };
  });
  return { tests, allAtHalf: tests.every(r => r.isAtHalf),
    verdict: tests.every(r => r.isAtHalf)
      ? 'Phase entropy maximized near sigma=0.5. But finite-product entropy has no rigorous connection to zero locations. Heuristic only.'
      : 'Phase entropy NOT always maximized at sigma=0.5. The ZPO entropy claim fails.' };
}

// ===========================================================================
// Section 3: CRITICAL — Davenport-Heilbronn Counterexample
// ===========================================================================

/** Character chi_1 mod 5: chi_1(2) = i. */
function chi1Mod5(n) {
  const r = ((n % 5) + 5) % 5;
  if (r === 1) return [1, 0]; if (r === 2) return [0, 1]; if (r === 3) return [0, -1]; if (r === 4) return [-1, 0];
  return [0, 0];
}
function chi1BarMod5(n) { const v = chi1Mod5(n); return [v[0], -v[1]]; }

/**
 * Compute the Davenport-Heilbronn zeta function:
 * f(s) = (1-i*kappa)/2 * L(s,chi_1) + (1+i*kappa)/2 * L(s,chi_1_bar)
 * where kappa = (sqrt(10-2*sqrt(5)) - 2)/(sqrt(5)-1), chi_1 mod 5 with chi_1(2)=i.
 * @param {number[]} s - Complex number [re, im]
 * @param {number} [N=300] - Dirichlet series terms
 * @returns {number[]} Complex value [re, im]
 */
export function davenportHeilbronnZeta(s, N = 300) {
  const kappa = (Math.sqrt(10 - 2 * Math.sqrt(5)) - 2) / (Math.sqrt(5) - 1);
  const c1 = [0.5, -kappa / 2], c2 = [0.5, kappa / 2];
  let L1 = [0, 0], Lb = [0, 0];
  for (let n = 1; n <= N; n++) {
    const inv = cDiv([1, 0], cPow([n, 0], s));
    const ch = chi1Mod5(n), cb = chi1BarMod5(n);
    if (ch[0] || ch[1]) L1 = cAdd(L1, cMul(ch, inv));
    if (cb[0] || cb[1]) Lb = cAdd(Lb, cMul(cb, inv));
  }
  return cAdd(cMul(c1, L1), cMul(c2, Lb));
}

/**
 * Test if D-H has a unitary bridge at sigma=0.5. If yes, bridge unitarity alone cannot prove RH.
 * @param {number[]} [tValues]
 * @returns {{tests:Array, hasUnitaryBridge:boolean, implication:string}}
 */
export function testDavenportHeilbronnBridge(tValues) {
  const ts = tValues || [10, 15, 20, 30, 50];
  const tests = ts.map(t => {
    const fs = davenportHeilbronnZeta([0.5, t], 500);
    const f1s = davenportHeilbronnZeta([0.5, -t], 500);
    const mag1s = cAbs(f1s);
    const bridgeMag = mag1s > 1e-15 ? cAbs(fs) / mag1s : NaN;
    return { t, bridgeMag, isUnitary: !isNaN(bridgeMag) && Math.abs(bridgeMag - 1) < 0.15 };
  });
  const valid = tests.filter(r => !isNaN(r.bridgeMag));
  const hasUnitaryBridge = valid.length > 0 && valid.every(r => r.isUnitary);
  return { tests, hasUnitaryBridge,
    implication: hasUnitaryBridge
      ? 'CRITICAL: D-H has a unitary bridge at sigma=0.5 yet zeros OFF the critical line. Bridge unitarity ALONE does not imply RH.'
      : 'D-H bridge not reliably unitary. The ZPO bridge argument may distinguish zeta from D-H, but further analysis needed.' };
}

/**
 * Build ZPO-style "Hamiltonian" for D-H and check if minimized at sigma=0.5.
 * @param {number[]} [tValues]
 * @param {number} [numPrimes=15] - Kept for interface consistency
 * @returns {{tests:Array, verdict:string, whatThisMeans:string}}
 */
export function testDavenportHeilbronnHamiltonian(tValues, numPrimes = 15) {
  const ts = tValues || [10, 15, 20, 30];
  const tests = ts.map(t => {
    let minS = 0.5, minV = Infinity;
    for (let sigma = 0.1; sigma <= 0.9; sigma += 0.02) {
      const v = cAbs(davenportHeilbronnZeta([sigma, t], 300));
      if (v < minV) { minV = v; minS = sigma; }
    }
    return { t, minSigma: Math.round(minS * 100) / 100, isAtHalf: Math.abs(minS - 0.5) < 0.1 };
  });
  const allHalf = tests.every(r => r.isAtHalf);
  return { tests,
    verdict: allHalf
      ? '|f(s)| for D-H minimized near sigma=0.5, yet D-H has off-line zeros. PROVES that |f|-minimization does not imply zeros on the line.'
      : '|f(s)| for D-H NOT always minimized at sigma=0.5. The ZPO energy argument may discriminate zeta from D-H here.',
    whatThisMeans: 'Reveals whether ZPO energy-minimization is specific to Euler-product functions or applies (incorrectly) to any function with a functional equation.' };
}

/**
 * Run all D-H tests and produce a discriminator report identifying what zeta has that D-H lacks.
 * @returns {{bridgeTest:object, hamiltonianTest:object, discriminators:Array, conclusion:string}}
 */
export function davenportHeilbronnReport() {
  const bridgeTest = testDavenportHeilbronnBridge();
  const hamiltonianTest = testDavenportHeilbronnHamiltonian();
  const discriminators = [
    { property: 'Euler product', zetaHas: true, dhLacks: true,
      significance: 'Zeta has a convergent Euler product for Re(s)>1 encoding unique prime factorization. D-H has none. This is the fundamental structural difference.' },
    { property: 'Multiplicative coefficients', zetaHas: true, dhLacks: true,
      significance: 'Zeta coefficients a(n)=1 are completely multiplicative. D-H coefficients are a weighted mix of two characters — not multiplicative.' },
    { property: 'Selberg class membership', zetaHas: true, dhLacks: true,
      significance: 'Zeta satisfies all Selberg class axioms. D-H fails the Euler product axiom. GRH applies only to Selberg class members.' },
    { property: 'Self-adjoint operator', zetaHas: true, dhLacks: false,
      significance: 'Hilbert-Polya: zeta zeros may be eigenvalues of a Hermitian operator. D-H zeros cannot all be such eigenvalues since some are off the critical line.' },
  ];
  return { bridgeTest, hamiltonianTest, discriminators,
    conclusion: 'Functional equation + bridge unitarity are INSUFFICIENT for RH. The ZPO argument must explicitly use the Euler product to avoid proving something false for D-H.' };
}

// ===========================================================================
// Section 3b: Euler Product Discriminator Tests
// ===========================================================================

/**
 * Test what separates zeta from D-H: the Euler product structure.
 * For each of 6 attack strategies, test whether it works on D-H function.
 * If it fails on D-H but works on zeta, the strategy uses Euler product structure.
 * If it works on both, the strategy is insufficient (doesn't distinguish them).
 *
 * This directly addresses crit-003 (Bridge Unitarity != Zero Confinement) by
 * quantifying which properties discriminate zeta from D-H.
 *
 * @param {number} t - Imaginary part to test
 * @param {number} numPrimes - Number of primes for Euler product computations
 * @returns {{ strategies: Array<{name: string, worksOnZeta: boolean, worksOnDH: boolean, usesEulerProduct: boolean, discriminating: boolean, zetaScore: number, dhScore: number, details: string}>, numDiscriminating: number, discriminationPower: number, conclusion: string }}
 */
export function eulerProductDiscriminator(t, numPrimes = 15) {
  const strategies = [];

  // Strategy 1: Bridge unitarity — |chi(1/2 + it)| = 1
  {
    const zetaBridge = losslessBridge([0.5, t]).magnitude;
    const zetaWorks = Math.abs(zetaBridge - 1) < 0.05;
    // D-H "bridge": ratio |f(s)/f(1-s)| at sigma=0.5
    const dhS = davenportHeilbronnZeta([0.5, t], 500);
    const dhS1 = davenportHeilbronnZeta([0.5, -t], 500);
    const dhBridge = cAbs(dhS1) > 1e-15 ? cAbs(dhS) / cAbs(dhS1) : NaN;
    const dhWorks = !isNaN(dhBridge) && Math.abs(dhBridge - 1) < 0.15;
    strategies.push({
      name: 'Bridge Unitarity',
      worksOnZeta: zetaWorks,
      worksOnDH: dhWorks,
      usesEulerProduct: !dhWorks && zetaWorks,
      discriminating: zetaWorks && !dhWorks,
      zetaScore: 1 - Math.abs(zetaBridge - 1),
      dhScore: isNaN(dhBridge) ? 0 : 1 - Math.abs(dhBridge - 1),
      details: `Zeta bridge mag: ${zetaBridge.toFixed(4)}, D-H bridge mag: ${isNaN(dhBridge) ? 'NaN' : dhBridge.toFixed(4)}`,
    });
  }

  // Strategy 2: Hamiltonian minimization at sigma=0.5
  {
    let zetaMinSigma = 0.5, zetaMinV = Infinity;
    let dhMinSigma = 0.5, dhMinV = Infinity;
    for (let sigma = 0.1; sigma <= 0.9; sigma += 0.02) {
      const zetaV = rawH(sigma, t, numPrimes);
      if (zetaV < zetaMinV) { zetaMinV = zetaV; zetaMinSigma = sigma; }
      const dhV = cAbs(davenportHeilbronnZeta([sigma, t], 300));
      if (dhV < dhMinV) { dhMinV = dhV; dhMinSigma = sigma; }
    }
    const zetaWorks = Math.abs(zetaMinSigma - 0.5) < 0.1;
    const dhWorks = Math.abs(dhMinSigma - 0.5) < 0.1;
    strategies.push({
      name: 'Hamiltonian Minimization',
      worksOnZeta: zetaWorks,
      worksOnDH: dhWorks,
      usesEulerProduct: !dhWorks && zetaWorks,
      discriminating: zetaWorks !== dhWorks,
      zetaScore: 1 - Math.abs(zetaMinSigma - 0.5) * 2,
      dhScore: 1 - Math.abs(dhMinSigma - 0.5) * 2,
      details: `Zeta min at sigma=${zetaMinSigma.toFixed(2)}, D-H min at sigma=${dhMinSigma.toFixed(2)}`,
    });
  }

  // Strategy 3: Impedance matching (direct = dual)
  {
    const d = directLadder([0.5, t], numPrimes);
    const u = dualLadder([0.5, t], numPrimes);
    const zetaMismatch = cAbs(cSub(d.totalImpedance, u.totalImpedance));
    const zetaWorks = zetaMismatch < 2.0;
    // D-H has no Euler product, so no natural "direct/dual" decomposition
    // Test: does f(s) ≈ f(1-s) at sigma=0.5?
    const dhFS = davenportHeilbronnZeta([0.5, t], 500);
    const dhF1S = davenportHeilbronnZeta([0.5, -t], 500);
    const dhMismatch = cAbs(cSub(dhFS, dhF1S));
    const dhWorks = dhMismatch < 2.0;
    strategies.push({
      name: 'Impedance Matching',
      worksOnZeta: zetaWorks,
      worksOnDH: dhWorks,
      usesEulerProduct: !dhWorks && zetaWorks,
      discriminating: zetaWorks !== dhWorks,
      zetaScore: Math.max(0, 1 - zetaMismatch / 5),
      dhScore: Math.max(0, 1 - dhMismatch / 5),
      details: `Zeta mismatch: ${zetaMismatch.toFixed(4)}, D-H mismatch: ${dhMismatch.toFixed(4)}`,
    });
  }

  // Strategy 4: Euler product convergence (unique to zeta)
  {
    const primes = getPrimes(numPrimes);
    let zetaProd = [1, 0];
    for (const p of primes) {
      zetaProd = cMul(zetaProd, eulerFactor(p, [0.5, t]));
    }
    const zetaTrue = zetaCriticalStrip([0.5, t]);
    const zetaMag = cAbs(zetaProd);
    const zetaWorks = zetaMag > 0 && isFinite(zetaMag);

    // D-H does NOT have an Euler product — this is the key discriminator
    // Try to "force" an Euler product on D-H: multiply factors 1/(1-chi(p)*p^{-s})
    // This will not converge to the D-H function
    let dhProd = [1, 0];
    for (const p of primes) {
      const chi = chi1Mod5(p);
      if (cAbs(chi) > 0) {
        const ps = cPow([p, 0], [-0.5, -t]);
        const factor = cSub([1, 0], cMul(chi, ps));
        if (cAbs(factor) > 1e-15) dhProd = cDiv(dhProd, factor);
      }
    }
    const dhTrue = davenportHeilbronnZeta([0.5, t], 500);
    const dhError = cAbs(dhTrue) > 1e-15
      ? cAbs(cSub(dhProd, dhTrue)) / cAbs(dhTrue)
      : cAbs(cSub(dhProd, dhTrue));
    const dhWorks = dhError < 0.5;

    strategies.push({
      name: 'Euler Product Structure',
      worksOnZeta: zetaWorks,
      worksOnDH: dhWorks,
      usesEulerProduct: true,
      discriminating: zetaWorks && !dhWorks,
      zetaScore: zetaWorks ? 1.0 : 0.0,
      dhScore: dhWorks ? 1.0 : 0.0,
      details: `Zeta Euler product finite: ${zetaWorks}, D-H Euler product error: ${dhError.toFixed(4)}`,
    });
  }

  // Strategy 5: Phase entropy maximization
  {
    const BINS = 12;
    function phaseEntropy(sigma, tv, evalFn) {
      const bins = new Float64Array(BINS);
      const pts = 20;
      for (let n = 1; n <= pts; n++) {
        const val = evalFn([sigma, tv], n);
        const ph = ((Math.atan2(val[1], val[0]) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        bins[Math.min(Math.floor(ph / (2 * Math.PI) * BINS), BINS - 1)]++;
      }
      let H = 0;
      for (let i = 0; i < BINS; i++) { const q = bins[i] / pts; if (q > 0) H -= q * Math.log2(q); }
      return H;
    }
    const zetaEvalFn = (s, n) => eulerFactor(getPrimes(n + 1)[n], s);
    let zetaMaxS = 0.5, zetaMaxE = -Infinity;
    let dhMaxS = 0.5, dhMaxE = -Infinity;
    for (let sigma = 0.1; sigma <= 0.9; sigma += 0.05) {
      const ze = phaseEntropy(sigma, t, zetaEvalFn);
      if (ze > zetaMaxE) { zetaMaxE = ze; zetaMaxS = sigma; }
      const de = phaseEntropy(sigma, t, (s) => davenportHeilbronnZeta(s, 100));
      if (de > dhMaxE) { dhMaxE = de; dhMaxS = sigma; }
    }
    const zetaWorks = Math.abs(zetaMaxS - 0.5) < 0.15;
    const dhWorks = Math.abs(dhMaxS - 0.5) < 0.15;
    strategies.push({
      name: 'Phase Entropy Maximum',
      worksOnZeta: zetaWorks,
      worksOnDH: dhWorks,
      usesEulerProduct: !dhWorks && zetaWorks,
      discriminating: zetaWorks !== dhWorks,
      zetaScore: 1 - Math.abs(zetaMaxS - 0.5) * 2,
      dhScore: 1 - Math.abs(dhMaxS - 0.5) * 2,
      details: `Zeta max entropy at sigma=${zetaMaxS.toFixed(2)}, D-H max at sigma=${dhMaxS.toFixed(2)}`,
    });
  }

  // Strategy 6: KL divergence as Lyapunov function
  {
    // For zeta: D_KL(P_sigma || P_0.5) using Euler factor magnitudes
    function zetaKL(sigma) {
      const primes = getPrimes(numPrimes), sEq = [0.5, t], s = [sigma, t];
      let totC = 0, totE = 0;
      const cur = [], eq = [];
      for (const p of primes) {
        const c = cAbs(eulerFactor(p, s)) ** 2;
        const e = cAbs(eulerFactor(p, sEq)) ** 2;
        cur.push(c); eq.push(e); totC += c; totE += e;
      }
      if (totC < 1e-20 || totE < 1e-20) return 0;
      let kl = 0;
      for (let i = 0; i < primes.length; i++) {
        const pC = cur[i] / totC, pE = eq[i] / totE;
        if (pC > 1e-20 && pE > 1e-20) kl += pC * Math.log(pC / pE);
      }
      return Math.max(0, kl);
    }
    const zetaKLHalf = zetaKL(0.5);
    const zetaKLOff = zetaKL(0.3);
    const zetaWorks = zetaKLHalf < 0.01 && zetaKLOff > zetaKLHalf;

    // For D-H: no Euler factors, so KL has no natural definition
    // Approximate by Dirichlet coefficient magnitudes
    function dhKL(sigma) {
      const s = [sigma, t], sEq = [0.5, t];
      let totC = 0, totE = 0;
      const cur = [], eq = [];
      for (let n = 1; n <= 20; n++) {
        const chi = chi1Mod5(n);
        const nS = cPow([n, 0], [-sigma, -t]);
        const nEq = cPow([n, 0], [-0.5, -t]);
        const c = cAbs(cMul(chi, nS)) ** 2;
        const e = cAbs(cMul(chi, nEq)) ** 2;
        cur.push(c); eq.push(e); totC += c; totE += e;
      }
      if (totC < 1e-20 || totE < 1e-20) return 0;
      let kl = 0;
      for (let i = 0; i < cur.length; i++) {
        const pC = cur[i] / totC, pE = eq[i] / totE;
        if (pC > 1e-20 && pE > 1e-20) kl += pC * Math.log(pC / pE);
      }
      return Math.max(0, kl);
    }
    const dhKLHalf = dhKL(0.5);
    const dhKLOff = dhKL(0.3);
    const dhWorks = dhKLHalf < 0.01 && dhKLOff > dhKLHalf;

    strategies.push({
      name: 'KL Divergence Lyapunov',
      worksOnZeta: zetaWorks,
      worksOnDH: dhWorks,
      usesEulerProduct: !dhWorks && zetaWorks,
      discriminating: zetaWorks && !dhWorks,
      zetaScore: zetaWorks ? Math.min(1, zetaKLOff / Math.max(0.01, zetaKLHalf + 0.01)) : 0,
      dhScore: dhWorks ? Math.min(1, dhKLOff / Math.max(0.01, dhKLHalf + 0.01)) : 0,
      details: `Zeta KL(0.5)=${zetaKLHalf.toFixed(4)}, KL(0.3)=${zetaKLOff.toFixed(4)}; D-H KL(0.5)=${dhKLHalf.toFixed(4)}, KL(0.3)=${dhKLOff.toFixed(4)}`,
    });
  }

  const numDiscriminating = strategies.filter(s => s.discriminating).length;
  const discriminationPower = numDiscriminating / strategies.length;
  const conclusion = numDiscriminating >= 3
    ? `Strong discrimination: ${numDiscriminating}/6 strategies distinguish zeta from D-H via Euler product structure. The Euler product is the key ingredient missing from insufficient proof attempts.`
    : numDiscriminating >= 1
      ? `Partial discrimination: ${numDiscriminating}/6 strategies distinguish zeta from D-H. More Euler-product-dependent arguments needed.`
      : `Weak discrimination: No strategies clearly distinguish zeta from D-H at t=${t}. Current proof approaches may be insufficient.`;

  return { strategies, numDiscriminating, discriminationPower, conclusion };
}

// ===========================================================================
// Section 4: Edge Case and Stress Testing
// ===========================================================================

/**
 * Test ZPO claims at very large t where numerical precision degrades.
 * @param {number[]} [tValues]
 * @param {number} [numPrimes=15]
 * @returns {{tests:Array, failuresAtLargeT:number, verdict:string}}
 */
export function stressTestLargeT(tValues, numPrimes = 15) {
  const ts = tValues || [500, 700, 900];
  const tests = ts.map(t => {
    const bridgeOk = Math.abs(losslessBridge([0.5, t]).magnitude - 1) < 0.05;
    const z = zetaCriticalStrip([0.5, t]);
    const zetaComputable = isFinite(z[0]) && isFinite(z[1]);
    let minS = 0.5, minH = Infinity;
    for (let sigma = 0.2; sigma <= 0.8; sigma += 0.05) {
      const H = rawH(sigma, t, numPrimes);
      if (H < minH) { minH = H; minS = sigma; }
    }
    const hamiltonianOk = Math.abs(minS - 0.5) < 0.1;
    const precision = zetaComputable ? Math.max(0, -Math.log10(cAbs(z) + 1e-30) + 2) : 0;
    return { t, bridgeOk, hamiltonianOk, zetaComputable, precision };
  });
  const fails = tests.filter(r => !r.bridgeOk || !r.hamiltonianOk || !r.zetaComputable).length;
  return { tests, failuresAtLargeT: fails,
    verdict: fails > 0
      ? `${fails}/${tests.length} large-t tests degraded. Precision is a concern at large heights.`
      : 'All large-t tests passed, but this covers t < 1000. Untested at t > 10^12 where new phenomena may emerge.' };
}

/**
 * Test claims very near known zeros: sigma = 0.5 +/- epsilon.
 * @param {number[]} [gammaValues]
 * @param {number[]} [epsilons]
 * @param {number} [numPrimes=15]
 * @returns {{tests:Array, allConsistent:boolean}}
 */
export function stressTestNearZero(gammaValues, epsilons, numPrimes = 15) {
  const gammas = gammaValues || ZETA_ZEROS.slice(0, 5);
  const eps = epsilons || [0.001, 0.01, 0.05, 0.1];
  const tests = [];
  for (const gamma of gammas) {
    const refMag = cAbs(zetaCriticalStrip([0.7, gamma]));
    for (const epsilon of eps) {
      const s = [0.5 + epsilon, gamma];
      const zetaMag = cAbs(zetaCriticalStrip(s));
      const b = losslessBridge(s);
      const hVal = rawH(0.5 + epsilon, gamma, numPrimes);
      tests.push({ gamma, epsilon, zetaMag, bridgeMag: b.magnitude, hamiltonianValue: hVal, consistent: zetaMag < refMag + 0.5 });
    }
  }
  return { tests, allConsistent: tests.every(r => r.consistent) };
}

// ===========================================================================
// Section 5: Logical Gap Detection
// ===========================================================================

/**
 * Analyze the ZPO argument for circular reasoning.
 * @returns {Array<{claim:string, dependsOn:string[], isCircular:boolean, explanation:string}>}
 */
export function circularityCheck() {
  return [
    { claim: 'H(sigma,t) minimized at sigma=0.5',
      dependsOn: ['Bridge |chi(s)|=1 at sigma=0.5 (functional equation)', 'Z_direct=Z_dual at sigma=0.5 (s<->1-s symmetry)'],
      isCircular: false,
      explanation: 'Follows from functional equation symmetry. But D-H also has this, so it cannot force zeros onto the line.' },
    { claim: 'Zeta zeros occur at Hamiltonian minima',
      dependsOn: ['Zeros interpreted as oscillator resonances', 'Resonances assumed at energy minima'],
      isCircular: true,
      explanation: 'CIRCULAR: Zeros are where zeta(s)=0, not energy minima. A zero at sigma=0.6 satisfies zeta(s)=0 without being at an H-minimum. The claim assumes what it purports to prove.' },
    { claim: 'Euler product forces zeros to critical line',
      dependsOn: ['Each 1/(1-p^{-s}) nonzero', 'Infinite product vanishes only through collective cancellation'],
      isCircular: false,
      explanation: 'Most promising direction. But the product diverges in the critical strip, so cancellation arguments in the analytic continuation are heuristic.' },
    { claim: 'Impedance matching implies zeros at sigma=0.5',
      dependsOn: ['Direct=zeta(s), dual=zeta(1-s)', 'Perfect match forces signal nulls'],
      isCircular: true,
      explanation: 'CIRCULAR: Restates the functional equation in circuit language. D-H has the same symmetry but zeros off the line.' },
    { claim: 'Phase entropy max at sigma=0.5 concentrates zeros',
      dependsOn: ['Uniform phase distribution at sigma=0.5', 'Max entropy => max destructive interference'],
      isCircular: false,
      explanation: 'Not circular but WEAK: finite-phase entropy has no rigorous connection to zero locations. Suggestive heuristic only.' },
  ];
}

/**
 * Score each ZPO implication: 'proof' | 'strong' | 'weak' | 'circular' | 'false'.
 * @param {number} [numZeros=5]
 * @param {number} [numPrimes=15]
 * @returns {{implications:Array, overallAssessment:string}}
 */
export function implicationStrengthTest(numZeros = 5, numPrimes = 15) {
  const dhB = testDavenportHeilbronnBridge([15, 25]);
  const implications = [
    { from: 'Functional equation', to: 'All zeros on Re(s)=0.5', strength: 'false',
      evidence: 'Proven identity but does NOT imply RH.', counterexample: 'D-H has functional equation with off-line zeros.' },
    { from: 'Bridge unitarity |chi(1/2+it)|=1', to: 'Zeros at sigma=0.5', strength: dhB.hasUnitaryBridge ? 'false' : 'weak',
      evidence: 'Equivalent to functional equation symmetry.', counterexample: dhB.hasUnitaryBridge ? 'D-H also unitary but has off-line zeros.' : null },
    { from: 'Hamiltonian minimum at sigma=0.5', to: 'Zeros at sigma=0.5', strength: 'circular',
      evidence: 'H is CONSTRUCTED with terms minimal at sigma=0.5.', counterexample: 'Any functional-equation function yields symmetric H.' },
    { from: 'Euler product (prime factorization)', to: 'Zeros on critical line', strength: 'strong',
      evidence: 'Unique feature D-H lacks. Most promising but unproven.', counterexample: null },
    { from: 'Phase entropy max at sigma=0.5', to: 'Zero concentration', strength: 'weak',
      evidence: 'Statistical property of finite phases; no rigorous zero-location bound.', counterexample: null },
    { from: 'Impedance matching at zeros', to: 'All zeros at sigma=0.5', strength: 'circular',
      evidence: 'Restates functional equation in circuit language.', counterexample: 'D-H has same symmetry, zeros off-line.' },
  ];
  return { implications,
    overallAssessment: 'NOT a proof. Two implications circular, two refuted by D-H, strongest (Euler product) remains open. The ZPO model is an exploratory framework, not a rigorous argument.' };
}

// ===========================================================================
// Section 6: Full Proof Check Report
// ===========================================================================

/**
 * Run every test and produce a comprehensive adversarial report.
 * @param {number} [numPrimes=15]
 * @param {number} [numZeros=5]
 * @returns {{identities:object, modelClaims:object, counterexample:object, stressTests:object,
 *            logicCheck:object, summary:object, verdict:string, criticalFailures:Array,
 *            whatWorks:Array, whatFails:Array}}
 */
export function fullProofCheck(numPrimes = 15, numZeros = 5) {
  const identities = {
    functionalEq: verifyFunctionalEquation(),
    bridgeUnitarity: verifyBridgeUnitarity(),
    eulerConvergence: verifyEulerProductConvergence(undefined, numPrimes * 5),
  };
  const modelClaims = {
    hamiltonianMin: testHamiltonianMinimum(undefined, numPrimes),
    impedanceMatch: testImpedanceMatching(numZeros, numPrimes),
    entropyMax: testEntropyMaximum(undefined, numPrimes),
  };
  const counterexample = davenportHeilbronnReport();
  const stressTests = {
    largeT: stressTestLargeT(undefined, numPrimes),
    nearZero: stressTestNearZero(undefined, undefined, numPrimes),
  };
  const logicCheck = {
    circularity: circularityCheck(),
    implicationStrength: implicationStrengthTest(numZeros, numPrimes),
  };

  let totalTests = 0, passed = 0, failed = 0, warnings = 0;
  for (const r of identities.functionalEq.tests) { totalTests++; r.passes ? passed++ : failed++; }
  for (const r of identities.bridgeUnitarity.tests) { totalTests++; r.passes ? passed++ : failed++; }
  for (const r of modelClaims.hamiltonianMin.tests) { totalTests++; r.isAtHalf ? passed++ : failed++; }
  for (const r of modelClaims.impedanceMatch.tests) { totalTests++; r.nearZero ? passed++ : warnings++; }
  for (const r of modelClaims.entropyMax.tests) { totalTests++; r.isAtHalf ? passed++ : failed++; }
  for (const r of stressTests.largeT.tests) { totalTests++; (r.bridgeOk && r.hamiltonianOk && r.zetaComputable) ? passed++ : warnings++; }

  const circularCount = logicCheck.circularity.filter(c => c.isCircular).length;
  const falseCount = logicCheck.implicationStrength.implications.filter(i => i.strength === 'false').length;
  const circImplCount = logicCheck.implicationStrength.implications.filter(i => i.strength === 'circular').length;

  const criticalFailures = [];
  if (falseCount > 0) criticalFailures.push({ test: 'Davenport-Heilbronn counterexample',
    reason: `${falseCount} ZPO implications refuted by D-H: functional equation with off-line zeros.` });
  if (circularCount > 0) criticalFailures.push({ test: 'Circularity analysis',
    reason: `${circularCount} claims assume zeros at sigma=0.5 to "prove" zeros at sigma=0.5.` });
  if (circImplCount > 0) criticalFailures.push({ test: 'Implication strength',
    reason: `${circImplCount} implications rated circular — conclusions embedded in premises.` });

  const whatWorks = [
    { claim: 'Functional equation', evidence: `Verified at ${identities.functionalEq.tests.length} points. Known proven identity.` },
    { claim: 'Bridge unitarity', evidence: 'Confirmed numerically. Mathematical consequence of functional equation.' },
    { claim: 'Hamiltonian min at sigma=0.5', evidence: 'Observed. Follows from model construction + functional equation symmetry.' },
    { claim: 'Euler product as discriminator', evidence: 'Only property separating zeta from D-H. Strongest candidate for proof ingredient.' },
  ];
  const whatFails = [
    { claim: 'Bridge unitarity implies RH', reason: 'REFUTED: D-H has unitary bridge, zeros off-line.' },
    { claim: 'H-minimum implies zero locations', reason: 'CIRCULAR: H constructed to be minimal at sigma=0.5.' },
    { claim: 'Impedance matching proves RH', reason: 'Restates functional equation; D-H also satisfies it.' },
    { claim: 'Finite checks prove universality', reason: 'Finitely many tests cannot prove a statement about infinitely many zeros.' },
  ];

  return { identities, modelClaims, counterexample, stressTests, logicCheck,
    summary: { totalTests, passed, failed, warnings },
    verdict: 'NOT A PROOF. The ZPO model correctly encodes functional equation and Euler product structure but contains circular reasoning, is refuted by D-H for general functional-equation functions, and relies on heuristics. The Euler product insight is promising but remains an open problem equivalent to RH.',
    criticalFailures, whatWorks, whatFails };
}
