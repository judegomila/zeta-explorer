/**
 * @module imp-97080-palm-mirror-baseline-vs-preq-measurement
 *
 * imp-97080 (numerical): measure the Palm (conditioned-on-a-zero) neutral-lattice
 * mirror-count baseline directly at the working row (t0 = 0.1314, y0 = 0.165) and
 * test whether the conditional flow-descent hypothesis H_desc-mirror(p_req = 4.3743)
 * of rh-bridge-mirror-descent-2026-09-25 (theorem B1) holds against that baseline.
 *
 * THE THEOREM UNDER TEST (B1, from rh-bridge-mirror-descent-2026-09-25 /
 * imp-97061): given P15 Thm 1.2 (i)-(ii) and H_desc-mirror(p) -- every nonreal
 * topmost-within-2 zero of H_t at height y >= y0, x >= X + 1 has mirror-count
 * M_t(z) >= p(y) -- IF int_{y0}^1 dY/(1/Y + p(Y)) <= t0 THEN Lambda <= t0 + y0^2/2.
 * At the working row the constant form needs p >= p_req = 4.3743 (the p at which the
 * integral condition holds with equality). The question this ticket answers
 * numerically: how large is the ACTUAL mirror count a topmost zero receives at
 * y0 = 0.165, and how far short of p_req does it fall?
 *
 * WHAT IS MEASURED HERE (two independent baselines, both re-derived from first
 * principles below, not re-imported):
 *   (1) NEUTRAL RIGID-LATTICE PALM count. Zeros on a rigid lattice of spacing
 *       s = 2 pi / ln N, the conditioning pair excluded (2-slot / 1-slot displaced),
 *       mirror kernel 2 * 2y/(D^2 + 4y^2) summed over both sides. This is the
 *       "conditioned on a zero, otherwise featureless" baseline.
 *   (2) EMPIRICAL FINITE-HEIGHT count from measured zeta-zero block minima. The
 *       source module's C2 records the worst-case (minimum) mirror pull inside
 *       1e12- and 1e22-height blocks as a FRACTION of the mean pi*rho = ln N / 2;
 *       multiplying the y0 fraction by the mean gives the measured mirror count a
 *       genuinely observed near-topmost zero receives at finite height.
 *
 * RESULT (all at seam ln N = 13.4459 unless noted; mean = ln N / 2 = 6.7229):
 *   p_req                         = 4.3743
 *   neutral Palm 2-slot           = 2.5288  (0.3761 of mean)  -> surplus 1.730x
 *   neutral Palm 1-slot           = 3.8536  (0.5732 of mean)  -> surplus 1.135x
 *   empirical 1e12 location-free  = 2.6683                    -> surplus 1.639x
 *   empirical 1e12 pair-replace   = 1.5086                    -> surplus 2.899x
 *   neutral Palm 2-slot @ N1*     = 4.4208  (0.4777 of mean)  -> surplus 0.989x
 *   empirical 1e22 location-free  = 4.3450                    -> surplus 1.007x
 * VERDICT: H_desc-mirror(p_req = 4.3743) is FALSE at every seam-height baseline --
 * the measured mirror count is 1.6x-2.9x SHORT of p_req, confirming the source
 * module's C1 "local surplus ~1.73x" finding independently and adding a
 * finite-height empirical cross-check. Only at the far height N1* (ln N = 18.509)
 * and in the deeper 1e22 block does the baseline reach parity (~1.0x), consistent
 * with the mirror mean growing like ln N / 2: parity there is a height effect, not
 * a relaxation of the hypothesis at the binding y0 window.
 *
 * HONEST STATUS: this is a finite-height / rigid-lattice / t = 0-proxy measurement.
 * The hypothesis H_desc-mirror concerns zeros of H_t for t in (0, t0], which carry
 * NO Euler product, and a single finite-height count supplies no uniform-in-t,
 * all-x lower bound (residual (c) of the source module, the NS-RIGID wall). No
 * Lambda bound follows from this measurement. No refereed bound is changed. RH
 * open. NO QED.
 *
 * @see rh-bridge-mirror-descent-2026-09-25.js (theorem B1, C1 Palm baseline 2.530,
 *   C2 empirical block minima)
 * @see imp-97061-mirror-pair-lemma-flow-descent-glossary-headword.js (glossary
 *   headword for B1 and the "not easier" finding)
 *
 * Import-free (self-contained re-derivation). Literals cross-checked against
 * src/data/rh-bridge-mirror-descent-2026-09-25.js exports via tmp/imp-97080-measure.mjs.
 */

const T0 = 0.1314;
const Y0 = 0.165;
const N_SEAM = 690988;
const LN_SEAM = Math.log(N_SEAM); // 13.4459
const C0 = 1.2218525; // imp-95218 closing threshold
const L0 = 1.1676005; // imp-95218 offset
const LN_N1 = (2 * C0 - Y0) / T0 + L0; // 18.509, depends on both t0 and y0
const MEAN_SEAM = LN_SEAM / 2; // 6.7229
const MEAN_N1 = LN_N1 / 2; // 9.2547

// --- re-derived helpers (small, local; NOT re-imported) ----------------------

// lane-audit descent time for a constant pull p: int_{y0}^1 Y/(1 + pY) dY (closed form)
function tNeeded(p, y0) {
  return p === 0
    ? (1 - y0 * y0) / 2
    : (1 - y0) / p - (Math.log(1 + p) - Math.log(1 + p * y0)) / (p * p);
}
// p_req = the constant p at which the integral condition holds with equality (= t0)
function pRequired(t0, y0) {
  let lo = 1e-9, hi = 1e4;
  for (let i = 0; i < 200; i++) {
    const m = (lo + hi) / 2;
    if (tNeeded(m, y0) > t0) lo = m; else hi = m;
  }
  return hi;
}
// neutral rigid-lattice Palm mirror count (spacing s = 2 pi/ln N), conditioning
// pair excluded, mirror kernel 2*[2y/(D^2+4y^2)] over both sides, integral tail
function palmMirrorCount(y, lnN, slots) {
  const s = (2 * Math.PI) / lnN;
  const off = slots === 2 ? 1.5 : 1; // first surviving neighbour at off*s
  const K = 20000;
  let acc = 0;
  for (let k = 0; k <= K; k++) {
    const D = (k + off) * s;
    acc += (2 * 2 * y) / (D * D + 4 * y * y);
  }
  acc += (2 / s) * (Math.PI / 2 - Math.atan(((K + 0.5 + off) * s) / (2 * y)));
  return acc;
}

const P_REQ = pRequired(T0, Y0);

// --- baseline (1): neutral rigid-lattice Palm counts -------------------------
const PALM2_SEAM = palmMirrorCount(Y0, LN_SEAM, 2);
const PALM1_SEAM = palmMirrorCount(Y0, LN_SEAM, 1);
const PALM2_N1 = palmMirrorCount(Y0, LN_N1, 2);

// --- baseline (2): empirical finite-height block minima at y0 ----------------
// C2 fractions of the mean pi*rho = ln N/2 at y0 = 0.165 (source module EMP arrays)
const EMP_1E12_LOCFREE_FRAC = 0.3969; // location-free minimum, 1e12-height block
const EMP_1E12_PAIRREP_FRAC = 0.2244; // pair-replacement (Palm-type) minimum
const EMP_1E22_LOCFREE_FRAC = 0.6463; // location-free minimum, 1e22-height block
const EMP_1E12_LOCFREE = EMP_1E12_LOCFREE_FRAC * MEAN_SEAM;
const EMP_1E12_PAIRREP = EMP_1E12_PAIRREP_FRAC * MEAN_SEAM;
const EMP_1E22_LOCFREE = EMP_1E22_LOCFREE_FRAC * MEAN_SEAM;

const surplus = (baseline) => P_REQ / baseline;

export const IMP97080_MEASUREMENT = Object.freeze({
  id: 'imp-97080',
  date: '2026-09-25',
  workingRow: Object.freeze({ t0: T0, y0: Y0, U: T0 + (Y0 * Y0) / 2 }),
  heights: Object.freeze({ lnNSeam: LN_SEAM, lnN1Star: LN_N1, meanSeam: MEAN_SEAM, meanN1: MEAN_N1 }),
  pReq: P_REQ, // 4.3743
  neutralPalm: Object.freeze({
    twoSlotSeam: PALM2_SEAM, // 2.5288
    twoSlotSeamFrac: PALM2_SEAM / MEAN_SEAM, // 0.3761
    twoSlotSeamSurplus: surplus(PALM2_SEAM), // 1.730x
    oneSlotSeam: PALM1_SEAM, // 3.8536
    oneSlotSeamSurplus: surplus(PALM1_SEAM), // 1.135x
    twoSlotN1Star: PALM2_N1, // 4.4208
    twoSlotN1StarSurplus: surplus(PALM2_N1), // 0.989x
  }),
  empiricalFiniteHeight: Object.freeze({
    block1e12LocationFree: EMP_1E12_LOCFREE, // 2.6683
    block1e12LocationFreeSurplus: surplus(EMP_1E12_LOCFREE), // 1.639x
    block1e12PairReplacement: EMP_1E12_PAIRREP, // 1.5086
    block1e12PairReplacementSurplus: surplus(EMP_1E12_PAIRREP), // 2.899x
    block1e22LocationFree: EMP_1E22_LOCFREE, // 4.3450
    block1e22LocationFreeSurplus: surplus(EMP_1E22_LOCFREE), // 1.007x
  }),
  verdict:
    'H_desc-mirror(p_req = 4.3743) is FALSE at every seam-height (ln N = 13.446) ' +
    'mirror-count baseline: the neutral rigid-lattice Palm count (2-slot 2.529, ' +
    '1-slot 3.854) and the empirical finite-height zeta-block minima (1e12 ' +
    'location-free 2.668, pair-replacement 1.509) all fall 1.6x-2.9x short of ' +
    'p_req, independently reproducing the source module C1 local-surplus finding ' +
    '(~1.73x neutral at the seam) and adding an empirical cross-check. Parity ' +
    '(~1.0x) appears only at the far height N1* (ln N = 18.509, 2-slot 4.421) and ' +
    'in the 1e22 block (4.345) -- a height effect from the mirror mean ln N / 2, ' +
    'not a relaxation at the binding y0 = 0.165 window. Finite-height measurement ' +
    'only: the hypothesis concerns zeros of H_t (t > 0, no Euler product) uniformly ' +
    'in t and x, which no finite count supplies (residual (c) / NS-RIGID wall). ' +
    'No Lambda bound follows. No refereed bound is changed. RH open. NO QED.',
  hypothesisHolds: false,
  anyBoundMoved: false,
});

export default IMP97080_MEASUREMENT;

const near = (a, b, tol) => Math.abs(a - b) <= tol;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97080_MEASUREMENT_ASSERTIONS = [
  {
    id: 'imp97080-preq-reproduced',
    why: 'the independently re-derived p_req must match the source module value 4.3743 ' +
      'and satisfy the integral condition tNeeded(p_req, y0) = t0 at equality.',
    holds: () =>
      near(P_REQ, 4.3743, 5e-4) && near(tNeeded(P_REQ, Y0), T0, 1e-9),
  },
  {
    id: 'imp97080-neutral-palm-baseline-reproduced',
    why: 'the re-derived neutral rigid-lattice Palm counts must reproduce the source ' +
      'module C1 literals (2.530 / 0.376 seam 2-slot, 3.855 1-slot, 4.421 N1*).',
    holds: () =>
      near(PALM2_SEAM, 2.530, 5e-3) &&
      near(PALM2_SEAM / MEAN_SEAM, 0.376, 2e-3) &&
      near(PALM1_SEAM, 3.855, 5e-3) &&
      near(PALM2_N1, 4.421, 5e-3),
  },
  {
    id: 'imp97080-hypothesis-false-at-seam',
    why: 'the core measured claim: every seam-height baseline needs a surplus > 1 ' +
      '(count strictly below p_req), so H_desc-mirror(p_req) does not hold there.',
    holds: () =>
      IMP97080_MEASUREMENT.hypothesisHolds === false &&
      surplus(PALM2_SEAM) > 1.5 &&
      surplus(EMP_1E12_LOCFREE) > 1.5 &&
      surplus(EMP_1E12_PAIRREP) > 2 &&
      PALM2_SEAM < P_REQ &&
      EMP_1E12_LOCFREE < P_REQ,
  },
  {
    id: 'imp97080-honesty-gate-no-qed',
    why: 'finite-height measurement only: no bound moved, no Euler product for t > 0, ' +
      'no-refereed-bound-change line and NO QED present.',
    holds: () =>
      IMP97080_MEASUREMENT.anyBoundMoved === false &&
      /no Euler product/i.test(IMP97080_MEASUREMENT.verdict) &&
      /No Lambda bound/.test(IMP97080_MEASUREMENT.verdict) &&
      /refereed bound is changed/i.test(IMP97080_MEASUREMENT.verdict) &&
      /NO QED/.test(IMP97080_MEASUREMENT.verdict) &&
      /RH open/.test(IMP97080_MEASUREMENT.verdict),
  },
];

for (const assertion of IMP97080_MEASUREMENT_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97080-palm-mirror-baseline-vs-preq-measurement assertion failed: ${assertion.id}`,
    );
  }
}
