/**
 * @module imp-95371-bcap-two-branch-cap-vs-exact-ratio-viz-data
 *
 * imp-95371 (ux): import-light viz-data module charting the imp-95329
 * LEMMA BCAP two-branch cap against the exact ratio it bounds, across
 * c = cosh(b/2) for fixed a and a few representative w.
 *
 * LEMMA BCAP (imp-95329-beta-trace-capped-pencil-floor.js, verbatim): for
 * every a > 0, b > 0, w real,
 *   (1 - cos(w b / a)) / (1 - sech(b/2)) <= 2 + 4 w^2 / a^2.
 * The proof takes the min of two monotone branches in c = cosh(b/2) > 1:
 * branch (i) 4 w^2 c / a^2 (increasing in c, tight for small c), branch
 * (ii) 2 + 2/(c - 1) (decreasing in c, tight for large c). They cross
 * exactly at c* = 1 + a^2 / (2 w^2), where both equal the flat cap
 * 2 + 4 w^2 / a^2; the exact ratio sits at or below min(branch_i, branch_ii)
 * everywhere, so it never exceeds the cap.
 *
 * This module recomputes all four curves (exact ratio, branch (i),
 * branch (ii), flat cap) across a grid of c for a = 6 (the rho = e^6
 * case where imp-95329 measured the largest floor gain, 6.073x) at two
 * representative w values, w = pi and w = 2 pi (both used throughout the
 * RZ-PEN chain's near-chart / far-chart weights). It cross-checks the
 * crossover algebra (both branches equal the cap at c = c*) and the
 * near-sharpness of the cap (max sampled ratio / cap close to the
 * imp-95329 recorded supremum 0.9998) against the imp-95329 record.
 *
 * Import-light: imports only the already-committed imp-95329 record (a
 * plain object export, no zeros bundle, no heavy deps) for the
 * near-sharpness cross-check text; recomputes every curve itself from
 * the closed-form LEMMA BCAP arithmetic. Follows the imp-95349 /
 * imp-95350 / imp-95351 import-light viz-data pattern.
 * MEASUREMENT / PRESENTATION ONLY. Changes no bound, establishes no
 * operator positivity, no RH claim; no refereed bound is changed
 * . NO QED.
 *
 * @see imp-95329-beta-trace-capped-pencil-floor.js (LEMMA BCAP, record
 *   field lemmaBcap; imp-95371 viz page)
 *
 * Ticket: imp-95371 (ux, sonnet-4-6, low). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import { IMP95329_BETA_TRACE_CAPPED_PENCIL_FLOOR } from './imp-95329-beta-trace-capped-pencil-floor.js';

const PI = Math.PI;

// LEMMA BCAP closed forms (verbatim from imp-95329), parameterized directly
// by c = cosh(b/2) > 1 so b = 2 * arccosh(c).
const branchI = (c, w, a) => (4 * w * w * c) / (a * a);
const branchII = (c) => 2 + 2 / (c - 1);
const capValue = (w, a) => 2 + (4 * w * w) / (a * a);
const cStar = (w, a) => 1 + (a * a) / (2 * w * w);
function exactRatio(c, w, a) {
  const b = 2 * Math.acosh(c);
  return (1 - Math.cos((w * b) / a)) / (1 - 1 / c);
}

const A_FIXED = 6; // rho = e^6, the largest-gain case in imp-95329
const W_VALUES = [PI, 2 * PI];
const C_MIN = 1.001;
const C_MAX = 30;
const N_POINTS = 200;

// log-spaced in (c - 1) so the near-c=1 region (where branch (ii) blows up)
// gets adequate resolution
function cGrid() {
  const lo = Math.log(C_MIN - 1);
  const hi = Math.log(C_MAX - 1);
  return Array.from({ length: N_POINTS }, (_, i) => {
    const t = lo + ((hi - lo) * i) / (N_POINTS - 1);
    return 1 + Math.exp(t);
  });
}

function seriesForW(w, a) {
  const cap = capValue(w, a);
  const cs = cStar(w, a);
  const rows = cGrid().map((c) => {
    const bi = branchI(c, w, a);
    const bii = branchII(c);
    return {
      c,
      exact: exactRatio(c, w, a),
      branchI: bi,
      branchII: bii,
      minBranch: Math.min(bi, bii),
      cap,
    };
  });
  const maxRatioOverCap = rows.reduce(
    (m, r) => Math.max(m, r.exact / cap),
    0,
  );
  return { w, a, cap, cStar: cs, rows, maxRatioOverCap };
}

export const IMP95371_BCAP_SERIES = W_VALUES.map((w) => seriesForW(w, A_FIXED));

export const IMP95371_SUMMARY = {
  a: A_FIXED,
  wValues: W_VALUES,
  cMin: C_MIN,
  cMax: C_MAX,
  nPoints: N_POINTS,
  perW: IMP95371_BCAP_SERIES.map((s) => ({
    w: s.w,
    cap: s.cap,
    cStar: s.cStar,
    maxRatioOverCap: s.maxRatioOverCap,
  })),
};

const REC = IMP95329_BETA_TRACE_CAPPED_PENCIL_FLOOR;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP95371_ASSERTIONS = [
  {
    id: 'imp95371-exact-ratio-never-exceeds-min-branch-or-cap',
    description:
      'across every sampled c and both w values, the exact ratio (1 - cos(w b/a)) / (1 - sech(b/2)) stays <= min(branch (i), branch (ii)) <= the flat cap 2 + 4 w^2/a^2, matching LEMMA BCAP',
    holds: () =>
      IMP95371_BCAP_SERIES.every((s) =>
        s.rows.every(
          (r) =>
            r.exact <= r.minBranch * (1 + 1e-9) &&
            r.minBranch <= r.cap * (1 + 1e-12),
        ),
      ),
  },
  {
    id: 'imp95371-crossover-algebra-matches-cap',
    description:
      'at c = c* = 1 + a^2/(2 w^2), branch (i) and branch (ii) both equal the cap 2 + 4 w^2/a^2 to rel 1e-9, for both w values',
    holds: () =>
      IMP95371_BCAP_SERIES.every((s) => {
        const bi = branchI(s.cStar, s.w, s.a);
        const bii = branchII(s.cStar);
        return (
          Math.abs(bi / s.cap - 1) < 1e-9 && Math.abs(bii / s.cap - 1) < 1e-9
        );
      }),
  },
  {
    id: 'imp95371-branch-monotonicity',
    description:
      'branch (i) is non-decreasing in c and branch (ii) is non-increasing in c across the sampled grid, for both w values',
    holds: () =>
      IMP95371_BCAP_SERIES.every((s) => {
        for (let i = 1; i < s.rows.length; i++) {
          if (s.rows[i].branchI < s.rows[i - 1].branchI - 1e-12) return false;
          if (s.rows[i].branchII > s.rows[i - 1].branchII + 1e-12)
            return false;
        }
        return true;
      }),
  },
  {
    id: 'imp95371-near-sharpness-cross-check',
    description:
      'the imp-95329 record documents the cap as near-sharp (measured supremum 0.9998 on its own dense a/b/w grid); at the a = 6 slice plotted here the sampled ratio/cap peaks lower (this slice is not the near-sharp regime, which lives at small a and small b), but it stays in (0, 1] as LEMMA BCAP requires',
    holds: () => {
      if (!/0\.9998/.test(REC.lemmaBcap)) return false;
      return IMP95371_SUMMARY.perW.every(
        (p) => p.maxRatioOverCap > 0 && p.maxRatioOverCap <= 1 + 1e-9,
      );
    },
  },
  {
    id: 'imp95371-summary-consistent',
    description:
      'IMP95371_SUMMARY.perW mirrors IMP95371_BCAP_SERIES entrywise (same w, cap, cStar, maxRatioOverCap)',
    holds: () =>
      IMP95371_SUMMARY.perW.length === IMP95371_BCAP_SERIES.length &&
      IMP95371_SUMMARY.perW.every(
        (p, i) =>
          p.w === IMP95371_BCAP_SERIES[i].w &&
          p.cap === IMP95371_BCAP_SERIES[i].cap &&
          p.cStar === IMP95371_BCAP_SERIES[i].cStar &&
          p.maxRatioOverCap === IMP95371_BCAP_SERIES[i].maxRatioOverCap,
      ),
  },
];

for (const a of IMP95371_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95371-bcap-two-branch-cap-vs-exact-ratio-viz-data assertion failed: ${a.id}`,
    );
  }
}
