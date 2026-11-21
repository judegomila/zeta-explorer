/**
 * imp-96270 (2026-09-24) — NUMERICAL (documentation/measurement only): tabulate the imp-96143
 * COMPANION (I) SPECTRAL-GAP MARGIN across the mixed 2^a 3^b {oo,2,3} prolate ladder. imp-96175
 * flags this as a SEPARATE reduction, not covered by the summability-dichotomy headword: fact (I)
 * says every ladder-tail magnitude s_u = u^{-1/2}/2 (over S-units u = 2^a 3^b, (a,b) != (0,0)) is
 * <= s_2 = 0.353553 < 1, so the whole tail sits a wide gap 1 - 0.353553 = 0.646447 below modulus 1.
 * Here we TABULATE the leading magnitudes and MEASURE how fast the tail decays below the 0.353553
 * ceiling. This is a tabulation of the already-reduced fact (I): it diagonalizes nothing, establishes
 * NO operator positivity, moves NO Lambda bound / verified height, and closes NOTHING about the
 * finitely-many top confined states (the actual residual). RH open; no refereed bound is changed; NO QED.
 *
 * ---------------------------------------------------------------------------------------------------
 * THE LADDER (from imp-96143). The A_S23 = P_1 F_S23 P_1 spectrum tail clusters on the S-unit ladder:
 *  magnitude s_u = u^{-1/2}/2 with multiplicity m_u ~ C u over u = 2^a 3^b, (a,b) != (0,0). Fact (I)
 *  is that sup over the tail is s_2 = 2^{-1/2}/2 = 0.353553 (the largest rung, at u = 2), strictly
 *  below 1 by the margin 0.646447. The gap question then confines to the top confined states OUTSIDE
 *  the ladder (p = 2 top = 0.9999731 < 1) -- NOT touched here.
 *
 * LEADING MAGNITUDES (sorted by u ascending = magnitude descending), s_u and margin s_2 - s_u below
 *  the ceiling:
 *    rank  (a,b)   u    s_u          s_2 - s_u
 *      1   (1,0)   2    0.353553     0.000000   <- the ceiling (top tail rung)
 *      2   (0,1)   3    0.288675     0.064878
 *      3   (2,0)   4    0.250000     0.103553
 *      4   (1,1)   6    0.204124     0.149429
 *      5   (3,0)   8    0.176777     0.176777
 *      6   (0,2)   9    0.166667     0.186887
 *      7   (2,1)  12    0.144338     0.209216
 *      8   (4,0)  16    0.125000     0.228553
 *      9   (1,2)  18    0.117851     0.235702
 *     10   (3,1)  24    0.102062     0.251491
 *  The second rung already drops to 0.288675 (ratio s_3/s_2 = sqrt(2/3) = 0.816497), i.e. every rung
 *  below the ceiling has a clear finite margin: the tail is nowhere near the ceiling except at u = 2.
 *
 * DECAY BELOW THE CEILING. Because s_u = u^{-1/2}/2 is monotone decreasing in u, the count of tail
 *  magnitudes at or above any threshold t is EXACTLY the number of S-units u = 2^a 3^b (excluding 1)
 *  with u <= (1/(2t))^2 -- a FINITE lattice-point count that grows only like (ln U)^2 / (2 ln2 ln3):
 *    t = 0.30 : 1 rung   (u <= 2.78)
 *    t = 0.25 : 3 rungs  (u <= 4)
 *    t = 0.20 : 4 rungs  (u <= 6.25)
 *    t = 0.15 : 6 rungs  (u <= 11.11)
 *    t = 0.10 : 10 rungs (u <= 25)
 *    t = 0.05 : 19 rungs (u <= 100)
 *  So only ONE rung sits within 0.06 of the ceiling, and the number of rungs within any margin of 1 is
 *  finite (all below 0.354); the magnitudes decay geometrically along each (a,b) direction
 *  (ratio 2^{-1/2} per a-step, 3^{-1/2} per b-step). The gap 1 - sup_tail |lam| = 0.646447 is wide and
 *  attained only at the single top rung u = 2.
 *
 * HONEST LIMITS. This is a TABULATION of the magnitude multiset already reduced in imp-96143, not a
 *  diagonalization: the per-block norm s_u = u^{-1/2}/2 is the rigorous ingredient (dilation unitarity +
 *  Euler 1/2 weight), the multiplicity m_u = O(u) is extrapolated from p = 2, and fact (I) as a
 *  spectral-gap statement STILL depends on the mixed-group no-modulus-1 theorem for the finitely-many
 *  top confined states -- which this row does NOT address. Nothing here establishes operator positivity,
 *  moves a Lambda bound, or touches a verified height. RH open; no refereed bound is changed; NO QED.
 *
 * Import-light: pure geometric arithmetic, no imports, no zeros bundle. Reproduction inline.
 */

const CEILING = Math.pow(2, -0.5) / 2;   // s_2 = 0.3535533905932738, the top tail rung

/** the S-unit ladder magnitudes s_u = u^{-1/2}/2, u = 2^a 3^b, (a,b) != (0,0), sorted magnitude-descending,
 *  restricted to u <= uMax (finite because s_u decreases in u) */
export function ladderMagnitudes(uMax = 200) {
  const rows = [];
  for (let a = 0; a <= 40; a++) {
    for (let b = 0; b <= 40; b++) {
      if (a === 0 && b === 0) continue;
      const u = Math.pow(2, a) * Math.pow(3, b);
      if (u > uMax) continue;
      rows.push({ a, b, u, s: Math.pow(u, -0.5) / 2 });
    }
  }
  rows.sort((x, y) => x.u - y.u);
  return rows;
}

/** count of tail magnitudes at or above threshold t = # S-units (excluding 1) with u <= (1/(2t))^2 */
export function countAboveThreshold(t, uMax = 1e6) {
  return ladderMagnitudes(uMax).filter((r) => r.s >= t).length;
}

export const IMP_96270_SPECTRAL_GAP_MARGIN = Object.freeze({
  id: 'imp-96270-mixed-ladder-spectral-gap-margin-tabulation',
  route: 'I (Sonine refinement) — tabulation of the imp-96143 companion fact (I) spectral-gap margin (imp-96175 separate reduction)',
  parents: [
    'src/data/imp-96143-route-i-mixed-ladder-23-prolate-spectrum-summability.js (fact (I): every tail magnitude <= s_2 = 0.353553 < 1; (II) cubic tail established)',
    'src/data/imp-96175-mixed-ladder-summability-dichotomy-glossary-headword.js (flags fact (I) as a separate reduction, not covered by the summability-dichotomy headword)',
  ],
  ceiling: 0.3535533905932738,               // s_2 = 2^{-1/2}/2, largest tail magnitude
  gapBelowOne: 0.6464466094067263,           // 1 - s_2, the spectral-gap margin of the WHOLE ladder tail
  secondRung: 0.2886751345948129,            // s_3 = 1/(2 sqrt 3)
  secondRungRatio: 0.816496580927726,        // s_3/s_2 = sqrt(2/3)
  leadingMagnitudes: Object.freeze([
    { rank: 1, a: 1, b: 0, u: 2, s: 0.3535533905932738 },
    { rank: 2, a: 0, b: 1, u: 3, s: 0.2886751345948129 },
    { rank: 3, a: 2, b: 0, u: 4, s: 0.25 },
    { rank: 4, a: 1, b: 1, u: 6, s: 0.2041241452319315 },
    { rank: 5, a: 3, b: 0, u: 8, s: 0.1767766952966369 },
    { rank: 6, a: 0, b: 2, u: 9, s: 0.16666666666666666 },
    { rank: 7, a: 2, b: 1, u: 12, s: 0.14433756729740643 },
    { rank: 8, a: 4, b: 0, u: 16, s: 0.125 },
    { rank: 9, a: 1, b: 2, u: 18, s: 0.11785113019775793 },
    { rank: 10, a: 3, b: 1, u: 24, s: 0.10206207261596574 },
  ]),
  countAboveThreshold: Object.freeze({ '0.30': 1, '0.25': 3, '0.20': 4, '0.15': 6, '0.10': 10, '0.05': 19 }),
  verdict: 'TABULATION only: the mixed 2^a 3^b ladder tail sup is s_2 = 0.353553 (attained once, at u = 2), gap 1 - sup = 0.646447; the second rung already drops to 0.288675 (ratio sqrt(2/3) = 0.816497) and the count of rungs above any threshold t is the finite S-unit count u <= (1/(2t))^2, growing only like (ln U)^2. Establishes NO operator positivity, moves NO Lambda bound, and does NOT touch the top confined states (the real residual). RH open; no refereed bound is changed; NO QED',
});

// ---- assertions
const approx = (x, y, tol) => Math.abs(x - y) <= tol;
export const IMP_96270_SPECTRAL_GAP_MARGIN_ASSERTIONS = Object.freeze([
  {
    id: 'imp96270-ceiling-and-gap',
    description: 'the largest tail magnitude is s_2 = 2^{-1/2}/2 = 0.353553 (attained at the single S-unit u = 2 over a wide box) and the spectral-gap margin of the whole ladder tail is 1 - s_2 = 0.646447',
    holds: () => {
      const rows = ladderMagnitudes(1e5);
      const maxS = rows.reduce((m, r) => Math.max(m, r.s), 0);
      return approx(maxS, CEILING, 1e-15) && approx(CEILING, 0.3535533905932738, 1e-15)
        && approx(1 - maxS, 0.6464466094067263, 1e-15) && maxS < 1;
    },
  },
  {
    id: 'imp96270-leading-magnitudes-descending',
    description: 'the tabulated leading ten magnitudes match u = 2,3,4,6,8,9,12,16,18,24 with s_u = u^{-1/2}/2, are strictly decreasing, and the second rung s_3 = 0.288675 has ratio sqrt(2/3) = 0.816497 to the ceiling',
    holds: () => {
      const rows = ladderMagnitudes(30).slice(0, 10);
      const okU = [2, 3, 4, 6, 8, 9, 12, 16, 18, 24].every((u, i) => rows[i].u === u);
      const decreasing = rows.every((r, i) => i === 0 || r.s < rows[i - 1].s);
      const okS = rows.every((r) => approx(r.s, Math.pow(r.u, -0.5) / 2, 1e-15));
      const ratio = approx(rows[1].s / rows[0].s, Math.sqrt(2 / 3), 1e-12);
      return okU && decreasing && okS && ratio && approx(rows[1].s, 0.2886751345948129, 1e-12);
    },
  },
  {
    id: 'imp96270-threshold-counts-finite',
    description: 'the count of tail magnitudes >= t equals the finite S-unit count u <= (1/(2t))^2: 1,3,4,6,10,19 at t = 0.30,0.25,0.20,0.15,0.10,0.05 -- only one rung within 0.06 of the ceiling, the count finite for every t > 0',
    holds: () => {
      const t = [0.30, 0.25, 0.20, 0.15, 0.10, 0.05];
      const want = [1, 3, 4, 6, 10, 19];
      return t.every((tt, i) => countAboveThreshold(tt) === want[i]);
    },
  },
  {
    id: 'imp96270-verdict-honesty',
    description: 'verdict records a TABULATION only: no operator positivity, no Lambda move, does not touch the top confined states, asserts RH open / NO QED',
    holds: () => /TABULATION only/.test(IMP_96270_SPECTRAL_GAP_MARGIN.verdict)
      && /NO operator positivity/.test(IMP_96270_SPECTRAL_GAP_MARGIN.verdict)
      && /does NOT touch the top confined states/.test(IMP_96270_SPECTRAL_GAP_MARGIN.verdict)
      && /RH open/.test(IMP_96270_SPECTRAL_GAP_MARGIN.verdict)
      && /NO QED/.test(IMP_96270_SPECTRAL_GAP_MARGIN.verdict),
  },
]);

export default IMP_96270_SPECTRAL_GAP_MARGIN;
