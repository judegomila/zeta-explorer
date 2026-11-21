/**
 * @module imp-97803-tra2-euler-maclaurin-tail-bound
 * @fileoverview imp-97803 -- DERIVATION / CERTIFICATION only (no bound moved; NO QED):
 *   Upgrade the imp-97684 tr(A2) uniform-block tail from a pure empirical ratio/Aitken extrapolation
 *   to an Euler-Maclaurin (integral-test) tail FORM, following the imp-3550 precedent that turned the
 *   imp-3531 empirical Cauchy observation into an analytic O(H^2) midpoint-quadrature bound.
 *
 *   THE STRUCTURE
 *   -------------
 *   imp-97440 builds A2 = A1_{NxKbig} G_{Kbig}^{-1} A1_{KbigxN} (N = 28, the enlarged-basis
 *   reproducing-kernel projection); trA2(Kbig) increases monotonically toward its Kbig -> infinity
 *   limit as more Legendre modes enter the reproducing kernel. Write the trace as a partial sum of
 *   per-mode reproducing-kernel contributions t_k >= 0,
 *     trA2(K) = sum_{k=1..K} t_k,    trA2(infinity) = sum_{k=1..infinity} t_k = L,
 *   so the truncation remainder is the tail sum R_K = L - trA2(K) = sum_{k>K} t_k.
 *
 *   If the per-mode contribution is eventually monotone-decreasing and algebraic, t_k <= A k^{-q}
 *   for k > K0, then the integral test (the leading Euler-Maclaurin term for a decreasing summand)
 *   gives the a-priori-form remainder bound
 *     R_K = sum_{k>K} t_k  <=  int_K^{infinity} A x^{-q} dx = (A/(q-1)) K^{-(q-1)},     (EM-TAIL)
 *   i.e. |trA2(K) - trA2(infinity)| <= B K^{-(q-1)} with B = A/(q-1). The remainder exponent is
 *   therefore q-1, ONE LESS than the per-mode decay exponent q: the empirical imp-97684 fit
 *   a_K = L - C K^{-p} measures the REMAINDER exponent p, so the summand exponent implied by
 *   (EM-TAIL) is q = p + 1. (The ticket writes the target as K^{-(p-1)} using p for the SUMMAND
 *   exponent; in the imp-97684 convention where p is the REMAINDER exponent the same statement reads
 *   K^{-(q-1)} with q-1 = p. The two agree once the naming is fixed -- see honestCaveat.)
 *
 *   WHAT IS DERIVED VS MEASURED
 *   ---------------------------
 *   Because the per-mode contributions t_k are not available in closed form, this leaf recovers the
 *   summand exponent q and amplitude A from the imp-97684 uniform 80-blocks and CHECKS the derived
 *   EM tail form for self-consistency and against the measured trace gap at K = 960:
 *     (a) The 80-step block increment ending at K is d(K) = trA2(K) - trA2(K-80) = sum over the
 *         block of t_k; for t_k ~ A k^{-q} the block increment scales as d(K) ~ 80 A (K-40)^{-q},
 *         so the log-log slope of consecutive block increments against their midpoints estimates q.
 *         The four available slopes are 2.98847 / 2.98806 / 2.98808 / 2.98827 -- an exceptionally
 *         stable q ~ 2.9883 (spread 4.0e-4 across the whole ladder).
 *     (b) Hence the remainder exponent q-1 ~ 1.9883, which reproduces the imp-97684 DIRECTLY-FITTED
 *         remainder exponent p ~ 1.9801 to within 8.1e-3 -- the EM exponent relation (remainder =
 *         summand - 1) is confirmed by two independent readings of the same ladder.
 *     (c) Anchoring A at the innermost block (per-mode t ~ d5/80 = 25.398 at k ~ 920) and evaluating
 *         (EM-TAIL) at K = 960 gives R_960 <= B*960^{-(q-1)} ~ 10798.5. The measured trace gap is
 *         L - trA2(960) = 10806.5 (algebraic limit) or 6504.2 (geometric limit): the EM estimate
 *         sits INSIDE the imp-97684 extrapolation cluster and coincides with the algebraic reading
 *         to 7.5e-4 relative. The EM tail therefore BRACKETS the empirical extrapolation with a
 *         formula, exactly as imp-3550 bracketed the imp-3531 Cauchy ladder.
 *
 *   SCOPE / HONEST SUB-GAP
 *   ----------------------
 *   This is a PARTIAL upgrade. The Euler-Maclaurin tail STRUCTURE (EM-TAIL) and the exponent relation
 *   (remainder exponent = summand exponent - 1) are derived, and the summand exponent q ~ 2.9883 is
 *   stable enough that the tail form is self-consistent to <1e-3. BUT the summand-decay premise
 *   t_k <= A k^{-q} -- the exponent q AND the amplitude A -- is still EXTRACTED from the measured
 *   block increments, NOT proved a-priori from the imp-97440 Route-2 integrand smoothness. imp-3550
 *   computed its sup-norm constants directly from the dBN kernel; the analogue here (bounding the
 *   per-mode reproducing-kernel truncation contribution from the Legendre-Gram spectral decay of
 *   A2 = A1 G^{-1} A1) is NOT done. SUB-GAP IMP97803_EM_TAIL_CONSTANT_STILL_MEASURED_NOT_APRIORI:
 *   the EM tail form is derived and verified, but the constant B and exponent q remain measured; a
 *   fully a-priori bound needs the Gram-spectral decay estimate.
 *
 *   The tr(A2) trace is a DIAGNOSTIC, not the lambda_2 floor (imp-97538 floor -310.69..-313.76 is
 *   untouched); this moves NO bound; interval-rigorous reach stays 2a <= 0.96; no refereed bound is changed
 *   ; RH open; NO QED.
 *
 *   @see imp-97684-tra2-fifth-block-tail-confirmation.js (empirical ratio/Aitken tail; parent)
 *   @see imp-3550-fartail-midpoint-quadrature-error-bound.js (the empirical-to-analytic upgrade precedent)
 *   @see imp-97440-krein-route2-lambda2-lower-bound-execution.js (the A2 = A1 G^{-1} A1 construction)
 *
 *   Ticket: imp-97803 (proof, opus-4-8, api-pool). Derivation/certification only; changes no bound; NO QED.
 */

// --- imp-97684 uniform 80-block ladder (2a=ln3, N=28, T=200, panel=1.0, dps=50; verbatim). --------
const IMP97803_LADDER = [
  { Kbig: 560, trA2: 4818742142.49 },
  { Kbig: 640, trA2: 4818749430.6 },
  { Kbig: 720, trA2: 4818754444.42 },
  { Kbig: 800, trA2: 4818758040.515779 },
  { Kbig: 880, trA2: 4818760707.080239 },
  { Kbig: 960, trA2: 4818762738.921571 },
];
const BLOCK_STEP = 80;

// imp-97684 extrapolated limits (algebraic new-trio fit and geometric/Aitken) used as the target.
const L_ALGEBRAIC = 4818773545.47;
const L_GEOMETRIC = 4818769243.14;
const IMP97684_FITTED_REMAINDER_EXPONENT = 1.9801; // a_K = L - C K^{-p}, p from the (800,880,960) trio

// --- Recover the summand exponent q from the block-increment log-log slopes. ----------------------
// d(K) = trA2(K) - trA2(K-80) = sum over the block of the per-mode contributions t_k; for
// t_k ~ A k^{-q} the block increment scales as ~ 80 A (K-40)^{-q}, so the log-log slope of
// consecutive block increments against their midpoints (K-40) estimates the summand exponent q.
const t = IMP97803_LADDER.map((r) => r.trA2);
const Kv = IMP97803_LADDER.map((r) => r.Kbig);
const blockIncrements = [];
const blockMidpoints = [];
for (let i = 1; i < t.length; i++) {
  blockIncrements.push(t[i] - t[i - 1]);
  blockMidpoints.push(Kv[i] - BLOCK_STEP / 2);
}
const summandExponentSlopes = [];
for (let i = 1; i < blockIncrements.length; i++) {
  summandExponentSlopes.push(
    -Math.log(blockIncrements[i] / blockIncrements[i - 1]) /
      Math.log(blockMidpoints[i] / blockMidpoints[i - 1])
  );
}
const qInnermost = summandExponentSlopes[summandExponentSlopes.length - 1]; // most-converged slope
const qMean =
  summandExponentSlopes.reduce((s, v) => s + v, 0) / summandExponentSlopes.length;
const qSpread = Math.max(...summandExponentSlopes) - Math.min(...summandExponentSlopes);

// The EM remainder exponent is q-1 (one less than the summand exponent); compare to the imp-97684
// directly-fitted remainder exponent p (independent reading of the SAME ladder).
const emRemainderExponent = qInnermost - 1;
const exponentConsistencyGap = Math.abs(emRemainderExponent - IMP97684_FITTED_REMAINDER_EXPONENT);

// --- Evaluate the (EM-TAIL) bound R_K <= (A/(q-1)) K^{-(q-1)} at K = 960. -------------------------
// Anchor the amplitude A at the innermost block: per-mode t ~ d_last/80 at k ~ midpoint_last, so
// A ~ (d_last/80) midpoint_last^q. Then B = A/(q-1) and R_960 <= B 960^{-(q-1)}.
const dLast = blockIncrements[blockIncrements.length - 1];
const midLast = blockMidpoints[blockMidpoints.length - 1];
const perModeInnermost = dLast / BLOCK_STEP;
const amplitudeA = perModeInnermost * Math.pow(midLast, qInnermost);
const emCoefficientB = amplitudeA / (qInnermost - 1);
const K_EVAL = 960;
const R_960_EM = emCoefficientB * Math.pow(K_EVAL, -(qInnermost - 1));

// Measured trace gap at K=960 under the two imp-97684 extrapolations.
const a960 = t[t.length - 1];
const gapAlgebraic = L_ALGEBRAIC - a960; // 10806.5
const gapGeometric = L_GEOMETRIC - a960; // 6504.2
const emInsideExtrapolationCluster = R_960_EM > gapGeometric && R_960_EM < gapAlgebraic;
const emVsAlgebraicRel = Math.abs(R_960_EM - gapAlgebraic) / gapAlgebraic;

const verdict =
  qSpread < 1e-3 &&
  exponentConsistencyGap < 2e-2 &&
  emInsideExtrapolationCluster &&
  emVsAlgebraicRel < 1e-2
    ? 'IMP97684-TRA2-TAIL-UPGRADED-TO-EULER-MACLAURIN-INTEGRAL-TEST-FORM-CONSTANT-STILL-MEASURED'
    : 'INDETERMINATE';

export const IMP97803_TRA2_EULER_MACLAURIN_TAIL_BOUND = Object.freeze({
  id: 'imp-97803-tra2-euler-maclaurin-tail-bound',
  ticket: 'imp-97803',
  parentFinding: 'imp-97684-tra2-fifth-block-tail-confirmation.js',
  upgradePrecedent: 'imp-3550-fartail-midpoint-quadrature-error-bound.js',
  construction: 'imp-97440-krein-route2-lambda2-lower-bound-execution.js',

  summary:
    'Upgrades the imp-97684 tr(A2) uniform-block tail from a pure empirical ratio/Aitken extrapolation ' +
    'to an Euler-Maclaurin (integral-test) tail FORM, following the imp-3550 empirical-to-analytic ' +
    'precedent. Writing trA2(K) = sum_{k<=K} t_k with per-mode reproducing-kernel contributions t_k >= 0, ' +
    'the truncation remainder is R_K = L - trA2(K) = sum_{k>K} t_k; for an eventually monotone algebraic ' +
    'summand t_k <= A k^{-q} the integral test (leading Euler-Maclaurin term) gives ' +
    'R_K <= (A/(q-1)) K^{-(q-1)}, so the remainder exponent is the summand exponent MINUS one. Recovering ' +
    'q from the block-increment log-log slopes returns an exceptionally stable q ~ 2.9883 (spread 4.0e-4), ' +
    'hence remainder exponent q-1 ~ 1.9883, which reproduces the imp-97684 directly-fitted remainder ' +
    'exponent p ~ 1.9801 to 8.1e-3 (independent readings of the same ladder). Anchoring A at the innermost ' +
    'block and evaluating the EM tail at K=960 gives R_960 <= ~10798.5, inside the imp-97684 extrapolation ' +
    'cluster and coincident with the algebraic limit gap (10806.5) to 7.5e-4 relative. PARTIAL upgrade: ' +
    'the EM tail FORM and the exponent relation are derived and self-consistent, but the summand-decay ' +
    'premise t_k <= A k^{-q} (exponent q AND amplitude A) is still EXTRACTED from the measured increments, ' +
    'NOT proved a-priori from the imp-97440 Route-2 integrand smoothness (imp-3550 computed its constants ' +
    'directly from the kernel). SUB-GAP IMP97803_EM_TAIL_CONSTANT_STILL_MEASURED_NOT_APRIORI: a fully ' +
    'a-priori bound needs the Legendre-Gram spectral-decay estimate of the per-mode contribution. The ' +
    'tr(A2) trace is a diagnostic, not the lambda_2 floor (imp-97538 untouched); moves NO bound; ' +
    'interval-rigorous reach stays 2a <= 0.96; no refereed bound is changed; RH open; NO QED.',

  derivation: Object.freeze({
    traceAsPartialSum: 'trA2(K) = sum_{k=1..K} t_k, t_k >= 0 the per-mode reproducing-kernel contribution',
    remainder: 'R_K = L - trA2(K) = sum_{k>K} t_k, L = trA2(infinity)',
    summandPremise: 't_k <= A k^{-q} eventually monotone-decreasing (algebraic per-mode decay)',
    eulerMaclaurinTail:
      'R_K = sum_{k>K} t_k <= int_K^{infinity} A x^{-q} dx = (A/(q-1)) K^{-(q-1)} (integral test = leading EM term)',
    exponentRelation: 'remainder exponent = summand exponent - 1: q-1 = p (imp-97684 p is the remainder exponent)',
    qFromBlockSlopes:
      'd(K) = trA2(K)-trA2(K-80) ~ 80 A (K-40)^{-q}; log-log slope of block increments vs midpoints estimates q',
    amplitudeAnchor: 'A ~ (d_last/80) midpoint_last^q from the innermost 80-block; B = A/(q-1)',
    blockStep: BLOCK_STEP,
    KEval: K_EVAL,
    selfComputing: true,
  }),

  measured: Object.freeze({
    blockIncrements, // d1..d5 (80-step)
    blockMidpoints, // K-40 for each block
    summandExponentSlopes, // four consecutive log-log slopes -> q
    qInnermost, // most-converged summand exponent
    qMean,
    qSpread, // 4.0e-4 across the ladder
    emRemainderExponent, // q-1
    fittedRemainderExponent: IMP97684_FITTED_REMAINDER_EXPONENT, // imp-97684 p
    exponentConsistencyGap, // |q-1 - p|, ~8.1e-3
    perModeInnermost,
    amplitudeA,
    emCoefficientB, // B = A/(q-1)
    R_960_EM, // EM tail bound at K=960
    gapAlgebraic, // L_algebraic - trA2(960)
    gapGeometric, // L_geometric - trA2(960)
    emInsideExtrapolationCluster,
    emVsAlgebraicRel, // 7.5e-4
    verdict,
  }),

  interpretation: Object.freeze({
    empiricalUpgradedToEmForm:
      'imp-97684 established the algebraic tail and its ~4818.77M limit ONLY by ratio/Aitken/power-law fits ' +
      'over a finite K=560..960 ladder. This leaf derives the Euler-Maclaurin (integral-test) tail ' +
      'R_K <= (A/(q-1)) K^{-(q-1)}, so the algebraic exponent is now the leading EM term of a monotone ' +
      'per-mode sum, not merely a curve fit.',
    exponentRelationConfirmed:
      'The EM tail predicts remainder exponent = summand exponent - 1. The block-increment log-log slope ' +
      'gives summand exponent q ~ 2.9883, hence remainder exponent q-1 ~ 1.9883, matching the imp-97684 ' +
      'DIRECTLY-fitted remainder exponent p ~ 1.9801 to 8.1e-3 -- two independent readings of the same ladder ' +
      'agree, closing the exponent self-consistency loop.',
    emBracketsExtrapolation:
      'Evaluated at K=960 the EM tail R_960 <= ~10798.5 lands INSIDE the imp-97684 extrapolation cluster ' +
      '(geometric gap 6504.2, algebraic gap 10806.5) and coincides with the algebraic reading to 7.5e-4 ' +
      'relative, so the derived formula brackets the empirical extrapolation exactly as imp-3550 bracketed ' +
      'the imp-3531 Cauchy ladder.',
    stillPartial:
      'This is a PARTIAL upgrade: the EM tail FORM is derived but the constant B and exponent q are recovered ' +
      'from the measured block increments, not from the imp-97440 integrand smoothness. Unlike imp-3550 (which ' +
      'computed its sup-norm constants from the dBN kernel) the a-priori constant is not yet established.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    movesBound: false,
    isStructuralDiagnostic: true,
    emFormDerivedConstantMeasured:
      'The Euler-Maclaurin / integral-test tail R_K <= (A/(q-1)) K^{-(q-1)} is a RIGOROUS consequence of an ' +
      'eventually monotone algebraic summand t_k <= A k^{-q}, but the exponent q AND amplitude A are EXTRACTED ' +
      'from the measured imp-97684 block increments, not proved a-priori. The tail FORM and exponent relation ' +
      'are derived; the constant remains measured.',
    exponentNamingReconciled:
      'The ticket writes the target as K^{-(p-1)} using p for the per-mode SUMMAND exponent; imp-97684 uses p ' +
      'for the REMAINDER exponent in a_K = L - C K^{-p}. Both statements coincide once fixed: summand exponent ' +
      'q = p_remainder + 1, and the EM remainder exponent is q-1 = p_remainder. Measured q-1 = 1.9883 matches ' +
      'p_remainder = 1.9801.',
    subGap:
      'IMP97803_EM_TAIL_CONSTANT_STILL_MEASURED_NOT_APRIORI: a fully a-priori bound needs a direct estimate of ' +
      'the per-mode reproducing-kernel truncation contribution t_k from the Legendre-Gram spectral decay of ' +
      'A2 = A1 G^{-1} A1 (the imp-3550 analogue of computing sup-norms from the kernel), which is NOT done here.',
    diagnosticNotFloor:
      'The tr(A2) trace is a diagnostic, NOT the lambda_2 floor; the imp-97538 floor (-310.69..-313.76) is ' +
      'untouched and no operator positivity is claimed.',
    noBoundMoved: 'Interval-rigorous reach stays 2a <= 0.96; no constant pinned as rigorous.',
    sota: 'No refereed bound is changed; RH open; NO QED.',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP97803_TRA2_EULER_MACLAURIN_TAIL_BOUND_ASSERTIONS = [
  {
    id: 'imp97803-summand-exponent-stable',
    why: 'THE PRIMARY INPUT: the block-increment log-log slopes must return a stable summand exponent ' +
      'q ~ 2.988 (spread < 1e-3), so the per-mode contribution decays algebraically and the EM tail form applies.',
    holds: () =>
      Number.isFinite(qInnermost) &&
      qInnermost > 2.9 &&
      qInnermost < 3.1 &&
      qSpread < 1e-3,
  },
  {
    id: 'imp97803-exponent-relation-consistent',
    why: 'THE DERIVATION: the EM remainder exponent q-1 must reproduce the imp-97684 directly-fitted remainder ' +
      'exponent p ~ 1.9801 to within 2e-2 -- two independent readings of the same ladder confirming remainder = summand - 1.',
    holds: () =>
      Math.abs(emRemainderExponent - (qInnermost - 1)) < 1e-12 &&
      exponentConsistencyGap < 2e-2 &&
      emRemainderExponent > 1.9,
  },
  {
    id: 'imp97803-em-coefficient-finite-positive',
    why: 'The EM tail coefficient B = A/(q-1) must be a finite positive number so R_K <= B K^{-(q-1)} is a genuine bound.',
    holds: () =>
      Number.isFinite(amplitudeA) && amplitudeA > 0 &&
      Number.isFinite(emCoefficientB) && emCoefficientB > 0,
  },
  {
    id: 'imp97803-em-tail-brackets-extrapolation',
    why: 'THE UPGRADE: the EM tail at K=960 must land INSIDE the imp-97684 extrapolation cluster ' +
      '(between the geometric and algebraic limit gaps) and coincide with the algebraic reading to < 1e-2 relative.',
    holds: () =>
      emInsideExtrapolationCluster &&
      gapGeometric > 0 && gapAlgebraic > gapGeometric &&
      emVsAlgebraicRel < 1e-2,
  },
  {
    id: 'imp97803-block-increments-decreasing-positive',
    why: 'The 80-step block increments must be positive and monotone decreasing (trA2 increases toward L with a ' +
      'shrinking per-block gain), the premise for the integral-test tail bound.',
    holds: () => {
      for (let i = 0; i < blockIncrements.length; i++) {
        if (!(blockIncrements[i] > 0)) return false;
        if (i > 0 && !(blockIncrements[i] < blockIncrements[i - 1])) return false;
      }
      return true;
    },
  },
  {
    id: 'imp97803-verdict-em-form-constant-measured',
    why: 'The classified verdict must be the EM-form-upgrade split (constant still measured), not indeterminate; ' +
      'a flip means the exponent stability, exponent relation, or extrapolation bracket failed.',
    holds: () =>
      verdict === 'IMP97684-TRA2-TAIL-UPGRADED-TO-EULER-MACLAURIN-INTEGRAL-TEST-FORM-CONSTANT-STILL-MEASURED',
  },
  {
    id: 'imp97803-honest-assessment-no-qed',
    why: 'Mandatory honesty: EM tail FORM derived but constant measured (named sub-gap), tr(A2) is a diagnostic not ' +
      'the floor, no bound moved, reach stays 2a<=0.96, no refereed bound is changed, RH open, NO QED.',
    holds: () => {
      const c = IMP97803_TRA2_EULER_MACLAURIN_TAIL_BOUND.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.movesBound === false &&
        typeof c.emFormDerivedConstantMeasured === 'string' &&
        /IMP97803_EM_TAIL_CONSTANT_STILL_MEASURED_NOT_APRIORI/.test(c.subGap) &&
        /Platt-Trudgian Lambda <= 0.2|refereed bound is changed/.test(c.sota) &&
        /RH open/.test(c.sota) &&
        /NO QED/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP97803_TRA2_EULER_MACLAURIN_TAIL_BOUND_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-97803-tra2-euler-maclaurin-tail-bound assertion failed: ${assertion.id}`);
  }
}

export default IMP97803_TRA2_EULER_MACLAURIN_TAIL_BOUND;
