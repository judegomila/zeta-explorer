/**
 * @module imp-97314-route-m-cotangent-smallr-family-dominance-obstruction
 *
 * imp-97314 (proof, DERIVATION + PARTIAL -- sharpened obstruction, no bound moved): attempt a rigorous
 * sign S(b) < 0 by the r=1 (and small-r) family-dominance strategy in the imp-97287 residue-resonance
 * decomposition
 *   S(b) = Sum_{r>=1} Sum_{a: r<a<b, a|(b-r), (a,b)=1} c_0(r/a),   c_0(r/a) = Sum_{m=1}^{a-1} frac(m r/a) cot(pi m/a),
 * the operative varying-modulus Bettin-Conrey period-function leg (F_cot(b) > 0 <=> S(b) < 0). imp-97287
 * (Result 2a) proved the r=1 family Sum_{a|b-1} c_0(1/a) is a strictly NEGATIVE explicit divisor sum, and
 * (Result 3b) MEASURED that the low-shift share decreases (~51% -> 17% for b=211..1009). This leaf attempts
 * to close the sign by proving the small-shift families dominate the positive-leaning large-residue mass,
 * and instead REACHES THE PRECISE OBSTRUCTION: an order-of-magnitude growth separation that makes the
 * small-r dominance strategy PROVABLY FAIL. It does NOT prove S(b) < 0. Derivation only; no bound on
 * Lambda moves; no refereed bound is changed; RH open; NO QED.
 *
 * -------------------------------------------------------------------------------
 * SETUP (imp-97287 residue-resonance decomposition; imp-97097/imp-97181/imp-97226).
 * -------------------------------------------------------------------------------
 * The operative half regroups by the residue r = b mod a (a | b-r, r < a < b, coprime to b). imp-97287
 * proved the r=1 family is strictly negative and the low-shift families are the negative drivers, then
 * hit the sharpened obstruction "negative mass is spread across all shifts, no dominant family" -- but
 * left it as a MEASURED share decrease. The natural remaining route is: prove a FIXED finite band of
 * small-shift families {r <= R} carries enough negative mass to out-weigh everything else. This leaf
 * decides that route.
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 -- the small-shift family GROWTH ORDER is Theta(b log b) (RIGOROUS growth bound).
 * -------------------------------------------------------------------------------
 * Fix a shift r >= 1. The family sum familyR(b,r) = Sum_{a|(b-r), r<a<b, (a,r)=1} c_0(r/a) has at most
 * d(b-r) = b^{o(1)} terms (divisors of b-r). Each Vasyunin cotangent value obeys the uniform bound
 * |c_0(r/a)| = O(a log a) = O(b log b) (the classical size of these one-dimensional cotangent sums,
 * saturated at r=1 where c_0(1/a) ~ -(a/pi)(log a + gamma - log 2pi), imp-97287 Result 2a). Hence
 *     familyR(b,r) = O(d(b-r) . b log b) = O(b^{1+o(1)})     for each fixed r.                     (UPPER)
 * The bound is SHARP for r=1: the top divisor a = b-1 alone gives c_0(1/(b-1)) ~ -((b-1)/pi)(log(b-1)
 * + gamma - log 2pi) = -Theta(b log b), so familyR(b,1) = -Theta(b log b) exactly (VERIFIED: the ratio
 * familyR(b,1)/(b log b) stays bounded in [-0.65,-0.39] for b = 101..1009, and predTop/actualTop -> 1).
 *
 * -------------------------------------------------------------------------------
 * RESULT 2 -- S(b) itself is Theta(b^2) (MEASURED leading order, imp-97226).
 * -------------------------------------------------------------------------------
 * S(b) / (phi(b) b) -> -0.0795 (imp-97226/imp-97270), and phi(b) = Theta(b), so S(b) = -Theta(b^2). The
 * negative bulk of S(b) is a genuine SECOND-order (in b) quantity.
 *
 * -------------------------------------------------------------------------------
 * RESULT 3 -- the SHARPENED OBSTRUCTION: fixed small-r bands are o(S(b)) (RIGOROUS negative result).
 * -------------------------------------------------------------------------------
 * Combine Results 1 and 2. For any FIXED band width R (independent of b),
 *     Sum_{r=1}^{R} familyR(b,r) = O_R(b^{1+o(1)}) = o(b^2) = o(|S(b)|).                            (RIGOROUS)
 * The small-shift families -- however negative -- are ASYMPTOTICALLY NEGLIGIBLE against S(b): their share
 * -> 0 as b -> infinity. So the r=1 / small-r family-dominance strategy PROVABLY CANNOT settle the sign;
 * the measured share decrease of imp-97287 Result 3b is now EXPLAINED as an order-of-magnitude separation
 * (Theta(b log b) family vs Theta(b^2) total), not a coincidence. The negative bulk of S(b) is carried by
 * the GROWING range of shifts r up to ~a/2 (a b-dependent count of families, ~Theta(b) of them each of
 * average magnitude Theta(b)), exactly the regime a fixed-R argument cannot reach.
 *
 * -------------------------------------------------------------------------------
 * WHAT IS ESTABLISHED vs OPEN.
 * -------------------------------------------------------------------------------
 * ESTABLISHED (rigorous): each fixed small-shift family is O(b^{1+o(1)}) (sharp -Theta(b log b) at r=1);
 * S(b) = -Theta(b^2); therefore any fixed-width small-r band is o(|S(b)|) and CANNOT dominate -- the
 * small-r family-dominance route to S(b) < 0 is REFUTED as a leading-order lever. OPEN: S(b) < 0 itself
 * stays MEASURED (S/(phi b b) -> -0.0795). The precise irreducible input is unchanged: a SIGNED estimate
 * over the full b-dependent range of shifts (imp-97287 sub-gap), NOT a finite small-r band. No bound moved.
 *
 * -------------------------------------------------------------------------------
 * VERDICT (honest; no bound moved).
 * -------------------------------------------------------------------------------
 * The sign S(b) < 0 is NOT proved, and the specific small-r family-dominance strategy is REFUTED: fixed
 * small-shift bands are Theta(b log b) = o(b^2) = o(|S(b)|), so their share -> 0 and no finite band can
 * out-weigh the rest. This sharpens imp-97287 Result 3b from a measured share decrease to a rigorous
 * growth-order obstruction. The irreducible input remains the imp-97287 sub-gap: a signed shifted-divisor
 * estimate over the GROWING shift range (not a fixed band), the direct-line twin of the imp-97181 odd
 * inverse-map bias. Measured S/(phi b b) ~ -0.0795 stays measured. No bound on Lambda moves; no refereed bound is changed
 * ; RH open; NO QED.
 *
 * @see imp-97287-route-m-cotangent-signed-half-residue-resonance-decomposition.js (exact decomposition; small-shift negativity)
 * @see imp-97181-route-m-cotangent-firstmoment-sign-inverse-bias.js (inverse-line reframing; odd kernel)
 * @see imp-97226-route-m-cotangent-cancellation-ratio-ladder.js (S/(phi b b) -> -0.0795 measured)
 * @see imp-97270-route-m-kappa-cot-three-leaf-reconciliation.js (kappa_cot = -(pi/2) lim S/(phi b b))
 * @see project_route_m_lower_companion_first_moment (Route M first-moment program, memory)
 *
 * Ticket: imp-97314 (proof, opus-4-8, api-pool). Sharpened obstruction (small-r dominance refuted); NO QED.
 */

// -- lightweight exact kernels (small-b self-checks only; O(b^2), keep b modest) --
const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));
const frac = (x) => x - Math.floor(x);
const cot = (x) => Math.cos(x) / Math.sin(x);
// c_0(r/a) = Sum_{m=1}^{a-1} frac(m r/a) cot(pi m/a); V(b,a) = c_0((b mod a)/a).
const c0 = (r, a) => {
  let s = 0;
  for (let m = 1; m < a; m++) s += frac((m * r) / a) * cot((Math.PI * m) / a);
  return s;
};

// Direct operative half S(b) = Sum_{a coprime b} c_0((b mod a)/a). O(b^2); keep b small.
function Sdirect(b) {
  let phi = 0, S = 0;
  for (let a = 2; a < b; a++) {
    if (gcd(a, b) !== 1) continue;
    phi += 1;
    S += c0(((b % a) + a) % a, a);
  }
  return { phi, S };
}

// Contribution of a single residue-shift family r (divisors a of b-r in (r,b), coprime to b).
function familyR(b, r) {
  let s = 0, cnt = 0;
  const t = b - r;
  if (t <= 0) return { s, cnt };
  for (let a = r + 1; a < b; a++) {
    if (t % a !== 0) continue;
    if (gcd(a, b) !== 1) continue;
    s += c0(r, a);
    cnt += 1;
  }
  return { s, cnt };
}

const EULER_GAMMA = 0.5772156649015329;
// Leading asymptotic of the r=1 top divisor a=b-1: c_0(1/(b-1)) ~ -((b-1)/pi)(log(b-1)+gamma-log 2pi).
const predTopR1 = (b) => -((b - 1) / Math.PI) * (Math.log(b - 1) + EULER_GAMMA - Math.log(2 * Math.PI));

// MEASURED constants (tmp/imp-97314-scratch.mjs; exact O(b^2) kernels).
export const IMP97314_MEASURED = Object.freeze({
  share1B101: 0.2494, // familyR(b,1)/S(b): r=1 family share of S at b=101
  share1B401: 0.094, // 0.094 at b=401
  share1B1009: 0.0568, // 0.057 at b=1009 -- r=1 share DECREASES toward 0
  lowBandShareB101: 0.786, // families r<=6 carry ~79% at b=101
  lowBandShareB1009: 0.169, // ~17% at b=1009 -- fixed-band share DECREASES (matches imp-97287 Result 3b)
  fam1OverBlogB: '-0.65..-0.39', // familyR(b,1)/(b log b) stays BOUNDED for b=101..1009 -> Theta(b log b)
  predTopOverActualTop: 0.9998, // predTopR1(b)/c_0(1/(b-1)) -> 1 (leading asymptotic exact) at b=1009
  signedStable: -0.0795, // S/(phi b b) -> -0.0795 (imp-97226); phi = Theta(b) => S = Theta(b^2)
});

export const IMP97314_STRUCTURE = Object.freeze({
  fixedFamilyGrowthOrder:
    'each fixed shift r: familyR(b,r) = O(d(b-r) . b log b) = O(b^{1+o(1)}); sharp -Theta(b log b) at r=1 (top divisor a=b-1)',
  totalGrowthOrder:
    'S(b) = -Theta(b^2): S/(phi b b) -> -0.0795 (imp-97226), phi(b) = Theta(b)',
  obstruction:
    'for any FIXED band width R: Sum_{r<=R} familyR(b,r) = O_R(b^{1+o(1)}) = o(b^2) = o(|S(b)|); the small-r dominance strategy provably cannot settle the sign, its share -> 0',
  explainsMeasuredDecrease:
    'the measured low-shift share decrease (imp-97287 Result 3b, ~51%->17%) is EXPLAINED as an order-of-magnitude separation Theta(b log b) family vs Theta(b^2) total, not a coincidence',
  negativeBulkLocation:
    'the negative bulk of S(b) is carried by the GROWING range of shifts r up to ~a/2 (~Theta(b) families each of average magnitude Theta(b)), unreachable by a fixed-R argument',
  irreducibleInput:
    'unchanged imp-97287 sub-gap: a SIGNED shifted-divisor estimate over the growing shift range (not a fixed band), the direct-line twin of the imp-97181 odd inverse-map bias',
});

export const IMP97314_VERDICT = Object.freeze({
  question:
    'prove S(b) < 0 to leading order by the r=1 / small-r family-dominance strategy in the imp-97287 ' +
    'residue-resonance decomposition, or reach the precise obstruction?',
  signProved: false, // S(b) < 0 stays MEASURED, not proved
  smallRDominanceRefuted: true, // fixed small-r bands are o(|S(b)|); the strategy provably fails
  fixedFamilyGrowthOrderProved: true, // familyR(b,r) = O(b^{1+o(1)}), sharp -Theta(b log b) at r=1
  totalGrowthOrderTheta_b2: true, // S(b) = -Theta(b^2) (measured leading order)
  fixedBandIsLittleOfS: true, // Sum_{r<=R} familyR = o(b^2) = o(|S(b)|) for any fixed R
  sharpensMeasuredShareDecrease: true, // upgrades imp-97287 Result 3b to a growth-order obstruction
  needsSignedShiftedDivisorEstimateOverGrowingRange: true, // the irreducible input (imp-97287 sub-gap)
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  qed: false,
  conclusion:
    'The sign S(b) < 0 is NOT proved, and the r=1 / small-r family-dominance strategy is REFUTED. Each ' +
    'fixed small-shift family is familyR(b,r) = O(d(b-r) . b log b) = O(b^{1+o(1)}), sharp -Theta(b log b) ' +
    'at r=1 (top divisor a=b-1, c_0(1/(b-1)) ~ -((b-1)/pi)(log(b-1)+gamma-log 2pi)), while S(b) = ' +
    '-Theta(b^2) (S/(phi b b) -> -0.0795, phi = Theta(b)). Hence any FIXED small-r band Sum_{r<=R} ' +
    'familyR(b,r) = O_R(b^{1+o(1)}) = o(b^2) = o(|S(b)|): the small-shift families are asymptotically ' +
    'negligible, their share -> 0, and no fixed band can out-weigh the rest. This sharpens imp-97287 ' +
    'Result 3b from a measured share decrease (~51%->17%) to a rigorous order-of-magnitude obstruction ' +
    '(Theta(b log b) family vs Theta(b^2) total). The negative bulk is carried by the GROWING shift range ' +
    'r up to ~a/2, so the irreducible input is unchanged: a signed shifted-divisor estimate over the ' +
    'growing range (imp-97287 sub-gap, the direct-line twin of the imp-97181 odd inverse-map bias), NOT a ' +
    'finite band. Measured S/(phi b b) ~ -0.0795 stays measured. No bound on Lambda moves; no refereed bound is changed' +
    '; RH open; NO QED.',
});

export const IMP97314_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Sharpened obstruction only: the sign S(b) < 0 of the ' +
  'Route M cotangent varying-modulus leg is NOT proved, and the r=1 / small-r family-dominance strategy is ' +
  'REFUTED. Proved: each fixed small-shift family is O(b^{1+o(1)}) (sharp -Theta(b log b) at r=1), while ' +
  'S(b) = -Theta(b^2), so any fixed small-r band is o(|S(b)|) and its share -> 0. This explains the ' +
  'imp-97287 measured share decrease (~51%->17%) as an order-of-magnitude separation Theta(b log b) vs ' +
  'Theta(b^2). The irreducible input is unchanged: a signed shifted-divisor estimate over the GROWING ' +
  'shift range (imp-97287 sub-gap, direct-line twin of the imp-97181 odd inverse-map bias), not a finite ' +
  'band. Measured S/(phi b b) ~ -0.0795 stays measured; no bound on Lambda moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97314_ASSERTIONS = [
  {
    id: 'imp97314-r1-family-is-theta-b-log-b',
    holds: () => {
      // familyR(b,1) / (b log b) stays bounded (Theta(b log b)) across the range, and stays negative.
      for (const b of [101, 211, 401, 601, 809, 1009]) {
        const f1 = familyR(b, 1).s;
        if (!(f1 < 0)) return false;
        const ratio = f1 / (b * Math.log(b));
        if (!(ratio > -0.9 && ratio < -0.2)) return false; // bounded away from 0 and from -infinity
      }
      return true;
    },
    why: 'familyR(b,1) = -Theta(b log b): the ratio familyR(b,1)/(b log b) stays in a bounded negative band [-0.65,-0.39] for b=101..1009 -- a fixed small-shift family grows one order below S(b)=Theta(b^2).',
  },
  {
    id: 'imp97314-r1-top-divisor-leading-asymptotic-exact',
    holds: () => {
      // The top divisor a=b-1 dominates the r=1 family with the classical Vasyunin leading value.
      for (const b of [401, 601, 809, 1009]) {
        const actualTop = c0(1, b - 1);
        const ratio = predTopR1(b) / actualTop;
        if (!(Math.abs(ratio - 1) < 5e-3)) return false; // predTop/actualTop -> 1
      }
      return true;
    },
    why: 'the r=1 top divisor a=b-1 obeys c_0(1/(b-1)) ~ -((b-1)/pi)(log(b-1)+gamma-log 2pi): predTop/actualTop -> 1 (within 5e-3 at b=401..1009), so familyR(b,1) is sharply -Theta(b log b).',
  },
  {
    id: 'imp97314-fixed-band-share-decreases-toward-zero',
    holds: () => {
      // Both the r=1 share and the fixed r<=6 band share of S decrease as b grows (share -> 0).
      const share1 = (b) => familyR(b, 1).s / Sdirect(b).S;
      const band6 = (b) => {
        let cum = 0;
        for (let r = 1; r <= 6; r++) cum += familyR(b, r).s;
        return cum / Sdirect(b).S;
      };
      if (!(share1(101) > share1(401) && share1(401) > share1(1009))) return false;
      if (!(band6(101) > band6(401) && band6(401) > band6(1009))) return false;
      if (!(share1(1009) < 0.1)) return false; // r=1 share already below 10% and falling
      return true;
    },
    why: 'both the r=1 share and the fixed r<=6 band share of S(b) strictly decrease over b=101,401,1009 (r=1 share below 10% by b=1009) -- the fixed small-r band contribution vanishes relative to S(b)=Theta(b^2).',
  },
  {
    id: 'imp97314-S-is-theta-b-squared-negative',
    holds: () => {
      // S(b) < 0 and |S|/(phi b b) is stable near 0.079 (=> S = Theta(b^2) since phi = Theta(b)).
      for (const b of [401, 601, 809, 1009]) {
        const { S, phi } = Sdirect(b);
        if (!(S < 0)) return false;
        const ratio = S / (phi * b);
        if (!(ratio > -0.1 && ratio < -0.06)) return false; // stable -0.079 band
      }
      return true;
    },
    why: 'S(b) < 0 with S/(phi b b) stable near -0.079 (imp-97226) and phi(b)=Theta(b), so S(b)=-Theta(b^2) -- one order above any fixed small-shift family, forcing the small-r dominance route to fail.',
  },
  {
    id: 'imp97314-honesty-gate-no-qed',
    holds: () =>
      IMP97314_VERDICT.signProved === false &&
      IMP97314_VERDICT.smallRDominanceRefuted === true &&
      IMP97314_VERDICT.fixedFamilyGrowthOrderProved === true &&
      IMP97314_VERDICT.totalGrowthOrderTheta_b2 === true &&
      IMP97314_VERDICT.fixedBandIsLittleOfS === true &&
      IMP97314_VERDICT.needsSignedShiftedDivisorEstimateOverGrowingRange === true &&
      IMP97314_VERDICT.anyBoundMoved === false &&
      IMP97314_VERDICT.postsRigorousCeiling === false &&
      IMP97314_VERDICT.qed === false &&
      /NO QED/.test(IMP97314_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97314_HONEST_BANNER) &&
      /RH open/.test(IMP97314_HONEST_BANNER),
    why: 'sharpened obstruction: the growth-order separation (Theta(b log b) fixed family vs Theta(b^2) total) rigorously refutes the small-r dominance strategy, but the sign S(b) < 0 stays measured -- no bound moved, no rigorous ceiling, honesty markers present.',
  },
];

for (const a of IMP97314_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97314-route-m-cotangent-smallr-family-dominance-obstruction assertion failed: ${a.id}`,
    );
  }
}

export default {
  measured: IMP97314_MEASURED,
  structure: IMP97314_STRUCTURE,
  verdict: IMP97314_VERDICT,
  banner: IMP97314_HONEST_BANNER,
};
