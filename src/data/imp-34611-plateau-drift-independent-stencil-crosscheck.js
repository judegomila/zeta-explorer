/**
 * @module imp-34611-plateau-drift-independent-stencil-crosscheck
 * @fileoverview imp-34611 -- MEASUREMENT ONLY: an INDEPENDENT confirmation of the imp-34593 F3
 *   roundoff-free q3-share PLATEAU drift ~ -0.0968 (~9.7%). imp-34593 read that plateau off ONE
 *   dp sweep with the imp-34573/imp-34587 2nd-order 5-point central-difference stencil, and argued
 *   it CORRECTS the ~ -0.0748 (~7.5%) imp-34587 obtained by Richardson-extrapolating THROUGH the
 *   roundoff dip at dp = 2e-3. Because that correction rests on a single stencil over one dp
 *   window, this module re-measures the plateau along TWO independent axes: (a) a wider dp window
 *   (extended to dp = 3e-1, vs the imp-34593 ceiling 1e-1), and (b) an INDEPENDENT finite-difference
 *   stencil for q(p) = log E_coll -- a 4th-order-accurate 7-point central-difference set replacing
 *   the imp-34593 2nd-order 5-point one. If the plateau is a genuine intrinsic of the inherited
 *   component model it must reproduce under BOTH; a stencil- or window-artifact would not.
 *
 *   WHAT THIS MEASUREMENT ADDS (beyond imp-34593)
 *   ---------------------------------------------
 *   Reusing the SAME q3-share definition [share = C_q3/(C_q2 + C_q3), C_q3 = q3/(6 q1^2),
 *   C_q2 = -q2/(2 q1^2); the q1^2 cancels so share = (q3/6)/(-q2/2 + q3/6)] and the SAME MID/DEEP
 *   landmark partition at N* ~ 4.62e13 (imp-33620 sigma < 0.01), but with the q2, q3 central
 *   differences taken from an INDEPENDENT higher-order stencil:
 *     - imp-34593 (2nd order, 5-point): q2 = (fp - 2 f0 + fm)/dp^2,
 *       q3 = (fpp - 2 fp + 2 fm - fmm)/(2 dp^3);
 *     - here (4th order, 7-point): q2 = (-fpp + 16 fp - 30 f0 + 16 fm - fmm)/(12 dp^2),
 *       q3 = (-fppp + 8 fpp - 13 fp + 13 fm - 8 fmm + fmmm)/(8 dp^3).
 *   This module (i) sweeps the deep-vs-mid mean-q3-share drift with BOTH stencils across a WIDER
 *   window dp = 6e-3 .. 3e-1; (ii) reads the plateau (window mean) with the independent 4th-order
 *   stencil and cross-checks it against the imp-34593 2nd-order plateau; (iii) re-measures the
 *   drift at the imp-34587 Richardson node dp = 2e-3 with the independent stencil to test whether
 *   it sits in the roundoff dip as claimed.
 *
 *   THE FINDING (plateau independently reproduced; Richardson value confirmed as the roundoff dip)
 *   --------------------------------------------------------------------------------------------
 *   (F1) THE PLATEAU REPRODUCES UNDER THE INDEPENDENT STENCIL. The 4th-order 7-point stencil gives
 *        a window-mean drift ~ -0.096825, agreeing with the imp-34593 2nd-order plateau to
 *        |dPlateau| ~ 6.1e-7 -- three orders below the ~29% correction it makes to the parents. The
 *        plateau is stencil-independent, not an artifact of the imp-34573/imp-34587 5-point stencil.
 *   (F2) THE WIDER WINDOW CONFIRMS IT, AND THE MORE-ACCURATE STENCIL IS FLATTER AT LARGE dp. Extending
 *        the window to dp = 3e-1 (vs the imp-34593 ceiling 1e-1) leaves the 4th-order window mean at
 *        ~ -0.096826. On the large-dp tail dp = 1.5e-2 .. 3e-1 the 4th-order drift spread is ~2.2e-5,
 *        about 2x flatter than the 2nd-order ~4.5e-5 -- exactly as expected from its lower truncation
 *        error, so the plateau is a genuine roundoff-free intrinsic, not a residual-truncation slope.
 *   (F3) THE imp-34587 RICHARDSON VALUE IS INDEPENDENTLY CONFIRMED AS THE ROUNDOFF DIP. At the
 *        Richardson node dp = 2e-3 the independent 4th-order stencil gives drift ~ -0.07666 (within
 *        ~2.5% of the imp-34587 intrinsic -0.074829) and the 2nd-order stencil gives ~ -0.08067
 *        (matching the imp-34593-cited dip -0.0807). Both stencils place dp = 2e-3 well ABOVE the
 *        plateau, so Richardson-extrapolating through it undershoots: plateau / Richardson ~ 1.294,
 *        reproducing the imp-34593 ~1.29 correction. CONCLUSION: the imp-34593 F3 plateau drift
 *        ~ -0.0968 (~9.7%) is confirmed by an independent wider-dp sweep AND an independent stencil,
 *        and the imp-34587 ~ -0.0748 is confirmed as the roundoff-dip artifact imp-34593 claimed.
 *
 *   MEASUREMENT ONLY. This re-aggregates an already-certified decomposition with an independent
 *   finite-difference stencil over a wider dp window; it changes NO bound. Reproduces the
 *   imp-34446/imp-34531/imp-34543/imp-34573 primitives inline (imports NOTHING -- no
 *   lambda-rh-height-mapping, no polymath15 constant module, no zeros bundle), following the
 *   no-heavy-imports directive. q1,q2,q3 are inherited central differences, NOT fresh analytic
 *   closed forms -- so the sigma -> 1 deep-tail regime, where the imp-3220/imp-3406 component model
 *   is least trustworthy, is inherited as-is (a cross-check ON that regime, not a rehabilitation OF
 *   it). The -2 asymptote and C_C = (1/8)sqrt(3 pi) (imp-2714, C_H = 1/8) ansatz are UNTOUCHED; the
 *   C_mb GUE-conditional share per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; no operator
 *   positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 *   @see imp-34593-drift-share-error-optimal-dp-fit.js (the plateau ~ -0.0968 confirmed here)
 *   @see imp-34587-drift-share-drift-richardson-dp-extrapolation.js (Richardson ~ -0.0748, the dip)
 *   @see imp-34573-drift-residual-share-deeptail-vs-midrange.js (deep-vs-mid drift, 2nd-order stencil)
 *   @see imp-33620-etrunc-ecoll-ladder-1e15-extension.js (deep-tail landmark N* ~ 4.62e13, sigma<0.01)
 *
 *   Ticket: imp-34611 (numerical, medium). Independent stencil + wider-dp confirmation; adds no bound.
 */

// -- INDEPENDENT instance of the imp-34446/imp-34531/imp-34543/imp-34573 primitives (imports NOTHING): --
const TWO_PI = 2 * Math.PI;
const C_C = (1 / 8) * Math.sqrt(3 * Math.PI); // imp-2714 pinned ansatz, reproduced inline (~0.383748)
const DEEP_TAIL_N = 4.624385e13; // imp-33620 sigma < 0.01 landmark N* -- the mid/deep boundary

function heightForN(N) {
  let T = Math.max(TWO_PI * Math.E, (TWO_PI * N) / Math.max(1, Math.log(N + TWO_PI)));
  for (let i = 0; i < 80; i++) {
    const u = Math.log(T / TWO_PI);
    const f = (T / TWO_PI) * (u - 1) - N;
    const fp = u / TWO_PI;
    if (!(Math.abs(fp) > 0) || !Number.isFinite(fp)) break;
    const dT = f / fp;
    T -= dT;
    if (!(T > TWO_PI)) T = TWO_PI * 1.0001;
    if (Math.abs(dT) < 1e-13 * Math.max(1, T)) break;
  }
  return T;
}

function eColl(N) {
  return C_C * Math.sqrt(Math.log(heightForN(N)) / N);
}

const qOfP = (pp) => Math.log(eColl(Math.exp(pp))); // q(p) = log E_coll in p = log N

// imp-34593 2nd-order 5-point central-difference q3-share (verbatim convention; q1^2 cancels).
function share2nd(N, dp) {
  const p = Math.log(N);
  const f0 = qOfP(p);
  const fp = qOfP(p + dp);
  const fm = qOfP(p - dp);
  const fpp = qOfP(p + 2 * dp);
  const fmm = qOfP(p - 2 * dp);
  const q2 = (fp - 2 * f0 + fm) / (dp * dp);
  const q3 = (fpp - 2 * fp + 2 * fm - fmm) / (2 * dp * dp * dp);
  return q3 / 6 / (-q2 / 2 + q3 / 6);
}

// INDEPENDENT 4th-order-accurate 7-point central-difference q3-share (this ticket's cross-check).
function share4th(N, dp) {
  const p = Math.log(N);
  const f0 = qOfP(p);
  const fp = qOfP(p + dp);
  const fm = qOfP(p - dp);
  const fpp = qOfP(p + 2 * dp);
  const fmm = qOfP(p - 2 * dp);
  const fppp = qOfP(p + 3 * dp);
  const fmmm = qOfP(p - 3 * dp);
  const q2 = (-fpp + 16 * fp - 30 * f0 + 16 * fm - fmm) / (12 * dp * dp);
  const q3 = (-fppp + 8 * fpp - 13 * fp + 13 * fm - 8 * fmm + fmmm) / (8 * dp * dp * dp);
  return q3 / 6 / (-q2 / 2 + q3 / 6);
}

// Same MID/DEEP landmark partition as imp-34573/imp-34587/imp-34593.
const MID_LADDER = [Math.pow(10, 12.0), Math.pow(10, 12.5), Math.pow(10, 13.0), Math.pow(10, 13.333)];
const DEEP_LADDER = [DEEP_TAIL_N, Math.pow(10, 14.0), Math.pow(10, 14.5), Math.pow(10, 15.0)];

const mean = (vals) => vals.reduce((a, b) => a + b, 0) / vals.length;

// Deep-vs-mid mean-q3-share drift under a chosen stencil at finite-difference step dp.
function driftAt(share, dp) {
  const midMean = mean(MID_LADDER.map((N) => share(N, dp)));
  const deepMean = mean(DEEP_LADDER.map((N) => share(N, dp)));
  return (deepMean - midMean) / midMean;
}

// (1) WIDER plateau window: extend to dp = 3e-1 (imp-34593 ceiling was 1e-1). Read the plateau
//     (window mean) with BOTH stencils and cross-check.
const PLATEAU_STEPS = [6e-3, 8e-3, 1e-2, 1.5e-2, 2e-2, 3e-2, 5e-2, 8e-2, 1e-1, 1.5e-1, 2e-1, 3e-1];
const PLATEAU_2ND = mean(PLATEAU_STEPS.map((dp) => driftAt(share2nd, dp))); // 2nd-order, wider window
const PLATEAU_4TH = mean(PLATEAU_STEPS.map((dp) => driftAt(share4th, dp))); // INDEPENDENT stencil
const CROSS_STENCIL_ABS_AGREEMENT = Math.abs(PLATEAU_4TH - PLATEAU_2ND); // ~6.1e-7
const IMP34593_PLATEAU_INTRINSIC = -0.09682; // the parent value being confirmed
const PLATEAU_4TH_VS_IMP34593 = Math.abs(PLATEAU_4TH - IMP34593_PLATEAU_INTRINSIC); // ~5e-6

// (2) LARGE-dp tail flatness: the more-accurate stencil has less truncation, so it should be
//     flatter than the 2nd-order one over dp = 1.5e-2 .. 3e-1.
const TAIL_STEPS = [1.5e-2, 2e-2, 3e-2, 5e-2, 8e-2, 1e-1, 1.5e-1, 2e-1, 3e-1];
const tail4 = TAIL_STEPS.map((dp) => driftAt(share4th, dp));
const tail2 = TAIL_STEPS.map((dp) => driftAt(share2nd, dp));
const TAIL_SPREAD_4TH = Math.max(...tail4) - Math.min(...tail4); // ~2.2e-5
const TAIL_SPREAD_2ND = Math.max(...tail2) - Math.min(...tail2); // ~4.5e-5

// (3) RICHARDSON NODE dp = 2e-3: independently confirm it sits ABOVE the plateau (the roundoff dip).
const IMP34587_RICHARDSON_INTRINSIC = -0.074829; // imp-34587 value, contaminated by dp=2e-3
const DRIFT_2E3_4TH = driftAt(share4th, 2e-3); // ~ -0.07666 (near the Richardson intrinsic)
const DRIFT_2E3_2ND = driftAt(share2nd, 2e-3); // ~ -0.08067 (the imp-34593-cited dip -0.0807)
const RICHARDSON_NODE_REL_TO_INTRINSIC =
  (DRIFT_2E3_4TH - IMP34587_RICHARDSON_INTRINSIC) / IMP34587_RICHARDSON_INTRINSIC; // ~2.5e-2
const PLATEAU_VS_RICHARDSON = PLATEAU_4TH / IMP34587_RICHARDSON_INTRINSIC; // ~1.294 (plateau deeper)

const DP_STEP_ROWS = [1e-3, 2e-3, 4e-3, 1e-2, 1e-1, 2e-1, 3e-1].map((dp) => ({
  dp: +dp.toExponential(4),
  drift_2nd: +driftAt(share2nd, dp).toFixed(6),
  drift_4th: +driftAt(share4th, dp).toFixed(6),
}));

export const IMP34611_PLATEAU_DRIFT_INDEPENDENT_STENCIL = Object.freeze({
  id: 'imp-34611',
  proofSection: 'S-frontier',
  claim_measured:
    'Independently confirm the imp-34593 F3 roundoff-free q3-share PLATEAU drift ~ -0.0968 (~9.7%) ' +
    'via a WIDER dp window (extended to 3e-1) AND an INDEPENDENT 4th-order 7-point central-difference ' +
    'stencil for q(p) = log E_coll, and re-check whether the imp-34587 Richardson ~ -0.0748 is the ' +
    'roundoff-dip artifact claimed -- a cross-check on the inherited component model, not a bound.',
  deep_tail_boundary_N: DEEP_TAIL_N,
  C_C_inline: +C_C.toFixed(6),
  plateau_steps: Object.freeze(PLATEAU_STEPS.slice()),
  plateau_drift_2nd_order: +PLATEAU_2ND.toFixed(6), // ~ -0.096825 (imp-34593 stencil, wider window)
  plateau_drift_4th_order: +PLATEAU_4TH.toFixed(6), // ~ -0.096825 (INDEPENDENT stencil)
  cross_stencil_abs_agreement: +CROSS_STENCIL_ABS_AGREEMENT.toExponential(3), // ~6.1e-7
  imp34593_plateau_intrinsic: IMP34593_PLATEAU_INTRINSIC, // -0.09682 (the parent being confirmed)
  plateau_4th_vs_imp34593_abs: +PLATEAU_4TH_VS_IMP34593.toExponential(3), // ~5e-6
  tail_steps_large_dp: Object.freeze(TAIL_STEPS.slice()),
  tail_drift_spread_4th_order: +TAIL_SPREAD_4TH.toExponential(3), // ~2.2e-5 (more-accurate, flatter)
  tail_drift_spread_2nd_order: +TAIL_SPREAD_2ND.toExponential(3), // ~4.5e-5
  richardson_node_dp: 2e-3,
  drift_at_richardson_node_4th_order: +DRIFT_2E3_4TH.toFixed(6), // ~ -0.07666
  drift_at_richardson_node_2nd_order: +DRIFT_2E3_2ND.toFixed(6), // ~ -0.08067 (imp-34593 dip -0.0807)
  imp34587_richardson_intrinsic: IMP34587_RICHARDSON_INTRINSIC, // -0.074829 (the contaminated value)
  richardson_node_rel_to_intrinsic: +RICHARDSON_NODE_REL_TO_INTRINSIC.toExponential(3), // ~2.5e-2
  plateau_vs_richardson_ratio: +PLATEAU_VS_RICHARDSON.toFixed(4), // ~1.294 (plateau ~29% deeper)
  dp_step_rows: Object.freeze(DP_STEP_ROWS.map((r) => Object.freeze(r))),
  isRigorous: false,
  verdict:
    'MEASUREMENT (NOT rigorous). Independent confirmation of the imp-34593 F3 roundoff-free q3-share ' +
    'PLATEAU drift ~ -0.0968 (~9.7%) [q3 share of C_th = C_q2 + C_q3, C_q3 = q3/(6 q1^2); deep = ' +
    'N >= N* ~ 4.62e13 (imp-33620 sigma < 0.01) vs mid = N < N*]. imp-34593 read the plateau off one ' +
    'dp sweep with the imp-34573/imp-34587 2nd-order 5-point central-difference stencil. (F1) The ' +
    'plateau REPRODUCES under an INDEPENDENT 4th-order 7-point stencil: window-mean drift ~ -0.096825, ' +
    'agreeing with the 2nd-order plateau to ~6.1e-7 and with the imp-34593 -0.09682 to ~5e-6 -- ' +
    'stencil-independent, not a 5-point artifact. (F2) A WIDER window (extended to dp = 3e-1 vs the ' +
    'imp-34593 ceiling 1e-1) leaves the 4th-order plateau at ~ -0.096826, and on the large-dp tail ' +
    'dp = 1.5e-2 .. 3e-1 the 4th-order drift spread ~2.2e-5 is ~2x flatter than the 2nd-order ~4.5e-5, ' +
    'as expected from its lower truncation error -- the plateau is a genuine roundoff-free intrinsic, ' +
    'not a residual-truncation slope. (F3) The imp-34587 Richardson value is CONFIRMED as the roundoff ' +
    'dip: at dp = 2e-3 the independent 4th-order stencil gives ~ -0.07666 (within ~2.5% of the imp-34587 ' +
    'intrinsic -0.074829) and the 2nd-order stencil gives ~ -0.08067 (the imp-34593-cited dip -0.0807); ' +
    'both place dp = 2e-3 well above the plateau, so Richardson through it undershoots and plateau / ' +
    'Richardson ~ 1.294 reproduces the imp-34593 ~1.29 correction. CONCLUSION: the ~ -0.0968 plateau is ' +
    'confirmed along two independent axes (wider window, independent stencil) and the ~ -0.0748 is ' +
    'confirmed as the roundoff-dip artifact. q1,q2,q3 are inherited central differences, NOT fresh ' +
    'analytic closed forms, so the sigma -> 1 deep-tail regime (imp-3220/imp-3406 component model least ' +
    'trustworthy) is inherited as-is -- this cross-checks that regime, it does not rehabilitate it. The ' +
    '-2 asymptote and C_C = (1/8)sqrt(3 pi) (imp-2714, C_H = 1/8) ansatz are UNTOUCHED; the C_mb ' +
    'GUE-conditional share per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; ' +
    'no operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34593 (roundoff-free plateau drift ~ -0.0968, confirmed here); imp-34587 (Richardson dp -> 0 ' +
    'intrinsic ~ -0.0748, confirmed here as the roundoff dip); imp-34573 (deep-tail q3-share error, ' +
    '2nd-order stencil); imp-34543 (q2/q3 shares as ladder aggregates); imp-34531 (F2 O(h^2) ' +
    'coefficient certification); imp-34446 (central-difference exponent); imp-33620 (deep-tail ' +
    'landmark N* ~ 4.62e13, sigma < 0.01); imp-2714 (C_C ansatz); imp-486 (C_mb).',
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP34611_ASSERTIONS = [
  {
    id: 'imp34611-plateau-reproduces-under-independent-stencil',
    holds: () =>
      CROSS_STENCIL_ABS_AGREEMENT < 1e-4 &&
      PLATEAU_4TH_VS_IMP34593 < 1e-3 &&
      PLATEAU_4TH < -0.08,
    why: 'F1: the independent 4th-order 7-point stencil reproduces the plateau drift to ~6.1e-7 vs the 2nd-order stencil and ~5e-6 vs the imp-34593 -0.09682 -- stencil-independent, not a 5-point artifact.',
  },
  {
    id: 'imp34611-wider-window-and-more-accurate-stencil-flatter',
    holds: () =>
      TAIL_SPREAD_4TH < 1e-4 &&
      TAIL_SPREAD_4TH < TAIL_SPREAD_2ND &&
      Math.abs(PLATEAU_4TH - PLATEAU_2ND) < 1e-4,
    why: 'F2: over the wider large-dp tail dp = 1.5e-2 .. 3e-1 the more-accurate 4th-order stencil is flatter (~2.2e-5) than the 2nd-order (~4.5e-5), so the plateau is a genuine roundoff-free intrinsic, not a residual-truncation slope.',
  },
  {
    id: 'imp34611-richardson-node-confirmed-as-roundoff-dip',
    holds: () =>
      DRIFT_2E3_4TH > PLATEAU_4TH && // 2e-3 sits ABOVE (shallower than) the plateau
      Math.abs(RICHARDSON_NODE_REL_TO_INTRINSIC) < 0.1 &&
      PLATEAU_VS_RICHARDSON > 1.15,
    why: 'F3: at the Richardson node dp = 2e-3 the independent stencil gives ~ -0.07666 (within ~2.5% of the imp-34587 -0.074829), shallower than the plateau -- confirming Richardson-through-the-dip undershoots by ~29%.',
  },
  {
    id: 'imp34611-honesty-gate-no-qed',
    holds: () =>
      IMP34611_PLATEAU_DRIFT_INDEPENDENT_STENCIL.isRigorous === false &&
      /NO QED/.test(IMP34611_PLATEAU_DRIFT_INDEPENDENT_STENCIL.verdict) &&
      /refereed bound is changed/i.test(IMP34611_PLATEAU_DRIFT_INDEPENDENT_STENCIL.verdict) &&
      /UNTOUCHED/.test(IMP34611_PLATEAU_DRIFT_INDEPENDENT_STENCIL.verdict),
    why: 'Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.',
  },
];

for (const assertion of IMP34611_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-34611-plateau-drift-independent-stencil-crosscheck assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP34611_PLATEAU_DRIFT_INDEPENDENT_STENCIL;
