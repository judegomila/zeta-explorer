/**
 * @module imp-97450-route-m-crossover-scale-glossary-headword
 * @fileoverview imp-97450 -- import-light glossary/Concepts headword recording the imp-97419
 *   Route M boundary-to-bulk CROSSOVER SCALE result: the two-variable Vasyunin coefficient I(a,b)'s
 *   small-a linearization I_lin(a,b) = (a/2) log(b/a) + (C+1/2) a crosses over to the full bulk
 *   profile b f(a/b) at a scale A(b) = x*(eps) b that is LINEAR in b, with the fraction x*(eps)
 *   B-INDEPENDENT to 3-4 digits (x*(2%) ~ 0.3311, x*(1%) ~ 0.199).
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) THE RESULT. imp-97419 measured the relative deviation (I - I_lin)/I of the exact symmetric
 *   Vasyunin coefficient I(a,b) from its linearized small-x truncation I_lin at FIXED x = a/b, and
 *   found it CONVERGES to a b-independent limit as b -> infinity (e.g. x = 0.33 gives 1.72e-2
 *   dead-flat across b = 2000..16000). Consequently the crossover scale A(b) -- the largest a for
 *   which I_lin holds to a fixed relative tolerance eps -- is A(b) = x*(eps) b, LINEAR in b, with
 *   x*(2%) = 0.3320, 0.3315, 0.3312, 0.3311, 0.3311 across b = 1000..16000 (dead flat) and
 *   x*(1%) ~ 0.199.
 *   (b) WHY IT IS NEW. imp-97329 measured the bulk profile I(x b, b) = b f(x) + o(b) but left the
 *   boundary-to-bulk crossover scale A(b) explicitly UNKNOWN ("the two regimes meet at a crossover
 *   scale a ~ A(b)", imp-97329 RESULT 2). imp-97419 settles it: the crossover of the COEFFICIENT I
 *   itself is a FIXED FRACTION of b, not the naive sub-linear "A(b) ~ b/log^2 b" heuristic (which
 *   describes a DIFFERENT crossover, internal to the second-moment summand h(x) = [f(x)/x]^2).
 *   (c) WHY IT MATTERS. Because A(b) is LINEAR, the small-a boundary layer is a fixed fraction of
 *   the a-terms in Q(b) = Sum I(a,b)^2/a^2, not a vanishing slice -- so there is NO distinguished
 *   sub-linear scale in I on which a separate sub-leading form of g(b) = Q(b) - s0 b could hang. This
 *   confirms and sharpens the collinearity between the b^(1/2) and log^2 b candidates for g(b)
 *   already seen in imp-97329/imp-97398/imp-97397.
 *   (d) WHY IT DOES NOT PIN B*. The linear crossover only characterizes WHERE the two regimes of I
 *   meet, not the exact bulk coefficient s0 or the endpoint curvature; B* = 2 Sum g(b)/b^2 stays
 *   unpinned and the b^(1/2) vs log^2 b separation stays degenerate.
 *   (e) STATUS: documentation only. No bound moved; no coefficient pinned; the rigorous anchor stays
 *   the trace ceiling T = 2.594e7; compute (N ~ 9916) binds first by >2600x; NO QED.
 *
 *   STATUS: documentation only -- a Concepts glossary headword recording an already-established
 *   result. Not a new derivation. NO QED.
 *
 * @see imp-97419-route-m-uniform-profile-crossover-scale.js (source: the crossover-scale
 *   measurement this headword names, A(b) = x* b, x*(2%) = 0.3311)
 * @see imp-97329-route-m-uniform-crossover-second-moment.js (bulk profile b f(x); left A(b)
 *   unknown -- settled here as linear)
 * @see imp-97330-route-m-smalla-intercept-closed-form.js (d_a closed form, the fixed-a pin
 *   extended by the crossover-scale result)
 * @see imp-97311-route-m-bettin-conrey-smalla-kappa-moment.js (kappa_a = a/2, the naive
 *   b/log^2 b heuristic this result supersedes)
 *
 * Ticket: imp-97450 (content, low, sonnet-4-6). Documentation only; establishes nothing new;
 * NO QED; no refereed bound is changed.
 */

// The crossover-scale headword, baked verbatim (no re-import).
const ROUTE_M_CROSSOVER_SCALE_HEADWORD = Object.freeze({
  key: 'route-m-uniform-profile-crossover-scale-imp97419',
  term:
    'Route M boundary-to-bulk crossover scale A(b): the scale at which the Vasyunin coefficient ' +
    'I(a,b) crosses over from its small-a linearization to the full bulk profile, measured LINEAR ' +
    'in b with a b-independent fraction',
  definition:
    'For the exact symmetric Vasyunin coefficient I(a,b), the small-x linearized profile ' +
    'I_lin(a,b) = (a/2) log(b/a) + (C+1/2) a agrees with I(a,b) to a fixed relative tolerance eps ' +
    'only up to a crossover scale a ~ A(b). imp-97419 measured the relative deviation (I - I_lin)/I ' +
    'at FIXED x = a/b and found it converges to a b-independent limit as b -> infinity, so ' +
    'A(b) = x*(eps) b is LINEAR in b, with x*(2%) = 0.3311 and x*(1%) ~ 0.199, both stable to ' +
    '3-4 digits across b = 1000..16000.',
  mechanism:
    'imp-97329 left the boundary-to-bulk crossover scale of I(a,b) explicitly unknown. Rather than ' +
    'the naive sub-linear heuristic A(b) ~ b/log^2 b (which comes from equating boundary-layer mass ' +
    'in the SECOND-MOMENT summand h(x) = [f(x)/x]^2 to the bulk term, and describes a different ' +
    'crossover), the crossover of I itself is a FIXED FRACTION of b. Because it is linear, the ' +
    'small-a boundary layer is a fixed fraction of the a-terms in Q(b), not a vanishing slice, so ' +
    'there is no distinguished sub-linear scale in I to separate the collinear b^(1/2) vs log^2 b ' +
    'forms of g(b) = Q(b) - s0 b.',
  verificationStatus:
    'Re-cited from the imp-97419 derivation module ' +
    '(src/data/imp-97419-route-m-uniform-profile-crossover-scale.js), with the crossover fraction ' +
    'x*(2%) dead-flat (0.3320 -> 0.3311) across b = 1000..16000 and the relative deviation at fixed ' +
    'x = a/b b-convergent. B* = 2 Sum g(b)/b^2 stays unpinned; the b^(1/2) vs log^2 b separation ' +
    'stays degenerate (imp-97329/imp-97398/imp-97397). Naming / glossary headword only; supplies no ' +
    'new bound; RH open; no refereed bound is changed; NO QED.',
});

export const IMP97450_ROUTE_M_CROSSOVER_SCALE_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97450',
  proofSection: 'Route-M',
  glosses: 'imp-97419',
  question:
    'imp-97419 measured the boundary-to-bulk crossover scale A(b) of the Vasyunin coefficient ' +
    'I(a,b) as LINEAR in b with a b-independent fraction -- what is the headword for this result?',
  headword: ROUTE_M_CROSSOVER_SCALE_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names the imp-97419 crossover-scale ' +
    'result A(b) = x*(eps) b, LINEAR in b, with x*(2%) = 0.3311 and x*(1%) ~ 0.199 both ' +
    'b-independent to 3-4 digits -- superseding the naive sub-linear b/log^2 b heuristic, which ' +
    'described a different (second-moment-summand) crossover. No bound moved; B* stays unpinned; ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-97419 (the crossover-scale derivation this glosses); imp-97329 (the bulk profile that ' +
    'left A(b) unknown); imp-97330 (the fixed-a intercept closed form); imp-97311 (the naive ' +
    'b/log^2 b heuristic superseded here).',
});

export default IMP97450_ROUTE_M_CROSSOVER_SCALE_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97450_ROUTE_M_CROSSOVER_SCALE_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97450-headword-names-scale-and-fraction',
    why: 'The headword must name the crossover scale being linear, and the two measured ' +
      'b-independent fractions -- the entire content of the glossary entry.',
    holds: () => {
      const h = IMP97450_ROUTE_M_CROSSOVER_SCALE_GLOSSARY_HEADWORD.headword;
      return (
        /LINEAR/.test(h.definition) &&
        /0\.3311/.test(h.definition) &&
        /0\.199/.test(h.definition) &&
        /b\/log\^2 b/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp97450-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, glosses imp-97419.',
    holds: () =>
      IMP97450_ROUTE_M_CROSSOVER_SCALE_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97450_ROUTE_M_CROSSOVER_SCALE_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP97450_ROUTE_M_CROSSOVER_SCALE_GLOSSARY_HEADWORD.verdict) &&
      IMP97450_ROUTE_M_CROSSOVER_SCALE_GLOSSARY_HEADWORD.glosses === 'imp-97419',
  },
];

for (const assertion of IMP97450_ROUTE_M_CROSSOVER_SCALE_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97450-route-m-crossover-scale-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
