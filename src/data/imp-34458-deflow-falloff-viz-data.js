/**
 * @module imp-34458-deflow-falloff-viz-data
 * @fileoverview imp-34458 -- VIZ DATA ONLY for the imp-34373 deflow(k) = resid_full - resid_noflow
 *   monotone falloff toward the imp-34169 resid_exp pole k* &asymp; 21.28095, and the E_flow share
 *   of the imp-34211 kEnd gap this falloff produces at each rung.
 *
 *   imp-34373 pushed the M2-residual balance point toward the pole via a threshold family
 *   resid(kEnd) = thr, thr -> 0+, and found BOTH the E_flow additive contribution to the residual
 *   (deflow) and the E_flow root-shift share of the imp-34211 gap fall off monotonically as the
 *   balance point approaches k* -- the crossing value is the MINIMUM of the family, not a maximum,
 *   so the closed-form "E_flow negligible" assumption STRENGTHENS toward the pole.
 *
 *   Values below are baked reference literals, reproduced exactly from the imp-34373 module's
 *   POLE_APPROACH_TABLE export (direct re-statement, not re-derived here). This module does NOT
 *   import lambda-rh-height-mapping.js or polymath15-constant-C-C.js -- no fresh computation, per
 *   [[no_heavy_imports_in_pages]].
 *
 *   @see imp-34373-eflow-share-near-pole.js (source measurement: the pole-approach sweep)
 *   @see imp-34285-closedform-gap-term-decomposition (the crossing E_flow share this generalizes)
 *   @see imp-34169-fixed-band-peak-extended-decade-surrogate-zero (the resid_exp pole k* &asymp; 21.28095)
 *
 *   Ticket: imp-34458 (ux, medium). Presentation only of an already-established measurement; adds
 *   no new Lambda bound. Component model is the inherited surrogate diagnostic, NOT rigorous;
 *   C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a>=0 untouched; NO QED; no refereed bound is changed.
 */

// -- the baked imp-34373 pole-approach table: thr sweep from 1e-4 down to 1e-8 --
// Reproduced verbatim from imp-34373's POLE_APPROACH_TABLE export (direct re-statement).
export const IMP34458_POLE_APPROACH_TABLE = Object.freeze([
  Object.freeze({ thr: 1e-4, kEnd: 15.9763, distToPole: 5.3047, eflowShareOfGap: 4.069e-5, eflowContribToResid: 1.267e-9 }),
  Object.freeze({ thr: 3e-5, kEnd: 17.0439, distToPole: 4.2370, eflowShareOfGap: 1.410e-5, eflowContribToResid: 1.333e-10 }),
  Object.freeze({ thr: 1e-5, kEnd: 18.0023, distToPole: 3.2786, eflowShareOfGap: 5.411e-6, eflowContribToResid: 1.745e-11 }),
  Object.freeze({ thr: 3e-6, kEnd: 19.0108, distToPole: 2.2701, eflowShareOfGap: 1.970e-6, eflowContribToResid: 2.034e-12 }),
  Object.freeze({ thr: 1e-6, kEnd: 19.8430, distToPole: 1.4379, eflowShareOfGap: 8.601e-7, eflowContribToResid: 3.426e-13 }),
  Object.freeze({ thr: 3e-7, kEnd: 20.5606, distToPole: 0.7203, eflowShareOfGap: 4.244e-7, eflowContribToResid: 7.339e-14 }),
  Object.freeze({ thr: 1e-7, kEnd: 20.9660, distToPole: 0.3150, eflowShareOfGap: 2.898e-7, eflowContribToResid: 3.053e-14 }),
  Object.freeze({ thr: 3e-8, kEnd: 21.1730, distToPole: 0.1080, eflowShareOfGap: 2.329e-7, eflowContribToResid: 2.004e-14 }),
  Object.freeze({ thr: 1e-8, kEnd: 21.2433, distToPole: 0.0376, eflowShareOfGap: 2.319e-7, eflowContribToResid: 1.671e-14 }),
]);

// -- the crossing (resid=0) floor the family approaches, reproducing imp-34285 --
export const IMP34458_CROSSING = Object.freeze({
  kStar: 21.28095,
  crossingShare: 2.167e-7,
});

export const IMP34458_SUMMARY = Object.freeze({
  farShare: IMP34458_POLE_APPROACH_TABLE[0].eflowShareOfGap, // ~4.07e-5
  nearShare: IMP34458_POLE_APPROACH_TABLE[IMP34458_POLE_APPROACH_TABLE.length - 1].eflowShareOfGap, // ~2.32e-7
  farOverNearShareRatio: 175.46,
  farContrib: IMP34458_POLE_APPROACH_TABLE[0].eflowContribToResid, // ~1.27e-9
  nearContrib: IMP34458_POLE_APPROACH_TABLE[IMP34458_POLE_APPROACH_TABLE.length - 1].eflowContribToResid, // ~1.67e-14
});

export default Object.freeze({
  id: 'imp-34458-deflow-falloff-viz-data',
  ticket: 'imp-34458',
  source: ['imp-34373-eflow-share-near-pole.js'],
  poleApproachTable: IMP34458_POLE_APPROACH_TABLE,
  crossing: IMP34458_CROSSING,
  summary: IMP34458_SUMMARY,
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP34458_ASSERTIONS = [
  {
    id: 'imp34458-nine-rungs-approaching-pole',
    holds: () => {
      const t = IMP34458_POLE_APPROACH_TABLE;
      return t.length === 9 && t.every((r, i) => i === 0 || r.distToPole < t[i - 1].distToPole);
    },
    why: 'The threshold sweep must monotonically approach the pole (strictly shrinking distToPole) at every step.',
  },
  {
    id: 'imp34458-deflow-and-share-strictly-decreasing',
    holds: () => {
      const t = IMP34458_POLE_APPROACH_TABLE;
      return (
        t.every((r, i) => i === 0 || r.eflowShareOfGap < t[i - 1].eflowShareOfGap) &&
        t.every((r, i) => i === 0 || Math.abs(r.eflowContribToResid) < Math.abs(t[i - 1].eflowContribToResid))
      );
    },
    why: 'Both deflow(k) and the E_flow share must strictly decrease toward the pole, matching the imp-34373 finding that the crossing is the MINIMUM of the family, not a maximum.',
  },
  {
    id: 'imp34458-crossing-share-below-nearest-rung',
    holds: () => IMP34458_CROSSING.crossingShare < IMP34458_SUMMARY.nearShare,
    why: 'The crossing floor sits below the nearest computable rung, consistent with the family bottoming out at the pole.',
  },
  {
    id: 'imp34458-far-over-near-ratio-large',
    holds: () => IMP34458_SUMMARY.farOverNearShareRatio > 100 && IMP34458_SUMMARY.farShare > IMP34458_SUMMARY.nearShare,
    why: 'The far-below-pole share must exceed the nearest-pole share by a large factor (~175x per imp-34373), unambiguously not growing toward the pole.',
  },
];

for (const assertion of IMP34458_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-34458-deflow-falloff-viz-data assertion failed: ${assertion.id}`);
  }
}
