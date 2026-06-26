/**
 * @module imp-2866-en-classification-consistency
 *
 * imp-2866 (high, accuracy): CROSS-MODULE single-source-of-truth audit for the
 * honest E(N) NO-GO verdict.
 *
 * THE RISK
 * --------
 * The finite-height Lambda < 0.2 NO-GO verdict is encoded INDEPENDENTLY in five
 * live ledger records:
 *   - imp-2643 (IMP2643_HONEST_ASSEMBLED_EN.rigorousBeat / .PT_BOUND / .blockingConstant)
 *   - imp-2701 (IMP2701_CH_RIGOR_LOCK.guards.cHIsRigorous)
 *   - imp-2711 (IMP2711_PT_BOUND_SOTA_TRIPWIRE.PT_BOUND_SOTA / .allHonest / .audit)
 *   - imp-2713 (EN_GAP_REGISTRY binding-blocker taxonomy)
 *   - imp-2715 (IMP2715_WORST_CASE_EN_HEADROOM.PT_BOUND / .isRigorous)
 * Each one separately encodes "C_H is not rigorous", "PT_BOUND = 0.2", and the
 * single-binding-blocker count. Without a consistency check, ONE record could
 * silently drift (a copied PT_BOUND, a stale rigor flag, a second blocker added)
 * and create a contradictory ledger where one module asserts a rigorous beat the
 * others deny. This module imports all five live records plus the SINGLE source
 * of truth for the C_H rigor flag and throws on any pairwise divergence.
 *
 * INVARIANTS LOCKED (must all hold while C_H is unproven)
 *   (a) Every module's "C_H is rigorous" reading comes from the SAME source,
 *       polymath15-lemma52-shock-holder isRigorousUpperBound (false): imp-2643
 *       rigorousBeat, imp-2701 guards.cHIsRigorous, imp-2715 isRigorous, and the
 *       imp-2711 audit claimsRigorousBeat all agree it is NOT rigorous.
 *   (b) PT_BOUND === 0.2 is identical across imp-2643, imp-2711, imp-2715.
 *   (c) The imp-2713 gap-registry BINDING-BLOCKER count is exactly 1 and its
 *       constant (C_H) matches imp-2643 blockingConstant.
 *   (d) No module verdict string asserts a rigorous beat; every verdict carries
 *       an explicit honesty qualifier (NO-GO / NOT rigorous / numerical).
 *
 * Side-effect-imported by assertion-sweep-2026-04-12.js so the throws below stay
 * reachable from the production import graph (dead-assertion audit, imp-501/2702).
 *
 * @see imp-2701-ch-rigor-lock (C_H rigor lock); imp-2711-pt-bound-sota-tripwire (PT SOTA tripwire)
 * @see imp-2713-en-named-gap-registry (gap taxonomy); imp-2715-worst-case-EN-headroom-audit (worst-case)
 */

import { C_H_QUADRATIC_TANGENCY_UPPER_BOUND_CHECK_IMP2642 } from './polymath15-lemma52-shock-holder.js';
import { IMP2643_HONEST_ASSEMBLED_EN } from './imp-2643-honest-assembled-EN.js';
import { IMP2701_CH_RIGOR_LOCK } from './imp-2701-ch-rigor-lock.js';
import { IMP2711_PT_BOUND_SOTA_TRIPWIRE } from './imp-2711-pt-bound-sota-tripwire.js';
import { EN_GAP_REGISTRY } from './imp-2713-en-named-gap-registry.js';
import { IMP2715_WORST_CASE_EN_HEADROOM } from './imp-2715-worst-case-EN-headroom-audit.js';

// ── (a) The single source of truth for the C_H rigor classification ──────────
const C_H_IS_RIGOROUS_SOURCE = C_H_QUADRATIC_TANGENCY_UPPER_BOUND_CHECK_IMP2642.isRigorousUpperBound; // false

// Each module's independent encoding of "C_H is rigorous" (or a rigorous beat).
// imp-2643 clears PT numerically, so rigorousBeat === (C_H is rigorous).
const EN643_RIGOROUS_BEAT = IMP2643_HONEST_ASSEMBLED_EN.rigorousBeat;
const EN701_CH_RIGOROUS = IMP2701_CH_RIGOR_LOCK.guards.cHIsRigorous;
const EN715_IS_RIGOROUS = IMP2715_WORST_CASE_EN_HEADROOM.isRigorous;
// imp-2711 audits the imp-2643 record; its entry must not claim a rigorous beat.
const EN711_AUDIT_643 = IMP2711_PT_BOUND_SOTA_TRIPWIRE.audit.find((a) => a.id === 'imp-2643');
const EN711_CLAIMS_BEAT = EN711_AUDIT_643 ? EN711_AUDIT_643.claimsRigorousBeat : true;

// ── (b) PT_BOUND identical across the three numeric records ───────────────────
const PT_643 = IMP2643_HONEST_ASSEMBLED_EN.PT_BOUND;
const PT_711 = IMP2711_PT_BOUND_SOTA_TRIPWIRE.PT_BOUND_SOTA;
const PT_715 = IMP2715_WORST_CASE_EN_HEADROOM.PT_BOUND;

// ── (c) gap-registry binding-blocker count vs imp-2643 blockingConstant ───────
const BINDING_BLOCKERS = EN_GAP_REGISTRY.filter((g) => g.severity === 'BINDING-BLOCKER');
const SOLE_BLOCKER = BINDING_BLOCKERS.length === 1 ? BINDING_BLOCKERS[0] : null;

// ── (d) no verdict asserts a rigorous beat; each carries an honesty qualifier ─
const HONESTY_QUALIFIER = /NO-GO|NOT[- ]a[- ]rigorous|NOT[- ]rigorous|numerical/i;
const VERDICTS = [
  IMP2643_HONEST_ASSEMBLED_EN.verdict,
  IMP2711_PT_BOUND_SOTA_TRIPWIRE.verdict,
  IMP2715_WORST_CASE_EN_HEADROOM.verdict,
];

export const IMP2866_EN_CLASSIFICATION_CONSISTENCY = {
  id: 'imp-2866',
  proofSection: 'S7',
  title: 'Cross-module honest-classification consistency audit (single source of truth)',
  source: 'polymath15-lemma52-shock-holder isRigorousUpperBound',
  cHRigorClassification: {
    source: C_H_IS_RIGOROUS_SOURCE,                 // false
    en2643RigorousBeat: EN643_RIGOROUS_BEAT,        // false
    en2701CHRigorous: EN701_CH_RIGOROUS,            // false
    en2715IsRigorous: EN715_IS_RIGOROUS,            // false
    en2711ClaimsBeat: EN711_CLAIMS_BEAT,            // false
  },
  ptBound: { en2643: PT_643, en2711: PT_711, en2715: PT_715 },
  bindingBlocker: {
    count: BINDING_BLOCKERS.length,                 // 1
    constant: SOLE_BLOCKER ? SOLE_BLOCKER.constant : null,
    en2643BlockingConstant: IMP2643_HONEST_ASSEMBLED_EN.blockingConstant,
  },
  modulesAudited: ['imp-2643', 'imp-2701', 'imp-2711', 'imp-2713', 'imp-2715'],
  verdict:
    'CONSISTENT. All five live E(N) records encode the SAME honest NO-GO verdict: ' +
    'C_H is not rigorous (read from one source, polymath15-lemma52-shock-holder), ' +
    'PT_BOUND = 0.2 is identical, the gap registry has exactly one BINDING-BLOCKER ' +
    '(C_H) matching imp-2643 blockingConstant, and no verdict asserts a rigorous ' +
    'beat. Any future drift in a single module throws at build time. NO false QED.',
  rationale:
    'Five modules independently encode the NO-GO verdict; this audit fails the ' +
    'build the moment one of them drifts out of agreement with the others.',
};

export const IMP2866_EN_CLASSIFICATION_CONSISTENCY_ASSERTIONS = [
  {
    id: 'imp2866-ch-rigor-single-source',
    description:
      '(a) Every module reads C_H-is-rigorous=false in agreement with the single source ' +
      '(polymath15-lemma52-shock-holder isRigorousUpperBound)',
    holds: () =>
      C_H_IS_RIGOROUS_SOURCE === false &&
      EN643_RIGOROUS_BEAT === C_H_IS_RIGOROUS_SOURCE &&
      EN701_CH_RIGOROUS === C_H_IS_RIGOROUS_SOURCE &&
      EN715_IS_RIGOROUS === C_H_IS_RIGOROUS_SOURCE &&
      EN711_CLAIMS_BEAT === C_H_IS_RIGOROUS_SOURCE,
  },
  {
    id: 'imp2866-pt-bound-identical',
    description: '(b) PT_BOUND === 0.2 is identical across imp-2643, imp-2711, imp-2715',
    holds: () => PT_643 === 0.2 && PT_711 === 0.2 && PT_715 === 0.2 && PT_643 === PT_711 && PT_711 === PT_715,
  },
  {
    id: 'imp2866-single-binding-blocker-is-ch',
    description:
      '(c) The gap registry has exactly 1 BINDING-BLOCKER and its constant (C_H) matches ' +
      'imp-2643 blockingConstant',
    holds: () =>
      BINDING_BLOCKERS.length === 1 &&
      SOLE_BLOCKER.constant === 'C_H' &&
      /C_H/.test(IMP2643_HONEST_ASSEMBLED_EN.blockingConstant),
  },
  {
    id: 'imp2866-no-verdict-asserts-rigorous-beat',
    description:
      '(d) Every E(N) verdict carries an explicit honesty qualifier (NO-GO / NOT rigorous / ' +
      'numerical) and no machine beat flag is set',
    holds: () =>
      VERDICTS.every((v) => HONESTY_QUALIFIER.test(v)) &&
      EN643_RIGOROUS_BEAT === false &&
      EN715_IS_RIGOROUS === false &&
      IMP2711_PT_BOUND_SOTA_TRIPWIRE.allHonest === true,
  },
];

for (const a of IMP2866_EN_CLASSIFICATION_CONSISTENCY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-2866-en-classification-consistency assertion failed: ${a.id}`);
  }
}
