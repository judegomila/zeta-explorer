/**
 * @module imp-34046-e2-e3-offset-imp33949-shortfall-crosscheck
 *
 * imp-34046 (accuracy, frontier-direction): imp-33988 attributed its E2 -> E3 landmark offset (law-
 * direct minus Newton, 1e44.62 vs 1e44.17 at the 1% F3 mark and 1e436.50 vs 1e436.06 at the 0.1%
 * mark) to the imp-33949 finite-log-T0 shortfall of the leading gap(N) = 1/(2 log T0) law -- calling
 * it "no new mechanism". But imp-33988 never recomputed the imp-33949 shortfall INDEPENDENTLY to
 * confirm it reconstructs those measured E2 - E3 gaps (~ -0.45 decades at the 1% mark, ~ -0.44 at the
 * 0.1% mark). This module does exactly that cross-check.
 *
 * THE ATTRIBUTION UNDER TEST
 * --------------------------
 *   E2 (law-direct) places each landmark where the LEADING law gives the target gap:
 *       L_E2 := log T0 = 1/(2 gapTarget)   =>  L*gap_leading = 1/2 exactly (100 at 1%, 1000 at 0.1%).
 *   E3 (Newton) places it where the ACTUAL local exponent p(N) hits the target, i.e. where the ACTUAL
 *       gap equals gapTarget. The imp-33949 signature says the actual product L*gap_actual -> 1/2 FROM
 *       BELOW, so at finite L the true gap is slightly SMALLER than 1/(2L). Since gap DECREASES with L,
 *       the actual crossing sits at slightly SMALLER L (smaller N) -- E3 below E2.
 *
 * THE INDEPENDENT RECONSTRUCTION (never re-uses the E3 Newton root)
 * ----------------------------------------------------------------
 * Evaluate the imp-33949 shortfall directly at the E2 anchor L in {100, 1000}, all in log-N space
 * (the imp-33859 route, u = log(T0/2pi), ln N = u + log(u - 1), never forming T0 or N):
 *   (1) map L -> ln N, evaluate the ACTUAL exponent p(N) by the same central FD as imp-33988;
 *   (2) shortfall  s(L) = gap_leading(L) - gap_actual(L) = 1/(2L) - (1/2 - p(N))  ( > 0 );
 *       equivalently the from-below deficit  delta(L) = 1/2 - L*gap_actual = L*s(L);
 *   (3) linearize the actual gap(L) about L to get the crossing shift
 *          dLogT0 = s(L) / (d gap_actual / dL)      ( < 0, since d gap/dL < 0 ),
 *       then convert to a log10 N offset via  d ln N / d log T0 = 1 + 1/(u - 1):
 *          dLog10N = dLogT0 * (1 + 1/(u - 1)) / ln 10.
 * Compare dLog10N against imp-33988's MEASURED e3_vs_e2_decades (imported, not re-derived).
 *
 * THE FINDING (measurement / cross-check only)
 * --------------------------------------------
 *   (G1) THE SHORTFALL IS REAL AND FROM BELOW. s(L) > 0 at both anchors and the product L*gap_actual
 *        sits just under 1/2 (~0.49491 at L=100, ~0.49950 at L=1000), climbing toward 1/2 as L grows
 *        -- exactly the imp-33949 log T0 * gap -> 1/2 FROM BELOW signature. The deficit delta shrinks
 *        ~10x (0.00509 -> 0.00050) as L goes 100 -> 1000.
 *   (G2) IT RECONSTRUCTS THE E2 - E3 GAP. The linearized crossing shift gives dLog10N ~ -0.456
 *        (1% mark) and ~ -0.436 (0.1% mark), matching imp-33988's measured e3_vs_e2 offsets
 *        (-0.452 and -0.436) to <~ 0.005 decades at BOTH landmarks. The imp-33988 attribution is
 *        confirmed independently: the E2 -> E3 offset IS the imp-33949 finite-log-T0 shortfall, no
 *        new mechanism.
 *   (G3) THE OFFSET IS NEARLY LANDMARK-INVARIANT (~ -0.45), because to leading order
 *        dLog10N ~ -2 L * delta / ln10 = -2 (L*s) L / ... collapses to ~ -1/ln10 ~ -0.434 as the
 *        shortfall scales like s(L) ~ 1/(2 L^2): the L-dependence of s cancels the L-growth of the
 *        1/(gap-slope) lever, leaving a near-constant decade offset. This is why imp-33988 saw
 *        essentially the same ~0.45-decade gap at both marks.
 *
 * MEASUREMENT / CROSS-CHECK ONLY. Descriptive cross-check on the inherited component model, NOT a
 * rigorous asymptotic; conditional-share diagnostic, NOT an RH bound. C_mb stays GUE-conditional
 * (imp-486); changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched;
 * no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33988-f3-landmark-law-recompute-newton-crosscheck (the E1/E2/E3 recompute and measured e3_vs_e2)
 * @see imp-33949 (log T0 * gap -> 1/2 from below; the finite-log-T0 shortfall of the leading law)
 * @see imp-33816-sigma-exponent-asymptote-approach-rate (F3 landmarks; gap ~ 1/(2 log T0))
 * @see imp-3463 (far-tail leading form, exponent -> 1/2 from below)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 */

import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP33988_F3_LANDMARK_LAW_RECOMPUTE_NEWTON_CROSSCHECK } from './imp-33988-f3-landmark-law-recompute-newton-crosscheck.js';

const TWO_PI = 2 * Math.PI;
const LOG_TWO_PI = Math.log(TWO_PI);
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-3529/imp-33582/imp-33816/imp-33988
const HALF = 0.5; // imp-3463 far-tail sqrt(1/N) asymptote

// EXACT imp-33859/imp-33988 log-space sub-terms (u = log(T0/2pi), never forming T0 or N).
const lnNFromU = (u) => u + Math.log(u - 1);
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
  const dl = 1e-3; // identical step to imp-33816/imp-33988 pLocalFromLnN
  return -(lnSigmaFromLnN(lnN + dl) - lnSigmaFromLnN(lnN - dl)) / (2 * dl);
}
// Map an anchor log T0 = L to ln N: u = L - log(2pi), ln N = u + log(u - 1).
const lnNfromLogT0 = (L) => lnNFromU(L - LOG_TWO_PI);
// Actual gap(L) = 1/2 - p(N) at the ln N corresponding to log T0 = L.
const gapActualAtLogT0 = (L) => HALF - pLocalFromLnN(lnNfromLogT0(L));

// imp-33988 measured E3 - E2 offsets (imported, NOT re-derived here).
const MEASURED = {
  within_1pct: IMP33988_F3_LANDMARK_LAW_RECOMPUTE_NEWTON_CROSSCHECK.agreement.finite_logT0_offset_decades_1pct, // ~ -0.452
  within_0_1pct: IMP33988_F3_LANDMARK_LAW_RECOMPUTE_NEWTON_CROSSCHECK.agreement.finite_logT0_offset_decades_0_1pct, // ~ -0.436
};

const ANCHORS = [
  { key: 'within_1pct', label: '1% of 1/2 (p = 0.495)', pTarget: 0.495, L: 100, measured: MEASURED.within_1pct },
  { key: 'within_0_1pct', label: '0.1% of 1/2 (p = 0.4995)', pTarget: 0.4995, L: 1000, measured: MEASURED.within_0_1pct },
].map((m) => {
  const L = m.L; // = 1/(2 gapTarget): the E2 anchor log T0
  const gapTarget = HALF - m.pTarget; // = 1/(2L) = leading gap
  const gapLeading = 1 / (2 * L);
  const gapActual = gapActualAtLogT0(L); // actual gap at the E2 anchor
  const shortfall_s = gapLeading - gapActual; // imp-33949 shortfall s(L) > 0
  const product_L_gap = L * gapActual; // -> 1/2 from below
  const delta = HALF - product_L_gap; // from-below deficit = L * s(L)
  // linearized crossing shift: d gap / dL from the actual model (central diff in L)
  const hL = 1e-3 * L;
  const dgap_dL = (gapActualAtLogT0(L + hL) - gapActualAtLogT0(L - hL)) / (2 * hL);
  const dLogT0 = shortfall_s / dgap_dL; // L_E3 - L_E2 (negative)
  const u = L - LOG_TWO_PI;
  const dlnN_dLogT0 = 1 + 1 / (u - 1); // RvM chain factor
  const reconstructed_e3_vs_e2_decades = dLogT0 * dlnN_dLogT0 / Math.LN10; // < 0
  return {
    landmark: m.label,
    logT0_anchor: L,
    gap_target: gapTarget,
    gap_actual: +gapActual.toExponential(6),
    shortfall_s: +shortfall_s.toExponential(6),
    product_L_gap: +product_L_gap.toFixed(6), // 1/2 from below
    delta_from_below: +delta.toFixed(6),
    reconstructed_e3_vs_e2_decades: +reconstructed_e3_vs_e2_decades.toFixed(4),
    measured_e3_vs_e2_decades: +m.measured, // imp-33988, imported
    residual_decades: +Math.abs(reconstructed_e3_vs_e2_decades - m.measured).toFixed(4),
  };
});

export const IMP34046_E2_E3_OFFSET_IMP33949_SHORTFALL_CROSSCHECK = {
  id: 'imp-34046',
  proofSection: 'S-frontier',
  question:
    'Cross-validate the imp-33988 E2 -> E3 landmark-offset attribution by INDEPENDENTLY recomputing ' +
    'the imp-33949 finite-log-T0 shortfall of the leading gap = 1/(2 log T0) law at the two F3 anchors ' +
    'log T0 = 100 (1% mark) and 1000 (0.1% mark), converting it to a log10 N crossing offset, and ' +
    'testing whether it reconstructs the measured E2 - E3 gaps (~ -0.45, ~ -0.44). Measurement/cross-' +
    'check only; conditional-share diagnostic, NOT an RH bound; C_mb stays GUE-conditional (imp-486); no QED.',
  method:
    'At each E2 anchor L = 1/(2 gapTarget) in {100, 1000}, evaluate the ACTUAL local exponent p(N) in ' +
    'log-N space (imp-33859 route, ln N = u + log(u-1)); form the imp-33949 shortfall s(L) = 1/(2L) - ' +
    '(1/2 - p) and the from-below deficit delta = 1/2 - L*gap_actual; linearize gap_actual(L) to get the ' +
    'crossing shift dLogT0 = s(L)/(d gap/dL); convert to decades via d ln N/d log T0 = 1 + 1/(u-1); ' +
    'compare against imp-33988 measured e3_vs_e2 (imported, not re-derived).',
  anchors: ANCHORS,
  agreement: {
    // G1: the from-below signature -- product L*gap under 1/2, climbing toward it.
    product_L_gap_1pct: ANCHORS[0].product_L_gap, // ~0.494906
    product_L_gap_0_1pct: ANCHORS[1].product_L_gap, // ~0.499499
    // G2: the reconstruction vs the measured E2 - E3 offset.
    reconstructed_offset_decades_1pct: ANCHORS[0].reconstructed_e3_vs_e2_decades, // ~ -0.456
    reconstructed_offset_decades_0_1pct: ANCHORS[1].reconstructed_e3_vs_e2_decades, // ~ -0.436
    measured_offset_decades_1pct: ANCHORS[0].measured_e3_vs_e2_decades, // ~ -0.452
    measured_offset_decades_0_1pct: ANCHORS[1].measured_e3_vs_e2_decades, // ~ -0.436
    residual_decades_1pct: ANCHORS[0].residual_decades, // <~ 0.005
    residual_decades_0_1pct: ANCHORS[1].residual_decades, // <~ 0.001
  },
  finding: {
    G1_shortfall_real_and_from_below:
      'The shortfall s(L) is positive at both anchors and the product L*gap_actual sits just under 1/2 ' +
      '(~0.4949 at L=100, ~0.4995 at L=1000), climbing toward 1/2 as L grows -- exactly the imp-33949 ' +
      'log T0 * gap -> 1/2 FROM BELOW signature. The from-below deficit shrinks ~10x (0.0051 -> 0.0005) ' +
      'as L goes 100 -> 1000.',
    G2_reconstructs_measured_e2_e3_offset:
      'The linearized crossing shift gives ~ -0.456 decades at the 1% mark and ~ -0.436 at the 0.1% ' +
      'mark, matching imp-33988 measured e3_vs_e2 offsets (-0.452, -0.436) to <~ 0.005 decades at BOTH ' +
      'landmarks. The imp-33988 attribution is confirmed independently: the E2 -> E3 offset IS the ' +
      'imp-33949 finite-log-T0 shortfall -- no new mechanism.',
    G3_offset_near_landmark_invariant:
      'The reconstructed offset is nearly the same (~ -0.45 decades) at both marks because the shortfall ' +
      'scales like s(L) ~ 1/(2 L^2): its L-decay cancels the L-growth of the 1/(gap-slope) lever, ' +
      'leaving a near-constant decade offset -- which is why imp-33988 saw essentially the same gap at ' +
      'both landmarks.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / CROSS-CHECK (frontier-direction, NOT rigorous). Recomputing the imp-33949 finite-' +
    'log-T0 shortfall INDEPENDENTLY at the two F3 anchors log T0 = 100 and 1000 -- shortfall s(L) > 0, ' +
    'product L*gap_actual just under 1/2 and climbing (0.4949 -> 0.4995), the imp-33949 from-below ' +
    'signature -- and linearizing the crossing shift reconstructs the imp-33988 measured E2 - E3 offset ' +
    'to <~ 0.005 decades at BOTH marks (reconstructed -0.456 / -0.436 vs measured -0.452 / -0.436). The ' +
    'imp-33988 attribution is confirmed: the E2 -> E3 offset IS the imp-33949 finite-log-T0 shortfall, ' +
    'no new mechanism. Descriptive cross-check on the inherited imp-3220/imp-3406 component model, NOT ' +
    'a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-33988 (E1/E2/E3 landmark recompute, measured e3_vs_e2); imp-33949 (log T0 * gap -> 1/2 from ' +
    'below); imp-33816 (F3 landmarks, gap ~ 1/(2 log T0)); imp-33859 (log-space crossing); imp-3463 ' +
    '(far-tail exponent -> 1/2 from below); imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc fixed-strip).',
};

export const IMP34046_E2_E3_OFFSET_IMP33949_SHORTFALL_CROSSCHECK_ASSERTIONS = [
  {
    // G1: imp-33949 from-below signature -- shortfall positive and product L*gap under 1/2 at both anchors.
    id: 'imp34046-shortfall-positive-product-from-below',
    description: 'shortfall s(L) > 0 and L*gap_actual < 1/2 at both F3 anchors (imp-33949 from-below signature)',
    holds: () =>
      ANCHORS.every((a) => a.shortfall_s > 0 && a.product_L_gap < HALF) &&
      ANCHORS[0].product_L_gap < ANCHORS[1].product_L_gap, // climbs toward 1/2 as L grows
  },
  {
    // G2 (1%): the reconstructed offset matches imp-33988 measured e3_vs_e2 at the 1% mark to <0.02 decades.
    id: 'imp34046-reconstructs-measured-offset-1pct',
    description: 'independent imp-33949-shortfall reconstruction matches imp-33988 measured E2-E3 offset (~ -0.45) at the 1% mark',
    holds: () => ANCHORS[0].reconstructed_e3_vs_e2_decades < 0 && ANCHORS[0].residual_decades < 0.02,
  },
  {
    // G2 (0.1%): same at the 0.1% mark to <0.02 decades.
    id: 'imp34046-reconstructs-measured-offset-0-1pct',
    description: 'independent imp-33949-shortfall reconstruction matches imp-33988 measured E2-E3 offset (~ -0.44) at the 0.1% mark',
    holds: () => ANCHORS[1].reconstructed_e3_vs_e2_decades < 0 && ANCHORS[1].residual_decades < 0.02,
  },
  {
    // Reuse gate: the anchors ARE the imp-33988 E2 landmark log T0 values 100 / 1000, and the measured
    // offsets ARE imp-33988 agreement fields (imported, not re-derived).
    id: 'imp34046-anchors-and-measured-are-imp33988',
    description: 'anchors log T0 = 100/1000 with measured offsets imported from imp-33988 agreement fields',
    holds: () =>
      ANCHORS[0].logT0_anchor === 100 &&
      ANCHORS[1].logT0_anchor === 1000 &&
      ANCHORS[0].measured_e3_vs_e2_decades === IMP33988_F3_LANDMARK_LAW_RECOMPUTE_NEWTON_CROSSCHECK.agreement.finite_logT0_offset_decades_1pct &&
      ANCHORS[1].measured_e3_vs_e2_decades === IMP33988_F3_LANDMARK_LAW_RECOMPUTE_NEWTON_CROSSCHECK.agreement.finite_logT0_offset_decades_0_1pct,
  },
  {
    // Honesty gate: measurement/cross-check only, no bound changed, imp-3066 untouched, no QED, no refereed bound is changed.
    id: 'imp34046-honesty-gate-no-qed',
    description: 'Measurement/cross-check only: not rigorous, imp-3066 K_a >= 0 untouched, no QED, no refereed bound is changed',
    holds: () =>
      IMP34046_E2_E3_OFFSET_IMP33949_SHORTFALL_CROSSCHECK.isRigorous === false &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34046_E2_E3_OFFSET_IMP33949_SHORTFALL_CROSSCHECK.verdict) &&
      /NO QED/.test(IMP34046_E2_E3_OFFSET_IMP33949_SHORTFALL_CROSSCHECK.verdict) &&
      /refereed bound is changed/i.test(IMP34046_E2_E3_OFFSET_IMP33949_SHORTFALL_CROSSCHECK.verdict),
  },
];

for (const a of IMP34046_E2_E3_OFFSET_IMP33949_SHORTFALL_CROSSCHECK_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34046-e2-e3-offset-imp33949-shortfall-crosscheck assertion failed: ${a.id}`);
  }
}
