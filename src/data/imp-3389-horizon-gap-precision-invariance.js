/**
 * @module imp-3389-horizon-gap-precision-invariance
 * @fileoverview imp-3389 -- Measure the PRECISION-INVARIANCE of the imp-3309
 *   (1/4)ln2 horizon-gap ratio: recompute both overflow-region underflow horizons
 *   at a ladder of artificial subnormal thresholds L = ln(1 / MIN) (emulating
 *   single, double, and extended precision by varying MIN) and confirm that BOTH
 *   tau_mu(L) and tau_nu(L) shift with L while their difference tau_nu - tau_mu
 *   stays pinned near (1/4)ln2 -- i.e. the band width is a precision-INVARIANT
 *   ratio even though the absolute horizons are precision-DEPENDENT.
 *
 *   ASSESSMENT / DIAGNOSTIC ONLY. No new positivity, no RH verdict, not a
 *   reduction. No refereed bound is changed.
 *
 *   THE QUESTION (the direct test of the imp-3309 arithmetic-bookkeeping claim)
 *   --------------------------------------------------------------------------
 *   imp-3309 derived the two overflow-region underflow horizons in closed form
 *   from a single subnormal threshold L = ln(2^1074) ~ 744.44 applied to the two
 *   tails (single-Phi for nu, Phi^2 for mu):
 *     nu horizon:  pi X   - ln(2 pi^2 X)   = L   ->  X_nu,  tau_nu = (1/4) ln(X_nu)
 *     mu horizon:  2 pi X - ln(4 pi^4 X^2) = L   ->  X_mu,  tau_mu = (1/4) ln(X_mu)
 *   and argued the band width tau_nu - tau_mu ~ (1/4)ln2 is a fingerprint of the
 *   2-vs-1 tail-exponent ratio -- pure arithmetic bookkeeping, NOT Phi structure.
 *   imp-3309 evaluated this at ONE precision (native double). It never varied the
 *   subnormal threshold to confirm the DIRECT prediction of the bookkeeping claim:
 *   if the band is arithmetic, changing the machine precision must slide BOTH
 *   absolute horizons yet leave their difference near (1/4)ln2.
 *
 *   THE MEASUREMENT (an L ladder emulating five precisions)
 *   -------------------------------------------------------
 *   The horizon balances depend on the arithmetic environment ONLY through the
 *   scalar L = ln(1 / MIN) = (bits) * ln 2, MIN the smallest positive subnormal.
 *   We re-solve both fixed-point balances at
 *     single    MIN = 2^-149    L ~ 103.28
 *     2^-256                     L ~ 177.45
 *     2^-512                     L ~ 354.89
 *     double    MIN = 2^-1074   L ~ 744.44   (the imp-3309 native case)
 *     x87-ext   MIN = 2^-16445  L ~ 11398.81
 *   and tabulate tau_mu(L), tau_nu(L) and the gap tau_nu - tau_mu.
 *
 *   THE RESULT (measured, self-computing)
 *   -------------------------------------
 *     precision      L         tau_mu    tau_nu    gap        gap - (1/4)ln2
 *     single       103.28     0.72689   0.88852   0.161626    -1.17e-2
 *     2^-256       177.45     0.85259   1.01823   0.165640    -7.65e-3
 *     2^-512       354.89     1.01823   1.18716   0.168927    -4.36e-3
 *     double       744.44     1.19886   1.36980   0.170942    -2.35e-3  (imp-3309)
 *     x87-ext    11398.81     1.87631   2.04938   0.173072    -2.14e-4
 *   The absolute horizons slide by ~1.15 (tau_mu 0.727 -&gt; 1.876, tau_nu 0.889 -&gt;
 *   2.049) across the ladder, yet the gap stays inside a ~0.0115-wide band below
 *   (1/4)ln2 = 0.17329 and converges MONOTONELY UP toward it as L grows. The
 *   double-precision row reproduces the imp-3309 tau_mu = 1.19886, tau_nu =
 *   1.36980, gap = 0.17094 exactly, anchoring the ladder to the native case.
 *
 *   WHY THE GAP IS ASYMPTOTICALLY PRECISION-INVARIANT
 *   -------------------------------------------------
 *   To leading order the log corrections are negligible against L, so X_nu ~ L/pi
 *   and X_mu ~ L/(2 pi), giving X_nu / X_mu ~ 2 and gap = (1/4) ln(X_nu / X_mu) ~
 *   (1/4) ln 2 independent of L. The residual gap - (1/4)ln2 comes ONLY from the
 *   slowly-varying log corrections ln(2 pi^2 X) vs ln(4 pi^4 X^2); their relative
 *   weight is O(ln L / L), so the deviation shrinks as L grows -- exactly the
 *   monotone approach to (1/4)ln2 seen in the ladder. The gap is therefore a
 *   precision-INVARIANT ratio in the L -&gt; inf limit with an O(ln L / L)
 *   precision-dependent correction, while the horizons themselves grow like
 *   (1/4) ln(L). This is the direct confirmation of the imp-3309 bookkeeping
 *   claim: the band width scales WITH the tail-exponent ratio, not with the
 *   subnormal threshold.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   DIAGNOSTIC. This varies an ARTIFICIAL subnormal threshold in the same closed
 *   forms imp-3309 derived; it re-derives no deficit magnitude, proves no
 *   positivity, and touches no operator step. It confirms the band geometry is
 *   arithmetic bookkeeping (a machine constant), not mathematics. A nonzero
 *   overflow fraction is necessary-but-NOT-sufficient at operator order; the
 *   off-diagonal endpoint-Hankel operator step (imp-3066) remains the lone
 *   obstruction. No RH verdict. No false QED. No refereed bound is changed.
 *
 *   @see imp-3309-two-tail-underflow-horizons.js (the two closed-form horizons + (1/4)ln2 band)
 *   @see imp-3216-overflow-support-length-closed-form.js (finding E2 + the decisive check)
 *   @see imp-3312-underflow-horizon-lock.js (the lock guarding the imp-3216 finding)
 *
 *   Ticket: imp-3389 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// (1/4)ln2 -- the leading-order precision-invariant band-width prediction.
const QUARTER_LN2 = 0.25 * Math.log(2);

/**
 * Closed-form nu (single-Phi) underflow horizon at a given subnormal threshold L:
 * the leading term 2 pi^2 X exp(-pi X) (X = e^{4u}) underflows when
 * pi X - ln(2 pi^2 X) = L; solve by fixed point. Identical balance to imp-3309,
 * parameterized by L so a ladder of precisions can be swept.
 */
function nuHorizon(L) {
  let X = 200;
  for (let i = 0; i < 400; i++) {
    X = (L + Math.log(2 * Math.PI * Math.PI * X)) / Math.PI;
  }
  return { X, tau: 0.25 * Math.log(X) };
}

/**
 * Closed-form mu (Phi^2) underflow horizon at a given subnormal threshold L:
 * the leading term 4 pi^4 X^2 exp(-2 pi X) (X = e^{4u}) underflows when
 * 2 pi X - ln(4 pi^4 X^2) = L; solve by fixed point. Identical balance to
 * imp-3309, parameterized by L.
 */
function muHorizon(L) {
  const c = 4 * Math.pow(Math.PI, 4);
  let X = 100;
  for (let i = 0; i < 400; i++) {
    X = (L + Math.log(c * X * X)) / (2 * Math.PI);
  }
  return { X, tau: 0.25 * Math.log(X) };
}

// -- The precision ladder: L = (subnormal bits) * ln 2 -------------------------
const LADDER_SPEC = [
  { precision: 'single 2^-149', bits: 149 },
  { precision: '2^-256', bits: 256 },
  { precision: '2^-512', bits: 512 },
  { precision: 'double 2^-1074', bits: 1074 },
  { precision: 'x87-ext 2^-16445', bits: 16445 },
];

const ladder = LADDER_SPEC.map((row) => {
  const L = row.bits * Math.log(2);
  const nu = nuHorizon(L);
  const mu = muHorizon(L);
  const gap = nu.tau - mu.tau;
  return {
    precision: row.precision,
    bits: row.bits,
    L,
    tauMu: mu.tau,
    tauNu: nu.tau,
    gap,
    gapMinusQuarterLn2: gap - QUARTER_LN2,
  };
});

// Native double is the imp-3309 anchor row (bits = 1074).
const doubleRow = ladder.find((r) => r.bits === 1074);
const singleRow = ladder.find((r) => r.bits === 149);
const extRow = ladder.find((r) => r.bits === 16445);

// -- Precision-DEPENDENCE of the absolute horizons -----------------------------
// The horizons slide substantially across the ladder (they grow like (1/4)ln(L)).
const tauMuSpan = extRow.tauMu - singleRow.tauMu; // ~1.149
const tauNuSpan = extRow.tauNu - singleRow.tauNu; // ~1.161

// -- Precision-INVARIANCE of the gap -------------------------------------------
// The gap stays inside a narrow band below (1/4)ln2 across the whole ladder.
const gaps = ladder.map((r) => r.gap);
const gapMin = Math.min(...gaps);
const gapMax = Math.max(...gaps);
const gapSpan = gapMax - gapMin; // ~0.0115, tiny vs the ~1.15 horizon span
const maxAbsGapDeviation = Math.max(...ladder.map((r) => Math.abs(r.gapMinusQuarterLn2)));

// The absolute horizons move MUCH more than the gap does: the band is a ratio.
const gapIsInvariantRelativeToHorizons = gapSpan < 0.1 * Math.min(tauMuSpan, tauNuSpan);

// The residual gap - (1/4)ln2 shrinks MONOTONELY toward 0 (from below) as L grows.
let gapConvergesMonotonely = true;
for (let i = 1; i < ladder.length; i++) {
  if (!(ladder[i].gap > ladder[i - 1].gap)) gapConvergesMonotonely = false;
  if (!(ladder[i].gapMinusQuarterLn2 < 0)) gapConvergesMonotonely = false;
}

// The double-precision row must reproduce the imp-3309 native horizons exactly.
const reproducesImp3309Double =
  Math.abs(doubleRow.tauMu - 1.19886) < 1e-4 &&
  Math.abs(doubleRow.tauNu - 1.36980) < 1e-4 &&
  Math.abs(doubleRow.gap - 0.17094) < 1e-4;

const verdict =
  gapIsInvariantRelativeToHorizons &&
  gapConvergesMonotonely &&
  maxAbsGapDeviation < 0.02 &&
  reproducesImp3309Double
    ? 'HORIZON-GAP-PRECISION-INVARIANT; ABSOLUTE-HORIZONS-SLIDE-WITH-L, GAP-PINNED-NEAR-(1/4)ln2, DEVIATION-O(lnL/L)->0; ARITHMETIC-BOOKKEEPING-CONFIRMED'
    : 'INDETERMINATE';

export const IMP3389_HORIZON_GAP_PRECISION_INVARIANCE = Object.freeze({
  id: 'imp-3389-horizon-gap-precision-invariance',
  ticket: 'imp-3389',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedTwoTailHorizons: 'imp-3309-two-tail-underflow-horizons.js',
  relatedSupportLength: 'imp-3216-overflow-support-length-closed-form.js',
  relatedHorizonLock: 'imp-3312-underflow-horizon-lock.js',

  summary:
    'MEASURES the precision-invariance of the imp-3309 (1/4)ln2 horizon-gap ratio by re-solving both closed-form ' +
    'underflow-horizon balances at a ladder of artificial subnormal thresholds L = ln(1/MIN) = (bits)*ln2 emulating ' +
    'single (2^-149, L~103), 2^-256, 2^-512, double (2^-1074, L~744) and x87-extended (2^-16445, L~11399) precision. ' +
    'The absolute horizons SLIDE strongly with L (tau_mu 0.72689 -> 1.87631, tau_nu 0.88852 -> 2.04938, each span ' +
    '~1.15, growing like (1/4)ln(L)), yet the gap tau_nu - tau_mu stays pinned inside a ~0.0115-wide band below ' +
    '(1/4)ln2 = 0.17329 and converges MONOTONELY UP toward it (single 0.16163 dev -1.17e-2, double 0.17094 dev ' +
    '-2.35e-3, extended 0.17307 dev -2.14e-4), the residual being the O(lnL/L) log-correction weight. The ' +
    'double-precision row reproduces the imp-3309 native tau_mu/tau_nu/gap exactly. So the band width is a ' +
    'precision-INVARIANT ratio (set by the 2-vs-1 tail-exponent ratio) while the horizons are precision-DEPENDENT -- ' +
    'the direct confirmation that the overflow-region UPPER geometry is arithmetic bookkeeping, not Phi structure. ' +
    'DIAGNOSTIC; confirms the imp-3309 bookkeeping claim; NO RH verdict.',

  construction: Object.freeze({
    subnormalThreshold: 'L = ln(1 / MIN) = (subnormal exponent bits) * ln 2; the ONLY arithmetic-environment input',
    nuHorizonEquation: 'pi X - ln(2 pi^2 X) = L  ->  X_nu,  tau_nu = (1/4) ln(X_nu)  (single-Phi tail)',
    muHorizonEquation: '2 pi X - ln(4 pi^4 X^2) = L  ->  X_mu,  tau_mu = (1/4) ln(X_mu)  (Phi^2 tail)',
    ladder: 'single 2^-149 (L~103.28), 2^-256 (L~177.45), 2^-512 (L~354.89), double 2^-1074 (L~744.44), x87-ext 2^-16445 (L~11398.81)',
    solver: 'fixed-point iteration on X, 400 sweeps per row (same balance as imp-3309, parameterized by L)',
    leadingOrder: 'X_nu ~ L/pi, X_mu ~ L/(2 pi), so X_nu/X_mu ~ 2 and gap = (1/4)ln(X_nu/X_mu) ~ (1/4)ln2 for all L',
    residualLaw: 'gap - (1/4)ln2 driven by the log corrections ln(2 pi^2 X) vs ln(4 pi^4 X^2), relative weight O(ln L / L) -> 0',
    selfComputing: true,
  }),

  measured: Object.freeze({
    quarterLn2: QUARTER_LN2,
    ladder,
    tauMuSpanAcrossLadder: tauMuSpan,
    tauNuSpanAcrossLadder: tauNuSpan,
    gapMin,
    gapMax,
    gapSpanAcrossLadder: gapSpan,
    maxAbsGapDeviation,
    gapIsInvariantRelativeToHorizons,
    gapConvergesMonotonely,
    reproducesImp3309Double,
    verdict,
  }),

  interpretation: Object.freeze({
    horizonsArePrecisionDependent:
      'Both absolute horizons grow like (1/4)ln(L): across the single-to-extended ladder tau_mu slides ~1.149 ' +
      '(0.72689 -> 1.87631) and tau_nu slides ~1.161 (0.88852 -> 2.04938). The overflow-region UPPER endpoint is ' +
      'thus NOT a fixed length -- it is a machine constant that moves with the arithmetic precision.',
    gapIsPrecisionInvariant:
      'The gap tau_nu - tau_mu stays inside a ~0.0115-wide band below (1/4)ln2 = 0.17329 across the entire ladder ' +
      '(single 0.16163, double 0.17094, extended 0.17307), moving ~100x LESS than the horizons themselves. The band ' +
      'width is therefore a precision-INVARIANT ratio, exactly as the (1/4)ln2 fingerprint of the 2-vs-1 tail ratio predicts.',
    residualIsLogCorrection:
      'The residual gap - (1/4)ln2 is negative and shrinks MONOTONELY toward 0 as L grows (dev -1.17e-2 single -> ' +
      '-2.35e-3 double -> -2.14e-4 extended), the O(ln L / L) weight of the slowly-varying log corrections. In the ' +
      'L -> inf limit the gap converges to exactly (1/4)ln2, confirming the ratio is arithmetic bookkeeping, not mathematics.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    confirmsImp3309BookkeepingClaim:
      'This is the direct test imp-3309 never ran: varying the subnormal threshold confirms BOTH horizons slide with ' +
      'precision while their gap stays pinned near (1/4)ln2, so the band width scales WITH the tail-exponent ratio, ' +
      'not with the subnormal threshold -- the overflow-region upper geometry is arithmetic bookkeeping.',
    addressesUnderflowGeometryOnly:
      'This varies an artificial subnormal threshold in the imp-3309 closed forms only; the absolute deg-2 deficit ' +
      'magnitude and any positivity are NOT addressed here.',
    necessaryNotSufficient:
      'A nonzero overflow fraction is necessary-but-NOT-sufficient at operator order; the off-diagonal ' +
      'endpoint-Hankel operator step (imp-3066) remains the lone obstruction. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3389_HORIZON_GAP_PRECISION_INVARIANCE_ASSERTIONS = [
  {
    id: 'imp3389-double-row-reproduces-imp3309',
    why: 'The native double-precision row (L = 1074 ln2 ~ 744.44) must reproduce the imp-3309 closed-form horizons ' +
         'tau_mu = 1.19886, tau_nu = 1.36980 and gap = 0.17094 exactly, anchoring the ladder to the native case.',
    holds: () => reproducesImp3309Double,
  },
  {
    id: 'imp3389-absolute-horizons-slide-with-precision',
    why: 'Both absolute horizons must move substantially across the ladder (grow like (1/4)ln(L)): the tau_mu and ' +
         'tau_nu spans from single (L~103) to extended (L~11399) must each exceed ~1.0 lag units.',
    holds: () => tauMuSpan > 1.0 && tauNuSpan > 1.0,
  },
  {
    id: 'imp3389-gap-pinned-near-quarter-ln2',
    why: 'The band width tau_nu - tau_mu must stay within 0.02 of (1/4)ln2 = 0.17329 at EVERY precision on the ' +
         'ladder, confirming the gap is a precision-invariant ratio set by the 2-vs-1 tail-exponent ratio.',
    holds: () => maxAbsGapDeviation < 0.02 && gapMin > 0.15 && gapMax < QUARTER_LN2 + 1e-6,
  },
  {
    id: 'imp3389-gap-moves-far-less-than-horizons',
    why: 'THE DECISIVE CHECK: the gap span across the ladder (~0.0115) must be less than 10% of the horizon span ' +
         '(~1.15), i.e. the gap is invariant while the horizons are precision-dependent -- the band is a ratio.',
    holds: () => gapIsInvariantRelativeToHorizons && gapSpan < 0.05,
  },
  {
    id: 'imp3389-residual-converges-monotonely-from-below',
    why: 'The residual gap - (1/4)ln2 must be negative at every row and shrink MONOTONELY toward 0 as L grows ' +
         '(the O(ln L / L) log-correction weight), so the gap -> (1/4)ln2 exactly in the infinite-precision limit.',
    holds: () => gapConvergesMonotonely && extRow.gapMinusQuarterLn2 > singleRow.gapMinusQuarterLn2,
  },
  {
    id: 'imp3389-verdict-is-precision-invariant',
    why: 'The classified verdict must be the precision-invariant band reconciliation (horizons slide, gap pinned, ' +
         'arithmetic bookkeeping confirmed), not indeterminate; a flip means the ladder, gap, or ordering broke.',
    holds: () =>
      verdict ===
      'HORIZON-GAP-PRECISION-INVARIANT; ABSOLUTE-HORIZONS-SLIDE-WITH-L, GAP-PINNED-NEAR-(1/4)ln2, DEVIATION-O(lnL/L)->0; ARITHMETIC-BOOKKEEPING-CONFIRMED',
  },
  {
    id: 'imp3389-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: DIAGNOSTIC that CONFIRMS the imp-3309 arithmetic-bookkeeping claim, underflow-horizon ' +
         'geometry only, necessary-but-not-sufficient at operator order, positivity not attempted, no refereed bound is changed.',
    holds: () => {
      const c = IMP3389_HORIZON_GAP_PRECISION_INVARIANCE.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3389_HORIZON_GAP_PRECISION_INVARIANCE_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3389-horizon-gap-precision-invariance assertion failed: ${assertion.id}`);
  }
}

export default IMP3389_HORIZON_GAP_PRECISION_INVARIANCE;
