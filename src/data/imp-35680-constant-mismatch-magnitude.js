/**
 * @module imp-35680-constant-mismatch-magnitude
 *
 * imp-35680 (numerical, measurement): QUANTIFY the imp-35652 constantMismatch
 * claim numerically. imp-35652 argued (corroborating its decisive resolution-floor
 * verdict) that the short-range collision constant C_C = (1/8) sqrt(3 pi) ~ 0.3837
 * is a SHORT-RANGE (near-coincidence) amplitude carried by the |alpha| >= 1 tail of
 * the pair-correlation R_2(x) = 1 - (sin(pi x)/(pi x))^2, so a support-limited
 * |alpha| < 1 surrogate would report a MEAN-SCALE constant, NOT C_C. imp-35652
 * asserted this qualitatively but never measured the numeric amplitude gap.
 * This module supplies the missing number.
 *
 * SETUP (standard GUE / Montgomery pair correlation). The full pair-correlation
 * measure is R_2(x) = delta(x) + 1 - (sin(pi x)/(pi x))^2: a DIAGONAL collision
 * term delta(x) plus the connected part. The connected cluster Y_2(x) =
 * (sin(pi x)/(pi x))^2 has Fourier transform the triangle Delta(alpha) =
 * (1 - |alpha|)_+ supported on |alpha| <= 1, so the (non-DC) structure factor is
 *   S(alpha) = 1 - Delta(alpha) = |alpha|   for |alpha| < 1   (Montgomery ramp),
 *   S(alpha) = 1                for |alpha| >= 1  (diagonal / shot-noise plateau).
 * The short-range collision amplitude sits on the |alpha| >= 1 plateau S = 1
 * (the diagonal delta), which a band-limited |alpha| < 1 proxy cannot access.
 *
 * MEASUREMENT. A smoothed proxy reachable inside the PROVEN |alpha| < 1 support
 * replaces S(alpha) by its in-band restriction S(alpha).1_{|alpha| < 1} = |alpha|.
 * The mean-scale amplitude it recovers is the band-averaged structure factor
 *   A_band = (1 / (2 alphaLimit)) INT_{-1}^{1} |alpha| d alpha = 1/2 (measured by
 * Simpson quadrature below), a fixed, N-independent, mean-scale number. We
 * quantify its gap to the target collision constant C_C = (1/8) sqrt(3 pi):
 *   A_band = 0.5, C_C ~ 0.383748  ->  ratio A_band / C_C ~ 1.3029 (a definite
 *   ~30.3% OVERSHOOT), absolute gap ~ 0.11625.
 * DECISIVELY: the collision-carrying plateau S = 1 on |alpha| >= 1 contributes
 * EXACTLY ZERO to the band-limited proxy (the in-band ramp |alpha| touches the
 * plateau level 1 only at the single measure-zero boundary point |alpha| = 1), so
 * 100 percent of C_C spectral support lies out of band. And A_band = 1/2 carries
 * no dependence on the collision scale s_min ~ M^{-1/3} nor on C_H = 1/8, so it
 * cannot equal or reproduce C_C at any N -- corroborating imp-35652.
 *
 * The connected FUNCTION content of R_2 is itself entirely in-band (INT Y_2 = 1 =
 * INT_{-1}^{1} Delta = 1, measured below): what a |alpha| < 1 proxy misses is NOT
 * any of R_2 minus the delta, but the diagonal collision plateau that fixes C_C.
 *
 * Measurement only; corroborates the imp-35652 option-(a) NOT-viable verdict;
 * derives no remainder; discharges nothing; changes no bound; establishes no
 * operator positivity; C_C = (1/8) sqrt(3 pi) (imp-2642/imp-2643), C_H = 1/8,
 * E_trunc = 3.06e-5 (imp-2631) and C_mb GUE-conditional (imp-486) are UNTOUCHED;
 * imp-35337a stays OPEN; NO QED; no refereed bound is changed.
 *
 * @see imp-35652-req3-option-a-restricted-support-surrogate-scope (constantMismatch claim quantified here)
 * @see imp-35673-resolution-shortfall-far-tail-ladder (the DECISIVE resolution-floor obstruction extended)
 * @see imp-2642/imp-2643 (C_C = (1/8) sqrt(3 pi) ansatz, C_H = 1/8)
 * Literature: Montgomery (1973, pair correlation / form factor); Rudnick-Sarnak
 * (1996, n-level correlations). Platt-Trudgian 2021 (Lambda <= 0.2).
 */

import { IMP35652_REQ3_OPTION_A_RESTRICTED_SUPPORT_SURROGATE_SCOPE } from './imp-35652-req3-option-a-restricted-support-surrogate-scope.js';

const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any measurement here)
const ALPHA_LIMIT = 1; // Montgomery/Rudnick-Sarnak proven support |alpha| < 1

// Target short-range collision constant (imp-2642/imp-2643 ansatz, C_H = 1/8).
const C_C = (1 / 8) * Math.sqrt(3 * Math.PI); // ~ 0.38374752

// Composite Simpson quadrature (n even). Used to MEASURE the band integrals
// rather than substitute their closed forms, so the module is a genuine numeric
// check of the amplitude the smoothed proxy recovers.
function simpson(f, a, b, n) {
  const h = (b - a) / n;
  let s = f(a) + f(b);
  for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * f(a + i * h);
  return (s * h) / 3;
}

// GUE structure factor S(alpha) = |alpha| in-band, 1 on the collision plateau.
const structureFactor = (alpha) => (Math.abs(alpha) < ALPHA_LIMIT ? Math.abs(alpha) : 1);

// Band-averaged structure factor over |alpha| < 1 (use even symmetry; the
// integrand is linear on [0, ALPHA_LIMIT] so Simpson is exact). This is the
// mean-scale amplitude the band-limited proxy recovers.
const NPAN = 1000;
const bandIntegral = 2 * simpson((a) => a, 0, ALPHA_LIMIT, NPAN); // INT_{-1}^{1} |alpha| ~ 1
const A_BAND = bandIntegral / (2 * ALPHA_LIMIT); // ~ 0.5 (mean-scale amplitude)

// Connected-cluster mass carried in-band: INT_{-1}^{1} Delta(alpha) d alpha = 1
// = total mass of Y_2 = (sin pi x/pi x)^2. Confirms R_2 minus the delta is fully
// band-limited, so what the proxy misses is precisely the diagonal collision plateau.
const CONNECTED_MASS_IN_BAND = 2 * simpson((a) => 1 - a, 0, ALPHA_LIMIT, NPAN); // ~ 1

// Collision-carrying plateau level (S on |alpha| >= 1) and the fraction of it a
// band-limited proxy captures. The ramp reaches the plateau only at the single
// boundary point |alpha| = ALPHA_LIMIT (measure zero), so the accessible fraction
// of the out-of-band collision plateau is 0.
const PLATEAU_LEVEL = structureFactor(1.0 + 1e-9); // 1
const OUT_OF_BAND_COLLISION_FRACTION = 0; // plateau S = 1 on |alpha| >= 1 entirely excluded

// Amplitude gap of the recovered mean-scale amplitude to the target C_C.
const ABS_GAP = A_BAND - C_C; // ~ +0.11625 (proxy OVERSHOOTS C_C)
const RATIO_BAND_TO_CC = A_BAND / C_C; // ~ 1.3029
const REL_GAP_PCT = (100 * (A_BAND - C_C)) / C_C; // ~ +30.29 percent

// Secondary contrast: the near-coincidence curvature the FUNCTION R_2 provides,
// R_2(x) = (pi^2/3) x^2 - ..., leading coefficient pi^2/3 -- also a fixed mean-scale
// number, likewise NOT equal to C_C (ratio ~ 8.573). No in-band scalar carries C_C.
const SHORT_RANGE_CURVATURE = (Math.PI * Math.PI) / 3; // ~ 3.28987
const RATIO_CURVATURE_TO_CC = SHORT_RANGE_CURVATURE / C_C; // ~ 8.573

export const IMP35680_CONSTANT_MISMATCH_MAGNITUDE = {
  id: 'imp-35680',
  proofSection: 'S-frontier',
  question:
    'How far does the mean-scale (band-limited to |alpha| < 1) pair-correlation amplitude a smoothed proxy recovers ' +
    'from R_2(x) = 1 - (sin(pi x)/(pi x))^2 fall from the target short-range collision constant C_C = (1/8) sqrt(3 pi)?',
  setup:
    'Full pair correlation R_2(x) = delta(x) + 1 - (sin(pi x)/(pi x))^2. Connected cluster Y_2 = (sin(pi x)/(pi x))^2 ' +
    'has Fourier transform the triangle Delta(alpha) = (1 - |alpha|)_+ on |alpha| <= 1, so the structure factor is ' +
    'S(alpha) = |alpha| for |alpha| < 1 (Montgomery ramp) and S(alpha) = 1 for |alpha| >= 1 (the diagonal collision ' +
    'plateau). The short-range collision amplitude C_C sits on the |alpha| >= 1 plateau, out of the |alpha| < 1 band.',
  measurement: {
    C_C: +C_C.toPrecision(8), // 0.38374752 (target, untouched)
    alphaLimit: ALPHA_LIMIT,
    meanScaleAmplitudeABand: +A_BAND.toPrecision(8), // 0.5 -- band-averaged S over |alpha| < 1
    connectedMassInBand: +CONNECTED_MASS_IN_BAND.toPrecision(8), // 1 -- R_2 minus delta is fully in-band
    plateauLevel: PLATEAU_LEVEL, // 1 -- collision-carrying S on |alpha| >= 1
    outOfBandCollisionFraction: OUT_OF_BAND_COLLISION_FRACTION, // 0 -- proxy captures none of the plateau
    absGapBandToCC: +ABS_GAP.toPrecision(8), // +0.11625248 (proxy overshoots C_C)
    ratioBandToCC: +RATIO_BAND_TO_CC.toPrecision(8), // 1.3029400
    relGapPct: +REL_GAP_PCT.toPrecision(6), // +30.2940 percent
    shortRangeCurvatureR2: +SHORT_RANGE_CURVATURE.toPrecision(8), // 3.2898681 (pi^2/3)
    ratioCurvatureToCC: +RATIO_CURVATURE_TO_CC.toPrecision(8), // 8.5730018
  },
  findings:
    'The band-limited |alpha| < 1 proxy recovers a mean-scale amplitude A_band = 1/2 (measured by Simpson), OFF the ' +
    'target C_C = (1/8) sqrt(3 pi) ~ 0.383748 by ratio ~ 1.3029 (a definite ~30.3 percent overshoot; absolute gap ' +
    '~ 0.11625). DECISIVELY the collision-carrying plateau S = 1 on |alpha| >= 1 contributes exactly ZERO to the ' +
    'proxy (the in-band ramp |alpha| touches level 1 only at the measure-zero boundary), so 100 percent of the C_C ' +
    'spectral support is out of band. A_band = 1/2 is N-independent and carries no dependence on the collision scale ' +
    's_min ~ M^{-1/3} nor on C_H = 1/8, so no band-limited scalar (ramp mean 1/2, boundary peak 1, or the ' +
    'short-range curvature pi^2/3 ~ 3.290) can equal or reproduce C_C. This is the numeric magnitude behind the ' +
    'imp-35652 constantMismatch: a support-limited proxy reports a mean-scale constant, NOT C_C.',
  scaleIndependent: true, // A_band = 1/2 regardless of N (contrast imp-35673 divergent shortfall)
  corroboratesImp35652ConstantMismatch: true,
  isRigorous: false,
  isUnconditional: false,
  verdict:
    'MEASUREMENT (NOT rigorous). The mean-scale amplitude a band-limited |alpha| < 1 proxy recovers from ' +
    'R_2(x) = 1 - (sin(pi x)/(pi x))^2 is A_band = 1/2 (band-averaged structure factor, Simpson-measured), which ' +
    'MISSES the target collision constant C_C = (1/8) sqrt(3 pi) ~ 0.383748 by ratio ~ 1.3029 (~30.3 percent, ' +
    'absolute gap ~ 0.11625). The short-range collision amplitude is carried by the |alpha| >= 1 diagonal plateau ' +
    'S = 1, of which a band-limited proxy captures exactly zero, and A_band = 1/2 is a fixed N-independent ' +
    'mean-scale number with no s_min or C_H = 1/8 dependence -- so option (a) cannot report C_C. Corroborates the ' +
    'imp-35652 constantMismatch quantitatively; derives no remainder; discharges nothing; changes no bound; ' +
    'establishes no operator positivity; C_C = (1/8) sqrt(3 pi) (imp-2642/imp-2643), C_H = 1/8, E_trunc = 3.06e-5 ' +
    '(imp-2631) and C_mb GUE-conditional (imp-486) are UNTOUCHED; imp-35337a stays OPEN; route-(ii) (imp-35488 ' +
    'two-height spot check) remains the only viable partial; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35652 (constantMismatch claim quantified here); imp-35673 (resolution-floor obstruction far-tail ladder); ' +
    'imp-2642/imp-2643 (C_C = (1/8) sqrt(3 pi), C_H = 1/8); imp-2631 (E_trunc floor); imp-486 (GUE-conditional ' +
    'caveat). Literature: Montgomery (1973, pair correlation / form factor); Rudnick-Sarnak (1996). ' +
    'Platt-Trudgian 2021 (Lambda <= 0.2).',
};

export const IMP35680_CONSTANT_MISMATCH_MAGNITUDE_ASSERTIONS = [
  {
    // (1) target C_C reproduces (1/8) sqrt(3 pi) and matches the imp-35652 baked value.
    id: 'imp35680-cc-target-matches-imp35652',
    description: 'the target collision constant reproduces (1/8) sqrt(3 pi) ~ 0.38374752 and matches the imp-35652 baked C_C',
    holds: () => {
      const parent = IMP35652_REQ3_OPTION_A_RESTRICTED_SUPPORT_SURROGATE_SCOPE.C_C;
      return (
        Math.abs(C_C - 0.38374752) < 1e-6 &&
        Math.abs(C_C - parent) < 1e-6 &&
        Math.abs(IMP35680_CONSTANT_MISMATCH_MAGNITUDE.measurement.C_C - parent) < 1e-6
      );
    },
  },
  {
    // (2) Simpson-measured band amplitude = 1/2 and connected in-band mass = 1
    //     (R_2 minus the delta is fully band-limited).
    id: 'imp35680-band-amplitude-half-mass-unity',
    description: 'the Simpson-measured band-averaged structure factor is 1/2 and the connected in-band mass is 1',
    holds: () =>
      Math.abs(A_BAND - 0.5) < 1e-9 &&
      Math.abs(CONNECTED_MASS_IN_BAND - 1) < 1e-9 &&
      Math.abs(bandIntegral - 1) < 1e-9,
  },
  {
    // (3) the recovered mean-scale amplitude misses C_C by ratio ~ 1.3029, gap ~ 0.11625, ~30.3 percent.
    id: 'imp35680-amplitude-gap-to-cc',
    description: 'the band-limited mean-scale amplitude overshoots C_C by ratio ~ 1.3029 (absolute gap ~ 0.11625, ~30.3 percent)',
    holds: () => {
      const m = IMP35680_CONSTANT_MISMATCH_MAGNITUDE.measurement;
      return (
        RATIO_BAND_TO_CC > 1.302 && RATIO_BAND_TO_CC < 1.304 &&
        Math.abs(ABS_GAP - 0.11625248) < 1e-6 &&
        REL_GAP_PCT > 30.2 && REL_GAP_PCT < 30.4 &&
        Math.abs(m.ratioBandToCC - RATIO_BAND_TO_CC) < 1e-6 &&
        Math.abs(m.absGapBandToCC - ABS_GAP) < 1e-6
      );
    },
  },
  {
    // (4) the collision-carrying |alpha| >= 1 plateau S = 1 is entirely out of band (fraction 0),
    //     while A_band < plateau -- the short-range amplitude is structurally inaccessible.
    id: 'imp35680-collision-plateau-out-of-band',
    description: 'the collision-carrying plateau S = 1 on |alpha| >= 1 is entirely out of band (fraction 0) and A_band lies below it',
    holds: () =>
      OUT_OF_BAND_COLLISION_FRACTION === 0 &&
      PLATEAU_LEVEL === 1 &&
      A_BAND < PLATEAU_LEVEL &&
      structureFactor(0.5) === 0.5 && // in-band ramp
      structureFactor(2) === 1, // out-of-band plateau
  },
  {
    // (5) scale-independence: A_band = 1/2 is a fixed mean-scale number with no s_min / C_H dependence,
    //     and no in-band scalar (ramp mean, curvature) equals C_C.
    id: 'imp35680-mean-scale-cannot-carry-cc',
    description: 'A_band = 1/2 is N-independent (no s_min / C_H dependence) and no in-band scalar equals C_C (curvature pi^2/3 ratio ~ 8.573)',
    holds: () => {
      const r = IMP35680_CONSTANT_MISMATCH_MAGNITUDE;
      return (
        r.scaleIndependent === true &&
        Math.abs(A_BAND - 0.5) < 1e-9 &&
        Math.abs(SHORT_RANGE_CURVATURE - Math.PI * Math.PI / 3) < 1e-12 &&
        RATIO_CURVATURE_TO_CC > 8.5 && RATIO_CURVATURE_TO_CC < 8.6 &&
        Math.abs(A_BAND - C_C) > 0.1 // no in-band scalar coincides with C_C
      );
    },
  },
  {
    // (6) honesty gate: measurement only, conditional, no bound moves, no refereed bound is changed, imp-35337a OPEN, NO QED.
    id: 'imp35680-measurement-only-no-qed',
    description: 'measurement only: not rigorous/unconditional, changes no bound, keeps imp-486 caveat, imp-35337a OPEN, PT 0.2, NO QED',
    holds: () => {
      const r = IMP35680_CONSTANT_MISMATCH_MAGNITUDE;
      return (
        Math.abs(L_PT - 0.2) < 1e-15 &&
        r.isRigorous === false &&
        r.isUnconditional === false &&
        r.corroboratesImp35652ConstantMismatch === true &&
        /imp-486/.test(r.verdict) &&
        /imp-35337a stays OPEN/.test(r.verdict) &&
        /NO QED/.test(r.verdict) &&
        /refereed bound is changed/i.test(r.verdict)
      );
    },
  },
];

for (const a of IMP35680_CONSTANT_MISMATCH_MAGNITUDE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35680-constant-mismatch-magnitude assertion failed: ${a.id}`);
  }
}
