/**
 * @module imp-33988-f3-landmark-law-recompute-newton-crosscheck
 *
 * imp-33988 (accuracy, frontier-direction): imp-33816 F3 reports the two near-asymptote landmarks
 * of the sigma(N) post-peak local decay exponent -- p first within 1% of the imp-3463 far-tail 1/2
 * (p >= 0.495) at N ~ 1e44, and within 0.1% (p >= 0.4995) at N ~ 1e434 -- from the approach-rate law
 * gap(N) = 1/2 - p(N) ~ 1/(2 log T0(N)). But the 1e44 / 1e434 figures were quoted from the law with
 * the RvM inversion collapsed to ln N ~ log T0 (dropping the sub-leading log(u-1) + log(2pi) terms),
 * and the 1e44 crossing was never independently solved. This module RECOMPUTES both landmarks two
 * further ways and reports the relative agreement.
 *
 * THE QUANTITY (identical inherited imp-3220 / imp-3406 / imp-3529 / imp-33582 / imp-33816 sub-terms)
 * ---------------------------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_coll = C_C sqrt(log T0 / N)      (dominant, GUE-conditional C_H),
 *     E_flow = C_F (log T0 / T0) Gronwall,  C_F = (log(T0/2pi) + 1)/2pi  (imp-398),
 *     E_trunc = 3.06e-5                   (N-independent, imp-2631),
 *     p(N) = -d ln sigma / d ln N,  far tail p -> 1/2 from below (imp-3463).
 * Everything is evaluated in log-N space (the imp-33859 route): with u = log(T0/2pi) the RvM relation
 * is ln N = u + log(u - 1) and log T0 = u + log(2pi), so neither T0 nor N is ever formed.
 *
 * THE THREE ESTIMATES OF EACH LANDMARK
 * ------------------------------------
 *   (E1) F2 CLOSED-FORM (as quoted by imp-33816): the law gap = 1/(2 log T0) fixes log T0 = 1/(2 gap)
 *        (= 100 for the 1% mark, 1000 for the 0.1% mark), then collapses the RvM inversion to the
 *        leading term ln N ~ log T0. Gives log10 N = 43.43 (1%) and 434.29 (0.1%) -- the "1e434".
 *   (E2) LAW-DIRECT, FULL RvM INVERSION: same leading law (log T0 = 1/(2 gap)) but invert log T0 -> ln N
 *        honestly through u = log T0 - log(2pi), ln N = u + log(u - 1). Restores the dropped
 *        sub-leading terms -> log10 N = 44.62 (1%) and 436.50 (0.1%).
 *   (E3) NEWTON ON THE ACTUAL EXPONENT: root-find the EXACT local exponent p(N) = target directly by
 *        Newton on ln N (an independent method to the imp-33816/imp-33859 bisection), evaluating p by
 *        central finite-difference of the log-space ln sigma. Gives log10 N = 44.17 (1%) and 436.06
 *        (0.1%), reproducing the imp-33816 within_1pct (44.17) and imp-33859 within_0_1pct_direct
 *        (436.06) landmarks to two decimals -- the independent cross-check the ticket asks for.
 *
 * THE FINDING (measurement / cross-check only)
 * --------------------------------------------
 *   (G1) THE 1e44 LANDMARK IS CONFIRMED INDEPENDENTLY. The Newton solve of the actual p(N) = 0.495
 *        lands at N ~ 1e44.17, matching the imp-33816 bisection landmark to < 1e-2 in log10 N and the
 *        rounded "1e44" figure to ~0.4%. The 0.1% Newton crossing lands at N ~ 1e436.06, reproducing
 *        the imp-33859 direct value exactly.
 *   (G2) THE SUB-LEADING RvM TERMS ARE THE ONLY GAP BETWEEN THE LAW AND THE F2 QUOTE. E2 sits ~1.19
 *        decades (1%) / ~2.20 decades (0.1%) ABOVE the E1 F2 collapse, entirely the restored
 *        + log(u - 1) + log(2pi): a ~2.7% (1%) and ~0.5% (0.1%) relative correction in log10 N that
 *        SHRINKS as log T0 grows (the sub-leading term is relatively smaller far out).
 *   (G3) THE ACTUAL CROSSING SITS BELOW THE LAW-DIRECT ESTIMATE. E3 lands ~0.45 decades (~1%, 1% mark;
 *        ~0.1%, 0.1% mark) BELOW E2. This is the imp-33949 finite-N signature log T0 * gap -> 1/2 from
 *        below: at finite log T0 the true gap is slightly SMALLER than the leading 1/(2 log T0), so the
 *        actual p reaches the target at slightly smaller N. The offset shrinks toward the 0.1% mark,
 *        exactly as log T0 * gap climbs from ~0.495 (log T0 ~ 99) toward ~0.4995 (log T0 ~ 999).
 *
 * The punchline: all three estimates of the F3 landmarks agree to ~1% in log10 N and order coherently
 * E1 < E3 < E2, so the imp-33816 "1e44 / 1e434" quote is confirmed and its ~1-2 decade spread is fully
 * accounted for by (E1->E2) the dropped RvM sub-leading terms and (E2->E3) the imp-33949 finite-log-T0
 * shortfall of the leading law -- no new mechanism.
 *
 * MEASUREMENT / CROSS-CHECK ONLY. Conditional-share diagnostic, NOT an RH bound. The component model
 * is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional
 * per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0
 * untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-33816-sigma-exponent-asymptote-approach-rate (F3 landmarks 1e44 / 1e434; gap ~ 1/(2 log T0))
 * @see imp-33859 (log-space direct within-0.1% crossing at N ~ 1e436.06, via ln N = u + log(u-1))
 * @see imp-33949 (log T0 * gap -> 1/2 from below; the finite-log-T0 shortfall of the leading law)
 * @see imp-3463 (far-tail leading form, exponent -> 1/2 from below)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 */

import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const LOG_TWO_PI = Math.log(TWO_PI);
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-3529/imp-33582/imp-33816 exactly
const HALF = 0.5; // imp-3463 far-tail sqrt(1/N) asymptote

// Forward RvM: ln N from u = log(T0/2pi). Never forms T0 or N (imp-33859 route).
const lnNFromU = (u) => u + Math.log(u - 1);

// Inverse RvM: solve ln N = u + log(u - 1) for u = log(T0/2pi) by Newton (never forms T0/N).
function uFromLnN(lnN) {
  let u = Math.max(2, lnN); // seed u ~ ln N for large N
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
const logT0FromLnN = (lnN) => uFromLnN(lnN) + LOG_TWO_PI; // log T0 = u + log(2pi)

// EXACT imp-33816/imp-33859 log-space sub-terms.
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
  const dl = 1e-3; // identical step to imp-33816 pLocalAtLog10/pLocalFromLnN
  return -(lnSigmaFromLnN(lnN + dl) - lnSigmaFromLnN(lnN - dl)) / (2 * dl);
}

// (E1) F2 closed-form as quoted: log T0 = 1/(2 gap), then the collapsed inversion ln N ~ log T0.
function f2ClosedFormLog10(pTarget) {
  const logT0 = 1 / (2 * (HALF - pTarget)); // leading law gap = 1/(2 log T0)
  return { logT0, log10N: logT0 / Math.LN10 }; // ln N ~ log T0 (sub-leading dropped)
}

// (E2) Law-direct with FULL RvM inversion: same leading log T0 = 1/(2 gap), invert honestly.
function lawDirectFullInversionLog10(pTarget) {
  const logT0 = 1 / (2 * (HALF - pTarget));
  const u = logT0 - LOG_TWO_PI;
  const lnN = lnNFromU(u); // ln N = u + log(u - 1), sub-leading terms restored
  return { logT0, u, lnN, log10N: lnN / Math.LN10 };
}

// (E3) Newton on the ACTUAL exponent: root-find p(N) = target directly (independent of the imp-33816
// bisection). Central-difference derivative dp/d ln N; seed at the E2 law-direct landmark.
function newtonActualCrossingLog10(pTarget, seedLnN) {
  let lnN = seedLnN;
  let converged = false;
  for (let i = 0; i < 100; i++) {
    const f = pLocalFromLnN(lnN) - pTarget;
    const h = 1e-2; // FD step for dp/d ln N
    const fp = (pLocalFromLnN(lnN + h) - pLocalFromLnN(lnN - h)) / (2 * h);
    const dl = f / fp;
    lnN -= dl;
    if (Math.abs(dl) < 1e-12 * Math.max(1, lnN)) {
      converged = true;
      break;
    }
  }
  return { lnN, log10N: lnN / Math.LN10, pCheck: pLocalFromLnN(lnN), logT0: logT0FromLnN(lnN), converged };
}

const MARKS = [
  { key: 'within_1pct', label: '1% of 1/2 (p = 0.495)', pTarget: 0.495, f2QuoteLog10: 44, imp33816Log10: 44.17 },
  { key: 'within_0_1pct', label: '0.1% of 1/2 (p = 0.4995)', pTarget: 0.4995, f2QuoteLog10: 434, imp33816Log10: 436.06 },
].map((m) => {
  const e1 = f2ClosedFormLog10(m.pTarget);
  const e2 = lawDirectFullInversionLog10(m.pTarget);
  const e3 = newtonActualCrossingLog10(m.pTarget, e2.lnN);
  return {
    landmark: m.label,
    logT0_target: +e1.logT0.toFixed(3), // = 1/(2 gap): 100 (1%), 1000 (0.1%)
    e1_f2_closedform_log10N: +e1.log10N.toFixed(3), // ln N ~ log T0 (dropped sub-leading)
    e2_law_direct_full_inversion_log10N: +e2.log10N.toFixed(3), // ln N = u + log(u-1)
    e3_newton_actual_exponent_log10N: +e3.log10N.toFixed(3), // Newton on true p(N) = target
    e3_pCheck: +e3.pCheck.toFixed(6), // = target, confirms the root
    e3_logT0_at_crossing: +e3.logT0.toFixed(2), // actual log T0 (~99 / ~999)
    // relative agreement in log10 N
    e2_vs_e1_decades: +(e2.log10N - e1.log10N).toFixed(3), // restored RvM sub-leading terms
    e2_vs_e1_relpct: +((e2.log10N - e1.log10N) / e1.log10N * 100).toFixed(3),
    e3_vs_e2_decades: +(e3.log10N - e2.log10N).toFixed(3), // imp-33949 finite-log-T0 shortfall (negative)
    e3_vs_e2_relpct: +((e3.log10N - e2.log10N) / e2.log10N * 100).toFixed(3),
    e3_vs_imp33816_landmark_log10N: +Math.abs(e3.log10N - m.imp33816Log10).toFixed(3), // reproduction gap
  };
});

export const IMP33988_F3_LANDMARK_LAW_RECOMPUTE_NEWTON_CROSSCHECK = {
  id: 'imp-33988',
  proofSection: 'S-frontier',
  question:
    'Recompute the imp-33816 F3 near-asymptote landmarks (p within 1% of 1/2 at N ~ 1e44, within ' +
    '0.1% at N ~ 1e434) directly from the gap(N) = 1/2 - p ~ 1/(2 log T0) law, and cross-check the ' +
    '1e44 figure via an independent Newton solve of the actual p(N) = 0.495 in log space (Newton on ' +
    'ln N = u + log(u-1), never forming T0/N). Measurement/cross-check only; conditional-share ' +
    'diagnostic, NOT an RH bound; C_mb stays GUE-conditional (imp-486); no QED.',
  method:
    'Three estimates of each landmark, all in log-N space (imp-33859 route, u = log(T0/2pi)): ' +
    '(E1) F2 closed-form log T0 = 1/(2 gap) with the collapsed inversion ln N ~ log T0; ' +
    '(E2) same leading law but full RvM inversion ln N = u + log(u-1); ' +
    '(E3) Newton root-find of the EXACT local exponent p(N) = target (independent of the imp-33816 bisection).',
  marks: MARKS,
  agreement: {
    // G1: the independent Newton solve reproduces the imp-33816 / imp-33859 crossings.
    newton_reproduces_imp33816_within_1pct: MARKS[0].e3_newton_actual_exponent_log10N, // ~44.17
    newton_reproduces_imp33859_within_0_1pct: MARKS[1].e3_newton_actual_exponent_log10N, // ~436.06
    // G2: E1 -> E2 spread is the restored RvM sub-leading terms (shrinks far out).
    sub_leading_decades_1pct: MARKS[0].e2_vs_e1_decades, // ~1.19
    sub_leading_decades_0_1pct: MARKS[1].e2_vs_e1_decades, // ~2.20
    // G3: E3 sits below E2 (imp-33949 log T0 * gap -> 1/2 from below); offset shrinks far out.
    finite_logT0_offset_decades_1pct: MARKS[0].e3_vs_e2_decades, // ~-0.45
    finite_logT0_offset_decades_0_1pct: MARKS[1].e3_vs_e2_decades, // ~-0.44
  },
  finding: {
    G1_1e44_landmark_confirmed_independently:
      'The Newton solve of the actual p(N) = 0.495 lands at N ~ 1e44.17, matching the imp-33816 ' +
      'bisection landmark to < 1e-2 in log10 N and the rounded "1e44" quote to ~0.4%. The 0.1% ' +
      'Newton crossing lands at N ~ 1e436.06, reproducing the imp-33859 direct value exactly.',
    G2_subleading_rvm_terms_account_for_law_vs_f2_quote:
      'The law-direct full-inversion estimate sits ~1.19 decades (1%) / ~2.20 decades (0.1%) above the ' +
      'F2 collapsed quote, entirely the restored + log(u-1) + log(2pi) RvM sub-leading terms -- a ' +
      '~2.7% (1%) and ~0.5% (0.1%) relative correction in log10 N that shrinks as log T0 grows.',
    G3_actual_crossing_below_law_direct_imp33949_signature:
      'The actual Newton crossing sits ~0.45 decades below the law-direct estimate, the imp-33949 ' +
      'finite-log-T0 signature log T0 * gap -> 1/2 from below: at finite log T0 the true gap is ' +
      'slightly smaller than the leading 1/(2 log T0), so p reaches the target at slightly smaller N. ' +
      'The offset shrinks toward the 0.1% mark as log T0 * gap climbs from ~0.495 toward ~0.4995.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / CROSS-CHECK (frontier-direction, NOT rigorous). The imp-33816 F3 landmarks are ' +
    'recomputed three ways in log-N space: F2 closed-form (ln N ~ log T0) = 1e43.43 / 1e434.29; ' +
    'law-direct with full RvM inversion (ln N = u + log(u-1)) = 1e44.62 / 1e436.50; and an ' +
    'independent Newton solve of the actual p(N) = target = 1e44.17 / 1e436.06. All three order ' +
    'coherently E1 < E3 < E2 and agree to ~1% in log10 N; the Newton solve reproduces the imp-33816 ' +
    'within_1pct (1e44.17) and imp-33859 within_0_1pct_direct (1e436.06) landmarks to two decimals. ' +
    'The E1->E2 spread is the dropped RvM sub-leading terms; the E2->E3 offset is the imp-33949 ' +
    'finite-log-T0 shortfall of the leading law -- no new mechanism. The component model is the ' +
    'inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional ' +
    'per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33816 (F3 landmarks 1e44/1e434, gap ~ 1/(2 log T0)); imp-33859 (log-space within-0.1% ' +
    'crossing 1e436.06); imp-33949 (log T0 * gap -> 1/2 from below); imp-3463 (far-tail exponent ' +
    '-> 1/2 from below); imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc fixed-strip route).',
};

export const IMP33988_F3_LANDMARK_LAW_RECOMPUTE_NEWTON_CROSSCHECK_ASSERTIONS = [
  {
    // G1 (1%): the independent Newton solve reproduces the imp-33816 within_1pct landmark (44.17).
    id: 'imp33988-newton-reproduces-imp33816-within-1pct',
    description: 'Newton on actual p(N)=0.495 lands at N~1e44.17, reproducing the imp-33816 within_1pct landmark to <1e-2 in log10 N',
    holds: () => MARKS[0].e3_pCheck === 0.495 && MARKS[0].e3_vs_imp33816_landmark_log10N < 1e-2,
  },
  {
    // G1 (0.1%): the Newton solve reproduces the imp-33859 within_0_1pct_direct landmark (436.06).
    id: 'imp33988-newton-reproduces-imp33859-within-0-1pct',
    description: 'Newton on actual p(N)=0.4995 lands at N~1e436.06, reproducing the imp-33859 direct landmark to <1e-2 in log10 N',
    holds: () => MARKS[1].e3_pCheck === 0.4995 && MARKS[1].e3_vs_imp33816_landmark_log10N < 1e-2,
  },
  {
    // Reuse gate: the F2 closed-form (E1) reproduces the imp-33816 quoted figures 1e434 (0.1%, exact
    // WITHIN_0_1PCT_LOG10_FROM_LAW=434) -- proving the identical leading law and inversion collapse.
    id: 'imp33988-f2-closedform-reproduces-imp33816-quote',
    description: 'E1 F2 closed-form reproduces the imp-33816 within_0_1pct_fromLaw quote 1e434 (log T0=1000, ln N ~ log T0)',
    holds: () =>
      MARKS[1].logT0_target === 1000 &&
      Math.abs(MARKS[1].e1_f2_closedform_log10N - 434) < 0.5 &&
      MARKS[0].logT0_target === 100,
  },
  {
    // G2: the E1 -> E2 correction is positive (restored RvM sub-leading terms) and SHRINKS relatively
    // as log T0 grows (~2.7% at the 1% mark, ~0.5% at the 0.1% mark).
    id: 'imp33988-subleading-rvm-correction-positive-and-shrinks',
    description: 'E2 sits above E1 by the restored RvM sub-leading terms; the relative correction shrinks from ~2.7% (1%) to ~0.5% (0.1%)',
    holds: () =>
      MARKS[0].e2_vs_e1_decades > 0 &&
      MARKS[1].e2_vs_e1_decades > 0 &&
      MARKS[0].e2_vs_e1_relpct > MARKS[1].e2_vs_e1_relpct &&
      Math.abs(MARKS[0].e2_vs_e1_relpct - 2.74) < 0.2 &&
      Math.abs(MARKS[1].e2_vs_e1_relpct - 0.51) < 0.2,
  },
  {
    // G3: the actual crossing (E3) sits BELOW the law-direct estimate (E2) -- the imp-33949
    // log T0 * gap -> 1/2 from below signature -- and the two landmarks order coherently E1 < E3 < E2.
    id: 'imp33988-actual-crossing-below-law-direct-ordering',
    description: 'E3 (actual Newton) < E2 (law-direct) at both marks (imp-33949 finite-log-T0 shortfall) with coherent order E1 < E3 < E2',
    holds: () =>
      MARKS.every(
        (m) =>
          m.e3_vs_e2_decades < 0 &&
          m.e1_f2_closedform_log10N < m.e3_newton_actual_exponent_log10N &&
          m.e3_newton_actual_exponent_log10N < m.e2_law_direct_full_inversion_log10N,
      ),
  },
  {
    // Honesty gate: measurement/cross-check only, no bound changed, no QED, PT SOTA.
    id: 'imp33988-honesty-gate-no-qed',
    description: 'Measurement/cross-check only: not rigorous, no QED, PT stays SOTA',
    holds: () =>
      IMP33988_F3_LANDMARK_LAW_RECOMPUTE_NEWTON_CROSSCHECK.isRigorous === false &&
      /NO QED/.test(IMP33988_F3_LANDMARK_LAW_RECOMPUTE_NEWTON_CROSSCHECK.verdict) &&
      /remains SOTA/.test(IMP33988_F3_LANDMARK_LAW_RECOMPUTE_NEWTON_CROSSCHECK.verdict),
  },
];

for (const a of IMP33988_F3_LANDMARK_LAW_RECOMPUTE_NEWTON_CROSSCHECK_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33988-f3-landmark-law-recompute-newton-crosscheck assertion failed: ${a.id}`);
  }
}
