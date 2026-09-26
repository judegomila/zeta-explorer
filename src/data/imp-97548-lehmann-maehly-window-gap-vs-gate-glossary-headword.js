/**
 * @module imp-97548-lehmann-maehly-window-gap-vs-gate-glossary-headword
 * @fileoverview imp-97548 -- import-light glossary/Concepts headword recording the imp-97514
 *   FINDING 1 gap/gate distinction: the generous measured gap lambda_2 - lambda_1 = 82.547450
 *   governs the m=1 Temple shift, NOT the m=2 Lehmann-Maehly window, whose shift rho_2 must
 *   live one gap up, in the ~5433.864-wide (lambda_2, lambda_3) gap.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) THE m=1 GAP. The m=1 Temple shift is placed in (lambda_1, lambda_2) =
 *   (0.543044, 83.090493), width 82.547450 -- this is the "generous gap" number that
 *   recurs throughout Krein cohort discussions.
 *   (b) THE m=2 GATE IS A DIFFERENT GAP. The m=2 window shift rho_2 must satisfy
 *   rho_2 > lambda_2 (cheap: the Ritz upper bracket lambda_2 <= 83.090493 already forces
 *   this) AND rho_2 <= lambda_3, i.e. rho_2 in (lambda_2, lambda_3) =
 *   (83.090493, 5516.954964), width ~5433.864 -- sixty-five times wider than the m=1 gap.
 *   (c) WHY THE MISREADING MATTERS. Citing the 82.547 number for the m=2 window
 *   overstates how close the enclosure is to closing: the m=2 gate instead needs a
 *   CERTIFIED LOWER bound on the THIRD eigenvalue lambda_3 exceeding 83.090493, a
 *   materially harder requirement.
 *   (d) STATUS. Relocating the binding gap does not itself supply that certified
 *   lower bound: imp-97514 FINDING 2 shows the same Route-2 recursion, applied one
 *   index up to lambda_3, shares the imp-97415 concentration-wall floor
 *   (-4336.198026, index-blind) and never crosses zero. No operator positivity is
 *   established; interval-rigorous reach stays 2a <= 0.96; no bound moves.
 *
 *   STATUS: documentation only -- a Concepts glossary headword recording an already-
 *   established distinction. Not a proof, not a new bound. NO QED.
 *
 * @see imp-97514-krein-m2-window-enclosure-assessment.js (source: FINDING 1 gap/gate
 *   distinction, FINDING 2 lambda_3 recursion sharing the concentration wall)
 * @see imp-97400-krein-lehmann-maehly-lower-bracket-execution.js (m=1 gap 82.547450)
 * @see imp-97495-krein-route2-kbig300-380-direct-floor.js (lambda_3 Ritz upper bracket
 *   5516.954964; window shift 5462.61632)
 *
 * Ticket: imp-97548 (content, low, sonnet-4-6). Documentation only; establishes nothing
 * new; NO QED; Platt-Trudgian Lambda <= 0.2 SOTA.
 */

import {
  IMP97514_RITZ,
  IMP97514_WINDOW_GAP,
} from './imp-97514-krein-m2-window-enclosure-assessment.js';

// The gap/gate headword, baked verbatim (no re-import of the full assessment).
const LEHMANN_MAEHLY_WINDOW_GAP_VS_GATE_HEADWORD = Object.freeze({
  key: 'lehmann-maehly-window-gap-vs-gate-imp97514',
  term:
    'm=2 Lehmann-Maehly window gap-vs-gate distinction: the generous measured gap ' +
    'lambda_2 - lambda_1 = 82.547450 governs the m=1 Temple shift, not the m=2 window, ' +
    'whose shift rho_2 must live one gap up in the ~5433.864-wide (lambda_2, lambda_3) gap',
  definition:
    'The m=1 Temple shift sits in (lambda_1, lambda_2) = (0.543044, 83.090493), width ' +
    '82.547450 -- the "generous gap" cited throughout Krein cohort discussions. The m=2 ' +
    'window shift rho_2 instead needs rho_2 > lambda_2 (cheap, forced by the Ritz upper ' +
    'bracket lambda_2 <= 83.090493) AND rho_2 <= lambda_3, i.e. rho_2 in ' +
    '(83.090493, 5516.954964), width ~5433.864 -- ~65.8x wider than the m=1 gap. The ' +
    '82.547 reading is therefore orthogonal to the m=2 gate.',
  mechanism:
    'The m=2 gate requires a CERTIFIED LOWER bound on the third eigenvalue lambda_3 ' +
    'exceeding the Ritz upper bracket 83.090493 -- a materially different and harder ' +
    'requirement than citing the generous gap. imp-97514 FINDING 2 shows the same ' +
    'Route-2 recursion, applied one index up to certify lambda_3 from below, shares the ' +
    'imp-97415 concentration-wall floor (-4336.198026, index-blind) and never crosses ' +
    'zero -- so relocating the binding gap does not itself close the m=2 gate.',
  verificationStatus:
    'Re-cited from the imp-97514 assessment ' +
    '(src/data/imp-97514-krein-m2-window-enclosure-assessment.js). Naming / glossary ' +
    'headword only; supplies no new bound; RH open; Platt-Trudgian Lambda <= 0.2 ' +
    'remains SOTA; NO QED.',
});

export const IMP97548_LEHMANN_MAEHLY_WINDOW_GAP_VS_GATE_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97548',
  proofSection: 'S-frontier',
  glosses: 'imp-97514',
  question:
    'Does the generous measured gap lambda_2 - lambda_1 = 82.547450 govern the m=2 ' +
    'Lehmann-Maehly window enclosure, or does the window shift live in a different, ' +
    'wider gap?',
  headword: LEHMANN_MAEHLY_WINDOW_GAP_VS_GATE_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names the imp-97514 FINDING 1 ' +
    'distinction: the 82.547450 gap (lambda_1, lambda_2) governs the m=1 Temple shift, ' +
    'while the m=2 window shift rho_2 must live in the ~5433.864-wide (lambda_2, ' +
    'lambda_3) gap, sixty-five times wider -- so the generous 82.547 reading is ' +
    'orthogonal to the m=2 gate, which instead requires a certified lower bound on ' +
    'lambda_3 exceeding 83.090493. No bound moved; NO QED. Platt-Trudgian Lambda <= 0.2 ' +
    'remains SOTA.',
  citation:
    'imp-97514-krein-m2-window-enclosure-assessment.js (FINDING 1 gap/gate distinction, ' +
    'FINDING 2 lambda_3 recursion sharing the concentration wall); ' +
    'imp-97400-krein-lehmann-maehly-lower-bracket-execution.js (m=1 gap 82.547450); ' +
    'imp-97495-krein-route2-kbig300-380-direct-floor.js (lambda_3 Ritz upper bracket ' +
    '5516.954964, window shift 5462.61632).',
});

export default IMP97548_LEHMANN_MAEHLY_WINDOW_GAP_VS_GATE_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97548_LEHMANN_MAEHLY_WINDOW_GAP_VS_GATE_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97548-headword-names-both-gaps',
    why: 'The headword must name both gaps (the generous m=1 gap and the wider m=2 ' +
      'binding gap) and the certified-lower-bound requirement -- the entire content of ' +
      'the glossary entry.',
    holds: () => {
      const h = IMP97548_LEHMANN_MAEHLY_WINDOW_GAP_VS_GATE_GLOSSARY_HEADWORD.headword;
      return (
        /82\.547450/.test(h.definition) &&
        /5433\.864/.test(h.definition) &&
        /65\.8x/.test(h.definition) &&
        /CERTIFIED LOWER bound/.test(h.mechanism) &&
        /concentration-wall/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp97548-consistent-with-imp97514-source-figures',
    why: 'The re-cited gap figures must match the imp-97514 source module exactly -- ' +
      'this is a glossary headword, not an independent re-derivation.',
    holds: () =>
      Math.abs(IMP97514_RITZ.gap12 - 82.547450) < 1e-6 &&
      Math.abs(IMP97514_RITZ.lambda2UpperBracket - 83.090493) < 1e-6 &&
      Math.abs(IMP97514_RITZ.lambda3UpperBracket - 5516.954964) < 1e-6 &&
      Math.abs(IMP97514_WINDOW_GAP.m2GapWidth - 5433.864471) < 1e-3 &&
      IMP97514_WINDOW_GAP.generousGapFeedsWindow === false &&
      IMP97514_WINDOW_GAP.gapWidthRatio > 65 &&
      IMP97514_WINDOW_GAP.gapWidthRatio < 66,
  },
  {
    id: 'imp97548-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, PT SOTA line present, ' +
      'glosses imp-97514.',
    holds: () =>
      IMP97548_LEHMANN_MAEHLY_WINDOW_GAP_VS_GATE_GLOSSARY_HEADWORD.anyBoundMoved ===
        false &&
      /NO QED/.test(
        IMP97548_LEHMANN_MAEHLY_WINDOW_GAP_VS_GATE_GLOSSARY_HEADWORD.verdict
      ) &&
      /remains SOTA/.test(
        IMP97548_LEHMANN_MAEHLY_WINDOW_GAP_VS_GATE_GLOSSARY_HEADWORD.verdict
      ) &&
      IMP97548_LEHMANN_MAEHLY_WINDOW_GAP_VS_GATE_GLOSSARY_HEADWORD.glosses ===
        'imp-97514',
  },
];

for (const assertion of IMP97548_LEHMANN_MAEHLY_WINDOW_GAP_VS_GATE_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97548-lehmann-maehly-window-gap-vs-gate-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
