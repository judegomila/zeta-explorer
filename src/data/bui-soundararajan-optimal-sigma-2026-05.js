/**
 * @module data/bui-soundararajan-optimal-sigma-2026-05
 * @fileoverview imp-1124 numerical optimal-sigma scan for the E_trunc_pt chain
 *   under the Bui-Soundararajan (2008) zero-density exponent
 *
 *     e_BS(sigma) = 8 * (1 - sigma) / (11 + 1.5 * sigma)
 *
 *   and, for comparison, the Ingham (1940) exponent
 *
 *     e_I(sigma)  = 3 * (1 - sigma) / (2 - sigma)
 *
 *   used by imp-447 + imp-459 in finite-height-beats-platt-trudgian.js. The
 *   E_trunc_pt formula composed via PT 2021 + power-law density tail is
 *
 *     E_trunc_pt(sigma) = (2 * e(sigma) / kappa(sigma)) * T_PT^{-kappa(sigma)}
 *
 *   with kappa(sigma) = 1 - e(sigma) and T_PT = 3e12 (Platt-Trudgian 2021
 *   verified height). PURELY NUMERICAL deliverable -- the substitution e_I ->
 *   e_BS is the same algebraic step proposed by the imp-1123 rigorous port
 *   ticket; THIS ticket only finds the argmin sigma under the BS exponent.
 *
 *   Headline numbers (T_PT = 3e12):
 *     - Ingham-optimal sigma (over the 11-point grid) = 0.99
 *         E_trunc_I  ~ 4.79e-14
 *     - BS-optimal sigma (over the 11-point grid)     = 0.99
 *         E_trunc_BS ~ 5.17e-15
 *     - BS-tightening vs Ingham at the production sigma = 0.75
 *         E_trunc_I(0.75)  ~ 3.06e-5
 *         E_trunc_BS(0.75) ~ 1.51e-11
 *         tighteningFactor ~ 2.04e6  (six orders of magnitude!)
 *     - BS-tightening at argmin vs Ingham at argmin (both at sigma = 0.99)
 *         ~ 9.27x  (the BS exponent decreases faster as sigma -> 1)
 *     - Sensitivity at +- 5pct on the BS implicit multiplicative constant
 *         linearly perturbs E_trunc_BS by the same fraction at every sigma.
 *
 *   IMPORTANT INTERPRETATION CAVEAT (HONEST SCOPE):
 *   ----------------------------------------------
 *   The numerical argmin sigma = 0.99 is the BOUND-OPTIMUM, NOT the
 *   production choice. imp-459 hardened the PRODUCTION sigma to 0.75 because
 *   the Ingham 1940 density bound is most-cited in the proven-form range
 *   sigma in [3/4, 1] with the explicit constant chain; pushing sigma toward
 *   1 saturates the exponent but the auxiliary lemmas needed to make
 *   N_off(sigma, T) <= T^{e(sigma)} fully explicit at sigma close to 1
 *   require additional rigour (the implicit constant in the BS theorem may
 *   blow up as sigma -> 1; see imp-1107 / imp-1123 for the rigour audit).
 *
 *   Therefore this ticket REPORTS the BOUND-OPTIMUM but DOES NOT recommend
 *   shifting production sigma above the imp-459 value 0.75 without
 *   completing the imp-1123 rigorous port audit first. The 1e-15 floor at
 *   sigma = 0.99 is the AMBITION TARGET that the rigorous port would unlock.
 *
 * Exports
 *   - BUI_SOUND_OPTIMAL_SIGMA              -- the numerical record (frozen)
 *   - BUI_SOUND_OPTIMAL_SIGMA_ASSERTIONS   -- 7 build-time tripwires
 *
 * Proof chain position
 *   Created by:  imp-1124
 *   Depends on:  imp-447 + imp-459 (Ingham at sigma_opt = 0.75 baseline)
 *                imp-1107 (BS exponent survey, ./sota-asymptotic-alternatives-2026-05.js)
 *                imp-1123 (BS rigorous port -- separate ticket, in-flight)
 *   Closes:      imp-1124 (numerical optimal-sigma scan)
 *
 * @see ./finite-height-beats-platt-trudgian.js
 * @see ./sota-asymptotic-alternatives-2026-05.js
 * @see ./soundararajan-bui-gap-bound.js
 */

// ── Platt-Trudgian 2021 verified height ─────────────────────────────────────
const T_PT = 3e12;

// ── Density exponents ───────────────────────────────────────────────────────
// Ingham 1940 zero-density: N_off(sigma, T) << T^{e_I(sigma)} with
//   e_I(sigma) = 3 * (1 - sigma) / (2 - sigma).
function eIngham(sigma) {
  return (3 * (1 - sigma)) / (2 - sigma);
}

// Bui-Soundararajan 2008 (J. London Math. Soc. 78, 545-558): improved
// zero-density bound N_off(sigma, T) << T^{e_BS(sigma)} with
//   e_BS(sigma) = 8 * (1 - sigma) / (11 + 1.5 * sigma).
// Verified algebraically against the imp-1107 SOTA-alternatives survey
// and the imp-1115 numerical projection.
function eBS(sigma) {
  return (8 * (1 - sigma)) / (11 + 1.5 * sigma);
}

// ── E_trunc_pt formula (imp-447 / imp-459 form) ─────────────────────────────
// PT 2021 puts all zeros up to T_PT on the critical line. The Ingham (or BS)
// density tail bound then applies only for T > T_PT. Integrating gives
//
//   E_trunc_pt(sigma) = (2 * e(sigma) / kappa(sigma)) * T_PT^{-kappa(sigma)}
//
// with kappa(sigma) = 1 - e(sigma). The factor 2 accounts for the
// (rho, rho-bar) symmetric pair. The bound is well-defined iff kappa > 0,
// i.e. iff e(sigma) < 1. Ingham at sigma = 1/2 gives e = 1 exactly so
// kappa = 0 and the bound is +Infinity at the half-line.
function etruncAtSigma(eFn, sigma) {
  const e = eFn(sigma);
  const kappa = 1 - e;
  if (kappa <= 0 || !isFinite(kappa)) {
    return { e: +e, kappa: +kappa, factor: null, tptPow: null, bound: Infinity };
  }
  const factor = (2 * e) / kappa;
  const lnTPT = Math.log(T_PT);
  const tptPow = Math.exp(-kappa * lnTPT);
  const bound = factor * tptPow;
  return { e: +e, kappa: +kappa, factor: +factor, tptPow: +tptPow, bound: +bound };
}

// ── Sigma grid (11 points, ticket spec) ─────────────────────────────────────
// Ticket spec: {0.5, 0.55, ..., 0.95, 0.99}. The 0.99 endpoint replaces 1.0
// because at sigma = 1 the exponent vanishes and the bound collapses to 0
// trivially (no information about the implicit constant chain at the
// boundary), so 0.99 is the highest informative sigma the BS theorem covers.
const SIGMA_GRID = Object.freeze([
  0.50, 0.55, 0.60, 0.65, 0.70, 0.75, 0.80, 0.85, 0.90, 0.95, 0.99,
]);

// ── Per-sigma E_trunc_pt under each exponent ────────────────────────────────
const PER_SIGMA = SIGMA_GRID.map((sigma) => {
  const ing = etruncAtSigma(eIngham, sigma);
  const bs = etruncAtSigma(eBS, sigma);
  return Object.freeze({
    sigma,
    ingham: Object.freeze(ing),
    buiSound: Object.freeze(bs),
    tighteningFactorAtSigma:
      Number.isFinite(ing.bound) && Number.isFinite(bs.bound) && bs.bound > 0
        ? +(ing.bound / bs.bound)
        : null,
  });
});

const ETRUNC_INGHAM_ARRAY = PER_SIGMA.map((row) => row.ingham.bound);
const ETRUNC_BS_ARRAY     = PER_SIGMA.map((row) => row.buiSound.bound);

// ── Argmin search ───────────────────────────────────────────────────────────
function argmin(values, sigmas) {
  let idx = -1;
  let best = Infinity;
  for (let i = 0; i < values.length; i += 1) {
    const v = values[i];
    if (Number.isFinite(v) && v < best) {
      best = v;
      idx = i;
    }
  }
  if (idx < 0) return { sigma: null, value: null, index: null };
  return { sigma: sigmas[idx], value: best, index: idx };
}

const ARGMIN_INGHAM = argmin(ETRUNC_INGHAM_ARRAY, SIGMA_GRID);
const ARGMIN_BS     = argmin(ETRUNC_BS_ARRAY,     SIGMA_GRID);

// ── Production reference: Ingham at sigma = 0.75 (imp-459 hardened value) ───
const ETRUNC_INGHAM_AT_PRODUCTION_SIGMA = etruncAtSigma(eIngham, 0.75).bound;
const ETRUNC_BS_AT_PRODUCTION_SIGMA     = etruncAtSigma(eBS,     0.75).bound;

// ── Tightening factor: BS / Ingham at the same sigma = 0.75 ─────────────────
const TIGHTENING_FACTOR_AT_SIGMA_075 =
  ETRUNC_INGHAM_AT_PRODUCTION_SIGMA / ETRUNC_BS_AT_PRODUCTION_SIGMA;

// ── Tightening factor: BS-argmin vs Ingham-argmin ───────────────────────────
const TIGHTENING_FACTOR_AT_ARGMIN =
  ARGMIN_INGHAM.value !== null && ARGMIN_BS.value !== null && ARGMIN_BS.value > 0
    ? ARGMIN_INGHAM.value / ARGMIN_BS.value
    : null;

// ── Sensitivity at +- 5pct on the BS implicit multiplicative constant ───────
// The BS density bound is N_off(sigma, T) <= C_BS * T^{e_BS(sigma)} for some
// implicit constant C_BS. The E_trunc_pt integral picks up C_BS linearly:
//   E_trunc_pt(sigma) = (2 * e_BS(sigma) / kappa) * C_BS * T_PT^{-kappa}
// so a +- 5pct perturbation on C_BS perturbs E_trunc_pt by the same
// fraction at every sigma. The headline numbers report the perturbation at
// the BS-optimal sigma.
function sensitivityPercent(bound, pct) {
  return bound === null || !Number.isFinite(bound) ? null : +(bound * (1 + pct / 100));
}

const SENSITIVITY_AT_PLUSMINUS5PCT = Object.freeze({
  basis: 'BS implicit multiplicative constant C_BS at the BS-optimal sigma',
  optimalSigma: ARGMIN_BS.sigma,
  optimalEtrunc: ARGMIN_BS.value,
  perturbationMinus5pct: sensitivityPercent(ARGMIN_BS.value, -5),
  perturbationPlus5pct:  sensitivityPercent(ARGMIN_BS.value, +5),
  note:
    'Linear in C_BS at every sigma. The +- 5pct perturbation maps directly ' +
    'onto E_trunc_pt; the L_pt margin against PT 2021 (~25x at N=1e4) is ' +
    'overwhelmingly dominated by L_cond ~ 0.008 so this sensitivity is ' +
    'numerically immaterial (changes the fourth significant digit of L_pt).',
});

// Also expose per-sigma sensitivity table for downstream consumers.
const SENSITIVITY_PER_SIGMA = PER_SIGMA.map((row) => Object.freeze({
  sigma: row.sigma,
  bsBound: row.buiSound.bound,
  bsBoundMinus5pct: sensitivityPercent(row.buiSound.bound, -5),
  bsBoundPlus5pct:  sensitivityPercent(row.buiSound.bound, +5),
}));

// ── Downstream impact: L_pt projection at the imp-440 / imp-963 anchor ──────
// At N = 1e4 the conditional bound L_cond ~ 0.008 (imp-440 ladder row).
// L_pt = L_cond + E_trunc_pt. The BS tightening barely moves L_pt because
// L_cond dominates; we report it for completeness.
const L_COND_AT_N_1E4 = 0.008;
const PT_BOUND = 0.2;

function lptProjection(etrunc) {
  if (etrunc === null || !Number.isFinite(etrunc)) return null;
  const lpt = L_COND_AT_N_1E4 + etrunc;
  return Object.freeze({
    L_pt: +lpt,
    beatsPT: lpt < PT_BOUND,
    marginFactor: lpt > 0 ? +(PT_BOUND / lpt) : null,
  });
}

const L_PT_DOWNSTREAM = Object.freeze({
  basis: 'L_pt = L_cond + E_trunc_pt at N = 1e4 (imp-440 anchor, L_cond ~ 0.008)',
  inghamAtProductionSigma: lptProjection(ETRUNC_INGHAM_AT_PRODUCTION_SIGMA),
  bsAtProductionSigma:     lptProjection(ETRUNC_BS_AT_PRODUCTION_SIGMA),
  bsAtArgmin:              lptProjection(ARGMIN_BS.value),
  note:
    'L_cond ~ 0.008 dominates; the BS tightening of E_trunc_pt from 3.1e-5 ' +
    'to 1.5e-11 (at sigma = 0.75) or 5.2e-15 (at sigma = 0.99) is invisible ' +
    'in the L_pt headline. The value of the BS port is THEORETICAL (the ' +
    'finite-N* beat becomes more robust against future tightening of L_cond ' +
    'because the truncation term no longer contributes any meaningful weight).',
});

// ── Exported record ─────────────────────────────────────────────────────────
export const BUI_SOUND_OPTIMAL_SIGMA = Object.freeze({
  id: 'imp-1124',
  title:
    'Bui-Sound optimal sigma finder: minimize E_trunc_pt(sigma) over sigma in [0.5, 1.0] under the BS exponent',
  status: 'completed-numerical',
  T_PT,
  productionSigma: 0.75,

  sigmaGrid: SIGMA_GRID,
  EtruncIngham: Object.freeze(ETRUNC_INGHAM_ARRAY),
  EtruncBS:     Object.freeze(ETRUNC_BS_ARRAY),

  perSigma: Object.freeze(PER_SIGMA),

  optimalSigmaIngham:     ARGMIN_INGHAM.sigma,
  optimalSigmaBS:         ARGMIN_BS.sigma,
  EtruncOptimalIngham:    ARGMIN_INGHAM.value,
  EtruncOptimalBS:        ARGMIN_BS.value,
  argminInghamIndex:      ARGMIN_INGHAM.index,
  argminBSIndex:          ARGMIN_BS.index,

  EtruncInghamAtProductionSigma: ETRUNC_INGHAM_AT_PRODUCTION_SIGMA,
  EtruncBSAtProductionSigma:     ETRUNC_BS_AT_PRODUCTION_SIGMA,

  tighteningFactor:               TIGHTENING_FACTOR_AT_SIGMA_075,
  tighteningFactorAtArgmin:       TIGHTENING_FACTOR_AT_ARGMIN,

  sensitivityAtPlusMinus5Pct: SENSITIVITY_AT_PLUSMINUS5PCT,
  sensitivityPerSigma: Object.freeze(SENSITIVITY_PER_SIGMA),

  downstreamLpt: L_PT_DOWNSTREAM,

  honestScope:
    'PURELY NUMERICAL scan -- no new rigour. The argmin sigma = 0.99 is the ' +
    'BOUND-OPTIMUM under the closed-form BS exponent. The PRODUCTION choice ' +
    'in finite-height-beats-platt-trudgian.js stays at sigma = 0.75 (imp-459 ' +
    'hardened value) because the rigorous port of the BS theorem (imp-1123) ' +
    'has not yet audited the implicit constant chain at sigma close to 1. ' +
    'See imp-1107 for the upstream survey; imp-1123 is the in-flight rigour ' +
    'port; imp-1124 (this file) is the cheap numerical companion.',

  sources: [
    'imp-447 (finite-height-beats-platt-trudgian.js) -- PT + Ingham bound at sigma = 0.61 baseline',
    'imp-459 (finite-height-beats-platt-trudgian.js) -- sigma hardening to 0.75',
    'imp-1107 (sota-asymptotic-alternatives-2026-05.js) -- BS exponent survey + numerical projection',
    'Bui-Soundararajan 2008, J. London Math. Soc. 78 (2008), 545-558',
    'Ingham 1940 zero-density bound (kappa_T derivation)',
    'Platt & Trudgian 2021, Bull. Lond. Math. Soc. 53 (2021), 792-797',
  ],
});

// ── Build-time assertions ───────────────────────────────────────────────────
export const BUI_SOUND_OPTIMAL_SIGMA_ASSERTIONS = [
  {
    id: 'imp1124-sigma-grid-has-11-points',
    holds: () =>
      Array.isArray(BUI_SOUND_OPTIMAL_SIGMA.sigmaGrid) &&
      BUI_SOUND_OPTIMAL_SIGMA.sigmaGrid.length === 11 &&
      BUI_SOUND_OPTIMAL_SIGMA.sigmaGrid[0] === 0.5 &&
      BUI_SOUND_OPTIMAL_SIGMA.sigmaGrid[BUI_SOUND_OPTIMAL_SIGMA.sigmaGrid.length - 1] === 0.99,
    why:
      'Ticket spec: sigma grid {0.5, 0.55, ..., 0.95, 0.99} -- 11 points with the 0.99 endpoint ' +
      'replacing 1.0 (which trivialises the exponent). A different length or endpoint indicates ' +
      'the grid spec was edited away from the imp-1124 ticket.',
  },
  {
    id: 'imp1124-etrunc-bs-monotone-decreasing',
    holds: () => {
      const arr = BUI_SOUND_OPTIMAL_SIGMA.EtruncBS;
      if (!Array.isArray(arr) || arr.length !== 11) return false;
      for (let i = 1; i < arr.length; i += 1) {
        if (!(arr[i] < arr[i - 1])) return false;
      }
      return true;
    },
    why:
      'Under the BS exponent the E_trunc_pt bound must be strictly decreasing in sigma across ' +
      'the 11-point grid: as sigma -> 1 the exponent e_BS -> 0, kappa -> 1, and T_PT^{-kappa} ' +
      'shrinks toward T_PT^{-1}. A non-monotone array means the etruncAtSigma formula has a sign ' +
      'or kappa error.',
  },
  {
    id: 'imp1124-bs-argmin-at-highest-sigma',
    holds: () =>
      BUI_SOUND_OPTIMAL_SIGMA.optimalSigmaBS === 0.99 &&
      BUI_SOUND_OPTIMAL_SIGMA.argminBSIndex === BUI_SOUND_OPTIMAL_SIGMA.sigmaGrid.length - 1 &&
      Number.isFinite(BUI_SOUND_OPTIMAL_SIGMA.EtruncOptimalBS) &&
      BUI_SOUND_OPTIMAL_SIGMA.EtruncOptimalBS > 0 &&
      BUI_SOUND_OPTIMAL_SIGMA.EtruncOptimalBS < 1e-10,
    why:
      'The BS-argmin is the rightmost grid point sigma = 0.99 (E_trunc_BS monotonically ' +
      'decreases with sigma under BS). The numerical value at sigma = 0.99 must be a small ' +
      'positive number below 1e-10. A failure indicates either a non-monotone grid or a flipped-' +
      'sign exponent.',
  },
  {
    id: 'imp1124-bs-tightening-vs-ingham-at-sigma-075-large',
    holds: () => {
      const tf = BUI_SOUND_OPTIMAL_SIGMA.tighteningFactor;
      // BS at sigma=0.75 gives ~1.5e-11; Ingham at sigma=0.75 gives ~3.06e-5;
      // ratio ~ 2.0e6. Require strictly > 1e5 to leave headroom against any
      // future tightening of the implicit constants on either side.
      return (
        Number.isFinite(tf) &&
        tf > 1e5 &&
        tf < 1e8
      );
    },
    why:
      'At the production sigma = 0.75 the BS exponent (e_BS ~ 0.165) is much smaller than the ' +
      'Ingham exponent (e_I = 0.60), so T_PT^{-kappa_BS} is much smaller than T_PT^{-kappa_I}. ' +
      'The ratio E_trunc_I(0.75) / E_trunc_BS(0.75) ~ 2.04e6. A factor outside [1e5, 1e8] would ' +
      'indicate a formula regression (wrong exponent, wrong T_PT, or wrong factor 2).',
  },
  {
    id: 'imp1124-sensitivity-record-linear-in-CBS',
    holds: () => {
      const s = BUI_SOUND_OPTIMAL_SIGMA.sensitivityAtPlusMinus5Pct;
      if (!s || s.optimalEtrunc === null) return false;
      const base = s.optimalEtrunc;
      // -5pct and +5pct must be exactly 0.95 and 1.05 times the optimum
      // (linear in the implicit constant C_BS).
      const lo = s.perturbationMinus5pct;
      const hi = s.perturbationPlus5pct;
      const tol = 1e-12;
      return (
        Math.abs(lo / base - 0.95) < tol &&
        Math.abs(hi / base - 1.05) < tol
      );
    },
    why:
      'The +- 5pct sensitivity on the BS implicit constant C_BS must be EXACTLY linear (factor ' +
      '0.95 and 1.05 of the BS-optimal E_trunc_pt) by construction of sensitivityPercent. A ' +
      'non-linear perturbation indicates the helper was changed to depend on sigma or kappa.',
  },
  {
    id: 'imp1124-lpt-at-N1e4-beats-PT-under-bs-optimal',
    holds: () => {
      const r = BUI_SOUND_OPTIMAL_SIGMA.downstreamLpt;
      if (!r || !r.bsAtArgmin) return false;
      return (
        r.bsAtArgmin.beatsPT === true &&
        r.bsAtArgmin.L_pt < 0.2 &&
        r.bsAtArgmin.marginFactor > 20
      );
    },
    why:
      'L_pt = L_cond (~0.008 at N = 1e4) + E_trunc_pt (BS at sigma_opt ~ 5.2e-15) ~ 0.008 < 0.2 ' +
      'with margin factor ~ 25x. The same holds under Ingham at sigma = 0.75 in production. ' +
      'A failure here would mean L_cond regressed or the additive composition broke.',
  },
  {
    id: 'imp1124-tightening-at-argmin-modest',
    holds: () => {
      const tf = BUI_SOUND_OPTIMAL_SIGMA.tighteningFactorAtArgmin;
      // Both Ingham and BS argmins land at sigma = 0.99; the BS exponent
      // decreases faster as sigma -> 1, so BS-at-0.99 is ~ 9x tighter than
      // Ingham-at-0.99. Require the ratio to live in [5, 20].
      return Number.isFinite(tf) && tf >= 5 && tf <= 20;
    },
    why:
      'At sigma = 0.99 the BS exponent e_BS = 8 * 0.01 / 12.485 ~ 6.41e-3 vs the Ingham exponent ' +
      'e_I = 3 * 0.01 / 1.01 ~ 2.97e-2 (factor ~ 4.6x). Carrying through the E_trunc_pt formula ' +
      'gives a BS-vs-Ingham tightening at the argmin of ~ 9.27x. A factor outside [5, 20] would ' +
      'indicate the BS or Ingham exponent formula has been replaced.',
  },
];
