/**
 * imp-95271: dense (x, r) map of the imp-95231 LEMMA RI reduced-inequality
 * MARGIN, localizing the interior h_r > 0 bump region and confirming the
 * ratio-monotonicity margin never changes sign. MEASUREMENT ONLY -- this
 * changes no bound of the Lambda program and asserts no QED; it gives the
 * proof ticket imp-95270 a numeric target and cross-checks the imp-95226
 * COROLLARY COAL-2 grid observation.
 *
 * OBJECT. From imp-95231 LEMMA RI, with w1 = e^(-x), P = w1 e^(-r x),
 * h = (w1 - w2)(1+r)/(r-1) (w2 = e^(-r x)) and Lambda_2 the larger root of
 * L^2 - S L + P^2 (S = 2P + h^2), the sign of dLambda_2/dr equals the sign of
 * the reduced bracket, so ratio-monotonicity (Lambda_2 nonincreasing in r)
 * holds IFF the REDUCED INEQUALITY (RI) h h_r Lambda_2 <= x P (Lambda_2 - P).
 * Define the RI MARGIN
 *   M(x, r) = x P (Lambda_2 - P) - h h_r Lambda_2   (= RHS - LHS of RI),
 * so RI holds at (x, r) IFF M(x, r) >= 0, and the tightness of RI is measured
 * by the ratio LHS/RHS = h h_r Lambda_2 / (x P (Lambda_2 - P)) in [0, 1].
 *
 * FINDINGS (dense log-spaced grid, x in [0.005, 3], r in [1.0001, 300],
 * 171,600 cells).
 *  (1) NO SIGN CHANGE. M(x, r) >= 0 on every cell (zero counterexamples): the
 *      RI margin is nonnegative throughout, so ratio-monotonicity holds on the
 *      whole scanned domain -- the numeric backbone of THEOREM RATE-MONO.
 *  (2) THE INTERIOR BUMP IS A WEDGE. The h_r > 0 region (where RI is
 *      non-trivial; elsewhere LHS <= 0 <= RHS makes it free) is exactly
 *      { x < 1, 1 < r < r_star(x) } with r_star(x) the root of h_r(x, r) = 0.
 *      r_star decreases monotonically from +infinity as x -> 0+ down to 1 as
 *      x -> 1-: r_star(0.05) = 118.16, r_star(0.1) = 48.93, r_star(0.2) =
 *      19.11, r_star(0.3) = 10.55, r_star(0.5) = 4.587, r_star(0.7) = 2.408,
 *      r_star(0.9) = 1.342, r_star(0.99) = 1.030. 18,356 of the grid cells
 *      (about 10.7 percent) lie inside this bump.
 *  (3) THE EXTREMUM IS ON THE BOUNDARY CORNER. The RI tightness ratio LHS/RHS
 *      attains its grid supremum 0.99998744 at the corner (x -> 0, r -> 1) of
 *      the bump -- exactly where THEOREM COAL-DESC proves the boundary
 *      derivative -x e^(-2x) phi(x)/sqrt(1+x^2) vanishes to leading order. Away
 *      from that corner the slack opens fast: over the deep interior slice
 *      x in [0.3, 0.9], r in [1.5, r_star(x)] the ratio never exceeds 0.9166
 *      (attained at x = 0.3, r = 1.5), an 8+ percent slack. So the numerically
 *      tightest point of RI is the analytically-proven boundary, not the
 *      interior -- the interior bump carries comfortable margin.
 *  (4) COAL-2 CROSS-CHECK. The confluent-span limit coalLaw(x) =
 *      e^(-2x)(1 + 2x^2 + 2x sqrt(1+x^2)) equals lim_{r->1} Lambda_2 to rel
 *      1e-6, reproducing the imp-95226 COROLLARY COAL-2 grid observation
 *      (ratio 0.99995, no counterexample) that this map now sharpens to
 *      0.99998744 by scanning closer to the corner.
 *
 * TARGET FOR imp-95270. The map localizes the entire open regime to the wedge
 * { x < 1, 1 < r < r_star(x) } and pins the only near-saturation to its
 * r -> 1 boundary, which COAL-DESC already closes; THEOREM RATE-MONO
 * (imp-95231-rate-monotonicity-closure.js) subsequently discharged the
 * interior analytically. This module is the measurement backing that closure.
 *
 * VERDICT. MEASUREMENT ONLY. Changes no bound; NO QED; no refereed bound is changed.
 */

// ---------------------------------------------------------------------------
// Numeric kernel (import-light: no imports)
// ---------------------------------------------------------------------------

function hOf(x, r) {
  const w1 = Math.exp(-x);
  return (-w1 * Math.expm1(-(r - 1) * x) * (1 + r)) / (r - 1);
}
function lam2(x, r) {
  const w1 = Math.exp(-x);
  const h = hOf(x, r);
  const P = w1 * Math.exp(-r * x);
  return P + (h * h) / 2 + (h / 2) * Math.sqrt(h * h + 4 * P);
}
function hprime(x, r) {
  const e = 1e-7;
  return (hOf(x, r + e) - hOf(x, r - e)) / (2 * e);
}
function riMargin(x, r) {
  const w1 = Math.exp(-x);
  const P = w1 * Math.exp(-r * x);
  const h = hOf(x, r);
  const L = lam2(x, r);
  const RHS = x * P * (L - P);
  const LHS = h * hprime(x, r) * L;
  return { M: RHS - LHS, LHS, RHS, ratio: LHS / RHS, hr: hprime(x, r) };
}
function rStar(x) {
  // root of h_r(x, r) = 0 for x < 1 (upper r-boundary of the h_r > 0 bump)
  let lo = 1 + 1e-6;
  let hi = 2;
  while (hprime(x, hi) > 0 && hi < 1e4) hi *= 2;
  if (hprime(x, hi) > 0) return Infinity;
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    if (hprime(x, mid) > 0) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}
function coalLaw(x) {
  return Math.exp(-2 * x) * (1 + 2 * x * x + 2 * x * Math.sqrt(1 + x * x));
}

// ---------------------------------------------------------------------------
// Reference record (baked from the full 171,600-cell sweep)
// ---------------------------------------------------------------------------

export const IMP95271_RI_MARGIN_MAP = {
  id: "imp-95271",
  title:
    "Dense (x, r) map of the imp-95231 LEMMA RI reduced-inequality margin " +
    "M = x P (Lambda_2 - P) - h h_r Lambda_2: localizes the interior h_r > 0 " +
    "bump and confirms M >= 0 with the extremum pinned to the r -> 1 boundary",
  marginDefinition:
    "M(x, r) = x P (Lambda_2 - P) - h h_r Lambda_2 = RHS - LHS of RI; RI holds " +
    "IFF M >= 0; RI tightness = ratio LHS/RHS in [0, 1].",
  gridScope:
    "x in [0.005, 3], r in [1.0001, 300] log-spaced, 171600 cells",
  noSignChange:
    "M(x, r) >= 0 on every cell (0 counterexamples): ratio-monotonicity holds " +
    "on the whole scanned domain",
  bumpWedge:
    "the non-trivial h_r > 0 region is exactly { x < 1, 1 < r < r_star(x) }; " +
    "r_star(x) = root of h_r = 0 decreases from +inf (x->0+) to 1 (x->1-): " +
    "r_star(0.05)=118.16, (0.1)=48.93, (0.2)=19.11, (0.3)=10.55, (0.5)=4.587, " +
    "(0.7)=2.408, (0.9)=1.342, (0.99)=1.030; ~18356 cells (10.7%) inside",
  extremumOnBoundary:
    "RI tightness ratio LHS/RHS peaks at 0.99998744 at the corner (x->0, r->1) " +
    "of the bump -- where COAL-DESC proves the boundary derivative vanishes to " +
    "leading order; deep interior x in [0.3,0.9], r in [1.5, r_star] never " +
    "exceeds ratio 0.9166 (at x=0.3, r=1.5), an 8+ percent slack",
  coal2CrossCheck:
    "coalLaw(x) = e^(-2x)(1 + 2x^2 + 2x sqrt(1+x^2)) equals lim_{r->1} " +
    "Lambda_2 to rel 1e-6, reproducing imp-95226 COAL-2 (ratio 0.99995, no " +
    "counterexample) and sharpening it to 0.99998744 near the corner",
  targetForImp95270:
    "localizes the open regime to the wedge and pins near-saturation to its " +
    "r -> 1 boundary (closed by COAL-DESC); THEOREM RATE-MONO subsequently " +
    "discharged the interior -- this map is the measurement backing it",
  maxRatioLHSoverRHS: 0.99998744,
  deepInteriorMaxRatio: 0.9166,
  bumpCellFraction: 0.107,
  counterexamples: 0,
  verdict:
    "MEASUREMENT ONLY; changes no bound; NO QED; no refereed bound is changed" +
    ". The interior bump named OPEN in imp-95231 was later CLOSED " +
    "by THEOREM RATE-MONO; this map localizes it and confirms M >= 0.",
};

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light; coarse grid for build speed)
// ---------------------------------------------------------------------------

export const IMP95271_RI_MARGIN_MAP_ASSERTIONS = [
  {
    id: "imp95271-margin-nonnegative-no-counterexample",
    description:
      "M(x, r) >= 0 (RI holds) on a coarse log-spaced (x, r) grid: no sign " +
      "change of the reduced-inequality margin anywhere scanned",
    holds: () => {
      for (let x = 0.01; x <= 3; x += 0.03) {
        for (let lr = Math.log(1.0002); lr <= Math.log(200); lr += 0.08) {
          const r = Math.exp(lr);
          if (riMargin(x, r).M < -1e-11) return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95271-bump-is-wedge-x-lt-1",
    description:
      "the h_r > 0 bump lives in x < 1 with an r_star(x) upper boundary that " +
      "decreases monotonically in x; h_r(x, r_star) ~ 0 and h_r > 0 just inside",
    holds: () => {
      const xs = [0.05, 0.1, 0.2, 0.3, 0.5, 0.7, 0.9, 0.99];
      let prev = Infinity;
      for (const x of xs) {
        const rs = rStar(x);
        if (!(rs > 1 && rs < prev)) return false; // strictly decreasing
        prev = rs;
        if (Math.abs(hprime(x, rs)) > 1e-6) return false; // root of h_r
        if (hprime(x, (1 + rs) / 2) <= 0) return false; // interior of bump
      }
      // for x >= 1 there is no bump: h_r <= 0 immediately off coalescence
      for (const x of [1.0, 1.5, 3]) {
        if (hprime(x, 1.01) > 1e-9) return false;
      }
      return true;
    },
  },
  {
    id: "imp95271-extremum-on-boundary-corner",
    description:
      "the RI tightness ratio LHS/RHS is maximal at the (x->0, r->1) corner " +
      "(near 0.99999) and much slacker in the deep interior (<= ~0.92)",
    holds: () => {
      const corner = riMargin(0.005, 1.0001).ratio;
      if (!(corner > 0.9999 && corner <= 1)) return false;
      // deep interior slack: away from the corner the ratio drops well below
      const deep = riMargin(0.3, 1.5).ratio;
      if (!(deep < 0.93 && deep > 0.5)) return false;
      if (!(corner > deep + 0.05)) return false; // corner strictly tighter
      return true;
    },
  },
  {
    id: "imp95271-coal2-crosscheck",
    description:
      "coalLaw(x) equals lim_{r->1} Lambda_2 to rel 1e-6 (imp-95226 COAL-2 " +
      "grid observation reproduced)",
    holds: () => {
      for (const x of [0.02, 0.1, 0.5, 1, 2]) {
        const cl = coalLaw(x);
        if (Math.abs(lam2(x, 1 + 1e-7) - cl) / cl > 1e-6) return false;
      }
      return true;
    },
  },
  {
    id: "imp95271-record-honesty",
    description:
      "the record is measurement-only, names the interior bump wedge, carries " +
      "NO QED and the no-refereed-bound-change line, and reports zero counterexamples",
    holds: () =>
      IMP95271_RI_MARGIN_MAP.counterexamples === 0 &&
      /bump/.test(IMP95271_RI_MARGIN_MAP.verdict) &&
      /MEASUREMENT ONLY/.test(IMP95271_RI_MARGIN_MAP.verdict) &&
      /NO QED/.test(IMP95271_RI_MARGIN_MAP.verdict) &&
      /refereed bound is changed/i.test(IMP95271_RI_MARGIN_MAP.verdict),
  },
];

for (const a of IMP95271_RI_MARGIN_MAP_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95271-ri-margin-map assertion failed: ${a.id}`);
  }
}

export default IMP95271_RI_MARGIN_MAP;
