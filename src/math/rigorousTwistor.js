/**
 * Split-real projective twistor model. Separate from the illustrative twistor.js.
 * Analytical statements: research/twistor-bridge-2026-10-03/twistor-bridge-continuation.tex.
 * Numbers from this module are floating-point diagnostics, never certificates.
 */
export const COMMON_WINDOW_SAFE = 1.022591164; // Rounded DOWN from exp(exp(-gamma)/(8*pi)).
export const SIGNED_WINDOW = Object.freeze({ a: 1 / 4, L: 3 / 2, bound: 49999 / 50000 });
// Point certificate plus the report's proved L1 width-perturbation estimate.
// Decimal strings keep these exact rational endpoints out of floating-point gating.
export const NEARBY_WIDTH_WINDOW = Object.freeze({
  aMin: '0.24999998', aMax: '0.25000002', L: 3 / 2, bound: 99999 / 100000,
});
export const abs = ([re, im]) => Math.hypot(re, im);
export const multiply = ([a, b], [c, d]) => [a * c - b * d, a * d + b * c];
const finiteComplex = (z) => Array.isArray(z) && z.length === 2 && z.every(Number.isFinite);

export function divide(a, b) {
  if (!finiteComplex(a) || !finiteComplex(b) || abs(b) === 0) return null;
  const d = b[0] ** 2 + b[1] ** 2;
  return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d];
}

export function angularDimension(m) {
  if (!Number.isInteger(m) || m < 0 || m > 10000) throw new RangeError('Invalid harmonic index');
  return (2 * m + 1) ** 2;
}

export function angularMultiplier(w, m) {
  angularDimension(m);
  if (!finiteComplex(w)) return null;
  let b = [1, 0];
  for (let j = 1; j <= m; j++) {
    const factor = divide([w[0] - 2 * j, w[1]], [w[0] + 2 * j, w[1]]);
    if (!factor) return null;
    b = multiply(b, factor);
  }
  return b;
}

/**
 * Entire xi from NIST DLMF 25.5.13–14, multiplied by s(s-1)/2:
 * xi(s)=1/2 + s(s-1)/2 integral_0^infty omega(exp(u))
 *                           [exp(su/2)+exp((1-s)u/2)] du.
 * Integrate to log(16), n=1..4 in omega, composite Simpson.
 * No pole-times-zero cancellation at s=0 or 1; both give xi=1/2.
 * Domain deliberately bounded to avoid high-height cancellation. The coarse/fine
 * comparison is only a diagnostic, not a rigorous quadrature error enclosure.
 */
export function xiDiagnostic(s, steps = 1024) {
  if (!finiteComplex(s) || s[0] < -2 || s[0] > 7 || Math.abs(s[1]) > 20
    || !Number.isInteger(steps) || steps < 32 || steps > 8192 || steps % 2) return null;
  const h = Math.log(16) / steps;
  let re = 0, im = 0;
  for (let k = 0; k <= steps; k++) {
    const u = k * h;
    let omega = 0;
    for (let n = 1; n <= 4; n++) omega += Math.exp(-Math.PI * n * n * Math.exp(u));
    const p = Math.exp(s[0] * u / 2), q = Math.exp((1 - s[0]) * u / 2);
    const angle = s[1] * u / 2;
    const weight = (k === 0 || k === steps) ? 1 : (k % 2 ? 4 : 2);
    re += weight * omega * (p + q) * Math.cos(angle);
    im += weight * omega * (p - q) * Math.sin(angle);
  }
  const term = multiply(multiply(s, [s[0] - 1, s[1]]), [re * h / 6, im * h / 6]);
  return [0.5 + term[0], term[1]];
}

export function arithmeticDiagnostic(w, a) {
  if (!finiteComplex(w) || w[0] < 0 || w[0] > 4 || Math.abs(w[1]) > 20
    || !Number.isFinite(a) || a <= 0 || a > 1.5) {
    return { ok: false, reason: 'Outside the numerical display domain.' };
  }
  const numerator = [0.5 + w[0] - a, w[1]];
  const denominator = [0.5 + w[0] + a, w[1]];
  const n = xiDiagnostic(numerator), d = xiDiagnostic(denominator);
  const nc = xiDiagnostic(numerator, 512), dc = xiDiagnostic(denominator, 512);
  if (!n || !d || !nc || !dc || abs(d) < 1e-8 || abs(dc) < 1e-8) {
    return { ok: false, reason: 'Denominator is too small for this floating-point display.' };
  }
  const value = divide(n, d), coarse = divide(nc, dc);
  if (!value || !coarse) return { ok: false, reason: 'Ratio could not be evaluated safely.' };
  const discrepancy = Math.hypot(value[0] - coarse[0], value[1] - coarse[1]);
  if (!value.every(Number.isFinite) || discrepancy > 1e-5 * Math.max(1, abs(value))) {
    return { ok: false, reason: 'Quadrature consistency check failed; no value is displayed.' };
  }
  return { ok: true, value, magnitude: abs(value), discrepancy, certified: false };
}

/** Parse the literal input, preserving decimal precision for certificate gating. */
function decimalFraction(value) {
  if ((typeof value !== 'string' && typeof value !== 'number')
    || (typeof value === 'number' && !Number.isFinite(value))) return null;
  const text = String(value).trim();
  if (text.length > 96 || !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(text)) return null;
  const [mantissa, exponentText = '0'] = text.toLowerCase().split('e');
  const exponent = Number(exponentText);
  if (!Number.isInteger(exponent) || Math.abs(exponent) > 324) return null;
  const sign = mantissa.startsWith('-') ? -1n : 1n;
  const [whole, fractional = ''] = mantissa.replace(/^[+-]/, '').split('.');
  const digits = BigInt((whole || '0') + fractional);
  const scale = fractional.length - exponent;
  return {
    n: sign * digits * (scale < 0 ? 10n ** BigInt(-scale) : 1n),
    d: scale > 0 ? 10n ** BigInt(scale) : 1n,
    approximate: Number(text),
  };
}

const compare = (x, y) => x.n * y.d - y.n * x.d;
const zero = { n: 0n, d: 1n }, one = { n: 1n, d: 1n };
const quarter = { n: 1n, d: 4n }, threeHalves = { n: 3n, d: 2n };
const commonWindow = decimalFraction(String(COMMON_WINDOW_SAFE));
const nearbyWidthMin = decimalFraction(NEARBY_WIDTH_WINDOW.aMin);
const nearbyWidthMax = decimalFraction(NEARBY_WIDTH_WINDOW.aMax);

/** Exact decimal scope selection. No epsilon equality or extrapolation. */
export function windowEvidence(a, L) {
  const width = decimalFraction(a), endpoint = decimalFraction(L);
  if (!width || !endpoint || compare(width, zero) <= 0n || compare(endpoint, one) <= 0n
    || !Number.isFinite(width.approximate) || width.approximate <= 0) {
    return { kind: 'outside', bound: null, title: 'Choose finite decimal a > 0 and L > 1' };
  }
  if (compare(width, one) <= 0n && compare(endpoint, commonWindow) <= 0n) {
    return { kind: 'proved', method: 'analytic', bound: 2 ** -width.approximate, title: 'Analytical common-window bound', exact: '2^{-a}', gapLabel: '(1 − 2⁻ᵃ)' };
  }
  if (compare(width, quarter) === 0n && compare(endpoint, threeHalves) <= 0n) {
    return { kind: 'certified', method: 'point', bound: SIGNED_WINDOW.bound, title: 'Signed Fourier-tail certificate', exact: '\\frac{49999}{50000}', gapLabel: '1/50000' };
  }
  if (compare(width, nearbyWidthMin) >= 0n && compare(width, nearbyWidthMax) <= 0n
    && compare(endpoint, threeHalves) <= 0n) {
    return { kind: 'certified', method: 'width-perturbation', bound: NEARBY_WIDTH_WINDOW.bound,
      title: 'Certified point + analytic width perturbation', exact: '\\frac{99999}{100000}', gapLabel: '1/100000' };
  }
  return { kind: 'outside', bound: null, title: 'Outside the implemented contraction bounds' };
}
