/**
 * @module imp-124879-drift-discriminator-sensitivity-floor-glossary-headword
 * @fileoverview imp-124879 -- import-light glossary/Concepts headword naming the imp-124836
 *   general invariant-product drift discriminator and its sensitivity floor
 *   D_min = max(R/|X|_max, tau), the dividing line between the round-off-limited regime (where
 *   a flat P certifies drift-freeness) and the truncation-limited regime (where a decreasing P
 *   is ambiguous between genuine drift and pure stencil truncation).
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) THE RESULT. imp-124836 generalizes the imp-124811 ad-hoc invariant product
 *   P = |reldiff|*|X| into a unified error model P = (D + tau)*|X| + R, where D is the genuine
 *   relative identity drift, tau is the O(eps^p) relative stencil-truncation floor, and R is the
 *   |X|-independent additive round-off floor. (b) THE TWO REGIMES. In the ROUND-OFF-LIMITED
 *   regime (R >> (D+tau)*|X|_max), P is flat (log-log slope -1 in reldiff vs |X|) and this
 *   flatness VALIDLY certifies |D| <= R/|X|_max + tau. In the TRUNCATION-LIMITED regime
 *   ((D+tau)*|X| >> R), P decreases identically whether caused by genuine drift D or by pure
 *   truncation tau with D = 0 -- algebraically indistinguishable, so a decreasing P is NOT proof
 *   of drift. (c) THE SENSITIVITY FLOOR. D_min = max(R/|X|_max, tau) is the smallest drift the
 *   discriminator can ever certify: below D_min, a genuine drift is indistinguishable from either
 *   floor. Raising precision shrinks R and can push a valid round-off-limited test INTO the
 *   truncation-limited failure regime -- the mechanism imp-124828 observed directly (flat-P
 *   max/min ratio 8.5 -> 2.9e8, slope -1.085 -> +0.121, reldiff plateauing at the eps/precision-
 *   invariant tau = 3.333e-14). (d) THE DISAMBIGUATOR. D and tau separate only by their
 *   eps-dependence: tau shrinks under step refinement (~eps^p), D does not.
 *   (e) WHY IT DOES NOT MOVE ANY BOUND. Formalization of a numerical-diagnostic test only; the
 *   C_mb GUE-conditional (imp-486) is untouched; no operator positivity established; no RH
 *   verdict.
 *
 *   STATUS: documentation only -- a Concepts glossary headword recording an already-established
 *   formalization. Not a new derivation. NO QED.
 *
 * @see imp-124836-invariant-product-discriminator-general-test.js (source: the general
 *   discriminator and D_min formula this headword names)
 * @see imp-124811-invariant-product-identity-drift-discriminator (the special-case P = D*|X| + R
 *   this generalizes)
 * @see imp-124828-extended-precision-rerun (the directly observed round-off-to-truncation regime
 *   flip under raised precision)
 *
 * Ticket: imp-124879 (content, low, sonnet-4-6). Documentation only; establishes nothing new;
 * NO QED; no refereed bound is changed.
 */

// The drift-discriminator sensitivity-floor headword, baked verbatim (no re-import of the heavy zeros bundle).
const DRIFT_DISCRIMINATOR_SENSITIVITY_FLOOR_HEADWORD = Object.freeze({
  key: 'drift-discriminator-sensitivity-floor-imp124836',
  term:
    'Drift-discriminator sensitivity floor: D_min = max(R/|X|_max, tau), the smallest identity ' +
    'drift the imp-124836 invariant-product test can certify, separating the round-off-limited ' +
    'regime (valid) from the truncation-limited regime (ambiguous)',
  definition:
    'imp-124836 generalizes the imp-124811 invariant product P = |reldiff|*|X| into the unified ' +
    'error model P = (D + tau)*|X| + R, where D is the genuine relative identity drift, tau is the ' +
    'relative O(eps^p) stencil-truncation floor, and R is the |X|-independent additive round-off ' +
    'floor. D_min = max(R/|X|_max, tau) is the sensitivity floor: the smallest drift the test can ' +
    'ever certify as an upper bound, since any true D below D_min is buried under whichever of the ' +
    'two floors is larger.',
  mechanism:
    'ROUND-OFF-LIMITED regime (R >> (D+tau)*|X|_max): P is flat, reldiff ~ R/|X| has log-log slope ' +
    '-1, and flatness VALIDLY certifies |D| <= R/|X|_max + tau. TRUNCATION-LIMITED regime ' +
    '((D+tau)*|X| >> R): P decreases (slope +1) identically whether the linear coefficient is a ' +
    'genuine drift D or a pure truncation floor tau with D = 0 -- a decreasing P is NOT proof of ' +
    'drift in this regime. D and tau separate only by eps-dependence (tau ~ eps^p shrinks under step ' +
    'refinement, D does not). Raising precision shrinks R and can push a valid test out of the ' +
    'round-off-limited regime into the ambiguous truncation-limited one -- observed directly by ' +
    'imp-124828: flat-P max/min ratio 8.5 -> 2.9e8, slope -1.085 -> +0.121, reldiff plateauing at ' +
    'the eps/precision-invariant tau = 3.333e-14.',
  verificationStatus:
    'Re-cited from the imp-124836 formalization module ' +
    '(src/data/imp-124836-invariant-product-discriminator-general-test.js), which generalizes the ' +
    'imp-124811 special case (tau ~ 3.3e-14 swamped by R ~ 2.3e-12) and is cross-validated against ' +
    'the imp-124828 extended-precision regime flip. Naming / glossary headword only; supplies no ' +
    'new bound; the C_mb GUE-conditional (imp-486) is untouched; RH open; no refereed bound is changed' +
    '; NO QED.',
});

export const IMP124879_DRIFT_DISCRIMINATOR_SENSITIVITY_FLOOR_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-124879',
  proofSection: 'S-frontier',
  glosses: 'imp-124836',
  question:
    'imp-124836 generalized the imp-124811 invariant-product drift discriminator into a unified ' +
    'model P = (D + tau)*|X| + R and identified a sensitivity floor D_min = max(R/|X|_max, tau) ' +
    'below which the round-off-limited and truncation-limited regimes cannot be told apart -- what ' +
    'is the headword for this result?',
  headword: DRIFT_DISCRIMINATOR_SENSITIVITY_FLOOR_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names the imp-124836 result: the general ' +
    'invariant-product drift discriminator P = (D + tau)*|X| + R, its sensitivity floor ' +
    'D_min = max(R/|X|_max, tau), and the round-off-limited (valid) vs truncation-limited ' +
    '(ambiguous) regime split confirmed directly by the imp-124828 precision-driven regime flip. ' +
    'No bound moved; the C_mb GUE-conditional and all pinned surrogate constants untouched; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-124836 (the general discriminator and D_min formula this glosses); imp-124811 (the ' +
    'special-case invariant product this generalizes); imp-124828 (the extended-precision regime ' +
    'flip confirming the truncation-limited failure mode); imp-124769 (the round-off-vs-truncation ' +
    'crossover that pins where R overtakes tau*|X|).',
});

export default IMP124879_DRIFT_DISCRIMINATOR_SENSITIVITY_FLOOR_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP124879_DRIFT_DISCRIMINATOR_SENSITIVITY_FLOOR_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp124879-headword-names-dmin-and-regimes',
    why: 'The headword must name the D_min = max(R/|X|_max, tau) formula and both the ' +
      'round-off-limited and truncation-limited regimes -- the entire content of the glossary entry.',
    holds: () => {
      const h = IMP124879_DRIFT_DISCRIMINATOR_SENSITIVITY_FLOOR_GLOSSARY_HEADWORD.headword;
      return (
        /D_min = max\(R\/\|X\|_max, tau\)/.test(h.definition) &&
        /ROUND-OFF-LIMITED/.test(h.mechanism) &&
        /TRUNCATION-LIMITED/.test(h.mechanism) &&
        /3\.333e-14/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp124879-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, glosses imp-124836.',
    holds: () =>
      IMP124879_DRIFT_DISCRIMINATOR_SENSITIVITY_FLOOR_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP124879_DRIFT_DISCRIMINATOR_SENSITIVITY_FLOOR_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP124879_DRIFT_DISCRIMINATOR_SENSITIVITY_FLOOR_GLOSSARY_HEADWORD.verdict) &&
      IMP124879_DRIFT_DISCRIMINATOR_SENSITIVITY_FLOOR_GLOSSARY_HEADWORD.glosses === 'imp-124836',
  },
];

for (const assertion of IMP124879_DRIFT_DISCRIMINATOR_SENSITIVITY_FLOOR_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-124879-drift-discriminator-sensitivity-floor-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
