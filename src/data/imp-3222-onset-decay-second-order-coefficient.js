/**
 * @module imp-3222-onset-decay-second-order-coefficient
 * @fileoverview imp-3222 -- Measure the SECOND next-order coefficient in each of
 *   the two imp-3155 asymptotic expansions of the imp-3064 excess fraction
 *   phi(s) = G(s)/F(s), s = a*U, so the ACCURACY RADIUS of the imp-3155 two-term
 *   truncation is quantified, not just its leading correction.
 *
 *   imp-3155 derives the LEADING correction in each imp-3112 signature:
 *     - onset:   phi(s0+eps) = (C/eps^2)[1 + A1 eps + O(eps^2)], A1 ~ 3.25605,
 *     - large-s: phi(s)      = K e^{-s}[1 + (2 s + D0) e^{-s} + O(s e^{-2s})],
 *                D0 ~ -0.81106,
 *   and NAMES but DROPS the O(eps^2) and O(s e^{-2s}) terms. This module derives
 *   and numerically validates those SECOND-order coefficients and assesses the
 *   radius over which the imp-3155 two-term expansion stays accurate.
 *
 *   ONSET (s = s0 + eps, eps -> 0+). With s0 = arcsinh(1), cosh(s0)=sqrt2,
 *   sinh(s0)=1, e^{-s0}=sqrt2-1, the double-zero Taylor data give
 *       F(s0+eps) = (sqrt2/2) eps^2 [1 + f1 eps + f2 eps^2 + ...],
 *          f1 = sqrt2/6, f2 = 1/12,
 *       G(s0+eps) = G0 [1 + g1 eps + g2 eps^2 + ...],   G0 = 1 - arcsinh1,
 *          g1 = (sqrt2-1)/G0, g2 = -(sqrt2-1)/(2 G0),
 *   so with C = sqrt2*G0 the ratio expands as
 *       phi(s0+eps) = (C/eps^2)[1 + A1 eps + A2 eps^2 + O(eps^3)],
 *       A2 = g2 - f1 g1 + f1^2 - f2 = -(2 sqrt2 - 1)/(6 G0) - 1/36 ~ -2.59666.
 *   A2 is NEGATIVE while A1 is positive: the leading correction pushes the onset
 *   signature phi eps^2/C above 1 as eps grows, the second bends it back down.
 *
 *   LARGE-s (s -> inf, u = e^{-s} -> 0). Factoring
 *       F = (1/2) e^s [1 - 2(s + K0) u + u^2],   K0 = sqrt2 - arcsinh1 = K/2,
 *       G = K0 [1 - u/K0],
 *   the ratio N/D with a = 2(s+K0) gives
 *       phi(s) = K e^{-s}[1 + (a - 1/K0) u + ((a^2 - 1) - a/K0) u^2 + O(u^3)].
 *   The u^1 coefficient reproduces the imp-3155 (2 s + D0). The SECOND-order
 *   (O(u^2) = O(e^{-2s})) coefficient is the QUADRATIC-in-s polynomial
 *       B(s) = 4 s^2 + (8 K0 - 2/K0) s + (4 K0^2 - 3),
 *   whose LEADING behaviour is 4 s^2 e^{-2s} (the imp-3155 "O(s e^{-2s})" label
 *   understates the prefactor: it is quadratic, not linear, in s).
 *
 *   ACCURACY RADIUS. Treating the dropped second-order term as the truncation
 *   error of the imp-3155 two-term law:
 *     - onset: |A2| eps^2 crosses 1% at eps* ~ 0.06206 and 0.1% at eps* ~ 0.01962;
 *     - large-s: B(s) e^{-2s} crosses 1% at s* ~ 4.5031 and 0.1% at s* ~ 5.9314.
 *   So the imp-3155 two-term expansion is ~1%-accurate for eps <~ 0.062 (onset)
 *   and s >~ 4.5 (decay).
 *
 *   Both second-order coefficients are recomputed in closed form AND verified by
 *   an independent finite-eps / finite-s measurement of the residual after the
 *   imp-3155 two-term law is subtracted.
 *
 *   HONEST CAVEAT (mandatory -- ticket + verdict)
 *   ---------------------------------------------
 *   DEGREE-0 SCALAR DIAGNOSTIC ONLY, RH-EQUIVALENT, NOT THE OPERATOR STEP. This
 *   measures two scalar second-order coefficients and an accuracy radius; it
 *   neither proves nor weakens RH. The off-diagonal endpoint-Hankel operator step
 *   (imp-3066) remains the lone obstruction and is untouched. Measurement only,
 *   no QED. No refereed bound is changed.
 *
 *   @see imp-3155-onset-decay-next-order-corrections.js (imp-3155: the leading corrections A1, D0)
 *   @see imp-3112-onset-decay-constant-locks.js (imp-3112: the two leading constants C, K)
 *   @see imp-3064-deficit-excess-fraction-grid.js (imp-3064: the a*U scale invariant + phi)
 *
 *   Ticket: imp-3222 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

const ASINH1 = Math.asinh(1);   // s0: sinh(s0) = 1, cosh(s0) = sqrt(2)
const SQRT2 = Math.SQRT2;
const S0 = ASINH1;

// The imp-3064 reduced masses in s = a*U (overflow regime s > s0 = arcsinh(1)).
const F = (s) => Math.cosh(s) - SQRT2 - s + ASINH1;   // = a * D_raw
const G = (s) => SQRT2 - ASINH1 - Math.exp(-s);       // = a * E
const PHI = (s) => G(s) / F(s);                        // the imp-3064 excess fraction

// imp-3112 leading constants + imp-3155 leading corrections (for anchoring).
const C = SQRT2 * (1 - ASINH1);   // phi ~ C/(s-s0)^2
const G0 = 1 - ASINH1;            // G(s0)
const K0 = SQRT2 - ASINH1;        // K = 2*K0
const K = 2 * K0;                 // phi ~ K e^{-s}
const A1 = (SQRT2 - 1) / (1 - ASINH1) - SQRT2 / 6;     // imp-3155 onset leading, ~3.25605
const D0 = 2 * K0 - 1 / K0;                             // imp-3155 decay leading const, ~-0.81106

// -- imp-3222 SECOND-order coefficients (closed forms) ------------------------
// Onset: phi(s0+eps) = (C/eps^2)[1 + A1 eps + A2 eps^2 + O(eps^3)].
//   A2 = g2 - f1 g1 + f1^2 - f2 = -(2 sqrt2 - 1)/(6 G0) - 1/36.
const ONSET_SECOND_ORDER = -(2 * SQRT2 - 1) / (6 * G0) - 1 / 36;        // ~ -2.59666
// Large-s: phi(s) = K e^{-s}[1 + (2 s + D0) e^{-s} + B(s) e^{-2s} + O(s^3 e^{-3s})].
//   B(s) = 4 s^2 + (8 K0 - 2/K0) s + (4 K0^2 - 3).
const DECAY_SECOND_ORDER_S2 = 4;                                        // coefficient of s^2
const DECAY_SECOND_ORDER_S1 = 8 * K0 - 2 / K0;                          // ~ 0.50925
const DECAY_SECOND_ORDER_S0 = 4 * K0 * K0 - 3;                          // ~ -1.86433
const DECAY_SECOND_ORDER_B = (s) =>
  DECAY_SECOND_ORDER_S2 * s * s + DECAY_SECOND_ORDER_S1 * s + DECAY_SECOND_ORDER_S0;

// Published numeric anchors (certified below).
const ONSET_SECOND_ORDER_ANCHOR = -2.596664811178753;
const DECAY_SECOND_ORDER_S1_ANCHOR = 0.5092476676475832;
const DECAY_SECOND_ORDER_S0_ANCHOR = -1.864326242660904;

// Accuracy radius of the imp-3155 two-term truncation (dropped 2nd-order = tol).
// Onset: |A2| eps^2 = tol  =>  eps* = sqrt(tol/|A2|).
const onsetRadius = (tol) => Math.sqrt(tol / Math.abs(ONSET_SECOND_ORDER));
// Large-s: B(s) e^{-2s} = tol  =>  bisect for s*.
const decayRadius = (tol) => {
  let lo = 1, hi = 40;
  for (let i = 0; i < 200; i++) {
    const m = (lo + hi) / 2;
    if (DECAY_SECOND_ORDER_B(m) * Math.exp(-2 * m) > tol) lo = m; else hi = m;
  }
  return (lo + hi) / 2;
};
const ONSET_RADIUS_1PCT = onsetRadius(0.01);      // ~0.06206
const ONSET_RADIUS_0P1PCT = onsetRadius(0.001);   // ~0.01962
const DECAY_RADIUS_1PCT = decayRadius(0.01);      // ~4.5031
const DECAY_RADIUS_0P1PCT = decayRadius(0.001);   // ~5.9314

// Independent numerical measurement of the onset second-order coefficient:
//   (phi(s0+eps) eps^2/C - 1 - A1 eps)/eps^2  ->  A2  as eps -> 0+.
const onsetSecondEmpirical = (eps) =>
  (PHI(S0 + eps) * eps * eps / C - 1 - A1 * eps) / (eps * eps);

// Independent numerical measurement of the large-s second-order coefficient B(s):
//   ((phi(s) e^s/K - 1) - (2 s + D0) e^{-s}) e^{2s}  ->  B(s)  as s -> inf.
const decaySecondEmpirical = (s) =>
  (PHI(s) * Math.exp(s) / K - 1 - (2 * s + D0) * Math.exp(-s)) * Math.exp(2 * s);

export const IMP3222_ONSET_DECAY_SECOND_ORDER_COEFFICIENT = Object.freeze({
  id: 'imp-3222-onset-decay-second-order-coefficient',
  ticket: 'imp-3222',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedLeadingCorrections: 'imp-3155-onset-decay-next-order-corrections.js',

  summary:
    'Measures the SECOND next-order coefficient (the O(eps^2) onset and O(e^{-2s}) ' +
    'large-s terms named but dropped by imp-3155) in the two asymptotic laws for ' +
    'the imp-3064 excess fraction phi(s)=G(s)/F(s). Onset: ' +
    'phi(s0+eps) = (C/eps^2)[1 + A1 eps + A2 eps^2 + O(eps^3)] with ' +
    'A2 = -(2 sqrt2 - 1)/(6*(1-arcsinh1)) - 1/36 ~ -2.59666 (NEGATIVE while A1>0). ' +
    'Large-s: phi(s) = K e^{-s}[1 + (2 s + D0) e^{-s} + B(s) e^{-2s} + O(s^3 e^{-3s})] ' +
    'with the QUADRATIC-in-s prefactor B(s) = 4 s^2 + (8 K0 - 2/K0) s + (4 K0^2 - 3) ' +
    '(leading 4 s^2, so the imp-3155 "O(s e^{-2s})" label understates the power). ' +
    'The imp-3155 two-term truncation is ~1%-accurate for eps<~0.062 (onset) and ' +
    's>~4.50 (decay). Both second-order coefficients are closed-form, anchored, and ' +
    'confirmed by an independent finite-eps / finite-s residual measurement. ' +
    'RH-EQUIVALENT; degree-0 scalar diagnostic only; NOT the operator step.',

  onsetSecondOrder: Object.freeze({
    law: 'phi(s0+eps) = (C/eps^2) [1 + A1 eps + A2 eps^2 + O(eps^3)]',
    symbol: 'A2',
    closedForm: '-(2*sqrt(2)-1)/(6*(1-arcsinh(1))) - 1/36',
    derivation: 'A2 = g2 - f1*g1 + f1^2 - f2 with f1=sqrt2/6, f2=1/12, g1=(sqrt2-1)/G0, g2=-(sqrt2-1)/(2 G0)',
    value: ONSET_SECOND_ORDER,
    anchor: ONSET_SECOND_ORDER_ANCHOR,
    sign: 'negative (leading A1>0 lifts phi eps^2/C above 1, second-order bends it back)',
    empiricalAtEps1em3: onsetSecondEmpirical(1e-3),
  }),
  decaySecondOrder: Object.freeze({
    law: 'phi(s) = K e^{-s} [1 + (2 s + D0) e^{-s} + B(s) e^{-2s} + O(s^3 e^{-3s})]',
    symbol: 'B(s)',
    closedForm: 'B(s) = 4 s^2 + (8 K0 - 2/K0) s + (4 K0^2 - 3),  K0 = sqrt(2)-arcsinh(1)',
    leadingTerm: '4 s^2 e^{-2s} (quadratic-in-s prefactor; imp-3155 label understated it)',
    coefS2: DECAY_SECOND_ORDER_S2,
    coefS1: DECAY_SECOND_ORDER_S1,
    coefS0: DECAY_SECOND_ORDER_S0,
    coefS1Anchor: DECAY_SECOND_ORDER_S1_ANCHOR,
    coefS0Anchor: DECAY_SECOND_ORDER_S0_ANCHOR,
    empiricalAtS10: decaySecondEmpirical(10),
    closedAtS10: DECAY_SECOND_ORDER_B(10),
  }),
  accuracyRadius: Object.freeze({
    note: 'Radius over which the imp-3155 TWO-TERM truncation stays accurate; the dropped ' +
          'second-order term equals the stated relative tolerance at these edges.',
    onsetEps1pct: ONSET_RADIUS_1PCT,
    onsetEps0p1pct: ONSET_RADIUS_0P1PCT,
    decayS1pct: DECAY_RADIUS_1PCT,
    decayS0p1pct: DECAY_RADIUS_0P1PCT,
    verdict: 'imp-3155 two-term law ~1%-accurate for eps<~0.062 (onset) and s>~4.50 (large-s)',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    operatorStepUntouched:
      'Measures two scalar second-order coefficients and an accuracy radius of the ' +
      'imp-3064 degree-0 ratio; the off-diagonal endpoint-Hankel operator step ' +
      '(imp-3066) remains the lone obstruction and is NOT addressed here.',
    sota: 'No refereed bound is changed',
    didNotRerunBarePilot: true,
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3222_ONSET_DECAY_SECOND_ORDER_COEFFICIENT_ASSERTIONS = [
  {
    id: 'imp3222-onset-second-order-matches-anchor',
    why: 'The onset second-order coefficient A2 = -(2 sqrt2 - 1)/(6 G0) - 1/36 recomputed from ' +
         'the closed form must match the published anchor ~-2.596665 to ~1e-10; a drift means ' +
         'the F double-zero Taylor data or the G(s0) onset expansion was silently mis-edited.',
    holds: () =>
      Math.abs(ONSET_SECOND_ORDER - (-(2 * SQRT2 - 1) / (6 * G0) - 1 / 36)) < 1e-15 &&
      Math.abs(ONSET_SECOND_ORDER - ONSET_SECOND_ORDER_ANCHOR) < 1e-10,
  },
  {
    id: 'imp3222-onset-empirical-confirms-second-order',
    why: 'An independent finite-eps measurement of the residual after the imp-3155 two-term law, ' +
         '(phi(s0+eps) eps^2/C - 1 - A1 eps)/eps^2, must approach the closed-form A2 as eps -> 0+; ' +
         'at eps = 1e-3 the empirical value is within ~1e-2 of A2, confirming the O(eps^2) term.',
    holds: () => Math.abs(onsetSecondEmpirical(1e-3) - ONSET_SECOND_ORDER) < 1e-2,
  },
  {
    id: 'imp3222-decay-second-order-coefs-match-anchor',
    why: 'The large-s second-order polynomial B(s) = 4 s^2 + (8 K0 - 2/K0) s + (4 K0^2 - 3) has ' +
         'leading coefficient exactly 4 and s^1, s^0 coefficients matching the anchors ~0.509248 ' +
         'and ~-1.864326 to ~1e-10; a drift means the F e^s factorization was silently mis-edited.',
    holds: () =>
      DECAY_SECOND_ORDER_S2 === 4 &&
      Math.abs(DECAY_SECOND_ORDER_S1 - DECAY_SECOND_ORDER_S1_ANCHOR) < 1e-10 &&
      Math.abs(DECAY_SECOND_ORDER_S0 - DECAY_SECOND_ORDER_S0_ANCHOR) < 1e-10,
  },
  {
    id: 'imp3222-decay-empirical-confirms-second-order',
    why: 'An independent finite-s measurement of the residual after the imp-3155 two-term law, ' +
         '((phi(s) e^s/K - 1) - (2 s + D0) e^{-s}) e^{2s}, must approach the closed-form B(s) as ' +
         's -> inf; at s = 10 the empirical value is within 1% of B(10)~403.23, confirming the ' +
         'O(e^{-2s}) term with quadratic-in-s prefactor.',
    holds: () => {
      const s = 10;
      return Math.abs(decaySecondEmpirical(s) - DECAY_SECOND_ORDER_B(s)) / DECAY_SECOND_ORDER_B(s) < 0.01;
    },
  },
  {
    id: 'imp3222-onset-second-negative-decay-leading-quadratic',
    why: 'The onset second-order A2 is NEGATIVE (opposite sign to A1>0) and the large-s second ' +
         'order is dominated by a POSITIVE quadratic 4 s^2 (not linear); a sign flip or a ' +
         'non-4 leading coefficient would indicate a transcribed-coefficient error.',
    holds: () =>
      ONSET_SECOND_ORDER < 0 && A1 > 0 && DECAY_SECOND_ORDER_S2 === 4 &&
      DECAY_SECOND_ORDER_B(10) > 0,
  },
  {
    id: 'imp3222-accuracy-radius-ordering',
    why: 'The accuracy-radius edges must be ordered sensibly: a tighter 0.1% onset tolerance ' +
         'needs a SMALLER eps than 1%, and a tighter 0.1% large-s tolerance needs a LARGER s ' +
         'than 1%; and the dropped term at each edge reproduces the stated tolerance.',
    holds: () =>
      ONSET_RADIUS_0P1PCT < ONSET_RADIUS_1PCT &&
      DECAY_RADIUS_0P1PCT > DECAY_RADIUS_1PCT &&
      Math.abs(Math.abs(ONSET_SECOND_ORDER) * ONSET_RADIUS_1PCT * ONSET_RADIUS_1PCT - 0.01) < 1e-9 &&
      Math.abs(DECAY_SECOND_ORDER_B(DECAY_RADIUS_1PCT) * Math.exp(-2 * DECAY_RADIUS_1PCT) - 0.01) < 1e-6,
  },
  {
    id: 'imp3222-honest-rh-equivalent-not-a-reduction',
    why: 'Mandatory honesty: this is a second-order coefficient measurement, RH-EQUIVALENT, ' +
         'structural/diagnostic, leaves the operator step untouched, is not a proof, not a ' +
         'reduction below RH, and no refereed bound is changed. If any of these flip the module is over-claiming.',
    holds: () => {
      const c = IMP3222_ONSET_DECAY_SECOND_ORDER_COEFFICIENT.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.isStructuralDiagnostic === true &&
        c.didNotRerunBarePilot === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const a of IMP3222_ONSET_DECAY_SECOND_ORDER_COEFFICIENT_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-3222-onset-decay-second-order-coefficient assertion failed: ${a.id}`);
}

export default IMP3222_ONSET_DECAY_SECOND_ORDER_COEFFICIENT;
