/** Run with Node 24: node scripts/verify-sign-switching.mjs */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  SIGN_SWITCHING_PROVENANCE,
  collisionF, collisionW, collisionWOverX, collisionL1, collisionRoots,
  collisionState, negativeHalfDisk, inNegativeHalfDisk,
  localShear, continuousShear, firstModal,
  polynomialKernel, boundaryKernelStatus,
  parityEnergiesFromKernel, polynomialParityEnergies,
  bridgeMeasure, bridgeWeightMoments, omega,
  normalizedSignedMargin, simpsonIntegrateSamples, simpsonIntegrate,
  polynomialBridgeExact, modelEnergies,
} from '../src/math/sign-switching.js';

let checks = 0;
function check(condition, message) {
  assert.ok(condition, message);
  checks++;
}
function close(actual, expected, tolerance = 2e-12, message = '') {
  assert.ok(Number.isFinite(actual) && Number.isFinite(expected), `${message}: nonfinite comparison`);
  assert.ok(Math.abs(actual - expected) <= tolerance * Math.max(1, Math.abs(expected)),
    `${message}: ${actual} versus ${expected}`);
  checks++;
}
function rejects(fn, message) {
  assert.throws(fn, message);
  checks++;
}

// This regression links three separate views of the same collision, including
// the strict open negative set and the distinction W=0 versus (W/x)<0 on x=0.
for (const epsilon of [-0.125, 0, 0.125]) {
  const state = collisionState(epsilon);
  const roots = collisionRoots(epsilon);
  for (const root of roots) {
    const value = collisionF(root.x, root.y, epsilon);
    close(value.re, 0, 2e-15, 'root substitution, real part');
    close(value.im, 0, 2e-15, 'root substitution, imaginary part');
  }
  if (epsilon < 0) {
    close(state.radius, 0.5);
    check(state.negativeInterval.open, 'modal interval must be open');
    close(state.negativeInterval.min, -0.5);
    close(state.negativeInterval.max, 0.5);
    check(roots.every(root => root.y === 0 && root.x !== 0), 'negative epsilon moves roots off the imaginary axis');
    check(collisionL1(0, epsilon) < 0, 'modal diameter is negative');
    close(collisionL1(0.5, epsilon), 0, 0, 'modal diameter endpoint');
    close(collisionW(0, 0, epsilon), 0, 0, 'actual W vanishes on x=0');
    check(collisionWOverX(0, 0, epsilon) < 0, 'continuous W/x detects the diameter');
    check(inNegativeHalfDisk(0.25, 0, epsilon), 'open half-disk interior');
    check(!inNegativeHalfDisk(0, 0, epsilon), 'diameter is excluded from the W<0 half-disk');
    check(!inNegativeHalfDisk(0.5, 0, epsilon), 'semicircle boundary is excluded');
    close(collisionW(0.5, 0, epsilon), 0, 0, 'semicircle shear is zero');
    check(collisionW(0.75, 0, epsilon) > 0, 'outside half-disk is positive');
  } else {
    check(state.negativeInterval === null && !negativeHalfDisk(epsilon).exists, 'negative set disappears at contact');
    check(!inNegativeHalfDisk(0.1, 0, epsilon), 'no negative half-disk at or after contact');
    if (epsilon === 0) {
      check(roots.length === 1 && roots[0].multiplicity === 2, 'contact is a double root');
      close(collisionL1(0, epsilon), 0, 0);
    } else {
      check(roots.every(root => root.x === 0 && root.y !== 0), 'positive epsilon gives two axis roots');
      check(collisionL1(0, epsilon) > 0, 'modal first mode is positive after contact');
    }
  }
}
close(localShear(-0.125, 0.25, 0.1), collisionW(0.25, 0.1, -0.125));
close(continuousShear(-0.125, 0, 0.1), collisionWOverX(0, 0.1, -0.125));
close(firstModal(-0.125, 0.1), collisionL1(0.1, -0.125));
// An irrational radius must not acquire a negative boundary sign from squared
// cancellation: the helpers use the factored form at the computed contour.
const irrationalRadius = negativeHalfDisk(-0.1).radius;
check(!inNegativeHalfDisk(irrationalRadius, 0, -0.1), 'irrational circle radius is excluded');
close(collisionW(irrationalRadius, 0, -0.1), 0, 0, 'factored circle boundary');
close(collisionL1(irrationalRadius, -0.1), 0, 0, 'factored diameter endpoint');

// Kernel polarization, complex Hermitian symmetry, and the positivity boundary.
const zw = polynomialKernel({ re: 1, im: 2 }, { re: -0.5, im: 0.3 }, 1, -0.25);
const wz = polynomialKernel({ re: -0.5, im: 0.3 }, { re: 1, im: 2 }, 1, -0.25);
close(zw.re, wz.re); close(zw.im, -wz.im);
check(boundaryKernelStatus(1, -0.5).positiveSemidefinite, 'semidefinite threshold is included');
check(!boundaryKernelStatus(1, -0.5001).positiveSemidefinite, 'invalid boundary is flagged');
for (const [t, r, epsilon] of [[0, 0.2, -0.25], [0.4, 0.7, 0.1], [-0.3, 1.2, -0.5]]) {
  const energies = polynomialParityEnergies(t, r, 1, epsilon);
  close(energies.even, 2 * t * t + 2 + 4 * epsilon);
  close(energies.odd, 2 * r * r);
  close(energies.difference, polynomialKernel(t - r, t + r, 1, epsilon).re);
}
const invalid = parityEnergiesFromKernel(1, 1, 2);
close(invalid.even, 1.5); close(invalid.odd, -0.5);
check(!invalid.nonnegativeEnergies && invalid.margin === 2, 'negative energy is retained, not clipped');

// Simpson is exact for cubics and preserves a negative integral.
close(simpsonIntegrate(x => x ** 3, 0, 2, 8), 4, 1e-14, 'Simpson cubic');
close(simpsonIntegrate(x => -2 + x, 0, 1, 10), -1.5, 1e-14, 'signed Simpson integral');
close(simpsonIntegrateSamples([0, 0.25, 1], 0.5), 1 / 3, 1e-14);
rejects(() => simpsonIntegrateSamples([0, 1, 2, 3], 1), 'odd interval count');
rejects(() => simpsonIntegrate(() => 1, 0, 1, 3), 'odd interval count via function');
rejects(() => simpsonIntegrateSamples([0, NaN, 1], 1), 'nonfinite sample');
rejects(() => simpsonIntegrateSamples([0, 1, 2], 0), 'zero sample step');

// Half-line normalization and moments, not a whole-line convention. The wide
// finite interval makes the omitted tail negligible at the stated tolerances;
// these numerical regression tolerances are not an interval error certificate.
for (const [a, h] of [[1, 0], [1, 1e-9], [1, 0.35], [1, 0.9], [0.5, 0.2]]) {
  const exact = bridgeWeightMoments(a, h);
  const upper = 16 * a;
  const intervals = 32768;
  const mass = simpsonIntegrate(r => omega(a, h, r), 0, upper, intervals);
  const second = simpsonIntegrate(r => r * r * omega(a, h, r), 0, upper, intervals);
  const fourth = simpsonIntegrate(r => r ** 4 * omega(a, h, r), 0, upper, intervals);
  close(mass, exact.mass, 2e-10, `weight mass a=${a}, h=${h}`);
  close(second, exact.second, 2e-10, `weight second moment a=${a}, h=${h}`);
  close(fourth, exact.fourth, 2e-10, `weight fourth moment a=${a}, h=${h}`);
}
for (const r of [0, 1e-8, 0.1, 1, 10]) {
  close(omega(1, 1e-10, r), omega(1, 0, r), 2e-13, 'removable h=0 limit');
  const u = Math.PI * r / 2;
  const directLimit = Math.PI ** 2 * r / 2 / Math.cosh(u) ** 2 * Math.tanh(u);
  close(omega(1, 0, r), directLimit, 2e-13, 'analytic h=0 density');
}
check(Number.isFinite(omega(1, 1 - 1e-10, 1e-10)), 'near-endpoint density is finite off endpoint');
close(omega(1, 0, 1000), 0, 0, 'tail underflow is handled');
check(bridgeMeasure(1, 1).kind === 'point-mass', 'h=a is a point mass');
check(bridgeMeasure(1, 1).endpoint, 'endpoint flag');
close(bridgeWeightMoments(1, 1).second, 0, 0);
rejects(() => omega(1, 1, 0), 'delta is not a density');

// Decisive counterexample: the a=1 boundary kernel is PSD, but the exact
// reconstructed target at h=0.1 is negative for epsilon=-1/4.
const parameters = { a: 1, h: 0.1, epsilon: -0.25, t: 0 };
const exact = polynomialBridgeExact(parameters);
check(exact.boundaryPositiveSemidefinite, 'starting boundary kernel is PSD');
check(exact.even >= 0 && exact.odd >= 0, 'both parity energies are nonnegative');
check(exact.difference < 0, 'odd energy can exceed even energy');
close(exact.even, 1); close(exact.odd, 1.98); close(exact.direct, -0.98);
close(exact.difference, collisionWOverX(parameters.h, parameters.t, parameters.epsilon));
close(exact.direct * parameters.h, collisionW(parameters.h, parameters.t, parameters.epsilon));
close(modelEnergies(parameters).margin, -0.98 / 2.98);
const integral = simpsonIntegrate(r => {
  const energies = polynomialParityEnergies(parameters.t, r, parameters.a, parameters.epsilon);
  return omega(parameters.a, parameters.h, r) * energies.difference;
}, 0, 16, 32768);
close(integral, exact.direct, 2e-10, 'signed bridge reconstruction');
for (const epsilon of [-0.125, 0, 0.125]) {
  const e = modelEnergies({ a: 1, h: 0, epsilon, t: 0 });
  close(e.direct, firstModal(epsilon, 0) / 2, 2e-14, 'diameter and bridge switch together');
}
const endpoint = modelEnergies({ a: 1, h: 1, epsilon: -0.25, t: 0.3 });
check(endpoint.endpoint && endpoint.measure === 'point-mass', 'endpoint is exact evaluation');
close(endpoint.odd, 0, 0); close(endpoint.difference, endpoint.direct);
const zeroTotal = modelEnergies({ a: 1, h: 1, epsilon: -0.5, t: 0 });
check(zeroTotal.margin === null, 'zero energy has no normalized margin');
close(normalizedSignedMargin(1, 3), -0.5, 0);
rejects(() => normalizedSignedMargin(0, 0), 'undefined zero-energy margin');
rejects(() => normalizedSignedMargin(Infinity, 1), 'nonfinite energy');

for (const bad of [NaN, Infinity, -Infinity]) {
  rejects(() => collisionState(bad), 'nonfinite collision parameter');
  rejects(() => collisionF(bad, 0, 0), 'nonfinite coordinate');
  rejects(() => omega(1, 0, bad), 'nonfinite bridge coordinate');
}
rejects(() => omega(0, 0, 1), 'a must be positive');
rejects(() => omega(1, -0.1, 1), 'negative h');
rejects(() => omega(1, 1.1, 1), 'h exceeds a');
rejects(() => omega(1, 0.5, -1), 'negative half-line coordinate');
rejects(() => parityEnergiesFromKernel({ re: 1, im: 0.1 }, 1, 0), 'nonreal Hermitian diagonal');
check(SIGN_SWITCHING_PROVENANCE.rhStatus.includes('No claim'), 'scope must remain explicit');

// Cross-language regression: the app recomputes these cumulative sums with its
// JavaScript weight, while the saved targets were computed independently with
// mpmath. This catches density-domain/factor errors and invalid benchmark data.
const xiData = JSON.parse(readFileSync(new URL('../src/data/sign-switching-xi.json', import.meta.url), 'utf8'));
check(xiData.a === 0.5 && xiData.cases.length === 8, 'expected Xi boundary and height set');
for (const benchmark of xiData.cases) {
  check(benchmark.normalizer > 0 && Number.isFinite(benchmark.normalizer), 'positive finite normalization');
  check(benchmark.estimates.length === 8, 'all eight shifts are present');
  for (const estimate of benchmark.estimates) {
    for (const key of ['even', 'odd', 'difference', 'direct', 'identityResidual', 'quadratureChange', 'weightMass', 'margin']) {
      check(Number.isFinite(estimate[key]), `${benchmark.id}: finite ${key}`);
    }
    check(estimate.even >= 0 && estimate.odd >= 0, 'parity energies are nonnegative');
    close(estimate.difference, estimate.direct, 1e-12, 'independent direct Xi comparison');
    if (estimate.endpoint) {
      close(estimate.h, xiData.a, 0);
      close(estimate.even, 1, 0);
      close(estimate.odd, 0, 0);
      continue;
    }
    let even = 0, odd = 0;
    benchmark.boundary.r.forEach((r, i) => {
      const weight = benchmark.boundary.quadratureWeights[i] * omega(xiData.a, estimate.h, r);
      even += weight * benchmark.boundary.even[i];
      odd += weight * benchmark.boundary.odd[i];
    });
    close(even, estimate.even, 1e-12, 'browser even sum versus mpmath');
    close(odd, estimate.odd, 1e-12, 'browser odd sum versus mpmath');
  }
}

console.log(`sign-switching: ${checks} checks passed (exact model, bridge moments, signed counterexample, Xi benchmarks, domain guards).`);
console.log('Finite quadrature checks are numerical regressions, not RH or interval certificates.');
