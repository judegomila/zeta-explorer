/**
 * @module imp-95364-g-mono-chart-cover-concept-note
 * @fileoverview imp-95364 -- import-light concept note for the imp-95330
 *   LEMMA G-MONO ratio-monotone K-chart uniform cover of the symbol-pencil
 *   floor.
 *
 *   WHY A CONCEPT NOTE (not a re-derivation)
 *   -----------------------------------------------
 *   imp-95330 assembles LEMMA G-MONO, THEOREM RZ-PEN4, COROLLARY PEN-UNIF4
 *   and COROLLARY SPLIT-PEN4 to execute the chart-reduction leg of the
 *   imp-95329 named residual (the numerator currency). This note isolates
 *   LEMMA G-MONO -- the single two-variable monotonicity fact that lets a
 *   256-chart cover replace the old two-chart corner reduction -- without
 *   restating the surrounding refinement-dominance argument, the finite
 *   pencil cross-check, or the det/tr and pair-truncation residuals that
 *   imp-95330 leaves open.
 *
 *   THE NOTE
 *   -----------------------------------------------
 *   For u, v, c > 0, LEMMA G-MONO states that
 *     g(x, y) = 4 x y / (u x + v y + c)
 *   is strictly increasing in x and in y (on x, y > 0), and strictly
 *   decreasing in u, v and c. The proof is a one-line quotient rule: the
 *   x-partial has the sign of y (v y + c) > 0, and each of the u, v, c
 *   partials has the sign of the negative numerator times x y > 0. Because
 *   det M / tr M on a chart [t0, t1] takes exactly this shape -- with
 *   x = P_0, y = S the numerator-side quantities and u, v, c the
 *   trace-side weights -- substituting a LOWER bound for P_0 and S and an
 *   UPPER bound for the trace weights on the SAME chart is guaranteed to
 *   only decrease g, i.e. it is floor-safe in both directions at once.
 *
 *   WHY IT IS THE LOAD-BEARING STEP (contrasted with the two-chart corner
 *   reduction)
 *   -----------------------------------------------
 *   THEOREM RZ-PEN2/RZ-PEN3 handled the theta-dependence of det M / tr M
 *   by scanning a SINGLE split point and taking a worst-case bound on
 *   each of the two resulting pieces -- a bound that MAXIMIZES over the
 *   scanned split, carrying a scan-selection caveat. LEMMA G-MONO removes
 *   that caveat: because g is monotone in all five of its slots
 *   independently, covering [0, pi] by K = 256 uniform charts and
 *   applying the SAME substitution on every chart turns the corner
 *   reduction into a MINIMUM of 256 closed-form per-chart floors, each
 *   individually proven, with no selection step left to justify. The
 *   refinement-dominance argument (every old split point is a chart
 *   boundary of the new cover) then shows the K-chart floor A_pen4 is
 *   never worse than the two-chart floor A_pen3 -- LEMMA G-MONO is what
 *   makes that comparison a one-line monotonicity check instead of a
 *   fresh case analysis.
 *
 *   WHAT IT DOES NOT DO (a chart leg, not a closed chain)
 *   -----------------------------------------------
 *   LEMMA G-MONO only licenses the substitution; it says nothing about
 *   which chart ends up binding, how many charts are enough, or what
 *   still limits the floor once the chart currency is exhausted. Measured
 *   gain over the two-chart floor is 5.7648x at rho = 2 (near-exhausted,
 *   K = 256 within 0.73% of K = 4096) but only 1.1458x at rho = e^6,
 *   where the binding chart is the far corner k = 255 -- exactly where
 *   the old two-chart reduction already looked, so more charts cannot
 *   help there. The surviving looseness at large rho (5.4-9.8x) lives in
 *   the det-over-trace step and the {0, +-1} pair-identity truncation,
 *   neither of which LEMMA G-MONO or the chart cover touches.
 *
 * @see imp-95330-chart-refined-pencil-floor.js (source: LEMMA G-MONO,
 *   THEOREM RZ-PEN4, COROLLARY PEN-UNIF4, COROLLARY SPLIT-PEN4)
 * @see imp-95329-beta-trace-capped-pencil-floor.js (the per-term trace
 *   weight t3 that LEMMA G-MONO treats as one of its monotone slots)
 * @see imp-95328-* (the two-chart corner reduction that the K-chart cover
 *   replaces)
 *
 * Ticket: imp-95364 (content, low). Documentation only; establishes no
 * new bound; NO QED; no refereed bound is changed.
 */

// The concept-note content, baked verbatim (no re-import of imp-95330).
const G_MONO_HEADWORD = Object.freeze({
  key: 'g-mono-ratio-monotone-chart-cover',
  term:
    'LEMMA G-MONO (ratio monotonicity): for u, v, c > 0, ' +
    'g(x, y) = 4 x y / (u x + v y + c) is strictly increasing in x and y ' +
    'and strictly decreasing in u, v, c on positive arguments, by the ' +
    'quotient rule',
  whatItBounds:
    'The per-chart floor of det M / tr M, which on any chart [t0, t1] ' +
    'has the shape g(P_0, S; t3(t1), t3(2 pi + t1), c3n): substituting ' +
    'the chart lower bounds P(t1) <= P_0 and S(t0) <= S for the two ' +
    'numerator-side arguments, and the chart upper bounds for the three ' +
    'trace-side weights, is guaranteed floor-safe in both directions at ' +
    'once because g is monotone in every slot independently.',
  whyItIsLoadBearing:
    'The prior two-chart corner reduction (RZ-PEN2/RZ-PEN3) scanned a ' +
    'single split point and took a worst-case bound on each side, ' +
    'carrying a scan-selection caveat. LEMMA G-MONO removes that caveat: ' +
    'covering [0, pi] with K = 256 uniform charts and applying the same ' +
    'monotone substitution on each turns the reduction into a MINIMUM of ' +
    '256 individually proven closed-form floors, with refinement ' +
    'dominance (every old split point is a chart boundary) showing the ' +
    'K-chart floor is never worse than the two-chart floor.',
  whyItIsSharp:
    'The K-convergence is measured, not assumed: K = 256 is within ' +
    '0.73% of K = 4096 at rho = 2, so the chart currency is exhausted at ' +
    'the 1% level there. Gain over the two-chart floor is 5.7648x at ' +
    'rho = 2 (near-exhausted, exact inf within 1.03-1.06x of A_pen4) but ' +
    'only 1.1458x at rho = e^6, where the binding chart is the far ' +
    'corner k = 255 that the old two-chart reduction already handled.',
  whatItDoesNotDo:
    'LEMMA G-MONO licenses the chart substitution; it says nothing about ' +
    'which chart binds, how many charts suffice, or the two other ' +
    'residual legs of the numerator currency: the det-over-trace step ' +
    '(1.37-1.66x loose at rho = e^6) and the {0, +-1} pair-identity ' +
    'truncation, both of which remain OPEN and are what bind at large ' +
    'rho once the chart currency is exhausted.',
});

export const IMP95364_G_MONO_CHART_COVER_CONCEPT_NOTE = Object.freeze({
  id: 'imp-95364',
  proofSection: 'S-frontier',
  glosses: 'imp-95330',
  scopes:
    'LEMMA G-MONO: g(x, y) = 4 x y / (u x + v y + c) is increasing in x, ' +
    'y and decreasing in u, v, c on positive arguments, licensing a ' +
    'K = 256 uniform-chart cover of the two-chart corner reduction',
  question:
    'What does the imp-95330 LEMMA G-MONO ratio-monotonicity fact ' +
    'establish, and why does it let a 256-chart uniform cover of ' +
    '[0, pi] replace the old two-chart scan-and-maximize corner ' +
    'reduction without a scan-selection caveat?',
  headword: G_MONO_HEADWORD,
  anyEnclosureEstablished: false,
  verdict:
    'CONCEPT NOTE ONLY (documentation, not a proof). Restates the ' +
    'imp-95330 LEMMA G-MONO monotonicity fact and why substituting chart ' +
    'lower bounds for the numerator-side arguments and chart upper ' +
    'bounds for the trace-side weights is floor-safe on every chart at ' +
    'once, turning the K-chart cover into a minimum of 256 individually ' +
    'proven floors (measured chart-currency exhaustion 0.73% at ' +
    'K = 4096, rho = 2), while noting the det-over-trace and ' +
    'pair-identity-truncation legs remain separate open residuals. ' +
    'Establishes nothing new; fires no certificate; no refereed bound is changed' +
    '.',
  citation:
    'imp-95330-chart-refined-pencil-floor.js (LEMMA G-MONO, THEOREM ' +
    'RZ-PEN4, COROLLARY PEN-UNIF4, COROLLARY SPLIT-PEN4); ' +
    'imp-95329-beta-trace-capped-pencil-floor.js (the per-term trace ' +
    'weight t3 used as a monotone slot); imp-95328-* (the two-chart ' +
    'corner reduction the cover replaces).',
});

export default IMP95364_G_MONO_CHART_COVER_CONCEPT_NOTE;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95364_G_MONO_CHART_COVER_CONCEPT_NOTE_ASSERTIONS = [
  {
    id: 'imp95364-headword-has-required-fields',
    why:
      'The concept note must state what LEMMA G-MONO bounds, why it is ' +
      'load-bearing (removing the scan-selection caveat via a monotone ' +
      'chart substitution), why it is sharp (measured chart-currency ' +
      'exhaustion), and what it does not itself supply (the det/tr and ' +
      'truncation residuals) -- the entire point of the note.',
    holds: () => {
      const h = IMP95364_G_MONO_CHART_COVER_CONCEPT_NOTE.headword;
      return (
        /4 x y \/ \(u x \+ v y \+ c\)/.test(h.term) &&
        /monotone/.test(h.whatItBounds) &&
        /scan-selection caveat/.test(h.whyItIsLoadBearing) &&
        /0\.73%/.test(h.whyItIsSharp) &&
        /det-over-trace/.test(h.whatItDoesNotDo) &&
        /pair-identity truncation/.test(h.whatItDoesNotDo)
      );
    },
  },
  {
    id: 'imp95364-g-mono-monotonicity-self-contained',
    why:
      'The note claims g(x, y) = 4xy/(ux + vy + c) is increasing in x, y ' +
      'and decreasing in u, v, c; verify this directly with an ' +
      'independent, self-contained reproduction (no import of ' +
      'imp-95330).',
    holds: () => {
      const g = (x, y, u, v, c) => (4 * x * y) / (u * x + v * y + c);
      for (const u of [0.5, 2, 10]) {
        for (const v of [0.5, 2, 10]) {
          for (const c of [0.1, 1, 10]) {
            for (const x0 of [0.2, 1, 5]) {
              for (const y0 of [0.2, 1, 5]) {
                for (let i = 1; i <= 10; i++) {
                  const d = i / 10;
                  if (g(x0 + d, y0, u, v, c) <= g(x0, y0, u, v, c))
                    return false;
                  if (g(x0, y0 + d, u, v, c) <= g(x0, y0, u, v, c))
                    return false;
                  if (g(x0, y0, u + d, v, c) >= g(x0, y0, u, v, c))
                    return false;
                  if (g(x0, y0, u, v + d, c) >= g(x0, y0, u, v, c))
                    return false;
                  if (g(x0, y0, u, v, c + d) >= g(x0, y0, u, v, c))
                    return false;
                }
              }
            }
          }
        }
      }
      return true;
    },
  },
  {
    id: 'imp95364-honesty-gate-no-qed',
    why:
      'Documentation only: no enclosure claimed established, no QED, no-refereed-bound-change line present, glosses and scopes fields consistent.',
    holds: () =>
      IMP95364_G_MONO_CHART_COVER_CONCEPT_NOTE.anyEnclosureEstablished ===
        false &&
      /refereed bound is changed/i.test(
        IMP95364_G_MONO_CHART_COVER_CONCEPT_NOTE.verdict,
      ) &&
      IMP95364_G_MONO_CHART_COVER_CONCEPT_NOTE.glosses === 'imp-95330' &&
      IMP95364_G_MONO_CHART_COVER_CONCEPT_NOTE.scopes ===
        'LEMMA G-MONO: g(x, y) = 4 x y / (u x + v y + c) is increasing in x, ' +
          'y and decreasing in u, v, c on positive arguments, licensing a ' +
          'K = 256 uniform-chart cover of the two-chart corner reduction',
  },
];

for (const assertion of IMP95364_G_MONO_CHART_COVER_CONCEPT_NOTE_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-95364-g-mono-chart-cover-concept-note assertion failed: ${assertion.id}`
    );
  }
}
