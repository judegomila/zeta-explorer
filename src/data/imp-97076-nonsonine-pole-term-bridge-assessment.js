/**
 * imp-97076, corrected 2026-09-30. The pole form is indefinite. The old
 * class-wide non-Sonine impossibility conclusion was not established.
 * See formalization/paper/rh-direction-audit-2026-09-30.md for the derivation.
 */
export const IMP97076_BRIDGE_STRUCTURE = Object.freeze({
  certifiedObject: 'Pole-free Weil form on smooth compact tests with hhat(+/-i/2)=0; h=Qg, Q=-d²/dx²+1/4',
  certifiedReach2a: 0.96,
  target: 'Optional fixed-support extension: in L²(-a,a), P0-perp = span{cosh(x/2), sinh(x/2)}. Intersect with the actual form domain when applying operator arguments.',
  bridgeType: 'codimension-2 positive-extension problem; a Schur complement needs domain and invertibility hypotheses',
  poleTermSign: 'INDEFINITE: P(h)=2 Re(hhat(i/2) conjugate(hhat(-i/2))); for real h this is 2(c²-s²)',
  sonineRealization: 'Failure of the particular excess inequality past ln 2 does not prove failure of every extension.',
  requiredForRH: false,
});

export const IMP97076_CANDIDATE_BRIDGES = Object.freeze([
  Object.freeze({
    tag: 'B1', name: 'Un-weighting / multiplier', nonSonine: true,
    clearsLn2: false, status: 'Generic support-preserving transfer not established',
    obstruction: 'Q inverse is nonlocal on arbitrary inputs. For h already satisfying both pole moments, hhat/(t²+1/4) is entire and compact support can be recovered. These are different cases.',
    obstructionAxis: 'support and domain',
  }),
  Object.freeze({
    tag: 'B2', name: 'Direct Krein positive extension / Schur complement', nonSonine: true,
    clearsLn2: false, status: 'OPEN: no class-wide refutation',
    retainedSonineTraceFractionAtT1: 1 / 9.11, // Historical diagnostic, not a proof.
    obstruction: 'Shared resonance windows do not establish failure of every alternative extension. A valid obstruction must specify and quantify over its candidate class.',
    obstructionAxis: 'extension remains unproved',
  }),
  Object.freeze({
    tag: 'B3', name: 'Archimedean-integral absorption', nonSonine: true,
    clearsLn2: false, status: 'OPEN: no class-wide refutation',
    obstruction: 'The pole form is not a positive measure. Support-independent definitions alone do not imply support-independent quadratic-form bounds.',
    obstructionAxis: 'signed form and quantitative estimates',
  }),
]);

export const IMP97076_VERDICT = Object.freeze({
  ticket: 'imp-97076', status: 'CORRECTED 2026-09-30',
  question: 'Can fixed-support pole-free positivity be extended to the full form?',
  resonanceFrequencyLaw: 't_k = 2 pi k / ln 2 (historical diagnostic)',
  ln2: Math.log(2), bindingDipWindow: Object.freeze([7.4, 10.8]),
  excessCarriesHalfOfRho2Cusp: true, // Scoped to the recorded Sonine split.
  candidateCount: 3, anyCandidateClearsLn2: false, // No successful bridge established here.
  sharedMechanism: 'Resonance similarity is evidence about particular constructions, not a universal no-go.',
  obstructionIsBridgeAgnosticInLocalClass: false,
  upgradesAxisII: 'WITHDRAWN: the upgrade from one failed inequality to all local/finite-rank bridges was unsupported.',
  certifiedReachUnchanged: 0.96,
  positivityTheoremEstablished: false, operatorPositivityProved: false,
  rhResolved: false, qed: false,
  subGap: 'Fixed-support full-form extension remains a separate open question. For RH, all-support pole-free positivity already suffices (Connes--Consani, Appendix C, Proposition C.1).',
});
