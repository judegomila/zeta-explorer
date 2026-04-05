/**
 * Hurwitz Class Numbers H(n)
 *
 * imp-225: Hurwitz class number H(n) counts SL_2(ℤ)-equivalence classes
 * of positive definite binary quadratic forms of discriminant -n, with
 * WEIGHTED counting at forms having non-trivial automorphisms.
 *
 * DEFINITION:
 *
 *   For n > 0 with n ≡ 0 or 3 mod 4 (so -n is a discriminant):
 *     H(n) = Σ_{Q reduced, disc(Q)=-n} 1/w(Q)
 *   where w(Q) is the number of automorphisms of Q (= 2·|Aut(Q)|/|±I|).
 *
 *   w = 3 if Q ~ x² + xy + y² (disc -3)
 *   w = 2 if Q ~ x² + y² (disc -4)
 *   w = 1 otherwise
 *
 *   H(0) = -1/12
 *   H(n) = 0 if n ≡ 1 or 2 mod 4
 *
 * KNOWN VALUES (Cohen 1975, Zagier):
 *
 *   H(3) = 1/3, H(4) = 1/2, H(7) = 1, H(8) = 1
 *   H(11) = 1, H(12) = 4/3, H(15) = 2, H(16) = 3/2
 *   H(19) = 1, H(20) = 2, H(23) = 3, H(24) = 2
 *   H(27) = 4/3, H(28) = 2, H(31) = 3, H(32) = 3, H(35) = 2
 *
 * RELATION TO TRACE FORMULA:
 *
 *   Eichler-Selberg trace formula: Tr T_p on S_k(SL_2(ℤ)) involves
 *   Σ H(4p - t²) · P_k(t, p) where sum is over integers t with t² ≤ 4p.
 *   This connects modular forms to class numbers.
 *
 * THIS MODULE:
 *
 *   1. Count reduced binary quadratic forms of discriminant -n.
 *   2. Apply weighting by automorphism count.
 *   3. Compute H(n) for small n and verify against tabulated values.
 *   4. Demonstrate occurrence in Eichler-Selberg trace formula.
 */

// ── Count reduced forms of discriminant -n ──────────────────────────────────
//
// Reduced form ax²+bxy+cy² with -a < b ≤ a ≤ c (b≥0 if a=c).
// disc = b² - 4ac = -n.

function reducedForms(n) {
  const forms = [];
  // a ranges from 1 to floor(sqrt(n/3))
  const aMax = Math.floor(Math.sqrt(n / 3));
  for (let a = 1; a <= aMax; a++) {
    // b²= -n + 4ac, b ≡ n mod 2, |b| ≤ a
    for (let b = -a + 1; b <= a; b++) {
      const n_plus_b2 = n + b * b;
      if (n_plus_b2 % (4 * a) !== 0) continue;
      const c = n_plus_b2 / (4 * a);
      if (c < a) continue;
      if (a === c && b < 0) continue;  // reduced condition for a=c
      forms.push({ a, b, c });
    }
  }
  return forms;
}

// ── Hurwitz weight w(Q) ────────────────────────────────────────────────────

function weight(Q) {
  // (a, b, c) with b=0, a=c: Q ~ x² + y² (disc = -4·a·a = -4a²); w = 2 if a=c=1 (actual disc -4)
  // (a, b, c) with a=b=c (disc -3a²): w = 3 if Q ~ x² + xy + y² (a=b=c=1, disc -3)
  // Otherwise w = 1
  const { a, b, c } = Q;
  if (a === b && b === c) return 3;  // x²+xy+y² (and multiples)
  if (b === 0 && a === c) return 2;  // x²+y² (and multiples)
  return 1;
}

// ── Hurwitz class number H(n) ──────────────────────────────────────────────

function hurwitzH(n) {
  if (n === 0) return -1 / 12;
  if (n % 4 === 1 || n % 4 === 2) return 0;
  const forms = reducedForms(n);
  let H = 0;
  for (const Q of forms) {
    H += 1 / weight(Q);
  }
  return H;
}

// ── Main test ────────────────────────────────────────────────────────────────

export function hurwitzClassNumbersTest() {
  // Known values (Cohen, OEIS A259825 gives 12·H(n))
  const knownValues = {
    0: -1/12, 3: 1/3, 4: 1/2, 7: 1, 8: 1, 11: 1, 12: 4/3,
    15: 2, 16: 3/2, 19: 1, 20: 2, 23: 3, 24: 2,
    27: 4/3, 28: 2, 31: 3, 32: 3, 35: 2, 36: 5/2,
    39: 4, 40: 2, 43: 1, 44: 4, 47: 5, 48: 8/3,
    51: 2, 52: 2, 55: 4, 56: 4, 59: 3, 60: 4,
  };

  const results = Object.entries(knownValues).map(([n_str, expected]) => {
    const n = parseInt(n_str);
    const computed = hurwitzH(n);
    return {
      n,
      H_computed: +computed.toFixed(6),
      H_expected: +expected.toFixed(6),
      match: Math.abs(computed - expected) < 1e-6,
      forms_count: n === 0 ? 'N/A' : reducedForms(n).length,
    };
  });

  const allMatch = results.every(r => r.match);

  // Display reduced forms for a few examples
  const examples = [3, 7, 15, 23].map(n => ({
    n,
    forms: reducedForms(n),
    H: hurwitzH(n),
  }));

  // Demonstrate in Eichler-Selberg: Σ_{t² ≤ 4p} H(4p - t²) for small prime p
  const eichlerSelberg = [5, 7, 11, 13].map(p => {
    const sum_raw = [];
    for (let t = 0; t * t <= 4 * p; t++) {
      const m = 4 * p - t * t;
      if (m === 0) continue;
      const Hm = hurwitzH(m);
      sum_raw.push({ t, '4p-t²': m, 'H(4p-t²)': +Hm.toFixed(4) });
    }
    return { p, sum_raw };
  });

  return {
    framework: {
      name: 'Hurwitz Class Numbers H(n)',
      definition: 'H(n) = Σ_{Q reduced, disc=-n} 1/|Aut(Q)|',
      special_values: 'H(0) = -1/12, H(3) = 1/3, H(4) = 1/2',
      traceFormulaLink: 'Appears in Eichler-Selberg: Tr(T_p | S_k) = Σ_{|t|≤2√p} H(4p-t²)·P_k(t,p)',
    },

    verification: results,

    all_match: allMatch,

    reduced_form_examples: examples,

    eichler_selberg_sums: eichlerSelberg,

    keyFindings: [
      `Computed H(n) for n ∈ {0, 3, 4, ..., 60} (30 values).`,
      `All match tabulated values: ${allMatch}.`,
      `H(3) = 1/3 (one form x²+xy+y² with w=3).`,
      `H(23) = 3 (three forms, all w=1: x²+xy+6y², 2x²+xy+3y², 2x²-xy+3y²).`,
      `H(60) = 4 and H(59) = 3 example: bigger discriminants give more classes.`,
      `Eichler-Selberg sum for p=5: Σ H(20-t²) for t ∈ {0, 1, 2, 4}: ${eichlerSelberg[0].sum_raw.map(e => e['H(4p-t²)']).join(', ')}.`,
    ],

    relationToRH: {
      modularFormConnection:
        'Hurwitz class numbers appear in Eichler-Selberg trace formula, connecting ' +
        'Hecke operator traces on modular forms to counts of quadratic forms.',
      deligneLink:
        'Tr(T_p | S_k) involves H(4p-t²); bounds |Tr(T_p)| = O(p^{(k-1)/2}) follow from ' +
        'Deligne\'s bound (Weil/RH for modular forms) on Hecke eigenvalues.',
      hurwitzViaLValues:
        'Class number formula gives H(n) in terms of L(1, χ_{-n}) (and its values), ' +
        'linking class numbers to L-function special values.',
    },

    nextStep:
      'Implement full Eichler-Selberg formula: Tr(T_p | S_k) via H(n)-sum. ' +
      'Verify Tr(T_p | S_12) = τ(p) for Ramanujan delta (imp-214).',

    verdict:
      `HURWITZ CLASS NUMBERS H(n) computed via reduced-form counting for 30 values. ` +
      `All match tabulated: ${allMatch}. ` +
      'Connects to Eichler-Selberg trace formula and modular form Hecke operators.',
  };
}
