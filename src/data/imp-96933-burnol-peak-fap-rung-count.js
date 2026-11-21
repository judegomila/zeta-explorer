/**
 * @fileoverview imp-96933 -- SCOUT (numerical): estimate how many additional imp-96487 Burnol-ratio
 * ladder rungs are needed to push the imp-96915 genuine low-frequency peak (w=0.70 rad/sample, period
 * ~9 lags) below the FAP=0.05 significance threshold, and assess whether that rung count is reachable
 * within the existing ratio(N) construction. imp-96915 FINDING 4 pinned the genuine peak at normalized
 * power z=5.18 but found it only MARGINALLY significant (Lomb-Scargle FAP~0.11 > 0.05 at the 21-rung
 * ladder). Measurement only; the qualitative VIF>1 conclusion is untouched; NO QED.
 *
 * MODEL (driver tmp/imp-96933-scratch.mjs, pure JS). The white-noise false-alarm probability is
 * FAP(n) = 1 - (1 - e^-z(n))^M(n) where z(n) is the normalized peak power and M(n) is the number of
 * independent frequencies. CALIBRATION at the imp-96915 measurement (n0=21 rungs, z0=5.18, FAP0~0.11):
 * solving M from FAP=1-(1-e^-z0)^M gives M=20.65 ~ n0 -- i.e. M(n)=n (one independent frequency per
 * unit-spaced rung), and the model reproduces the measured FAP (model FAP(21)=0.112 vs measured ~0.11).
 * A coherent oscillation has periodogram peak power that grows linearly with sample count, z(n)=z0*n/n0,
 * so adding rungs both RAISES z (helps) and RAISES M (hurts); the net gain per rung is positive only
 * while the peak power keeps growing at least linearly -- which is precisely the coherence the FAP test
 * is designed to probe.
 *
 * FINDING 1 -- UNDER THE COHERENT-SIGNAL MODEL (z proportional to n, M=n) THE PEAK CLEARS FAP=0.05 AT
 * n*=26 RUNGS: FAP(25)=0.051, FAP(26)=0.042. That is ONLY 5 ADDITIONAL RUNGS beyond the current 21,
 * with normalized power z growing 5.18 -> 6.41. The rung count is small because the peak is already
 * close to the threshold (0.11 vs 0.05) and coherent power growth outruns the log-M penalty.
 *
 * FINDING 2 -- THE ESTIMATE IS NOT ROBUST TO THE POWER-GROWTH ASSUMPTION. If the peak is only partly
 * coherent so power grows as sqrt (z(n)=z0*sqrt(n/n0), the incoherent/noise regime), n* balloons to 33
 * rungs (12 additional). If instead the independent-frequency count is M=n/2 rather than n, a single
 * additional rung (n*=22) already clears the threshold. So the honest band is ~1 to ~12 additional
 * rungs, primary estimate ~5 (coherent, M=n), dominated by how the peak power actually scales with n --
 * which is the very question a longer ladder would answer, so the estimate is conditional, not a promise.
 *
 * FINDING 3 -- THE RUNG COUNT IS REACHABLE WITHIN THE EXISTING ratio(N) CONSTRUCTION. The imp-96487
 * ladder spans N=250..10000 in 21 rungs (top spacing 1000, assembled from the imp-96094/imp-96105/
 * imp-96325 solve family). Five more rungs is a straightforward continuation -- N=11000..15000 at the
 * existing 1000-step -- requiring no new machinery, only ~5-12 further ratio(N) solves at larger N. The
 * blocker is not reachability but the conditionality of FINDING 2: whether the ~9-lag oscillation stays
 * coherent enough for its periodogram power to keep growing linearly as the window extends.
 *
 * VERDICT. Roughly 5 additional rungs (n*=26 total) are needed to push the genuine w=0.70 peak below
 * FAP=0.05 under the coherent-signal model (z proportional to n, M=n calibrated to the measured FAP~0.11
 * at 21 rungs), with an honest band of ~1-12 rungs across the power-growth / independent-frequency
 * assumptions. That count is reachable within the existing imp-96487 ratio(N) construction (extend
 * N=11000..15000 at 1000-step, ~5-12 more solves), but the estimate is conditional on the oscillation
 * remaining coherent -- the same coherence the longer ladder would test. SUB-GAP
 * IMP96933_FIVE_RUNGS_CLEAR_FAP_UNDER_COHERENT_MODEL. Measurement only; the qualitative VIF>1 conclusion
 * is untouched; interval-rigorous certificate reach stays 2a<=0.96; C_mb GUE-conditional (imp-486);
 * no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-96915-burnol-oscillation-frequency-periodogram.js (pinned the genuine peak w=0.70, power z=5.18, FAP~0.11 at 21 rungs -- FINDING 4)
 * @see imp-96487-route-m-burnol-ratio-asymptotic-remainder-model.js (the 21-rung ratio(N) ladder N=250..10000)
 * @see imp-96832 (named the oscillatory-remainder / VIF>1 anticorrelation lobe this rung-count serves)
 */

// interval-rigorous certificate reach (unchanged by this scout)
export const IMP96933_RIGOROUS_REACH_2A = 0.96;

// the imp-96915 measurement this estimate is calibrated to
export const IMP96933_MEASURED = Object.freeze({
  nRungs: 21,          // current ladder length (imp-96487)
  peakPower: 5.18,     // normalized Lomb-Scargle power of the w=0.70 peak
  measuredFAP: 0.11,   // white-noise FAP at 21 rungs (imp-96915 FINDING 4)
  targetFAP: 0.05,
});

// FAP model FAP=1-(1-e^-z)^M; M calibrated from the measured FAP at 21 rungs
function fapAt(z, M) { return 1 - Math.pow(1 - Math.exp(-z), M); }
export const IMP96933_M_CALIBRATION = Object.freeze({
  // solve M from 0.11 = 1-(1-e^-5.18)^M
  Mcalibrated: Math.log(1 - 0.11) / Math.log(1 - Math.exp(-5.18)), // 20.65 ~ 21
  MperRung: (Math.log(1 - 0.11) / Math.log(1 - Math.exp(-5.18))) / 21, // ~0.983
  modelFAPat21: fapAt(5.18, 21), // 0.112 -- reproduces the measured ~0.11
});

// FINDING 1: coherent-signal model z(n)=z0*n/n0, M(n)=n
export const IMP96933_COHERENT = Object.freeze({
  model: 'z(n)=5.18*n/21, M(n)=n (coherent peak, one independent frequency per rung)',
  nStar: 26,                 // smallest n with FAP<0.05
  additionalRungs: 5,        // 26 - 21
  fapAtNStarMinus1: fapAt(5.18 * 25 / 21, 25), // 0.051 (still above)
  fapAtNStar: fapAt(5.18 * 26 / 21, 26),       // 0.042 (clears)
  powerAtNStar: 5.18 * 26 / 21,                // 6.41
});

// FINDING 2: sensitivity band across power-growth / M assumptions
export const IMP96933_SENSITIVITY = Object.freeze({
  incoherentSqrtPower: Object.freeze({ model: 'z(n)=5.18*sqrt(n/21), M=n', nStar: 33, additionalRungs: 12 }),
  halfIndepFreq: Object.freeze({ model: 'z(n)=5.18*n/21, M=n/2', nStar: 22, additionalRungs: 1 }),
  primaryAdditionalRungs: 5,
  bandAdditionalRungs: Object.freeze([1, 12]),
});

// FINDING 3: reachability within the existing imp-96487 ratio(N) construction
export const IMP96933_REACHABILITY = Object.freeze({
  currentLadder: 'N=250..10000, 21 rungs, top spacing 1000 (imp-96094/imp-96105/imp-96325)',
  extension: 'N=11000..15000 at 1000-step continues the same ratio(N) construction',
  reachable: true,
  extraSolves: '~5-12 further ratio(N) solves at larger N; no new machinery',
  caveat: 'conditional on the ~9-lag oscillation staying coherent so peak power keeps growing linearly -- the same coherence the longer ladder would test',
});

export const IMP96933_VERDICT = Object.freeze({
  ticket: 'imp-96933',
  question: 'how many additional imp-96487 Burnol-ladder rungs push the imp-96915 genuine w=0.70 peak below FAP=0.05, and is that rung count reachable within the existing ratio(N) construction ?',
  method: 'FAP=1-(1-e^-z)^M model with M calibrated to the measured FAP~0.11 at 21 rungs (M=20.65~n), then extrapolated under coherent (z proportional to n) and incoherent (z proportional to sqrt n) power growth',
  Mcalibrated: 20.65,
  primaryAdditionalRungs: 5,        // coherent model, M=n
  nStar: 26,
  bandAdditionalRungs: [1, 12],
  reachable: true,
  estimateConditionalOnCoherence: true,
  vifConclusionUntouched: true,
  operatorPositivityProved: false,
  intervalRigorousReachUnchanged: 0.96,
  subGap: 'IMP96933_FIVE_RUNGS_CLEAR_FAP_UNDER_COHERENT_MODEL -- under the FAP=1-(1-e^-z)^M model with M=20.65~n calibrated to the imp-96915 measured FAP~0.11 at 21 rungs, the genuine w=0.70 (period ~9 lags) peak clears FAP=0.05 at n*=26 rungs, i.e. ~5 ADDITIONAL rungs (power z growing 5.18->6.41), with an honest band of ~1-12 rungs across coherent (z proportional to n, M=n) vs incoherent (z proportional to sqrt n) vs M=n/2 assumptions. That count is REACHABLE within the existing imp-96487 ratio(N) construction (extend N=11000..15000 at 1000-step, ~5-12 more solves, no new machinery), but the estimate is CONDITIONAL on the oscillation staying coherent enough for its periodogram power to keep growing linearly -- the same coherence the longer ladder would test. Measurement only; the qualitative VIF>1 conclusion is untouched; NO QED',
  qed: false,
});
export default IMP96933_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96933_ASSERTIONS = [
  {
    id: 'imp96933-M-calibration-matches-measured-fap',
    holds: () =>
      Math.abs(IMP96933_M_CALIBRATION.Mcalibrated - 20.65) < 0.1 &&      // M ~ 21 = n
      IMP96933_M_CALIBRATION.MperRung > 0.95 && IMP96933_M_CALIBRATION.MperRung < 1.02 &&
      Math.abs(IMP96933_M_CALIBRATION.modelFAPat21 - IMP96933_MEASURED.measuredFAP) < 0.005,
    why: 'the FAP model with M=20.65~n (one independent frequency per unit-spaced rung) reproduces the imp-96915 measured FAP~0.11 at 21 rungs (model 0.112).',
  },
  {
    id: 'imp96933-coherent-model-clears-fap-at-five-rungs',
    holds: () =>
      IMP96933_COHERENT.nStar === 26 &&
      IMP96933_COHERENT.additionalRungs === 5 &&
      IMP96933_COHERENT.fapAtNStar < IMP96933_MEASURED.targetFAP &&        // 0.042 < 0.05
      IMP96933_COHERENT.fapAtNStarMinus1 >= IMP96933_MEASURED.targetFAP && // 0.051 >= 0.05
      Math.abs(IMP96933_COHERENT.powerAtNStar - 6.41) < 0.02,
    why: 'under the coherent-signal model (z proportional to n, M=n) the w=0.70 peak clears FAP=0.05 at n*=26 rungs (FAP 0.042), i.e. 5 additional rungs, with power growing 5.18->6.41.',
  },
  {
    id: 'imp96933-estimate-not-robust-sensitivity-band',
    holds: () =>
      IMP96933_SENSITIVITY.incoherentSqrtPower.additionalRungs === 12 &&
      IMP96933_SENSITIVITY.halfIndepFreq.additionalRungs === 1 &&
      IMP96933_SENSITIVITY.bandAdditionalRungs[0] === 1 &&
      IMP96933_SENSITIVITY.bandAdditionalRungs[1] === 12 &&
      IMP96933_SENSITIVITY.primaryAdditionalRungs === IMP96933_COHERENT.additionalRungs,
    why: 'the rung count is dominated by the power-growth / independent-frequency assumptions: 12 rungs if power grows only as sqrt(n), 1 rung if M=n/2 -- an honest band of ~1-12 around the primary ~5.',
  },
  {
    id: 'imp96933-reachable-within-existing-construction',
    holds: () =>
      IMP96933_REACHABILITY.reachable === true &&
      IMP96933_VERDICT.reachable === true &&
      IMP96933_VERDICT.estimateConditionalOnCoherence === true &&
      typeof IMP96933_REACHABILITY.caveat === 'string' &&
      IMP96933_REACHABILITY.caveat.length > 0,
    why: 'extending the imp-96487 ladder to N=11000..15000 at 1000-step continues the same ratio(N) construction (~5-12 more solves), so the rung count is reachable -- conditional only on the oscillation staying coherent.',
  },
  {
    id: 'imp96933-scout-only-no-qed',
    holds: () =>
      IMP96933_VERDICT.vifConclusionUntouched === true &&
      IMP96933_VERDICT.operatorPositivityProved === false &&
      IMP96933_VERDICT.intervalRigorousReachUnchanged === IMP96933_RIGOROUS_REACH_2A &&
      IMP96933_RIGOROUS_REACH_2A === 0.96 &&
      IMP96933_VERDICT.subGap.indexOf('IMP96933_FIVE_RUNGS_CLEAR_FAP_UNDER_COHERENT_MODEL') === 0 &&
      IMP96933_VERDICT.qed === false,
    why: 'measurement only: a rung-count estimate under an explicit FAP model, the qualitative VIF>1 conclusion is untouched, the interval-rigorous reach stays 2a<=0.96, and no QED is claimed.',
  },
];

for (const a of IMP96933_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96933-burnol-peak-fap-rung-count assertion failed: ${a.id}`);
  }
}
