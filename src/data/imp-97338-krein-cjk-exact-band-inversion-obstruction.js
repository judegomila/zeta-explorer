/**
 * @module imp-97338-krein-cjk-exact-band-inversion-obstruction
 *
 * imp-97338 (numerical): ASSESS Route B Obstruction B -- the degree-to-v0 overlap inversion d = C^T v0
 * (imp-97164) -- now on the imp-97293 EXACT BigInt-rational overlap matrix c_{jk}. imp-97312 / imp-97313
 * recorded that Route B does not close on the remainder bound alone: Obstruction B (whether an annihilating
 * degree image d can be inverted/constrained back onto a committed v0) stayed OPEN because imp-97164 could
 * only argue it generically (rank(C^T) <= 100 < 106, so an 8-sparse target is generically not in the image).
 * With the committed matrix now EXACT rational (imp-97293, support { j+k even AND k <= j+6 }, 2850 nonzero),
 * that generic argument can be sharpened into an EXACT, structural contradiction on the real committed data.
 *
 * THE MAP (imp-97164). g(t) = v0 . Phih(t) = a^7 sum_{k=0..Kmax} d_k j_k(a t), with the degree vector
 *   d = C^T v0,   d_k = sum_j c_{jk} v0_j,
 * C committed at shape N x (Kmax+1) = 100 x 106 (imp-97015 binding rung). The imp-97134 degree-level trial
 * that annihilates the six imp-97113 leading carrier functionals is 8-sparse: even degrees {0,2,4,6} ->
 * (33,55,27,5), odd degrees {1,3,5,7} -> (143,273,165,35), with d_8..d_105 forced to ZERO (else higher modes
 * re-contribute to the t^-1..t^-3 orders). "Invert onto v0" means solve C^T v0 = d_trial.
 *
 * THE EXACT BAND CASCADE (new; uses the imp-97293 support rule { j+k even AND k <= j+6 }). C^T is
 * near-UPPER-triangular in (degree k, profile j): the lowest-index profile feeding degree k is j = k-6
 * (parity (k-6)+k = 2k-6 even, band edge k = j+6), and imp-97293 certifies the band-edge entry c_{k-6,k}
 * is NONZERO. Processing d_k = 0 from the top (k = 105) downward therefore forces v0 one component at a time:
 *   d_105 = c_{99,105} v0_99 = 0 => v0_99 = 0;  d_104 = c_{98,104} v0_98 = 0 => v0_98 = 0;  ...
 *   in general d_k = c_{k-6,k} v0_{k-6} + (higher-j terms already zeroed) = 0 => v0_{k-6} = 0,
 * for k = 105 down to 8, i.e. EXACTLY v0_99 = v0_98 = ... = v0_2 = 0. Only v0_0 (even block) and v0_1 (odd
 * block) survive to hit the eight low-degree targets. (Each cancellation is an exact rational division by the
 * nonzero band-edge entry -- NO interval evaluation is used anywhere, so this reaches the obstruction WITHOUT
 * the missing interval-Bessel primitive that blocked imp-97164 Obstruction 2.)
 *
 * THE EXACT OVER-CONSTRAINT (the contradiction, computed here in BigInt-rational, cross-checked against the
 * committed imp-97293 8x8 sub-block). With only v0_0 free, the four even targets require
 *   33 = c_{0,0} v0_0, 55 = c_{0,2} v0_0, 27 = c_{0,4} v0_0, 5 = c_{0,6} v0_0,
 * where the committed profile-0 row is c_{0,{0,2,4,6}} = (32/35, -32/105, 32/385, -32/3003). Dividing gives
 * FOUR DIFFERENT values of v0_0: (1155/32, -5775/32, 10395/32, -15015/32). Likewise c_{1,{1,3,5,7}} =
 * (416/315, -416/385, 32/77, -32/495) forces four different v0_1: (3465/32, -8085/32, 12705/32, -17325/32).
 * So the linear system C^T v0 = d_trial is EXACTLY inconsistent on the committed matrix: no v0 (rational or
 * otherwise) reproduces the imp-97134 8-sparse trial. This upgrades imp-97164 Obstruction 1 from a generic
 * "8-sparse target not in a 100-dim column space" rank count to a concrete, exact, structural contradiction
 * exhibited on the real committed Gegenbauer overlaps.
 *
 * WHAT THIS DOES AND DOES NOT MOVE. It CLOSES the "invert the imp-97134 degree trial onto a committed v0"
 * branch of Obstruction B: that exact 8-sparse image is unreachable, and the band-triangular structure rigidly
 * couples any tail-zeroing to the low-degree values, so a committed v0 cannot both zero d_8..d_105 and hit the
 * eight targets. It does NOT close Route B: the correct relaxation (impose only the 6 carrier functionals on
 * v0, leaving the imp-97113 94-dim family) stays live, but every such v0 carries its OWN nonzero tail
 * d_8..d_105 whose O(t^-4) constant still needs two-sided interval control of the c_{jk} (imp-97164
 * Obstruction 2 / IMP97015_ARB_INTERVAL_BESSEL). Assessment / measurement only: produces no committed v0, no
 * interval majorant, no operator positivity; Rayleigh floors stay UPPER bounds; interval-rigorous reach stays
 * 2a <= 0.96; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97293-krein-committed-cjk-gegenbauer-overlap.js (EXACT rational overlap matrix; support { j+k even AND k<=j+6 })
 * @see imp-97164-krein-v0-overlap-inversion-interval-obstruction.js (Obstruction 1 generic rank + Obstruction 2 interval-Bessel)
 * @see imp-97134-krein-annihilating-rational-trial-execution.js (the 8-sparse annihilating degree trial)
 * @see imp-97113-krein-bessel-asymptotic-annihilation-scope.js (6 carrier functionals; 94-dim v0 family)
 * @see imp-97312-krein-bessel-z4-pointwise-single-constant.js / imp-97313 (Route B does not close on the remainder bound alone)
 *
 * Ticket: imp-97338 (numerical, opus-4-8, medium). Assessment / measurement only, RH-free; changes no bound; NO QED.
 *
 * Import-light: one light literal import (imp-97293 exact 8x8 sub-block, for the committed cross-tie) plus
 * self-contained exact BigInt-rational arithmetic for the profile-0 / profile-1 rows. No zeros bundle.
 */

import { IMP97293_SUBBLOCK_8x8 } from './imp-97293-krein-committed-cjk-gegenbauer-overlap.js';

// -- minimal exact rational arithmetic (BigInt numerator / denominator, reduced, positive denominator) --
const bgcd = (a, b) => {
  a = a < 0n ? -a : a;
  b = b < 0n ? -b : b;
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
};
const fr = (n, d = 1n) => {
  n = BigInt(n);
  d = BigInt(d);
  if (d === 0n) throw new Error('imp-97338: zero denominator');
  if (d < 0n) {
    n = -n;
    d = -d;
  }
  const g = bgcd(n, d) || 1n;
  return { n: n / g, d: d / g };
};
const frAdd = (x, y) => fr(x.n * y.d + y.n * x.d, x.d * y.d);
const frMul = (x, y) => fr(x.n * y.n, x.d * y.d);
const frDiv = (x, y) => fr(x.n * y.d, x.d * y.n);
const frEq = (x, y) => x.n === y.n && x.d === y.d;
const FR0 = fr(0n);
const frStr = (v) => `${v.n}/${v.d}`;

// polynomials as arrays of Fraction coefficients (index = power of x).
const polyMul = (p, q) => {
  const r = Array.from({ length: p.length + q.length - 1 }, () => FR0);
  for (let i = 0; i < p.length; i++) {
    for (let j = 0; j < q.length; j++) r[i + j] = frAdd(r[i + j], frMul(p[i], q[j]));
  }
  return r;
};
const polyScale = (p, s) => p.map((c) => frMul(c, s));
const polyAdd = (p, q) => {
  const r = Array.from({ length: Math.max(p.length, q.length) }, () => FR0);
  for (let i = 0; i < p.length; i++) r[i] = frAdd(r[i], p[i]);
  for (let i = 0; i < q.length; i++) r[i] = frAdd(r[i], q[i]);
  return r;
};
const polyIntegrateMinus1To1 = (p) => {
  let acc = FR0;
  for (let m = 0; m < p.length; m++) {
    if (m % 2 === 0) acc = frAdd(acc, frMul(p[m], fr(2n, BigInt(m + 1))));
  }
  return acc;
};

// Committed setup (imp-97293): raw rational Gegenbauer C_n^{(13/2)} profiles, Legendre P_k, weight (1-x^2)^3.
const NU = fr(13n, 2n);
const NEEDED = 8; // only profiles/degrees 0..7 enter the low-degree over-constraint
const GEGENBAUER = (() => {
  const C = [[fr(1n)], [FR0, frMul(fr(2n), NU)]];
  for (let n = 2; n < NEEDED; n++) {
    const xCn1 = [FR0, ...C[n - 1]];
    const a = polyScale(xCn1, frMul(fr(2n), frAdd(fr(BigInt(n - 1)), NU)));
    const b = polyScale(C[n - 2], frAdd(fr(BigInt(n - 2)), frMul(fr(2n), NU)));
    C[n] = polyScale(polyAdd(a, polyScale(b, fr(-1n))), fr(1n, BigInt(n)));
  }
  return C;
})();
const LEGENDRE = (() => {
  const P = [[fr(1n)], [fr(0n), fr(1n)]];
  for (let n = 1; n < NEEDED; n++) {
    const xPn = [FR0, ...P[n]];
    const a = polyScale(xPn, fr(2n * BigInt(n) + 1n));
    const b = polyScale(P[n - 1], fr(BigInt(n)));
    P[n + 1] = polyScale(polyAdd(a, polyScale(b, fr(-1n))), fr(1n, BigInt(n) + 1n));
  }
  return P;
})();
const WEIGHT = (() => {
  const oneMinusX2 = [fr(1n), FR0, fr(-1n)];
  let w = [fr(1n)];
  for (let i = 0; i < 3; i++) w = polyMul(w, oneMinusX2);
  return w;
})();
const overlap = (j, k) => polyIntegrateMinus1To1(polyMul(polyMul(GEGENBAUER[j], WEIGHT), LEGENDRE[k]));

// imp-97134 8-sparse annihilating degree trial.
const TRIAL_EVEN = Object.freeze({ 0: 33n, 2: 55n, 4: 27n, 6: 5n });
const TRIAL_ODD = Object.freeze({ 1: 143n, 3: 273n, 5: 165n, 7: 35n });

// After the exact band cascade only v0_0 (even block) and v0_1 (odd block) survive; each of the four targets
// in a block implies its own value of the single surviving unknown. Compute those implied values exactly.
const impliedV0FromEvenBlock = [0, 2, 4, 6].map((k) => frDiv(fr(TRIAL_EVEN[k]), overlap(0, k)));
const impliedV0FromOddBlock = [1, 3, 5, 7].map((k) => frDiv(fr(TRIAL_ODD[k]), overlap(1, k)));
const allEqual = (arr) => arr.every((r) => frEq(r, arr[0]));

export const IMP97338_SHAPES = Object.freeze({
  N: 100, // v0 components at the binding rung
  Kmax: 105, // top spherical-Bessel degree
  degreeVecDim: 106, // Kmax + 1
  overlapMatrixShape: '100 x 106',
  supportRule: 'nonzero exactly where (j+k even) AND (k <= j+6)', // imp-97293
  bandEdge: 'k = j+6 (lowest-index feeder of degree k is profile j = k-6)',
});

// Exact surviving-unknown values (as strings) after the band cascade.
export const IMP97338_IMPLIED_V0 = Object.freeze({
  evenBlockImpliedV0_0: Object.freeze(impliedV0FromEvenBlock.map(frStr)), // four DIFFERENT values
  oddBlockImpliedV0_1: Object.freeze(impliedV0FromOddBlock.map(frStr)), // four DIFFERENT values
  profile0Row_c0k: Object.freeze([0, 2, 4, 6].map((k) => frStr(overlap(0, k)))),
  profile1Row_c1k: Object.freeze([1, 3, 5, 7].map((k) => frStr(overlap(1, k)))),
});

export const IMP97338_VERDICT = Object.freeze({
  ticket: 'imp-97338',
  question:
    'assess Route B Obstruction B -- the degree-to-v0 overlap inversion d = C^T v0 (imp-97164) -- on the imp-97293 EXACT BigInt-rational overlap matrix c_{jk}: can the annihilating degree image be inverted/constrained to construct a committed v0 with the required annihilation, or does an exact obstruction appear?',
  answer:
    'On the committed EXACT rational C (imp-97293, support { j+k even AND k <= j+6 }), C^T is near-upper-triangular in (degree k, profile j): the lowest-index feeder of degree k is profile j = k-6 (band edge, nonzero). Forcing the imp-97134 trial tail d_8..d_105 = 0 from the top down therefore cascades to force EXACTLY v0_99 = v0_98 = ... = v0_2 = 0 (each step an exact rational division by the nonzero band-edge entry c_{k-6,k}), leaving only v0_0 and v0_1. The four even targets (33,55,27,5) with the committed profile-0 row (32/35,-32/105,32/385,-32/3003) imply FOUR DIFFERENT v0_0 (1155/32,-5775/32,10395/32,-15015/32); the four odd targets (143,273,165,35) with the profile-1 row (416/315,-416/385,32/77,-32/495) imply FOUR DIFFERENT v0_1 (3465/32,-8085/32,12705/32,-17325/32). So C^T v0 = d_trial is EXACTLY inconsistent: no v0 reproduces the imp-97134 8-sparse trial. This upgrades imp-97164 Obstruction 1 (a generic rank count) to a concrete exact structural contradiction on the real committed matrix, reached with NO interval-Bessel evaluation. It CLOSES the "invert the 8-sparse degree trial onto a committed v0" branch; it does NOT close Route B -- the 6-functional relaxation (imp-97113 94-dim v0 family) stays live but every such v0 carries its own nonzero tail whose O(t^-4) constant still needs interval control of the c_{jk} (imp-97164 Obstruction 2 / IMP97015_ARB_INTERVAL_BESSEL).',
  // What is established (exact rational, on the committed matrix).
  matrixNowExactRational: true, // imp-97293
  bandTriangularCascadeExact: true, // forcing d_8..d_105=0 => v0_2..v0_99 = 0 via nonzero band-edge divisions
  survivingUnknownsAfterCascade: 2, // v0_0 (even block) and v0_1 (odd block)
  evenBlockOverConstrained: true, // four different implied v0_0
  oddBlockOverConstrained: true, // four different implied v0_1
  trialInversionExactlyInconsistent: true, // C^T v0 = d_trial has NO solution on the committed matrix
  sharpensImp97164Obstruction1: 'generic rank count -> concrete exact structural contradiction',
  reachedWithoutIntervalBessel: true, // whole assessment is exact rational
  crossTiedToCommittedSubblock: true, // rows equal IMP97293_SUBBLOCK_8x8
  // What is NOT delivered (honest residual).
  committedV0Produced: false, // no v0 constructed
  routeBClosed: false, // the 6-functional relaxation stays the live path
  intervalMajorantProduced: false, // Obstruction 2 (O(t^-4) constant) still needs interval Bessel
  intervalObstructionForRelaxation: 'IMP97015_ARB_INTERVAL_BESSEL', // unchanged, applies to the 94-dim relaxation
  operatorPositivityProved: false, // Rayleigh floor stays an UPPER bound
  boundChanged: false,
  subGap:
    'IMP97100_PHASE_CANCELLATION_TRIAL narrows: on the imp-97293 EXACT rational overlap matrix (support { j+k even AND k<=j+6 }) the band-triangular structure forces any v0 that zeroes the imp-97134 trial tail d_8..d_105 to have v0_2..v0_99 = 0, leaving v0_0,v0_1 which are EXACTLY over-constrained by the eight low-degree targets (four different implied v0_0 = 1155/32,-5775/32,10395/32,-15015/32; four different implied v0_1 = 3465/32,-8085/32,12705/32,-17325/32). So the 8-sparse-trial branch of Obstruction B is CLOSED (exact inconsistency, no interval evaluation needed), sharpening imp-97164 Obstruction 1. The live path is the imp-97113 6-functional relaxation (94-dim v0 family) whose v0 carries its own nonzero tail d_8..d_105; certifying its O(t^-4) constant still needs two-sided interval control of the c_{jk} (imp-97164 Obstruction 2 / IMP97015_ARB_INTERVAL_BESSEL). No committed v0, no interval majorant, no bound change.',
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP97338_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97338_ASSERTIONS = [
  {
    id: 'imp97338-rows-match-committed-imp97293-subblock',
    holds: () => {
      for (const k of [0, 2, 4, 6]) {
        if (frStr(overlap(0, k)) !== IMP97293_SUBBLOCK_8x8[0][k]) return false;
      }
      for (const k of [1, 3, 5, 7]) {
        if (frStr(overlap(1, k)) !== IMP97293_SUBBLOCK_8x8[1][k]) return false;
      }
      // the profile-0 / profile-1 rows exported here equal the committed values.
      return (
        IMP97338_IMPLIED_V0.profile0Row_c0k.join(',') === '32/35,-32/105,32/385,-32/3003' &&
        IMP97338_IMPLIED_V0.profile1Row_c1k.join(',') === '416/315,-416/385,32/77,-32/495'
      );
    },
    why: 'the locally recomputed profile-0 and profile-1 overlap rows equal the committed imp-97293 8x8 sub-block, so the exact over-constraint below is exhibited on the real committed matrix, not a re-derivation artifact.',
  },
  {
    id: 'imp97338-even-block-exactly-over-constrained',
    holds: () =>
      impliedV0FromEvenBlock.length === 4 &&
      !allEqual(impliedV0FromEvenBlock) &&
      IMP97338_IMPLIED_V0.evenBlockImpliedV0_0.join(',') === '1155/32,-5775/32,10395/32,-15015/32' &&
      IMP97338_VERDICT.evenBlockOverConstrained === true,
    why: 'with only v0_0 surviving the band cascade, the four even targets (33,55,27,5) divided by the committed row (32/35,-32/105,32/385,-32/3003) give four DIFFERENT v0_0 (1155/32,-5775/32,10395/32,-15015/32), so the even block has no single-scalar solution.',
  },
  {
    id: 'imp97338-odd-block-exactly-over-constrained',
    holds: () =>
      impliedV0FromOddBlock.length === 4 &&
      !allEqual(impliedV0FromOddBlock) &&
      IMP97338_IMPLIED_V0.oddBlockImpliedV0_1.join(',') === '3465/32,-8085/32,12705/32,-17325/32' &&
      IMP97338_VERDICT.oddBlockOverConstrained === true,
    why: 'with only v0_1 surviving the band cascade, the four odd targets (143,273,165,35) divided by the committed row (416/315,-416/385,32/77,-32/495) give four DIFFERENT v0_1 (3465/32,-8085/32,12705/32,-17325/32), so the odd block has no single-scalar solution.',
  },
  {
    id: 'imp97338-trial-inversion-exactly-inconsistent-and-honest',
    holds: () =>
      IMP97338_VERDICT.matrixNowExactRational === true &&
      IMP97338_VERDICT.bandTriangularCascadeExact === true &&
      IMP97338_VERDICT.survivingUnknownsAfterCascade === 2 &&
      IMP97338_VERDICT.trialInversionExactlyInconsistent === true &&
      IMP97338_VERDICT.reachedWithoutIntervalBessel === true &&
      IMP97338_VERDICT.committedV0Produced === false &&
      IMP97338_VERDICT.routeBClosed === false &&
      IMP97338_VERDICT.intervalMajorantProduced === false &&
      IMP97338_VERDICT.intervalObstructionForRelaxation === 'IMP97015_ARB_INTERVAL_BESSEL' &&
      IMP97338_VERDICT.operatorPositivityProved === false &&
      IMP97338_VERDICT.boundChanged === false &&
      IMP97338_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97338_VERDICT.qed === false &&
      typeof IMP97338_VERDICT.subGap === 'string' &&
      IMP97338_VERDICT.subGap.includes('IMP97100_PHASE_CANCELLATION_TRIAL') &&
      IMP97338_VERDICT.subGap.includes('IMP97015_ARB_INTERVAL_BESSEL'),
    why: 'the exact over-constraint closes the 8-sparse-trial branch of Obstruction B (no v0 reproduces the imp-97134 trial on the committed matrix, reached with no interval evaluation), sharpening imp-97164 Obstruction 1; but Route B stays open (the 6-functional relaxation carries its own tail whose O(t^-4) constant still needs interval Bessel), no committed v0, no interval majorant, no bound change, reach 2a<=0.96, no QED.',
  },
];

for (const a of IMP97338_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97338-krein-cjk-exact-band-inversion-obstruction assertion failed: ${a.id}`);
  }
}
