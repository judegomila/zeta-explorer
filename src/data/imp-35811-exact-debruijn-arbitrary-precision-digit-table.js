/**
 * @module imp-35811-exact-debruijn-arbitrary-precision-digit-table
 *
 * imp-35811 (numerical/measurement, S-frontier): TABULATE, by actually RUNNING
 * arbitrary-precision (BigInt) arithmetic, the working-digit count D*(x) the exact
 * de Bruijn evaluator (scripts/imp-34813-exact-debruijn-winding-offline.mjs) needs
 * to keep the exponentially-small signal |H_0(x)| ~ exp(-pi x/8) resolvable, at a
 * ladder of x ABOVE the double-precision x ~< 104 (gamma ~< 52) ceiling.
 *
 * WHY THIS IS NEW (over imp-35759 and imp-35781)
 * -----------------------------------------------------------------------------
 * imp-35759 supplied only an ORDER-OF-MAGNITUDE digit-cost estimate (the linear law
 * D_underflow(x) = (pi/(8 ln10)) x ~ 0.17055 x) and explicitly RAN NO arbitrary-
 * precision computation. imp-35781 MEASURED the double-precision ceiling empirically
 * (detach band x in [94,106]) but likewise "runs no arbitrary-precision arithmetic".
 * This module closes that exact gap: it performs a genuine multi-hundred-digit
 * BigInt fixed-point computation -- Machin-series pi and a range-reduced / repeated-
 * squaring exp(-pi x/8) -- and MEASURES, at each x on a ladder up to x = 1000
 * (gamma = 500, ~10x above the double ceiling), the minimum number of working
 * significant digits D*(x) at which the tiny signal is recovered to 3 significant
 * figures while sitting on the O(1) integrand accumulator scale K = sum|w_i| ~ 6.214e-2
 * (the scale imp-35781 measured). It then confirms the MEASURED D*(x) tracks the
 * 0.17055 x law and reads off the T_PT-scale extrapolation from the measured slope.
 *
 * THE MEASUREMENT (all BigInt; no library; import-light)
 * -----------------------------------------------------------------------------
 * The evaluator forms H_0(x) = sum_i w_i cos(x u_i): the terms are O(w_i) and the
 * accumulator reaches magnitude ~ K = sum|w_i| ~ 6.214e-2, yet the RESULT is
 * exp(-pi x/8)-small -- a catastrophic cancellation of ratio ~ K/|H_0| ~ exp(+pi x/8).
 * In D-significant-digit floating arithmetic the resolution floor for a signal sitting
 * on an accumulator of magnitude K is one unit-in-last-place, ulp ~ 10^-D . K. The
 * signal is recovered to g significant digits iff ulp <= 10^-g . |H_0|.
 * We MEASURE this directly: with T = exp(-pi x/8) computed to ~520-digit BigInt
 * precision, we round both K and K+T to D significant digits (BigInt sig-digit
 * rounding) and check whether their difference recovers T to relErr <= 1e-3 (g = 3):
 *     recovered(D) = sigRound(K+T, D) - sigRound(K, D),  relErr = |recovered - T| / T,
 * and take D*(x) = smallest D with relErr <= 1e-3 (confirmed on two consecutive D to
 * reject rounding jitter). This is the faithful sig-digit analogue of the u.K
 * cancellation noise imp-35781 measured at double precision (eps.K ~ 1.38e-17).
 *
 * WHAT WAS MEASURED (BigInt run, TABLE below in result.table)
 * -----------------------------------------------------------------------------
 * The measured ladder D*(x) rises LINEARLY at slope ~ 0.17055 digits per unit x --
 * matching pi/(8 ln10) to a few percent -- with a small O(1) guard offset (~+2, i.e.
 * g minus the ~1 free digit from K < 1). Representative measured rungs:
 *   x=104 (double edge): D* ~ 20   x=200 (gamma=100): D* ~ 36
 *   x=500 (gamma=250):  D* ~ 87   x=1000 (gamma=500): D* ~ 172
 * so ~6 units of x per extra working digit, reach LINEAR in digits -- confirming, by
 * actual high-precision arithmetic, the imp-35759 law that imp-35781 confirmed only
 * against the double ceiling. Quad (IEEE binary128, ~33.9 digits) lands at x ~ 200
 * (gamma ~ 100), ~doubling the double height; the measured slope extrapolates the
 * T_PT target x = 2.T_PT = 6e12 to D* ~ 1.02e12 decimal digits (~425 GB of mantissa
 * per evaluated value) -- the same categorical wall imp-35759/imp-35781 named, now
 * anchored to a MEASURED slope rather than an assumed one.
 *
 * WHAT THIS DOES NOT DO
 * -----------------------------------------------------------------------------
 * Measures ONLY the underflow-driven mantissa-digit requirement of the exp(-pi x/8)
 * cancellation, using the imp-35781-measured accumulator scale K. It does NOT evaluate
 * the true H_0(x) at high precision (no high-precision cos / quadrature), extend the
 * evaluator, or run at T_PT; and it ignores the SEPARATE growing costs a real high-x
 * run carries (integrand node count, Phi-series term count, oscillatory argument-
 * reduction precision), all of which only worsen the picture. Measurement only;
 * extends no evaluator; certifies no value at any height; changes no bound; NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35759-exact-debruijn-precision-digit-cost-scope (the OOM digit law; ran no arbitrary-precision arithmetic)
 * @see imp-35781-exact-debruijn-empirical-x-ceiling-scope (measured the DOUBLE ceiling; ran no arbitrary-precision arithmetic)
 * @see scripts/imp-34813-exact-debruijn-winding-offline.mjs (the exact evaluator; window x in [20,104], floor ~1e-17)
 * @see project_winding_thread_closed_corrected (imp-34813: Gaussian conv proxy = EXACT de Bruijn flow at t = -4 tau_repo)
 * @see Platt-Trudgian 2021 (verified zero height T_PT = 3e12; no refereed bound is changed)
 */

// -- Anchor + operative constants (import-light; matching imp-35759 / imp-35781) --
const T_PT = 3e12; // Platt-Trudgian 2021 verified zero-ordinate (gamma) height
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement
const X_TPT = 2 * T_PT; // x = 2 gamma convention; T_PT ordinate maps to x = 6e12
const PI = Math.PI;
const DIGITS_PER_X = PI / (8 * Math.LN10); // ~0.170547 decimal digits per unit x (imp-35759)
const K_ACC = 6.214e-2; // O(1) integrand accumulator scale sum|w_i| (imp-35781 measured)
const TOL = 1e-3; // "resolvable" = signal recovered to g = 3 significant figures

// -- BigInt fixed-point arithmetic at scale 10^P (P working digits below the unit) --
const P = 520; // fixed-point scale digits: >> DIGITS_PER_X*1000 (~170.6) + max scanned D + guard
const ONE = 10n ** BigInt(P);

// arctan(1/k) in fixed point (Machin building block; alternating power series in 1/k^2).
function atanInv(k) {
  const kk = BigInt(k), k2 = kk * kk;
  let term = ONE / kk; // (1/k) scaled
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

// exp(-y) in fixed point, y > 0 scaled. Range-reduce y -> y/2^s < ~0.1, sum the
// (all-positive) Taylor series for exp(+r), square s times to get exp(y), then take
// the reciprocal. All well-conditioned: no series cancellation, no huge alternation.
function expNeg(yScaled) {
  let s = 0;
  let r = yScaled;
  const RCAP = ONE / 10n; // reduce until |r| < 0.1
  while (r > RCAP) { r /= 2n; s += 1; }
  // exp(+r) via sum_{n>=0} r^n / n!
  let term = ONE; // n = 0
  let sum = ONE;
  let n = 1n;
  while (term !== 0n) {
    term = (term * r) / ONE / n;
    sum += term;
    n += 1n;
  }
  // square s times: exp(2^s r) = exp(y)
  let expY = sum;
  for (let i = 0; i < s; i++) expY = (expY * expY) / ONE;
  // reciprocal: exp(-y) = 1 / exp(y), scaled
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

// Relative error |a - T| / T as a double, computed from same-scale BigInts.
function relErr(recovered, T) {
  if (T <= 0n) return Infinity;
  let d = recovered - T;
  if (d < 0n) d = -d;
  return Number((d * 1000000000000n) / T) / 1e12;
}

// Approximate V / 10^P as a double (for cross-checks against Math.exp) without overflow.
function bigToNumber(V) {
  if (V === 0n) return 0;
  const str = V.toString();
  const L = str.length;
  const KEEP = 17;
  const mant = L <= KEEP ? str : str.slice(0, KEEP);
  const exp = (L <= KEEP ? 0 : L - KEEP) - P;
  return Number(mant) * Math.pow(10, exp);
}

// K = sum|w_i| accumulator scale as a fixed-point BigInt (~15 sig figs, all we know it to).
const K_SCALED = BigInt(Math.round(K_ACC * 1e15)) * (10n ** BigInt(P - 15));

// -- Run the measurement: minimum working digits D*(x) at a ladder of x above 104 --
function measureDstar(x) {
  const yScaled = (PI_SCALED * BigInt(x)) / 8n; // pi x / 8, scaled
  const T = expNeg(yScaled); // exp(-pi x/8), scaled BigInt
  const KplusT = K_SCALED + T;
  const cap = Math.ceil(DIGITS_PER_X * x) + 25;
  let firstBelow = -1;
  for (let D = 1; D <= cap; D++) {
    const recovered = sigRound(KplusT, D) - sigRound(K_SCALED, D);
    const re = relErr(recovered, T);
    if (re <= TOL) {
      // confirm on the next digit too (reject rounding jitter)
      const rec2 = sigRound(KplusT, D + 1) - sigRound(K_SCALED, D + 1);
      if (relErr(rec2, T) <= TOL) { firstBelow = D; break; }
    }
  }
  return { x, gamma: x / 2, T: bigToNumber(T), Dstar: firstBelow, law: DIGITS_PER_X * x };
}

const X_LADDER = [104, 150, 200, 300, 500, 750, 1000];
const TABLE = X_LADDER.map(measureDstar);

// Measured slope (digits per unit x) from the ladder endpoints, and the guard offset.
const rTop = TABLE[TABLE.length - 1], rBot = TABLE[0];
const SLOPE_MEASURED = (rTop.Dstar - rBot.Dstar) / (rTop.x - rBot.x);
const GUARD_OFFSET = rBot.Dstar - DIGITS_PER_X * rBot.x; // ~ +2 (g minus the ~1 free digit from K<1)

// T_PT extrapolation from the MEASURED slope.
const DIGITS_TPT_MEASURED = SLOPE_MEASURED * X_TPT;
const GB_TPT = (DIGITS_TPT_MEASURED * Math.log2(10)) / 8 / 1e9;
const REACH_QUAD128 = 33.9 / SLOPE_MEASURED; // working-digit reach of IEEE binary128

// Cross-check the BigInt exp against the double library at the double edge x = 104.
const T_AT_104_BIG = bigToNumber(expNeg((PI_SCALED * 104n) / 8n));
const T_AT_104_LIB = Math.exp(-PI * 104 / 8);
const EXP_RELERR_104 = Math.abs(T_AT_104_BIG / T_AT_104_LIB - 1);
// Cross-check the BigInt Machin pi against the double library.
const PI_RELERR = Math.abs(bigToNumber(PI_SCALED) / PI - 1);

export const IMP35811_EXACT_DEBRUIJN_ARBITRARY_PRECISION_DIGIT_TABLE = {
  id: 'imp-35811',
  proofSection: 'S-frontier',
  question:
    'Tabulate, by actually running arbitrary-precision (BigInt) arithmetic, the working-digit count D*(x) the ' +
    'exact de Bruijn evaluator needs to keep exp(-pi x/8) resolvable, at a ladder of x above the double-precision ' +
    'x ~< 104 (gamma ~< 52) ceiling toward T_PT-scale heights. Measurement only; extends no evaluator; changes no ' +
    'bound; NO QED.',
  method: {
    arithmetic: 'BigInt fixed-point at scale 10^' + P + ' (Machin-series pi; range-reduced repeated-squaring exp(-pi x/8))',
    accumulatorScale: K_ACC, // sum|w_i| ~ 6.214e-2 (imp-35781 measured)
    resolvableCriterion: 'signal exp(-pi x/8) recovered to 3 significant figures (relErr <= 1e-3) off the K accumulator',
    tol: TOL,
    statement:
      'For each x, exp(-pi x/8) is computed to ~520-digit BigInt precision; K = sum|w_i| ~ 6.214e-2 and K+T are ' +
      'rounded to D significant digits and their difference must recover T to relErr <= 1e-3. D*(x) = smallest such ' +
      'D. This is the sig-digit analogue of the u.K cancellation noise imp-35781 measured at double precision.',
  },
  table: TABLE, // [{ x, gamma, T, Dstar, law }] measured by the BigInt run
  digitLaw: {
    formula: 'D_underflow(x) = (pi/(8 ln10)) x ~ 0.17055 x (imp-35759)',
    digitsPerX: DIGITS_PER_X,
    slopeMeasured: SLOPE_MEASURED, // ~0.1705 from the measured ladder
    guardOffset: GUARD_OFFSET, // ~+2
    statement:
      'The MEASURED ladder D*(x) rises linearly at slope ~ 0.1705 digits per unit x -- matching pi/(8 ln10) ~ 0.17055 ' +
      'to within a few percent -- with a small +O(1) guard offset. The imp-35759 linear law is now confirmed by ' +
      'actual high-precision arithmetic, not just against the double ceiling (imp-35781).',
  },
  crossChecks: {
    expRelErrAt104: EXP_RELERR_104, // BigInt exp(-pi.104/8) vs Math.exp
    piRelErr: PI_RELERR, // BigInt Machin pi vs Math.PI
    statement:
      'The BigInt exp(-pi.104/8) reproduces the double library to < 1e-12 and the Machin pi reproduces Math.PI to ' +
      'machine precision -- the high-precision engine is calibrated before the ladder is read.',
  },
  wideningBuys: {
    reachQuad128: REACH_QUAD128, // ~199 (gamma ~100) -- quad ~doubles the double height
    xTPT: X_TPT,
    digitsTPTMeasured: DIGITS_TPT_MEASURED, // ~1.02e12 from the MEASURED slope
    gigabytesTPT: GB_TPT, // ~425 GB per evaluated value
    statement:
      'Reach is LINEAR in working digits. Quad (IEEE binary128, ~33.9 digits) reaches x ~ 200 (gamma ~ 100), ' +
      '~doubling the double height. Extrapolating the MEASURED slope, the T_PT target x = 6e12 needs ~1.02e12 ' +
      'decimal digits (~425 GB of mantissa per value) -- the same categorical wall imp-35759/imp-35781 named, now ' +
      'anchored to a measured slope.',
  },
  ignoredCosts:
    'Measures ONLY the exp(-pi x/8) underflow-driven mantissa-digit requirement, using the imp-35781-measured ' +
    'accumulator scale K. It does not evaluate the true H_0 at high precision (no high-precision cos/quadrature) ' +
    'and ignores the SEPARATE growing costs of a real high-x run (integrand node count, Phi-series term count, ' +
    'oscillatory argument reduction), all of which only worsen the picture.',
  isRigorous: false,
  verdict:
    'ARBITRARY-PRECISION MEASUREMENT (frontier-direction, NOT rigorous). Running genuine ~520-digit BigInt ' +
    'arithmetic (Machin pi, range-reduced repeated-squaring exp), the minimum working-digit count D*(x) that keeps ' +
    'exp(-pi x/8) resolvable to 3 significant figures off the O(1) accumulator K ~ 6.214e-2 was TABULATED at a ' +
    'ladder x in [104, 1000] (gamma in [52, 500]): D* ~ 20 at the double edge x = 104, rising LINEARLY at measured ' +
    'slope ~ 0.1705 digits per unit x (matching pi/(8 ln10) ~ 0.17055) with a ~+2 guard offset, to D* ~ 172 at ' +
    'x = 1000. Quad (~33.9 digits) reaches x ~ 200 (~doubling the double height); the measured slope extrapolates ' +
    'the T_PT target x = 6e12 to ~1.02e12 decimal digits (~425 GB per value) -- a categorical wall. This upgrades ' +
    'imp-35759 (OOM only) and imp-35781 (double only), both of which ran NO arbitrary-precision arithmetic, to a ' +
    'MEASURED digit table. It extends no evaluator, evaluates no true H_0 at high precision, certifies no value at ' +
    'any height, and changes no bound. NO QED. No refereed bound is changed.',
  citation:
    'imp-35759 (OOM digit law, no arbitrary-precision run); imp-35781 (measured the double ceiling, no arbitrary-' +
    'precision run); scripts/imp-34813-exact-debruijn-winding-offline.mjs (the exact evaluator; window x in [20,104]); ' +
    'Platt-Trudgian 2021 (T_PT = 3e12; no refereed bound is changed).',
};

export const IMP35811_EXACT_DEBRUIJN_ARBITRARY_PRECISION_DIGIT_TABLE_ASSERTIONS = [
  {
    // The BigInt high-precision engine is calibrated: exp and pi reproduce the double library.
    id: 'imp35811-bigint-engine-calibrated',
    description: 'BigInt Machin pi matches Math.PI to machine precision; BigInt exp(-pi.104/8) matches Math.exp to < 1e-12',
    holds: () => PI_RELERR < 1e-14 && EXP_RELERR_104 < 1e-12,
  },
  {
    // The ladder was actually measured: every rung returns a finite positive D*(x), monotone in x.
    id: 'imp35811-ladder-measured-and-monotone',
    description: 'D*(x) is finite/positive at every ladder rung and strictly increases with x',
    holds: () => {
      for (const r of TABLE) if (!(r.Dstar > 0 && Number.isFinite(r.Dstar))) return false;
      for (let i = 1; i < TABLE.length; i++) if (!(TABLE[i].Dstar > TABLE[i - 1].Dstar)) return false;
      return TABLE.length === 7;
    },
  },
  {
    // The double edge x=104 needs ~18-22 digits (the ~18-digit double budget stretched to the ~1e-17 floor).
    id: 'imp35811-double-edge-digit-count',
    description: 'measured D*(104) in [17,23] -- brackets the ~18-digit double budget of the observed ceiling',
    holds: () => rBot.x === 104 && rBot.Dstar >= 17 && rBot.Dstar <= 23,
  },
  {
    // The measured slope matches pi/(8 ln10): the imp-35759 linear law confirmed by real high-precision arithmetic.
    id: 'imp35811-measured-slope-matches-law',
    description: 'measured slope dD*/dx matches pi/(8 ln10) ~ 0.17055 to within 5%; each rung within +-3 of law+offset',
    holds: () => {
      if (Math.abs(SLOPE_MEASURED / DIGITS_PER_X - 1) > 0.05) return false;
      for (const r of TABLE) {
        if (Math.abs(r.Dstar - (DIGITS_PER_X * r.x + GUARD_OFFSET)) > 3) return false;
      }
      return true;
    },
  },
  {
    // T_PT extrapolation from the MEASURED slope reproduces the imp-35759/imp-35781 categorical wall.
    id: 'imp35811-tpt-wall-from-measured-slope',
    description: 'x_TPT=6e12 extrapolates to ~1.0e12 digits (~425 GB/value); quad reach x~200 (~doubles double height)',
    holds: () =>
      X_TPT === 6e12 &&
      Math.abs(DIGITS_TPT_MEASURED / 1.023e12 - 1) < 0.05 &&
      GB_TPT > 400 && GB_TPT < 450 &&
      REACH_QUAD128 > 185 && REACH_QUAD128 < 215,
  },
  {
    // Honesty gate: measurement only; no evaluator extension; no high-precision H_0; NO QED; no refereed bound is changed.
    id: 'imp35811-honesty-gate-no-qed',
    description: 'Measurement only; extends no evaluator; certifies no value; changes no bound; NO QED; no refereed bound is changed',
    holds: () =>
      IMP35811_EXACT_DEBRUIJN_ARBITRARY_PRECISION_DIGIT_TABLE.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /extends no evaluator/.test(IMP35811_EXACT_DEBRUIJN_ARBITRARY_PRECISION_DIGIT_TABLE.verdict) &&
      /NO QED/.test(IMP35811_EXACT_DEBRUIJN_ARBITRARY_PRECISION_DIGIT_TABLE.verdict) &&
      /refereed bound is changed/i.test(IMP35811_EXACT_DEBRUIJN_ARBITRARY_PRECISION_DIGIT_TABLE.verdict),
  },
];

for (const a of IMP35811_EXACT_DEBRUIJN_ARBITRARY_PRECISION_DIGIT_TABLE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35811-exact-debruijn-arbitrary-precision-digit-table assertion failed: ${a.id}`);
  }
}
