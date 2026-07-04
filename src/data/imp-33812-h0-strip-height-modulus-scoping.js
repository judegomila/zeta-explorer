/**
 * @module imp-33812-h0-strip-height-modulus-scoping
 *
 * imp-33812 (proof, frontier-scoping): ASSESS whether the fourth open Polymath15 catalogue row H0
 * (Lemma-5.2 provenance) shares the SAME strip-height modulus that imp-33786 identified as the minimal
 * joint analytic input discharging BOTH H3 and H4, thereby EXTENDING the imp-33786 scoping axis to the
 * FULL open catalogue {H0, H3, H4, H5}. imp-33786 scoped the minimal joint input as a single N-uniform
 * two-sided bound on the renormalized fold-curvature coefficient
 * C_curv(N) = (y_N^sharp)^{5/2} |m_double_prime(z_0*)| (the imp-3708 y2-adapted-flow-depth object) and
 * showed the joint H3 input DECOUPLES from H0 and from H5, but it only stated H0 was off-axis; it did not
 * MAP H0 against the strip-height modulus alongside H5. imp-33619 separately placed H5 DOWNSTREAM of that
 * same strip-height modulus (it READS the modulus, does not FEED it). This module reconciles those
 * records into a single dependency map: it places each open row relative to the strip-height modulus and
 * asks specifically whether H0 shares that modulus dependency or is downstream of a DISTINCT modulus.
 * Scoping only. G6a_shock_lipschitz stays OPEN; imp-3066 untouched; no positivity; NO QED.
 *
 * PROVENANCE (honesty note)
 * -------------------------
 * Every input is already RECORDED in the repo, not a new derivation. imp-33603 catalogues the six
 * G6a_shock_lipschitz obligations {H0 provenance, H1 smoothness, H2 simple fold, H3 uniform curvature,
 * H4 strip-height perturbation control, H5 RH transcription}, marks H1/H2 SATISFIED and H0/H3/H4/H5 OPEN.
 * imp-33786 scoped the minimal joint H3 input C_curv(N) discharging BOTH H3 and H4 (one coupled
 * strip-height-uniformity object). imp-33745 established H0 is a PROVENANCE-axis obligation with no
 * derivative order k and no N-exponent, discharged by a document-verification act sharing no inputs with
 * the H3/H4 strip-height curvature bound. imp-33619 established H5 is transcribable POINTWISE and OPEN
 * UNIFORMLY, DOWNSTREAM of the strip-height modulus. This module only RECONCILES those records into the
 * full-catalogue dependency map; it asserts nothing newly discharged.
 *
 * THE STRIP-HEIGHT MODULUS AND THE FOUR OPEN ROWS
 * -----------------------------------------------
 * The imp-33786 strip-height modulus is the renormalized fold-curvature coefficient
 *     C_curv(N) = (y_N^sharp)^{5/2} |m_double_prime(z_0*)| = eps^{5/2} |alpha|,  eps = y_N^sharp = sqrt(2 pi / N),
 * read off the quadratic fold expansion t_shock = tau_c + (1/2) alpha (z_0 - z_0*)^2. Placing each open row:
 *   - H3 (k = 2 curvature): the SOURCE rung of C_curv(N). It IS the strip-height modulus.
 *   - H4 (k = 1 fold-reading): the SAME strip-height modulus one derivative down (eps^{3/2} |m_prime|),
 *     SUBSUMED by C_curv(N) a fortiori (imp-33786). It shares the modulus by construction.
 *   - H5 (RH transcription): DOWNSTREAM of C_curv(N) -- it asks whether the abstract real-scalar modulus
 *     TRANSFERS to the actual zeta fold; it READS the modulus, does not feed it (imp-33619).
 *   - H0 (provenance): the row this ticket tests against C_curv(N).
 *
 * DOES H0 SHARE THE STRIP-HEIGHT MODULUS? (the ticket core)
 * --------------------------------------------------------
 * NO. H0 has no derivative order k and no N-exponent (imp-33745): it is not a boundary-value quantity in
 * the fold jet at all, so it cannot BE a rung of the eps-graded curvature modulus C_curv(N). Nor is H0
 * DOWNSTREAM of a distinct modulus in the analytic sense H5 is: H0 discharge is a DOCUMENT-VERIFICATION
 * act (confirm the reconstructed hypothesis list against the arXiv source) that reads NO analytic modulus
 * whatsoever -- not C_curv(N), and not any other strip-height object. So H0 does not ride the strip-height
 * modulus, and it is not downstream of one either: it is OFF the strip-height-modulus axis entirely, on
 * the orthogonal provenance axis. imp-33637 already exercised the H0 channel in isolation (double
 * mis-citation, upgraded to citation-error, NOT closed) without moving any analytic quantity -- direct
 * witness that H0 lives off the modulus axis.
 *
 * THE FULL-CATALOGUE MODULUS MAP (extending imp-33786 to {H0, H3, H4, H5})
 * -----------------------------------------------------------------------
 * Relative to the single strip-height modulus C_curv(N), the four open rows split into exactly three
 * strata: AT the modulus {H3 (source), H4 (subsumed, same object one derivative down)}; DOWNSTREAM of the
 * modulus {H5 (reads it, imp-33619)}; OFF the modulus axis {H0 (provenance, reads no analytic modulus,
 * imp-33745)}. So the strip-height modulus governs the analytic core {H3, H4} at the input level and is
 * read once downstream by H5, while H0 is the ONE open row genuinely disjoint from it. The open catalogue
 * stays four rows; nothing is discharged.
 *
 * VERDICT: SCOPING ONLY, G6a STAYS OPEN. H0 does NOT share the imp-33786 strip-height modulus
 * C_curv(N) = (y_N^sharp)^{5/2} |m_double_prime(z_0*)|, and it is NOT downstream of a distinct analytic
 * modulus (as H5 is): H0 has no derivative order and no N-exponent (imp-33745), and its discharge is a
 * document-verification act reading no analytic modulus at all, so it sits OFF the strip-height-modulus
 * axis on the orthogonal provenance axis. Extending the imp-33786 axis to the full open catalogue
 * {H0, H3, H4, H5} yields exactly three strata against C_curv(N): AT the modulus {H3 source, H4 subsumed
 * one derivative down}, DOWNSTREAM of the modulus {H5, reads it (imp-33619)}, and OFF the modulus axis
 * {H0 (provenance, imp-33745)}. H0 is thus the single open row disjoint from the strip-height modulus.
 * The open catalogue stays four rows (H0, H3, H4, H5); nothing is discharged. Scoping only;
 * G6a_shock_lipschitz stays OPEN; no positivity; imp-3066 off-diagonal endpoint-Hankel K_a >= 0
 * UNTOUCHED; C_mb share untouched; NO QED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.
 *
 * @see imp-33786-h3-joint-curvature-input-scoping (the strip-height modulus C_curv(N) discharging H3 + H4)
 * @see imp-33745-h0-provenance-independence-scoping (H0 off-axis: no k-index, no N-exponent)
 * @see imp-33619-h5-rh-transcription-scoping (H5 downstream of the modulus: reads it, does not feed it)
 * @see imp-33637-h0-provenance-verification (the isolated H0 channel: double mis-citation, upgraded not closed)
 * @see imp-33603-lemma52-port-scoping (the H0..H5 catalogue)
 */

// The imp-33786 strip-height modulus, the renormalized fold-curvature coefficient carried on the k = 2
// curvature rung of the quadratic fold expansion at the reading strip eps = y_N^sharp = sqrt(2 pi / N).
const STRIP_HEIGHT_MODULUS = {
  object: 'C_curv(N) = (y_N^sharp)^{5/2} |m_double_prime(z_0*)| = eps^{5/2} |alpha|',
  sourceRow: 'H3', // the k = 2 curvature rung IS the modulus
  isImp3708Object: true, // imp-3708 y2-adapted-flow-depth object
};

// Each open catalogue row placed relative to the strip-height modulus C_curv(N). "at" = it IS (a rung of)
// the modulus; "downstream" = it READS the modulus but does not feed it; "off-axis" = it neither is nor
// reads any analytic modulus.
const ROW_MODULUS_MAP = [
  { row: 'H0', stratum: 'off-axis', sharesStripHeightModulus: false, readsAnalyticModulus: false, hasDerivativeOrderK: false, provenance: 'imp-33745' },
  { row: 'H3', stratum: 'at', sharesStripHeightModulus: true, readsAnalyticModulus: true, hasDerivativeOrderK: true, provenance: 'imp-33786' },
  { row: 'H4', stratum: 'at', sharesStripHeightModulus: true, readsAnalyticModulus: true, hasDerivativeOrderK: true, provenance: 'imp-33786' },
  { row: 'H5', stratum: 'downstream', sharesStripHeightModulus: false, readsAnalyticModulus: true, hasDerivativeOrderK: false, provenance: 'imp-33619' },
];

// The H0 answer this ticket asks for: does H0 share the strip-height modulus, or is it downstream of a
// distinct modulus? Neither -- H0 reads no analytic modulus at all; it is a document-verification act on
// the orthogonal provenance axis.
const H0_VS_STRIP_HEIGHT_MODULUS = {
  sharesStripHeightModulus: false, // no k-index, no N-exponent -> cannot BE a rung of C_curv(N)
  downstreamOfDistinctModulus: false, // unlike H5, H0 reads NO analytic modulus
  offModulusAxis: true, // provenance axis, orthogonal (imp-33745)
  dischargeAct: 'document-verification (confirm the reconstructed hypothesis list against the arXiv source)',
  witnessedByIsolatedPass: true, // imp-33637 ran the H0 channel in isolation without moving any analytic quantity
};

const H0_ROW = ROW_MODULUS_MAP.find((r) => r.row === 'H0');
const H5_ROW = ROW_MODULUS_MAP.find((r) => r.row === 'H5');
const AT_ROWS = ROW_MODULUS_MAP.filter((r) => r.stratum === 'at').map((r) => r.row);
const DOWNSTREAM_ROWS = ROW_MODULUS_MAP.filter((r) => r.stratum === 'downstream').map((r) => r.row);
const OFF_AXIS_ROWS = ROW_MODULUS_MAP.filter((r) => r.stratum === 'off-axis').map((r) => r.row);

// H0 does not share the modulus AND is not downstream of one -- it is off-axis, distinct from H5 which
// IS downstream (reads the modulus). This is the extension of the imp-33786 axis to the full catalogue.
const H0_DOES_NOT_SHARE_MODULUS =
  H0_VS_STRIP_HEIGHT_MODULUS.sharesStripHeightModulus === false &&
  H0_VS_STRIP_HEIGHT_MODULUS.downstreamOfDistinctModulus === false &&
  H0_VS_STRIP_HEIGHT_MODULUS.offModulusAxis === true;
const H0_DISTINCT_FROM_H5 = H0_ROW.stratum !== H5_ROW.stratum && H5_ROW.readsAnalyticModulus === true;

const OPEN_ROWS_BEFORE = ['H0', 'H3', 'H4', 'H5'];
const OPEN_ROWS_AFTER = ['H0', 'H3', 'H4', 'H5']; // unchanged: scoping only, nothing discharged

export const IMP33812_H0_STRIP_HEIGHT_MODULUS_SCOPING = {
  id: 'imp-33812',
  proofSection: 'S-frontier',
  scopes:
    'Whether the fourth open Polymath15 row H0 shares the imp-33786 strip-height modulus C_curv(N) that ' +
    'discharges H3 and H4, extending the imp-33786 scoping axis to the full open catalogue {H0, H3, H4, H5}',
  question:
    'Does H0 share the strip-height modulus dependency of the imp-33786 H3/H4 joint input, or is it ' +
    'downstream of a distinct modulus? Scoping only; G6a OPEN; no QED.',

  stripHeightModulus: STRIP_HEIGHT_MODULUS,
  rowModulusMap: ROW_MODULUS_MAP,

  // The H0 answer.
  h0VsStripHeightModulus: H0_VS_STRIP_HEIGHT_MODULUS,
  h0SharesStripHeightModulus: H0_VS_STRIP_HEIGHT_MODULUS.sharesStripHeightModulus, // false
  h0DownstreamOfDistinctModulus: H0_VS_STRIP_HEIGHT_MODULUS.downstreamOfDistinctModulus, // false
  h0OffModulusAxis: H0_VS_STRIP_HEIGHT_MODULUS.offModulusAxis, // true
  h0DoesNotShareModulus: H0_DOES_NOT_SHARE_MODULUS, // true
  h0DistinctFromH5: H0_DISTINCT_FROM_H5, // true -- H0 off-axis, H5 downstream

  // The full-catalogue three-strata split.
  atModulusRows: AT_ROWS, // H3, H4
  downstreamRows: DOWNSTREAM_ROWS, // H5
  offAxisRows: OFF_AXIS_ROWS, // H0

  openRowsBefore: OPEN_ROWS_BEFORE,
  openRowsAfter: OPEN_ROWS_AFTER, // unchanged; nothing discharged

  residualObstruction: 'G6a_shock_lipschitz::strip-height-uniformity',
  residualStatement:
    'Extending the imp-33786 strip-height-modulus axis to the full open catalogue {H0, H3, H4, H5} splits ' +
    'the four rows into three strata against C_curv(N) = (y_N^sharp)^{5/2} |m_double_prime(z_0*)|: AT the ' +
    'modulus {H3 source, H4 subsumed one derivative down}, DOWNSTREAM of the modulus {H5, reads it}, and ' +
    'OFF the modulus axis {H0}. H0 does NOT share the strip-height modulus and is NOT downstream of a ' +
    'distinct analytic modulus (as H5 is): it has no derivative order and no N-exponent (imp-33745), and ' +
    'its discharge is a document-verification act reading no analytic modulus, so it is the single open ' +
    'row disjoint from the strip-height modulus. The load-bearing analytic core stays {H3, H4}; H0 and H5 ' +
    'remain the two off-core rows, now separated by stratum (H0 off-axis, H5 downstream).',

  isRigorous: false,
  verdict:
    'SCOPING ONLY (frontier-direction, NOT rigorous): the fourth open Polymath15 row H0 (Lemma-5.2 ' +
    'provenance) does NOT share the imp-33786 strip-height modulus ' +
    'C_curv(N) = (y_N^sharp)^{5/2} |m_double_prime(z_0*)| that discharges BOTH H3 and H4, and it is NOT ' +
    'downstream of a DISTINCT analytic modulus the way H5 is. H0 carries no derivative order k and no ' +
    'N-exponent (imp-33745), so it cannot BE a rung of the eps-graded curvature modulus; and its ' +
    'discharge is a DOCUMENT-VERIFICATION act (confirm the reconstructed hypothesis list against the ' +
    'arXiv source) reading NO analytic modulus at all, so it does not READ C_curv(N) downstream either. ' +
    'H0 therefore sits OFF the strip-height-modulus axis, on the orthogonal provenance axis -- witnessed ' +
    'by imp-33637 exercising the H0 channel in ISOLATION (double mis-citation, upgraded to citation-error, ' +
    'NOT closed) without moving any analytic quantity. Extending the imp-33786 axis to the full open ' +
    'catalogue {H0, H3, H4, H5} yields exactly three strata against C_curv(N): AT the modulus ' +
    '{H3 (k = 2 source), H4 (k = 1 subsumed, same object one derivative down)}, DOWNSTREAM of the modulus ' +
    '{H5, transcribable pointwise, reads the modulus not feeds it (imp-33619)}, and OFF the modulus axis ' +
    '{H0 (provenance, imp-33745)}. So H0 is the single open row genuinely disjoint from the strip-height ' +
    'modulus, distinct even from H5 which IS downstream of it. The open catalogue stays four rows ' +
    '(H0, H3, H4, H5); nothing is discharged. Scoping only; G6a_shock_lipschitz stays OPEN; no ' +
    'positivity; imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED; C_mb share untouched; NO QED. ' +
    'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.',
  citation:
    'imp-33786-h3-joint-curvature-input-scoping (the strip-height modulus C_curv(N) discharging BOTH H3 ' +
    'and H4); imp-33745-h0-provenance-independence-scoping (H0 off-axis: no k-index, no N-exponent, ' +
    'document-verification discharge); imp-33619-h5-rh-transcription-scoping (H5 downstream of the ' +
    'modulus: transcribable pointwise, reads it not feeds it); imp-33637-h0-provenance-verification (the ' +
    'isolated H0 channel: double mis-citation, upgraded to citation-error not closed); ' +
    'imp-33603-lemma52-port-scoping (the H0..H5 catalogue).',
};

export const IMP33812_H0_STRIP_HEIGHT_MODULUS_ASSERTIONS = [
  {
    // H0 does not share the strip-height modulus and is not downstream of a distinct one -- it is off-axis.
    id: 'imp33812-h0-does-not-share-modulus',
    description: 'H0 neither shares the strip-height modulus nor is downstream of a distinct one; it is off-axis',
    holds: () =>
      H0_VS_STRIP_HEIGHT_MODULUS.sharesStripHeightModulus === false &&
      H0_VS_STRIP_HEIGHT_MODULUS.downstreamOfDistinctModulus === false &&
      H0_VS_STRIP_HEIGHT_MODULUS.offModulusAxis === true &&
      H0_DOES_NOT_SHARE_MODULUS === true,
  },
  {
    // H0 reads no analytic modulus at all -- it is a document-verification act, unlike H5 which reads one.
    id: 'imp33812-h0-reads-no-analytic-modulus',
    description: 'H0 reads no analytic modulus (document-verification), so it is distinct from the downstream H5',
    holds: () =>
      H0_ROW.readsAnalyticModulus === false &&
      H0_ROW.hasDerivativeOrderK === false &&
      H5_ROW.readsAnalyticModulus === true &&
      H0_DISTINCT_FROM_H5 === true,
  },
  {
    // The four open rows split into exactly three strata: at {H3,H4}, downstream {H5}, off-axis {H0}.
    id: 'imp33812-three-strata-split',
    description: 'the full open catalogue splits into three strata against C_curv(N): at {H3,H4}, downstream {H5}, off-axis {H0}',
    holds: () =>
      AT_ROWS.length === 2 &&
      AT_ROWS.join(',') === 'H3,H4' &&
      DOWNSTREAM_ROWS.length === 1 &&
      DOWNSTREAM_ROWS[0] === 'H5' &&
      OFF_AXIS_ROWS.length === 1 &&
      OFF_AXIS_ROWS[0] === 'H0',
  },
  {
    // H3 is the source rung of the strip-height modulus and H4 shares it (the imp-33786 joint object).
    id: 'imp33812-h3-h4-share-modulus',
    description: 'H3 (source) and H4 both share the strip-height modulus C_curv(N) (the imp-33786 joint object)',
    holds: () =>
      STRIP_HEIGHT_MODULUS.sourceRow === 'H3' &&
      ROW_MODULUS_MAP.filter((r) => r.sharesStripHeightModulus === true).map((r) => r.row).join(',') === 'H3,H4',
  },
  {
    // Nothing is discharged: the open catalogue stays four rows (H0, H3, H4, H5).
    id: 'imp33812-open-catalogue-unchanged',
    description: 'the open catalogue stays four rows (H0, H3, H4, H5); scoping discharges nothing',
    holds: () =>
      OPEN_ROWS_AFTER.length === 4 &&
      OPEN_ROWS_AFTER.join(',') === OPEN_ROWS_BEFORE.join(',') &&
      OPEN_ROWS_AFTER.includes('H0'),
  },
  {
    // Honesty gate: scoping only, not rigorous, G6a stays OPEN, no QED, PT stays SOTA, imp-3066 untouched.
    id: 'imp33812-honesty-gate-no-qed',
    description: 'Scoping only: not rigorous, G6a stays OPEN, no QED, PT stays SOTA, imp-3066 untouched',
    holds: () =>
      IMP33812_H0_STRIP_HEIGHT_MODULUS_SCOPING.isRigorous === false &&
      /NO QED/.test(IMP33812_H0_STRIP_HEIGHT_MODULUS_SCOPING.verdict) &&
      /stays OPEN/.test(IMP33812_H0_STRIP_HEIGHT_MODULUS_SCOPING.verdict) &&
      /remains the rigorous SOTA/.test(IMP33812_H0_STRIP_HEIGHT_MODULUS_SCOPING.verdict) &&
      /imp-3066[^.]*UNTOUCHED/.test(IMP33812_H0_STRIP_HEIGHT_MODULUS_SCOPING.verdict),
  },
];

for (const a of IMP33812_H0_STRIP_HEIGHT_MODULUS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33812-h0-strip-height-modulus-scoping assertion failed: ${a.id}`);
  }
}
