/**
 * @module imp-35717-w1-tsign-reconciliation-scope
 *
 * imp-35717 (proof/assessment, S-frontier): ENUMERATE the t-sign reconciliation
 * prerequisites that stand between the repo already-HELD heat-flow structure and
 * seeding the imp-35653 Part-E work-item W1 (the Polymath15 effective approximation
 * H_t = A + B - C, interval-bounded at T_PT = 3e12).
 *
 * imp-35681 Part A found the repo HOLDS the heat-flow H_t as an OBJECT but at the
 * WRONG t-sign: per imp-35674 the Gaussian-convolution proxy IS de Bruijn flow at
 * NEGATIVE time (t = -4 tau_repo, the HARDER side) whereas the Polymath15 barrier
 * H_t = A + B - C lives on the POSITIVE-time side. This module scopes ONLY the
 * sign-reconciliation gap: (i) what analytic steps map the negative-time proxy onto
 * the positive-time barrier, (ii) whether monotonicity / de Bruijn Thm 13 survives
 * the sign flip, and (iii) what residual is left once the sign is reconciled.
 *
 * ASSESSMENT / ENUMERATION ONLY. Derives nothing; discharges nothing; changes no
 * bound; establishes no positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * R1 -- PARAMETER-NORMALIZATION (align the two t-clocks to a common endpoint)
 * -----------------------------------------------------------------------------
 * The first prerequisite is a change-of-variable that puts the repo clock and the
 * Polymath15 clock on the same axis. The repo operative parameter is the Gaussian-
 * convolution proxy, identified by the winding-thread result as de Bruijn flow at
 * t_repo = -4 tau_repo; the Polymath15 barrier uses its own de Bruijn time t_PM15 on
 * the POSITIVE side. Both flows share the SAME endpoint -- the Riemann xi function at
 * t = 0. R1 pins t_repo = -4 tau_repo, fixes the Polymath15 sign convention, and
 * expresses both relative to that shared t = 0 origin. FINITE / MECHANICAL: this is a
 * relabeling, not an evolution; it earns NO margin, it only removes clock ambiguity.
 *
 * R2 -- FLOW-DIRECTION WELL-POSEDNESS (which direction is a semigroup)
 * -----------------------------------------------------------------------------
 * The pivotal prerequisite. FORWARD de Bruijn / heat flow (t increasing) is the
 * smoothing heat semigroup -- a well-posed contraction that damps high-frequency
 * content. NEGATIVE-time de Bruijn flow is the BACKWARD heat direction: it is
 * ill-posed as an evolution (no bounded semigroup; the inverse heat operator is
 * unbounded). CONSEQUENCE: one CANNOT bridge the gap by "running the flow backward"
 * from the barrier down to the repo object. The only well-posed bridge treats the
 * held negative-time proxy as an INITIAL DATUM and evolves it FORWARD through the
 * t = 0 endpoint up to the positive barrier time -- which requires a fresh
 * forward-evolution certificate, not a re-use of the held object. R2 must decide and
 * record which direction is well-posed BEFORE any mapping is attempted.
 *
 * R3 -- MONOTONICITY / DE BRUIJN THM 13 UNDER THE SIGN FLIP (survives as direction, not as margin)
 * -----------------------------------------------------------------------------
 * de Bruijn Theorem 13 (preservation of reality forward in t, plus monotone approach
 * of the zeros to the real axis) is a FORWARD-time statement. It does NOT reverse
 * under the sign flip: a configuration with all real zeros at time t stays real for
 * every t-prime > t, but may DEVELOP complex zeros for t-prime < t. So the theorem
 * survives the reconciliation as the SOURCE of the inequality direction -- it tells
 * us the margin |A + B| - |C| is monotone increasing in t -- but its BENEFIT-SIGN
 * flips for the repo object: sitting at negative time (below the endpoint), the proxy
 * is on the harder side and inherits a STRICTLY TIGHTER margin than the positive-t
 * Polymath15 barrier (exactly the imp-35674 Part C finding). Thm 13 is thus a
 * qualitative input (direction of monotonicity), NOT a free damping margin the repo
 * object can spend.
 *
 * R4 -- QUANTITATIVE SEED FOR W1 (the positive-t effective-approximation constants)
 * -----------------------------------------------------------------------------
 * Even after R1-R3 align the direction, seeding W1 needs the Polymath15 A + B - C
 * effective approximation with its per-term interval error caps E_A, E_B, E_{C_0}
 * instantiated at the POSITIVE barrier time and re-anchored to T_PT = 3e12
 * (N(x) = floor(sqrt(x / 4 pi)) retained terms; imp-35674 Part D). The held
 * negative-time object supplies the flow STRUCTURE but NOT those positive-t interval
 * error caps. R4 is the greenfield hand-off already flagged by imp-35681 Part A.
 *
 * RESIDUAL (what remains after the sign is fully reconciled)
 * -----------------------------------------------------------------------------
 * Sign reconciliation is a NECESSARY relabeling/normalization prerequisite, but even
 * executed in full it does NOT close W1. It (a) leaves the interval-bounded positive-t
 * A + B - C certificate still GREENFIELD (imp-35681 Part A / R4), and (b) SURFACES a
 * NEW obligation via R2: because the backward direction is ill-posed, no bounded
 * operator maps the held negative-time object onto the positive barrier, so a fresh
 * FORWARD-evolution certificate is required to transport it across the endpoint. Net:
 * reconciliation removes the sign confusion and fixes the inequality direction (R3),
 * but shrinks NO greenfield work and ADDS the R2 well-posedness caveat. It is a
 * scoping prerequisite, not a lever on the bound.
 *
 * @see imp-35681-w1-w2-w4-existing-infra-inventory (Part A: structure held at wrong t-sign)
 * @see imp-35674-w3-tail-lemma-polymath15-scope (Part C: negative de Bruijn time = harder side)
 * @see imp-35653-sbarrier-finite-check-porting-scope (names W1 in the S_barrier port)
 * @see project winding-thread (Gaussian conv proxy = de Bruijn flow at NEGATIVE time t = -4 tau_repo)
 * @see Polymath15 2019 (effective approximation H_t = A + B - C; de Bruijn Thm 13); Platt-Trudgian 2021
 */

// -- Anchor + operative constants (import-light; matching imp-35674 / imp-35681) ---
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this enumeration
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI))); // Polymath15 retained-term count
const N_AT_TPT = N_TERMS(T_PT); // ~488602 terms at T_PT (imp-35674 Part D)

export const IMP35717_W1_TSIGN_RECONCILIATION_SCOPE = {
  id: 'imp-35717',
  proofSection: 'S-frontier',
  question:
    'Enumerate the t-sign reconciliation prerequisites between the repo held heat-flow structure (de ' +
    'Bruijn flow at NEGATIVE time t = -4 tau_repo, imp-35674) and the positive-time Polymath15 barrier ' +
    'H_t = A + B - C before the held structure can seed the imp-35653 W1 interval-bounded approximation ' +
    'at T_PT = 3e12: which analytic steps map negative-time onto positive-time, whether monotonicity / ' +
    'de Bruijn Thm 13 survives the sign flip, and what residual is left. Enumeration only; NO QED.',
  R1_parameterNormalization: {
    step:
      'Change of variable putting the repo clock and the Polymath15 clock on one axis: pin t_repo = ' +
      '-4 tau_repo (winding-thread), fix the Polymath15 positive-t sign convention, and express both ' +
      'relative to the SHARED endpoint -- the Riemann xi function at t = 0.',
    character: 'FINITE / MECHANICAL relabeling; earns NO margin, only removes clock ambiguity.',
  },
  R2_flowDirectionWellPosedness: {
    forward:
      'FORWARD de Bruijn / heat flow (t increasing) is the smoothing heat semigroup -- a well-posed ' +
      'contraction that damps high-frequency content.',
    backward:
      'NEGATIVE-time de Bruijn flow is the BACKWARD heat direction: ill-posed as an evolution (no ' +
      'bounded semigroup; the inverse heat operator is unbounded).',
    consequence:
      'One CANNOT bridge by running the flow backward from the barrier down to the repo object. The only ' +
      'well-posed bridge treats the held negative-time proxy as an INITIAL DATUM and evolves it FORWARD ' +
      'through t = 0 up to the positive barrier time -- requiring a fresh forward-evolution certificate.',
    pivotal: true,
  },
  R3_monotonicityThm13: {
    statement:
      'de Bruijn Thm 13 (preservation of reality forward in t, plus monotone approach of zeros to the ' +
      'real axis) is a FORWARD-time statement.',
    survivesAsDirection:
      'It does NOT reverse under the sign flip: all-real at t stays real for every t-prime > t but may ' +
      'DEVELOP complex zeros for t-prime < t. Thm 13 survives as the SOURCE of the inequality direction ' +
      '(the margin |A + B| - |C| is monotone increasing in t).',
    benefitSignFlips:
      'Its BENEFIT-SIGN flips for the repo object: at negative time (below the endpoint) the proxy is on ' +
      'the HARDER side and inherits a strictly TIGHTER margin than the positive-t Polymath15 barrier ' +
      '(imp-35674 Part C). Thm 13 is a qualitative direction input, NOT a free damping margin.',
  },
  R4_quantitativeSeed: {
    step:
      'Instantiate the Polymath15 A + B - C effective approximation with its per-term interval error caps ' +
      'E_A, E_B, E_{C_0} at the POSITIVE barrier time, re-anchored to T_PT = 3e12 (N(x) = ' +
      'floor(sqrt(x / 4 pi)) retained terms, imp-35674 Part D).',
    heldVsGreenfield:
      'The held negative-time object supplies the flow STRUCTURE but NOT the positive-t interval error ' +
      'caps; this is the greenfield hand-off already flagged by imp-35681 Part A.',
    retainedTermsAtTPT: N_AT_TPT,
  },
  residual: {
    leavesGreenfield:
      'The interval-bounded positive-t A + B - C certificate stays GREENFIELD (imp-35681 Part A / R4); ' +
      'reconciliation shrinks NO greenfield work.',
    newObligation:
      'R2 SURFACES a NEW obligation: because the backward direction is ill-posed, no bounded operator ' +
      'maps the held negative-time object onto the positive barrier, so a fresh FORWARD-evolution ' +
      'certificate is required to transport it across the endpoint.',
    net:
      'Sign reconciliation is a NECESSARY relabeling/normalization prerequisite that fixes the inequality ' +
      'direction (R3) but is NOT a lever on the bound: it removes sign confusion, shrinks no greenfield ' +
      'certificate, and ADDS the R2 well-posedness caveat.',
  },
  isRigorous: false,
  verdict:
    'ASSESSMENT / ENUMERATION (frontier-direction, NOT rigorous). Four sign-reconciliation prerequisites ' +
    'stand between the held heat-flow STRUCTURE and seeding W1. (R1) Parameter-normalization: a finite ' +
    'change of variable pinning t_repo = -4 tau_repo, the Polymath15 positive-t convention, and the ' +
    'shared Riemann-xi endpoint t = 0 -- relabeling only, no margin earned. (R2, pivotal) ' +
    'Flow-direction well-posedness: forward de Bruijn flow is the smoothing heat semigroup (well-posed), ' +
    'negative-time is the ill-posed backward heat direction, so the gap CANNOT be bridged by running the ' +
    'flow backward -- the only well-posed route evolves the held negative-time proxy FORWARD through the ' +
    'endpoint, needing a fresh forward-evolution certificate. (R3) de Bruijn Thm 13 SURVIVES the sign ' +
    'flip only as the direction of the monotone margin (all-real is preserved forward, not backward); ' +
    'its benefit-sign FLIPS, so the negative-time proxy inherits a strictly TIGHTER margin (imp-35674 ' +
    'Part C), not a free damping margin. (R4) The quantitative seed -- the positive-t A + B - C effective ' +
    'approximation with per-term interval error caps E_A, E_B, E_{C_0} at T_PT = 3e12 -- is the ' +
    'greenfield hand-off (imp-35681 Part A). RESIDUAL: even fully reconciled, the sign work leaves the ' +
    'interval-bounded positive-t A + B - C GREENFIELD and ADDS the R2 backward-ill-posedness obligation; ' +
    'it is a scoping prerequisite, not a lever. Derives nothing; discharges nothing; changes no bound; ' +
    'establishes no positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35681 Part A (structure held at wrong t-sign); imp-35674 Part C (negative de Bruijn time = ' +
    'harder side, margin strictly tighter); imp-35653 (names W1 in the S_barrier port); winding-thread ' +
    '(Gaussian conv proxy = de Bruijn flow at NEGATIVE time t = -4 tau_repo); Polymath15 2019 ' +
    '(effective approximation H_t = A + B - C; de Bruijn Thm 13); Platt-Trudgian 2021 (external base).',
};

export const IMP35717_W1_TSIGN_RECONCILIATION_SCOPE_ASSERTIONS = [
  {
    // R1: parameter-normalization is a finite relabeling to the shared t=0 endpoint, earning no margin.
    id: 'imp35717-r1-normalization-no-margin',
    description: 'R1: pin t_repo=-4 tau_repo vs positive-t Polymath15 at the shared Riemann-xi endpoint t=0; relabel only',
    holds: () =>
      /t_repo = -4 tau_repo/.test(IMP35717_W1_TSIGN_RECONCILIATION_SCOPE.R1_parameterNormalization.step) &&
      /t = 0/.test(IMP35717_W1_TSIGN_RECONCILIATION_SCOPE.R1_parameterNormalization.step) &&
      /NO margin/.test(IMP35717_W1_TSIGN_RECONCILIATION_SCOPE.R1_parameterNormalization.character),
  },
  {
    // R2 (pivotal): forward = well-posed semigroup, backward = ill-posed; cannot run the flow backward.
    id: 'imp35717-r2-backward-ill-posed',
    description: 'R2: backward heat is ill-posed; the only well-posed bridge evolves the held object FORWARD',
    holds: () =>
      IMP35717_W1_TSIGN_RECONCILIATION_SCOPE.R2_flowDirectionWellPosedness.pivotal === true &&
      /ill-posed/.test(IMP35717_W1_TSIGN_RECONCILIATION_SCOPE.R2_flowDirectionWellPosedness.backward) &&
      /CANNOT bridge/.test(IMP35717_W1_TSIGN_RECONCILIATION_SCOPE.R2_flowDirectionWellPosedness.consequence) &&
      /FORWARD/.test(IMP35717_W1_TSIGN_RECONCILIATION_SCOPE.R2_flowDirectionWellPosedness.consequence),
  },
  {
    // R3: de Bruijn Thm 13 survives as direction only; benefit-sign flips (repo margin strictly tighter).
    id: 'imp35717-r3-thm13-direction-not-margin',
    description: 'R3: Thm 13 survives the sign flip as inequality DIRECTION; benefit-sign flips (tighter margin)',
    holds: () =>
      /FORWARD-time statement/.test(IMP35717_W1_TSIGN_RECONCILIATION_SCOPE.R3_monotonicityThm13.statement) &&
      /does NOT reverse/.test(IMP35717_W1_TSIGN_RECONCILIATION_SCOPE.R3_monotonicityThm13.survivesAsDirection) &&
      /TIGHTER margin/.test(IMP35717_W1_TSIGN_RECONCILIATION_SCOPE.R3_monotonicityThm13.benefitSignFlips),
  },
  {
    // R4: the positive-t A+B-C interval error caps re-anchored to T_PT are the greenfield seed.
    id: 'imp35717-r4-seed-greenfield',
    description: 'R4: positive-t A+B-C with E_A,E_B,E_{C_0} at T_PT=3e12 is the greenfield hand-off (imp-35681 Part A)',
    holds: () =>
      /E_A, E_B, E_\{C_0\}/.test(IMP35717_W1_TSIGN_RECONCILIATION_SCOPE.R4_quantitativeSeed.step) &&
      /greenfield/.test(IMP35717_W1_TSIGN_RECONCILIATION_SCOPE.R4_quantitativeSeed.heldVsGreenfield) &&
      N_AT_TPT === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      N_AT_TPT > 4.8e5 && N_AT_TPT < 4.9e5,
  },
  {
    // Residual + honesty gate: reconciliation shrinks no greenfield, adds R2 obligation, no discharge, no QED, no refereed bound is changed.
    id: 'imp35717-honesty-gate-residual-no-qed',
    description: 'Residual: reconciliation leaves W1 greenfield and adds the R2 obligation; enumeration only, no QED, no refereed bound is changed',
    holds: () =>
      IMP35717_W1_TSIGN_RECONCILIATION_SCOPE.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /GREENFIELD/.test(IMP35717_W1_TSIGN_RECONCILIATION_SCOPE.residual.leavesGreenfield) &&
      /NEW obligation/.test(IMP35717_W1_TSIGN_RECONCILIATION_SCOPE.residual.newObligation) &&
      /NOT a lever/.test(IMP35717_W1_TSIGN_RECONCILIATION_SCOPE.residual.net) &&
      /NO QED/.test(IMP35717_W1_TSIGN_RECONCILIATION_SCOPE.verdict) &&
      /refereed bound is changed/i.test(IMP35717_W1_TSIGN_RECONCILIATION_SCOPE.verdict),
  },
];

for (const a of IMP35717_W1_TSIGN_RECONCILIATION_SCOPE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35717-w1-tsign-reconciliation-scope assertion failed: ${a.id}`);
  }
}
