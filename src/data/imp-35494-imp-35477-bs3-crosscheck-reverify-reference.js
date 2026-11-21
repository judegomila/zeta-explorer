/**
 * @module imp-35494-imp-35477-bs3-crosscheck-reverify-reference
 * @fileoverview imp-35494: INDEPENDENT recomputation of the four imp-35477 BS3
 * dense-output cross-check relative figures (the N=2000 pair-1495 within-step
 * crossing) directly from the three families' baked t_c literals, catching any
 * transcription drift in the imp-35477 reported relatives.
 *
 * WHAT WAS OPEN
 * -------------
 * imp-35477 corroborated the imp-35351 within-step crossing with a THIRD dense
 * family (Bogacki-Shampine BS3, order 3) and baked the DP45/RK4/BS3 t_c literals
 * PLUS four derived cross-check figures (dt: vs RK4 rel 2.574e-5, vs DP45 rel
 * 6.696e-5; dt/2: vs DP45 rel 9.996e-5, vs RK4 rel 5.501e-5). No independent
 * module recomputed those four relatives from the baked t_c values alone, so a
 * transcription slip in the reported relatives would go uncaught.
 *
 * WHAT THIS MODULE DOES
 * ---------------------
 * Re-derives the four |dt_c| absolute deltas and the four relative differences
 * PURELY from the three families' baked t_c literals (no producer re-run, no
 * heavy import) and confirms each reproduces the imp-35477 reported relative to
 * the reported 4-sig-fig precision. This is a literal-consistency check on the
 * DERIVED cross-check quantities, complementary to imp-35471 (which re-ran the
 * RK4-Hermite producer) and imp-35477 itself (which baked the BS3 producer run).
 *
 * BAKED t_c LITERALS (three families, N=2000 pair-1495, verbatim from imp-35477)
 *   DP45 CONTD5 (order 5): dt 1.1923008536e-3 / dt2 1.1919828898e-3
 *   RK4 + cubic Hermite (order 4): dt 1.1923500033e-3 / dt2 1.1920364654e-3
 *   BS3 + cubic Hermite (order 3): dt 1.1923806919e-3 / dt2 1.1921020374e-3
 *
 * HONEST OUTCOME: ALL FOUR RELATIVES REPRODUCE (NO TRANSCRIPTION DRIFT)
 * --------------------------------------------------------------------
 * Recomputed from the baked t_c literals:
 *   dt   BS3 vs RK4 : |dt_c|=3.068860e-8  rel=2.5738e-5  (imp-35477 reported 2.574e-5)
 *   dt   BS3 vs DP45: |dt_c|=7.983830e-8  rel=6.6962e-5  (imp-35477 reported 6.696e-5)
 *   dt/2 BS3 vs DP45: |dt_c|=1.191476e-7  rel=9.9957e-5  (imp-35477 reported 9.996e-5)
 *   dt/2 BS3 vs RK4 : |dt_c|=6.557200e-8  rel=5.5008e-5  (imp-35477 reported 5.501e-5)
 * Each recomputed relative rounds to the imp-35477 reported 4-sig-fig figure and
 * the ordering BS3 > RK4 > DP45 (t_c climbs as integrator order drops) holds at
 * both grids, so the imp-35477 cross-check table is internally consistent with
 * its own baked t_c literals -- no transcription drift.
 *
 * SCOPE: VERIFICATION / MEASUREMENT ONLY. Corroborates no bound, adopts no new
 * slack denominator (imp-35412 KEEPS the endpoint DP45 dt/2 worst-case), does
 * NOT advance the R2 ladder (certified at N=1000 per imp-35221/imp-35324), does
 * NOT extend the C_mb certificate, does NOT remove the imp-486 GUE conditional.
 * No refereed bound is changed. NO QED.
 *
 * SYNTAX NOTE: avoid star-slash in JSDoc; use "dt/2".
 *
 * @see imp-35477  BS3 third-family dense-output crossvalidation (baked source)
 * @see imp-35471  independent re-verification of the imp-35416 RK4-Hermite literals
 * @see imp-35416  RK4 + cubic-Hermite cross-validation (family 2, order 4)
 * @see imp-35351  DP45 CONTD5 dense-output within-step crossing (family 1, order 5)
 */

// -- Baked t_c literals (verbatim from imp-35477), three integrator families. ----
const TC = {
  dp45: { dt: 0.0011923008536, dtHalf: 0.0011919828898 },
  rk4:  { dt: 0.0011923500033, dtHalf: 0.0011920364654 },
  bs3:  { dt: 0.0011923806919, dtHalf: 0.0011921020374 },
};

// -- Independent recomputation of the four cross-check deltas + relatives. -------
// Relative denominator matches imp-35477: the OTHER family's t_c at that grid.
const CC = {
  dtVsRk4:      { delta: Math.abs(TC.bs3.dt - TC.rk4.dt),           rel: Math.abs(TC.bs3.dt - TC.rk4.dt) / TC.rk4.dt },
  dtVsDp45:     { delta: Math.abs(TC.bs3.dt - TC.dp45.dt),          rel: Math.abs(TC.bs3.dt - TC.dp45.dt) / TC.dp45.dt },
  dtHalfVsDp45: { delta: Math.abs(TC.bs3.dtHalf - TC.dp45.dtHalf),  rel: Math.abs(TC.bs3.dtHalf - TC.dp45.dtHalf) / TC.dp45.dtHalf },
  dtHalfVsRk4:  { delta: Math.abs(TC.bs3.dtHalf - TC.rk4.dtHalf),   rel: Math.abs(TC.bs3.dtHalf - TC.rk4.dtHalf) / TC.rk4.dtHalf },
};

// imp-35477 reported 4-sig-fig relatives.
const REPORTED = {
  dtVsRk4: 2.574e-5,
  dtVsDp45: 6.696e-5,
  dtHalfVsDp45: 9.996e-5,
  dtHalfVsRk4: 5.501e-5,
};

// Round a value to 4 significant figures for the reported-precision comparison.
function round4sig(x) {
  if (x === 0) return 0;
  const d = Math.ceil(Math.log10(Math.abs(x)));
  const p = 4 - d;
  const f = Math.pow(10, p);
  return Math.round(x * f) / f;
}

export const IMP_35494_IMP_35477_BS3_CROSSCHECK_REVERIFY_REFERENCE = {
  id: 'imp-35494',
  title:
    'Independent recomputation of the four imp-35477 BS3 dense-output cross-check ' +
    'relatives from the three families\' baked t_c literals (dt vs RK4 2.574e-5 / ' +
    'vs DP45 6.696e-5; dt/2 vs DP45 9.996e-5 / vs RK4 5.501e-5) -- all reproduce, ' +
    'no transcription drift',
  kind: 'verification-literal-consistency-only',
  changesNoBound: true,
  cMbStaysGueConditional: 'imp-486',
  noQED: true,
  honestOutcome: 'all-four-relatives-reproduce-no-transcription-drift',

  bakedTc: TC,
  recomputed: {
    dt:     { deltaTcVsRk4: CC.dtVsRk4.delta, relTcVsRk4: CC.dtVsRk4.rel, deltaTcVsDp45: CC.dtVsDp45.delta, relTcVsDp45: CC.dtVsDp45.rel },
    dtHalf: { deltaTcVsDp45: CC.dtHalfVsDp45.delta, relTcVsDp45: CC.dtHalfVsDp45.rel, deltaTcVsRk4: CC.dtHalfVsRk4.delta, relTcVsRk4: CC.dtHalfVsRk4.rel },
  },
  reported: REPORTED,

  verdict: {
    allFourRelativesReproduce: true,
    orderingBs3AboveRk4AboveDp45: true,
    interpretation:
      'The four imp-35477 cross-check relatives recompute from the three ' +
      'families\' baked t_c literals as dt BS3-vs-RK4 2.5738e-5, dt BS3-vs-DP45 ' +
      '6.6962e-5, dt/2 BS3-vs-DP45 9.9957e-5, dt/2 BS3-vs-RK4 5.5008e-5. Each ' +
      'rounds to the imp-35477 reported 4-sig-fig figure (2.574e-5, 6.696e-5, ' +
      '9.996e-5, 5.501e-5) and the t_c ordering BS3 > RK4 > DP45 holds at both ' +
      'grids, so the imp-35477 cross-check table is internally consistent with ' +
      'its own baked t_c literals -- no transcription drift. VERIFICATION ONLY.',
    doesNotAchieve:
      'Does NOT re-run any integrator producer (a literal-consistency check on ' +
      'the DERIVED relatives only); does NOT advance the R2 ladder past N=1000; ' +
      'does NOT adopt a new slack denominator (imp-35412 keeps the endpoint DP45 ' +
      'dt/2 worst-case); does NOT extend the C_mb certificate; does NOT remove ' +
      'the imp-486 GUE conditional; changes NO Lambda bound. No refereed bound is changed.',
  },
};

// -- Build-time assertions. -----------------------------------------------------
export const IMP_35494_IMP_35477_BS3_CROSSCHECK_REVERIFY_REFERENCE_ASSERTIONS = [
  {
    id: 'imp35494-four-relatives-reproduce-reported',
    holds: () =>
      round4sig(CC.dtVsRk4.rel) === REPORTED.dtVsRk4 &&
      round4sig(CC.dtVsDp45.rel) === REPORTED.dtVsDp45 &&
      round4sig(CC.dtHalfVsDp45.rel) === REPORTED.dtHalfVsDp45 &&
      round4sig(CC.dtHalfVsRk4.rel) === REPORTED.dtHalfVsRk4,
    why:
      'Each of the four cross-check relatives recomputed from the baked t_c ' +
      'literals must round to the imp-35477 reported 4-sig-fig figure (dt vs RK4 ' +
      '2.574e-5, dt vs DP45 6.696e-5, dt/2 vs DP45 9.996e-5, dt/2 vs RK4 ' +
      '5.501e-5), confirming no transcription drift in the reported table.',
  },
  {
    id: 'imp35494-abs-deltas-reproduce',
    holds: () =>
      Math.abs(CC.dtVsRk4.delta - 3.068860e-8) < 1e-14 &&
      Math.abs(CC.dtVsDp45.delta - 7.983830e-8) < 1e-14 &&
      Math.abs(CC.dtHalfVsDp45.delta - 1.191476e-7) < 1e-13 &&
      Math.abs(CC.dtHalfVsRk4.delta - 6.557200e-8) < 1e-14,
    why:
      'The four absolute |dt_c| deltas recomputed from the baked t_c literals ' +
      'must reproduce the values underlying the imp-35477 relatives (dt vs RK4 ' +
      '3.069e-8, dt vs DP45 7.984e-8, dt/2 vs DP45 1.191e-7, dt/2 vs RK4 ' +
      '6.557e-8), pinning the numerators of the cross-check ratios.',
  },
  {
    id: 'imp35494-tc-ordering-bs3-above-rk4-above-dp45',
    holds: () =>
      TC.bs3.dt > TC.rk4.dt && TC.rk4.dt > TC.dp45.dt &&
      TC.bs3.dtHalf > TC.rk4.dtHalf && TC.rk4.dtHalf > TC.dp45.dtHalf,
    why:
      'At BOTH grids the baked crossing times must satisfy BS3 > RK4 > DP45 ' +
      '(the crossing lands slightly later as integrator order drops 5 -> 4 -> ' +
      '3), consistent with the imp-35477 reading that BS3 sits just above both ' +
      'prior families.',
  },
  {
    id: 'imp35494-verification-only-ladder-stays-no-qed',
    holds: () =>
      IMP_35494_IMP_35477_BS3_CROSSCHECK_REVERIFY_REFERENCE.noQED === true &&
      IMP_35494_IMP_35477_BS3_CROSSCHECK_REVERIFY_REFERENCE.changesNoBound === true &&
      IMP_35494_IMP_35477_BS3_CROSSCHECK_REVERIFY_REFERENCE.verdict.allFourRelativesReproduce === true,
    why:
      'Verification / literal-consistency only: recomputes the imp-35477 derived ' +
      'relatives from the baked t_c literals but advances NO ladder past N=1000 ' +
      'and changes NO bound. C_mb stays GUE-conditional (imp-486); no refereed bound is changed' +
      '. Never a QED.',
  },
];
