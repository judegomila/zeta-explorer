/**
 * @module imp-911-sharper-cumulative-lipschitz
 * @fileoverview Sharper analytic Lipschitz bound on cumulative F_mb growth
 * across a single H_raw-plateau, independent of plateau width and of the
 * plateau h. Replaces the imp-911 universal-per-step bound L = (1/4)·exp(1)
 * (cumulative ≤ width × L, catastrophically loose on wide plateaus) with a
 * width-INDEPENDENT cumulative bound C_∞ = (e/4)·(π²/6 − 1) ≈ 0.438. This
 * is a ~5000× tightening on the widest plateau (N ∈ [6710, 10000], width
 * 3291). The bound is still not tight enough by itself to certify the
 * imp-486 rescue formula at N_0 = 100 across plateau interiors; the
 * remaining gap is what imp-911-sub-gronwall-interval would close (per-
 * plateau interval-RK4 evaluation, ~9-18 h single-threaded).
 * @see imp-903
 * @see imp-911
 */

/**
 * imp-911-sub-cumulative-lipschitz: width-independent cumulative bound on
 * Σ L_per_step over a single H_raw-plateau.
 *
 * MOTIVATION
 * ----------
 * imp-911 (src/math/imp-903-F-mb-plateau-lipschitz-proof.js) proved the
 * per-step Lipschitz bound
 *
 *   |F_mb(N+1) − F_mb(N)|  ≤  (e/4) · (h / g_new)²                        (★)
 *
 * with universal upper bound (1/4)·exp(1) ≈ 0.6796 obtained by taking the
 * worst case g_new = h. Cumulating across a plateau of width W under this
 * universal per-step bound gives
 *
 *   Σ_{m=1}^{W} L_per_step  ≤  W · 0.6796,
 *
 * which is catastrophically loose: on plateau 26 (N ∈ [6710, 10000],
 * W = 3291) the universal bound is 2237, while the empirical cumulative
 * F_mb-variation is < 1e-3 across the plateau. The looseness comes from
 * pretending every newly-added zero is at the binding-pair scale, when
 * in fact only the FIRST few additions are close and subsequent
 * additions are at distances that grow linearly with their plateau
 * step index.
 *
 * STRUCTURE OF THE TIGHTENING
 * ---------------------------
 * Let plateau j have left endpoint N_j and binding pair (γ_{N_j-1},
 * γ_{N_j}) with gap H_raw(N_j) = h. The plateau-interior steps add
 * particles γ_{N_j+m} for m = 1, 2, ... The plateau definition guarantees
 * H_raw is non-decreasing, i.e. every consecutive gap on the plateau is
 * ≥ h. So the m-th newly-added zero satisfies
 *
 *   d_new(m)  :=  γ_{N_j+m} − γ_{N_j-1}  ≥  (m + 1) · h.                  (★★)
 *
 * The per-step Lipschitz constant from (★) for the m-th step is therefore
 *
 *   L_per_step(m)  ≤  (e/4) · (h / d_new(m))²  ≤  (e/4) / (m + 1)².
 *
 * Cumulating over m = 1, 2, ..., W:
 *
 *   Σ_{m=1}^{W} L_per_step(m)
 *       ≤  (e/4) · Σ_{m=1}^{W} 1 / (m + 1)²
 *       <  (e/4) · (π²/6 − 1)                                              (★★★)
 *       ≈  0.4382.
 *
 * This is INDEPENDENT of plateau width W and of the plateau h. The bound
 * (★★★) replaces the universal-per-step W · 0.6796 with a uniform
 * cumulative constant.
 *
 * SIDE NOTE ON h-INDEPENDENCE
 * ---------------------------
 * The h cancels because (★) has h² in the numerator and d_new(m)² has
 * h² as a factor (since d_new(m) ≥ (m+1)·h). Both h dependences cancel
 * in the ratio, leaving the dimensionless 1/(m+1)². This is the
 * fundamental scaling: an additional zero added far from the binding
 * pair perturbs the binding-pair collision time by an amount that
 * scales like (h/d_new)², which is small precisely BECAUSE d_new grows.
 *
 * FAR-FIELD CHECK
 * ---------------
 * The bound (★) was derived from the full Dyson Jacobian analysis. In
 * the far-field limit d_new ≫ h, the perturbation is dominated by the
 * direct contribution 2/d_new² to the binding-pair drift, and the
 * Gronwall amplification factor exp(K_J · τ_c^pair) ≤ e is universal.
 * So (★) holds with the (e/4) coefficient even when d_new is much
 * larger than h, validating the substitution d_new(m) ≥ (m+1)·h in the
 * sum (★★★).
 *
 * REMAINING ANALYTIC GAP
 * ----------------------
 * The cumulative bound (★★★) is uniform but still loose for the
 * imp-486 rescue formula. Specifically, evaluating K_paper_cert with
 * F_mb_certified + 0.438 cumulative at the worst plateau gives
 *
 *   K_paper_cert_max(plateau 12)  ≈  6.27,
 *
 * which substituted into the rescue formula at N_0 = 100 yields
 * 6.27 · log(100)/√100 ≈ 2.89 — still well above the 0.12751 threshold.
 * The empirical sweep K_max above N=100 is 0.190 (achieved at N=136),
 * so the analytic bound is loose by ~33×.
 *
 * FULLY RIGOROUS CLOSURE PATH
 * ---------------------------
 * Closing the analytic-vs-empirical gap requires per-plateau interval-
 * RK4 evaluation of the binding-pair trajectory at representative
 * interior N values, replacing the universal Gronwall factor exp(1)
 * with a per-plateau interval-certified bound. This is the
 * imp-911-sub-gronwall-interval sub-gap. The cost is the 27-point
 * sweep already executed at the H_raw-update points (~9-18 h
 * single-threaded), repeated at one or two interior N values per
 * plateau. Practical execution requires either (a) parallelization
 * across the 27 plateaus, or (b) a faster integrator (Arb-via-WASM,
 * imp-925's narrowed-scope successor target).
 *
 * WHAT THIS MODULE CONTRIBUTES
 * ----------------------------
 * It does NOT close imp-903 fully. It does:
 *   (1) tighten the cumulative within-plateau Lipschitz bound from
 *       width × 0.6796 to a width-independent ≈ 0.4382, a uniform
 *       reduction by a factor of plateau-width (~5000× on the widest
 *       plateau);
 *   (2) clarify that the dominant term in F_mb_max is now the
 *       certified F_mb_endpoint plus a constant ≈ 0.4382, NOT a
 *       width-multiplied term;
 *   (3) bound the worst-case K_paper_cert per plateau under purely
 *       analytic assumptions (still 33× looser than empirical, but
 *       a rigorous CEILING);
 *   (4) document the open sub-gap (per-plateau Gronwall-interval) and
 *       its compute cost, so the next ticket scheduling the sweep has
 *       a clear target.
 *
 * @see src/math/imp-903-F-mb-plateau-lipschitz-proof.js
 * @see src/math/imp-857-uniform-K-bound.js
 * @see src/data/imp-903-uniform-sweep-result.js
 */

import { IMP_857_UNIFORM_K_BOUND } from './imp-857-uniform-K-bound.js';

// (e/4) — the universal pre-Gronwall × Gronwall factor from imp-911.
const E_OVER_FOUR = Math.E / 4; // ≈ 0.6796

// Σ_{m=1}^{∞} 1/(m+1)² = π²/6 − 1 ≈ 0.6449
const SUM_INV_M_PLUS_ONE_SQ = (Math.PI * Math.PI) / 6 - 1;

// Cumulative-Lipschitz universal upper bound, width-independent:
//   C_∞ = (e/4) · (π²/6 − 1) ≈ 0.4382
const CUMULATIVE_F_MB_GROWTH_UPPER = E_OVER_FOUR * SUM_INV_M_PLUS_ONE_SQ;

// Per-plateau cumulative bound (truncated at the actual plateau width).
function cumulativeBoundForWidth(W) {
  let sum = 0;
  for (let m = 1; m <= W; m++) sum += 1 / ((m + 1) * (m + 1));
  return E_OVER_FOUR * sum;
}

// The per-plateau bound is < CUMULATIVE_F_MB_GROWTH_UPPER for every finite W
// and saturates the universal value as W → ∞.
const PLATEAU_CUMULATIVE_ROWS = IMP_857_UNIFORM_K_BOUND.plateaus.map((p) => {
  const W = p.endN - p.startN + 1;
  const cumFinite = cumulativeBoundForWidth(W);
  return {
    plateauIndex: p.plateauIndex,
    startN: p.startN,
    endN: p.endN,
    width: W,
    H_raw: p.H_raw,
    cumulative_F_mb_bound: +cumFinite.toFixed(6),
    cumulative_universal_imp911: +(W * E_OVER_FOUR).toFixed(2), // for comparison
    tighteningFactor: +((W * E_OVER_FOUR) / cumFinite).toFixed(2),
  };
});

// Worst-case per-plateau K_paper_cert ceiling: assumes the certified F_mb
// at the plateau endpoint is 0 (most pessimistic), so F_mb_max ≤ C_∞ on
// the plateau interior. Then
//   K_paper_cert_max ≤ C_∞ · h · √(endN) / (log(endN) · 0.12751).
// This is the worst case; with a non-zero certified F_mb it would shift
// upward by F_mb_certified · (same factor).
const RESCUE_FORMULA_THRESHOLD = 0.12751;

function kPaperCertCeiling(h, N) {
  return (
    (CUMULATIVE_F_MB_GROWTH_UPPER * h * Math.sqrt(N)) /
    (Math.log(N) * RESCUE_FORMULA_THRESHOLD)
  );
}

const PLATEAU_K_CEILING_ROWS = IMP_857_UNIFORM_K_BOUND.plateaus
  .filter((p) => p.endN >= 100) // restrict to N ≥ 100 for the rescue formula
  .map((p) => {
    const Kceil = kPaperCertCeiling(p.H_raw, p.endN);
    return {
      plateauIndex: p.plateauIndex,
      startN: p.startN,
      endN: p.endN,
      H_raw: p.H_raw,
      K_paper_cert_ceiling_analytic: +Kceil.toFixed(4),
    };
  });

// The rescue formula at N_0 = 100 with the analytic ceiling: pick the
// max K_paper_cert ceiling over plateaus with endN ≥ 100, evaluate
// LHS = K · log(N_0)/√N_0, compare against threshold.
const K_CEILING_MAX_ABOVE_100 = Math.max(
  ...PLATEAU_K_CEILING_ROWS.map((r) => r.K_paper_cert_ceiling_analytic),
);
const RESCUE_LHS_ANALYTIC = (K_CEILING_MAX_ABOVE_100 * Math.log(100)) / 10;

// ── Exported record ─────────────────────────────────────────────────────────

export const IMP_911_SHARPER_CUMULATIVE_LIPSCHITZ = Object.freeze({
  id: 'imp-911-sharper-cumulative-lipschitz',
  status: 'analytic-tightening-shipped',
  statement:
    'Cumulative within-plateau F_mb growth is uniformly bounded by ' +
    'C_∞ = (e/4)·(π²/6 − 1) ≈ 0.4382, independent of plateau width and ' +
    'plateau h. This replaces the imp-911 universal-per-step W × 0.6796 ' +
    'cumulative bound (catastrophically loose for wide plateaus) with a ' +
    'width-independent constant — a ~5000× tightening on the widest plateau.',
  cumulativeBoundUpper: +CUMULATIVE_F_MB_GROWTH_UPPER.toFixed(6),
  derivation:
    'L_per_step(m) ≤ (e/4)·(h/d_new(m))² ≤ (e/4)/(m+1)² where d_new(m) ' +
    '≥ (m+1)·h on a plateau (each consecutive gap ≥ h by plateau ' +
    'definition). Cumulating: Σ L ≤ (e/4)·(π²/6 − 1) ≈ 0.4382. The h ' +
    'dependence cancels because both numerator and denominator scale as h².',
  plateauCumulativeRows: PLATEAU_CUMULATIVE_ROWS,
  plateauKCeilingRows: PLATEAU_K_CEILING_ROWS,
  rescueFormulaCheck: {
    K_ceiling_max_above_100: +K_CEILING_MAX_ABOVE_100.toFixed(4),
    rescue_LHS_analytic: +RESCUE_LHS_ANALYTIC.toFixed(4),
    rescue_threshold: RESCUE_FORMULA_THRESHOLD,
    rescue_satisfied_analytic: RESCUE_LHS_ANALYTIC < RESCUE_FORMULA_THRESHOLD,
    note:
      'The tightened analytic ceiling is still loose vs. the empirical ' +
      'sweep (K_max ≈ 0.190 above N=100, satisfying the rescue formula ' +
      'with LHS ≈ 0.088). The remaining gap is closed by per-plateau ' +
      'interval-RK4 evaluation (imp-911-sub-gronwall-interval).',
  },
  upgradesImp903: {
    from: 'L2-semi-rigorous-with-loose-cumulative-bound',
    to: 'L2-rigorous-cumulative-bound-width-independent',
    note:
      'The cumulative bound is now width-independent and uniformly ' +
      'finite. The remaining tightness gap is purely numerical (per-' +
      'plateau Gronwall factor) and does not affect rigor. The full ' +
      'flip from L2-rigorous-with-empirical-tightness to L2-FULLY-' +
      'rigorous still requires imp-911-sub-gronwall-interval.',
  },
  remainingOpenSubGap: {
    id: 'imp-911-sub-gronwall-interval',
    description:
      'Per-plateau interval-RK4 evaluation of the binding-pair Jacobian ' +
      'norm to replace the universal Gronwall factor exp(1) with a per-' +
      'plateau interval-certified upper bound. Empirically the per-' +
      'plateau Jacobian norm is much smaller than the universal 8/h² ' +
      'used in imp-911, so the per-plateau Gronwall factor is much ' +
      'smaller than exp(1). Closing this requires running the existing ' +
      'src/math/imp-857-baseline-scaling-N10k.mjs at one or two ' +
      'representative interior N values per plateau — ~9-18 h single-' +
      'threaded, parallelizable across the 27 plateaus.',
    blockingLevel: 'L2-rescue-tightness',
    cost: '9-18 h CPU single-threaded (parallelizable)',
  },
  citation:
    'Sharpens the cumulative bound in IMP_903_F_MB_PLATEAU_LIPSCHITZ ' +
    '(src/math/imp-903-F-mb-plateau-lipschitz-proof.js) using the ' +
    'newly-added-zero distance scaling d_new(m) ≥ (m+1)·h. The per-step ' +
    'bound is unchanged; only the cumulative bound improves.',
});

// ── Build-time assertions ───────────────────────────────────────────────────

export const IMP_911_SHARPER_CUMULATIVE_LIPSCHITZ_ASSERTIONS = [
  {
    id: 'imp911-sharper-cumulative-bound-under-half',
    holds: () =>
      IMP_911_SHARPER_CUMULATIVE_LIPSCHITZ.cumulativeBoundUpper < 0.5,
    why:
      'The width-independent cumulative bound (e/4)·(π²/6 − 1) ≈ 0.4382 ' +
      'must be strictly less than 0.5 to deliver a meaningful tightening ' +
      'over the per-step universal 0.6796 bound. A value ≥ 0.5 would ' +
      'indicate a derivation error in the d_new ≥ (m+1)·h step.',
  },
  {
    id: 'imp911-tightening-factor-ratio-on-widest-plateau',
    holds: () => {
      const widest = IMP_911_SHARPER_CUMULATIVE_LIPSCHITZ.plateauCumulativeRows.reduce(
        (a, b) => (b.width > a.width ? b : a),
      );
      return widest.tighteningFactor > 1000;
    },
    why:
      'The cumulative tightening factor must exceed 1000× on the widest ' +
      'plateau (W=3291). A smaller factor would mean the d_new growth ' +
      'argument is not significant on the actual plateau structure.',
  },
  {
    id: 'imp911-cumulative-rows-equal-27',
    holds: () =>
      IMP_911_SHARPER_CUMULATIVE_LIPSCHITZ.plateauCumulativeRows.length === 27,
    why:
      'Per-plateau cumulative table must cover exactly the 27 H_raw-' +
      'plateaus enumerated by IMP_857_UNIFORM_K_BOUND. A mismatch means ' +
      'the import drifted or the plateau enumeration changed.',
  },
  {
    id: 'imp911-rescue-formula-explicitly-checked',
    holds: () =>
      typeof IMP_911_SHARPER_CUMULATIVE_LIPSCHITZ.rescueFormulaCheck.rescue_satisfied_analytic === 'boolean',
    why:
      'The rescue formula check field must be present and explicit (true ' +
      'or false), so downstream consumers can read the analytic-vs-' +
      'empirical gap directly. Missing this field hides the residual ' +
      'open work.',
  },
  {
    id: 'imp911-open-sub-gap-named',
    holds: () =>
      IMP_911_SHARPER_CUMULATIVE_LIPSCHITZ.remainingOpenSubGap.id ===
      'imp-911-sub-gronwall-interval',
    why:
      'The remaining numerical tightening (per-plateau interval-certified ' +
      'Gronwall factor) must be named so a successor ticket can pick it ' +
      'up. The honest-partial closure depends on this pointer being ' +
      'present.',
  },
];
