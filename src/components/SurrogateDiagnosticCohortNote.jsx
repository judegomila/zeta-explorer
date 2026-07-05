import React from 'react';

/**
 * SurrogateDiagnosticCohortNote — shared honest-status boilerplate for the
 * imp-34082..imp-34087 surrogate-diagnostic cohort (endpoint-drop serial
 * dependence, KPSS bandwidth sweep, apex cubic tilt, trough/peak ratio,
 * asymmetric-trim share, F4 digit-loss). Each of these modules re-fits the
 * SAME inherited imp-3220/imp-3406 component-model surrogate and previously
 * closed with its own hand-typed variant of an identical disclaimer.
 * Centralising the wording here means it cannot drift page-to-page.
 *
 * Renders only the shared boilerplate clause; callers still write their own
 * module-specific finding sentence(s) immediately before this.
 */
export default function SurrogateDiagnosticCohortNote() {
  return (
    <>
      This is a diagnostic re-fit of an inherited surrogate, NOT an RH bound; the component model is
      the inherited imp-3220/imp-3406 extrapolation, not a rigorous asymptotic; C_mb GUE-conditional
      per imp-486 untouched; C_C 1/8 ansatz (imp-2642/imp-2643) untouched; changes no bound, no
      operator positivity established; imp-3066 K_a&gt;=0 untouched; NO QED; Platt-Trudgian
      Lambda&lt;=0.2 remains SOTA.
    </>
  );
}
