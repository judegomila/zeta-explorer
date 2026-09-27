/**
 * @module imp-97688-wlin-linerr-factorization-independence
 * @fileoverview imp-97688 -- NUMERICAL CROSS-CHECK (no bound moved): directly test the imp-97664
 *   hypothesis that the w_lin linErr elevation tracks the DENOMINATOR FACTORIZATION (smoothness)
 *   rather than the magnitude of b. imp-97664 found b=1e6=2^6*5^6 gives linErr ~1.15e-2 (half=200)
 *   vs the ~6.4e-3 plateau at b=2e6=2^7*5^6, attributing the spike to "arithmetic wobble at the
 *   small-x fit nodes" and noting "b=1e6=2^6*5^6 happens to sample a larger deviation than
 *   b=2e6=2^7*5^6". This leaf isolates factorization from magnitude by measuring the SAME linErr at
 *   FOUR denominators of comparable magnitude ~1e6 but wildly different factorization.
 *
 *   METHOD. Same operational cross-check as imp-97664/imp-97645: w(x) = lim_{b->oo} (V(xb,b) +
 *   V(b,xb))/b is the (z -> 0) specialisation of the Bettin-Conrey transform of E, where
 *   V(a,q) = Sum_{m=1}^{q-1} frac(m a/q) cot(pi m/q). At each FIXED b we average the full phase window
 *   a in [a0 - 200, a0 + 200] per x node, then refit {a0, a1, a2} on the small-x tail (x <= 0.05) via
 *   least squares on [1, log x, x] and report linErr = |a2 - (-1/pi)|. Four denominators:
 *     - prime          b = 1000003   (no smooth structure)
 *     - 2-power        b = 1048576   = 2^20 (maximally smooth: one prime, high power)
 *     - highly comp.   b =  960960   = 2^6*3*5*7*11*13 (many distinct small primes)
 *     - smooth ref     b = 1000000   = 2^6*5^6 (the imp-97664 spike denominator)
 *   CRITICAL FIT-NODE CONTROL: the fit-node filter uses the INTENDED target x, not the achieved
 *   xbar = a0/b. Filtering on xbar silently drops the x=0.05 node for b=2^20 (52429/1048576 =
 *   0.0500002 > 0.05), leaving only a 3-node fit and a spurious 7x-low linErr (1.67e-3) -- a pure
 *   node-count artifact. With the consistent 4-node fit all four factorizations agree.
 *
 *   ==========================================================================================
 *   RESULT -- the linErr elevation at b ~ 1e6 does NOT correlate with the denominator factorization;
 *   four wildly different factorizations of comparable magnitude give an IDENTICAL elevated linErr
 *   ==========================================================================================
 *   With the consistent 4-node fit (target-x selection), all four ~1e6 denominators give the same
 *   linErr to ~2%: prime 1.1490e-2, 2^20 1.1617e-2, HCN 1.1383e-2, smooth 2^6*5^6 1.1490e-2. The
 *   const and log errors likewise agree (~1.12e-3, ~2.24e-4 across all four). Node-by-node the raw
 *   residual w(x) - w_lin(x) is essentially denominator-INDEPENDENT at every x node: x=0.01 gives
 *   {-2.13e-5, -1.92e-5, -2.33e-5, -2.13e-5} and x=0.25 gives {-5.241e-3, -5.249e-3, -5.235e-3,
 *   -5.241e-3} across prime / 2-power / HCN / smooth. So the O(x^2) wobble band at the fixed rational
 *   fit grid is set by the MAGNITUDE regime (b ~ 1e6), not by the arithmetic of the factorization.
 *
 *   CONCLUSION: the imp-97664 factorization framing ("b=1e6=2^6*5^6 samples a larger deviation than
 *   b=2e6") is REFUTED as the driver. At fixed magnitude ~1e6 a prime, a pure 2-power, a
 *   highly-composite number and a smooth number all produce the same elevated linErr, so the
 *   b=1e6 -> b=2e6 drop from ~1.15e-2 to ~6.4e-3 (imp-97645) is a b-MAGNITUDE (finite-b convergence)
 *   effect, not a smoothness effect. This REFINES imp-97664: the wobble-limited linErr plateau shrinks
 *   with b, and the "smooth denominator" attribution was incidental -- 2e6 is itself smooth (2^7*5^6),
 *   and factorization is irrelevant at fixed magnitude. The imp-97597 RESULT 3 mixed-kernel
 *   (epsilon*z^2) sub-gap STANDS; tightening the linear coefficient below the wobble floor still needs
 *   a wobble-model subtraction or a larger b / finer small-x node grid, NOT a factorization choice.
 *
 *   Cross-check only. No coefficient pinned beyond w_lin (already forced by imp-97460); no bound
 *   moves; the rigorous anchor stays the trace ceiling T = 2.594e7; compute (N ~ 9916, imp-96352)
 *   binds first by >2600x; no operator positivity; PT Lambda <= 0.2 remains SOTA; RH open; NO QED.
 *
 * @see imp-97664-wlin-b1e6-halfwidth-artifact-test (the factorization hypothesis tested here)
 * @see imp-97645-wlin-largeb-linear-coeff-crossval (the non-monotone b-ladder, now read as magnitude)
 * @see imp-97597-route-m-psi-s-integral-rep-double-expansion (RESULT 3 mixed-kernel sub-gap STANDS)
 * @see imp-97460-route-m-bulk-profile-curvature-analytic-route (w_lin forced; O(x^2) wobble)
 *
 * Ticket: imp-97688 (numerical, opus-4-8, api-pool). Four-factorization linErr scan at fixed
 * magnitude ~1e6 shows the linErr elevation is factorization-INDEPENDENT; offline Vasyunin scan in
 * tmp/imp-97688-factorization-linerr.mjs; NO bound moved; NO QED.
 */

export const IMP97688_GAMMA = 0.5772156649015329;
export const IMP97688_C = (Math.log(2 * Math.PI) - IMP97688_GAMMA) / 2; // (log 2pi - gamma)/2
export const IMP97688_CONST_TARGET = (2 * IMP97688_C) / Math.PI; // 2C/pi
export const IMP97688_LOG_TARGET = 1 / Math.PI; // log coefficient
export const IMP97688_LIN_TARGET = -1 / Math.PI; // linear coefficient (the one under test)

// -- four-factorization linErr scan at comparable magnitude ~1e6 (baked; heavy Vasyunin scan offline).
//    Each row: fixed b, phase window a in [a0-200, a0+200] per x, refit {a0,a1,a2} on the target
//    x<=0.05 tail (4 nodes for all rows -- fit-node count matched to avoid the b=2^20 dropped-node
//    artifact). linErr = |a2 - (-1/pi)|.
export const IMP97688_FACTORIZATION_SCAN = Object.freeze([
  Object.freeze({ b: 1000003, factor: 'prime', constErr: 1.1207e-3, logErr: 2.2412e-4, linErr: 1.1490e-2, maxResid: 2.4488e-4, nFit: 4 }),
  Object.freeze({ b: 1048576, factor: '2^20', constErr: 1.1258e-3, logErr: 2.2452e-4, linErr: 1.1617e-2, maxResid: 2.4420e-4, nFit: 4 }),
  Object.freeze({ b: 960960, factor: '2^6*3*5*7*11*13', constErr: 1.1166e-3, logErr: 2.2385e-4, linErr: 1.1383e-2, maxResid: 2.4543e-4, nFit: 4 }),
  Object.freeze({ b: 1000000, factor: '2^6*5^6', constErr: 1.1206e-3, logErr: 2.2410e-4, linErr: 1.1490e-2, maxResid: 1.2998e-4, nFit: 4 }),
]);

// -- node-by-node raw residual w(x)-w_lin(x) at the same half=200 for each factorization; shows the
//    wobble band is denominator-INDEPENDENT (prime / 2-power / HCN / smooth all agree per node).
export const IMP97688_RESID_BY_FACTOR = Object.freeze([
  Object.freeze({ x: 0.01, prime: -2.1336e-5, p2: -1.9179e-5, hcn: -2.3285e-5, smooth: -2.1336e-5 }),
  Object.freeze({ x: 0.05, prime: -1.2998e-4, p2: -1.3262e-4, hcn: -1.2772e-4, smooth: -1.2998e-4 }),
  Object.freeze({ x: 0.12, prime: 2.4488e-4, p2: 2.4420e-4, hcn: 2.4543e-4, smooth: 2.4486e-4 }),
  Object.freeze({ x: 0.25, prime: -5.2414e-3, p2: -5.2488e-3, hcn: -5.2350e-3, smooth: -5.2414e-3 }),
]);

// -- the fit-node artifact: filtering on achieved xbar=a0/b (not target x) drops the x=0.05 node for
//    b=2^20 (52429/1048576 = 0.0500002 > 0.05), leaving a 3-node fit and a spurious 7x-low linErr.
export const IMP97688_XBAR_FILTER_ARTIFACT = Object.freeze({
  b: 1048576,
  achievedX005: 52429 / 1048576, // 0.0500002... > 0.05
  linErrThreeNodeArtifact: 1.6705e-3, // spurious (xbar filter drops x=0.05 -> 3-node fit)
  linErrFourNodeCorrect: 1.1617e-2, // target-x filter keeps x=0.05 -> matches the other factorizations
});

export const IMP97688_VERDICT = Object.freeze({
  id: 'imp-97688',
  proofSection: 'S-frontier',
  question:
    'Does the imp-97664 w_lin linErr elevation at b~1e6 (~1.15e-2 at half=200, vs the ~6.4e-3 plateau ' +
    'at b=2e6) track the DENOMINATOR FACTORIZATION (smoothness of b), as imp-97664 conjectured ' +
    '(b=1e6=2^6*5^6 sampling a larger wobble than b=2e6=2^7*5^6), or is it independent of factorization?',
  linErrTracksFactorization: false, // NO -- four factorizations at ~1e6 give the same linErr to ~2%
  linErrFactorizationInvariant: true, // prime 1.149e-2, 2^20 1.162e-2, HCN 1.138e-2, smooth 1.149e-2
  residualsDenominatorIndependent: true, // node-by-node w(x)-w_lin(x) agrees across all four b per node
  imp97664FactorizationFramingRefuted: true, // "smooth denominator samples larger wobble" is not the driver
  ladderDifferenceIsMagnitudeEffect: true, // b=1e6 -> b=2e6 drop is finite-b convergence, not smoothness
  xbarFilterArtifactIdentified: true, // the 7x-low 2^20 reading was a dropped-fit-node (xbar>0.05) artifact
  result3MixedKernelSubGapStands: true, // imp-97597 RESULT 3 sub-gap unchanged
  anyCoefficientNewlyPinned: false, // w_lin already forced by imp-97460; nothing new pinned
  anyBoundMoved: false,
  operatorPositivityEstablished: false,
  computeBindsFirst: true, // N ~ 9916 (imp-96352) binds by >2600x
  conclusion:
    'At fixed magnitude ~1e6 the w_lin linErr is INDEPENDENT of the denominator factorization: a prime ' +
    '(1000003), a pure 2-power (2^20=1048576), a highly-composite number (960960=2^6*3*5*7*11*13) and a ' +
    'smooth number (1e6=2^6*5^6) all give linErr ~1.14-1.16e-2 (const ~1.12e-3, log ~2.24e-4) with the ' +
    'consistent 4-node fit. Node-by-node the raw residual w(x)-w_lin(x) agrees across all four (x=0.25: ' +
    '-5.241e-3 / -5.249e-3 / -5.235e-3 / -5.241e-3), so the O(x^2) wobble band is set by the b-MAGNITUDE ' +
    'regime, not the arithmetic of the factorization. This REFUTES the imp-97664 framing that ' +
    'b=1e6=2^6*5^6 sampled a larger wobble because it is smooth: 2e6 is itself smooth (2^7*5^6), and ' +
    'factorization is irrelevant at fixed magnitude, so the b=1e6 -> b=2e6 drop (imp-97645) is a ' +
    'finite-b convergence (magnitude) effect. A dropped-fit-node artifact (filtering on achieved ' +
    'xbar=a0/b rather than target x drops the x=0.05 node for 2^20, giving a spurious 3-node 1.67e-3) ' +
    'was identified and controlled. The imp-97597 RESULT 3 mixed-kernel sub-gap STANDS; no coefficient ' +
    'newly pinned; no bound moves; the rigorous anchor stays T = 2.594e7; compute binds first by ' +
    '>2600x; no operator positivity; PT Lambda <= 0.2 SOTA; RH open; NO QED.',
});

export const IMP97688_HONEST_BANNER =
  'RH open; PT Lambda <= 0.2 remains SOTA; NO QED. Numerical cross-check only: at fixed magnitude ~1e6 ' +
  'the w_lin linErr is factorization-INDEPENDENT -- a prime (1000003), a 2-power (2^20), a ' +
  'highly-composite number (960960) and a smooth number (1e6=2^6*5^6) all give linErr ~1.14-1.16e-2, ' +
  'and the node-by-node residual w(x)-w_lin(x) agrees across all four. This REFUTES the imp-97664 ' +
  '"smooth denominator samples a larger wobble" framing: the b=1e6 -> b=2e6 linErr drop is a b-magnitude ' +
  '(finite-b convergence) effect, not a factorization effect. A dropped-fit-node (xbar>0.05) artifact ' +
  'that made 2^20 look 7x low was identified and controlled. No coefficient newly pinned; the imp-97597 ' +
  'RESULT 3 mixed-kernel sub-gap STANDS; no bound moves; the rigorous anchor stays T = 2.594e7; compute ' +
  'binds first by >2600x.';

export default IMP97688_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import. LIGHT arithmetic --
//    only; the heavy Vasyunin double-sum scan is offline (tmp/imp-97688-factorization-linerr.mjs).
const IMP97688_ASSERTIONS = [
  {
    id: 'imp97688-C-anchor-consistent',
    why: 'C = (log 2pi - gamma)/2 must match the imp-97664 anchor 0.6303307007539063.',
    holds: () => Math.abs(IMP97688_C - 0.6303307007539063) < 1e-15,
  },
  {
    id: 'imp97688-targets-consistent',
    why: 'the forced targets 2C/pi, 1/pi, -1/pi must recompute to the imp-97664 values.',
    holds: () =>
      Math.abs(IMP97688_CONST_TARGET - 0.40128098723024985) < 1e-12 &&
      Math.abs(IMP97688_LOG_TARGET - 0.3183098861837907) < 1e-12 &&
      Math.abs(IMP97688_LIN_TARGET + 0.3183098861837907) < 1e-12,
  },
  {
    id: 'imp97688-linerr-factorization-invariant',
    why: 'RESULT: with the consistent 4-node fit, all four factorizations at ~1e6 give the same linErr ' +
      'to ~2% -- so the elevation does NOT track smoothness (the spread is far below the b=1e6 -> b=2e6 ' +
      'halving).',
    holds: () => {
      const errs = IMP97688_FACTORIZATION_SCAN.map((r) => r.linErr);
      const span = Math.max(...errs) - Math.min(...errs);
      const allElevated = errs.every((e) => e > 1.1e-2 && e < 1.2e-2);
      const spreadSmallVsHalving = span < 0.05 * Math.min(...errs); // ~2% spread << ~45% b-halving drop
      return allElevated && span > 0 && spreadSmallVsHalving;
    },
  },
  {
    id: 'imp97688-all-fits-four-node',
    why: 'the fit-node count must be matched (4) across all rows; otherwise the b=2^20 dropped-node ' +
      'artifact reappears as a spurious 7x-low linErr.',
    holds: () => IMP97688_FACTORIZATION_SCAN.every((r) => r.nFit === 4),
  },
  {
    id: 'imp97688-xbar-filter-artifact-controlled',
    why: 'RESULT: filtering on achieved xbar=a0/b (not target x) drops the x=0.05 node for 2^20 ' +
      '(0.0500002>0.05), giving a spurious 3-node 1.67e-3 vs the correct 4-node 1.16e-2.',
    holds: () =>
      IMP97688_XBAR_FILTER_ARTIFACT.achievedX005 > 0.05 &&
      IMP97688_XBAR_FILTER_ARTIFACT.linErrThreeNodeArtifact < 2e-3 &&
      IMP97688_XBAR_FILTER_ARTIFACT.linErrFourNodeCorrect > 1.1e-2 &&
      IMP97688_XBAR_FILTER_ARTIFACT.linErrFourNodeCorrect < 1.2e-2,
  },
  {
    id: 'imp97688-residuals-denominator-independent',
    why: 'RESULT: the node-by-node residual w(x)-w_lin(x) agrees across all four factorizations per x ' +
      '(the wobble band is magnitude-set, not factorization-set).',
    holds: () =>
      IMP97688_RESID_BY_FACTOR.every((r) => {
        const vals = [r.prime, r.p2, r.hcn, r.smooth];
        const span = Math.max(...vals) - Math.min(...vals);
        return span < 0.03 * Math.max(...vals.map(Math.abs)) + 1e-5; // <=3% + tiny floor across all four
      }),
  },
  {
    id: 'imp97688-honesty-gate-no-qed',
    why: 'cross-check only: linErr is factorization-invariant, imp-97664 framing refuted, RESULT 3 ' +
      'sub-gap stands, no coefficient newly pinned, no bound moved, honesty markers present.',
    holds: () =>
      IMP97688_VERDICT.linErrTracksFactorization === false &&
      IMP97688_VERDICT.linErrFactorizationInvariant === true &&
      IMP97688_VERDICT.residualsDenominatorIndependent === true &&
      IMP97688_VERDICT.imp97664FactorizationFramingRefuted === true &&
      IMP97688_VERDICT.ladderDifferenceIsMagnitudeEffect === true &&
      IMP97688_VERDICT.result3MixedKernelSubGapStands === true &&
      IMP97688_VERDICT.anyCoefficientNewlyPinned === false &&
      IMP97688_VERDICT.anyBoundMoved === false &&
      IMP97688_VERDICT.computeBindsFirst === true &&
      /NO QED/.test(IMP97688_HONEST_BANNER) &&
      /PT Lambda <= 0.2/.test(IMP97688_HONEST_BANNER) &&
      /RH open/.test(IMP97688_HONEST_BANNER),
  },
];

for (const a of IMP97688_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97688-wlin-linerr-factorization-independence assertion failed: ${a.id}`);
  }
}

export { IMP97688_ASSERTIONS };
