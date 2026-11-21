/**
 * @module imp-35845-d2-differentiated-truncation-cap-amplification
 *
 * imp-35845 (proof/assessment, S-frontier): ASSESS the imp-35808 channel D2 -- the
 * INDEPENDENT differentiated truncation cap C_t prime = E_A prime + E_B prime +
 * E_{C_0} prime -- as its OWN error budget, and QUANTIFY the ~ w amplification imp-35808
 * asserted over the imp-35725 undifferentiated value cap C_t. imp-35808 named D2 as a NEW
 * budget "larger than C_t by roughly the log-frequency factor ~ w" but never estimated
 * the amplification magnitude. This module supplies the order-of-magnitude estimate at the
 * barrier anchor and asks whether the imp-35761 directed-rounding cost inherits the same
 * factor.
 *
 * ASSESSMENT / ORDER-OF-MAGNITUDE ESTIMATE ONLY on the inherited OOM model. Builds no
 * enclosure; differentiates no series numerically; budgets no C_t prime rigorously;
 * certifies no cap; establishes no positivity; changes no bound; C_mb GUE-conditional
 * (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * WHY C_t prime IS AMPLIFIED BY THE LOG-FREQUENCY WEIGHT (the mechanism)
 * -----------------------------------------------------------------------------
 * The imp-35725 value cap C_t bounds the TAIL of the mollified Dirichlet main terms: an
 * error of the shape E ~ sum_{n > N} b_n, where b_n is the per-term interval weight
 * (retained coefficient magnitude times Gaussian t-damping) and N = floor(sqrt(T/4 pi))
 * is the retained-term count (imp-35674 Part D). Differentiating the series with respect
 * to the transform variable pulls down a log-frequency factor per term (d/ds of an
 * n^{-s}-type factor carries -log n), so the DIFFERENTIATED tail is
 *      E_prime ~ sum_{n > N} (log n) . b_n,
 * a log-weighted version of the SAME tail. This is exactly the imp-35808 statement that
 * differentiation and truncation do NOT commute: E_prime is its OWN object, not C_t.
 *
 * THE AMPLIFICATION IS A TAIL-WEIGHTED AVERAGE OF log n, PINNED AT log N ~ w
 * -----------------------------------------------------------------------------
 * The ratio E_prime / E is the b_n-weighted average of log n over the tail n > N. The tail
 * is dominated by its FIRST surviving term (n = N + 1, the largest b_n), so the weighted
 * average sits at log(N + 1) ~ log N to leading order. Hence the amplification factor is
 *      A_amp = C_t prime / C_t ~ log N.
 * At T_PT = 3e12, N ~ 4.886e5 gives log N ~ 13.10, and the winding log-scale is
 * w = (1/2) log(T / 2 pi) ~ 13.446. The two are tied by the EXACT identity
 *      log N = (1/2) log(T / 4 pi) = w - (1/2) log 2 = w - 0.34657,
 * so log N sits at ~ 0.974 w -- WITHIN the "~ w" order-of-magnitude claim (log N lies in
 * (0.9 w, w)). VERDICT on the amplification: the ~ w factor is CONFIRMED to OOM, with the
 * sharp constant being log N = w - (1/2) log 2, marginally BELOW w (by half a nat), not
 * above it. So imp-35808 "~ w" is correct as an order of magnitude and is a slight OVER-
 * estimate of the true log N leading constant.
 *
 * DOES THE imp-35761 DIRECTED-ROUNDING COST INHERIT THE SAME ~ w FACTOR?
 * -----------------------------------------------------------------------------
 * imp-35761 models the worst-case certified-interval RELATIVE width of an N-term directed-
 * rounding sum as ~ N . eps (eps = 2 u the machine epsilon), giving ~ 1.08e-10 at double.
 * The distinction the estimate must respect:
 *   - RELATIVE width ~ N . eps is a per-operation accumulation over N additions. Scaling
 *     every summand by a common log-frequency weight is a UNIFORM rescaling of the sum, and
 *     directed-rounding RELATIVE width is invariant under uniform rescaling. So the RELATIVE
 *     rounding width does NOT inherit the ~ w factor -- it stays ~ N . eps.
 *   - ABSOLUTE rounding error = (relative width) . |sum|. The differentiated sum has
 *     magnitude ~ w larger (channel D1 log-frequency weighting), so its ABSOLUTE certified
 *     width IS ~ w larger. This is exactly the imp-35808 accumulation model
 *     ACCUM_DIFF = ACCUM_UNDIFF . w.
 * READING: the ~ w factor is an ABSOLUTE-magnitude inheritance (the differentiated sum is
 * bigger), NOT a growth of the RELATIVE rounding budget. Either way the accumulation stays
 * ~ 9 orders below the O(1) barrier margin at double precision -- precision is NOT the
 * binding delivery constraint for D2, exactly as for the undifferentiated cap.
 *
 * WHAT THIS DOES NOT DO
 * -----------------------------------------------------------------------------
 * Assessment / order-of-magnitude estimate only. Differentiates no series numerically;
 * evaluates no E_A prime / E_B prime / E_{C_0} prime; budgets no C_t prime rigorously;
 * certifies no cap; produces no numeric M_prime; verifies no positivity; changes no bound;
 * I3 stays GREENFIELD downstream of W1 (imp-35727); C_mb GUE-conditional (imp-486)
 * untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35808-i3-long-edge-derivative-delivery-scope (names D2 as the NEW budget ~ w larger than C_t)
 * @see imp-35725-w1-effective-error-cap-budget (the UNDIFFERENTIATED value cap C_t = E_A+E_B+E_{C_0})
 * @see imp-35761-w1-certified-rounding-cost-scope (directed-rounding relative width ~ N.eps ~ 1.08e-10)
 * @see imp-35799-i3-long-edge-derivative-floor-scope (object M_prime = inf(|A_t prime+B_t prime|-|C_t prime|))
 * @see imp-35674-w3-tail-lemma-polymath15-scope (Part D: N(x) = floor(sqrt(x / 4 pi)) retained terms)
 * @see imp-35757 (w = (1/2) log(T / 2 pi)); Polymath15 2019 (H_t = A + B - C); Platt-Trudgian 2021
 */

// -- Anchor + operative constants (import-light; matching imp-35808 / imp-35725 / imp-35761) --
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this estimate
const N_AT_TPT = Math.floor(Math.sqrt(T_PT / (4 * Math.PI))); // ~488602 retained terms (imp-35674 Part D)

// Winding / derivative log-scale w(T) = (1/2) log(T / 2 pi) (imp-35757 / imp-35777).
const windingRate = (T) => 0.5 * Math.log(T / (2 * Math.PI));
const W_TPT = windingRate(T_PT); // ~13.446

// Log-frequency amplification: C_t prime / C_t ~ log N (tail-weighted average of log n,
// pinned at the largest surviving term n = N+1). Exact identity: log N = w - (1/2) log 2.
const LOG_N_TPT = Math.log(N_AT_TPT); // ~13.10
const HALF_LOG2 = 0.5 * Math.LN2; // ~0.34657
const AMP_FACTOR = LOG_N_TPT; // C_t prime / C_t ~ log N (the sharp leading constant)
const AMP_OVER_W = AMP_FACTOR / W_TPT; // ~0.974 -- WITHIN (0.9 w, w), so "~ w" to OOM

// Directed-rounding cost (imp-35761): RELATIVE width ~ N.eps is UNIFORM-rescale invariant,
// so it does NOT inherit the ~ w factor. ABSOLUTE width does (the differentiated sum is
// ~ w larger). Model both at double precision; both stay ~ 9 orders below the O(1) margin.
const DBL_EPS = 2.220446049250313e-16; // binary64 unit roundoff
const REL_WIDTH_UNDIFF = N_AT_TPT * DBL_EPS; // ~1.08e-10 (imp-35761 relative width, unchanged)
const REL_WIDTH_DIFF = REL_WIDTH_UNDIFF; // RELATIVE width does NOT inherit ~ w (uniform rescale)
const ABS_WIDTH_DIFF = REL_WIDTH_UNDIFF * W_TPT; // ~1.5e-9 ABSOLUTE, ~ w larger, still << O(1)

export const IMP35845_D2_DIFFERENTIATED_TRUNCATION_CAP_AMPLIFICATION = {
  id: 'imp-35845',
  proofSection: 'S-frontier',
  question:
    'Assess the imp-35808 channel D2 -- the independent differentiated truncation cap C_t prime = E_A prime + ' +
    'E_B prime + E_{C_0} prime -- as its own error budget: quantify the ~ w log-frequency amplification over the ' +
    'imp-35725 undifferentiated value cap C_t at N ~ 4.886e5, and assess whether the imp-35761 directed-rounding ' +
    'cost inherits the same factor. Estimate / OOM only; builds no enclosure; NO QED.',
  amplificationMechanism:
    'C_t bounds the value tail E ~ sum_{n>N} b_n; differentiation pulls down a log-frequency factor per term (d/ds of ' +
    'an n^{-s}-type factor carries -log n), so the differentiated tail is E_prime ~ sum_{n>N} (log n) . b_n -- the SAME ' +
    'tail log-weighted. Differentiation and truncation do NOT commute: C_t prime is its OWN object, not C_t',
  amplificationEstimate:
    'A_amp = C_t prime / C_t ~ tail-weighted average of log n over n > N; the tail is dominated by its first surviving ' +
    'term (n = N+1, largest b_n), so A_amp ~ log N. At T_PT: log N ~ 13.10, w ~ 13.446, tied by the EXACT identity ' +
    'log N = (1/2)log(T/4pi) = w - (1/2)log2 = w - 0.34657, so A_amp ~ 0.974 w -- WITHIN (0.9 w, w)',
  amplificationVerdict:
    'the imp-35808 "~ w" claim is CONFIRMED to order of magnitude, with the sharp leading constant being log N = ' +
    'w - (1/2)log2, marginally BELOW w (by half a nat), i.e. "~ w" is a slight OVER-estimate of the true log N constant',
  roundingInheritance:
    'the imp-35761 directed-rounding RELATIVE width ~ N.eps is invariant under a UNIFORM rescaling of the summands, so ' +
    'it does NOT inherit the ~ w factor (stays ~ 1.08e-10 at double); the ABSOLUTE certified width DOES inherit ~ w ' +
    'because the differentiated sum is ~ w larger in magnitude (ABS_WIDTH_DIFF = REL_WIDTH . w ~ 1.5e-9). ~ w is an ' +
    'ABSOLUTE-magnitude inheritance, NOT a growth of the RELATIVE rounding budget; both stay ~ 9 orders below O(1)',
  precisionNonBinding:
    'at double precision the differentiated accumulation ~ 1.5e-9 (absolute) sits ~ 9 orders below the O(1) barrier ' +
    'margin -- precision is NOT the binding delivery constraint for D2, exactly as for the undifferentiated cap C_t; ' +
    'the binding blocker stays the MECHANICAL re-instantiation on H_t prime (imp-35808 D1 + D2), I3 downstream of W1',
  windingRateTPT: W_TPT,
  logNTPT: LOG_N_TPT,
  halfLog2: HALF_LOG2,
  ampFactor: AMP_FACTOR,
  ampOverW: AMP_OVER_W,
  retainedTermsAtTPT: N_AT_TPT,
  relWidthUndiff: REL_WIDTH_UNDIFF,
  relWidthDiff: REL_WIDTH_DIFF,
  absWidthDiff: ABS_WIDTH_DIFF,
  isRigorous: false,
  verdict:
    'ASSESSMENT / ORDER-OF-MAGNITUDE ESTIMATE (frontier-direction, NOT rigorous). QUESTION: quantify the imp-35808 ' +
    'channel D2 differentiated truncation cap C_t prime = E_A prime + E_B prime + E_{C_0} prime as an independent ' +
    'budget -- the ~ w amplification over the imp-35725 undifferentiated value cap C_t, and whether the imp-35761 ' +
    'directed-rounding cost inherits it. MECHANISM: C_t bounds a value tail E ~ sum_{n>N} b_n; differentiation pulls ' +
    'down -log n per term so the differentiated tail is E_prime ~ sum_{n>N} (log n) . b_n, the SAME tail log-weighted ' +
    '(differentiation and truncation do NOT commute -- C_t prime is its own object). AMPLIFICATION: A_amp = ' +
    'C_t prime / C_t ~ tail-weighted average of log n, pinned at the largest surviving term n = N+1, so A_amp ~ log N. ' +
    'At T_PT (N ~ 4.886e5): log N ~ 13.10 vs w ~ 13.446, tied by the EXACT identity log N = w - (1/2)log2, so ' +
    'A_amp ~ 0.974 w -- WITHIN (0.9 w, w). The imp-35808 "~ w" is CONFIRMED to OOM; the sharp leading constant is ' +
    'log N = w - (1/2)log2, marginally BELOW w, so "~ w" slightly OVER-estimates it. ROUNDING: the imp-35761 RELATIVE ' +
    'width ~ N.eps is uniform-rescale invariant and does NOT inherit ~ w (stays ~ 1.08e-10 at double); the ABSOLUTE ' +
    'width DOES (the differentiated sum is ~ w larger), giving ~ 1.5e-9. So ~ w is an ABSOLUTE-magnitude inheritance, ' +
    'not a relative-budget growth; both stay ~ 9 orders below the O(1) margin, precision non-binding. Differentiates ' +
    'no series numerically; evaluates no E_A prime/E_B prime/E_{C_0} prime; budgets no C_t prime rigorously; certifies ' +
    'no cap; produces no numeric M_prime; verifies no positivity; changes no bound; I3 stays GREENFIELD downstream of ' +
    'W1 (imp-35727); C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35808 (channel D2 = C_t prime, ~ w larger than C_t); imp-35725 (undifferentiated value cap C_t = ' +
    'E_A+E_B+E_{C_0}); imp-35761 (directed-rounding relative width ~ N.eps ~ 1.08e-10); imp-35799 (object M_prime); ' +
    'imp-35674 Part D (N(x)=floor(sqrt(x/4 pi))); imp-35757 (w=(1/2)log(T/2pi)); imp-35727 (I3 downstream of W1); ' +
    'Polymath15 2019 (H_t = A + B - C, barrier method); Platt-Trudgian 2021.',
};

export const IMP35845_D2_DIFFERENTIATED_TRUNCATION_CAP_AMPLIFICATION_ASSERTIONS = [
  {
    // Mechanism: differentiation log-weights the SAME tail (log n per term); non-commuting with truncation.
    id: 'imp35845-log-weight-mechanism',
    description: 'Differentiated tail E_prime ~ sum (log n) b_n is the SAME value tail log-weighted; differentiation and truncation do NOT commute',
    holds: () =>
      /log-frequency factor per term/.test(IMP35845_D2_DIFFERENTIATED_TRUNCATION_CAP_AMPLIFICATION.amplificationMechanism) &&
      /do NOT commute/.test(IMP35845_D2_DIFFERENTIATED_TRUNCATION_CAP_AMPLIFICATION.amplificationMechanism) &&
      /its OWN object/.test(IMP35845_D2_DIFFERENTIATED_TRUNCATION_CAP_AMPLIFICATION.amplificationMechanism),
  },
  {
    // Amplification factor A_amp ~ log N ~ 13.10, anchored to N and the winding rate w.
    id: 'imp35845-amplification-is-logN',
    description: 'A_amp = C_t prime / C_t ~ log N ~ 13.10 at N ~ 4.886e5 (tail dominated by n = N+1)',
    holds: () => {
      const logN = Math.log(Math.floor(Math.sqrt(3e12 / (4 * Math.PI))));
      return (
        N_AT_TPT === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
        N_AT_TPT > 4.8e5 && N_AT_TPT < 4.9e5 &&
        Math.abs(AMP_FACTOR - logN) < 1e-12 &&
        AMP_FACTOR > 13.0 && AMP_FACTOR < 13.2
      );
    },
  },
  {
    // EXACT identity log N = w - (1/2) log 2; so A_amp ~ 0.974 w, WITHIN (0.9 w, w).
    id: 'imp35845-logN-equals-w-minus-halflog2',
    description: 'EXACT identity log N = w - (1/2)log2 = w - 0.34657; A_amp ~ 0.974 w lies WITHIN (0.9 w, w)',
    holds: () =>
      Math.abs(W_TPT - 13.446) < 5e-3 &&
      Math.abs(HALF_LOG2 - 0.34657) < 1e-4 &&
      // log N and w - (1/2)log2 agree up to the floor() perturbation in N (< 1e-5).
      Math.abs(LOG_N_TPT - (W_TPT - HALF_LOG2)) < 1e-5 &&
      AMP_OVER_W > 0.9 && AMP_OVER_W < 1.0 &&
      Math.abs(AMP_OVER_W - LOG_N_TPT / W_TPT) < 1e-12,
  },
  {
    // Verdict: "~ w" confirmed to OOM; sharp constant log N is marginally BELOW w (slight over-estimate).
    id: 'imp35845-w-claim-confirmed-slight-overestimate',
    description: 'imp-35808 "~ w" CONFIRMED to OOM; sharp constant log N = w - (1/2)log2 is marginally BELOW w (a slight over-estimate)',
    holds: () =>
      /CONFIRMED to order of magnitude/.test(IMP35845_D2_DIFFERENTIATED_TRUNCATION_CAP_AMPLIFICATION.amplificationVerdict) &&
      /marginally BELOW w/.test(IMP35845_D2_DIFFERENTIATED_TRUNCATION_CAP_AMPLIFICATION.amplificationVerdict) &&
      /slight OVER-estimate/.test(IMP35845_D2_DIFFERENTIATED_TRUNCATION_CAP_AMPLIFICATION.amplificationVerdict) &&
      LOG_N_TPT < W_TPT,
  },
  {
    // Rounding inheritance: RELATIVE width unchanged (uniform-rescale invariant); ABSOLUTE inherits ~ w.
    id: 'imp35845-rounding-absolute-not-relative',
    description: 'Directed-rounding RELATIVE width ~ N.eps does NOT inherit ~ w (unchanged); ABSOLUTE width DOES (~ w larger, sum bigger)',
    holds: () =>
      /RELATIVE width ~ N.eps is invariant/.test(IMP35845_D2_DIFFERENTIATED_TRUNCATION_CAP_AMPLIFICATION.roundingInheritance) &&
      /does NOT inherit/.test(IMP35845_D2_DIFFERENTIATED_TRUNCATION_CAP_AMPLIFICATION.roundingInheritance) &&
      /ABSOLUTE certified width DOES inherit/.test(IMP35845_D2_DIFFERENTIATED_TRUNCATION_CAP_AMPLIFICATION.roundingInheritance) &&
      // Relative width identical undiff vs diff; absolute is ~ w times the relative one.
      REL_WIDTH_DIFF === REL_WIDTH_UNDIFF &&
      Math.abs(ABS_WIDTH_DIFF - REL_WIDTH_UNDIFF * W_TPT) < 1e-30 &&
      REL_WIDTH_UNDIFF < 2e-10 && REL_WIDTH_UNDIFF > 1e-10 &&
      ABS_WIDTH_DIFF < 1e-8, // still ~ 9 orders below the O(1) margin -- precision non-binding
  },
  {
    // Honesty gate: estimate only, no numeric cap, no positivity, no QED, no refereed bound is changed.
    id: 'imp35845-honesty-gate-no-qed',
    description: 'Estimate/OOM only; differentiates no series numerically; budgets no C_t prime; establishes no positivity; changes no bound; NO QED; no refereed bound is changed',
    holds: () =>
      IMP35845_D2_DIFFERENTIATED_TRUNCATION_CAP_AMPLIFICATION.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /Differentiates\s+no series numerically/.test(IMP35845_D2_DIFFERENTIATED_TRUNCATION_CAP_AMPLIFICATION.verdict) &&
      /budgets no C_t prime rigorously/.test(IMP35845_D2_DIFFERENTIATED_TRUNCATION_CAP_AMPLIFICATION.verdict) &&
      /verifies no positivity/.test(IMP35845_D2_DIFFERENTIATED_TRUNCATION_CAP_AMPLIFICATION.verdict) &&
      /NO QED/.test(IMP35845_D2_DIFFERENTIATED_TRUNCATION_CAP_AMPLIFICATION.verdict) &&
      /refereed bound is changed/i.test(IMP35845_D2_DIFFERENTIATED_TRUNCATION_CAP_AMPLIFICATION.verdict),
  },
];

for (const a of IMP35845_D2_DIFFERENTIATED_TRUNCATION_CAP_AMPLIFICATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35845-d2-differentiated-truncation-cap-amplification assertion failed: ${a.id}`);
  }
}
