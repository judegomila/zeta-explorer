/**
 * @module imp-34573-drift-residual-share-deeptail-vs-midrange
 * @fileoverview imp-34573 -- MEASUREMENT ONLY: a STABILITY diagnostic on the imp-34543/imp-34531
 *   drift-residual attribution. imp-34543 reported the q2/q3 (curvature / third-derivative) share
 *   split of the O(h^2) coefficient C_th = C_q2 + C_q3 as landmark AGGREGATES (~98% q2, ~2% q3).
 *   This module measures the SAME split SEPARATELY in two regimes -- the sigma -> 1 deep tail
 *   (N >= N* ~ 4.62e13, imp-33620 sigma < 0.01) vs the mid-range (N < N*) -- and reports whether
 *   the ~98%/~2% attribution stays stable or drifts as sigma -> 1, the regime imp-34543 flagged as
 *   where the inherited imp-3220/imp-3406 component model is least trustworthy.
 *
 *   WHY THIS MATTERS (beyond imp-34543)
 *   -----------------------------------
 *   imp-34543 gave the q2/q3 shares as a single ladder-wide table and noted, honestly, that the
 *   sigma -> 1 deep-tail regime is inherited as-is because the component model is least trustworthy
 *   there. It never asked whether the attribution itself is regime-stable: does the ~98%/~2% split
 *   hold as one pushes N deeper into the E_trunc-dominated tail, or does the third-derivative share
 *   drift/blow up? A drifting split would warn that the "q2 is ~98% of the coefficient" story is a
 *   mid-range artifact that does not survive into the deep tail. This module supplies that
 *   regime-separated stability check.
 *
 *   WHAT THIS MEASUREMENT ADDS
 *   --------------------------
 *   Reusing the imp-34543 coefficient decomposition VERBATIM (C_q2 = -q2/(2 q1^2), C_q3 = q3/(6 q1^2),
 *   q1,q2,q3 the inherited central differences of q(p) = log E_coll in p = log N), this module:
 *     (i)   partitions a 1e12 .. 1e15 ladder into a MID group (N < N*) and a DEEP group (N >= N*)
 *           at the imp-33620 sigma < 0.01 landmark N* ~ 4.62e13;
 *     (ii)  tabulates q2_share and q3_share per landmark and reports each group's MEAN q3 share and
 *           relative range, plus the deep-vs-mid drift of the mean;
 *     (iii) as a q4 control, carries the imp-34566 O(h^4) relative contribution per landmark to
 *           confirm the next inherited term stays negligible (~1e-6) in BOTH regimes;
 *     (iv)  runs a q-derivative-step (dp) robustness cross-check: repeats the group means at the
 *           parents' operating step dp = 1e-3 AND at a better-conditioned dp = 2e-3, to separate a
 *           genuine regime drift from the finite-difference conditioning imp-34566 F3 identified.
 *
 *   THE FINDING (the ~98%/~2% split is stable in ORDER, with a mild downward q3 drift)
 *   ---------------------------------------------------------------------------------
 *   (F1) THE SPLIT DOES NOT BREAK DOWN AS sigma -> 1. In BOTH regimes q2 stays dominant (~98%) and
 *        q3 stays the ~2% minority: q3_share sits at ~0.021..0.023 in the mid-range and ~0.015..0.022
 *        in the deep tail -- it never inverts, collapses, or blows up. The qualitative attribution
 *        imp-34543 reported survives into the deep tail.
 *   (F2) BUT THE q3 SHARE DRIFTS DOWN INTO THE TAIL. At the parents' operating step dp = 1e-3 the
 *        deep-group MEAN q3 share (~0.0174) is ~21% below the mid-group mean (~0.0219), and the
 *        deep-group relative range balloons to ~36% (vs ~10% mid) -- i.e. the split is both lower
 *        and less stable in the deep tail at the operating step.
 *   (F3) MOST OF THAT EXTRA DEEP-TAIL INSTABILITY IS FINITE-DIFFERENCE CONDITIONING, NOT A REGIME
 *        BREAK. Re-measuring at a better-conditioned dp = 2e-3 shrinks the deep-vs-mid drift from
 *        ~21% to ~8% and collapses the deep-group relative range from ~36% back to ~7% (comparable
 *        to the mid-range ~9%). So the INTRINSIC drift is a mild, monotone ~8% decline of the q3
 *        share toward the tail (the q2 share creeps up correspondingly), and the larger apparent
 *        deep-tail spread at dp = 1e-3 is the 4-point q3 difference sitting closer to its roundoff
 *        floor -- exactly the truncation-vs-roundoff finite-difference floor imp-34566 F3 found.
 *        CONCLUSION: the ~98%/~2% attribution is regime-stable in order and does not break as
 *        sigma -> 1; the third-derivative share drifts mildly downward (~8% well-conditioned), and
 *        the extra deep-tail scatter is conditioning, not a genuine sigma -> 1 collapse.
 *
 *   MEASUREMENT ONLY. This partitions and re-aggregates an already-certified decomposition and
 *   compares constancy across two N regimes; it changes NO bound. Reproduces the imp-34446/
 *   imp-34531/imp-34543 primitives inline (imports NOTHING -- no lambda-rh-height-mapping, no
 *   polymath15 constant module, no zeros bundle), following the no-heavy-imports directive. q1,q2,q3
 *   are the inherited central differences, NOT fresh analytic closed forms -- so the sigma -> 1
 *   deep-tail regime, where the inherited imp-3220/imp-3406 component model is least trustworthy,
 *   is inherited as-is (stated honestly; this is a diagnostic ON that regime, not a rehabilitation
 *   OF it). The -2 asymptote and C_C = (1/8)sqrt(3 pi) (imp-2714, C_H = 1/8) ansatz are UNTOUCHED;
 *   the C_mb GUE-conditional share per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; no
 *   operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 *   @see imp-34543-drift-residual-third-derivative-share.js (q2/q3 shares as ladder aggregates)
 *   @see imp-34566-drift-residual-fourth-difference-share.js (q4 O(h^4) term negligible; FD floor F3)
 *   @see imp-34531-drift-residual-vs-second-derivative.js (F2 O(h^2) coefficient certification)
 *   @see imp-33620-etrunc-ecoll-ladder-1e15-extension.js (deep-tail landmark N* ~ 4.62e13, sigma<0.01)
 *
 *   Ticket: imp-34573 (numerical, medium). Regime-separated stability diagnostic; adds no bound.
 */

// -- INDEPENDENT instance of the imp-34446/imp-34531/imp-34543 primitives (imports NOTHING): --
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

// imp-34486 CLOSED FORM: crossover exponent -2 + x, x = -2 g/(1-g), g = (1 - 1/log(T0/2pi))/log T0.
function analyticExponent(N) {
  const T0 = heightForN(N);
  const L = Math.log(T0);
  const logU = Math.log(T0 / TWO_PI);
  const g = (1 - 1 / logU) / L;
  const x = (-2 * g) / (1 - g);
  return -2 + x;
}

// imp-34446 MEASUREMENT: d log N / d log E_coll by central difference on N*(1 +/- h).
function measuredExponent(N, h) {
  const Np = N * (1 + h);
  const Nm = N * (1 - h);
  return (Math.log(Np) - Math.log(Nm)) / (Math.log(eColl(Np)) - Math.log(eColl(Nm)));
}

// Derivatives of q(p) = log E_coll in p = log N (identical construction to imp-34543/imp-34566:
// 3-point central q1/q2, 4-point central third difference q3, 5-point central 4th difference q4).
function qDerivs(N, dp) {
  const p = Math.log(N);
  const q = (pp) => Math.log(eColl(Math.exp(pp)));
  const f0 = q(p);
  const fp = q(p + dp);
  const fm = q(p - dp);
  const fpp = q(p + 2 * dp);
  const fmm = q(p - 2 * dp);
  const q1 = (fp - fm) / (2 * dp);
  const q2 = (fp - 2 * f0 + fm) / (dp * dp);
  const q3 = (fpp - 2 * fp + 2 * fm - fmm) / (2 * dp * dp * dp);
  const q4 = (fpp - 4 * fp + 6 * f0 - 4 * fm + fmm) / (dp * dp * dp * dp);
  return { q1, q2, q3, q4 };
}

const H_MEAS = 1e-3; // imp-34446 reference step
const DP_OP = 1e-3; // parents' operating q-derivative step (imp-34543/imp-34566)
const DP_WC = 2e-3; // better-conditioned cross-check step (imp-34566 F3: dp <= 1e-3 nears roundoff)
const H2 = H_MEAS * H_MEAS;
const H4 = H2 * H2;

// The pure third-derivative share of the O(h^2) coefficient (imp-34543 decomposition, verbatim).
function q3Share(N, dp) {
  const { q1, q2, q3 } = qDerivs(N, dp);
  const cQ2 = -(1 / q1) * (q2 / (2 * q1)); // pure curvature part
  const cQ3 = (1 / q1) * (q3 / (6 * q1)); // pure third-derivative part = q3/(6 q1^2)
  return cQ3 / (cQ2 + cQ3);
}

// The imp-34566 O(h^4) (q4-bearing) term relative to the O(h^2) term -- a negligibility control.
function q4RelContribution(N, dp) {
  const { q1, q2, q3, q4 } = qDerivs(N, dp);
  const cTh = -(1 / q1) * (q2 / (2 * q1)) + (1 / q1) * (q3 / (6 * q1));
  const A2 = (-q2 / 2 + q3 / 6) / q1;
  const A4 = (-q2 / 4 + (17 / 72) * q3 - q4 / 12) / q1;
  const cH4 = -(1 / q1) * (A2 * A2 - A4);
  return (H4 * cH4) / (H2 * cTh);
}

// Regime-partitioned landmark ladder: MID = N < N* (sigma > 0.01), DEEP = N >= N* (sigma < 0.01).
const MID_LADDER = [
  { label: '1e12', N: Math.pow(10, 12.0) },
  { label: '3.16e12', N: Math.pow(10, 12.5) },
  { label: '1e13', N: Math.pow(10, 13.0) },
  { label: '2.15e13', N: Math.pow(10, 13.333) },
];
const DEEP_LADDER = [
  { label: 'N* (4.62e13)', N: DEEP_TAIL_N },
  { label: '1e14', N: Math.pow(10, 14.0) },
  { label: '3.16e14', N: Math.pow(10, 14.5) },
  { label: '1e15', N: Math.pow(10, 15.0) },
];

function rowFor({ label, N }) {
  const q3s = q3Share(N, DP_OP);
  return {
    label,
    N: +N.toExponential(3),
    q2_share: +(1 - q3s).toFixed(5), // ~0.978..0.984
    q3_share: +q3s.toFixed(5), // ~0.015..0.023 -- the isolated third-derivative share
    raw_residual: +(analyticExponent(N) - measuredExponent(N, H_MEAS)).toExponential(3), // ~1e-9
    q4_h4_rel: +Math.abs(q4RelContribution(N, DP_OP)).toExponential(2), // ~1e-6, negligible both regimes
  };
}

const MID_ROWS = MID_LADDER.map(rowFor);
const DEEP_ROWS = DEEP_LADDER.map(rowFor);

// Relative range (max-min)/min of |.| across a group -- the "constancy" metric (imp-34543 convention).
function relRange(vals) {
  const mags = vals.map((v) => Math.abs(v));
  const lo = Math.min(...mags);
  const hi = Math.max(...mags);
  return (hi - lo) / lo;
}
function mean(vals) {
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

// Group q3-share statistics at the operating step (parents) and the well-conditioned cross-check step.
function groupStats(ladder, dp) {
  const shares = ladder.map(({ N }) => q3Share(N, dp));
  return { mean: mean(shares), relRange: relRange(shares) };
}

const MID_OP = groupStats(MID_LADDER, DP_OP);
const DEEP_OP = groupStats(DEEP_LADDER, DP_OP);
const MID_WC = groupStats(MID_LADDER, DP_WC);
const DEEP_WC = groupStats(DEEP_LADDER, DP_WC);

// Deep-vs-mid drift of the mean q3 share (negative = q3 share falls into the tail).
const DRIFT_OP = (DEEP_OP.mean - MID_OP.mean) / MID_OP.mean; // ~ -0.21 at dp = 1e-3
const DRIFT_WC = (DEEP_WC.mean - MID_WC.mean) / MID_WC.mean; // ~ -0.08 at dp = 2e-3 (intrinsic)
// How much of the deep-tail relative range collapses when the step is better-conditioned:
const DEEP_RANGE_CONDITIONING_FACTOR = DEEP_OP.relRange / DEEP_WC.relRange; // ~5x (FD conditioning, not regime)
const MAX_Q4_REL = Math.max(...[...MID_ROWS, ...DEEP_ROWS].map((r) => Math.abs(r.q4_h4_rel))); // ~3e-6

export const IMP34573_DRIFT_SHARE_DEEPTAIL_VS_MIDRANGE = Object.freeze({
  id: 'imp-34573',
  proofSection: 'S-frontier',
  claim_measured:
    'Measure the imp-34543 q2/q3 drift-residual share split SEPARATELY in the sigma -> 1 deep tail ' +
    '(N >= N* ~ 4.62e13, imp-33620 sigma < 0.01) vs the mid-range (N < N*), and report whether the ' +
    '~98%/~2% attribution stays stable or drifts as sigma -> 1 -- a regime-separated stability ' +
    'diagnostic on the attribution, not a bound.',
  meas_step_h: H_MEAS,
  q_deriv_step_operating: DP_OP,
  q_deriv_step_wellconditioned: DP_WC,
  deep_tail_boundary_N: DEEP_TAIL_N,
  C_C_inline: +C_C.toFixed(6),
  mid_rows: Object.freeze(MID_ROWS.map((r) => Object.freeze(r))),
  deep_rows: Object.freeze(DEEP_ROWS.map((r) => Object.freeze(r))),
  mid_q3_share_mean_operating: +MID_OP.mean.toFixed(5), // ~0.0219
  deep_q3_share_mean_operating: +DEEP_OP.mean.toFixed(5), // ~0.0174
  mid_q3_share_relrange_operating: +MID_OP.relRange.toFixed(4), // ~0.097
  deep_q3_share_relrange_operating: +DEEP_OP.relRange.toFixed(4), // ~0.362 (inflated by FD conditioning)
  drift_deep_vs_mid_operating: +DRIFT_OP.toFixed(4), // ~ -0.206 (dp = 1e-3, partly conditioning)
  mid_q3_share_mean_wellconditioned: +MID_WC.mean.toFixed(5), // ~0.0208
  deep_q3_share_mean_wellconditioned: +DEEP_WC.mean.toFixed(5), // ~0.0192
  deep_q3_share_relrange_wellconditioned: +DEEP_WC.relRange.toFixed(4), // ~0.071 (back to mid-range level)
  drift_deep_vs_mid_wellconditioned: +DRIFT_WC.toFixed(4), // ~ -0.081 (intrinsic mild drift)
  deep_range_conditioning_factor: +DEEP_RANGE_CONDITIONING_FACTOR.toFixed(2), // ~5x
  max_q4_h4_relative: +MAX_Q4_REL.toExponential(2), // ~3e-6 -- q4 negligible in BOTH regimes
  isRigorous: false,
  verdict:
    'MEASUREMENT (NOT rigorous). Regime-separated stability diagnostic on the imp-34543 q2/q3 ' +
    'drift-residual attribution [C_th = C_q2 + C_q3, C_q2 = -q2/(2 q1^2), C_q3 = q3/(6 q1^2), ' +
    'q1,q2,q3 the inherited central differences of q = log E_coll in log N], measured separately ' +
    'in the sigma -> 1 deep tail (N >= N* ~ 4.62e13, imp-33620 sigma < 0.01) vs the mid-range ' +
    '(N < N*). (F1) The ~98%/~2% split does NOT break down as sigma -> 1: in BOTH regimes q2 stays ' +
    'dominant (~98%) and q3 the ~2% minority (q3 share ~0.021..0.023 mid, ~0.015..0.022 deep) -- it ' +
    'never inverts, collapses, or blows up. (F2) But the q3 share DRIFTS DOWN into the tail: at the ' +
    'parents operating step dp = 1e-3 the deep-group mean q3 share (~0.0174) is ~21% below the ' +
    'mid-group mean (~0.0219), and the deep-group relative range balloons to ~36% (vs ~10% mid). ' +
    '(F3) Most of that extra deep-tail instability is FINITE-DIFFERENCE CONDITIONING, not a regime ' +
    'break: at a better-conditioned dp = 2e-3 the deep-vs-mid drift shrinks from ~21% to ~8% and the ' +
    'deep-group relative range collapses from ~36% back to ~7% (~mid-range level, a ~5x drop) -- ' +
    'the 4-point q3 difference sitting nearer its roundoff floor at high N, the same truncation-vs-' +
    'roundoff floor imp-34566 F3 found. So the intrinsic drift is a mild, monotone ~8% decline of ' +
    'the q3 share toward the tail (q2 creeping up correspondingly), and the q4-bearing O(h^4) term ' +
    'stays negligible (~1e-6 of the O(h^2) term) in BOTH regimes. CONCLUSION: the ~98%/~2% ' +
    'attribution is regime-stable in ORDER and does NOT collapse as sigma -> 1; the third-derivative ' +
    'share drifts mildly downward, and the extra deep-tail scatter is finite-difference conditioning, ' +
    'not a genuine regime break. q1,q2,q3 are inherited central differences, NOT fresh analytic ' +
    'closed forms, so the sigma -> 1 deep-tail regime (imp-3220/imp-3406 component model least ' +
    'trustworthy) is inherited as-is -- this diagnoses that regime, it does not rehabilitate it. ' +
    'The -2 asymptote and C_C = (1/8)sqrt(3 pi) (imp-2714, C_H = 1/8) ansatz are UNTOUCHED; the ' +
    'C_mb GUE-conditional share per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no ' +
    'bound; no operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34543 (q2/q3 shares as ladder aggregates, split re-measured by regime here); imp-34566 (q4 ' +
    'O(h^4) negligibility + finite-difference floor F3); imp-34531 (F2 O(h^2) coefficient ' +
    'certification); imp-34486 (closed-form drift x = -2 g/(1-g)); imp-34446 (central-difference ' +
    'exponent); imp-33620 (deep-tail landmark N* ~ 4.62e13, sigma < 0.01); imp-2714 (C_C ansatz); ' +
    'imp-486 (C_mb).',
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP34573_ASSERTIONS = [
  {
    id: 'imp34573-q2-dominant-in-both-regimes',
    holds: () =>
      [...MID_ROWS, ...DEEP_ROWS].every((r) => r.q2_share > 0.95 && r.q3_share > 0.01 && r.q3_share < 0.03),
    why: 'F1: q2 stays dominant (~98%) and q3 the ~2% minority (0.01..0.03) at every landmark in BOTH regimes -- the split does not break down as sigma -> 1.',
  },
  {
    id: 'imp34573-shares-sum-to-one',
    holds: () => [...MID_ROWS, ...DEEP_ROWS].every((r) => Math.abs(r.q2_share + r.q3_share - 1) < 1e-4),
    why: 'C_th = C_q2 + C_q3 is an exact additive split, so the two shares sum to 1 at every landmark.',
  },
  {
    id: 'imp34573-q3-share-drifts-down-into-tail',
    holds: () => DEEP_OP.mean < MID_OP.mean && DRIFT_OP < 0,
    why: 'F2: the deep-group mean q3 share sits below the mid-group mean -- the third-derivative share drifts DOWN as sigma -> 1.',
  },
  {
    id: 'imp34573-deeptail-scatter-is-conditioning-not-regime',
    holds: () =>
      DEEP_OP.relRange > DEEP_WC.relRange &&
      DEEP_RANGE_CONDITIONING_FACTOR > 2 &&
      Math.abs(DRIFT_WC) < Math.abs(DRIFT_OP),
    why: 'F3: better-conditioning the q-derivative step (dp = 2e-3) collapses the deep-group range and shrinks the drift -- the extra deep-tail instability is finite-difference conditioning, not a regime break.',
  },
  {
    id: 'imp34573-intrinsic-drift-is-mild',
    holds: () => Math.abs(DRIFT_WC) < 0.15,
    why: 'F3: the well-conditioned deep-vs-mid drift is a mild ~8% (< 15%) decline -- the ~98%/~2% attribution is regime-stable in order.',
  },
  {
    id: 'imp34573-q4-negligible-in-both-regimes',
    holds: () => MAX_Q4_REL < 1e-4,
    why: 'The q4-bearing O(h^4) term stays ~1e-6 of the O(h^2) term across BOTH regimes -- adding q4 changes neither picture (ties imp-34566 F1).',
  },
  {
    id: 'imp34573-honesty-gate-no-qed',
    holds: () =>
      IMP34573_DRIFT_SHARE_DEEPTAIL_VS_MIDRANGE.isRigorous === false &&
      /NO QED/.test(IMP34573_DRIFT_SHARE_DEEPTAIL_VS_MIDRANGE.verdict) &&
      /refereed bound is changed/i.test(IMP34573_DRIFT_SHARE_DEEPTAIL_VS_MIDRANGE.verdict) &&
      /UNTOUCHED/.test(IMP34573_DRIFT_SHARE_DEEPTAIL_VS_MIDRANGE.verdict),
    why: 'Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.',
  },
];

for (const assertion of IMP34573_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-34573-drift-residual-share-deeptail-vs-midrange assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP34573_DRIFT_SHARE_DEEPTAIL_VS_MIDRANGE;
