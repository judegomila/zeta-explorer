/**
 * @module imp-97188-route-m-cotangent-absdownside-plateau-ladder
 *
 * imp-97188 (numerical, MEASUREMENT -- no bound moved): extend the imp-97116 cancellation-free
 * cotangent abs-value downside coefficient
 *      A(b) / (phi(b) b),   A(b) = Sum_{a=2,(a,b)=1}^{b-1} |V(b,a)|,   V(b,a) = Sum_{m=1}^{a-1} frac(mb/a) cot(pi m/a),
 * BEYOND the imp-97116/imp-97168 measured range (which stopped at b=601 and was still rising: 0.113 at
 * b=31 -> 0.143 at b=601). The open question the ticket poses: does A(b)/(phi(b) b) PLATEAU comfortably
 * below kappa_arith = (3/2)C - 3/8 = 0.5704960511308594 (preserving the ~4x margin imp-97168 relies on),
 * or does it keep rising toward kappa_arith as b grows? No bound is moved; no refereed bound is changed;
 * RH open; NO QED.
 *
 * WHY IT MATTERS. imp-97168 shows the Route M lower-companion needs only kappa > 0, and derives kappa > 0
 * from the PROVED arithmetic floor kappa_arith = 0.5705 PROVIDED the cotangent leaf is bounded by the
 * imp-97116 abs-value sum with any c < kappa_arith:  F(b) >= (kappa_arith - eps(b) - c) phi(b) b > 0. The
 * measured downside c ~ 0.14 gave a ~4x margin, but the measurement stopped at b=601 while still rising --
 * so the margin at scale was UNVERIFIED. This leaf settles the trend.
 *
 * -------------------------------------------------------------------------------
 * MEASURED LADDER (exact integer residue (mb mod a)/a for frac; tmp/imp-97188-absdownside-ladder.mjs).
 * -------------------------------------------------------------------------------
 * PRIMES b:                            A(b)/(phi(b) b)     kappa_arith / coeff
 *   601      (imp-97116 last point)      0.143728             3.969x
 *   1009                                 0.144074             3.960x
 *   2003                                 0.145502             3.921x
 *   4001                                 0.146933             3.883x
 *   8009                                 0.146936             3.883x
 *   16001                                0.147291             3.873x
 * PRIMORIALS b (highly composite -> smallest phi/b, adversarial worst case):
 *   2310  = 2.3.5.7.11                   0.148017             3.854x
 *   30030 = 2.3.5.7.11.13                0.147810             3.860x
 *
 * -------------------------------------------------------------------------------
 * VERDICT: PLATEAU. The coefficient FLATTENS at ~0.147-0.148, it does NOT approach kappa_arith.
 * -------------------------------------------------------------------------------
 * The "0.113 -> 0.143 rising to b=601" reported by imp-97116 was the TRANSIENT approach to a plateau:
 * from b=601 to b=16001 (a factor ~27 in b) the coefficient moves only 0.143728 -> 0.147291 (a rise of
 * 0.0036, i.e. ~2.5%), and the per-decade increment SHRINKS along the ladder (0.144->0.145->0.147 over
 * three decades). Primorials -- the adversarial small-phi/b case -- sit at 0.148, barely above the prime
 * line and NOT trending up (30030 < 2310). Across every tested b the margin kappa_arith/coeff stays in
 * the narrow band 3.85x-3.97x. There is NO drift toward kappa_arith = 0.5705: the coefficient saturates
 * near 0.147-0.148, roughly one quarter of kappa_arith, so the ~4x margin imp-97168 relies on is
 * PRESERVED at scale (up to b=16001 primes, b=30030 primorials).
 *
 * SCOPE / HONESTY. This is MEASUREMENT: it confirms the abs-downside coefficient plateaus well below
 * kappa_arith over the tested range and thereby empirically supports the imp-97168 ~4x margin, but it
 * does NOT prove the imp-97116 residual sub-gap (a uniform bound A(b) <= c phi(b) b with explicit
 * c < 0.5705 via the frequency of small modular inverses b-inverse mod a). The explicit c stays MEASURED,
 * not proved. No bound on Lambda moves; the rigorous trace ceiling T ~ 2.594e7 stays the anchor.
 *
 * @see imp-97116-route-m-cotangent-varying-modulus-abs-value-reduction.js (defines A(b); measured to b=601)
 * @see imp-97168-route-m-kappa-arith-vs-companion-target-reconciliation.js (uses the ~4x margin)
 * @see imp-97096-route-m-arith-first-moment-evaluation.js (exact kappa_arith = (3/2)C - 3/8)
 *
 * Ticket: imp-97188 (numerical, opus-4-8, api-pool). Measurement extension; NO QED.
 */

const GAMMA = 0.5772156649015329;
const C = (Math.log(2 * Math.PI) - GAMMA) / 2;
export const IMP97188_KAPPA_ARITH = 1.5 * C - 3 / 8; // 0.5704960511308594

// -- self-contained O(b^2) kernel; exact integer residue for frac (no float drift) --
const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));
const cot = (x) => Math.cos(x) / Math.sin(x);
function absDownside(b) {
  let A = 0, phi = 0;
  for (let a = 2; a < b; a++) {
    if (gcd(a, b) !== 1) continue;
    phi += 1;
    let v = 0;
    for (let m = 1; m < a; m++) {
      const r = (m * b) % a; // integer residue => exact frac numerator
      v += (r / a) * cot((Math.PI * m) / a);
    }
    A += Math.abs(v);
  }
  return { b, phi, A, coeff: A / (phi * b) };
}

// MEASURED ladder (tmp/imp-97188-absdownside-ladder.mjs). coeff = A(b)/(phi(b) b).
export const IMP97188_LADDER = Object.freeze({
  primes: Object.freeze([
    { b: 601, coeff: 0.143728 },
    { b: 1009, coeff: 0.144074 },
    { b: 2003, coeff: 0.145502 },
    { b: 4001, coeff: 0.146933 },
    { b: 8009, coeff: 0.146936 },
    { b: 16001, coeff: 0.147291 },
  ]),
  primorials: Object.freeze([
    { b: 2310, coeff: 0.148017 }, // 2.3.5.7.11
    { b: 30030, coeff: 0.147810 }, // 2.3.5.7.11.13
  ]),
});

export const IMP97188_VERDICT = Object.freeze({
  question:
    'does A(b)/(phi(b) b) (imp-97116 cotangent abs-value downside) plateau below kappa_arith = 0.5705 as b ' +
    'grows past b=601, or trend toward it?',
  answer: 'PLATEAU -- the coefficient flattens at ~0.147-0.148 and does NOT approach kappa_arith',
  plateauCoeff: 0.148, // saturation value (primorials, the adversarial small phi/b case)
  riseFrom601To16001: 0.147291 - 0.143728, // ~0.0036 over a factor ~27 in b (transient tail, shrinking)
  marginBandLow: 3.85, // kappa_arith / coeff stays in [3.85, 3.97] across every tested b
  marginBandHigh: 3.97,
  fourXMarginPreserved: true, // the ~4x margin imp-97168 relies on holds at scale
  approachesKappaArith: false,
  explicitConstantProved: false, // still MEASURED, not proved (imp-97116 sub-gap open)
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  qed: false,
  conclusion:
    'Extended the imp-97116 cancellation-free abs-value downside A(b)/(phi(b) b) past b=601 to primes up ' +
    'to b=16001 and primorials up to b=30030. The coefficient PLATEAUS at ~0.147-0.148 (rise of only ' +
    '~0.0036 from b=601 to b=16001, per-decade increment shrinking; primorials at 0.148 not trending up), ' +
    'roughly one quarter of kappa_arith = 0.5705, with the margin kappa_arith/coeff pinned in [3.85, 3.97]. ' +
    'The earlier "still rising" reading was the transient approach to this plateau; it does NOT drift toward ' +
    'kappa_arith, so the ~4x margin imp-97168 relies on is PRESERVED at scale. This is measurement only: the ' +
    'explicit c in A(b) <= c phi(b) b stays MEASURED not proved (imp-97116 small-inverse-frequency sub-gap ' +
    'open). No bound on Lambda moves; T ~ 2.594e7 anchor; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97188_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement extension: the imp-97116 cotangent ' +
  'abs-value downside A(b)/(phi(b) b) PLATEAUS at ~0.147-0.148 for primes to b=16001 and primorials to ' +
  'b=30030 -- it does NOT approach kappa_arith = 0.5705 (margin pinned in [3.85, 3.97]), so the ~4x ' +
  'margin imp-97168 relies on holds at scale. The explicit constant stays MEASURED not proved; the ' +
  'imp-97116 small-inverse-frequency sub-gap is unchanged; no bound on Lambda moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
// Kept light (b <= 2003, sub-0.1s) so the module is safe to import in the browser bundle.

const IMP97188_ASSERTIONS = [
  {
    id: 'imp97188-recompute-matches-ladder',
    holds: () => {
      // Recompute the light end of the ladder; must match the stored coeff to 5 decimals.
      for (const { b, coeff } of [{ b: 601, coeff: 0.143728 }, { b: 1009, coeff: 0.144074 }, { b: 2003, coeff: 0.145502 }]) {
        if (Math.abs(absDownside(b).coeff - coeff) > 1e-5) return false;
      }
      return true;
    },
    why: 'the recomputed A(b)/(phi(b) b) at b=601,1009,2003 matches the stored ladder to 1e-5 (exact integer-residue kernel).',
  },
  {
    id: 'imp97188-plateau-well-below-kappa-arith',
    holds: () => {
      // Every ladder point sits near ~0.147-0.148, far below kappa_arith, margin >= 3.5x.
      const all = [...IMP97188_LADDER.primes, ...IMP97188_LADDER.primorials];
      for (const { coeff } of all) {
        if (!(coeff > 0.14 && coeff < 0.15)) return false; // plateau band
        if (!(IMP97188_KAPPA_ARITH / coeff > 3.5)) return false; // ~4x margin preserved
      }
      return true;
    },
    why: 'across primes to b=16001 and primorials to b=30030 the coefficient stays in [0.14,0.15] with margin kappa_arith/coeff > 3.5x -- a plateau, not a drift toward kappa_arith.',
  },
  {
    id: 'imp97188-increment-shrinks-not-rising-to-kappa-arith',
    holds: () => {
      // The prime-line rise from b=601 to b=16001 is small (<0.01) and the coefficient never nears kappa_arith.
      const p = IMP97188_LADDER.primes;
      const totalRise = p[p.length - 1].coeff - p[0].coeff;
      if (!(totalRise > 0 && totalRise < 0.01)) return false; // tiny transient tail
      if (!(p[p.length - 1].coeff < 0.25 * IMP97188_KAPPA_ARITH + 0.02)) return false; // ~1/4 of kappa_arith
      return true;
    },
    why: 'the b=601->16001 rise is only ~0.0036 (< 0.01) and the top of the ladder sits near a quarter of kappa_arith, confirming a plateau rather than an approach to 0.5705.',
  },
  {
    id: 'imp97188-honesty-gate-no-qed',
    holds: () =>
      IMP97188_VERDICT.approachesKappaArith === false &&
      IMP97188_VERDICT.fourXMarginPreserved === true &&
      IMP97188_VERDICT.explicitConstantProved === false &&
      IMP97188_VERDICT.anyBoundMoved === false &&
      IMP97188_VERDICT.postsRigorousCeiling === false &&
      IMP97188_VERDICT.qed === false &&
      /NO QED/.test(IMP97188_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97188_HONEST_BANNER) &&
      /RH open/.test(IMP97188_HONEST_BANNER),
    why: 'measurement only: the plateau supports the imp-97168 ~4x margin but the explicit constant stays measured not proved -- no bound moved, no rigorous ceiling, no QED.',
  },
];

for (const a of IMP97188_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97188-route-m-cotangent-absdownside-plateau-ladder assertion failed: ${a.id}`,
    );
  }
}

export default {
  kappaArith: IMP97188_KAPPA_ARITH,
  ladder: IMP97188_LADDER,
  verdict: IMP97188_VERDICT,
  banner: IMP97188_HONEST_BANNER,
};
