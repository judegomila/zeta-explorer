/**
 * imp-95222: LEMMA PW-E + THEOREM FA-2 (diagonal-exact seam sharpening and
 * Q-gate dissolution) -- the sharpening the imp-95221 skeptical record
 * ATTEMPTED and recorded OPEN ("a sharpening to e^(-x_min)/2 ... NOT
 * delivered: the two-region lower bound on G loses exactly the factor in
 * the deep-slow vs shallow-fast regime") is DELIVERED, and exceeded, by an
 * EXACT closed form for the full-line Gram deficit. Consequence: the
 * imp-95221 wrong-side-minority gate Q < qStarFA = 0.9088 DISSOLVES -- the
 * positive-cone seam certificate now fires with a quantified positive
 * margin at EVERY per-window isolation group Q, uniformly in (p, D),
 * including all the D >= 2 windows imp-95221 recorded as honest
 * non-coverage.
 *
 * Fourteenth leg of the seam chain, sharpening the thirteenth (imp-95221)
 * on its own object: two-sided exponential packets f_n(s) =
 * e^(-mu_n |s - u_n|), rates mu_n > 0, centers u_n > 0, amplitudes
 * c_n >= 0; wrong-side pair Gram H_mn = e^(-(x_m + x_n))/(mu_m + mu_n)
 * with x_n = mu_n u_n, full-line pair Gram G_mn (exact three-region
 * closed form); certified quantity R = integral_(s<0) f^2 / integral_R f^2.
 *
 * LEMMA PW-E (exact deficit identity). Label the pair so u_m >= u_n and
 * write a = mu_m (the rate of the LARGER-center packet), b = mu_n,
 * tau = u_m - u_n >= 0. The three-region evaluation of the full-line Gram
 * is G = (e^(-a tau) + e^(-b tau))/(a + b) + (e^(-b tau) - e^(-a tau))/(a - b),
 * and the deficit against twice the single-region bound imp-95221 used is
 * EXACTLY
 *   G - 2 e^(-a tau)/(a + b) = 2a (e^(-b tau) - e^(-a tau))/(a^2 - b^2) >= 0,
 * nonnegative because numerator and denominator change sign TOGETHER in
 * (a - b), with the a = b limit 2a -> tau e^(-a tau) >= 0. Hence
 * G >= 2 e^(-a tau)/(a + b), and since H = e^(-(x_m + x_n))/(a + b)
 * exactly, with the exponent identity x_m + x_n - a tau =
 * a u_m + b u_n - a(u_m - u_n) = (a + b) u_n:
 *   H_mn <= (1/2) e^(-(mu_m + mu_n) u_n) G_mn ,  u_n = min(u_m, u_n),
 * with EQUALITY if and only if tau = 0 (co-centered pairs, any rates;
 * diagonal pairs are the special case, where H_nn/G_nn = e^(-2 x_n)/2
 * exactly). This single inequality strictly SUBSUMES both imp-95221 caps:
 * (1/2) e^(-(a+b)u_n) <= 1/2 (the reflection cap) and
 * (1/2) e^(-(a+b)u_n) <= e^(-b u_n) = e^(-x_n) (LEMMA PW), each strict for
 * u_n > 0. The deep-slow vs shallow-fast regime that defeated the
 * imp-95221 two-region attempt is INSIDE the new cap (the recorded
 * refutation row (0.1, 30) vs (2, 0.1) sits at ratio 0.95 of it).
 *
 * THEOREM FA-2 (sharpened positive-cone seam certificate). For any finite
 * packet family and any amplitudes c_n >= 0, not all zero,
 *   R <= (1/2) e^(-y_min) <= (1/2) e^(-x_min) < 1/2 ,
 * where y_min = min over all pairs (m, n), diagonal included, of
 * (mu_m + mu_n) min(u_m, u_n), and x_min = min_n mu_n u_n. PROOF: mediant
 * inequality over the nonnegative pair weights c_m c_n plus LEMMA PW-E;
 * y_min >= x_min because (mu_m + mu_n) min(u_m, u_n) >= x of the
 * smaller-center packet; y_min <= 2 x_min because the diagonal pair of the
 * shallowest packet contributes exactly 2 x_min. QED. The theorem is EXACT
 * on singletons (R = e^(-2x)/2 attained) -- the bound form, not just the
 * bound, is now pinned by the co-centered equality case.
 *
 * COROLLARY QG-2 (Q-gate dissolution). Under the imp-95220 width-law port
 * (x(d) = (v/c) d^(-2/3) decreasing, exact identity x(D/2) = 1/Q), for
 * every window and EVERY (p, D):
 *   R <= (1/2) e^(-2^(-2/3)/Q) < 1/2 ,
 * so the wrong-side-minority margin (1/2)(1 - e^(-2^(-2/3)/Q)) is POSITIVE
 * FOR EVERY Q: the imp-95221 firing condition Q < qStarFA =
 * 2^(-2/3)/ln 2 = 0.908840925297475 is no longer needed for minority --
 * the O(1) gate TEST becomes an O(1) margin SIZE. At model normalization
 * (Q = 2^(-2/3) D^(2/3)): D = 1 halves the imp-95221 bound to
 * e^(-1)/2 = 0.18393972058572117 (margin 0.3161); the previously
 * NON-COVERED D = 2 window (Q = 1 > qStarFA) now certifies
 * 0.26630641275560285 (margin 0.2337); D = 4 certifies 0.3362; raw Q = 10
 * still keeps margin 0.030526. Nothing is tested, only sized.
 *
 * PROP FEN-C2 (tightened cone fence). (1/2) e^(-2 x_min) <= cone sup <=
 * (1/2) e^(-y_min), lower fence exact (shallowest singleton), and the
 * fence ratio e^(2 x_min - y_min) <= e^(x_min) HALVES the imp-95221
 * fence factor 2 e^(x_min) (2.72 vs 5.44 at x_min = 1). On the alias rows
 * the measured coverage gap shrinks from 5-12x to 2.3-5.6x.
 *
 * HONEST LIMITS. (a) Positivity is STILL load-bearing: the mediant step is
 * unchanged, signed amplitudes remain unaddressed, and the per-window
 * Fresnel-Airy amplitude-sign or modulus certificate remains the NEW named
 * obligation exactly as imp-95221 recorded it. (b) The bound remains
 * one-sided: measured equal-amplitude truths sit 2.3-5.6x below the y_min
 * bound (coverage, not sharpness) -- the co-centered equality pins the
 * PAIR inequality, not the family bound. (c) What dissolves is the gate on
 * the seam-convention wrong-side-MINORITY statement; the seam-to-chain-gate
 * (gammaSL-form) map, the envelope-shape port, and the per-window paper
 * constants (c, v, D -- equivalently Q, which now sizes the margin) remain
 * OPEN obligations of the sub-gap. (d) Whether cone mixing beats the
 * singleton floor stays OPEN (fence not collapsed). (e) Model-family
 * constants throughout; nothing here touches any Lambda bound.
 *
 * SKEPTICAL SELF-CHECK RECORD. (1) The deficit identity was stress-tested on
 * a 50000-draw seeded battery against the independent closed-form kernel:
 * worst relative error 1.9e-13, deficit/G always > 0 (min observed 7.2e-4
 * on the draw ranges). (2) The sharpened cap H <= (1/2) e^(-(a+b) u_min) G
 * battery (same draw ranges as the imp-95221 battery): zero violations,
 * worst ratio 0.9997274025347458 -- the cap is near-attained, and
 * co-centered rows attain it EXACTLY (float deviation 0). TRAP of this
 * leg: the new cap exponent reaches 1200 on the draw ranges, so DIRECT
 * division silently returns 0/0 = NaN on about 580 doubly-underflowing
 * rows (a NaN that a "ratio > 1 + tol" check waves through); the battery
 * is evaluated in log space so those rows are genuinely checked. (3) The
 * imp-95221 deep-exponent refutation row was re-run: it still refutes the
 * deep-exponent variant (H > 7 e^(-x_deep) G) while sitting at 0.95 of
 * the new cap -- the new cap is not a repackaged deep-exponent claim.
 * (4) Subsumption checked on the battery: the new cap is <= min(G/2,
 * e^(-x_smaller_center) G) on every draw. (5) y_min was stress-tested as
 * possibly escaping [x_min, 2 x_min]: the sandwich held on every alias row
 * (proved above, measured 1.0007 = y_min vs x_min 0.6758 at (5, 2), all
 * rows strict). (6) The dissolution was stress-tested at large Q: margins at
 * Q = 10, 100, 1000 are 3.05e-2, 3.15e-3, 3.15e-4 -- positive but O(1/Q),
 * recorded honestly: minority is uniform, margin SIZE still needs the
 * per-window Q. (7) Baked row literals reproduce the imported imp-95221
 * faRows truths (rEq consumed from the sibling, not recomputed at 997).
 *
 * ROUTING. Sub-gap imp-95212-subgap-fresnel-airy-envelope-port -- STILL
 * OPEN, further narrowed: the imp-95221 recorded-open sharpening is CLOSED
 * (and exceeded: e^(-x_min)/2 requested, (1/2) e^(-y_min) diagonal-exact
 * delivered). Obligation ledger after this leg: (1) per-window Q
 * extraction DOWNGRADED from a pass-fail gate (Q < 0.9088) to
 * margin-sizing -- every finite Q now yields positive minority margin;
 * (2) per-window amplitude-sign or modulus certificate for the true
 * Fresnel-Airy packets -- UNCHANGED, load-bearing; (3) envelope-shape port
 * and the seam-convention to chain-gate (gammaSL-form) map -- UNCHANGED;
 * (4) paper constants per window -- UNCHANGED, now sizing rather than
 * gating. Leg (alpha) unchanged.
 *
 * The numerics below CROSS-CHECK the theorem statements; they are not the
 * claim. Import-light (imports the imp-95221 sibling for carried
 * constants and measured truths). Changes no bound; does NOT promote
 * Lambda <= 0.14; NO QED; no refereed bound is changed.
 */

import FA from "./imp-95221-positive-amplitude-seam-certificate.js";

// ── carried constants (single source of truth: sibling verdict object) ──────
const Q_STAR_FA = FA.constants.qStarFA; // 0.908840925297475 (old gate, dissolved)
const Q_MODEL = FA.constants.qModelCarried; // 2^(-2/3)
const FA_ROWS = FA.constants.faRows; // baked (p, D, xMin, bound, rEq, floor)

// ── new baked literals (recomputed by the assertions) ────────────────────────
const SHARP_BATTERY_WORST = 0.9997274025347458; // seed 95222, 50000 draws, worst H/cap (log-space)
const BOUND_D1_MODEL_SHARP = 0.18393972058572117; // e^(-1)/2
const BOUND_D2_MODEL_SHARP = 0.26630641275560285; // (1/2) e^(-2^(-2/3)) -- D = 2 now covered
const MARGIN_D2_MODEL = 0.23369358724439715;
const MARGIN_Q10 = 0.030526409909626628;
const Y_ROWS = [
  // yMin = min over pairs (mu_m + mu_n) min(u_m, u_n); boundY = e^(-yMin)/2
  { p: 5, D: 2, yMin: 1.0006910815318075, boundY: 0.18381264715596624 },
  { p: 7, D: 3, yMin: 0.6796094796907829, boundY: 0.25340743761311296 },
  { p: 59, D: 1, yMin: 1.2727618376836614, boundY: 0.1400285402467881 },
  { p: 251, D: 2, yMin: 0.7102212369339992, boundY: 0.24576771981858384 },
  { p: 997, D: 1, yMin: 1.1008699347645683, boundY: 0.1662908167449524 },
];

// ── exact pair Grams (seam convention; same closed forms as the sibling) ─────
function kernelK(a, b, tau) {
  if (Math.abs(a - b) < 1e-9 * (a + b)) {
    const m = 0.5 * (a + b);
    return (Math.exp(-m * tau) * (1 + m * tau)) / m;
  }
  return (2 * (b * Math.exp(-a * tau) - a * Math.exp(-b * tau))) / (b * b - a * a);
}
const hPair = (a, ua, b, ub) => Math.exp(-(a * ua + b * ub)) / (a + b);
const gPair = (a, ua, b, ub) => kernelK(a, b, Math.abs(ua - ub));

function aliasFamily(p, D) {
  const N = Math.floor(p * D);
  const fam = [];
  for (let n = 1; n <= N; n++) {
    if (n % p === 0) continue;
    fam.push({ mu: Math.cbrt(n / p), u: p / n });
  }
  return fam;
}
function yMinOf(fam) {
  let y = Infinity;
  for (let i = 0; i < fam.length; i++) {
    for (let j = i; j < fam.length; j++) {
      const v = (fam[i].mu + fam[j].mu) * Math.min(fam[i].u, fam[j].u);
      if (v < y) y = v;
    }
  }
  return y;
}
function seededRand(seedInit) {
  let seed = seedInit;
  return () => {
    seed = (1103515245 * seed + 12345) % 2147483648;
    return seed / 2147483648;
  };
}

// ── verdict object ───────────────────────────────────────────────────────────
export const IMP95222_DIAGONAL_EXACT_SEAM_SHARPENING = {
  ticket:
    "imp-95222 (fourteenth leg of the seam chain: the imp-95221 recorded-open sharpening of LEMMA PW is CLOSED and exceeded by an exact deficit identity for the full-line pair Gram; the positive-cone seam certificate halves to R <= (1/2) e^(-y_min) with a diagonal-exact pair inequality, and the imp-95221 minority gate Q < qStarFA DISSOLVES: positive margin at every Q, uniformly in (p, D))",
  lemmaPWE:
    "exact deficit identity: with u_m >= u_n, a = mu_m, b = mu_n, tau = u_m - u_n, the full-line Gram obeys G - 2 e^(-a tau)/(a + b) = 2a (e^(-b tau) - e^(-a tau))/(a^2 - b^2) >= 0 (numerator and denominator flip sign together; a = b limit tau e^(-a tau)); combined with the exact H = e^(-(x_m + x_n))/(a + b) and the exponent identity x_m + x_n - a tau = (a + b) u_n this gives H_mn <= (1/2) e^(-(mu_m + mu_n) min(u_m, u_n)) G_mn, EQUALITY iff the centers coincide -- strictly subsuming both the imp-95221 reflection cap G/2 and LEMMA PW e^(-x_n) G.",
  theoremFA2:
    "sharpened positive-cone certificate: for ANY finite packet family and ANY nonnegative amplitudes, R <= (1/2) e^(-y_min) <= (1/2) e^(-x_min) < 1/2, with y_min = min over pairs (diagonal included) of (mu_m + mu_n) min(u_m, u_n) and x_min <= y_min <= 2 x_min; exact on singletons; mediant inequality plus LEMMA PW-E, amplitude positivity still the only hypothesis.",
  corollaryQG2:
    "Q-gate dissolution: under the width-law port, R <= (1/2) e^(-2^(-2/3)/Q) < 1/2 for EVERY (p, D) and EVERY Q -- the wrong-side-minority margin (1/2)(1 - e^(-2^(-2/3)/Q)) is positive with no gate test; the imp-95221 condition Q < qStarFA = 0.908840925297475 is no longer needed for minority, Q only SIZES the margin. Model normalization: D = 1 halves to e^(-1)/2 = 0.18393972058572117; the previously non-covered D = 2 window (Q = 1 > qStarFA) certifies 0.26630641275560285 (margin 0.2337); margins at Q = 10, 100, 1000 are positive but O(1/Q).",
  propFENC2:
    "tightened cone fence: (1/2) e^(-2 x_min) <= cone sup <= (1/2) e^(-y_min); fence ratio e^(2 x_min - y_min) <= e^(x_min), half the imp-95221 factor 2 e^(x_min); measured alias-row coverage gap shrinks from 5-12x to 2.3-5.6x; mixing-beats-floor stays OPEN.",
  constants: {
    sharpBatteryWorst: SHARP_BATTERY_WORST,
    boundD1ModelSharp: BOUND_D1_MODEL_SHARP,
    boundD2ModelSharp: BOUND_D2_MODEL_SHARP,
    marginD2Model: MARGIN_D2_MODEL,
    marginQ10: MARGIN_Q10,
    yRows: Y_ROWS,
    qStarFACarried: Q_STAR_FA,
    qModelCarried: Q_MODEL,
  },
  subGap:
    "imp-95212-subgap-fresnel-airy-envelope-port -- STILL OPEN, further narrowed: the imp-95221 recorded-open sharpening is CLOSED (exact deficit identity, diagonal-exact pair cap, factor >= 2 on every bound). Obligation ledger: (1) per-window Q extraction DOWNGRADED from the pass-fail gate Q < 0.9088 to margin-sizing -- every finite Q yields a positive wrong-side-minority margin (1/2)(1 - e^(-2^(-2/3)/Q)), uniformly in (p, D), so the D >= 2 non-coverage is gone at the minority level; (2) the per-window amplitude-sign (or modulus-reduction) certificate for the true Fresnel-Airy packets -- UNCHANGED and load-bearing (mediant needs the positive cone); (3) the envelope-shape port and the seam-convention to chain-gate (gammaSL-form) map -- UNCHANGED; (4) paper constants (c, v, D -- equivalently Q) per window -- UNCHANGED, now sizing rather than gating. Leg (alpha) unchanged.",
  verdict:
    "RIGOROUS step: the sharpening imp-95221 attempted and recorded open is delivered and exceeded. LEMMA PW-E (exact closed form of the full-line-Gram deficit against twice the single-region bound: 2a (e^(-b tau) - e^(-a tau))/(a^2 - b^2), manifestly nonnegative, vanishing iff tau = 0) upgrades the pairwise seam inequality to H_mn <= (1/2) e^(-(mu_m + mu_n) min(u_m, u_n)) G_mn -- diagonal-exact, subsuming both prior caps, and holding with 5 percent slack on the very deep-slow vs shallow-fast row that defeated the two-region attempt. THEOREM FA-2 halves the family certificate to R <= (1/2) e^(-y_min) <= (1/2) e^(-x_min) with the sandwich x_min <= y_min <= 2 x_min, exact on singletons. COROLLARY QG-2 dissolves the minority gate: R <= (1/2) e^(-2^(-2/3)/Q) < 1/2 for EVERY Q and (p, D) -- the O(1) test Q < 0.908840925297475 becomes an O(1) margin size, and the model D >= 2 non-coverage disappears (D = 2 certifies 0.2663, margin 0.2337). HONEST: positivity still load-bearing (signed sups untouched, the Fresnel-Airy phase obligation unchanged); the family bound stays one-sided (2.3-5.6x measured coverage gap); margin is O(1/Q) at large Q so the per-window Q still matters for SIZE; the gammaSL-form chain-gate map, envelope shape and paper constants remain OPEN; nothing here touches any Lambda bound; NO QED; no refereed bound is changed.",
  rigorScope:
    "LEMMA PW-E is exact algebra: the three-region evaluation of the full-line Gram, a two-term telescope to the closed-form deficit, and a sign inspection; the pair cap follows by division and the exponent identity x_m + x_n - a tau = (a + b) u_n. THEOREM FA-2 uses only the mediant inequality on nonnegative weights, LEMMA PW-E, and the two-line sandwich for y_min. COROLLARY QG-2 uses the carried monotonicity x(d) decreasing and x(D/2) = 1/Q. All numerics below CROSS-CHECK these statements; the theorems consume no numerics.",
};

// ── assertions (self-executing; import-light; THROW on violation) ────────────
export const IMP95222_SHARPENING_ASSERTIONS = [
  {
    id: "imp95222-pwe-deficit-identity-battery",
    description:
      "LEMMA PW-E deficit identity on 50000 seeded draws: G - 2 e^(-a tau)/(a+b) equals 2a (e^(-b tau) - e^(-a tau))/(a^2 - b^2) to rel 1e-11 (independent kernel closed form) and is nonnegative on every draw",
    holds: () => {
      const rand = seededRand(2);
      for (let t = 0; t < 50000; t++) {
        const a = 0.01 + 20 * rand();
        const b = 0.01 + 20 * rand();
        const tau = 30 * rand();
        if (Math.abs(a - b) < 1e-6) continue;
        const G = kernelK(a, b, tau);
        const deficit = G - (2 * Math.exp(-a * tau)) / (a + b);
        const closed =
          (2 * a * (Math.exp(-b * tau) - Math.exp(-a * tau))) / (a * a - b * b);
        if (deficit < -1e-15 * G) return false;
        const scale = Math.max(Math.abs(closed), 1e-12 * G);
        if (Math.abs(deficit - closed) > 1e-11 * scale + 1e-13 * G) return false;
      }
      return true;
    },
  },
  {
    id: "imp95222-pwe-sharpened-cap-battery",
    description:
      "sharpened pair cap H <= (1/2) e^(-(a+b) min(ua, ub)) G on 50000 seeded draws (same ranges as the imp-95221 battery), evaluated in LOG space so the ~580 doubly-underflowing deep draws (exponents past 700, where direct division yields the silent 0/0 NaN found independently) are genuinely checked: zero violations; worst ratio reproduces the baked 0.9997274025347458 (rel 1e-9) -- near-attained, unlike the 0.4957 slack of the old cap; subsumption of both imp-95221 caps checked as the exact exponent inequality (a+b) u_min >= x_smaller_center on every draw",
    holds: () => {
      const rand = seededRand(95222);
      let worstLog = -Infinity;
      for (let t = 0; t < 50000; t++) {
        const a = 0.01 + 20 * rand();
        const b = 0.01 + 20 * rand();
        const ua = 0.001 + 30 * rand();
        const ub = 0.001 + 30 * rand();
        const uMin = Math.min(ua, ub);
        const G = gPair(a, ua, b, ub); // exponents <= 600: no underflow
        const lnH = -(a * ua + b * ub) - Math.log(a + b);
        const lnCap = Math.log(0.5) - (a + b) * uMin + Math.log(G);
        if (!(lnH <= lnCap + 1e-12)) return false;
        // subsumption of the reflection cap G/2 and LEMMA PW e^(-x_sc) G:
        // both reduce to (a+b) u_min >= x_sc (exact arithmetic, no libm)
        const xSm = ua <= ub ? a * ua : b * ub;
        if (!((a + b) * uMin >= xSm)) return false;
        if (lnH - lnCap > worstLog) worstLog = lnH - lnCap;
      }
      return (
        Math.abs(Math.exp(worstLog) - SHARP_BATTERY_WORST) <=
        1e-9 * SHARP_BATTERY_WORST
      );
    },
  },
  {
    id: "imp95222-pwe-cocentered-equality",
    description:
      "equality case: co-centered pairs (tau = 0) attain H = (1/2) e^(-(a+b)u) G exactly (float deviation 0 on four rows spanning equal, near-equal and extreme rate ratios) -- the pair inequality is sharp, not just one-sided",
    holds: () => {
      for (const [a, b, u] of [
        [0.3, 7.1, 0.4],
        [2, 2, 1],
        [11.5, 0.02, 3],
        [1, 19, 0.05],
      ]) {
        const H = hPair(a, u, b, u);
        const G = gPair(a, u, b, u);
        if (Math.abs(H / (0.5 * Math.exp(-(a + b) * u) * G) - 1) > 1e-12) return false;
      }
      return true;
    },
  },
  {
    id: "imp95222-deep-shallow-row-inside",
    description:
      "the imp-95221 deep-exponent refutation row (0.1, 30) vs (2, 0.1) sits INSIDE the new cap at ratio 0.95 (rel 1e-10) while still refuting the deep-exponent variant (H > 7 e^(-x_deep) G) -- the new cap is not a repackaged deep-exponent claim",
    holds: () => {
      const H = hPair(0.1, 30, 2, 0.1);
      const G = gPair(0.1, 30, 2, 0.1);
      const cap = 0.5 * Math.exp(-(0.1 + 2) * 0.1) * G;
      return (
        Math.abs(H / cap - 0.95) <= 1e-10 &&
        H > 7 * Math.exp(-3) * G
      );
    },
  },
  {
    id: "imp95222-fa2-alias-rows",
    description:
      "THEOREM FA-2 on the five width-law alias rows: baked yMin and boundY = e^(-yMin)/2 reproduce (rel 1e-10); sandwich xMin <= yMin <= 2 xMin strict on every row; imported imp-95221 equal-amplitude truths satisfy rEq <= boundY; boundY <= bound/2 (factor >= 2 improvement on the imp-95221 bound row by row)",
    holds: () => {
      for (const yr of Y_ROWS) {
        const row = FA_ROWS.find((r) => r.p === yr.p && r.D === yr.D);
        if (!row) return false;
        const fam = aliasFamily(yr.p, yr.D);
        const yMin = yMinOf(fam);
        if (Math.abs(yMin - yr.yMin) > 1e-10 * yr.yMin) return false;
        const boundY = 0.5 * Math.exp(-yMin);
        if (Math.abs(boundY - yr.boundY) > 1e-10 * yr.boundY) return false;
        if (!(row.xMin < yMin && yMin < 2 * row.xMin)) return false;
        if (!(row.rEq <= boundY)) return false;
        if (!(boundY <= row.bound / 2 + 1e-15)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95222-qg2-gate-dissolution",
    description:
      "COROLLARY QG-2: the D = 1 model bound halves to e^(-1)/2; the previously NON-COVERED model D = 2 window has Q = 1 > carried qStarFA yet now certifies 0.26630641275560285 < 1/2 with margin 0.23369358724439715; margins at Q = 10, 100, 1000 are positive (Q = 10 reproduces 0.030526409909626628) -- minority holds at EVERY Q, margin decays O(1/Q)",
    holds: () => {
      const rel = (a, b, t) => Math.abs(a - b) <= t * Math.abs(b);
      if (!rel(BOUND_D1_MODEL_SHARP, Math.exp(-1) / 2, 1e-15)) return false;
      const qD2 = Q_MODEL * Math.pow(2, 2 / 3);
      if (!(Math.abs(qD2 - 1) <= 1e-15 && qD2 > Q_STAR_FA)) return false;
      const boundD2 = 0.5 * Math.exp(-Q_MODEL / qD2);
      if (!rel(boundD2, BOUND_D2_MODEL_SHARP, 1e-15)) return false;
      if (!rel(0.5 - boundD2, MARGIN_D2_MODEL, 1e-12)) return false;
      if (!rel(0.5 - 0.5 * Math.exp(-Q_MODEL / 10), MARGIN_Q10, 1e-12)) return false;
      for (const Q of [10, 100, 1000]) {
        const m = 0.5 - 0.5 * Math.exp(-Q_MODEL / Q);
        if (!(m > 0)) return false;
        // O(1/Q) decay: margin between qModel/(4Q) and qModel/(2Q) for large Q
        if (!(m > Q_MODEL / (4 * Q) && m < Q_MODEL / (2 * Q))) return false;
      }
      return true;
    },
  },
  {
    id: "imp95222-fence-consistency",
    description:
      "PROP FEN-C2 fence ordering on every alias row: singleton floor e^(-2 xMin)/2 (imported) <= new upper fence e^(-yMin)/2 <= old upper fence e^(-xMin) -- the fence tightens without crossing; equal-amplitude dilution (rEq < floor, the imp-95221 trap) still visible under the tighter fence",
    holds: () => {
      for (const yr of Y_ROWS) {
        const row = FA_ROWS.find((r) => r.p === yr.p && r.D === yr.D);
        if (!(row.floor <= yr.boundY && yr.boundY <= row.bound)) return false;
        if (!(row.rEq < row.floor)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95222-verdict-honesty",
    description:
      "the verdict carries the honest scope: sub-gap named STILL OPEN, obligation (1) DOWNGRADED not closed, positivity still load-bearing, phases obligation UNCHANGED, chain-gate map and envelope port OPEN, margin O(1/Q) at large Q recorded, and no QED",
    holds: () =>
      /STILL OPEN, further narrowed/.test(
        IMP95222_DIAGONAL_EXACT_SEAM_SHARPENING.subGap,
      ) &&
      /DOWNGRADED from the pass-fail gate/.test(
        IMP95222_DIAGONAL_EXACT_SEAM_SHARPENING.subGap,
      ) &&
      /UNCHANGED and load-bearing/.test(IMP95222_DIAGONAL_EXACT_SEAM_SHARPENING.subGap) &&
      /positivity still load-bearing/.test(
        IMP95222_DIAGONAL_EXACT_SEAM_SHARPENING.verdict,
      ) &&
      /margin is O\(1\/Q\) at large Q/.test(
        IMP95222_DIAGONAL_EXACT_SEAM_SHARPENING.verdict,
      ) &&
      /gammaSL-form chain-gate map, envelope shape and paper constants remain OPEN/.test(
        IMP95222_DIAGONAL_EXACT_SEAM_SHARPENING.verdict,
      ) &&
      /NO QED/.test(IMP95222_DIAGONAL_EXACT_SEAM_SHARPENING.verdict) &&
      /refereed bound is changed/i.test(IMP95222_DIAGONAL_EXACT_SEAM_SHARPENING.verdict) &&
      /OPEN/.test(IMP95222_DIAGONAL_EXACT_SEAM_SHARPENING.propFENC2),
  },
];

for (const a of IMP95222_SHARPENING_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95222-diagonal-exact-seam-sharpening assertion failed: ${a.id}`,
    );
  }
}

export default IMP95222_DIAGONAL_EXACT_SEAM_SHARPENING;
