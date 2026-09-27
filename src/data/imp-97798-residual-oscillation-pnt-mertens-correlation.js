/**
 * @module imp-97798-residual-oscillation-pnt-mertens-correlation
 *
 * imp-97798 (numerical -- MEASUREMENT ONLY; MCM stays refuted from omega=11; NO QED).
 *
 * imp-97780 measured the Route M MCM gap-law residual
 *     residual(omega) = gap(omega) - e^{-gamma}*B_inf/log p_omega
 * on the dps=35 combined 23-rung ladder (p = 2e6 .. 4.93e8) and read its local decay exponent as
 * OSCILLATING (-28.79 .. +56.89, eight negative rungs). imp-97780 then ATTRIBUTED that oscillation in
 * PROSE to "the oscillating-PNT/Mertens-error fingerprint" -- but never TESTED the attribution against an
 * actual psi(x)-x or Mertens-error oscillatory term. (imp-97680 did test a phase-lock, but only against
 * the EMPIRICALLY measured Mertens undershoot delta = gamma - M at FIVE common dps=30 heights; it never
 * built an explicit-formula proxy nor used the full dps=35 23-rung ladder.)
 *
 * This leaf builds a genuine Riemann-zero explicit-formula proxy for the psi(x)-x / Mertens-error
 * oscillation, evaluates it at the SAME 23 p_omega heights, and quantifies the correlation with the
 * residual oscillation. It imports the imp-97706 combined ladder (import-light: baked literals only,
 * transitively through imp-97659 -- no heavy imports, imp-2546/heavy-import rule) and recomputes here.
 *
 * METHOD. |residual| carries a strong smooth decreasing trend (imp-97706 power-law exponent ~10.56 in
 * log|res| vs log(log p)). We first DETREND: fit that OLS power law and take the residual-from-trend
 * r_osc(i) = log|residual_i| - fit_i (the pure oscillatory part). We then correlate r_osc against two
 * families of explicit-formula proxy evaluated at the same p_omega, using the true low-lying non-trivial
 * Riemann-zero ordinates gamma_k = 14.1347, 21.0220, 25.0109, 30.4249, 32.9351:
 *   - psi(x)-x proxy:     sum_k 2 Re( x^{rho_k} / rho_k ) = sum_k 2 sqrt(x)[0.5 cos(gL) + g sin(gL)]/(0.25+g^2)
 *   - Mertens-error proxy: sum_k sin(gamma_k log x) / gamma_k   (sum-over-primes second-theorem error shape)
 * Both are FULLY DETERMINED by the zeros -- NO free phase -- so the correlation is a zero-parameter test.
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 -- the correlation RISES MONOTONICALLY as true zeros are added: a multi-zero fingerprint.
 * -------------------------------------------------------------------------------
 * psi(x)-x proxy: corr(r_osc, proxy) climbs 0.318 (1 zero) -> 0.512 (3 zeros) -> 0.562 (5 zeros).
 * Mertens-error proxy: |corr| climbs 0.487 (1 zero) -> 0.749 (5 zeros). Adding the ACTUAL next Riemann
 * zeros -- not tuned frequencies -- monotonically improves the fit, the signature that the residual
 * oscillation genuinely tracks a SUPERPOSITION of Riemann zeros (the PNT/Mertens error), not a single tone.
 *
 * -------------------------------------------------------------------------------
 * RESULT 2 -- the Mertens-error proxy reaches |r| ~ 0.75, beating any single tuned frequency.
 * -------------------------------------------------------------------------------
 * A single first zero explains only |r| ~ 0.32-0.49; the 5-zero Mertens-error proxy reaches |r| ~ 0.749,
 * MORE than the best-fit arbitrary single sinusoid over f in [2,60] (|r| ~ 0.69, phase-optimized). So the
 * physically-motivated multi-zero explicit-formula shape fits the residual oscillation BETTER than any
 * single tuned sinusoid -- imp-97780's Mertens attribution is SUPPORTED, and specifically it is the
 * Mertens-error (sum-over-primes) shape, not the raw psi(x)-x shape, that fits best (0.749 vs 0.562).
 *
 * -------------------------------------------------------------------------------
 * RESULT 3 (HONEST NUANCE / SUB-GAP) -- the correlation is MODERATE (~0.75), not near-unity.
 * -------------------------------------------------------------------------------
 * The phase-free correlation SATURATES around |r| ~ 0.75 with five zeros: roughly 45% of the detrended
 * variance stays unexplained. This is far below the near-unity (Pearson r ~ 0.993) that imp-97680 found
 * against the empirical Mertens delta on the shallow five-point dps=30 ladder. Candidate causes of the
 * ceiling: (a) the ~10-sig-fig ROUNDING of the baked residual literals injects noise into a detrended
 * oscillation whose amplitude is only a fraction of ~1e-8; (b) higher zeros beyond the first five; (c) the
 * crude common-sqrt(x) envelope used in the proxy. Deciding whether |r| -> 1 with more zeros / the full
 * un-rounded dps=35 residuals is left as a NAMED sub-gap:
 *     IMP97798_PNT_MERTENS_CORRELATION_CEILING_SIGFIG_LIMITED
 * so the imp-97780 attribution is now TESTED and MODERATELY SUPPORTED, not merely asserted -- but the
 * evidence is suggestive (multi-zero, |r| ~ 0.75), not conclusive.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.  MEASUREMENT ONLY. Testing the imp-97780 prose attribution of the dps=35 residual oscillation
 * to a PNT/Mertens error: a zero-parameter Riemann-zero explicit-formula proxy correlates with the
 * detrended residual oscillation, and the correlation RISES MONOTONICALLY as the true low-lying zeros are
 * added (psi(x)-x 0.318 -> 0.562; Mertens-error 0.487 -> 0.749), the 5-zero Mertens-error proxy (|r| ~
 * 0.749) beating any single tuned sinusoid (|r| ~ 0.69). So the attribution is SUPPORTED -- the oscillation
 * is a multi-zero PNT/Mertens (specifically sum-over-primes Mertens-error) fingerprint. HONEST nuance: the
 * correlation saturates at MODERATE strength (~0.75, not the imp-97680 ~0.993), leaving a named sig-fig /
 * higher-zero sub-gap. MCM stays refuted from omega=11; b/4 ceiling untouched; kappa_arith unchanged; no
 * bound on Lambda moves; PT Lambda <= 0.2 SOTA; RH open; NO QED.
 *
 * @see imp-97780-route-m-decay-exponent-reconciliation.js (oscillation attributed to PNT/Mertens error in prose, untested)
 * @see imp-97680-residual-exponent-vs-mertens-delta-phaselock.js (phase-lock vs empirical Mertens delta, 5 dps=30 heights, r~0.993)
 * @see imp-97706-route-m-deep-ladder-extension.js (dps=35 combined 23-rung ladder; source of the baked residuals)
 * @see imp-97619-route-m-mcm-binf-mertens-closed-form.js (next-order term IS the PNT/Mertens error)
 *
 * Ticket: imp-97798 (numerical, opus-4-8, api-pool). Residual oscillation vs explicit-formula PNT/Mertens proxy: multi-zero corr ~0.75; NO QED.
 */

import { IMP97706_COMBINED_LADDER } from './imp-97706-route-m-deep-ladder-extension.js';

// Low-lying non-trivial Riemann-zero ordinates gamma_k (imaginary parts of rho = 1/2 + i*gamma_k).
const RIEMANN_ZEROS = Object.freeze([14.134725, 21.022040, 25.010858, 30.424876, 32.935062]);

// -- Pearson correlation (recomputed here, no bake) --
function pearson(a, b) {
  const n = a.length;
  const ma = a.reduce((s, v) => s + v, 0) / n;
  const mb = b.reduce((s, v) => s + v, 0) / n;
  let num = 0;
  let da = 0;
  let db = 0;
  for (let i = 0; i < n; i++) {
    num += (a[i] - ma) * (b[i] - mb);
    da += (a[i] - ma) * (a[i] - ma);
    db += (b[i] - mb) * (b[i] - mb);
  }
  return num / Math.sqrt(da * db);
}

// -- detrend log|residual| against log(log p) (the imp-97706 power-law fit) to isolate the oscillation --
function detrendedResidualOscillation(ladder) {
  const x = ladder.map((r) => Math.log(Math.log(r.pOmega)));
  const y = ladder.map((r) => Math.log(Math.abs(r.residual)));
  const n = x.length;
  const mx = x.reduce((a, b) => a + b, 0) / n;
  const my = y.reduce((a, b) => a + b, 0) / n;
  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    num += (x[i] - mx) * (y[i] - my);
    den += (x[i] - mx) * (x[i] - mx);
  }
  const slope = num / den;
  const intercept = my - slope * mx;
  return {
    powerLawExponent: -slope,                                  // ~10.56 (imp-97706)
    osc: y.map((yi, i) => yi - (slope * x[i] + intercept)),    // detrended oscillation r_osc
  };
}

const DETREND = detrendedResidualOscillation(IMP97706_COMBINED_LADDER);
export const IMP97798_RESIDUAL_OSCILLATION = Object.freeze(DETREND.osc);
export const IMP97798_POWER_LAW_EXPONENT = DETREND.powerLawExponent; // ~10.56

// -- psi(x)-x explicit-formula proxy: sum_k 2 Re( x^{rho_k}/rho_k ), FULLY determined by the zeros --
function psiProxy(ladder, kZeros) {
  return ladder.map((r) => {
    const lx = Math.log(r.pOmega);
    const sx = Math.sqrt(r.pOmega);
    let s = 0;
    for (let j = 0; j < kZeros; j++) {
      const g = RIEMANN_ZEROS[j];
      s += -2 * sx * (0.5 * Math.cos(g * lx) + g * Math.sin(g * lx)) / (0.25 + g * g);
    }
    return s;
  });
}

// -- Mertens-error proxy: sum_k sin(gamma_k log x)/gamma_k (sum-over-primes 2nd-theorem error shape) --
function mertensProxy(ladder, kZeros) {
  return ladder.map((r) => {
    const lx = Math.log(r.pOmega);
    let s = 0;
    for (let j = 0; j < kZeros; j++) {
      const g = RIEMANN_ZEROS[j];
      s += Math.sin(g * lx) / g;
    }
    return s;
  });
}

// correlation of the detrended residual oscillation with each proxy, for increasing zero counts
function corrByZeroCount(proxyFn, counts) {
  return counts.map((k) => Object.freeze({
    zeros: k,
    corr: pearson(IMP97798_RESIDUAL_OSCILLATION, proxyFn(IMP97706_COMBINED_LADDER, k)),
  }));
}

export const IMP97798_PSI_CORR = Object.freeze(corrByZeroCount(psiProxy, [1, 3, 5]));       // ~0.318, 0.512, 0.562
export const IMP97798_MERTENS_CORR = Object.freeze(corrByZeroCount(mertensProxy, [1, 5]));  // ~-0.487, -0.749

// -- best single tuned sinusoid over f in [2,60] (phase-optimized) as a null baseline --
export const IMP97798_BEST_TUNED_SINUSOID = (() => {
  let best = { f: 0, absCorr: 0 };
  for (let f = 2; f <= 60; f += 0.5) {
    let bestPhase = 0;
    for (let k = 0; k < 360; k++) {
      const phi = (k * Math.PI) / 180;
      const proxy = IMP97706_COMBINED_LADDER.map((r) => Math.cos(f * Math.log(r.pOmega) - phi));
      const c = Math.abs(pearson(IMP97798_RESIDUAL_OSCILLATION, proxy));
      if (c > bestPhase) bestPhase = c;
    }
    if (bestPhase > best.absCorr) best = { f, absCorr: bestPhase };
  }
  return Object.freeze(best); // ~{ f: 30, absCorr: 0.69 }
})();

const PSI_5 = IMP97798_PSI_CORR[IMP97798_PSI_CORR.length - 1].corr;         // 5-zero psi corr ~0.562
const MERT_5 = IMP97798_MERTENS_CORR[IMP97798_MERTENS_CORR.length - 1].corr; // 5-zero Mertens corr ~-0.749

export const IMP97798_RESULTS = Object.freeze({
  question:
    'does the imp-97780 dps=35 residual oscillation actually correlate with a psi(x)-x or Mertens M(x) style explicit-formula error term at the same p_omega heights (imp-97780 attributed it in prose but never tested)?',
  method:
    'detrend log|residual| vs log(log p) (imp-97706 power law ~10.56), then Pearson-correlate the detrended oscillation against zero-parameter Riemann-zero explicit-formula proxies (psi(x)-x and Mertens-error) built from the true low-lying gamma_k, at all 23 p_omega heights',
  riemannZerosUsed: RIEMANN_ZEROS,
  powerLawExponent: IMP97798_POWER_LAW_EXPONENT,           // ~10.56
  psiProxyCorrByZeroCount: IMP97798_PSI_CORR,              // 0.318 -> 0.512 -> 0.562 (rises with zeros)
  mertensProxyCorrByZeroCount: IMP97798_MERTENS_CORR,      // -0.487 -> -0.749 (rises with zeros)
  bestTunedSinusoidAbsCorr: IMP97798_BEST_TUNED_SINUSOID.absCorr, // ~0.69 (single tuned tone)
  correlationRisesWithZeros: true,                         // adding TRUE zeros monotonically improves the fit
  multiZeroFingerprint: true,                              // superposition, not a single tone
  mertensBeatsBestTunedSinusoid: Math.abs(MERT_5) > IMP97798_BEST_TUNED_SINUSOID.absCorr, // true (~0.75 > ~0.69)
  attributionSupported: true,                              // imp-97780 PNT/Mertens attribution is now TESTED and supported
  correlationIsModerateNotNearUnity: Math.abs(MERT_5) < 0.9, // ~0.75, below imp-97680 ~0.993
  subGap: 'IMP97798_PNT_MERTENS_CORRELATION_CEILING_SIGFIG_LIMITED',
  subGapStatus: 'open',
});

export const IMP97798_VERDICT = Object.freeze({
  question: 'is the imp-97780 residual oscillation correlated with a psi(x)-x / Mertens explicit-formula error term, and how strongly?',
  correlationRisesMonotonicallyWithTrueZeros: true,  // psi 0.318->0.562; Mertens 0.487->0.749
  multiZeroPntMertensFingerprint: true,              // superposition of Riemann zeros, not a single tone
  mertensShapeFitsBest: Math.abs(MERT_5) > PSI_5,    // 0.749 (Mertens) > 0.562 (psi) -- sum-over-primes shape
  beatsBestTunedSinusoid: Math.abs(MERT_5) > IMP97798_BEST_TUNED_SINUSOID.absCorr, // physical shape beats any tuned tone
  attributionSupportedNotConclusive: true,           // TESTED and supported; |r| ~0.75 moderate, not near-unity
  correlationCeilingIsSubGap: true,                  // ~45% variance unexplained -> named sig-fig/higher-zero sub-gap
  mcmRefuted: true,                                  // (imp-97432/imp-97583) unchanged
  ceilingTouched: false,
  anyBoundMoved: false,
  qed: false,
  conclusion:
    'MEASUREMENT ONLY. Testing the imp-97780 prose attribution of the dps=35 Route M gap-law residual ' +
    'oscillation to an oscillating PNT/Mertens error: after detrending log|residual| against the imp-97706 ' +
    'power law (~10.56), the detrended oscillation is Pearson-correlated against zero-parameter Riemann-zero ' +
    'explicit-formula proxies built from the true low-lying ordinates gamma_k. The correlation RISES ' +
    'MONOTONICALLY as the true zeros are added -- psi(x)-x proxy 0.318 -> 0.512 -> 0.562 (1,3,5 zeros), ' +
    'Mertens-error proxy 0.487 -> 0.749 (1,5 zeros) -- the signature of a multi-zero superposition, and the ' +
    '5-zero Mertens-error shape (|r| ~ 0.749) beats any single tuned sinusoid (|r| ~ 0.69). So imp-97780s ' +
    'attribution is now TESTED and SUPPORTED -- the oscillation is a multi-zero PNT/Mertens (sum-over-primes ' +
    'Mertens-error) fingerprint, not merely asserted. HONEST nuance: the phase-free correlation saturates at ' +
    'MODERATE strength (~0.75), well below the imp-97680 ~0.993 phase-lock, leaving ~45pct of the variance ' +
    'unexplained -- a named sub-gap IMP97798_PNT_MERTENS_CORRELATION_CEILING_SIGFIG_LIMITED (baked ~10-sig-fig ' +
    'residuals / higher zeros / crude envelope). The evidence is suggestive, not conclusive. MCM stays ' +
    'refuted from omega=11; b/4 ceiling untouched; kappa_arith unchanged; no bound on Lambda moves; ' +
    'PT Lambda <= 0.2 SOTA; RH open; NO QED.',
});

export const IMP97798_HONEST_BANNER =
  'RH open; PT Lambda <= 0.2 remains SOTA; NO QED. Testing the imp-97780 attribution of the dps=35 residual ' +
  'oscillation to a PNT/Mertens error: a zero-parameter Riemann-zero explicit-formula proxy correlates with ' +
  'the detrended oscillation and the correlation RISES monotonically as true zeros are added (psi 0.318 -> ' +
  '0.562, Mertens 0.487 -> 0.749), the 5-zero Mertens-error shape (|r| ~ 0.75) beating any single tuned tone ' +
  '(~0.69) -- a multi-zero fingerprint, so the attribution is SUPPORTED. HONEST nuance: the correlation is ' +
  'MODERATE (~0.75), not the imp-97680 ~0.993, leaving a named sig-fig/higher-zero sub-gap. MCM refuted from ' +
  'omega=11; no bound moved.';

// -- self-executing assertions (imp-3715 convention): recompute; any failure throws --

const IMP97798_ASSERTIONS = [
  {
    id: 'imp97798-ladder-and-detrend-consistent',
    holds: () =>
      IMP97706_COMBINED_LADDER.length === 23 &&
      IMP97798_RESIDUAL_OSCILLATION.length === 23 &&
      Math.abs(IMP97798_POWER_LAW_EXPONENT - 10.56) < 0.4 &&
      // a detrended oscillation has (near) zero mean by construction
      Math.abs(IMP97798_RESIDUAL_OSCILLATION.reduce((a, b) => a + b, 0) / 23) < 1e-9,
    why: 'the imp-97706 combined ladder has 23 rungs, the OLS detrend reproduces the ~10.56 power-law exponent, and the detrended oscillation is (near) zero-mean by construction.',
  },
  {
    id: 'imp97798-psi-correlation-rises-with-zeros',
    holds: () => {
      const c = IMP97798_PSI_CORR.map((o) => o.corr);
      return c[0] < c[1] && c[1] < c[2] && c[2] > 0.5 && c[0] < 0.4;
    },
    why: 'the psi(x)-x explicit-formula proxy correlation climbs monotonically 0.318 -> 0.512 -> 0.562 as the true first 1,3,5 Riemann zeros are added -- a multi-zero fingerprint (a single tuned tone would not improve with the ACTUAL next zeros).',
  },
  {
    id: 'imp97798-mertens-correlation-rises-and-beats-tuned-sinusoid',
    holds: () => {
      const c1 = Math.abs(IMP97798_MERTENS_CORR[0].corr);
      const c5 = Math.abs(IMP97798_MERTENS_CORR[1].corr);
      return c1 < c5 && c5 > 0.7 && c5 > IMP97798_BEST_TUNED_SINUSOID.absCorr;
    },
    why: 'the Mertens-error proxy correlation rises 0.487 -> 0.749 with added zeros and the 5-zero value (~0.749) exceeds the best single tuned sinusoid (~0.69) -- the physical multi-zero shape fits better than any tuned tone.',
  },
  {
    id: 'imp97798-mertens-shape-beats-psi-shape',
    holds: () => Math.abs(MERT_5) > PSI_5 && Math.abs(MERT_5) > 0.7 && PSI_5 > 0.5,
    why: 'the sum-over-primes Mertens-error shape (|r| ~ 0.749) fits the residual oscillation better than the raw psi(x)-x shape (~0.562), consistent with the residual being a Mertens-product-type error (imp-97619).',
  },
  {
    id: 'imp97798-correlation-is-moderate-subgap-open',
    holds: () =>
      Math.abs(MERT_5) < 0.9 &&
      IMP97798_RESULTS.subGap === 'IMP97798_PNT_MERTENS_CORRELATION_CEILING_SIGFIG_LIMITED' &&
      IMP97798_RESULTS.subGapStatus === 'open',
    why: 'the phase-free correlation saturates at MODERATE ~0.75 (below the imp-97680 ~0.993), so the attribution is supported but not conclusive -- a named sig-fig/higher-zero sub-gap stays open.',
  },
  {
    id: 'imp97798-honesty-gate-no-qed',
    holds: () =>
      IMP97798_VERDICT.correlationRisesMonotonicallyWithTrueZeros === true &&
      IMP97798_VERDICT.multiZeroPntMertensFingerprint === true &&
      IMP97798_VERDICT.mertensShapeFitsBest === true &&
      IMP97798_VERDICT.beatsBestTunedSinusoid === true &&
      IMP97798_VERDICT.attributionSupportedNotConclusive === true &&
      IMP97798_VERDICT.correlationCeilingIsSubGap === true &&
      IMP97798_VERDICT.mcmRefuted === true &&
      IMP97798_VERDICT.ceilingTouched === false &&
      IMP97798_VERDICT.anyBoundMoved === false &&
      IMP97798_VERDICT.qed === false &&
      /NO QED/.test(IMP97798_HONEST_BANNER) &&
      /PT Lambda <= 0.2/.test(IMP97798_HONEST_BANNER) &&
      /RH open/.test(IMP97798_HONEST_BANNER),
    why: 'measurement only -- the imp-97780 PNT/Mertens attribution is tested and moderately supported (multi-zero fit, |r| ~ 0.75), not conclusive; MCM refuted from omega=11; no bound moved, no QED.',
  },
];

for (const a of IMP97798_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97798-residual-oscillation-pnt-mertens-correlation assertion failed: ${a.id}`);
  }
}

export default {
  residualOscillation: IMP97798_RESIDUAL_OSCILLATION,
  powerLawExponent: IMP97798_POWER_LAW_EXPONENT,
  psiCorr: IMP97798_PSI_CORR,
  mertensCorr: IMP97798_MERTENS_CORR,
  bestTunedSinusoid: IMP97798_BEST_TUNED_SINUSOID,
  results: IMP97798_RESULTS,
  verdict: IMP97798_VERDICT,
  banner: IMP97798_HONEST_BANNER,
};
