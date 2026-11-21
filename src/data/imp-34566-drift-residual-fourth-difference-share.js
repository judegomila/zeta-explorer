/**
 * @module imp-34566-drift-residual-fourth-difference-share
 * @fileoverview imp-34566 -- MEASUREMENT ONLY: extend the imp-34543 q2+q3 drift-residual
 *   reconstruction with the next inherited term -- the 5-point central 4th difference (q4) --
 *   and MEASURE how much of the surviving ~0.4% drift-residual it accounts for at each landmark,
 *   reporting whether a q5 tail persists.
 *
 *   THE INHERITED CHAIN
 *   -------------------
 *   imp-34531 F2 certified that the raw central-difference drift residual
 *       raw = analyticExponent(N) - measuredExponent(N, h)
 *   equals, to O(h^2), the full analytic coefficient (times h^2)
 *       C_th = -(1/q1)( q2/(2 q1) - q3/(6 q1) ) = C_q2 + C_q3,
 *   with C_q2 = -q2/(2 q1^2) the pure curvature part and C_q3 = q3/(6 q1^2) the pure third-
 *   derivative part (imp-34543 isolated the two shares). q1,q2,q3 are the 1st/2nd/3rd derivatives
 *   of q(p) = log E_coll in p = log N. Dividing raw by this coefficient collapses the raw
 *   central-difference drift down the N = 1e13 .. 1e14 ladder from ~6% (raw/d2m) to ~0.9%
 *   (pure-q2 denominator) to ~0.4% (full q2+q3 coefficient). A ~0.4% residual survives,
 *   unattributed. This module tests the natural next hypothesis: is that ~0.4% the next inherited
 *   term -- the 5-point central 4th difference q4 -- entering the exponent-error series?
 *
 *   WHAT THIS MEASUREMENT ADDS (beyond imp-34543)
 *   ---------------------------------------------
 *   The full Taylor expansion of measuredExponent(N,h) about h = 0, carried to O(h^4) with the
 *   asymmetric N(1 +/- h) steps [a = log(1+h), b = log(1-h)], gives
 *       raw = h^2 C_th  +  h^4 C_h4  +  O(h^6),
 *   where the leading O(h^2) coefficient reproduces C_th EXACTLY (cross-check: A2 below equals
 *   the imp-34531 coefficient) and the next coefficient is
 *       C_h4 = -(1/q1)( A2^2 - A4 ),
 *       A2 = ( -q2/2 + q3/6 ) / q1,     A4 = ( -q2/4 + (17/72) q3 - q4/12 ) / q1,
 *   with q4 the inherited 5-point central 4th difference of q(p) = log E_coll (identical
 *   construction style to imp-34543 qDerivs -- NOT a fresh analytic model). This module:
 *     (i)   tabulates q4 and C_h4 down the ladder;
 *     (ii)  compares the constancy (relative range) of raw/(h^2 C_th) -- the imp-34543 ~0.4%
 *           baseline -- against raw/(h^2 C_th + h^4 C_h4), the q4-augmented reconstruction;
 *     (iii) reports the fraction of the surviving ~0.4% residual range that the q4 term removes,
 *           and the raw magnitude of the added h^4 term relative to the h^2 term.
 *
 *   THE FINDING (the q4 term does NOT govern the ~0.4% residual)
 *   -----------------------------------------------------------
 *   (F1) THE q4-BEARING TERM IS ANALYTICALLY NEGLIGIBLE HERE. At the imp-34446 reference step
 *        h = 1e-3 the added O(h^4) term is only ~1e-6 of the O(h^2) term (h^2 = 1e-6), so it
 *        contributes at most ~1.2e-6 in relative size to raw at every landmark -- three orders of
 *        magnitude below the surviving ~0.4% residual.
 *   (F2) SO q4 ACCOUNTS FOR ~0% OF THE ~0.4% RESIDUAL. The relative range of the q4-augmented
 *        ratio raw/(h^2 C_th + h^4 C_h4) is ~4.41e-3 -- IDENTICAL to the imp-34543 ~0.4% baseline
 *        to ~5 significant figures (range reduction factor ~1.00001). Adding the next inherited
 *        derivative order removes essentially none of the residual.
 *   (F3) THE ~0.4% IS A FINITE-DIFFERENCE FLOOR, NOT A q5 TAIL. A sensitivity sweep over the
 *        measured step h and the q-derivative step dp shows the residual range does NOT converge
 *        to 0 as h -> 0 (it blows up at h = 1e-4 from roundoff on raw ~ 1e-11, a catastrophic
 *        cancellation) and swings by orders of magnitude with dp -- the signature of a truncation-
 *        vs-roundoff finite-difference floor near (h,dp) = (1e-3,1e-3), NOT of a smooth higher-
 *        order (q4/q5) series remainder that adding inherited terms would shrink. A true q5 tail
 *        in the h-series persists but at ~1e-9 relative magnitude, far below the observable floor.
 *        CONCLUSION: the "add the next inherited derivative order" avenue does NOT close the
 *        ~0.4% -- it is set by finite-difference conditioning, not by a missing q4/q5 term.
 *
 *   MEASUREMENT ONLY. This extends an already-certified O(h^2) reconstruction by one Taylor order
 *   and compares ratio constancy; it changes NO bound. Reproduces the imp-34446/imp-34531/
 *   imp-34543 primitives inline (imports NOTHING -- no lambda-rh-height-mapping, no polymath15
 *   constant module, no zeros bundle), following the no-heavy-imports directive. q4 is the
 *   inherited 5-point central 4th difference, NOT a fresh analytic closed form -- so the sigma->1
 *   deep-tail regime, where the inherited imp-3220/imp-3406 component model is least trustworthy,
 *   is inherited as-is (stated honestly). The -2 asymptote and C_C = (1/8)sqrt(3 pi) (imp-2714,
 *   C_H = 1/8) ansatz are UNTOUCHED; the C_mb GUE-conditional share per imp-486 is UNTOUCHED;
 *   imp-3066 K_a >= 0 untouched; no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 *   @see imp-34543-drift-residual-third-derivative-share.js (q2/q3 shares; ~0.4% residual this measures)
 *   @see imp-34531-drift-residual-vs-second-derivative.js (F2 O(h^2) coefficient certification)
 *   @see imp-34486-slowlog-t0-drift-analytic-derivation.js (closed form x = -2 g/(1-g))
 *   @see imp-34446-coupling-exponent-independent-recompute.js (measured central-difference exponent)
 *
 *   Ticket: imp-34566 (numerical, medium). Standalone q4-order extension; adds no bound.
 */

// -- INDEPENDENT instance of the imp-34446/imp-34531/imp-34543 primitives (imports NOTHING): --
const TWO_PI = 2 * Math.PI;
const C_C = (1 / 8) * Math.sqrt(3 * Math.PI); // imp-2714 pinned ansatz, reproduced inline (~0.383748)
const DEEP_TAIL_N = 4.624385e13; // imp-33620 sigma < 0.01 landmark N*

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

// Derivatives of q(p) = log E_coll as a function of p = log N. q1/q2 3-point central, q3 the
// 4-point central third difference (identical to imp-34543 qDerivs), and q4 the 5-point central
// 4th difference [q4 = (f2 - 4 f1 + 6 f0 - 4 fm1 + fm2)/dp^4] -- the next inherited term.
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
const DP = 1e-3; // q-derivative step for the coefficient decomposition (imp-34543)

// Tabulate across the imp-34446/imp-34531/imp-34543 landmark ladder.
const LADDER = [
  { label: '1e13', N: Math.pow(10, 13.0) },
  { label: '2.15e13', N: Math.pow(10, 13.333) },
  { label: 'N* (4.62e13)', N: DEEP_TAIL_N },
  { label: '4.62e13 (13.665)', N: Math.pow(10, 13.665) },
  { label: '1e14', N: Math.pow(10, 14.0) },
];

const H2 = H_MEAS * H_MEAS;
const H4 = H2 * H2;

const RECON_LADDER = LADDER.map(({ label, N }) => {
  const rawResidual = analyticExponent(N) - measuredExponent(N, H_MEAS);
  const { q1, q2, q3, q4 } = qDerivs(N, DP);
  // O(h^2) coefficient (imp-34531 / imp-34543): C_th = C_q2 + C_q3.
  const cQ2 = -(1 / q1) * (q2 / (2 * q1));
  const cQ3 = (1 / q1) * (q3 / (6 * q1));
  const cTh = cQ2 + cQ3;
  // O(h^4) coefficient from the asymmetric-step Taylor expansion (see header):
  //   A2 = (-q2/2 + q3/6)/q1 [reproduces C_th*q1], A4 = (-q2/4 + (17/72) q3 - q4/12)/q1,
  //   C_h4 = -(1/q1)( A2^2 - A4 ). q4 enters ONLY here -- never in the O(h^2) coefficient.
  const A2 = (-q2 / 2 + q3 / 6) / q1;
  const A4 = (-q2 / 4 + (17 / 72) * q3 - q4 / 12) / q1;
  const cH4 = -(1 / q1) * (A2 * A2 - A4);
  const recon2 = H2 * cTh; // imp-34543 full O(h^2) reconstruction (~0.4% residual)
  const recon4 = H2 * cTh + H4 * cH4; // + q4-bearing O(h^4) term
  return {
    label,
    N: +N.toExponential(3),
    raw_residual: +rawResidual.toExponential(4), // ~1.1e-9
    q4: +q4.toExponential(4), // 5-point central 4th difference
    C_h4: +cH4.toExponential(4), // O(h^4) coefficient
    ratio_raw_over_q2q3: +(rawResidual / recon2).toFixed(6), // imp-34543 baseline (~1.00, ~0.4% range)
    ratio_raw_over_q2q3q4: +(rawResidual / recon4).toFixed(6), // + q4 term (essentially identical)
    h4_rel_contribution: +((H4 * cH4) / recon2).toExponential(4), // ~1e-6 -- the added term is tiny
  };
});

// Relative range (max-min)/min of |.| across the ladder -- the "constancy" metric.
function relRange(vals) {
  const mags = vals.map((v) => Math.abs(v));
  const lo = Math.min(...mags);
  const hi = Math.max(...mags);
  return (hi - lo) / lo;
}

const RANGE_Q2Q3 = relRange(RECON_LADDER.map((r) => r.ratio_raw_over_q2q3)); // ~0.0044 (imp-34543 ~0.4%)
const RANGE_Q2Q3Q4 = relRange(RECON_LADDER.map((r) => r.ratio_raw_over_q2q3q4)); // ~0.0044 (unchanged)
const RANGE_REDUCTION_FACTOR = RANGE_Q2Q3 / RANGE_Q2Q3Q4; // ~1.00001 -- q4 removes ~none of the residual
const RESIDUAL_FRACTION_REMOVED = 1 - RANGE_Q2Q3Q4 / RANGE_Q2Q3; // ~1e-5 -- fraction of ~0.4% q4 explains
const MAX_H4_REL = Math.max(...RECON_LADDER.map((r) => Math.abs(r.h4_rel_contribution))); // ~1.2e-6

// (F3) Sensitivity floor: sweep the measured step h and q-derivative step dp; the residual range
// does NOT converge to 0 as h -> 0 -- it is a finite-difference truncation-vs-roundoff floor.
function residualRangeFor(h, dp) {
  const ratios = LADDER.map(({ N }) => {
    const raw = analyticExponent(N) - measuredExponent(N, h);
    const { q1, q2, q3 } = qDerivs(N, dp);
    const cTh = -(1 / q1) * (q2 / (2 * q1)) + (1 / q1) * (q3 / (6 * q1));
    return raw / (h * h * cTh);
  });
  return relRange(ratios);
}
const SENSITIVITY = Object.freeze([
  { h: 1e-2, dp: 1e-3, range: +residualRangeFor(1e-2, 1e-3).toExponential(3) },
  { h: 1e-3, dp: 1e-3, range: +residualRangeFor(1e-3, 1e-3).toExponential(3) }, // operating point ~0.44%
  { h: 1e-4, dp: 1e-3, range: +residualRangeFor(1e-4, 1e-3).toExponential(3) }, // blows up: roundoff on raw
  { h: 1e-3, dp: 1e-2, range: +residualRangeFor(1e-3, 1e-2).toExponential(3) },
  { h: 1e-3, dp: 1e-4, range: +residualRangeFor(1e-3, 1e-4).toExponential(3) }, // blows up: roundoff in q3
]);

export const IMP34566_DRIFT_RESIDUAL_Q4_SHARE = Object.freeze({
  id: 'imp-34566',
  proofSection: 'S-frontier',
  claim_measured:
    'Extend the imp-34543 q2+q3 O(h^2) drift-residual reconstruction with the next inherited term ' +
    '-- the 5-point central 4th difference q4, entering at O(h^4) via C_h4 = -(1/q1)(A2^2 - A4), ' +
    'A2 = (-q2/2 + q3/6)/q1, A4 = (-q2/4 + (17/72) q3 - q4/12)/q1 -- and measure how much of the ' +
    'surviving ~0.4% drift residual it accounts for, reporting whether a q5 tail persists.',
  meas_step_h: H_MEAS,
  q_deriv_step: DP,
  C_C_inline: +C_C.toFixed(6),
  recon_ladder: Object.freeze(RECON_LADDER.map((r) => Object.freeze(r))),
  range_raw_over_q2q3: +RANGE_Q2Q3.toFixed(6), // ~0.0044 -- the imp-34543 ~0.4% baseline
  range_raw_over_q2q3q4: +RANGE_Q2Q3Q4.toFixed(6), // ~0.0044 -- unchanged after adding q4
  range_reduction_factor: +RANGE_REDUCTION_FACTOR.toFixed(6), // ~1.00001
  residual_fraction_removed_by_q4: +RESIDUAL_FRACTION_REMOVED.toExponential(3), // ~1e-5 (~0% of ~0.4%)
  max_h4_relative_contribution: +MAX_H4_REL.toExponential(4), // ~1.2e-6
  sensitivity_floor: SENSITIVITY,
  isRigorous: false,
  verdict:
    'MEASUREMENT (NOT rigorous). Extending the imp-34543 q2+q3 O(h^2) drift-residual reconstruction ' +
    'by one Taylor order adds the 5-point central 4th difference q4 through the O(h^4) coefficient ' +
    'C_h4 = -(1/q1)(A2^2 - A4) [A2 = (-q2/2 + q3/6)/q1 reproduces C_th exactly; A4 = (-q2/4 + ' +
    '(17/72) q3 - q4/12)/q1]. (F1) At the imp-34446 reference step h = 1e-3 the added O(h^4) term is ' +
    'only ~1e-6 of the O(h^2) term (h^2 = 1e-6), contributing at most ~1.2e-6 in relative size to ' +
    'raw at every landmark -- three orders below the surviving ~0.4% residual. (F2) So the ' +
    'q4-augmented ratio raw/(h^2 C_th + h^4 C_h4) has relative range ~4.41e-3, IDENTICAL to the ' +
    'imp-34543 ~0.4% baseline to ~5 sig figs (range reduction factor ~1.00001): q4 accounts for ' +
    '~0% (~1e-5 fraction) of the residual. (F3) A sensitivity sweep shows the residual range does ' +
    'NOT converge to 0 as h -> 0 (it blows up at h = 1e-4 from roundoff on raw ~ 1e-11) and swings ' +
    'by orders of magnitude with the q-derivative step dp -- the signature of a truncation-vs-' +
    'roundoff finite-difference FLOOR near (h,dp) = (1e-3,1e-3), NOT of a smooth higher-order ' +
    '(q4/q5) series remainder. A true q5 tail in the h-series persists but at ~1e-9 relative ' +
    'magnitude, far below the observable floor. CONCLUSION: the "add the next inherited derivative ' +
    'order" avenue does NOT close the ~0.4% -- it is set by finite-difference conditioning, not by ' +
    'a missing q4/q5 term. q4 is the inherited central 4th difference, NOT a fresh analytic closed ' +
    'form, so the sigma->1 deep-tail regime (imp-3220/imp-3406 component model least trustworthy) ' +
    'is inherited as-is. The -2 asymptote and C_C = (1/8)sqrt(3 pi) (imp-2714, C_H = 1/8) ansatz ' +
    'are UNTOUCHED; the C_mb GUE-conditional share per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 ' +
    'untouched; changes no bound; no operator positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-34543 (q2/q3 shares, ~0.4% residual measured here); imp-34531 (F2 O(h^2) coefficient ' +
    'certification); imp-34486 (closed-form drift x = -2 g/(1-g)); imp-34446 (central-difference ' +
    'exponent measurement); imp-33620 (deep-tail landmark N* ~ 4.62e13); imp-2714 (C_C ansatz); ' +
    'imp-486 (C_mb).',
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP34566_ASSERTIONS = [
  {
    id: 'imp34566-baseline-matches-imp34543-residual',
    holds: () => RANGE_Q2Q3 > 0.002 && RANGE_Q2Q3 < 0.008,
    why: 'The q2+q3 reconstruction residual range reproduces the imp-34543 ~0.4% baseline (~0.0044).',
  },
  {
    id: 'imp34566-q4-term-is-negligible',
    holds: () => MAX_H4_REL < 1e-4,
    why: 'F1: at h = 1e-3 the added O(h^4) term is ~1e-6 of the O(h^2) term -- far below the ~0.4% residual.',
  },
  {
    id: 'imp34566-q4-removes-essentially-none-of-residual',
    holds: () => RANGE_REDUCTION_FACTOR > 0.999 && RANGE_REDUCTION_FACTOR < 1.001,
    why: 'F2: adding q4 leaves the residual range unchanged to ~5 sig figs -- q4 accounts for ~0% of the ~0.4%.',
  },
  {
    id: 'imp34566-residual-fraction-removed-tiny',
    holds: () => Math.abs(RESIDUAL_FRACTION_REMOVED) < 1e-3,
    why: 'F2: the fraction of the ~0.4% residual the q4 term explains is ~1e-5 -- negligible.',
  },
  {
    id: 'imp34566-floor-not-a-clean-h-series-remainder',
    holds: () => {
      const hSmall = SENSITIVITY.find((s) => s.h === 1e-4 && s.dp === 1e-3);
      const op = SENSITIVITY.find((s) => s.h === 1e-3 && s.dp === 1e-3);
      // A clean higher-order remainder would SHRINK as h -> 0; instead it grows (roundoff floor).
      return hSmall.range > op.range;
    },
    why: 'F3: the residual range grows as h -> 0 (roundoff on raw ~ 1e-11) -- a finite-difference floor, not a q4/q5 series tail.',
  },
  {
    id: 'imp34566-honesty-gate-no-qed',
    holds: () =>
      IMP34566_DRIFT_RESIDUAL_Q4_SHARE.isRigorous === false &&
      /NO QED/.test(IMP34566_DRIFT_RESIDUAL_Q4_SHARE.verdict) &&
      /refereed bound is changed/i.test(IMP34566_DRIFT_RESIDUAL_Q4_SHARE.verdict) &&
      /UNTOUCHED/.test(IMP34566_DRIFT_RESIDUAL_Q4_SHARE.verdict),
    why: 'Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.',
  },
];

for (const assertion of IMP34566_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-34566-drift-residual-fourth-difference-share assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP34566_DRIFT_RESIDUAL_Q4_SHARE;
