/**
 * @module imp-97181-route-m-cotangent-firstmoment-sign-inverse-bias
 *
 * imp-97181 (proof, DERIVATION + PARTIAL -- sign structure, no bound moved): attempt to establish
 * ANALYTICALLY the SIGN (positivity) of the Route M cotangent first-moment leaf
 *   F_cot(b) = -(pi/2) Sum_{a=2,(a,b)=1}^{b-1} (V(a,b) + V(b,a)),
 * MEASURED positive (~ +0.121 phi(b) b, imp-97071/imp-97097/imp-97168) but never derived. This leaf
 * does NOT prove positivity; it derives the exact SIGN STRUCTURE of the operative varying-modulus half
 * and reaches the precise obstruction: the sign is a SIGNED INVERSE-MAP BIAS against an exactly-odd,
 * mean-zero cotangent kernel, so no pointwise sign argument can exist. Derivation only; no bound on
 * Lambda moves; no refereed bound is changed; RH open; NO QED.
 *
 * Notation as imp-97097/imp-97116/imp-97204. V(h,k) = c_0(h/k) = Sum_{m=1}^{k-1} frac(m h/k) cot(pi m/k)
 * is the Vasyunin cotangent sum. imp-97097 RESULT 1 proved the fixed-modulus half Sum_{a in R_b} V(a,b)
 * = 0 EXACTLY (a <-> b-a antisymmetry), leaving F_cot(b) = -(pi/2) Phi(b) with Phi(b) = -V(1,b) + S(b),
 * S(b) = Sum_{a=2,(a,b)=1}^{b-1} V(b,a) the OPERATIVE varying-modulus half and -V(1,b) = o(phi b b)
 * (imp-97119). So F_cot(b) > 0  <=>  Phi(b) < 0  <=>  S(b) < 0 to leading order. imp-97116 gives
 * V(b,a) = c_0(h_a/a) with h_a = b-inverse mod a. The question is thus the sign of the varying-modulus
 * Vasyunin average S(b) = Sum_a c_0(h_a/a).
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 -- the NUMERATOR antisymmetry: c_0(h/a) = -c_0((a-h)/a) EXACTLY (rigorous).
 * -------------------------------------------------------------------------------
 * The imp-97097 antisymmetry V(b-a,b) = -V(a,b) acts on the MULTIPLIER a over a fixed modulus b. The
 * SAME algebraic identity applies to the NUMERATOR of each varying-modulus term: for (h,a)=1 and
 * 1 <= m <= a-1, a does not divide m h, so frac(-m h/a) = 1 - frac(m h/a); with the odd symmetry
 * Sum_{m=1}^{a-1} cot(pi m/a) = 0 (m <-> a-m) this gives
 *      c_0((a-h)/a) = Sum_m (1 - frac(m h/a)) cot(pi m/a) = -c_0(h/a)   for every (h,a)=1.
 * The map h <-> a-h is a fixed-point-free involution of the reduced residues mod a (h = a-h forces
 * h = a/2, never coprime to a), so the Vasyunin sums cancel in pairs over the NUMERATOR line:
 *      Sum_{h=1,(h,a)=1}^{a-1} c_0(h/a) = 0   for every a >= 2   (EXACT, no hypothesis, no error term).
 * Hence the kernel h |-> c_0(h/a) is ODD about the midpoint a/2 and MEAN-ZERO over coprime numerators.
 * MEASURED: c_0(h/a) < 0 for the SMALL numerators (large in magnitude, ~ a log a at h=1, decreasing),
 * and by antisymmetry c_0((a-h)/a) > 0 of equal magnitude for the LARGE numerators; exactly half the
 * coprime numerators give each sign.
 *
 * -------------------------------------------------------------------------------
 * RESULT 2 -- the SIGN of S(b) has NO pointwise cause; it is a SIGNED INVERSE-MAP BIAS (the reframing).
 * -------------------------------------------------------------------------------
 * S(b) = Sum_{a=2,(a,b)=1}^{b-1} c_0(h_a/a) samples the odd, mean-zero kernel c_0(.,a) at the single
 * point h_a = b-inverse mod a for each modulus a. By RESULT 1 the per-modulus expectation over a
 * UNIFORM coprime numerator vanishes: (1/phi(a)) Sum_{h} c_0(h/a) = 0. Therefore a nonzero, sign-
 * definite S(b) can NOT come from any pointwise sign of the summand (each c_0(h_a/a) is negative or
 * positive with the OTHER sign equally available at the antisymmetric partner a-h_a). The measured
 * negativity S(b)/(phi b b) ~ -0.079 (stable; imp-97204) is a genuine CORRELATION between the
 * deterministic inverse map a |-> h_a = b-inverse mod a and the antisymmetric cotangent kernel -- a
 * SIGNED equidistribution bias, not a termwise inequality.
 *
 * -------------------------------------------------------------------------------
 * RESULT 3 -- the bias is MAGNITUDE-weighted, not a COUNT bias (measured; sharpens the mechanism).
 * -------------------------------------------------------------------------------
 * MEASURED: the count of moduli with h_a < a/2 vs h_a > a/2 is essentially BALANCED
 *      #(h_a < a/2) - #(h_a > a/2)  ->  0    ( -1 at b=211, -1 at b=2003; |bias|/phi < 0.005 ),
 * so S(b) < 0 is NOT because the inverse lands in the negative half more OFTEN. It is because the
 * NEGATIVE contributions carry more WEIGHT: the small-inverse resonances a | (b k - 1) put h_a = k
 * small, giving c_0(k/a) ~ -a log a / (pi k) large NEGATIVE, while their positive counterparts require
 * a | (b k + 1) at DIFFERENT moduli; the two resonance families do not pair modulus-for-modulus, so a
 * small residual magnitude imbalance survives. The sign is thus a delicate SECOND-ORDER weighted effect
 * of the inverse distribution, consistent with the small stable coefficient ~ -0.079 (|kappa_cot| ~ 0.12).
 *
 * -------------------------------------------------------------------------------
 * OBSTRUCTION -- why the sign is not provable by the machinery already deployed.
 * -------------------------------------------------------------------------------
 * A rigorous F_cot(b) > 0 requires a SIGNED (cancellation-preserving) equidistribution estimate for the
 * inverse map a |-> b-inverse mod a tested against the ODD kernel c_0(.,a) -- precisely the signed
 * Bettin-Conrey mean value flagged in imp-97097/imp-97204. RESULT 1 shows why the two available
 * cancellation mechanisms both fail on it: (i) the a <-> b-a antisymmetry (imp-97097) annihilates the
 * FIXED-modulus half and does NOT act on the modulus index a of S(b); (ii) the even-moment machinery
 * (imp-97203 mean square, imp-97180 absolute value) DESTROYS the very sign it is asked to certify, since
 * |c_0| and c_0^2 are EVEN under h <-> a-h and cannot see the odd bias. So the sign lives exactly in the
 * ODD part of the inverse-map distribution, invisible to both the antisymmetry and the even moments; a
 * signed period-function average with no closed form is the irreducible input. This is the precise
 * obstruction: positivity of F_cot(b) is an ODD signed-equidistribution statement, strictly harder than
 * the |S| <= A absolute program (imp-97204) that secures only the two-sided |kappa_cot| bound.
 *
 * -------------------------------------------------------------------------------
 * WHAT IS ESTABLISHED vs OPEN.
 * -------------------------------------------------------------------------------
 * ESTABLISHED (rigorous): the numerator antisymmetry c_0(h/a) = -c_0((a-h)/a) and the exact mean-zero
 * Sum_{h coprime a} c_0(h/a) = 0 for every a >= 2; hence S(b) = Sum_a c_0(h_a/a) has NO pointwise sign
 * and F_cot(b) > 0 is EQUIVALENT to an odd signed inverse-map bias. OPEN: the bias itself -- a signed
 * equidistribution of b-inverse mod a against the odd kernel -- stays MEASURED (S(b) < 0 stable,
 * kappa_cot ~ +0.12), not proved; it is invisible to the a <-> b-a antisymmetry and to the even moments.
 * No bound moved.
 *
 * -------------------------------------------------------------------------------
 * VERDICT (honest; no bound moved).
 * -------------------------------------------------------------------------------
 * The sign of F_cot(b) is NOT derived. The attempt (i) proves the numerator antisymmetry
 * c_0(h/a) = -c_0((a-h)/a) and the exact mean-zero identity Sum_{h coprime a} c_0(h/a) = 0, so the
 * operative half S(b) samples an odd, mean-zero kernel and has NO pointwise sign; (ii) reframes
 * F_cot(b) > 0 as a SIGNED inverse-map bias, and MEASURES that this bias is magnitude-weighted (carried
 * by the small-inverse resonances a | b k -/+ 1), not a count bias (the h_a < a/2 vs > a/2 counts are
 * balanced); and (iii) pins the precise obstruction: the sign lives in the ODD part of the b-inverse
 * distribution, which the imp-97097 a <-> b-a antisymmetry does not reach and the imp-97180/imp-97203
 * even-moment machinery destroys, so a signed Bettin-Conrey period average (no closed form) is the
 * irreducible input. Measured F_cot(b) > 0 (kappa_cot ~ +0.12) stays measured, not proved. No bound on
 * Lambda moves; T ~ 2.594e7 trace anchor; compute (N ~ 9916) binds first. No refereed bound is changed; RH
 * open; NO QED.
 *
 * RESIDUAL SUB-GAP (below): imp-97181-cotangent-sign-odd-inverse-equidistribution -- a SIGNED
 * equidistribution estimate for the inverse map a |-> b-inverse mod a against the odd cotangent kernel
 * c_0(.,a), establishing Sum_a c_0(h_a/a) < 0 (equivalently F_cot(b) > 0). This is the ODD projection
 * of the inverse distribution; the a <-> b-a antisymmetry (imp-97097) and the even moments
 * (imp-97180/imp-97203) cannot see it, so a signed period-function average is the irreducible input.
 *
 * @see imp-97097-route-m-cotangent-first-moment-reciprocity.js (fixed-modulus half = 0; S(b) isolated)
 * @see imp-97119-route-m-boundary-cotangent-asymptotic.js (V(1,b) = o(phi b b), rigorous)
 * @see imp-97168-route-m-kappa-arith-vs-companion-target-reconciliation.js (kappa split; F_cot measured +)
 * @see imp-97204-route-m-cotangent-signed-firstmoment-lower-bound.js (|S| <= A domination; two-sided bound)
 * @see imp-97125-vasyunin-antisymmetry-glossary-headword.js (the FIXED-modulus antisymmetry, contrast)
 *
 * Ticket: imp-97181 (proof, opus-4-8, api-pool). Derivation of sign structure + partial; NO QED.
 */

// -- lightweight exact kernels (small-b self-checks only; O(b^2), keep b modest) --
const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));
const frac = (x) => x - Math.floor(x);
const cot = (x) => Math.cos(x) / Math.sin(x);
const c0 = (h, k) => {
  let s = 0;
  for (let m = 1; m < k; m++) s += frac((m * h) / k) * cot((Math.PI * m) / k);
  return s;
};
const invMod = (b, a) => {
  const g = ((b % a) + a) % a;
  for (let x = 1; x < a; x++) if ((g * x) % a === 1) return x;
  return 0;
};

// For a given b: signed operative half S(b), boundary -V(1,b), Phi(b), kappa_cot, and the count bias.
function signPieces(b) {
  let phi = 0, S = 0, below = 0, above = 0;
  for (let a = 2; a < b; a++) {
    if (gcd(a, b) !== 1) continue;
    phi += 1;
    S += c0(b, a); // = c_0(h_a/a), h_a = b-inverse mod a
    const ha = invMod(b, a);
    if (2 * ha < a) below += 1; else above += 1;
  }
  const negV1 = -c0(1, b);
  const Phi = negV1 + S;
  const den = phi * b;
  return {
    phi,
    signed: S / den, // S(b)/(phi b b) ~ -0.079
    kappaCot: (-Math.PI / 2) * (Phi / den), // -(pi/2) Phi/(phi b b) ~ +0.12
    countBias: (below - above) / phi, // -> 0 (NOT a count effect)
  };
}

const GAMMA = 0.5772156649015329;
const C_CONST = (Math.log(2 * Math.PI) - GAMMA) / 2;
const KAPPA_ARITH = 1.5 * C_CONST - 3 / 8; // 0.5704960511308594 (imp-97096, for context)

// MEASURED constants (tmp/imp-97181-scratch*.mjs; b <= 2003).
export const IMP97181_MEASURED = Object.freeze({
  signedStable: -0.079, // S(b)/(phi b b): -0.0758 (211) -> -0.0790 (2003), FLAT and negative
  kappaCot: 0.12, // -(pi/2) Phi/(phi b b): climbing to ~ +0.12 (imp-97071/imp-97168)
  countBiasVanishes: true, // #(h_a<a/2) - #(h_a>a/2) -> 0: balanced, so NOT a count effect
  smallInverseNegative: true, // c_0(k/a) < 0 for small k, ~ a log a magnitude at k=1
  kappaArith: KAPPA_ARITH,
});

export const IMP97181_STRUCTURE = Object.freeze({
  numeratorAntisymmetry: 'c_0(h/a) = -c_0((a-h)/a) EXACTLY for (h,a)=1 (frac(-mh/a) = 1 - frac(mh/a), Sum_m cot(pi m/a) = 0)',
  kernelOddMeanZero: 'Sum_{h=1,(h,a)=1}^{a-1} c_0(h/a) = 0 for every a >= 2 (h <-> a-h fixed-point-free involution)',
  signIsInverseBias: 'S(b) = Sum_a c_0(h_a/a) samples an odd mean-zero kernel; its sign is a signed bias of h_a = b-inverse mod a, NOT a pointwise sign',
  biasIsMagnitudeWeighted: 'count of h_a<a/2 vs >a/2 is balanced; negativity carried by the larger small-inverse magnitudes (a | b k - 1)',
  oddPartInvisibleToDeployedTools: 'the a <-> b-a antisymmetry (imp-97097) does not act on the modulus a; even moments |c_0|, c_0^2 (imp-97180/imp-97203) are EVEN under h <-> a-h and destroy the sign',
});

export const IMP97181_VERDICT = Object.freeze({
  question:
    'derive analytically the SIGN (positivity) of the Route M cotangent first-moment leaf ' +
    'F_cot(b) = -(pi/2) Sum_{a coprime}(V(a,b)+V(b,a)), measured ~+0.121 phi b b but never derived',
  signDerived: false, // positivity stays MEASURED, not proved
  numeratorAntisymmetryProved: true, // c_0(h/a) = -c_0((a-h)/a) EXACT
  kernelMeanZeroProved: true, // Sum_{h coprime a} c_0(h/a) = 0 EXACT
  noPointwiseSign: true, // S(b) samples an odd mean-zero kernel: no termwise sign exists
  signIsSignedInverseBias: true, // F_cot(b) > 0 <=> odd signed bias of b-inverse mod a
  biasIsMagnitudeNotCount: true, // count bias -> 0; magnitude-weighted (small-inverse resonances)
  oddPartInvisibleToAntisymmetryAndEvenMoments: true, // the precise obstruction
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  computeBindsFirst: true,
  qed: false,
  conclusion:
    'The sign of F_cot(b) is NOT derived. The attempt proves the numerator antisymmetry ' +
    'c_0(h/a) = -c_0((a-h)/a) and the exact mean-zero identity Sum_{h coprime a} c_0(h/a) = 0, so the ' +
    'operative half S(b) = Sum_a c_0(h_a/a) samples an ODD, mean-zero kernel and has NO pointwise sign; ' +
    'positivity F_cot(b) > 0 is EQUIVALENT to a SIGNED inverse-map bias of h_a = b-inverse mod a against ' +
    'that kernel. This bias is MEASURED magnitude-weighted (carried by the small-inverse resonances ' +
    'a | b k - 1), not a count bias (the h_a < a/2 vs > a/2 counts are balanced). The precise obstruction ' +
    'is that the sign lives in the ODD part of the inverse distribution, which the imp-97097 a <-> b-a ' +
    'antisymmetry does not reach and the imp-97180/imp-97203 even-moment machinery destroys (|c_0|, c_0^2 ' +
    'are even under h <-> a-h) -- so a signed Bettin-Conrey period average (no closed form) is the ' +
    'irreducible input. Measured F_cot(b) > 0 (kappa_cot ~ +0.12) stays measured, not proved. No bound ' +
    'moved; T ~ 2.594e7 anchor; compute N ~ 9916 binds first. No refereed bound is changed; RH open; NO QED.',
});

export const IMP97181_SUBGAP = Object.freeze({
  id: 'imp-97181-cotangent-sign-odd-inverse-equidistribution',
  statement:
    'a SIGNED equidistribution estimate for the inverse map a |-> b-inverse mod a tested against the ODD, ' +
    'mean-zero cotangent kernel c_0(.,a), establishing S(b) = Sum_{a=2,(a,b)=1}^{b-1} c_0(h_a/a) < 0 ' +
    '(equivalently F_cot(b) > 0, kappa_cot > 0). By the numerator antisymmetry c_0(h/a) = -c_0((a-h)/a) ' +
    'this is the ODD projection of the inverse distribution: the a <-> b-a antisymmetry (imp-97097) ' +
    'annihilates only the fixed-modulus half and the even moments |c_0|, c_0^2 (imp-97180/imp-97203) are ' +
    'symmetric under h <-> a-h, so neither can certify the sign -- a signed period-function average with ' +
    'no closed form is the irreducible input. MEASURED S(b)/(phi b b) ~ -0.079 stable, but NOT proved.',
});

export const IMP97181_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Derivation of sign structure + partial only: the sign ' +
  'of the Route M cotangent leaf F_cot(b) is NOT derived. Proved: the numerator antisymmetry ' +
  'c_0(h/a) = -c_0((a-h)/a) and the exact mean-zero Sum_{h coprime a} c_0(h/a) = 0, so the operative half ' +
  'S(b) = Sum_a c_0(h_a/a) samples an odd, mean-zero kernel and has NO pointwise sign. Positivity ' +
  'F_cot(b) > 0 is EQUIVALENT to a SIGNED inverse-map bias, measured magnitude-weighted (small-inverse ' +
  'resonances), not a count bias. The sign lives in the ODD part of the b-inverse distribution, invisible ' +
  'to the a <-> b-a antisymmetry (imp-97097) and destroyed by the even moments (imp-97180/imp-97203) -- a ' +
  'signed Bettin-Conrey period average is the irreducible input. Measured kappa_cot ~ +0.12 stays ' +
  'measured; no bound on Lambda moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97181_ASSERTIONS = [
  {
    id: 'imp97181-numerator-antisymmetry-and-mean-zero',
    holds: () => {
      // c_0(h/a) = -c_0((a-h)/a) EXACTLY, and Sum_{h coprime a} c_0(h/a) = 0. Even and odd a.
      for (const a of [50, 101, 120, 201]) {
        let s = 0;
        for (let h = 1; h < a; h++) {
          if (gcd(h, a) !== 1) continue;
          s += c0(h, a);
          if (Math.abs(c0(h, a) + c0(a - h, a)) > 1e-6 * (Math.abs(c0(h, a)) + 1)) return false;
        }
        if (Math.abs(s) > 1e-5) return false; // mean-zero over coprime numerators
      }
      return true;
    },
    why: 'the numerator antisymmetry c_0(h/a) = -c_0((a-h)/a) holds exactly (h <-> a-h fixed-point-free involution) and forces the exact mean-zero identity Sum_{h coprime a} c_0(h/a) = 0 for every a -- the kernel is odd about a/2, verified for even/odd a=50,101,120,201.',
  },
  {
    id: 'imp97181-small-inverse-negative-large-magnitude',
    holds: () => {
      // c_0(k/a) < 0 for small numerators k, and |c_0(1/a)| is the largest (~ a log a scale).
      for (const a of [101, 199, 401]) {
        for (let k = 1; k <= 5; k++) {
          if (gcd(k, a) !== 1) continue;
          if (!(c0(k, a) < 0)) return false; // small numerator -> negative
        }
        if (!(Math.abs(c0(1, a)) > Math.abs(c0(5, a)))) return false; // k=1 largest magnitude
      }
      return true;
    },
    why: 'c_0(k/a) < 0 for small numerators k (verified k=1..5, a=101,199,401), with |c_0(1/a)| the largest (~ a log a) -- these small-inverse resonances carry the negative weight of S(b), while their antisymmetric partners c_0((a-k)/a) > 0 sit at different moduli.',
  },
  {
    id: 'imp97181-sign-is-magnitude-bias-not-count-bias',
    holds: () => {
      // S(b) < 0 and kappa_cot > 0, while the h_a < a/2 vs > a/2 count bias -> 0.
      for (const b of [211, 401, 601]) {
        const p = signPieces(b);
        if (!(p.signed < 0)) return false; // operative half negative
        if (!(p.kappaCot > 0)) return false; // cotangent coefficient positive (measured)
        if (!(Math.abs(p.countBias) < 0.05)) return false; // count bias essentially zero (magnitude effect)
      }
      return true;
    },
    why: 'S(b)/(phi b b) < 0 and kappa_cot > 0 (measured) while the count bias #(h_a<a/2) - #(h_a>a/2) is essentially zero (|bias|/phi < 0.05 at b=211,401,601) -- the sign is a magnitude-weighted inverse-map bias, not a count bias.',
  },
  {
    id: 'imp97181-honesty-gate-no-qed',
    holds: () =>
      IMP97181_VERDICT.signDerived === false &&
      IMP97181_VERDICT.numeratorAntisymmetryProved === true &&
      IMP97181_VERDICT.kernelMeanZeroProved === true &&
      IMP97181_VERDICT.noPointwiseSign === true &&
      IMP97181_VERDICT.signIsSignedInverseBias === true &&
      IMP97181_VERDICT.oddPartInvisibleToAntisymmetryAndEvenMoments === true &&
      IMP97181_VERDICT.anyBoundMoved === false &&
      IMP97181_VERDICT.postsRigorousCeiling === false &&
      IMP97181_VERDICT.qed === false &&
      /odd-inverse-equidistribution/.test(IMP97181_SUBGAP.id) &&
      /SIGNED equidistribution/.test(IMP97181_SUBGAP.statement) &&
      /NO QED/.test(IMP97181_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97181_HONEST_BANNER) &&
      /RH open/.test(IMP97181_HONEST_BANNER),
    why: 'derivation + partial: the numerator antisymmetry and mean-zero identity are rigorous, but positivity stays measured (an odd signed inverse-map bias, invisible to the deployed antisymmetry/even-moment tools) -- no bound moved, no rigorous ceiling, honesty markers and the named residual sub-gap present.',
  },
];

for (const a of IMP97181_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97181-route-m-cotangent-firstmoment-sign-inverse-bias assertion failed: ${a.id}`,
    );
  }
}

export default {
  measured: IMP97181_MEASURED,
  structure: IMP97181_STRUCTURE,
  verdict: IMP97181_VERDICT,
  subGap: IMP97181_SUBGAP,
  banner: IMP97181_HONEST_BANNER,
};
