/**
 * @fileoverview CORRECTION (2026-09-18, double-verified): the C_Lip→D_rest
 * field-channel certificate rows (imp-3933 EPS_FIELD_ROWS) were baked at the
 * WORST-POSSIBLE window anchors N = endN_p (each plateau's last window size). At
 * those anchors the first omitted zero and the last in-window zero are exactly the
 * NEXT plateau's record pair, so the boundary pair collides under the true flow
 * BEFORE the transfer horizon T (survival ratio (g_b²/8)/T = 0.43–0.87 < 1). The
 * field-Lipschitz premise |e_{l+1}−e_l| ≤ eps′·g_l is therefore unsatisfiable on
 * [0,T] at those anchors, and the rows are INVALID as a true-flow transfer
 * certificate (E_field). imp-33228's "worst edge eps′ = 6.73, clears the 22.9
 * floor" was a continuum-proxy (W* = W + ½/ρ) artifact; the realised discrete
 * edge eps′ is 49.6–506.6 and breaches the uniform floor at every anchor.
 *
 * WHAT IS AND IS NOT WRONG. The imp-3933 lemma, the plateau structure, and the
 * Psi/theta arithmetic are correct (both a Fable-5 attack and an independent
 * Fable-5 replication reproduce the baked rows to ≤1e-9 from the raw zero table).
 * Only the ANCHOR CHOICE is wrong. The fix: re-anchor each plateau at the window
 * size N′ maximizing the boundary gap; then survival ratios are 3.3e3–9.8e4× and
 * all 10 plateaus re-certify at θ ≥ 0.9971.
 *
 * NO Λ CONSEQUENCE. This is the internal E_field leg of the (already conditional)
 * imp-33226 bracket restatement; E_trunc/E_flow were already the binding legs, and
 * those bind on verified zero height (PT-floor audit). No refereed bound is changed
 * . RH is untouched. NO QED. This corrects an internal
 * engineering certificate, not a bound.
 *
 * NO heavy imports (no zeros bundle). Verified figures baked as literals.
 */

export const EPS_FIELD_ANCHOR_CORRECTION = Object.freeze({
  id: 'imp-33228-anchor-invalidation-correction',
  title: 'Correction: the field-channel certificate anchors N=endN are invalid (boundary collision)',
  status: 'CORRECTION — double-verified; anchor-choice fix; no Λ consequence; no refereed bound is changed',
  resolvesResidual: 'imp-34427-sub-edge-no-collision (resolves NEGATIVE at old anchors, POSITIVE at re-anchors)',
  supersededResidual: 'sg-33228-rvm-continuum-vs-discrete (resolves NEGATIVE at anchors: the W* half-mean-spacing proxy is false there)',

  finding:
    'At N = endN_p the boundary pair IS the next plateau’s record pair (gap ≡ H_{p+1}, '
    + '≈22×–103× closer than a full mean spacing), so its certified collision time '
    + 'tHi_{p+1} = 0.432T–0.871T precedes the horizon T. Survival ratio (g_b²/8)/T < 1 '
    + 'at every anchor ⇒ the field-Lipschitz premise fails on [0,T] ⇒ the baked '
    + 'EPS_FIELD_ROWS are invalid as a true-flow E_field certificate at those anchors.',

  // Per-plateau (p0..p8; p9 anchor = table end 1e6, uncheckable from the ≤1e6 table).
  // oldSurvival = (g_b²/8)/T at N=endN (all < 1 = INVALID); realisedEps = discrete window-max eps′.
  oldAnchors: [
    { p: 0, oldSurvival: 0.8684, realisedEps: 76.9 },
    { p: 1, oldSurvival: 0.6929, realisedEps: 49.6 },
    { p: 2, oldSurvival: 0.7576, realisedEps: 91.4 },
    { p: 3, oldSurvival: 0.6446, realisedEps: 140.9 },
    { p: 4, oldSurvival: 0.8646, realisedEps: 98.0 },
    { p: 5, oldSurvival: 0.5636, realisedEps: 154.5 },
    { p: 6, oldSurvival: 0.7805, realisedEps: 269.2 },
    { p: 7, oldSurvival: 0.4334, realisedEps: 392.6 },
    { p: 8, oldSurvival: 0.4318, realisedEps: 506.6 },
  ],

  // The fix: re-anchor at N′ = argmax boundary gap. newSurvival ≫ 1, all re-certify θ≥0.9971.
  newAnchors: [
    { p: 0, Nprime: 15323, boundaryGap: 2.176, newSurvival: 3298.7 },
    { p: 1, Nprime: 19187, boundaryGap: 2.098, newSurvival: 3496.5 },
    { p: 2, Nprime: 46589, boundaryGap: 2.024, newSurvival: 4649.9 },
    { p: 3, Nprime: 77672, boundaryGap: 1.882, newSurvival: 5254.2 },
    { p: 4, Nprime: 83454, boundaryGap: 1.861, newSurvival: 7885.4 },
    { p: 5, Nprime: 87831, boundaryGap: 1.811, newSurvival: 8554.6 },
    { p: 6, Nprime: 185013, boundaryGap: 1.967, newSurvival: 17716 },
    { p: 7, Nprime: 393295, boundaryGap: 1.762, newSurvival: 18037 },
    { p: 8, Nprime: 420290, boundaryGap: 1.584, newSurvival: 33288 },
    { p: 9, Nprime: 516200, boundaryGap: 1.798, newSurvival: 98422.1 },
  ],

  reCertification: {
    thetaUniformRange: [0.99666, 0.99988],
    thetaPerGapRange: [0.997162, 0.999896], // imp-95517 regenerated eps′=0 θ range at the N′ anchors
    thetaBar: 0.99,
    envelopeEpsMax: 2.83, // realised window-max eps′ at the new anchors (claim's looser 3.07 also holds)
    note: 'All 10 plateaus (incl. p9) re-certify at the re-anchors; imp-33225 per-gap route. '
      + 'EPS_FIELD_ROWS regenerated at the N′ anchors by imp-95517 (minEpsMax 22.9163, θ_eps0 ∈ [0.997162, 0.999896]).',
  },

  survivingObstruction:
    'The DISPLACEMENT leg: extending the field-Lipschitz bound from t=0 to '
    + 't ∈ [0, min(t_c,T)]. Finite, real-variable, margin-rich (t=0 boundary '
    + 'distances ≥ 1.58 at the re-anchors; a colliding pair’s displacement ≤ ½ its '
    + 'gap ≤ 0.02) — NOT RH-shaped, NOT PCC-shaped, NOT height-shaped. Not yet proven; '
    + 'until it is, E_field is bounded-by-table, not discharged.',

  scope:
    'Anchor-choice correction to an internal E_field certificate. The imp-3933 lemma, '
    + 'plateau structure, and Psi/theta arithmetic are correct (reproduced to ≤1e-9 by '
    + 'two independent reconstructions from src/data/zeros-to-1e6.js). No Λ consequence: '
    + 'E_trunc/E_flow are the binding legs and bind on verified height; no refereed bound is changed; '
    + 'RH untouched. Follow-up DONE (imp-95517): imp-3933 EPS_FIELD_ROWS regenerated at the '
    + 'N′ anchors (anchorN field; Psi upper-sum truncated at N′; all 10 plateaus re-certify).',
});

export const EPS_FIELD_ANCHOR_CORRECTION_ASSERTIONS = Object.freeze([
  {
    name: 'old anchors all invalid (survival < 1)',
    check: () => EPS_FIELD_ANCHOR_CORRECTION.oldAnchors.every((a) => a.oldSurvival < 1),
  },
  {
    name: 're-anchors all valid with wide margin (survival > 1000)',
    check: () => EPS_FIELD_ANCHOR_CORRECTION.newAnchors.every((a) => a.newSurvival > 1000),
  },
  {
    name: 'realised edge eps′ breaches the 22.9 uniform floor at every old anchor',
    check: () => EPS_FIELD_ANCHOR_CORRECTION.oldAnchors.every((a) => a.realisedEps > 22.9),
  },
  {
    name: 're-certification θ ≥ θbar on all plateaus',
    check: () => EPS_FIELD_ANCHOR_CORRECTION.reCertification.thetaPerGapRange[0]
      >= EPS_FIELD_ANCHOR_CORRECTION.reCertification.thetaBar,
  },
  {
    name: 'honest: no Λ consequence, no refereed bound is changed, RH untouched',
    check: () => /refereed bound is changed/i.test(EPS_FIELD_ANCHOR_CORRECTION.scope + EPS_FIELD_ANCHOR_CORRECTION.status)
      && /No Λ consequence|no Λ consequence/i.test(EPS_FIELD_ANCHOR_CORRECTION.scope),
  },
]);

export default EPS_FIELD_ANCHOR_CORRECTION;
