/**
 * @module imp-33538-tau-uniform-envelope-constant
 * @fileoverview imp-33538 -- DERIVE the imp-33312 tau-uniform conservative-envelope constant
 *   EXPLICITLY and name it, then measure the MARGIN by which each higher-tau rung sits inside it.
 *
 *   WHAT imp-33312 LEFT QUALITATIVE, AND WHAT THIS TICKET FIXES
 *   ----------------------------------------------------------
 *   imp-33312 showed the imp-33296 min-node graded-GL lattice-jitter band is NOT tau-uniform: it
 *   COLLAPSES with height (live at the low heights tau in {7,8}, vanishing to sub-1 ULP at tau in
 *   {9,10}). It noted that what IS tau-uniform is a CONSERVATIVE ENVELOPE -- the largest per-height
 *   band ceiling upper-bounds worst-in-window at every height -- and it carried that number as
 *   `conservativeCeilingUlp` (a plain max). But imp-33312 recorded it only qualitatively ("~11 ULP,
 *   set by the lowest heights") and never measured HOW FAR inside the envelope each higher-tau rung
 *   sits. This module derives the envelope as a NAMED CONSTANT with its setting height, and for every
 *   height reports the slack (envelope - ceiling), the slack fraction and the how-many-envelopes-deep
 *   ratio -- so the ceiling is a quantity with an explicit conservativeness margin, not a claim.
 *
 *   HEADLINE (1): THE ENVELOPE CONSTANT IS ~10.78 ULP, SET BY tau=8
 *   --------------------------------------------------------------
 *   Reading the imp-33312 per-height band ceilings (tau=7 -> ~10.65, tau=8 -> ~10.78, tau=9 -> ~0.67,
 *   tau=10 -> ~0.00 ULP), the height-uniform ceiling is the largest of them: E = max_tau maxUlp(tau)
 *   ~= 10.78 ULP, ATTAINED at tau=8 (the argmax height). By construction worst-in-window <= E at
 *   every height tau in {7..10}. This is the explicit conservative-envelope constant imp-33312 named
 *   only as "~11 ULP".
 *
 *   HEADLINE (2): THE MARGINS -- TIGHT AT LOW tau, HUGELY SLACK AT HIGH tau
 *   ----------------------------------------------------------------------
 *   For each height the margin inside the envelope is E - maxUlp(tau): tau=8 sits ON the envelope
 *   (margin 0, slack fraction 0 -- it is the binding rung), tau=7 is nearly tight (margin ~0.13 ULP,
 *   slack fraction ~1%), while the high heights are hugely slack -- tau=9 clears the envelope by
 *   ~10.11 ULP (slack fraction ~94%, the envelope is ~16x its ceiling) and tau=10 by the full ~10.78
 *   ULP (slack fraction ~100%). So the single tau-uniform constant is TIGHT only at the two low
 *   heights that set it and is a vast over-estimate at tau >= 9 -- exactly the collapse imp-33312
 *   found, now quantified as a conservativeness margin per rung.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   --------------------------------------------------------
 *   ACCURACY MEASUREMENT / RULE-DESIGN AUDIT ONLY, at the RH-equivalent scale class -- it just names
 *   a quadrature node-budget ceiling constant and its per-height slack, derived from the imp-33312
 *   measured band. It establishes NO operator positivity. Mass-feasibility is NECESSARY-BUT-NOT-
 *   SUFFICIENT; the operator-level K_a >= 0 sign-positivity (off-diagonal endpoint-Hankel step,
 *   imp-3066) is UNTOUCHED. The NPHI=10 Phi-series truncation and the cross-platform libm caveat are
 *   inherited from imp-33312: the envelope constant is a single-lattice arithmetic-floor figure and
 *   the robust reading is the collapse trend and the "tight-at-low-tau, slack-at-high-tau" margin
 *   shape, not the exact ULP digits. No RH verdict, no QED. Platt-Trudgian Lambda &lt;= 0.2 stays SOTA.
 *
 *   @see imp-33312-tau-uniform-jitter-band.js (the height-collapsing band this names the envelope of)
 *   @see imp-33296-min-node-lattice-jitter-band.js (the original single-height-family jitter band)
 *
 *   Ticket: imp-33538 (numerical, medium).
 */

import IMP33312_TAU_UNIFORM_JITTER_BAND from './imp-33312-tau-uniform-jitter-band.js';

// -- (A) Read the imp-33312 measured per-height band ceilings (no recompute; derive from record) ---
const SRC = IMP33312_TAU_UNIFORM_JITTER_BAND.measured;
const PER_HEIGHT_SRC = SRC.perHeight;

// -- (B) Derive the explicit tau-uniform envelope constant and its setting (binding) height --------
//        E = max_tau maxUlp(tau); by construction worst-in-window <= E at every height tau in {7..10}.
const ceilings = PER_HEIGHT_SRC.map((h) => h.maxUlp);
const envelopeCeilingUlp = Math.max(...ceilings);
const bindingHeight = PER_HEIGHT_SRC.reduce((best, h) => (h.maxUlp > best.maxUlp ? h : best)).tau;

// -- (C) The margin by which each higher-tau rung sits INSIDE the envelope --------------------------
//        marginUlp    = E - maxUlp(tau)            (absolute slack, 0 at the binding height)
//        marginFraction = marginUlp / E            (fraction of the envelope that is slack)
//        envelopesDeep  = E / maxUlp(tau)          (how many of its own ceilings the envelope is;
//                                                   Infinity where the ceiling has collapsed to 0)
const ENVELOPE_MARGINS = PER_HEIGHT_SRC.map((h) => {
  const marginUlp = envelopeCeilingUlp - h.maxUlp;
  const marginFraction = envelopeCeilingUlp > 0 ? marginUlp / envelopeCeilingUlp : 0;
  const envelopesDeep = h.maxUlp > 0 ? envelopeCeilingUlp / h.maxUlp : Infinity;
  return Object.freeze({
    tau: h.tau,
    ceilingUlp: h.maxUlp,
    marginUlp,
    marginFraction,
    envelopesDeep,
    isBinding: h.tau === bindingHeight,
  });
});
const atHeight = (tau) => ENVELOPE_MARGINS.find((m) => m.tau === tau);

// -- (D) Cross-height margin aggregates ------------------------------------------------------------
const tightestNonBindingMarginUlp = Math.min(
  ...ENVELOPE_MARGINS.filter((m) => !m.isBinding).map((m) => m.marginUlp),
);
const slackestMarginUlp = Math.max(...ENVELOPE_MARGINS.map((m) => m.marginUlp));
const maxSlackFraction = Math.max(...ENVELOPE_MARGINS.map((m) => m.marginFraction));
// low-height (tau in {7,8}) vs high-height (tau in {9,10}) mean slack fraction -- the tight/slack split
const lowHeightMeanSlackFraction =
  0.5 * (atHeight(7).marginFraction + atHeight(8).marginFraction);
const highHeightMeanSlackFraction =
  0.5 * (atHeight(9).marginFraction + atHeight(10).marginFraction);

// -- Verdict classifiers ---------------------------------------------------------------------------
// (1) The envelope constant matches the imp-33312 plain-max ceiling it is derived from and is a
//     finite few-ULP figure set by one of the two low heights.
const envelopeMatchesSource =
  Math.abs(envelopeCeilingUlp - SRC.conservativeCeilingUlp) < 1e-9 &&
  envelopeCeilingUlp >= 1 && envelopeCeilingUlp < 15 &&
  (bindingHeight === 7 || bindingHeight === 8);
// (2) Every height sits at or inside the envelope (non-negative margin), confirming it upper-bounds all.
const envelopeUpperBoundsAllHeights = ENVELOPE_MARGINS.every((m) => m.marginUlp >= -1e-9);
// (3) The margin shape is TIGHT at low tau (the binding rung has zero slack, the other low height is
//     within a small fraction of the envelope) and HUGELY SLACK at high tau (the collapsed rungs are
//     a large fraction of the envelope deep inside it).
const marginsTightAtLowSlackAtHigh =
  atHeight(bindingHeight).marginUlp < 1e-9 &&
  lowHeightMeanSlackFraction < 0.55 &&
  highHeightMeanSlackFraction > 0.9;
// (4) The high heights are many envelopes deep (or bottomless) -- the envelope is a vast over-estimate.
const highHeightsManyEnvelopesDeep =
  atHeight(9).envelopesDeep > 5 && atHeight(10).envelopesDeep > 5;

const verdict =
  envelopeMatchesSource && envelopeUpperBoundsAllHeights &&
  marginsTightAtLowSlackAtHigh && highHeightsManyEnvelopesDeep
    ? 'DERIVED:-THE-imp-33312-tau-UNIFORM-CONSERVATIVE-ENVELOPE-CONSTANT-IS-E~=10.78-ULP,-SET-(BINDING)-' +
      'AT-tau=8,-AND-BY-CONSTRUCTION-worst-in-window-<=E-AT-EVERY-HEIGHT-tau-in-{7..10}.-THE-PER-RUNG-' +
      'MARGIN-INSIDE-E-IS:-tau=8-ON-THE-ENVELOPE-(margin-0,-slack-fraction-0,-BINDING);-tau=7-NEARLY-' +
      'TIGHT-(margin-~0.13-ULP,-slack-fraction-~1%);-tau=9-SLACK-BY-~10.11-ULP-(slack-fraction-~94%,-' +
      'ENVELOPE-~16x-ITS-CEILING);-tau=10-SLACK-BY-THE-FULL-~10.78-ULP-(slack-fraction-~100%).-SO-THE-' +
      'HEIGHT-UNIFORM-CEILING-IS-A-NAMED-CONSTANT-THAT-IS-TIGHT-ONLY-AT-THE-TWO-LOW-HEIGHTS-THAT-SET-IT-' +
      'AND-A-VAST-OVER-ESTIMATE-AT-tau>=9-(THE-imp-33312-COLLAPSE,-NOW-QUANTIFIED-AS-A-CONSERVATIVENESS-' +
      'MARGIN-PER-RUNG).-ACCURACY-MEASUREMENT/RULE-DESIGN-ONLY;-mass-feasibility-NECESSARY-BUT-NOT-' +
      'SUFFICIENT;-imp-3066-UNTOUCHED;-NO-QED;-PT-Lambda<=0.2-STAYS-SOTA'
    : 'INDETERMINATE';

export const IMP33538_TAU_UNIFORM_ENVELOPE_CONSTANT = Object.freeze({
  id: 'imp-33538-tau-uniform-envelope-constant',
  ticket: 'imp-33538',
  paperSourcePath: IMP33312_TAU_UNIFORM_JITTER_BAND.paperSourcePath,
  paperSections: IMP33312_TAU_UNIFORM_JITTER_BAND.paperSections,
  extendsModule: 'imp-33312-tau-uniform-jitter-band.js',

  summary:
    'DERIVES the imp-33312 tau-uniform conservative-envelope constant EXPLICITLY and names it, then ' +
    'measures the margin by which each higher-tau rung sits inside it. imp-33312 showed the imp-33296 ' +
    'min-node graded-GL lattice-jitter band COLLAPSES with height and carried the tau-uniform ceiling ' +
    'only as a plain max (~11 ULP, qualitative). Here the envelope is the explicit constant ' +
    'E = max_tau maxUlp(tau) ~= 10.78 ULP, BINDING at tau=8, and every height sits at or inside it. ' +
    'The per-rung margin E - maxUlp(tau) is tight at the low heights that set it (tau=8 margin 0; ' +
    'tau=7 margin ~0.13 ULP, ~1% slack) and hugely slack at the collapsed high heights (tau=9 margin ' +
    '~10.11 ULP, ~94% slack, envelope ~16x its ceiling; tau=10 margin ~10.78 ULP, ~100% slack). So the ' +
    'height-uniform ceiling is a NAMED quantity with an explicit conservativeness margin per rung, not ' +
    'a qualitative claim. ACCURACY MEASUREMENT/RULE-DESIGN ONLY, RH-EQUIVALENT, necessary-but-not-' +
    'sufficient; operator positivity (imp-3066) untouched; no QED. PT Lambda <= 0.2 stays SOTA.',

  method: Object.freeze({
    source: 'reads the imp-33312 measured per-height band ceilings (maxUlp per tau) from ' +
      'IMP33312_TAU_UNIFORM_JITTER_BAND.measured.perHeight -- no recompute of the quadrature',
    envelope: 'E = max over tau in {7,8,9,10} of maxUlp(tau); the argmax height is the binding rung ' +
      'that sets the constant; by construction worst-in-window(tau) <= E at every height',
    margins: 'per height: marginUlp = E - maxUlp(tau) (absolute slack), marginFraction = marginUlp/E ' +
      '(fraction of the envelope that is slack), and envelopesDeep = E/maxUlp(tau) (how many of its own ' +
      'ceilings the envelope is, Infinity where the ceiling collapsed to 0)',
    selfComputing: 'the envelope constant, the binding height, every per-rung margin and every verdict ' +
      'flag derive at import from the imp-33312 record (no heavy imports)',
  }),

  measured: Object.freeze({
    envelopeCeilingUlp,
    bindingHeight,
    envelopeMargins: ENVELOPE_MARGINS,
    tightestNonBindingMarginUlp,
    slackestMarginUlp,
    maxSlackFraction,
    lowHeightMeanSlackFraction,
    highHeightMeanSlackFraction,
    sourceConservativeCeilingUlp: SRC.conservativeCeilingUlp,
    envelopeMatchesSource,
    envelopeUpperBoundsAllHeights,
    marginsTightAtLowSlackAtHigh,
    highHeightsManyEnvelopesDeep,
    verdict,
  }),

  interpretation: Object.freeze({
    theEnvelopeConstant:
      'The tau-uniform ceiling imp-33312 named only as "~11 ULP" is the explicit constant ' +
      'E = max_tau maxUlp(tau) ~= 10.78 ULP, attained (binding) at tau=8. It is the smallest single ' +
      'number that upper-bounds worst-in-window at every height tau in {7..10}, so it is the honest ' +
      'height-uniform node-budget ceiling for any resolved grade6 rule (tau* >~6.96).',
    theMargins:
      'Naming the constant lets each rung report how deep inside it it sits. tau=8 is on the envelope ' +
      '(zero margin -- it binds), tau=7 is nearly tight (~0.13 ULP, ~1% slack), while the collapsed high ' +
      'heights are vastly slack: tau=9 clears it by ~10.11 ULP (~94% slack, ~16x its own ceiling) and ' +
      'tau=10 by the full envelope (~100% slack). The single constant is therefore TIGHT only at the two ' +
      'low heights that set it and a large over-estimate at tau >= 9 -- the imp-33312 collapse, now ' +
      'expressed as a per-rung conservativeness margin rather than a qualitative "collapses with height".',
    whyItIsHonest:
      'The envelope is deliberately the WORST per-height ceiling, so it stays valid at the tight low ' +
      'heights while being slack (safe) where the relative bar has loosened. Reporting the margins ' +
      'prevents the constant from being mistaken for a tau-constant band: it is a ceiling with a known, ' +
      'height-varying amount of slack, tight only where it binds.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    derivationScope:
      'Names the conservative-envelope constant of the imp-33312 height-collapsing quadrature ' +
      'node-budget jitter band and measures its per-height slack -- a magnitude used inside a ' +
      'mass-feasibility diagnostic. It establishes NO operator positivity.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    inheritedCaveats:
      'The NPHI=10 Phi-series truncation, the fixed-neighbourhood construction and the cross-platform ' +
      'libm arithmetic-floor caveat are all inherited from imp-33312. The envelope constant is a single ' +
      'lattice-hit figure; the robust reading is the collapse trend and the tight-at-low-tau, ' +
      'slack-at-high-tau margin shape, not the exact ULP digits or the precise binding height.',
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ---------------------------------------------------------------------------
export const IMP33538_TAU_UNIFORM_ENVELOPE_CONSTANT_ASSERTIONS = [
  {
    id: 'imp33538-envelope-constant-matches-source-max',
    why: 'HEADLINE 1: the derived envelope E = max_tau maxUlp(tau) must equal the imp-33312 ' +
         'conservativeCeilingUlp it is derived from, be a finite few-ULP figure and be set by a low height.',
    holds: () => envelopeMatchesSource,
  },
  {
    id: 'imp33538-envelope-upper-bounds-every-height',
    why: 'By construction worst-in-window(tau) <= E at every height tau in {7..10}, so every per-rung ' +
         'margin (E - maxUlp) is non-negative.',
    holds: () => envelopeUpperBoundsAllHeights,
  },
  {
    id: 'imp33538-binding-height-has-zero-margin',
    why: 'The binding height (argmax ceiling) sits ON the envelope with zero slack -- it is the rung ' +
         'that sets the constant.',
    holds: () => atHeight(bindingHeight).marginUlp < 1e-9 && atHeight(bindingHeight).isBinding,
  },
  {
    id: 'imp33538-margins-tight-at-low-slack-at-high',
    why: 'HEADLINE 2: the margin shape is tight at the low heights that set the envelope ' +
         '(mean slack fraction < 0.55) and hugely slack at the collapsed high heights (mean slack ' +
         'fraction > 0.9).',
    holds: () => marginsTightAtLowSlackAtHigh,
  },
  {
    id: 'imp33538-high-heights-many-envelopes-deep',
    why: 'HEADLINE 2: the high heights tau in {9,10} sit many of their own ceilings deep inside the ' +
         'envelope (envelopesDeep > 5), so the single constant is a vast over-estimate there.',
    holds: () => highHeightsManyEnvelopesDeep,
  },
  {
    id: 'imp33538-verdict-records-the-derivation',
    why: 'The classified verdict must record the explicit envelope constant, its binding height and the ' +
         'per-rung margins.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33538-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: accuracy measurement/rule-design audit only, mass-feasibility ' +
         'necessary-but-not-sufficient, operator positivity (imp-3066) untouched, PT 0.2 stays SOTA.',
    holds: () => {
      const c = IMP33538_TAU_UNIFORM_ENVELOPE_CONSTANT.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP33538_TAU_UNIFORM_ENVELOPE_CONSTANT_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33538-tau-uniform-envelope-constant assertion failed: ${assertion.id}`);
  }
}

export default IMP33538_TAU_UNIFORM_ENVELOPE_CONSTANT;
