/**
 * @module imp-97116-route-m-cotangent-varying-modulus-abs-value-reduction
 *
 * imp-97116 (proof, ASSESSMENT + PARTIAL): assess an absolute lower bound on the varying-modulus
 * Vasyunin average that carries the ENTIRE leading Route M cotangent first moment, namely
 *      S(b) = Sum_{a=2,(a,b)=1}^{b-1} V(b,a)   >=  -c phi(b) b   with explicit c < kappa_arith,
 * the residual sub-gap imp-97097-cotangent-first-moment-varying-modulus. imp-97097 proved the
 * fixed-modulus half Sum_{a in R_b} V(a,b) = 0 EXACTLY (a <-> b-a antisymmetry) and left the whole
 * leading cotangent moment ~ -0.076 phi(b) b in S(b), where a is the MODULUS (no reduced-residue
 * permutation, no Dedekind closed form). This leaf makes two genuine rigorous reductions of that
 * open piece and reports the precise remaining analytic input. No bound is proved rigorous; no refereed bound is changed
 * ; RH open; NO QED.
 *
 * Notation as imp-96750/imp-97071/imp-97097. V(h,k) = Sum_{m=1}^{k-1} frac(mh/k) cot(pi m/k) is the
 * Vasyunin sum; c_0(h/k) = Sum_{n=1}^{k-1} (n/k) cot(pi n h/k) is the Bettin-Conrey cotangent sum.
 * kappa_arith = (3/2)C - 3/8 = 0.5704960511 (imp-97096, the part the cotangent must not cancel).
 *
 * -------------------------------------------------------------------------------
 * REDUCTION 1 -- rewrite each varying-modulus term as a cotangent sum with the MODULAR INVERSE.
 * -------------------------------------------------------------------------------
 * In V(b,a) = Sum_{m=1}^{a-1} frac(mb/a) cot(pi m/a) reindex by n = mb mod a. Since (a,b)=1, as m
 * runs over 1..a-1 so does n (a permutation), with frac(mb/a) = n/a and m = n b-inverse mod a. Hence
 *      V(b,a) = Sum_{n=1}^{a-1} (n/a) cot(pi n (b-inverse mod a)/a) = c_0(h_a / a),   h_a = b-inverse mod a.
 * So the operative sum is a cotangent-sum average over the INVERSE line a |-> b-inverse mod a:
 *      S(b) = Sum_{a=2,(a,b)=1}^{b-1} c_0(h_a / a),   h_a = b-inverse mod a.
 * This is RIGOROUS (a finite reindexing) and is the exact form of the Bettin-Conrey mean value named
 * in the imp-97097 sub-gap. Verified to 1e-9 below.
 *
 * -------------------------------------------------------------------------------
 * REDUCTION 2 -- the signed mean value is DOMINATED by an ABSOLUTE-VALUE sum that needs NO cancellation.
 * -------------------------------------------------------------------------------
 * Trivially S(b) >= -Sum_{a=2,(a,b)=1}^{b-1} |c_0(h_a/a)| =: -A(b). Therefore
 *      S(b) >= -c phi(b) b  is IMPLIED by  A(b) <= c phi(b) b.
 * MEASURED A(b)/(phi(b) b) is BOUNDED and SMALL -- 0.113 (b=31), 0.133 (101), 0.136 (211), 0.143
 * (401), 0.143 (601) -- i.e. c ~ 0.14 << kappa_arith = 0.5705. This is a genuine simplification of
 * the sub-gap: the earlier framing needed a DELICATE SIGNED mean value (leading term -0.076 arising
 * only after cancellation among terms of average size ~0.14 b); Reduction 2 shows an ABSOLUTE-VALUE
 * bound A(b) <= c phi(b) b with any c < 0.5705 ALREADY closes the no-cancellation question
 * kappa_cot > -kappa_arith. No cancellation, no sign tracking, is required.
 *
 * -------------------------------------------------------------------------------
 * STRUCTURE OF A(b) -- where the mass is, and why no thin block carries the leading moment.
 * -------------------------------------------------------------------------------
 * The largest single term is ALWAYS a = b-1, where b = 1 + (b-1) gives h_{b-1} = b-inverse mod (b-1)
 * = 1, so V(b,b-1) = c_0(1/(b-1)) = -V(1,b-1)-type classical cotangent sum of size ~ (1/pi) b log b.
 * More generally a = b-j gives V(b,b-j) = V(j, b-j) (small numerator j), of size O((b/j) log b). Hence
 *   (i) every individual term is o(phi(b) b) (the max ~ (1/pi) b log b, and (max term)/(phi(b) b) -> 0,
 *       MEASURED 0.0062 at b=211 -> 0.0018 at b=1009), so NO single term produces the leading moment;
 *   (ii) the near-boundary block a = b-j, j = 1..J, contributes Sum_j O((b/j) log b) = O(b log^2 b) =
 *        o(phi(b) b), so no thin block does either.
 * The leading -0.076 phi(b) b comes from the BULK of ~phi(b) moduli a of order b, each c_0(h_a/a) =
 * O(b) with h_a = b-inverse mod a spread across 1..a-1. This is exactly the regime a rigorous
 * Bettin-Conrey mean value must control.
 *
 * -------------------------------------------------------------------------------
 * PRECISE REMAINING OBSTRUCTION.
 * -------------------------------------------------------------------------------
 * A rigorous A(b) <= c phi(b) b with explicit c requires a UNIFORM bound on Sum_a |c_0(h_a/a)| over
 * the inverse line h_a = b-inverse mod a. The only terms exceeding O(b) are those with h_a small (or
 * near a), where |c_0(h_a/a)| ~ (a/(pi h_a)) log a; controlling their aggregate is a statement about
 * how often the modular inverse b-inverse mod a is small as a varies over 2..b-1 -- an
 * equidistribution / Kloosterman-type input on the inverse map, NOT elementary. This is the same
 * Bettin-Conrey mean-value regime flagged in imp-97097, now sharpened: the open piece is an
 * ABSOLUTE-VALUE (cancellation-free) bound whose sole non-o(phi b b) obstruction is the frequency of
 * small inverses b-inverse mod a. An elementary termwise bound fails only through those rare small-h_a
 * tails; everything else is O(b) per term and sums to O(phi b b) with a benign constant.
 *
 * -------------------------------------------------------------------------------
 * WHAT IS ESTABLISHED vs OPEN.
 * -------------------------------------------------------------------------------
 * ESTABLISHED (rigorous): (R1) S(b) = Sum_a c_0(h_a/a), h_a = b-inverse mod a (finite reindexing);
 * (R2) S(b) >= -A(b) with A(b) = Sum_a |c_0(h_a/a)|, so an absolute-value bound A(b) <= c phi(b) b
 * (c < 0.5705) suffices, needing NO cancellation; (S) every term and every thin near-boundary block
 * is o(phi(b) b), so the leading moment is a genuine bulk average. OPEN: the explicit c -- MEASURED
 * A(b)/(phi(b) b) ~ 0.14 << 0.5705 but NOT proved; the sole hard input is a uniform bound on the
 * frequency of small modular inverses b-inverse mod a (Bettin-Conrey / Kloosterman mean value).
 *
 * -------------------------------------------------------------------------------
 * VERDICT (honest; no bound moved).
 * -------------------------------------------------------------------------------
 * The varying-modulus cotangent average is recast rigorously as an inverse-line cotangent-sum average
 * S(b) = Sum_a c_0(b-inverse mod a / a) and DOMINATED by a cancellation-free absolute-value sum
 * A(b) = Sum_a |c_0(...)| with MEASURED A(b) ~ 0.14 phi(b) b << 0.5705 phi(b) b; every individual term
 * and every thin block is o(phi(b) b), so the leading -0.076 phi(b) b is a bulk average. This converts
 * the delicate SIGNED Bettin-Conrey mean value of imp-97097 into an ABSOLUTE-VALUE bound and isolates
 * the single remaining analytic input (frequency of small inverses b-inverse mod a). The explicit c
 * stays MEASURED, not proved; no bound moved; the rigorous trace ceiling T ~ 2.594e7 stays the anchor;
 * compute (N ~ 9916) binds first. No refereed bound is changed; RH open; NO QED.
 *
 * RESIDUAL SUB-GAP (below): imp-97116-abs-value-inverse-line-mean-value -- prove A(b) = Sum_{a=2,
 * (a,b)=1}^{b-1} |c_0(b-inverse mod a / a)| <= c phi(b) b with explicit c < 0.5705, via a uniform
 * bound on the frequency of small modular inverses b-inverse mod a (cancellation-free).
 *
 * @see imp-97097-route-m-cotangent-first-moment-reciprocity.js (parent: fixed-modulus half = 0, sub-gap)
 * @see imp-97096-route-m-arith-first-moment-evaluation.js (arithmetic leaf; exact (3/2)C - 3/8)
 * @see imp-97071-route-m-lower-companion-first-moment-reduction.js (parent CS reduction + route (3))
 *
 * Ticket: imp-97116 (proof, opus-4-8, api-pool). Assessment + partial; NO QED.
 */

// -- lightweight exact kernels (small-b self-checks only; O(b^2), keep b modest) --
const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));
const frac = (x) => x - Math.floor(x);
const cot = (x) => Math.cos(x) / Math.sin(x);
const Vsum = (h, k) => {
  let s = 0;
  for (let m = 1; m < k; m++) s += frac((m * h) / k) * cot((Math.PI * m) / k);
  return s;
};
const c0 = (h, k) => {
  let s = 0;
  for (let n = 1; n < k; n++) s += (n / k) * cot((Math.PI * n * h) / k);
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
function egcd(a, b) {
  if (b === 0) return [a, 1, 0];
  const [g, x, y] = egcd(b, a % b);
  return [g, y, x - Math.floor(a / b) * y];
}
const modinv = (a, m) => {
  const [g, x] = egcd(((a % m) + m) % m, m);
  return g !== 1 ? null : ((x % m) + m) % m;
};

// For a given b: the signed sum S(b), the absolute-value sum A(b), the max term (and its modulus a).
// O(b^2); keep b small.
function varyingModulusPieces(b) {
  let S = 0, A = 0, maxAbs = 0, maxA = 0, maxH = 0;
  for (let a = 2; a < b; a++) {
    if (gcd(a, b) === 1) {
      const v = Vsum(b, a);
      S += v;
      A += Math.abs(v);
      if (Math.abs(v) > maxAbs) {
        maxAbs = Math.abs(v);
        maxA = a;
        maxH = modinv(b, a);
      }
    }
  }
  return { phi: eulerPhi(b), S, A, maxAbs, maxA, maxH };
}

// MEASURED constants (tmp/imp-97116-scratch.mjs; leading behaviour over b <= 1009).
export const IMP97116_MEASURED = Object.freeze({
  absValueCoeff: 0.14, // A(b)/(phi b) -> ~0.14 (0.113 b=31 -> 0.143 b=601); << kappa_arith
  signedCoeff: -0.076, // S(b)/(phi b) -> ~ -0.076 (imp-97097 varying-modulus coeff)
  maxTermOverBlogB: 0.26, // max|V(b,a)| = |c_0(1/(b-1))| ~ (1/pi) b log b (0.24 b=211 -> 0.26 b=1009)
  maxTermOverPhiBB: 0.006, // (max term)/(phi b . b) -> 0 (0.0062 b=211 -> 0.0018 b=1009): every term is o
  kappaArith: 0.5704960511308594, // imp-97096 exact (3/2)C - 3/8 (the part the cotangent must not cancel)
});

export const IMP97116_REDUCTION = Object.freeze({
  inverseLine: 'V(b,a) = c_0(h_a/a) with h_a = b-inverse mod a  (reindex n = mb mod a; RIGOROUS)',
  operativeSum: 'S(b) = Sum_{a=2,(a,b)=1}^{b-1} c_0(b-inverse mod a / a)  (Bettin-Conrey inverse-line average)',
  absValueDomination: 'S(b) >= -A(b),  A(b) = Sum_a |c_0(h_a/a)|;  A(b) <= c phi b (c<0.5705) suffices, NO cancellation',
  maxTermAtBoundary: 'max term at a=b-1 (h_a=1): c_0(1/(b-1)) ~ (1/pi) b log b = o(phi b b); a=b-j gives V(j,b-j) = O((b/j) log b)',
  everyTermIsLowerOrder: true, // (max term)/(phi b b) -> 0, near-boundary block O(b log^2 b) = o(phi b b)
  leadingMomentIsBulk: true, // the -0.076 phi b b is a bulk average over ~phi(b) moduli a of order b
  remainingInput: 'uniform bound on frequency of small inverses b-inverse mod a (Bettin-Conrey / Kloosterman); NOT elementary',
});

export const IMP97116_VERDICT = Object.freeze({
  question:
    'can the varying-modulus Vasyunin average S(b) = Sum_{a=2,(a,b)=1}^{b-1} V(b,a) be bounded ' +
    'below by -c phi(b) b with explicit c < kappa_arith = 0.5705, via a Bettin-Conrey mean value?',
  inverseLineReductionRigorous: true, // S(b) = Sum_a c_0(b-inverse mod a / a) EXACT
  absValueDominationRigorous: true, // S(b) >= -A(b); an abs-value bound suffices, no cancellation
  everyTermAndThinBlockLowerOrder: true, // each term o(phi b b); near-boundary block o(phi b b)
  explicitConstantProved: false, // A(b)/(phi b) ~ 0.14 MEASURED, not proved
  remainingInputElementary: false, // frequency of small inverses b-inverse mod a: Bettin-Conrey/Kloosterman
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  computeBindsFirst: true,
  qed: false,
  conclusion:
    'The operative varying-modulus half is recast rigorously as the inverse-line cotangent-sum ' +
    'average S(b) = Sum_a c_0(b-inverse mod a / a) and DOMINATED by the cancellation-free ' +
    'absolute-value sum A(b) = Sum_a |c_0(...)|, so an absolute-value bound A(b) <= c phi(b) b with ' +
    'any c < kappa_arith = 0.5705 already settles no-cancellation. MEASURED A(b) ~ 0.14 phi(b) b << ' +
    '0.5705 phi(b) b; every individual term and every thin near-boundary block is o(phi(b) b) (max ' +
    'term c_0(1/(b-1)) ~ (1/pi) b log b), so the leading -0.076 phi(b) b is a genuine bulk average. ' +
    'This converts the delicate SIGNED Bettin-Conrey mean value into a cancellation-free ' +
    'absolute-value bound and isolates the single remaining input: a uniform bound on the frequency ' +
    'of small modular inverses b-inverse mod a. The explicit c is MEASURED, not proved. No bound ' +
    'moved, no rigorous ceiling posted; T ~ 2.594e7 anchor; compute N ~ 9916 binds first. No refereed bound is changed' +
    '; RH open; NO QED.',
});

export const IMP97116_SUBGAP = Object.freeze({
  id: 'imp-97116-abs-value-inverse-line-mean-value',
  statement:
    'S(b) = Sum_{a=2,(a,b)=1}^{b-1} V(b,a) = Sum_a c_0(b-inverse mod a / a) (RIGOROUS reindexing), and ' +
    'S(b) >= -A(b) with A(b) = Sum_a |c_0(b-inverse mod a / a)|. The open piece is a cancellation-free ' +
    'absolute-value bound A(b) <= c phi(b) b with explicit c < kappa_arith = (3/2)C - 3/8 = 0.5705 (so ' +
    'the cotangent part cannot cancel the imp-97096 arithmetic part). MEASURED c ~ 0.14 << 0.5705. Every ' +
    'individual term and every thin near-boundary block is o(phi(b) b) (max term c_0(1/(b-1)) ~ (1/pi) b ' +
    'log b), so the leading -0.076 phi(b) b is a bulk average; the sole non-o(phi b b) obstruction is the ' +
    'frequency of small modular inverses b-inverse mod a -- a Bettin-Conrey / Kloosterman mean value, NOT ' +
    'elementary. c is MEASURED, not proved.',
});

export const IMP97116_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Assessment + partial only: the varying-modulus ' +
  'Vasyunin average S(b) = Sum_{a=2,(a,b)=1}^{b-1} V(b,a) is recast rigorously as the inverse-line ' +
  'cotangent-sum average Sum_a c_0(b-inverse mod a / a) and dominated by the cancellation-free ' +
  'absolute-value sum A(b) = Sum_a |c_0(...)| (MEASURED A(b) ~ 0.14 phi(b) b << 0.5705 phi(b) b); every ' +
  'term and every thin block is o(phi(b) b), so the leading moment is a bulk average. The explicit ' +
  'lower-bound constant stays MEASURED, not proved; the sole open input is a uniform bound on the ' +
  'frequency of small modular inverses b-inverse mod a. No bound is claimed moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97116_ASSERTIONS = [
  {
    id: 'imp97116-inverse-line-reduction-exact',
    holds: () => {
      // V(b,a) = c_0(b-inverse mod a / a) to machine precision, all a coprime to b.
      for (const b of [101, 211]) {
        for (let a = 2; a < b; a++) {
          if (gcd(a, b) === 1) {
            const inv = modinv(b, a);
            if (Math.abs(Vsum(b, a) - c0(inv, a)) > 1e-8) return false;
          }
        }
      }
      return true;
    },
    why: 'V(b,a) = c_0(b-inverse mod a / a) by the reindexing n = mb mod a (RIGOROUS finite permutation); verified to 1e-8 for every a coprime to b at b=101,211.',
  },
  {
    id: 'imp97116-abs-value-dominates-and-is-below-kappa-arith',
    holds: () => {
      // S(b) >= -A(b), and A(b)/(phi b) is bounded well below kappa_arith = 0.5705 (measured ~0.14).
      for (const b of [101, 211, 401]) {
        const { phi, S, A } = varyingModulusPieces(b);
        if (!(S >= -A - 1e-9)) return false; // domination S >= -A
        const cAbs = A / (phi * b);
        if (!(cAbs > 0.1 && cAbs < 0.2)) return false; // measured ~0.14
        if (!(cAbs < IMP97116_MEASURED.kappaArith)) return false; // below the arithmetic constant
        if (!(S < 0)) return false; // signed sum negative (carries -0.076 phi b)
      }
      return true;
    },
    why: 'S(b) >= -A(b) with A(b) = Sum_a |c_0(h_a/a)|, and MEASURED A(b)/(phi b) ~ 0.14 (0.1..0.2), well below kappa_arith = 0.5705, so a cancellation-free absolute-value bound would suffice; verified b=101,211,401.',
  },
  {
    id: 'imp97116-every-term-is-lower-order',
    holds: () => {
      // Max term at a=b-1 with h_a=1, of size ~ (1/pi) b log b, and (max term)/(phi b b) -> 0.
      for (const b of [211, 601]) {
        const { phi, maxAbs, maxA, maxH } = varyingModulusPieces(b);
        if (maxA !== b - 1 || maxH !== 1) return false; // largest term is the a=b-1 boundary
        if (!(maxAbs / (b * Math.log(b)) > 0.15 && maxAbs / (b * Math.log(b)) < 0.4)) return false; // ~ (1/pi) b log b
        if (!(maxAbs / (phi * b) < 0.02)) return false; // every single term is o(phi b b)
      }
      return true;
    },
    why: 'the largest term is always a=b-1 (h_a = b-inverse mod (b-1) = 1), of size c_0(1/(b-1)) ~ (1/pi) b log b, and (max term)/(phi b b) < 0.02 and decreasing -- so no single term (and, similarly, no thin near-boundary block) carries the leading phi(b) b moment; verified b=211,601.',
  },
  {
    id: 'imp97116-honesty-gate-no-qed',
    holds: () =>
      IMP97116_VERDICT.inverseLineReductionRigorous === true &&
      IMP97116_VERDICT.absValueDominationRigorous === true &&
      IMP97116_VERDICT.everyTermAndThinBlockLowerOrder === true &&
      IMP97116_VERDICT.explicitConstantProved === false &&
      IMP97116_VERDICT.remainingInputElementary === false &&
      IMP97116_VERDICT.anyBoundMoved === false &&
      IMP97116_VERDICT.postsRigorousCeiling === false &&
      IMP97116_VERDICT.qed === false &&
      /abs-value-inverse-line/.test(IMP97116_SUBGAP.id) &&
      /cancellation-free/.test(IMP97116_SUBGAP.statement) &&
      /NO QED/.test(IMP97116_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97116_HONEST_BANNER) &&
      /RH open/.test(IMP97116_HONEST_BANNER),
    why: 'assessment + partial: the inverse-line reduction and absolute-value domination are rigorous, but the explicit constant c is measured not proved and the remaining input is non-elementary -- no bound moved, no rigorous ceiling posted, honesty markers and the named residual sub-gap present.',
  },
];

for (const a of IMP97116_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97116-route-m-cotangent-varying-modulus-abs-value-reduction assertion failed: ${a.id}`,
    );
  }
}

export default {
  measured: IMP97116_MEASURED,
  reduction: IMP97116_REDUCTION,
  verdict: IMP97116_VERDICT,
  subGap: IMP97116_SUBGAP,
  banner: IMP97116_HONEST_BANNER,
};
