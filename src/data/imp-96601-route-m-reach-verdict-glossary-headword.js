/**
 * @module imp-96601-route-m-reach-verdict-glossary-headword
 * @fileoverview imp-96601 -- import-light glossary/Concepts headword for the imp-96569 finding
 *   that deciding the Route M Burnol-normalized ratio(N) -> 1 (RH + simple zeros) against the
 *   imp-96487 ~0.985 finite-N plateau needs a log-N reach the N ~ 9916 compute ceiling cannot
 *   deliver, by 1.4 to 3.2 orders of magnitude.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96569 projected how much wider the measured N=250..10000 Gram ladder would need to grow
 *   to separate ratio(N) -> 1 from the imp-96487 plateau centerline 0.984564, and compared that
 *   reach to the imp-96352 wall-clock ceiling N ~ 9916. A reader landing on imp-96569 cold has no
 *   quick-lookup statement of the verdict or its two headline numbers. This headword bakes those
 *   facts VERBATIM (no re-import of the imp-96569 module, to stay import-light) as a standalone
 *   lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   The RH-vs-plateau centerline gap is gapFull = 1 - 0.984564 = 0.015436, only ~1.24x the
 *   per-rung scatter (sigma_scatter = 0.01248) and ~1.74x the remainder-model residual
 *   (sigma_MB = 0.00885) -- a model-free floor showing no per-rung reading can ever reach 2
 *   sigma. Under the optimistic SE-of-mean reach model (which ignores the imp-96487 low-frequency
 *   drift degeneracy, so every number below is a LOWER bound on what is actually needed): the
 *   most optimistic corner (z=2, fastest 1/L^2 decay) needs N ~ 2.7e5, already ~1.4 orders beyond
 *   the N ~ 9916 ceiling; a representative 3-sigma decision under a 1/logN drift needs N ~ 1.6e7,
 *   ~3.2 orders beyond it.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96569 measurement and its headline figures for
 *   quick reference. It establishes nothing, instantiates no interval, closes no sub-gap, moves
 *   no bound. Measurement/projection only, NOT an RH bound; NO QED. No refereed bound is changed.
 *
 * @see imp-96569-route-m-window-reach-projection.js (source: the reach projection this glosses)
 * @see imp-96487-route-m-burnol-ratio-asymptotic-remainder-model.js (plateau 0.984564, sigmas)
 * @see imp-96352-route-m-vasyunin-solve-cost-model.js (compute ceiling N ~ 9916)
 * @see imp-96436-route-m-ratio-plateau-glossary-headword.js (companion headword for imp-96105)
 *
 * Ticket: imp-96601 (content, sonnet-4-6, sonnet). Documentation only; establishes nothing; NO
 * QED; no refereed bound is changed.
 */

// The Route-M reach-verdict headword, baked verbatim (no re-import).
const ROUTE_M_REACH_VERDICT_HEADWORD = Object.freeze({
  key: 'imp-96569-route-m-reach-out-of-reach',
  term: 'imp-96569 verdict: deciding ratio(N) -> 1 against the imp-96487 ~0.985 plateau is out of reach within the compute ceiling',
  definition:
    'The RH-vs-plateau centerline gap is gapFull = 1 - 0.984564 = 0.015436 (imp-96487 fitted ' +
    'plateau). This gap is only ~1.237x the per-rung scatter (sigma_scatter = 0.012477) and ' +
    '~1.743x the remainder-model residual (sigma_MB = 0.008855) -- a model-free floor: even at ' +
    'infinite N, a per-rung-scatter-limited reading can NEVER reach 2 sigma, so any decision ' +
    'requires averaging many rungs, exactly where the imp-96487 low-frequency drift/remainder ' +
    'degeneracy bites.',
  reachProjection:
    'Under the optimistic SE-of-mean model (SE = sigma/sqrt(m), IGNORING the degeneracy, so a ' +
    'LOWER bound on the true reach): the most optimistic corner (z=2 confidence, fastest 1/L^2 ' +
    'drift decay, tightest sigma_MB noise) needs N ~ 2.736e5 -- ~1.44 orders of magnitude beyond ' +
    'the imp-96352 N ~ 9916 compute ceiling. A representative 3-sigma decision under a slower ' +
    '1/logN drift needs N ~ 1.602e7 -- ~3.21 orders beyond the ceiling, over a log-N window ~3x ' +
    'wider than the one measured.',
  status:
    'The gap (0.0154) is only ~1.24x the per-rung scatter, so no accessible or foreseeable Gram ' +
    'ladder can separate ratio(N) -> 1 from the plateau; the imp-96487 ~1.9x plateau preference ' +
    'is not overturnable by more Route M Gram compute on this observable.',
});

export const IMP96601_ROUTE_M_REACH_VERDICT_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96601',
  proofSection: 'S-frontier',
  glosses: 'imp-96569',
  scopes: 'imp-96487',
  question:
    'imp-96569 projected the log-N reach needed to decide whether the Route M Burnol-normalized ' +
    'ratio(N) converges to 1 against the imp-96487 finite-N plateau at ~0.985. What is the ' +
    'verdict and its headline reach figures, for a reader landing on imp-96569 cold?',
  headword: ROUTE_M_REACH_VERDICT_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96569 verdict: ' +
    'deciding ratio(N) -> 1 against the imp-96487 ~0.985 plateau is out of reach under every ' +
    'drift exponent and confidence target considered -- the minimum projected reach is ' +
    'N ~ 2.7e5 (~1.4 orders beyond the N ~ 9916 ceiling) and a 3-sigma decision needs N ~ 1.6e7 ' +
    '(~3.2 orders beyond). The model-free floor (gap 0.0154 is only ~1.24x the per-rung scatter) ' +
    'is decisive on its own. Establishes nothing; instantiates no interval; moves no bound; ' +
    'measurement/projection only, NOT an RH bound; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-96569 (reach projection and headline figures); imp-96487 (plateau centerline 0.984564 ' +
    'and fluctuation scales); imp-96352 (compute ceiling N ~ 9916); imp-96436 (companion ' +
    'headword for the underlying imp-96105 plateau finding).',
});

export default IMP96601_ROUTE_M_REACH_VERDICT_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96601_ROUTE_M_REACH_VERDICT_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96601-headword-has-required-fields',
    why: 'The headword must name the gap, the two headline reach figures, and the out-of-reach verdict -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP96601_ROUTE_M_REACH_VERDICT_GLOSSARY_HEADWORD.headword;
      return (
        /0\.015436/.test(h.definition) &&
        /1\.237/.test(h.definition) &&
        /2\.736e5/.test(h.reachProjection) &&
        /1\.602e7/.test(h.reachProjection) &&
        /1\.24x/.test(h.status)
      );
    },
  },
  {
    id: 'imp96601-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96601_ROUTE_M_REACH_VERDICT_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96601_ROUTE_M_REACH_VERDICT_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96601_ROUTE_M_REACH_VERDICT_GLOSSARY_HEADWORD.verdict) &&
      IMP96601_ROUTE_M_REACH_VERDICT_GLOSSARY_HEADWORD.glosses === 'imp-96569' &&
      IMP96601_ROUTE_M_REACH_VERDICT_GLOSSARY_HEADWORD.scopes === 'imp-96487',
  },
];

for (const assertion of IMP96601_ROUTE_M_REACH_VERDICT_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-96601-route-m-reach-verdict-glossary-headword assertion failed: ${assertion.id}`);
  }
}
