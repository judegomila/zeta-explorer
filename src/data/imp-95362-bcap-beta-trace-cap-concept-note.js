/**
 * @module imp-95362-bcap-beta-trace-cap-concept-note
 * @fileoverview imp-95362 -- import-light concept note for the imp-95329
 *   LEMMA BCAP uniform-in-b beta trace cap and its two-branch crossing at
 *   c* = 1 + a^2 / (2 w^2).
 *
 *   WHY A CONCEPT NOTE (not a re-derivation)
 *   -----------------------------------------------
 *   imp-95329 assembles LEMMA BCAP, LEMMA ACAP and THEOREM RZ-PEN3 to
 *   execute the imp-95328 named residual (the beta trace currency). This
 *   note isolates LEMMA BCAP -- the single elementary inequality whose
 *   two-branch crossover replaces the quadratic 1 - cos(w tau) <=
 *   w^2 tau^2 / 2 step -- without restating the surrounding THEOREM /
 *   COROLLARY machinery, LEMMA ACAP (the alpha-side companion), or the
 *   numerator-currency residual that imp-95329 leaves open.
 *
 *   THE NOTE
 *   -----------------------------------------------
 *   For every a > 0, b > 0 and real w, LEMMA BCAP states
 *     (1 - cos(w b / a)) / (1 - sech(b/2)) <= 2 + 4 w^2 / a^2.
 *   Writing c = cosh(b/2) > 1, the ratio is bounded two independent ways:
 *   branch (i), a quadratic-in-w bound 4 w^2 c / a^2 that is STRICTLY
 *   INCREASING in c (from 1 - cos x <= x^2/2 together with the reverse
 *   inequality 1 - sech(b/2) >= b^2 / (8c)); and branch (ii), a
 *   w-independent bound 2 + 2/(c - 1) that is STRICTLY DECREASING in c
 *   (from the crude 1 - cos x <= 2). The two branches cross at exactly
 *   one point, c* = 1 + a^2 / (2 w^2), where BOTH equal 2 + 4 w^2 / a^2 --
 *   an algebraic identity, not an approximation. Taking the smaller
 *   branch on each side of c* (branch (i) below c*, branch (ii) above)
 *   therefore caps the ratio uniformly in b by the SAME constant
 *   2 + 4 w^2/a^2 on both sides of the crossover.
 *
 *   WHY IT IS THE LOAD-BEARING STEP (contrasted with the single-branch
 *   quadratic bound)
 *   -----------------------------------------------
 *   The prior RZ-PEN / RZ-PEN2 trace majorant priced every finite symbol
 *   term at the single quadratic form 2 + kappa w^2 with kappa =
 *   4 cosh(a/2) / a^2 -- a bound valid uniformly in b only because it
 *   evaluates branch (i) at its WORST case b = a (c = cosh(a/2)), which
 *   is badly loose whenever b is much smaller than a (c close to 1, where
 *   branch (ii) is the tight one). LEMMA BCAP is load-bearing precisely
 *   because it is a MIN of two monotone-opposite branches rather than a
 *   single one: each branch is only ever evaluated on the side of c*
 *   where it is the smaller of the two, so the cap tracks whichever
 *   branch is actually tight at that b, not the worst case over all b at
 *   once. This is what turns the beta trace currency from "loose by a
 *   factor of cosh(a/2)" into "near-sharp per term" (measured supremum
 *   of ratio / cap over a dense (a, b, w) grid is 0.9998).
 *
 *   WHAT IT DOES NOT DO (a closed trace leg, not a closed chain)
 *   -----------------------------------------------
 *   LEMMA BCAP caps only the beta (cos-weighted) half of the trace; the
 *   alpha diagonal is handled separately by the companion LEMMA ACAP
 *   (imp-95329, keeping the exact 1 + sech(b/2) denominator). Neither
 *   lemma touches the three OTHER legs of the symbol-pencil floor chain:
 *   the {0, +-1} pair-identity truncation (imp-95333, still open), the
 *   theta-uniform tail constant c3n (later replaced chartwise by
 *   imp-95332 LEMMA TAIL-CHART), or the det/tr and two-chart corner
 *   reduction steps. Measured floor gain from LEMMA BCAP + LEMMA ACAP
 *   together is 6.073x at rho = e^6 (down from 1.119x at rho = 2, since
 *   the crossover only helps once cosh(a/2) is meaningfully above 1); it
 *   moves every-octave onsets by less than 0.07 (14.302669 -> 14.242145
 *   m-and-r-uniform) and changes no bound of the program.
 *
 * @see imp-95329-beta-trace-capped-pencil-floor.js (source: LEMMA BCAP,
 *   LEMMA ACAP, THEOREM RZ-PEN3, COROLLARY PEN-UNIF3, COROLLARY
 *   SPLIT-PEN3)
 * @see imp-95328-* (source: the theta-uniform / b-uniform quadratic
 *   trace weight 2 + kappa w^2 that LEMMA BCAP replaces)
 * @see imp-95332-* (LEMMA TAIL-CHART, the later chartwise sharpening of
 *   the tail leg that LEMMA BCAP leaves untouched)
 *
 * Ticket: imp-95362 (content, low). Documentation only; establishes no
 * new bound; NO QED; no refereed bound is changed.
 */

// The concept-note content, baked verbatim (no re-import of imp-95329).
const BCAP_HEADWORD = Object.freeze({
  key: 'bcap-uniform-in-b-beta-trace-cap',
  term:
    'LEMMA BCAP (uniform-in-b beta trace cap): for all a, b > 0 and ' +
    'real w, (1 - cos(w b / a)) / (1 - sech(b/2)) <= 2 + 4 w^2 / a^2, ' +
    'proved by taking the smaller of two monotone-opposite branches in ' +
    'c = cosh(b/2) that cross exactly at c* = 1 + a^2 / (2 w^2), where ' +
    'both equal the cap',
  whatItBounds:
    'The ratio (1 - cos(w b / a)) / (1 - sech(b/2)) that appears in the ' +
    'beta diagonal of the symbol-pencil trace, uniformly over ALL b in ' +
    '(0, a] at once (not just the worst-case b = a), via the min of a ' +
    'branch increasing in c = cosh(b/2) and a branch decreasing in c, ' +
    'each of which dominates only on its own side of the crossover ' +
    'c* = 1 + a^2 / (2 w^2).',
  whyItIsLoadBearing:
    'The prior RZ-PEN / RZ-PEN2 trace majorant priced every term at the ' +
    'single quadratic 2 + kappa w^2 with kappa = 4 cosh(a/2) / a^2, ' +
    'evaluating the increasing branch at its worst case b = a even when ' +
    'the actual b is much smaller (where the decreasing branch is tight ' +
    'instead). LEMMA BCAP replaces that single worst-case evaluation ' +
    'with a genuine min of the two branches, so the cap tracks whichever ' +
    'branch is tight at the ACTUAL b, not the worst b -- this is what ' +
    'lets the trace currency go from loose-by-cosh(a/2) to near-sharp.',
  whyItIsSharp:
    'The crossover algebra is an exact identity: both branches equal ' +
    '2 + 4 w^2 / a^2 at c* = 1 + a^2 / (2 w^2), checked to relative ' +
    '1e-12. A dense grid over a, b, w (including a = 11, outside the ' +
    'theorem scope) finds no violation and a worst-case measured ratio ' +
    'of cap-achievement of 0.9998 -- the lemma is nearly attained, so ' +
    'the beta trace currency is EXHAUSTED by this step, not merely ' +
    'improved.',
  whatItDoesNotDo:
    'LEMMA BCAP caps only the beta (cos-weighted) trace diagonal; the ' +
    'alpha diagonal needs the separate companion LEMMA ACAP. It supplies ' +
    'no sharpening of the {0, +-1} pair-identity truncation (imp-95333), ' +
    'the tail constant c3n (later chartwise sharpened by imp-95332 ' +
    'LEMMA TAIL-CHART), or the det/tr and two-chart corner reduction ' +
    'steps; it moves no certificate onset by more than 0.07 and ' +
    'establishes no new program bound.',
});

export const IMP95362_BCAP_BETA_TRACE_CAP_CONCEPT_NOTE = Object.freeze({
  id: 'imp-95362',
  proofSection: 'S-frontier',
  glosses: 'imp-95329',
  scopes:
    'LEMMA BCAP: uniform-in-b beta trace cap (1 - cos(w b/a)) / ' +
    '(1 - sech(b/2)) <= 2 + 4 w^2/a^2, via a two-branch crossover in ' +
    'c = cosh(b/2) meeting exactly at c* = 1 + a^2/(2 w^2)',
  question:
    'What does the imp-95329 LEMMA BCAP two-branch beta trace cap ' +
    'establish, and why does taking the min of an increasing and a ' +
    'decreasing branch in cosh(b/2) -- rather than evaluating a single ' +
    'branch at its worst case -- exhaust the beta half of the trace ' +
    'currency in the RZ-PEN symbol-pencil floor chain?',
  headword: BCAP_HEADWORD,
  anyEnclosureEstablished: false,
  verdict:
    'CONCEPT NOTE ONLY (documentation, not a proof). Restates the ' +
    'imp-95329 LEMMA BCAP two-branch crossover construction and why ' +
    'taking the min of the increasing and decreasing branches (crossing ' +
    'exactly at c* = 1 + a^2/(2 w^2)) exhausts the beta trace currency ' +
    '(measured sup ratio/cap 0.9998), while noting the companion LEMMA ' +
    'ACAP and the other named residual legs (pair-identity truncation, ' +
    'tail constant, corner reduction) remain separate matters. ' +
    'Establishes nothing new; fires no certificate; no refereed bound is changed' +
    '.',
  citation:
    'imp-95329-beta-trace-capped-pencil-floor.js (LEMMA BCAP, LEMMA ' +
    'ACAP, THEOREM RZ-PEN3); imp-95328-* (the quadratic trace weight ' +
    'LEMMA BCAP replaces); imp-95332-* (the later chartwise tail ' +
    'sharpening left untouched here).',
});

export default IMP95362_BCAP_BETA_TRACE_CAP_CONCEPT_NOTE;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95362_BCAP_BETA_TRACE_CAP_CONCEPT_NOTE_ASSERTIONS = [
  {
    id: 'imp95362-headword-has-required-fields',
    why:
      'The concept note must state what LEMMA BCAP bounds, why it is ' +
      'load-bearing (tracking the tight branch instead of the worst-case ' +
      'branch), why it is sharp (near-attained ratio/cap), and what it ' +
      'does not itself supply (the companion lemma and the other open ' +
      'residual legs) -- the entire point of the note.',
    holds: () => {
      const h = IMP95362_BCAP_BETA_TRACE_CAP_CONCEPT_NOTE.headword;
      return (
        /c\* = 1 \+ a\^2 \/ \(2 w\^2\)/.test(h.term) &&
        /min/.test(h.whatItBounds) &&
        /worst/.test(h.whyItIsLoadBearing) &&
        /0\.9998/.test(h.whyItIsSharp) &&
        /LEMMA ACAP/.test(h.whatItDoesNotDo) &&
        /pair-identity truncation/.test(h.whatItDoesNotDo)
      );
    },
  },
  {
    id: 'imp95362-crossover-identity-self-contained',
    why:
      'The note claims the two branches are equal exactly at ' +
      'c* = 1 + a^2/(2 w^2); verify this crossover algebra directly with ' +
      'an independent, self-contained reproduction (no import of ' +
      'imp-95329).',
    holds: () => {
      for (const a of [0.5, Math.LN2, 3, 6, 11]) {
        for (let iw = 1; iw <= 60; iw++) {
          const w = (iw / 60) * 4 * Math.PI;
          const cap = 2 + (4 * w * w) / (a * a);
          const d = (a * a) / (2 * w * w);
          const cStar = 1 + d;
          const branchIncreasing = (4 * w * w * cStar) / (a * a);
          const branchDecreasing = 2 + 2 / d;
          if (Math.abs(branchIncreasing / cap - 1) > 1e-12) return false;
          if (Math.abs(branchDecreasing / cap - 1) > 1e-12) return false;
        }
      }
      return true;
    },
  },
  {
    id: 'imp95362-cap-dominates-ratio-on-dense-grid',
    why:
      'The note claims the min-of-two-branches cap 2 + 4 w^2/a^2 ' +
      'dominates the true ratio (1 - cos(w b/a)) / (1 - sech(b/2)) for ' +
      'every a, b > 0 and real w; verify directly on a dense grid ' +
      'including out-of-scope a = 11.',
    holds: () => {
      const sechHalf = (u) => 1 / Math.cosh(u / 2);
      for (const a of [0.1, Math.LN2, Math.log(4), 3, 6, 11]) {
        for (let iw = 0; iw <= 80; iw++) {
          const w = (iw / 80) * 4 * Math.PI;
          const cap = 2 + (4 * w * w) / (a * a);
          for (let ib = 1; ib <= 160; ib++) {
            const b = (ib / 160) * 2 * a;
            const ratio = (1 - Math.cos((w * b) / a)) / (1 - sechHalf(b));
            if (ratio > cap * (1 + 1e-12)) return false;
          }
        }
      }
      return true;
    },
  },
  {
    id: 'imp95362-honesty-gate-no-qed',
    why:
      'Documentation only: no enclosure claimed established, no QED, no-refereed-bound-change line present, glosses and scopes fields consistent.',
    holds: () =>
      IMP95362_BCAP_BETA_TRACE_CAP_CONCEPT_NOTE.anyEnclosureEstablished ===
        false &&
      /refereed bound is changed/i.test(IMP95362_BCAP_BETA_TRACE_CAP_CONCEPT_NOTE.verdict) &&
      IMP95362_BCAP_BETA_TRACE_CAP_CONCEPT_NOTE.glosses === 'imp-95329' &&
      IMP95362_BCAP_BETA_TRACE_CAP_CONCEPT_NOTE.scopes ===
        'LEMMA BCAP: uniform-in-b beta trace cap (1 - cos(w b/a)) / ' +
          '(1 - sech(b/2)) <= 2 + 4 w^2/a^2, via a two-branch crossover in ' +
          'c = cosh(b/2) meeting exactly at c* = 1 + a^2/(2 w^2)',
  },
];

for (const assertion of IMP95362_BCAP_BETA_TRACE_CAP_CONCEPT_NOTE_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-95362-bcap-beta-trace-cap-concept-note assertion failed: ${assertion.id}`
    );
  }
}
