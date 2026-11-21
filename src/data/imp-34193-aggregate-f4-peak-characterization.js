/**
 * @module imp-34193-aggregate-f4-peak-characterization
 *
 * imp-34193 (numerical, frontier-direction): imp-34128 A3 LOCATED the aggregate (window-endpoint)
 * F4 peak at symmetric-shrink s** = 1.13346 with F4max = 1.37596 by golden-section, but never
 * explained WHAT sets that peak height/location, nor related it to the DISTINCT per-step
 * adjacent-rung factor F4(k) = resid(k+0.25)/resid(k) that imp-34003 refined. This module derives
 * the aggregate factor as an INTEGRAL of the per-step log-growth rate over the shrinking window,
 * expresses the peak condition dF4/ds = 0 in terms of the imp-33773 M2 residual log-slope (the
 * curvature that drives it), and assesses whether the peak MAGNITUDE is predictable from the
 * imp-34003 per-step F4 profile. All within the inherited imp-3406/imp-33810 model -- verbatim
 * sub-terms, no re-derivation.
 *
 * SET-UP (verbatim imp-34128/imp-34003 sub-terms; resid(k) is the imp-33773 M2 sub-leading residual)
 * --------------------------------------------------------------------------------------------------
 *   resid(k) = pEcoll(k)*(1 - sigma(hi)) - pSigma(k),   window [10^k, 10^(k+1)] at hi = 10^(k+1)
 *   Aggregate F4 over the symmetric window [k_lo = 6.00+s, k_hi = 11.00-s]:
 *     F4(s) = resid(k_hi) / resid(k_lo)     (imp-34128 A3 object)
 *   Continuum log-slope of the residual (the dk -> 0 per-step growth rate; imp-34003 uses dk = 0.25):
 *     lambda(k) = resid_prime(k) / resid(k) = d/dk [ln resid(k)]
 *   imp-34003 pinned the residual PEAK (lambda = 0) at k_peak = 8.821092, resid(k_peak) = 0.0653366.
 *
 * THE CHARACTERIZATION (numerical / derivation-within-model only)
 * --------------------------------------------------------------
 *   (C1) AGGREGATE F4 IS THE EXPONENTIATED INTEGRAL OF THE PER-STEP LOG-GROWTH RATE.
 *        ln F4(s) = ln resid(k_hi) - ln resid(k_lo) = INTEGRAL_{k_lo}^{k_hi} lambda(k) dk.
 *        At the peak window [7.133458, 9.866542] the Simpson integral of lambda reproduces
 *        ln F4max = 0.31914847 to 1.9e-11 -- so the aggregate factor is not a free-standing endpoint
 *        ratio but the accumulated per-step (log) growth swept across the window, exactly the dk -> 0
 *        limit of the imp-34003 per-step F4(k) = resid(k+dk)/resid(k) chained over the window.
 *
 *   (C2) THE PEAK CONDITION dF4/ds = 0 IS EQUAL-AND-OPPOSITE ENDPOINT LOG-SLOPES.
 *        d/ds ln F4(s) = d/ds INTEGRAL_{6+s}^{11-s} lambda = -lambda(k_hi) - lambda(k_lo) (Leibniz),
 *        so dF4/ds = 0  <=>  lambda(k_hi) = -lambda(k_lo). At s** the two endpoint log-slopes are
 *        +0.543866 (k_lo, still amplifying) and -0.543866 (k_hi, attenuating): equal magnitude,
 *        opposite sign, summing to 3.4e-8. Solving lambda(11-s) + lambda(6+s) = 0 directly (bisection,
 *        NO golden-section on F4) reproduces s** = 1.13345798, matching imp-34128 A3's 1.13345792 to
 *        6.3e-8. So the peak is the shrink at which the residual is growing (in log) at the low edge
 *        exactly as fast as it is decaying at the high edge.
 *
 *   (C3) WHAT THE M2 RESIDUAL CURVATURE SAYS ABOUT THE LOCATION. lambda(k) is driven by the residual
 *        curvature at its peak: near k_peak, lambda(k) ~ (resid_pp/resid)|_peak * (k - k_peak) with
 *        relative curvature resid_pp/resid|_peak = -0.554010. In THAT parabolic-residual approximation
 *        lambda(k_hi) = -lambda(k_lo) would force (k_lo + k_hi)/2 = k_peak. But the symmetric-shrink
 *        window is centered at the FIXED midpoint (6+11)/2 = 8.50, NOT at k_peak = 8.821092, so no
 *        window in the family has its center on the residual peak. The true peak therefore sits where
 *        the FULL (non-parabolic) lambda profile balances at UNEQUAL offsets: k_lo is 1.687634 BELOW
 *        the residual peak while k_hi is only 1.045450 ABOVE it -- the log-slope profile flattens away
 *        from the peak, so equal |lambda| occurs farther out on the low (steeper-curvature) side. The
 *        0.321 gap between the window center (8.50) and the residual peak (8.821) is exactly why the
 *        location cannot be read off curvature alone.
 *
 *   (C4) THE HEIGHT IS PREDICTABLE FROM THE PER-STEP F4 PROFILE TO SUB-PERCENT. Reconstructing
 *        ln F4max from the imp-34003 per-step factor alone -- INTEGRAL of ln F4_perstep(k)/dk over the
 *        window (dk = 0.25) -- gives 0.317746, i.e. F4 ~ 1.374029 versus the true 1.375956: a 0.14%
 *        under-read. The 0.001403 shortfall in ln is a pure finite-dk quadrature bias (ln F4_ps(k)/dk
 *        approximates lambda at the step MIDPOINT k+dk/2, not at k), and shrinks as dk -> 0 toward the
 *        exact (C1) integral. So YES: the aggregate peak magnitude is set by, and recoverable from,
 *        the per-step F4(k) profile -- the two F4 objects are the same residual-growth field read at
 *        two resolutions (endpoint ratio vs quarter-decade step), NOT independent quantities.
 *
 * The punchline: the imp-34128 aggregate-F4 peak is the exponentiated integral of the imp-34003
 * per-step log-growth rate over the symmetric window (C1); it peaks where the residual grows at the
 * low edge as fast as it decays at the high edge, lambda(k_hi) = -lambda(k_lo) (C2); its location is
 * NOT the residual peak because the window center 8.50 is offset 0.321 from k_peak = 8.821, forcing an
 * asymmetric log-slope balance (C3); and its height 1.37596 is recoverable from the per-step F4
 * profile to 0.14%, the gap a quantifiable finite-dk = 0.25 bias (C4).
 *
 * NUMERICAL / DERIVATION-WITHIN-MODEL ONLY. Characterizes an imp-34128 extremum inside the inherited
 * imp-3220/imp-3406 component model, which is NOT a rigorous asymptotic; the resid(k) surrogate, the
 * integral identity and the peak condition are exact WITHIN that model only; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; the C_mb GUE-conditional share per
 * imp-486 is UNTOUCHED; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34128-aggregate-f4-crossing-peak-subrung (the golden-section peak s**=1.13346 this explains)
 * @see imp-34003-f4-unity-crossing-locator (the per-step F4(k) and the resid peak k_peak=8.82109)
 * @see imp-33962-attenuation-rung-by-rung-decomposition (the 0.9225 aggregate share headline)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the 21 quarter-decade rungs)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N = (T0/2pi)(L0-1), the RvM height law)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); GUE-conditional E_coll prefactor)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33810/imp-34128 exactly
const DK = 0.25; // the imp-33810 quarter-decade ladder step (imp-34003 per-step)

// EXACT inherited imp-3406/imp-33810 sub-terms -- verbatim from imp-34128/imp-34003 (no re-derivation).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

function olsSigmaExponent(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(sigma(N)));
  }
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return -sxy / sxx;
}
function ecollExponentMag(loN, hiN) {
  return -Math.log(parts(hiN).E_coll / parts(loN).E_coll) / Math.log(hiN / loN);
}

// The imp-33773 M2 sub-leading residual as a CONTINUOUS function of the ladder coordinate k --
// exactly the imp-34128 endpoint(k).resid / imp-34003 resid(k), verbatim (no re-derivation).
function resid(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const ph = parts(hi);
  return pEcoll * (1 - ph.sigma) - pSigma;
}

// Continuum log-slope (per-step growth rate) lambda(k) = resid_prime(k)/resid(k) = d/dk ln resid.
const DERIV_H = 1e-5;
const dResid = (k) => (resid(k + DERIV_H) - resid(k - DERIV_H)) / (2 * DERIV_H);
const d2Resid = (k) => (resid(k + DERIV_H) - 2 * resid(k) + resid(k - DERIV_H)) / (DERIV_H * DERIV_H);
const lambda = (k) => dResid(k) / resid(k);

// Aggregate F4 over the symmetric window [6.00+s, 11.00-s] (imp-34128 A3 object).
const K_LO_BASE = 6.0;
const K_HI_BASE = 11.0;
const WINDOW_CENTER = 0.5 * (K_LO_BASE + K_HI_BASE); // 8.50 -- FIXED under symmetric shrink
const F4agg = (s) => resid(K_HI_BASE - s) / resid(K_LO_BASE + s);

// Numerical helpers.
function goldenMaxF4(sLo, sHi) {
  let a = sLo;
  let b = sHi;
  const gr = (Math.sqrt(5) - 1) / 2;
  let c = b - gr * (b - a);
  let d = a + gr * (b - a);
  for (let i = 0; i < 200; i++) {
    if (F4agg(c) > F4agg(d)) b = d;
    else a = c;
    c = b - gr * (b - a);
    d = a + gr * (b - a);
  }
  return 0.5 * (a + b);
}
function bisect(f, a, b, iters = 200) {
  let fa = f(a);
  for (let i = 0; i < iters; i++) {
    const m = 0.5 * (a + b);
    const fm = f(m);
    if (fa * fm <= 0) b = m;
    else {
      a = m;
      fa = fm;
    }
  }
  return 0.5 * (a + b);
}
function simpson(f, a, b, n) {
  if (n % 2) n++;
  const h = (b - a) / n;
  let s = f(a) + f(b);
  for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * f(a + i * h);
  return (s * h) / 3;
}

// (A3) reproduce the imp-34128 aggregate-F4 peak by golden section.
const S_MAX = goldenMaxF4(0.5, 2.0); // 1.13345792
const F4_MAX = F4agg(S_MAX); // 1.375956
const K_LO = K_LO_BASE + S_MAX; // 7.133458
const K_HI = K_HI_BASE - S_MAX; // 9.866542

// imp-34003 residual peak (lambda = 0).
const K_PEAK = bisect(dResid, 8.0, 9.6); // 8.821092
const RESID_PEAK = resid(K_PEAK); // 0.0653366
const REL_CURV_PEAK = d2Resid(K_PEAK) / RESID_PEAK; // resid_pp/resid at peak, ~ -0.554010

// (C1) aggregate ln F4 = integral of lambda over the window.
const LN_F4_MAX = Math.log(F4_MAX);
const LN_F4_INTEGRAL = simpson(lambda, K_LO, K_HI, 2000);
const C1_INTEGRAL_ERR = Math.abs(LN_F4_MAX - LN_F4_INTEGRAL); // ~1.9e-11

// (C2) peak condition lambda(k_hi) = -lambda(k_lo); confirm and re-locate s** from it directly.
const LAMBDA_LO = lambda(K_LO); // +0.543866
const LAMBDA_HI = lambda(K_HI); // -0.543866
const PEAK_COND_SUM = LAMBDA_LO + LAMBDA_HI; // ~3.4e-8
const peakCond = (s) => lambda(K_HI_BASE - s) + lambda(K_LO_BASE + s);
const S_FROM_COND = bisect(peakCond, 1.0, 1.3); // 1.13345798
const S_COND_VS_GOLDEN = Math.abs(S_FROM_COND - S_MAX); // ~6.3e-8

// (C3) endpoint offsets from the residual peak (asymmetric balance).
const OFFSET_LO = K_PEAK - K_LO; // 1.687634 below peak
const OFFSET_HI = K_HI - K_PEAK; // 1.045450 above peak
const CENTER_PEAK_GAP = K_PEAK - WINDOW_CENTER; // 0.321092

// (C4) reconstruct the height from the per-step F4(k) profile (dk = 0.25) alone.
const F4ps = (k) => resid(k + DK) / resid(k); // imp-34003 per-step factor
const lnFpsRate = (k) => Math.log(F4ps(k)) / DK; // ~ lambda(k + dk/2)
const LN_F4_FROM_PERSTEP = simpson(lnFpsRate, K_LO - DK / 2, K_HI - DK / 2, 2000);
const F4_FROM_PERSTEP = Math.exp(LN_F4_FROM_PERSTEP); // 1.374029
const HEIGHT_REL_ERR = Math.abs(F4_FROM_PERSTEP - F4_MAX) / F4_MAX; // ~0.0014 (0.14%)
const FINITE_DK_LN_BIAS = LN_F4_MAX - LN_F4_FROM_PERSTEP; // 0.001403

export const IMP34193_AGGREGATE_F4_PEAK_CHARACTERIZATION = {
  id: 'imp-34193',
  proofSection: 'S-frontier',
  question:
    'imp-34128 A3 located the aggregate (window-endpoint) F4 peak at symmetric-shrink s**=1.13346 ' +
    'with F4max=1.37596 by golden-section but never explained WHAT sets its height/location, nor ' +
    'related it to the DISTINCT per-step adjacent-rung F4(k)=resid(k+0.25)/resid(k) that imp-34003 ' +
    'refined. Derive the aggregate F4(s)=resid(k_hi)/resid(k_lo) as an integral of the per-step ' +
    'ratios over the shrinking window, express the peak condition dF4/ds=0 in terms of the M2 ' +
    'residual curvature, and assess whether the peak magnitude is predictable from the per-step F4 ' +
    'profile. Derivation/measurement within the inherited imp-3406/imp-33810 model only; NOT a ' +
    'rigorous asymptotic; changes no bound; NO QED.',
  measuredQuantity:
    'for the symmetric window [k_lo=6.00+s, k_hi=11.00-s]: aggregate ln F4(s) vs the integral of the ' +
    'continuum log-slope lambda(k)=resid_prime/resid; the peak condition lambda(k_hi)=-lambda(k_lo) ' +
    'and the s** it predicts; the residual-peak offsets; and the height reconstructed from the ' +
    'per-step F4(k)/dk profile',
  ladderStep: DK,
  windowCenter: +WINDOW_CENTER.toFixed(6), // 8.500000 (fixed under symmetric shrink)
  peak: {
    s_max_decades: +S_MAX.toFixed(8), // 1.13345792
    F4_max: +F4_MAX.toFixed(6), // 1.375956
    k_lo: +K_LO.toFixed(6), // 7.133458
    k_hi: +K_HI.toFixed(6), // 9.866542
    ln_F4_max: +LN_F4_MAX.toFixed(8), // 0.31914847
  },
  residualPeak: {
    k_peak: +K_PEAK.toFixed(6), // 8.821092 (imp-34003)
    resid_at_peak: +RESID_PEAK.toFixed(7), // 0.0653366
    rel_curvature_at_peak: +REL_CURV_PEAK.toFixed(6), // -0.554010 (resid_pp/resid)
  },
  c1_integral_identity: {
    ln_F4_max: +LN_F4_MAX.toFixed(10),
    integral_lambda: +LN_F4_INTEGRAL.toFixed(10),
    abs_err: +C1_INTEGRAL_ERR.toExponential(3), // ~1.9e-11
    note:
      'ln F4(s) = INTEGRAL_{k_lo}^{k_hi} lambda dk: the aggregate factor is the exponentiated ' +
      'accumulated per-step log-growth across the window (dk -> 0 limit of the imp-34003 chain)',
  },
  c2_peak_condition: {
    lambda_lo: +LAMBDA_LO.toFixed(6), // +0.543866 (amplifying at low edge)
    lambda_hi: +LAMBDA_HI.toFixed(6), // -0.543866 (attenuating at high edge)
    peak_cond_sum: +PEAK_COND_SUM.toExponential(3), // ~3.4e-8
    s_from_condition: +S_FROM_COND.toFixed(8), // 1.13345798 (bisecting lambda(hi)+lambda(lo)=0)
    s_cond_vs_golden_abs: +S_COND_VS_GOLDEN.toExponential(3), // ~6.3e-8
    note:
      'dF4/ds = -lambda(k_hi) - lambda(k_lo) (Leibniz), so dF4/ds=0 <=> lambda(k_hi)=-lambda(k_lo): ' +
      'the residual grows in log at the low edge exactly as fast as it decays at the high edge',
  },
  c3_curvature_and_offsets: {
    offset_lo_below_peak: +OFFSET_LO.toFixed(6), // 1.687634
    offset_hi_above_peak: +OFFSET_HI.toFixed(6), // 1.045450
    center_minus_peak_gap: +CENTER_PEAK_GAP.toFixed(6), // 0.321092
    note:
      'parabolic-residual lambda(k) ~ (resid_pp/resid)|_peak*(k-k_peak) would force the extremum at ' +
      'window center = k_peak; but the symmetric-shrink center is FIXED at 8.50, offset 0.321 from ' +
      'k_peak=8.821, so the true balance is asymmetric (k_lo 1.688 below, k_hi 1.045 above the peak)',
  },
  c4_height_predictability: {
    F4_from_perstep_profile: +F4_FROM_PERSTEP.toFixed(6), // 1.374029
    height_rel_err: +HEIGHT_REL_ERR.toExponential(3), // ~1.4e-3 (0.14%)
    finite_dk_ln_bias: +FINITE_DK_LN_BIAS.toFixed(6), // 0.001403
    note:
      'reconstructing ln F4 from INTEGRAL of ln F4_perstep(k)/dk (dk=0.25) gives F4~1.374029 vs true ' +
      '1.375956: 0.14% under-read, a pure finite-dk midpoint-quadrature bias that vanishes as dk -> 0',
  },
  finding: {
    C1_aggregate_is_integral_of_perstep:
      'ln F4(s) = INTEGRAL_{k_lo}^{k_hi} lambda(k) dk, lambda = resid_prime/resid. At the peak window ' +
      '[7.133458, 9.866542] the Simpson integral reproduces ln F4max = 0.31914847 to 1.9e-11 -- the ' +
      'aggregate factor is the accumulated per-step log-growth swept across the window, the dk -> 0 ' +
      'limit of the imp-34003 per-step F4(k) = resid(k+dk)/resid(k) chained edge-to-edge.',
    C2_peak_is_balanced_endpoint_logslopes:
      'dF4/ds = -lambda(k_hi) - lambda(k_lo) (Leibniz on the moving limits), so the peak dF4/ds=0 is ' +
      'lambda(k_hi) = -lambda(k_lo): at s** the endpoint log-slopes are +0.543866 (low, amplifying) ' +
      'and -0.543866 (high, attenuating), summing to 3.4e-8. Bisecting lambda(11-s)+lambda(6+s)=0 ' +
      '(no golden-section) gives s** = 1.13345798, matching imp-34128 A3 to 6.3e-8.',
    C3_location_needs_full_profile_not_just_curvature:
      'Near k_peak, lambda(k) ~ (resid_pp/resid)|_peak*(k-k_peak) with rel-curvature -0.554010; that ' +
      'parabolic model would force (k_lo+k_hi)/2 = k_peak. But the symmetric-shrink window center is ' +
      'FIXED at 8.50, offset 0.321 from k_peak = 8.821092, so no window sits on the peak -- the true ' +
      'balance is asymmetric (k_lo 1.688 below, k_hi 1.045 above), set by the full non-parabolic ' +
      'lambda profile, not by curvature at the peak alone.',
    C4_height_predictable_from_perstep_to_subpercent:
      'Reconstructing ln F4max from the imp-34003 per-step factor alone -- INTEGRAL of ' +
      'ln F4_perstep(k)/dk over the window (dk=0.25) -- gives F4 ~ 1.374029 vs true 1.375956: a 0.14% ' +
      'under-read whose 0.001403 ln-shortfall is a pure finite-dk midpoint-quadrature bias that ' +
      'vanishes as dk -> 0. The two F4 objects are the same residual-growth field at two resolutions.',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL / CHARACTERIZATION (frontier-direction, NOT rigorous). The imp-34128 A3 aggregate-F4 ' +
    'peak (F4max=1.37596 at s**=1.13346) is fully explained inside the inherited model: (C1) it is ' +
    'the exponentiated integral of the imp-34003 per-step log-growth rate lambda=resid_prime/resid ' +
    'over the window (ln F4max = INTEGRAL lambda dk to 1.9e-11); (C2) it peaks where lambda(k_hi) = ' +
    '-lambda(k_lo) (+/-0.543866), i.e. the residual grows in log at the low edge as fast as it decays ' +
    'at the high edge -- solving that condition alone relocates s** to 1.13345798, matching the ' +
    'golden-section value to 6.3e-8; (C3) the location is NOT the residual peak k_peak=8.821092 ' +
    'because the symmetric-shrink window center is fixed at 8.50 (offset 0.321), forcing an ' +
    'asymmetric log-slope balance (k_lo 1.688 below, k_hi 1.045 above the peak); and (C4) the height ' +
    'is recoverable from the per-step F4(k) profile to 0.14% (1.374029 vs 1.375956), the gap a ' +
    'quantifiable finite-dk=0.25 quadrature bias. The inherited imp-3220/imp-3406 component model is ' +
    'NOT a rigorous asymptotic; the resid(k) surrogate, the integral identity and the peak condition ' +
    'are exact WITHIN the model only; changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; the C_mb GUE-conditional per imp-486 is UNTOUCHED; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-34128 (the golden-section aggregate-F4 peak this explains); imp-34003 (the per-step F4(k) ' +
    'and the resid peak k_peak=8.82109); imp-33962 (the 0.9225 aggregate share headline); imp-33810 ' +
    '(the 21 quarter-decade rungs); lambda-rh-height-mapping (RvM height law); polymath15-constant-C-C ' +
    '(E_coll prefactor).',
};

export const IMP34193_AGGREGATE_F4_PEAK_CHARACTERIZATION_ASSERTIONS = [
  {
    // (setup) reproduces the imp-34128 A3 aggregate-F4 peak (s**, F4max, k_lo, k_hi).
    id: 'imp34193-reproduces-imp34128-a3-peak',
    description: 'golden-section aggregate-F4 peak at s**~1.13346, F4max~1.37596, window [7.13346, 9.86654]',
    holds: () =>
      Math.abs(S_MAX - 1.13345792) < 1e-5 &&
      Math.abs(F4_MAX - 1.375956) < 1e-4 &&
      Math.abs(K_LO - 7.133458) < 1e-4 &&
      Math.abs(K_HI - 9.866542) < 1e-4,
  },
  {
    // (C1) aggregate ln F4 equals the integral of the continuum log-slope over the window.
    id: 'imp34193-c1-aggregate-is-integral-of-perstep-logslope',
    description: 'ln F4max = INTEGRAL lambda dk over [k_lo,k_hi] to < 1e-8 (aggregate = accumulated per-step log-growth)',
    holds: () =>
      C1_INTEGRAL_ERR < 1e-8 &&
      Math.abs(LN_F4_MAX - 0.31914847) < 1e-6,
  },
  {
    // (C2) the peak is equal-and-opposite endpoint log-slopes; the condition alone relocates s**.
    id: 'imp34193-c2-peak-condition-balanced-logslopes',
    description: 'lambda(k_hi)=-lambda(k_lo) (+/-0.54387, sum<1e-6); bisecting lambda(hi)+lambda(lo)=0 gives s**~1.133458',
    holds: () =>
      Math.abs(PEAK_COND_SUM) < 1e-6 &&
      LAMBDA_LO > 0 &&
      LAMBDA_HI < 0 &&
      Math.abs(LAMBDA_LO - 0.543866) < 1e-4 &&
      Math.abs(LAMBDA_HI + 0.543866) < 1e-4 &&
      S_COND_VS_GOLDEN < 1e-5,
  },
  {
    // (C3) location is an asymmetric balance offset from the residual peak (window center fixed at 8.5).
    id: 'imp34193-c3-asymmetric-balance-offset-from-resid-peak',
    description: 'window center 8.50 offset 0.321 from k_peak=8.82109; endpoints straddle at unequal offsets 1.688/1.045',
    holds: () =>
      Math.abs(WINDOW_CENTER - 8.5) < 1e-9 &&
      Math.abs(K_PEAK - 8.821092) < 1e-4 &&
      Math.abs(CENTER_PEAK_GAP - 0.321092) < 1e-4 &&
      Math.abs(OFFSET_LO - 1.687634) < 1e-4 &&
      Math.abs(OFFSET_HI - 1.045450) < 1e-4 &&
      OFFSET_LO > OFFSET_HI &&
      REL_CURV_PEAK < 0,
  },
  {
    // (C4) the peak height is predictable from the per-step F4 profile to sub-percent (finite-dk bias).
    id: 'imp34193-c4-height-predictable-from-perstep-profile',
    description: 'per-step reconstruction F4~1.374029 vs true 1.375956 (0.14% under-read, finite-dk ln-bias ~0.0014)',
    holds: () =>
      Math.abs(F4_FROM_PERSTEP - 1.374029) < 1e-4 &&
      HEIGHT_REL_ERR < 3e-3 &&
      FINITE_DK_LN_BIAS > 0 &&
      Math.abs(FINITE_DK_LN_BIAS - 0.001403) < 1e-4,
  },
  {
    // Honesty gate: numerical/characterization only, isRigorous false, no QED, no refereed bound is changed.
    id: 'imp34193-honesty-gate-no-qed',
    description: 'Characterization only: isRigorous false, no QED, no refereed bound is changed, K_a untouched, C_mb imp-486 untouched',
    holds: () =>
      IMP34193_AGGREGATE_F4_PEAK_CHARACTERIZATION.isRigorous === false &&
      /NO QED/.test(IMP34193_AGGREGATE_F4_PEAK_CHARACTERIZATION.verdict) &&
      /refereed bound is changed/i.test(IMP34193_AGGREGATE_F4_PEAK_CHARACTERIZATION.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34193_AGGREGATE_F4_PEAK_CHARACTERIZATION.verdict) &&
      /C_mb[^.]*imp-486[^.]*UNTOUCHED/i.test(IMP34193_AGGREGATE_F4_PEAK_CHARACTERIZATION.verdict),
  },
];

for (const a of IMP34193_AGGREGATE_F4_PEAK_CHARACTERIZATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34193-aggregate-f4-peak-characterization assertion failed: ${a.id}`);
  }
}
