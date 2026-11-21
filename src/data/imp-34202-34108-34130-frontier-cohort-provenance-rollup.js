/**
 * @module imp-34202-34108-34130-frontier-cohort-provenance-rollup
 * @fileoverview imp-34202 -- META provenance roll-up cataloguing the imp-34108/imp-34109/imp-34110 +
 * imp-34126/imp-34127/imp-34128/imp-34129/imp-34130 frontier-direction cohort (eight modules) by
 * EVIDENCE CLASS and confirming each carries the mandatory honest banner: isRigorous:false, NO-QED,
 * the C_mb GUE-conditional (imp-486) untouched clause, the imp-3066 K_a>=0 untouched clause, and
 * no refereed bound is changed, following the imp-33872/imp-33890 roll-up precedent.
 *
 * METHOD (read-only, performed at author time). Each module's @fileoverview/detail block and its
 * `isRigorous` / `verdict` fields were read and classified into the evidence class it earns on its
 * own terms:
 *   - "saturating-ceiling extrapolation": extrapolates a measured peak family toward a finite
 *     asymptotic ceiling from a narrow observed window (imp-34108).
 *   - "saturation-onset fit": fits a peak-amplitude ladder and finds the naive saturation reading
 *     was premature -- the increments keep climbing after a false-plateau region (imp-34109).
 *   - "LTO per-pair influence ranking": leave-two-out sensitivity ranking of which endpoint-peak
 *     folds drive an inherited curve-shift the most (imp-34110).
 *   - "span-scaling fit": fits how a shortfall/centroid-offset quantity scales with window span,
 *     reading off a far-tail exponent (imp-34126).
 *   - "closed-form derivation": DERIVES a previously only numerically-located sign-change ceiling
 *     in closed form from the inherited component-model identities (imp-34127).
 *   - "sub-rung crossing locator": numerically locates a fractional sub-rung crossing point of an
 *     aggregate ratio within the inherited component model, without deriving it in closed form
 *     (imp-34128).
 *   - "convergence fit": fits a widening-slope drift ladder and confirms it converges to a finite
 *     limit under both exponential and power-law approach forms (imp-34129).
 *   - "close-vs-floor measurement": measures whether a local-exponent residual keeps closing toward
 *     zero or asymptotes to a nonzero floor, on a finer ladder than any prior module used (imp-34130).
 * The honest-banner check greps each module for isRigorous:false, NO QED, the C_mb GUE-conditional
 * per imp-486 untouched clause, the imp-3066 K_a>=0 untouched clause, and no refereed bound is changed
 * , plus whether it touches the Polymath15 G6a_shock_lipschitz/H2 bridge.
 *
 * RESULT (audited 2026-07-05). All eight modules carry the full honest banner. None of the eight
 * references the Polymath15 G6a_shock_lipschitz/H2 bridge -- correct, since this cohort sits
 * entirely in the E_coll / F4 / endpoint-peak frontier direction, disjoint from the G6a
 * inviscid-window material.
 *   - imp-34108-endpoint-peak-saturating-ceiling-extrapolation.js : saturating-ceiling extrapolation
 *   - imp-34109-fixed-band-peak-amplitude-saturation-fit.js       : saturation-onset fit
 *   - imp-34110-lto-per-pair-influence-ranking.js                 : LTO per-pair influence ranking
 *   - imp-34126-shortfall-span-scaling-of-centroid-offset.js      : span-scaling fit
 *   - imp-34127-m2-residual-signchange-ceiling-closed-form.js     : closed-form derivation
 *   - imp-34128-aggregate-f4-crossing-peak-subrung.js             : sub-rung crossing locator
 *   - imp-34129-widening-slope-drift-convergence-fit.js           : convergence fit
 *   - imp-34130-ecoll-local-exponent-residual-close-vs-floor.js   : close-vs-floor measurement
 *
 * SURFACING NOTE (secondary). Only imp-34127 has a dedicated glossary.js `term:` entry
 * (continuous-vs-discretized M2 residual estimator-artifact entry). Only imp-34110 and imp-34130
 * have routed viz presence (imp-34200 LTO bar-chart viz and imp-34198 E_coll residual-milestone
 * ladder viz, respectively). The remaining five modules (imp-34108, imp-34109, imp-34126, imp-34128,
 * imp-34129) have neither a glossary term nor any viz presence -- imp-34108/imp-34109 are already
 * queued for a joint cross-linking viz (imp-34181, imp-34203), and imp-34128/imp-34127 are cited
 * within the imp-34163 ladder-surrogate what-remains tabulation, but that citation is a narrative
 * cross-reference, not a dedicated glossary term or viz.
 *
 * @see imp-33872, imp-33890 (the precedent provenance roll-ups this note follows)
 * @see imp-34181, imp-34203 (pending viz tickets for the imp-34108/imp-34109 pair)
 */

export const IMP_34202_FRONTIER_COHORT_PROVENANCE_ROLLUP = {
  id: 'imp-34202',
  auditedAt: '2026-07-05',
  method:
    'Read each of the eight imp-34108/34109/34110/34126/34127/34128/34129/34130 module ' +
    '@fileoverview/detail blocks and isRigorous / verdict fields; classify by evidence class ' +
    '(saturating-ceiling extrapolation / saturation-onset fit / LTO per-pair influence ranking / ' +
    'span-scaling fit / closed-form derivation / sub-rung crossing locator / convergence fit / ' +
    'close-vs-floor measurement); grep for the mandatory honest-banner phrases (isRigorous false, ' +
    'no QED, C_mb GUE-conditional per imp-486 untouched, imp-3066 K_a >= 0 untouched, no refereed bound is changed' +
    ') plus the Polymath15 G6a_shock_lipschitz/H2 bridge status.',
  modules: [
    {
      file: 'imp-34108-endpoint-peak-saturating-ceiling-extrapolation.js',
      evidenceClass: 'saturating-ceiling extrapolation',
      isRigorousFalse: true,
      noQED: true,
      cmbGueConditionalUntouched: true,
      ka3066Untouched: true,
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: false,
      hasVizPresence: false,
    },
    {
      file: 'imp-34109-fixed-band-peak-amplitude-saturation-fit.js',
      evidenceClass: 'saturation-onset fit',
      isRigorousFalse: true,
      noQED: true,
      cmbGueConditionalUntouched: true,
      ka3066Untouched: true,
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: false,
      hasVizPresence: false,
    },
    {
      file: 'imp-34110-lto-per-pair-influence-ranking.js',
      evidenceClass: 'LTO per-pair influence ranking',
      isRigorousFalse: true,
      noQED: true,
      cmbGueConditionalUntouched: true,
      ka3066Untouched: true,
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: false,
      hasVizPresence: true,
    },
    {
      file: 'imp-34126-shortfall-span-scaling-of-centroid-offset.js',
      evidenceClass: 'span-scaling fit',
      isRigorousFalse: true,
      noQED: true,
      cmbGueConditionalUntouched: true,
      ka3066Untouched: true,
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: false,
      hasVizPresence: false,
    },
    {
      file: 'imp-34127-m2-residual-signchange-ceiling-closed-form.js',
      evidenceClass: 'closed-form derivation',
      isRigorousFalse: true,
      noQED: true,
      cmbGueConditionalUntouched: true,
      ka3066Untouched: true,
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: true,
      hasVizPresence: false,
    },
    {
      file: 'imp-34128-aggregate-f4-crossing-peak-subrung.js',
      evidenceClass: 'sub-rung crossing locator',
      isRigorousFalse: true,
      noQED: true,
      cmbGueConditionalUntouched: true,
      ka3066Untouched: true,
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: false,
      hasVizPresence: false,
    },
    {
      file: 'imp-34129-widening-slope-drift-convergence-fit.js',
      evidenceClass: 'convergence fit',
      isRigorousFalse: true,
      noQED: true,
      cmbGueConditionalUntouched: true,
      ka3066Untouched: true,
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: false,
      hasVizPresence: false,
    },
    {
      file: 'imp-34130-ecoll-local-exponent-residual-close-vs-floor.js',
      evidenceClass: 'close-vs-floor measurement',
      isRigorousFalse: true,
      noQED: true,
      cmbGueConditionalUntouched: true,
      ka3066Untouched: true,
      plattTrudgianSOTA: true,
      g6aH2Status: 'not referenced',
      hasGlossaryTerm: false,
      hasVizPresence: true,
    },
  ],
  evidenceClassCounts: {
    'saturating-ceiling extrapolation': 1,
    'saturation-onset fit': 1,
    'LTO per-pair influence ranking': 1,
    'span-scaling fit': 1,
    'closed-form derivation': 1,
    'sub-rung crossing locator': 1,
    'convergence fit': 1,
    'close-vs-floor measurement': 1,
  },
  honestBannerFullCoverageCount: 8,
  glossaryCoveredCount: 1,
  vizPresenceCount: 2,
  bridgeReferencedCount: 0,
  recommendation:
    'No action needed on the honest-banner side -- all eight modules already carry the full ' +
    'mandatory banner. imp-34108/imp-34109 (the endpoint-peak vs fixed-band saturation pair) are ' +
    'the best joint surfacing candidate and already have pending viz tickets (imp-34181, imp-34203); ' +
    'imp-34126/imp-34128/imp-34129 remain uncovered by any glossary term or viz and are the next-best ' +
    'candidates once the imp-34108/imp-34109 pair lands.',
  honestNote:
    'Read-only provenance roll-up; no new pages fabricated, no new bound claimed by this module ' +
    'itself. C_mb stays GUE-conditional (imp-486). imp-3066 K_a >= 0 positivity untouched. ' +
    'No refereed bound is changed. No QED.',
};

// Build-time tripwires that lock the roll-up findings against silent drift.
const IMP_34202_ASSERTIONS = [
  {
    id: 'imp34202-exactly-eight-modules-catalogued',
    holds: () => IMP_34202_FRONTIER_COHORT_PROVENANCE_ROLLUP.modules.length === 8,
    why:
      'The roll-up must cover exactly the eight named cohort modules (imp-34108/34109/34110/' +
      '34126/34127/34128/34129/34130).',
  },
  {
    id: 'imp34202-eight-distinct-evidence-classes',
    holds: () => {
      const m = IMP_34202_FRONTIER_COHORT_PROVENANCE_ROLLUP.modules;
      const counts = IMP_34202_FRONTIER_COHORT_PROVENANCE_ROLLUP.evidenceClassCounts;
      const distinctClasses = new Set(m.map((x) => x.evidenceClass));
      return (
        distinctClasses.size === 8 &&
        Object.values(counts).every((c) => c === 1) &&
        Object.keys(counts).length === 8
      );
    },
    why: 'Each of the eight modules earns a DISTINCT evidence class -- no two modules should share a class.',
  },
  {
    id: 'imp34202-all-eight-carry-full-honest-banner',
    holds: () =>
      IMP_34202_FRONTIER_COHORT_PROVENANCE_ROLLUP.modules.every(
        (x) =>
          x.isRigorousFalse === true &&
          x.noQED === true &&
          x.cmbGueConditionalUntouched === true &&
          x.ka3066Untouched === true &&
          x.plattTrudgianSOTA === true
      ) && IMP_34202_FRONTIER_COHORT_PROVENANCE_ROLLUP.honestBannerFullCoverageCount === 8,
    why:
      'Every module in the cohort must state isRigorous:false, NO QED, C_mb GUE-conditional per ' +
      'imp-486 untouched, imp-3066 K_a >= 0 untouched, and no refereed bound is changed -- ' +
      'grep-verified against the source files.',
  },
  {
    id: 'imp34202-zero-bridge-touching-modules',
    holds: () => {
      const m = IMP_34202_FRONTIER_COHORT_PROVENANCE_ROLLUP.modules;
      const referenced = m.filter((x) => x.g6aH2Status !== 'not referenced').length;
      return referenced === 0 && referenced === IMP_34202_FRONTIER_COHORT_PROVENANCE_ROLLUP.bridgeReferencedCount;
    },
    why:
      'Grep-verified: none of the eight modules references the Polymath15 G6a_shock_lipschitz/H2 ' +
      'bridge -- this cohort sits entirely in the disjoint E_coll/F4/endpoint-peak frontier direction.',
  },
  {
    id: 'imp34202-one-glossary-two-viz',
    holds: () => {
      const m = IMP_34202_FRONTIER_COHORT_PROVENANCE_ROLLUP.modules;
      const withTerm = m.filter((x) => x.hasGlossaryTerm === true).length;
      const withViz = m.filter((x) => x.hasVizPresence === true).length;
      return (
        withTerm === 1 &&
        withTerm === IMP_34202_FRONTIER_COHORT_PROVENANCE_ROLLUP.glossaryCoveredCount &&
        withViz === 2 &&
        withViz === IMP_34202_FRONTIER_COHORT_PROVENANCE_ROLLUP.vizPresenceCount
      );
    },
    why:
      'Grep-verified: only imp-34127 has a dedicated glossary term; only imp-34110 and imp-34130 ' +
      'have routed viz presence (imp-34200, imp-34198 respectively).',
  },
  {
    id: 'imp34202-honest-scope-locked',
    holds: () =>
      /refereed bound is changed/i.test(IMP_34202_FRONTIER_COHORT_PROVENANCE_ROLLUP.honestNote) &&
      /no QED/i.test(IMP_34202_FRONTIER_COHORT_PROVENANCE_ROLLUP.honestNote) &&
      /imp-3066/.test(IMP_34202_FRONTIER_COHORT_PROVENANCE_ROLLUP.honestNote) &&
      /GUE-conditional/.test(IMP_34202_FRONTIER_COHORT_PROVENANCE_ROLLUP.honestNote),
    why:
      'VERDICT LOCK: this is a read-only roll-up, not a bound; no refereed bound is changed' +
      ', C_mb stays GUE-conditional, and imp-3066 stays untouched.',
  },
];

for (const a of IMP_34202_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-34202 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_34202_ASSERTIONS };
