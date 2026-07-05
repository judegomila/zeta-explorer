/**
 * @module imp-34017-parent-verdict-clause-tripwire-assessment
 *
 * imp-34017 (meta, frontier-direction): imp-33997 found that all five imp-33940 / imp-33941 /
 * imp-33942 / imp-33976 / imp-33977 modules state their own "untouched-parent-verdict" clause
 * (e.g. imp-33940/imp-33941 name the imp-33843 log-linear-over-power-law FORM verdict as
 * untouched) only in PROSE -- none of the five module tripwires regex-checks that specific
 * clause; only isRigorous/NO-QED/SOTA are checked. This ticket ASSESSES whether adding an
 * executable assertion for the parent-verdict clause is worth the maintenance cost, PROTOTYPES
 * it for one module (imp-33940), and documents the recommendation. Meta/assessment only: no
 * module's honesty gate is permanently changed by this ticket, no bound, NO QED.
 *
 * THE PROTOTYPE
 * -------------
 * imp-33940's own verdict text names its untouched-parent-verdict clause verbatim: "the imp-33843
 * log-linear-over-power-law verdict is untouched" (see imp-33940-interior-residual-boundary-
 * stability.js, verdict field). A regex tripwire for this is cheap to add: it is the SAME
 * mechanism already used for the NO-QED / SOTA checks (a substring/regex test against a live
 * verdict string, thrown on mismatch), just pointed at the parent-clause sentence instead. The
 * prototype below live-imports imp-33940 and asserts its verdict still names imp-33843 and the
 * word "untouched" -- if a future edit ever drops that clause, this tripwire throws at build time
 * exactly like the existing NO-QED / SOTA tripwires do.
 *
 * THE RECOMMENDATION (assessment only)
 * -------------------------------------
 * WORTH IT, but only as a CONVENTION for future new modules, not a retrofit mandate:
 *   (1) Marginal cost is low -- it is one more regex test slotted into an *_ASSERTIONS array a
 *       module already exports and already throws from; no new mechanism, no new file wiring.
 *   (2) The failure mode it guards against is real: a parent-verdict clause is exactly the kind of
 *       load-bearing prose that a later edit (paraphrase, "clean up the comment", ticket rename)
 *       could silently drop, and unlike isRigorous/NO-QED it currently has ZERO executable
 *       backing across the whole cohort -- imp-33997 confirmed this is a shared, long-standing
 *       gap, not specific to these five modules.
 *   (3) BUT retrofitting all five (or every prior cohort) is lower priority than it looks: none of
 *       imp-33940/imp-33941/imp-33942/imp-33976/imp-33977 is even wired into scripts/run-
 *       assertions.mjs's DATA_MODULES list (grep confirms zero hits), so their *_ASSERTIONS arrays
 *       -- parent-clause or not -- only run when something else imports the module, not on every
 *       build. Adding a parent-clause regex to modules the build-time sweep never loads buys
 *       little; the higher-leverage fix (registering the cohort in DATA_MODULES) is a separate,
 *       larger-blast-radius change outside this ticket's scope.
 *   (4) Net: adopt "state the parent-verdict clause in a form a regex can check" as the convention
 *       for NEW modules going forward (cheap, prevents silent drift), but do not spend a ticket
 *       retrofitting the existing cohort until/unless those modules are wired into the build-time
 *       sweep -- otherwise the added assertion is executable in theory but dormant in practice,
 *       same caveat imp-2746's DATA_MODULES dormancy audit already tracks for other modules.
 *
 * @see imp-33997-33940-33941-33942-33976-33977-honesty-gate-audit (the audit that surfaced the gap)
 * @see imp-33940-interior-residual-boundary-stability (the module this prototype checks)
 */

import { IMP33940_INTERIOR_RESIDUAL_BOUNDARY_STABILITY } from './imp-33940-interior-residual-boundary-stability.js';
import { IMP33997_COHORT_HONESTY_GATE_AUDIT } from './imp-33997-33940-33941-33942-33976-33977-honesty-gate-audit.js';

// Prototype parent-verdict-clause regex, pointed at imp-33940's own untouched-parent clause.
const PARENT_CLAUSE_RE = /imp-33843 log-linear-over-power-law verdict is untouched/;

const PROTOTYPE_PASSES = PARENT_CLAUSE_RE.test(IMP33940_INTERIOR_RESIDUAL_BOUNDARY_STABILITY.verdict);

const DATA_MODULES_SOURCE = 'scripts/run-assertions.mjs';
const COHORT_TICKETS = ['imp-33940', 'imp-33941', 'imp-33942', 'imp-33976', 'imp-33977'];

export const IMP34017_PARENT_VERDICT_CLAUSE_TRIPWIRE_ASSESSMENT = Object.freeze({
  id: 'imp-34017',
  proofSection: 'S-frontier',
  question:
    'imp-33997 found that all five imp-33940/imp-33941/imp-33942/imp-33976/imp-33977 modules name ' +
    'their own untouched-parent-verdict clause only in prose, never regex-checked by the module’s ' +
    'own tripwire. Is adding an executable assertion for that clause worth the maintenance cost? ' +
    'Assessment + one-module prototype only; NOT an RH bound; no QED.',
  prototypedTicket: 'imp-33940',
  prototypeRegexSource: PARENT_CLAUSE_RE.source,
  prototypePasses: PROTOTYPE_PASSES,
  cohortTickets: COHORT_TICKETS,
  cohortWiredIntoBuildSweep: false, // grep of scripts/run-assertions.mjs DATA_MODULES: zero hits
  buildSweepSource: DATA_MODULES_SOURCE,
  priorAuditReference: IMP33997_COHORT_HONESTY_GATE_AUDIT.id,
  recommendation:
    'WORTH IT AS A CONVENTION FOR NEW MODULES, NOT A RETROFIT MANDATE. The prototype above shows a ' +
    'parent-verdict-clause regex is exactly as cheap as the existing NO-QED/SOTA checks (same ' +
    'mechanism, one more *_ASSERTIONS entry) and closes a real silent-drift risk imp-33997 flagged ' +
    'cohort-wide. But none of the five cohort modules is wired into scripts/run-assertions.mjs ' +
    'DATA_MODULES, so an added assertion there is dormant on every build and only fires when some ' +
    'other module happens to import it -- retrofitting the cohort is lower leverage than fixing that ' +
    'wiring gap first, which is out of scope for this assessment ticket.',
  verdict:
    'ASSESSMENT + ONE-MODULE PROTOTYPE ONLY (meta, frontier-direction, NOT rigorous). Recommends ' +
    'adopting an executable parent-verdict-clause regex as convention for future modules while ' +
    'deferring cohort-wide retrofit pending the separate DATA_MODULES wiring question. Does not ' +
    'modify any of the five audited modules or scripts/run-assertions.mjs. No bound changed; imp-3066 ' +
    'K_a>=0 untouched; NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  honest:
    'ASSESSMENT-ONLY -- the prototype regex above is a demonstration import, not a permanent addition ' +
    'to imp-33940’s own *_ASSERTIONS array; no cohort module or the build-time sweep is modified by ' +
    'this ticket. Platt-Trudgian Lambda <= 0.2 stays the rigorous SOTA.',
});

export const IMP34017_PARENT_VERDICT_CLAUSE_TRIPWIRE_ASSESSMENT_ASSERTIONS = [
  {
    id: 'imp34017-prototype-regex-passes-on-live-module',
    description: 'the prototype parent-verdict-clause regex matches imp-33940’s live verdict text',
    holds: () => PROTOTYPE_PASSES === true,
  },
  {
    id: 'imp34017-cohort-is-the-five-named-tickets',
    description: 'the assessed cohort names exactly the five imp-33997-audited tickets',
    holds: () => COHORT_TICKETS.length === 5
      && ['imp-33940', 'imp-33941', 'imp-33942', 'imp-33976', 'imp-33977'].every(
        (t) => COHORT_TICKETS.includes(t)
      ),
  },
  {
    id: 'imp34017-honesty-gate-assessment-only-no-qed',
    description: 'assessment-only framing, NO QED, PT SOTA line present',
    holds: () =>
      /ASSESSMENT-ONLY/.test(IMP34017_PARENT_VERDICT_CLAUSE_TRIPWIRE_ASSESSMENT.honest) &&
      /NO QED/.test(IMP34017_PARENT_VERDICT_CLAUSE_TRIPWIRE_ASSESSMENT.verdict) &&
      /remains SOTA/.test(IMP34017_PARENT_VERDICT_CLAUSE_TRIPWIRE_ASSESSMENT.verdict),
  },
];

for (const a of IMP34017_PARENT_VERDICT_CLAUSE_TRIPWIRE_ASSESSMENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34017-parent-verdict-clause-tripwire-assessment assertion failed: ${a.id}`);
  }
}

export default IMP34017_PARENT_VERDICT_CLAUSE_TRIPWIRE_ASSESSMENT;
