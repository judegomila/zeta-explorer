/**
 * @module imp-35870-precision-tier-reachable-height-table
 *
 * imp-35870 (numerical/measurement, S-frontier): using the SAME BigInt sig-digit
 * recovery machinery imp-35811 built, MEASURE the exact x (gamma) at which each
 * standard IEEE-754 binary interchange precision tier is EXHAUSTED for the exact
 * de Bruijn underflow cancellation, and tabulate the per-value working-digit count
 * D*(x) and the implied mantissa-byte storage cost across the ladder x in [104,1000]
 * toward the T_PT extrapolation -- a precision-tier-vs-reachable-height table.
 *
 * WHY THIS IS NEW (over imp-35811)
 * -----------------------------------------------------------------------------
 * imp-35811 MEASURED the working-digit count D*(x) ~ 0.17055 x that keeps the
 * exp(-pi x/8)-small signal resolvable to 3 significant figures off the O(1)
 * accumulator K ~ 6.214e-2, and named the quad (IEEE binary128, ~33.9 digits)
 * reach at x ~ 200 as a single spot value. It never INVERTED that measured law
 * across the standard precision ladder: it gave no per-tier reachable height for
 * double / quad / octuple, and no per-value mantissa-BYTE cost across the height
 * ladder. This module does exactly that, reusing imp-35811 machinery verbatim
 * (Machin-series pi, range-reduced repeated-squaring exp(-pi x/8), BigInt sig-digit
 * rounding, the confirm-two-consecutive D*(x) inversion) and cross-checking that the
 * replicated D*(x) reproduces imp-35811 exported table exactly at the shared rungs.
 *
 * THE THREE STANDARD TIERS (IEEE-754 binary interchange formats)
 * -----------------------------------------------------------------------------
 *   double   binary64  : significand p = 53 bits  ->  53*log10(2) ~ 15.95 digits,   8 bytes/value
 *   quad     binary128 : significand p = 113 bits -> 113*log10(2) ~ 34.02 digits,  16 bytes/value
 *   octuple  binary256 : significand p = 237 bits -> 237*log10(2) ~ 71.34 digits,  32 bytes/value
 * (the conventional round-trip figures 15.95 / ~33.9 / ~71.3 the ticket names; quad
 * is quoted ~33.9 = round-trip vs 34.02 = full-p, within a digit either way.)
 *
 * WHAT WAS MEASURED (BigInt run; TABLE + TIER_TABLE below)
 * -----------------------------------------------------------------------------
 * For each tier with M significand digits we report TWO reachable heights, and are
 * transparent about why they differ:
 *   (a) reachSlope  = M / slopeMeasured  -- the offset-free reach imp-35811 used for
 *       its "quad reaches x ~ 200" statement (reproduces double x ~ 94, quad x ~ 200,
 *       octuple x ~ 418; gamma = x/2).
 *   (b) exhaustX    = smallest integer x for which the MEASURED D*(x) exceeds M (found
 *       by binary search over the monotone measured ladder) -- the g = 3 exhaustion,
 *       which sits BELOW reachSlope by the ~+2 guard offset because the 3-sig-figure
 *       recovery criterion is STRICTER than "signal barely nonzero" (the ~1e-17-floor
 *       raw double ceiling x ~ 104 imp-35781 measured demands only ~1 sig figure).
 * Across the height ladder x in [104,1000] the mantissa-BYTE cost per evaluated value
 * is D*(x)*log2(10)/8; it rises linearly from ~8.3 bytes at x = 104 to ~71 bytes at
 * x = 1000, and the measured slope extrapolates the T_PT target x = 2.T_PT = 6e12 to
 * ~1.02e12 decimal digits ~ 425 GB per value (matching imp-35811). NO standard tier
 * reaches T_PT: the required per-value storage exceeds octuple (32 bytes) by ~1.3e10x.
 *
 * WHAT THIS DOES NOT DO
 * -----------------------------------------------------------------------------
 * Inverts ONLY the imp-35811 underflow-driven mantissa-digit law, using the
 * imp-35781-measured accumulator scale K. It evaluates no true H_0 at high precision,
 * extends no evaluator, runs at no T_PT height, and ignores the SEPARATE growing
 * count/precision costs imp-35868 estimated (integrand nodes O(x), Phi-series O(sqrt x),
 * argument-reduction +O(log10 x)), all of which only worsen the picture. Measurement
 * only; certifies no value at any height; changes no bound; NO QED. No refereed bound is changed.
 *
 * @see imp-35811-exact-debruijn-arbitrary-precision-digit-table (the measured D*(x) law this inverts per tier)
 * @see imp-35868-excluded-cost-channels-estimate (the count/precision channels excluded here)
 * @see imp-35781-exact-debruijn-empirical-x-ceiling-scope (measured the raw double ceiling x ~ 104)
 * @see Platt-Trudgian 2021 (verified zero height T_PT = 3e12; no refereed bound is changed)
 */

import { IMP35811_EXACT_DEBRUIJN_ARBITRARY_PRECISION_DIGIT_TABLE } from './imp-35811-exact-debruijn-arbitrary-precision-digit-table.js';

// -- Anchor + operative constants (import-light; matching imp-35811 verbatim) --
const T_PT = 3e12; // Platt-Trudgian 2021 verified zero-ordinate (gamma) height
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement
const X_TPT = 2 * T_PT; // x = 2 gamma convention; T_PT ordinate maps to x = 6e12
const PI = Math.PI;
const DIGITS_PER_X = PI / (8 * Math.LN10); // ~0.170547 decimal digits per unit x (imp-35759)
const K_ACC = 6.214e-2; // O(1) integrand accumulator scale sum|w_i| (imp-35781 measured)
const TOL = 1e-3; // "resolvable" = signal recovered to g = 3 significant figures
const LOG2_10 = Math.log2(10); // ~3.3219 bits per decimal digit
const LOG10_2 = Math.log10(2); // ~0.30103 decimal digits per bit

// -- BigInt fixed-point arithmetic at scale 10^P (same engine as imp-35811) --
const P = 520; // fixed-point scale digits: >> DIGITS_PER_X*1000 + max scanned D + guard
const ONE = 10n ** BigInt(P);

// arctan(1/k) in fixed point (Machin building block; alternating series in 1/k^2).
function atanInv(k) {
  const kk = BigInt(k), k2 = kk * kk;
  let term = ONE / kk;
  let sum = 0n;
  let n = 0n;
  while (term !== 0n) {
    const add = term / (2n * n + 1n);
    sum += (n % 2n === 0n) ? add : -add;
    term = term / k2;
    n += 1n;
  }
  return sum;
}
// pi via Machin: pi = 16 atan(1/5) - 4 atan(1/239).
const PI_SCALED = 16n * atanInv(5) - 4n * atanInv(239);

// exp(-y) in fixed point, y > 0 scaled: range-reduce, sum well-conditioned Taylor for
// exp(+r), square back, reciprocate. No cancellation, no huge alternation.
function expNeg(yScaled) {
  let s = 0;
  let r = yScaled;
  const RCAP = ONE / 10n;
  while (r > RCAP) { r /= 2n; s += 1; }
  let term = ONE;
  let sum = ONE;
  let n = 1n;
  while (term !== 0n) {
    term = (term * r) / ONE / n;
    sum += term;
    n += 1n;
  }
  let expY = sum;
  for (let i = 0; i < s; i++) expY = (expY * expY) / ONE;
  return (ONE * ONE) / expY;
}

// Round a positive BigInt V (fixed-point mantissa) to D significant decimal digits.
function sigRound(V, D) {
  if (V <= 0n) return V;
  const len = V.toString().length;
  if (len <= D) return V;
  const drop = len - D;
  const base = 10n ** BigInt(drop);
  const q = V / base, rem = V % base;
  const rounded = (2n * rem >= base) ? q + 1n : q;
  return rounded * base;
}

// Relative error |a - T| / T as a double, from same-scale BigInts.
function relErr(recovered, T) {
  if (T <= 0n) return Infinity;
  let d = recovered - T;
  if (d < 0n) d = -d;
  return Number((d * 1000000000000n) / T) / 1e12;
}

// Approximate V / 10^P as a double (for cross-checks) without overflow.
function bigToNumber(V) {
  if (V === 0n) return 0;
  const str = V.toString();
  const L = str.length;
  const KEEP = 17;
  const mant = L <= KEEP ? str : str.slice(0, KEEP);
  const exp = (L <= KEEP ? 0 : L - KEEP) - P;
  return Number(mant) * Math.pow(10, exp);
}

// K = sum|w_i| accumulator scale as a fixed-point BigInt (~15 sig figs).
const K_SCALED = BigInt(Math.round(K_ACC * 1e15)) * (10n ** BigInt(P - 15));

// -- Minimum working digits D*(x): the imp-35811 inversion verbatim --
function measureDstar(x) {
  const yScaled = (PI_SCALED * BigInt(x)) / 8n;
  const T = expNeg(yScaled);
  const KplusT = K_SCALED + T;
  const cap = Math.ceil(DIGITS_PER_X * x) + 25;
  let firstBelow = -1;
  for (let D = 1; D <= cap; D++) {
    const recovered = sigRound(KplusT, D) - sigRound(K_SCALED, D);
    if (relErr(recovered, T) <= TOL) {
      const rec2 = sigRound(KplusT, D + 1) - sigRound(K_SCALED, D + 1);
      if (relErr(rec2, T) <= TOL) { firstBelow = D; break; }
    }
  }
  return { x, gamma: x / 2, T: bigToNumber(T), Dstar: firstBelow, law: DIGITS_PER_X * x };
}

// -- Height ladder: D*(x) + mantissa-byte cost per evaluated value (x in [104,1000]) --
const X_LADDER = [104, 150, 200, 300, 500, 750, 1000];
const TABLE = X_LADDER.map((x) => {
  const r = measureDstar(x);
  const mantissaBits = r.Dstar * LOG2_10; // decimal digits -> bits of significand
  return {
    x: r.x,
    gamma: r.gamma,
    Dstar: r.Dstar, // measured working decimal digits
    mantissaBits, // significand bits to hold D*(x) digits
    mantissaBytes: mantissaBits / 8, // per-value storage cost
    law: r.law,
  };
});

// Measured slope + guard offset from the ladder endpoints (matches imp-35811).
const rTop = TABLE[TABLE.length - 1], rBot = TABLE[0];
const SLOPE_MEASURED = (rTop.Dstar - rBot.Dstar) / (rTop.x - rBot.x);
const GUARD_OFFSET = rBot.Dstar - DIGITS_PER_X * rBot.x; // ~+2

// -- Binary search: smallest integer x with MEASURED D*(x) > M (the g=3 exhaustion) --
function exhaustionX(Mround) {
  let lo = 20, hi = 2048;
  while (measureDstar(hi).Dstar <= Mround) hi *= 2; // guarantee bracket
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (measureDstar(mid).Dstar > Mround) hi = mid; else lo = mid + 1;
  }
  return lo; // smallest x with D*(x) > Mround
}

// -- Precision-tier-vs-reachable-height table (IEEE-754 binary interchange formats) --
const TIER_SPECS = [
  { name: 'double', format: 'binary64', bits: 53, bytes: 8 },
  { name: 'quad', format: 'binary128', bits: 113, bytes: 16 },
  { name: 'octuple', format: 'binary256', bits: 237, bytes: 32 },
];
const TIER_TABLE = TIER_SPECS.map((t) => {
  const digits = t.bits * LOG10_2; // significand decimal digits M
  const Mround = Math.round(digits);
  const reachSlope = digits / SLOPE_MEASURED; // offset-free reach (imp-35811 convention)
  const exhaustX = exhaustionX(Mround); // measured g=3 exhaustion (first x with D* > M)
  return {
    name: t.name,
    format: t.format,
    significandBits: t.bits,
    storageBytes: t.bytes, // bytes per stored value in this format
    digits, // significand decimal digits M
    reachSlope, // x where D*(x) = M by the offset-free law
    reachSlopeGamma: reachSlope / 2,
    exhaustX, // smallest measured integer x with D*(x) > round(M)
    exhaustGamma: exhaustX / 2,
    reachMeasured: exhaustX - 1, // largest x still resolvable to g=3 in this tier
  };
});

// -- T_PT extrapolation (matches imp-35811) --
const DIGITS_TPT_MEASURED = SLOPE_MEASURED * X_TPT; // ~1.02e12 decimal digits
const BYTES_TPT = (DIGITS_TPT_MEASURED * LOG2_10) / 8; // per-value mantissa bytes at x=6e12
const GB_TPT = BYTES_TPT / 1e9; // ~425 GB/value
const OCTUPLE_SHORTFALL = BYTES_TPT / 32; // how many octuple formats deep the T_PT value is

// -- Calibration cross-check: replicated D*(x) reproduces imp-35811 exported table --
const REF_TABLE = IMP35811_EXACT_DEBRUIJN_ARBITRARY_PRECISION_DIGIT_TABLE.table;
const REF_BY_X = new Map(REF_TABLE.map((r) => [r.x, r.Dstar]));
const DSTAR_MATCHES_REF = TABLE.every((r) => REF_BY_X.get(r.x) === r.Dstar);

// Engine calibration (same as imp-35811): BigInt exp / pi vs the double library.
const T_AT_104_BIG = bigToNumber(expNeg((PI_SCALED * 104n) / 8n));
const T_AT_104_LIB = Math.exp(-PI * 104 / 8);
const EXP_RELERR_104 = Math.abs(T_AT_104_BIG / T_AT_104_LIB - 1);
const PI_RELERR = Math.abs(bigToNumber(PI_SCALED) / PI - 1);

export const IMP35870_PRECISION_TIER_REACHABLE_HEIGHT_TABLE = {
  id: 'imp-35870',
  proofSection: 'S-frontier',
  question:
    'Using the imp-35811 BigInt sig-digit recovery machinery, measure the exact x (gamma) at which each standard ' +
    'IEEE-754 precision tier (double binary64, quad binary128, octuple binary256) is exhausted for the exp(-pi x/8) ' +
    'underflow cancellation, and tabulate D*(x) and the implied mantissa-byte cost per evaluated value across ' +
    'x in [104,1000] toward the T_PT extrapolation. Measurement only; extends no evaluator; changes no bound; NO QED.',
  method: {
    arithmetic: 'BigInt fixed-point at scale 10^' + P + ' (Machin-series pi; range-reduced repeated-squaring exp(-pi x/8)); imp-35811 engine verbatim',
    accumulatorScale: K_ACC,
    resolvableCriterion: 'signal exp(-pi x/8) recovered to 3 significant figures (relErr <= 1e-3) off the K accumulator',
    tierDigitsFormula: 'M = significandBits * log10(2) (53/113/237 bits -> 15.95/34.02/71.34 decimal digits)',
    mantissaByteFormula: 'bytesPerValue(x) = D*(x) * log2(10) / 8 (decimal working digits -> significand bits -> bytes)',
    reachDefinitions:
      'reachSlope = M / slopeMeasured (offset-free reach, imp-35811 convention); exhaustX = smallest integer x with ' +
      'measured D*(x) > round(M) (the stricter g = 3 exhaustion, below reachSlope by the ~+2 guard offset).',
  },
  heightLadder: TABLE, // [{ x, gamma, Dstar, mantissaBits, mantissaBytes, law }]
  tierTable: TIER_TABLE, // [{ name, format, significandBits, storageBytes, digits, reachSlope, exhaustX, ... }]
  digitLaw: {
    slopeMeasured: SLOPE_MEASURED, // ~0.1705 digits per unit x
    guardOffset: GUARD_OFFSET, // ~+2
    digitsPerX: DIGITS_PER_X,
    statement:
      'Reach is LINEAR in working digits at the measured slope ~ 0.1705 digits per unit x (matching pi/(8 ln10)); ' +
      'mantissa-byte cost per value is D*(x)*log2(10)/8, rising linearly from ~8.3 bytes at x = 104 to ~71 bytes at x = 1000.',
  },
  wideningBuys: {
    xTPT: X_TPT,
    digitsTPTMeasured: DIGITS_TPT_MEASURED, // ~1.02e12
    bytesTPT: BYTES_TPT, // ~4.25e11
    gigabytesTPT: GB_TPT, // ~425 GB/value
    octupleShortfall: OCTUPLE_SHORTFALL, // ~1.3e10 octuple formats deep
    statement:
      'No standard precision tier reaches T_PT: double reaches x ~ 94 (gamma ~ 47), quad x ~ 200 (gamma ~ 100), ' +
      'octuple x ~ 418 (gamma ~ 209); the T_PT target x = 6e12 needs ~1.02e12 decimal digits (~425 GB per value), ' +
      'exceeding octuple (32 bytes) by ~1.3e10x -- the same categorical wall imp-35811 named, now resolved per tier.',
  },
  crossChecks: {
    dstarMatchesImp35811: DSTAR_MATCHES_REF,
    expRelErrAt104: EXP_RELERR_104,
    piRelErr: PI_RELERR,
    statement:
      'The replicated D*(x) reproduces the imp-35811 exported table exactly at every shared rung (same machinery); ' +
      'the BigInt exp(-pi.104/8) matches the double library to < 1e-12 and Machin pi matches Math.PI to machine precision.',
  },
  ignoredCosts:
    'Inverts ONLY the imp-35811 underflow-driven mantissa-digit law using the imp-35781-measured accumulator K. ' +
    'It evaluates no true H_0 at high precision, extends no evaluator, and ignores the separate growing count/precision ' +
    'costs imp-35868 estimated (integrand nodes O(x), Phi-series O(sqrt x), argument reduction +O(log10 x)).',
  isRigorous: false,
  verdict:
    'PRECISION-TIER-VS-REACHABLE-HEIGHT MEASUREMENT (frontier-direction, NOT rigorous). Reusing the imp-35811 ' +
    '~520-digit BigInt engine (Machin pi, range-reduced repeated-squaring exp) verbatim -- with the replicated D*(x) ' +
    'reproducing the imp-35811 exported table exactly at every shared rung -- the exact x at which each standard ' +
    'IEEE-754 tier is exhausted was measured: double (binary64, ~15.95 digits, 8 bytes) reaches x ~ 94, quad ' +
    '(binary128, ~34.02 digits, 16 bytes) x ~ 200, octuple (binary256, ~71.34 digits, 32 bytes) x ~ 418 by the ' +
    'offset-free reach M/slope; the stricter g = 3 measured exhaustion (first x with D*(x) > M) sits ~+2 guard digits ' +
    'below each. The mantissa-byte cost per evaluated value rises linearly from ~8.3 bytes at x = 104 to ~71 bytes at ' +
    'x = 1000, and extrapolates the T_PT target x = 6e12 to ~1.02e12 decimal digits (~425 GB per value) -- exceeding ' +
    'octuple by ~1.3e10x, so NO standard tier reaches T_PT. This upgrades imp-35811 (which gave only a single quad ' +
    'spot value) to a full per-tier reachable-height and per-value byte-cost table. It extends no evaluator, evaluates ' +
    'no true H_0 at high precision, certifies no value at any height, and changes no bound. NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35811 (measured D*(x) ~ 0.17055 x, ~520-digit BigInt engine reused verbatim); imp-35781 (measured the raw ' +
    'double ceiling x ~ 104); imp-35868 (excluded count/precision cost channels); Platt-Trudgian 2021 (T_PT = 3e12; ' +
    'no refereed bound is changed).',
};

export const IMP35870_PRECISION_TIER_REACHABLE_HEIGHT_TABLE_ASSERTIONS = [
  {
    // Calibration: the replicated engine matches the double library AND reproduces imp-35811 D*(x) exactly.
    id: 'imp35870-engine-calibrated-and-matches-imp35811',
    description: 'BigInt pi/exp match the double library; replicated D*(x) equals imp-35811 exported table at every shared rung',
    holds: () => PI_RELERR < 1e-14 && EXP_RELERR_104 < 1e-12 && DSTAR_MATCHES_REF === true,
  },
  {
    // The height ladder was measured: monotone D*(x), monotone byte cost, correct byte = digits*log2(10)/8.
    id: 'imp35870-height-ladder-measured-monotone',
    description: 'D*(x) and mantissaBytes strictly increase across x in [104,1000]; mantissaBytes = D*(x)*log2(10)/8',
    holds: () => {
      if (TABLE.length !== 7) return false;
      for (const r of TABLE) {
        if (!(r.Dstar > 0 && Number.isFinite(r.Dstar))) return false;
        if (Math.abs(r.mantissaBytes - (r.Dstar * LOG2_10) / 8) > 1e-9) return false;
      }
      for (let i = 1; i < TABLE.length; i++) {
        if (!(TABLE[i].Dstar > TABLE[i - 1].Dstar)) return false;
        if (!(TABLE[i].mantissaBytes > TABLE[i - 1].mantissaBytes)) return false;
      }
      // byte cost at the double edge ~8.3 bytes; at x=1000 ~71.4 bytes (D*~172 * 0.415).
      return TABLE[0].mantissaBytes > 7 && TABLE[0].mantissaBytes < 12 &&
             rTop.mantissaBytes > 65 && rTop.mantissaBytes < 80;
    },
  },
  {
    // The three tiers reproduce the ticket anchors: double x~94-104, quad x~200, octuple x~418; strictly ordered.
    id: 'imp35870-tier-reach-anchors',
    description: 'reachSlope reproduces double x~94, quad x~200, octuple x~418; storage bytes 8/16/32; reaches strictly ordered',
    holds: () => {
      if (TIER_TABLE.length !== 3) return false;
      const [d, q, o] = TIER_TABLE;
      if (!(d.storageBytes === 8 && q.storageBytes === 16 && o.storageBytes === 32)) return false;
      if (!(d.reachSlope < q.reachSlope && q.reachSlope < o.reachSlope)) return false;
      if (!(d.reachSlope > 85 && d.reachSlope < 105)) return false;
      if (!(q.reachSlope > 190 && q.reachSlope < 210)) return false;
      if (!(o.reachSlope > 405 && o.reachSlope < 430)) return false;
      // significand digits from bits: 53/113/237 -> ~15.95/34.02/71.34
      return Math.abs(d.digits - 15.95) < 0.2 && Math.abs(q.digits - 34.02) < 0.2 && Math.abs(o.digits - 71.34) < 0.3;
    },
  },
  {
    // The measured g=3 exhaustion x is a genuine crossing: D*(exhaustX) > M and D*(exhaustX-1) <= M, and sits below reachSlope.
    id: 'imp35870-measured-exhaustion-is-a-real-crossing',
    description: 'for each tier D*(exhaustX) > round(M) and D*(exhaustX-1) <= round(M); exhaustX below the offset-free reachSlope',
    holds: () => {
      for (const t of TIER_TABLE) {
        const Mround = Math.round(t.digits);
        if (!(measureDstar(t.exhaustX).Dstar > Mround)) return false;
        if (!(measureDstar(t.exhaustX - 1).Dstar <= Mround)) return false;
        if (!(t.exhaustX < t.reachSlope)) return false; // stricter g=3 criterion -> lower reach
      }
      return true;
    },
  },
  {
    // T_PT extrapolation reproduces the imp-35811 wall and no standard tier reaches it.
    id: 'imp35870-tpt-wall-no-tier-reaches',
    description: 'x_TPT=6e12 -> ~1.0e12 digits (~425 GB/value); required storage exceeds octuple (32 B) by ~1e10x',
    holds: () =>
      X_TPT === 6e12 &&
      Math.abs(DIGITS_TPT_MEASURED / 1.023e12 - 1) < 0.05 &&
      GB_TPT > 400 && GB_TPT < 450 &&
      OCTUPLE_SHORTFALL > 1e10 && OCTUPLE_SHORTFALL < 2e10 &&
      TIER_TABLE.every((t) => t.reachSlope < X_TPT),
  },
  {
    // Honesty gate: measurement only; no evaluator extension; no high-precision H_0; NO QED; no refereed bound is changed.
    id: 'imp35870-honesty-gate-no-qed',
    description: 'Measurement only; extends no evaluator; certifies no value; changes no bound; NO QED; no refereed bound is changed',
    holds: () =>
      IMP35870_PRECISION_TIER_REACHABLE_HEIGHT_TABLE.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /extends no evaluator/.test(IMP35870_PRECISION_TIER_REACHABLE_HEIGHT_TABLE.verdict) &&
      /NO QED/.test(IMP35870_PRECISION_TIER_REACHABLE_HEIGHT_TABLE.verdict) &&
      /refereed bound is changed/i.test(IMP35870_PRECISION_TIER_REACHABLE_HEIGHT_TABLE.verdict),
  },
];

for (const a of IMP35870_PRECISION_TIER_REACHABLE_HEIGHT_TABLE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35870-precision-tier-reachable-height-table assertion failed: ${a.id}`);
  }
}
