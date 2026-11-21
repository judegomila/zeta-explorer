/**
 * @module imp-34630-plateau-drift-large-dp-scaling-order
 * @fileoverview imp-34630 -- MEASUREMENT ONLY: does the imp-34611 F2 large-dp drift SPREAD actually
 *   scale as the O(dp^4) truncation law the stencil order predicts, or is it a plateau sitting on a
 *   roundoff valley? imp-34611 F2 reported that on the large-dp tail dp = 1.5e-2 .. 3e-1 the 4th-order
 *   7-point stencil q3-share drift spread is ~2.2e-5, about 2x flatter than the 2nd-order ~4.5e-5, and
 *   read that flatness as "exactly as expected from its lower truncation error, so the plateau is a
 *   genuine roundoff-free intrinsic." But F2 never checked that the residual large-dp drift actually
 *   FOLLOWS the O(dp^4) truncation power law (nor the O(dp^2) law for the 2nd-order stencil). This
 *   module fits the LOCAL scaling exponent of the residual drift across geometric sub-brackets of
 *   dp = 1.5e-2 .. 3e-1 and asks whether the exponent matches the stencil-order prediction.
 *
 *   METHOD (D_inf-free local order estimate)
 *   ----------------------------------------
 *   Reusing the imp-34611 q3-share stencils and drift definition VERBATIM (reproduced inline; imports
 *   NOTHING), the residual drift is modelled as drift(dp) = D_inf + A dp^k + higher order. For a
 *   geometric triple {dp, r dp, r^2 dp} the additive D_inf cancels in the successive-difference ratio
 *     rho = [drift(r^2 dp) - drift(r dp)] / [drift(r dp) - drift(dp)] = r^k (+ higher order),
 *   so the LOCAL order k = ln(rho)/ln(r) needs no knowledge of the plateau value D_inf. We sweep this
 *   across the sub-brackets of dp = 1.5e-2 .. 3e-1 for both stencils and compare to the predicted
 *   k = 2 (2nd-order 5-point) and k = 4 (4th-order 7-point).
 *
 *   THE FINDING (plateau confirmed, but the F2 mechanism is REFINED, not a resolved O(dp^4) slope)
 *   --------------------------------------------------------------------------------------------
 *   (F1) THE 2nd-ORDER STENCIL RESOLVES ITS O(dp^2) TRUNCATION ON THE LARGE-dp ARM. Over the largest
 *        sub-brackets the local order estimate climbs monotonically toward 2: rho-order ~1.74 on the
 *        r = 2 triple {6e-2, 1.2e-1, 2.4e-1} and ~1.94 on {7.5e-2, 1.5e-1, 3e-1} -- consistent with
 *        the O(dp^2) truncation prediction (the shortfall below 2 is the expected higher-order
 *        contamination that only vanishes as dp -> 0, which we cannot approach without re-entering the
 *        roundoff valley). The 2nd-order residual GROWS with dp -- a real, resolved truncation drift.
 *   (F2) THE 4th-ORDER STENCIL SHOWS NO RESOLVABLE O(dp^4) DRIFT -- ITS LARGE-dp TAIL IS A FLAT
 *        PLATEAU AT THE ~2e-6 NOISE FLOOR. Across dp >= 3e-2 the 4th-order drift spread is only
 *        ~2.0e-6 (vs the 2nd-order ~3.2e-5 over the same range), and the successive-difference ratios
 *        are sign-indefinite (opposite signs on adjacent triples), giving order estimates that are
 *        noise (NaN / ~ -5), NOT ~4. The genuine O(dp^4) truncation term is BELOW the double-precision
 *        + inherited-model noise floor over the entire tail, so there is no truncation power law to fit.
 *   (F3) THE F2 "~2.2e-5 SPREAD" IS A SMALL-dp ROUNDOFF ARTIFACT, NOT A LARGE-dp TRUNCATION SLOPE. On
 *        the imp-34611 tail grid the full 4th-order spread ~2.25e-5 has BOTH its extremes at the two
 *        SMALLEST steps dp in {1.5e-2, 2e-2} -- the roundoff valley, not large dp. Restricting to
 *        dp >= 3e-2 collapses the spread to ~2.0e-6. So imp-34611 F2 is CONFIRMED in its conclusion
 *        (the drift is a genuine plateau, not slow truncation drift) but its stated MECHANISM is
 *        corrected: the 4th-order flatness is NOT a smaller-but-visible O(dp^4) slope; the O(dp^4)
 *        truncation is undetectable, and the reported 2.2e-5 spread is dominated by the small-dp
 *        roundoff valley. The plateau-vs-truncation distinction the ticket asks for resolves as
 *        PLATEAU (flat tail, no O(dp^4) signature), while only the 2nd-order stencil resolves a real
 *        O(dp^2) truncation drift on its large-dp arm.
 *
 *   MEASUREMENT ONLY. This re-aggregates the already-certified imp-34611 decomposition through a local
 *   scaling-exponent fit; it changes NO bound. Reproduces the imp-34446/imp-34531/imp-34543/imp-34573
 *   primitives inline (imports NOTHING -- no lambda-rh-height-mapping, no polymath15 constant module,
 *   no zeros bundle), following the no-heavy-imports directive. q1,q2,q3 are inherited central
 *   differences, NOT fresh analytic closed forms, so the sigma -> 1 deep-tail regime (imp-3220/imp-3406
 *   component model least trustworthy) is inherited as-is. The -2 asymptote and C_C = (1/8)sqrt(3 pi)
 *   (imp-2714, C_H = 1/8) ansatz are UNTOUCHED; the C_mb GUE-conditional share per imp-486 is
 *   UNTOUCHED; imp-3066 K_a >= 0 untouched; the inherited surrogate is NOT rigorous; no operator
 *   positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 *   @see imp-34611-plateau-drift-independent-stencil-crosscheck.js (F2 large-dp spread scrutinised here)
 *   @see imp-34626-plateau-drift-sixth-order-stencil-crosscheck.js (higher-order stencil cross-check)
 *   @see imp-34593-drift-share-error-optimal-dp-fit.js (the plateau ~ -0.0968 confirmed as a plateau)
 *   @see imp-33620-etrunc-ecoll-ladder-1e15-extension.js (deep-tail landmark N* ~ 4.62e13, sigma<0.01)
 *
 *   Ticket: imp-34630 (numerical, medium). Local scaling-exponent fit of the F2 tail; adds no bound.
 */

// -- INDEPENDENT instance of the imp-34446/imp-34531/imp-34543/imp-34573 primitives (imports NOTHING),
//    reproduced VERBATIM from imp-34611 so the stencils and q3-share are identical: --
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

// imp-34611 2nd-order 5-point central-difference q3-share (verbatim; q1^2 cancels).
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

// imp-34611 4th-order-accurate 7-point central-difference q3-share (verbatim).
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

// Same MID/DEEP landmark partition and drift as imp-34573/imp-34587/imp-34593/imp-34611.
const MID_LADDER = [Math.pow(10, 12.0), Math.pow(10, 12.5), Math.pow(10, 13.0), Math.pow(10, 13.333)];
const DEEP_LADDER = [DEEP_TAIL_N, Math.pow(10, 14.0), Math.pow(10, 14.5), Math.pow(10, 15.0)];

const mean = (vals) => vals.reduce((a, b) => a + b, 0) / vals.length;

function driftAt(share, dp) {
  const midMean = mean(MID_LADDER.map((N) => share(N, dp)));
  const deepMean = mean(DEEP_LADDER.map((N) => share(N, dp)));
  return (deepMean - midMean) / midMean;
}

// D_inf-free local order estimate on a geometric triple {a, ra, r^2 a}:
//   rho = [drift(r^2 a) - drift(r a)] / [drift(r a) - drift(a)]  ->  r^k, so order = ln(rho)/ln(r).
// Returns NaN when rho <= 0 (non-monotone / sign-indefinite -> no single power law here).
function localOrder(share, a, r) {
  const da = driftAt(share, a);
  const db = driftAt(share, r * a);
  const dc = driftAt(share, r * r * a);
  const rho = (dc - db) / (db - da);
  return rho > 0 ? Math.log(rho) / Math.log(r) : NaN;
}

// (F1) 2nd-order large-dp arm: local order estimates on the two largest r=2 triples.
const ORDER_2ND_ARM_A = localOrder(share2nd, 6e-2, 2); // triple {6e-2, 1.2e-1, 2.4e-1} -> ~1.74
const ORDER_2ND_ARM_B = localOrder(share2nd, 7.5e-2, 2); // triple {7.5e-2, 1.5e-1, 3e-1} -> ~1.94
const ORDER_2ND_PREDICTED = 2; // O(dp^2) truncation of the 2nd-order 5-point stencil

// (F2) 4th-order large-dp arm: same triples -- expected ~4 if truncation-limited; in fact noise.
const ORDER_4TH_ARM_A = localOrder(share4th, 6e-2, 2); // sign-indefinite -> NaN
const ORDER_4TH_ARM_B = localOrder(share4th, 7.5e-2, 2); // sign-indefinite -> ~ -4.9 (noise, not ~4)
const ORDER_4TH_PREDICTED = 4; // O(dp^4) truncation of the 4th-order 7-point stencil (undetectable)

// Flat-tail spread over dp >= 3e-2 (past the small-dp roundoff valley): the truncation-drift signal.
const FLAT_TAIL_STEPS = [3e-2, 5e-2, 8e-2, 1e-1, 1.5e-1, 2e-1, 3e-1];
const flatTail = (share) => {
  const d = FLAT_TAIL_STEPS.map((dp) => driftAt(share, dp));
  return Math.max(...d) - Math.min(...d);
};
const FLAT_TAIL_SPREAD_2ND = flatTail(share2nd); // ~3.2e-5 (2nd-order truncation still growing)
const FLAT_TAIL_SPREAD_4TH = flatTail(share4th); // ~2.0e-6 (4th-order flat at the noise floor)

// (F3) imp-34611 full tail grid: locate the extremes of the 4th-order 2.2e-5 spread.
const IMP34611_TAIL_STEPS = [1.5e-2, 2e-2, 3e-2, 5e-2, 8e-2, 1e-1, 1.5e-1, 2e-1, 3e-1];
const tail4Full = IMP34611_TAIL_STEPS.map((dp) => driftAt(share4th, dp));
const FULL_TAIL_SPREAD_4TH = Math.max(...tail4Full) - Math.min(...tail4Full); // ~2.25e-5 (matches F2)
const dpAtMin4 = IMP34611_TAIL_STEPS[tail4Full.indexOf(Math.min(...tail4Full))]; // 1.5e-2
const dpAtMax4 = IMP34611_TAIL_STEPS[tail4Full.indexOf(Math.max(...tail4Full))]; // 2e-2
// Both extremes sit at the two smallest steps -- the spread is a small-dp roundoff artifact.
const SPREAD_EXTREMES_BOTH_SMALL_DP = dpAtMin4 <= 2e-2 && dpAtMax4 <= 2e-2;

// Per-sub-bracket local-order table (geometric r=2 triples across dp = 1.5e-2 .. 3e-1).
const ORDER_ROWS = [1.5e-2, 3e-2, 6e-2, 7.5e-2].map((a) => ({
  triple: `${(+a.toExponential(2))}..${(+(4 * a).toExponential(2))}`,
  order_2nd: Number.isFinite(localOrder(share2nd, a, 2)) ? +localOrder(share2nd, a, 2).toFixed(3) : null,
  order_4th: Number.isFinite(localOrder(share4th, a, 2)) ? +localOrder(share4th, a, 2).toFixed(3) : null,
}));

export const IMP34630_PLATEAU_DRIFT_LARGE_DP_SCALING_ORDER = Object.freeze({
  id: 'imp-34630',
  proofSection: 'S-frontier',
  claim_measured:
    'Fit the LOCAL scaling exponent of the residual large-dp drift across geometric sub-brackets of ' +
    'dp = 1.5e-2 .. 3e-1 for the imp-34611 q3-share stencils and assess whether it matches the ' +
    'O(dp^4) truncation prediction for the 4th-order stencil (and O(dp^2) for the 2nd-order), ' +
    'distinguishing a genuine plateau from slow truncation drift -- a cross-check on the inherited ' +
    'component model, not a bound.',
  deep_tail_boundary_N: DEEP_TAIL_N,
  C_C_inline: +C_C.toFixed(6),
  method: 'D_inf-free geometric-triple order rho = ln([d3-d2]/[d2-d1])/ln(r), r = 2',
  order_2nd_predicted: ORDER_2ND_PREDICTED,
  order_2nd_large_dp_arm_a: +ORDER_2ND_ARM_A.toFixed(3), // ~1.739 (triple 6e-2..2.4e-1)
  order_2nd_large_dp_arm_b: +ORDER_2ND_ARM_B.toFixed(3), // ~1.938 (triple 7.5e-2..3e-1)
  order_4th_predicted: ORDER_4TH_PREDICTED,
  order_4th_large_dp_arm_a: Number.isFinite(ORDER_4TH_ARM_A) ? +ORDER_4TH_ARM_A.toFixed(3) : null, // NaN -> null
  order_4th_large_dp_arm_b: Number.isFinite(ORDER_4TH_ARM_B) ? +ORDER_4TH_ARM_B.toFixed(3) : null, // ~ -4.92
  flat_tail_steps: Object.freeze(FLAT_TAIL_STEPS.slice()),
  flat_tail_spread_2nd_order: +FLAT_TAIL_SPREAD_2ND.toExponential(3), // ~3.168e-5 (truncation resolved)
  flat_tail_spread_4th_order: +FLAT_TAIL_SPREAD_4TH.toExponential(3), // ~2.029e-6 (flat, noise floor)
  imp34611_full_tail_spread_4th: +FULL_TAIL_SPREAD_4TH.toExponential(3), // ~2.25e-5 (reproduces F2)
  full_tail_spread_4th_dp_at_min: +dpAtMin4.toExponential(2), // 1.5e-2
  full_tail_spread_4th_dp_at_max: +dpAtMax4.toExponential(2), // 2e-2
  spread_extremes_both_small_dp: SPREAD_EXTREMES_BOTH_SMALL_DP, // true -> spread is a small-dp artifact
  order_rows: Object.freeze(ORDER_ROWS.map((r) => Object.freeze(r))),
  isRigorous: false,
  verdict:
    'MEASUREMENT (NOT rigorous). Local scaling-exponent fit of the imp-34611 F2 large-dp drift over ' +
    'geometric sub-brackets of dp = 1.5e-2 .. 3e-1, via the D_inf-free triple ratio rho = ' +
    'ln([d3-d2]/[d2-d1])/ln(r). (F1) The 2nd-order stencil RESOLVES its O(dp^2) truncation on the ' +
    'large-dp arm: the local order climbs to ~1.74 (triple 6e-2..2.4e-1) then ~1.94 (7.5e-2..3e-1), ' +
    'consistent with the predicted 2 (the shortfall is higher-order contamination that only clears as ' +
    'dp -> 0), and its flat-tail spread over dp >= 3e-2 is ~3.2e-5 -- a real, resolved truncation ' +
    'drift. (F2) The 4th-order stencil shows NO resolvable O(dp^4) drift: over dp >= 3e-2 its spread ' +
    'is only ~2.0e-6 (~15x smaller than the 2nd-order over the same range) and the triple ratios are ' +
    'sign-indefinite, giving order estimates that are noise (NaN / ~ -4.9), NOT ~4 -- the O(dp^4) ' +
    'truncation term lies BELOW the double-precision + inherited-model noise floor across the tail, so ' +
    'there is no power law to fit. (F3) The imp-34611 F2 ~2.2e-5 spread is a SMALL-dp roundoff ' +
    'artifact, not a large-dp truncation slope: on the F2 tail grid the full 4th-order spread ' +
    '(~2.25e-5) has BOTH extremes at the two smallest steps dp in {1.5e-2, 2e-2}, and restricting to ' +
    'dp >= 3e-2 collapses it to ~2.0e-6. CONCLUSION: the plateau-vs-truncation question resolves as a ' +
    'genuine PLATEAU (flat 4th-order tail, no O(dp^4) signature), CONFIRMING imp-34611 F2 conclusion ' +
    'while CORRECTING its mechanism -- the 4th-order flatness is not a smaller-but-visible O(dp^4) ' +
    'slope but an undetectable one, and the reported spread is dominated by the small-dp roundoff ' +
    'valley; only the 2nd-order stencil resolves a real O(dp^2) truncation drift on its large-dp arm. ' +
    'q1,q2,q3 are inherited central differences, NOT fresh analytic closed forms, so the sigma -> 1 ' +
    'deep-tail regime (imp-3220/imp-3406 component model least trustworthy) is inherited as-is -- this ' +
    'cross-checks that regime, it does not rehabilitate it. The -2 asymptote and C_C = (1/8)sqrt(3 pi) ' +
    '(imp-2714, C_H = 1/8) ansatz are UNTOUCHED; the C_mb GUE-conditional share per imp-486 is ' +
    'UNTOUCHED; imp-3066 K_a >= 0 untouched; the inherited surrogate is NOT rigorous; changes no ' +
    'bound; no operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34611 (F2 large-dp spread ~2.2e-5, scrutinised here); imp-34626 (sixth-order stencil ' +
    'cross-check); imp-34593 (roundoff-free plateau drift ~ -0.0968); imp-34587 (Richardson dp -> 0 ' +
    'intrinsic, the roundoff dip); imp-34573 (deep-tail q3-share error, 2nd-order stencil); imp-34543 ' +
    '(q2/q3 shares as ladder aggregates); imp-34531 (F2 O(h^2) coefficient certification); imp-34446 ' +
    '(central-difference exponent); imp-33620 (deep-tail landmark N* ~ 4.62e13, sigma < 0.01); ' +
    'imp-2714 (C_C ansatz); imp-486 (C_mb).',
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP34630_ASSERTIONS = [
  {
    id: 'imp34630-2nd-order-arm-resolves-O-dp2',
    holds: () =>
      Number.isFinite(ORDER_2ND_ARM_A) &&
      Number.isFinite(ORDER_2ND_ARM_B) &&
      ORDER_2ND_ARM_A > 1.4 &&
      ORDER_2ND_ARM_B > 1.7 &&
      ORDER_2ND_ARM_B < 2.4 &&
      ORDER_2ND_ARM_B > ORDER_2ND_ARM_A, // order climbs toward 2 as dp grows
    why: 'F1: on the large-dp arm the 2nd-order stencil order climbs ~1.74 -> ~1.94, consistent with the O(dp^2) truncation prediction -- a real, resolved truncation drift.',
  },
  {
    id: 'imp34630-4th-order-tail-flat-no-O-dp4',
    holds: () =>
      FLAT_TAIL_SPREAD_4TH < 5e-6 &&
      FLAT_TAIL_SPREAD_4TH < FLAT_TAIL_SPREAD_2ND / 5 && // 4th tail >=5x flatter over dp >= 3e-2
      !(Number.isFinite(ORDER_4TH_ARM_A) && ORDER_4TH_ARM_A > 3 && ORDER_4TH_ARM_A < 5) &&
      !(Number.isFinite(ORDER_4TH_ARM_B) && ORDER_4TH_ARM_B > 3 && ORDER_4TH_ARM_B < 5),
    why: 'F2: over dp >= 3e-2 the 4th-order drift is flat to ~2e-6 (>=5x flatter than the 2nd-order) and its local order estimates are noise, NOT ~4 -- the O(dp^4) truncation is below the noise floor, so no power law to fit.',
  },
  {
    id: 'imp34630-F2-spread-is-small-dp-artifact',
    holds: () =>
      FULL_TAIL_SPREAD_4TH > 1e-5 && // reproduces the imp-34611 F2 ~2.2e-5 spread
      SPREAD_EXTREMES_BOTH_SMALL_DP && // both extremes at dp <= 2e-2
      FLAT_TAIL_SPREAD_4TH < FULL_TAIL_SPREAD_4TH / 5, // dropping small-dp collapses it >=5x
    why: 'F3: the imp-34611 F2 ~2.2e-5 spread has both extremes at the two smallest steps (dp <= 2e-2) and collapses >=5x once dp >= 3e-2 -- a small-dp roundoff artifact, not a large-dp truncation slope.',
  },
  {
    id: 'imp34630-honesty-gate-no-qed',
    holds: () =>
      IMP34630_PLATEAU_DRIFT_LARGE_DP_SCALING_ORDER.isRigorous === false &&
      /NO QED/.test(IMP34630_PLATEAU_DRIFT_LARGE_DP_SCALING_ORDER.verdict) &&
      /refereed bound is changed/i.test(IMP34630_PLATEAU_DRIFT_LARGE_DP_SCALING_ORDER.verdict) &&
      /UNTOUCHED/.test(IMP34630_PLATEAU_DRIFT_LARGE_DP_SCALING_ORDER.verdict),
    why: 'Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.',
  },
];

for (const assertion of IMP34630_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-34630-plateau-drift-large-dp-scaling-order assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP34630_PLATEAU_DRIFT_LARGE_DP_SCALING_ORDER;
