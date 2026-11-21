/**
 * @module imp-34428-fartail-correction-two-term-fit
 *
 * imp-34428 (numerical, opus-4-8): Reconcile the imp-34329 FITTED softening
 * constant c ~ 4.4 (single-term r-exponent = 2 - c/log T0) against the
 * imp-34349/imp-34407 DERIVED analytic value c = 4 by asking the one question a
 * single-term fit cannot answer: is the ~0.4 excess a GENUINE next-order
 * 1/log^2 T0 term or a finite fit-window artifact? The clean way to test that is
 * to add the 1/log^2 T0 term explicitly -- fit r-exponent = 2 - c1/L - c2/L^2
 * (L = log T0) -- and measure whether the leading coefficient c1 collapses to 4.
 *
 * WHAT imp-34407 LEFT OPEN
 * -----------------------
 * imp-34407 DERIVED r-exponent = 2 - 4/L + O(1/L^2) and fit only the SINGLE-term
 * form 2 - c/L, getting c ~ 4.49 on the imp-34329 decade SECANT exponents and
 * c ~ 4.15 on the INSTANTANEOUS exponents -- both above the derived 4, and it
 * attributed the gap to a secant finite-difference bias. But it never isolated
 * the O(1/L^2) term the derivation itself predicts. If that term is real, a
 * two-parameter fit that carries it should drive the leading coefficient c1 back
 * to 4; if instead the residual excess is a fit-window artifact, adding the
 * 1/L^2 basis vector will NOT reduce it. This module runs exactly that test on
 * the IDENTICAL imp-34407/imp-34248 sub-terms (verbatim eFlow / crossoverN / rOf).
 *
 * THE MEASUREMENT (two-term OLS over the deep rungs log T0 >= 39)
 * --------------------------------------------------------------
 * Minimise sum ((2 - c1/L - c2/L^2) - rExp)^2 over (c1, c2). Two regimes:
 *
 *   INSTANTANEOUS exponents (central-difference d log r / d log thr):
 *     single-term c = 4.150  ->  two-term c1 = 4.009, c2 = +6.90
 *     RSS drops 1.69e-6 -> 5.01e-9 (~337x).
 *   The 1/L^2 term is GENUINE: adding it drives the leading coefficient to 4 to
 *   two decimals and improves the fit by >2 orders of magnitude, exactly as the
 *   imp-34407 derivation r-exp = 2 - 4/L + O(1/L^2) predicts.
 *
 *   SECANT exponents (the imp-34329 decade-window finite differences, ~4.4):
 *     single-term c = 4.491  ->  two-term c1 = 4.461, c2 = +1.44
 *     RSS barely moves 1.243e-5 -> 1.235e-5 (~1%).
 *   The 1/L^2 term does NOT help: c1 stays ~4.46 and the fit is essentially
 *   unchanged. So the EXTRA secant lift (~4.49 vs the instantaneous 4.15) is NOT
 *   a next-order analytic term -- the 1/L^2 basis cannot absorb it -- it is the
 *   secant finite-difference (fit-window) artifact imp-34407 identified.
 *
 * THE RECONCILIATION (the ~0.4 excess splits cleanly in two)
 * ----------------------------------------------------------
 *  (i)  ~0.15 of it (instantaneous 4.15 vs derived 4) IS a genuine next-order
 *       1/log^2 T0 term: the two-term fit recovers c1 = 4.01 with RSS 337x
 *       smaller.
 *  (ii) the remaining ~0.35 (secant 4.49 vs instantaneous 4.15) is a finite
 *       fit-WINDOW / finite-difference artifact: the 1/L^2 term does not reduce
 *       it and barely changes the secant RSS.
 * Either way the LEADING coefficient is 4, confirming imp-34349/imp-34407: the
 * imp-34329 ~4.4 is NOT a sub-2 / sub-3 limit signal, and r-exponent -> 2,
 * composite -> 3 stand.
 *
 * HONEST SCOPE -- measurement/fit ONLY, NO QED. This isolates the correction
 * structure of the inherited imp-34248/imp-34174/imp-33743 extrapolation
 * component model; it changes no bound and introduces no new mathematical claim.
 * The component model is NOT a rigorous asymptotic. E_flow is the benign
 * mesoscopic-Gronwall term (imp-2845); its vanishing here does NOT touch the
 * divergent C_Lip collision-Gronwall. The C_mb GUE-conditional per imp-486 is
 * UNTOUCHED (E_coll untouched); the C_C 1/8 ansatz (imp-2642/imp-2643) is
 * UNTOUCHED; imp-3066 K_a >= 0 untouched; establishes no operator positivity;
 * no refereed bound is changed.
 *
 * @see imp-34329-crossover-surplus-fartail-composite-limit (the single-term c ~ 4.4 fit)
 * @see imp-34349-eflow-ratio-r-exponent-limit (the derived d log r/d log thr = 2 - 4/log T0)
 * @see imp-34407-fartail-composite-correction-constant-derivation (the single-term fits, c=4 derivation)
 * @see imp-34248-crossover-surplus-small-thr-asymptotic (the r ~ (log T0)^2 thr^2 factorisation)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N, Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3220/imp-33743)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-34248/imp-34329/imp-34407 exactly

// EXACT imp-34407/imp-34248 sub-terms (verbatim, no re-derivation, no fresh model).
function eFlow(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  return C_F * (L / T0) * GRONWALL;
}
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // halving amplitude ~1.5727e8 (imp-33723)
function crossoverN(thr) {
  const K_thr = ((1 - thr) / thr) ** 2 * K_AMPL;
  let N = 1e9;
  for (let i = 0; i < 200; i++) N = K_thr * Math.log(effectiveHeightForN(N));
  return N;
}
function rOf(thr) {
  return eFlow(crossoverN(thr)) / E_TRUNC_PT;
}
function logT0of(thr) {
  return Math.log(effectiveHeightForN(crossoverN(thr)));
}
// Instantaneous r-exponent d log r / d log thr via a tiny central difference.
function rExpInstant(thr) {
  const h = 1e-4;
  const s = Math.log(thr);
  const rp = Math.log(rOf(Math.exp(s + h)));
  const rm = Math.log(rOf(Math.exp(s - h)));
  return (rp - rm) / (2 * h);
}
// Secant local exponent over the imp-34329 decade windows.
function localExp(a, b) {
  return Math.log(rOf(b) / rOf(a)) / Math.log(b / a);
}

// Deep-tail ladder (same thr grid as imp-34407/imp-34329).
const DEEP_THR = [1e-2, 1e-3, 1e-4, 1e-6, 1e-8, 1e-10, 1e-12];
const INSTANT_ROWS = DEEP_THR.map((thr) => ({ thr, logT0: logT0of(thr), rExp: rExpInstant(thr) }));
const SECANT_ROWS = DEEP_THR.slice(1).map((thr, k) => ({
  thr,
  from: DEEP_THR[k],
  logT0: logT0of(thr),
  rExp: localExp(DEEP_THR[k], thr),
}));

// ── Single-term OLS: r-exp = 2 - c/L  =>  c = sum((2-rExp)/L)/sum(1/L^2) ────────
function fitOne(rows) {
  let num = 0;
  let den = 0;
  for (const r of rows) {
    num += (2 - r.rExp) / r.logT0;
    den += 1 / (r.logT0 * r.logT0);
  }
  return num / den;
}
// ── Two-term OLS: r-exp = 2 - c1/L - c2/L^2. Basis x1=1/L, x2=1/L^2, y=2-rExp;
//    solve the 2x2 normal equations [S11 S12; S12 S22][c1;c2] = [T1;T2]. ────────
function fitTwo(rows) {
  let S11 = 0;
  let S12 = 0;
  let S22 = 0;
  let T1 = 0;
  let T2 = 0;
  for (const r of rows) {
    const x1 = 1 / r.logT0;
    const x2 = 1 / (r.logT0 * r.logT0);
    const y = 2 - r.rExp;
    S11 += x1 * x1;
    S12 += x1 * x2;
    S22 += x2 * x2;
    T1 += x1 * y;
    T2 += x2 * y;
  }
  const det = S11 * S22 - S12 * S12;
  return { c1: (T1 * S22 - T2 * S12) / det, c2: (S11 * T2 - S12 * T1) / det };
}
function rssOne(rows, c) {
  return rows.reduce((s, r) => s + (2 - c / r.logT0 - r.rExp) ** 2, 0);
}
function rssTwo(rows, c1, c2) {
  return rows.reduce((s, r) => s + (2 - c1 / r.logT0 - c2 / (r.logT0 * r.logT0) - r.rExp) ** 2, 0);
}

// Fit over the genuinely-deep rungs (log T0 >= 39, i.e. thr <= 1e-3); the thr=1e-2
// shoulder is not far-tail (matching the imp-34407 deep-rung window).
const DEEP_INST = INSTANT_ROWS.filter((r) => r.logT0 >= 39);
const DEEP_SEC = SECANT_ROWS.filter((r) => r.logT0 >= 39);

const C1_INST = fitOne(DEEP_INST);
const C1_SEC = fitOne(DEEP_SEC);
const TWO_INST = fitTwo(DEEP_INST);
const TWO_SEC = fitTwo(DEEP_SEC);
const RSS1_INST = rssOne(DEEP_INST, C1_INST);
const RSS2_INST = rssTwo(DEEP_INST, TWO_INST.c1, TWO_INST.c2);
const RSS1_SEC = rssOne(DEEP_SEC, C1_SEC);
const RSS2_SEC = rssTwo(DEEP_SEC, TWO_SEC.c1, TWO_SEC.c2);

export const IMP34428_FARTAIL_CORRECTION_TWO_TERM_FIT = {
  id: 'imp-34428',
  proofSection: 'S-frontier',
  question:
    'Is the imp-34329 fitted softening excess (single-term c ~ 4.4 vs the imp-34349/imp-34407 ' +
    'derived c = 4) a GENUINE next-order 1/log^2 T0 term or a finite fit-window artifact? Add the ' +
    '1/log^2 T0 term explicitly -- fit r-exponent = 2 - c1/L - c2/L^2 -- and measure whether the ' +
    'leading coefficient c1 collapses to 4. Measurement/fit only within the inherited component ' +
    'model; changes no bound; NO QED.',
  deepRungsLogT0: DEEP_INST.map((r) => +r.logT0.toFixed(2)),
  instantaneous: {
    single_term_c: +C1_INST.toFixed(4), // ~4.150
    two_term_c1: +TWO_INST.c1.toFixed(4), // ~4.009 -- collapses to 4
    two_term_c2: +TWO_INST.c2.toFixed(4), // ~+6.90 -- the genuine O(1/L^2) term
    rss_single_term: +RSS1_INST.toExponential(4),
    rss_two_term: +RSS2_INST.toExponential(4),
    rss_improvement_factor: +(RSS1_INST / RSS2_INST).toFixed(1), // ~337x
  },
  secant: {
    single_term_c: +C1_SEC.toFixed(4), // ~4.491 (reproduces imp-34329 ~4.4)
    two_term_c1: +TWO_SEC.c1.toFixed(4), // ~4.461 -- does NOT collapse to 4
    two_term_c2: +TWO_SEC.c2.toFixed(4), // ~+1.44
    rss_single_term: +RSS1_SEC.toExponential(4),
    rss_two_term: +RSS2_SEC.toExponential(4),
    rss_improvement_factor: +(RSS1_SEC / RSS2_SEC).toFixed(3), // ~1.01x -- negligible
  },
  finding: {
    F1_instant_c1_collapses_to_four:
      'On the INSTANTANEOUS exponents, adding the 1/log^2 T0 basis vector drives the leading ' +
      'coefficient from single-term c = 4.15 to two-term c1 = 4.01 (to two decimals) with a positive ' +
      'c2 ~ 6.90, and cuts the fit RSS by ~337x (1.69e-6 -> 5.01e-9). So ~0.15 of the excess is a ' +
      'GENUINE next-order 1/log^2 T0 term, exactly as the imp-34407 derivation r-exp = 2 - 4/L + O(1/L^2).',
    F2_secant_excess_is_fit_window_artifact:
      'On the imp-34329 decade SECANT exponents the same two-term fit does NOT collapse c1: it stays ' +
      '~4.46 (from single-term 4.49) and the RSS barely moves (1.243e-5 -> 1.235e-5, ~1%). The 1/log^2 ' +
      'T0 basis cannot absorb the extra secant lift, so the remaining ~0.35 (secant 4.49 vs ' +
      'instantaneous 4.15) is a finite fit-WINDOW / finite-difference artifact, not an analytic term.',
    F3_reconciliation:
      'The ~0.4 imp-34329-vs-derived excess splits cleanly: ~0.15 is a genuine 1/log^2 T0 term (drives ' +
      'the two-term c1 to 4.01) and ~0.35 is a secant fit-window artifact (the 1/L^2 term leaves the ' +
      'secant fit unchanged). Either way the LEADING coefficient is 4, confirming imp-34349/imp-34407: ' +
      'r-exponent -> 2 and composite -> 3, with limiting constant c = 4 (not 4.4).',
  },
  leadingCoefficient: 4,
  isRigorous: false,
  honestScope:
    'Measurement/fit only within the inherited imp-34248/imp-34174/imp-33743 extrapolation component ' +
    'model; NO QED. The component model is NOT a rigorous asymptotic; E_flow is the benign ' +
    'mesoscopic-Gronwall term (imp-2845) and its vanishing here does NOT touch the divergent C_Lip ' +
    'collision-Gronwall; the C_mb GUE-conditional per imp-486 is UNTOUCHED (E_coll untouched); the C_C ' +
    '1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; imp-3066 K_a >= 0 untouched; establishes no operator ' +
    'positivity; changes no bound; no refereed bound is changed.',
  citation:
    'imp-34329-crossover-surplus-fartail-composite-limit.js (single-term c ~ 4.4); ' +
    'imp-34349-eflow-ratio-r-exponent-limit.js (derived 2 - 4/log T0); ' +
    'imp-34407-fartail-composite-correction-constant-derivation.js (single-term fits, c=4 derivation); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34428_FARTAIL_CORRECTION_TWO_TERM_FIT_ASSERTIONS = [
  {
    // F1: the two-term instantaneous fit drives the leading coefficient to 4 (to two decimals).
    id: 'imp34428-instant-c1-collapses-to-four',
    description: 'the two-term instantaneous fit c1 collapses to 4 (|c1 - 4| < 0.05) from single-term ~4.15, with a positive c2 order-a-few, confirming the genuine 1/log^2 T0 term',
    holds: () =>
      Math.abs(TWO_INST.c1 - 4) < 0.05 &&
      C1_INST > 4.1 &&
      C1_INST < 4.2 &&
      TWO_INST.c2 > 2 &&
      TWO_INST.c2 < 12,
  },
  {
    // F1b: adding the 1/L^2 term improves the instantaneous fit by a large factor (>100x).
    id: 'imp34428-instant-rss-improves-large',
    description: 'the two-term instantaneous fit RSS improves by >100x over the single-term fit (the 1/log^2 T0 term is genuine)',
    holds: () => RSS1_INST / RSS2_INST > 100 && RSS2_INST < 1e-7,
  },
  {
    // F2: on the SECANT exponents the two-term fit does NOT collapse c1 to 4 and barely improves RSS.
    id: 'imp34428-secant-excess-not-analytic',
    description: 'on the imp-34329 decade secants the two-term c1 stays ~4.46 (does NOT reach 4) and the RSS improves by <5% -- the extra secant lift is a fit-window artifact, not a 1/log^2 T0 term',
    holds: () =>
      TWO_SEC.c1 > 4.35 &&
      Math.abs(TWO_SEC.c1 - 4) > 0.3 &&
      RSS1_SEC / RSS2_SEC < 1.05,
  },
  {
    // F2b: the single-term secant fit reproduces the imp-34329 ~4.4 while the instant fit is lower.
    id: 'imp34428-secant-reproduces-imp34329',
    description: 'the single-term secant fit ~4.49 reproduces the imp-34329 ~4.4 and exceeds the instantaneous single-term ~4.15',
    holds: () => Math.abs(C1_SEC - 4.49) < 0.06 && C1_SEC > C1_INST,
  },
  {
    // Reconciliation: the leading coefficient is the literal 4 and both regimes agree on it as the limit.
    id: 'imp34428-leading-coefficient-is-four',
    description: 'the reconciled leading coefficient is the literal 4, matching the imp-34349/imp-34407 derived value, and the two-term instantaneous c1 lands within 0.02 of it',
    holds: () =>
      IMP34428_FARTAIL_CORRECTION_TWO_TERM_FIT.leadingCoefficient === 4 &&
      Math.abs(TWO_INST.c1 - IMP34428_FARTAIL_CORRECTION_TWO_TERM_FIT.leadingCoefficient) < 0.02,
  },
  {
    // Honesty gate: measurement only, isRigorous literal false, C_mb clause named, no QED, no refereed bound is changed.
    id: 'imp34428-honesty-gate-isrigorous-and-cmb-clause',
    description: 'isRigorous is a literal false field; honestScope names the C_mb GUE-conditional per imp-486 UNTOUCHED clause; NO QED; no refereed bound is changed',
    holds: () =>
      IMP34428_FARTAIL_CORRECTION_TWO_TERM_FIT.isRigorous === false &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/.test(IMP34428_FARTAIL_CORRECTION_TWO_TERM_FIT.honestScope) &&
      /NO QED/.test(IMP34428_FARTAIL_CORRECTION_TWO_TERM_FIT.honestScope) &&
      /refereed bound is changed/i.test(IMP34428_FARTAIL_CORRECTION_TWO_TERM_FIT.honestScope),
  },
];

for (const a of IMP34428_FARTAIL_CORRECTION_TWO_TERM_FIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34428-fartail-correction-two-term-fit assertion failed: ${a.id}`);
  }
}
