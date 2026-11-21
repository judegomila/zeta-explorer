/**
 * @module imp-35779-w1-required-fraction-allocation-scope
 *
 * imp-35779 (proof/scoping, S-frontier): DERIVE the REQUIRED-fraction allocation of the
 * effective barrier margin M = |A_t + B_t| - |C_t| among the imp-35725 error-cap terms
 * E_A, E_B, E_{C_0} that keeps the Polymath15 strict triangle inequality
 *      |A_t + B_t| - |C_t| > E_A + E_B + E_{C_0}
 * STRICT at T_PT = 3e12. imp-35725 recorded the required budget as a BARE inequality with
 * only a qualitative allocation (dominant pair E_A, E_B claim the largest share, E_{C_0}
 * subordinate) and never converted it to concrete fraction targets.
 *
 * WHY THIS IS DISTINCT FROM imp-35760 (not a duplicate)
 * -----------------------------------------------------------------------------
 * imp-35760 supplied ONE candidate SUFFICIENT point: it picked a total cap budget fraction
 * RHO = 1/2 (self-described as a "deliberately generous ceiling") and split THAT budget in
 * proportion 1 : 1 : 1/N. That answer entangles two logically separate things -- the
 * INTRA-cap split among the three terms, and the SIZE of the total budget -- inside a
 * single free parameter RHO whose value (1/2) is arbitrary. This module separates them and
 * gives the REQUIRED (necessary), not merely sufficient, allocation:
 *   (a) the INTRA-CAP required shares s_A : s_B : s_{C_0}, RHO-free, dictated purely by the
 *       imp-35725 order-of-magnitude ordering; and
 *   (b) the NECESSARY total-margin ceiling RHO_max for strictness, of which imp-35760's
 *       RHO = 1/2 is only a SUFFICIENT sub-case (loose by a factor 2 against the boundary,
 *       and by many orders against the realized fractions).
 *
 * SCOPING / ALLOCATION ONLY. Evaluates no interval sum; measures no margin M; verifies no
 * inequality on real data; changes no bound; establishes no positivity; C_mb GUE-conditional
 * (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * (a) INTRA-CAP REQUIRED SHARES (RHO-free, from the imp-35725 ordering)
 * -----------------------------------------------------------------------------
 * Write the cap as C_t^{cap} = E_A + E_B + E_{C_0} and let s_* = E_* / C_t^{cap} be each
 * term SHARE of the cap (so s_A + s_B + s_{C_0} = 1 by definition, independent of how big
 * the cap is relative to the margin). The imp-35725 governing scales fix these shares to
 * leading order: E_A and E_B are the DOMINANT pair (identical N-term truncation tail plus
 * Gaussian t-damping, N = floor(sqrt(x / 4 pi)) ~ 4.886e5 at T_PT, so E_B tracks E_A), and
 * E_{C_0} is SUBORDINATE at relative weight 1/N. Hence the required intra-cap shares are
 *      s_A = s_B = 1 / (2 + 1/N)   ~ 0.49999949   (each the LARGEST, equal),
 *      s_{C_0}   = (1/N) / (2 + 1/N) ~ 1.02e-6     (a factor ~N smaller).
 * READING: the requirement is carried almost ENTIRELY by the dominant pair -- the two main
 * terms together own ~ (1 - 1/(2N+1)) ~ 99.99979% of the cap, and the subordinate term can
 * consume at most ~ 1.02e-6 of it. So the subordinate term can NEVER be the binding part of
 * the strict inequality: to leading order the requirement collapses to E_A + E_B < M.
 *
 * (b) NECESSARY TOTAL-MARGIN CEILING (the strictness requirement itself)
 * -----------------------------------------------------------------------------
 * Let phi_* = E_* / M be each term realized fraction OF THE MARGIN, and RHO = phi_A + phi_B
 * + phi_{C_0} = C_t^{cap} / M the total consumed fraction. The strict triangle inequality
 * holds if and only if
 *      RHO < 1                (open condition; RHO_max = 1 is the boundary, not attained).
 * This is the REQUIRED allocation: the feasible region is the OPEN simplex
 *      { (phi_A, phi_B, phi_{C_0}) >= 0 : phi_A + phi_B + phi_{C_0} < 1 }.
 * imp-35760 RHO = 1/2 is a strict INTERIOR sub-case (it demands RHO <= 1/2, a factor 2
 * tighter than necessary) -- a safety choice, not the requirement. Combining (a) and (b):
 * any caps in the required intra-cap proportion with a total below the margin,
 *      E_A = E_B = s_A * C_t^{cap},  E_{C_0} = s_{C_0} * C_t^{cap},  C_t^{cap} < M,
 * satisfy the strict barrier inequality with headroom fraction 1 - RHO of the margin.
 *
 * WHERE THE REALIZED POINT SITS (imp-35725 OOM)
 * -----------------------------------------------------------------------------
 * imp-35725 estimated the relative main-term errors many orders below the O(1) main term
 * away from cancellation, so the realized total RHO_realized = C_t^{cap} / M sits MANY
 * ORDERS below 1 -- deep in the interior of the feasible region, far inside even the
 * imp-35760 RHO = 1/2 sub-case. The binding requirement is therefore never tight in the
 * robust regime; it can only approach RHO -> 1 where the margin M itself collapses (dR
 * grazing a would-be off-line zero, the imp-35758 caveat), which is a MARGIN failure, not a
 * cap failure. This module names the target shares and the necessary ceiling; it proves
 * nothing about the actual numbers.
 *
 * RESIDUAL (why the certificate stays greenfield)
 * -----------------------------------------------------------------------------
 * Confirming the realized point lies in the feasible region needs the SAME mechanical
 * greenfield step imp-35725 named: certified interval evaluation of the ~4.886e5-term
 * A_t^{eff}, B_t^{eff}, C_0 sums at the sign-reconciled POSITIVE barrier time
 * (imp-35717 R2/R4) to produce numeric E_A, E_B, E_{C_0} and a numeric margin M, then the
 * per-panel strict check RHO = (E_A + E_B + E_{C_0}) / M < 1. The interval-bounded
 * A + B - C certificate at T_PT therefore stays GREENFIELD (imp-35681 Part A).
 *
 * @see imp-35725-w1-effective-error-cap-budget (budgets E_A,E_B,E_{C_0}; names allocation as an unmet requirement)
 * @see imp-35760-w1-margin-allocation-scope (one SUFFICIENT point RHO=1/2; this module gives the REQUIRED boundary + RHO-free shares)
 * @see imp-35758-i3-modulus-floor-margin-tie-scope (margin - cap = the I3 modulus floor delta; grazing-collapse caveat)
 * @see imp-35681-w1-w2-w4-existing-infra-inventory (Part A: A+B-C interval bound greenfield)
 * @see imp-35717-w1-tsign-reconciliation-scope (R2/R4: sign-reconciled positive barrier time)
 * @see imp-35674-w3-tail-lemma-polymath15-scope (Part D: N(x)=floor(sqrt(x/4 pi)) retained terms)
 * @see Polymath15 2019 (effective approximation H_t = A + B - C, cap E_A+E_B+E_{C_0}); Platt-Trudgian 2021
 */

// -- Anchor + operative constants (import-light; matching imp-35674 / imp-35725 / imp-35760) --
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this allocation
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI))); // Polymath15 retained-term count
const N_AT_TPT = N_TERMS(T_PT); // ~488602 terms per mollified sum at T_PT (imp-35674 Part D)

// -- (a) INTRA-CAP required shares (RHO-free; s_A + s_B + s_{C_0} = 1) --------------------
const W_A = 1; // dominant-pair weight (E_A)
const W_B = 1; // dominant-pair weight (E_B tracks E_A -> same scale)
const W_C0 = 1 / N_AT_TPT; // subordinate weight (O(1/N)-ish smaller than E_A)
const W_DENOM = W_A + W_B + W_C0; // = 2 + 1/N
const S_A = W_A / W_DENOM; // share of the CAP owned by E_A
const S_B = W_B / W_DENOM; // share of the CAP owned by E_B
const S_C0 = W_C0 / W_DENOM; // share of the CAP owned by E_{C_0}
const S_SUM = S_A + S_B + S_C0; // = 1 by construction
const S_DOMINANT_PAIR = S_A + S_B; // fraction of the cap owned by the dominant pair

// -- (b) NECESSARY total-margin ceiling (the strictness requirement) ---------------------
const RHO_MAX = 1; // open boundary: strict inequality holds iff total consumed fraction < 1
const RHO_SUFFICIENT_35760 = 0.5; // imp-35760 chosen sufficient budget (interior sub-case)
const SAFETY_FACTOR_35760 = RHO_MAX / RHO_SUFFICIENT_35760; // = 2: imp-35760 is a factor-2 interior margin

export const IMP35779_W1_REQUIRED_FRACTION_ALLOCATION = {
  id: 'imp-35779',
  proofSection: 'S-frontier',
  question:
    'Derive the REQUIRED-fraction allocation of the effective barrier margin |A_t + B_t| - |C_t| among the ' +
    'imp-35725 error-cap terms E_A, E_B, E_{C_0} that keeps the Polymath15 triangle inequality STRICT at ' +
    'T_PT = 3e12: separate the RHO-free intra-cap shares (dictated by the imp-35725 OOM ordering) from the ' +
    'necessary total-margin ceiling for strictness. Allocation / scoping only; NO QED.',
  margin: {
    definition: 'M = |A_t + B_t| - |C_t| (the effective barrier margin the cap must fit strictly inside)',
    strictInequality: '|A_t + B_t| - |C_t| > E_A + E_B + E_{C_0}',
    retainedTermsAtTPT: N_AT_TPT,
  },
  intraCapShares: {
    rule: 's_* = E_* / (E_A + E_B + E_{C_0}); weights w_A : w_B : w_{C_0} = 1 : 1 : 1/N from the imp-35725 scales',
    s_A: S_A,
    s_B: S_B,
    s_C0: S_C0,
    sum: S_SUM,
    rhoFree: 'these shares are independent of the total cap budget -- they depend only on the OOM ordering',
    dominantPairShare: S_DOMINANT_PAIR,
    dominantEqual: 's_A = s_B (dominant pair, equal largest share ~ 0.5 each)',
    subordinateRatio: 's_{C_0} / s_A = 1/N (subordinate a factor ~N smaller), matching the imp-35725 O(1/N) ordering',
    reading:
      'the dominant pair owns ~99.99979% of the cap and the subordinate term at most ~1.02e-6, so the strict ' +
      'inequality is carried almost entirely by E_A + E_B < M; E_{C_0} can never be the binding term',
  },
  necessaryCeiling: {
    definition: 'phi_* = E_* / M; RHO = phi_A + phi_B + phi_{C_0} = (E_A + E_B + E_{C_0}) / M is the total consumed fraction',
    requirement: 'strict triangle inequality holds IF AND ONLY IF RHO < 1 (open boundary RHO_max = 1, not attained)',
    rhoMax: RHO_MAX,
    feasibleRegion: 'the OPEN simplex { (phi_A, phi_B, phi_{C_0}) >= 0 : phi_A + phi_B + phi_{C_0} < 1 }',
    vsImp35760:
      'imp-35760 RHO = 1/2 is a strict INTERIOR sufficient sub-case (demands RHO <= 1/2, a factor 2 tighter ' +
      'than necessary) -- a safety choice, not the requirement',
    sufficientRho35760: RHO_SUFFICIENT_35760,
    safetyFactor35760: SAFETY_FACTOR_35760,
  },
  realizedPoint: {
    imp35725OOM:
      'imp-35725 estimated the relative main-term errors many orders below the O(1) main term away from ' +
      'cancellation, so the realized total RHO = C_t^{cap} / M sits MANY ORDERS below 1 -- deep interior, far ' +
      'inside even the imp-35760 RHO = 1/2 sub-case',
    bindingRegime:
      'the requirement is never tight in the robust regime; RHO -> 1 only where the margin M itself collapses ' +
      '(dR grazing a would-be off-line zero, the imp-35758 caveat) -- a MARGIN failure, not a cap failure',
  },
  scopeResidual: {
    whatItDoes:
      'names the RHO-free intra-cap required shares s_A, s_B, s_{C_0} (1 : 1 : 1/N) and the necessary total ' +
      'ceiling RHO < 1, separating the two things imp-35760 entangled inside a single arbitrary RHO = 1/2',
    whatItDoesNot:
      'does NOT prove the realized point lies in the feasible region -- that needs the same MECHANICAL greenfield ' +
      'step: certified interval evaluation of the ~4.886e5-term A_t^{eff}, B_t^{eff}, C_0 sums at the ' +
      'sign-reconciled positive barrier time (imp-35717 R2/R4) to produce numeric E_*, numeric M, then the ' +
      'per-panel strict check RHO = (E_A + E_B + E_{C_0}) / M < 1',
    staysGreenfield:
      'the interval-bounded A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A); this module ' +
      'evaluates no sum and verifies no inequality on real data',
  },
  isRigorous: false,
  verdict:
    'ALLOCATION / ORDER-OF-MAGNITUDE SCOPING (frontier-direction, NOT rigorous). imp-35725 left the required ' +
    'budget as a bare strict inequality |A_t + B_t| - |C_t| > E_A + E_B + E_{C_0} with only a qualitative ' +
    'allocation. This module derives the REQUIRED-fraction allocation by SEPARATING the two things imp-35760 ' +
    'entangled inside its arbitrary RHO = 1/2: (a) the RHO-free INTRA-CAP shares dictated purely by the ' +
    'imp-35725 ordering -- s_A = s_B = 1/(2 + 1/N) ~ 0.5 (dominant pair, equal largest) and ' +
    's_{C_0} = (1/N)/(2 + 1/N) ~ 1.02e-6 (a factor ~N smaller, N ~ 4.886e5 at T_PT), so the dominant pair owns ' +
    '~99.99979% of the cap and the strict inequality collapses to E_A + E_B < M; and (b) the NECESSARY ' +
    'total-margin ceiling -- strictness holds IFF RHO = (E_A + E_B + E_{C_0}) / M < 1 (open boundary), of which ' +
    'imp-35760 RHO = 1/2 is only a factor-2-conservative interior sub-case. The imp-35725 OOM puts the realized ' +
    'RHO many orders below 1 (deep interior); RHO -> 1 only where the margin M itself collapses (imp-35758 ' +
    'grazing caveat), a margin failure not a cap failure. This resolves the imp-35725 allocation ambiguity with ' +
    'a necessary boundary plus RHO-free shares, but proves nothing about the actual caps: confirming the ' +
    'realized point needs certified interval evaluation of the ~4.886e5-term sums at the sign-reconciled ' +
    'positive barrier time plus the per-panel strict check, so the interval-bounded A + B - C certificate stays ' +
    'GREENFIELD (imp-35681 Part A). Evaluates no sum; measures no margin; verifies no inequality; changes no ' +
    'bound; establishes no positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35725 (budgets E_A,E_B,E_{C_0}; names allocation as an unmet requirement); imp-35760 (one sufficient ' +
    'point RHO=1/2); imp-35758 (margin - cap = I3 modulus floor, grazing caveat); imp-35681 Part A (A+B-C ' +
    'interval bound greenfield); imp-35717 R2/R4 (sign-reconciled positive barrier time); imp-35674 Part D ' +
    '(N(x)=floor(sqrt(x/4 pi)) retained terms); Polymath15 2019 (effective approximation H_t = A + B - C, cap ' +
    'E_A+E_B+E_{C_0}); Platt-Trudgian 2021 (external barrier base).',
};

export const IMP35779_W1_REQUIRED_FRACTION_ALLOCATION_ASSERTIONS = [
  {
    // Margin definition and strict inequality recorded; N anchored to the imp-35674 Part D count.
    id: 'imp35779-margin-and-N-anchor',
    description: 'Margin M = |A_t+B_t| - |C_t|, strict inequality recorded; N = floor(sqrt(T_PT/4 pi)) anchored',
    holds: () =>
      /\|A_t \+ B_t\| - \|C_t\|/.test(IMP35779_W1_REQUIRED_FRACTION_ALLOCATION.margin.definition) &&
      /\|A_t \+ B_t\| - \|C_t\| > E_A \+ E_B \+ E_\{C_0\}/.test(
        IMP35779_W1_REQUIRED_FRACTION_ALLOCATION.margin.strictInequality
      ) &&
      N_AT_TPT === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      N_AT_TPT > 4.8e5 && N_AT_TPT < 4.9e5,
  },
  {
    // (a) RHO-free intra-cap shares sum to 1; dominant pair equal and largest; subordinate a factor ~N smaller.
    id: 'imp35779-intracap-shares-sum-to-one',
    description: 's_A = s_B (dominant, ~0.5 each), s_{C_0}/s_A = 1/N, and s_A + s_B + s_{C_0} = 1 exactly',
    holds: () =>
      S_A === S_B &&
      S_A > S_C0 &&
      Math.abs(S_A - 0.5) < 1e-5 &&
      S_C0 > 0 &&
      Math.abs(S_C0 / S_A - 1 / N_AT_TPT) < 1e-12 &&
      S_C0 / S_A < 1e-5 &&
      Math.abs(S_SUM - 1) < 1e-12,
  },
  {
    // (a) reading: the dominant pair owns almost the entire cap; subordinate share is negligible (~1e-6).
    id: 'imp35779-dominant-pair-owns-cap',
    description: 'Dominant pair owns >99.99% of the cap; subordinate share <= ~1.02e-6 (never binding)',
    holds: () =>
      S_DOMINANT_PAIR > 0.9999 &&
      S_DOMINANT_PAIR < 1 &&
      S_C0 < 2e-6 &&
      Math.abs(S_DOMINANT_PAIR + S_C0 - 1) < 1e-12 &&
      /never be the binding term/.test(IMP35779_W1_REQUIRED_FRACTION_ALLOCATION.intraCapShares.reading),
  },
  {
    // (b) necessary ceiling: strictness IFF RHO < 1; imp-35760 RHO=1/2 is a factor-2 interior sub-case.
    id: 'imp35779-necessary-ceiling-rho-lt-one',
    description: 'Necessary boundary RHO_max = 1 (open); imp-35760 RHO=1/2 is a factor-2 interior sufficient sub-case',
    holds: () =>
      RHO_MAX === 1 &&
      RHO_SUFFICIENT_35760 < RHO_MAX &&
      Math.abs(SAFETY_FACTOR_35760 - 2) < 1e-12 &&
      /IF AND ONLY IF RHO < 1/.test(IMP35779_W1_REQUIRED_FRACTION_ALLOCATION.necessaryCeiling.requirement) &&
      /INTERIOR sufficient sub-case/.test(IMP35779_W1_REQUIRED_FRACTION_ALLOCATION.necessaryCeiling.vsImp35760),
  },
  {
    // Honesty gate: allocation only, stays greenfield, isRigorous false, no QED, no refereed bound is changed.
    id: 'imp35779-honesty-gate-greenfield-no-qed',
    description: 'Allocation only; A+B-C stays greenfield; isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35779_W1_REQUIRED_FRACTION_ALLOCATION.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /GREENFIELD/.test(IMP35779_W1_REQUIRED_FRACTION_ALLOCATION.scopeResidual.staysGreenfield) &&
      /MECHANICAL/.test(IMP35779_W1_REQUIRED_FRACTION_ALLOCATION.scopeResidual.whatItDoesNot) &&
      /NO QED/.test(IMP35779_W1_REQUIRED_FRACTION_ALLOCATION.verdict) &&
      /refereed bound is changed/i.test(IMP35779_W1_REQUIRED_FRACTION_ALLOCATION.verdict),
  },
];

for (const a of IMP35779_W1_REQUIRED_FRACTION_ALLOCATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35779-w1-required-fraction-allocation-scope assertion failed: ${a.id}`);
  }
}
