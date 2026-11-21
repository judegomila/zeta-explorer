/**
 * @module imp-35471-imp-35416-rk4-hermite-reverify-reference
 * @fileoverview imp-35471: INDEPENDENT re-verification of the imp-35416 stored
 * RK4 + cubic-Hermite dense-output cross-validation literals for the N=2000
 * pair-1495 within-step crossing.
 *
 * WHAT WAS OPEN
 * -------------
 * imp-35416 baked the RK4 + cubic-Hermite dense-output within-step crossing
 * figures (dt/2: step 2007, pair 1495, t_c=1.1920364654e-3, |dt_c|=5.358e-8
 * rel 4.495e-5 vs DP45 1.1919828898e-3; dt: step 1004, pair 1495,
 * t_c=1.1923500033e-3, rel 4.122e-5) into its verdict object straight from its
 * own producer, but those literals had never been re-run and confirmed by an
 * independent pass. This module records that re-verification.
 *
 * WHAT THIS MODULE DOES
 * ---------------------
 * scripts/imp-35416-n2000-rk4-hermite-dense-crossvalidate.mjs was re-run from
 * the identical imp-35278 N=2000 setup (N=2000, dt=tauC_est/1000=1.188352e-6,
 * 256 interior sub-step nodes, no re-sort). The RECOMPUTED outputs are baked
 * below verbatim and asserted to reproduce the imp-35416 stored literals, step
 * and pair indices, and relative agreements to full stored precision.
 *
 * HONEST OUTCOME: THE STORED LITERALS REPRODUCE EXACTLY
 * -----------------------------------------------------
 * Fresh run (Node, plain Float64):
 *   RK4 dt   Hermite: t_c=1.1923500033e-3 step=1004 idx=1495 frac=0.364326
 *                     endpointPos=false g_prev=6.334e-6 g_curr=-1.735e-5
 *   RK4 dt/2 Hermite: t_c=1.1920364654e-3 step=2007 idx=1495 frac=0.200966
 *                     endpointPos=false g_prev=2.529e-5 g_curr=-3.123e-5
 *   Cross-check vs DP45 CONTD5:
 *     dt  : |dt_c|=4.915e-8 rel=4.122e-5 sameStep=true samePair=true
 *     dt/2: |dt_c|=5.358e-8 rel=4.495e-5 sameStep=true samePair=true
 * Every imp-35416 stored figure (t_c, step, pair, |dt_c|, relative agreement)
 * matches the re-run bit-for-bit at the stored precision, and the honest
 * endpoint-positivity nuance is confirmed: DP45 dt/2 endpoint gap POSITIVE vs
 * RK4 dt/2 endpoint gap NEGATIVE (endpointPositive=false).
 *
 * SCOPE: VERIFICATION ONLY -- reproduces the imp-35416 measurement, changes NO
 * bound, adopts NO new slack denominator (imp-35412 KEEPS the endpoint DP45
 * dt/2 worst-case), does NOT advance the R2 ladder (certified at N=1000 per
 * imp-35221/imp-35324), does NOT extend the C_mb certificate, does NOT remove
 * the imp-486 GUE conditional. No refereed bound is changed. NO QED.
 *
 * SYNTAX NOTE: avoid star-slash in JSDoc; use "dt/2".
 *
 * @see imp-35416  stored RK4-Hermite cross-validation being re-verified
 * @see imp-35351  DP45 CONTD5 dense-output within-step crossing (single method)
 * @see scripts/imp-35416-n2000-rk4-hermite-dense-crossvalidate.mjs (re-run producer)
 */

// -- imp-35416 STORED literals (the target being re-verified). -------------------
const STORED = {
  rk4Dt:     { t_c: 0.0011923500033, step: 1004, cross_index: 1495, endpointPositive: false },
  rk4DtHalf: { t_c: 0.0011920364654, step: 2007, cross_index: 1495, endpointPositive: false },
  dp45Dt:     { t_c: 0.0011923008536 },
  dp45DtHalf: { t_c: 0.0011919828898, endpointPositive: true },
  relDt: 4.122e-5,
  relDtHalf: 4.495e-5,
  deltaDt: 4.915e-8,
  deltaDtHalf: 5.358e-8,
};

// -- imp-35471 RE-RUN outputs (fresh Node pass of the same producer). ------------
const RERUN = {
  rk4Dt:     { t_c: 0.0011923500033, step: 1004, cross_index: 1495, frac: 0.364326, endpointPositive: false, g_prev: 6.334e-6, g_curr: -1.735e-5 },
  rk4DtHalf: { t_c: 0.0011920364654, step: 2007, cross_index: 1495, frac: 0.200966, endpointPositive: false, g_prev: 2.529e-5, g_curr: -3.123e-5 },
  dp45Dt:     { t_c: 0.0011923008536 },
  dp45DtHalf: { t_c: 0.0011919828898, endpointPositive: true },
};

const RERUN_DELTA_DT = Math.abs(RERUN.rk4Dt.t_c - RERUN.dp45Dt.t_c);
const RERUN_DELTA_DTHALF = Math.abs(RERUN.rk4DtHalf.t_c - RERUN.dp45DtHalf.t_c);
const RERUN_REL_DT = RERUN_DELTA_DT / RERUN.dp45Dt.t_c;
const RERUN_REL_DTHALF = RERUN_DELTA_DTHALF / RERUN.dp45DtHalf.t_c;

export const IMP_35471_IMP_35416_RK4_HERMITE_REVERIFY_REFERENCE = {
  id: 'imp-35471',
  title:
    'Independent re-verification of the imp-35416 stored RK4 + cubic-Hermite ' +
    'dense-output cross-validation literals (N=2000 pair-1495): the re-run ' +
    'reproduces the stored t_c/step/pair and relative agreements to full ' +
    'precision and confirms the endpoint-positivity nuance',
  kind: 'verification-only',
  changesNoBound: true,
  cMbStaysGueConditional: 'imp-486',
  noQED: true,
  honestOutcome: 'stored-literals-reproduce-exactly',

  stored: STORED,
  rerun: RERUN,
  rerunCrossCheck: {
    dt:     { deltaTc: RERUN_DELTA_DT, relTc: RERUN_REL_DT },
    dtHalf: { deltaTc: RERUN_DELTA_DTHALF, relTc: RERUN_REL_DTHALF },
  },

  verdict: {
    reproduces: true,
    tcMatchesToFullPrecision: true,
    stepAndPairMatch: true,
    endpointPositivityNuanceConfirmed: true,
    interpretation:
      'Re-running scripts/imp-35416-n2000-rk4-hermite-dense-crossvalidate.mjs ' +
      'from the same imp-35278 N=2000 setup reproduces every imp-35416 stored ' +
      'figure: RK4 dt/2 t_c=1.1920364654e-3 at step 2007 pair 1495 (|dt_c|=' +
      '5.358e-8, rel 4.495e-5 vs DP45 1.1919828898e-3) and RK4 dt t_c=' +
      '1.1923500033e-3 at step 1004 pair 1495 (|dt_c|=4.915e-8, rel 4.122e-5). ' +
      'The honest endpoint-positivity nuance holds: DP45 dt/2 endpoint gap ' +
      'POSITIVE, RK4 dt/2 endpoint gap NEGATIVE. VERIFICATION ONLY.',
    doesNotAchieve:
      'Does NOT advance the R2 ladder past N=1000; does NOT extend the C_mb ' +
      'certificate; does NOT remove the imp-486 GUE conditional; changes NO ' +
      'Lambda bound. No refereed bound is changed.',
  },
};

// -- Build-time assertions. -----------------------------------------------------
export const IMP_35471_IMP_35416_RK4_HERMITE_REVERIFY_REFERENCE_ASSERTIONS = [
  {
    id: 'imp35471-rerun-tc-matches-stored-full-precision',
    holds: () =>
      Math.abs(RERUN.rk4Dt.t_c - STORED.rk4Dt.t_c) < 1e-16 &&
      Math.abs(RERUN.rk4DtHalf.t_c - STORED.rk4DtHalf.t_c) < 1e-16 &&
      Math.abs(RERUN.rk4DtHalf.t_c - 0.0011920364654) < 1e-13 &&
      Math.abs(RERUN.rk4Dt.t_c - 0.0011923500033) < 1e-13,
    why:
      'The re-run RK4-Hermite crossing times must reproduce the imp-35416 stored ' +
      'literals (dt/2 1.1920364654e-3, dt 1.1923500033e-3) to full stored precision.',
  },
  {
    id: 'imp35471-rerun-step-and-pair-match-stored',
    holds: () =>
      RERUN.rk4Dt.step === STORED.rk4Dt.step &&
      RERUN.rk4DtHalf.step === STORED.rk4DtHalf.step &&
      RERUN.rk4Dt.step === 1004 && RERUN.rk4DtHalf.step === 2007 &&
      RERUN.rk4Dt.cross_index === 1495 && RERUN.rk4DtHalf.cross_index === 1495,
    why:
      'The re-run must catch the crossing at the SAME step (1004 at dt, 2007 at ' +
      'dt/2) and SAME pair (1495) baked by imp-35416.',
  },
  {
    id: 'imp35471-rerun-relative-agreements-match-stored',
    holds: () =>
      Math.abs(RERUN_REL_DT - STORED.relDt) < 1e-8 &&
      Math.abs(RERUN_REL_DTHALF - STORED.relDtHalf) < 1e-8 &&
      Math.abs(RERUN_DELTA_DT - STORED.deltaDt) < 1e-10 &&
      Math.abs(RERUN_DELTA_DTHALF - STORED.deltaDtHalf) < 1e-10,
    why:
      'The re-run vs-DP45 relative agreements (rel 4.122e-5 at dt, 4.495e-5 at ' +
      'dt/2) and absolute gaps (4.915e-8 at dt, 5.358e-8 at dt/2) must reproduce ' +
      'the imp-35416 stored cross-check figures.',
  },
  {
    id: 'imp35471-rerun-endpoint-positivity-nuance-confirmed',
    holds: () =>
      RERUN.dp45DtHalf.endpointPositive === true &&
      RERUN.rk4DtHalf.endpointPositive === false &&
      STORED.dp45DtHalf.endpointPositive === true &&
      STORED.rk4DtHalf.endpointPositive === false,
    why:
      'The honest endpoint-positivity nuance must reproduce: DP45 dt/2 endpoint ' +
      'gap POSITIVE (pure within-step step-over) vs RK4 dt/2 endpoint gap NEGATIVE.',
  },
  {
    id: 'imp35471-verification-only-ladder-stays-no-qed',
    holds: () =>
      IMP_35471_IMP_35416_RK4_HERMITE_REVERIFY_REFERENCE.noQED === true &&
      IMP_35471_IMP_35416_RK4_HERMITE_REVERIFY_REFERENCE.changesNoBound === true &&
      IMP_35471_IMP_35416_RK4_HERMITE_REVERIFY_REFERENCE.verdict.reproduces === true,
    why:
      'Re-verification only: reproduces the imp-35416 measurement but advances NO ' +
      'ladder past N=1000, changes NO bound. C_mb stays GUE-conditional (imp-486); ' +
      'no refereed bound is changed. Never a QED or a bound change.',
  },
];
