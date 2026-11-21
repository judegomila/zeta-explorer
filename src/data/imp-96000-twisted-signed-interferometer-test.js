/**
 * @module imp-96000-twisted-signed-interferometer-test
 * @fileoverview imp-96000 -- Novel route C (rh-novel-routes-roadmap-2026-09-23) first test:
 *   on a small modulus q=5 form the signed superposition F(s) = Sum_k eps_k L(s, chi_k),
 *   optimize the sign design {eps_k} in {+1,-1}^4 to minimize the off-line magnitude
 *   relative to the on-line magnitude, and test whether any sign pattern yields a
 *   NONVANISHING off-line lower bound (which would be a zero-free region -> RH if uniform).
 *
 *   CONSTRUCTION
 *   ------------
 *   Modulus q=5, cyclic group (Z/5)* with generator g=2. The four Dirichlet characters
 *   chi_k (k=0..3) are chi_k(2^j) = exp(2 pi i k j / 4). Each L-function is evaluated by
 *     L(s, chi_k) = q^{-s} Sum_{a=1}^{q-1} chi_k(a) Hurwitz(s, a/q),
 *   with Hurwitz zeta computed by Euler-Maclaurin (N=24 head terms, 5 Bernoulli corrections).
 *   Sanity: L(2, chi_0) = 1.57913670 matches (1 - 5^{-2}) zeta(2) exactly to 8 digits.
 *   The signed interferometer is F(s) = Sum_k eps_k L(s, chi_k), eps_k in {+1,-1}; the
 *   global sign is fixed by eps_0 = +1, leaving 8 distinct patterns.
 *
 *   MEASURED RESULT (tmp/imp-96000-scratch.mjs, tmp/imp-96000-refine.mjs, 2026-09-23)
 *   --------------------------------------------------------------------------------
 *   For every one of the 8 sign patterns, scanning the half-strip sigma in [0.52, 0.95],
 *   t in [1, 40], the off-line minimum of |F| is TINY relative to the on-line maximum:
 *   the best-case ratio offMin/onMax is 2.86e-2 (the all-plus pattern) and the other
 *   seven patterns sit at 1.8e-3 .. 4.5e-3. The mixed pattern eps=[1,-1,1,1] drives |F|
 *   to a genuine OFF-LINE ZERO: local refinement pins |F| = 1.85e-11 at
 *   sigma = 0.939518, t = 29.571077, i.e. delta = sigma - 1/2 = 0.439518 -- deep inside
 *   the strip, far from the critical line. This is the classical DAVENPORT-HEILBRONN
 *   phenomenon: a finite linear combination of L-functions satisfies a functional
 *   equation yet has zeros off sigma=1/2. Character orthogonality (the large-sieve
 *   mechanism the roadmap hoped for) does NOT confine the combined zeros to the line for
 *   a fixed finite signed superposition.
 *
 *   VERDICT: NO-GO for the fixed finite signed interferometer. No sign/weight design
 *   {eps_k} gives a nonvanishing off-line lower bound: the combination acquires its own
 *   off-line zeros (Davenport-Heilbronn), so |F| is not bounded away from 0 off the line.
 *
 *   SUB-GAP (honest scope)
 *   ----------------------
 *   imp-96000-uniform-family-averaging: this tests FIXED finite sign patterns on one small
 *   modulus (q=5, four characters, real signs). Route C's large-sieve intuition lives in a
 *   MODULUS-AVERAGED / q -> infinity family with continuous complex weights and a spectral
 *   (not pointwise-cancellation) accounting; the Davenport-Heilbronn no-go refutes the naive
 *   finite fixed-weight interferometer but does not settle whether an averaged family kernel
 *   with growing q can suppress off-line mass. Measurement/optimization only; no bound; NO QED.
 *
 * @see rh-novel-routes-roadmap-2026-09-23.js (route C firstTest)
 * @see imp-95998-primon-reflection-gram-psd-test (route A NO-GO, same roadmap)
 *
 * Ticket: imp-96000 (numerical, medium). Measurement/optimization only; no bound moved; NO QED; no refereed bound is changed.
 */

// Per-sign-pattern scan of the half-strip sigma in [0.52,0.95], t in [1,40] (measured).
// onMin/onMax = min/max |F| on the critical line sigma=1/2; offMin = grid-min |F| off-line;
// ratio = offMin/onMax; offAt = grid location of the off-line minimum.
const PATTERN_SCAN = Object.freeze([
  Object.freeze({ eps: [1, 1, 1, 1], onMin: 3.599e-1, onMax: 8.4610e+0, offMin: 2.420e-1, ratio: 2.860e-2, offAtSig: 0.54, offAtT: 30.05 }),
  Object.freeze({ eps: [1, -1, 1, 1], onMin: 4.831e-1, onMax: 6.0860e+0, offMin: 1.072e-2, ratio: 1.761e-3, offAtSig: 0.94, offAtT: 29.57 }),
  Object.freeze({ eps: [1, 1, -1, 1], onMin: 2.246e-1, onMax: 6.7570e+0, offMin: 1.631e-2, ratio: 2.414e-3, offAtSig: 0.76, offAtT: 4.41 }),
  Object.freeze({ eps: [1, -1, -1, 1], onMin: 9.813e-2, onMax: 6.8680e+0, offMin: 1.336e-2, ratio: 1.945e-3, offAtSig: 0.86, offAtT: 27.32 }),
  Object.freeze({ eps: [1, 1, 1, -1], onMin: 1.972e-1, onMax: 7.6950e+0, offMin: 2.480e-2, ratio: 3.223e-3, offAtSig: 0.9, offAtT: 15.63 }),
  Object.freeze({ eps: [1, -1, 1, -1], onMin: 1.509e-1, onMax: 4.9320e+0, offMin: 1.746e-2, ratio: 3.540e-3, offAtSig: 0.56, offAtT: 18.45 }),
  Object.freeze({ eps: [1, 1, -1, -1], onMin: 6.161e-1, onMax: 5.6090e+0, offMin: 2.510e-2, ratio: 4.475e-3, offAtSig: 0.9, offAtT: 18.84 }),
  Object.freeze({ eps: [1, -1, -1, -1], onMin: 2.096e-1, onMax: 7.6560e+0, offMin: 2.026e-2, ratio: 2.646e-3, offAtSig: 0.64, offAtT: 26.55 }),
]);

// Refined genuine off-line zero (Davenport-Heilbronn) for the eps=[1,-1,1,1] design.
const OFFLINE_ZERO = Object.freeze({
  eps: [1, -1, 1, 1],
  sigma: 0.939518,
  t: 29.571077,
  delta: 0.439518, // sigma - 1/2, deep off the critical line
  magnitudeF: 1.8486e-11, // |F| at the refined point (machine-limited)
});

export const IMP96000_TWISTED_SIGNED_INTERFEROMETER_TEST = Object.freeze({
  id: 'imp-96000',
  proofSection: 'S-frontier',
  tests: 'rh-novel-routes-roadmap-2026-09-23 route C (twisted-ladder signed interferometer)',
  measuredAt: '2026-09-23',
  modulus: 5,
  numCharacters: 4,
  construction:
    'Signed superposition F(s) = Sum_k eps_k L(s, chi_k) on modulus q=5 (four Dirichlet ' +
    'characters, cyclic generator g=2); L evaluated via q^{-s} Sum_a chi_k(a) Hurwitz(s, a/q), ' +
    'Hurwitz zeta by Euler-Maclaurin. Sign design {eps_k} in {+1,-1}^4, global sign fixed eps_0=+1.',
  patternScan: PATTERN_SCAN,
  bestDesignRatio: 2.860e-2, // best (largest) offMin/onMax over all patterns -- still not bounded away from 0
  offlineZero: OFFLINE_ZERO,
  offlineNonvanishingCertificate: false,
  goNoGo: 'NO-GO',
  verdict:
    'NO-GO for the fixed finite signed interferometer. Across all 8 sign patterns the off-line ' +
    'minimum of |F| is tiny relative to the on-line maximum (best ratio 2.86e-2, the rest ' +
    '1.8e-3..4.5e-3), and the mixed design eps=[1,-1,1,1] drives |F| to a genuine OFF-LINE ZERO ' +
    'at sigma=0.939518, t=29.571077 (|F|=1.85e-11) -- the classical Davenport-Heilbronn ' +
    'phenomenon. Character orthogonality does NOT confine the combined zeros to sigma=1/2 for a ' +
    'fixed finite superposition, so no sign/weight design yields a nonvanishing off-line lower ' +
    'bound. Measurement/optimization only; no bound moved; NO QED. No refereed bound is changed.',
  subGap:
    'imp-96000-uniform-family-averaging: only FIXED finite real sign patterns on one small ' +
    'modulus (q=5) were tested. Route C large-sieve intuition lives in a modulus-averaged / ' +
    'q -> infinity family with continuous complex weights and spectral accounting; the ' +
    'Davenport-Heilbronn no-go refutes the naive finite fixed-weight interferometer but does ' +
    'not settle the averaged-family kernel.',
  citation:
    'tmp/imp-96000-scratch.mjs (8 sign patterns, half-strip scan sigma in [0.52,0.95] x ' +
    't in [1,40], 401x22 grid) and tmp/imp-96000-refine.mjs (local minimization pinning the ' +
    'off-line zero to |F|=1.85e-11); rh-novel-routes-roadmap-2026-09-23.js route C firstTest.',
});

export default IMP96000_TWISTED_SIGNED_INTERFEROMETER_TEST;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96000_TWISTED_SIGNED_INTERFEROMETER_TEST_ASSERTIONS = [
  {
    id: 'imp96000-offline-zero-is-off-the-line',
    why: 'The measured off-line zero must sit well off sigma=1/2 with |F| driven to ~0 (Davenport-Heilbronn signal).',
    holds: () =>
      IMP96000_TWISTED_SIGNED_INTERFEROMETER_TEST.offlineZero.delta > 0.4 &&
      Math.abs(
        IMP96000_TWISTED_SIGNED_INTERFEROMETER_TEST.offlineZero.delta -
          (IMP96000_TWISTED_SIGNED_INTERFEROMETER_TEST.offlineZero.sigma - 0.5),
      ) < 1e-9 &&
      IMP96000_TWISTED_SIGNED_INTERFEROMETER_TEST.offlineZero.magnitudeF < 1e-8,
  },
  {
    id: 'imp96000-no-offline-nonvanishing-certificate',
    why: 'No sign pattern gives a nonvanishing off-line lower bound: every pattern has a small off-line minimum and the go/no-go is NO-GO.',
    holds: () =>
      IMP96000_TWISTED_SIGNED_INTERFEROMETER_TEST.offlineNonvanishingCertificate === false &&
      IMP96000_TWISTED_SIGNED_INTERFEROMETER_TEST.goNoGo === 'NO-GO' &&
      IMP96000_TWISTED_SIGNED_INTERFEROMETER_TEST.patternScan.length === 8 &&
      IMP96000_TWISTED_SIGNED_INTERFEROMETER_TEST.patternScan.every((r) => r.ratio < 0.1),
  },
  {
    id: 'imp96000-honesty-gate-no-qed',
    why: 'Measurement only: sub-gap named, NO QED, no-refereed-bound-change line present, route C recorded as tested.',
    holds: () =>
      /uniform-family-averaging/.test(IMP96000_TWISTED_SIGNED_INTERFEROMETER_TEST.subGap) &&
      /NO QED/.test(IMP96000_TWISTED_SIGNED_INTERFEROMETER_TEST.verdict) &&
      /refereed bound is changed/i.test(IMP96000_TWISTED_SIGNED_INTERFEROMETER_TEST.verdict) &&
      /route C/.test(IMP96000_TWISTED_SIGNED_INTERFEROMETER_TEST.tests),
  },
];

for (const assertion of IMP96000_TWISTED_SIGNED_INTERFEROMETER_TEST_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-96000-twisted-signed-interferometer-test assertion failed: ${assertion.id}`);
  }
}
