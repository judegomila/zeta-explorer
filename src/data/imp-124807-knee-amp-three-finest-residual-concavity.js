/**
 * @module imp-124807-knee-amp-three-finest-residual-concavity
 *
 * imp-124807 (numerical, frontier-direction): imp-124771 F3 drew a LINEAR (two-finest-bracket) Richardson
 * chord through the knee E_flow amplification ladder A(W) and got A ~ 9.33 at W -> 0, UNDERshooting the
 * imp-97804 closed-form A ~ 9.42 by ~1%, and attributed that undershoot to "mild concavity of A(W) near
 * the continuum". imp-124787 then showed an O(W^2) Richardson fit does NOT close the gap (it overcorrects,
 * subset-unstable, spread ~0.73). What imp-124787 did NOT do is put a NUMBER on the "residual concavity"
 * the linear chord was accused of missing. This leaf does exactly that: it reuses the imp-124771 A(W)
 * ladder VERBATIM, runs the second-order (concavity-aware) Richardson over the FINEST THREE brackets
 * (W = 0.15, 0.125, 0.10 -- the equal-spaced h = 0.025 stencil), extracts the fitted quadratic curvature
 * coefficient a2 and the implied continuum concavity d^2A/dW^2 = 2 a2, and measures the size of the
 * curvature CORRECTION a2 W^2 against the ~0.09 linear-undershoot gap it was invoked to explain.
 *
 * THE LADDER (imported, not recomputed -- no fresh terms)
 * ------------------------------------------------------
 *   A(W) at PPD = 120 from imp-124771.widthLadder, three finest rungs:
 *     W = 0.15 -> 9.477, W = 0.125 -> 9.412, W = 0.10 -> 9.397.
 *   These are equally spaced in W (h = 0.025), so the exact quadratic through them has a leading
 *   coefficient a2 = [A(0.15) - 2 A(0.125) + A(0.10)] / (2 h^2) fixed by the stored second difference.
 *
 * THE MEASUREMENT (sensitivity only)
 * ----------------------------------
 *   (F1) THE FITTED RESIDUAL CONCAVITY IS NOT "MILD" -- IT IS ~5x TOO LARGE. The three-finest exact
 *        quadratic gives a2 ~ 40.0 per unit W^2, i.e. an implied continuum concavity d^2A/dW^2 ~ 80.
 *        Evaluated at the FINEST bracket W = 0.10, the curvature correction a2 W^2 ~ 0.40 in A -- roughly
 *        4.6x the ~0.09 (= 9.42 - 9.33) linear-undershoot gap it was supposed to account for. A curvature
 *        that overshoots the deficit it explains by ~5x is inconsistent with the "mild concavity" reading:
 *        the concavity-aware limit lands at A ~ 9.84 (+4.4%), OVER the closed form, not on it.
 *   (F2) THE CONCAVITY IS SET BY A SINGLE SECOND DIFFERENCE OF 4-DECIMAL DATA. a2 is fixed entirely by the
 *        second difference A(0.15) - 2 A(0.125) + A(0.10) = 0.050, a quantity of the same order as the
 *        4-decimal storage/round + D2-crossing jitter in the individual A rungs (imp-124787 F2). So the
 *        measured "residual concavity" is jitter-dominated: its magnitude (0.40 in A) is not a physical
 *        continuum curvature but the amplified image of a ~0.05 second-difference wobble.
 *
 * The punchline: quantifying the residual concavity CONFIRMS imp-124787's verdict from the other side.
 * The linear chord did not miss a "mild" curvature; the fitted curvature is ~5x too big to be the ~1%
 * undershoot's cause, and it is set by a single jitter-scale second difference. The discrete-vs-closed-
 * form reconciliation stands at the FINITE-BRACKET level (A(0.10) ~ 9.40, ~0.3%, imp-124771 F2), not via
 * any O(W^2) continuum concavity. SUB-GAP (inherited from imp-124787): a jitter-suppressed knee estimator
 * (smooth-fit second difference, or a co-refined PPD/W ladder) is needed to measure a true A(W) curvature;
 * the stored 4-decimal ladder cannot resolve a concavity smaller than its own second-difference jitter.
 *
 * MEASUREMENT / SENSITIVITY ONLY. Conditional-share curvature diagnostic, NOT an RH bound. The component
 * model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-
 * conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz is UNTOUCHED (imp-2642); changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian
 * Lambda <= 0.2 remains SOTA.
 *
 * @see imp-124771-knee-amp-bracket-width-reconcile (the A(W) ladder + linear W -> 0 chord ~9.33)
 * @see imp-124787-knee-amp-quadratic-richardson (the O(W^2) subset-instability spread ~0.73)
 * @see imp-97804-knee-eflow-linear-expansion (closed-form A ~ 9.42 via the continuous d2p/dt2 = 0 knee)
 */

import { IMP124771_KNEE_AMP_BRACKET_WIDTH_RECONCILE } from './imp-124771-knee-amp-bracket-width-reconcile.js';
import { IMP97804_KNEE_EFLOW_LINEAR_EXPANSION } from './imp-97804-knee-eflow-linear-expansion.js';

// --- The imp-124771 A(W) ladder, imported VERBATIM (fixed fine PPD = 120), ascending W. ---
const LADDER = IMP124771_KNEE_AMP_BRACKET_WIDTH_RECONCILE.widthLadder
  .filter((r) => r.A !== null)
  .map((r) => ({ W: r.W, A: r.A }))
  .sort((a, b) => a.W - b.W); // 0.10 .. 0.25

const CLOSED_FORM_A = IMP97804_KNEE_EFLOW_LINEAR_EXPANSION.amplification; // ~9.422

// --- Finest three rungs: W = 0.10, 0.125, 0.15 (equal spacing h = 0.025). ---
const THREE_FINEST = LADDER.slice(0, 3); // ascending W: 0.10, 0.125, 0.15

// --- Exact quadratic A = a0 + a1 W + a2 W^2 through the three finest rungs. ---
// Newton divided differences give the leading coefficient a2 directly; back-substitute for a1, a0.
function quadCoeffs(pts) {
  const x = pts.map((p) => p.W);
  const y = pts.map((p) => p.A);
  const g = [...y];
  const c = [g[0]];
  for (let k = 1; k < pts.length; k++) {
    for (let i = pts.length - 1; i >= k; i--) g[i] = (g[i] - g[i - 1]) / (x[i] - x[i - k]);
    c.push(g[k]);
  }
  const a2 = c[2];
  const a1 = c[1] - c[2] * (x[0] + x[1]);
  const a0 = c[0] - c[1] * x[0] + c[2] * x[0] * x[1];
  return { a0, a1, a2 };
}

const { a0, a1, a2 } = quadCoeffs(THREE_FINEST);
const CONCAVITY = 2 * a2; // implied continuum d2A/dW2 (constant for a quadratic)
const FINEST_W = THREE_FINEST[0].W; // 0.10
const CURVATURE_TERM = a2 * FINEST_W * FINEST_W; // a2 W^2 at the finest bracket
const LINEAR_UNDERSHOOT_GAP = +(CLOSED_FORM_A - IMP124771_KNEE_AMP_BRACKET_WIDTH_RECONCILE.wZeroExtrapolation).toFixed(4); // ~0.09
const CURVATURE_OVER_GAP = +(Math.abs(CURVATURE_TERM) / LINEAR_UNDERSHOOT_GAP).toFixed(2); // ~4.6

// --- The stored second difference that fixes a2 (equal spacing h). ---
const H = THREE_FINEST[1].W - THREE_FINEST[0].W; // 0.025
const SECOND_DIFF = +(THREE_FINEST[2].A - 2 * THREE_FINEST[1].A + THREE_FINEST[0].A).toFixed(4); // ~0.050

const QUAD3_W0 = a0; // concavity-aware W -> 0 limit ~9.84
const pct = (v) => +(Math.abs(v / CLOSED_FORM_A - 1) * 100).toFixed(3);
const QUAD3_PCT = pct(QUAD3_W0); // ~4.4% OVERshoot

export const IMP124807_KNEE_AMP_THREE_FINEST_RESIDUAL_CONCAVITY = {
  id: 'imp-124807',
  proofSection: 'S-frontier',
  question:
    'imp-124771 F3 blamed a "mild concavity of A(W)" for the ~1% undershoot of its LINEAR W -> 0 chord ' +
    '(A ~ 9.33) against the imp-97804 closed-form A ~ 9.42, and imp-124787 showed an O(W^2) Richardson ' +
    'fit does NOT close the gap. But the "residual concavity" itself was never quantified. Reuse the ' +
    'imp-124771 A(W) ladder verbatim, run the second-order (concavity-aware) Richardson over the FINEST ' +
    'THREE brackets (W = 0.15,0.125,0.10), extract the curvature coefficient a2 and the implied concavity ' +
    'd2A/dW2, and measure the curvature correction against the ~0.09 gap. Measurement/sensitivity only; ' +
    'C_mb GUE-conditional (imp-486) untouched; no bound moves; NO QED.',
  measuredQuantity:
    'the fitted quadratic curvature coefficient a2 (and implied continuum concavity d2A/dW2 = 2 a2) of ' +
    'the exact quadratic through the three finest imp-124771 amplification rungs, plus the curvature ' +
    'correction a2 W^2 at the finest bracket W = 0.10 relative to the ~0.09 linear-undershoot gap',
  threeFinest: THREE_FINEST, // imported imp-124771 rungs, ascending W: 0.10, 0.125, 0.15
  closedFormA: +CLOSED_FORM_A.toFixed(3), // ~9.422
  spacingH: +H.toFixed(4), // 0.025 (equal-spaced stencil)
  secondDifference: SECOND_DIFF, // A(0.15) - 2 A(0.125) + A(0.10) ~ 0.050 -- what fixes a2
  a2: +a2.toFixed(3), // curvature coefficient ~40.0 per unit W^2
  impliedConcavity: +CONCAVITY.toFixed(3), // d2A/dW2 = 2 a2 ~ 80.0
  curvatureTermAtFinest: +CURVATURE_TERM.toFixed(4), // a2 W^2 at W = 0.10 ~ 0.40 in A
  linearUndershootGap: LINEAR_UNDERSHOOT_GAP, // ~0.09 (closed form minus linear W -> 0 chord)
  curvatureOverGap: CURVATURE_OVER_GAP, // ~4.6 -- curvature correction / gap it should explain
  quad3W0: +QUAD3_W0.toFixed(4), // concavity-aware W -> 0 limit ~9.84 (OVERshoots the closed form)
  quad3ResidualPct: QUAD3_PCT, // ~4.4%
  finding: {
    F1_residual_concavity_is_5x_too_large:
      'The three-finest exact quadratic gives a2 ~ ' + (+a2.toFixed(1)) + ' per unit W^2 (implied ' +
      'd2A/dW2 ~ ' + (+CONCAVITY.toFixed(0)) + '). At the finest bracket W = ' + FINEST_W + ' the ' +
      'curvature correction a2 W^2 ~ ' + (+CURVATURE_TERM.toFixed(2)) + ' in A -- about ' + CURVATURE_OVER_GAP +
      'x the ~' + LINEAR_UNDERSHOOT_GAP + ' linear-undershoot gap it was invoked to explain. The concavity-' +
      'aware W -> 0 limit therefore lands at A ~ ' + (+QUAD3_W0.toFixed(2)) + ' (+' + QUAD3_PCT + '%), OVER ' +
      'the closed form, not on it; a curvature ~5x too big to be the ~1% deficit is NOT the "mild concavity" ' +
      'the linear chord was accused of missing.',
    F2_concavity_set_by_a_single_jitter_scale_second_difference:
      'a2 is fixed entirely by the stored second difference A(0.15) - 2 A(0.125) + A(0.10) = ' + SECOND_DIFF +
      ', a quantity of the same order as the 4-decimal storage/round + D2-crossing jitter in the individual ' +
      'A rungs (imp-124787 F2). The measured residual concavity (' + (+CURVATURE_TERM.toFixed(2)) + ' in A) is ' +
      'thus the amplified image of a ~' + SECOND_DIFF + ' second-difference wobble, not a physical continuum ' +
      'curvature.',
  },
  subGap:
    'Inherited from imp-124787: a jitter-suppressed knee estimator (smooth-fit second difference, or a ' +
    'co-refined PPD/W ladder) is needed to measure a true A(W) curvature; the stored 4-decimal amplification ' +
    'ladder cannot resolve a concavity smaller than its own ~0.05 second-difference jitter.',
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Quantifying the imp-124771 "residual concavity" ' +
    'CONFIRMS imp-124787 from the other side: the three-finest concavity-aware Richardson fits a2 ~ ' +
    (+a2.toFixed(1)) + ' (d2A/dW2 ~ ' + (+CONCAVITY.toFixed(0)) + '), whose curvature correction a2 W^2 ~ ' +
    (+CURVATURE_TERM.toFixed(2)) + ' at W = ' + FINEST_W + ' is ~' + CURVATURE_OVER_GAP + 'x the ~' +
    LINEAR_UNDERSHOOT_GAP + ' gap it should explain, driving the W -> 0 limit to A ~ ' + (+QUAD3_W0.toFixed(2)) +
    ' (+' + QUAD3_PCT + '%) OVER the closed form. The concavity is set by a single ~' + SECOND_DIFF +
    ' second difference of 4-decimal data, i.e. jitter-dominated. The linear chord did not miss a mild ' +
    'curvature; the fitted curvature is ~5x too big to be the ~1% undershoot cause. Reconciliation stands ' +
    'at the FINITE-BRACKET level (A(0.10) ~ ' + THREE_FINEST[0].A + ', ~0.3%, imp-124771 F2), NOT via an ' +
    'O(W^2) concavity. SUB-GAP: a jitter-suppressed knee estimator is needed. The component model is the ' +
    'inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per ' +
    'imp-486 is UNTOUCHED; the C_C 1/8 ansatz is UNTOUCHED (imp-2642); changes no bound; establishes no ' +
    'operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 ' +
    'remains SOTA.',
  citation:
    'imp-124771 (A(W) bracket-width ladder + linear W -> 0 chord ~9.33); imp-124787 (O(W^2) subset-' +
    'instability spread ~0.73); imp-97804 (closed-form A ~ 9.42 via the continuous d2p/dt2 = 0 knee); ' +
    'imp-486 (C_mb GUE-conditional).',
};

export const IMP124807_KNEE_AMP_THREE_FINEST_RESIDUAL_CONCAVITY_ASSERTIONS = [
  {
    // Reuse gate: the three finest rungs are the imp-124771 width-ladder rungs at W = 0.10, 0.125, 0.15.
    id: 'imp124807-reuses-imp124771-three-finest',
    description: 'the three finest rungs imported from imp-124771 are W = 0.10, 0.125, 0.15 with equal spacing',
    holds: () => {
      const ws = THREE_FINEST.map((r) => r.W);
      return (
        THREE_FINEST.length === 3 &&
        Math.abs(ws[0] - 0.1) < 1e-9 &&
        Math.abs(ws[1] - 0.125) < 1e-9 &&
        Math.abs(ws[2] - 0.15) < 1e-9 &&
        Math.abs((ws[1] - ws[0]) - (ws[2] - ws[1])) < 1e-9
      );
    },
  },
  {
    // (F1): the fitted curvature coefficient a2 is large and positive (concave-up in W).
    id: 'imp124807-a2-large-positive',
    description: 'the three-finest quadratic curvature coefficient a2 is > 30 per unit W^2',
    holds: () => a2 > 30,
  },
  {
    // (F1): the curvature correction at the finest bracket is several times the linear-undershoot gap.
    id: 'imp124807-curvature-dwarfs-gap',
    description: 'the curvature correction a2 W^2 at W = 0.10 exceeds 3x the ~0.09 linear-undershoot gap',
    holds: () => CURVATURE_OVER_GAP > 3,
  },
  {
    // (F1): the concavity-aware W -> 0 limit OVERshoots the closed form (does not close onto 9.42).
    id: 'imp124807-quad3-overshoots-closed-form',
    description: 'the three-finest concavity-aware W -> 0 limit overshoots the closed form (> 9.42, resid > 2%)',
    holds: () => QUAD3_W0 > CLOSED_FORM_A && QUAD3_PCT > 2,
  },
  {
    // (F2): a2 is fixed by the stored second difference (jitter-scale), consistent with 2 a2 h^2.
    id: 'imp124807-a2-from-second-difference',
    description: 'a2 reproduces the stored second difference: 2 a2 h^2 equals A(0.15) - 2 A(0.125) + A(0.10)',
    holds: () => Math.abs(2 * a2 * H * H - SECOND_DIFF) < 1e-6,
  },
  {
    // Honesty gate: measurement/sensitivity only, no QED, PT stays SOTA.
    id: 'imp124807-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, Platt-Trudgian stays SOTA',
    holds: () =>
      IMP124807_KNEE_AMP_THREE_FINEST_RESIDUAL_CONCAVITY.isRigorous === false &&
      /NO QED/.test(IMP124807_KNEE_AMP_THREE_FINEST_RESIDUAL_CONCAVITY.verdict) &&
      /remains SOTA/.test(IMP124807_KNEE_AMP_THREE_FINEST_RESIDUAL_CONCAVITY.verdict),
  },
];

for (const a of IMP124807_KNEE_AMP_THREE_FINEST_RESIDUAL_CONCAVITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-124807-knee-amp-three-finest-residual-concavity assertion failed: ${a.id}`);
  }
}
