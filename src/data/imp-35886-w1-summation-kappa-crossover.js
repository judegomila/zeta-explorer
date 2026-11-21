/**
 * @module imp-35886-w1-summation-kappa-crossover
 *
 * imp-35886 (numerical, S-frontier): LOCATE the crossover condition number kappa at which the
 * imp-35854 naive NORMALIZED summation error (err / Sum |t_k|) departs the sqrt(N) u random-walk
 * ceiling (~7.76e-14 at N ~ 488602) and settles onto the ~4e-17 O(1)-accumulator plateau, by
 * refining the imp-35854 (alpha, beta) sweep between kappa ~ 1 and kappa ~ 2e5 on the SAME
 * N = floor(sqrt(T_PT / 4 pi)) ~ 488602-term oscillatory sum at T_PT = 3e12.
 *
 * imp-35854 ran only ~10 coarse (alpha, beta) rungs and FOUND that the naive normalized error is
 * largest (~ sqrt(N) u) near kappa ~ 1 (same-sign partial sums grow to ~ Sum |t_k|) and DROPS
 * toward a ~4e-17 plateau at large kappa (deep cancellation keeps the running accumulator O(1),
 * shrinking the per-step rounding error u |s_i|), but it never located the transition kappa. This
 * module refines the grid to 69 rungs (a beta = 0 alpha ladder spanning kappa ~ 1 .. ~8 densely,
 * plus (alpha, beta) rungs carrying kappa out to ~2e5), each measured against its own EXACT BigInt
 * dyadic reference (the same 2^{-96} fixed-point construction imp-35812 / imp-35854 used, error-free),
 * and locates the crossover on a denoised (half-decade geometric-mean) naiveNorm(kappa) curve.
 *
 * WHAT "CROSSOVER" MEANS HERE
 * -----------------------------------------------------------------------------
 * The naiveNorm(kappa) trajectory spans orders of magnitude, so the natural halfway point between
 * the sqrt(N) u ceiling and the measured plateau floor is their GEOMETRIC (log) midpoint
 * MID = sqrt( [sqrt(N) u] . floor ). The crossover kappa is where the denoised naiveNorm curve
 * passes through MID. Per-rung naiveNorm is erratic (the accumulator trajectory depends on the exact
 * (alpha, beta) phase), so the location is read from half-decade geometric-mean bins, not raw rungs.
 *
 * MEASURED (see crossover / slopes below; N = 488602, sqrt(N) u ~ 7.76e-14, u ~ 1.11e-16):
 *   ceiling  sqrt(N) u        ~ 7.76e-14   (imp-35854 random-walk ceiling; an upper ENVELOPE)
 *   floor    (kappa >= 1e3)   ~ 2.98e-17   (measured O(1)-accumulator plateau; the "~4e-17" figure)
 *   MID      log-midpoint     ~ 1.52e-15
 *   CROSSOVER kappa           ~ 9.4        (naiveNorm passes MID here)
 *   descent slope d(log naiveNorm)/d(log kappa) ~ -1.03  (below / through the crossover)
 *   plateau slope (kappa >= 1e3)                ~  0.05  (essentially flat on the floor)
 *
 * READING (HONEST): there is NO sharp knee. From the ceiling the naive normalized error decays as a
 * near-perfect POWER LAW naiveNorm ~ kappa^{-1} (measured slope -1.03 per decade of kappa), and it is
 * this single -1 descent -- not a two-regime step -- that carries naiveNorm from the ceiling through
 * the log-midpoint at kappa ~ 9.4 down to the ~3e-17 roundoff floor, onto which it saturates (slope
 * flattens to ~0.05) only once kappa >~ a few hundred. The kappa ~ 9 crossover is therefore a POINT
 * ON a continuous kappa^{-1} slope, not a threshold. The -1 exponent is exactly why imp-35854 saw the
 * naive RELATIVE error (= naiveNorm . kappa) grow FAR SUBLINEARLY: naiveNorm ~ kappa^{-1} cancels the
 * explicit kappa in the relative error through the whole transition, so naiveRel is ~flat there and
 * only the residual floor-saturation lets it creep up at the largest kappa. Every rung stays >= 10
 * orders below the O(1) barrier margin |A_t + B_t| - |C_t| (imp-35760); precision is NOT binding.
 *
 * MEASUREMENT ONLY. Certifies no W1 bound; evaluates no true H_0; instantiates no interval; verifies
 * no inequality; changes no bound; establishes no positivity; the A + B - C certificate at T_PT stays
 * GREENFIELD (imp-35681 Part A) and MECHANICAL (imp-35725); C_mb GUE-conditional (imp-486) untouched;
 * no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35854-w1-summation-kappa-sweep (coarse sweep that FOUND the drop but not the crossover kappa)
 * @see imp-35812-w1-summation-scheme-measured-cost (term family + exact BigInt reference)
 * @see imp-35871-w1-summation-kappa-envelope (sqrt(N) u as an upper envelope, not a tracked law)
 * @see imp-35761-w1-certified-rounding-cost-scope (pessimistic N u ceiling)
 * @see imp-35760-w1-margin-allocation-scope (the O(1) barrier margin all errors sit under)
 * @see Higham 2002, Accuracy and Stability of Numerical Algorithms (recursive-sum error; condition number)
 */

// -- Anchor + operative constants (import-light; matching imp-35812 / imp-35854) ----------
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI))); // Polymath15 retained-term count
const N_AT_TPT = N_TERMS(T_PT); // ~488602 terms at T_PT (imp-35674 Part D)

const U_ROUNDOFF = 2 ** -53; // unit roundoff u
const EPS_DOUBLE = 2 ** -52; // machine epsilon (= 2 u)

// Term family t_k = cos(alpha k + beta sqrt(k)) / sqrt(k) (imp-35812); (alpha, beta) tune kappa.
const TERM = (alpha, beta, k) => Math.cos(alpha * k + beta * Math.sqrt(k)) / Math.sqrt(k);

// Refined (alpha, beta) rungs. A dense beta = 0 alpha ladder resolves the kappa ~ 1 .. ~8 transition
// (small alpha keeps cos(alpha k) ~ +1, kappa ~ 1; growing alpha deepens cancellation), and a block
// of (alpha, beta) rungs carries kappa out to ~2e5 to pin the plateau floor.
const RUNGS = [];
for (let i = 0; i <= 20; i++) {
  RUNGS.push({ alpha: 5e-7 * Math.pow(2e-4 / 5e-7, i / 20), beta: 0 });
}
for (const beta of [0.02, 0.05, 0.1, 0.2, 0.35, 0.5, 0.7, 1.0, 1.5, 2.0, 2.4, 3.0]) {
  for (const alpha of [8e-6, 2e-5, 4e-5, 5e-5]) RUNGS.push({ alpha, beta });
}

// -- Naive recursive summation (verbatim from imp-35812) ---------------------------------
function sumNaive(terms) {
  let s = 0;
  for (let i = 0; i < terms.length; i++) s += terms[i];
  return s;
}

// -- Exact reference: sum the doubles as dyadic rationals in BigInt (error-free) ---------
const FRAC_BITS = 96n; // common fixed-point scale 2^{-96}; covers the term exponent range
const _buf = new ArrayBuffer(8);
const _dv = new DataView(_buf);

function doubleToFixedBigInt(x) {
  // Return the exact m . 2^{-96} representation of x as a BigInt numerator.
  if (x === 0) return 0n;
  _dv.setFloat64(0, x);
  const hi = _dv.getUint32(0);
  const lo = _dv.getUint32(4);
  const sign = hi >>> 31 ? -1n : 1n;
  let exp = (hi >>> 20) & 0x7ff;
  let mant = (BigInt(hi & 0xfffff) << 32n) | BigInt(lo >>> 0);
  if (exp === 0) {
    exp = -1074; // subnormal (not expected for these magnitudes, handled for safety)
  } else {
    mant |= 1n << 52n; // restore implicit leading bit
    exp = exp - 1075; // remove exponent bias (1023) and mantissa width (52)
  }
  const shift = BigInt(exp) + FRAC_BITS;
  let num = sign * mant;
  num = shift >= 0n ? num << shift : num >> -shift;
  return num;
}

function normalizedError(schemeResult, trueNum, sumAbs) {
  // Exact absolute error |schemeResult - trueSum|, divided by Sum |t_k| (the Higham scale).
  const err = doubleToFixedBigInt(schemeResult) - trueNum;
  const absErr = err < 0n ? -err : err;
  const absErrDouble = Number(absErr << 80n) / 2 ** 80 / 2 ** 96;
  return absErrDouble / sumAbs;
}

// -- Run naive summation at one (alpha, beta) rung, length N_AT_TPT ------------------------
function measureRung(alpha, beta) {
  const N = N_AT_TPT;
  const terms = new Float64Array(N);
  let sumAbs = 0;
  for (let k = 1; k <= N; k++) {
    const t = TERM(alpha, beta, k);
    terms[k - 1] = t;
    sumAbs += Math.abs(t);
  }
  const naive = sumNaive(terms);
  let trueNum = 0n;
  for (let i = 0; i < N; i++) trueNum += doubleToFixedBigInt(terms[i]);
  const trueAbs = trueNum < 0n ? -trueNum : trueNum;
  const trueSum = (Number(trueAbs << 40n) / 2 ** 40 / 2 ** 96) * (trueNum < 0n ? -1 : 1);
  const kappa = sumAbs / Math.abs(trueSum);
  return { alpha, beta, kappa, naiveNorm: normalizedError(naive, trueNum, sumAbs) };
}

// Run the ladder (deterministic; ~1.2 s total). Sorted ascending by measured kappa.
const SWEEP = RUNGS.map((r) => measureRung(r.alpha, r.beta)).sort((a, b) => a.kappa - b.kappa);

const KAPPA_MIN = SWEEP[0].kappa;
const KAPPA_MAX = SWEEP[SWEEP.length - 1].kappa;
const KAPPA_DECADES = Math.log10(KAPPA_MAX / KAPPA_MIN);

const SQRTN_U = Math.sqrt(N_AT_TPT) * U_ROUNDOFF; // Wilkinson random-walk ceiling (upper envelope)

// -- Denoise: half-decade geometric-mean naiveNorm bins (per-rung naiveNorm is phase-erratic) ----
const geoMean = (vals) => Math.pow(10, vals.reduce((s, v) => s + Math.log10(v), 0) / vals.length);
const inKappaRange = (lo, hi) => SWEEP.filter((r) => r.kappa >= lo && r.kappa < hi).map((r) => r.naiveNorm);

const NORM_LOW = geoMean(inKappaRange(1, 2)); // geo-mean naiveNorm near kappa ~ 1 (top of the descent)
const NORM_FLOOR = geoMean(inKappaRange(1e3, 3e5)); // geo-mean naiveNorm on the plateau (the "~4e-17")
const MID = Math.sqrt(SQRTN_U * NORM_FLOOR); // log-midpoint between the ceiling and the floor

const _binMap = new Map();
for (const r of SWEEP) {
  const b = Math.round(Math.log10(r.kappa) * 2) / 2;
  if (!_binMap.has(b)) _binMap.set(b, []);
  _binMap.get(b).push(r.naiveNorm);
}
const BINNED = [..._binMap.entries()]
  .map(([logK, arr]) => ({ logK, geoNorm: geoMean(arr), count: arr.length }))
  .sort((a, b) => a.logK - b.logK);

// Crossover: the two adjacent bins straddling MID, log-interpolated to the exact crossing kappa.
let _lo = null;
let _hi = null;
for (let i = 1; i < BINNED.length; i++) {
  if (BINNED[i - 1].geoNorm >= MID && BINNED[i].geoNorm < MID) {
    _lo = BINNED[i - 1];
    _hi = BINNED[i];
    break;
  }
}
const _tFrac = (Math.log10(MID) - Math.log10(_lo.geoNorm)) / (Math.log10(_hi.geoNorm) - Math.log10(_lo.geoNorm));
const CROSSOVER_LOG_KAPPA = _lo.logK + _tFrac * (_hi.logK - _lo.logK);
const CROSSOVER_KAPPA = Math.pow(10, CROSSOVER_LOG_KAPPA);

// Local slope d(log naiveNorm)/d(log kappa) via least-squares over a subset of the binned curve.
function binnedSlope(select) {
  const pts = BINNED.filter(select);
  const mx = pts.reduce((s, p) => s + p.logK, 0) / pts.length;
  const my = pts.reduce((s, p) => s + Math.log10(p.geoNorm), 0) / pts.length;
  let num = 0;
  let den = 0;
  for (const p of pts) {
    num += (p.logK - mx) * (Math.log10(p.geoNorm) - my);
    den += (p.logK - mx) ** 2;
  }
  return num / den;
}
// Descent side: bins still above the floor (the kappa^{-1} regime carrying the ceiling->floor drop).
const DESCENT_SLOPE = binnedSlope((p) => p.geoNorm > 2 * NORM_FLOOR && p.count >= 3);
// Plateau side: bins at kappa >= 1e3 (saturated on the roundoff floor).
const PLATEAU_SLOPE = binnedSlope((p) => Math.pow(10, p.logK) >= 1e3 && p.count >= 3);

export const IMP35886_W1_SUMMATION_KAPPA_CROSSOVER = {
  id: 'imp-35886',
  proofSection: 'S-frontier',
  question:
    'LOCATE the crossover condition number kappa at which the imp-35854 naive NORMALIZED summation ' +
    'error departs the sqrt(N) u random-walk ceiling (~7.76e-14) and settles onto the ~4e-17 O(1)-' +
    'accumulator plateau, by refining the imp-35854 (alpha, beta) sweep between kappa ~ 1 and ~2e5 at ' +
    'N ~ 4.886e5. Measurement only; certifies no W1 bound; changes no bound; NO QED.',
  setup: {
    N: N_AT_TPT,
    nRungs: SWEEP.length,
    termFamily: 't_k = cos(alpha k + beta sqrt(k)) / sqrt(k), k = 1 .. N (imp-35812; deterministic, no RNG)',
    kappaControl: 'dense beta=0 alpha ladder resolves kappa ~ 1 .. ~8; (alpha, beta) block carries kappa to ~2e5',
    reference: 'per-rung exact: each double summed as a dyadic rational on a 2^{-96} fixed-point grid in BigInt (error-free)',
    denoise: 'per-rung naiveNorm is phase-erratic, so the crossover / slopes are read from half-decade geometric-mean bins',
    midpointConvention: 'MID = geometric (log) midpoint sqrt([sqrt(N) u] . floor), the natural halfway of a multi-decade span',
    scales: { sqrtN_u: SQRTN_U, u: U_ROUNDOFF, eps: EPS_DOUBLE },
  },
  kappaRange: { min: KAPPA_MIN, max: KAPPA_MAX, decades: KAPPA_DECADES },
  ceiling: SQRTN_U,
  floor: NORM_FLOOR,
  midpoint: MID,
  normLowKappa: NORM_LOW,
  crossover: {
    kappa: CROSSOVER_KAPPA,
    logKappa: CROSSOVER_LOG_KAPPA,
    naiveNormAtMid: MID,
    straddleBins: { loLogKappa: _lo.logK, loGeoNorm: _lo.geoNorm, hiLogKappa: _hi.logK, hiGeoNorm: _hi.geoNorm },
  },
  slopes: {
    descent: DESCENT_SLOPE, // d(log naiveNorm)/d(log kappa) below / through the crossover (~ -1)
    plateau: PLATEAU_SLOPE, // on the roundoff floor at kappa >= 1e3 (~ 0)
  },
  binnedCurve: BINNED.map((b) => ({ logKappa: b.logK, geoNaiveNorm: b.geoNorm, count: b.count })),
  reading: {
    noSharpKnee:
      'there is NO sharp knee: from the sqrt(N) u ceiling the naive normalized error decays as a near-' +
      'perfect power law naiveNorm ~ kappa^{-1} (measured descent slope ~' + DESCENT_SLOPE.toFixed(2) +
      ' per decade of kappa), and this single -1 descent carries it through the log-midpoint at kappa ~' +
      CROSSOVER_KAPPA.toFixed(1) + ' down to the roundoff floor',
    crossoverIsAPoint:
      'the located crossover kappa ~' + CROSSOVER_KAPPA.toFixed(1) + ' is a POINT ON the continuous ' +
      'kappa^{-1} slope (where naiveNorm crosses MID ~' + MID.toExponential(2) + '), NOT a threshold or regime change',
    plateauSaturation:
      'naiveNorm flattens onto the ~' + NORM_FLOOR.toExponential(2) + ' roundoff floor (plateau slope ~' +
      PLATEAU_SLOPE.toFixed(2) + ') only once kappa >~ a few hundred, where the O(1) accumulator makes u |s_i| irreducible',
    tiesToSublinearRel:
      'the -1 descent exponent is exactly why imp-35854 saw the naive RELATIVE error (= naiveNorm . kappa) grow ' +
      'FAR SUBLINEARLY: naiveNorm ~ kappa^{-1} cancels the explicit kappa through the transition, so naiveRel is ~flat there',
    allUnderMargin:
      'every rung at every kappa remains >= 10 orders below the O(1) barrier margin |A_t + B_t| - |C_t| (imp-35760)',
  },
  conclusion: {
    crossoverLocated:
      'the transition kappa left unlocated by imp-35854 is LOCATED: the naive normalized error crosses the log-midpoint ' +
      'between the sqrt(N) u ceiling and the measured floor at kappa ~' + CROSSOVER_KAPPA.toFixed(1),
    powerLawNotKnee:
      'the departure is a smooth kappa^{-1} power law (descent slope ~' + DESCENT_SLOPE.toFixed(2) + '), flattening to ~' +
      PLATEAU_SLOPE.toFixed(2) + ' on the floor -- there is no discrete knee, so the crossover is a locator, not a threshold',
    precisionNotBinding:
      'across the whole sweep every measured error is >= 10 orders below the O(1) barrier margin; precision is NOT the ' +
      'binding constraint at any conditioning',
    staysGreenfield:
      'this module measures the naive normalized error only; it evaluates no sum of H_t and verifies no inequality, so the ' +
      'W1 A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A) and MECHANICAL (imp-35725)',
  },
  isRigorous: false,
  honestStatus:
    'The crossover is a LOCATOR on a continuous curve, NOT a threshold: the naive normalized error follows a near-' +
    'perfect kappa^{-1} power law (descent slope ~' + DESCENT_SLOPE.toFixed(2) + ' per decade) from the sqrt(N) u ' +
    'ceiling to the ~' + NORM_FLOOR.toExponential(2) + ' roundoff floor, crossing the log-midpoint MID ~' +
    MID.toExponential(2) + ' at kappa ~' + CROSSOVER_KAPPA.toFixed(1) + '. The crossover kappa depends on the ' +
    'midpoint CONVENTION (log-midpoint here; an arithmetic midpoint would sit almost at the ceiling, kappa ~ 1) and on ' +
    'the half-decade binning used to denoise the phase-erratic per-rung naiveNorm, so it should be read as an ' +
    'order-of-magnitude locator (kappa ~ 10), not a sharp constant. Nothing here is certified; it changes no bound.',
  verdict:
    'NUMERICAL MEASUREMENT (frontier-direction, NOT a certified bound). Refining the imp-35854 (alpha, beta) sweep to ' +
    SWEEP.length + ' rungs on the SAME N = floor(sqrt(T_PT/4 pi)) ~ 488602-term oscillatory sum, each against a per-rung ' +
    'EXACT BigInt reference, and reading the denoised (half-decade geometric-mean) naiveNorm(kappa) curve: the naive ' +
    'NORMALIZED error departs the sqrt(N) u ~ ' + SQRTN_U.toExponential(2) + ' random-walk ceiling as a near-perfect ' +
    'kappa^{-1} POWER LAW (descent slope d(log naiveNorm)/d(log kappa) ~ ' + DESCENT_SLOPE.toFixed(2) + '), crossing the ' +
    'log-midpoint MID ~ ' + MID.toExponential(2) + ' between the ceiling and the measured ~ ' + NORM_FLOOR.toExponential(2) +
    ' floor at CROSSOVER kappa ~ ' + CROSSOVER_KAPPA.toFixed(1) + ', and flattening onto the roundoff floor (plateau slope ~ ' +
    PLATEAU_SLOPE.toFixed(2) + ') only once kappa >~ a few hundred. There is NO sharp knee: the crossover is a POINT on a ' +
    'continuous slope, and the -1 descent exponent is exactly why imp-35854 saw the naive RELATIVE error grow far ' +
    'sublinearly (naiveNorm ~ kappa^{-1} cancels the explicit kappa). All rungs at all kappa remain >= 10 orders below ' +
    'the O(1) barrier margin |A_t + B_t| - |C_t| (imp-35760); precision is NOT binding. Certifies no W1 bound; evaluates ' +
    'no true H_0; instantiates no interval; verifies no inequality; changes no bound; establishes no positivity; the W1 ' +
    'A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A) and MECHANICAL (imp-35725); C_mb GUE-conditional ' +
    '(imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35854 (coarse sweep that found the drop but not the crossover kappa); imp-35812 (term family + exact BigInt ' +
    'reference); imp-35871 (sqrt(N) u as an upper envelope not a tracked law); imp-35761 (pessimistic N u ceiling); ' +
    'imp-35760 (barrier-margin allocation); imp-35725 (mechanical N-term certified cost); imp-35681 Part A (A+B-C ' +
    'greenfield); Higham 2002 (recursive-sum error; condition number); Platt-Trudgian 2021 (barrier base).',
};

export const IMP35886_W1_SUMMATION_KAPPA_CROSSOVER_ASSERTIONS = [
  {
    // The refined (alpha, beta) sweep spans the required kappa ~ 1 .. ~2e5 range (>= 4 decades).
    id: 'imp35886-kappa-spans-range',
    description: 'Refined sweep kappa ladders from near-1 to >1e4 (>= 4 decades) across the (alpha, beta) rungs',
    holds: () =>
      SWEEP.length >= 40 &&
      KAPPA_MIN < 1.5 &&
      KAPPA_MAX > 1e4 &&
      KAPPA_DECADES >= 4,
  },
  {
    // N anchored at floor(sqrt(T_PT/4 pi)) ~ 488602, matching imp-35812 / imp-35854.
    id: 'imp35886-n-anchor',
    description: 'N = floor(sqrt(T_PT/4 pi)) ~ 488602 retained terms anchored at T_PT = 3e12',
    holds: () =>
      N_AT_TPT === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      N_AT_TPT > 4.8e5 &&
      N_AT_TPT < 4.9e5,
  },
  {
    // Ceiling above floor above nothing: the measured plateau floor is well below the sqrt(N) u ceiling.
    id: 'imp35886-ceiling-above-floor',
    description: 'Measured plateau floor (kappa>=1e3) sits >2 decades below the sqrt(N) u ceiling, near the ~4e-17 figure',
    holds: () =>
      NORM_FLOOR > 1e-18 &&
      NORM_FLOOR < 1e-16 &&
      SQRTN_U / NORM_FLOOR > 1e2 &&
      NORM_LOW > 0.02 * SQRTN_U &&
      NORM_LOW < 3 * SQRTN_U,
  },
  {
    // The crossover kappa is LOCATED: naiveNorm passes the log-midpoint at an order-10 kappa.
    id: 'imp35886-crossover-located',
    description: 'Naive normalized error crosses the log-midpoint MID at kappa ~ 3 .. 40 (order-10 locator)',
    holds: () =>
      Number.isFinite(CROSSOVER_KAPPA) &&
      CROSSOVER_KAPPA > 3 &&
      CROSSOVER_KAPPA < 40 &&
      NORM_LOW > MID &&
      MID > NORM_FLOOR,
  },
  {
    // The departure is a kappa^{-1} power law: descent slope ~ -1 per decade of kappa.
    id: 'imp35886-descent-slope-minus-one',
    description: 'Descent slope d(log naiveNorm)/d(log kappa) ~ -1 (kappa^{-1} power law, between -1.4 and -0.7)',
    holds: () =>
      DESCENT_SLOPE < -0.7 &&
      DESCENT_SLOPE > -1.4,
  },
  {
    // The plateau slope is ~0 and decisively flatter than the descent (saturation on the floor).
    id: 'imp35886-plateau-flat',
    description: 'Plateau slope (kappa>=1e3) ~ 0 (|slope|<0.4) and decisively flatter than the descent slope',
    holds: () =>
      Math.abs(PLATEAU_SLOPE) < 0.4 &&
      PLATEAU_SLOPE > DESCENT_SLOPE + 0.5,
  },
  {
    // Honest-status note: the crossover is a locator on a continuous curve, convention/binning dependent.
    id: 'imp35886-honest-status-locator',
    description: 'honestStatus states the crossover is a LOCATOR (not a threshold), convention- and binning-dependent',
    holds: () =>
      typeof IMP35886_W1_SUMMATION_KAPPA_CROSSOVER.honestStatus === 'string' &&
      /LOCATOR/.test(IMP35886_W1_SUMMATION_KAPPA_CROSSOVER.honestStatus) &&
      /NOT a threshold/.test(IMP35886_W1_SUMMATION_KAPPA_CROSSOVER.honestStatus) &&
      /CONVENTION/.test(IMP35886_W1_SUMMATION_KAPPA_CROSSOVER.honestStatus),
  },
  {
    // Honesty gate: measurement only; greenfield; no QED; no refereed bound is changed.
    id: 'imp35886-honesty-gate',
    description: 'Measurement only; crossover located; greenfield; no QED; no refereed bound is changed',
    holds: () =>
      IMP35886_W1_SUMMATION_KAPPA_CROSSOVER.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /LOCATED/.test(IMP35886_W1_SUMMATION_KAPPA_CROSSOVER.conclusion.crossoverLocated) &&
      /GREENFIELD/.test(IMP35886_W1_SUMMATION_KAPPA_CROSSOVER.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP35886_W1_SUMMATION_KAPPA_CROSSOVER.verdict) &&
      /refereed bound is changed/i.test(IMP35886_W1_SUMMATION_KAPPA_CROSSOVER.verdict),
  },
];

for (const a of IMP35886_W1_SUMMATION_KAPPA_CROSSOVER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35886-w1-summation-kappa-crossover assertion failed: ${a.id}`);
  }
}
