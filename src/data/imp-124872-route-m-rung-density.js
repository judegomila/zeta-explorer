/**
 * @module imp-124872-route-m-rung-density
 *
 * imp-124872 (numerical -- MEASUREMENT ONLY; MCM stays refuted from omega=11; NO QED).
 *
 * imp-124789/imp-124803 confirmed at dps=40 (full-precision Glaisher/Euler) that the imp-97640 Route M
 * gap-law THIRD-rung local decay exponent q(1299709 -> 1999993) = 7.49854 (residual ratio 1.2537) is a REAL
 * feature, not a 7-sig-fig catastrophic-cancellation artifact. But that rung spans a WIDE bracket -- omega
 * 100000 -> 148933, p 1299709 -> 1999993 (a factor 1.54 in p, only 0.431 in log p) -- and a single two-point
 * local exponent over so wide a bracket cannot tell a genuinely stable 7.5 slope from an AVERAGE across a
 * still-moving (or reversing) slope. This leaf inserts intermediate prime-index heights INSIDE the third-rung
 * bracket (omega = 110000, 120000, 125000, 130000, 140000; p = 1441049, 1583539, 1655131, 1726943, 1870667)
 * and re-measures the sub-rung exponents to decide whether the 7.5 reading STABILIZES or PERTURBS. Same
 * formulae/precision as imp-124789 (dps=40, full-precision constants); shallow ladder, so the imp-97736 MCM
 * dps>=42 infeasibility does NOT apply. Script: tmp/imp-124872-rung-density.py.
 *
 * -------------------------------------------------------------------------------
 * RESULT 0 -- the densified endpoints REPRODUCE the imp-124789 single-bracket exponent.
 * -------------------------------------------------------------------------------
 * With the two bracket endpoints recomputed here at dps=40, q(1299709 -> 1999993) = 7.4985359, matching the
 * imp-124789 value 7.49854 to 6 sig figs -- the densification uses the identical pipeline, so any change in
 * the reading is a genuine intermediate-height effect, not a formula/precision drift.
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 -- the DECISION: densifying does NOT stabilize 7.5; it EXPOSES a non-monotone residual.
 * -------------------------------------------------------------------------------
 * Inside the bracket the residual MAGNITUDE is NOT monotone in omega: it falls 1.0471e-6 -> 9.9144e-7 ->
 * 8.6626e-7 -> 8.0322e-7 -> 7.4461e-7 to a LOCAL MINIMUM near omega=130000 (p=1726943), then RISES again to
 * 8.5588e-7 (omega=140000) before settling at 8.3517e-7 (omega=148933). The endpoints happen to line up to
 * give q=7.499, but the path between them dips ~29% below and climbs back -- so the six SUB-RUNG local
 * exponents are wildly unstable: 7.474, 20.367, 24.432, 25.583, -25.090, 5.304. A 7-point OLS log|residual|
 * vs log(log p) gives q_fit = 8.597 with R^2 = 0.567 (a POOR power-law fit). The wide-bracket 7.499 is
 * therefore an ENDPOINT-AVERAGE across an oscillating residual, NOT a stable local decay slope.
 *
 * -------------------------------------------------------------------------------
 * RESULT 2 -- the oscillation appears WITHIN a single original rung (Mertens/PNT fingerprint).
 * -------------------------------------------------------------------------------
 * The local minimum of |residual| at p~1.73M, with a subsequent rise, is the same oscillating-PNT/Mertens
 * fingerprint that imp-97659 saw across DEEP ladders and imp-124789 saw as the shallow up-then-down turnover
 * -- here it is resolved INSIDE the single 100000 -> 148933 rung. The negative sub-rung exponent (-25.09 on
 * 1726943 -> 1870667) is the residual magnitude turning back UP, i.e. |residual| momentarily GROWS with
 * height, which no single decay exponent can represent. This strengthens (does not move) the imp-124789
 * conclusion that the third-rung 7.5 reading is a bracket-width sampling artifact.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.  MEASUREMENT ONLY. Rung-densifying the wide imp-97640/imp-124789 third rung (100000 -> 148933) at
 * dps=40 with full-precision constants shows the residual is NON-MONOTONE inside the bracket -- a local
 * magnitude minimum near p~1.73M then a rise -- so the sub-rung exponents scatter from -25 to +26 (q_fit
 * 8.597, R^2 0.567) and the single-bracket 7.499 is a coincidental endpoint-average, NOT a stable local
 * slope. Inserting intermediate heights does NOT stabilize the 7.5 reading; it exposes the imp-97659/imp-124789
 * oscillation resolved within one rung. MCM stays refuted from omega=11; b/4 ceiling untouched; kappa_arith
 * unchanged; no bound on Lambda moves; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-124789-route-m-shallow-ladder-extprec.js (dps=40 shallow ladder; third rung 7.49854, turnover)
 * @see imp-97640-route-m-gap-law-residual-decay-exponent.js (original 7-fig shallow ladder)
 * @see imp-97659-route-m-gap-law-decay-extprec.js (deep-ladder exponent OSCILLATES)
 *
 * Ticket: imp-124872 (numerical, opus-4-8, api-pool). Third rung densified: residual non-monotone, 7.5 is an endpoint-average; NO QED.
 */

// Full-precision constants baked as literals (import-light; imp-2546 rule, no heavy transitive imports).
const LN_A = 0.2487544770337842625472529935761; // log(Glaisher-Kinkelin) = 1/12 - zeta-prime(-1), dps=40
const GAMMA = 0.5772156649015328606065120900824; // Euler-Mascheroni, dps=40
const B_INF_DERIVED = LN_A + GAMMA / 12;          // 0.2968557824422453 (imp-97619 closed form)

// dps=40 densified third-rung ladder: original endpoints (omega 100000, 148933) plus five intermediate
// prime-INDEX heights inside the bracket. residual = gap - e^{-gamma}*B_inf/log p_omega, carried at ~32 sig
// figs then rounded to ~14 here. Source: tmp/imp-124872-rung-density.py.
export const IMP124872_DENSE_THIRD_RUNG = Object.freeze([
  Object.freeze({ omega: 100000, pOmega: 1299709, residual: -1.047085937319e-6, intermediate: false }),
  Object.freeze({ omega: 110000, pOmega: 1441049, residual: -9.914438014869e-7, intermediate: true }),
  Object.freeze({ omega: 120000, pOmega: 1583539, residual: -8.662621505607e-7, intermediate: true }),
  Object.freeze({ omega: 125000, pOmega: 1655131, residual: -8.032174120689e-7, intermediate: true }),
  Object.freeze({ omega: 130000, pOmega: 1726943, residual: -7.446068988961e-7, intermediate: true }), // local min of |residual|
  Object.freeze({ omega: 140000, pOmega: 1870667, residual: -8.558775672661e-7, intermediate: true }), // |residual| RISES
  Object.freeze({ omega: 148933, pOmega: 1999993, residual: -8.351691932711e-7, intermediate: false }),
]);

// Sub-rung local decay exponent q for |residual| ~ C/(log p)^q, recomputed here (Math.log, no bake).
function subRungExponents(ladder) {
  const out = [];
  for (let i = 1; i < ladder.length; i++) {
    const lp0 = Math.log(ladder[i - 1].pOmega);
    const lp1 = Math.log(ladder[i].pOmega);
    const q = Math.log(Math.abs(ladder[i - 1].residual) / Math.abs(ladder[i].residual)) / Math.log(lp1 / lp0);
    out.push(Object.freeze({
      fromP: ladder[i - 1].pOmega,
      toP: ladder[i].pOmega,
      qLocal: q,
      residualRatio: Math.abs(ladder[i - 1].residual) / Math.abs(ladder[i].residual),
    }));
  }
  return Object.freeze(out);
}

export const IMP124872_SUB_RUNG_EXPONENTS = subRungExponents(IMP124872_DENSE_THIRD_RUNG);

// Single-bracket exponent from the two endpoints only (reproduces imp-124789 third rung 7.49854).
function bracketExponent(ladder) {
  const lo = ladder[0];
  const hi = ladder[ladder.length - 1];
  const lpLo = Math.log(lo.pOmega);
  const lpHi = Math.log(hi.pOmega);
  return Math.log(Math.abs(lo.residual) / Math.abs(hi.residual)) / Math.log(lpHi / lpLo);
}

export const IMP124872_BRACKET_EXPONENT = bracketExponent(IMP124872_DENSE_THIRD_RUNG); // ~7.4985

// 7-point OLS fit of log|residual| vs log(log p): decay exponent q_fit = -slope, with R^2.
function loglogFit(ladder) {
  const xs = ladder.map((r) => Math.log(Math.log(r.pOmega)));
  const ys = ladder.map((r) => Math.log(Math.abs(r.residual)));
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  const slope = sxy / sxx;
  let ssRes = 0;
  let ssTot = 0;
  for (let i = 0; i < n; i++) {
    const yhat = my + slope * (xs[i] - mx);
    ssRes += (ys[i] - yhat) ** 2;
    ssTot += (ys[i] - my) ** 2;
  }
  return Object.freeze({ qFit: -slope, r2: 1 - ssRes / ssTot });
}

export const IMP124872_LOGLOG_FIT = loglogFit(IMP124872_DENSE_THIRD_RUNG); // qFit ~ 8.597, r2 ~ 0.567

// Index of the local |residual| minimum inside the bracket (the non-monotonicity witness).
function minMagnitudeIndex(ladder) {
  let idx = 0;
  for (let i = 1; i < ladder.length; i++) {
    if (Math.abs(ladder[i].residual) < Math.abs(ladder[idx].residual)) idx = i;
  }
  return idx;
}

export const IMP124872_MIN_MAG_INDEX = minMagnitudeIndex(IMP124872_DENSE_THIRD_RUNG); // 4 => omega=130000, p=1726943

export const IMP124872_RESULTS = Object.freeze({
  question: 'does inserting intermediate prime-index heights inside the wide imp-124789 third-rung bracket (omega 100000 -> 148933) STABILIZE the q=7.499 local decay exponent, or PERTURB it?',
  method: 'dps=40 mpmath, full-precision Glaisher/Euler; five intermediate heights omega=110000..140000; residual = gap - e^{-gamma}*B_inf/log p; sub-rung exponents + 7-point log-log OLS fit',
  bracketExponent: IMP124872_BRACKET_EXPONENT,          // ~7.4985, reproduces imp-124789
  imp124789ThirdRung: 7.49854,
  subRungExponents: IMP124872_SUB_RUNG_EXPONENTS.map((e) => e.qLocal), // 7.474, 20.367, 24.432, 25.583, -25.090, 5.304
  qFit: IMP124872_LOGLOG_FIT.qFit,                       // ~8.597
  r2: IMP124872_LOGLOG_FIT.r2,                           // ~0.567 (POOR power-law fit)
  residualNonMonotone: 'residual magnitude falls to a local minimum near omega=130000 (p=1726943, 7.446e-7) then RISES to 8.559e-7 (omega=140000) -- one sub-rung exponent is NEGATIVE (-25.09)',
  minMagnitudeAt: { omega: 130000, pOmega: 1726943, residual: -7.446068988961e-7 },
  decision: 'densifying does NOT stabilize the 7.5 reading -- it EXPOSES a non-monotone residual, so the single-bracket 7.499 is a coincidental endpoint-average, not a stable local slope',
  consistentWithImp97659Oscillation: true,              // the oscillation now resolved WITHIN one rung
  subGapAddressed: 'imp-124789/imp-97640 wide third-rung bracket (1.30M -> 2.00M) never rung-densified',
});

export const IMP124872_VERDICT = Object.freeze({
  question: 'does rung-densifying the wide third-rung bracket stabilize the imp-124789 q=7.499 reading?',
  endpointReproducesImp124789: true,   // 7.4985 vs 7.49854
  residualNonMonotoneInBracket: true,  // local |residual| minimum near p=1.73M then a rise
  subRungExponentsScatter: true,       // -25.09 .. +25.58, a negative exponent present
  loglogFitPoor: true,                 // R^2 ~ 0.567
  bracketValueIsEndpointAverage: true, // 7.499 is not a stable local slope
  densifyingStabilizes: false,         // the DECISION: it perturbs/exposes, does not stabilize
  consistentWithOscillation: true,     // matches imp-97659/imp-124789
  mcmRefuted: true,                     // (imp-97432/imp-97583) unchanged
  ceilingTouched: false,
  anyBoundMoved: false,
  qed: false,
  conclusion:
    'MEASUREMENT ONLY. Rung-densifying the wide imp-97640/imp-124789 third rung (omega 100000 -> 148933, ' +
    'p 1299709 -> 1999993) at dps=40 with full-precision Glaisher/Euler constants shows the residual is ' +
    'NON-MONOTONE inside the bracket: its magnitude falls to a local minimum near p~1.73M (omega=130000) ' +
    'then RISES again, so the six sub-rung exponents scatter from -25.09 to +25.58 (7-point log-log fit ' +
    'q_fit=8.597, R^2=0.567). The single-bracket q=7.499 (which reproduces imp-124789 to 6 figs) is a ' +
    'coincidental endpoint-average across an oscillating residual, NOT a stable local decay slope -- ' +
    'inserting intermediate heights does NOT stabilize the 7.5 reading, it exposes the ' +
    'imp-97659/imp-124789 oscillation resolved within a single rung. MCM stays refuted from omega=11; ' +
    'b/4 ceiling untouched; kappa_arith unchanged; no bound on Lambda moves; no refereed bound is changed; ' +
    'RH open; NO QED.',
});

export const IMP124872_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Rung-density test (dps=40, full-precision constants) of ' +
  'the wide imp-124789 Route M third rung (omega 100000 -> 148933): five intermediate heights show the ' +
  'residual is NON-MONOTONE (local magnitude minimum near p~1.73M then a rise), so the sub-rung exponents ' +
  'scatter -25 .. +26 (q_fit 8.597, R^2 0.567) and the single-bracket 7.499 is an endpoint-average, not a ' +
  'stable slope. Densifying does NOT stabilize the 7.5 reading; it exposes the imp-97659 oscillation within ' +
  'one rung. MCM refuted from omega=11; no bound moved.';

// -- self-executing assertions (imp-3715 convention): recompute; any failure throws --

const IMP124872_ASSERTIONS = [
  {
    id: 'imp124872-ladder-internal-consistency',
    holds: () => {
      // strictly increasing omega and prime, every residual negative (gap < law); imp-97619 B_inf closed form.
      for (let i = 0; i < IMP124872_DENSE_THIRD_RUNG.length; i++) {
        const row = IMP124872_DENSE_THIRD_RUNG[i];
        if (!(row.residual < 0)) return false;
        if (i > 0 && !(row.omega > IMP124872_DENSE_THIRD_RUNG[i - 1].omega && row.pOmega > IMP124872_DENSE_THIRD_RUNG[i - 1].pOmega)) return false;
      }
      return Math.abs(B_INF_DERIVED - 0.2968557824422453) < 1e-12;
    },
    why: 'the densified ladder has strictly increasing omega/prime, all residuals negative (gap < law), and the imp-97619 closed-form B_inf.',
  },
  {
    id: 'imp124872-endpoint-reproduces-imp124789',
    holds: () => Math.abs(IMP124872_BRACKET_EXPONENT - 7.49854) < 1e-3,
    why: 'the two-endpoint bracket exponent 7.4985 reproduces the imp-124789 third-rung value 7.49854 to 3 decimals -- same pipeline, so densification effects are genuine.',
  },
  {
    id: 'imp124872-residual-non-monotone',
    holds: () => {
      // local minimum of |residual| is strictly interior (not an endpoint) and is followed by a rise.
      const idx = IMP124872_MIN_MAG_INDEX;
      const n = IMP124872_DENSE_THIRD_RUNG.length;
      if (!(idx > 0 && idx < n - 1)) return false;
      const magMin = Math.abs(IMP124872_DENSE_THIRD_RUNG[idx].residual);
      const magNext = Math.abs(IMP124872_DENSE_THIRD_RUNG[idx + 1].residual);
      return magNext > magMin; // |residual| rises after the interior minimum
    },
    why: 'the residual magnitude has a strictly interior minimum (near omega=130000, p=1726943) and rises afterward, so the residual is non-monotone within the bracket.',
  },
  {
    id: 'imp124872-sub-rung-exponents-scatter',
    holds: () => {
      const qs = IMP124872_SUB_RUNG_EXPONENTS.map((e) => e.qLocal);
      const qmin = Math.min(...qs);
      const qmax = Math.max(...qs);
      // a negative sub-rung exponent exists (|residual| grows) and the spread far exceeds a stable 7.5 read.
      return qmin < 0 && qmax > 20 && qmax - qmin > 40;
    },
    why: 'the six sub-rung exponents scatter from a negative value (|residual| grows) to > 20, a spread > 40 that no stable 7.5 slope could produce.',
  },
  {
    id: 'imp124872-loglog-fit-poor',
    holds: () => IMP124872_LOGLOG_FIT.r2 < 0.7 && IMP124872_LOGLOG_FIT.qFit > 7 && IMP124872_LOGLOG_FIT.qFit < 10,
    why: 'the 7-point log-log OLS gives R^2 ~ 0.567 (poor), confirming a single power law does not describe the densified third rung.',
  },
  {
    id: 'imp124872-densifying-does-not-stabilize',
    holds: () =>
      IMP124872_VERDICT.densifyingStabilizes === false &&
      IMP124872_VERDICT.residualNonMonotoneInBracket === true &&
      IMP124872_VERDICT.bracketValueIsEndpointAverage === true &&
      IMP124872_VERDICT.consistentWithOscillation === true,
    why: 'the DECISION: densifying exposes a non-monotone residual, so 7.499 is an endpoint-average not a stable slope -- densifying does not stabilize the reading.',
  },
  {
    id: 'imp124872-honesty-gate-no-qed',
    holds: () =>
      IMP124872_VERDICT.mcmRefuted === true &&
      IMP124872_VERDICT.ceilingTouched === false &&
      IMP124872_VERDICT.anyBoundMoved === false &&
      IMP124872_VERDICT.qed === false &&
      /NO QED/.test(IMP124872_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP124872_HONEST_BANNER) &&
      /RH open/.test(IMP124872_HONEST_BANNER),
    why: 'measurement only -- MCM refuted from omega=11; no bound moved; no QED.',
  },
];

for (const a of IMP124872_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-124872-route-m-rung-density assertion failed: ${a.id}`);
  }
}

export default {
  denseThirdRung: IMP124872_DENSE_THIRD_RUNG,
  subRungExponents: IMP124872_SUB_RUNG_EXPONENTS,
  bracketExponent: IMP124872_BRACKET_EXPONENT,
  loglogFit: IMP124872_LOGLOG_FIT,
  results: IMP124872_RESULTS,
  verdict: IMP124872_VERDICT,
  banner: IMP124872_HONEST_BANNER,
};
