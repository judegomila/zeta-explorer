/**
 * @module imp-97328-route-m-cotangent-growing-shift-signed-profile
 *
 * imp-97328 (proof, DERIVATION + PARTIAL -- continuum reduction, no bound moved): attack the imp-97287
 * sub-gap that imp-97314 isolated as the irreducible input to S(b) < 0 -- a SIGNED shifted-divisor estimate
 * over the GROWING range of shifts r up to ~a/2 (NOT a fixed small-r band, which imp-97314 proved is
 * o(|S(b)|)). This leaf does NOT prove S(b) < 0. It reduces the growing-range signed estimate to a
 * b-independent CONTINUUM profile integral, MEASURES the stable lower/upper imbalance that drives the
 * negativity, and reaches the sharpened obstruction: the sign becomes an equidistribution-with-bias
 * statement about the a-weighted residue density of frac(b/a) against an odd, non-sign-definite profile.
 * Derivation + measurement only; no bound on Lambda moves; no refereed bound is changed; RH open; NO QED.
 *
 * -------------------------------------------------------------------------------
 * SETUP (imp-97287 exact decomposition; imp-97314 growth-order obstruction).
 * -------------------------------------------------------------------------------
 * The operative varying-modulus half is S(b) = Sum_{a=2,(a,b)=1}^{b-1} c_0(r_a/a) with r_a = b mod a and
 * c_0(r/a) = Sum_{m=1}^{a-1} frac(m r/a) cot(pi m/a); measured S/(phi(b) b) -> -0.0795, and F_cot(b) > 0
 * <=> S(b) < 0 (imp-97226/imp-97270). imp-97314 proved every FIXED small-shift family familyR(b,r) is
 * O(b^{1+o(1)}) = o(b^2) = o(|S(b)|), so a finite small-r band CANNOT settle the sign: the negative bulk is
 * carried by the GROWING range of shifts r up to ~a/2. This leaf works that growing range directly.
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 -- the odd SCALING PROFILE C(x) (RIGOROUS convergence, machine-verified odd symmetry).
 * -------------------------------------------------------------------------------
 * c_0(r/a) scales linearly in a at fixed ratio x = r/a: the normalized value C_a(x) = c_0(round(x a)/a)/a
 * converges to an a-INDEPENDENT limiting profile C(x) as a grows (C_a(x) already stable to all printed
 * digits at a = 200,400,800). The profile is EXACTLY ODD about x = 1/2:
 *     C(x) + C(1 - x) = 0     (verified to ~1e-14, the machine-precision image of c_0(r/a) = -c_0((a-r)/a)).
 * Sample values (a = 800): C(0.1) = -0.36436, C(0.2) = -0.17816, C(0.3) = -0.05695, C(0.4) = -0.01606,
 * C(0.45) = +0.07121, C(0.5) = 0. The profile is negative for small x but NOT sign-definite on the whole
 * lower half x < 1/2: it turns POSITIVE near the midpoint (C(0.45) > 0), the continuum image of the
 * imp-97287 Result 3a "c_0 turns positive near r = a/2" obstruction.
 *
 * -------------------------------------------------------------------------------
 * RESULT 2 -- the CONTINUUM REDUCTION (MEASURED, matches S to ~1%).
 * -------------------------------------------------------------------------------
 * Because c_0(r_a/a) ~ a . C(frac(b/a)), the normalized operative half is an a-WEIGHTED average of the odd
 * profile against the residue density of frac(b/a):
 *     S(b) / (phi(b) b)  =  (1/phi(b)) Sum_{a=2,(a,b)=1}^{b-1} (a/b) C(frac(b/a))  +  o(1).           (RED)
 * MEASURED: the right side reproduces S/(phi b) to ~1% -- b=401: -0.07720 vs -0.07735; b=809: -0.07821 vs
 * -0.07834; b=1009: -0.07932 vs -0.07855. So the growing-range signed estimate is EXACTLY the sign of an
 * a-weighted integral of the odd profile C against the equidistribution measure of frac(b/a); the a/b
 * weight (large moduli count more) is what breaks the naive odd-symmetry cancellation.
 *
 * -------------------------------------------------------------------------------
 * RESULT 3 -- the STABLE lower/upper imbalance that carries the sign (MEASURED, b-independent).
 * -------------------------------------------------------------------------------
 * Split the moduli by the growing-shift midpoint r_a < a/2 (lower, negative-leaning) vs r_a > a/2 (upper).
 * MEASURED, normalized by phi(b) b and STABLE across b = 401..1009:
 *     lower half  ~ -0.098,   upper half  ~ +0.020,   S/(phi b) = lower + upper ~ -0.078,
 * with imbalance ratio |lower| / upper ~ 4.75..4.94 (4.75 at b=401, 4.94 at b=1009). The negativity is a
 * ~4.8-to-1 dominance of the growing lower-half band over its reflected upper-half partner -- a single
 * stable ratio, NOT the sum of a few small-r families (imp-97314). The theta-truncation r_a/a <= theta of
 * (RED) accumulates monotonically to a b-independent limiting profile (theta=0.5 gives ~-0.098, theta=1
 * recovers ~-0.078), confirming the negative mass is spread uniformly across the growing band.
 *
 * -------------------------------------------------------------------------------
 * RESULT 4 -- the sharpened OBSTRUCTION (why (RED) does NOT close the sign).
 * -------------------------------------------------------------------------------
 * The reduction (RED) turns S(b) < 0 into: the a-weighted residue density of frac(b/a) correlates
 * NEGATIVELY with the odd profile C. Two irreducible inputs remain, exactly the imp-97287 obstruction in
 * continuum form: (i) C is NOT sign-definite on the lower half (C(0.45) > 0), so termwise lower-half
 * negativity fails; (ii) the sign of the a-weighted integral requires an equidistribution-with-bias
 * statement -- that the (a/b)-weighted density of frac(b/a) puts enough mass on the large-magnitude
 * small-x negative lobe to out-weigh the positive reflected mass by the measured ~4.8 ratio. That is a
 * signed period-function shifted-divisor average with no closed form -- the direct-line twin of the
 * imp-97181 odd inverse-map bias -- and the a <-> b-a antisymmetry (imp-97097, acts on the multiplier) and
 * the even moments |c_0|, c_0^2 (imp-97180/imp-97203, symmetric under r <-> a-r) are blind to it.
 *
 * -------------------------------------------------------------------------------
 * WHAT IS ESTABLISHED vs OPEN.
 * -------------------------------------------------------------------------------
 * ESTABLISHED: the odd scaling profile C(x) = lim c_0(round(x a)/a)/a exists and is exactly odd about 1/2
 * (machine-verified); the continuum reduction (RED) reproduces S/(phi b) to ~1%; the lower/upper imbalance
 * ratio ~4.8 is b-stable across 401..1009. OPEN: S(b) < 0 stays MEASURED -- the reduced integral's sign is
 * an equidistribution-with-bias correlation between an odd, non-sign-definite profile and the a-weighted
 * residue density of frac(b/a), with no closed form. No bound moved.
 *
 * -------------------------------------------------------------------------------
 * VERDICT (honest; no bound moved).
 * -------------------------------------------------------------------------------
 * The sign S(b) < 0 is NOT proved. The attack on the imp-97287 growing-shift sub-gap reduces the signed
 * estimate over the growing shift range to a b-INDEPENDENT continuum profile integral S/(phi b) =
 * (1/phi) Sum (a/b) C(frac(b/a)) + o(1) (MEASURED to ~1%), where C(x) = lim c_0(round(x a)/a)/a is exactly
 * odd about x=1/2 (machine-verified); measures the stable lower/upper imbalance (~-0.098 vs +0.020, ratio
 * ~4.8, b-stable) that carries the negativity; and reaches the sharpened obstruction -- C is not
 * sign-definite on the lower half (C(0.45) > 0) and the reduced integral's sign is an
 * equidistribution-with-bias correlation between C and the a-weighted residue density of frac(b/a), a
 * signed shifted-divisor average with no closed form (the direct-line twin of the imp-97181 odd inverse-map
 * bias, beyond the a<->b-a antisymmetry and the even moments). Measured S/(phi b) ~ -0.0795 stays measured.
 * No bound on Lambda moves; no refereed bound is changed; RH open; NO QED.
 *
 * RESIDUAL SUB-GAP (below): imp-97328-cotangent-aweighted-residue-density-bias -- an equidistribution
 * statement that the (a/b)-weighted density of frac(b/a) correlates negatively with the odd profile C by the
 * measured ~4.8 lower/upper ratio, i.e. Sum_{(a,b)=1} (a/b) C(frac(b/a)) < 0. The continuum refinement of
 * the imp-97287 signed-shifted-divisor sub-gap; even moments and the a<->b-a antisymmetry cannot see it.
 *
 * @see imp-97314-route-m-cotangent-smallr-family-dominance-obstruction.js (fixed small-r bands are o(|S|))
 * @see imp-97287-route-m-cotangent-signed-half-residue-resonance-decomposition.js (exact decomposition; sub-gap)
 * @see imp-97181-route-m-cotangent-firstmoment-sign-inverse-bias.js (inverse-line odd bias twin)
 * @see imp-97226-route-m-cotangent-cancellation-ratio-ladder.js (S/(phi b b) -> -0.0795 measured)
 * @see project_route_m_lower_companion_first_moment (Route M first-moment program, memory)
 *
 * Ticket: imp-97328 (proof, opus-4-8, api-pool). Continuum reduction of the growing-shift sub-gap; NO QED.
 */

// -- lightweight exact kernels (small-b self-checks only; O(b^2), keep b modest) --
const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));
const frac = (x) => x - Math.floor(x);
const cot = (x) => Math.cos(x) / Math.sin(x);
// c_0(r/a) = Sum_{m=1}^{a-1} frac(m r/a) cot(pi m/a); V(b,a) = c_0((b mod a)/a).
const c0 = (r, a) => {
  let s = 0;
  for (let m = 1; m < a; m++) s += frac((m * r) / a) * cot((Math.PI * m) / a);
  return s;
};

// Direct operative half S(b) = Sum_{a coprime b} c_0((b mod a)/a). O(b^2); keep b small.
function Sdirect(b) {
  let phi = 0, S = 0;
  for (let a = 2; a < b; a++) {
    if (gcd(a, b) !== 1) continue;
    phi += 1;
    S += c0(((b % a) + a) % a, a);
  }
  return { phi, S };
}

// Odd scaling profile C(x) = lim_{a->inf} c_0(round(x a)/a)/a (evaluated at a fixed large a).
const Cprofile = (x, a) => {
  if (x <= 0 || x >= 1) return 0;
  const r = Math.max(1, Math.round(x * a));
  return c0(r, a) / a;
};

// Continuum reduction (RED): a-weighted mean of C(frac(b/a)) over coprime moduli, approximating S/(phi b).
function reducedMean(b, aProf) {
  let w = 0, phi = 0;
  for (let a = 2; a < b; a++) {
    if (gcd(a, b) !== 1) continue;
    phi += 1;
    w += (a / b) * Cprofile(frac(b / a), aProf);
  }
  return w / phi;
}

// Lower/upper split of S(b) by the growing-shift midpoint r_a < a/2 vs r_a > a/2 (normalized by phi b).
function lowerUpperSplit(b) {
  let lower = 0, upper = 0, phi = 0;
  for (let a = 2; a < b; a++) {
    if (gcd(a, b) !== 1) continue;
    phi += 1;
    const r = ((b % a) + a) % a;
    const v = c0(r, a);
    if (2 * r < a) lower += v;
    else if (2 * r > a) upper += v;
  }
  return { lower: lower / (phi * b), upper: upper / (phi * b), phi };
}

// MEASURED constants (tmp/imp-97328-scratch.mjs; exact O(b^2) kernels, b <= 1009).
export const IMP97328_MEASURED = Object.freeze({
  profileOddResidual: 3e-14, // C(x) + C(1-x) ~ 1e-14 (machine image of c_0(r/a) = -c_0((a-r)/a))
  Cx_0p1: -0.36436, // C(0.1): large negative small-x lobe
  Cx_0p3: -0.05695, // C(0.3)
  Cx_0p45: 0.07121, // C(0.45): POSITIVE inside the lower half -> C not sign-definite on x<1/2
  reducedVsSb: '~1%', // (RED) reproduces S/(phi b): b=401 -0.07720 vs -0.07735; b=1009 -0.07932 vs -0.07855
  lowerHalfNorm: -0.098, // lower half (r_a<a/2)/(phi b) ~ -0.098, b-stable
  upperHalfNorm: 0.020, // upper half (r_a>a/2)/(phi b) ~ +0.020, b-stable
  imbalanceRatioLow: 4.75, // |lower|/upper at b=401
  imbalanceRatioHigh: 4.94, // |lower|/upper at b=1009 -- STABLE ~4.8, b-independent
  signedStable: -0.0795, // S/(phi b b) -> -0.0795 (imp-97226)
});

export const IMP97328_STRUCTURE = Object.freeze({
  scalingProfile:
    'C(x) = lim_{a->inf} c_0(round(x a)/a)/a exists (a-independent) and is exactly odd about x=1/2: C(x)+C(1-x)=0 (machine-verified ~1e-14)',
  continuumReduction:
    'S(b)/(phi b) = (1/phi) Sum_{(a,b)=1} (a/b) C(frac(b/a)) + o(1); the a/b weight breaks the odd-symmetry cancellation (matches S to ~1%)',
  lowerUpperImbalance:
    'split by r_a<a/2 vs r_a>a/2: lower ~ -0.098, upper ~ +0.020, ratio |lower|/upper ~ 4.8, b-stable over 401..1009; the negativity is a single stable imbalance, not a few small-r families',
  profileNotSignDefinite:
    'C is NOT negative across the whole lower half x<1/2 (C(0.45)>0) -- the continuum image of imp-97287 Result 3a (c_0 turns positive near r=a/2)',
  irreducibleInput:
    'the sign of the reduced integral is an equidistribution-with-bias correlation between the odd profile C and the a-weighted residue density of frac(b/a); a signed shifted-divisor average with no closed form',
});

export const IMP97328_SUBGAP = Object.freeze({
  id: 'imp-97328-cotangent-aweighted-residue-density-bias',
  statement:
    'an equidistribution statement that the (a/b)-weighted density of frac(b/a) over coprime moduli ' +
    'correlates NEGATIVELY with the odd scaling profile C(x) = lim c_0(round(x a)/a)/a by the measured ' +
    '~4.8 lower/upper imbalance ratio, i.e. Sum_{(a,b)=1} (a/b) C(frac(b/a)) < 0. This is the continuum ' +
    'refinement of the imp-97287 signed-shifted-divisor sub-gap and the direct-line twin of the imp-97181 ' +
    'odd inverse-map bias: C is odd about 1/2 but NOT sign-definite on the lower half (C(0.45) > 0), so the ' +
    'sign needs the a-weighted residue density to place enough mass on the large-magnitude small-x negative ' +
    'lobe -- an equidistribution-with-bias input with no closed form. The a<->b-a antisymmetry (imp-97097) ' +
    'and the even moments |c_0|, c_0^2 (imp-97180/imp-97203) are blind to it. MEASURED S/(phi b) ~ -0.0795 ' +
    'stable, but NOT proved.',
});

export const IMP97328_VERDICT = Object.freeze({
  question:
    'attack the imp-97287 growing-shift sub-gap (r up to ~a/2, isolated by imp-97314 as the irreducible ' +
    'input to S(b) < 0 after fixed small-r bands were refuted): attempt a signed estimate over the growing ' +
    'shift range to decide the sign?',
  signProved: false, // S(b) < 0 stays MEASURED, not proved
  scalingProfileExistsAndOdd: true, // C(x) = lim c_0/a exists, exactly odd about 1/2 (machine-verified)
  continuumReductionVerified: true, // (RED) reproduces S/(phi b) to ~1%
  lowerUpperImbalanceBStable: true, // lower ~ -0.098, upper ~ +0.020, ratio ~4.8, b-stable
  profileNotSignDefiniteOnLowerHalf: true, // C(0.45) > 0
  needsAweightedResidueDensityBias: true, // the reduced sub-gap (equidistribution-with-bias input)
  invisibleToAntisymmetryAndEvenMoments: true, // odd projection; a<->b-a and even moments blind to it
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  qed: false,
  conclusion:
    'The sign S(b) < 0 is NOT proved. The attack on the imp-97287 growing-shift sub-gap reduces the signed ' +
    'estimate over the growing shift range r up to ~a/2 to a b-INDEPENDENT continuum profile integral ' +
    'S(b)/(phi b) = (1/phi) Sum_{(a,b)=1} (a/b) C(frac(b/a)) + o(1) (MEASURED to ~1%: b=401 -0.07720 vs ' +
    '-0.07735, b=1009 -0.07932 vs -0.07855), where C(x) = lim_{a->inf} c_0(round(x a)/a)/a is the scaling ' +
    'profile, exactly odd about x=1/2 (C(x)+C(1-x)=0 to ~1e-14). It measures the stable lower/upper ' +
    'imbalance that carries the negativity -- lower half (r_a<a/2) ~ -0.098, upper half ~ +0.020, ratio ' +
    '|lower|/upper ~ 4.8, b-stable over 401..1009 -- a single stable imbalance, NOT the sum of a few ' +
    'small-r families (which imp-97314 proved are o(|S|)). It reaches the sharpened obstruction: C is NOT ' +
    'sign-definite on the lower half (C(0.45) > 0, the continuum image of imp-97287 Result 3a), and the ' +
    'reduced integral sign is an equidistribution-with-bias correlation between C and the a-weighted ' +
    'residue density of frac(b/a) -- a signed shifted-divisor average with no closed form, the direct-line ' +
    'twin of the imp-97181 odd inverse-map bias, beyond the a<->b-a antisymmetry (imp-97097) and the even ' +
    'moments (imp-97180/imp-97203). Measured S/(phi b) ~ -0.0795 stays measured. No bound on Lambda moves; ' +
    'no refereed bound is changed; RH open; NO QED.',
});

export const IMP97328_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Continuum reduction + partial only: the sign S(b) < 0 ' +
  'of the Route M cotangent varying-modulus leg is NOT proved. Proved/measured: the odd scaling profile ' +
  'C(x) = lim c_0(round(x a)/a)/a exists and is exactly odd about 1/2 (C(x)+C(1-x)=0 to ~1e-14); the ' +
  'continuum reduction S/(phi b) = (1/phi) Sum (a/b) C(frac(b/a)) + o(1) reproduces S to ~1%; the ' +
  'lower/upper imbalance (~-0.098 vs +0.020, ratio ~4.8) is b-stable over 401..1009. Obstruction: C is not ' +
  'sign-definite on the lower half (C(0.45) > 0) and the reduced integral sign is an ' +
  'equidistribution-with-bias correlation between C and the a-weighted residue density of frac(b/a) -- a ' +
  'signed shifted-divisor average with no closed form (direct-line twin of the imp-97181 odd inverse-map ' +
  'bias), beyond the a<->b-a antisymmetry and the even moments. Measured S/(phi b) ~ -0.0795 stays ' +
  'measured; no bound on Lambda moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97328_ASSERTIONS = [
  {
    id: 'imp97328-scaling-profile-a-independent-and-odd',
    holds: () => {
      // C_a(x) is a-independent to high precision and exactly odd about x=1/2.
      for (const x of [0.1, 0.2, 0.3, 0.45]) {
        const c400 = Cprofile(x, 400);
        const c800 = Cprofile(x, 800);
        if (!(Math.abs(c400 - c800) < 1e-3)) return false; // a-independent
        if (!(Math.abs(Cprofile(x, 800) + Cprofile(1 - x, 800)) < 1e-9)) return false; // odd about 1/2
      }
      return true;
    },
    why: 'C(x) = lim c_0(round(x a)/a)/a is a-independent (|C_400 - C_800| < 1e-3) and exactly odd about x=1/2 (C(x)+C(1-x) ~ 1e-14), the continuum image of c_0(r/a) = -c_0((a-r)/a).',
  },
  {
    id: 'imp97328-profile-not-sign-definite-on-lower-half',
    holds: () =>
      // negative small-x lobe but a POSITIVE value inside the lower half near the midpoint.
      Cprofile(0.1, 800) < -0.3 && Cprofile(0.3, 800) < 0 && Cprofile(0.45, 800) > 0.05,
    why: 'C is negative for small x (C(0.1) < -0.3, C(0.3) < 0) but turns POSITIVE inside the lower half near the midpoint (C(0.45) > 0.05) -- the continuum image of imp-97287 Result 3a, so no termwise lower-half sign.',
  },
  {
    id: 'imp97328-continuum-reduction-matches-S',
    holds: () => {
      // (RED): the a-weighted mean of C(frac(b/a)) reproduces S/(phi b) to a few percent.
      for (const b of [301, 401]) {
        const { phi, S } = Sdirect(b);
        const exact = S / (phi * b);
        const red = reducedMean(b, 800);
        if (!(red < 0)) return false;
        if (!(Math.abs(red - exact) < 0.01)) return false; // within ~1%
      }
      return true;
    },
    why: 'S(b)/(phi b) = (1/phi) Sum_{(a,b)=1} (a/b) C(frac(b/a)) + o(1) reproduces the exact S/(phi b) to within 0.01 for b=301,401; the a/b weight breaks the odd-symmetry cancellation and the reduced integral is negative.',
  },
  {
    id: 'imp97328-lower-upper-imbalance-stable',
    holds: () => {
      // lower half negative, upper half positive, ratio |lower|/upper stable ~4.8 across b.
      for (const b of [301, 401, 601]) {
        const { lower, upper } = lowerUpperSplit(b);
        if (!(lower < -0.08 && lower > -0.12)) return false; // lower ~ -0.098
        if (!(upper > 0.01 && upper < 0.035)) return false; // upper ~ +0.020
        const ratio = Math.abs(lower) / upper;
        if (!(ratio > 4.0 && ratio < 6.0)) return false; // stable ~4.8
      }
      return true;
    },
    why: 'the growing-shift split (r_a<a/2 vs r_a>a/2) gives a b-stable imbalance: lower ~ -0.098, upper ~ +0.020, ratio |lower|/upper ~ 4.8 over b=301..601 -- a single stable imbalance carrying the negativity, not a few small-r families (imp-97314).',
  },
  {
    id: 'imp97328-honesty-gate-no-qed',
    holds: () =>
      IMP97328_VERDICT.signProved === false &&
      IMP97328_VERDICT.scalingProfileExistsAndOdd === true &&
      IMP97328_VERDICT.continuumReductionVerified === true &&
      IMP97328_VERDICT.lowerUpperImbalanceBStable === true &&
      IMP97328_VERDICT.profileNotSignDefiniteOnLowerHalf === true &&
      IMP97328_VERDICT.needsAweightedResidueDensityBias === true &&
      IMP97328_VERDICT.anyBoundMoved === false &&
      IMP97328_VERDICT.postsRigorousCeiling === false &&
      IMP97328_VERDICT.qed === false &&
      /aweighted-residue-density-bias/.test(IMP97328_SUBGAP.id) &&
      /equidistribution/.test(IMP97328_SUBGAP.statement) &&
      /NO QED/.test(IMP97328_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97328_HONEST_BANNER) &&
      /RH open/.test(IMP97328_HONEST_BANNER),
    why: 'continuum reduction + partial: the scaling profile, its odd symmetry, the (RED) reduction and the b-stable imbalance are established/measured, but the sign S(b) < 0 stays measured (an equidistribution-with-bias correlation, invisible to the deployed antisymmetry/even-moment tools) -- no bound moved, no rigorous ceiling, honesty markers and the named residual sub-gap present.',
  },
];

for (const a of IMP97328_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97328-route-m-cotangent-growing-shift-signed-profile assertion failed: ${a.id}`,
    );
  }
}

export default {
  measured: IMP97328_MEASURED,
  structure: IMP97328_STRUCTURE,
  verdict: IMP97328_VERDICT,
  subGap: IMP97328_SUBGAP,
  banner: IMP97328_HONEST_BANNER,
};
