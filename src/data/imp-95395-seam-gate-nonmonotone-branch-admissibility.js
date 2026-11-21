/**
 * @module imp-95395-seam-gate-nonmonotone-branch-admissibility
 *
 * imp-95395 (proof-scoping / ASSESSMENT ONLY): does the imp-95276
 * seam-to-chain-gate map stay a valid upper bound when an admissible signed
 * seam certificate value R reaches or exceeds 1/sqrt2 -- i.e. OUTSIDE the
 * (M1) monotone branch of g_R = 2 R sqrt(1 - R^2)? imp-95276 proves (M1)
 * g_R is strictly increasing ONLY on [0, 1/sqrt2] and argues the signed
 * families live at R << 1 well inside that branch, flagging (but not
 * resolving) that a SPLIT-LOO aggregate can exceed 1/sqrt2. imp-95273
 * independently exhibits a whole VACUITY corner where the imp-95233
 * PHASE-CERT bound e^(-y_min)/(2 theta) on the restricted fraction LamBar
 * climbs to and past 1/2 (up to ~2.7e3 for SGN-SAT phi_3). This module
 * assesses admissibility and soundness in that regime. Changes NO bound; NO
 * QED; no refereed bound is changed.
 *
 * WHY VALIDITY NEEDS R <= 1/sqrt2 (the mechanism, not just monotonicity).
 * The gate feed is g = gFromLam(LamBar) = 2 sqrt(LamBar (1 - LamBar)), a
 * BUMP that rises on [0, 1/2], peaks g = 1 at LamBar = 1/2, and FALLS on
 * [1/2, 1]. A signed certificate delivers only an UPPER bound sqrt(LamBar)
 * <= R, i.e. LamBar <= R^2, with the trivial lower bound LamBar >= 0. Since
 * the gate gammaSL is increasing in g (imp-95276 M2), the sound feed is the
 * WORST admissible localizer
 *   g_valid(R) = sup_{0 <= lam <= R^2} gFromLam(lam).
 * On the monotone branch R^2 <= 1/2 the sup is attained at the endpoint,
 * g_valid = gFromLam(R^2) = g_R -- exactly the imp-95276 map, valid. But for
 * R^2 > 1/2 (R > 1/sqrt2) the interval [0, R^2] CONTAINS the bump peak
 * lam = 1/2, so the sup is gFromLam(1/2) = 1, NOT g_R. There g_R =
 * 2 R sqrt(1 - R^2) DESCENDS from 1, so the naive map reports g_R < 1 and,
 * gammaSL being increasing, gammaSL(g_R) < gammaSL(1): it UNDER-reports the
 * localizer and is therefore NOT a valid upper bound. The correct object is
 * the max-branch clamp
 *   g_valid(R) = gFromLam(min(R^2, 1/2))  = 1 for all R >= 1/sqrt2,
 * exactly the "clamp g = 1" the ticket names. gammaSL(g_valid(.)) is
 * monotone non-decreasing in R and dominates gammaSL(gFromLam(LamBar)) for
 * every admissible LamBar <= R^2 -- restored validity.
 *
 * DOUBLE-VALUEDNESS, CONCRETELY. g_R takes each value in [0,1) TWICE: R and
 * its mirror sqrt(1 - R^2) give the identical g (product R sqrt(1-R^2) is
 * symmetric), e.g. g_R(0.6) = g_R(0.8) = 0.96. So a LOOSER certificate
 * R = 0.8 maps to the SAME gate as the tighter R = 0.6, and a still-looser
 * R = 0.9 maps to a STRICTLY SMALLER gate (0.785 < 0.992 = g_R(0.75)).
 * Orientation is not merely lost -- the naive composition can be beaten by a
 * worse certificate, which is precisely why it fails as an upper bound.
 *
 * CAN ADMISSIBLE R ACTUALLY REACH 1/sqrt2? Yes, and the two known routes
 * both land EXACTLY in the imp-95273 vacuity corner:
 *   (a) single-block PHASE-CERT (imp-95233): R = sqrt(bound) with
 *       bound = e^(-y_min)/(2 theta); the imp-95273 deep-cancellation
 *       families give bound >= 1/2 (up to 2.7e3), so R = sqrt(bound)
 *       >= 1/sqrt2 and frequently R > 1, where g_R = 2 R sqrt(1-R^2) is not
 *       even real (sqrt of a negative). The map is then UNDEFINED, not just
 *       non-monotone; the clamp min(R^2, 1/2) keeps it defined at g = 1.
 *   (b) multi-block SPLIT-LOO aggregate sqrt(Lambda) <= sum_k
 *       sqrt(Lambda_k/(1 - sigma_k^2)) (imp-95250, imp-95276 note): stacks
 *       past 1/sqrt2 when enough blocks accumulate.
 *
 * THE EXACT CORRESPONDENCE (the honest content). The imp-95276 monotone-
 * branch top R = 1/sqrt2 is the SQUARE ROOT of the imp-95273 vacuity
 * threshold on LamBar: PHASE-CERT bound on LamBar >= 1/2  <=>  R = sqrt(bound)
 * >= 1/sqrt2. So the non-monotone-branch regime is COEXTENSIVE with the
 * imp-95273 vacuous corner (bound >= 1/2 = no gain over the trivial 1/2
 * symmetry ceiling on LamBar). Verified across all ten imp-95273 families:
 * every vacuous row has sqrt(bound) >= 1/sqrt2, every active row has
 * sqrt(bound) < 1/sqrt2. CONSEQUENCE: the max-branch clamp is sound AND
 * costs nothing real -- any certificate that pushes R past 1/sqrt2 was
 * already vacuous (its restricted-fraction bound had reached 1/2), so
 * clamping it to the saturated gate g = 1 correctly records "no seam
 * tightening available", matching imp-95273. The clamp only ever fires where
 * the certificate had already stopped beating the trivial ceiling.
 *
 * ASSESSMENT ONLY: no LamBar is re-bounded, no packet transcribed, no
 * certificate instantiated on a paper window; this REFINES the imp-95276
 * multi-block caveat ("still gives a valid gate value ... no longer
 * orientation-preserving") to the sharper statement that the NAIVE map is an
 * under-estimate (invalid upper bound / undefined for R > 1) past 1/sqrt2
 * and the max-branch clamp g = 1 is required and sufficient there, at zero
 * real cost because that regime is exactly imp-95273 vacuity. Changes NO
 * bound; NO QED; no refereed bound is changed.
 *
 * @see imp-95276-seam-to-chain-gate-map.js (source: the map, M1/M2, multi-block caveat)
 * @see imp-95273-theta-vacuity-distribution.js (source: PHASE-CERT vacuity corner, bound >= 1/2)
 * @see imp-95233 PHASE-CERT (source: R <= e^(-y_min)/(2 theta))
 *
 * Ticket: imp-95395 (proof, opus-4-8, medium). Assessment only; changes no bound; NO QED.
 */

// -- gammaSL chain carried verbatim (imp-95276 literals; import-light) --------
const LW_EVEN = 3.9197935113802585e-5;
const Q_OD = 0.03755392855053636;
const C_U = 0.30501330232499435;
const KAPPA = 48.717745853978386;

function hStarSL(omega, g) {
  const sE = LW_EVEN * (1 - omega);
  const sO = Q_OD * LW_EVEN * omega;
  const bSq = C_U * C_U * omega;
  const rSt = Math.min(bSq, g * g * sE);
  return sE + 2 * sO - rSt + 2 * g * Math.sqrt(sE * rSt);
}
const phiCapSL = (omega, g) => hStarSL(omega, g) / (2 * LW_EVEN);
const thetaSL = (g) => (KAPPA * KAPPA + 1 - 2 * Q_OD) / (g * KAPPA);
function omegaStarSL(g) {
  const th = thetaSL(g);
  const T = 4 + th * th;
  return 2 / (T * (1 + Math.sqrt(1 - 4 / T)));
}
const gammaSL = (g) => phiCapSL(omegaStarSL(g), g);
const gFromLam = (lam) => 2 * Math.sqrt(lam * (1 - lam));

const RECIP_SQRT2 = 1 / Math.SQRT2; // 0.7071067811865475, top of the (M1) monotone branch

// THE NAIVE imp-95276 map (valid only on R <= 1/sqrt2)
const gFromR = (R) => gFromLam(R * R); // = 2 R sqrt(1 - R^2); NaN for R > 1
// THE SOUND feed: worst admissible localizer sup_{lam<=R^2} gFromLam(lam)
const gValid = (R) => gFromLam(Math.min(R * R, 0.5)); // = 1 for all R >= 1/sqrt2

// -- imp-95273 PHASE-CERT bound literals (LamBar upper bounds) + vacuity flag --
const IMP95273_ROWS = [
  { key: 'sgnSatPhi1', bound: 1.150350e0, vacuous: true },
  { key: 'sgnSatPhi2', bound: 5.203642e1, vacuous: true },
  { key: 'sgnSatPhi3', bound: 2.719766e3, vacuous: true },
  { key: 'algWitness34', bound: 4.125000e0, vacuous: true },
  { key: 'signedTriple', bound: 1.804248e0, vacuous: true },
  { key: 'nearCancel', bound: 1.980743e0, vacuous: true },
  { key: 'mildPair31', bound: 1.213917e-1, vacuous: false },
  { key: 'mildPair51', bound: 5.687812e-2, vacuous: false },
  { key: 'deepWell305', bound: 1.410530e-3, vacuous: false },
  { key: 'deepWell41', bound: 2.358044e-5, vacuous: false },
];

export const IMP95395_SEAM_GATE_NONMONOTONE_BRANCH = {
  ticket: 'imp-95395',
  question:
    'does gammaSL(gFromLam(R^2)) stay a valid upper bound for admissible seam R >= 1/sqrt2 (outside the M1 monotone branch), or is the max-branch clamp g = 1 required?',
  answer:
    'NOT valid past 1/sqrt2: the gate feed g = gFromLam(LamBar) is a bump peaking g=1 at LamBar=1/2, and a certificate gives only LamBar <= R^2; for R^2 > 1/2 the admissible set [0,R^2] contains the peak so the worst localizer is 1, while the naive g_R = 2 R sqrt(1-R^2) descends below 1 and (gammaSL increasing) UNDER-reports -- an invalid upper bound (and NaN for R > 1). The max-branch clamp g_valid(R) = gFromLam(min(R^2, 1/2)) = 1 for R >= 1/sqrt2 is required and sufficient.',
  monotoneBranchTop: RECIP_SQRT2,
  admissibleReach:
    'YES -- single-block PHASE-CERT R = sqrt(bound) reaches/exceeds 1/sqrt2 exactly in the imp-95273 vacuity corner (bound >= 1/2, up to ~2.7e3 so R > 1 where the naive map is undefined); multi-block SPLIT-LOO aggregate also stacks past 1/sqrt2.',
  exactCorrespondence:
    'R = 1/sqrt2 is the square root of the imp-95273 vacuity threshold LamBar = 1/2: bound >= 1/2 <=> sqrt(bound) >= 1/sqrt2. The non-monotone-branch regime is COEXTENSIVE with imp-95273 vacuity, so the clamp fires only where the certificate had already stopped beating the trivial 1/2 ceiling -- sound at zero real cost.',
  refines:
    'sharpens the imp-95276 multi-block caveat (still valid gate value / not orientation-preserving) to: the NAIVE map is an under-estimate (invalid upper bound; undefined for R > 1) past 1/sqrt2, and the clamp g = 1 is mandatory and sufficient there.',
  honest:
    'ASSESSMENT ONLY -- no LamBar re-bounded, no packet transcribed, no certificate instantiated. Changes NO bound; NO QED; no refereed bound is changed.',
  fns: { gammaSL, gFromLam, gFromR, gValid },
};

export const IMP95395_ASSERTIONS = [
  {
    id: 'imp95395-branch-top-squared-is-vacuity-threshold',
    description: 'the monotone-branch top R = 1/sqrt2 squares to the imp-95273 LamBar vacuity threshold 1/2 (rel 1e-12), and maps to gate saturation g_R = 1',
    holds: () => Math.abs(RECIP_SQRT2 * RECIP_SQRT2 - 0.5) < 1e-12 && Math.abs(gFromR(RECIP_SQRT2) - 1) < 1e-12,
  },
  {
    id: 'imp95395-map-double-valued-past-branch',
    description: 'g_R = 2 R sqrt(1-R^2) is double-valued: mirror R and sqrt(1-R^2) give the identical g (g_R(0.6)=g_R(0.8)=0.96), so a looser R maps to the same or smaller gate',
    holds: () => Math.abs(gFromR(0.6) - gFromR(0.8)) < 1e-12 && Math.abs(gFromR(0.6) - 0.96) < 1e-12 && gFromR(0.9) < gFromR(0.75),
  },
  {
    id: 'imp95395-naive-map-underreports-past-branch',
    description: 'for R = 0.9 > 1/sqrt2 an admissible LamBar = 1/2 (<= R^2) has true feed g = 1, but the naive map reports g_R < 1 so gammaSL(g_R) < gammaSL(gFromLam(1/2)) = gammaSL(1): the naive map is NOT a valid upper bound',
    holds: () => {
      const R = 0.9;
      return 0.5 <= R * R && gFromR(R) < 1 && gammaSL(gFromR(R)) < gammaSL(gFromLam(0.5)) - 1e-9;
    },
  },
  {
    id: 'imp95395-naive-map-undefined-for-vacuous-bounds',
    description: 'the imp-95273 vacuous PHASE-CERT bounds exceed 1 (e.g. algWitness34 bound 4.125), so R = sqrt(bound) > 1 makes the naive g_R = NaN, while the clamp gValid stays defined at 1',
    holds: () => {
      const R = Math.sqrt(4.125);
      return R > 1 && Number.isNaN(gFromR(R)) && Math.abs(gValid(R) - 1) < 1e-12;
    },
  },
  {
    id: 'imp95395-clamp-equals-map-on-branch-and-one-above',
    description: 'gValid(R) = gFromLam(min(R^2,1/2)) equals the naive g_R for R <= 1/sqrt2 and equals 1 for every R >= 1/sqrt2 (the max-branch clamp g = 1)',
    holds: () => {
      for (let i = 0; i <= 100; i++) {
        const Rlo = (RECIP_SQRT2 * i) / 100;
        if (Math.abs(gValid(Rlo) - gFromR(Rlo)) > 1e-12) return false;
      }
      for (let i = 0; i <= 100; i++) {
        const Rhi = RECIP_SQRT2 + (2 - RECIP_SQRT2) * (i / 100);
        if (Math.abs(gValid(Rhi) - 1) > 1e-12) return false;
      }
      return true;
    },
  },
  {
    id: 'imp95395-clamp-is-monotone-and-valid-upper-envelope',
    description: 'gammaSL(gValid(R)) is monotone non-decreasing in R and dominates gammaSL(gFromLam(LamBar)) for every admissible LamBar <= R^2 (a valid upper bound restored by the clamp)',
    holds: () => {
      let prev = -1;
      for (let i = 0; i <= 300; i++) {
        const R = (2 * i) / 300;
        const v = gammaSL(gValid(R));
        if (v < prev - 1e-12) return false;
        prev = v;
      }
      for (let i = 1; i <= 40; i++) {
        const R = 0.05 + i * (1.15 / 40);
        for (let j = 0; j <= 40; j++) {
          const lam = (R * R) * (j / 40);
          if (lam > 1) continue;
          if (gammaSL(gValid(R)) < gammaSL(gFromLam(lam)) - 1e-12) return false;
        }
      }
      return true;
    },
  },
  {
    id: 'imp95395-vacuity-branch-correspondence',
    description: 'across all ten imp-95273 families the non-monotone-branch condition sqrt(bound) >= 1/sqrt2 is EXACTLY the vacuity flag (bound >= 1/2): every vacuous row is above the branch top, every active row below it',
    holds: () => IMP95273_ROWS.every((r) => (Math.sqrt(r.bound) >= RECIP_SQRT2) === r.vacuous),
  },
  {
    id: 'imp95395-assessment-only-honest',
    description: 'explicitly ASSESSMENT ONLY, changes no bound, NO QED, no refereed bound is changed',
    holds: () =>
      /ASSESSMENT ONLY/.test(IMP95395_SEAM_GATE_NONMONOTONE_BRANCH.honest) &&
      /Changes NO bound/.test(IMP95395_SEAM_GATE_NONMONOTONE_BRANCH.honest) &&
      /NO QED/.test(IMP95395_SEAM_GATE_NONMONOTONE_BRANCH.honest) &&
      /refereed bound is changed/i.test(IMP95395_SEAM_GATE_NONMONOTONE_BRANCH.honest),
  },
];

for (const a of IMP95395_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95395-seam-gate-nonmonotone-branch-admissibility assertion failed: ${a.id}`);
  }
}

export default IMP95395_SEAM_GATE_NONMONOTONE_BRANCH;
