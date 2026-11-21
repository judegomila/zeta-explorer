/**
 * @module imp-35808-i3-long-edge-derivative-delivery-scope
 *
 * imp-35808 (proof/assessment, S-frontier): ASSESS what a certified interval lower bound
 * on inf|H_t prime| along a LONG edge |y| = h of the rectangle boundary dR REQUIRES, and
 * whether the imp-35681 Part A / imp-35725 enclosure CAN DELIVER it. imp-35799 already
 * derived the correct OBJECT -- the differentiated reverse-triangle barrier margin
 * M_prime = inf( |A_t prime + B_t prime| - |C_t prime| ) with delta_long >= M_prime . h --
 * and named it GREENFIELD sub-gap SG-1. This module asks the SEPARATE, downstream question:
 * does the enclosure the repo ALREADY names (the imp-35681 Part A / imp-35725 evaluator of
 * the UNDIFFERENTIATED margin M = |A_t + B_t| - |C_t|) supply M_prime, and if not, exactly
 * WHAT must be added to it.
 *
 * ASSESSMENT / DELIVERY-FEASIBILITY SCOPING ONLY. Establishes no positivity; certifies no
 * non-vanishing; lower-bounds no inf|H_t prime| numerically; evaluates no derivative on any
 * edge; builds no enclosure; fixes no Delta or h; changes no bound; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * WHAT THE imp-35725 ENCLOSURE ACTUALLY DELIVERS (the UNDIFFERENTIATED margin M)
 * -----------------------------------------------------------------------------
 * The imp-35681 Part A / imp-35725 object is a certified interval evaluation of the
 * effective approximation H_t = A_t + B_t - C_t at REAL argument, producing the barrier
 * margin M = |A_t + B_t| - |C_t| via the reverse triangle inequality, with a truncation
 * cap C_t = E_A + E_B + E_{C_0} (imp-35725) plus directed-rounding error (imp-35761). It
 * evaluates the VALUE of H_t and its modulus floor |H_t| >= M (imp-35758). It carries the
 * UNDIFFERENTIATED retained coefficients only; it never differentiates the series.
 *
 * WHY IT CANNOT DELIVER inf|H_t prime| AS INSTANTIATED (value vs derivative are DISTINCT)
 * -----------------------------------------------------------------------------
 * inf|H_t prime| is a property of H_t prime, NOT of H_t. A modulus floor on the VALUE
 * |H_t| >= M gives ZERO information about the DERIVATIVE modulus |H_t prime|: |H_t| can be
 * bounded away from 0 while |H_t prime| dips to 0 at a modulus-critical point (and vice
 * versa). So the imp-35725 enclosure -- which produces M, the value margin -- does NOT
 * deliver M_prime, the derivative margin. The answer to the ticket question is: NO, not as
 * instantiated. The enclosure delivers the WRONG object for a derivative floor.
 *
 * THE DELIVERY GAP DECOMPOSES INTO EXACTLY TWO ADDED CHANNELS (D1, D2)
 * -----------------------------------------------------------------------------
 * imp-35799 named SG-1 ("a differentiated A + B - C interval enclosure") as one lump and
 * imp-35803 identified it with I1b (the differentiated F_prime read-out). This module
 * itemizes what re-instantiating the SAME evaluator on H_t prime concretely REQUIRES, and
 * finds it is exactly two additions to the imp-35725 enclosure:
 *   (D1) DIFFERENTIATED COEFFICIENTS -- each of the N ~ 4.886e5 retained terms must be
 *        multiplied by its z-derivative log-frequency factor (bounded by log N ~ w). The
 *        imp-35725 enclosure holds only the undifferentiated coefficients, so this is a
 *        term-by-term re-weighting of the SAME retained sum (same term count N).
 *   (D2) AN INDEPENDENT DIFFERENTIATED TRUNCATION CAP C_t prime = E_A prime + E_B prime +
 *        E_{C_0} prime. This is a NEW error budget, NOT recyclable from the imp-35725 cap
 *        C_t: differentiation and truncation do NOT commute for the error bound -- the tail
 *        of the differentiated series is its OWN object, larger than C_t by roughly the same
 *        log-frequency factor (~ w), so re-using C_t as a proxy for C_t prime would be
 *        UNCERTIFIED. C_t bounds the value tail; C_t prime must bound the derivative tail.
 * Both D1 and D2 feed the SAME reverse-triangle read-out M_prime = |A_t prime + B_t prime|
 * - |C_t prime| and the SAME directed-rounding machinery (imp-35761 cost, now on a sum
 * whose terms carry an extra ~ w factor -- the accumulation OOM is imp-35761's times ~ w,
 * still ~ 10 orders below the O(1) margin, so precision remains non-binding).
 *
 * DELIVERY VERDICT: SAME MACHINERY, NOT THE SAME INSTANCE (a mechanical re-instantiation)
 * -----------------------------------------------------------------------------
 * The imp-35681 Part A / imp-35725 enclosure CAN deliver inf|H_t prime| only AFTER a
 * mechanical re-instantiation on H_t prime: same term count N, same reverse-triangle
 * architecture, same interval-sum engineering, differing only by the two channels D1
 * (log-frequency-scaled coefficients) and D2 (an independent differentiated cap C_t prime).
 * It ADDS NO greenfield MECHANISM -- I3 stays strictly downstream of W1 (imp-35727) -- but
 * it is NOT the SAME instance: the existing enclosure evaluates the value H_t, not the
 * derivative H_t prime. This isolates imp-35799 SG-1 (= imp-35803 I1b) as the SOLE delivery
 * blocker for the long-edge floor and resolves its internal structure into D1 + D2, the
 * concrete work re-instantiation entails. SG-2 (imp-35799 non-grazing edge placement) is a
 * SEPARATE positivity requirement on M_prime at the worst edge point and is NOT a delivery
 * question -- no enclosure, differentiated or not, can supply M_prime > 0 without it.
 *
 * WHAT THIS DOES NOT DO
 * -----------------------------------------------------------------------------
 * Assessment / delivery-feasibility scoping only. Builds no differentiated enclosure; adds
 * no coefficients; budgets no C_t prime numerically; evaluates no A_t prime / B_t prime /
 * C_t prime; produces no numeric M_prime; verifies no M_prime > 0; certifies no
 * non-vanishing; establishes no positivity; changes no bound; C_mb GUE-conditional
 * (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35799-i3-long-edge-derivative-floor-scope (derives the object M_prime; names SG-1/SG-2)
 * @see imp-35803-i1-interval-enclosure-per-edge-scope (I1b = differentiated F_prime = imp-35799 SG-1)
 * @see imp-35778-i3-edge-type-floor-decomposition-scope (delta_long ~ inf|H_t prime| . h; sup-B proxy flagged)
 * @see imp-35725-w1-effective-error-cap-budget (the UNDIFFERENTIATED margin M and its cap C_t = E_A+E_B+E_{C_0})
 * @see imp-35761-w1-certified-rounding-cost-scope (interval-sum accumulation cost ~ N*eps, non-binding)
 * @see imp-35758-i3-modulus-floor-margin-tie-scope (value floor |H_t| >= M -- the object the enclosure delivers)
 * @see imp-35681-w1-w2-w4-existing-infra-inventory (Part A: A+B-C interval enclosure greenfield)
 * @see imp-35727-w2-certified-winding-count-ingredients-scope (I3 downstream of W1)
 * @see Polymath15 2019 (H_t = A + B - C, barrier method); Platt-Trudgian 2021
 */

// -- Anchor + operative constants (import-light; matching imp-35799 / imp-35803 / imp-35725) --
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this scoping
const N_AT_TPT = Math.floor(Math.sqrt(T_PT / (4 * Math.PI))); // ~488602 retained terms (imp-35674 Part D)

// Winding / derivative log-scale w(T) = (1/2) log(T / 2 pi) (imp-35757 / imp-35777).
const windingRate = (T) => 0.5 * Math.log(T / (2 * Math.PI));
const W_TPT = windingRate(T_PT); // ~13.446

// Log-frequency ceiling from term-by-term differentiation (same as imp-35799): <= log N ~ w.
const LOG_N_TPT = Math.log(N_AT_TPT); // ~13.10, ~ w scale (log N = w - (1/2)log 2)

// Illustrative delivery-cost OOM: the differentiated interval sum re-uses the imp-35761
// accumulation model on the SAME N terms, each now carrying an extra factor ~ w (channel
// D1), so the certified accumulation width is imp-35761's times ~ w. Even so it stays many
// orders below the O(1) barrier margin -- precision is NOT the binding delivery constraint.
const DBL_EPS = 2.220446049250313e-16; // binary64 unit roundoff
const ACCUM_UNDIFF = N_AT_TPT * DBL_EPS; // ~1.08e-10 (imp-35761 double-precision N*eps model)
const ACCUM_DIFF = ACCUM_UNDIFF * W_TPT; // ~1.5e-9, still ~ 9 orders below the O(1) margin

export const IMP35808_I3_LONG_EDGE_DERIVATIVE_DELIVERY_SCOPE = {
  id: 'imp-35808',
  proofSection: 'S-frontier',
  question:
    'Assess what a certified interval lower bound on inf|H_t prime| along a LONG edge of dR REQUIRES, and whether the ' +
    'imp-35681 Part A / imp-35725 enclosure CAN DELIVER it. Assessment / delivery-feasibility scoping only; builds no ' +
    'enclosure; establishes no positivity; NO QED.',
  whatEnclosureDelivers: {
    object:
      'the UNDIFFERENTIATED barrier margin M = |A_t + B_t| - |C_t| (value modulus floor |H_t| >= M, imp-35758), from a ' +
      'certified real-argument interval evaluation of H_t = A_t + B_t - C_t with truncation cap C_t = E_A + E_B + ' +
      'E_{C_0} (imp-35725) and directed-rounding error (imp-35761)',
    carriesUndifferentiatedCoefficientsOnly: true,
  },
  cannotDeliverAsInstantiated:
    'inf|H_t prime| is a property of H_t prime, NOT of H_t: the value floor |H_t| >= M gives ZERO information about the ' +
    'derivative modulus |H_t prime| (|H_t| can be bounded away from 0 while |H_t prime| dips to 0 at a modulus-critical ' +
    'point). So the imp-35725 enclosure produces the WRONG object for a derivative floor -- answer: NO, not as instantiated',
  deliveryGapChannels: {
    'D1':
      'DIFFERENTIATED COEFFICIENTS -- each of the N ~ 4.886e5 retained terms multiplied by its z-derivative ' +
      'log-frequency factor (<= log N ~ w); the imp-35725 enclosure holds only the undifferentiated coefficients, so ' +
      'this is a term-by-term re-weighting of the SAME retained sum (same term count N)',
    'D2':
      'AN INDEPENDENT DIFFERENTIATED TRUNCATION CAP C_t prime = E_A prime + E_B prime + E_{C_0} prime -- a NEW error ' +
      'budget NOT recyclable from the imp-35725 cap C_t: differentiation and truncation do NOT commute for the error ' +
      'bound, so the derivative-series tail is its OWN object (larger than C_t by ~ w); re-using C_t as a proxy would ' +
      'be UNCERTIFIED. C_t bounds the value tail; C_t prime must bound the derivative tail',
  },
  deliveryVerdict:
    'SAME MACHINERY, NOT THE SAME INSTANCE: the enclosure CAN deliver inf|H_t prime| only after a MECHANICAL ' +
    're-instantiation on H_t prime -- same term count N, same reverse-triangle read-out M_prime = |A_t prime + B_t ' +
    'prime| - |C_t prime|, same directed-rounding machinery -- differing only by channels D1 (log-frequency-scaled ' +
    'coefficients) and D2 (an independent cap C_t prime); ADDS NO greenfield MECHANISM (I3 downstream of W1), but the ' +
    'existing instance evaluates the VALUE H_t, not the derivative H_t prime',
  isolatesSoleDeliveryBlocker:
    'this resolves imp-35799 SG-1 (= imp-35803 I1b, the differentiated A+B-C enclosure) into its two concrete channels ' +
    'D1 + D2 and identifies it as the SOLE delivery blocker; imp-35799 SG-2 (non-grazing edge placement) is a SEPARATE ' +
    'positivity requirement on M_prime, NOT a delivery question -- no enclosure supplies M_prime > 0 without it',
  windingRateTPT: W_TPT,
  logNTPT: LOG_N_TPT,
  retainedTermsAtTPT: N_AT_TPT,
  accumUndifferentiated: ACCUM_UNDIFF,
  accumDifferentiated: ACCUM_DIFF,
  isRigorous: false,
  verdict:
    'ASSESSMENT / DELIVERY-FEASIBILITY SCOPING (frontier-direction, NOT rigorous). QUESTION: does the imp-35681 Part A ' +
    '/ imp-35725 enclosure deliver a certified inf|H_t prime| lower bound for the imp-35778 long-edge floor delta_long ' +
    '>= inf|H_t prime| . h? FINDING: NO, not as instantiated -- that enclosure evaluates the VALUE H_t and produces the ' +
    'UNDIFFERENTIATED margin M = |A_t + B_t| - |C_t| (the value floor |H_t| >= M, imp-35758), which carries ZERO ' +
    'information about the DERIVATIVE modulus (|H_t| bounded off 0 does NOT bound |H_t prime| off 0). The object needed ' +
    'is imp-35799 M_prime = inf(|A_t prime + B_t prime| - |C_t prime|), a property of H_t prime not H_t. DELIVERY GAP: ' +
    're-instantiating the SAME evaluator on H_t prime requires exactly two additions -- (D1) log-frequency-scaled ' +
    'coefficients (each of the N ~ 4.886e5 retained terms times its d/dz factor <= log N ~ w) and (D2) an INDEPENDENT ' +
    'differentiated truncation cap C_t prime, NOT recyclable from the imp-35725 cap C_t because differentiation and ' +
    'truncation do not commute (the derivative tail is its own object, ~ w larger). Both feed the SAME reverse-triangle ' +
    'read-out and the SAME imp-35761 directed-rounding machinery (accumulation ~ w times imp-35761, still ~ 9 orders ' +
    'below the O(1) margin, precision non-binding). VERDICT: same MACHINERY, NOT the same INSTANCE -- a MECHANICAL ' +
    're-instantiation that ADDS NO greenfield mechanism (I3 downstream of W1, imp-35727), isolating imp-35799 SG-1 ' +
    '(= imp-35803 I1b) as the SOLE delivery blocker and resolving it into channels D1 + D2; imp-35799 SG-2 (non-grazing ' +
    'placement) is a SEPARATE positivity requirement, not a delivery question. Builds no enclosure; adds no ' +
    'coefficients; budgets no C_t prime; evaluates no derivative; produces no numeric M_prime; verifies no M_prime > 0; ' +
    'certifies no non-vanishing; establishes no positivity; changes no bound; C_mb GUE-conditional (imp-486) untouched; ' +
    'no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35799 (object M_prime; SG-1/SG-2); imp-35803 (I1b = differentiated F_prime = SG-1); imp-35778 (delta_long >= ' +
    'inf|H_t prime| . h); imp-35725 (undifferentiated margin M, cap C_t = E_A+E_B+E_{C_0}); imp-35761 (interval-sum ' +
    'accumulation cost); imp-35758 (value floor |H_t| >= M); imp-35681 Part A (A+B-C enclosure greenfield); imp-35727 ' +
    '(I3 downstream of W1); imp-35674 Part D (N(x)=floor(sqrt(x/4 pi))); imp-35757 (w = (1/2)log(T/2pi)); Polymath15 ' +
    '2019 (H_t = A + B - C, barrier method); Platt-Trudgian 2021.',
};

export const IMP35808_I3_LONG_EDGE_DERIVATIVE_DELIVERY_SCOPE_ASSERTIONS = [
  {
    // The imp-35725 enclosure delivers the UNDIFFERENTIATED value margin M, undifferentiated coefficients only.
    id: 'imp35808-enclosure-delivers-value-margin',
    description: 'imp-35681 Part A / imp-35725 enclosure delivers the UNDIFFERENTIATED margin M = |A+B|-|C| (value floor), coefficients undifferentiated',
    holds: () =>
      /UNDIFFERENTIATED barrier margin M/.test(IMP35808_I3_LONG_EDGE_DERIVATIVE_DELIVERY_SCOPE.whatEnclosureDelivers.object) &&
      /value modulus floor/.test(IMP35808_I3_LONG_EDGE_DERIVATIVE_DELIVERY_SCOPE.whatEnclosureDelivers.object) &&
      IMP35808_I3_LONG_EDGE_DERIVATIVE_DELIVERY_SCOPE.whatEnclosureDelivers.carriesUndifferentiatedCoefficientsOnly === true,
  },
  {
    // It CANNOT deliver inf|H_t prime| as instantiated: value floor gives ZERO derivative-modulus information.
    id: 'imp35808-cannot-deliver-as-instantiated',
    description: 'Value floor |H_t| >= M carries ZERO info about |H_t prime|; answer is NO, not as instantiated (wrong object)',
    holds: () =>
      /ZERO information/.test(IMP35808_I3_LONG_EDGE_DERIVATIVE_DELIVERY_SCOPE.cannotDeliverAsInstantiated) &&
      /NOT of H_t/.test(IMP35808_I3_LONG_EDGE_DERIVATIVE_DELIVERY_SCOPE.cannotDeliverAsInstantiated) &&
      /not as instantiated/.test(IMP35808_I3_LONG_EDGE_DERIVATIVE_DELIVERY_SCOPE.cannotDeliverAsInstantiated),
  },
  {
    // The delivery gap decomposes into exactly TWO channels: D1 (coefficients) and D2 (independent cap C_t prime).
    id: 'imp35808-two-delivery-channels',
    description: 'Delivery gap = D1 (log-frequency-scaled coefficients) + D2 (independent C_t prime, NOT recyclable from C_t)',
    holds: () => {
      const ch = IMP35808_I3_LONG_EDGE_DERIVATIVE_DELIVERY_SCOPE.deliveryGapChannels;
      return (
        Object.keys(ch).length === 2 &&
        /DIFFERENTIATED COEFFICIENTS/.test(ch['D1']) &&
        /same term count N/.test(ch['D1']) &&
        /INDEPENDENT DIFFERENTIATED TRUNCATION CAP/.test(ch['D2']) &&
        /NOT recyclable/.test(ch['D2']) &&
        /do NOT commute/.test(ch['D2'])
      );
    },
  },
  {
    // Delivery verdict: same MACHINERY not same INSTANCE, no new mechanism, isolates SG-1 as sole blocker; N anchored; accumulation ~ w x imp-35761.
    id: 'imp35808-same-machinery-not-instance',
    description: 'Same machinery not same instance; adds NO greenfield mechanism; isolates imp-35799 SG-1 as sole delivery blocker; accumulation ~ w x imp-35761, non-binding',
    holds: () => {
      const w = windingRate(3e12);
      return (
        /SAME MACHINERY, NOT THE SAME INSTANCE/.test(IMP35808_I3_LONG_EDGE_DERIVATIVE_DELIVERY_SCOPE.deliveryVerdict) &&
        /ADDS NO greenfield MECHANISM/.test(IMP35808_I3_LONG_EDGE_DERIVATIVE_DELIVERY_SCOPE.deliveryVerdict) &&
        /SOLE delivery blocker/.test(IMP35808_I3_LONG_EDGE_DERIVATIVE_DELIVERY_SCOPE.isolatesSoleDeliveryBlocker) &&
        /SEPARATE positivity requirement/.test(IMP35808_I3_LONG_EDGE_DERIVATIVE_DELIVERY_SCOPE.isolatesSoleDeliveryBlocker) &&
        Math.abs(w - 13.446) < 5e-3 &&
        N_AT_TPT === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
        N_AT_TPT > 4.8e5 && N_AT_TPT < 4.9e5 &&
        // Differentiated accumulation is the undifferentiated one times ~ w (channel D1 factor).
        Math.abs(ACCUM_DIFF - ACCUM_UNDIFF * W_TPT) < 1e-30 &&
        ACCUM_DIFF < 1e-8 && // still ~ 9 orders below the O(1) margin -- precision non-binding
        LOG_N_TPT > 0.9 * W_TPT && LOG_N_TPT < W_TPT // log N ~ w (differentiation log-frequency ceiling)
      );
    },
  },
  {
    // Honesty gate: assessment only, no positivity, no numeric floor, no QED, no refereed bound is changed.
    id: 'imp35808-honesty-gate-no-qed',
    description: 'Assessment only; builds no enclosure; establishes no positivity; produces no numeric M_prime; changes no bound; NO QED; no refereed bound is changed',
    holds: () =>
      IMP35808_I3_LONG_EDGE_DERIVATIVE_DELIVERY_SCOPE.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /establishes no positivity/.test(IMP35808_I3_LONG_EDGE_DERIVATIVE_DELIVERY_SCOPE.verdict) &&
      /Builds no enclosure/.test(IMP35808_I3_LONG_EDGE_DERIVATIVE_DELIVERY_SCOPE.verdict) &&
      /verifies no M_prime > 0/.test(IMP35808_I3_LONG_EDGE_DERIVATIVE_DELIVERY_SCOPE.verdict) &&
      /NO QED/.test(IMP35808_I3_LONG_EDGE_DERIVATIVE_DELIVERY_SCOPE.verdict) &&
      /refereed bound is changed/i.test(IMP35808_I3_LONG_EDGE_DERIVATIVE_DELIVERY_SCOPE.verdict),
  },
];

for (const a of IMP35808_I3_LONG_EDGE_DERIVATIVE_DELIVERY_SCOPE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35808-i3-long-edge-derivative-delivery-scope assertion failed: ${a.id}`);
  }
}
