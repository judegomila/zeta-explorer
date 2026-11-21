/**
 * imp-95221: THEOREM FA (positive-amplitude seam certificate) -- the
 * amplitude-weighted pricing leg (beta) of the imp-95220 REROUTE of the
 * open sub-gap imp-95212-subgap-fresnel-airy-envelope-port is DELIVERED at
 * model level: for ANY finite family of two-sided exponential packets with
 * centers strictly on the right of the seam and ANY nonnegative
 * amplitudes, the wrong-side mass fraction is bounded by e^(-x_min) with
 * x_min the minimum PER-PACKET depth-rate product -- no common collar, no
 * lacunarity, no ratio floor, no count, no occupancy, no weight. On the
 * width-law alias grid this is the Q-only, (p, D)-UNIFORM gate
 * R <= e^(-2^(-2/3)/Q), firing iff Q < qStarFA = 2^(-2/3)/ln 2 =
 * 0.908840925297475 -- an O(1) test on the per-window isolation group,
 * replacing the dead O((pD)^(-1/3)) ladder that every coefficient-uniform
 * certificate needed (imp-95220 NOGO-CC/E/D/P).
 *
 * Thirteenth leg of the seam chain. imp-95220 closed off the whole
 * coefficient-uniform architecture on the ported alias family (common
 * collar, octave composition, cellwise class-uniform prices) and rerouted
 * to two legs: (alpha) extract a per-window Q small enough to revive the
 * menu (all evidence says Q = Theta(1), failing the required
 * O((pD)^(-1/3)) and O(1/(pD)) ladders), or (beta) price the paper eq (14)
 * fixed-amplitude family (1/p per alias) natively with per-packet depths
 * kept. THIS MODULE DELIVERS LEG (beta) at model level. The mechanism is
 * exactly the one the imp-95220 NOGO-P honest scope left open: a bound
 * that uses the actual amplitudes (here: only their SIGNS) instead of
 * pricing a coalescence-closed class at skeptical coefficients.
 *
 * SETTING (seam convention, the imp-95220 measured-contrast object).
 * Packets f_n(s) = e^(-mu_n |s - u_n|), rates mu_n > 0, centers u_n > 0;
 * f = sum c_n f_n with amplitudes c_n >= 0 (eq 14 pins c_n = 1/p > 0; a
 * common positive factor cancels in the ratio, so equal amplitudes and
 * the 1/p normalization are the same point of the cone). The certified
 * quantity is the wrong-side mass fraction
 *   R = integral_(s<0) f^2 / integral_R f^2 ,
 * whose exact pair Grams are H_mn = e^(-(x_m + x_n))/(mu_m + mu_n)
 * (wrong side) and G_mn = K(mu_m, mu_n, |u_m - u_n|) (full line), with
 * x_n = mu_n u_n the per-packet depth-rate product.
 *
 * LEMMA PW (pairwise seam inequality). For any pair with u_m >= u_n,
 *   H_mn <= e^(-x_n) G_mn ,
 * where n is the packet with the SMALLER center. PROOF. The full-line
 * Gram dominates its s <= u_n piece: substituting t = u_n - s >= 0,
 *   G_mn >= integral_(s<=u_n) f_m f_n = e^(-mu_m (u_m - u_n))/(mu_m+mu_n),
 * and mu_m (u_m - u_n) <= mu_m u_m = x_m because u_n >= 0. So
 * G_mn >= e^(-x_m)/(mu_m + mu_n), while H_mn =
 * e^(-(x_m+x_n))/(mu_m + mu_n) exactly; divide. QED. The exponent is the
 * SHALLOWER packet and cannot be improved to the deeper one: for a deep
 * slow packet against a shallow fast one, H_mn/G_mn is of order
 * e^(-x_shallow)/2 (an explicit row below has H > 7 x e^(-x_deep) G).
 * Also, pointwise reflection (|t - u| <= t + u for t, u >= 0 gives
 * f_n(-t) <= f_n(t)) yields the unconditional H_mn <= G_mn / 2.
 *
 * THEOREM FA (positive-cone seam certificate). For any finite packet
 * family and any amplitudes c_n >= 0, not all zero,
 *   R <= min( 1/2 , e^(-x_min) ) ,   x_min = min_n mu_n u_n ,
 * and R < 1/2 strictly. PROOF. R = (sum c_m c_n H_mn)/(sum c_m c_n G_mn)
 * with every weight c_m c_n >= 0 and every G_mn > 0; the mediant
 * inequality bounds R by the maximal pair ratio, and LEMMA PW bounds each
 * pair ratio by e^(-x_shallower(m,n)) <= e^(-x_min), while reflection
 * bounds each by 1/2 (diagonal pairs are strict: H_nn = e^(-2x_n)/(2mu_n)
 * < 1/(2mu_n) = G_nn/2). QED. NOTE what is ABSENT: no separation, count,
 * occupancy, ratio-floor or weight hypothesis, and the per-packet depths
 * are KEPT -- the hypothesis is amplitude POSITIVITY alone. This is
 * outside every class priced (or eliminated) by the imp-95211..95220 chain:
 * the LEMMA R1 collapse that fed NOGO-CC absorbs depths into FREE-sign
 * coefficients, and the mediant step is exactly where free signs break.
 *
 * COROLLARY QG (Q-gate on the width-law alias grid). Under the imp-95220
 * width-law port (mu(d) = d^(1/3)/c, u(d) = v/d, x(d) = (v/c) d^(-2/3)
 * strictly decreasing, exact identity x(D/2) = 1/Q), the grid minimum is
 * attained at the deepest denominator d_max <= D, so
 *   x_min = x(d_max) >= x(D) = 2^(-2/3)/Q ,
 * and for every window and EVERY p, D:
 *   R <= e^(-2^(-2/3)/Q) ,
 * a bound depending on the per-window isolation group Q ALONE. The
 * wrong-side-minority margin 1/2 - e^(-2^(-2/3)/Q) is positive iff
 *   Q < qStarFA = 2^(-2/3)/ln 2 = qModel/ln 2 = 0.908840925297475 .
 * Model normalization (c = v = 1): Q = 2^(-2/3) D^(2/3), so every D = 1
 * window fires with the p-UNIFORM bound e^(-1) = 0.36787944117144233
 * (margin 0.1321), and the gate extends to D < (1/ln 2)^(3/2) =
 * 1.7328533426568173; D >= 2 windows are NOT covered with a margin
 * (honest non-coverage -- only the strict unconditional R < 1/2 remains
 * there). CONTRAST: at (p, D) = (997, 1), pD = 997 exceeds every
 * imp-95220 no-go threshold (truth-kill 26.42, partition 58.84, octave
 * 102.93) -- every coefficient-uniform certificate is dead -- while
 * THEOREM FA certifies R <= 0.3676333268081059 and the measured
 * equal-amplitude truth is 0.029882596096028582.
 *
 * PROP FEN-C (two-sided cone fence). The cone sup is fenced:
 *   e^(-2 x_min)/2 <= sup_(c >= 0) R <= e^(-x_min) ,
 * the lower fence exact and attained by the shallowest singleton (its
 * wrong-side fraction is e^(-2x)/2 exactly, and among singletons the
 * shallowest is maximal). The fence pins the bound within a factor
 * e^(x_min) x 2 (5.44 at x_min = 1); whether cone mixing can materially
 * beat the singleton floor is OPEN (a two-packet deep-shallow scan never
 * did: the scanned sup equals the floor e^(-2)/2 = 0.06766764161830635).
 *
 * HONEST LIMITS. (a) POSITIVITY IS LOAD-BEARING: the mediant step needs
 * all products c_m c_n >= 0. Eq (14) pins the alias AMPLITUDES at
 * +1/p, but the true Fresnel-Airy packets carry oscillatory phases; the
 * port owes a per-window same-sign (or modulus-reduction) certificate --
 * a NEW named obligation, the price of leaving the coefficient-uniform
 * architecture. Nothing here addresses the signed seam-convention sup.
 * (b) The bound is one-sided and lossy on the actual family: measured
 * equal-amplitude rows sit 5-12x below it (0.0701 vs 0.5087 at (5,2),
 * 0.0299 vs 0.3676 at (997,1)) -- coverage, not sharpness. (c) The gate
 * fires only for Q < 0.9088; at model normalization that is D = 1 (all
 * p), NOT D >= 2 -- recorded non-coverage rows below. (d) This certifies
 * the seam-convention wrong-side fraction (the object whose > 1/2 was the
 * imp-95220 H-LOC obstruction); the gammaSL-form chain-gate statement is
 * a remaining port obligation, as are the envelope shape (two-sided
 * exponential model vs true Fresnel-Airy envelope) and the paper
 * constants (c, v, D -- equivalently Q -- per window). (e) Model-family
 * constants throughout; nothing here touches any Lambda bound.
 *
 * SKEPTICAL SELF-CHECK RECORD. (1) LEMMA PW approached by a 50000-draw
 * seeded battery on exact kernels: no violation; worst observed
 * H/(e^(-x_shallow) G) = 0.4957 -- the visible factor-2 slack is recorded
 * as one-sided coverage, and a sharpening to e^(-x_min)/2 was ATTEMPTED
 * and NOT delivered (the two-region lower bound on G loses exactly the
 * factor in the deep-slow vs shallow-fast regime; recorded open). (2) The
 * deep-exponent variant of LEMMA PW is FALSE: the explicit row
 * (mu, u) = (0.1, 30) vs (2, 0.1) has H about 7.8 x e^(-x_deep) G --
 * the shallow exponent is forced, not a convenience. (3) The reflection
 * cap H <= G/2 verified in the same battery (worst 0.49999...).
 * (4) THEOREM FA verified on the alias rows (5,2), (7,3), (59,1),
 * (251,2), (997,1): equal-amplitude R and 30 random positive draws per
 * small row all below min(1/2, e^(-x_min)). (5) The initial hope that
 * the equal-amplitude truth exceeds the singleton floor (making the
 * fence tight) was REFUTED: equal amplitudes DILUTE (0.0299 < 0.0677 at
 * (997,1)) because deep packets add right-side mass; recorded as the
 * trap of this leg -- the fence witness is the singleton, not the
 * equal-amplitude point. (6) The mediant step was stress-tested with signed
 * weights: a single negative product breaks it (no theorem claimed there;
 * limit (a)). (7) x(D/2) = 1/Q and qStarFA = qModel/ln 2 tied to the
 * imported imp-95220 constants exactly.
 *
 * ROUTING. Sub-gap imp-95212-subgap-fresnel-airy-envelope-port -- STILL
 * OPEN, further narrowed: reroute leg (beta) EXISTS at model level (this
 * module). Remaining obligations: (1) per-window Q extraction, now the
 * O(1) test Q < 0.9088 instead of the dead O((pD)^(-1/3)) ladder --
 * Q = Theta(1) evidence no longer eliminates the route, it makes the test
 * live; (2) per-window amplitude-sign (or modulus) certificate for the
 * true Fresnel-Airy packets; (3) the envelope-shape port and the
 * seam-to-chain-gate map; (4) paper constants per window. Leg (alpha)
 * stays open unchanged.
 *
 * The numerics below CROSS-CHECK the theorem statements; they are not the
 * claim. Import-light (imports one sibling verdict module for carried
 * constants). Changes no bound; does NOT promote Lambda <= 0.14; NO QED;
 * no refereed bound is changed.
 */

import AWL from "./imp-95220-alias-width-law-weight-nogo.js";

// ── carried constants (single source of truth: sibling verdict object) ──────
const Q_MODEL = AWL.constants.qModel; // 2^(-2/3)
const PD_KILL_MODEL = AWL.constants.pdKillModel; // 26.422776868750283
const PD_CRIT_P_MODEL = AWL.constants.pdCritPModel; // 58.83683065351219
const PD_STAR_D_MODEL = AWL.constants.pdStarDModel; // 102.93087557603685
const MEASURED_SEAM_SUP_5_2 = AWL.constants.measuredSeamSup52; // 0.18133934321273545

// ── new baked literals (recomputed by the assertions) ────────────────────────
const Q_STAR_FA = Math.pow(2, -2 / 3) / Math.log(2); // 0.908840925297475
const D_STAR_FA_MODEL = Math.pow(1 / Math.log(2), 3 / 2); // 1.7328533426568173
const BOUND_D1_MODEL = Math.exp(-1); // 0.36787944117144233 (p-uniform, D = 1)
const SINGLETON_X1 = Math.exp(-2) / 2; // 0.06766764161830635
const FA_ROWS = [
  // xMin = (dMax)^(-2/3); bound = e^(-xMin); rEq = equal-amplitude truth;
  // floor = shallowest-singleton wrong-side fraction e^(-2 xMin)/2
  { p: 5, D: 2, xMin: 0.6758002217303779, bound: 0.5087491455525256, rEq: 0.07009079851872385, floor: 0.12941284655021243 },
  { p: 7, D: 3, xMin: 0.49664419418963435, bound: 0.6085694778502041, rEq: 0.10800871776424814, floor: 0.18517840468543503 },
  { p: 59, D: 1, xMin: 1.011461473993971, bound: 0.36368707178414356, rEq: 0.029449825528227645, floor: 0.0661341430914624 },
  { p: 251, D: 2, xMin: 0.6307985171536051, bound: 0.5321666870708975, rEq: 0.07492598701365641, floor: 0.1416006914140073 },
  { p: 997, D: 1, xMin: 1.0006692320874269, bound: 0.3676333268081059, rEq: 0.029882596096028582, floor: 0.0675771314899978 },
];
const PW_BATTERY_WORST = 0.4957298853565577; // seeded 50000-draw worst H/(e^(-x_sh) G)

// ── exact pair Grams (seam convention) ───────────────────────────────────────
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
function wrongSideFraction(fam, c) {
  let A = 0;
  let B = 0;
  const K = fam.length;
  for (let i = 0; i < K; i++) {
    for (let j = 0; j < K; j++) {
      const w = c[i] * c[j];
      A += w * hPair(fam[i].mu, fam[i].u, fam[j].mu, fam[j].u);
      B += w * gPair(fam[i].mu, fam[i].u, fam[j].mu, fam[j].u);
    }
  }
  return A / B;
}
function seededRand(seedInit) {
  let seed = seedInit;
  return () => {
    seed = (1103515245 * seed + 12345) % 2147483648;
    return seed / 2147483648;
  };
}

// ── verdict object ───────────────────────────────────────────────────────────
export const IMP95221_POSITIVE_AMPLITUDE_SEAM_CERTIFICATE = {
  ticket:
    "imp-95221 (thirteenth leg of the seam chain: the amplitude-weighted pricing leg (beta) of the imp-95220 reroute of the open sub-gap imp-95212-subgap-fresnel-airy-envelope-port is DELIVERED at model level -- a positive-amplitude seam certificate with per-packet depths kept, no structural hypothesis of any kind, whose validity gate on the width-law alias grid is the (p, D)-uniform O(1) test Q < 2^(-2/3)/ln 2, outside the architecture eliminated by NOGO-CC/E/D/P)",
  lemmaPW:
    "pairwise seam inequality: for two-sided exponential packets with centers u_m >= u_n > 0, H_mn <= e^(-x_n) G_mn with x_n the depth-rate product of the SMALLER-center packet (proof: G_mn dominates its s <= u_n piece e^(-mu_m (u_m - u_n))/(mu_m + mu_n) and mu_m (u_m - u_n) <= x_m; H_mn = e^(-(x_m + x_n))/(mu_m + mu_n) exactly); the deep-exponent variant is FALSE (explicit row H about 7.8 x e^(-x_deep) G); pointwise reflection adds the unconditional H_mn <= G_mn / 2.",
  theoremFA:
    "positive-cone seam certificate: for ANY finite packet family and ANY nonnegative amplitudes, the wrong-side mass fraction satisfies R <= min(1/2, e^(-x_min)), x_min = min mu_n u_n over the family, and R < 1/2 strictly -- per-packet depths KEPT, no separation, count, occupancy, ratio or weight hypothesis; amplitude positivity is the ONLY input (mediant inequality over pair ratios + LEMMA PW).",
  corollaryQG:
    "Q-gate: under the imp-95220 width-law port, x_min >= x(D) = 2^(-2/3)/Q, so R <= e^(-2^(-2/3)/Q) for EVERY (p, D) -- the certificate depends on the per-window isolation group alone and is (p, D)-UNIFORM; the wrong-side-minority margin is positive iff Q < qStarFA = 2^(-2/3)/ln 2 = 0.908840925297475 = qModel/ln 2. Model normalization: every D = 1 window fires p-uniformly at e^(-1) = 0.36787944117144233; coverage extends to D < 1.7328533426568173; D >= 2 is honest non-coverage (only strict R < 1/2 remains). At (997, 1), pD = 997 exceeds every imp-95220 no-go threshold yet the certificate delivers 0.3676 with measured equal-amplitude truth 0.0299.",
  propFENC:
    "two-sided cone fence: e^(-2 x_min)/2 <= sup over nonnegative amplitudes of R <= e^(-x_min); lower fence exact and attained by the shallowest singleton; factor e^(x_min) x 2 between fences (5.44 at x_min = 1); whether cone mixing beats the singleton floor materially is OPEN (two-packet deep-shallow scans equal the floor e^(-2)/2 = 0.06766764161830635).",
  constants: {
    qStarFA: Q_STAR_FA,
    dStarFAModel: D_STAR_FA_MODEL,
    boundD1Model: BOUND_D1_MODEL,
    singletonX1: SINGLETON_X1,
    faRows: FA_ROWS,
    pwBatteryWorst: PW_BATTERY_WORST,
    qModelCarried: Q_MODEL,
  },
  subGap:
    "imp-95212-subgap-fresnel-airy-envelope-port -- STILL OPEN, further narrowed: reroute leg (beta) EXISTS at model level (THEOREM FA + COROLLARY QG: amplitude positivity alone prices the ported family with per-packet depths kept, gate Q < 0.9088 uniform in (p, D)). Remaining obligations: (1) per-window Q extraction -- now a LIVE O(1) test Q < qStarFA instead of the dead O((pD)^(-1/3)) ladder (Q = Theta(1) evidence no longer eliminates the route); (2) the per-window amplitude-sign (or modulus-reduction) certificate for the true Fresnel-Airy packets -- eq (14) pins amplitudes at +1/p but the carrier phases are an extraction obligation, and positivity is load-bearing; (3) the envelope-shape port (two-sided exponential model vs true Fresnel-Airy envelope) and the seam-convention to chain-gate (gammaSL-form) map; (4) the paper constants (c, v, D -- equivalently Q -- per window). Leg (alpha) unchanged.",
  verdict:
    "RIGOROUS step: the imp-95220 reroute leg (beta) is delivered at model level. LEMMA PW (pairwise seam inequality H_mn <= e^(-x_shallower) G_mn, exact wrong-side Gram vs a one-region lower bound on the full-line Gram; the deep-exponent variant refuted by an explicit row) + THEOREM FA (mediant over nonnegative pair weights: for ANY amplitudes c_n >= 0 the wrong-side mass fraction obeys R <= min(1/2, e^(-x_min)) with x_min the minimal PER-PACKET depth-rate product -- no collar, no separation, no count, no occupancy, no weight; strictly below 1/2 always) + COROLLARY QG (width-law grid: R <= e^(-2^(-2/3)/Q) uniform in (p, D); margin positive iff Q < qStarFA = 0.908840925297475; model normalization fires all D = 1 windows p-uniformly at e^(-1); at (997,1) every imp-95220 no-go is engaged yet the certificate holds at 0.3676, measured truth 0.0299) + PROP FEN-C (cone fence e^(-2 x_min)/2 <= cone sup <= e^(-x_min), lower fence attained by the shallowest singleton). The certificate is the first in the chain whose validity domain does not shrink with pD: amplitude positivity converts the required isolation from Q = O((pD)^(-1/3)) to Q = O(1). HONEST: positivity is load-bearing (signed sups not addressed; the Fresnel-Airy phase structure is a NEW named obligation); the bound is one-sided with measured 5-12x coverage gap; the gate misses D >= 2 at model normalization (non-coverage recorded); the gammaSL-form chain-gate map, the envelope shape and the per-window Q remain OPEN; nothing here touches any Lambda bound; NO QED; no refereed bound is changed.",
  rigorScope:
    "LEMMA PW is a two-line exact computation (region restriction of the full-line Gram plus u_n >= 0); THEOREM FA uses only the mediant inequality on nonnegative weights and LEMMA PW; COROLLARY QG uses the monotonicity of x(d) and the exact identity x(D/2) = 1/Q carried from imp-95220; PROP FEN-C uses the exact singleton value e^(-2x)/2. All numerics below (batteries, alias rows, scans) CROSS-CHECK these statements and are labeled measured where they are measurements; the theorem consumes no numerics.",
};

// ── assertions (self-executing; import-light; THROW on violation) ────────────
export const IMP95221_FA_ASSERTIONS = [
  {
    id: "imp95221-fa-pairwise-lemma-battery",
    description:
      "LEMMA PW on 50000 seeded random pairs (exact kernels): H <= e^(-x_shallow) G with x_shallow the smaller-center depth-rate product, AND the reflection cap H <= G/2; worst H/(e^(-x_sh) G) reproduces the baked 0.4957298853565577 (rel 1e-12) -- no violation, visible one-sided slack",
    holds: () => {
      const rand = seededRand(95221);
      let worst = 0;
      for (let t = 0; t < 50000; t++) {
        const a = 0.01 + 20 * rand();
        const b = 0.01 + 20 * rand();
        const ua = 0.001 + 30 * rand();
        const ub = 0.001 + 30 * rand();
        const H = hPair(a, ua, b, ub);
        const G = gPair(a, ua, b, ub);
        if (!(H <= G / 2 + 1e-15)) return false;
        const xSh = ua <= ub ? a * ua : b * ub;
        const r = H / (Math.exp(-xSh) * G);
        if (!(r <= 1 + 1e-12)) return false;
        if (r > worst) worst = r;
      }
      return Math.abs(worst - PW_BATTERY_WORST) <= 1e-12 * PW_BATTERY_WORST;
    },
  },
  {
    id: "imp95221-fa-deep-exponent-refutation",
    description:
      "the deep-exponent variant of LEMMA PW is FALSE: at (mu, u) = (0.1, 30) vs (2, 0.1), H exceeds e^(-x_deep) G by more than a factor 7 (the shallow exponent in the lemma is forced), while the proved shallow-exponent cap still holds on the same row",
    holds: () => {
      const H = hPair(0.1, 30, 2, 0.1);
      const G = gPair(0.1, 30, 2, 0.1);
      const xDeep = 0.1 * 30;
      const xShallow = 2 * 0.1;
      return H > 7 * Math.exp(-xDeep) * G && H <= Math.exp(-xShallow) * G;
    },
  },
  {
    id: "imp95221-fa-alias-rows",
    description:
      "THEOREM FA on the width-law alias rows (5,2), (7,3), (59,1), (251,2), (997,1) at model normalization: baked xMin, bound e^(-xMin), equal-amplitude truth and singleton floor all reproduce (rel 1e-10); equal-amplitude truth <= min(1/2, bound); floor <= bound (PROP FEN-C fence ordering); equal-amplitude truth sits BELOW the singleton floor (the recorded dilution trap)",
    holds: () => {
      for (const row of FA_ROWS) {
        const fam = aliasFamily(row.p, row.D);
        const xMin = Math.min(...fam.map((f) => f.mu * f.u));
        if (Math.abs(xMin - row.xMin) > 1e-10 * row.xMin) return false;
        const bound = Math.exp(-xMin);
        if (Math.abs(bound - row.bound) > 1e-10 * row.bound) return false;
        const rEq = wrongSideFraction(fam, fam.map(() => 1));
        if (Math.abs(rEq - row.rEq) > 1e-10 * row.rEq) return false;
        const floor = Math.exp(-2 * xMin) / 2;
        if (Math.abs(floor - row.floor) > 1e-10 * row.floor) return false;
        if (!(rEq <= Math.min(0.5, bound))) return false;
        if (!(floor <= bound)) return false;
        if (!(rEq < floor)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95221-fa-random-positive-cone",
    description:
      "30 seeded random nonnegative-amplitude draws on each small alias row ((5,2), (7,3), (59,1)) stay below min(1/2, e^(-xMin)) -- the cone bound, not just the equal-amplitude point",
    holds: () => {
      const rand = seededRand(52221);
      for (const [p, D] of [
        [5, 2],
        [7, 3],
        [59, 1],
      ]) {
        const fam = aliasFamily(p, D);
        const cap = Math.min(0.5, Math.exp(-Math.min(...fam.map((f) => f.mu * f.u))));
        for (let t = 0; t < 30; t++) {
          const c = fam.map(() => rand());
          if (!(wrongSideFraction(fam, c) <= cap)) return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95221-fa-q-gate-constants",
    description:
      "COROLLARY QG constants: qStarFA = 2^(-2/3)/ln 2 = qModel/ln 2 reproduces 0.908840925297475 (rel 1e-15, tied to the imported imp-95220 qModel); the model D-coverage edge (1/ln 2)^(3/2) reproduces; the D = 1 gate bound is e^(-1) < 1/2 (margin > 0.13); the D = 2 model window has Q = 2^(-2/3) 2^(2/3) = 1 > qStarFA (honest non-coverage); x(D) = 2^(-2/3)/Q verified against the carried model Q at D = 1",
    holds: () => {
      const rel = (a, b, t) => Math.abs(a - b) <= t * Math.abs(b);
      if (!rel(Q_STAR_FA, Q_MODEL / Math.log(2), 1e-15)) return false;
      if (!rel(Q_STAR_FA, 0.908840925297475, 1e-15)) return false;
      if (!rel(D_STAR_FA_MODEL, Math.pow(1 / Math.log(2), 1.5), 1e-15)) return false;
      if (!(BOUND_D1_MODEL < 0.5 && 0.5 - BOUND_D1_MODEL > 0.13)) return false;
      const qD2 = Q_MODEL * Math.pow(2, 2 / 3);
      if (!(Math.abs(qD2 - 1) <= 1e-15 && qD2 > Q_STAR_FA)) return false;
      // x(D) = (v/c) D^(-2/3) at c = v = D = 1 equals 2^(-2/3)/Q_MODEL = 1
      return Math.abs(Math.pow(2, -2 / 3) / Q_MODEL - 1) <= 1e-15;
    },
  },
  {
    id: "imp95221-fa-nogo-contrast",
    description:
      "the certificate fires where the whole coefficient-uniform menu is dead: (997, 1) has pD = 997 above every carried imp-95220 threshold (truth-kill 26.42, partition 58.84, octave 102.93) while the FA bound there is 0.3676 < 1/2 with measured equal-amplitude truth 0.0299; and at (5, 2) the equal-amplitude truth 0.0701 is consistent with (below) the carried arbitrary-coefficient seam sup 0.18133934321273545",
    holds: () => {
      const pd = 997;
      if (!(pd > PD_KILL_MODEL && pd > PD_CRIT_P_MODEL && pd > PD_STAR_D_MODEL))
        return false;
      const row997 = FA_ROWS.find((r) => r.p === 997);
      if (!(row997.bound < 0.5 && row997.rEq < row997.bound)) return false;
      const row52 = FA_ROWS.find((r) => r.p === 5);
      return row52.rEq < MEASURED_SEAM_SUP_5_2;
    },
  },
  {
    id: "imp95221-fa-cone-fence-scan",
    description:
      "PROP FEN-C: the shallowest singleton attains the lower fence exactly (wrong-side fraction e^(-2x)/2, checked analytically vs the pair Grams); a two-packet deep-shallow positive scan (deep (p^(-1/3), p) vs shallow (1, 1), p = 100, 141 log-spaced mixings) never exceeds the upper fence e^(-1) and its max reproduces the singleton floor e^(-2)/2 = 0.06766764161830635 (rel 1e-9) -- measured, openness of beating the floor recorded",
    holds: () => {
      const H = hPair(1, 1, 1, 1);
      const G = gPair(1, 1, 1, 1);
      if (Math.abs(H / G - Math.exp(-2) / 2) > 1e-14) return false;
      const p = 100;
      const deep = { mu: Math.cbrt(1 / p), u: p };
      const sh = { mu: 1, u: 1 };
      let best = 0;
      for (let e = -6; e <= 8; e += 0.1) {
        const r = wrongSideFraction([deep, sh], [Math.pow(10, e), 1]);
        if (!(r <= Math.exp(-1))) return false;
        if (r > best) best = r;
      }
      return Math.abs(best - SINGLETON_X1) <= 1e-9 * SINGLETON_X1;
    },
  },
  {
    id: "imp95221-fa-verdict-honesty",
    description:
      "the verdict carries the honest scope: sub-gap named STILL OPEN with the four remaining obligations, positivity named load-bearing, the phase/sign obligation named NEW, the one-sided coverage gap and D >= 2 non-coverage recorded, the seam-to-chain-gate map left open, and no QED",
    holds: () =>
      /STILL OPEN, further narrowed/.test(
        IMP95221_POSITIVE_AMPLITUDE_SEAM_CERTIFICATE.subGap,
      ) &&
      /amplitude-sign \(or modulus-reduction\) certificate/.test(
        IMP95221_POSITIVE_AMPLITUDE_SEAM_CERTIFICATE.subGap,
      ) &&
      /positivity is load-bearing/.test(
        IMP95221_POSITIVE_AMPLITUDE_SEAM_CERTIFICATE.subGap,
      ) &&
      /NEW named obligation/.test(IMP95221_POSITIVE_AMPLITUDE_SEAM_CERTIFICATE.verdict) &&
      /one-sided with measured 5-12x coverage gap/.test(
        IMP95221_POSITIVE_AMPLITUDE_SEAM_CERTIFICATE.verdict,
      ) &&
      /non-coverage recorded/.test(IMP95221_POSITIVE_AMPLITUDE_SEAM_CERTIFICATE.verdict) &&
      /gammaSL-form chain-gate map/.test(
        IMP95221_POSITIVE_AMPLITUDE_SEAM_CERTIFICATE.verdict,
      ) &&
      /NO QED/.test(IMP95221_POSITIVE_AMPLITUDE_SEAM_CERTIFICATE.verdict) &&
      /refereed bound is changed/i.test(IMP95221_POSITIVE_AMPLITUDE_SEAM_CERTIFICATE.verdict) &&
      /OPEN/.test(IMP95221_POSITIVE_AMPLITUDE_SEAM_CERTIFICATE.propFENC),
  },
];

for (const a of IMP95221_FA_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95221-positive-amplitude-seam-certificate assertion failed: ${a.id}`,
    );
  }
}

export default IMP95221_POSITIVE_AMPLITUDE_SEAM_CERTIFICATE;
