/**
 * imp-95046 - The 0.1399-row rectangular-slab (4.4) lane: characterizing the
 * slab hypothesis of Theorem 4.5 as a STANDALONE conditional target.
 * HONEST STATUS: ASSESSMENT ONLY (derives no bound, closes no gap, NO QED).
 *
 * CONTEXT. The imp-95012 frozen spec records ROW_01399_DECISION =
 * UNPARK-INDEPENDENT: Theorem 4.5 reaches Lambda <= 0.1399 with
 *   y* = 33/200 = 0.165,  t* = 10103/80000,  t* + y*^2/2 = 1399/10000 = 0.1399,
 * from TWO sharply delimited NEW hypotheses -- (a) the rectangular slab (4.4)
 *   H_tau(u + iv) != 0  on  [X, X+1] x [y*, 1] x [0, t*],
 * and (b) a directed final-time tail (tracked separately in imp-95047). This
 * module isolates hypothesis (a) and characterizes it as an independent
 * conditional target: what Lemma 4.4 (rectangular-slab inheritance) is stated
 * to supply, and what a project certification of the slab would have to close.
 *
 * WHAT LEMMA 4.4 SUPPLIES (as recorded by the imp-95012 spec transcription).
 * The slab hypothesis is nonvanishing of the heat-flowed carrier H_tau on a
 * COMPACT rectangular box: the real coordinate u ranges over the unit landmark
 * cell [X, X+1], the height coordinate v over the closed band [y*, 1], and the
 * flow time tau over [0, t*]. Lemma 4.4 ("rectangular-slab inheritance") is the
 * bridge that turns this box hypothesis into the geometry Theorem 4.5 consumes:
 *   (i) an INTERMEDIATE WEDGE -- it inherits nonvanishing from the rectangular
 *       box interior out to an interpolating wedge that reaches the final time
 *       tau = t* while keeping the height above y* (the slab boundary is carried
 *       forward under the flow to the terminal slice), and
 *   (ii) a SHORT FINAL JOIN -- it welds the wedge`s terminal edge at u = X+1 to
 *       the directed final-time tail (hypothesis (b)) over a short u-interval,
 *       so the compact slab and the x >= X+1 tail meet with no gap at the seam.
 * The initial condition is SHARED with the 0.14 row: (1 + y*)/2 = 233/400 > 1/2,
 * covered by the SAME published zeta-zero verification (height exceeds X/2).
 *
 * WHY THIS IS A TARGET, NOT A RESULT (the honest residual). The spec bakes the
 * DECISION and the box geometry, but not an evaluable proof of nonvanishing on
 * the box. Certifying hypothesis (a) as a project fact would require, at
 * minimum, the items enumerated in SLAB_CERTIFICATION_REQUIREMENTS below --
 * none of which the frozen spec discharges. In particular the paper itself
 * routes the box through a LARGER compact slab whose only in-repo pointer is the
 * external preprint [20], which the paper explicitly flags as "not an antecedent
 * of Theorem 4.5 or of any claimed project status" (an audit target, not a lever).
 * So the slab lane is an exact CONDITIONAL target: independent of the Gate-2
 * open family 690988 <= N <= 54799999, and independent of the tail lane, but not
 * yet certified. This module characterizes it and names the sub-gap; it proves
 * nothing new. Changes no bound; closes no gap; NO QED;
 * no refereed bound is changed.
 */

import { ROW_01399_DECISION, GATE2_ROW } from './imp-95012-gate2-frozen-spec.js';

// ── the rectangular slab (4.4) hypothesis, made explicit ────────────────────
// H_tau(u + iv) != 0 on the compact box below; coordinates carried from the
// imp-95012 ROW_01399_DECISION so the arithmetic stays pinned to the frozen spec.
export const SLAB_HYPOTHESIS = Object.freeze({
  statement: 'H_tau(u + iv) != 0 on the closed box [X, X+1] x [y*, 1] x [0, t*]',
  uBand: { lo: 'X', hi: 'X+1', note: 'unit landmark cell in the real coordinate; X = GATE2_ROW.X' },
  vBand: { lo: ROW_01399_DECISION.yStar.value, hi: 1 }, // [0.165, 1]
  tauBand: { lo: 0, hi: ROW_01399_DECISION.tStar.value }, // [0, 0.1262875]
  X: GATE2_ROW.X,
  yStar: ROW_01399_DECISION.yStar.value, // 33/200 = 0.165
  tStar: ROW_01399_DECISION.tStar.value, // 10103/80000 = 0.1262875
  target: ROW_01399_DECISION.target.value, // t* + y*^2/2 = 0.1399
  sharedInitialCondition: (1 + ROW_01399_DECISION.yStar.value) / 2, // 233/400 = 0.5825
  compact: true,
  presupposesOpenFamily: false,
});

// ── what Lemma 4.4 (rectangular-slab inheritance) is stated to supply ───────
export const LEMMA_44_SUPPLIES = Object.freeze([
  {
    key: 'intermediate_wedge',
    what: 'inherits nonvanishing from the box interior out to an interpolating wedge reaching the terminal slice tau = t* while keeping height above y* (slab boundary carried forward under the flow)',
    role: 'geometry the Theorem 4.5 corridor consumes at final time',
  },
  {
    key: 'short_final_join',
    what: 'welds the wedge terminal edge at u = X+1 to the directed final-time tail (hypothesis b) over a short u-interval, sealing the seam between the compact slab and the x >= X+1 tail',
    role: 'seam continuity between the slab lane and the tail lane (imp-95047)',
  },
]);

// ── what a project certification of the slab hypothesis must close ──────────
// None of these is discharged by the imp-95012 frozen spec; each is a residual.
export const SLAB_CERTIFICATION_REQUIREMENTS = Object.freeze([
  {
    key: 'box_nonvanishing_evaluator',
    what: 'a certified nonvanishing check for H_tau on the whole closed box [X,X+1]x[y*,1]x[0,t*] (interval/rigorous, not a finite sample)',
    dischargedBySpec: false,
  },
  {
    key: 'lemma_44_statement',
    what: 'the precise Lemma 4.4 hypotheses under which box nonvanishing yields the intermediate wedge and the short final join (only the conclusion is transcribed in imp-95012, not the quantitative hypotheses)',
    dischargedBySpec: false,
  },
  {
    key: 'larger_slab_provenance',
    what: 'provenance for the LARGER compact slab the paper routes the box through; its only pointer is external preprint [20], flagged as not an antecedent -- an audit target, not an in-repo lever',
    dischargedBySpec: false,
  },
  {
    key: 'seam_join_width',
    what: 'the quantitative short-join u-width at u = X+1 and the matching condition against the tail lane band y* <= v <= sqrt(1 - 2 t*)',
    dischargedBySpec: false,
  },
]);

// ── verdict object ──────────────────────────────────────────────────────────
export const IMP95046_SLAB_44_TARGET = Object.freeze({
  ticket: 'imp-95046',
  proofSection: 'S-frontier / Theorem 4.5 slab lane',
  source:
    'Permuting the Zeta Twin Ladder Section 4.10 (Lemma 4.4 / Theorem 4.5); imp-95012 frozen spec ROW_01399_DECISION',
  disposition: 'INDEPENDENT-CONDITIONAL-TARGET',
  hypothesis: SLAB_HYPOTHESIS,
  lemma44Supplies: LEMMA_44_SUPPLIES,
  certificationRequirements: SLAB_CERTIFICATION_REQUIREMENTS,
  independentOfOpenFamily: true,
  independentOfTailLane: true, // the tail (hypothesis b) is tracked separately in imp-95047
  provesBound: false,
  isRigorous: false,
  namedSubGap: 'imp-95046-sub-slab-box-nonvanishing-certificate',
  subGapStatement:
    'the rectangular-slab (4.4) hypothesis H_tau != 0 on [X,X+1]x[y*,1]x[0,t*] is an exact standalone conditional target: certifying it requires a rigorous box-nonvanishing evaluator, the quantitative Lemma 4.4 inheritance hypotheses (only the wedge+join conclusion is transcribed in imp-95012), provenance for the larger compact slab (external preprint [20], flagged not-an-antecedent), and the short-join width matching the tail lane band; the frozen spec discharges none of these, so the slab lane stays conditional and independent of the Gate-2 open family',
  verdict:
    'ASSESSMENT ONLY: the rectangular slab (4.4) is characterized as a standalone ' +
    'conditional target -- a compact box hypothesis H_tau != 0 on [X,X+1]x[y*,1]x[0,t*] ' +
    'from which Lemma 4.4 supplies an intermediate wedge to the terminal slice and a ' +
    'short final join to the tail lane, on the shared 233/400 initial condition. It is ' +
    'independent of the Gate-2 open family and of the tail lane, but none of the four ' +
    'certification requirements is discharged by the frozen spec, so it is a target, not ' +
    'a result. Changes no bound; closes no gap; NO QED; no refereed bound is changed.',
});

// ── assertions (self-executing; import-light; throw on violation) ───────────
export const IMP95046_SLAB_44_TARGET_ASSERTIONS = [
  {
    id: 'imp95046-slab-target-hits-01399',
    description: 't* + y*^2/2 = 1399/10000 = 0.1399 exactly from the pinned slab coordinates',
    holds: () =>
      Math.abs(SLAB_HYPOTHESIS.tStar + (SLAB_HYPOTHESIS.yStar ** 2) / 2 - 0.1399) < 1e-12 &&
      Math.abs(SLAB_HYPOTHESIS.target - 0.1399) < 1e-12,
  },
  {
    id: 'imp95046-shared-initial-condition-2333-over-400',
    description: 'the shared initial condition (1 + y*)/2 = 233/400 = 0.5825 > 1/2',
    holds: () =>
      Math.abs(SLAB_HYPOTHESIS.sharedInitialCondition - 233 / 400) < 1e-15 &&
      SLAB_HYPOTHESIS.sharedInitialCondition > 0.5,
  },
  {
    id: 'imp95046-vband-starts-at-ystar',
    description: 'the slab height band is the closed [y*, 1] with y* = 33/200 = 0.165',
    holds: () =>
      Math.abs(SLAB_HYPOTHESIS.vBand.lo - 33 / 200) < 1e-15 &&
      SLAB_HYPOTHESIS.vBand.hi === 1 &&
      SLAB_HYPOTHESIS.tauBand.lo === 0 &&
      Math.abs(SLAB_HYPOTHESIS.tauBand.hi - 10103 / 80000) < 1e-15,
  },
  {
    id: 'imp95046-lemma-44-supplies-wedge-and-join',
    description: 'Lemma 4.4 supplies exactly the intermediate wedge and the short final join',
    holds: () =>
      LEMMA_44_SUPPLIES.length === 2 &&
      LEMMA_44_SUPPLIES[0].key === 'intermediate_wedge' &&
      LEMMA_44_SUPPLIES[1].key === 'short_final_join',
  },
  {
    id: 'imp95046-no-requirement-discharged-by-spec',
    description: 'every slab certification requirement is still open (undischarged by the frozen spec)',
    holds: () =>
      SLAB_CERTIFICATION_REQUIREMENTS.length === 4 &&
      SLAB_CERTIFICATION_REQUIREMENTS.every((r) => r.dischargedBySpec === false),
  },
  {
    id: 'imp95046-independent-conditional-no-qed',
    description: 'the slab lane is an independent conditional target: no bound, not rigorous, sub-gap named, no refereed bound is changed',
    holds: () =>
      IMP95046_SLAB_44_TARGET.independentOfOpenFamily === true &&
      IMP95046_SLAB_44_TARGET.provesBound === false &&
      IMP95046_SLAB_44_TARGET.isRigorous === false &&
      SLAB_HYPOTHESIS.presupposesOpenFamily === false &&
      IMP95046_SLAB_44_TARGET.namedSubGap === 'imp-95046-sub-slab-box-nonvanishing-certificate' &&
      /NO QED/.test(IMP95046_SLAB_44_TARGET.verdict) &&
      /refereed bound is changed/i.test(IMP95046_SLAB_44_TARGET.verdict),
  },
];

for (const a of IMP95046_SLAB_44_TARGET_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95046-slab-44-conditional-target assertion failed: ${a.id}`);
  }
}

export default IMP95046_SLAB_44_TARGET;
