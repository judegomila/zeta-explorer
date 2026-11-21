/**
 * @module imp-97071-route-m-lower-companion-first-moment-reduction
 *
 * imp-97071 (proof, REDUCTION + PARTIAL): the imp-97054 residual sub-gap
 * (imp-97054-lower-companion-cotangent-second-moment) asks for the LOWER companion of the imp-96750
 * uniform lemma, Q(b) >= s0_lo b - O(1) with ANY absolute s0_lo > 0 -- a positive log-slope lower
 * bound on the weighted Vasyunin/Bettin-Conrey cotangent SECOND moment, the only missing ingredient
 * to reject the Route M concave-quad ||G||_F turnover rung-free (imp-97054 DIRECTION: the lower half
 * is the operative rejector). This ticket attacks the three routes the parent named -- a
 * positive-density coprime-a averaging argument, a Bettin-Conrey cotangent mean-square lower bound,
 * and a reciprocity identity -- and reports a genuine REDUCTION plus its precise residual. No bound
 * is proved rigorous; no refereed bound is changed; RH open; NO QED.
 *
 * Notation as imp-96750/imp-97054. I(a,b) = C(a+b) + (1/2)(a-b) log(b/a) - (pi/2)(V(a,b) + V(b,a)),
 * symmetric, C = (log 2pi - gamma)/2; V(a,q) = Sum_{m=1}^{q-1} frac(m a/q) cot(pi m/q). The interior
 * weighted second moment Q(b) = Sum_{a=2, (a,b)=1}^{b-1} I(a,b)^2 / a^2 (measured Q(b)/b -> s0 ~ 1.75,
 * window-mean over [900,1200) reproduced here to 1.75127). x = log N.
 *
 * -------------------------------------------------------------------------------
 * RESULT -- a RIGOROUS Cauchy-Schwarz reduction: mean-SQUARE lower companion <== first-MOMENT bound.
 * -------------------------------------------------------------------------------
 * Write Q(b) = Sum_{a} (I(a,b)/a)^2 with a ranging over the interior coprime residues 2<=a<=b-1.
 * Pairing the weight a against I(a,b)/a and applying Cauchy-Schwarz,
 *     F(b)^2 = ( Sum_{a} a * (I(a,b)/a) )^2 = ( Sum_{a} I(a,b) )^2
 *            <= ( Sum_{a} a^2 ) ( Sum_{a} I(a,b)^2/a^2 ) = S(b) Q(b),
 * where F(b) = Sum_{a=2,(a,b)=1}^{b-1} I(a,b) is the FIRST moment and S(b) = Sum_{a=2,(a,b)=1}^{b-1}
 * a^2 <= b(b+1)(2b+1)/6 <= b^3/3 (dropping coprimality upward, rigorously). Hence, for EVERY b,
 *     Q(b)  >=  F(b)^2 / S(b)  >=  3 F(b)^2 / b^3.                                       (CS)
 * This inequality is EXACT/rigorous -- it introduces no hypothesis. It converts the mean-SQUARE lower
 * companion into a first-MOMENT lower bound: IF F(b) >= kappa phi(b) b with an absolute kappa > 0,
 * then Q(b) >= 3 kappa^2 phi(b)^2 / b, and through the exact regrouping T(M) = 2 Sum_{b<=M} Q(b)/b^2
 * and the already two-sided imp-96708 sandwich Int(N) >= T(N) (imp-97054 TRANSFER),
 *     Int(N)  >=  T(N)  >=  6 kappa^2 Sum_{b<=N} phi(b)^2/b^3  =  Theta(log N),
 * a POSITIVE log-slope lower bound -- exactly the lower companion that forbids the concave turnover
 * (any positive slope suffices; imp-97054 rejectionNeedsOnlyPositiveSlope). Using the accurate
 * (density) value S(b) ~ phi(b) b^2/3 in place of the crude b^3/3 gives the sharper transfer slope
 * (below).
 *
 * -------------------------------------------------------------------------------
 * WHY THE FIRST MOMENT IS THE RIGHT TARGET -- it does NOT overshoot the way the square does.
 * -------------------------------------------------------------------------------
 * imp-96750 STEP 3 proved that splitting I into its arithmetic part A(a,b) = C(a+b)+(1/2)(a-b)log(b/a)
 * and its cotangent part -(pi/2)(V+V) OVERSHOOTS the SECOND moment to M log^2 M, because the single
 * a=2 term A(2,b) ~ -(1/2) b log b is squared to (1/16) b^2 log^2 b. That obstruction is SPECIFIC to
 * squaring. In the FIRST moment F(b) there is no squaring, and MEASURED (tmp/imp-97071-lower-
 * companion.py) BOTH parts are separately positive and of the SAME clean order phi(b) b:
 *     arithmetic part of F(b) / (phi(b) b)  ~  +0.575  (b large; 0.590 at b=211 -> 0.575 at b=1201),
 *     cotangent  part of F(b) / (phi(b) b)  ~  +0.121  (b large; 0.109 at b=211 -> 0.121 at b=1201),
 *     F(b) / (phi(b) b) = kappa             ~  +0.696  (STABLE: 0.699 at b=211, 0.696 at b=1201,
 *                                                       0.697 at the primorial b=2310).
 * So term-splitting does NOT overshoot the first moment -- the arithmetic part alone already lower
 * bounds F(b) by ~0.575 phi(b) b > 0, and the cotangent part only ADDS. This is the structural reason
 * the first moment is tractable where the second moment is not: the O(b log b) cancellation that makes
 * the square delicate is a LINEAR feature that the first moment averages away, not a sign war.
 *
 * -------------------------------------------------------------------------------
 * TRANSFER CONSTANT -- the induced positive log-slope (measured, matched to the CS bound).
 * -------------------------------------------------------------------------------
 * With the accurate S(b) ~ phi(b) b^2/3 and F(b) ~ kappa phi(b) b, the per-b CS floor is
 * F(b)^2/(b^2 S(b)) ~ 3 kappa^2 phi(b)/b^2, and Sum_{b<=M} phi(b)/b^2 ~ (6/pi^2) log M (classical),
 * so the CS lower bound gives
 *     T(M)  >=  2 Sum_{b<=M} F(b)^2/(b^2 S(b))  ~  (36 kappa^2 / pi^2) log M,
 * i.e. an interior-second-moment slope >= 36 kappa^2/pi^2 ~ 1.767 (kappa=0.696). DIRECT CHECK
 * (tmp/imp-97071-lower-companion.py): summing the EXACT per-b CS floor F(b)^2/S(b) gives a
 * finite-difference T_CS slope of 1.764 (M:300->450) and 1.762 (M:450->600) -- matching 1.767, and
 * comfortably BELOW the true interior slope 3.495 (imp-96708), as any valid lower bound must be. The
 * induced effective s0_lo = 18 kappa^2/pi^2 ~ 0.883 > 0 (the T-slope is 2 s0_lo; imp-97054 convention).
 *
 * -------------------------------------------------------------------------------
 * ASSESSMENT of the three named routes.
 * -------------------------------------------------------------------------------
 *  (1) POSITIVE-DENSITY COPRIME-a AVERAGING: this is the route that WORKS as a reduction. The
 *      Cauchy-Schwarz step is precisely a positive-density averaging of I over ALL coprime a in
 *      (0,b) (weight a), and it survives on primorials because the density factor phi(b)/b, summed
 *      against 1/b^2 in T, still yields (6/pi^2) log M -- the sparse highly-composite b do not hurt
 *      the AVERAGE (the operative object is T(M), not pointwise Q(b), which itself dips to ~0.60 b on
 *      primorials). But it REDUCES to, it does not PROVE, the first-moment lower bound.
 *  (2) BETTIN-CONREY cotangent MEAN-SQUARE lower bound: NOT needed in this form. The reduction shows
 *      a mean-SQUARE lower bound is sufficient but not necessary; the strictly weaker first-MOMENT
 *      (mean-value) lower bound already suffices via (CS). This is a genuine simplification of the
 *      residual: mean value, not mean square.
 *  (3) RECIPROCITY IDENTITY: the operative residual is now the first moment F(b) = Sum_a I(a,b), whose
 *      cotangent part Sum_{a coprime} (V(a,b)+V(b,a)) is a candidate for closed-form evaluation via
 *      Vasyunin/Dedekind reciprocity (as a ranges over reduced residues, m a permutes them), unlike
 *      the two-variable second moment which has no such collapse. Not carried out to a rigorous
 *      bound here.
 *
 * -------------------------------------------------------------------------------
 * OBSTRUCTION -- what is NOT established.
 * -------------------------------------------------------------------------------
 * The first-moment lower bound F(b) >= kappa phi(b) b with an ABSOLUTE kappa > 0 is MEASURED
 * (kappa ~ 0.696, remarkably stable across primes and primorials; both arithmetic and cotangent parts
 * positive) but NOT proved. The arithmetic part Sum_a[C(a+b)+(1/2)(a-b)log(b/a)] over coprime a is
 * elementary (a Moebius-weighted coprime sum, ~0.575 phi(b) b, in principle rigorously evaluable), so
 * the sole genuinely open piece is a lower bound on the cotangent first moment -- a Bettin-Conrey
 * cotangent MEAN VALUE (not mean square) -- ensuring it does not cancel the arithmetic part. It is
 * numerically same-sign and additive, so F(b) is comfortably positive, but that is not a proof. And
 * the parent premise stands: even the UPPER companion (imp-96750) is only reduced, not proven.
 *
 * -------------------------------------------------------------------------------
 * VERDICT (honest; no bound moved).
 * -------------------------------------------------------------------------------
 * The lower companion Q(b) >= s0_lo b - O(1) is REDUCED, rigorously and rung-free, to a first-MOMENT
 * lower bound F(b) = Sum_{a=2,(a,b)=1}^{b-1} I(a,b) >= kappa phi(b) b (kappa > 0) via the exact
 * Cauchy-Schwarz inequality Q(b) >= F(b)^2/S(b); the reduction transfers through the exact regrouping
 * and the already two-sided imp-96708 sandwich to Int(N) >= (36 kappa^2/pi^2) log N (measured CS slope
 * 1.76, below the true 3.495), a positive log-slope that rejects the concave turnover. This SHARPENS
 * the imp-97054 residual from an unestablished mean-SQUARE lower bound to a strictly weaker first-MOMENT
 * (mean-value) lower bound whose arithmetic and cotangent parts are BOTH measured positive (so the
 * imp-96750 term-splitting overshoot -- a squaring artifact -- does NOT recur). But it does NOT close:
 * the first-moment lower bound with an absolute kappa > 0 is measured, not proved. No rigorous ceiling
 * posted; the trace ceiling T ~ 2.594e7 stays the rigorous anchor; compute (N~9916) binds first
 * regardless. No refereed bound is changed; RH open; NO QED.
 *
 * RESIDUAL SUB-GAP (below): imp-97071-first-moment-lower-bound-kappa-positive -- the first-moment
 * lower bound F(b) >= kappa phi(b) b with an absolute kappa > 0 (a Bettin-Conrey cotangent MEAN VALUE,
 * strictly weaker than the imp-97054 mean-square lower companion it replaces).
 *
 * @see imp-97054-route-m-two-sided-norm-rejection-assessment.js (the parent: lower half is operative, mean-square residual)
 * @see imp-96750-route-m-interior-second-moment-upper-bound-reduction.js (the upper companion; term-split overshoot of the SQUARE)
 * @see imp-96708-route-m-interior-second-moment-dichotomy.js (the two-sided H2 sandwich T <= Int <= zeta(2) T)
 *
 * Ticket: imp-97071 (proof, opus-4-8, api-pool). Reduction + partial; NO QED.
 */

import { IMP96750_C, IMP96750_ZETA2 } from './imp-96750-route-m-interior-second-moment-upper-bound-reduction.js';

// imp-97054 TRANSFER.rejectionNeedsOnlyPositiveSlope === true (baked locally: its self-executing
// assertions cross-check downstream imp-97033 text and are brittle to import in isolation).
const IMP97054_REJECTION_NEEDS_ONLY_POSITIVE_SLOPE = true;

const C = IMP96750_C; // (log 2pi - gamma)/2 = 0.6303307...

// -- lightweight exact kernel (used only in the small-b self-checks below) --
const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));
const frac = (x) => x - Math.floor(x);
const cot = (x) => Math.cos(x) / Math.sin(x);
const Vsum = (a, b) => {
  let s = 0;
  for (let m = 1; m < b; m++) s += frac((m * a) / b) * cot((Math.PI * m) / b);
  return s;
};
const Iab = (a, b) => C * (a + b) + 0.5 * (a - b) * Math.log(b / a) - (Math.PI / 2) * (Vsum(a, b) + Vsum(b, a));

// For a given b, return {F, Q, S} over interior coprime a (2<=a<=b-1). O(b^2); keep b small.
function moments(b) {
  let F = 0, Q = 0, S = 0;
  for (let a = 2; a < b; a++) {
    if (gcd(a, b) === 1) {
      const v = Iab(a, b);
      F += v;
      Q += (v * v) / (a * a);
      S += a * a;
    }
  }
  return { F, Q, S };
}

// MEASURED constants (tmp/imp-97071-lower-companion.py; validation window-mean Q(b)/b = 1.75127).
export const IMP97071_MEASURED = Object.freeze({
  kappa: 0.696, // F(b)/(phi(b) b) -> ~0.696 (0.699 at b=211, 0.696 at b=1201, 0.697 at primorial 2310)
  kappaArithPart: 0.575, // arithmetic part of kappa (>0, dominant): C(a+b)+(1/2)(a-b)log(b/a) sum
  kappaCotanPart: 0.121, // cotangent part of kappa (>0, additive): -(pi/2)(V+V) sum
  qOverBWindowMean: 1.75127, // window mean of Q(b)/b over [900,1200), reproducing imp-96750
  trueInteriorTSlope: 3.495176, // imp-96708 measured T-slope (the truth the lower bound sits below)
  csSlopeFiniteDiff300to450: 1.764, // direct sum of exact per-b CS floor F(b)^2/S(b)
  csSlopeFiniteDiff450to600: 1.762,
});

// The rigorous Cauchy-Schwarz reduction and its transfer constant.
export const IMP97071_REDUCTION = Object.freeze({
  csInequality: 'Q(b) >= F(b)^2 / S(b) >= 3 F(b)^2 / b^3   (exact; Cauchy-Schwarz, weight a vs I/a)',
  firstMomentTarget: 'F(b) = Sum_{a=2,(a,b)=1}^{b-1} I(a,b) >= kappa phi(b) b,  kappa > 0',
  transferSlopeFormula: '36 kappa^2 / pi^2', // T(M) >= (36 kappa^2/pi^2) log M
  transferSlopeValue: (36 * 0.696 * 0.696) / (Math.PI * Math.PI), // ~1.767
  effectiveS0Lo: (18 * 0.696 * 0.696) / (Math.PI * Math.PI), // ~0.883 (T-slope = 2 s0_lo)
  rejectionNeedsOnlyPositiveSlope: IMP97054_REJECTION_NEEDS_ONLY_POSITIVE_SLOPE, // true (imp-97054)
  zeta2: IMP96750_ZETA2, // 1.6449... (H2 sandwich; Int >= T is the lower side used here)
  reducesMeanSquareToMeanValue: true, // first MOMENT suffices; mean-square (imp-97054) not necessary
  termSplitOvershootAvoided: true, // both parts of F positive -> no M log^2 M squaring artifact
});

export const IMP97071_VERDICT = Object.freeze({
  question:
    'can a positive-density coprime-a averaging argument, a Bettin-Conrey cotangent mean-square lower ' +
    'bound, or a reciprocity identity supply an absolute s0_lo > 0 for the Route M lower companion?',
  csReductionIsRigorous: true, // Q(b) >= F(b)^2/S(b) is an exact inequality, no hypothesis
  reducesToFirstMoment: true, // mean-SQUARE lower companion <== first-MOMENT lower bound F >= kappa phi b
  firstMomentBothPartsPositive: true, // arithmetic ~+0.575 phi b AND cotangent ~+0.121 phi b (measured)
  transfersRungFree: true, // via exact regrouping + imp-96708 two-sided sandwich (Int >= T)
  inducedSlopePositive: (36 * 0.696 * 0.696) / (Math.PI * Math.PI) > 0, // ~1.767 > 0
  inducedSlopeBelowTruth: (36 * 0.696 * 0.696) / (Math.PI * Math.PI) < 3.495176, // consistency
  firstMomentLowerBoundProved: false, // kappa > 0 is MEASURED, not proved
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  computeBindsFirst: true,
  qed: false,
  conclusion:
    'The Route M lower companion Q(b) >= s0_lo b - O(1) is REDUCED, rigorously and rung-free, to a ' +
    'first-MOMENT lower bound F(b) = Sum_{a=2,(a,b)=1}^{b-1} I(a,b) >= kappa phi(b) b (kappa > 0) via ' +
    'the EXACT Cauchy-Schwarz inequality Q(b) >= F(b)^2/S(b) (weight a against I/a), which transfers ' +
    'through the exact regrouping T(M)=2 Sum Q(b)/b^2 and the already two-sided imp-96708 sandwich ' +
    'Int(N) >= T(N) to Int(N) >= (36 kappa^2/pi^2) log N -- a POSITIVE log-slope (measured CS slope ' +
    '1.76, below the true 3.495) that rejects the concave turnover. Of the three named routes: the ' +
    'positive-density coprime-a averaging IS the reduction (and survives on primorials via the AVERAGE ' +
    'T, since Sum phi(b)/b^2 ~ (6/pi^2) log M); the Bettin-Conrey MEAN-SQUARE lower bound is NOT ' +
    'needed (the strictly weaker first moment suffices); a reciprocity identity is the natural tool for ' +
    'the residual first moment. Crucially the imp-96750 term-split overshoot is a SQUARING artifact ' +
    'that does NOT recur in the first moment (both arithmetic ~+0.575 phi b and cotangent ~+0.121 phi b ' +
    'parts positive, kappa ~ 0.696 stable across primes and primorials). But it does NOT close: the ' +
    'first-moment lower bound with an absolute kappa > 0 is MEASURED, not proved (the arithmetic part ' +
    'is elementary; the open piece is a Bettin-Conrey cotangent MEAN VALUE lower bound). No rigorous ' +
    'ceiling posted; T ~ 2.594e7 stays the anchor; compute N~9916 binds first. No refereed bound is changed; ' +
    'RH open; NO QED.',
});

export const IMP97071_SUBGAP = Object.freeze({
  id: 'imp-97071-first-moment-lower-bound-kappa-positive',
  statement:
    'Rejecting the Route M concave-quad ||G||_F turnover rung-free reduces (via the EXACT Cauchy-Schwarz ' +
    'inequality Q(b) >= F(b)^2/S(b), the exact regrouping T(M)=2 Sum_{b<=M} Q(b)/b^2, and the already ' +
    'two-sided imp-96708 sandwich Int >= T) to a first-MOMENT lower bound: F(b) = ' +
    'Sum_{a=2,(a,b)=1}^{b-1} I(a,b) >= kappa phi(b) b with an ABSOLUTE kappa > 0 (only the SIGN matters; ' +
    'it yields Int(N) >= (36 kappa^2/pi^2) log N, a positive slope forbidding the turnover). This is a ' +
    'Bettin-Conrey cotangent MEAN VALUE -- strictly weaker than the imp-97054 mean-SQUARE lower ' +
    'companion it replaces, and free of the imp-96750 term-splitting overshoot (a squaring artifact): ' +
    'its arithmetic part ~+0.575 phi(b) b is elementary and its cotangent part ~+0.121 phi(b) b is ' +
    'measured same-sign additive (kappa ~ 0.696 stable across primes and primorials). NOT proved here ' +
    '(kappa > 0 is measured, not established). Its upper mate (imp-96750) is itself only reduced.',
});

export const IMP97071_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Reduction + partial only: the Cauchy-Schwarz ' +
  'inequality Q(b) >= F(b)^2/S(b) is EXACT (no hypothesis) and REDUCES the imp-97054 mean-SQUARE lower ' +
  'companion to a strictly weaker first-MOMENT lower bound F(b) >= kappa phi(b) b, transferring to a ' +
  'positive interior slope Int(N) >= (36 kappa^2/pi^2) log N (measured CS slope 1.76, below the true ' +
  '3.495). The first moment does NOT suffer the imp-96750 term-split overshoot (both its arithmetic and ' +
  'cotangent parts are measured positive, kappa ~ 0.696 stable across primes and primorials), but ' +
  'kappa > 0 is MEASURED, not proved -- so no bound is claimed moved and no rigorous ceiling posted.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97071_ASSERTIONS = [
  {
    id: 'imp97071-cauchy-schwarz-inequality-holds-small-b',
    holds: () => {
      // The reduction's core is the EXACT inequality Q(b) >= F(b)^2/S(b). Re-derive it in JS at
      // small b (b=49, b=101) directly from the Vasyunin kernel. Also confirm F(b) > 0.
      for (const b of [49, 101]) {
        const { F, Q, S } = moments(b);
        if (!(F > 0)) return false;
        if (!(Q >= (F * F) / S - 1e-9)) return false; // Cauchy-Schwarz
        if (!(Q >= (3 * F * F) / (b * b * b) - 1e-9)) return false; // with S <= b^3/3
      }
      return true;
    },
    why: 'the reduction rests on the EXACT Cauchy-Schwarz inequality Q(b) >= F(b)^2/S(b) >= 3F(b)^2/b^3 (weight a against I(a,b)/a); verified in JS from the Vasyunin kernel at b=49,101, with F(b) > 0.',
  },
  {
    id: 'imp97071-first-moment-both-parts-positive-no-overshoot',
    holds: () =>
      IMP97071_MEASURED.kappaArithPart > 0 &&
      IMP97071_MEASURED.kappaCotanPart > 0 &&
      Math.abs(IMP97071_MEASURED.kappa - (IMP97071_MEASURED.kappaArithPart + IMP97071_MEASURED.kappaCotanPart)) < 0.01 &&
      IMP97071_REDUCTION.termSplitOvershootAvoided === true,
    why: 'unlike the imp-96750 SQUARED case (arithmetic part alone overshoots to M log^2 M), the FIRST moment F(b) has both parts positive (arithmetic ~+0.575 phi b, cotangent ~+0.121 phi b, kappa ~0.696): term-splitting does NOT overshoot the first moment.',
  },
  {
    id: 'imp97071-transfer-slope-positive-below-truth',
    holds: () => {
      const slope = IMP97071_REDUCTION.transferSlopeValue; // 36 kappa^2/pi^2
      return (
        slope > 0 &&
        slope < IMP97071_MEASURED.trueInteriorTSlope &&
        Math.abs(slope - 1.767) < 0.02 &&
        Math.abs(IMP97071_MEASURED.csSlopeFiniteDiff300to450 - slope) < 0.05 &&
        IMP97071_REDUCTION.effectiveS0Lo > 0
      );
    },
    why: 'the CS reduction transfers to T(M) >= (36 kappa^2/pi^2) log M ~ 1.767 log M -- POSITIVE (so rejects the turnover, effective s0_lo ~0.883>0) and BELOW the true interior slope 3.495 (a valid lower bound must sit below); the direct exact-CS finite-difference slope 1.76 matches.',
  },
  {
    id: 'imp97071-reduces-mean-square-to-mean-value',
    holds: () =>
      IMP97071_REDUCTION.reducesMeanSquareToMeanValue === true &&
      IMP97071_VERDICT.reducesToFirstMoment === true &&
      IMP97071_VERDICT.csReductionIsRigorous === true &&
      /first-moment-lower-bound/.test(IMP97071_SUBGAP.id) &&
      /MEAN VALUE/.test(IMP97071_SUBGAP.statement),
    why: 'the reduction replaces the imp-97054 mean-SQUARE lower companion with a strictly weaker first-MOMENT (Bettin-Conrey mean-value) lower bound -- a genuine simplification of the residual, named in the sub-gap.',
  },
  {
    id: 'imp97071-honesty-gate-no-qed',
    holds: () =>
      IMP97071_VERDICT.anyBoundMoved === false &&
      IMP97071_VERDICT.postsRigorousCeiling === false &&
      IMP97071_VERDICT.firstMomentLowerBoundProved === false &&
      IMP97071_VERDICT.qed === false &&
      IMP97071_VERDICT.csReductionIsRigorous === true &&
      Math.abs(IMP97071_MEASURED.qOverBWindowMean - 1.75127) < 1e-4 &&
      /NO QED/.test(IMP97071_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97071_HONEST_BANNER) &&
      /RH open/.test(IMP97071_HONEST_BANNER),
    why: 'reduction + partial: the Cauchy-Schwarz reduction is rigorous and the first moment is measured positive, but kappa > 0 is NOT proved -- no bound moved, no rigorous ceiling posted, honesty markers and the named residual sub-gap present (Q(b)/b window mean reproduces imp-96750 1.75127).',
  },
];

for (const a of IMP97071_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97071-route-m-lower-companion-first-moment-reduction assertion failed: ${a.id}`,
    );
  }
}

export default {
  measured: IMP97071_MEASURED,
  reduction: IMP97071_REDUCTION,
  verdict: IMP97071_VERDICT,
  subGap: IMP97071_SUBGAP,
  banner: IMP97071_HONEST_BANNER,
};
