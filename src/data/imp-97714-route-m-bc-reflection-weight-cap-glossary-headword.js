/**
 * @module imp-97714-route-m-bc-reflection-weight-cap-glossary-headword
 * @fileoverview imp-97714 -- import-light glossary/Concepts headword recording the imp-97681
 *   Bettin-Conrey reflection normalisation split: the PINNED gamma-factor half
 *   rho_refl = N(3)/N(1) = 1/(2 pi^2) and the residual pure-number weight cap
 *   |W_refl| <~ 0.24/pi that it converts the imp-97663 kappaK_period cap into.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) THE SPLIT. The Bettin-Conrey reflection normalisation transporting the Eichler z^2
 *   selection (completed value at s=3) onto the z^0 double-pole datum (s=1) factors as
 *   kappaK_period = rho_refl * W_refl: a PINNED gamma-factor half rho_refl = N(3)/N(1) =
 *   (2pi)^{-2} Gamma(3)/Gamma(1) = 1/(2 pi^2) = 0.050660591821168895 (imp-97617 RESULT A/B),
 *   times an uncomputed pure-number reflection weight W_refl (imp-97617 RESULT C).
 *   (b) THE CONVERTED CAP. Dividing the pinned rho_refl out of the imp-97663 no-cancellation
 *   cap |kappaK_period| <~ 3.87e-3 re-expresses the constraint as |W_refl| <~ 0.24/pi =
 *   0.07639437268410976 -- an O(1e-1) primitive rather than the original O(1e-3) one.
 *   (c) WHAT IT DOES NOT DO. rho_refl alone over-predicts the measured cap by 13.09x (the
 *   residual shortfall factor), so the reflection normalisation does NOT pin kappa_smooth; the
 *   uncomputed weight W_refl (or a P2-L2 cancellation) must still supply the rest.
 *   (d) STATUS: documentation only. No analytic constant is pinned for kappaK or kappa_smooth;
 *   kappa_smooth stays measured-not-pinned; no bound moves; interval-rigorous reach and the PT
 *   Lambda <= 0.2 SOTA are unaffected.
 *
 *   STATUS: documentation only -- a Concepts glossary headword recording an already-established
 *   derivation. Not a proof, not a new bound. NO QED.
 *
 * @see imp-97681-route-m-bc-reflection-gamma-normalisation.js (source: RESULT 1/2/3 -- rho_refl,
 *   the converted W_refl cap, and the non-pinning assessment)
 * @see imp-97617-route-m-bettin-conrey-kernel-gamma-factor-reconstruction (RESULT A/B/C: N(s),
 *   z^m -> s=m+1, and the uncomputed W_refl reflection index)
 * @see imp-97663-route-m-kappa-smooth-measured-band-reflection-constraint (the original
 *   |kappaK_period| <~ 3.87e-3 cap this headword's split refines)
 *
 * Ticket: imp-97714 (content, low, sonnet-4-6). Documentation only; establishes nothing new;
 * NO QED; no refereed bound is changed.
 */

// The reflection-weight-cap headword, baked verbatim (no re-import).
const BC_REFLECTION_WEIGHT_CAP_HEADWORD = Object.freeze({
  key: 'bc-reflection-weight-cap-imp97681',
  term:
    'Bettin-Conrey reflection weight cap |W_refl| <~ 0.24/pi: the residual pure-number ' +
    'reflection weight remaining once the pinned gamma-factor ratio rho_refl = 1/(2 pi^2) is ' +
    'divided out of the imp-97663 kappaK_period cap',
  definition:
    'The Bettin-Conrey functional-equation reflection normalisation kappaK_period factors as ' +
    'rho_refl * W_refl, where rho_refl = N(3)/N(1) = (2pi)^{-2} Gamma(3)/Gamma(1) = 1/(2 pi^2) = ' +
    '0.050660591821168895 is the PINNED gamma-factor half (imp-97617 RESULT A/B), and W_refl is ' +
    'the uncomputed pure-number Pochhammer / argument-shift weight (imp-97617 RESULT C). Dividing ' +
    'rho_refl out of the imp-97663 no-cancellation cap |kappaK_period| <~ 3.87e-3 = 0.12/pi^3 ' +
    'gives |W_refl| <~ 0.24/pi = 0.07639437268410976.',
  mechanism:
    'The gamma factor supplies a suppression of 2 pi^2 = 19.74 towards the total suppression of ' +
    '258.4 that the measured cap requires relative to the bare period scale, leaving a residual ' +
    'shortfall factor rho_refl/cap ~ 13.09 that the still-uncomputed weight W_refl (or a P2-L2 ' +
    'cancellation) must supply. This is why the reflection normalisation does NOT by itself pin ' +
    'kappa_smooth: it sharpens the uncomputed primitive from an O(1e-3) normalisation to an ' +
    'O(1e-1) residual weight, with only its gamma half now pinned.',
  verificationStatus:
    'Re-cited from the imp-97681 derivation module ' +
    '(src/data/imp-97681-route-m-bc-reflection-gamma-normalisation.js). Naming / glossary ' +
    'headword only; supplies no new bound; kappa_smooth stays measured, not pinned; RH open; ' +
    'no refereed bound is changed; NO QED.',
});

export const IMP97714_BC_REFLECTION_WEIGHT_CAP_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97714',
  proofSection: 'Route-M',
  glosses: 'imp-97681',
  question:
    'imp-97681 pinned the gamma-factor half of the Bettin-Conrey reflection normalisation ' +
    'rho_refl = N(3)/N(1) = 1/(2 pi^2) and converted the imp-97663 kappaK_period cap into a ' +
    'residual-weight bound. What is the headword for that converted cap?',
  headword: BC_REFLECTION_WEIGHT_CAP_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names the imp-97681 residual pure-' +
    'number reflection weight cap |W_refl| <~ 0.24/pi = 0.0764, obtained by dividing the pinned ' +
    'gamma-factor ratio rho_refl = N(3)/N(1) = 1/(2 pi^2) out of the imp-97663 no-cancellation ' +
    'cap |kappaK_period| <~ 3.87e-3. No bound moved; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-97681 (the derivation of rho_refl and the converted W_refl cap); imp-97617 (the gamma ' +
    'factor N(s) and Eichler selection map RESULT A/B/C this derivation is built on); imp-97663 ' +
    '(the original |kappaK_period| <~ 3.87e-3 cap being refined).',
});

export default IMP97714_BC_REFLECTION_WEIGHT_CAP_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97714_BC_REFLECTION_WEIGHT_CAP_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97714-headword-names-split-and-cap',
    why: 'The headword must name the rho_refl/W_refl split and the converted 0.24/pi cap -- ' +
      'the entire content of the glossary entry.',
    holds: () => {
      const h = IMP97714_BC_REFLECTION_WEIGHT_CAP_GLOSSARY_HEADWORD.headword;
      return (
        /1\/\(2 pi\^2\)/.test(h.definition) &&
        /0\.07639437268410976/.test(h.definition) &&
        /13\.09/.test(h.mechanism) &&
        /19\.74/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp97714-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, glosses imp-97681.',
    holds: () =>
      IMP97714_BC_REFLECTION_WEIGHT_CAP_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97714_BC_REFLECTION_WEIGHT_CAP_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP97714_BC_REFLECTION_WEIGHT_CAP_GLOSSARY_HEADWORD.verdict) &&
      IMP97714_BC_REFLECTION_WEIGHT_CAP_GLOSSARY_HEADWORD.glosses === 'imp-97681',
  },
];

for (const assertion of IMP97714_BC_REFLECTION_WEIGHT_CAP_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97714-route-m-bc-reflection-weight-cap-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
