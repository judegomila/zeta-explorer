/**
 * imp-95010 — Pilot assessment of the moving-reference Rouche gluing permutation.
 *
 * Permutation atlas (Permuting the Zeta Twin Ladder, Section 10.1, eq. 44)
 * classifies the MOVING-REFERENCE ROUCHE GLUING as the second possible-gain
 * rearrangement. Route I fixes one rough center C and certifies winding 0 by the
 * global inequality
 *
 *     |F - C| < |C|   on the whole boundary dOmega   ==>   wind F = wind C = 0.
 *
 * The moving-reference variant instead retains the dominant zero-alias pair, the
 * selected prime aliases, the exact gamma factor and the low shells in ONE
 * analytic reference Q that is allowed to VARY along the contour, covers dOmega by
 * overlapping analytic phase charts, and glues by the SAME inequality on each chart:
 *
 *     |F - Q_k| < |Q_k|   on chart k,   Q_k analytic and winding-0,
 *
 * with winding consistency on the overlaps. Because Q need not sit in a fixed
 * half-plane, this is attractive exactly where inter-shell cancellation makes the
 * constant-center budget look too rigid -- the one open family
 * 690988 <= N <= 54799999 (imp-95006), whose strict target is
 * |C_E,17| + r_num < 0.27968819555261474.
 *
 * ASSESSMENT (this module). We build an EXPLICIT pilot chart cover on a faithful
 * toy contour whose structure matches the open family: an analytic 18-moment
 * carrier (dominant pair + gamma + low shells + selected aliases, modes 0..17)
 * PLUS five correlated Fresnel-Airy-like alias packets, scaled so the correlated
 * peak equals the documented |C_E,17| peak 0.2141255 while the shell l1 mass
 * (what a single van der Corput / raw tiling majorant sees) is ~0.92, far past the
 * 0.27968... target -- the imp-95006 divergence, reproduced here.
 *
 * We then compare two winding-0 certifications of the SAME F:
 *   - constant center: subtract the fitted 18-moment carrier once (the Route I
 *     rough center) and read the residual peak W_const = sup|F - carrier|;
 *   - moving reference: eight overlapping charts, each with its own analytic
 *     reference Q_k = carrier + affine drift, read W_move = max_k sup|F - Q_k| and
 *     the chart-wise Rouche margins inf|Q_k| - sup|F - Q_k|.
 *
 * RESULT -- a VALID pilot cover that does NOT relax the budget.
 *   1. The gluing is legitimate: every chart clears |F - Q_k| < |Q_k| with a wide
 *      margin (min inf|Q_k| ~ 0.71 vs max residual ~ 0.22), so the overlap winding
 *      numbers agree and wind F = 0 is certified chart-by-chart. The moving
 *      reference is not obstructed -- it simply is not needed for winding.
 *   2. The budget is NOT relaxed: W_const equals the correlated packet peak
 *      0.2141255 to ~1e-7 (the constant-center 18-moment carrier already removes
 *      the ENTIRE analytic content), and W_move is marginally LARGER, not smaller.
 *      The moving-reference reserve does not exceed the constant-center reserve.
 *   3. Named reason. A moving analytic reference can only subtract ANALYTIC
 *      content, and the 18-moment carrier has already subtracted all of it; the
 *      residual both architectures must bound uniformly is the correlated
 *      alias-packet peak, whose Fourier content sits far above the carrier degree
 *      (the packets oscillate at ~40-60 cycles). The moving freedom (per-chart
 *      affine drift) is spent on already-carried low-order content -- the measured
 *      drift magnitude is ~6e-3 -- and cannot touch the packet residual. This is
 *      the same non-analytic, cancellation-carrying quantity imp-95006 shows a
 *      shell-decoupled majorant cannot fit; the moving reference relaxes a
 *      geometric slack (one enclosing disk -> local disks) that was never binding,
 *      and leaves the binding uniform packet estimate identical.
 *
 * The lever therefore stays on the correlated-phase gates: retain correlated phase
 * across shells (the noncommuting weld [B_v, Pi_p], imp-95008) or a coercive
 * five-shell quadratic form (imp-95007). This is an illustrative finite pilot; it
 * changes no bound and closes no gap (NO QED). No refereed bound is changed.
 */

const M = 1440;
const TWO_PI = 2 * Math.PI;
const theta = Array.from({ length: M }, (_, j) => (TWO_PI * j) / M);

// deterministic PRNG so the pilot is reproducible without any external data
function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rnd = mulberry32(97);

// ── analytic 18-moment carrier: modes 0..17 ────────────────────────────────
// The Route I "rough center" content: dominant zero-alias pair (mode 0/1),
// exact gamma factor and low shells (low modes), selected prime aliases.
const CARRIER_DEG = 17;
const carRe0 = [];
const carIm0 = [];
for (let m = 0; m <= CARRIER_DEG; m++) {
  const amp = m === 0 ? 1.0 : 0.35 / (1 + m);
  const ph = TWO_PI * rnd();
  carRe0.push(amp * Math.cos(ph));
  carIm0.push(amp * Math.sin(ph));
}

// ── five correlated Fresnel-Airy-like alias packets ────────────────────────
// High-frequency, localized, phase-arranged so the correlated sum peak is far
// below the shell l1 mass -- the inter-shell cancellation of imp-95006.
const SHELLS = 5;
const pkCenter = [];
const pkAmp = [];
const pkOmega = [];
const pkPhase = [];
const pkSigma = [];
for (let g = 0; g < SHELLS; g++) {
  pkCenter.push((TWO_PI * (g + 0.5)) / SHELLS + 0.3 * (rnd() - 0.5));
  pkAmp.push(0.1 + 0.05 * rnd());
  pkOmega.push(42 + Math.floor(20 * rnd()));
  pkPhase.push(TWO_PI * rnd());
  pkSigma.push(0.16 + 0.05 * rnd());
}
function wrapPi(d) {
  let x = d;
  while (x > Math.PI) x -= TWO_PI;
  while (x < -Math.PI) x += TWO_PI;
  return x;
}
function packetsRaw(th) {
  let re = 0;
  let im = 0;
  for (let g = 0; g < SHELLS; g++) {
    const d = wrapPi(th - pkCenter[g]);
    const env = pkAmp[g] * Math.exp(-(d * d) / (2 * pkSigma[g] * pkSigma[g]));
    const ph = pkOmega[g] * d + pkPhase[g];
    re += env * Math.cos(ph);
    im += env * Math.sin(ph);
  }
  return [re, im];
}

// scale the packets so the correlated peak = documented |C_E,17| peak 0.2141255
const TARGET = 0.27968819555261474; // strict 18-moment-carrier target
const PEAK = 0.2141255; // measured correlated peak of |C_E,17|
let rawPeak = 0;
for (let j = 0; j < M; j++) {
  const p = packetsRaw(theta[j]);
  rawPeak = Math.max(rawPeak, Math.hypot(p[0], p[1]));
}
const pkScale = PEAK / rawPeak;

// shell l1 majorant mass (the single van der Corput / raw-tiling view)
let l1Mass = 0;
for (let g = 0; g < SHELLS; g++) l1Mass += pkAmp[g] * pkScale; // Gaussian peak = amp

function carrierAt(th) {
  let re = 0;
  let im = 0;
  for (let m = 0; m <= CARRIER_DEG; m++) {
    const c = Math.cos(m * th);
    const s = Math.sin(m * th);
    re += carRe0[m] * c - carIm0[m] * s;
    im += carRe0[m] * s + carIm0[m] * c;
  }
  return [re, im];
}

// ── the contour data F = analytic carrier + correlated packets ─────────────
const Fre = [];
const Fim = [];
for (let j = 0; j < M; j++) {
  const c = carrierAt(theta[j]);
  const p = packetsRaw(theta[j]);
  Fre.push(c[0] + p[0] * pkScale);
  Fim.push(c[1] + p[1] * pkScale);
}

// ── constant-center architecture: subtract the fitted 18-moment carrier once ─
// Fourier projection of F onto modes 0..17 = the Route I rough center.
function projectLowModes(re, im, deg) {
  const akRe = [];
  const akIm = [];
  for (let m = 0; m <= deg; m++) {
    let sr = 0;
    let si = 0;
    for (let j = 0; j < M; j++) {
      const c = Math.cos(m * theta[j]);
      const s = Math.sin(m * theta[j]);
      sr += re[j] * c + im[j] * s;
      si += im[j] * c - re[j] * s;
    }
    akRe.push(sr / M);
    akIm.push(si / M);
  }
  const outRe = [];
  const outIm = [];
  for (let j = 0; j < M; j++) {
    let r = 0;
    let i = 0;
    for (let m = 0; m <= deg; m++) {
      const c = Math.cos(m * theta[j]);
      const s = Math.sin(m * theta[j]);
      r += akRe[m] * c - akIm[m] * s;
      i += akRe[m] * s + akIm[m] * c;
    }
    outRe.push(r);
    outIm.push(i);
  }
  return [outRe, outIm];
}
const [fitRe, fitIm] = projectLowModes(Fre, Fim, CARRIER_DEG);
let W_const = 0;
for (let j = 0; j < M; j++) {
  W_const = Math.max(W_const, Math.hypot(Fre[j] - fitRe[j], Fim[j] - fitIm[j]));
}

// ── moving-reference architecture: K overlapping analytic charts ───────────
// Each chart k carries its own reference Q_k = carrier + affine drift (a_k +
// b_k*(th - th_k)); half-width > pi/K guarantees genuine overlaps to glue on.
const K = 8;
const chartHalf = (TWO_PI / K) * 0.65;
const residRe = Fre.map((v, j) => v - fitRe[j]);
const residIm = Fim.map((v, j) => v - fitIm[j]);
let W_move = 0;
let minInfQ = Infinity;
let maxDrift = 0;
const charts = [];
for (let k = 0; k < K; k++) {
  const thc = (TWO_PI * (k + 0.5)) / K;
  const idx = [];
  for (let j = 0; j < M; j++) {
    const d = wrapPi(theta[j] - thc);
    if (Math.abs(d) <= chartHalf) idx.push([j, d]);
  }
  // least-squares affine tracker of the residual on basis {1, d}
  let s00 = 0;
  let s01 = 0;
  let s11 = 0;
  let b0r = 0;
  let b0i = 0;
  let b1r = 0;
  let b1i = 0;
  for (const [j, d] of idx) {
    s00 += 1;
    s01 += d;
    s11 += d * d;
    b0r += residRe[j];
    b0i += residIm[j];
    b1r += residRe[j] * d;
    b1i += residIm[j] * d;
  }
  const det = s00 * s11 - s01 * s01;
  const a0r = (b0r * s11 - b1r * s01) / det;
  const a0i = (b0i * s11 - b1i * s01) / det;
  const a1r = (b1r * s00 - b0r * s01) / det;
  const a1i = (b1i * s00 - b0i * s01) / det;
  let Wk = 0;
  let infQk = Infinity;
  for (const [j, d] of idx) {
    const qr = fitRe[j] + a0r + a1r * d;
    const qi = fitIm[j] + a0i + a1i * d;
    Wk = Math.max(Wk, Math.hypot(Fre[j] - qr, Fim[j] - qi));
    infQk = Math.min(infQk, Math.hypot(qr, qi));
  }
  const driftMag = Math.hypot(a0r, a0i);
  W_move = Math.max(W_move, Wk);
  minInfQ = Math.min(minInfQ, infQk);
  maxDrift = Math.max(maxDrift, driftMag);
  charts.push({ k, thetaCenter: thc, supResidual: Wk, infQ: infQk, driftMag });
}

const reserveConst = TARGET - W_const;
const reserveMove = TARGET - W_move;
const budgetGain = W_const - W_move; // positive would mean a real relaxation
const gainFracOfReserve = budgetGain / reserveConst;

export const IMP_95010_MOVING_REFERENCE_ROUCHE_GLUING = {
  id: 'imp-95010',
  title: 'Moving-reference Rouche gluing possible-gain family: pilot chart-cover and budget assessment',
  proofSection: 'permutation-architecture',
  equation: 44,
  openFamily: '690988 <= N <= 54799999',
  model: {
    contourSamples: M,
    carrierDegree: CARRIER_DEG,
    shells: SHELLS,
    charts: K,
    chartHalfWidth: chartHalf,
    note:
      'Analytic 18-moment carrier (dominant pair + gamma + low shells + selected ' +
      'aliases, modes 0..17) plus five correlated Fresnel-Airy alias packets scaled ' +
      'to the documented |C_E,17| peak; shell l1 mass reproduces the imp-95006 divergence.',
  },
  targets: {
    strictTarget: TARGET,
    correlatedPeak: PEAK,
    shellL1Mass: l1Mass, // >> TARGET: the single-majorant / raw-tiling view diverges (imp-95006)
  },
  // the pilot chart cover is a VALID winding-0 gluing
  chartCover: {
    charts,
    minInfQ,
    maxSupResidual: W_move,
    roucheGluingValid: minInfQ > W_move, // every chart clears |F - Q_k| < |Q_k|
    maxDrift, // freedom the moving reference actually uses -- spent on carried content
    interpretation:
      'Every chart clears |F - Q_k| < |Q_k| with a wide margin, so the overlap ' +
      'winding numbers agree and wind F = 0 glues chart-by-chart. The moving ' +
      'reference is not obstructed; it is simply not needed for the winding.',
  },
  // but it does NOT relax the enclosure budget
  budget: {
    constantCenterResidual: W_const, // == correlated packet peak to ~1e-7
    movingReferenceResidual: W_move, // marginally LARGER, not smaller
    reserveConst,
    reserveMove,
    budgetGain, // <= 0: no relaxation
    gainFracOfReserve, // <= 0: does not open the 0.0655627 reserve
    relaxesBudget: budgetGain > 1e-4,
  },
  obstruction: {
    name: 'analytic-carrier redundancy of the moving reference',
    statement:
      'A moving analytic reference Q can only subtract analytic content, and the ' +
      'constant-center 18-moment carrier has already subtracted all of it (W_const ' +
      'equals the correlated packet peak). The residual both architectures must ' +
      'bound uniformly over the open family is the correlated alias-packet peak, ' +
      'whose Fourier content sits far above the carrier degree, so no per-chart ' +
      'analytic reference tracks it: the moving freedom is spent on already-carried ' +
      'low-order content (drift ~ ' + maxDrift.toExponential(3) + ') and the budget ' +
      'is unchanged. This is the same non-analytic, cancellation-carrying quantity ' +
      'imp-95006 shows a shell-decoupled majorant cannot fit.',
    routesLever:
      'retain correlated phase across shells (the noncommuting weld [B_v, Pi_p], ' +
      'imp-95008) or a coercive five-shell quadratic form (imp-95007), not a change ' +
      'of reference.',
  },
  verdict:
    'PILOT + NAMED REASON on a faithful finite model: the moving-reference Rouche ' +
    'gluing produces a VALID winding-0 chart cover (min inf|Q_k| ~ ' +
    minInfQ.toFixed(3) + ' vs max residual ~ ' + W_move.toFixed(3) + '), yet does NOT ' +
    'relax the enclosure budget -- the constant-center 18-moment carrier already ' +
    'removes the whole analytic content, so both architectures face the identical ' +
    'correlated packet residual (budget gain ' + budgetGain.toExponential(2) + ', ' +
    'reserve not opened). Changes no bound; closes no gap; NO QED. ' +
    'No refereed bound is changed.',
};

// ── assertions (import-light; no heavy bundle) ─────────────────────────────
export const IMP_95010_ASSERTIONS = [
  {
    id: 'imp-95010-shell-l1-mass-diverges',
    holds: () => l1Mass > TARGET,
    why: 'The shell l1 majorant mass (single van der Corput / raw-tiling view) far exceeds the strict target, reproducing the imp-95006 divergence the correlated peak avoids only through inter-shell cancellation.',
  },
  {
    id: 'imp-95010-constant-center-recovers-packet-peak',
    holds: () => Math.abs(W_const - PEAK) < 1e-4,
    why: 'Subtracting the fitted 18-moment carrier once leaves exactly the correlated packet peak: the constant-center architecture already removes the whole analytic content, so there is no analytic content left for a moving reference to subtract.',
  },
  {
    id: 'imp-95010-chart-cover-glues',
    holds: () => minInfQ > W_move,
    why: 'Every chart clears |F - Q_k| < |Q_k| (min inf|Q_k| exceeds the max per-chart residual), so the moving-reference winding numbers agree on overlaps and wind F = 0 glues -- the pilot cover is a valid winding-0 certification.',
  },
  {
    id: 'imp-95010-moving-reference-does-not-relax-budget',
    holds: () => budgetGain <= 1e-4,
    why: 'The moving-reference residual is not smaller than the constant-center residual by any proof-relevant amount (in fact marginally larger): the moving freedom is spent on already-carried low-order content and cannot track the high-frequency correlated packet peak, so the 0.0655627 reserve is not opened.',
  },
];

export default IMP_95010_MOVING_REFERENCE_ROUCHE_GLUING;
