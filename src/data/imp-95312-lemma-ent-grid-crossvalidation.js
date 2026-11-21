/**
 * imp-95312: grid cross-validation of imp-95254 LEMMA ENT (entrywise
 * seam-mass domination). The imp-95254 PHASE-AM certificate rests on
 *   L_mn <= (1/2) e^(-y_min) M_mn   for every packet pair,
 * with equality on the diagonal at 2 mu_n u_n = y_min and at co-centered
 * pairs at (mu_m + mu_n) u = y_min. imp-95254 verified this only through a
 * 20,000-sample random sweep; it was never tabulated on a structured grid,
 * nor was the entrywise ratio distribution or the worst-case ratio reported.
 * This module supplies that tabulation. VALIDATION ONLY -- no bound changed,
 * no Lambda promotion, no QED.
 *
 * Objects as in imp-95254: packets f_n(s) = e^(-mu_n |s - u_n|), rates
 * mu_n > 0, centers u_n > 0; the exact left-tail and full-line Gram entries
 *   L_mn = e^(-(mu_m u_m + mu_n u_n)) / (mu_m + mu_n),
 *   M_mn = three-strip closed form (overlapM below).
 * For a single pair the strictest form of ENT uses the pairs OWN depth
 *   y_pair = (mu_m + mu_n) min(u_m, u_n) >= y_min,
 * so e^(-y_pair) <= e^(-y_min): if L_mn <= (1/2) e^(-y_pair) M_mn holds, the
 * family-level bound (1/2) e^(-y_min) M_mn holds a fortiori. We report the
 * entrywise RATIO
 *   r(m,n) = L_mn / ((1/2) e^(-y_pair) M_mn) = 2 e^(-mu_far D) / ((mu_m+mu_n) M_mn),
 * D = |u_m - u_n|, mu_far the rate of the farther-center packet. LEMMA ENT is
 * exactly r <= 1, with r = 1 iff M_mn = 2 e^(-mu_far D)/(mu_m+mu_n), which
 * (from the three-strip form) happens precisely at D = 0.
 *
 * GRID. rates {0.25, 0.5, 1, 2, 4}, centers {0.25, 0.5, 1, 2}, all ordered
 * pairs (m,n): 400 cells, 100 co-centered (u_m = u_n, includes the 20
 * diagonal cells) and 300 off-center.
 *
 * FINDINGS (baked literals below, recomputed by the assertions).
 *  - worst ratio over all 400 cells = 1 (to float 1.0000000000000002),
 *    attained on every co-centered cell; NO cell exceeds 1. LEMMA ENT holds.
 *  - worst OFF-center ratio = 0.9610213351372625 (< 1 strictly): equality is
 *    a co-centered phenomenon, off-center pairs carry strictly positive
 *    left-tail slack.
 *  - min ratio = 0.0013241954052103748 (deep, well-separated pairs waste
 *    almost all of the entrywise budget); mean slack (1 - r) = 0.3404.
 *  - equality is EXACT at every co-centered cell (|r - 1| <= 2.3e-16) and at
 *    every diagonal cell (|r - 1| = 0), matching the LEMMA ENT equality
 *    clause 2 mu_n u_n = y_min / (mu_m + mu_n) u = y_min.
 *  - approach to equality: fixing rates (1, 2), center u = 0.7 and shrinking
 *    the gap D = u_n - u_m, r rises 0.2254, 0.4353, 0.8262, 0.9803, 0.9980
 *    at D = 1, 0.5, 0.1, 0.01, 0.001 -- r -> 1 as D -> 0, consistent with
 *    M_mn -> 2/(mu_m+mu_n) and mu_far D -> 0.
 *
 * SCOPE. imp-95222 packet model only; the map to paper per-window quantities
 * (obligation (3) gammaSL, imp-95276) is UNCHANGED. Changes NO Lambda bound;
 * NO QED; no refereed bound is changed. Import-light (no zeros
 * bundle, no sibling imports).
 */

// -- exact Gram machinery (closed forms, mirrors imp-95254) ------------------
function overlapM(mu1, u1, mu2, u2) {
  const [ma, mb] = u1 <= u2 ? [mu1, mu2] : [mu2, mu1];
  const D = Math.abs(u2 - u1);
  const s13 = (Math.exp(-mb * D) + Math.exp(-ma * D)) / (ma + mb);
  const mid =
    Math.abs(mb - ma) < 1e-13
      ? D * Math.exp(-ma * D)
      : (Math.exp(-ma * D) - Math.exp(-mb * D)) / (mb - ma);
  return s13 + mid;
}
function leftL(mu1, u1, mu2, u2) {
  return Math.exp(-(mu1 * u1 + mu2 * u2)) / (mu1 + mu2);
}
function entRatio(mu1, u1, mu2, u2) {
  const y = (mu1 + mu2) * Math.min(u1, u2);
  return leftL(mu1, u1, mu2, u2) / (0.5 * Math.exp(-y) * overlapM(mu1, u1, mu2, u2));
}

const RATES = [0.25, 0.5, 1, 2, 4];
const CENTERS = [0.25, 0.5, 1, 2];

function sweepGrid() {
  let worst = -Infinity;
  let worstOff = -Infinity;
  let minRatio = Infinity;
  let n = 0;
  let nOff = 0;
  let sumSlack = 0;
  let violations = 0;
  let coCentEqMax = 0;
  let diagEqMax = 0;
  for (const m1 of RATES)
    for (const m2 of RATES)
      for (const u1 of CENTERS)
        for (const u2 of CENTERS) {
          const r = entRatio(m1, u1, m2, u2);
          n++;
          if (r > worst) worst = r;
          if (r > 1 + 1e-12) violations++;
          if (r < minRatio) minRatio = r;
          sumSlack += 1 - r;
          if (u1 !== u2) {
            nOff++;
            if (r > worstOff) worstOff = r;
          } else {
            coCentEqMax = Math.max(coCentEqMax, Math.abs(r - 1));
            if (m1 === m2) diagEqMax = Math.max(diagEqMax, Math.abs(r - 1));
          }
        }
  return {
    n,
    nOff,
    worst,
    worstOff,
    minRatio,
    meanSlack: sumSlack / n,
    violations,
    coCentEqMax,
    diagEqMax,
  };
}

// -- baked literals (recomputed by the assertions) ---------------------------
const GRID_CELLS = 400;
const GRID_OFFCENTER = 300;
const WORST_RATIO_ALL = 1.0000000000000002; // co-centered equality, to float
const WORST_RATIO_OFFCENTER = 0.9610213351372625; // strictly < 1
const MIN_RATIO = 0.0013241954052103748;
const MEAN_SLACK = 0.34038531433563507;
const APPROACH_D = [1, 0.5, 0.1, 0.01, 0.001];
const APPROACH_R = [
  0.2253996735605641, 0.4352665983935839, 0.8262128682421235,
  0.980295728277823, 0.9980029956729075,
];

// -- verdict object ----------------------------------------------------------
export const IMP95312_LEMMA_ENT_GRID_CROSSVALIDATION = {
  ticket:
    "imp-95312 (cross-validate the imp-95254 LEMMA ENT entrywise seam-mass domination L_mn <= (1/2) e^(-y_min) M_mn across a structured grid of rate and center pairs -- the pillar of THEOREM PHASE-AM, previously only random-swept, here tabulated with worst-case ratio and slack distribution)",
  method:
    "for each ordered pair (m,n) on rates {0.25,0.5,1,2,4} x centers {0.25,0.5,1,2} (400 cells), compute the exact left-tail L_mn = e^(-(mu_m u_m + mu_n u_n))/(mu_m+mu_n) and the three-strip full-line M_mn, then the entrywise ratio r = L_mn/((1/2) e^(-y_pair) M_mn) with the pairs own depth y_pair = (mu_m+mu_n) min(u_m,u_n) >= y_min (the strictest form). LEMMA ENT is exactly r <= 1.",
  findings:
    "worst ratio over all 400 cells = 1 (to float 1.0000000000000002), attained on every co-centered cell (100 of them, including the 20 diagonal cells) and NEVER exceeded; worst OFF-center ratio = 0.9610213351372625 strictly below 1; min ratio 0.0013241954052 (deep well-separated pairs waste nearly the whole budget); mean slack 1 - r = 0.3404. Equality is EXACT on the diagonal (|r-1| = 0) and to float on every co-centered cell (|r-1| <= 2.3e-16), matching the LEMMA ENT equality clause. Zero violations.",
  equalityApproach:
    "fixing rates (1,2) and center u = 0.7 while shrinking the center gap D, r rises 0.2254, 0.4353, 0.8262, 0.9803, 0.9980 at D = 1, 0.5, 0.1, 0.01, 0.001 -- r -> 1 as D -> 0, because M_mn -> 2/(mu_m+mu_n) and the mu_far D factor -> 1. Equality is a co-centered (D = 0) phenomenon; every off-center pair carries strictly positive left-tail slack.",
  constants: {
    gridCells: GRID_CELLS,
    gridOffcenter: GRID_OFFCENTER,
    worstRatioAll: WORST_RATIO_ALL,
    worstRatioOffcenter: WORST_RATIO_OFFCENTER,
    minRatio: MIN_RATIO,
    meanSlack: MEAN_SLACK,
    approachD: APPROACH_D,
    approachR: APPROACH_R,
  },
  verdict:
    "VALIDATION CONFIRMED: LEMMA ENT L_mn <= (1/2) e^(-y_min) M_mn holds on every one of the 400 grid cells (worst-case entrywise ratio exactly 1, attained only at co-centered/diagonal cells; worst off-center ratio 0.9610 < 1; zero violations), reproducing the imp-95254 equality clause exactly and confirming the ratio never exceeds 1. The entrywise slack is large off-center (mean 0.34, min ratio 0.0013), so the entrywise pillar of THEOREM PHASE-AM is comfortably robust away from co-centered geometry. Model-family only; changes NO Lambda bound; NO QED; no refereed bound is changed.",
  subGap:
    "imp-95212-subgap-fresnel-airy-envelope-port -- STILL OPEN. This is a validation of the imp-95254 obligation (2) phase leg (LEMMA ENT pillar of THEOREM PHASE-AM); the exact sharp frontier sup R at fixed (theta, y_min) remains OPEN as recorded in imp-95254. Obligations (1), (3), (4) UNCHANGED.",
};

// -- assertions (self-executing; import-light; THROW on violation) -----------
export const IMP95312_LEMMA_ENT_GRID_ASSERTIONS = [
  {
    id: "imp95312-grid-no-violation-and-worst-ratio",
    description:
      "LEMMA ENT holds on all 400 grid cells: worst entrywise ratio = 1 (to float), zero cells exceed 1, and the worst off-center ratio is strictly below 1 -- equality is co-centered only",
    holds: () => {
      const s = sweepGrid();
      if (s.n !== GRID_CELLS) return false;
      if (s.nOff !== GRID_OFFCENTER) return false;
      if (s.violations !== 0) return false;
      if (!(s.worst <= 1 + 1e-12)) return false;
      if (Math.abs(s.worst - WORST_RATIO_ALL) > 1e-12) return false;
      if (Math.abs(s.worstOff - WORST_RATIO_OFFCENTER) > 1e-12) return false;
      if (!(s.worstOff < 1)) return false;
      return true;
    },
  },
  {
    id: "imp95312-slack-distribution",
    description:
      "the entrywise slack distribution matches: min ratio 0.0013242, mean slack 0.34039 -- large off-center headroom on the LEMMA ENT pillar",
    holds: () => {
      const s = sweepGrid();
      if (Math.abs(s.minRatio - MIN_RATIO) > 1e-12) return false;
      if (Math.abs(s.meanSlack - MEAN_SLACK) > 1e-12) return false;
      return s.minRatio > 0;
    },
  },
  {
    id: "imp95312-equality-co-centered-and-diagonal",
    description:
      "equality is EXACT at every co-centered cell (|r-1| <= 2.3e-16) and every diagonal cell (|r-1| = 0), reproducing the LEMMA ENT equality clause",
    holds: () => {
      const s = sweepGrid();
      if (!(s.coCentEqMax <= 2.3e-16)) return false;
      if (s.diagEqMax !== 0) return false;
      // spot check a diagonal and a co-centered off-diagonal cell
      const diag = entRatio(1.7, 0.9, 1.7, 0.9);
      const coc = entRatio(1, 0.9, 2.5, 0.9);
      return Math.abs(diag - 1) < 1e-15 && Math.abs(coc - 1) < 1e-15;
    },
  },
  {
    id: "imp95312-approach-to-equality-as-D-shrinks",
    description:
      "shrinking the center gap D at rates (1,2), center 0.7 drives the ratio monotonically to 1 (0.2254 -> 0.9980 at D = 1 -> 0.001), the co-centered equality limit",
    holds: () => {
      let prev = -1;
      for (let k = 0; k < APPROACH_D.length; k++) {
        const D = APPROACH_D[k];
        const r = entRatio(1, 0.7, 2, 0.7 + D);
        if (Math.abs(r - APPROACH_R[k]) > 1e-12) return false;
        if (!(r > prev)) return false; // monotone increasing as D shrinks
        if (!(r < 1)) return false;
        prev = r;
      }
      return true;
    },
  },
  {
    id: "imp95312-verdict-honesty",
    description:
      "the verdict carries the honest scope: validation only, sub-gap still open, no Lambda change, no QED",
    holds: () =>
      /VALIDATION CONFIRMED/.test(
        IMP95312_LEMMA_ENT_GRID_CROSSVALIDATION.verdict,
      ) &&
      /changes NO Lambda bound/.test(
        IMP95312_LEMMA_ENT_GRID_CROSSVALIDATION.verdict,
      ) &&
      /NO QED/.test(IMP95312_LEMMA_ENT_GRID_CROSSVALIDATION.verdict) &&
      /refereed bound is changed/i.test(IMP95312_LEMMA_ENT_GRID_CROSSVALIDATION.verdict) &&
      /STILL OPEN/.test(IMP95312_LEMMA_ENT_GRID_CROSSVALIDATION.subGap),
  },
];

for (const a of IMP95312_LEMMA_ENT_GRID_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95312-lemma-ent-grid-crossvalidation assertion failed: ${a.id}`,
    );
  }
}

export default IMP95312_LEMMA_ENT_GRID_CROSSVALIDATION;
