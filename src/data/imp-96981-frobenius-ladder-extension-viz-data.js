/**
 * @module imp-96981-frobenius-ladder-extension-viz-data
 * @fileoverview imp-96981 -- import-light viz-data leaf for imp-96912 (extended 24-rung exact
 *   Vasyunin-Gram Frobenius-norm ladder N=250..24000 and the three refitted model ceilings).
 *   Bakes the full 24-rung ladder, the out-of-sample RMS per model at the 6 new rungs (line
 *   4.02e-2, quad 4.23e-3, tail 1.44e-2), and the three refitted cond#=1/eps ceilings plus the
 *   quad-vs-tail spread (6.22%) as plain literals, so a consuming page does not re-run the
 *   lstsq refit or the V-table build. Presentation only; posts no rigorous ceiling; changes no
 *   bound; RH open; NO QED.
 *
 * @see imp-96912-route-m-frobenius-ladder-extension-above-16000.js (source module; the values here are read off it)
 * @see imp-96972-route-m-frobenius-ceiling-narrowing-rate-viz-data.js (sibling leaf; the per-decade narrowing rate)
 */

// full 24-rung exact ||G||_F ladder (imp-96890 base 250..16000 + imp-96912 new 17000..24000).
export const IMP96981_LADDER = Object.freeze([
  Object.freeze({ N: 250, frobenius: 5.156452701268937 }),
  Object.freeze({ N: 500, frobenius: 5.529997674354878 }),
  Object.freeze({ N: 1000, frobenius: 5.8818954543089985 }),
  Object.freeze({ N: 2000, frobenius: 6.214997339611781 }),
  Object.freeze({ N: 3000, frobenius: 6.402120438801899 }),
  Object.freeze({ N: 4000, frobenius: 6.5317250252564945 }),
  Object.freeze({ N: 5000, frobenius: 6.63054847658566 }),
  Object.freeze({ N: 6000, frobenius: 6.710233218835323 }),
  Object.freeze({ N: 7000, frobenius: 6.776886864553974 }),
  Object.freeze({ N: 8000, frobenius: 6.834107225532644 }),
  Object.freeze({ N: 9000, frobenius: 6.884189704438562 }),
  Object.freeze({ N: 10000, frobenius: 6.928687055 }),
  Object.freeze({ N: 11000, frobenius: 6.968697840 }),
  Object.freeze({ N: 12000, frobenius: 7.005027412 }),
  Object.freeze({ N: 13000, frobenius: 7.038283442 }),
  Object.freeze({ N: 14000, frobenius: 7.068935551 }),
  Object.freeze({ N: 15000, frobenius: 7.097354059 }),
  Object.freeze({ N: 16000, frobenius: 7.123836045 }),
  Object.freeze({ N: 17000, frobenius: 7.14862341449302 }),
  Object.freeze({ N: 18000, frobenius: 7.171915715310095 }),
  Object.freeze({ N: 19000, frobenius: 7.193879449514509 }),
  Object.freeze({ N: 20000, frobenius: 7.214654966252099 }),
  Object.freeze({ N: 22000, frobenius: 7.253101861521979 }),
  Object.freeze({ N: 24000, frobenius: 7.288025163425234 }),
]);

// the top 6 rungs (N>16000), flagged as the imp-96912 extension, for chart annotation.
export const IMP96981_NEW_RUNGS_FROM_N = 17000;

// out-of-sample RMS per model, scored at the 6 new rungs against the 18-rung (imp-96890) fits.
export const IMP96981_OUT_OF_SAMPLE = Object.freeze({
  rmsLine: 0.04019252885130144,
  rmsQuad: 0.004232247139039972,
  rmsTail: 0.014390283029475346,
  best: 'quad',
  quadBeatsTailFactor: 3.4001518712679872, // quad RMS is 3.4x smaller than tail RMS
  quadBeatsLineFactor: 9.497252442417634,
});

// three cond#=1/eps ceilings, refit over the full extended 24-rung ladder.
export const IMP96981_CEILING = Object.freeze({
  NstarLine: 37998774.841981724,
  NstarQuad: 40877019.38908543,
  NstarTail: 38482842.1960231,
  quadShiftPct: 7.574571967314503, // quad vs line
  tailShiftPct: 1.2739025298956985, // tail vs line
  quadVsTailSpreadPct: 6.221414678434911, // the ambiguity band this ticket reports on
  baseSpreadPct: 6.892404093897242, // imp-96890 18-rung spread, for before/after comparison
  narrowFactor: 1.1078515820185013, // 24-rung refit barely narrows the band
  traceCeiling: 25940000, // rigorous trace-lower ceiling T (imp-96693); F stays strictly above it
});

export const IMP96981_VERDICT = Object.freeze({
  ticket: 'imp-96981',
  newExactRungs: 6,
  outOfSampleFavoursQuadratic: true,
  ceilingAmbiguityBarelyNarrows: true,
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  qed: false,
});

export default {
  ladder: IMP96981_LADDER,
  newRungsFromN: IMP96981_NEW_RUNGS_FROM_N,
  outOfSample: IMP96981_OUT_OF_SAMPLE,
  ceiling: IMP96981_CEILING,
  verdict: IMP96981_VERDICT,
};

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96981_ASSERTIONS = [
  {
    id: 'imp96981-ladder-has-24-monotone-rungs',
    holds: () =>
      IMP96981_LADDER.length === 24 &&
      IMP96981_LADDER.every(
        (r, i) => i === 0 || (r.N > IMP96981_LADDER[i - 1].N && r.frobenius > IMP96981_LADDER[i - 1].frobenius),
      ) &&
      IMP96981_LADDER[0].N === 250 &&
      IMP96981_LADDER[IMP96981_LADDER.length - 1].N === 24000,
    why: 'the baked ladder carries all 24 exact rungs (imp-96890 base 250..16000 plus the imp-96912 extension 17000..24000), monotone increasing in both N and the exact Frobenius norm.',
  },
  {
    id: 'imp96981-out-of-sample-favours-quadratic',
    holds: () =>
      IMP96981_OUT_OF_SAMPLE.rmsQuad < IMP96981_OUT_OF_SAMPLE.rmsTail &&
      IMP96981_OUT_OF_SAMPLE.rmsQuad < IMP96981_OUT_OF_SAMPLE.rmsLine &&
      IMP96981_OUT_OF_SAMPLE.best === 'quad' &&
      IMP96981_OUT_OF_SAMPLE.quadBeatsTailFactor > 3 && IMP96981_OUT_OF_SAMPLE.quadBeatsTailFactor < 4,
    why: 'reproduces the imp-96912 Finding 1 literals: out-of-sample at the 6 new rungs the quadratic model beats the +d/N tail by ~3.4x and the line by ~9.5x.',
  },
  {
    id: 'imp96981-ceiling-spread-barely-narrows-and-stays-above-trace',
    holds: () =>
      IMP96981_CEILING.NstarQuad > IMP96981_CEILING.NstarTail &&
      IMP96981_CEILING.NstarTail > IMP96981_CEILING.NstarLine &&
      IMP96981_CEILING.NstarLine > IMP96981_CEILING.traceCeiling &&
      IMP96981_CEILING.quadVsTailSpreadPct > 6 && IMP96981_CEILING.quadVsTailSpreadPct < 6.6 &&
      IMP96981_CEILING.narrowFactor > 1.0 && IMP96981_CEILING.narrowFactor < 1.3,
    why: 'reproduces the imp-96912 Finding 2 literals: the quad-vs-tail F-ceiling spread narrows only 6.89% -> 6.22% (1.11x) over the extended ladder, and every model ceiling sits strictly above the rigorous trace ceiling T~2.594e7.',
  },
  {
    id: 'imp96981-honesty-gate-no-qed',
    holds: () =>
      IMP96981_VERDICT.anyBoundMoved === false &&
      IMP96981_VERDICT.postsRigorousCeiling === false &&
      IMP96981_VERDICT.qed === false,
    why: 'presentation only: this leaf bakes already-measured literals for display and moves no bound, posts no rigorous ceiling, and claims no QED.',
  },
];

for (const a of IMP96981_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96981-frobenius-ladder-extension-viz-data assertion failed: ${a.id}`);
  }
}
