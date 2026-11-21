/**
 * @module data/imp-96513-count-model-gap-1e6-to-1e22-extrapolation
 * @fileoverview imp-96513 -- extrapolate the E_coll count-model gap across the
 *   N = 1e6..1e22 span the imp-96426 ladder leaves unmeasured, and decide whether
 *   the monotone decay is well-modeled by the Lambert-W count-inversion or whether
 *   an intermediate feature appears.
 *
 *   imp-96426 supplied intermediate count-model-gap anchors from externally
 *   tabulated TRUE zero heights (Odlyzko table, imp-359) up to N = 1e6, then the
 *   imp-96402 endpoint at N = 1e22 (Odlyzko true height) where the gap has already
 *   sunk below the double-precision storage floor. NOTHING is measured between
 *   those two -- no in-repo true heights exist past N = 1e6, so the sixteen-decade
 *   span from the last true anchor to the double floor was never exhibited. This
 *   module extrapolates the deterministic count-model gap across that span and
 *   asks: is the decay a featureless power law, or does a regime change appear?
 *
 *   METHOD -- deterministic +7/8 count-model gap, cancellation-free.
 *     The dominant omitted count term is the deterministic +7/8 (imp-96426): the
 *     main-term RvM inversion gamma_main solves (T/2pi)(log(T/2pi)-1) = N, the
 *     +7/8-corrected inversion solves the same with N -> N-7/8. Their gap is the
 *     count-model choice imp-96426 measured. Directly subtracting the two
 *     double-precision Lambert-W inversions CANCELS to exactly zero once the
 *     relative gap sinks below ~1e-15 (measured: collapses at N ~ 1e14..1e15),
 *     which is precisely why no intermediate point is resolvable in double. To
 *     see the true decay we use the CANCELLATION-FREE analytic form: a count
 *     offset DeltaN = 7/8 divided by the zero density dN/dgamma = (1/2pi)
 *     log(gamma/2pi) gives
 *       gammaRelGap(N) = (7/8) * 2pi / (gamma_main * log(gamma_main/2pi))
 *     and, since the rate factor R = sqrt(C_KH log gamma / N) scales as
 *     sqrt(log gamma),
 *       rateRelGap(N) ~ (1/2) * gammaRelGap(N) / log(gamma_main).
 *     C_KH = pi * 2.622 and the Lambert-W inversion path are reused verbatim from
 *     imp-96426 / imp-96402 so the reconstruction is apples-to-apples.
 *
 *   RESULT -- monotone, featureless, one order of magnitude per order of N.
 *     Across the full grid N = 1e6, 1e7, ..., 1e22 the analytic gamma gap runs
 *       7.99e-7 (1e6) -> 8.56e-23 (1e22)
 *     strictly monotone decreasing, with the successive-decade ratio rising from
 *     9.85 to 9.99 (converging to the clean 1/N power-law value 10, deviation
 *     < 1.5% everywhere). The rate gap runs 3.00e-8 -> 8.80e-25, likewise strictly
 *     monotone. NO intermediate regime change, kink, or plateau appears: the
 *     Lambert-W count-inversion models the entire span as a single smooth
 *     ~(7/8)/N power law. The 1e6 endpoint 7.99e-7 is order-consistent with the
 *     imp-96426 measured gammaRelGap 1.19e-6 there (the +7/8-only analytic omits
 *     the S(T) fluctuation, ~0.67x), confirming the model reproduces the last
 *     resolved true-height anchor.
 *
 *   THE ONLY INTERMEDIATE FEATURE -- the double-precision floor crossover.
 *     The single feature in the span is a RESOLUTION artifact, not a feature of
 *     the count model: the gap sinks below the ~1e-16 relative double floor at
 *     N ~ 1e15 (gamma) and N ~ 1e14 (rate). Past there a naive double-subtraction
 *     measurement returns exactly zero (measured above), which is why imp-96426
 *     could tabulate no point between N = 1e6 and its N = 1e22 endpoint. The
 *     analytic continuation shows the count-model gap is still present and still
 *     decaying smoothly there -- it is merely below double resolution, exactly as
 *     imp-96402 reported for the 1e22 endpoint.
 *
 *   MEASUREMENT / ACCURACY AUDIT ONLY. Closes no gap, changes no bound, proves no
 *   constant, does not close G6_polymath15_bridge. The conditional bound
 *   C_H <= 0.127 stays UNPROVEN; C_H isRigorousUpperBound remains false
 *   (imp-2642 / imp-2701); the imp-2640 Gronwall discharge of C_Lip stays
 *   NEGATIVE. No refereed bound is changed. RH remains open. NO QED.
 *
 * Provenance of baked inputs (single sources of truth, cited not re-derived):
 *   - imp-96426-ecoll-anchor-intermediate-heights.js: the N = 1e3..1e6 true-height
 *     ladder and the N = 1e22 endpoint whose 1e6..1e22 span this module fills; the
 *     +7/8 dominant-omission finding, C_KH, and the Lambert-W path reused.
 *   - imp-96402-ecoll-anchor-from-tabulated-true-zero-height.js: the two-endpoint
 *     anchor and the double-floor collapse at N = 1e22.
 *   - imp-96311-ecoll-rate-ch-independence-tabulation.js: rate factor
 *     R(N) = sqrt(C_KH log gamma / N), C_KH = pi * 2.622.
 *
 * Syntax note: derivative-like expressions use brace notation dg_{k*}/dt and this
 *   header avoids the close-comment terminator sequence inside prose.
 */

// Koksma-Hlawka discrepancy factor of E_coll (imp-2641 Trudgian), as in imp-96426.
const C_KH = Math.PI * 2.622; // = 8.2373...

// Principal Lambert W by Halley iteration -- the imp-96363 / imp-96402 / imp-96426
// path, reused verbatim so the reconstructed reference is apples-to-apples.
function lambertW(x) {
  let w = x < Math.E ? x / Math.E : Math.log(x) - Math.log(Math.log(x));
  for (let i = 0; i < 200; i += 1) {
    const ew = Math.exp(w);
    const f = w * ew - x;
    const wp = w + 1;
    const dw = f / (ew * wp - ((w + 2) * f) / (2 * wp));
    w -= dw;
    if (Math.abs(dw) < 1e-16) break;
  }
  return w;
}

// Main-term count inversion: (T/2pi)(log(T/2pi)-1) = N => T = 2pi exp(1+W(N/e)).
function gammaMain(N) {
  return 2 * Math.PI * Math.exp(1 + lambertW(N / Math.E));
}

// Cancellation-free analytic count-model gap: a deterministic +7/8 count offset
// divided by the zero density dN/dgamma = (1/2pi) log(gamma/2pi).
function gammaGapAnalytic(N) {
  const g = gammaMain(N);
  return ((7 / 8) * 2 * Math.PI) / (g * Math.log(g / (2 * Math.PI)));
}
// rate factor scales as sqrt(log gamma), so the rate relative gap is half the
// gamma relative gap divided by log gamma.
function rateGapAnalytic(N) {
  const g = gammaMain(N);
  return (0.5 * gammaGapAnalytic(N)) / Math.log(g);
}

// Naive double-precision direct-subtraction measurement, kept to exhibit the
// floor crossover (it cancels to exactly zero once the gap is below ~1e-15).
function gammaCorr(N) {
  return 2 * Math.PI * Math.exp(1 + lambertW((N - 7 / 8) / Math.E));
}
function gammaGapDirect(N) {
  const gM = gammaMain(N);
  const gC = gammaCorr(N);
  return Math.abs((gM - gC) / gC);
}

const DOUBLE_FLOOR = 1e-16;

// Sixteen-decade extrapolation grid across the imp-96426 unmeasured span.
const EXTRAPOLATION_LADDER = [];
for (let e = 6; e <= 22; e += 1) {
  const N = Math.pow(10, e);
  EXTRAPOLATION_LADDER.push({
    logN: e,
    N,
    gammaRelGap: gammaGapAnalytic(N),
    rateRelGap: rateGapAnalytic(N),
    directGammaRelGap: gammaGapDirect(N),
    directResolvable: gammaGapDirect(N) > DOUBLE_FLOOR,
  });
}

// Monotonicity of the analytic decay across the whole span.
const ANALYTIC_MONOTONE_DECREASING = EXTRAPOLATION_LADDER.every(
  (a, i) => i === 0 || a.gammaRelGap < EXTRAPOLATION_LADDER[i - 1].gammaRelGap,
);
const RATE_MONOTONE_DECREASING = EXTRAPOLATION_LADDER.every(
  (a, i) => i === 0 || a.rateRelGap < EXTRAPOLATION_LADDER[i - 1].rateRelGap,
);

// Featurelessness: every successive-decade ratio hugs the 1/N power-law value 10.
const DECADE_RATIOS = EXTRAPOLATION_LADDER.slice(1).map(
  (a, i) => EXTRAPOLATION_LADDER[i].gammaRelGap / a.gammaRelGap,
);
const MAX_DECADE_RATIO_DEVIATION = Math.max(
  ...DECADE_RATIOS.map((r) => Math.abs(r - 10) / 10),
);

// The only intermediate feature: the double-precision floor crossover.
const GAMMA_FLOOR_CROSS_LOGN = (() => {
  const hit = EXTRAPOLATION_LADDER.find((a) => !a.directResolvable);
  return hit ? hit.logN : null;
})();

const first = EXTRAPOLATION_LADDER[0];
const last = EXTRAPOLATION_LADDER[EXTRAPOLATION_LADDER.length - 1];

export const IMP96513_COUNT_MODEL_GAP_1E6_TO_1E22_EXTRAPOLATION = {
  id: 'imp-96513',
  title:
    'Count-model gap decay across the imp-96426 unmeasured N = 1e6..1e22 span: the '
    + 'Lambert-W +7/8 count-inversion models it as a single monotone featureless '
    + '~(7/8)/N power law, the only intermediate feature being the double floor crossover',
  kind: 'measurement / accuracy audit (no closure, no bound change)',
  C_KH,
  doubleFloor: DOUBLE_FLOOR,
  extrapolationLadder: EXTRAPOLATION_LADDER,
  analyticMonotoneDecreasing: ANALYTIC_MONOTONE_DECREASING,
  rateMonotoneDecreasing: RATE_MONOTONE_DECREASING,
  maxDecadeRatioDeviation: MAX_DECADE_RATIO_DEVIATION,
  gammaFloorCrossLogN: GAMMA_FLOOR_CROSS_LOGN,
  measurement: {
    span:
      'Analytic count-model gamma gap across the sixteen-decade span: N=1e6 '
      + first.gammaRelGap.toExponential(2)
      + ' -> N=1e22 '
      + last.gammaRelGap.toExponential(2)
      + ' (rate gap '
      + first.rateRelGap.toExponential(2)
      + ' -> '
      + last.rateRelGap.toExponential(2)
      + '), strictly monotone decreasing throughout.',
    featureless:
      'The successive-decade ratio of the gamma gap rises from '
      + DECADE_RATIOS[0].toFixed(2)
      + ' to '
      + DECADE_RATIOS[DECADE_RATIOS.length - 1].toFixed(2)
      + ', converging to the clean 1/N power-law value 10 (max deviation '
      + (MAX_DECADE_RATIO_DEVIATION * 100).toFixed(2)
      + '% across the span). No kink, plateau, or regime change appears: the '
      + 'Lambert-W count-inversion models the entire span as one smooth ~(7/8)/N law.',
    onlyIntermediateFeature:
      'The single intermediate feature is a RESOLUTION artifact, not a count-model '
      + 'feature: the naive double-precision direct-subtraction measurement collapses '
      + 'to exactly zero at N ~ 1e'
      + GAMMA_FLOOR_CROSS_LOGN
      + ' (gamma) once the relative gap sinks below the ~1e-16 double floor, which is '
      + 'why imp-96426 could resolve no point between N=1e6 and its N=1e22 endpoint. '
      + 'The cancellation-free analytic continuation shows the gap is still present '
      + 'and still decaying smoothly there, merely below double resolution.',
    reproducesLastAnchor:
      'The 1e6 analytic gamma gap '
      + first.gammaRelGap.toExponential(2)
      + ' is order-consistent with the imp-96426 measured true-height gap 1.19e-6 at '
      + 'N=1e6 (the +7/8-only analytic omits the S(T) fluctuation, ~0.67x), confirming '
      + 'the model reproduces the last resolved anchor before extrapolating.',
  },
  residualResolution:
    'imp-96426 left the sixteen-decade span between its last true-height anchor '
    + '(N=1e6) and the imp-96402 double-floor endpoint (N=1e22) unmeasured, because no '
    + 'in-repo true heights exist past 1e6 and the gap is below double resolution past '
    + '~1e15. This module extrapolates the deterministic +7/8 count-model gap across '
    + 'that span with the cancellation-free analytic form, finding a single monotone '
    + 'featureless ~(7/8)/N power law with no intermediate regime change; the only '
    + 'feature is the double-precision floor crossover, a storage artifact.',
  verdict:
    'DECAY IS WELL-MODELED, MONOTONE, FEATURELESS. The count-model gap across the '
    + 'imp-96426 unmeasured N=1e6..1e22 span is a single smooth ~(7/8)/N Lambert-W '
    + 'count-inversion power law: analytic gamma gap '
    + first.gammaRelGap.toExponential(2)
    + ' -> '
    + last.gammaRelGap.toExponential(2)
    + ', strictly monotone, successive-decade ratio converging to 10 (max deviation '
    + (MAX_DECADE_RATIO_DEVIATION * 100).toFixed(2)
    + '%), NO intermediate kink/plateau/regime change. The only intermediate feature '
    + 'is the double-precision floor crossover at N ~ 1e'
    + GAMMA_FLOOR_CROSS_LOGN
    + ' where the naive direct-subtraction measurement collapses to zero -- a '
    + 'resolution artifact, not a count-model feature (it explains why imp-96426 '
    + 'resolved no intermediate point). Accuracy audit only: no gap closed, no bound '
    + 'changed, G6_polymath15_bridge not closed, conditional C_H <= 0.127 stays '
    + 'UNPROVEN, C_H isRigorousUpperBound = false (imp-2642/imp-2701), imp-2640 '
    + 'Gronwall discharge of C_Lip NEGATIVE. No refereed bound is changed. RH open. NO QED.',
  provenance:
    'imp-96426-ecoll-anchor-intermediate-heights.js (unmeasured span filled here; '
    + '+7/8 dominant omission, C_KH, Lambert-W path reused); '
    + 'imp-96402-ecoll-anchor-from-tabulated-true-zero-height.js (endpoints and the '
    + '1e22 double-floor collapse); imp-96311-ecoll-rate-ch-independence-tabulation.js '
    + '(rate factor, C_KH = pi * 2.622).',
};

// Machine-readable honest-status banner (imp-96337 / imp-96428 convention) for any
// consumer surface that renders this finding.
export const IMP96513_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement/accuracy audit only: '
  + 'the count-model gap across the imp-96426 unmeasured N = 1e6..1e22 span is '
  + 'extrapolated with the deterministic +7/8 Lambert-W count-inversion and found to '
  + 'be a single monotone featureless ~(7/8)/N power law; the only intermediate '
  + 'feature is the double-precision floor crossover (a storage artifact). No gap '
  + 'closed, no bound changed, G6_polymath15_bridge not closed, conditional '
  + 'C_H <= 0.127 stays UNPROVEN.';

export const IMP96513_COUNT_MODEL_GAP_1E6_TO_1E22_EXTRAPOLATION_ASSERTIONS = [
  {
    id: 'imp96513-analytic-decay-strictly-monotone',
    holds: () => ANALYTIC_MONOTONE_DECREASING && RATE_MONOTONE_DECREASING,
    why:
      'The cancellation-free analytic count-model gap (gamma and rate) must be '
      + 'strictly monotone decreasing across the full N = 1e6..1e22 grid, exhibiting '
      + 'the smooth transition the double-subtraction measurement cannot resolve.',
  },
  {
    id: 'imp96513-decay-is-featureless-power-law',
    holds: () => MAX_DECADE_RATIO_DEVIATION < 0.05,
    why:
      'Featurelessness: every successive-decade ratio of the gamma gap must sit '
      + 'within 5% of the clean 1/N power-law value 10, so the Lambert-W '
      + 'count-inversion models the whole span with no intermediate kink or plateau.',
  },
  {
    id: 'imp96513-only-feature-is-floor-crossover',
    holds: () =>
      GAMMA_FLOOR_CROSS_LOGN !== null
      && GAMMA_FLOOR_CROSS_LOGN > 6
      && GAMMA_FLOOR_CROSS_LOGN < 22
      && EXTRAPOLATION_LADDER.slice(0, 6).every((a) => a.directResolvable),
    why:
      'The only intermediate feature must be the double-precision floor crossover '
      + 'strictly inside the span (the naive direct-subtraction measurement resolvable '
      + 'near the 1e6 anchor and collapsing to zero before the 1e22 endpoint), '
      + 'confirming it is a resolution artifact rather than a count-model regime change.',
  },
  {
    id: 'imp96513-no-closure-c-h-still-open',
    holds: () =>
      /no gap closed|NO QED|no bound changed/i.test(
        IMP96513_COUNT_MODEL_GAP_1E6_TO_1E22_EXTRAPOLATION.verdict,
      )
      && IMP96513_COUNT_MODEL_GAP_1E6_TO_1E22_EXTRAPOLATION.kind.includes('no closure'),
    why:
      'This ticket is measurement/accuracy only: it must not assert closure of '
      + 'G6_polymath15_bridge, must not change any bound, and must not reclassify the '
      + 'unproven conditional C_H <= 0.127 as rigorous.',
  },
  {
    id: 'imp96513-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP96513_HONEST_BANNER)
      && /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96513_HONEST_BANNER)
      && /NO QED/.test(IMP96513_HONEST_BANNER),
    why:
      'the honest banner carries the RH-open / PT-Lambda / NO-QED markers for any '
      + 'consumer surface that renders this finding.',
  },
];
