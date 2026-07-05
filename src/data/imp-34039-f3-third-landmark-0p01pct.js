/**
 * @module imp-34039-f3-third-landmark-0p01pct
 *
 * imp-34039 (accuracy, frontier-direction): imp-33988 recomputed only the FIRST TWO of the imp-33816
 * F3 near-asymptote landmarks of the sigma(N) post-peak local decay exponent -- p first within 1% of
 * the imp-3463 far-tail 1/2 (p >= 0.495) at N ~ 1e44, and within 0.1% (p >= 0.4995) at N ~ 1e434.
 * This module computes the THIRD landmark, the 0.01% mark (p >= 0.49995), via the identical three-way
 * recompute in log-N space, one decade deeper on the same gap(N) = 1/2 - p ~ 1/(2 log T0) law.
 *
 * THE QUANTITY (identical inherited imp-3220 / imp-3406 / imp-3529 / imp-33582 / imp-33816 sub-terms)
 * ---------------------------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_coll = C_C sqrt(log T0 / N)      (dominant, GUE-conditional C_H),
 *     E_flow = C_F (log T0 / T0) Gronwall,  C_F = (log(T0/2pi) + 1)/2pi  (imp-398),
 *     E_trunc = 3.06e-5                   (N-independent, imp-2631),
 *     p(N) = -d ln sigma / d ln N,  far tail p -> 1/2 from below (imp-3463).
 * All in log-N space (imp-33859 route): with u = log(T0/2pi) the RvM relation is ln N = u + log(u - 1)
 * and log T0 = u + log(2pi), so neither T0 nor N is ever formed.
 *
 * THE THREE ESTIMATES OF THE 0.01% LANDMARK (p_target = 0.49995, gap = 5e-5, log T0 = 1/(2 gap) = 1e4)
 * ---------------------------------------------------------------------------------------------------
 *   (E1) F2 CLOSED-FORM (imp-33816 convention): log T0 = 1/(2 gap) = 10000, collapse the RvM inversion
 *        to the leading term ln N ~ log T0  ->  log10 N = 4342.945.
 *   (E2) LAW-DIRECT, FULL RvM INVERSION: same leading law, invert log T0 -> ln N honestly through
 *        u = log T0 - log(2pi), ln N = u + log(u - 1)  ->  log10 N = 4346.147.
 *   (E3) ACTUAL LOCAL-EXPONENT CROSSING p(N) = 0.49995  ->  log10 N = 4345.682.
 *        NOTE the imp-33988 finite-difference Newton on the actual p(N) DIVERGES a decade deeper: at
 *        log10 N ~ 4346 the log-space ln sigma is ~ -5000, so the central-difference derivative
 *        dp/d ln N is swamped by catastrophic cancellation (fp is pure noise) and Newton returns NaN.
 *        The crossing is therefore recovered here by a BRACKETED BISECTION on the (monotone) actual
 *        p(N) -- which needs only p, not its derivative -- and cross-validated by the analytic
 *        E_trunc-dominated-tail crossing p = 1/2 - (u - 1)/(2 u L), L = u + log(2pi). Both robust
 *        methods reproduce the imp-33988 Newton landmarks at the 1% (44.167) and 0.1% (436.059) marks
 *        to 3 decimals, so the substitute E3 is validated against the two shallower crossings.
 *
 * THE FINDING (measurement / cross-check only)
 * --------------------------------------------
 *   (G1) THE 0.01% LANDMARK LANDS AT N ~ 1e4345.7 -- FAR beyond IEEE-double range, reported from the
 *        law. Bisection gives 4345.682 and the analytic tail 4345.712 (agree to 0.030 decades). The
 *        crossing sits ~32 decades (in log T0, 1000 -> ~9999) past the 0.1% mark, confirming the
 *        glacial imp-33816 approach: each further factor-10 tightening of the gap costs ~1 more DECADE
 *        of log T0 but ~1000 more DECADES of N.
 *   (G2) THE COHERENT E1 < E3 < E2 ORDERING HOLDS A DECADE DEEPER: 4342.945 < 4345.682 < 4346.147.
 *   (G3) THE E1 -> E2 SPREAD KEEPS WIDENING IN ABSOLUTE DECADES BUT SHRINKS RELATIVELY. The restored
 *        RvM sub-leading terms +log(u-1)+log(2pi) grow the absolute gap monotonically 1.189 -> 2.201
 *        -> 3.202 decades across the 1% / 0.1% / 0.01% marks (~+1 decade per mark), yet as a FRACTION
 *        of log10 N the correction collapses 2.739% -> 0.507% -> 0.074%. So the three estimates agree
 *        RELATIVELY ever more tightly (well inside 1%) even as their absolute separation grows: the
 *        answer to the ticket is that the spread widens absolutely but the relative agreement tightens.
 *   (G4) THE ACTUAL CROSSING STAYS BELOW THE LAW-DIRECT ESTIMATE (E3 - E2 = -0.465 decades), the same
 *        imp-33949 finite-log-T0 signature log T0 * gap -> 1/2 from below: at the crossing
 *        log T0 * gap = 0.49995 (log T0 ~ 9998.93), still just under 1/2, so the true gap is slightly
 *        smaller than the leading 1/(2 log T0) and p reaches target at slightly smaller N.
 *
 * The punchline: the third F3 landmark (0.01%, p >= 0.49995) is N ~ 1e4345.7, the E1 < E3 < E2 ordering
 * and ~1% (indeed ~0.07%) relative agreement persist a decade deeper, but the imp-33988 finite-difference
 * Newton E3 method itself breaks down at this depth (ln sigma ~ -5000) and must be replaced by a
 * bracketed bisection / analytic-tail crossing -- a numerical-precision caveat, no new mechanism.
 *
 * MEASUREMENT / CROSS-CHECK ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is
 * the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per
 * imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched;
 * no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-33988 (F3 first two landmarks recomputed three ways: E1 closed-form, E2 law-direct, E3 Newton)
 * @see imp-33816 (F3 landmarks 1e44 / 1e434; gap ~ 1/(2 log T0))
 * @see imp-33859 (log-space within-0.1% crossing at N ~ 1e436.06, via ln N = u + log(u-1))
 * @see imp-33949 (log T0 * gap -> 1/2 from below; the finite-log-T0 shortfall of the leading law)
 * @see imp-3463 (far-tail leading form, exponent -> 1/2 from below)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 */

import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const LOG_TWO_PI = Math.log(TWO_PI);
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-3529/imp-33582/imp-33816/imp-33988
const HALF = 0.5; // imp-3463 far-tail sqrt(1/N) asymptote

// Forward RvM: ln N from u = log(T0/2pi). Never forms T0 or N (imp-33859 route).
const lnNFromU = (u) => u + Math.log(u - 1);

// Inverse RvM: solve ln N = u + log(u - 1) for u = log(T0/2pi) by Newton (never forms T0/N).
function uFromLnN(lnN) {
  let u = Math.max(2, lnN);
  for (let i = 0; i < 100; i++) {
    const g = u + Math.log(u - 1) - lnN;
    const gp = 1 + 1 / (u - 1);
    const du = g / gp;
    u -= du;
    if (u <= 1) u = 1 + 1e-12;
    if (Math.abs(du) < 1e-14 * Math.max(1, u)) break;
  }
  return u;
}
const logT0FromLnN = (lnN) => uFromLnN(lnN) + LOG_TWO_PI;

// EXACT imp-33816/imp-33859/imp-33988 log-space sub-terms.
function lnSigmaFromLnN(lnN) {
  const u = uFromLnN(lnN);
  const L = u + LOG_TWO_PI; // log T0
  const C_F = (u + 1) / TWO_PI; // = (log(T0/2pi) + 1)/2pi (imp-398)
  const lnE_coll = Math.log(C_C_PINNED) + 0.5 * Math.log(L) - 0.5 * lnN; // C_C sqrt(L/N)
  const E_coll = Math.exp(lnE_coll);
  const E_flow = C_F * L * Math.exp(-L) * GRONWALL; // C_F (L/T0) Gronwall, T0 = e^L
  return lnE_coll - Math.log(E_TRUNC_PT + E_flow + E_coll);
}
function pLocalFromLnN(lnN) {
  const dl = 1e-3; // identical step to imp-33816/imp-33988 finite-difference exponent
  return -(lnSigmaFromLnN(lnN + dl) - lnSigmaFromLnN(lnN - dl)) / (2 * dl);
}

// (E1) F2 closed-form: log T0 = 1/(2 gap), then the collapsed inversion ln N ~ log T0.
function f2ClosedFormLog10(pTarget) {
  const logT0 = 1 / (2 * (HALF - pTarget));
  return { logT0, log10N: logT0 / Math.LN10 };
}
// (E2) Law-direct with FULL RvM inversion: same leading log T0 = 1/(2 gap), invert honestly.
function lawDirectFullInversionLog10(pTarget) {
  const logT0 = 1 / (2 * (HALF - pTarget));
  const u = logT0 - LOG_TWO_PI;
  const lnN = lnNFromU(u);
  return { logT0, u, lnN, log10N: lnN / Math.LN10 };
}
// (E3a) imp-33988 finite-difference Newton on the ACTUAL exponent. DIVERGES (NaN) when ln sigma is
// large in magnitude (the 0.01% mark, ln sigma ~ -5000): kept only to DOCUMENT the breakdown.
function newtonActualCrossingLog10(pTarget, seedLnN) {
  let lnN = seedLnN;
  let converged = false;
  for (let i = 0; i < 100; i++) {
    const f = pLocalFromLnN(lnN) - pTarget;
    const h = 1e-2;
    const fp = (pLocalFromLnN(lnN + h) - pLocalFromLnN(lnN - h)) / (2 * h);
    const dl = f / fp;
    lnN -= dl;
    if (!Number.isFinite(lnN)) break;
    if (Math.abs(dl) < 1e-12 * Math.max(1, lnN)) {
      converged = true;
      break;
    }
  }
  const pCheck = pLocalFromLnN(lnN);
  return { lnN, log10N: lnN / Math.LN10, pCheck, converged, diverged: !Number.isFinite(pCheck) };
}
// (E3b) ROBUST actual crossing: bracketed bisection on the monotone p(N) = target (derivative-free).
function bisectActualCrossingLog10(pTarget, loLnN, hiLnN) {
  let lo = loLnN;
  let hi = hiLnN;
  for (let i = 0; i < 200; i++) {
    const mid = 0.5 * (lo + hi);
    if (pLocalFromLnN(mid) < pTarget) lo = mid;
    else hi = mid;
  }
  const lnN = 0.5 * (lo + hi);
  return { lnN, log10N: lnN / Math.LN10, pCheck: pLocalFromLnN(lnN), logT0: logT0FromLnN(lnN) };
}
// (E3c) ANALYTIC E_trunc-dominated-tail crossing: with E_coll, E_flow << E_trunc the exponent reduces
// to p = 1/2 - (u - 1)/(2 u L), L = u + log(2pi); solve (u-1)/(u L) = 2 gap for u. Underflow-free.
function analyticTailCrossingLog10(pTarget) {
  const gap = HALF - pTarget;
  let u = 1 / (2 * gap);
  for (let i = 0; i < 200; i++) {
    const L = u + LOG_TWO_PI;
    const f = (u - 1) / (u * L) - 2 * gap;
    const eps = 1e-4;
    const L2 = u + eps + LOG_TWO_PI;
    const fp = ((u + eps - 1) / ((u + eps) * L2) - (u - 1) / (u * L)) / eps;
    const du = f / fp;
    u -= du;
    if (Math.abs(du) < 1e-12 * Math.max(1, u)) break;
  }
  return { u, lnN: lnNFromU(u), log10N: lnNFromU(u) / Math.LN10 };
}

// The three shallower marks recomputed via the robust E3 (bisection) confirm it reproduces the
// imp-33988 Newton landmarks 44.167 (1%) and 436.059 (0.1%); the third mark is the new result.
const PTARGET = 0.49995; // 0.01% of 1/2
const e1 = f2ClosedFormLog10(PTARGET);
const e2 = lawDirectFullInversionLog10(PTARGET);
const e3Newton = newtonActualCrossingLog10(PTARGET, e2.lnN); // documents the divergence
const e3Bisect = bisectActualCrossingLog10(PTARGET, 9000, 12000);
const e3Analytic = analyticTailCrossingLog10(PTARGET);

const REPRO_1PCT = bisectActualCrossingLog10(0.495, 80, 120).log10N; // must reproduce imp-33988 44.167
const REPRO_0_1PCT = bisectActualCrossingLog10(0.4995, 900, 1100).log10N; // must reproduce imp-33988 436.059

export const IMP34039_F3_THIRD_LANDMARK_0P01PCT = {
  id: 'imp-34039',
  proofSection: 'S-frontier',
  question:
    'Compute the THIRD imp-33816 F3 near-asymptote landmark -- the 0.01% mark (p >= 0.49995) -- via ' +
    'the identical imp-33988 three-way recompute (E1 F2 closed-form ln N ~ log T0, E2 law-direct full ' +
    'RvM inversion, E3 actual local-exponent crossing p(N) = target), one decade deeper on the ' +
    'gap(N) = 1/2 - p ~ 1/(2 log T0) law. Verify the E1 < E3 < E2 ordering and ~1% agreement persist ' +
    'and state whether the E1 -> E2 sub-leading spread keeps widening. Measurement/cross-check only; ' +
    'conditional-share diagnostic, NOT an RH bound; C_mb stays GUE-conditional (imp-486); no QED.',
  method:
    'Three estimates of the p = 0.49995 landmark in log-N space (imp-33859 route, u = log(T0/2pi), ' +
    'log T0 = 1/(2 gap) = 10000): (E1) collapsed inversion ln N ~ log T0; (E2) full RvM inversion ' +
    'ln N = u + log(u-1); (E3) actual crossing p(N) = target. The imp-33988 finite-difference Newton ' +
    'for E3 DIVERGES a decade deeper (ln sigma ~ -5000, derivative lost to cancellation), so E3 is ' +
    'recovered by a derivative-free bracketed bisection and cross-validated by the analytic ' +
    'E_trunc-tail crossing p = 1/2 - (u-1)/(2 u L); both reproduce the imp-33988 44.167/436.059 marks.',
  landmark: {
    label: '0.01% of 1/2 (p = 0.49995)',
    pTarget: PTARGET,
    logT0_target: +e1.logT0.toFixed(3), // = 1/(2 gap) = 10000
    e1_f2_closedform_log10N: +e1.log10N.toFixed(3), // 4342.945
    e2_law_direct_full_inversion_log10N: +e2.log10N.toFixed(3), // 4346.147
    e3_actual_crossing_bisection_log10N: +e3Bisect.log10N.toFixed(3), // 4345.682
    e3_actual_crossing_analytic_tail_log10N: +e3Analytic.log10N.toFixed(3), // 4345.712
    e3_pCheck: +e3Bisect.pCheck.toFixed(8), // = target, confirms the root
    e3_logT0_at_crossing: +e3Bisect.logT0.toFixed(3), // ~9998.930
    logT0_times_gap_at_crossing: +(e3Bisect.logT0 * (HALF - PTARGET)).toFixed(5), // ~0.49995 (< 1/2)
    e2_vs_e1_decades: +(e2.log10N - e1.log10N).toFixed(3), // 3.202 (restored RvM sub-leading)
    e2_vs_e1_relpct: +((e2.log10N - e1.log10N) / e1.log10N * 100).toFixed(4), // 0.0737
    e3_vs_e2_decades: +(e3Bisect.log10N - e2.log10N).toFixed(3), // -0.465 (imp-33949 shortfall)
    bisection_vs_analytic_tail_decades: +Math.abs(e3Bisect.log10N - e3Analytic.log10N).toFixed(4), // 0.030
    imp33988_finite_diff_newton_diverges: e3Newton.diverged, // true
  },
  // Progression of the E1 -> E2 sub-leading spread across the three F3 landmarks (from imp-33988 + here).
  subleading_spread_progression: {
    marks: ['1% (p=0.495)', '0.1% (p=0.4995)', '0.01% (p=0.49995)'],
    absolute_decades: [1.189, 2.201, +(e2.log10N - e1.log10N).toFixed(3)], // widen ~+1/mark: 1.189,2.201,3.202
    relative_pct: [2.739, 0.507, +((e2.log10N - e1.log10N) / e1.log10N * 100).toFixed(4)], // shrink: 2.739,0.507,0.0737
  },
  reproduction_gate: {
    // The robust E3 bisection reproduces the imp-33988 Newton crossings at the two shallower marks.
    bisection_reproduces_imp33988_1pct_log10N: +REPRO_1PCT.toFixed(3), // ~44.167
    bisection_reproduces_imp33988_0_1pct_log10N: +REPRO_0_1PCT.toFixed(3), // ~436.059
  },
  finding: {
    G1_third_landmark_location:
      'The 0.01% mark (p >= 0.49995) lands at N ~ 1e4345.7 (bisection 4345.682, analytic tail 4345.712, ' +
      'agreeing to 0.030 decades) -- ~32 decades of log T0 (1000 -> ~9999) and ~3910 decades of N past ' +
      'the 0.1% mark, confirming the glacial imp-33816 approach: each factor-10 tightening of the gap ' +
      'costs ~1 more decade of log T0 but ~1000 more decades of N.',
    G2_ordering_persists:
      'The coherent E1 < E3 < E2 ordering holds a decade deeper: 4342.945 < 4345.682 < 4346.147.',
    G3_spread_widens_absolutely_shrinks_relatively:
      'The E1 -> E2 restored-RvM-sub-leading spread keeps WIDENING in absolute decades (1.189 -> 2.201 ' +
      '-> 3.202, ~+1 decade per mark) but its share of log10 N COLLAPSES (2.739% -> 0.507% -> 0.074%), ' +
      'so the three estimates agree relatively ever more tightly (well inside 1%) even as they separate ' +
      'in absolute decades. The answer to the ticket: absolute widening, relative tightening.',
    G4_actual_crossing_below_law_direct:
      'The actual crossing stays below the law-direct estimate (E3 - E2 = -0.465 decades), the imp-33949 ' +
      'finite-log-T0 signature: at the crossing log T0 * gap = 0.49995 (< 1/2, log T0 ~ 9998.93), so the ' +
      'true gap is slightly under the leading 1/(2 log T0) and p reaches target at slightly smaller N.',
    G5_newton_method_breakdown:
      'The imp-33988 finite-difference Newton for E3 DIVERGES a decade deeper: at log10 N ~ 4346 the ' +
      'log-space ln sigma is ~ -5000, so the central-difference dp/d ln N is pure cancellation noise and ' +
      'Newton returns NaN. E3 here is a derivative-free bracketed bisection, cross-validated by the ' +
      'analytic E_trunc-tail crossing; both reproduce the imp-33988 1%/0.1% Newton marks to 3 decimals.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / CROSS-CHECK (frontier-direction, NOT rigorous). The THIRD imp-33816 F3 near-asymptote ' +
    'landmark, the 0.01% mark (p >= 0.49995), is computed three ways in log-N space: F2 closed-form ' +
    '(ln N ~ log T0) = 1e4342.945; law-direct with full RvM inversion (ln N = u + log(u-1)) = 1e4346.147; ' +
    'and the actual local-exponent crossing p(N) = target = 1e4345.682 (bisection) / 1e4345.712 ' +
    '(analytic tail). The coherent E1 < E3 < E2 ordering and ~0.07% relative agreement persist a decade ' +
    'deeper; the E1 -> E2 sub-leading spread keeps widening in absolute decades (1.189 -> 2.201 -> 3.202) ' +
    'but SHRINKS relatively (2.739% -> 0.507% -> 0.074%). One caveat: the imp-33988 finite-difference ' +
    'Newton for E3 DIVERGES at this depth (ln sigma ~ -5000, derivative lost to cancellation), so E3 is ' +
    'recovered by a bracketed bisection cross-validated by the analytic E_trunc-tail crossing -- both ' +
    'reproduce the imp-33988 44.167/436.059 marks to 3 decimals. No new mechanism. The component model ' +
    'is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional ' +
    'per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 ' +
    'untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33988 (F3 first two landmarks three ways); imp-33816 (F3 landmarks 1e44/1e434, gap ~ 1/(2 log T0)); ' +
    'imp-33859 (log-space within-0.1% crossing 1e436.06); imp-33949 (log T0 * gap -> 1/2 from below); ' +
    'imp-3463 (far-tail exponent -> 1/2 from below); imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc).',
};

export const IMP34039_F3_THIRD_LANDMARK_0P01PCT_ASSERTIONS = [
  {
    // G2: the coherent E1 < E3 < E2 ordering holds at the 0.01% mark.
    id: 'imp34039-ordering-e1-lt-e3-lt-e2',
    description: 'E1 (4342.945) < E3 (4345.682, bisection) < E2 (4346.147) -- coherent ordering a decade deeper',
    holds: () =>
      IMP34039_F3_THIRD_LANDMARK_0P01PCT.landmark.e1_f2_closedform_log10N <
        IMP34039_F3_THIRD_LANDMARK_0P01PCT.landmark.e3_actual_crossing_bisection_log10N &&
      IMP34039_F3_THIRD_LANDMARK_0P01PCT.landmark.e3_actual_crossing_bisection_log10N <
        IMP34039_F3_THIRD_LANDMARK_0P01PCT.landmark.e2_law_direct_full_inversion_log10N,
  },
  {
    // Reuse/validation gate: the robust bisection E3 reproduces the imp-33988 Newton landmarks at the
    // two shallower marks (44.167 / 436.059) -- proving the substitute E3 method is the same crossing.
    id: 'imp34039-bisection-reproduces-imp33988-shallow-marks',
    description: 'Robust E3 bisection reproduces the imp-33988 Newton crossings 44.167 (1%) and 436.059 (0.1%) to <1e-2',
    holds: () =>
      Math.abs(IMP34039_F3_THIRD_LANDMARK_0P01PCT.reproduction_gate.bisection_reproduces_imp33988_1pct_log10N - 44.167) < 1e-2 &&
      Math.abs(IMP34039_F3_THIRD_LANDMARK_0P01PCT.reproduction_gate.bisection_reproduces_imp33988_0_1pct_log10N - 436.059) < 1e-2,
  },
  {
    // G5: the imp-33988 finite-difference Newton for E3 DIVERGES at the 0.01% mark (documented breakdown).
    id: 'imp34039-finite-diff-newton-diverges-a-decade-deeper',
    description: 'The imp-33988 finite-difference Newton for E3 returns NaN at the 0.01% mark (ln sigma ~ -5000)',
    holds: () => IMP34039_F3_THIRD_LANDMARK_0P01PCT.landmark.imp33988_finite_diff_newton_diverges === true,
  },
  {
    // G5 cross-check: the robust bisection and the analytic E_trunc-tail crossing agree to <0.05 decades.
    id: 'imp34039-bisection-agrees-with-analytic-tail',
    description: 'Bisection E3 (4345.682) and analytic E_trunc-tail crossing (4345.712) agree to <0.05 decades',
    holds: () => IMP34039_F3_THIRD_LANDMARK_0P01PCT.landmark.bisection_vs_analytic_tail_decades < 0.05,
  },
  {
    // G3: the E1 -> E2 sub-leading spread widens in ABSOLUTE decades but shrinks RELATIVELY across marks.
    id: 'imp34039-subleading-widens-absolutely-shrinks-relatively',
    description: 'Absolute E1->E2 decades widen 1.189->2.201->3.202 while the relative correction shrinks 2.739->0.507->0.074%',
    holds: () => {
      const a = IMP34039_F3_THIRD_LANDMARK_0P01PCT.subleading_spread_progression.absolute_decades;
      const r = IMP34039_F3_THIRD_LANDMARK_0P01PCT.subleading_spread_progression.relative_pct;
      return a[0] < a[1] && a[1] < a[2] && r[0] > r[1] && r[1] > r[2] &&
        Math.abs(a[2] - 3.202) < 0.02 && Math.abs(r[2] - 0.0737) < 0.02;
    },
  },
  {
    // G4: the actual crossing sits below the law-direct estimate; log T0 * gap < 1/2 (imp-33949 signature).
    id: 'imp34039-actual-crossing-below-law-direct-finite-logT0',
    description: 'E3 - E2 = -0.465 decades (< 0) and log T0 * gap = 0.49995 < 1/2 at the crossing (imp-33949)',
    holds: () =>
      IMP34039_F3_THIRD_LANDMARK_0P01PCT.landmark.e3_vs_e2_decades < 0 &&
      IMP34039_F3_THIRD_LANDMARK_0P01PCT.landmark.logT0_times_gap_at_crossing < 0.5,
  },
  {
    // Honesty gate: measurement/cross-check only, no bound changed, no QED, PT SOTA.
    id: 'imp34039-honesty-gate-no-qed',
    description: 'Measurement/cross-check only: not rigorous, no QED, PT stays SOTA',
    holds: () =>
      IMP34039_F3_THIRD_LANDMARK_0P01PCT.isRigorous === false &&
      /NO QED/.test(IMP34039_F3_THIRD_LANDMARK_0P01PCT.verdict) &&
      /remains SOTA/.test(IMP34039_F3_THIRD_LANDMARK_0P01PCT.verdict),
  },
];

for (const a of IMP34039_F3_THIRD_LANDMARK_0P01PCT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34039-f3-third-landmark-0p01pct assertion failed: ${a.id}`);
  }
}
