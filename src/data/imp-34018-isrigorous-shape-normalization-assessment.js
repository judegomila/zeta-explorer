/**
 * @module imp-34018-isrigorous-shape-normalization-assessment
 *
 * imp-34018 (meta, sonnet-4-6): imp-33997 found the imp-33940/imp-33941/imp-33942/imp-33976/
 * imp-33977 cohort's honesty fields span THREE distinct shapes: bare top-level `isRigorous`
 * (imp-33940/33941/33942), a rollup-derived `allIsRigorousFalse` read live off four child modules
 * (imp-33976), and a nested `honestCaveat.isRigorous` (imp-33977). This ticket ASSESSES whether to
 * normalise all five onto one canonical shape, or document the divergence as intentional. Meta/
 * assessment only: no module's honesty-gate shape is changed, no bound, NO QED.
 *
 * THE ASSESSMENT
 * --------------
 * The three shapes are not arbitrary drift -- each tracks a real structural difference in what the
 * module IS:
 *   - imp-33940/33941/33942 are fresh single-claim measurement modules, so a bare top-level
 *     `isRigorous` (the codebase-wide default -- 231 modules under src/data use this exact shape)
 *     is the natural fit.
 *   - imp-33976 makes NO fresh numerical claim of its own; it is a family rollup over four child
 *     modules, so `allIsRigorousFalse` is live-derived from the children rather than asserted
 *     independently -- collapsing it to a bare `isRigorous` would either duplicate the children's
 *     flags as a dead literal (drift risk if a child ever flips) or require the rollup to read a
 *     child field and rename it to `isRigorous`, which is no safer than the live-derivation it
 *     already does.
 *   - imp-33977 is viz-data plus commentary, and nests its honesty flag inside a `honestCaveat`
 *     object alongside `honestyLock` prose -- itself a WIDELY used codebase convention (`honestCaveat`
 *     appears in 380+ src/data modules), just one that does not always carry an `isRigorous` key
 *     underneath it (many `honestCaveat` objects instead use `isProof` / `isReductionBelowRH`, e.g.
 *     imp-3199's `honestCaveat.isProof`).
 *
 * Codebase-wide, honesty-field shape is ALREADY heterogeneous far beyond this five-module cohort:
 * 231 modules use bare top-level `isRigorous`, but only 3 of the 380+ `honestCaveat`-bearing modules
 * nest an `isRigorous` under it (others use `isProof`/`isReductionBelowRH`/no rigor flag at all,
 * since not every module makes a rigor claim). A five-module cohort matching this pre-existing,
 * codebase-wide multi-shape pattern is consistent with established practice, not a fresh
 * inconsistency introduced by this cohort.
 *
 * THE RECOMMENDATION
 * ------------------
 * DOCUMENT THE DIVERGENCE AS INTENTIONAL; DO NOT NORMALISE.
 *   (1) Each of the three shapes is the correct fit for what its module structurally is (fresh
 *       claim / rollup / viz-data-plus-caveat); forcing one shape would either fabricate an
 *       isRigorous claim on a module that makes none (imp-33976) or flatten an established
 *       honestCaveat convention used identically in hundreds of other modules (imp-33977).
 *   (2) imp-33997's own audit already reads all three shapes LIVE (never assumed), so the
 *       divergence carries zero silent-drift risk today -- a shape change in any member would be
 *       caught by imp-33997's own tripwire failing to find the expected field, not by a downstream
 *       reader silently reading `undefined`.
 *   (3) imp-34017 already found none of the five cohort modules is wired into
 *       scripts/run-assertions.mjs's DATA_MODULES sweep, so normalising the shape buys no build-time
 *       safety the audit module does not already provide by reading live.
 *   (4) Net: adopt "read the honesty flag by its own module's actual shape, never assume one" (the
 *       convention imp-33997 already follows) for any FUTURE audit spanning heterogeneous modules,
 *       rather than spending a ticket forcing five modules into one shape when the other 4,440+
 *       modules in the codebase are not shape-uniform either.
 *
 * @see imp-33997-33940-33941-33942-33976-33977-honesty-gate-audit (the audit that surfaced the 3-way split)
 * @see imp-34017-parent-verdict-clause-tripwire-assessment (the sibling assessment ticket for the same cohort)
 */

import { IMP33997_COHORT_HONESTY_GATE_AUDIT } from './imp-33997-33940-33941-33942-33976-33977-honesty-gate-audit.js';

const COHORT_TICKETS = ['imp-33940', 'imp-33941', 'imp-33942', 'imp-33976', 'imp-33977'];
const SHAPE_VARIANT_COUNT = IMP33997_COHORT_HONESTY_GATE_AUDIT.shapeVariantCount;

export const IMP34018_ISRIGOROUS_SHAPE_NORMALIZATION_ASSESSMENT = Object.freeze({
  id: 'imp-34018',
  proofSection: 'S-frontier',
  question:
    'imp-33997 found the imp-33940/imp-33941/imp-33942/imp-33976/imp-33977 cohort honesty fields ' +
    'span three shapes (bare isRigorous, rollup-derived allIsRigorousFalse, nested ' +
    'honestCaveat.isRigorous). Should the cohort be normalised onto one canonical shape, or is the ' +
    'divergence intentional and worth documenting as such? Assessment only; NOT an RH bound; no QED.',
  cohortTickets: COHORT_TICKETS,
  shapeVariantCountAudited: SHAPE_VARIANT_COUNT,
  priorAuditReference: IMP33997_COHORT_HONESTY_GATE_AUDIT.id,
  recommendation:
    'DOCUMENT AS INTENTIONAL; DO NOT NORMALISE. Each shape matches a real structural difference: ' +
    'imp-33940/33941/33942 are fresh single-claim modules (bare isRigorous, the codebase-wide ' +
    'default used by 231 src/data modules); imp-33976 is a rollup with no fresh claim of its own ' +
    '(live-derived allIsRigorousFalse, correctly avoiding a duplicated or fabricated flag); ' +
    'imp-33977 nests its flag under honestCaveat, an independently common convention (380+ ' +
    'src/data modules) that does not always carry an isRigorous key underneath it. Forcing one ' +
    'shape would misrepresent at least one module\'s actual honesty claim. imp-33997 already reads ' +
    'all three shapes live rather than assuming one, so the divergence carries no silent-drift risk.',
  verdict:
    'ASSESSMENT ONLY (meta, frontier-direction, NOT rigorous). Recommends documenting the 3-way ' +
    'isRigorous-field shape split as an intentional reflection of each module\'s structural role ' +
    '(fresh claim / rollup / viz-caveat), not a defect to retrofit. Does not modify any of the five ' +
    'audited modules. No bound changed; imp-3066 K_a>=0 untouched; NO QED. No refereed bound is changed' +
    '.',
  honest:
    'ASSESSMENT-ONLY -- this module records a recommendation, not a permanent shape change to any ' +
    'of the five cohort modules or to imp-33997\'s audit. No refereed bound is changed' +
    '.',
});

export const IMP34018_ISRIGOROUS_SHAPE_NORMALIZATION_ASSESSMENT_ASSERTIONS = [
  {
    id: 'imp34018-cohort-is-the-five-named-tickets',
    description: 'the assessed cohort names exactly the five imp-33997-audited tickets',
    holds: () => COHORT_TICKETS.length === 5
      && ['imp-33940', 'imp-33941', 'imp-33942', 'imp-33976', 'imp-33977'].every(
        (t) => COHORT_TICKETS.includes(t)
      ),
  },
  {
    id: 'imp34018-shape-variant-count-matches-prior-audit',
    description: 'the 3-way shape split this assessment reasons about matches imp-33997 shapeVariantCount live',
    holds: () => SHAPE_VARIANT_COUNT === 3,
  },
  {
    id: 'imp34018-recommendation-is-document-not-normalise',
    description: 'the recommendation explicitly documents divergence as intentional rather than mandating normalisation',
    holds: () => /DOCUMENT AS INTENTIONAL; DO NOT NORMALISE/.test(IMP34018_ISRIGOROUS_SHAPE_NORMALIZATION_ASSESSMENT.recommendation),
  },
  {
    id: 'imp34018-honesty-gate-assessment-only-no-qed',
    description: 'assessment-only framing, NO QED, no-refereed-bound-change line present',
    holds: () =>
      /ASSESSMENT-ONLY/.test(IMP34018_ISRIGOROUS_SHAPE_NORMALIZATION_ASSESSMENT.honest) &&
      /NO QED/.test(IMP34018_ISRIGOROUS_SHAPE_NORMALIZATION_ASSESSMENT.verdict) &&
      /refereed bound is changed/i.test(IMP34018_ISRIGOROUS_SHAPE_NORMALIZATION_ASSESSMENT.verdict),
  },
];

for (const a of IMP34018_ISRIGOROUS_SHAPE_NORMALIZATION_ASSESSMENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34018-isrigorous-shape-normalization-assessment assertion failed: ${a.id}`);
  }
}

export default IMP34018_ISRIGOROUS_SHAPE_NORMALIZATION_ASSESSMENT;
