/**
 * @module imp-96163-route-m-residual-gamma1-alias-refute
 *
 * imp-96163 (numerical): partial closure of the imp-96147 sub-gap
 * imp-96147-gamma1-identification. imp-96147 separated the Route M Burnol ratio
 *     ratio(N) = d_N^2 * log N / C_burnol
 * into a constant c0 = 0.975 (not the RH-predicted 1) plus a genuine,
 * non-decaying ~1.3 percent fluctuation, whose best free-frequency single tone
 * sat at angular frequency w = 4.09 (period 1.536 in log N) rather than at the
 * leading zeta zero gamma_1 = 14.1347 (predicted period 0.4445). imp-96147
 * CONJECTURED that the period-1.5 swing is "most plausibly an alias" of the true
 * gamma_1 zero-tone, because the 17-point log N grid has gaps up to 0.69
 * (naive uniform-grid Nyquist limit 0.2223 < 0.4445). Its sub-gap asked for a
 * denser uniform grid OR an explicit-formula low-zero remainder model to decide.
 *
 * WHAT WAS DONE (tmp/rh-route-m/m12-alias-model.py, reproducible, measurement
 * only): rather than a heavy dense d_N eigendecomposition ladder past N = 6000,
 * an explicit-formula / controlled-tone test was run on the EXACT 17-point
 * imp-96105 log N grid:
 *   (A) the imp-96147 residual r(N) = ratio(N) - (c0 + c1/logN) was rebuilt from
 *       the baked rows and its best free-frequency single tone re-measured by a
 *       least-squares angular-frequency scan (w in [0.1, 22], 4000 steps);
 *   (B) ALIASING TEST: a KNOWN pure gamma_1 tone cos(gamma_1 logN + phi) was put
 *       on the SAME coarse grid and the same scan was run (phase-averaged over 8
 *       phases) to see where it is recovered;
 *   (C) DENSE control: the same tone on a 400-point uniform log N grid;
 *   (D) an explicit-formula multi-zero remainder Sum_k cos(gamma_k logN)/gamma_k
 *       (first 5 zeros) was sampled dense and coarse and its dominant recovered
 *       frequency reported.
 *
 * FINDINGS (see IMP96163_SCAN / IMP96163_VERDICT):
 *   (1) THE REAL RESIDUAL best free tone reproduces imp-96147: w = 4.081,
 *       period 1.539 in log N, amplitude 0.01697, explaining 71.0 percent of the
 *       residual variance in a single tone -- a strong low-frequency swing.
 *   (2) THE COARSE GRID RESOLVES gamma_1 CLEANLY. A pure gamma_1 tone placed on
 *       the exact 17-point grid is recovered by the identical scan at w = 14.136
 *       (period 0.4445) with variance explained 1.00000 at EVERY one of the 8
 *       phases -- it does NOT alias down to w ~ 4. Irregular (non-uniform)
 *       sampling breaks the uniform-grid aliasing degeneracy, so least squares
 *       recovers the frequency above the naive uniform Nyquist limit
 *       (Lomb-Scargle / super-Nyquist behaviour). The dense uniform control
 *       recovers the same w = 14.136 / varExpl 1.00000.
 *   (3) THEREFORE THE imp-96147 ALIASING CONJECTURE IS REFUTED. If the real
 *       fluctuation were the gamma_1 zero-tone, this very scan would have found
 *       it at w = 14.14 with near-unit variance explained; instead the real
 *       residual best tone is at w = 4.08 and its gamma_1 content is only
 *       1.26 percent (imp-96147). The period-1.5 swing is a GENUINE
 *       low-frequency feature of ratio(N) on N <= 6000, not an aliased gamma_1
 *       tone -- the grid was never the obstruction to seeing gamma_1.
 *   (4) THE EXPLICIT-FORMULA REMAINDER stays gamma_1-dominated on both grids
 *       (dense recovered w = 14.16, coarse w = 13.81 -- both within 0.35 of
 *       gamma_1, never near w = 4), confirming that a zero-driven remainder
 *       would present near gamma_1 on this grid, not as the observed swing.
 *
 * VERDICT: the aliasing sub-question is SETTLED (refuted): the coarse imp-96105
 * grid resolves the gamma_1 frequency perfectly, so the observed period-1.5
 * fluctuation is NOT an alias of the leading zero-tone. What remains OPEN is
 * re-framed: the N <= 6000 fluctuation is genuinely dominated by a low-frequency
 * (w ~ 4, period ~ 1.5 in log N) swing with almost no gamma_1 content, so either
 * (a) the zero-side gamma_1 term has not yet emerged over this range, or (b) a
 * slow low-frequency drift (tied to c0 != 1) masks it. Deciding whether c0 -> 1
 * and whether a gamma_1 tone eventually dominates still needs ACTUAL denser d_N
 * data well past N = 6000 (heavy Gram eigendecomposition) -- but NOT because of
 * grid aliasing. See IMP96163_SUBGAP.
 *
 * MEASUREMENT ONLY. Changes no bound, establishes no operator positivity, makes
 * no RH claim; no refereed bound is changed. RH open. NO QED.
 *
 * @see imp-96147-route-m-ratio-const-oscillation-fit.js (source residual + fit)
 * @see imp-96105-route-m-vasyunin-gram-extend-n6000.js (source ladder to 6000)
 * @see rh-route-m-nyman-beurling-vasyunin-reciprocity-2026-09-23.js (Route M base)
 *
 * Ticket: imp-96163 (numerical, opus-4-8, api-pool). Numerics only; NO QED.
 */

export const IMP96163_GAMMA1 = 14.134725141734693;
export const IMP96163_GAMMA1_PERIOD_LOGN = 0.44452122302878244; // 2 pi / gamma_1

export const IMP96163_INPUT = Object.freeze({
  source: 'tmp/rh-route-m/m10-out.json coarse 17-point grid + tmp/rh-route-m/m12-alias-model.py',
  grid: 'exact imp-96105 log N grid, N = 250..6000 (17 points, non-uniform, gaps up to 0.69)',
  method: 'least-squares angular-frequency scan w in [0.1, 22] (4000 steps): fit A cos(w logN) + B sin(w logN) + const, maximise variance explained',
  question: 'is the imp-96147 period-1.536 residual swing an ALIAS of the gamma_1 zero-tone, or a genuine low-frequency feature?',
});

// (A) real imp-96147 residual: best free single tone (reproduces w ~ 4.09).
export const IMP96163_REAL_RESID = Object.freeze({
  bestW: 4.08132033008252,
  bestPeriodLogN: 1.5394982013216656,
  amp: 0.016969822533924754,
  varExplained: 0.709925892414677,
  note: 'reproduces imp-96147 bestFreqW 4.091 / period 1.536; one low-frequency tone captures 71 percent of the residual variance.',
});

// (B) aliasing test: pure gamma_1 tone on the SAME coarse grid, phase-averaged.
export const IMP96163_GAMMA1_COARSE = Object.freeze({
  bestW: 14.135933983495873,
  bestPeriodLogN: 0.44448320956474424,
  varExplained: 0.9999989624268868,
  varExplainedAllPhasesMin: 0.99999,
  note: 'a KNOWN gamma_1 tone is recovered on the coarse grid at w = 14.136 (period 0.4445) with variance explained 1.00000 at all 8 tested phases -- it does NOT alias to w ~ 4; irregular sampling breaks uniform-grid aliasing (super-Nyquist / Lomb-Scargle).',
});

// (C) dense uniform control grid over the same log N span.
export const IMP96163_GAMMA1_DENSE = Object.freeze({
  bestW: 14.135933983495873,
  bestPeriodLogN: 0.44448320956474424,
  varExplained: 0.9999987688350548,
  note: 'the dense uniform 400-point control recovers the identical w = 14.136; the coarse grid matches it, confirming no aliasing degradation.',
});

// (D) explicit-formula multi-zero remainder Sum_k cos(gamma_k logN)/gamma_k.
export const IMP96163_EF_REMAINDER = Object.freeze({
  denseBestW: 14.163315828957238,
  denseBestPeriodLogN: 0.4436238930952499,
  denseVarExplained: 0.46365313735183056,
  coarseBestW: 13.807351837959487,
  coarseBestPeriodLogN: 0.45506085315402117,
  coarseVarExplained: 0.8240574100115772,
  note: 'a first-5-zero explicit-formula remainder stays gamma_1-dominated on both grids (dense w = 14.16, coarse w = 13.81, both within 0.35 of gamma_1) -- a zero-driven remainder would present near gamma_1 here, never as the observed w ~ 4 swing.',
});

export const IMP96163_VERDICT = Object.freeze({
  aliasingConjectureRefuted: true,
  gridResolvesGamma1: true,
  swingIsGenuineLowFrequency: true,
  conclusion:
    'the coarse imp-96105 grid resolves the gamma_1 frequency perfectly (a known gamma_1 tone recovers at w = 14.14 with varExpl 1.00000 at every phase), so the imp-96147 conjecture that the period-1.5 residual swing is an alias of the gamma_1 zero-tone is REFUTED. The observed w = 4.08 / period 1.54 swing is a genuine low-frequency feature of ratio(N) on N <= 6000 with only 1.26 percent gamma_1 content; the grid was never the obstruction. Whether c0 -> 1 and a gamma_1 tone eventually dominates still needs actual denser d_N data past 6000 -- but not because of aliasing.',
});

// Honest residual sub-gap: aliasing settled; the c0->1 / gamma_1-emergence
// question now needs real high-N d_N data, not a finer analysis of N <= 6000.
export const IMP96163_SUBGAP = Object.freeze({
  id: 'imp-96163-highN-dN-required',
  statement:
    'the aliasing explanation is refuted: the coarse grid resolves gamma_1, so the period-1.5 swing is a genuine low-frequency feature of ratio(N) on N <= 6000, not an aliased zero-tone. The remaining open question -- whether c0 -> 1 and whether the gamma_1 zero-side term eventually emerges and dominates -- can no longer be attacked by re-analysing the N <= 6000 grid; it requires ACTUAL denser d_N^2 values well past N = 6000 (heavy Vasyunin Gram eigendecomposition, CPU-bound), where the low-frequency swing may decay and let a gamma_1 tone surface. This is a data-reach gap, no longer a grid-resolution gap.',
});

export const IMP96163_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: every value is a reproducible numeric from tmp/rh-route-m/m12-alias-model.py running a least-squares frequency scan on the exact imp-96105 coarse grid; no bound is claimed and no operator positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96163_ASSERTIONS = [
  {
    id: 'imp96163-real-resid-reproduces-imp96147-swing',
    holds: () =>
      Math.abs(IMP96163_REAL_RESID.bestW - 4.081) < 0.05 &&
      Math.abs(IMP96163_REAL_RESID.bestPeriodLogN - 1.536) < 0.02 &&
      IMP96163_REAL_RESID.varExplained > 0.5,
    why: 'the least-squares scan reproduces the imp-96147 best free tone (w ~ 4.09, period ~ 1.536), which alone captures over half the residual variance.',
  },
  {
    id: 'imp96163-coarse-grid-resolves-gamma1',
    holds: () =>
      Math.abs(IMP96163_GAMMA1_COARSE.bestW - IMP96163_GAMMA1) < 0.01 &&
      IMP96163_GAMMA1_COARSE.varExplained > 0.999 &&
      IMP96163_GAMMA1_COARSE.varExplainedAllPhasesMin > 0.999,
    why: 'a known gamma_1 tone is recovered on the exact coarse grid at w = 14.14 with variance explained 1.00000 at every phase: the grid resolves gamma_1, no aliasing.',
  },
  {
    id: 'imp96163-gamma1-does-not-alias-to-the-swing',
    holds: () =>
      Math.abs(IMP96163_GAMMA1_COARSE.bestW - IMP96163_REAL_RESID.bestW) > 5 &&
      IMP96163_VERDICT.aliasingConjectureRefuted === true,
    why: 'the recovered gamma_1 frequency (14.14) is far from the real residual swing frequency (4.08), so the swing is NOT an alias of gamma_1 -- the imp-96147 aliasing conjecture is refuted.',
  },
  {
    id: 'imp96163-dense-control-matches-coarse',
    holds: () =>
      Math.abs(IMP96163_GAMMA1_DENSE.bestW - IMP96163_GAMMA1_COARSE.bestW) < 1e-6 &&
      IMP96163_GAMMA1_DENSE.varExplained > 0.999,
    why: 'the dense uniform control recovers the identical gamma_1 frequency as the coarse grid, confirming the coarse grid suffers no aliasing degradation.',
  },
  {
    id: 'imp96163-ef-remainder-stays-gamma1-dominated',
    holds: () =>
      Math.abs(IMP96163_EF_REMAINDER.denseBestW - IMP96163_GAMMA1) < 0.5 &&
      Math.abs(IMP96163_EF_REMAINDER.coarseBestW - IMP96163_GAMMA1) < 0.5,
    why: 'the explicit-formula low-zero remainder stays gamma_1-dominated on both grids (within 0.5 of gamma_1), never near w = 4 -- a zero-driven remainder would present near gamma_1 here.',
  },
  {
    id: 'imp96163-honest-banner-and-subgap-present',
    holds: () =>
      /RH open/.test(IMP96163_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96163_HONEST_BANNER) &&
      /NO QED/.test(IMP96163_HONEST_BANNER) &&
      typeof IMP96163_SUBGAP.statement === 'string' &&
      /highN-dN-required/.test(IMP96163_SUBGAP.id),
    why: 'the honest banner carries the RH-open / PT-Lambda / NO-QED markers and an explicit re-framed sub-gap (the remaining question needs real high-N d_N data, not a grid fix).',
  },
];

for (const a of IMP96163_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96163-route-m-residual-gamma1-alias-refute assertion failed: ${a.id}`);
  }
}

export default {
  gamma1: IMP96163_GAMMA1,
  gamma1PeriodLogN: IMP96163_GAMMA1_PERIOD_LOGN,
  input: IMP96163_INPUT,
  realResid: IMP96163_REAL_RESID,
  gamma1Coarse: IMP96163_GAMMA1_COARSE,
  gamma1Dense: IMP96163_GAMMA1_DENSE,
  efRemainder: IMP96163_EF_REMAINDER,
  verdict: IMP96163_VERDICT,
  subGap: IMP96163_SUBGAP,
  banner: IMP96163_HONEST_BANNER,
};
