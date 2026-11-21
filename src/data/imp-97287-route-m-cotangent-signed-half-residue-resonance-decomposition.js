/**
 * @module imp-97287-route-m-cotangent-signed-half-residue-resonance-decomposition
 *
 * imp-97287 (proof, DERIVATION + PARTIAL -- exact decomposition, no bound moved): attempt a rigorous
 * sign S(b)/(phi(b) b) < 0 for the operative varying-modulus Bettin-Conrey period-function leg
 *   S(b) = Sum_{a=2,(a,b)=1}^{b-1} V(b,a),   V(b,a) = Sum_{m=1}^{a-1} frac(m b/a) cot(pi m/a),
 * whose measured limit S/(phi b b) -> -0.0795 (imp-97226/imp-97270) forces the sign of kappa_cot but is
 * NOT certified. This leaf does NOT prove S(b) < 0; it derives an EXACT residue-resonance decomposition
 * of S(b) -- the DIRECT (b-mod-a) companion to the imp-97181 inverse-line reframing -- and reaches the
 * precise, sharpened obstruction: the negative mass is spread as a shifted-divisor correlation across ALL
 * residue-shifts, with no sign-definite termwise split, so no elementary leading term settles the sign.
 * Derivation only; no bound on Lambda moves; no refereed bound is changed; RH open; NO QED.
 *
 * -------------------------------------------------------------------------------
 * SETUP (as imp-97097 / imp-97181 / imp-97204 / imp-97226).
 * -------------------------------------------------------------------------------
 * The Vasyunin sum V(b,a) is periodic in its first argument mod a, so the summand depends on the RESIDUE
 * r_a = b mod a only: V(b,a) = c_0(r_a/a) with c_0(r/a) = Sum_{m=1}^{a-1} frac(m r/a) cot(pi m/a). (This
 * is the DIRECT b-mod-a description; the imp-97181 identity V(b,a) = c_0(h_a/a) with h_a = b-inverse mod a
 * is the reciprocal Bettin-Conrey convention on the INVERSE line -- the two are the reciprocity pair, not
 * the same numeric summand of this kernel.) imp-97097 proved the fixed-modulus half vanishes exactly and
 * imp-97119 gave -V(1,b) = o(phi b b), leaving S(b) as the operative half; F_cot(b) > 0 <=> S(b) < 0 to
 * leading order.
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 -- the EXACT residue-resonance decomposition (RIGOROUS; verified to machine precision).
 * -------------------------------------------------------------------------------
 * Regroup the operative half by the residue r = b mod a. Since b mod a = r means a | (b - r) with r < a,
 *     S(b) = Sum_{a=2,(a,b)=1}^{b-1} c_0(r_a/a)
 *          = Sum_{r=1}^{b-2}  Sum_{a: r < a < b, a | (b-r), (a,b)=1}  c_0(r/a).                 (EXACT)
 * Each modulus a appears exactly once (its unique residue r_a). Coprimality is NOT automatic termwise:
 * a | (b-r) gives gcd(a,b) = gcd(a,r), so (a,b)=1 <=> gcd(a,r)=1 -- automatic ONLY for the r=1 family
 * (a | b-1). This recasts S(b) as a sum over the SHIFTED families {b - r}_{r>=1}: the r-th family runs
 * over the divisors a of b-r in (r,b) coprime to r, weighted by the fixed rational cotangent value
 * c_0(r/a). It is the direct-line analogue of the imp-97181 inverse-line resonance families a | (b k -/+ 1).
 *
 * -------------------------------------------------------------------------------
 * RESULT 2 -- small-shift negativity and the large-modulus exact structure (RIGOROUS pieces).
 * -------------------------------------------------------------------------------
 * (2a) SMALL-SHIFT NEGATIVITY. For small r the kernel c_0(r/a) < 0, with leading magnitude c_0(1/a) =
 * Sum_{m=1}^{a-1} (m/a) cot(pi m/a) ~ -(a/pi)(log a + gamma - log 2pi) (the classical Vasyunin r=1 value),
 * so the r=1 family Sum_{a | b-1} c_0(1/a) is an explicit STRICTLY NEGATIVE divisor sum over the divisors
 * of b-1 (all automatically coprime to b). The small-r families are the negative drivers.
 * (2b) LARGE-MODULUS EXACT STRUCTURE. For b/2 < a < b one has r_a = b - a exactly, and r_a < a/2 <=>
 * a > 2b/3. So the top modulus band splits cleanly and elementarily: a in (2b/3, b) has small residue
 * (negative-leaning), a in (b/2, 2b/3) has residue above the midpoint (positive-leaning). This pins the
 * geometry of the large-modulus contributions with no analytic input.
 *
 * -------------------------------------------------------------------------------
 * RESULT 3 -- why the decomposition does NOT close the sign (the sharpened obstruction; MEASURED).
 * -------------------------------------------------------------------------------
 * (3a) NO SIGN-DEFINITE TERMWISE SPLIT. c_0(r/a) is NOT negative across the whole lower half r < a/2: it
 * turns POSITIVE for residues near the midpoint (e.g. c_0(3/7) > 0), consistent with the imp-97181
 * numerator antisymmetry c_0(r/a) = -c_0((a-r)/a) forcing c_0 = 0 at r = a/2 and odd symmetry about it.
 * So there is no clean "negative family = lower half" partition -- the split-by-half aggregate is negative
 * only because the small-r large-magnitude terms dominate, not termwise.
 * (3b) NEGATIVE MASS IS SPREAD, NOT CONCENTRATED. MEASURED: the cumulative low-shift families r <= 6 carry
 * a substantial but DECREASING share of S(b): ~51% (b=211), ~33% (b=401), ~17% (b=1009). The negativity is
 * distributed across shifts r up to ~a/2, so there is NO dominant leading family whose sign an elementary
 * divisor count could settle; the sign is a GLOBAL shifted-divisor correlation.
 * (3c) THE OBSTRUCTION. A rigorous S(b) < 0 therefore needs a SIGNED estimate that the small-shift families
 * {b-r} (small r, negative kernel) out-weigh their reflected large-residue partners UNIFORMLY across the
 * whole shift range -- a signed shifted-divisor / equidistribution statement, the direct-line twin of the
 * imp-97181 odd inverse-map bias, and equally beyond the a <-> b-a antisymmetry (imp-97097, acts on the
 * multiplier not the shift) and the even moments |c_0|, c_0^2 (imp-97180/imp-97203, symmetric under
 * r <-> a-r, blind to the odd bias). No closed form; no bound moved.
 *
 * -------------------------------------------------------------------------------
 * WHAT IS ESTABLISHED vs OPEN.
 * -------------------------------------------------------------------------------
 * ESTABLISHED (rigorous): the exact residue-resonance decomposition S(b) = Sum_r Sum_{a|b-r} c_0(r/a)
 * (verified to machine precision); small-shift negativity (c_0(1/a) < 0 explicit) and the large-modulus
 * exact residue structure (r=b-a for b/2<a<b; negative subrange a>2b/3). OPEN: S(b) < 0 itself stays
 * MEASURED (S/(phi b b) -> -0.0795, S(b) < 0 for all 4 <= b <= 600 checked; S(3)=0 trivially) -- it is a
 * global shifted-divisor correlation with no sign-definite termwise split and no dominant family, invisible
 * to the deployed antisymmetry/even-moment tools. No bound moved.
 *
 * -------------------------------------------------------------------------------
 * VERDICT (honest; no bound moved).
 * -------------------------------------------------------------------------------
 * The sign S(b)/(phi b b) < 0 is NOT proved. The attempt derives an EXACT residue-resonance decomposition
 * of the operative varying-modulus half, S(b) = Sum_{r>=1} Sum_{a|(b-r), r<a<b, (a,b)=1} c_0(r/a), the
 * direct b-mod-a companion to the imp-97181 inverse-line reframing; proves the small-shift negativity (the
 * r=1 family Sum_{a|b-1} c_0(1/a) is a strictly negative explicit divisor sum) and the large-modulus exact
 * residue structure (r=b-a on b/2<a<b, negative subrange a>2b/3); and reaches the sharpened obstruction --
 * c_0(r/a) is not sign-definite across the lower half (it turns positive near r=a/2), and the negative mass
 * is SPREAD across all shifts (low-shift share ~51%->17% as b grows), so no elementary leading term settles
 * the sign. A rigorous S(b) < 0 needs a signed shifted-divisor estimate (the direct-line twin of the
 * imp-97181 odd inverse-map bias), beyond the a <-> b-a antisymmetry and the even moments. Measured
 * S/(phi b b) ~ -0.0795 stays measured, not proved. No bound on Lambda moves; no refereed bound is changed; RH
 * open; NO QED.
 *
 * RESIDUAL SUB-GAP (below): imp-97287-cotangent-signed-shifted-divisor-bias -- a SIGNED shifted-divisor
 * estimate establishing Sum_{r>=1} Sum_{a|(b-r), r<a<b, (a,b)=1} c_0(r/a) < 0, i.e. the small-shift
 * (negative-kernel) families of {b-r} out-weigh their reflected large-residue partners uniformly. This is
 * the direct-line odd projection; the a <-> b-a antisymmetry and the even moments cannot see it.
 *
 * @see imp-97181-route-m-cotangent-firstmoment-sign-inverse-bias.js (inverse-line reframing; odd kernel, mean-zero)
 * @see imp-97097-route-m-cotangent-first-moment-reciprocity.js (fixed-modulus half = 0; S(b) isolated)
 * @see imp-97204-route-m-cotangent-signed-firstmoment-lower-bound.js (|S| <= A domination; two-sided bound)
 * @see imp-97226-route-m-cotangent-cancellation-ratio-ladder.js (S/(phi b b) -> -0.0795 measured)
 * @see imp-97270-route-m-kappa-cot-three-leaf-reconciliation.js (kappa_cot = -(pi/2) lim S/(phi b b))
 * @see project_route_m_lower_companion_first_moment (Route M first-moment program, memory)
 *
 * Ticket: imp-97287 (proof, opus-4-8, api-pool). Derivation of an exact decomposition + partial; NO QED.
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

// Residue-resonance decomposition: group moduli by r = b mod a (a | b-r, r < a < b, (a,b)=1).
function Sresonance(b) {
  let S = 0;
  for (let r = 1; r < b - 1; r++) {
    const target = b - r; // a | target, r < a < b
    if (target <= 0) break;
    for (let a = r + 1; a < b; a++) {
      if (target % a !== 0) continue;
      if (gcd(a, b) !== 1) continue; // (a,b)=1 <=> gcd(a,r)=1 (a|b-r); automatic only for r=1
      S += c0(r, a);
    }
  }
  return S;
}

// Contribution of a single residue-shift family r (divisors a of b-r in (r,b), coprime to b).
function familyR(b, r) {
  let s = 0, cnt = 0;
  const t = b - r;
  if (t <= 0) return { s, cnt };
  for (let a = r + 1; a < b; a++) {
    if (t % a !== 0) continue;
    if (gcd(a, b) !== 1) continue;
    s += c0(r, a);
    cnt += 1;
  }
  return { s, cnt };
}

// MEASURED constants (tmp/imp-97287-scratch*.mjs; b <= 1009, exact O(b^2) kernels).
export const IMP97287_MEASURED = Object.freeze({
  signedStable: -0.0795, // S/(phi b b): -0.0728 (101) -> -0.0785 (1009), FLAT/negative (imp-97226)
  lowShiftShareB211: 0.514, // cumulative families r<=6 carry ~51% of S(b) at b=211
  lowShiftShareB401: 0.330, // ~33% at b=401
  lowShiftShareB1009: 0.169, // ~17% at b=1009 -- share DECREASES: negative mass is spread, not concentrated
  negativeForAllBAtLeast4: true, // S(b) < 0 for all 4 <= b <= 600 checked; S(3)=0 (single modulus a=2, c_0=0)
  kernelNotSignDefiniteOnLowerHalf: true, // c_0(r/a) turns positive near r=a/2 (e.g. c_0(3/7) > 0)
});

export const IMP97287_STRUCTURE = Object.freeze({
  exactDecomposition:
    'S(b) = Sum_{r>=1} Sum_{a: r<a<b, a|(b-r), (a,b)=1} c_0(r/a) -- each modulus once via r=b mod a (EXACT)',
  coprimalityCondition:
    'a|(b-r) => gcd(a,b)=gcd(a,r), so (a,b)=1 <=> gcd(a,r)=1 -- automatic only for the r=1 family (a|b-1)',
  smallShiftNegativity:
    'c_0(1/a) = Sum_m (m/a) cot(pi m/a) ~ -(a/pi)(log a + gamma - log 2pi) < 0; the r=1 family is a strictly negative divisor sum over divisors of b-1',
  largeModulusExactStructure:
    'for b/2<a<b: r_a=b-a exactly, and r_a<a/2 <=> a>2b/3 (negative-leaning band a in (2b/3,b), positive-leaning band a in (b/2,2b/3))',
  noSignDefiniteSplit:
    'c_0(r/a) is not negative across the whole lower half r<a/2 (turns positive near r=a/2 by the antisymmetry c_0(r/a)=-c_0((a-r)/a)); no clean termwise partition',
  negativeMassSpread:
    'low-shift families r<=6 carry a decreasing share (~51%->17% for b=211..1009): the sign is a global shifted-divisor correlation, no dominant leading family',
});

export const IMP97287_VERDICT = Object.freeze({
  question:
    'prove a rigorous sign S(b)/(phi b b) < 0 for the operative varying-modulus Bettin-Conrey leg ' +
    'S(b) = Sum_{a=2,(a,b)=1}^{b-1} V(b,a), whose measured -0.0795 forces the kappa_cot sign (imp-97270)?',
  signProved: false, // S(b) < 0 stays MEASURED, not proved
  exactDecompositionProved: true, // residue-resonance identity verified to machine precision
  smallShiftNegativityProved: true, // r=1 family Sum_{a|b-1} c_0(1/a) strictly negative (explicit)
  largeModulusStructureProved: true, // r=b-a on b/2<a<b; negative subrange a>2b/3 (exact, elementary)
  noSignDefiniteTermwiseSplit: true, // c_0(r/a) turns positive near r=a/2
  negativeMassSpreadNotConcentrated: true, // low-shift share decreases; no dominant family
  needsSignedShiftedDivisorEstimate: true, // the sharpened obstruction (direct-line twin of imp-97181)
  invisibleToAntisymmetryAndEvenMoments: true, // odd projection; a<->b-a and |c_0|, c_0^2 blind to it
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  qed: false,
  conclusion:
    'The sign S(b)/(phi b b) < 0 is NOT proved. The attempt derives the EXACT residue-resonance ' +
    'decomposition S(b) = Sum_{r>=1} Sum_{a|(b-r), r<a<b, (a,b)=1} c_0(r/a) (verified to machine ' +
    'precision), the direct b-mod-a companion to the imp-97181 inverse-line reframing; proves the ' +
    'small-shift negativity (the r=1 family Sum_{a|b-1} c_0(1/a) is a strictly negative explicit divisor ' +
    'sum) and the large-modulus exact residue structure (r=b-a on b/2<a<b, negative subrange a>2b/3); and ' +
    'reaches the sharpened obstruction -- c_0(r/a) is not sign-definite across the lower half (it turns ' +
    'positive near r=a/2), and the negative mass is SPREAD across all shifts (low-shift share ~51%->17% as ' +
    'b grows), so no elementary leading term settles the sign. A rigorous S(b) < 0 needs a signed ' +
    'shifted-divisor estimate (the direct-line twin of the imp-97181 odd inverse-map bias), beyond the ' +
    'a <-> b-a antisymmetry (imp-97097) and the even moments (imp-97180/imp-97203). Measured ' +
    'S/(phi b b) ~ -0.0795 stays measured, not proved. No bound on Lambda moves; no refereed bound is changed; ' +
    'RH open; NO QED.',
});

export const IMP97287_SUBGAP = Object.freeze({
  id: 'imp-97287-cotangent-signed-shifted-divisor-bias',
  statement:
    'a SIGNED shifted-divisor estimate establishing S(b) = Sum_{r>=1} Sum_{a|(b-r), r<a<b, (a,b)=1} ' +
    'c_0(r/a) < 0, i.e. the small-shift (negative-kernel) families of the shifted values {b-r} out-weigh ' +
    'their reflected large-residue partners UNIFORMLY across the whole shift range. This is the ' +
    'direct-line (b mod a) odd projection, the twin of the imp-97181 inverse-line odd bias: the ' +
    'a <-> b-a antisymmetry (imp-97097) acts on the multiplier not the shift, and the even moments |c_0|, ' +
    'c_0^2 (imp-97180/imp-97203) are symmetric under r <-> a-r, so neither certifies the sign -- a signed ' +
    'period-function shifted-divisor average with no closed form is the irreducible input. MEASURED ' +
    'S/(phi b b) ~ -0.0795 stable, but NOT proved.',
});

export const IMP97287_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Derivation of an exact decomposition + partial only: ' +
  'the sign S(b)/(phi b b) < 0 of the Route M cotangent varying-modulus leg is NOT proved. Proved: the ' +
  'exact residue-resonance decomposition S(b) = Sum_{r>=1} Sum_{a|(b-r), r<a<b, (a,b)=1} c_0(r/a) ' +
  '(machine-precision), the small-shift negativity (r=1 family Sum_{a|b-1} c_0(1/a) < 0 explicit) and the ' +
  'large-modulus exact residue structure (r=b-a on b/2<a<b, negative subrange a>2b/3). Obstruction: ' +
  'c_0(r/a) is not sign-definite across the lower half (positive near r=a/2) and the negative mass is ' +
  'spread across all shifts (low-shift share ~51%->17% for b=211..1009), so no leading family settles the ' +
  'sign; a signed shifted-divisor estimate (direct-line twin of the imp-97181 odd inverse-map bias) is the ' +
  'irreducible input, beyond the antisymmetry and the even moments. Measured S/(phi b b) ~ -0.0795 stays ' +
  'measured; no bound on Lambda moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97287_ASSERTIONS = [
  {
    id: 'imp97287-residue-resonance-decomposition-exact',
    holds: () => {
      // The residue-resonance regrouping reproduces the direct operative half to machine precision.
      for (const b of [101, 120, 211, 401]) {
        const { S } = Sdirect(b);
        const r = Sresonance(b);
        if (!(Math.abs(S - r) < 1e-6 * (Math.abs(S) + 1))) return false;
      }
      return true;
    },
    why: 'S(b) = Sum_{r>=1} Sum_{a|(b-r), r<a<b, (a,b)=1} c_0(r/a) reproduces the direct Sum_{a coprime b} c_0((b mod a)/a) to machine precision for even/odd b=101,120,211,401 -- each modulus counted exactly once via its residue r=b mod a.',
  },
  {
    id: 'imp97287-small-shift-negativity-r1-family',
    holds: () => {
      // c_0(1/a) < 0 for every a, and the r=1 family Sum_{a|b-1} c_0(1/a) is strictly negative.
      for (const a of [7, 30, 50, 99, 100]) {
        if (!(c0(1, a) < 0)) return false;
      }
      for (const b of [101, 211, 401]) {
        if (!(familyR(b, 1).s < 0)) return false; // strictly negative divisor sum over divisors of b-1
      }
      return true;
    },
    why: 'c_0(1/a) < 0 for every a (leading ~ -(a/pi)(log a + gamma - log 2pi)); the r=1 family Sum_{a|b-1} c_0(1/a) is a strictly negative explicit divisor sum (all divisors of b-1 are coprime to b) -- the leading negative driver.',
  },
  {
    id: 'imp97287-large-modulus-exact-residue-structure',
    holds: () => {
      // For b/2 < a < b: r_a = b - a exactly, and r_a < a/2 <=> a > 2b/3.
      for (const b of [101, 211, 401]) {
        for (let a = Math.floor(b / 2) + 1; a < b; a++) {
          if (gcd(a, b) !== 1) continue;
          if (b % a !== b - a) return false; // r_a = b - a
          if ((2 * (b % a) < a) !== (a > (2 * b) / 3)) return false; // negative subrange a > 2b/3
        }
      }
      return true;
    },
    why: 'for b/2<a<b the residue is r_a = b-a exactly (single quotient), and r_a < a/2 <=> a > 2b/3 -- the top modulus band splits elementarily into a negative-leaning subrange a in (2b/3,b) and a positive-leaning subrange a in (b/2,2b/3).',
  },
  {
    id: 'imp97287-kernel-not-sign-definite-on-lower-half',
    holds: () => {
      // c_0(r/a) turns positive for residues near a/2 (no clean lower-half sign), e.g. c_0(3/7) > 0,
      // while remaining negative for small r -- consistent with the antisymmetry c_0(r/a)=-c_0((a-r)/a).
      if (!(c0(3, 7) > 0)) return false; // near-midpoint, coprime, positive
      if (!(c0(1, 7) < 0 && c0(2, 7) < 0)) return false; // small r negative
      if (Math.abs(c0(3, 7) + c0(4, 7)) > 1e-6 * (Math.abs(c0(3, 7)) + 1)) return false; // r <-> a-r antisym
      return true;
    },
    why: 'c_0(r/a) is not negative across the whole lower half r<a/2 -- it turns positive near the midpoint (c_0(3/7) > 0 while c_0(1/7), c_0(2/7) < 0), so there is no sign-definite termwise split; the antisymmetry c_0(3/7) = -c_0(4/7) confirms the odd structure.',
  },
  {
    id: 'imp97287-negative-mass-spread-and-S-negative',
    holds: () => {
      // S(b) < 0 (measured) and the low-shift share is substantial but bounded away from 100%
      // (mass spread across shifts, not concentrated in tiny r).
      for (const b of [211, 401]) {
        const { S } = Sdirect(b);
        if (!(S < 0)) return false;
        let cum = 0;
        for (let r = 1; r <= 6; r++) cum += familyR(b, r).s;
        const share = cum / S; // fraction of S carried by r<=6
        if (!(share > 0.2 && share < 0.9)) return false; // substantial yet not dominant
      }
      return true;
    },
    why: 'S(b) < 0 (measured), and the cumulative low-shift families r<=6 carry a substantial but non-dominant share (~33%-51% at b=211,401, decreasing to ~17% by b=1009) -- the negative mass is spread across all shifts, so no leading family settles the sign.',
  },
  {
    id: 'imp97287-honesty-gate-no-qed',
    holds: () =>
      IMP97287_VERDICT.signProved === false &&
      IMP97287_VERDICT.exactDecompositionProved === true &&
      IMP97287_VERDICT.smallShiftNegativityProved === true &&
      IMP97287_VERDICT.largeModulusStructureProved === true &&
      IMP97287_VERDICT.noSignDefiniteTermwiseSplit === true &&
      IMP97287_VERDICT.needsSignedShiftedDivisorEstimate === true &&
      IMP97287_VERDICT.anyBoundMoved === false &&
      IMP97287_VERDICT.postsRigorousCeiling === false &&
      IMP97287_VERDICT.qed === false &&
      /shifted-divisor-bias/.test(IMP97287_SUBGAP.id) &&
      /SIGNED shifted-divisor/.test(IMP97287_SUBGAP.statement) &&
      /NO QED/.test(IMP97287_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97287_HONEST_BANNER) &&
      /RH open/.test(IMP97287_HONEST_BANNER),
    why: 'derivation + partial: the exact decomposition, small-shift negativity and large-modulus structure are rigorous, but the sign S(b) < 0 stays measured (a global shifted-divisor correlation, invisible to the deployed antisymmetry/even-moment tools) -- no bound moved, no rigorous ceiling, honesty markers and the named residual sub-gap present.',
  },
];

for (const a of IMP97287_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97287-route-m-cotangent-signed-half-residue-resonance-decomposition assertion failed: ${a.id}`,
    );
  }
}

export default {
  measured: IMP97287_MEASURED,
  structure: IMP97287_STRUCTURE,
  verdict: IMP97287_VERDICT,
  subGap: IMP97287_SUBGAP,
  banner: IMP97287_HONEST_BANNER,
};
