/**
 * @fileoverview imp-96991 -- FULL-DOMAIN RE-VERIFICATION (numerical): decide whether the imp-96956
 * kmax=5, 2a=1.00 interval-verification collapse certifies at hc<=1e-3 across the WHOLE [0,40]
 * domain, or whether it stays a coarse-grid artifact confined to the imp-96978 worst band cell.
 * This closes the imp-96978 sub-gap IMP96978_FULLDOMAIN_HC1EM3_RERUN_NOT_RUN (which measured only
 * the worst reported cell m=16.697 in isolation). Import-light: all values below are frozen literals
 * from a direct run of the tmp/toeplitz-krein-verify4.py machinery on the imp-96956 iterate
 * (tmp/imp-96956/iterate-100.json, symbol sigma2, kmax=5, 58 non-zero atoms) over the full [0,40]
 * domain at coarse cell width hc=1e-3 (tmp/imp-96991-fulldomain-hc1em3.py; independently reproduced
 * at tmp/imp-96991-rerun-confirm.json). No bound moves; certified reach stays 2a<=0.96; RH open; NO QED.
 *
 * SETUP. The verifier certifies F(t) = sigma_2(t) + sum_k sum_j c_{k,j} t^k trig_k(x_j t) >= 0 on R
 * (sigma_2 = (t^2+1/4)^2 w_1) by an interval lower bound on each coarse cell of half-width r=hc/2:
 *   F_low(t_f) = sigma_taylor(t_f) + nu(t_f) - slack - r_f |F-prime(t_f)| - (1/2)(C2 + M2) r_f^2,
 * with C2 = sup_cell |sigma_2-prime-prime| = (12t^2+1)|w1| + 8t(t^2+1/4)|w1-prime| + (t^2+1/4)^2 W1PP.
 * imp-96978 showed the imp-96956 hc=2e-3 collapse (226 negative cells at t~16-17, worst -0.2706 at
 * m=16.697) is a COARSE-GRID guard-resolution artifact: at that one cell the rigorous lower bound
 * climbs to the true point value +1.054 once hc<=1e-3. It did NOT run the full-domain re-verification.
 *
 * FINDING 1 -- THE imp-96978 WORST BAND CELL CLEARS, BUT 2a=1.00 DOES NOT CERTIFY. At hc=1e-3 the
 * full [0,40] re-verification runs 40001 coarse cells / 12.19M fine points (~294s). The t~16-17 band
 * that collapsed at hc=2e-3 is now ENTIRELY CLEAR (zero failing cells with 16 <= t < 18), confirming
 * imp-96978. But the certificate STILL FAILS: 91 interior cells have a negative rigorous lower bound.
 * The tail (t>=40) bracket stays comfortably positive (+0.4581, tail_ok). Verdict: NOT VERIFIED at
 * hc=1e-3; halving hc from 2e-3 relocated the collapse rather than removing it.
 *
 * FINDING 2 -- THE COLLAPSE MOVED TO HIGHER t, WHERE q^2 W1PP IS LARGER. The 91 failing cells cluster
 * at t-bands {24, 25, 31, 35, 36, 37, 38} -- all HIGHER than the original 16-17 band. This is the
 * same mechanism imp-96978 isolated (the -0.5 C2 d^2 coarse-cell sigma Taylor penalty with C2
 * dominated by the (t^2+1/4)^2 W1PP curvature term), but (t^2+1/4)^2 grows ~ t^4, so at t~35 the
 * penalty is ~(35/16.7)^4 ~ 19x larger than at the old worst cell. Halving hc only shrinks the r^2
 * penalty ~4x, so it clears t~16-17 but not t~24-38. The deepest observed failing lower bound is
 * about -4.19 (t~35.2), far below the old -0.271.
 *
 * FINDING 3 -- THE TRUE POINTWISE F STAYS POSITIVE (guard-resolution artifact, not a sign change).
 * The verifier point-value diagnostic (sigma and nu on a CONSISTENT abscissa) reports a fine-grid
 * minimum F ~ +1.0000005 across the entire [0,40] domain. So, exactly as at t~16-17, the negative
 * rigorous lower bounds at t~24-38 are the coarse-cell/second-order-Taylor guard penalty, NOT a
 * genuine sign change in F. hc=1e-3 is simply not fine enough at high t to close the guard gap.
 *
 * VERDICT. The imp-96978 sub-gap IMP96978_FULLDOMAIN_HC1EM3_RERUN_NOT_RUN is now CLOSED: the full
 * [0,40] hc<=1e-3 re-verification WAS run and 2a=1.00 does NOT certify at hc=1e-3. The worst imp-96978
 * band cell (16.697) does clear -- it was a coarse-grid artifact -- but the collapse relocates to
 * t~24-38 (91 cells) where the ~t^4 q^2 W1PP curvature penalty overwhelms the ~4x gain from halving
 * hc. The true pointwise F stays positive throughout (min ~ +1.0000005), so these too are
 * guard-resolution artifacts, not obstructions; certification at 2a=1.00 needs a much finer hc at high
 * t or the cell-local |w1-prime-prime| enclosure / third-order sigma_2 Taylor of imp-96992 (which
 * shrinks the dominant C2 curvature term without shrinking hc). Certified interval-rigorous reach
 * stays 2a<=0.96 until such a run passes. NEW SUB-GAP IMP96991_HIGH_T_HC_INSUFFICIENT -- decide the
 * hc (or the cell-local w1-prime-prime enclosure strength) that clears the t~24-38 bands and whether
 * it is tractable in-pool. RH open; no refereed bound is changed; NO QED.
 *
 * @see imp-96978-krein-kmax5-100-guard-resolution.js (diagnosed the worst band cell; left this sub-gap)
 * @see imp-96956-krein-kmax5-100-interval-verify.js (the original 226-negative-cell collapse at hc=2e-3)
 * @see imp-96992-w1pp-celllocal-enclosure.js (the cell-local w1-prime-prime enclosure lever this run motivates)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (interval-rigorous reach 2a <= 0.96)
 */

// W1PP: rigorous constant bound of |w1-prime-prime| used by the verifier (verify4.py line 21).
export const IMP96991_W1PP = 32.802903963831554;

// Run configuration and top-line result of the full-domain hc=1e-3 re-verification.
export const IMP96991_RUN = Object.freeze({
  iterate: 'tmp/imp-96956/iterate-100.json',
  symbol: 'sigma2',
  twoA: 1.0,
  kmax: 5,
  nAtoms: 58,
  domain: [0, 40],
  hc: 1.0e-3,
  ncells: 40001,
  nfinePoints: 12194452,
  wallSeconds: 294.4,
  tailBracket: 0.4581, // tail t>=40 lower-bound bracket (positive => tail_ok)
  tailOk: true,
  nFailingCells: 91,
  verified: false, // NOT VERIFIED at hc=1e-3
});

// Failing-cell t-bands (integer floor of the cell left endpoint). All HIGHER than the original 16-17
// band, which is now entirely clear.
export const IMP96991_FAIL_TBANDS = Object.freeze([24, 25, 31, 35, 36, 37, 38]);

// The imp-96978 worst band (16 <= t < 18) had zero failing cells at hc=1e-3 -- it cleared.
export const IMP96991_OLD_BAND_CLEARED = true;

// Deepest observed failing rigorous lower bound (among sampled failing cells) and its location.
export const IMP96991_DEEPEST_FAIL = Object.freeze({ flow: -4.189, t: 35.205 });

// True pointwise F minimum across [0,40] (verifier point-value diagnostic on a consistent abscissa):
// stays positive everywhere => the negative lower bounds are guard-resolution artifacts, not sign changes.
export const IMP96991_TRUE_POINT_F_MIN = Object.freeze({ F: 1.0000005302020685, t: 0.3395 });

export const IMP96991_VERDICT = Object.freeze({
  ticket: 'imp-96991',
  question: 'does the imp-96956 kmax=5, 2a=1.00 iterate certify over the full [0,40] domain at hc<=1e-3, or is the collapse a coarse-grid artifact only at the imp-96978 worst band cell m=16.697?',
  twoA: 1.0,
  hc: 1.0e-3,
  // Finding 1: worst band cell clears, but the certificate as a whole fails
  worstBandCellCleared: true,
  certifiesAtHc1em3: false,
  nFailingCells: 91,
  tailOk: true,
  // Finding 2: collapse relocated to higher t where q^2 W1PP (~t^4 curvature) is larger
  failTBands: IMP96991_FAIL_TBANDS,
  collapseRelocatedToHigherT: true,
  deepestFailFlow: IMP96991_DEEPEST_FAIL.flow,
  // Finding 3: true pointwise F stays positive => guard-resolution artifact, not a sign change
  truePointFStaysPositive: true,
  truePointFMin: IMP96991_TRUE_POINT_F_MIN.F,
  collapseIsGuardResolutionArtifact: true,
  collapseIsGenuineObstruction: false,
  // Sub-gap resolution and guardrails
  resolvesSubGap: 'IMP96978_FULLDOMAIN_HC1EM3_RERUN_NOT_RUN (the full [0,40] hc<=1e-3 rerun was run here)',
  newSubGap: 'IMP96991_HIGH_T_HC_INSUFFICIENT -- decide the hc (or cell-local |w1-prime-prime| enclosure strength, imp-96992) that clears the t~24-38 bands and whether it is tractable in-pool.',
  intervalRigorousReachUnchanged: 0.96,
  operatorPositivityProved: false,
  rhResolved: false,
  qed: false,
});

// --- self-executing assertions (pure literals; import-light) ---
const IMP96991_ASSERTIONS = [
  {
    id: 'imp96991-old-band-cleared-but-not-verified',
    holds: () =>
      IMP96991_OLD_BAND_CLEARED === true &&
      IMP96991_FAIL_TBANDS.every((b) => b >= 18) &&
      IMP96991_RUN.verified === false &&
      IMP96991_RUN.nFailingCells === 91 &&
      IMP96991_RUN.tailOk === true &&
      IMP96991_VERDICT.worstBandCellCleared === true &&
      IMP96991_VERDICT.certifiesAtHc1em3 === false,
    why: 'the full [0,40] hc=1e-3 rerun clears the imp-96978 worst band (16<=t<18 has zero failing cells) but still has 91 failing cells, so 2a=1.00 does NOT certify at hc=1e-3.',
  },
  {
    id: 'imp96991-collapse-relocated-to-higher-t',
    holds: () =>
      Math.min(...IMP96991_FAIL_TBANDS) >= 24 &&
      Math.max(...IMP96991_FAIL_TBANDS) >= 38 &&
      IMP96991_DEEPEST_FAIL.flow < -1.0 &&
      IMP96991_DEEPEST_FAIL.t > 30 &&
      IMP96991_VERDICT.collapseRelocatedToHigherT === true,
    why: 'halving hc from 2e-3 to 1e-3 relocated the collapse from t~16-17 to t~24-38, where the (t^2+1/4)^2 W1PP curvature penalty (~t^4) is much larger; the deepest observed lower bound is ~-4.19 at t~35.2.',
  },
  {
    id: 'imp96991-true-point-f-stays-positive',
    holds: () =>
      IMP96991_TRUE_POINT_F_MIN.F > 1.0 &&
      IMP96991_VERDICT.truePointFStaysPositive === true &&
      IMP96991_VERDICT.collapseIsGuardResolutionArtifact === true &&
      IMP96991_VERDICT.collapseIsGenuineObstruction === false,
    why: 'the verifier point-value minimum of F over [0,40] is +1.0000005, so the negative rigorous lower bounds at t~24-38 are coarse-grid guard-resolution artifacts, not genuine sign changes in F.',
  },
  {
    id: 'imp96991-subgap-closed-reach-unchanged-no-qed',
    holds: () =>
      IMP96991_VERDICT.resolvesSubGap.includes('IMP96978_FULLDOMAIN_HC1EM3_RERUN_NOT_RUN') &&
      IMP96991_VERDICT.newSubGap.includes('IMP96991_HIGH_T_HC_INSUFFICIENT') &&
      IMP96991_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP96991_VERDICT.operatorPositivityProved === false &&
      IMP96991_VERDICT.rhResolved === false &&
      IMP96991_VERDICT.qed === false,
    why: 'the imp-96978 rerun sub-gap is closed (the run was executed and fails at hc=1e-3), a new high-t hc-insufficiency sub-gap replaces it, the certified interval-rigorous reach stays 2a<=0.96, and NO QED.',
  },
];

for (const a of IMP96991_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96991 assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
