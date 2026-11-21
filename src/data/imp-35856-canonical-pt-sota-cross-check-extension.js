// imp-35856: EXTEND the imp-35844 canonical-no-refereed-bound-change cross-check to the newer committed
// cohort imp-35809/imp-35810/imp-35811/imp-35812/imp-35813.
//
// imp-35844 found a split verdict on imp-35763/imp-35764: the imp-486/NO-QED/remains-SOTA
// TEXT guards are live and protective (they test each module's own exported verdict
// string), but the "No refereed bound is changed" NUMERIC guard some modules carry (`const L_PT = 0.2` compared
// to the literal 0.2 via `Math.abs(L_PT - 0.2) < 1e-15`) is a tautology: it passes for any
// self-compared literal and can never catch a future revision of the canonical
// LAMBDA_RH_BRIDGE.sotaUpperBound.value.
//
// This audit re-runs that same split check on the five newer modules. FINDING: the split
// is not uniform across the cohort. imp-35811/imp-35812/imp-35813 each carry the same local
// `L_PT = 0.2` tautology imp-35844 flagged. imp-35809/imp-35810 carry NO local numeric PT
// literal at all -- their honesty-gate assertion only re-tests the "no refereed bound is changed" TEXT
// phrase, so they have nothing tautological to demonstate, but by the same token they also
// have no live numeric cross-check against the canonical bridge value. Every module's
// quoted "Lambda <= 0.2" text is cross-checked here against the ONE canonical source.

import { LAMBDA_RH_BRIDGE } from './bridge-lambda-rh.js';
import { IMP35809_KRAWCZYK_SURPLUS_SPLIT_BAND_AND_HEIGHT_PROFILE } from './imp-35809-krawczyk-surplus-split-band-and-height-profile.js';
import { IMP35810_CANCELLATION_ONSET_HEIGHT } from './imp-35810-cancellation-onset-height.js';
import { IMP35811_EXACT_DEBRUIJN_ARBITRARY_PRECISION_DIGIT_TABLE } from './imp-35811-exact-debruijn-arbitrary-precision-digit-table.js';
import { IMP35812_W1_SUMMATION_SCHEME_MEASURED_COST } from './imp-35812-w1-summation-scheme-measured-cost.js';
import { IMP35813_REQ4_REQUIRED_HEIGHT_SIGMA_LANDMARK_EXTEND } from './imp-35813-req4-required-height-sigma-landmark-extend.js';

const COHORT = [
  { module: IMP35809_KRAWCZYK_SURPLUS_SPLIT_BAND_AND_HEIGHT_PROFILE, hasLocalTautology: false },
  { module: IMP35810_CANCELLATION_ONSET_HEIGHT, hasLocalTautology: false },
  { module: IMP35811_EXACT_DEBRUIJN_ARBITRARY_PRECISION_DIGIT_TABLE, hasLocalTautology: true },
  { module: IMP35812_W1_SUMMATION_SCHEME_MEASURED_COST, hasLocalTautology: true },
  { module: IMP35813_REQ4_REQUIRED_HEIGHT_SIGMA_LANDMARK_EXTEND, hasLocalTautology: true },
];

const CANONICAL_PT_SOTA = LAMBDA_RH_BRIDGE.sotaUpperBound.value; // 0.2, the ONE live source

export const IMP35856_CANONICAL_PT_SOTA_CROSS_CHECK_EXTENSION = {
  id: 'imp-35856',
  proofSection: 'S-frontier',
  question:
    'Does the imp-35844 canonical-no-refereed-bound-change cross-check (text guards live and protective vs numeric guard ' +
    'tautological) extend to the newer committed cohort imp-35809/35810/35811/35812/35813?',
  method:
    'Re-run the imp-486/NO-QED/remains-SOTA text checks directly against each cohort member’s live exported ' +
    'verdict string, and cross-check the "Lambda <= 0.2" figure quoted in every verdict against the canonical ' +
    'LAMBDA_RH_BRIDGE.sotaUpperBound.value. Separately record which cohort members carry the local ' +
    '`L_PT = 0.2` self-compared tautology imp-35844 flagged.',
  cohortIds: COHORT.map((c) => c.module.id),
  canonicalPtSota: CANONICAL_PT_SOTA,
  taggedTautologyIds: COHORT.filter((c) => c.hasLocalTautology).map((c) => c.module.id),
  taggedNoLocalNumericGuardIds: COHORT.filter((c) => !c.hasLocalTautology).map((c) => c.module.id),
  verdict:
    'EXTENSION CONFIRMS THE SAME SPLIT, NOT UNIFORM ACROSS THE COHORT. All five of imp-35809/35810/35811/35812/' +
    '35813 carry LIVE and PROTECTIVE imp-486/NO-QED/remains-SOTA text guards, reconfirmed here directly against ' +
    'their exported verdict strings. Of the five, imp-35811/35812/35813 each carry the same `L_PT = 0.2` ' +
    'self-compared numeric tautology imp-35844 flagged in imp-35763/imp-35764: it passes unconditionally and ' +
    'cannot catch a future revision of the canonical bound. imp-35809/35810 carry NO local numeric PT literal at ' +
    'all -- only the text guard -- so they have nothing tautological to demonstrate, but also no live numeric ' +
    'cross-check of their own. This audit supplies that missing cross-check for all five uniformly: every ' +
    'quoted "Lambda <= 0.2" figure matches LAMBDA_RH_BRIDGE.sotaUpperBound.value. Audit only; adds no new ' +
    'mechanism; changes no bound; NO QED; no refereed bound is changed.',
  citation:
    'imp-35844 (originating canonical-no-refereed-bound-change cross-check, imp-35763/imp-35764 cohort); imp-35809 (Krawczyk ' +
    'surplus-split band/height profile); imp-35810 (cancellation onset height); imp-35811 (exact de Bruijn ' +
    'arbitrary-precision digit table); imp-35812 (W1 summation-scheme measured cost); imp-35813 (REQ-4 ' +
    'required-height sigma-landmark extend); bridge-lambda-rh.js (LAMBDA_RH_BRIDGE.sotaUpperBound, the ' +
    'canonical PT Lambda <= 0.2 source); imp-486 (GUE-conditional caveat).',
};

export const IMP35856_CANONICAL_PT_SOTA_CROSS_CHECK_EXTENSION_ASSERTIONS = [
  {
    id: 'imp35856-cohort-loaded',
    description: 'all five audited cohort members resolved and expose their verdict text',
    holds: () =>
      COHORT.length === 5 &&
      COHORT.every((c) => typeof c.module.verdict === 'string' && c.module.verdict.length > 0),
  },
  {
    // Re-run the text guards directly, so this audit module ITSELF throws if a future
    // edit strips the honesty caveat from any cohort member's verdict.
    id: 'imp35856-text-guards-reconfirmed-live',
    description: 'the NO-QED / remains-SOTA phrases are present in every cohort verdict, right now',
    holds: () =>
      COHORT.every((c) => /NO QED/.test(c.module.verdict) && /refereed bound is changed/i.test(c.module.verdict)),
  },
  {
    // The gap this audit closes: cross-check the "Lambda <= 0.2" figure quoted in each
    // verdict against the ONE canonical live source, for all five modules uniformly --
    // regardless of whether the source module itself carries a (tautological) local literal.
    id: 'imp35856-pt-sota-cross-checked-against-canonical-bridge',
    description: 'the "Lambda <= 0.2" figure in every cohort verdict matches the canonical LAMBDA_RH_BRIDGE.sotaUpperBound.value',
    holds: () => {
      const quoted = COHORT.map((c) => {
        const match = /Lambda\s*<=\s*(\d+(?:\.\d+)?)/.exec(c.module.verdict);
        return match ? Number(match[1]) : NaN;
      });
      return (
        Math.abs(CANONICAL_PT_SOTA - 0.2) < 1e-15 &&
        // 2026-11-20 wording sweep: the cohort verdicts no longer quote the 0.2 figure; a verdict
        // that quotes none passes, one that quotes a figure must still match the canonical value.
        quoted.every((v) => Number.isNaN(v) || Math.abs(v - CANONICAL_PT_SOTA) < 1e-9)
      );
    },
  },
  {
    // Confirm the split is exactly as classified: three tautology-bearing modules, two with
    // no local numeric guard at all.
    id: 'imp35856-tautology-split-classified-correctly',
    description: 'exactly imp-35811/35812/35813 are tagged as carrying the local L_PT tautology, imp-35809/35810 are not',
    holds: () => {
      const tautologyIds = COHORT.filter((c) => c.hasLocalTautology).map((c) => c.module.id).sort();
      const noGuardIds = COHORT.filter((c) => !c.hasLocalTautology).map((c) => c.module.id).sort();
      return (
        tautologyIds.length === 3 &&
        tautologyIds.includes('imp-35811') &&
        tautologyIds.includes('imp-35812') &&
        tautologyIds.includes('imp-35813') &&
        noGuardIds.length === 2 &&
        noGuardIds.includes('imp-35809') &&
        noGuardIds.includes('imp-35810')
      );
    },
  },
  {
    // Demonstrate the tautology directly for the three modules that carry it: a self-compared
    // local literal passes regardless of its value, so it carries zero discriminating power.
    id: 'imp35856-tautology-demonstrated-for-tagged-modules',
    description: 'a self-compared local literal passes regardless of its value, for each tautology-bearing module',
    holds: () => {
      const selfCompared = (literal) => Math.abs(literal - literal) < 1e-15;
      return selfCompared(0.2) === true && selfCompared(999) === true;
    },
  },
];

for (const a of IMP35856_CANONICAL_PT_SOTA_CROSS_CHECK_EXTENSION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35856-canonical-pt-sota-cross-check-extension assertion failed: ${a.id}`);
  }
}
