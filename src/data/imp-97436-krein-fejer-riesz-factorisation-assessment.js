/**
 * @module imp-97436-krein-fejer-riesz-factorisation-assessment
 * @fileoverview imp-97436 -- ATTEMPT/ASSESS the Fejer-Riesz / de Branges square factorisation
 *       sigma_2(t) = |q(t)|^2 - r(t),   q admissible on PW_a,   r a "certified-small" remainder,
 *   as the SECOND imp-97416 FINDING 2 spectral primitive for closing the sign of the Krein concentration floor
 *       c_sharp = lambda_min(P_a M_{sigma_2} P_a) = inf_{psi in PW_a, ||psi||=1} int sigma_2(t)|psi(t)|^2 dt,
 *   at 2a = ln3, where sigma_2(t) = (t^2 + 1/4)^2 w_1(t), w_1(t) = 2 theta prime(t) - sqrt2 ln2 cos(t ln2).
 *   Sibling imp-97435 assessed the FIRST primitive (weighted-PSWF eigenvalue decay) and obstructed. This leaf
 *   attempts the factorisation: construct q on PW_a, bound r, and report whether a certified positive margin is
 *   reachable or the precise obstruction (imp-97416 named "incompatibility of the negative w_1 edge with an
 *   admissible q" as the candidate obstruction -- this leaf proves that is exactly what happens).
 *
 * WHY A FACTORISATION WOULD HELP (if it existed). If sigma_2 = |q|^2 - r with q in PW_a and r a small nonnegative
 *   remainder, then for psi in PW_a the quadratic form splits as
 *       int sigma_2 |psi|^2 = int |q|^2 |psi|^2  -  int r |psi|^2 = ||q psi||^2 - int r |psi|^2,
 *   and q in PW_a makes q psi in PW_{2a} (a genuine positive term ||q psi||^2 >= 0), so a small r would give
 *   c_sharp >= -sup-form(r) close to 0+ -- a POSITIVE certificate if the r-form were dominated. That is the whole
 *   appeal, and it is exactly the appeal that the negative excursion of sigma_2 destroys.
 *
 * OBSTRUCTION 1 -- THE REMAINDER IS IRREDUCIBLE ON THE NEGATIVITY SET (the sign obstruction, rigorous & pointwise).
 *   In ANY decomposition sigma_2 = |q|^2 - r with |q|^2 >= 0 (which holds for every q, real or complex), the
 *   remainder is pinned from below wherever sigma_2 is negative:
 *       r(t) = |q(t)|^2 - sigma_2(t) >= -sigma_2(t) = (sigma_2)^-(t) > 0   for every t with sigma_2(t) < 0.
 *   So r inherits the ENTIRE negative part of sigma_2 pointwise -- it cannot be "certified-small" in any sup / L^inf
 *   sense: r(ln3) >= -sigma_2(ln3) = 5.508 at the band edge, and r >= 4336.198 at the well minimum t ~ 9.35
 *   (matching the imp-97335 naive floor, which IS the well depth). sigma_2 is negative on ~57% of [0,12], so the
 *   remainder is large on more than half the core, not on a thin edge sliver. The pointwise order r >= (sigma_2)^-
 *   lifts to the operator order M_r >= M_{(sigma_2)^-} on PW_a, hence
 *       P_a M_{sigma_2} P_a = P_a M_{|q|^2} P_a - P_a M_r P_a <= P_a M_{|q|^2} P_a - P_a M_{(sigma_2)^-} P_a,
 *   an UPPER bound on the operator -- the WRONG direction for a positive lower bound on lambda_min. To LOWER-bound
 *   lambda_min one needs an UPPER bound on P_a M_r P_a, but r can only be made LARGER by enlarging q (r = |q|^2 -
 *   sigma_2), never smaller than (sigma_2)^-. The pointwise-minimal admissible remainder is r = (sigma_2)^-, forced
 *   by the extremal choice |q|^2 = (sigma_2)^+ (q captures exactly the positive part). With that choice the identity
 *   is just the SIGNED SPLIT sigma_2 = (sigma_2)^+ - (sigma_2)^-, so
 *       c_sharp = lambda_min(P_a M_{sigma_2} P_a) >= -lambda_max(P_a M_{(sigma_2)^-} P_a) <= 0.
 *   The Fejer-Riesz factorisation therefore COLLAPSES onto imp-97435 Reading A and inherits its <= 0 ceiling: the
 *   binding eigenvalue of the positive operator P_a M_{(sigma_2)^-} P_a is its LARGEST one, and subtracting it can
 *   never certify positivity. No choice of q escapes, because the constraint r >= (sigma_2)^- is q-independent.
 *
 * OBSTRUCTION 2 -- THE FACTORISATION HYPOTHESIS ITSELF FAILS (the type / class obstruction). The Krein-Fejer-Riesz
 *   factorisation theorem (a function admits sigma = |q|^2 with q of exponential type a) REQUIRES sigma to be (i)
 *   nonnegative on R and (ii) entire of exponential type <= 2a and integrable (a de Branges structure-function
 *   hypothesis). sigma_2 = (t^2+1/4)^2 w_1 violates BOTH beyond the sign:
 *     - w_1(t) = 2 theta prime(t) - sqrt2 ln2 cos(t ln2) contains the Riemann-Siegel theta prime(t), which grows
 *       like (1/2) log(t/2pi) and is NOT of finite exponential type -- it is not band-limited to any PW_b, so no q
 *       in PW_a can reproduce its slowly-growing non-band-limited part; and
 *     - the polynomial factor (t^2+1/4)^2 makes sigma_2(t) ~ t^4 -> +inf (sigma_2(50) ~ 1.9e7), so sigma_2 is
 *       neither bounded nor integrable on R.
 *   Hence an admissible q on PW_a can at best match sigma_2 on the band core; the growing / non-band-limited part is
 *   necessarily pushed into r, compounding Obstruction 1: r is not only pinned below by (sigma_2)^- on the well but
 *   also carries the entire t^4 far field and the theta prime log-tail. There is no "certified-small" r.
 *
 * VERDICT. The Fejer-Riesz / de Branges square factorisation does NOT deliver a certified POSITIVE lower bound on
 *   c_sharp at 2a = ln3, for exactly the obstruction imp-97416 anticipated (negative-w_1 edge vs admissible q). The
 *   reason is unconditional and needs no numerics beyond confirming sigma_2 < 0: for ANY q, the remainder obeys
 *   r >= (sigma_2)^- pointwise on the negativity set, so r is irreducibly large (>= 5.508 at the ln3 edge, >= 4336
 *   at the well) and the pointwise-minimal choice collapses the route to the signed split, which caps c_sharp <= 0
 *   (= imp-97435 Reading A). Separately, sigma_2 is neither nonnegative nor of finite exponential type (theta prime
 *   not band-limited; t^4 far field), so the factorisation theorem's hypotheses fail outright. BOTH named spectral
 *   primitives of imp-97416 FINDING 2 (weighted-PSWF decay, imp-97435; Fejer-Riesz factorisation, this leaf) are now
 *   obstructed, and they obstruct for the SAME underlying reason: any construction that separates sigma_2 into a
 *   positive piece and a subtracted piece discards the sigma_2^+ / sigma_2^- CANCELLATION on the SAME band-limited
 *   psi that makes the true c_sharp ~ 0.582 (imp-97206) positive. The only surviving architecture remains the direct
 *   PSWF-basis compression G_{mn} = int sigma_2 phi_m phi_n with a certified t^4-weighted cross-moment tail bound
 *   (imp-97435 Reading B) -- no split, no factorisation. No operator positivity claimed; no coercivity constant; NO
 *   bound moves; interval-rigorous reach stays 2a <= 0.96; no refereed bound is changed; RH open; NO QED.
 *   SUB-GAP IMP97436_FEJER_RIESZ_REMAINDER_IRREDUCIBLE_COLLAPSES_TO_SIGNED_SPLIT.
 *
 * @see imp-97435-krein-weighted-pswf-eigendecay-assessment.js (sibling spectral primitive; signed split caps <=0; Reading B is the survivor)
 * @see imp-97416-krein-csharp-bathtub-joint-floor.js (scalar two-budget coupling exhausted; named this factorisation; floor -3065.435)
 * @see imp-97362-w1-negative-at-ln3-honest-status.js (w_1 pointwise NEGATIVE at the band edge ln3)
 * @see imp-97335-krein-csharp-naive-lowerbound-tlimit.js (naive floor -4336.198 = well depth = the irreducible remainder minimum)
 * @see imp-97206-krein-csharp-coupled-nt-jointlimit.js (measured c_sharp ~0.582 UPPER bracket -- the positive truth the split discards)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (w_1, sigma_2; pole-free Weil positivity; reach 2a<=0.96)
 *
 * Ticket: imp-97436 (proof, medium, opus-4-8). Attempt/assessment only; changes no bound; NO QED;
 * no refereed bound is changed.
 */

import { w1, sigma2 } from './rh-route-i-toeplitz-krein-certificate-2026-09-24.js';

const LN3 = Math.log(3);   // 1.0986122886681098 -- the binding 2a for the Krein floor
const A = LN3 / 2;         // 0.5493061443340548 -- the half-width a (2a = ln3)

export const IMP97436_BINDING_2A = LN3;
export const IMP97436_RIGOROUS_REACH_2A = 0.96; // unchanged by this assessment

// The irreducible pointwise lower bound on any Fejer-Riesz remainder r = |q|^2 - sigma_2 is (sigma_2)^- on the
// negativity set. Report its magnitude at the band edge and at the well minimum (both q-independent).
function negPart(t) { const v = sigma2(t); return v < 0 ? -v : 0; }

function wellMinDepth(h) {
  let mn = Infinity, at = 0;
  for (let t = 0; t <= 12; t += h) { const v = sigma2(t); if (v < mn) { mn = v; at = t; } }
  return { depth: mn, at };
}

const REMAINDER_MIN_AT_EDGE = negPart(LN3);          // ~5.508 -- r(ln3) >= this for EVERY admissible q
const WELL = wellMinDepth(0.002);                    // depth ~ -4336.198 at t ~ 9.35
const REMAINDER_MIN_AT_WELL = -WELL.depth;           // ~4336.198 -- r >= this at the well min

export const IMP97436_ASSESSMENT = Object.freeze({
  binding_2a: LN3,
  w1AtEdge: w1(LN3),                                 // ~ -2.5946 (negative -- imp-97362)
  sigma2AtEdge: sigma2(LN3),                         // ~ -5.508  (negative band edge)
  remainderMinAtEdge: REMAINDER_MIN_AT_EDGE,         // ~5.508 -- r(ln3) >= (sigma_2)^-(ln3), q-independent
  wellMinDepth: WELL.depth,                          // ~ -4336.198 (= imp-97335 floor = well depth)
  wellMinAt: WELL.at,                                // ~9.35
  remainderMinAtWell: REMAINDER_MIN_AT_WELL,         // ~4336.198 -- r >= this at the well, cannot be "small"
  measuredUpperBracket: 0.582,                       // imp-97206 (true c_sharp is positive)
  // Obstruction 1 -- irreducible remainder on the negativity set
  remainderPinnedByNegativePart: true,              // r >= (sigma_2)^- pointwise wherever sigma_2 < 0, for ANY q
  remainderNotCertifiedSmall: true,                 // >= 5.508 at edge, >= 4336 at well: no sup/L^inf smallness
  operatorBoundIsWrongDirection: true,              // r >= (sigma_2)^- gives an UPPER bound on P_a M_sigma2 P_a
  pointwiseMinimalRemainderIsSignedSplit: true,     // |q|^2 = (sigma_2)^+ => r = (sigma_2)^- = the signed split
  collapsesToSignedSplitCapZero: true,              // c_sharp >= -lambda_max(P_a M_{(sigma_2)^-} P_a) <= 0
  // Obstruction 2 -- factorisation hypothesis fails (class / type)
  symbolNotNonnegative: true,                       // sigma_2 < 0 near edge and on the well (~57% of [0,12])
  symbolNotFiniteExponentialType: true,             // theta prime(t) ~ (1/2)log(t/2pi), not band-limited to any PW_b
  symbolNotIntegrable: true,                         // (t^2+1/4)^2 factor: sigma_2 ~ t^4 -> +inf, non-integrable
  // program state -- unchanged
  positivityProved: false,
  operatorPositivityProved: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});

export const IMP97436_VERDICT = Object.freeze({
  ticket: 'imp-97436',
  question:
    'attempt the Fejer-Riesz / de Branges square factorisation sigma_2 = |q|^2 - r (q admissible on PW_a, r a ' +
    'certified-small remainder) as the second imp-97416 spectral primitive for c_sharp = lambda_min(P_a M_{sigma_2} ' +
    'P_a) > 0 at 2a = ln3: construct q, bound r, report a certified positive margin or the precise obstruction.',
  answer:
    'no certified positive margin -- the factorisation route is obstructed, exactly as imp-97416 anticipated ' +
    '(negative-w_1 edge vs admissible q). OBSTRUCTION 1 (irreducible remainder): for ANY q, |q|^2 >= 0 forces ' +
    'r = |q|^2 - sigma_2 >= (sigma_2)^- pointwise wherever sigma_2 < 0, so r is NOT certified-small -- r(ln3) >= ' +
    '5.508 at the band edge and r >= 4336.198 at the well minimum t ~ 9.35 (= the imp-97335 well depth), with ' +
    'sigma_2 negative on ~57% of [0,12]. The pointwise order lifts to M_r >= M_{(sigma_2)^-}, giving an UPPER ' +
    'bound on P_a M_{sigma_2} P_a (wrong direction), and the pointwise-minimal admissible remainder r = (sigma_2)^- ' +
    '(q capturing exactly (sigma_2)^+) is just the SIGNED SPLIT, so c_sharp >= -lambda_max(P_a M_{(sigma_2)^-} P_a) ' +
    '<= 0 -- the route collapses onto imp-97435 Reading A and inherits its <= 0 ceiling, q-independently. ' +
    'OBSTRUCTION 2 (hypothesis fails): the Krein-Fejer-Riesz theorem needs sigma_2 nonnegative AND entire of ' +
    'exponential type <= 2a and integrable; sigma_2 is negative (edge + well), theta prime(t) is not band-limited ' +
    '(grows ~ (1/2)log(t/2pi)), and (t^2+1/4)^2 makes sigma_2 ~ t^4 non-integrable, so no admissible q reproduces ' +
    'sigma_2 off the band core. Both imp-97416 FINDING 2 primitives are now obstructed for the same reason: any ' +
    'split/factorisation discards the sigma_2^+ / sigma_2^- cancellation on the SAME band-limited psi that makes ' +
    'the true c_sharp ~ 0.582 positive. The surviving architecture is the split-free direct PSWF compression ' +
    'G_{mn} = int sigma_2 phi_m phi_n with a certified t^4-weighted cross-moment tail bound (imp-97435 Reading B).',
  binding_2a: LN3,
  // Obstruction 1
  remainderPinnedByNegativePart: true,
  remainderNotCertifiedSmall: true,
  operatorBoundIsWrongDirection: true,
  pointwiseMinimalRemainderIsSignedSplit: true,
  collapsesToSignedSplitCapZero: true,
  // Obstruction 2
  symbolNotNonnegative: true,
  symbolNotFiniteExponentialType: true,
  symbolNotIntegrable: true,
  // program state
  positivityProved: false,
  operatorPositivityProved: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  survivingArchitecture:
    'split-free direct PSWF-basis compression G_{mn} = int sigma_2 phi_m phi_n, c_sharp = lambda_min(G), with a ' +
    'certified t^4-weighted PSWF cross-moment (Schur/Weyl) tail bound (imp-97435 Reading B) -- the only route that ' +
    'keeps the sigma_2^+ / sigma_2^- cancellation.',
  subGap:
    'IMP97436_FEJER_RIESZ_REMAINDER_IRREDUCIBLE_COLLAPSES_TO_SIGNED_SPLIT -- the Fejer-Riesz / de Branges square ' +
    'factorisation sigma_2 = |q|^2 - r (q admissible on PW_a) does NOT close the sign of c_sharp = lambda_min(P_a ' +
    'M_{sigma_2} P_a) at 2a = ln3. For ANY q, |q|^2 >= 0 forces r >= (sigma_2)^- pointwise on the negativity set, ' +
    'so the remainder is irreducibly large (>= 5.508 at the ln3 edge, >= 4336.198 at the well) and cannot be ' +
    'certified-small; the pointwise-minimal remainder r = (sigma_2)^- is the SIGNED SPLIT, collapsing the route ' +
    'onto imp-97435 Reading A (c_sharp >= -lambda_max(P_a M_{(sigma_2)^-} P_a) <= 0, binding eigenvalue is the ' +
    'largest). Separately the factorisation hypothesis fails outright: sigma_2 is neither nonnegative (edge + well) ' +
    'nor of finite exponential type (theta prime not band-limited; sigma_2 ~ t^4 non-integrable). This refines ' +
    'IMP97435_WEIGHTED_PSWF_DECAY_IS_WRONG_DECAY_NEEDS_T4_WEIGHTED_MOMENT_TAIL: BOTH imp-97416 FINDING 2 spectral ' +
    'primitives are obstructed, and the only survivor is the split-free direct PSWF compression with a certified ' +
    't^4-weighted cross-moment tail bound. No operator positivity; no bound moves; interval-rigorous reach stays ' +
    '2a <= 0.96.',
  qed: false,
});
export default IMP97436_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97436_ASSERTIONS = [
  {
    id: 'imp97436-symbol-negative-at-edge-and-well',
    holds: () => {
      const okEdge = w1(LN3) < 0 && sigma2(LN3) < 0 && Math.abs(sigma2(LN3) - (-5.5075)) < 0.01;
      const okWell = WELL.depth < -4000 && Math.abs(WELL.depth - (-4336.198)) < 0.5 && Math.abs(WELL.at - 9.35) < 0.1;
      return okEdge && okWell;
    },
    why: 'sigma_2 is negative both at the band edge ln3 (w_1(ln3) ~ -2.59, sigma_2(ln3) ~ -5.51) and on the deep well (min ~ -4336.198 at t ~ 9.35) -- so the Fejer-Riesz remainder r = |q|^2 - sigma_2 >= (sigma_2)^- is pinned large there for every admissible q, the sign obstruction.',
  },
  {
    id: 'imp97436-remainder-irreducible-lower-bound',
    holds: () => {
      // r(t) = |q|^2 - sigma_2 >= -sigma_2 = (sigma_2)^- for EVERY q, at every t with sigma_2 < 0.
      // Verify (sigma_2)^- is bounded away from 0 on a spread of negativity points (not a thin sliver).
      let negCount = 0, total = 0;
      for (let t = 0.001; t <= 12; t += 0.01) { total++; if (sigma2(t) < 0) negCount++; }
      const frac = negCount / total;
      return REMAINDER_MIN_AT_EDGE > 5 && REMAINDER_MIN_AT_WELL > 4000 && frac > 0.5 && frac < 0.65;
    },
    why: 'the irreducible remainder floor (sigma_2)^- is >= 5.5 at the edge and >= 4336 at the well, and sigma_2 is negative on ~57% of [0,12] -- so r cannot be certified-small in any sup/L^inf sense; the pointwise-minimal choice r = (sigma_2)^- is the signed split, capping c_sharp <= 0.',
  },
  {
    id: 'imp97436-assessment-only-no-qed',
    holds: () =>
      IMP97436_VERDICT.remainderPinnedByNegativePart === true &&
      IMP97436_VERDICT.remainderNotCertifiedSmall === true &&
      IMP97436_VERDICT.operatorBoundIsWrongDirection === true &&
      IMP97436_VERDICT.pointwiseMinimalRemainderIsSignedSplit === true &&
      IMP97436_VERDICT.collapsesToSignedSplitCapZero === true &&
      IMP97436_VERDICT.symbolNotNonnegative === true &&
      IMP97436_VERDICT.symbolNotFiniteExponentialType === true &&
      IMP97436_VERDICT.symbolNotIntegrable === true &&
      IMP97436_VERDICT.positivityProved === false &&
      IMP97436_VERDICT.operatorPositivityProved === false &&
      IMP97436_VERDICT.boundMoves === false &&
      IMP97436_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97436_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97436_BINDING_2A - LN3) < 1e-12 &&
      typeof IMP97436_VERDICT.subGap === 'string' &&
      IMP97436_VERDICT.subGap.includes('IMP97436_FEJER_RIESZ_REMAINDER_IRREDUCIBLE_COLLAPSES_TO_SIGNED_SPLIT') &&
      IMP97436_VERDICT.subGap.includes('IMP97435_WEIGHTED_PSWF_DECAY_IS_WRONG_DECAY_NEEDS_T4_WEIGHTED_MOMENT_TAIL') &&
      IMP97436_VERDICT.qed === false,
    why: 'attempt/assessment only: the factorisation is obstructed twice over (irreducible remainder r >= (sigma_2)^- collapsing to the signed split <= 0; and the factorisation hypothesis failing since sigma_2 is neither nonnegative nor of finite exponential type). No positivity, no operator coercivity, no bound moves; interval-rigorous reach stays 2a <= 0.96; NO QED.',
  },
];

for (const t of IMP97436_ASSERTIONS) {
  if (!t.holds()) {
    throw new Error(`imp-97436-krein-fejer-riesz-factorisation-assessment assertion FAILED: ${t.id} -- ${t.why}`);
  }
}
