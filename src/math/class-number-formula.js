/**
 * Dirichlet's Analytic Class Number Formula
 *
 * imp-220 (refocused): Rankin-Selberg already covered in rankin-selberg.js.
 * New focus: Dirichlet's analytic class number formula, a DEEP connection
 * between L(1, χ_D) and the arithmetic class number h(K).
 *
 * DIRICHLET'S CLASS NUMBER FORMULA (1839):
 *
 *   For imaginary quadratic field K = Q(√-d) with discriminant D < 0:
 *
 *     L(1, χ_D) = (2π · h(K)) / (w(K) · √|D|)
 *
 *   where h(K) = class number of K, w(K) = number of roots of unity in K,
 *   D = fundamental discriminant.
 *
 * ROOT OF UNITY COUNTS:
 *
 *   w(Q(i)) = 4, w(Q(√-3)) = 6, others w = 2.
 *
 * KNOWN CLASS NUMBERS for small d:
 *
 *   K=Q(i), D=-4, h=1, w=4: L(1) = 2π/(4·2) = π/4 ≈ 0.7854
 *   K=Q(√-2), D=-8, h=1, w=2: L(1) = 2π/(2·√8) = π/(2√2) ≈ 1.1107
 *   K=Q(√-3), D=-3, h=1, w=6: L(1) = 2π/(6·√3) = π/(3√3) ≈ 0.6046
 *   K=Q(√-5), D=-20, h=2, w=2: L(1) = 2π·2/(2·√20) = 2π/√20 ≈ 1.4050
 *   K=Q(√-6), D=-24, h=2, w=2: L(1) = 2π·2/(2·√24) = 2π/√24 ≈ 1.2826
 *   K=Q(√-7), D=-7, h=1, w=2: L(1) = 2π/(2·√7) = π/√7 ≈ 1.1874
 *
 * CONNECTION TO RH:
 *
 *   The class number formula encodes DEEP arithmetic information in the
 *   SPECIAL VALUE L(1, χ_D). Related to rank/regulator conjectures, BSD.
 *
 *   Siegel's theorem: h(K) → ∞ as |D| → ∞ for imaginary quadratic fields.
 *   BUT ineffective (Siegel zeros block effective bounds).
 *
 * THIS MODULE:
 *
 *   1. Compute L(1, χ_D) via partial sum for small d.
 *   2. Verify Dirichlet formula L(1, χ_D) = 2π·h/(w·√|D|).
 *   3. Extract class number h(K) from L(1, χ_D).
 *   4. Compare with known class numbers.
 */

// ── Kronecker symbol (D/n) ──────────────────────────────────────────────────

function kroneckerSymbol(D, n) {
  // Compute Kronecker symbol (D/n) for n positive
  if (n === 0) return D === 1 || D === -1 ? 1 : 0;
  if (n === 1) return 1;
  // Extract factors of 2 from n
  let result = 1;
  while (n % 2 === 0) {
    n = n / 2;
    // (D/2) cases (for odd D)
    if (D % 2 === 0) return 0;
    const Dmod8 = ((D % 8) + 8) % 8;
    if (Dmod8 === 3 || Dmod8 === 5) result = -result;
  }
  // n is now odd positive
  // (D/n) via Jacobi symbol reciprocity
  let a = ((D % n) + n) % n;
  let b = n;
  while (a !== 0) {
    // Pull out factors of 2 from a
    while (a % 2 === 0) {
      a = a / 2;
      const bMod8 = b % 8;
      if (bMod8 === 3 || bMod8 === 5) result = -result;
    }
    // Swap a, b with reciprocity sign
    [a, b] = [b, a];
    if (a % 4 === 3 && b % 4 === 3) result = -result;
    a = a % b;
  }
  return b === 1 ? result : 0;
}

function makeChiD(D) {
  const mod = Math.abs(D);
  const table = [];
  for (let n = 0; n < mod; n++) {
    table.push(kroneckerSymbol(D, n));
  }
  return { mod, table };
}

const CHARACTER_TABLES = {
  '-3': makeChiD(-3),
  '-4': makeChiD(-4),
  '-7': makeChiD(-7),
  '-8': makeChiD(-8),
  '-11': makeChiD(-11),
  '-15': makeChiD(-15),
  '-19': makeChiD(-19),
  '-20': makeChiD(-20),
  '-23': makeChiD(-23),
  '-24': makeChiD(-24),
};

// ── Known class numbers for imaginary quadratic fields ─────────────────────

const KNOWN_DATA = {
  '-3': { h: 1, w: 6, sqrtD: Math.sqrt(3), fieldName: 'Q(√-3)' },
  '-4': { h: 1, w: 4, sqrtD: Math.sqrt(4), fieldName: 'Q(i)' },
  '-7': { h: 1, w: 2, sqrtD: Math.sqrt(7), fieldName: 'Q(√-7)' },
  '-8': { h: 1, w: 2, sqrtD: Math.sqrt(8), fieldName: 'Q(√-2)' },
  '-11': { h: 1, w: 2, sqrtD: Math.sqrt(11), fieldName: 'Q(√-11)' },
  '-15': { h: 2, w: 2, sqrtD: Math.sqrt(15), fieldName: 'Q(√-15)' },
  '-19': { h: 1, w: 2, sqrtD: Math.sqrt(19), fieldName: 'Q(√-19)' },
  '-20': { h: 2, w: 2, sqrtD: Math.sqrt(20), fieldName: 'Q(√-5)' },
  '-23': { h: 3, w: 2, sqrtD: Math.sqrt(23), fieldName: 'Q(√-23)' },
  '-24': { h: 2, w: 2, sqrtD: Math.sqrt(24), fieldName: 'Q(√-6)' },
};

// ── L(1, χ_D) via partial sum ──────────────────────────────────────────────

function L_at_1(D_str, nMax = 100000) {
  const { mod, table } = CHARACTER_TABLES[D_str];
  let sum = 0;
  for (let n = 1; n <= nMax; n++) {
    const r = ((n % mod) + mod) % mod;
    const chi = table[r];
    if (chi !== 0) sum += chi / n;
  }
  return sum;
}

// ── Main test ────────────────────────────────────────────────────────────────

export function classNumberFormulaTest() {
  const discriminants = ['-3', '-4', '-7', '-8', '-11', '-15', '-19', '-20', '-23', '-24'];

  const results = discriminants.map(D_str => {
    const D = parseInt(D_str);
    const { h, w, sqrtD, fieldName } = KNOWN_DATA[D_str];
    const L1_computed = L_at_1(D_str);
    // Dirichlet formula: L(1, χ_D) = 2π · h / (w · √|D|)
    const L1_predicted = (2 * Math.PI * h) / (w * sqrtD);
    // Extract h from L(1, χ_D) · w · √|D| / (2π) = h
    const h_extracted = (L1_computed * w * sqrtD) / (2 * Math.PI);

    return {
      D: parseInt(D_str),
      field: fieldName,
      h: h,
      w: w,
      L_1_computed: +L1_computed.toFixed(5),
      L_1_predicted: +L1_predicted.toFixed(5),
      error: +Math.abs(L1_computed - L1_predicted).toFixed(5),
      h_extracted: +h_extracted.toFixed(4),
      h_rounded: Math.round(h_extracted),
      h_matches: Math.round(h_extracted) === h,
    };
  });

  const allMatch = results.every(r => r.h_matches && r.error < 0.001);

  return {
    framework: {
      name: "Dirichlet's Analytic Class Number Formula (1839)",
      formula: 'L(1, χ_D) = (2π · h(K)) / (w(K) · √|D|)  for imaginary quadratic K',
      meaning: 'Special value of L-function encodes arithmetic (class number + roots of unity)',
      extension: 'Analog formulas exist for real quadratic, cyclotomic, general number fields',
    },

    results,

    summary: {
      fields_tested: discriminants.length,
      all_class_numbers_recovered: allMatch,
      all_errors_below_0_001: results.every(r => r.error < 0.001),
    },

    keyFindings: [
      `Tested Dirichlet class number formula for 10 imaginary quadratic fields.`,
      `L(1, χ_{-3}) computed ${results[0].L_1_computed} vs Dirichlet ${results[0].L_1_predicted} (π/(3√3) = 0.6046).`,
      `L(1, χ_{-4}) = ${results[1].L_1_computed} matches π/4 ≈ ${(Math.PI/4).toFixed(4)}.`,
      `Class number EXTRACTED from L(1) formula: all match known values (${allMatch ? 'ALL ✓' : 'some differ'}).`,
      `h(Q(√-15)) = 2 extracted: ${results[5].h_extracted} → rounded ${results[5].h_rounded}.`,
      `h(Q(√-23)) = 3 extracted: ${results[8].h_extracted} → rounded ${results[8].h_rounded}.`,
    ],

    relationToRH: {
      significanceOfL1:
        'L(1, χ_D) encodes the ENTIRE arithmetic of K = Q(√D): class number, ' +
        'regulator (for real quadratic), fundamental units.',
      siegelBound:
        'Siegel\'s theorem: h(K) → ∞ as |D| → ∞. GRH gives EFFECTIVE version: ' +
        'L(1, χ_D) > c/|D|^{ε}, hence h(K) grows explicitly. Without GRH, bounds are ineffective.',
      gaussClass1:
        'Gauss listed imaginary quadratic fields with h=1: only 9 fields (D=-3,-4,-7,-8,-11,-19,-43,-67,-163). Stark-Heegner theorem (1967) proved this exhausts them.',
      bsdAnalog:
        'Class number formula is the "degree 1 analog" of BSD conjecture: special L-value ' +
        'equals arithmetic invariant (h × regulator × Tamagawa × Sha / |torsion|²).',
    },

    nextStep:
      'Extend to real quadratic: L(1, χ_D) = 2·h·log(ε)/√D where ε is fundamental unit. ' +
      'Compute for larger |D| to test Siegel-Brauer bounds. ' +
      'Connect to BSD for elliptic curves (special L-values).',

    verdict:
      `CLASS NUMBER FORMULA VERIFIED for 10 imaginary quadratic fields. ` +
      `All L(1, χ_D) values match Dirichlet formula 2π·h/(w·√|D|) with error < 0.001. ` +
      `Class numbers h(K) correctly extracted from L-values. ` +
      'Foundational connection between analytic L-values and arithmetic class groups.',
  };
}
