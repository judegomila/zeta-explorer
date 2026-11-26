/**
 * imp-97049, corrected 2026-09-30. The former three-independent-axes verdict
 * confused a fixed-support extension with the all-support RH criterion.
 * Connes--Consani, arXiv:2006.13771, Appendix C, Proposition C.1 permits
 * Mellin vanishing at {0,1}; in centered Fourier coordinates these are +/-i/2.
 * Export names and axis IDs remain stable for historical cross-references.
 */
export const IMP97049_OBSTRUCTION_AXES = Object.freeze([
  Object.freeze({
    axis: 'I',
    name: 'REACH -- positivity for every smooth pole-free test over unbounded supports',
    containsNamedBlockers: true,
    blockers: Object.freeze([
      'LP conditioning limits the current search; optimizer failure is not an impossibility theorem.',
      'A finite Galerkin minimum bounds the full infimum from above; positive Ritz values alone do not prove positivity.',
      'Crossing log(3), log(4), and later prime-power thresholds changes the exact arithmetic form.',
    ]),
    namedBlockersAreOneAxisNotTwo: true,
    source: 'Route I certificate; Connes--Consani Appendix C, Proposition C.1',
  }),
  Object.freeze({
    axis: 'II',
    name: 'POLE TERM -- optional fixed-support extension, not an additional RH prerequisite',
    independentOfAxisI: false,
    requiredForRH: false,
    obstructionAt2a: Math.log(2),
    bridge: 'The recorded Sonine/excess sufficient inequality has a route-specific obstruction.',
    gapFreeBelowLn3: false,
    remainderShareOfTraceRange: Object.freeze([0.967, 0.9971]),
    omittedByTicketTitlePair: true,
    source: 'Historical Sonine diagnostics do not refute all possible extensions.',
  }),
  Object.freeze({
    axis: 'III',
    name: 'CRITERION COMPLETENESS -- all tests on unbounded nested supports suffice',
    independentOfAxesIandII: false,
    carriesProvenNoGo: false,
    noGo: 'No extra uniform positive margin or limiting theorem is required once every compact test is covered. Finite support lists or finite trial spaces are insufficient.',
    source: 'Connes--Consani Appendix C, Proposition C.1; compact-support quantifiers',
  }),
]);

export const IMP97049_EXHAUSTIVENESS = Object.freeze({
  ticket: 'imp-97049',
  status: 'CORRECTED 2026-09-30: three-independent-axes claim withdrawn',
  question: 'What remains between the local pole-free certificate and RH?',
  namedBlockersLiveOnSameAxis: 'I (REACH)',
  namedBlockersExhaustGap: false,
  additionalIndependentAxes: Object.freeze([]),
  totalOrthogonalAxes: 1,
  axisLevelEnumerationComplete: false,
  // Clearing two local numerical issues need not cover unbounded supports.
  bridgePossibleByClearingNamedBlockersAlone: false,
  axisIIIhasProvenNoGoAgainstSoftClosure: false,
  certifiedReachUnchanged: 0.96,
  positivityTheoremEstablished: false,
  operatorPositivityProved: false,
  rhResolved: false,
  qed: false,
  subGap: 'Establish the exact arithmetic pole-free form for all compact smooth tests on unbounded supports. No mandatory pole-inclusive bridge, no separate uniform-margin requirement, and no general analytic-method no-go.',
  reference: 'https://arxiv.org/pdf/2006.13771#page=51',
});
