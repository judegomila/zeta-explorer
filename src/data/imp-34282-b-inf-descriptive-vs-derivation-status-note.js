// src/data/imp-34282-b-inf-descriptive-vs-derivation-status-note.js
//
// imp-34282: Surface the imp-34188 b_inf-indistinguishable-from-minus-1 finding
// together with the imp-34246 pending derivation status, so the
// descriptive-vs-derived distinction is visible in one place rather than
// split across a measurement module and a queue ticket nobody cross-reads.
//
// THE MEASURED RESULT (imp-34188): pushing the imp-33810/imp-33877 widening-
// slope ladder from kEnd=18 to kEnd=21 pulls the free exponential-approach
// limit b_inf from -1.014 to -1.0028, and pinning b_inf = -1 exactly costs
// only ~0.8% more SSR (extra-sum-of-squares F~0.15, far below the F_0.05(1,18)
// = 4.414 rejection threshold). The data cannot reject b_inf = exactly -1.
// imp-34188 is explicit that this is a DESCRIPTIVE SURROGATE FIT, NOT a
// derivation that the limit IS -1.
//
// THE OPEN DERIVATION (imp-34246): "Derive analytically why the imp-34188
// log-linear widening-slope limit b_inf equals exactly -1 from the
// eflow/resid tail asymptotics" -- status PENDING (priority medium, category
// proof, routed to opus-4-8) as of this note. No analytic derivation of the
// -1 value from the inherited E_flow/resid_exp tail forms exists yet.
//
// This note performs no new computation; it is a cross-reference only.

const IMP34188_STATISTICAL_RESULT = Object.freeze({
  ticket: 'imp-34188',
  claim: 'b_inf statistically indistinguishable from exactly -1',
  freeFitBInf: -1.0028,
  pinnedSsrOverFreeSsr: 1.008,
  fStat: 0.15,
  fCrit05: 4.414,
  minusOneNotRejected: true,
  isDerivation: false,
});

const IMP34246_DERIVATION_STATUS = Object.freeze({
  ticket: 'imp-34246',
  title:
    'Derive analytically why the imp-34188 log-linear widening-slope limit b_inf equals exactly -1 ' +
    'from the eflow/resid tail asymptotics',
  status: 'pending',
  priority: 'medium',
  category: 'proof',
  routedModel: 'opus-4-8',
  dependsOn: [],
});

export const IMP34282_B_INF_DESCRIPTIVE_VS_DERIVATION_STATUS_NOTE = Object.freeze({
  id: 'imp-34282-b-inf-descriptive-vs-derivation-status-note',
  ticket: 'imp-34282',
  measured: IMP34188_STATISTICAL_RESULT,
  openDerivation: IMP34246_DERIVATION_STATUS,

  summary:
    'imp-34188 found the widening-slope limit b_inf is statistically indistinguishable from exactly ' +
    '-1 (extra-sum-of-squares F~0.15, far below the F_0.05(1,18)=4.414 rejection threshold), but the ' +
    'module itself flags this as a descriptive surrogate fit, NOT a derivation. imp-34246, the ticket ' +
    'to derive analytically WHY b_inf=-1 from the eflow/resid tail asymptotics, remains PENDING -- no ' +
    'such derivation has been produced yet.',

  honest:
    'CROSS-REFERENCE NOTE ONLY -- no new measurement, no new derivation. Surfaces the ' +
    'descriptive-vs-derived gap that imp-34188 named explicitly (statistical indistinguishability is ' +
    'NOT proof of exact equality) and confirms imp-34246 (the analytic derivation ticket) is still ' +
    'open. Until imp-34246 lands, b_inf=-1 should be read as consistent-with, not established-as, the ' +
    'true limit. Changes no bound; component model is the inherited imp-3220/imp-3406 extrapolation, ' +
    'NOT a rigorous asymptotic; C_mb GUE-conditional per imp-486 untouched; imp-3066 K_a>=0 untouched; ' +
    'NO QED; no refereed bound is changed.',
});

export const IMP34282_B_INF_DESCRIPTIVE_VS_DERIVATION_STATUS_NOTE_ASSERTIONS = [
  {
    id: 'imp34282-measured-result-not-a-derivation',
    description: 'imp-34188 result is recorded as statistically indistinguishable from -1 but explicitly NOT a derivation',
    holds: () =>
      IMP34188_STATISTICAL_RESULT.minusOneNotRejected === true &&
      IMP34188_STATISTICAL_RESULT.isDerivation === false &&
      IMP34188_STATISTICAL_RESULT.fStat < IMP34188_STATISTICAL_RESULT.fCrit05,
  },
  {
    id: 'imp34282-derivation-ticket-still-pending',
    description: 'imp-34246 (the derive-why-minus-one ticket) is recorded as pending, not completed',
    holds: () =>
      IMP34246_DERIVATION_STATUS.status === 'pending' &&
      IMP34246_DERIVATION_STATUS.ticket === 'imp-34246',
  },
  {
    id: 'imp34282-honesty-gate-no-qed',
    description: 'honest framing explicitly disclaims QED and keeps Platt-Trudgian as SOTA',
    holds: () =>
      /NO QED/.test(IMP34282_B_INF_DESCRIPTIVE_VS_DERIVATION_STATUS_NOTE.honest) &&
      /refereed bound is changed/i.test(IMP34282_B_INF_DESCRIPTIVE_VS_DERIVATION_STATUS_NOTE.honest) &&
      /imp-3066 K_a>=0 untouched/.test(IMP34282_B_INF_DESCRIPTIVE_VS_DERIVATION_STATUS_NOTE.honest),
  },
];

for (const a of IMP34282_B_INF_DESCRIPTIVE_VS_DERIVATION_STATUS_NOTE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34282-b-inf-descriptive-vs-derivation-status-note assertion failed: ${a.id}`);
  }
}

export default IMP34282_B_INF_DESCRIPTIVE_VS_DERIVATION_STATUS_NOTE;
