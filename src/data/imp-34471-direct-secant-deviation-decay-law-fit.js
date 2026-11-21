/**
 * @module imp-34471-direct-secant-deviation-decay-law-fit
 *
 * imp-34471 (numerical, frontier-direction): FIT the imp-34410 F3 direct-secant deviation
 *     delta(N) = (p_resid - p_direct) * log T0 = (gapSigmaDirect - resid) * L
 * to its decay law across a DENSE log10 N ladder in [12, 50], and locate the N at which delta
 * first drops below 1e-6.
 *
 * WHAT imp-34410 F3 LEFT OPEN
 * ---------------------------
 * imp-34410 F3 tabulated the direct-secant deviation delta at only THREE points:
 *     delta = +7.67e-1 at log10 N = 12   (sigma near its peak, E_trunc dominant),
 *     delta = +1.80e-4 at log10 N = 20,
 *     delta at numerical floor by log10 N >= 50.
 * It named delta the "E_trunc/E_flow sub-term contamination" of the sigma exponent that the
 * closed-form-only complement identity cannot see, but it never FIT the falloff -- so the shape
 * of the decay (and the exact N where the contamination becomes negligible) was unquantified.
 *
 * THE MEASUREMENT (identical imp-34410 machinery, denser ladder)
 * -------------------------------------------------------------
 * delta(N) is recomputed here from the SAME imp-34410 full-sigma central secant:
 *     p_direct(N) = -d ln sigma / d ln N   (sigma = E_coll/(E_trunc + E_flow + E_coll)),
 *     resid(N)    = (1/2)(u-1)/(u L)       (the shared far-tail closed form),
 *     delta(N)    = (gapSigmaDirect - resid) * L,  gapSigmaDirect = 1/2 - p_direct.
 * gapProduct cancels in the difference, so delta(N) here equals imp-34410 deltaDirect exactly
 * (the argument-scaled step dl = 1e-4 * ln N is inherited verbatim). We evaluate delta on the
 * dense integer ladder log10 N = 12, 14, ..., 30 and fit three candidate falloffs.
 *
 * THE FINDING (fit only)
 * ----------------------
 *   (F1) THE DECAY IS A POWER LAW IN N, delta ~ 10^A * N^(-alpha), NOT 1/log and NOT true
 *        exponential-in-N. An OLS fit of log10 delta vs log10 N over the clean window
 *        log10 N = 12..24 gives A ~ 5.45, alpha ~ 0.4604 with max ln-residual ~0.10; the
 *        competing 1/log law (ln delta vs ln L) fits ~8x worse (max ln-residual ~0.77).
 *   (F2) THE POWER-LAW EXPONENT DRIFTS UP MONOTONICALLY TOWARD 1/2. The local exponent
 *        alpha_local = -d ln delta / d ln N climbs 0.415 (log10 N=12) -> 0.472 (log10 N=24),
 *        approaching the alpha = 1/2 set by the E_coll ~ N^(-1/2) collision envelope: once the
 *        far tail is reached sigma -> E_coll/E_trunc, so the deviation from resid decays at the
 *        E_coll rate. The fitted alpha ~ 0.46 is the window-averaged slope of this drift.
 *   (F3) delta FIRST DROPS BELOW 1e-6 AT log10 N ~ 24.80 (N ~ 10^24.8). Bisection on the exact
 *        full-sigma secant pins the crossing at log10 N = 24.8012. Beyond log10 N ~ 28 the secant
 *        roundoff floor (~1.6e-9, from the 1e-4 * ln N step) takes over and the power law no
 *        longer governs -- but the 1e-6 crossing sits safely inside the clean power-law window.
 *
 * THE VERDICT: the imp-34410 F3 E_trunc/E_flow contamination of the sigma exponent decays as a
 * POWER LAW in N with exponent alpha -> 1/2 (the E_coll ~ N^(-1/2) envelope), NOT 1/log; it first
 * falls below 1e-6 at log10 N ~ 24.80. The imp-34410 F3 three-point sketch is now a fitted decay
 * law with the negligibility threshold quantified.
 *
 * FIT / TABULATION ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional
 * per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0
 * untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34410-complement-identity-direct-secant-crossvalidation (F3 named delta, tabulated 3 points)
 * @see imp-33816-sigma-exponent-asymptote-approach-rate (full-sigma direct secant path)
 * @see imp-34328-sigma-vs-product-gap-log2pi-shift (the complement identity, shared closed form)
 * @see imp-34130-ecoll-local-exponent-residual-close-vs-floor (shared resid = (1/2) d ln(log T0)/d ln N)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 */

import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const HALF = 0.5;
const LOG_2PI = Math.log(TWO_PI);
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33816)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // identical to imp-33816/imp-34410

// imp-33859 log-space direct path: solve ln N = u + log(u-1) for u = log(T0/2pi), never forming T0/N.
function uFromLnN(lnN) {
  let u = Math.max(2, lnN);
  for (let i = 0; i < 200; i++) {
    const g = u + Math.log(u - 1) - lnN;
    const gp = 1 + 1 / (u - 1);
    const du = g / gp;
    u -= du;
    if (u <= 1) u = 1 + 1e-12;
    if (Math.abs(du) < 1e-15 * Math.max(1, u)) break;
  }
  return u;
}

// The shared closed-form residual (imp-34130/imp-34328/imp-34410): resid = (1/2)(u-1)/(u L).
function residFromLnN(lnN) {
  const u = uFromLnN(lnN);
  const L = u + LOG_2PI;
  return HALF * (u - 1) / (u * L);
}

// The FULL sigma exponent sub-terms (imp-33816/imp-34410), in log-N space so the far tail never
// overflows: sigma = E_coll/(E_trunc + E_flow + E_coll).
function lnSigmaFromLnN(lnN) {
  const u = uFromLnN(lnN);
  const L = u + LOG_2PI;
  const C_F = (u + 1) / TWO_PI; // (log(T0/2pi)+1)/2pi, imp-398 pinned prefactor
  const lnE_coll = Math.log(C_C_PINNED) + 0.5 * Math.log(L) - 0.5 * lnN; // C_C sqrt(L/N)
  const E_coll = Math.exp(lnE_coll);
  const E_flow = C_F * L * Math.exp(-L) * GRONWALL; // C_F (L/T0) Gronwall, T0 = e^L
  return lnE_coll - Math.log(E_TRUNC_PT + E_flow + E_coll);
}

// DIRECT full-sigma central secant of p(N) = -d ln sigma / d ln N (imp-34410 step, argument-scaled).
function pDirectFromLnN(lnN) {
  const dl = 1e-4 * Math.max(1, lnN);
  return -(lnSigmaFromLnN(lnN + dl) - lnSigmaFromLnN(lnN - dl)) / (2 * dl);
}

// The imp-34410 F3 deviation, recomputed: delta = (gapSigmaDirect - resid) * L = deltaDirect.
function deltaFromLog10N(d) {
  const lnN = d * Math.LN10;
  const L = uFromLnN(lnN) + LOG_2PI;
  const gapSigmaDirect = HALF - pDirectFromLnN(lnN);
  return (gapSigmaDirect - residFromLnN(lnN)) * L;
}

// Local power-law exponent in N: alpha_local = -d ln delta / d ln N (central, half-decade step).
function alphaLocalAtLog10N(d) {
  const h = 0.25;
  return -(Math.log(deltaFromLog10N(d + h)) - Math.log(deltaFromLog10N(d - h))) / (2 * h * Math.LN10);
}

// Dense integer ladder over the imp-34471 window; the numerical floor sets in past log10 N ~ 28.
const LADDER_LOG10N = [12, 14, 16, 18, 20, 22, 24, 26, 28, 30];

const DEVIATION_LADDER = LADDER_LOG10N.map((d) => ({
  log10N: d,
  logT0: +(uFromLnN(d * Math.LN10) + LOG_2PI).toFixed(4),
  delta: +deltaFromLog10N(d).toExponential(4),
  alphaLocal: +alphaLocalAtLog10N(d).toFixed(4),
}));

// OLS fit of log10 delta = A + B * log10 N over the CLEAN window log10 N = 12..24 (before the
// secant roundoff floor). B = -alpha, so delta ~ 10^A * N^(-alpha) is a POWER LAW in N.
const FIT_WINDOW = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
function olsPowerFit() {
  const xs = FIT_WINDOW;
  const ys = xs.map((d) => Math.log10(deltaFromLog10N(d)));
  const n = xs.length;
  const sx = xs.reduce((a, b) => a + b, 0);
  const sy = ys.reduce((a, b) => a + b, 0);
  const sxx = xs.reduce((a, b) => a + b * b, 0);
  const sxy = xs.reduce((a, b, i) => a + b * ys[i], 0);
  const B = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  const A = (sy - B * sx) / n;
  let maxResidLn = 0;
  for (let i = 0; i < n; i++) maxResidLn = Math.max(maxResidLn, Math.abs(A + B * xs[i] - ys[i]) * Math.LN10);
  return { A, alpha: -B, maxResidLn };
}

// Competing 1/log law: ln delta = Al + Bl * ln L over the same window (fits far worse).
function olsLogLawFit() {
  const xs = FIT_WINDOW;
  const Ls = xs.map((d) => Math.log(uFromLnN(d * Math.LN10) + LOG_2PI));
  const ys = xs.map((d) => Math.log(deltaFromLog10N(d)));
  const n = xs.length;
  const sL = Ls.reduce((a, b) => a + b, 0);
  const sy = ys.reduce((a, b) => a + b, 0);
  const sLL = Ls.reduce((a, b) => a + b * b, 0);
  const sLy = Ls.reduce((a, b, i) => a + b * ys[i], 0);
  const Bl = (n * sLy - sL * sy) / (n * sLL - sL * sL);
  const Al = (sy - Bl * sL) / n;
  let maxResidLn = 0;
  for (let i = 0; i < n; i++) maxResidLn = Math.max(maxResidLn, Math.abs(Al + Bl * Ls[i] - ys[i]));
  return { exponent: Bl, maxResidLn };
}

// Bisection on the exact full-sigma secant for the first log10 N where |delta| < 1e-6.
function crossingLog10N() {
  let lo = 24;
  let hi = 26;
  for (let i = 0; i < 100; i++) {
    const m = (lo + hi) / 2;
    if (Math.abs(deltaFromLog10N(m)) >= 1e-6) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}

const POWER_FIT = olsPowerFit();
const LOG_LAW_FIT = olsLogLawFit();
const CROSSING_LOG10N = crossingLog10N();

export const IMP34471_DIRECT_SECANT_DEVIATION_DECAY_LAW_FIT = {
  id: 'imp-34471',
  proofSection: 'S-frontier',
  question:
    'Fit the imp-34410 F3 direct-secant deviation delta(N) = (p_resid - p_direct) log T0 (the ' +
    'E_trunc/E_flow sub-term contamination of the sigma exponent) to its decay law across a dense ' +
    'log10 N ladder in [12,50] and locate the N at which delta first drops below 1e-6. imp-34410 F3 ' +
    'tabulated delta at only three points and never fit the falloff. Fit only; conditional-share ' +
    'diagnostic, NOT an RH bound; C_mb stays GUE-conditional (imp-486); no QED.',
  measuredQuantity:
    'delta(N) = (gapSigmaDirect - resid) * L from the imp-34410 full-sigma central secant ' +
    'p(N) = -d ln sigma/d ln N (sigma = E_coll/(E_trunc + E_flow + E_coll)) on the dense ladder ' +
    'log10 N = 12,14,...,30; OLS power-law fit log10 delta = A + B log10 N over log10 N = 12..24; ' +
    'competing 1/log fit; and the log10 N where |delta| first falls below 1e-6',
  deviationLadder: DEVIATION_LADDER,
  powerFit: {
    A: +POWER_FIT.A.toFixed(4),
    alpha: +POWER_FIT.alpha.toFixed(5),
    maxResidLn: +POWER_FIT.maxResidLn.toExponential(3),
    form: 'delta ~ 10^A * N^(-alpha), a POWER law in N (== geometric per decade in log10 N)',
  },
  logLawFit: {
    exponent: +LOG_LAW_FIT.exponent.toFixed(3),
    maxResidLn: +LOG_LAW_FIT.maxResidLn.toExponential(3),
    note: '1/log law ln delta = Al + Bl ln L fits ~8x worse than the power law -- rejected',
  },
  crossingLog10N: +CROSSING_LOG10N.toFixed(4),
  finding: {
    F1_decay_is_power_law_in_N:
      'log10 delta vs log10 N is linear over log10 N = 12..24: delta ~ 10^A * N^(-alpha) with ' +
      'A ~ 5.45, alpha ~ 0.4604 and max ln-residual ~0.10. The competing 1/log law (ln delta vs ' +
      'ln L) fits ~8x worse (max ln-residual ~0.77). The contamination decays as a POWER law in N, ' +
      'not 1/log and not true exponential-in-N.',
    F2_exponent_drifts_up_toward_half:
      'The local exponent alpha_local = -d ln delta/d ln N climbs monotonically 0.415 (log10 N=12) ' +
      '-> 0.472 (log10 N=24), approaching the alpha = 1/2 set by the E_coll ~ N^(-1/2) collision ' +
      'envelope: in the far tail sigma -> E_coll/E_trunc so the deviation from resid decays at the ' +
      'E_coll rate. The fitted alpha ~ 0.46 is the window-averaged slope of that drift.',
    F3_delta_first_below_1e6_at_log10N_24p80:
      'Bisection on the exact full-sigma secant pins the first log10 N where |delta| < 1e-6 at ' +
      'log10 N = 24.80 (N ~ 10^24.8), safely inside the clean power-law window. Past log10 N ~ 28 ' +
      'the secant roundoff floor (~1.6e-9, from the 1e-4 ln N step) takes over and the power law ' +
      'no longer governs.',
  },
  isRigorous: false,
  verdict:
    'FIT / TABULATION (frontier-direction, NOT rigorous). The imp-34410 F3 direct-secant deviation ' +
    'delta(N) = (p_resid - p_direct) log T0 -- the E_trunc/E_flow contamination of the sigma exponent ' +
    '-- decays as a POWER LAW in N, delta ~ 10^5.45 * N^(-0.46), with the local exponent drifting ' +
    'monotonically up 0.415 -> 0.472 toward the alpha = 1/2 fixed by the E_coll ~ N^(-1/2) collision ' +
    'envelope. The 1/log law fits ~8x worse and is rejected. delta first drops below 1e-6 at ' +
    'log10 N = 24.80 (N ~ 10^24.8); beyond log10 N ~ 28 the secant roundoff floor (~1.6e-9) governs. ' +
    'The imp-34410 F3 three-point sketch is now a fitted decay law with the negligibility threshold ' +
    'quantified. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous ' +
    'asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no ' +
    'operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-34410 (F3 named delta, tabulated 3 points, never fit); imp-33816 (full-sigma direct secant); ' +
    'imp-34328 (complement identity, shared closed form); imp-34130 (shared resid); imp-2631 (E_trunc ' +
    'fixed-strip route); imp-486 (C_mb GUE-conditional).',
};

export const IMP34471_DIRECT_SECANT_DEVIATION_DECAY_LAW_FIT_ASSERTIONS = [
  {
    // (F1): the power law fits FAR better than the 1/log law over the clean window.
    id: 'imp34471-power-law-beats-log-law',
    description: 'power-law max ln-residual < 0.15 and beats the 1/log law by > 3x (delta ~ N^(-alpha), not 1/log)',
    holds: () =>
      POWER_FIT.maxResidLn < 0.15 && LOG_LAW_FIT.maxResidLn > 3 * POWER_FIT.maxResidLn,
  },
  {
    // (F1): the fitted power-law exponent sits in the physically-expected band around the E_coll rate.
    id: 'imp34471-fitted-alpha-near-collision-envelope',
    description: 'fitted power-law exponent alpha in (0.40, 0.50), the E_coll ~ N^(-1/2) collision-envelope band',
    holds: () => POWER_FIT.alpha > 0.4 && POWER_FIT.alpha < 0.5,
  },
  {
    // (F2): the local exponent drifts UP monotonically toward 1/2 across the clean window.
    id: 'imp34471-local-exponent-drifts-up-toward-half',
    description: 'alpha_local increases from log10 N=12 to 24 and both endpoints lie below 1/2 (approach from below)',
    holds: () => {
      const a12 = alphaLocalAtLog10N(12);
      const a24 = alphaLocalAtLog10N(24);
      return a24 > a12 && a12 < 0.5 && a24 < 0.5 && a24 > 0.46;
    },
  },
  {
    // (F3): delta first falls below 1e-6 near log10 N ~ 24.8, inside the clean window.
    id: 'imp34471-crossing-below-1e-6-at-log10N-24p8',
    description: '|delta| first drops below 1e-6 at log10 N in (24.5, 25.1)',
    holds: () => CROSSING_LOG10N > 24.5 && CROSSING_LOG10N < 25.1,
  },
  {
    // Reuse gate: delta here reproduces the imp-34410 F3 anchor points (identical inherited secant).
    id: 'imp34471-reproduces-imp34410-anchor-points',
    description: 'delta(log10 N=12) ~ 0.767 and delta(log10 N=20) ~ 1.8e-4 (matches imp-34410 F3 to 2 sig figs)',
    holds: () => {
      const d12 = deltaFromLog10N(12);
      const d20 = deltaFromLog10N(20);
      return Math.abs(d12 - 7.67e-1) < 5e-3 && Math.abs(d20 - 1.80e-4) < 5e-6;
    },
  },
  {
    // Honesty gate: fit only, no QED, no refereed bound is changed.
    id: 'imp34471-honesty-gate-no-qed',
    description: 'Fit only: not rigorous, no QED, no refereed bound is changed',
    holds: () =>
      IMP34471_DIRECT_SECANT_DEVIATION_DECAY_LAW_FIT.isRigorous === false &&
      /NO QED/.test(IMP34471_DIRECT_SECANT_DEVIATION_DECAY_LAW_FIT.verdict) &&
      /refereed bound is changed/i.test(IMP34471_DIRECT_SECANT_DEVIATION_DECAY_LAW_FIT.verdict),
  },
];

for (const a of IMP34471_DIRECT_SECANT_DEVIATION_DECAY_LAW_FIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34471-direct-secant-deviation-decay-law-fit assertion failed: ${a.id}`);
  }
}
