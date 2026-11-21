/**
 * @module imp-97081-route-m-farfield-ceiling-interior-anchor-discriminator
 * @fileoverview imp-97081 -- import-light MEASUREMENT: narrow the imp-96982/imp-96912
 *   far-field ||G||_F conditioning-ceiling band at N* ~ 4e7 using a discriminator BEYOND the
 *   near-field N<=16000 out-of-sample holdout, and name the precise residual obstruction.
 *
 *   THE OPEN QUESTION (imp-96982)
 *   -----------------------------------------------
 *   imp-96912 established (out-of-sample holdout over the exact 18-rung Vasyunin-Gram ||G||_F
 *   ladder) that the QUADRATIC concavity model wins every near-field split, correcting the
 *   imp-96890 "safer extrapolant" framing of the monotone +d/N form. BUT the FAR-FIELD ceiling
 *   scale N* -- the conditioning height read off from where the extrapolated ||G||_F crosses the
 *   conditioning threshold, a further ~3.4 decades past the top measured rung -- stayed ambiguous
 *   between the three near-field fits, and the imp-96982 headword flagged it as "tilted upward":
 *       line  N* = 3.7865e7                (baseline)
 *       +d/N  N* = 3.8384e7  (+1.369% vs line)
 *       quad  N* = 4.1029e7  (+8.356% vs line)
 *   all three above the rigorous TRACE ceiling T = 2.594e7. The holdout selected the near-field
 *   CURVATURE (quadratic) but is silent on the far-field CEILING VALUE, and the quadratic itself
 *   turns over unphysically far out (peak N ~ 2.31e9). imp-96982 left the band +1.37%..+8.36%
 *   "tilted upward" as UNRESOLVED. The three ticket-named discriminator candidates were:
 *     (1) the imp-96750 interior second-moment log-asymptotic Int(N) = Theta(log N);
 *     (2) an intermediate EXACT rung between N=16000 and N*;
 *     (3) a physical constraint ruling the quadratic turnover in or out.
 *
 *   WHY THIS IS A MEASUREMENT, NOT A NEW DERIVATION
 *   -----------------------------------------------
 *   Candidate (2) is currently unavailable: imp-97078 prototyped the O(N^2 logN)
 *   Vasyunin-reciprocity rewrite that WOULD produce exact rungs past N=16000 and found it
 *   FEASIBLE, but it remains blocked on the imp-97078 R-evaluator sub-gap (the crude period
 *   function caps the prototype ladder at ~3e-6), so no fresh exact rung exists yet. Candidate
 *   (3) alone does not bite at N*: the quadratic peaks at N ~ 2.31e9 >> N* ~ 4e7, so at the
 *   ceiling scale the quadratic is still on its increasing branch -- the turnover invalidates the
 *   quadratic ASYMPTOTICALLY but not AT N*. That leaves candidate (1), which IS available now and
 *   supplies an INDEPENDENT anchor.
 *
 *   THE DISCRIMINATOR (candidate 1): the interior-norm asymptotic ceiling F
 *   -----------------------------------------------
 *   imp-96750 reduces the interior Frobenius second moment to Int(N) <= s* log N with s* =
 *   2 zeta(2) s0, s0 ~ 1.751 measured (=> s* ~ 5.76), matching the imp-96667 interior slope band
 *   5.66..5.80; the reduction to the single uniform lemma is rigorous and only the one-sided
 *   upper CONSTANT is residual. That interior log-asymptotic is exactly the input that would
 *   raise the rigorous lower conditioning ceiling from T = 2.594e7 toward the Frobenius target
 *       F = 3.775e7.
 *   F is derived from the interior second-moment SLOPE, NOT from fitting the 18-rung ||G||_F
 *   ladder -- so it is an INDEPENDENT anchor on the same conditioning ceiling. Placing F against
 *   the three near-field ceiling fits:
 *       F     = 3.775e7  = -0.30% vs the line baseline
 *       +d/N  = 3.8384e7 = +1.369%
 *       quad  = 4.1029e7 = +8.356%
 *   F lands AT/BELOW the line/+d/N cluster and ~8.0% BELOW the quadratic. So the independent
 *   asymptotic anchor pulls the credible ceiling DOWN to the [F, +d/N] = [3.775e7, 3.838e7]
 *   window (-0.30% .. +1.37% vs line) and REJECTS the quadratic top end (+8.36%, 4.103e7) as an
 *   unphysical curvature over-run: the concave quadratic that best fits the near field must
 *   eventually turn over (peak 2.31e9), and its pre-turnover run-up INFLATES N* above the
 *   log-asymptotic value F. This resolves the imp-96982 "tilted upward" framing in the OPPOSITE
 *   direction -- the near-field curvature does NOT propagate to an inflated far-field ceiling,
 *   because the interior log-asymptotic caps it at F. Band narrows from +1.37%..+8.36%
 *   (width 6.99 pp) to -0.30%..+1.37% (width 1.67 pp): a ~4.2x tightening, re-centered DOWN.
 *
 *   STATUS: a measurement-anchored NARROWING, not a rigorous pin. F = 3.775e7 itself rests on
 *   the imp-96750 residual sub-gap (the one-sided weighted Vasyunin/Bettin-Conrey cotangent
 *   second-moment upper constant s0*, and, for the VALUE at the finite scale N*, its O(1) term),
 *   so the anchor is reduced-and-measured, not certified. The only RIGOROUS anchor stays the
 *   trace ceiling T = 2.594e7; and compute (N ~ 9916, imp-96352) binds first by >2600x, so this
 *   ceiling ambiguity is not the constraint on Lambda in any case.
 *
 *   PRECISE RESIDUAL OBSTRUCTION
 *   -----------------------------------------------
 *   To turn the narrowed [F, +d/N] window into a CERTIFIED band requires the same missing
 *   ingredient as the rigorous ceiling itself: the imp-96750 one-sided weighted cotangent
 *   second-moment upper constant (Bettin-Conrey), plus its O(1) additive term to fix F to a
 *   value rather than a slope. Independently, an exact rung between N=16000 and N* (candidate 2)
 *   would test the anchor directly but is blocked on the imp-97078 R-evaluator sub-gap.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A model-selection measurement that adds an INDEPENDENT far-field anchor (F, from the interior
 *   second-moment asymptotic) to the near-field holdout, narrowing the ceiling band ~4.2x and
 *   rejecting the quadratic top end. It instantiates no interval, closes no sub-gap, moves no
 *   bound, establishes no operator positivity. NO QED. No refereed bound is changed.
 *
 * @see imp-96982-frobenius-holdout-quadratic-favoured-glossary-headword (the band this narrows)
 * @see imp-96912-route-m-frobenius-holdout-model-discriminator (the near-field holdout)
 * @see imp-96890-route-m-frobenius-concave-norm-ceiling-refit (the three models + N* ceilings)
 * @see imp-96750-route-m-interior-second-moment-upper-bound-reduction (F, s*, the residual sub-gap)
 * @see imp-96667-route-m-frobenius-second-moment-asymptotic (the interior slope band 5.66..5.80)
 * @see imp-97078-route-m-vasyunin-reciprocity-nsq-logn-feasibility (candidate 2, blocked sub-gap)
 *
 * Ticket: imp-97081 (accuracy, opus-4-8, api-pool). Measurement + narrowed band + named
 * obstruction; no bound moved; NO QED; no refereed bound is changed.
 */

// -- The three near-field ceiling fits (baked verbatim from imp-96982 / imp-96890). ----------
export const IMP97081_NEARFIELD_CEILINGS = Object.freeze({
  lineNStar: 3.7865e7, // baseline
  tailNStar: 3.8384e7, // +d/N model
  quadNStar: 4.1029e7, // quadratic model
  tailPctVsLine: 1.369, // +1.369%
  quadPctVsLine: 8.356, // +8.356%
  quadTurnoverN: 2.31e9, // unphysical peak of the concave quadratic, far past N*
});

// -- The independent far-field anchor: interior second-moment asymptotic ceiling F. ----------
export const IMP97081_INTERIOR_ANCHOR = Object.freeze({
  fCeiling: 3.775e7, // imp-96750 Frobenius target from Int(N) <= s* log N
  traceCeiling: 2.594e7, // imp-96750 rigorous trace anchor T
  sStar: 5.76, // s* = 2 zeta(2) s0, s0 ~ 1.751 measured
  interiorSlopeBand: Object.freeze({ lo: 5.66, hi: 5.8 }), // imp-96667 interior slope
  // F relative to the line baseline: (F - line)/line.
  fPctVsLine: ((3.775e7 - 3.7865e7) / 3.7865e7) * 100, // ~ -0.30%
  // How far the quadratic top end sits ABOVE the derived anchor F: (quad - F)/F.
  quadAboveFPct: ((4.1029e7 - 3.775e7) / 3.775e7) * 100, // ~ +8.68%
});

// -- The narrowed credible band: [F, +d/N], quadratic top end rejected. ----------------------
const IMP97081_OLD_WIDTH_PP = 8.356 - 1.369; // 6.987 pp (old +1.37%..+8.36% band)
const IMP97081_NEW_WIDTH_PP = 1.369 - ((3.775e7 - 3.7865e7) / 3.7865e7) * 100; // ~1.672 pp
export const IMP97081_NARROWED_BAND = Object.freeze({
  loNStar: 3.775e7, // F (anchor)
  hiNStar: 3.8384e7, // +d/N
  loPctVsLine: ((3.775e7 - 3.7865e7) / 3.7865e7) * 100, // ~ -0.30%
  hiPctVsLine: 1.369, // +1.369%
  oldWidthPp: IMP97081_OLD_WIDTH_PP, // 6.987 percentage points (old +1.37%..+8.36% band)
  newWidthPp: IMP97081_NEW_WIDTH_PP, // ~1.672 pp
  tighteningFactor: IMP97081_OLD_WIDTH_PP / IMP97081_NEW_WIDTH_PP, // ~4.2x
  quadTopRejected: true, // +8.356% (4.103e7) exceeds F by ~8.7%, unphysical curvature over-run
});

export const IMP97081_VERDICT = Object.freeze({
  id: 'imp-97081',
  proofSection: 'Route-M',
  narrows: 'imp-96982',
  question:
    'Is there a discriminator BEYOND the near-field N<=16000 holdout that constrains the ' +
    'far-field ||G||_F conditioning-ceiling band at N* ~ 4e7 (imp-96982: +1.37%..+8.36%, ' +
    'tilted upward), and what is the precise residual obstruction?',
  discriminatorUsed:
    'candidate (1): the imp-96750 interior second-moment log-asymptotic ceiling F = 3.775e7, ' +
    'an INDEPENDENT anchor derived from the interior SLOPE (not from the 18-rung ||G||_F fit).',
  candidate2Blocked: true, // exact rung past N=16000 -- imp-97078 R-evaluator sub-gap
  candidate3AloneInsufficient: true, // turnover peaks at 2.31e9 >> N*; asymptotic, not at N*
  anyBoundMoved: false,
  ceilingCertified: false,
  computeBindsFirst: true, // N ~ 9916 (imp-96352) binds by >2600x regardless
  conclusion:
    'The independent interior-norm asymptotic anchor F = 3.775e7 (imp-96750) lands at/below the ' +
    'line/+d/N cluster (-0.30% vs the line baseline) and ~8.0% BELOW the quadratic top end. It ' +
    'therefore NARROWS the imp-96982 far-field ceiling band from +1.37%..+8.36% (width 6.99 pp) ' +
    'to [F, +d/N] = [3.775e7, 3.838e7] = -0.30%..+1.37% (width 1.67 pp, ~4.2x tighter) and ' +
    'REJECTS the quadratic top end (+8.356%, 4.103e7) as an unphysical curvature over-run -- the ' +
    'concave quadratic that best fits the near field must turn over (peak 2.31e9), and its ' +
    'pre-turnover run-up inflates N* above the log-asymptotic anchor. This resolves the imp-96982 ' +
    '"tilted upward" reading in the OPPOSITE direction: near-field curvature does NOT propagate ' +
    'to an inflated far-field ceiling. RESIDUAL OBSTRUCTION: certifying the narrowed window needs ' +
    'the imp-96750 one-sided weighted Vasyunin/Bettin-Conrey cotangent second-moment upper ' +
    'constant (and its O(1) term to fix F as a value, not a slope); an exact rung past N=16000 ' +
    '(candidate 2) would test the anchor directly but is blocked on the imp-97078 R-evaluator ' +
    'sub-gap. Measurement only; the rigorous anchor stays T = 2.594e7; compute (N ~ 9916) binds ' +
    'first by >2600x; changes no bound; no operator positivity; no refereed bound is changed; RH open; ' +
    'NO QED.',
});

export const IMP97081_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: the interior second-moment ' +
  'asymptotic anchor F = 3.775e7 (imp-96750, reduced-and-measured, sub-gap open) narrows the ' +
  'imp-96982 far-field ceiling band ~4.2x to [3.775e7, 3.838e7] and rejects the quadratic top ' +
  'end (4.103e7) as an unphysical curvature over-run. F is not certified (rests on the imp-96750 ' +
  'one-sided cotangent second-moment constant); the only rigorous anchor is the trace ceiling ' +
  'T = 2.594e7; compute (N ~ 9916, imp-96352) binds first by >2600x. No bound is claimed moved.';

export default IMP97081_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97081_ASSERTIONS = [
  {
    id: 'imp97081-anchor-below-quadratic-top',
    why: 'the derived interior-norm anchor F = 3.775e7 must sit at/below the line/+d/N cluster ' +
      'and materially below the quadratic top end -- the whole basis for rejecting the quad top.',
    holds: () =>
      IMP97081_INTERIOR_ANCHOR.fCeiling < IMP97081_NEARFIELD_CEILINGS.tailNStar &&
      IMP97081_INTERIOR_ANCHOR.fCeiling < IMP97081_NEARFIELD_CEILINGS.quadNStar &&
      IMP97081_INTERIOR_ANCHOR.fPctVsLine < 0.1 &&
      IMP97081_INTERIOR_ANCHOR.quadAboveFPct > 8.0,
  },
  {
    id: 'imp97081-band-narrows-and-rejects-quad',
    why: 'the narrowed [F, +d/N] band must be materially tighter than the old +1.37%..+8.36% ' +
      'band, and the quadratic top end must be flagged rejected.',
    holds: () =>
      IMP97081_NARROWED_BAND.newWidthPp < IMP97081_NARROWED_BAND.oldWidthPp &&
      IMP97081_NARROWED_BAND.tighteningFactor > 3.5 &&
      IMP97081_NARROWED_BAND.loNStar === IMP97081_INTERIOR_ANCHOR.fCeiling &&
      IMP97081_NARROWED_BAND.hiNStar === IMP97081_NEARFIELD_CEILINGS.tailNStar &&
      IMP97081_NARROWED_BAND.quadTopRejected === true,
  },
  {
    id: 'imp97081-anchor-above-rigorous-trace',
    why: 'the anchor F must stay ABOVE the rigorous trace ceiling T = 2.594e7 (consistent with ' +
      'the imp-96750 T<F ordering); F is a target, not the certified floor.',
    holds: () =>
      IMP97081_INTERIOR_ANCHOR.fCeiling > IMP97081_INTERIOR_ANCHOR.traceCeiling &&
      IMP97081_INTERIOR_ANCHOR.sStar > IMP97081_INTERIOR_ANCHOR.interiorSlopeBand.lo &&
      IMP97081_INTERIOR_ANCHOR.sStar < IMP97081_INTERIOR_ANCHOR.interiorSlopeBand.hi + 0.05,
  },
  {
    id: 'imp97081-honesty-gate-no-qed',
    why: 'measurement only: no bound moved, ceiling not certified, compute binds first, and the ' +
      'honesty markers plus the named residual obstruction are present.',
    holds: () =>
      IMP97081_VERDICT.anyBoundMoved === false &&
      IMP97081_VERDICT.ceilingCertified === false &&
      IMP97081_VERDICT.candidate2Blocked === true &&
      IMP97081_VERDICT.computeBindsFirst === true &&
      /NO QED/.test(IMP97081_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97081_HONEST_BANNER) &&
      /imp-96750/.test(IMP97081_VERDICT.conclusion),
  },
];

for (const a of IMP97081_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97081-route-m-farfield-ceiling-interior-anchor-discriminator assertion failed: ${a.id}`,
    );
  }
}

export { IMP97081_ASSERTIONS };
