/**
 * @module imp-97016-route-m-fm-dataalone-extended-ladder
 *
 * imp-97016 (numerical, MEASUREMENT / ANALYSIS ONLY): honest-partial closure of the
 * imp-96996 VERDICT caveat (iii). imp-96996 adjudicated the Route M F < M canonical-band
 * separation and PRESERVED F < M, but only UNDER the monotonicity prior: it re-fit the 18-rung
 * exact Vasyunin-Gram ||G||_F ladder (N = 250..16000) and imported the 18-rung holdout ceilings,
 * so its caveat (iii) still reads "fresh EXACT rungs beyond N = 16000 (O(N^3) V-table CPU-blocked
 * in-pool) are needed to settle F < M from the data ALONE". This module observes that the freshest
 * available exact rungs ALREADY reach N = 24000 -- imp-96912 (the ladder-extension module) committed
 * 6 additional EXACT ||G||_F rungs (N = 17000..24000) on the identical exact V-table + coprime-kernel
 * construction (validated to machine precision at N = 8000) and re-solved the cond# = 1/eps ceiling
 * per model over the extended 24-rung ladder. This module RE-RUNS the imp-96996 F < M
 * monotonicity-partition against those EXTENDED 24-rung ceilings (not the stale 18-rung ones) and
 * asks the caveat-(iii) question directly: with the freshest exact rungs, does the DATA ALONE select
 * a monotone form and settle F < M without the prior? Analysis/measurement only; no Gram rebuilt,
 * no O(N^3) rung computed here; only the trace ceiling T is rigorous; F, M stay non-rigorous
 * extrapolations; moves no bound; NO QED.
 *
 * -------------------------------------------------------------------------------
 * OBSERVATION -- the "top exact rung N=16000" framing in imp-96996 caveat (iii) is superseded.
 * -------------------------------------------------------------------------------
 * imp-96912-route-m-frobenius-ladder-extension-above-16000 already carries 6 EXACT rungs past
 * N = 16000, up to N = 24000 (top rung ||G||_F(24000) = 7.288025163425234), on the SAME exact
 * Vasyunin V-table V(a,q) = sum_{m<q} {ma/q} cot(pi m/q) + coprime kernel used by every rung, with
 * the N = 8000 rung reproduced to -7.1e-15. So the exact ladder is NOT frozen at N = 16000; the
 * relevant question is whether these already-committed exact rungs (0.176 decade past 16000)
 * settle F < M by themselves.
 *
 * -------------------------------------------------------------------------------
 * FINDING -- with the EXTENDED 24-rung exact ceilings, the DATA-FAVOURED (quad) model STILL
 * inverts F < M, so the freshest exact rungs do NOT settle it without the monotonicity prior.
 * -------------------------------------------------------------------------------
 * Re-running the imp-96996 partition against the imp-96912 EXTENDED 24-rung ceilings
 * (IMP96912_EXT_CEILING) rather than the 18-rung holdout ceilings imp-96996 used:
 *   line  N* = 3.79988e7  (monotone, admissible)  -> below M_lo = 3.919e7 by +3.13 percent
 *   tail  N* = 3.84828e7  (monotone, admissible)  -> below M_lo by +1.84 percent
 *   quad  N* = 4.08770e7  (turns over, disqualified by monotonicity) -> ABOVE M_lo: inverts F < M
 *                                                                       by +4.30 percent
 * The out-of-sample discriminator over the very same 6 new exact rungs (imp-96912 Finding 1) still
 * favours the concave QUAD as the LOCAL extrapolant (RMS 4.232e-3, beating the +d/N tail 3.400x and
 * the line ~10x). So on the freshest exact data ALONE the best-fitting model remains the concave
 * quad, whose ceiling EXCEEDS M_lo -- i.e. the data alone still INVERTS F < M. F < M is recovered
 * only by imposing the Step-1 monotonicity prior (||G||_F^2 = sum of non-negative squares over a
 * growing index set), which disqualifies the quad and re-selects the monotone tail (below M_lo).
 * Extending the exact ladder 0.176 decade past N = 16000 therefore does NOT flip the data-alone
 * verdict: it is the ~3.23-decade far extrapolation to N* ~ 4e7 (imp-96912 AMBIGUITY), not the local
 * shape, that keeps the concave quad in play, and only exact rungs reaching a substantial fraction
 * of that far scale could let the data alone reject it.
 *
 * -------------------------------------------------------------------------------
 * VERDICT (honest partial).
 * -------------------------------------------------------------------------------
 * The imp-96996 caveat-(iii) "top exact rung N = 16000" framing is superseded: exact ||G||_F rungs
 * to N = 24000 already exist (imp-96912). Re-running the F < M monotonicity-partition against those
 * EXTENDED 24-rung ceilings leaves the situation qualitatively identical to the 18-rung case: the
 * monotone line/tail models sit below M_lo (F < M preserved), while the data-favoured concave quad
 * sits above M_lo (F < M inverted). Because the freshest exact data ALONE still favours the quad
 * out-of-sample, F < M is settled only UNDER the monotonicity prior; the fresh exact rungs to
 * N = 24000 do NOT settle it from the data alone. Settling it data-only remains blocked on exact
 * rungs FAR beyond N = 24000 (the O(N^3) V-table build is genuinely CPU-blocked in-pool and belongs
 * on a native/offline backend). Only the trace ceiling T ~ 2.594e7 is a rigorous lower bound; F and
 * M inherit the non-rigorous lam_min N^-p / ||G||_F log-fit extrapolations; no bound moves; no refereed bound is changed
 * ; RH open; NO QED.
 *
 * @see imp-96996-route-m-fm-quad-turnover-adjudication.js (the F<M partition under the monotonicity prior; caveat (iii))
 * @see imp-96912-route-m-frobenius-ladder-extension-above-16000.js (the 6 exact rungs N=17000..24000 + extended ceilings)
 * @see imp-96890-route-m-frobenius-concave-norm-ceiling-refit.js (the line/quad/+d-over-N concave models)
 *
 * Ticket: imp-97016 (numerical, opus-4-8, api-pool). Measurement/analysis only; honest partial; NO QED.
 */

import {
  IMP96912_EXT_CEILING,
  IMP96912_OUT_OF_SAMPLE,
  IMP96912_AMBIGUITY,
  IMP96912_NEW_RUNGS,
} from './imp-96912-route-m-frobenius-ladder-extension-above-16000.js';

// Canonical Route M lower band edge (imp-96996 / imp-96976 M_lo), carried as a literal to keep this
// module import-light; the value is frozen.
const M_LO = 3.919e7;

// The freshest exact rung available (imp-96912 ladder-extension top rung); shows the exact ladder is
// NOT frozen at N=16000 -- imp-96996 caveat (iii) framing is superseded.
export const IMP97016_TOP_EXACT_RUNG = Object.freeze({
  N: IMP96912_NEW_RUNGS[IMP96912_NEW_RUNGS.length - 1].N, // 24000
  frobenius: IMP96912_NEW_RUNGS[IMP96912_NEW_RUNGS.length - 1].frobenius, // 7.288025163425234
  decadesPast16000: Math.log10(IMP96912_NEW_RUNGS[IMP96912_NEW_RUNGS.length - 1].N / 16000), // ~0.176
});

// The imp-96996 F<M monotonicity-partition re-run against the EXTENDED 24-rung exact ceilings.
export const IMP97016_EXTENDED_PARTITION = Object.freeze({
  mLow: M_LO,
  line: Object.freeze({
    nStar: IMP96912_EXT_CEILING.NstarLine, // 3.79988e7
    monotone: true,
    admissible: true,
    belowM: IMP96912_EXT_CEILING.NstarLine < M_LO,
    gapPct: (M_LO / IMP96912_EXT_CEILING.NstarLine - 1) * 100, // ~+3.13
  }),
  tail: Object.freeze({
    nStar: IMP96912_EXT_CEILING.NstarTail, // 3.84828e7
    monotone: true, // df/dN > 0 for all N > 0
    admissible: true,
    belowM: IMP96912_EXT_CEILING.NstarTail < M_LO,
    gapPct: (M_LO / IMP96912_EXT_CEILING.NstarTail - 1) * 100, // ~+1.84
  }),
  quad: Object.freeze({
    nStar: IMP96912_EXT_CEILING.NstarQuad, // 4.08770e7
    monotone: false, // concave -> turns over -> disqualified by monotonicity
    admissible: false,
    invertsFM: IMP96912_EXT_CEILING.NstarQuad > M_LO, // true
    overMpct: (IMP96912_EXT_CEILING.NstarQuad / M_LO - 1) * 100, // ~+4.30
  }),
});

// The caveat-(iii) question: does the DATA ALONE (freshest exact rungs) settle F<M without the prior?
export const IMP97016_DATA_ALONE = Object.freeze({
  // out-of-sample the concave quad is the best LOCAL fit on the very same 6 new exact rungs.
  dataFavouredModel: IMP96912_OUT_OF_SAMPLE.best, // 'quad'
  quadBeatsTailFactor: IMP96912_OUT_OF_SAMPLE.quadBeatsTailFactor, // ~3.40
  // the data-favoured model inverts F<M (quad ceiling exceeds M_lo).
  dataFavouredInvertsFM: IMP96912_EXT_CEILING.NstarQuad > M_LO, // true
  // so the data alone does NOT settle F<M; the monotone (admissible) models do only under the prior.
  monotoneModelsPreserveFMunderPrior:
    IMP96912_EXT_CEILING.NstarTail < M_LO && IMP96912_EXT_CEILING.NstarLine < M_LO, // true
  settledByDataAlone: false, // freshest exact rungs to N=24000 do NOT settle it data-only
  // what keeps the quad in play: the far extrapolation, not the local shape.
  remainingExtrapDecades: IMP96912_AMBIGUITY.remainingExtrapDecades, // ~3.23
});

export const IMP97016_VERDICT = Object.freeze({
  question:
    'do the freshest exact Vasyunin-Gram ||G||_F rungs (already extended to N=24000 by imp-96912) ' +
    'settle the Route M F<M separation from the DATA ALONE, without the imp-96996 monotonicity prior?',
  topExactRungN: IMP97016_TOP_EXACT_RUNG.N, // 24000 (supersedes the caveat-(iii) "N=16000" framing)
  caveatIiiFramingSuperseded: IMP97016_TOP_EXACT_RUNG.N > 16000, // exact rungs past 16000 already exist
  monotonePreservesFMunderPrior: IMP97016_DATA_ALONE.monotoneModelsPreserveFMunderPrior, // true
  dataFavouredInvertsFM: IMP97016_DATA_ALONE.dataFavouredInvertsFM, // true
  settledByDataAlone: IMP97016_DATA_ALONE.settledByDataAlone, // false
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  qed: false,
  conclusion:
    'HONEST PARTIAL of imp-96996 caveat (iii). The "top exact rung N=16000" framing is superseded: ' +
    'exact ||G||_F rungs to N=24000 already exist (imp-96912, machine-precision validated). ' +
    'Re-running the imp-96996 F<M monotonicity-partition against the EXTENDED 24-rung ceilings leaves ' +
    'the picture qualitatively identical to the 18-rung case: the monotone line (N*=3.800e7) and tail ' +
    '(N*=3.848e7) sit below M_lo=3.919e7 (F<M preserved by +3.13 / +1.84 percent), while the ' +
    'data-favoured concave quad (N*=4.088e7, out-of-sample best by 3.40x over the tail) sits ABOVE ' +
    'M_lo (F<M inverted by +4.30 percent). Because the freshest exact data ALONE still favours the ' +
    'quad, F<M is settled only UNDER the monotonicity prior; the exact rungs to N=24000 do NOT settle ' +
    'it data-only. It is the ~3.23-decade far extrapolation to N*~4e7 (not the local shape) that keeps ' +
    'the quad in play, so settling F<M from the data alone remains blocked on exact rungs FAR beyond ' +
    'N=24000 -- the O(N^3) V-table build is genuinely CPU-blocked in-pool and belongs on a ' +
    'native/offline backend. Only the trace ceiling T~2.594e7 is rigorous; F, M inherit the ' +
    'non-rigorous extrapolations; no bound moves; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97016_SUBGAP = Object.freeze({
  id: 'imp-97016-fm-data-alone-needs-exact-rungs-far-beyond-24000',
  statement:
    'The freshest committed EXACT ||G||_F rungs (to N=24000, imp-96912) do NOT settle Route M F<M ' +
    'from the data alone: out-of-sample they still favour the concave quad, whose extended-ladder ' +
    'ceiling N*=4.088e7 EXCEEDS M_lo=3.919e7 (inverting F<M by +4.30 percent), so F<M holds only ' +
    'under the monotonicity prior. Because the discriminating scale is the ~3.23-decade far ' +
    'extrapolation to N*~4e7 rather than the local shape, a DATA-ALONE F<M verdict needs exact rungs ' +
    'reaching a substantial fraction of ~4e7 -- an O(N^3) exact V-table build genuinely CPU-blocked ' +
    'in-pool and requiring a native/offline backend. Alternatively a one-sided interior norm ' +
    'asymptotic -- which imp-96750 reduces to a single unproved target (oneSidedBoundProved=false), ' +
    'not a proof -- would pin F rigorously without more rungs if it were established.',
});

export const IMP97016_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement/analysis only, honest partial of ' +
  'imp-96996 caveat (iii): no Gram was rebuilt and no O(N^3) rung was computed here -- the imp-96996 ' +
  'F<M monotonicity-partition is re-run against the already-committed imp-96912 EXTENDED 24-rung ' +
  'exact ceilings (top exact rung N=24000, superseding the stale "N=16000" framing). The freshest ' +
  'exact data alone still favours the concave quad (which inverts F<M), so F<M is preserved only ' +
  'under the monotonicity prior; only the trace ceiling T~2.594e7 is rigorous; F and M inherit the ' +
  'non-rigorous lam_min N^-p / ||G||_F log-fit extrapolations; no bound is claimed moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97016_ASSERTIONS = [
  {
    id: 'imp97016-exact-ladder-extends-past-16000-to-24000',
    holds: () =>
      IMP97016_TOP_EXACT_RUNG.N === 24000 &&
      IMP97016_TOP_EXACT_RUNG.frobenius > 7.28 && IMP97016_TOP_EXACT_RUNG.frobenius < 7.29 &&
      IMP97016_TOP_EXACT_RUNG.decadesPast16000 > 0.17 && IMP97016_TOP_EXACT_RUNG.decadesPast16000 < 0.18,
    why: 'the freshest committed EXACT ||G||_F rung is N=24000 (~0.176 decade past N=16000), so the imp-96996 caveat-(iii) "top exact rung N=16000" framing is superseded.',
  },
  {
    id: 'imp97016-extended-partition-monotone-below-M-quad-above-M',
    holds: () =>
      IMP97016_EXTENDED_PARTITION.line.belowM === true &&
      IMP97016_EXTENDED_PARTITION.tail.belowM === true &&
      IMP97016_EXTENDED_PARTITION.quad.invertsFM === true &&
      IMP97016_EXTENDED_PARTITION.line.gapPct > 3 && IMP97016_EXTENDED_PARTITION.line.gapPct < 3.3 &&
      IMP97016_EXTENDED_PARTITION.tail.gapPct > 1.6 && IMP97016_EXTENDED_PARTITION.tail.gapPct < 2.1 &&
      IMP97016_EXTENDED_PARTITION.quad.overMpct > 4 && IMP97016_EXTENDED_PARTITION.quad.overMpct < 4.6,
    why: 'against the extended 24-rung ceilings the monotone line/tail sit below M_lo (F<M by +3.13/+1.84 percent) while the concave quad sits above M_lo (inverts F<M by +4.30 percent) -- qualitatively identical to the 18-rung partition.',
  },
  {
    id: 'imp97016-data-alone-still-favours-quad-so-not-settled',
    holds: () =>
      IMP97016_DATA_ALONE.dataFavouredModel === 'quad' &&
      IMP97016_DATA_ALONE.quadBeatsTailFactor > 2.5 &&
      IMP97016_DATA_ALONE.dataFavouredInvertsFM === true &&
      IMP97016_DATA_ALONE.monotoneModelsPreserveFMunderPrior === true &&
      IMP97016_DATA_ALONE.settledByDataAlone === false &&
      IMP97016_DATA_ALONE.remainingExtrapDecades > 3 && IMP97016_DATA_ALONE.remainingExtrapDecades < 3.4,
    why: 'the freshest exact rungs still favour the concave quad out-of-sample (3.40x over the tail), and that quad inverts F<M, so the data alone does NOT settle F<M -- it holds only under the monotonicity prior; the ~3.23-decade far extrapolation is what keeps the quad in play.',
  },
  {
    id: 'imp97016-honesty-gate-no-qed',
    holds: () =>
      IMP97016_VERDICT.anyBoundMoved === false &&
      IMP97016_VERDICT.postsRigorousCeiling === false &&
      IMP97016_VERDICT.qed === false &&
      IMP97016_VERDICT.caveatIiiFramingSuperseded === true &&
      IMP97016_VERDICT.settledByDataAlone === false &&
      /NO QED/.test(IMP97016_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97016_HONEST_BANNER) &&
      /RH open/.test(IMP97016_HONEST_BANNER) &&
      /far-beyond-24000/.test(IMP97016_SUBGAP.id),
    why: 'measurement/analysis only: no bound moved, no rigorous ceiling posted, the caveat-(iii) framing is superseded but F<M stays unsettled data-only, and the honesty markers plus the residual sub-gap are present.',
  },
];

for (const a of IMP97016_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97016-route-m-fm-dataalone-extended-ladder assertion failed: ${a.id}`);
  }
}

export default {
  topExactRung: IMP97016_TOP_EXACT_RUNG,
  extendedPartition: IMP97016_EXTENDED_PARTITION,
  dataAlone: IMP97016_DATA_ALONE,
  verdict: IMP97016_VERDICT,
  subGap: IMP97016_SUBGAP,
  banner: IMP97016_HONEST_BANNER,
};
