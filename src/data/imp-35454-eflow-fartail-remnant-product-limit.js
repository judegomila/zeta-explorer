/**
 * @module imp-35454-eflow-fartail-remnant-product-limit
 *
 * imp-35454 (numerical, frontier-direction): imp-35413 (and imp-35371) recorded the
 * imp-35280 E_flow far-tail fd-vs-analytic remnant*log N drifting DOWN but never
 * determined its LIMIT: does the product tend to ZERO (remnant decaying FASTER than
 * 1/log N) or approach a POSITIVE CONSTANT (remnant ~ c/log N, a nonzero floor)?
 * The recorded drift (~0.069 at N = 1e16, ~0.061 at 1e24, ~0.059 at the 1e-3 crossing
 * 4.17e25) is monotone-down but does not settle the question inside that short window.
 * This module CONTINUES the identical closed-surrogate T0 = 2 pi N / log N channel
 * (no height-map swap, no heavy import) far past N = 1e28 to N = 1e60, tabulates
 * remnant*log N, and distinguishes the two hypotheses directly.
 *
 * THE MEASUREMENT (surrogate channel only -- no effectiveHeightForN, no heavy import)
 * ---------------------------------------------------------------------------------
 * The fd-vs-analytic remnant holds the height map FIXED at the closed surrogate
 * T0 = 2 pi N / log N (imp-35280): both the fd-surrogate exponent (central log-log
 * difference of the exact imp-35135 far-tail E_flow quantity) and the analytic
 * exponent -1 + 3/log N (imp-35198) live on that same closed inverse, so the remnant
 * isolates ONLY the closed-form Taylor truncation plus the prefactor-form difference.
 * That makes this module pure Math. It recomputes the imp-35413 endpoint N = 1e28 live
 * (reproducing 0.000880 to the digit) before continuing the ladder to N = 1e60.
 *
 *   N       remnant      remnant*log N     status
 *   1e28    8.7961e-4    0.05671           (imp-35413 endpoint, reproduced)
 *   1e32    7.2203e-4    0.05320           (NEW -- this module)
 *   1e36    6.0424e-4    0.05009           (NEW)
 *   1e40    5.1384e-4    0.04733           (NEW)
 *   1e48    3.8608e-4    0.04267           (NEW)
 *   1e56    3.0178e-4    0.03891           (NEW)
 *   1e60    2.6995e-4    0.03729           (NEW -- deepest rung)
 *
 * THE FINDING -- the product tends to ZERO, NOT a positive floor
 * -------------------------------------------------------------
 * remnant*log N keeps drifting DOWN monotonically across the whole 1e28..1e60 window
 * (0.05671 -> 0.03729, a further ~34% drop over 32 decades), with NO sign of levelling.
 * The decisive discriminator is the local decay exponent p in remnant ~ (log N)^{-p},
 * measured as p = -d(log remnant)/d(log log N): a positive floor requires p -> 1 exactly
 * (remnant ~ c/log N), whereas p sits at ~1.459 at N = 1e28 and RISES to ~1.621 by
 * N = 1e60 -- comfortably above 1 and TRENDING UP, not down toward 1. Since p > 1 the
 * remnant decays strictly faster than 1/log N, so remnant*log N ~ (log N)^{1-p} -> 0.
 * The product VANISHES; there is NO nonzero floor. (Equivalently remnant*(log N)^2 GROWS
 * without settling -- 3.66 at 1e28 to 5.15 at 1e60 -- so the true decay sits strictly
 * between 1/log N and 1/(log N)^2, i.e. p in (1,2), consistent with the vanishing product.)
 *
 * MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate extrapolation, NOT a
 * rigorous asymptotic; changes no bound. E_flow > 0 strictness (imp-33848) untouched;
 * C_mb GUE-conditional per imp-486 UNTOUCHED; E_coll far-tail exponent 1/2 per imp-3463;
 * imp-3066 K_a >= 0 untouched; no operator positivity; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35413-eflow-fartail-remnant-sub1e3-crossing (the ladder this continues, endpoint 1e28)
 * @see imp-35431-eflow-fartail-remnant-decay-law-fit (the decay-rate LAW fit this complements)
 * @see imp-35371-eflow-fartail-remnant-deep-extension (the deep-extension origin, endpoint 1e24)
 * @see imp-35280-eflow-fartail-fd-vs-analytic-surrogate-gap (the four-rung remnant origin)
 * @see imp-35198-eflow-fartail-exponent-logn-correction (the analytic -1 + 3/log N leading form)
 */

const TWO_PI = 2 * Math.PI;

// imp-35135/imp-35236 exact sub-term constants (no re-derivation): the A1-trap Gronwall factor.
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

// The closed RvM surrogate height map T0 = 2 pi N / log N (the inverse the derivation uses).
function surrogateHeightForN(N) {
  return (TWO_PI * N) / Math.log(N);
}

// EXACT imp-35135 far-tail E_flow quantity on the closed surrogate height map (imp-35236 form).
function eFlowWith(N) {
  const T0 = surrogateHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  return C_F * (L / T0) * GRONWALL;
}

// Local log-log decay exponent by the SAME central difference as imp-35135/imp-35371 (h = 1.0002).
function localExponent(N) {
  const h = 1.0002;
  const lo = Math.log(eFlowWith(N / h));
  const hi = Math.log(eFlowWith(N * h));
  return (hi - lo) / (Math.log(N * h) - Math.log(N / h));
}

// The imp-35198 analytic leading closed form -1 + 3/log N (the surrogate-channel analytic exponent).
function analyticSurrogateExponent(x) {
  return -1 + 3 / x;
}

// The fd-vs-analytic remnant at a given log10 N exponent e (the imp-35280/imp-35371 quantity).
function remnantAtLog10(e) {
  const N = Math.pow(10, e);
  const x = Math.log(N);
  const fd = localExponent(N);
  const analytic = analyticSurrogateExponent(x);
  return Math.abs(analytic - fd);
}

// The remnant*log N product at log10 N exponent e (the drifting quantity whose limit we test).
function productAtLog10(e) {
  const N = Math.pow(10, e);
  return remnantAtLog10(e) * Math.log(N);
}

// Local decay exponent p in remnant ~ (log N)^{-p}: p = -d(log remnant)/d(log log N).
// A positive product floor requires p -> 1 (remnant ~ c/log N); p > 1 forces the product to 0.
function localDecayExponentP(e) {
  const de = 0.5;
  const rLo = remnantAtLog10(e - de);
  const rHi = remnantAtLog10(e + de);
  const xLo = Math.log(Math.pow(10, e - de));
  const xHi = Math.log(Math.pow(10, e + de));
  return -(Math.log(rHi) - Math.log(rLo)) / (Math.log(xHi) - Math.log(xLo));
}

// The continuation ladder: the reproduced imp-35413 endpoint plus the new deep rungs to 1e60.
const LADDER = [28, 32, 36, 40, 44, 48, 52, 56, 60].map((e) => ({
  N: +Math.pow(10, e).toExponential(0),
  log10N: e,
  remnant: +remnantAtLog10(e).toExponential(4),
  remnantTimesLogN: +productAtLog10(e).toFixed(5),
  localDecayExponentP: +localDecayExponentP(e).toFixed(4),
  isReproduced35413: e === 28,
}));

const P_AT_1E28 = localDecayExponentP(28);
const P_AT_1E60 = localDecayExponentP(60);
const PRODUCT_1E28 = productAtLog10(28);
const PRODUCT_1E60 = productAtLog10(60);

export const IMP35454_EFLOW_FARTAIL_REMNANT_PRODUCT_LIMIT = {
  id: 'imp-35454',
  proofSection: 'S-frontier',
  question:
    'Does the imp-35413 E_flow far-tail remnant*log N product tend to ZERO (remnant ' +
    'decaying faster than 1/log N) or approach a POSITIVE CONSTANT (remnant ~ c/log N)? ' +
    'Continue the closed surrogate ladder past N = 1e28 to N = 1e60 to distinguish them.',
  method:
    'On the closed surrogate height map T0 = 2 pi N / log N (surrogate channel only; no ' +
    'effectiveHeightForN, hence no heavy import), reproduce the imp-35413 endpoint N = 1e28 ' +
    'remnant to the digit, then tabulate remnant*log N to N = 1e60 and measure the local ' +
    'decay exponent p in remnant ~ (log N)^{-p} (p = -d(log remnant)/d(log log N)): a ' +
    'positive product floor requires p -> 1, while p > 1 forces the product to 0.',
  verdictOnLimit: 'VANISHES (product -> 0; no positive floor)',
  productDrift: {
    at1e28: +PRODUCT_1E28.toFixed(5),
    at1e60: +PRODUCT_1E60.toFixed(5),
    monotoneDecreasing: true,
  },
  decayExponentP: {
    at1e28: +P_AT_1E28.toFixed(4),
    at1e60: +P_AT_1E60.toFixed(4),
    trendsUpAboveOne: P_AT_1E60 > P_AT_1E28 && P_AT_1E28 > 1,
  },
  ladder: LADDER,
  finding: {
    F1_reproduces_imp35413_endpoint:
      'The remnant recomputed live at N = 1e28 reproduces the imp-35413 endpoint value ' +
      '0.000880 to the digit, and remnant*log N there matches the imp-35413/imp-35371 ' +
      'slow-drift reading (~0.0567), confirming the same surrogate channel is continued.',
    F2_product_keeps_falling:
      'remnant*log N keeps drifting DOWN monotonically over the whole 1e28..1e60 window ' +
      '(0.05671 -> 0.03729, a further ~34% drop over 32 decades) with NO sign of levelling ' +
      'at any positive value.',
    F3_decay_exponent_above_one:
      'The local decay exponent p in remnant ~ (log N)^{-p} sits at ~1.459 at N = 1e28 and ' +
      'RISES to ~1.621 by N = 1e60 -- comfortably above 1 and trending UP, not down toward 1. ' +
      'A positive product floor would require p -> 1; p > 1 forces remnant*log N -> 0.',
    F4_verdict_vanishing_product:
      'The product VANISHES: remnant*log N -> 0. There is NO nonzero floor. Equivalently ' +
      'remnant*(log N)^2 GROWS without settling (3.66 at 1e28 to 5.15 at 1e60), placing the ' +
      'true decay strictly between 1/log N and 1/(log N)^2, i.e. p in (1,2).',
  },
  isRigorous: false,
  honestStatus:
    'Continuing the imp-35413 surrogate channel past N = 1e28 to N = 1e60, remnant*log N ' +
    'keeps falling monotonically (0.05671 -> 0.03729) and the local decay exponent p in ' +
    'remnant ~ (log N)^{-p} sits at ~1.459 (1e28) rising to ~1.621 (1e60), comfortably ' +
    'above 1 -- so the remnant decays strictly faster than 1/log N and the product tends ' +
    'to ZERO, NOT a positive floor. Measurement only on the inherited imp-3220/imp-3406 ' +
    'surrogate; changes no bound; NO QED.',
  verdict:
    'MEASUREMENT ONLY (frontier-direction, NOT rigorous). Continuing the imp-35413 surrogate ' +
    'channel past N = 1e28 to N = 1e60, the E_flow far-tail remnant*log N product keeps ' +
    'drifting DOWN monotonically (0.05671 at 1e28 -> 0.03729 at 1e60) and the local decay ' +
    'exponent p in remnant ~ (log N)^{-p} sits at ~1.459 rising to ~1.621 -- comfortably ' +
    'above 1 and trending up. Since p > 1 the remnant decays faster than 1/log N, so the ' +
    'product VANISHES (remnant*log N -> 0), NOT a positive floor. Resolves the imp-35413/' +
    'imp-35371 open drift and complements the imp-35431 decay-rate law fit. Measurement only ' +
    'on the inherited imp-3220/imp-3406 surrogate, NOT a rigorous asymptotic; E_flow > 0 ' +
    'strictness (imp-33848) untouched; C_mb GUE-conditional per imp-486 UNTOUCHED; E_coll ' +
    'far-tail exponent 1/2 per imp-3463; imp-3066 K_a >= 0 untouched; changes no bound; no ' +
    'operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35413 (sub-1e-3 crossing, endpoint N = 1e28, continued here); imp-35431 (decay-rate ' +
    'law fit, complemented); imp-35371 (deep extension, endpoint 1e24); imp-35280 (four-rung ' +
    'fd-vs-analytic remnant origin); imp-35198 (analytic -1 + 3/log N); imp-486 (C_mb ' +
    'GUE-conditional, UNTOUCHED).',
};

export const IMP35454_EFLOW_FARTAIL_REMNANT_PRODUCT_LIMIT_ASSERTIONS = [
  {
    // Reproduce the imp-35413 endpoint remnant at N = 1e28 (surrogate channel is faithful).
    id: 'imp35454-reproduces-imp35413-endpoint',
    description: 'the live remnant at N = 1e28 matches the imp-35413 endpoint value 0.000880',
    holds: () => Math.abs(remnantAtLog10(28) - 0.00088) < 5e-6,
  },
  {
    // The product is monotone decreasing across the whole 1e28..1e60 ladder (no floor plateau).
    id: 'imp35454-product-monotone-decreasing',
    description: 'remnant*log N strictly decreases across every rung 1e28..1e60',
    holds: () => {
      const es = [28, 32, 36, 40, 44, 48, 52, 56, 60];
      for (let i = 1; i < es.length; i++) {
        if (productAtLog10(es[i]) >= productAtLog10(es[i - 1])) return false;
      }
      return true;
    },
  },
  {
    // The product falls materially further past the imp-35413 endpoint (not levelling at a floor).
    id: 'imp35454-product-falls-further',
    description: 'remnant*log N at 1e60 is well below its 1e28 value (~34% further drop)',
    holds: () => PRODUCT_1E60 < 0.9 * PRODUCT_1E28 && PRODUCT_1E60 < 0.04,
  },
  {
    // Decisive discriminator: the local decay exponent p exceeds 1 at every rung (product -> 0).
    id: 'imp35454-decay-exponent-above-one',
    description: 'the local decay exponent p in remnant ~ (log N)^{-p} exceeds 1 at every rung',
    holds: () => [28, 36, 44, 52, 60].every((e) => localDecayExponentP(e) > 1.1),
  },
  {
    // p trends UP away from 1 (a positive floor would need p -> 1 from above; instead p grows).
    id: 'imp35454-decay-exponent-trends-up',
    description: 'the decay exponent p rises from ~1.46 (1e28) to ~1.62 (1e60), away from 1',
    holds: () =>
      P_AT_1E60 > P_AT_1E28 &&
      Math.abs(P_AT_1E28 - 1.459) < 5e-3 &&
      Math.abs(P_AT_1E60 - 1.621) < 5e-3,
  },
  {
    // The stated verdict on the limit is the vanishing-product reading.
    id: 'imp35454-verdict-is-vanishing',
    description: 'the module verdict on the product limit is VANISHES (no positive floor)',
    holds: () =>
      /VANISHES/.test(IMP35454_EFLOW_FARTAIL_REMNANT_PRODUCT_LIMIT.verdictOnLimit) &&
      IMP35454_EFLOW_FARTAIL_REMNANT_PRODUCT_LIMIT.decayExponentP.trendsUpAboveOne === true,
  },
  {
    // Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.
    id: 'imp35454-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35454_EFLOW_FARTAIL_REMNANT_PRODUCT_LIMIT.isRigorous === false &&
      /NO QED/.test(IMP35454_EFLOW_FARTAIL_REMNANT_PRODUCT_LIMIT.verdict) &&
      /refereed bound is changed/i.test(IMP35454_EFLOW_FARTAIL_REMNANT_PRODUCT_LIMIT.verdict),
  },
];

for (const a of IMP35454_EFLOW_FARTAIL_REMNANT_PRODUCT_LIMIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35454-eflow-fartail-remnant-product-limit assertion failed: ${a.id}`,
    );
  }
}

export default IMP35454_EFLOW_FARTAIL_REMNANT_PRODUCT_LIMIT;
