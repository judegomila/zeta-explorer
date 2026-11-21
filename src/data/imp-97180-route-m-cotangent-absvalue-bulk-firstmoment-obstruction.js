/**
 * @module imp-97180-route-m-cotangent-absvalue-bulk-firstmoment-obstruction
 *
 * imp-97180 (proof, ASSESSMENT + PARTIAL): attempt to prove the imp-97116 cancellation-free
 * absolute-value bound A(b) <= c phi(b) b with an explicit CERTIFIED constant c < kappa_arith =
 * 0.5704960511308594, the sole open input imp-97168 names for kappa > 0. The attempt does NOT
 * produce a rigorous c; instead it REFINES (and partly corrects) the imp-97116 stated obstruction
 * with a data-grounded decomposition and rules out the elementary termwise route. No bound is
 * proved rigorous; no refereed bound is changed; RH open; NO QED.
 *
 * Notation as imp-97116/imp-97097. A(b) = Sum_{a=2,(a,b)=1}^{b-1} |c_0(h_a/a)|, h_a = b-inverse
 * mod a, c_0(h/k) = Sum_{n=1}^{k-1} (n/k) cot(pi n h/k) (imp-97116 R1: V(b,a) = c_0(h_a/a) exactly).
 * Write h'_a = min(h_a, a - h_a) for the reduced inverse (|c_0| is even under h -> a-h up to O(a)).
 *
 * -------------------------------------------------------------------------------
 * ATTEMPT: an elementary termwise bound |c_0(h/a)| <= K (a/h') log(2a) does NOT exist.
 * -------------------------------------------------------------------------------
 * imp-97116 flagged the obstruction as the frequency of SMALL inverses h'_a, suggesting a termwise
 * bound |c_0(h/a)| ~ (a/(pi h')) log a plus a small-h' mean value. Measured, that termwise form is
 * FALSE as a uniform bound: the ratio K = |c_0(h_a/a)| / ((a/h'_a) log(2a)) is WORST (not best) at
 * h'_a ~ a/2 -- the BULK, typical-inverse regime -- and GROWS without bound there:
 *     K_max ~ 7.9 (b=101), 18.6 (211), 104 (1009), 217 (2003), 332 (3001),  worst at h'_a = (a-1)/2.
 * Reason: at h'_a ~ a/2 the trial bound (a/h') log(2a) ~ 2 log(2a) is tiny, while |c_0(h/a)| = O(a).
 * So the (a/h') log a shape captures only the small-h' spikes; it cannot certify the bulk, where the
 * true size is |c_0(h/a)| = O(a) with no 1/h' gain. An elementary per-term route is therefore closed.
 *
 * -------------------------------------------------------------------------------
 * REFINED OBSTRUCTION: split A(b) = A_tail (small inverses) + A_bulk (typical inverses).
 * -------------------------------------------------------------------------------
 * Split at h'_a <= sqrt(a) (tail: small reduced inverse) vs h'_a > sqrt(a) (bulk). MEASURED, per
 * phi(b) b:
 *   - A_tail/(phi b) DECREASES monotonically: 0.0423 (b=101) -> 0.0227 (503) -> 0.0143 (1009) ->
 *     0.0093 (2003) -> 0.0058 (6007). The small-inverse tail is o(phi(b) b).
 *   - A_bulk/(phi b) GROWS toward the whole: 0.092 (101) -> 0.124 (601) -> 0.136 (2003).
 * So the imp-97116 framing -- "the sole non-o(phi b b) obstruction is the frequency of small inverses
 * b-inverse mod a" -- is REFINED/CORRECTED: the small-inverse contribution is measured LOWER ORDER;
 * the constant ~0.145 is carried by the BULK, where h_a is of order a and each |c_0(h_a/a)| = O(a).
 *
 * -------------------------------------------------------------------------------
 * WHAT c IS AND WHY IT IS BOUNDED: the Bettin-Conrey ABSOLUTE FIRST MOMENT over the inverse line.
 * -------------------------------------------------------------------------------
 * A(b)/(phi b) = average over coprime a of |c_0(h_a/a)|/b. Since a <= b, the operative quantity is the
 * mean of |c_0(h_a/a)|/a over the inverse line a |-> b-inverse mod a. MEASURED that mean is a bounded
 * CONSTANT with NO log factor:
 *     E_a[ |c_0(h_a/a)| / a ] ~ 0.27  (0.231 b=101 -> 0.265 503 -> 0.266 1009 -> 0.270 4001, FLAT;
 *     the /log(b)-normalized version DECREASES, ruling out a log a growth).
 * Consequently A(b)/(phi b b) = c stabilizes:  c ~ 0.134 (b=101) -> 0.145 (503) -> 0.145 (2003) ->
 * 0.147 (6007) -- flat, well below kappa_arith = 0.5705 with margin ~3.9x. The rigorous input that
 * would certify c < 0.5705 is thus NOT a small-inverse frequency count but a uniform-in-b bound on the
 * Bettin-Conrey ABSOLUTE FIRST MOMENT  Sum_a |c_0(b-inverse mod a / a)| <= c_1 Sum_a a  with an
 * explicit c_1 (measured c_1 ~ 0.27 as a mean of |c_0|/a). This is a genuine Bettin-Conrey mean value
 * over the inverse map, still non-elementary; no uniform termwise |c_0(h/a)| <= K a can supply it
 * because the h=1 term alone is c_0(1/a) ~ (1/pi) a log a >> a.
 *
 * -------------------------------------------------------------------------------
 * WHAT IS ESTABLISHED vs OPEN (this leaf).
 * -------------------------------------------------------------------------------
 * ESTABLISHED (rigorous): the decomposition A(b) = A_tail + A_bulk is an exact finite split. MEASURED
 * (not proved): A_tail/(phi b) -> 0 (small inverses lower order); E_a[|c_0(h_a/a)|/a] ~ 0.27 flat
 * (no log); c = A(b)/(phi b b) ~ 0.145 stable, < 0.5705 with ~3.9x margin. OPEN: an explicit certified
 * c -- the sole hard input is now sharpened from "small-inverse frequency" (measured lower order) to
 * the Bettin-Conrey ABSOLUTE FIRST MOMENT of the cotangent sum over the inverse line, uniform in b;
 * the elementary termwise route is ruled out. No bound moved.
 *
 * -------------------------------------------------------------------------------
 * VERDICT (honest; no bound moved).
 * -------------------------------------------------------------------------------
 * The certified c < 0.5705 is NOT obtained. The attempt (i) rules out the elementary termwise bound
 * |c_0(h/a)| <= K (a/h') log(2a) (its error K grows in the bulk h' ~ a/2), and (ii) refines the
 * imp-97116 obstruction: the small-inverse tail A_tail/(phi b) is measured o(1), so the open input is
 * the Bettin-Conrey ABSOLUTE FIRST MOMENT E_a[|c_0(h_a/a)|/a] ~ 0.27 over the inverse line, not the
 * small-inverse frequency. The measured c ~ 0.145 stays MEASURED, not proved; the ~3.9x margin below
 * kappa_arith = 0.5705 is unchanged in substance. No bound on Lambda moves; T ~ 2.594e7 trace anchor;
 * compute (N ~ 9916) binds first. No refereed bound is changed; RH open; NO QED.
 *
 * RESIDUAL SUB-GAP (below): imp-97180-cotangent-absvalue-first-moment -- prove
 * Sum_{a=2,(a,b)=1}^{b-1} |c_0(b-inverse mod a / a)| <= c_1 Sum_{a coprime} a with explicit
 * c_1 < 0.5705 (phi b b)/(Sum a) (measured c_1 ~ 0.27), a Bettin-Conrey ABSOLUTE FIRST MOMENT over
 * the inverse line -- NOT a small-inverse frequency count (that piece is measured lower order).
 *
 * @see imp-97116-route-m-cotangent-varying-modulus-abs-value-reduction.js (parent: R1/R2, A(b) ~ 0.14)
 * @see imp-97168-route-m-kappa-arith-vs-companion-target-reconciliation.js (names c < 0.5705 as sole input)
 * @see imp-97097-route-m-cotangent-first-moment-reciprocity.js (fixed-modulus half = 0; sub-gap)
 *
 * Ticket: imp-97180 (proof, opus-4-8, api-pool). Assessment + partial; NO QED.
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

// Decompose A(b) into tail (small reduced inverse h' <= sqrt a) and bulk (h' > sqrt a), plus the
// mean of |c_0(h_a/a)|/a and the worst elementary-bound ratio K. O(b^2); keep b small.
function absValuePieces(b) {
  let phi = 0, A = 0, Atail = 0, Abulk = 0, sumCoverA = 0, Kmax = 0;
  for (let a = 2; a < b; a++) {
    if (gcd(a, b) !== 1) continue;
    phi += 1;
    const h = modinv(b, a);
    const hred = Math.min(h, a - h);
    const v = Math.abs(Vsum(b, a)); // = |c_0(h_a/a)| by imp-97116 R1
    A += v;
    sumCoverA += v / a;
    if (hred <= Math.sqrt(a)) Atail += v;
    else Abulk += v;
    const trial = (a / hred) * Math.log(2 * a); // the (a/h') log(2a) shape
    const K = v / trial;
    if (K > Kmax) Kmax = K;
  }
  const den = phi * b;
  return {
    phi,
    c: A / den, // A(b)/(phi b b)
    cTail: Atail / den,
    cBulk: Abulk / den,
    meanCoverA: sumCoverA / phi, // E_a[|c_0(h_a/a)|/a]
    Kmax, // worst ratio of |c_0| to the (a/h') log(2a) trial bound
  };
}

// MEASURED constants (tmp/imp-97180-scratch*.mjs; b <= 6007).
export const IMP97180_MEASURED = Object.freeze({
  cStable: 0.145, // A(b)/(phi b b): 0.134 (b=101) -> 0.145 (503) -> 0.147 (6007); FLAT, no log drift
  marginBelowKappaArith: 3.9, // 0.5705 / 0.145 ~ 3.9x
  cTailShrinks: '0.0423 (101) -> 0.0227 (503) -> 0.0143 (1009) -> 0.0058 (6007)', // small inverses o(phi b b)
  cBulkGrows: '0.092 (101) -> 0.124 (601) -> 0.136 (2003)', // bulk carries the constant
  meanAbsOverA: 0.27, // E_a[|c_0(h_a/a)|/a] ~ 0.27, FLAT (no log a factor): the abs first moment
  elementaryKmaxGrows: '7.9 (101) -> 18.6 (211) -> 104 (1009) -> 332 (3001)', // worst at h ~ a/2 (bulk)
  kappaArith: 0.5704960511308594, // imp-97096 exact (3/2)C - 3/8 (the part the cotangent must not cancel)
});

export const IMP97180_ATTEMPT = Object.freeze({
  target: 'A(b) = Sum_{a=2,(a,b)=1}^{b-1} |c_0(b-inverse mod a / a)| <= c phi(b) b with certified c < 0.5705',
  elementaryTermwiseRuledOut:
    'no uniform |c_0(h/a)| <= K (a/h) log(2a): the ratio K is WORST (grows) at the bulk h ~ a/2, not at small h',
  decomposition: 'A(b) = A_tail (reduced inverse h <= sqrt a) + A_bulk (h > sqrt a), an exact finite split',
  tailIsLowerOrder: true, // A_tail/(phi b) -> 0 (small-inverse contribution vanishes in the normalized sum)
  bulkCarriesConstant: true, // A_bulk/(phi b) -> the whole ~0.145; typical h_a, each |c_0| = O(a)
  operativeMeanValue:
    'E_a[|c_0(b-inverse mod a / a)|/a] ~ 0.27 (flat, no log a): a Bettin-Conrey ABSOLUTE FIRST MOMENT over the inverse line',
  refinedObstruction:
    'the sole open input is the absolute first moment (bulk), NOT the small-inverse frequency (measured lower order)',
  noUniformOaBound: 'a uniform |c_0(h/a)| <= K a is impossible: c_0(1/a) ~ (1/pi) a log a >> a',
});

export const IMP97180_VERDICT = Object.freeze({
  question:
    'prove A(b) = Sum_{a=2,(a,b)=1}^{b-1} |c_0(b-inverse mod a / a)| <= c phi(b) b with an explicit ' +
    'certified c < kappa_arith = 0.5705 (imp-97168 sole open input for kappa > 0)?',
  certifiedConstantProved: false, // c stays MEASURED ~0.145, not proved
  elementaryRouteClosed: true, // no uniform (a/h) log a termwise bound; no uniform O(a) termwise bound
  smallInverseTailLowerOrder: true, // A_tail/(phi b) -> 0 (measured): refines the imp-97116 stated obstruction
  bulkAbsFirstMomentIsTheInput: true, // the operative input is E_a[|c_0|/a] ~ 0.27 over the inverse line
  remainingInputElementary: false, // Bettin-Conrey absolute first moment over the inverse map
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  computeBindsFirst: true,
  qed: false,
  conclusion:
    'The certified c < 0.5705 is NOT obtained. The attempt rules out the elementary termwise bound ' +
    '|c_0(h/a)| <= K (a/h) log(2a) -- its error grows in the BULK h ~ a/2, where |c_0| = O(a) with no ' +
    '1/h gain -- and refines the imp-97116 obstruction: the small-inverse tail A_tail/(phi b) is measured ' +
    'o(1), so the open input is not the small-inverse FREQUENCY but the Bettin-Conrey ABSOLUTE FIRST ' +
    'MOMENT E_a[|c_0(b-inverse mod a / a)|/a] ~ 0.27 (flat, no log) over the inverse line. The measured ' +
    'c ~ 0.145 stays MEASURED (< 0.5705 by ~3.9x); no uniform termwise O(a) bound exists (c_0(1/a) ~ ' +
    '(1/pi) a log a). No bound moved; T ~ 2.594e7 anchor; compute N ~ 9916 binds first. No refereed bound is changed' +
    '; RH open; NO QED.',
});

export const IMP97180_SUBGAP = Object.freeze({
  id: 'imp-97180-cotangent-absvalue-first-moment',
  statement:
    'prove Sum_{a=2,(a,b)=1}^{b-1} |c_0(b-inverse mod a / a)| <= c_1 Sum_{a coprime} a with explicit ' +
    'c_1 < kappa_arith (phi b b)/(Sum_{a coprime} a) (measured c_1 ~ 0.27) -- a Bettin-Conrey ABSOLUTE ' +
    'FIRST MOMENT of the cotangent sum over the inverse line a |-> b-inverse mod a, uniform in b. This ' +
    'REPLACES the imp-97116 small-inverse-frequency framing: the small-inverse tail (reduced inverse ' +
    '<= sqrt a) is MEASURED lower order; the constant is carried by the bulk (typical inverse, |c_0| = ' +
    'O(a)). No uniform termwise |c_0(h/a)| <= K a exists (c_0(1/a) ~ (1/pi) a log a). c stays MEASURED.',
});

export const IMP97180_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Assessment + partial only: the attempt to certify ' +
  'A(b) <= c phi(b) b with c < 0.5705 does NOT succeed. It rules out the elementary termwise bound ' +
  '|c_0(h/a)| <= K (a/h) log(2a) (its error grows in the bulk h ~ a/2) and refines the imp-97116 ' +
  'obstruction: the small-inverse tail A_tail/(phi b) is measured lower order, so the sole open input is ' +
  'the Bettin-Conrey ABSOLUTE FIRST MOMENT E_a[|c_0(b-inverse mod a / a)|/a] ~ 0.27 over the inverse ' +
  'line, not the small-inverse frequency. The measured c ~ 0.145 (< 0.5705 by ~3.9x) stays measured, not ' +
  'proved. No bound on Lambda moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97180_ASSERTIONS = [
  {
    id: 'imp97180-decomposition-and-tail-lower-order',
    holds: () => {
      // A = A_tail + A_bulk exactly, and A_tail/(phi b) shrinks as b grows (small inverses lower order).
      const p1 = absValuePieces(101);
      const p2 = absValuePieces(211);
      const p3 = absValuePieces(401);
      // exact split: c = cTail + cBulk
      for (const p of [p1, p2, p3]) {
        if (Math.abs(p.c - (p.cTail + p.cBulk)) > 1e-12) return false;
      }
      // tail strictly decreasing across the ladder
      if (!(p1.cTail > p2.cTail && p2.cTail > p3.cTail)) return false;
      // bulk is the dominant part at each b
      for (const p of [p1, p2, p3]) if (!(p.cBulk > p.cTail)) return false;
      return true;
    },
    why: 'A(b) = A_tail + A_bulk is an exact finite split; A_tail/(phi b) decreases (0.0423 -> 0.0311 -> 0.0233 over b=101,211,401), so the small-inverse tail is lower order and the bulk dominates.',
  },
  {
    id: 'imp97180-c-stable-below-kappa-arith',
    holds: () => {
      // c = A(b)/(phi b b) is bounded ~0.14 and below kappa_arith with a large margin.
      for (const b of [101, 211, 401]) {
        const { c } = absValuePieces(b);
        if (!(c > 0.12 && c < 0.16)) return false;
        if (!(c < IMP97180_MEASURED.kappaArith / 3)) return false; // ~3.9x margin
      }
      return true;
    },
    why: 'A(b)/(phi b b) ~ 0.134..0.144 over b=101,211,401, flat and below kappa_arith = 0.5705 by more than 3x -- consistent with the measured stable c ~ 0.145.',
  },
  {
    id: 'imp97180-abs-first-moment-flat-no-log',
    holds: () => {
      // E_a[|c_0(h_a/a)|/a] ~ 0.27 constant (no log a growth): the abs first moment.
      for (const b of [101, 211, 401]) {
        const { meanCoverA } = absValuePieces(b);
        if (!(meanCoverA > 0.2 && meanCoverA < 0.3)) return false;
      }
      // grows only mildly (0.231 -> 0.260), consistent with a constant not a log
      return absValuePieces(401).meanCoverA > absValuePieces(101).meanCoverA;
    },
    why: 'the mean of |c_0(h_a/a)|/a over the inverse line is ~0.23..0.26 (flat, no log a factor) -- the operative Bettin-Conrey absolute first moment that carries the constant c.',
  },
  {
    id: 'imp97180-elementary-termwise-ruled-out',
    holds: () => {
      // The (a/h) log(2a) trial bound has a ratio K that GROWS in b (worst in the bulk h ~ a/2),
      // so no uniform K works: the elementary termwise route is closed.
      const k1 = absValuePieces(101).Kmax;
      const k2 = absValuePieces(211).Kmax;
      const k3 = absValuePieces(401).Kmax;
      return k1 > 1 && k2 > k1 && k3 > k2; // strictly increasing, unbounded
    },
    why: 'the ratio |c_0|/((a/h) log(2a)) grows (7.9 -> 18.6 -> 38.3 over b=101,211,401) and is worst at the bulk h ~ a/2, so no uniform (a/h) log a termwise bound holds -- the elementary route is ruled out.',
  },
  {
    id: 'imp97180-honesty-gate-no-qed',
    holds: () =>
      IMP97180_VERDICT.certifiedConstantProved === false &&
      IMP97180_VERDICT.elementaryRouteClosed === true &&
      IMP97180_VERDICT.smallInverseTailLowerOrder === true &&
      IMP97180_VERDICT.bulkAbsFirstMomentIsTheInput === true &&
      IMP97180_VERDICT.remainingInputElementary === false &&
      IMP97180_VERDICT.anyBoundMoved === false &&
      IMP97180_VERDICT.postsRigorousCeiling === false &&
      IMP97180_VERDICT.qed === false &&
      /absvalue-first-moment/.test(IMP97180_SUBGAP.id) &&
      /ABSOLUTE\s+FIRST\s+MOMENT/.test(IMP97180_SUBGAP.statement) &&
      /NO QED/.test(IMP97180_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97180_HONEST_BANNER) &&
      /RH open/.test(IMP97180_HONEST_BANNER),
    why: 'assessment + partial: the certified c is not obtained; the elementary route is ruled out and the obstruction is refined to the Bettin-Conrey absolute first moment -- no bound moved, no rigorous ceiling, honesty markers and the named residual sub-gap present.',
  },
];

for (const a of IMP97180_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97180-route-m-cotangent-absvalue-bulk-firstmoment-obstruction assertion failed: ${a.id}`,
    );
  }
}

export default {
  measured: IMP97180_MEASURED,
  attempt: IMP97180_ATTEMPT,
  verdict: IMP97180_VERDICT,
  subGap: IMP97180_SUBGAP,
  banner: IMP97180_HONEST_BANNER,
};
