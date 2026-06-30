/**
 * @module imp-3087-excess-fraction-onset-divergence
 * @fileoverview imp-3087 -- Characterize the divergence of the imp-3064 excess
 *   fraction phi(s) = G(s)/F(s) at the overflow ONSET s -> s0+ with
 *   s0 = arcsinh(1), where F(s) -> 0+ while G(s) stays strictly positive, and
 *   confirm phi has NO finite supremum on the open admissible range (s0, inf).
 *
 *   THE SETUP (inherited from imp-3064)
 *   -----------------------------------
 *   imp-3064-deficit-excess-fraction-grid.js established the scale-invariant
 *   reduction of the degree-0 deficit/excess masses to the single product
 *   s = a*U (valid where an overflow exists, s > s0 = arcsinh(1)):
 *       a * D_raw = F(s) = cosh(s) - sqrt(2) - s + arcsinh(1)
 *       a * E     = G(s) = sqrt(2) - arcsinh(1) - e^{-s}
 *   so the excess fraction (the relative price of the forced even cosh-completion
 *   over the minimal kinked cover) depends on s = a*U alone:
 *       phi(s) = G(s) / F(s).
 *   The imp-3064 grid sampled INTERIOR s only and tabulated phi -> 0 as s grows
 *   (F ~ e^s/2 diverges, G saturates). The opposite end -- the onset s -> s0+,
 *   where the overflow first appears -- was never tabulated.
 *
 *   WHAT THIS MODULE ADDS (the imp-3087 deliverable)
 *   ------------------------------------------------
 *   At the onset s0 = arcsinh(1) the head boundary forces F(s0) = 0:
 *       cosh(s0) = sqrt(1 + sinh(s0)^2) = sqrt(2)   (sinh(s0) = 1),
 *       so F(s0) = sqrt(2) - sqrt(2) - s0 + s0 = 0.
 *   But the zero is a DOUBLE zero, because the first derivative also vanishes:
 *       F'(s) = sinh(s) - 1,   F'(s0) = sinh(s0) - 1 = 0,
 *   while the second derivative is strictly positive:
 *       F''(s) = cosh(s),   F''(s0) = cosh(s0) = sqrt(2) > 0.
 *   The numerator stays bounded away from 0 there:
 *       G(s0) = sqrt(2) - arcsinh(1) - e^{-s0}
 *             = sqrt(2) - arcsinh(1) - (sqrt(2) - 1)   [e^{-s0} = 1/(1+sqrt2) = sqrt2 - 1]
 *             = 1 - arcsinh(1) ~ 0.11863 > 0.
 *   By Taylor expansion F(s) = (1/2) F''(s0) (s - s0)^2 + O((s-s0)^3)
 *   = (s - s0)^2 / sqrt(2) + O((s-s0)^3), so phi is a QUADRATIC POLE:
 *       phi(s) ~ C / (s - s0)^2   as s -> s0+,
 *       C = G(s0) / ((1/2) F''(s0)) = sqrt(2) * (1 - arcsinh(1)) ~ 0.16776.
 *   Hence phi(s) -> +infinity (one-sided, from the right; the left side s < s0 is
 *   outside the admissible overflow range), the divergence rate is exactly the
 *   inverse-square (s - s0)^{-2}, and phi has NO finite supremum on (s0, inf):
 *   the price of the cosh-completion is unbounded precisely as the overflow first
 *   appears, the mirror image of the phi -> 0 dilution imp-3064 found at large s.
 *
 *   This module tabulates phi(s0 + eps) on a geometric eps-ladder, divides by the
 *   predicted C/eps^2, and verifies the ratio -> 1 (the quadratic-pole law), that
 *   phi grows ~100x per decade of eps (inverse-square signature), and that the
 *   leading constant equals sqrt(2)*(1 - arcsinh(1)) to high precision.
 *
 *   HONEST CAVEAT (mandatory -- ticket + verdict)
 *   ---------------------------------------------
 *   DEGREE-0 SCALAR MEASURE ONLY, RH-EQUIVALENT, NOT THE OPERATOR STEP. This is a
 *   one-sided limit of the imp-3064 scalar ratio; it neither proves nor weakens
 *   RH. The off-diagonal endpoint-Hankel operator step (imp-3066) remains the lone
 *   obstruction and is untouched. measure only, no QED. Platt-Trudgian
 *   Lambda &lt;= 0.2 REMAINS the rigorous SOTA.
 *
 *   @see imp-3064-deficit-excess-fraction-grid.js (imp-3064: the a*U scale invariant + phi)
 *   @see imp-3088 (the COMPANION large-s decay phi ~ 2(sqrt2-arcsinh1) e^{-s})
 *   @see imp-3007-mupass-overflow-cover.js (imp-3007: the U=6 cover + closed forms)
 *
 *   Ticket: imp-3087 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

const ASINH1 = Math.asinh(1);   // s0 = a*tau_star: sinh(s0) = 1; cosh(s0) = sqrt(2)
const SQRT2 = Math.SQRT2;

// The imp-3064 reduced masses in s = a*U (overflow regime s > s0 = arcsinh(1)).
const F = (s) => Math.cosh(s) - SQRT2 - s + ASINH1;   // = a * D_raw
const G = (s) => SQRT2 - ASINH1 - Math.exp(-s);       // = a * E
const PHI = (s) => G(s) / F(s);                        // the imp-3064 excess fraction

const S0 = ASINH1;                       // overflow onset
const G_AT_ONSET = 1 - ASINH1;           // G(s0) = 1 - arcsinh(1) (closed form)
const FPP_AT_ONSET = SQRT2;              // F''(s0) = cosh(s0) = sqrt(2)
// Leading quadratic-pole constant: phi(s) ~ LEADING_CONSTANT / (s - s0)^2.
const LEADING_CONSTANT = G_AT_ONSET / (0.5 * FPP_AT_ONSET);   // = sqrt(2)*(1 - arcsinh(1))

// Geometric ladder of one-sided offsets eps = s - s0 -> 0+ (approach from the right).
// Stops at 1e-5: below that the closed-form F = cosh(s) - sqrt(2) - s + arcsinh(1)
// loses its leading digits to catastrophic cancellation (F ~ eps^2/sqrt2 sinks toward
// machine epsilon), so finer rungs measure float noise, not the analytic pole. The
// quadratic-pole law is already cleanly confirmed across this five-decade window.
const EPS_LADDER = Object.freeze([1e-1, 1e-2, 1e-3, 1e-4, 1e-5]);

/**
 * One rung of the onset ladder at offset eps = s - s0 > 0. Reports the exact phi,
 * the predicted quadratic-pole value C/eps^2, and their ratio (-> 1 as eps -> 0).
 */
function onsetRung(eps) {
  const s = S0 + eps;
  const phi = PHI(s);
  const predicted = LEADING_CONSTANT / (eps * eps);
  return Object.freeze({
    eps,
    s,
    phi,                         // exact excess fraction G(s)/F(s)
    predicted,                   // leading quadratic-pole law C/eps^2
    ratio: phi / predicted,      // -> 1 as eps -> 0+ (confirms the pole order + constant)
  });
}

const RUNGS = Object.freeze(EPS_LADDER.map(onsetRung));

export const IMP3087_EXCESS_FRACTION_ONSET_DIVERGENCE = Object.freeze({
  id: 'imp-3087-excess-fraction-onset-divergence',
  ticket: 'imp-3087',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedGrid: 'imp-3064-deficit-excess-fraction-grid.js',

  summary:
    'Characterizes the divergence of the imp-3064 excess fraction phi(s) = G(s)/F(s) ' +
    'at the overflow onset s -> s0+ with s0 = arcsinh(1). F has a DOUBLE zero there ' +
    '(F(s0) = 0 and F′(s0) = sinh(s0) - 1 = 0, F′′(s0) = cosh(s0) = sqrt(2) > 0) ' +
    'while G(s0) = 1 - arcsinh(1) ~ 0.11863 > 0, so phi is a QUADRATIC POLE: ' +
    'phi(s) ~ sqrt(2)*(1 - arcsinh(1)) / (s - s0)^2 ~ 0.16776 / (s - s0)^2, growing ' +
    '~100x per decade of (s - s0) and diverging to +infinity one-sidedly. phi has NO ' +
    'finite supremum on the open admissible range (s0, inf): the price of the forced ' +
    'even cosh-completion is unbounded precisely as the overflow first appears -- the ' +
    'mirror image of the phi -> 0 dilution imp-3064 found at large s. ' +
    'RH-EQUIVALENT; degree-0 scalar measure only; NOT the operator step.',

  onset: Object.freeze({
    s0: S0,                                  // arcsinh(1) ~ 0.88137
    FatOnset: 'F(s0) = cosh(s0) - sqrt(2) - s0 + arcsinh(1) = 0  (head boundary cosh(s0) = sqrt2)',
    FprimeAtOnset: 'F′(s0) = sinh(s0) - 1 = 0  (so the zero is DOUBLE, not simple)',
    FdoublePrimeAtOnset: FPP_AT_ONSET,       // cosh(s0) = sqrt(2) > 0
    GatOnset: G_AT_ONSET,                    // 1 - arcsinh(1) ~ 0.11863 > 0 (numerator bounded away from 0)
    leadingConstant: LEADING_CONSTANT,       // sqrt(2)*(1 - arcsinh(1)) ~ 0.16776
    poleOrder: 2,
    law: 'phi(s) ~ sqrt(2)*(1 - arcsinh(1)) / (s - s0)^2 as s -> s0+',
    oneSidedLimit: '+infinity (right-hand; s < s0 lies outside the admissible overflow range)',
    hasFiniteSupremum: false,
  }),

  rungs: RUNGS,

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    operatorStepUntouched:
      'A one-sided limit of the imp-3064 degree-0 scalar ratio; the off-diagonal ' +
      'endpoint-Hankel operator step (imp-3066) remains the lone obstruction and is ' +
      'NOT addressed here.',
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
    didNotRerunBarePilot: true,
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3087_EXCESS_FRACTION_ONSET_DIVERGENCE_ASSERTIONS = [
  {
    id: 'imp3087-F-has-double-zero-at-onset',
    why: 'The whole divergence order rests on F having a DOUBLE zero at s0 = arcsinh(1): ' +
         'both F(s0) = 0 and F′(s0) = sinh(s0) - 1 = 0, with F′′(s0) = cosh(s0) = sqrt(2) > 0. ' +
         'A simple zero would give an inverse-FIRST-power pole, not inverse-square.',
    holds: () =>
      Math.abs(F(S0)) < 1e-12 &&
      Math.abs(Math.sinh(S0) - 1) < 1e-12 &&
      Math.abs(Math.cosh(S0) - SQRT2) < 1e-12,
  },
  {
    id: 'imp3087-G-strictly-positive-at-onset',
    why: 'The numerator must stay bounded away from 0 at the onset for phi to diverge: ' +
         'G(s0) = 1 - arcsinh(1) ~ 0.11863 > 0, matching the closed form sqrt2 - arcsinh1 - (sqrt2 - 1).',
    holds: () =>
      G(S0) > 0.1 &&
      Math.abs(G(S0) - G_AT_ONSET) < 1e-12 &&
      Math.abs(G_AT_ONSET - (1 - ASINH1)) < 1e-15,
  },
  {
    id: 'imp3087-leading-constant-closed-form',
    why: 'The quadratic-pole constant is C = G(s0)/((1/2)F′′(s0)) = sqrt(2)*(1 - arcsinh(1)) ' +
         '~ 0.16776; a drift means the onset boundary constants were mis-derived.',
    holds: () =>
      Math.abs(LEADING_CONSTANT - SQRT2 * (1 - ASINH1)) < 1e-15 &&
      Math.abs(LEADING_CONSTANT - 0.167763082) < 1e-6,
  },
  {
    id: 'imp3087-quadratic-pole-ratio-converges-to-one',
    why: 'The exact phi divided by the predicted C/eps^2 must converge to 1 as eps -> 0+, ' +
         'confirming both the pole ORDER (2) and the leading CONSTANT. The next-order ' +
         'correction is O(eps) (empirically ratio - 1 ~ 3.25*eps), so a 4*eps tolerance ' +
         'tightens by a decade per rung across the clean (un-cancelled) window.',
    holds: () => RUNGS.every((r) => Math.abs(r.ratio - 1) < 4 * r.eps),
  },
  {
    id: 'imp3087-inverse-square-decade-signature',
    why: 'An inverse-square pole grows ~100x per decade of eps; once inside the asymptotic ' +
         'regime (eps <= 1e-3) consecutive ladder rungs (eps shrinking 10x) must scale phi ' +
         'by ~100, distinguishing it from a simple (10x per decade) pole. The coarsest pair ' +
         '(eps 1e-1 -> 1e-2) still carries the O(eps) correction and is excluded.',
    holds: () => {
      let checked = 0;
      for (let i = 1; i < RUNGS.length; i++) {
        if (RUNGS[i].eps > 1e-3) continue;                // skip the coarse, pre-asymptotic pairs
        const factor = RUNGS[i].phi / RUNGS[i - 1].phi;   // eps shrank 10x -> phi up ~100x
        if (!(factor > 90 && factor < 110)) return false;
        checked++;
      }
      return checked >= 2;
    },
  },
  {
    id: 'imp3087-phi-diverges-monotonically-no-supremum',
    why: 'phi must increase strictly as eps -> 0+ (approaching the onset) and exceed any ' +
         'fixed bound, witnessing the absence of a finite supremum on (s0, inf). The finest ' +
         'clean rung (eps = 1e-5) already exceeds 1e9.',
    holds: () => {
      for (let i = 1; i < RUNGS.length; i++) {
        if (!(RUNGS[i].phi > RUNGS[i - 1].phi)) return false;   // EPS_LADDER is decreasing
      }
      const finest = RUNGS[RUNGS.length - 1];
      return finest.eps === 1e-5 && finest.phi > 1e9 &&
        IMP3087_EXCESS_FRACTION_ONSET_DIVERGENCE.onset.hasFiniteSupremum === false;
    },
  },
  {
    id: 'imp3087-honest-rh-equivalent-not-a-reduction',
    why: 'Mandatory honesty: the onset divergence is RH-EQUIVALENT, structural/diagnostic, ' +
         'leaves the operator step untouched, is not a proof, not a reduction below RH, and ' +
         'PT 0.2 stays SOTA. If any of these flip the module is over-claiming.',
    holds: () => {
      const c = IMP3087_EXCESS_FRACTION_ONSET_DIVERGENCE.honestCaveat;
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

for (const a of IMP3087_EXCESS_FRACTION_ONSET_DIVERGENCE_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-3087-excess-fraction-onset-divergence assertion failed: ${a.id}`);
}

export default IMP3087_EXCESS_FRACTION_ONSET_DIVERGENCE;
