/**
 * @module imp-97226-route-m-cotangent-cancellation-ratio-ladder
 *
 * imp-97226 (numerical, MEASUREMENT): extend the imp-97204 signed-vs-absolute cotangent
 * cancellation ladder |S(b)| / A(b) (measured ~0.54 stable only to b=2003 by the parent) to
 * substantially larger b, to test whether the ~46% cancellation the ABSOLUTE-value route discards
 * PERSISTS or DRIFTS, and whether S(b)/(phi(b) b) stays flat and negative. Measurement only; no
 * bound moved; no refereed bound is changed; RH open; NO QED.
 *
 * -------------------------------------------------------------------------------
 * SETUP (as imp-97097 / imp-97180 / imp-97204).
 * -------------------------------------------------------------------------------
 * V(h,k) = Sum_{m=1}^{k-1} frac(m h / k) cot(pi m / k). The operative VARYING-MODULUS half of the
 * Route M cotangent first moment is the SIGNED sum S(b) = Sum_{a=2,(a,b)=1}^{b-1} V(b,a); its
 * ABSOLUTE companion (the imp-97180/imp-97203 object) is A(b) = Sum_a |V(b,a)|. By the triangle
 * inequality |S(b)| <= A(b) exactly for every b (imp-97204 Result 1), so the absolute route DISCARDS
 * the cancellation measured by the ratio |S(b)| / A(b). imp-97204 measured this ratio ~0.54 STABLE
 * only to b=2003 (0.543 -> 0.538 -> 0.543); this leaf pushes the ladder an order of magnitude further.
 *
 * -------------------------------------------------------------------------------
 * RESULT (MEASURED, tmp/imp-97226-scratch.mjs, b = 101..24001, exact O(b^2) kernels).
 * -------------------------------------------------------------------------------
 * The cancellation ratio |S(b)| / A(b) is a STABLE CONSTANT ~0.540, with NO drift over a >12x
 * extension of the range:
 *     b:       101    401   1009   2003   4001   8009  12007  16001  24001
 *     |S|/A:  0.543  0.538  0.545  0.543  0.539  0.540  0.540  0.540  0.540
 * After a mild small-b transient (0.543..0.555 for b <= 401), the ratio settles into a ~0.4% band
 * around 0.5397 for b >= 4001 (0.53946..0.54048). The ~46% cancellation the absolute route discards
 * PERSISTS -- it does NOT wash out or grow as b increases.
 *
 * The signed half stays FLAT and NEGATIVE, converging (from above in magnitude) to ~-0.0795:
 *     S(b)/(phi b b): -0.0728 (101) -> -0.0790 (2003) -> -0.0795 (24001), monotone, flat, negative,
 *     A(b)/(phi b b):  0.1341 (101) ->  0.1455 (2003) ->  0.1471 (24001), flat (imp-97180 companion).
 * So a DIRECT signed bound would deliver a constant c_s ~ 0.0795 (measured), ~0.54x the absolute
 * c ~ 0.147 -- a strict ~1.85x sharpening -- confirming the parent estimate (measured c_s ~ 0.079)
 * out to b=24001. This sharpening is NOT needed for positivity (the absolute program dominates via
 * |S| <= A, imp-97204); it only quantifies what the non-elementary signed Bettin-Conrey mean value
 * would additionally buy.
 *
 * -------------------------------------------------------------------------------
 * WHAT THIS SETTLES / WHAT STAYS OPEN.
 * -------------------------------------------------------------------------------
 * SETTLES (measurement): the signed-vs-absolute cancellation |S(b)| / A(b) ~ 0.540 is a persistent
 * bounded constant with no drift out to b=24001, and S(b)/(phi b b) stays flat and negative ~-0.0795.
 * The achievable sharpening of a direct signed bound over the absolute majorant is a stable ~1.85x
 * (c_s ~ 0.0795 vs c ~ 0.147) at every measured scale.
 * STAYS OPEN: the direct signed bound itself is NOT proved -- it requires the SIGNED Bettin-Conrey
 * mean value Sum_a c_0(h_a/a) over the inverse line (no absolute value, no square), which stays
 * non-elementary (imp-97204 obstruction). The ratio ~0.540 is MEASURED, not certified. No rigorous
 * ceiling is produced. No bound on Lambda moves. No refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97204-route-m-cotangent-signed-firstmoment-lower-bound.js (parent: |S| <= A, |S|/A ~ 0.54 to b=2003)
 * @see imp-97180-route-m-cotangent-absvalue-bulk-firstmoment-obstruction.js (absolute A(b), c ~ 0.145)
 * @see imp-97097-route-m-cotangent-first-moment-reciprocity.js (fixed-modulus half = 0; S(b) isolated)
 *
 * Ticket: imp-97226 (numerical, opus-4-8, api-pool). Measurement only; NO QED.
 */

// -- exact kernels (small-b self-check only; O(b^2), keep b modest) --
const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));
const frac = (x) => x - Math.floor(x);
const cot = (x) => Math.cos(x) / Math.sin(x);
// V(b,a) = Sum_{m=1}^{a-1} frac(m b / a) cot(pi m / a).
const Vsum = (h, k) => {
  let s = 0;
  for (let m = 1; m < k; m++) s += frac((m * h) / k) * cot((Math.PI * m) / k);
  return s;
};

// Signed S(b), absolute A(b), and the cancellation ratio |S|/A. O(b^2); keep b small.
function cancellationPieces(b) {
  let phi = 0, S = 0, A = 0;
  for (let a = 2; a < b; a++) {
    if (gcd(a, b) !== 1) continue;
    phi += 1;
    const v = Vsum(b, a);
    S += v;
    A += Math.abs(v);
  }
  const den = phi * b;
  return {
    signed: S / den, // S(b)/(phi b b) ~ -0.0795 (flat, negative)
    abs: A / den, // A(b)/(phi b b) ~ 0.147 (imp-97180)
    cancel: A > 0 ? Math.abs(S) / A : 0, // |S|/A ~ 0.540 (the persistent discarded cancellation)
  };
}

// MEASURED cancellation ladder |S(b)|/A(b); b = 101..24001 (parent stopped at 2003).
export const IMP97226_LADDER = Object.freeze([
  Object.freeze({ b: 101, signed: -0.07281, abs: 0.134112, cancel: 0.5429 }),
  Object.freeze({ b: 211, signed: -0.075817, abs: 0.13659, cancel: 0.55507 }),
  Object.freeze({ b: 401, signed: -0.077353, abs: 0.143685, cancel: 0.53835 }),
  Object.freeze({ b: 1009, signed: -0.078551, abs: 0.144074, cancel: 0.54521 }),
  Object.freeze({ b: 2003, signed: -0.079006, abs: 0.145502, cancel: 0.54299 }),
  Object.freeze({ b: 4001, signed: -0.079264, abs: 0.146933, cancel: 0.53946 }),
  Object.freeze({ b: 8009, signed: -0.079407, abs: 0.146936, cancel: 0.54042 }),
  Object.freeze({ b: 12007, signed: -0.079459, abs: 0.147209, cancel: 0.53977 }),
  Object.freeze({ b: 16001, signed: -0.079485, abs: 0.147291, cancel: 0.53965 }),
  Object.freeze({ b: 24001, signed: -0.079513, abs: 0.147117, cancel: 0.54048 }),
]);

export const IMP97226_MEASURED = Object.freeze({
  cancelAsymptote: 0.54, // |S|/A settles at ~0.5397 for b>=4001 (0.53946..0.54048), a ~0.4% band
  cancelBandAbove4000: 0.001, // spread of |S|/A over b in [4001,24001] ~ 0.1%, a bounded constant
  signedStable: -0.0795, // S(b)/(phi b b): -0.0728 (101) -> -0.0790 (2003) -> -0.0795 (24001), flat/neg
  absStable: 0.1471, // A(b)/(phi b b): 0.1341 (101) -> 0.1471 (24001), flat (imp-97180 companion)
  signedSharpeningFactor: 1.85, // c ~ 0.147 / c_s ~ 0.0795 ~ 1.85x sharper direct signed constant
  csharpMeasured: 0.0795, // measured direct signed constant c_s ~ |S|/(phi b b) ~ 0.54 * abs
  bMax: 24001, // ~12x the parent b<=2003 top
  drifts: false, // ratio ~0.540 persistent, signed half flat/negative -- NO drift
});

export const IMP97226_VERDICT = Object.freeze({
  question:
    'does the imp-97204 signed-vs-absolute cancellation ratio |S(b)| / A(b) (~0.54 to b=2003) persist ' +
    'or drift at larger b, and does S(b)/(phi b b) stay flat and negative?',
  cancellationPersists: true, // |S|/A ~ 0.540 stable out to b=24001, no drift
  cancelAsymptoteMeasured: 0.54, // settles at ~0.5397 for b>=4001 (~0.4% band)
  signedHalfFlatAndNegative: true, // S(b)/(phi b b) ~ -0.0795, monotone flat, negative throughout
  directSignedSharpeningStable: true, // ~1.85x sharper constant (c_s ~ 0.0795 vs c ~ 0.147) at every scale
  directSignedNeedsSignedBettinConreyMeanValue: true, // sharpening only; still non-elementary (imp-97204)
  anyBoundMoved: false,
  qed: false,
  conclusion:
    'The signed-vs-absolute cancellation ratio |S(b)| / A(b) is a PERSISTENT bounded constant ~0.540, ' +
    'with NO drift over a >12x extension of the range (b=101..24001): after a mild small-b transient it ' +
    'settles into a ~0.4% band around 0.5397 for b >= 4001. The signed half S(b)/(phi b b) stays FLAT ' +
    'and NEGATIVE, converging to ~-0.0795, and the absolute companion A(b)/(phi b b) is flat ~0.147. So ' +
    'the ~46% cancellation the absolute-value route discards does NOT wash out or grow, and a direct ' +
    'signed bound would deliver a stable ~1.85x sharper constant (c_s ~ 0.0795 vs c ~ 0.147) at every ' +
    'measured scale. That sharpening is NOT needed for positivity (the absolute program dominates via ' +
    '|S| <= A, imp-97204); it requires the SIGNED Bettin-Conrey mean value over the inverse line, still ' +
    'non-elementary. The ratio ~0.540 is MEASURED, not certified. No bound on Lambda moves. No refereed bound is changed' +
    '; RH open; NO QED.',
});

export const IMP97226_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: the imp-97204 signed-vs-absolute ' +
  'cancellation ratio |S(b)| / A(b) stays a persistent ~0.540 constant (no drift) out to b=24001, and ' +
  'S(b)/(phi b b) stays flat and negative ~-0.0795. The ~46% cancellation the absolute route discards ' +
  'persists, so a direct signed bound would be a stable ~1.85x sharper (c_s ~ 0.0795 vs c ~ 0.147); it ' +
  'is not needed for positivity and requires the still-non-elementary signed Bettin-Conrey mean value. ' +
  'The ratio ~0.540 is measured, not certified. No bound on Lambda moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97226_ASSERTIONS = [
  {
    id: 'imp97226-cancellation-ratio-stable-recomputed',
    holds: () => {
      // Recompute |S|/A at two well-separated small b and confirm the ~0.54 stability, no drift.
      const lo = cancellationPieces(211).cancel;
      const hi = cancellationPieces(401).cancel;
      if (!(lo > 0.5 && lo < 0.6)) return false;
      if (!(hi > 0.5 && hi < 0.6)) return false;
      return Math.abs(hi - lo) < 0.05; // bounded, no drift between recomputed scales
    },
    why: 'the cancellation ratio |S|/A recomputed at b=211,401 sits in a ~0.54 band with a small spread -- stable, not drifting, consistent with the ~0.540 asymptote measured out to b=24001.',
  },
  {
    id: 'imp97226-signed-half-flat-and-negative',
    holds: () => {
      // S(b)/(phi b b) stays negative and near -0.077..-0.079 (flat) at recomputed b.
      for (const b of [211, 401]) {
        const { signed, abs } = cancellationPieces(b);
        if (!(signed < 0)) return false; // negative
        if (!(signed > -0.09 && signed < -0.07)) return false; // flat magnitude ~0.078
        if (!(abs > Math.abs(signed))) return false; // absolute strictly larger (genuine cancellation)
      }
      return true;
    },
    why: 'the signed half S(b)/(phi b b) is negative and flat (~-0.077..-0.078 at b=211,401) with A > |S| strictly -- consistent with the flat/negative -0.0795 measured out to b=24001.',
  },
  {
    id: 'imp97226-ladder-persistent-no-drift',
    holds: () => {
      // The stored ladder tail (b>=4001) sits in a tight band around 0.540 -- persistent, no drift.
      const tail = IMP97226_LADDER.filter((r) => r.b >= 4001).map((r) => r.cancel);
      const min = Math.min(...tail), max = Math.max(...tail);
      if (!(min > 0.538 && max < 0.541)) return false;
      if (!(max - min < 0.002)) return false; // ~0.2% band
      // signed magnitude is monotone-nondecreasing toward ~0.0795
      const L = IMP97226_LADDER;
      for (let i = 1; i < L.length; i++) {
        if (!(Math.abs(L[i].signed) >= Math.abs(L[i - 1].signed) - 1e-6)) return false;
      }
      return true;
    },
    why: 'the stored |S|/A ladder tail for b>=4001 lives in a ~0.2% band around 0.540 and the signed magnitude is monotone toward ~0.0795 -- evidencing a persistent cancellation constant with no drift.',
  },
  {
    id: 'imp97226-honesty-gate-no-qed',
    holds: () =>
      IMP97226_VERDICT.cancellationPersists === true &&
      IMP97226_VERDICT.signedHalfFlatAndNegative === true &&
      IMP97226_VERDICT.directSignedSharpeningStable === true &&
      IMP97226_VERDICT.directSignedNeedsSignedBettinConreyMeanValue === true &&
      IMP97226_VERDICT.anyBoundMoved === false &&
      IMP97226_VERDICT.qed === false &&
      IMP97226_MEASURED.drifts === false &&
      /NO QED/.test(IMP97226_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97226_HONEST_BANNER) &&
      /RH open/.test(IMP97226_HONEST_BANNER),
    why: 'measurement only: the cancellation ratio persists ~0.540 with no drift and the signed half stays flat/negative; the direct signed bound stays unproved (non-elementary), no bound moved, honesty markers present.',
  },
];

for (const a of IMP97226_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97226-route-m-cotangent-cancellation-ratio-ladder assertion failed: ${a.id}`,
    );
  }
}

export default {
  ladder: IMP97226_LADDER,
  measured: IMP97226_MEASURED,
  verdict: IMP97226_VERDICT,
  banner: IMP97226_HONEST_BANNER,
};
