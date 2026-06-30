/**
 * @module imp-3129-onset-divergence-tail-locks
 * @fileoverview imp-3129 -- Build-assertion lock for the TWO global integrability
 *   signatures of the imp-3064 excess fraction phi(s) = G(s)/F(s), s = a*U, that
 *   imp-3106 characterized:
 *     - the ONSET DIVERGENCE RATE  eps*I(eps) -> C = sqrt2*(1 - arcsinh1) ~ 0.16776
 *       (the rescaled eps-cutoff onset mass pins the C/eps inverse-square pole), and
 *     - the CONVERGENT TAIL LAW  int_S^inf phi ds ~ K e^{-S}, K = 2*(sqrt2 - arcsinh1)
 *       ~ 1.06568 (the tail ratio -> 1 from above, 1.0005 at S = 10).
 *
 *   WHAT THIS MODULE ADDS (the imp-3129 deliverable)
 *   ------------------------------------------------
 *   imp-3106 computes these two signatures and self-asserts them in isolation. This
 *   module is a SINGLE cross-module tripwire that INDEPENDENTLY recomputes both from
 *   the SAME closed forms F, G = (cosh(s) - sqrt2 - s + arcsinh1, sqrt2 - arcsinh1 -
 *   e^{-s}): the rescaled onset product eps*I(eps) at a small eps (via the bounded
 *   v = 1/(s - s0) substitution) and the tail ratio at S = 10, certifies them against
 *   the onset constant C and the limit 1 to the physically achievable tolerance, and
 *   certifies the LIVE imp-3106 exports (the finest onsetRung.epsTimesMass and the
 *   S = 10 tailRung.ratio) equal those recomputed values to ~1e-9. So a silent edit to
 *   the F, G closed forms in imp-3106 -- which would rebaseline either the divergence
 *   rate or the tail law -- is caught here even if the per-module assertions were also
 *   (wrongly) re-baselined.
 *
 *   NO new math: every value is recomputed from the established imp-3064 reduced
 *   masses and cross-checked against the imp-3106 exports.
 *
 *   HONEST CAVEAT (mandatory -- ticket + verdict)
 *   ---------------------------------------------
 *   DEGREE-0 SCALAR MEASURE ONLY, RH-EQUIVALENT, NOT THE OPERATOR STEP. This locks a
 *   divergence rate and a convergent tail law of a scalar ratio; it neither proves nor
 *   weakens RH. The off-diagonal endpoint-Hankel operator step (imp-3066) remains the
 *   lone obstruction and is untouched. Lock only, no QED. Platt-Trudgian Lambda &lt;= 0.2
 *   REMAINS the rigorous SOTA.
 *
 *   @see imp-3106-excess-fraction-integrability.js (the divergence rate + tail law)
 *   @see imp-3112-onset-decay-constant-locks.js (the companion C, K constant lock)
 *   @see imp-3127-interior-landmark-locks.js (the companion interior landmark lock)
 *   @see imp-3064-deficit-excess-fraction-grid.js (the a*U scale invariant + phi)
 *
 *   Ticket: imp-3129 (accuracy, medium).
 */

import IMP3106_EXCESS_FRACTION_INTEGRABILITY from './imp-3106-excess-fraction-integrability.js';

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

const ASINH1 = Math.asinh(1);   // s0: sinh(s0) = 1; cosh(s0) = sqrt(2)
const SQRT2 = Math.SQRT2;
const S0 = ASINH1;              // overflow onset ~0.88137

// The imp-3064 reduced masses in s = a*U (overflow regime s > s0 = arcsinh(1)).
const F = (s) => Math.cosh(s) - SQRT2 - s + ASINH1;   // = a * D_raw
const G = (s) => SQRT2 - ASINH1 - Math.exp(-s);       // = a * E
const PHI = (s) => G(s) / F(s);                        // the imp-3064 excess fraction

// The imp-3087/imp-3088 companion envelope constants (recomputed from F, G).
const C_POLE = SQRT2 * (1 - ASINH1);    // phi ~ C/(s-s0)^2,  imp-3087: divergence rate
const K_DECAY = 2 * (SQRT2 - ASINH1);   // phi ~ K e^{-s},    imp-3088: tail law

// Composite Simpson (n even). SAME deterministic code path as imp-3106 so the
// independent recompute reproduces the live numerics to ~1e-9.
function simpson(f, a, b, n) {
  const h = (b - a) / n;
  let sum = f(a) + f(b);
  for (let i = 1; i < n; i++) sum += (i % 2 ? 4 : 2) * f(a + i * h);
  return (sum * h) / 3;
}

// Independent recompute of the rescaled onset product eps*I(eps) at the finest eps,
// in the v = 1/(s - s0) substitution that maps the inverse-square integrand to the
// bounded h(v) = phi(s0 + 1/v)/v^2 -> C. (Mirrors imp-3106.onsetMass.)
const ONSET_SIMPSON_N = 20000;
function onsetMass(eps) {
  const h = (v) => PHI(S0 + 1 / v) / (v * v);
  return simpson(h, 1, 1 / eps, ONSET_SIMPSON_N);
}
const FINEST_EPS = 1e-4;
const EPS_TIMES_MASS = FINEST_EPS * onsetMass(FINEST_EPS);   // -> C from above

// Independent recompute of the convergent tail ratio at S = 10. (Mirrors
// imp-3106.tailMass: phi(45) ~ K e^{-45} ~ 1e-19 is below machine noise.)
const TAIL_CAP = 45;
const TAIL_SIMPSON_N = 20000;
const TAIL_S = 10;
const TAIL_MASS_S10 = simpson(PHI, TAIL_S, TAIL_CAP, TAIL_SIMPSON_N);
const TAIL_PREDICTED_S10 = K_DECAY * Math.exp(-TAIL_S);
const TAIL_RATIO_S10 = TAIL_MASS_S10 / TAIL_PREDICTED_S10;   // -> 1 from above

// Live imp-3106 exports (drift sentinels).
const LIVE_ONSET_CONSTANT = IMP3106_EXCESS_FRACTION_INTEGRABILITY.onsetDivergence.onsetConstant;
const LIVE_TAIL_CONSTANT = IMP3106_EXCESS_FRACTION_INTEGRABILITY.convergentTail.tailConstant;
const LIVE_ONSET_RUNGS = IMP3106_EXCESS_FRACTION_INTEGRABILITY.onsetRungs;
const LIVE_TAIL_RUNGS = IMP3106_EXCESS_FRACTION_INTEGRABILITY.tailRungs;
const LIVE_FINEST_ONSET_RUNG = LIVE_ONSET_RUNGS[LIVE_ONSET_RUNGS.length - 1];
const LIVE_TAIL_RUNG_S10 = LIVE_TAIL_RUNGS[LIVE_TAIL_RUNGS.length - 1];

export const IMP3129_ONSET_DIVERGENCE_TAIL_LOCKS = Object.freeze({
  id: 'imp-3129-onset-divergence-tail-locks',
  ticket: 'imp-3129',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedIntegrability: 'imp-3106-excess-fraction-integrability.js',
  relatedConstantLock: 'imp-3112-onset-decay-constant-locks.js',
  relatedLandmarkLock: 'imp-3127-interior-landmark-locks.js',

  summary:
    'Single cross-module build assertion locking the TWO global integrability ' +
    'signatures of the imp-3064 excess fraction phi(s) = G(s)/F(s) that imp-3106 ' +
    'characterized: the onset divergence rate eps*I(eps) -> C = sqrt2*(1 - arcsinh1) ' +
    '~ 0.16776 (pinning the C/eps inverse-square pole) and the convergent tail law ' +
    'int_S^inf phi ds ~ K e^{-S}, K = 2*(sqrt2 - arcsinh1) ~ 1.06568 (tail ratio -> 1, ' +
    '1.0005 at S = 10). Independently recomputes eps*I(eps) at eps = 1e-4 (via the ' +
    'bounded v = 1/(s - s0) substitution) and the S = 10 tail ratio from the closed ' +
    'forms F = cosh(s) - sqrt2 - s + arcsinh1, G = sqrt2 - arcsinh1 - e^{-s}, certifies ' +
    'them against C and 1 to the physically achievable tolerance, and certifies the ' +
    'live imp-3106 exports (finest onsetRung.epsTimesMass, S = 10 tailRung.ratio) equal ' +
    'those recomputed values to ~1e-9. A silent edit to F or G in imp-3106 that ' +
    'rebaselines either signature is caught here. RH-EQUIVALENT; degree-0 scalar measure ' +
    'only; NOT the operator step.',

  onsetDivergenceRate: Object.freeze({
    symbol: 'eps*I(eps) -> C',
    equation: 'I(eps) = int_{s0+eps}^{s0+1} phi ds ~ C/eps  (C = sqrt2*(1 - arcsinh1))',
    onsetConstant: C_POLE,
    finestEps: FINEST_EPS,
    epsTimesMassRecomputed: EPS_TIMES_MASS,
    epsTimesMassFromModule: LIVE_FINEST_ONSET_RUNG.epsTimesMass,
    onsetConstantFromModule: LIVE_ONSET_CONSTANT,
  }),
  convergentTailLaw: Object.freeze({
    symbol: 'int_S^inf phi ds / (K e^{-S}) -> 1',
    equation: 'int_S^inf phi ds ~ K e^{-S}  (K = 2*(sqrt2 - arcsinh1))',
    tailConstant: K_DECAY,
    S: TAIL_S,
    tailRatioRecomputed: TAIL_RATIO_S10,
    tailRatioFromModule: LIVE_TAIL_RUNG_S10.ratio,
    tailConstantFromModule: LIVE_TAIL_CONSTANT,
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    operatorStepUntouched:
      'Locks the divergence rate and convergent tail law of the imp-3064 degree-0 ' +
      'ratio; the off-diagonal endpoint-Hankel operator step (imp-3066) remains the ' +
      'lone obstruction and is NOT addressed here.',
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
    didNotRerunBarePilot: true,
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3129_ONSET_DIVERGENCE_TAIL_LOCKS_ASSERTIONS = [
  {
    id: 'imp3129-onset-constant-closed-form-and-live-match',
    why: 'The divergence rate is set by the onset pole constant C = sqrt2*(1 - arcsinh1) ' +
         '~ 0.16776. C recomputed here from the closed forms must equal that expression to ' +
         'machine precision, and the LIVE imp-3106 onsetDivergence.onsetConstant must equal ' +
         'it to ~1e-12; a drift means the inherited onset asymptotic was rebaselined.',
    holds: () =>
      Math.abs(C_POLE - SQRT2 * (1 - ASINH1)) < 1e-15 &&
      Math.abs(C_POLE - 0.167763082) < 1e-6 &&
      Math.abs(LIVE_ONSET_CONSTANT - C_POLE) < 1e-12,
  },
  {
    id: 'imp3129-eps-times-mass-converges-to-C-from-above',
    why: 'The rescaled onset product eps*I(eps) recomputed independently from F, G at ' +
         'eps = 1e-4 must approach C from above (it is within 1% of C at this eps), pinning ' +
         'the C/eps inverse-square pole; and the LIVE imp-3106 finest onsetRung.epsTimesMass ' +
         'must equal this independent recompute to ~1e-9, the cross-module drift sentinel.',
    holds: () =>
      EPS_TIMES_MASS > C_POLE &&
      Math.abs(EPS_TIMES_MASS - C_POLE) < 0.01 * C_POLE &&
      Math.abs(LIVE_FINEST_ONSET_RUNG.epsTimesMass - EPS_TIMES_MASS) < 1e-9,
  },
  {
    id: 'imp3129-tail-constant-closed-form-and-live-match',
    why: 'The convergent tail law decays as K e^{-S} with K = 2*(sqrt2 - arcsinh1) ~ 1.06568. ' +
         'K recomputed here from the closed forms must equal that expression to machine ' +
         'precision, and the LIVE imp-3106 convergentTail.tailConstant must equal it to ~1e-12; ' +
         'a drift means the inherited tail asymptotic was rebaselined.',
    holds: () =>
      Math.abs(K_DECAY - 2 * (SQRT2 - ASINH1)) < 1e-15 &&
      Math.abs(K_DECAY - 1.0656799507) < 1e-9 &&
      Math.abs(LIVE_TAIL_CONSTANT - K_DECAY) < 1e-12,
  },
  {
    id: 'imp3129-tail-ratio-at-S10-is-one-from-above',
    why: 'The convergent tail ratio int_S^inf phi ds / (K e^{-S}) recomputed independently ' +
         'from F, G at S = 10 must approach 1 from above (within 1e-3, ~1.0005), confirming ' +
         'the e^{-s} tail law; and the LIVE imp-3106 S = 10 tailRung.ratio must equal this ' +
         'independent recompute to ~1e-9, the cross-module drift sentinel.',
    holds: () =>
      TAIL_RATIO_S10 > 1 &&
      Math.abs(TAIL_RATIO_S10 - 1) < 1e-3 &&
      LIVE_TAIL_RUNG_S10.S === TAIL_S &&
      Math.abs(LIVE_TAIL_RUNG_S10.ratio - TAIL_RATIO_S10) < 1e-9,
  },
  {
    id: 'imp3129-honest-rh-equivalent-not-a-reduction',
    why: 'Mandatory honesty: this is a divergence-rate + tail-law LOCK, RH-EQUIVALENT, ' +
         'structural/diagnostic, leaves the operator step untouched, is not a proof, not a ' +
         'reduction below RH, and PT 0.2 stays SOTA. If any of these flip the module is ' +
         'over-claiming.',
    holds: () => {
      const c = IMP3129_ONSET_DIVERGENCE_TAIL_LOCKS.honestCaveat;
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

for (const a of IMP3129_ONSET_DIVERGENCE_TAIL_LOCKS_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-3129-onset-divergence-tail-locks assertion failed: ${a.id}`);
}

export default IMP3129_ONSET_DIVERGENCE_TAIL_LOCKS;
