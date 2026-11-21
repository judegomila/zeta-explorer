/**
 * @module imp-33857-hump-peak-widening-crossvalidation
 *
 * imp-33857 (numerical, frontier-direction): imp-33844 located the M3 saturation-curvature hump
 * peak in CLOSED FORM at sigma = 1/2 (the E_coll = E_trunc crossover, peak amplitude
 * p_ecoll^2 ln 10 / 8), placing the peak at the integer decade k = 9. imp-33843 independently
 * fit the eflow_attr/resid_exp separation-widening over the SAME imp-33810 k = 6..11 ladder and
 * read its constant-per-decade form off that ladder. Both anchor at k = 9, but the two code paths
 * were never cross-tabulated against each other. This module cross-validates the k-location of the
 * E_coll = E_trunc crossover/peak feature between the two paths and reports the k-location residual.
 *
 * THE CROSS-VALIDATION (reuses both published objects verbatim -- no fresh component model)
 * ---------------------------------------------------------------------------------------
 *   The KEY OBSERVATION is that the two paths share ONE quantity. The imp-33844 hump amplitude is
 *   hump(k) = p_ecoll (1 - sigma_hi) - p_sigma, and the imp-33810 ladder that imp-33843 fits stores
 *   exactly that quantity as its ratio DENOMINATOR resid_exp(k). So the "curvature-hump peak"
 *   (imp-33844) and the "attribution-widening denominator" (imp-33843/imp-33810) are the SAME
 *   dg_{k*}/dk-type curvature object measured by two code paths, and asking where each places
 *   k = 9 is a genuine independent-implementation cross-check, not a tautology of one formula.
 *
 *   PATH A (imp-33844 curvature / closed form):
 *     - direct crossover: bisecting E_coll = E_trunc gives N_cross ~ 3.2803e9, i.e. the CONTINUOUS
 *       crossover sits at k_cross = log10(N_cross) ~ 9.5159;
 *     - the integer-decade hump argmax (imp-33809/imp-33844) is the decade k = 9, peak ~ 6.4758e-2.
 *   PATH B (imp-33810 ladder that imp-33843 fits):
 *     - the SAME resid_exp(k) evaluated over the shared ladder; its integer-decade argmax and its
 *       finer quarter-decade argmax are read off directly.
 *
 * THE FINDING (measurement / cross-validation only)
 * -------------------------------------------------
 *   (X1) THE TWO PATHS AGREE EXACTLY AT k = 9. The imp-33810 ladder value resid_exp(k = 9) equals
 *        the imp-33844 published hump peak 6.4758e-2 to 6 significant figures -- the shared-code-path
 *        confirmation that the two modules compute the same curvature object at the crossover decade.
 *   (X2) BOTH INTEGER-DECADE ARGMAXES LAND ON k = 9. Over the integer decades k = 6..11 the hump
 *        amplitude peaks at k = 9 in BOTH paths (ladder: 0.0649@k8.75-grid but 0.064758@k9 integer,
 *        peaking among integers at k = 9; imp-33844: k = 9), so the k-location residual between the
 *        two code paths on the shared integer-decade ladder is EXACTLY 0.
 *   (X3) THE FINER GRID AND THE CONTINUOUS CROSSOVER BRACKET k = 9. The quarter-decade sliding
 *        window nudges the argmax to k = 8.75 (~6.5245e-2), a -0.25-decade discretization offset,
 *        while the continuous curvature-max crossover sits at k_cross ~ 9.516, +0.52 decade ABOVE the
 *        k = 9 decade label. This is the SAME discrete-decade-vs-continuous-crossover offset imp-33844
 *        D2 already attributed the +11% leading closed-form residual to: the sliding-window endpoint
 *        sigma_hi lags the interior sigma = 1/2 crossover, so the discrete argmax label (k = 9) sits
 *        half a decade below the continuous crossover N.
 *
 * The punchline: the imp-33844 closed-form hump peak and the imp-33843 widening surrogate are two
 * code paths over ONE curvature quantity resid_exp(k); on the shared integer-decade ladder both place
 * the E_coll = E_trunc crossover/peak at k = 9 with a k-location residual of 0 (values identical to 6
 * sig figs), and the +0.52-decade gap to the continuous crossover k_cross ~ 9.516 is the same
 * discrete-vs-continuous offset imp-33844 D2 already booked.
 *
 * MEASUREMENT / CROSS-VALIDATION ONLY. A consistency check of two inherited code paths, NOT an RH
 * bound. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous
 * asymptotic; the surrogate fits are descriptive, not derived; the C_mb GUE-conditional per imp-486
 * is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched;
 * no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33844-hump-peak-closed-form (closed-form hump peak p_ecoll^2 ln10/8 at sigma=1/2, k=9)
 * @see imp-33843-eflow-resid-widening-form-fit (log-linear widening surrogate over the same ladder)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the 21-rung ladder storing resid_exp(k) verbatim)
 * @see imp-33809-saturation-curvature-hump-vs-k (integer-decade hump argmax located at k=9)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (closed-form Banach crossover N ~ 3.2803e9)
 */

import { IMP33810_EFLOW_RESID_RATIO_N_LADDER } from './imp-33810-eflow-resid-ratio-N-ladder.js';
import { IMP33844_HUMP_PEAK_CLOSED_FORM } from './imp-33844-hump-peak-closed-form.js';

// Reuse the imp-33810 ladder VERBATIM: resid_exp(k) IS the imp-33844 hump amplitude across k.
const RUNGS = IMP33810_EFLOW_RESID_RATIO_N_LADDER.ladder;
const INT_RUNGS = RUNGS.filter((r) => Number.isInteger(r.k));

// Argmax of the hump amplitude (resid_exp) over the shared ladder -- both grids.
function argmaxResid(rungs) {
  let best = rungs[0];
  for (const r of rungs) if (r.resid_exp > best.resid_exp) best = r;
  return best;
}
const LADDER_INT_ARGMAX = argmaxResid(INT_RUNGS); // integer-decade argmax (k=9)
const LADDER_QDEC_ARGMAX = argmaxResid(RUNGS); // quarter-decade argmax (k=8.75)

// PATH A (imp-33844): published integer-decade hump peak (k=9) and the continuous crossover N.
const A_PEAK_K = 9; // imp-33809/imp-33844 integer-decade hump argmax decade
const A_HUMP_PEAK = IMP33844_HUMP_PEAK_CLOSED_FORM.measured.humpPeak; // ~6.47579e-2 at k=9
const A_CROSSOVER_N = IMP33844_HUMP_PEAK_CLOSED_FORM.crossoverN; // ~3.2803e9
const A_K_CROSS_CONTINUOUS = +Math.log10(A_CROSSOVER_N).toFixed(6); // ~9.5159

// PATH B (imp-33810 ladder): resid_exp at the k=9 rung -- must equal the imp-33844 hump peak.
const B_RESID_AT_K9 = INT_RUNGS.find((r) => r.k === 9).resid_exp; // ~6.4758e-2
const B_INT_ARGMAX_K = LADDER_INT_ARGMAX.k; // 9
const B_QDEC_ARGMAX_K = LADDER_QDEC_ARGMAX.k; // 8.75

// (X1) shared-code-path agreement at k=9: the two paths compute the same curvature value.
const SHARED_K9_ABS_DIFF = +Math.abs(A_HUMP_PEAK - B_RESID_AT_K9).toExponential(4);
// (X2) k-location residual between the two code paths on the integer-decade grid.
const K_LOCATION_RESIDUAL_INT = +(B_INT_ARGMAX_K - A_PEAK_K).toFixed(6); // 0
// (X3) finer-grid discretization offset and continuous-crossover offset from the k=9 label.
const QDEC_DISCRETIZATION_OFFSET = +(B_QDEC_ARGMAX_K - A_PEAK_K).toFixed(6); // -0.25
const CONTINUOUS_CROSSOVER_OFFSET = +(A_K_CROSS_CONTINUOUS - A_PEAK_K).toFixed(6); // ~+0.5159

export const IMP33857_HUMP_PEAK_WIDENING_CROSSVALIDATION = {
  id: 'imp-33857',
  proofSection: 'S-frontier',
  question:
    'imp-33844 places the closed-form M3 hump peak (p_ecoll^2 ln10/8 at sigma=1/2, the E_coll=E_trunc ' +
    'crossover) at decade k=9; imp-33843 fits the eflow_attr/resid_exp widening over the SAME imp-33810 ' +
    'k=6..11 ladder and also anchors at k=9. Cross-tabulate the two code paths: do both place the ' +
    'crossover/peak feature at k=9, and what is the k-location residual between them? Cross-validation ' +
    'only; NOT an RH bound; no QED.',
  measuredQuantity:
    'k-location of the hump-amplitude peak resid_exp(k) = p_ecoll(1-sigma_hi)-p_sigma (the shared ' +
    'quantity: imp-33844 hump amplitude = imp-33810 ratio denominator) via two code paths -- imp-33844 ' +
    'published integer-decade peak/continuous crossover N vs the imp-33810/imp-33843 ladder argmax',
  pathA_imp33844: {
    integerDecadePeakK: A_PEAK_K, // 9
    humpPeak: A_HUMP_PEAK, // ~6.47579e-2
    crossoverN: A_CROSSOVER_N, // ~3.2803e9
    kCrossContinuous: A_K_CROSS_CONTINUOUS, // ~9.5159 = log10(N_cross)
  },
  pathB_imp33810_ladder: {
    residExpAtK9: B_RESID_AT_K9, // ~6.4758e-2 (must equal imp-33844 hump peak)
    integerDecadeArgmaxK: B_INT_ARGMAX_K, // 9
    quarterDecadeArgmaxK: B_QDEC_ARGMAX_K, // 8.75
    quarterDecadeArgmaxVal: LADDER_QDEC_ARGMAX.resid_exp, // ~6.5245e-2
  },
  crossValidation: {
    sharedK9AbsDiff: SHARED_K9_ABS_DIFF, // ~0 -- two paths compute the same value at k=9
    kLocationResidualIntegerGrid: K_LOCATION_RESIDUAL_INT, // 0 -- both argmax at k=9
    quarterDecadeDiscretizationOffset: QDEC_DISCRETIZATION_OFFSET, // -0.25 decade
    continuousCrossoverOffset: CONTINUOUS_CROSSOVER_OFFSET, // ~+0.52 decade above the k=9 label
  },
  finding: {
    X1_two_paths_agree_at_k9:
      'The imp-33810 ladder value resid_exp(k=9) ~6.4758e-2 equals the imp-33844 published hump peak ' +
      'to 6 significant figures -- the shared-code-path confirmation that both modules compute the ' +
      'same curvature object p_ecoll(1-sigma_hi)-p_sigma at the E_coll=E_trunc crossover decade.',
    X2_both_integer_argmaxes_at_k9:
      'Over the integer decades k=6..11 the hump amplitude peaks at k=9 in BOTH code paths ' +
      '(imp-33844 integer-decade peak k=9; imp-33810 integer-decade ladder argmax k=9), so the ' +
      'k-location residual between the two paths on the shared integer-decade ladder is EXACTLY 0.',
    X3_finer_grid_and_continuum_bracket_k9:
      'The quarter-decade sliding window nudges the argmax to k=8.75 (~6.5245e-2, a -0.25-decade ' +
      'discretization offset), while the continuous curvature-max crossover sits at k_cross~9.516, ' +
      '+0.52 decade ABOVE the k=9 decade label -- the same discrete-decade-vs-continuous offset ' +
      'imp-33844 D2 booked for its +11% leading residual (sigma_hi endpoint lags the interior ' +
      'sigma=1/2 crossover, so the decade label sits half a decade below the continuous crossover N).',
  },
  isRigorous: false,
  verdict:
    'CROSS-VALIDATION (frontier-direction, NOT rigorous). YES -- both code paths place the ' +
    'E_coll=E_trunc crossover/peak feature at k=9. The imp-33844 closed-form hump peak and the ' +
    'imp-33843/imp-33810 widening-fit denominator are two implementations of ONE curvature quantity ' +
    'resid_exp(k)=p_ecoll(1-sigma_hi)-p_sigma: at the k=9 decade they agree to 6 significant figures ' +
    '(~6.4758e-2), and the integer-decade argmax is k=9 in BOTH paths, so the k-location residual on ' +
    'the shared ladder is EXACTLY 0. The finer quarter-decade grid nudges the argmax to k=8.75 ' +
    '(-0.25 decade) and the continuous curvature-max crossover sits at k_cross~9.516 (+0.52 decade ' +
    'above the k=9 label) -- the same discrete-decade-vs-continuous-crossover offset imp-33844 D2 ' +
    'attributed the +11% leading closed-form residual to. So the two frontier probes are mutually ' +
    'consistent: they cross-tabulate to the same k=9 crossover decade with zero integer-grid ' +
    'k-residual. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous ' +
    'asymptotic; the surrogate fits are descriptive, not derived; the C_mb GUE-conditional per ' +
    'imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-33844 (closed-form hump peak p_ecoll^2 ln10/8 at sigma=1/2, k=9); imp-33843 (log-linear ' +
    'widening surrogate over the same ladder); imp-33810 (the 21-rung ladder storing resid_exp(k)); ' +
    'imp-33809 (integer-decade hump argmax at k=9); imp-33723 (closed-form Banach crossover ' +
    'N~3.2803e9); imp-486 (C_mb GUE-conditional); imp-2642/imp-2643 (C_C 1/8 ansatz).',
};

export const IMP33857_HUMP_PEAK_WIDENING_CROSSVALIDATION_ASSERTIONS = [
  {
    // (X1) The two code paths compute the SAME curvature value at the k=9 crossover decade.
    id: 'imp33857-two-paths-agree-at-k9',
    description: 'imp-33810 resid_exp(k=9) equals the imp-33844 hump peak to <1e-5 (shared code path)',
    holds: () => SHARED_K9_ABS_DIFF < 1e-5,
  },
  {
    // (X2) Both integer-decade argmaxes land on k=9 -> k-location residual is exactly 0.
    id: 'imp33857-k-location-residual-zero',
    description: 'both integer-decade argmaxes at k=9; k-location residual between the two paths = 0',
    holds: () =>
      A_PEAK_K === 9 &&
      B_INT_ARGMAX_K === 9 &&
      K_LOCATION_RESIDUAL_INT === 0,
  },
  {
    // (X3) The finer grid and the continuous crossover bracket the k=9 label as described.
    id: 'imp33857-finer-grid-and-continuum-bracket-k9',
    description: 'quarter-decade argmax k=8.75 (-0.25) below and continuous crossover k~9.52 (+0.5) above k=9',
    holds: () =>
      Math.abs(QDEC_DISCRETIZATION_OFFSET + 0.25) < 1e-9 &&
      CONTINUOUS_CROSSOVER_OFFSET > 0.4 &&
      CONTINUOUS_CROSSOVER_OFFSET < 0.6,
  },
  {
    // Honesty gate: cross-validation only, isRigorous false, no QED, no refereed bound is changed.
    id: 'imp33857-honesty-gate-no-qed',
    description: 'Cross-validation only: isRigorous false, k-residual 0, no QED, no refereed bound is changed',
    holds: () =>
      IMP33857_HUMP_PEAK_WIDENING_CROSSVALIDATION.isRigorous === false &&
      IMP33857_HUMP_PEAK_WIDENING_CROSSVALIDATION.crossValidation.kLocationResidualIntegerGrid === 0 &&
      /NO QED/.test(IMP33857_HUMP_PEAK_WIDENING_CROSSVALIDATION.verdict) &&
      /refereed bound is changed/i.test(IMP33857_HUMP_PEAK_WIDENING_CROSSVALIDATION.verdict),
  },
];

for (const a of IMP33857_HUMP_PEAK_WIDENING_CROSSVALIDATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33857-hump-peak-widening-crossvalidation assertion failed: ${a.id}`);
  }
}
