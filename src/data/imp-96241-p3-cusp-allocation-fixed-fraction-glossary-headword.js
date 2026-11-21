/**
 * @module imp-96241-p3-cusp-allocation-fixed-fraction-glossary-headword
 * @fileoverview imp-96241 -- import-light glossary/Concepts headword for the imp-96110 finding:
 *   the Route I Sonine-excess p = 2 half-cusp allocation f_out = 1 - 1/rho SURVIVES and GENERALIZES
 *   when p = 3 is adjoined, replicating across the dense {oo,2,3} S-unit set 2^a 3^b -- but this is
 *   an OBSTRUCTION, not a rescue, because the fixed fraction is now inherited across a DENSE family
 *   of log^2 cusps (one order worse than the single isolated log cusp at rho = 2), amplifying rather
 *   than removing the excess obstruction that already killed the CC route past ln2.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96110 ported the in/out cusp decomposition of the Route I Sonine excess from S = {oo,2} to
 *   S = {oo,2,3} and found a two-part result easy to misread in isolation: the allocation LAW itself
 *   holds up cleanly (f_out(rho) -> 1 - 1/rho at every S-unit, exactly generalizing the single p = 2
 *   point), which on its own could look like good news for the compact-Toeplitz method. A reader
 *   landing on that module cold needs a quick-lookup entry stating plainly why the surviving law is
 *   nonetheless the reason the foothold is LOST (density + one extra cusp order), not evidence that
 *   it is regained. This headword bakes that verdict verbatim (no re-import of the imp-96110 module,
 *   to stay import-light) as a standalone lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   f_out(rho), the fraction of the delta_S23 cusp at an S-unit rho = 2^a 3^b that lands in the
 *   excess eps_S23 (with 1/rho going to the confined part delta^in_23), converges to EXACTLY
 *   1 - 1/rho at every such S-unit -- the same law as the single p = 2 point of Theorem 4
 *   (rh-route-i-sonine-excess-semilocal-port), now replicated across the dense two-parameter set.
 *   Measured examples: rho = 3 -> 0.6667, rho = 9 -> 0.8889, rho = 3/2 -> 0.3333, rho = 4/3 -> 0.25,
 *   rho = 9/8 -> 0.1111. The p = 2 in/out method itself is independently validated (f_out -> 1 - 2^-k
 *   at rho = 2/4/8 to five digits).
 *
 *   WHY THIS IS AN OBSTRUCTION, NOT A RESCUE
 *   -----------------------------------------------
 *   Adjoining p = 3 does not break the fixed-fraction structure -- it AMPLIFIES the obstruction by
 *   spreading that same fraction over a DENSE family of LOG^2 cusps (the S-units 2^a 3^b are dense
 *   in R_+; imp-96226 derives this order via a free-lattice-axis count -- one free geometric ladder
 *   per adjoined prime, so cusp order = k = #(finite primes in S): log^1 for S = {oo,2}, log^2 for
 *   S = {oo,2,3}). This is one singularity order worse than the single isolated log cusp of delta_S
 *   at rho = 2 that already killed the Connes-Consani route past ln2 (Theorem 5). So E_S23 o Q is
 *   the Hadamard finite part of a DENSE set of 1/x^2-log-type singularities, strictly worse-behaved
 *   than the S = {oo,2} case, confirming the many-prime warning of the trace-identity module from
 *   the excess side.
 *
 *   STATUS: measurement/derivation, not a theorem. corr23 continuity through the dense log^2 cusps
 *   is ASSUMED by analogy with the validated p = 2 case, NOT proved (imp-96110 honest-status
 *   banner). The from-below convergence to 1 - 1/rho was confirmed uniform across the dense set
 *   after removing a truncation artifact (imp-96208), and the log^2 order was independently derived
 *   (imp-96226), but no uniform remainder bound promotes either to a rigorous theorem.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96110 verdict for quick reference. It establishes
 *   nothing, instantiates no interval, closes no sub-gap, moves no bound. imp-2519 no-overclaim
 *   guard preserved; NO QED. No refereed bound is changed.
 *
 * @see imp-96110-route-i-p3-cusp-allocation-fixed-fraction-assessment (source: the f_out = 1 - 1/rho finding and obstruction verdict this glosses)
 *
 * Ticket: imp-96241 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The p = 3 cusp-allocation-generalization headword, baked verbatim (no re-import).
const P3_CUSP_ALLOCATION_FIXED_FRACTION_HEADWORD = Object.freeze({
  key: 'route-i-p3-cusp-allocation-fixed-fraction-generalization',
  term: 'Route I Sonine-excess p = 3 cusp-allocation generalization (f_out = 1 - 1/rho, dense log^2 amplification)',
  definition:
    'The out-fraction f_out(rho) of the Route I Sonine excess (the share of the delta_S23 cusp at ' +
    'an S = {oo,2,3} S-unit rho = 2^a 3^b landing in eps_S23, rather than the confined part ' +
    'delta^in_23) converges to EXACTLY 1 - 1/rho at every such S-unit -- generalizing, not ' +
    'breaking, the single p = 2 point (Theorem 4: half of the cusp at rho = 2) across the dense ' +
    'two-parameter S-unit set.',
  obstruction:
    'This survival is an OBSTRUCTION, not a rescue: adjoining p = 3 lifts the isolated log cusp of ' +
    'delta_S at the single point rho = 2 to a DENSE family of log^2 cusps (one free geometric-ladder ' +
    'axis per adjoined prime, so cusp order = #(finite primes in S)), and delta^out_23 keeps the FULL ' +
    'log^2 order (leading coefficient (1 - 1/rho) times the log^2 constant, not a lower-order ' +
    'remnant). E_S23 o Q is therefore the Hadamard finite part of a dense set of 1/x^2-log-type ' +
    'singularities, strictly worse-behaved than the single p = 2 log resonance that already killed ' +
    'the Connes-Consani compact-Toeplitz route past ln2.',
  verificationStatus:
    'Measurement/derivation, not a theorem: the p = 2 in/out method is validated exactly ' +
    '(f_out -> 1 - 2^{-k} at rho = 2/4/8 to five digits); the 1 - 1/rho law and its uniform ' +
    'from-below convergence across the dense set were confirmed after removing a truncation ' +
    'artifact; the log^2 cusp order was independently derived via a free-lattice-axis count. ' +
    'corr23 continuity through the dense cusps remains ASSUMED by analogy, NOT proved.',
});

export const IMP96241_P3_CUSP_ALLOCATION_FIXED_FRACTION_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96241',
  proofSection: 'S-frontier',
  glosses: 'imp-96110',
  question:
    'imp-96110 found that the Route I Sonine-excess half-cusp allocation at p = 2 survives and ' +
    'generalizes to f_out = 1 - 1/rho when p = 3 is adjoined. Why is this survival an obstruction ' +
    'rather than a rescue, for a reader landing on that module cold?',
  headword: P3_CUSP_ALLOCATION_FIXED_FRACTION_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96110 verdict: the ' +
    'fixed-fraction allocation f_out = 1 - 1/rho survives and generalizes across the dense ' +
    '{oo,2,3} S-unit set, but the compact-Toeplitz foothold is lost because that fraction is now ' +
    'inherited across a DENSE family of log^2 cusps (one order worse than the isolated p = 2 log ' +
    'cusp) -- the excess obstruction is AMPLIFIED and made dense, not removed. corr23 continuity ' +
    'ASSUMED, not proved. Establishes nothing; instantiates no interval; moves no bound; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-96110 (the f_out = 1 - 1/rho finding and obstruction verdict this glosses); imp-96208 ' +
    '(confirms the from-below convergence is uniform, not a truncation artifact); imp-96226 ' +
    '(derives the log^2 cusp order via the free-lattice-axis count).',
});

export default IMP96241_P3_CUSP_ALLOCATION_FIXED_FRACTION_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96241_P3_CUSP_ALLOCATION_FIXED_FRACTION_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96241-headword-has-required-fields',
    why: 'The headword must name the exact f_out = 1 - 1/rho generalization, the dense log^2 amplification mechanism, and the not-proved corr23 continuity status -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP96241_P3_CUSP_ALLOCATION_FIXED_FRACTION_GLOSSARY_HEADWORD.headword;
      return (
        /1 - 1\/rho/.test(h.definition) &&
        /dense/i.test(h.obstruction) &&
        /log\^2/.test(h.obstruction) &&
        /NOT proved/i.test(h.verificationStatus)
      );
    },
  },
  {
    id: 'imp96241-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96241_P3_CUSP_ALLOCATION_FIXED_FRACTION_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96241_P3_CUSP_ALLOCATION_FIXED_FRACTION_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96241_P3_CUSP_ALLOCATION_FIXED_FRACTION_GLOSSARY_HEADWORD.verdict) &&
      IMP96241_P3_CUSP_ALLOCATION_FIXED_FRACTION_GLOSSARY_HEADWORD.glosses === 'imp-96110',
  },
];

for (const assertion of IMP96241_P3_CUSP_ALLOCATION_FIXED_FRACTION_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96241-p3-cusp-allocation-fixed-fraction-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
