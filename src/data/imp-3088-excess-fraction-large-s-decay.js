/**
 * @module imp-3088-excess-fraction-large-s-decay
 * @fileoverview imp-3088 -- Derive and verify the large-s EXPONENTIAL DECAY rate of
 *   the imp-3064 excess fraction phi(s) = G(s)/F(s): the companion, at the s -> inf
 *   end, of the imp-3087 onset divergence. Confirm
 *       phi(s) ~ 2*(sqrt(2) - arcsinh(1)) * e^{-s}   as s = a*U -> inf,
 *   against the exact closed forms F, G, and report the relative error of the bare
 *   e^{-s} fit across a wide s-range.
 *
 *   THE SETUP (inherited from imp-3064)
 *   -----------------------------------
 *   imp-3064-deficit-excess-fraction-grid.js reduced the degree-0 deficit/excess
 *   masses to the single product s = a*U (valid where an overflow exists,
 *   s > s0 = arcsinh(1)):
 *       a * D_raw = F(s) = cosh(s) - sqrt(2) - s + arcsinh(1)
 *       a * E     = G(s) = sqrt(2) - arcsinh(1) - e^{-s}
 *   so the excess fraction -- the relative price of the forced even cosh-completion
 *   over the minimal kinked cover -- depends on s = a*U alone:
 *       phi(s) = G(s) / F(s).
 *   imp-3064 OBSERVED that phi -> 0 as s grows (F ~ e^s/2 diverges, G saturates at
 *   sqrt(2) - arcsinh(1) ~ 0.533) but never extracted the DECAY CONSTANT. imp-3087
 *   characterized the opposite end (the s -> s0+ quadratic-pole blow-up). This
 *   module fills the remaining gap: the leading large-s asymptotic constant.
 *
 *   WHAT THIS MODULE ADDS (the imp-3088 deliverable)
 *   ------------------------------------------------
 *   As s -> inf the numerator saturates, G(s) -> C := sqrt(2) - arcsinh(1) ~ 0.5328,
 *   while the denominator is dominated by the cosh: F(s) = e^s/2 + e^{-s}/2 - s
 *   - sqrt(2) + arcsinh(1) ~ e^s/2. Hence
 *       phi(s) = G(s)/F(s) ~ C / (e^s/2) = 2C * e^{-s},
 *   i.e. the headline asymptotic
 *       phi(s) ~ K * e^{-s},   K = 2*(sqrt(2) - arcsinh(1)) ~ 1.06568.
 *   Equivalently phi(s) * e^s -> K. The next-order correction is governed by the
 *   linear -s term in F (NOT by the e^{-s} saturation tail of G):
 *       phi(s) * e^s = K * [ 1 + (2s + 2C - 1/C) e^{-s} + O(s e^{-2s}) ],
 *   so the relative error of the bare K*e^{-s} fit decays like ~2s*e^{-s} -- a near
 *   pure exponential, only mildly slowed by the linear s prefactor. This is the
 *   exact mirror of the imp-3087 inverse-square divergence at the onset: the price
 *   of the no-ghost even weight blows up as (s - s0)^{-2} where the overflow first
 *   appears and decays as 2C*e^{-s} where the overflow is large.
 *
 *   This module tabulates phi(s) on a wide s-ladder, divides by the predicted
 *   K*e^{-s}, and verifies the ratio -> 1; it reports the relative error of the
 *   e^{-s} fit (monotone decreasing, -> 0), pins the constant K to the closed form
 *   2*(sqrt(2) - arcsinh(1)), and confirms the (2s + 2C - 1/C) e^{-s} correction
 *   law. The s = 3 rung is cross-checked against the imp-3064 headline cell
 *   (a = 0.5, U = 6) phi ~ 0.0739 as a source-of-truth tie.
 *
 *   HONEST CAVEAT (mandatory -- ticket + verdict)
 *   ---------------------------------------------
 *   DEGREE-0 SCALAR MEASURE ONLY, RH-EQUIVALENT, NOT THE OPERATOR STEP. This is a
 *   leading asymptotic of the imp-3064 scalar ratio; it neither proves nor weakens
 *   RH. The off-diagonal endpoint-Hankel operator step (imp-3066) remains the lone
 *   obstruction and is untouched. measure/derive only, no QED. No refereed bound is changed.
 *
 *   @see imp-3064-deficit-excess-fraction-grid.js (imp-3064: the a*U scale invariant + phi)
 *   @see imp-3087-excess-fraction-onset-divergence.js (imp-3087: the COMPANION onset blow-up)
 *   @see imp-3007-mupass-overflow-cover.js (imp-3007: the U=6 cover + closed forms)
 *
 *   Ticket: imp-3088 (numerical, medium).
 */

import IMP3064_DEFICIT_EXCESS_FRACTION_GRID from './imp-3064-deficit-excess-fraction-grid.js';

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

const ASINH1 = Math.asinh(1);   // s0 = a*tau_star: sinh(s0) = 1; cosh(s0) = sqrt(2)
const SQRT2 = Math.SQRT2;

// The imp-3064 reduced masses in s = a*U (overflow regime s > s0 = arcsinh(1)).
const F = (s) => Math.cosh(s) - SQRT2 - s + ASINH1;   // = a * D_raw
const G = (s) => SQRT2 - ASINH1 - Math.exp(-s);       // = a * E
const PHI = (s) => G(s) / F(s);                        // the imp-3064 excess fraction

const C_SAT = SQRT2 - ASINH1;            // lim_{s->inf} G(s) = a*E saturation ceiling ~0.5328
// Leading large-s decay constant: phi(s) ~ DECAY_CONSTANT * e^{-s}.
const DECAY_CONSTANT = 2 * C_SAT;        // = 2*(sqrt(2) - arcsinh(1)) ~ 1.06568
// Coefficient of the next-order relative correction (phi*e^s)/K - 1 ~ CORR_COEFF(s)*e^{-s}.
const CORR_COEFF = (s) => 2 * s + 2 * C_SAT - 1 / C_SAT;

// Wide ladder of s = a*U values spanning the overflow interior into the deep tail.
const S_LADDER = Object.freeze([2, 3, 4, 5, 6, 8, 10, 12, 15, 20]);

/**
 * One rung of the large-s ladder at s = a*U. Reports the exact phi, the predicted
 * bare asymptotic K*e^{-s}, their ratio (-> 1 as s -> inf), the relative error of
 * the e^{-s} fit, and the next-order correction ratio (-> 1, confirming the
 * (2s + 2C - 1/C) e^{-s} law).
 */
function decayRung(s) {
  const phi = PHI(s);
  const predicted = DECAY_CONSTANT * Math.exp(-s);   // bare leading asymptotic K*e^{-s}
  const fitRelError = Math.abs(phi - predicted) / phi;
  // Next-order check: (phi*e^s)/K - 1 should match CORR_COEFF(s)*e^{-s}.
  const measuredCorr = (phi * Math.exp(s)) / DECAY_CONSTANT - 1;
  const predictedCorr = CORR_COEFF(s) * Math.exp(-s);
  return Object.freeze({
    s,
    phi,                                  // exact excess fraction G(s)/F(s)
    predicted,                            // bare leading asymptotic K*e^{-s}
    ratio: phi / predicted,               // -> 1 as s -> inf (confirms decay rate + constant)
    fitRelError,                          // relative error of the bare e^{-s} fit (-> 0)
    measuredCorr,                         // (phi*e^s)/K - 1
    correctionRatio: measuredCorr / predictedCorr,   // -> 1 (confirms the (2s+2C-1/C) e^{-s} law)
  });
}

const RUNGS = Object.freeze(S_LADDER.map(decayRung));

export const IMP3088_EXCESS_FRACTION_LARGE_S_DECAY = Object.freeze({
  id: 'imp-3088-excess-fraction-large-s-decay',
  ticket: 'imp-3088',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedGrid: 'imp-3064-deficit-excess-fraction-grid.js',
  relatedOnset: 'imp-3087-excess-fraction-onset-divergence.js',

  summary:
    'Derives and verifies the large-s exponential decay rate of the imp-3064 excess ' +
    'fraction phi(s) = G(s)/F(s). As s = a*U -> inf the numerator saturates ' +
    '(G -> sqrt(2) - arcsinh(1) ~ 0.5328) while F ~ e^s/2, so phi(s) ~ K*e^{-s} with ' +
    'K = 2*(sqrt(2) - arcsinh(1)) ~ 1.06568, i.e. phi*e^s -> K. The next-order ' +
    'correction is set by the linear -s term in F: (phi*e^s)/K - 1 ~ (2s + 2C - 1/C) ' +
    'e^{-s}, so the relative error of the bare e^{-s} fit decays like ~2s*e^{-s} ' +
    '(from 55% at s=2 to ~8e-8 at s=20). This extracts the decay CONSTANT imp-3064 ' +
    'left implicit and mirrors the imp-3087 inverse-square onset blow-up: the ' +
    'no-ghost surplus diverges as (s - s0)^{-2} where the overflow first appears and ' +
    'decays as 2C*e^{-s} where it is large. RH-EQUIVALENT; degree-0 scalar measure ' +
    'only; NOT the operator step.',

  asymptotic: Object.freeze({
    law: 'phi(s) ~ 2*(sqrt(2) - arcsinh(1)) * e^{-s} as s = a*U -> inf',
    saturationCeiling: C_SAT,             // lim G(s) = sqrt(2) - arcsinh(1) ~ 0.5328
    decayConstant: DECAY_CONSTANT,        // K = 2*(sqrt(2) - arcsinh(1)) ~ 1.06568
    decayConstantClosedForm: '2*(sqrt(2) - arcsinh(1))',
    decayRate: 'e^{-s} (denominator dominated by F ~ e^s/2; G saturates)',
    limitOfPhiTimesExpS: 'phi(s) * e^s -> 2*(sqrt(2) - arcsinh(1))',
    nextOrderCorrection: '(phi*e^s)/K - 1 ~ (2s + 2C - 1/C) e^{-s}, C = sqrt(2) - arcsinh(1)',
    fitRelErrorScaling: '~2s*e^{-s} (dominated by the linear -s term in F)',
  }),

  rungs: RUNGS,

  /* source-of-truth tie: the s = 3 rung equals the imp-3064 headline (a=0.5, U=6) cell */
  imp3064CrossCheck: Object.freeze({
    s: 3,
    phiFromHere: PHI(3),
    phiFromGrid: IMP3064_DEFICIT_EXCESS_FRACTION_GRID.headline.excessFraction,
    note: '(a, U) = (0.5, 6) gives s = a*U = 3; phi ~ 0.0739 must agree both ways',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    operatorStepUntouched:
      'A leading asymptotic of the imp-3064 degree-0 scalar ratio; the off-diagonal ' +
      'endpoint-Hankel operator step (imp-3066) remains the lone obstruction and is ' +
      'NOT addressed here.',
    sota: 'No refereed bound is changed',
    didNotRerunBarePilot: true,
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3088_EXCESS_FRACTION_LARGE_S_DECAY_ASSERTIONS = [
  {
    id: 'imp3088-decay-constant-closed-form',
    why: 'The headline decay constant is K = 2*(sqrt(2) - arcsinh(1)) ~ 1.06568, twice the ' +
         'G(s) saturation ceiling sqrt(2) - arcsinh(1) (the 1/2 comes from F ~ e^s/2). A drift ' +
         'means the saturation ceiling or the cosh leading term was mis-derived.',
    holds: () =>
      Math.abs(DECAY_CONSTANT - 2 * (SQRT2 - ASINH1)) < 1e-15 &&
      Math.abs(DECAY_CONSTANT - 1.0656799507) < 1e-9 &&
      Math.abs(C_SAT - (SQRT2 - ASINH1)) < 1e-15,
  },
  {
    id: 'imp3088-phi-times-expS-converges-to-K',
    why: 'The core claim phi(s) ~ K*e^{-s} is equivalent to phi(s)*e^s -> K. The ratio ' +
         'phi/(K e^{-s}) must converge to 1 as s grows; tolerance loosens with the next-order ' +
         '~2s*e^{-s} correction. The deepest rung (s = 20) pins it to better than 1e-7.',
    holds: () => RUNGS.every((r) => Math.abs(r.ratio - 1) < 6 * r.s * Math.exp(-r.s) + 1e-9) &&
      Math.abs(RUNGS[RUNGS.length - 1].ratio - 1) < 1e-7,
  },
  {
    id: 'imp3088-fit-relative-error-monotone-decreasing',
    why: 'The relative error of the bare K*e^{-s} fit must decrease strictly as s grows ' +
         '(F blows up faster than the s-prefactor of the correction), confirming the asymptotic ' +
         'tightens monotonically across the whole ladder.',
    holds: () => {
      for (let i = 1; i < RUNGS.length; i++) {
        if (!(RUNGS[i].fitRelError < RUNGS[i - 1].fitRelError)) return false;
      }
      return RUNGS.length === S_LADDER.length;
    },
  },
  {
    id: 'imp3088-fit-relative-error-vanishes',
    why: 'The e^{-s} fit must become essentially exact in the deep tail: at s = 20 the relative ' +
         'error is below 1e-6, witnessing phi(s) -> 0 at exactly the e^{-s} rate (not faster, ' +
         'not slower).',
    holds: () => {
      const deepest = RUNGS[RUNGS.length - 1];
      return deepest.s === 20 && deepest.fitRelError < 1e-6 && deepest.fitRelError > 0;
    },
  },
  {
    id: 'imp3088-next-order-correction-law',
    why: 'The next-order correction is set by the linear -s term in F, NOT the e^{-s} tail of G: ' +
         '(phi*e^s)/K - 1 ~ (2s + 2C - 1/C) e^{-s}. The measured/predicted ratio must converge ' +
         'to 1; the residual is O(e^{-s}) so the tolerance is scaled by e^{-s}.',
    holds: () => RUNGS.every((r) => Math.abs(r.correctionRatio - 1) < 50 * Math.exp(-r.s) + 1e-9),
  },
  {
    id: 'imp3088-matches-imp3064-headline',
    why: 'Source-of-truth tie: s = 3 corresponds to the imp-3064 headline cell (a = 0.5, U = 6), ' +
         'so phi(3) computed here must equal the imp-3064 grid excess fraction ~0.0739. A mismatch ' +
         'means the reduced F/G drifted from the established grid.',
    holds: () => {
      const x = IMP3088_EXCESS_FRACTION_LARGE_S_DECAY.imp3064CrossCheck;
      return Math.abs(x.phiFromHere - x.phiFromGrid) < 1e-9 &&
        Math.abs(x.phiFromHere - 0.0739198) < 1e-6;
    },
  },
  {
    id: 'imp3088-honest-rh-equivalent-not-a-reduction',
    why: 'Mandatory honesty: the large-s decay is RH-EQUIVALENT, structural/diagnostic, leaves ' +
         'the operator step untouched, is not a proof, not a reduction below RH, and no refereed bound is changed' +
         '. If any of these flip the module is over-claiming.',
    holds: () => {
      const c = IMP3088_EXCESS_FRACTION_LARGE_S_DECAY.honestCaveat;
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

for (const a of IMP3088_EXCESS_FRACTION_LARGE_S_DECAY_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-3088-excess-fraction-large-s-decay assertion failed: ${a.id}`);
}

export default IMP3088_EXCESS_FRACTION_LARGE_S_DECAY;
