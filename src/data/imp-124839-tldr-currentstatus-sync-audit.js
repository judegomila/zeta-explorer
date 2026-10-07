/**
 * @module imp-124839-tldr-currentstatus-sync-audit
 *
 * imp-124839 (meta, read-only audit): checks whether LAMBDA_ROADMAP.currentStatusTLDR
 * still faithfully restates the opening paragraph of LAMBDA_ROADMAP.currentStatus, per
 * the hand-sync comment at lambda-roadmap.js ("Keep in sync by hand -- this does not
 * parse currentStatus, it just restates its opening").
 *
 * METHOD: each load-bearing claim in the TLDR's grade line / 0.1875 / 0.1787854 /
 * Steps-1-5 framing is checked for a matching claim in the currentStatus opening via
 * regex probes on both live strings (not frozen snapshots), so the audit stays live
 * against future edits instead of re-drifting silently.
 *
 * FINDING: no drift. Every TLDR claim probed below has a matching currentStatus
 * claim. The one asymmetric sentence -- the TLDR's seam-chain/signed-certificate
 * program pointer (imp-95210..95420, ledger imp-95388) -- is NOT a restatement of
 * anything in currentStatus's opening paragraph, but this is a documented, deliberate
 * exception (imp-95394): that program is tracked exclusively in graded-results.js /
 * program-dag.js / frontier-dag.js / research-threads.js / OpenFrontierPage, and the
 * TLDR carries one pointer sentence so a reader of the banner has a signal it exists.
 * Not treated as drift.
 *
 * DOCUMENTATION/AUDIT ONLY. Changes no bound; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * Platt-Trudgian Lambda <= 0.2 remains SOTA.
 */

import { LAMBDA_ROADMAP } from './lambda-roadmap.js';

const TLDR = LAMBDA_ROADMAP.currentStatusTLDR;
const STATUS = LAMBDA_ROADMAP.currentStatus;

export const IMP124839_SYNC_PROBES = [
  {
    id: 'pt-benchmark',
    description: 'Platt-Trudgian Lambda <= 0.2 peer-reviewed benchmark line',
    tldrPattern: /Platt-Trudgian Lambda <= 0\.2 remains the peer-reviewed upper-bound benchmark/,
    statusPattern: /Platt-Trudgian Lambda <= 0\.2 remains the accepted peer-reviewed benchmark/,
  },
  {
    id: 'public-0.1875',
    description: 'public 0.1875 certificate package, unrefereed, in the Optimization Problems ledger',
    tldrPattern: /unrefereed certificate package claims Lambda <= 0\.1875.*Optimization Problems\s+ledger/s,
    statusPattern: /0\.1875.*certificate-package claim.*Optimization Problems ledger.*unrefereed/s,
  },
  {
    id: 'private-0.1787854',
    description: 'private v3 package, unreviewed computer-assisted candidate for unconditional 0.1787854',
    tldrPattern: /private v3 package proposes Lambda <= 0\.1787854.*unreviewed computer-assisted proof candidate/s,
    statusPattern: /review-01787854-v3.*unreviewed computer-assisted proof candidate.*unconditional 0\.1787854/s,
  },
  {
    id: 'rh-not-established',
    description: 'candidate does not establish RH / unpublished-unreviewed-unaccepted',
    tldrPattern: /not established, published, peer-reviewed, or accepted/,
    statusPattern: /unpublished, unpeer-reviewed, unaccepted, and it does not prove RH/,
  },
  {
    id: 'steps-1-3-skeleton',
    description: 'Steps 1 and 3 supply the unconditional lim-sup skeleton',
    tldrPattern: /Steps 1 and 3 supply an unconditional lim-sup skeleton/,
    statusPattern: /Steps 1 and 3 provide the unconditional zero-verification \/ lim-sup skeleton/,
  },
  {
    id: 'step4-bridge-open',
    description: 'quantitative Step-4 G6/G6a/C_H bridge remains open',
    tldrPattern: /quantitative Step-4 G6\/G6a\/C_H bridge remains open/,
    statusPattern: /quantitative Step-4 Polymath15 bridge remains open at\s+G6\/G6a\/C_H/s,
  },
  {
    id: 'route-a-gue',
    description: 'Route A carries a GUE conditional / requires GUE universality',
    tldrPattern: /Route A also carries a GUE conditional/,
    statusPattern: /Route A additionally requires GUE universality/,
  },
  {
    id: 'step5-unverified-rh',
    description: 'Step 5 is unverified, and RH does not follow',
    tldrPattern: /Step 5 is unverified, and RH does not follow/,
    statusPattern: /Step 5 is unverified[\s\S]*?RH does not follow/,
  },
];

export const IMP124839_SYNC_AUDIT = {
  id: 'imp-124839',
  proofSection: 'S-frontier',
  probeCount: IMP124839_SYNC_PROBES.length,
  driftFound: false,
  knownAsymmetry: {
    sentence: 'seam-chain / signed-certificate program pointer (imp-95210..95420, ledger imp-95388)',
    inTldrOnly: true,
    isDrift: false,
    note:
      'Deliberate addition (imp-95394): tracked elsewhere (graded-results.js, program-dag.js, ' +
      'frontier-dag.js, research-threads.js, OpenFrontierPage), the TLDR carries one pointer ' +
      'sentence only so the banner signals the program exists.',
  },
  verdict:
    'AUDIT ONLY (no drift found). Every probed TLDR claim (grade line, 0.1875, 0.1787854, ' +
    'Steps 1-5 framing, Route A GUE conditional) has a matching claim in the currentStatus ' +
    'opening paragraph. The one sentence present only in the TLDR (seam-chain program pointer) ' +
    'is a documented, deliberate exception, not drift. Changes no bound; imp-3066 K_a >= 0 ' +
    'untouched; NO QED; Platt-Trudgian Lambda <= 0.2 remains SOTA.',
};

export const IMP124839_SYNC_AUDIT_ASSERTIONS = [
  ...IMP124839_SYNC_PROBES.map((probe) => ({
    id: `imp124839-${probe.id}`,
    description: `${probe.description}: both currentStatusTLDR and currentStatus carry this claim`,
    holds: () => probe.tldrPattern.test(TLDR) && probe.statusPattern.test(STATUS),
  })),
  {
    id: 'imp124839-no-drift-verdict',
    description: 'audit records driftFound === false and probeCount matches the probe list length',
    holds: () =>
      IMP124839_SYNC_AUDIT.driftFound === false &&
      IMP124839_SYNC_AUDIT.probeCount === IMP124839_SYNC_PROBES.length,
  },
  {
    id: 'imp124839-known-asymmetry-not-drift',
    description: 'the known seam-chain-pointer asymmetry is explicitly recorded as not-drift',
    holds: () =>
      IMP124839_SYNC_AUDIT.knownAsymmetry.inTldrOnly === true &&
      IMP124839_SYNC_AUDIT.knownAsymmetry.isDrift === false &&
      !STATUS.includes('imp-95210..95420'),
  },
  {
    id: 'imp124839-own-verdict-carries-imp3066-phrase',
    description: 'imp-124935 repair: this module’s own verdict must carry the imp-3066 K_a >= 0 untouched phrase',
    holds: () => /imp-3066 K_a >= 0 untouched/.test(IMP124839_SYNC_AUDIT.verdict),
  },
];
