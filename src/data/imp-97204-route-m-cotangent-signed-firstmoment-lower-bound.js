/**
 * @module imp-97204-route-m-cotangent-signed-firstmoment-lower-bound
 *
 * imp-97204 (proof, ASSESSMENT + PARTIAL): attempt an absolute lower bound
 * kappa_cot > -kappa_arith (two-sided) on the imp-97097 operative VARYING-MODULUS half of the
 * Route M cotangent first moment, S(b) = Sum_{a=2,(a,b)=1}^{b-1} V(b,a). imp-97097 proved the
 * fixed-modulus half vanishes EXACTLY and imp-97119 closed the boundary V(1,b) rigorously,
 * leaving S(b) as a genuine Bettin-Conrey period-function mean value with NO elementary closed
 * form; the imp-97155 cohort index records that NO absolute lower bound kappa_cot > -kappa_arith
 * is proved, only measured (~+0.12, stable). This leaf does NOT produce a rigorous lower bound;
 * it establishes that the operative lower bound is DOMINATED (via an exact termwise triangle
 * inequality) by the absolute-value program already under attack in imp-97180/imp-97203, so it
 * needs NO new Bettin-Conrey input, and pins what a DIRECT signed bound (sharper, cancellation-
 * exploiting) would additionally require. No bound is proved rigorous; no refereed bound is changed
 * ; RH open; NO QED.
 *
 * Notation as imp-97097/imp-97116/imp-97180. V(h,k) = Sum_{m=1}^{k-1} frac(m h/k) cot(pi m/k);
 * imp-97116 R1 gives V(b,a) = c_0(h_a/a) with h_a = b-inverse mod a. The signed operative half is
 * S(b) = Sum_{a=2,(a,b)=1}^{b-1} V(b,a); the absolute companion is A(b) = Sum_a |V(b,a)|
 * (the imp-97180/imp-97203 object). Phi(b) = -V(1,b) + S(b) (imp-97097 reduction), and the
 * cotangent part of the first moment F(b) is -(pi/2) Phi(b), so kappa_cot = -(pi/2) Phi(b)/(phi(b) b).
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 (RIGOROUS, exact termwise inequality): the signed half is dominated by the absolute one.
 * -------------------------------------------------------------------------------
 * By the triangle inequality applied termwise over the coprime residues a,
 *     |S(b)| = |Sum_a V(b,a)|  <=  Sum_a |V(b,a)| = A(b)   for every b >= 2   (EXACT, no hypothesis).
 * Combined with the imp-97119 boundary asymptotic |V(1,b)| = O(b log b) = o(phi(b) b), this gives a
 * TWO-SIDED bound on the operative cotangent coefficient from the SINGLE absolute constant: if
 * A(b) <= c phi(b) b then
 *     |kappa_cot| = (pi/2) |Phi(b)| / (phi(b) b)  <=  (pi/2) ( c + o(1) ).
 * Hence certifying the imp-97180 absolute constant c ALREADY certifies the two-sided bound on
 * kappa_cot -- in particular the OPERATIVE lower bound kappa_cot > -kappa_arith -- with NO additional
 * Bettin-Conrey input, PROVIDED c < (2/pi) kappa_arith. So the "signed lower bound" is NOT a separate
 * open problem: it is dominated by the absolute-value program (imp-97180 -> imp-97203, now a mean-
 * SQUARE plus an inverse-map equidistribution transfer), which supplies BOTH sides at once.
 *
 * -------------------------------------------------------------------------------
 * RESULT 2 (THRESHOLD): the operative comparison carries the -(pi/2) factor.
 * -------------------------------------------------------------------------------
 * Because the cotangent part of F is -(pi/2) Phi (imp-97097), the threshold on the absolute constant
 * for the LOWER bound kappa_cot > -kappa_arith is c < (2/pi) kappa_arith = (2/pi) (0.5704960511...) =
 * 0.36318906620753183, TIGHTER than the c < kappa_arith = 0.5705 named for the absolute program in
 * imp-97180/imp-97168 (those state the target on A/(phi b b) directly, without the -(pi/2) weight that
 * relates A to the F-coefficient). This is a factual sharpening of the target constant, not a change of
 * conclusion: the MEASURED c = A(b)/(phi(b) b) ~ 0.145 (imp-97180) clears even the tighter 0.36319 with
 * margin ~2.5x, so the operative kappa_cot > -kappa_arith holds comfortably in measurement under either
 * convention. Only the certified THRESHOLD moves; no measured value or bound moves.
 *
 * -------------------------------------------------------------------------------
 * RESULT 3 (MEASURED): the signed half enjoys ~46% cancellation the absolute route discards.
 * -------------------------------------------------------------------------------
 * MEASURED over b <= 2003, the signed and absolute varying-modulus sums are
 *     S(b)/(phi(b) b) ~ -0.073 (b=101) -> -0.077 (401) -> -0.079 (2003),  FLAT and negative,
 *     A(b)/(phi(b) b) ~  0.134 (b=101) ->  0.144 (401) ->  0.146 (2003),  FLAT (imp-97180),
 *     cancellation ratio |S|/A ~ 0.54  (0.543 b=101 -> 0.538 401 -> 0.543 2003),  STABLE.
 * So the signed half is ~46% smaller than the absolute majorant: the absolute-value route throws away
 * genuine cancellation. A DIRECT signed bound would therefore give a strictly SHARPER constant
 * (|S| ~ 0.079 vs A ~ 0.146), but that sharpening is NOT needed for positivity -- the domination of
 * Result 1 already secures kappa_cot > -kappa_arith once the absolute program closes.
 *
 * -------------------------------------------------------------------------------
 * OBSTRUCTION: what a DIRECT signed bound would need -- a SIGNED Bettin-Conrey mean value.
 * -------------------------------------------------------------------------------
 * A direct bound on S(b) (exploiting the cancellation) requires the SIGNED first moment
 * Sum_a c_0(h_a/a) over the inverse line a |-> h_a = b-inverse mod a. This is exactly the
 * non-elementary Bettin-Conrey period-function average identified in imp-97097: it has NEITHER an
 * absolute value NOR a square, so the Bettin-Conrey even-moment machinery that controls c_0(h/a)^2
 * over full residues (imp-97203 Result 3, Sum_h c_0^2 ~ C a^3) does NOT apply, and the a <-> b-a
 * antisymmetry that annihilates the FIXED-modulus half (imp-97097 Result 1) does NOT act on the
 * varying-modulus index. So the signed first moment is strictly HARDER than the absolute-first-moment
 * (imp-97180) or mean-square (imp-97203) objects: a Bettin-Conrey input for the DIRECT route would have
 * to supply a signed MEAN-VALUE (cancellation-preserving) estimate over the inverse map, precisely the
 * period-function average that has no closed form. The upshot is the useful reduction: for POSITIVITY
 * (kappa_cot > -kappa_arith) no such signed input is needed -- the absolute program dominates; the
 * signed mean value is required ONLY for a sharper constant, which changes no conclusion.
 *
 * -------------------------------------------------------------------------------
 * WHAT IS ESTABLISHED vs OPEN (this leaf).
 * -------------------------------------------------------------------------------
 * ESTABLISHED (rigorous): |S(b)| <= A(b) termwise for every b >= 2, so with |V(1,b)| = o(phi b b)
 * (imp-97119) the two-sided |kappa_cot| <= (pi/2)(c + o(1)) follows from any absolute bound
 * A(b) <= c phi b b; the operative lower bound kappa_cot > -kappa_arith holds once c < (2/pi) kappa_arith
 * = 0.36319 is certified. MEASURED (not proved): c ~ 0.145 (< 0.36319 by ~2.5x); |S|/A ~ 0.54 (the
 * discarded cancellation); kappa_cot ~ +0.12 stable. OPEN: a certified absolute c (the imp-97203 mean-
 * square + inverse-map equidistribution transfer) closes positivity; a DIRECT signed bound (sharper,
 * not needed for positivity) requires the signed Bettin-Conrey mean value, which stays non-elementary.
 * No bound moved.
 *
 * -------------------------------------------------------------------------------
 * VERDICT (honest; no bound moved).
 * -------------------------------------------------------------------------------
 * The absolute lower bound kappa_cot > -kappa_arith is NOT proved rigorously. The attempt (i) proves the
 * exact termwise domination |S(b)| <= A(b), which shows the operative lower bound (and the full two-sided
 * bound) on the signed varying-modulus half is IMPLIED by the absolute-value program already under attack
 * (imp-97180 -> imp-97203) with NO new Bettin-Conrey input, provided the absolute constant clears
 * c < (2/pi) kappa_arith = 0.36319; (ii) records that the operative comparison carries the -(pi/2) weight,
 * tightening the target from the 0.5705 named for the absolute program to 0.36319 (measured c ~ 0.145
 * clears both, so no conclusion changes); and (iii) pins the DIRECT signed route (which would exploit the
 * measured ~46% cancellation, |S|/A ~ 0.54, for a sharper constant) to the SIGNED Bettin-Conrey mean
 * value Sum_a c_0(h_a/a) -- the imp-97097 period-function average, with no absolute value or square, so
 * strictly harder than the absolute/mean-square objects. The measured kappa_cot ~ +0.12 stays MEASURED,
 * not proved. No bound on Lambda moves; T ~ 2.594e7 trace anchor; compute (N ~ 9916) binds first.
 * No refereed bound is changed; RH open; NO QED.
 *
 * RESIDUAL SUB-GAP (below): imp-97204-cotangent-signed-mean-value -- a DIRECT lower bound
 * S(b) = Sum_{a=2,(a,b)=1}^{b-1} V(b,a) >= -c_s phi(b) b with explicit c_s < |S|/A measured ~ 0.54
 * times the absolute constant (measured c_s ~ 0.079), the SIGNED Bettin-Conrey mean value over the
 * inverse line, needed ONLY for a sharper constant; positivity itself follows from the absolute program.
 *
 * @see imp-97097-route-m-cotangent-first-moment-reciprocity.js (fixed-modulus half = 0; S(b) isolated)
 * @see imp-97119-route-m-boundary-cotangent-asymptotic.js (V(1,b) = o(phi b b), rigorous)
 * @see imp-97180-route-m-cotangent-absvalue-bulk-firstmoment-obstruction.js (absolute A(b), c ~ 0.145)
 * @see imp-97203-route-m-cotangent-absvalue-first-moment-cauchy-schwarz.js (A(b) -> mean-square M2w)
 * @see imp-97155-route-m-first-moment-evaluation-cohort-index.js (the cohort index; kappa split)
 *
 * Ticket: imp-97204 (proof, opus-4-8, api-pool). Assessment + partial; NO QED.
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

// For a given b: signed sum S(b), absolute sum A(b), boundary -V(1,b), Phi(b), kappa_cot, and the
// cancellation ratio |S|/A. O(b^2); keep b small.
function signedPieces(b) {
  let phi = 0, S = 0, A = 0;
  for (let a = 2; a < b; a++) {
    if (gcd(a, b) !== 1) continue;
    phi += 1;
    const v = Vsum(b, a);
    S += v;
    A += Math.abs(v);
  }
  const negV1 = -Vsum(1, b);
  const Phi = negV1 + S;
  const den = phi * b;
  return {
    phi,
    signed: S / den, // S(b)/(phi b b) ~ -0.079
    abs: A / den, // A(b)/(phi b b) ~ 0.145 (imp-97180)
    cancel: A > 0 ? Math.abs(S) / A : 0, // |S|/A ~ 0.54 (the discarded cancellation)
    kappaCot: (-Math.PI / 2) * (Phi / den), // -(pi/2) Phi/(phi b b) ~ +0.12
    dominates: Math.abs(S) <= A + 1e-9, // triangle inequality |S| <= A (exact)
  };
}

const GAMMA = 0.5772156649015329;
const C_CONST = (Math.log(2 * Math.PI) - GAMMA) / 2; // (log 2pi - gamma)/2 = 0.6303307...
const KAPPA_ARITH = 1.5 * C_CONST - 3 / 8; // = 0.5704960511308594 (imp-97096, exact)
const SIGNED_THRESHOLD = (2 / Math.PI) * KAPPA_ARITH; // = 0.36318906... operative threshold on c

// MEASURED constants (tmp/imp-97204-scratch.mjs; b <= 2003).
export const IMP97204_MEASURED = Object.freeze({
  signedStable: -0.079, // S(b)/(phi b b): -0.0728 (101) -> -0.0774 (401) -> -0.0790 (2003), FLAT
  absStable: 0.145, // A(b)/(phi b b): 0.134 (101) -> 0.144 (401) -> 0.146 (2003), FLAT (imp-97180)
  cancellationRatio: 0.54, // |S|/A: 0.543 (101) -> 0.538 (401) -> 0.543 (2003), STABLE (~46% cancellation)
  kappaCot: 0.12, // -(pi/2) Phi/(phi b b): 0.097 (101) -> 0.116 (401) -> 0.123 (2003), climbing to ~+0.12
  kappaArith: 0.5704960511308594, // imp-97096 exact (3/2)C - 3/8
  signedThreshold: 0.36318906620753183, // (2/pi) kappa_arith: operative threshold on the absolute c
  marginBelowThreshold: 2.5, // 0.36319 / 0.145 ~ 2.5x (measured c clears the tighter threshold)
});

export const IMP97204_ATTEMPT = Object.freeze({
  target: 'kappa_cot > -kappa_arith (equivalently S(b) two-sidedly bounded) with a certified constant',
  domination: '|S(b)| = |Sum_a V(b,a)| <= Sum_a |V(b,a)| = A(b), exact termwise for every b >= 2',
  twoSidedFromAbsolute:
    'A(b) <= c phi b b and |V(1,b)| = o(phi b b) (imp-97119) => |kappa_cot| <= (pi/2)(c + o(1))',
  operativeThreshold:
    'kappa_cot > -kappa_arith holds once c < (2/pi) kappa_arith = 0.36318906620753183 (measured c ~ 0.145)',
  thresholdCarriesPiOverTwo:
    'the cotangent part of F is -(pi/2) Phi (imp-97097), so the target on A/(phi b b) is (2/pi) kappa_arith, tighter than the 0.5705 named for the absolute program; measured c ~ 0.145 clears both',
  cancellationDiscarded:
    'the signed half is ~46% smaller than the absolute majorant (|S|/A ~ 0.54): a direct signed bound is strictly sharper but NOT needed for positivity',
  directSignedNeedsSignedMeanValue:
    'a direct bound on S(b) needs the signed Bettin-Conrey mean value Sum_a c_0(h_a/a) over the inverse line -- no absolute value, no square, so even-moment machinery (imp-97203) does not apply',
});

export const IMP97204_VERDICT = Object.freeze({
  question:
    'prove an absolute lower bound kappa_cot > -kappa_arith on the operative varying-modulus half ' +
    'S(b) = Sum_{a=2,(a,b)=1}^{b-1} V(b,a) of the Route M cotangent first moment (imp-97155 open item)?',
  rigorousLowerBoundProved: false, // kappa_cot stays MEASURED ~+0.12, not proved
  signedDominatedByAbsolute: true, // |S(b)| <= A(b) exactly: two-sided bound follows from the absolute program
  twoSidedFromSingleAbsoluteConstant: true, // A(b) <= c phi b b => |kappa_cot| <= (pi/2)(c + o(1))
  operativeThresholdIsTwoOverPiKappaArith: true, // c < (2/pi) kappa_arith = 0.36319 (tighter than 0.5705)
  measuredClearsThreshold: true, // c ~ 0.145 < 0.36319 by ~2.5x
  noNewInputForPositivity: true, // positivity needs no signed mean value; the absolute program suffices
  directSignedNeedsSignedBettinConreyMeanValue: true, // sharper constant only; strictly harder than abs/square
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  computeBindsFirst: true,
  qed: false,
  conclusion:
    'The absolute lower bound kappa_cot > -kappa_arith is NOT proved rigorously. The attempt proves the ' +
    'exact termwise domination |S(b)| <= A(b), so the operative lower bound (and the full two-sided ' +
    'bound) on the signed varying-modulus half is IMPLIED by the absolute-value program already under ' +
    'attack (imp-97180 -> imp-97203) with NO new Bettin-Conrey input, once the absolute constant clears ' +
    'c < (2/pi) kappa_arith = 0.36319 (the -(pi/2) weight tightens the 0.5705 named for the absolute ' +
    'program; measured c ~ 0.145 clears both by ~2.5x). The direct signed route -- which would exploit ' +
    'the measured ~46% cancellation (|S|/A ~ 0.54) for a sharper constant -- requires the SIGNED ' +
    'Bettin-Conrey mean value Sum_a c_0(h_a/a) over the inverse line, with no absolute value or square, ' +
    'so strictly harder than the absolute/mean-square objects; it is needed only for sharpness, not for ' +
    'positivity. Measured kappa_cot ~ +0.12 stays measured, not proved. No bound moved; T ~ 2.594e7 ' +
    'anchor; compute N ~ 9916 binds first. No refereed bound is changed; RH open; NO QED.',
});

export const IMP97204_SUBGAP = Object.freeze({
  id: 'imp-97204-cotangent-signed-mean-value',
  statement:
    'a DIRECT lower bound S(b) = Sum_{a=2,(a,b)=1}^{b-1} V(b,a) >= -c_s phi(b) b with explicit c_s ' +
    '(measured c_s ~ 0.079 ~ 0.54 A), the SIGNED Bettin-Conrey mean value of the cotangent sum over the ' +
    'inverse line a |-> b-inverse mod a. This is needed ONLY for a sharper constant: POSITIVITY ' +
    '(kappa_cot > -kappa_arith) already follows from the absolute program (imp-97180 -> imp-97203) via ' +
    'the exact termwise domination |S(b)| <= A(b) once the absolute constant clears (2/pi) kappa_arith = ' +
    '0.36319 (measured c ~ 0.145). The signed mean value has no absolute value and no square, so the ' +
    'Bettin-Conrey even-moment machinery (imp-97203) and the a <-> b-a antisymmetry (imp-97097) do NOT ' +
    'apply -- it is a genuine cancellation-preserving period-function average, still non-elementary.',
});

export const IMP97204_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Assessment + partial only: the absolute lower bound ' +
  'kappa_cot > -kappa_arith is NOT proved. The exact termwise domination |S(b)| <= A(b) shows the ' +
  'operative lower bound (and full two-sided bound) on the signed varying-modulus half is IMPLIED by the ' +
  'absolute-value program already under attack (imp-97180 -> imp-97203), with NO new Bettin-Conrey ' +
  'input, once the absolute constant clears c < (2/pi) kappa_arith = 0.36319 (measured c ~ 0.145, ~2.5x ' +
  'margin). A direct signed bound (sharper, exploiting the measured ~46% cancellation |S|/A ~ 0.54) needs ' +
  'the signed Bettin-Conrey mean value Sum_a c_0(h_a/a), strictly harder than the absolute/mean-square ' +
  'objects; it is not needed for positivity. Measured kappa_cot ~ +0.12 stays measured. No bound moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97204_ASSERTIONS = [
  {
    id: 'imp97204-signed-dominated-by-absolute',
    holds: () => {
      // |S(b)| <= A(b) EXACTLY (triangle inequality) for even and odd b.
      for (const b of [101, 120, 211, 401]) {
        const p = signedPieces(b);
        if (!p.dominates) return false; // |S| <= A
        if (!(p.signed < 0)) return false; // signed half negative (~ -0.079)
        if (!(p.abs > Math.abs(p.signed))) return false; // absolute strictly larger (genuine cancellation)
      }
      return true;
    },
    why: 'the triangle inequality |S(b)| = |Sum_a V(b,a)| <= Sum_a |V(b,a)| = A(b) holds exactly for every b (checked even/odd b=101,120,211,401), and A > |S| strictly -- the signed half is dominated by the absolute one with genuine cancellation.',
  },
  {
    id: 'imp97204-cancellation-ratio-stable',
    holds: () => {
      // |S|/A ~ 0.54 stable (~46% cancellation the absolute route discards).
      for (const b of [101, 211, 401]) {
        const { cancel } = signedPieces(b);
        if (!(cancel > 0.5 && cancel < 0.6)) return false;
      }
      return true;
    },
    why: 'the cancellation ratio |S|/A is ~0.54 across b=101,211,401 (flat), so the signed half is ~46% smaller than the absolute majorant -- a direct signed bound would be sharper but is not needed for positivity.',
  },
  {
    id: 'imp97204-threshold-carries-pi-over-two',
    holds: () => {
      // The operative threshold on the absolute c is (2/pi) kappa_arith, tighter than kappa_arith,
      // and the measured c ~ 0.145 clears it with margin.
      if (Math.abs(SIGNED_THRESHOLD - 0.36318906620753183) > 1e-12) return false;
      if (!(SIGNED_THRESHOLD < KAPPA_ARITH)) return false; // tighter than the 0.5705 named for the absolute program
      // measured absolute c ~ 0.145 clears the tighter threshold with ~2x margin
      const cMeasured = signedPieces(401).abs;
      if (!(cMeasured < SIGNED_THRESHOLD / 2)) return false; // ~2.5x margin
      return true;
    },
    why: 'because the cotangent part of F is -(pi/2) Phi (imp-97097), the operative threshold on the absolute constant is (2/pi) kappa_arith = 0.36319, tighter than the 0.5705 named for the absolute program; the measured c ~ 0.145 clears even the tighter threshold by ~2.5x, so no conclusion changes.',
  },
  {
    id: 'imp97204-kappa-cot-positive-measured',
    holds: () => {
      // kappa_cot = -(pi/2) Phi/(phi b b) > 0 (measured), consistent with the domination bound.
      const p = signedPieces(401);
      if (!(p.kappaCot > 0)) return false;
      // domination bound: |kappa_cot| <= (pi/2)(A/(phi b b)) + boundary (loose, so use a comfortable slack)
      if (!(Math.abs(p.kappaCot) <= (Math.PI / 2) * p.abs + 0.05)) return false;
      return true;
    },
    why: 'kappa_cot = -(pi/2) Phi/(phi b b) is positive (measured ~+0.12 at b=401) and respects the domination bound |kappa_cot| <= (pi/2)(A/(phi b b)) + o(1) -- the two-sided control follows from the single absolute constant.',
  },
  {
    id: 'imp97204-honesty-gate-no-qed',
    holds: () =>
      IMP97204_VERDICT.rigorousLowerBoundProved === false &&
      IMP97204_VERDICT.signedDominatedByAbsolute === true &&
      IMP97204_VERDICT.twoSidedFromSingleAbsoluteConstant === true &&
      IMP97204_VERDICT.operativeThresholdIsTwoOverPiKappaArith === true &&
      IMP97204_VERDICT.noNewInputForPositivity === true &&
      IMP97204_VERDICT.directSignedNeedsSignedBettinConreyMeanValue === true &&
      IMP97204_VERDICT.anyBoundMoved === false &&
      IMP97204_VERDICT.postsRigorousCeiling === false &&
      IMP97204_VERDICT.qed === false &&
      /signed-mean-value/.test(IMP97204_SUBGAP.id) &&
      /SIGNED Bettin-Conrey mean value/.test(IMP97204_SUBGAP.statement) &&
      /NO QED/.test(IMP97204_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97204_HONEST_BANNER) &&
      /RH open/.test(IMP97204_HONEST_BANNER),
    why: 'assessment + partial: no rigorous lower bound; the operative lower bound is dominated by the absolute program via |S| <= A (no new input for positivity), and the direct signed route needs the signed Bettin-Conrey mean value -- no bound moved, no rigorous ceiling, honesty markers and the named residual sub-gap present.',
  },
];

for (const a of IMP97204_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97204-route-m-cotangent-signed-firstmoment-lower-bound assertion failed: ${a.id}`,
    );
  }
}

export default {
  measured: IMP97204_MEASURED,
  attempt: IMP97204_ATTEMPT,
  verdict: IMP97204_VERDICT,
  subGap: IMP97204_SUBGAP,
  banner: IMP97204_HONEST_BANNER,
};
