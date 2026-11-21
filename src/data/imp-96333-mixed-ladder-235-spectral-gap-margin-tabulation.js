/**
 * imp-96333 (2026-09-24) — NUMERICAL (documentation/measurement only): EXTEND the imp-96270 mixed
 * {oo,2,3} spectral-gap MARGIN tabulation to the three-prime set S = {oo,2,3,5}, u = 2^a 3^b 5^c.
 * The point of the extension: adding the prime 5 does NOT move the ceiling (s_2 = 0.353553 is still the
 * single top rung, attained at u = 2), because the new smallest rung u = 5 sits at s_5 = 0.223607,
 * a gap 0.129947 below the ceiling. What DOES change is the DENSITY of the tail: the S-unit set is
 * denser, so the rung-count-within-margin grows faster, and the count above any threshold t is now the
 * three-prime lattice-point count u <= (1/(2t))^2 -- a FINITE count that grows like (ln U)^3 instead of
 * (ln U)^2. This is a tabulation extension only: it diagonalizes nothing, establishes NO operator
 * positivity, moves NO Lambda bound / verified height, and does NOT touch the finitely-many top confined
 * states (the actual residual). RH open; no refereed bound is changed; NO QED.
 *
 * ---------------------------------------------------------------------------------------------------
 * THE LADDER. As in imp-96143/imp-96270 the per-block norm is s_u = u^{-1/2}/2 (dilation unitarity +
 *  Euler 1/2 weight); here u = 2^a 3^b 5^c ranges over S-units of S = {oo,2,3,5}, (a,b,c) != (0,0,0).
 *  The ceiling is unchanged: sup over the tail is s_2 = 2^{-1/2}/2 = 0.353553, attained ONLY at u = 2,
 *  gap 1 - 0.353553 = 0.646447 below modulus 1. The added prime interleaves NEW rungs (u = 5,10,15,...)
 *  strictly BELOW the ceiling, so the sup and the gap are identical to the two-prime case.
 *
 * LEADING MAGNITUDES (sorted by u ascending = magnitude descending), s_u and margin s_2 - s_u below the
 *  ceiling. NEW three-prime rungs (c != 0) are marked *:
 *    rank  (a,b,c)   u    s_u          s_2 - s_u
 *      1   (1,0,0)   2    0.353553     0.000000   <- the ceiling (top tail rung, unchanged)
 *      2   (0,1,0)   3    0.288675     0.064878
 *      3   (2,0,0)   4    0.250000     0.103553
 *      4 * (0,0,1)   5    0.223607     0.129947   <- first new prime-5 rung, well below the ceiling
 *      5   (1,1,0)   6    0.204124     0.149429
 *      6   (3,0,0)   8    0.176777     0.176777
 *      7   (0,2,0)   9    0.166667     0.186887
 *      8 * (1,0,1)  10    0.158114     0.195440
 *      9   (2,1,0)  12    0.144338     0.209216
 *     10 * (0,1,1)  15    0.129099     0.224454
 *  The single new rung inside the top four (u = 5) still sits 0.129947 below the ceiling, so STILL only
 *  ONE rung lies within 0.06 of the ceiling -- exactly as in the two-prime tabulation.
 *
 * DENSITY GROWTH (the actual measurement). The count of tail magnitudes at or above threshold t is the
 *  number of S-units u = 2^a 3^b 5^c (excluding 1) with u <= (1/(2t))^2. Two-prime -> three-prime:
 *    t = 0.30 : 1  -> 1   (u <= 2.78)
 *    t = 0.25 : 3  -> 3   (u <= 4)
 *    t = 0.20 : 4  -> 5   (u <= 6.25)   +1  (u = 5)
 *    t = 0.15 : 6  -> 8   (u <= 11.11)  +2  (u = 5,10)
 *    t = 0.10 : 10 -> 15  (u <= 25)     +5  (u = 5,10,15,20,25)
 *    t = 0.05 : 19 -> 33  (u <= 100)    +14
 *  So the tail is denser but STILL a finite count strictly below the ceiling: the number of S-units
 *  u <= U grows like (ln U)^3 / (6 ln2 ln3 ln5) (three-prime lattice-point count) instead of the
 *  two-prime (ln U)^2 / (2 ln2 ln3). Sampled: count(u <= 1e2/1e3/1e4/1e6/1e9) = 33/85/174/506/1529,
 *  with count/[(ln U)^3/(6 ln2 ln3 ln5)] = 2.49/1.90/1.64/1.41/1.26 decreasing toward 1 (the cubic
 *  leading term). The gap 1 - sup_tail |lam| = 0.646447 is unchanged and still attained only at u = 2.
 *
 * HONEST LIMITS. This is a TABULATION of the magnitude multiset, extended by one prime, not a
 *  diagonalization: s_u = u^{-1/2}/2 is the rigorous per-block ingredient, the multiplicity m_u = O(u)
 *  is extrapolated from p = 2, and fact (I) as a spectral-gap statement STILL depends on the mixed-group
 *  no-modulus-1 theorem for the finitely-many top confined states -- which this row does NOT address.
 *  Nothing here establishes operator positivity, moves a Lambda bound, or touches a verified height.
 *  RH open; no refereed bound is changed; NO QED.
 *
 * Import-light: pure geometric arithmetic, no imports, no zeros bundle. Reproduction inline.
 */

const CEILING = Math.pow(2, -0.5) / 2;   // s_2 = 0.3535533905932738, the top tail rung (unchanged by prime 5)

/** the three-prime S-unit ladder magnitudes s_u = u^{-1/2}/2, u = 2^a 3^b 5^c, (a,b,c) != (0,0,0),
 *  sorted magnitude-descending, restricted to u <= uMax (finite because s_u decreases in u) */
export function ladderMagnitudes235(uMax = 200) {
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
        rows.push({ a, b, c, u, s: Math.pow(u, -0.5) / 2 });
      }
    }
  }
  rows.sort((x, y) => x.u - y.u);
  return rows;
}

/** count of tail magnitudes at or above threshold t = # three-prime S-units (excluding 1) with u <= (1/(2t))^2 */
export function countAboveThreshold235(t, uMax = 1e6) {
  return ladderMagnitudes235(uMax).filter((r) => r.s >= t).length;
}

export const IMP_96333_SPECTRAL_GAP_MARGIN_235 = Object.freeze({
  id: 'imp-96333-mixed-ladder-235-spectral-gap-margin-tabulation',
  route: 'I (Sonine refinement) — three-prime {oo,2,3,5} extension of the imp-96270 spectral-gap margin tabulation',
  parents: [
    'src/data/imp-96270-mixed-ladder-spectral-gap-margin-tabulation.js (two-prime {oo,2,3} margin tabulation being extended)',
    'src/data/imp-96143-route-i-mixed-ladder-23-prolate-spectrum-summability.js (fact (I): every tail magnitude <= s_2 = 0.353553 < 1)',
  ],
  ceiling: 0.3535533905932738,               // s_2 = 2^{-1/2}/2, largest tail magnitude, UNCHANGED by prime 5
  gapBelowOne: 0.6464466094067263,           // 1 - s_2, the spectral-gap margin of the WHOLE ladder tail, unchanged
  firstNewRung: Object.freeze({ a: 0, b: 0, c: 1, u: 5, s: 0.22360679774997896, marginBelowCeiling: 0.12994659284329485 }),
  secondRung: 0.2886751345948129,            // s_3 = 1/(2 sqrt 3), still the second rung (prime-5 rung at u = 5 is fourth)
  leadingMagnitudes: Object.freeze([
    { rank: 1, a: 1, b: 0, c: 0, u: 2, s: 0.3535533905932738 },
    { rank: 2, a: 0, b: 1, c: 0, u: 3, s: 0.2886751345948129 },
    { rank: 3, a: 2, b: 0, c: 0, u: 4, s: 0.25 },
    { rank: 4, a: 0, b: 0, c: 1, u: 5, s: 0.22360679774997896 },
    { rank: 5, a: 1, b: 1, c: 0, u: 6, s: 0.2041241452319315 },
    { rank: 6, a: 3, b: 0, c: 0, u: 8, s: 0.1767766952966369 },
    { rank: 7, a: 0, b: 2, c: 0, u: 9, s: 0.16666666666666666 },
    { rank: 8, a: 1, b: 0, c: 1, u: 10, s: 0.15811388300841897 },
    { rank: 9, a: 2, b: 1, c: 0, u: 12, s: 0.14433756729740643 },
    { rank: 10, a: 0, b: 1, c: 1, u: 15, s: 0.12909944487358055 },
  ]),
  // threshold -> [two-prime count (imp-96270), three-prime count (this row)]
  countAboveThreshold: Object.freeze({
    '0.30': { twoPrime: 1, threePrime: 1 },
    '0.25': { twoPrime: 3, threePrime: 3 },
    '0.20': { twoPrime: 4, threePrime: 5 },
    '0.15': { twoPrime: 6, threePrime: 8 },
    '0.10': { twoPrime: 10, threePrime: 15 },
    '0.05': { twoPrime: 19, threePrime: 33 },
  }),
  // S-unit count(u <= U) vs the (ln U)^3/(6 ln2 ln3 ln5) cubic leading term
  cubicGrowthSamples: Object.freeze([
    { U: 1e2, count: 33, asymptotic: 13.28, ratio: 2.49 },
    { U: 1e3, count: 85, asymptotic: 44.82, ratio: 1.90 },
    { U: 1e4, count: 174, asymptotic: 106.25, ratio: 1.64 },
    { U: 1e6, count: 506, asymptotic: 358.60, ratio: 1.41 },
    { U: 1e9, count: 1529, asymptotic: 1210.26, ratio: 1.26 },
  ]),
  verdict: 'TABULATION only (three-prime extension): adding the prime 5 to S = {oo,2,3} leaves the ceiling s_2 = 0.353553 (attained once, at u = 2) and the gap 1 - sup = 0.646447 unchanged -- the first new rung u = 5 sits 0.129947 below the ceiling, so STILL only one rung lies within 0.06 of it. The tail is denser: rung-count-within-margin grows from (ln U)^2 to (ln U)^3 (sampled count(u<=1e2..1e9) = 33..1529), yet stays a finite count strictly below the ceiling for every threshold. Establishes NO operator positivity, moves NO Lambda bound, and does NOT touch the top confined states (the real residual). RH open; no refereed bound is changed; NO QED',
});

// ---- assertions
const approx = (x, y, tol) => Math.abs(x - y) <= tol;
export const IMP_96333_SPECTRAL_GAP_MARGIN_235_ASSERTIONS = Object.freeze([
  {
    id: 'imp96333-ceiling-unchanged-by-prime-5',
    description: 'the three-prime {oo,2,3,5} tail sup is still s_2 = 0.353553 (attained at u = 2, all rungs < 1) and the gap 1 - s_2 = 0.646447 is unchanged, i.e. the added prime 5 does not raise the ceiling',
    holds: () => {
      const rows = ladderMagnitudes235(1e5);
      const maxS = rows.reduce((m, r) => Math.max(m, r.s), 0);
      return approx(maxS, CEILING, 1e-15) && approx(CEILING, 0.3535533905932738, 1e-15)
        && approx(1 - maxS, 0.6464466094067263, 1e-15) && rows.every((r) => r.s < 1);
    },
  },
  {
    id: 'imp96333-first-new-rung-below-ceiling',
    description: 'the first prime-5 rung is u = 5 at s_5 = 0.223607, ranked fourth, sitting 0.129947 below the ceiling -- so only one rung (u = 2) still lies within 0.06 of the ceiling',
    holds: () => {
      const rows = ladderMagnitudes235(30);
      const idx = rows.findIndex((r) => r.u === 5);
      const withinSix = rows.filter((r) => CEILING - r.s < 0.06).length;
      return idx === 3 && approx(rows[idx].s, 0.22360679774997896, 1e-15)
        && approx(CEILING - rows[idx].s, 0.12994659284329485, 1e-12) && withinSix === 1;
    },
  },
  {
    id: 'imp96333-threshold-counts-denser-but-finite',
    description: 'the three-prime count of tail magnitudes >= t is 1,3,5,8,15,33 at t = 0.30..0.05 -- denser than the two-prime 1,3,4,6,10,19 yet a finite S-unit count u <= (1/(2t))^2 for every t > 0',
    holds: () => {
      const t = [0.30, 0.25, 0.20, 0.15, 0.10, 0.05];
      const want3 = [1, 3, 5, 8, 15, 33];
      const want2 = [1, 3, 4, 6, 10, 19];
      return t.every((tt, i) => countAboveThreshold235(tt) === want3[i] && want3[i] >= want2[i]);
    },
  },
  {
    id: 'imp96333-cubic-count-growth',
    description: 'the S-unit count(u <= U) grows like the three-prime cubic term (ln U)^3/(6 ln2 ln3 ln5): sampled 33,85,174,506,1529 at U = 1e2..1e9, ratio to the cubic decreasing toward 1',
    holds: () => {
      const K = 6 * Math.log(2) * Math.log(3) * Math.log(5);
      const samples = IMP_96333_SPECTRAL_GAP_MARGIN_235.cubicGrowthSamples;
      return samples.every((s) => {
        const cnt = ladderMagnitudes235(s.U).length;
        const asymp = Math.pow(Math.log(s.U), 3) / K;
        return cnt === s.count && approx(cnt / asymp, s.ratio, 0.01);
      });
    },
  },
  {
    id: 'imp96333-verdict-honesty',
    description: 'verdict records a TABULATION only: ceiling unchanged, no operator positivity, no Lambda move, does not touch the top confined states, asserts RH open / NO QED',
    holds: () => /TABULATION only/.test(IMP_96333_SPECTRAL_GAP_MARGIN_235.verdict)
      && /NO operator positivity/.test(IMP_96333_SPECTRAL_GAP_MARGIN_235.verdict)
      && /does NOT touch the top confined states/.test(IMP_96333_SPECTRAL_GAP_MARGIN_235.verdict)
      && /RH open/.test(IMP_96333_SPECTRAL_GAP_MARGIN_235.verdict)
      && /NO QED/.test(IMP_96333_SPECTRAL_GAP_MARGIN_235.verdict),
  },
]);

export default IMP_96333_SPECTRAL_GAP_MARGIN_235;
