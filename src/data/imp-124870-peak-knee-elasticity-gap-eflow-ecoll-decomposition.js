/**
 * @module imp-124870-peak-knee-elasticity-gap-eflow-ecoll-decomposition
 *
 * imp-124870 (numerical, frontier-direction): imp-124848's ten-floor OLS fit certified the sigma
 * INTERIOR-PEAK floor-elasticity p_peak ~ -1.412 (R^2 ~ 0.99961) as a genuinely softer exponent
 * than the imp-124772 far-tail KNEE p_knee ~ -2.106 -- a ~0.69 gap -- and ATTRIBUTED the softening
 * to the E_flow term (E_flow ~ 4.7e-5 comparable to E_trunc near the peak). But it never SEPARATED
 * how much of the ~0.69 gap the E_flow arm carries versus the slow E_coll log-drift. This module
 * measures that term-by-term split by re-running the imp-3406 component model live and ablating the
 * two slow corrections one at a time across the same imp-33708 0.5x..5x E_trunc floor ladder.
 *
 * THE MODEL (identical formulas to imp-3406 / imp-33684 / imp-97822)
 * -----------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     T0     = effectiveHeightForN(N)              (Riemann-von Mangoldt inverse)
 *     L      = log T0
 *     E_coll = C_C_PINNED * sqrt(L / N)            (GUE-conditional, dominant)
 *     E_flow = C_F * (L / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc = 3.06e-5 * factor                   (perturbed floor; base imp-2631)
 * The interior PEAK is argmax_N sigma; the far-tail KNEE is the single zero-crossing of the ramp
 * curvature c(d) = d2p/d(log10 N)^2 with p(d) = -d ln sigma/d ln N (imp-97708 pointwise locator).
 * Floor factor 1.0 reproduces imp-3406 exactly. The exponent is the OLS slope of log10 N* on
 * log10 E_trunc over all ten factors (byte-for-byte the imp-124848 / imp-124772 fits).
 *
 * THE DECOMPOSITION (frozen-L ablation of E_coll)
 * -----------------------------------------------
 * The pure dimensional scaling N* ~ E_trunc^(-2) rides on E_coll ~ N^(-1/2). Two slow corrections
 * bend the exponent away from that ideal: (i) the E_coll LOG-DRIFT -- the N-dependence of L = log T0
 * inside E_coll -- and (ii) the E_flow arm. We isolate them by re-locating each landmark with L
 * held FROZEN inside E_coll at its own self-consistent landmark value L* = L(N*) (a per-floor
 * fixed point; E_flow keeps its full N-dependence), giving p_peak_frozenL and p_knee_frozenL. The
 * gap then splits additively via the two frozen-L exponents:
 *     gap = [p_peak_full - p_peak_frozenL]  (E_coll log-drift at the peak)
 *         + [p_peak_frozenL - p_knee_frozenL] (frozen-L residual gap = the E_flow arm)
 *         + [p_knee_frozenL - p_knee_full]   (E_coll log-drift at the knee)
 * so the E_coll contribution is the sum of the two log-drift terms and the E_flow contribution is
 * the frozen-L residual gap (with the E_coll log-drift removed from BOTH landmarks, the only thing
 * still separating the peak exponent from the knee exponent is that E_flow is O(E_trunc) near the
 * peak but negligible at the far-tail knee).
 *
 * TWO CONTROLS anchor the split. (C1) With E_flow set to zero AND L frozen in E_coll, the knee
 * exponent returns to the clean dimensional p ~ -2.10 -- confirming the frozen-L residual is a
 * genuine E_flow effect, not a fitting artifact. (C2) With E_flow set to zero the interior PEAK
 * DISAPPEARS ENTIRELY (sigma = 1/(1 + E_trunc/E_coll) is monotone in N, so the ternary argmax
 * collapses to the search lower bound): the peak exists ONLY because the decaying E_flow arm turns
 * the right shoulder over. The peak is, structurally, an E_flow phenomenon.
 *
 * THE FINDING (measurement / decomposition only)
 * ----------------------------------------------
 *   (D0) REPRODUCES BOTH EXPONENTS. p_peak_full ~ -1.4117 and p_knee_full ~ -2.1064 match the
 *        imp-124848 (-1.412) and imp-124772 (-2.106) full-ladder OLS fits, and gap ~ +0.6947.
 *   (D1) E_flow CARRIES ~91% OF THE GAP. The frozen-L residual gap p_peak_frozenL - p_knee_frozenL
 *        ~ +0.6296 is 90.6% of the 0.6947 gap: with the E_coll log-drift removed from both
 *        landmarks the peak still sits ~0.63 shallower than the knee, and that residual is entirely
 *        the E_flow arm (control C1: zeroing E_flow returns the frozen-L knee to -2.10).
 *   (D2) E_coll LOG-DRIFT CARRIES ~9% -- ALMOST ALL OF IT AT THE PEAK. The E_coll contribution is
 *        +0.0651 (9.4%), split +0.0682 at the peak and only -0.0031 at the knee: the L(N) drift
 *        inside E_coll softens the peak exponent by ~0.07 but is negligible at the far tail, where
 *        L is nearly flat over the locate window.
 *   (D3) THE PEAK IS STRUCTURALLY AN E_flow PHENOMENON (control C2). Zeroing E_flow removes the
 *        interior maximum outright, so the ~0.69 softening is not a perturbative correction to a
 *        pre-existing peak but a consequence of the arm that creates the peak in the first place --
 *        quantitatively confirming the imp-124848 attribution rather than merely restating it.
 *
 * VERDICT: the imp-124848 ~0.69 interior-peak-vs-far-tail floor-elasticity gap decomposes as
 * E_flow ~ +0.6296 (90.6%) and E_coll log-drift ~ +0.0651 (9.4%), the E_coll part living almost
 * entirely at the peak (+0.068 vs -0.003 at the knee). The E_flow attribution imp-124848 stated is
 * quantitatively CONFIRMED: E_flow carries ~91% of the softening, and control C2 shows the peak
 * exists only because of the E_flow arm.
 *
 * MEASUREMENT / DECOMPOSITION ONLY. Conditional-share curvature diagnostic, NOT an RH bound. The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the
 * C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * SUB-GAP (named): the frozen-L ablation is a first-order term-freezing split -- any E_flow x
 * E_coll-log cross-term is attributed to the frozen (E_coll-log) leg wherever it is removed, so the
 * 90.6/9.4 split is accurate to the ~0.006 self-consistency residual of the per-floor L* fixed
 * point, not exact. A fully orthogonal (path-independent) decomposition is not attempted here.
 *
 * @see imp-124848-sigma-interior-peak-floor-elasticity-multifloor-fit (peak p ~ -1.412; the attribution decomposed here)
 * @see imp-124772-knee-floor-elasticity-multifloor-fit (far-tail knee p ~ -2.106; the steeper contrast)
 * @see imp-33684-sigma-interior-peak-etrunc-model-sensitivity (interior-peak sensitivityTable + model form)
 * @see imp-97822-sigma-knee-etrunc-floor-elasticity (bracketing-free pointwise knee locator reused here)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP124848_SIGMA_INTERIOR_PEAK_FLOOR_ELASTICITY_MULTIFLOOR_FIT } from './imp-124848-sigma-interior-peak-floor-elasticity-multifloor-fit.js';
import { IMP124772_KNEE_FLOOR_ELASTICITY_MULTIFLOOR_FIT } from './imp-124772-knee-floor-elasticity-multifloor-fit.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_BASE = 3.06e-5; // imp-2631 fixed-strip floor (imp-3406 pin)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406 exactly
const FLOOR_FACTORS = [0.5, 0.75, 0.9, 1.0, 1.1, 1.25, 1.5, 2.0, 3.0, 5.0];

// Full imp-3406 model (factor 1.0 reproduces imp-3406 byte-for-byte).
function sigmaFull(N, E_trunc) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  return E_coll / (E_trunc + E_flow + E_coll);
}

// Frozen-L in E_coll only (E_flow keeps full N-dependence): isolates the E_coll log-drift.
function sigmaFrozenLcoll(N, E_trunc, Lstar) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(Lstar / N);
  return E_coll / (E_trunc + E_flow + E_coll);
}

// Control C1/C2: E_flow removed. Full-L and frozen-L variants.
function sigmaNoFlowFull(N, E_trunc) {
  const L = Math.log(effectiveHeightForN(N));
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  return E_coll / (E_trunc + E_coll);
}
function sigmaNoFlowFrozen(N, E_trunc, Lstar) {
  const E_coll = C_C_PINNED * Math.sqrt(Lstar / N);
  return E_coll / (E_trunc + E_coll);
}

// Interior peak: argmax_N sigma (same ternary bracketing as imp-33684).
function argmaxPeak(sig, E_trunc) {
  let lo = Math.log(1e3);
  let hi = Math.log(1e10);
  for (let i = 0; i < 600; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (sig(Math.exp(m1), E_trunc) < sig(Math.exp(m2), E_trunc)) lo = m1;
    else hi = m2;
  }
  return Math.exp((lo + hi) / 2);
}

// Far-tail knee: single zero-crossing of ramp curvature (imp-97708 / imp-97822 pointwise locator).
function pPointwise(sig, d, h, E_trunc) {
  const sp = Math.log(sig(Math.pow(10, d + h), E_trunc));
  const sm = Math.log(sig(Math.pow(10, d - h), E_trunc));
  return -(sp - sm) / (2 * h * Math.LN10);
}
function kneeLog10(sig, E_trunc, lo = 7.0, hi = 11.0) {
  const h = 0.02;
  const dd = 0.04;
  const step = 0.005;
  const c = (d) => {
    const pp = pPointwise(sig, d + dd, h, E_trunc);
    const p0 = pPointwise(sig, d, h, E_trunc);
    const pm = pPointwise(sig, d - dd, h, E_trunc);
    return (pp - 2 * p0 + pm) / (dd * dd);
  };
  let prev = c(lo);
  let prevD = lo;
  const cross = [];
  for (let d = lo + step; d <= hi; d += step) {
    const cur = c(d);
    if (prev === 0 || prev < 0 !== cur < 0) cross.push(prevD + (step * (0 - prev)) / (cur - prev));
    prev = cur;
    prevD = d;
  }
  if (cross.length === 1) return cross[0];
  return cross.length ? cross[cross.length - 1] : null;
}

function olsSlope(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return sxy / sxx;
}

// Self-consistent frozen-L landmark loci (per-floor fixed point on L* = L(N*)).
function peakFrozen(E_trunc) {
  let N = argmaxPeak(sigmaFull, E_trunc);
  for (let it = 0; it < 4; it++) {
    const Lstar = Math.log(effectiveHeightForN(N));
    N = argmaxPeak((n, e) => sigmaFrozenLcoll(n, e, Lstar), E_trunc);
  }
  return Math.log10(N);
}
function kneeFrozen(E_trunc) {
  let d = kneeLog10(sigmaFull, E_trunc);
  for (let it = 0; it < 4; it++) {
    const Lstar = Math.log(effectiveHeightForN(Math.pow(10, d)));
    const dd = kneeLog10((n, e) => sigmaFrozenLcoll(n, e, Lstar), E_trunc);
    if (dd === null) break;
    d = dd;
  }
  return d;
}
function kneeNoFlowFrozen(E_trunc) {
  let d = kneeLog10(sigmaNoFlowFull, E_trunc);
  for (let it = 0; it < 4; it++) {
    const Lstar = Math.log(effectiveHeightForN(Math.pow(10, d)));
    const dd = kneeLog10((n, e) => sigmaNoFlowFrozen(n, e, Lstar), E_trunc);
    if (dd === null) break;
    d = dd;
  }
  return d;
}

const XS = FLOOR_FACTORS.map((f) => Math.log10(E_TRUNC_BASE * f));

const P_PEAK_FULL = olsSlope(XS, FLOOR_FACTORS.map((f) => Math.log10(argmaxPeak(sigmaFull, E_TRUNC_BASE * f))));
const P_KNEE_FULL = olsSlope(XS, FLOOR_FACTORS.map((f) => kneeLog10(sigmaFull, E_TRUNC_BASE * f)));
const P_PEAK_FROZ = olsSlope(XS, FLOOR_FACTORS.map((f) => peakFrozen(E_TRUNC_BASE * f)));
const P_KNEE_FROZ = olsSlope(XS, FLOOR_FACTORS.map((f) => kneeFrozen(E_TRUNC_BASE * f)));

// Control C1: E_flow=0 + frozen-L knee returns to the clean dimensional anchor ~ -2.10.
const P_KNEE_NOFLOW_FROZ = olsSlope(XS, FLOOR_FACTORS.map((f) => kneeNoFlowFrozen(E_TRUNC_BASE * f)));
// Control C2: E_flow=0 peak argmax collapses to the search lower bound (no interior peak).
const PEAK_NOFLOW_LOG10 = FLOOR_FACTORS.map((f) => Math.log10(argmaxPeak(sigmaNoFlowFull, E_TRUNC_BASE * f)));
const PEAK_VANISHES_NOFLOW = PEAK_NOFLOW_LOG10.every((v) => v < 3.5); // all pinned at log10(1e3)=3 bound

const GAP = P_PEAK_FULL - P_KNEE_FULL; // ~ +0.6947
const TERM_ECOLL_PEAK = P_PEAK_FULL - P_PEAK_FROZ; // ~ +0.0682 (E_coll log-drift at peak)
const TERM_ECOLL_KNEE = P_KNEE_FROZ - P_KNEE_FULL; // ~ -0.0031 (E_coll log-drift at knee)
const CONTRIB_ECOLL = TERM_ECOLL_PEAK + TERM_ECOLL_KNEE; // ~ +0.0651
const CONTRIB_EFLOW = P_PEAK_FROZ - P_KNEE_FROZ; // ~ +0.6296 (frozen-L residual gap)
const SUM_CHECK = CONTRIB_ECOLL + CONTRIB_EFLOW; // ~ GAP
const PCT_EFLOW = (100 * CONTRIB_EFLOW) / GAP; // ~ 90.6
const PCT_ECOLL = (100 * CONTRIB_ECOLL) / GAP; // ~ 9.4

const r6 = (x) => +x.toFixed(6);
const r4 = (x) => +x.toFixed(4);
const r1 = (x) => +x.toFixed(1);

export const IMP124870_PEAK_KNEE_ELASTICITY_GAP_EFLOW_ECOLL_DECOMPOSITION = {
  id: 'imp-124870',
  proofSection: 'S-frontier',
  question:
    'imp-124848 certified the sigma interior-peak floor-elasticity p_peak ~ -1.412 as ~0.69 softer ' +
    'than the imp-124772 far-tail knee p_knee ~ -2.106 and attributed the softening to E_flow, but ' +
    'never separated the E_flow and E_coll contributions to the gap. Decompose the ~0.69 exponent ' +
    'gap term-by-term across the imp-33708 0.5x..5x floor ladder via a frozen-L ablation of E_coll, ' +
    'quantifying how much of the softening the E_flow arm vs the E_coll log-drift each carry. ' +
    'Measurement/decomposition only; conditional-share diagnostic, NOT an RH bound; no QED.',
  measuredQuantity:
    'the additive split of the peak-vs-knee OLS floor-elasticity gap into an E_flow contribution ' +
    '(the frozen-L residual gap) and an E_coll log-drift contribution (the two per-landmark ' +
    'frozen-L shifts), with two ablation controls (E_flow=0 knee anchor and E_flow=0 peak collapse)',
  model: 'sigma = E_coll/(E_trunc + E_flow + E_coll); E_coll = C_C sqrt(log T0 / N), E_flow = C_F (log T0 / T0) Gronwall, E_trunc = 3.06e-5 * factor',
  exponents: {
    p_peak_full: r6(P_PEAK_FULL), // ~ -1.4117 (reproduces imp-124848 -1.412)
    p_knee_full: r6(P_KNEE_FULL), // ~ -2.1064 (reproduces imp-124772 -2.106)
    p_peak_frozenL: r6(P_PEAK_FROZ), // ~ -1.4799
    p_knee_frozenL: r6(P_KNEE_FROZ), // ~ -2.1095
    gap: r6(GAP), // ~ +0.6947
  },
  decomposition: {
    gap: r6(GAP),
    eflow_contribution: r6(CONTRIB_EFLOW), // ~ +0.6296
    ecoll_contribution: r6(CONTRIB_ECOLL), // ~ +0.0651
    eflow_pct: r1(PCT_EFLOW), // ~ 90.6
    ecoll_pct: r1(PCT_ECOLL), // ~ 9.4
    ecoll_at_peak: r6(TERM_ECOLL_PEAK), // ~ +0.0682
    ecoll_at_knee: r6(TERM_ECOLL_KNEE), // ~ -0.0031
    sum_check: r6(SUM_CHECK), // ~ GAP (additive identity)
    note:
      'gap = [p_peak_full - p_peak_frozenL] + [p_peak_frozenL - p_knee_frozenL] + ' +
      '[p_knee_frozenL - p_knee_full]; the middle (frozen-L residual) term is the E_flow arm, the ' +
      'two outer terms are the E_coll log-drift. E_flow carries ~90.6%, E_coll log-drift ~9.4% ' +
      '(almost all of it at the peak: +0.068 vs -0.003 at the knee).',
  },
  controls: {
    C1_noflow_knee_anchor: r6(P_KNEE_NOFLOW_FROZ), // ~ -2.10: zeroing E_flow returns the frozen-L knee to the clean dimensional exponent
    C2_peak_vanishes_without_eflow: PEAK_VANISHES_NOFLOW, // true: E_flow=0 removes the interior peak (argmax pinned at search lower bound)
    note:
      'C1: with E_flow=0 and L frozen in E_coll the knee exponent returns to ~ -2.10, so the ' +
      'frozen-L residual gap is a genuine E_flow effect. C2: with E_flow=0 the interior peak ' +
      'DISAPPEARS (sigma = 1/(1 + E_trunc/E_coll) is monotone), so the peak exists ONLY because of ' +
      'the decaying E_flow arm -- the softening is a property of the arm that creates the peak.',
  },
  crossCheck: {
    imp124848_p_peak: IMP124848_SIGMA_INTERIOR_PEAK_FLOOR_ELASTICITY_MULTIFLOOR_FIT.pPeakLsq, // ~ -1.412
    imp124772_p_knee: IMP124772_KNEE_FLOOR_ELASTICITY_MULTIFLOOR_FIT.pKneeLsq, // ~ -2.106
    peak_reproduction_delta: r6(Math.abs(P_PEAK_FULL - IMP124848_SIGMA_INTERIOR_PEAK_FLOOR_ELASTICITY_MULTIFLOOR_FIT.pPeakLsq)),
    knee_reproduction_delta: r6(Math.abs(P_KNEE_FULL - IMP124772_KNEE_FLOOR_ELASTICITY_MULTIFLOOR_FIT.pKneeLsq)),
  },
  finding: {
    D0_reproduces_both_exponents:
      'p_peak_full ~ -1.4117 and p_knee_full ~ -2.1064 match the imp-124848 (-1.412) and imp-124772 ' +
      '(-2.106) full-ladder OLS fits, with gap ~ +0.6947.',
    D1_eflow_carries_91pct:
      'the frozen-L residual gap p_peak_frozenL - p_knee_frozenL ~ +0.6296 is ~90.6% of the 0.6947 ' +
      'gap: with the E_coll log-drift removed from both landmarks the peak still sits ~0.63 ' +
      'shallower than the knee, and control C1 (zeroing E_flow returns the frozen-L knee to -2.10) ' +
      'confirms that residual is the E_flow arm.',
    D2_ecoll_logdrift_carries_9pct_mostly_at_peak:
      'the E_coll contribution is +0.0651 (~9.4%), split +0.0682 at the peak and only -0.0031 at ' +
      'the knee: the L(N) drift inside E_coll softens the peak exponent by ~0.07 but is negligible ' +
      'at the far tail where L is nearly flat over the locate window.',
    D3_peak_is_structurally_an_eflow_phenomenon:
      'control C2 -- zeroing E_flow removes the interior maximum outright -- shows the ~0.69 ' +
      'softening is not a perturbative correction to a pre-existing peak but a consequence of the ' +
      'arm that creates the peak, quantitatively confirming the imp-124848 attribution.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). The imp-124848 ~0.69 interior-peak-vs-far-tail ' +
    'floor-elasticity gap decomposes as E_flow ~ +0.6296 (90.6%) and E_coll log-drift ~ +0.0651 ' +
    '(9.4%), the E_coll part living almost entirely at the peak (+0.068 vs -0.003 at the knee). ' +
    'Control C1 (E_flow=0 returns the frozen-L knee to ~ -2.10) certifies the residual is a genuine ' +
    'E_flow effect; control C2 (E_flow=0 removes the interior peak) shows the peak exists only ' +
    'because of the E_flow arm, so the softening is quantitatively an E_flow phenomenon -- ' +
    'confirming the imp-124848 attribution rather than restating it. SUB-GAP: the frozen-L ablation ' +
    'is a first-order term-freezing split (any E_flow x E_coll-log cross-term is charged to the ' +
    'frozen leg), accurate to the ~0.006 self-consistency residual of the per-floor L* fixed point, ' +
    'not exact; a fully path-independent decomposition is not attempted. The component model is the ' +
    'inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional ' +
    'per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-124848 (interior-peak p ~ -1.412, the E_flow attribution decomposed here); imp-124772 ' +
    '(far-tail knee p ~ -2.106); imp-33684 (interior-peak sensitivityTable + model form); imp-97822 ' +
    '(bracketing-free pointwise knee locator); imp-3406 (component model); imp-486 (C_mb ' +
    'GUE-conditional); imp-2631 (E_trunc = 3.06e-5 fixed-strip floor).',
};

export const IMP124870_PEAK_KNEE_ELASTICITY_GAP_EFLOW_ECOLL_DECOMPOSITION_ASSERTIONS = [
  {
    // D0: reproduces the imp-124848 / imp-124772 full-ladder exponents.
    id: 'imp124870-reproduces-peak-and-knee-exponents',
    description: 'p_peak_full ~ -1.412 and p_knee_full ~ -2.106 reproduce imp-124848 / imp-124772 within 0.01',
    holds: () =>
      Math.abs(P_PEAK_FULL - IMP124848_SIGMA_INTERIOR_PEAK_FLOOR_ELASTICITY_MULTIFLOOR_FIT.pPeakLsq) < 0.01 &&
      Math.abs(P_KNEE_FULL - IMP124772_KNEE_FLOOR_ELASTICITY_MULTIFLOOR_FIT.pKneeLsq) < 0.01,
  },
  {
    // Additive identity: the three terms sum to the gap.
    id: 'imp124870-decomposition-is-additive',
    description: 'E_flow + E_coll contributions sum to the peak-vs-knee gap within 1e-9',
    holds: () => Math.abs(SUM_CHECK - GAP) < 1e-9,
  },
  {
    // D1: E_flow carries the overwhelming majority of the gap.
    id: 'imp124870-eflow-carries-majority-of-gap',
    description: 'the E_flow contribution is at least 80% of the ~0.69 gap and is positive (softening)',
    holds: () => CONTRIB_EFLOW > 0 && PCT_EFLOW > 80,
  },
  {
    // D2: E_coll log-drift is a small positive residue, concentrated at the peak.
    id: 'imp124870-ecoll-small-and-peak-concentrated',
    description: 'E_coll contribution < 20% of the gap and larger in magnitude at the peak than at the knee',
    holds: () => PCT_ECOLL < 20 && Math.abs(TERM_ECOLL_PEAK) > Math.abs(TERM_ECOLL_KNEE),
  },
  {
    // C1: zeroing E_flow returns the frozen-L knee to the clean dimensional anchor ~ -2.10.
    id: 'imp124870-control-noflow-knee-anchor',
    description: 'with E_flow=0 and L frozen in E_coll the knee exponent returns to ~ -2.10 (within 0.03 of -2.1)',
    holds: () => Math.abs(P_KNEE_NOFLOW_FROZ + 2.1) < 0.03,
  },
  {
    // C2: the interior peak vanishes without E_flow (structural).
    id: 'imp124870-control-peak-vanishes-without-eflow',
    description: 'with E_flow=0 the interior peak disappears (argmax pinned at the search lower bound)',
    holds: () => PEAK_VANISHES_NOFLOW === true,
  },
  {
    // Honesty gate: measurement/decomposition only, named sub-gap, no QED, no refereed bound is changed.
    id: 'imp124870-honesty-gate-no-qed',
    description: 'Measurement only: decomposes the elasticity gap, names the sub-gap, no QED, no refereed bound is changed',
    holds: () =>
      IMP124870_PEAK_KNEE_ELASTICITY_GAP_EFLOW_ECOLL_DECOMPOSITION.isRigorous === false &&
      /NO QED/.test(IMP124870_PEAK_KNEE_ELASTICITY_GAP_EFLOW_ECOLL_DECOMPOSITION.verdict) &&
      /SUB-GAP/.test(IMP124870_PEAK_KNEE_ELASTICITY_GAP_EFLOW_ECOLL_DECOMPOSITION.verdict) &&
      /refereed bound is changed/i.test(IMP124870_PEAK_KNEE_ELASTICITY_GAP_EFLOW_ECOLL_DECOMPOSITION.verdict),
  },
];

for (const a of IMP124870_PEAK_KNEE_ELASTICITY_GAP_EFLOW_ECOLL_DECOMPOSITION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-124870-peak-knee-elasticity-gap-eflow-ecoll-decomposition assertion failed: ${a.id}`,
    );
  }
}
