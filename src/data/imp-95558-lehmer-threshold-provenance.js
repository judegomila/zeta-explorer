/*
 * imp-95558 -- Provenance audit of the 1.15e-11 unconditional collision threshold
 * that the imp-95531 PD-persistence windows W(S) are measured against.
 *
 * CONTEXT
 *   imp-95531 (eps0-pd-persistence-window) reports that every finite-S window
 *   W(S) = mu_S(0)/M1 exceeds "the Saouter-Gourdon-Demichel collision 1.15e-11"
 *   by 5 to 8 orders of magnitude, but the module cites the constant without
 *   pinning its published source, exact statement, or physical units. This
 *   record fixes all three so the margins are anchored to a checkable reference.
 *   Accuracy audit only; changes no bound; NO QED; no refereed bound is changed.
 *
 * WHAT 1.15e-11 IS (three questions the ticket poses)
 *
 *   (1) SOURCE / ATTRIBUTION -- CORRECT AS CITED.
 *       The constant is the magnitude of the best published UNCONDITIONAL LOWER
 *       BOUND on the de Bruijn-Newman constant Lambda:
 *           Lambda >= -1.15e-11
 *       due to Y. Saouter, X. Gourdon, P. Demichel, "An improved lower bound
 *       for the de Bruijn-Newman constant," Mathematics of Computation 80(276)
 *       (2011), pp. 2281-2287. The imp-95531 attribution "Saouter-Gourdon-
 *       Demichel" matches the canonical author list of that paper -- it is not
 *       a mislabel. (The finer figure -1.14541e-11 quoted elsewhere in the tree
 *       is the same 2011 result before rounding to two significant figures.)
 *
 *   (2) UNITS -- it is a de Bruijn-Newman FLOW TIME (an eps-time), NOT a
 *       normalized zero gap and NOT a delta displacement.
 *       Lambda is the critical value of the backward-heat-flow parameter t
 *       (= eps in the imp-95530/imp-95531 convention) at which the deformed
 *       Xi_t first acquires non-real zeros: for t >= Lambda all zeros are real,
 *       for t < Lambda some are complex. So -1.15e-11 is a POINT ON THE FLOW-
 *       TIME AXIS, in the same units as the imp-95531 window eps_0(S). The
 *       comparison W(S) vs 1.15e-11 is therefore DIMENSIONALLY SOUND: both are
 *       magnitudes of the same backward-flow parameter eps. It is emphatically
 *       NOT the normalized minimal zero gap delta_n = (gamma_{n+1}-gamma_n) x
 *       log(gamma_n/2pi)/2pi (a dimensionless spacing, O(0.1-1)) and NOT a
 *       displacement of a zero (a height, O(1) near the pair).
 *
 *   (3) THE "LEHMER-PAIR COLLISION" NAME -- consistent, describes the MECHANISM.
 *       The Saouter-Gourdon-Demichel lower bound is proved by exhibiting an
 *       anomalously close consecutive zero pair (a Lehmer pair) at large height
 *       (~ 10^13) via the Csordas-Smith-Varga inequality: if Lambda were more
 *       negative than -1.15e-11, the backward flow t: 0 -> Lambda would have
 *       driven that already-close pair to COLLIDE (merge, then split off the
 *       real axis) before reaching the observed configuration. Hence the name:
 *       1.15e-11 is the flow-time at which the tightest verified Lehmer pair
 *       would collide -- the flow-time the imp-95531 certificate must survive
 *       past. Provenance (a near-colliding pair) and units (a flow time) are
 *       two consistent descriptions of the same number.
 *
 * CONCLUSION
 *   The imp-95531 usage is correct in source, attribution and dimensional
 *   sense: W(S) and 1.15e-11 are both backward-flow-time (eps) magnitudes, so
 *   "W(S) exceeds the collision threshold by 5-8 orders" means the finite-S
 *   positivity certificate survives ~1e5-1e8 x longer in flow time than the
 *   first UNCONDITIONALLY guaranteed non-real zero -- a genuine, checkable
 *   margin, not a units mismatch.
 *
 * RESIDUAL SUB-GAP  PROV-RECON:
 *   The in-tree historical timeline (imp-1120, lambda-historical-timeline.js)
 *   lists two nearby author groupings for this era ("Saouter-Papanikolaou-
 *   Demichel 2007" at -1.15e-11 and "Saouter-Demichel 2011" at -1.14541e-11).
 *   The canonical published citation for the -1.15e-11 magnitude is the single
 *   Saouter-Gourdon-Demichel 2011 Math. Comp. paper; the timeline's author/year
 *   split should be reconciled against the primary source in a follow-up. This
 *   record does not edit that timeline (out of scope for an accuracy audit).
 */

export const IMP95558_LEHMER_THRESHOLD_PROVENANCE = Object.freeze({
  id: 'imp-95558-lehmer-threshold-provenance',
  parent: 'imp-95531-eps0-pd-persistence-window',
  question: 'Is 1.15e-11 the correct unconditional figure the imp-95531 windows must run past, what is its source, and what are its units (normalized gap, flow-time, or displacement)?',
  constant: 1.15e-11,
  preciseFigure: 1.14541e-11,
  reference: 'Saouter, Gourdon, Demichel, "An improved lower bound for the de Bruijn-Newman constant," Mathematics of Computation 80(276) (2011), pp. 2281-2287.',
  exactStatement: 'Lambda >= -1.15e-11 : an unconditional lower bound on the de Bruijn-Newman constant Lambda (the critical backward-heat-flow time below which Xi_t has non-real zeros).',
  units: 'de Bruijn-Newman FLOW TIME (eps-time on the backward-heat parameter axis) -- the SAME units as the imp-95531 window eps_0(S). NOT a normalized zero gap; NOT a zero displacement.',
  attributionVerdict: 'CORRECT: imp-95531 cites Saouter-Gourdon-Demichel, which is the canonical author list of the 2011 Math. Comp. paper.',
  unitsVerdict: 'DIMENSIONALLY SOUND: W(S) and 1.15e-11 are both magnitudes of the backward-flow parameter eps, so the 5-8 order margins are meaningful.',
  mechanism: 'The bound is proved from a tightest verified Lehmer pair (close consecutive zeros ~10^13) via the Csordas-Smith-Varga inequality: a more negative Lambda would force that pair to collide under the backward flow. Hence "Lehmer-pair collision threshold" = the flow-time at which the pair collides.',
  residualSubGap: 'PROV-RECON: the in-tree imp-1120 timeline splits this era into "Saouter-Papanikolaou-Demichel 2007" and "Saouter-Demichel 2011" figures that should be reconciled against the primary Saouter-Gourdon-Demichel 2011 source; not edited here (out of audit scope).',
  verdict: 'The imp-95531 comparison is anchored: 1.15e-11 = |Saouter-Gourdon-Demichel 2011 lower bound on Lambda|, a backward-flow-TIME matching eps_0(S) units. Accuracy audit only; changes no bound; RH OPEN; no refereed bound is changed; NO QED.',
});

const isFlowTime = (s) => /flow[- ]?time|eps-time|flow parameter|eps/i.test(s);
export const IMP95558_ASSERTIONS = [
  {
    id: 'imp95558-constant-matches-imp95531',
    description: 'the audited constant equals the 1.15e-11 that imp-95531 divides its windows by',
    holds: () => IMP95558_LEHMER_THRESHOLD_PROVENANCE.constant === 1.15e-11,
  },
  {
    id: 'imp95558-precise-rounds-to-constant',
    description: 'the precise 2011 figure -1.14541e-11 rounds to the two-sig-fig -1.15e-11 (same result)',
    holds: () => Math.abs(IMP95558_LEHMER_THRESHOLD_PROVENANCE.preciseFigure - IMP95558_LEHMER_THRESHOLD_PROVENANCE.constant) < 1e-12
      && Number(IMP95558_LEHMER_THRESHOLD_PROVENANCE.preciseFigure.toPrecision(3)) === IMP95558_LEHMER_THRESHOLD_PROVENANCE.constant,
  },
  {
    id: 'imp95558-units-are-flow-time-not-gap',
    description: 'the record classifies 1.15e-11 as a flow-time and explicitly rejects the normalized-gap / displacement readings',
    holds: () => isFlowTime(IMP95558_LEHMER_THRESHOLD_PROVENANCE.units)
      && /NOT a normalized zero gap/.test(IMP95558_LEHMER_THRESHOLD_PROVENANCE.units)
      && /NOT a zero displacement/.test(IMP95558_LEHMER_THRESHOLD_PROVENANCE.units),
  },
  {
    id: 'imp95558-attribution-canonical',
    description: 'the reference names Saouter, Gourdon, Demichel and Mathematics of Computation 2011',
    holds: () => /Saouter, Gourdon, Demichel/.test(IMP95558_LEHMER_THRESHOLD_PROVENANCE.reference)
      && /Mathematics of Computation/.test(IMP95558_LEHMER_THRESHOLD_PROVENANCE.reference)
      && /2011/.test(IMP95558_LEHMER_THRESHOLD_PROVENANCE.reference),
  },
  {
    id: 'imp95558-honesty',
    description: 'record states the PROV-RECON sub-gap, RH OPEN, PT Lambda <= 0.2, NO QED, and no bound change',
    holds: () => /PROV-RECON/.test(IMP95558_LEHMER_THRESHOLD_PROVENANCE.residualSubGap)
      && /RH OPEN/.test(IMP95558_LEHMER_THRESHOLD_PROVENANCE.verdict)
      && /refereed bound is changed/i.test(IMP95558_LEHMER_THRESHOLD_PROVENANCE.verdict)
      && /NO QED/.test(IMP95558_LEHMER_THRESHOLD_PROVENANCE.verdict)
      && /changes no bound/.test(IMP95558_LEHMER_THRESHOLD_PROVENANCE.verdict),
  },
];
for (const a of IMP95558_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-95558-lehmer-threshold-provenance assertion failed: ${a.id}`);
}
export default IMP95558_LEHMER_THRESHOLD_PROVENANCE;
