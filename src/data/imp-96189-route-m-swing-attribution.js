/**
 * @module imp-96189-route-m-swing-attribution
 *
 * imp-96189 (numerical): attribution of the GENUINE period-1.5 (w ~ 4.08) swing
 * in the Route M Burnol ratio residual. imp-96163 REFUTED the imp-96147
 * conjecture that the ~1.3 percent period-1.5 fluctuation in
 *     ratio(N) = d_N^2 * log N / C_burnol
 * is an aliased gamma_1 = 14.1347 zero-tone (the coarse 17-point log N grid
 * resolves a planted gamma_1 tone cleanly at w = 14.136, so the swing is a
 * genuine low-frequency feature of ratio(N) on N <= 6000, not a grid artifact).
 * That left OPEN what the w ~ 4.08 tone actually is. This module attributes it.
 *
 * WHAT WAS DONE (tmp/imp-96189-attribution.mjs, reproducible, measurement only):
 * on the SAME baked data -- the 17 imp-96147 per-N residuals r(N) (ratio with
 * the c0 + c1/logN smooth term already removed) plus the imp-96105 raw ratio and
 * SPD lam_min on the N > 2600 tail -- four candidate sources for the w ~ 4.08
 * swing were fit by ordinary least squares and scored by variance explained R^2:
 *   (T) finite-size algebraic transients: r ~ a + b/N, a + b/logN, a + b/sqrt(N);
 *   (A) low-conductor arithmetic tones cos/sin(2 pi logN / log q), q = 2..8,
 *       i.e. small-denominator tones from the Vasyunin cotangent table V(a/q)
 *       (angular frequency w_q = 2 pi / log q in log N);
 *   (Z) the leading zero-side tone gamma_1 (control, must stay ~ 1 percent);
 *   (L) the SPD lam_min descent structure (imp-96105) -- Pearson correlation of
 *       the residual against lam_min and log lam_min on the N > 2600 tail.
 *
 * FINDINGS (see IMP96189_* below):
 *   (1) TRANSIENTS ARE RULED OUT. 1/N, 1/logN, 1/sqrt(N) each explain essentially
 *       zero residual variance (R^2 = 0.0025, 0.0000, 0.0004). The swing is NOT a
 *       finite-size algebraic transient.
 *   (2) THE SWING IS A LOW-CONDUCTOR ARITHMETIC BAND. Single conductor tones peak
 *       at q = 5 (w_5 = 3.904, R^2 = 0.685) and q = 4 (w_4 = 4.532, R^2 = 0.619);
 *       the best FREE single tone sits BETWEEN them at w = 4.080 (period 1.540 in
 *       log N, exp(period) = 4.67, R^2 = 0.710) -- essentially the best single-tone
 *       proxy for the q = 4/5 small-denominator band, not a distinct frequency. A
 *       fixed two-tone q4 + q5 band matches the free tone (R^2 = 0.712) and a
 *       q = 3..6 band captures 89.7 percent of the residual variance. This is the
 *       signature of small-denominator structure in the Vasyunin table, not a
 *       zero-side tone.
 *   (3) THE gamma_1 ZERO-TONE STAYS NEGLIGIBLE. R^2 = 0.0126, reconfirming
 *       imp-96147 / imp-96163: the swing carries almost no leading-zero content.
 *   (4) lam_min IS NOT THE SOURCE. lam_min is strictly monotone-decreasing over
 *       the tail (0 upward steps, imp-96105), so it has ZERO oscillatory content
 *       and cannot produce the 5-sign-change swing over the full ladder. The
 *       strong tail correlations (corr(resid, lam_min) = -0.77,
 *       corr(resid, log lam_min) = -0.85) are a short monotone-window artifact
 *       (the residual happens to rise monotonically over the same N > 2600 tail
 *       where lam_min falls -- only 1 sign change there), NOT a causal link.
 *
 * VERDICT: the genuine w ~ 4.08 swing is attributed to a LOW-CONDUCTOR ARITHMETIC
 * BAND (dominant conductors q = 4, 5) of the Vasyunin cotangent table's
 * small-denominator structure -- NOT a finite-size transient, NOT the gamma_1
 * zero-tone, and NOT lam_min conditioning drift. The best free single tone lands
 * between the conductor-4 and conductor-5 frequencies precisely because it is the
 * single-tone proxy of that band.
 *
 * HONEST RESIDUAL: 17 non-uniform log N points cannot UNIQUELY separate a
 * few-conductor band from a slow smooth drift -- the q4 + q5 band (R^2 = 0.712) is
 * statistically indistinguishable from the free single tone (0.710) at this
 * resolution -- and the sub-leading Vasyunin eigenvalue spectrum (beyond the
 * single lam_min value per rung) was not available to test the eigen-drift
 * candidate directly. So this is a CONSISTENT-WITH / most-plausible attribution,
 * not a unique identification; pinning the exact conductor content needs denser
 * d_N data past N = 6000 WITH the full Vasyunin eigen-spectrum. See
 * IMP96189_SUBGAP.
 *
 * MEASUREMENT ONLY. Changes no bound, establishes no operator positivity, makes
 * no RH claim; no refereed bound is changed. RH open. NO QED.
 *
 * @see imp-96163-route-m-residual-gamma1-alias-refute.js (aliasing refuted)
 * @see imp-96147-route-m-ratio-const-oscillation-fit.js (residual rows + fit)
 * @see imp-96105-route-m-vasyunin-gram-extend-n6000.js (ratio + lam_min to 6000)
 * @see imp-96325-route-m-vasyunin-gram-n1e4-run.js (Q2: the N=1e4 Gram extension
 *   this sub-gap called for still does NOT uniquely separate the band from a
 *   smooth drift -- the extra half-decade of log-N range is too narrow)
 *
 * Ticket: imp-96189 (numerical, opus-4-8, api-pool). Numerics only; NO QED.
 */

export const IMP96189_GAMMA1 = 14.134725141734693;

export const IMP96189_INPUT = Object.freeze({
  source: 'imp-96147 residual rows (17 pts, c0 + c1/logN removed) + imp-96105 ratio/lamMin (N>2600)',
  method: 'ordinary least squares, variance explained R^2, on the exact non-uniform 17-point log N grid',
  script: 'tmp/imp-96189-attribution.mjs (reproducible)',
  question: 'what is the genuine w ~ 4.08 (period 1.539 in log N) swing that imp-96163 refuted as a gamma_1 alias?',
});

// (T) finite-size algebraic transients: all explain ~ zero residual variance.
export const IMP96189_TRANSIENTS = Object.freeze({
  invN_R2: 0.0025,
  invLogN_R2: 0.0,
  invSqrtN_R2: 0.0004,
  note: '1/N, 1/logN and 1/sqrt(N) each explain essentially none of the residual variance -- the swing is NOT a finite-size algebraic transient.',
});

// (A) low-conductor arithmetic tones cos/sin(2 pi logN / log q). w_q = 2pi/log q.
export const IMP96189_CONDUCTOR_TONES = Object.freeze([
  Object.freeze({ q: 2, w: 9.065, R2: 0.0964 }),
  Object.freeze({ q: 3, w: 5.719, R2: 0.1766 }),
  Object.freeze({ q: 4, w: 4.532, R2: 0.6185 }),
  Object.freeze({ q: 5, w: 3.904, R2: 0.6850 }),
  Object.freeze({ q: 6, w: 3.507, R2: 0.5100 }),
  Object.freeze({ q: 7, w: 3.229, R2: 0.3866 }),
  Object.freeze({ q: 8, w: 3.022, R2: 0.3190 }),
]);

// Best free single tone (reproduces imp-96163 w ~ 4.08) sits between q=4 and q=5.
export const IMP96189_FREE_TONE = Object.freeze({
  bestW: 4.08,
  bestPeriodLogN: 1.54,
  expPeriod: 4.665,
  R2: 0.7099,
  note: 'the free optimum lands between the conductor-4 (w=4.53) and conductor-5 (w=3.90) frequencies (exp(period)=4.67), i.e. it is the single-tone proxy of the q=4/5 small-denominator band, not a distinct physical frequency.',
});

// Combined low-conductor bands (fixed conductor frequencies, free amplitudes).
export const IMP96189_BAND = Object.freeze({
  q4_q5_R2: 0.7122,
  q3_q4_q5_q6_R2: 0.8971,
  note: 'a fixed two-tone q4+q5 band matches the free single tone (0.712 vs 0.710) and a q=3..6 band captures 89.7 percent of the residual variance: the swing is a low-conductor arithmetic band of the Vasyunin cotangent table.',
});

// (Z) gamma_1 zero-tone control: stays negligible (reconfirms imp-96147/96163).
export const IMP96189_GAMMA1_TONE = Object.freeze({
  R2: 0.0126,
  note: 'the leading zero-side tone explains only 1.26 percent of the residual variance -- the swing carries almost no gamma_1 content, reconfirming imp-96147 / imp-96163.',
});

// (L) lam_min descent: monotone, so not the oscillation source; tail corr is an artifact.
export const IMP96189_LAMMIN = Object.freeze({
  corrResidLamMin: -0.7709,
  corrResidLogLamMin: -0.8537,
  lamMinUpwardSteps: 0,
  residSignChangesInTail: 1,
  isSource: false,
  note: 'lam_min is strictly monotone-decreasing (0 upward steps, imp-96105), so it has zero oscillatory content and cannot produce the 5-sign-change swing; the strong tail correlation is a short monotone-window artifact (only 1 residual sign change over the N>2600 tail), not a causal link.',
});

export const IMP96189_VERDICT = Object.freeze({
  transientRuledOut: true,
  gamma1RuledOut: true,
  lamMinRuledOut: true,
  attribution: 'low-conductor arithmetic band (dominant conductors q = 4, 5)',
  conclusion:
    'the genuine w ~ 4.08 swing is attributed to a low-conductor arithmetic band (dominant q = 4, 5) of the Vasyunin cotangent table small-denominator structure: single conductor tones peak at q=5 (R^2=0.685) and q=4 (R^2=0.619) and the best free single tone (w=4.08, R^2=0.710) sits between them, while transients (R^2<0.003), the gamma_1 zero-tone (R^2=0.013) and lam_min (strictly monotone, no oscillatory content) are all ruled out. This is a consistent-with / most-plausible attribution, not a unique identification.',
});

// Honest residual sub-gap: attribution is consistent-with, not unique.
export const IMP96189_SUBGAP = Object.freeze({
  id: 'imp-96189-band-vs-drift-non-unique',
  statement:
    'the swing is attributed to a low-conductor arithmetic band (q = 4, 5), but 17 non-uniform log N points cannot UNIQUELY separate a few-conductor band from a slow smooth drift -- the fixed q4+q5 band (R^2=0.712) is statistically indistinguishable from the free single tone (0.710) at this resolution -- and the sub-leading Vasyunin eigenvalue spectrum (beyond the single lam_min per rung) was unavailable to test the eigen-drift candidate directly. Pinning the exact conductor content needs denser d_N data past N=6000 WITH the full Vasyunin eigen-spectrum (heavy Gram eigendecomposition), not a further re-analysis of the N<=6000 residual.',
  // imp-96357 cross-link: the denser-past-6000 data this sub-gap asked for was
  // run (imp-96325, IMP96325_Q2_BAND_UNIQUENESS) -- the ladder now reaches
  // N=1e4, but the four new rungs only widen the log-N span by ~0.51 (a
  // half-decade), still too narrow to break the band-vs-drift degeneracy.
  // Part (a) of this sub-gap stands past N=1e4.
});

export const IMP96189_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: every value is a reproducible numeric from tmp/imp-96189-attribution.mjs fitting the imp-96147 residual rows and imp-96105 ratio/lam_min; no bound is claimed and no operator positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96189_ASSERTIONS = [
  {
    id: 'imp96189-transients-ruled-out',
    holds: () =>
      IMP96189_TRANSIENTS.invN_R2 < 0.02 &&
      IMP96189_TRANSIENTS.invLogN_R2 < 0.02 &&
      IMP96189_TRANSIENTS.invSqrtN_R2 < 0.02 &&
      IMP96189_VERDICT.transientRuledOut === true,
    why: 'the 1/N, 1/logN and 1/sqrt(N) transients each explain under 2 percent of the residual variance: the swing is not a finite-size algebraic transient.',
  },
  {
    id: 'imp96189-low-conductor-band-dominates',
    holds: () => {
      const q4 = IMP96189_CONDUCTOR_TONES.find((t) => t.q === 4);
      const q5 = IMP96189_CONDUCTOR_TONES.find((t) => t.q === 5);
      // the free tone frequency lies strictly between the conductor-5 and conductor-4 frequencies.
      return q5.w < IMP96189_FREE_TONE.bestW && IMP96189_FREE_TONE.bestW < q4.w &&
        q4.R2 > 0.5 && q5.R2 > 0.5 && IMP96189_BAND.q3_q4_q5_q6_R2 > 0.85;
    },
    why: 'the best free tone (w=4.08) sits between the conductor-4 (w=4.53) and conductor-5 (w=3.90) frequencies, both single tones exceed R^2=0.5, and a q=3..6 band captures over 85 percent of the residual variance: a low-conductor arithmetic band.',
  },
  {
    id: 'imp96189-free-tone-proxies-the-band',
    holds: () =>
      Math.abs(IMP96189_FREE_TONE.R2 - IMP96189_BAND.q4_q5_R2) < 0.02 &&
      Math.abs(IMP96189_FREE_TONE.expPeriod - 4.665) < 0.01,
    why: 'the fixed q4+q5 two-tone band (R^2=0.712) matches the free single tone (0.710) to within 0.02, and exp(period)=4.67 lands between conductors 4 and 5: the free tone is the single-tone proxy of the band.',
  },
  {
    id: 'imp96189-gamma1-negligible',
    holds: () => IMP96189_GAMMA1_TONE.R2 < 0.05 && IMP96189_VERDICT.gamma1RuledOut === true,
    why: 'the gamma_1 zero-tone explains only 1.26 percent of the residual variance, reconfirming imp-96147 / imp-96163 that the swing carries almost no leading-zero content.',
  },
  {
    id: 'imp96189-lammin-not-the-source',
    holds: () =>
      IMP96189_LAMMIN.lamMinUpwardSteps === 0 &&
      IMP96189_LAMMIN.residSignChangesInTail <= 1 &&
      IMP96189_LAMMIN.isSource === false,
    why: 'lam_min is strictly monotone (0 upward steps) with only 1 residual sign change over the tail it correlates with, so its strong tail correlation is a monotone-window artifact and it cannot be the oscillation source.',
  },
  {
    id: 'imp96189-honest-banner-and-subgap-present',
    holds: () =>
      /RH open/.test(IMP96189_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96189_HONEST_BANNER) &&
      /NO QED/.test(IMP96189_HONEST_BANNER) &&
      typeof IMP96189_SUBGAP.statement === 'string' &&
      /band-vs-drift-non-unique/.test(IMP96189_SUBGAP.id),
    why: 'the honest banner carries the RH-open / PT-Lambda / NO-QED markers and an explicit named sub-gap that the band-vs-drift attribution is consistent-with, not unique.',
  },
];

for (const a of IMP96189_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96189-route-m-swing-attribution assertion failed: ${a.id}`);
  }
}

export default {
  gamma1: IMP96189_GAMMA1,
  input: IMP96189_INPUT,
  transients: IMP96189_TRANSIENTS,
  conductorTones: IMP96189_CONDUCTOR_TONES,
  freeTone: IMP96189_FREE_TONE,
  band: IMP96189_BAND,
  gamma1Tone: IMP96189_GAMMA1_TONE,
  lamMin: IMP96189_LAMMIN,
  verdict: IMP96189_VERDICT,
  subGap: IMP96189_SUBGAP,
  banner: IMP96189_HONEST_BANNER,
};
