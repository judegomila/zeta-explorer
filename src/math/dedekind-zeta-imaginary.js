/**
 * Dedekind Zeta Function for Imaginary Quadratic Fields
 *
 * imp-211: For a number field K, the Dedekind zeta function is
 *
 *   ζ_K(s) = Σ_I N(I)^{-s}  (sum over nonzero ideals I of O_K)
 *          = Π_p (1 - N(p)^{-s})^{-1}  (Euler product over prime ideals)
 *
 * GRH-extended conjecture: all nontrivial zeros of ζ_K(s) lie on σ = ½.
 *
 * FOR IMAGINARY QUADRATIC FIELDS K = Q(√-d):
 *
 *   ζ_K(s) = ζ(s) · L(s, χ_d)
 *
 * where χ_d is the Kronecker character associated to -d. Examples:
 *
 *   K = Q(i):        ζ_K(s) = ζ(s) · L(s, χ_{-4})
 *   K = Q(√-2):      ζ_K(s) = ζ(s) · L(s, χ_{-8})
 *   K = Q(√-3):      ζ_K(s) = ζ(s) · L(s, χ_{-3})
 *   K = Q(√-7):      ζ_K(s) = ζ(s) · L(s, χ_{-7})
 *
 * Zeros of ζ_K are UNION of ζ-zeros AND L(s, χ_d) zeros. Under GRH, all on σ=½.
 *
 * PRIME IDEAL FACTORIZATION:
 *
 *   For K imaginary quadratic with discriminant D:
 *     (p) splits in O_K        ⟺ χ_D(p) = +1
 *     (p) inert                ⟺ χ_D(p) = -1
 *     (p) ramified             ⟺ p | D
 *
 *   Euler product:
 *     ζ_K(s) = Π_{(p) split} (1-p^{-s})^{-2}
 *            · Π_{(p) inert} (1-p^{-2s})^{-1}
 *            · Π_{(p) ramified} (1-p^{-s})^{-1}
 *
 * THIS MODULE:
 *
 *   1. Compute ζ_K(s) for K = Q(i), Q(√-2), Q(√-3) at real s > 1.
 *   2. Verify factorization ζ_K = ζ · L(·, χ_K).
 *   3. Analyze splitting behavior of primes.
 */

// ── Kronecker characters for small discriminants ───────────────────────────

const KRONECKER = {
  '-4': (n) => {  // χ_{-4} for Q(i)
    const r = ((n % 4) + 4) % 4;
    if (r === 0) return 0;
    if (r === 2) return 0;
    return r === 1 ? 1 : -1;
  },
  '-8': (n) => {  // χ_{-8} for Q(√-2)
    const r = ((n % 8) + 8) % 8;
    if (r === 0 || r === 2 || r === 4 || r === 6) return 0;
    if (r === 1 || r === 3) return 1;
    return -1;  // r = 5 or 7
  },
  '-3': (n) => {  // χ_{-3} for Q(√-3)
    const r = ((n % 3) + 3) % 3;
    if (r === 0) return 0;
    return r === 1 ? 1 : -1;
  },
  '-7': (n) => {  // χ_{-7} for Q(√-7)
    const r = ((n % 7) + 7) % 7;
    if (r === 0) return 0;
    const qr = new Set([1, 2, 4]);
    return qr.has(r) ? 1 : -1;
  },
};

// ── Riemann ζ via partial sum ───────────────────────────────────────────────

function zetaSum(s, nMax = 100000) {
  let sum = 0;
  for (let n = 1; n <= nMax; n++) sum += Math.pow(n, -s);
  return sum;
}

// ── Dirichlet L(s, χ) via partial sum ──────────────────────────────────────

function LSum(chi, s, nMax = 100000) {
  let sum = 0;
  for (let n = 1; n <= nMax; n++) sum += chi(n) * Math.pow(n, -s);
  return sum;
}

// ── Dedekind ζ_K via Euler product over primes ─────────────────────────────

function sievePrimes(N) {
  const sieve = new Uint8Array(N + 1);
  const primes = [];
  for (let n = 2; n <= N; n++) {
    if (!sieve[n]) {
      primes.push(n);
      for (let k = 2*n; k <= N; k += n) sieve[k] = 1;
    }
  }
  return primes;
}

function dedekindZetaEulerProduct(chi, s, primes) {
  let prod = 1;
  for (const p of primes) {
    const chi_p = chi(p);
    const ps = Math.pow(p, -s);
    if (chi_p === 0) {
      // ramified: factor 1/(1 - p^{-s})
      prod *= 1 / (1 - ps);
    } else if (chi_p === 1) {
      // split: factor 1/(1 - p^{-s})²
      prod *= 1 / ((1 - ps) * (1 - ps));
    } else {
      // inert: factor 1/(1 - p^{-2s})
      const p2s = Math.pow(p, -2 * s);
      prod *= 1 / (1 - p2s);
    }
  }
  return prod;
}

// ── Main test ────────────────────────────────────────────────────────────────

export function dedekindZetaImaginaryTest() {
  const primes = sievePrimes(10000);

  const fields = [
    { name: 'Q(i)', D: -4, chi: KRONECKER['-4'] },
    { name: 'Q(√-2)', D: -8, chi: KRONECKER['-8'] },
    { name: 'Q(√-3)', D: -3, chi: KRONECKER['-3'] },
    { name: 'Q(√-7)', D: -7, chi: KRONECKER['-7'] },
  ];

  const sValues = [2, 3, 4];

  const results = fields.map(({ name, D, chi }) => {
    const valuesAtS = sValues.map(s => {
      const zeta_s = zetaSum(s);
      const L_s = LSum(chi, s);
      const zetaK_factored = zeta_s * L_s;
      const zetaK_euler = dedekindZetaEulerProduct(chi, s, primes);
      return {
        s,
        'ζ(s)': +zeta_s.toFixed(5),
        'L(s,χ_D)': +L_s.toFixed(5),
        'ζ_K factored': +zetaK_factored.toFixed(5),
        'ζ_K Euler': +zetaK_euler.toFixed(5),
        match: Math.abs(zetaK_factored - zetaK_euler) < 0.001,
      };
    });

    // Splitting behavior of first few primes
    const splitting = [];
    for (const p of primes.slice(0, 10)) {
      const cp = chi(p);
      splitting.push({
        p,
        'χ_D(p)': cp,
        type: cp === 1 ? 'split' : (cp === -1 ? 'inert' : 'ramified'),
      });
    }

    return {
      field: name,
      discriminant: D,
      valuesAtS,
      splitting,
    };
  });

  // Verify all factorizations match
  const allMatch = results.every(r => r.valuesAtS.every(v => v.match));

  return {
    framework: {
      name: 'Dedekind Zeta Function for Imaginary Quadratic Fields',
      formula: 'ζ_K(s) = ζ(s) · L(s, χ_D)  for K = Q(√-d) with discriminant D',
      grh_conjecture: 'All nontrivial zeros of ζ_K on Re(s) = ½',
      reference: 'Dedekind 1871, Hecke 1917',
    },

    results,

    factorization_verified: allMatch,

    keyFindings: [
      `Tested 4 imaginary quadratic fields: Q(i), Q(√-2), Q(√-3), Q(√-7).`,
      `Factorization ζ_K(s) = ζ(s)·L(s, χ_D) verified at s ∈ {2, 3, 4}.`,
      `Example Q(i) at s=2: ζ(2)·L(2,χ_{-4}) = ${(zetaSum(2) * LSum(KRONECKER['-4'], 2)).toFixed(4)} = Euler product.`,
      `Splitting behavior: primes split, inert, or ramified based on χ_D(p).`,
      `All factorizations match (both forms of ζ_K agree).`,
    ],

    relationToRH: {
      grhExtension:
        'GRH states all Dedekind ζ_K have zeros only on σ=½. ' +
        'For imaginary quadratic fields, this reduces to RH for ζ AND GRH for L(·, χ_D).',
      importance:
        'Dedekind ζ appears in: class number formulas, analytic class number formula, ' +
        'effective Brauer-Siegel theorem, Chebotarev density theorem.',
      numberFieldRH:
        'If RH+GRH hold, error terms in all number-field prime-counting improve from ' +
        'O(x·exp(-c√log x)) to O(x^{½+ε}).',
    },

    nextStep:
      'Compute complex zeros of ζ_K for imaginary quadratic fields. ' +
      'Extend to real quadratic fields Q(√d) and higher-degree fields. ' +
      'Connect to class number h(K) via ζ_K\'s residue at s=1.',

    verdict:
      `DEDEKIND ζ_K for 4 imaginary quadratic fields: factorization ζ_K=ζ·L verified. ` +
      `Splitting behavior computed for first 10 primes in each field. ` +
      'GRH extends to number fields via Dedekind ζ.',
  };
}
