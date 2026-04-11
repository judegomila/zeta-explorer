/**
 * imp-413: Multi-precision arithmetic (MPFR-equivalent) verification of the
 * four Polymath15 bridge constants C_H, C_C, C_T, C_F.
 *
 * Implements double-double arithmetic (Dekker 1971) giving approximately
 * 32 significant decimal digits (vs 15-16 for IEEE 754 double).
 *
 * Verification goal: confirm that the Float64 values of the four bridge
 * constants used throughout the proof chain are not artifacts of accumulated
 * rounding errors. Each constant is certified to agree with its double-double
 * counterpart to within 5 ulp (unit in the last place).
 *
 * Method
 * ------
 * For each constant f we compute f_DD (double-double, ~32 digits) and
 * f_F64 (standard Float64) and check |f_F64 - f_DD| < 5 * |f_F64| * eps_mach.
 * Since eps_mach = 2^{-52} approximately 2.22e-16, a 5-ulp bound means the
 * Float64 result is correct to at least 15.3 decimal digits -- the full
 * precision of IEEE 754 double.
 *
 * Double-double reference: T.J. Dekker,
 * "A floating-point technique for extending the available precision",
 * Numerische Mathematik 18 (1971) 224-242.
 *
 * Companion Lean 4 file: lean/LambdaAttack/Constants.lean (imp-410).
 */

// ── Machine epsilon (2^{-52}) ─────────────────────────────────────────────────
const EPS_MACH = 2.220446049250313e-16;

// ── Double-double arithmetic ──────────────────────────────────────────────────
// A double-double (DD) number is a pair [hi, lo] representing hi + lo
// where |lo| <= 0.5 * ulp(hi). This gives ~32 significant decimal digits
// from two standard IEEE 754 doubles.

/**
 * Exact addition: returns [sum, error] such that a + b = sum + error exactly.
 * Knuth TAOCP Vol.2 two-sum algorithm (no rounding loss).
 */
function twoSum(a, b) {
  const s = a + b;
  const v = s - a;
  const e = (a - (s - v)) + (b - v);
  return [s, e];
}

/**
 * Veltkamp splitter: splits a float into two halves of at most 26 bits each.
 * Uses the factor 2^27 + 1 = 134217729.
 */
function veltkampSplit(a) {
  const t = 134217729 * a;
  const hi = t - (t - a);
  const lo = a - hi;
  return [hi, lo];
}

/**
 * Exact product: returns [prod, error] such that a * b = prod + error exactly.
 * Dekker 1971 algorithm via Veltkamp splitting.
 */
function twoProd(a, b) {
  const p = a * b;
  const [ah, al] = veltkampSplit(a);
  const [bh, bl] = veltkampSplit(b);
  const e = ((ah * bh - p) + ah * bl + al * bh) + al * bl;
  return [p, e];
}

/** Double-double addition: (xh+xl) + (yh+yl). Returns [hi, lo]. */
function ddAdd([xh, xl], [yh, yl]) {
  const [sh, se] = twoSum(xh, yh);
  const [th, te] = twoSum(xl, yl);
  const c = se + th;
  const [vh, ve] = twoSum(sh, c);
  const w = te + ve;
  return twoSum(vh, w);
}

/** Double-double multiplication: (xh+xl) * (yh+yl). Returns [hi, lo]. */
function ddMul([xh, xl], [yh, yl]) {
  const [ph, pl] = twoProd(xh, yh);
  const q = xh * yl + xl * yh;
  return twoSum(ph, pl + q);
}

/** Double-double division: (xh+xl) / (yh+yl). Returns [hi, lo]. */
function ddDiv([xh, xl], [yh, yl]) {
  const qh = xh / yh;
  const [ph, pl] = twoProd(qh, yh);
  const [rh, rl] = ddAdd([xh, xl], [-ph, -pl]);
  const ql = (rh + rl) / yh;
  return twoSum(qh, ql);
}

/**
 * Double-double square root via one Newton-Raphson step from Float64 seed.
 * Starting from y0 = Math.sqrt(xh), one Newton step in double-double gives
 * y1 = y0 + (x - y0^2) / (2*y0), accurate to ~32 digits.
 */
function ddSqrt([xh, xl]) {
  if (xh <= 0) return [0, 0];
  const yh = Math.sqrt(xh);
  const [y2h, y2l] = ddMul([yh, 0], [yh, 0]);
  const [errh, errl] = ddAdd([xh, xl], [-y2h, -y2l]);
  const [corrh, corrl] = ddDiv([errh, errl], [2 * yh, 0]);
  return ddAdd([yh, 0], [corrh, corrl]);
}

/**
 * Double-double natural logarithm via Newton correction.
 *
 * Let lh = Math.log(xh) (correctly-rounded Float64 approx of log(x)).
 * Then x = exp(lh) * exp(eta) where eta = log(x) - lh = O(eps).
 * So x / exp(lh) = 1 + delta where delta = (xh - exp(lh)) / exp(lh) + xl/exp(lh).
 * Therefore log(x) = lh + log(1 + delta) = lh + delta - delta^2/2 + O(delta^3).
 * Since |delta| < 2*eps, the delta^3 term is < 8*eps^3 < 1e-47, negligible.
 * This gives log(x) to ~32 significant digits.
 */
function ddLog([xh, xl]) {
  const lh = Math.log(xh);
  const eh = Math.exp(lh);
  const delta = (xh - eh) / eh + xl / eh;
  const corr = delta - delta * delta * 0.5;
  return twoSum(lh, corr);
}

// ── Pi in double-double ───────────────────────────────────────────────────────
// Math.PI = 3.141592653589793115... (IEEE 754 correctly-rounded double)
// true pi = 3.14159265358979323846...
// The low part is the QD-library correction: pi = Math.PI + 1.2246467991473532e-16.
const DD_PI = [Math.PI, 1.2246467991473532e-16];

// ── ulpError helper ───────────────────────────────────────────────────────────
function ulpError(f64, ddVal) {
  if (f64 === 0) return 0;
  return Math.abs(f64 - ddVal) / (Math.abs(f64) * EPS_MACH);
}

// ── Verify C_H = 1/8 ─────────────────────────────────────────────────────────
// C_H is an exact IEEE 754 dyadic fraction: 1/8 = 0.125 = 2^{-3}.
// No rounding error is possible. Certified with zero ulp error.
const C_H_FLOAT64 = 1 / 8;
const C_H_DD = [1 / 8, 0];
const C_H_DD_VAL = C_H_DD[0] + C_H_DD[1];
const C_H_ULP_ERR = ulpError(C_H_FLOAT64, C_H_DD_VAL);
const C_H_CERTIFIED = C_H_ULP_ERR === 0;

// ── Verify C_C = (1/8) * sqrt(3 * pi) ───────────────────────────────────────
// C_C is the collision constant from imp-399. Computed via double-double sqrt.
// Expected Float64 value: C_H * sqrt(3 * pi) = 0.125 * sqrt(9.42478...) ~= 0.38375...
const DD_3PI = ddMul([3, 0], DD_PI);
const DD_SQRT_3PI = ddSqrt(DD_3PI);
const DD_C_C = ddMul(C_H_DD, DD_SQRT_3PI);

const C_C_FLOAT64 = (1 / 8) * Math.sqrt(3 * Math.PI);
const C_C_DD_VAL = DD_C_C[0] + DD_C_C[1];
const C_C_ULP_ERR = ulpError(C_C_FLOAT64, C_C_DD_VAL);
const C_C_CERTIFIED = C_C_ULP_ERR < 5;

// ── Verify C_T(T0) = (3*log(T0) - 6) / (2*log(T0)) ──────────────────────────
// C_T is the truncation constant from imp-397. Evaluated at representative
// T0 values from the imp-360 Dyson ladder. Uses ddLog for the log computation.

function C_T_float64(T0) {
  const L = Math.log(T0);
  return (3 * L - 6) / (2 * L);
}

function C_T_dd(T0) {
  const logT0 = ddLog([T0, 0]);
  const numer = ddAdd(ddMul([3, 0], logT0), [-6, 0]);
  const denom = ddMul([2, 0], logT0);
  return ddDiv(numer, denom);
}

// ── Verify C_F(T0) = (log(T0 / (2*pi)) + 1) / (2*pi) ────────────────────────
// C_F is the flow constant from imp-398. Evaluated at representative T0 values.

function C_F_float64(T0) {
  return (Math.log(T0 / (2 * Math.PI)) + 1) / (2 * Math.PI);
}

function C_F_dd(T0) {
  const twoPi = ddMul([2, 0], DD_PI);
  const ratio = ddDiv([T0, 0], twoPi);
  const logRatio = ddLog(ratio);
  const numer = ddAdd(logRatio, [1, 0]);
  return ddDiv(numer, twoPi);
}

// ── Ladder T0 values from imp-360 (representative subset) ────────────────────
const LADDER_T0_VALUES = [3000, 10000, 100000, 1e7, 1e10];

const C_T_VERIFICATION = LADDER_T0_VALUES.map(T0 => {
  const f64 = C_T_float64(T0);
  const dd = C_T_dd(T0);
  const ddVal = dd[0] + dd[1];
  const absErr = Math.abs(f64 - ddVal);
  const ulpErr = ulpError(f64, ddVal);
  return { T0, float64: f64, ddValue: ddVal, absError: absErr, ulpError: ulpErr };
});

const C_F_VERIFICATION = LADDER_T0_VALUES.map(T0 => {
  const f64 = C_F_float64(T0);
  const dd = C_F_dd(T0);
  const ddVal = dd[0] + dd[1];
  const absErr = Math.abs(f64 - ddVal);
  const ulpErr = ulpError(f64, ddVal);
  return { T0, float64: f64, ddValue: ddVal, absError: absErr, ulpError: ulpErr };
});

// ── Certification ─────────────────────────────────────────────────────────────
const C_T_CERTIFIED = C_T_VERIFICATION.every(v => v.ulpError < 5);
const C_F_CERTIFIED = C_F_VERIFICATION.every(v => v.ulpError < 5);
const ALL_CERTIFIED = C_H_CERTIFIED && C_C_CERTIFIED && C_T_CERTIFIED && C_F_CERTIFIED;

// ── Build-time assertions ─────────────────────────────────────────────────────
// These fire on module import. If any constant is wrong, the build will fail.

if (!C_H_CERTIFIED) {
  throw new Error(
    "imp-413 FAIL: C_H not exactly 1/8 -- ulpErr=" + C_H_ULP_ERR
  );
}

if (!C_C_CERTIFIED) {
  throw new Error(
    "imp-413 FAIL: C_C Float64 deviates from double-double by " +
    C_C_ULP_ERR.toFixed(2) + " ulp (threshold 5 ulp). " +
    "Float64=" + C_C_FLOAT64 + " DD=" + C_C_DD_VAL
  );
}

if (!C_T_CERTIFIED) {
  const worst = C_T_VERIFICATION.reduce((a, b) => a.ulpError > b.ulpError ? a : b);
  throw new Error(
    "imp-413 FAIL: C_T Float64 deviates from double-double at T0=" + worst.T0 +
    " by " + worst.ulpError.toFixed(2) + " ulp (threshold 5 ulp)"
  );
}

if (!C_F_CERTIFIED) {
  const worst = C_F_VERIFICATION.reduce((a, b) => a.ulpError > b.ulpError ? a : b);
  throw new Error(
    "imp-413 FAIL: C_F Float64 deviates from double-double at T0=" + worst.T0 +
    " by " + worst.ulpError.toFixed(2) + " ulp (threshold 5 ulp)"
  );
}

// ── Export ────────────────────────────────────────────────────────────────────

export const MPFR_CONSTANTS_VERIFY = {
  method: "double-double arithmetic (Dekker 1971), approximately 32 significant digits",
  epsMach: EPS_MACH,

  C_H: {
    float64: C_H_FLOAT64,
    ddPair: C_H_DD,
    ddValue: C_H_DD_VAL,
    ulpError: C_H_ULP_ERR,
    certified: C_H_CERTIFIED,
    note: "1/8 is an exact IEEE 754 dyadic fraction -- zero rounding error",
  },

  C_C: {
    float64: C_C_FLOAT64,
    ddPair: DD_C_C,
    ddValue: C_C_DD_VAL,
    ulpError: C_C_ULP_ERR,
    certified: C_C_CERTIFIED,
    note: "(1/8)*sqrt(3*pi) verified against double-double sqrt within 5 ulp",
  },

  C_T: {
    verification: C_T_VERIFICATION,
    certified: C_T_CERTIFIED,
    note: "C_T(T0) = (3*log(T0)-6)/(2*log(T0)) verified at 5 ladder heights",
  },

  C_F: {
    verification: C_F_VERIFICATION,
    certified: C_F_CERTIFIED,
    note: "C_F(T0) = (log(T0/(2*pi))+1)/(2*pi) verified at 5 ladder heights",
  },

  allCertified: ALL_CERTIFIED,

  summary: ALL_CERTIFIED
    ? "PASS: all four Polymath15 bridge constants certified. Float64 values " +
      "agree with double-double (~32 digits) to within 5 ulp. " +
      "No rounding artifacts detected. Publishable-quality numerics confirmed."
    : "FAIL: one or more constants failed double-double certification.",
};
