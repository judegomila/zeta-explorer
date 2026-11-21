/**
 * @module imp-95459-theta-wall-is-sign-spec-not-impossibility
 *
 * imp-95459 (content, honest-status note): imp-95375 refined the imp-95255
 * LEG 2 "theta obstruction" wall. This note states that refinement plainly,
 * in one place, without re-deriving it.
 *
 * WHAT imp-95255 SAID (the wall): theta -- the per-window sign/amplitude
 * functional theta = int f^2 / int g^2 -- "has no image under the current
 * imp-95071/imp-95220 GEOMETRY+modulus transcription": on the fixed-amplitude
 * ported family (all aliases 1/p, a positive cone) f = g identically, so
 * theta = 1 exactly and PHASE-CERT degenerates to FA-2 with zero phase
 * content. The transcription supplies rates and centers (hence y_min) and
 * pins amplitude MODULI at 1/p, but carries no per-window sign pattern.
 *
 * WHAT imp-95375 FOUND (the foreclosure): the geometry transcription DOES
 * image theta -- not its point value (which needs the signs), but its exact
 * RANGE. Writing theta(sigma) = (sigma^T G sigma) / (1^T G 1) over the
 * transcribed packet Gram G (PSD, entries from (rate, center) data alone),
 * the achievable interval is [theta_floor, 1] with theta_floor >= 0
 * GEOMETRICALLY DETERMINED. That interval is not pinned at 1: the
 * alternating witness sigma_n = (-1)^n achieves theta = 0.111518, 0.008176,
 * 0.000901, 0.000154, 0.000024 at pD = 8, 24, 80, 224, 704 -- theta -> 0 as
 * the window grows, because the ported centers cluster and the off-/on-
 * diagonal Gram mass ratio B/A grows (1.79 -> 542.73), the heavy-overlap
 * regime that admits deep cancellation.
 *
 * THE RECLASSIFICATION. theta -> 0 is DEEPLY reachable on the transcribed
 * geometry, so there is no geometric reason theta must equal 1 for real seam
 * windows. The imp-95255 wall is therefore a missing-sign-SPECIFICATION
 * wall, not an impossibility: the transcription fails to carry theta because
 * it drops WHICH sign pattern sigma the alias expansion realizes, not
 * because the geometry forces sigma into the trivial all-plus cone. The
 * residual is localized entirely onto obligation (3) / imp-95397 (recover
 * the paper alias sign pattern) -- OPEN: which point of the imaged range
 * [theta_floor, 1] the real seam sits at.
 *
 * WHAT DOES NOT CHANGE: nothing here derives or moves a Lambda bound; this
 * is a classification refinement of the imp-95255 LEG 2 wall. NO QED;
 * no refereed bound is changed.
 *
 * Import-light (no imports, no zeros bundle). Numerics below cross-check the
 * cited imp-95375 literals, not a new derivation.
 */

export const IMP95459_THETA_WALL_IS_SIGN_SPEC_NOT_IMPOSSIBILITY = {
  id: 'imp-95459',
  title:
    'Honest-status note: the imp-95375 foreclosure reclassifies the ' +
    'imp-95255 theta wall as a missing-sign-SPECIFICATION wall, not an ' +
    'impossibility -- the transcribed geometry images the RANGE ' +
    '[theta_floor, 1] and theta -> 0 is deeply reachable',
  citedFrom: 'imp-95375-theta-range-geometry-image.js',
  wallBefore:
    'imp-95255 LEG 2: theta has NO image under the imp-95071/imp-95220 ' +
    'GEOMETRY+modulus transcription -- theta = 1 exactly on the ' +
    'fixed-amplitude ported family, PHASE-CERT degenerates to FA-2',
  wallAfter:
    'imp-95375: the geometry images the theta RANGE [theta_floor, 1] ' +
    '(theta_floor >= 0, geometrically determined via the packet Gram ' +
    'quadratic form theta(sigma) = sigma^T G sigma / 1^T G 1), and that ' +
    'range is WIDE -- the alternating witness drives theta toward 0 ' +
    '(0.111518 -> 0.000024 across pD = 8..704)',
  deepCancellationWitness: {
    pD: [8, 24, 80, 224, 704],
    thetaAlt: [0.111518, 0.008176, 0.000901, 0.000154, 0.000024],
    boverA: [1.790692, 10.436804, 47.941901, 155.04418, 542.725479],
  },
  reclassification:
    'theta < 1 is DEEPLY reachable on the transcribed geometry, so there ' +
    'is no geometric reason theta must equal 1 for real seam windows. The ' +
    'imp-95255 wall is therefore purely a missing-sign-SPECIFICATION wall ' +
    '-- the transcription drops WHICH sign pattern sigma the alias ' +
    'expansion realizes, not the ability of the geometry to support ' +
    'theta < 1. This is a reclassification, not a resolution: it does not ' +
    'say which point of [theta_floor, 1] the real seam occupies.',
  subGap:
    'imp-95397 (recover the paper alias sign pattern) / obligation (3) -- ' +
    'STILL OPEN. This note only relocates the residual onto it.',
  honest:
    'DOCUMENTATION ONLY -- this note restates, without re-deriving, the ' +
    'imp-95375 verdict on the imp-95255 LEG 2 wall: the wall is a missing ' +
    'sign-SPECIFICATION wall, not an impossibility, because the ' +
    'transcribed geometry images the range [theta_floor, 1] and admits ' +
    'theta -> 0. Nothing here derives or moves a bound. NO QED; ' +
    'no refereed bound is changed.',
};

const REC = IMP95459_THETA_WALL_IS_SIGN_SPEC_NOT_IMPOSSIBILITY;

export const IMP95459_ASSERTIONS = [
  {
    id: 'imp95459-witness-monotone-decreasing-toward-zero',
    description:
      'the cited alternating-witness theta sequence is strictly ' +
      'decreasing and each value is strictly less than 1, i.e. theta < 1 ' +
      'is reachable and trends toward 0 as the window grows',
    holds: () => {
      const t = REC.deepCancellationWitness.thetaAlt;
      for (let i = 0; i < t.length; i++) {
        if (!(t[i] < 1)) return false;
        if (i > 0 && !(t[i] < t[i - 1])) return false;
      }
      return true;
    },
  },
  {
    id: 'imp95459-overlap-ratio-strictly-increasing',
    description:
      'the cited B/A overlap ratio is strictly increasing across the ' +
      'ported grids, the geometric reason theta_floor -> 0',
    holds: () => {
      const b = REC.deepCancellationWitness.boverA;
      for (let i = 1; i < b.length; i++) if (!(b[i] > b[i - 1])) return false;
      return true;
    },
  },
  {
    id: 'imp95459-honesty-gate',
    description:
      'the note is explicit that this is a reclassification (missing ' +
      'sign-SPECIFICATION wall, not an impossibility), that obligation ' +
      '(3) / imp-95397 stays OPEN, that this is documentation only, and ' +
      'that no refereed bound is changed',
    holds: () =>
      /missing-sign-SPECIFICATION/.test(REC.reclassification) &&
      /reclassification, not a resolution/.test(REC.reclassification) &&
      /STILL OPEN/.test(REC.subGap) &&
      /DOCUMENTATION ONLY/.test(REC.honest) &&
      /refereed bound is changed/i.test(REC.honest),
  },
];

for (const a of IMP95459_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95459-theta-wall-is-sign-spec-not-impossibility assertion failed: ${a.id}`,
    );
  }
}

export default IMP95459_THETA_WALL_IS_SIGN_SPEC_NOT_IMPOSSIBILITY;
