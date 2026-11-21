/**
 * @module imp-97211-route-m-positivity-crossover-measured-vs-worstcase
 *
 * imp-97211 (accuracy, CROSS-VALIDATION -- no bound moves): the imp-97159 crossover leaf and the
 * imp-97158 sharpness leaf were never combined. imp-97159 DERIVED the positivity crossover b0 above
 * which the Route M first-moment lower bound F_arith(b) >= (kappa_arith - eps(b)) phi(b) b has a
 * strictly-positive leading coefficient, using the imp-97133 WORST-CASE remainder constant
 *     eps_worst(b) = (1/2) 2^omega(b) (log b + 3) / phi(b)      [imp-97133 Corollary / imp-97159].
 * imp-97158 independently MEASURED that this triangle-bound constant is sharp only on the PRIMES
 * (saturation ratio -> 1/4) and orders too large on prime powers and primorials (mu-cancellation the
 * triangle bound discards). This leaf recomputes the crossover using the MEASURED remainder in place of
 * the worst-case constant and reports how far the guaranteed-positive threshold b0 moves.
 *
 * Notation as imp-97133/imp-97159: C = (log 2pi - gamma)/2, kappa_arith = (3/2) C - 3/8 =
 * 0.5704960511308594..., omega(b) = number of distinct primes of b, phi = Euler totient, and (the EXACT
 * identity of imp-97133 Corollary)
 *     F_arith(b) = kappa_arith phi(b) b + (1/2)(b E0(b) - E1(b)),
 * with E0, E1 the actual L0, L1 remainders (E0 = L0 - phi(log b - 1), E1 = L1 - phi b((1/2)log b - 1/4)).
 *
 * -------------------------------------------------------------------------------
 * THE CROSS-VALIDATION.
 * -------------------------------------------------------------------------------
 * The worst-case eps of imp-97159 bounds the actual remainder ratio
 *     eps_meas(b) = (1/2) |b E0(b) - E1(b)| / (phi(b) b)
 * by eps_worst(b) = (1/2) 2^omega(b)(log b + 3)/phi(b). The crossover is the last b at which the ratio
 * still reaches kappa_arith. Using eps_worst that last exceedance is b = 510 (b0_exact = 511, the
 * imp-97159 sharp threshold; b0_envelope = 574 from the primorial envelope). Using the MEASURED remainder:
 *
 *   -- eps_meas(b) NEVER reaches kappa_arith for any b >= 2. Its maximum over b in [2, 30030] is
 *      eps_meas(2) = 0.201713 (margin 0.368783 below kappa_arith = 0.570496), and the top values sit on
 *      the smallest PRIMES (b=2: 0.2017, b=3: 0.1581, b=5: 0.1142, b=7: 0.0913), exactly imp-97158s
 *      "E0 saturated only on primes (ratio -> 1/4)" -- the measured ratio is a small prime phenomenon.
 *   -- Hence the MEASURED guaranteed-positive threshold is b0_meas = 2: F_arith(b) > 0 for EVERY b >= 2.
 *      The worst-case threshold b0_exact = 511 collapses all the way to 2 -- the ENTIRE finite vacuous
 *      range [2, 510] of imp-97133/imp-97159 is an artifact of the 2^omega triangle bound, not of the
 *      first moment.
 *
 * -------------------------------------------------------------------------------
 * WHY THE THRESHOLD COLLAPSES: the binding worst-case moduli are the loosest measured ones.
 * -------------------------------------------------------------------------------
 * imp-97159s crossover is pinned by the small highly-composite moduli (last exceedance b=510 = 2*3*5*17,
 * omega=4; the primorial P_4 = 210 has eps_worst = 1.391 >> kappa). These are EXACTLY the moduli where
 * imp-97158 measured the deepest mu-cancellation: the worst-case-to-measured ratio eps_worst/eps_meas is
 *     b=210: 42298x,   b=2310: 335472x,   b=30030: 205517x,
 * so the moduli that force b0 up to 511 in the worst case clear kappa by four-to-five orders of magnitude
 * in reality. The worst-case crossover is therefore driven entirely by the class where the triangle bound
 * is least tight; the measured remainder has no crossover at all (its own maximum, on the small primes,
 * is already 2.8x below kappa).
 *
 * -------------------------------------------------------------------------------
 * VERDICT (measurement only; nothing moves).
 * -------------------------------------------------------------------------------
 * Combining the two leaves: the imp-97159 guaranteed-positive threshold b0 = 511 (worst case) drops to
 * b0 = 2 when the imp-97158 measured remainder is used -- the whole finite exceptional set [2, 510] is a
 * 2^omega triangle-bound artifact, and the true F_arith(b) is strictly positive for every b >= 2. This is
 * a consistency check across the two leaves; it changes NO bound and PROVES nothing new (the measured
 * eps_meas has no rigorous uniform upper bound -- proving one is the imp-97133 uniform-O(1/b) residual).
 * The positivity remains of the EXPLICIT arithmetic first moment, NOT kappa > 0 in the mean-square lower
 * companion ([[project_route_m_lower_companion_first_moment]]); the cotangent first moment (imp-97097)
 * stays open. No bound on Lambda moves; T ~ 2.594e7 trace anchor unchanged; no refereed bound is changed; RH
 * open; NO QED.
 *
 * @see imp-97159-route-m-arith-first-moment-positivity-crossover.js (the worst-case crossover this checks)
 * @see imp-97158-route-m-theorem1-remainder-sharpness.js (the measured remainder sharpness this uses)
 * @see imp-97133-route-m-arith-first-moment-explicit-remainder.js (the exact identity + worst-case eps)
 *
 * Ticket: imp-97211 (accuracy, opus-4-8, api-pool). Cross-validation combining two leaves; NO QED.
 */

const GAMMA = 0.5772156649015329;
const C = (Math.log(2 * Math.PI) - GAMMA) / 2; // (log 2pi - gamma)/2

// EXACT leading coefficient (self-contained; matches imp-97133/imp-97158/imp-97159).
export const IMP97211_KAPPA_ARITH = 1.5 * C - 3 / 8; // = 0.5704960511308594

// -- self-contained exact O(b) kernel (matches imp-97133/imp-97158) --
const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));
function omega(b) {
  let n = b, c = 0;
  for (let p = 2; p * p <= n; p++) {
    if (n % p === 0) { c += 1; while (n % p === 0) n /= p; }
  }
  if (n > 1) c += 1;
  return c;
}
function measure(b) {
  let phi = 0, L0 = 0, L1 = 0;
  for (let a = 1; a < b; a++) {
    if (gcd(a, b) === 1) { phi += 1; const la = Math.log(a); L0 += la; L1 += a * la; }
  }
  const E0 = L0 - phi * (Math.log(b) - 1);
  const E1 = L1 - phi * b * (0.5 * Math.log(b) - 0.25);
  return { phi, E0, E1 };
}
// worst-case eps (imp-97159): eps_worst(b) = (1/2) 2^omega(b)(log b + 3)/phi(b).
const epsWorst = (b) => { const { phi } = measure(b); return 0.5 * Math.pow(2, omega(b)) * (Math.log(b) + 3) / phi; };
// MEASURED eps: (1/2)|b E0 - E1|/(phi b), the actual remainder ratio (imp-97158 sharpness).
const epsMeas = (b) => { const { phi, E0, E1 } = measure(b); return 0.5 * Math.abs(b * E0 - E1) / (phi * b); };

export const IMP97211_MEASURE = Object.freeze({ omega, measure, epsWorst, epsMeas });

export const IMP97211_CROSSOVER = Object.freeze({
  kappaArith: IMP97211_KAPPA_ARITH,
  // worst-case (imp-97159): last exceedance b=510, sharp threshold b0=511, envelope threshold b0=574.
  worstCase: { lastExceedanceB: 510, b0Exact: 511, b0Envelope: 574, epsAt510: 0.5772 },
  // MEASURED: eps_meas never reaches kappa; max on the smallest primes; threshold collapses to b=2.
  measured: {
    lastExceedanceB: 1,         // none in [2, 30030]
    b0Meas: 2,                  // F_arith(b) > 0 for every b >= 2
    maxEpsMeas: 0.201713,       // over b in [2, 30030]
    maxEpsMeasAtB: 2,           // smallest prime; top values are all small primes
    marginBelowKappa: 0.368783, // kappa_arith - maxEpsMeas
  },
  // the moduli that force b0=511 in the worst case are the loosest measured ones (imp-97158 mu-cancellation).
  bindingModuliWorstToMeasRatio: [
    { b: 210, ratio: 42298 },
    { b: 2310, ratio: 335472 },
    { b: 30030, ratio: 205517 },
  ],
  b0MoveWorstToMeasured: '511 -> 2 (entire finite vacuous range [2,510] is a 2^omega triangle-bound artifact)',
});

export const IMP97211_VERDICT = Object.freeze({
  question:
    'recompute the imp-97159 first-moment positivity crossover b0 using the imp-97158 MEASURED (sharper) L0/L1 ' +
    'remainder instead of the imp-97133 worst-case constant, and report how far the guaranteed-positive threshold moves',
  worstCaseB0: 511,           // imp-97159 sharp threshold
  measuredB0: 2,              // F_arith(b) > 0 for every b >= 2 with the true remainder
  measuredEpsEverExceedsKappa: false, // eps_meas < kappa_arith for all b >= 2 (max 0.2017 at b=2)
  vacuousRangeIsTriangleArtifact: true, // [2,510] is entirely an artifact of the 2^omega bound
  bindingWorstCaseModuliAreLoosestMeasured: true, // primorials: worst/meas ratio ~4e4..3e5 (imp-97158 mu-cancellation)
  positivityIsFirstMomentNotMeanSquare: true,
  cotangentLeafSeparate: true,
  provesUniformBound: false,  // eps_meas has no rigorous uniform upper bound (imp-97133 residual)
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  qed: false,
  conclusion:
    'Combining imp-97159 (worst-case crossover) and imp-97158 (measured sharpness): the guaranteed-positive ' +
    'threshold b0 collapses from 511 (worst case, last exceedance eps_worst(510)=0.577) to 2 when the true ' +
    'remainder ratio eps_meas(b) = (1/2)|b E0 - E1|/(phi b) is used -- eps_meas never reaches kappa_arith ' +
    '(max 0.2017 at b=2, on the smallest primes, margin 0.369). The entire finite vacuous set [2,510] of ' +
    'imp-97133/imp-97159 is a 2^omega triangle-bound artifact: the small primorials that pin b0 (b=210,510) ' +
    'are exactly where imp-97158 measured the deepest mu-cancellation (worst/measured ratio ~4e4..3e5), so ' +
    'they clear kappa by orders in reality. This is a consistency check; it PROVES no uniform bound (that is ' +
    'the imp-97133 residual) and moves nothing. Positivity is of the EXPLICIT first moment, NOT kappa>0 in the ' +
    'mean-square companion; the cotangent first moment (imp-97097) stays open. No bound moved; T ~ 2.594e7 ' +
    'anchor; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97211_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Cross-validation combining two leaves: the imp-97159 ' +
  'worst-case positivity crossover b0 = 511 collapses to b0 = 2 when the imp-97158 measured remainder ratio ' +
  'eps_meas(b) = (1/2)|b E0 - E1|/(phi b) is used -- eps_meas never reaches kappa_arith (max 0.2017 at b=2), ' +
  'so the finite vacuous range [2,510] is a 2^omega triangle-bound artifact. Measurement only; proves no ' +
  'uniform bound (imp-97133 residual); no bound moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97211_ASSERTIONS = [
  {
    id: 'imp97211-kappa-arith-value',
    holds: () =>
      Math.abs(IMP97211_KAPPA_ARITH - (1.5 * C - 0.375)) < 1e-15 &&
      Math.abs(IMP97211_KAPPA_ARITH - 0.5704960511308594) < 1e-12,
    why: 'kappa_arith = (3/2) C - 3/8 = 0.5704960511308594, recomputed self-containedly (matches imp-97133/97158/97159).',
  },
  {
    id: 'imp97211-worstcase-crossover-reproduces-511',
    holds: () => {
      // eps_worst reproduces the imp-97159 sharp crossover: last exceedance b=510, clean [511, 30030].
      if (!(epsWorst(510) >= IMP97211_KAPPA_ARITH)) return false;
      for (let b = 511; b <= 30030; b++) if (epsWorst(b) >= IMP97211_KAPPA_ARITH) return false;
      return true;
    },
    why: 'the worst-case eps_worst(b) = (1/2) 2^omega(log b+3)/phi has its last exceedance at b=510 and is < kappa on [511, 30030] -- reproducing the imp-97159 sharp threshold b0=511.',
  },
  {
    id: 'imp97211-measured-eps-never-reaches-kappa',
    holds: () => {
      // eps_meas(b) < kappa_arith for EVERY b in [2, 30030]: measured threshold collapses to b0=2.
      let mx = 0, mxb = 0;
      for (let b = 2; b <= 30030; b++) { const e = epsMeas(b); if (e >= IMP97211_KAPPA_ARITH) return false; if (e > mx) { mx = e; mxb = b; } }
      return mxb === 2 && Math.abs(mx - 0.201713) < 5e-6;
    },
    why: 'the measured remainder ratio eps_meas(b) < kappa_arith for all b in [2, 30030], with maximum 0.201713 at b=2 -- so the guaranteed-positive threshold with the true remainder is b0=2 (F_arith > 0 for every b >= 2).',
  },
  {
    id: 'imp97211-measured-max-is-on-small-primes',
    holds: () =>
      // top measured ratios sit on the smallest primes (imp-97158: E0 saturated only on primes).
      epsMeas(2) > epsMeas(3) && epsMeas(3) > epsMeas(5) && epsMeas(5) > epsMeas(7) &&
      epsMeas(2) < IMP97211_KAPPA_ARITH,
    why: 'eps_meas is largest on the smallest primes (b=2 > 3 > 5 > 7), matching imp-97158s finding that the L0 remainder saturates only on primes; even the b=2 maximum is 2.8x below kappa_arith.',
  },
  {
    id: 'imp97211-binding-moduli-are-loosest-measured',
    holds: () => {
      // the moduli that pin the worst-case crossover (primorials) clear kappa by orders in the measurement.
      for (const b of [210, 2310, 30030]) {
        if (!(epsWorst(b) / epsMeas(b) > 1e4)) return false; // >10000x looser
      }
      // and the worst-case last-exceedance modulus 510 has measured ratio far below kappa.
      return epsMeas(510) < 0.01 && epsWorst(510) >= IMP97211_KAPPA_ARITH;
    },
    why: 'the primorials 210/2310/30030 that force the worst-case crossover up to b0=511 are >10000x looser in the measured remainder (imp-97158 mu-cancellation), and the last-exceedance modulus 510 has eps_meas < 0.01 while eps_worst >= kappa -- the collapse is driven by the loosest triangle-bound class.',
  },
  {
    id: 'imp97211-honesty-gate-no-qed',
    holds: () =>
      IMP97211_VERDICT.anyBoundMoved === false &&
      IMP97211_VERDICT.postsRigorousCeiling === false &&
      IMP97211_VERDICT.qed === false &&
      IMP97211_VERDICT.provesUniformBound === false &&
      IMP97211_VERDICT.worstCaseB0 === 511 &&
      IMP97211_VERDICT.measuredB0 === 2 &&
      IMP97211_VERDICT.positivityIsFirstMomentNotMeanSquare === true &&
      /NOT kappa>0 in the mean-square/.test(IMP97211_VERDICT.conclusion) &&
      /NO QED/.test(IMP97211_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97211_HONEST_BANNER) &&
      /RH open/.test(IMP97211_HONEST_BANNER),
    why: 'cross-validation combining two leaves (worst-case b0=511 vs measured b0=2), honest that it proves no uniform bound and moves nothing, and that the positivity is first-moment not mean-square -- no bound moved, no rigorous ceiling, no QED.',
  },
];

for (const a of IMP97211_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97211-route-m-positivity-crossover-measured-vs-worstcase assertion failed: ${a.id}`,
    );
  }
}

export default {
  kappaArith: IMP97211_KAPPA_ARITH,
  crossover: IMP97211_CROSSOVER,
  measure: IMP97211_MEASURE,
  verdict: IMP97211_VERDICT,
  banner: IMP97211_HONEST_BANNER,
};
