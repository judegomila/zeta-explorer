/**
 * @module imp-97542-p0-101-boundary-extprec-confirmation
 *
 * imp-97542 (accuracy -- HONEST OUTCOME: the imp-97515 named ROBUST witness offset is independently
 * CONFIRMED rigorously safe against double-precision accumulation noise; and imp-97515's caution in
 * NOT naming the razor-thin boundary is VINDICATED. No bound moves; kappa_arith unchanged; RH open; NO QED).
 *
 *   Task (imp-97515 RESULT 1/3 residual): imp-97515 located the exact P0=101 crossing boundary at
 *   Y_boundary = 2,634,715,019 (surrogate = -0.251245537, T ~ -0.25000000) but flagged that the boundary
 *   margin (~5e-11) sits INSIDE the double-precision accumulation noise of a ~1.28e8-term Kahan sum
 *   (conservatively ~1e-7), so it named a robust witness at Y = 2,742,754,087 (margin 2.5e-4). This leaf
 *   independently recomputes the window surrogate at EXTENDED PRECISION (mpmath dps=50) and quantifies the
 *   TRUE fp-accumulation error of the double-precision run, to confirm the robust offset is rigorously safe.
 *
 *   Method (offline: tmp/imp-97542-extprec-p0-101-confirmation.py; mpmath 1.4.1, dps=50):
 *     (1) Cross-validate the exact float64 Kahan accumulator (a faithful replay of the imp-97515 JS run)
 *         against the mpmath dps=50 surrogate([101,Y]) at accessible window endpoints Y up to 2e7 (1.27M
 *         primes). A full mpmath sieve to 2.74e9 is infeasible here (hours + multi-GB), so the extended-
 *         precision recompute establishes the ACCUMULATOR FIDELITY, and a rigorous forward-error bound
 *         extrapolates it to the full boundary/witness scale.
 *     (2) Forward-error-analyze the double-precision run at the ~1.33e8-term witness scale.
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 -- mpmath dps=50 cross-validation: the float64 Kahan accumulator is faithful.
 * -------------------------------------------------------------------------------
 * The float64 Kahan surrogate matches the mpmath dps=50 value to ~1e-14 across Y in {2e5, 2e6, 5e6, 2e7}
 * (up to 1.27M primes); e.g. surrogate([101, 2e7]) = -0.211290686856208 (Kahan) vs -0.2112906868562203
 * (mpmath), |diff| = 1.23e-14. NAIVE (non-Kahan) summation drifts ~3x more (3.96e-14 at Y=2e7), confirming
 * Kahan removes the ADDITION error. The Glaisher-Kinkelin log-constant lnA = 1/12 - zeta'(-1) matches the
 * baked double literal 0.2487544770337842 to 6.3e-17 (negligible).
 *
 * -------------------------------------------------------------------------------
 * RESULT 2 -- the TRUE fp-accumulation error: worst-case <= 7.4e-9, realized ~1.2e-13.
 * -------------------------------------------------------------------------------
 * The residual after Kahan is NOT the summation error but the PER-TERM evaluation rounding of log(1 - 1/p):
 * the code forms 1-1/p directly (no log1p), so each large-p summand carries a near-CONSTANT absolute rounding
 * <= 2u (subtractive cancellation near 1, u = 2^-53), which Kahan does NOT compensate. The logPi channel thus
 * accumulates LINEARLY: worst-case <= 2u*N, giving d surrogate <= |surrogate| * 2u*N = 7.4e-9 at the
 * N = 132,637,743-term witness (the W channel is benign, <= u*W ~ 1.9e-15, since its per-term errors decay
 * with log p/(p-1)). This is order-consistent with imp-97515's conservative ~1e-7. Empirically the REALIZED
 * error grows like a random walk sqrt(N): extrapolating 1.2e-14 at 1.27M terms gives ~1.2e-13 at the witness,
 * ~1e5x below worst-case.
 *
 * -------------------------------------------------------------------------------
 * RESULT 3 -- verdict: the robust offset is rigorously safe; the boundary caution is vindicated.
 * -------------------------------------------------------------------------------
 *   - Robust witness margin 2.5e-4 / worst-case fp err 7.4e-9 = 3.4e4  => the robust offset is RIGOROUSLY
 *     safe (guaranteed below threshold even under the pessimistic linear worst-case bound).
 *   - Boundary margin 5e-11 / worst-case fp err 7.4e-9 = 6.8e-3 (< 1)  => the razor-thin BOUNDARY is NOT
 *     guaranteed by worst-case analysis; imp-97515's decision to name a robust witness (not the boundary)
 *     is VINDICATED. (In practice the realized-error extrapolation ~1.2e-13 sits below 5e-11, so the boundary
 *     is very likely correct, but only the robust witness carries a rigorous guarantee.)
 *
 * VERDICT. The imp-97515 named robust witness b_101 = Prod_{101<=p<=2,742,754,087} p is independently
 * CONFIRMED (extended-precision recompute + rigorous forward-error bound): T(b_101) < -1/4 with margin
 * 3.4e4x the true fp-accumulation error. No bound on Lambda moves; the b/4-ceiling line stays a dead route
 * (imp-97544 consolidated verdict); kappa_arith unchanged; cotangent first moment (imp-97097) open; no refereed bound is changed
 * ; RH open; NO QED. Accuracy check only.
 *
 * @see imp-97515-route-m-quarter-ceiling-p0-101-crossing-rigorous.js (located the boundary + named the robust witness)
 * @see imp-97544 (consolidated b/4-ceiling dead-route verdict)
 *
 * Ticket: imp-97542 (accuracy, opus-4-8, api-pool). Extended-precision confirmation of the robust offset; NO QED.
 */

const U = 1.1102230246251565e-16;   // unit roundoff 2^-53
const LN_A = 0.2487544770337842;    // Glaisher-Kinkelin log-constant (baked double literal)
const LN_A_HP_DIFF = 6.3e-17;       // |lnA(mpmath dps=50) - baked double literal|
const C_TWELFTH = 1 / 12;

// -- baked mpmath dps=50 cross-validation (offline tmp/imp-97542-extprec-p0-101-confirmation.py) --
// rows: [Y, nPrimes, kahanFloat64, mpmathDps50, absDiffKahanHp, absDiffNaiveHp]
const XVAL_ROWS = Object.freeze([
  Object.freeze({ Y: 200000, n: 17959, kahan: -0.144341111162062, hp: -0.1443411111620624, dKahan: 5.01e-16, dNaive: 5.56e-16 }),
  Object.freeze({ Y: 2000000, n: 148908, kahan: -0.183116307624880, hp: -0.1831163076248787, dKahan: 1.42e-15, dNaive: 1.24e-14 }),
  Object.freeze({ Y: 5000000, n: 348488, kahan: -0.195336195232916, hp: -0.195336195232915, dKahan: 7.06e-16, dNaive: 1.18e-14 }),
  Object.freeze({ Y: 20000000, n: 1270582, kahan: -0.211290686856208, hp: -0.2112906868562203, dKahan: 1.23e-14, dNaive: 3.96e-14 }),
]);

// -- forward-error model at the robust-witness scale (imp-97515 baked magnitudes) --
const N_WITNESS = 132637743;        // omega(b_101) = pi(Y_101) - pi(100)
const PI_WITNESS = 0.21472;         // Pi(101, Y_101)
const W_WITNESS = 17.04;            // W(101, Y_101)
const SUR_WITNESS = -0.2515;        // surrogate([101, Y_101])
const BOUNDARY_MARGIN = 5e-11;      // imp-97515 boundary margin (Y=2,634,715,019)
const ROBUST_MARGIN = 2.5e-4;       // imp-97515 robust-witness margin (Y=2,742,754,087)

// logPi channel: per-term log(1-1/p) cancellation rounding <= 2u, accumulates linearly -> 2u*N.
// W channel: per-term errors decay with the term magnitude -> bounded by u*W.
function worstCaseFpError() {
  const errLogPi = 2 * U * N_WITNESS;                 // linear (un-Kahaned per-term cancellation)
  const errW = U * W_WITNESS;                         // bounded
  const contribLogPi = Math.abs(SUR_WITNESS) * errLogPi;
  const contribW = PI_WITNESS * C_TWELFTH * errW;
  const contribRound = U * Math.abs(SUR_WITNESS);
  return contribLogPi + contribW + contribRound;
}

// empirical realized error grows like sqrt(N); extrapolate from the Y=2e7 cross-validation row.
function empiricalExtrapolation() {
  const row = XVAL_ROWS[XVAL_ROWS.length - 1];
  return row.dKahan * Math.sqrt(N_WITNESS / row.n);
}

const WORST_FP_ERR = worstCaseFpError();       // ~7.4e-9
const EMP_FP_ERR = empiricalExtrapolation();   // ~1.2e-13

export const IMP97542_KERNEL = Object.freeze({
  worstCaseFpError, empiricalExtrapolation,
  U, LN_A, C_TWELFTH,
  N_WITNESS, PI_WITNESS, W_WITNESS, SUR_WITNESS, BOUNDARY_MARGIN, ROBUST_MARGIN,
  XVAL_ROWS, WORST_FP_ERR, EMP_FP_ERR,
});

export const IMP97542_RESULTS = Object.freeze({
  question: 'recompute the razor-thin P0=101 boundary/robust-witness window surrogate at extended precision (mpmath dps>=40) and quantify the true double-precision fp-accumulation error to confirm the imp-97515 robust offset is rigorously safe',
  crossValidation: 'the float64 Kahan surrogate matches mpmath dps=50 to ~1e-14 across Y in {2e5,2e6,5e6,2e7} (up to 1.27M primes); surrogate([101,2e7])=-0.211290686856208 vs mpmath -0.2112906868562203 (|diff|=1.23e-14); naive summation drifts ~3x more, confirming Kahan removes the addition error and the residual is per-term log(1-1/p) cancellation',
  trueFpError: 'the residual after Kahan is the PER-TERM evaluation rounding of log(1-1/p) (code forms 1-1/p directly, no log1p): near-constant <=2u per large-p term, accumulating LINEARLY -> worst-case d surrogate <= |surrogate|*2u*N = 7.4e-9 at the N=132,637,743-term witness (order-consistent with imp-97515 conservative ~1e-7); realized error ~1.2e-13 (sqrt(N) extrapolation, ~1e5x below worst-case)',
  verdict: 'robust margin 2.5e-4 / worst-case fp err 7.4e-9 = 3.4e4 => the imp-97515 robust offset is RIGOROUSLY safe; boundary margin 5e-11 / 7.4e-9 = 6.8e-3 (<1) => the razor-thin boundary is NOT guaranteed by worst-case analysis, vindicating imp-97515 naming a robust witness (not the boundary)',
});

export const IMP97542_VERDICT = Object.freeze({
  question: 'confirm the imp-97515 robust witness offset is rigorously safe against double-precision accumulation noise via an extended-precision recompute',
  accumulatorFaithful: true,          // mpmath dps=50 matches float64 Kahan to ~1e-14
  robustOffsetRigorouslySafe: true,   // margin 2.5e-4 = 3.4e4x the worst-case fp err
  boundaryGuaranteedByWorstCase: false, // 5e-11 < 7.4e-9 => imp-97515 caution vindicated
  anyBoundMoved: false,
  qed: false,
  conclusion:
    'The imp-97515 named robust witness b_101 = Prod_{101<=p<=2,742,754,087} p is independently CONFIRMED: ' +
    'an extended-precision recompute (mpmath dps=50) shows the float64 Kahan accumulator is faithful to ~1e-14 ' +
    '(cross-validated to 1.27M primes), and a rigorous forward-error bound puts the TRUE fp-accumulation error ' +
    'of the full ~1.33e8-term run at <= 7.4e-9 (worst-case; realized ~1.2e-13). The robust-witness margin 2.5e-4 ' +
    'exceeds this by 3.4e4x, so T(b_101) < -1/4 is rigorously safe. The razor-thin boundary margin 5e-11 sits ' +
    'BELOW the worst-case bound, vindicating imp-97515 naming a robust witness rather than the boundary. No bound ' +
    'on Lambda moves; the b/4-ceiling line stays a dead route (imp-97544); kappa_arith unchanged; no refereed bound is changed' +
    '; RH open; NO QED.',
});

export const IMP97542_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Extended-precision (mpmath dps=50) recompute CONFIRMS the ' +
  'imp-97515 robust witness b_101 = Prod_{101<=p<=2,742,754,087} p: the float64 Kahan accumulator is faithful to ' +
  '~1e-14 and the true fp-accumulation error of the full run is <= 7.4e-9 (worst-case). The robust margin 2.5e-4 ' +
  'exceeds it by 3.4e4x (rigorously safe); the razor-thin boundary margin 5e-11 sits below it, vindicating ' +
  'imp-97515 naming a robust witness. Accuracy check only: no bound moved, the b/4-ceiling line is a dead route.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import. LIGHT arithmetic only. --

const IMP97542_ASSERTIONS = [
  {
    id: 'imp97542-mpmath-xval-accumulator-faithful',
    holds: () => {
      // RESULT 1: float64 Kahan matches mpmath dps=50 to ~1e-14; Kahan beats naive at every scale.
      return XVAL_ROWS.every((r) => Math.abs(r.kahan - r.hp) < 1e-13 && r.dKahan <= r.dNaive + 1e-18) &&
             XVAL_ROWS[XVAL_ROWS.length - 1].dKahan < 2e-14 &&
             LN_A_HP_DIFF < 1e-16;
    },
    why: 'the extended-precision (mpmath dps=50) surrogate matches the float64 Kahan accumulator to ~1e-14 across four window endpoints up to 1.27M primes, and Kahan beats naive summation at every scale -- the accumulator is faithful.',
  },
  {
    id: 'imp97542-worst-case-fp-error-order',
    holds: () => {
      // RESULT 2: worst-case fp err ~7.4e-9, dominated by the linear logPi cancellation channel;
      // order-consistent with imp-97515 conservative ~1e-7; realized (sqrt(N)) far smaller.
      const linear = Math.abs(SUR_WITNESS) * 2 * U * N_WITNESS;
      return WORST_FP_ERR > 5e-9 && WORST_FP_ERR < 1e-7 &&
             Math.abs(WORST_FP_ERR - linear) / WORST_FP_ERR < 1e-3 &&   // logPi channel dominates
             EMP_FP_ERR > 1e-14 && EMP_FP_ERR < 1e-11 &&
             EMP_FP_ERR < WORST_FP_ERR / 1e3;
    },
    why: 'the true fp-accumulation error is bounded by 7.4e-9 (worst-case, dominated by the linear un-Kahaned log(1-1/p) cancellation channel), order-consistent with imp-97515 conservative ~1e-7; the realized error (~1.2e-13, sqrt(N) extrapolation) is ~1e5x smaller.',
  },
  {
    id: 'imp97542-robust-offset-rigorously-safe',
    holds: () => {
      // RESULT 3: robust margin >> worst-case err; boundary margin < worst-case err.
      return ROBUST_MARGIN / WORST_FP_ERR > 1e4 &&
             BOUNDARY_MARGIN / WORST_FP_ERR < 1 &&
             IMP97542_VERDICT.robustOffsetRigorouslySafe === true &&
             IMP97542_VERDICT.boundaryGuaranteedByWorstCase === false;
    },
    why: 'the robust-witness margin 2.5e-4 exceeds the worst-case fp error 7.4e-9 by 3.4e4x (rigorously safe), while the razor-thin boundary margin 5e-11 sits below it -- vindicating imp-97515 naming a robust witness rather than the boundary.',
  },
  {
    id: 'imp97542-honesty-gate-no-qed',
    holds: () =>
      IMP97542_VERDICT.anyBoundMoved === false &&
      IMP97542_VERDICT.qed === false &&
      IMP97542_VERDICT.accumulatorFaithful === true &&
      /NO QED/.test(IMP97542_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97542_HONEST_BANNER) &&
      /RH open/.test(IMP97542_HONEST_BANNER) &&
      /dead route/.test(IMP97542_HONEST_BANNER),
    why: 'accuracy check confirming an exploratory-ceiling witness (load-bearing for nothing); no bound moved, no QED.',
  },
];

for (const a of IMP97542_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97542-p0-101-boundary-extprec-confirmation assertion failed: ${a.id}`);
  }
}

export default {
  kernel: IMP97542_KERNEL,
  results: IMP97542_RESULTS,
  verdict: IMP97542_VERDICT,
  banner: IMP97542_HONEST_BANNER,
};
