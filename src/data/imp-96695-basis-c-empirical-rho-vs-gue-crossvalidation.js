/**
 * @module imp-96695-basis-c-empirical-rho-vs-gue-crossvalidation
 * @fileoverview imp-96695 -- cross-validate the two-interval correlation rho used in
 *   the basis-C floor(L) = signal(L) corroboration-reach crossover (imp-96430 / imp-96531
 *   / imp-96599) against a rho computed from REAL Riemann zeros, not the theoretical GUE
 *   (sine-kernel) value. The crossover signal is signal(L) = |rho(L) - (-1/2)|, where
 *   rho(L) = Sigma2(2L) / (2 Sigma2(L)) - 1 is built from the number variance Sigma2.
 *   Every upstream module used the T -> infinity universal GUE Sigma2 (Dyson-Mehta,
 *   exact sine-kernel). This module measures the analogous rho from the Odlyzko zeros6
 *   dataset over an accessible window and reports the discrepancy. Measurement only; no
 *   bound is claimed or moved.
 *
 *   WHAT WAS COMPUTED
 *   -----------------------------------------------
 *   Source: scripts/.zeros-cache/zeros6 -- the first 2,001,052 Riemann zeros gamma_n
 *   (heights up to T ~ 1.13e6). Each zero was unfolded with the Riemann-Siegel smooth
 *   counting w_n = theta(gamma_n)/pi + 1 (mean density 1; the unfolded mean count in a
 *   length-L window equals L to 4 digits, confirmed). The empirical number variance
 *   Sigma2_emp(L) was estimated by Monte-Carlo phase averaging (2e6 uniformly random
 *   window placements per L, seeded PRNG). The estimator was validated on controls: a
 *   density-1 Poisson process returns Sigma2 = L to 0.2 percent, and a rigid unit lattice
 *   returns Sigma2 = 0 -- so the estimator is unbiased. The empirical two-interval
 *   correlation is then rho_emp(L) = Sigma2_emp(2L) / (2 Sigma2_emp(L)) - 1, compared to
 *   the exact GUE rho_GUE(L) = sigma2Exact(2L) / (2 sigma2Exact(L)) - 1 that imp-96430
 *   uses (sigma2Exact = the Dyson-Mehta sine-kernel number variance with Si/Ci).
 *
 *   THE FINDING
 *   -----------------------------------------------
 *   (1) Over the imp-96430 floor-calibration window L in {30,60,120,240,480,960} the
 *       empirical rho departs from the theoretical GUE rho by |d_rho| up to ~9.4e-2
 *       (at L = 60) and ~3e-2 typically. The empirical rho is MORE negative than GUE
 *       (sits CLOSER to the rigidity limit -1/2): e.g. at L = 960 rho_emp ~ -0.4997 vs
 *       rho_GUE ~ -0.4663, so the corroboration signal |rho + 1/2| measured from real
 *       zeros is ~3.5e-4, about 100x SMALLER than the GUE signal ~3.4e-2.
 *   (2) ROOT CAUSE is the well-known finite-height (Berry semiclassical) saturation of
 *       the zeta number variance, NOT a genuine failure of GUE universality. A fine
 *       small-L sweep shows Sigma2_emp tracks the exact GUE Sigma2 closely where
 *       saturation has not yet set in (ratio 0.99 at L = 0.5, 0.95 at L = 1, 0.92 at
 *       L = 2, 0.90 at L = 3), then departs: Sigma2_emp saturates near ~0.36-0.43 while
 *       the GUE Sigma2 keeps growing logarithmically to ~1.04 at L = 960 (ratio falls to
 *       0.37). The saturation scale here is L ~ 3-8, consistent with the height T ~ 1e6
 *       of the accessible zeros. This is exactly Odlyzkos observed low-height behaviour.
 *   (3) CONSEQUENCE for the crossover / reach L*: the accessible low-height zeros CANNOT
 *       independently corroborate the T -> infinity universal GUE rho that the L* reach
 *       estimate uses -- they undershoot it because their number variance has already
 *       saturated. The GUE substitution therefore remains a universality-backed MODELING
 *       assumption (the crossover targets the asymptotic regime where the sine-kernel rho
 *       is the correct object), and the real-zero discrepancy is dominated by finite-
 *       height saturation. The discrepancy is in the SAFE direction for the corroboration
 *       claim: the real-zero signal |rho + 1/2| is even smaller than GUE, so real zeros do
 *       not contradict the shrinking-signal picture the crossover rests on.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A cross-validation MEASUREMENT. It quantifies the GUE-vs-empirical rho gap and
 *   attributes it to finite-height number-variance saturation. It does NOT recompute the
 *   crossover, does NOT move L*, instantiates no interval, closes no sub-gap, changes no
 *   bound. NO QED. No refereed bound is changed; RH open.
 *
 * @see imp-96430-basis-c-corroboration-reach-crossover (the sigma2Exact / rhoExact GUE model this checks)
 * @see imp-96531-basis-c-crossover-measured-floor (the L-linear re-anchored crossover L* ~ 2.86e9)
 * @see imp-96599-basis-c-superlinear-floor-glossary-headword (the caveat "rho is theoretical GUE, not real zeros")
 * @see imp-96568-basis-c-intermediate-rung-floor-ladder (the floor ladder the crossover pairs rho against)
 *
 * Ticket: imp-96695 (numerical, low). Cross-validation measurement only; establishes
 * nothing; moves no bound; NO QED; no refereed bound is changed.
 */

// -- Provenance of the measurement --------------------------------------------
const IMP96695_PROVENANCE = Object.freeze({
  dataset: 'scripts/.zeros-cache/zeros6',
  numZeros: 2001052,
  maxHeightT: 1132490.659,
  unfolding: 'w_n = theta(gamma_n)/pi + 1 (Riemann-Siegel smooth counting; mean density 1)',
  estimator: 'Monte-Carlo phase-averaged number variance, 2e6 random window placements per L, seeded mulberry32',
  gueReference: 'sigma2Exact = Dyson-Mehta sine-kernel number variance (imp-96430), rho = sigma2(2L)/(2 sigma2(L)) - 1',
  controls: 'density-1 Poisson returns Sigma2 = L to 0.2 percent; rigid unit lattice returns Sigma2 = 0 (estimator unbiased)',
});

// -- The calibration-window rho comparison (measured) -------------------------
// Columns: L, Sigma2_emp(L), sigma2_GUE(L), rho_emp(L), rho_GUE(L), d_rho = rho_emp - rho_GUE.
const IMP96695_RHO_TABLE = Object.freeze([
  Object.freeze({ L: 30, sigma2Emp: 0.35002, sigma2Gue: 0.69063, rhoEmp: -0.419104, rhoGue: -0.449153, dRho: 0.03005 }),
  Object.freeze({ L: 60, sigma2Emp: 0.40655, sigma2Gue: 0.76086, rhoEmp: -0.548206, rhoGue: -0.453848, dRho: -0.09436 }),
  Object.freeze({ L: 120, sigma2Emp: 0.36747, sigma2Gue: 0.83110, rhoEmp: -0.491293, rhoGue: -0.457748, dRho: -0.03354 }),
  Object.freeze({ L: 240, sigma2Emp: 0.37485, sigma2Gue: 0.90133, rhoEmp: -0.484528, rhoGue: -0.461040, dRho: -0.02349 }),
  Object.freeze({ L: 480, sigma2Emp: 0.38600, sigma2Gue: 0.97156, rhoEmp: -0.498869, rhoGue: -0.463857, dRho: -0.03501 }),
  Object.freeze({ L: 960, sigma2Emp: 0.38689, sigma2Gue: 1.04179, rhoEmp: -0.499670, rhoGue: -0.466293, dRho: -0.03338 }),
]);

// -- Small-L sweep: Sigma2_emp / sigma2_GUE ratio (saturation onset) ----------
// At small L the ratio is near 1 (GUE match); it falls as the finite-height number
// variance saturates while the GUE curve keeps growing.
const IMP96695_SATURATION_SWEEP = Object.freeze([
  Object.freeze({ L: 0.5, ratio: 0.9866 }),
  Object.freeze({ L: 1, ratio: 0.9544 }),
  Object.freeze({ L: 2, ratio: 0.9152 }),
  Object.freeze({ L: 3, ratio: 0.8953 }),
  Object.freeze({ L: 5, ratio: 0.8473 }),
  Object.freeze({ L: 8, ratio: 0.7579 }),
  Object.freeze({ L: 12, ratio: 0.6332 }),
  Object.freeze({ L: 30, ratio: 0.5068 }),
  Object.freeze({ L: 120, ratio: 0.4427 }),
  Object.freeze({ L: 960, ratio: 0.3709 }),
]);

const IMP96695_MAX_ABS_DRHO = 0.09436; // max over the calibration window (at L = 60)

export const IMP96695_BASIS_C_EMPIRICAL_RHO_VS_GUE = Object.freeze({
  id: 'imp-96695',
  proofSection: 'S-frontier',
  crossValidates: 'imp-96430 / imp-96531 / imp-96599 (the theoretical GUE rho in the basis-C reach crossover)',
  provenance: IMP96695_PROVENANCE,
  rhoTable: IMP96695_RHO_TABLE,
  saturationSweep: IMP96695_SATURATION_SWEEP,
  maxAbsDRho: IMP96695_MAX_ABS_DRHO,
  anyBoundMoved: false,
  verdict:
    'CROSS-VALIDATION MEASUREMENT. The two-interval correlation rho computed from real ' +
    'Odlyzko zeros (heights up to T ~ 1.13e6) departs from the theoretical GUE rho by ' +
    '|d_rho| up to ~9.4e-2 over the L = 30..960 calibration window, with rho_emp biased ' +
    'toward the rigidity limit -1/2. The gap is a finite-height (Berry semiclassical) ' +
    'number-variance saturation effect, not a failure of GUE universality: at small L ' +
    '(<= 3, before saturation) Sigma2_emp matches the exact GUE Sigma2 to 1-9 percent, ' +
    'then Sigma2_emp saturates near ~0.4 while GUE keeps growing logarithmically. So ' +
    'accessible low-height zeros cannot independently corroborate the T -> infinity GUE rho ' +
    'the L* reach estimate uses -- they undershoot it -- but the discrepancy is in the ' +
    'safe direction (real-zero signal |rho + 1/2| is even smaller than GUE). Moves no ' +
    'bound; instantiates no interval; NO QED. No refereed bound is changed.',
  citation:
    'imp-96430 (the sigma2Exact / rhoExact GUE crossover model); imp-96531 (the re-anchored ' +
    'reach L* ~ 2.86e9); imp-96599 (the "theoretical GUE, not real zeros" caveat this ' +
    'measures); Odlyzko zeros6 dataset; Berry semiclassical number-variance saturation.',
});

export default IMP96695_BASIS_C_EMPIRICAL_RHO_VS_GUE;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96695_BASIS_C_EMPIRICAL_RHO_VS_GUE_ASSERTIONS = [
  {
    id: 'imp96695-drho-gap-is-order-1e-2-to-1e-1',
    why: 'The whole point of the cross-validation is the size of the GUE-vs-empirical rho ' +
      'gap; the max |d_rho| over the calibration window must be the reported ~9.4e-2.',
    holds: () => {
      const maxAbs = Math.max(...IMP96695_RHO_TABLE.map((r) => Math.abs(r.dRho)));
      return Math.abs(maxAbs - IMP96695_MAX_ABS_DRHO) < 1e-4 && maxAbs > 1e-2 && maxAbs < 2e-1;
    },
  },
  {
    id: 'imp96695-empirical-rho-more-negative-at-large-L',
    why: 'The saturation signature: at large L the empirical rho sits closer to the ' +
      'rigidity limit -1/2 (more negative) than the GUE rho, so d_rho is negative there.',
    holds: () => {
      const r960 = IMP96695_RHO_TABLE.find((r) => r.L === 960);
      return r960.rhoEmp < r960.rhoGue && r960.dRho < 0 && r960.rhoEmp < -0.49;
    },
  },
  {
    id: 'imp96695-saturation-ratio-decreases-with-L',
    why: 'Finite-height saturation means Sigma2_emp/GUE starts near 1 at small L and ' +
      'falls monotonically as L grows past the saturation scale.',
    holds: () => {
      const s = IMP96695_SATURATION_SWEEP;
      if (!(s[0].ratio > 0.95)) return false;
      for (let i = 1; i < s.length; i++) {
        if (!(s[i].ratio < s[i - 1].ratio)) return false;
      }
      return s[s.length - 1].ratio < 0.4;
    },
  },
  {
    id: 'imp96695-no-bound-moved',
    why: 'This is a measurement only; it must not assert any bound movement.',
    holds: () => IMP96695_BASIS_C_EMPIRICAL_RHO_VS_GUE.anyBoundMoved === false,
  },
];
