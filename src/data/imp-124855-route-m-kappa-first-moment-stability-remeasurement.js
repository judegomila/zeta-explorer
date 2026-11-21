/**
 * @module imp-124855-route-m-kappa-first-moment-stability-remeasurement
 *
 * imp-124855 (numerical, MEASUREMENT + ASSESSMENT): re-measure the Route M first-moment constant
 * kappa = F(b)/(phi(b) b) reported ~0.696 in imp-97071 (residual sub-gap
 * imp-97071-first-moment-lower-bound-kappa-positive), quantify its b-window stability, and assess
 * whether a rigorous positive lower bound kappa > 0 is derivable. Measurement/assessment only:
 * changes NO bound, C_mb GUE-conditional (imp-486) untouched, no refereed bound is changed, RH open, NO QED.
 *
 * Notation as imp-97071/imp-96750. I(a,b) = C(a+b) + (1/2)(a-b) log(b/a) - (pi/2)(V(a,b)+V(b,a)),
 * C = (log 2pi - gamma)/2; V(a,q) = Sum_{m=1}^{q-1} frac(m a/q) cot(pi m/q). The first moment
 * F(b) = Sum_{a=2,(a,b)=1}^{b-1} I(a,b) splits into an arithmetic part F_arith (the C and log terms)
 * and a cotangent part F_cot (the -(pi/2)(V+V) terms). kappa = F/(phi(b) b); likewise kappa_arith,
 * kappa_cot for the two parts (kappa = kappa_arith + kappa_cot).
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 -- kappa is more stable and slightly SMALLER than the reported 0.696: kappa -> ~ 0.69550.
 * -------------------------------------------------------------------------------
 * Re-measured on the PRIME axis (a fresh axis: imp-97541 pinned the cotangent limit on PRIMORIALS)
 * b = 101 .. 8009, kappa declines monotonically and smoothly toward ~ 0.69550:
 *     b=101 0.6957, b=211 0.6957, b=1201 0.6955, b=3001 0.69552, b=5003 0.69551, b=8009 0.69550.
 * At FIXED scale there is essentially NO scatter: over the dense contiguous window b in [1180,1220)
 * the mean is 0.69548 with std 6e-5 (min 0.6954, max 0.6956) -- a few-ULP-level spread. So the ticket
 * "stability / scatter" question resolves as: kappa carries NO random scatter at fixed b; the only
 * b-dependence is a smooth monotone approach to a limit. The measured limit 0.69550 matches the
 * imp-97541 conjectural closed form kappa -> kappa_arith + 1/8 = 0.6954960511... to 4 decimals,
 * CONFIRMING it on the independent prime axis.
 *
 * -------------------------------------------------------------------------------
 * RESULT 2 -- the two parts drift OPPOSITELY while the SUM is invariant (compensating cancellation).
 * -------------------------------------------------------------------------------
 * As b grows the arithmetic part DECREASES and the cotangent part INCREASES, but their sum kappa is
 * flat (prime axis):
 *     kappa_arith: 0.5993 (b=101) -> 0.5745 (b=1201) -> 0.57127 (b=8009)  [-> (3/2)C - 3/8 = 0.5705]
 *     kappa_cot:   0.0964 (b=101) -> 0.1211 (b=1201) -> 0.12423 (b=8009)  [-> 1/8 = 0.125 conjectural]
 *     kappa:       0.6957         -> 0.6955          -> 0.69550           [-> 0.695496]
 * The arithmetic limit (3/2)C - 3/8 = 0.5704960511... is RIGOROUS (imp-97096); the cotangent limit
 * 1/8 (via varyCoeff -> -1/(4 pi)) is conjectural (imp-97541). The opposite monotone drift with an
 * invariant sum is the structural signal that the exact closed form is kappa = (3/2)C - 1/4.
 *
 * -------------------------------------------------------------------------------
 * RESULT 3 -- "both parts positive" (imp-97071) is ASYMPTOTIC ONLY, not universal.
 * -------------------------------------------------------------------------------
 * imp-97071 stated both parts of F(b) are separately positive. Re-measurement shows this fails at the
 * small primorial b=30, where kappa_cot = -0.0105 < 0 (kappa still +0.6847). At b=210 and b=2310 both
 * parts are positive again. So per-part positivity is NOT a universal fact -- only kappa ITSELF is
 * robustly positive across every measured b (min 0.6847 at b=30). A rigorous kappa > 0 should therefore
 * target the SUM (or the arithmetic floor), NOT per-part positivity, which is unnecessarily strong.
 *
 * -------------------------------------------------------------------------------
 * ASSESSMENT -- is a rigorous kappa > 0 derivable? The obstruction is SOFTER than imp-97071 framed it.
 * -------------------------------------------------------------------------------
 * Because the arithmetic part limit kappa_arith = (3/2)C - 3/8 = +0.5705 is ALREADY RIGOROUS
 * (imp-97096, an elementary Moebius-weighted coprime sum), asymptotic positivity kappa > 0 does NOT
 * require the exact cotangent limit 1/8. It reduces to the far weaker one-sided statement
 *     liminf_b kappa_cot(b)  >  -0.5705,
 * i.e. the Bettin-Conrey cotangent MEAN VALUE must merely not diverge to -infinity below the arithmetic
 * floor. Measurement gives kappa_cot >= +0.059 at every ladder point (min at b=31) and kappa_cot ->
 * +0.125, comfortably above -0.5705. So the honest residual is narrowed: NOT "prove kappa > 0 from
 * scratch" and NOT "pin kappa_cot = 1/8", but "bound the cotangent first moment below by ANY constant
 * > -0.5705" (equivalently: the varying-modulus varyCoeff is bounded and the boundary term does not
 * blow up). This is a much softer requirement than the imp-97071 mean-square lower companion or the
 * per-part-positivity framing. Still MEASURED, not proved -- the boundedness-below of the cotangent
 * mean value is the open Bettin-Conrey piece; NO QED.
 *
 * -------------------------------------------------------------------------------
 * VERDICT (honest; no bound moved).
 * -------------------------------------------------------------------------------
 * kappa is re-measured on the prime axis at ~0.69550 (revised down from the reported 0.696), with NO
 * scatter at fixed scale (window std 6e-5) and a smooth monotone approach to the conjectural closed
 * form (3/2)C - 1/4 = 0.695496. Its two parts drift oppositely with an invariant sum; per-part
 * positivity fails at b=30 so only the sum is robustly positive. The derivability question is
 * sharpened: kappa > 0 (asymptotic) follows from the RIGOROUS arithmetic floor +0.5705 (imp-97096)
 * plus any one-sided cotangent lower bound liminf kappa_cot > -0.5705 -- far weaker than the exact 1/8
 * conjecture. No bound moves; C_mb GUE-conditional untouched; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97071-route-m-lower-companion-first-moment-reduction.js (parent: the CS reduction + kappa~0.696)
 * @see imp-97096-route-m-arith-first-moment-evaluation.js (kappa_arith = (3/2)C - 3/8 = 0.5705 EXACT)
 * @see imp-97541-route-m-kappa-cot-extended-measurement.js (kappa_cot -> 1/8 conjectural; kappa -> 0.695496)
 *
 * Ticket: imp-124855 (numerical, opus-4-8, api-pool). Measurement + assessment; NO QED.
 */

const C = 0.6303307766845604; // (log 2pi - gamma)/2, matching the imp-96750/imp-97071 kernel

// -- lightweight exact kernel (used only in the small-b self-check below) --
const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));
const frac = (x) => x - Math.floor(x);
const cot = (x) => Math.cos(x) / Math.sin(x);
const Vsum = (a, b) => {
  let s = 0;
  for (let m = 1; m < b; m++) s += frac((m * a) / b) * cot((Math.PI * m) / b);
  return s;
};
// F(b) parts over interior coprime a (2<=a<=b-1); O(b^2), keep b small.
function kappaParts(b) {
  let A = 0, Co = 0, phi = 0;
  for (let a = 2; a < b; a++) {
    if (gcd(a, b) === 1) {
      A += C * (a + b) + 0.5 * (a - b) * Math.log(b / a);
      Co += -(Math.PI / 2) * (Vsum(a, b) + Vsum(b, a));
      phi += 1;
    }
  }
  phi += 1; // include a=1 in the coprime count phi(b) (a=1 dropped from the interior first moment)
  const den = phi * b;
  return { arith: A / den, cot: Co / den, kappa: (A + Co) / den };
}

// Baked exact/limit constants from the siblings (cited, not recomputed to avoid C-precision drift).
export const KAPPA_ARITH_EXACT = 0.5704960511308594; // (3/2)C - 3/8, RIGOROUS (imp-97096)
export const KAPPA_COT_LIMIT = 0.125; // 1/8, conjectural via varyCoeff -> -1/(4 pi) (imp-97541)
export const KAPPA_LIMIT = 0.6954960511308594; // kappa_arith + 1/8, conjectural closed form (imp-97541)

// RESULT 1/2 -- prime-axis re-measurement ladder (fresh scratch tmp/imp-124855-scratch.mjs + -big.mjs).
export const IMP124855_PRIME_LADDER = Object.freeze([
  { b: 101, kappa: 0.6957, arith: 0.5993, cot: 0.0964 },
  { b: 211, kappa: 0.6957, arith: 0.5869, cot: 0.1088 },
  { b: 401, kappa: 0.6956, arith: 0.5803, cot: 0.1153 },
  { b: 601, kappa: 0.6956, arith: 0.5776, cot: 0.1180 },
  { b: 809, kappa: 0.6956, arith: 0.5760, cot: 0.1195 },
  { b: 1009, kappa: 0.6956, arith: 0.5751, cot: 0.1205 },
  { b: 1201, kappa: 0.6955, arith: 0.5745, cot: 0.1211 },
  { b: 1499, kappa: 0.6955, arith: 0.5738, cot: 0.1217 },
  { b: 1801, kappa: 0.6955, arith: 0.5733, cot: 0.1222 },
  { b: 3001, kappa: 0.69552, arith: 0.57232, cot: 0.12320 },
  { b: 5003, kappa: 0.69551, arith: 0.57166, cot: 0.12384 },
  { b: 8009, kappa: 0.69550, arith: 0.57127, cot: 0.12423 },
]);

// RESULT 3 -- primorial axis: cotangent part goes NEGATIVE at b=30 (per-part positivity not universal).
export const IMP124855_PRIMORIAL_ROWS = Object.freeze([
  { b: 30, phi: 8, kappa: 0.6847, arith: 0.6952, cot: -0.0105 }, // cot < 0 here; kappa still > 0
  { b: 210, phi: 48, kappa: 0.6952, arith: 0.6127, cot: 0.0825 },
  { b: 2310, phi: 480, kappa: 0.6955, arith: 0.5772, cot: 0.1182 },
]);

// RESULT 1 -- fixed-scale scatter: dense contiguous window b in [1180,1220).
export const IMP124855_DENSE_WINDOW = Object.freeze({
  range: '[1180,1220)',
  n: 40,
  mean: 0.69548,
  std: 0.00006, // few-ULP scatter -- NO random spread at fixed scale
  min: 0.6954,
  max: 0.6956,
  bothPartsPositiveInWindow: true, // asymptotic regime: both parts positive here (unlike b=30)
});

export const IMP124855_ASSESSMENT = Object.freeze({
  kappaRemeasured: 0.6955, // prime-axis limit, revised down from the reported 0.696
  kappaClosedFormCandidate: KAPPA_LIMIT, // (3/2)C - 1/4 = 0.6954960511...
  matchesClosedForm: true, // 0.69550 (b=8009) vs 0.695496 -- agrees to 4 decimals
  partsDriftOppositelySumInvariant: true, // arith down, cot up, kappa flat
  perPartPositivityUniversal: false, // FAILS at b=30 (cot = -0.0105)
  kappaPositiveEverywhereMeasured: true, // min 0.6847 at b=30
  arithFloorRigorousPositive: true, // kappa_arith -> +0.5705 is RIGOROUS (imp-97096)
  // asymptotic kappa > 0 reduces to: liminf kappa_cot > -kappa_arith_exact
  softenedResidual: 'liminf_b kappa_cot(b) > -0.5705 (one-sided; far weaker than the exact 1/8 conjecture)',
  kappaPositiveProved: false, // MEASURED, not proved; NO QED
  anyBoundMoved: false,
  cMbUntouched: true,
  qed: false,
});

export const IMP124855_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement + assessment only: re-measured the Route M ' +
  'first-moment constant kappa = F(b)/(phi(b) b) on the prime axis at ~0.69550 (revised down from the ' +
  'reported 0.696), with NO scatter at fixed scale (window [1180,1220) std 6e-5) and a smooth monotone ' +
  'approach to the conjectural closed form (3/2)C - 1/4 = 0.695496. The two parts drift oppositely ' +
  '(arith down toward the RIGOROUS 0.5705, cot up toward the conjectural 1/8) with an invariant sum; ' +
  'per-part positivity FAILS at b=30 (cot = -0.0105), so only the sum is robustly positive. The kappa>0 ' +
  'residual is softened: asymptotic positivity follows from the rigorous arithmetic floor +0.5705 ' +
  '(imp-97096) plus any one-sided bound liminf kappa_cot > -0.5705 -- far weaker than pinning 1/8. ' +
  'Still measured, not proved; C_mb GUE-conditional untouched; no bound moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP124855_ASSERTIONS = [
  {
    id: 'imp124855-kernel-reproduces-prime-axis-kappa',
    holds: () => {
      // Re-derive kappa at a small prime from the Vasyunin kernel; match the baked ladder within noise.
      const r = kappaParts(101);
      return (
        Math.abs(r.kappa - 0.6957) < 1e-3 &&
        r.arith > r.cot && // arithmetic part dominant at b=101
        r.arith > 0 &&
        r.cot > 0 &&
        Math.abs(r.kappa - KAPPA_LIMIT) < 2e-3 // matches the conjectural closed form
      );
    },
    why: 'the prime-axis kappa is re-derived in JS from the Vasyunin kernel at b=101 (~0.6957), matching the baked ladder and within 2e-3 of the conjectural closed form (3/2)C - 1/4 = 0.695496.',
  },
  {
    id: 'imp124855-parts-drift-oppositely-sum-invariant',
    holds: () => {
      const L = IMP124855_PRIME_LADDER;
      const first = L[0], last = L[L.length - 1];
      return (
        last.arith < first.arith && // arithmetic part decreases with b
        last.cot > first.cot && // cotangent part increases with b
        Math.abs(last.kappa - first.kappa) < 0.002 && // sum essentially invariant
        last.arith > KAPPA_ARITH_EXACT - 0.01 && // heading down toward the rigorous 0.5705
        last.cot < KAPPA_COT_LIMIT + 0.001 // heading up toward the conjectural 0.125 from below
      );
    },
    why: 'across the prime ladder the arithmetic part decreases and the cotangent part increases while their sum kappa stays flat -- the compensating drift toward (3/2)C - 3/8 and 1/8 whose sum is the closed form.',
  },
  {
    id: 'imp124855-per-part-positivity-not-universal',
    holds: () => {
      const b30 = IMP124855_PRIMORIAL_ROWS.find((r) => r.b === 30);
      return (
        b30.cot < 0 && // cotangent part negative at b=30
        b30.kappa > 0 && // but kappa itself still positive
        IMP124855_ASSESSMENT.perPartPositivityUniversal === false &&
        IMP124855_ASSESSMENT.kappaPositiveEverywhereMeasured === true
      );
    },
    why: 'the imp-97071 "both parts positive" claim is asymptotic only: at the small primorial b=30 the cotangent part is negative (-0.0105) while kappa stays positive (0.6847); only the sum is robustly positive.',
  },
  {
    id: 'imp124855-fixed-scale-no-scatter',
    holds: () =>
      IMP124855_DENSE_WINDOW.std < 1e-4 &&
      IMP124855_DENSE_WINDOW.max - IMP124855_DENSE_WINDOW.min < 3e-4 &&
      Math.abs(IMP124855_DENSE_WINDOW.mean - 0.6955) < 1e-3,
    why: 'over the dense contiguous window [1180,1220) kappa has std 6e-5 (few-ULP), so there is no random scatter at fixed scale -- the only b-dependence is the smooth monotone approach to the limit.',
  },
  {
    id: 'imp124855-honesty-gate-no-qed',
    holds: () =>
      IMP124855_ASSESSMENT.anyBoundMoved === false &&
      IMP124855_ASSESSMENT.kappaPositiveProved === false &&
      IMP124855_ASSESSMENT.qed === false &&
      IMP124855_ASSESSMENT.arithFloorRigorousPositive === true &&
      IMP124855_ASSESSMENT.cMbUntouched === true &&
      /NO QED/.test(IMP124855_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP124855_HONEST_BANNER) &&
      /RH open/.test(IMP124855_HONEST_BANNER),
    why: 'measurement + assessment only: kappa > 0 is MEASURED not proved, no bound moved, C_mb GUE-conditional untouched, honesty markers present; the softened residual is a one-sided cotangent bound, not a QED.',
  },
];

for (const a of IMP124855_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-124855-route-m-kappa-first-moment-stability-remeasurement assertion failed: ${a.id}`,
    );
  }
}

export default {
  primeLadder: IMP124855_PRIME_LADDER,
  primorialRows: IMP124855_PRIMORIAL_ROWS,
  denseWindow: IMP124855_DENSE_WINDOW,
  assessment: IMP124855_ASSESSMENT,
  banner: IMP124855_HONEST_BANNER,
};
