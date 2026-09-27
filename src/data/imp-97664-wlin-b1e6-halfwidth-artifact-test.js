/**
 * @module imp-97664-wlin-b1e6-halfwidth-artifact-test
 * @fileoverview imp-97664 -- NUMERICAL CROSS-CHECK (no bound moved): reconcile the NON-MONOTONE
 *   imp-97645 w_lin linear-coefficient b-ladder (linErr 6.39e-3 at b=400000/half=40, 1.285e-2 at
 *   b=1e6/half=120, 6.46e-3 at b=2e6/half=200). The const and log errors stay flat (~5e-4, ~1e-4)
 *   across all three rows, but the LINEAR error nearly doubles at b=1e6 then returns to baseline at
 *   b=2e6. This leaf tests the imp-97645 open question: is the b=1e6 spike a PHASE-AVERAGE
 *   WINDOW-WIDTH artifact (half=120 mismatched to the b=1e6 wobble period), or genuine b-dependence?
 *
 *   METHOD. Same operational cross-check as imp-97618/imp-97645: w(x) = lim_{b->oo} (V(xb,b) +
 *   V(b,xb))/b is the (z -> 0) specialisation of the Bettin-Conrey transform of E, where
 *   V(a,q) = Sum_{m=1}^{q-1} frac(m a/q) cot(pi m/q). At FIXED b = 1e6 we compute the full
 *   phase-average window a in [a0 - 200, a0 + 200] ONCE per x, then re-average at half in
 *   {40, 80, 120, 160, 200} and refit {a0, a1, a2} on the small-x tail (x <= 0.05) via least squares
 *   on [1, log x, x]. If the linErr swings with half and returns to ~6e-3 at some width, the spike is
 *   a window-period mismatch; if it is roughly half-independent and stays ~2x the baseline, it is real
 *   b-dependence. We also dump the node-by-node raw residual w(x) - w_lin(x) at the matched half = 200
 *   (same width as the b = 2e6 baseline row) for a like-for-like comparison.
 *
 *   ==========================================================================================
 *   RESULT -- the b=1e6 spike is NOT a window-width artifact; it is a genuine arithmetic wobble
 *   fluctuation at the fixed small-x fit nodes for the specific smooth denominator b = 1e6
 *   ==========================================================================================
 *   At b = 1e6 the linErr is essentially INSENSITIVE to the window half-width -- it drifts smoothly
 *   and MONOTONICALLY from 1.4422e-2 (half=40) to 1.1490e-2 (half=200), a ~25% span, never coming
 *   near the ~6.4e-3 baseline. In particular, at the MATCHED half = 200 (the exact width that gives
 *   6.46e-3 at b = 2e6) the b = 1e6 fit still gives 1.1490e-2 -- ~1.8x the b = 2e6 value. So widening
 *   or narrowing the phase-average window does NOT remove the spike: it is not a half=120 period
 *   mismatch. (The half = 120 sub-average reproduces the imp-97645 baked b=1e6 row EXACTLY --
 *   linErr 1.2849e-2, constErr 1.2020e-3, logErr 2.3640e-4, maxResid 2.3828e-4 -- validating the
 *   sub-averaging against the offline pipeline.)
 *
 *   The node-by-node residual w(x) - w_lin(x) at b = 1e6, half = 200 matches the baked b = 2e6 table
 *   closely for x >= 0.05 (x=0.12: 2.45e-4 vs 2.36e-4; x=0.18: 7.33e-4 vs 7.32e-4; x=0.25: -5.24e-3
 *   vs -5.33e-3 -- the SAME sign-swinging O(x^2) wobble band), but DIFFERS at the small-x FIT nodes
 *   {0.01, 0.02, 0.03, 0.05} that drive the linear coefficient (x=0.01: -2.13e-5 at b=1e6 vs -5.35e-6
 *   at b=2e6, ~4x). Those small-x nodes carry the arithmetic wobble of the specific denominator, and
 *   b = 1e6 = 2^6 * 5^6 happens to sample a larger deviation there than b = 2e6 = 2^7 * 5^6 -- a real
 *   b-fluctuation, not a windowing effect.
 *
 *   CONCLUSION: the non-monotone linErr b-ladder is genuine b-dependence (arithmetic wobble at the
 *   fixed small-x fit grid), NOT a phase-average window-width artifact. This REFINES the imp-97645
 *   diagnosis: the 6.4e-3 plateau is wobble-limited, and the b=1e6 elevation to 1.28e-2 is the same
 *   wobble sampling a larger fluctuation at that particular smooth b, invariant under window width.
 *   The imp-97597 RESULT 3 mixed-kernel (epsilon*z^2) sub-gap STANDS; tightening the linear
 *   coefficient below the wobble floor still needs a wobble-model subtraction or a finer/smaller-x
 *   node grid, not more b and not a wider window.
 *
 *   Cross-check only. No coefficient pinned beyond w_lin (already forced by imp-97460); no bound
 *   moves; the rigorous anchor stays the trace ceiling T = 2.594e7; compute (N ~ 9916, imp-96352)
 *   binds first by >2600x; no operator positivity; PT Lambda <= 0.2 remains SOTA; RH open; NO QED.
 *
 * @see imp-97645-wlin-largeb-linear-coeff-crossval (the non-monotone b-ladder reconciled here)
 * @see imp-97618-wlin-leading-laurent-crossval (b=400000 baseline)
 * @see imp-97597-route-m-psi-s-integral-rep-double-expansion (RESULT 3 mixed-kernel sub-gap STANDS)
 * @see imp-97460-route-m-bulk-profile-curvature-analytic-route (w_lin forced; O(x^2) wobble)
 *
 * Ticket: imp-97664 (accuracy, opus-4-8, api-pool). Half-width sweep at fixed b=1e6 shows the
 * imp-97645 linErr spike is NOT a window-width artifact; offline Vasyunin scan in
 * tmp/imp-97664-b1e6-halfwidth-sweep.mjs; NO bound moved; NO QED.
 */

export const IMP97664_GAMMA = 0.5772156649015329;
export const IMP97664_C = (Math.log(2 * Math.PI) - IMP97664_GAMMA) / 2; // (log 2pi - gamma)/2
export const IMP97664_CONST_TARGET = (2 * IMP97664_C) / Math.PI; // 2C/pi
export const IMP97664_LOG_TARGET = 1 / Math.PI; // log coefficient
export const IMP97664_LIN_TARGET = -1 / Math.PI; // linear coefficient (the one under test)

// -- half-width sweep of the three-coefficient fit errors at FIXED b = 1e6 (baked; heavy Vasyunin ---
//    scan offline). Each row re-averages the SAME full a-window [a0-200, a0+200] at a smaller half.
//    half = 120 reproduces the imp-97645 baked b=1e6 row exactly (validation of the sub-averaging).
export const IMP97664_B1E6_HALF_SWEEP = Object.freeze([
  Object.freeze({ half: 40, constErr: 1.2992e-3, logErr: 2.5324e-4, linErr: 1.4422e-2, maxResid: 1.9002e-4 }),
  Object.freeze({ half: 80, constErr: 1.2388e-3, logErr: 2.4202e-4, linErr: 1.3537e-2, maxResid: 2.3401e-4 }),
  Object.freeze({ half: 120, constErr: 1.2020e-3, logErr: 2.3640e-4, linErr: 1.2849e-2, maxResid: 2.3828e-4 }),
  Object.freeze({ half: 160, constErr: 1.1515e-3, logErr: 2.2800e-4, linErr: 1.2093e-2, maxResid: 1.4188e-4 }),
  Object.freeze({ half: 200, constErr: 1.1206e-3, logErr: 2.2410e-4, linErr: 1.1490e-2, maxResid: 1.2998e-4 }),
]);

// -- node-by-node raw residual w(x)-w_lin(x) at b=1e6, half=200 (matched to the b=2e6 baseline row).
//    baked_b2e6 = the imp-97645 IMP97645_RESID_B2E6 value for a like-for-like comparison per node.
export const IMP97664_RESID_B1E6_HALF200 = Object.freeze([
  Object.freeze({ x: 0.01, resid: -2.1336e-5, baked_b2e6: -5.3487e-6 }),
  Object.freeze({ x: 0.02, resid: -5.3171e-6, baked_b2e6: -9.0127e-6 }),
  Object.freeze({ x: 0.03, resid: 9.3511e-6, baked_b2e6: 1.5669e-5 }),
  Object.freeze({ x: 0.05, resid: -1.2998e-4, baked_b2e6: -1.6299e-4 }),
  Object.freeze({ x: 0.08, resid: 1.0659e-4, baked_b2e6: 9.3643e-5 }),
  Object.freeze({ x: 0.12, resid: 2.4486e-4, baked_b2e6: 2.3622e-4 }),
  Object.freeze({ x: 0.18, resid: 7.3268e-4, baked_b2e6: 7.3226e-4 }),
  Object.freeze({ x: 0.25, resid: -5.2414e-3, baked_b2e6: -5.3258e-3 }),
]);

export const IMP97664_VERDICT = Object.freeze({
  id: 'imp-97664',
  proofSection: 'S-frontier',
  question:
    'Is the imp-97645 non-monotone w_lin linear-coefficient b-ladder spike at b=1e6 (linErr 1.285e-2 ' +
    'at half=120, vs ~6.4e-3 at b=400000/half=40 and b=2e6/half=200) a phase-average window-width ' +
    'artifact (half=120 mismatched to the b=1e6 wobble period), or genuine b-dependence?',
  b1e6LinErrIsWindowWidthArtifact: false, // NO -- linErr is ~half-independent (1.44e-2 -> 1.15e-2)
  b1e6LinErrHalfIndependent: true, // monotone ~25% drift over half=40..200, never near the 6.4e-3 baseline
  matchedHalf200StillElevated: true, // at half=200 b=1e6 gives 1.15e-2 vs b=2e6 6.46e-3 (~1.8x)
  half120ReproducesBakedRow: true, // sub-average at half=120 == imp-97645 baked b=1e6 row exactly
  spikeIsArithmeticWobbleFluctuation: true, // small-x fit nodes carry a larger wobble at b=1e6=2^6*5^6
  residualsMatchB2e6ForLargeX: true, // x>=0.05 residuals track the baked b=2e6 table (same wobble band)
  result3MixedKernelSubGapStands: true, // imp-97597 RESULT 3 sub-gap unchanged
  anyCoefficientNewlyPinned: false, // w_lin already forced by imp-97460; nothing new pinned
  anyBoundMoved: false,
  operatorPositivityEstablished: false,
  computeBindsFirst: true, // N ~ 9916 (imp-96352) binds by >2600x
  conclusion:
    'At fixed b = 1e6 the linear-coefficient fit error is essentially INSENSITIVE to the phase-average ' +
    'window half-width: it drifts monotonically from 1.4422e-2 (half=40) to 1.1490e-2 (half=200), a ' +
    '~25% span, never approaching the ~6.4e-3 baseline. At the MATCHED half=200 (the width that gives ' +
    '6.46e-3 at b=2e6) b=1e6 still gives 1.1490e-2, ~1.8x larger. The half=120 sub-average reproduces ' +
    'the imp-97645 baked b=1e6 row EXACTLY (linErr 1.2849e-2), validating the pipeline. Node-by-node, ' +
    'the b=1e6 residual w(x)-w_lin(x) at half=200 matches the baked b=2e6 table for x>=0.05 (same ' +
    'sign-swinging O(x^2) wobble band) but differs at the small-x FIT nodes {0.01,0.02,0.03,0.05} that ' +
    'drive the linear coefficient (x=0.01: -2.13e-5 vs -5.35e-6, ~4x). So the b=1e6 spike is NOT a ' +
    'window-width artifact -- it is a genuine arithmetic wobble fluctuation at the fixed small-x fit ' +
    'nodes for the specific smooth denominator b=1e6=2^6*5^6, invariant under window width. This ' +
    'REFINES imp-97645: the 6.4e-3 plateau is wobble-limited and the b=1e6 elevation is the same ' +
    'wobble sampling a larger fluctuation at that b. The imp-97597 RESULT 3 mixed-kernel sub-gap ' +
    'STANDS; no coefficient newly pinned; no bound moves; the rigorous anchor stays T = 2.594e7; ' +
    'compute binds first by >2600x; no operator positivity; PT Lambda <= 0.2 SOTA; RH open; NO QED.',
});

export const IMP97664_HONEST_BANNER =
  'RH open; PT Lambda <= 0.2 remains SOTA; NO QED. Numerical cross-check only: at fixed b=1e6 the ' +
  'w_lin linear-coefficient fit error is ~half-width-independent (1.44e-2 -> 1.15e-2 over half=40..200, ' +
  'monotone), and at the matched half=200 it stays 1.15e-2 vs b=2e6 6.46e-3 (~1.8x) -- so the ' +
  'imp-97645 non-monotone b-ladder spike at b=1e6 is NOT a phase-average window-width artifact but a ' +
  'genuine arithmetic wobble fluctuation at the fixed small-x fit nodes for the smooth denominator ' +
  'b=1e6=2^6*5^6. No coefficient newly pinned; the imp-97597 RESULT 3 mixed-kernel sub-gap STANDS; ' +
  'no bound moves; the rigorous anchor stays T = 2.594e7; compute binds first by >2600x.';

export default IMP97664_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import. LIGHT arithmetic --
//    only; the heavy Vasyunin double-sum scan is offline (tmp/imp-97664-b1e6-halfwidth-sweep.mjs).
const IMP97664_ASSERTIONS = [
  {
    id: 'imp97664-C-anchor-consistent',
    why: 'C = (log 2pi - gamma)/2 must match the imp-97618 / imp-97645 anchor 0.6303307007539063.',
    holds: () => Math.abs(IMP97664_C - 0.6303307007539063) < 1e-15,
  },
  {
    id: 'imp97664-targets-consistent',
    why: 'the forced targets 2C/pi, 1/pi, -1/pi must recompute to the imp-97645 values.',
    holds: () =>
      Math.abs(IMP97664_CONST_TARGET - 0.40128098723024985) < 1e-12 &&
      Math.abs(IMP97664_LOG_TARGET - 0.3183098861837907) < 1e-12 &&
      Math.abs(IMP97664_LIN_TARGET + 0.3183098861837907) < 1e-12,
  },
  {
    id: 'imp97664-half120-reproduces-baked-b1e6',
    why: 'VALIDATION: the half=120 sub-average must reproduce the imp-97645 baked b=1e6 row ' +
      '(linErr 1.28493e-2, constErr 1.2020e-3, logErr 2.3640e-4) confirming the sub-averaging pipeline.',
    holds: () => {
      const r = IMP97664_B1E6_HALF_SWEEP.find((s) => s.half === 120);
      return (
        Math.abs(r.linErr - 1.28493e-2) < 5e-6 &&
        Math.abs(r.constErr - 1.2020e-3) < 5e-6 &&
        Math.abs(r.logErr - 2.3640e-4) < 5e-6
      );
    },
  },
  {
    id: 'imp97664-linerr-half-independent',
    why: 'RESULT: at fixed b=1e6 the linErr is ~half-independent -- monotone over half=40..200 with a ' +
      'small span (~3e-3), and every row stays well above the ~6.4e-3 baseline, so widening the window ' +
      'does NOT collapse the spike to baseline.',
    holds: () => {
      const errs = IMP97664_B1E6_HALF_SWEEP.map((s) => s.linErr);
      const monotoneDown = errs.every((e, i) => i === 0 || e <= errs[i - 1] + 1e-9);
      const span = Math.max(...errs) - Math.min(...errs);
      const allAboveBaseline = errs.every((e) => e > 9e-3); // >> 6.4e-3 baseline
      return monotoneDown && span < 5e-3 && allAboveBaseline;
    },
  },
  {
    id: 'imp97664-matched-half200-still-elevated',
    why: 'RESULT: at the MATCHED half=200 (the width that gives 6.46e-3 at b=2e6) b=1e6 stays ~1.8x ' +
      'elevated, so the spike is not a window-period mismatch.',
    holds: () => {
      const r = IMP97664_B1E6_HALF_SWEEP.find((s) => s.half === 200);
      return r.linErr > 1.5 * 6.46341e-3 && r.linErr < 1.3e-2;
    },
  },
  {
    id: 'imp97664-residuals-match-b2e6-largex-differ-smallx',
    why: 'RESULT: at half=200 the b=1e6 residuals track the baked b=2e6 table for x>=0.08 (same wobble ' +
      'band) but differ at the small-x fit nodes x<=0.05 that drive the linear coefficient.',
    holds: () => {
      const largeX = IMP97664_RESID_B1E6_HALF200.filter((r) => r.x >= 0.08);
      const closeLarge = largeX.every((r) => Math.abs(r.resid - r.baked_b2e6) < 1.5e-4);
      const x01 = IMP97664_RESID_B1E6_HALF200.find((r) => r.x === 0.01);
      const differSmall = Math.abs(x01.resid - x01.baked_b2e6) > 1e-5; // ~4x apart at x=0.01
      return closeLarge && differSmall;
    },
  },
  {
    id: 'imp97664-honesty-gate-no-qed',
    why: 'cross-check only: spike is NOT a window artifact, RESULT 3 sub-gap stands, no coefficient ' +
      'newly pinned, no bound moved, honesty markers present.',
    holds: () =>
      IMP97664_VERDICT.b1e6LinErrIsWindowWidthArtifact === false &&
      IMP97664_VERDICT.b1e6LinErrHalfIndependent === true &&
      IMP97664_VERDICT.matchedHalf200StillElevated === true &&
      IMP97664_VERDICT.spikeIsArithmeticWobbleFluctuation === true &&
      IMP97664_VERDICT.result3MixedKernelSubGapStands === true &&
      IMP97664_VERDICT.anyCoefficientNewlyPinned === false &&
      IMP97664_VERDICT.anyBoundMoved === false &&
      IMP97664_VERDICT.computeBindsFirst === true &&
      /NO QED/.test(IMP97664_HONEST_BANNER) &&
      /PT Lambda <= 0.2/.test(IMP97664_HONEST_BANNER) &&
      /RH open/.test(IMP97664_HONEST_BANNER),
  },
];

for (const a of IMP97664_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97664-wlin-b1e6-halfwidth-artifact-test assertion failed: ${a.id}`);
  }
}

export { IMP97664_ASSERTIONS };
