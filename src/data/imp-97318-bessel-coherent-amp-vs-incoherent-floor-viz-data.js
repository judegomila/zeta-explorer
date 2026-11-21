/**
 * @module imp-97318-bessel-coherent-amp-vs-incoherent-floor-viz-data
 *
 * imp-97318 (ux): import-light viz-data leaf for the imp-97294 per-order coherent Bessel-remainder
 * amplitudes amp_j = sqrt(P_j^2 + Q_j^2) against the imp-97263 incoherent triangle-inequality floors
 * SUM_k |d_k| a_j(k), shipped there only as prose/table. Reshapes IMP97294_PER_ORDER (orders j=3..7)
 * verbatim into a chart-ready series with a per-row tighten ratio, plus the two headline collapses
 * IMP97294_COHERENT_MAJORANT already computed: the leading j=3 floor 192780 -> 45178 (4.27x) and the
 * uniform tail constant 2.080e5 -> 5.409e4 (3.84x).
 *
 * Pure re-export/reshape of the imp-97294 verbatim literals; no re-derivation of the harmonic collapse
 * or the Hankel a_j(k) coefficients. Presentation only: no new Lambda bound; no refereed bound is changed;
 * RH open; NO QED.
 *
 * @see imp-97294-krein-bessel-z4-coherent-jfreq-majorant.js (IMP97294_PER_ORDER, IMP97294_COHERENT_MAJORANT)
 * @see imp-97263-krein-analytic-bessel-z4-remainder-majorant.js (the incoherent triangle-inequality floor)
 *
 * Ticket: imp-97318 (ux, sonnet-4-6, low). Presentation only, RH-free; changes no bound; NO QED.
 *
 * Import-light: one light literal import (imp-97294 per-order table), no zeros bundle.
 */

import { IMP97294_PER_ORDER, IMP97294_COHERENT_MAJORANT } from './imp-97294-krein-bessel-z4-coherent-jfreq-majorant.js';

export const IMP97318_ROWS = IMP97294_PER_ORDER.map((r) => ({
  j: r.j,
  coherentAmp: r.amp,
  incoherentFloor: r.incoherentFloor,
  tightenRatio: r.tightenRatio,
}));

export const IMP97318_HEADLINE = Object.freeze({
  leadingOrder: 3,
  leadingCoherentAmp: IMP97294_COHERENT_MAJORANT.amp3, // ~45178
  leadingIncoherentFloor: IMP97294_COHERENT_MAJORANT.incoherentFloor3, // 192780
  leadingTightenRatio: IMP97294_COHERENT_MAJORANT.leadingTightenRatio, // ~4.27x
  uniformCoherentConstant: IMP97294_COHERENT_MAJORANT.C_coh, // ~5.409e4
  uniformIncoherentConstant: IMP97294_COHERENT_MAJORANT.C_incoherent, // ~2.080e5
  uniformTightenRatio: IMP97294_COHERENT_MAJORANT.tightenRatio, // ~3.84x
});

export const IMP97318_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: the coherent amplitudes and ' +
  'incoherent floors are copied verbatim from imp-97294 (no re-derivation of the per-frequency harmonic ' +
  'collapse or the Hankel a_j(k) coefficients). imp-97294 tightens the imp-97263 z^-4 remainder majorant, ' +
  'it does not close the full g(t)=O(t^-4) certificate: Obstruction B (imp-97164 degree-to-v0 overlap ' +
  'inversion) stays open, and no operator positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97318_ASSERTIONS = [
  {
    id: 'imp97318-five-orders-present',
    holds: () => IMP97318_ROWS.length === 5 && IMP97318_ROWS.every((r, i) => r.j === i + 3),
    why: 'imp-97294 tabulates orders j=3..7 (five rows) for the annihilating trial degrees k=3..7.',
  },
  {
    id: 'imp97318-coherent-amp-never-exceeds-incoherent-floor',
    holds: () => IMP97318_ROWS.every((r) => r.coherentAmp <= r.incoherentFloor + 1e-9 && r.tightenRatio >= 1 - 1e-9),
    why: 'the coherent amplitude amp_j = sqrt(P_j^2+Q_j^2) is bounded by the triangle-inequality floor SUM_k |d_k| a_j(k) at every order, so the tighten ratio is always >= 1.',
  },
  {
    id: 'imp97318-leading-order-matches-headline',
    holds: () => {
      const r3 = IMP97318_ROWS.find((r) => r.j === 3);
      return (
        Math.abs(r3.coherentAmp - IMP97318_HEADLINE.leadingCoherentAmp) < 1e-6 &&
        r3.incoherentFloor === IMP97318_HEADLINE.leadingIncoherentFloor &&
        IMP97318_HEADLINE.leadingIncoherentFloor === 192780 &&
        Math.abs(IMP97318_HEADLINE.leadingCoherentAmp - Math.hypot(3465, 45045)) < 1e-6
      );
    },
    why: 'the j=3 row must match the imp-97294 headline collapse 192780 -> sqrt(3465^2+45045^2) ~= 45178 (~4.27x).',
  },
  {
    id: 'imp97318-uniform-constants-tighter-and-consistent',
    holds: () =>
      IMP97318_HEADLINE.uniformCoherentConstant > 0 &&
      IMP97318_HEADLINE.uniformCoherentConstant < IMP97318_HEADLINE.uniformIncoherentConstant &&
      IMP97318_HEADLINE.uniformTightenRatio > 3 &&
      IMP97318_HEADLINE.uniformTightenRatio < 5,
    why: 'the uniform-tail constant C_coh must sit strictly below the imp-97263 incoherent C, at the imp-97294 measured ~3.84x tighten ratio.',
  },
  {
    id: 'imp97318-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP97318_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97318_HONEST_BANNER) &&
      /NO QED/.test(IMP97318_HONEST_BANNER),
    why: 'every Krein-route viz surface carries the RH-open / PT-Lambda / NO-QED markers.',
  },
];

for (const a of IMP97318_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97318-bessel-coherent-amp-vs-incoherent-floor-viz-data assertion failed: ${a.id}`);
  }
}

export default {
  rows: IMP97318_ROWS,
  headline: IMP97318_HEADLINE,
  banner: IMP97318_HONEST_BANNER,
};
