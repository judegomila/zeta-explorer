/**
 * @module imp-36120-kbn-floor-to-interval-certificate-scope
 *
 * imp-36120 (proof/scoping, S-frontier): enumerate the CONCRETE directed-rounding
 * engineering steps required to convert the imp-36023 / imp-36062 N-flat measured KBN
 * (Kahan-Babuska-Neumaier) summation FLOOR into a machine-checked length-N interval-sum
 * certificate -- the MECHANICAL obstruction imp-36062 names (the certified length-N
 * interval sum of imp-35725) with the W1 A + B - C certificate at T_PT = 3e12 still
 * GREENFIELD (imp-35681 Part A).
 *
 * imp-36062 concludes precision stays NON-binding everywhere: on the imp-35852 clustered
 * worst order the measured KBN floor is ~1.89e-20 at N ~ 488602 (classic Kahan ~2.31e-19),
 * bit-identical to classic Kahan below the N ~ 34000 onset and ~10x tighter by T_PT. But
 * that measured floor is a MIDPOINT ACCURACY (how close the computed double-precision sum
 * lands to the exact 2^{-96} BigInt reference), NOT a certified interval WIDTH. A
 * machine-checked certificate must carry an outward-rounded ENCLOSURE, and this module
 * scopes exactly which accumulator operations that enclosure touches, how the compensation
 * term must be bounded once it is an interval, and what remains to instantiate the sum.
 *
 * SCOPING / ASSESSMENT ONLY. Certifies nothing; constructs no interval; evaluates no sum;
 * verifies no inequality; changes no bound; establishes no positivity; C_mb GUE-conditional
 * (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * THE KBN ACCUMULATOR (Neumaier variant), one running pair (s, c)
 * -----------------------------------------------------------------------------
 * KBN carries a running sum s and a running compensation c. Per term t_k:
 *      t = s + t_k                                 (1 rounded add)
 *      if |s| >= |t_k|:  c += (s - t) + t_k        (Neumaier residual, large-branch)
 *      else:             c += (t_k - t) + s        (Neumaier residual, small-branch)
 *      s = t
 * and returns s + c at the very end. In plain float the KEY to KBN correctness is that the
 * two-sum residual (s - t) + t_k is computed EXACTLY (Knuth/Neumaier: for the branch taken
 * the residual is representable, so it is captured with NO rounding). That exactness is
 * precisely what lets the midpoint track the true sum to ~1.89e-20.
 *
 * WHAT DIRECTED ROUNDING DOES TO THAT ACCUMULATOR (the crux)
 * -----------------------------------------------------------------------------
 * Replace s, c by outward-rounded intervals [s], [c]. Then:
 *   - (1) t = [s] + [t_k] widens by 1 ulp outward -> [t].
 *   - The residual (s - t) + t_k is NO LONGER EXACT: once [s], [t] are intervals, the
 *     Neumaier residual identity (which relied on s, t being the SPECIFIC floats of a
 *     two-sum) fails, so the residual must itself be ENCLOSED, not assumed representable.
 *     It inherits the widths of [s], [t], [t_k] -- roughly 2 more outward-rounded ops.
 *   - [c] += residual widens again.
 * So ~4 outward-rounded interval ops per term plus the final [s] + [c]. The compensation
 * still corrects the MIDPOINT drift, but the certified WIDTH is blind to that cancellation:
 * interval width only ever GROWS, ~1 ulp per op, giving a worst-case certified width
 * ~ O(N * eps) -- the SAME N-linear ceiling imp-35761 budgets for a naive length-N sum.
 * CONSEQUENCE: the machine-checked KBN interval certificate does NOT inherit the ~10x KBN
 * midpoint advantage in its WIDTH; it reverts to the imp-35761 O(N * eps) ceiling
 * (double ~1.08e-10 at T_PT), still ~10 orders below the O(1) barrier margin.
 *
 * THE WAY TO A TIGHT CERTIFIED WIDTH (what remains)
 * -----------------------------------------------------------------------------
 * To certify a width BELOW the O(N * eps) op-count ceiling one does NOT interval-trace the
 * accumulator step by step; one instantiates an A-PRIORI running-error bound for compensated
 * summation (Higham, Accuracy and Stability, running-error / doubly-compensated bound:
 * |fl(sum) - sum| <= (2 eps + O(N eps^2)) * Sum|t_k|, the LEADING term N-INDEPENDENT) with a
 * certified enclosure of Sum|t_k| (~889 at N ~ 488602, imp-36218-class). That bound is
 * MECHANICAL -- finite control flow + a certified Sum|t_k| enclosure + standard error-analysis
 * constants -- with no OPEN mathematical content, exactly the imp-35725 / imp-36101
 * classification. It is DISTINCT from interval-tracing the accumulator (which yields the loose
 * O(N * eps) width above) and is the residual this module names.
 *
 * READING: converting the measured KBN floor into a certificate is TWO different obligations.
 * (A) A naive directed-rounding interval-trace of the KBN accumulator is ROUTINE but yields
 * only the loose O(N * eps) width -- the KBN midpoint advantage does not survive into the
 * width. (B) A TIGHT (~N-independent) certified width needs the a-priori compensated running
 * error bound instantiated with a certified Sum|t_k|. Both are MECHANICAL (no open math);
 * neither is instantiated here. Precision stays NON-binding either way (both sit far below the
 * O(1) barrier margin), so the obstruction is ENGINEERING, and the W1 A + B - C certificate
 * at T_PT stays GREENFIELD.
 *
 * @see imp-36062-kbn-kahan-separation-onset (KBN floor ~1.89e-20 vs classic Kahan ~2.31e-19 at N~488602; onset N~34000)
 * @see imp-36023-kbn-combined-worst-ladder (KBN = classic Kahan at N<=1e4, ~10x tighter by N~488602)
 * @see imp-35761-w1-certified-rounding-cost-scope (O(N*eps) worst-case interval-width ceiling; double ~1.08e-10 at T_PT)
 * @see imp-36101-w1-certified-sum-construction-steps-scope (S1-S5 construction steps; S3/S4 residual concentrate)
 * @see imp-35725-w1-effective-error-cap-budget (names the MECHANICAL certified length-N interval sum)
 * @see imp-35681-w1-w2-w4-existing-infra-inventory (Part A A+B-C interval bound GREENFIELD)
 * @see Higham 2002, Accuracy and Stability of Numerical Algorithms (compensated-summation running-error bound)
 * @see Neumaier 1974 (Kahan-Babuska-Neumaier compensated summation); Polymath15 2019; Platt-Trudgian 2021
 */

// -- Anchor + operative constants (import-light; matching imp-35761 / imp-36062) --------
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this scope
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI))); // Polymath15 retained-term count
const N_AT_TPT = N_TERMS(T_PT); // ~488602 terms per mollified sum at T_PT

const EPS_DOUBLE = 2 ** -52; // binary64 machine epsilon (~2.22e-16)

// imp-36062 measured floors on the imp-35852 clustered worst order at N ~ 488602 (MIDPOINT
// accuracy vs the exact 2^{-96} BigInt reference; NOT a certified width).
const KBN_FLOOR_TPT = 1.89e-20; // KBN midpoint floor at N~488602 (imp-36062 endpoint)
const KAHAN_FLOOR_TPT = 2.31e-19; // classic Kahan midpoint floor at N~488602 (imp-36062)

// Loose op-count interval-width ceiling for a step-by-step directed-rounding trace of KBN:
// ~4 outward-rounded ops per term (add t, two residual ops, c accumulation) -> O(N * eps).
const OPS_PER_TERM = 4; // add-t + two residual ops + c-accumulate (Neumaier branch)
const WIDTH_INTERVAL_TRACE = OPS_PER_TERM * N_AT_TPT * EPS_DOUBLE; // ~4.34e-10 (loose, N-linear)

// Tight a-priori compensated running-error bound (leading term N-INDEPENDENT): ~2 eps * Sum|t_k|.
const SUM_ABS_TERMS_TPT = 889; // certified Sum|t_k| enclosure scale at N~488602 (imp-36218-class)
const WIDTH_APRIORI_COMPENSATED = 2 * EPS_DOUBLE * SUM_ABS_TERMS_TPT; // ~3.95e-13 (N-independent leading term)

export const IMP36120_KBN_FLOOR_TO_INTERVAL_CERTIFICATE_SCOPE = {
  id: 'imp-36120',
  proofSection: 'S-frontier',
  question:
    'Enumerate the concrete directed-rounding engineering steps to convert the imp-36023/imp-36062 ' +
    'N-flat measured KBN summation floor into a machine-checked length-N interval-sum certificate: ' +
    'which accumulator operations need outward-rounded enclosures, how the compensation term must be ' +
    'bounded, and what remains to instantiate the length-N interval sum. Scoping only; certifies ' +
    'nothing; changes no bound; NO QED.',
  measuredFloorIsMidpointNotWidth: {
    kbnFloorTPT: KBN_FLOOR_TPT,
    kahanFloorTPT: KAHAN_FLOOR_TPT,
    clarification:
      'the imp-36062 KBN floor ~1.89e-20 (vs classic Kahan ~2.31e-19) is a MIDPOINT accuracy -- how ' +
      'close the computed double sum lands to the exact 2^{-96} BigInt reference -- NOT a certified ' +
      'interval width; a machine-checked certificate must carry an outward-rounded ENCLOSURE',
  },
  accumulator: {
    scheme: 'KBN (Neumaier variant): running sum s + running compensation c, return s + c',
    perTermFloat:
      't = s + t_k; c += |s|>=|t_k| ? (s - t) + t_k : (t_k - t) + s; s = t (residual EXACT in float)',
    correctnessKey:
      'classic KBN accuracy relies on the two-sum residual (s - t) + t_k being computed EXACTLY ' +
      '(Knuth/Neumaier: representable for the branch taken), captured with NO rounding',
  },
  engineeringSteps: {
    E1_intervalAccumulators:
      'replace the running s, c by outward-rounded intervals [s], [c] (endpoint lo/hi or ' +
      'midpoint+radius), each op rounded OUTWARD',
    E2_addTerm: '(1) t = [s] + [t_k]: one outward-rounded interval add, +1 ulp width -> [t]',
    E3_residualNoLongerExact:
      'the Neumaier residual (s - t) + t_k is NO LONGER exact once [s], [t] are intervals -- the ' +
      'representability identity fails -- so it must be ENCLOSED (~2 more outward-rounded ops), ' +
      'inheriting the widths of [s], [t], [t_k]',
    E4_compensationAccumulate:
      '[c] += residual: one more outward-rounded add; ~4 outward-rounded ops per term total plus ' +
      'the final [s] + [c]',
    E5_widthAggregate:
      'interval width only GROWS (~1 ulp per op), so a step-by-step trace yields worst-case width ' +
      '~ O(N * eps) -- the compensation corrects the MIDPOINT but the certified WIDTH is blind to its ' +
      'cancellation and reverts to the imp-35761 N-linear ceiling',
  },
  widths: {
    intervalTrace: {
      value: WIDTH_INTERVAL_TRACE,
      note:
        'loose op-count ceiling ~ 4 * N * eps ~ 4.34e-10 at T_PT (KBN midpoint advantage does NOT ' +
        'survive into the width); same O(N * eps) class as the imp-35761 naive ceiling',
    },
    aprioriCompensated: {
      value: WIDTH_APRIORI_COMPENSATED,
      note:
        'a-priori compensated running-error bound ~ 2 eps * Sum|t_k| ~ 3.95e-13, leading term ' +
        'N-INDEPENDENT (Higham); needs a certified Sum|t_k| (~889) enclosure',
    },
    barrierMargin: 'O(1) effective barrier margin |A_t + B_t| - |C_t| (imp-35760); both widths ~10 orders below',
  },
  whatRemains: {
    routineButLoose:
      'a naive directed-rounding interval-trace of the KBN accumulator (E1-E5) is ROUTINE but yields ' +
      'only the loose O(N * eps) width -- the KBN midpoint advantage is lost in the width',
    tightNeedsApriori:
      'a TIGHT (~N-independent) certified width needs the a-priori compensated running-error bound ' +
      'instantiated with a certified Sum|t_k| enclosure -- MECHANICAL (finite control flow + certified ' +
      'sum + standard error constants), no OPEN math, exactly the imp-35725/imp-36101 classification',
    distinctFromIntervalTrace:
      'the tight route is DISTINCT from interval-tracing the accumulator; this module names it as the ' +
      'residual and instantiates neither',
  },
  conclusion: {
    precisionNonBinding:
      'both the loose interval-trace width (~4.34e-10) and the a-priori bound (~3.95e-13) sit ~10 orders ' +
      'below the O(1) barrier margin, so precision is NOT the binding constraint',
    obstructionIsEngineering:
      'the wall is the ENGINEERING of the certified length-N interval sum (either route), exactly the ' +
      'MECHANICAL classification of imp-35725 / imp-36062 -- not arithmetic precision',
    staysGreenfield:
      'this module scopes the steps; it constructs no interval and verifies no inequality, so the W1 ' +
      'A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A)',
  },
  isRigorous: false,
  verdict:
    'SCOPING / ASSESSMENT (frontier-direction, NOT rigorous). Converting the imp-36023/imp-36062 measured ' +
    'KBN floor (~1.89e-20 midpoint at N~488602, vs classic Kahan ~2.31e-19) into a machine-checked ' +
    'length-N interval-sum certificate is TWO distinct obligations. (A) A step-by-step directed-rounding ' +
    'trace of the KBN accumulator (E1-E5: interval [s],[c]; outward-rounded add for t; the Neumaier ' +
    'residual (s - t) + t_k is NO LONGER exact once s,t are intervals and must be ENCLOSED; ~4 outward ' +
    'ops/term) is ROUTINE but yields only a loose width ~ O(N * eps) ~ 4.34e-10 at T_PT -- the KBN ' +
    'MIDPOINT advantage does NOT survive into the certified WIDTH, which reverts to the imp-35761 ' +
    'N-linear ceiling. (B) A TIGHT (~N-independent) certified width needs the a-priori compensated ' +
    'running-error bound ~ 2 eps * Sum|t_k| ~ 3.95e-13 instantiated with a certified Sum|t_k| (~889) ' +
    'enclosure -- MECHANICAL, no open math, the imp-35725/imp-36101 classification. Both widths sit ~10 ' +
    'orders below the O(1) barrier margin, so precision stays NON-binding; the obstruction is ' +
    'ENGINEERING. Constructs no interval; evaluates no sum; verifies no inequality; changes no bound; ' +
    'establishes no positivity; the W1 A + B - C certificate at T_PT stays GREENFIELD; C_mb ' +
    'GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-36062 (KBN floor ~1.89e-20 vs classic Kahan ~2.31e-19 at N~488602, onset N~34000); imp-36023 ' +
    '(KBN=classic-Kahan at N<=1e4, ~10x tighter by N~488602); imp-35761 (O(N*eps) interval-width ceiling); ' +
    'imp-36101 (S1-S5 construction steps); imp-35725 (mechanical certified length-N interval sum); ' +
    'imp-35681 Part A (A+B-C GREENFIELD); Higham 2002 (compensated-summation running-error bound); ' +
    'Neumaier 1974 (KBN); Polymath15 2019; Platt-Trudgian 2021 (barrier base).',
};

export const IMP36120_KBN_FLOOR_TO_INTERVAL_CERTIFICATE_SCOPE_ASSERTIONS = [
  {
    // N anchored at floor(sqrt(T_PT/4 pi)) ~ 488602, matching imp-35761 / imp-36062.
    id: 'imp36120-n-anchor',
    description: 'N = floor(sqrt(T_PT/4 pi)) ~ 488602 retained terms anchored at T_PT = 3e12',
    holds: () =>
      N_AT_TPT === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      N_AT_TPT > 4.8e5 && N_AT_TPT < 4.9e5,
  },
  {
    // The measured KBN floor is ~10x tighter than classic Kahan (midpoint), reproducing imp-36062.
    id: 'imp36120-midpoint-floor-ordering',
    description: 'KBN midpoint floor ~1.89e-20 is ~10x tighter than classic Kahan ~2.31e-19 (imp-36062)',
    holds: () =>
      KBN_FLOOR_TPT < KAHAN_FLOOR_TPT &&
      KAHAN_FLOOR_TPT / KBN_FLOOR_TPT > 8 && KAHAN_FLOOR_TPT / KBN_FLOOR_TPT < 15 &&
      KBN_FLOOR_TPT > 1e-20 && KBN_FLOOR_TPT < 3e-20,
  },
  {
    // The interval-trace certified WIDTH reverts to the O(N * eps) ceiling and LOSES the KBN
    // midpoint advantage: it is many orders LOOSER than the measured KBN midpoint floor.
    id: 'imp36120-width-loses-kbn-advantage',
    description: 'Interval-trace width ~ 4*N*eps ~ 4.34e-10 reverts to O(N*eps); >> the KBN midpoint floor',
    holds: () =>
      Math.abs(WIDTH_INTERVAL_TRACE - 4 * N_AT_TPT * 2 ** -52) < 1e-25 &&
      WIDTH_INTERVAL_TRACE > 1e-10 && WIDTH_INTERVAL_TRACE < 1e-9 &&
      WIDTH_INTERVAL_TRACE > KBN_FLOOR_TPT * 1e9,
  },
  {
    // The a-priori compensated bound is N-independent leading order and sits between the KBN
    // midpoint floor and the loose interval-trace width.
    id: 'imp36120-apriori-tighter-than-trace',
    description: 'A-priori compensated bound ~2*eps*Sum|t_k| ~3.95e-13 is N-indep and tighter than the trace width',
    holds: () =>
      Math.abs(WIDTH_APRIORI_COMPENSATED - 2 * 2 ** -52 * SUM_ABS_TERMS_TPT) < 1e-20 &&
      WIDTH_APRIORI_COMPENSATED < WIDTH_INTERVAL_TRACE &&
      WIDTH_APRIORI_COMPENSATED > 1e-13 && WIDTH_APRIORI_COMPENSATED < 1e-12,
  },
  {
    // Honesty gate: scoping only; precision non-binding; obstruction MECHANICAL/engineering;
    // greenfield; no QED; no refereed bound is changed.
    id: 'imp36120-honesty-gate',
    description: 'Scoping only; precision non-binding; obstruction engineering; greenfield; no QED; no refereed bound is changed',
    holds: () =>
      IMP36120_KBN_FLOOR_TO_INTERVAL_CERTIFICATE_SCOPE.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /ENGINEERING/.test(IMP36120_KBN_FLOOR_TO_INTERVAL_CERTIFICATE_SCOPE.conclusion.obstructionIsEngineering) &&
      /GREENFIELD/.test(IMP36120_KBN_FLOOR_TO_INTERVAL_CERTIFICATE_SCOPE.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP36120_KBN_FLOOR_TO_INTERVAL_CERTIFICATE_SCOPE.verdict) &&
      /refereed bound is changed/i.test(IMP36120_KBN_FLOOR_TO_INTERVAL_CERTIFICATE_SCOPE.verdict),
  },
];

for (const a of IMP36120_KBN_FLOOR_TO_INTERVAL_CERTIFICATE_SCOPE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36120-kbn-floor-to-interval-certificate-scope assertion failed: ${a.id}`);
  }
}
