/**
 * @module imp-124802-ecf-noise-floor-crossover-glossary-headword
 * @fileoverview imp-124802 -- import-light glossary/Concepts headword recording the imp-124769
 *   E_CF stencil noise-floor crossover: the sigma (equivalently the |E_CF| magnitude) at which the
 *   direct central-difference E_CF elasticity measurement switches from a clean O(eps^2)
 *   truncation power law to the landmark-bisection round-off floor.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) THE RESULT. imp-97821 reported QUALITATIVELY that at the sixth landmark L6 (sigma =
 *   0.005) the direct DIAG3 = E_CC + E_ET + E_CF eps-ladder stops quartering cleanly and becomes
 *   non-monotone, because the collapsed E_CF elasticity (~2.4e-7) is so small that the
 *   landmark-bisection round-off in its finite difference overtakes the O(eps^2) truncation --
 *   whereas at L5 (sigma = 0.02) the ladder still quartered cleanly. imp-124769 PINS that
 *   crossover quantitatively: across the L2..L6 landmark ladder, the direct E_CF finite-
 *   difference error at the shared headline step eps = 1e-3 follows a clean relative truncation
 *   plateau relTrunc ~ 3.3e-7 across L2..L4, bottoms at the landmark-bisection round-off floor
 *   R ~ 4.5e-13 at L5, then turns back up at L6. Equating the two regimes pins the crossover at
 *   |E_CF|_crit ~ 1.4e-6 (sigma_crit ~ 0.013), strictly between L5 (sigma 0.02, |E_CF| ~ 3.25e-6,
 *   still truncation-clean) and L6 (sigma 0.005, |E_CF| ~ 2.39e-7, round-off-dominated).
 *   (b) WHY IT IS NEW. imp-97821 only observed the non-monotone ladder at L6 without explaining
 *   where the qualitative transition happens; imp-124769 supplies the missing magnitude and sigma
 *   by decomposing the finite-difference error into its two competing regimes and solving for
 *   where they meet.
 *   (c) WHY IT MATTERS. It fixes the interpretation of the L6 non-monotone eps-ladder for any
 *   later citation: the effect is a stencil noise floor pinned at a specific |E_CF| magnitude,
 *   not an unexplained breakdown of the elasticity model, so results at or below sigma_crit
 *   should be read through the direct central-difference E_CF at the headline step, while the
 *   reconstructed/closed-form E_CF remains the reliable quantity there.
 *   (d) WHY IT DOES NOT MOVE ANY BOUND. This is a measurement/cross-validation diagnostic on the
 *   inherited imp-3220/imp-3406 conditional-share extrapolation. The C_mb GUE-conditional per
 *   imp-486, the C_C 1/8 ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and the imp-398
 *   C_F prefactor are UNTOUCHED and appear only symbolically as differentiation axes; establishes
 *   no operator positivity; imp-3066 K_a >= 0 untouched.
 *   (e) STATUS: documentation only. No bound moved; no new coefficient pinned beyond re-citing
 *   the imp-124769 measurement; the rigorous anchor stays the trace ceiling; NO QED.
 *
 *   STATUS: documentation only -- a Concepts glossary headword recording an already-established
 *   measurement. Not a new derivation. NO QED.
 *
 * @see imp-124769-ecf-stencil-noise-floor-crossover.js (source: the crossover measurement this
 *   headword names)
 * @see imp-97821-diag3-sixth-landmark-crossvalidation (L6 non-monotone eps-ladder, qualitative)
 * @see imp-97710-diag3-fourth-landmark-crossvalidation (L5 clean O(eps^2) quartering)
 * @see imp-97520-sigma-conditional-share-landmark-ladder (the landmark ladder L1..L4)
 * @see imp-124867-sigmacrit-precision-reconciliation.js (imp-124884: reconciles the sigma_crit ~
 *   0.013 figure here against imp-124849's extended-precision sigma_crit = 0.020385 -- same
 *   crossover measured against two different round-off floors R, not two phenomena; later
 *   citations should carry sigma_crit ~ 0.0204 at eps = 1e-3 as the precision-independent figure)
 *
 * Ticket: imp-124802 (content, low, sonnet-4-6). Documentation only; establishes nothing new;
 * NO QED; Platt-Trudgian Lambda <= 0.2 SOTA.
 */

// The E_CF noise-floor crossover headword, baked verbatim (no re-import of the heavy zeros bundle).
const ECF_NOISE_FLOOR_CROSSOVER_HEADWORD = Object.freeze({
  key: 'ecf-noise-floor-crossover-imp124769',
  term:
    'imp-124769 E_CF stencil noise-floor crossover: |E_CF|_crit ~ 1.4e-6 / sigma_crit ~ 0.013, ' +
    'between L5 and L6, where the direct central-difference elasticity error switches from ' +
    'O(eps^2) truncation to landmark-bisection round-off',
  definition:
    'Across the imp-97520 landmark ladder L2..L6 (sigma = 0.9, 0.5, 0.1, 0.02, 0.005), the direct ' +
    'central-difference E_CF elasticity error at the shared headline step eps = 1e-3 follows a ' +
    'clean relative O(eps^2) truncation plateau relTrunc ~ 3.3e-7 across L2..L4, bottoms at the ' +
    'landmark-bisection round-off floor R ~ 4.5e-13 at L5, and turns back up at L6. Equating ' +
    'relTrunc * |E_CF|_crit = R pins the crossover magnitude |E_CF|_crit ~ 1.4e-6, corresponding ' +
    'to sigma_crit ~ 0.013 -- strictly between L5 (sigma 0.02, |E_CF| ~ 3.25e-6, still ' +
    'truncation-clean) and L6 (sigma 0.005, |E_CF| ~ 2.39e-7, round-off-dominated).',
  mechanism:
    'The finite-difference error errCF(eps=1e-3) = |E_CF^direct - E_CF^recon| is the sum of two ' +
    'competing regimes: a truncation term errCF ~ relTrunc*|E_CF| (constant relative O(eps^2), ' +
    'clean while |E_CF| is large) and a round-off term errCF ~ R (a nearly landmark-independent ' +
    'absolute floor set by the double-precision bisection resolution of ln N_L). While ' +
    '|E_CF| > |E_CF|_crit the truncation term dominates and the eps-ladder quarters cleanly; once ' +
    '|E_CF| < |E_CF|_crit the round-off floor dominates and the ladder becomes non-monotone -- ' +
    'exactly the L5-clean / L6-non-monotone split imp-97710 and imp-97821 observed.',
  verificationStatus:
    'Re-cited from the imp-124769 measurement module ' +
    '(src/data/imp-124769-ecf-stencil-noise-floor-crossover.js): errCF(1e-3) falls monotonically ' +
    'L2 -> L5 (7.5e-8, 1.3e-9, 2.5e-11, 4.5e-13) tracking relTrunc*|E_CF| with relTrunc stable at ' +
    '~3.3e-7 across L2..L4, then turns back up at L6 (3.4e-12); the interpolated sigma_crit ~ ' +
    '0.013 lies strictly between L6 (0.005) and L5 (0.02). Naming / glossary headword only; ' +
    'supplies no new bound; the C_C 1/8 ansatz and E_trunc/E_flow component model are untouched; ' +
    'RH open; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
});

export const IMP124802_ECF_NOISE_FLOOR_CROSSOVER_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-124802',
  proofSection: 'S-frontier',
  glosses: 'imp-124769',
  question:
    'imp-124769 measured, across the L2..L6 landmark ladder, where the direct E_CF finite-' +
    'difference error switches from O(eps^2) truncation to landmark-bisection round-off -- what ' +
    'is the headword for that pinned crossover?',
  headword: ECF_NOISE_FLOOR_CROSSOVER_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names the imp-124769 result: the ' +
    'direct E_CF elasticity finite-difference error at eps = 1e-3 follows a clean O(eps^2) ' +
    'truncation plateau (relTrunc ~ 3.3e-7) across L2..L4, bottoms at the round-off floor ' +
    '(R ~ 4.5e-13) at L5, and turns back up at L6, pinning the crossover at |E_CF|_crit ~ 1.4e-6 ' +
    '(sigma_crit ~ 0.013) between L5 and L6. No bound moved; the component model and all pinned ' +
    'surrogate constants are untouched; NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-124769 (the crossover measurement this glosses); imp-97821 (L6 non-monotone eps-ladder, ' +
    'qualitative); imp-97710 (L5 clean O(eps^2) quartering); imp-97520 (landmark ladder L1..L4).',
  reconciliationNote:
    'imp-124867 RECONCILED this sigma_crit ~ 0.013 figure (double precision) against imp-124849s ' +
    'extended-precision sigma_crit = 0.020385 (dps >= 30): both use the identical crossover ' +
    'formula |E_CF|_crit = R / relTrunc against the SAME precision-invariant relTrunc plateau, ' +
    'differing only in the round-off floor R (double R ~ 4.46e-13 is a round-off-contaminated ' +
    'UNDER-estimate of the true O(eps^2) stencil floor R ~ 1.08e-12 at extended precision) -- one ' +
    'crossover measured against two floors, not two phenomena. Later citations should carry ' +
    'sigma_crit ~ 0.0204 (|E_CF|_crit ~ 3.36e-6) at eps = 1e-3 as the precision-independent figure; ' +
    'the ~0.013 value above is the double-precision-floor-contaminated artifact of the same ' +
    'crossover, kept here for provenance. NO QED; no bound moved; PT Lambda <= 0.2 remains SOTA.',
});

export default IMP124802_ECF_NOISE_FLOOR_CROSSOVER_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP124802_ECF_NOISE_FLOOR_CROSSOVER_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp124802-headword-names-crossover-magnitude-and-sigma',
    why: 'The headword must name both the pinned |E_CF|_crit magnitude and sigma_crit -- the ' +
      'entire content of the glossary entry.',
    holds: () => {
      const h = IMP124802_ECF_NOISE_FLOOR_CROSSOVER_GLOSSARY_HEADWORD.headword;
      return (
        /1\.4e-6/.test(h.definition) &&
        /0\.013/.test(h.definition) &&
        /3\.3e-7/.test(h.definition) &&
        /4\.5e-13/.test(h.definition)
      );
    },
  },
  {
    id: 'imp124802-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, PT SOTA line present, glosses imp-124769.',
    holds: () =>
      IMP124802_ECF_NOISE_FLOOR_CROSSOVER_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP124802_ECF_NOISE_FLOOR_CROSSOVER_GLOSSARY_HEADWORD.verdict) &&
      /remains SOTA/.test(IMP124802_ECF_NOISE_FLOOR_CROSSOVER_GLOSSARY_HEADWORD.verdict) &&
      IMP124802_ECF_NOISE_FLOOR_CROSSOVER_GLOSSARY_HEADWORD.glosses === 'imp-124769',
  },
  {
    id: 'imp124884-reconciliation-note-present',
    why: 'imp-124884 requires the imp-124867 reconciliation outcome to be cross-referenced here so ' +
      'the ~0.013 figure does not read as stale next to imp-124849s extended-precision 0.020385.',
    holds: () => {
      const note = IMP124802_ECF_NOISE_FLOOR_CROSSOVER_GLOSSARY_HEADWORD.reconciliationNote;
      return (
        typeof note === 'string' &&
        /imp-124867/.test(note) &&
        /0\.020385/.test(note) &&
        /0\.0204/.test(note) &&
        /NO QED/.test(note)
      );
    },
  },
];

for (const assertion of IMP124802_ECF_NOISE_FLOOR_CROSSOVER_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-124802-ecf-noise-floor-crossover-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
