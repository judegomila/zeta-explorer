/**
 * @module imp-97129-krein-rayleigh-tail-phase-cancellation-glossary-headword
 * @fileoverview imp-97129 -- import-light Concepts glossary headword recording the imp-97100
 *   MEASURED CANCELLATION DEPTH finding: the Krein Rayleigh-tail residual <v0|R_T|v0> is small
 *   ONLY because of ~3-order inter-mode PHASE CANCELLATION in the ground-state combination
 *   g(t) = v0 . Phih(t), not because any individual spherical-Bessel mode decays fast. A reader
 *   skimming the ~15-order recovery imp-96888/imp-96973 report vs. the trace/lammax bounds could
 *   assume it comes from ordinary per-mode decay; this headword bakes on record why that
 *   assumption is wrong and why mode-wise (Route A) interval bounds are structurally vacuous.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   Each spherical Bessel mode j_k(a t) ~ 1/(a t) decays only like t^{-1}, so the trace-diagonal
 *   sum_j |Phih_j(t)|^2 ~ N t^{-2} and sigma_2(t) * (that) ~ t^2 ln t DIVERGES as t -> infinity --
 *   this is exactly why the trace bound Tr(B^-1 R_T) and the Weyl bound lambda_max(R_T) are vacuous
 *   (imp-96973). Yet the min-max Rayleigh quotient <v0|R_T|v0> for the actual ground state v0
 *   converges, measured from the committed imp-96888 T-ladder (T in {4800,6400,9600}, N=100,
 *   2a=ln3) as <v0|R_T|v0> ~ T^{-p} with p ~ 2.91 (pLow=2.9472, pHigh=2.8890, pEndpoint=2.9131).
 *   With sigma_2(t) ~ t^4 (up to a bounded log/digamma factor), this forces the ground-state
 *   combination itself to decay as |g(t)| ~ t^{-(p+5)/2} ~ t^{-3.96} ~ t^{-4} -- roughly THREE
 *   orders faster than any single mode's t^{-1}. That gap (cancellation depth (p+5)/2 - 1 ~ 2.96)
 *   is not extra decay of any one term: it is inter-mode PHASE CANCELLATION across all N modes in
 *   the specific ground-state combination, dispersed by the trace and destroyed by any bound that
 *   splits the sum before squaring (triangle-inequality Route A). This is exactly why a rigorous
 *   interval majorant needs a phase-preserving enclosure of g(t) as one entity (Route B), or a
 *   trial vector with CERTIFIED t^{-4} decay (Route C) -- not a mode-wise envelope.
 *
 *   STATUS: documentation glossary headword only, not a re-derivation or a new computation.
 *   Establishes nothing new; moves no bound. The imp-97100 residual (a fixed rational trial vector
 *   with certified g(t) = O(t^{-4}) decay, SUB-GAP IMP97100_PHASE_CANCELLATION_TRIAL) remains open.
 *   NO QED. No refereed bound is changed; RH open.
 *
 * @see imp-97100-krein-rayleigh-tail-interval-majorant-assessment.js (source: the measured
 *   cancellation depth, the route assessment, and the named residual this headword glosses)
 * @see imp-96888-krein-tresidual-rayleigh-permode-bound.js (parent: the min-max Rayleigh bound and
 *   the T-ladder the decay exponent is measured from)
 * @see imp-96973-krein-tailtrace-vacuity-factorisation.js (the trace/lammax vacuity this
 *   phase-cancellation finding explains structurally)
 *
 * Ticket: imp-97129 (content, low, sonnet-4-6). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

import { IMP97100_TAIL_DECAY, IMP97100_VERDICT } from './imp-97100-krein-rayleigh-tail-interval-majorant-assessment.js';

// The phase-cancellation glossary headword, baked verbatim (no re-import of the derivation text).
const RAYLEIGH_TAIL_PHASE_CANCELLATION_HEADWORD = Object.freeze({
  key: 'krein-rayleigh-tail-inter-mode-phase-cancellation',
  term:
    'the Krein Rayleigh-tail residual <v0|R_T|v0> is small ONLY through ~3-order inter-mode PHASE ' +
    'CANCELLATION in the ground-state combination g(t) = v0 . Phih(t), not single-mode decay',
  definition:
    'Each spherical-Bessel mode j_k(a t) ~ 1/(a t) decays only like t^{-1}, so the trace-diagonal ' +
    'sum_j |Phih_j(t)|^2 ~ N t^{-2} and sigma_2(t) * (that) ~ t^2 ln t DIVERGES -- exactly why the ' +
    'trace bound Tr(B^-1 R_T) and Weyl bound lambda_max(R_T) are vacuous. The actual min-max ' +
    'Rayleigh quotient <v0|R_T|v0> converges instead, measured from the committed T-ladder as ' +
    '~T^{-p} with p ~ 2.91; since sigma_2 ~ t^4, this forces |g(t)| ~ t^{-(p+5)/2} ~ t^{-4}, roughly ' +
    'THREE orders faster than any single mode.',
  mechanism:
    'The (p+5)/2 - 1 ~ 2.96 order gap between the ground-state combination g(t) and an individual ' +
    'mode is not extra per-term decay -- it is phase cancellation across all N modes in the specific ' +
    'combination, which the trace disperses and destroys as soon as a bound splits the sum before ' +
    'squaring (the mode-wise triangle bound, Route A, is REJECTED for exactly this reason: it ' +
    're-loses the ~15 orders imp-96888/imp-96973 recover and reproduces the trace vacuity). A ' +
    'rigorous interval majorant instead needs g(t) enclosed as ONE entity, phase-preserving (Route ' +
    'B, viable), or a trial vector with CERTIFIED t^{-4} decay (Route C, conditional).',
  verificationStatus:
    'Cancellation depth measured (not proved) from the committed imp-96888 T-ladder (three rungs, ' +
    'T in {4800,6400,9600}): p ~ 2.91, gDecayOrder ~ 3.96, cancellationDepth ~ 2.96. Establishes no ' +
    'bound and moves nothing on its own -- the residual (a fixed rational trial with certified ' +
    'g(t) = O(t^{-4}) decay, IMP97100_PHASE_CANCELLATION_TRIAL) remains open. NO QED; no refereed bound is changed' +
    '; RH open.',
});

export const IMP97129_RAYLEIGH_TAIL_PHASE_CANCELLATION_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97129',
  proofSection: 'S-frontier',
  glosses: 'imp-97100',
  question:
    'imp-96888/imp-96973 report that the Rayleigh quotient <v0|R_T|v0> recovers ~15 orders vs. the ' +
    'trace/Weyl bounds. Is that recovery ordinary single-mode decay, or something structurally ' +
    'different -- and why does that make mode-wise interval bounds vacuous?',
  headword: RAYLEIGH_TAIL_PHASE_CANCELLATION_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-97100 finding: the ' +
    'Rayleigh-tail smallness comes ENTIRELY from ~3-order inter-mode phase cancellation in the ' +
    'ground-state combination g(t), measured at cancellation depth ~2.96 from the committed T-ladder ' +
    '-- not from any individual spherical-Bessel mode decaying fast (each decays only t^{-1}). This ' +
    'is why the mode-wise triangle bound (Route A) is structurally vacuous (it discards phase before ' +
    'squaring) and why a rigorous interval majorant needs a phase-preserving enclosure or a trial ' +
    'vector with certified t^{-4} decay. Establishes nothing new; moves no bound; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-97100 (the full route assessment, measured cancellation depth, and named residual this ' +
    'headword glosses); imp-96888 (the min-max Rayleigh bound and T-ladder the decay exponent is ' +
    'measured from); imp-96973 (the trace/lammax vacuity this finding explains structurally).',
});

export default IMP97129_RAYLEIGH_TAIL_PHASE_CANCELLATION_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97129_RAYLEIGH_TAIL_PHASE_CANCELLATION_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97129-headword-matches-source-decay',
    why: 'The headword must record the same measured decay exponent and cancellation depth as its ' +
      'source module (imp-97100), not a re-typed paraphrase.',
    holds: () =>
      IMP97100_TAIL_DECAY.cancellationDepth > 2.8 &&
      IMP97100_TAIL_DECAY.cancellationDepth < 3.1 &&
      IMP97100_TAIL_DECAY.gDecayOrder > 3.8 &&
      IMP97100_TAIL_DECAY.gDecayOrder < 4.1 &&
      IMP97100_VERDICT.obstructionIsPhaseCancellation === true,
  },
  {
    id: 'imp97129-headword-names-mechanism-and-routes',
    why: 'The headword must name the inter-mode phase cancellation mechanism and the Route A ' +
      'rejection -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP97129_RAYLEIGH_TAIL_PHASE_CANCELLATION_GLOSSARY_HEADWORD.headword;
      return (
        /PHASE CANCELLATION/.test(h.term) &&
        /inter-mode/.test(h.definition) &&
        /Route A/.test(h.mechanism) &&
        /t\^\{-4\}/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp97129-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, and the source ' +
      'verdict this headword glosses must still show the phase-cancellation residual as unresolved.',
    holds: () =>
      IMP97129_RAYLEIGH_TAIL_PHASE_CANCELLATION_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97129_RAYLEIGH_TAIL_PHASE_CANCELLATION_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP97129_RAYLEIGH_TAIL_PHASE_CANCELLATION_GLOSSARY_HEADWORD.verdict) &&
      IMP97129_RAYLEIGH_TAIL_PHASE_CANCELLATION_GLOSSARY_HEADWORD.glosses === 'imp-97100' &&
      IMP97100_VERDICT.intervalMajorantProduced === false &&
      IMP97100_VERDICT.rayleighTailMajorantOpen === true,
  },
];

for (const assertion of IMP97129_RAYLEIGH_TAIL_PHASE_CANCELLATION_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97129-krein-rayleigh-tail-phase-cancellation-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
