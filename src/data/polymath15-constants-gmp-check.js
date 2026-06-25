/**
 * imp-422: GMP/MPFR-grade (100-decimal-digit) precision verification of the
 * four Polymath15 bridge constants C_H, C_C, C_T, C_F.
 *
 * Extends imp-413 double-double verification (~32 decimal digits) to a
 * 100-decimal-digit layer using JavaScript BigInt fixed-point arithmetic.
 *
 * Precision ladder
 * ----------------
 *   Float64         ~15-16 significant decimal digits  (IEEE 754)
 *   Double-double   ~32 significant decimal digits     (imp-413, Dekker 1971)
 *   GMP-grade       100 significant decimal digits     (this file, BigInt)
 *
 * Any mismatch across layers is a direct pointer to a rounding artifact.
 *
 * Method
 * ------
 * Representation: BigInt integer x_big = floor(x_real * D) where D = 10^100.
 *   mpMul(a,b) = a*b/D   (truncate 100 trailing digits)
 *   mpDiv(a,b) = a*D/b   (exact up to 1 ULP truncation)
 *
 * Transcendentals computed via integer-only series:
 *   atan(1/k)  -- Leibniz alternating series
 *   atanh(1/k) -- hyperbolic series, positive terms
 *   atanh(y)   -- general hyperbolic series for |y/D| < 1
 *   pi         -- Machin 1706: pi/4 = 4*atan(1/5) - atan(1/239)
 *   log(2)     -- identity: log(2) = 2*atanh(1/3)
 *   log(5)     -- identity: log(5) = 2*log(2) + 2*atanh(1/9)
 *   log(T0)    -- range-reduction: log(T0) = k*log(2) + 2*atanh((m-1)/(m+1))
 *                 where T0 = m * 2^k, m in [1,2)
 *   sqrt(x)    -- Newton-Raphson from Float64 seed, 15 iterations
 *
 * Certification threshold: relative error Float64 vs GMP < 1e-14
 */

// ── Scale factor D = 10^100 ───────────────────────────────────────────────────
const D = 10n ** 100n;

// ── Fixed-point operations ────────────────────────────────────────────────────

function mpMul(a, b) { return a * b / D; }
function mpDiv(a, b) { return a * D / b; }

/**
 * Convert Float64 x to BigInt fixed-point (floor(x * D)).
 * Uses x.toFixed(100): gives exact decimal of the IEEE 754 value.
 */
function mpFloat(x) {
  if (!isFinite(x) || x === 0) return 0n;
  const sign = x < 0 ? -1n : 1n;
  const ax = Math.abs(x);
  const str = ax.toFixed(100);
  const dot = str.indexOf(".");
  const intStr = str.slice(0, dot);
  const fracStr = str.slice(dot + 1).padEnd(100, "0").slice(0, 100);
  return sign * (BigInt(intStr) * D + BigInt(fracStr));
}

/**
 * Convert BigInt fixed-point to decimal string "int.frac" (100 frac digits).
 */
function mpStr(a) {
  const sign = a < 0n ? "-" : "";
  const aa = a < 0n ? -a : a;
  const intPart = aa / D;
  const fracPart = aa % D;
  return sign + intPart.toString() + "." + fracPart.toString().padStart(100, "0");
}

/** Convert BigInt fixed-point to Float64 via string (loses high precision). */
function mpToFloat(a) { return parseFloat(mpStr(a)); }

// ── atan(1/k) for integer k, Leibniz alternating series ──────────────────────
// atan(1/k) = 1/k - 1/(3k^3) + 1/(5k^5) - ...
// Recurrence: term_{n+1} = -term_n * (2n+1) / ((2n+3) * k^2)
function mpAtan1OverK(k) {
  const kk = BigInt(k);
  const k2 = kk * kk;
  let term = D / kk;
  let sum = term;
  for (let n = 0; n < 300; n++) {
    term = -(term * BigInt(2 * n + 1)) / (k2 * BigInt(2 * n + 3));
    sum += term;
    if (term === 0n || (term > -2n && term < 2n)) break;
  }
  return sum;
}

// ── atanh(1/k) for integer k, positive series ────────────────────────────────
// atanh(1/k) = 1/k + 1/(3k^3) + 1/(5k^5) + ...
// Recurrence: term_{n+1} = term_n * (2n+1) / ((2n+3) * k^2)
function mpAtanh1OverK(k) {
  const kk = BigInt(k);
  const k2 = kk * kk;
  let term = D / kk;
  let sum = term;
  for (let n = 0; n < 300; n++) {
    term = (term * BigInt(2 * n + 1)) / (k2 * BigInt(2 * n + 3));
    sum += term;
    if (term === 0n) break;
  }
  return sum;
}

// ── atanh(y) for general BigInt y in fixed-point form ────────────────────────
// atanh(y) = y + y^3/3 + y^5/5 + ...  (|y/D| < 1)
// term starts at y (= y^1), multiplied by y^2 each step.
function mpAtanh(y) {
  const y2 = mpMul(y, y);
  let term = y;
  let sum = y;
  for (let n = 1; n < 400; n++) {
    term = mpMul(term, y2);
    const contrib = term / BigInt(2 * n + 1);
    if (contrib === 0n) break;
    sum += contrib;
  }
  return sum;
}

// ── Fundamental constants ─────────────────────────────────────────────────────

// pi via Machin 1706: pi/4 = 4*atan(1/5) - atan(1/239)
// atan(1/5): ~72 terms; atan(1/239): ~22 terms for 100 digits.
const MP_PI = 4n * (4n * mpAtan1OverK(5) - mpAtan1OverK(239));

// log(2) = 2*atanh(1/3)  [since (1+1/3)/(1-1/3) = 2, ~105 terms]
const MP_LOG2 = 2n * mpAtanh1OverK(3);

// log(5) = 2*log(2) + 2*atanh(1/9)  [since 2*atanh(1/9)=log(5/4), ~53 terms]
const MP_LOG5 = 2n * MP_LOG2 + 2n * mpAtanh1OverK(9);

// log(pi): reduce pi/2 to [1,2) then apply range-reduction identity.
// log(pi) = log(2) + log(pi/2) = log(2) + 2*atanh((pi/2-1)/(pi/2+1))
const _piHalf = MP_PI / 2n;
const _yPi = mpDiv(_piHalf - D, _piHalf + D);
const MP_LOG_PI = MP_LOG2 + 2n * mpAtanh(_yPi);

// ── sqrt via Newton-Raphson ───────────────────────────────────────────────────
// Computes BigInt y such that y/D = sqrt(a/D).
// Newton: y_new = (y + a*D/y) / 2, starting from Float64 seed.
// 15 iterations: 15 correct digits -> 100+ correct digits.
function mpSqrt(a) {
  if (a <= 0n) return 0n;
  let y = mpFloat(Math.sqrt(mpToFloat(a)));
  for (let i = 0; i < 15; i++) {
    const yNew = (y + a * D / y) / 2n;
    if (yNew === y || yNew === y - 1n || yNew === y + 1n) break;
    y = yNew;
  }
  return y;
}

// ── log(integer T0) via range-reduction ──────────────────────────────────────
// T0 = m * 2^k, m in [1,2).
// log(T0) = k*log(2) + 2*atanh((m-1)/(m+1))
// D = 10^100 = 2^100 * 5^100, so division by 2^k (k <= 100) is exact.
function mpLogInt(T0) {
  const k = Math.floor(Math.log2(T0));
  const T0big = BigInt(Math.round(T0));
  const reduced = T0big * D / (1n << BigInt(k));   // T0/2^k * D, in [D, 2D)
  const y = mpDiv(reduced - D, reduced + D);        // (m-1)/(m+1), in [0, 1/3)
  return BigInt(k) * MP_LOG2 + 2n * mpAtanh(y);
}

// ── Constants ─────────────────────────────────────────────────────────────────

// C_H = 1/8  (exact: D/8 = 2^97 * 5^100, no rounding)
const C_H_GMP = D / 8n;

// C_C = (1/8)*sqrt(3*pi)
const C_C_GMP = mpMul(D / 8n, mpSqrt(3n * MP_PI));

// C_T(T0) = (3*log(T0) - 6) / (2*log(T0))
function gmpCT(T0) {
  const logT0 = mpLogInt(T0);
  return mpDiv(3n * logT0 - 6n * D, 2n * logT0);
}

// C_F(T0) = (log(T0/(2*pi)) + 1) / (2*pi)
function gmpCF(T0) {
  const logT0 = mpLogInt(T0);
  const log2Pi = MP_LOG2 + MP_LOG_PI;
  const logRatio = logT0 - log2Pi;
  const numer = logRatio + D;
  return mpDiv(numer, 2n * MP_PI);
}

// ── Float64 reference values ──────────────────────────────────────────────────
function floatCT(T0) {
  const L = Math.log(T0);
  return (3 * L - 6) / (2 * L);
}

function floatCF(T0) {
  return (Math.log(T0 / (2 * Math.PI)) + 1) / (2 * Math.PI);
}

// ── Relative error ────────────────────────────────────────────────────────────
function relErr(f64, gmp) {
  const g = mpToFloat(gmp);
  if (g === 0) return f64 === 0 ? 0 : Infinity;
  return Math.abs(f64 - g) / Math.abs(g);
}

// ── Ladder T0 values (same as imp-413 for direct cross-comparison) ────────────
const LADDER_T0 = [3000, 10000, 100000, 1e7, 1e10];

// ── Verification rows ─────────────────────────────────────────────────────────
const C_H_REL_ERR = relErr(0.125, C_H_GMP);
const C_C_REL_ERR = relErr((1 / 8) * Math.sqrt(3 * Math.PI), C_C_GMP);

const C_T_GMP_ROWS = LADDER_T0.map(T0 => {
  const f64 = floatCT(T0);
  const gmp = gmpCT(T0);
  return { T0, float64: f64, gmpLeadDigits: mpStr(gmp).slice(0, 25), relErr: relErr(f64, gmp) };
});

const C_F_GMP_ROWS = LADDER_T0.map(T0 => {
  const f64 = floatCF(T0);
  const gmp = gmpCF(T0);
  return { T0, float64: f64, gmpLeadDigits: mpStr(gmp).slice(0, 25), relErr: relErr(f64, gmp) };
});

// ── Certification ─────────────────────────────────────────────────────────────
const THRESHOLD = 1e-14;   // Float64 has ~15.6 decimal digits; margin of ~1.6

const C_H_PASS = C_H_REL_ERR < THRESHOLD;
const C_C_PASS = C_C_REL_ERR < THRESHOLD;
const C_T_PASS = C_T_GMP_ROWS.every(r => r.relErr < THRESHOLD);
const C_F_PASS = C_F_GMP_ROWS.every(r => r.relErr < THRESHOLD);

// ── imp-2705: post-imp-2641 rigorous constants (Trudgian C_Selberg = 2.622) ──
// imp-422 above predates the imp-2641 discharge of the C_Selberg = 3.0 PLACEHOLDER
// to the explicit Trudgian 2014 uniform-over-[e,T0] coefficient 2.622. The C_C_GMP
// computed above is exactly C_C_PINNED = (1/8)*sqrt(3*pi) (the placeholder reading).
// Here we extend the 100-digit BigInt ladder to the recomposed rigorous constants
//   C_Selberg_rigorous = 2.622,  C_KH_rigorous = pi*2.622,  C_C_rigorous = (1/8)*sqrt(C_KH_rigorous)
// and certify at full precision that the placeholder is conservative: C_C_rigorous < C_C_PINNED.
const C_SELBERG_RIGOROUS_F64 = 2.622;                              // Trudgian 2014 uniform coeff (imp-2641)
const C_SELBERG_RIGOROUS_GMP = 2622n * D / 1000n;                  // exact decimal 2.622 at 100 digits
const C_KH_RIGOROUS_GMP = mpMul(MP_PI, C_SELBERG_RIGOROUS_GMP);    // pi * 2.622
const C_C_RIGOROUS_GMP  = mpMul(D / 8n, mpSqrt(C_KH_RIGOROUS_GMP)); // (1/8)*sqrt(pi*2.622)
const C_C_PINNED_GMP    = C_C_GMP;                                  // (1/8)*sqrt(3*pi), C_Selberg=3.0 placeholder

const C_KH_RIGOROUS_F64 = Math.PI * C_SELBERG_RIGOROUS_F64;
const C_C_RIGOROUS_F64  = (1 / 8) * Math.sqrt(C_KH_RIGOROUS_F64);

const C_SELBERG_RIG_REL_ERR = relErr(C_SELBERG_RIGOROUS_F64, C_SELBERG_RIGOROUS_GMP);
const C_KH_RIGOROUS_REL_ERR = relErr(C_KH_RIGOROUS_F64, C_KH_RIGOROUS_GMP);
const C_C_RIGOROUS_REL_ERR  = relErr(C_C_RIGOROUS_F64, C_C_RIGOROUS_GMP);

// Full-precision (direct BigInt) confirmation the 3.0 placeholder is conservative.
const C_C_PLACEHOLDER_CONSERVATIVE_GMP = C_C_RIGOROUS_GMP < C_C_PINNED_GMP;

const C_SELBERG_RIG_PASS = C_SELBERG_RIG_REL_ERR < THRESHOLD;
const C_KH_RIGOROUS_PASS = C_KH_RIGOROUS_REL_ERR < THRESHOLD;
const C_C_RIGOROUS_PASS  = C_C_RIGOROUS_REL_ERR < THRESHOLD;
const RIGOROUS_LADDER_PASS =
  C_SELBERG_RIG_PASS && C_KH_RIGOROUS_PASS && C_C_RIGOROUS_PASS && C_C_PLACEHOLDER_CONSERVATIVE_GMP;

const ALL_PASS  = C_H_PASS && C_C_PASS && C_T_PASS && C_F_PASS && RIGOROUS_LADDER_PASS;

// ── Build-time assertions ─────────────────────────────────────────────────────
if (!C_H_PASS) {
  throw new Error(
    "imp-422 FAIL: C_H GMP mismatch, relErr=" + C_H_REL_ERR.toExponential(3)
  );
}
if (!C_C_PASS) {
  throw new Error(
    "imp-422 FAIL: C_C GMP mismatch, relErr=" + C_C_REL_ERR.toExponential(3)
  );
}
if (!C_T_PASS) {
  const worst = C_T_GMP_ROWS.reduce((a, b) => a.relErr > b.relErr ? a : b);
  throw new Error(
    "imp-422 FAIL: C_T GMP mismatch at T0=" + worst.T0 +
    ", relErr=" + worst.relErr.toExponential(3)
  );
}
if (!C_F_PASS) {
  const worst = C_F_GMP_ROWS.reduce((a, b) => a.relErr > b.relErr ? a : b);
  throw new Error(
    "imp-422 FAIL: C_F GMP mismatch at T0=" + worst.T0 +
    ", relErr=" + worst.relErr.toExponential(3)
  );
}
if (!C_SELBERG_RIG_PASS) {
  throw new Error(
    "imp-2705 FAIL: C_Selberg=2.622 GMP mismatch, relErr=" +
    C_SELBERG_RIG_REL_ERR.toExponential(3)
  );
}
if (!C_KH_RIGOROUS_PASS) {
  throw new Error(
    "imp-2705 FAIL: C_KH_rigorous=pi*2.622 GMP mismatch, relErr=" +
    C_KH_RIGOROUS_REL_ERR.toExponential(3)
  );
}
if (!C_C_RIGOROUS_PASS) {
  throw new Error(
    "imp-2705 FAIL: C_C_rigorous=(1/8)sqrt(pi*2.622) GMP mismatch, relErr=" +
    C_C_RIGOROUS_REL_ERR.toExponential(3)
  );
}
if (!C_C_PLACEHOLDER_CONSERVATIVE_GMP) {
  throw new Error(
    "imp-2705 FAIL: at 100-digit precision C_C_rigorous (C_Selberg=2.622) is NOT below " +
    "C_C_PINNED (C_Selberg=3.0); the placeholder is not conservative as claimed."
  );
}

// ── Export ────────────────────────────────────────────────────────────────────
export const GMP_CONSTANTS_VERIFY = {
  method: "BigInt fixed-point, D = 10^100 (100 significant decimal digits)",
  threshold: THRESHOLD,

  pi: {
    gmpLeadDigits: mpStr(MP_PI).slice(0, 25),
    note: "Machin 1706: pi/4 = 4*atan(1/5) - atan(1/239)",
  },
  log2: {
    gmpLeadDigits: mpStr(MP_LOG2).slice(0, 25),
    note: "log(2) = 2*atanh(1/3)",
  },

  C_H: {
    float64: 0.125,
    gmpStr: mpStr(C_H_GMP).slice(0, 30),
    relErr: C_H_REL_ERR,
    pass: C_H_PASS,
    note: "1/8 exact in IEEE 754 and in BigInt (D/8 = 2^97 * 5^100)",
  },
  C_C: {
    float64: (1 / 8) * Math.sqrt(3 * Math.PI),
    gmpStr: mpStr(C_C_GMP).slice(0, 30),
    relErr: C_C_REL_ERR,
    pass: C_C_PASS,
    note: "(1/8)*sqrt(3*pi); GMP sqrt via Newton-Raphson, 15 iterations",
  },
  C_T: {
    rows: C_T_GMP_ROWS,
    pass: C_T_PASS,
    note: "C_T(T0) = (3*log(T0)-6)/(2*log(T0)); log via range-reduction atanh",
  },
  C_F: {
    rows: C_F_GMP_ROWS,
    pass: C_F_PASS,
    note: "C_F(T0) = (log(T0/(2*pi))+1)/(2*pi); log(pi) via log(2)+2*atanh((pi/2-1)/(pi/2+1))",
  },

  // imp-2705: post-imp-2641 rigorous-recomposition ladder (Trudgian C_Selberg = 2.622)
  rigorousRecomposition: {
    C_Selberg_rigorous: {
      float64: C_SELBERG_RIGOROUS_F64,
      gmpStr: mpStr(C_SELBERG_RIGOROUS_GMP).slice(0, 30),
      relErr: C_SELBERG_RIG_REL_ERR,
      pass: C_SELBERG_RIG_PASS,
      note: "Trudgian 2014 uniform-over-[e,T0] S(T) coefficient (imp-2641); exact decimal 2.622 = 2622*D/1000",
    },
    C_KH_rigorous: {
      float64: C_KH_RIGOROUS_F64,
      gmpStr: mpStr(C_KH_RIGOROUS_GMP).slice(0, 30),
      relErr: C_KH_RIGOROUS_REL_ERR,
      pass: C_KH_RIGOROUS_PASS,
      note: "C_KH_rigorous = pi * 2.622 ~ 8.2373 (was 3*pi ~ 9.4248)",
    },
    C_C_rigorous: {
      float64: C_C_RIGOROUS_F64,
      gmpStr: mpStr(C_C_RIGOROUS_GMP).slice(0, 30),
      relErr: C_C_RIGOROUS_REL_ERR,
      pass: C_C_RIGOROUS_PASS,
      note: "C_C_rigorous = (1/8)*sqrt(pi*2.622) ~ 0.358758 (was (1/8)*sqrt(3*pi) ~ 0.383748)",
    },
    C_C_pinned: {
      float64: (1 / 8) * Math.sqrt(3 * Math.PI),
      gmpStr: mpStr(C_C_PINNED_GMP).slice(0, 30),
      note: "C_C_PINNED = (1/8)*sqrt(3*pi), the C_Selberg=3.0 placeholder reading",
    },
    placeholderConservativeAtFullPrecision: C_C_PLACEHOLDER_CONSERVATIVE_GMP,
    pass: RIGOROUS_LADDER_PASS,
    note: "At 100-digit precision C_C_rigorous (2.622) < C_C_PINNED (3.0): the placeholder is " +
      "confirmed a conservative over-estimate. Discharge half is imp-2641; residual Erdos-Turan " +
      "bridge gap is NOT closed here (numerical-precision check only).",
  },

  allPass: ALL_PASS,
  summary: ALL_PASS
    ? "PASS: all four Polymath15 constants certified Float64 vs 100-digit GMP " +
      "to within " + THRESHOLD.toExponential() + ". Precision ladder complete: " +
      "Float64 -> double-double (imp-413) -> GMP-grade (imp-422)."
    : "FAIL: one or more constants failed GMP-grade certification.",
};
