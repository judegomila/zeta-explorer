/**
 * @module imp-96479-basis-c-floor-dejitter-glossary-headword
 * @fileoverview imp-96479 -- import-light glossary/Concepts headword for the imp-96444
 *   result: replacing the imp-96430 MIN-over-coarse-ppp basis-C floor estimator with a
 *   MEDIAN-over-resolved-ppp estimator de-jitters the corroboration-reach crossover band,
 *   narrowing it from [1.3e12, 2.5e12] (width ratio ~1.92) to a proper subset
 *   [1.38e12, 1.76e12] (width ratio ~1.27) at its lower end.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96430 estimated the per-L basis-C direct-integral floor as the MINIMUM error
 *   over a coarse panels-per-period (ppp) sweep {40..640}. min|error| is jittery: the
 *   direct-integral error changes SIGN as ppp varies, so the minimum accidentally lands
 *   near zero whenever a swept ppp happens to fall on a zero-crossing (the L=240 rung
 *   dips below L=120). That jitter forced a wide crossover band. imp-96444 fixed the
 *   estimator, not the model: taking the MEDIAN error over a dense, fully-resolved
 *   high-ppp sweep {320..1280} (where Simpson truncation is negligible, so the residual
 *   is pure roundoff/catastrophic-cancellation noise) gives the typical roundoff plateau,
 *   immune to the accidental zero-crossings. This headword names the estimator and bakes
 *   its narrowed-band verdict verbatim (no re-import of the imp-96430/imp-96444 modules,
 *   to stay import-light) as a standalone quick-lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   MEDIAN-OVER-RESOLVED-PPP FLOOR ESTIMATOR (imp-96444): for each calibration L, sweep
 *   a dense fully-resolved ppp grid {320..1280} and take the MEDIAN of |directRho - rhoExact|
 *   across that grid (not the MIN over a coarser {40..640} grid, as imp-96430 did). The
 *   median floor sequence is MONOTONE in L (~1.46e-13 at L=30 to ~1.42e-11 at L=960),
 *   unlike the imp-96430 min-sweep floor (non-monotone: L=240 below L=120). Its robust
 *   L-linear slopes cluster tightly -- median-of-pairwise-slopes (Theil-Sen) ~8.0e-15,
 *   median-of-per-rung-floor/L ~6.2e-15, mean ~7.1e-15 -- versus the min-sweep slopes
 *   spanning two orders of magnitude, and the free log-log exponent tightens from ~1.71
 *   (min sweep) to ~1.30 (median sweep), much closer to the assumed L-linear model
 *   (exponent 1).
 *
 *   NARROWED CROSSOVER BAND: re-bisecting the corroboration-reach crossover L* with the
 *   two robust slopes brackets it at [~1.38e12 (Theil-Sen, larger slope, smaller L*),
 *   ~1.76e12 (median-of-slopes, smaller slope, larger L*)] -- width ratio ~1.27 -- a
 *   PROPER SUBSET of the imp-96430 band [~1.3e12, ~2.5e12] (width ratio ~1.92), sitting
 *   at that band's lower end. Both bands still put L* five-to-six decades past the PT
 *   anchor L = 5.9e6, so the qualitative imp-96430 conclusion (basis C independently
 *   corroborates basis A well past the PT anchor) is unchanged and now rests on a
 *   monotone, stable slope instead of a jittery min-sweep one. At the PT anchor the
 *   conservative (larger, Theil-Sen) slope still gives a signal/floor headroom ~3.9e5,
 *   the same order as imp-96430's ~3.7e5.
 *
 *   STATUS: an estimator-robustness headword restating the imp-96444 re-measurement, not
 *   a fresh derivation of the crossover or a new bound.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96444 verdict for quick reference. It
 *   establishes nothing, instantiates no interval beyond what imp-96444 already bisected,
 *   closes no sub-gap, moves no bound. NO QED. No refereed bound is changed.
 *
 * @see imp-96444-basis-c-floor-slope-dejitter (source: the median-over-resolved-ppp de-jittering this glosses)
 * @see imp-96430-basis-c-corroboration-reach-crossover (the coarse min-sweep band this narrows)
 * @see imp-96389-three-basis-rho-crossvalidation-table (basis-C L-linear floor is the binding floor)
 * @see imp-96369-direct-double-integral-pt-anchor-feasibility (basis C feasibility and its floor model)
 *
 * Ticket: imp-96479 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The basis-C floor-de-jittering glossary headword, baked verbatim
// (no re-import of the imp-96430/imp-96444 modules).
const BASIS_C_FLOOR_DEJITTER_HEADWORD = Object.freeze({
  key: 'basis-c-floor-dejitter-median-over-resolved-ppp',
  term:
    'The MEDIAN-over-resolved-ppp basis-C floor estimator (imp-96444), which replaces ' +
    'the imp-96430 MIN-over-coarse-ppp estimator and narrows the corroboration-reach ' +
    'crossover band',
  definition:
    'imp-96430 estimated the per-L basis-C direct-integral floor as the MINIMUM error ' +
    'over a coarse panels-per-period sweep {40..640}; min|error| is jittery because the ' +
    'direct-integral error changes sign as ppp varies, so the minimum can accidentally ' +
    'land near zero (the L=240 rung dips below L=120). imp-96444 instead sweeps a dense, ' +
    'fully-resolved high-ppp grid {320..1280} -- where Simpson truncation is negligible ' +
    'so the residual is pure roundoff/catastrophic-cancellation noise -- and takes the ' +
    'MEDIAN error, the typical roundoff plateau, immune to those zero-crossings. The ' +
    'result is a monotone floor sequence with robust L-linear slopes clustering ' +
    '(~6.2e-15 to ~8.0e-15) instead of spanning two orders of magnitude, narrowing the ' +
    'corroboration-reach crossover band from imp-96430s [~1.3e12, ~2.5e12] (width ratio ' +
    '~1.92) to a proper subset [~1.38e12, ~1.76e12] (width ratio ~1.27) at its lower end.',
  mechanism:
    'The MIN-over-coarse-sweep estimator confounds two things: the genuine roundoff ' +
    'plateau and the coincidence of a swept ppp landing on an error zero-crossing. The ' +
    'MEDIAN-over-resolved-sweep estimator only sees the plateau, because a dense grid of ' +
    'fully-resolved evaluations has the error oscillating narrowly around it, so the ' +
    'median is stable while the min stays a jitter-prone outlier. This is an estimator ' +
    'fix, not a change of model: the underlying assumption (an L-linear roundoff floor) ' +
    'is unchanged, only how that floor is measured at each calibration L.',
  verificationStatus:
    'Estimator-robustness re-measurement (numerical cross-validation), not a rigorous ' +
    'derivation of the crossover. The crossover L* remains an EXTRAPOLATION -- the robust ' +
    'slope is calibrated only on accessible L (<= 960) and the direct integral is never ' +
    'evaluated at L ~ 1e12. Changes no bound; establishes no operator positivity; does ' +
    'not touch the ~1.9-sigma excursion confidence; no refereed bound is changed; RH open; NO QED.',
});

export const IMP96479_BASIS_C_FLOOR_DEJITTER_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96479',
  proofSection: 'S-frontier',
  glosses: 'imp-96444',
  question:
    'imp-96444 re-measured the imp-96430 basis-C corroboration-reach crossover with a ' +
    'de-jittered floor estimator. How should a reader name that estimator and its ' +
    'quantitative effect on the crossover band?',
  headword: BASIS_C_FLOOR_DEJITTER_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names the imp-96444 ' +
    'median-over-resolved-ppp basis-C floor estimator, which replaces the imp-96430 ' +
    'jittery min-over-coarse-ppp estimator and narrows the corroboration-reach crossover ' +
    'band from [~1.3e12, ~2.5e12] (width ratio ~1.92) to a proper subset ' +
    '[~1.38e12, ~1.76e12] (width ratio ~1.27) at its lower end, still five-to-six decades ' +
    'past the PT anchor L = 5.9e6. Establishes nothing; instantiates no interval beyond ' +
    'imp-96444s bisection; moves no bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-96444 (the median-over-resolved-ppp de-jittering this glosses, narrowed band ' +
    '[1.38e12, 1.76e12]); imp-96430 (the coarse min-sweep band this narrows, ' +
    '[1.3e12, 2.5e12]); imp-96389 (basis-C L-linear floor is the binding floor); ' +
    'imp-96369 (basis-C feasibility and its floor model).',
});

export default IMP96479_BASIS_C_FLOOR_DEJITTER_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96479_BASIS_C_FLOOR_DEJITTER_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96479-headword-names-estimator-and-bands',
    why: 'The headword must name the estimator change and both the old and new ' +
      'crossover bands -- the entire point of the de-jittering.',
    holds: () => {
      const h = IMP96479_BASIS_C_FLOOR_DEJITTER_GLOSSARY_HEADWORD.headword;
      return (
        /MEDIAN/.test(h.definition) &&
        /MINIMUM/.test(h.definition) &&
        /1\.3e12/.test(h.definition) &&
        /2\.5e12/.test(h.definition) &&
        /1\.38e12/.test(h.definition) &&
        /1\.76e12/.test(h.definition)
      );
    },
  },
  {
    id: 'imp96479-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96479_BASIS_C_FLOOR_DEJITTER_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96479_BASIS_C_FLOOR_DEJITTER_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96479_BASIS_C_FLOOR_DEJITTER_GLOSSARY_HEADWORD.verdict) &&
      IMP96479_BASIS_C_FLOOR_DEJITTER_GLOSSARY_HEADWORD.glosses === 'imp-96444',
  },
];

for (const assertion of IMP96479_BASIS_C_FLOOR_DEJITTER_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96479-basis-c-floor-dejitter-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
