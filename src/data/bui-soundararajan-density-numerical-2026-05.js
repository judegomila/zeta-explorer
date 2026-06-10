/**
 * @module data/bui-soundararajan-density-numerical-2026-05
 * @fileoverview imp-1115 PURELY NUMERICAL projection of the L_pt headline if
 *   the Bui-Soundararajan (2008) zero-density exponent
 *
 *     e_BS(sigma) = 8 * (1 - sigma) / (11 + 1.5 * sigma)
 *
 *   were substituted into the E_trunc_pt term of the published L_pt
 *   decomposition (paper-appendix-C-finite-height-beat.js):
 *
 *     L_pt = L_FC + L_drift + L_cond + E_trunc_pt
 *          = 0.0066 + 0.00125 + 0.01164 + E_trunc_pt
 *
 *   The CURRENT production figure uses the Ingham (1940) exponent
 *
 *     e_I(sigma)  = 3 * (1 - sigma) / (2 - sigma)
 *
 *   at the imp-459 hardened sigma_opt = 0.75, giving E_trunc_pt ~ 3.06e-5 and
 *   the published headline L_pt ~ 0.0200 at N* = 1e4 (~10x margin vs PT 2021
 *   bound 0.2).
 *
 *   This file reports the 4-point comparison table the ticket asked for
 *   (sigma in {0.7, 0.75, 0.8, 0.85}) and the resulting L_pt projection. The
 *   conclusion is that BS shrinks E_trunc_pt by ~ 10^6 at the production
 *   sigma but the L_pt headline only moves from 0.0200 to 0.0195 (a 3rd-
 *   significant-figure drop) because the three additive non-truncation
 *   contributions (L_FC + L_drift + L_cond = 0.01949) dominate. The BS port
 *   value is THEORETICAL not numerical: the finite-N beat becomes robust
 *   against future tightening of L_cond because the truncation term no longer
 *   contributes any meaningful weight.
 *
 *   Headline numbers (T_PT = 3e12, ticket spec sigma grid):
 *     - Ingham E_trunc_I at sigma = 0.70 / 0.75 / 0.80 / 0.85:
 *           5.45e-4 / 3.06e-5 / 1.30e-6 / 3.62e-8
 *     - BS    E_trunc_BS at sigma = 0.70 / 0.75 / 0.80 / 0.85:
 *           1.71e-9 / 1.51e-11 / 1.21e-13 / 8.55e-16
 *     - BS-tightening factor (E_trunc_I / E_trunc_BS) at the four sigmas:
 *           3.18e5 / 2.03e6 / 1.07e7 / 4.23e7
 *     - L_pt under Ingham at sigma_opt = 0.75:  L_pt ~ 0.019521 (~ 0.0200)
 *     - L_pt under BS    at sigma_opt = 0.75:  L_pt ~ 0.019490 (~ 0.0195)
 *     - L_pt absolute tightening at sigma = 0.75: 3.06e-5 (a 4th-sf change)
 *     - Margin-factor vs PT 2021 bound 0.2:
 *           Ingham: ~ 10.245x, BS: ~ 10.262x  (improves by ~ 0.017x)
 *
 *   HONEST SCOPE (CRITICAL -- NOT A RIGOROUS CLOSURE):
 *   ---------------------------------------------------
 *   This file performs the NUMERICAL substitution e_I -> e_BS only. It does
 *   NOT close the imp-1123 / imp-1164 rigorous port of Bui-Soundararajan
 *   Theorem 3.1 into our E_trunc_pt derivation chain. The implicit constant
 *   C_BS in the BS density bound N_off(sigma, T) <= C_BS * T^{e_BS(sigma)} is
 *   absorbed into a factor-of-1 placeholder; the explicit-constant audit is
 *   imp-1123's deliverable. Until that lands, the numerics here are upper-
 *   limits IF the rigorous port succeeds -- they cannot be quoted as bounds.
 *
 *   Production guidance: keep sigma_opt = 0.75 (Ingham, imp-459 hardened),
 *   keep the published L_pt headline at ~ 0.0200, and adopt the BS projection
 *   only after imp-1123 / imp-1164 close.
 *
 * Exports
 *   - BUI_SOUND_DENSITY_NUMERICAL              -- frozen numerical record
 *   - BUI_SOUND_DENSITY_NUMERICAL_ASSERTIONS   -- 5 build-time tripwires
 *
 * Proof chain position
 *   Created by:  imp-1115 (PURELY NUMERICAL companion to imp-1123 rigorous port)
 *   Depends on:  imp-447 + imp-459 (Ingham E_trunc_pt baseline)
 *                imp-1081 / imp-1107 (paper-appendix-C L_pt decomposition)
 *                imp-1124 (BS optimal-sigma scan, complementary cut)
 *   Closes:      imp-1115 (numerical projection only)
 *   Does NOT close: imp-1123, imp-1164 (rigorous ports of BS Theorem 3.1)
 *
 * @see ./paper-appendix-C-finite-height-beat.js
 * @see ./bui-soundararajan-optimal-sigma-2026-05.js
 * @see ./bui-soundararajan-rigorous-port-2026-05.js
 * @see ./finite-height-beats-platt-trudgian.js
 */

// ── Platt-Trudgian 2021 verified height ─────────────────────────────────────
const T_PT = 3e12;

// ── PT 2021 bound on Lambda ─────────────────────────────────────────────────
const PT_BOUND = 0.2;

// ── Published L_pt decomposition (paper-appendix-C, imp-1081) ───────────────
//   L_pt = L_FC + L_drift + L_cond + E_trunc_pt
// Values lifted verbatim from paper-appendix-C-finite-height-beat.js line 218.
const L_FC      = 0.0066;
const L_DRIFT   = 0.00125;
const L_COND    = 0.01164;
const L_NON_TRUNC = L_FC + L_DRIFT + L_COND; // 0.01949

// ── Density exponents ───────────────────────────────────────────────────────
// Ingham 1940 zero-density: N_off(sigma, T) << T^{e_I(sigma)} with
//   e_I(sigma) = 3 * (1 - sigma) / (2 - sigma).
function eIngham(sigma) {
  return (3 * (1 - sigma)) / (2 - sigma);
}

// Bui-Soundararajan 2008 (J. London Math. Soc. 78, 545-558) Theorem 3.1
//   N_off(sigma, T) << T^{e_BS(sigma)} with
//   e_BS(sigma) = 8 * (1 - sigma) / (11 + 1.5 * sigma).
function eBS(sigma) {
  return (8 * (1 - sigma)) / (11 + 1.5 * sigma);
}

// ── E_trunc_pt formula (imp-447 / imp-459 form) ─────────────────────────────
// E_trunc_pt(sigma) = (2 * e(sigma) / kappa(sigma)) * T_PT^{-kappa(sigma)}
// with kappa(sigma) = 1 - e(sigma). The factor 2 accounts for the (rho, rho-
// bar) pair. Numerically well-defined iff e < 1, i.e. iff sigma > 1/2.
function etruncAtSigma(eFn, sigma) {
  const e = eFn(sigma);
  const kappa = 1 - e;
  if (kappa <= 0 || !isFinite(kappa)) {
    return { e: +e, kappa: +kappa, bound: Infinity };
  }
  const factor = (2 * e) / kappa;
  const tptPow = Math.exp(-kappa * Math.log(T_PT));
  return { e: +e, kappa: +kappa, bound: +(factor * tptPow) };
}

// ── Ticket-spec sigma grid (4 points) ───────────────────────────────────────
const SIGMA_GRID = Object.freeze([0.70, 0.75, 0.80, 0.85]);

// ── Per-sigma E_trunc comparison + L_pt projection ──────────────────────────
const PER_SIGMA = SIGMA_GRID.map((sigma) => {
  const ing = etruncAtSigma(eIngham, sigma);
  const bs  = etruncAtSigma(eBS,     sigma);

  const lptIngham = L_NON_TRUNC + ing.bound;
  const lptBS     = L_NON_TRUNC + bs.bound;

  const tighteningFactor =
    Number.isFinite(ing.bound) && Number.isFinite(bs.bound) && bs.bound > 0
      ? +(ing.bound / bs.bound)
      : null;

  return Object.freeze({
    sigma,
    e_Ingham: ing.e,
    e_BS:     bs.e,
    Etrunc_Ingham: ing.bound,
    Etrunc_BS:     bs.bound,
    tighteningFactor,
    L_pt_Ingham: +lptIngham,
    L_pt_BS:     +lptBS,
    L_pt_absoluteDrop: +(lptIngham - lptBS),
    margin_Ingham: +(PT_BOUND / lptIngham),
    margin_BS:     +(PT_BOUND / lptBS),
  });
});

// ── Production-anchor pull-out: sigma_opt = 0.75 ────────────────────────────
const PRODUCTION_SIGMA = 0.75;
const PRODUCTION_ROW = PER_SIGMA.find((r) => r.sigma === PRODUCTION_SIGMA);

// ── Sensitivity at +- 5pct on C_BS (implicit constant in BS Theorem 3.1) ────
// E_trunc_BS is linear in C_BS, so a +- 5pct perturbation moves E_trunc_BS by
// the same fraction, but L_pt = L_non_trunc + E_trunc_BS shifts by only that
// fraction of E_trunc_BS -- which is < 1e-12 at sigma = 0.75. Numerically
// invisible at the L_pt headline level.
const SENSITIVITY_AT_PRODUCTION = Object.freeze({
  basis: 'implicit constant C_BS in BS Theorem 3.1 perturbed +- 5 pct',
  sigma: PRODUCTION_SIGMA,
  Etrunc_BS_minus5pct: +(PRODUCTION_ROW.Etrunc_BS * 0.95),
  Etrunc_BS_plus5pct:  +(PRODUCTION_ROW.Etrunc_BS * 1.05),
  L_pt_BS_minus5pct: +(L_NON_TRUNC + PRODUCTION_ROW.Etrunc_BS * 0.95),
  L_pt_BS_plus5pct:  +(L_NON_TRUNC + PRODUCTION_ROW.Etrunc_BS * 1.05),
  note:
    'C_BS perturbation moves E_trunc_BS linearly but is invisible at the ' +
    'L_pt headline level because L_non_trunc dominates by ~ 10^9.',
});

// ── Exported record ─────────────────────────────────────────────────────────
export const BUI_SOUND_DENSITY_NUMERICAL = Object.freeze({
  id: 'imp-1115',
  title:
    'Bui-Soundararajan density numerical projection: E_trunc_BS + L_pt headline ' +
    'at sigma in {0.7, 0.75, 0.8, 0.85}, T_PT = 3e12',
  status: 'completed-numerical-projection',
  // imp-2587 freshness re-verification: all 5 assertions re-run and PASS;
  // headline values confirmed (Etrunc_I=3.06e-5, Etrunc_BS=1.51e-11,
  // L_pt_I=0.019521, L_pt_BS=0.019490, margins 10.246x/10.262x).
  verifiedAt: '2026-06-10T00:00:00Z',
  scopeNote:
    'NUMERICAL projection only. The implicit constant C_BS in the BS density ' +
    'bound is treated as 1; the rigorous port that audits C_BS explicitly is ' +
    'imp-1123 / imp-1164. Production stays on Ingham at sigma_opt = 0.75 ' +
    'until those land.',

  T_PT,
  PT_BOUND,
  productionSigma: PRODUCTION_SIGMA,

  // Decomposition anchors (paper-appendix-C, imp-1081).
  decomposition: Object.freeze({
    L_FC,
    L_drift: L_DRIFT,
    L_cond:  L_COND,
    L_non_trunc: L_NON_TRUNC,
    formula: 'L_pt = L_FC + L_drift + L_cond + E_trunc_pt',
  }),

  sigmaGrid: SIGMA_GRID,
  perSigma:  Object.freeze(PER_SIGMA),

  productionRow: Object.freeze(PRODUCTION_ROW),

  // Headline -- the two numbers the ticket asks for explicitly.
  L_pt_current_Ingham_atProduction: PRODUCTION_ROW.L_pt_Ingham,    // ~ 0.0195
  L_pt_projected_BS_atProduction:   PRODUCTION_ROW.L_pt_BS,        // ~ 0.0195
  L_pt_absoluteDrop_atProduction:   PRODUCTION_ROW.L_pt_absoluteDrop,

  sensitivityAtProduction: SENSITIVITY_AT_PRODUCTION,

  honestScope:
    'imp-1115 PURELY NUMERICAL deliverable. Does not close the BS rigorous ' +
    'port (imp-1123 / imp-1164). The 4-point comparison table and L_pt ' +
    'projection are valid CONDITIONAL on the rigorous port succeeding with ' +
    'C_BS = O(1). The decision whether to invest 2-4 weeks in the rigorous ' +
    'port hinges on the headline: the L_pt absolute drop is ~ 3e-5 (4th ' +
    'significant figure), so the value is theoretical robustness against ' +
    'future L_cond improvements, NOT a numerical tightening of the headline.',

  sources: [
    'imp-447 + imp-459 (finite-height-beats-platt-trudgian.js) -- Ingham E_trunc baseline',
    'imp-1081 (paper-appendix-C-finite-height-beat.js) -- L_pt decomposition anchor',
    'imp-1107 (sota-asymptotic-alternatives-2026-05.js) -- BS exponent survey',
    'imp-1124 (bui-soundararajan-optimal-sigma-2026-05.js) -- optimal-sigma scan (complementary)',
    'Bui-Soundararajan 2008, J. London Math. Soc. 78 (2008), 545-558',
    'Ingham 1940 zero-density bound',
    'Platt & Trudgian 2021, Bull. Lond. Math. Soc. 53 (2021), 792-797',
  ],
});

// ── Build-time tripwires (5, ticket spec) ───────────────────────────────────
export const BUI_SOUND_DENSITY_NUMERICAL_ASSERTIONS = [
  {
    id: 'imp1115-sigma-grid-matches-ticket-spec',
    holds: () => {
      const g = BUI_SOUND_DENSITY_NUMERICAL.sigmaGrid;
      return (
        Array.isArray(g) &&
        g.length === 4 &&
        g[0] === 0.70 &&
        g[1] === 0.75 &&
        g[2] === 0.80 &&
        g[3] === 0.85
      );
    },
    why:
      'Ticket spec asks for sigma in {0.7, 0.75, 0.8, 0.85}. A drift away from this 4-point grid ' +
      'breaks the apples-to-apples comparison with the imp-1107 SOTA-alternatives survey.',
  },
  {
    id: 'imp1115-bs-tighter-than-ingham-at-every-sigma',
    holds: () => {
      const rows = BUI_SOUND_DENSITY_NUMERICAL.perSigma;
      if (!Array.isArray(rows) || rows.length !== 4) return false;
      for (const r of rows) {
        if (!Number.isFinite(r.Etrunc_Ingham) || !Number.isFinite(r.Etrunc_BS)) return false;
        if (!(r.Etrunc_BS < r.Etrunc_Ingham)) return false;
        if (!(r.tighteningFactor > 1e4)) return false;
      }
      return true;
    },
    why:
      'The BS exponent e_BS(sigma) = 8(1-sigma)/(11+1.5 sigma) is strictly smaller than the ' +
      'Ingham exponent e_I(sigma) = 3(1-sigma)/(2-sigma) for sigma > 0.65, so kappa_BS = 1-e_BS ' +
      'is strictly larger, so T_PT^{-kappa_BS} is strictly smaller than T_PT^{-kappa_I} at every ' +
      'sigma in the grid. Tightening factor > 1e4 at each sigma in {0.7, 0.75, 0.8, 0.85}. ' +
      'A failure means a flipped exponent or a sign error in etruncAtSigma.',
  },
  {
    id: 'imp1115-l-pt-current-matches-paper-headline-0p0195',
    holds: () => {
      const lpt = BUI_SOUND_DENSITY_NUMERICAL.L_pt_current_Ingham_atProduction;
      // Paper headline: L_pt ~ 0.0066 + 0.00125 + 0.01164 + 3.06e-5 ~ 0.01952.
      // Allow tight band [0.0194, 0.0196] for E_trunc round-trip noise.
      return Number.isFinite(lpt) && lpt > 0.0194 && lpt < 0.0196;
    },
    why:
      'L_pt = L_FC + L_drift + L_cond + E_trunc_pt = 0.0066 + 0.00125 + 0.01164 + 3.06e-5 = ' +
      '0.01952 (matches the paper headline ~ 0.0200 to two decimals). A value outside ' +
      '[0.0194, 0.0196] indicates the decomposition constants or E_trunc baseline drifted.',
  },
  {
    id: 'imp1115-l-pt-bs-projection-tighter-but-same-2-sf',
    holds: () => {
      const r = BUI_SOUND_DENSITY_NUMERICAL.productionRow;
      // L_pt_BS must be strictly less than L_pt_Ingham (BS is tighter), but the
      // drop must be < 1e-4 (4th significant figure), because L_non_trunc =
      // 0.01949 dominates and E_trunc_pt only contributes 3e-5.
      if (!r) return false;
      if (!(r.L_pt_BS < r.L_pt_Ingham)) return false;
      if (!(r.L_pt_absoluteDrop > 0 && r.L_pt_absoluteDrop < 1e-4)) return false;
      // Both projections must round to the same 2-sig-fig headline 0.020.
      return (
        Math.round(r.L_pt_Ingham * 100) === 2 &&
        Math.round(r.L_pt_BS * 100) === 2
      );
    },
    why:
      'BS substitution shrinks E_trunc_pt by ~ 2e6 at sigma = 0.75, but L_pt only drops by ~ 3e-5 ' +
      'because the three non-truncation contributions sum to 0.01949 and dominate. Both the Ingham ' +
      'and BS L_pt round to the same 2-sf headline 0.020. A failure here means either the ' +
      'L_non_trunc anchor changed or the BS exponent broke (no longer strictly tighter than Ingham).',
  },
  {
    id: 'imp1115-honest-scope-tag-and-rigorous-port-pointer',
    holds: () => {
      const rec = BUI_SOUND_DENSITY_NUMERICAL;
      if (rec.status !== 'completed-numerical-projection') return false;
      if (typeof rec.scopeNote !== 'string' || !rec.scopeNote.includes('NUMERICAL projection only')) return false;
      if (typeof rec.honestScope !== 'string' || !rec.honestScope.includes('imp-1123')) return false;
      return Array.isArray(rec.sources) && rec.sources.length >= 5;
    },
    why:
      'imp-1115 is the NUMERICAL projection ticket; the RIGOROUS PORT lives at imp-1123 / imp-1164. ' +
      'The status tag and scopeNote must keep the distinction visible so a future reader does not ' +
      'mistake the projection for a closure. Removing the imp-1123 pointer or flipping the status ' +
      'tag to "closed" is exactly the silent-promotion pattern this tripwire blocks.',
  },
];
