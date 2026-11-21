/**
 * @module imp-36135-kbn-floor-headroom-extrapolation
 *
 * imp-36135 (numerical, S-frontier): EXTRAPOLATE the imp-36083 sqrt(N)-widening deterministic
 * KBN-floor-to-certified-run-max headroom PAST the imp-35812 ladder anchor (the full T_PT retained
 * term count N ~ 4.886e5) and BEYOND (N up to ~1e15), DETERMINING the height (if any) at which the
 * N-flat KBN compensated floor would rise to meet the growing certified run-max rung.
 *
 * WHY THIS MEASUREMENT. imp-36083 tabulated the ratio certifiedRunMax / kbnFloor at four rungs
 * N = [1000, 10000, 100000, 488602] and found it WIDENS with N (~3.90 -> ~6.53 orders) because the
 * imp-35890 certified rung gamma_{N-1} * max_i|S_i| / Sum|t_k| grows ~sqrt(N) while the imp-36023 KBN
 * compensated floor is N-flat. imp-36134 confirmed the KBN floor is order-invariant so imp-36083 was
 * unbiased. But imp-36083 STOPPED at the anchor: it never asked whether, continuing the two curves
 * upward, the flat KBN floor and the rising certified rung ever CROSS -- i.e. whether at some large N
 * (physically, some large verified height T = 4 pi N^2) precision could re-become the binding
 * constraint in the deterministic compensated channel. This module extends the certified rung by
 * DIRECT Float64 evaluation two decades past the anchor (N = 1e6, 2e6), fits the sqrt(N) law, and
 * extrapolates it analytically to N = [1e7, 1e9, 1e12, 1e15], holding the KBN floor at its
 * N-flat level (directly re-confirmed flat at N = 1e6), then solves for the crossing.
 *
 * DETERMINATION -- NO PHYSICAL CROSSING; THE HEADROOM DIVERGES. The certified rung is well described
 * by certRung(N) ~ C * sqrt(N) with C ~ 9.2e-17 (mechanism: gamma_{N-1} ~ N u grows linearly, the
 * partial-sum peak max_i|S_i| is BOUNDED -- the oscillatory sum converges -- and Sum|t_k| ~ (4/pi) sqrt(N),
 * so the ratio scales as sqrt(N)). Setting C * sqrt(N) equal to the flat KBN floor F ~ 1.89e-20 gives
 * a crossing at N_cross = (F / C)^2 ~ 4e-8, i.e. N_cross < 1 -- an UNPHYSICAL fractional term count.
 * Even using the LARGEST ladder floor F_max ~ 3.74e-19 (the most conservative, nearest-crossing choice,
 * at N = 1000) gives N_cross ~ 1.7e-5, still far below one term. So the certified rung already EXCEEDS
 * the flat KBN floor for every N >= 1: the flat KBN floor NEVER rises to meet the certified rung at any
 * physical N, and going UP toward the T_PT count and beyond the headroom only WIDENS, at ~+0.5 orders
 * of magnitude per decade of N (~6.53 orders at the anchor, ~9.7 at N = 1e12, ~11 at N = 1e15). The
 * only regime where the certified rung stops behaving like C sqrt(N) is N ~ 1/u ~ 9e15, where
 * gamma_{N-1} itself diverges and the Higham a-priori bound loses meaning -- astronomically beyond any
 * conceivable retained term count (N = 1e12 already maps to a verified height T ~ 1.26e25).
 *
 * NOT A BOUND. This EXTRAPOLATES the gap between two already-established quantities and solves an
 * elementary crossing equation; it certifies no W1 bound, instantiates no directed-rounding interval,
 * evaluates no true H_0, verifies no inequality, changes no bound, establishes no positivity; C_mb
 * GUE-conditional (imp-486) is untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * MEASURED / EXTRAPOLATED (certified rung normalized by Sum|t_k|; KBN floor N-flat ~1.89e-20):
 *   N          certRung        source        headroom log10(cert/KBN)
 *   1000       2.95e-15        direct        ~3.90   (imp-36083)
 *   100000     2.90e-14        direct        ~5.47   (imp-36083)
 *   488602     6.41e-14        direct        ~6.53   (imp-36083 anchor / T_PT count)
 *   1000000    9.2e-14         direct        ~6.69
 *   2000000    1.3e-13         direct        ~6.84
 *   1e7        2.9e-13         extrapolated  ~7.19
 *   1e9        2.9e-12         extrapolated  ~8.19
 *   1e12       9.2e-11         extrapolated  ~9.69
 *   1e15       3.3e-9          extrapolated  ~11.2  (gamma superlinearity begins)
 *
 * @see imp-36083-kbn-floor-headroom-to-certified-rung (the sqrt(N)-widening headroom ladder this extrapolates)
 * @see imp-36134-kbn-floor-headroom-same-order (order-invariance of the KBN floor; imp-36083 unbiased)
 * @see imp-36023-kbn-combined-worst-ladder (the DETERMINISTIC KBN N-flat floor)
 * @see imp-35890-w1-running-accumulator-apriori-bound (the CERTIFIED deterministic run-max rung)
 * @see imp-35812-w1-summation-scheme-measured-cost (fixed term family + N ladder [1e3..4.886e5])
 * @see Higham 2002, Accuracy and Stability of Numerical Algorithms (compensated summation; Neumaier 1974)
 */

// -- Anchor + operative constants (import-light; matching imp-36083 / imp-36134) ----------
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI)));
const N_AT_TPT = N_TERMS(T_PT); // ~488602 terms per mollified sum at T_PT
const HEIGHT_FOR_N = (N) => 4 * Math.PI * N * N; // inverse of N_TERMS: verified height a term count maps to

const U_ROUNDOFF = 2 ** -53; // unit roundoff u (half ulp) ~ 1.11e-16
const gamma = (n) => (n * U_ROUNDOFF) / (1 - n * U_ROUNDOFF); // Higham gamma_n = n u / (1 - n u)
const ZETA_HALF = -1.4603545088095868; // zeta(1/2), tail constant in Sum_{k<=N} 1/sqrt(k) ~ 2 sqrt(N) + zeta(1/2)
const MEAN_ABS_COS = 2 / Math.PI; // E[|cos|] over an equidistributed phase; Sum|t_k| = Sum |cos|/sqrt(k) ~ (2/pi) Sum 1/sqrt(k)

// Same representative oscillatory term as imp-35812 / imp-35852 / imp-35890 / imp-36023 / imp-36083 / imp-36134.
const ALPHA = 0.6180339887498949; // golden-ratio fractional part
const BETA = 2.3999632297286533; // golden-angle (radians) -- irrational phase drift
const TERM = (k) => Math.cos(ALPHA * k + BETA * Math.sqrt(k)) / Math.sqrt(k);

// -- Kahan-Babuska-Neumaier compensated summation (identical to imp-36083) ----------------
function sumKBN(terms) {
  let s = 0;
  let c = 0;
  for (let i = 0; i < terms.length; i++) {
    const x = terms[i];
    const t = s + x;
    if (Math.abs(s) >= Math.abs(x)) c += (s - t) + x;
    else c += (x - t) + s;
    s = t;
  }
  return s + c;
}

// -- Exact reference: sum the doubles as dyadic rationals in BigInt (error-free; imp-36083) ----
const FRAC_BITS = 96n;
const _buf = new ArrayBuffer(8);
const _dv = new DataView(_buf);

function doubleToFixedBigInt(x) {
  if (x === 0) return 0n;
  _dv.setFloat64(0, x);
  const hi = _dv.getUint32(0);
  const lo = _dv.getUint32(4);
  const sign = hi >>> 31 ? -1n : 1n;
  let exp = (hi >>> 20) & 0x7ff;
  let mant = (BigInt(hi & 0xfffff) << 32n) | BigInt(lo >>> 0);
  if (exp === 0) {
    exp = -1074;
  } else {
    mant |= 1n << 52n;
    exp = exp - 1075;
  }
  const shift = BigInt(exp) + FRAC_BITS;
  let num = sign * mant;
  num = shift >= 0n ? num << shift : num >> -shift;
  return num;
}

function normalizedError(schemeResult, trueNum, sumAbs) {
  const err = doubleToFixedBigInt(schemeResult) - trueNum;
  const absErr = err < 0n ? -err : err;
  const absErrDouble = Number(absErr << 80n) / 2 ** 80 / 2 ** 96;
  return absErrDouble / sumAbs;
}

// -- Certified run-max rung by DIRECT Float64 evaluation (no BigInt; cheap at large N) -----
// certRung(N) = gamma_{N-1} * max_i|S_i| / Sum|t_k| (imp-35890 form, natural order = imp-36083 convention).
function measureCertRungDirect(N) {
  let sumAbs = 0;
  let s = 0;
  let maxPartial = 0;
  for (let k = 1; k <= N; k++) {
    const t = TERM(k);
    sumAbs += Math.abs(t);
    s += t;
    const a = Math.abs(s);
    if (a > maxPartial) maxPartial = a;
  }
  return { N, sumAbs, maxPartial, certNorm: (gamma(N - 1) * maxPartial) / sumAbs };
}

// -- KBN floor by BigInt reference (expensive; called only where flatness must be confirmed) ----
function measureKbnFloorDirect(N) {
  const base = new Float64Array(N);
  let sumAbs = 0;
  for (let k = 1; k <= N; k++) {
    const t = TERM(k);
    base[k - 1] = t;
    sumAbs += Math.abs(t);
  }
  let trueNum = 0n;
  for (let i = 0; i < N; i++) trueNum += doubleToFixedBigInt(base[i]);
  const neg = [];
  const pos = [];
  for (let i = 0; i < N; i++) {
    if (base[i] < 0) neg.push(base[i]);
    else pos.push(base[i]);
  }
  const clustered = Float64Array.from(neg.concat(pos));
  return normalizedError(sumKBN(clustered), trueNum, sumAbs); // matches imp-36083 clustered-order floor
}

// -- Direct certified-rung ladder: through the anchor and two decades past it -------------
const DIRECT_SIZES = [1000, 100000, N_AT_TPT, 1000000, 2000000];
const DIRECT = DIRECT_SIZES.map((N) => measureCertRungDirect(N));

// -- sqrt(N) fit of the certified rung: C = mean over the direct ladder of certNorm / sqrt(N) ----
const C_SAMPLES = DIRECT.map((r) => r.certNorm / Math.sqrt(r.N));
const C_FIT = C_SAMPLES.reduce((a, b) => a + b, 0) / C_SAMPLES.length; // ~9.2e-17
// Fit quality: relative spread of the per-rung C samples about the mean (small => sqrt(N) law holds).
const C_REL_SPREAD = (Math.max(...C_SAMPLES) - Math.min(...C_SAMPLES)) / C_FIT;

// Bounded partial-sum peak (proxy for its finite limit) taken at the largest DIRECT N.
const M_REF = DIRECT[DIRECT.length - 1].maxPartial; // ~1.05 (oscillatory sum converges => bounded)
// Analytic Sum|t_k| = Sum |cos(.)|/sqrt(k) ~ (2/pi)(2 sqrt(N) + zeta(1/2)) = (4/pi) sqrt(N) + (2/pi) zeta(1/2);
// the mean of |cos| over the equidistributed phase is 2/pi. Validated below against the directly measured sumAbs.
const sumAbsAnalytic = (N) => MEAN_ABS_COS * (2 * Math.sqrt(N) + ZETA_HALF);
const SUMABS_ANALYTIC_MAX_RELDIFF = Math.max(
  ...DIRECT.map((r) => Math.abs(sumAbsAnalytic(r.N) - r.sumAbs) / r.sumAbs),
); // ~1e-3 or smaller

// Analytic certified-rung extrapolation using the EXACT gamma (captures the N ~ 1/u superlinearity).
const certRungExtrap = (N) => (gamma(N - 1) * M_REF) / sumAbsAnalytic(N);

// -- KBN floor: N-flat. Anchor level (reproduces imp-36023/imp-36083 ~1.89e-20) + flatness past anchor + largest ladder floor.
const KBN_FLOOR_ANCHOR = measureKbnFloorDirect(N_AT_TPT); // ~1.89e-20 (the flat extrapolation level F)
const KBN_FLOOR_PAST_ANCHOR = measureKbnFloorDirect(1000000); // confirm STILL flat two decades past the anchor
const KBN_FLOOR_LADDER_MAX = measureKbnFloorDirect(1000); // ~3.74e-19 largest ladder floor (conservative crossing)
const KBN_STAYS_FLAT_PAST_ANCHOR = KBN_FLOOR_PAST_ANCHOR < 2 * KBN_FLOOR_ANCHOR && KBN_FLOOR_PAST_ANCHOR < U_ROUNDOFF;

// -- The extrapolation ladder: anchor + beyond, headroom orders at each --------------------
const EXTRAP_SIZES = [N_AT_TPT, 1e6, 1e7, 1e9, 1e12, 1e15];
const EXTRAP = EXTRAP_SIZES.map((N) => {
  // Use direct certRung where we have it (anchor, 1e6), analytic beyond.
  const direct = DIRECT.find((r) => r.N === N);
  const certNorm = direct ? direct.certNorm : certRungExtrap(N);
  return {
    N,
    height: HEIGHT_FOR_N(N),
    certNorm,
    source: direct ? 'direct' : 'extrapolated',
    headroomLog10: Math.log10(certNorm / KBN_FLOOR_ANCHOR),
  };
});
const HEADROOM_LOG10 = EXTRAP.map((r) => r.headroomLog10);
// The headroom WIDENS strictly monotonically going up in N -- the KBN floor never gains on the rung.
const HEADROOM_WIDENS_MONOTONE = EXTRAP.every((r, i) => i === 0 || r.headroomLog10 > EXTRAP[i - 1].headroomLog10);
// Slope ~ +0.5 orders per decade of N (the sqrt(N) law): (orders at 1e12 - orders at 1e6) / 6 decades.
const ORDERS_AT_1E6 = EXTRAP.find((r) => r.N === 1e6).headroomLog10;
const ORDERS_AT_1E12 = EXTRAP.find((r) => r.N === 1e12).headroomLog10;
const HEADROOM_SLOPE_PER_DECADE = (ORDERS_AT_1E12 - ORDERS_AT_1E6) / 6;

// -- The crossing determination -----------------------------------------------------------
// Solve C * sqrt(N) = KBN floor => N_cross = (F / C)^2. Both floor choices land far below one term.
const N_CROSS = (KBN_FLOOR_ANCHOR / C_FIT) ** 2; // ~4e-8 (< 1 term: unphysical)
const N_CROSS_CONSERVATIVE = (KBN_FLOOR_LADDER_MAX / C_FIT) ** 2; // ~1.7e-5 (< 1 term even with the largest floor)
const NO_PHYSICAL_CROSSING = N_CROSS < 1 && N_CROSS_CONSERVATIVE < 1;
// The gamma bound itself diverges only at N ~ 1/u; the physical extrapolation range stays far below it.
const N_GAMMA_BLOWUP = 1 / U_ROUNDOFF; // ~9.007e15

export const IMP36135_KBN_FLOOR_HEADROOM_EXTRAPOLATION = {
  id: 'imp-36135',
  proofSection: 'S-frontier',
  question:
    'EXTRAPOLATE the imp-36083 sqrt(N)-widening deterministic KBN-floor-to-certified run-max headroom ' +
    'PAST the imp-35812 ladder anchor (the full T_PT retained term count N ~ 4.886e5) and BEYOND, ' +
    'DETERMINING the height (if any) at which the N-flat KBN compensated floor would rise to meet the ' +
    'growing certified run-max rung. Extend the certified rung by direct Float64 evaluation two decades ' +
    'past the anchor, fit the sqrt(N) law, extrapolate to N ~ 1e15, and solve the crossing. Measurement only; NO QED.',
  representativeSum: {
    form: 't_k = cos(alpha * k + beta * sqrt(k)) / sqrt(k), k = 1 .. N (same fixed family as imp-36083, no RNG)',
    alpha: ALPHA,
    beta: BETA,
    retainedTermsAtTPT: N_AT_TPT,
    certifiedChannel: 'imp-35890 a-priori run-max bound gamma_{N-1} * max_i|S_i| / Sum|t_k| (natural order)',
    kbnChannel: 'imp-36023 KBN compensated floor, N-flat (order-invariant per imp-36134), level ~1.89e-20',
  },
  unitRoundoff: U_ROUNDOFF,
  fit: {
    note:
      'certRung(N) ~ C * sqrt(N): gamma_{N-1} ~ N u grows linearly, max_i|S_i| is BOUNDED (the oscillatory ' +
      'partial sum converges), and Sum|t_k| ~ (4/pi) sqrt(N) (mean of |cos| is 2/pi), so the rung scales as sqrt(N)',
    cFit: C_FIT, // ~9.2e-17
    cRelSpread: C_REL_SPREAD, // small => sqrt(N) law holds across the direct ladder
    boundedPeakRef: M_REF, // ~1.05 (proxy for the finite limit of max_i|S_i|)
    sumAbsAnalyticMaxRelDiff: SUMABS_ANALYTIC_MAX_RELDIFF, // analytic (4/pi) sqrt(N) form matches measured Sum|t_k|
  },
  directLadder: DIRECT.map((r) => ({ N: r.N, certNorm: r.certNorm, maxPartial: r.maxPartial })),
  extrapolation: {
    sizes: EXTRAP_SIZES,
    rows: EXTRAP,
    headroomLog10: HEADROOM_LOG10, // [~6.53, ~6.69, ~7.19, ~8.19, ~9.69, ~11.2]
    widensMonotone: HEADROOM_WIDENS_MONOTONE,
    slopePerDecade: HEADROOM_SLOPE_PER_DECADE, // ~0.5 orders per decade of N
  },
  kbnFloor: {
    note: 'the KBN floor is N-flat (order-invariant per imp-36134); confirmed still flat two decades past the anchor',
    anchorLevel: KBN_FLOOR_ANCHOR, // ~1.89e-20 (reproduces imp-36023 / imp-36083)
    pastAnchorLevel: KBN_FLOOR_PAST_ANCHOR, // measured at N = 1e6; still flat (<= anchor, well below u)
    ladderMaxLevel: KBN_FLOOR_LADDER_MAX, // ~3.74e-19 (largest ladder floor, N = 1000)
    staysFlatPastAnchor: KBN_STAYS_FLAT_PAST_ANCHOR,
  },
  crossing: {
    note:
      'solving C * sqrt(N) = KBN floor gives N_cross = (F / C)^2; both floor choices land far below one ' +
      'term, so the flat KBN floor never rises to meet the growing certified rung at any physical N',
    nCross: N_CROSS, // ~4e-8 (< 1 term)
    nCrossConservative: N_CROSS_CONSERVATIVE, // ~1.7e-5 (< 1 term with the largest ladder floor)
    noPhysicalCrossing: NO_PHYSICAL_CROSSING,
    gammaBlowupN: N_GAMMA_BLOWUP, // ~9e15: where gamma_{N-1} itself diverges (Higham bound loses meaning)
    heightAtGammaBlowup: HEIGHT_FOR_N(N_GAMMA_BLOWUP), // astronomically beyond any conceivable retained count
  },
  reading: {
    headroomDiverges:
      'going UP toward the T_PT term count and beyond, the headroom WIDENS strictly, at ~+0.5 orders per ' +
      'decade of N (the sqrt(N) law): ~6.53 orders at the anchor, ~6.69 at N = 1e6, ~9.69 at N = 1e12, ~11 at 1e15',
    noCrossing:
      'the crossing N_cross = (F / C)^2 ~ 4e-8 sits below one term; even with the largest ladder floor ' +
      '(~3.74e-19) the crossing is ~1.7e-5 -- so the certified rung already exceeds the flat KBN floor for ' +
      'every N >= 1 and the flat floor NEVER rises to meet it at any physical height',
    heightContext:
      'N = 1e6 maps to a verified height T = 4 pi N^2 ~ 1.26e13 and N = 1e12 to T ~ 1.26e25 -- the extrapolation ' +
      'already spans heights astronomically beyond the Platt-Trudgian anchor T = 3e12 (N ~ 488602)',
    gammaCaveat:
      'the sqrt(N) law holds until N ~ 1/u ~ 9e15, where gamma_{N-1} itself diverges and the Higham a-priori ' +
      'bound loses meaning; that regime (height T ~ 1e33) is far beyond any conceivable retained term count',
  },
  conclusion: {
    noHeightMeetsFloor:
      'there is NO physical N (hence no verified height) at which the N-flat KBN compensated floor rises to ' +
      'meet the growing certified run-max rung -- the extrapolated crossing sits at N ~ 4e-8 < 1 term',
    channelUnconditionallyNonBinding:
      'the deterministic compensated channel is unconditionally NON-binding: the headroom widens ~+0.5 orders ' +
      'per decade of N without bound within the physical range, so precision never becomes the binding constraint',
    staysGreenfield:
      'this module extrapolates the ratio of two already-established deterministic quantities and solves an ' +
      'elementary crossing equation; it evaluates no sum of H_t and verifies no inequality, so the W1 A + B - C ' +
      'certificate at T_PT stays GREENFIELD (imp-35681 Part A) and MECHANICAL (imp-35725)',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL HEADROOM EXTRAPOLATION (frontier-direction, deterministic, NOT a certified bound). Extending ' +
    'the imp-36083 sqrt(N)-widening headroom past the imp-35812 anchor (the full T_PT retained count N ~ ' +
    '488602) by direct Float64 evaluation of the imp-35890 certified rung at N = 1e6, 2e6 and analytic ' +
    'extrapolation to N = 1e15, the certified rung follows certRung(N) ~ C sqrt(N) with C ~ 9.2e-17 ' +
    '(gamma_{N-1} ~ N u grows linearly, the partial-sum peak max_i|S_i| is bounded, Sum|t_k| ~ (4/pi) sqrt(N)), ' +
    'while the imp-36023 KBN compensated floor stays N-flat ~1.89e-20 (directly re-confirmed flat at N = 1e6). ' +
    'Solving C sqrt(N) = floor gives a crossing at N_cross = (F/C)^2 ~ 4e-8, i.e. BELOW one term; even the ' +
    'largest ladder floor (~3.74e-19) gives ~1.7e-5, still below one term. So the flat KBN floor NEVER rises ' +
    'to meet the growing certified rung at any physical N (any verified height): the certified rung already ' +
    'exceeds the floor for every N >= 1, and going UP the headroom only WIDENS, at ~+0.5 orders per decade ' +
    '(~6.53 orders at the anchor, ~9.69 at N = 1e12, ~11 at 1e15). The sqrt(N) law holds until N ~ 1/u ~ 9e15 ' +
    '(height ~1e33), where gamma itself diverges -- far beyond any conceivable retained count. The deterministic ' +
    'compensated channel is therefore unconditionally NON-binding. Extrapolates the gap between two ' +
    'already-established quantities and solves a crossing equation: certifies no W1 bound; evaluates no true ' +
    'H_0; instantiates no interval; verifies no inequality; changes no bound; establishes no positivity; the ' +
    'W1 A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A) and MECHANICAL (imp-35725); C_mb ' +
    'GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-36083 (the sqrt(N)-widening headroom ladder this extrapolates); imp-36134 (order-invariance of the ' +
    'KBN floor); imp-36023 (the DETERMINISTIC KBN N-flat floor); imp-35890 (CERTIFIED deterministic ' +
    'running-accumulator run-max bound); imp-35852 (clustered worst ORDER); imp-35812 (fixed term family + ' +
    'N ladder [1e3..4.886e5]); imp-35725 (mechanical certified sum); imp-35681 Part A (A+B-C interval bound ' +
    'greenfield); imp-35674 Part D (N(x)=floor(sqrt(x/4 pi)) retained terms); Higham 2002, Neumaier 1974; ' +
    'Platt-Trudgian 2021 (barrier base).',
};

export const IMP36135_KBN_FLOOR_HEADROOM_EXTRAPOLATION_ASSERTIONS = [
  {
    id: 'imp36135-direct-ladder-spans-past-anchor',
    description: 'direct certified-rung ladder includes the T_PT anchor ~488602 and two decades past it (1e6, 2e6)',
    holds: () =>
      DIRECT.length === 5 &&
      DIRECT_SIZES[2] === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      DIRECT_SIZES[3] === 1000000 &&
      DIRECT_SIZES[4] === 2000000 &&
      N_AT_TPT > 4.8e5 &&
      N_AT_TPT < 4.9e5,
  },
  {
    // The certified rung follows a stable C * sqrt(N) law: the per-rung C samples cluster tightly.
    id: 'imp36135-sqrt-law-fit',
    description: 'certRung(N) ~ C sqrt(N) with C ~ 9.2e-17 and small relative spread across the direct ladder',
    holds: () => C_FIT > 8e-17 && C_FIT < 1.05e-16 && C_REL_SPREAD < 0.05,
  },
  {
    // The analytic Sum|t_k| ~ (4/pi) sqrt(N) reproduces the directly measured Sum|t_k| (mechanism check).
    id: 'imp36135-sumabs-analytic-matches',
    description: 'analytic (4/pi) sqrt(N) form matches the directly measured Sum|t_k| to < 1e-2 relative',
    holds: () => SUMABS_ANALYTIC_MAX_RELDIFF < 1e-2 && M_REF > 0.5 && M_REF < 5,
  },
  {
    // The KBN floor is N-flat: anchor ~1.89e-20 (imp-36023/imp-36083) and still flat two decades past.
    id: 'imp36135-kbn-floor-flat',
    description: 'KBN floor ~1.89e-20 at the anchor and still flat at N = 1e6 (both well below unit roundoff)',
    holds: () =>
      KBN_FLOOR_ANCHOR > 1.5e-20 &&
      KBN_FLOOR_ANCHOR < 2.5e-20 &&
      KBN_STAYS_FLAT_PAST_ANCHOR === true &&
      KBN_FLOOR_LADDER_MAX > 3.0e-19 &&
      KBN_FLOOR_LADDER_MAX < 4.5e-19,
  },
  {
    // The headroom WIDENS strictly with N at ~+0.5 orders per decade; anchor ~6.53, 1e12 ~9.7.
    id: 'imp36135-headroom-widens',
    description: 'headroom widens strictly with N at ~+0.5 orders/decade; ~6.53 at the anchor, ~9.7 at N = 1e12',
    holds: () =>
      HEADROOM_WIDENS_MONOTONE === true &&
      Math.abs(HEADROOM_LOG10[0] - 6.53) < 0.1 &&
      ORDERS_AT_1E12 > 9.3 &&
      ORDERS_AT_1E12 < 10.1 &&
      HEADROOM_SLOPE_PER_DECADE > 0.45 &&
      HEADROOM_SLOPE_PER_DECADE < 0.55,
  },
  {
    // THE DETERMINATION: the extrapolated crossing sits below one term for BOTH floor choices -> no physical crossing.
    id: 'imp36135-no-physical-crossing',
    description: 'crossing N_cross = (F/C)^2 < 1 term for both the anchor and the largest ladder floor',
    holds: () =>
      NO_PHYSICAL_CROSSING === true &&
      N_CROSS < 1e-4 &&
      N_CROSS_CONSERVATIVE < 1 &&
      N_GAMMA_BLOWUP > 8e15 &&
      N_GAMMA_BLOWUP < 1e16,
  },
  {
    id: 'imp36135-honesty-gate',
    description: 'Extrapolation only; no physical crossing; channel non-binding; no QED; no refereed bound is changed',
    holds: () =>
      IMP36135_KBN_FLOOR_HEADROOM_EXTRAPOLATION.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /NO physical N/.test(IMP36135_KBN_FLOOR_HEADROOM_EXTRAPOLATION.conclusion.noHeightMeetsFloor) &&
      /GREENFIELD/.test(IMP36135_KBN_FLOOR_HEADROOM_EXTRAPOLATION.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP36135_KBN_FLOOR_HEADROOM_EXTRAPOLATION.verdict) &&
      /refereed bound is changed/i.test(IMP36135_KBN_FLOOR_HEADROOM_EXTRAPOLATION.verdict),
  },
];

for (const a of IMP36135_KBN_FLOOR_HEADROOM_EXTRAPOLATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36135-kbn-floor-headroom-extrapolation assertion failed: ${a.id}`);
  }
}
