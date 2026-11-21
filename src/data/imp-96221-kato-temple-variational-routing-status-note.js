/**
 * imp-96221 -- plain consumer status/routing note recording that imp-96188
 * confirmed the Route I variational (Rayleigh / Kato-Temple) certificate on
 * the real semilocal {oo,2} prolate spectrum is HARDER to reach than the
 * imp-96169 stylized toy indicated, so it is NOT the live strict-gap
 * carrier. The strict gap stays with the analytic no-modulus-1 route
 * (SG-96164-boundary / SG-96181-edge-octave).
 *
 * GRADE: documentation only. This module imports no heavy bundle and
 * proves nothing new; it restates the imp-96188 NET/RESIDUAL ROUTING
 * paragraph as a {item, status, note} ledger, in the same shape used by
 * the imp-95457 WHAT-REMAINS status note.
 *
 * WHY THIS NOTE. imp-96188 measured that the real spectrum carries a
 * SECOND near-modulus-1 eigenvalue lam_S(1) = -0.9927022 at the bottom
 * (absent from the imp-96169 toy), which is why the adjacent-state leak
 * threshold tightens from 1.174e-2 (toy) to 8.416e-3 (real, ~28% tighter)
 * and the bottom-twin leak threshold collapses to 1.192e-3 (~10x tighter),
 * with Kato-Temple validity itself failing past overlap eps ~ 0.3245.
 * Without an explicit routing pointer, a downstream reader could mistake
 * the variational route for a viable certificate; this note re-points them
 * to the analytic edge-octave route (SG-96164-boundary / SG-96181-edge-octave)
 * confirmed as the live strict-gap carrier on the real spectrum.
 *
 * Changes no Lambda bound; NO QED; no refereed bound is changed
 * ; RH open.
 */

export const KATO_TEMPLE_VARIATIONAL_ROUTING_STATUS = [
  {
    item: 'Route I variational (Rayleigh / Kato-Temple) certificate, real semilocal {oo,2} spectrum',
    status: 'OBSTRUCTED, NOT A LIVE CERTIFICATE',
    note:
      'imp-96188 measured the real spectrum makes the ~1% eigenvector-capture ' +
      'requirement STRICTER than the imp-96169 toy, not looser: adjacent-state ' +
      'leak threshold eps ~ 8.416e-3 (toy 1.174e-2, ~28% tighter), bottom-twin ' +
      'leak threshold eps ~ 1.192e-3 (~10x tighter), because a SECOND ' +
      'near-modulus-1 eigenvalue lam_S(1) = -0.9927022 (absent from the toy) ' +
      'inflates sigma^2 and drags R toward the anchor; Kato-Temple validity ' +
      'itself fails past eps ~ 0.3245',
  },
  {
    item: 'Live strict-gap carrier on the real spectrum',
    status: 'ANALYTIC NO-MODULUS-1 ROUTE',
    note:
      'SG-96164-boundary (src/data/imp-96164-route-i-mixed-group-no-modulus1-overdetermination.js) ' +
      'and SG-96181-edge-octave (src/data/imp-96181-route-i-sg-boundary-edge-octave.js) carry the ' +
      'strict gap; downstream readers should route there, not to Kato-Temple',
  },
  {
    item: 'Consumer guidance',
    status: 'RECORDED',
    note:
      'do not treat the Route I variational route as a viable certificate; ' +
      'the imp-96169 toy understated the obstruction, it did not overstate it',
  },
];

export const KATO_TEMPLE_VARIATIONAL_ROUTING_SUMMARY = {
  obstructedRoute: 'Route I variational (Rayleigh / Kato-Temple), imp-96169 / imp-96188',
  liveStrictGapCarrier: 'SG-96164-boundary / SG-96181-edge-octave',
  toyThresholdEps: 0.011744840,
  adjacentThresholdEps: 0.008415876,
  bottomTwinThresholdEps: 0.001192419,
  ktValidityBoundaryEps: 0.324544,
  obstructionConfirmedStricterThanToy: true,
  boundChange: false,
  qed: false,
};

export const IMP_96221_KATO_TEMPLE_VARIATIONAL_ROUTING_STATUS_NOTE = {
  id: 'imp-96221-kato-temple-variational-routing-status-note',
  title:
    'imp-96188 confirms the Route I variational (Rayleigh/Kato-Temple) route is HARDER ' +
    'to reach on the real semilocal {oo,2} spectrum than the toy indicated: re-point ' +
    'downstream readers to the analytic no-modulus-1 route (SG-96164-boundary / ' +
    'SG-96181-edge-octave) as the live strict-gap carrier',
  status: KATO_TEMPLE_VARIATIONAL_ROUTING_STATUS,
  summary: KATO_TEMPLE_VARIATIONAL_ROUTING_SUMMARY,
  note:
    'documentation only, citing imp-96169 (stylized toy threshold), imp-96188 ' +
    '(real-spectrum recalibration), imp-96164 and imp-96181 (the analytic ' +
    'no-modulus-1 route); no Lambda bound moves; no refereed bound is changed' +
    '; RH open',
  closesTickets: ['imp-96221'],
};

// -- assertions (import-light; exact-literal consistency only) -------------
export const IMP_96221_ASSERTIONS = [
  {
    id: 'imp-96221-three-status-rows',
    holds: () => KATO_TEMPLE_VARIATIONAL_ROUTING_STATUS.length === 3,
    why: 'the note names exactly three items: the obstructed variational route, the live strict-gap carrier, and the consumer guidance.',
  },
  {
    id: 'imp-96221-variational-route-obstructed',
    holds: () =>
      KATO_TEMPLE_VARIATIONAL_ROUTING_STATUS.some(
        (row) => row.item.includes('variational') && row.status === 'OBSTRUCTED, NOT A LIVE CERTIFICATE',
      ),
    why: 'the imp-96188 finding must be recorded as an obstruction, not merely a measurement.',
  },
  {
    id: 'imp-96221-live-carrier-named',
    holds: () =>
      KATO_TEMPLE_VARIATIONAL_ROUTING_STATUS.some(
        (row) => row.item.includes('Live strict-gap carrier') && /SG-96164-boundary/.test(row.note) && /SG-96181-edge-octave/.test(row.note),
      ),
    why: 'both sub-gap ids of the analytic no-modulus-1 route must be named as the live carrier.',
  },
  {
    id: 'imp-96221-thresholds-match-imp-96188',
    holds: () => {
      const s = KATO_TEMPLE_VARIATIONAL_ROUTING_SUMMARY;
      return s.toyThresholdEps === 0.011744840 &&
        s.adjacentThresholdEps === 0.008415876 &&
        s.bottomTwinThresholdEps === 0.001192419 &&
        s.ktValidityBoundaryEps === 0.324544;
    },
    why: 'the recalibrated thresholds must match the imp-96188 baked literals exactly.',
  },
  {
    id: 'imp-96221-not-a-bound',
    holds: () =>
      KATO_TEMPLE_VARIATIONAL_ROUTING_SUMMARY.boundChange === false &&
      KATO_TEMPLE_VARIATIONAL_ROUTING_SUMMARY.qed === false,
    why: 'this is a documentation status note; it moves no Lambda bound and proves no QED.',
  },
  {
    id: 'imp-96221-closes-self',
    holds: () => IMP_96221_KATO_TEMPLE_VARIATIONAL_ROUTING_STATUS_NOTE.closesTickets.includes('imp-96221'),
    why: 'this module is the deliverable the imp-96221 ticket asked for.',
  },
];

for (const a of IMP_96221_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96221-kato-temple-variational-routing-status-note assertion failed: ${a.id}`);
  }
}

export default IMP_96221_KATO_TEMPLE_VARIATIONAL_ROUTING_STATUS_NOTE;
