/**
 * @module imp-95280-fullwindow1-scope-note
 * @fileoverview imp-95280 -- import-light scope note stating plainly what a
 *   full-window-1 continuum certificate would (and would not) represent in
 *   the Gate-2 program, based on imp-95238 finding (A). No re-derivation:
 *   this bakes the imp-95238 FULLWINDOW_RUN_DECISION figures verbatim so the
 *   milestone is not misread as a bound advance.
 *
 *   THE NOTE
 *   -----------------------------------------------
 *   A full-window-1 run would extend the imp-95213 slice certificate
 *   (sum_j |D_j(x(u))| < Rex and |E97(x(u))| < Rex, continuum, both seam
 *   charts) from the certified 0.058% slice of window 1 to ALL of window 1.
 *   That would be the FIRST full-window continuum-certified statement of the
 *   Gate-2 program -- a genuine milestone.
 *
 *   But "window 1" is exactly one window out of the Gate-2 family of
 *   54,109,012 windows: imp-95213 records 54,109,011 windows beyond window 1
 *   left untouched by such a run. A sub-total run over one window sets NO
 *   G5 window-promotion flag (imp-95213's promotesBound stays false) and
 *   changes no bound -- no refereed bound is changed regardless
 *   of whether the run is ever launched, and regardless of which route
 *   (level-1 or the dominant imp-95214 tier-2 chirp) prices it.
 *
 * @see imp-95238-fullwindow-run-decision.js (source: finding (A), the
 *   FULLWINDOW_RUN_DECISION ledger this note restates)
 * @see imp-95213-tier-certifier-build.js (window-1 slice certifier and the
 *   54,109,011-window scope-honesty figure)
 *
 * Ticket: imp-95280 (content, low). Documentation only; establishes no new
 * bound; NO QED; no refereed bound is changed.
 */

import { FULLWINDOW_RUN_DECISION } from './imp-95238-fullwindow-run-decision.js';

const FULLWINDOW1_SCOPE_HEADWORD = Object.freeze({
  key: 'fullwindow1-continuum-certificate-scope',
  term:
    'What a full-window-1 continuum certificate would represent in the ' +
    'Gate-2 program (imp-95238 finding (A))',
  whatItWouldCertify:
    'The FIRST full-window continuum-certified statement of the Gate-2 ' +
    'program: sum_j |D_j(x(u))| < Rex and |E97(x(u))| < Rex holding over ' +
    'ALL of window 1 (both seam charts), extending the imp-95213 certified ' +
    '0.058% slice to the whole window -- a genuine milestone.',
  whatItDoesNotDo:
    'Window 1 is one window out of 54,109,012 in the Gate-2 family: ' +
    '54,109,011 windows beyond it stay untouched. A sub-total run over one ' +
    'window sets NO G5 window-promotion flag and changes no bound -- ' +
    'no refereed bound is changed regardless of whether or how ' +
    'the run is launched.',
  whyThisMatters:
    'A full-window-1 result reads, on its face, like progress toward a ' +
    'bound advance. Stating the scope plainly -- milestone, not a ' +
    'bound-mover -- keeps that one-window result from being mistaken for a ' +
    'G5 promotion or a Lambda improvement.',
});

export const IMP95280_FULLWINDOW1_SCOPE_NOTE = Object.freeze({
  id: 'imp-95280',
  proofSection: 'S-frontier',
  glosses: 'imp-95238',
  scopes: 'full-window-1 continuum certificate scope',
  question:
    'What would a full-window-1 continuum certificate represent in the ' +
    'Gate-2 program, and what would it not represent?',
  headword: FULLWINDOW1_SCOPE_HEADWORD,
  anyEnclosureEstablished: false,
  windowsBeyondWindow1Untouched: FULLWINDOW_RUN_DECISION.windowsBeyondWindow1Untouched,
  setsPromotionFlag: FULLWINDOW_RUN_DECISION.setsPromotionFlag,
  movesBound: FULLWINDOW_RUN_DECISION.movesBound,
  verdict:
    'SCOPE NOTE ONLY (documentation, not a proof). A full-window-1 ' +
    'continuum certificate would be the first full-window continuum ' +
    'statement of the Gate-2 program (milestone), but it is one window of ' +
    '54,109,012, sets no G5 promotion flag, and changes no bound. ' +
    'Establishes nothing new; fires no certificate; no refereed bound is changed' +
    '.',
  citation:
    'imp-95238-fullwindow-run-decision.js (finding (A), FULLWINDOW_RUN_DECISION ' +
    'ledger); imp-95213-tier-certifier-build.js (window-1 slice certifier, ' +
    '54,109,011-window scope-honesty figure).',
});

export default IMP95280_FULLWINDOW1_SCOPE_NOTE;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95280_FULLWINDOW1_SCOPE_NOTE_ASSERTIONS = [
  {
    id: 'imp95280-headword-has-required-fields',
    why:
      'The scope note must state what a full-window-1 certificate would ' +
      'certify, what it would not do (scope + no promotion flag + no bound ' +
      'change), and why stating this plainly matters -- the entire point ' +
      'of the note.',
    holds: () => {
      const h = IMP95280_FULLWINDOW1_SCOPE_NOTE.headword;
      return (
        /FIRST full-window continuum-certified/.test(h.whatItWouldCertify) &&
        /54,109,012/.test(h.whatItDoesNotDo) &&
        /54,109,011/.test(h.whatItDoesNotDo) &&
        /NO G5 window-promotion flag/.test(h.whatItDoesNotDo) &&
        /changes no bound/.test(h.whatItDoesNotDo) &&
        /milestone/.test(h.whyThisMatters)
      );
    },
  },
  {
    id: 'imp95280-figures-match-imp95238-source-ledger',
    why:
      'The note bakes the imp-95238 FULLWINDOW_RUN_DECISION figures ' +
      'verbatim rather than re-deriving them, so they must match exactly.',
    holds: () =>
      IMP95280_FULLWINDOW1_SCOPE_NOTE.windowsBeyondWindow1Untouched ===
        54109011 &&
      IMP95280_FULLWINDOW1_SCOPE_NOTE.setsPromotionFlag === false &&
      IMP95280_FULLWINDOW1_SCOPE_NOTE.movesBound === false &&
      IMP95280_FULLWINDOW1_SCOPE_NOTE.windowsBeyondWindow1Untouched ===
        FULLWINDOW_RUN_DECISION.windowsBeyondWindow1Untouched &&
      IMP95280_FULLWINDOW1_SCOPE_NOTE.setsPromotionFlag ===
        FULLWINDOW_RUN_DECISION.setsPromotionFlag &&
      IMP95280_FULLWINDOW1_SCOPE_NOTE.movesBound ===
        FULLWINDOW_RUN_DECISION.movesBound,
  },
  {
    id: 'imp95280-honesty-gate-no-qed',
    why:
      'Documentation only: no enclosure claimed established, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP95280_FULLWINDOW1_SCOPE_NOTE.anyEnclosureEstablished === false &&
      /refereed bound is changed/i.test(IMP95280_FULLWINDOW1_SCOPE_NOTE.verdict) &&
      IMP95280_FULLWINDOW1_SCOPE_NOTE.glosses === 'imp-95238' &&
      IMP95280_FULLWINDOW1_SCOPE_NOTE.scopes ===
        'full-window-1 continuum certificate scope',
  },
];

for (const assertion of IMP95280_FULLWINDOW1_SCOPE_NOTE_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-95280-fullwindow1-scope-note assertion failed: ${assertion.id}`
    );
  }
}
