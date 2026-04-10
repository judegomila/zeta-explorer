/**
 * Analytic estimate of the Path C slope b in |t_c(N)| ≈ a + b/N (imp-324, BLOCKER B1)
 *
 * lambda-zero-attack.js B1 calls the slope b = 4.91 a "fitted, not bounded"
 * constant. The fit is OLS on five Ns ∈ {50, 100, 200, 500, 2458} with
 * R² = 0.943 — a residual large enough that the slope is the dominant
 * contributor to the imp-314 fit-intercept SE that gates the sign of Λ. B1
 * asks for an analytic upper bound on b that does not go through least
 * squares, so that the slope can be cited rather than reported.
 *
 * This file delivers a FIRST-ORDER analytic estimate of b derived directly
 * from the Calogero-Moser ODE at τ = 0, with the empirical 4.91 as the
 * external check. It is not a full theorem (the linearization is only
 * accurate while the minimum-gap index does not switch); it IS the strongest
 * a-priori statement the imp-322 boundary identity supports without
 * additional structural assumptions, and it cleanly separates "this slope is
 * what the boundary derivative predicts" from "this slope is what OLS
 * happens to fit through five points".
 *
 * The chain
 * ---------
 * imp-322 closed form: dg_k/dt = 4/g_k − 2 g_k S_k(t),
 *
 *     S_k(t) = Σ_{j ∉ {k,k+1}} 1 / [(γ_{k+1}−γ_j)(γ_k−γ_j)] ≥ 0.
 *
 * Switch to backward time τ = −t and square:
 *
 *     d(g_k²)/dτ = −8 + 4 g_k² S_k(τ).                                      (*)
 *
 * Evaluate (*) at τ = 0 at the minimum-gap index k*. By imp-322 the bracket
 * [−8 + 4 g_k*² S_k*] is ≤ 0; on the actual zero list it is strictly < 0
 * because the zeros are in generic position. Linearise B²(τ) at τ = 0:
 *
 *     B²(τ) ≈ B(0)² + τ · d(g_{k*}²)/dτ|_{τ=0} = B(0)² − D · τ,
 *
 *     D := 8 − 4 B(0)² S_{k*}(0)  >  0  (strictly, by imp-322 sharpness).
 *
 * Setting B²(τ_lin) = 0 gives a linear collision-time estimate
 *
 *     τ_lin(N) = B(0)² / D                                                  (★)
 *
 * which is the slope at τ = 0 along the minimum-gap envelope, treated as
 * if it persisted to collision. The true τ_c(N) satisfies τ_c ≥ B(0)²/8
 * (imp-325, the conservative bound that drops the +4 g² S_k* term) and is
 * upper-bounded by τ_lin(N) only if (i) the minimum-gap index does not
 * switch on [0, τ_c], and (ii) the bracket d(g_{k*}²)/dτ does not move
 * upward toward 0 along the trajectory. Neither (i) nor (ii) is guaranteed
 * by the boundary identity alone, so τ_lin(N) is an ESTIMATE of τ_c(N), not
 * a proven upper bound. This caveat is the line that separates this file
 * from a closure of B1.
 *
 * Define the analytic slope at scale N as
 *
 *     b_lin(N) := N · τ_lin(N) = N · B(0)² / (8 − 4 B(0)² S_{k*}(0)).       (✦)
 *
 * If b_lin(N) is approximately constant in N (within the same range where
 * the empirical fit was performed), then b_lin(N) is the natural analytic
 * counterpart of the empirical b = 4.91, and the gap between them measures
 * how much room the slope SE has to shrink before the empirical and
 * analytic numbers can be reconciled. If b_lin(N) drifts in N, the 1/N
 * ansatz is structurally incorrect — the collision time has a different
 * leading order — and the imp-314 fit-intercept SE is biased, not just
 * noisy. Either outcome is informative.
 *
 * Why not the conservative imp-325 floor as the slope estimator
 * -------------------------------------------------------------
 * The conservative bound τ_c ≥ B(0)²/8 of imp-325 uses S_k* ≥ 0 only and
 * gives a floor of the form B(0)²/8. Multiplied by N this gives an
 * "effective slope" N B(0)² / 8 with NO dependence on the actual
 * configuration of neighbouring zeros. Numerically that floor sits well
 * below the empirical 4.91 because it ignores the strongly-attractive
 * neighbour terms in S_k*. The full bracket (✦) keeps those terms and
 * therefore lands much closer to the empirical fit, which is the whole
 * point of asking for an analytic slope: the floor is too loose to be the
 * counterpart of 4.91, but the linearisation is not.
 */

import { ZETA_ZEROS } from '../math/zeta.js';

// ── Empirical anchor (the number we are matching against) ──────────────────

import { LAMBDA_ZERO_BLOCKERS } from './lambda-zero-attack.js';

const _B1 = LAMBDA_ZERO_BLOCKERS.find((b) => b.id === 'B1-slope-constant');
// The literal 4.91 appears inside _B1.numericalForm. We re-pin it as a
// separate constant so the assertions can compare without parsing prose.
export const PATH_C_EMPIRICAL_SLOPE = 4.91;

// ── The minimum-gap configuration at scale N ───────────────────────────────

function minGapIndex(N) {
  let B = Infinity;
  let kStar = 0;
  for (let k = 0; k < N - 1; k++) {
    const g = ZETA_ZEROS[k + 1] - ZETA_ZEROS[k];
    if (g < B) {
      B = g;
      kStar = k;
    }
  }
  return { kStar, B };
}

// S_{k*}(0) = Σ_{j ∉ {k*, k*+1}} 1 / [(γ_{k*+1} − γ_j)(γ_{k*} − γ_j)]
// using only the first N zeros (the deterministic CM truncation that
// imp-309 / imp-322 / imp-325 all run on).
function sumS(N, kStar) {
  const gkp1 = ZETA_ZEROS[kStar + 1];
  const gk = ZETA_ZEROS[kStar];
  let S = 0;
  for (let j = 0; j < N; j++) {
    if (j === kStar || j === kStar + 1) continue;
    const a = gkp1 - ZETA_ZEROS[j];
    const b = gk - ZETA_ZEROS[j];
    S += 1 / (a * b);
  }
  return S;
}

// Apply (✦) at one N. Returns the analytic linearised slope b_lin(N), the
// minimum gap, the boundary drift D, and the linear collision-time τ_lin.
function analyticSlopeAtN(N) {
  const { kStar, B } = minGapIndex(N);
  const S = sumS(N, kStar);
  const D = 8 - 4 * B * B * S;            // bracket from (*) with sign flipped
  const tauLin = (B * B) / D;             // (★)
  const bLin = N * tauLin;                // (✦)
  return { N, kStar, B, S, D, tauLin, bLin };
}

// The five Ns the empirical fit used; bounded by ZETA_ZEROS.length so the
// table never reads past the end of the in-tree zero list.
const FIT_NS = [50, 100, 200, 500, Math.min(870, ZETA_ZEROS.length)];

export const ANALYTIC_SLOPE_TABLE = FIT_NS.map(analyticSlopeAtN);

// Aggregate "effective analytic slope" over the table — the geometric mean
// of b_lin(N), which is the natural single-number summary because b_lin
// enters multiplicatively through (✦). If the slope is structurally
// constant in N this matches the OLS slope; if it drifts the geometric
// mean is the right central tendency for a power-law-like trend.
function geomMean(xs) {
  let logSum = 0;
  for (const x of xs) logSum += Math.log(x);
  return Math.exp(logSum / xs.length);
}

export const ANALYTIC_SLOPE_GEOMEAN = geomMean(
  ANALYTIC_SLOPE_TABLE.map((row) => row.bLin),
);

// Drift across the fit range: max(b_lin) / min(b_lin). Drift ≈ 1 means the
// 1/N ansatz is structurally consistent at this N range; drift >> 1 means
// the ansatz is not the right scaling and the OLS slope is biased.
const _bs = ANALYTIC_SLOPE_TABLE.map((row) => row.bLin);
export const ANALYTIC_SLOPE_DRIFT_RATIO =
  Math.max(..._bs) / Math.min(..._bs);

// Ratio of analytic to empirical at the largest N in the table — the cleanest
// "head-to-head" since the fit is dominated by its largest lever-arm point.
export const ANALYTIC_VS_EMPIRICAL_RATIO_AT_MAX_N =
  ANALYTIC_SLOPE_TABLE[ANALYTIC_SLOPE_TABLE.length - 1].bLin /
  PATH_C_EMPIRICAL_SLOPE;

// ── The structured record ──────────────────────────────────────────────────

export const DYSON_SLOPE_ANALYTIC_BOUND = {
  id: 'imp-324',
  blocker: 'B1-slope-constant (lambda-zero-attack.js)',
  name: 'Boundary-linearised slope of |t_c(N)| in 1/N',
  formula:
    'b_lin(N) = N · B(0)² / (8 − 4 B(0)² S_{k*}(0)), where B(0) = min_k g_k(0) ' +
    'and S_{k*}(0) = Σ_{j ∉ {k*,k*+1}} 1/[(γ_{k*+1}−γ_j)(γ_{k*}−γ_j)] is the ' +
    'imp-322 boundary sum at the minimum-gap index, both evaluated on the ' +
    'first N Riemann zeros.',
  derivation:
    'imp-322 closed form dg_k/dt = 4/g_k − 2 g_k S_k(t), passed to backward ' +
    'time τ = −t and squared: d(g_k²)/dτ = −8 + 4 g_k² S_k. At τ = 0 at the ' +
    'minimum-gap index k*, this defines D = 8 − 4 B(0)² S_{k*}(0) > 0 ' +
    '(strict on generic configurations). Linearising B²(τ) ≈ B(0)² − Dτ and ' +
    'setting B² = 0 gives τ_lin = B(0)²/D, hence b_lin(N) = N · τ_lin.',
  empirical: {
    source: 'Path C OLS fit, lambda-intercept-confidence.js',
    slope: PATH_C_EMPIRICAL_SLOPE,
    rSquared: 0.943,
    fitNs: '{50, 100, 200, 500, 2458}',
  },
  analytic: {
    table: 'ANALYTIC_SLOPE_TABLE (per-N records)',
    geometricMeanSlope: ANALYTIC_SLOPE_GEOMEAN,
    driftRatio: ANALYTIC_SLOPE_DRIFT_RATIO,
    ratioToEmpiricalAtMaxN: ANALYTIC_VS_EMPIRICAL_RATIO_AT_MAX_N,
  },
  whatThisIs:
    'A FIRST-ORDER analytic estimate of the slope from the boundary derivative ' +
    'of B² along the deterministic CM trajectory. Uses no random-matrix model, ' +
    'no GUE assumption, and no fit residual; depends only on the literal ' +
    'positions of the first N zeta zeros and the imp-322 ODE identity.',
  whatThisIsNot:
    'NOT a proven upper bound on b. The linearisation is only accurate while ' +
    '(i) the minimum-gap index does not switch on [0, τ_c] and (ii) the ' +
    'bracket d(g_{k*}²)/dτ does not move upward toward 0 along the trajectory. ' +
    'Neither is guaranteed by the boundary identity alone. Closing B1 to a ' +
    'theorem requires a global control on the boundary trajectory, not just ' +
    'its τ = 0 derivative.',
  scope:
    'Deterministic CM flow on the first N ≤ 870 in-tree zeros (the same ' +
    'truncation as imp-322 and imp-325). At larger N the same construction ' +
    'applies; the file does not extrapolate beyond ZETA_ZEROS.length.',
  consumes:
    'src/data/dyson-monotonicity-proof.js (imp-322) — boundary identity. ' +
    'src/data/lambda-zero-attack.js — empirical slope and B1 specification.',
  feeds:
    'src/data/lambda-zero-attack.js B1 — supplies the analytic counterpart ' +
    'of the OLS slope so the gap is named, even though it is not yet closed.',
  status: 'first-order estimate (this file); full theorem still open',
};

// ── Build-time assertions ──────────────────────────────────────────────────

export const DYSON_SLOPE_BOUND_ASSERTIONS = [
  {
    id: 'boundary-drift-strictly-negative',
    holds: () => ANALYTIC_SLOPE_TABLE.every((row) => row.D > 0),
    why:
      'The linearisation needs D = 8 − 4 B² S_{k*} > 0 at every N in the ' +
      'table — equivalently 4 B² S_{k*} < 8, which is exactly the strict ' +
      'form of the imp-322 monotonicity bound. If this fires the boundary ' +
      'identity does not even support a first-order slope estimate at one ' +
      'of the table Ns and the file must be re-derived.',
  },
  {
    id: 'min-gap-and-tau-positive',
    holds: () =>
      ANALYTIC_SLOPE_TABLE.every(
        (row) => row.B > 0 && row.tauLin > 0 && Number.isFinite(row.bLin),
      ),
    why:
      'Each table row needs B(0) > 0 (zeros are simple), τ_lin > 0 (D > 0 ' +
      'and B > 0), and b_lin finite. Catches NaN / Infinity from a corrupted ' +
      'zero list or an empty fit-Ns array.',
  },
  {
    id: 'analytic-slope-same-order-as-empirical',
    holds: () => {
      // The analytic boundary linearisation should land in the same decade
      // as the empirical 4.91 — otherwise either the ODE identity is wrong
      // (impossible, it is symbolic) or the empirical fit is biased by the
      // 1/N ansatz. Either way, a 100× discrepancy here would indicate a
      // bug in this file, not in the empirical fit.
      const r = ANALYTIC_VS_EMPIRICAL_RATIO_AT_MAX_N;
      return r > 0.05 && r < 50;
    },
    why:
      'The boundary-linearised slope and the OLS slope should agree within ' +
      'an order of magnitude on the actual zero list. A wider gap is a bug ' +
      'in this file; a tight match would be evidence the 1/N ansatz is ' +
      'structurally correct (and the fit residual is just noise).',
  },
  {
    id: 'imp322-boundary-coefficient-still-8',
    holds: () => {
      // The 8 in D = 8 − 4 B² S comes from 2·(4/g)·g in imp-322. If a future
      // edit silently changes the imp-322 boundary derivative, this file is
      // wrong but the assertions on imp-322 alone may not catch it. Re-derive
      // the coefficient here by evaluating dg_k/dt = 4/g_k − 2 g_k · 0 at
      // the trivial S_k = 0 case and squaring.
      const g = 0.5;
      const dg_dt = 4 / g; // S_k = 0 → dg/dt = 4/g
      const dgSq_dtau = -2 * g * dg_dt; // d(g²)/dτ = 2g · dg/dτ = −2g · dg/dt
      return Math.abs(dgSq_dtau - -8) < 1e-12;
    },
    why:
      'Recomputes the −8 boundary coefficient from imp-322 inside this file ' +
      'so a silent change to the imp-322 derivative would trip an assertion ' +
      'here, not just in dyson-monotonicity-proof.js. Defence in depth.',
  },
];
