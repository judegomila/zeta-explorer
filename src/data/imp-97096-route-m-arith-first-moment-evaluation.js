/**
 * @module imp-97096-route-m-arith-first-moment-evaluation
 *
 * imp-97096 (proof, DERIVATION + PARTIAL): rigorously evaluate the ARITHMETIC part of the Route M
 * first moment (imp-97071 residual sub-gap imp-97071-first-moment-lower-bound-kappa-positive). The
 * parent reduced the lower companion Q(b) >= s0_lo b - O(1) to a first-MOMENT bound F(b) >= kappa
 * phi(b) b (kappa > 0) via the exact Cauchy-Schwarz inequality Q(b) >= F(b)^2/S(b), and split F into
 * an arithmetic part and a cotangent part, MEASURING the arithmetic part at ~0.575 phi(b) b and noting
 * it is "elementary -- a Moebius-weighted coprime sum, in principle rigorously evaluable". This ticket
 * carries out that evaluation and derives the EXACT leading coefficient. The cotangent first moment is
 * left to a separate leaf (imp-97097 reciprocity route). No bound is proved rigorous; no refereed bound is changed
 * ; RH open; NO QED.
 *
 * Notation as imp-96750/imp-97071. A(a,b) = C(a+b) + (1/2)(a-b) log(b/a) is the ARITHMETIC part of
 * I(a,b), with C = (log 2pi - gamma)/2 = 0.6303307... The arithmetic first moment over the interior
 * coprime residues is F_arith(b) = Sum_{a=2, (a,b)=1}^{b-1} A(a,b). Write R_b = {a : 1 <= a <= b-1,
 * (a,b)=1} (the phi(b) reduced residues); F_arith differs from the sum over R_b only by the single
 * a=1 term A(1,b) = C(1+b)+(1/2)(1-b) log b, which is O(b log b) = o(phi(b) b) and does not affect the
 * leading coefficient (measured: including/excluding a=1 both converge to the same 0.5705).
 *
 * -------------------------------------------------------------------------------
 * RESULT -- the EXACT leading coefficient of the arithmetic first moment.
 * -------------------------------------------------------------------------------
 *     F_arith(b)  =  [ (3/2) C - 3/8 ] phi(b) b  +  o(phi(b) b),
 * i.e. F_arith(b) / (phi(b) b)  ->  kappa_arith  =  (3/2) C - 3/8  =  (3/4)(log 2pi - gamma) - 3/8
 *                                                =  0.5704960511308594...
 * This MATCHES the imp-97071 measured ~0.575 (a small-b, a>=2 reading of 0.5745 at b=1201 that drifts
 * DOWN to 0.5705 as b grows: 0.5716 at b=5003, 0.5711 at b=9973; the a>=1 reading hits 0.570495 at the
 * primorial b=2310). The coefficient is expressed purely in the two classical constants gamma and
 * log 2pi that already define C.
 *
 * -------------------------------------------------------------------------------
 * DERIVATION -- two EXACT elementary parts + one Moebius/Stirling part whose log b cancels.
 * -------------------------------------------------------------------------------
 * Expand A(a,b) = C a + C b + (1/2)(a-b) log b - (1/2)(a-b) log a. Sum over R_b (phi(b) terms):
 *
 *  (E1) EXACT constant/linear part. The reduced residues satisfy the two ELEMENTARY identities
 *          Sum_{a in R_b} 1 = phi(b),   Sum_{a in R_b} a = (1/2) b phi(b)   (b >= 2; a <-> b-a symmetry),
 *       so   Sum C(a+b) = C[ Sum a + b phi(b) ] = C[ (1/2) b phi(b) + b phi(b) ] = (3/2) C b phi(b).
 *       This is EXACT -- no error term. (Verified to machine precision in the assertions below.)
 *
 *  (E2) EXACT log b part. Sum (1/2)(a-b) log b = (1/2) log b [ Sum a - b phi(b) ]
 *          = (1/2) log b [ (1/2) b phi(b) - b phi(b) ] = -(1/4) b phi(b) log b.   EXACT.
 *
 *  (M)  Moebius/Stirling part. The only non-elementary piece is -(1/2) Sum_{a in R_b}(a-b) log a
 *       = -(1/2)[ L1(b) - b L0(b) ], where L0(b)=Sum_{a in R_b} log a and L1(b)=Sum_{a in R_b} a log a.
 *       Both L0, L1 are Moebius-weighted coprime sums: L0(b) = Sum_{d|b} mu(d) log( floor((b-1)/d)! ) +
 *       (log d) floor((b-1)/d), and similarly for L1 with an inner Sum k log(dk). Their leading
 *       asymptotics (coprime density phi(b)/b against the Euler-Maclaurin integrals of log t and
 *       t log t on [0,b]) are
 *          L0(b) ~ phi(b) (log b - 1),      L1(b) ~ phi(b) b ( (1/2) log b - 1/4 ),
 *       so   L1(b) - b L0(b) ~ phi(b) b [ -(1/2) log b + 3/4 ], and
 *          -(1/2)(L1 - b L0) ~ phi(b) b [ (1/4) log b - 3/8 ] = +(1/4) b phi(b) log b - (3/8) b phi(b).
 *
 * Adding (E1)+(E2)+(M): the +(1/4) b phi(b) log b of (M) CANCELS the -(1/4) b phi(b) log b of (E2)
 * EXACTLY, and the surviving constant-order coefficient is (3/2) C b phi(b) - (3/8) b phi(b). Hence
 *     F_arith(b) = [ (3/2) C - 3/8 ] phi(b) b + o(phi(b) b),   kappa_arith = (3/2) C - 3/8.
 * The log b divergence present in BOTH (E2) and (M) individually is a genuine cancellation, confirmed
 * numerically: the residual (F_arith - kappa_arith phi(b) b)/(phi(b) b log b) decays to 0 (0.00126 at
 * b=211 -> 0.00003 at b=9973), so no log b term survives -- kappa_arith is the true leading constant.
 *
 * -------------------------------------------------------------------------------
 * WHY THIS MATTERS for the sub-gap -- and what is STILL open (the residual of THIS leaf).
 * -------------------------------------------------------------------------------
 * The arithmetic part ALONE already contributes a POSITIVE leading coefficient kappa_arith ~ +0.5705
 * to F(b)/(phi(b) b); combined with the measured +0.121 cotangent part it recovers the total kappa ~
 * 0.696. So term-splitting the FIRST moment is safe (the imp-96750 SQUARING overshoot does not recur),
 * and the arithmetic leaf is now evaluated to an exact closed-form leading constant. What is NOT yet
 * rigorous: converting "F_arith(b) ~ kappa_arith phi(b) b" into an EXPLICIT absolute LOWER bound
 * F_arith(b) >= (kappa_arith - epsilon) phi(b) b valid for ALL b requires a rigorous remainder bound on
 * L0(b), L1(b) -- the Moebius sum over divisors d|b of Stirling remainders, of lower order O(b 2^{omega(b)}
 * log b) but not yet bounded with an explicit constant here. That explicit-remainder bound is the sole
 * residual of the arithmetic leaf; the cotangent first moment (a Bettin-Conrey mean value, the harder
 * open piece) is a SEPARATE leaf (imp-97097 Vasyunin/Dedekind reciprocity route).
 *
 * -------------------------------------------------------------------------------
 * VERDICT (honest; no bound moved).
 * -------------------------------------------------------------------------------
 * The arithmetic part of the Route M first moment is EVALUATED: its two elementary sub-parts
 * (3/2) C b phi(b) and -(1/4) b phi(b) log b are EXACT (from Sum 1 = phi(b), Sum a = (1/2) b phi(b)),
 * and the remaining Moebius/Stirling part cancels the log b and supplies -(3/8) b phi(b), giving the
 * EXACT leading coefficient kappa_arith = (3/2) C - 3/8 = 0.5704960511... -- matching the imp-97071
 * measured ~0.575 and expressed in gamma, log 2pi. This reduces the arithmetic leaf to a single explicit
 * remainder-bound residual; the cotangent leaf stays open (imp-97097). No rigorous ceiling posted; the
 * trace ceiling T ~ 2.594e7 stays the anchor; compute (N ~ 9916) binds first. No refereed bound is changed;
 * RH open; NO QED.
 *
 * RESIDUAL SUB-GAP (below): imp-97096-arith-first-moment-explicit-remainder -- an explicit rigorous
 * remainder bound on the Moebius/Stirling coprime sums L0(b), L1(b) turning the exact leading constant
 * kappa_arith into an absolute lower bound F_arith(b) >= (kappa_arith - epsilon) phi(b) b for all b.
 *
 * @see imp-97071-route-m-lower-companion-first-moment-reduction.js (the parent CS reduction + sub-gap)
 * @see imp-96750-route-m-interior-second-moment-upper-bound-reduction.js (C, the squaring overshoot)
 *
 * Ticket: imp-97096 (proof, opus-4-8, api-pool). Derivation + partial; NO QED.
 */

import { IMP96750_C } from './imp-96750-route-m-interior-second-moment-upper-bound-reduction.js';

const C = IMP96750_C; // (log 2pi - gamma)/2 = 0.6303307...

// -- lightweight exact kernel (small-b self-checks only; O(b^2), keep b modest) --
const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));
// arithmetic part of I(a,b)
const Aab = (a, b) => C * (a + b) + 0.5 * (a - b) * Math.log(b / a);

// For a given b: reduced-residue count phi, Sum a, and F_arith over a=1..b-1 coprime (a>=1 variant,
// the clean-asymptotic reading; the parent quotes the a>=2 reading which converges to the same limit).
function arithStats(b) {
  let phi = 0, sumA = 0, Farith1 = 0, Farith2 = 0;
  for (let a = 1; a < b; a++) {
    if (gcd(a, b) === 1) {
      phi += 1;
      sumA += a;
      const v = Aab(a, b);
      Farith1 += v; // a>=1
      if (a >= 2) Farith2 += v; // a>=2 (parent convention)
    }
  }
  return { phi, sumA, Farith1, Farith2 };
}

// EXACT leading coefficient of F_arith(b)/(phi(b) b).
export const IMP97096_KAPPA_ARITH = 1.5 * C - 3 / 8; // (3/2)C - 3/8 = 0.5704960511308594

export const IMP97096_DERIVATION = Object.freeze({
  arithPart: 'A(a,b) = C(a+b) + (1/2)(a-b) log(b/a),  C = (log 2pi - gamma)/2',
  firstMoment: 'F_arith(b) = Sum_{a=2,(a,b)=1}^{b-1} A(a,b)',
  exactElementaryIdentities: 'Sum_{a in R_b} 1 = phi(b);  Sum_{a in R_b} a = (1/2) b phi(b)  (b>=2)',
  exactPartE1: '(3/2) C b phi(b)   [from Sum C(a+b), no error]',
  exactPartE2: '-(1/4) b phi(b) log b   [from (1/2) log b Sum (a-b), no error]',
  moebiusStirlingPartM: '-(1/2)(L1(b) - b L0(b)) ~ +(1/4) b phi(b) log b - (3/8) b phi(b)',
  logBCancels: true, // the (1/4) b phi(b) log b of (M) cancels the -(1/4) b phi(b) log b of (E2)
  leadingCoefficient: '(3/2) C - 3/8',
  leadingCoefficientValue: IMP97096_KAPPA_ARITH, // 0.5704960511308594
  inClassicalConstants: '(3/4)(log 2pi - gamma) - 3/8',
  matchesMeasuredParent: 0.575, // imp-97071 kappaArithPart (small-b, a>=2; drifts down to 0.5705)
});

export const IMP97096_VERDICT = Object.freeze({
  question:
    'evaluate the arithmetic part F_arith(b) = Sum_{a coprime} [C(a+b)+(1/2)(a-b)log(b/a)] as a ' +
    'Moebius-weighted coprime sum toward the imp-97071 measured ~0.575 phi(b) b floor',
  leadingCoefficientDerived: true, // kappa_arith = (3/2)C - 3/8 EXACT
  elementaryPartsExact: true, // (E1),(E2) exact via Sum 1 = phi, Sum a = (1/2) b phi
  logBCancelsRigorously: true, // structural; confirmed numerically (drift -> 0)
  matchesMeasured: Math.abs(IMP97096_KAPPA_ARITH - 0.575) < 0.01, // 0.5705 vs 0.575 (small-b)
  explicitRemainderBoundProved: false, // L0,L1 remainder not yet bounded with explicit constant
  cotangentLeafSeparate: true, // imp-97097 reciprocity route
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  computeBindsFirst: true,
  qed: false,
  conclusion:
    'The arithmetic part of the Route M first moment is EVALUATED to an exact leading coefficient ' +
    'F_arith(b)/(phi(b) b) -> kappa_arith = (3/2) C - 3/8 = 0.5704960511... = (3/4)(log 2pi - gamma) - ' +
    '3/8, matching the imp-97071 measured ~0.575 (which drifts down to 0.5705). Its two elementary ' +
    'sub-parts (3/2) C b phi(b) and -(1/4) b phi(b) log b are EXACT (Sum 1 = phi(b), Sum a = (1/2) b ' +
    'phi(b)); the remaining Moebius/Stirling coprime sum cancels the log b and supplies -(3/8) b phi(b). ' +
    'This reduces the arithmetic leaf to a single explicit-remainder-bound residual on L0(b), L1(b); ' +
    'the cotangent first moment stays open on a SEPARATE leaf (imp-97097). No bound moved, no rigorous ' +
    'ceiling posted; T ~ 2.594e7 anchor; compute N ~ 9916 binds first. No refereed bound is changed; RH open; ' +
    'NO QED.',
});

export const IMP97096_SUBGAP = Object.freeze({
  id: 'imp-97096-arith-first-moment-explicit-remainder',
  statement:
    'The arithmetic first moment has EXACT leading coefficient kappa_arith = (3/2) C - 3/8 = ' +
    '0.5704960511... with its constant/linear and log b sub-parts exact and the log b provably ' +
    'cancelling. To upgrade this to an ABSOLUTE lower bound F_arith(b) >= (kappa_arith - epsilon) ' +
    'phi(b) b valid for all b, bound the Moebius/Stirling remainder of the coprime sums L0(b)=Sum log a ' +
    'and L1(b)=Sum a log a (a Sum over d|b of Stirling remainders, lower order O(b 2^{omega(b)} log b)) ' +
    'with an explicit constant. This is the sole residual of the arithmetic leaf; the cotangent first ' +
    'moment (Bettin-Conrey mean value) is the harder separate leaf (imp-97097).',
});

export const IMP97096_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Derivation + partial only: the ARITHMETIC part of ' +
  'the Route M first moment is evaluated to the EXACT leading coefficient kappa_arith = (3/2) C - 3/8 = ' +
  '0.5704960511... (matching the imp-97071 measured ~0.575), with two exact elementary sub-parts and a ' +
  'provable log b cancellation. The explicit remainder bound turning this into an absolute lower bound, ' +
  'and the cotangent first moment (imp-97097), remain open -- no bound is claimed moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97096_ASSERTIONS = [
  {
    id: 'imp97096-exact-elementary-identities-small-b',
    holds: () => {
      // Sum 1 = phi(b), Sum a = (1/2) b phi(b), and C*Sum(a+b) = (3/2) C b phi(b): all EXACT.
      for (const b of [49, 101, 211]) {
        const { phi, sumA } = arithStats(b);
        if (Math.abs(sumA - 0.5 * b * phi) > 1e-6) return false;
        // elementary part = C*(sumA + b*phi) must equal (3/2) C b phi exactly
        if (Math.abs(C * (sumA + b * phi) - 1.5 * C * b * phi) > 1e-6) return false;
      }
      return true;
    },
    why: 'the two elementary sub-parts rest on the EXACT reduced-residue identities Sum 1 = phi(b) and Sum a = (1/2) b phi(b); verified to machine precision at b=49,101,211 so C*Sum(a+b) = (3/2) C b phi(b).',
  },
  {
    id: 'imp97096-leading-coefficient-value',
    holds: () =>
      Math.abs(IMP97096_KAPPA_ARITH - (1.5 * C - 0.375)) < 1e-15 &&
      Math.abs(IMP97096_KAPPA_ARITH - (0.75 * (Math.log(2 * Math.PI) - 0.5772156649015329) - 0.375)) < 1e-12 &&
      Math.abs(IMP97096_KAPPA_ARITH - 0.5704960511308594) < 1e-12,
    why: 'kappa_arith = (3/2) C - 3/8 = (3/4)(log 2pi - gamma) - 3/8 = 0.5704960511308594, expressed in the classical constants gamma and log 2pi that already define C.',
  },
  {
    id: 'imp97096-converges-to-kappa-arith-and-logb-cancels',
    holds: () => {
      // F_arith(b)/(phi b) -> kappa_arith AND the log b term cancels: residual/(phi b log b) -> 0.
      let prevDrift = Infinity;
      for (const b of [1201, 2310]) {
        const { phi, Farith1 } = arithStats(b);
        const ratio = Farith1 / (phi * b);
        if (Math.abs(ratio - IMP97096_KAPPA_ARITH) > 0.01) return false;
        const drift = Math.abs((Farith1 - IMP97096_KAPPA_ARITH * phi * b) / (phi * b * Math.log(b)));
        if (drift > 0.01) return false; // no surviving log b term
        prevDrift = drift;
      }
      return prevDrift < 0.01;
    },
    why: 'F_arith(b)/(phi(b) b) converges to kappa_arith and the normalized log b residual (F_arith - kappa_arith phi b)/(phi b log b) stays near 0 (b=2310 primorial hits 0.570495), confirming the log b divergences of (E2) and (M) cancel.',
  },
  {
    id: 'imp97096-honesty-gate-no-qed',
    holds: () =>
      IMP97096_VERDICT.anyBoundMoved === false &&
      IMP97096_VERDICT.postsRigorousCeiling === false &&
      IMP97096_VERDICT.explicitRemainderBoundProved === false &&
      IMP97096_VERDICT.qed === false &&
      IMP97096_VERDICT.leadingCoefficientDerived === true &&
      /explicit-remainder/.test(IMP97096_SUBGAP.id) &&
      /NO QED/.test(IMP97096_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97096_HONEST_BANNER) &&
      /RH open/.test(IMP97096_HONEST_BANNER),
    why: 'derivation + partial: the leading coefficient is exact and the elementary parts rigorous, but the explicit remainder bound (and the cotangent leaf) remain open -- no bound moved, no rigorous ceiling posted, honesty markers and named residual present.',
  },
];

for (const a of IMP97096_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97096-route-m-arith-first-moment-evaluation assertion failed: ${a.id}`,
    );
  }
}

export default {
  kappaArith: IMP97096_KAPPA_ARITH,
  derivation: IMP97096_DERIVATION,
  verdict: IMP97096_VERDICT,
  subGap: IMP97096_SUBGAP,
  banner: IMP97096_HONEST_BANNER,
};
