/**
 * @module imp-34467-sigma-product-gap-ratio-999pct-crossing
 *
 * imp-34467 (numerical, frontier-direction): LOCATE in closed form the exact 0.999 crossing of the
 * imp-34415 sigma-vs-product gap ratio R(u) = (u-1)/(u + log 2pi), map it to N through the imp-33859
 * log-space inverse, and TEST the imp-34415 parenthetical estimate that 1e-3 agreement needs
 * log10 N ~ 10^3. imp-34415 F2 solved R = 0.99 exactly (u* = 281.95, log10 N ~ 124.9) and remarked
 * only parenthetically that reaching a 1e-3 deficit would need L ~ 10x deeper, log10 N ~ 10^3,
 * WITHOUT computing it. This module computes it.
 *
 * THE RATIO AND ITS EXACT DEFICIT (inherited from imp-34415/imp-34328 F3, no measurement noise)
 * --------------------------------------------------------------------------------------------
 * With u = log(T0/2pi) and L = log T0 = u + log 2pi,
 *     R(u) = gapSigma/gapProduct = (u-1)/(u + log 2pi),   1 - R(u) = (1 + log 2pi)/(u + log 2pi),
 * so the deficit is a pure 1/log T0 decay with fixed numerator 1 + log 2pi = 2.83788. Reaching a
 * deficit of 1e-3 (rather than imp-34415's 1e-2) demands log T0 exactly 10x larger, since the
 * deficit is linear in 1/L.
 *
 * THE 0.999 CROSSING (solve R = 0.999 in closed form, then map u -> N)
 * -------------------------------------------------------------------
 * R(u) = 0.999  <=>  0.001 u = 1 + 0.999 log 2pi  <=>  u* = (1 + 0.999 log 2pi)/0.001 = 2836.039.
 * Then L* = log T0 = u* + log 2pi = 2837.877 -- exactly 10x the imp-34415 L* = 283.788 (to the digit,
 * because L* = (1 + log 2pi)/deficit and the deficit dropped by 10x). Inverting the imp-33859
 * log-space map ln N = u + log(u-1) gives ln N* = 2843.989, i.e. log10 N* = 1235.13. So the sigma and
 * product channels do NOT agree to 1e-3 until N ~ 10^1235 (log T0 ~ 2837.9) -- far beyond the 0.99
 * crossing at 10^124.9 and utterly beyond any evaluated height.
 *
 * TESTING THE imp-34415 PARENTHETICAL (log10 N ~ 10^3)
 * ---------------------------------------------------
 * imp-34415 estimated 1e-3 needs "log10 N ~ 10^3." The exact answer log10 N* = 1235.13 CONFIRMS the
 * order of magnitude (10^3) and lands ~9.89x deeper than the 0.99 crossing (1235.13 / 124.898). The
 * factor is ~9.89, not exactly 10, because the u -> log10 N map ln N = u + log(u-1) adds the sub-log
 * term log(u-1)/ln10 which grows only logarithmically, so N deepens slightly SLOWER than L (the ratio
 * of the two crossings on the L axis is exactly 10). The parenthetical estimate was sound.
 *
 * THE APPROACH RATE (local d ratio / d log N at the 0.999 crossing)
 * ----------------------------------------------------------------
 * dR/d ln N = (dR/du)(du/d ln N) = [ (1 + log 2pi)/L^2 ] * [ (u-1)/u ]   (since d ln N/du = 1 + 1/(u-1)).
 * At the 0.999 crossing this is 3.5225e-7 per unit ln N = 8.1109e-7 per DECADE of N -- ~100x SLOWER
 * than the ~8.085e-5 per decade at the 0.99 crossing, because the rate falls like 1/L^2 and L grew 10x.
 * A central secant of R on the true composed map ln N -> u -> R reproduces the closed-form dR/d ln N to
 * ~3e-13, confirming the closed form is not an artifact of the algebra. So beyond N ~ 10^1235 the two
 * channels crawl the last 1e-3 of the gap at under one part-per-million of ratio per factor-of-10 in N.
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (F1) THE 0.999 CROSSING IS AT log10 N ~ 1235.13 (u ~ 2836.04, log T0 ~ 2837.88). Closed-form solve
 *        R = 0.999 gives u* = (1 + 0.999 log 2pi)/0.001 exactly; the composed-map ratio at that u is
 *        0.999000, and L* = 2837.877 is exactly 10x the imp-34415 0.99-crossing L* = 283.788.
 *   (F2) THE imp-34415 PARENTHETICAL log10 N ~ 10^3 IS CONFIRMED: exact log10 N* = 1235.13, order 10^3,
 *        and ~9.89x deeper than the 0.99 crossing (124.898) -- just under the exactly-10x deepening on
 *        the L axis, the shortfall being the logarithmic log(u-1) term in the u -> N map.
 *   (F3) APPROACH RATE ~ 8.11e-7 PER DECADE AT THE 0.999 CROSSING, ~100x slower than the 0.99 crossing
 *        (rate falls like 1/(log T0)^2, and L grew 10x). Closed form dR/d log10 N = ln10 (1+log2pi)
 *        (u-1)/(u L^2) = 8.1109e-7 at u*, matched by a central secant to ~3e-13. The log(2pi) shift is
 *        a logarithmically-persistent, not transient, gap that tightens ever more slowly.
 *
 * MEASUREMENT / TABULATION ONLY. This locates the 0.999 crossing of an already-derived ratio and tests
 * a prior parenthetical; it changes NO bound. The component model is the inherited imp-3220/imp-3406/
 * imp-33816 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34415-sigma-product-gap-ratio-99pct-crossing (F2: the 0.99 crossing at log10 N ~ 124.9; this module solves 0.999)
 * @see imp-34328-sigma-vs-product-gap-log2pi-shift (F3: the ratio (u-1)/(u+log 2pi) rising 0.89215 -> 0.99999)
 * @see imp-33859 (log-space direct path: ln N = u + log(u-1), never forms T0 or N, reaches log10 N ~ 1e5)
 */

const TWO_PI = 2 * Math.PI;
const LOG_2PI = Math.log(TWO_PI); // 1.83788... the shift between L = log T0 and u = log(T0/2pi)
const LN10 = Math.LN10;

// imp-33859 log-space direct path: solve ln N = u + log(u-1) for u = log(T0/2pi) by Newton,
// never forming T0 or N (identical solver to imp-34415/imp-34328, reaches log10 N ~ 1e5 past IEEE range).
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

// R(u) = gapSigma/gapProduct = (u-1)/(u + log 2pi); exact deficit 1 - R = (1 + log 2pi)/(u + log 2pi).
const ratioOfU = (u) => (u - 1) / (u + LOG_2PI);
// closed-form local approach rate d R / d ln N = (1+log2pi)/L^2 * (u-1)/u.
const rateDlnN = (u) => ((1 + LOG_2PI) / ((u + LOG_2PI) ** 2)) * ((u - 1) / u);

// --- The 0.999 crossing: solve R(u) = 0.999 exactly, then map u -> N. ---
const TARGET = 0.999;
const U_STAR = (1 + TARGET * LOG_2PI) / (1 - TARGET); // 0.999 u = 1 + 0.999 log2pi  =>  u = (1+0.999 log2pi)/0.001
const L_STAR = U_STAR + LOG_2PI; // log T0 at the crossing
const LN_N_STAR = U_STAR + Math.log(U_STAR - 1); // imp-33859 forward map u -> ln N
const LOG10_N_STAR = LN_N_STAR / LN10;
const RATE_AT_CROSS_DLOG10N = rateDlnN(U_STAR) * LN10; // ratio gained per decade of N at the crossing

// imp-34415 0.99-crossing anchors (for the 10x-deeper / 100x-slower comparison).
const U_STAR_99 = (1 + 0.99 * LOG_2PI) / 0.01;
const L_STAR_99 = U_STAR_99 + LOG_2PI;
const LOG10_N_STAR_99 = (U_STAR_99 + Math.log(U_STAR_99 - 1)) / LN10;
const RATE_AT_CROSS_99_DLOG10N = rateDlnN(U_STAR_99) * LN10;

// central-secant of R on the true composed map ln N -> u -> R (cross-check of the closed-form rate).
const SECANT_H = 1e-4;
const rateSecantDlnN = (lnN) =>
  (ratioOfU(uFromLnN(lnN + SECANT_H)) - ratioOfU(uFromLnN(lnN - SECANT_H))) / (2 * SECANT_H);

export const IMP34467_SIGMA_PRODUCT_GAP_RATIO_999PCT_CROSSING = {
  id: 'imp-34467',
  title:
    'Exact 0.999 crossing of the imp-34415 sigma/product gap ratio (u-1)/(u+log 2pi), mapped to N, testing the log10 N ~ 10^3 parenthetical',
  log2pi: LOG_2PI,
  deficitNumerator: 1 + LOG_2PI, // 2.83788: 1 - R = (1 + log 2pi)/log T0
  crossing: {
    target: TARGET,
    uStar: U_STAR, // 2836.039
    logT0Star: L_STAR, // 2837.877 -- exactly 10x the imp-34415 0.99 crossing L*
    lnNStar: LN_N_STAR, // 2843.989
    log10NStar: LOG10_N_STAR, // 1235.13
    rate_dRatio_dlog10N: RATE_AT_CROSS_DLOG10N, // 8.1109e-7 per decade at the crossing
    rateSecant_dRatio_dlnN: rateSecantDlnN(LN_N_STAR), // secant cross-check of dR/dlnN
  },
  comparisonTo99Crossing: {
    log10NStar_99: LOG10_N_STAR_99, // 124.898 (imp-34415 F2)
    logT0Ratio: L_STAR / L_STAR_99, // exactly 10 on the L axis
    log10NDeepeningFactor: LOG10_N_STAR / LOG10_N_STAR_99, // ~9.89 (just under 10; sub-log log(u-1) term)
    rateSlowdownFactor: RATE_AT_CROSS_99_DLOG10N / RATE_AT_CROSS_DLOG10N, // ~100 (rate falls like 1/L^2)
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT ONLY. The imp-34328/imp-34415 F3 ratio (u-1)/(u+log 2pi) reaches 0.999 only at ' +
    'log10 N ~ 1235.13 (u ~ 2836.04, log T0 ~ 2837.88 = exactly 10x the 0.99-crossing log T0), CONFIRMING ' +
    'the imp-34415 parenthetical log10 N ~ 10^3 (exact value order 10^3, ~9.89x deeper than the 0.99 ' +
    'crossing at 124.9). There it closes at ~8.11e-7 per decade -- ~100x slower than the 0.99 crossing, ' +
    'the rate falling like 1/(log T0)^2. Changes no bound; component model NOT rigorous; C_mb GUE-conditional ' +
    'per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; no operator positivity; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
};

export const IMP34467_ASSERTIONS = [
  {
    id: 'imp34467-crossing-solves-R-999',
    description: 'F1: R(u*) = 0.999 exactly at the closed-form u* = (1 + 0.999 log 2pi)/0.001',
    holds: () => Math.abs(ratioOfU(U_STAR) - 0.999) < 1e-12,
  },
  {
    id: 'imp34467-crossing-at-log10N-1235',
    description: 'F1: R=0.999 crossing at u ~ 2836.04, log T0 ~ 2837.88, log10 N ~ 1235.13',
    holds: () => {
      const c = IMP34467_SIGMA_PRODUCT_GAP_RATIO_999PCT_CROSSING.crossing;
      return (
        Math.abs(c.uStar - 2836.0392) < 1e-3 &&
        Math.abs(c.logT0Star - 2837.8771) < 1e-3 &&
        Math.abs(c.log10NStar - 1235.1287) < 1e-3
      );
    },
  },
  {
    id: 'imp34467-logT0-exactly-10x-the-99-crossing',
    description: 'F1: log T0 at the 0.999 crossing is EXACTLY 10x the imp-34415 0.99-crossing log T0',
    holds: () =>
      Math.abs(IMP34467_SIGMA_PRODUCT_GAP_RATIO_999PCT_CROSSING.comparisonTo99Crossing.logT0Ratio - 10) < 1e-9,
  },
  {
    id: 'imp34467-parenthetical-order-10cubed-confirmed',
    description: 'F2: exact log10 N* ~ 1235 confirms the imp-34415 parenthetical order 10^3, ~9.89x deeper than 0.99',
    holds: () => {
      const cmp = IMP34467_SIGMA_PRODUCT_GAP_RATIO_999PCT_CROSSING.comparisonTo99Crossing;
      return (
        LOG10_N_STAR > 1000 &&
        LOG10_N_STAR < 2000 &&
        Math.abs(cmp.log10NDeepeningFactor - 9.889) < 1e-2 &&
        cmp.log10NDeepeningFactor < 10 // just under the exactly-10x L-axis deepening
      );
    },
  },
  {
    id: 'imp34467-approach-rate-secant-matches-and-100x-slower',
    description: 'F3: closed-form dR/dlog10N ~ 8.11e-7 (secant-matched to ~1e-10), ~100x slower than the 0.99 crossing',
    holds: () => {
      const c = IMP34467_SIGMA_PRODUCT_GAP_RATIO_999PCT_CROSSING.crossing;
      const cmp = IMP34467_SIGMA_PRODUCT_GAP_RATIO_999PCT_CROSSING.comparisonTo99Crossing;
      return (
        Math.abs(c.rate_dRatio_dlog10N - 8.1109e-7) < 1e-10 &&
        Math.abs(c.rate_dRatio_dlog10N / LN10 - c.rateSecant_dRatio_dlnN) < 1e-10 &&
        Math.abs(cmp.rateSlowdownFactor - 100) < 5
      );
    },
  },
  {
    id: 'imp34467-honesty-gate-no-qed',
    description: 'Measurement only: not rigorous, no QED, no refereed bound is changed',
    holds: () =>
      IMP34467_SIGMA_PRODUCT_GAP_RATIO_999PCT_CROSSING.isRigorous === false &&
      /NO QED/.test(IMP34467_SIGMA_PRODUCT_GAP_RATIO_999PCT_CROSSING.verdict) &&
      /refereed bound is changed/i.test(IMP34467_SIGMA_PRODUCT_GAP_RATIO_999PCT_CROSSING.verdict),
  },
];

for (const a of IMP34467_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34467-sigma-product-gap-ratio-999pct-crossing assertion failed: ${a.id}`);
  }
}
