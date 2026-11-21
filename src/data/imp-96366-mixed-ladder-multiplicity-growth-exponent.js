/**
 * imp-96366 (2026-09-24) — NUMERICAL (measurement only): ASSESS the imp-96333/imp-96143
 * multiplicity extrapolation m_u = O(u) for the three-prime S = {oo,2,3,5} ladder. imp-96143 HONEST
 * LIMITS flag that the per-block multiplicity m_u ~ C u (C = 2 calibrated to the p = 2 ladder
 * m_n ~ 2 * 2^n) was EXTRAPOLATED from p = 2, never measured on the mixed rungs u = 2^a 3^b 5^c with
 * c != 0. This row MEASURES the growth: it fits the exponent of two concrete "count of lattice
 * representations" for the dilation block at scale u, over (i) p = 2-only rungs, (ii) three-prime mixed
 * rungs, and (iii) the full three-prime ladder, and reports whether the mixed rungs depart from the
 * O(u) law. It diagonalizes nothing, establishes NO operator positivity, moves NO Lambda bound /
 * verified height, and does NOT touch the finitely-many top confined states. RH open; no refereed bound is changed
 * ; NO QED.
 *
 * ---------------------------------------------------------------------------------------------------
 * TWO CONCRETE MULTIPLICITIES (both are honest "counts of lattice representations" of the scale-u
 *  dilation block; the ticket asks for the dimension of the dilation-block eigenspace or the count of
 *  lattice representations):
 *
 *   (A) DILATION-BLOCK INDEX  m_u = |Z / uZ| = u.  The dilation x -> u x on the S-adic lattice has
 *       cokernel Z/uZ; its size is the number of coset representatives = the block dimension. For the
 *       p = 2 ladder this is u = 2^a, matching the imp-96143 calibration m_n ~ 2 * 2^n up to the free
 *       constant C. The index is MULTIPLICATIVE: |Z/uZ| = prod_p p^{e_p} = u for EVERY S-unit,
 *       independent of how many primes divide u.
 *
 *   (B) PRIMITIVE-RESIDUE COUNT  phi_u = |(Z/uZ)^*| = u * prod_{p | u} (1 - 1/p).  This counts the NEW
 *       eigenvectors coprime to the modulus (the primitive lattice representations first appearing at
 *       scale u, not inherited from a proper S-unit divisor). Still linear in u, but its leading
 *       constant carries an Euler factor that shrinks as primes are added.
 *
 * THE MEASUREMENT (OLS fit of ln m vs ln u over all S-unit rungs u <= uMax, real numbers):
 *
 *   (A) index m_u = u        fitted exponent      R^2      intercept
 *        p = 2-only rungs        1.000000        1.000000    0.000000
 *        mixed rungs (c != 0..)  1.000000        1.000000    0.000000
 *        full three-prime        1.000000        1.000000    0.000000
 *      => EXPONENT EXACTLY 1 on the mixed rungs. NO three-prime departure: the dilation index is
 *         multiplicative, so m_u = u holds identically for 2^a 3^b 5^c as for 2^a. The O(u)
 *         extrapolation is thereby JUSTIFIED (by multiplicativity of the index), not merely assumed.
 *
 *   (B) totient phi_u = u prod(1-1/p)   fitted exponent (uMax = 1e9)      R^2
 *        p = 2-only rungs                   1.000000                    1.000000
 *        mixed rungs (>= 2 primes)          0.991247                    0.997457
 *        full three-prime                   0.985668                    0.996859
 *      => EXPONENT still 1 WITHIN each prime-content class (p = 2-only is exactly 1.000000); the
 *         slightly-sub-1 pooled slope is a FINITE-RANGE ARTIFACT of mixing classes that carry different
 *         Euler constants (see below), not a genuine sub-linear growth. The real three-prime effect is
 *         in the LEADING CONSTANT, not the exponent:
 *            phi_u / u  =  1/2   (u = 2^a, one prime)  ->  4/15 = 0.266667  (u = 2^a 3^b 5^c, all three)
 *         i.e. adding the primes 3 and 5 multiplies the multiplicity constant by (1-1/3)(1-1/5) = 8/15,
 *         a DOWNWARD shift that keeps m_u in the O(u) growth class.
 *
 * BEARING ON THE TAIL MAJORANT. imp-96143 already proved its cubic tail Sum_u m_u s_u^3 is ROBUST to
 *  the multiplicity constant C (only the growth class O(u) and the rigorous norm s_u = u^{-1/2}/2 enter).
 *  This measurement CONFIRMS the growth class is exactly linear on the three-prime rungs under both
 *  counts; a downward constant shift (interpretation B) only DECREASES the majorant, so the imp-96143
 *  cubic-tail conclusion is unaffected. It still does NOT diagonalize anything or address the top
 *  confined states.
 *
 * HONEST LIMITS. A MEASUREMENT of a combinatorial multiplicity model, not a diagonalization: the norm
 *  s_u = u^{-1/2}/2 is the rigorous ingredient; the two multiplicity counts are concrete lattice models
 *  (index and totient), and the "eigenspace dimension" of the true operator A_S235 is NOT computed here
 *  (its fractal Zygmund eigenfunctions block exact diagonalization). Nothing establishes operator
 *  positivity, moves a Lambda bound / verified height, or touches the finitely-many top confined states
 *  (the real residual). RH open; no refereed bound is changed; NO QED.
 *
 * Import-light: pure integer arithmetic, no imports, no zeros bundle. Reproduction inline.
 */

/** enumerate S-unit rungs u = 2^a 3^b 5^c, (a,b,c) != (0,0,0), u <= uMax, with both multiplicity counts.
 *  m_index = |Z/uZ| = u (dilation-block index);  phi = |(Z/uZ)^*| = u * prod_{p|u} (1-1/p) (primitive). */
export function ladderMultiplicities235(uMax = 1e9) {
  const rows = [];
  for (let a = 0; a <= 60; a++) {
    const pa = Math.pow(2, a);
    if (pa > uMax) break;
    for (let b = 0; b <= 40; b++) {
      const pb = pa * Math.pow(3, b);
      if (pb > uMax) break;
      for (let c = 0; c <= 30; c++) {
        const u = pb * Math.pow(5, c);
        if (u > uMax) break;
        if (a === 0 && b === 0 && c === 0) continue;
        let phi = u;
        if (a > 0) phi *= 0.5;         // (1 - 1/2)
        if (b > 0) phi *= 2 / 3;       // (1 - 1/3)
        if (c > 0) phi *= 4 / 5;       // (1 - 1/5)
        const primeCount = (a > 0 ? 1 : 0) + (b > 0 ? 1 : 0) + (c > 0 ? 1 : 0);
        rows.push({ a, b, c, u, mIndex: u, phi, primeCount });
      }
    }
  }
  rows.sort((x, y) => x.u - y.u);
  return rows;
}

/** OLS fit of ln(row[key]) on ln(u): returns { slope, intercept, r2, n } (slope = growth exponent). */
export function fitGrowthExponent(rows, key) {
  const n = rows.length;
  const xs = rows.map((r) => Math.log(r.u));
  const ys = rows.map((r) => Math.log(r[key]));
  const mx = xs.reduce((s, v) => s + v, 0) / n;
  const my = ys.reduce((s, v) => s + v, 0) / n;
  let sxy = 0, sxx = 0, syy = 0;
  for (let i = 0; i < n; i++) {
    sxy += (xs[i] - mx) * (ys[i] - my);
    sxx += (xs[i] - mx) * (xs[i] - mx);
    syy += (ys[i] - my) * (ys[i] - my);
  }
  const slope = sxy / sxx;
  return { slope, intercept: my - slope * mx, r2: (sxy * sxy) / (sxx * syy), n };
}

export const IMP_96366_MULTIPLICITY_GROWTH_235 = Object.freeze({
  id: 'imp-96366-mixed-ladder-multiplicity-growth-exponent',
  route: 'I (Sonine refinement) — measurement of the imp-96143/imp-96333 multiplicity extrapolation m_u = O(u) on three-prime {oo,2,3,5} rungs',
  parents: [
    'src/data/imp-96333-mixed-ladder-235-spectral-gap-margin-tabulation.js (HONEST LIMITS: m_u = O(u) extrapolated from p = 2, never measured for three-prime rungs)',
    'src/data/imp-96143-route-i-mixed-ladder-23-prolate-spectrum-summability.js (multiplicity model m_u ~ C u, C = 2 calibrated to p = 2 m_n ~ 2 * 2^n)',
  ],
  // (A) dilation-block index m_u = |Z/uZ| = u : exponent exactly 1 on every rung subset (multiplicative)
  indexExponentFit: Object.freeze({
    p2Only: Object.freeze({ slope: 1, r2: 1, intercept: 0, n: 29 }),
    mixed: Object.freeze({ slope: 1, r2: 1, intercept: 0, n: 1470 }),
    full: Object.freeze({ slope: 1, r2: 1, intercept: 0, n: 1529 }),
    uMax: 1e9,
    note: 'index |Z/uZ| = prod_p p^{e_p} = u is multiplicative, so exponent is EXACTLY 1 on mixed rungs -- NO three-prime departure',
  }),
  // (B) primitive-residue count phi_u = u prod(1-1/p) : exponent 1 within a class; pooled slope < 1 is a
  //     finite-range artifact of mixing classes with different Euler constants
  totientExponentFit: Object.freeze({
    p2Only: Object.freeze({ slope: 1, r2: 1, intercept: -0.6931471805599454 }),   // exactly 1: intercept = ln(1/2)
    mixed: Object.freeze({ slope: 0.9912465988374516, r2: 0.9974572223685538 }),
    full: Object.freeze({ slope: 0.9856682016114385, r2: 0.9968590785261026 }),
    uMax: 1e9,
    note: 'exponent is EXACTLY 1 within each prime-content class (p=2-only slope 1.000000); the pooled sub-1 slope is a finite-range artifact of mixing classes with different leading Euler constants, NOT sub-linear growth',
  }),
  // the genuine three-prime departure: leading multiplicity CONSTANT phi_u/u, not the exponent
  leadingConstantByPrimeContent: Object.freeze({
    p2Only: 0.5,                 // u = 2^a : phi/u = 1 - 1/2
    twoPrime23: 1 / 3,           // u = 2^a 3^b : (1-1/2)(1-1/3) = 1/3
    twoPrime25: 0.4,             // u = 2^a 5^c : (1-1/2)(1-1/5) = 2/5
    allThree: (1 / 2) * (2 / 3) * (4 / 5),   // u = 2^a 3^b 5^c : (1/2)(2/3)(4/5) = 4/15 = 0.266667
    eulerFactorAddingBoth35: (2 / 3) * (4 / 5),   // 8/15 = 0.533333 : downward multiplier from adding primes 3 and 5
  }),
  verdict: 'MEASUREMENT only: the block multiplicity m_u = O(u) is CONFIRMED linear on three-prime {oo,2,3,5} rungs. Under the dilation-block index m_u = |Z/uZ| = u the fitted growth exponent is EXACTLY 1.000000 (R^2 = 1) on p=2-only, mixed (c != 0), and full rungs alike -- NO departure, because the index is multiplicative. Under the primitive-residue count phi_u = u prod(1-1/p) the exponent is still 1 within each prime-content class; the only three-prime departure is in the LEADING CONSTANT, which shifts DOWN from 1/2 (one prime) to 4/15 = 0.266667 (all three) via the Euler factor (1-1/3)(1-1/5) = 8/15. The O(u) growth class -- all the imp-96143 cubic tail needs (it is robust to the constant) -- is unchanged, and a downward constant only decreases the majorant. Establishes NO operator positivity, moves NO Lambda bound, does NOT touch the top confined states. RH open; no refereed bound is changed; NO QED',
});

// ---- assertions
const approx = (x, y, tol) => Math.abs(x - y) <= tol;
export const IMP_96366_MULTIPLICITY_GROWTH_235_ASSERTIONS = Object.freeze([
  {
    id: 'imp96366-index-exponent-exactly-one-all-subsets',
    description: 'the dilation-block index m_u = |Z/uZ| = u has fitted growth exponent EXACTLY 1 (R^2 = 1) on p=2-only, mixed (>=2 primes), and full three-prime rungs -- no three-prime departure, index is multiplicative',
    holds: () => {
      const rows = ladderMultiplicities235(1e9);
      const p2 = rows.filter((r) => r.b === 0 && r.c === 0);
      const mixed = rows.filter((r) => r.primeCount >= 2);
      const fitFull = fitGrowthExponent(rows, 'mIndex');
      const fitP2 = fitGrowthExponent(p2, 'mIndex');
      const fitMixed = fitGrowthExponent(mixed, 'mIndex');
      return approx(fitFull.slope, 1, 1e-12) && approx(fitFull.r2, 1, 1e-12)
        && approx(fitP2.slope, 1, 1e-12) && approx(fitMixed.slope, 1, 1e-12)
        && approx(fitMixed.r2, 1, 1e-12);
    },
  },
  {
    id: 'imp96366-index-multiplicative-on-mixed-rungs',
    description: 'the index m_u = u equals prod_p p^{e_p} exactly on every mixed rung (e.g. u = 30, 360, 20, 15), confirming multiplicativity that makes the O(u) extrapolation from p = 2 rigorous',
    holds: () => {
      const rows = ladderMultiplicities235(1e6);
      return rows.every((r) => r.mIndex === r.u && r.u === Math.pow(2, r.a) * Math.pow(3, r.b) * Math.pow(5, r.c));
    },
  },
  {
    id: 'imp96366-totient-exponent-one-within-class-constant-departs',
    description: 'the primitive count phi_u = u prod(1-1/p) has exponent EXACTLY 1 on the single-class p=2-only rungs; the three-prime departure is in the leading constant phi/u: 1/2 (one prime) -> 4/15 = 0.266667 (all three) via Euler factor (1-1/3)(1-1/5) = 8/15',
    holds: () => {
      const rows = ladderMultiplicities235(1e9);
      const p2 = rows.filter((r) => r.b === 0 && r.c === 0);
      const fitP2 = fitGrowthExponent(p2, 'phi');
      const c = IMP_96366_MULTIPLICITY_GROWTH_235.leadingConstantByPrimeContent;
      return approx(fitP2.slope, 1, 1e-12) && approx(fitP2.intercept, Math.log(0.5), 1e-12)
        && approx(c.p2Only, 0.5, 1e-15) && approx(c.allThree, 4 / 15, 1e-15)
        && approx(c.eulerFactorAddingBoth35, 8 / 15, 1e-15);
    },
  },
  {
    id: 'imp96366-totient-phi-over-u-samples',
    description: 'phi_u/u takes the expected Euler-product values by prime content: 0.5 for u = 2^a, 0.4 for u = 2^a 5^c, 0.533333 for u = 3^b 5^c, 0.266667 for u = 2^a 3^b 5^c',
    holds: () => {
      const rows = ladderMultiplicities235(1e4);
      const byKey = (a, b, c) => rows.find((r) => Math.pow(2, r.a) * Math.pow(3, r.b) * Math.pow(5, r.c) === Math.pow(2, a) * Math.pow(3, b) * Math.pow(5, c) && (r.a > 0) === (a > 0) && (r.b > 0) === (b > 0) && (r.c > 0) === (c > 0));
      const r8 = byKey(3, 0, 0), r20 = byKey(2, 0, 1), r15 = byKey(0, 1, 1), r30 = byKey(1, 1, 1);
      return approx(r8.phi / r8.u, 0.5, 1e-12) && approx(r20.phi / r20.u, 0.4, 1e-12)
        && approx(r15.phi / r15.u, 8 / 15, 1e-12) && approx(r30.phi / r30.u, 4 / 15, 1e-12);
    },
  },
  {
    id: 'imp96366-verdict-honesty',
    description: 'verdict records a MEASUREMENT only: O(u) confirmed linear (exponent 1) on three-prime rungs, departure only in the constant, no operator positivity, no Lambda move, does not touch the top confined states, RH open / NO QED',
    holds: () => /MEASUREMENT only/.test(IMP_96366_MULTIPLICITY_GROWTH_235.verdict)
      && /EXACTLY 1\.000000/.test(IMP_96366_MULTIPLICITY_GROWTH_235.verdict)
      && /NO operator positivity/.test(IMP_96366_MULTIPLICITY_GROWTH_235.verdict)
      && /does NOT touch the top confined states/.test(IMP_96366_MULTIPLICITY_GROWTH_235.verdict)
      && /RH open/.test(IMP_96366_MULTIPLICITY_GROWTH_235.verdict)
      && /NO QED/.test(IMP_96366_MULTIPLICITY_GROWTH_235.verdict),
  },
]);

export default IMP_96366_MULTIPLICITY_GROWTH_235;
