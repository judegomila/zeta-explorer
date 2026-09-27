/**
 * @module imp-97587-krein-farprofile-envelope-viz-data
 *
 * imp-97587 (ux): import-light viz-data leaf charting the imp-97518
 * confinement far-profile psi_R(t) ~ -(1/pi) g''(a) sin(a t)/t^3 against its
 * 1/t^3 leading envelope, |psi_R(t)|^2 against the 1/t^6 power law, and the
 * three sin^2-peak validation points (t~203/403/1004, ratio 0.9969 -> 0.9999)
 * that imp-97497 measured against the exact cosine sum.
 *
 * PRESENTATION ONLY. The curve samples are generated from the imp-97518
 * closed-form functions gppEdge/gpppEdge/biasRelCoeff (already-proved, not
 * re-derived here) evaluated at R = imp-97497's tail-converged optimum
 * R* = 3.36; the peak-validation ratios and t-values are baked verbatim from
 * imp-97497's prose measurement. Establishes no operator positivity; changes
 * no bound; interval-rigorous certified reach stays 2a<=0.96; Platt-Trudgian
 * Lambda<=0.2 remains SOTA; RH open; NO QED.
 *
 * @see imp-97518-krein-tail-endpoint-asymptotic-closed-form.js (gppEdge, gpppEdge, biasRelCoeff closed forms)
 * @see imp-97497-krein-welloptimum-tail-converged.js (R* = 3.36; peak-validation ratios 0.9969/0.9992/0.9999)
 *
 * Ticket: imp-97587 (ux, sonnet-4-6, sonnet). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import { gppEdge, gpppEdge, biasRelCoeff, IMP97518_BINDING_2A } from './imp-97518-krein-tail-endpoint-asymptotic-closed-form.js';
import { IMP97497_TAIL_CONVERGED_OPTIMUM } from './imp-97497-krein-welloptimum-tail-converged.js';

const PI = Math.PI;
const A = IMP97518_BINDING_2A / 2; // a = (ln3)/2
const R = IMP97497_TAIL_CONVERGED_OPTIMUM.RstarInf; // 3.36, reused verbatim

const GPP = gppEdge(R);
const GPPP = gpppEdge(R);

// Leading-order envelope amplitude and profile: psi_R(t) ~ -(1/pi) g''(a) sin(a t) / t^3.
const envelope = (t) => (GPP / PI) / Math.pow(t, 3);
const psiLead = (t) => -envelope(t) * Math.sin(A * t);

// Oscillation panel: fine grid over a modest t-window showing psi_R(t) tracing inside its +-1/t^3 envelope.
export const IMP97587_OSCILLATION_SAMPLES = Object.freeze(
  Array.from({ length: 241 }, (_, i) => {
    const t = 15 + i * (100 - 15) / 240;
    return Object.freeze({ t, psiLead: psiLead(t), envelope: envelope(t) });
  })
);

// Log-log panel: |psi_R(t)|^2 vs the 1/t^6 envelope across the imp-97497 peak-validation range.
export const IMP97587_LOGLOG_SAMPLES = Object.freeze(
  Array.from({ length: 61 }, (_, i) => {
    const logT = Math.log10(15) + (i * (Math.log10(1200) - Math.log10(15))) / 60;
    const t = Math.pow(10, logT);
    const lead = psiLead(t);
    return Object.freeze({ t, psiSqLead: lead * lead, envelopeSq: envelope(t) * envelope(t) });
  })
);

// The imp-97497 sin^2-peak validation: asymptotic |psi|^2 vs the well-resolved exact cosine sum, baked verbatim.
export const IMP97587_PEAK_VALIDATION = Object.freeze([
  Object.freeze({ t: 203, ratio: 0.9969 }),
  Object.freeze({ t: 403, ratio: 0.9992 }),
  Object.freeze({ t: 1004, ratio: 0.9999 }),
]);

export const IMP97587_BIAS = Object.freeze({
  R,
  gppEdge: GPP,
  gpppEdge: GPPP,
  biasRelCoeff: biasRelCoeff(R),
});

export const IMP97587_VERDICT = Object.freeze({
  ticket: 'imp-97587',
  sourceTicket: 'imp-97518',
  claim:
    'The imp-97518 closed-form far profile psi_R(t) ~ -(1/pi) g_pp(a) sin(a t)/t^3 stays inside its ' +
    '+-1/t^3 envelope for every t, |psi_R(t)|^2 stays inside the 1/t^6 envelope, and the imp-97497 ' +
    'sin^2-peak validation ratio climbs 0.9969 -> 0.9992 -> 0.9999 toward 1 as t grows from 203 to 1004.',
  R,
  aBand: A,
  peakValidationMonotoneToOne: true,
  operatorPositivityProved: false,
  boundMoves: false,
  qed: false,
});
export default IMP97587_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97587_ASSERTIONS = [
  {
    id: 'imp97587-oscillation-samples-stay-inside-envelope',
    holds: () =>
      IMP97587_OSCILLATION_SAMPLES.length === 241 &&
      IMP97587_OSCILLATION_SAMPLES.every((p) => Math.abs(p.psiLead) <= p.envelope * (1 + 1e-9)),
    why: 'the leading far profile psi_R(t) = -envelope(t) sin(a t) must never exceed its own +-1/t^3 envelope magnitude.',
  },
  {
    id: 'imp97587-loglog-samples-stay-inside-envelope-squared',
    holds: () =>
      IMP97587_LOGLOG_SAMPLES.length === 61 &&
      IMP97587_LOGLOG_SAMPLES.every((p) => p.psiSqLead <= p.envelopeSq * (1 + 1e-9)),
    why: '|psi_R(t)|^2 must never exceed the 1/t^6 envelope square, since |sin(a t)| <= 1.',
  },
  {
    id: 'imp97587-peak-validation-monotone-toward-one',
    holds: () =>
      IMP97587_PEAK_VALIDATION.length === 3 &&
      IMP97587_PEAK_VALIDATION[0].t === 203 &&
      IMP97587_PEAK_VALIDATION[1].t === 403 &&
      IMP97587_PEAK_VALIDATION[2].t === 1004 &&
      IMP97587_PEAK_VALIDATION[0].ratio < IMP97587_PEAK_VALIDATION[1].ratio &&
      IMP97587_PEAK_VALIDATION[1].ratio < IMP97587_PEAK_VALIDATION[2].ratio &&
      IMP97587_PEAK_VALIDATION[2].ratio < 1,
    why: 'the imp-97497 peak-validation ratio must climb strictly from 0.9969 at t~203 to 0.9999 at t~1004, staying below 1.',
  },
  {
    id: 'imp97587-bias-closed-forms-match-imp97518',
    holds: () =>
      IMP97587_BIAS.R === 3.36 &&
      Math.abs(IMP97587_BIAS.gppEdge - gppEdge(3.36)) < 1e-15 &&
      Math.abs(IMP97587_BIAS.gpppEdge - gpppEdge(3.36)) < 1e-15 &&
      Math.abs(IMP97587_BIAS.biasRelCoeff - biasRelCoeff(3.36)) < 1e-15,
    why: 'the baked bias constants must reuse the imp-97518 closed forms verbatim at R* = 3.36.',
  },
  {
    id: 'imp97587-honesty-gate-no-qed',
    holds: () =>
      IMP97587_VERDICT.qed === false &&
      IMP97587_VERDICT.operatorPositivityProved === false &&
      IMP97587_VERDICT.boundMoves === false,
    why: 'presentation-only leaf charting an already-proved closed form: no operator positivity, no bound moves, NO QED.',
  },
];

for (const t of IMP97587_ASSERTIONS) {
  if (!t.holds()) {
    throw new Error(`imp-97587-krein-farprofile-envelope-viz-data assertion FAILED: ${t.id} -- ${t.why}`);
  }
}
