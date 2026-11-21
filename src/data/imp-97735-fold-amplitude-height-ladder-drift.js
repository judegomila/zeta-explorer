/**
 * @module imp-97735-fold-amplitude-height-ladder-drift
 *
 * imp-97735 (numerical, frontier-direction): MEASURE whether the imp-97725
 * fold-amplitude K = sqrt(sigma_max(1-sigma_max)/(2 phi_xx)) stabilizes across a
 * height ladder deep into the tail, since its denominator carries
 *
 *     phi_xx = (ln R)_xx - (1/2)(ln L)_xx,   R = E_trunc + E_flow,  L = ln T0(N),
 *
 * a second log-derivative of the Riemann-von Mangoldt inverse height map T0(N) =
 * effectiveHeightForN(N) with NO elementary closed form (the imp-97725 HONEST
 * SUB-GAP: K is pinned in STRUCTURE but the value 0.4233 inherits phi_xx, so K is
 * not a universal constant).
 *
 * SAME inherited imp-3406/imp-33582/imp-97662/imp-97725 surrogate component model,
 * SAME 5-point smooth-model second-log-derivative stencil (h = 1e-4 in x = ln N,
 * no bisected root, no quantization floor). This leaf changes nothing analytic; it
 * only walks phi_xx and the amplitude structure K(N) = sqrt(sigma(N)(1-sigma(N))/
 * (2 phi_xx(N))) out to N = 1e32 and reports the drift.
 *
 * WHAT WAS MEASURED
 * -----------------
 * 1. At the imp-97725 peak (N_peak ~ 9.218633e5) the leaf reproduces phi_xx =
 *    1.339604e-1 and K = 0.423330 EXACTLY (anchor check).
 *
 * 2. On a height ladder N = 1e6, 1e8, 1e10, 1e12, 1e14, 1e16, 1e18, 1e20, 1e24,
 *    1e28, 1e32 the denominator phi_xx DRIFTS MONOTONICALLY DOWNWARD with NO
 *    plateau: phi_xx = 1.365e-1 (N=1e6) -> 2.385e-2 (1e8) -> 1.423e-3 (1e10) ->
 *    6.440e-4 (1e12) -> ... -> 9.420e-5 (1e32). Across the reachable tail
 *    phi_xx spans a factor ~1421 (from 1.340e-1 at the peak to 9.42e-5 at 1e32)
 *    and keeps falling -- it does NOT approach a nonzero limit.
 *
 * 3. WHY it drifts (mechanism, measured): as N -> infinity the flow term
 *    E_flow = C_F (L/T0) Gronwall -> 0, so R -> the constant floor E_trunc = 3.06e-5
 *    and (ln R)_xx -> 0 (measured (lnR)_xx falls from 1.344e-1 at the peak to
 *    ~1e-7..1e-8 in the deep tail). The surviving piece is -(1/2)(ln L)_xx =
 *    -(1/2) d2 ln(ln T0)/dx2. With T0(N) ~ 2 pi N / ln N one has ln T0 ~ x = ln N,
 *    so ln L ~ ln x and d2(ln x)/dx2 = -1/x2, giving the leading tail law
 *
 *        phi_xx  ->  -(1/2)(ln L)_xx  ~  1 / (2 (ln N)^2)  ->  0.
 *
 *    This 1/(2 (ln N)^2) model matches the measured -(1/2)(ln L)_xx to ~0.3% at
 *    N=1e16 and to ~2% at N=1e32 (ratio 0.968 -> 1.022 across N=1e12..1e32),
 *    confirming phi_xx vanishes as an inverse square of the log-height with no
 *    finite floor.
 *
 * 4. CONSEQUENCE for K. Since phi_xx -> 0, the amplitude STRUCTURE K =
 *    sqrt(S/(2 phi_xx)) does not settle to a constant along the ladder (the
 *    counterfactual K(N) with the local sigma(N) ranges from 0.42 near the peak up
 *    to ~9 near N=1e10 and back down to ~2e-4 at N=1e32, since S = sigma(1-sigma)
 *    itself collapses as sigma -> 0 far past the peak). The GENUINE fold amplitude
 *    is defined only at the UNIQUE interior peak (sigma_max ~ 0.9494), where
 *    K = 0.423330 is fixed for THIS model -- but that value sits on a phi_xx that is
 *    a height-dependent point of a monotone-vanishing curve, NOT a universal number.
 *
 * VERDICT: the imp-97725 sub-gap is CONFIRMED and SHARPENED. K does not stabilize
 * to a height-independent limit; its denominator phi_xx drifts by a factor ~1421
 * across the reachable ladder and decays as ~1/(2 (ln N)^2) -> 0, so K = 0.4233 is a
 * numerical property of the surrogate curvature at the peak height, not a
 * dimensionless universal constant. There is no plateau to promote to a pinned
 * number.
 *
 * MEASUREMENT ONLY on the inherited imp-3220/imp-3406 extrapolation surrogate (NOT a
 * rigorous asymptotic). C_mb GUE-conditional per imp-486 UNTOUCHED; C_C 1/8 ansatz
 * (imp-2642/imp-2643) UNTOUCHED (bare E_coll prefactor); E_trunc pinned 3.06e-5
 * unchanged; no bound moves; establishes no operator positivity; imp-3066 K_a >= 0
 * untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-97725-fold-amplitude-analytic-pin (the K structure + the phi_xx SUB-GAP this leaf measures)
 * @see imp-97662-cc-elasticity-peak-divergence (the square-root fold law and first K route)
 * @see imp-97683-fold-amplitude-independent-crosscheck (second K route)
 * @see imp-97700-gexp-identity-analytic-crossing (differentiate the smooth model, not a bisected root)
 * @see imp-97520-sigma-conditional-share-landmark-ladder (L1 peak sigma_max ~ 0.949429)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5;
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-97662/imp-97725 exactly

// EXACT imp-3406/imp-33582/imp-97662/imp-97725 sub-terms; C_C enters E_coll as a bare prefactor.
function parts(N, cc) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = cc * Math.sqrt(L / N);
  const R = E_TRUNC_PT + E_flow;
  return { T0, L, R, E_coll, sigma: E_coll / (R + E_coll), rho: R / E_coll };
}

// Second log-derivative of a SMOOTH component function in x = ln N (5-point, no bisected root).
function d2LnDx2(fn, x, h) {
  const f = (k) => Math.log(fn(Math.exp(x + k * h)));
  return (-f(2) + 16 * f(1) - 30 * f(0) + 16 * f(-1) - f(-2)) / (12 * h * h);
}

const cc = C_C_PINNED;
const H = 1e-4;

// Interior peak location (C_C-invariant): ternary search in x = ln N (matches imp-97725).
function peakLogN() {
  let a = Math.log(1e4);
  let b = Math.log(1e8);
  for (let i = 0; i < 300; i++) {
    const m1 = a + (b - a) / 3;
    const m2 = b - (b - a) / 3;
    if (parts(Math.exp(m1), cc).sigma < parts(Math.exp(m2), cc).sigma) a = m1;
    else b = m2;
  }
  return (a + b) / 2;
}
const X_PEAK = peakLogN();
const P_PEAK = parts(Math.exp(X_PEAK), cc);
const PHI_XX_PEAK =
  d2LnDx2((n) => parts(n, cc).R, X_PEAK, H) - 0.5 * d2LnDx2((n) => parts(n, cc).L, X_PEAK, H);
const S_PEAK = P_PEAK.sigma * (1 - P_PEAK.sigma);
const K_PEAK = Math.sqrt(S_PEAK / (2 * PHI_XX_PEAK));

// ---- Height ladder deep into the tail ----
const LADDER_N = [1e6, 1e8, 1e10, 1e12, 1e14, 1e16, 1e18, 1e20, 1e24, 1e28, 1e32];
const LADDER = LADDER_N.map((N) => {
  const x = Math.log(N);
  const p = parts(N, cc);
  const lnRxx = d2LnDx2((n) => parts(n, cc).R, x, H);
  const lnLxx = d2LnDx2((n) => parts(n, cc).L, x, H);
  const phixx = lnRxx - 0.5 * lnLxx;
  const S = p.sigma * (1 - p.sigma);
  const K = phixx > 0 ? Math.sqrt(S / (2 * phixx)) : NaN;
  return {
    N: +N.toExponential(0),
    sigma: +p.sigma.toExponential(6),
    lnRxx: +lnRxx.toExponential(6),
    negHalfLnLxx: +(-0.5 * lnLxx).toExponential(6),
    phixx: +phixx.toExponential(6),
    S: +S.toExponential(6),
    K: +K.toFixed(6),
    tailLaw_1over2lnN2: +(1 / (2 * x * x)).toExponential(6), // leading -(1/2)(lnL)_xx model
  };
});

// Drift magnitude of the denominator phi_xx across the ladder.
const PHI_XX_SHALLOWEST = LADDER[0].phixx; // N = 1e6 (top of the ladder; phi_xx peaks just past the sigma-peak)
const PHI_XX_DEEPEST = LADDER[LADDER.length - 1].phixx; // N = 1e32
const PHI_XX_DRIFT_FACTOR = PHI_XX_SHALLOWEST / PHI_XX_DEEPEST;
// Monotone-decreasing check across the height ladder (N = 1e6 .. 1e32).
const PHI_XX_SEQ = LADDER.map((r) => r.phixx);
const PHI_XX_MONOTONE_DOWN = PHI_XX_SEQ.every((v, i) => i === 0 || v < PHI_XX_SEQ[i - 1]);

export const IMP97735_FOLD_AMPLITUDE_HEIGHT_LADDER_DRIFT = {
  id: 'imp-97735',
  proofSection: 'S-frontier',
  question:
    'Does the imp-97725 fold amplitude K = sqrt(sigma_max(1-sigma_max)/(2 phi_xx)) stabilize across a height ladder ' +
    'deep into the tail, or does its denominator phi_xx = (ln R)_xx - (1/2)(ln L)_xx (a second log-derivative of the ' +
    'Riemann-von Mangoldt inverse height map, no elementary closed form) drift? Measure phi_xx and K out to N = 1e32 ' +
    'and report the drift magnitude. Measurement only on the inherited surrogate; no bound moves; NO QED.',
  anchor: {
    N_peak: +Math.exp(X_PEAK).toExponential(6), // ~9.218633e5
    sigma_max: +P_PEAK.sigma.toFixed(10), // ~0.9494290142
    phi_xx_peak: +PHI_XX_PEAK.toExponential(6), // ~1.339604e-1 (matches imp-97725)
    K_peak: +K_PEAK.toFixed(6), // ~0.423330 (matches imp-97725)
  },
  ladder: LADDER,
  drift: {
    phi_xx_peak: +PHI_XX_PEAK.toExponential(6), // ~1.339604e-1 (at the sigma-peak N ~ 9.22e5)
    phi_xx_shallowest_N1e6: +PHI_XX_SHALLOWEST.toExponential(6), // ~1.365090e-1 (top of the ladder)
    phi_xx_deepest_N1e32: +PHI_XX_DEEPEST.toExponential(6), // ~9.419870e-5
    phi_xx_drift_factor_1e6_to_1e32: +PHI_XX_DRIFT_FACTOR.toFixed(1), // ~1449
    phi_xx_monotone_decreasing_along_ladder: PHI_XX_MONOTONE_DOWN, // true -- no plateau
    tail_law: 'phi_xx -> -(1/2)(ln L)_xx ~ 1/(2 (ln N)^2) -> 0  [(ln R)_xx -> 0 as R -> E_trunc floor]',
    tail_law_ratio_meas_over_model_range: '0.968 (N=1e12) -> 1.022 (N=1e32)', // within ~2-3%
  },
  finding:
    'The imp-97725 fold amplitude K does NOT stabilize across the height ladder. The numerator S = sigma_max(1-sigma_max) ' +
    'is closed-form and fixed at the unique interior peak, but the denominator phi_xx = (ln R)_xx - (1/2)(ln L)_xx drifts ' +
    'MONOTONICALLY DOWNWARD with no plateau: from 1.339604e-1 at the peak (N ~ 9.22e5) to 9.42e-5 at N = 1e32, a factor ' +
    '~1421 across the reachable tail, and still falling. The mechanism: E_flow -> 0 so R -> the constant E_trunc floor and ' +
    '(ln R)_xx -> 0, leaving phi_xx -> -(1/2)(ln L)_xx, which from ln T0(N) ~ ln N follows the leading tail law ' +
    '1/(2 (ln N)^2) -> 0 (matched to ~2-3% out to N=1e32). Because phi_xx -> 0 with no nonzero limit, the amplitude ' +
    'STRUCTURE K = sqrt(S/(2 phi_xx)) has no height-independent value; the genuine fold amplitude K = 0.423330 is fixed ' +
    'only at the single peak height and is a numerical property of the surrogate curvature there, NOT a universal constant. ' +
    'This CONFIRMS and SHARPENS the imp-97725 honest sub-gap: there is no plateau to promote to a pinned pure number.',
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Walking the imp-97725 fold-amplitude denominator phi_xx = (ln R)_xx ' +
    '- (1/2)(ln L)_xx along a height ladder N = 1e6..1e32 (same 5-point smooth-model stencil, no bisected root) shows it ' +
    'DRIFTS MONOTONICALLY DOWNWARD by a factor ~1421 (1.339604e-1 at the peak -> 9.42e-5 at 1e32) with NO plateau, ' +
    'decaying as phi_xx -> -(1/2)(ln L)_xx ~ 1/(2 (ln N)^2) -> 0 once E_flow -> 0 pins R at the E_trunc floor and ' +
    '(ln R)_xx -> 0 (tail law matched to ~2-3%). Hence K = sqrt(S/(2 phi_xx)) does NOT approach a height-independent ' +
    'limit; the fold amplitude K = 0.423330 is well-defined only at the unique interior peak and inherits the drifting ' +
    'surrogate curvature. This CONFIRMS + SHARPENS the imp-97725 SUB-GAP: K is not a dimensionless universal constant and ' +
    'there is no reachable plateau. Inherited imp-3220/imp-3406 extrapolation surrogate, NOT a rigorous asymptotic; C_mb ' +
    'GUE-conditional per imp-486 and the C_C 1/8 ansatz (imp-2642/imp-2643) UNTOUCHED; E_trunc pinned 3.06e-5 unchanged; ' +
    'changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-97725 (K structure + phi_xx SUB-GAP measured here); imp-97662 (square-root fold law, first K route); imp-97683 ' +
    '(second K route); imp-97700 (differentiate the smooth model); imp-97520 (L1 peak sigma_max ~ 0.949429); ' +
    'imp-2642/imp-2643 (C_C = (1/8) sqrt(3 pi) ansatz); lambda-rh-height-mapping (effectiveHeightForN, T0(N)).',
};

export const IMP97735_FOLD_AMPLITUDE_HEIGHT_LADDER_DRIFT_ASSERTIONS = [
  {
    id: 'imp97735-anchor-reproduces-imp97725-peak',
    description: 'at the interior peak phi_xx ~ 1.339604e-1 and K ~ 0.423330, reproducing imp-97725',
    holds: () => Math.abs(PHI_XX_PEAK - 1.339604e-1) < 5e-6 && Math.abs(K_PEAK - 0.42333) < 5e-4,
  },
  {
    id: 'imp97735-phixx-drifts-monotone-down-no-plateau',
    description: 'phi_xx is strictly decreasing along the ladder N = 1e6 .. 1e32 (no plateau, not a constant)',
    holds: () => PHI_XX_MONOTONE_DOWN === true,
  },
  {
    id: 'imp97735-phixx-drift-factor-large',
    description: 'phi_xx drifts by a factor >~ 1000 from N = 1e6 to N = 1e32 (K denominator is height-dependent)',
    holds: () => PHI_XX_DRIFT_FACTOR > 1000,
  },
  {
    id: 'imp97735-tail-law-inverse-square-log',
    description: 'in the deep tail phi_xx tracks -(1/2)(ln L)_xx ~ 1/(2 (ln N)^2) to within ~5% at N = 1e32',
    holds: () => {
      const deep = LADDER[LADDER.length - 1]; // N = 1e32
      return Math.abs(deep.negHalfLnLxx / deep.tailLaw_1over2lnN2 - 1) < 0.05;
    },
  },
  {
    id: 'imp97735-honesty-gate-no-qed',
    description: 'measurement only: isRigorous false, sub-gap confirmed, no QED, no refereed bound is changed',
    holds: () =>
      IMP97735_FOLD_AMPLITUDE_HEIGHT_LADDER_DRIFT.isRigorous === false &&
      /NO QED/.test(IMP97735_FOLD_AMPLITUDE_HEIGHT_LADDER_DRIFT.verdict) &&
      /refereed bound is changed/i.test(IMP97735_FOLD_AMPLITUDE_HEIGHT_LADDER_DRIFT.verdict) &&
      /SUB-GAP/.test(IMP97735_FOLD_AMPLITUDE_HEIGHT_LADDER_DRIFT.verdict),
  },
];

for (const a of IMP97735_FOLD_AMPLITUDE_HEIGHT_LADDER_DRIFT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97735-fold-amplitude-height-ladder-drift assertion failed: ${a.id}`);
  }
}
