/**
 * @module imp-97247-route-m-absdownside-divisor-count-reduction
 *
 * imp-97247 (proof, ATTEMPT -> HONEST PARTIAL, no bound moved): attempt the imp-97116 residual
 * sub-gap -- a uniform cancellation-free bound
 *      A(b) = Sum_{a=2,(a,b)=1}^{b-1} |c_0(h_a / a)|  <=  c phi(b) b,   h_a = b-inverse mod a,
 * with explicit c < kappa_arith = (3/2)C - 3/8 = 0.5704960511 -- now that imp-97188 confirms the
 * measured coefficient plateaus at ~0.147-0.148. imp-97116 named the sole remaining input as "the
 * frequency of small modular inverses b-inverse mod a ... an equidistribution / Kloosterman-type input
 * ... NOT elementary." This leaf attacks exactly that frequency and reports two rigorous results plus a
 * correction. No bound is proved rigorous; no refereed bound is changed; RH open; NO QED.
 *
 * Notation as imp-97116/imp-97188. V(h,k) = Sum_{m=1}^{k-1} frac(mh/k) cot(pi m/k) is the Vasyunin sum;
 * c_0(h/k) = Sum_{n=1}^{k-1} (n/k) cot(pi n h/k) is the Bettin-Conrey cotangent sum; by the imp-97116
 * reindexing V(b,a) = c_0(h_a/a) with h_a = b-inverse mod a (RIGOROUS finite permutation).
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 (RIGOROUS) -- the "frequency of small inverses" IS elementary: a divisor count.
 * -------------------------------------------------------------------------------
 * For gcd(a,b)=1 the inverse h_a = b-inverse mod a satisfies, by definition, b h_a ≡ 1 (mod a), i.e.
 *      h_a = h   <=>   a | (b h - 1).
 * Therefore the set of moduli with a SMALL inverse is exactly a union of divisor sets:
 *      { a in [2, b-1] : (a,b)=1, h_a <= H }  =  { a in [2, b-1] : a | (b h - 1) for some 1 <= h <= H }.
 * (Divisors of b h - 1 are automatically coprime to b.) Hence the count is
 *      #{ a : h_a <= H }  <=  Sum_{h=1}^{H} d(b h - 1),   d = number-of-divisors,
 * a completely ELEMENTARY divisor sum -- no Kloosterman / equidistribution input is required to COUNT
 * the small inverses. The measured over-count factor of the divisor-sum bound is benign (~1.1-1.9x over
 * the true count on the tested range). This settles, elementarily, the frequency question imp-97116
 * flagged as non-elementary: it is a divisor sum, standard-averaged as Sum_{h<=H} d(bh-1) = O(H log b)
 * on average by the Dirichlet divisor bound applied to the arithmetic progression b h - 1.
 *
 * -------------------------------------------------------------------------------
 * RESULT 2 (RIGOROUS) -- the LARGE terms are governed by small RESIDUE b mod a, not small inverse.
 * -------------------------------------------------------------------------------
 * There is a second, DUAL descriptor. Since V(b,a) = V(b mod a, a) (frac(m b / a) depends only on
 * b mod a), a term is large when the numerator r = b mod a is small: V(r,a) ~ (a / (pi r)) log a. And
 *      b mod a = r   <=>   a | (b - r)   (for a > r),
 * so { a : b mod a <= R } = { a | (b - r), a > r, 1 <= r <= R } is ALSO an elementary divisor set,
 * with count <= Sum_{r=1}^{R} d(b - r). MEASUREMENT then CORRECTS the imp-97116 framing: imp-97116
 * asserted "the only terms exceeding O(b) are those with h_a small (or near a)". This is INCOMPLETE.
 * The a = b - 2 term has residue b mod a = 2 (small) but inverse h_a = 2-inverse mod a = (a+1)/2 ~ a/2
 * (NOT small, NOT near a), yet |c_0(h_a/a)| / a ~ (log a)/(2 pi) is among the LARGEST terms
 * (measured |c_0|/a = 1.29 at b=401, 1.58 at b=1009, 1.80 at b=2003 -- growing like log a). So the
 * large terms are the small-RESIDUE near-boundary block a = b - j (small j), which the inverse
 * descriptor alone does not see. The correct large-term descriptor is "small min over the SL2 orbit",
 * captured jointly by the two divisor sets {a | bh-1, h<=H} and {a | b-r, r<=R}.
 *
 * -------------------------------------------------------------------------------
 * WHY THIS DOES NOT CLOSE THE BOUND (honest obstruction, sharpened).
 * -------------------------------------------------------------------------------
 * Both descriptors localise the O(a log a) LARGE terms into elementary divisor sets, and imp-97116 (S)
 * already shows the thin near-boundary block a = b - j is o(phi(b) b). But MEASUREMENT of the split of
 * A(b) shows the small-inverse tail (h_a <= H) is a SHRINKING MINORITY of the mass -- ~14.6% (b=211),
 * ~4.5% (b=1009), ~2.7% (b=2003) at H=3 -- and the BULK (~95%+) of A(b) is carried by the ~phi(b)
 * moduli a of order b, each |c_0(h_a/a)| = O(a) (average ~0.14 a), NEITHER small-inverse NOR
 * small-residue. So bounding the two elementary tails does NOT bound A(b): the residual is a
 * cancellation-free MEAN VALUE of |c_0(h_a/a)| ~ 0.14 a over the bulk of the inverse line, a
 * Bettin-Conrey second-moment / mean-value statement, unchanged by the divisor-count reductions above.
 * A per-term bound gives only A(b) = O(phi(b) b log b) (the max term is O(a log a)); the log must be
 * saved by an average, which the divisor counts do not supply. c stays MEASURED, not proved.
 *
 * -------------------------------------------------------------------------------
 * WHAT IS ESTABLISHED vs OPEN.
 * -------------------------------------------------------------------------------
 * ESTABLISHED (rigorous): (R1) small-inverse frequency is a divisor count, #{a:h_a<=H} <= Sum_{h<=H}
 * d(bh-1) -- ELEMENTARY, resolving imp-97116's "non-elementary" concern about COUNTING small inverses;
 * (R2) large terms are governed by small residue b mod a (dual divisor set {a|b-r}), correcting the
 * imp-97116 "small inverse only" claim (the a=b-2 term is large with h_a ~ a/2). OPEN: the explicit c
 * -- the residual is now cleanly isolated as the cancellation-free BULK mean value of |c_0(h_a/a)| ~
 * 0.14 a over ~phi(b) moduli of order b, which neither elementary tail controls (a Bettin-Conrey
 * mean-value input). MEASURED A(b)/(phi b b) ~ 0.147 << 0.5705, not proved.
 *
 * -------------------------------------------------------------------------------
 * VERDICT (honest; no bound moved).
 * -------------------------------------------------------------------------------
 * The imp-97116 "frequency of small inverses" input is shown ELEMENTARY (a divisor sum a | bh-1), and a
 * dual divisor descriptor a | b-r is shown to govern the actually-large terms -- correcting the
 * imp-97116 "small inverse only" framing (the large a=b-2 term has non-small inverse). But measurement
 * shows the small-inverse tail is a shrinking minority of A(b); the mass is the bulk mean value of
 * |c_0(h_a/a)| ~ 0.14 a, which the divisor counts do not bound. The explicit c stays MEASURED, not
 * proved; no bound moved; the rigorous trace ceiling T ~ 2.594e7 stays the anchor. No refereed bound is changed
 * ; RH open; NO QED.
 *
 * RESIDUAL SUB-GAP (below): imp-97247-bulk-mean-value -- prove A(b) <= c phi(b) b, c < 0.5705, from a
 * cancellation-free mean-value bound Sum_{a bulk} |c_0(b-inverse mod a / a)| = O(phi(b) b) (saving the
 * per-term log a), the two large-term tails now being elementary divisor sets {a|bh-1}, {a|b-r}.
 *
 * @see imp-97116-route-m-cotangent-varying-modulus-abs-value-reduction.js (parent: names small-inverse sub-gap)
 * @see imp-97188-route-m-cotangent-absdownside-plateau-ladder.js (measured plateau ~0.147-0.148)
 * @see imp-97096-route-m-arith-first-moment-evaluation.js (exact kappa_arith = (3/2)C - 3/8)
 *
 * Ticket: imp-97247 (proof, opus-4-8, api-pool). Attempt -> honest partial; NO QED.
 */

const GAMMA = 0.5772156649015329;
const C = (Math.log(2 * Math.PI) - GAMMA) / 2;
export const IMP97247_KAPPA_ARITH = 1.5 * C - 3 / 8; // 0.5704960511308594

// -- self-contained exact kernels (small-b self-checks only; O(b^2) per b, keep b modest) --
const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));
const cot = (x) => Math.cos(x) / Math.sin(x);
const frac = (x) => x - Math.floor(x);
const c0 = (h, k) => {
  let s = 0;
  for (let n = 1; n < k; n++) s += (n / k) * cot((Math.PI * n * h) / k);
  return s;
};
const Vsum = (h, k) => {
  let s = 0;
  for (let m = 1; m < k; m++) s += frac((m * h) / k) * cot((Math.PI * m) / k);
  return s;
};
const numDivisors = (n) => {
  n = Math.abs(n);
  let c = 0;
  for (let k = 1; k * k <= n; k++) {
    if (n % k === 0) c += k * k === n ? 1 : 2;
  }
  return c;
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
const eulerPhi = (n) => {
  let r = n, x = n;
  for (let d = 2; d * d <= x; d++) {
    if (x % d === 0) {
      while (x % d === 0) x = Math.floor(x / d);
      r -= Math.floor(r / d);
    }
  }
  if (x > 1) r -= Math.floor(r / x);
  return r;
};

// RESULT 1: small-inverse set { a in [2,b-1], (a,b)=1 : h_a <= H } and its divisor-sum upper bound.
function smallInverseCount(b, H) {
  const direct = new Set();
  for (let a = 2; a < b; a++) {
    if (gcd(a, b) !== 1) continue;
    const h = modinv(b, a);
    if (h >= 1 && h <= H) direct.add(a);
  }
  let divSumUB = 0;
  for (let h = 1; h <= H; h++) {
    const M = b * h - 1;
    if (M >= 1) divSumUB += numDivisors(M);
  }
  return { count: direct.size, divSumUB };
}

// RESULT 2: small-residue set { a in [2,b-1] : b mod a <= R } and its divisor-sum upper bound.
function smallResidueCount(b, R) {
  const direct = new Set();
  for (let a = 2; a < b; a++) {
    const r = b % a;
    if (r >= 1 && r <= R) direct.add(a);
  }
  let divSumUB = 0;
  for (let r = 1; r <= R; r++) {
    const M = b - r;
    if (M >= 1) divSumUB += numDivisors(M);
  }
  return { count: direct.size, divSumUB };
}

// Split A(b) into small-inverse tail (h_a <= H) vs bulk; report mass fractions.
function absDownsideSplit(b, H) {
  let A = 0, Atail = 0, phi = 0;
  for (let a = 2; a < b; a++) {
    if (gcd(a, b) !== 1) continue;
    phi++;
    const h = modinv(b, a);
    const v = Math.abs(c0(h, a));
    A += v;
    if (h <= H) Atail += v;
  }
  return { phi, coeff: A / (phi * b), tailFrac: Atail / A };
}

// MEASURED (tmp/imp-97247-scratch*.mjs). Small-inverse tail fraction of A(b) at H=3 (shrinking).
export const IMP97247_MEASURED = Object.freeze({
  smallInvTailFracH3: Object.freeze([
    { b: 211, tailFrac: 0.146 },
    { b: 401, tailFrac: 0.088 },
    { b: 1009, tailFrac: 0.045 },
    { b: 2003, tailFrac: 0.027 },
  ]),
  // The a = b-2 term: small residue b mod a = 2, but inverse h_a = (a+1)/2 ~ a/2 (NOT small), large.
  boundaryTermBminus2: Object.freeze([
    { b: 401, a: 399, bModA: 2, h_a: 200, hOverA: 0.501, absOverA: 1.286 },
    { b: 1009, a: 1007, bModA: 2, h_a: 504, hOverA: 0.5, absOverA: 1.58 },
    { b: 2003, a: 2001, bModA: 2, h_a: 1001, hOverA: 0.5, absOverA: 1.798 }, // grows like (log a)/(2 pi)
  ]),
  absCoeffPlateau: 0.147, // imp-97188 plateau; << kappa_arith = 0.5705
});

export const IMP97247_RESULTS = Object.freeze({
  smallInverseIsDivisorCount:
    'h_a = h  <=>  a | (b h - 1);  #{a in [2,b-1]: h_a<=H} <= Sum_{h<=H} d(b h - 1)  (ELEMENTARY divisor sum)',
  smallResidueIsDivisorCount:
    'b mod a = r  <=>  a | (b - r) (a>r);  large terms via V(b,a)=V(b mod a, a) ~ (a/(pi r)) log a for small r',
  correctionToImp97116:
    'imp-97116 "only small-inverse terms are large" is INCOMPLETE: a=b-2 has b mod a=2 (large term) but h_a ~ a/2 (not small)',
  frequencyIsElementary: true, // COUNTING small inverses needs no Kloosterman input -- it is a divisor sum
  boundClosed: false, // small-inverse tail is a shrinking minority; the bulk mean value is unbounded by these counts
  residualIsBulkMeanValue: true, // residual = cancellation-free mean value |c_0(h_a/a)| ~ 0.14 a over ~phi(b) bulk moduli
});

export const IMP97247_SUBGAP = Object.freeze({
  id: 'imp-97247-bulk-mean-value',
  statement:
    'The two large-term families are now ELEMENTARY divisor sets: small inverse h_a<=H <=> a | (b h - 1), ' +
    'small residue b mod a<=R <=> a | (b - r). What remains for A(b) = Sum_{a=2,(a,b)=1}^{b-1} ' +
    '|c_0(b-inverse mod a / a)| <= c phi(b) b with explicit c < 0.5705 is a cancellation-free MEAN-VALUE ' +
    'bound on the BULK (~phi(b) moduli a of order b, each |c_0(h_a/a)| = O(a), average ~0.14 a): a ' +
    'per-term bound only gives O(phi b b log b), and the log must be saved by an average, which the ' +
    'divisor counts do not supply. c is MEASURED (~0.147), not proved. A Bettin-Conrey mean-value input.',
});

export const IMP97247_VERDICT = Object.freeze({
  question:
    'can the imp-97116 residual A(b) <= c phi(b) b (c < kappa_arith = 0.5705) be closed via the ' +
    'frequency of small modular inverses b-inverse mod a?',
  smallInverseFrequencyElementary: true, // RESULT 1: it is a divisor sum a | (b h - 1)
  largeTermsGovernedBySmallResidue: true, // RESULT 2: a=b-2 large with non-small inverse (correction)
  explicitConstantProved: false, // A(b)/(phi b b) ~ 0.147 MEASURED, not proved
  smallInverseTailIsMinority: true, // ~2.7% of A(b) at b=2003 (H=3), shrinking -- not where the mass is
  residualIsBulkMeanValue: true, // the open piece is a cancellation-free bulk mean value, NOT the tails
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  computeBindsFirst: true,
  qed: false,
  conclusion:
    'Attacking the imp-97116 "frequency of small inverses" residual yields two rigorous results: ' +
    '(R1) that frequency is ELEMENTARY -- #{a: h_a<=H} <= Sum_{h<=H} d(b h - 1), a divisor sum, needing ' +
    'no Kloosterman input to COUNT; (R2) the actually-large terms are governed by small RESIDUE b mod a ' +
    '(dual divisor set a | b-r), correcting the imp-97116 "small inverse only" framing (the a=b-2 term is ' +
    'large yet has inverse ~a/2). But measurement shows the small-inverse tail is a shrinking MINORITY of ' +
    'A(b) (~2.7% at b=2003), so bounding it does not bound A(b): the residual is now cleanly isolated as a ' +
    'cancellation-free BULK MEAN VALUE of |c_0(h_a/a)| ~ 0.14 a over ~phi(b) moduli of order b (a ' +
    'per-term bound gives only O(phi b b log b)). The explicit c stays MEASURED (~0.147 << 0.5705), not ' +
    'proved; no bound moved, no rigorous ceiling posted; T ~ 2.594e7 anchor; compute binds first. ' +
    'No refereed bound is changed; RH open; NO QED.',
});

export const IMP97247_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Attempt -> honest partial: the imp-97116 residual ' +
  '"frequency of small inverses b-inverse mod a" is shown ELEMENTARY -- a divisor sum, #{a: h_a<=H} <= ' +
  'Sum_{h<=H} d(b h - 1) -- and a dual divisor descriptor a | (b - r) is shown to govern the actually- ' +
  'large terms, correcting the imp-97116 "small inverse only" framing (a=b-2 is large with inverse ~a/2). ' +
  'But the small-inverse tail is a shrinking minority of A(b) (~2.7% at b=2003), so the residual is the ' +
  'cancellation-free BULK mean value of |c_0(h_a/a)| ~ 0.14 a, which the divisor counts do not bound. ' +
  'The explicit constant stays MEASURED not proved; no bound on Lambda moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
// Kept light (b <= 401, O(b^2) per b) so the module is safe to import in the browser bundle.

const IMP97247_ASSERTIONS = [
  {
    id: 'imp97247-small-inverse-is-divisor-count',
    holds: () => {
      // RESULT 1: { a: h_a <= H } = divisors of (b h - 1); the divisor sum is a valid upper bound.
      for (const b of [101, 211, 401]) {
        for (const H of [1, 3, 10]) {
          // Direct set = via-divisors set (identity a | b h - 1).
          const direct = new Set();
          for (let a = 2; a < b; a++) {
            if (gcd(a, b) === 1 && modinv(b, a) <= H) direct.add(a);
          }
          const viaDiv = new Set();
          for (let h = 1; h <= H; h++) {
            const M = b * h - 1;
            for (let k = 1; k * k <= M; k++) {
              if (M % k !== 0) continue;
              for (const a of [k, M / k]) {
                if (a >= 2 && a <= b - 1 && gcd(a, b) === 1 && modinv(b, a) <= H) viaDiv.add(a);
              }
            }
          }
          if (direct.size !== viaDiv.size || ![...direct].every((a) => viaDiv.has(a))) return false;
          const { count, divSumUB } = smallInverseCount(b, H);
          if (count !== direct.size) return false;
          if (!(divSumUB >= count)) return false; // divisor sum is a valid (elementary) upper bound
        }
      }
      return true;
    },
    why: 'RESULT 1 (rigorous): { a in [2,b-1], (a,b)=1 : h_a <= H } equals the divisors of b h - 1 for h <= H, so the count is <= Sum_{h<=H} d(b h - 1) -- an ELEMENTARY divisor sum (verified b=101,211,401, H<=10).',
  },
  {
    id: 'imp97247-small-residue-is-divisor-count-and-boundary-term-large',
    holds: () => {
      // RESULT 2: small residue is a divisor set a | (b - r); and a=b-2 is a large term with non-small inverse.
      for (const b of [101, 211, 401]) {
        const R = 4;
        const direct = new Set();
        for (let a = 2; a < b; a++) {
          const r = b % a;
          if (r >= 1 && r <= R) direct.add(a);
        }
        const viaDiv = new Set();
        for (let r = 1; r <= R; r++) {
          const M = b - r;
          for (let k = 1; k * k <= M; k++) {
            if (M % k !== 0) continue;
            for (const a of [k, M / k]) {
              if (a >= 2 && a <= b - 1 && a > r && b % a <= R) viaDiv.add(a);
            }
          }
        }
        if (direct.size !== viaDiv.size || ![...direct].every((a) => viaDiv.has(a))) return false;
        const { count, divSumUB } = smallResidueCount(b, R);
        if (count !== direct.size || !(divSumUB >= count)) return false;
      }
      // a = b-2 term (b odd here): residue 2 but inverse ~ a/2 (NOT small), V(b,a) = V(2,a).
      for (const b of [211, 401]) {
        const a = b - 2;
        if (b % a !== 2) return false; // small residue
        const h = modinv(b, a);
        if (!(Math.abs(h / a - 0.5) < 0.02)) return false; // inverse ~ a/2, NOT small
        if (Math.abs(Vsum(b, a) - Vsum(2, a)) > 1e-6) return false; // V(b,a) = V(2,a)
      }
      return true;
    },
    why: 'RESULT 2 (rigorous): small residue b mod a <= R equals divisors of b - r (r<=R); and the large a=b-2 term has residue 2 but inverse h_a ~ a/2 (NOT small), correcting the imp-97116 "small inverse only" large-term claim.',
  },
  {
    id: 'imp97247-small-inverse-tail-is-shrinking-minority',
    holds: () => {
      // Measurement: small-inverse tail (h_a <= 3) is a small, shrinking fraction of A(b) -- the mass is bulk.
      const s211 = absDownsideSplit(211, 3);
      const s401 = absDownsideSplit(401, 3);
      if (!(s211.tailFrac < 0.2 && s401.tailFrac < 0.12)) return false; // minority
      if (!(s401.tailFrac < s211.tailFrac)) return false; // shrinking with b
      if (!(s401.coeff > 0.1 && s401.coeff < 0.2)) return false; // plateau band ~0.14, << kappa_arith
      return true;
    },
    why: 'the small-inverse tail (h_a <= 3) is a shrinking minority of A(b) (< 20% at b=211, < 12% and smaller at b=401), so the mass of A(b) is the bulk mean value -- bounding the tail does NOT bound A(b).',
  },
  {
    id: 'imp97247-honesty-gate-no-qed',
    holds: () =>
      IMP97247_VERDICT.smallInverseFrequencyElementary === true &&
      IMP97247_VERDICT.largeTermsGovernedBySmallResidue === true &&
      IMP97247_VERDICT.explicitConstantProved === false &&
      IMP97247_VERDICT.smallInverseTailIsMinority === true &&
      IMP97247_VERDICT.residualIsBulkMeanValue === true &&
      IMP97247_VERDICT.anyBoundMoved === false &&
      IMP97247_VERDICT.postsRigorousCeiling === false &&
      IMP97247_VERDICT.qed === false &&
      /bulk-mean-value/.test(IMP97247_SUBGAP.id) &&
      /MEAN-VALUE/.test(IMP97247_SUBGAP.statement) &&
      /NO QED/.test(IMP97247_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97247_HONEST_BANNER) &&
      /RH open/.test(IMP97247_HONEST_BANNER),
    why: 'attempt -> honest partial: the small-inverse frequency is made elementary and the large-term descriptor corrected, but the explicit constant stays measured not proved and the residual is a bulk mean value -- no bound moved, no rigorous ceiling, honesty markers and named residual sub-gap present.',
  },
];

for (const a of IMP97247_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97247-route-m-absdownside-divisor-count-reduction assertion failed: ${a.id}`,
    );
  }
}

export default {
  kappaArith: IMP97247_KAPPA_ARITH,
  measured: IMP97247_MEASURED,
  results: IMP97247_RESULTS,
  subGap: IMP97247_SUBGAP,
  verdict: IMP97247_VERDICT,
  banner: IMP97247_HONEST_BANNER,
};
