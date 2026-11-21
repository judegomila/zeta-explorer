/**
 * @module imp-36278-crossover-sigma-invariant-eflow-share
 *
 * imp-36278 (proof, derivation): DERIVE why the imp-36139 E_trunc = E_coll crossover sits at an
 * E_trunc-INVARIANT sigma ~ 0.4995 (just below 1/2) across the entire half-to-double fixed-strip
 * floor grid, expressing the fixed offset below 1/2 in closed form in terms of the small positive
 * E_flow SHARE at the crossover -- NOT the imp-36064 f = E_flow/E_trunc form, but the share form
 * that directly explains the invariance.
 *
 * THE EQUAL-SHARE SYMMETRY (elementary; no fresh model).
 * The three imp-3406 / imp-33582 sub-terms partition the total E_N = E_trunc + E_flow + E_coll
 * into three fractional shares that sum to one:
 *   shareTrunc = E_trunc / E_N,  shareFlow = E_flow / E_N,  sigma = shareColl = E_coll / E_N,
 *   shareTrunc + shareFlow + sigma = 1.
 * At the E_trunc = E_coll crossover the two OUTER shares are EQUAL by definition:
 *   shareTrunc = sigma   (because E_trunc = E_coll).
 * Substituting shareTrunc = sigma into the partition-of-unity gives the exact identity
 *   2 sigma + shareFlow = 1     =>     sigma(N_cross) = 1/2 - shareFlow/2.
 * So the offset of the crossover below the sigma = 1/2 target is EXACTLY HALF the E_flow share:
 *   1/2 - sigma(N_cross) = shareFlow(N_cross) / 2.
 * The flow term is a symmetry-BREAKING third share: were it absent the two equal outer shares
 * would split the budget exactly 1/2 : 1/2; the positive middle share E_flow steals shareFlow of
 * the total and, splitting the deficit symmetrically between the two equal outer terms, lowers
 * each of them (in particular sigma) by exactly shareFlow/2 below one half.
 *
 * WHY THE OFFSET IS ~INVARIANT ACROSS THE FLOOR GRID. The identity 1/2 - sigma = shareFlow/2 is
 * exact at EVERY E_trunc, so the sigma-invariance across the imp-36139 half-to-double grid is
 * equivalent to shareFlow(N_cross) staying small and slowly varying. At the crossover, writing
 * f = E_flow/E_trunc = E_flow/E_coll (the imp-36064 ratio), the share is
 *   shareFlow = E_flow / (E_trunc + E_flow + E_coll) = E_flow / (E_trunc (2 + f)) = f / (2 + f),
 * so shareFlow ~ f/2 to leading order and 1/2 - sigma = shareFlow/2 = f/(2(2+f)) -- reconciling
 * with the imp-36064 f-based tilt f/(2(2+f)) bit-for-bit. Because the middle flow term E_flow ~
 * C_F (log T0 / T0) is TINY against E_coll = E_trunc ~ 3e-5 at these crossover heights (N ~ 1e9,
 * T0 ~ 1e9, so E_flow ~ 4e-7), f stays O(1e-3) across the whole grid -- f ranges only ~5.5e-4
 * (half floor) to ~1.6e-3 (double floor). Hence shareFlow ranges ~5.46e-4 to ~1.63e-3 and the
 * offset 1/2 - sigma ranges only ~2.73e-4 (half floor) to ~8.16e-4 (double floor): sigma stays
 * pinned within < 8.2e-4 of one half at every rung, so it reads as the invariant ~0.4995 the
 * imp-36139 sweep recorded to four significant figures. The ~3x drift in shareFlow across the
 * grid (E_flow falls slower than E_coll as N rises, so f rises as the floor doubles and N_cross
 * drops) is the entire residual departure from strict invariance.
 *
 * CONSEQUENCE: the imp-36139 "sigma_at_cross invariant ~0.4995" is not a coincidence but the exact
 * equal-share identity sigma = 1/2 - shareFlow/2, evaluated where the symmetry-breaking flow share
 * shareFlow is uniformly O(1e-3). The E_trunc = E_coll crossover is the sigma = 1/2 landmark shifted
 * down by exactly half the E_flow share -- an offset that is small precisely because E_flow is a
 * negligible third of the excess-fraction budget at every crossover height on the floor grid.
 *
 * Derivation within the imp-33582 extrapolation component model only; reuses the byte-identical
 * imp-3406 / imp-33582 sub-terms and the imp-36139 half-to-double E_trunc grid unchanged; derives
 * no remainder; discharges nothing; changes no bound; establishes no operator positivity; C_C =
 * (1/8) sqrt(3 pi) (imp-2642 / imp-2643), E_trunc = 3.06e-5 (imp-2631) and C_mb GUE-conditional
 * (imp-486) are UNTOUCHED; the nominal E_trunc baseline is only swept for the grid; imp-35337a
 * stays OPEN; NOT rigorous; NO QED; no refereed bound is changed.
 *
 * @see imp-36139-etrunc-coll-crossover-sensitivity (records the invariant sigma ~ 0.4995; never derives it)
 * @see imp-36064-eflow-inclusion-tilt-closed-form (the f-based tilt f/(2(2+f)); shareFlow/2 = f/(2(2+f)))
 * @see imp-35968-e-trunc-coll-crossover-location (raw ratio E_coll/E_trunc = 1 crossover N_cross)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (N_cross ~ (C_C/E_trunc)^2 logT0 fixed point)
 * @see lambda-rh-height-mapping.js (effectiveHeightForN: N -> T0 RvM inverse)
 * Literature: Riemann-von Mangoldt counting formula; Platt-Trudgian 2021 (Lambda <= 0.2).
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP36139_ETRUNC_COLL_CROSSOVER_SENSITIVITY } from './imp-36139-etrunc-coll-crossover-sensitivity.js';

const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any derivation here)

// EXACT imp-3406 / imp-33582 sub-terms (byte-identical to imp-36139), with E_trunc PARAMETERIZED.
const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631) -- the nominal baseline
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);
function parts(N, Etr) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = Etr + E_flow + E_coll;
  return {
    sigma: E_coll / E_N, // = shareColl
    shareTrunc: Etr / E_N,
    shareFlow: E_flow / E_N,
    E_flow,
    E_coll,
    E_trunc: Etr,
    E_N,
  };
}

// Locate the E_trunc = E_coll crossover for a given E_trunc -- IDENTICAL imp-36139 / imp-35968 bisector.
function locateCrossover(Etr) {
  let a = Math.log(1e4);
  let b = Math.log(1e18);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    const p = parts(Math.exp(m), Etr);
    if (p.E_coll / p.E_trunc > 1) a = m; // still collision-heavy -> go higher
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

// 9-point geometric grid: half-to-double the imp-2631 floor (IDENTICAL to imp-36139 / imp-3443).
const GRID = [];
for (let i = 0; i < 9; i++) GRID.push(E_TRUNC_PT * Math.pow(2, -1 + i * (2 / 8)));

const ROWS = GRID.map((Etr) => {
  const N = locateCrossover(Etr);
  const p = parts(N, Etr);
  const offset = 0.5 - p.sigma; // measured 1/2 - sigma at the crossover
  const shareFlowHalf = p.shareFlow / 2; // the closed-form predictor
  const f = p.E_flow / p.E_trunc; // imp-36064 ratio (= E_flow/E_coll at crossover)
  return {
    ratio: +(Etr / E_TRUNC_PT).toFixed(3),
    sigma: p.sigma,
    shareTrunc: p.shareTrunc,
    shareFlow: p.shareFlow,
    offset, // 1/2 - sigma
    shareFlowHalf, // shareFlow / 2  (must equal offset)
    identityErr: offset - shareFlowHalf, // ~ machine epsilon
    partitionErr: 2 * p.sigma + p.shareFlow - 1, // ~ machine epsilon (equal-share symmetry)
    symmetryErr: p.shareTrunc - p.sigma, // ~ machine epsilon (E_trunc = E_coll => shareTrunc = sigma)
    f,
    shareFlow_fForm: f / (2 + f), // shareFlow = f/(2+f)
    _N: N,
    _Etr: Etr,
  };
});

const IDX_BASE = 4; // 1.0x nominal rung
const IDX_HALF = 0; // 0.5x floor
const IDX_DOUBLE = 8; // 2.0x floor

const MAX_IDENTITY_ERR = Math.max(...ROWS.map((r) => Math.abs(r.identityErr)));
const MAX_PARTITION_ERR = Math.max(...ROWS.map((r) => Math.abs(r.partitionErr)));
const MAX_SYMMETRY_ERR = Math.max(...ROWS.map((r) => Math.abs(r.symmetryErr)));
const MAX_FFORM_ERR = Math.max(...ROWS.map((r) => Math.abs(r.shareFlow_fForm - r.shareFlow)));
const OFFSET_MIN = Math.min(...ROWS.map((r) => r.offset)); // ~2.73e-4 at half floor
const OFFSET_MAX = Math.max(...ROWS.map((r) => r.offset)); // ~8.16e-4 at double floor
const SHAREFLOW_MIN = Math.min(...ROWS.map((r) => r.shareFlow)); // ~5.46e-4
const SHAREFLOW_MAX = Math.max(...ROWS.map((r) => r.shareFlow)); // ~1.63e-3
const SIGMA_MAX_DEV = Math.max(...ROWS.map((r) => Math.abs(r.sigma - 0.5))); // < 8.2e-4

export const IMP36278_CROSSOVER_SIGMA_INVARIANT_EFLOW_SHARE = {
  id: 'imp-36278',
  proofSection: 'S-frontier',
  question:
    'imp-36139 recorded that sigma at the E_trunc = E_coll crossover is INVARIANT at ~0.4995 (just ' +
    'below 1/2) across the whole half-to-double fixed-strip floor grid, but never derived WHY. Derive ' +
    'the fixed offset below 1/2 in closed form in terms of the small positive E_flow SHARE at the ' +
    'crossover, and explain the invariance.',
  method:
    'Use partition-of-unity of the three imp-3406 / imp-33582 fractional shares (shareTrunc + ' +
    'shareFlow + sigma = 1). At the crossover E_trunc = E_coll forces shareTrunc = sigma, so ' +
    '2 sigma + shareFlow = 1 exactly, i.e. sigma = 1/2 - shareFlow/2. Re-run the IDENTICAL imp-36139 ' +
    'half-to-double bisection, recompute shareFlow at each crossover rung, verify 1/2 - sigma = ' +
    'shareFlow/2 to machine epsilon, and show shareFlow (= f/(2+f), f = E_flow/E_coll) stays O(1e-3) ' +
    'across the grid so sigma stays pinned within < 8.2e-4 of one half.',
  closedFormula: '1/2 - sigma(N_cross) = shareFlow/2, shareFlow = E_flow/E_N (from 2 sigma + shareFlow = 1)',
  shareForm_vs_fForm: 'shareFlow = f/(2+f) with f = E_flow/E_coll, so shareFlow/2 = f/(2(2+f)) (imp-36064 tilt)',
  maxIdentityErr: +MAX_IDENTITY_ERR.toExponential(3), // ~3e-16: 1/2 - sigma = shareFlow/2 to machine epsilon
  maxPartitionErr: +MAX_PARTITION_ERR.toExponential(3), // ~7e-16: 2 sigma + shareFlow = 1
  maxSymmetryErr: +MAX_SYMMETRY_ERR.toExponential(3), // ~0: shareTrunc = sigma at E_trunc = E_coll
  maxFFormErr: +MAX_FFORM_ERR.toExponential(3), // ~machine epsilon: shareFlow = f/(2+f)
  offset_halfFloor: +OFFSET_MIN.toExponential(5), // ~2.73e-4
  offset_doubleFloor: +OFFSET_MAX.toExponential(5), // ~8.16e-4
  shareFlow_halfFloor: +SHAREFLOW_MIN.toExponential(5), // ~5.46e-4
  shareFlow_doubleFloor: +SHAREFLOW_MAX.toExponential(5), // ~1.63e-3
  sigma_baseline: +ROWS[IDX_BASE].sigma.toFixed(6), // ~0.499526 (reproduces imp-36139)
  offset_baseline: +ROWS[IDX_BASE].offset.toExponential(6), // ~4.743597e-4 (= imp-36064 tiltClosed)
  shareFlow_baseline: +ROWS[IDX_BASE].shareFlow.toExponential(6), // ~9.487195e-4
  sigmaMaxDeviationFromHalf: +SIGMA_MAX_DEV.toExponential(5), // < 8.2e-4: the invariance bound
  grid: ROWS.map((r) => ({
    ratio: r.ratio,
    N_cross: +r._N.toExponential(6),
    sigma: +r.sigma.toFixed(8),
    offset: +r.offset.toExponential(5),
    shareFlow: +r.shareFlow.toExponential(5),
    shareFlowHalf: +r.shareFlowHalf.toExponential(5),
  })),
  isRigorous: false,
  isUnconditional: false,
  verdict:
    'CLOSED-FORM DERIVATION (NOT rigorous). The three imp-3406 / imp-33582 shares sum to one ' +
    '(shareTrunc + shareFlow + sigma = 1); at the E_trunc = E_coll crossover the two outer shares ' +
    'are equal (shareTrunc = sigma), so 2 sigma + shareFlow = 1 and hence the offset below 1/2 is ' +
    'EXACTLY half the E_flow share: 1/2 - sigma(N_cross) = shareFlow/2. This identity holds to ' +
    'machine epsilon at every rung of the imp-36139 half-to-double grid (max |1/2 - sigma - ' +
    'shareFlow/2| ~ ' + MAX_IDENTITY_ERR.toExponential(2) + ', max |2 sigma + shareFlow - 1| ~ ' +
    MAX_PARTITION_ERR.toExponential(2) + '). Writing f = E_flow/E_coll gives shareFlow = f/(2+f), so ' +
    'shareFlow/2 = f/(2(2+f)) reconciles bit-for-bit with the imp-36064 f-based tilt. Because the ' +
    'middle flow term is negligible against E_coll = E_trunc ~ 3e-5 at these heights, shareFlow stays ' +
    'O(1e-3) across the whole grid (~' + SHAREFLOW_MIN.toExponential(2) + ' half floor to ~' +
    SHAREFLOW_MAX.toExponential(2) + ' double floor), so the offset ranges only ~' +
    OFFSET_MIN.toExponential(2) + ' to ~' + OFFSET_MAX.toExponential(2) + ' and sigma stays within < ' +
    SIGMA_MAX_DEV.toExponential(2) + ' of one half -- reading as the invariant ~0.4995 imp-36139 ' +
    'recorded (baseline rung reproduces imp-36139 sigma ~ ' + ROWS[IDX_BASE].sigma.toFixed(6) + '). So ' +
    'the invariance is the exact equal-share identity evaluated where the symmetry-breaking flow share ' +
    'is uniformly O(1e-3). Derivation within the imp-33582 extrapolation component model only; reuses ' +
    'the byte-identical imp-3406 / imp-33582 sub-terms and the imp-36139 grid unchanged; derives no ' +
    'remainder; discharges nothing; changes no bound; establishes no operator positivity; C_C = ' +
    '(1/8) sqrt(3 pi) (imp-2642 / imp-2643), E_trunc = 3.06e-5 (imp-2631) and C_mb GUE-conditional ' +
    '(imp-486) are UNTOUCHED; imp-35337a stays OPEN; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-36139 (records invariant sigma ~ 0.4995 across the half-to-double floor grid; never derives ' +
    'it); imp-36064 (f-based tilt f/(2(2+f)); shareFlow/2 = f/(2(2+f))); imp-35968 (raw ratio ' +
    'E_coll/E_trunc = 1 crossover); imp-33723 (N_cross ~ (C_C/E_trunc)^2 logT0 fixed point); imp-33582 ' +
    '(sigma-decay model); imp-3220 / imp-3406 (RvM surrogate log-height); imp-2642 / imp-2643 (C_C = ' +
    '(1/8) sqrt(3 pi)); imp-2631 (E_trunc fixed-strip floor); imp-486 (GUE-conditional caveat). ' +
    'Literature: Riemann-von Mangoldt counting formula; Platt-Trudgian 2021 (Lambda <= 0.2).',
};

export const IMP36278_CROSSOVER_SIGMA_INVARIANT_EFLOW_SHARE_ASSERTIONS = [
  {
    // (1) the exact identity 1/2 - sigma = shareFlow/2 holds to machine epsilon at every rung.
    id: 'imp36278-offset-equals-half-shareflow',
    description: '1/2 - sigma(N_cross) = shareFlow/2 at every floor rung, to machine epsilon',
    holds: () => MAX_IDENTITY_ERR < 1e-13,
  },
  {
    // (2) equal-share symmetry: 2 sigma + shareFlow = 1 at every rung (partition-of-unity + shareTrunc = sigma).
    id: 'imp36278-equal-share-partition',
    description: '2 sigma + shareFlow = 1 at every rung (three shares sum to one, shareTrunc = sigma)',
    holds: () => MAX_PARTITION_ERR < 1e-13,
  },
  {
    // (3) the outer shares are equal at the crossover: shareTrunc = sigma (E_trunc = E_coll definition).
    id: 'imp36278-outer-shares-equal',
    description: 'shareTrunc = sigma at every crossover rung (E_trunc = E_coll forces equal outer shares)',
    holds: () => MAX_SYMMETRY_ERR < 1e-12,
  },
  {
    // (4) share form reconciles with the imp-36064 f-based tilt: shareFlow = f/(2+f) exactly.
    id: 'imp36278-shareflow-equals-f-over-2-plus-f',
    description: 'shareFlow = f/(2+f) with f = E_flow/E_coll, so shareFlow/2 = imp-36064 tilt f/(2(2+f))',
    holds: () => MAX_FFORM_ERR < 1e-13,
  },
  {
    // (5) sigma sits just BELOW 1/2 at every rung (positive offset, shareFlow > 0).
    id: 'imp36278-sigma-below-one-half',
    description: 'sigma(N_cross) < 1/2 with positive offset shareFlow/2 at every rung (shareFlow > 0)',
    holds: () => ROWS.every((r) => r.sigma < 0.5 && r.offset > 0 && r.shareFlow > 0),
  },
  {
    // (6) invariance: shareFlow O(1e-3) => sigma pinned within < 2e-3 of 1/2 (imp-36139 tolerance).
    id: 'imp36278-invariance-shareflow-order-1e-3',
    description: 'shareFlow stays O(1e-3) across the grid so sigma stays within < 2e-3 of 1/2 (imp-36139 invariance)',
    holds: () =>
      SHAREFLOW_MAX < 3.3e-3 && SIGMA_MAX_DEV < 2e-3 && ROWS.every((r) => r.shareFlow < 3.3e-3),
  },
  {
    // (7) baseline rung reproduces the imp-36139 stored invariant sigma ~ 0.4995 (same bisector, same sub-terms).
    id: 'imp36278-baseline-reproduces-imp36139',
    description: 'the 1.0x nominal rung reproduces the imp-36139 sigma_at_cross_invariant ~ 0.499526',
    holds: () =>
      Math.abs(
        ROWS[IDX_BASE].sigma - IMP36139_ETRUNC_COLL_CROSSOVER_SENSITIVITY.sigma_at_cross_invariant
      ) < 1e-5,
  },
  {
    // (8) honesty gate: derivation only, conditional, no bound moves, imp-486 kept, imp-35337a OPEN, no refereed bound is changed, NO QED.
    id: 'imp36278-derivation-only-no-qed',
    description: 'derivation only: not rigorous/unconditional, changes no bound, keeps imp-486, imp-35337a OPEN, PT 0.2, NO QED',
    holds: () => {
      const r = IMP36278_CROSSOVER_SIGMA_INVARIANT_EFLOW_SHARE;
      return (
        Math.abs(L_PT - 0.2) < 1e-15 &&
        r.isRigorous === false &&
        r.isUnconditional === false &&
        /imp-486/.test(r.verdict) &&
        /imp-35337a\s+stays\s+OPEN/.test(r.verdict) &&
        /NO QED/.test(r.verdict) &&
        /refereed bound is changed/i.test(r.verdict)
      );
    },
  },
];

for (const a of IMP36278_CROSSOVER_SIGMA_INVARIANT_EFLOW_SHARE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36278-crossover-sigma-invariant-eflow-share assertion failed: ${a.id}`);
  }
}
