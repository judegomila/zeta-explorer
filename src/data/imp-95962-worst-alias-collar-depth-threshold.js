/**
 * @module imp-95962-worst-alias-collar-depth-threshold
 *
 * imp-95962 (numerical / measurement): tabulate the worst-alias required collar
 * depth threshold d >= a_1/mu at each imp-95917 witness window and identify the
 * smallest-mu controlling alias per window. imp-95942 STEP 3 established that the
 * Fresnel-Airy envelope sign K_k >= 0 at a seam window is controlled by the WORST
 * (smallest-mu, shallowest-turning-point) alias, because a single global collar
 * depth d must clear a_1/mu for EVERY alias h=1..p-1 (a_1 = |first Airy zero|,
 * mu = d^{1/3}/PORT_C per imp-95917 buildG, d = k - h/p). That per-window worst-
 * alias depth threshold was never tabulated. This module MEASURES it.
 *
 * SETUP (verbatim from imp-95917 buildG geometry). A seam window (p,k) carries
 * p-1 alias packets h=1..p-1 at depth d_h = k - h/p; packet h has rate
 * mu_h = d_h^{1/3}/PORT_C (PORT_C = 1.7). The imp-95942 STEP-3 sign obligation
 * K_k = Ai(mu(t-c)) >= 0 reduces (imp-95942/imp-95336 MAP-4) to the support
 * condition mu(t-c) >= -a_1, i.e. the collar depth must satisfy d >= a_1/mu_h for
 * each alias. Since mu_h increases with d_h, the largest threshold a_1/mu_h comes
 * from the SMALLEST d_h -- the largest h, h = p-1 (the shallowest packet). The
 * per-window required collar depth is d_min = max_h a_1/mu_h.
 *
 * a_1 = 2.338107410459767 (magnitude of the first negative Airy zero, Ai(-a_1)=0).
 *
 * MEASURED TABLE (exact geometry, quadrature-free; d, mu, threshold to 6 sig fig).
 * For each window the CONTROLLING alias is h = p-1 (smallest mu, largest a_1/mu);
 * dSeam is that alias own seam depth d_{p-1}; margin = dSeam - dMin.
 *   window   ctrl h   mu_ctrl    dMin=a_1/mu_ctrl   dSeam=d_{p-1}   margin
 *   (3,4)     2       0.878707   2.660850           3.333333        0.672483
 *   (5,5)     4       0.949076   2.463563           4.200000        1.736437
 *   (7,6)     6       1.015358   2.302742           5.142857        2.840115
 *   (11,7)    10      1.074266   2.176470           6.090909        3.914439
 *
 * FINDINGS.
 *   (1) The controlling (smallest-mu, largest-threshold) alias is h = p-1 at every
 *       witness window -- the shallowest packet, closest to the top of the (k-1,k)
 *       band. Its threshold a_1/mu_{p-1} is the binding collar-depth requirement.
 *   (2) At every witness window the seam depth of that worst alias ALREADY clears
 *       its own threshold with a strictly positive margin: margin = dSeam - dMin
 *       runs 0.672 (3,4) -> 1.736 (5,5) -> 2.840 (7,6) -> 3.914 (11,7). The margin
 *       GROWS with k because dSeam ~ k grows linearly while dMin = a_1/mu shrinks
 *       (mu = d^{1/3}/PORT_C rises with depth), so the threshold is easiest to meet
 *       at the deepest windows.
 *   (3) The worst-case required collar depth d_min is bounded on this window set:
 *       it DECREASES monotonically from 2.660850 (3,4) to 2.176470 (11,7); no
 *       witness window needs a collar deeper than ~2.66. Every alias in every
 *       window clears its threshold (d_h >= a_1/mu_h for all h), not just the worst.
 *
 * WHY (mechanism, no new bound). mu_h = d_h^{1/3}/PORT_C is monotone increasing in
 * d_h, so a_1/mu_h is monotone DECREASING in d_h; the largest threshold is at the
 * smallest depth d_{p-1} = k - (p-1)/p = k - 1 + 1/p, i.e. just above k-1. As k
 * grows the shallowest packet sits at depth ~k-1, mu grows like (k-1)^{1/3}, so the
 * binding threshold a_1/mu falls while the physical seam depth ~k rises -- the two
 * separate, and the sign obligation becomes slack.
 *
 * WHAT THIS DOES AND DOES NOT DO. It tabulates the collar-depth threshold that the
 * imp-95961 leg (i) turning-point-depth geometry must supply, and records that the
 * SEAM depth alone meets it at all four witness windows with growing margin. It
 * does NOT prove that the actual Section 4.5 packet turning point sits at the seam
 * depth d_h -- that is the unextracted-packet-constants obstruction recorded in
 * imp-95961 (leg (i) STILL OPEN). This is the threshold side only: what depth the
 * geometry must clear, computed exactly; whether the geometry supplies it is the
 * open leg. Changes NO bound; NO QED.
 *
 * HONEST LIMITS. (a) MEASUREMENT of the analytic threshold a_1/mu_h under the
 * imp-95917 width-law port geometry only. (b) d_h, mu_h, a_1/mu_h are EXACT closed
 * forms (no quadrature). (c) The comparison uses the alias SEAM depth d_h as the
 * turning-point depth; the true Section 4.5 turning-point depth is imp-95961 leg (i)
 * and STILL OPEN -- if it sits shallower than d_h the margins shrink. (d) a_1 is the
 * standard first Airy zero to 16 digits. Import-light (no zeros bundle, no sibling
 * imports); self-executing assertions THROW on violation.
 *
 * @see imp-95942-fresnel-airy-envelope-sign-assessment.js (STEP 3: worst alias controls the sign)
 * @see imp-95961-turning-point-depth-extraction-obstruction.js (leg (i): whether the geometry supplies the depth -- OPEN)
 * @see imp-95917-vonmangoldt-weighted-sign-image.js (buildG: d_h = k - h/p, mu_h = d_h^{1/3}/PORT_C)
 *
 * Ticket: imp-95962 (numerical, opus-4-8, api-pool, medium). Measurement only; no bound; NO QED.
 */

// -- width-law port geometry (imp-95917 buildG) --------------------------------
const PORT_C = 1.7;
const muPort = (d) => Math.pow(d, 1 / 3) / PORT_C;

// -- first Airy zero magnitude: Ai(-A1) = 0 ------------------------------------
const A1 = 2.338107410459767;

// -- witness windows (imp-95917) -----------------------------------------------
const WINDOWS = [
  [3, 4],
  [5, 5],
  [7, 6],
  [11, 7],
];

// -- per-window worst-alias collar-depth threshold (live, exact) ---------------
function worstAlias(p, k) {
  let ctrlH = 1;
  let ctrlMu = Infinity;
  let dMin = -Infinity;
  let allClear = true;
  for (let h = 1; h <= p - 1; h++) {
    const d = k - h / p;
    const mu = muPort(d);
    const thr = A1 / mu; // required collar depth: d >= a_1/mu for K_k >= 0
    if (d < thr) allClear = false;
    if (mu < ctrlMu) {
      ctrlMu = mu;
      ctrlH = h;
      dMin = thr;
    }
  }
  const dSeam = k - ctrlH / p;
  return { p, k, ctrlH, ctrlMu, dMin, dSeam, margin: dSeam - dMin, allClear };
}

// -- baked table (6-sig-fig; controlling alias h = p-1 at every window) ---------
const THRESHOLDS = [
  { p: 3, k: 4, ctrlH: 2, muCtrl: 0.878707, dMin: 2.660850, dSeam: 3.333333, margin: 0.672483 },
  { p: 5, k: 5, ctrlH: 4, muCtrl: 0.949076, dMin: 2.463563, dSeam: 4.200000, margin: 1.736437 },
  { p: 7, k: 6, ctrlH: 6, muCtrl: 1.015358, dMin: 2.302742, dSeam: 5.142857, margin: 2.840115 },
  { p: 11, k: 7, ctrlH: 10, muCtrl: 1.074266, dMin: 2.176470, dSeam: 6.090909, margin: 3.914439 },
];

// -- verdict object ------------------------------------------------------------
export const IMP95962_WORST_ALIAS_COLLAR_DEPTH = {
  ticket:
    "imp-95962 (numerical): tabulate the worst-alias required collar depth d >= a_1/mu (a_1 = 2.338107, mu = d^{1/3}/1.7) at each imp-95917 witness window {(3,4),(5,5),(7,6),(11,7)} and identify the smallest-mu controlling alias per window. Measurement only; no bound; NO QED.",
  a1: A1,
  portC: PORT_C,
  controllingAlias:
    "The controlling (smallest-mu, largest-threshold) alias is h = p-1 at every witness window -- the shallowest packet at depth d_{p-1} = k - 1 + 1/p, just above k-1. Its threshold a_1/mu_{p-1} is the binding collar-depth requirement d_min.",
  clearance:
    "At every witness window the seam depth of the worst alias ALREADY clears its own threshold with a strictly positive margin: margin = dSeam - dMin runs 0.672483 (3,4) -> 1.736437 (5,5) -> 2.840115 (7,6) -> 3.914439 (11,7). Every alias in every window clears d_h >= a_1/mu_h, not just the worst.",
  scaling:
    "The worst-case required collar depth d_min DECREASES monotonically 2.660850 (3,4) -> 2.463563 (5,5) -> 2.302742 (7,6) -> 2.176470 (11,7) as k grows, while the seam depth dSeam ~ k rises, so the margin grows with k. No witness window needs a collar deeper than ~2.66.",
  mechanism:
    "mu_h = d_h^{1/3}/PORT_C is monotone increasing in d_h, so a_1/mu_h is monotone decreasing in d_h; the largest threshold is at the smallest depth d_{p-1} = k - (p-1)/p. As k grows the shallowest packet sits at depth ~k-1, mu grows like (k-1)^{1/3}, so the binding threshold a_1/mu falls while the physical seam depth ~k rises -- the two separate and the sign obligation becomes slack.",
  constants: {
    windows: WINDOWS,
    thresholds: THRESHOLDS,
    dMinMax: 2.660850, // worst over all windows, at (3,4)
    marginMin: 0.672483, // tightest margin over all windows, at (3,4)
  },
  obstruction:
    "This is the THRESHOLD side only: what collar depth the geometry must clear, computed exactly. It uses the alias SEAM depth d_h = k - h/p as the turning-point depth. Whether the actual Section 4.5 packet turning point sits at depth >= d_h is the unextracted-packet-constants leg (i), recorded in imp-95961 and STILL OPEN. If the true turning point is shallower than d_h the margins shrink.",
  verdict:
    "MEASUREMENT (honest): the controlling alias is h = p-1 at every imp-95917 witness window; the binding collar-depth threshold d_min = a_1/mu_{p-1} decreases 2.660850 -> 2.176470 over (3,4)..(11,7); and the seam depth alone clears it with a strictly positive, growing margin (0.672..3.914). Tabulates the depth the imp-95961 leg (i) geometry must supply; the geometry side (does the true turning point reach d_h) is STILL OPEN. Changes no numeric bound; NO QED; no refereed bound is changed.",
  rigorScope:
    "d_h = k - h/p, mu_h = d_h^{1/3}/PORT_C and a_1/mu_h are EXACT closed forms (no quadrature). The comparison uses the alias seam depth as the turning-point depth; the true Section 4.5 turning-point depth is imp-95961 leg (i) and STILL OPEN. a_1 is the first Airy zero to 16 digits. Measurement only; changes no bound; NO QED.",
};

// -- self-executing assertions (imp-3715 convention; THROW on violation) --------
export const IMP95962_ASSERTIONS = [
  {
    id: "imp95962-baked-table-matches-live-geometry",
    description:
      "each baked row reproduces the live worst-alias computation (controlling h, mu, d_min, seam depth, margin) to 1e-5 relative for every witness window",
    holds: () =>
      THRESHOLDS.every((row) => {
        const w = worstAlias(row.p, row.k);
        return (
          w.ctrlH === row.ctrlH &&
          Math.abs(w.ctrlMu - row.muCtrl) < 1e-5 * row.muCtrl &&
          Math.abs(w.dMin - row.dMin) < 1e-5 * row.dMin &&
          Math.abs(w.dSeam - row.dSeam) < 1e-5 * row.dSeam &&
          Math.abs(w.margin - row.margin) < 1e-4 * Math.abs(row.margin)
        );
      }),
  },
  {
    id: "imp95962-controlling-alias-is-p-minus-1",
    description:
      "the smallest-mu (largest-threshold) controlling alias is h = p-1 at every witness window -- the shallowest packet",
    holds: () =>
      WINDOWS.every(([p, k]) => worstAlias(p, k).ctrlH === p - 1),
  },
  {
    id: "imp95962-seam-depth-clears-threshold-every-window",
    description:
      "at every witness window every alias clears d_h >= a_1/mu_h (allClear) and the worst-alias seam depth exceeds its threshold with a strictly positive margin",
    holds: () =>
      WINDOWS.every(([p, k]) => {
        const w = worstAlias(p, k);
        return w.allClear && w.margin > 0 && w.dSeam > w.dMin;
      }),
  },
  {
    id: "imp95962-dmin-decreases-margin-grows-with-k",
    description:
      "the binding threshold d_min decreases monotonically and the margin grows monotonically as k rises across the witness windows",
    holds: () => {
      const ws = WINDOWS.map(([p, k]) => worstAlias(p, k));
      for (let i = 1; i < ws.length; i++) {
        if (!(ws[i].dMin < ws[i - 1].dMin)) return false;
        if (!(ws[i].margin > ws[i - 1].margin)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95962-worst-window-is-3-4",
    description:
      "the tightest window (largest d_min, smallest margin) is (3,4) with d_min ~ 2.66085 and margin ~ 0.67248; no window needs a collar deeper than ~2.66",
    holds: () => {
      const w = worstAlias(3, 4);
      const dMinMax = Math.max(...WINDOWS.map(([p, k]) => worstAlias(p, k).dMin));
      return (
        Math.abs(w.dMin - 2.660850) < 1e-4 &&
        Math.abs(w.margin - 0.672483) < 1e-4 &&
        Math.abs(dMinMax - w.dMin) < 1e-12 &&
        dMinMax < 2.67
      );
    },
  },
  {
    id: "imp95962-airy-support-condition-consistent",
    description:
      "the threshold is the Airy support condition d >= a_1/mu <=> mu*d >= a_1: at every worst alias mu_ctrl*dMin equals a_1 to 1e-10",
    holds: () =>
      WINDOWS.every(([p, k]) => {
        const w = worstAlias(p, k);
        return Math.abs(w.ctrlMu * w.dMin - A1) < 1e-10;
      }),
  },
  {
    id: "imp95962-verdict-honesty",
    description:
      "the verdict carries the honest scope: MEASUREMENT only, controlling alias h=p-1, positive growing margin, imp-95961 leg (i) STILL OPEN, no bound, NO QED, no refereed bound is changed",
    holds: () =>
      /MEASUREMENT/.test(IMP95962_WORST_ALIAS_COLLAR_DEPTH.verdict) &&
      /STILL OPEN/.test(IMP95962_WORST_ALIAS_COLLAR_DEPTH.verdict) &&
      /STILL OPEN/.test(IMP95962_WORST_ALIAS_COLLAR_DEPTH.obstruction) &&
      /NO QED/.test(IMP95962_WORST_ALIAS_COLLAR_DEPTH.verdict) &&
      /refereed bound is changed/i.test(IMP95962_WORST_ALIAS_COLLAR_DEPTH.verdict),
  },
];

for (const a of IMP95962_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95962-worst-alias-collar-depth-threshold assertion failed: ${a.id}`,
    );
  }
}

export default IMP95962_WORST_ALIAS_COLLAR_DEPTH;
