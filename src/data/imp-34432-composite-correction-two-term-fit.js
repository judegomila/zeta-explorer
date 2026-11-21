/**
 * @module imp-34432-composite-correction-two-term-fit
 *
 * imp-34432 (numerical, opus-4-8): Measure the SECOND-ORDER correction to the
 * imp-34329 limiting COMPOSITE exponent 3 by fitting the two-term model
 * composite(thr) = 3 - a/log T0 - b/log^2 T0 (L = log T0) across the deep-tail
 * probe (thr down to 1e-12), and quantify how much of the residual-to-3 at
 * accessible thr is the leading 1/log T0 softening versus the next-order term.
 *
 * WHAT imp-34329 LEFT OPEN
 * -----------------------
 * imp-34329 F3 established the limiting composite exponent d log surplus / d log
 * thr is exactly 3 with a leading ~-O(1/log T0) correction, and located a shallow
 * minimum ~2.871 at the turn -- but it only fit the LEADING term (single-term
 * r-exponent = 2 - c/L, c ~ 4.4). imp-34414 then derived the closed instantaneous
 * composite 3 - 4/L to leading order, and imp-34428 ran the two-term fit on the
 * R-EXPONENT (target 2, c1 -> 4.01, c2 ~ 6.90). But the COMPOSITE exponent itself
 * (target 3) was never given its own two-term fit: composite = 1 + r-exponent
 * only to leading order (the prefactor share P/thr -> 1 carries its own softening),
 * so the composite second-order coefficient b need NOT equal the r-exponent's c2.
 * This module runs exactly that fit on the IDENTICAL imp-34329/imp-34248 sub-terms
 * (verbatim eFlow / crossoverN / surplusOf).
 *
 * THE MEASUREMENT (two-term OLS over the deep rungs log T0 >= 39)
 * --------------------------------------------------------------
 * Minimise sum ((3 - a/L - b/L^2) - composite)^2 over (a, b). Two regimes:
 *
 *   INSTANTANEOUS composite (central-difference d log surplus / d log thr):
 *     single-term a = 4.152  ->  two-term a = 4.003, b = +7.26
 *     RSS drops 1.872e-6 -> 9.96e-10 (~1879x).
 *   The 1/L^2 term is GENUINE: adding it drives the leading coefficient a to 4 to
 *   two decimals and improves the fit by >3 orders of magnitude, exactly as the
 *   imp-34414 derivation composite = 3 - 4/L + O(1/L^2) predicts. The composite b
 *   (~+7.26) is CLOSE TO but DISTINCT FROM the imp-34428 r-exponent c2 (~+6.90):
 *   the prefactor-share softening lifts the composite next-order term slightly.
 *
 *   SECANT composite (the imp-34329 decade-window finite differences, ~4.5):
 *     single-term a = 4.497  ->  two-term a = 4.438, b = +2.87
 *     RSS barely moves 1.169e-5 -> 1.139e-5 (~2.6%).
 *   The 1/L^2 term does NOT help: a stays ~4.44 and the fit is essentially
 *   unchanged. So the EXTRA secant lift (~4.50 vs the instantaneous 4.15) is NOT
 *   a next-order analytic term -- the 1/L^2 basis cannot absorb it -- it is the
 *   secant finite-difference (fit-window) artifact, mirroring imp-34428.
 *
 * THE SHORTFALL SPLIT (how much of the residual-to-3 each term explains)
 * ---------------------------------------------------------------------
 * Using the instantaneous two-term fit, at each ACCESSIBLE-thr rung the predicted
 * shortfall 3 - composite = a/L + b/L^2 splits into a LEADING share a/L and a
 * NEXT-ORDER share b/L^2. The leading 1/log T0 softening dominates overwhelmingly:
 *   thr = 1e-2  (L=30.0): leading 94.3%, next-order  5.7%
 *   thr = 1e-3  (L=34.6): leading 95.0%, next-order  5.0%
 *   thr = 1e-4  (L=39.2): leading 95.6%, next-order  4.4%
 * The predicted total tracks the directly-measured shortfall to <1e-3 down to the
 * thr=1e-3 rung (0.12173 vs 0.12097); only the thr=1e-2 shoulder -- furthest below
 * the log T0 >= 39 fit window -- overshoots by ~8e-3 (0.14150 vs 0.13305), the
 * expected two-term-extrapolation error outside the fit window. So even at the
 * deepest ACCESSIBLE thr, ~95% of the residual-to-3 is the leading 1/log T0
 * softening and only ~5% is the next-order 1/log^2 T0 term (its share SHRINKS as
 * thr falls, since it decays a factor 1/L faster). The exact-3 limit stands.
 *
 * HONEST SCOPE -- measurement/fit ONLY, NO QED. This isolates the correction
 * structure of the inherited imp-34329/imp-34248/imp-34174/imp-33743 extrapolation
 * component model; it changes no bound and introduces no new mathematical claim.
 * The component model is NOT a rigorous asymptotic. E_flow is the benign
 * mesoscopic-Gronwall term (imp-2845); its vanishing here does NOT touch the
 * divergent C_Lip collision-Gronwall. The imp-34329/imp-34414/imp-34428 findings
 * are UNTOUCHED and reproduced. The C_mb GUE-conditional per imp-486 is UNTOUCHED
 * (E_coll untouched); the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED;
 * imp-3066 K_a >= 0 untouched; establishes no operator positivity; no refereed bound is changed.
 *
 * @see imp-34329-crossover-surplus-fartail-composite-limit (the single-term composite fit, limit 3)
 * @see imp-34414-crossover-surplus-direct-cubic-expansion (the derived instantaneous composite 3 - 4/log T0)
 * @see imp-34428-fartail-correction-two-term-fit (the SIBLING two-term fit on the r-exponent, target 2)
 * @see imp-34248-crossover-surplus-small-thr-asymptotic (the r ~ (log T0)^2 thr^2 factorisation)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N, Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3220/imp-33743)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-34248/imp-34329/imp-34428 exactly

// EXACT imp-34329/imp-34248 sub-terms (verbatim, no re-derivation, no fresh model).
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
// surplus(thr) = P(thr) . r(thr), P(thr) = thr(1-thr)/(1 + (1-thr)r) (imp-34174).
function surplusOf(thr) {
  const N = crossoverN(thr);
  const r = eFlow(N) / E_TRUNC_PT;
  const P = (thr * (1 - thr)) / (1 + (1 - thr) * r);
  return P * r;
}
function logT0of(thr) {
  return Math.log(effectiveHeightForN(crossoverN(thr)));
}
// Instantaneous composite exponent d log surplus / d log thr via a tiny central difference.
function compInstant(thr) {
  const h = 1e-4;
  const s = Math.log(thr);
  const sp = Math.log(surplusOf(Math.exp(s + h)));
  const sm = Math.log(surplusOf(Math.exp(s - h)));
  return (sp - sm) / (2 * h);
}
// Secant local composite exponent over the imp-34329 decade windows.
function localComp(a, b) {
  return Math.log(surplusOf(b) / surplusOf(a)) / Math.log(b / a);
}

// Deep-tail ladder (same thr grid as imp-34329/imp-34428).
const DEEP_THR = [1e-2, 1e-3, 1e-4, 1e-6, 1e-8, 1e-10, 1e-12];
const INSTANT_ROWS = DEEP_THR.map((thr) => ({ thr, logT0: logT0of(thr), comp: compInstant(thr) }));
const SECANT_ROWS = DEEP_THR.slice(1).map((thr, k) => ({
  thr,
  from: DEEP_THR[k],
  logT0: logT0of(thr),
  comp: localComp(DEEP_THR[k], thr),
}));

// ── Single-term OLS: composite = 3 - a/L  =>  a = sum((3-comp)/L)/sum(1/L^2) ────
function fitOne(rows) {
  let num = 0;
  let den = 0;
  for (const r of rows) {
    num += (3 - r.comp) / r.logT0;
    den += 1 / (r.logT0 * r.logT0);
  }
  return num / den;
}
// ── Two-term OLS: composite = 3 - a/L - b/L^2. Basis x1=1/L, x2=1/L^2, y=3-comp;
//    solve the 2x2 normal equations [S11 S12; S12 S22][a;b] = [T1;T2]. ──────────
function fitTwo(rows) {
  let S11 = 0;
  let S12 = 0;
  let S22 = 0;
  let T1 = 0;
  let T2 = 0;
  for (const r of rows) {
    const x1 = 1 / r.logT0;
    const x2 = 1 / (r.logT0 * r.logT0);
    const y = 3 - r.comp;
    S11 += x1 * x1;
    S12 += x1 * x2;
    S22 += x2 * x2;
    T1 += x1 * y;
    T2 += x2 * y;
  }
  const det = S11 * S22 - S12 * S12;
  return { a: (T1 * S22 - T2 * S12) / det, b: (S11 * T2 - S12 * T1) / det };
}
function rssOne(rows, a) {
  return rows.reduce((s, r) => s + (3 - a / r.logT0 - r.comp) ** 2, 0);
}
function rssTwo(rows, a, b) {
  return rows.reduce((s, r) => s + (3 - a / r.logT0 - b / (r.logT0 * r.logT0) - r.comp) ** 2, 0);
}

// Fit over the genuinely-deep rungs (log T0 >= 39, i.e. thr <= 1e-4), matching the
// imp-34428 deep-rung window; the thr>=1e-3 shoulder is not far-tail.
const DEEP_INST = INSTANT_ROWS.filter((r) => r.logT0 >= 39);
const DEEP_SEC = SECANT_ROWS.filter((r) => r.logT0 >= 39);

const A1_INST = fitOne(DEEP_INST);
const A1_SEC = fitOne(DEEP_SEC);
const TWO_INST = fitTwo(DEEP_INST);
const TWO_SEC = fitTwo(DEEP_SEC);
const RSS1_INST = rssOne(DEEP_INST, A1_INST);
const RSS2_INST = rssTwo(DEEP_INST, TWO_INST.a, TWO_INST.b);
const RSS1_SEC = rssOne(DEEP_SEC, A1_SEC);
const RSS2_SEC = rssTwo(DEEP_SEC, TWO_SEC.a, TWO_SEC.b);

// ── Shortfall split at ACCESSIBLE thr: 3 - composite = a/L + b/L^2, using the
//    instantaneous two-term fit -- what fraction is leading vs next-order. ──────
const ACCESSIBLE_THR = [1e-2, 1e-3, 1e-4];
const SHORTFALL_SPLIT = ACCESSIBLE_THR.map((thr) => {
  const L = logT0of(thr);
  const leading = TWO_INST.a / L;
  const nextOrder = TWO_INST.b / (L * L);
  const predicted = leading + nextOrder;
  const measured = 3 - compInstant(thr);
  return {
    thr,
    logT0: +L.toFixed(3),
    leading_share: +(leading / predicted).toFixed(4), // fraction from -a/L
    next_order_share: +(nextOrder / predicted).toFixed(4), // fraction from -b/L^2
    predicted_shortfall: +predicted.toFixed(5),
    measured_shortfall: +measured.toFixed(5),
  };
});

export const IMP34432_COMPOSITE_CORRECTION_TWO_TERM_FIT = {
  id: 'imp-34432',
  proofSection: 'S-frontier',
  question:
    'Fit the two-term model composite(thr) = 3 - a/log T0 - b/log^2 T0 (L = log T0) across the ' +
    'imp-34329 deep-tail probe (thr down to 1e-12) to measure the SECOND-ORDER correction to the ' +
    'limiting composite exponent 3, report a and b, and quantify what fraction of the residual-to-3 ' +
    'at accessible thr is the leading 1/log T0 softening versus the next-order 1/log^2 T0 term. ' +
    'Measurement/fit only within the inherited component model; changes no bound; NO QED.',
  deepRungsLogT0: DEEP_INST.map((r) => +r.logT0.toFixed(2)),
  instantaneous: {
    single_term_a: +A1_INST.toFixed(4), // ~4.152
    two_term_a: +TWO_INST.a.toFixed(4), // ~4.003 -- collapses to 4
    two_term_b: +TWO_INST.b.toFixed(4), // ~+7.26 -- the genuine O(1/L^2) term
    rss_single_term: +RSS1_INST.toExponential(4),
    rss_two_term: +RSS2_INST.toExponential(4),
    rss_improvement_factor: +(RSS1_INST / RSS2_INST).toFixed(1), // ~1879x
  },
  secant: {
    single_term_a: +A1_SEC.toFixed(4), // ~4.497 (reproduces imp-34329 secant ~4.5)
    two_term_a: +TWO_SEC.a.toFixed(4), // ~4.438 -- does NOT collapse to 4
    two_term_b: +TWO_SEC.b.toFixed(4), // ~+2.87
    rss_single_term: +RSS1_SEC.toExponential(4),
    rss_two_term: +RSS2_SEC.toExponential(4),
    rss_improvement_factor: +(RSS1_SEC / RSS2_SEC).toFixed(3), // ~1.03x -- negligible
  },
  shortfallSplit: SHORTFALL_SPLIT,
  answer:
    'The two-term composite fit gives instantaneous a = 4.003 (collapsed from single-term 4.152) and ' +
    'b = +7.26, with RSS improving ~1879x -- the leading coefficient is 4, confirming the imp-34414 ' +
    'derived composite = 3 - 4/log T0 + O(1/log^2 T0), and the genuine next-order coefficient b ~ +7.26 ' +
    'is close to but distinct from the imp-34428 r-exponent c2 ~ +6.90 (the prefactor-share softening ' +
    'lifts it slightly). On the imp-34329 decade SECANT exponents the same fit does NOT collapse ' +
    '(a stays ~4.44, RSS improves ~3%), so the extra secant lift is a fit-window artifact, mirroring ' +
    'imp-34428. At accessible thr the residual-to-3 is ~95% the leading 1/log T0 softening and only ' +
    '~5% the next-order 1/log^2 T0 term (94.3/5.7 at 1e-2, 95.6/4.4 at 1e-4), the next-order share ' +
    'shrinking as thr falls; the predicted total tracks the measured shortfall to <1e-3 down to ' +
    'thr=1e-3, the thr=1e-2 shoulder overshooting ~8e-3 outside the fit window. The exact-3 limit stands.',
  finding: {
    F1_instant_a_collapses_to_four:
      'On the INSTANTANEOUS composite exponents, adding the 1/log^2 T0 basis vector drives the leading ' +
      'coefficient from single-term a = 4.15 to two-term a = 4.00 (to two decimals) with a positive ' +
      'b ~ +7.26, and cuts the fit RSS by ~1879x (1.872e-6 -> 9.96e-10). The leading softening is 4/log ' +
      'T0, exactly as the imp-34414 derivation composite = 3 - 4/L + O(1/L^2).',
    F2_composite_next_order_b_distinct_from_r:
      'The composite next-order coefficient b ~ +7.26 is CLOSE TO but DISTINCT FROM the imp-34428 ' +
      'r-exponent c2 ~ +6.90: composite = 1 + r-exponent only to LEADING order, and the prefactor share ' +
      'P/thr -> 1 carries its own softening, so the two second-order coefficients differ by ~0.36 -- the ' +
      'composite two-term fit is a genuinely distinct measurement, not a relabel of the r-exponent fit.',
    F3_secant_excess_is_fit_window_artifact:
      'On the imp-34329 decade SECANT exponents the same two-term fit does NOT collapse a: it stays ' +
      '~4.44 (from single-term 4.50) and the RSS barely moves (~3%). The 1/log^2 T0 basis cannot absorb ' +
      'the extra secant lift, so the ~0.35 excess (secant 4.50 vs instantaneous 4.15) is a finite ' +
      'fit-WINDOW / finite-difference artifact, not an analytic term -- mirroring imp-34428.',
    F4_shortfall_dominated_by_leading:
      'The residual-to-3 splits overwhelmingly into the leading 1/log T0 softening: at accessible thr ' +
      'the leading share a/L is 94.3% (thr=1e-2), 95.0% (1e-3), 95.6% (1e-4) and the next-order share ' +
      'b/L^2 is only 5.7%, 5.0%, 4.4% -- SHRINKING as thr falls (it decays a factor 1/L faster). The ' +
      'predicted total tracks the directly-measured shortfall to <1e-3 down to thr=1e-3; only the ' +
      'thr=1e-2 shoulder (furthest below the log T0 >= 39 fit window) overshoots by ~8e-3.',
  },
  leadingCoefficient: 4,
  limitingCompositeExponent: 3,
  isRigorous: false,
  honestScope:
    'Measurement/fit only within the inherited imp-34329/imp-34248/imp-34174/imp-33743 extrapolation ' +
    'component model; NO QED. The component model is NOT a rigorous asymptotic; E_flow is the benign ' +
    'mesoscopic-Gronwall term (imp-2845) and its vanishing here does NOT touch the divergent C_Lip ' +
    'collision-Gronwall; the imp-34329/imp-34414/imp-34428 findings are UNTOUCHED and reproduced; the ' +
    'C_mb GUE-conditional per imp-486 is UNTOUCHED (E_coll untouched); the C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643) is UNTOUCHED; imp-3066 K_a >= 0 untouched; establishes no operator positivity; ' +
    'changes no bound; no refereed bound is changed.',
  citation:
    'imp-34329-crossover-surplus-fartail-composite-limit.js (single-term composite fit, limit 3); ' +
    'imp-34414-crossover-surplus-direct-cubic-expansion.js (derived instantaneous composite 3 - 4/log T0); ' +
    'imp-34428-fartail-correction-two-term-fit.js (sibling two-term fit on the r-exponent, target 2); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34432_COMPOSITE_CORRECTION_TWO_TERM_FIT_ASSERTIONS = [
  {
    // F1: the two-term instantaneous fit drives the leading coefficient to 4 (to two decimals).
    id: 'imp34432-instant-a-collapses-to-four',
    description: 'the two-term instantaneous composite fit a collapses to 4 (|a - 4| < 0.05) from single-term ~4.15, with a positive b order-a-few, confirming composite = 3 - 4/log T0 + O(1/log^2 T0)',
    holds: () =>
      Math.abs(TWO_INST.a - 4) < 0.05 &&
      A1_INST > 4.1 &&
      A1_INST < 4.2 &&
      TWO_INST.b > 3 &&
      TWO_INST.b < 12,
  },
  {
    // F1b: adding the 1/L^2 term improves the instantaneous fit by a large factor (>100x).
    id: 'imp34432-instant-rss-improves-large',
    description: 'the two-term instantaneous composite fit RSS improves by >100x over the single-term fit (the 1/log^2 T0 term is genuine)',
    holds: () => RSS1_INST / RSS2_INST > 100 && RSS2_INST < 1e-8,
  },
  {
    // F2: the composite next-order b is distinct from the imp-34428 r-exponent c2 (~6.90) but same sign/order.
    id: 'imp34432-composite-b-distinct-from-r',
    description: 'the composite next-order coefficient b ~ +7.26 is positive and distinct from the imp-34428 r-exponent c2 ~ +6.90 (|b - 6.90| > 0.15), confirming composite = 1 + r-exponent only to leading order',
    holds: () => TWO_INST.b > 6.9 && Math.abs(TWO_INST.b - 6.90) > 0.15 && TWO_INST.b < 8,
  },
  {
    // F3: on the SECANT exponents the two-term fit does NOT collapse a to 4 and barely improves RSS.
    id: 'imp34432-secant-excess-not-analytic',
    description: 'on the imp-34329 decade secants the two-term composite a stays ~4.44 (does NOT reach 4) and the RSS improves by <10% -- the extra secant lift is a fit-window artifact, not a 1/log^2 T0 term',
    holds: () =>
      TWO_SEC.a > 4.3 &&
      Math.abs(TWO_SEC.a - 4) > 0.3 &&
      RSS1_SEC / RSS2_SEC < 1.1,
  },
  {
    // F4: the shortfall at accessible thr is dominated by the leading 1/L term (>90%), shrinking next-order share.
    id: 'imp34432-shortfall-dominated-by-leading',
    description: 'at accessible thr the leading 1/log T0 share of the residual-to-3 exceeds 90% at every rung, the next-order 1/log^2 T0 share SHRINKS as thr falls, and the predicted shortfall tracks the measured one to <1e-3 for thr <= 1e-3 (the thr=1e-2 shoulder, below the fit window, overshoots ~8e-3)',
    holds: () => {
      for (const s of SHORTFALL_SPLIT) {
        if (!(s.leading_share > 0.9)) return false;
        // In-window rungs (thr <= 1e-3) reproduce the measured shortfall to <1e-3; the thr=1e-2
        // shoulder is far below the log T0 >= 39 fit window and overshoots (~8e-3, still < 1e-2).
        const tol = s.thr <= 1e-3 ? 1e-3 : 1e-2;
        if (!(Math.abs(s.predicted_shortfall - s.measured_shortfall) < tol)) return false;
      }
      // next-order share monotonically shrinks as thr falls (rows ordered 1e-2, 1e-3, 1e-4).
      for (let i = 1; i < SHORTFALL_SPLIT.length; i++) {
        if (!(SHORTFALL_SPLIT[i].next_order_share < SHORTFALL_SPLIT[i - 1].next_order_share)) return false;
      }
      return true;
    },
  },
  {
    // Continuity: the deep-rung window reproduces the imp-34329 composite climb toward 3 (all < 3, rising).
    id: 'imp34432-continuity-with-imp34329',
    description: 'the instantaneous deep rungs reproduce the imp-34329 composite climbing monotonically toward 3 (all < 3, strictly increasing as thr falls)',
    holds: () => {
      const c = DEEP_INST.map((r) => r.comp);
      for (let i = 1; i < c.length; i++) if (!(c[i] > c[i - 1])) return false;
      return c[c.length - 1] < 3 && c[c.length - 1] > 2.94;
    },
  },
  {
    // Honesty gate: measurement only, isRigorous literal false, C_mb clause named, no QED, no refereed bound is changed.
    id: 'imp34432-honesty-gate-isrigorous-and-cmb-clause',
    description: 'isRigorous is a literal false field; honestScope names the C_mb GUE-conditional per imp-486 UNTOUCHED clause; NO QED; no refereed bound is changed',
    holds: () =>
      IMP34432_COMPOSITE_CORRECTION_TWO_TERM_FIT.isRigorous === false &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/.test(IMP34432_COMPOSITE_CORRECTION_TWO_TERM_FIT.honestScope) &&
      /NO QED/.test(IMP34432_COMPOSITE_CORRECTION_TWO_TERM_FIT.honestScope) &&
      /refereed bound is changed/i.test(IMP34432_COMPOSITE_CORRECTION_TWO_TERM_FIT.honestScope),
  },
];

for (const a of IMP34432_COMPOSITE_CORRECTION_TWO_TERM_FIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34432-composite-correction-two-term-fit assertion failed: ${a.id}`);
  }
}
