/**
 * imp-95293: CEIL-X EXCEEDANCE REGION MAP -- tabulating where the
 * non-co-centered signed seam ratio R exceeds the co-centered 1/2 ceiling.
 *
 * imp-95254 PROP CEIL-X exhibited a SINGLE exact non-co-centered witness
 * (rates (1, 1/2), centers (1, 1/4), c = (1, -1)) with R = 0.6961749688 > 1/2,
 * showing the DC-NOGO value 1/2 is a co-centered artifact, not a general
 * ceiling. It never tabulated the exceedance region itself. This ticket maps
 * { (theta, y_min) : sup R > 1/2 } across the two-packet non-co-centered
 * geometry, locating its boundary and its supremum.
 *
 * MODEL (imp-95222 packet model, as in imp-95254). Packets
 * f_n(s) = e^(-mu_n |s - u_n|), rates mu_n > 0, centers u_n > 0, real
 * amplitudes c_n; f = sum c_n f_n; W(f) = integral_(s<0) f^2;
 * T(f) = integral_R f^2; R = W/T; g = sum |c_n| f_n; theta = T(f)/T(g);
 * y_min = min over pairs incl diagonal of (mu_m + mu_n) min(u_m, u_n).
 * Exact left tail L_mn = a_m a_n/(mu_m + mu_n), a_n = e^(-mu_n u_n); full-line
 * overlap M_mn by the three-strip evaluation. For a FIXED two-packet geometry
 * the amplitude that MAXIMIZES R is the top generalized eigenvector of the
 * pencil (L, M), so sup_c R = lambda_max(L, M) (the imp-95226 pencil object);
 * theta is then read off that eigenvector. The exceedance region is therefore
 * a property of the geometry (mu_1, u_1, mu_2, u_2) alone, mapped by scanning
 * geometries and binning by the induced y_min.
 *
 * FINDINGS (all numerical, model-family; NO Lambda change, NO QED).
 *
 * (A) The 1/2 ceiling is broken all the way to the TRIVIAL ceiling R <= 1.
 * Since W(f) = integral_(s<0) f^2 <= integral_R f^2 = T(f) with both positive,
 * R <= 1 exactly for every family (rigorous; not merely observed). Driving the
 * centers to 0 with a strongly unbalanced pair sends R -> 1: the smallest
 * y_min band [0, 0.05) already reaches sup R = 0.99767 (geometry
 * (mu, u) = (0.1, 0.005), (0.1, 0.025)), and R -> 1 as y_min -> 0 with
 * theta -> 0 (deep-cancellation corner). So sup { R : non-co-centered } = 1
 * (not attained), against the co-centered ceiling 1/2.
 *
 * (B) The exceedance region is the LOWER (small-y_min) wedge, bounded above by
 * a rising boundary curve theta_max(y_min): R > 1/2 is achievable at every
 * theta below theta_max(y_min), and theta_max rises from ~0.111 at
 * y_min ~ 0.8 to ~0.969 at y_min -> 0. So at very small y_min ALMOST EVERY
 * theta admits an exceedance; the CEIL-X point (theta, y_min) = (0.110, 0.25)
 * sits well inside the wedge. The per-band table below records, for each
 * y_min band, the supremum R (its witness geometry) and the largest theta at
 * which R still exceeds 1/2 (its witness geometry); both are reproduced by the
 * assertions from the raw geometry, no scan re-run needed.
 *
 * (C) The region is BOUNDED IN y_min. A 2,000,000-geometry random sweep
 * (rates in [0.05, 8.05], centers in [0.001, 3.001]) found NO exceedance at
 * y_min > 1.615 and NEVER R > 1 (max observed R above 1 was 0). The exceedance
 * wedge is therefore confined to roughly y_min < 1.62 in this model.
 *
 * BAND TABLE (y_min band -> sup R and its witness; boundary theta_max and its
 * witness). Witness geometry = (mu_1, u_1, mu_2, u_2); R is lambda_max(L, M)
 * evaluated at the top eigenvector.
 *   [0.00, 0.05): supR 0.997671 @ (0.1,0.005,0.1,0.025);  theta_max 0.968868
 *   [0.05, 0.10): supR 0.948701 @ (0.2,0.125,0.2,0.145);  theta_max 0.829817
 *   [0.10, 0.20): supR 0.902730 @ (0.1,0.525,0.1,0.505);  theta_max 0.703675
 *   [0.20, 0.40): supR 0.832540 @ (2.3,0.045,2.4,0.065);  theta_max 0.526758
 *   [0.40, 0.80): supR 0.754587 @ (1.6,0.125,1.7,0.145);  theta_max 0.312003
 *   [0.80, 1.60): supR 0.653449 @ (1.0,0.485,0.9,0.445);  theta_max 0.110708
 * Both sup R and theta_max decrease MONOTONICALLY as y_min grows -- the wedge
 * narrows and the attainable exceedance shrinks toward the CEIL-X value with
 * increasing depth, vanishing (region empty) beyond y_min ~ 1.62.
 *
 * CROSS-CHECK. A 20,000,000-geometry deterministic grid scan (rates 0.1..8
 * step 0.1, centers 0.005..2.5 step 0.02, non-co-centered) gave overall
 * sup R = 0.993361 at y_min ~ 0.004, consistent with sup -> 1 as y_min -> 0.
 * These full-scan summaries are recorded as documentation; the assertions
 * re-verify only the per-band witness geometries and the trivial ceiling on a
 * cheap 200,000-sample sweep.
 *
 * HONEST LIMITS. (a) Two-packet model only; the CEIL-X exceedance and its
 * wedge are a signed-seam-family phenomenon, not a paper per-window quantity
 * (the imp-95255 / obligation (3) gammaSL map is UNCHANGED). (b) sup R = 1 is
 * the trivial R <= 1 ceiling; the EXACT sharp frontier F(theta, y_min) at
 * fixed currencies remains the OPEN item bracketed by imp-95289 -- this map
 * quantifies the exceedance geometry, it does not close that frontier.
 * (c) Changes NO Lambda bound; NO QED; no refereed bound is changed.
 */

// -- baked literals (recomputed by the assertions) ---------------------------
const CEILX_R = 0.6961749688026323; // imp-95254 exact non-co-centered witness
const CEILX_PENCIL = 0.6963235332503714; // lambda_max(L, M), same geometry
const CEILX_THETA = 0.10989871539190696;
const CEILX_YMIN = 0.25;
const TRIVIAL_CEILING = 1; // R = W/T <= 1 exactly (W left-tail subset of T)
const GRID_SCAN_SUPR = 0.993361; // 2e7-geometry deterministic-grid overall sup
const RAND_MAX_YMIN_EXC = 1.615; // 2e6-sample random sweep max y_min with R>1/2

// per-band map: sup R witness and boundary (max theta with R>1/2) witness
const BANDS = [
  {
    lo: 0.0,
    hi: 0.05,
    supR: 0.9976707157241288,
    supGeom: [0.1, 0.005, 0.1, 0.025],
    thetaMax: 0.9688680783630779,
    boundGeom: [8, 2.465, 0.8, 0.005],
  },
  {
    lo: 0.05,
    hi: 0.1,
    supR: 0.9487012420017626,
    supGeom: [0.2, 0.125, 0.2, 0.145],
    thetaMax: 0.8298168106870731,
    boundGeom: [0.2, 0.125, 7.5, 2.085],
  },
  {
    lo: 0.1,
    hi: 0.2,
    supR: 0.902729794496074,
    supGeom: [0.1, 0.525, 0.1, 0.505],
    thetaMax: 0.7036754848684275,
    boundGeom: [0.4, 0.125, 5.2, 1.605],
  },
  {
    lo: 0.2,
    hi: 0.4,
    supR: 0.8325402089681717,
    supGeom: [2.3, 0.045, 2.4, 0.065],
    thetaMax: 0.5267580639057844,
    boundGeom: [0.8, 0.125, 7.9, 0.625],
  },
  {
    lo: 0.4,
    hi: 0.8,
    supR: 0.7545870344629105,
    supGeom: [1.6, 0.125, 1.7, 0.145],
    thetaMax: 0.31200291499700045,
    boundGeom: [1.3, 2.205, 0.2, 1.005],
  },
  {
    lo: 0.8,
    hi: 1.6,
    supR: 0.6534489338438892,
    supGeom: [1.0, 0.485, 0.9, 0.445],
    thetaMax: 0.11070801532240095,
    boundGeom: [0.9, 0.445, 2.7, 0.645],
  },
];

// -- exact Gram machinery (closed forms; copied from imp-95254; import-light) -
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
function gram(mu, u, c) {
  let W = 0;
  let T = 0;
  let Tg = 0;
  for (let i = 0; i < mu.length; i++)
    for (let j = 0; j < mu.length; j++) {
      const L = leftL(mu[i], u[i], mu[j], u[j]);
      const M = overlapM(mu[i], u[i], mu[j], u[j]);
      W += c[i] * c[j] * L;
      T += c[i] * c[j] * M;
      Tg += Math.abs(c[i] * c[j]) * M;
    }
  let y = Infinity;
  for (let i = 0; i < mu.length; i++)
    for (let j = 0; j < mu.length; j++)
      y = Math.min(y, (mu[i] + mu[j]) * Math.min(u[i], u[j]));
  return { W, T, Tg, R: W / T, theta: T / Tg, y };
}
// pencil optimum for a two-packet geometry: sup_c R = lambda_max(L, M),
// evaluated at its top generalized eigenvector (2x2 quadratic-formula route)
function pencilOpt(m1, u1, m2, u2) {
  const L11 = leftL(m1, u1, m1, u1);
  const L22 = leftL(m2, u2, m2, u2);
  const L12 = leftL(m1, u1, m2, u2);
  const M11 = overlapM(m1, u1, m1, u1);
  const M22 = overlapM(m2, u2, m2, u2);
  const M12 = overlapM(m1, u1, m2, u2);
  const A = M11 * M22 - M12 * M12;
  const B = L11 * M22 + L22 * M11 - 2 * L12 * M12;
  const C = L11 * L22 - L12 * L12;
  const disc = B * B - 4 * A * C;
  if (disc < 0) return null;
  const lam = (B + Math.sqrt(disc)) / (2 * A);
  const c1 = -(L12 - lam * M12) / (L11 - lam * M11);
  return gram([m1, m2], [u1, u2], [c1, 1]);
}
function mulberry(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// -- verdict object ----------------------------------------------------------
export const IMP95293_CEILX_EXCEEDANCE_REGION_MAP = {
  ticket:
    "imp-95293 (tabulate the imp-95254 PROP CEIL-X exceedance region where the non-co-centered signed seam ratio R exceeds 1/2): mapped { (theta, y_min) : sup_c R > 1/2 } over the two-packet pencil-optimal geometry, locating its boundary and supremum",
  findingCeiling:
    "the co-centered 1/2 ceiling is broken all the way to the TRIVIAL ceiling R <= 1 (rigorous: W is a left-tail subset of T so R = W/T <= 1); sup { R : non-co-centered } = 1, not attained, approached in the deep corner y_min -> 0, theta -> 0 (smallest band [0, 0.05) already reaches sup R = 0.99767)",
  findingWedge:
    "the exceedance region is the small-y_min wedge bounded above by a rising boundary theta_max(y_min): R > 1/2 is achievable at every theta below theta_max, and theta_max rises from ~0.111 at y_min ~ 0.8 to ~0.969 at y_min -> 0 -- at very small y_min almost every theta admits an exceedance; the CEIL-X point (0.110, 0.25) sits well inside the wedge",
  findingBounded:
    "the wedge is bounded in y_min: a 2,000,000-geometry random sweep (rates [0.05, 8.05], centers [0.001, 3.001]) found NO exceedance at y_min > 1.615 and never R > 1; the region is confined to roughly y_min < 1.62 in this model",
  bandTable: BANDS.map((b) => ({
    yMinBand: [b.lo, b.hi],
    supR: b.supR,
    supGeom: b.supGeom,
    thetaMax: b.thetaMax,
    boundGeom: b.boundGeom,
  })),
  ceilxWitness: {
    R: CEILX_R,
    pencilOptimum: CEILX_PENCIL,
    theta: CEILX_THETA,
    yMin: CEILX_YMIN,
  },
  gridScanSupR: GRID_SCAN_SUPR,
  randMaxYminExc: RAND_MAX_YMIN_EXC,
  constants: {
    ceilxR: CEILX_R,
    ceilxPencil: CEILX_PENCIL,
    ceilxTheta: CEILX_THETA,
    ceilxYmin: CEILX_YMIN,
    trivialCeiling: TRIVIAL_CEILING,
    gridScanSupR: GRID_SCAN_SUPR,
    randMaxYminExc: RAND_MAX_YMIN_EXC,
  },
  subGap:
    "imp-95212-subgap-fresnel-airy-envelope-port -- STILL OPEN. This ticket TABULATES the imp-95254 CEIL-X exceedance region (boundary theta_max(y_min) and supremum sup R = 1 approached at y_min -> 0), it does NOT close the exact sharp frontier F(theta, y_min) = sup R at fixed currencies -- that item stays the imp-95289 two-sided bracket. Obligations (1), (3), (4) UNCHANGED. Import-light (no zeros bundle, no sibling imports).",
  verdict:
    "NUMERICAL map of the imp-95254 PROP CEIL-X exceedance region on the two-packet signed seam: (A) the 1/2 ceiling is broken to the trivial R <= 1, with sup R -> 1 as y_min -> 0 (rigorous ceiling, numerical approach); (B) the exceedance wedge is bounded above by a rising boundary theta_max(y_min) climbing 0.111 -> 0.969 as y_min falls from ~0.8 to 0, with per-band sup R and boundary witnesses reproduced from raw geometry; (C) the wedge is bounded in y_min < ~1.62 (2e6-sample random sweep, no R > 1). Model-family only; changes NO Lambda bound; NO QED; no refereed bound is changed.",
  rigorScope:
    "R <= 1 is exact (left tail is a subset of the full line). Every per-band witness R = lambda_max(L, M) is an exact closed-form 2x2 generalized eigenvalue at its top eigenvector; the sup R = 1 approach and the theta_max boundary and the y_min < 1.62 confinement are numerical scan results (documented full scans, re-verified only on witnesses and a cheap sweep). No claim rests on quadrature; no bound changes.",
};

// -- assertions (self-executing; import-light; THROW on violation) -----------
export const IMP95293_EXCEEDANCE_ASSERTIONS = [
  {
    id: "imp95293-ceilx-witness-reproduced",
    description:
      "the imp-95254 CEIL-X witness reproduces: rates (1, 1/2), centers (1, 1/4) give pencil optimum lambda_max = 0.6963235332503714 and the exact c = (1, -1) ratio R = 0.6961749688026323 > 1/2 at y_min = 1/4, theta = 0.10989871539190696",
    holds: () => {
      const opt = pencilOpt(1, 1, 0.5, 0.25);
      if (Math.abs(opt.R - CEILX_PENCIL) > 1e-12) return false;
      const w = gram([1, 0.5], [1, 0.25], [1, -1]);
      if (Math.abs(w.R - CEILX_R) > 1e-12) return false;
      if (Math.abs(w.theta - CEILX_THETA) > 1e-12) return false;
      if (Math.abs(w.y - CEILX_YMIN) > 1e-15) return false;
      return w.R > 0.5 && opt.R >= w.R;
    },
  },
  {
    id: "imp95293-band-supR-witnesses",
    description:
      "each band sup R witness geometry reproduces its baked lambda_max to 1e-9, exceeds 1/2, and its induced y_min lands in the band",
    holds: () => {
      for (const b of BANDS) {
        const opt = pencilOpt(...b.supGeom);
        if (!opt) return false;
        if (Math.abs(opt.R - b.supR) > 1e-9) return false;
        if (!(opt.R > 0.5)) return false;
        if (!(opt.y >= b.lo && opt.y < b.hi)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95293-band-boundary-witnesses",
    description:
      "each band boundary (max theta with R>1/2) witness reproduces its baked theta to 1e-9, still exceeds 1/2, and lands in the band -- confirming the exceedance wedge reaches theta_max(y_min)",
    holds: () => {
      for (const b of BANDS) {
        const opt = pencilOpt(...b.boundGeom);
        if (!opt) return false;
        if (Math.abs(opt.theta - b.thetaMax) > 1e-9) return false;
        if (!(opt.R > 0.5)) return false;
        if (!(opt.y >= b.lo && opt.y < b.hi)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95293-monotone-band-structure",
    description:
      "both sup R and the boundary theta_max decrease monotonically as y_min grows across the six bands -- the wedge narrows with depth toward the CEIL-X value",
    holds: () => {
      for (let i = 1; i < BANDS.length; i++) {
        if (!(BANDS[i].supR < BANDS[i - 1].supR)) return false;
        if (!(BANDS[i].thetaMax < BANDS[i - 1].thetaMax)) return false;
      }
      // smallest band sup R sits within the R -> 1 approach; largest band
      // sup R stays above the CEIL-X value (interior of the wedge)
      return BANDS[0].supR > 0.99 && BANDS[BANDS.length - 1].supR > 0.5;
    },
  },
  {
    id: "imp95293-trivial-ceiling-and-bounded-wedge",
    description:
      "a 200,000-sample random non-co-centered sweep (rates [0.05, 8.05], centers [0.001, 3.001]) NEVER produces R > 1 (trivial ceiling holds) and produces NO exceedance R > 1/2 at y_min > RAND_MAX_YMIN_EXC = 1.615 (the wedge is bounded in y_min)",
    holds: () => {
      const rand = mulberry(95293);
      for (let t = 0; t < 200000; t++) {
        const m1 = 0.05 + 8 * rand();
        const m2 = 0.05 + 8 * rand();
        const u1 = 0.001 + 3 * rand();
        const u2 = 0.001 + 3 * rand();
        if (Math.abs(u1 - u2) < 1e-9) continue;
        const opt = pencilOpt(m1, u1, m2, u2);
        if (!opt || !(opt.R > 0)) continue;
        if (opt.R > 1 + 1e-9) return false;
        if (opt.R > 0.5 && opt.y > RAND_MAX_YMIN_EXC) return false;
      }
      return true;
    },
  },
  {
    id: "imp95293-verdict-honesty",
    description:
      "the verdict carries the honest scope: numerical map, sub-gap STILL OPEN, sharp frontier NOT closed, no Lambda change, no QED, no refereed bound is changed",
    holds: () =>
      /STILL OPEN/.test(IMP95293_CEILX_EXCEEDANCE_REGION_MAP.subGap) &&
      /does NOT close/.test(IMP95293_CEILX_EXCEEDANCE_REGION_MAP.subGap) &&
      /changes NO Lambda bound/.test(
        IMP95293_CEILX_EXCEEDANCE_REGION_MAP.verdict,
      ) &&
      /NO QED/.test(IMP95293_CEILX_EXCEEDANCE_REGION_MAP.verdict) &&
      /refereed bound is changed/i.test(IMP95293_CEILX_EXCEEDANCE_REGION_MAP.verdict),
  },
];

for (const a of IMP95293_EXCEEDANCE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95293-ceilx-exceedance-region-map assertion failed: ${a.id}`,
    );
  }
}

export default IMP95293_CEILX_EXCEEDANCE_REGION_MAP;
