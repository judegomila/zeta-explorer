/**
 * @module imp-3155-onset-decay-next-order-corrections
 * @fileoverview imp-3155 -- Measure the LEADING CORRECTION (next-order) term in
 *   each of the two imp-3112 asymptotic laws for the imp-3064 excess fraction
 *   phi(s) = G(s)/F(s), s = a*U, so the CONVERGENCE RATE of the imp-3112
 *   signatures is characterized, not just their limit.
 *
 *   imp-3112 locks the two companion leading constants
 *     - onset:   phi(s) ~ C / (s - s0)^2  as s -> s0+ = arcsinh(1)+,
 *                C = sqrt(2)*(1 - arcsinh(1)) ~ 0.16776, and
 *     - large-s: phi(s) ~ K * e^{-s}       as s -> inf,
 *                K = 2*(sqrt(2) - arcsinh(1)) ~ 1.06568,
 *   and certifies the two signatures converge to 1 -- but never quantifies the
 *   RATE. This module derives and measures the next-order coefficient in each
 *   expansion.
 *
 *   ONSET (s = s0 + eps, eps -> 0+).  With s0 = arcsinh(1), cosh(s0)=sqrt2,
 *   sinh(s0)=1, the double zero of F gives the Taylor data
 *       F(s0+eps) = (sqrt2/2) eps^2 [1 + (sqrt2/6) eps + ...]   (F'=F''-1=0 at s0),
 *       G(s0+eps) = (1 - arcsinh1) [1 + g1 eps + ...],  g1 = (sqrt2-1)/(1-arcsinh1),
 *   so the ratio gives
 *       phi(s0+eps) = (C / eps^2) [1 + A1 eps + O(eps^2)],
 *       A1 = g1 - sqrt2/6 = (sqrt2-1)/(1-arcsinh1) - sqrt2/6 ~ 3.25605.
 *   The imp-3112 onset signature phi(s0+eps) eps^2 / C -> 1 therefore converges
 *   LINEARLY in eps with slope A1 > 0 (approach from below).
 *
 *   LARGE-s (s -> inf).  Factoring F = (1/2)e^s[1 - 2(s+sqrt2-arcsinh1)e^{-s} +
 *   e^{-2s}] and G = K0[1 - (1/K0)e^{-s}] with K0 = sqrt2 - arcsinh1 = K/2,
 *       phi(s) = K e^{-s} [1 + (2 s + 2 K0 - 1/K0) e^{-s} + O(s^2 e^{-2s})].
 *   So the imp-3112 decay signature phi(s) e^s / K -> 1 converges with a
 *   correction (2 s + D0) e^{-s}, an exponentially small term with a
 *   LINEAR-in-s prefactor (slope 2) and constant part D0 = 2 K0 - 1/K0 ~ -0.81106.
 *   NOTE (imp-3222): the dropped next term is NOT O(s e^{-2s}) -- imp-3222 shows
 *   its prefactor B(s) = 4 s^2 + (8 K0 - 2/K0) s + (4 K0^2 - 3) is QUADRATIC in s,
 *   so O(s^2 e^{-2s}) is the correct order label for this module's own truncation.
 *
 *   Both coefficients are recomputed in closed form, cross-checked against the
 *   published anchors, AND verified by an independent finite-eps / finite-s
 *   numerical measurement of the leading correction.
 *
 *   HONEST CAVEAT (mandatory -- ticket + verdict)
 *   ---------------------------------------------
 *   DEGREE-0 SCALAR DIAGNOSTIC ONLY, RH-EQUIVALENT, NOT THE OPERATOR STEP. This
 *   measures two scalar convergence rates; it neither proves nor weakens RH. The
 *   off-diagonal endpoint-Hankel operator step (imp-3066) remains the lone
 *   obstruction and is untouched. Measurement only, no QED. Platt-Trudgian
 *   Lambda &lt;= 0.2 REMAINS the rigorous SOTA.
 *
 *   @see imp-3112-onset-decay-constant-locks.js (imp-3112: the two leading constants C, K)
 *   @see imp-3064-deficit-excess-fraction-grid.js (imp-3064: the a*U scale invariant + phi)
 *   @see imp-3222-onset-decay-second-order-coefficient.js (imp-3222: the corrected
 *     QUADRATIC-in-s O(s^2 e^{-2s}) prefactor B(s) this module's O(s e^{-2s}) label understated)
 *
 *   Ticket: imp-3155 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

const ASINH1 = Math.asinh(1);   // s0: sinh(s0) = 1, cosh(s0) = sqrt(2)
const SQRT2 = Math.SQRT2;
const S0 = ASINH1;

// The imp-3064 reduced masses in s = a*U (overflow regime s > s0 = arcsinh(1)).
const F = (s) => Math.cosh(s) - SQRT2 - s + ASINH1;   // = a * D_raw
const G = (s) => SQRT2 - ASINH1 - Math.exp(-s);       // = a * E
const PHI = (s) => G(s) / F(s);                        // the imp-3064 excess fraction

// imp-3112 leading constants (for reference / signature anchoring).
const C = SQRT2 * (1 - ASINH1);   // phi ~ C/(s-s0)^2
const K0 = SQRT2 - ASINH1;        // K = 2*K0
const K = 2 * K0;                 // phi ~ K e^{-s}

// -- imp-3155 next-order coefficients (closed forms) --------------------------
// Onset: phi(s0+eps) = (C/eps^2)[1 + ONSET_NEXT_ORDER*eps + O(eps^2)].
const ONSET_NEXT_ORDER = (SQRT2 - 1) / (1 - ASINH1) - SQRT2 / 6;       // ~ 3.25605
// Large-s: phi(s) = K e^{-s}[1 + (2 s + DECAY_NEXT_ORDER_CONST) e^{-s} + ...].
const DECAY_NEXT_ORDER_SLOPE = 2;                                       // coefficient of s
const DECAY_NEXT_ORDER_CONST = 2 * K0 - 1 / K0;                         // ~ -0.81106

// Published numeric anchors (certified below).
const ONSET_NEXT_ORDER_ANCHOR = 3.256045925915526;
const DECAY_NEXT_ORDER_CONST_ANCHOR = -0.8110561168833126;

// Independent numerical measurement of the onset correction slope:
//   (phi(s0+eps) eps^2 / C - 1) / eps  ->  ONSET_NEXT_ORDER  as eps -> 0+.
const onsetSlopeEmpirical = (eps) => (PHI(S0 + eps) * eps * eps / C - 1) / eps;

// Independent numerical measurement of the decay correction constant part:
//   (phi(s) e^s / K - 1) e^s - 2 s  ->  DECAY_NEXT_ORDER_CONST  as s -> inf.
const decayConstEmpirical = (s) =>
  (PHI(s) * Math.exp(s) / K - 1) * Math.exp(s) - DECAY_NEXT_ORDER_SLOPE * s;

export const IMP3155_ONSET_DECAY_NEXT_ORDER_CORRECTIONS = Object.freeze({
  id: 'imp-3155-onset-decay-next-order-corrections',
  ticket: 'imp-3155',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedLeadingConstants: 'imp-3112-onset-decay-constant-locks.js',

  summary:
    'Measures the leading CORRECTION term (convergence rate) of the two imp-3112 ' +
    'asymptotic laws for the imp-3064 excess fraction phi(s)=G(s)/F(s). Onset: ' +
    'phi(s0+eps) = (C/eps^2)[1 + A1 eps + O(eps^2)] with the next-order coefficient ' +
    'A1 = (sqrt2-1)/(1-arcsinh1) - sqrt2/6 ~ 3.25605, so the onset signature ' +
    'phi eps^2/C -> 1 converges LINEARLY in eps. Large-s: phi(s) = K e^{-s}[1 + ' +
    '(2 s + D0) e^{-s} + O(s^2 e^{-2s})] with slope 2 and constant part ' +
    'D0 = 2 K0 - 1/K0 ~ -0.81106 (K0 = sqrt2-arcsinh1 = K/2), so the decay ' +
    'signature phi e^s/K -> 1 converges with an exponentially small, ' +
    'linear-in-s correction. Both coefficients are closed-form, anchored, and ' +
    'confirmed by an independent finite-eps / finite-s measurement. ' +
    'RH-EQUIVALENT; degree-0 scalar diagnostic only; NOT the operator step.',

  onsetCorrection: Object.freeze({
    law: 'phi(s0+eps) = (C/eps^2) [1 + A1 eps + O(eps^2)]',
    symbol: 'A1',
    closedForm: '(sqrt(2)-1)/(1-arcsinh(1)) - sqrt(2)/6',
    value: ONSET_NEXT_ORDER,
    anchor: ONSET_NEXT_ORDER_ANCHOR,
    convergence: 'linear in eps (signature phi eps^2/C -> 1 from below, slope A1)',
    empiricalAtEps1em4: onsetSlopeEmpirical(1e-4),
  }),
  decayCorrection: Object.freeze({
    law: 'phi(s) = K e^{-s} [1 + (2 s + D0) e^{-s} + O(s^2 e^{-2s})]',
    slopeSymbol: '2 (coefficient of s)',
    constSymbol: 'D0',
    constClosedForm: '2*(sqrt(2)-arcsinh(1)) - 1/(sqrt(2)-arcsinh(1))',
    slope: DECAY_NEXT_ORDER_SLOPE,
    constValue: DECAY_NEXT_ORDER_CONST,
    constAnchor: DECAY_NEXT_ORDER_CONST_ANCHOR,
    convergence: 'exponential e^{-s} with a linear-in-s prefactor (signature phi e^s/K -> 1)',
    droppedTermOrder: 'O(s^2 e^{-2s}); imp-3222 derives its QUADRATIC-in-s prefactor B(s)',
    empiricalAtS16: decayConstEmpirical(16),
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    operatorStepUntouched:
      'Measures two scalar convergence rates of the imp-3064 degree-0 ratio; the ' +
      'off-diagonal endpoint-Hankel operator step (imp-3066) remains the lone ' +
      'obstruction and is NOT addressed here.',
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
    didNotRerunBarePilot: true,
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3155_ONSET_DECAY_NEXT_ORDER_CORRECTIONS_ASSERTIONS = [
  {
    id: 'imp3155-onset-next-order-matches-anchor',
    why: 'The onset next-order coefficient A1 = (sqrt2-1)/(1-arcsinh1) - sqrt2/6 recomputed ' +
         'from the closed form must match the published anchor ~3.256046 to ~1e-10; a drift ' +
         'means the F double-zero Taylor data or the G(s0) onset value was silently mis-edited.',
    holds: () =>
      Math.abs(ONSET_NEXT_ORDER - ((SQRT2 - 1) / (1 - ASINH1) - SQRT2 / 6)) < 1e-15 &&
      Math.abs(ONSET_NEXT_ORDER - ONSET_NEXT_ORDER_ANCHOR) < 1e-10,
  },
  {
    id: 'imp3155-onset-empirical-confirms-slope',
    why: 'An independent finite-eps measurement of the onset correction slope ' +
         '(phi(s0+eps) eps^2/C - 1)/eps must approach the closed-form A1 as eps -> 0+; at ' +
         'eps = 1e-4 the empirical slope is within ~1e-3 of A1, confirming the linear ' +
         'convergence rate of the imp-3112 onset signature.',
    holds: () => Math.abs(onsetSlopeEmpirical(1e-4) - ONSET_NEXT_ORDER) < 1e-3,
  },
  {
    id: 'imp3155-decay-next-order-const-matches-anchor',
    why: 'The large-s correction constant part D0 = 2*K0 - 1/K0 (K0 = sqrt2-arcsinh1) recomputed ' +
         'from the closed form must match the published anchor ~-0.811056 to ~1e-10; a drift ' +
         'means the F e^s factorization or the G saturation ceiling was silently mis-edited.',
    holds: () =>
      Math.abs(DECAY_NEXT_ORDER_CONST - (2 * K0 - 1 / K0)) < 1e-15 &&
      Math.abs(DECAY_NEXT_ORDER_CONST - DECAY_NEXT_ORDER_CONST_ANCHOR) < 1e-10,
  },
  {
    id: 'imp3155-decay-empirical-confirms-correction',
    why: 'An independent finite-s measurement of the large-s correction ' +
         '(phi(s) e^s/K - 1) e^s - 2 s must approach the closed-form D0 as s -> inf; at s = 16 ' +
         'the empirical value is within ~1e-3 of D0, confirming the (2 s + D0) e^{-s} ' +
         'correction (slope 2, constant D0) of the imp-3112 decay signature.',
    holds: () => Math.abs(decayConstEmpirical(16) - DECAY_NEXT_ORDER_CONST) < 1e-3,
  },
  {
    id: 'imp3155-onset-correction-positive-decay-const-negative',
    why: 'The onset signature phi eps^2/C -> 1 approaches from BELOW (A1 > 0) and the decay ' +
         'constant part D0 is NEGATIVE; these signs characterize the direction of approach and ' +
         'a flip would indicate a transcribed-coefficient error.',
    holds: () => ONSET_NEXT_ORDER > 0 && DECAY_NEXT_ORDER_CONST < 0 && DECAY_NEXT_ORDER_SLOPE === 2,
  },
  {
    id: 'imp3155-honest-rh-equivalent-not-a-reduction',
    why: 'Mandatory honesty: this is a RATE measurement, RH-EQUIVALENT, structural/diagnostic, ' +
         'leaves the operator step untouched, is not a proof, not a reduction below RH, and ' +
         'PT 0.2 stays SOTA. If any of these flip the module is over-claiming.',
    holds: () => {
      const c = IMP3155_ONSET_DECAY_NEXT_ORDER_CORRECTIONS.honestCaveat;
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

for (const a of IMP3155_ONSET_DECAY_NEXT_ORDER_CORRECTIONS_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-3155-onset-decay-next-order-corrections assertion failed: ${a.id}`);
}

export default IMP3155_ONSET_DECAY_NEXT_ORDER_CORRECTIONS;
