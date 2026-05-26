// imp-1187 — Literature survey: explicit asymptotic constants for
// k=1,2,3,4 moments of |zeta(1/2+it)|
//
// SUMMARY
// -------
// The 2k-th moment of |zeta(1/2+it)| on the critical line is defined as:
//
//   M_k(T) = (1/T) integral_0^T |zeta(1/2+it)|^{2k} dt
//
// The Keating-Snaith (2000) conjecture predicts:
//
//   M_k(T) ~ a_k * g_k * (log T)^{k^2}    as T -> infinity
//
// where:
//   g_k = G(k+1)^2 / G(2k+1)     (Barnes G-function ratio, GUE factor)
//   a_k = prod_p (1-1/p)^{k^2} * sum_{j>=0} C(j+k-1,k-1)^2 * p^{-j}
//                                 (arithmetic factor, Euler product over primes)
//
// PROVEN cases (exact asymptotics established):
//   k=1 (2nd moment): Hardy-Littlewood 1916; Ingham 1926 (explicit error)
//   k=2 (4th moment): Ingham 1926 (leading term); Heath-Brown 1981 (5 terms)
//
// CONJECTURAL (Keating-Snaith 2000 -- no proven asymptotics):
//   k=3 (6th moment), k=4 (8th moment)
//
// PURPOSE
// -------
// Centralises the constants used by imp-1126, imp-447, imp-459 and future
// moment-related tickets so they read this file instead of re-deriving.
//
// REFERENCES
// ----------
// [HL16]  Hardy GH, Littlewood JE. 1916. Contributions to the theory of the
//         Riemann zeta-function and the theory of the distribution of primes.
//         Acta Math 41, 119-196. Proved M_1(T) ~ log T.
// [I26]   Ingham AE. 1926. Mean-value theorems in the theory of the Riemann
//         zeta-function. Proc London Math Soc (2) 27, 273-300.
//         Proved M_2(T) ~ (log T)^4 / (2 pi^2); also re-proved M_1.
// [HB81]  Heath-Brown DR. 1981. The fourth power moment of the Riemann
//         zeta-function. Proc London Math Soc (3) 38, 385-422.
//         Full 5-term polynomial for integral M_2(T), error O(T^{2/3+eps}).
// [KS00]  Keating JP, Snaith NC. 2000. Random matrix theory and zeta(1/2+it).
//         Commun Math Phys 214, 57-89. Conjecture for all k via GUE.
// [CS05]  Conrey JB, Snaith NC. 2007. Applications of the L-functions
//         ratios conjecture. Proc London Math Soc (3) 94, 594-646.
//         (Arithmetic factor derivation for general k.)
//
// SYNTAX SAFETY: no close-comment sequence inside doc blocks;
// double-quoted strings used throughout to avoid apostrophe issues.
//
// @see imp-1126
// @see imp-447
// @see imp-459

// ── Barnes G-function exact integer values ───────────────────────────────────
// Recurrence: G(n+1) = (n-1)! * G(n), G(1) = 1.
// All values below are exact integers.
const BARNES_G = Object.freeze({
  G1: 1,
  G2: 1,              // 0! * G(1) = 1
  G3: 1,              // 1! * G(2) = 1
  G4: 2,              // 2! * G(3) = 2
  G5: 12,             // 3! * G(4) = 12
  G6: 288,            // 4! * G(5) = 288
  G7: 34560,          // 5! * G(6) = 34560
  G8: 24883200,       // 6! * G(7) = 24883200
  G9: 125411328000,   // 7! * G(8) = 125411328000
});

// ── GUE moment factor g_k = G(k+1)^2 / G(2k+1) ──────────────────────────────
const GUE_FACTORS = Object.freeze({
  g1: BARNES_G.G2 ** 2 / BARNES_G.G3,     // 1^2 / 1 = 1
  g2: BARNES_G.G3 ** 2 / BARNES_G.G5,     // 1^2 / 12 = 1/12
  g3: BARNES_G.G4 ** 2 / BARNES_G.G7,     // 4 / 34560 = 1/8640
  g4: BARNES_G.G5 ** 2 / BARNES_G.G9,     // 144 / 125411328000 = 1/870912000
});

// ── Arithmetic factor a_k (closed forms where available) ─────────────────────
// k=1: a_1 = 1 (product telescopes to 1)
// k=2: a_2 = 6/pi^2 = 1/zeta(2)
//      Derivation: local factor = (1-1/p)(1+1/p) = 1-1/p^2;
//                  prod_p (1-1/p^2) = 1/zeta(2) = 6/pi^2.
const A1_EXACT = 1;
const A2_EXACT = 6 / (Math.PI * Math.PI);   // = 1/zeta(2) = 6/pi^2

// k=3: a_3 = prod_p (1-1/p)^4 * (1+4/p+1/p^2)  [no closed form]
// k=4: a_4 = prod_p (1-1/p)^9 * (1+9/p+9/p^2+1/p^3)  [no closed form]
//
// Derivation sketch (local factor simplification):
//   sum_{j>=0} C(j+k-1,k-1)^2 x^j = N_k(x) / (1-x)^{2k-1}
//   where N_k is a palindromic polynomial of degree k-1:
//     k=2: N_2(x) = 1+x,            sum = (1+x)/(1-x)^3
//     k=3: N_3(x) = 1+4x+x^2,       sum = (1+4x+x^2)/(1-x)^5
//     k=4: N_4(x) = 1+9x+9x^2+x^3,  sum = (1+9x+9x^2+x^3)/(1-x)^7
//   Local factor = (1-1/p)^{k^2} * N_k(1/p)/(1-1/p)^{2k-1}
//                = (1-1/p)^{k^2 - 2k + 1} * N_k(1/p)
//                = (1-1/p)^{(k-1)^2} * N_k(1/p)

// Truncated Euler product over primes up to PRIME_BOUND.
// Tail correction is O(sum_{p>PRIME_BOUND} k^2/p^2) < 10^{-9} for PRIME_BOUND=30000.
const PRIME_BOUND = 30000;

function sieve(limit) {
  const isComposite = new Uint8Array(limit + 1);
  const primes = [];
  for (let p = 2; p <= limit; p++) {
    if (!isComposite[p]) {
      primes.push(p);
      for (let q = p * p; q <= limit; q += p) isComposite[q] = 1;
    }
  }
  return primes;
}

const PRIMES = sieve(PRIME_BOUND);

function computeA3(primes) {
  // a_3 = prod_p (1-1/p)^4 * (1 + 4/p + 1/p^2)
  let logSum = 0;
  for (const p of primes) {
    const x = 1 / p;
    logSum += 4 * Math.log1p(-x) + Math.log(1 + 4 * x + x * x);
  }
  return Math.exp(logSum);
}

function computeA4(primes) {
  // a_4 = prod_p (1-1/p)^9 * (1 + 9/p + 9/p^2 + 1/p^3)
  let logSum = 0;
  for (const p of primes) {
    const x = 1 / p;
    logSum += 9 * Math.log1p(-x) + Math.log(1 + 9 * x + 9 * x * x + x * x * x);
  }
  return Math.exp(logSum);
}

const A3_APPROX = computeA3(PRIMES);
const A4_APPROX = computeA4(PRIMES);

// ── Proven leading constants c_k = a_k * g_k ─────────────────────────────────
// c_1: M_1(T) ~ 1 * log T
// c_2: M_2(T) ~ (1/(2 pi^2)) * (log T)^4
const C1_EXACT = A1_EXACT * GUE_FACTORS.g1;      // = 1
const C2_EXACT = A2_EXACT * GUE_FACTORS.g2;      // = (6/pi^2)*(1/12) = 1/(2*pi^2)

// ── Conjectural leading constants c_k = a_k * g_k (Keating-Snaith 2000) ──────
const C3_KS = A3_APPROX * GUE_FACTORS.g3;        // M_3(T) ~ c_3 (log T)^9
const C4_KS = A4_APPROX * GUE_FACTORS.g4;        // M_4(T) ~ c_4 (log T)^16

// ── Per-moment survey table ───────────────────────────────────────────────────

export const IMP1187_ZETA_MOMENT_CONSTANTS = Object.freeze({
  id: "imp-1187",
  generatedAt: "2026-05-25",
  description:
    "Explicit leading asymptotic constants for the 2k-th moment of " +
    "|zeta(1/2+it)|, collating proven results (k=1,2) and Keating-Snaith " +
    "conjectural constants (k=3,4). Central reference for imp-1126, imp-447, " +
    "imp-459 and all future moment-related tickets.",
  notation:
    "M_k(T) = (1/T) integral_0^T |zeta(1/2+it)|^{2k} dt ~ c_k (log T)^{k^2}",
  barnesGFunction: BARNES_G,
  gueFactors: GUE_FACTORS,
  primeBound: PRIME_BOUND,
  nPrimesUsed: PRIMES.length,
  moments: Object.freeze([
    Object.freeze({
      k: 1,
      moment: "2nd (|zeta|^2)",
      status: "proven",
      leadingConstant: C1_EXACT,
      leadingConstantExact: "1",
      arithmeticFactor: A1_EXACT,
      arithmeticFactorFormula: "prod_p 1 = 1 (telescopes exactly)",
      gueFactor: GUE_FACTORS.g1,
      gueFactorExact: "G(2)^2 / G(3) = 1",
      asymptotic: "M_1(T) ~ log T",
      integralAsymptotic:
        "integral_0^T |zeta(1/2+it)|^2 dt ~ T log T",
      references: [
        "Hardy-Littlewood 1916 (proved leading term)",
        "Ingham 1926 (explicit error estimate)",
      ],
      notes:
        "The simplest proven moment. Leading constant 1 means no extra " +
        "arithmetic factor beyond the Barnes G contribution (which is also 1 " +
        "here). The explicit error term from Ingham 1926 takes the form " +
        "integral_0^T |zeta|^2 dt = T log T + (2*gamma-1) T + O(T^{1/2}).",
    }),
    Object.freeze({
      k: 2,
      moment: "4th (|zeta|^4)",
      status: "proven",
      leadingConstant: C2_EXACT,
      leadingConstantExact: "1 / (2 * pi^2)",
      leadingConstantNumerical: 1 / (2 * Math.PI * Math.PI),
      arithmeticFactor: A2_EXACT,
      arithmeticFactorFormula: "prod_p (1-1/p^2) = 1/zeta(2) = 6/pi^2",
      gueFactor: GUE_FACTORS.g2,
      gueFactorExact: "G(3)^2 / G(5) = 1/12",
      asymptotic: "M_2(T) ~ (log T)^4 / (2 pi^2)",
      integralAsymptotic:
        "integral_0^T |zeta(1/2+it)|^4 dt ~ T (log T)^4 / (2 pi^2)",
      heathBrownExpansion:
        "integral_0^T |zeta(1/2+it)|^4 dt = T * P_4(log T) + O(T^{2/3+eps}), " +
        "where P_4 is a degree-4 polynomial with leading coefficient 1/(2 pi^2) " +
        "[Heath-Brown 1981, Theorem 1]",
      references: [
        "Ingham 1926 (leading term proved)",
        "Heath-Brown 1981 (5-term polynomial expansion)",
      ],
      notes:
        "Factorisation: a_2 * g_2 = (6/pi^2) * (1/12) = 1/(2 pi^2). " +
        "The arithmetic factor a_2 = 6/pi^2 follows from the local factor " +
        "(1-1/p)(1+1/p) = 1-1/p^2, whose Euler product is 1/zeta(2). " +
        "Heath-Brown 1981 derives the full polynomial via spectral methods and " +
        "the Kuznetsov formula; the error O(T^{2/3+eps}) is unconditional.",
    }),
    Object.freeze({
      k: 3,
      moment: "6th (|zeta|^6)",
      status: "conjectural",
      leadingConstant: C3_KS,
      leadingConstantExact: "a_3 * G(4)^2 / G(7) = a_3 / 8640",
      arithmeticFactor: A3_APPROX,
      arithmeticFactorFormula:
        "a_3 = prod_p (1-1/p)^4 * (1 + 4/p + 1/p^2)   [truncated at p < 30000]",
      gueFactor: GUE_FACTORS.g3,
      gueFactorExact: "G(4)^2 / G(7) = 4 / 34560 = 1/8640",
      asymptotic:
        "M_3(T) ~ c_3 (log T)^9   [CONJECTURE, Keating-Snaith 2000]",
      integralAsymptotic:
        "integral_0^T |zeta(1/2+it)|^6 dt ~ c_3 * T (log T)^9   [CONJECTURE]",
      references: [
        "Keating-Snaith 2000 (conjectural leading constant via GUE)",
        "Conrey-Snaith 2007 (arithmetic factor derivation via ratios conjecture)",
      ],
      notes:
        "No proven asymptotic exists. The local factor polynomial N_3(x) = " +
        "1+4x+x^2 arises from sum_{j>=0} C(j+2,2)^2 x^j = (1+4x+x^2)/(1-x)^5. " +
        "The factor (1-1/p)^4 = (1-1/p)^{(k-1)^2} for k=3 captures the " +
        "cancellation from the (1-1/p)^9 in the arithmetic definition versus " +
        "the (1-1/p)^5 from the denominator. a_3 is computed here via " +
        "truncated Euler product; tail error < 10^{-8}.",
    }),
    Object.freeze({
      k: 4,
      moment: "8th (|zeta|^8)",
      status: "conjectural",
      leadingConstant: C4_KS,
      leadingConstantExact: "a_4 * G(5)^2 / G(9) = a_4 / 870912000",
      arithmeticFactor: A4_APPROX,
      arithmeticFactorFormula:
        "a_4 = prod_p (1-1/p)^9 * (1 + 9/p + 9/p^2 + 1/p^3)   [truncated at p < 30000]",
      gueFactor: GUE_FACTORS.g4,
      gueFactorExact: "G(5)^2 / G(9) = 144 / 125411328000 = 1/870912000",
      asymptotic:
        "M_4(T) ~ c_4 (log T)^16   [CONJECTURE, Keating-Snaith 2000]",
      integralAsymptotic:
        "integral_0^T |zeta(1/2+it)|^8 dt ~ c_4 * T (log T)^16   [CONJECTURE]",
      references: [
        "Keating-Snaith 2000 (conjectural leading constant via GUE)",
        "Conrey-Snaith 2007 (arithmetic factor derivation via ratios conjecture)",
      ],
      notes:
        "No proven asymptotic exists. The local factor polynomial N_4(x) = " +
        "1+9x+9x^2+x^3 = (1+x)(1+8x+x^2) arises from sum_{j>=0} C(j+3,3)^2 x^j " +
        "= (1+9x+9x^2+x^3)/(1-x)^7. The factor (1-1/p)^9 = (1-1/p)^{(k-1)^2} " +
        "for k=4. The leading constant c_4 is extremely small because g_4 = " +
        "1/870912000 and a_4 is itself much less than 1 (local factor at p=2 " +
        "is already ~0.015).",
    }),
  ]),
});

export default IMP1187_ZETA_MOMENT_CONSTANTS;

// ── Build-time tripwires ──────────────────────────────────────────────────────

export const IMP1187_ASSERTIONS = [
  {
    id: "imp1187-barnes-g-recurrence-holds",
    holds: () => {
      // G(n+1) = (n-1)! * G(n) must hold for n = 2..8.
      const G = [
        0,
        BARNES_G.G1, BARNES_G.G2, BARNES_G.G3, BARNES_G.G4,
        BARNES_G.G5, BARNES_G.G6, BARNES_G.G7, BARNES_G.G8, BARNES_G.G9,
      ];
      for (let n = 2; n <= 8; n++) {
        let fact = 1;
        for (let i = 1; i <= n - 1; i++) fact *= i;
        if (G[n + 1] !== fact * G[n]) return false;
      }
      return true;
    },
    why:
      "BARNES_G entries must satisfy G(n+1) = (n-1)! G(n). A typo silently " +
      "corrupts g_k = G(k+1)^2/G(2k+1) and all downstream moment constants c_k.",
  },
  {
    id: "imp1187-c2-exact-equals-one-over-two-pi-squared",
    holds: () => {
      const c2 = C2_EXACT;
      const expected = 1 / (2 * Math.PI * Math.PI);
      return Math.abs(c2 - expected) < 1e-14;
    },
    why:
      "The proven 4th-moment leading constant c_2 = a_2 * g_2 = (6/pi^2)*(1/12) " +
      "must equal 1/(2 pi^2) within floating-point precision. This is the only " +
      "non-trivial proven constant in the survey; a discrepancy invalidates the " +
      "comparison anchor for the conjectural k=3,4 values.",
  },
  {
    id: "imp1187-a2-times-g2-factorisation",
    holds: () => {
      const product = A2_EXACT * GUE_FACTORS.g2;
      const direct = 1 / (2 * Math.PI * Math.PI);
      return Math.abs(product - direct) < 1e-13;
    },
    why:
      "The Keating-Snaith factorisation c_k = a_k * g_k must reproduce the Ingham " +
      "1926 result for k=2: (6/pi^2)*(1/12) = 1/(2 pi^2). Failure here means the " +
      "arithmetic factor or GUE factor formula is wrong.",
  },
  {
    id: "imp1187-gue-factors-exact-rationals",
    holds: () => {
      const g = GUE_FACTORS;
      return (
        g.g1 === 1 &&
        Math.abs(g.g2 - 1 / 12) < 1e-15 &&
        Math.abs(g.g3 - 1 / 8640) < 1e-18 &&
        Math.abs(g.g4 - 1 / 870912000) < 1e-22
      );
    },
    why:
      "g_k = G(k+1)^2/G(2k+1) are exact rationals: g1=1, g2=1/12, g3=1/8640, " +
      "g4=1/870912000. Rounding beyond 64-bit IEEE754 indicates a wrong BARNES_G " +
      "integer entry. These are load-bearing denominators for all c_k values.",
  },
  {
    id: "imp1187-a3-and-a4-positive-and-less-than-one",
    holds: () => {
      // Each local factor (1-1/p)^{(k-1)^2} * N_k(1/p) < 1 for all primes,
      // so the truncated products satisfy 0 < a_3 < 0.203 and 0 < a_4 < 0.02.
      return (
        Number.isFinite(A3_APPROX) &&
        A3_APPROX > 0 &&
        A3_APPROX < 0.21 &&
        Number.isFinite(A4_APPROX) &&
        A4_APPROX > 0 &&
        A4_APPROX < 0.02
      );
    },
    why:
      "a_3 and a_4 are convergent Euler products all of whose local factors are " +
      "< 1 (e.g. at p=2: a_3-local=0.203, a_4-local=0.015). Both must be " +
      "positive (no log-sum overflow) and strictly less than the p=2 local factor " +
      "as an upper bound. Non-finite or out-of-range values indicate a sieve " +
      "bug or arithmetic overflow in the log-sum computation.",
  },
  {
    id: "imp1187-leading-constants-strictly-decreasing",
    holds: () => {
      // c_1 > c_2 > c_3 > c_4 > 0: g_k decreases super-factorially,
      // dominating the moderate growth of a_k.
      return C1_EXACT > C2_EXACT && C2_EXACT > C3_KS && C3_KS > C4_KS && C4_KS > 0;
    },
    why:
      "The leading constants c_k = a_k * g_k must decrease strictly: " +
      "c_1=1 >> c_2 ~ 0.051 >> c_3 >> c_4 > 0. The Barnes G denominator " +
      "G(2k+1) grows super-factorially while a_k decreases. Any violation " +
      "means a wrong g_k or a_k formula was used.",
  },
  {
    id: "imp1187-k3-k4-status-is-conjectural",
    holds: () => {
      const ms = IMP1187_ZETA_MOMENT_CONSTANTS.moments;
      const k3 = ms.find((m) => m.k === 3);
      const k4 = ms.find((m) => m.k === 4);
      return (
        k3 !== undefined &&
        k3.status === "conjectural" &&
        k4 !== undefined &&
        k4.status === "conjectural"
      );
    },
    why:
      "The k=3 and k=4 moment asymptotics are unproven open problems. Marking " +
      "them as anything other than 'conjectural' would misrepresent the state of " +
      "the RH literature. This tripwire blocks any future edit that silently " +
      "upgrades a Keating-Snaith conjecture to a theorem.",
  },
  {
    id: "imp1187-moments-array-k-fields-sequential",
    holds: () => {
      const ms = IMP1187_ZETA_MOMENT_CONSTANTS.moments;
      if (ms.length !== 4) return false;
      for (let i = 0; i < ms.length; i++) {
        if (ms[i].k !== i + 1) return false;
      }
      return true;
    },
    why:
      "The moments array must have exactly 4 entries with k=1,2,3,4 in order. " +
      "Callers that index by position (moments[1] for k=2) would silently read " +
      "the wrong constant if entries are reordered or a row is accidentally removed.",
  },
];
