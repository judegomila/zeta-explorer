/**
 * @module imp-2759-erdos-turan-bridge-constant
 *
 * imp-2682 (high, proof): Bound the Erdos-Turan bridge O(1) constant in the
 * dyson_star_discrepancy axiom -- the GENUINE residual that imp-2641 named
 * after discharging the S(T) growth coefficient to the explicit Trudgian-2014
 * value C_Selberg(S(T)) = 2.622.
 *
 * THE RESIDUAL (from imp-2641)
 * ----------------------------
 * C_KH = pi . C_Selberg consumes C_Selberg as the coefficient of log(gamma_N)
 * in the STAR-DISCREPANCY bound
 *     Disc_N <= C_Selberg . log(gamma_N) / N      (lean4-koksma-hlawka.js, imp-403 sorry-2)
 * This is NOT literally the Selberg S(T) bound: it is the Erdos-Turan
 * inequality applied to the unfolded zeros, with S(T) entering only as a bound
 * on the exponential sums. imp-2641 explicitly flagged that the Erdos-Turan
 * step lumps additional O(1) constants (kernel mass + smoothing length) into
 * the effective coefficient, and that 2.622 is rigorous ONLY as the S(T)
 * growth coefficient -- the identification with the DISCREPANCY coefficient is
 * pending this bridge constant fitting inside the headroom 3.0 - 2.622 = 0.378.
 *
 * THE EXPLICIT ERDOS-TURAN INEQUALITY (sharp Selberg-kernel form)
 * --------------------------------------------------------------
 * Montgomery, "Ten Lectures on the Interface Between Analytic Number Theory and
 * Harmonic Analysis" (CBMS 84, 1994), Ch. 1 (Beurling-Selberg majorant): for
 * any cutoff frequency H >= 1, the star discrepancy of points x_1,...,x_N on
 * the unit circle obeys
 *     D_N* <= 1/(H+1) + sum_{h=1}^{H} ( 1/(H+1) + 1/(pi h) ) . |Dhat(h)|,
 * where Dhat(h) = (1/N) sum_n e(h x_n) is the normalized exponential sum.
 *   - The leading 1/(H+1) is the KERNEL MASS: the exact L1 excess of the
 *     Selberg majorant of an arc truncated at frequency H (Vaaler 1985).
 *   - The per-frequency weight 1/(H+1) + 1/(pi h) is the Selberg-kernel
 *     SMOOTHING coefficient; the 1/(pi h) tail is the genuine harmonic weight.
 *
 * APPLYING IT TO THE ZEROS WITH ONLY THE SCALAR S(T) INPUT
 * -------------------------------------------------------
 * The exponential sums of the unfolded zeros x_n = Nbar(gamma_n) are what S(T)
 * controls. The ONLY rigorous input currently available is the AGGREGATE
 * Trudgian bound, which gives a uniform-in-h per-frequency bound
 *     |Dhat(h)| <= C_Selberg . log(gamma_N) / N =: B   for every h.
 * Substituting B into the sharp Erdos-Turan inequality and converting to the
 * coefficient on log(gamma_N)/N (multiply the bare kernel-mass term by N/L):
 *     coeff(H) = C_Selberg . ( H/(H+1) + (1/pi) sum_{h=1}^{H} 1/h )   [Fourier side]
 *              + (1/(H+1)) . N / L                                     [kernel mass]
 *              + (1/2) / L                                            [half-gap smoothing]
 * with L = log(gamma_N). This is a textbook TENSION: the kernel-mass term
 * forces H large to vanish, but a large H inflates the (1/pi) sum_{h<=H} 1/h
 * ~ (1/pi) log H harmonic factor on the Fourier side.
 *
 * KEY FINDING (HONEST NEGATIVE)
 * -----------------------------
 * Minimizing coeff(H) over H gives min ~ 9.98 near H ~ 1300 -- roughly 3.3x the
 * placeholder 3.0, and ~26x the 0.378 headroom. So the Erdos-Turan bridge fed
 * ONLY the scalar S(T) bound does NOT certify the discrepancy coefficient <=
 * 3.0; the O(1) overhead is not O(1) at all under this lossy accounting -- it
 * is a multiplicative (1/pi) log H harmonic blow-up.
 *
 * This does NOT mean the true discrepancy is ~10 (imp-2641 reading (a) put the
 * point coefficient at ~0.452, and the zeros equidistribute far better than the
 * worst case). It means the AVAILABLE PROOF TOOL is lossy: the placeholder 3.0
 * is heuristically safe but NOT rigorously discharged by Erdos-Turan + scalar
 * S(T). The genuine closure needs a strictly finer input than sup|S(T)|:
 *
 *   SUB-GAP (named, not papered over): a per-frequency decay bound on the
 *   unfolded-zero exponential sums  sum_{gamma <= T} e(h . Nbar(gamma)),
 *   decaying in h, rather than the uniform-in-h aggregate S(T) bound. With such
 *   decay the (1/pi) sum 1/h harmonic factor collapses and the bridge constant
 *   can fit inside the headroom; without it, C_KH cannot rigorously claim 3.0.
 *
 * RECOMMENDATION: either (a) supply the per-frequency exponential-sum decay and
 * re-run this accounting, or (b) carry dyson_star_discrepancy as a NAMED
 * CONDITIONAL (coefficient empirically <= 3.0, not Erdos-Turan-certified), or
 * (c) if forced to rely on Erdos-Turan alone, re-size E_coll with the certified
 * coefficient ~10 (C_C and E_coll grow by sqrt(10/3) ~ 1.83x).
 *
 * @see imp-2641-c-selberg-trudgian-discharge (the S(T) discharge that named this residual)
 * @see lean4-koksma-hlawka.js (C_Selberg / C_KH; dyson_star_discrepancy axiom, imp-403 sorry-2)
 * @see imp-2361-erdos-turan-discrete-discrepancy-pcc-bypass (prior Erdos-Turan analysis)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

const N_STAR = 1e4;
const C_SELBERG = 2.622;                 // explicit Trudgian-2014 S(T) coefficient (imp-2641)
const C_SELBERG_PLACEHOLDER = 3.0;       // lean4-koksma-hlawka.js placeholder
const HEADROOM = C_SELBERG_PLACEHOLDER - C_SELBERG; // 0.378

const T0 = effectiveHeightForN(N_STAR);  // gamma_N approx 9.879e3
const L = Math.log(T0);                  // approx 9.198

// Partial harmonic sum H_H = sum_{h=1}^{H} 1/h.
function harmonic(H) {
  let s = 0;
  for (let h = 1; h <= H; h++) s += 1 / h;
  return s;
}

// Sharp Selberg-kernel Erdos-Turan effective coefficient on log(gamma_N)/N,
// fed the uniform-in-h aggregate bound |Dhat(h)| <= C_Selberg . L / N.
function fourierMultiplier(H) {
  return H / (H + 1) + (1 / Math.PI) * harmonic(H);
}
function kernelMassCoeff(H) {
  return (1 / (H + 1)) * N_STAR / L;     // bare 1/(H+1) term in coefficient units
}
const SMOOTHING_COEFF = 0.5 / L;          // half-gap discreteness, ~0.054

function totalCoeff(H) {
  return C_SELBERG * fourierMultiplier(H) + kernelMassCoeff(H) + SMOOTHING_COEFF;
}

// Minimize the Erdos-Turan coefficient over the cutoff H (the kernel-mass vs
// harmonic-tail tension). Sweep is monotone-then-flat so a coarse scan suffices.
let MIN_COEFF = Infinity;
let ARG_MIN_H = 0;
for (let H = 1; H <= 20000; H++) {
  const c = totalCoeff(H);
  if (c < MIN_COEFF) {
    MIN_COEFF = c;
    ARG_MIN_H = H;
  }
}

const FITS_HEADROOM = MIN_COEFF <= C_SELBERG_PLACEHOLDER;       // false
const RESIZE_FACTOR = Math.sqrt(MIN_COEFF / C_SELBERG_PLACEHOLDER); // E_coll grows by this if forced

export const IMP2759_ERDOS_TURAN_BRIDGE_CONSTANT = {
  id: 'imp-2759',
  ticket: 'imp-2682',
  question:
    'Write the explicit Erdos-Turan inequality with its kernel-mass and smoothing-length O(1) constants, evaluate them, and check whether C_Selberg(S(T))=2.622 plus the Erdos-Turan overhead still fits inside the placeholder headroom 3.0 (headroom 0.378).',
  inputs: {
    N_star: N_STAR,
    gamma_N: +T0.toExponential(4),
    L_logGammaN: +L.toFixed(4),
    C_Selberg_ST: C_SELBERG,
    placeholder: C_SELBERG_PLACEHOLDER,
    headroom: +HEADROOM.toFixed(4),
  },
  erdosTuranInequality: {
    statement:
      'D_N* <= 1/(H+1) + sum_{h=1}^{H} (1/(H+1) + 1/(pi h)) |Dhat(h)|, Dhat(h)=(1/N) sum_n e(h x_n)',
    citation: 'Montgomery, Ten Lectures (CBMS 84, 1994), Ch. 1 (Beurling-Selberg majorant); Vaaler 1985',
    kernelMass: '1/(H+1): exact L1 excess of the Selberg majorant of an arc truncated at frequency H',
    smoothing: '1/(pi h): Selberg-kernel harmonic weight; plus half-gap discreteness 0.5/L',
  },
  scalarInputUsed: 'uniform-in-h aggregate Trudgian bound |Dhat(h)| <= C_Selberg . L / N (the only currently-rigorous input)',
  evaluatedOverhead: {
    smoothingCoeff: +SMOOTHING_COEFF.toFixed(5),
    fourierMultiplierAtArgMin: +fourierMultiplier(ARG_MIN_H).toFixed(4),
    kernelMassCoeffAtArgMin: +kernelMassCoeff(ARG_MIN_H).toFixed(4),
    minEffectiveCoeff: +MIN_COEFF.toFixed(4),     // ~9.98
    argMinH: ARG_MIN_H,                            // ~1300
    ratioToPlaceholder: +(MIN_COEFF / C_SELBERG_PLACEHOLDER).toFixed(3), // ~3.33
  },
  fitsHeadroom: FITS_HEADROOM, // false
  verdict:
    'HONEST NEGATIVE: the Erdos-Turan bridge fed only the scalar S(T) bound certifies an ' +
    'effective star-discrepancy coefficient of min ~9.98 (near H~1300), about 3.3x the ' +
    'placeholder 3.0 and ~26x the 0.378 headroom. The overhead is NOT a benign additive O(1): ' +
    'it is a multiplicative (1/pi) log H harmonic blow-up from the kernel-mass vs harmonic-tail ' +
    'tension. So the placeholder 3.0 is heuristically safe (the zeros equidistribute far better, ' +
    'point reading ~0.452) but is NOT rigorously discharged by Erdos-Turan + scalar S(T).',
  subGap:
    'The genuine closure needs a per-frequency decay bound on the unfolded-zero exponential sums ' +
    'sum_{gamma<=T} e(h . Nbar(gamma)) decaying in h, strictly finer than the uniform-in-h ' +
    'aggregate sup|S(T)| bound. With such decay the (1/pi) sum 1/h harmonic factor collapses and ' +
    'the bridge constant can fit inside the headroom; without it C_KH cannot rigorously claim 3.0.',
  recommendation:
    'Either (a) supply the per-frequency exponential-sum decay and re-run this accounting, ' +
    '(b) carry dyson_star_discrepancy as a NAMED CONDITIONAL (coefficient empirically <= 3.0, ' +
    'not Erdos-Turan-certified), or (c) re-size E_coll with the certified coefficient ~10 ' +
    '(C_C and E_coll grow by sqrt(' + (+MIN_COEFF.toFixed(2)) + '/3) ~ ' + RESIZE_FACTOR.toFixed(2) + 'x).',
  citation:
    'Montgomery Ten Lectures Ch.1 (sharp Erdos-Turan / Selberg majorant); Vaaler 1985 (kernel mass); imp-2641 (C_Selberg=2.622 discharge); lean4-koksma-hlawka.js (dyson_star_discrepancy)',
};

export const IMP2759_ERDOS_TURAN_BRIDGE_CONSTANT_ASSERTIONS = [
  {
    id: 'imp2759-headroom-is-0378',
    description: 'Headroom for the bridge overhead is exactly 3.0 - 2.622 = 0.378',
    holds: () => Math.abs(HEADROOM - 0.378) < 1e-9,
  },
  {
    id: 'imp2759-smoothing-coeff',
    description: 'Half-gap smoothing-length coefficient is 0.5/L ~ 0.0544',
    holds: () => Math.abs(SMOOTHING_COEFF - 0.05436) < 1e-4,
  },
  {
    id: 'imp2759-min-coeff-near-998',
    description: 'Minimized Erdos-Turan effective coefficient is ~9.98 near H~1300',
    holds: () =>
      Math.abs(MIN_COEFF - 9.976) < 5e-2 &&
      ARG_MIN_H > 1000 && ARG_MIN_H < 1600,
  },
  {
    id: 'imp2759-exceeds-headroom',
    description: 'The bridge overhead FAR exceeds the 0.378 headroom: min coeff > placeholder 3.0',
    holds: () => MIN_COEFF > C_SELBERG_PLACEHOLDER && FITS_HEADROOM === false,
  },
  {
    id: 'imp2759-ratio-and-resize',
    description: 'Effective coeff is ~3.3x the placeholder; honest E_coll re-size factor is sqrt(~10/3) ~ 1.82x',
    holds: () =>
      Math.abs(MIN_COEFF / C_SELBERG_PLACEHOLDER - 3.325) < 0.1 &&
      Math.abs(RESIZE_FACTOR - 1.823) < 0.05,
  },
  {
    id: 'imp2759-no-false-qed-subgap-named',
    description: 'Honest verdict names the per-frequency exponential-sum decay as the residual sub-gap (no false QED)',
    holds: () =>
      /per-frequency/.test(IMP2759_ERDOS_TURAN_BRIDGE_CONSTANT.subGap) &&
      IMP2759_ERDOS_TURAN_BRIDGE_CONSTANT.fitsHeadroom === false,
  },
];

for (const a of IMP2759_ERDOS_TURAN_BRIDGE_CONSTANT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-2759-erdos-turan-bridge-constant assertion failed: ${a.id}`);
  }
}
