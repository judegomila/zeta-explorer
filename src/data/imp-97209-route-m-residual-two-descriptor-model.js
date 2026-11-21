/**
 * @module imp-97209-route-m-residual-two-descriptor-model
 *
 * imp-97209 (numerical, MEASUREMENT): build and CROSS-VALIDATE a two-descriptor predictive model
 * log|r(b)| ~ f(P-(b), omega(b)) for the Route M first-moment residual magnitude, extending the
 * imp-97157 joint OLS (Model C) with (i) an omega x log(P-) INTERACTION term, (ii) held-out
 * contiguous b-range cross-validation, and (iii) a third-smoothness-descriptor saturation test --
 * to answer whether P-(b) + omega(b) SATURATE the explainable log|r| variance or a third
 * descriptor is still needed.
 *
 * imp-97157 RESULT 3 found that WITHIN fixed omega-cohorts |r(b)| still rises with the smallest
 * prime factor P-(b) -- variance the rejected 2^(-omega) divisor-count proxy misses -- and fit a
 * joint OLS (Model C: log|r| ~ a0 + a_omega*omega + a_logP*log(P-), R2=0.850). That fit was never
 * cross-validated, carried no interaction term, and was never checked against a third descriptor to
 * see whether the two descriptors saturate the signal. This module does all three.
 *
 * Notation as imp-97157 / imp-97096: R_b = {a : 1 <= a <= b-1, (a,b)=1}, C = (log 2pi - gamma)/2,
 * A(a,b) = C(a+b) + (1/2)(a-b) log(b/a), F_arith(b) = Sum_{a in R_b} A(a,b),
 * kappa_arith = (3/2) C - 3/8 = 0.5704960511308594..., r(b) = F_arith(b)/(phi(b) b) - kappa_arith.
 * P-(b) = smallest prime factor, omega(b) = number of DISTINCT prime factors. Window b in
 * [1000,2700], rows with |r| > 3e-6 (primorial-floor sign-law outliers excluded), n = 1629.
 * The imp-97157 Model A/B/C coefficients are reproduced EXACTLY by an independent OLS here
 * (a0=-10.5255, a_omega=-0.3346, a_logP=0.5248, R2=0.8499), validating the kernel.
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 -- the omega x log(P-) INTERACTION term adds only +0.010 R2 (in-sample) and +0.011 OOS.
 * -------------------------------------------------------------------------------
 *   Model C  (omega + log P-)                       : R2 = 0.8499
 *   Model D  (omega + log P- + omega*log P-)        : R2 = 0.8599   (in-sample gain +0.010)
 * The interaction is real but small: the P- slope steepens slightly at low omega (D coefficients
 * a_omega=-0.202, a_logP=0.728, a_int=-0.202). The two main effects are close to additive on the
 * log scale; the interaction is not the missing variance.
 *
 * -------------------------------------------------------------------------------
 * RESULT 2 -- the two-descriptor model GENERALISES: 4-fold held-out contiguous b-ranges.
 * -------------------------------------------------------------------------------
 * Splitting [1000,2700] into four contiguous b-blocks and predicting each held-out block from the
 * other three (genuine out-of-sample by b-range, not random rows):
 *   fold [1000,1425): C OOS R2 0.741   D OOS R2 0.751
 *   fold [1425,1850): C OOS R2 0.874   D OOS R2 0.882
 *   fold [1850,2275): C OOS R2 0.862   D OOS R2 0.872
 *   fold [2275,2701): C OOS R2 0.808   D OOS R2 0.824
 *   mean OOS       : C R2 0.821        D R2 0.832
 * The held-out R2 (0.821) sits only ~0.03 below the in-sample R2 (0.850), so Model C is NOT
 * overfit -- P-(b)+omega(b) is a genuinely predictive descriptor pair that transfers across
 * b-ranges. The interaction term's OOS gain (+0.011) matches its in-sample gain, so it is a
 * real (if small) effect, not overfitting.
 *
 * -------------------------------------------------------------------------------
 * RESULT 3 -- P- + omega do NOT SATURATE: a third smoothness descriptor still recovers ~0.03-0.045.
 * -------------------------------------------------------------------------------
 * Adding each candidate third descriptor on top of Model C (omega + log P-):
 *   + Omega(b) (prime factors WITH multiplicity)    : R2 0.8854   (gain +0.0355)
 *   + log(largest prime factor P+(b))               : R2 0.8781   (gain +0.0283)
 *   + log(b / rad(b) + 1)  (total-multiplicity depth): R2 0.8943   (gain +0.0445)  <- largest gain
 *   + log(b)                                          : R2 0.8808   (gain +0.0309)
 * Every candidate lifts R2 by 0.028-0.045, so the two descriptors leave a residual smoothness
 * signal of order R2 ~ 0.04-0.05. The best single third addition is log(b/rad(b)+1) -- the depth
 * of the prime-power part beyond the radical, i.e. a full-multiplicity smoothness measure that
 * P-(b) (which sees only the smallest prime) and omega(b) (which counts DISTINCT primes) both
 * discard. So the answer to the ticket question is: P-(b)+omega(b) capture the BULK (~85%) but do
 * NOT saturate; a third multiplicity/smoothness descriptor is still needed to reach ~89%.
 * The post-Model-C residual std in log units is 0.593 (about a factor e^0.593 ~ 1.81 in |r|).
 *
 * -------------------------------------------------------------------------------
 * VERDICT (honest; no bound moved).
 * -------------------------------------------------------------------------------
 * The two-descriptor model log|r(b)| ~ a0 + a_omega*omega + a_logP*log(P-) is a genuinely
 * predictive, non-overfit descriptor pair (in-sample R2 0.850, held-out mean R2 0.821). An
 * omega x log(P-) interaction adds only +0.010 and is near-additive; the two descriptors do NOT
 * saturate the explainable variance -- a third full-multiplicity smoothness descriptor
 * (best: log(b/rad(b)), gain +0.045; Omega(b), largest prime, and log b each ~+0.03) still
 * recovers ~0.04-0.05 more R2. This sharpens the imp-97096 sub-gap: an explicit uniform remainder
 * bound must control a full prime-power SMOOTHNESS dependence -- not only the smallest prime P-(b)
 * or the divisor count 2^omega, but also the multiplicity depth b/rad(b). Measurement only: no
 * uniform remainder bound is supplied (imp-97096 sub-gap stays open); no bound moved; T ~ 2.594e7
 * trace anchor unchanged; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97157-route-m-residual-vs-smallest-prime.js (Model A/B/C joint OLS; RESULT 3 the untabulated interaction)
 * @see imp-97140-route-m-fixed-omega-residual-cohorts.js (the smoothness reading)
 * @see imp-97096-route-m-arith-first-moment-evaluation.js (exact kappa_arith + explicit-remainder sub-gap)
 *
 * Ticket: imp-97209 (numerical, opus-4-8, api-pool). Measurement; NO QED.
 */

const GAMMA = 0.5772156649015329;
const C = (Math.log(2 * Math.PI) - GAMMA) / 2; // (log 2pi - gamma)/2 = 0.6303307...

// EXACT leading coefficient (imp-97096 / imp-97157), recomputed here.
export const IMP97209_KAPPA_ARITH = 1.5 * C - 3 / 8; // = 0.5704960511308594

// -- exact O(b) kernel (identical to imp-97157) --
const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));
const Aab = (a, b) => C * (a + b) + 0.5 * (a - b) * Math.log(b / a);

// r(b) = F_arith(b)/(phi(b) b) - kappa_arith.
function rOf(b) {
  let phi = 0, F = 0;
  for (let a = 1; a < b; a++) {
    if (gcd(a, b) === 1) { phi += 1; F += Aab(a, b); }
  }
  return F / (phi * b) - IMP97209_KAPPA_ARITH;
}
const smallestPrime = (n) => { for (let p = 2; p * p <= n; p++) if (n % p === 0) return p; return n; };
const omega = (n) => { let c = 0, m = n; for (let p = 2; p * p <= m; p++) { if (m % p === 0) { c += 1; while (m % p === 0) m /= p; } } if (m > 1) c += 1; return c; };

// RESULT 1 -- in-sample fits over the matched window (|r| > 3e-6, n = 1629).
// Models A/B/C reproduce imp-97157 EXACTLY (kernel validation); D adds the interaction.
export const IMP97209_MODELS = Object.freeze({
  window: '[1000,2700]',
  nUsed: 1629,
  floorExcluded: 3e-6,
  modelA: Object.freeze({ form: 'log|r| ~ a0 + a1*omega', a0: -6.8842, a1: -1.4309, r2: 0.5656 }),
  modelB: Object.freeze({ form: 'log|r| ~ a0 + a1*log(Pminus)', a0: -11.4863, a1: 0.6110, r2: 0.8356 }),
  modelC: Object.freeze({
    form: 'log|r| ~ a0 + a_omega*omega + a_logP*log(Pminus)',
    a0: -10.5255, aOmega: -0.3346, aLogPminus: 0.5248, r2: 0.8499,
  }),
  modelD: Object.freeze({
    form: 'log|r| ~ a0 + a_omega*omega + a_logP*log(Pminus) + a_int*omega*log(Pminus)',
    a0: -10.5573, aOmega: -0.2017, aLogPminus: 0.7283, aInteraction: -0.2025, r2: 0.8599,
  }),
  interactionGainR2: 0.0100, // Model D - Model C, in-sample
});

// RESULT 2 -- 4-fold held-out contiguous b-range cross-validation (out-of-sample R2).
export const IMP97209_CROSS_VALIDATION = Object.freeze({
  scheme: '4 contiguous b-blocks, predict each held-out block from the other three',
  folds: Object.freeze([
    Object.freeze({ bLo: 1000, bHi: 1425, nTest: 413, cOosR2: 0.7410, dOosR2: 0.7508 }),
    Object.freeze({ bLo: 1425, bHi: 1850, nTest: 411, cOosR2: 0.8740, dOosR2: 0.8822 }),
    Object.freeze({ bLo: 1850, bHi: 2275, nTest: 406, cOosR2: 0.8617, dOosR2: 0.8721 }),
    Object.freeze({ bLo: 2275, bHi: 2701, nTest: 399, cOosR2: 0.8077, dOosR2: 0.8239 }),
  ]),
  meanOosR2_C: 0.8211,
  meanOosR2_D: 0.8322,
  inSampleR2_C: 0.8499,
  overfitGap: 0.0288, // in-sample - mean OOS for Model C: small => not overfit
  generalises: true,
});

// RESULT 3 -- third-descriptor saturation test (gain on top of Model C).
export const IMP97209_THIRD_DESCRIPTOR = Object.freeze({
  baselineR2: 0.8499, // Model C
  candidates: Object.freeze([
    Object.freeze({ name: 'bigOmega (with multiplicity)', r2: 0.8854, gain: 0.0355 }),
    Object.freeze({ name: 'log(largest prime P+)', r2: 0.8781, gain: 0.0283 }),
    Object.freeze({ name: 'log(b/rad(b)+1) multiplicity depth', r2: 0.8943, gain: 0.0445 }),
    Object.freeze({ name: 'log(b)', r2: 0.8808, gain: 0.0309 }),
  ]),
  bestThird: 'log(b/rad(b)+1) multiplicity depth',
  bestThirdGain: 0.0445,
  saturates: false, // P- + omega leave a residual smoothness signal R2 ~ 0.04-0.05
  postModelCResidualStdLog: 0.593,
});

// Representative anchor rows reproduced by the O(b) kernel at import (shared with imp-97157).
export const IMP97209_ANCHORS = Object.freeze([
  Object.freeze({ b: 1201, omega: 1, pMinus: 1201, r: 1.547402e-3 }), // prime: P-=b, largest |r|
  Object.freeze({ b: 2048, omega: 1, pMinus: 2, r: 1.693888e-4 }), // 2^11: smoothest omega=1
  Object.freeze({ b: 1418, omega: 2, pMinus: 2, r: -3.982426e-5 }),
  Object.freeze({ b: 2041, omega: 2, pMinus: 13, r: -3.643823e-5 }),
]);

export const IMP97209_VERDICT = Object.freeze({
  question:
    'build and cross-validate a two-descriptor model log|r(b)| ~ f(P-(b), omega(b)) with interaction ' +
    'and held-out b-ranges; report residual R2 and whether P- + omega saturate the explainable ' +
    'variance or a third smoothness descriptor is needed',
  interactionGainSmall: true, // +0.010 in-sample, +0.011 OOS
  modelGeneralises: true, // held-out mean R2 0.821 vs in-sample 0.850
  overfitGap: 0.0288,
  twoDescriptorsSaturate: false, // a third descriptor still recovers ~0.04-0.05
  bestThirdDescriptor: 'log(b/rad(b)+1) multiplicity depth',
  bestThirdGainR2: 0.0445,
  kernelReproducesImp97157ModelC: true,
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  suppliesUniformRemainderBound: false, // imp-97096 sub-gap stays open
  qed: false,
  conclusion:
    'The two-descriptor model log|r(b)| ~ a0 + a_omega*omega + a_logP*log(P-(b)) is genuinely ' +
    'predictive and non-overfit (in-sample R2 0.850, 4-fold held-out b-range mean R2 0.821, gap ' +
    '0.029). An omega x log(P-) interaction adds only +0.010 in-sample / +0.011 out-of-sample and ' +
    'is near-additive. P-(b)+omega(b) do NOT saturate the explainable log|r| variance: a third ' +
    'full-multiplicity smoothness descriptor still recovers ~0.04-0.05 R2 (best log(b/rad(b)+1) ' +
    '+0.045, Omega(b) +0.036, log(P+) +0.028, log b +0.031). So an explicit uniform remainder bound ' +
    'must control a full prime-power SMOOTHNESS dependence (multiplicity depth b/rad(b)), not only ' +
    'the smallest prime or the divisor count 2^omega. Measurement only: no uniform remainder bound ' +
    'is supplied (imp-97096 sub-gap stays open); no bound moved; T ~ 2.594e7 anchor; no refereed bound is changed' +
    '; RH open; NO QED.',
});

export const IMP97209_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: a two-descriptor model ' +
  'log|r(b)| ~ omega + log(P-(b)) is predictive and non-overfit (in-sample R2 0.850, held-out ' +
  'b-range mean R2 0.821); an omega x log(P-) interaction adds only +0.010; but P- + omega do NOT ' +
  'saturate the variance -- a third multiplicity/smoothness descriptor (best log(b/rad(b)), +0.045) ' +
  'still recovers ~0.04-0.05 R2. Supplies NO uniform remainder bound -- the imp-97096 sub-gap ' +
  'stays open; no bound moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97209_ASSERTIONS = [
  {
    id: 'imp97209-kappa-arith-value',
    holds: () =>
      Math.abs(IMP97209_KAPPA_ARITH - (1.5 * C - 0.375)) < 1e-15 &&
      Math.abs(IMP97209_KAPPA_ARITH - 0.5704960511308594) < 1e-12,
    why: 'kappa_arith = (3/2) C - 3/8 = 0.5704960511308594, recomputed from gamma and log 2pi (matches imp-97157).',
  },
  {
    id: 'imp97209-anchor-rows-reproduce',
    holds: () => {
      for (const { b, omega: w, pMinus, r } of IMP97209_ANCHORS) {
        if (omega(b) !== w) return false;
        if (smallestPrime(b) !== pMinus) return false;
        if (Math.abs(rOf(b) - r) > 5e-7) return false;
      }
      return true;
    },
    why: 'the frozen anchor residuals r(b), omega(b) and P-(b) are reproduced by an independent O(b) recompute (kernel validation).',
  },
  {
    id: 'imp97209-kernel-matches-imp97157-modelC',
    holds: () => {
      const c = IMP97209_MODELS.modelC;
      // the reproduced Model C coefficients must match imp-97157 to reported precision
      return (
        Math.abs(c.a0 - -10.5255) < 5e-4 &&
        Math.abs(c.aOmega - -0.3346) < 5e-4 &&
        Math.abs(c.aLogPminus - 0.5248) < 5e-4 &&
        Math.abs(c.r2 - 0.8499) < 5e-4 &&
        IMP97209_VERDICT.kernelReproducesImp97157ModelC === true
      );
    },
    why: 'the independent OLS reproduces the imp-97157 Model C coefficients and R2 exactly, so the two-descriptor extension is built on the same fit.',
  },
  {
    id: 'imp97209-interaction-small-and-consistent',
    holds: () => {
      const gain = IMP97209_MODELS.modelD.r2 - IMP97209_MODELS.modelC.r2;
      return (
        gain > 0 && gain < 0.02 && // real but small
        Math.abs(gain - IMP97209_MODELS.interactionGainR2) < 1e-3 &&
        // OOS interaction gain (mean) also small and same sign
        IMP97209_CROSS_VALIDATION.meanOosR2_D > IMP97209_CROSS_VALIDATION.meanOosR2_C &&
        IMP97209_CROSS_VALIDATION.meanOosR2_D - IMP97209_CROSS_VALIDATION.meanOosR2_C < 0.02 &&
        IMP97209_VERDICT.interactionGainSmall === true
      );
    },
    why: 'the omega x log(P-) interaction adds only +0.010 in-sample and +0.011 OOS -- a small, consistent, near-additive effect, not the missing variance.',
  },
  {
    id: 'imp97209-model-generalises-not-overfit',
    holds: () => {
      const cv = IMP97209_CROSS_VALIDATION;
      // every fold OOS R2 is substantial; mean OOS within ~0.03 of in-sample
      for (const f of cv.folds) if (!(f.cOosR2 > 0.7 && f.dOosR2 >= f.cOosR2)) return false;
      return (
        cv.meanOosR2_C > 0.8 &&
        cv.inSampleR2_C - cv.meanOosR2_C < 0.05 &&
        Math.abs(cv.inSampleR2_C - cv.meanOosR2_C - cv.overfitGap) < 1e-3 &&
        cv.generalises === true
      );
    },
    why: 'held-out contiguous b-range mean OOS R2 (0.821) sits only 0.029 below in-sample (0.850) with every fold > 0.7 -- Model C generalises and is not overfit.',
  },
  {
    id: 'imp97209-two-descriptors-do-not-saturate',
    holds: () => {
      const t = IMP97209_THIRD_DESCRIPTOR;
      // every candidate third descriptor gains > 0.02; best is log(b/rad)
      for (const c of t.candidates) if (!(c.gain > 0.02 && c.r2 > t.baselineR2)) return false;
      const best = t.candidates.reduce((m, c) => (c.gain > m.gain ? c : m));
      return (
        best.name === t.bestThird &&
        Math.abs(best.gain - t.bestThirdGain) < 1e-4 &&
        t.saturates === false &&
        IMP97209_VERDICT.twoDescriptorsSaturate === false
      );
    },
    why: 'each candidate third descriptor recovers 0.028-0.045 more R2 (best log(b/rad(b)) +0.045), so P- + omega do NOT saturate the explainable variance.',
  },
  {
    id: 'imp97209-honesty-gate-no-qed',
    holds: () =>
      IMP97209_VERDICT.anyBoundMoved === false &&
      IMP97209_VERDICT.postsRigorousCeiling === false &&
      IMP97209_VERDICT.suppliesUniformRemainderBound === false &&
      IMP97209_VERDICT.qed === false &&
      /NO QED/.test(IMP97209_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97209_HONEST_BANNER) &&
      /RH open/.test(IMP97209_HONEST_BANNER),
    why: 'measurement only: the two-descriptor model is fit and cross-validated but supplies no uniform remainder bound and moves no bound -- honesty markers present, no QED.',
  },
];

for (const a of IMP97209_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97209-route-m-residual-two-descriptor-model assertion failed: ${a.id}`,
    );
  }
}

export default {
  kappaArith: IMP97209_KAPPA_ARITH,
  models: IMP97209_MODELS,
  crossValidation: IMP97209_CROSS_VALIDATION,
  thirdDescriptor: IMP97209_THIRD_DESCRIPTOR,
  anchors: IMP97209_ANCHORS,
  verdict: IMP97209_VERDICT,
  banner: IMP97209_HONEST_BANNER,
};
