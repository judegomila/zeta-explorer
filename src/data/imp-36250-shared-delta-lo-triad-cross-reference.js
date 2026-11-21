/**
 * @module imp-36250-shared-delta-lo-triad-cross-reference
 *
 * imp-36250 (content, sonnet-4-6): explicit cross-reference documenting that
 * THREE separately-named floors appearing across three different modules are
 * literally the SAME open object -- a certified lower bound delta_lo(t) > 0 on
 * the minimum pairwise gap along the backward Dyson flow, valid up to
 * just-before the collision time t_c:
 *
 *   1. imp-36193 E3 -- the interval pole-reduction crux: the reciprocal-interval
 *      width of 1/[g_lo, g_hi] scales like delta_lo^{-2} and needs delta_lo(t) > 0
 *      bounded away from zero for the enclosure to stay sound near the front.
 *   2. imp-36192 I4 -- the truncation min-gap floor: the I1/I2/I3 constants
 *      (Lipschitz bound, local-truncation scale, discrete-Gronwall constant)
 *      all live on a tube whose radius IS delta_lo(t); without it they are not
 *      even well-defined N-uniformly.
 *   3. imp-2520 G-gronwall -- the ONLY module of the three that would actually
 *      SUPPLY delta_lo(t): its own internal accounting (y_star / y_N_sharp,
 *      the nearest-pair-front strip) shows the floor is Gronwall-VACUOUS
 *      exactly at the microscopic nearest-pair front, i.e. delta_lo(t) is not
 *      currently produced by anything certified.
 *
 * imp-36192 and imp-36193 already cross-reference each other (both modules'
 * own source comments say "the SAME object as..."), and imp-36246 tabulates
 * this pairing as one of two shared cruxes across the S-frontier scoping
 * family. What none of the three prior modules states explicitly in one place
 * is the closed triangle: E3 needs delta_lo(t), I4 needs delta_lo(t), and
 * G-gronwall (imp-2520) is the ONLY candidate source for delta_lo(t) but is
 * documented as vacuous at exactly the front where E3 and I4 need it. So the
 * dependency is not merely "shared" -- it is CIRCULAR at the level of the
 * whole triad: none of G-step-error, G-interval-enclosure, or G-gronwall can
 * be discharged in isolation, because discharging any one of the first two
 * requires the third, and the third is the one member of the triad currently
 * NOT delivering the object.
 *
 * Documentation only. Discharges NOTHING. Instantiates no interval. Encloses
 * no collision time. Establishes no Gronwall constant. All three obligations
 * (G-step-error imp-35058, G-interval-enclosure, G-gronwall imp-2520) stay
 * OPEN. Changes no bound. C_mb GUE-conditional (imp-486) untouched. NO QED.
 * No refereed bound is changed.
 *
 * @see imp-36192-step2-g-step-error-apriori-truncation-scope (I4)
 * @see imp-36193-step2-g-interval-enclosure-nuniform-scope (E3)
 * @see backward-flow-stability-gronwall (imp-2520, G-gronwall)
 * @see imp-36246-s-frontier-scoping-module-overview (prior pairwise cross-walk)
 */

const DELTA_LO_TRIAD = Object.freeze([
  Object.freeze({
    memberId: 'imp-36193',
    localName: 'E3 (interval pole-reduction crux)',
    role: 'CONSUMER: needs delta_lo(t) > 0 so the reciprocal-interval width delta_lo^{-2} stays bounded near t_c',
  }),
  Object.freeze({
    memberId: 'imp-36192',
    localName: 'I4 (certified gap floor / truncation min-gap floor)',
    role: 'CONSUMER: needs delta_lo(t) > 0 so the tube-Lipschitz and local-truncation constants are N-uniformly well-defined',
  }),
  Object.freeze({
    memberId: 'imp-2520',
    localName: 'G-gronwall (the nearest-pair-front y_star / y_N_sharp floor)',
    role: 'SOLE CANDIDATE SUPPLIER: the only one of the three that could produce delta_lo(t), documented Gronwall-vacuous exactly at the microscopic nearest-pair front',
  }),
]);

const CIRCULARITY_STATEMENT =
  'E3 and I4 both consume delta_lo(t); G-gronwall (imp-2520) is the sole candidate supplier of ' +
  'delta_lo(t) but is vacuous exactly at the front where E3 and I4 need it -- so none of the three ' +
  'obligations (G-step-error, G-interval-enclosure, G-gronwall) is independently dischargeable.';

export const IMP36250_SHARED_DELTA_LO_TRIAD_CROSS_REFERENCE = {
  id: 'imp-36250',
  proofSection: 'S-frontier',
  question:
    'Document the imp-36193 E3, imp-36192 I4, and imp-2520 G-gronwall floors as ONE certified ' +
    'delta_lo(t) object, making the circular dependency explicit for consumers.',
  triad: DELTA_LO_TRIAD,
  triadCount: DELTA_LO_TRIAD.length,
  sharedObject: 'delta_lo(t): a certified lower bound on the min pairwise gap along the backward Dyson flow, up to just-before t_c',
  circularityStatement: CIRCULARITY_STATEMENT,
  isRigorous: false,
  verdict:
    'CROSS-REFERENCE ONLY (documentation, not a measurement, not a proof). imp-36193 E3, imp-36192 ' +
    'I4, and imp-2520 G-gronwall all name the SAME open object delta_lo(t). imp-36192 and imp-36193 ' +
    'already note the pairwise link and imp-36246 tabulates it as a shared crux; this module adds the ' +
    'third leg explicitly -- G-gronwall (imp-2520) is the sole candidate supplier of delta_lo(t) and is ' +
    'the one documented as vacuous at the front -- closing the triangle so no consumer can discharge ' +
    'E3 or I4 without first discharging G-gronwall. Discharges NOTHING; all three obligations stay ' +
    'OPEN; changes no bound; C_mb GUE-conditional (imp-486) untouched; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-36192 (Step-2 G-step-error I1-I5, imp-35058); imp-36193 (Step-2 G-interval-enclosure E1-E5); ' +
    'imp-2520 (G-gronwall, backward-flow-stability-gronwall); imp-36246 (prior pairwise cross-walk); ' +
    'imp-486 (C_mb GUE-conditional).',
};

export const IMP36250_SHARED_DELTA_LO_TRIAD_CROSS_REFERENCE_ASSERTIONS = [
  {
    id: 'imp36250-triad-has-three-members',
    description: 'the triad names exactly the three modules imp-36193, imp-36192, imp-2520',
    holds: () =>
      IMP36250_SHARED_DELTA_LO_TRIAD_CROSS_REFERENCE.triadCount === 3 &&
      DELTA_LO_TRIAD.map((m) => m.memberId).join(',') === 'imp-36193,imp-36192,imp-2520',
  },
  {
    id: 'imp36250-gronwall-is-sole-supplier',
    description: 'imp-2520 is documented as the sole candidate supplier, not a consumer, of delta_lo(t)',
    holds: () => {
      const gronwall = DELTA_LO_TRIAD.find((m) => m.memberId === 'imp-2520');
      return !!gronwall && /SOLE CANDIDATE SUPPLIER/.test(gronwall.role);
    },
  },
  {
    id: 'imp36250-circularity-names-all-three-obligations',
    description: 'the circularity statement names G-step-error, G-interval-enclosure, and G-gronwall as jointly non-dischargeable',
    holds: () =>
      /G-step-error/.test(CIRCULARITY_STATEMENT) &&
      /G-interval-enclosure/.test(CIRCULARITY_STATEMENT) &&
      /G-gronwall/.test(CIRCULARITY_STATEMENT) &&
      /none of the three/.test(CIRCULARITY_STATEMENT),
  },
  {
    id: 'imp36250-honesty-gate-no-qed',
    description: 'cross-reference only: not rigorous, discharges nothing, no QED, no refereed bound is changed',
    holds: () =>
      IMP36250_SHARED_DELTA_LO_TRIAD_CROSS_REFERENCE.isRigorous === false &&
      /NO QED/.test(IMP36250_SHARED_DELTA_LO_TRIAD_CROSS_REFERENCE.verdict) &&
      /refereed bound is changed/i.test(IMP36250_SHARED_DELTA_LO_TRIAD_CROSS_REFERENCE.verdict),
  },
];

for (const a of IMP36250_SHARED_DELTA_LO_TRIAD_CROSS_REFERENCE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36250-shared-delta-lo-triad-cross-reference assertion failed: ${a.id}`);
  }
}

export default IMP36250_SHARED_DELTA_LO_TRIAD_CROSS_REFERENCE;
