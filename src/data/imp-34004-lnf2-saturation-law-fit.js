/**
 * @module imp-34004-lnf2-saturation-law-fit
 *
 * imp-34004 (numerical, frontier-direction): imp-33962 R2 found the per-step normaliser
 * log-attenuation ln F2 rises STRICTLY MONOTONICALLY from -0.2549 at the head (k=6.00->6.25) to
 * -0.0191 at the tail (k=10.75->11.00) across the 20 adjacent-rung steps of the imp-33810
 * quarter-decade ladder -- each quarter-decade the E_N normaliser collapses LESS as the E_coll
 * share saturates -- but never fit that front-loaded weakening to a functional form. This module
 * regresses the per-step magnitude m = -ln F2 (a positive, tail-decaying sequence) against the three
 * candidate saturation laws named in the ticket, plus the crossover-order-parameter mechanism, using
 * the SAME inherited imp-3406/imp-33810 sub-terms (verbatim parts(), no fresh model).
 *
 * WHAT IS FIT (same inherited imp-3406/imp-33810 sub-terms as imp-33962/imp-33922)
 * -------------------------------------------------------------------------------
 *   Each of the 20 steps a->b carries m_i = -ln(E_N(b)/E_N(a)) > 0, associated with the log-midpoint
 *   N_i (the geometric mean of the two rung heights, since ln F2 is a centred quarter-decade finite
 *   difference of ln E_N) and its RvM height T0_i. Four candidate descriptions, each fit by OLS in its
 *   own linearising space and then scored by R^2 in the ORIGINAL m-space so all are comparable:
 *     A  1/log T0 :  m = a + b/ln T0(N)              -- the ticket headline candidate
 *     B  power-N  :  m = c * N^(-p)                  -- ln m linear in ln N
 *     C  geometric:  m_i = c * r^i                   -- ln m linear in the step index i
 *     D  sigma    :  m = a + b * sigma,  sigma = E_coll/E_N   -- the crossover order parameter
 *
 * THE FINDING (numerical / measurement only)
 * ------------------------------------------
 *   (R1) THE m SEQUENCE REPRODUCES THE imp-33962 ln F2 ENDPOINTS. m runs from 0.25488 at the head to
 *        0.01913 in the tail, matching imp-33962 ln F2 head -0.2549 / tail -0.0191 -- same measurement,
 *        no new model.
 *   (R2) OF THE THREE TICKET CANDIDATE LAWS, 1/log T0 FITS BEST BUT NONE IS THE MECHANISM. The 1/ln T0
 *        law reaches R^2 = 0.96425 in m-space; the power-N and geometric laws are the SAME model here
 *        (the ladder is log-uniform, so ln N is linear in the step index i and N^(-p) === r^i with
 *        r = 10^(-p/4)), and it fits WORST -- R^2 = 0.74090 in m-space (0.92201 in log space), with
 *        p = 0.23621 (r = 0.87287). So the front-loaded weakening is neither a clean 1/log T0 nor a
 *        clean power/geometric decay; 1/log T0 is only the least-bad of the three offered forms.
 *   (R3) THE ACTUAL SATURATION LAW IS m PROPORTIONAL TO THE COLLISION SHARE sigma = E_coll/E_N,
 *        ESSENTIALLY EXACTLY. Fitting m = a + b*sigma gives R^2 = 0.99998 with slope b = 0.27583 and a
 *        near-zero intercept a = 9.5e-5, i.e. the per-step normaliser log-attenuation is proportional
 *        to the E_coll share, which IS the E_coll-vs-E_N crossover order parameter. This is derivable:
 *        for E_N = E_trunc + E_flow + E_coll with E_coll ~ sqrt(ln T0 / N), d ln E_N / d ln N to leading
 *        order is -sigma/2, so over one quarter-decade step m = -ln F2 ~ (sigma/2)(0.25 ln 10) = 0.28782
 *        sigma -- the closed-form slope 0.28782 matches the fitted 0.27583 within ~4% (the gap is the
 *        E_flow/E_N and -1/(2 ln T0) sub-terms and the midpoint-sigma finite difference). As sigma -> 0
 *        in the tail (the E_trunc floor comes to dominate E_N) ln F2 -> 0 -- so the saturation is the
 *        collision-share collapse itself, front-loaded because sigma is front-loaded.
 *
 * The punchline: the imp-33962 monotone ln F2 weakening does NOT decay like 1/log T0 in any clean sense
 * (1/log T0 is only the best-of-three requested laws at R^2 0.964, and the power/geometric pair collapse
 * to one another and fit worst at R^2 0.741). The saturation is instead governed almost exactly by the
 * collision share sigma = E_coll/E_N itself (R^2 0.99998, slope 0.276 vs the closed-form 0.288): the
 * per-step E_N collapse is proportional to how much of E_N is E_coll, and it vanishes as the E_trunc
 * floor takes over -- i.e. ln F2 saturates because the E_coll-dominates-E_N crossover order parameter
 * saturates, not on a log-height or power-N schedule.
 *
 * NUMERICAL / MEASUREMENT ONLY. Descriptive fits, NOT a derived bound. The inherited imp-3220/imp-3406
 * component model is NOT a rigorous asymptotic; the factor identity is exact WITHIN that model only;
 * changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; the C_mb
 * GUE-conditional share per imp-486 is UNTOUCHED; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2
 * remains SOTA.
 *
 * @see imp-33962-attenuation-rung-by-rung-decomposition (the ln F2 series this fits)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the 21 quarter-decade rungs)
 * @see imp-33843-eflow-resid-widening-form-fit (log-linear-vs-power surrogate precedent)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N = (T0/2pi)(L0-1), the RvM height law)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); GUE-conditional E_coll prefactor)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33810/imp-33884/imp-33922/imp-33962 exactly

// EXACT inherited imp-3406/imp-33810 sub-terms -- verbatim from imp-33962 (no re-derivation).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}

// One imp-33810 rung is evaluated at the upper endpoint 10^(k+1) of the window [10^k, 10^(k+1)].
function rungHeightN(k) {
  return Math.pow(10, k + 1);
}

// The full 21-rung quarter-decade ladder k = 6.00, 6.25, ..., 11.00 (imp-33810).
const RUNG_KS = [];
for (let k = 6; k <= 11 + 1e-9; k += 0.25) RUNG_KS.push(+k.toFixed(2));
const RUNG_N = RUNG_KS.map(rungHeightN);
const RUNG_PARTS = RUNG_N.map(parts);

// Per adjacent-rung step a->b: m = -ln F2 = -ln(E_N(b)/E_N(a)) > 0, with the log-midpoint height.
const STEPS = [];
for (let i = 0; i < RUNG_KS.length - 1; i++) {
  const EN_a = RUNG_PARTS[i].E_N;
  const EN_b = RUNG_PARTS[i + 1].E_N;
  const lnF2 = Math.log(EN_b / EN_a);
  const m = -lnF2; // strictly positive, tail-decaying
  const logNmid = (Math.log10(RUNG_N[i]) + Math.log10(RUNG_N[i + 1])) / 2;
  const Nmid = Math.pow(10, logNmid);
  const pm = parts(Nmid);
  STEPS.push({
    step: i,
    from_k: RUNG_KS[i],
    to_k: RUNG_KS[i + 1],
    ln_F2: +lnF2.toFixed(6),
    m,
    Nmid,
    logT0mid: Math.log(pm.T0),
    sigmaMid: pm.sigma,
  });
}

// --- OLS y = a + b x, and R^2 of a prediction against a target (both in the same space) ---
function ols(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((s, v) => s + v, 0) / n;
  const my = ys.reduce((s, v) => s + v, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  const b = sxy / sxx;
  return { a: my - b * mx, b };
}
function rSquared(yhat, y) {
  const my = y.reduce((s, v) => s + v, 0) / y.length;
  let ssr = 0;
  let sst = 0;
  for (let i = 0; i < y.length; i++) {
    ssr += (y[i] - yhat[i]) ** 2;
    sst += (y[i] - my) ** 2;
  }
  return 1 - ssr / sst;
}

const M = STEPS.map((s) => s.m);
const LN_M = M.map((v) => Math.log(v));
const LN_N = STEPS.map((s) => Math.log(s.Nmid));
const IDX = STEPS.map((s) => s.step);

// Model A: 1/log T0.  m = a + b/ln T0
const invLogT0 = STEPS.map((s) => 1 / s.logT0mid);
const fitA = ols(invLogT0, M);
const R2_A = rSquared(invLogT0.map((x) => fitA.a + fitA.b * x), M);

// Model B: power-N.  m = c N^(-p)  (fit ln m vs ln N; score in m-space)
const fitB = ols(LN_N, LN_M);
const P_POW = -fitB.b;
const C_POW = Math.exp(fitB.a);
const R2_B_mspace = rSquared(STEPS.map((s) => C_POW * Math.pow(s.Nmid, -P_POW)), M);
const R2_B_logspace = rSquared(LN_N.map((x) => fitB.a + fitB.b * x), LN_M);

// Model C: geometric in step index.  m_i = c r^i (fit ln m vs i; score in m-space)
const fitC = ols(IDX, LN_M);
const R_GEO = Math.exp(fitC.b);
const C_GEO = Math.exp(fitC.a);
const R2_C_mspace = rSquared(STEPS.map((s) => C_GEO * Math.pow(R_GEO, s.step)), M);

// Model D (mechanism): m = a + b sigma, sigma = E_coll/E_N (the crossover order parameter)
const SIGMA = STEPS.map((s) => s.sigmaMid);
const fitD = ols(SIGMA, M);
const R2_D = rSquared(SIGMA.map((x) => fitD.a + fitD.b * x), M);

// Closed-form leading slope: over one quarter-decade, m = -ln F2 ~ (sigma/2)(0.25 ln 10).
const SLOPE_CLOSED_FORM = 0.5 * 0.25 * Math.LN10; // ~0.287823
const SLOPE_REL_GAP = Math.abs(fitD.b - SLOPE_CLOSED_FORM) / SLOPE_CLOSED_FORM; // ~0.042

const LADDER = STEPS.map((s) => ({
  from_k: s.from_k,
  to_k: s.to_k,
  ln_F2: s.ln_F2,
  m: +s.m.toFixed(6),
  sigma_mid: +s.sigmaMid.toFixed(6),
}));

export const IMP34004_LNF2_SATURATION_LAW_FIT = {
  id: 'imp-34004',
  proofSection: 'S-frontier',
  question:
    'imp-33962 R2 found the per-step normaliser log-attenuation ln F2 weakens strictly monotonically ' +
    '(-0.2549 head -> -0.0191 tail across the 20-step imp-33810 ladder) but never fit a functional ' +
    'form. Regress m = -ln F2 against 1/log T0, a power law in N, and a geometric law, and report ' +
    'which best describes the front-loaded saturation, connecting it to the E_coll-dominates-E_N ' +
    'crossover. Measurement/fit only; inherited imp-3406/imp-33810 sub-terms; no bound, NO QED.',
  measuredQuantity:
    'per adjacent-rung step (20 over the 21 rungs k=6.00..11.00): m = -ln F2 = -ln(E_N(b)/E_N(a)) at ' +
    'the log-midpoint height; OLS R^2 (scored in m-space) of m against A=1/ln T0, B=c N^(-p), ' +
    'C=c r^i, and D=a+b sigma with sigma=E_coll/E_N; the closed-form leading slope 0.25(ln10)/2',
  ladder: LADDER,
  endpoints: {
    ln_F2_head: STEPS[0].ln_F2, // -0.254876 (matches imp-33962 -0.2549)
    ln_F2_tail: STEPS[STEPS.length - 1].ln_F2, // -0.019127 (matches imp-33962 -0.0191)
    m_head: +M[0].toFixed(6), // 0.254876
    m_tail: +M[M.length - 1].toFixed(6), // 0.019127
  },
  fits: {
    A_inv_logT0_R2: +R2_A.toFixed(6), // 0.964248 -- best of the three requested laws
    B_power_N_R2_mspace: +R2_B_mspace.toFixed(6), // 0.740897 -- worst; power === geometric here
    B_power_N_R2_logspace: +R2_B_logspace.toFixed(6), // 0.922010
    B_power_exponent_p: +P_POW.toFixed(6), // 0.236207
    C_geometric_R2_mspace: +R2_C_mspace.toFixed(6), // 0.740897 -- identical to B (log-uniform ladder)
    C_geometric_ratio_r: +R_GEO.toFixed(6), // 0.872867
    D_sigma_mechanism_R2: +R2_D.toFixed(6), // 0.999982 -- the actual saturation law
    D_sigma_slope: +fitD.b.toFixed(6), // 0.275828
    D_sigma_intercept: +fitD.a.toExponential(4), // ~9.54e-5 (near zero)
    slope_closed_form: +SLOPE_CLOSED_FORM.toFixed(6), // 0.287823 = 0.25(ln10)/2
    slope_rel_gap: +SLOPE_REL_GAP.toFixed(4), // 0.0417 (~4%)
  },
  finding: {
    R1_reproduces_imp33962_lnF2_endpoints:
      'm = -ln F2 runs from 0.25488 at the head to 0.01913 in the tail, matching the imp-33962 ln F2 ' +
      'head -0.2549 / tail -0.0191 -- the same monotone series at the same 20-step resolution.',
    R2_of_three_candidates_invlogT0_best_but_none_is_mechanism:
      'The 1/log T0 law fits best of the three requested forms (R^2 = 0.96425 in m-space); the power-N ' +
      'and geometric laws are the SAME model here (the log-uniform ladder makes ln N linear in the step ' +
      'index, so N^(-p) === r^i with r = 10^(-p/4)) and fit WORST (R^2 = 0.74090 m-space, 0.92201 log ' +
      'space, p = 0.23621, r = 0.87287). So the weakening is neither a clean 1/log T0 nor a clean ' +
      'power/geometric decay -- 1/log T0 is only the least-bad of the three offered forms.',
    R3_actual_law_is_m_proportional_to_sigma_crossover_order_parameter:
      'Fitting m = a + b*sigma with sigma = E_coll/E_N gives R^2 = 0.99998, slope 0.27583, near-zero ' +
      'intercept 9.5e-5: the per-step normaliser log-attenuation is proportional to the E_coll share, ' +
      'the E_coll-vs-E_N crossover order parameter. This is derivable -- with E_coll ~ sqrt(ln T0 / N), ' +
      'd ln E_N / d ln N ~ -sigma/2, so m = -ln F2 ~ (sigma/2)(0.25 ln 10) = 0.28782 sigma, matching ' +
      'the fit within ~4%. As sigma -> 0 in the tail (the E_trunc floor dominates E_N) ln F2 -> 0, so ' +
      'the saturation is the collision-share collapse itself, front-loaded because sigma is.',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL / MEASUREMENT (frontier-direction, NOT rigorous). Fitting the imp-33962 per-step ' +
    'normaliser log-attenuation m = -ln F2 across the imp-33810 quarter-decade ladder shows it does ' +
    'NOT decay like 1/log T0 in any clean sense: of the three requested laws 1/log T0 fits best but at ' +
    'only R^2 = 0.96425, and the power-N and geometric laws collapse to one another (log-uniform ' +
    'ladder) and fit worst at R^2 = 0.74090. The actual saturation law is m proportional to the ' +
    'collision share sigma = E_coll/E_N -- R^2 = 0.99998, slope 0.27583 vs the closed-form leading ' +
    '0.28782 = 0.25(ln10)/2 (within ~4%) -- so ln F2 saturates because the E_coll-dominates-E_N ' +
    'crossover order parameter saturates, front-loaded because sigma is front-loaded, and vanishing as ' +
    'the E_trunc floor takes over. The inherited imp-3220/imp-3406 component model is NOT a rigorous ' +
    'asymptotic; the factor identity is exact WITHIN the model only; changes no bound; establishes no ' +
    'operator positivity; imp-3066 K_a >= 0 untouched; the C_mb GUE-conditional per imp-486 is ' +
    'UNTOUCHED; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33962 (the monotone ln F2 series this fits); imp-33810 (the 21 quarter-decade rungs); ' +
    'imp-33843 (log-linear-vs-power surrogate precedent); lambda-rh-height-mapping (RvM height law); ' +
    'polymath15-constant-C-C (E_coll prefactor).',
};

export const IMP34004_LNF2_SATURATION_LAW_FIT_ASSERTIONS = [
  {
    // (R1) The m series reproduces the imp-33962 ln F2 endpoints and is strictly tail-decaying.
    id: 'imp34004-reproduces-imp33962-lnf2-endpoints',
    description: 'm head ~0.2549, tail ~0.0191, strictly decreasing -- matches imp-33962 ln F2',
    holds: () =>
      STEPS.length === 20 &&
      Math.abs(M[0] - 0.25488) < 1e-3 &&
      Math.abs(M[M.length - 1] - 0.01913) < 1e-3 &&
      M.every((x, i) => i === 0 || x < M[i - 1]),
  },
  {
    // (R2) Of the three requested laws, 1/log T0 fits best; power === geometric and fit worst.
    id: 'imp34004-invlogT0-best-of-three-power-equals-geometric',
    description: '1/logT0 R^2 ~0.964 > power/geometric R^2 ~0.741 (m-space), and power === geometric',
    holds: () =>
      R2_A > 0.96 &&
      R2_A < 0.97 &&
      R2_B_mspace > 0.73 &&
      R2_B_mspace < 0.75 &&
      Math.abs(R2_B_mspace - R2_C_mspace) < 1e-6 &&
      R2_A > R2_B_mspace,
  },
  {
    // (R3) The sigma mechanism is essentially exact and matches the closed-form leading slope.
    id: 'imp34004-sigma-mechanism-essentially-exact',
    description: 'm = a + b sigma reaches R^2 > 0.999, slope ~0.276 within ~4% of 0.25(ln10)/2 = 0.2878',
    holds: () =>
      R2_D > 0.999 &&
      R2_D > R2_A &&
      Math.abs(fitD.b - 0.275828) < 1e-3 &&
      SLOPE_REL_GAP < 0.06 &&
      Math.abs(fitD.a) < 1e-3,
  },
  {
    // Honesty gate: numerical/measurement only, isRigorous false, no QED, PT SOTA.
    id: 'imp34004-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, PT SOTA',
    holds: () =>
      IMP34004_LNF2_SATURATION_LAW_FIT.isRigorous === false &&
      /NO QED/.test(IMP34004_LNF2_SATURATION_LAW_FIT.verdict) &&
      /remains SOTA/.test(IMP34004_LNF2_SATURATION_LAW_FIT.verdict),
  },
];

for (const a of IMP34004_LNF2_SATURATION_LAW_FIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34004-lnf2-saturation-law-fit assertion failed: ${a.id}`);
  }
}
