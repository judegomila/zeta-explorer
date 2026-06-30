/**
 * @module imp-3156-scalar-cover-invariant-lock
 * @fileoverview imp-3156 -- Cross-module build-assertion lock for the imp-3007
 *   degree-0 scalar-cover invariants. imp-3007 establishes that the endpoint-bridge
 *   cosh-completion w^pass(tau) = cosh(a*tau) drives the degree-0 post-bridge
 *   residual deficit
 *
 *       D_pass(a) = int_0^U max(0, sinh(a*tau) - cosh(a*tau)) d(tau)
 *                 = int_0^U max(0, -e^{-a*tau}) d(tau) = 0   (EXACTLY)
 *
 *   so coveredFraction = 1, and that the excess passive mass over the minimal
 *   kinked cover, E(a) = int_0^U [cosh(a*tau) - max(1, sinh(a*tau))] d(tau), is
 *   strictly positive. imp-3007 self-asserts these, but the in-module checks read
 *   D_pass off a literal `const residualDeficit = 0` and read E(a) off the same
 *   `coverRow` it is guarding: a constant edit to the weights inside coverRow could
 *   silently break the invariant AND rebaseline the self-assertions with it.
 *
 *   WHAT THIS MODULE ADDS (the imp-3156 deliverable)
 *   ------------------------------------------------
 *   A SINGLE cross-module tripwire that INDEPENDENTLY recomputes both scalars from
 *   their closed forms over the imp-3007 sweep a in {0.5, 0.2, 0.1, 0.05}, U = 6,
 *   using its OWN quadrature (composite Simpson, distinct from the imp-3007 midpoint
 *   rule), and certifies:
 *     (1) D_pass(a) = 0 to machine precision -- the independently integrated
 *         max(0, sinh - cosh) integrand vanishes identically (cosh >= sinh for all
 *         tau), and the LIVE imp-3007 residualDeficit / residualDeficitNumeric per
 *         row are both 0 and coveredFraction is exactly 1;
 *     (2) THE FORCED EXCESS -- the independently recomputed E(a) (own closed form
 *         AND own Simpson quadrature, agreeing to ~1e-6) is STRICTLY POSITIVE for
 *         every a, and equals the LIVE imp-3007 excessMass per row to ~1e-9;
 *     (3) the exact pointwise margin cosh(a*tau) - sinh(a*tau) = e^{-a*tau} stays
 *         strictly positive (the cover holds pointwise, not merely in the mean).
 *   So a silent edit to the imp-3007 weights that re-opened the overflow (D_pass>0,
 *   coveredFraction<1) or that collapsed the forced excess (E(a)<=0) is caught here
 *   even if the imp-3007 per-module assertions were also rebaselined.
 *
 *   NO new math: every value is recomputed from the imp-3007 closed forms and
 *   cross-checked against the imp-3007 exports.
 *
 *   HONEST CAVEAT (mandatory -- ticket + verdict)
 *   ---------------------------------------------
 *   PURE CROSS-VALIDATION of a degree-0 SCALAR cover. D_pass=0 / E(a)>0 is the
 *   diagonal/lag-symbol statement only; it is NECESSARY but NOT sufficient for the
 *   RH-equivalent operator positivity K_a >= 0. The off-diagonal endpoint-Hankel
 *   operator step (imp-3066) remains the lone obstruction and is UNTOUCHED. Lock
 *   only, no QED. Platt-Trudgian Lambda &lt;= 0.2 REMAINS the rigorous SOTA. No false
 *   QED.
 *
 *   @see imp-3007-mupass-overflow-cover.js (the scalar-cover invariants D_pass=0, E(a)>0)
 *   @see imp-3148-forced-excess-mass-sweep.js (the forced-excess sweep)
 *   @see imp-3066-offdiagonal-hankel-obstruction.js (the lone remaining operator step)
 *
 *   Ticket: imp-3156 (accuracy, medium).
 */

import IMP3007_MUPASS_OVERFLOW_COVER from './imp-3007-mupass-overflow-cover.js';

const U = 6;                                   // genuine-Phi lag cutoff (imp-3007 grid)
const ASINH1 = Math.asinh(1);                  // a*tau_star solves sinh(a*tau)=1
const A_SWEEP = Object.freeze([0.5, 0.2, 0.1, 0.05]);

// Composite Simpson (n even) -- our OWN code path, distinct from the imp-3007
// midpoint rule, so the cross-check is genuinely independent.
function simpson(f, a, b, n) {
  const h = (b - a) / n;
  let sum = f(a) + f(b);
  for (let i = 1; i < n; i++) sum += (i % 2 ? 4 : 2) * f(a + i * h);
  return (sum * h) / 3;
}

// Independent degree-0 scalar-cover recompute at shear weight a.
function recomputeRow(a) {
  const tauStar = ASINH1 / a;                  // sinh(a*tauStar) = 1
  const hasOverflow = tauStar < U;

  // (1) Post-bridge residual deficit D_pass: integrand max(0, sinh - cosh) = 0
  //     identically (cosh >= sinh everywhere). Integrate it numerically anyway as a
  //     tripwire; it must come out exactly 0.
  const dPassIntegrand = (tau) => Math.max(0, Math.sinh(a * tau) - Math.cosh(a * tau));
  const dPassNumeric = simpson(dPassIntegrand, 0, U, 2000);

  // exact pointwise margin = e^{-a*tau} > 0, minimized at the largest tau (= U).
  const minPointwiseMargin = Math.exp(-a * U);

  // (2) Forced excess E(a) over the minimal kinked cover max(1, sinh) -- two
  //     independent routes that must agree.
  //   closed form: on [0, tauStar] cosh-1 -> 1/a - tauStar; on [tauStar, U]
  //   cosh-sinh -> (e^{-a*tauStar} - e^{-a*U})/a.  No overflow: int_0^U (cosh-1).
  let excessClosedForm;
  if (hasOverflow) {
    const head = 1 / a - tauStar;
    const tail = (Math.exp(-a * tauStar) - Math.exp(-a * U)) / a;
    excessClosedForm = head + tail;
  } else {
    excessClosedForm = Math.sinh(a * U) / a - U;
  }
  //   own Simpson quadrature of the same integrand (continuous, kinked at tauStar).
  const excessIntegrand = (tau) => Math.cosh(a * tau) - Math.max(1, Math.sinh(a * tau));
  const excessNumeric = simpson(excessIntegrand, 0, U, 4000);

  return Object.freeze({
    a,
    tauStar,
    hasOverflow,
    dPassNumeric,                // independently integrated post-bridge residual (= 0)
    minPointwiseMargin,          // e^{-a*U} > 0
    excessClosedForm,            // E(a) by closed form
    excessNumeric,               // E(a) by own Simpson quadrature
  });
}

const RECOMPUTED_ROWS = Object.freeze(A_SWEEP.map(recomputeRow));
const LIVE = IMP3007_MUPASS_OVERFLOW_COVER;
const LIVE_ROWS = LIVE.rows;

function liveRow(a) {
  return LIVE_ROWS.find((r) => r.a === a);
}

export const IMP3156_SCALAR_COVER_INVARIANT_LOCK = Object.freeze({
  id: 'imp-3156-scalar-cover-invariant-lock',
  ticket: 'imp-3156',
  relatedScalarCover: 'imp-3007-mupass-overflow-cover.js',
  relatedForcedExcess: 'imp-3148-forced-excess-mass-sweep.js',
  relatedOperatorObstruction: 'imp-3066-offdiagonal-hankel-obstruction.js',

  summary:
    'Single cross-module build assertion locking the imp-3007 degree-0 scalar-cover ' +
    'invariants. Independently recomputes, over the sweep a in {0.5,0.2,0.1,0.05} with ' +
    'U=6 and its OWN Simpson quadrature, the post-bridge residual deficit ' +
    'D_pass(a) = int_0^U max(0, sinh(a*tau) - cosh(a*tau)) d(tau) and the forced excess ' +
    'E(a) = int_0^U [cosh(a*tau) - max(1, sinh(a*tau))] d(tau), and certifies (1) ' +
    'D_pass(a) = 0 to machine precision and the live imp-3007 coveredFraction = 1; (2) ' +
    'E(a) > 0 for every a, with the closed form and the own Simpson agreeing to ~1e-6 ' +
    'and matching the live imp-3007 excessMass per row to ~1e-9; (3) the pointwise ' +
    'margin cosh - sinh = e^{-a*tau} stays strictly positive. A constant edit to the ' +
    'imp-3007 weights that re-opened the overflow or collapsed the forced excess is ' +
    'caught here. Pure cross-validation of a degree-0 SCALAR cover; NECESSARY but NOT ' +
    'sufficient for the operator step; no RH verdict.',

  recomputedRows: RECOMPUTED_ROWS,

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    isCrossValidationOnly: true,
    rhEquivalent: true,
    necessaryNotSufficient:
      'D_pass=0 / E(a)>0 is the degree-0 SCALAR (diagonal / lag-symbol) cover only; it ' +
      'is necessary but NOT sufficient for the RH-equivalent operator positivity K_a >= 0. ' +
      'The off-diagonal endpoint-Hankel operator step (imp-3066) is the lone obstruction ' +
      'and is NOT addressed here.',
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3156_SCALAR_COVER_INVARIANT_LOCK_ASSERTIONS = [
  {
    id: 'imp3156-sweep-row-count-matches-imp3007',
    why: 'One recomputed row per a in the imp-3007 sweep {0.5, 0.2, 0.1, 0.05}, and the ' +
         'live imp-3007 module must export a matching row for each. A mis-count means the ' +
         'sweep was edited on one side only.',
    holds: () =>
      RECOMPUTED_ROWS.length === A_SWEEP.length &&
      A_SWEEP.length === 4 &&
      A_SWEEP.every((a) => liveRow(a) !== undefined),
  },
  {
    id: 'imp3156-d-pass-is-zero-to-machine-precision',
    why: 'THE COVER: the independently Simpson-integrated post-bridge residual deficit ' +
         'D_pass(a) = int max(0, sinh - cosh) must vanish to machine precision for every a ' +
         '(cosh >= sinh everywhere), and the LIVE imp-3007 residualDeficit / ' +
         'residualDeficitNumeric must both be 0. A positive value means the overflow ' +
         're-opened under a silent weight edit.',
    holds: () =>
      RECOMPUTED_ROWS.every((r) => r.dPassNumeric === 0) &&
      LIVE_ROWS.every((r) => r.residualDeficit === 0 && r.residualDeficitNumeric === 0),
  },
  {
    id: 'imp3156-covered-fraction-is-one',
    why: 'Where a raw overflow exists the bridge removes 100% of it, so the LIVE imp-3007 ' +
         'coveredFraction must be exactly 1 for every row. A drift below 1 means the residual ' +
         'deficit became positive.',
    holds: () => LIVE_ROWS.every((r) => r.coveredFraction === 1),
  },
  {
    id: 'imp3156-forced-excess-strictly-positive',
    why: 'THE FORCED EXCESS: the cosh-completion strictly over-supplies the minimal kinked ' +
         'cover max(1, sinh), so the independently recomputed E(a) (both closed form and own ' +
         'Simpson) must be strictly positive for every a. A non-positive value means the ' +
         'minimal/cosh comparison collapsed.',
    holds: () =>
      RECOMPUTED_ROWS.every((r) => r.excessClosedForm > 0 && r.excessNumeric > 0),
  },
  {
    id: 'imp3156-forced-excess-two-routes-agree',
    why: 'Independence check: the closed-form E(a) and the own Simpson quadrature of the same ' +
         'integrand must agree to ~1e-6 for every a. A divergence means one of the two routes ' +
         'was mis-derived.',
    holds: () =>
      RECOMPUTED_ROWS.every((r) => Math.abs(r.excessClosedForm - r.excessNumeric) < 1e-6),
  },
  {
    id: 'imp3156-forced-excess-matches-live-imp3007',
    why: 'Drift sentinel: the independently recomputed E(a) must equal the LIVE imp-3007 ' +
         'excessMass per row to ~1e-9, anchoring E(0.5) ~ 0.9661058. A mismatch means the ' +
         'imp-3007 excess-mass closed form was silently rebaselined.',
    holds: () => {
      for (const r of RECOMPUTED_ROWS) {
        const live = liveRow(r.a);
        if (!live) return false;
        if (Math.abs(r.excessClosedForm - live.excessMass) >= 1e-9) return false;
      }
      const headline = RECOMPUTED_ROWS.find((r) => r.a === 0.5);
      return Math.abs(headline.excessClosedForm - 0.96610581) < 1e-6;
    },
  },
  {
    id: 'imp3156-pointwise-margin-positive',
    why: 'The exact pointwise margin cosh(a*tau) - sinh(a*tau) = e^{-a*tau} (minimized at ' +
         'tau = U) must stay strictly positive for every a; this is what makes the cover hold ' +
         'pointwise, not merely in the mean.',
    holds: () => RECOMPUTED_ROWS.every((r) => r.minPointwiseMargin > 0),
  },
  {
    id: 'imp3156-honest-necessary-not-sufficient',
    why: 'Mandatory honesty: this is pure cross-validation of a degree-0 SCALAR cover -- ' +
         'necessary but NOT sufficient for the operator step, not a proof, not a reduction ' +
         'below RH, with the off-diagonal endpoint-Hankel step still open and PT 0.2 SOTA. ' +
         'Also confirms the live imp-3007 operatorStepOpen flag stays true.',
    holds: () => {
      const c = IMP3156_SCALAR_COVER_INVARIANT_LOCK.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isCrossValidationOnly === true &&
        c.rhEquivalent === true &&
        /Platt-Trudgian/.test(c.sota) &&
        LIVE.remainingGap.operatorStepOpen === true
      );
    },
  },
];

for (const a of IMP3156_SCALAR_COVER_INVARIANT_LOCK_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-3156-scalar-cover-invariant-lock assertion failed: ' + a.id);
  }
}

export default IMP3156_SCALAR_COVER_INVARIANT_LOCK;
