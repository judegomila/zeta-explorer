/**
 * @module imp-97675-omega10-cap-robustness-glossary-headword
 * @fileoverview imp-97675 -- import-light Concepts glossary headword for the imp-97647 term
 *   "omega=10 cap-robustness": the imp-97606 primorial-extremality gap at omega=10
 *   (+7.520579e-5, primorial p_10# vs its nearest non-primorial competitor) survives raising the
 *   imp-97432 kernel divisor cap from d<=1000 to d<=5000/10000, so it is NOT an artifact of that
 *   cap, and the Route-M MCM onset stays exactly omega=11 (mirrors the imp-97634 MCM-onset/b4-ceiling
 *   headword format).
 *
 *   HEADWORD -- OMEGA=10 CAP-ROBUSTNESS.
 *   -----------------------------------------------
 *   (a) DEFINITION. The imp-97432 kernel evaluates T(b) = surrogate(b) + Rcorr(b, cut) for a
 *   squarefree integer b, where Rcorr sums mu(d) Rexact(d)/d exactly over squarefree divisors
 *   d <= cut and bounds the omitted tail d > cut by Sum 1/(720 d^3). imp-97606 found the primorial
 *   p_10# = {2,3,5,7,11,13,17,19,23,29} strictly minimises T at omega=10 over 20437 squarefree
 *   prime sets, with the nearest non-primorial competitor {2,3,5,7,11,13,17,19,23,31} (top prime
 *   29 -> 31) landing +7.520579e-5 above it -- both measured at cut = 1000.
 *   (b) THE GAP IS CAP-ROBUST, NOT A TRUNCATION ARTIFACT. imp-97647 re-evaluated gap(cut) =
 *   Tfull(competitor,cut) - Tfull(primorial,cut) at cut in {1000, 5000, 10000}: it stays strictly
 *   positive and drifts by only about -1.3e-10 across the whole sweep (+7.520579e-5 ->
 *   +7.520567e-5 -> +7.520565e-5). The rigorous omitted-divisor tail budget at cut=1000
 *   (< 2.784e-11 primorial, < 2.897e-11 competitor) bounds the maximum the gap could shift under
 *   cut -> infinity by < 5.6805e-11, about 1.3 million times smaller than the gap -- the ordering
 *   cannot flip.
 *   (c) d<=1000 IS THE CORRECT CAP, NOT MERELY A SUFFICIENT ONE. Past d ~ 1000 the double-precision
 *   difference Rexact(d) = Gexact(d) - GKmain(d) is dominated by IEEE cancellation rather than the
 *   true remainder R(d) ~ +1/(720 d^2): the measured signal-to-noise ratio is ~139.5 at d=2000,
 *   ~5096 at d=5000, and wrong-signed at d=10000. So a larger cap injects cancellation noise, not
 *   additional tail signal; the small observed gap drift is itself that noise.
 *   (d) ONSET UNCHANGED. The MCM onset stays exactly omega=11 (imp-97583); the b/4 ceiling is not
 *   touched; kappa_arith is unchanged; no bound on Lambda moves.
 *
 *   STATUS: documentation only -- Concepts glossary headword recording an already-established
 *   Route-M robustness check. Not a proof, not a new bound. NO QED.
 *
 * @see imp-97647-route-m-mcm-omega10-cap-robustness.js (source: cap sweep d<=1000/5000/10000,
 *   tail-budget bound, Rexact noise ratios)
 * @see imp-97606-route-m-mcm-omega10-primorial-extremality-broadened.js (source of the
 *   +7.520579e-5 gap and the omega=10 primorial extremality)
 * @see imp-97432-route-m-mcm-hypothesis-refuted-ceiling-safe.js (kernel: T(b), Rcorr, divisor cap,
 *   1/(720 d^3) tail bound)
 * @see imp-97634-mcm-onset-b4-ceiling-glossary-headwords.js (sibling headword: MCM onset = omega=11)
 *
 * Ticket: imp-97675 (content, low, sonnet-4-6). Documentation only; establishes nothing new; NO QED;
 * no refereed bound is changed.
 */

import {
  IMP97647_OMEGA10_CAP_ROBUSTNESS,
  IMP97647_HONEST_BANNER,
} from './imp-97647-route-m-mcm-omega10-cap-robustness.js';

// Headword, baked verbatim from the imp-97647 measurement (no re-import of the full kernel).
const OMEGA10_CAP_ROBUSTNESS_HEADWORD = Object.freeze({
  key: 'omega10-cap-robustness-imp97647',
  term:
    'omega=10 cap-robustness: the imp-97606 primorial-extremality gap +7.520579e-5 at omega=10 ' +
    'is robust to the imp-97432 kernel divisor cap, not a d<=1000 truncation artifact',
  definition:
    'The primorial p_10# = {2,3,5,7,11,13,17,19,23,29} strictly minimises T(b) at omega=10 over ' +
    '20437 squarefree prime sets, +7.520579e-5 below its nearest non-primorial competitor ' +
    '{2,3,5,7,11,13,17,19,23,31} at the imp-97432 kernel divisor cap d<=1000. Re-evaluating at ' +
    'cut = 1000, 5000, 10000 keeps the gap strictly positive and drifts it by only ~-1.3e-10 ' +
    '(+7.520579e-5 -> +7.520567e-5 -> +7.520565e-5); the rigorous omitted-divisor tail budget ' +
    'bounds any cut -> infinity shift by < 5.6805e-11, about 1.3 million times smaller than the ' +
    'gap, so the ordering cannot flip.',
  mechanism:
    'Past d ~ 1000 the double-precision Rexact(d) = Gexact(d) - GKmain(d) is dominated by IEEE ' +
    'cancellation rather than the true remainder R(d) ~ +1/(720 d^2) (signal-to-noise ~139.5 at ' +
    'd=2000, ~5096 at d=5000, wrong-signed at d=10000), so a larger cap injects cancellation ' +
    'noise rather than tail signal -- d<=1000 is the correct, pre-cancellation cap, and the MCM ' +
    'onset stays exactly omega=11 with the b/4 ceiling untouched.',
  verificationStatus:
    'Re-cited from imp-97647 (cap-robustness re-evaluation) and imp-97606 (omega=10 primorial ' +
    'extremality, +7.520579e-5 gap). Naming / glossary headword only; supplies no new bound; RH ' +
    'open; no refereed bound is changed; NO QED.',
});

export const IMP97675_OMEGA10_CAP_ROBUSTNESS_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97675',
  proofSection: 'S-frontier',
  glosses: 'imp-97647',
  question:
    'Is the imp-97606 omega=10 primorial-extremality gap +7.520579e-5 a d<=1000 divisor-cap ' +
    'artifact, and does the MCM onset move?',
  headword: OMEGA10_CAP_ROBUSTNESS_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names the imp-97647 measurement: the ' +
    '+7.520579e-5 omega=10 primorial-extremality gap is robust across divisor caps d<=1000/5000/ ' +
    '10000 (drift < 1.4e-10, dwarfed by the < 5.6805e-11 rigorous tail-budget bound on any ' +
    'cut -> infinity shift) -- it is NOT a d<=1000 truncation artifact. The MCM onset stays ' +
    'exactly omega=11. No bound moved; NO QED. No refereed bound is changed.',
  citation:
    'imp-97647-route-m-mcm-omega10-cap-robustness.js (cap sweep, tail-budget bound, Rexact noise ' +
    'ratios); imp-97606-route-m-mcm-omega10-primorial-extremality-broadened.js (+7.520579e-5 gap).',
});

export default {
  omega10CapRobustness: IMP97675_OMEGA10_CAP_ROBUSTNESS_GLOSSARY_HEADWORD,
};

// -- Tripwire assertions ------------------------------------------------------
const IMP97675_ASSERTIONS = [
  {
    id: 'imp97675-headword-names-gap-and-cap-sweep',
    why: 'The headword must name the +7.520579e-5 gap, the cap sweep values, and the ' +
      'not-a-truncation-artifact conclusion.',
    holds: () => {
      const h = IMP97675_OMEGA10_CAP_ROBUSTNESS_GLOSSARY_HEADWORD.headword;
      return (
        /\+7\.520579e-5/.test(h.term) &&
        /\+7\.520579e-5/.test(h.definition) &&
        /\+7\.520567e-5/.test(h.definition) &&
        /\+7\.520565e-5/.test(h.definition) &&
        /5\.6805e-11/.test(h.definition) &&
        /not a d<=1000 truncation artifact/.test(h.term)
      );
    },
  },
  {
    id: 'imp97675-headword-names-onset-unchanged',
    why: 'The headword mechanism must record that the MCM onset stays omega=11 and the ' +
      'b/4 ceiling is untouched.',
    holds: () => {
      const h = IMP97675_OMEGA10_CAP_ROBUSTNESS_GLOSSARY_HEADWORD.headword;
      return /omega=11/.test(h.mechanism) && /b\/4 ceiling untouched/.test(h.mechanism);
    },
  },
  {
    id: 'imp97675-consistent-with-imp97647-source-figures',
    why: 'The re-cited cap-robustness figures must match the imp-97647 source module exactly -- ' +
      'this is a glossary headword, not an independent re-derivation.',
    holds: () =>
      IMP97647_OMEGA10_CAP_ROBUSTNESS.omega === 10 &&
      IMP97647_OMEGA10_CAP_ROBUSTNESS.onsetOmega === 11 &&
      IMP97647_OMEGA10_CAP_ROBUSTNESS.isTruncationArtifact === false &&
      IMP97647_OMEGA10_CAP_ROBUSTNESS.gapStaysPositive === true &&
      Math.abs(IMP97647_OMEGA10_CAP_ROBUSTNESS.gapAtCap1000 - 7.520578537e-5) < 1e-9 &&
      Math.abs(IMP97647_OMEGA10_CAP_ROBUSTNESS.maxGapShiftCapToInfinity - 5.6805e-11) < 1e-14,
  },
  {
    id: 'imp97675-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP97675_OMEGA10_CAP_ROBUSTNESS_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97675_OMEGA10_CAP_ROBUSTNESS_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP97675_OMEGA10_CAP_ROBUSTNESS_GLOSSARY_HEADWORD.verdict) &&
      /NO QED/.test(IMP97647_HONEST_BANNER),
  },
];

for (const assertion of IMP97675_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97675-omega10-cap-robustness-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
