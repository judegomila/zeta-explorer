/**
 * @module imp-1347-cauchy-schwarz-slack-symbolic-regression
 * @fileoverview imp-1347 -- symbolic-regression identification of the consistent
 *   ~1.71x slack reported by imp-1267 (Riemann xi) and imp-1317 (Delta) between
 *   the analytical Hilbert-Schmidt bound sqrt(I_0 J_a) and the empirical op-norm.
 *
 *   THE SETUP (imp-1267 bound chain)
 *   --------------------------------
 *   The endpoint-Hankel Volterra operator V_{a,Phi} on L^2([0, inf)) satisfies
 *
 *       ||V_{a,Phi}||_op  <=  ||V_{a,Phi}||_HS  <=  sqrt(I_0 * J_a),
 *                              \____ HS_exact ___/   \___ HS_bound ___/
 *
 *   with I_0 = int_0^inf Phi(u)^2 du and J_a = int_0^inf Phi(u)^2 sinh^2(a u) du.
 *   imp-1267 and imp-1317 observe that the OUTER ratio sqrt(I_0 J_a)/op_norm is
 *   suspiciously stable (1.71x for Delta; 1.58x-2.57x for xi). The ticket asks:
 *   is this a closed form?
 *
 *   THE DECOMPOSITION (key observation)
 *   -----------------------------------
 *   The outer ratio is a PRODUCT of two structurally independent factors:
 *
 *       sqrt(I_0 J_a)/op  =  [ sqrt(I_0 J_a)/HS_exact ] * [ HS_exact/op ].
 *                              \___ Cauchy-Schwarz ___/    \__ HS-vs-op __/
 *                               \___    slack       ___/    \__  ratio  __/
 *
 *   Only the FIRST factor is a clean, grid-independent, a-independent constant:
 *   it is the slack of the single Cauchy-Schwarz step sinh(a(x-y)) <= sinh(ax)
 *   used to derive the imp-1267 bound. The second factor (HS norm vs operator
 *   norm of the Volterra operator) is contaminated by Galerkin discretization
 *   in imp-1267 (it drifts with the window U) and is NOT given a closed form
 *   here -- see GAP-1347-HS-TO-OP below.
 *
 *   THE CLOSED FORM (symbolic-regression result)
 *   --------------------------------------------
 *   With the Phi-moments M_k := int_0^inf Phi(u)^2 u^k du and the dimensionless
 *
 *       rho^2 := M_1^2 / (I_0 M_2),
 *
 *   the Cauchy-Schwarz slack has the EXACT small-a closed form
 *
 *       slack_CS  =  sqrt(I_0 J_a) / ||V_{a,Phi}||_HS  -->  1/sqrt(1 - rho^2).
 *
 *   DERIVATION (elementary, exact at leading order in a):
 *     small-a: sinh(a(x-y)) = a(x-y) + O(a^3), sinh(ax) = ax + O(a^3), so
 *       ||V||_HS^2 = a^2 int int_{0<=y<=x} Phi^2(x)Phi^2(y)(x-y)^2 dy dx + O(a^4)
 *                  = a^2 (I_0 M_2 - M_1^2) + O(a^4),
 *       I_0 J_a    = a^2 I_0 M_2 + O(a^4),
 *     hence  slack_CS^2 = I_0 M_2 / (I_0 M_2 - M_1^2) = 1/(1 - rho^2).
 *   (The cross-square identity int int_{full} Phi^2(x)Phi^2(y)(x-y)^2 =
 *    2(I_0 M_2 - M_1^2), halved by the y<=x triangle, is exact.)
 *
 *   STATISTICAL READING
 *   -------------------
 *   Let w(x) = Phi(x)^2 / I_0 be the normalized weight on R_+ and X the
 *   coordinate. Then E_w[X] = M_1/I_0, E_w[X^2] = M_2/I_0, and
 *
 *       slack_CS = sqrt(E_w[X^2]) / std_w(X) = 1/sqrt(1 - rho^2),
 *       rho = E_w[X]/sqrt(E_w[X^2])  (a cosine; the "how off-center is X" ratio).
 *
 *   NUMERICAL CONFIRMATION (Riemann xi, run 2026-06-04)
 *   ---------------------------------------------------
 *   Phi = de Bruijn-Newman kernel (N_PHI=10), midpoint grid [0,4], N=8000:
 *
 *       I_0 = 1.0472039e-2     M_1 = 4.4720277e-4     M_2 = 3.2879233e-5
 *       rho^2 = 0.58083934
 *       slack_CS  (closed form 1/sqrt(1-rho^2))    = 1.5445776376
 *       slack_emp (sqrt(I_0 J_a)/HS_exact at a=1e-3, SAME grid) = 1.5445776379
 *       relative error = 2.3e-10
 *
 *   The closed form reproduces the directly-computed slack to NINE significant
 *   figures. The a-sweep confirms a-independence to leading order (slack is
 *   1.5445776 at a in {0.001,0.005,0.025,0.1} and 1.5446663 at a=0.5, the
 *   O(a^2) drift). The earlier imp-1267 frozen ratio 1.546 was slightly higher
 *   only because imp-1267 used DIFFERENT quadrature grids for HS_exact and
 *   HS_bound; on a single shared grid the clean structural value is 1.54458.
 *
 *   WHAT THIS SHARPENS
 *   ------------------
 *   The imp-1267 small-a HS bound sqrt(I_0 J_a) = a sqrt(I_0 M_2) + O(a^2)
 *   overestimates the true HS norm by EXACTLY the factor 1/sqrt(1-rho^2). The
 *   sharpened small-a HS bound is therefore
 *
 *       ||V_{a,Phi}||_HS = a sqrt(I_0 M_2 - M_1^2) + O(a^2),
 *
 *   tighter than sqrt(I_0 J_a) by 1/sqrt(1-rho^2) = 1.5446x for Riemann xi.
 *   (This removes the Cauchy-Schwarz slack but NOT the residual HS-vs-op gap.)
 *
 *   HONEST SCOPE / NAMED SUB-GAP
 *   ----------------------------
 *   1. CLOSED FORM IS FOR THE CAUCHY-SCHWARZ SLACK ONLY, not the full
 *      sqrt(I_0 J_a)/op_norm "1.71x". The remaining factor HS_exact/||V||_op
 *      (HS norm vs operator norm of the Volterra operator) is NOT given a
 *      closed form here: GAP-1347-HS-TO-OP. For a Volterra operator this ratio
 *      is generically > 1 and would need a separate singular-value analysis.
 *   2. SMALL-a LEADING ORDER. The identity is the a -> 0 limit; finite a carries
 *      an O(a^2) correction (verified < 0.006 percent up to a=0.5).
 *   3. NUMERICAL MOMENTS. I_0, M_1, M_2 are fine-grid quadratures (9-10 sig
 *      figs), not symbolic integrals of the de Bruijn-Newman Phi.
 *   4. xi-SPECIFIC EVALUATION. The closed FORM 1/sqrt(1-rho^2) is universal for
 *      any self-dual Phi; its VALUE 1.5446 is specific to the Riemann-xi Phi.
 *      The Delta value (imp-1317) would use rho^2 of Phi_Delta (not computed
 *      here). So "1.71x is one closed number across all L-functions" is FALSE:
 *      the closed FORM is shared, the rho^2 (hence the value) is form-specific.
 *   5. NOT A PROOF of Conj 27.2; this sharpens a bound, it does not close it.
 *
 *   RAW DATA SOURCE
 *   ---------------
 *   scripts/compute-imp1347-cs-slack-symbolic-regression.mjs, run 2026-06-04.
 *
 *   Ticket: imp-1347 (numerical, medium, opus-4-8 / api-pool).
 */

import { IMP1267_VOLTERRA_HS_BOUND } from './imp-1267-volterra-hs-bound.js';

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// ── Frozen Phi-moments (Riemann xi; de Bruijn-Newman, N_PHI=10, [0,4], N=8000) ──
const PHI_MOMENTS = Object.freeze({
  grid: Object.freeze({ U: 4, N: 8000, h: 5e-4, quadrature: 'midpoint' }),
  I0: 0.010472039381481349,   // int_0^inf Phi^2 du
  M1: 0.0004472027716458372,  // int_0^inf Phi^2 u du
  M2: 0.00003287923332861788, // int_0^inf Phi^2 u^2 du
  EX: 0.04270445854478605,    // E_w[X] = M1/I0
  EX2: 0.0031397163561818907, // E_w[X^2] = M2/I0
  VarX: 0.0013160455765785404,// Var_w(X) = EX2 - EX^2
  M_k_definition: 'M_k = int_0^inf Phi(u)^2 u^k du',
});

// ── The symbolic-regression result: closed form for the Cauchy-Schwarz slack ──
const SLACK_CLOSED_FORM = Object.freeze({
  label: 'slack_CS',
  quantity: 'sqrt(I_0 J_a) / ||V_{a,Phi}||_HS  (Cauchy-Schwarz slack of the imp-1267 bound)',
  rho2_definition: 'rho^2 = M_1^2 / (I_0 M_2)',
  closed_form: 'slack_CS -> 1/sqrt(1 - rho^2)  as a -> 0',
  statistical_form: 'slack_CS = sqrt(E_w[X^2]) / std_w(X),  w = Phi^2/I_0,  rho = E_w[X]/sqrt(E_w[X^2])',
  derivation:
    'small-a: ||V||_HS^2 = a^2 (I_0 M_2 - M_1^2) + O(a^4); I_0 J_a = a^2 I_0 M_2 + O(a^4); ' +
    'ratio^2 = I_0 M_2 / (I_0 M_2 - M_1^2) = 1/(1 - rho^2).',
  rho2_value: 0.5808393411120291,
  slack_closed_form_value: 1.544577637555718,
  slack_empirical_smallA: 1.5445776379101053, // sqrt(I_0 J_a)/HS_exact at a=1e-3, same grid
  aSmall: 0.001,
  relative_error: 2.2943954228337987e-10,
});

// ── a-sweep of the directly-computed slack (verifies a-independence) ──────────
const SLACK_BY_A = Object.freeze([
  Object.freeze({ a: 0.5, slack: 1.5446662603766868 }),
  Object.freeze({ a: 0.1, slack: 1.5445811814580797 }),
  Object.freeze({ a: 0.025, slack: 1.5445778590471475 }),
  Object.freeze({ a: 0.005, slack: 1.5445776464153709 }),
  Object.freeze({ a: 0.001, slack: 1.5445776379101053 }),
]);

// ── The sharpened small-a HS bound ───────────────────────────────────────────
const SHARPENED_HS_BOUND = Object.freeze({
  imp1267_bound: 'sqrt(I_0 J_a) = a sqrt(I_0 M_2) + O(a^2)',
  sharpened_bound: '||V||_HS = a sqrt(I_0 M_2 - M_1^2) + O(a^2)',
  sharpening_factor: '1/sqrt(1 - rho^2) = 1.5446x (Riemann xi)',
  note:
    'The sharpened bound removes the Cauchy-Schwarz slack of the sinh(a(x-y)) ' +
    '<= sinh(ax) step. It does NOT remove the residual HS-vs-op factor.',
});

// ── Decomposition of the reported outer ratio + named sub-gap ─────────────────
const OUTER_RATIO_DECOMPOSITION = Object.freeze({
  identity: 'sqrt(I_0 J_a)/op_norm = [sqrt(I_0 J_a)/HS_exact] * [HS_exact/op_norm]',
  factor_1_cauchy_schwarz_slack: 'closed form 1/sqrt(1 - rho^2) = 1.5446x for xi (THIS ticket)',
  factor_2_hs_to_op: 'HS_exact/||V||_op -- Volterra HS-vs-operator-norm ratio (NOT closed-form here)',
  imp1317_delta_outer_margin: 1.7115922195019126, // safety_margin at a=0.01 (Delta)
  imp1267_xi_outer_ratio_range: '1.577x (U=1) to 2.569x (U=20) -- Galerkin-window contaminated',
  why_xi_outer_ratio_drifts:
    'The imp-1267 op_norm is a Galerkin lower bound on a fixed-N window; as U grows ' +
    'the spacing coarsens and op_norm underestimates more, inflating the outer ratio. ' +
    'The Cauchy-Schwarz slack (this ticket) is the grid-independent structural part.',
  namedSubGap: 'GAP-1347-HS-TO-OP',
  subGapStatement:
    'No closed form is given for HS_exact/||V||_op (the Volterra HS-vs-operator-norm ' +
    'ratio). Closing it would require a singular-value / Mellin-symbol analysis of ' +
    'V_{a,Phi} rather than the moment identity used here.',
});

export const IMP1347_CAUCHY_SCHWARZ_SLACK = Object.freeze({
  id: 'imp-1347-cauchy-schwarz-slack-symbolic-regression',
  ticket: 'imp-1347',
  generatedAt: '2026-06-04T00:22:47Z',
  paperSourcePath: PAPER_REF,
  paperSections: ['S25', 'S26', 'S27'],
  relatedTickets: ['imp-1267', 'imp-1317', 'imp-1240', 'imp-1248', 'imp-1262'],

  summary:
    'Symbolic regression on the imp-1267/imp-1317 ~1.71x slack between the HS bound ' +
    'sqrt(I_0 J_a) and the op-norm. The outer ratio factors as (Cauchy-Schwarz slack) ' +
    'x (HS-vs-op ratio); the FIRST factor has the EXACT small-a closed form ' +
    '1/sqrt(1 - rho^2) with rho^2 = M_1^2/(I_0 M_2), M_k = int Phi^2 u^k du. For ' +
    'Riemann xi rho^2 = 0.5808 so slack_CS = 1.54458 -- matching the directly-computed ' +
    'slack to 9 sig figs (rel err 2.3e-10). Sharpens the small-a HS bound to ' +
    'a sqrt(I_0 M_2 - M_1^2) (tighter by 1.5446x). HONEST PARTIAL: only the ' +
    'Cauchy-Schwarz factor is closed-form; the residual HS-vs-op ratio is the named ' +
    'sub-gap GAP-1347-HS-TO-OP. The closed FORM is universal; the VALUE is xi-specific.',

  phiMoments: PHI_MOMENTS,
  slackClosedForm: SLACK_CLOSED_FORM,
  slackByA: SLACK_BY_A,
  sharpenedHsBound: SHARPENED_HS_BOUND,
  outerRatioDecomposition: OUTER_RATIO_DECOMPOSITION,

  method: Object.freeze({
    phiKernel:
      'de Bruijn-Newman: sum_{n=1..N_PHI=10} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    quadrature: 'midpoint rule on [0, 4], N=8000 (h = 5e-4)',
    HS_exact_evaluation:
      'sqrt(double-integral of |Phi(x)Phi(y)sinh(a(x-y))|^2 on y<=x) by O(N^2) midpoint quadrature',
    regression_target: 'slack_CS = sqrt(I_0 J_a)/HS_exact, fit against Phi-moments M_0,M_1,M_2',
    regression_outcome:
      'identified 1/sqrt(1 - M_1^2/(I_0 M_2)); cross-checked by exact small-a derivation',
    computeScript: 'scripts/compute-imp1347-cs-slack-symbolic-regression.mjs',
  }),

  honestScope: Object.freeze({
    isProof: false,
    isClosedFormForFullSlack: false, // only the Cauchy-Schwarz factor is closed-form
    isClosedFormForCauchySchwarzSlack: true,
    smallALeadingOrder: true,
    momentsAreNumerical: true,
    closedFormUniversal_valueFormSpecific: true,
    namedSubGap: 'GAP-1347-HS-TO-OP',
    notACompletedProofOfConj272: true,
    flags: Object.freeze([
      'Closed form is for the Cauchy-Schwarz slack sqrt(I_0 J_a)/||V||_HS ONLY.',
      'The residual factor HS_exact/||V||_op is the named sub-gap GAP-1347-HS-TO-OP.',
      'Identity is the a -> 0 leading order; finite-a has an O(a^2) correction.',
      'I_0, M_1, M_2 are numerical quadratures, not symbolic integrals.',
      'The closed FORM 1/sqrt(1-rho^2) is universal; the VALUE 1.5446 is xi-specific.',
      'Sharpens the small-a HS bound; does NOT close Conjecture 27.2.',
    ]),
  }),

  references: Object.freeze({
    paper: PAPER_REF,
    imp1267HsBound: 'src/data/imp-1267-volterra-hs-bound.js',
    imp1317Gl2: 'src/data/imp-1317-gl2-maass-hs-concrete.js',
    computeScript: 'scripts/compute-imp1347-cs-slack-symbolic-regression.mjs',
    cauchySchwarz: 'Reed-Simon I, Theorem on equality in Cauchy-Schwarz (rho=1 iff X is w-a.e. constant)',
  }),

  // Cross-link to the parent ticket so the audit trail is checkable.
  sourceParents: Object.freeze({
    imp_1267_I0_value: IMP1267_VOLTERRA_HS_BOUND.bound.I_0_value,
    imp_1267_verdict: IMP1267_VOLTERRA_HS_BOUND.summary_stats.verdict,
  }),
});

export default IMP1347_CAUCHY_SCHWARZ_SLACK;

// ── Tripwire assertions (8 required) ─────────────────────────────────────────
export const IMP1347_CAUCHY_SCHWARZ_SLACK_ASSERTIONS = [
  // (T1) The closed form reproduces the directly-computed slack to high precision.
  {
    id: 'imp1347-closed-form-matches-empirical',
    why:
      'PRIMARY RESULT: the closed form 1/sqrt(1 - rho^2) must match the directly ' +
      'computed small-a slack sqrt(I_0 J_a)/HS_exact to better than 1e-6 relative. ' +
      'The frozen run achieves 2.3e-10. A drift means the closed form or the ' +
      'moments were corrupted.',
    holds: () => {
      const s = IMP1347_CAUCHY_SCHWARZ_SLACK.slackClosedForm;
      return (
        Math.abs(s.slack_closed_form_value - s.slack_empirical_smallA) /
          s.slack_empirical_smallA < 1e-6 &&
        s.relative_error < 1e-6
      );
    },
  },

  // (T2) rho^2 equals M_1^2/(I_0 M_2) and lies strictly in (0, 1).
  {
    id: 'imp1347-rho2-formula-and-unit-interval',
    why:
      'rho^2 = M_1^2/(I_0 M_2) must be recomputable from the frozen moments and ' +
      'must lie in (0, 1) (Cauchy-Schwarz: M_1^2 <= I_0 M_2, strict since Phi^2 ' +
      'is not a point mass). If rho^2 leaves (0,1) the slack 1/sqrt(1-rho^2) is ' +
      'undefined or < 1.',
    holds: () => {
      const m = IMP1347_CAUCHY_SCHWARZ_SLACK.phiMoments;
      const rho2 = (m.M1 * m.M1) / (m.I0 * m.M2);
      const recorded = IMP1347_CAUCHY_SCHWARZ_SLACK.slackClosedForm.rho2_value;
      return (
        rho2 > 0 && rho2 < 1 &&
        Math.abs(rho2 - recorded) / recorded < 1e-9
      );
    },
  },

  // (T3) Strict Cauchy-Schwarz: I_0 M_2 > M_1^2 and all moments positive.
  {
    id: 'imp1347-strict-cauchy-schwarz-positive-moments',
    why:
      'The denominator I_0 M_2 - M_1^2 of the sharpened bound must be strictly ' +
      'positive (equivalently rho^2 < 1). All three moments I_0, M_1, M_2 are ' +
      'integrals of a non-negative integrand against a non-trivial weight, hence ' +
      'strictly positive. A non-positive denominator would make the bound complex.',
    holds: () => {
      const m = IMP1347_CAUCHY_SCHWARZ_SLACK.phiMoments;
      return (
        m.I0 > 0 && m.M1 > 0 && m.M2 > 0 &&
        m.I0 * m.M2 - m.M1 * m.M1 > 0
      );
    },
  },

  // (T4) The closed-form and rho^2 formula strings are stated explicitly.
  {
    id: 'imp1347-closed-form-strings-explicit',
    why:
      'The data must state the closed form 1/sqrt(1 - rho^2) and the definition ' +
      'rho^2 = M_1^2/(I_0 M_2) as explicit strings so the symbolic-regression ' +
      'result is human-auditable, not just a number. A drift in either string ' +
      'means the result was restated inconsistently.',
    holds: () => {
      const s = IMP1347_CAUCHY_SCHWARZ_SLACK.slackClosedForm;
      return (
        s.closed_form.includes('1/sqrt(1 - rho^2)') &&
        s.rho2_definition.includes('M_1^2 / (I_0 M_2)') &&
        s.derivation.includes('I_0 M_2 - M_1^2')
      );
    },
  },

  // (T5) Statistical (variance) interpretation is self-consistent.
  {
    id: 'imp1347-variance-interpretation-identity',
    why:
      'The statistical reading slack = sqrt(E[X^2])/std(X) must agree with the ' +
      'moment form. Checks: VarX = EX2 - EX^2 and 1/sqrt(1-rho^2) = sqrt(EX2/VarX). ' +
      'A mismatch means the EX/EX2/VarX block drifted from M_1/M_2/I_0.',
    holds: () => {
      const m = IMP1347_CAUCHY_SCHWARZ_SLACK.phiMoments;
      const varCheck = Math.abs((m.EX2 - m.EX * m.EX) - m.VarX) < 1e-12;
      const slackFromVar = Math.sqrt(m.EX2 / m.VarX);
      const recorded = IMP1347_CAUCHY_SCHWARZ_SLACK.slackClosedForm.slack_closed_form_value;
      return varCheck && Math.abs(slackFromVar - recorded) / recorded < 1e-9;
    },
  },

  // (T6) I_0 cross-checks the imp-1267 frozen value (same Phi, different grid).
  {
    id: 'imp1347-I0-cross-check-imp1267',
    why:
      'I_0 = int Phi^2 du is the SAME object imp-1267 froze as 1.04720666e-2. The ' +
      'two computations use different grids (N=8000 here vs N=40000 there) so they ' +
      'must agree to ~1e-3 relative. A larger gap means the Phi kernel diverged ' +
      'from the imp-1267 construction.',
    holds: () => {
      const I0 = IMP1347_CAUCHY_SCHWARZ_SLACK.phiMoments.I0;
      const imp1267 = IMP1347_CAUCHY_SCHWARZ_SLACK.sourceParents.imp_1267_I0_value;
      return (
        typeof imp1267 === 'number' &&
        Math.abs(I0 - imp1267) / I0 < 1e-3
      );
    },
  },

  // (T7) The outer ratio is honestly decomposed and the HS-vs-op gap is named.
  {
    id: 'imp1347-decomposition-names-open-sub-gap',
    why:
      'The headline "1.71x" is NOT fully closed-form. The data must record that ' +
      'the outer ratio factors into the Cauchy-Schwarz slack (closed) times the ' +
      'HS-vs-op ratio (open, GAP-1347-HS-TO-OP). If the decomposition or the ' +
      'sub-gap name is missing, the file over-claims.',
    holds: () => {
      const d = IMP1347_CAUCHY_SCHWARZ_SLACK.outerRatioDecomposition;
      const h = IMP1347_CAUCHY_SCHWARZ_SLACK.honestScope;
      return (
        d.identity.includes('HS_exact') &&
        d.namedSubGap === 'GAP-1347-HS-TO-OP' &&
        h.isClosedFormForFullSlack === false &&
        h.isClosedFormForCauchySchwarzSlack === true &&
        h.namedSubGap === 'GAP-1347-HS-TO-OP'
      );
    },
  },

  // (T8) Honest scope: not a proof, small-a leading order, value is xi-specific.
  {
    id: 'imp1347-honest-scope-flags',
    why:
      'The result sharpens a bound; it does not prove Conj 27.2. It is the a -> 0 ' +
      'leading order, the moments are numerical, and the VALUE 1.5446 is xi-specific ' +
      '(the FORM is universal). All these flags must be present or the scope is ' +
      'overstated.',
    holds: () => {
      const h = IMP1347_CAUCHY_SCHWARZ_SLACK.honestScope;
      const blob = h.flags.join(' | ').toLowerCase();
      return (
        h.isProof === false &&
        h.notACompletedProofOfConj272 === true &&
        h.smallALeadingOrder === true &&
        h.momentsAreNumerical === true &&
        h.closedFormUniversal_valueFormSpecific === true &&
        h.flags.length >= 6 &&
        blob.includes('cauchy-schwarz') &&
        blob.includes('xi-specific')
      );
    },
  },
];
