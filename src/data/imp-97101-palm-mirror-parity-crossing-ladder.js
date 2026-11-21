/**
 * @module imp-97101-palm-mirror-parity-crossing-ladder
 *
 * imp-97101 (accuracy): extend the imp-97080 neutral rigid-lattice Palm
 * mirror-count baseline across a ladder of seam-density heights ln N and pin
 * the parity-crossing height where the count reaches p_req = 4.3743, to test
 * the imp-97080 "height effect, not hypothesis relaxation" reading precisely.
 *
 * CONTEXT (from imp-97080): the conditional theorem B1 of
 * rh-bridge-mirror-descent-2026-09-25 needs a topmost-within-2 nonreal zero of
 * H_t at y0 = 0.165 to receive mirror-count M >= p_req = 4.3743 (the constant
 * pull at which int_{y0}^1 dY/(1/Y + p) = t0 = 0.1314 at equality). imp-97080
 * measured the neutral rigid-lattice Palm baseline at two heights only -- the
 * seam ln N = 13.446 (2-slot count 2.529, surplus 1.730x -> hypothesis FALSE)
 * and the far height N1* ln N = 18.509 (count 4.421, surplus 0.989x -> parity)
 * -- and attributed the ~1.0x parity at N1* to the mirror mean growing like
 * ln N / 2, i.e. "a height effect, not a relaxation at the binding y0 window".
 *
 * WHAT THIS LEAF ADDS: the neutral Palm 2-slot / 1-slot count is a deterministic
 * function of the seam density ln N (spacing s = 2 pi / ln N, conditioning pair
 * excluded, mirror kernel 2*[2y/(D^2+4y^2)] both sides, exact atan tail). This
 * module TABULATES that count across an 11-rung ladder ln N in [13.446, 22],
 * records the fraction of the mean (count / (ln N / 2)) and the surplus factor
 * p_req / count at each rung, and pins the exact parity-crossing height by
 * bisection.
 *
 * RESULT (y0 = 0.165, p_req = 4.37426):
 *   ln N     N          palm2    frac    surplus
 *   13.4459  6.91e5     2.5288   0.3761  1.7298   (seam; imp-97080 anchor)
 *   16.0000  8.89e6     3.4429   0.4304  1.2705
 *   18.0000  6.57e7     4.2169   0.4685  1.0373
 *   18.3936  9.73e7     4.3743   0.4757  1.0000   (<- 2-slot parity crossing)
 *   18.5093  1.09e8     4.4208   0.4777  0.9895   (N1*; imp-97080 anchor)
 *   20.0000  4.85e8     5.0317   0.5032  0.8693
 *   22.0000  3.59e9     5.8798   0.5345  0.7439
 *   2-slot parity crossing: ln N* = 18.39359  (N* = 9.7327e7)
 *   1-slot parity crossing: ln N* = 14.56925  (N* = 2.1249e6)
 *
 * VERDICT: the 2-slot Palm count grows nearly linearly in ln N (slope
 * ~0.395 d(palm2)/d(ln N)), so the surplus factor falls MONOTONICALLY through
 * 1.73x (seam) to 1.0x at ln N* = 18.394 -- just below N1* = 18.509 -- and on to
 * 0.74x by ln N = 22. This confirms and sharpens the imp-97080 reading: the
 * count reaches p_req purely because the mirror mean (~ln N / 2) grows with
 * height, crossing p_req at ln N* ~= 18.39. It is NOT a relaxation at the binding
 * y0 = 0.165 window -- the fraction of the mean stays well below 1 throughout the
 * ladder (0.376 at the seam, 0.476 at the crossing, 0.535 at ln N = 22), never
 * approaching the full mean. The binding seam window (ln N = 13.446) remains
 * 1.73x short: reaching parity demands climbing ~5 units of ln N (a factor ~140
 * in N), a height effect.
 *
 * HONEST STATUS: neutral rigid-lattice / t = 0-proxy measurement only. The
 * hypothesis H_desc-mirror concerns zeros of H_t for t in (0, t0], which carry
 * NO Euler product, and no finite-height count supplies a uniform-in-t, all-x
 * lower bound (residual (c) of the source module, the NS-RIGID wall). A larger
 * ln N is a taller lattice, not a proof the topmost zero at y0 receives that pull
 * uniformly. No Lambda bound follows. No refereed bound is changed. RH open.
 * NO QED.
 *
 * @see imp-97080-palm-mirror-baseline-vs-preq-measurement.js (two-height anchor)
 * @see rh-bridge-mirror-descent-2026-09-25.js (theorem B1, p_req, C1 Palm baseline)
 *
 * Import-free (self-contained re-derivation of the identical helpers). Anchors
 * cross-checked against imp-97080 (seam 2.5288 / N1* 4.4208).
 */

const T0 = 0.1314;
const Y0 = 0.165;
const N_SEAM = 690988;
const LN_SEAM = Math.log(N_SEAM); // 13.4459
const C0 = 1.2218525; // imp-95218 closing threshold
const L0 = 1.1676005; // imp-95218 offset
const LN_N1 = (2 * C0 - Y0) / T0 + L0; // 18.5093

// lane-audit descent time for a constant pull p: int_{y0}^1 Y/(1 + pY) dY
function tNeeded(p, y0) {
  return p === 0
    ? (1 - y0 * y0) / 2
    : (1 - y0) / p - (Math.log(1 + p) - Math.log(1 + p * y0)) / (p * p);
}
// p_req = the constant pull at which the integral condition holds with equality
function pRequired(t0, y0) {
  let lo = 1e-9, hi = 1e4;
  for (let i = 0; i < 200; i++) {
    const m = (lo + hi) / 2;
    if (tNeeded(m, y0) > t0) lo = m; else hi = m;
  }
  return hi;
}
// neutral rigid-lattice Palm mirror count (spacing s = 2 pi/ln N), conditioning
// pair excluded, mirror kernel 2*[2y/(D^2+4y^2)] over both sides, exact atan tail
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
// exact parity-crossing height: the ln N at which palm(slots) = p_req
function parityCrossingLnN(pReq, slots) {
  let lo = 3, hi = 60;
  for (let i = 0; i < 200; i++) {
    const m = (lo + hi) / 2;
    if (palmMirrorCount(Y0, m, slots) < pReq) lo = m; else hi = m;
  }
  return hi;
}

const P_REQ = pRequired(T0, Y0); // 4.37426

// --- the ladder -------------------------------------------------------------
const LADDER_LNN = [LN_SEAM, 14, 15, 16, 17, 18, LN_N1, 19, 20, 21, 22];
const LADDER = LADDER_LNN.map((lnN) => {
  const count2 = palmMirrorCount(Y0, lnN, 2);
  return Object.freeze({
    lnN,
    N: Math.exp(lnN),
    mean: lnN / 2,
    palm2: count2,
    frac: count2 / (lnN / 2),
    surplus: P_REQ / count2,
  });
});

const CROSS2 = parityCrossingLnN(P_REQ, 2); // 18.3936
const CROSS1 = parityCrossingLnN(P_REQ, 1); // 14.5692

// nearly-linear growth slope d(palm2)/d(ln N) over the ladder span
const SLOPE = (palmMirrorCount(Y0, 22, 2) - palmMirrorCount(Y0, 14, 2)) / 8;

export const IMP97101_LADDER = Object.freeze({
  id: 'imp-97101',
  date: '2026-09-25',
  workingRow: Object.freeze({ t0: T0, y0: Y0 }),
  pReq: P_REQ, // 4.37426
  ladder: Object.freeze(LADDER),
  parityCrossing: Object.freeze({
    twoSlotLnN: CROSS2, // 18.39359
    twoSlotN: Math.exp(CROSS2), // 9.7327e7
    twoSlotFracAtCrossing: palmMirrorCount(Y0, CROSS2, 2) / (CROSS2 / 2), // 0.4757
    oneSlotLnN: CROSS1, // 14.56925
    oneSlotN: Math.exp(CROSS1), // 2.1249e6
  }),
  growthSlope: SLOPE, // ~0.395 d(palm2)/d(ln N): nearly linear in ln N
  verdict:
    'The neutral rigid-lattice Palm 2-slot mirror count grows nearly linearly in ' +
    'ln N (slope ~0.395), so the surplus p_req/count falls MONOTONICALLY through ' +
    '1.730x (seam ln N = 13.446) to 1.0x at the 2-slot parity crossing ln N* = ' +
    '18.394 (N* = 9.73e7), just below N1* = 18.509 (imp-97080 0.989x), and on to ' +
    '0.744x by ln N = 22. This confirms and sharpens the imp-97080 reading: parity ' +
    'is reached purely because the mirror mean (~ln N / 2) grows with height -- it ' +
    'is NOT a relaxation at the binding y0 = 0.165 window, because the fraction of ' +
    'the mean stays well below 1 across the whole ladder (0.376 seam, 0.476 at the ' +
    'crossing, 0.535 at ln N = 22). The binding seam window stays 1.73x short; ' +
    'parity demands climbing ~5 units of ln N (a factor ~140 in N), a height ' +
    'effect. Neutral rigid-lattice / t = 0-proxy measurement only: the hypothesis ' +
    'concerns zeros of H_t (t > 0, no Euler product) uniformly in t and x, which no ' +
    'finite count supplies (residual (c) / NS-RIGID wall). No Lambda bound follows. ' +
    'No refereed bound is changed. RH open. NO QED.',
  hypothesisHolds: false,
  anyBoundMoved: false,
});

export default IMP97101_LADDER;

const near = (a, b, tol) => Math.abs(a - b) <= tol;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97101_LADDER_ASSERTIONS = [
  {
    id: 'imp97101-preq-and-anchors-reproduced',
    why: 'p_req and the two imp-97080 neutral Palm anchors (seam 2.5288, N1* 4.4208) ' +
      'must reproduce exactly from the re-derived helpers.',
    holds: () =>
      near(P_REQ, 4.3743, 5e-4) &&
      near(palmMirrorCount(Y0, LN_SEAM, 2), 2.5288, 5e-4) &&
      near(palmMirrorCount(Y0, LN_N1, 2), 4.4208, 5e-4),
  },
  {
    id: 'imp97101-surplus-monotone-decreasing',
    why: 'the core tabulation claim: the surplus factor falls monotonically with ' +
      'ln N across the ladder (crossing 1 exactly once).',
    holds: () =>
      LADDER.every((r, i) => i === 0 || LADDER[i - 1].surplus > r.surplus) &&
      LADDER[0].surplus > 1 &&
      LADDER[LADDER.length - 1].surplus < 1,
  },
  {
    id: 'imp97101-parity-crossing-pinned',
    why: 'the 2-slot parity crossing sits at ln N* ~= 18.394 (just below N1* = ' +
      '18.509) where the count equals p_req, and the 1-slot crossing at ln N* ~= 14.569.',
    holds: () =>
      near(CROSS2, 18.3936, 2e-3) &&
      CROSS2 < LN_N1 &&
      near(palmMirrorCount(Y0, CROSS2, 2), P_REQ, 1e-6) &&
      near(CROSS1, 14.5692, 2e-3),
  },
  {
    id: 'imp97101-height-effect-not-relaxation',
    why: 'the fraction of the mean stays well below 1 across the whole ladder ' +
      '(height effect, not y0-window relaxation), and the growth is nearly linear.',
    holds: () =>
      LADDER.every((r) => r.frac < 0.6) &&
      LADDER[0].frac < 0.4 &&
      near(SLOPE, 0.395, 1e-2),
  },
  {
    id: 'imp97101-honesty-gate-no-qed',
    why: 'neutral rigid-lattice measurement only: no bound moved, no Euler product ' +
      'for t > 0, no-refereed-bound-change line and NO QED present.',
    holds: () =>
      IMP97101_LADDER.anyBoundMoved === false &&
      IMP97101_LADDER.hypothesisHolds === false &&
      /no Euler product/i.test(IMP97101_LADDER.verdict) &&
      /No Lambda bound/.test(IMP97101_LADDER.verdict) &&
      /refereed bound is changed/i.test(IMP97101_LADDER.verdict) &&
      /NO QED/.test(IMP97101_LADDER.verdict) &&
      /RH open/.test(IMP97101_LADDER.verdict),
  },
];

for (const assertion of IMP97101_LADDER_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97101-palm-mirror-parity-crossing-ladder assertion failed: ${assertion.id}`,
    );
  }
}
