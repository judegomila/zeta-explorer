// Floating-point diagnostics for the Cayley page, not certified enclosures.
import { zetaCriticalStrip, cAdd, cSub, cMul, cLog, cExp } from './zeta.js';

export class NumericalEvaluationError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'NumericalEvaluationError';
    this.code = code;
  }
}

export function isFiniteComplex(z) {
  return Array.isArray(z) && z.length === 2 && Number.isFinite(z[0]) && Number.isFinite(z[1]);
}

// Unlike the shared visualizer cDiv, never replace a small denominator by zero.
export function divideComplex(numerator, denominator) {
  if (!isFiniteComplex(denominator)) {
    throw new NumericalEvaluationError('nonfinite-denominator', 'Nonfinite denominator');
  }
  const scale = Math.max(Math.abs(denominator[0]), Math.abs(denominator[1]));
  if (scale === 0) {
    throw new NumericalEvaluationError('zero-denominator', 'Zero denominator');
  }
  if (!isFiniteComplex(numerator)) {
    throw new NumericalEvaluationError('nonfinite-numerator', 'Nonfinite numerator');
  }
  const [br, bi] = denominator.map(x => x / scale);
  const [ar, ai] = numerator.map(x => x / scale);
  const d = br * br + bi * bi;
  const result = [(ar * br + ai * bi) / d, (ai * br - ar * bi) / d];
  if (!isFiniteComplex(result)) {
    throw new NumericalEvaluationError('nonfinite-result', 'Nonfinite quotient');
  }
  return result;
}

// Lanczos g=7, with reflection for 0 < Re(z) < 1/2. No uniform digit guarantee.
export function gammaLanczos(z) {
  if (!isFiniteComplex(z) || z[0] <= 0) {
    throw new NumericalEvaluationError('unsupported-domain', 'Gamma requires finite Re(z) > 0');
  }
  if (z[0] < 0.5) {
    const w = cMul([Math.PI, 0], z);
    const sin = [Math.sin(w[0]) * Math.cosh(w[1]), Math.cos(w[0]) * Math.sinh(w[1])];
    return divideComplex(divideComplex([Math.PI, 0], sin), gammaLanczos(cSub([1, 0], z)));
  }
  const coefficients = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
  ];
  const q = cSub(z, [1, 0]);
  let x = [coefficients[0], 0];
  for (let i = 1; i < coefficients.length; i++) {
    x = cAdd(x, divideComplex([coefficients[i], 0], cAdd(q, [i, 0])));
  }
  const t = cAdd(q, [7.5, 0]);
  const power = cExp(cMul(cAdd(q, [0.5, 0]), cLog(t)));
  const result = cMul([Math.sqrt(2 * Math.PI), 0], cMul(power, cMul(x, cExp(cMul([-1, 0], t)))));
  if (!isFiniteComplex(result)) {
    throw new NumericalEvaluationError('nonfinite-result', 'Nonfinite Gamma approximation');
  }
  return result;
}

// This demo samples z=i*t, 0<=t<=100, 0<a<=1/2: xi arguments are REAL in [0,101].
// Reflect s<1/2 using xi(s)=xi(1-s); the eta evaluator then sees real s>=1/2.
// Fixed 50-term eta + Lanczos is only a floating-point approximation. In
// particular, zetaCriticalStrip's accuracy comment is not a global error bound.
// Do not extrapolate this adapter to complex heights or other eta-denominator
// zeros. Near the pole at s=1 we reject cancellation, except the exact removable
// xi values at 0 and 1. The 1e-6 exclusion is a guard, not an error certificate.
export function xiReal(s) {
  if (!isFiniteComplex(s) || s[1] !== 0 || s[0] < 0 || s[0] > 101) {
    throw new NumericalEvaluationError('unsupported-domain', 'Xi demo supports real s in [0, 101] only');
  }
  if (s[0] === 0 || s[0] === 1) return [0.5, 0];
  const sigma = s[0] < 0.5 ? 1 - s[0] : s[0];
  if (Math.abs(sigma - 1) < 1e-6) {
    throw new NumericalEvaluationError('ill-conditioned', 'Xi evaluation too close to s=1');
  }
  const zeta = zetaCriticalStrip([sigma, 0], 50);
  const gamma = gammaLanczos([sigma / 2, 0]);
  const factor = 0.5 * sigma * (sigma - 1) * Math.exp(-sigma * Math.log(Math.PI) / 2);
  const result = cMul([factor, 0], cMul(gamma, zeta));
  if (!isFiniteComplex(result)) {
    throw new NumericalEvaluationError('nonfinite-result', 'Nonfinite xi approximation');
  }
  return result;
}

// X(w)=xi(1/2+w) is even and real-type. For E_a(z)=X(a-iz),
// E_a#(z)=conj(E_a(conj(z)))=X(a+iz)=X(-a-iz).
// The injectable evaluator takes UNcentered xi arguments, including both 1/2s.
export function thetaA(z, a, evaluateXi = xiReal) {
  if (!isFiniteComplex(z) || !Number.isFinite(a) || a <= 0 || z[1] < 0) {
    throw new NumericalEvaluationError('invalid-input', 'Require a>0 and finite z in the closed upper half-plane');
  }
  const minusIZ = [z[1], -z[0]];
  const denominator = evaluateXi(cAdd([0.5 + a, 0], minusIZ));
  const numerator = evaluateXi(cAdd([0.5 - a, 0], minusIZ));
  return divideComplex(numerator, denominator);
}

// A display tolerance only: neither side of this comparison is certified.
export const MODULUS_DISPLAY_TOLERANCE = 1e-10;
export function classifySampledModulus(abs) {
  if (!Number.isFinite(abs) || abs < 0) return 'undetermined';
  if (Math.abs(abs - 1) <= MODULUS_DISPLAY_TOLERANCE) return 'near-one';
  return abs < 1 ? 'below-one' : 'above-one';
}

export function sampleLabel(sample) {
  if (sample.status === 'invalid') return `Unavailable: ${sample.reason}`;
  if (sample.t === 0 && sample.modulusClass === 'near-one') return 'Boundary value (sampled modulus ≈ 1)';
  const labels = {
    'near-one': 'Sampled modulus ≈ 1 (undetermined)',
    'below-one': 'Sampled modulus < 1',
    'above-one': 'Sampled modulus > 1',
  };
  return labels[sample.modulusClass] || 'Sampled modulus undetermined';
}

export function sampleTheta(a, tMax = 100, nSamples = 150, evaluateXi = xiReal) {
  if (!Number.isFinite(a) || a <= 0 || a > 0.5 || !Number.isFinite(tMax) || tMax < 0 || tMax > 100 ||
      !Number.isInteger(nSamples) || nSamples < 0 || nSamples > 10000 || typeof evaluateXi !== 'function') {
    return { status: 'invalid-input', samples: [], validCount: 0, invalidCount: 0, invalidInputCount: 1,
      message: 'Require 0<a≤0.5, 0≤tMax≤100 and an integer sample count from 0 to 10000.' };
  }
  const samples = [];
  for (let i = 0; i < nSamples; i++) {
    const t = nSamples === 1 ? 0 : tMax * (i / (nSamples - 1));
    try {
      const theta = thetaA([0, t], a, evaluateXi);
      const abs = Math.hypot(...theta);
      if (!Number.isFinite(abs)) throw new NumericalEvaluationError('nonfinite-modulus', 'Nonfinite modulus');
      samples.push({ t, x: theta[0], y: theta[1], abs, status: 'approximate', modulusClass: classifySampledModulus(abs) });
    } catch (error) {
      samples.push({ t, status: 'invalid', modulusClass: 'undetermined',
        reason: error instanceof NumericalEvaluationError ? error.code : 'evaluation-error' });
    }
  }
  const validCount = samples.filter(s => s.status === 'approximate').length;
  const invalidCount = samples.length - validCount;
  const status = samples.length === 0 ? 'empty' : validCount === 0 ? 'all-invalid' : invalidCount > 0 ? 'partial' : 'sampled';
  return { status, samples, validCount, invalidCount, invalidInputCount: 0 };
}
