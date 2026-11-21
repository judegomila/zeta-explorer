/**
 * @module imp-3127-interior-landmark-locks
 * @fileoverview imp-3127 -- Build-assertion lock for the THREE interior landmark
 *   scales of the imp-3064 excess fraction phi(s) = G(s)/F(s), s = a*U, that
 *   imp-3105 located between the two asymptotic extremes:
 *     - the UNIQUE phi(s*) = 1 scale  s* ~ 1.48895 (where F = G ~ 0.30723), and
 *     - the TWO envelope crossings of C/(s - s0)^2 = K e^{-s}: the physical
 *       onset->decay handoff  s_cross1 ~ 1.91504  and the algebraic-vs-exponential
 *       re-crossing  s_cross2 ~ 4.31751.
 *
 *   WHAT THIS MODULE ADDS (the imp-3127 deliverable)
 *   ------------------------------------------------
 *   imp-3105 computes these landmarks and self-asserts them in isolation. This
 *   module is a SINGLE cross-module tripwire that recomputes all three landmark
 *   scales from the SAME closed forms F, G = (cosh(s) - sqrt2 - s + arcsinh1,
 *   sqrt2 - arcsinh1 - e^{-s}) by an independent bracketed root find, certifies
 *   them against the published numeric anchors to ~1e-9, and certifies the live
 *   imp-3105 exports (phiEqualsOne.s, envelopeCrossover.handoff.s,
 *   envelopeCrossover.recross.s, and phiEqualsOne.Fvalue) equal those recomputed
 *   scales to ~1e-9. So a silent edit to the F, G closed forms in imp-3105 -- which
 *   would drift any of the three interior landmarks -- is caught here even if the
 *   per-module assertions were also (wrongly) re-baselined.
 *
 *   NO new math: every value is recomputed from the established imp-3064 reduced
 *   masses and cross-checked against the imp-3105 exports.
 *
 *   HONEST CAVEAT (mandatory -- ticket + verdict)
 *   ---------------------------------------------
 *   DEGREE-0 SCALAR MEASURE ONLY, RH-EQUIVALENT, NOT THE OPERATOR STEP. This locks
 *   three interior scalar landmark scales; it neither proves nor weakens RH. The
 *   off-diagonal endpoint-Hankel operator step (imp-3066) remains the lone
 *   obstruction and is untouched. Lock only, no QED. No refereed bound is changed.
 *
 *   @see imp-3105-excess-fraction-crossover-landmarks-2026-06-30.js (the landmarks)
 *   @see imp-3112-onset-decay-constant-locks.js (the companion C, K constant lock)
 *   @see imp-3064-deficit-excess-fraction-grid.js (the a*U scale invariant + phi)
 *
 *   Ticket: imp-3127 (accuracy, medium).
 */

import IMP3105_EXCESS_FRACTION_CROSSOVER_LANDMARKS from './imp-3105-excess-fraction-crossover-landmarks-2026-06-30.js';

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

const ASINH1 = Math.asinh(1);   // s0: sinh(s0) = 1; cosh(s0) = sqrt(2)
const SQRT2 = Math.SQRT2;
const S0 = ASINH1;              // overflow onset ~0.88137

// The imp-3064 reduced masses in s = a*U (overflow regime s > s0 = arcsinh(1)).
const F = (s) => Math.cosh(s) - SQRT2 - s + ASINH1;   // = a * D_raw
const G = (s) => SQRT2 - ASINH1 - Math.exp(-s);       // = a * E
const PHI = (s) => G(s) / F(s);                        // the imp-3064 excess fraction

// The imp-3087/imp-3088 companion envelope constants (recomputed from F, G).
const C_POLE = SQRT2 * (1 - ASINH1);    // phi ~ C/(s-s0)^2,  imp-3087
const K_DECAY = 2 * (SQRT2 - ASINH1);   // phi ~ K e^{-s},    imp-3088
const ENV_POLE = (s) => C_POLE / ((s - S0) * (s - S0));
const ENV_DECAY = (s) => K_DECAY * Math.exp(-s);

/** Plain bisection root-find on a sign-changing f over [a, b] (a, b bracket a root). */
function bisect(f, a, b) {
  let fa = f(a);
  let lo = a;
  let hi = b;
  for (let i = 0; i < 200; i++) {
    const mid = 0.5 * (lo + hi);
    const fm = f(mid);
    if (Math.sign(fm) === Math.sign(fa)) { lo = mid; fa = fm; } else { hi = mid; }
  }
  return 0.5 * (lo + hi);
}

// Independent recompute of the three interior landmarks from the closed forms.
const H_ENV = (s) => ENV_POLE(s) - ENV_DECAY(s);
const S_CROSS1 = bisect(H_ENV, 1.91, 1.92);             // physical onset->decay handoff
const S_CROSS2 = bisect(H_ENV, 4.31, 4.32);             // algebraic-vs-exponential re-crossing
const S_PHI1 = bisect((s) => G(s) - F(s), S0 + 1e-6, S0 + 5);   // unique phi = 1 scale

// Published numeric anchors (to ~1e-12; certified to ~1e-9 below).
const S_CROSS1_ANCHOR = 1.915040235991;
const S_CROSS2_ANCHOR = 4.317512335672;
const S_PHI1_ANCHOR = 1.488945798752;
const FG_PHI1_ANCHOR = 0.307229606402;   // F = G at the phi = 1 crossing

// Live imp-3105 exports (drift sentinels).
const S_PHI1_FROM_3105 = IMP3105_EXCESS_FRACTION_CROSSOVER_LANDMARKS.phiEqualsOne.s;
const FG_PHI1_FROM_3105 = IMP3105_EXCESS_FRACTION_CROSSOVER_LANDMARKS.phiEqualsOne.Fvalue;
const S_CROSS1_FROM_3105 = IMP3105_EXCESS_FRACTION_CROSSOVER_LANDMARKS.envelopeCrossover.handoff.s;
const S_CROSS2_FROM_3105 = IMP3105_EXCESS_FRACTION_CROSSOVER_LANDMARKS.envelopeCrossover.recross.s;

export const IMP3127_INTERIOR_LANDMARK_LOCKS = Object.freeze({
  id: 'imp-3127-interior-landmark-locks',
  ticket: 'imp-3127',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedLandmarks: 'imp-3105-excess-fraction-crossover-landmarks-2026-06-30.js',
  relatedConstantLock: 'imp-3112-onset-decay-constant-locks.js',

  summary:
    'Single cross-module build assertion locking the THREE interior landmark scales ' +
    'of the imp-3064 excess fraction phi(s) = G(s)/F(s) that imp-3105 located: the ' +
    'unique phi = 1 scale s* ~ 1.48895 (F = G ~ 0.30723), the physical onset->decay ' +
    'envelope handoff s_cross1 ~ 1.91504, and the algebraic-vs-exponential re-crossing ' +
    's_cross2 ~ 4.31751. Recomputes all three by an independent bracketed root find on ' +
    'the closed forms F = cosh(s) - sqrt2 - s + arcsinh1, G = sqrt2 - arcsinh1 - e^{-s}, ' +
    'certifies them to the published anchors to ~1e-9, and certifies the live imp-3105 ' +
    'exports (phiEqualsOne.s, .Fvalue, envelopeCrossover.handoff.s, .recross.s) equal ' +
    'those recomputed scales to ~1e-9. A silent edit to F or G in imp-3105 that drifts ' +
    'any landmark is caught here. RH-EQUIVALENT; degree-0 scalar measure only; NOT the ' +
    'operator step.',

  phiEqualsOne: Object.freeze({
    symbol: 's*',
    equation: 'G(s) = F(s)  (phi = 1)',
    value: S_PHI1,
    anchor: S_PHI1_ANCHOR,
    FequalsGvalue: F(S_PHI1),
    FGanchor: FG_PHI1_ANCHOR,
    fromModule: S_PHI1_FROM_3105,
  }),
  envelopeHandoff: Object.freeze({
    symbol: 's_cross1',
    equation: 'C/(s - s0)^2 = K e^{-s}  (physical onset->decay handoff)',
    value: S_CROSS1,
    anchor: S_CROSS1_ANCHOR,
    fromModule: S_CROSS1_FROM_3105,
  }),
  envelopeRecross: Object.freeze({
    symbol: 's_cross2',
    equation: 'C/(s - s0)^2 = K e^{-s}  (algebraic-vs-exponential re-crossing)',
    value: S_CROSS2,
    anchor: S_CROSS2_ANCHOR,
    fromModule: S_CROSS2_FROM_3105,
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    operatorStepUntouched:
      'Locks three interior landmark scales of the imp-3064 degree-0 ratio; the ' +
      'off-diagonal endpoint-Hankel operator step (imp-3066) remains the lone ' +
      'obstruction and is NOT addressed here.',
    sota: 'No refereed bound is changed',
    didNotRerunBarePilot: true,
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3127_INTERIOR_LANDMARK_LOCKS_ASSERTIONS = [
  {
    id: 'imp3127-phi-equals-one-scale-matches-anchor',
    why: 'The unique phi = 1 scale s* recomputed from the closed forms by an independent ' +
         'bracketed root find must match the published anchor ~1.488945799 to ~1e-9, and ' +
         'F = G must coincide at ~0.307229606 there; a drift means the F, G closed forms moved.',
    holds: () =>
      Math.abs(S_PHI1 - S_PHI1_ANCHOR) < 1e-9 &&
      Math.abs(PHI(S_PHI1) - 1) < 1e-12 &&
      Math.abs(F(S_PHI1) - G(S_PHI1)) < 1e-12 &&
      Math.abs(F(S_PHI1) - FG_PHI1_ANCHOR) < 1e-9,
  },
  {
    id: 'imp3127-envelope-handoff-scale-matches-anchor',
    why: 'The physical onset->decay handoff s_cross1 (where C/(s-s0)^2 = K e^{-s}) recomputed ' +
         'from the closed forms must match the published anchor ~1.915040236 to ~1e-9 and the ' +
         'two envelopes must be equal there; a drift means an envelope constant or F, G moved.',
    holds: () =>
      Math.abs(S_CROSS1 - S_CROSS1_ANCHOR) < 1e-9 &&
      S_CROSS1 > S0 && S_CROSS1 < 3 &&
      Math.abs(ENV_POLE(S_CROSS1) - ENV_DECAY(S_CROSS1)) < 1e-12,
  },
  {
    id: 'imp3127-envelope-recross-scale-matches-anchor',
    why: 'The algebraic-vs-exponential re-crossing s_cross2 must match the published anchor ' +
         '~4.317512336 to ~1e-9, must lie beyond the handoff, and must also zero the envelope ' +
         'difference; this pins the SECOND root so the two-root structure cannot silently collapse.',
    holds: () =>
      Math.abs(S_CROSS2 - S_CROSS2_ANCHOR) < 1e-9 &&
      S_CROSS2 > S_CROSS1 &&
      Math.abs(ENV_POLE(S_CROSS2) - ENV_DECAY(S_CROSS2)) < 1e-12,
  },
  {
    id: 'imp3127-live-imp3105-exports-equal-recomputed-landmarks',
    why: 'The landmark scales exported by the LIVE imp-3105 module must equal the values ' +
         'recomputed here from the closed forms to ~1e-9. This is the drift sentinel: an edit ' +
         'to the F, G closed forms inside imp-3105 shifts its exported landmarks and is caught ' +
         'here even if that module were also re-baselined.',
    holds: () =>
      Math.abs(S_PHI1_FROM_3105 - S_PHI1) < 1e-9 &&
      Math.abs(FG_PHI1_FROM_3105 - F(S_PHI1)) < 1e-9 &&
      Math.abs(S_CROSS1_FROM_3105 - S_CROSS1) < 1e-9 &&
      Math.abs(S_CROSS2_FROM_3105 - S_CROSS2) < 1e-9,
  },
  {
    id: 'imp3127-phi-strictly-decreasing-orders-the-landmarks',
    why: 'phi falls strictly from +infinity to 0, so the three landmarks must be ORDERED ' +
         's* < s_cross1 < s_cross2 with phi straddling 1 at s* (phi(s*-) > 1 > phi(s*+)); ' +
         'a re-ordering would signal a corrupted root bracket or a sign flip in F or G.',
    holds: () =>
      S_PHI1 < S_CROSS1 && S_CROSS1 < S_CROSS2 &&
      PHI(S_PHI1 - 0.1) > 1 && PHI(S_PHI1 + 0.1) < 1,
  },
  {
    id: 'imp3127-honest-rh-equivalent-not-a-reduction',
    why: 'Mandatory honesty: this is a landmark LOCK, RH-EQUIVALENT, structural/diagnostic, ' +
         'leaves the operator step untouched, is not a proof, not a reduction below RH, and ' +
         'no refereed bound is changed. If any of these flip the module is over-claiming.',
    holds: () => {
      const c = IMP3127_INTERIOR_LANDMARK_LOCKS.honestCaveat;
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

for (const a of IMP3127_INTERIOR_LANDMARK_LOCKS_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-3127-interior-landmark-locks assertion failed: ${a.id}`);
}

export default IMP3127_INTERIOR_LANDMARK_LOCKS;
