/**
 * @module imp-124938-seam-chain-pointer-tracking-location-audit
 *
 * imp-124938 (meta, read-only audit + targeted repair): follows up imp-124839
 * by checking not just that the currentStatusTLDR seam-chain pointer sentence
 * is a *deliberate* non-restatement exception (already confirmed), but
 * whether its CONTENT is actually consistent with where the seam-chain
 * program (imp-95210..95420, three-obligation ledger imp-95388) is recorded.
 *
 * FINDING (before this module's companion edit to lambda-roadmap.js): the
 * TLDR sentence introduced by imp-95394 made two claims that do not match
 * the data:
 *
 *   1. "tracks its own y-thaw package value" -- WRONG. The seam-chain
 *      program (imp-95388 ledger legs (1)(2)(3): per-window Q extraction,
 *      signed weight/modulus-phase certificate, envelope-shape/gammaSL gate
 *      map) is a signed-certificate assessment for the Lambda <= 0.14
 *      completion contract, per OpenFrontierPage.jsx's own SEAM_CHAIN_STATUS
 *      card ("tracking whether a signed ... per-window certificate can
 *      transcribe the Lambda <= 0.14 completion contract data"). The
 *      0.17759432 y-thaw package value belongs to a DIFFERENT program (the
 *      y-thaw O1-O6 obligation ledger, imp-95140), which only shares the
 *      imp-95XXX id neighborhood -- not the same program.
 *
 *   2. "tracked instead in graded-results.js and program-dag.js" -- WRONG.
 *      Neither file contains any seam-chain obligation-ledger content
 *      (no imp-95255, imp-95276, imp-95222, imp-95387, imp-95798, imp-95917,
 *      no gammaSL/isolation-group-Q/Fresnel-Airy text). Both files only
 *      carry the unrelated y-thaw O1-O6 ledger (imp-95140). The seam-chain
 *      program is actually tracked in the standalone imp-95XXX-*.js data
 *      modules (imp-95388 roll-up ledger and its sources) and in the
 *      OpenFrontierPage.jsx SEAM_CHAIN_STATUS card.
 *
 * REPAIR: lambda-roadmap.js currentStatusTLDR's seam-chain sentence was
 * rewritten to (a) describe the Lambda <= 0.14 signed-certificate contract
 * instead of a "y-thaw package value", and (b) point to the imp-95XXX data
 * modules + OpenFrontierPage seam-chain card, explicitly noting
 * graded-results.js/program-dag.js carry only the separate y-thaw ledger.
 *
 * DOCUMENTATION/AUDIT ONLY. Changes no bound; imp-3066 K_a >= 0 untouched;
 * no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 */

import { LAMBDA_ROADMAP } from './lambda-roadmap.js';

const TLDR = LAMBDA_ROADMAP.currentStatusTLDR;

export const IMP124938_AUDIT = {
  id: 'imp-124938',
  followsUp: 'imp-124839',
  proofSection: 'S-frontier',
  priorFindings: [
    'the seam-chain pointer sentence is a deliberate, documented exception ' +
      'to the hand-sync restatement rule (imp-95394, confirmed by imp-124839)',
  ],
  newFindings: [
    {
      claim: 'seam-chain program tracks its own y-thaw package value',
      verdict: 'WRONG',
      why:
        'the seam-chain program (imp-95388 ledger) assesses a signed ' +
        'per-window certificate for the Lambda <= 0.14 completion contract ' +
        '(OpenFrontierPage.jsx SEAM_CHAIN_STATUS card); the y-thaw package ' +
        'value 0.17759432 belongs to the separate imp-95140 O1-O6 ledger',
    },
    {
      claim: 'seam-chain program is tracked in graded-results.js and program-dag.js',
      verdict: 'WRONG',
      why:
        'neither file contains any imp-95255/95276/95222/95387/95798/95917 ' +
        'content or seam-chain obligation-ledger text; both only carry the ' +
        'unrelated y-thaw O1-O6 ledger (imp-95140). The seam-chain program ' +
        'is actually tracked in standalone imp-95XXX-*.js data modules and ' +
        'the OpenFrontierPage.jsx SEAM_CHAIN_STATUS card',
    },
  ],
  repair:
    'rewrote the currentStatusTLDR seam-chain sentence in lambda-roadmap.js ' +
    'to describe the Lambda <= 0.14 signed-certificate contract (not a ' +
    '"y-thaw package value") and to point to the imp-95XXX data modules + ' +
    'OpenFrontierPage seam-chain card, explicitly distinguishing them from ' +
    'the separate y-thaw ledger in graded-results.js/program-dag.js',
  verdict:
    'imp-95394 introduced a one-line TLDR pointer that was never checked ' +
    'against the files it named; two of its claims were drifted from day ' +
    'one. Repaired in place. Changes no bound; imp-3066 K_a >= 0 untouched; ' +
    'NO QED; Platt-Trudgian Lambda <= 0.2 remains SOTA.',
};

// ── assertions (import-light; exact-literal consistency only) ───────────────
export const IMP124938_ASSERTIONS = [
  {
    id: 'imp124938-tldr-no-longer-claims-ythaw-package-value',
    description:
      'the seam-chain sentence no longer claims it tracks "its own y-thaw package value"',
    holds: () => !/tracks its own y-thaw package value/.test(TLDR),
  },
  {
    id: 'imp124938-tldr-no-longer-misattributes-tracking-files',
    description:
      'the seam-chain sentence no longer claims graded-results.js/program-dag.js ' +
      'alone track the program (without the y-thaw-ledger caveat)',
    holds: () => !/tracked instead in graded-results\.js and program-dag\.js\.$/.test(TLDR),
  },
  {
    id: 'imp124938-tldr-still-names-the-program-and-ledger',
    description: 'the seam-chain program id range and imp-95388 ledger citation survive the repair',
    holds: () => /imp-95210\.\.95420/.test(TLDR) && /imp-95388/.test(TLDR),
  },
  {
    id: 'imp124938-tldr-now-points-to-actual-tracking-location',
    description: 'the repaired sentence names the actual tracking location (OpenFrontierPage / imp-95XXX modules)',
    holds: () => /OpenFrontierPage/.test(TLDR) && /imp-95XXX/.test(TLDR),
  },
  {
    id: 'imp124938-tldr-distinguishes-ythaw-ledger',
    description: 'the repaired sentence explicitly distinguishes the separate y-thaw O1-O6 ledger',
    holds: () => /y-thaw O1-O6 package-value ledger/.test(TLDR),
  },
  {
    id: 'imp124938-own-verdict-carries-imp3066-phrase',
    description: 'this module’s own verdict carries the imp-3066 K_a >= 0 untouched phrase',
    holds: () => /imp-3066 K_a >= 0 untouched/.test(IMP124938_AUDIT.verdict),
  },
];
