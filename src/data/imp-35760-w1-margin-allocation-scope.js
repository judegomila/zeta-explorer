/**
 * @module imp-35760-w1-margin-allocation-scope
 *
 * imp-35760 (numerical/scoping, S-frontier): DERIVE a concrete triangle-inequality
 * margin ALLOCATION for the imp-35725 effective-approximation error cap. imp-35725
 * budgeted the per-term caps E_A, E_B, E_{C_0} and stated the strict barrier
 * inequality |A_t + B_t| - |C_t| > E_A + E_B + E_{C_0} must hold with each cap term
 * claiming only a FRACTION of the margin -- but left the allocation as an unmet
 * REQUIREMENT with NO numbers. This module supplies a candidate SCHEMATIC (order-of-
 * magnitude) fractional split of the margin M = |A_t + B_t| - |C_t| that is consistent
 * with the imp-35725 governing scales, and checks the split leaves STRICT headroom at
 * T_PT = 3e12.
 *
 * SCOPING / ALLOCATION ONLY. Evaluates no interval sum; measures no margin M; verifies
 * no inequality on real data; changes no bound; establishes no positivity; C_mb
 * GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * GOVERNING SCALES RECALLED (imp-35725)
 * -----------------------------------------------------------------------------
 * E_A and E_B are the DOMINANT pair: both bound N-term truncation tails plus Gaussian
 * t-damping with N = floor(sqrt(x / 4 pi)) ~ 4.886e5 at T_PT, so E_B TRACKS E_A to
 * leading order -- they are of the SAME scale. E_{C_0} is SUBORDINATE: the remainder of
 * an already lower-order correction, relatively O(1/N)-ish smaller than E_A. So the
 * natural relative-magnitude weights of the three cap terms are
 *      w_A : w_B : w_{C_0}  =  1 : 1 : 1/N.
 *
 * CANDIDATE ALLOCATION (schematic; scale-consistent)
 * -----------------------------------------------------------------------------
 * Pick a total cap budget fraction RHO in (0,1): the cap is ALLOWED to consume at most
 * a fraction RHO of the margin M, leaving headroom fraction (1 - RHO). Split RHO across
 * the three terms in proportion to their governing weights:
 *      f_A   = RHO * w_A   / (w_A + w_B + w_{C_0})  =  RHO * 1     / (2 + 1/N)
 *      f_B   = RHO * w_B   / (w_A + w_B + w_{C_0})  =  RHO * 1     / (2 + 1/N)
 *      f_{C_0} = RHO * w_{C_0} / (w_A + w_B + w_{C_0}) = RHO * (1/N) / (2 + 1/N)
 * By construction f_A + f_B + f_{C_0} = RHO exactly, so the DOMINANT pair E_A, E_B each
 * claim the LARGEST (equal) share ~ RHO/2, and E_{C_0} a SUBORDINATE share ~ RHO/(2N),
 * a factor ~N smaller -- exactly the imp-35725 ordering.
 *
 * CONCRETE INSTANCE at T_PT (RHO = 1/2)
 * -----------------------------------------------------------------------------
 * Choose RHO = 1/2 -- a deliberately GENEROUS ceiling: imp-35725 found the real caps sit
 * MANY ORDERS below the O(1) main term, so budgeting the cap to fill up to HALF the
 * margin is an enormous safety cushion; the true consumed fraction is far smaller. With
 * N ~ 4.886e5 this gives f_A = f_B ~ 0.25 and f_{C_0} ~ 5.1e-7, summing to RHO = 0.5,
 * leaving a STRICT headroom fraction 1 - RHO = 0.5 of the margin unclaimed. Since the
 * split total RHO = 0.5 < 1 strictly, the strict barrier inequality
 * |A_t + B_t| - |C_t| > E_A + E_B + E_{C_0} is satisfied by ANY caps obeying
 * E_A <= f_A * M, E_B <= f_B * M, E_{C_0} <= f_{C_0} * M -- the sum is then <= RHO*M < M.
 *
 * WHAT THIS DOES AND DOES NOT DO
 * -----------------------------------------------------------------------------
 * This is a SCALE-CONSISTENT candidate ALLOCATION of the margin (fractions), NOT a proof
 * that the actual E_A, E_B, E_{C_0} fit inside their shares. Fitting them requires the
 * same MECHANICAL step imp-35725 named greenfield: certified interval evaluation of the
 * ~4.886e5-term A_t^{eff}, B_t^{eff}, C_0 sums at the sign-reconciled POSITIVE barrier
 * time (imp-35717 R2/R4) to produce numeric E_A, E_B, E_{C_0} and a numeric margin M,
 * then the per-panel strict check E_* <= f_* * M. The allocation removes the ambiguity
 * in the imp-35725 REQUIREMENT (it now names the target fractions) but the interval-
 * bounded A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A).
 *
 * @see imp-35725-w1-effective-error-cap-budget (budgets E_A,E_B,E_{C_0}; names the allocation as unmet)
 * @see imp-35758-i3-modulus-floor-margin-tie-scope (margin - cap = the I3 modulus floor delta)
 * @see imp-35681-w1-w2-w4-existing-infra-inventory (Part A: A+B-C interval bound greenfield)
 * @see imp-35717-w1-tsign-reconciliation-scope (R2/R4: sign-reconciled positive barrier time)
 * @see imp-35674-w3-tail-lemma-polymath15-scope (Part D: N(x)=floor(sqrt(x/4 pi)) retained terms)
 * @see Polymath15 2019 (effective approximation H_t = A + B - C, cap E_A+E_B+E_{C_0}); Platt-Trudgian 2021
 */

// -- Anchor + operative constants (import-light; matching imp-35674 / imp-35725) ----
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this allocation
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI))); // Polymath15 retained-term count
const N_AT_TPT = N_TERMS(T_PT); // ~488602 terms per mollified sum at T_PT (imp-35674 Part D)

// -- Candidate allocation (schematic OOM; scale-consistent with imp-35725) ----------
const RHO = 0.5; // total cap budget fraction of the margin M (deliberately generous ceiling)
const W_A = 1; // dominant-pair weight (E_A)
const W_B = 1; // dominant-pair weight (E_B tracks E_A -> same scale)
const W_C0 = 1 / N_AT_TPT; // subordinate weight (O(1/N)-ish smaller than E_A)
const W_DENOM = W_A + W_B + W_C0; // = 2 + 1/N
const F_A = (RHO * W_A) / W_DENOM; // share of margin allotted to E_A
const F_B = (RHO * W_B) / W_DENOM; // share of margin allotted to E_B
const F_C0 = (RHO * W_C0) / W_DENOM; // share of margin allotted to E_{C_0}
const F_SUM = F_A + F_B + F_C0; // = RHO by construction
const HEADROOM = 1 - F_SUM; // unclaimed fraction of the margin (strict headroom)

export const IMP35760_W1_MARGIN_ALLOCATION = {
  id: 'imp-35760',
  proofSection: 'S-frontier',
  question:
    'Derive a concrete triangle-inequality margin allocation for the imp-35725 effective-error cap: ' +
    'split the barrier margin |A_t + B_t| - |C_t| into fractional shares for the dominant pair E_A, E_B ' +
    'and the subordinate E_{C_0} consistent with the imp-35725 governing scales, and check the split ' +
    'leaves strict headroom at T_PT = 3e12. Allocation / OOM scoping only; NO QED.',
  margin: {
    definition: 'M = |A_t + B_t| - |C_t| (the effective barrier margin the cap must fit strictly inside)',
    strictInequality: '|A_t + B_t| - |C_t| > E_A + E_B + E_{C_0}',
    retainedTermsAtTPT: N_AT_TPT,
  },
  governingWeights: {
    rule: 'w_A : w_B : w_{C_0} = 1 : 1 : 1/N, from the imp-35725 scales (E_A ~ E_B dominant, E_{C_0} O(1/N) subordinate)',
    w_A: W_A,
    w_B: W_B,
    w_C0: W_C0,
    note: 'E_B tracks E_A to leading order (same N-term truncation + Gaussian damping), so equal weights',
  },
  allocation: {
    rho: RHO,
    rhoRole: 'total cap budget fraction of the margin M; leaves headroom fraction (1 - RHO); RHO=1/2 is a generous ceiling',
    f_A: F_A,
    f_B: F_B,
    f_C0: F_C0,
    sum: F_SUM,
    headroomFraction: HEADROOM,
    formula: 'f_* = RHO * w_* / (w_A + w_B + w_{C_0}); f_A + f_B + f_{C_0} = RHO by construction',
    dominantEqual: 'f_A = f_B (dominant pair, equal largest share ~ RHO/2)',
    subordinateRatio: 'f_{C_0} / f_A = 1/N (subordinate share a factor ~N smaller), matching imp-35725 ordering',
  },
  strictHeadroomCheck: {
    holds: F_SUM < 1,
    claim:
      'since f_A + f_B + f_{C_0} = RHO = 0.5 < 1 strictly, ANY caps with E_A <= f_A*M, E_B <= f_B*M, ' +
      'E_{C_0} <= f_{C_0}*M give E_A + E_B + E_{C_0} <= RHO*M < M, so the strict barrier inequality holds ' +
      'with a full (1 - RHO)*M = 0.5*M of the margin left unclaimed',
    headroomFraction: HEADROOM,
  },
  scopeResidual: {
    whatItDoes:
      'names the TARGET fractions f_A, f_B, f_{C_0} that resolve the imp-35725 unmet allocation REQUIREMENT ' +
      'and shows the split is internally consistent (sum < 1, dominant pair largest, subordinate O(1/N))',
    whatItDoesNot:
      'does NOT prove the actual E_A, E_B, E_{C_0} fit inside their shares -- that needs the same MECHANICAL ' +
      'greenfield step: certified interval evaluation of the ~4.886e5-term A_t^{eff}, B_t^{eff}, C_0 sums at ' +
      'the sign-reconciled positive barrier time (imp-35717 R2/R4) to produce numeric E_*, numeric M, then ' +
      'the per-panel strict check E_* <= f_* * M',
    staysGreenfield:
      'the interval-bounded A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A); this module ' +
      'evaluates no sum and verifies no inequality on real data',
  },
  isRigorous: false,
  verdict:
    'ALLOCATION / ORDER-OF-MAGNITUDE SCOPING (frontier-direction, NOT rigorous). imp-35725 left the ' +
    'triangle-inequality margin ALLOCATION as an unmet requirement with no numbers. Candidate schematic ' +
    'split, scale-consistent with the imp-35725 governing weights w_A:w_B:w_{C_0} = 1:1:1/N: with total ' +
    'cap fraction RHO = 1/2, the DOMINANT pair E_A, E_B each claim the LARGEST equal share f_A = f_B ~ 0.25 ' +
    'of the margin M = |A_t + B_t| - |C_t|, and E_{C_0} a SUBORDINATE share f_{C_0} ~ 5.1e-7 (a factor ~N ' +
    'smaller, N ~ 4.886e5 at T_PT). The shares sum to RHO = 0.5 < 1 strictly, so the split leaves a full ' +
    '(1 - RHO) = 0.5 of the margin as STRICT headroom: any caps obeying E_* <= f_* * M satisfy ' +
    '|A_t + B_t| - |C_t| > E_A + E_B + E_{C_0}. This resolves the AMBIGUITY in the imp-35725 requirement ' +
    '(it now names target fractions) but does NOT prove the actual caps fit: that needs certified interval ' +
    'evaluation of the ~4.886e5-term sums at the sign-reconciled positive barrier time plus the per-panel ' +
    'strict check, so the interval-bounded A + B - C certificate stays GREENFIELD (imp-35681 Part A). ' +
    'Evaluates no sum; measures no margin; verifies no inequality; changes no bound; establishes no ' +
    'positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35725 (budgets E_A,E_B,E_{C_0}; names allocation as unmet requirement); imp-35758 (margin - cap = ' +
    'I3 modulus floor); imp-35681 Part A (A+B-C interval bound greenfield); imp-35717 R2/R4 (sign-reconciled ' +
    'positive barrier time); imp-35674 Part D (N(x)=floor(sqrt(x/4 pi)) retained terms); Polymath15 2019 ' +
    '(effective approximation H_t = A + B - C, cap E_A+E_B+E_{C_0}); Platt-Trudgian 2021 (external base).',
};

export const IMP35760_W1_MARGIN_ALLOCATION_ASSERTIONS = [
  {
    // N anchored to the imp-35674 Part D count; margin definition and strict inequality recorded.
    id: 'imp35760-margin-and-N-anchor',
    description: 'Margin M = |A_t+B_t| - |C_t|, strict inequality recorded; N = floor(sqrt(T_PT/4 pi)) anchored',
    holds: () =>
      /\|A_t \+ B_t\| - \|C_t\|/.test(IMP35760_W1_MARGIN_ALLOCATION.margin.definition) &&
      /\|A_t \+ B_t\| - \|C_t\| > E_A \+ E_B \+ E_\{C_0\}/.test(
        IMP35760_W1_MARGIN_ALLOCATION.margin.strictInequality
      ) &&
      N_AT_TPT === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      N_AT_TPT > 4.8e5 && N_AT_TPT < 4.9e5,
  },
  {
    // Dominant pair E_A, E_B get EQUAL largest shares (scale-consistent: E_B tracks E_A).
    id: 'imp35760-dominant-pair-equal-largest',
    description: 'f_A = f_B (dominant pair equal shares), each the largest and ~ RHO/2',
    holds: () =>
      F_A === F_B &&
      F_A > F_C0 &&
      Math.abs(F_A - RHO / 2) < 1e-4 &&
      F_A > 0.24 && F_A < 0.26,
  },
  {
    // Subordinate share is a factor ~N smaller: f_{C_0}/f_A = 1/N (matches imp-35725 O(1/N) ordering).
    id: 'imp35760-subordinate-oom-1-over-N',
    description: 'f_{C_0}/f_A = 1/N (subordinate a factor ~N smaller), consistent with imp-35725 O(1/N)',
    holds: () =>
      F_C0 > 0 &&
      F_C0 < F_A &&
      Math.abs(F_C0 / F_A - 1 / N_AT_TPT) < 1e-12 &&
      F_C0 / F_A < 1e-5,
  },
  {
    // Shares sum to RHO by construction and leave STRICT headroom (sum < 1); headroom = 1 - RHO = 0.5.
    id: 'imp35760-strict-headroom',
    description: 'f_A + f_B + f_{C_0} = RHO < 1 strictly; strict headroom fraction 1 - RHO = 0.5',
    holds: () =>
      Math.abs(F_SUM - RHO) < 1e-12 &&
      F_SUM < 1 &&
      IMP35760_W1_MARGIN_ALLOCATION.strictHeadroomCheck.holds === true &&
      Math.abs(HEADROOM - 0.5) < 1e-9 &&
      HEADROOM > 0,
  },
  {
    // Honesty gate: allocation only, stays greenfield, isRigorous false, no QED, no refereed bound is changed.
    id: 'imp35760-honesty-gate-greenfield-no-qed',
    description: 'Allocation only; A+B-C stays greenfield; isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35760_W1_MARGIN_ALLOCATION.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /GREENFIELD/.test(IMP35760_W1_MARGIN_ALLOCATION.scopeResidual.staysGreenfield) &&
      /MECHANICAL/.test(IMP35760_W1_MARGIN_ALLOCATION.scopeResidual.whatItDoesNot) &&
      /NO QED/.test(IMP35760_W1_MARGIN_ALLOCATION.verdict) &&
      /refereed bound is changed/i.test(IMP35760_W1_MARGIN_ALLOCATION.verdict),
  },
];

for (const a of IMP35760_W1_MARGIN_ALLOCATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35760-w1-margin-allocation-scope assertion failed: ${a.id}`);
  }
}
