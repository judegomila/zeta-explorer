/**
 * @module imp-35721-cc-amplitude-mismatch-dual-reading-reconciliation
 *
 * imp-35721 (numerical, measurement): RECONCILE side-by-side the TWO distinct
 * amplitude-mismatch readings the frontier cohort records against the SAME short-
 * range collision constant C_C = (1/8) sqrt(3 pi) ~ 0.383748 (imp-2642/imp-2643,
 * C_H = 1/8):
 *   READING A (imp-35680) -- the band-averaged in-band structure factor
 *     A_band = 1/2 gives ratio A_band / C_C ~ 1.3029 (a ~30.3 percent overshoot);
 *   READING B (imp-35696/imp-35680) -- the small-gap density curvature coefficient
 *     pi^2/3 ~ 3.28987 gives ratio (pi^2/3) / C_C ~ 8.573.
 * imp-35680 records both numbers, but never explains WHY the two differ or
 * characterises the DIFFERENT spectral objects they measure. This module supplies
 * that reconciliation: it MEASURES both amplitudes by independent quadrature /
 * finite-difference and shows the two readings describe Fourier-conjugate
 * descriptors of GUE short-range structure that cannot coincide, and that NEITHER
 * equals C_C, for ORTHOGONAL reasons.
 *
 * THE TWO SPECTRAL OBJECTS.
 *   Object A -- a MOMENTUM/FOURIER-space MEAN. The structure factor
 *     S(alpha) = |alpha| for |alpha| < 1 (Montgomery ramp), S(alpha) = 1 for
 *     |alpha| >= 1 (diagonal collision plateau). A_band is its band-averaged value
 *     over the PROVEN support |alpha| < 1,
 *       A_band = (1 / (2)) INT_{-1}^{1} |alpha| d alpha = 1/2,
 *     a FIRST-order (mean) spectral moment of the in-band ramp.
 *   Object B -- a POSITION-space small-x CURVATURE. The connected pair correlation
 *     R_2(x) = 1 - (sin(pi x)/(pi x))^2 vanishes QUADRATICALLY at the origin,
 *       R_2(x) = (pi^2/3) x^2 - ...   (leading Taylor / small-gap density curvature),
 *     so its coefficient pi^2/3 is a SECOND-order (curvature) real-space datum. It
 *     is the s -> 0 cubic-repulsion density coefficient (beta = 2), not a mean.
 *
 * WHY THEY NEVER COINCIDE. A_band and pi^2/3 are a low-order MOMENT in frequency
 * space vs a small-argument CURVATURE in position space -- Fourier-conjugate
 * descriptors of the same cluster function, measuring different orders of its
 * structure. Their own ratio is a pure GUE number carrying no C_C content:
 *   (pi^2/3) / A_band = (pi^2/3) / (1/2) = 2 pi^2 / 3 ~ 6.5797,
 * equivalently ratioCurvatureToCC / ratioBandToCC ~ 8.573 / 1.3029 ~ 6.5797.
 * So the two mismatch ratios differ by exactly this fixed factor and can never
 * report the same amplitude.
 *
 * WHY NEITHER EQUALS C_C (ORTHOGONAL REASONS).
 *   - A_band = 1/2 is band-limited to |alpha| < 1 and thus captures ZERO of the
 *     |alpha| >= 1 diagonal collision plateau that carries C_C (spectral-SUPPORT
 *     reason -- imp-35680): 100 percent of the C_C support is out of band.
 *   - pi^2/3 is the real-space CURVATURE of the connected (near-coincidence) cluster
 *     Y_2 -- a short-range SHAPE coefficient, not the diagonal collision amplitude
 *     (near-coincidence-SHAPE reason). C_C = (1/8) sqrt(3 pi) is a diagonal collision
 *     amplitude -- a THIRD, distinct object neither in-band mean nor cluster curvature.
 * The two readings therefore corroborate rather than contradict: they are different
 * orders of the same short-range GUE structure, each off C_C for its own reason.
 *
 * Measurement / reconciliation only; corroborates imp-35680 and imp-35696;
 * derives no remainder; discharges nothing; changes no bound; establishes no
 * operator positivity; C_C = (1/8) sqrt(3 pi) (imp-2642/imp-2643), C_H = 1/8,
 * E_trunc = 3.06e-5 (imp-2631) and C_mb GUE-conditional (imp-486) are UNTOUCHED;
 * imp-35337a stays OPEN; NO QED; no refereed bound is changed.
 *
 * @see imp-35680-constant-mismatch-magnitude (Reading A: A_band/C_C ~ 1.3029; also records the curvature ratio)
 * @see imp-35696-collision-exponent-consistency-check (Reading B context: pi^2/3 as small-gap density coefficient, cube-root prefactor ~ 2.047)
 * @see imp-2642/imp-2643 (C_C = (1/8) sqrt(3 pi), C_H = 1/8)
 * Literature: Montgomery (1973, pair correlation / form factor); Rudnick-Sarnak
 * (1996, n-level correlations); Ben Arous-Bourgade (2013, smallest GUE gaps).
 * Platt-Trudgian 2021 (Lambda <= 0.2).
 */

import { IMP35680_CONSTANT_MISMATCH_MAGNITUDE } from './imp-35680-constant-mismatch-magnitude.js';

const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any measurement here)
const ALPHA_LIMIT = 1; // Montgomery/Rudnick-Sarnak proven support |alpha| < 1

// Target short-range collision constant (imp-2642/imp-2643 ansatz, C_H = 1/8).
const C_C = (1 / 8) * Math.sqrt(3 * Math.PI); // ~ 0.38374752

// Composite Simpson quadrature (n even) -- MEASURE the band mean rather than
// substitute its closed form, so Object A is a genuine numeric average.
function simpson(f, a, b, n) {
  const h = (b - a) / n;
  let s = f(a) + f(b);
  for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * f(a + i * h);
  return (s * h) / 3;
}

// OBJECT A -- momentum/Fourier-space MEAN: band-averaged structure factor over
// |alpha| < 1 (even symmetry; the in-band integrand |alpha| is linear so Simpson
// is exact). A first-order spectral moment of the Montgomery ramp.
const NPAN = 1000;
const bandIntegral = 2 * simpson((a) => a, 0, ALPHA_LIMIT, NPAN); // INT_{-1}^{1} |alpha| ~ 1
const A_BAND = bandIntegral / (2 * ALPHA_LIMIT); // ~ 0.5 (band mean)

// OBJECT B -- position-space small-x CURVATURE: leading Taylor coefficient of the
// connected pair correlation R_2(x) = 1 - (sin(pi x)/(pi x))^2, MEASURED by the
// even-function curvature quotient R_2(h)/h^2 -> pi^2/3 as h -> 0 (since R_2(0)=0
// and R_2''(0)/2 = pi^2/3). A genuine finite-difference read of the coefficient.
const R2 = (x) => {
  if (x === 0) return 0;
  const s = Math.sin(Math.PI * x) / (Math.PI * x);
  return 1 - s * s;
};
const H_FD = 1e-3; // small step: truncation error O(h^2) ~ 1e-6, well below cancellation floor
const CURVATURE_MEASURED = R2(H_FD) / (H_FD * H_FD); // ~ pi^2/3 ~ 3.28987
const CURVATURE_CLOSED = (Math.PI * Math.PI) / 3; // pi^2/3 reference

// The two mismatch ratios against the SAME C_C.
const RATIO_BAND_TO_CC = A_BAND / C_C; // ~ 1.3029 (Reading A)
const RATIO_CURVATURE_TO_CC = CURVATURE_MEASURED / C_C; // ~ 8.573 (Reading B)

// The fixed GUE factor separating the two readings (no C_C content):
// (pi^2/3) / (1/2) = 2 pi^2/3 ~ 6.5797.
const READING_SEPARATION = CURVATURE_MEASURED / A_BAND; // ~ 6.5797
const READING_SEPARATION_CLOSED = 2 * Math.PI * Math.PI / 3; // 2 pi^2/3

export const IMP35721_CC_AMPLITUDE_MISMATCH_DUAL_READING_RECONCILIATION = {
  id: 'imp-35721',
  proofSection: 'S-frontier',
  question:
    'Why do the TWO amplitude-mismatch readings against the same C_C = (1/8) sqrt(3 pi) -- the band-averaged ' +
    'structure factor ratio A_band/C_C ~ 1.3029 and the small-gap density curvature ratio (pi^2/3)/C_C ~ 8.573 -- ' +
    'differ, and why does neither equal C_C?',
  setup:
    'Reading A is Object A, a momentum/Fourier-space MEAN: the band-averaged structure factor A_band = ' +
    '(1/2) INT_{-1}^{1} |alpha| d alpha = 1/2 over the proven support |alpha| < 1 (a first-order spectral moment ' +
    'of the Montgomery ramp). Reading B is Object B, a position-space small-x CURVATURE: the leading Taylor ' +
    'coefficient pi^2/3 of R_2(x) = 1 - (sin(pi x)/(pi x))^2 (the s -> 0 cubic-repulsion density curvature). The two ' +
    'are Fourier-conjugate descriptors of the same short-range structure at different orders.',
  measurement: {
    C_C: +C_C.toPrecision(8), // 0.38374752 (target, untouched)
    alphaLimit: ALPHA_LIMIT,
    // Reading A -- band mean (Object A)
    meanScaleAmplitudeABand: +A_BAND.toPrecision(8), // 0.5
    ratioBandToCC: +RATIO_BAND_TO_CC.toPrecision(8), // 1.3029400
    // Reading B -- small-x curvature (Object B), MEASURED by finite difference
    curvatureCoeffMeasured: +CURVATURE_MEASURED.toPrecision(8), // ~ 3.2898681 (pi^2/3)
    curvatureCoeffClosed: +CURVATURE_CLOSED.toPrecision(8), // 3.2898681
    ratioCurvatureToCC: +RATIO_CURVATURE_TO_CC.toPrecision(8), // ~ 8.5730018
    // separation of the two readings -- a pure GUE number, no C_C content
    readingSeparation: +READING_SEPARATION.toPrecision(8), // ~ 6.5796963 (2 pi^2/3)
    readingSeparationClosed: +READING_SEPARATION_CLOSED.toPrecision(8), // 6.5797363
  },
  findings:
    'The two mismatch ratios measure DIFFERENT spectral objects. Reading A (A_band/C_C ~ 1.3029) is a Fourier-space ' +
    'band MEAN of the in-band structure-factor ramp (A_band = 1/2, Simpson-measured); Reading B ' +
    '((pi^2/3)/C_C ~ 8.573) is a position-space small-x CURVATURE of the connected cluster R_2 (pi^2/3, finite-' +
    'difference-measured). They are Fourier-conjugate descriptors at different orders (mean vs curvature), so they ' +
    'CANNOT coincide: their own ratio is the pure GUE number (pi^2/3)/(1/2) = 2 pi^2/3 ~ 6.5797, carrying no C_C ' +
    'content. NEITHER equals C_C for ORTHOGONAL reasons: A_band = 1/2 is band-limited to |alpha| < 1 and captures ' +
    'ZERO of the |alpha| >= 1 diagonal collision plateau that carries C_C (spectral-support reason), while pi^2/3 is ' +
    'a real-space near-coincidence SHAPE curvature of the connected cluster, not the diagonal collision amplitude ' +
    'C_C = (1/8) sqrt(3 pi) (near-coincidence-shape reason). The readings corroborate: different orders of the same ' +
    'short-range GUE structure, each off C_C for its own reason.',
  scaleIndependent: true, // both A_band = 1/2 and pi^2/3 are N-independent mean-scale numbers
  corroboratesImp35680: true,
  corroboratesImp35696: true,
  isRigorous: false,
  isUnconditional: false,
  verdict:
    'MEASUREMENT (NOT rigorous). The two amplitude-mismatch readings against the same C_C = (1/8) sqrt(3 pi) describe ' +
    'DIFFERENT spectral objects: Reading A (A_band/C_C ~ 1.3029) a Fourier-space band MEAN (A_band = 1/2), Reading B ' +
    '((pi^2/3)/C_C ~ 8.573) a position-space small-x CURVATURE (pi^2/3). They are Fourier-conjugate descriptors at ' +
    'different orders, separated by the pure GUE factor 2 pi^2/3 ~ 6.5797, so they never coincide; and NEITHER equals ' +
    'C_C -- A_band by spectral support (misses the |alpha| >= 1 collision plateau), pi^2/3 by being a near-coincidence ' +
    'cluster shape, not the diagonal collision amplitude. Corroborates imp-35680 and imp-35696; derives no remainder; ' +
    'discharges nothing; changes no bound; establishes no operator positivity; C_C = (1/8) sqrt(3 pi) (imp-2642/' +
    'imp-2643), C_H = 1/8, E_trunc = 3.06e-5 (imp-2631) and C_mb GUE-conditional (imp-486) are UNTOUCHED; imp-35337a ' +
    'stays OPEN; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35680 (Reading A A_band/C_C ~ 1.3029, curvature ratio recorded); imp-35696 (Reading B pi^2/3 small-gap ' +
    'density coefficient, cube-root prefactor); imp-2642/imp-2643 (C_C = (1/8) sqrt(3 pi), C_H = 1/8); imp-2631 ' +
    '(E_trunc floor); imp-486 (GUE-conditional caveat). Literature: Montgomery (1973); Rudnick-Sarnak (1996); ' +
    'Ben Arous-Bourgade (2013). Platt-Trudgian 2021 (Lambda <= 0.2).',
};

export const IMP35721_CC_AMPLITUDE_MISMATCH_DUAL_READING_RECONCILIATION_ASSERTIONS = [
  {
    // (1) target C_C reproduces (1/8) sqrt(3 pi) and matches the imp-35680 baked value.
    id: 'imp35721-cc-target-matches-imp35680',
    description: 'the target collision constant reproduces (1/8) sqrt(3 pi) ~ 0.38374752 and matches the imp-35680 baked C_C',
    holds: () => {
      const parent = IMP35680_CONSTANT_MISMATCH_MAGNITUDE.measurement.C_C;
      return (
        Math.abs(C_C - 0.38374752) < 1e-6 &&
        Math.abs(C_C - parent) < 1e-6 &&
        Math.abs(IMP35721_CC_AMPLITUDE_MISMATCH_DUAL_READING_RECONCILIATION.measurement.C_C - parent) < 1e-6
      );
    },
  },
  {
    // (2) Object A: the Simpson-measured band mean is 1/2, reproducing the imp-35680 A_band.
    id: 'imp35721-object-a-band-mean-half',
    description: 'Object A: the Simpson-measured band-averaged structure factor is 1/2 and matches the imp-35680 A_band',
    holds: () =>
      Math.abs(A_BAND - 0.5) < 1e-9 &&
      Math.abs(A_BAND - IMP35680_CONSTANT_MISMATCH_MAGNITUDE.measurement.meanScaleAmplitudeABand) < 1e-6,
  },
  {
    // (3) Object B: the finite-difference curvature coefficient recovers pi^2/3 and
    //     matches the imp-35680 recorded short-range curvature.
    id: 'imp35721-object-b-curvature-pi2over3',
    description: 'Object B: the finite-difference small-x curvature of R_2 recovers pi^2/3 ~ 3.28987 and matches the imp-35680 curvature',
    holds: () =>
      Math.abs(CURVATURE_MEASURED - CURVATURE_CLOSED) < 1e-4 &&
      Math.abs(CURVATURE_CLOSED - Math.PI * Math.PI / 3) < 1e-12 &&
      Math.abs(CURVATURE_MEASURED - IMP35680_CONSTANT_MISMATCH_MAGNITUDE.measurement.shortRangeCurvatureR2) < 1e-3,
  },
  {
    // (4) the two mismatch ratios come out at ~1.3029 (Reading A) and ~8.573 (Reading B).
    id: 'imp35721-two-mismatch-ratios',
    description: 'Reading A ratio A_band/C_C ~ 1.3029 and Reading B ratio (pi^2/3)/C_C ~ 8.573 measured against the same C_C',
    holds: () => {
      const m = IMP35721_CC_AMPLITUDE_MISMATCH_DUAL_READING_RECONCILIATION.measurement;
      return (
        RATIO_BAND_TO_CC > 1.302 && RATIO_BAND_TO_CC < 1.304 &&
        RATIO_CURVATURE_TO_CC > 8.5 && RATIO_CURVATURE_TO_CC < 8.6 &&
        Math.abs(m.ratioBandToCC - RATIO_BAND_TO_CC) < 1e-6 &&
        Math.abs(m.ratioCurvatureToCC - RATIO_CURVATURE_TO_CC) < 1e-4
      );
    },
  },
  {
    // (5) the two readings are separated by the pure GUE factor 2 pi^2/3 ~ 6.5797 (no C_C),
    //     equivalently ratioCurvatureToCC / ratioBandToCC = curvature / A_band -- they never coincide.
    id: 'imp35721-reading-separation-pure-gue',
    description: 'the two readings differ by the pure GUE factor (pi^2/3)/(1/2) = 2 pi^2/3 ~ 6.5797, so they cannot report the same amplitude',
    holds: () => {
      const ratioOfRatios = RATIO_CURVATURE_TO_CC / RATIO_BAND_TO_CC;
      return (
        READING_SEPARATION > 6.57 && READING_SEPARATION < 6.59 &&
        Math.abs(READING_SEPARATION - READING_SEPARATION_CLOSED) < 1e-3 &&
        Math.abs(ratioOfRatios - READING_SEPARATION) < 1e-3 &&
        Math.abs(CURVATURE_MEASURED - A_BAND) > 2 // the two objects are far apart, never equal
      );
    },
  },
  {
    // (6) honesty gate: measurement only, conditional, no bound moves, no refereed bound is changed, imp-35337a OPEN, NO QED.
    id: 'imp35721-measurement-only-no-qed',
    description: 'measurement only: not rigorous/unconditional, changes no bound, keeps imp-486 caveat, imp-35337a OPEN, PT 0.2, NO QED',
    holds: () => {
      const r = IMP35721_CC_AMPLITUDE_MISMATCH_DUAL_READING_RECONCILIATION;
      return (
        Math.abs(L_PT - 0.2) < 1e-15 &&
        r.isRigorous === false &&
        r.isUnconditional === false &&
        r.corroboratesImp35680 === true &&
        r.corroboratesImp35696 === true &&
        /imp-486/.test(r.verdict) &&
        /imp-35337a stays OPEN/.test(r.verdict) &&
        /NO QED/.test(r.verdict) &&
        /refereed bound is changed/i.test(r.verdict)
      );
    },
  },
];

for (const a of IMP35721_CC_AMPLITUDE_MISMATCH_DUAL_READING_RECONCILIATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35721-cc-amplitude-mismatch-dual-reading-reconciliation assertion failed: ${a.id}`);
  }
}
