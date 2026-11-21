/**
 * @module imp-96989-imp96912-corrupt-artifact-trap-note
 * @fileoverview imp-96989 -- import-light META trap note: tmp/imp-96912-out.json is a
 *   CORRUPT sibling-script artifact and must NOT be trusted by any downstream Route M
 *   Frobenius-ladder work. Establishes no new bound; documentation only; NO QED.
 *
 *   THE TRAP
 *   -----------------------------------------------
 *   While attempting to extend the exact Vasyunin-Gram ||G||_F ladder past N=16000,
 *   imp-96912 (imp-96912-route-m-frobenius-holdout-model-discriminator.js) found a
 *   pre-existing file tmp/imp-96912-out.json left over from an earlier, buggy sibling
 *   script. That file reports frob=393.65 at N=8000 -- roughly 57.6x too large next to
 *   the verified-exact value. The correct, reproducible N=8000 rung (tmp/imp-96912-gram.py,
 *   double precision, committed as IMP96912_LADDER in
 *   imp-96912-route-m-frobenius-holdout-model-discriminator.js) is frob=6.834107225532644.
 *   No downstream module has imported tmp/imp-96912-out.json (it is a /tmp scratch file,
 *   not tracked in src/), so nothing in src/ is currently corrupted by it -- this note
 *   exists so that future scouts attempting to resume the imp-96912 sub-gap (fresh EXACT
 *   rungs beyond N=16000, O(N^3) V-table, CPU-blocked in the shared pool) do not stumble
 *   on that leftover file and mistake it for a valid rung.
 *
 *   WHY IT IS CORRUPT (not just imprecise)
 *   -----------------------------------------------
 *   A ~57.6x discrepancy at a single rung is not a precision or convention difference --
 *   it is inconsistent with every neighbouring exact rung on the monotone, decelerating
 *   IMP96912_LADDER curve (N=7000 -> 6.776886864553974, N=9000 -> 6.884189704438562), which
 *   brackets the true N=8000 value tightly. A frob of 393.65 would require an order-of-
 *   magnitude jump the concave ||G||_F(N) curve does not exhibit anywhere else on the
 *   250..16000 ladder, consistent with imp-96912's own diagnosis of a buggy sibling script
 *   (not this module's build) having written stale or malformed intermediate state to that
 *   path.
 *
 *   WHAT TO DO INSTEAD
 *   -----------------------------------------------
 *   Any future extension of the exact ladder past N=16000 must recompute the Vasyunin
 *   V-table from scratch (or via an O(N^2 logN) Vasyunin-reciprocity rewrite) and verify
 *   against the committed IMP96912_LADDER rungs before trusting any new value; it must not
 *   read tmp/imp-96912-out.json.
 *
 * @see imp-96912-route-m-frobenius-holdout-model-discriminator.js (source of the corrupt-
 *   artifact finding and the verified IMP96912_LADDER this note cross-checks against)
 * @see imp-97017-frobenius-ladder-monotonicity-assertion.js (downstream consumer of the
 *   frozen ladder; sub-gap still stands)
 *
 * Ticket: imp-96989 (meta, low). Documentation only; establishes no new bound; NO QED;
 * no refereed bound is changed.
 */

import { IMP96912_LADDER } from './imp-96912-route-m-frobenius-holdout-model-discriminator.js';

const CORRUPT_ARTIFACT_TRAP = Object.freeze({
  key: 'imp96912-out-json-corrupt-artifact',
  path: 'tmp/imp-96912-out.json',
  corruptValueAtN8000: 393.65,
  trueValueAtN8000: 6.834107225532644,
  discrepancyFactor: 393.65 / 6.834107225532644,
  cause:
    'left over from an earlier, buggy sibling script (not the verified ' +
    'tmp/imp-96912-gram.py build); stale or malformed intermediate state written to a ' +
    '/tmp scratch path outside src/, never imported by any src/ module',
  rule:
    'must NOT be read or trusted by any downstream Route M Frobenius-ladder work; ' +
    'recompute the exact Vasyunin V-table from scratch and cross-check against the ' +
    'committed IMP96912_LADDER rungs instead',
});

export const IMP96989_IMP96912_CORRUPT_ARTIFACT_TRAP_NOTE = Object.freeze({
  id: 'imp-96989',
  proofSection: 'S-frontier',
  glosses: 'imp-96912',
  scopes: 'tmp/imp-96912-out.json corrupt-artifact trap (frob=393.65 at N=8000)',
  question:
    'Is tmp/imp-96912-out.json a trustworthy exact rung for the Route M Frobenius-norm ' +
    'ladder, and if not, why not?',
  trap: CORRUPT_ARTIFACT_TRAP,
  anyEnclosureEstablished: false,
  verdict:
    'META TRAP NOTE (documentation, not a proof). tmp/imp-96912-out.json is a corrupt ' +
    'sibling-script artifact (frob=393.65 at N=8000 vs the verified 6.834107225532644) and ' +
    'must not be trusted by downstream Frobenius-ladder work; the imp-96912 sub-gap (fresh ' +
    'exact rungs beyond N=16000) still stands and needs a fresh V-table build, not this ' +
    'file. Establishes nothing new; no refereed bound is changed; RH open; NO QED.',
  citation:
    'imp-96912-route-m-frobenius-holdout-model-discriminator.js (source finding + ' +
    'verified IMP96912_LADDER); imp-97017-frobenius-ladder-monotonicity-assertion.js ' +
    '(downstream consumer of the frozen ladder).',
});

export default IMP96989_IMP96912_CORRUPT_ARTIFACT_TRAP_NOTE;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96989_IMP96912_CORRUPT_ARTIFACT_TRAP_NOTE_ASSERTIONS = [
  {
    id: 'imp96989-trap-matches-verified-ladder',
    why:
      'The trap note claims the true N=8000 value is 6.834107225532644; this must match ' +
      'the N=8000 entry already committed in the imp-96912 exact ladder verbatim, or the ' +
      'trap note itself would be a second source of corruption.',
    holds: () => {
      const rung = IMP96912_LADDER.find((r) => r.N === 8000);
      return (
        rung !== undefined &&
        rung.frobenius === CORRUPT_ARTIFACT_TRAP.trueValueAtN8000
      );
    },
  },
  {
    id: 'imp96989-discrepancy-is-large-not-precision-noise',
    why:
      'The whole point of the trap is that the corrupt value is not a rounding or ' +
      'precision artifact but a gross ~57x outlier off the monotone ladder.',
    holds: () => CORRUPT_ARTIFACT_TRAP.discrepancyFactor > 50,
  },
  {
    id: 'imp96989-honesty-gate-no-qed',
    why: 'Documentation only: no enclosure claimed established, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96989_IMP96912_CORRUPT_ARTIFACT_TRAP_NOTE.anyEnclosureEstablished === false &&
      /refereed bound is changed/i.test(IMP96989_IMP96912_CORRUPT_ARTIFACT_TRAP_NOTE.verdict) &&
      IMP96989_IMP96912_CORRUPT_ARTIFACT_TRAP_NOTE.glosses === 'imp-96912',
  },
];

for (const assertion of IMP96989_IMP96912_CORRUPT_ARTIFACT_TRAP_NOTE_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96989-imp96912-corrupt-artifact-trap-note assertion failed: ${assertion.id}`
    );
  }
}
