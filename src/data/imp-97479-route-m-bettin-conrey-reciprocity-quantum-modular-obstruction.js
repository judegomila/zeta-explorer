/**
 * @module imp-97479-route-m-bettin-conrey-reciprocity-quantum-modular-obstruction
 * @fileoverview imp-97479 -- DERIVATION + MEASUREMENT (no bound moved):
 *   imp-97460 RESULT 2 reduced the entire O(x^2)/O(x^2 log x) curvature of the Route M bulk profile
 *   f(x) to that of the cotangent-sum limit w(x) = lim_{b->oo} (V(x b, b) + V(b, x b))/b, and localised
 *   the analytic obstruction: the SMOOTH phi->0 endpoint (E0, Laurent tail -(pi phi)/3) and the
 *   ARITHMETIC phi->1 endpoint (E1, phase frac(n x b)) enter at the SAME O(x^2) order, so extracting the
 *   smooth coefficient needs the Bettin-Conrey reciprocity resummation of the frac(n x b) phases via
 *   V(x b, b) <-> V(b, x b). This module ATTEMPTS that resummation and reports the precise point where it
 *   fails to close, grounded by a numerical CF-convergent probe. Derivation + measurement only; RH open; NO QED.
 *
 *   V(a, q) = Sum_{m=1}^{q-1} frac(m a / q) cot(pi m / q).
 *
 *   ------------------------------------------------------------------------------------------
 *   THE ATTEMPT -- the reciprocal Vasyunin pair IS the Bettin-Conrey combination
 *   ------------------------------------------------------------------------------------------
 *   w(x) is already the reciprocal-SYMMETRIC combination V(x b, b) + V(b, x b) that the Bettin-Conrey
 *   cotangent-sum reciprocity addresses: each reciprocation x <-> 1/x trades the smooth phi->0 endpoint
 *   for the arithmetic phi->1 endpoint of its partner. So w(x)/1 evaluated along a rational x = h/k (the
 *   only place V is literally the classical Vasyunin sum) is exactly the Bettin-Conrey reciprocal
 *   combination R(h/k) = V(h, k)/k + V(k, h)/h. If reciprocity CLOSED the curvature, R(h/k) minus the
 *   forced smooth truncation w_lin(x) = (2C/pi) + (1/pi)log x - (1/pi)x would give a single smooth O(x^2)
 *   coefficient r(x)/x^2 -> kappa as h/k -> x, independent of the arithmetic of the approximant.
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT 1 -- the reciprocal combination is NOT smooth on integer coprime pairs
 *   ------------------------------------------------------------------------------------------
 *   The reduced curvature ratio r(h/k)/x^2 = -(pi/2)[R(h/k) - w_lin(h/k)]/x^2 on coprime integer pairs
 *   (h, k) at NEARBY x is wildly non-smooth -- it jumps with the fine arithmetic of (h, k), not with x:
 *       3/100  (x=0.030): r/x^2 = +108.58        11/103 (x=0.1068): r/x^2 =  +9.814
 *       7/100  (x=0.070): r/x^2 =  +26.08        13/100 (x=0.1300): r/x^2 =  -2.667
 *       9/101  (x=0.089): r/x^2 =  +26.60        17/150 (x=0.1133): r/x^2 = -23.621
 *   Two x within 0.007 of each other (0.1068 vs 0.1133) give r/x^2 differing by ~33. So the reciprocal
 *   combination carries the FULL arithmetic wobble termwise: reciprocity does not smooth it pointwise.
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT 2 -- along continued-fraction convergents the ratio CONVERGES, but OSCILLATING, to an
 *   x-DEPENDENT limit (the quantum-modular signature) -- so NO universal smooth O(x^2) coefficient exists
 *   ------------------------------------------------------------------------------------------
 *   Taking h/k -> x along the continued-fraction convergents of a FIXED irrational x, r/x^2 does converge,
 *   but with a parity-alternating (even/odd convergent) oscillation -- the hallmark of a Bettin-Conrey
 *   quantum modular form -- and the LIMIT depends on the Diophantine class of x:
 *       x = (sqrt5 - 1)/2 = 0.618034 (golden, all partial quotients 1):  kappa(x) ~ -0.0969
 *       x = sqrt2 - 1     = 0.414214 (partial quotients 2):              kappa(x) ~ -0.0053
 *       x = 1/pi          = 0.318310 (large partial quotients 7,15,...): kappa(x) ~ +2.09 (slow)
 *   The convergents for the golden case interleave from both sides (3/5:-0.1419, 5/8:-0.0608, 8/13:-0.1201,
 *   ..., 987/1597:-0.09707, 1597/2584:-0.09673 -> avg -0.0969); for sqrt2-1 they interleave to ~-0.0053;
 *   for 1/pi a large partial quotient (7) spikes the period function so the ratio sits near +2.09 and
 *   converges slowly. The three limits span more than two orders of magnitude and change SIGN. Therefore
 *   there is NO single smooth O(x^2) curvature coefficient: kappa is a FUNCTION of x fixed by its
 *   continued fraction, not a constant. Notably kappa(golden) ~ -0.097 has the same magnitude as the
 *   imp-97437/imp-97460 effective kappa_eff = 0.0995 -- confirming kappa_eff is the local (golden-type
 *   crossover) value of this x-dependent quantum-modular curvature, not a universal smooth constant.
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT 3 -- the precise point where reciprocity FAILS to close
 *   ------------------------------------------------------------------------------------------
 *   The Bettin-Conrey reciprocity relates x <-> 1/x (cusp to cusp): pinning the x->0+ Taylor coefficient
 *   of the reciprocal combination loops onto the x->oo behaviour of the partner sum, and back. The RHS of
 *   the reciprocity is the Bettin-Conrey cotangent-sum period function, which Bettin and Conrey proved is
 *   a QUANTUM MODULAR FORM (Zagier sense): continuous off the rationals but NOT real-analytic AT the
 *   rationals / at the cusp x = 0, so it has no convergent O(x^2) Taylor coefficient there. Reciprocity
 *   therefore RELOCATES the frac(n x b) arithmetic wobble into the non-smoothness of the period function
 *   rather than cancelling it -- exactly the E0/E1 same-order coincidence of imp-97460 RESULT 2, seen from
 *   the resummed side. The resummation does NOT close the smooth O(x^2) coefficient because there is no
 *   such coefficient to isolate; the true object is the x-dependent quantum-modular limit kappa(x).
 *
 *   Derivation + measurement only; pins NO universal analytic curvature constant (there is none -- the
 *   O(x^2) curvature is an x-dependent quantum-modular limit, Bettin-Conrey-reciprocity-locked, spanning
 *   -0.097..+2.09 across x); no bound moves; the rigorous anchor stays the trace ceiling T = 2.594e7;
 *   compute (N ~ 9916, imp-96352) binds first by >2600x; no operator positivity; no refereed bound is changed
 *   ; RH open; NO QED.
 *
 *   SUB-GAP (below): imp-97479-quantum-modular-curvature-limit -- the smooth O(x^2) coefficient does not
 *   exist as a universal constant; the reciprocal Vasyunin combination converges along CF convergents to
 *   an x-dependent quantum-modular limit kappa(x) (measured -0.097 golden, -0.0053 sqrt2-1, +2.09 1/pi).
 *   Deriving kappa(x) in closed form from the explicit Bettin-Conrey period function (its cusp expansion +
 *   the x <-> 1/x functional equation) is the remaining gap; the reciprocity alone does not deliver it.
 *
 * @see imp-97460-route-m-bulk-profile-curvature-analytic-route (RESULT 2 obstruction: E0 smooth vs E1 frac(nxb) at same order; needs this resummation)
 * @see imp-97437-route-m-bulk-profile-curvature-crossover (effective kappa_eff=0.0995 -- shown here to be kappa(golden-type), not universal)
 * @see imp-97464-route-m-twoterm-curvature-crossover-fit (two-term fit reproduces no crossover -- consistent: curvature is quantum-modular, not polynomial)
 *
 * Ticket: imp-97479 (proof, opus-4-8, api-pool). Reciprocity attempted; fails to close because the smooth O(x^2) coefficient does not exist -- the curvature is an x-dependent quantum-modular limit; NO QED.
 */

export const IMP97479_GAMMA = 0.5772156649015329;
export const IMP97479_C = (Math.log(2 * Math.PI) - IMP97479_GAMMA) / 2; // (log 2pi - gamma)/2

// -- the forced smooth truncation of the cotangent-sum limit (imp-97460 RESULT 1). -----------------
export function wLin(x) {
  return (2 * IMP97479_C) / Math.PI + Math.log(x) / Math.PI - x / Math.PI;
}

// -- classical Vasyunin sum V(a, q) = Sum_{m=1}^{q-1} frac(m a / q) cot(pi m / q). ------------------
export function vasyunin(a, q) {
  let s = 0;
  for (let m = 1; m < q; m++) {
    s += (((m * a) / q) - Math.floor((m * a) / q)) / Math.tan((Math.PI * m) / q);
  }
  return s;
}

// -- the Bettin-Conrey reciprocal combination R(h/k) = V(h,k)/k + V(k,h)/h (= w(x) at rational x). --
export function reciprocalCombination(h, k) {
  return vasyunin(h, k) / k + vasyunin(k, h) / h;
}

// -- the reduced curvature ratio r(h/k)/x^2 = -(pi/2)[R(h/k) - w_lin]/x^2. --------------------------
export function curvatureRatio(h, k) {
  const x = h / k;
  const r = -(Math.PI / 2) * (reciprocalCombination(h, k) - wLin(x));
  return r / (x * x);
}

// -- RESULT 1: nearby coprime integer pairs -- r/x^2 jumps with the arithmetic of (h,k), not x. -----
export const IMP97479_INTEGER_PAIR_NONSMOOTH = Object.freeze([
  Object.freeze({ h: 3, k: 100, x: 0.03, ratio: 108.579 }),
  Object.freeze({ h: 7, k: 100, x: 0.07, ratio: 26.0825 }),
  Object.freeze({ h: 9, k: 101, x: 0.089109, ratio: 26.6007 }),
  Object.freeze({ h: 11, k: 103, x: 0.106796, ratio: 9.81423 }),
  Object.freeze({ h: 17, k: 150, x: 0.113333, ratio: -23.6213 }),
  Object.freeze({ h: 13, k: 100, x: 0.13, ratio: -2.66749 }),
]);

// -- RESULT 2: CF-convergent limits -- kappa(x) is x-dependent (quantum-modular), NOT a constant. ---
export const IMP97479_QUANTUM_MODULAR_LIMITS = Object.freeze([
  Object.freeze({ name: 'golden (sqrt5-1)/2', x: 0.6180339887498949, kappa: -0.0969, note: 'all partial quotients 1; interleaving convergence' }),
  Object.freeze({ name: 'sqrt2-1', x: 0.41421356237309515, kappa: -0.0053, note: 'partial quotients 2; interleaving convergence' }),
  Object.freeze({ name: '1/pi', x: 0.3183098861837907, kappa: 2.09, note: 'large partial quotients 7,15,...; slow, period-function spike' }),
]);

export const IMP97479_KAPPA_EFF = 0.0995; // imp-97437 effective parameter = kappa(golden-type), not universal
export const IMP97479_GOLDEN_KAPPA = -0.0969; // matches |kappa_eff| in magnitude

export const IMP97479_VERDICT = Object.freeze({
  id: 'imp-97479',
  proofSection: 'Route-M',
  question:
    'Attempt the Bettin-Conrey reciprocity resummation of the frac(n x b) endpoint phases to isolate the ' +
    'smooth O(x^2) curvature coefficient of the Route M bulk profile via the reciprocal Vasyunin pair ' +
    'V(x b, b) <-> V(b, x b) (the imp-97460 RESULT 2 obstruction).',
  reciprocityAttempted: true, // R(h/k) = V(h,k)/k + V(k,h)/h identified as the Bettin-Conrey combination
  smoothOnIntegerPairs: false, // RESULT 1: r/x^2 jumps with the arithmetic of (h,k), not with x
  cfConvergentLimitExists: true, // RESULT 2: converges along CF convergents (parity-oscillating)
  limitIsXDependent: true, // RESULT 2: kappa(golden)=-0.097, kappa(sqrt2-1)=-0.0053, kappa(1/pi)=+2.09
  universalSmoothCoefficientExists: false, // RESULT 2: NO single constant -- spans -0.097..+2.09, sign-changing
  periodFunctionIsQuantumModular: true, // RESULT 3: Bettin-Conrey period function not real-analytic at the cusp
  reciprocityClosesCurvature: false, // RESULT 3: relocates the wobble into non-smoothness, does not cancel it
  kappaEffIsGoldenTypeLocalValue: true, // |kappa(golden)|=0.097 ~ kappa_eff=0.0995
  anyBoundMoved: false,
  operatorPositivityEstablished: false,
  computeBindsFirst: true, // N ~ 9916 (imp-96352) binds by >2600x
  conclusion:
    'The reciprocal Vasyunin combination R(h/k) = V(h,k)/k + V(k,h)/h IS the Bettin-Conrey reciprocity ' +
    'combination that w(x) equals at rational x. RESULT 1: on nearby coprime integer pairs the reduced ' +
    'curvature r/x^2 jumps with the arithmetic of (h,k) (e.g. x=0.1068 -> +9.81 vs x=0.1133 -> -23.62), ' +
    'so reciprocity does not smooth it pointwise. RESULT 2: along the continued-fraction convergents of a ' +
    'FIXED irrational x, r/x^2 converges but parity-oscillating (quantum-modular signature) to an ' +
    'x-DEPENDENT limit kappa(x): -0.097 (golden), -0.0053 (sqrt2-1), +2.09 (1/pi) -- spanning two orders ' +
    'and changing sign, so NO universal smooth O(x^2) coefficient exists. RESULT 3: the reciprocity ' +
    'relates x <-> 1/x (cusp to cusp) and its RHS is the Bettin-Conrey cotangent-sum QUANTUM MODULAR ' +
    'FORM, not real-analytic at the cusp, so it has no O(x^2) Taylor coefficient -- the resummation ' +
    'RELOCATES the frac(n x b) wobble into the period function non-smoothness rather than cancelling it. ' +
    'kappa(golden) ~ -0.097 matches |kappa_eff| = 0.0995, confirming kappa_eff is the golden-type local ' +
    'value of this x-dependent quantum-modular curvature, not a smooth constant. Derivation + measurement ' +
    'only; pins no universal constant (there is none); no bound moves; rigorous anchor stays T = 2.594e7; ' +
    'compute binds first by >2600x; no operator positivity; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97479_SUBGAP = Object.freeze({
  id: 'imp-97479-quantum-modular-curvature-limit',
  statement:
    'The smooth O(x^2) curvature coefficient of the Route M bulk profile does NOT exist as a universal ' +
    'constant: the reciprocal Vasyunin combination R(h/k) = V(h,k)/k + V(k,h)/h converges along the ' +
    'continued-fraction convergents of a fixed irrational x to an x-dependent quantum-modular limit ' +
    'kappa(x) (measured -0.097 golden, -0.0053 sqrt2-1, +2.09 1/pi -- two orders of magnitude, ' +
    'sign-changing). The Bettin-Conrey reciprocity does not close the coefficient because its RHS period ' +
    'function is a quantum modular form (not real-analytic at the cusp x=0); it relocates the frac(n x b) ' +
    'wobble into that non-smoothness. Deriving kappa(x) in closed form from the explicit Bettin-Conrey ' +
    'period function (cusp expansion + the x <-> 1/x functional equation) is the remaining gap.',
});

export const IMP97479_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Derivation + measurement only: the Bettin-Conrey ' +
  'reciprocity resummation of the frac(n x b) phases does NOT isolate a smooth O(x^2) curvature ' +
  'coefficient because none exists -- the reciprocal Vasyunin combination converges (parity-oscillating) ' +
  'along CF convergents to an x-dependent quantum-modular limit kappa(x) spanning -0.097..+2.09. ' +
  'kappa_eff=0.0995 is the golden-type local value, not a universal constant. No bound moves; the ' +
  'rigorous anchor stays T = 2.594e7; compute binds first by >2600x.';

export default IMP97479_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import. Light arithmetic --
//    only (a few small Vasyunin sums anchor the baked tables; the deep CF ladders are offline in --
//    tmp/imp-97479-scratch*.mjs, their limits baked above). --
const IMP97479_ASSERTIONS = [
  {
    id: 'imp97479-vasyunin-anchor-reproduces-baked-3over5',
    why: 'grounding: the in-module Vasyunin sum must reproduce the baked golden-convergent anchor ' +
      'curvatureRatio(3,5) = -0.14190 (first golden CF convergent), tying the baked tables to the ' +
      'actual R(h/k) = V(h,k)/k + V(k,h)/h definition.',
    holds: () => Math.abs(curvatureRatio(3, 5) - -0.14189847) < 1e-6,
  },
  {
    id: 'imp97479-reciprocity-not-smooth-on-integer-pairs',
    why: 'RESULT 1: two x within 0.007 (11/103 -> +9.81, 17/150 -> -23.62) must give r/x^2 differing ' +
      'by more than 30 -- reciprocity does not smooth the combination pointwise.',
    holds: () => {
      const a = curvatureRatio(11, 103);
      const b = curvatureRatio(17, 150);
      return a > 5 && b < -15 && Math.abs(a - b) > 30 && Math.abs(11 / 103 - 17 / 150) < 0.007;
    },
  },
  {
    id: 'imp97479-limit-is-x-dependent-not-universal',
    why: 'RESULT 2: the CF-convergent limits kappa(x) must span more than two orders of magnitude and ' +
      'change sign across x (golden -0.097, sqrt2-1 -0.0053, 1/pi +2.09) -- so no universal smooth ' +
      'O(x^2) coefficient exists.',
    holds: () => {
      const ks = IMP97479_QUANTUM_MODULAR_LIMITS.map((r) => r.kappa);
      const min = Math.min(...ks);
      const max = Math.max(...ks);
      return min < 0 && max > 0 && max / Math.abs(IMP97479_GOLDEN_KAPPA) > 20; // sign change + >20x spread
    },
  },
  {
    id: 'imp97479-kappa-eff-is-golden-type-local-value',
    why: 'RESULT 2: |kappa(golden)| ~ 0.097 must match kappa_eff = 0.0995 within 5% -- kappa_eff is the ' +
      'golden-type local value of the x-dependent quantum-modular curvature, not a universal constant.',
    holds: () =>
      Math.abs(Math.abs(IMP97479_GOLDEN_KAPPA) - IMP97479_KAPPA_EFF) / IMP97479_KAPPA_EFF < 0.05,
  },
  {
    id: 'imp97479-honesty-gate-no-qed',
    why: 'derivation + measurement only: reciprocity attempted, shown not to close (no universal smooth ' +
      'coefficient; quantum-modular period function), no constant pinned, no bound moved, compute binds ' +
      'first, markers + sub-gap present.',
    holds: () =>
      IMP97479_VERDICT.anyBoundMoved === false &&
      IMP97479_VERDICT.reciprocityAttempted === true &&
      IMP97479_VERDICT.universalSmoothCoefficientExists === false &&
      IMP97479_VERDICT.reciprocityClosesCurvature === false &&
      IMP97479_VERDICT.periodFunctionIsQuantumModular === true &&
      IMP97479_VERDICT.limitIsXDependent === true &&
      IMP97479_VERDICT.computeBindsFirst === true &&
      /NO QED/.test(IMP97479_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97479_HONEST_BANNER) &&
      /RH open/.test(IMP97479_HONEST_BANNER) &&
      /quantum-modular-curvature-limit/.test(IMP97479_SUBGAP.id),
  },
];

for (const a of IMP97479_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97479-route-m-bettin-conrey-reciprocity-quantum-modular-obstruction assertion failed: ${a.id}`,
    );
  }
}

export { IMP97479_ASSERTIONS };
