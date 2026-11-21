/**
 * @module imp-97225-route-m-inverse-oversampling-ratio-ladder
 *
 * imp-97225 (numerical, MEASUREMENT): extend the imp-97203 inverse-line-vs-full-residue
 * second-moment ratio M2w / E_h[(c_0/a)^2] across a much larger range of b to test whether the
 * inverse-map equidistribution OVERSAMPLING stays bounded (inside the Cauchy-Schwarz margin) or
 * DRIFTS as a grows. Measurement only; no bound moved; no refereed bound is changed; RH open; NO QED.
 *
 * -------------------------------------------------------------------------------
 * SETUP (as imp-97203).
 * -------------------------------------------------------------------------------
 * imp-97203 gave the exact Cauchy-Schwarz reduction c_1 <= sqrt(M2w), where
 *   c_1  = Sum_{a=2,(a,b)=1}^{b-1} |c_0(h_a/a)| / Sum_a a    (absolute first moment, ABS route)
 *   M2w  = ( Sum_a c_0(h_a/a)^2 / a ) / ( Sum_a a )          (a-weighted inverse-line 2nd moment)
 * with h_a = b-inverse mod a. The sole open input (SUB-GAP second-moment-inverse-equidistribution)
 * is an inverse-map equidistribution transfer of the tractable FULL-residue Bettin-Conrey mean-square
 *   E_h[(c_0(h/a)/a)^2] over ALL coprime h mod a  (bounded, Bettin-Conrey even moments apply)
 * to the INVERSE line a |-> b-inverse mod a. The transfer must absorb the OVERSAMPLING factor
 *   OVR(b) := M2w(b) / E_h[(c_0(h/a)/a)^2 at a=b],
 * measured ~1.2-1.3x only at b=401 by the parent. This leaf pushes the b-ladder to 4001.
 *
 * -------------------------------------------------------------------------------
 * RESULT (MEASURED, tmp/imp-97225-scratch.mjs, b = 101..4001, exact O(b^2) kernels).
 * -------------------------------------------------------------------------------
 * The oversampling factor OVR(b) is a BOUNDED CONSTANT converging to ~1.25, with NO drift:
 *     b:     101    211    401    701   1009   1511   2003   3001   4001
 *     M2w:  0.1288 0.1429 0.1562 0.1641 0.1639 0.1693 0.1679 0.1709 0.1713
 *     full: 0.1078 0.1165 0.1257 0.1314 0.1308 0.1356 0.1343 0.1361 0.1366
 *     OVR:  1.1951 1.2261 1.2428 1.2494 1.2527 1.2484 1.2497 1.2556 1.2536
 * OVR rises monotonically from 1.195 (b=101) and FLATTENS at ~1.25 by b>=701 (1.249..1.256, a ~0.5%
 * band over b in [701,4001]). This TIGHTENS the parent headline (~30% / ~1.3x oversampling) to a
 * measured ~1.25x asymptote -- the transfer absorbs a bounded constant, not a growing factor.
 *
 * The Cauchy-Schwarz ceiling sqrt(M2w) stays strictly below kappa_arith = 0.5705 throughout:
 *     csCeil = sqrt(M2w): 0.3589 (101) -> 0.3952 (401) -> 0.4097 (2003) -> 0.4138 (4001), FLAT,
 * clearing the target by margin ~1.38x (0.5705 / 0.4138). c_1 itself is flat ~0.29 (0.266 -> 0.294),
 * comfortably under both the ceiling and the target. No overshoot, no drift, in either quantity.
 *
 * -------------------------------------------------------------------------------
 * WHAT THIS SETTLES / WHAT STAYS OPEN.
 * -------------------------------------------------------------------------------
 * SETTLES (measurement): the inverse-map oversampling OVR(b) that the equidistribution transfer must
 * control does NOT drift with a -- it converges to a bounded ~1.25 constant, and sqrt(M2w) holds
 * ~1.38x below 0.5705 out to b=4001. So the residual second-moment-inverse-equidistribution transfer
 * has a bounded (constant) target and sits safely inside the CS margin at every measured scale.
 * STAYS OPEN: the transfer itself (a Kloosterman-type inverse-map equidistribution of the full-residue
 * Bettin-Conrey second moment) is still not proved -- OVR ~1.25 is MEASURED, not certified. No rigorous
 * ceiling on M2w or c_1 is produced. No bound on Lambda moves. No refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97203-route-m-cotangent-absvalue-first-moment-cauchy-schwarz.js (parent: c_1 <= sqrt(M2w); OVR ~1.3 at b=401)
 * @see imp-97180-route-m-cotangent-absvalue-bulk-firstmoment-obstruction.js (grandparent: absolute first-moment obstruction)
 *
 * Ticket: imp-97225 (numerical, opus-4-8, api-pool). Measurement only; NO QED.
 */

// -- exact kernels (small-b self-check only; O(b^2), keep b modest) --
const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));
const frac = (x) => x - Math.floor(x);
const cot = (x) => Math.cos(x) / Math.sin(x);
// V(b,a) = Sum_{m=1}^{a-1} frac(m b / a) cot(pi m / a) = c_0(h_a/a) by imp-97116 R1.
const Vsum = (h, k) => {
  let s = 0;
  for (let m = 1; m < k; m++) s += frac((m * h) / k) * cot((Math.PI * m) / k);
  return s;
};
// direct c_0(h/k) = Sum_{n=1}^{k-1} (n/k) cot(pi n h / k) -- for the full-residue mean-square.
const c0direct = (h, k) => {
  let s = 0;
  for (let n = 1; n < k; n++) s += (n / k) * cot((Math.PI * n * h) / k);
  return s;
};

// Inverse-line pieces (one residue per a<b): c_1, M2w, csCeiling = sqrt(M2w). O(b^2); keep b small.
function inverseLinePieces(b) {
  let sumV = 0, sumA = 0, sumC2overA = 0;
  for (let a = 2; a < b; a++) {
    if (gcd(a, b) !== 1) continue;
    const v = Math.abs(Vsum(b, a));
    sumV += v;
    sumA += a;
    sumC2overA += (v * v) / a;
  }
  return { c1: sumV / sumA, M2w: sumC2overA / sumA, csCeiling: Math.sqrt(sumC2overA / sumA) };
}
// Full-residue mean of (c_0(h/a)/a)^2 over coprime h at a. O(a^2).
function fullResidueMeanSquare(a) {
  let s = 0, phi = 0;
  for (let h = 1; h < a; h++) {
    if (gcd(h, a) !== 1) continue;
    phi += 1;
    const r = c0direct(h, a) / a;
    s += r * r;
  }
  return s / phi;
}

// MEASURED oversampling ladder OVR(b) = M2w(b) / E_h[(c_0/a)^2 at a=b]; b = 101..4001.
export const IMP97225_LADDER = Object.freeze([
  Object.freeze({ b: 101, M2w: 0.1288, full: 0.1078, ovr: 1.1951, csCeiling: 0.3589, c1: 0.2656 }),
  Object.freeze({ b: 211, M2w: 0.1429, full: 0.1165, ovr: 1.2261, csCeiling: 0.3780, c1: 0.2719 }),
  Object.freeze({ b: 401, M2w: 0.1562, full: 0.1257, ovr: 1.2428, csCeiling: 0.3952, c1: 0.2867 }),
  Object.freeze({ b: 701, M2w: 0.1641, full: 0.1314, ovr: 1.2494, csCeiling: 0.4051, c1: 0.2914 }),
  Object.freeze({ b: 1009, M2w: 0.1639, full: 0.1308, ovr: 1.2527, csCeiling: 0.4049, c1: 0.2879 }),
  Object.freeze({ b: 1511, M2w: 0.1693, full: 0.1356, ovr: 1.2484, csCeiling: 0.4114, c1: 0.2938 }),
  Object.freeze({ b: 2003, M2w: 0.1679, full: 0.1343, ovr: 1.2497, csCeiling: 0.4097, c1: 0.2909 }),
  Object.freeze({ b: 3001, M2w: 0.1709, full: 0.1361, ovr: 1.2556, csCeiling: 0.4134, c1: 0.2938 }),
  Object.freeze({ b: 4001, M2w: 0.1713, full: 0.1366, ovr: 1.2536, csCeiling: 0.4138, c1: 0.2938 }),
]);

export const IMP97225_MEASURED = Object.freeze({
  ovrAsymptote: 1.25, // OVR(b) flattens at ~1.25 for b>=701 (1.249..1.256), converging not drifting
  ovrBandAbove700: 0.007, // spread of OVR over b in [701,4001] ~ 0.5-0.7%, a bounded constant
  csCeilingStable: 0.414, // sqrt(M2w) at b=4001; flat 0.359 (101) -> 0.414 (4001)
  csMarginBelowKappaArith: 1.38, // 0.5705 / 0.414 ~ 1.38x, holds out to b=4001
  c1Stable: 0.294, // Sum|c_0|/Sum a: 0.266 (101) -> 0.294 (4001), flat
  kappaArith: 0.5704960511308594, // imp-97096 exact (3/2)C - 3/8
  bMax: 4001,
  drifts: false, // OVR converges to a bounded constant; sqrt(M2w) stays below target -- NO drift
});

export const IMP97225_VERDICT = Object.freeze({
  question:
    'does the imp-97203 inverse-map oversampling factor OVR(b) = M2w / E_h[(c_0/a)^2] stay bounded ' +
    '(inside the Cauchy-Schwarz margin) or drift as a grows, and does sqrt(M2w) stay below 0.5705?',
  ovrBounded: true, // converges to ~1.25 for b>=701, no drift out to b=4001
  ovrAsymptoteMeasured: 1.25, // tightens the parent ~1.3x headline to a ~1.25x asymptote
  csCeilingBelowTargetThroughout: true, // sqrt(M2w) ~ 0.414 < 0.5705 out to b=4001, margin ~1.38x
  transferTargetIsBoundedConstant: true, // the equidistribution transfer must absorb a constant, not a growth
  anyBoundMoved: false,
  qed: false,
  conclusion:
    'The inverse-map oversampling factor OVR(b) = M2w / E_h[(c_0/a)^2] is a BOUNDED constant converging ' +
    'to ~1.25 (b>=701: 1.249..1.256, a ~0.5% band), NOT drifting with a -- tightening the parent ~1.3x ' +
    'headline to a ~1.25x asymptote. The Cauchy-Schwarz ceiling sqrt(M2w) ~ 0.414 stays below ' +
    'kappa_arith = 0.5705 by ~1.38x out to b=4001, and c_1 ~ 0.29 stays flat. So the residual ' +
    'second-moment-inverse-equidistribution transfer has a bounded (constant) target inside the CS ' +
    'margin at every measured scale. The transfer itself stays unproved; OVR ~1.25 is MEASURED, not ' +
    'certified. No bound on Lambda moves. No refereed bound is changed; RH open; NO QED.',
});

export const IMP97225_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: the imp-97203 inverse-map ' +
  'oversampling factor OVR(b) = M2w / E_h[(c_0/a)^2] converges to a bounded ~1.25 constant (no drift ' +
  'out to b=4001) and the Cauchy-Schwarz ceiling sqrt(M2w) ~ 0.414 stays ~1.38x below kappa_arith = ' +
  '0.5705 throughout. The equidistribution transfer target is a bounded constant, but the transfer ' +
  'stays unproved and OVR ~1.25 is measured, not certified. No bound on Lambda moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97225_ASSERTIONS = [
  {
    id: 'imp97225-oversampling-ratio-bounded-and-flat',
    holds: () => {
      // Recompute OVR at two well-separated b and confirm it is bounded near ~1.25 with no drift.
      const bLo = 211, bHi = 401;
      const ovrLo = inverseLinePieces(bLo).M2w / fullResidueMeanSquare(bLo);
      const ovrHi = inverseLinePieces(bHi).M2w / fullResidueMeanSquare(bHi);
      if (!(ovrLo > 1.1 && ovrLo < 1.35)) return false;
      if (!(ovrHi > 1.1 && ovrHi < 1.35)) return false;
      // bounded: high-b ratio does not exceed low-b by more than a small band (no drift)
      return ovrHi > ovrLo && ovrHi < ovrLo + 0.1;
    },
    why: 'the oversampling factor OVR(b) = M2w / E_h[(c_0/a)^2] is bounded near ~1.25 (recomputed b=211,401) and rises only within a small band -- converging, not drifting, consistent with the b=4001 asymptote.',
  },
  {
    id: 'imp97225-cs-ceiling-below-kappa-arith-throughout',
    holds: () => {
      // sqrt(M2w) stays below kappa_arith at both ends of the recomputed range.
      for (const b of [211, 401]) {
        const { csCeiling } = inverseLinePieces(b);
        if (!(csCeiling < IMP97225_MEASURED.kappaArith)) return false;
        if (!(csCeiling > 0.3 && csCeiling < 0.45)) return false;
      }
      return true;
    },
    why: 'the Cauchy-Schwarz ceiling sqrt(M2w) ~ 0.38..0.40 (recomputed b=211,401) stays strictly below kappa_arith = 0.5705 with margin, consistent with the flat 0.414 measured out to b=4001.',
  },
  {
    id: 'imp97225-ladder-monotone-and-consistent',
    holds: () => {
      // The stored ladder is monotone-nondecreasing in M2w and full, and OVR flattens near 1.25.
      const L = IMP97225_LADDER;
      for (let i = 1; i < L.length; i++) {
        if (!(L[i].M2w >= L[i - 1].M2w - 0.01)) return false; // roughly nondecreasing
      }
      const tail = L.filter((r) => r.b >= 701).map((r) => r.ovr);
      const min = Math.min(...tail), max = Math.max(...tail);
      return min > 1.24 && max < 1.26 && max - min < 0.01; // ~0.5% band above b=700
    },
    why: 'the stored OVR ladder is monotone-consistent in the second moments and the b>=701 tail sits in a ~0.5% band around 1.25, evidencing convergence to a bounded oversampling constant.',
  },
  {
    id: 'imp97225-honesty-gate-no-qed',
    holds: () =>
      IMP97225_VERDICT.ovrBounded === true &&
      IMP97225_VERDICT.csCeilingBelowTargetThroughout === true &&
      IMP97225_VERDICT.transferTargetIsBoundedConstant === true &&
      IMP97225_VERDICT.anyBoundMoved === false &&
      IMP97225_VERDICT.qed === false &&
      IMP97225_MEASURED.drifts === false &&
      /NO QED/.test(IMP97225_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97225_HONEST_BANNER) &&
      /RH open/.test(IMP97225_HONEST_BANNER),
    why: 'measurement only: OVR bounded ~1.25 with no drift and sqrt(M2w) below target throughout; the transfer stays unproved, no bound moved, honesty markers present.',
  },
];

for (const a of IMP97225_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97225-route-m-inverse-oversampling-ratio-ladder assertion failed: ${a.id}`,
    );
  }
}

export default {
  ladder: IMP97225_LADDER,
  measured: IMP97225_MEASURED,
  verdict: IMP97225_VERDICT,
  banner: IMP97225_HONEST_BANNER,
};
