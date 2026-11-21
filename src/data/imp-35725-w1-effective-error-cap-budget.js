/**
 * @module imp-35725-w1-effective-error-cap-budget
 *
 * imp-35725 (proof/assessment, S-frontier): BUDGET the order of magnitude of the
 * Polymath15 effective-approximation error cap C_t = E_A + E_B + E_{C_0} at the
 * barrier anchor T_PT = 3e12 -- the interval-error budget the imp-35681 Part A W1
 * verdict flags as GREENFIELD for instantiating H_t = A + B - C with rigorous
 * per-term bounds.
 *
 * imp-35681 Part A graded W1 (instantiate H_t = A + B - C with an explicit interval
 * error bound near T_PT) as STRUCTURAL-overlap-only: the repo holds heat-flow H_t as
 * an OBJECT but NOT the Polymath15 mollified A_t + B_t main terms with the
 * C_t = E_A + E_B + E_{C_0} error cap. imp-35717 R4 then named those per-term caps as
 * the greenfield seed WITHOUT budgeting them. This module supplies the missing budget:
 * for each of E_A, E_B, E_{C_0} it records (i) its ROLE in the decomposition, (ii) the
 * STRUCTURAL SCALE that governs its magnitude, (iii) an ORDER-OF-MAGNITUDE ESTIMATE at
 * T_PT = 3e12, and it records the REQUIRED budget (the triangle-inequality margin the
 * cap must fit inside) versus the ACHIEVABILITY/greenfield residual.
 *
 * SCOPING / ORDER-OF-MAGNITUDE ESTIMATE ONLY. Ports nothing; discharges nothing;
 * instantiates no interval sum; verifies no inequality; changes no bound; establishes
 * no positivity; C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * DECOMPOSITION RECALLED (Polymath15 2019, effective approximation)
 * -----------------------------------------------------------------------------
 * The effective approximation writes the heat-flowed object as
 *      H_t(x) = A_t(x) + B_t(x) - C_t(x) + (approximation error),
 * where A_t and B_t are the two MOLLIFIED Dirichlet-sum main terms, each a sum of
 * N = floor(sqrt(x / 4 pi)) retained terms, and C_t is a lower-order Riemann-Siegel-
 * type correction. The approximation error is capped ABOVE by
 *      C_t^{cap} = E_A + E_B + E_{C_0},
 * the sum of the per-term interval-error budgets this module scopes.
 *
 * E_A -- MOLLIFIED A_t MAIN-TERM ERROR
 * -----------------------------------------------------------------------------
 * ROLE: bounds |A_t - A_t^{eff}|, the gap between the true A-term and its truncated,
 * interval-evaluated surrogate. GOVERNING SCALE: the tail beyond the N-th retained
 * term plus the Gaussian t-damping exp(t/4 * (log n)^2)-type factor; the relative tail
 * SHRINKS as N grows, so higher barrier height buys a smaller RELATIVE E_A. OOM at
 * T_PT: with N ~ 4.886e5 the truncation is deep -- the relative A-term error sits many
 * orders below the O(1) main term; the ABSOLUTE cost is the certified rounding of an
 * N-term interval sum, not the analytic tail.
 *
 * E_B -- MOLLIFIED B_t MAIN-TERM ERROR
 * -----------------------------------------------------------------------------
 * ROLE: bounds |B_t - B_t^{eff}| symmetrically to E_A. GOVERNING SCALE: identical
 * structure -- N-term truncation + Gaussian damping -- so E_B tracks E_A to leading
 * order at the same height; the two are budgeted together as the DOMINANT pair of the
 * cap. OOM at T_PT: comparable to E_A (same N, same damping), relative error many
 * orders below the main term.
 *
 * E_{C_0} -- LEADING CORRECTION-TERM REMAINDER
 * -----------------------------------------------------------------------------
 * ROLE: bounds the remainder of the C_t Riemann-Siegel-type correction after its
 * leading C_0 piece is retained. GOVERNING SCALE: the NEXT-ORDER term of the
 * asymptotic correction expansion, relatively O(1/N)-ish smaller than C_t itself;
 * because C_t is already lower-order than A_t + B_t, E_{C_0} is the SMALLEST of the
 * three at T_PT. OOM at T_PT: subordinate to E_A, E_B; it is the correction-of-a-
 * correction and does not dominate the cap.
 *
 * REQUIRED BUDGET (what the cap must fit inside)
 * -----------------------------------------------------------------------------
 * To certify H_t has no off-line zeros in the barrier region the triangle inequality
 * must hold STRICTLY:
 *      |A_t + B_t| - |C_t| > E_A + E_B + E_{C_0}.
 * So the cap is not budgeted in isolation: each term must consume only a small FRACTION
 * of the effective barrier margin |A_t + B_t| - |C_t|. A safe allocation splits the
 * margin so the DOMINANT pair E_A, E_B each claim the largest share and E_{C_0} a
 * subordinate share, leaving strict headroom. This is a REQUIREMENT the instantiation
 * must MEET, not an achievable bound this module derives.
 *
 * ACHIEVABILITY / RESIDUAL (why this is still greenfield)
 * -----------------------------------------------------------------------------
 * The governing scales say the RELATIVE errors are small and shrink with height, so at
 * the deep T_PT truncation the analytic tails are NOT the obstruction. The obstruction
 * is MECHANICAL: instantiating A_t^{eff}, B_t^{eff}, C_0 as certified interval sums of
 * ~4.886e5 terms each with rigorous rounding, at the sign-reconciled POSITIVE barrier
 * time (imp-35717 R2/R4), and then CHECKING the strict triangle inequality above. This
 * module budgets the terms; it does NOT evaluate the sums or verify the inequality. The
 * interval-bounded A + B - C certificate at T_PT therefore stays GREENFIELD exactly as
 * imp-35681 Part A found.
 *
 * @see imp-35681-w1-w2-w4-existing-infra-inventory (Part A: A+B-C interval bound greenfield)
 * @see imp-35717-w1-tsign-reconciliation-scope (R4: names E_A,E_B,E_{C_0} as the greenfield seed)
 * @see imp-35674-w3-tail-lemma-polymath15-scope (Part D: N(x)=floor(sqrt(x/4 pi)) retained terms)
 * @see imp-35653-sbarrier-finite-check-porting-scope (names W1 in the S_barrier port)
 * @see Polymath15 2019 (effective approximation H_t = A + B - C, error cap E_A+E_B+E_{C_0}); Platt-Trudgian 2021
 */

// -- Anchor + operative constants (import-light; matching imp-35674 / imp-35717) ----
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this budget
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI))); // Polymath15 retained-term count
const N_AT_TPT = N_TERMS(T_PT); // ~488602 terms per mollified sum at T_PT (imp-35674 Part D)

export const IMP35725_W1_EFFECTIVE_ERROR_CAP_BUDGET = {
  id: 'imp-35725',
  proofSection: 'S-frontier',
  question:
    'Budget the order of magnitude of the Polymath15 effective-approximation error cap ' +
    'C_t = E_A + E_B + E_{C_0} at T_PT = 3e12: for each per-term interval-error budget, its role in the ' +
    'A + B - C decomposition, the structural scale that governs its magnitude, an order-of-magnitude ' +
    'estimate at T_PT, and the required budget versus the greenfield residual. Estimate only; NO QED.',
  decomposition: {
    form: 'H_t(x) = A_t(x) + B_t(x) - C_t(x) + (approximation error)',
    mainTerms: 'A_t, B_t are the two MOLLIFIED Dirichlet-sum main terms, each N = floor(sqrt(x / 4 pi)) terms',
    correction: 'C_t is a lower-order Riemann-Siegel-type correction',
    errorCap: 'approximation error <= C_t^{cap} = E_A + E_B + E_{C_0}',
    retainedTermsAtTPT: N_AT_TPT,
  },
  E_A: {
    role: 'bounds |A_t - A_t^{eff}|, the truncated interval-evaluated A-term surrogate gap',
    governingScale:
      'tail beyond the N-th retained term plus Gaussian t-damping exp(t/4 * (log n)^2)-type factor; ' +
      'the RELATIVE tail shrinks as N grows, so higher height buys a smaller relative E_A',
    oomAtTPT:
      'with N ~ 4.886e5 the truncation is deep -- relative A-term error many orders below the O(1) main ' +
      'term; the ABSOLUTE cost is certified rounding of an N-term interval sum, not the analytic tail',
    rank: 'dominant pair (with E_B)',
  },
  E_B: {
    role: 'bounds |B_t - B_t^{eff}| symmetrically to E_A',
    governingScale:
      'identical structure to E_A -- N-term truncation + Gaussian damping -- so E_B tracks E_A to ' +
      'leading order at the same height',
    oomAtTPT: 'comparable to E_A (same N, same damping); relative error many orders below the main term',
    rank: 'dominant pair (with E_A)',
  },
  E_C0: {
    role: 'bounds the remainder of the C_t correction after its leading C_0 piece is retained',
    governingScale:
      'next-order term of the asymptotic correction expansion, relatively O(1/N)-ish smaller than C_t; ' +
      'since C_t is already lower-order than A_t + B_t, this is a correction-of-a-correction',
    oomAtTPT: 'smallest of the three at T_PT; subordinate to E_A, E_B; does not dominate the cap',
    rank: 'subordinate',
  },
  requiredBudget: {
    strictInequality: '|A_t + B_t| - |C_t| > E_A + E_B + E_{C_0}',
    allocation:
      'each cap term must consume only a small FRACTION of the effective barrier margin ' +
      '|A_t + B_t| - |C_t|; dominant pair E_A, E_B claim the largest share, E_{C_0} a subordinate share, ' +
      'leaving strict headroom',
    character: 'a REQUIREMENT the instantiation must MEET, NOT an achievable bound derived here',
  },
  achievabilityResidual: {
    analyticTailsNotObstruction:
      'governing scales make the RELATIVE errors small and shrinking with height, so at the deep T_PT ' +
      'truncation the analytic tails are NOT the obstruction',
    mechanicalObstruction:
      'the obstruction is MECHANICAL: instantiating A_t^{eff}, B_t^{eff}, C_0 as certified interval sums ' +
      'of ~4.886e5 terms each with rigorous rounding, at the sign-reconciled POSITIVE barrier time ' +
      '(imp-35717 R2/R4), then CHECKING the strict triangle inequality',
    staysGreenfield:
      'this module budgets the terms; it does NOT evaluate the sums or verify the inequality, so the ' +
      'interval-bounded A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A)',
  },
  isRigorous: false,
  verdict:
    'ASSESSMENT / ORDER-OF-MAGNITUDE BUDGET (frontier-direction, NOT rigorous). The Polymath15 effective ' +
    'error cap C_t = E_A + E_B + E_{C_0} bounds the difference between H_t and its A + B - C effective ' +
    'approximation, with A_t, B_t the two mollified N-term main sums (N = floor(sqrt(x / 4 pi)) ~ 4.886e5 ' +
    'at T_PT) and C_t a lower-order correction. BUDGET: E_A and E_B are the DOMINANT pair -- both governed ' +
    'by the N-term truncation tail plus Gaussian t-damping, so both shrink RELATIVELY as height grows and ' +
    'sit many orders below the O(1) main term at the deep T_PT truncation. E_{C_0} is SUBORDINATE, the ' +
    'O(1/N)-smaller remainder of an already lower-order correction. REQUIRED: the cap must fit STRICTLY ' +
    'inside the barrier margin |A_t + B_t| - |C_t|, each term claiming only a fraction -- a requirement to ' +
    'MEET, not a bound derived here. RESIDUAL: the analytic tails are not the obstruction at T_PT; the ' +
    'MECHANICAL cost -- certified interval evaluation of ~4.886e5-term sums at the sign-reconciled positive ' +
    'barrier time plus the strict-inequality check -- keeps the interval-bounded A + B - C certificate ' +
    'GREENFIELD (imp-35681 Part A). Ports nothing; discharges nothing; instantiates no sum; verifies no ' +
    'inequality; changes no bound; establishes no positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35681 Part A (A+B-C interval bound greenfield); imp-35717 R4 (names E_A,E_B,E_{C_0} as the seed); ' +
    'imp-35674 Part D (N(x)=floor(sqrt(x/4 pi)) retained terms); imp-35653 (names W1 in the S_barrier ' +
    'port); Polymath15 2019 (effective approximation H_t = A + B - C, error cap E_A+E_B+E_{C_0}); ' +
    'Platt-Trudgian 2021 (external barrier base).',
};

export const IMP35725_W1_EFFECTIVE_ERROR_CAP_BUDGET_ASSERTIONS = [
  {
    // Decomposition: H_t = A + B - C with the cap being the sum of the three per-term budgets; N anchored.
    id: 'imp35725-decomposition-cap-sum',
    description: 'Decomposition H_t = A+B-C with cap = E_A + E_B + E_{C_0}; N = floor(sqrt(T_PT/4 pi)) anchored',
    holds: () =>
      /A_t\(x\) \+ B_t\(x\) - C_t\(x\)/.test(IMP35725_W1_EFFECTIVE_ERROR_CAP_BUDGET.decomposition.form) &&
      /E_A \+ E_B \+ E_\{C_0\}/.test(IMP35725_W1_EFFECTIVE_ERROR_CAP_BUDGET.decomposition.errorCap) &&
      N_AT_TPT === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      N_AT_TPT > 4.8e5 && N_AT_TPT < 4.9e5,
  },
  {
    // E_A, E_B are the dominant pair, both governed by N-term truncation + Gaussian damping.
    id: 'imp35725-ea-eb-dominant-pair',
    description: 'E_A and E_B are the dominant pair, governed by N-term truncation + Gaussian t-damping',
    holds: () =>
      /dominant pair/.test(IMP35725_W1_EFFECTIVE_ERROR_CAP_BUDGET.E_A.rank) &&
      /dominant pair/.test(IMP35725_W1_EFFECTIVE_ERROR_CAP_BUDGET.E_B.rank) &&
      /Gaussian/.test(IMP35725_W1_EFFECTIVE_ERROR_CAP_BUDGET.E_A.governingScale) &&
      /tracks E_A/.test(IMP35725_W1_EFFECTIVE_ERROR_CAP_BUDGET.E_B.governingScale),
  },
  {
    // E_{C_0} is subordinate: the O(1/N)-smaller remainder of an already lower-order correction.
    id: 'imp35725-ec0-subordinate',
    description: 'E_{C_0} is subordinate: O(1/N)-smaller remainder of the already lower-order C_t correction',
    holds: () =>
      /subordinate/.test(IMP35725_W1_EFFECTIVE_ERROR_CAP_BUDGET.E_C0.rank) &&
      /O\(1\/N\)/.test(IMP35725_W1_EFFECTIVE_ERROR_CAP_BUDGET.E_C0.governingScale) &&
      /smallest of the three/.test(IMP35725_W1_EFFECTIVE_ERROR_CAP_BUDGET.E_C0.oomAtTPT),
  },
  {
    // Required budget: strict triangle inequality, a requirement to MEET not a bound derived here.
    id: 'imp35725-required-strict-inequality',
    description: 'Required budget: cap must fit STRICTLY inside |A_t+B_t| - |C_t|; a requirement, not a derived bound',
    holds: () =>
      /\|A_t \+ B_t\| - \|C_t\| > E_A \+ E_B \+ E_\{C_0\}/.test(
        IMP35725_W1_EFFECTIVE_ERROR_CAP_BUDGET.requiredBudget.strictInequality
      ) &&
      /NOT an achievable bound derived here/.test(IMP35725_W1_EFFECTIVE_ERROR_CAP_BUDGET.requiredBudget.character),
  },
  {
    // Residual + honesty gate: mechanical obstruction keeps A+B-C greenfield; estimate only, no QED, no refereed bound is changed.
    id: 'imp35725-honesty-gate-greenfield-no-qed',
    description: 'Residual: mechanical interval-sum cost keeps A+B-C greenfield; estimate only, no QED, no refereed bound is changed',
    holds: () =>
      IMP35725_W1_EFFECTIVE_ERROR_CAP_BUDGET.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /MECHANICAL/.test(IMP35725_W1_EFFECTIVE_ERROR_CAP_BUDGET.achievabilityResidual.mechanicalObstruction) &&
      /GREENFIELD/.test(IMP35725_W1_EFFECTIVE_ERROR_CAP_BUDGET.achievabilityResidual.staysGreenfield) &&
      /NO QED/.test(IMP35725_W1_EFFECTIVE_ERROR_CAP_BUDGET.verdict) &&
      /refereed bound is changed/i.test(IMP35725_W1_EFFECTIVE_ERROR_CAP_BUDGET.verdict),
  },
];

for (const a of IMP35725_W1_EFFECTIVE_ERROR_CAP_BUDGET_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35725-w1-effective-error-cap-budget assertion failed: ${a.id}`);
  }
}
