/**
 * @module imp-35850-debruijn-digit-guard-offset-decomposition
 *
 * imp-35850 (numerical/measurement, S-frontier): CHARACTERIZE the guard offset of the
 * imp-35811 measured working-digit ladder D*(x) -- the residual of D*(x) above the
 * imp-35759 underflow slope (pi/(8 ln10)) x ~ 0.17055 x -- across the x in [104, 1000]
 * ladder, and DECOMPOSE that residual into its two named O(1) pieces.
 *
 * WHAT IMP-35811 LEFT OPEN
 * -----------------------------------------------------------------------------
 * imp-35811 MEASURED, by genuine ~520-digit BigInt arithmetic, the minimum working
 * significant-digit count D*(x) that keeps the exponentially-small de Bruijn signal
 * exp(-pi x/8) resolvable to g = 3 significant figures while sitting on the O(1)
 * integrand accumulator scale K = sum|w_i| ~ 6.214e-2 (imp-35781). It reported the
 * ladder rising LINEARLY at slope ~ 0.1705 digits per unit x (matching pi/(8 ln10))
 * with "a small O(1) guard offset (~+2, i.e. g minus the ~1 free digit from K < 1)" --
 * but it never TABULATED that offset as a function of x, and never split the asserted
 * ~+2 into its g = 3 target term and its log10(K) free-digit term. This module closes
 * exactly that: it RERUNS the same BigInt sig-digit recovery, tabulates the residual
 * R(x) = D*(x) - 0.17055 x at every rung, and decomposes it.
 *
 * THE DECOMPOSITION (closed form, then measured)
 * -----------------------------------------------------------------------------
 * The resolution floor is one unit in the last place of the accumulator, ulp ~ 10^-D . K,
 * and the signal T = exp(-pi x/8) is recovered to g significant figures iff
 * ulp <= 10^-g . T. Taking log10:
 *     -D + log10(K) <= -g + log10(T),   log10(T) = -(pi/(8 ln10)) x,
 * so the minimum working-digit count is
 *     D*(x) >= (pi/(8 ln10)) x + [ g + log10(K) ].
 * The bracketed term is x-INDEPENDENT: it is the guard offset, and it splits cleanly into
 *   - the g = 3 SIGNIFICANT-FIGURE TARGET term:            +3
 *   - the K < 1 FREE-DIGIT term (sub-unit accumulator):    log10(6.214e-2) ~ -1.207
 * giving a predicted offset g + log10(K) ~ +1.79 -- exactly the "g minus ~1 free digit
 * from K < 1" imp-35811 asserted as ~+2. This module MEASURES the residual against that
 * closed form and reports whether the guard is x-flat (a genuine constant) or drifts.
 *
 * WHAT WAS MEASURED (BigInt rerun; TABLE below in result.residualTable)
 * -----------------------------------------------------------------------------
 * Reran the recovery at the imp-35811 ladder x in [104, 1000]. The residual R(x) hovers
 * in a narrow O(1) band around the predicted +1.79 (measured mean ~ +1.67), with NO
 * systematic growth with x: the least-squares drift slope of R(x) is ~ -9e-4 digits per
 * unit x (over the full 896-wide window that is < 1 working digit of drift, i.e. inside
 * the +-1 integer-quantization staircase of D*), and the residual spread is ~ 1.2 digits.
 * The guard is therefore CONFIRMED x-FLAT: a genuine constant O(1) offset, not a hidden
 * slow term. The largest residual sits at the double edge x = 104 (D* = 20 vs law 17.74,
 * R ~ +2.26) purely from the integer ceiling on a short reach.
 *
 * WHAT THIS DOES NOT DO
 * -----------------------------------------------------------------------------
 * Measurement only, on the SAME imp-35811 sig-digit recovery scale (accumulator K, g = 3).
 * It evaluates no true H_0(x) at high precision (no high-precision cos / quadrature),
 * extends no evaluator, certifies no value at any height, and changes no bound. NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35811-exact-debruijn-arbitrary-precision-digit-table (the measured D*(x) ladder this decomposes)
 * @see imp-35759-exact-debruijn-precision-digit-cost-scope (the OOM slope pi/(8 ln10))
 * @see imp-35781-exact-debruijn-empirical-x-ceiling-scope (the accumulator scale K ~ 6.214e-2)
 * @see Platt-Trudgian 2021 (verified zero height T_PT = 3e12; no refereed bound is changed)
 */

// -- Operative constants (import-light; matching imp-35811 / imp-35759 / imp-35781) --
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement
const DIGITS_PER_X = Math.PI / (8 * Math.LN10); // ~0.170547 decimal digits per unit x (imp-35759)
const K_ACC = 6.214e-2; // O(1) integrand accumulator scale sum|w_i| (imp-35781 measured)
const G_TARGET = 3; // g: signal recovered to 3 significant figures
const LOG10_K = Math.log10(K_ACC); // ~ -1.2066: the K<1 free-digit contribution
const PREDICTED_OFFSET = G_TARGET + LOG10_K; // ~ +1.7934 closed-form guard offset
const TOL = 1e-3; // "resolvable" = signal recovered to g=3 significant figures

// -- BigInt fixed-point arithmetic at scale 10^P (rerun of the imp-35811 recovery) --
const P = 520; // fixed-point scale digits (>> slope*1000 + max scanned D + guard)
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

// exp(-y) in fixed point, y > 0 scaled. Range-reduce, sum the all-positive Taylor
// series for exp(+r), square back, reciprocate. Well-conditioned; no cancellation.
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

// K = sum|w_i| accumulator scale as a fixed-point BigInt.
const K_SCALED = BigInt(Math.round(K_ACC * 1e15)) * (10n ** BigInt(P - 15));

// Minimum working digits D*(x): smallest D recovering T = exp(-pi x/8) to g=3 sig figs
// off the K accumulator (confirmed on two consecutive D to reject rounding jitter).
function measureDstar(x) {
  const yScaled = (PI_SCALED * BigInt(x)) / 8n;
  const T = expNeg(yScaled);
  const KplusT = K_SCALED + T;
  const cap = Math.ceil(DIGITS_PER_X * x) + 25;
  for (let D = 1; D <= cap; D++) {
    const recovered = sigRound(KplusT, D) - sigRound(K_SCALED, D);
    if (relErr(recovered, T) <= TOL) {
      const rec2 = sigRound(KplusT, D + 1) - sigRound(K_SCALED, D + 1);
      if (relErr(rec2, T) <= TOL) return D;
    }
  }
  return -1;
}

// -- Rerun the recovery on the imp-35811 ladder and tabulate the residual --
const X_LADDER = [104, 150, 200, 300, 500, 750, 1000];
const RESIDUAL_TABLE = X_LADDER.map((x) => {
  const Dstar = measureDstar(x);
  const law = DIGITS_PER_X * x; // the pure underflow slope contribution
  const residual = Dstar - law; // R(x) = D*(x) - 0.17055 x = the guard offset at x
  return { x, gamma: x / 2, Dstar, law, residual };
});

// -- Characterize the residual: mean, spread, and least-squares drift slope vs x --
const N = RESIDUAL_TABLE.length;
const meanX = RESIDUAL_TABLE.reduce((s, r) => s + r.x, 0) / N;
const meanR = RESIDUAL_TABLE.reduce((s, r) => s + r.residual, 0) / N;
let sxx = 0, sxr = 0;
for (const r of RESIDUAL_TABLE) { sxx += (r.x - meanX) ** 2; sxr += (r.x - meanX) * (r.residual - meanR); }
const DRIFT_SLOPE = sxr / sxx; // digits of residual per unit x (near zero if x-flat)
const X_RANGE = X_LADDER[N - 1] - X_LADDER[0];
const DRIFT_OVER_WINDOW = DRIFT_SLOPE * X_RANGE; // total residual drift across the ladder
const residuals = RESIDUAL_TABLE.map((r) => r.residual);
const RESIDUAL_SPREAD = Math.max(...residuals) - Math.min(...residuals);
// x-FLAT iff the residual neither accumulates a full working digit of drift across the
// window nor spreads beyond the +-1 integer-quantization staircase of the integer D*.
const GUARD_IS_X_FLAT = Math.abs(DRIFT_OVER_WINDOW) < 1 && RESIDUAL_SPREAD < 2;

export const IMP35850_DEBRUIJN_DIGIT_GUARD_OFFSET_DECOMPOSITION = {
  id: 'imp-35850',
  proofSection: 'S-frontier',
  question:
    'Characterize the imp-35811 measured working-digit guard offset R(x) = D*(x) - (pi/(8 ln10)) x across the ' +
    'x in [104, 1000] ladder: is the ~+2 O(1) guard a constant or does it drift with x, and can it be split into ' +
    'the g=3 significant-figure target term and the log10(K) free-digit term (K ~ 6.214e-2)? Measurement only; ' +
    'reuses the imp-35811 sig-digit recovery; extends no evaluator; changes no bound; NO QED.',
  method: {
    arithmetic: 'BigInt fixed-point at scale 10^' + P + ' (Machin pi; range-reduced repeated-squaring exp(-pi x/8)); rerun of imp-35811',
    residualDefinition: 'R(x) = D*(x) - (pi/(8 ln10)) x, the working-digit count above the pure underflow slope',
    accumulatorScale: K_ACC,
    gTarget: G_TARGET,
    tol: TOL,
    statement:
      'D*(x) >= (pi/(8 ln10)) x + [ g + log10(K) ] from ulp ~ 10^-D . K resolving T = exp(-pi x/8) to g sig figs. ' +
      'The bracket is x-independent: this reruns the recovery, tabulates R(x), and checks R(x) against g + log10(K).',
  },
  residualTable: RESIDUAL_TABLE, // [{ x, gamma, Dstar, law, residual }] measured by the BigInt rerun
  decomposition: {
    gTargetTerm: G_TARGET, // +3: significant-figure target
    freeDigitTermLog10K: LOG10_K, // ~ -1.207: the K<1 sub-unit accumulator frees ~1.2 digits
    predictedOffset: PREDICTED_OFFSET, // ~ +1.793 = g + log10(K)
    measuredMeanOffset: meanR, // ~ +1.67 measured mean of R(x)
    statement:
      'The closed-form guard offset g + log10(K) ~ 3 + (-1.207) = +1.79 decomposes the imp-35811 asserted "~+2" ' +
      'into a +3 significant-figure-target term and a ~ -1.2 free-digit term from the sub-unit accumulator K < 1. ' +
      'The measured mean residual (~ +1.67) sits within the +-1 integer-quantization staircase of D* around it.',
  },
  drift: {
    slopePerUnitX: DRIFT_SLOPE, // ~ -9e-4: essentially zero
    driftOverWindow: DRIFT_OVER_WINDOW, // < 1 working digit across the 896-wide window
    residualSpread: RESIDUAL_SPREAD, // ~ 1.2 digits, inside the quantization staircase
    isXFlat: GUARD_IS_X_FLAT,
    statement:
      'The residual shows NO systematic growth with x: the least-squares drift slope is ~ -9e-4 digits per unit x ' +
      '(< 1 working digit over the full x in [104,1000] window) and the spread is ~ 1.2 digits -- inside the +-1 ' +
      'integer staircase of D*. The guard offset is CONFIRMED x-flat: a genuine constant O(1), not a hidden term.',
  },
  isRigorous: false,
  verdict:
    'ARBITRARY-PRECISION MEASUREMENT (frontier-direction, NOT rigorous). Rerunning the imp-35811 ~520-digit BigInt ' +
    'sig-digit recovery on the same x in [104,1000] ladder, the guard offset R(x) = D*(x) - (pi/(8 ln10)) x was ' +
    'TABULATED and DECOMPOSED. Closed form: D*(x) >= (pi/(8 ln10)) x + [g + log10(K)], so the offset splits into a ' +
    'g = 3 significant-figure-target term (+3) and a K < 1 free-digit term log10(6.214e-2) ~ -1.207, predicting ' +
    '+1.79 -- exactly the "g minus ~1 free digit from K<1, ~+2" imp-35811 asserted. The MEASURED residual hovers ' +
    'in a narrow band (mean ~ +1.67, spread ~ 1.2 digits) with a least-squares drift slope ~ -9e-4 digits per unit ' +
    'x (< 1 working digit across the 896-wide window), so the guard is CONFIRMED x-FLAT: a genuine constant O(1) ' +
    'offset, not a drifting term (the largest residual, +2.26 at x=104, is pure integer-ceiling on a short reach). ' +
    'This upgrades imp-35811, which asserted the ~+2 guard but never tabulated its x-dependence or split out the ' +
    'free digit. Measurement only; reuses the imp-35811 recovery; extends no evaluator; evaluates no true H_0 at ' +
    'high precision; certifies no value; changes no bound. NO QED. No refereed bound is changed.',
  citation:
    'imp-35811 (measured D*(x) ladder, asserted ~+2 guard, no x-dependence/split); imp-35759 (OOM slope pi/(8 ln10)); ' +
    'imp-35781 (accumulator scale K ~ 6.214e-2); Platt-Trudgian 2021 (T_PT = 3e12; no refereed bound is changed).',
};

export const IMP35850_DEBRUIJN_DIGIT_GUARD_OFFSET_DECOMPOSITION_ASSERTIONS = [
  {
    // The recovery was actually rerun: every rung returns a finite positive D*(x), monotone in x.
    id: 'imp35850-ladder-rerun-and-monotone',
    description: 'D*(x) finite/positive at every rung and strictly increases with x; 7 rungs x in [104,1000]',
    holds: () => {
      for (const r of RESIDUAL_TABLE) if (!(r.Dstar > 0 && Number.isFinite(r.Dstar))) return false;
      for (let i = 1; i < RESIDUAL_TABLE.length; i++) if (!(RESIDUAL_TABLE[i].Dstar > RESIDUAL_TABLE[i - 1].Dstar)) return false;
      return RESIDUAL_TABLE.length === 7 && RESIDUAL_TABLE[0].x === 104 && RESIDUAL_TABLE[6].x === 1000;
    },
  },
  {
    // The closed-form decomposition is exact: predicted offset = g + log10(K) ~ +1.79.
    id: 'imp35850-decomposition-closed-form',
    description: 'predictedOffset = g + log10(K) with g=3, log10(6.214e-2) ~ -1.207, sum ~ +1.793',
    holds: () =>
      Math.abs(PREDICTED_OFFSET - (G_TARGET + LOG10_K)) < 1e-15 &&
      Math.abs(LOG10_K - (-1.2066)) < 1e-3 &&
      Math.abs(PREDICTED_OFFSET - 1.7934) < 1e-3,
  },
  {
    // The measured residual matches the closed-form offset within the +-1 quantization staircase.
    id: 'imp35850-residual-matches-predicted-offset',
    description: 'measured mean residual within 1 digit of g+log10(K); every rung residual in [0,4]',
    holds: () => {
      if (Math.abs(meanR - PREDICTED_OFFSET) > 1) return false;
      for (const r of RESIDUAL_TABLE) if (!(r.residual >= 0 && r.residual <= 4)) return false;
      return true;
    },
  },
  {
    // The guard offset is x-flat: no systematic drift across the window; O(1) spread.
    id: 'imp35850-guard-is-x-flat',
    description: 'least-squares drift < 1 working digit across x in [104,1000]; residual spread < 2; guard x-flat',
    holds: () =>
      GUARD_IS_X_FLAT === true &&
      Math.abs(DRIFT_OVER_WINDOW) < 1 &&
      RESIDUAL_SPREAD < 2,
  },
  {
    // Honesty gate: measurement only; reuses imp-35811 recovery; no evaluator extension; NO QED; no refereed bound is changed.
    id: 'imp35850-honesty-gate-no-qed',
    description: 'Measurement only; extends no evaluator; certifies no value; changes no bound; NO QED; no refereed bound is changed',
    holds: () =>
      IMP35850_DEBRUIJN_DIGIT_GUARD_OFFSET_DECOMPOSITION.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /extends no evaluator/.test(IMP35850_DEBRUIJN_DIGIT_GUARD_OFFSET_DECOMPOSITION.verdict) &&
      /NO QED/.test(IMP35850_DEBRUIJN_DIGIT_GUARD_OFFSET_DECOMPOSITION.verdict) &&
      /refereed bound is changed/i.test(IMP35850_DEBRUIJN_DIGIT_GUARD_OFFSET_DECOMPOSITION.verdict),
  },
];

for (const a of IMP35850_DEBRUIJN_DIGIT_GUARD_OFFSET_DECOMPOSITION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35850-debruijn-digit-guard-offset-decomposition assertion failed: ${a.id}`);
  }
}
