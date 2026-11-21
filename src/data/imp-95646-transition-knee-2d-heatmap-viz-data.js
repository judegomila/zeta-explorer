/**
 * imp-95646: import-light heatmap viz-data for the imp-95617 joint (C_C, E_trunc) 2-D sweep.
 * Re-implements the imp-95617 numeric kernel standalone (no imports, no 16.7MB zeros bundle) at a
 * denser, render-friendly grid resolution over the same [0.5x, 1.5x] x [0.5x, 1.5x] multiplier box,
 * so the low-C_C / high-E_trunc inversion wedge, the rising inversion contour, and the pinned point's
 * multiplier-space margin from it can be shaded and marked on an SVG heatmap.
 *
 * MEASUREMENT ONLY. Changes no bound; NO QED; no refereed bound is changed.
 *
 * @see imp-95617-transition-knee-ordering-joint-2d (source sweep this re-plots)
 */

// ---------------------------------------------------------------------------
// Numeric kernel (import-light: standalone reimplementation, no imports)
// ---------------------------------------------------------------------------

function effectiveHeightForN(N) {
  if (!(N > 0) || !Number.isFinite(N)) return 0;
  const twoPi = 2 * Math.PI;
  let T = Math.max(twoPi * Math.E, (twoPi * N) / Math.max(1, Math.log(N + twoPi)));
  for (let i = 0; i < 40; i++) {
    const u = Math.log(T / twoPi);
    const f = (T / twoPi) * (u - 1) - N;
    const fp = u / twoPi;
    if (!(Math.abs(fp) > 0) || !Number.isFinite(fp)) break;
    const dT = f / fp;
    T -= dT;
    if (!(T > twoPi)) T = twoPi * 1.0001;
    if (Math.abs(dT) < 1e-9 * Math.max(1, T)) break;
  }
  return T;
}

const TWO_PI = 2 * Math.PI;
const C_C_PINNED = (1 / 8) * Math.sqrt(3 * Math.PI);
const E_TRUNC_PT = 3.06e-5;
const GRONWALL = Math.exp(2.37e-4);

function lnSigmaFull(x, C_C, E_trunc) {
  const N = Math.exp(x);
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C * Math.sqrt(L / N);
  return Math.log(E_coll / (E_trunc + E_flow + E_coll));
}
function pLocal(x, h, C_C, E_trunc) {
  return -(lnSigmaFull(x + h, C_C, E_trunc) - lnSigmaFull(x - h, C_C, E_trunc)) / (2 * h);
}
function pSecond(x, h, C_C, E_trunc) {
  return (
    (pLocal(x + h, h, C_C, E_trunc) - 2 * pLocal(x, h, C_C, E_trunc) + pLocal(x - h, h, C_C, E_trunc)) /
    (h * h)
  );
}
function bisect(f, a, b, iters) {
  let fa = f(a);
  for (let i = 0; i < iters; i++) {
    const m = (a + b) / 2;
    const fm = f(m);
    if (Math.sign(fm) === Math.sign(fa)) {
      a = m;
      fa = fm;
    } else {
      b = m;
    }
  }
  return (a + b) / 2;
}
function crossoverLog10(C_C, E_trunc) {
  const A = C_C / E_trunc;
  let N = 3e9;
  for (let i = 0; i < 300; i++) N = A * A * Math.log(effectiveHeightForN(N));
  return Math.log10(N);
}
function kneeLog10(C_C, E_trunc) {
  const x = bisect((xx) => pSecond(xx, 1e-3, C_C, E_trunc), Math.log(1e5), Math.log(1e14), 120);
  return x / Math.LN10;
}
function gap(C_C, E_trunc) {
  return kneeLog10(C_C, E_trunc) - crossoverLog10(C_C, E_trunc);
}
function cCInvertMult(me) {
  let lo = 0.1;
  let hi = 1.5;
  for (let i = 0; i < 60; i++) {
    const m = (lo + hi) / 2;
    if (gap(C_C_PINNED * m, E_TRUNC_PT * me) < 0) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}

// ---------------------------------------------------------------------------
// Baked grid: C_C and E_trunc multiplier in [0.5, 1.5], linear, N_GRID steps each
// (denser than the source imp-95617 7x7 band for a smoother heatmap).
// ---------------------------------------------------------------------------

const N_GRID = 15;
const MULT_LO = 0.5;
const MULT_HI = 1.5;
const multAt = (i) => MULT_LO + ((MULT_HI - MULT_LO) * i) / (N_GRID - 1);

// rows = C_C multiplier, cols = E_trunc multiplier (matches imp-95617's GRID convention)
export const IMP95646_HEATMAP_CC_LABELS = Array.from({ length: N_GRID }, (_, i) =>
  Number(multAt(i).toFixed(4)),
);
export const IMP95646_HEATMAP_ETRUNC_LABELS = Array.from({ length: N_GRID }, (_, i) =>
  Number(multAt(i).toFixed(4)),
);

// Z[i][j]: row i (C_C mult) x col j (E_trunc mult) -> gap = log10 N_knee - log10 N_cross
export const IMP95646_HEATMAP_Z = IMP95646_HEATMAP_CC_LABELS.map((mc) =>
  IMP95646_HEATMAP_ETRUNC_LABELS.map((me) => +gap(C_C_PINNED * mc, E_TRUNC_PT * me).toFixed(6)),
);

let MIN_GAP = Infinity;
let MIN_AT = null;
let MAX_GAP = -Infinity;
IMP95646_HEATMAP_CC_LABELS.forEach((mc, i) =>
  IMP95646_HEATMAP_ETRUNC_LABELS.forEach((me, j) => {
    const g = IMP95646_HEATMAP_Z[i][j];
    if (g < MIN_GAP) {
      MIN_GAP = g;
      MIN_AT = { cC_mult: mc, eTrunc_mult: me };
    }
    if (g > MAX_GAP) MAX_GAP = g;
  }),
);

export const IMP95646_MIN_GAP_POINT = { ...MIN_AT, gap: +MIN_GAP.toFixed(6) };
export const IMP95646_MAX_GAP = +MAX_GAP.toFixed(6);

// Inversion contour: for each E_trunc mult in the box, the C_C mult where gap crosses 0 (rising curve).
// Points whose crossing falls below the visible C_C range are flagged offGrid (dashed / wedge fully
// covers that column) rather than clipped away.
const N_CONTOUR = 25;
export const IMP95646_INVERSION_CONTOUR = Array.from({ length: N_CONTOUR }, (_, k) => {
  const me = MULT_LO + ((MULT_HI - MULT_LO) * k) / (N_CONTOUR - 1);
  const cCinv = cCInvertMult(me);
  return {
    eTrunc_mult: Number(me.toFixed(4)),
    cC_invert_mult: Number(cCinv.toFixed(5)),
    offGrid: cCinv < MULT_LO,
  };
});

// Box-corner inversion onset: smallest E_trunc mult at which the contour reaches the 0.5x box floor.
let elo = 0.5;
let ehi = 2.0;
for (let i = 0; i < 60; i++) {
  const m = (elo + ehi) / 2;
  if (cCInvertMult(m) < MULT_LO) elo = m;
  else ehi = m;
}
export const IMP95646_BOX_INVERSION_ONSET_E_TRUNC_MULT = Number(((elo + ehi) / 2).toFixed(5));

export const IMP95646_PINNED_POINT = {
  cC_mult: 1,
  eTrunc_mult: 1,
  gap: +gap(C_C_PINNED, E_TRUNC_PT).toFixed(5),
};

let D_MIN = Infinity;
let D_AT = null;
IMP95646_INVERSION_CONTOUR.forEach((p) => {
  const d = Math.hypot(p.cC_invert_mult - 1, p.eTrunc_mult - 1);
  if (d < D_MIN) {
    D_MIN = d;
    D_AT = p;
  }
});
export const IMP95646_PINNED_DISTANCE_TO_CONTOUR = { distance: +D_MIN.toFixed(5), nearest: D_AT };

export const IMP95646_SUMMARY = {
  gridScope: `C_C multiplier in [${MULT_LO}, ${MULT_HI}] (${N_GRID} steps), E_trunc multiplier in [${MULT_LO}, ${MULT_HI}] (${N_GRID} steps), re-plotting imp-95617`,
  minGap: IMP95646_MIN_GAP_POINT.gap,
  minGapAt: { cC_mult: IMP95646_MIN_GAP_POINT.cC_mult, eTrunc_mult: IMP95646_MIN_GAP_POINT.eTrunc_mult },
  pinnedGap: IMP95646_PINNED_POINT.gap,
  pinnedDistanceToContour: IMP95646_PINNED_DISTANCE_TO_CONTOUR.distance,
  boxInversionOnsetETruncMult: IMP95646_BOX_INVERSION_ONSET_E_TRUNC_MULT,
  verdict:
    'MEASUREMENT ONLY; changes no bound; NO QED; no refereed bound is changed. ' +
    'Re-plots the imp-95617 joint 2-D sweep at a denser render-friendly resolution.',
};

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP95646_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp95646-grid-shapes-match-labels',
    holds: () =>
      IMP95646_HEATMAP_Z.length === N_GRID && IMP95646_HEATMAP_Z.every((row) => row.length === N_GRID),
  },
  {
    id: 'imp95646-corner-inverts-others-do-not',
    // low-C_C / high-E_trunc corner (0.5x, 1.5x) is negative; the opposite corner (1.5x, 0.5x) is not.
    holds: () =>
      IMP95646_HEATMAP_Z[0][N_GRID - 1] < 0 &&
      IMP95646_HEATMAP_Z[N_GRID - 1][0] > 0 &&
      IMP95646_MIN_GAP_POINT.cC_mult === MULT_LO &&
      IMP95646_MIN_GAP_POINT.eTrunc_mult === MULT_HI,
  },
  {
    id: 'imp95646-contour-rising-in-eTrunc',
    holds: () =>
      IMP95646_INVERSION_CONTOUR[0].cC_invert_mult <
      IMP95646_INVERSION_CONTOUR[IMP95646_INVERSION_CONTOUR.length - 1].cC_invert_mult,
  },
  {
    id: 'imp95646-pinned-point-half-mult-margin',
    holds: () =>
      IMP95646_PINNED_DISTANCE_TO_CONTOUR.distance > 0.45 &&
      IMP95646_PINNED_DISTANCE_TO_CONTOUR.distance < 0.55,
  },
  {
    id: 'imp95646-honesty-gate-no-qed',
    holds: () => /NO QED/.test(IMP95646_SUMMARY.verdict) && /refereed bound is changed/i.test(IMP95646_SUMMARY.verdict),
  },
];

for (const a of IMP95646_VIZ_DATA_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95646-transition-knee-2d-heatmap-viz-data assertion failed: ${a.id}`);
  }
}
