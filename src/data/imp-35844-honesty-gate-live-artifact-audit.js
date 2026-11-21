// imp-35844: AUDIT the honesty-gate assertion guards (imp-486 kept, imp-35337a OPEN,
// NO QED, no refereed bound is changed) on the imp-35763/imp-35764 cohort -- do they reference LIVE artifacts,
// or can they silently pass regardless of the real state of the codebase?
//
// FINDING (split verdict, two different guard classes in the same "honesty gate"):
//
// (1) The imp-486 / "imp-35337a stays OPEN" / "NO QED" / "no refereed bound is changed" regex checks in
//     both imp-35763's and imp-35764's own assertion arrays test each module's OWN
//     `verdict` string. That is self-referential, but it is NOT a no-op: it is a
//     regression guard against a future edit silently stripping the honesty caveat from
//     the verdict prose (e.g. someone tightening the text and dropping "NO QED"). Re-run
//     here directly against the live exported verdict strings -- LIVE and PROTECTIVE.
//
// (2) The "No refereed bound is changed" numeric check in both modules is `const L_PT = 0.2` (a LOCAL literal)
//     followed by `Math.abs(L_PT - 0.2) < 1e-15`. That compares the hardcoded literal to
//     itself -- a tautology that passes unconditionally and can NEVER catch drift if the
//     canonical PT bound (bridge-lambda-rh.js LAMBDA_RH_BRIDGE.sotaUpperBound.value)
//     were ever revised. Neither module cross-checks against that canonical constant.
//     This audit closes exactly that gap: it cross-checks the canonical
//     LAMBDA_RH_BRIDGE.sotaUpperBound.value against the "Lambda <= 0.2" figure quoted in
//     each cohort member's verdict text, so a future canonical-value change that the two
//     modules' own local literals would silently miss gets caught here instead.

import { LAMBDA_RH_BRIDGE } from './bridge-lambda-rh.js';
import { IMP35763_REQ4_REQUIRED_HEIGHT_SIGMA_LANDMARK_FILL } from './imp-35763-req4-required-height-sigma-landmark-fill.js';
import { IMP35764_COLLISION_SCALE_PT_ANCHOR_PREFACTOR_PROPAGATION } from './imp-35764-collision-scale-pt-anchor-prefactor-propagation.js';

const COHORT = [
  IMP35763_REQ4_REQUIRED_HEIGHT_SIGMA_LANDMARK_FILL,
  IMP35764_COLLISION_SCALE_PT_ANCHOR_PREFACTOR_PROPAGATION,
];

const CANONICAL_PT_SOTA = LAMBDA_RH_BRIDGE.sotaUpperBound.value; // 0.2, the ONE live source

export const IMP35844_HONESTY_GATE_LIVE_ARTIFACT_AUDIT = {
  id: 'imp-35844',
  proofSection: 'S-frontier',
  question:
    'Do the imp-35763/imp-35764 honesty-gate assertion guards (imp-486 kept, imp-35337a OPEN, NO QED, no refereed bound is changed ' +
    'regexes) reference live artifacts, or can they silently pass regardless of the real state of the codebase?',
  method:
    'Re-run the imp-486/imp-35337a-OPEN/NO-QED/remains-SOTA text checks directly against the live exported ' +
    'verdict strings (self-consistency, protective against future phrase removal), and separately cross-check ' +
    'the "Lambda <= 0.2" figure quoted in each verdict against the canonical LAMBDA_RH_BRIDGE.sotaUpperBound.value ' +
    '-- the check the modules themselves omit, since each hardcodes a local L_PT = 0.2 literal and compares it ' +
    'to itself.',
  cohortIds: COHORT.map((m) => m.id),
  canonicalPtSota: CANONICAL_PT_SOTA,
  textGuardsAreLiveAndProtective: true,
  ptSotaNumericGuardIsTautologicalInSource: true,
  verdict:
    'SPLIT AUDIT RESULT. The imp-486/imp-35337a-OPEN/NO-QED/remains-SOTA text guards inside imp-35763 and ' +
    'imp-35764 are LIVE and PROTECTIVE: they test each module’s own exported verdict string and would fail ' +
    'if a future edit stripped the honesty caveat -- reconfirmed here directly. The "No refereed bound is changed" numeric guard in ' +
    'both source modules (`const L_PT = 0.2` compared to the literal 0.2) is TAUTOLOGICAL: it references no live ' +
    'artifact and passes unconditionally, so it cannot catch a future change to the canonical ' +
    'LAMBDA_RH_BRIDGE.sotaUpperBound.value. This audit module supplies the missing live cross-check. Audit only; ' +
    'adds no new mechanism; changes no bound; NO QED; no refereed bound is changed.',
  citation:
    'imp-35763 (req4 sigma-landmark fill, audited honesty gate); imp-35764 (PT-anchor prefactor propagation, ' +
    'audited honesty gate); bridge-lambda-rh.js (LAMBDA_RH_BRIDGE.sotaUpperBound, the canonical PT Lambda <= 0.2 ' +
    'source); imp-486 (GUE-conditional caveat); imp-35337a (OPEN barrier gap).',
};

export const IMP35844_HONESTY_GATE_LIVE_ARTIFACT_AUDIT_ASSERTIONS = [
  {
    id: 'imp35844-cohort-loaded',
    description: 'both audited cohort members resolved and expose their verdict text',
    holds: () =>
      COHORT.length === 2 &&
      COHORT.every((m) => typeof m.verdict === 'string' && m.verdict.length > 0),
  },
  {
    // Re-run the text guards directly, so this audit module ITSELF throws if a future
    // edit strips the honesty caveat from either cohort member's verdict -- the "live
    // and protective" half of the finding, demonstrated rather than merely asserted.
    id: 'imp35844-text-guards-reconfirmed-live',
    description: 'the imp-486 / imp-35337a-OPEN / NO-QED / remains-SOTA phrases are present in every cohort verdict, right now',
    holds: () =>
      COHORT.every(
        (m) =>
          /imp-486/.test(m.verdict) &&
          /imp-35337a stays OPEN/.test(m.verdict) &&
          /NO QED/.test(m.verdict) &&
          /refereed bound is changed/i.test(m.verdict)
      ),
  },
  {
    // The gap this audit closes: cross-check the "Lambda <= 0.2" figure quoted in each
    // verdict against the ONE canonical live source, instead of a self-referential
    // local literal. If LAMBDA_RH_BRIDGE.sotaUpperBound.value ever moved off 0.2 this
    // assertion -- unlike the source modules' own L_PT check -- would fail.
    id: 'imp35844-pt-sota-cross-checked-against-canonical-bridge',
    description: 'the "Lambda <= 0.2" figure in every cohort verdict matches the canonical LAMBDA_RH_BRIDGE.sotaUpperBound.value',
    holds: () => {
      const quoted = COHORT.map((m) => {
        const match = /Lambda\s*<=\s*(\d+(?:\.\d+)?)/.exec(m.verdict);
        return match ? Number(match[1]) : NaN;
      });
      return (
        Math.abs(CANONICAL_PT_SOTA - 0.2) < 1e-15 &&
        quoted.every((v) => Number.isFinite(v) && Math.abs(v - CANONICAL_PT_SOTA) < 1e-9)
      );
    },
  },
  {
    // Demonstrate the tautology directly: the source modules' own guard pattern
    // (`Math.abs(L_PT - 0.2) < 1e-15` with L_PT itself defined as 0.2) passes for ANY
    // literal compared to itself and therefore carries zero discriminating power --
    // unlike assertion imp35844-pt-sota-cross-checked-against-canonical-bridge above,
    // which fails the moment the canonical constant disagrees.
    id: 'imp35844-tautology-demonstrated',
    description: 'a self-compared local literal passes regardless of its value, confirming the source-module no-refereed-bound-change guard carries no discriminating power',
    holds: () => {
      const selfCompared = (literal) => Math.abs(literal - literal) < 1e-15;
      return selfCompared(0.2) === true && selfCompared(999) === true;
    },
  },
];

for (const a of IMP35844_HONESTY_GATE_LIVE_ARTIFACT_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35844-honesty-gate-live-artifact-audit assertion failed: ${a.id}`);
  }
}
