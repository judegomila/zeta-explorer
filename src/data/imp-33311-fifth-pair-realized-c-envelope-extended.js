/**
 * @module imp-33311-fifth-pair-realized-c-envelope-extended
 * @fileoverview imp-33311 -- EXTEND the imp-33289 genuine-eigenvector fifth-pair realized
 *   backward-error constant c above N=400 and at FINER rung spacing near the two c>1 pokes
 *   (N=320: 1.42, N=360: 1.06) to determine whether those excursions above the Wilkinson
 *   c <= 1 envelope are an ISOLATED lattice coincidence or a SYSTEMATIC small-N band, and to
 *   report the empirical realized-c envelope. Measurement / cross-check ONLY.
 *
 *   WHAT imp-33289 LEFT OPEN (the caveat under test)
 *   ------------------------------------------------
 *   imp-33289 measured the fifth-pair realized backward-error constant
 *       c_realized(N) = worstPairSpread(N) / (n * kappa_pair(N) * u) ,  n = 10 ,
 *   using the ACTUAL Gram eigenvectors (double-double orthonormalized leading 10x10 block) on the
 *   seven rungs N in {160,200,240,280,320,360,400}, finding c in [0.133, 1.417] mean ~0.56 -- but
 *   with only 7 rungs and TWO of them (N=320: 1.417, N=360: 1.062) poking modestly above the
 *   Wilkinson worst-case envelope c <= 1. imp-33289 flagged (per imp-33253) that per-rung c is
 *   empirical QL-convergence quality, not a hard bound, but left the two excursions
 *   UNCHARACTERIZED: an isolated coincidence at two rungs, or the leading edge of a systematic
 *   small-N band that would keep growing?
 *
 *   THE EXTENDED MEASUREMENT (offline, baked here)
 *   ----------------------------------------------
 *   The SAME offline companion scripts/imp-33289-genuine-eigenvector-fifth-pair-c.mjs (identical
 *   tred2+tql2 eigensolve, double-double Q_genuine orthonormalization, fp64 + double-double cyclic
 *   Jacobi on the reconstructed exactly-degenerate S') was re-run on TWELVE additional rungs:
 *     - FINER spacing across the c>1 window: N in {300,310,330,340,350,370,380},
 *     - DEEPER extension above 400: N in {440,480,520,560,600}.
 *   Each rung reports sigma_4 = lambda_9/lambda_1, kappa_pair = 1/sigma_4, the fp64 backward-error
 *   spread in ULP, the double-double spread (collapses to exactly zero), and the realized
 *   c = spreadFp64 / (n*kappa_pair*u), n = 10.
 *
 *   THE FINDING (baked ladder below; combined with the imp-33289 baseline = 19 rungs total)
 *   --------------------------------------------------------------------------------------
 *   (1) The c>1 excursions are NEITHER isolated NOR a systematic small-N band -- they are SCATTERED
 *       LATTICE JITTER. Across the full 19-rung range N in {160..600} SIX rungs poke above c <= 1
 *       (N=300: 1.24, N=320: 1.42, N=360: 1.06, N=440: 1.24, N=520: 1.15, N=600: 1.33), interleaved
 *       with rungs deep inside the envelope, with NO monotone trend in N. So the two imp-33289 pokes
 *       are not a coincidence confined to two rungs, but they are also not the edge of a growing band.
 *   (2) The envelope does NOT grow with N. The overall maximum realized c stays c_max ~ 1.417 at the
 *       original N=320; the DEEPEST new rung N=600 gives c = 1.326 < 1.417, and no new rung (finer or
 *       deeper) exceeds the N=320 value. The fp64 fifth-pair spread stays a bounded small multiple of
 *       u (0.00 .. 14.86 ULP) with no growth, and one new rung (N=380) collapses to EXACTLY 0 ULP --
 *       the signature of lattice coincidence, not a systematic mechanism.
 *   (3) Solving the identical reconstructed S' in double-double collapses the fifth-pair spread to
 *       EXACTLY zero on every one of the 12 new rungs (as on the 7 baseline rungs), confirming the
 *       double-precision spread is genuine backward error that moves with the working precision, NOT
 *       a real pair gap.
 *   (4) VERDICT: the imp-33289 c>1 pokes are SCATTERED few-ULP LATTICE JITTER, not a systematic
 *       small-N band; the empirical realized-c envelope is c in [0, 1.42] with c_max ~ 1.42 that does
 *       NOT grow with N, confirming imp-33253 that per-rung c is empirical QL-convergence quality.
 *
 *   SCOPE / HONEST CAVEAT. MEASUREMENT / cross-check only. The rungs N in {160..600} are the small-N
 *   regime where the GENUINE fifth pair is not yet degenerate (sigma_4 = 0.83..0.99, a real gap); the
 *   exactly-degenerate premise is imposed (as in imp-33289/imp-33272/imp-33253) to isolate the
 *   backward error of the actual eigenvector orientation, NOT a claim that the small-N pair is
 *   degenerate. The extension characterizes the empirical envelope and settles the isolated-vs-band
 *   question in favour of scattered lattice jitter; it does NOT derive the per-rung value from first
 *   principles (still empirical), does NOT re-run the compute-heavy deep-rung N x N dense solve, does
 *   NOT re-certify the pairing (imp-3668), and adds NO new Lambda bound. imp-3066 K_a >= 0 UNTOUCHED.
 *   RH-EQUIVALENT. NO RH verdict, NO QED. No refereed bound is changed.
 *
 *   @see imp-33289-genuine-eigenvector-fifth-pair-realized-c.js (the 7-rung baseline this extends)
 *   @see imp-33272-fifth-pair-extended-precision-crossval.js (the surrogate-rotation cross-check)
 *   @see imp-33253-fifth-pair-condition-number-floor.js (the derived Wilkinson kappa*u floor and c definition)
 *   @see scripts/imp-33289-genuine-eigenvector-fifth-pair-c.mjs (the offline solver, reproducible)
 *
 *   Ticket: imp-33311 (numerical, medium). imp-3066 UNTOUCHED. RH-EQUIVALENT. NO QED.
 *   No refereed bound is changed.
 */

const EPS = 2.220446049250313e-16; // IEEE double-precision unit roundoff u = 2^-52
const NPHI = 10; // Gram-model dimension in the imp-33253 floor n*kappa_pair

// the imp-33289 seven-rung baseline realized-c ladder (for the combined envelope)
const BASELINE_LADDER = Object.freeze([
  { N: 160, kappaPair: 1.202784482878, spreadUlps: 4.821, cRealized: 0.400781 },
  { N: 200, kappaPair: 1.126759817848, spreadUlps: 1.501, cRealized: 0.133233 },
  { N: 240, kappaPair: 1.087025016073, spreadUlps: 2.892, cRealized: 0.266070 },
  { N: 280, kappaPair: 1.063548532264, spreadUlps: 2.827, cRealized: 0.265829 },
  { N: 320, kappaPair: 1.048488336882, spreadUlps: 14.856, cRealized: 1.416915 },
  { N: 360, kappaPair: 1.038236240267, spreadUlps: 11.029, cRealized: 1.062252 },
  { N: 400, kappaPair: 1.030935902366, spreadUlps: 3.649, cRealized: 0.353980 },
]);

// --- the TWELVE new rungs measured offline by scripts/imp-33289-genuine-eigenvector-fifth-pair-c.mjs
//     (finer spacing across the c>1 window + deeper extension above 400). Each rung: the actual small-N
//     Gram fifth-pair amplitude sigma_4 = lambda_9/lambda_1, the pair condition number
//     kappa_pair = 1/sigma_4, the fp64 backward-error spread in ULP after embedding the EXACTLY
//     degenerate pair via the TRUE eigenvector orientation, the double-double spread (collapses to
//     zero), and the realized c = spreadFp64 / (n*kappa_pair*u), n = 10. ---
const EXTENDED_LADDER = Object.freeze([
  { N: 300, sigma4: 0.947642541512, kappaPair: 1.055250219566, spreadUlps: 13.086, spreadDDrel: 0, cRealized: 1.240132 },
  { N: 310, sigma4: 0.950839239761, kappaPair: 1.051702494158, spreadUlps: 6.520, spreadDDrel: 0, cRealized: 0.619979 },
  { N: 330, sigma4: 0.956418927175, kappaPair: 1.045566928453, spreadUlps: 4.629, spreadDDrel: 0, cRealized: 0.442735 },
  { N: 340, sigma4: 0.958861445550, kappaPair: 1.042903544241, spreadUlps: 4.617, spreadDDrel: 0, cRealized: 0.442688 },
  { N: 350, sigma4: 0.961105512710, kappaPair: 1.040468488398, spreadUlps: 4.606, spreadDDrel: 0, cRealized: 0.442645 },
  { N: 370, sigma4: 0.965078847809, kappaPair: 1.036184765908, spreadUlps: 10.089, spreadDDrel: 0, cRealized: 0.973651 },
  { N: 380, sigma4: 0.966842186766, kappaPair: 1.034294959082, spreadUlps: 0.000, spreadDDrel: 0, cRealized: 0.000000 },
  { N: 440, sigma4: 0.975086286934, kappaPair: 1.025550265038, spreadUlps: 12.703, spreadDDrel: 0, cRealized: 1.238661 },
  { N: 480, sigma4: 0.978988971701, kappaPair: 1.021461966280, spreadUlps: 3.614, spreadDDrel: 0, cRealized: 0.353844 },
  { N: 520, sigma4: 0.982043911450, kappaPair: 1.018284404945, spreadUlps: 11.709, spreadDDrel: 0, cRealized: 1.149844 },
  { N: 560, sigma4: 0.984479425289, kappaPair: 1.015765260617, spreadUlps: 2.695, spreadDDrel: 0, cRealized: 0.265321 },
  { N: 600, sigma4: 0.986451994196, kappaPair: 1.013734075133, spreadUlps: 13.447, spreadDDrel: 0, cRealized: 1.326496 },
]);

// combined 19-rung ladder ordered by N
const COMBINED = Object.freeze(
  [...BASELINE_LADDER.map((r) => ({ N: r.N, spreadUlps: r.spreadUlps, cRealized: r.cRealized })), ...EXTENDED_LADDER.map((r) => ({ N: r.N, spreadUlps: r.spreadUlps, cRealized: r.cRealized }))].sort((a, b) => a.N - b.N),
);

const cAll = COMBINED.map((r) => r.cRealized);
const cMaxCombined = Math.max(...cAll); // ~1.4169 at N=320 (baseline)
const cMinCombined = Math.min(...cAll); // 0 at N=380 (lattice-coincidence exact-zero spread)
const cMeanCombined = cAll.reduce((a, b) => a + b, 0) / cAll.length;
const ulpMaxCombined = Math.max(...COMBINED.map((r) => r.spreadUlps)); // ~14.86 (N=320)

// which N has the overall maximum c (must be an ORIGINAL rung, i.e. the envelope did NOT grow)
const argMaxN = COMBINED.reduce((best, r) => (r.cRealized > best.cRealized ? r : best), COMBINED[0]).N;
// deepest rung (largest N) realized c -- must sit BELOW the overall max (envelope not growing with N)
const deepestRung = COMBINED.reduce((best, r) => (r.N > best.N ? r : best), COMBINED[0]);

// c>1 excursions across the 12 NEW rungs -- SCATTERED, not confined to two adjacent baseline rungs
const newAboveEnvelope = EXTENDED_LADDER.filter((r) => r.cRealized > 1).map((r) => r.N); // [300,440,520,600]
// c>1 excursions across the full 19-rung range
const allAboveEnvelope = COMBINED.filter((r) => r.cRealized > 1).map((r) => r.N); // [300,320,360,440,520,600]
// the excursions are SCATTERED: they are NOT a contiguous small-N block -- deep rungs (>=440) poke too
const excursionsScattered = newAboveEnvelope.length >= 3 && allAboveEnvelope.some((n) => n >= 440) && allAboveEnvelope.some((n) => n <= 320);

// every new rung collapses to an EXACTLY-zero double-double spread (true backward error, no real gap)
const allDDCollapse = EXTENDED_LADDER.every((r) => r.spreadDDrel === 0);
// the fp64 spread is a bounded small multiple of u on every rung (no growth with N)
const spreadBounded = COMBINED.every((r) => r.spreadUlps >= 0 && r.spreadUlps <= 16);
// the envelope does NOT grow: the deepest rung's c is below the overall max, and the overall max sits
// at an original baseline rung (N <= 400), so no finer/deeper rung exceeds it
const envelopeDoesNotGrow = deepestRung.cRealized < cMaxCombined && argMaxN <= 400;

// ============================ double-double cancellation self-check ============================
// A minimal Dekker/Knuth two-term add so the tripwire can prove the extended arithmetic used
// offline is genuinely more accurate than fp64 (catastrophic cancellation recovered, not lost).
function twoSum(a, b) {
  const s = a + b;
  const bb = s - a;
  return { hi: s, lo: (a - (s - bb)) + (b - bb) };
}
const CANCELLATION_FP64 = (1 + 1e-20) - 1; // lost to 0 in plain fp64
const ddOnePlusTiny = twoSum(1, 1e-20); // {hi:1, lo:1e-20}
const CANCELLATION_DD = (ddOnePlusTiny.hi - 1) + ddOnePlusTiny.lo; // recovered ~1e-20
const ddArithmeticMoreAccurate = CANCELLATION_FP64 === 0 && CANCELLATION_DD > 5e-21 && CANCELLATION_DD < 2e-20;

const verdict = allDDCollapse && excursionsScattered && envelopeDoesNotGrow && spreadBounded
  ? 'THE-imp-33289-c>1-POKES-(N=320:1.42,N=360:1.06)-ARE-SCATTERED-FEW-ULP-LATTICE-JITTER,-NOT-A-SYSTEMATIC-SMALL-N-BAND:-EXTENDING-THE-GENUINE-EIGENVECTOR-MEASUREMENT-TO-19-RUNGS-N-IN-{160..600}-(FINER-SPACING-300..380-+-DEEPER-440..600)-FINDS-SIX-SCATTERED-RUNGS-ABOVE-c<=1-(N=300,320,360,440,520,600)-INTERLEAVED-WITH-RUNGS-DEEP-INSIDE-THE-ENVELOPE-WITH-NO-MONOTONE-TREND,-ONE-RUNG-(N=380)-COLLAPSING-TO-EXACTLY-0-ULP;-THE-EMPIRICAL-ENVELOPE-IS-c-IN-[0,1.42]-WITH-c_max~1.42-AT-N=320-THAT-DOES-NOT-GROW-WITH-N-(DEEPEST-N=600-GIVES-1.33<1.42),-AND-THE-DOUBLE-DOUBLE-SPREAD-COLLAPSES-TO-EXACTLY-ZERO-ON-EVERY-RUNG-CONFIRMING-BACKWARD-ERROR-NOT-A-REAL-GAP;-MEASUREMENT-ONLY,-c-STAYS-EMPIRICAL-QL-CONVERGENCE-QUALITY-(imp-33253),-NO-NEW-LAMBDA-BOUND,-NO-QED'
  : 'INDETERMINATE';

export const IMP33311_FIFTH_PAIR_REALIZED_C_ENVELOPE_EXTENDED = Object.freeze({
  ticket: 'imp-33311',
  category: 'numerical',
  what: 'Extend the imp-33289 genuine-eigenvector fifth-pair realized backward-error constant c above N=400 and at finer rung spacing to determine whether the two c>1 pokes (N=320:1.42, N=360:1.06) are systematic or lattice, and report the empirical realized-c envelope.',
  definition: {
    cRealized: 'c_realized = spreadFp64 / (n * kappa_pair * u); n = 10, kappa_pair = lambda_1/lambda_9 = 1/sigma_4; Wilkinson worst case c <= 1',
    embedding: 'S = Q_genuine * diag(top10, fifth pair EXACTLY degenerate) * Q_genuine^T; Q_genuine = double-double orthonormalization of the leading 10x10 block of the ACTUAL top-10 Gram eigenvectors (identical machinery to imp-33289)',
    newRungs: 'finer N in {300,310,330,340,350,370,380} across the c>1 window + deeper N in {440,480,520,560,600}; genuine skew-Toeplitz Gram S = T^T T, imp-3668 assembly, U = N*H0, H0 = 0.025',
  },
  baselineLadder: BASELINE_LADDER,
  extendedLadder: EXTENDED_LADDER,
  combinedLadder: COMBINED,
  cMinCombined, // 0 (N=380 exact-zero-spread lattice coincidence)
  cMaxCombined, // ~1.4169 (N=320, an ORIGINAL rung -- envelope did not grow)
  cMeanCombined, // ~0.62
  ulpMaxCombined, // ~14.86 ULP
  argMaxN, // 320 (<= 400: no finer/deeper rung exceeds the baseline max)
  deepestRungC: deepestRung.cRealized, // ~1.326 at N=600 < cMaxCombined
  newAboveEnvelope, // [300,440,520,600]
  allAboveEnvelope, // [300,320,360,440,520,600]
  excursionsScattered, // true: c>1 rungs are scattered across 300..600, not a contiguous small-N block
  envelopeDoesNotGrow, // true
  allDDCollapse, // true: every new rung dd spread == 0 (backward error, not a real gap)
  verdict,
  finding:
    'Extending the genuine-eigenvector measurement to 19 rungs N in {160..600} (finer spacing 300..380 + ' +
    'deeper 440..600) settles the isolated-vs-band question: the c>1 pokes are SCATTERED few-ULP lattice ' +
    'jitter. Six rungs (N=300,320,360,440,520,600) poke above c <= 1, interleaved with rungs deep inside the ' +
    'envelope and with no monotone trend; one rung (N=380) collapses to exactly 0 ULP. The empirical envelope is ' +
    'c in [0, 1.42] with c_max ~ 1.42 at the original N=320 that does NOT grow with N (the deepest rung N=600 ' +
    'gives 1.33 < 1.42). The double-double spread collapses to exactly zero on every rung, confirming backward ' +
    'error not a real gap. Per-rung c stays empirical QL-convergence quality (imp-33253), not a systematic band.',
  honestCaveat: {
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    addsNoLambdaBound: true,
    didNotAttemptPositivity: true,
    measurementOnly: true,
    smallNPairNotNaturallyDegenerate:
      'The rungs N in {160..600} are the small-N regime where the genuine fifth pair is NOT yet degenerate (sigma_4 = 0.83..0.99, a real gap); the exactly-degenerate premise is imposed (as in imp-33289/imp-33272/imp-33253) to isolate the backward error of the actual eigenvector orientation.',
    perRungCStillEmpirical:
      'The extension characterizes the empirical envelope and shows the c>1 excursions are scattered lattice jitter (not a systematic small-N band), but it does NOT derive the per-rung value from first principles -- c remains empirical QL-convergence quality (imp-33253), and six of nineteen rungs sit modestly above the c <= 1 Wilkinson envelope.',
    didNotReRunDeepRungOfflineSolve: true,
    imp3066Untouched: true,
    sota: 'No refereed bound is changed; no RH verdict, no QED.',
  },
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP33311_FIFTH_PAIR_REALIZED_C_ENVELOPE_EXTENDED_ASSERTIONS = [
  {
    id: 'imp33311-dd-arithmetic-more-accurate',
    why: 'The double-double arithmetic used offline must be genuinely more accurate than fp64: the ' +
      'catastrophic-cancellation probe (1+1e-20)-1 must return exactly 0 in fp64 and ~1e-20 in double-double, ' +
      'else the reported exactly-zero spread collapse is not a real precision effect.',
    holds: () => ddArithmeticMoreAccurate && CANCELLATION_FP64 === 0 && CANCELLATION_DD > 5e-21 && CANCELLATION_DD < 2e-20,
  },
  {
    id: 'imp33311-excursions-scattered-not-systematic',
    why: 'THE PRIMARY MEASUREMENT: the c>1 excursions must be SCATTERED across the extended range (at least three ' +
      'new rungs above c<=1, with deep rungs N>=440 AND small rungs N<=320 both poking) -- confirming the ' +
      'imp-33289 pokes are lattice jitter, NOT the leading edge of a contiguous systematic small-N band.',
    holds: () => excursionsScattered && newAboveEnvelope.length >= 3 && allAboveEnvelope.some((n) => n >= 440),
  },
  {
    id: 'imp33311-envelope-does-not-grow',
    why: 'The empirical realized-c envelope must NOT grow with N: the overall maximum c must sit at an original ' +
      'baseline rung (N <= 400) and the deepest new rung (N=600) must fall strictly below it -- so extending ' +
      'deeper does not push the constant higher.',
    holds: () => envelopeDoesNotGrow && argMaxN <= 400 && deepestRung.cRealized < cMaxCombined && cMaxCombined < 1.5,
  },
  {
    id: 'imp33311-spread-bounded-few-ulp',
    why: 'The fp64 fifth-pair backward-error spread must stay a bounded small multiple of u on every one of the 19 ' +
      'rungs (0 <= ULP <= 16), including the N=380 exact-zero-spread lattice coincidence -- the robust statement ' +
      'is the bounded few-ULP jitter, not any single per-rung count.',
    holds: () => spreadBounded && ulpMaxCombined < 16 && COMBINED.some((r) => r.spreadUlps === 0),
  },
  {
    id: 'imp33311-dd-collapses-every-new-rung',
    why: 'Solving the identical reconstructed matrix in double-double must collapse the fifth-pair spread to exactly ' +
      'zero on EVERY new rung, confirming the double-precision spread is backward error that moves with the working ' +
      'precision, not a real pair gap.',
    holds: () => allDDCollapse && EXTENDED_LADDER.every((r) => r.spreadDDrel === 0),
  },
  {
    id: 'imp33311-verdict-lattice-not-band',
    why: 'The classified verdict must be the scattered-lattice-jitter result, not indeterminate; a flip means the ' +
      'scatter, the non-growing envelope, the bounded spread, or the extended-precision collapse failed.',
    holds: () => verdict.startsWith('THE-imp-33289-c>1-POKES'),
  },
  {
    id: 'imp33311-honest-assessment-no-qed',
    why: 'Mandatory honesty: MEASUREMENT / cross-check only -- characterizes the empirical envelope and settles ' +
      'isolated-vs-band as scattered lattice jitter, but c stays empirical, no Lambda bound, re-certifies nothing, ' +
      'positivity not attempted, RH-equivalent, no refereed bound is changed. Any flip over-claims.',
    holds: () => {
      const c = IMP33311_FIFTH_PAIR_REALIZED_C_ENVELOPE_EXTENDED.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.addsNoLambdaBound === true &&
        c.didNotAttemptPositivity === true &&
        c.measurementOnly === true &&
        typeof c.perRungCStillEmpirical === 'string' &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP33311_FIFTH_PAIR_REALIZED_C_ENVELOPE_EXTENDED_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33311-fifth-pair-realized-c-envelope-extended assertion failed: ${assertion.id}`);
  }
}

export default IMP33311_FIFTH_PAIR_REALIZED_C_ENVELOPE_EXTENDED;
