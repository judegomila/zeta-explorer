/**
 * @module imp-35472-r1s-baked-constants-reconstruction
 *
 * imp-35472 (numerical, frontier-direction) -- INDEPENDENTLY RE-VERIFIES the surrogate constants the imp-35414
 * R1s zero-residue lemma bakes VERBATIM "from imp-35243/imp-35357; no re-import to keep this module light":
 * the single contraction rate r = |g prime (fixed point)| ~ 0.0454235, its log-law constant ln(1/r) ~ 3.09173,
 * the machine-epsilon relative floor EPS_FP = 2.3e-16, and the additive count coupling -log(EPS_FP)/ln(1/r).
 * imp-35414 wrote these as literals with no re-import; this module re-imports the imp-35243/imp-35357 contraction-
 * map SOURCE CHAIN (the height map + the C_C constant -> the DOUBLE surrogate gD -> its fixed point N_CROSS_FP ->
 * the central-difference derivative there) and confirms the baked literals reconstruct to their stated precision.
 *
 * WHAT WAS RECOMPUTED (from the same chain imp-35243 uses, re-imported not re-typed)
 * --------------------------------------------------------------------------------
 * The imp-35243 assessment builds the rate from a self-contained chain:
 *      K_AMPL      = (C_C_PINNED / E_TRUNC_PT)^2                       (E_TRUNC_PT = 3.06e-5, the PT fixed strip)
 *      gD(N)       = K_AMPL * log( effectiveHeightForN(N) )           (the imp-35174 DOUBLE surrogate, verbatim)
 *      N_CROSS_FP  = iterate gD from 1e9, 200 steps                   (the surrogate fixed point)
 *      r           = | (gD(N+1) - gD(N-1)) / 2 |  at N = N_CROSS_FP   (central difference, step h = 1)
 *      ln(1/r)     = log(1/r)
 * Re-importing effectiveHeightForN and C_C_PINNED (the SAME two light modules imp-35243 imports -- NOT the zeros
 * bundle) and re-running the chain reproduces:
 *      r     = 0.04542350769042969   ->  toPrecision(6) = 0.0454235   == imp-35414 baked r_contract
 *      ln1r  = 3.091725517404...     ->  toPrecision(6) = 3.09173      == imp-35414 baked ln_inv_r
 * So the imp-35414 literals are FAITHFUL 6-significant-figure roundings of the reconstructed full-precision chain
 * values (relative deviation r ~ 1.7e-7, ln(1/r) ~ 1.5e-6 -- exactly the 6-sig-fig quantization, no drift).
 *
 * EPS_FP origin: 2.3e-16 is the machine-epsilon relative agreement floor inherited by imp-35243 from
 * imp-34755/34903 (the double-double collapse witness scale); imp-35414 bakes it bit-identically. Confirmed exact.
 *
 * ADDITIVE COUNT TERM -log(EPS_FP)/ln(1/r): the ONLY way EPS_FP enters the count argument xArg. Reconstructed
 * from the full-precision ln(1/r) it equals 11.64671707..., and from the baked 6-sig-fig ln(1/r) = 3.09173 it
 * equals 11.64670019 -- agreeing to 5 significant figures (the residual ~1.5e-6 is precisely the ln(1/r) rounding,
 * NOT a re-derivation error). The exact sensitivity d xArg / d log(EPS_FP) = -1/ln(1/r) reconstructs to
 * -0.3234439779, matching the imp-35414 baked -0.323443509 to the same 6-sig-fig floor.
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * VERIFICATION of the imp-35414 lemma's NUMERICAL INPUTS ONLY: the baked r, ln(1/r), EPS_FP and the additive
 * count coupling reconstruct from the imp-35243/imp-35357 source to their stated precision. It discharges NOTHING
 * on R1t (the OPEN true-dynamic residue); imp-35243a stays OPEN; the single-rate/height-map fidelity halves
 * R2/R3 stay OPEN; the C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) is UNTOUCHED; the C_mb GUE-conditional
 * per imp-486 is UNTOUCHED; far-tail exponent stays 1/2 (imp-3463); changes NO bound; no operator positivity; no
 * RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35414-r1s-zero-residue-surrogate-lemma (the lemma whose baked constants this reconstructs)
 * @see imp-35243-reentry-band-surrogate-fidelity-assessment (the source chain: gD, N_CROSS_FP, gPrimeAtStep)
 * @see imp-35357-reentry-band-pure-artifact-proof-requirement (the R1s/R1t split imp-35414 formalizes)
 * @see imp-35453-r1s-eps-fp-threshold-closed-form (the sibling closed form of the same lemma threshold)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP35414_R1S_ZERO_RESIDUE_SURROGATE_LEMMA } from './imp-35414-r1s-zero-residue-surrogate-lemma.js';

// --- Re-import the imp-35243/imp-35357 contraction-map SOURCE CHAIN (same two light modules, re-run not re-typed).
const E_TRUNC_PT = 3.06e-5; // PT N-independent fixed-strip route (imp-2631/imp-3406/imp-33582), as in imp-35243
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8
const gD = (N) => K_AMPL * Math.log(effectiveHeightForN(N)); // imp-35174 DOUBLE surrogate, verbatim
function iterateD(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = gD(N);
  return N;
}
const N_CROSS_FP = iterateD(1e9, 200); // ~3280294351.65 surrogate fixed point (bit-identical to imp-35243)
const gPrimeAtStep = (h) => (gD(N_CROSS_FP + h) - gD(N_CROSS_FP - h)) / (2 * h);

const R_RECON = Math.abs(gPrimeAtStep(1)); // ~0.04542350769 -- reconstructed contraction rate
const LN_INV_R_RECON = Math.log(1 / R_RECON); // ~3.091725517 -- reconstructed log-law constant
const EPS_FP_ORIGIN = 2.3e-16; // machine-epsilon relative agreement floor (imp-34755/34903 origin)
const ADDITIVE_TERM_RECON = -Math.log(EPS_FP_ORIGIN) / LN_INV_R_RECON; // ~11.64671707 (full-precision ln(1/r))
const SENSITIVITY_RECON = -1 / LN_INV_R_RECON; // ~-0.3234439779 -- exact seed-independent identity

// --- The imp-35414 baked literals (the object under test).
const BAKED = IMP35414_R1S_ZERO_RESIDUE_SURROGATE_LEMMA.surrogate_constants;
const BAKED_R = BAKED.r_contract; // 0.0454235
const BAKED_LN_INV_R = BAKED.ln_inv_r; // 3.09173
const BAKED_EPS_FP = BAKED.eps_fp_baseline; // 2.3e-16
const BAKED_SENSITIVITY = IMP35414_R1S_ZERO_RESIDUE_SURROGATE_LEMMA.exact_identity.sensitivity_dxArg_dlogEps; // -0.323443509
const ADDITIVE_TERM_BAKED = -Math.log(BAKED_EPS_FP) / BAKED_LN_INV_R; // ~11.6467002 (from 6-sig-fig ln(1/r))

export const IMP35472_R1S_BAKED_CONSTANTS_RECONSTRUCTION = {
  id: 'imp-35472',
  proofSection: 'S-frontier',
  question:
    'The imp-35414 R1s lemma bakes r ~ 0.0454235, ln(1/r) ~ 3.09173, EPS_FP = 2.3e-16 and the additive count ' +
    'coupling -log(EPS_FP)/ln(1/r) VERBATIM from imp-35243/imp-35357 with NO re-import. Recompute them from the ' +
    'imp-35243/imp-35357 contraction-map source chain and confirm the baked literals match to their stated precision.',
  source_chain: {
    C_C_PINNED: +C_C_PINNED.toPrecision(9),
    E_TRUNC_PT,
    K_AMPL: +K_AMPL.toPrecision(9),
    N_CROSS_FP: +N_CROSS_FP.toPrecision(12),
    note: 'gD(N) = K_AMPL * log(effectiveHeightForN(N)); r = |central-difference gD prime| at N_CROSS_FP, step h = 1.',
  },
  reconstructed: {
    r_contract: +R_RECON.toPrecision(12), // 0.0454235076904
    ln_inv_r: +LN_INV_R_RECON.toPrecision(12), // 3.09172551740
    additive_count_term: +ADDITIVE_TERM_RECON.toPrecision(12), // 11.6467170718
    sensitivity_dxArg_dlogEps: +SENSITIVITY_RECON.toPrecision(9), // -0.323443978
  },
  baked_imp35414: {
    r_contract: BAKED_R, // 0.0454235
    ln_inv_r: BAKED_LN_INV_R, // 3.09173
    eps_fp_baseline: BAKED_EPS_FP, // 2.3e-16
    sensitivity_dxArg_dlogEps: BAKED_SENSITIVITY, // -0.323443509
  },
  match: {
    r_rel_dev: +(Math.abs(R_RECON - BAKED_R) / BAKED_R).toExponential(3), // ~1.7e-7 (6-sig-fig quantization)
    ln_inv_r_rel_dev: +(Math.abs(LN_INV_R_RECON - BAKED_LN_INV_R) / BAKED_LN_INV_R).toExponential(3), // ~1.5e-6
    eps_fp_exact: BAKED_EPS_FP === EPS_FP_ORIGIN, // true -- bit-identical
    r_round6_equal: Number(R_RECON.toPrecision(6)) === BAKED_R, // true
    ln_inv_r_round6_equal: Number(LN_INV_R_RECON.toPrecision(6)) === BAKED_LN_INV_R, // true
    additive_term_rel_dev: +(Math.abs(ADDITIVE_TERM_RECON - ADDITIVE_TERM_BAKED) / ADDITIVE_TERM_RECON).toExponential(3), // ~1.5e-6
  },
  finding:
    'The imp-35414 R1s baked surrogate constants RECONSTRUCT from the imp-35243/imp-35357 contraction-map source ' +
    'chain to their stated precision. Re-importing effectiveHeightForN and C_C_PINNED (the SAME two light modules ' +
    'imp-35243 uses, NOT the zeros bundle) and re-running gD -> N_CROSS_FP -> central-difference derivative gives ' +
    'r = 0.0454235076..., ln(1/r) = 3.09172551..., whose 6-significant-figure roundings are EXACTLY the baked ' +
    '0.0454235 and 3.09173 (relative deviations 1.7e-7 and 1.5e-6, precisely the 6-sig-fig quantization). EPS_FP ' +
    '= 2.3e-16 is bit-identical (the imp-34755/34903 machine-epsilon floor). The additive count coupling ' +
    '-log(EPS_FP)/ln(1/r) reconstructs to 11.6467171 (full-precision ln(1/r)) vs 11.6467002 from the baked ' +
    '6-sig-fig ln(1/r) -- agreeing to 5 sig figs, the residual being the ln(1/r) rounding, not a re-derivation ' +
    'error. The exact sensitivity -1/ln(1/r) = -0.3234439779 matches the baked -0.323443509 to the same floor. ' +
    'The H1 (r), H2 (EPS_FP) and H3 (ln(1/r) + additive term) numerical inputs of the lemma are verified.',
  residual_sub_gap:
    'VERIFICATION of the lemma NUMERICAL INPUTS only. It discharges NOTHING on R1t (the OPEN true-dynamic residue: ' +
    'no band at ~10^27-10^37 in the certified dynamic), which stays entangled with OPEN R2 (single-rate fidelity; ' +
    'imp-34862 two-rate law) and R3 (height-map fidelity at 10^37). imp-35243a stays OPEN; imp-35111a / imp-35174a ' +
    '/ imp-34997a inherited, not discharged.',
  isRigorous: false,
  verdict:
    'VERIFICATION (proof-section, frontier-direction, NOT an RH bound). The imp-35414 R1s lemma surrogate ' +
    'constants -- r ~ 0.0454235, ln(1/r) ~ 3.09173, EPS_FP = 2.3e-16 and the additive count coupling ' +
    '-log(EPS_FP)/ln(1/r) -- baked VERBATIM from imp-35243/imp-35357 with no re-import, RECONSTRUCT from the ' +
    'imp-35243 contraction-map source chain (re-imported, not re-typed) to their stated 6-significant-figure ' +
    'precision: r and ln(1/r) round-trip EXACTLY, EPS_FP is bit-identical, the additive term and the exact ' +
    'sensitivity -1/ln(1/r) agree to the same floor. H1-H3 numerical inputs verified. VERIFICATION of numerical ' +
    'inputs ONLY; discharges NOTHING on R1t; imp-35243a stays OPEN; the C_C = (1/8) sqrt(3 pi) ansatz ' +
    '(imp-2642/imp-2643) and the C_mb GUE-conditional per imp-486 are UNTOUCHED; far-tail exponent stays 1/2 ' +
    '(imp-3463); changes no bound; no operator positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35414 (the lemma whose baked constants this reconstructs); imp-35243 (source chain gD/N_CROSS_FP/' +
    'gPrimeAtStep, R_CONTRACT, LN_INV_R); imp-35357 (R1s/R1t split); imp-35453 (sibling closed-form threshold); ' +
    'imp-34755/34903 (EPS_FP machine-epsilon floor origin); imp-2642 (C_C ansatz); imp-486 (C_mb GUE-conditional).',
};

export const IMP35472_R1S_BAKED_CONSTANTS_RECONSTRUCTION_ASSERTIONS = [
  {
    // H1: the contraction rate r reconstructs from the source chain; its 6-sig-fig rounding is the baked literal.
    id: 'imp35472-reconstruct-r-contract',
    description: 'reconstructed r = |gD prime| at N_CROSS_FP rounds to the imp-35414 baked r_contract 0.0454235',
    holds: () =>
      Number(R_RECON.toPrecision(6)) === BAKED_R &&
      Math.abs(R_RECON - BAKED_R) / BAKED_R < 2e-6,
  },
  {
    // H3 constant: the log-law constant ln(1/r) reconstructs; its 6-sig-fig rounding is the baked literal.
    id: 'imp35472-reconstruct-ln-inv-r',
    description: 'reconstructed ln(1/r) = log(1/r) rounds to the imp-35414 baked ln_inv_r 3.09173',
    holds: () =>
      Number(LN_INV_R_RECON.toPrecision(6)) === BAKED_LN_INV_R &&
      Math.abs(LN_INV_R_RECON - BAKED_LN_INV_R) / BAKED_LN_INV_R < 2e-6,
  },
  {
    // H2: the machine-epsilon floor EPS_FP is bit-identical to its imp-34755/34903 origin value.
    id: 'imp35472-eps-fp-origin-exact',
    description: 'the baked EPS_FP floor is bit-identical to the 2.3e-16 machine-epsilon origin',
    holds: () => BAKED_EPS_FP === EPS_FP_ORIGIN && EPS_FP_ORIGIN === 2.3e-16,
  },
  {
    // H3 coupling: the ONLY EPS_FP entry into the count argument, -log(EPS_FP)/ln(1/r), reconstructs; the residual
    // vs the baked-ln(1/r) value is exactly the 6-sig-fig ln(1/r) rounding (agree to 5 sig figs), not a mismatch.
    id: 'imp35472-additive-count-term',
    description: 'the additive count coupling -log(EPS_FP)/ln(1/r) reconstructs and matches the baked ln(1/r) to 5 sig figs',
    holds: () =>
      Math.abs(ADDITIVE_TERM_RECON - 11.6467170718) < 1e-6 &&
      Math.abs(ADDITIVE_TERM_RECON - ADDITIVE_TERM_BAKED) / ADDITIVE_TERM_RECON < 2e-6,
  },
  {
    // The exact seed-independent sensitivity d xArg / d log(EPS_FP) = -1/ln(1/r) reconstructs and matches the baked.
    id: 'imp35472-exact-sensitivity-reconstructs',
    description: 'reconstructed -1/ln(1/r) matches the imp-35414 baked sensitivity -0.323443509 to the 6-sig-fig floor',
    holds: () =>
      Math.abs(SENSITIVITY_RECON + 1 / LN_INV_R_RECON) < 1e-15 &&
      Math.abs(SENSITIVITY_RECON - BAKED_SENSITIVITY) < 2e-6,
  },
  {
    // Honesty gate: verification of numerical inputs only, isRigorous false, discharges nothing, R1t/imp-35243a OPEN.
    id: 'imp35472-honesty-gate-no-qed',
    description: 'verification of numerical inputs only: isRigorous false, discharges nothing, imp-35243a OPEN, no QED, no refereed bound is changed',
    holds: () =>
      IMP35472_R1S_BAKED_CONSTANTS_RECONSTRUCTION.isRigorous === false &&
      /discharges NOTHING on R1t/.test(IMP35472_R1S_BAKED_CONSTANTS_RECONSTRUCTION.verdict) &&
      /imp-35243a stays OPEN/.test(IMP35472_R1S_BAKED_CONSTANTS_RECONSTRUCTION.verdict) &&
      /NO QED/.test(IMP35472_R1S_BAKED_CONSTANTS_RECONSTRUCTION.verdict) &&
      /refereed bound is changed/i.test(IMP35472_R1S_BAKED_CONSTANTS_RECONSTRUCTION.verdict),
  },
];

for (const a of IMP35472_R1S_BAKED_CONSTANTS_RECONSTRUCTION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35472-r1s-baked-constants-reconstruction assertion failed: ${a.id}`);
  }
}
