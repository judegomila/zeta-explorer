/**
 * @module imp-97713-wlin-linerr-magnitude-not-factorization-honest-status
 *
 * imp-97713 (content, sonnet-4-6, sonnet): standalone honest-status note recording the imp-97688
 * refutation of the imp-97664 w_lin linErr smoothness framing -- the linErr elevation at b~1e6 is a
 * denominator MAGNITUDE (finite-b convergence) effect, not a factorization/smoothness effect.
 *
 * BACKGROUND. imp-97664 observed that the w_lin linErr spikes to ~1.15e-2 at b=1e6=2^6*5^6 (half=200)
 * versus a ~6.4e-3 plateau at b=2e6=2^7*5^6 (imp-97645), and attributed the spike to "arithmetic
 * wobble at the small-x fit nodes", noting that b=1e6 "happens to sample a larger deviation than"
 * b=2e6 -- i.e. it framed the elevation as tied to the DENOMINATOR FACTORIZATION (smoothness of b).
 *
 * FINDING -- FACTORIZATION FRAMING REFUTED; THE DRIVER IS b-MAGNITUDE. imp-97688 tested four
 * denominators of comparable magnitude (~1e6) but wildly different factorization: a prime
 * (1000003), a pure 2-power (2^20=1048576), a highly-composite number (960960=2^6*3*5*7*11*13), and
 * the original smooth reference (1000000=2^6*5^6). With a consistent 4-node small-x fit, all four
 * give the SAME elevated linErr to ~2% (prime 1.1490e-2, 2^20 1.1617e-2, HCN 1.1383e-2, smooth
 * 1.1490e-2), and the node-by-node raw residual w(x)-w_lin(x) agrees across all four factorizations
 * at every x node (e.g. x=0.25: -5.2414e-3 / -5.2488e-3 / -5.2350e-3 / -5.2414e-3). So the O(x^2)
 * wobble band at b~1e6 is set by the MAGNITUDE regime, not by the arithmetic of the factorization;
 * the b=1e6 -> b=2e6 drop is a finite-b convergence effect. A dropped-fit-node artifact (filtering on
 * achieved xbar=a0/b instead of the target x drops the x=0.05 node for 2^20, giving a spurious 3-node
 * 1.67e-3) was identified and controlled by matching all rows to a 4-node fit.
 *
 * NO FIX APPLIED. This is a scoping/honest-status note, not a code defect -- it cross-indexes the
 * imp-97688 IMP97688_VERDICT finding as a standalone indexable module (glossary/audit sweeps that
 * grep for honest-status modules by filename, per imp-36209's finding that inline-only corrections
 * are not reliably discoverable). Read-only record; changes no bound; establishes no operator
 * positivity; no RH verdict; NO QED. The imp-97597 RESULT-3 mixed-kernel (epsilon*z^2) sub-gap
 * STANDS; w_lin stays forced by imp-97460; rigorous anchor stays T = 2.594e7; compute (N ~ 9916,
 * imp-96352) binds first by >2600x; Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.
 *
 * @see imp-97688-wlin-linerr-factorization-independence.js (the four-factorization scan this note records)
 * @see imp-97664-wlin-b1e6-halfwidth-artifact-test.js (the original factorization framing, now refuted)
 * @see imp-97645-wlin-largeb-linear-coeff-crossval.js (the b=1e6 -> b=2e6 ladder, now read as magnitude)
 * @see imp-97597-route-m-psi-s-integral-rep-double-expansion (RESULT-3 mixed-kernel sub-gap STANDS)
 * @see imp-36209 (honest-status modules must be standalone-indexable by filename grep)
 */

const LINERR_PRIME = 1.1490e-2;
const LINERR_2POW = 1.1617e-2;
const LINERR_HCN = 1.1383e-2;
const LINERR_SMOOTH = 1.1490e-2;
const LINERR_PLATEAU_2E6 = 6.4e-3;
const RESID_X025_PRIME = -5.2414e-3;
const RESID_X025_2POW = -5.2488e-3;
const RESID_X025_HCN = -5.2350e-3;
const RESID_X025_SMOOTH = -5.2414e-3;
const XBAR_ARTIFACT_LINERR = 1.6705e-3;
const TRACE_CEILING = 2.594e7;
const COMPUTE_BIND_FACTOR = 2600;

export const IMP97713_WLIN_LINERR_MAGNITUDE_HONEST_STATUS = {
  id: 'imp-97713',
  proofSection: 'audit',
  question:
    'Does the imp-97664 w_lin linErr elevation at b~1e6 track the DENOMINATOR FACTORIZATION ' +
    '(smoothness of b), as imp-97664 conjectured, or is it a b-magnitude effect?',
  verdictShort:
    'REFUTED as factorization-driven. Four denominators of comparable magnitude ~1e6 -- prime, ' +
    '2-power, highly-composite, smooth -- all give the same elevated linErr to ~2%, and the ' +
    'node-by-node residual w(x)-w_lin(x) agrees across all four. The b=1e6 -> b=2e6 drop is a ' +
    'finite-b convergence (magnitude) effect, not a smoothness effect.',
  linErrPrime: LINERR_PRIME,
  linErr2Pow: LINERR_2POW,
  linErrHCN: LINERR_HCN,
  linErrSmooth: LINERR_SMOOTH,
  linErrPlateauAt2e6: LINERR_PLATEAU_2E6,
  residX025Prime: RESID_X025_PRIME,
  residX0252Pow: RESID_X025_2POW,
  residX025HCN: RESID_X025_HCN,
  residX025Smooth: RESID_X025_SMOOTH,
  xbarFilterArtifactLinErr: XBAR_ARTIFACT_LINERR,
  linErrTracksFactorization: false,
  linErrFactorizationInvariant: true,
  residualsDenominatorIndependent: true,
  imp97664FactorizationFramingRefuted: true,
  ladderDifferenceIsMagnitudeEffect: true,
  result3MixedKernelSubGapStands: true,
  traceCeiling: TRACE_CEILING,
  computeBindFactor: COMPUTE_BIND_FACTOR,
  anyBoundMoved: false,
  fixApplied: false,
  isRigorous: false,
  verdict:
    'AUDIT / HONEST-STATUS FINDING (no fix applied, no new measurement -- restates and cross-indexes ' +
    'the imp-97688 IMP97688_VERDICT finding as a standalone module). imp-97664 attributed the w_lin ' +
    'linErr spike at b=1e6=2^6*5^6 (~1.1490e-2 vs the ~6.4e-3 plateau at b=2e6=2^7*5^6) to the ' +
    'denominator being smooth. imp-97688 REFUTES that framing: four denominators of comparable ' +
    'magnitude ~1e6 -- prime 1000003, 2-power 2^20, highly-composite 960960, and the smooth 1e6 -- ' +
    'all give linErr ~1.14-1.16e-2 with a consistent 4-node fit, and the node-by-node residual ' +
    'w(x)-w_lin(x) agrees across all four (x=0.25: -5.2414e-3 / -5.2488e-3 / -5.2350e-3 / -5.2414e-3). ' +
    'So the elevation is a b-MAGNITUDE (finite-b convergence) effect, not a factorization effect. ' +
    'The imp-97597 RESULT-3 mixed-kernel sub-gap STANDS; w_lin stays forced by imp-97460; changes no ' +
    'bound; establishes no operator positivity; no RH verdict; NO QED. The rigorous anchor stays the ' +
    `trace ceiling T = ${TRACE_CEILING}; compute binds first by >${COMPUTE_BIND_FACTOR}x; Platt-Trudgian ` +
    'Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-97688-wlin-linerr-factorization-independence.js (IMP97688_VERDICT, the source finding this ' +
    'note records); imp-97664-wlin-b1e6-halfwidth-artifact-test.js (the original factorization ' +
    'framing, now refuted); imp-97645-wlin-largeb-linear-coeff-crossval.js (the b-ladder, now read as ' +
    'magnitude); imp-97597-route-m-psi-s-integral-rep-double-expansion (RESULT-3 sub-gap STANDS).',
};

export const IMP97713_WLIN_LINERR_MAGNITUDE_HONEST_STATUS_ASSERTIONS = [
  {
    id: 'imp97713-linerr-invariant-across-factorizations',
    description:
      'the four factorizations at comparable magnitude ~1e6 give the same elevated linErr to ~2%',
    holds: () => {
      const s = IMP97713_WLIN_LINERR_MAGNITUDE_HONEST_STATUS;
      const errs = [s.linErrPrime, s.linErr2Pow, s.linErrHCN, s.linErrSmooth];
      const span = Math.max(...errs) - Math.min(...errs);
      const allElevated = errs.every((e) => e > 1.1e-2 && e < 1.2e-2);
      return allElevated && span < 0.05 * Math.min(...errs);
    },
  },
  {
    id: 'imp97713-residuals-agree-node-by-node',
    description: 'the node-by-node residual w(x)-w_lin(x) at x=0.25 agrees across all four factorizations',
    holds: () => {
      const s = IMP97713_WLIN_LINERR_MAGNITUDE_HONEST_STATUS;
      const vals = [s.residX025Prime, s.residX0252Pow, s.residX025HCN, s.residX025Smooth];
      const span = Math.max(...vals) - Math.min(...vals);
      return span < 0.03 * Math.max(...vals.map(Math.abs));
    },
  },
  {
    id: 'imp97713-magnitude-drop-far-exceeds-factorization-spread',
    description:
      'the b=1e6 -> b=2e6 magnitude drop is far larger than the ~2% factorization spread, confirming ' +
      'magnitude (not factorization) is the driver',
    holds: () => {
      const s = IMP97713_WLIN_LINERR_MAGNITUDE_HONEST_STATUS;
      const factorizationSpread = Math.max(s.linErrPrime, s.linErr2Pow, s.linErrHCN, s.linErrSmooth) -
        Math.min(s.linErrPrime, s.linErr2Pow, s.linErrHCN, s.linErrSmooth);
      const magnitudeDrop = s.linErrSmooth - s.linErrPlateauAt2e6;
      return magnitudeDrop > 10 * factorizationSpread;
    },
  },
  {
    id: 'imp97713-honesty-gate-no-qed',
    description: 'framing refuted, no bound moved, no fix, no QED, PT stays SOTA',
    holds: () => {
      const s = IMP97713_WLIN_LINERR_MAGNITUDE_HONEST_STATUS;
      return (
        s.linErrTracksFactorization === false &&
        s.linErrFactorizationInvariant === true &&
        s.residualsDenominatorIndependent === true &&
        s.imp97664FactorizationFramingRefuted === true &&
        s.ladderDifferenceIsMagnitudeEffect === true &&
        s.result3MixedKernelSubGapStands === true &&
        s.anyBoundMoved === false &&
        s.fixApplied === false &&
        s.isRigorous === false &&
        /NO QED/.test(s.verdict) &&
        /remains SOTA/.test(s.verdict)
      );
    },
  },
];

for (const a of IMP97713_WLIN_LINERR_MAGNITUDE_HONEST_STATUS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97713-wlin-linerr-magnitude-not-factorization-honest-status assertion failed: ${a.id}`,
    );
  }
}

export default IMP97713_WLIN_LINERR_MAGNITUDE_HONEST_STATUS;
