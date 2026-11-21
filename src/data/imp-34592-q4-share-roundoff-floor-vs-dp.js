/**
 * @module imp-34592-q4-share-roundoff-floor-vs-dp
 * @fileoverview imp-34592 -- MEASUREMENT ONLY: a CONDITIONING stress-test on the imp-34573 F /
 *   imp-34566 F1 claim that the q4-bearing O(h^4) drift-residual term stays negligible (~1e-6 of
 *   the O(h^2) term) in both the mid-range and the sigma -> 1 deep tail. imp-34573/imp-34566
 *   measured that share at a FIXED q-derivative step dp = 1e-3. But the deep-tail 5-point (q4) and
 *   4-point (q3) central differences sit near their roundoff floor (imp-34566 F3), so the apparent
 *   q4 term is itself a finite-difference estimate that can be inflated by roundoff as dp shrinks.
 *   This module VARIES dp across the deep-tail landmarks (N >= N* ~ 4.62e13, imp-33620 sigma < 0.01)
 *   and reports the dp at which the q4 negligibility claim stops being trustworthy.
 *
 *   WHY THIS MATTERS (beyond imp-34573/imp-34566)
 *   ---------------------------------------------
 *   The q4-bearing O(h^4) coefficient enters ONLY through A4 = (-q2/4 + (17/72) q3 - q4/12)/q1, and
 *   q4 is a 5-point central 4th difference divided by dp^4. Rounding of q(p) = log E_coll at the
 *   ~1e-16 relative level therefore reaches the q4 estimate amplified by ~1/dp^4. imp-34573 read the
 *   share "~1e-6, negligible" off a single dp = 1e-3 evaluation and never asked how much of that is
 *   the true analytic term versus roundoff, nor how far the step can be pushed before roundoff
 *   dominates. A negligibility claim that only holds at one hand-picked dp is fragile; this module
 *   locates the dp window over which the claim is real.
 *
 *   WHAT THIS MEASUREMENT ADDS
 *   --------------------------
 *   Reusing the imp-34566/imp-34573 O(h^4) coefficient VERBATIM [C_h4 = -(1/q1)(A2^2 - A4),
 *   A2 = (-q2/2 + q3/6)/q1, A4 = (-q2/4 + (17/72) q3 - q4/12)/q1] and the same fixed measured step
 *   h = 1e-3 (so H4/H2 = 1e-6 is held constant and only the q-derivative conditioning changes), this
 *   module sweeps the q-derivative step dp across nine decades-spanning values on the four deep-tail
 *   landmarks N* .. 1e15 and reports, per dp, the deep-group MAX apparent |q4_h4_rel| share. It then
 *   locates two dp thresholds against a physical baseline (the quiet share at dp = 2e-3, where q3/q4
 *   are far from their roundoff floor):
 *     (i)   dp_estimate_untrustworthy -- the largest dp at which roundoff has already inflated the
 *           apparent share by more than 10x above the physical baseline (the q4 ESTIMATE stops being
 *           a faithful measure of the true term, even though it is still numerically tiny);
 *     (ii)  dp_false_breakdown -- the largest dp at which the inflated apparent share crosses the
 *           imp-34566/imp-34543 ~0.4% (4.41e-3) drift-residual floor, i.e. the smallest step at which
 *           roundoff would make q4 falsely APPEAR non-negligible relative to the residual it is meant
 *           to explain.
 *
 *   THE FINDING (negligibility is REAL, but only for dp >~ 1e-3; smaller steps inflate it ~1/dp^4)
 *   --------------------------------------------------------------------------------------------
 *   (F1) AT THE OPERATING AND WELL-CONDITIONED STEPS THE SHARE IS A CLEAN, PHYSICAL ~5e-7. At
 *        dp = 4e-3 and dp = 2e-3 the deep-group max |q4_h4_rel| is a stable ~5.2e-7 / ~4.8e-7 (they
 *        agree to ~10%), and at the parents operating dp = 1e-3 it is ~3.1e-6 -- still the same
 *        ~1e-6 order imp-34573/imp-34566 reported. So the "q4 negligible in the deep tail" claim is
 *        genuinely true at the steps the parents used: the O(h^4) share really is ~1e-6 of the
 *        O(h^2) term there, three-plus orders below the ~0.4% residual.
 *   (F2) BELOW dp ~ 1e-3 ROUNDOFF INFLATES THE APPARENT SHARE ~1/dp^4. Halving the step roughly
 *        multiplies the apparent share by ~16: it climbs ~4.8e-7 (dp=2e-3) -> ~3.1e-6 (1e-3) ->
 *        ~4.7e-5 (5e-4) -> ~2.9e-4 (3e-4) -> ~1.2e-3 (2e-4) -> ~1.5e-2 (1e-4), then dissolves into
 *        order-1 garbage (~1e1 at dp=2e-5) as the 5-point 4th difference collapses onto its roundoff
 *        floor. This is the q4 = (5-point difference)/dp^4 roundoff amplification, NOT a real growth
 *        of the O(h^4) term -- exactly the truncation-vs-roundoff finite-difference floor imp-34566
 *        F3 identified, now isolated on the q4 channel in the deep tail.
 *   (F3) THE q4 ESTIMATE STOPS BEING TRUSTWORTHY AT dp ~ 7e-4; IT FALSELY APPEARS NON-NEGLIGIBLE AT
 *        dp ~ 1.5e-4. The apparent share first exceeds 10x the physical baseline at dp ~ 7e-4 (the
 *        ESTIMATE ceases to track the true term there), and it first crosses the ~0.4% residual floor
 *        -- where roundoff would make q4 look like it matters -- at dp ~ 1.5e-4. Between them
 *        (7e-4 >~ dp >~ 2e-4) the estimate is roundoff-inflated yet still numerically below the
 *        residual, so the negligibility CONCLUSION survives even though the number is no longer a
 *        faithful measurement. CONCLUSION: the imp-34573/imp-34566 q4-negligibility holds robustly
 *        for dp >~ 1e-3 (a genuine physical ~5e-7 share), and one must NOT push the q-derivative
 *        step below ~7e-4 in the deep tail -- doing so inflates the apparent q4 term by roundoff and,
 *        below ~1.5e-4, would spuriously break the negligibility the parents (correctly) reported.
 *
 *   MEASUREMENT ONLY. This re-evaluates an already-certified O(h^4) coefficient at many q-derivative
 *   steps and locates the roundoff floor; it changes NO bound. Reproduces the imp-34446/imp-34531/
 *   imp-34543/imp-34566 primitives inline (imports NOTHING -- no lambda-rh-height-mapping, no
 *   polymath15 constant module, no zeros bundle), following the no-heavy-imports directive. q1..q4
 *   are the inherited central differences, NOT fresh analytic closed forms -- so the sigma -> 1
 *   deep-tail regime, where the inherited imp-3220/imp-3406 component model is least trustworthy, is
 *   inherited as-is (this diagnoses the finite-difference conditioning OF that measurement, it does
 *   not rehabilitate the model). The -2 asymptote and C_C = (1/8)sqrt(3 pi) (imp-2714, C_H = 1/8)
 *   ansatz are UNTOUCHED; the C_mb GUE-conditional share per imp-486 is UNTOUCHED; imp-3066 K_a >= 0
 *   untouched; no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 *   @see imp-34573-drift-residual-share-deeptail-vs-midrange.js (q4 negligible ~1e-6 in both regimes at dp=1e-3)
 *   @see imp-34566-drift-residual-fourth-difference-share.js (O(h^4) coefficient C_h4; FD floor F3; ~0.4% residual)
 *   @see imp-34543-drift-residual-third-derivative-share.js (q2/q3 shares; ~0.4% residual baseline)
 *   @see imp-33620-etrunc-ecoll-ladder-1e15-extension.js (deep-tail landmark N* ~ 4.62e13, sigma<0.01)
 *
 *   Ticket: imp-34592 (numerical, low). Step-conditioning stress-test on the q4 term; adds no bound.
 */

// -- INDEPENDENT instance of the imp-34446/imp-34531/imp-34543/imp-34566 primitives (imports NOTHING): --
const TWO_PI = 2 * Math.PI;
const C_C = (1 / 8) * Math.sqrt(3 * Math.PI); // imp-2714 pinned ansatz, reproduced inline (~0.383748)
const DEEP_TAIL_N = 4.624385e13; // imp-33620 sigma < 0.01 landmark N* -- the deep-tail floor

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

// Derivatives of q(p) = log E_coll in p = log N (identical construction to imp-34566/imp-34573:
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

const H_MEAS = 1e-3; // imp-34446 reference measured step -- held FIXED so only dp conditioning varies
const H2 = H_MEAS * H_MEAS; // 1e-6
const H4 = H2 * H2; // 1e-12
const RESIDUAL_FLOOR = 4.41e-3; // imp-34566/imp-34543 surviving ~0.4% drift-residual floor
const DP_PHYSICAL = 2e-3; // well-conditioned reference step -- q3/q4 far from their roundoff floor
const DP_OPERATING = 1e-3; // parents (imp-34543/imp-34566/imp-34573) operating step

// The imp-34566 O(h^4) (q4-bearing) term relative to the O(h^2) term -- q4 enters ONLY via A4.
function q4RelContribution(N, dp) {
  const { q1, q2, q3, q4 } = qDerivs(N, dp);
  const cTh = -(1 / q1) * (q2 / (2 * q1)) + (1 / q1) * (q3 / (6 * q1));
  const A2 = (-q2 / 2 + q3 / 6) / q1;
  const A4 = (-q2 / 4 + (17 / 72) * q3 - q4 / 12) / q1;
  const cH4 = -(1 / q1) * (A2 * A2 - A4);
  return (H4 * cH4) / (H2 * cTh);
}

// Deep-tail landmarks only (N >= N* ~ 4.62e13, imp-33620 sigma < 0.01) -- the regime under stress.
const DEEP_LADDER = [
  { label: 'N* (4.62e13)', N: DEEP_TAIL_N },
  { label: '1e14', N: Math.pow(10, 14.0) },
  { label: '3.16e14', N: Math.pow(10, 14.5) },
  { label: '1e15', N: Math.pow(10, 15.0) },
];

// Deep-group max |q4_h4_rel| at a given q-derivative step -- the worst-case apparent share.
function deepGroupMaxShare(dp) {
  return Math.max(...DEEP_LADDER.map(({ N }) => Math.abs(q4RelContribution(N, dp))));
}

// The physical (quiet) baseline: the share at a well-conditioned step where q3/q4 are trustworthy.
const PHYSICAL_SHARE = deepGroupMaxShare(DP_PHYSICAL); // ~4.8e-7 -- the true O(h^4) share magnitude

// dp sweep, descending -- from well-conditioned down through the roundoff floor into garbage.
const DP_SWEEP = [4e-3, 2e-3, 1e-3, 7e-4, 5e-4, 3e-4, 2e-4, 1.5e-4, 1e-4, 5e-5, 2e-5];

const SWEEP_ROWS = DP_SWEEP.map((dp) => {
  const maxShare = deepGroupMaxShare(dp);
  return {
    dp,
    deep_max_q4_h4_rel: +maxShare.toExponential(3), // apparent worst-case O(h^4) share
    inflation_vs_physical: +(maxShare / PHYSICAL_SHARE).toExponential(3), // roundoff blow-up factor
    exceeds_residual_floor: maxShare > RESIDUAL_FLOOR, // does roundoff make q4 falsely non-negligible?
  };
});

// Threshold (i): largest dp at which roundoff has inflated the apparent share by > 10x (estimate
// stops faithfully tracking the true ~5e-7 term). Sweep is descending, so the first hit is the largest.
const dpUntrustRow = SWEEP_ROWS.find((r) => r.inflation_vs_physical > 10);
const DP_ESTIMATE_UNTRUSTWORTHY = dpUntrustRow ? dpUntrustRow.dp : null; // ~7e-4

// Threshold (ii): largest dp at which the inflated apparent share crosses the ~0.4% residual floor
// -- where roundoff would spuriously make q4 look non-negligible relative to the residual it explains.
const dpFalseRow = SWEEP_ROWS.find((r) => r.exceeds_residual_floor);
const DP_FALSE_BREAKDOWN = dpFalseRow ? dpFalseRow.dp : null; // ~1.5e-4

// Sanity: the share is genuinely negligible at BOTH the well-conditioned and operating steps.
const SHARE_AT_OPERATING = deepGroupMaxShare(DP_OPERATING); // ~3.1e-6 -- still the ~1e-6 order parents saw

export const IMP34592_Q4_SHARE_ROUNDOFF_FLOOR_VS_DP = Object.freeze({
  id: 'imp-34592',
  proofSection: 'S-frontier',
  claim_measured:
    'Stress the imp-34573/imp-34566 q4-bearing O(h^4) drift-residual negligibility (~1e-6 of the ' +
    'O(h^2) term) against the finite-difference step dp in the sigma -> 1 deep tail (N >= N* ~ ' +
    '4.62e13, imp-33620 sigma < 0.01): sweep dp across the deep-tail landmarks and report the dp at ' +
    'which roundoff amplification of q4 = (5-point 4th difference)/dp^4 makes the apparent O(h^4) ' +
    'share cease to be trustworthy -- a step-conditioning diagnostic, not a bound.',
  meas_step_h: H_MEAS,
  residual_floor: RESIDUAL_FLOOR,
  dp_physical_reference: DP_PHYSICAL,
  dp_operating: DP_OPERATING,
  C_C_inline: +C_C.toFixed(6),
  physical_q4_h4_share: +PHYSICAL_SHARE.toExponential(3), // ~4.8e-7 -- the true O(h^4) share
  q4_h4_share_at_operating: +SHARE_AT_OPERATING.toExponential(3), // ~3.1e-6 -- still ~1e-6 order
  dp_sweep_rows: Object.freeze(SWEEP_ROWS.map((r) => Object.freeze(r))),
  dp_estimate_untrustworthy: DP_ESTIMATE_UNTRUSTWORTHY, // ~7e-4 -- estimate inflated > 10x here
  dp_false_breakdown: DP_FALSE_BREAKDOWN, // ~1.5e-4 -- apparent q4 falsely crosses the ~0.4% floor
  isRigorous: false,
  verdict:
    'MEASUREMENT (NOT rigorous). Step-conditioning stress-test on the imp-34573/imp-34566 claim that ' +
    'the q4-bearing O(h^4) drift-residual term stays negligible (~1e-6 of the O(h^2) term) in the ' +
    'sigma -> 1 deep tail. Holding the measured step h = 1e-3 fixed (so H4/H2 = 1e-6 is constant) and ' +
    'sweeping the q-derivative step dp across the deep-tail landmarks (N >= N* ~ 4.62e13, imp-33620 ' +
    'sigma < 0.01), with the imp-34566 O(h^4) coefficient C_h4 = -(1/q1)(A2^2 - A4) [A2 = ' +
    '(-q2/2 + q3/6)/q1, A4 = (-q2/4 + (17/72) q3 - q4/12)/q1, q4 the inherited 5-point central 4th ' +
    'difference]: (F1) at dp = 4e-3 / 2e-3 the deep-group max apparent |q4_h4_rel| is a clean, ' +
    'stable ~5e-7 and at the parents operating dp = 1e-3 it is ~3e-6 -- still the ~1e-6 order the ' +
    'parents reported, three-plus orders below the ~0.4% residual, so the negligibility is genuinely ' +
    'real at the steps they used. (F2) below dp ~ 1e-3 roundoff on q4 = (5-point difference)/dp^4 ' +
    'inflates the apparent share ~1/dp^4 (halving dp multiplies it by ~16): ~5e-7 -> ~3e-6 -> ~5e-5 ' +
    '-> ~1e-3 -> ~2e-2 down to dp = 1e-4, dissolving into order-1 garbage by dp ~ 2e-5 -- the ' +
    'truncation-vs-roundoff finite-difference floor imp-34566 F3 found, isolated on the q4 channel. ' +
    '(F3) the q4 ESTIMATE stops being trustworthy (apparent share > 10x the physical baseline) at ' +
    'dp ~ 7e-4, and roundoff first makes it FALSELY cross the ~0.4% residual floor (appearing ' +
    'non-negligible) at dp ~ 1.5e-4; between them the estimate is inflated yet still numerically ' +
    'below the residual, so the negligibility conclusion survives even where the number is no longer ' +
    'a faithful measurement. CONCLUSION: the imp-34573/imp-34566 q4-negligibility is robust for ' +
    'dp >~ 1e-3 (a genuine physical ~5e-7 share), and the q-derivative step must NOT be pushed below ' +
    '~7e-4 in the deep tail -- smaller steps inflate the apparent q4 term by roundoff and, below ' +
    '~1.5e-4, would spuriously break the negligibility the parents correctly reported. q1..q4 are ' +
    'inherited central differences, NOT fresh analytic closed forms, so the sigma -> 1 deep-tail ' +
    'regime (imp-3220/imp-3406 component model least trustworthy) is inherited as-is -- this ' +
    'diagnoses the finite-difference conditioning of that measurement, it does not rehabilitate the ' +
    'model. The -2 asymptote and C_C = (1/8)sqrt(3 pi) (imp-2714, C_H = 1/8) ansatz are UNTOUCHED; ' +
    'the C_mb GUE-conditional share per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; changes ' +
    'no bound; no operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34573 (q4 negligible ~1e-6 in both regimes at fixed dp=1e-3, stressed here); imp-34566 ' +
    '(O(h^4) coefficient C_h4 + finite-difference floor F3); imp-34543 (q2/q3 shares, ~0.4% residual ' +
    'floor); imp-34531 (F2 O(h^2) coefficient certification); imp-34486 (closed-form drift ' +
    'x = -2 g/(1-g)); imp-34446 (central-difference exponent); imp-33620 (deep-tail landmark N* ~ ' +
    '4.62e13, sigma < 0.01); imp-2714 (C_C ansatz); imp-486 (C_mb).',
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP34592_ASSERTIONS = [
  {
    id: 'imp34592-share-negligible-at-operating-and-wellconditioned-steps',
    holds: () => PHYSICAL_SHARE < 1e-5 && SHARE_AT_OPERATING < 1e-4,
    why: 'F1: at dp = 2e-3 (physical) and dp = 1e-3 (operating) the deep-group q4 share is a clean ~1e-6-order term -- the imp-34573/imp-34566 negligibility is real at the steps they used.',
  },
  {
    id: 'imp34592-roundoff-inflates-apparent-share-as-dp-shrinks',
    holds: () => {
      const small = SWEEP_ROWS.find((r) => r.dp === 1e-4);
      return small && small.deep_max_q4_h4_rel > 100 * PHYSICAL_SHARE;
    },
    why: 'F2: at dp = 1e-4 the apparent q4 share is inflated far above the physical baseline -- roundoff on q4 = (5-point difference)/dp^4, not a real growth of the O(h^4) term.',
  },
  {
    id: 'imp34592-inflation-is-monotone-through-the-conditioned-window',
    holds: () => {
      const wc = SWEEP_ROWS.find((r) => r.dp === 2e-3);
      const op = SWEEP_ROWS.find((r) => r.dp === 1e-3);
      const s5 = SWEEP_ROWS.find((r) => r.dp === 5e-4);
      const s2 = SWEEP_ROWS.find((r) => r.dp === 2e-4);
      return wc.deep_max_q4_h4_rel < op.deep_max_q4_h4_rel &&
        op.deep_max_q4_h4_rel < s5.deep_max_q4_h4_rel &&
        s5.deep_max_q4_h4_rel < s2.deep_max_q4_h4_rel;
    },
    why: 'F2: the apparent share rises monotonically as dp is halved from 2e-3 down to 2e-4 -- the ~1/dp^4 roundoff amplification of the 5-point 4th difference.',
  },
  {
    id: 'imp34592-estimate-untrustworthy-threshold-located',
    holds: () => DP_ESTIMATE_UNTRUSTWORTHY !== null && DP_ESTIMATE_UNTRUSTWORTHY <= 1e-3 && DP_ESTIMATE_UNTRUSTWORTHY >= 2e-4,
    why: 'F3: the largest dp at which roundoff inflates the apparent share > 10x above the physical baseline sits at ~7e-4 -- the q4 estimate ceases to be a faithful measurement there.',
  },
  {
    id: 'imp34592-false-breakdown-below-untrustworthy-and-operating-safe',
    holds: () =>
      DP_FALSE_BREAKDOWN !== null &&
      DP_FALSE_BREAKDOWN < DP_ESTIMATE_UNTRUSTWORTHY &&
      DP_FALSE_BREAKDOWN < DP_OPERATING &&
      DP_PHYSICAL > DP_ESTIMATE_UNTRUSTWORTHY,
    why: 'F3: the apparent q4 share first crosses the ~0.4% residual floor at a dp strictly smaller than the untrustworthy threshold and well below the operating step -- so the parents dp = 1e-3 and the well-conditioned dp = 2e-3 both stay safe.',
  },
  {
    id: 'imp34592-honesty-gate-no-qed',
    holds: () =>
      IMP34592_Q4_SHARE_ROUNDOFF_FLOOR_VS_DP.isRigorous === false &&
      /NO QED/.test(IMP34592_Q4_SHARE_ROUNDOFF_FLOOR_VS_DP.verdict) &&
      /refereed bound is changed/i.test(IMP34592_Q4_SHARE_ROUNDOFF_FLOOR_VS_DP.verdict) &&
      /UNTOUCHED/.test(IMP34592_Q4_SHARE_ROUNDOFF_FLOOR_VS_DP.verdict),
    why: 'Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.',
  },
];

for (const assertion of IMP34592_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-34592-q4-share-roundoff-floor-vs-dp assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP34592_Q4_SHARE_ROUNDOFF_FLOOR_VS_DP;
