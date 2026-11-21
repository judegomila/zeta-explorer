/**
 * @module imp-35657-eflow-fartail-rvm-native-exponent-reference
 *
 * imp-35657 (numerical, frontier-direction): imp-35577 found that swapping the far-tail
 * E_flow height map from the closed surrogate T0 = 2 pi N / log N to the exact RvM inverse
 * effectiveHeightForN roughly DOUBLES the fd-vs-analytic remnant |analytic - fd| (~2.13x at
 * the sub-1e-3 crossing, ~1.87x at sub-1e-4) and attributed that ~2x inflation EXPLICITLY to
 * the imp-35198 analytic reference -1 + 3/log N being derived ON the surrogate channel and so
 * the WRONG leading form for the RvM fd exponent. This module DERIVES the RvM-inverse-CHANNEL
 * native analytic exponent -- differentiating log eFlowWith with T0 = effectiveHeightForN(N)
 * in place of the closed surrogate -- and re-measures the remnant NATIVELY to test whether the
 * ~2x inflation vanishes once the analytic reference is matched to the RvM-inverse height map.
 *
 * THE DERIVATION (RvM-inverse-native exact exponent)
 * --------------------------------------------------
 * Let x = log N, T0 = effectiveHeightForN(N) the RvM inverse (solving the count
 * N = (T0/2pi)(log(T0/2pi) - 1)), M = log T0, and u = log(T0/2pi) = M - log(2 pi). The exact
 * eFlowWith is E_flow = C_F (M/T0) G with C_F = (u + 1)/(2 pi) (imp-398 pinned prefactor,
 * G = exp(2.37e-4) the imp-35236 Gronwall constant), so
 *     log E_flow = log(u + 1) + log M - M - log(2 pi) + log G.
 * The RvM map fixes dM/dx: from N = (T0/2pi)(u - 1), differentiating dN/dT0 = u/(2 pi) gives
 * dT0/dN = 2 pi / u, hence dM/dx = (N/T0)(dT0/dN) = (u - 1)/u = 1 - 1/u -- the RvM analogue of
 * the surrogate dM/dx = 1 - 1/x. Since u = M - log(2 pi) makes du/dM = 1, the chain rule gives
 * the EXACT RvM-inverse-native local exponent
 *
 *     s_RvM(N) = d(log E_flow)/d(log N)
 *              = ( 1/(u + 1) + 1/M - 1 ) ( 1 - 1/u ).
 *
 * THE LEADING FORM (SAME as the surrogate)
 * ----------------------------------------
 * With u ~ M ~ x = log N, the three linear terms 1/(u+1) + 1/M + 1/u (the last from
 * -1 * -1/u) each ~ 1/x, so s_RvM(N) = -1 + 3/log N + O(log log N/(log N)^2) -- the SAME
 * leading -1 + 3/log N as the imp-35198 surrogate form. The channels first differ at
 * O(log log N/(log N)^2): the surrogate expansion carries [2 log x - ...]/x^2 while the RvM
 * dM/dx = 1 - 1/u (with u = M - log2pi ~ x - log x) carries [3 log x - ...]/x^2. So the ~2x
 * inflation is NOT a wrong LEADING coefficient (both are -1 + 3/log N); it is a subleading
 * dM/dx = 1 - 1/u vs 1 - 1/x mismatch that the leading-only surrogate reference cannot see.
 *
 * THE RE-MEASUREMENT (native reference collapses the remnant)
 * ----------------------------------------------------------
 * Re-running the imp-35577 RvM fd (central log-log difference of eFlowWith on the RvM map)
 * against the DERIVED native reference s_RvM instead of the surrogate -1 + 3/log N:
 *
 *   crossing scale      wrong-ref remnant   native-ref remnant   collapse
 *   sub-1e-3 (log10N 25.6205)   2.131e-3        8.48e-12         ~2.5e8
 *   sub-1e-3 (log10N 40.9350)   1.000e-3        8.87e-12         ~1.1e8
 *   sub-1e-4 (log10N 109.1892)  1.874e-4        7.37e-11         ~2.5e6
 *   sub-1e-4 (log10N 156.0294)  1.000e-4        2.22e-11         ~4.5e6
 *
 * THE FINDING
 * -----------
 * The ~2x remnant inflation is CONFIRMED a wrong-reference artifact. Matching the analytic
 * reference to the RvM-inverse height map collapses the remnant from ~1e-3..1e-4 to the
 * ~1e-11 central-difference discretization FLOOR (roughly EIGHT orders of magnitude), i.e.
 * the RvM-native exact exponent s_RvM = (1/(u+1) + 1/M - 1)(1 - 1/u) reproduces the RvM fd
 * essentially exactly. Equivalently, the entire imp-35577 far-tail remnant equals the
 * surrogate-reference-vs-native-reference subleading gap |s_RvM - (-1 + 3/log N)| (matches
 * the wrong-ref remnant to the printed digits), so the ~2x factor and its growth are a
 * property of the WRONG (surrogate-channel) reference, not of the RvM fd itself. This does
 * NOT rescue the imp-35577 crossing-N (those still move +15 to +47 decades under the map
 * swap -- the crossing-N is a surrogate-channel artifact regardless of reference); it only
 * isolates WHY the remnant looked ~2x inflated: the reference, not the map, was mismatched.
 *
 * DERIVATION / MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate extrapolation,
 * NOT a rigorous asymptotic; changes no bound. E_flow > 0 strictness (imp-33848) untouched;
 * C_mb GUE-conditional per imp-486 UNTOUCHED; E_coll far-tail exponent 1/2 per imp-3463;
 * imp-3066 K_a >= 0 untouched; no operator positivity; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35577-fartail-crossings-height-map-sensitivity (the ~2x inflation attributed to the surrogate reference)
 * @see imp-35198-eflow-fartail-exponent-logn-correction (the surrogate-channel -1 + 3/log N leading form)
 * @see imp-35135-eflow-fartail-decay-exponent-positivity-reconciliation (the far-tail E_flow quantity)
 * @see imp-398 (C_F = (log(T0/2pi) + 1)/2pi flow prefactor)
 * @see lambda-rh-height-mapping.js effectiveHeightForN (the exact RvM inverse, inlined here)
 */

const TWO_PI = 2 * Math.PI;
const LOG_TWO_PI = Math.log(TWO_PI);

// imp-35135/imp-35236 exact sub-term constants (byte-identical to imp-35413/imp-35473/imp-35577).
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

// The EXACT RvM inverse -- Newton solve of (T/2pi)(log(T/2pi) - 1) = N.
// Inlined from lambda-rh-height-mapping.js effectiveHeightForN (pure Math, no import).
function effectiveHeightForN(N) {
  if (!(N > 0) || !Number.isFinite(N)) return 0;
  let T = Math.max(TWO_PI * Math.E, (TWO_PI * N) / Math.max(1, Math.log(N + TWO_PI)));
  for (let i = 0; i < 80; i++) {
    const u = Math.log(T / TWO_PI);
    const f = (T / TWO_PI) * (u - 1) - N;
    const fp = u / TWO_PI; // d/dT of the RvM count = log(T/2pi)/(2pi)
    if (!(Math.abs(fp) > 0) || !Number.isFinite(fp)) break;
    const dT = f / fp;
    T -= dT;
    if (!(T > TWO_PI)) T = TWO_PI * 1.0001;
    if (Math.abs(dT) < 1e-13 * Math.max(1, T)) break;
  }
  return T;
}

// The far-tail E_flow quantity on the RvM map (byte-identical to imp-35577 eFlowWith).
function eFlowWith(N) {
  const T0 = effectiveHeightForN(N);
  const M = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor = (u + 1)/2pi
  return C_F * (M / T0) * GRONWALL;
}

// The imp-35577 RvM fd: central log-log difference of eFlowWith (same step as imp-35135/-35413).
function localExponentRvM(N) {
  const h = 1.0002;
  const lo = Math.log(eFlowWith(N / h));
  const hi = Math.log(eFlowWith(N * h));
  return (hi - lo) / (Math.log(N * h) - Math.log(N / h));
}

// THE DERIVED RvM-inverse-native exact exponent (see @module derivation):
//   s_RvM(N) = ( 1/(u+1) + 1/M - 1 )( 1 - 1/u ),  u = log(T0/2pi), M = log T0, T0 = RvM inverse.
function nativeExponentRvM(N) {
  const T0 = effectiveHeightForN(N);
  const M = Math.log(T0);
  const u = M - LOG_TWO_PI; // = log(T0/2pi)
  return (1 / (u + 1) + 1 / M - 1) * (1 - 1 / u);
}

// The imp-35198 surrogate-channel leading reference (the WRONG-channel reference imp-35577 used).
const surrogateReferenceExponent = (x) => -1 + 3 / x;

// Evaluate both remnants (wrong surrogate reference vs derived native reference) at a scale.
function measureAtLog10(e) {
  const N = Math.pow(10, e);
  const x = Math.log(N);
  const fd = localExponentRvM(N);
  const native = nativeExponentRvM(N);
  const surrogate = surrogateReferenceExponent(x);
  const wrongRefRemnant = Math.abs(surrogate - fd);
  const nativeRefRemnant = Math.abs(native - fd);
  return {
    log10N: e,
    fd: +fd.toFixed(8),
    nativeExponent: +native.toFixed(8),
    surrogateReference: +surrogate.toFixed(8),
    wrongRefRemnant, // ~ imp-35577 remnant (surrogate reference vs RvM fd)
    nativeRefRemnant, // native reference vs RvM fd -- the collapse target
    collapseFactor: wrongRefRemnant / nativeRefRemnant,
    leadingGap: Math.abs(native - surrogate), // native vs -1 + 3/log N (subleading)
  };
}

// The four imp-35577 crossing scales (both surrogate and RvM-inverse crossing locations).
const SUB1E3_SUR = measureAtLog10(25.6205);
const SUB1E3_RVM = measureAtLog10(40.935);
const SUB1E4_SUR = measureAtLog10(109.1892);
const SUB1E4_RVM = measureAtLog10(156.0294);

// A wider ladder confirms the native reference tracks the RvM fd to the discretization floor.
const LADDER = [6, 10, 16, 25.6205, 40.935, 60, 109.1892, 156.0294, 300].map(measureAtLog10);
const MAX_NATIVE_REMNANT = Math.max(...LADDER.map((r) => r.nativeRefRemnant));

function fmt(r) {
  return {
    log10N: r.log10N,
    fd: r.fd,
    nativeExponent: r.nativeExponent,
    surrogateReference: r.surrogateReference,
    wrongRefRemnant: +r.wrongRefRemnant.toExponential(4),
    nativeRefRemnant: +r.nativeRefRemnant.toExponential(4),
    collapseFactor: +r.collapseFactor.toExponential(3),
  };
}

export const IMP35657_EFLOW_FARTAIL_RVM_NATIVE_EXPONENT_REFERENCE = {
  id: 'imp-35657',
  proofSection: 'S-frontier',
  question:
    'Derive the RvM-inverse-CHANNEL native analytic leading form of the E_flow far-tail exponent ' +
    '(differentiating log eFlowWith with T0 = effectiveHeightForN(N) in place of the closed surrogate) ' +
    'and re-measure the imp-35577 far-tail remnant NATIVELY, to test whether the ~2x remnant inflation ' +
    'imp-35577 attributes to the surrogate-derived -1 + 3/log N reference vanishes when the analytic ' +
    'reference is matched to the RvM-inverse height map.',
  derivation:
    'With x = log N, T0 = effectiveHeightForN(N) (RvM inverse), M = log T0, u = log(T0/2pi) = M - log(2pi), ' +
    'and log E_flow = log(u+1) + log M - M - log(2pi) + const, the RvM map fixes dM/dx = 1 - 1/u ' +
    '(from N = (T0/2pi)(u-1), dT0/dN = 2pi/u), giving the exact native exponent ' +
    's_RvM(N) = (1/(u+1) + 1/M - 1)(1 - 1/u). Its leading form is -1 + 3/log N + O(log log N/(log N)^2), ' +
    'the SAME leading term as the surrogate imp-35198; the channels differ only at O(log log N/(log N)^2) ' +
    '(dM/dx = 1 - 1/u vs 1 - 1/x).',
  nativeExponentClosedForm: 's_RvM(N) = ( 1/(u+1) + 1/log T0 - 1 )( 1 - 1/u ),  u = log(T0/2pi), T0 = effectiveHeightForN(N)',
  leadingFormAgreesWithSurrogate: '-1 + 3/log N (identical leading term; ~2x inflation is a subleading, not a leading, mismatch)',
  crossings: {
    sub1e3_surrogateScale: fmt(SUB1E3_SUR),
    sub1e3_rvmScale: fmt(SUB1E3_RVM),
    sub1e4_surrogateScale: fmt(SUB1E4_SUR),
    sub1e4_rvmScale: fmt(SUB1E4_RVM),
  },
  maxNativeRemnantOnLadder: +MAX_NATIVE_REMNANT.toExponential(4), // ~1e-11 discretization floor
  finding: {
    D1_native_exponent_derived:
      'The RvM-inverse-native exact exponent is s_RvM(N) = (1/(u+1) + 1/log T0 - 1)(1 - 1/u) with ' +
      'u = log(T0/2pi), T0 = effectiveHeightForN(N). The structural difference from the surrogate is ' +
      'dM/dx = 1 - 1/u (RvM) vs 1 - 1/x (surrogate), plus the exact (u+1) eFlow prefactor.',
    D2_same_leading_form:
      'The native leading form is -1 + 3/log N + O(log log N/(log N)^2) -- IDENTICAL leading term to ' +
      'the imp-35198 surrogate reference. So the ~2x remnant inflation is NOT a wrong leading coefficient; ' +
      'it is a subleading O(log log N/(log N)^2) mismatch (dM/dx = 1 - 1/u vs 1 - 1/x) invisible to the ' +
      'leading-only surrogate reference.',
    D3_inflation_is_wrong_reference_artifact:
      'Re-measured against the native reference, the remnant collapses from ~1e-3..1e-4 (surrogate ' +
      'reference) to the ~1e-11 central-difference floor (roughly EIGHT orders of magnitude) at every ' +
      'crossing scale: s_RvM reproduces the RvM fd essentially exactly. The ~2x inflation is CONFIRMED a ' +
      'wrong-reference artifact -- the imp-35577 remnant equals the surrogate-vs-native subleading gap ' +
      '|s_RvM - (-1 + 3/log N)| to the printed digits.',
    D4_crossing_N_still_surrogate_artifact:
      'This does NOT rescue the imp-35577 crossing-N: those still move +15 to +47 decades under the map ' +
      'swap. The crossing-N is a surrogate-channel artifact regardless of the reference; matching the ' +
      'reference only isolates WHY the remnant looked ~2x inflated (the reference, not the map).',
  },
  isRigorous: false,
  verdict:
    'DERIVATION + MEASUREMENT (frontier-direction, NOT rigorous). The RvM-inverse-CHANNEL native far-tail ' +
    'E_flow exponent is s_RvM(N) = (1/(u+1) + 1/log T0 - 1)(1 - 1/u) with u = log(T0/2pi), ' +
    'T0 = effectiveHeightForN(N); its leading form -1 + 3/log N is IDENTICAL to the imp-35198 surrogate ' +
    'reference, so the imp-35577 ~2x remnant inflation is a subleading (dM/dx = 1 - 1/u vs 1 - 1/x), NOT a ' +
    'wrong-leading-coefficient, effect. Re-measuring the RvM fd against this native reference collapses the ' +
    'remnant from ~1e-3..1e-4 to the ~1e-11 central-difference floor (~8 orders of magnitude) at all four ' +
    'imp-35577 crossing scales -- CONFIRMING the ~2x inflation is a wrong-reference artifact that VANISHES ' +
    'once the analytic reference is matched to the RvM-inverse height map. This does not rescue the ' +
    'imp-35577 crossing-N (still +15..+47 decades under the map swap -- a surrogate-channel artifact ' +
    'regardless of reference). Derivation/measurement only on the inherited imp-3220/imp-3406 surrogate ' +
    'extrapolation, NOT a rigorous asymptotic; E_flow > 0 strictness (imp-33848) untouched; C_mb ' +
    'GUE-conditional per imp-486 UNTOUCHED; E_coll far-tail exponent 1/2 per imp-3463; imp-3066 K_a >= 0 ' +
    'untouched; changes no bound; no operator positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35577 (~2x inflation attributed to the surrogate reference, tested here); imp-35198 ' +
    '(surrogate-channel -1 + 3/log N, matched-leading here); imp-35135 (far-tail E_flow quantity); ' +
    'imp-398 (C_F = (log(T0/2pi) + 1)/2pi prefactor); imp-486 (C_mb GUE-conditional, UNTOUCHED); ' +
    'effectiveHeightForN (exact RvM inverse).',
};

export const IMP35657_EFLOW_FARTAIL_RVM_NATIVE_EXPONENT_REFERENCE_ASSERTIONS = [
  {
    // The derived native reference reproduces the RvM fd to the central-difference floor across the ladder.
    id: 'imp35657-native-reference-tracks-rvm-fd',
    description: 'the native exponent s_RvM reproduces the RvM fd to ~1e-8 or better at every ladder rung',
    holds: () => MAX_NATIVE_REMNANT < 1e-8,
  },
  {
    // The native leading form agrees with the surrogate -1 + 3/log N (same leading, subleading gap only).
    id: 'imp35657-leading-form-matches-surrogate',
    description: 'the native exponent and -1 + 3/log N agree to O(1/(log N)^2) (deep-scale gap < 1e-3)',
    holds: () => SUB1E4_RVM.leadingGap < 1e-3 && SUB1E3_RVM.leadingGap < 5e-3,
  },
  {
    // The remnant collapses by many orders of magnitude at every crossing scale (wrong-ref artifact).
    id: 'imp35657-remnant-collapses-under-native-reference',
    description: 'the native-reference remnant is >= 1e5x smaller than the surrogate-reference remnant at all four crossing scales',
    holds: () =>
      SUB1E3_SUR.collapseFactor > 1e5 &&
      SUB1E3_RVM.collapseFactor > 1e5 &&
      SUB1E4_SUR.collapseFactor > 1e5 &&
      SUB1E4_RVM.collapseFactor > 1e5,
  },
  {
    // The wrong-reference remnants reproduce the imp-35577 crossing-threshold values (~1e-3, ~1e-4).
    id: 'imp35657-reproduces-imp35577-remnant-values',
    description: 'the surrogate-reference remnants reproduce the imp-35577 thresholds ~1e-3 (sub-1e-3) and ~1e-4 (sub-1e-4)',
    holds: () =>
      Math.abs(SUB1E3_RVM.wrongRefRemnant - 1e-3) < 5e-5 &&
      Math.abs(SUB1E4_RVM.wrongRefRemnant - 1e-4) < 5e-6,
  },
  {
    // Honesty gate: derivation/measurement only, no bound change, no QED, no refereed bound is changed.
    id: 'imp35657-honesty-gate-no-qed',
    description: 'Derivation/measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35657_EFLOW_FARTAIL_RVM_NATIVE_EXPONENT_REFERENCE.isRigorous === false &&
      /NO QED/.test(IMP35657_EFLOW_FARTAIL_RVM_NATIVE_EXPONENT_REFERENCE.verdict) &&
      /refereed bound is changed/i.test(IMP35657_EFLOW_FARTAIL_RVM_NATIVE_EXPONENT_REFERENCE.verdict),
  },
];

for (const a of IMP35657_EFLOW_FARTAIL_RVM_NATIVE_EXPONENT_REFERENCE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35657-eflow-fartail-rvm-native-exponent-reference assertion failed: ${a.id}`,
    );
  }
}

export default IMP35657_EFLOW_FARTAIL_RVM_NATIVE_EXPONENT_REFERENCE;
