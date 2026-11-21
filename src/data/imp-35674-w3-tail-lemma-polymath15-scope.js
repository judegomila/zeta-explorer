/**
 * @module imp-35674-w3-tail-lemma-polymath15-scope
 *
 * imp-35674 (proof/assessment, S-frontier): SCOPE the imp-35653 work-item W3 --
 * the ANALYTIC tail lemma |A + B| > |C| for all x >= T_PT + Delta, re-anchored at
 * the repo already-verified height T_PT = 3e12. imp-35653 named W3 as the sole
 * breakthrough-tier, NON-finite obligation in the S_barrier port (the piece no
 * finite winding mesh can cover) but never itemized it as its own scope. This
 * module resolves: (i) WHICH Polymath15 large-x zero-free estimate W3 requires,
 * (ii) how re-anchoring from the Polymath15 barrier height to T_PT = 3e12 changes
 * its constants, and (iii) how the estimate depends on the repo heat parameter t.
 *
 * ASSESSMENT / SCOPING ONLY. Ports nothing; establishes no positivity; discharges
 * nothing; changes no bound; no RH verdict, NO QED. No refereed bound is changed.
 *
 * PART A -- WHAT W3 STATES PRECISELY
 * -----------------------------------------------------------------------------
 * W3 is the semi-infinite (B2) piece of imp-35653's S_barrier decomposition: an
 * explicit inequality certifying that the heat-flow-evolved H_t has NO zero off
 * the critical line at any height above the transition rectangle, i.e.
 *     |A_t(x) + B_t(x)| > |C_t(x)|   for ALL x >= T_PT + Delta,
 * where A_t, B_t are the two effective (Dirichlet-series-like) main sums of the
 * Polymath15 approximation of H_t and C_t is the total explicit error bound. When
 * this margin holds, H_t = A_t + B_t - C_t cannot vanish, so no off-line zero can
 * exist in the tail. It is verified ONCE as a closed-form inequality and is valid
 * for the whole unbounded tail -- NOT a mesh check, NOT enumerable, NOT finite.
 *
 * PART B -- WHICH POLYMATH15 ESTIMATE IS REQUIRED
 * -----------------------------------------------------------------------------
 * The required estimate is the Polymath15 MOLLIFIED TRIANGLE-INEQUALITY lower
 * bound on |A_t + B_t|, combined with the effective error bounds. Concretely it
 * is the conjunction of:
 *   (i)  a LOWER bound on |A_t + B_t| that keeps the ratio B_t / A_t bounded away
 *        from -1 (no near-total cancellation of the two main sums), typically via
 *        the dominant n = 1 term of A_t and a triangle bound on the remainder; and
 *   (ii) UPPER bounds on the error sum C_t = E_A + E_B + E_{C_0} (the Polymath15
 *        explicit approximation-error terms), each an elementary tail sum over the
 *        N ~ sqrt(x / 4 pi) retained terms.
 * The tail lemma is exactly the statement that the margin (i) - (ii) stays
 * strictly positive uniformly in x. This is the same object Polymath15 used to
 * clear the region above their barrier; W3 is that estimate re-anchored higher.
 *
 * PART C -- HEAT-PARAMETER t DEPENDENCE (the sharpest scoping finding)
 * -----------------------------------------------------------------------------
 * The margin |A_t + B_t| - |C_t| depends monotonically on the heat parameter t:
 * forward de Bruijn / heat flow (t increasing) contracts the zeros toward the real
 * axis and damps the high-frequency error content, so the inequality gets EASIER
 * as t grows and is HARDEST at t = 0 (the Riemann xi endpoint). The Polymath15
 * barrier uses a strictly POSITIVE t to earn this damping margin.
 *   CAVEAT (must be reconciled before porting): the repo operative parameter is
 *   the Gaussian-convolution proxy, which the winding-thread result identifies as
 *   EXACT de Bruijn flow at NEGATIVE time (t = -4 tau_repo). Negative de Bruijn
 *   time sits on the HARDER side of the endpoint -- it does NOT enjoy the
 *   forward-flow damping the positive-t Polymath15 barrier does. So re-anchoring
 *   W3 at the repo heat parameter is not merely "the same estimate at a bigger
 *   height": the SIGN of the operative t relative to the Polymath15 barrier must
 *   be reconciled first, and if the operative parameter really sits at negative de
 *   Bruijn time the tail-lemma margin is strictly TIGHTER than Polymath15's, not
 *   looser. This is a scoping caveat, not a computed obstruction.
 *
 * PART D -- RE-ANCHORING CONSTANTS: POLYMATH15 HEIGHT -> T_PT = 3e12
 * -----------------------------------------------------------------------------
 * The number of retained terms is N(x) = floor(sqrt(x / 4 pi)). Re-anchoring from
 * an illustrative Polymath15 barrier height (order 6e10) up to T_PT = 3e12 raises
 * N by the ratio sqrt(T_PT / x0) ~ 7x (from ~6.9e4 to ~4.89e5 terms). The main
 * sums A_t, B_t gain terms and the error sums C_t gain terms too, but each error
 * term decays with n, so the per-height error bound does NOT grow proportionally;
 * the LOCAL zero density (1 / 2 pi) log(x / 2 pi) grows only logarithmically
 * (~4.28 zeros/unit at T_PT). The binding question W3 must answer is whether the
 * margin (i) - (ii) stays strictly positive UNIFORMLY across the whole tail x >=
 * T_PT + Delta at the operative t -- an analytic uniformity statement, NOT a bigger
 * finite computation. Re-anchoring changes constants (term counts, error prefactors)
 * but does not change the CHARACTER of the obligation: it stays non-finite.
 *
 * PART E -- WHY W3 CANNOT BE DISCHARGED BY THE ENGINE
 * -----------------------------------------------------------------------------
 * Every finite winding mesh covers a BOUNDED rectangle (imp-35653 Part A). W3 is
 * the uniform-in-x inequality over the SEMI-INFINITE tail; no finite mesh spans it.
 * The engine can instantiate constants (N(T_PT), density, error prefactors) and
 * spot-check the margin at sampled heights -- necessary sanity, never sufficient.
 * The uniform positivity of |A_t + B_t| - |C_t| for ALL x >= T_PT + Delta is the
 * breakthrough-tier analytic proof obligation, gated additionally on the Part C
 * heat-sign reconciliation. Assessment/scoping only; NO QED.
 *
 * @see imp-35653-sbarrier-finite-check-porting-scope (names W3 as the breakthrough-tier obligation)
 * @see imp-35419-etrunc-barrier-lemma-porting-scope (the S_barrier statement / P2 option-a)
 * @see imp-34791-etrunc-eflow-pt-anchor-honest-discharge (E_trunc = unported barrier lemma)
 * @see project winding-thread (Gaussian conv proxy = de Bruijn flow at NEGATIVE time t = -4 tau_repo)
 * @see Polymath15 2019 (effective approximation of H_t; mollified triangle bound); Platt-Trudgian 2021
 */

// -- Anchor + operative constants (import-light; matching imp-35653) -----------
const T_PT = 3e12; // Platt-Trudgian 2021 verified height
const TWO_PI = 2 * Math.PI;
// Retained-term count of the Polymath15 effective sums: N(x) = floor(sqrt(x / 4 pi)).
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI)));
const N_AT_TPT = N_TERMS(T_PT); // ~488602 terms at T_PT
const X0_POLYMATH15_ILLUSTRATIVE = 6e10; // order-of-magnitude Polymath15 barrier height (ILLUSTRATIVE)
const N_AT_X0 = N_TERMS(X0_POLYMATH15_ILLUSTRATIVE); // ~69097 terms
const TERM_RATIO = N_AT_TPT / N_AT_X0; // ~7.07x more terms after re-anchoring
const LOCAL_DENSITY_AT_TPT = Math.log(T_PT / TWO_PI) / TWO_PI; // ~4.279 zeros/unit (imp-35653)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this scoping

export const IMP35674_W3_TAIL_LEMMA_POLYMATH15_SCOPE = {
  id: 'imp-35674',
  proofSection: 'S-frontier',
  question:
    'Scope imp-35653 work-item W3: the analytic tail lemma |A + B| > |C| for all x >= T_PT + Delta ' +
    're-anchored at T_PT = 3e12. Which Polymath15 large-x zero-free estimate does it require, how do ' +
    'its constants change on re-anchoring, and how does it depend on the repo heat parameter t? ' +
    'Assessment/scoping only; ports nothing; changes no bound; NO QED.',
  lemmaStatement:
    '|A_t(x) + B_t(x)| > |C_t(x)| for ALL x >= T_PT + Delta, where A_t, B_t are the two effective ' +
    'main sums of the Polymath15 approximation of H_t and C_t is the total explicit error bound. When ' +
    'the margin holds, H_t = A_t + B_t - C_t cannot vanish, so no off-line zero exists in the tail. ' +
    'Verified ONCE, valid for the whole unbounded tail -- NOT a mesh check, NOT enumerable, NOT finite.',
  polymath15EstimateRequired: {
    name: 'Polymath15 mollified triangle-inequality lower bound on |A_t + B_t| plus the effective error bounds',
    lowerBoundOnMainSums:
      'A LOWER bound on |A_t + B_t| that keeps B_t / A_t bounded away from -1 (no near-total ' +
      'cancellation of the two main sums), typically via the dominant n = 1 term of A_t and a triangle ' +
      'bound on the remainder.',
    errorBounds:
      'UPPER bounds on C_t = E_A + E_B + E_{C_0} (the Polymath15 explicit approximation-error terms), ' +
      'each an elementary tail sum over the N ~ sqrt(x / 4 pi) retained terms.',
    theLemmaIs:
      'the statement that the margin (lower bound on |A+B|) - (upper bound on |C|) stays strictly ' +
      'positive UNIFORMLY in x -- the same object Polymath15 used to clear the region above their barrier.',
  },
  heatParameterDependence: {
    monotone:
      'The margin |A_t + B_t| - |C_t| is monotone in t: forward de Bruijn / heat flow (t increasing) ' +
      'contracts zeros toward the real axis and damps high-frequency error content, so the inequality ' +
      'gets EASIER as t grows and is HARDEST at t = 0 (the Riemann xi endpoint). Polymath15 uses a ' +
      'strictly POSITIVE t to earn this damping margin.',
    repoHeatSignCaveat:
      'The repo operative parameter is the Gaussian-convolution proxy, which the winding-thread result ' +
      'identifies as EXACT de Bruijn flow at NEGATIVE time (t = -4 tau_repo). Negative de Bruijn time ' +
      'sits on the HARDER side of the endpoint and does NOT enjoy the forward-flow damping. So the SIGN ' +
      'of the operative t relative to the Polymath15 barrier must be reconciled before porting; if the ' +
      'operative parameter really sits at negative de Bruijn time the tail-lemma margin is strictly ' +
      'TIGHTER than Polymath15s, not looser. Scoping caveat, not a computed obstruction.',
  },
  reAnchoringConstants: {
    retainedTermsAtTPT: N_AT_TPT, // ~488602
    retainedTermsAtPolymath15Illustrative: N_AT_X0, // ~69097
    termRatio: +TERM_RATIO.toFixed(4), // ~7.07x
    x0Polymath15Illustrative: X0_POLYMATH15_ILLUSTRATIVE, // 6e10, ILLUSTRATIVE order of magnitude
    localDensityAtTPT: +LOCAL_DENSITY_AT_TPT.toFixed(4), // ~4.2799 zeros/unit
    note:
      'N(x) = floor(sqrt(x / 4 pi)); re-anchoring 6e10 -> 3e12 raises N by ~sqrt(T_PT / x0) ~ 7x. Main ' +
      'sums and error sums both gain terms, but each error term decays with n so the per-height error ' +
      'bound does NOT grow proportionally; local density grows only logarithmically (~4.28/unit). ' +
      'Re-anchoring changes constants (term counts, error prefactors) but NOT the character of the ' +
      'obligation. The illustrative Polymath15 height is order-of-magnitude; the robust content is the ' +
      'sqrt-scaling and the uniformity requirement, not the exact anchor.',
  },
  whyNonFinite:
    'Every finite winding mesh covers a BOUNDED rectangle (imp-35653 Part A). W3 is the uniform-in-x ' +
    'inequality over the SEMI-INFINITE tail x >= T_PT + Delta; no finite mesh spans it. The engine can ' +
    'instantiate constants and spot-check the margin at sampled heights (necessary sanity, never ' +
    'sufficient). Uniform positivity of |A_t + B_t| - |C_t| for ALL x is the breakthrough-tier analytic ' +
    'obligation, gated additionally on the heat-sign reconciliation.',
  isRigorous: false,
  verdict:
    'ASSESSMENT / SCOPING (frontier-direction, NOT rigorous). (Part A) W3 is the semi-infinite tail ' +
    'lemma |A_t + B_t| > |C_t| for all x >= T_PT + Delta. (Part B) It requires the Polymath15 mollified ' +
    'triangle-inequality lower bound on |A_t + B_t| (B_t/A_t away from -1 via the dominant n=1 term) ' +
    'together with the explicit error bounds C_t = E_A + E_B + E_{C_0}; the lemma is the uniform ' +
    'positivity of that margin. (Part C) The margin is monotone in the heat parameter t -- easier for ' +
    'larger t, hardest at t=0 -- and the repo Gaussian-convolution proxy is de Bruijn flow at NEGATIVE ' +
    'time (t = -4 tau_repo), which sits on the HARDER side; the SIGN of the operative t relative to the ' +
    'Polymath15 barrier must be reconciled first. (Part D) Re-anchoring 6e10 -> 3e12 raises the retained ' +
    'term count N = floor(sqrt(x/4 pi)) by ~7x (~6.9e4 -> ~4.89e5) and the constants, but not the ' +
    'NON-finite character. (Part E) No finite mesh spans the semi-infinite quantifier; W3 stays the ' +
    'breakthrough-tier analytic obligation. Ports nothing; establishes no positivity; changes no bound; ' +
    'no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35653 (names W3 as the breakthrough-tier obligation); imp-35419 (the S_barrier statement / P2 ' +
    'option-a); imp-34791 (E_trunc = unported barrier lemma); winding-thread (Gaussian conv proxy = de ' +
    'Bruijn flow at negative time t = -4 tau_repo); Polymath15 2019 (effective approximation of H_t; ' +
    'mollified triangle bound); Platt-Trudgian 2021.',
};

export const IMP35674_W3_TAIL_LEMMA_POLYMATH15_SCOPE_ASSERTIONS = [
  {
    // Part D: retained-term count re-anchoring is faithful and grows ~7x from the illustrative barrier.
    id: 'imp35674-reanchor-term-count',
    description: 'N(x) = floor(sqrt(x/4 pi)); N(T_PT) ~ 4.89e5, ~7x the illustrative Polymath15 anchor',
    holds: () =>
      N_AT_TPT === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      N_AT_TPT > 4.8e5 && N_AT_TPT < 4.9e5 &&
      N_AT_TPT > N_AT_X0 &&
      TERM_RATIO > 6.9 && TERM_RATIO < 7.2,
  },
  {
    // Part B: the required estimate is the mollified triangle-inequality lower bound + error bounds.
    id: 'imp35674-polymath15-estimate-named',
    description: 'W3 requires the Polymath15 mollified triangle-inequality lower bound on |A+B| plus error bounds',
    holds: () =>
      /mollified triangle-inequality/.test(IMP35674_W3_TAIL_LEMMA_POLYMATH15_SCOPE.polymath15EstimateRequired.name) &&
      /away from -1/.test(IMP35674_W3_TAIL_LEMMA_POLYMATH15_SCOPE.polymath15EstimateRequired.lowerBoundOnMainSums) &&
      /E_A \+ E_B \+ E_\{C_0\}/.test(IMP35674_W3_TAIL_LEMMA_POLYMATH15_SCOPE.polymath15EstimateRequired.errorBounds),
  },
  {
    // Part C: heat-parameter dependence is monotone, and the negative-de-Bruijn-time repo caveat is flagged.
    id: 'imp35674-heat-parameter-sign-caveat',
    description: 'Margin monotone in t (easier for larger t); repo proxy = de Bruijn NEGATIVE time is the harder side',
    holds: () =>
      /HARDEST at t = 0/.test(IMP35674_W3_TAIL_LEMMA_POLYMATH15_SCOPE.heatParameterDependence.monotone) &&
      /NEGATIVE time \(t = -4 tau_repo\)/.test(IMP35674_W3_TAIL_LEMMA_POLYMATH15_SCOPE.heatParameterDependence.repoHeatSignCaveat) &&
      /HARDER side/.test(IMP35674_W3_TAIL_LEMMA_POLYMATH15_SCOPE.heatParameterDependence.repoHeatSignCaveat),
  },
  {
    // Part E + honesty gate: non-finite character, scoping only, no discharge, no QED, no refereed bound is changed.
    id: 'imp35674-honesty-gate-nonfinite-no-qed',
    description: 'W3 stays NON-finite; scoping only, discharges nothing, no QED, no refereed bound is changed',
    holds: () =>
      IMP35674_W3_TAIL_LEMMA_POLYMATH15_SCOPE.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /SEMI-INFINITE/.test(IMP35674_W3_TAIL_LEMMA_POLYMATH15_SCOPE.whyNonFinite) &&
      /NO QED/.test(IMP35674_W3_TAIL_LEMMA_POLYMATH15_SCOPE.verdict) &&
      /refereed bound is changed/i.test(IMP35674_W3_TAIL_LEMMA_POLYMATH15_SCOPE.verdict),
  },
];

for (const a of IMP35674_W3_TAIL_LEMMA_POLYMATH15_SCOPE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35674-w3-tail-lemma-polymath15-scope assertion failed: ${a.id}`);
  }
}
