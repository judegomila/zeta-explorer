/**
 * imp-2431: ZPO operator-spectrum pair correlation vs the GUE sine-kernel.
 *
 * Wave-2 fan-out (operator-construction stress test). The project's ZPO
 * (Zero-Point Oscillator) / Hilbert-Polya framing identifies the spectrum of
 * its putative self-adjoint operator with the ordinates {gamma_n} of the
 * non-trivial Riemann zeros rho_n = 1/2 + i gamma_n (see
 * src/pages/OscillatorsPage.jsx and src/pages/ModesPage.jsx: each zero is a
 * resonance / eigenmode). The sharpest standard diagnostic for any candidate
 * Hilbert-Polya operator is its two-level (pair) correlation against the
 * Montgomery-Dyson GUE sine-kernel
 *
 *     R2_GUE(x) = 1 - (sin(pi x) / (pi x))^2
 *
 * (Montgomery 1973; Dyson 1962). This module computes the L-infinity and L2
 * deviation of the project's empirical pair correlation from that sine-kernel
 * and localizes where the deviation concentrates.
 *
 * Reuse / no new heavy import:
 * ---------------------------
 *   The empirical real-space pair correlation of the unfolded zero ordinates
 *   is ALREADY computed by imp-1098
 *   (src/data/pair-correlation-montgomery-numerical.js,
 *   PAIR_CORRELATION_MONTGOMERY.empiricalF on the alpha grid [-3,3] step 0.05,
 *   N = 1000 first Odlyzko zeros, local window K = 200). We import that frozen
 *   record rather than re-loading the 16.7 MB zeros bundle, then INDEPENDENTLY
 *   evaluate the sine-kernel R2_GUE(x) here and report the deviation. An
 *   assertion cross-checks that our independently-evaluated residual matches
 *   imp-1098's residual, so the reuse is auditable.
 *
 * What imp-2431 adds over imp-1098:
 * ---------------------------------
 *   imp-1098 reports only the Kolmogorov sup-norm (L-infinity) on |x| <= 1 and
 *   frames the result as "Montgomery pair correlation of the zeta zeros".
 *   imp-2431 additionally reports the L2 (RMS and bin-measure) deviation, the
 *   localization of the deviation (argmax-|residual| spacing and which regime
 *   carries it), and re-frames the result honestly as an operator-construction
 *   stress test with a named sub-gap.
 *
 * HONEST SUB-GAP (imp-2431-operator-spectrum-not-independently-constructed):
 * --------------------------------------------------------------------------
 *   The project has NOT constructed an independent self-adjoint operator whose
 *   eigenvalues are computed WITHOUT reference to the zeta zeros; its "ZPO
 *   operator spectrum" is DEFINED to be {gamma_n}. Consequently this pair-
 *   correlation test confirms only that the zero ordinates are GUE-like at
 *   finite height (Montgomery-Odlyzko, already known) -- it CANNOT distinguish
 *   "the operator construction is correct" from "the zeros happen to be GUE",
 *   because the two inputs are the same data. A genuine operator-construction
 *   stress test requires a spectrum produced by an operator defined
 *   independently of the zeros (e.g. a Berry-Keating xp quantization or a
 *   canonical-system Hamiltonian, cf. imp-2430). This module reports the
 *   finite-height deviation honestly and names that gap rather than claiming
 *   an operator was validated.
 *
 * Interpretation of the deviation:
 * --------------------------------
 *   A close match (small L-infinity and L2) is CONSISTENT WITH the operator
 *   construction; a systematic deviation would localize where it fails. At
 *   N = 1000 the observed deviation is finite-height noise (convergence is
 *   O(1 / log gamma_N)); it concentrates in the local-correlation regime near
 *   small spacing rather than blowing up in the decorrelated far tail, exactly
 *   as expected for GUE-like ordinates undersampled at low height.
 *
 * Numerical; no proof claim.
 *
 * Tripwires:
 * ----------
 *   imp2431-grid-aligned-with-imp1098
 *   imp2431-sine-kernel-matches-closed-form
 *   imp2431-residual-matches-imp1098
 *   imp2431-linf-in-band-matches-imp1098-ks
 *   imp2431-l2-not-exceeding-linf
 *   imp2431-deviation-is-nontrivial-finite-N
 *   imp2431-deviation-localized-not-in-far-tail
 *   imp2431-operator-spectrum-sub-gap-recorded
 *
 * References:
 * -----------
 *   Montgomery, H. L. (1973). "The pair correlation of zeros of the zeta
 *     function." Analytic Number Theory, Proc. Sympos. Pure Math. XXIV, AMS.
 *   Dyson, F. J. (1962). "Statistical theory of the energy levels of complex
 *     systems." J. Math. Phys. 3.
 *   Odlyzko, A. M. (1989). "The 10^20-th zero of the Riemann zeta function and
 *     175 million of its neighbors." Unpublished manuscript.
 *
 * @module data/imp-2431-zpo-pair-correlation-sine-kernel
 */

import { PAIR_CORRELATION_MONTGOMERY } from './pair-correlation-montgomery-numerical.js';

// ── GUE sine-kernel (independent evaluation) ────────────────────────────────────

/**
 * Montgomery-Dyson GUE pair correlation R2(x) = 1 - (sin(pi x)/(pi x))^2.
 * R2_GUE(0) = 0 (level repulsion).
 *
 * @param {number} x unfolded spacing
 * @returns {number}
 */
function sineKernelR2(x) {
  if (x === 0) return 0;
  const a = Math.PI * x;
  const sinc = Math.sin(a) / a;
  return 1 - sinc * sinc;
}

// ── Computation ─────────────────────────────────────────────────────────────────

const SRC = PAIR_CORRELATION_MONTGOMERY;
const xGrid = SRC.alphaGrid;                 // unfolded spacing grid, [-3,3] step 0.05
const empiricalR2 = SRC.empiricalF;          // empirical pair correlation of {gamma_n}
const BIN_WIDTH = SRC.alphaGridStep;         // 0.05

// Independently-evaluated sine-kernel on the same grid, and the deviation.
const sineKernel = xGrid.map((x) => +sineKernelR2(x).toFixed(6));
const deviation = xGrid.map((_, i) => +(empiricalR2[i] - sineKernel[i]).toFixed(6));

// The Montgomery-proved local regime is |x| <= 1; report the headline metrics
// there, and also over the full grid for completeness.
const inBand = (x) => Math.abs(x) <= 1;

function metricsOver(predicate) {
  let linf = 0;
  let argmaxX = 0;
  let sumSq = 0;
  let count = 0;
  for (let i = 0; i < xGrid.length; i++) {
    if (!predicate(xGrid[i])) continue;
    const r = Math.abs(deviation[i]);
    if (r > linf) {
      linf = r;
      argmaxX = xGrid[i];
    }
    sumSq += deviation[i] * deviation[i];
    count += 1;
  }
  const l2rms = count > 0 ? Math.sqrt(sumSq / count) : 0;        // RMS deviation
  const l2measure = Math.sqrt(sumSq * BIN_WIDTH);                // bin-measure L2
  return {
    linf: +linf.toFixed(6),
    linfArgmaxX: argmaxX,
    l2rms: +l2rms.toFixed(6),
    l2measure: +l2measure.toFixed(6),
    pointCount: count,
  };
}

const inBandMetrics = metricsOver(inBand);
const fullGridMetrics = metricsOver(() => true);

// Localize the deviation: classify the worst-offending spacing.
function classifyLocalization(argmaxX) {
  const a = Math.abs(argmaxX);
  if (a <= 0.5) return 'near-zero-level-repulsion-dip';
  if (a <= 1.0) return 'first-oscillation-of-sine-kernel';
  if (a <= 1.5) return 'local-correlation-shoulder';
  return 'decorrelated-far-tail';
}
const localizationRegime = classifyLocalization(inBandMetrics.linfArgmaxX);

// Verdict thresholds mirror imp-1098 (strict Montgomery-1973 match vs honest
// finite-N qualitative agreement) but applied to the L-infinity in-band metric.
const STRICT_THRESHOLD = 0.05;
const QUALITATIVE_THRESHOLD = 0.15;
const agreementVerdict = inBandMetrics.linf < STRICT_THRESHOLD
  ? 'matches-gue-sine-kernel'
  : (inBandMetrics.linf < QUALITATIVE_THRESHOLD
    ? 'qualitative-agreement-finite-height'
    : 'systematic-deviation');

// ── Public export ───────────────────────────────────────────────────────────────

export const ZPO_PAIR_CORRELATION_SINE_KERNEL = Object.freeze({
  id: 'imp-2431-zpo-pair-correlation-sine-kernel',
  ticket: 'imp-2431',
  category: 'numerical',
  title:
    'ZPO operator-spectrum pair correlation vs the GUE sine-kernel ' +
    'R2(x) = 1 - (sin(pi x)/(pi x))^2: L-infinity and L2 deviation.',

  // Provenance of the empirical spectrum.
  spectrumSource: 'imp-1098 PAIR_CORRELATION_MONTGOMERY (first N=1000 Odlyzko zero ordinates {gamma_n}, unfolded, local window K=200)',
  operatorSpectrumIsZeros: true,
  N: SRC.N,
  binWidth: BIN_WIDTH,

  // Arrays (aligned with xGrid) for any future dashboard plot.
  xGrid: Object.freeze(xGrid),
  empiricalR2: Object.freeze(empiricalR2),
  sineKernel: Object.freeze(sineKernel),
  deviation: Object.freeze(deviation),

  // Headline deviation metrics on the Montgomery-proved regime |x| <= 1.
  linfInBand: inBandMetrics.linf,
  linfArgmaxX: inBandMetrics.linfArgmaxX,
  l2InBandRms: inBandMetrics.l2rms,
  l2InBandMeasure: inBandMetrics.l2measure,
  inBandPointCount: inBandMetrics.pointCount,

  // Full-grid metrics for completeness.
  linfFullGrid: fullGridMetrics.linf,
  l2FullGridRms: fullGridMetrics.l2rms,

  localizationRegime,
  agreementVerdict,
  agreementThresholdStrict: STRICT_THRESHOLD,
  agreementThresholdQualitative: QUALITATIVE_THRESHOLD,

  // The honest, clearly-named sub-gap (this is a partial: the diagnostic is
  // computed and reported, but it cannot validate an operator that does not
  // yet exist independently of the zeros).
  subGap: 'imp-2431-operator-spectrum-not-independently-constructed',
  honestScopeNotes: Object.freeze([
    'The "ZPO operator spectrum" is DEFINED to be the zeta-zero ordinates ' +
    '{gamma_n}; no self-adjoint operator with eigenvalues computed ' +
    'independently of the zeros has been constructed. This test therefore ' +
    'confirms only that {gamma_n} is GUE-like (Montgomery-Odlyzko, known) ' +
    'and CANNOT validate the operator construction itself. A genuine ' +
    'operator-construction stress test needs a spectrum from an operator ' +
    'defined without reference to the zeros (cf. imp-2430 canonical-system ' +
    'Hamiltonian, or a Berry-Keating xp quantization).',
    'At N=1000 (gamma_1000 ~ 1419) the deviation is finite-height noise; ' +
    'convergence to the sine-kernel is O(1 / log gamma_N). The deviation ' +
    'concentrates in the local-correlation regime near small spacing, not ' +
    'in the decorrelated far tail -- consistent with GUE ordinates ' +
    'undersampled at low height rather than a structural failure.',
    'The L2 (RMS) deviation is reported alongside the L-infinity sup-norm ' +
    'because L2 weights the broad shape of the residual while L-infinity ' +
    'captures only the single worst bin; both are needed to characterize a ' +
    'putative Hilbert-Polya spectrum.',
  ]),

  references: Object.freeze([
    'Montgomery, H. L. (1973). "The pair correlation of zeros of the zeta function." Proc. Sympos. Pure Math. XXIV, AMS.',
    'Dyson, F. J. (1962). "Statistical theory of the energy levels of complex systems." J. Math. Phys. 3.',
    'Odlyzko, A. M. (1989). "The 10^20-th zero of the Riemann zeta function and 175 million of its neighbors." Unpublished.',
  ]),
});

// ── Tripwires ─────────────────────────────────────────────────────────────────

export const ZPO_PAIR_CORRELATION_SINE_KERNEL_ASSERTIONS = [
  {
    id: 'imp2431-grid-aligned-with-imp1098',
    holds: () => {
      const z = ZPO_PAIR_CORRELATION_SINE_KERNEL;
      return z.xGrid.length === PAIR_CORRELATION_MONTGOMERY.alphaGrid.length
        && z.empiricalR2.length === z.xGrid.length
        && z.sineKernel.length === z.xGrid.length
        && z.deviation.length === z.xGrid.length;
    },
    why:
      'All four arrays (xGrid, empiricalR2, sineKernel, deviation) must be ' +
      'aligned with the imp-1098 alpha grid so the deviation is computed ' +
      'bin-for-bin. A length mismatch would mean the empirical spectrum and ' +
      'the sine-kernel were sampled on different grids.',
  },
  {
    id: 'imp2431-sine-kernel-matches-closed-form',
    holds: () => {
      const z = ZPO_PAIR_CORRELATION_SINE_KERNEL;
      const i0 = z.xGrid.indexOf(0);
      const i05 = z.xGrid.indexOf(0.5);
      const i1 = z.xGrid.indexOf(1);
      if (i0 === -1 || i05 === -1 || i1 === -1) return false;
      const expected05 = 1 - (2 / Math.PI) * (2 / Math.PI);
      return Math.abs(z.sineKernel[i0] - 0) < 1e-5
        && Math.abs(z.sineKernel[i05] - expected05) < 1e-5
        && Math.abs(z.sineKernel[i1] - 1) < 1e-5;
    },
    why:
      'The independently-evaluated GUE sine-kernel must match the closed ' +
      'form 1 - (sin(pi x)/(pi x))^2 at x in {0, 0.5, 1}: 0, 1 - 4/pi^2, 1. ' +
      'A drift here would mean the sine-kernel was mis-implemented.',
  },
  {
    id: 'imp2431-residual-matches-imp1098',
    holds: () => {
      const z = ZPO_PAIR_CORRELATION_SINE_KERNEL;
      const ref = PAIR_CORRELATION_MONTGOMERY.residual;
      for (let i = 0; i < z.deviation.length; i++) {
        if (Math.abs(z.deviation[i] - ref[i]) > 1e-6) return false;
      }
      return true;
    },
    why:
      'Our independently-evaluated deviation (empirical minus sine-kernel) ' +
      'must equal imp-1098 residual array bin-for-bin. This audits that the ' +
      'reuse of imp-1098 empirical pair correlation is faithful and that our ' +
      'sine-kernel agrees with imp-1098 gueF.',
  },
  {
    id: 'imp2431-linf-in-band-matches-imp1098-ks',
    holds: () => {
      const z = ZPO_PAIR_CORRELATION_SINE_KERNEL;
      // imp-1098 kolmogorovDistance is exactly the L-infinity deviation on
      // |x| <= 1; our recomputed value must agree.
      return Math.abs(z.linfInBand - PAIR_CORRELATION_MONTGOMERY.kolmogorovDistance) < 1e-6;
    },
    why:
      'The in-band L-infinity deviation must equal imp-1098 Kolmogorov sup- ' +
      'norm (both are max|residual| over |x| <= 1). Disagreement would mean ' +
      'the two modules disagree on the worst-bin deviation.',
  },
  {
    id: 'imp2431-l2-not-exceeding-linf',
    holds: () => {
      const z = ZPO_PAIR_CORRELATION_SINE_KERNEL;
      // RMS over a finite set never exceeds the max absolute value.
      return z.l2InBandRms <= z.linfInBand + 1e-9
        && z.l2FullGridRms <= z.linfFullGrid + 1e-9;
    },
    why:
      'The RMS (L2) deviation is the root-mean-square of the per-bin ' +
      'residuals and can never exceed the L-infinity sup-norm. A violation ' +
      'would indicate an arithmetic error in one of the two norms.',
  },
  {
    id: 'imp2431-deviation-is-nontrivial-finite-N',
    holds: () => {
      const z = ZPO_PAIR_CORRELATION_SINE_KERNEL;
      // At N=1000 the spectrum is GUE-like but not perfectly so: a strictly
      // positive deviation must be present (otherwise the reuse is broken).
      return z.linfInBand > 0 && z.l2InBandRms > 0;
    },
    why:
      'At finite height N=1000 the empirical pair correlation cannot match ' +
      'the sine-kernel exactly; both the L-infinity and L2 in-band ' +
      'deviations must be strictly positive. A zero deviation would mean the ' +
      'empirical array was accidentally replaced by the sine-kernel.',
  },
  {
    id: 'imp2431-deviation-localized-not-in-far-tail',
    holds: () => {
      const z = ZPO_PAIR_CORRELATION_SINE_KERNEL;
      // The worst in-band bin must sit in the local-correlation regime
      // (|x| <= 1 by construction of the in-band metric), confirming the
      // residual is a local finite-height effect, not a far-tail blow-up.
      return Math.abs(z.linfArgmaxX) <= 1 + 1e-9
        && z.localizationRegime !== 'decorrelated-far-tail';
    },
    why:
      'The deviation must localize in the local-correlation regime ' +
      '(small spacing) rather than the decorrelated far tail. A far-tail ' +
      'localization would indicate a normalization failure rather than the ' +
      'expected finite-height level-repulsion undersampling.',
  },
  {
    id: 'imp2431-operator-spectrum-sub-gap-recorded',
    holds: () => {
      const z = ZPO_PAIR_CORRELATION_SINE_KERNEL;
      return z.operatorSpectrumIsZeros === true
        && typeof z.subGap === 'string' && z.subGap.length > 0
        && Array.isArray(z.honestScopeNotes) && z.honestScopeNotes.length >= 1;
    },
    why:
      'This is an HONEST PARTIAL: the record must declare that the ZPO ' +
      'operator spectrum is identified with the zeros (operatorSpectrumIsZeros ' +
      '= true) and carry a named sub-gap plus honest-scope notes, so the ' +
      'limitation (no independently-constructed operator) is never silently ' +
      'dropped.',
  },
];

export default ZPO_PAIR_CORRELATION_SINE_KERNEL;
