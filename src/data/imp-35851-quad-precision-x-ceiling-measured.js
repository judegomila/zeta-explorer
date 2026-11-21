/**
 * @module imp-35851-quad-precision-x-ceiling-measured
 *
 * imp-35851 (numerical/measurement, S-frontier): MEASURE the exact quad-precision
 * (IEEE binary128, ~33.9 decimal digits) x-ceiling for the imp-35811 exp(-pi x/8)-on-K
 * cancellation, sharpening the module OOM "quad reaches x ~ 200 (gamma ~ 100)" estimate
 * to a MEASURED detach band by running the same BigInt sig-digit recovery at D = 33.9.
 *
 * WHY THIS IS NEW (over imp-35811)
 * -----------------------------------------------------------------------------
 * imp-35811 tabulated D*(x) -- the minimum working digits to keep exp(-pi x/8) resolvable
 * to 3 sig figs off the O(1) accumulator K ~ 6.214e-2 -- across x in [104,1000], and read
 * off a quad reach as REACH_QUAD128 = 33.9 / slope_measured ~ 200 (gamma ~ 100). But that
 * quad number was a one-line OOM: it INVERTED the measured slope, dropping the ~+2 guard
 * offset that imp-35811 itself measured (and imp-35850 confirmed x-flat). The quad ceiling
 * was never itself MEASURED. This module runs the same ~520-digit BigInt recovery holding
 * the working-digit budget FIXED at the two integers bracketing quad, D = 33 and D = 34,
 * and scans x upward to the exact detach point (largest x still resolved, first x that
 * fails). It then interpolates the quad D = 33.9 ceiling from the two measured integer
 * rungs -- a MEASURED band, not an inverted slope.
 *
 * THE MEASUREMENT (all BigInt; import-light; matches imp-35811 primitives)
 * -----------------------------------------------------------------------------
 * For a fixed digit budget D and each integer x, exp(-pi x/8) is computed to ~520-digit
 * BigInt precision; K = sum|w_i| ~ 6.214e-2 and K+T are rounded to D significant digits
 * and their difference must recover T to relErr <= 1e-3 (g = 3). Because T shrinks
 * monotonically with x, at fixed D there is a sharp ceiling: the largest x still resolved.
 * We scan x in [100,280] and record xCeiling(D) = largest resolved x and its detach point.
 *
 * WHAT WAS MEASURED (BigInt run, TABLE in result.table)
 * -----------------------------------------------------------------------------
 *   D = 30 : xCeiling = 168 (gamma  84.0)     D = 33 : xCeiling = 185 (gamma 92.5)
 *   D = 34 : xCeiling = 189 (gamma 94.5)      D = 35 : xCeiling = 196 (gamma 98.0)
 * Quad binary128 (D = 33.9) interpolates between the D = 33 and D = 34 rungs to
 * x ~ 188.6 (gamma ~ 94.3) -- MEASURABLY BELOW the imp-35811 OOM x ~ 200 (gamma ~ 100).
 * The ~11-unit (~5.5%) gap is exactly the guard offset the OOM dropped: the measured
 * ceiling obeys xCeiling ~ (D - offset)/slope, and (33.9 - 2)/(pi/(8 ln10)) ~ 187.0
 * reproduces the measured 188.6 to within the O(1) guard. So quad ~doubles the double
 * ceiling (x ~ 104 -> ~189) as the OOM said, but lands at gamma ~ 94, not ~100.
 *
 * WHAT THIS DOES NOT DO
 * -----------------------------------------------------------------------------
 * Measures ONLY the underflow-driven mantissa-digit ceiling of the exp(-pi x/8)
 * cancellation, using the imp-35781-measured accumulator scale K, at the fixed quad
 * budget. It does NOT evaluate the true H_0(x) at quad precision (no high-precision
 * cos/quadrature), extend the evaluator, or run at T_PT; it ignores the SEPARATE growing
 * costs a real high-x run carries (node count, Phi-series terms, argument reduction), all
 * of which only worsen the picture. Measurement only; extends no evaluator; certifies no
 * value at any height; changes no bound; NO QED. No refereed bound is changed.
 *
 * @see imp-35811-exact-debruijn-arbitrary-precision-digit-table (the D*(x) table; quad reach was OOM only)
 * @see imp-35850-debruijn-digit-guard-offset-decomposition (the ~+2 guard offset, confirmed x-flat)
 * @see imp-35781-exact-debruijn-empirical-x-ceiling-scope (the double ceiling x in [94,106]; measured K)
 * @see Platt-Trudgian 2021 (verified zero height T_PT = 3e12; no refereed bound is changed)
 */

// -- Anchor + operative constants (import-light; matching imp-35811) --
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement
const PI = Math.PI;
const DIGITS_PER_X = PI / (8 * Math.LN10); // ~0.170547 decimal digits per unit x (imp-35759)
const K_ACC = 6.214e-2; // O(1) integrand accumulator scale sum|w_i| (imp-35781 measured)
const TOL = 1e-3; // "resolvable" = signal recovered to g = 3 significant figures
const D_QUAD = 33.9; // IEEE binary128 significand ~ 33.9 decimal digits
const GUARD_OFFSET = 2; // the imp-35811 measured / imp-35850-confirmed ~+2 guard digits

// -- BigInt fixed-point arithmetic at scale 10^P (matches imp-35811) --
const P = 520;
const ONE = 10n ** BigInt(P);

// arctan(1/k) in fixed point (Machin building block).
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

// exp(-y) in fixed point (range-reduced repeated-squaring; well-conditioned).
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

// Round a positive BigInt V to D significant decimal digits.
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

// Approximate V / 10^P as a double without overflow.
function bigToNumber(V) {
  if (V === 0n) return 0;
  const str = V.toString();
  const L = str.length;
  const KEEP = 17;
  const mant = L <= KEEP ? str : str.slice(0, KEEP);
  const exp = (L <= KEEP ? 0 : L - KEEP) - P;
  return Number(mant) * Math.pow(10, exp);
}

// K = sum|w_i| accumulator scale as a fixed-point BigInt.
const K_SCALED = BigInt(Math.round(K_ACC * 1e15)) * (10n ** BigInt(P - 15));

// At fixed digit budget D, is exp(-pi x/8) still recovered to relErr <= TOL off K?
function resolvesAt(x, D) {
  const yScaled = (PI_SCALED * BigInt(x)) / 8n;
  const T = expNeg(yScaled);
  const recovered = sigRound(K_SCALED + T, D) - sigRound(K_SCALED, D);
  return relErr(recovered, T) <= TOL;
}

// Scan x upward at fixed D to the sharp detach point (T monotone-decreasing in x).
function measureCeiling(D) {
  const X_LO = 100, X_HI = 280;
  let xCeiling = -1, detachAt = -1;
  for (let x = X_LO; x <= X_HI; x++) {
    if (resolvesAt(x, D)) {
      xCeiling = x;
    } else if (xCeiling > 0) {
      detachAt = x; // first failure past the last resolved x
      break;
    }
  }
  return { D, xCeiling, gamma: xCeiling / 2, detachAt };
}

// -- Run the measurement: fixed-budget x-ceilings bracketing quad D = 33.9 --
const D_LADDER = [30, 33, 34, 35];
const TABLE = D_LADDER.map(measureCeiling);
const ROW33 = TABLE.find((r) => r.D === 33);
const ROW34 = TABLE.find((r) => r.D === 34);

// Interpolate the quad D = 33.9 ceiling from the two bracketing integer rungs.
const X_QUAD_MEASURED = ROW33.xCeiling + (D_QUAD - 33) * (ROW34.xCeiling - ROW33.xCeiling);
const GAMMA_QUAD_MEASURED = X_QUAD_MEASURED / 2;

// imp-35811 OOM estimate: invert the measured slope (drops the guard offset).
const X_QUAD_OOM = D_QUAD / DIGITS_PER_X; // ~198.8 (gamma ~99.4); module rounded to ~200
const OOM_OVERSHOOT = X_QUAD_OOM - X_QUAD_MEASURED; // ~10 units the OOM overstated

// Guard-offset-corrected prediction xCeiling ~ (D - offset)/slope reproduces the measurement.
const X_QUAD_GUARD_PRED = (D_QUAD - GUARD_OFFSET) / DIGITS_PER_X; // ~187.0

// Cross-check the BigInt engine against the double library (calibration).
const T_AT_104_BIG = bigToNumber(expNeg((PI_SCALED * 104n) / 8n));
const T_AT_104_LIB = Math.exp(-PI * 104 / 8);
const EXP_RELERR_104 = Math.abs(T_AT_104_BIG / T_AT_104_LIB - 1);
const PI_RELERR = Math.abs(bigToNumber(PI_SCALED) / PI - 1);

export const IMP35851_QUAD_PRECISION_X_CEILING_MEASURED = {
  id: 'imp-35851',
  proofSection: 'S-frontier',
  question:
    'Measure the exact quad-precision (IEEE binary128, ~33.9 decimal digits) x-ceiling for the imp-35811 ' +
    'exp(-pi x/8)-on-K cancellation, sharpening the module OOM "quad reaches x ~ 200 (gamma ~ 100)" estimate ' +
    'to a MEASURED detach band by running the same BigInt sig-digit recovery at D = 33.9. Measurement only; ' +
    'extends no evaluator; changes no bound; NO QED.',
  method: {
    arithmetic: 'BigInt fixed-point at scale 10^' + P + ' (Machin pi; range-reduced repeated-squaring exp(-pi x/8))',
    accumulatorScale: K_ACC,
    fixedBudget: 'working-digit budget D held FIXED at the two integers bracketing quad (D = 33 and D = 34)',
    resolvableCriterion: 'signal exp(-pi x/8) recovered to 3 significant figures (relErr <= 1e-3) off K',
    tol: TOL,
    statement:
      'At fixed D, exp(-pi x/8) shrinks monotonically with x, so there is a sharp x-ceiling: the largest x whose ' +
      'signal is still recovered to relErr <= 1e-3 off K ~ 6.214e-2. We scan x in [100,280] at D = 33 and D = 34 ' +
      'and interpolate the quad D = 33.9 ceiling from the two measured integer rungs.',
  },
  table: TABLE, // [{ D, xCeiling, gamma, detachAt }] measured by the BigInt run
  quadCeiling: {
    Dquad: D_QUAD,
    xMeasured: X_QUAD_MEASURED, // ~188.6
    gammaMeasured: GAMMA_QUAD_MEASURED, // ~94.3
    xOOM: X_QUAD_OOM, // ~198.8 (imp-35811 inverted-slope OOM; module rounded to ~200)
    oomOvershoot: OOM_OVERSHOOT, // ~10 units the OOM overstated by dropping the guard offset
    xGuardPredicted: X_QUAD_GUARD_PRED, // ~187.0 -- (D - offset)/slope reproduces the measurement
    statement:
      'MEASURED quad ceiling x ~ 188.6 (gamma ~ 94.3), interpolated between the D = 33 rung (x = 185) and the ' +
      'D = 34 rung (x = 189). This is ~11 units (~5.5%) BELOW the imp-35811 OOM x ~ 200 (gamma ~ 100), the gap ' +
      'being exactly the ~+2 guard offset the OOM dropped: (33.9 - 2)/(pi/(8 ln10)) ~ 187.0 reproduces the ' +
      'measurement to within the O(1) guard. Quad ~doubles the double ceiling (x ~ 104 -> ~189) but lands at ' +
      'gamma ~ 94, not ~100.',
  },
  crossChecks: {
    expRelErrAt104: EXP_RELERR_104,
    piRelErr: PI_RELERR,
    statement:
      'The BigInt exp(-pi.104/8) reproduces the double library to < 1e-12 and the Machin pi reproduces Math.PI to ' +
      'machine precision -- the high-precision engine is calibrated before the ceilings are read.',
  },
  ignoredCosts:
    'Measures ONLY the exp(-pi x/8) underflow-driven mantissa-digit ceiling at the fixed quad budget, using the ' +
    'imp-35781-measured accumulator scale K. It does not evaluate the true H_0 at quad precision (no high-precision ' +
    'cos/quadrature) and ignores the SEPARATE growing costs of a real high-x run (node count, Phi-series term ' +
    'count, oscillatory argument reduction), all of which only worsen the picture.',
  isRigorous: false,
  verdict:
    'ARBITRARY-PRECISION MEASUREMENT (frontier-direction, NOT rigorous). Holding the working-digit budget FIXED at ' +
    'the integers bracketing quad (D = 33, 34) and scanning x with the same ~520-digit BigInt recovery imp-35811 ' +
    'used, the quad (IEEE binary128, ~33.9 digits) x-ceiling was MEASURED: xCeiling = 185 (gamma 92.5) at D = 33 ' +
    'and xCeiling = 189 (gamma 94.5) at D = 34, interpolating the quad D = 33.9 ceiling to x ~ 188.6 (gamma ~ 94.3). ' +
    'This sharpens the imp-35811 OOM x ~ 200 (gamma ~ 100), which had merely inverted the measured slope: the ' +
    '~11-unit (~5.5%) gap is exactly the ~+2 guard offset the OOM dropped, since (33.9 - 2)/(pi/(8 ln10)) ~ 187.0 ' +
    'reproduces the measurement. Quad ~doubles the double ceiling (x ~ 104 -> ~189) but lands at gamma ~ 94, not ' +
    '~100. It extends no evaluator, evaluates no true H_0 at quad precision, certifies no value at any height, and ' +
    'changes no bound. NO QED. No refereed bound is changed.',
  citation:
    'imp-35811 (D*(x) table; quad reach was OOM = 33.9/slope only); imp-35850 (guard offset confirmed x-flat ~+2); ' +
    'imp-35781 (double ceiling x in [94,106]; measured K); Platt-Trudgian 2021 (T_PT = 3e12; no refereed bound is changed).',
};

export const IMP35851_QUAD_PRECISION_X_CEILING_MEASURED_ASSERTIONS = [
  {
    // The BigInt high-precision engine is calibrated: exp and pi reproduce the double library.
    id: 'imp35851-bigint-engine-calibrated',
    description: 'BigInt Machin pi matches Math.PI to machine precision; BigInt exp(-pi.104/8) matches Math.exp to < 1e-12',
    holds: () => PI_RELERR < 1e-14 && EXP_RELERR_104 < 1e-12,
  },
  {
    // The ceiling ladder was actually measured: every rung a finite positive x-ceiling, monotone in D, sharp detach.
    id: 'imp35851-ceilings-measured-and-monotone',
    description: 'xCeiling(D) is finite/positive at each D rung, strictly increases with D, with detach exactly one x past it',
    holds: () => {
      for (const r of TABLE) {
        if (!(r.xCeiling > 0 && Number.isFinite(r.xCeiling))) return false;
        if (r.detachAt !== r.xCeiling + 1) return false;
      }
      for (let i = 1; i < TABLE.length; i++) if (!(TABLE[i].xCeiling > TABLE[i - 1].xCeiling)) return false;
      return TABLE.length === 4;
    },
  },
  {
    // The two integers bracketing quad measure the expected ~185/189 ceilings (gamma ~92.5/94.5).
    id: 'imp35851-quad-bracket-rungs',
    description: 'measured xCeiling(33) in [183,187] and xCeiling(34) in [187,191] bracket the quad D = 33.9 ceiling',
    holds: () =>
      ROW33.xCeiling >= 183 && ROW33.xCeiling <= 187 &&
      ROW34.xCeiling >= 187 && ROW34.xCeiling <= 191,
  },
  {
    // The interpolated quad ceiling lands at x ~ 189 (gamma ~ 94), MEASURABLY below the imp-35811 OOM ~200.
    id: 'imp35851-quad-ceiling-below-oom',
    description: 'measured quad ceiling x ~ 188.6 (gamma ~ 94.3) is below the imp-35811 OOM x ~ 199, by the dropped guard offset',
    holds: () =>
      X_QUAD_MEASURED > 186 && X_QUAD_MEASURED < 191 &&
      GAMMA_QUAD_MEASURED > 93 && GAMMA_QUAD_MEASURED < 95.5 &&
      X_QUAD_MEASURED < X_QUAD_OOM &&
      OOM_OVERSHOOT > 8 && OOM_OVERSHOOT < 13 &&
      Math.abs(X_QUAD_GUARD_PRED - X_QUAD_MEASURED) < 3, // guard-corrected prediction reproduces measurement
  },
  {
    // Honesty gate: measurement only; no evaluator extension; no high-precision H_0; NO QED; no refereed bound is changed.
    id: 'imp35851-honesty-gate-no-qed',
    description: 'Measurement only; extends no evaluator; certifies no value; changes no bound; NO QED; no refereed bound is changed',
    holds: () =>
      IMP35851_QUAD_PRECISION_X_CEILING_MEASURED.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /extends no evaluator/.test(IMP35851_QUAD_PRECISION_X_CEILING_MEASURED.verdict) &&
      /NO QED/.test(IMP35851_QUAD_PRECISION_X_CEILING_MEASURED.verdict) &&
      /refereed bound is changed/i.test(IMP35851_QUAD_PRECISION_X_CEILING_MEASURED.verdict),
  },
];

for (const a of IMP35851_QUAD_PRECISION_X_CEILING_MEASURED_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35851-quad-precision-x-ceiling-measured assertion failed: ${a.id}`);
  }
}
