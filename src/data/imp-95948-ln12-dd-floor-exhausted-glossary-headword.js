/**
 * @module imp-95948-ln12-dd-floor-exhausted-glossary-headword
 * @fileoverview imp-95948 -- import-light glossary/Concepts headword for the
 *   imp-95919 finding that the ln 1.2 double-double (DD) shift-invert reach
 *   lever is EXHAUSTED past N = 5200: pushing further does not tighten the
 *   companion u_fit_rel below the ln 1.3 direct 0.23 percent target -- it
 *   PLATEAUS at 0.247 percent, because the deep-corner A_opt ~ 4.26e-22
 *   solve (cond ~ 5.6e22) has hit the DD ~32-digit precision floor, not
 *   because the extrapolation is merely slow.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-95860/imp-95881/imp-95896 each pushed the ln 1.2 DD grid further
 *   (N = 1000 -> 2800 -> 5200) and tightened u_fit_rel monotonically
 *   (0.54% -> 0.34% -> 0.247%), always leaving the same open residual:
 *   "crossing below 0.23% needs still larger N". imp-95919 tried the next
 *   two reach points (N = 6400, N = 8000) and found a QUALITATIVELY
 *   DIFFERENT outcome -- the reach lever itself breaks. A reader who only
 *   knows the earlier "just needs more reach" framing will misread the
 *   imp-95919 module and expect yet another point to fix it. This headword
 *   bakes the flip VERBATIM (no re-import of the imp-95919 module, to stay
 *   import-light) as a standalone lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   "Reach lever exhausted" (as opposed to "reach lever slow") means that
 *   pushing the double-double shift-invert grid to larger N no longer
 *   tightens the primal extrapolation at all -- it makes it WORSE or
 *   UNUSABLE, because the finite-section correction being measured has
 *   shrunk below the arithmetic's own rounding floor. Concretely, at
 *   delta = ln 1.2: N = 6400 (reach ~1167) gives DD lambda_min that ticks
 *   BACK UP relative to N = 5200 (4.26369e-22 -> 4.26377e-22, ratio-1
 *   growing 6.21e-5 -> 8.09e-5), breaking the monotone-decreasing sweep
 *   that held for every N <= 5200; N = 8000 (reach ~1459) loses DD
 *   positive-definiteness entirely and returns NaN. Consequently the
 *   per-delta u_fit_rel PLATEAUS at the imp-95896 N <= 5200 value, 0.247
 *   percent -- 1.07x looser than the ln 1.3 direct target of 0.23 percent
 *   -- rather than crossing below it.
 *
 *   WHY IT HAPPENS: the (pi/(N+1))^2 finite-section correction driving
 *   lambda_min(N) down toward the deep-corner limit A_opt ~ 4.26e-22
 *   shrinks with N, and past N ~ 5200 it has shrunk below the DD roundoff
 *   of the near-singular (cond ~ 5.6e22) shift-invert solve. DD arithmetic
 *   carries only ~32 significant digits; once the signal being resolved is
 *   smaller than that floor, adding more grid points adds noise, not
 *   information.
 *
 *   THE RESIDUAL: crossing the ln 1.2 companion u_fit_rel below the ln 1.3
 *   direct 0.23 percent now requires precision BEYOND double-double
 *   (quad-double or MPFR at the deep corner), not more reach. The signed
 *   interval-arithmetic difference (A_fit - A_opt)/A_opt still contains
 *   zero at the plateau, so the dual/primal consistency verdict is
 *   unchanged either way.
 *
 * @see imp-95919-ln12-past5200-dd-floor (source: the measurement this glosses)
 * @see imp-95896-ln12-past2800-ufit-tightening (the last DD-reliable 14-point grid, N <= 5200)
 * @see imp-95820-shift-invert-dd-toeplitz-crossing (the shift-invert DD solver reused here)
 * @see imp-95767-dual-primal-agreement-interval (the certified interval whose ln 1.3 direct value is the crossing target)
 *
 * Ticket: imp-95948 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The DD-reach-lever-exhausted headword, baked verbatim (no re-import).
const LN12_DD_FLOOR_EXHAUSTED_HEADWORD = Object.freeze({
  key: 'dd-reach-lever-exhausted-ln12-deep-corner',
  term:
    'DD reach-lever-exhausted plateau ' +
    '(ln 1.2 companion u_fit_rel floors at 0.247% past N = 5200)',
  definition:
    'A diagnostic label for a double-double (DD) finite-grid extrapolation ' +
    'whose reach lever has stopped working: pushing the grid to larger N no ' +
    'longer tightens the extrapolated uncertainty u_fit_rel because the ' +
    'quantity being resolved has shrunk below the DD arithmetic rounding ' +
    'floor, so the sweep either reverses (added noise) or breaks down ' +
    '(loses positive-definiteness, NaN) instead of continuing to converge.',
  mechanism:
    'The (pi/(N+1))^2 finite-section correction driving the shift-invert ' +
    'lambda_min(N) down toward the deep-corner limit A_opt ~ 4.26e-22 ' +
    'shrinks with N; past N ~ 5200 it has shrunk below the DD roundoff of ' +
    'the near-singular (cond ~ 5.6e22) shift-invert solve, so DD noise ' +
    'dominates the signal. At N = 6400 (reach ~1167) the DD lambda_min ' +
    'ticks back UP from the N = 5200 value (4.26369e-22 -> 4.26377e-22, ' +
    'ratio-1 growing 6.21e-5 -> 8.09e-5), breaking the monotone-decreasing ' +
    'sweep that held for every N <= 5200; at N = 8000 (reach ~1459) the ' +
    'shifted Levinson recursion loses DD positive-definiteness entirely ' +
    'and returns NaN.',
  measuredPlateau:
    'The per-delta u_fit_rel does NOT cross below the ln 1.3 direct 0.23 ' +
    'percent target -- it plateaus at the imp-95896 N <= 5200 value, 0.247 ' +
    'percent (1.07x looser). The last DD-reliable extrapolation stays the ' +
    'imp-95896 14-point grid (A_fit = 4.2641502501e-22); adding the ' +
    'N = 6400 floor-contaminated point does not tighten the envelope, and ' +
    'N = 8000 is unusable.',
  interpretation:
    'Reach-lever-exhausted is a NEW regime, distinct from the earlier ' +
    'imp-95860/imp-95881/imp-95896 residual of "crossing below needs still ' +
    'larger N" (a slower-but-open reach refinement): here more reach makes ' +
    'things worse, not slower. Crossing the ln 1.2 companion u_fit_rel ' +
    'below 0.23 percent now requires precision BEYOND double-double ' +
    '(quad-double or MPFR at the deep corner), not more grid points. The ' +
    'signed interval-arithmetic difference (A_fit - A_opt)/A_opt still ' +
    'contains zero at the plateau, so this changes no bound and decides no ' +
    'dual/primal disagreement.',
});

export const IMP95948_LN12_DD_FLOOR_EXHAUSTED_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-95948',
  proofSection: 'S-frontier',
  glosses: 'imp-95919',
  question:
    'imp-95919 found that extending the ln 1.2 DD shift-invert grid past ' +
    'N = 5200 does not cross the companion u_fit_rel below the ln 1.3 ' +
    'direct 0.23 percent target -- it plateaus at 0.247 percent because ' +
    'N = 6400 reverses and N = 8000 returns NaN. What does "reach lever ' +
    'exhausted" mean here, how is it different from the earlier "just ' +
    'needs more reach" residuals, and why does it matter, for a reader ' +
    'landing on that module cold?',
  headword: LN12_DD_FLOOR_EXHAUSTED_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the ' +
    'imp-95919 finding: past N = 5200 the ln 1.2 DD shift-invert reach ' +
    'lever is floored, not merely slow -- N = 6400 reverses the monotone ' +
    'sweep and N = 8000 breaks down entirely, because the deep-corner ' +
    'A_opt ~ 4.26e-22 solve (cond ~ 5.6e22) has hit the DD ~32-digit ' +
    'rounding floor. The companion u_fit_rel plateaus at 0.247 percent ' +
    '(1.07x looser than the ln 1.3 direct 0.23 percent) and the residual ' +
    'is reframed from "more reach" to "more precision" (quad-double / ' +
    'MPFR). Establishes nothing; instantiates no interval; moves no ' +
    'bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-95919 (the past-5200 measurement and DD-floor verdict this ' +
    'glosses); imp-95896 (the last DD-reliable 14-point grid, N <= 5200); ' +
    'imp-95820 (the shift-invert DD Toeplitz solver reused across the ' +
    'reach series).',
});

export default IMP95948_LN12_DD_FLOOR_EXHAUSTED_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95948_LN12_DD_FLOOR_EXHAUSTED_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp95948-headword-has-required-fields',
    why: 'The headword must name the reach-lever-exhausted flip, the DD ~32-digit floor mechanism, and the measured 0.247% plateau -- the entire point of the glossary entry.',
    holds: () => {
      const h = LN12_DD_FLOOR_EXHAUSTED_HEADWORD;
      return (
        /reach lever/i.test(h.definition) &&
        /cond ~ 5\.6e22/.test(h.mechanism) &&
        /0\.247 percent/.test(h.measuredPlateau) &&
        /BEYOND double-double/.test(h.interpretation)
      );
    },
  },
  {
    id: 'imp95948-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP95948_LN12_DD_FLOOR_EXHAUSTED_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP95948_LN12_DD_FLOOR_EXHAUSTED_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP95948_LN12_DD_FLOOR_EXHAUSTED_GLOSSARY_HEADWORD.verdict) &&
      IMP95948_LN12_DD_FLOOR_EXHAUSTED_GLOSSARY_HEADWORD.glosses === 'imp-95919',
  },
];

for (const assertion of IMP95948_LN12_DD_FLOOR_EXHAUSTED_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-95948-ln12-dd-floor-exhausted-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
