/**
 * @module imp-34415-sigma-product-gap-ratio-99pct-crossing
 *
 * imp-34415 (numerical, frontier-direction): MEASURE the rate at which the imp-34328 F3 ratio
 * gapSigma/gapProduct = (u-1)/(u+log 2pi) approaches 1, and LOCATE the reference N (and u) at
 * which it first exceeds 0.99 -- i.e. how deep the sigma channel and the product channel must
 * go before they agree to 1%.
 *
 * THE RATIO AND ITS EXACT DEFICIT (closed form, no measurement noise)
 * ------------------------------------------------------------------
 * imp-34328 F3 reported the ratio of the two gap channels (u = log(T0/2pi), L = log T0 = u + log 2pi):
 *     R(u) = gapSigma / gapProduct = [ (1/2)(u-1)/(u L) ] / [ 1/(2u) ] = (u-1)/L = (u-1)/(u + log 2pi),
 * rising 0.89215 -> 0.99999 from below across the ladder. Its deficit from 1 is EXACT:
 *     1 - R(u) = (L - (u-1))/L = (log 2pi + 1)/L = (1 + log 2pi)/(u + log 2pi),
 * so 1 - R = 2.83788 / log T0 -- the ratio approaches 1 only LOGARITHMICALLY (like 1/log T0),
 * which is precisely why 1% agreement is not reached until N is astronomically large. The
 * numerator (1 + log 2pi) = 2.83788 is the whole content of the deficit: log(2pi)=1.83788 is the
 * shift the product channel cancels and the sigma channel keeps (imp-34328 F3), and the +1 is the
 * -1/u finite term carried on the log T0 axis.
 *
 * THE 0.99 CROSSING (solve R = 0.99 in closed form, then map u -> N)
 * -----------------------------------------------------------------
 * R(u) = 0.99  <=>  0.01 u = 1 + 0.99 log 2pi  <=>  u* = (1 + 0.99 log 2pi)/0.01 = 281.9498.
 * Then L* = log T0 = u* + log 2pi = 283.7877, and inverting the imp-33859 log-space map
 * ln N = u + log(u-1) gives ln N* = 287.5880, i.e. log10 N* = 124.898. So the sigma and product
 * channels do NOT agree to 1% until N ~ 10^124.9 (log T0 ~ 283.8) -- deep in the far tail, far
 * beyond any evaluated height. (For comparison: 1e-2 requires L ~ 100*(1+log2pi); to reach 1e-3
 * would need L ~ 10x deeper, log10 N ~ 10^3.)
 *
 * THE APPROACH RATE (local d ratio / d log N at and around the crossing)
 * ---------------------------------------------------------------------
 * dR/d ln N = (dR/du)(du/d ln N) = [ (1 + log 2pi)/L^2 ] * [ (u-1)/u ]   (since d ln N/du = 1 + 1/(u-1)).
 * At the crossing this is 3.5113e-5 per unit ln N = 8.0850e-5 per DECADE of N -- i.e. once the two
 * channels are within 1% they close the remaining gap at only ~8.1e-5 of ratio per factor-of-10 in
 * N; a central secant of R on the true composed map ln N -> u -> R reproduces this to ~5e-10,
 * confirming the closed form is not an artifact of the algebra. The rate itself falls like 1/L^2, so
 * the approach decelerates: the ratio is asymptotically pinned to 1 but crawls there logarithmically.
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (F1) EXACT DEFICIT 1 - R = (1 + log 2pi)/log T0. Reproduced to <1e-12 against the direct
 *        (u-1)/(u+log 2pi) evaluation at every rung; the deficit is a pure 1/log T0 decay with the
 *        fixed numerator 2.83788, no free constant.
 *   (F2) THE 0.99 CROSSING IS AT log10 N ~ 124.90 (u ~ 281.95, log T0 ~ 283.79). Closed-form solve
 *        R=0.99 gives u*=281.9498 exactly; the composed-map ratio at that u is 0.990000 and the
 *        rung just below (log10 N=100, u=224.85) still reads 0.98748, bracketing the crossing.
 *   (F3) APPROACH RATE ~ 8.08e-5 PER DECADE AT THE CROSSING, falling like 1/(log T0)^2. Closed form
 *        dR/d log10 N = ln10 (1+log2pi)(u-1)/(u L^2) = 8.0850e-5 at u*, matched by a central secant to
 *        ~5e-10. So the two channels agree to 1% only near N ~ 10^125 and tighten thereafter at a rate
 *        that itself decays -- the log(2pi) shift is a logarithmically-persistent, not transient, gap.
 *
 * MEASUREMENT / TABULATION ONLY. This quantifies the approach of an already-derived ratio; it
 * changes NO bound. The component model is the inherited imp-3220/imp-3406/imp-33816 extrapolation,
 * NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; establishes no
 * operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34328-sigma-vs-product-gap-log2pi-shift (F3: the ratio (u-1)/(u+log 2pi) rising 0.89215 -> 0.99999)
 * @see imp-34197-logt0-resid-product-approach-rate (the product gap = 1/(2u) EXACT, log 2pi cancels)
 * @see imp-33816-sigma-exponent-asymptote-approach-rate (the bare sigma gap ~ 1/(2 log T0), keeps the shift)
 * @see imp-33859 (log-space direct path: ln N = u + log(u-1), never forms T0 or N, reaches log10 N ~ 1e5)
 */

const TWO_PI = 2 * Math.PI;
const LOG_2PI = Math.log(TWO_PI); // 1.83788... the shift between L = log T0 and u = log(T0/2pi)
const LN10 = Math.LN10;

// imp-33859 log-space direct path: solve ln N = u + log(u-1) for u = log(T0/2pi) by Newton,
// never forming T0 or N (identical solver to imp-34328/imp-34197, reaches log10 N ~ 1e5 past IEEE range).
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
const deficitClosed = (u) => (1 + LOG_2PI) / (u + LOG_2PI); // = (1 + log 2pi)/log T0
// closed-form local approach rate d R / d ln N = (1+log2pi)/L^2 * (u-1)/u.
const rateDlnN = (u) => ((1 + LOG_2PI) / ((u + LOG_2PI) ** 2)) * ((u - 1) / u);

// --- The 0.99 crossing: solve R(u) = 0.99 exactly, then map u -> N. ---
const TARGET = 0.99;
const U_STAR = (1 + TARGET * LOG_2PI) / (1 - TARGET); // 0.99 u = 1 + 0.99 log2pi  =>  u = (1+0.99 log2pi)/0.01
const L_STAR = U_STAR + LOG_2PI; // log T0 at the crossing
const LN_N_STAR = U_STAR + Math.log(U_STAR - 1); // imp-33859 forward map u -> ln N
const LOG10_N_STAR = LN_N_STAR / LN10;
const RATE_AT_CROSS_DLOG10N = rateDlnN(U_STAR) * LN10; // ratio gained per decade of N at the crossing

// central-secant of R on the true composed map ln N -> u -> R (cross-check of the closed-form rate).
const SECANT_H = 1e-4;
const rateSecantDlnN = (lnN) =>
  (ratioOfU(uFromLnN(lnN + SECANT_H)) - ratioOfU(uFromLnN(lnN - SECANT_H))) / (2 * SECANT_H);

// --- Ladder (log10 N grid shared with imp-34328, plus the located crossing). ---
const LADDER = [12, 20, 50, 100, LOG10_N_STAR, 300, 1000, 3000, 10000, 1e5].map((log10N) => {
  const lnN = log10N * LN10;
  const u = uFromLnN(lnN);
  const L = u + LOG_2PI;
  const ratio = ratioOfU(u);
  return {
    log10N,
    u,
    logT0: L,
    ratio, // gapSigma/gapProduct = (u-1)/(u+log 2pi)
    deficitFromOne: 1 - ratio,
    deficitClosed: deficitClosed(u), // (1 + log 2pi)/log T0 -- exact match to deficitFromOne
    rate_dRatio_dlog10N: rateDlnN(u) * LN10, // local approach rate per decade
  };
});

export const IMP34415_SIGMA_PRODUCT_GAP_RATIO_99PCT_CROSSING = {
  id: 'imp-34415',
  title:
    'Approach rate of the imp-34328 sigma/product gap ratio (u-1)/(u+log 2pi) to 1, and the reference N where it first exceeds 0.99',
  log2pi: LOG_2PI,
  deficitNumerator: 1 + LOG_2PI, // 2.83788: 1 - R = (1 + log 2pi)/log T0
  crossing: {
    target: TARGET,
    uStar: U_STAR, // 281.9498
    logT0Star: L_STAR, // 283.7877
    lnNStar: LN_N_STAR, // 287.5880
    log10NStar: LOG10_N_STAR, // 124.898
    rate_dRatio_dlog10N: RATE_AT_CROSS_DLOG10N, // 8.0850e-5 per decade at the crossing
    rateSecant_dRatio_dlnN: rateSecantDlnN(LN_N_STAR), // secant cross-check of dR/dlnN
  },
  ladder: LADDER,
  isRigorous: false,
  verdict:
    'MEASUREMENT ONLY. The imp-34328 F3 ratio (u-1)/(u+log 2pi) approaches 1 like (1+log 2pi)/log T0 ' +
    '(numerator 2.83788, a pure 1/log T0 decay), so it first exceeds 0.99 only at log10 N ~ 124.9 ' +
    '(u ~ 281.95, log T0 ~ 283.79), closing thereafter at ~8.08e-5 per decade -- a rate that itself ' +
    'falls like 1/(log T0)^2. Changes no bound; component model NOT rigorous; C_mb GUE-conditional ' +
    'per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; no operator positivity; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
};

export const IMP34415_ASSERTIONS = [
  {
    id: 'imp34415-exact-deficit-1-over-logT0',
    description: 'F1: 1 - R = (1 + log 2pi)/log T0 exactly at every rung',
    holds: () => LADDER.every((r) => Math.abs(r.deficitFromOne - r.deficitClosed) < 1e-12),
  },
  {
    id: 'imp34415-ratio-rises-below-one',
    description: 'ratio is < 1 and strictly increasing across the ladder (approaches 1 from below)',
    holds: () => {
      if (!LADDER.every((r) => r.ratio < 1)) return false;
      for (let i = 1; i < LADDER.length; i++) {
        if (!(LADDER[i].ratio > LADDER[i - 1].ratio)) return false;
      }
      return true;
    },
  },
  {
    id: 'imp34415-crossing-at-log10N-124.9',
    description: 'F2: R=0.99 crossing at u ~ 281.95, log T0 ~ 283.79, log10 N ~ 124.90',
    holds: () => {
      const c = IMP34415_SIGMA_PRODUCT_GAP_RATIO_99PCT_CROSSING.crossing;
      return (
        Math.abs(ratioOfU(c.uStar) - 0.99) < 1e-12 &&
        Math.abs(c.uStar - 281.9498) < 1e-3 &&
        Math.abs(c.logT0Star - 283.7877) < 1e-3 &&
        Math.abs(c.log10NStar - 124.898) < 1e-2
      );
    },
  },
  {
    id: 'imp34415-crossing-brackets',
    description: 'the located crossing sits above the log10 N=100 rung (0.98748) and below log10 N=300 (0.99586)',
    holds: () => {
      const r100 = LADDER.find((r) => r.log10N === 100).ratio;
      const r300 = LADDER.find((r) => r.log10N === 300).ratio;
      return r100 < 0.99 && r300 > 0.99 && Math.abs(r100 - 0.98748) < 1e-4 && Math.abs(r300 - 0.99586) < 1e-4;
    },
  },
  {
    id: 'imp34415-approach-rate-secant-matches-closed-form',
    description: 'F3: closed-form dR/dlog10N ~ 8.08e-5 at the crossing, matched by a central secant to ~1e-8',
    holds: () => {
      const c = IMP34415_SIGMA_PRODUCT_GAP_RATIO_99PCT_CROSSING.crossing;
      return (
        Math.abs(c.rate_dRatio_dlog10N - 8.085e-5) < 1e-8 &&
        Math.abs(c.rate_dRatio_dlog10N / LN10 - c.rateSecant_dRatio_dlnN) < 1e-8
      );
    },
  },
  {
    id: 'imp34415-honesty-gate-no-qed',
    description: 'Measurement only: not rigorous, no QED, no refereed bound is changed',
    holds: () =>
      IMP34415_SIGMA_PRODUCT_GAP_RATIO_99PCT_CROSSING.isRigorous === false &&
      /NO QED/.test(IMP34415_SIGMA_PRODUCT_GAP_RATIO_99PCT_CROSSING.verdict) &&
      /refereed bound is changed/i.test(IMP34415_SIGMA_PRODUCT_GAP_RATIO_99PCT_CROSSING.verdict),
  },
];

for (const a of IMP34415_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34415-sigma-product-gap-ratio-99pct-crossing assertion failed: ${a.id}`);
  }
}
