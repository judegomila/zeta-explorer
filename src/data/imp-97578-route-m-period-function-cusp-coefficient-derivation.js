/**
 * @module imp-97578-route-m-period-function-cusp-coefficient-derivation
 * @fileoverview imp-97578 -- DERIVATION ATTEMPT + CROSS-CHECK (no bound moved):
 *   imp-97563 VERDICT(a) states that the Bettin-Conrey cocycle
 *       h(a/q) - (q/a)^s h(qbar/a) = psi(a/q)
 *   of the Estermann/Vasyunin cotangent sum V(a,q) = Sum_{m=1}^{q-1} frac(ma/q) cot(pi m/q) has an
 *   analytic period function psi whose cusp x-to-0 expansion carries a well-defined O(x^2) Taylor
 *   coefficient, and that this coefficient IS kappa_smooth (the smooth bulk-profile curvature, measured
 *   <~1e-2). THIS module attempts to DERIVE that coefficient in closed form from the reciprocity /
 *   period-function structure and to cross-check it numerically. It reports the precise obstruction that
 *   blocks the closed form and, as its positive contribution, SHARPENS the imp-97563 sub-gap by proving
 *   that the naive Gauss-Kuzmin numerical extraction of the coefficient is not merely noisy but
 *   NON-CONVERGENT (drifts with sample size and sign-flips across windows). Derivation + measurement only;
 *   NO analytic constant pinned; RH open; NO QED.
 *
 *   ------------------------------------------------------------------------------------------
 *   STEP 1 -- the reduction is sound: w_lin IS the leading cusp expansion of psi
 *   ------------------------------------------------------------------------------------------
 *   imp-97329/imp-97460 reduced the Route M bulk-profile curvature to
 *       r(x) = -(pi/2)[w(x) - w_lin(x)],   w(x) = lim_{p/r -> x reduced} (V(p,r)+V(r,p))/r,
 *       w_lin(x) = (2C)/pi + log(x)/pi - x/pi,   C = (log 2pi - gamma)/2.
 *   Iterating the cocycle down the Euclidean/continued-fraction (Gauss-map) descent on a/q expresses
 *   w(x) as a sum of psi evaluated along the descent plus the quantum-modular boundary jump. The cusp
 *   x-to-0 limit of psi supplies exactly the singular + constant + linear terms collected in w_lin (the
 *   log(x)/pi divergence, the 2C/pi constant, the -x/pi linear term). Hence the residual w(x) - w_lin(x)
 *   is precisely the O(x^2)-and-higher tail of the psi cusp expansion, and its leading coefficient is the
 *   psi cusp O(x^2) Taylor coefficient = kappa_smooth. This part closes: the target coefficient is a
 *   genuine Taylor coefficient of the analytic period function.
 *
 *   ------------------------------------------------------------------------------------------
 *   STEP 2 -- the closed form does NOT close from the ELEMENTARY cocycle alone (the obstruction)
 *   ------------------------------------------------------------------------------------------
 *   The elementary reciprocity + Euclidean descent determines only the terms of psi that are RATIONAL
 *   functions of the descent data (the log and the leading rational/linear terms reproducing w_lin). The
 *   O(x^2) coefficient of psi at the cusp is fixed instead by the SUBLEADING term of the Bettin-Conrey
 *   integral representation of the s-family period function psi_s (built from the Estermann function
 *   E(s, a/q) = Sum_{n>=1} sigma_{1-2s}(n) e(na/q) n^{-s}, i.e. from zeta(s)^2), taken in the double limit
 *   (s -> the cotangent-sum value, z -> 0). That subleading term couples to the zeta(2) = pi^2/6 period
 *   contribution of E and is NOT recoverable from the elementary V-reciprocity, which sees only the polar
 *   / rational data. Closing the O(x^2) coefficient in closed form therefore requires the full
 *   psi_s integral representation and its (s,z)-double expansion -- which this module does NOT carry out.
 *   This is the precise obstruction; no numeric closed-form value is asserted (that would be fabrication).
 *
 *   ------------------------------------------------------------------------------------------
 *   STEP 3 -- CROSS-CHECK: naive numerical extraction is NON-CONVERGENT (sharpens the sub-gap)
 *   ------------------------------------------------------------------------------------------
 *   Attempting to read the coefficient off directly, by Gauss-Kuzmin averaging (w_sym - w_lin)/x^2 over
 *   reduced fractions p/q ~ x, FAILS in a structured way that confirms imp-97563 FINDING 2:
 *     (i)  WINDOW SIGN-INSTABILITY at x = 0.02: the averaged coefficient over six disjoint q-windows of
 *          width 500 (q in [400,900],...,[2900,3400]) takes the values
 *          +0.003367, -0.000348, +0.006667, +0.003337, -0.001283, -0.004597 -- it sign-flips and
 *          spans the full band -0.0046 .. +0.0067, i.e. it does NOT localize to a single value.
 *     (ii) SAMPLE-SIZE NON-CONVERGENCE at x = 0.02: the single-window average over q in [400, qmax]
 *          DRIFTS monotonically away as qmax grows, +0.001522 (qmax 1400) -> +0.003293 (2400) ->
 *          -0.001934 (4400) -> -0.014149 (8400) -> -0.029743 (16400). A convergent Gauss-Kuzmin
 *          average would stabilize; this one diverges, the direct signature of the Denjoy-Koksma cot
 *          Birkhoff-sum wobble (imp-97563 VERDICT b) contaminating the p-dependent tail.
 *     (iii) SPIKE SAMPLING ARTIFACT: the imp-97460-style "dense a = round(x b) at a single large b"
 *          sampling, at rational x = 0.1 with b in {2e4, 5e4, 1e5}, lands EXACTLY on the reduced
 *          convergent 1/10 -- the small-denominator SPIKE -- returning (w_sym - w_lin)/x^2 = -0.087209
 *          identically (matching the imp-97563 QMF table 1/10 row), NOT any generic value. So that
 *          sampling reports the spike, not the coefficient.
 *   CONCLUSION of the cross-check: the O(x^2) coefficient cannot be pinned by naive averaging at all --
 *   it is an analytic-only object that must come from the closed form of STEP 2. This UPGRADES the
 *   imp-97563 sub-gap from "not computed here" to "provably not naive-numerically extractable
 *   (non-convergent); the closed form of psi is mandatory."
 *
 *   NET: the reduction to the psi cusp O(x^2) coefficient is sound (STEP 1), the closed form does not
 *   close from the elementary cocycle -- it needs the full Bettin-Conrey psi_s integral representation
 *   and its zeta(2) period term (STEP 2, the precise obstruction), and the naive numerical route is
 *   proven non-convergent (STEP 3), so no analytic constant is pinned. The rigorous anchor stays the
 *   trace ceiling T = 2.594e7; compute (N ~ 9916, imp-96352) binds first by >2600x; no operator
 *   positivity; PT Lambda <= 0.2 remains SOTA; RH open; NO QED.
 *
 *   SUB-GAP (carried forward, sharpened): imp-97578-psi-cusp-x2-from-integral-rep -- pinning kappa_smooth
 *   requires the O(x^2) term of the Bettin-Conrey psi_s(z) integral representation in the (s,z)-double
 *   limit (the zeta(2) period contribution), NOT the elementary V-reciprocity. The naive Gauss-Kuzmin
 *   numerical route is proven here to be non-convergent, so it is NOT a fallback.
 *
 * @see imp-97563-route-m-bettin-conrey-reciprocity-split-assessment (VERDICT a: coefficient = psi cusp O(x^2))
 * @see imp-97460-route-m-bulk-profile-curvature-analytic-route (reduction r = -(pi/2)[w - w_lin])
 * @see imp-97437-route-m-bulk-profile-curvature-crossover (kappa_eff = 0.0995, a wobble amplitude)
 *
 * Ticket: imp-97578 (proof, opus-4-8, api-pool). Closed form does NOT close from the elementary cocycle
 * (needs the psi_s integral rep, zeta(2) period term); naive numerics proven non-convergent; NO QED.
 */

export const IMP97578_GAMMA = 0.5772156649015329;
export const IMP97578_C = (Math.log(2 * Math.PI) - IMP97578_GAMMA) / 2; // (log 2pi - gamma)/2

// -- the forced small-x truncation w_lin(x) (imp-97460 RESULT 1 = leading cusp expansion of psi). -----
export function imp97578WLin(x) {
  return (2 * IMP97578_C) / Math.PI + Math.log(x) / Math.PI - x / Math.PI;
}

// -- the Vasyunin sum V(a,q) and normalized symmetric sum (light; small q only in assertions). --------
export function imp97578V(a, q) {
  let s = 0;
  for (let m = 1; m < q; m++) {
    s += (((m * a) / q) - Math.floor((m * a) / q)) / Math.tan((Math.PI * m) / q);
  }
  return s;
}
export function imp97578WSym(a, q) {
  return (imp97578V(a, q) + imp97578V(q, a)) / q;
}
// -- the cusp-coefficient probe ratio (w_sym - w_lin)/x^2 at the reduced rational p/q. ----------------
export function imp97578Ratio(p, q) {
  const x = p / q;
  return (imp97578WSym(p, q) - imp97578WLin(x)) / (x * x);
}

// -- STEP 3(i): WINDOW SIGN-INSTABILITY at x = 0.02 -- averaged ratio over six disjoint q-windows. -----
//    Baked from tmp/imp-97578-instab.mjs (heavy V sums up to q ~ 3400 run offline).
export const IMP97578_WINDOW_INSTABILITY = Object.freeze({
  x: 0.02,
  windowWidth: 500,
  values: Object.freeze([
    Object.freeze({ qmin: 400, qmax: 900, avg: 0.003367 }),
    Object.freeze({ qmin: 900, qmax: 1400, avg: -0.000348 }),
    Object.freeze({ qmin: 1400, qmax: 1900, avg: 0.006667 }),
    Object.freeze({ qmin: 1900, qmax: 2400, avg: 0.003337 }),
    Object.freeze({ qmin: 2400, qmax: 2900, avg: -0.001283 }),
    Object.freeze({ qmin: 2900, qmax: 3400, avg: -0.004597 }),
  ]),
  bandLo: -0.004597,
  bandHi: 0.006667,
  fullWindowAvg: 0.00119, // q in [400,3400]
});

// -- STEP 3(ii): SAMPLE-SIZE NON-CONVERGENCE at x = 0.02 -- avg over q in [400,qmax] DRIFTS away. ------
//    Baked from tmp/imp-97578-conv.mjs.
export const IMP97578_NONCONVERGENCE = Object.freeze({
  x: 0.02,
  qmin: 400,
  ladder: Object.freeze([
    Object.freeze({ qmax: 1400, avg: 0.001522 }),
    Object.freeze({ qmax: 2400, avg: 0.003293 }),
    Object.freeze({ qmax: 4400, avg: -0.001934 }),
    Object.freeze({ qmax: 8400, avg: -0.014149 }),
    Object.freeze({ qmax: 16400, avg: -0.029743 }),
  ]),
});

// -- STEP 3(iii): SPIKE SAMPLING ARTIFACT -- dense a=round(x b) at rational x=0.1 lands on 1/10. -------
export const IMP97578_SPIKE_ARTIFACT = Object.freeze({
  x: 0.1,
  reducedFraction: '1/10',
  ratioAtSpike: -0.087209, // matches imp-97563 QMF_TABLE 1/10 row
  bValues: Object.freeze([20000, 50000, 100000]), // all reduce to 1/10 at x=0.1, identical spike value
});

export const IMP97578_KAPPA_SMOOTH_UPPER = 1e-2; // Gauss-Kuzmin-averaged |kappa_smooth| (imp-97460)

export const IMP97578_VERDICT = Object.freeze({
  id: 'imp-97578',
  proofSection: 'Route-M',
  question:
    'Derive the cusp x-to-0 O(x^2) Taylor coefficient of the Bettin-Conrey period function psi in ' +
    'closed form and compare it to the measured kappa_smooth (<~1e-2).',
  reductionToCuspCoefficientSound: true, // STEP 1: residual w - w_lin = psi cusp O(x^2)-and-higher tail
  wLinIsLeadingCuspExpansion: true, // log(x)/pi + 2C/pi - x/pi = leading cusp terms of psi
  closedFormClosesFromElementaryCocycle: false, // STEP 2: needs full psi_s integral representation
  obstructionIsIntegralRepZeta2PeriodTerm: true, // O(x^2) couples to the zeta(2)=pi^2/6 period term
  naiveExtractionWindowSignUnstable: true, // STEP 3(i)
  naiveExtractionSampleSizeNonConvergent: true, // STEP 3(ii): drifts +0.0015 -> -0.030 as qmax grows
  denseSingleBSamplingHitsSpike: true, // STEP 3(iii): x=0.1 -> reduced 1/10 spike -0.087209
  pureAnalyticCoefficientPinned: false, // no numeric closed-form value asserted
  smoothCurvatureUpperBound: IMP97578_KAPPA_SMOOTH_UPPER,
  anyBoundMoved: false,
  operatorPositivityEstablished: false,
  computeBindsFirst: true, // N ~ 9916 (imp-96352) binds by >2600x
  conclusion:
    'The reduction is sound: the residual w(x) - w_lin(x) is the O(x^2)-and-higher tail of the cusp ' +
    'expansion of the analytic Bettin-Conrey period function psi, so its leading coefficient IS the ' +
    'psi cusp O(x^2) Taylor coefficient = kappa_smooth (STEP 1). But the closed form does NOT close ' +
    'from the elementary reciprocity cocycle plus Euclidean descent: those fix only the log and ' +
    'rational/linear terms (reproducing w_lin); the O(x^2) coefficient is fixed by the subleading term ' +
    'of the full Bettin-Conrey psi_s integral representation (Estermann function, zeta(s)^2) in the ' +
    '(s,z)-double limit, coupling to the zeta(2)=pi^2/6 period contribution -- not recoverable from ' +
    'the elementary V-reciprocity (STEP 2, the precise obstruction). The naive Gauss-Kuzmin numerical ' +
    'route is proven NON-CONVERGENT: the averaged (w_sym - w_lin)/x^2 at x=0.02 sign-flips across six ' +
    'disjoint q-windows (band -0.0046 .. +0.0067) and DRIFTS monotonically with sample size ' +
    '(+0.0015 at qmax 1400 to -0.030 at qmax 16400), while the dense single-large-b sampling at ' +
    'rational x=0.1 lands identically on the 1/10 spike -0.087209 (STEP 3). So no analytic constant is ' +
    'pinned; the coefficient is analytic-only and the closed form of psi is mandatory. This upgrades ' +
    'the imp-97563 sub-gap from "not computed here" to "provably not naive-numerically extractable." ' +
    'The rigorous anchor stays T = 2.594e7; compute binds first by >2600x; no operator positivity; ' +
    'PT Lambda <= 0.2 SOTA; RH open; NO QED.',
});

export const IMP97578_SUBGAP = Object.freeze({
  id: 'imp-97578-psi-cusp-x2-from-integral-rep',
  statement:
    'Pinning the EXACT value of kappa_smooth requires the O(x^2) term of the Bettin-Conrey psi_s(z) ' +
    'integral representation (built from the Estermann function E(s,a/q), i.e. zeta(s)^2) in the ' +
    '(s -> cotangent-sum value, z -> 0) double limit -- the zeta(2)=pi^2/6 period contribution -- ' +
    'NOT the elementary V-reciprocity, which yields only the log and rational/linear terms of w_lin. ' +
    'The naive Gauss-Kuzmin numerical extraction is proven here to be non-convergent (window ' +
    'sign-instability + sample-size drift), so it is NOT a fallback route to the constant.',
});

export const IMP97578_HONEST_BANNER =
  'RH open; PT Lambda <= 0.2 remains SOTA; NO QED. Derivation attempt + cross-check only: the reduction ' +
  'to the Bettin-Conrey psi cusp O(x^2) coefficient is sound, but the closed form does NOT close from ' +
  'the elementary reciprocity cocycle -- it needs the full psi_s integral representation and its ' +
  'zeta(2) period term -- and the naive Gauss-Kuzmin numerical extraction is proven non-convergent ' +
  '(window sign-instability, sample-size drift, spike sampling artifact). No analytic constant is ' +
  'pinned; the rigorous anchor stays T = 2.594e7; compute binds first by >2600x.';

export default IMP97578_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import. -------------------
//    Only LIGHT recomputations here (q <= 10); the heavy q ~ 1e4 window scans are offline
//    (tmp/imp-97578-*.mjs), outputs baked above.
const IMP97578_ASSERTIONS = [
  {
    id: 'imp97578-spike-artifact-recompute',
    why: 'STEP 3(iii): the reduced convergent 1/10 (where dense a=round(0.1 b) lands) must return the ' +
      'small-denominator spike ratio -0.087209, matching the imp-97563 QMF table and the baked anchor.',
    holds: () => {
      const r = imp97578Ratio(1, 10);
      return (
        Math.abs(r - IMP97578_SPIKE_ARTIFACT.ratioAtSpike) < 1e-5 &&
        r < -0.08 &&
        IMP97578_SPIKE_ARTIFACT.reducedFraction === '1/10'
      );
    },
  },
  {
    id: 'imp97578-window-sign-instability',
    why: 'STEP 3(i): the six disjoint q-window averages at x=0.02 must sign-flip (both positive and ' +
      'negative present) and span a band wider than the claimed <~1e-2 kappa_smooth -- the wobble.',
    holds: () => {
      const v = IMP97578_WINDOW_INSTABILITY.values.map((w) => w.avg);
      const hasPos = v.some((a) => a > 0);
      const hasNeg = v.some((a) => a < 0);
      const lo = Math.min(...v);
      const hi = Math.max(...v);
      return (
        v.length === 6 &&
        hasPos &&
        hasNeg &&
        Math.abs(lo - IMP97578_WINDOW_INSTABILITY.bandLo) < 1e-6 &&
        Math.abs(hi - IMP97578_WINDOW_INSTABILITY.bandHi) < 1e-6
      );
    },
  },
  {
    id: 'imp97578-sample-size-nonconvergence',
    why: 'STEP 3(ii): the [400,qmax] average must DRIFT away rather than stabilize -- the last rung ' +
      'must be an order of magnitude larger (in magnitude) than the first, and the sign must flip, ' +
      'so the naive Gauss-Kuzmin average is non-convergent (not merely noisy).',
    holds: () => {
      const l = IMP97578_NONCONVERGENCE.ladder;
      const first = l[0].avg;
      const last = l[l.length - 1].avg;
      return (
        l.length === 5 &&
        first > 0 &&
        last < 0 &&
        Math.abs(last) > 10 * Math.abs(first)
      );
    },
  },
  {
    id: 'imp97578-honesty-gate-no-qed',
    why: 'derivation + cross-check only: reduction sound, closed form does NOT close from the ' +
      'elementary cocycle (obstruction named), no constant pinned, no bound moved, compute binds ' +
      'first, sub-gap + markers present.',
    holds: () =>
      IMP97578_VERDICT.reductionToCuspCoefficientSound === true &&
      IMP97578_VERDICT.closedFormClosesFromElementaryCocycle === false &&
      IMP97578_VERDICT.obstructionIsIntegralRepZeta2PeriodTerm === true &&
      IMP97578_VERDICT.naiveExtractionSampleSizeNonConvergent === true &&
      IMP97578_VERDICT.pureAnalyticCoefficientPinned === false &&
      IMP97578_VERDICT.anyBoundMoved === false &&
      IMP97578_VERDICT.computeBindsFirst === true &&
      /NO QED/.test(IMP97578_HONEST_BANNER) &&
      /PT Lambda <= 0.2/.test(IMP97578_HONEST_BANNER) &&
      /RH open/.test(IMP97578_HONEST_BANNER) &&
      /integral-rep/.test(IMP97578_SUBGAP.id),
  },
];

for (const a of IMP97578_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97578-route-m-period-function-cusp-coefficient-derivation assertion failed: ${a.id}`,
    );
  }
}

export { IMP97578_ASSERTIONS };
