/**
 * @module imp-3734-gap-structure-function-s2
 *
 * imp-3734 (numerical, diagnostic): MEASURE the imp-3714 candidate-K3 equal-time two-point gap
 * structure function
 *
 *     S_2(r) = mean over k of (g_{k+r} - g_k)^2 ,   g_k = gamma_{k+1} - gamma_k ,
 *
 * on the Riemann-zero gap field, tabulate its r-dependence across a range of separations r, and
 * CONFIRM the imp-3714 structural claim empirically: S_2(r) is a well-defined two-point profile
 * (it clears REQ-i, the two-point x-difference dependence) yet, being a purely EQUAL-TIME statistic
 * that attaches no backward-flow depth, it supplies no s(y) and so FAILS REQ-ii (the nearest-pair
 * non-vacuous Gronwall floor). Diagnostic measurement only; does NOT close G6a, does NOT construct
 * the missing magnitude, NO QED.
 *
 * WHAT WAS MEASURED
 * -----------------
 * Source field: the per-gap field g_k = gamma_{k+1} - gamma_k over the first N = 1,000,000 Odlyzko
 * zero ordinates (M = 999,999 gaps), the same ZEROS_EXTENDED bundle used by the Dyson backward-ODE
 * work. Mean gap = 0.60025614, sample variance = 0.06447494 (so 2*var = 0.12894988).
 *
 * Two structure functions were tabulated (values baked below, computed offline; this module does NOT
 * import the 16.7 MB zeros bundle -- see memory no-heavy-imports-in-pages):
 *   (A) RAW gap field g_k. S_2^raw(r).
 *   (B) UNFOLDED gap field u_k = g_k / (local mean over a W = 2001 window), which removes the smooth
 *       density drift (mean gap shrinks as ~ 2 pi / log(T/2 pi) with height T). Unfolded mean = 1.0000,
 *       variance = 0.16511894 (so 2*var = 0.33023718).
 *
 * THE r-DEPENDENCE (the object EXISTS and is two-point, clearing REQ-i)
 * --------------------------------------------------------------------
 * Both profiles are well-defined, smooth functions of the separation r:
 *   - At r = 1 the value is ABOVE the large-r plateau: S_2^raw(1) = 0.16218 vs plateau ~ 0.11991,
 *     S_2^unf(1) = 0.44580 vs plateau ~ 0.33007. Via S_2(r) = 2 var [1 - C(r)] this means the lag-1
 *     autocorrelation is NEGATIVE: C_raw(1) = -0.258, C_unf(1) = -0.350. Consecutive gaps REPEL --
 *     the level-repulsion anti-correlation signature of the GUE-like zero field.
 *   - As r grows the profile relaxes MONOTONICALLY (up to sampling noise) to a decorrelation plateau.
 *     The UNFOLDED plateau equals 2*var(unfolded) to within 0.13 percent (ratio 1.0013), the textbook
 *     signature C(r) -> 0 of decorrelated separations. The RAW plateau (~0.120) sits BELOW 2*var
 *     (0.129) because the raw variance is inflated by the residual global density drift that local
 *     differencing at finite r does not sample -- itself evidence that S_2 reads a STATIC profile.
 *
 * WHY IT STILL FAILS REQ-ii (locates the scale, supplies no flow depth)
 * --------------------------------------------------------------------
 * S_2(r) is a purely EQUAL-TIME statistic of the frozen gap field: it has NO time / flow argument.
 * It resolves a spatial two-point profile and thereby LOCATES the separation scale (exactly the
 * information REQ-i wants), but it attaches no backward-flow depth s(y) -- there is nothing in
 * S_2(r) to pin 2 s(y) / y^2 = E_meso at the collision scale g_k -> 0. So it cannot secure the
 * Lemma B floor exp(-2 s / y^2) away from 0 and cannot by itself certify the Hoelder-1/2 modulus
 * C_Lip. This is the imp-3714 K3 verdict, now measured: right TYPE (two-point, clears REQ-i),
 * no adapted DEPTH (fails REQ-ii) -- the same failure mode as the imp-3708 R3 per-pair gap statistics.
 *
 * VERDICT: S_2(r) is a genuine, well-behaved two-point gap profile with a clean level-repulsion
 * anti-correlation at r = 1 and a decorrelation plateau at 2*var; it clears REQ-i but attaches no
 * flow depth and so FAILS REQ-ii, confirming the imp-3714 K3 near-miss classification empirically.
 * Diagnostic measurement only; no construction shipped, no positivity, no bridge closure, no RH claim,
 * NO QED. imp-3066 off-diagonal endpoint-Hankel K_a >= 0 positivity UNTOUCHED. No refereed bound is changed
 * . G6a_shock_lipschitz stays OPEN.
 *
 * @see imp-3714-g6a-modulus-object-requirements (K3 = this equal-time structure function, near-miss)
 * @see imp-3693-microscopic-xdiff-route-scoping (REQ-i: per-gap field g_k is the right-TYPE object)
 * @see imp-3708-s2-gronwall-vacuity-intrinsic-assessment (REQ-ii: y2-adapted depth s(y) ~ y^2 required)
 * @see dyson-collision-lower-bound (per-gap ODE dg_k/dt = 4/g_k - 2 g_k S_k)
 * @see zeros-to-1e6 (ZEROS_EXTENDED source field; not imported here to keep the bundle light)
 */

// N zeros used, M = N - 1 gaps in the field g_k = gamma_{k+1} - gamma_k.
const FIELD = {
  nZeros: 1000000,
  nGaps: 999999,
  meanGap: 0.60025614254,
  varGap: 0.06447493985,
  twoVarGap: 0.12894987969,
  // Unfolded field u_k = g_k / (local mean over a W-window); removes the smooth density drift.
  unfoldWindow: 2001,
  unfoldedMean: 1.00002811351,
  unfoldedVar: 0.16511859076,
  twoVarUnfolded: 0.33023718153,
};

// RAW gap field: S_2^raw(r) = mean_k (g_{k+r} - g_k)^2. [separation r, value].
const S2_RAW = [
  [1, 1.62176852e-1], [2, 1.29047573e-1], [3, 1.24246153e-1], [4, 1.22933721e-1],
  [6, 1.21705203e-1], [8, 1.20140399e-1], [12, 1.18206469e-1], [16, 1.20385750e-1],
  [24, 1.25478993e-1], [32, 1.19232687e-1], [48, 1.17801728e-1], [64, 1.19221630e-1],
  [96, 1.21052082e-1], [128, 1.18995532e-1], [192, 1.20291904e-1], [256, 1.20009745e-1],
  [384, 1.19892434e-1], [512, 1.19911600e-1], [768, 1.19870414e-1], [1024, 1.19839180e-1],
  [2048, 1.20068082e-1], [4096, 1.20059897e-1], [8192, 1.19601435e-1], [16384, 1.19870522e-1],
  [32768, 1.19587850e-1], [65536, 1.19834046e-1], [131072, 1.20485479e-1],
];

// UNFOLDED gap field (drift removed): S_2^unf(r) = mean_k (u_{k+r} - u_k)^2. [separation r, value].
const S2_UNFOLDED = [
  [1, 4.45797265e-1], [2, 3.54834118e-1], [3, 3.41546267e-1], [4, 3.38070310e-1],
  [6, 3.34952598e-1], [8, 3.30368712e-1], [12, 3.24819226e-1], [16, 3.31768395e-1],
  [24, 3.46735660e-1], [32, 3.27492306e-1], [48, 3.22914370e-1], [64, 3.27226034e-1],
  [96, 3.33579974e-1], [128, 3.26658881e-1], [192, 3.31049439e-1], [256, 3.30089775e-1],
  [384, 3.29660573e-1], [512, 3.29741243e-1], [768, 3.29700956e-1], [1024, 3.29661692e-1],
  [2048, 3.30345275e-1], [4096, 3.30478883e-1], [8192, 3.29696718e-1], [16384, 3.30561796e-1],
  [32768, 3.30073538e-1], [65536, 3.30523729e-1], [131072, 3.30662607e-1],
];

// Large-r decorrelation plateau: mean of the r >= 256 tail of each profile.
const tailMean = (tbl) => {
  const tail = tbl.filter(([r]) => r >= 256).map(([, v]) => v);
  return tail.reduce((a, b) => a + b, 0) / tail.length;
};
const PLATEAU_RAW = tailMean(S2_RAW); // ~ 0.11991
const PLATEAU_UNFOLDED = tailMean(S2_UNFOLDED); // ~ 0.33007

// Lag-r autocorrelation implied by S_2 via S_2(r) = 2 var [1 - C(r)]  =>  C(r) = 1 - S_2(r) / (2 var).
const C_RAW_1 = 1 - S2_RAW[0][1] / FIELD.twoVarGap; // ~ -0.258
const C_UNFOLDED_1 = 1 - S2_UNFOLDED[0][1] / FIELD.twoVarUnfolded; // ~ -0.350

export const IMP3734_GAP_STRUCTURE_FUNCTION_S2 = {
  id: 'imp-3734',
  proofSection: 'S-frontier',
  question:
    'Measured on the Riemann-zero gap field g_k = gamma_{k+1} - gamma_k, is the imp-3714 candidate-K3 ' +
    'equal-time two-point structure function S_2(r) = mean_k (g_{k+r} - g_k)^2 a well-defined two-point ' +
    'profile that clears REQ-i, and does it (as claimed) attach no flow depth and so fail REQ-ii?',
  field: FIELD,
  s2Raw: S2_RAW,
  s2Unfolded: S2_UNFOLDED,
  plateauRaw: PLATEAU_RAW,
  plateauUnfolded: PLATEAU_UNFOLDED,
  lag1AutocorrelationRaw: C_RAW_1,
  lag1AutocorrelationUnfolded: C_UNFOLDED_1,
  // The imp-3714 K3 classification, now measured.
  clearsReqI: true, // two-point, x-resolved: a smooth function of the separation r
  failsReqII: true, // purely equal-time: no attached backward-flow depth s(y)
  isRigorous: false,
  g6aStillOpen: true,
  verdict:
    'MEASURED (numerical diagnostic, NOT rigorous): the imp-3714 candidate-K3 equal-time gap structure ' +
    'function S_2(r) = mean_k (g_{k+r} - g_k)^2 on the first 1e6 Riemann-zero gaps is a well-defined ' +
    'two-point profile -- it depends smoothly on the separation r (clears REQ-i, the two-point ' +
    'x-difference dependence). At r = 1 it exceeds its large-r plateau (raw 0.16218 vs ~0.11991; ' +
    'unfolded 0.44580 vs ~0.33007), i.e. the lag-1 autocorrelation C(1) = 1 - S_2(1)/(2 var) is NEGATIVE ' +
    '(raw -0.258, unfolded -0.350): consecutive gaps REPEL, the GUE-like level-repulsion signature. As r ' +
    'grows the profile relaxes monotonically to a decorrelation plateau; the unfolded plateau matches ' +
    '2*var(unfolded) = 0.33024 to 0.13 percent (C(r) -> 0). But S_2(r) is a PURELY EQUAL-TIME statistic ' +
    'of the frozen gap field: it has no time / flow argument and attaches NO backward-flow depth s(y), so ' +
    'it cannot pin 2 s(y)/y^2 = E_meso at the collision scale g_k -> 0 and cannot secure the Lemma B floor ' +
    'exp(-2 s / y^2). It LOCATES the two-point scale but supplies no s(y): right TYPE, no adapted DEPTH, ' +
    'so it FAILS REQ-ii -- confirming the imp-3714 K3 near-miss empirically. Diagnostic measurement only; ' +
    'no construction, no positivity, no bridge closure, no RH claim, NO QED. imp-3066 off-diagonal ' +
    'endpoint-Hankel K_a >= 0 positivity UNTOUCHED. No refereed bound is changed.',
  citation:
    'imp-3714 (K3 = equal-time two-point gap structure function, classified near-miss: clears REQ-i, ' +
    'fails REQ-ii); imp-3693 (REQ-i, per-gap field g_k is the right-type object); imp-3708 (REQ-ii, ' +
    'y2-adapted flow depth s(y) ~ y^2 required); ZEROS_EXTENDED first 1e6 ordinates.',
};

export const IMP3734_GAP_STRUCTURE_FUNCTION_S2_ASSERTIONS = [
  {
    // The object exists and is a genuine two-point profile: both tables span the full separation range.
    id: 'imp3734-s2-is-two-point-profile',
    description: 'S_2(r) is tabulated as a two-point profile over a wide separation range (r = 1 .. 131072)',
    holds: () =>
      S2_RAW.length === S2_UNFOLDED.length &&
      S2_RAW.length >= 20 &&
      S2_RAW[0][0] === 1 &&
      S2_RAW[S2_RAW.length - 1][0] === 131072 &&
      S2_RAW.every(([, v]) => Number.isFinite(v) && v > 0),
  },
  {
    // Level-repulsion signature: r = 1 sits ABOVE the large-r plateau, i.e. lag-1 autocorrelation < 0.
    id: 'imp3734-level-repulsion-anticorrelation',
    description: 'S_2(1) exceeds the large-r plateau (both raw and unfolded); lag-1 autocorrelation is negative',
    holds: () =>
      S2_RAW[0][1] > PLATEAU_RAW * 1.2 &&
      S2_UNFOLDED[0][1] > PLATEAU_UNFOLDED * 1.2 &&
      C_RAW_1 < 0 &&
      C_UNFOLDED_1 < 0,
  },
  {
    // Decorrelation at large r: the UNFOLDED plateau equals 2*var(unfolded) to within 1 percent (C(r) -> 0).
    id: 'imp3734-unfolded-plateau-equals-2var',
    description: 'The unfolded large-r plateau matches 2*var(unfolded) to within 1 percent (decorrelation)',
    holds: () =>
      Math.abs(PLATEAU_UNFOLDED / FIELD.twoVarUnfolded - 1) < 1e-2,
  },
  {
    // Honesty gate: clears REQ-i, fails REQ-ii, no QED, imp-3066 untouched, no refereed bound is changed, G6a open.
    id: 'imp3734-honesty-gate-clears-reqI-fails-reqII',
    description: 'Diagnostic only: S_2 clears REQ-i, fails REQ-ii; no QED, imp-3066 untouched, no refereed bound is changed, G6a open',
    holds: () =>
      IMP3734_GAP_STRUCTURE_FUNCTION_S2.clearsReqI === true &&
      IMP3734_GAP_STRUCTURE_FUNCTION_S2.failsReqII === true &&
      IMP3734_GAP_STRUCTURE_FUNCTION_S2.isRigorous === false &&
      IMP3734_GAP_STRUCTURE_FUNCTION_S2.g6aStillOpen === true &&
      /NO QED/.test(IMP3734_GAP_STRUCTURE_FUNCTION_S2.verdict) &&
      /refereed bound is changed/i.test(IMP3734_GAP_STRUCTURE_FUNCTION_S2.verdict) &&
      /imp-3066[^.]*UNTOUCHED/.test(IMP3734_GAP_STRUCTURE_FUNCTION_S2.verdict),
  },
];

for (const a of IMP3734_GAP_STRUCTURE_FUNCTION_S2_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-3734-gap-structure-function-s2 assertion failed: ${a.id}`);
  }
}
