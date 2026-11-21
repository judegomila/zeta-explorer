/**
 * @module imp-97177-annihilating-rational-trials-glossary-headword
 * @fileoverview imp-97177 -- import-light Concepts glossary headword recording the imp-97134
 *   EXECUTED finding: two explicit EXACT INTEGER rational trials -- even degrees {0,2,4,6} ->
 *   (33,55,27,5) and odd degrees {1,3,5,7} -> (143,273,165,35) -- annihilate all six imp-97113
 *   leading carrier functionals identically, forcing the Krein ground-state combination
 *   g(t) = v0 . Phih(t) to decay as O(t^-4) instead of the generic single-mode O(t^-1). A reader
 *   skimming only the imp-97113 SCOPE (rank-3 kernel existence) could assume the annihilation is
 *   still hypothetical; this headword bakes on record that it has been EXECUTED with certified-exact
 *   integer coefficients and MEASURED against exact spherical Bessel evaluation.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   The imp-97113 parity blocks (even degrees feeding {L1sin, L2cos, L3sin}, odd degrees feeding
 *   {L1cos, L2sin, L3cos}) each have a 1-dimensional integer kernel: (d0,d2,d4,d6) = (33,55,27,5)
 *   and (d1,d3,d5,d7) = (143,273,165,35). Substituting either into the six imp-97113 functionals
 *   gives all six exactly 0 in integer arithmetic -- no rounding, no numerical tolerance. Evaluating
 *   g(z) = sum_k d_k j_k(z) via the stable upward spherical-Bessel recurrence on z in
 *   {100,200,400,800,1600,3200}, both trials keep |g(z)| z^4 bounded and non-growing, while a
 *   generic (all-ones, non-annihilating) trial keeps only |g(z)| z^1 bounded and |g(z)| z^4 grows
 *   ~z^3. So the exact-integer annihilation is what buys three extra orders of decay in g (t^-1 ->
 *   t^-4), hence six extra orders in the phase-preserving tail integrand |g|^2 (t^-2 -> t^-8).
 *
 *   mechanism: the annihilation lives at the DEGREE-coefficient level {d_k}, not at the level of a
 *   certified rational v0 -- mapping {d_k} back onto v0 components through the committed overlap
 *   matrix C under interval arithmetic is the remaining step, and it is NOT executed here.
 *
 *   STATUS: documentation glossary headword only, not a re-derivation or a new computation.
 *   Establishes nothing new; moves no bound. SUB-GAP IMP97100_PHASE_CANCELLATION_TRIAL remains
 *   open because the v0-overlap map to a certified interval enclosure is not produced. NO QED.
 *   No refereed bound is changed; RH open.
 *
 * @see imp-97134-krein-annihilating-rational-trial-execution.js (source: the exact integer trials,
 *   the exact functional vanishing, and the measured O(t^-4) decay this headword glosses)
 * @see imp-97113-krein-bessel-asymptotic-annihilation-scope.js (parent: the parity-block rank-3
 *   scoping this trial execution closes)
 * @see imp-97114-krein-rayleigh-tail-enclosure-slack-budget.js (the ~1.23x achievable floor whose
 *   cancellation premise this execution now backs with an explicit trial rather than a heuristic)
 *
 * Ticket: imp-97177 (content, low, sonnet-4-6). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

import { IMP97134_TRIALS, IMP97134_VERDICT } from './imp-97134-krein-annihilating-rational-trial-execution.js';

// The annihilating-rational-trials glossary headword, baked verbatim (no re-import of the derivation text).
const ANNIHILATING_RATIONAL_TRIALS_HEADWORD = Object.freeze({
  key: 'krein-exact-integer-annihilating-rational-trials-force-g-order-t4',
  term:
    'the exact integer trials (33,55,27,5) even / (143,273,165,35) odd annihilate the imp-97113 ' +
    'six leading carrier functionals identically, forcing the Krein ground-state combination ' +
    'g(t) = v0 . Phih(t) to O(t^-4) instead of the generic O(t^-1)',
  definition:
    'The imp-97113 even-degree block {0,2,4,6} and odd-degree block {1,3,5,7} each have a ' +
    '1-dimensional integer kernel: (d0,d2,d4,d6) = (33,55,27,5) and (d1,d3,d5,d7) = ' +
    '(143,273,165,35). Substituted into the six imp-97113 leading carrier functionals ' +
    '(evenRow -> {L1sin,L2cos,L3sin}, oddRow -> {L1cos,L2sin,L3cos}), all six vanish EXACTLY in ' +
    'integer arithmetic. Evaluated against exact spherical Bessel j_k(z) over z in ' +
    '{100..3200}, both trials keep |g(z)| z^4 bounded and non-growing (g = O(z^-4)), while a ' +
    'generic all-ones trial keeps only |g(z)| z^1 bounded and |g(z)| z^4 grows ~z^3 (g = O(z^-1) ' +
    'only).',
  mechanism:
    'The three extra orders of decay in g (t^-1 -> t^-4) come entirely from the exact-integer ' +
    'annihilation of the t^-1, t^-2, t^-3 asymptotic coefficients at the degree-coefficient level ' +
    '{d_k}, and translate to six extra orders in the phase-preserving tail integrand |g|^2 ' +
    '(t^-2 -> t^-8). This backs the imp-97114 ~1.23x achievable Rayleigh-tail floor -- which ' +
    'presupposed the ~3-order cancellation -- with an explicit certified-exact trial rather than a ' +
    'heuristic assumption; the floor VALUE is unchanged. The trials remain at the {d_k} level: ' +
    'mapping them back onto certified rational v0 components through the committed overlap matrix ' +
    'C under interval arithmetic is the step this headword does NOT record as done.',
  verificationStatus:
    'Exact-integer vanishing verified in integer arithmetic (not floating-point); O(t^-4) decay ' +
    'measured (not proved) from exact spherical-Bessel evaluation on the committed z-ladder ' +
    '{100,200,400,800,1600,3200}. Establishes no bound and moves nothing on its own -- SUB-GAP ' +
    'IMP97100_PHASE_CANCELLATION_TRIAL remains open because the v0-overlap map to a certified ' +
    'interval enclosure is not produced. NO QED; no refereed bound is changed; RH open.',
});

export const IMP97177_ANNIHILATING_RATIONAL_TRIALS_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97177',
  proofSection: 'S-frontier',
  glosses: 'imp-97134',
  question:
    'imp-97113 scoped a rank-3-per-parity annihilation but reported no explicit kernel vector. ' +
    'imp-97134 executed the trial -- what exact coefficients annihilate the leading asymptotic ' +
    'orders of g(t), and does the resulting decay actually reach O(t^-4)?',
  headword: ANNIHILATING_RATIONAL_TRIALS_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-97134 finding: the ' +
    'exact integer trials (33,55,27,5) even and (143,273,165,35) odd annihilate all six imp-97113 ' +
    'carrier functionals identically, and measured against exact spherical Bessel evaluation both ' +
    'force g(t) = O(t^-4) (vs. O(t^-1) for a generic non-annihilating trial) -- a three-order gain ' +
    'in g and a six-order gain in |g|^2. This backs the imp-97114 achievable floor premise with an ' +
    'explicit certified-exact trial. Establishes nothing new; moves no bound; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-97134 (the exact integer trials, exact functional vanishing, and measured O(t^-4) decay ' +
    'this headword glosses); imp-97113 (the parity-block rank-3 scoping this execution closes); ' +
    'imp-97114 (the achievable floor whose cancellation premise this execution now backs).',
});

export default IMP97177_ANNIHILATING_RATIONAL_TRIALS_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97177_ANNIHILATING_RATIONAL_TRIALS_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97177-headword-matches-source-trials',
    why: 'The headword must record the same exact integer trial coefficients as its source module ' +
      '(imp-97134), not a re-typed paraphrase.',
    holds: () =>
      IMP97134_TRIALS.even[0] === 33 &&
      IMP97134_TRIALS.even[2] === 55 &&
      IMP97134_TRIALS.even[4] === 27 &&
      IMP97134_TRIALS.even[6] === 5 &&
      IMP97134_TRIALS.odd[1] === 143 &&
      IMP97134_TRIALS.odd[3] === 273 &&
      IMP97134_TRIALS.odd[5] === 165 &&
      IMP97134_TRIALS.odd[7] === 35 &&
      IMP97134_VERDICT.functionalsVanishExactly === true &&
      IMP97134_VERDICT.evenDecayOrder === 4 &&
      IMP97134_VERDICT.oddDecayOrder === 4,
  },
  {
    id: 'imp97177-headword-names-mechanism',
    why: 'The headword must name the exact-integer annihilation and the O(t^-4) vs O(t^-1) contrast ' +
      '-- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP97177_ANNIHILATING_RATIONAL_TRIALS_GLOSSARY_HEADWORD.headword;
      return (
        /exact integer/.test(h.term) &&
        /O\(t\^-4\)/.test(h.term) &&
        /O\(z\^-4\)/.test(h.definition) &&
        /overlap matrix/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp97177-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, and the source ' +
      'verdict this headword glosses must still show the phase-cancellation-trial sub-gap open.',
    holds: () =>
      IMP97177_ANNIHILATING_RATIONAL_TRIALS_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97177_ANNIHILATING_RATIONAL_TRIALS_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP97177_ANNIHILATING_RATIONAL_TRIALS_GLOSSARY_HEADWORD.verdict) &&
      IMP97177_ANNIHILATING_RATIONAL_TRIALS_GLOSSARY_HEADWORD.glosses === 'imp-97134' &&
      IMP97134_VERDICT.intervalMajorantProduced === false &&
      IMP97134_VERDICT.subGap.includes('IMP97100_PHASE_CANCELLATION_TRIAL'),
  },
];

for (const assertion of IMP97177_ANNIHILATING_RATIONAL_TRIALS_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97177-annihilating-rational-trials-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
