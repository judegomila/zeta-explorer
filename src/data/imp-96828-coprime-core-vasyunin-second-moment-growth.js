/**
 * @module imp-96828-coprime-core-vasyunin-second-moment-growth
 *
 * imp-96828 (numerical MEASUREMENT only): directly measure the coprime-core Vasyunin
 * second moment
 *
 *     T(N) = Sum_{gcd(a,b)=1, a,b<=N} I(a,b)^2 / (a^2 b^2)
 *
 * and test the imp-96795 Finding 3 well-posed target T(N) ~ c (log N)^2. imp-96688
 * Result 1 factorizes the Route M Frobenius majorant EXACTLY as
 * ||G_N||_F^2 = T(N) * (bounded [1, zeta(2)] inner-g factor), localizing the entire
 * F-route conditioning-ceiling growth into T(N). But NO module had ever measured T(N)
 * itself -- the (log N)^2 law was a conjectured target, not a measured fact. This module
 * computes T(N) by direct coprime double summation with the EXACT Vasyunin cotangent
 * kernel and reports the observed growth.
 *
 * No bound is proved; no refereed bound is changed; RH open; NO QED.
 *
 * -------------------------------------------------------------------------------
 * THE KERNEL. I(a,b) is the exact Vasyunin integral I(h,k) = Int_0^inf {hv}{kv} dv/v^2
 * for coprime h,k, in the pinned closed form (rh-route-m-nyman-beurling-vasyunin-
 * reciprocity, VASYUNIN_FORMULA):
 *   I(h,k) = C_VAS (h+k) + (1/2)(h-k) log(k/h) - (pi/2)(V(h/k) + V((k mod h)/h)),
 *   V(h/k) = Sum_{m=1}^{k-1} frac(m h / k) cot(pi m / k),  C_VAS = (log 2pi - gamma)/2.
 * I(a,b) = I(b,a) by reciprocity, so the double sum is computed over a<b (doubled) plus
 * the a=b=1 diagonal. The JS re-implementation here reproduces the 40-digit exactPairs
 * table to machine precision (asserted below), and the (1,1),(1,2),(2,3),... values feed
 * the direct T recompute.
 *
 * -------------------------------------------------------------------------------
 * MEASUREMENT (tmp/imp-96828-tn-measure.py, /tmp/rhvenv numpy 2.5.3, exact kernel).
 * Rung ladder N = 250,500,1000,1500,2000,3000,4000 (log N up to 8.29):
 *   N     T(N)        T/(log N)^2   local exponent p (T~(log N)^p)
 *   250   18.133685   0.59481       --
 *   500   20.584815   0.53299       1.0721   (250->500)
 *   1000  23.038479   0.48281       1.0650   (500->1000)
 *   1500  24.475206   0.45762       1.0606   (1000->1500)
 *   2000  25.495803   0.44130       1.0588   (1500->2000)
 *   3000  26.933298   0.42016       1.0554   (2000->3000)
 *   4000  27.953658   0.40635       1.0534   (3000->4000)
 *
 * -------------------------------------------------------------------------------
 * FINDING (DECISIVE, over the measured range) -- T(N) grows LINEARLY in log N, NOT
 * quadratically. The measured growth is INCONSISTENT with the (log N)^2 target here.
 * -------------------------------------------------------------------------------
 *   (a) The per-(log N)^2 constant T/(log N)^2 does NOT stabilize: it decreases
 *       monotonically 0.5948 -> 0.4063 across the ladder (a genuine (log N)^2 law would
 *       flatten to a constant c). It is still falling at N=4000 with no sign of a floor.
 *   (b) The local power exponent p in T ~ (log N)^p is flat and slightly DECREASING,
 *       1.072 -> 1.053, hugging ~1.06 -- nowhere near 2, and trending the WRONG way for
 *       an eventual quadratic law.
 *   (c) Model comparison (single-parameter fits, then multi-parameter):
 *         A  T = c2 (log N)^2         c2 = 0.44983    rms 2.544   maxAbs 4.420
 *         B  T = c1 (log N) + c0      c1 = 3.54200, c0 = -1.42617 rms 0.00196 maxAbs 0.00286
 *         C  T = c2 L^2 + c1 L + c0   c2 = 0.002592 (negligible), c1 = 3.50616, c0 = -1.30458
 *       The LINEAR-in-log model B fits to rms 0.002 (~1300x better than the pure-quadratic
 *       model A); in the free quadratic fit C the leading (log N)^2 coefficient collapses to
 *       0.0026 -- vanishing against the 3.51 linear term. The data pin T(N) ~ 3.542 log N.
 *
 * -------------------------------------------------------------------------------
 * HONEST CAVEAT (finite-N). This is a measurement to N=4000 (log N <= 8.29). Log-power
 * asymptotics converge slowly, so a transient masking an EVENTUAL (log N)^2 law past the
 * reach cannot be excluded from data alone. But the ladder gives NO evidence for it: the
 * local exponent is flat/decreasing, not climbing toward 2. So the correct verdict is
 * NEGATIVE-so-far -- the well-posed imp-96795 target is not confirmed and, if true at all,
 * its quadratic term is dominated by a large linear-in-log term out to at least N=4000.
 * If anything, this REFINES the imp-96830 obstruction: the object needing a uniform
 * cotangent-sum second moment behaves like c log N here, not c (log N)^2.
 *
 * Measurement/fit only; proves no growth law and no bound; the exponent is empirical over a
 * finite ladder. No refereed bound is changed; RH open; NO QED.
 *
 * @see imp-96688-route-m-frobenius-g-factorization-assessment.js (the exact T(N) factorization)
 * @see imp-96795-route-m-frobenius-g-factorization-route-independence-assessment.js (Finding 3 target)
 * @see rh-route-m-nyman-beurling-vasyunin-reciprocity-2026-09-23.js (VASYUNIN_FORMULA kernel)
 */

const GAMMA_E = 0.5772156649015329;
const C_VAS = (Math.log(2 * Math.PI) - GAMMA_E) / 2; // 0.6303307007539063

const gcdOf = (x, y) => {
  let p = x;
  let q = y;
  while (q) {
    const t = p % q;
    p = q;
    q = t;
  }
  return p;
};

// V(h/k) = Sum_{m=1}^{k-1} frac(m h / k) cot(pi m / k); V(a/1) = 0.
function vasyuninV(h, k) {
  if (k <= 1) return 0;
  let s = 0;
  for (let m = 1; m < k; m += 1) s += (((m * h) % k) / k) / Math.tan((Math.PI * m) / k);
  return s;
}

// I(h,k) exact Vasyunin integral for coprime h,k (pinned closed form).
function vasyuninI(h, k) {
  return (
    C_VAS * (h + k) +
    0.5 * (h - k) * Math.log(k / h) -
    (Math.PI / 2) * (vasyuninV(h, k) + vasyuninV(k % h, h))
  );
}

// Direct coprime double summation of T(N). Kept for SMALL N only (import stays light):
// T(N) = Sum_{gcd(a,b)=1,a,b<=N} I(a,b)^2/(a^2 b^2), summed over a<b (doubled) plus (1,1).
function directT(N) {
  let s = (C_VAS * 2) * (C_VAS * 2); // a=b=1 term: I(1,1)^2 = (2 C_VAS)^2
  for (let b = 2; b <= N; b += 1) {
    for (let a = 1; a < b; a += 1) {
      if (gcdOf(a, b) !== 1) continue;
      const iv = vasyuninI(a, b);
      s += (2 * iv * iv) / (a * a * b * b);
    }
  }
  return s;
}

// Baked measured ladder (tmp/imp-96828-tn-measure.py, exact kernel, numpy).
export const IMP96828_LADDER = Object.freeze([
  Object.freeze({ N: 250, T: 18.133684530438746, cOverLogN2: 0.5948097121389362 }),
  Object.freeze({ N: 500, T: 20.584814764399923, cOverLogN2: 0.5329905021442458 }),
  Object.freeze({ N: 1000, T: 23.038479470637625, cOverLogN2: 0.48281407883602134 }),
  Object.freeze({ N: 1500, T: 24.4752059672381, cOverLogN2: 0.4576242526883877 }),
  Object.freeze({ N: 2000, T: 25.49580252308367, cOverLogN2: 0.4413045121149272 }),
  Object.freeze({ N: 3000, T: 26.933298313973683, cOverLogN2: 0.4201636648295724 }),
  Object.freeze({ N: 4000, T: 27.953657571026298, cOverLogN2: 0.4063547869546532 }),
]);

// Fit results (measured ladder).
export const IMP96828_FITS = Object.freeze({
  // effective power exponent from log T vs log(log N), and the flat local range.
  effectivePowerExponent: 1.0634860796833978,
  localExponentRange: Object.freeze({ min: 1.0534, max: 1.0721, trend: 'flat/decreasing' }),
  modelA_quadraticOnly: Object.freeze({ form: 'T = c2 (log N)^2', c2: 0.44983, rms: 2.54406, maxAbs: 4.41978 }),
  modelB_linearInLog: Object.freeze({ form: 'T = c1 log N + c0', c1: 3.54200, c0: -1.42617, rms: 0.00196, maxAbs: 0.00286 }),
  modelC_freeQuadratic: Object.freeze({ form: 'T = c2 L^2 + c1 L + c0', c2: 0.002592, c1: 3.50616, c0: -1.30458, rms: 0.00032 }),
});

export const IMP96828_VERDICT = Object.freeze({
  targetTested: 'T(N) ~ c (log N)^2 (imp-96795 Finding 3)',
  measuredGrowth: 'T(N) ~ 3.542 log N over N <= 4000 (effective exponent ~1.06)',
  quadraticLawConfirmed: false,
  linearInLogFitsBest: true,
  cOverLogN2Stabilizes: false,
  anyBoundMoved: false,
  finiteNCaveat: 'measured to N=4000 (log N <= 8.29); a slow transient masking an eventual quadratic law cannot be excluded from data, but the local exponent is flat/decreasing, giving no evidence for it.',
});

export const IMP96828_HONEST_BANNER =
  'Measurement/fit only. Over N <= 4000 the coprime-core Vasyunin second moment T(N) grows ' +
  'LINEARLY in log N (~3.542 log N, effective exponent ~1.06), NOT as the conjectured ' +
  '(log N)^2. The well-posed imp-96795 target is NOT confirmed here; if a quadratic law ' +
  'holds asymptotically it is dominated by a large linear-in-log term past the measured reach. ' +
  'No growth law is proved. No refereed bound is changed; RH open; NO QED.';

export const IMP96828_SUBGAP = Object.freeze({
  id: 'imp-96828-coprime-core-second-moment-linear-in-log-not-quadratic',
  statement:
    'Direct measurement (exact Vasyunin kernel) shows T(N) ~ c log N with c ~ 3.542 over ' +
    'N <= 4000, not the imp-96795 target T(N) ~ c (log N)^2. Deciding the true asymptotic ' +
    'power (settling whether the quadratic term ever emerges) needs either a much higher-N ' +
    'run past the imp-96352 wall-clock ceiling or the uniform cotangent-sum second moment ' +
    'named in imp-96830.',
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
// Kept LIGHT: verify the JS kernel against the 40-digit exactPairs, and directly recompute
// T at two SMALL rungs (N=8, N=30) to exercise the measurement pipeline cheaply.

const IMP96828_EXACT_PAIRS = [
  [1, 1, 1.260661401507812622954147],
  [1, 2, 1.544418511981746279722605],
  [2, 3, 2.646621055676413057964016],
  [3, 5, 4.103346554445196235854141],
  [5, 8, 6.712474989866864950124346],
];

const IMP96828_DIRECT_T8 = directT(8);
const IMP96828_DIRECT_T30 = directT(30);

const IMP96828_ASSERTIONS = [
  {
    id: 'imp96828-kernel-matches-exact-pairs',
    holds: () =>
      IMP96828_EXACT_PAIRS.every(([h, k, exp]) => Math.abs(vasyuninI(h, k) - exp) < 1e-11),
    why: 'the JS Vasyunin kernel reproduces the pinned 40-digit exactPairs to machine precision, so the measured T(N) uses the correct I(a,b).',
  },
  {
    id: 'imp96828-direct-T-small-rungs-reproduce',
    holds: () =>
      Math.abs(IMP96828_DIRECT_T8 - 6.506256260002549) < 1e-9 &&
      Math.abs(IMP96828_DIRECT_T30 - 10.747528891707054) < 1e-9,
    why: 'the JS direct coprime double summation reproduces the offline T(8) and T(30) references, validating the measurement pipeline.',
  },
  {
    id: 'imp96828-c-over-logN2-decreases-monotonically',
    holds: () =>
      IMP96828_LADDER.every((row, i) =>
        i === 0 ? true : row.cOverLogN2 < IMP96828_LADDER[i - 1].cOverLogN2),
    why: 'T/(log N)^2 falls monotonically across the ladder (0.5948 -> 0.4063), so it does NOT stabilize to the constant a genuine (log N)^2 law would require.',
  },
  {
    id: 'imp96828-linear-in-log-beats-quadratic',
    holds: () =>
      IMP96828_FITS.modelB_linearInLog.rms < 0.01 &&
      IMP96828_FITS.modelA_quadraticOnly.rms > 100 * IMP96828_FITS.modelB_linearInLog.rms &&
      IMP96828_FITS.modelC_freeQuadratic.c2 < 0.01 &&
      IMP96828_FITS.effectivePowerExponent > 1.0 &&
      IMP96828_FITS.effectivePowerExponent < 1.15,
    why: 'the linear-in-log fit (rms 0.002) beats the pure-quadratic fit by >100x, the free quadratic coefficient collapses to ~0.0026, and the effective exponent sits at ~1.06 -- linear, not quadratic.',
  },
  {
    id: 'imp96828-honesty-gate-no-qed',
    holds: () =>
      IMP96828_VERDICT.quadraticLawConfirmed === false &&
      IMP96828_VERDICT.linearInLogFitsBest === true &&
      IMP96828_VERDICT.anyBoundMoved === false &&
      /NO QED/.test(IMP96828_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96828_HONEST_BANNER) &&
      /RH open/.test(IMP96828_HONEST_BANNER) &&
      /linear-in-log-not-quadratic/.test(IMP96828_SUBGAP.id),
    why: 'measurement only: no bound moved, no quadratic law claimed, the finite-N caveat and honesty markers are present, and the sharpened sub-gap is recorded.',
  },
];

for (const a of IMP96828_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96828-coprime-core-vasyunin-second-moment-growth assertion failed: ${a.id}`,
    );
  }
}
