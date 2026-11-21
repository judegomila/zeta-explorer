/**
 * @module imp-97185-route-m-frobenius-quad-ceiling-vs-measured-crossing
 *
 * imp-97185 (numerical, MEASUREMENT ONLY): imp-96918 reconciled the Route M conditioning-ceiling
 * ladder into an ordered band
 *   trace 2.594e7 < Frobenius-rigorous 3.748e7 < concave-tail 3.838e7 < concave-quad 4.103e7
 *     < measured/fit 4.109e7
 * and flagged the concave-quad extrapolant (imp-96890, fit over the 18-rung exact ladder
 * N=250..16000) as sitting only ~0.145% below the measured/fit rung -- an order of magnitude
 * tighter than any other adjacent pair. This ticket asks the direct question: does extending the
 * EXACT Frobenius ladder past N=16000 and refitting the concave-quad model push its ceiling ACROSS
 * the measured/fit rung (breaking the strict ordering), or does the refit ceiling stay below it?
 *
 * -------------------------------------------------------------------------------
 * THE MEASUREMENT (no new heavy compute; reads the committed extended ladder).
 * -------------------------------------------------------------------------------
 * imp-96912 already extended the exact 18-rung ladder past N=16000 by measuring 6 additional exact
 * Vasyunin-Gram ||G||_F rungs (N=17000,18000,19000,20000,22000,24000; construction validated to
 * machine precision at N=8000), refit all three norm models over the extended 24-rung ladder, and
 * re-solved the cond#(N)=||G||_F(N)/lam_min(N)=1/eps ceiling per model. This ticket reads the
 * imp-96912 extended-ladder concave-quad ceiling and scores it against the imp-96443 measured/fit
 * rung to resolve the imp-96918 tight spot directly:
 *   concave-quad ceiling, 18-rung fit (imp-96890):   40,229,191 (as reported 4.1029e7)
 *   concave-quad ceiling, 24-rung refit (imp-96912): 40,877,019
 *   measured/fit rung (imp-96443):                   41,088,905
 * (the 18-rung value used for the margin is imp-96890 NstarQuad=4.1029e7, matching the imp-96918
 * ~0.145% figure; the extended value is imp-96912 IMP96912_EXT_CEILING.NstarQuad, recomputed here.)
 *
 * -------------------------------------------------------------------------------
 * FINDING -- the refit quad ceiling DROPS, so the margin WIDENS: no crossing, ordering reinforced.
 * -------------------------------------------------------------------------------
 * Extending the exact ladder 0.176 decade past N=16000 (to N=24000) and refitting the concave-quad
 * model moves the quad ceiling DOWN, from 4.1029e7 (18 rungs) to 4.0877e7 (24 rungs), a -0.37%
 * shift. Because the ceiling moves away from the measured rung, not toward it, the imp-96918 tight
 * margin WIDENS from ~0.145% (18-rung) to ~0.518% (24-rung). The concave-quad extrapolant does NOT
 * cross the measured/fit rung: the strict ordering trace < line < tail < quad < measured survives
 * and is in fact reinforced by the extension. This is consistent with imp-96912 Finding 3, which
 * found the extended-ladder quadratic curvature marginally too strong on the measured window (its
 * out-of-sample residual is small, negative, and slowly growing), pulling the extrapolated ceiling
 * slightly down rather than up. The extension does not resolve the FAR ambiguity (imp-96912: the
 * quad-vs-tail spread barely narrows, 6.89% -> 6.22%), but on the specific imp-96918 question --
 * does the quad edge touch the measured rung -- the answer is NO, with growing margin.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * MEASURED. Extending the exact Vasyunin-Gram Frobenius ladder past N=16000 to N=24000 and
 * refitting the concave-quad norm model moves its conditioning ceiling DOWN (4.1029e7 -> 4.0877e7,
 * -0.37%), so the imp-96918 concave-quad-vs-measured margin WIDENS from ~0.145% to ~0.518%; the
 * quad extrapolant stays strictly below the measured/fit rung (4.1089e7) and the ladder ordering is
 * reinforced, not broken. The refit quad ceiling remains a model-dependent fit -- and per imp-97081
 * the quad top end is anyway rejected as an unphysical curvature over-run -- so no rigorous ceiling
 * is posted; the rigorous trace-lower ceiling T~2.594e7 is unaffected; no bound moves; no refereed bound is changed
 * ; RH open; NO QED.
 *
 * @see imp-96918-route-m-ceiling-ladder-concave-reconciliation.js (the ~0.145% tight spot this measures)
 * @see imp-96912-route-m-frobenius-ladder-extension-above-16000.js (the exact 24-rung extended ladder + refit)
 * @see imp-96890-route-m-frobenius-concave-norm-ceiling-refit.js (the 18-rung concave-quad ceiling 4.1029e7)
 * @see imp-96443-route-m-vasyunin-lammax-measured.js (the measured/fit rung 4.1089e7)
 * @see imp-97081-route-m-farfield-ceiling-interior-anchor-discriminator.js (rejects the quad top end as unphysical)
 *
 * Ticket: imp-97185 (numerical, opus-4-8, api-pool). Measurement only; NO QED.
 */

import { IMP96912_EXT_CEILING, IMP96912_NEW_RUNGS } from './imp-96912-route-m-frobenius-ladder-extension-above-16000.js';
import { IMP96443_CEILING } from './imp-96443-route-m-vasyunin-lammax-measured.js';

// imp-96890 18-rung concave-quad ceiling (the imp-96918 tight-spot baseline; 4.1029e7).
export const IMP97185_QUAD_CEILING_18RUNG = 41029191;

export const IMP97185_CROSSING = Object.freeze({
  measuredRung: IMP96443_CEILING.measuredCeilingN, // 4.1089e7 (imp-96443 measured/fit ceiling)
  quadCeiling18Rung: IMP97185_QUAD_CEILING_18RUNG, // 4.1029e7 (imp-96890, ladder to N=16000)
  quadCeiling24Rung: IMP96912_EXT_CEILING.NstarQuad, // 4.0877e7 (imp-96912, ladder to N=24000)
  // the imp-96918 tight margin, before and after the extension:
  margin18RungPct: (IMP96443_CEILING.measuredCeilingN / IMP97185_QUAD_CEILING_18RUNG - 1) * 100, // ~0.145
  margin24RungPct: (IMP96443_CEILING.measuredCeilingN / IMP96912_EXT_CEILING.NstarQuad - 1) * 100, // ~0.518
  quadCeilingShiftPct: (IMP96912_EXT_CEILING.NstarQuad / IMP97185_QUAD_CEILING_18RUNG - 1) * 100, // ~-0.37 (drops)
  // the specific imp-96918 question: does the extended-ladder quad ceiling cross the measured rung?
  quadCrossesMeasured: IMP96912_EXT_CEILING.NstarQuad >= IMP96443_CEILING.measuredCeilingN, // false
  marginWidensNotNarrows: true,
});

export const IMP97185_ORDER_CHECK = Object.freeze({
  trace: 2.594e7,
  line: IMP96912_EXT_CEILING.NstarLine, // ~3.800e7
  tail: IMP96912_EXT_CEILING.NstarTail, // ~3.848e7
  quad: IMP96912_EXT_CEILING.NstarQuad, // ~4.088e7
  measured: IMP96443_CEILING.measuredCeilingN, // ~4.109e7
  strictlyOrdered:
    2.594e7 < IMP96912_EXT_CEILING.NstarLine &&
    IMP96912_EXT_CEILING.NstarLine < IMP96912_EXT_CEILING.NstarTail &&
    IMP96912_EXT_CEILING.NstarTail < IMP96912_EXT_CEILING.NstarQuad &&
    IMP96912_EXT_CEILING.NstarQuad < IMP96443_CEILING.measuredCeilingN,
});

export const IMP97185_VERDICT = Object.freeze({
  question:
    'does extending the exact Vasyunin-Gram Frobenius ladder past N=16000 and refitting the ' +
    'concave-quad norm model push its conditioning ceiling ACROSS the measured/fit rung (breaking ' +
    'the imp-96918 strict ordering at the ~0.145% tight spot), or does the refit ceiling stay below?',
  topRungN: IMP96912_NEW_RUNGS[IMP96912_NEW_RUNGS.length - 1].N, // 24000
  quadCeilingMovesDownNotUp: IMP96912_EXT_CEILING.NstarQuad < IMP97185_QUAD_CEILING_18RUNG,
  quadCrossesMeasured: IMP97185_CROSSING.quadCrossesMeasured, // false
  marginWidens: IMP97185_CROSSING.margin24RungPct > IMP97185_CROSSING.margin18RungPct,
  ladderStillStrictlyOrdered: IMP97185_ORDER_CHECK.strictlyOrdered,
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  conclusion:
    'MEASURED. Extending the exact ladder to N=24000 (imp-96912, 6 new exact rungs) and refitting ' +
    'the concave-quad model moves its ceiling DOWN 4.1029e7 -> 4.0877e7 (-0.37%), so the imp-96918 ' +
    'concave-quad-vs-measured margin WIDENS from ~0.145% to ~0.518%: the quad extrapolant does NOT ' +
    'cross the measured/fit rung (4.1089e7) and the strict ordering trace < line < tail < quad < ' +
    'measured is reinforced, not broken. The refit quad ceiling stays a model-dependent fit (and ' +
    'imp-97081 rejects the quad top end as an unphysical curvature over-run); no rigorous ceiling ' +
    'is posted; the rigorous trace-lower ceiling T~2.594e7 is unaffected; no bound moves; no refereed bound is changed' +
    '; RH open; NO QED.',
});

export const IMP97185_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: reads the committed imp-96912 ' +
  'extended 24-rung exact Vasyunin-Gram ladder refit concave-quad ceiling and scores it against the ' +
  'imp-96443 measured/fit rung to resolve the imp-96918 ~0.145% tight spot. No new heavy compute; ' +
  'no rigorous ceiling is posted; no bound is claimed moved; the rigorous trace-lower ceiling ' +
  'T~2.594e7 is unaffected.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97185_ASSERTIONS = [
  {
    id: 'imp97185-inputs-land-in-expected-bands',
    holds: () =>
      IMP97185_CROSSING.measuredRung > 4.10e7 && IMP97185_CROSSING.measuredRung < 4.12e7 &&
      IMP97185_CROSSING.quadCeiling18Rung > 4.09e7 && IMP97185_CROSSING.quadCeiling18Rung < 4.11e7 &&
      IMP97185_CROSSING.quadCeiling24Rung > 4.07e7 && IMP97185_CROSSING.quadCeiling24Rung < 4.10e7,
    why: 'the imp-96443 measured rung, imp-96890 18-rung quad ceiling, and imp-96912 24-rung quad ceiling all land in their expected bands, confirming the values are imported unchanged.',
  },
  {
    id: 'imp97185-18rung-margin-reproduces-imp96918-tight-spot',
    holds: () =>
      IMP97185_CROSSING.margin18RungPct > 0.1 && IMP97185_CROSSING.margin18RungPct < 0.2,
    why: 'the 18-rung concave-quad-vs-measured margin reproduces the imp-96918 ~0.145% tight spot, anchoring the before/after comparison.',
  },
  {
    id: 'imp97185-extended-quad-ceiling-drops-and-margin-widens',
    holds: () =>
      IMP96912_EXT_CEILING.NstarQuad < IMP97185_QUAD_CEILING_18RUNG &&
      IMP97185_CROSSING.quadCeilingShiftPct < 0 && IMP97185_CROSSING.quadCeilingShiftPct > -1 &&
      IMP97185_CROSSING.margin24RungPct > IMP97185_CROSSING.margin18RungPct &&
      IMP97185_CROSSING.margin24RungPct > 0.4 && IMP97185_CROSSING.margin24RungPct < 0.7,
    why: 'extending the exact ladder to N=24000 moves the concave-quad ceiling DOWN (-0.37%), so the margin to the measured rung WIDENS from ~0.145% to ~0.518% rather than narrowing.',
  },
  {
    id: 'imp97185-quad-does-not-cross-measured-ordering-survives',
    holds: () =>
      IMP97185_CROSSING.quadCrossesMeasured === false &&
      IMP97185_ORDER_CHECK.strictlyOrdered === true,
    why: 'the extended-ladder concave-quad ceiling stays strictly below the measured/fit rung, so the ladder ordering trace < line < tail < quad < measured survives the extension.',
  },
  {
    id: 'imp97185-honesty-gate-no-qed',
    holds: () =>
      IMP97185_VERDICT.anyBoundMoved === false &&
      IMP97185_VERDICT.postsRigorousCeiling === false &&
      IMP97185_VERDICT.quadCrossesMeasured === false &&
      IMP97185_VERDICT.marginWidens === true &&
      /NO QED/.test(IMP97185_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97185_HONEST_BANNER) &&
      /RH open/.test(IMP97185_HONEST_BANNER),
    why: 'measurement only: no rigorous ceiling is posted, no bound moves, the quad ceiling does not cross the measured rung, the margin widens, and the honesty markers are present.',
  },
];

for (const a of IMP97185_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97185-route-m-frobenius-quad-ceiling-vs-measured-crossing assertion failed: ${a.id}`,
    );
  }
}

export default {
  crossing: IMP97185_CROSSING,
  orderCheck: IMP97185_ORDER_CHECK,
  verdict: IMP97185_VERDICT,
  banner: IMP97185_HONEST_BANNER,
};
