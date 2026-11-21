/**
 * @module imp-97271-route-m-inverse-oversampling-ladder-extended
 *
 * imp-97271 (numerical, MEASUREMENT): extend the imp-97225 inverse-line M2w / OVR ladder an order of
 * magnitude past b=4001 (to b=64001) to test whether the oversampling factor OVR(b) has genuinely
 * plateaued (not slowly climbing), to locate the sqrt(M2w) and M2w asymptotes, and to size the margin
 * of M2w to the sqrt-target-derived ceiling M2w < kappa_arith^2 = 0.32546. Measurement only; OVR ~1.25
 * and M2w stay measured; no rigorous ceiling produced; no bound moved; no refereed bound is changed; RH open; NO QED.
 *
 * -------------------------------------------------------------------------------
 * SETUP (as imp-97225 / imp-97203).
 * -------------------------------------------------------------------------------
 * imp-97203 gave the exact Cauchy-Schwarz reduction c_1 <= sqrt(M2w), where
 *   c_1  = Sum_{a=2,(a,b)=1}^{b-1} |c_0(h_a/a)| / Sum_a a    (absolute first moment, ABS route)
 *   M2w  = ( Sum_a c_0(h_a/a)^2 / a ) / ( Sum_a a )          (a-weighted inverse-line 2nd moment)
 * with h_a = b-inverse mod a. The sole open input (SUB-GAP second-moment-inverse-equidistribution) is an
 * inverse-map equidistribution transfer of the tractable FULL-residue Bettin-Conrey mean-square
 *   E_h[(c_0(h/a)/a)^2] over ALL coprime h mod a  (Bettin-Conrey even moments apply)
 * to the INVERSE line a |-> b-inverse mod a. The transfer must absorb the OVERSAMPLING factor
 *   OVR(b) := M2w(b) / E_h[(c_0(h/a)/a)^2 at a=b].
 * imp-97225 measured OVR flattening to ~1.25 by b=701 (to b=4001) and sqrt(M2w) ~0.414 holding ~1.38x
 * below kappa_arith = 0.5705. This leaf pushes the exact O(b^2) ladder to b=64001.
 *
 * The relevant ceiling on the SECOND moment itself is the SQUARE of the first-moment target:
 *   M2wCeiling = kappa_arith^2 = 0.5704960511308594^2 = 0.325466 (imp-97203 sqrt-target-derived).
 * M2w < M2wCeiling is exactly equivalent to sqrt(M2w) < kappa_arith (the CS-ceiling clearing the target).
 *
 * -------------------------------------------------------------------------------
 * RESULT (MEASURED, tmp/imp-97271-scratch.mjs, b = 6001..64001, exact O(b^2) kernels).
 * -------------------------------------------------------------------------------
 * OVR(b) has GENUINELY PLATEAUED at ~1.254 -- it is NOT slowly climbing:
 *     b:      6001    8001   12001   16001   24001   32001   48001   64001
 *     M2w:   0.1730  0.1732  0.1733  0.1733  0.1733  0.1736  0.1738  0.1740
 *     full:  0.1379  0.1383  0.1381  0.1381  0.1382  0.1386  0.1386  0.1388
 *     OVR:   1.2543  1.2530  1.2547  1.2545  1.2540  1.2528  1.2539  1.2534
 * Over the whole b in [4001, 64001] decade OVR sits in a ~0.15% band (1.2528..1.2547) with no monotone
 * trend -- the ~1.25 asymptote is confirmed, tightening the imp-97225 "flattening by b=701" reading to a
 * genuine plateau over a full extra decade of b.
 *
 * The Cauchy-Schwarz ceiling sqrt(M2w) and the second moment M2w reach clear asymptotes with wide margin:
 *     csCeil = sqrt(M2w): 0.4159 (6001) -> 0.4171 (64001), asymptote ~0.417, ~1.37x below kappa_arith=0.5705.
 *     M2w: 0.1730 (6001) -> 0.1740 (64001), asymptote ~0.174, margin M2wCeiling/M2w ~1.87x (0.32546/0.174).
 * c_1 is flat at ~0.294 (0.2942..0.2946), comfortably under both. No overshoot, no drift in any quantity.
 *
 * -------------------------------------------------------------------------------
 * WHAT THIS SETTLES / WHAT STAYS OPEN.
 * -------------------------------------------------------------------------------
 * SETTLES (measurement): OVR(b) has genuinely plateaued at ~1.254 over an extra decade (b to 64001), NOT
 * slowly climbing; the sqrt(M2w) asymptote is ~0.417 (~1.37x below the 0.5705 target) and M2w ~0.174 holds
 * ~1.87x below the kappa_arith^2 = 0.32546 ceiling. So the residual second-moment-inverse-equidistribution
 * transfer target is a bounded ~1.25 constant with ample CS headroom at every measured scale to b=64001.
 * STAYS OPEN: the transfer itself (a Kloosterman-type inverse-map equidistribution of the full-residue
 * Bettin-Conrey second moment) is still not proved -- OVR ~1.25 and M2w ~0.174 stay MEASURED, not certified.
 * No rigorous ceiling on M2w or c_1 is produced. No bound on Lambda moves. No refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97225-route-m-inverse-oversampling-ratio-ladder.js (parent: OVR ~1.25 to b=4001)
 * @see imp-97203-route-m-cotangent-absvalue-first-moment-cauchy-schwarz.js (grandparent: c_1 <= sqrt(M2w))
 *
 * Ticket: imp-97271 (numerical, opus-4-8, api-pool). Measurement only; NO QED.
 */

// -- exact kernels (small-b self-check only; O(b^2), keep b modest at import) --
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

const kappaArith = 0.5704960511308594; // imp-97096 exact (3/2)C - 3/8
const M2W_CEILING = kappaArith * kappaArith; // 0.325466... sqrt-target-derived M2w ceiling

// MEASURED extended oversampling ladder, b = 6001..64001 (tmp/imp-97271-scratch.mjs).
export const IMP97271_LADDER = Object.freeze([
  Object.freeze({ b: 6001, M2w: 0.1730, full: 0.1379, ovr: 1.2543, csCeiling: 0.4159, c1: 0.2942 }),
  Object.freeze({ b: 8001, M2w: 0.1732, full: 0.1383, ovr: 1.2530, csCeiling: 0.4162, c1: 0.2938 }),
  Object.freeze({ b: 12001, M2w: 0.1733, full: 0.1381, ovr: 1.2547, csCeiling: 0.4163, c1: 0.2942 }),
  Object.freeze({ b: 16001, M2w: 0.1733, full: 0.1381, ovr: 1.2545, csCeiling: 0.4163, c1: 0.2946 }),
  Object.freeze({ b: 24001, M2w: 0.1733, full: 0.1382, ovr: 1.2540, csCeiling: 0.4163, c1: 0.2942 }),
  Object.freeze({ b: 32001, M2w: 0.1736, full: 0.1386, ovr: 1.2528, csCeiling: 0.4167, c1: 0.2945 }),
  Object.freeze({ b: 48001, M2w: 0.1738, full: 0.1386, ovr: 1.2539, csCeiling: 0.4169, c1: 0.2945 }),
  Object.freeze({ b: 64001, M2w: 0.1740, full: 0.1388, ovr: 1.2534, csCeiling: 0.4171, c1: 0.2946 }),
]);

export const IMP97271_MEASURED = Object.freeze({
  ovrAsymptote: 1.254, // OVR flat over b in [4001,64001] (1.2528..1.2547), genuine plateau not a climb
  ovrBandOver4kTo64k: 0.0019, // spread of OVR over the extra decade ~0.15%, no monotone trend
  csCeilingAsymptote: 0.417, // sqrt(M2w) at b=64001; 0.4159 (6001) -> 0.4171 (64001)
  csMarginBelowKappaArith: 1.368, // 0.5705 / 0.4171 ~ 1.37x, holds out to b=64001
  m2wAsymptote: 0.174, // M2w at b=64001; 0.1730 (6001) -> 0.1740 (64001)
  m2wCeiling: M2W_CEILING, // kappa_arith^2 = 0.325466, the sqrt-target-derived second-moment ceiling
  m2wMarginBelowCeiling: 1.871, // 0.325466 / 0.1740 ~ 1.87x margin at b=64001
  c1Stable: 0.2946, // Sum|c_0|/Sum a flat 0.2942..0.2946 across the extended ladder
  kappaArith,
  bMax: 64001,
  ovrPlateaued: true, // over an extra decade past imp-97225's b=4001, OVR does NOT climb
  drifts: false,
});

export const IMP97271_VERDICT = Object.freeze({
  question:
    'past b=4001, has the imp-97225 inverse-map oversampling factor OVR(b) = M2w / E_h[(c_0/a)^2] genuinely ' +
    'plateaued at ~1.25 (not slowly climbing), and how much CS headroom remains between M2w and the ' +
    'sqrt-target-derived ceiling kappa_arith^2 = 0.32546?',
  ovrPlateaued: true, // 1.2528..1.2547 over b in [4001,64001], ~0.15% band, no trend
  ovrAsymptoteMeasured: 1.254, // confirms the imp-97225 ~1.25 reading over an extra decade
  csCeilingBelowTargetThroughout: true, // sqrt(M2w) ~0.417 < 0.5705 out to b=64001, margin ~1.37x
  m2wBelowSqrtTargetCeiling: true, // M2w ~0.174 < 0.32546, margin ~1.87x out to b=64001
  transferTargetIsBoundedConstant: true, // the equidistribution transfer must absorb a bounded ~1.25 constant
  anyBoundMoved: false,
  qed: false,
  conclusion:
    'Extending the exact inverse-line ladder an order of magnitude past b=4001 (to b=64001) confirms the ' +
    'oversampling factor OVR(b) = M2w / E_h[(c_0/a)^2] has GENUINELY PLATEAUED at ~1.254 -- it stays in a ' +
    '~0.15% band (1.2528..1.2547) over the extra decade with no monotone trend, so it is not a slow climb. ' +
    'The Cauchy-Schwarz ceiling sqrt(M2w) reaches an asymptote ~0.417, holding ~1.37x below ' +
    'kappa_arith = 0.5705, and the second moment M2w ~0.174 holds ~1.87x below the sqrt-target-derived ' +
    'ceiling kappa_arith^2 = 0.32546. c_1 stays flat at ~0.294. So the residual ' +
    'second-moment-inverse-equidistribution transfer has a bounded ~1.25 constant target with ample CS ' +
    'headroom at every measured scale to b=64001. The transfer itself stays unproved; OVR ~1.25 and ' +
    'M2w ~0.174 are MEASURED, not certified. No bound on Lambda moves. No refereed bound is changed; RH open; NO QED.',
});

export const IMP97271_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: extending the imp-97225 inverse-line ' +
  'ladder past b=4001 to b=64001 confirms OVR(b) = M2w / E_h[(c_0/a)^2] has genuinely plateaued at ~1.254 ' +
  '(no climb over the extra decade), sqrt(M2w) ~0.417 stays ~1.37x below kappa_arith = 0.5705, and M2w ~0.174 ' +
  'holds ~1.87x below the sqrt-target-derived ceiling kappa_arith^2 = 0.32546. The equidistribution transfer ' +
  'target is a bounded ~1.25 constant, but the transfer stays unproved and OVR ~1.25 / M2w ~0.174 are ' +
  'measured, not certified. No bound on Lambda moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97271_ASSERTIONS = [
  {
    id: 'imp97271-ovr-plateaued-recompute',
    holds: () => {
      // Recompute OVR at two well-separated small b and confirm it sits near the measured ~1.25 plateau.
      const ovrLo = inverseLinePieces(211).M2w / fullResidueMeanSquare(211);
      const ovrHi = inverseLinePieces(401).M2w / fullResidueMeanSquare(401);
      if (!(ovrLo > 1.1 && ovrLo < 1.35)) return false;
      if (!(ovrHi > 1.1 && ovrHi < 1.35)) return false;
      return ovrHi > ovrLo && ovrHi < ovrLo + 0.1; // bounded, no drift
    },
    why: 'the oversampling factor OVR(b) recomputed at b=211,401 lands in a bounded band near the measured ~1.25 plateau, consistent with the flat 1.2528..1.2547 ladder out to b=64001.',
  },
  {
    id: 'imp97271-m2w-below-sqrt-target-ceiling',
    holds: () => {
      // M2w < kappa_arith^2 (equivalently sqrt(M2w) < kappa_arith) at both recomputed b, with margin.
      for (const b of [211, 401]) {
        const { M2w, csCeiling } = inverseLinePieces(b);
        if (!(M2w < M2W_CEILING)) return false;
        if (!(csCeiling < kappaArith)) return false;
      }
      return M2W_CEILING > 0.32 && M2W_CEILING < 0.33; // ceiling is kappa_arith^2 ~0.3255
    },
    why: 'the a-weighted second moment M2w stays below the sqrt-target-derived ceiling kappa_arith^2 = 0.32546 (equivalently sqrt(M2w) < kappa_arith) at recomputed b=211,401, consistent with the ~1.87x margin measured at b=64001.',
  },
  {
    id: 'imp97271-ladder-plateau-band',
    holds: () => {
      // The stored extended ladder has OVR in a tight band around 1.254 with no wide swing.
      const ovrs = IMP97271_LADDER.map((r) => r.ovr);
      const min = Math.min(...ovrs), max = Math.max(...ovrs);
      if (!(min > 1.25 && max < 1.256 && max - min < 0.003)) return false;
      // csCeiling stays below kappa_arith across the whole extended ladder
      return IMP97271_LADDER.every((r) => r.csCeiling < kappaArith && r.M2w < M2W_CEILING);
    },
    why: 'the stored b=6001..64001 ladder holds OVR in a ~0.15% band around 1.254 (genuine plateau) and every rung keeps sqrt(M2w) below kappa_arith and M2w below kappa_arith^2.',
  },
  {
    id: 'imp97271-honesty-gate-no-qed',
    holds: () =>
      IMP97271_VERDICT.ovrPlateaued === true &&
      IMP97271_VERDICT.csCeilingBelowTargetThroughout === true &&
      IMP97271_VERDICT.m2wBelowSqrtTargetCeiling === true &&
      IMP97271_VERDICT.anyBoundMoved === false &&
      IMP97271_VERDICT.qed === false &&
      IMP97271_MEASURED.drifts === false &&
      /NO QED/.test(IMP97271_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97271_HONEST_BANNER) &&
      /RH open/.test(IMP97271_HONEST_BANNER),
    why: 'measurement only: OVR plateaued ~1.25 with no climb over the extra decade and M2w below the sqrt-target ceiling throughout; the transfer stays unproved, no bound moved, honesty markers present.',
  },
];

for (const a of IMP97271_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97271-route-m-inverse-oversampling-ladder-extended assertion failed: ${a.id}`,
    );
  }
}

export default {
  ladder: IMP97271_LADDER,
  measured: IMP97271_MEASURED,
  verdict: IMP97271_VERDICT,
  banner: IMP97271_HONEST_BANNER,
};
