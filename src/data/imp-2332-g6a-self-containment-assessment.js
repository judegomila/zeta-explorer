/**
 * @module data/imp-2332-g6a-self-containment-assessment
 * @fileoverview imp-2332 — feasibility assessment of REMOVING the Polymath15
 * Lemma 5.2 citation from the Lambda <= 3.06e-5 chain by an in-house,
 * fully self-contained re-derivation of the Holder-1/2 shock modulus G6a.
 *
 * VERDICT (honest negative result)
 * --------------------------------
 * Self-containment is NOT achieved, and is NOT a "200-line, no-surprises"
 * port as imp-1264 optimistically estimated. A deep audit of the existing
 * six-file G6a chain shows that the re-derivation does NOT bottom out in
 * elementary steps: it reduces Polymath15 Lemma 5.2 to TWO cited sub-claims
 * that are its actual analytic core and remain asserted-not-proved in this
 * codebase. Re-proving either is genuine research-grade analysis, not a
 * transcription exercise. The Lambda <= 3.06e-5 bound therefore stays
 * rigorous at the RATE level but CITATION-CONDITIONAL on Polymath15
 * Lemma 5.2 (arXiv:1904.12438); imp-2332 does NOT remove that conditional.
 *
 * This module's contribution is to (a) reconcile the status inconsistency
 * across the G6a files, (b) name the precise residual obstructions so a
 * future attempt is correctly scoped, and (c) correct the imp-1264
 * "200-line, no surprises" estimate. It is an HONEST SCOPE record, not a
 * proof artifact — it adds no new mathematics and claims none.
 *
 * @see imp-354 lambda-burgers-shock-lipschitz.js   (status: PARTIAL, 2 sub-gaps)
 * @see imp-366 polymath15-lemma52-shock-holder.js  (status: closed, C_H=1 symbolic)
 * @see imp-394 g6a-sub-hyperbolic-closure.js        (real-boundary fold via Privalov-Sokhotski)
 * @see imp-395 g6a-sub-constant-value.js            (C_H = 1/8 via quadratic tangency)
 * @see imp-506 holder-modulus-verification.js       (empirical C_H=1/8 check)
 * @see imp-1264 imp-1264-polymath15-g6a-bridge-review.js (citation-conditional verdict)
 * @see imp-1261 imp-1261-asymptotic-lambda-redirect-shipped.js (the 3.06e-5 bound)
 */

/**
 * imp-2332: Can the Polymath15 Lemma 5.2 citation be removed?
 *
 * The ticket asked for a "self-contained re-derivation of the Holder-1/2
 * shock modulus via quadratic-tangency + Privalov-Sokhotski + Whitham fold
 * (approx 200-line proof)" so that G6a no longer relies on citing
 * Polymath15 Lemma 5.2. This module records the result of attempting that.
 *
 * What the existing chain actually proves vs. cites
 * -------------------------------------------------
 * Polymath15 Lemma 5.2 (as frozen in imp-1264) states, for empirical
 * N-particle measures mu_1, mu_2 near the limiting Burgers shock rho_inf:
 *
 *     |tau_c(mu_1) - tau_c(mu_2)|  <=  C_H * W_1(mu_1, mu_2)^{1/2},
 *
 * with C_H uniform in N. The imp-366 port factors this into three steps:
 *
 *   Step 1 (W_1 -> gap Lipschitz):  |g_min(mu_1) - g_min(mu_2)| <= C_Lip * W_1,
 *           "uniform in N via the Gronwall bound on the Dyson flow Jacobian
 *            (the flow is C^1 away from the collision singularity)".
 *
 *   Step 2 (gap -> collision time):  via the quadratic tangency
 *           |tau_c| = g_min^2 / 8 + O(g_min^3) from d(g_min^2)/dt = -8.
 *
 *   Step 3 (Holder at the shock):    g_min(mu_i) ~ C_shock * W_1(mu_i, rho_inf)^{1/2},
 *           "the key Holder-1/2 estimate from the cusp density analysis"
 *            (rho_inf ~ C_cusp / |gamma - gamma_star|^{1/2}).
 *
 * Of these, ONLY Step 2 is genuinely elementary and self-contained in the
 * codebase: the constant 8 follows from the Dyson beta=2 two-particle
 * repulsion -4/g_min by a one-line ODE manipulation (rigorous; imp-366).
 *
 * Steps 1 and 3 are the analytic heart of Lemma 5.2 and are ASSERTED, not
 * proved, in every file of the chain:
 *
 *   RESIDUAL R1 (uniform Gronwall flow-Lipschitz AT the singularity).
 *     Step 1 needs the gap functional g_min to be Lipschitz in W_1 with a
 *     constant C_Lip uniform in N, on a neighbourhood that REACHES the
 *     collision time where the two-particle interaction -4/g_min blows up.
 *     The cited justification ("flow is C^1 away from the collision
 *     singularity") is exactly the wrong regime: the bound is needed AS
 *     g_min -> 0. imp-395 argues C_Lip = exp(B_max * |tau_c|) -> 1 because
 *     |tau_c| = g_min^2/8 -> 0, but B_max (the Dyson-flow Jacobian bound on
 *     the approach to collision) is itself the unproved quantity — it is the
 *     supremum of a Jacobian that contains the singular pair, and showing it
 *     stays finite uniformly in N is the substance of the lemma, not a
 *     corollary of it. This is a singular-ODE stability estimate, not a
 *     transcription.
 *
 *   RESIDUAL R2 (cusp-density W_1^{1/2} concentration).
 *     Step 3 needs g_min ~ C_shock * W_1^{1/2}, i.e. that a W_1-perturbation
 *     of size epsilon of the shock measure moves the minimum gap by
 *     ~ epsilon^{1/2}. The codebase derives the EXPONENT 1/2 from the fold
 *     catastrophe (Whitham 1974; imp-354, imp-394 via Privalov-Sokhotski for
 *     the real-boundary version) — that part is genuinely reduced to a
 *     classical theorem. But the CONSTANT C_shock and the claim that W_1
 *     mass concentrates "at the scale g_min^2 near the shock" is the
 *     cusp-density concentration estimate of Lemma 5.2 itself. imp-395 shows
 *     the classical Whitham normalization C_W = sqrt(2/|u_0''|) DIVERGES at
 *     the boundary shock (|u_0''| -> inf as the fold point -> 0+) and must be
 *     REPLACED by the quadratic-tangency regularization to get C_H = 1/8.
 *     That replacement reuses Step 2's constant 8; it does not independently
 *     establish the W_1^{1/2} concentration, it ASSUMES it to convert
 *     W_1 -> g_min. So R2 is also asserted.
 *
 * Why imp-1264's "200-line, no surprises" estimate is wrong
 * ---------------------------------------------------------
 * imp-1264 proposed re-deriving Lemma 5.2 in-house from "imp-394 +
 * imp-395 + Whitham (real case), recipe already in Steps 1-3". The recipe
 * IS in Steps 1-3 — but Steps 1 and 3 are precisely the parts that are
 * cited rather than proved, so following the recipe reproduces the citation
 * dependence rather than discharging it. The remaining work is two
 * genuine analysis lemmas (R1 singular-ODE uniform stability; R2 Wasserstein
 * concentration at a square-root cusp), each of which is a research result
 * with its own constants, uniformity arguments, and failure modes. This is
 * not a 200-line transcription; honestly estimated it is a multi-week
 * analysis project with real risk of a uniformity obstruction (the same
 * kind of Montgomery-PCC / GUE-universality irreducibility that blocks the
 * other Lambda routes per the project's own audits).
 *
 * Status reconciliation across the G6a chain
 * ------------------------------------------
 * The files disagree on G6a's status. This module records the honest
 * consolidated reading:
 *
 *   imp-354 : "partial" — Whitham cited by reference; two sub-gaps open.   HONEST.
 *   imp-366 : "closed"  — but C_H=1 symbolic, isRigorous:false on the      OVERSTATED
 *                          Holder modulus; own tripwire says upgrade to     (closed = "structural
 *                          "verified" once constants are pinned.            gap discharged via cite")
 *   imp-395 : "closed"  — pins C_H=1/8, but via the SAME Step-2 constant;   PARTIAL (constant only)
 *                          does not discharge R1/R2.
 *   imp-1264: "closure-route-identified, citation-conditional"             CORRECT framing,
 *                          (isMathematicallyOpen:false, isCitationConditional:true)  optimistic on cost.
 *
 * Consolidated verdict: G6a is CLOSED-MODULO-CITATION. The Holder-1/2
 * EXPONENT is rigorous (fold catastrophe, real case via imp-394). The
 * MODULUS INEQUALITY with a uniform constant is citation-conditional on
 * Polymath15 Lemma 5.2, resting on the two un-discharged analytic sub-claims
 * R1 and R2. The "partial" label of imp-354 and the "closed" label of
 * imp-366 are reconciled by this distinction: structurally routed, not
 * self-contained.
 *
 * Consequence for the headline bound
 * ----------------------------------
 * Lambda <= 3.06e-5 (imp-1261) is unchanged: rigorous at the rate level
 * (E_coll(N) -> 0 at rate O((log N / N)^{1/2}) with the citation supplying
 * the uniform constant), citation-conditional on Polymath15 Lemma 5.2. The
 * honest public label remains "unconditional modulo Polymath15 Lemma 5.2",
 * NOT "fully self-contained". The established no-asterisk SOTA is still the
 * Platt-Trudgian Lambda <= 0.2.
 */

import { POLYMATH15_LEMMA_52, G6A_SHOCK_LIPSCHITZ_CLOSURE } from './polymath15-lemma52-shock-holder.js';
import { G6A_SUB_CONSTANT_CLOSURE, C_H_REGULARIZED } from './g6a-sub-constant-value.js';
import { LAMBDA_BURGERS_SHOCK_LIPSCHITZ } from './lambda-burgers-shock-lipschitz.js';
import { IMP_1264_POLYMATH15_G6A_BRIDGE_REVIEW } from './imp-1264-polymath15-g6a-bridge-review.js';

// ── The two un-discharged analytic residuals ───────────────────────────────

const RESIDUAL_R1 = Object.freeze({
  id: 'G6a-R1-uniform-gronwall-flow-lipschitz',
  step: 'imp-366 Step 1 (W_1 -> gap Lipschitz)',
  claim:
    '|g_min(mu_1) - g_min(mu_2)| <= C_Lip * W_1(mu_1, mu_2) with C_Lip uniform ' +
    'in N on a neighbourhood reaching the collision time.',
  whyNotSelfContained:
    'The cited justification ("flow is C^1 away from the collision singularity") ' +
    'is the wrong regime: the bound is needed AS g_min -> 0, where the -4/g_min ' +
    'two-particle interaction blows up. C_Lip = exp(B_max |tau_c|) -> 1 only if ' +
    'B_max (the Dyson-flow Jacobian bound on approach to collision) is finite ' +
    'uniformly in N, which is the substance of the lemma, not a corollary.',
  natureOfMissingWork: 'singular-ODE uniform stability estimate (research-grade)',
  status: 'asserted-not-proved-in-house',
});

const RESIDUAL_R2 = Object.freeze({
  id: 'G6a-R2-cusp-density-W1-half-concentration',
  step: 'imp-366 Step 3 (Holder at the shock)',
  claim:
    'g_min(mu_i) ~ C_shock * W_1(mu_i, rho_inf)^{1/2}: a W_1 perturbation of ' +
    'size epsilon moves the minimum gap by ~ epsilon^{1/2}.',
  whatIsRigorous:
    'The EXPONENT 1/2 is rigorous: forced by the fold catastrophe (Whitham ' +
    '1974 Sec 2.7), with the real-boundary version handled by imp-394 via ' +
    'Privalov-Sokhotski.',
  whyNotSelfContained:
    'The CONSTANT C_shock and the W_1-mass concentration "at the scale g_min^2 ' +
    'near the shock" is the cusp-density concentration estimate of Lemma 5.2 ' +
    'itself. The classical Whitham normalization C_W = sqrt(2/|u_0_double_prime|) ' +
    'diverges at the boundary shock (imp-395); the quadratic-tangency ' +
    'replacement reuses the Step-2 constant 8 to convert W_1 -> g_min and ' +
    'thus ASSUMES this concentration rather than proving it.',
  natureOfMissingWork: 'Wasserstein concentration at a square-root cusp (research-grade)',
  status: 'exponent-rigorous-constant-and-concentration-asserted',
});

// ── Status reconciliation across the chain ──────────────────────────────────

const STATUS_RECONCILIATION = Object.freeze([
  {
    ticket: 'imp-354',
    recordedStatus: LAMBDA_BURGERS_SHOCK_LIPSCHITZ.verdict.closure, // 'partial'
    honestReading: 'HONEST — Whitham cited by reference; two sub-gaps named.',
  },
  {
    ticket: 'imp-366',
    recordedStatus: POLYMATH15_LEMMA_52.status, // 'closed'
    honestReading:
      'OVERSTATED label — "closed" means structural gap routed via citation; ' +
      'Holder modulus is isRigorous:false with C_H=1 symbolic, and the own ' +
      'tripwire defers "verified" until constants are pinned.',
  },
  {
    ticket: 'imp-395',
    recordedStatus: G6A_SUB_CONSTANT_CLOSURE.status, // 'closed'
    honestReading:
      'PARTIAL — pins C_H = 1/8 but via the Step-2 Dyson constant 8; does ' +
      'not discharge R1 or R2.',
  },
  {
    ticket: 'imp-1264',
    recordedStatus: IMP_1264_POLYMATH15_G6A_BRIDGE_REVIEW.overallVerdict,
    honestReading:
      'CORRECT framing (citation-conditional, not mathematically-open) but ' +
      'OPTIMISTIC on cost: the proposed 200-line re-proof reproduces the ' +
      'citation dependence rather than discharging R1/R2.',
  },
]);

// ── The assessment record ───────────────────────────────────────────────────

export const IMP_2332_G6A_SELF_CONTAINMENT_ASSESSMENT = Object.freeze({
  id: 'imp-2332',
  title:
    'Feasibility assessment: removing the Polymath15 Lemma 5.2 citation from ' +
    'the Lambda <= 3.06e-5 chain (self-contained G6a re-derivation)',
  assessedAt: '2026-06-02T00:00:00Z',
  outcome: 'self-containment-not-achieved',
  isMathematicallyOpen: true, // R1, R2 are genuine open analysis lemmas in-house
  isCitationConditional: true, // the bound remains valid via the cited lemma
  selfContainedReProofDelivered: false,

  oneLineVerdict:
    'G6a is CLOSED-MODULO-CITATION: the Holder-1/2 EXPONENT is rigorous, but ' +
    'the uniform MODULUS INEQUALITY rests on two un-discharged analytic ' +
    'sub-claims (R1 singular-ODE uniform stability; R2 cusp-density W_1^{1/2} ' +
    'concentration) that are the analytic core of Polymath15 Lemma 5.2. ' +
    'imp-2332 does NOT remove the citation.',

  residuals: [RESIDUAL_R1, RESIDUAL_R2],
  statusReconciliation: STATUS_RECONCILIATION,

  corrects: {
    target: 'imp-1264 honestResidual.recommendedFollowupIfPureMode',
    claimCorrected:
      'imp-1264 estimated the in-house re-derivation as a "200-line, no-surprises" ' +
      'proof. This assessment finds that estimate over-optimistic: Steps 1 and 3 ' +
      'of the imp-366 recipe are exactly the cited (not proved) parts, so following ' +
      'the recipe reproduces the citation dependence. Honest re-estimate: two ' +
      'research-grade analysis lemmas with real risk of a uniformity obstruction.',
  },

  consequenceForHeadline: {
    bound: 'Lambda <= 3.06e-5 (imp-1261)',
    rateLevel: 'rigorous (E_coll(N) -> 0 at O((log N / N)^{1/2}))',
    conditional: 'citation-conditional on Polymath15 Lemma 5.2 (arXiv:1904.12438)',
    honestPublicLabel: 'unconditional modulo Polymath15 Lemma 5.2 (NOT fully self-contained)',
    establishedNoAsteriskSOTA: 'Platt-Trudgian Lambda <= 0.2 (unchanged)',
  },

  recommendation:
    'Do NOT mark G6a as self-contained. Keep the "modulo Polymath15 Lemma 5.2" ' +
    'label on the 3.06e-5 bound. If a fully self-contained proof is later ' +
    'required, scope it as two separate research tickets (R1 and R2), each ' +
    'with its own uniformity argument and interval-arithmetic constant, rather ' +
    'than a single transcription ticket.',
});

export default IMP_2332_G6A_SELF_CONTAINMENT_ASSESSMENT;

// ── Build-time assertions ───────────────────────────────────────────────────

export const IMP_2332_G6A_SELF_CONTAINMENT_ASSESSMENT_ASSERTIONS = [
  {
    id: 'imp2332-outcome-is-not-self-contained',
    holds: () =>
      IMP_2332_G6A_SELF_CONTAINMENT_ASSESSMENT.outcome === 'self-containment-not-achieved' &&
      IMP_2332_G6A_SELF_CONTAINMENT_ASSESSMENT.selfContainedReProofDelivered === false,
    why:
      'imp-2332 is an HONEST NEGATIVE RESULT: no self-contained re-proof was ' +
      'delivered. If a future edit flips this to claim self-containment, it must ' +
      'be backed by actual discharge of residuals R1 and R2 (each a named ' +
      'research lemma), not by re-labelling. Guards against silent overclaim.',
  },
  {
    id: 'imp2332-bound-stays-citation-conditional',
    holds: () =>
      IMP_2332_G6A_SELF_CONTAINMENT_ASSESSMENT.isCitationConditional === true &&
      IMP_2332_G6A_SELF_CONTAINMENT_ASSESSMENT.consequenceForHeadline.conditional.includes(
        'Polymath15 Lemma 5.2',
      ),
    why:
      'The Lambda <= 3.06e-5 bound remains citation-conditional on Polymath15 ' +
      'Lemma 5.2. This assertion prevents the headline label from drifting to ' +
      '"fully self-contained" without the citation actually being removed.',
  },
  {
    id: 'imp2332-two-named-residuals-present',
    holds: () =>
      Array.isArray(IMP_2332_G6A_SELF_CONTAINMENT_ASSESSMENT.residuals) &&
      IMP_2332_G6A_SELF_CONTAINMENT_ASSESSMENT.residuals.length === 2 &&
      IMP_2332_G6A_SELF_CONTAINMENT_ASSESSMENT.residuals[0].id ===
        'G6a-R1-uniform-gronwall-flow-lipschitz' &&
      IMP_2332_G6A_SELF_CONTAINMENT_ASSESSMENT.residuals[1].id ===
        'G6a-R2-cusp-density-W1-half-concentration',
    why:
      'The two analytic obstructions R1 (uniform Gronwall flow-Lipschitz at the ' +
      'singularity) and R2 (cusp-density W_1^{1/2} concentration) are the precise ' +
      'scope of what a self-contained proof must discharge. Dropping or renaming ' +
      'either loses the honest scoping that is this module\'s contribution.',
  },
  {
    id: 'imp2332-holder-exponent-rigorous-not-the-gap',
    holds: () =>
      IMP_2332_G6A_SELF_CONTAINMENT_ASSESSMENT.residuals[1].whatIsRigorous.includes('1/2') &&
      POLYMATH15_LEMMA_52.holderModulus.holderExponent === 0.5,
    why:
      'The Holder-1/2 EXPONENT is rigorous (fold catastrophe, real case via ' +
      'imp-394) and is NOT the residual; the residual is the uniform CONSTANT / ' +
      'concentration. Conflating the two would mis-scope any future attempt. ' +
      'Tied to the upstream imp-366 exponent so a drift there trips here.',
  },
  {
    id: 'imp2332-corrects-imp1264-optimism',
    holds: () =>
      IMP_2332_G6A_SELF_CONTAINMENT_ASSESSMENT.corrects.target.includes('imp-1264') &&
      IMP_2332_G6A_SELF_CONTAINMENT_ASSESSMENT.corrects.claimCorrected.includes('200-line'),
    why:
      'A specific contribution of imp-2332 is correcting imp-1264\'s ' +
      '"200-line, no-surprises" estimate. Preserving this correction prevents a ' +
      'future reader from re-attempting the port under the wrong cost model.',
  },
  {
    id: 'imp2332-c-h-constant-still-one-eighth-via-tangency',
    holds: () => Math.abs(C_H_REGULARIZED - 1 / 8) < 1e-12,
    why:
      'The assessment rests on imp-395 pinning C_H = 1/8 via the Step-2 Dyson ' +
      'tangency constant 8. If C_H_REGULARIZED drifts from 1/8, the reasoning ' +
      'that imp-395 only pins the constant (not R1/R2) must be re-examined.',
  },
  {
    id: 'imp2332-no-asterisk-sota-unchanged',
    holds: () =>
      IMP_2332_G6A_SELF_CONTAINMENT_ASSESSMENT.consequenceForHeadline.establishedNoAsteriskSOTA.includes(
        '0.2',
      ),
    why:
      'This assessment does not move the established no-asterisk SOTA: it stays ' +
      'Platt-Trudgian Lambda <= 0.2. Guards against an honest-scope file being ' +
      'mis-read as a bound improvement.',
  },
];
