/**
 * imp-96386 (2026-09-24) — NUMERICAL (measurement only): SPLIT the imp-96366 pooled totient slope by
 * prime-content class. imp-96366 measured that the primitive-residue count phi_u = u prod_{p|u}(1-1/p)
 * on the three-prime S = {oo,2,3,5} ladder fits a slightly-sub-1 POOLED slope (0.991247 over mixed
 * rungs, 0.985668 over the full ladder) while p = 2-only is exactly 1.000000, and ATTRIBUTED the pooled
 * sub-1 slope to finite-range mixing of prime-content classes carrying different Euler constants -- but
 * it never measured the per-class Euler-constant intercept shift separately. This row does that: it fits
 * ln(phi_u) on ln(u) SEPARATELY within each of the seven prime-content classes (2, 3, 5, 23, 25, 35,
 * 235) and reports the slope + intercept of each, then shows the pooled sub-1 slope is EXACTLY explained
 * by the correlation between class Euler constant and rung size. It diagonalizes nothing, establishes NO
 * operator positivity, moves NO Lambda bound / verified height, and does NOT touch the finitely-many top
 * confined states. RH open; no refereed bound is changed; NO QED.
 *
 * ---------------------------------------------------------------------------------------------------
 * WHY A PER-CLASS SLOPE IS EXACTLY 1. Within a fixed prime-content class the Euler factor is CONSTANT:
 * every rung u = 2^a 3^b 5^c with the same set of present primes has the same c = prod_{p|u}(1-1/p), so
 * phi_u = c * u identically. Hence ln(phi_u) = ln(c) + ln(u): a line of slope EXACTLY 1 and intercept
 * EXACTLY ln(c). The MEASURED per-class fits (OLS of ln phi on ln u, uMax = 1e9) confirm this to
 * machine precision:
 *
 *   class      primes present   n rungs   slope       intercept        ln(Euler c)      c = phi/u
 *    2          {2}                29      1.000000   -0.693147181     ln(1/2)          0.500000
 *    3          {3}                18      1.000000   -0.405465108     ln(2/3)          0.666667
 *    5          {5}                12      1.000000   -0.223143551     ln(4/5)          0.800000
 *    23         {2,3}             258      1.000000   -1.098612289     ln(1/3)          0.333333
 *    25         {2,5}             172      1.000000   -0.916290732     ln(2/5)          0.400000
 *    35         {3,5}             107      1.000000   -0.628608659     ln(8/15)         0.533333
 *    235        {2,3,5}           933      1.000000   -1.321755840     ln(4/15)         0.266667
 *
 *   => EVERY class slope is 1.000000 (R^2 = 1); the class signature is ENTIRELY in the intercept, which
 *      equals ln(class Euler constant) exactly. So there is NO sub-linear growth in any class: the
 *      multiplicity phi_u is exactly O(u) within each prime-content class, differing only by the
 *      constant Euler factor.
 *
 * WHY THE POOLED SLOPE IS SUB-1 (the mixing, quantified exactly). Pooling parallel lines of common
 * slope 1 but different intercepts gives an OLS slope 1 ONLY if intercept is uncorrelated with ln(u)
 * across the pool. Here it is negatively correlated: classes with more primes carry a SMALLER Euler
 * constant (lower intercept) AND, because each extra prime multiplies u, populate LARGER u. The pooled
 * slope decomposes exactly as
 *
 *      pooledSlope = 1 + slope[ ln(c_class) on ln(u) ]     (OLS identity for a common within-group slope)
 *
 * MEASURED on the full ladder: slope[ ln c_class on ln u ] = -0.014331798, corr = -0.2508, so
 * pooledSlope = 1 + (-0.014331798) = 0.985668202 -- reproducing the imp-96366 full-ladder 0.985668 to
 * ~1e-15. The pooled sub-1 is therefore a MIXING artifact of the class-intercept / rung-size
 * correlation, NOT sub-linear multiplicity growth, exactly as imp-96366 conjectured.
 *
 * BEARING ON THE TAIL MAJORANT. Unchanged from imp-96366: the imp-96143 cubic tail Sum_u m_u s_u^3 is
 * robust to the multiplicity constant (only the O(u) growth class and the rigorous norm s_u =
 * u^{-1/2}/2 enter). This row only sharpens the WHY of the sub-1 pooled slope; it moves no bound.
 *
 * HONEST LIMITS. A MEASUREMENT of a combinatorial multiplicity model, not a diagonalization. The
 * "eigenspace dimension" of the true operator A_S235 is NOT computed (fractal Zygmund eigenfunctions
 * block exact diagonalization). Nothing establishes operator positivity, moves a Lambda bound /
 * verified height, or touches the finitely-many top confined states (the real residual). RH open; no refereed bound is changed
 * ; NO QED.
 *
 * Import-light: pure integer/float arithmetic, no imports, no zeros bundle. Reproduction inline.
 */

/** enumerate S-unit rungs u = 2^a 3^b 5^c, (a,b,c) != (0,0,0), u <= uMax, with the totient phi_u and a
 *  prime-content class label (the concatenation of the present primes, e.g. "235", "25", "3"). */
export function ladderClasses235(uMax = 1e9) {
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
        if (a > 0) phi *= 0.5;      // (1 - 1/2)
        if (b > 0) phi *= 2 / 3;    // (1 - 1/3)
        if (c > 0) phi *= 4 / 5;    // (1 - 1/5)
        const primeCount = (a > 0 ? 1 : 0) + (b > 0 ? 1 : 0) + (c > 0 ? 1 : 0);
        const cls = `${a > 0 ? 2 : ''}${b > 0 ? 3 : ''}${c > 0 ? 5 : ''}`;
        rows.push({ a, b, c, u, phi, primeCount, cls });
      }
    }
  }
  rows.sort((x, y) => x.u - y.u);
  return rows;
}

/** OLS fit of ln(row[key]) on ln(u): returns { slope, intercept, r2, n, meanLnU }.
 *  r2 is NaN when the class has a single ln(u) value (sxx = 0). */
export function fitLnPhiOnLnU(rows, key = 'phi') {
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
  return { slope, intercept: my - slope * mx, r2: sxx === 0 ? NaN : (sxy * sxy) / (sxx * syy), n, meanLnU: mx };
}

/** the Euler constant c = phi/u for a prime-content class label. */
export function classEulerConstant(cls) {
  let c = 1;
  if (cls.includes('2')) c *= 0.5;
  if (cls.includes('3')) c *= 2 / 3;
  if (cls.includes('5')) c *= 4 / 5;
  return c;
}

/** slope of ln(c_class) on ln(u) across a pooled row set; the OLS identity gives
 *  pooledSlope = 1 + this quantity when every class has an exact within-class slope of 1. */
export function classInterceptVsSizeSlope(rows) {
  const n = rows.length;
  const xs = rows.map((r) => Math.log(r.u));
  const cs = rows.map((r) => Math.log(classEulerConstant(r.cls)));
  const mx = xs.reduce((s, v) => s + v, 0) / n;
  const mc = cs.reduce((s, v) => s + v, 0) / n;
  let sxc = 0, sxx = 0, scc = 0;
  for (let i = 0; i < n; i++) {
    sxc += (xs[i] - mx) * (cs[i] - mc);
    sxx += (xs[i] - mx) * (xs[i] - mx);
    scc += (cs[i] - mc) * (cs[i] - mc);
  }
  return { slope: sxc / sxx, corr: sxc / Math.sqrt(sxx * scc), n };
}

export const IMP_96386_PER_CLASS_EULER_INTERCEPT = Object.freeze({
  id: 'imp-96386-per-class-euler-intercept-shift',
  route: 'I (Sonine refinement) — per-prime-content-class Euler-constant intercept split of the imp-96366 pooled totient slope',
  parents: [
    'src/data/imp-96366-mixed-ladder-multiplicity-growth-exponent.js (finding B: pooled totient slope 0.985668 declared a finite-range prime-class-mixing artifact; per-class Euler intercept never separately measured)',
  ],
  uMax: 1e9,
  // per-class OLS fit of ln(phi_u) on ln(u): slope EXACTLY 1, intercept EXACTLY ln(class Euler constant)
  perClassFit: Object.freeze({
    '2': Object.freeze({ slope: 1, intercept: Math.log(0.5), r2: 1, n: 29, eulerC: 0.5 }),
    '3': Object.freeze({ slope: 1, intercept: Math.log(2 / 3), r2: 1, n: 18, eulerC: 2 / 3 }),
    '5': Object.freeze({ slope: 1, intercept: Math.log(0.8), r2: 1, n: 12, eulerC: 0.8 }),
    '23': Object.freeze({ slope: 1, intercept: Math.log(1 / 3), r2: 1, n: 258, eulerC: 1 / 3 }),
    '25': Object.freeze({ slope: 1, intercept: Math.log(0.4), r2: 1, n: 172, eulerC: 0.4 }),
    '35': Object.freeze({ slope: 1, intercept: Math.log(8 / 15), r2: 1, n: 107, eulerC: 8 / 15 }),
    '235': Object.freeze({ slope: 1, intercept: Math.log(4 / 15), r2: 1, n: 933, eulerC: 4 / 15 }),
  }),
  // the pooled sub-1 slope decomposed exactly: pooledSlope = 1 + slope[ ln(c_class) on ln(u) ]
  pooledDecomposition: Object.freeze({
    fullSlopeReproduced: 0.9856682016114385,      // matches imp-96366 totientExponentFit.full.slope
    mixedSlopeReproduced: 0.9912465988374516,      // matches imp-96366 totientExponentFit.mixed.slope
    classInterceptVsSizeSlopeFull: -0.014331798388566382,   // slope[ ln c_class on ln u ] over the full ladder
    classInterceptVsSizeCorrFull: -0.2507586457515837,      // negative: more-prime (smaller c) classes live at larger u
    identity: '0.9856682016114385 = 1 + (-0.014331798388566382)',   // exact to ~1e-15
  }),
  verdict: 'MEASUREMENT only: the imp-96366 pooled sub-1 totient slope is CONFIRMED a prime-class-mixing artifact, not sub-linear growth. Fitting ln(phi_u) on ln(u) SEPARATELY within each of the seven prime-content classes (2, 3, 5, 23, 25, 35, 235) gives slope EXACTLY 1.000000 (R^2 = 1) in every class, with the intercept equal to ln(class Euler constant) exactly (ln(1/2), ln(2/3), ln(4/5), ln(1/3), ln(2/5), ln(8/15), ln(4/15)). The pooled sub-1 slope is explained EXACTLY by the OLS identity pooledSlope = 1 + slope[ ln(c_class) on ln(u) ] = 1 + (-0.014331798) = 0.985668202, matching the imp-96366 full-ladder 0.985668 to ~1e-15 -- because more-prime classes carry a smaller Euler constant AND populate larger u (corr = -0.2508). Establishes NO operator positivity, moves NO Lambda bound, does NOT touch the top confined states. RH open; no refereed bound is changed; NO QED',
});

// ---- assertions
const approx = (x, y, tol) => Math.abs(x - y) <= tol;
export const IMP_96386_PER_CLASS_EULER_INTERCEPT_ASSERTIONS = Object.freeze([
  {
    id: 'imp96386-per-class-slope-exactly-one',
    description: 'each of the seven prime-content classes fits ln(phi_u) on ln(u) with slope EXACTLY 1 (R^2 = 1 where defined) -- no sub-linear growth within any class',
    holds: () => {
      const rows = ladderClasses235(1e9);
      const classes = ['2', '3', '5', '23', '25', '35', '235'];
      return classes.every((cl) => {
        const f = fitLnPhiOnLnU(rows.filter((r) => r.cls === cl), 'phi');
        return approx(f.slope, 1, 1e-9) && approx(f.r2, 1, 1e-9);
      });
    },
  },
  {
    id: 'imp96386-per-class-intercept-equals-ln-euler',
    description: 'each class intercept equals ln(class Euler constant) exactly: ln(1/2), ln(2/3), ln(4/5), ln(1/3), ln(2/5), ln(8/15), ln(4/15)',
    holds: () => {
      const rows = ladderClasses235(1e9);
      const classes = ['2', '3', '5', '23', '25', '35', '235'];
      return classes.every((cl) => {
        const f = fitLnPhiOnLnU(rows.filter((r) => r.cls === cl), 'phi');
        return approx(f.intercept, Math.log(classEulerConstant(cl)), 1e-9);
      });
    },
  },
  {
    id: 'imp96386-pooled-slope-reproduces-imp96366',
    description: 'the pooled full-ladder and mixed totient slopes reproduce the imp-96366 values 0.985668 and 0.991247',
    holds: () => {
      const rows = ladderClasses235(1e9);
      const full = fitLnPhiOnLnU(rows, 'phi');
      const mixed = fitLnPhiOnLnU(rows.filter((r) => r.primeCount >= 2), 'phi');
      return approx(full.slope, 0.9856682016114385, 1e-9) && approx(mixed.slope, 0.9912465988374516, 1e-9);
    },
  },
  {
    id: 'imp96386-mixing-identity-exact',
    description: 'the pooled sub-1 slope decomposes exactly: pooledSlope = 1 + slope[ ln(c_class) on ln(u) ], reproducing 0.985668 to ~1e-12 -- so the sub-1 is a mixing artifact, not sub-linear growth',
    holds: () => {
      const rows = ladderClasses235(1e9);
      const pooled = fitLnPhiOnLnU(rows, 'phi').slope;
      const mix = classInterceptVsSizeSlope(rows);
      return approx(pooled, 1 + mix.slope, 1e-12) && mix.corr < 0;
    },
  },
  {
    id: 'imp96386-verdict-honesty',
    description: 'verdict records a MEASUREMENT only: per-class slope exactly 1, pooled sub-1 is a mixing artifact, no operator positivity, no Lambda move, does not touch the top confined states, RH open / NO QED',
    holds: () => /MEASUREMENT only/.test(IMP_96386_PER_CLASS_EULER_INTERCEPT.verdict)
      && /slope EXACTLY 1\.000000/.test(IMP_96386_PER_CLASS_EULER_INTERCEPT.verdict)
      && /mixing artifact/.test(IMP_96386_PER_CLASS_EULER_INTERCEPT.verdict)
      && /NO operator positivity/.test(IMP_96386_PER_CLASS_EULER_INTERCEPT.verdict)
      && /does NOT touch the top confined states/.test(IMP_96386_PER_CLASS_EULER_INTERCEPT.verdict)
      && /RH open/.test(IMP_96386_PER_CLASS_EULER_INTERCEPT.verdict)
      && /NO QED/.test(IMP_96386_PER_CLASS_EULER_INTERCEPT.verdict),
  },
]);

export default IMP_96386_PER_CLASS_EULER_INTERCEPT;
