/**
 * @module imp-96849-coprime-core-vasyunin-second-moment-ladder-extension
 *
 * imp-96849 (numerical MEASUREMENT only): EXTEND the imp-96828 coprime-core Vasyunin
 * second-moment ladder
 *
 *     T(N) = Sum_{gcd(a,b)=1, a,b<=N} I(a,b)^2 / (a^2 b^2)
 *
 * past N=4000 to test whether the imp-96828 measured LINEAR-in-log fit T ~ 3.542 log N
 * is a transient masking an EVENTUAL (log N)^2 law (the imp-96795 Finding 3 target).
 * imp-96828 pinned the linear-in-log reading only to N=4000 (log N <= 8.29) and flagged
 * the honest finite-N caveat that log-power asymptotics converge slowly. This module runs
 * the identical EXACT Vasyunin cotangent kernel out to N=8000 (log N = 8.99) and measures
 * whether the local exponent stays flat near 1.05 or begins climbing toward 2.
 *
 * No bound is proved; no refereed bound is changed; RH open; NO QED.
 *
 * -------------------------------------------------------------------------------
 * THE KERNEL (unchanged from imp-96828, rh-route-m-nyman-beurling-vasyunin-reciprocity):
 *   I(h,k) = C_VAS (h+k) + (1/2)(h-k) log(k/h) - (pi/2)(V(h/k) + V((k mod h)/h)),
 *   V(h/k) = Sum_{m=1}^{k-1} frac(m h / k) cot(pi m / k),  C_VAS = (log 2pi - gamma)/2.
 * I(a,b) = I(b,a) by reciprocity; the double sum runs over a<b (doubled) plus the (1,1)
 * diagonal. The JS kernel here reproduces the 40-digit exactPairs to machine precision.
 *
 * -------------------------------------------------------------------------------
 * MEASUREMENT (tmp/imp-96849-tn-extend.py, /tmp/rhvenv numpy, exact kernel, 534 s).
 * Extended rung ladder N = 250 .. 8000 (log N up to 8.987). New rungs 5000, 6000, 8000
 * appended to the imp-96828 ladder (identical values on the shared rungs, so the two
 * runs are the SAME computation continued):
 *   N     T(N)        T/(log N)^2   T/(log N)   local exponent p (T~(log N)^p)
 *   250   18.133685   0.59481       3.28422     --
 *   500   20.584815   0.53299       3.31233     1.0721 (250->500)
 *   1000  23.038479   0.48281       3.33516     1.0650 (500->1000)
 *   1500  24.475206   0.45762       3.34671     1.0606 (1000->1500)
 *   2000  25.495803   0.44130       3.35431     1.0588 (1500->2000)
 *   3000  26.933298   0.42016       3.36398     1.0554 (2000->3000)
 *   4000  27.953658   0.40635       3.37033     1.0534 (3000->4000)
 *   5000  28.745645   0.39626       3.37501     1.0523 (4000->5000)
 *   6000  29.392342   0.38837       3.37862     1.0504 (5000->6000)
 *   8000  30.413312   0.37654       3.38407     1.0496 (6000->8000)
 *
 * -------------------------------------------------------------------------------
 * FINDING (TIGHTENED over the extended range) -- the linear-in-log reading STRENGTHENS;
 * still NO evidence for an eventual (log N)^2 law.
 * -------------------------------------------------------------------------------
 *   (a) The local power exponent p in T ~ (log N)^p keeps DECREASING monotonically across
 *       every new rung, 1.0534 -> 1.0523 -> 1.0504 -> 1.0496, hugging ~1.05 and trending
 *       the WRONG way for a quadratic law -- it must climb toward 2, it is instead falling.
 *   (b) The linear-in-log slope dT/d(log N) stays FLAT at ~3.547-3.549 on every new pair
 *       (3000->4000: 3.5468, 4000->5000: 3.5492, 5000->6000: 3.5470, 6000->8000: 3.5490),
 *       pinning T(N) ~ 3.544 log N with no upward drift.
 *   (c) T/(log N)^2 continues to fall (0.4064 at N=4000 -> 0.3765 at N=8000) with no floor,
 *       so it still does NOT stabilize to the constant a genuine (log N)^2 law demands.
 *   (d) Global fits over the full 10-rung extended ladder:
 *         A  T = c2 (log N)^2        c2 = 0.41998    rms 2.896    maxAbs 5.330
 *         B  T = c1 log N + c0       c1 = 3.54361, c0 = -1.43685  rms 0.00243 maxAbs 0.00465
 *         C  T = c2 L^2 + c1 L + c0  c2 = 0.002230 (negligible), c1 = 3.51105, c0 = -1.32081
 *       The linear-in-log model B fits to rms 0.0024 (~1193x better than the pure-quadratic
 *       model A); in the free quadratic fit C the leading (log N)^2 coefficient stays
 *       collapsed at 0.0022 -- vanishing against the 3.51 linear term, exactly as at N=4000.
 *
 * -------------------------------------------------------------------------------
 * VERDICT. Extending the reach by a factor of 2 in N (from log N = 8.29 to 8.99) did NOT
 * expose any transient toward a quadratic law: the local exponent is still flat/decreasing
 * (now measured to be below 1.05), the linear slope is still pinned at ~3.544, and the free
 * quadratic coefficient is still negligible. The imp-96828 NEGATIVE-so-far reading is
 * therefore TIGHTENED, not overturned. The finite-N caveat necessarily survives (any log-power
 * law converges slowly; an eventual quadratic emergence past N=8000 still cannot be excluded
 * from data alone), but the extra octave supplies additional evidence AGAINST it.
 *
 * Measurement/fit only; proves no growth law and no bound; the exponent is empirical over a
 * finite ladder. No refereed bound is changed; RH open; NO QED.
 *
 * @see imp-96828-coprime-core-vasyunin-second-moment-growth.js (the N<=4000 ladder + kernel)
 * @see imp-96795-route-m-frobenius-g-factorization-route-independence-assessment.js (Finding 3 target)
 * @see imp-96830 (the coupled weighted two-argument second moment named as the residual)
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

// Direct coprime double summation of T(N). Kept for SMALL N only (import stays light).
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

// Baked extended ladder (tmp/imp-96849-tn-extend.py, exact kernel, numpy, N up to 8000).
// Shared rungs (N<=4000) equal the imp-96828 values exactly (same computation continued).
export const IMP96849_LADDER = Object.freeze([
  Object.freeze({ N: 250, T: 18.133684530438746, cOverLogN2: 0.5948097121389362, cOverLogN: 3.284218579140029, pLocal: null }),
  Object.freeze({ N: 500, T: 20.584814764399923, cOverLogN2: 0.5329905021442458, cOverLogN: 3.3123270910077403, pLocal: 1.0720635020840568 }),
  Object.freeze({ N: 1000, T: 23.038479470637625, cOverLogN2: 0.48281407883602134, cOverLogN: 3.335161501846424, pLocal: 1.0649704856015296 }),
  Object.freeze({ N: 1500, T: 24.4752059672381, cOverLogN2: 0.4576242526883877, cOverLogN: 3.3467070143876807, pLocal: 1.0605862267917698 }),
  Object.freeze({ N: 2000, T: 25.49580252308367, cOverLogN2: 0.4413045121149272, cOverLogN: 3.3543125515413688, pLocal: 1.058832897533134 }),
  Object.freeze({ N: 3000, T: 26.933298313973683, cOverLogN2: 0.4201636648295724, cOverLogN: 3.3639847391965567, pLocal: 1.0554040509032496 }),
  Object.freeze({ N: 4000, T: 27.953657571026298, cOverLogN2: 0.4063547869546532, cOverLogN: 3.370326774494978, pLocal: 1.0533551574263094 }),
  Object.freeze({ N: 5000, T: 28.74564468367076, cOverLogN2: 0.39625892460929585, cOverLogN: 3.375013814720215, pLocal: 1.052346161527306 }),
  Object.freeze({ N: 6000, T: 29.392342087785263, cOverLogN2: 0.38836862386909177, cOverLogN: 3.3786185710912604, pLocal: 1.0504004481804772 }),
  Object.freeze({ N: 8000, T: 30.41331169260389, cOverLogN2: 0.37654354507047444, cOverLogN: 3.3840709510981566, pLocal: 1.0495635896020008 }),
]);

// Fit results over the full 10-rung extended ladder.
export const IMP96849_FITS = Object.freeze({
  effectivePowerExponent: 1.0609393831429057, // log T vs log(log N), full ladder
  localExponentRange: Object.freeze({ min: 1.0495635896020008, max: 1.0720635020840568, trend: 'flat/decreasing' }),
  modelA_quadraticOnly: Object.freeze({ form: 'T = c2 (log N)^2', c2: 0.41998, rms: 2.89639, maxAbs: 5.32995 }),
  modelB_linearInLog: Object.freeze({ form: 'T = c1 log N + c0', c1: 3.54361, c0: -1.43685, rms: 0.00243, maxAbs: 0.00465 }),
  modelC_freeQuadratic: Object.freeze({ form: 'T = c2 L^2 + c1 L + c0', c2: 0.002230, c1: 3.51105, c0: -1.32081, rms: 0.000413 }),
  linearSlopeNewPairs: Object.freeze({ min: 3.546829485607369, max: 3.5492269795834637 }), // dT/dlogN on rungs past 4000
  reachLogN: 8.987196820661973, // N=8000
});

export const IMP96849_VERDICT = Object.freeze({
  targetTested: 'T(N) ~ c (log N)^2 (imp-96795 Finding 3); is the imp-96828 linear reading a transient?',
  extendedFrom: 4000,
  extendedTo: 8000,
  measuredGrowth: 'T(N) ~ 3.544 log N over N <= 8000 (effective exponent ~1.06, local exponent falling below 1.05)',
  quadraticLawConfirmed: false,
  linearInLogFitsBest: true,
  localExponentClimbingTowardTwo: false,
  cOverLogN2Stabilizes: false,
  anyBoundMoved: false,
  finiteNCaveat: 'measured to N=8000 (log N <= 8.99); an eventual quadratic emergence past the reach still cannot be excluded from data, but doubling N gave MORE evidence against it (local exponent kept falling, linear slope stayed pinned at ~3.544).',
});

export const IMP96849_HONEST_BANNER =
  'Measurement/fit only. Extending the coprime-core Vasyunin second moment T(N) from N=4000 ' +
  'to N=8000 (log N 8.29 -> 8.99) TIGHTENS the imp-96828 linear-in-log reading: T(N) ~ 3.544 log N, ' +
  'local exponent flat/decreasing (now below 1.05, trending away from 2), free-quadratic leading ' +
  'coefficient still collapsed to ~0.0022. The imp-96795 (log N)^2 target is NOT confirmed; the ' +
  'finite-N caveat survives but the extra octave adds evidence against an eventual quadratic law. ' +
  'No growth law is proved. No refereed bound is changed; RH open; NO QED.';

export const IMP96849_SUBGAP = Object.freeze({
  id: 'imp-96849-coprime-core-second-moment-linear-in-log-persists-to-N8000',
  statement:
    'The extended exact-kernel ladder shows T(N) ~ 3.544 log N persisting to N=8000 with a local ' +
    'exponent falling below 1.05, so the imp-96795 quadratic target remains unconfirmed and the ' +
    'linear-in-log reading is strengthened. Settling the true asymptotic power once and for all ' +
    'still needs either an O(N^3) run far past the imp-96352 wall-clock ceiling or the uniform ' +
    'coupled weighted two-argument cotangent-sum second moment named in imp-96830.',
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
// Kept LIGHT: verify the JS kernel against the 40-digit exactPairs, directly recompute T at
// two SMALL rungs, and check the extension monotonicity / no-quadratic conclusions.

const IMP96849_EXACT_PAIRS = [
  [1, 1, 1.260661401507812622954147],
  [1, 2, 1.544418511981746279722605],
  [2, 3, 2.646621055676413057964016],
  [3, 5, 4.103346554445196235854141],
  [5, 8, 6.712474989866864950124346],
];

const IMP96849_DIRECT_T8 = directT(8);
const IMP96849_DIRECT_T30 = directT(30);

const IMP96849_ASSERTIONS = [
  {
    id: 'imp96849-kernel-matches-exact-pairs',
    holds: () =>
      IMP96849_EXACT_PAIRS.every(([h, k, exp]) => Math.abs(vasyuninI(h, k) - exp) < 1e-11),
    why: 'the JS Vasyunin kernel reproduces the pinned 40-digit exactPairs to machine precision, so the extended T(N) uses the correct I(a,b).',
  },
  {
    id: 'imp96849-direct-T-small-rungs-reproduce',
    holds: () =>
      Math.abs(IMP96849_DIRECT_T8 - 6.506256260002549) < 1e-9 &&
      Math.abs(IMP96849_DIRECT_T30 - 10.747528891707054) < 1e-9,
    why: 'the JS direct coprime double summation reproduces the imp-96828 T(8) and T(30) references, validating the measurement pipeline used for the extension.',
  },
  {
    id: 'imp96849-shared-rungs-match-imp96828',
    holds: () =>
      Math.abs(IMP96849_LADDER[6].T - 27.953657571026298) < 1e-12 &&
      IMP96849_LADDER[6].N === 4000,
    why: 'the N=4000 rung equals the imp-96828 value exactly, so the extension is the SAME computation continued past the prior reach.',
  },
  {
    id: 'imp96849-local-exponent-still-decreasing',
    holds: () => {
      const withP = IMP96849_LADDER.filter((r) => r.pLocal !== null);
      return (
        withP.every((r, i) => (i === 0 ? true : r.pLocal < withP[i - 1].pLocal)) &&
        withP[withP.length - 1].pLocal < 1.05 &&
        withP[withP.length - 1].N === 8000
      );
    },
    why: 'the local power exponent keeps decreasing monotonically across the new rungs and drops below 1.05 at N=8000 -- trending away from the quadratic value 2, not toward it.',
  },
  {
    id: 'imp96849-linear-in-log-still-beats-quadratic',
    holds: () =>
      IMP96849_FITS.modelB_linearInLog.rms < 0.01 &&
      IMP96849_FITS.modelA_quadraticOnly.rms > 100 * IMP96849_FITS.modelB_linearInLog.rms &&
      IMP96849_FITS.modelC_freeQuadratic.c2 < 0.01 &&
      IMP96849_FITS.effectivePowerExponent > 1.0 &&
      IMP96849_FITS.effectivePowerExponent < 1.15,
    why: 'over the extended ladder the linear-in-log fit still beats the pure-quadratic fit by >100x, the free quadratic coefficient stays collapsed at ~0.0022, and the effective exponent sits at ~1.06 -- linear, not quadratic.',
  },
  {
    id: 'imp96849-honesty-gate-no-qed',
    holds: () =>
      IMP96849_VERDICT.quadraticLawConfirmed === false &&
      IMP96849_VERDICT.linearInLogFitsBest === true &&
      IMP96849_VERDICT.localExponentClimbingTowardTwo === false &&
      IMP96849_VERDICT.anyBoundMoved === false &&
      /NO QED/.test(IMP96849_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96849_HONEST_BANNER) &&
      /RH open/.test(IMP96849_HONEST_BANNER) &&
      /persists-to-N8000/.test(IMP96849_SUBGAP.id),
    why: 'measurement only: no bound moved, no quadratic law claimed, the finite-N caveat and honesty markers are present, and the sharpened sub-gap is recorded.',
  },
];

for (const a of IMP96849_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96849-coprime-core-vasyunin-second-moment-ladder-extension assertion failed: ${a.id}`,
    );
  }
}
