/**
 * @module imp-3325-onset-pade-resummation
 * @fileoverview imp-3325 -- Assess whether a [1/1] Pade resummation built from the
 *   imp-3155 leading onset correction A1 and the imp-3222 second-order coefficient
 *   A2 extends the imp-3155 TWO-TERM 1%-accuracy radius beyond eps* ~ 0.062.
 *
 *   SETUP. The imp-3064 excess fraction phi(s) = G(s)/F(s), s = a*U, has a double
 *   pole at the onset s0 = arcsinh(1). Dividing it out gives the analytic ONSET
 *   SIGNATURE
 *       S(eps) = phi(s0+eps) * eps^2 / C = 1 + A1 eps + A2 eps^2 + O(eps^3),
 *   with C = sqrt2*(1-arcsinh1), A1 = (sqrt2-1)/(1-arcsinh1) - sqrt2/6 ~ 3.25605
 *   (imp-3155, POSITIVE) and A2 = -(2sqrt2-1)/(6(1-arcsinh1)) - 1/36 ~ -2.59666
 *   (imp-3222, NEGATIVE). imp-3222 found the imp-3155 TWO-TERM truncation
 *   T2(eps) = 1 + A1 eps is ~1%-accurate only for eps <~ 0.062 (proxy |A2|eps^2=0.01)
 *   and, measured against a direct finite-eps evaluation of phi, out to eps ~ 0.0692.
 *
 *   PADE [1/1]. The A1>0 / A2<0 sign pattern superficially suggests a pole-like
 *   structure inviting a rational resummation. The [1/1] Pade approximant matching
 *   the same three Taylor data (1, A1, A2) is
 *       P11(eps) = (1 + b eps) / (1 + c eps),   c = -A2/A1,  b = A1 + c,
 *   which reproduces 1 + A1 eps + A2 eps^2 exactly (verified to 0 / 4e-16). Here
 *       c ~ 0.797490,  b ~ 4.053536,  so the Pade pole sits at eps = -1/c ~ -1.25393.
 *   The pole is on the NEGATIVE-eps axis: on the onset (positive-eps) side there is
 *   no nearby singularity for the resummation to capture.
 *
 *   MEASURED RADII (relative error vs a direct finite-eps evaluation of phi; 1%):
 *       T2  (two-term)        eps* ~ 0.06918
 *       T3  (three-term poly) eps* ~ 0.27058   <- adding A2 as a polynomial term
 *       P11 (Pade [1/1])      eps* ~ 0.27342
 *   and at the tighter 0.1% tolerance: T2 0.02033, T3 0.11463, P11 0.10937.
 *
 *   VERDICT. YES, the [1/1] Pade extends the imp-3155 TWO-TERM 1% radius roughly 4x
 *   (0.0692 -> 0.2734). BUT essentially ALL of that gain comes from incorporating
 *   A2 at all: the same-order THREE-TERM polynomial T3 already reaches eps* ~ 0.2706,
 *   so the rational resummation buys only ~1% further extension at 1% tolerance and
 *   is in fact slightly WORSE than the polynomial at 0.1% (0.1094 vs 0.1146). The
 *   Pade only pulls ahead deep in the tail (eps >~ 0.3, rel err 3.9% vs 4.9% at
 *   eps=0.5), consistent with the pole living off the positive-eps axis: there is no
 *   onset-side singularity to resum, so [1/1] Pade adds almost nothing over simply
 *   keeping the imp-3222 second-order term.
 *
 *   HONEST CAVEAT (mandatory -- ticket + verdict)
 *   ---------------------------------------------
 *   DEGREE-0 SCALAR DIAGNOSTIC ONLY, RH-EQUIVALENT, NOT THE OPERATOR STEP. This
 *   measures an accuracy radius of a rational reconstruction of the imp-3064 scalar
 *   onset signature; it neither proves nor weakens RH. The off-diagonal
 *   endpoint-Hankel operator step (imp-3066) remains the lone obstruction and is
 *   untouched. Measurement only, no QED. Platt-Trudgian Lambda &lt;= 0.2 REMAINS the
 *   rigorous SOTA.
 *
 *   @see imp-3222-onset-decay-second-order-coefficient.js (imp-3222: A2 ~ -2.59666, radius eps*~0.062)
 *   @see imp-3155-onset-decay-next-order-corrections.js (imp-3155: leading A1 ~ 3.25605)
 *   @see imp-3064-deficit-excess-fraction-grid.js (imp-3064: the a*U scale invariant + phi)
 *
 *   Ticket: imp-3325 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

const ASINH1 = Math.asinh(1);   // s0: sinh(s0) = 1, cosh(s0) = sqrt(2)
const SQRT2 = Math.SQRT2;
const S0 = ASINH1;

// imp-3064 reduced masses in s = a*U (overflow regime s > s0 = arcsinh(1)).
const F = (s) => Math.cosh(s) - SQRT2 - s + ASINH1;   // = a * D_raw
const G = (s) => SQRT2 - ASINH1 - Math.exp(-s);       // = a * E
const PHI = (s) => G(s) / F(s);                        // the imp-3064 excess fraction

// imp-3112 leading onset constant + imp-3155 / imp-3222 onset series coefficients.
const C = SQRT2 * (1 - ASINH1);                        // phi ~ C/(s-s0)^2
const G0 = 1 - ASINH1;                                 // G(s0)
const A1 = (SQRT2 - 1) / (1 - ASINH1) - SQRT2 / 6;     // imp-3155 leading, ~3.25605 (>0)
const A2 = -(2 * SQRT2 - 1) / (6 * G0) - 1 / 36;       // imp-3222 second-order, ~-2.59666 (<0)

// -- imp-3325 [1/1] Pade of the onset signature 1 + A1 eps + A2 eps^2 -----------
// (1 + b eps)/(1 + c eps) = 1 + (b-c) eps + (c^2 - b c) eps^2 + ...
//   b - c = A1,  c^2 - b c = A2  =>  c = -A2/A1,  b = A1 + c.
const PADE_C = -A2 / A1;                               // ~0.797490
const PADE_B = A1 + PADE_C;                            // ~4.053536
const PADE_POLE = -1 / PADE_C;                         // ~-1.25393 (negative-eps axis)
const P11 = (eps) => (1 + PADE_B * eps) / (1 + PADE_C * eps);

// The imp-3155 two-term and the three-term (imp-3222) polynomial truncations.
const T2 = (eps) => 1 + A1 * eps;
const T3 = (eps) => 1 + A1 * eps + A2 * eps * eps;

// True onset signature from a DIRECT finite-eps evaluation of phi (the benchmark).
const S_TRUE = (eps) => PHI(S0 + eps) * eps * eps / C;

// Relative error of an approximant vs the direct phi evaluation, and the eps radius
// at which it first exceeds a tolerance (bisection on the monotone-in-eps error).
const relErr = (fn, eps) => Math.abs(fn(eps) - S_TRUE(eps)) / Math.abs(S_TRUE(eps));
const radiusOf = (fn, tol) => {
  let lo = 1e-6, hi = 3;
  for (let i = 0; i < 200; i++) {
    const m = (lo + hi) / 2;
    if (relErr(fn, m) < tol) lo = m; else hi = m;
  }
  return (lo + hi) / 2;
};

const T2_RADIUS_1PCT = radiusOf(T2, 0.01);    // ~0.06918
const T3_RADIUS_1PCT = radiusOf(T3, 0.01);    // ~0.27058
const P11_RADIUS_1PCT = radiusOf(P11, 0.01);  // ~0.27342
const T2_RADIUS_0P1PCT = radiusOf(T2, 0.001); // ~0.02033
const T3_RADIUS_0P1PCT = radiusOf(T3, 0.001); // ~0.11463
const P11_RADIUS_0P1PCT = radiusOf(P11, 0.001); // ~0.10937

// Published numeric anchors (certified below).
const PADE_C_ANCHOR = 0.7974902290263705;
const PADE_B_ANCHOR = 4.053536154941896;
const T2_RADIUS_1PCT_ANCHOR = 0.06918409064084524;
const T3_RADIUS_1PCT_ANCHOR = 0.2705793840651898;
const P11_RADIUS_1PCT_ANCHOR = 0.2734195831735162;

export const IMP3325_ONSET_PADE_RESUMMATION = Object.freeze({
  id: 'imp-3325-onset-pade-resummation',
  ticket: 'imp-3325',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedSecondOrder: 'imp-3222-onset-decay-second-order-coefficient.js',

  summary:
    'Assesses whether the [1/1] Pade approximant P11(eps)=(1+b eps)/(1+c eps) built from the ' +
    'onset Taylor data (1, A1~3.25605, A2~-2.59666) extends the imp-3155 TWO-TERM 1%-accuracy ' +
    'radius (eps*~0.0692 vs a direct phi evaluation) of the onset signature ' +
    'S(eps)=phi(s0+eps)eps^2/C. With c=-A2/A1~0.79749 and b=A1+c~4.05354 the Pade pole sits at ' +
    'eps=-1/c~-1.25393 (NEGATIVE-eps axis). VERDICT: the Pade extends the two-term 1% radius ~4x ' +
    'to eps*~0.2734, but the same-order THREE-TERM polynomial already reaches eps*~0.2706, so ' +
    'the rational resummation adds only ~1% at 1% tolerance and is slightly WORSE at 0.1% ' +
    '(0.1094 vs 0.1146). It pulls ahead only in the deep tail (eps>~0.3), consistent with the ' +
    'pole being off the positive-eps axis: no onset-side singularity to resum. ' +
    'RH-EQUIVALENT; degree-0 scalar diagnostic only; NOT the operator step.',

  pade11: Object.freeze({
    form: 'P11(eps) = (1 + b eps) / (1 + c eps)',
    closedForm: 'c = -A2/A1,  b = A1 + c',
    matchesSeriesToOrder: 'eps^2 (reproduces 1 + A1 eps + A2 eps^2 exactly)',
    c: PADE_C,
    b: PADE_B,
    cAnchor: PADE_C_ANCHOR,
    bAnchor: PADE_B_ANCHOR,
    pole: PADE_POLE,
    poleNote: 'pole at eps=-1/c~-1.25393 lies on the NEGATIVE-eps axis; the onset side (eps>0) has no nearby singularity',
  }),

  accuracyRadius: Object.freeze({
    note: 'eps radius over which each reconstruction of the onset signature stays within the ' +
          'stated relative tolerance of a DIRECT finite-eps evaluation of phi(s0+eps).',
    twoTermEps1pct: T2_RADIUS_1PCT,
    threeTermEps1pct: T3_RADIUS_1PCT,
    padeEps1pct: P11_RADIUS_1PCT,
    twoTermEps0p1pct: T2_RADIUS_0P1PCT,
    threeTermEps0p1pct: T3_RADIUS_0P1PCT,
    padeEps0p1pct: P11_RADIUS_0P1PCT,
    twoTermEps1pctAnchor: T2_RADIUS_1PCT_ANCHOR,
    threeTermEps1pctAnchor: T3_RADIUS_1PCT_ANCHOR,
    padeEps1pctAnchor: P11_RADIUS_1PCT_ANCHOR,
  }),

  verdict: Object.freeze({
    extendsTwoTermRadius: true,
    twoTermToPadeFactorAt1pct: P11_RADIUS_1PCT / T2_RADIUS_1PCT,   // ~3.95x
    meaningfulOverThreeTermPolynomial: false,
    padeVsThreeTermFactorAt1pct: P11_RADIUS_1PCT / T3_RADIUS_1PCT, // ~1.010x (marginal)
    statement:
      'The [1/1] Pade extends the imp-3155 two-term 1% radius ~4x (0.0692 -> 0.2734), but ~all of ' +
      'that gain is from including A2 at all: the same-order three-term polynomial already reaches ' +
      '0.2706. The resummation buys only ~1% more at 1% tolerance and is slightly worse at 0.1%; ' +
      'it helps only in the deep tail because the Pade pole is off the positive-eps axis.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    operatorStepUntouched:
      'Measures an accuracy radius of a rational reconstruction of the imp-3064 degree-0 scalar ' +
      'onset signature; the off-diagonal endpoint-Hankel operator step (imp-3066) remains the lone ' +
      'obstruction and is NOT addressed here.',
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
    didNotRerunBarePilot: true,
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3325_ONSET_PADE_RESUMMATION_ASSERTIONS = [
  {
    id: 'imp3325-pade-coefs-match-anchors',
    why: 'The [1/1] Pade coefficients c=-A2/A1 and b=A1+c recomputed from the imp-3155/imp-3222 ' +
         'onset data must match the published anchors ~0.797490 and ~4.053536 to ~1e-9; a drift ' +
         'means A1 or A2 was silently mis-edited upstream.',
    holds: () =>
      Math.abs(PADE_C - PADE_C_ANCHOR) < 1e-9 &&
      Math.abs(PADE_B - PADE_B_ANCHOR) < 1e-9,
  },
  {
    id: 'imp3325-pade-reproduces-series-to-second-order',
    why: 'The [1/1] Pade must reproduce the onset Taylor data exactly: expanding (1+b eps)/(1+c eps) ' +
         'gives (b-c)=A1 and (c^2-b c)=A2, so both must vanish to ~1e-12; otherwise the approximant ' +
         'is not the [1/1] Pade of (1, A1, A2).',
    holds: () =>
      Math.abs((PADE_B - PADE_C) - A1) < 1e-12 &&
      Math.abs((PADE_C * PADE_C - PADE_B * PADE_C) - A2) < 1e-12,
  },
  {
    id: 'imp3325-pade-pole-on-negative-axis',
    why: 'The Pade pole eps=-1/c must be NEGATIVE (~-1.25393): the onset side eps>0 has no nearby ' +
         'singularity, which is WHY the rational resummation gains little over the polynomial. A ' +
         'positive pole would change the whole story and flag a sign error in A2/A1.',
    holds: () => PADE_POLE < 0 && Math.abs(PADE_POLE - (-1.2539338585011468)) < 1e-9,
  },
  {
    id: 'imp3325-pade-extends-two-term-radius',
    why: 'The headline claim: the [1/1] Pade 1% radius (~0.2734) must be substantially larger than ' +
         'the imp-3155 two-term radius (~0.0692) -- at least 3x -- confirming the resummation does ' +
         'extend the two-term accuracy window against a direct phi evaluation.',
    holds: () =>
      P11_RADIUS_1PCT > 3 * T2_RADIUS_1PCT &&
      Math.abs(T2_RADIUS_1PCT - T2_RADIUS_1PCT_ANCHOR) < 1e-4 &&
      Math.abs(P11_RADIUS_1PCT - P11_RADIUS_1PCT_ANCHOR) < 1e-4,
  },
  {
    id: 'imp3325-pade-not-meaningful-over-three-term-polynomial',
    why: 'The HONEST negative half of the verdict: the [1/1] Pade 1% radius (~0.2734) is only ' +
         'marginally larger than the same-order three-term polynomial (~0.2706, within 5%), so the ' +
         'rational structure adds little beyond simply keeping A2. If the Pade were >>the polynomial ' +
         'the "resummation buys nothing extra" conclusion would be wrong.',
    holds: () => {
      const ratio = P11_RADIUS_1PCT / T3_RADIUS_1PCT;
      return ratio > 0.95 && ratio < 1.05 &&
        Math.abs(T3_RADIUS_1PCT - T3_RADIUS_1PCT_ANCHOR) < 1e-4;
    },
  },
  {
    id: 'imp3325-honest-rh-equivalent-not-a-reduction',
    why: 'Mandatory honesty: this is a Pade accuracy-radius measurement, RH-EQUIVALENT, ' +
         'structural/diagnostic, leaves the operator step untouched, is not a proof, not a reduction ' +
         'below RH, and PT 0.2 stays SOTA. If any of these flip the module is over-claiming.',
    holds: () => {
      const c = IMP3325_ONSET_PADE_RESUMMATION.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.isStructuralDiagnostic === true &&
        c.didNotRerunBarePilot === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const a of IMP3325_ONSET_PADE_RESUMMATION_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-3325-onset-pade-resummation assertion failed: ${a.id}`);
}

export default IMP3325_ONSET_PADE_RESUMMATION;
