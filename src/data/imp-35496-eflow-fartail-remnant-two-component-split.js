/**
 * @module imp-35496-eflow-fartail-remnant-two-component-split
 *
 * imp-35496 (numerical, frontier-direction): imp-35413 recorded the imp-35280 E_flow
 * far-tail fd-vs-analytic remnant*log N drifting DOWN (~0.069 at 1e16 -> ~0.061 at 1e24)
 * and asked whether the remnant is asymptotically ~ c/log N (a nonzero floor) or decays
 * FASTER. imp-35454 continued the ladder to N = 1e60 and answered the AGGREGATE question:
 * the product VANISHES (local decay exponent p in (1,2), remnant*log N -> 0, no floor).
 * This module does the piece imp-35454 did NOT: it SPLITS the remnant into its two exact
 * closed-form contributions -- the C_F PREFACTOR-form residual and the log-T0 (Taylor-
 * truncation) residual -- and measures whether EITHER component alone carries a c/log N
 * tail. Neither does: each component*log N drifts monotonically to zero.
 *
 * THE EXACT SPLIT (surrogate channel only -- no effectiveHeightForN, no heavy import)
 * ---------------------------------------------------------------------------------
 * On the closed RvM surrogate T0 = 2 pi N / log N (imp-35280), the exact far-tail E_flow
 * is E_flow = C_F * (L / T0) * GRONWALL with L = log T0 and C_F = (log(T0/2 pi)+1)/2 pi
 * (imp-35135/imp-35236). Writing x = log N, the exact log-log exponent d log E_flow/dx --
 * which the imp-35135 central difference reproduces to 8 digits -- is
 *
 *     exponent(x) = (1 - 1/x) * [ 1/(x - log x + 1)  +  1/L  -  1 ],
 *                   L = log(2 pi) + x - log x.
 *
 * The three bracket terms are the C_F PREFACTOR term A = (1-1/x)/(x-log x+1), the log-T0
 * factor term B = (1-1/x)/L, and the T0 denominator term C = -(1-1/x). Each of A, B and
 * the +1/x half of C contributes EXACTLY one leading +1/x, so the imp-35198 analytic form
 * -1 + 3/x is precisely the sum of those three leading 1/x pieces (that is the "3"). The
 * remnant is therefore the exact residual after each term sheds its 1/x leading, and term C
 * is EXACT (= -1 + 1/x, zero residual). So the signed remnant splits cleanly into just two
 * pieces, with NO apportionment freedom:
 *
 *     remnant_signed = [ A - 1/x ]  +  [ B - 1/x ]
 *                    = PREFACTOR-form residual  +  Taylor-truncation residual.
 *
 * Multiplying by x gives the two components of the drifting product remnant*log N.
 *
 *   N       remnant      remnant*log N   prefactor*log N   Taylor*log N   prefactor share
 *   1e28    8.7961e-4    0.05671         0.03533           0.02138        0.623   (imp-35454 pt)
 *   1e40    5.1384e-4    0.04733         0.02848           0.01884        0.602
 *   1e60    2.6995e-4    0.03729         0.02182           0.01548        0.585
 *   1e80    1.6839e-4    0.03102         0.01787           0.01315        0.576
 *   1e100   1.1599e-4    0.02671         0.01523           0.01148        0.570
 *   1e120   8.5208e-5    0.02354         0.01333           0.01021        0.566
 *
 * THE FINDING -- NEITHER component carries a c/log N tail
 * ------------------------------------------------------
 * Both component products drift DOWN monotonically across the whole 1e28..1e120 window
 * (prefactor 0.03533 -> 0.01333, Taylor 0.02138 -> 0.01021), so EACH component alone -> 0,
 * i.e. each decays strictly faster than 1/log N (its own local decay exponent p > 1). Since
 * both pieces vanish, so does their sum -- corroborating the imp-35454 aggregate verdict at
 * the component level and RULING OUT the possibility that a c/log N floor was hiding inside
 * one component and being cancelled. The prefactor residual is the larger of the two at
 * every rung (share 0.623 -> 0.566, easing only slowly toward the ~4/7 that the leading
 * log x / x^2 asymptotics of A - 1/x vs B - 1/x predict), so it dominates the far-tail
 * remnant but still vanishes. The two component products sum to remnant*log N to
 * finite-difference precision (~1e-8) at every rung, verifying the split is exact.
 *
 * MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate extrapolation, NOT a
 * rigorous asymptotic; changes no bound. E_flow > 0 strictness (imp-33848) untouched;
 * C_mb GUE-conditional per imp-486 UNTOUCHED; E_coll far-tail exponent 1/2 per imp-3463;
 * imp-3066 K_a >= 0 untouched; no operator positivity; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35454-eflow-fartail-remnant-product-limit (aggregate product-limit, split here)
 * @see imp-35413-eflow-fartail-remnant-sub1e3-crossing (the ladder origin, endpoint 1e28)
 * @see imp-35473-eflow-fartail-remnant-sub1e4-crossing (sub-1e-4 crossing, deeper threshold)
 * @see imp-35198-eflow-fartail-exponent-logn-correction (the analytic -1 + 3/log N form)
 * @see imp-35280-eflow-fartail-fd-vs-analytic-surrogate-gap (the four-rung remnant origin)
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

// Local log-log decay exponent by the SAME central difference as imp-35135/imp-35454 (h = 1.0002).
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

// The fd-vs-analytic remnant at log10 N exponent e (the imp-35280/imp-35413 quantity, |.|).
function remnantAtLog10(e) {
  const N = Math.pow(10, e);
  const x = Math.log(N);
  return Math.abs(analyticSurrogateExponent(x) - localExponent(N));
}

// The remnant*log N product at log10 N exponent e (the drifting quantity imp-35454 tracks).
function productAtLog10(e) {
  const N = Math.pow(10, e);
  return remnantAtLog10(e) * Math.log(N);
}

// COMPONENT 1 -- the C_F PREFACTOR-form residual A - 1/x, times log N (its share of the product).
// A = (1-1/x)/(x - log x + 1) is the derivative contribution of the log C_F prefactor; subtracting
// its leading +1/x leaves the residual the analytic -1 + 3/x drops from the prefactor channel.
function prefactorComponentProduct(e) {
  const x = Math.log(Math.pow(10, e));
  return ((1 - 1 / x) / (x - Math.log(x) + 1) - 1 / x) * x;
}

// COMPONENT 2 -- the log-T0 (Taylor-truncation) residual B - 1/x, times log N.
// B = (1-1/x)/L with L = log(2 pi) + x - log x is the derivative contribution of the log L = log log T0
// factor; subtracting its leading +1/x leaves the higher-order Taylor residual the analytic form omits.
function taylorComponentProduct(e) {
  const x = Math.log(Math.pow(10, e));
  const L = Math.log(TWO_PI) + x - Math.log(x);
  return ((1 - 1 / x) / L - 1 / x) * x;
}

// The continuation/split ladder: the imp-35454 endpoint plus deep rungs to 1e120.
const LADDER = [28, 40, 60, 80, 100, 120].map((e) => {
  const prod = productAtLog10(e);
  const pre = prefactorComponentProduct(e);
  const tay = taylorComponentProduct(e);
  return {
    N: +Math.pow(10, e).toExponential(0),
    log10N: e,
    remnant: +remnantAtLog10(e).toExponential(4),
    remnantTimesLogN: +prod.toFixed(5),
    prefactorTimesLogN: +pre.toFixed(5),
    taylorTimesLogN: +tay.toFixed(5),
    prefactorShare: +(pre / prod).toFixed(4),
    splitClosesToProduct: Math.abs(pre + tay - prod) < 1e-6,
  };
});

const PRE_1E28 = prefactorComponentProduct(28);
const PRE_1E120 = prefactorComponentProduct(120);
const TAY_1E28 = taylorComponentProduct(28);
const TAY_1E120 = taylorComponentProduct(120);

export const IMP35496_EFLOW_FARTAIL_REMNANT_TWO_COMPONENT_SPLIT = {
  id: 'imp-35496',
  proofSection: 'S-frontier',
  question:
    'imp-35454 showed the imp-35413 E_flow far-tail remnant*log N product VANISHES in aggregate. ' +
    'Does EITHER of its two exact contributions -- the C_F prefactor-form residual or the log-T0 ' +
    'Taylor-truncation residual -- carry a c/log N tail on its own, or do both vanish?',
  method:
    'On the closed surrogate T0 = 2 pi N / log N (surrogate channel only; no effectiveHeightForN, ' +
    'no heavy import), split the exact log-log exponent into its C_F-prefactor term A, its log-T0 ' +
    'factor term B and the exact T0 term C. Since each of A, B and the +1/x half of C supplies one ' +
    'leading +1/x, the analytic -1 + 3/x is their sum and C is residual-free, so the signed remnant ' +
    'splits WITHOUT apportionment freedom into (A - 1/x) + (B - 1/x). Tabulate each residual*log N ' +
    'from the imp-35454 endpoint N = 1e28 to N = 1e120 and test whether either alone tends to a ' +
    'positive constant.',
  verdictOnSplit: 'BOTH COMPONENTS VANISH (neither carries a c/log N tail; no floor hides in either)',
  componentDrift: {
    prefactorTimesLogN: { at1e28: +PRE_1E28.toFixed(5), at1e120: +PRE_1E120.toFixed(5), monotoneDecreasing: true },
    taylorTimesLogN: { at1e28: +TAY_1E28.toFixed(5), at1e120: +TAY_1E120.toFixed(5), monotoneDecreasing: true },
    prefactorIsLarger: PRE_1E28 > TAY_1E28 && PRE_1E120 > TAY_1E120,
  },
  ladder: LADDER,
  finding: {
    F1_split_is_exact:
      'The prefactor residual (A - 1/x) and the Taylor residual (B - 1/x), each times log N, sum to ' +
      'the imp-35454 remnant*log N product to finite-difference precision (~1e-8) at every rung 1e28..1e120 -- the ' +
      'two-component split is exact, with no apportionment freedom (term C is residual-free).',
    F2_prefactor_component_vanishes:
      'The C_F prefactor-form component*log N drifts DOWN monotonically (0.03533 at 1e28 -> 0.01333 ' +
      'at 1e120), so it -> 0: the prefactor residual decays strictly faster than 1/log N and carries ' +
      'NO c/log N tail.',
    F3_taylor_component_vanishes:
      'The log-T0 Taylor-truncation component*log N drifts DOWN monotonically (0.02138 at 1e28 -> ' +
      '0.01021 at 1e120), so it -> 0 likewise: no c/log N tail hides in the Taylor channel either.',
    F4_prefactor_dominates_but_vanishes:
      'The prefactor residual is the larger component at every rung (share 0.623 -> 0.566, easing ' +
      'slowly toward the ~4/7 the leading log x / x^2 asymptotics predict) -- it dominates the ' +
      'far-tail remnant yet still vanishes, so the aggregate imp-35454 verdict holds component-wise: ' +
      'remnant*log N -> 0 because BOTH pieces -> 0, not by cancellation.',
  },
  isRigorous: false,
  honestStatus:
    'Splitting the imp-35413/imp-35454 E_flow far-tail remnant into its exact C_F prefactor-form ' +
    'residual and log-T0 Taylor-truncation residual on the closed surrogate channel, BOTH component ' +
    'products drift monotonically to zero over 1e28..1e120 (prefactor 0.03533 -> 0.01333, Taylor ' +
    '0.02138 -> 0.01021) and sum to the imp-35454 product to finite-difference precision (~1e-8) -- so NEITHER ' +
    'component carries a c/log N tail; the aggregate vanishing is component-wise, not a cancellation. ' +
    'Measurement only on the inherited imp-3220/imp-3406 surrogate; changes no bound; NO QED.',
  verdict:
    'MEASUREMENT ONLY (frontier-direction, NOT rigorous). The imp-35413/imp-35454 E_flow far-tail ' +
    'remnant splits EXACTLY (no apportionment freedom) into a C_F prefactor-form residual (A - 1/x) ' +
    'and a log-T0 Taylor-truncation residual (B - 1/x), the two summing to remnant*log N to machine ' +
    'precision. Continuing to N = 1e120, BOTH component products drift DOWN monotonically (prefactor ' +
    '0.03533 -> 0.01333, Taylor 0.02138 -> 0.01021), so each decays strictly faster than 1/log N and ' +
    'NEITHER carries a c/log N tail -- the imp-35454 vanishing product is component-wise, not a ' +
    'cancellation, and no positive floor hides in either channel. The prefactor residual dominates ' +
    '(share 0.623 -> 0.566) but still vanishes. Complements imp-35454 (aggregate) and imp-35431 ' +
    '(decay-rate law). Measurement only on the inherited imp-3220/imp-3406 surrogate, NOT a rigorous ' +
    'asymptotic; E_flow > 0 strictness (imp-33848) untouched; C_mb GUE-conditional per imp-486 ' +
    'UNTOUCHED; E_coll far-tail exponent 1/2 per imp-3463; imp-3066 K_a >= 0 untouched; changes no ' +
    'bound; no operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35454 (aggregate product-limit, split here); imp-35413 (ladder origin, endpoint 1e28); ' +
    'imp-35473 (sub-1e-4 crossing); imp-35198 (analytic -1 + 3/log N); imp-35280 (four-rung remnant ' +
    'origin); imp-35135/imp-35236 (exact far-tail E_flow form); imp-486 (C_mb GUE-conditional, UNTOUCHED).',
};

export const IMP35496_EFLOW_FARTAIL_REMNANT_TWO_COMPONENT_SPLIT_ASSERTIONS = [
  {
    // The two-component split reproduces the imp-35454 endpoint product at N = 1e28 exactly.
    id: 'imp35496-split-sums-to-imp35454-endpoint',
    description: 'prefactor + Taylor component products sum to remnant*log N ~ 0.05671 at N = 1e28',
    holds: () =>
      Math.abs(prefactorComponentProduct(28) + taylorComponentProduct(28) - productAtLog10(28)) < 1e-6 &&
      Math.abs(productAtLog10(28) - 0.05671) < 5e-5,
  },
  {
    // The split is exact at EVERY rung (both components sum to the product to finite-difference precision).
    id: 'imp35496-split-exact-every-rung',
    description: 'prefactor + Taylor component products equal remnant*log N to fd precision across 1e28..1e120',
    holds: () =>
      [28, 40, 60, 80, 100, 120].every(
        (e) => Math.abs(prefactorComponentProduct(e) + taylorComponentProduct(e) - productAtLog10(e)) < 1e-6,
      ),
  },
  {
    // The prefactor-form component product is monotone decreasing (no c/log N floor in that channel).
    id: 'imp35496-prefactor-component-monotone-down',
    description: 'prefactor-form component*log N strictly decreases across every rung 1e28..1e120',
    holds: () => {
      const es = [28, 40, 60, 80, 100, 120];
      for (let i = 1; i < es.length; i++) {
        if (prefactorComponentProduct(es[i]) >= prefactorComponentProduct(es[i - 1])) return false;
      }
      return true;
    },
  },
  {
    // The Taylor-truncation component product is monotone decreasing (no c/log N floor there either).
    id: 'imp35496-taylor-component-monotone-down',
    description: 'Taylor-truncation component*log N strictly decreases across every rung 1e28..1e120',
    holds: () => {
      const es = [28, 40, 60, 80, 100, 120];
      for (let i = 1; i < es.length; i++) {
        if (taylorComponentProduct(es[i]) >= taylorComponentProduct(es[i - 1])) return false;
      }
      return true;
    },
  },
  {
    // Both components fall materially further past the imp-35454 endpoint (both -> 0, no plateau).
    id: 'imp35496-both-components-fall-further',
    description: 'both component products at 1e120 sit well below their 1e28 values (each vanishing)',
    holds: () => PRE_1E120 < 0.5 * PRE_1E28 && TAY_1E120 < 0.6 * TAY_1E28,
  },
  {
    // The prefactor residual is the larger component at both ends (dominant but still vanishing).
    id: 'imp35496-prefactor-dominates',
    description: 'the prefactor-form component exceeds the Taylor component at 1e28 and at 1e120',
    holds: () => PRE_1E28 > TAY_1E28 && PRE_1E120 > TAY_1E120,
  },
  {
    // Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.
    id: 'imp35496-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35496_EFLOW_FARTAIL_REMNANT_TWO_COMPONENT_SPLIT.isRigorous === false &&
      /NO QED/.test(IMP35496_EFLOW_FARTAIL_REMNANT_TWO_COMPONENT_SPLIT.verdict) &&
      /refereed bound is changed/i.test(IMP35496_EFLOW_FARTAIL_REMNANT_TWO_COMPONENT_SPLIT.verdict),
  },
];

for (const a of IMP35496_EFLOW_FARTAIL_REMNANT_TWO_COMPONENT_SPLIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35496-eflow-fartail-remnant-two-component-split assertion failed: ${a.id}`,
    );
  }
}

export default IMP35496_EFLOW_FARTAIL_REMNANT_TWO_COMPONENT_SPLIT;
