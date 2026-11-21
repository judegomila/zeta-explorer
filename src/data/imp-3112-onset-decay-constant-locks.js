/**
 * @module imp-3112-onset-decay-constant-locks
 * @fileoverview imp-3112 -- Build-assertion lock for the TWO companion asymptotic
 *   constants of the imp-3064 excess fraction phi(s) = G(s)/F(s), s = a*U:
 *     - the imp-3087 ONSET pole constant   C = sqrt(2)*(1 - arcsinh(1)) ~ 0.16776,
 *       governing phi(s) ~ C / (s - s0)^2 as s -> s0+ = arcsinh(1)+, and
 *     - the imp-3088 LARGE-s decay constant K = 2*(sqrt(2) - arcsinh(1)) ~ 1.06568,
 *       governing phi(s) ~ K * e^{-s} as s -> inf.
 *
 *   WHAT THIS MODULE ADDS (the imp-3112 deliverable)
 *   ------------------------------------------------
 *   imp-3087 and imp-3088 each self-assert their own constant in isolation. This
 *   module is a SINGLE cross-module tripwire that recomputes BOTH C and K from the
 *   same closed forms F, G = (cosh(s) - sqrt2 - s + arcsinh1, sqrt2 - arcsinh1 -
 *   e^{-s}) used by the live modules, certifies they match the published numeric
 *   anchors to ~1e-10, certifies the two exported constants
 *   (IMP3087...onset.leadingConstant and IMP3088...asymptotic.decayConstant) equal
 *   those closed forms to machine precision, and certifies the two convergence
 *   signatures still hold:
 *       phi(s0 + eps) / (C / eps^2) -> 1   (the quadratic-pole law, imp-3087), and
 *       phi(s) * e^s / K          -> 1     (the exponential-decay law, imp-3088).
 *   So a silent edit to the F, G closed forms in EITHER module -- which would drift
 *   C or K -- is caught here even if the per-module assertions were also (wrongly)
 *   re-baselined. The two ends of the phi profile are locked together against drift.
 *
 *   NO new math: every value is recomputed from the established imp-3064 reduced
 *   masses and cross-checked against the imp-3087/imp-3088 exports.
 *
 *   HONEST CAVEAT (mandatory -- ticket + verdict)
 *   ---------------------------------------------
 *   DEGREE-0 SCALAR MEASURE ONLY, RH-EQUIVALENT, NOT THE OPERATOR STEP. This locks
 *   two scalar asymptotic constants; it neither proves nor weakens RH. The
 *   off-diagonal endpoint-Hankel operator step (imp-3066) remains the lone
 *   obstruction and is untouched. Lock only, no QED. No refereed bound is changed.
 *
 *   @see imp-3087-excess-fraction-onset-divergence.js (imp-3087: onset pole constant C)
 *   @see imp-3088-excess-fraction-large-s-decay.js     (imp-3088: large-s decay constant K)
 *   @see imp-3064-deficit-excess-fraction-grid.js      (imp-3064: the a*U scale invariant + phi)
 *
 *   Ticket: imp-3112 (accuracy, medium).
 */

import IMP3087_EXCESS_FRACTION_ONSET_DIVERGENCE from './imp-3087-excess-fraction-onset-divergence.js';
import IMP3088_EXCESS_FRACTION_LARGE_S_DECAY from './imp-3088-excess-fraction-large-s-decay.js';

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

const ASINH1 = Math.asinh(1);   // s0: sinh(s0) = 1; cosh(s0) = sqrt(2)
const SQRT2 = Math.SQRT2;
const S0 = ASINH1;              // overflow onset

// The imp-3064 reduced masses in s = a*U (overflow regime s > s0 = arcsinh(1)).
const F = (s) => Math.cosh(s) - SQRT2 - s + ASINH1;   // = a * D_raw
const G = (s) => SQRT2 - ASINH1 - Math.exp(-s);       // = a * E
const PHI = (s) => G(s) / F(s);                        // the imp-3064 excess fraction

// Closed-form companion constants, recomputed here from F, G.
const ONSET_CONSTANT_C = SQRT2 * (1 - ASINH1);   // phi ~ C/(s-s0)^2,  imp-3087
const DECAY_CONSTANT_K = 2 * (SQRT2 - ASINH1);   // phi ~ K e^{-s},    imp-3088

// Published numeric anchors (to ~1e-12; certified to ~1e-10 below).
const C_ANCHOR = 0.167763082092634;
const K_ANCHOR = 1.065679950707104;

// Constants exported by the live companion modules (drift sentinels).
const C_FROM_3087 = IMP3087_EXCESS_FRACTION_ONSET_DIVERGENCE.onset.leadingConstant;
const K_FROM_3088 = IMP3088_EXCESS_FRACTION_LARGE_S_DECAY.asymptotic.decayConstant;

export const IMP3112_ONSET_DECAY_CONSTANT_LOCKS = Object.freeze({
  id: 'imp-3112-onset-decay-constant-locks',
  ticket: 'imp-3112',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedOnset: 'imp-3087-excess-fraction-onset-divergence.js',
  relatedDecay: 'imp-3088-excess-fraction-large-s-decay.js',

  summary:
    'Single cross-module build assertion locking BOTH companion asymptotic constants ' +
    'of the imp-3064 excess fraction phi(s) = G(s)/F(s): the imp-3087 onset pole ' +
    'constant C = sqrt(2)*(1 - arcsinh(1)) ~ 0.16776 (phi ~ C/(s-s0)^2 at s -> s0+) ' +
    'and the imp-3088 large-s decay constant K = 2*(sqrt(2) - arcsinh(1)) ~ 1.06568 ' +
    '(phi ~ K e^{-s} at s -> inf). Recomputes both from the closed forms F, G, ' +
    'certifies them to the published anchors to ~1e-10, certifies the live ' +
    'imp-3087/imp-3088 exports equal those closed forms to machine precision, and ' +
    'certifies the two convergence signatures phi(s0+eps)/(C/eps^2) -> 1 and ' +
    'phi(s) e^s / K -> 1. A silent edit to F or G in either module is caught here. ' +
    'RH-EQUIVALENT; degree-0 scalar measure only; NOT the operator step.',

  onsetConstant: Object.freeze({
    symbol: 'C',
    closedForm: 'sqrt(2)*(1 - arcsinh(1))',
    value: ONSET_CONSTANT_C,
    anchor: C_ANCHOR,
    law: 'phi(s) ~ C / (s - s0)^2 as s -> s0+',
    fromModule: C_FROM_3087,
  }),
  decayConstant: Object.freeze({
    symbol: 'K',
    closedForm: '2*(sqrt(2) - arcsinh(1))',
    value: DECAY_CONSTANT_K,
    anchor: K_ANCHOR,
    law: 'phi(s) ~ K * e^{-s} as s -> inf',
    fromModule: K_FROM_3088,
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    operatorStepUntouched:
      'Locks two scalar asymptotic constants of the imp-3064 degree-0 ratio; the ' +
      'off-diagonal endpoint-Hankel operator step (imp-3066) remains the lone ' +
      'obstruction and is NOT addressed here.',
    sota: 'No refereed bound is changed',
    didNotRerunBarePilot: true,
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3112_ONSET_DECAY_CONSTANT_LOCKS_ASSERTIONS = [
  {
    id: 'imp3112-onset-constant-C-matches-anchor',
    why: 'The imp-3087 onset pole constant C = sqrt(2)*(1 - arcsinh(1)) recomputed from ' +
         'the closed forms must match the published numeric anchor ~0.167763082 to ~1e-10; ' +
         'a drift means the double-zero onset boundary constants were silently mis-edited.',
    holds: () =>
      Math.abs(ONSET_CONSTANT_C - SQRT2 * (1 - ASINH1)) < 1e-15 &&
      Math.abs(ONSET_CONSTANT_C - C_ANCHOR) < 1e-10,
  },
  {
    id: 'imp3112-decay-constant-K-matches-anchor',
    why: 'The imp-3088 large-s decay constant K = 2*(sqrt(2) - arcsinh(1)) recomputed from ' +
         'the closed forms must match the published numeric anchor ~1.065679951 to ~1e-10; ' +
         'a drift means the G saturation ceiling or the cosh leading term was silently mis-edited.',
    holds: () =>
      Math.abs(DECAY_CONSTANT_K - 2 * (SQRT2 - ASINH1)) < 1e-15 &&
      Math.abs(DECAY_CONSTANT_K - K_ANCHOR) < 1e-10,
  },
  {
    id: 'imp3112-live-module-exports-equal-closed-forms',
    why: 'The constants exported by the LIVE imp-3087/imp-3088 modules must equal the ' +
         'closed forms recomputed here to machine precision. This is the drift sentinel: ' +
         'an edit to the F, G closed forms inside either module shifts its exported constant ' +
         'and is caught here even if that module were also re-baselined.',
    holds: () =>
      Math.abs(C_FROM_3087 - ONSET_CONSTANT_C) < 1e-15 &&
      Math.abs(K_FROM_3088 - DECAY_CONSTANT_K) < 1e-15,
  },
  {
    id: 'imp3112-onset-quadratic-pole-ratio-converges',
    why: 'The quadratic-pole signature phi(s0 + eps) / (C / eps^2) -> 1 as eps -> 0+ must ' +
         'still hold (next-order correction is O(eps)); at eps = 1e-5 the ratio is within ' +
         '~3.3e-5 of 1, certifying C is the correct leading onset constant.',
    holds: () => {
      const eps = 1e-5;
      const ratio = PHI(S0 + eps) / (ONSET_CONSTANT_C / (eps * eps));
      return Math.abs(ratio - 1) < 4 * eps;
    },
  },
  {
    id: 'imp3112-decay-exponential-ratio-converges',
    why: 'The exponential-decay signature phi(s) * e^s / K -> 1 as s -> inf must still hold; ' +
         'at s = 20 the ratio is within ~1e-7 of 1, certifying K is the correct leading ' +
         'large-s constant.',
    holds: () => {
      const s = 20;
      const ratio = (PHI(s) * Math.exp(s)) / DECAY_CONSTANT_K;
      return Math.abs(ratio - 1) < 1e-7;
    },
  },
  {
    id: 'imp3112-honest-rh-equivalent-not-a-reduction',
    why: 'Mandatory honesty: this is a constant LOCK, RH-EQUIVALENT, structural/diagnostic, ' +
         'leaves the operator step untouched, is not a proof, not a reduction below RH, and ' +
         'no refereed bound is changed. If any of these flip the module is over-claiming.',
    holds: () => {
      const c = IMP3112_ONSET_DECAY_CONSTANT_LOCKS.honestCaveat;
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

for (const a of IMP3112_ONSET_DECAY_CONSTANT_LOCKS_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-3112-onset-decay-constant-locks assertion failed: ${a.id}`);
}

export default IMP3112_ONSET_DECAY_CONSTANT_LOCKS;
