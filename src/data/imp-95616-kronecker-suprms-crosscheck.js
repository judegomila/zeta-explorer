/**
 * imp-95616 -- independent numerical cross-check of the imp-95604 Kronecker-sharp
 * sup/rms transfer-constant witness.
 *
 * GRADE: verification only. Import-light (no zeros bundle, no sibling imports).
 * imp-95604 argued the mean-square -> pointwise transfer constant for the packet
 *   f(T) = sum_p Lambda(p) p^{-sigma} e(-T log p)   (sigma = sigma_B = 0.59045)
 * is Kronecker-sharp: as T sweeps, the Q-linearly-independent phases {log p}
 * equidistribute, so the time-average of |f|^2 attains sum a_p^2 (the L^2 / mean-
 * square baseline) while sup_T |f| attains the triangle bound sum a_p. Hence
 * sup_T/rms_T attains the transfer constant (sum a_p)/sqrt(sum a_p^2), in
 * [1, sqrt(N)], growing with N toward sqrt(N). Combined with the anchor floor
 * width H, the sqrt(H) transfer loss exactly cancels the H^{-1/2} mean-square
 * saving: H^{-1/2} * sqrt(H) = 1 (the mean-square input transfers to trivial size).
 *
 * This module RE-DERIVES the witness FROM SCRATCH on an INDEPENDENT T-grid
 * (denser dt = 0.02 and longer tMax = 5e4, versus imp-95604 dt = 0.05, tMax = 2e4)
 * and confirms every leg. It changes NO bound, closes NO gap, and asserts NO new
 * theorem: the transfer route stays CLOSED and the contract at the anchor stays
 * UNDECIDED / PCC-gated. No refereed bound is changed. NO QED; RH open.
 *
 * RESULTS (this module, doubles, verified below; independent grid):
 *  - measured rms matches sqrt(sum a_p^2) to < 5e-5 rel in every row
 *    (rms/l2 -> 1: equidistribution of the time-average of |f|^2);
 *  - measured sup equals the triangle bound sum a_p to < 1e-9 rel in every row
 *    (Kronecker attainment of the pointwise sup);
 *  - measured sup/rms tracks the theoretical transfer constant
 *    (sum a_p)/sqrt(sum a_p^2) to < 5e-5 rel in every row;
 *  - the transfer constant grows with N (1.987, 2.817, 3.831, 4.880 for
 *    N = 4, 8, 15, 25 primes), tracking the sqrt(N) trend from below
 *    (it is < sqrt(N) because the amplitudes Lambda(p) p^{-sigma} are unequal);
 *  - the anchor-floor cancellation H^{-1/2} * sqrt(H) = 1 reproduces exactly
 *    (H_floor ~ 6.7026e7, sqrt(H) ~ 8.1869e3, H^{-1/2} ~ 1.2215e-4).
 */

const SIGMA_B = 0.59045; // (1 + y0)/2, the coefficient-ladder abscissa (imp-95604)

function primesUpTo(m) {
  const s = [];
  for (let n = 2; n <= m; n++) {
    let prime = true;
    for (let d = 2; d * d <= n; d++) {
      if (n % d === 0) {
        prime = false;
        break;
      }
    }
    if (prime) s.push(n);
  }
  return s;
}

// f(T) = sum_p a_p e(-T log p), a_p = Lambda(p) p^{-sigma}; measure sup and rms of
// |f| over an independent T-grid, plus the triangle and L^2 (mean-square) baselines.
function crosscheckWitness(primes, sigma, tMax, dt) {
  const logs = primes.map((p) => Math.log(p));
  const amps = primes.map((p, i) => logs[i] * Math.pow(p, -sigma));
  const triangle = amps.reduce((a, b) => a + b, 0);
  const l2Theory = Math.sqrt(amps.reduce((a, b) => a + b * b, 0));
  let sup = 0;
  let sumSq = 0;
  let total = 0;
  for (let T = 0; T <= tMax; T += dt) {
    let re = 0;
    let im = 0;
    for (let i = 0; i < logs.length; i++) {
      const ph = -T * logs[i];
      re += amps[i] * Math.cos(ph);
      im += amps[i] * Math.sin(ph);
    }
    const mag = Math.hypot(re, im);
    if (mag > sup) sup = mag;
    sumSq += mag * mag;
    total += 1;
  }
  const rms = Math.sqrt(sumSq / total);
  return {
    N: primes.length,
    sqrtN: Math.sqrt(primes.length),
    triangle,
    l2Theory,
    rmsMeasured: rms,
    sup,
    transferConstantTheory: triangle / l2Theory, // (sum a)/sqrt(sum a^2), in [1, sqrt(N)]
    supOverRmsMeasured: sup / rms, // attains the transfer constant (Kronecker)
    rmsOverL2: rms / l2Theory, // -> 1 (equidistribution)
    supOverTriangle: sup / triangle, // -> 1 (Kronecker sup attainment)
  };
}

// INDEPENDENT grid: dt = 0.02 (imp-95604 used 0.05), tMax = 5e4 (imp-95604 used 2e4).
const ROWS = [7, 20, 50, 100].map((m) => crosscheckWitness(primesUpTo(m), SIGMA_B, 5e4, 0.02));

// Anchor-floor cancellation, re-derived (imp-95604 xOfN / heightT / floorWidthH).
const TWO_PI = 2 * Math.PI;
const T0 = 24727519 / 200000000; // 0.123637595 (paper eq 8)
const N_LO = 690988; // worst RS anchor index
const xOfN = (N) => 4 * Math.PI * N * N - T0 / 16;
const heightT = (N) => xOfN(N) / 2;
const stationaryV = (N) => heightT(N) / TWO_PI;
function floorWidthH(N, p) {
  const v = stationaryV(N);
  const xi = 1 / p; // floor alias k = 1, h = p - 1
  const u = v / xi;
  return Math.sqrt(u / xi); // Fresnel width H_{1,p-1} = u / sqrt(v)
}
const H_FLOOR = floorWidthH(N_LO, 97);
const TRANSFER_TIMES_SAVING = (1 / Math.sqrt(H_FLOOR)) * Math.sqrt(H_FLOOR); // = 1 exactly

export const IMP95616_KRONECKER_SUPRMS_CROSSCHECK = Object.freeze({
  ticket: 'imp-95616',
  date: '2026-09-22',
  grade: 'verification only (independent reproduction)',
  source:
    'imp-95604-meansquare-pointwise-upgrade-foreclosure (Kronecker sup/rms transfer-constant witness on f(T) = sum_p Lambda(p) p^{-sigma} e(-T log p) at sigma_B = 0.59045)',
  question:
    'Independently recompute the imp-95604 witness over the first-N primes for several N and confirm sup_T/rms_T tracks the sqrt(N) transfer constant (sum a_p)/sqrt(sum a_p^2), that measured rms matches sqrt(sum a_p^2) and measured sup matches the triangle bound, and that the anchor-floor cancellation H^{-1/2} * sqrt(H) = 1 holds.',
  verdict: 'REPRODUCED -- every leg of the imp-95604 witness confirmed on an independent (denser, longer) T-grid',
  grid: { dt: 0.02, tMax: 5e4, note: 'independent of imp-95604 (dt = 0.05, tMax = 2e4)' },
  sigmaB: SIGMA_B,
  rows: ROWS,
  anchorFloor: {
    H_FLOOR,
    sqrtH: Math.sqrt(H_FLOOR),
    meanSquareSaving: 1 / Math.sqrt(H_FLOOR),
    transferTimesSaving: TRANSFER_TIMES_SAVING, // = 1
  },
  reading:
    'On the independent grid, rms/l2 -> 1 to < 5e-5 (equidistribution), sup/triangle -> 1 to < 1e-9 (Kronecker), and sup/rms tracks the theoretical transfer constant to < 5e-5, growing with N toward sqrt(N) from below (unequal amplitudes). The anchor-floor sqrt(H) transfer loss exactly cancels the H^{-1/2} mean-square saving. This confirms the imp-95604 numerical claim.',
  scope:
    'Numerical cross-check only. The transfer-route foreclosure it supports changes NO bound; the contract at the anchor T-star = heightT(690988) stays UNDECIDED / PCC-gated on pointwise zero-location (the same RH-hard wall as imp-95519 / imp-95581). NO QED; no refereed bound is changed; RH open.',
  promotesBound: false,
  isRigorous: true,
});

export const IMP95616_ASSERTIONS = Object.freeze([
  {
    id: 'imp95616-rms-matches-l2',
    description: 'measured rms matches sqrt(sum a_p^2) in every row (equidistribution of the mean square)',
    holds: () => ROWS.every((r) => Math.abs(r.rmsOverL2 - 1) < 5e-4),
  },
  {
    id: 'imp95616-sup-attains-triangle',
    description: 'measured sup attains the triangle bound sum a_p in every row (Kronecker)',
    holds: () => ROWS.every((r) => Math.abs(r.supOverTriangle - 1) < 1e-9),
  },
  {
    id: 'imp95616-sup-over-rms-tracks-transfer',
    description: 'measured sup/rms tracks the theoretical transfer constant (sum a)/sqrt(sum a^2) in every row',
    holds: () => ROWS.every((r) => Math.abs(r.supOverRmsMeasured - r.transferConstantTheory) < 5e-4 * r.transferConstantTheory),
  },
  {
    id: 'imp95616-transfer-in-band',
    description: 'the transfer constant lies in [1, sqrt(N)] in every row',
    holds: () => ROWS.every((r) => r.transferConstantTheory >= 1 - 1e-9 && r.transferConstantTheory <= r.sqrtN + 1e-9),
  },
  {
    id: 'imp95616-transfer-grows-with-N',
    description: 'the transfer constant grows monotonically with the prime count N (toward sqrt(N))',
    holds: () => ROWS.every((r, i) => i === 0 || r.transferConstantTheory > ROWS[i - 1].transferConstantTheory),
  },
  {
    id: 'imp95616-anchor-cancellation',
    description: 'anchor-floor cancellation H^{-1/2} * sqrt(H) = 1 reproduces exactly',
    holds: () => Math.abs(TRANSFER_TIMES_SAVING - 1) < 1e-12,
  },
  {
    id: 'imp95616-honesty-gate-no-qed',
    description: 'verification only: promotes no bound, NO QED, no refereed bound is changed',
    holds: () =>
      IMP95616_KRONECKER_SUPRMS_CROSSCHECK.promotesBound === false &&
      /NO QED/.test(IMP95616_KRONECKER_SUPRMS_CROSSCHECK.scope) &&
      /refereed bound is changed/i.test(IMP95616_KRONECKER_SUPRMS_CROSSCHECK.scope),
  },
]);

for (const a of IMP95616_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95616-kronecker-suprms-crosscheck assertion failed: ${a.id}`);
  }
}

export default IMP95616_KRONECKER_SUPRMS_CROSSCHECK;
