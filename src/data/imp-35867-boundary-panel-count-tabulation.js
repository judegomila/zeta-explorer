/**
 * @module imp-35867-boundary-panel-count-tabulation
 *
 * imp-35867 (numerical/measurement, S-frontier): MEASURE the imp-35806 total boundary panel
 * count N_total(Delta, h) = 2 N_long + 2 N_short at the derived benign corner
 * (Delta = m . mean-gap, h ~ 1/w) on the T_PT = 3e12 OOM model, tabulating N_long, N_short and
 * N_total as the enclosed-zero count m and off-axis height h vary near h ~ 1/w. imp-35806 WROTE
 * the joint budget and DERIVED the corner (Delta*, h*) = (m . g, 1/w) with N_total = 2 m + 4/pi,
 * but did not TABULATE the resulting finite panel count the I2/I3 winding certificate would
 * require. This module supplies that table, reusing the imp-35806 nLong/nShort/nTotal machinery
 * verbatim (same B = w normalisation, same delta_long(h) = min(w h, 1) and
 * delta_short(Delta) = cos(pi . dist(Delta/g, int)/2) floors).
 *
 * MEASUREMENT ON THE SHARED NORMALISED OOM MODEL ONLY (imp-35777 / imp-35778 / imp-35800 /
 * imp-35806). Evaluates no true |H_t| or |H_t prime| on any edge; fixes no Delta or h for any
 * real rectangle; certifies no cap; certifies no delta > 0; establishes no positivity; I3 remains
 * GREENFIELD downstream of W1; changes no bound; no RH verdict, NO QED. No refereed bound is changed.
 *
 * WHAT IS TABULATED
 * -----------------------------------------------------------------------------
 * With B = w, Delta = m mean gaps (so delta_short = 1) and u = w h the height in units of 1/w,
 * the imp-35806 per-edge counts reduce to closed forms:
 *   N_long(m, h)  = Delta . w / (pi . min(w h, 1)) = m / min(u, 1),
 *   N_short(m, h) = 2 h w / pi                     = 2 u / pi,
 *   N_total(m, h) = 2 N_long + 2 N_short           = 2 m / min(u, 1) + 4 u / pi.
 * At the benign corner u = 1 (h = 1/w): N_long = m, N_short = 2/pi, N_total = 2 m + 4/pi. Two
 * tables are produced:
 *   (A) the CORNER ladder over m = {1, 2, 3, 5, 10, 20, 50, 100} at h = 1/w exactly -- confirms
 *       N_long = m, N_short = 2/pi ~ 0.6366, N_total = 2 m + 4/pi and the per-zero budget
 *       N_total/m = 2 + 4/(pi m) -> 2 as m grows;
 *   (B) the HEIGHT ladder over u = w h in {0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 2.0} at fixed m = 5 --
 *       quantifies how the finite budget moves as h sweeps through the corner: below saturation
 *       (u < 1) N_long = m/u rises and dominates, at u = 1 the two edge families are balanced at
 *       the derived minimum, above saturation (u > 1) N_long floors at m while N_short = 2u/pi
 *       keeps rising -- so N_total(u) is convex with its minimum AT u = 1, matching imp-35806.
 *
 * FINDING: the finite panel budget the I2/I3 certificate needs is O(m) with the SMALLEST value
 * AT the benign corner. For m = 5 the corner budget is N_total = 10 + 4/pi ~ 11.27 panels
 * (~2.25 per enclosed zero); the height ladder confirms u = 1 is the numeric argmin (every other
 * u on the ladder gives a strictly larger N_total). The budget never diverges on the ladder --
 * the certificate would require a small, explicitly finite panel count at the T_PT = 3e12 scale.
 *
 * WHAT THIS DOES NOT DO
 * -----------------------------------------------------------------------------
 * MEASUREMENT on the shared normalised OOM model only. The sine-kernel short-edge floor, the
 * h-linear long-edge floor, and B = w are OOM stand-ins, NOT certified moduli; the tabulated
 * counts are normalised panel COUNTS, not certified counts of any real rectangle. Evaluates no
 * true |H_t| or |H_t prime|; lower-bounds no inf|H_t prime|; fixes no Delta or h for any real
 * rectangle; certifies no cap; certifies no delta > 0; establishes no positivity; I3 stays
 * GREENFIELD downstream of W1; changes no bound; C_mb GUE-conditional (imp-486) untouched;
 * no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35806-i2-i3-coupled-placement-derivation (N_total(Delta,h); derived corner (m g, 1/w), budget 2m+4/pi)
 * @see imp-35800-i3-two-knob-floor-balance-point (floor-saturation corner h = 1/w, Delta = integer gaps)
 * @see imp-35778-i3-edge-type-floor-decomposition-scope (delta = min(delta_short, delta_long))
 * @see imp-35777-i2-logderivative-panel-cap-scope (per-panel cap L_panel < pi.delta/B; N_edge = L_edge.B/(pi.delta_edge))
 * @see imp-35757-i2-panel-width-count-scope (mean zero gap g = 2 pi / log(T/2 pi) ~ 0.2336)
 * @see Polymath15 2019 (H_t = A + B - C; barrier method); Platt-Trudgian 2021
 */

// -- Anchor + operative constants (import-light; matching imp-35806 verbatim) --
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement

// Winding / derivative log-scale w(T) = (1/2) log(T / 2 pi) (imp-35757 / imp-35777 / imp-35806).
const windingRate = (T) => 0.5 * Math.log(T / (2 * Math.PI));
const W_TPT = windingRate(T_PT); // ~13.446 rad per unit height at T_PT

// Mean zero gap g(T) = 2 pi / log(T / 2 pi) = pi / w(T) (imp-35757).
const meanZeroGap = (T) => (2 * Math.PI) / Math.log(T / (2 * Math.PI));
const GAP_TPT = meanZeroGap(T_PT); // ~0.2336

// Normalised OOM: main-term envelope == 1, so B = sup|H_t prime| ~ w (imp-35777 / imp-35806).
const B_PROXY = W_TPT; // sup|H_t prime| OOM scale
const H_SAT = 1 / W_TPT; // off-axis floor-saturation height (imp-35800 / imp-35806), ~0.0744

// -- Edge floors (imp-35800 closed forms; reused verbatim; NOT certified moduli) --
const distToNearestInt = (x) => {
  const f = x - Math.floor(x);
  return Math.min(f, 1 - f);
};
const deltaShort = (Delta, gap) => Math.cos((Math.PI * distToNearestInt(Delta / gap)) / 2); // in [1/sqrt2, 1]
const deltaLong = (h, w) => Math.min(w * h, 1); // h-linear, capped at the envelope

// -- Per-edge panel counts from the imp-35777 cap L_panel < pi . delta_edge / B (imp-35806 verbatim) --
const nLong = (Delta, h) => (Delta * B_PROXY) / (Math.PI * deltaLong(h, W_TPT)); // long edge, length Delta
const nShort = (Delta, h) => (2 * h * B_PROXY) / (Math.PI * deltaShort(Delta, GAP_TPT)); // short edge, length 2h
const nTotal = (Delta, h) => 2 * nLong(Delta, h) + 2 * nShort(Delta, h); // whole boundary dR

// -- Table row assembler at the benign corner Delta = m . g --
function panelRow(m, h) {
  const Delta = m * GAP_TPT; // integer mean gaps => delta_short = 1, encloses ~m zeros
  const NL = nLong(Delta, h);
  const NS = nShort(Delta, h);
  const NT = 2 * NL + 2 * NS;
  return {
    m,
    heightOverSat: h * W_TPT, // u = w h (1 at the corner)
    nLong: NL, // per long edge
    nShort: NS, // per short edge
    nTotal: NT, // whole boundary
    nTotalPerZero: NT / m, // -> 2 as m -> inf
  };
}

// (A) CORNER ladder: N_long, N_short, N_total at h = 1/w exactly, over m.
const CORNER_LADDER = [1, 2, 3, 5, 10, 20, 50, 100].map((m) => panelRow(m, H_SAT));

// (B) HEIGHT ladder: N_long, N_short, N_total as u = w h sweeps through the corner at fixed m = 5.
const HEIGHT_LADDER_M = 5;
const HEIGHT_LADDER = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((u) =>
  panelRow(HEIGHT_LADDER_M, u * H_SAT)
);

export const IMP35867_BOUNDARY_PANEL_COUNT_TABULATION = {
  id: 'imp-35867',
  proofSection: 'S-frontier',
  question:
    'Measure the imp-35806 total boundary panel count N_total(Delta, h) = 2 N_long + 2 N_short at the derived ' +
    'benign corner (Delta = m . mean-gap, h ~ 1/w) on the T_PT = 3e12 OOM model, tabulating N_long, N_short and ' +
    'N_total as the enclosed-zero count m and off-axis height h vary near h ~ 1/w. Measurement only; reuses the ' +
    'imp-35806 machinery; evaluates no true |H_t| on any edge; certifies no cap; changes no bound; NO QED.',
  closedForms: {
    nLong: 'N_long(m, h) = Delta . w / (pi . min(w h, 1)) = m / min(u, 1), u = w h',
    nShort: 'N_short(m, h) = 2 h w / pi = 2 u / pi (delta_short = 1 at integer gaps)',
    nTotal: 'N_total(m, h) = 2 N_long + 2 N_short = 2 m / min(u, 1) + 4 u / pi',
    cornerValue: 'at u = 1 (h = 1/w): N_long = m, N_short = 2/pi ~ 0.6366, N_total = 2 m + 4/pi',
  },
  cornerLadder: CORNER_LADDER,
  heightLadder: { m: HEIGHT_LADDER_M, rows: HEIGHT_LADDER },
  finding:
    'the finite panel budget the I2/I3 winding certificate needs is O(m) with its SMALLEST value AT the benign ' +
    'corner h = 1/w. Corner ladder: N_long = m, N_short = 2/pi ~ 0.6366, N_total = 2 m + 4/pi, per-zero budget ' +
    '2 + 4/(pi m) -> 2 as m grows (e.g. m = 5 gives N_total ~ 11.27, ~2.25 panels/zero; m = 100 gives ' +
    'N_total ~ 201.27, ~2.013 panels/zero). Height ladder at m = 5: N_total(u) is convex with its numeric minimum ' +
    'AT u = 1 -- below saturation (u < 1) N_long = m/u rises and dominates, above saturation (u > 1) N_long floors ' +
    'at m while N_short = 2u/pi keeps rising. The budget never diverges on either ladder: a small, explicitly ' +
    'finite panel count at the T_PT = 3e12 scale.',
  windingRateTPT: W_TPT,
  meanZeroGapTPT: GAP_TPT,
  saturationHeight: H_SAT,
  bProxy: B_PROXY,
  isRigorous: false,
  verdict:
    'MEASUREMENT on the shared normalised OOM model (frontier-direction, NOT rigorous). Reusing the imp-35806 ' +
    'nLong/nShort/nTotal machinery verbatim (B = w, delta_long(h) = min(w h, 1), delta_short = cos(pi . dist(.)/2)), ' +
    'this tabulates the finite boundary panel count the I2/I3 certificate would require at the derived benign corner. ' +
    'CORNER LADDER (h = 1/w, m = 1..100): N_long = m, N_short = 2/pi ~ 0.6366, N_total = 2 m + 4/pi, per-zero budget ' +
    '2 + 4/(pi m) -> 2. HEIGHT LADDER (m = 5, u = w h = 0.25..2.0): N_total(u) = 10/min(u,1) + 4u/pi is convex with ' +
    'its numeric minimum AT u = 1 (the corner), confirming the imp-35806 argmin. The budget stays finite and O(m) ' +
    'across both ladders. MEASUREMENT ONLY: the floors and B = w are OOM stand-ins, NOT certified moduli; the counts ' +
    'are normalised panel COUNTS, not certified counts of any real rectangle. Evaluates no true |H_t| or ' +
    '|H_t prime|; lower-bounds no inf|H_t prime|; fixes no Delta or h for any real rectangle; certifies no cap; ' +
    'certifies no delta > 0; establishes no positivity; I3 stays GREENFIELD downstream of W1; changes no bound; ' +
    'C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35806 (joint budget N_total(Delta,h); derived corner (m g, 1/w), budget 2m+4/pi); imp-35800 (floor-only ' +
    'argmax: saturation corner h = 1/w); imp-35778 (delta = min(delta_short, delta_long)); imp-35777 (per-panel cap ' +
    'L_panel < pi.delta/B; N_edge = L_edge.B/(pi.delta_edge)); imp-35757 (mean zero gap g ~ 0.2336); Polymath15 2019 ' +
    '(H_t = A + B - C, barrier method); Platt-Trudgian 2021.',
};

export const IMP35867_BOUNDARY_PANEL_COUNT_TABULATION_ASSERTIONS = [
  {
    // The corner ladder reproduces the imp-35806 closed form: N_long = m, N_short = 2/pi, N_total = 2m + 4/pi.
    id: 'imp35867-corner-ladder-matches-2m-plus-4-over-pi',
    description: 'at h = 1/w: N_long = m, N_short = 2/pi ~ 0.6366, N_total = 2 m + 4/pi for every m on the ladder',
    holds: () =>
      CORNER_LADDER.length === 8 &&
      CORNER_LADDER.every(
        (r) =>
          Math.abs(r.nLong - r.m) < 1e-9 &&
          Math.abs(r.nShort - 2 / Math.PI) < 1e-9 &&
          Math.abs(r.nTotal - (2 * r.m + 4 / Math.PI)) < 1e-9 &&
          Math.abs(r.heightOverSat - 1) < 1e-12
      ),
  },
  {
    // Per-zero budget N_total/m = 2 + 4/(pi m) decreases strictly toward 2 as m grows, staying > 2 for finite m.
    id: 'imp35867-per-zero-budget-decreases-toward-2',
    description: 'N_total/m = 2 + 4/(pi m): strictly decreasing in m, > 2 for finite m, -> 2 (m=100 gives ~2.013)',
    holds: () => {
      const perZero = CORNER_LADDER.map((r) => r.nTotalPerZero);
      const strictlyDecreasing = perZero.every((v, i) => i === 0 || v < perZero[i - 1] - 1e-9);
      const allAboveTwo = CORNER_LADDER.every((r) => r.nTotalPerZero > 2);
      const last = CORNER_LADDER[CORNER_LADDER.length - 1]; // m = 100
      return (
        strictlyDecreasing &&
        allAboveTwo &&
        Math.abs(last.nTotalPerZero - (2 + 4 / (Math.PI * 100))) < 1e-9 &&
        last.nTotalPerZero < 2.02
      );
    },
  },
  {
    // The height ladder N_total(u) is convex with its numeric minimum AT the corner u = 1 (matches imp-35806 argmin).
    id: 'imp35867-height-ladder-minimum-at-corner',
    description: 'N_total(u) = 2m/min(u,1) + 4u/pi over u in {0.25..2.0} at m=5: strict numeric minimum AT u = 1',
    holds: () => {
      const rows = HEIGHT_LADDER;
      if (rows.length !== 7) return false;
      const cornerIdx = rows.findIndex((r) => Math.abs(r.heightOverSat - 1) < 1e-12);
      if (cornerIdx < 0) return false;
      const cornerN = rows[cornerIdx].nTotal;
      // Every non-corner row must have a strictly larger total (the corner is the argmin).
      const cornerIsMin = rows.every((r, i) => i === cornerIdx || r.nTotal > cornerN + 1e-9);
      // Corner value = 2m + 4/pi with m = 5.
      const cornerMatches = Math.abs(cornerN - (2 * HEIGHT_LADDER_M + 4 / Math.PI)) < 1e-9;
      return cornerIsMin && cornerMatches;
    },
  },
  {
    // Below saturation the long edges dominate (N_long > N_short); above saturation N_long floors at m.
    id: 'imp35867-edge-family-crossover-across-saturation',
    description: 'u<1: N_long = m/u rises above m; u>=1: N_long floors at m while N_short = 2u/pi keeps rising',
    holds: () => {
      const below = HEIGHT_LADDER.find((r) => Math.abs(r.heightOverSat - 0.5) < 1e-12); // u = 0.5
      const above = HEIGHT_LADDER.find((r) => Math.abs(r.heightOverSat - 2.0) < 1e-12); // u = 2.0
      if (!below || !above) return false;
      return (
        Math.abs(below.nLong - HEIGHT_LADDER_M / 0.5) < 1e-9 && // N_long = m/u > m
        below.nLong > HEIGHT_LADDER_M &&
        Math.abs(above.nLong - HEIGHT_LADDER_M) < 1e-9 && // N_long floored at m past saturation
        Math.abs(above.nShort - (2 * 2.0) / Math.PI) < 1e-9 // N_short = 2u/pi still rising
      );
    },
  },
  {
    // Anchors are pinned and the tabulation reuses the imp-35806 quantities (w, gap, h_sat, B).
    id: 'imp35867-anchors-reuse-imp35806-machinery',
    description: 'w(T_PT) ~ 13.446, gap ~ 0.2336, h_sat = 1/w, B = w, w . gap = pi (imp-35806 machinery reused)',
    holds: () =>
      Math.abs(W_TPT - 13.446) < 5e-3 &&
      Math.abs(GAP_TPT - 0.2336) < 5e-4 &&
      Math.abs(W_TPT * GAP_TPT - Math.PI) < 1e-9 &&
      Math.abs(W_TPT * H_SAT - 1) < 1e-12 &&
      Math.abs(B_PROXY - W_TPT) < 1e-12,
  },
  {
    // Honesty gate: measurement on OOM model only, no positivity, no cap, no delta>0, no QED, no refereed bound is changed.
    id: 'imp35867-honesty-gate-no-qed',
    description: 'OOM measurement only; certifies no cap; certifies no delta>0; establishes no positivity; changes no bound; NO QED; no refereed bound is changed',
    holds: () =>
      IMP35867_BOUNDARY_PANEL_COUNT_TABULATION.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /certifies no cap/.test(IMP35867_BOUNDARY_PANEL_COUNT_TABULATION.verdict) &&
      /certifies no delta > 0/.test(IMP35867_BOUNDARY_PANEL_COUNT_TABULATION.verdict) &&
      /establishes no positivity/.test(IMP35867_BOUNDARY_PANEL_COUNT_TABULATION.verdict) &&
      /GREENFIELD/.test(IMP35867_BOUNDARY_PANEL_COUNT_TABULATION.verdict) &&
      /NO QED/.test(IMP35867_BOUNDARY_PANEL_COUNT_TABULATION.verdict) &&
      /refereed bound is changed/i.test(IMP35867_BOUNDARY_PANEL_COUNT_TABULATION.verdict),
  },
];

for (const a of IMP35867_BOUNDARY_PANEL_COUNT_TABULATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35867-boundary-panel-count-tabulation assertion failed: ${a.id}`);
  }
}
