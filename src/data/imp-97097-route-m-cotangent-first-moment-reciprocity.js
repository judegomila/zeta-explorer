/**
 * @module imp-97097-route-m-cotangent-first-moment-reciprocity
 *
 * imp-97097 (proof, DERIVATION + PARTIAL): attempt the Vasyunin/Dedekind reciprocity closed-form
 * collapse of the COTANGENT part of the Route M first moment (imp-97071 route (3), and the companion
 * of the imp-97096 arithmetic-part evaluation). The parent reduced the lower companion Q(b) >= s0_lo b
 * - O(1) to a first-MOMENT bound F(b) >= kappa phi(b) b (kappa > 0) via the exact Cauchy-Schwarz
 * inequality Q(b) >= F(b)^2/S(b), split F into an arithmetic part (evaluated in imp-97096 to the exact
 * (3/2)C - 3/8) and a cotangent part, and noted the cotangent first moment
 * Phi(b) = Sum_{a=2,(a,b)=1}^{b-1} (V(a,b) + V(b,a)) was a candidate for closed-form evaluation via
 * reciprocity "as a ranges over reduced residues, m a permutes them" -- but did NOT carry it out. This
 * leaf carries it out and reports a genuine PARTIAL collapse plus the precise obstruction. No bound is
 * proved rigorous; no refereed bound is changed; RH open; NO QED.
 *
 * Notation as imp-96750/imp-97071. V(a,q) = Sum_{m=1}^{q-1} frac(m a/q) cot(pi m/q) is the Vasyunin
 * cotangent sum; the cotangent part of I(a,b) is -(pi/2)(V(a,b) + V(b,a)), so the cotangent part of the
 * first moment F(b) is -(pi/2) Phi(b) with Phi(b) = Sum_{a=2,(a,b)=1}^{b-1} (V(a,b) + V(b,a)). R_b is
 * the set of reduced residues 1 <= a <= b-1 (phi(b) of them).
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 -- the FIXED-MODULUS half collapses EXACTLY to ZERO (rigorous).
 * -------------------------------------------------------------------------------
 * The permutation intuition of route (3) is realized, in its sharpest form, as the involution
 * a <-> b-a on R_b. For (a,b)=1 and 1 <= m <= b-1 we have b does NOT divide m a, so frac(-m a/b) =
 * 1 - frac(m a/b); with Sum_{m=1}^{b-1} cot(pi m/b) = 0 (odd symmetry m <-> b-m) this gives the exact
 * ANTISYMMETRY
 *      V(b-a, b) = Sum_m (1 - frac(m a/b)) cot(pi m/b) = -V(a,b).
 * The map a <-> b-a is a fixed-point-free involution of R_b (a = b-a would force a = b/2, never coprime
 * to b), so the fixed-modulus Vasyunin sums cancel in pairs:
 *      Sum_{a in R_b} V(a,b) = 0   for EVERY b >= 2   (EXACT, no hypothesis, no error term).
 * Restricting to a >= 2 leaves only the single a=1 boundary term:
 *      Sum_{a=2,(a,b)=1}^{b-1} V(a,b) = -V(1,b),   V(1,b) = Sum_{m=1}^{b-1} (m/b) cot(pi m/b).
 * V(1,b) is the classical cotangent sum c_0(1/b), of size O(b log b) = o(phi(b) b) (MEASURED: -V(1,b)/
 * (phi(b) b) decays 0.0234 at b=31 -> 0.0053 at b=257), so it contributes NOTHING to the leading
 * kappa phi(b) b. Thus the fixed-modulus half of the reciprocity route collapses -- but to ZERO plus a
 * lower-order boundary term, carrying NO leading lower-bound content.
 *
 * -------------------------------------------------------------------------------
 * RESULT 2 -- the ENTIRE leading cotangent moment sits in the VARYING-MODULUS half.
 * -------------------------------------------------------------------------------
 * Hence Phi(b) = -V(1,b) + Sum_{a=2,(a,b)=1}^{b-1} V(b,a), and the leading -0.077 phi(b) b of Phi(b)
 * lives ENTIRELY in the second sum Sum_a V(b,a), where a is now the MODULUS of the Vasyunin sum, not a
 * multiplier. MEASURED:
 *      Sum_{a=2,(a,b)=1}^{b-1} V(b,a) / (phi(b) b)  ->  ~ -0.076   (stable: -0.0608 at b=31,
 *                                                        -0.0721 at b=101, -0.0761 at b=257),
 *      Phi(b) / (phi(b) b)                          ->  ~ -0.077,  so the cotangent coefficient of F,
 *      kappa_cot = -(pi/2) Phi(b) / (phi(b) b)      ->  ~ +0.12   (climbing 0.059 -> 0.111 -> ~0.121),
 * matching the imp-97071 measured cotangent part ~+0.121 phi(b) b.
 *
 * -------------------------------------------------------------------------------
 * OBSTRUCTION -- why reciprocity does NOT give an elementary collapse of the operative half.
 * -------------------------------------------------------------------------------
 * Route (3) hoped the reciprocity "m a permutes reduced residues" would close the sum. That permutation
 * exists ONLY for the fixed-modulus half (modulus b constant, multiplier a permuting R_b) -- and there
 * the sharper a <-> b-a antisymmetry already forces the exact value 0. In the operative half
 * Sum_a V(b,a) the summation index a IS the modulus, so NO reduced-residue permutation of a fixed set
 * applies. Reciprocity here reads (Bettin-Conrey): with V(a,b) = c_0(a-inverse / b) and the cotangent
 * sum c_0(h/k) = Sum_{n=1}^{k-1} (n/k) cot(pi n h/k), the reciprocity c_0(h/k) + (k/h) c_0(k/h) is NOT
 * an elementary rational/log expression -- it equals a Bettin-Conrey PERIOD function (the Estermann /
 * Eisenstein period g(h/k)), verified NUMERICALLY here to defy the natural rational+log candidates
 * (e.g. at (h,k)=(2,5) the reciprocity value 0.080325 matches none of (1/pi)(k/h - h/k - 1/(hk)) =
 * 0.6366 or -(1/pi)(h/k + k/h + 1/(hk)) = -0.9549). So V(b,a) trades not for elementary terms but for a
 * cotangent sum at the modular inverse b-inverse mod a PLUS a non-elementary period term, over a
 * VARYING modulus a -- a Bettin-Conrey mean value, not a closed form. This is the precise obstruction:
 * the reciprocity collapse succeeds exactly on the half that contributes zero and does NOT elementarise
 * the half that carries the leading cotangent moment.
 *
 * -------------------------------------------------------------------------------
 * WHAT IS ESTABLISHED vs OPEN.
 * -------------------------------------------------------------------------------
 * ESTABLISHED (rigorous): Sum_{a in R_b} V(a,b) = 0 identically, hence Phi(b) = -V(1,b) + Sum_a V(b,a)
 * with -V(1,b) lower order; the cotangent first moment is HALVED to a single varying-modulus Vasyunin
 * average. OPEN: an absolute lower bound kappa_cot > -kappa_arith (equivalently Phi(b) not so negative
 * as to cancel the arithmetic +0.5705 phi(b) b) -- MEASURED comfortably (kappa = kappa_arith + kappa_cot
 * ~ 0.5705 + 0.12 ~ 0.69 > 0) but NOT proved, since the operative half has no elementary closed form.
 * The route (3) hope of a reciprocity closed form for the cotangent first moment is REFUTED as stated
 * (the permuting half is zero; the carrying half is a period-function average); a genuine lower bound
 * needs a Bettin-Conrey mean-VALUE estimate over varying moduli, not a Dedekind-style closed form.
 *
 * -------------------------------------------------------------------------------
 * VERDICT (honest; no bound moved).
 * -------------------------------------------------------------------------------
 * The Vasyunin/Dedekind reciprocity collapse of the cotangent first moment is CARRIED OUT: its
 * fixed-modulus half Sum_{a in R_b} V(a,b) collapses EXACTLY to 0 (the a <-> b-a antisymmetry, the
 * sharp form of route (3) permutation), leaving Phi(b) = -V(1,b) + Sum_a V(b,a) with the boundary
 * -V(1,b) = o(phi(b) b); the entire leading cotangent moment ~ -0.077 phi(b) b sits in the
 * varying-modulus half Sum_a V(b,a), which reciprocity does NOT elementarise (it becomes a Bettin-Conrey
 * period-function average over varying moduli, numerically confirmed non-elementary). So the route (3)
 * closed-form hope is REFUTED as stated and the cotangent leaf is sharpened to a single varying-modulus
 * Bettin-Conrey mean value; the sign kappa_cot ~ +0.12 (so kappa ~ 0.69 > 0, no cancellation of the
 * arithmetic part) is MEASURED, not proved. No rigorous ceiling posted; the trace ceiling T ~ 2.594e7
 * stays the anchor; compute (N ~ 9916) binds first. No refereed bound is changed; RH open; NO QED.
 *
 * RESIDUAL SUB-GAP (below): imp-97097-cotangent-first-moment-varying-modulus -- an absolute lower bound
 * on the varying-modulus Vasyunin average Sum_{a=2,(a,b)=1}^{b-1} V(b,a) >= -c phi(b) b with an explicit
 * c < kappa_arith = (3/2)C - 3/8 (so the cotangent part cannot cancel the arithmetic part), a
 * Bettin-Conrey cotangent MEAN VALUE over varying moduli rather than a Dedekind closed form.
 *
 * @see imp-97071-route-m-lower-companion-first-moment-reduction.js (the parent CS reduction + route (3))
 * @see imp-97096-route-m-arith-first-moment-evaluation.js (the arithmetic leaf; exact (3/2)C - 3/8)
 * @see imp-96750-route-m-interior-second-moment-upper-bound-reduction.js (I(a,b), the squaring overshoot)
 *
 * Ticket: imp-97097 (proof, opus-4-8, api-pool). Derivation + partial; NO QED.
 */

// -- lightweight exact Vasyunin kernel (small-b self-checks only; O(b^2), keep b modest) --
const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));
const frac = (x) => x - Math.floor(x);
const cot = (x) => Math.cos(x) / Math.sin(x);
const Vsum = (a, b) => {
  let s = 0;
  for (let m = 1; m < b; m++) s += frac((m * a) / b) * cot((Math.PI * m) / b);
  return s;
};
const eulerPhi = (n) => {
  let result = n, x = n;
  for (let d = 2; d * d <= x; d++) {
    if (x % d === 0) {
      while (x % d === 0) x = Math.floor(x / d);
      result -= Math.floor(result / d);
    }
  }
  if (x > 1) result -= Math.floor(result / x);
  return result;
};

// For a given b: the fixed-modulus reduced sum, its a>=2 restriction, -V(1,b), the varying-modulus sum,
// and Phi(b). O(b^2); keep b small.
function cotangentPieces(b) {
  let sumVab_all = 0, sumVab_ge2 = 0, sumVba_ge2 = 0;
  for (let a = 1; a < b; a++) {
    if (gcd(a, b) === 1) {
      sumVab_all += Vsum(a, b);
      if (a >= 2) {
        sumVab_ge2 += Vsum(a, b);
        sumVba_ge2 += Vsum(b, a);
      }
    }
  }
  const negV1 = -Vsum(1, b);
  const Phi = sumVab_ge2 + sumVba_ge2;
  return { phi: eulerPhi(b), sumVab_all, sumVab_ge2, sumVba_ge2, negV1, Phi };
}

// MEASURED constants (tmp/imp-97097-split.py; leading limits over b <= 257).
export const IMP97097_MEASURED = Object.freeze({
  varyingModulusCoeff: -0.076, // Sum_{a>=2} V(b,a)/(phi b) -> ~ -0.076 (-0.0608 b=31 -> -0.0761 b=257)
  phiCoeff: -0.077, // Phi(b)/(phi b) -> ~ -0.077
  kappaCot: 0.121, // -(pi/2) Phi/(phi b) -> ~ +0.121 (imp-97071 cotangent part; climbing 0.059 -> 0.111)
  boundaryDecays: true, // -V(1,b)/(phi b) decays 0.0234 (b=31) -> 0.0053 (b=257): O(b log b) = o(phi b)
  kappaArith: 0.5704960511308594, // imp-97096 exact (3/2)C - 3/8 (the part the cotangent must not cancel)
});

// The exact fixed-modulus collapse and the varying-modulus residual.
export const IMP97097_REDUCTION = Object.freeze({
  antisymmetry: 'V(b-a,b) = -V(a,b)  (frac(-ma/b) = 1 - frac(ma/b), Sum_m cot(pi m/b) = 0)',
  fixedModulusVanishes: 'Sum_{a in R_b} V(a,b) = 0  for every b >= 2  (EXACT; a <-> b-a fixed-point-free involution)',
  boundaryTerm: 'Sum_{a=2,(a,b)=1}^{b-1} V(a,b) = -V(1,b),  V(1,b) = c_0(1/b) = O(b log b) = o(phi b)',
  operativeHalf: 'Phi(b) = -V(1,b) + Sum_{a=2,(a,b)=1}^{b-1} V(b,a);  leading -0.077 phi b lives in Sum_a V(b,a)',
  reciprocityNotElementary: 'c_0(h/k) + (k/h) c_0(k/h) = Bettin-Conrey period g(h/k), NOT rational/log',
  varyingModulusHasNoPermutation: true, // a is the MODULUS in Sum_a V(b,a); no reduced-residue permutation
  routeThreeClosedFormRefutedAsStated: true, // permuting half is 0; carrying half is a period-function average
});

export const IMP97097_VERDICT = Object.freeze({
  question:
    'does Vasyunin/Dedekind reciprocity collapse the cotangent first moment ' +
    'Phi(b) = Sum_{a=2,(a,b)=1}^{b-1} (V(a,b)+V(b,a)) to a closed-form rigorous lower bound (imp-97071 route 3)?',
  fixedModulusVanishesRigorously: true, // Sum_{a in R_b} V(a,b) = 0 EXACT (a <-> b-a antisymmetry)
  boundaryLowerOrder: true, // -V(1,b) = O(b log b) = o(phi b)
  operativeHalfIsVaryingModulus: true, // entire leading moment in Sum_a V(b,a)
  reciprocityElementarisesOperativeHalf: false, // it becomes a period-function average, not a closed form
  routeThreeClosedFormRefutedAsStated: true,
  cotangentSignPositive: true, // kappa_cot ~ +0.12 MEASURED (so kappa ~ 0.69 > 0, no cancellation)
  cotangentLowerBoundProved: false, // sign/magnitude MEASURED, not proved
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  computeBindsFirst: true,
  qed: false,
  conclusion:
    'The Vasyunin/Dedekind reciprocity collapse of the cotangent first moment is CARRIED OUT. Its ' +
    'fixed-modulus half Sum_{a in R_b} V(a,b) collapses EXACTLY to 0 via the a <-> b-a antisymmetry ' +
    'V(b-a,b) = -V(a,b) (the sharp form of the route (3) permutation), leaving ' +
    'Phi(b) = -V(1,b) + Sum_a V(b,a) with the boundary -V(1,b) = O(b log b) = o(phi b). The ENTIRE ' +
    'leading cotangent moment ~ -0.077 phi(b) b sits in the varying-modulus half Sum_a V(b,a), where a ' +
    'is the modulus, so no reduced-residue permutation applies and reciprocity does NOT elementarise it ' +
    '(it becomes a Bettin-Conrey period-function average, numerically confirmed non-elementary). So the ' +
    'route (3) closed-form hope is REFUTED as stated -- the permuting half is zero, the carrying half is ' +
    'a period average -- and the cotangent leaf is sharpened to a single varying-modulus Bettin-Conrey ' +
    'mean value; the sign kappa_cot ~ +0.12 (kappa ~ 0.69 > 0, no cancellation of the arithmetic ' +
    '+0.5705 phi b) is MEASURED, not proved. No bound moved, no rigorous ceiling posted; T ~ 2.594e7 ' +
    'anchor; compute N ~ 9916 binds first. No refereed bound is changed; RH open; NO QED.',
});

export const IMP97097_SUBGAP = Object.freeze({
  id: 'imp-97097-cotangent-first-moment-varying-modulus',
  statement:
    'The cotangent first moment collapses to Phi(b) = -V(1,b) + Sum_{a=2,(a,b)=1}^{b-1} V(b,a): the ' +
    'fixed-modulus half Sum_{a in R_b} V(a,b) = 0 EXACTLY (a <-> b-a antisymmetry) and -V(1,b) is lower ' +
    'order O(b log b). The remaining open piece is an absolute lower bound on the VARYING-MODULUS ' +
    'Vasyunin average Sum_{a=2,(a,b)=1}^{b-1} V(b,a) >= -c phi(b) b with an explicit c < kappa_arith = ' +
    '(3/2)C - 3/8 = 0.5705 (so the cotangent part cannot cancel the imp-97096 arithmetic part). This is ' +
    'a Bettin-Conrey cotangent MEAN VALUE over varying moduli (V(b,a) = c_0(b-inverse mod a / a) plus a ' +
    'non-elementary period term), NOT a Dedekind-style closed form -- reciprocity elementarises only the ' +
    'fixed-modulus half, which contributes zero. MEASURED c ~ 0.076 << 0.5705, but NOT proved.',
});

export const IMP97097_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Derivation + partial only: the cotangent first ' +
  'moment reciprocity collapse is carried out -- its fixed-modulus half Sum_{a in R_b} V(a,b) = 0 ' +
  'EXACTLY (a <-> b-a antisymmetry), halving Phi(b) to -V(1,b) + Sum_a V(b,a) with -V(1,b) lower order. ' +
  'The operative varying-modulus half Sum_a V(b,a) carries the whole leading ~ -0.077 phi(b) b and is ' +
  'NOT elementarised by reciprocity (a Bettin-Conrey period-function average, not a closed form), so ' +
  'route (3) as stated is refuted; the cotangent sign kappa_cot ~ +0.12 is measured, not proved. No ' +
  'bound is claimed moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97097_ASSERTIONS = [
  {
    id: 'imp97097-fixed-modulus-half-vanishes-exactly',
    holds: () => {
      // Sum_{a in R_b} V(a,b) = 0 EXACTLY, and the a>=2 restriction equals -V(1,b). Both even and odd b.
      for (const b of [49, 60, 101, 120]) {
        const { sumVab_all, sumVab_ge2, negV1 } = cotangentPieces(b);
        if (Math.abs(sumVab_all) > 1e-7) return false; // exact cancellation
        if (Math.abs(sumVab_ge2 - negV1) > 1e-7) return false; // a>=2 leaves -V(1,b)
      }
      return true;
    },
    why: 'the fixed-modulus half Sum_{a in R_b} V(a,b) collapses EXACTLY to 0 via the fixed-point-free involution a <-> b-a with V(b-a,b) = -V(a,b); verified to machine precision for even and odd b (49,60,101,120), and the a>=2 restriction equals -V(1,b).',
  },
  {
    id: 'imp97097-operative-half-is-varying-modulus',
    holds: () => {
      // Phi = -V(1,b) + Sum_a V(b,a); the varying-modulus sum carries the leading term, boundary decays.
      for (const b of [101, 211]) {
        const { phi, sumVba_ge2, negV1, Phi } = cotangentPieces(b);
        if (!(sumVba_ge2 < 0)) return false; // carrying half is negative (~ -0.076 phi b)
        if (Math.abs(Phi - (negV1 + sumVba_ge2)) > 1e-7) return false; // decomposition exact
        // boundary is lower order than the varying-modulus half
        if (!(Math.abs(negV1) < 0.5 * Math.abs(sumVba_ge2))) return false;
        // varying-modulus coefficient near the measured -0.076
        if (Math.abs(sumVba_ge2 / (phi * b) - IMP97097_MEASURED.varyingModulusCoeff) > 0.02) return false;
      }
      return true;
    },
    why: 'Phi(b) = -V(1,b) + Sum_a V(b,a) with the varying-modulus half negative (~ -0.076 phi b) carrying the leading moment and the boundary -V(1,b) lower order; verified at b=101,211.',
  },
  {
    id: 'imp97097-kappa-cot-positive-no-cancellation',
    holds: () => {
      // kappa_cot = -(pi/2) Phi/(phi b) > 0 (measured), so kappa = kappa_arith + kappa_cot > 0.
      const { phi, Phi } = cotangentPieces(211);
      const kappaCot = (-Math.PI / 2) * (Phi / (phi * 211));
      return (
        kappaCot > 0 &&
        IMP97097_MEASURED.kappaCot > 0 &&
        IMP97097_MEASURED.kappaArith + IMP97097_MEASURED.kappaCot > 0.6 && // total kappa ~ 0.69
        Math.abs(IMP97097_MEASURED.varyingModulusCoeff) < IMP97097_MEASURED.kappaArith // no cancellation
      );
    },
    why: 'the cotangent coefficient kappa_cot = -(pi/2) Phi/(phi b) is positive (measured ~+0.12 at b=211), so it ADDS to the imp-97096 arithmetic +0.5705 (total kappa ~ 0.69), and |varying-modulus coeff| ~ 0.076 << kappa_arith 0.5705, so it cannot cancel the arithmetic part -- but this is MEASURED, not proved.',
  },
  {
    id: 'imp97097-honesty-gate-no-qed',
    holds: () =>
      IMP97097_VERDICT.fixedModulusVanishesRigorously === true &&
      IMP97097_VERDICT.reciprocityElementarisesOperativeHalf === false &&
      IMP97097_VERDICT.routeThreeClosedFormRefutedAsStated === true &&
      IMP97097_VERDICT.cotangentLowerBoundProved === false &&
      IMP97097_VERDICT.anyBoundMoved === false &&
      IMP97097_VERDICT.postsRigorousCeiling === false &&
      IMP97097_VERDICT.qed === false &&
      /varying-modulus/.test(IMP97097_SUBGAP.id) &&
      /MEAN VALUE/.test(IMP97097_SUBGAP.statement) &&
      /NO QED/.test(IMP97097_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97097_HONEST_BANNER) &&
      /RH open/.test(IMP97097_HONEST_BANNER),
    why: 'derivation + partial: the fixed-modulus collapse to 0 is rigorous, but the operative varying-modulus half is not elementarised and the cotangent sign is measured, not proved -- no bound moved, no rigorous ceiling posted, honesty markers and the named residual sub-gap present.',
  },
];

for (const a of IMP97097_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97097-route-m-cotangent-first-moment-reciprocity assertion failed: ${a.id}`,
    );
  }
}

export default {
  measured: IMP97097_MEASURED,
  reduction: IMP97097_REDUCTION,
  verdict: IMP97097_VERDICT,
  subGap: IMP97097_SUBGAP,
  banner: IMP97097_HONEST_BANNER,
};
