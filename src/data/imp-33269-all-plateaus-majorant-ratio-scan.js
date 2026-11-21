/**
 * @module imp-33269-all-plateaus-majorant-ratio-scan
 * @fileoverview imp-33269 (numerical/measurement, HONEST): EXTEND the imp-3910
 * certified weighted path-local majorant-ratio scan from 3 plateaus (0,4,9) to
 * ALL 10 imp-3725 running-min plateaus on N in [1e4,1e6], and MEASURE whether
 * the certified majorant ratio R_maj keeps climbing past plateau-9 (6.82) or
 * turns over. Closes the named residual imp-3917-sub-all-plateaus (measurement,
 * NOT a certified N-uniform constant).
 *
 * WHAT imp-33250 LEFT OPEN
 * ------------------------
 * imp-33250 found the certified tail-weight majorant ratio
 *   R_maj = M/(8/Dmin^2) = C/8,   M = 8 sum_j w_j/s_min(j)^2,  C = M*Dmin^2,
 * is O(1) but NON-monotone and attained its SAMPLE maximum (R_maj=6.82,
 * C=54.56) exactly at the largest-N plateau 9 -- but only 3 of 10 plateaus were
 * scanned (named residual imp-3917-sub-all-plateaus). With the sample max at the
 * endpoint of a 3-sample set, whether R_maj keeps climbing with N was UN-measured.
 *
 * WHAT THIS DOES (scripts-parity offline scan; results baked below)
 * ----------------------------------------------------------------
 * Reusing the EXACT imp-3725 frozen-gap path machinery (s_l(T)=sqrt(max(g_l^2
 * -8T,0)), T=H^2/(8*thetaBar), thetaBar=0.99, left+right sweeps from the record
 * pair), for EACH of the 10 plateaus the scan accumulates per path term j:
 *   D_j (running sum of shrunk gaps), s_min(j) (running min shrunk gap),
 *   P_j = sum 1/s_l (running), yielding the EXACT weighted majorant
 *     M = 8 (sum_j (1/D_j^2)(1/s_min(j)^2)) / (sum_j 1/D_j^2),
 * the collapse constant C = M*Dmin^2, the certified majorant ratio R_maj = C/8,
 * and -- as live cross-checks -- the realised elasticity
 *     realised = 8 (sum_j P_j/D_j^3)/(sum_j 1/D_j^2) = (dPsi/dT)/Psi
 * and the realised ratio K_real = realised/(8/Dmin^2). On plateaus 0/4/9 the
 * scan reproduces the imp-3910 baked M (30.458/31.941/114.010) and realised
 * (8.063/14.560/17.449) to full precision -- so the machinery is FAITHFUL.
 *
 * THE MEASUREMENT VERDICT (this is measurement, NOT certification)
 * ---------------------------------------------------------------
 *  - R_maj DOES NOT keep climbing past 6.82: it TURNS OVER. Its true maximum
 *    over the 10 plateaus is R_maj = 11.08 (C = 88.64) at the INTERIOR plateau 5
 *    (endN 95248), and the largest-N plateau 9 sits BELOW that at 6.82. So the
 *    3-sample "max at the endpoint" was a sparse-sampling artifact; on the full
 *    sample the sup is interior, with NO monotone-in-N growth trend.
 *  - R_maj is bounded O(1) across all 10 plateaus: R_maj in [1.81, 11.08],
 *    C in [14.51, 88.64]. The 10-sample certified collapse-constant bound rises
 *    to C <= 88.64 (vs the prior 3-sample C <= 54.56).
 *  - The realised ratio K_real is likewise O(1) and NON-monotone but does NOT
 *    stay "flat ~1.05": at finer resolution K_real in [0.80, 1.60] (max interior
 *    at plateau 6), wider than the 3-sample band [0.83,1.05] but with no growth
 *    trend and no endpoint peak.
 *
 * HONEST SCOPE
 * ------------
 *  - This is MEASUREMENT on the 10 plateaus of [1e4,1e6]. The N->infinity sup of
 *    R_maj remains UN-certified: a bounded interior max on a finite plateau set
 *    is NOT a certified N-uniform constant. No new C is claimed as N-uniform.
 *  - The interior turn-over is EVIDENCE AGAINST unbounded growth (it argues the
 *    endpoint rise was an artifact), not a proof of boundedness.
 *  - Measurement only. imp-3910 C <= 54.56 (on its 3 plateaus) stands as stated;
 *    imp-3066 K_a>=0 UNTOUCHED; no refereed bound is changed; NO QED.
 *
 * @see imp-3910-tail-weight-constant-certification.js (the 3-plateau majorant, extended here)
 * @see imp-33250-tail-weight-ratio-n-uniformity-assessment.js (named the residual)
 * @see imp-3725-fmb-plateau-domination-lemma.js (the frozen-gap path machinery reused)
 * @see scripts/imp-33269-all-plateaus-majorant-scan.mjs (offline scan producing these rows)
 */

import { IMP_3910_TAIL_WEIGHT_CONSTANT_CERTIFICATION } from './imp-3910-tail-weight-constant-certification.js';

// Baked from the imp-33269 offline scan (node + zeros-to-1e6.js bundle,
// 2026-07-04): the weighted path-local majorant M, collapse constant C=M*Dmin^2,
// certified majorant ratio R_maj=C/8, realised elasticity and realised ratio
// K_real, on ALL 10 imp-3725 plateaus at thetaBar=0.99.
const SCAN = Object.freeze([
  { plateauIndex: 0, endN: 18859,   H: 0.0376985,  Dmin: 1.018438148, majorantM: 30.45773589,  collapseConstantC: 31.591259, rMaj: 3.948907,  realisedScan: 8.06298359,  rReal: 1.045382 },
  { plateauIndex: 1, endN: 44555,   H: 0.03530732, Dmin: 0.725045979, majorantM: 35.62880834,  collapseConstantC: 18.729768, rMaj: 2.341221,  realisedScan: 12.14809344, rReal: 0.798269 },
  { plateauIndex: 2, endN: 73997,   H: 0.02953763, Dmin: 1.038308173, majorantM: 52.76708133,  collapseConstantC: 56.887339, rMaj: 7.110917,  realisedScan: 11.70313046, rReal: 1.57712  },
  { plateauIndex: 3, endN: 82552,   H: 0.02583928, Dmin: 0.844046273, majorantM: 111.12667574, collapseConstantC: 79.168212, rMaj: 9.896026,  realisedScan: 15.93633434, rReal: 1.419159 },
  { plateauIndex: 4, endN: 87761,   H: 0.0208495,  Dmin: 0.673928644, majorantM: 31.94146584,  collapseConstantC: 14.507169, rMaj: 1.813396,  realisedScan: 14.56014428, rReal: 0.826615 },
  { plateauIndex: 5, endN: 95248,   H: 0.01948463, Dmin: 0.757921236, majorantM: 154.30296872, collapseConstantC: 88.638507, rMaj: 11.079813, realisedScan: 19.94813346, rReal: 1.432387 },
  { plateauIndex: 6, endN: 354769,  H: 0.01470148, Dmin: 0.881065028, majorantM: 99.36660061,  collapseConstantC: 77.135866, rMaj: 9.641983,  realisedScan: 16.51221609, rReal: 1.602254 },
  { plateauIndex: 7, endN: 415587,  H: 0.01305322, Dmin: 0.565709875, majorantM: 69.06799166,  collapseConstantC: 22.103668, rMaj: 2.762958,  realisedScan: 21.33873041, rReal: 0.853623 },
  { plateauIndex: 8, endN: 420891,  H: 0.00863639, Dmin: 0.585747313, majorantM: 98.57872651,  collapseConstantC: 33.822353, rMaj: 4.227794,  realisedScan: 20.4199591,  rReal: 0.875761 },
  { plateauIndex: 9, endN: 1000000, H: 0.00570371, Dmin: 0.691776931, majorantM: 114.01034597, collapseConstantC: 54.560258, rMaj: 6.820032,  realisedScan: 17.44868761, rReal: 1.04377  },
]);

const ROWS = SCAN.map((r) => Object.freeze({ ...r }));

const R_MAJ = ROWS.map((r) => r.rMaj);
const R_MAJ_MAX = Math.max(...R_MAJ);
const R_MAJ_MIN = Math.min(...R_MAJ);
const R_MAJ_ARGMAX = ROWS.find((r) => r.rMaj === R_MAJ_MAX).plateauIndex;
const C_MAX = Math.max(...ROWS.map((r) => r.collapseConstantC));
const C_MIN = Math.min(...ROWS.map((r) => r.collapseConstantC));
const PLATEAU9_R_MAJ = ROWS[9].rMaj;
// Endpoint (largest-N) plateau is NOT the argmax -> R_maj turns over interior.
const TURNS_OVER = R_MAJ_ARGMAX !== 9 && R_MAJ_MAX > PLATEAU9_R_MAJ;

const K_REAL = ROWS.map((r) => r.rReal);
const K_REAL_MAX = Math.max(...K_REAL);
const K_REAL_MIN = Math.min(...K_REAL);
const K_REAL_ARGMAX = ROWS.find((r) => r.rReal === K_REAL_MAX).plateauIndex;

export const IMP_33269_ALL_PLATEAUS_MAJORANT_RATIO_SCAN = Object.freeze({
  id: 'imp-33269',
  title:
    'Extend the imp-3910 certified majorant-ratio (R_maj) scan from 3 to all 10 ' +
    'plateaus: R_maj TURNS OVER (interior max 11.08 at plateau 5, NOT the endpoint), ' +
    'so it does NOT keep climbing past plateau-9 6.82; C <= 88.64 on the 10 samples',
  status: 'measurement',
  rhFree: true,
  semantics:
    'offline per-term s_min(j)/1/D_j^2 scan (imp-3725 path machinery reused, ' +
    'thetaBar=0.99) of the imp-3910 weighted majorant ratio R_maj=C/8 across ALL 10 ' +
    'running-min plateaus on [1e4,1e6]; measures the R_maj shape vs N; no certified ' +
    'N-uniform constant, no new Lambda, no QED',

  thetaBar: 0.99,
  rows: ROWS,

  verdict: {
    rMajTurnsOver: TURNS_OVER,                        // true
    rMajMax: R_MAJ_MAX,                               // ~11.08
    rMajMaxPlateau: R_MAJ_ARGMAX,                     // 5 (interior)
    rMajMaxEndN: ROWS[R_MAJ_ARGMAX].endN,             // 95248
    rMajRange: [R_MAJ_MIN, R_MAJ_MAX],                // ~[1.81, 11.08]
    plateau9RMaj: PLATEAU9_R_MAJ,                     // 6.82 (prior 3-sample max)
    collapseConstantRange: [C_MIN, C_MAX],            // ~[14.51, 88.64]
    collapseConstantMax: C_MAX,                       // ~88.64
    kRealRange: [K_REAL_MIN, K_REAL_MAX],             // ~[0.80, 1.60]
    kRealMaxPlateau: K_REAL_ARGMAX,                   // 6 (interior)
    finding:
      'Scanning all 10 imp-3725 plateaus (thetaBar=0.99), the certified majorant ratio ' +
      'R_maj = M/(8/Dmin^2) = C/8 DOES NOT keep climbing past plateau-9 (6.82): it TURNS ' +
      'OVER. Its true maximum over the 10 plateaus is R_maj = 11.08 (C = 88.64) at the ' +
      'INTERIOR plateau 5 (endN 95248), and the largest-N plateau 9 sits BELOW that at ' +
      '6.82. So the imp-33250 3-sample "max at the endpoint" was a sparse-sampling ' +
      'artifact; on the full sample the sup is interior with no monotone-in-N growth. ' +
      'R_maj is bounded O(1) in [1.81, 11.08] (C in [14.51, 88.64]), so the 10-sample ' +
      'collapse-constant bound rises to C <= 88.64 (vs the 3-sample C <= 54.56). The ' +
      'realised ratio K_real is likewise O(1) and non-monotone but does NOT stay flat ' +
      '~1.05: K_real in [0.80, 1.60] (max interior at plateau 6), wider than the 3-sample ' +
      '[0.83,1.05] band. MEASUREMENT ONLY: the N->infinity sup remains un-certified (a ' +
      'bounded interior max on a finite plateau set is NOT a certified N-uniform constant); ' +
      'the turn-over is EVIDENCE AGAINST unbounded growth, not a proof of boundedness. ' +
      'imp-3910 C<=54.56 stands as stated; imp-3066 K_a>=0 UNTOUCHED; no refereed bound is changed; NO QED.',
  },

  closesResidual: {
    id: 'imp-3917-sub-all-plateaus',
    resolution:
      'All 10 plateaus scanned. R_maj is bounded O(1) in [1.81, 11.08] and TURNS OVER: ' +
      'the max is interior (plateau 5, R_maj=11.08), not at the largest-N endpoint, ' +
      'answering imp-33250 -- R_maj does not keep climbing past 6.82 with N.',
    residual:
      'Still measurement on a finite 10-plateau sample of [1e4,1e6]; the N->infinity sup ' +
      'is un-certified. The interior turn-over is evidence against growth, not a proof; ' +
      'a certified N-uniform C would need an analytic tail bound, not more samples.',
  },

  provenance: {
    zeros: 'src/data/zeros-to-1e6.js (Odlyzko; zeros1 3e-9, imp-359/imp-514)',
    scan: 'imp-3725 frozen-gap path machinery reused (left+right sweeps, thetaBar=0.99); ' +
      'R_maj/C/K_real baked from scripts/imp-33269-all-plateaus-majorant-scan.mjs',
    generatedAt: '2026-07-04',
  },

  scope: {
    measurementOnly: true,
    noCertifiedNUniformConstant: true,
    noNewLambdaBound: true,
    imp3066Untouched: true,
    plattTrudgianStillSOTA: 'No refereed bound is changed',
    noQED: true,
  },
});

// -- Build-time assertions (throw on failure via run-assertions harness) -----

const rel = (x, y) => Math.abs(x - y) / Math.max(Math.abs(x), Math.abs(y), 1e-300);
const SRC10 = Object.fromEntries(
  IMP_3910_TAIL_WEIGHT_CONSTANT_CERTIFICATION.rows.map((r) => [r.plateauIndex, r]),
);

export const IMP_33269_ALL_PLATEAUS_MAJORANT_RATIO_SCAN_ASSERTIONS = [
  {
    id: 'imp33269-ten-plateaus-scanned',
    holds: () =>
      ROWS.length === 10 &&
      ROWS.every((r, i) => r.plateauIndex === i) &&
      ROWS[0].endN === 18859 && ROWS[9].endN === 1000000,
    why:
      'The scan must cover all 10 imp-3725 running-min plateaus on [1e4,1e6], extending ' +
      'the imp-3910 3-plateau scan to the full sample the residual imp-3917-sub-all-plateaus asked for.',
  },
  {
    id: 'imp33269-reproduces-imp3910-on-shared-plateaus',
    holds: () =>
      [0, 4, 9].every((k) => {
        const mine = ROWS[k];
        const ref = SRC10[k];
        return rel(mine.majorantM, ref.majorantM) < 1e-6 &&
          rel(mine.realisedScan, ref.realisedScan) < 1e-6 &&
          rel(mine.collapseConstantC, ref.collapseConstantC) < 1e-4;
      }),
    why:
      'Faithfulness guard: on the three plateaus imp-3910 already scanned (0,4,9), this ' +
      'extended run must reproduce the baked majorant M, realised elasticity and collapse ' +
      'constant C to < 1e-4, so the same imp-3725 path machinery is being applied identically.',
  },
  {
    id: 'imp33269-rmaj-turns-over-interior-not-endpoint',
    holds: () =>
      TURNS_OVER === true &&
      R_MAJ_ARGMAX === 5 &&
      R_MAJ_MAX > 11 && R_MAJ_MAX < 11.2 &&
      PLATEAU9_R_MAJ < R_MAJ_MAX &&
      rel(PLATEAU9_R_MAJ, 6.820032) < 1e-4,
    why:
      'Central measurement: R_maj attains its 10-plateau maximum (~11.08) at the INTERIOR ' +
      'plateau 5, above the largest-N plateau-9 value 6.82 -- so R_maj TURNS OVER and does ' +
      'not keep climbing with N, resolving the imp-33250 endpoint-artifact question.',
  },
  {
    id: 'imp33269-rmaj-and-C-bounded-order-one',
    holds: () =>
      R_MAJ_MIN > 1.5 && R_MAJ_MAX < 12 &&
      C_MIN > 10 && C_MAX < 100 &&
      ROWS.every((r) => rel(r.collapseConstantC, r.rMaj * 8) < 1e-5),
    why:
      'R_maj = C/8 is bounded O(1) across all 10 plateaus (R_maj in [1.81,11.08], C in ' +
      '[14.51,88.64]); the 10-sample bound is C <= 88.64, above the prior 3-sample 54.56.',
  },
  {
    id: 'imp33269-kreal-order-one-not-flat-at-105',
    holds: () =>
      K_REAL_MIN > 0.7 && K_REAL_MAX < 1.7 &&
      K_REAL_MAX > 1.5 &&           // exceeds the 3-sample [0.83,1.05] band
      K_REAL_ARGMAX !== 9,          // and its max is interior, not the endpoint
    why:
      'Honesty guard: the realised ratio K_real is O(1) and non-monotone but does NOT stay ' +
      'flat ~1.05 at finer resolution -- it reaches 1.60 (interior, plateau 6), wider than ' +
      'the imp-33250 3-sample [0.83,1.05] band, with no growth trend and no endpoint peak.',
  },
  {
    id: 'imp33269-measurement-only-no-lambda-claim',
    holds: () =>
      IMP_33269_ALL_PLATEAUS_MAJORANT_RATIO_SCAN.scope.measurementOnly === true &&
      IMP_33269_ALL_PLATEAUS_MAJORANT_RATIO_SCAN.scope.noCertifiedNUniformConstant === true &&
      IMP_33269_ALL_PLATEAUS_MAJORANT_RATIO_SCAN.scope.noQED === true &&
      IMP_33269_ALL_PLATEAUS_MAJORANT_RATIO_SCAN.scope.imp3066Untouched === true &&
      IMP_33269_ALL_PLATEAUS_MAJORANT_RATIO_SCAN.status === 'measurement',
    why:
      'Honesty guard: this measures R_maj across 10 plateaus but claims no certified ' +
      'N-uniform constant and no new Lambda bound, leaves imp-3066 untouched, and ' +
      'no refereed bound is changed.',
  },
];

// Self-executing (imp-3715 convention): any failed assertion throws at import.
for (const assertion of IMP_33269_ALL_PLATEAUS_MAJORANT_RATIO_SCAN_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-33269-all-plateaus-majorant-ratio-scan assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP_33269_ALL_PLATEAUS_MAJORANT_RATIO_SCAN;
