/**
 * @module imp-96912-route-m-frobenius-ladder-extension-above-16000
 *
 * imp-96912 (numerical, MEASUREMENT/FIT ONLY): imp-96890 fit two concave-corrected norm
 * models (quadratic in log N, and +d/N) to the exact 18-rung Vasyunin-Gram Frobenius-norm
 * ladder N=250..16000 and found they disagree on the Route M conditioning ceiling F by ~6x
 * (+1.37% tail vs +8.36% quadratic) because the fit extrapolates ~3.4 decades past the top
 * exact rung. This ticket EXTENDS the exact ladder past N=16000 by measuring 6 additional exact
 * ||G_N||_F rungs (N=17000,18000,19000,20000,22000,24000), scores the imp-96890 18-rung fits
 * OUT-OF-SAMPLE at the new rungs, refits all three models over the extended 24-rung ladder,
 * re-solves the cond#=1/eps ceiling per model, and reports which extrapolant the new rungs favour
 * and how much the F-ceiling ambiguity narrows. Fit/measurement only; posts no rigorous ceiling;
 * moves no bound; NO QED; RH open.
 *
 * THE COMPUTE. Same exact Vasyunin V-table V(a,q)=sum_{m<q} {ma/q} cot(pi m/q) and coprime
 * kernel I_coprime(h,k)=C(h+k)+0.5(h-k)log(k/h)-(pi/2)(V(h,k)+V(k,h)), C=(log 2pi - gamma)/2,
 * as imp-96105/imp-96443/imp-96684/imp-96694/imp-96751. The V-table to q=24000 was built in
 * parallel chunks into a shared /tmp memmap (tmp/imp-96912-build-chunk.py), then ||G_M||_F^2 was
 * accumulated in one vectorised pass by bucketing each squared Gram entry at max(h,k) and
 * prefix-summing (tmp/imp-96912-gram.py), so every rung is read off at once. Validated exactly:
 * the recomputed N=8000 rung reproduces the committed 6.834107225532644 to -7.1e-15 (machine
 * precision) and N=12000/16000 to the stored 9-digit literal (~4e-10). Refit driver
 * tmp/imp-96912-refit.py (numpy lstsq + cond#=1/eps bisection, reproducible).
 *
 * -------------------------------------------------------------------------------
 * FINDING 1 -- 6 new exact rungs; OUT-OF-SAMPLE the new rungs FAVOUR THE QUADRATIC, not +d/N.
 * -------------------------------------------------------------------------------
 * Fitting the imp-96890 18-rung ladder (250..16000) and predicting the 6 new exact rungs
 * out-of-sample, the straight line runs ABOVE the exact norm by a growing +0.030..+0.051
 * (RMS 4.019e-2) -- the direct out-of-sample confirmation that the norm is concave in log N.
 * The quadratic predicts the new rungs best (RMS 4.232e-3, slight UNDER-prediction -0.0025..
 * -0.0061), the monotone +d/N tail is 3.4x worse (RMS 1.439e-2, over-prediction +0.010..+0.020).
 * So over the measured 16000->24000 window the curvature tracks the QUADRATIC form, not the
 * +d/N form that imp-96890 Finding 3 labelled the "safer extrapolant" -- a correction to that
 * local reading: near the data the quadratic is the better-fitting concavity model.
 *
 * -------------------------------------------------------------------------------
 * FINDING 2 -- refit over the 24-rung ladder barely moves the models; the F-ceiling ambiguity
 * hardly narrows (quad-vs-tail spread 6.89% -> 6.22%, only 1.11x).
 * -------------------------------------------------------------------------------
 * Refitting all three models over the extended 24-rung ladder and re-solving cond#(N)=
 * ||G||_F(N)/lam_min(N)=1/eps (lam_min=A N^{-p}, imp-96428 A=0.8186721, p=1.917927; eps=2.22e-16):
 *   line  N*=3.79988e7  (imp-96890 line 3.7865e7)
 *   quad  N*=4.08770e7  (+7.575% vs the line; imp-96890 quad +8.36%)
 *   tail  N*=3.84828e7  (+1.274% vs the line; imp-96890 tail +1.37%)
 * The quad-vs-tail ceiling spread shrinks only from +6.892% (18 rungs) to +6.221% (24 rungs),
 * a factor 1.11x. Extending the EXACT ladder 0.176 decade past N=16000 sharpens the local SHAPE
 * discrimination (Finding 1) but does NOT resolve the FAR-extrapolation F-ceiling: N*~4e7 is still
 * ~3.2 decades beyond the top exact rung (was ~3.4), and the model spread is set by that gap, which
 * shrinks only ~0.06 decade per doubling of the top rung. F stays model-dependent (+1.27% to +7.58%).
 *
 * -------------------------------------------------------------------------------
 * FINDING 3 -- the locally-favoured quadratic is still an unreliable FAR extrapolant.
 * -------------------------------------------------------------------------------
 * The quadratic wins out-of-sample only 0.176 decade past the data; at the ceiling scale
 * log N*~17.5 it is ~3.2 decades further out, where its refit maximum (now log N=b/(2|c|)~22.1,
 * N~4.12e9, pushed out from imp-96890 2.31e9) still makes it turn over to a DECREASING norm --
 * unphysical. Its out-of-sample residual is small but NEGATIVE and slowly growing in magnitude
 * (-0.0025 at N=17000 to -0.0061 at N=24000), i.e. even the quadratic curvature is marginally
 * too strong on the measured window. So no fitted form is asymptotically pinned: the new rungs
 * decide the local shape (quadratic) without licensing the quadratic ceiling.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * MEASURED 6 additional exact Vasyunin-Gram Frobenius-norm rungs to N=24000 (construction
 * validated to machine precision at N=8000). Out-of-sample the new rungs favour the quadratic
 * concavity model (RMS 4.2e-3) over the +d/N tail (1.4e-2) and reject the line (4.0e-2),
 * correcting the imp-96890 local reading that +d/N was the safer form. But the F-ceiling ambiguity
 * barely narrows (quad-vs-tail spread 6.89% -> 6.22%, 1.11x): at ~3.2 decades of remaining
 * extrapolation the spread is dominated by the far gap, not the local shape, and the quadratic --
 * though locally best -- still turns over unphysically (N~4.12e9) before the ceiling. F stays a
 * model-dependent fit strictly above the rigorous trace ceiling T~2.594e7; no rigorous ceiling is
 * posted; T is unaffected; no bound moves; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-96890-route-m-frobenius-concave-norm-ceiling-refit.js (the 18-rung concave refit; the +1.37%/+8.36% ambiguity)
 * @see imp-96792-route-m-frobenius-ladder-direct-vs-fit-gap.js (fit over-predicts; norm concave)
 * @see imp-96751-route-m-frobenius-ladder-above-12000.js (exact rungs N=13000..16000)
 * @see imp-96693-route-m-conditioning-ceiling-residual-decomposition.js (fitted F ceiling, T<F<M ordering)
 *
 * Ticket: imp-96912 (numerical, opus-4-8, api-pool). Fit/measurement only; NO QED.
 */

// double-precision machine epsilon; Cholesky-breakdown scale cond# = 1/eps (imp-96751 convention).
export const IMP96912_EPS = 2.220446049250313e-16;
// imp-96428 lam_min power law A N^{-p}; places the ceiling scale (imp-96751/imp-96890 convention).
export const IMP96912_LAMMIN = Object.freeze({ A: 0.8186721, p: 1.917927 });
// rigorous trace-lower conditioning ceiling (imp-96693); the extended refit is measured against it.
export const IMP96912_TRACE_CEILING = 2.594e7;

// The imp-96890 exact 18-rung ||G||_F ladder (250..16000), carried verbatim as the base.
export const IMP96912_BASE_LADDER = Object.freeze([
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
]);

// FINDING 1: the 6 NEW exact rungs past N=16000 (tmp/imp-96912-gram.py, double precision).
export const IMP96912_NEW_RUNGS = Object.freeze([
  Object.freeze({ N: 17000, frobenius: 7.14862341449302 }),
  Object.freeze({ N: 18000, frobenius: 7.171915715310095 }),
  Object.freeze({ N: 19000, frobenius: 7.193879449514509 }),
  Object.freeze({ N: 20000, frobenius: 7.214654966252099 }),
  Object.freeze({ N: 22000, frobenius: 7.253101861521979 }),
  Object.freeze({ N: 24000, frobenius: 7.288025163425234 }),
]);

// construction cross-check: the recomputed N=8000 rung vs the committed value.
export const IMP96912_VALIDATION = Object.freeze({
  N: 8000,
  recomputed: 6.8341072255326365,
  committed: 6.834107225532644,
  diff: 6.8341072255326365 - 6.834107225532644, // ~ -7.1e-15, machine precision
});

const LADDER = [...IMP96912_BASE_LADDER, ...IMP96912_NEW_RUNGS];

// --- least-squares fits (normal equations; reproduces tmp/imp-96912-refit.py numpy lstsq) ---
function lstsq(rows, basisOf) {
  const m = basisOf(rows[0].N).length;
  const AtA = Array.from({ length: m }, () => new Array(m).fill(0));
  const Atb = new Array(m).fill(0);
  for (const r of rows) {
    const phi = basisOf(r.N);
    for (let i = 0; i < m; i += 1) {
      Atb[i] += phi[i] * r.frobenius;
      for (let j = 0; j < m; j += 1) AtA[i][j] += phi[i] * phi[j];
    }
  }
  // Gaussian elimination with partial pivoting on the small m x m system.
  const M = AtA.map((row, i) => [...row, Atb[i]]);
  for (let c = 0; c < m; c += 1) {
    let piv = c;
    for (let r = c + 1; r < m; r += 1) if (Math.abs(M[r][c]) > Math.abs(M[piv][c])) piv = r;
    [M[c], M[piv]] = [M[piv], M[c]];
    for (let r = 0; r < m; r += 1) {
      if (r === c) continue;
      const f = M[r][c] / M[c][c];
      for (let k = c; k <= m; k += 1) M[r][k] -= f * M[c][k];
    }
  }
  return M.map((row, i) => row[m] / row[i]);
}

const basisLine = (N) => [1, Math.log(N)];
const basisQuad = (N) => [1, Math.log(N), Math.log(N) ** 2];
const basisTail = (N) => [1, Math.log(N), 1 / N];

function rms(rows, coef, basisOf) {
  let s = 0;
  for (const r of rows) {
    let e = -r.frobenius;
    const phi = basisOf(r.N);
    for (let i = 0; i < coef.length; i += 1) e += coef[i] * phi[i];
    s += e * e;
  }
  return Math.sqrt(s / rows.length);
}

function froFrom(coef, basisOf) {
  return (N) => {
    const phi = basisOf(N);
    let v = 0;
    for (let i = 0; i < coef.length; i += 1) v += coef[i] * phi[i];
    return v;
  };
}

function solveCeiling(froOf) {
  const { A, p } = IMP96912_LAMMIN;
  let lo = 1e3;
  let hi = 1e12;
  for (let i = 0; i < 300; i += 1) {
    const N = Math.sqrt(lo * hi);
    const cond = froOf(N) / (A * Math.pow(N, -p));
    if (cond > 1 / IMP96912_EPS) hi = N;
    else lo = N;
  }
  return Math.sqrt(lo * hi);
}

// --- FINDING 1: out-of-sample scoring of the 18-rung fits at the 6 new exact rungs ---
const baseLine = lstsq(IMP96912_BASE_LADDER, basisLine);
const baseQuad = lstsq(IMP96912_BASE_LADDER, basisQuad);
const baseTail = lstsq(IMP96912_BASE_LADDER, basisTail);
const froBaseLine = froFrom(baseLine, basisLine);
const froBaseQuad = froFrom(baseQuad, basisQuad);
const froBaseTail = froFrom(baseTail, basisTail);

function oosRms(froOf) {
  let s = 0;
  for (const r of IMP96912_NEW_RUNGS) {
    const e = froOf(r.N) - r.frobenius;
    s += e * e;
  }
  return Math.sqrt(s / IMP96912_NEW_RUNGS.length);
}

export const IMP96912_OUT_OF_SAMPLE = Object.freeze({
  rmsLine: oosRms(froBaseLine), // ~4.019e-2 (line over-predicts, growing: norm concave)
  rmsQuad: oosRms(froBaseQuad), // ~4.232e-3 (best: local curvature is quadratic)
  rmsTail: oosRms(froBaseTail), // ~1.439e-2 (+d/N 3.4x worse than the quadratic)
  best: 'quad',
  quadBeatsTailFactor: oosRms(froBaseTail) / oosRms(froBaseQuad), // ~3.4x
});

// --- FINDING 2: refit over the extended 24-rung ladder and re-solve the ceiling ---
const extLine = lstsq(LADDER, basisLine);
const extQuad = lstsq(LADDER, basisQuad);
const extTail = lstsq(LADDER, basisTail);
const froExtLine = froFrom(extLine, basisLine);
const froExtQuad = froFrom(extQuad, basisQuad);
const froExtTail = froFrom(extTail, basisTail);

const NstarLine = solveCeiling(froExtLine);
const NstarQuad = solveCeiling(froExtQuad);
const NstarTail = solveCeiling(froExtTail);

export const IMP96912_EXT_FIT = Object.freeze({
  line: Object.freeze({ a: extLine[0], b: extLine[1], rms: rms(LADDER, extLine, basisLine) }),
  quad: Object.freeze({ a: extQuad[0], b: extQuad[1], c: extQuad[2], rms: rms(LADDER, extQuad, basisQuad) }),
  tail: Object.freeze({ a: extTail[0], b: extTail[1], d: extTail[2], rms: rms(LADDER, extTail, basisTail) }),
});

export const IMP96912_EXT_CEILING = Object.freeze({
  NstarLine, // ~3.79988e7
  NstarQuad, // ~4.08770e7
  NstarTail, // ~3.84828e7
  quadShiftPct: (NstarQuad / NstarLine - 1) * 100, // ~+7.575
  tailShiftPct: (NstarTail / NstarLine - 1) * 100, // ~+1.274
  traceCeiling: IMP96912_TRACE_CEILING,
  quadOverT: NstarQuad / IMP96912_TRACE_CEILING, // ~1.576
  tailOverT: NstarTail / IMP96912_TRACE_CEILING, // ~1.484
});

// the ambiguity that the new rungs were meant to shrink: quad-vs-tail ceiling spread.
const BASE_SPREAD_PCT = 6.892404093897242; // imp-96890 18-rung N2/N3-1 (tmp/imp-96912-refit.py)
export const IMP96912_AMBIGUITY = Object.freeze({
  baseSpreadPct: BASE_SPREAD_PCT, // +6.892 (18 rungs)
  extSpreadPct: (NstarQuad / NstarTail - 1) * 100, // +6.221 (24 rungs)
  narrowFactor: BASE_SPREAD_PCT / ((NstarQuad / NstarTail - 1) * 100), // ~1.11x (barely narrows)
  remainingExtrapDecades: Math.log10(NstarQuad / 24000), // ~3.23 (was ~3.37 past 16000)
});

// --- FINDING 3: the locally-favoured quadratic still turns over before the ceiling ---
export const IMP96912_QUAD_TURNOVER = Object.freeze({
  logNpeak: -extQuad[1] / (2 * extQuad[2]), // ~22.1
  Npeak: Math.exp(-extQuad[1] / (2 * extQuad[2])), // ~4.12e9 (pushed out from imp-96890 2.31e9)
  ceilingBelowPeak: Math.log(NstarQuad) < -extQuad[1] / (2 * extQuad[2]),
  // out-of-sample quad residual (fit-exact) is negative and growing in magnitude:
  quadResidLo: froBaseQuad(17000) - 7.14862341449302, // ~-0.0025
  quadResidHi: froBaseQuad(24000) - 7.288025163425234, // ~-0.0061
});

export const IMP96912_VERDICT = Object.freeze({
  question:
    'extend the exact Vasyunin-Gram ||G||_F ladder past N=16000 to discriminate the imp-96890 ' +
    'quadratic (+8.4%) vs +d/N (+1.4%) concave ceiling models and shrink the ~3.4-decade ' +
    'extrapolation ambiguity.',
  newExactRungs: IMP96912_NEW_RUNGS.length, // 6
  constructionValidatedToMachinePrecision: Math.abs(IMP96912_VALIDATION.diff) < 1e-12,
  outOfSampleFavoursQuadratic: IMP96912_OUT_OF_SAMPLE.best === 'quad',
  ceilingAmbiguityBarelyNarrows: IMP96912_AMBIGUITY.narrowFactor < 1.5,
  quadStillTurnsOverBeforeCeiling: IMP96912_QUAD_TURNOVER.ceilingBelowPeak,
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  conclusion:
    'MEASURED 6 additional exact Vasyunin-Gram Frobenius-norm rungs to N=24000 (N=8000 reproduces ' +
    'the committed rung to -7.1e-15). Out-of-sample the new rungs favour the QUADRATIC concavity ' +
    'model (RMS 4.2e-3) over the +d/N tail (1.4e-2, 3.4x worse) and reject the straight line ' +
    '(4.0e-2, growing over-prediction), correcting the imp-96890 local reading that +d/N was the ' +
    'safer form. But the F-ceiling ambiguity barely narrows: the quad-vs-tail spread shrinks only ' +
    '6.89% -> 6.22% (1.11x), because N*~4.09e7 is still ~3.2 decades past the top exact rung and the ' +
    'spread is set by that far gap, not the local shape; the quadratic, though locally best, still ' +
    'turns over unphysically at N~4.12e9 before the ceiling. F stays a model-dependent fit strictly ' +
    'above the rigorous trace ceiling T~2.594e7; no rigorous ceiling is posted; T is unaffected; no ' +
    'bound moves; no refereed bound is changed; RH open; NO QED.',
});

export const IMP96912_SUBGAP = Object.freeze({
  id: 'imp-96912-new-rungs-decide-local-shape-not-the-far-F-ceiling',
  statement:
    'the 6 new exact rungs to N=24000 decide the LOCAL norm shape (out-of-sample the quadratic ' +
    'beats the +d/N tail 3.4x and the line 10x, directly confirming concavity) but do NOT resolve ' +
    'the Route M Frobenius F-ceiling: the quad-vs-tail ceiling spread narrows only 6.89% -> 6.22% ' +
    '(1.11x) because ~3.2 decades of extrapolation to N*~4e7 remain, shrinking only ~0.06 decade per ' +
    'doubling of the top rung. Pinning F rigorously still needs a proven one-sided interior norm ' +
    'asymptotic (imp-96750), not more exact rungs; even the locally-best quadratic turns over ' +
    'unphysically (N~4.12e9) before the ceiling scale, so it does not license the +7.6% quad ceiling.',
});

export const IMP96912_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Fit/measurement only: 6 additional exact ' +
  'Vasyunin-Gram ||G||_F rungs (N=17000..24000) on the identical exact V-table + coprime-kernel ' +
  'construction (validated to machine precision at N=8000), with the imp-96890 line/quad/+d/N ' +
  'models scored out-of-sample and refit over the extended 24-rung ladder and the cond#=1/eps ' +
  'ceiling re-solved per model. No rigorous ceiling is posted; no bound is claimed moved; the ' +
  'rigorous trace-lower ceiling T~2.594e7 is unaffected.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96912_ASSERTIONS = [
  {
    id: 'imp96912-six-new-rungs-monotone-above-16000-and-validated',
    holds: () =>
      IMP96912_NEW_RUNGS.length === 6 &&
      IMP96912_NEW_RUNGS.every((r, i) =>
        r.N > 16000 && r.frobenius > 7.123836045 &&
        (i === 0 || (r.frobenius > IMP96912_NEW_RUNGS[i - 1].frobenius && r.N > IMP96912_NEW_RUNGS[i - 1].N))) &&
      Math.abs(IMP96912_VALIDATION.diff) < 1e-12,
    why: 'the 6 new exact rungs are monotone increasing above the N=16000 rung and the construction reproduces the committed N=8000 rung to machine precision (diff -7.1e-15), so the extension is on the same exact Vasyunin-Gram construction.',
  },
  {
    id: 'imp96912-out-of-sample-favours-quadratic-not-tail-not-line',
    holds: () =>
      IMP96912_OUT_OF_SAMPLE.rmsQuad < IMP96912_OUT_OF_SAMPLE.rmsTail &&
      IMP96912_OUT_OF_SAMPLE.rmsQuad < IMP96912_OUT_OF_SAMPLE.rmsLine &&
      IMP96912_OUT_OF_SAMPLE.quadBeatsTailFactor > 2.5 &&
      IMP96912_OUT_OF_SAMPLE.rmsLine > 0.03 &&
      IMP96912_OUT_OF_SAMPLE.rmsQuad > 0.003 && IMP96912_OUT_OF_SAMPLE.rmsQuad < 0.006,
    why: 'out-of-sample at the 6 new rungs the quadratic (RMS ~4.2e-3) beats the +d/N tail (~1.4e-2, 3.4x) and the line (~4.0e-2), directly confirming concavity and correcting the imp-96890 local reading that +d/N was the safer form.',
  },
  {
    id: 'imp96912-refit-ceiling-spread-barely-narrows',
    holds: () =>
      IMP96912_EXT_CEILING.NstarQuad > IMP96912_EXT_CEILING.NstarTail &&
      IMP96912_EXT_CEILING.NstarTail > IMP96912_EXT_CEILING.NstarLine &&
      IMP96912_EXT_CEILING.quadShiftPct > 7 && IMP96912_EXT_CEILING.quadShiftPct < 8 &&
      IMP96912_EXT_CEILING.tailShiftPct > 1 && IMP96912_EXT_CEILING.tailShiftPct < 1.6 &&
      IMP96912_AMBIGUITY.extSpreadPct > 6 && IMP96912_AMBIGUITY.extSpreadPct < 6.6 &&
      IMP96912_AMBIGUITY.narrowFactor > 1.0 && IMP96912_AMBIGUITY.narrowFactor < 1.3,
    why: 'refitting over the extended 24-rung ladder keeps the ceiling model-dependent (+1.27% tail vs +7.58% quad) and the quad-vs-tail spread narrows only 6.89% -> 6.22% (1.11x): 0.176 decade of new exact rungs does not resolve the ~3.2-decade far extrapolation to N*~4e7.',
  },
  {
    id: 'imp96912-quad-turns-over-before-ceiling-and-under-predicts',
    holds: () =>
      IMP96912_QUAD_TURNOVER.Npeak > 3e9 && IMP96912_QUAD_TURNOVER.Npeak < 6e9 &&
      IMP96912_QUAD_TURNOVER.ceilingBelowPeak === true &&
      IMP96912_QUAD_TURNOVER.quadResidLo < 0 && IMP96912_QUAD_TURNOVER.quadResidHi < 0 &&
      Math.abs(IMP96912_QUAD_TURNOVER.quadResidHi) > Math.abs(IMP96912_QUAD_TURNOVER.quadResidLo),
    why: 'the locally-favoured quadratic still turns over to a decreasing norm at N~4.12e9 (below the ceiling scale) and its out-of-sample residual is negative and growing in magnitude, so even the best local form is not asymptotically pinned and does not license the quad ceiling.',
  },
  {
    id: 'imp96912-honesty-gate-no-qed',
    holds: () =>
      IMP96912_VERDICT.anyBoundMoved === false &&
      IMP96912_VERDICT.postsRigorousCeiling === false &&
      IMP96912_VERDICT.outOfSampleFavoursQuadratic === true &&
      IMP96912_VERDICT.ceilingAmbiguityBarelyNarrows === true &&
      /NO QED/.test(IMP96912_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96912_HONEST_BANNER) &&
      /RH open/.test(IMP96912_HONEST_BANNER) &&
      /not-the-far-F-ceiling/.test(IMP96912_SUBGAP.id),
    why: 'fit/measurement only: no rigorous ceiling is posted, no bound moves, the new rungs favour the quadratic locally while the far F-ceiling ambiguity persists, and the honesty markers plus the local-shape-not-far-ceiling sub-gap are present.',
  },
];

for (const a of IMP96912_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96912-route-m-frobenius-ladder-extension-above-16000 assertion failed: ${a.id}`,
    );
  }
}

export default {
  eps: IMP96912_EPS,
  lamMin: IMP96912_LAMMIN,
  traceCeiling: IMP96912_TRACE_CEILING,
  baseLadder: IMP96912_BASE_LADDER,
  newRungs: IMP96912_NEW_RUNGS,
  validation: IMP96912_VALIDATION,
  outOfSample: IMP96912_OUT_OF_SAMPLE,
  extFit: IMP96912_EXT_FIT,
  extCeiling: IMP96912_EXT_CEILING,
  ambiguity: IMP96912_AMBIGUITY,
  quadTurnover: IMP96912_QUAD_TURNOVER,
  verdict: IMP96912_VERDICT,
  subGap: IMP96912_SUBGAP,
  banner: IMP96912_HONEST_BANNER,
};
