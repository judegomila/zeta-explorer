/**
 * @module imp-2867-t0-certified-enclosure
 *
 * imp-2867 (medium, meta): Shared certified interval primitive for the T0
 * enclosure at N* = 1e4.
 *
 * imp-2704 (C_F interval certificate) and imp-2709 (kappa_T interval
 * certificate) both use T0 = effectiveHeightForN(1e4) as a shared foundation.
 * imp-2704 re-derives the count-monotonicity straddle inline; extracting it here
 * gives a single trusted source for the [T0_lo, T0_hi] bracket and removes
 * the risk of drift between copies.
 *
 * The certified enclosure is established by the count-monotonicity straddle:
 * N(T) = (T/2pi)(log(T/2pi) - 1) is strictly increasing for T > 2pi*e, so
 * [T0_lo, T0_hi] encloses the Riemann-von Mangoldt root N(T)=N* iff
 * N(T0_lo) < N* < N(T0_hi).
 *
 * Assertions:
 *   (A) The straddle holds: N(T0_lo) < 1e4 < N(T0_hi).
 *   (B) T0_lo > 2pi*e — monotone regime guarantee.
 *   (C) Consistency: the T0 enclosure values carried in imp-2704 match the
 *       shared primitive (within float64 round-trip tolerance).
 *   (D) The shared T0_lo is above the kappa_T verified height (3000) used by
 *       imp-2709, confirming the higher operating point.
 *
 * HONEST DESIGN
 * -------------
 * This module produces only the T0 enclosure. It does NOT duplicate the C_F
 * or kappa_T calculations — those remain owned by their respective modules.
 * Existing modules' literals are left intact; consistency is verified via
 * cross-assertions here, not by modifying those files.
 *
 * @see imp-2704-cf-interval-certificate (C_F certificate, primary consumer)
 * @see imp-2709-kappa-t-interval-certificate (kappa_T at T0=3000, cross-check)
 * @see lambda-rh-height-mapping (effectiveHeightForN, zeroCountAtHeight)
 */

import { effectiveHeightForN, zeroCountAtHeight } from './lambda-rh-height-mapping.js';
import { IMP2704_CF_INTERVAL_CERTIFICATE } from './imp-2704-cf-interval-certificate.js';
import { IMP2709_KAPPA_T_INTERVAL_CERTIFICATE } from './imp-2709-kappa-t-interval-certificate.js';

const TWO_PI = 2 * Math.PI;
const N_STAR = 1e4;

// ── Certified T0 enclosure via count-monotonicity straddle ───────────────────
// gamma_N ~ 9.879e3 is displayed to 4 significant figures (last shown digit in
// the units place), so the displayed-digit half-width is 0.5. The straddle
// assertion below certifies the bracket regardless of this choice.
const T0_FLOAT = effectiveHeightForN(N_STAR);    // ~9878.8034
const T0_DIGIT_HALFWIDTH = 0.5;
const T0_LO = T0_FLOAT - T0_DIGIT_HALFWIDTH;
const T0_HI = T0_FLOAT + T0_DIGIT_HALFWIDTH;

const N_AT_T0_LO = zeroCountAtHeight(T0_LO);    // < 1e4
const N_AT_T0_HI = zeroCountAtHeight(T0_HI);    // > 1e4

// Straddle witness — the primitive's proof of enclosure.
const STRADDLE_HOLDS = N_AT_T0_LO < N_STAR && N_AT_T0_HI > N_STAR;
const MONOTONE_REGIME = T0_LO > TWO_PI * Math.E;

export const T0_N1E4_CERTIFIED_ENCLOSURE = {
  id: 'imp-2867',
  N_star: N_STAR,
  T0_lo: T0_LO,
  T0_hi: T0_HI,
  T0_float: T0_FLOAT,
  digitHalfwidth: T0_DIGIT_HALFWIDTH,
  straddleWitness: {
    countAtLo: +N_AT_T0_LO.toFixed(4),
    countAtHi: +N_AT_T0_HI.toFixed(4),
    holds: STRADDLE_HOLDS,
  },
  monotoneRegime: MONOTONE_REGIME,
  note:
    'Shared certified T0 enclosure for N*=1e4. The count-monotonicity straddle '
    + 'N(T0_lo) < 1e4 < N(T0_hi) certifies [T0_lo, T0_hi] encloses the '
    + 'Riemann-von Mangoldt root independent of the half-width chosen.',
};

// ── Cross-assertions against existing modules ────────────────────────────────
// imp-2704 carries T0 enclosure values inline; confirm they match the shared primitive.
const IMP2704_T0_ENC = IMP2704_CF_INTERVAL_CERTIFICATE.T0Enclosure;
const IMP2704_T0_LO_MATCHES = Math.abs(IMP2704_T0_ENC.lo - T0_LO) < 1e-12;
const IMP2704_T0_HI_MATCHES = Math.abs(IMP2704_T0_ENC.hi - T0_HI) < 1e-12;

// imp-2709 uses a different T0 (3000 for the kappa_T thin strip); confirm that
// our shared T0 (N*=1e4, ~9878) sits strictly above the kappa_T verified height.
const IMP2709_STRIP_T0 = IMP2709_KAPPA_T_INTERVAL_CERTIFICATE.strip.verifiedHeight_T0; // 3000
const SHARED_T0_ABOVE_STRIP = T0_LO > IMP2709_STRIP_T0;

export const T0_N1E4_CERTIFIED_ENCLOSURE_ASSERTIONS = [
  {
    id: 'imp2867-t0-straddle-holds',
    description:
      'The T0 bracket [T0_lo, T0_hi] encloses the N*=1e4 root: N(T0_lo) < 1e4 < N(T0_hi), ' +
      'certified by the strictly-increasing N(T) count.',
    holds: () => STRADDLE_HOLDS,
  },
  {
    id: 'imp2867-t0-monotone-regime',
    description:
      'T0_lo > 2pi*e — the monotone regime where N(T) = (T/2pi)(log(T/2pi)-1) ' +
      'is strictly increasing, making the straddle proof valid.',
    holds: () => MONOTONE_REGIME,
  },
  {
    id: 'imp2867-t0-matches-imp2704-enclosure',
    description:
      'The shared T0 enclosure matches the values carried inline in ' +
      'imp-2704-cf-interval-certificate (within float64 round-trip tolerance).',
    holds: () => IMP2704_T0_LO_MATCHES && IMP2704_T0_HI_MATCHES,
  },
  {
    id: 'imp2867-t0-above-imp2709-strip-height',
    description:
      'The shared T0 (N*=1e4, ~9878) is strictly above the kappa_T ' +
      'verified-strip height used by imp-2709 (T0=3000), confirming the higher ' +
      'operating point of the N*=1e4 computation.',
    holds: () => SHARED_T0_ABOVE_STRIP,
  },
];

for (const a of T0_N1E4_CERTIFIED_ENCLOSURE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-2867-t0-certified-enclosure assertion failed: ' + a.id);
  }
}
