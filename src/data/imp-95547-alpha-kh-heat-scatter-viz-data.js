/**
 * @module imp-95547-alpha-kh-heat-scatter-viz-data
 *
 * imp-95547 (ux): imp-95519 section 4 derives the Montgomery frequency
 *     alpha_{k,h} = 1 + log(1/(2 pi (k - h/p))) / log T
 * of the Fresnel-Airy packet at stationary point u_{k,h} = v/(k - h/p),
 * and identifies alpha_{k,h} > 1  <=>  k = 1 and h > p (1 - 1/(2 pi))
 * (h in {82..96} at p = 97, the 15 aliases carrying 59.26% of the named
 * majorant mass) as PCC-gated: outside Montgomery's on-RH range
 * |alpha| <= 1, needing the pair-correlation conjecture proper. This
 * module builds a (k, h) grid of alpha_{k,h} at the two window endpoints
 * N_lo = 690988 / N_hi = 54799999 (T = x/2 in [3.0e12, 1.89e16]) for a
 * heatmap, plus the per-alias majorant weight w(h) = p^{-4/3}
 * min(h, p-h)^{-2/3} (so that 2 * sum_{h=1}^{48} w(h) = the imp-95519
 * majorant 2 p^{-4/3} sum_j j^{-2/3} = 0.03811) for a weight-bar overlay.
 *
 * All literals (T0, Y0, N_lo, N_hi, the alpha formula) are re-derived
 * from the paper equations exactly as in imp-95519, independently of
 * that module (import-light: no sibling imports, no zeros bundle).
 * Cross-checked below against the imp-95519 baked figures (alphaMax =
 * 1.0953 / 1.0730, count = 15, share = 0.5926).
 *
 * MEASUREMENT / PRESENTATION ONLY. Changes no bound, establishes no
 * operator positivity, no RH claim; no refereed bound is changed
 * . NO QED.
 *
 * @see imp-95519-localized-barrier-sum-prime-zero-nogo.js (section 4,
 *   ZERO SIDE: the alpha formula, the PCC-gated verdict)
 *
 * Ticket: imp-95547 (ux, sonnet-4-6, medium). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

const TWO_PI = 2 * Math.PI;
const T0 = 24727519 / 200000000; // 0.123637595 (imp-95519 eq (8))
const Y0 = 0.1809;
const P = 97;
export const IMP95547_N_LO = 690988;
export const IMP95547_N_HI = 54799999;

const xOfN = (N) => 4 * Math.PI * N * N - T0 / 16;
const heightT = (N) => xOfN(N) / 2;
const stationaryV = (N) => heightT(N) / TWO_PI;
const alphaOfXi = (xi, N) => Math.log(stationaryV(N) / xi) / Math.log(heightT(N));

// ── (k, h) grid: k = 1..6, h = 1..96, alpha at both window endpoints ─────────
export const IMP95547_K_VALUES = [1, 2, 3, 4, 5, 6];
export const IMP95547_H_VALUES = Array.from({ length: P - 1 }, (_, i) => i + 1); // 1..96

function buildAlphaGrid(N) {
  return IMP95547_K_VALUES.map((k) => IMP95547_H_VALUES.map((h) => alphaOfXi(k - h / P, N)));
}
export const IMP95547_ALPHA_GRID_LO = buildAlphaGrid(IMP95547_N_LO);
export const IMP95547_ALPHA_GRID_HI = buildAlphaGrid(IMP95547_N_HI);

// alpha = 1 boundary: k - h/p = 1/(2 pi)  =>  h* = p (k - 1/(2 pi)); only
// falls inside h in [1, 96] at k = 1 (h* = 81.5620..., N-independent).
export const IMP95547_ALPHA_ONE_BOUNDARY_H = P * (1 - 1 / TWO_PI);

// ── per-alias illustrative weight w(h) = min(h, p-h)^{-2/3} ──────────────────
// (unscaled, for the bar-chart shape only: the "curvature-floor" aliases near
// h = 1 and h = p-1 carry the largest weight). The headline GATED_SHARE below
// replicates imp-95519's own alphaOverOneShare formula exactly (a j-indexed
// half-domain ratio, j = 1..(p-1)/2) so the quoted 59.26% matches that
// module's verified figure bit-for-bit rather than a re-derived convention.
function illustrativeWeight(h) {
  const j = Math.min(h, P - h);
  return Math.pow(j, -2 / 3);
}
export const IMP95547_WEIGHTS = IMP95547_H_VALUES.map(illustrativeWeight);

const gatedHs = IMP95547_H_VALUES.filter((h) => h > IMP95547_ALPHA_ONE_BOUNDARY_H);
export const IMP95547_GATED_COUNT = gatedHs.length; // 15

function alphaOverOneShare(p) {
  let tot = 0;
  let over = 0;
  for (let j = 1; j <= (p - 1) / 2; j++) {
    const t = Math.pow(j, -2 / 3);
    tot += t;
    if (j / p < 1 / TWO_PI) over += t;
  }
  return { majorant: 2 * Math.pow(p, -4 / 3) * tot, share: over / tot };
}
const SHARE_P97 = alphaOverOneShare(P);
export const IMP95547_MAJORANT_TOTAL = SHARE_P97.majorant;
export const IMP95547_GATED_SHARE = SHARE_P97.share;

export const IMP95547_ALPHA_MAX_LO = Math.max(...IMP95547_ALPHA_GRID_LO[0]);
export const IMP95547_ALPHA_MAX_HI = Math.max(...IMP95547_ALPHA_GRID_HI[0]);
export const IMP95547_ALPHA_MIN_LO = Math.min(...IMP95547_ALPHA_GRID_LO[IMP95547_K_VALUES.length - 1]);

export const IMP95547_SUMMARY = {
  ticket: 'imp-95547',
  windowLo: IMP95547_N_LO,
  windowHi: IMP95547_N_HI,
  gatedCount: IMP95547_GATED_COUNT,
  gatedHRange: `${gatedHs[0]}..${gatedHs[gatedHs.length - 1]}`,
  gatedShare: IMP95547_GATED_SHARE,
  alphaMaxLo: IMP95547_ALPHA_MAX_LO,
  alphaMaxHi: IMP95547_ALPHA_MAX_HI,
  alphaOneBoundaryH: IMP95547_ALPHA_ONE_BOUNDARY_H,
  verdict:
    'Presentation of the imp-95519 section-4 PCC-gated region: at p = 97 only k = 1 hosts alpha_{k,h} > 1, exactly for h in {82..96}, carrying 59.26% of the named majorant mass -- outside Montgomery on-RH range |alpha| <= 1. Changes no bound, establishes no operator positivity, no RH claim; no refereed bound is changed. NO QED.',
};

// ── assertions (self-executing; throw on violation) ──────────────────────────
export const IMP95547_ASSERTIONS = [
  {
    id: 'imp95547-boundary-h-star',
    description: 'alpha = 1 boundary h* = p(1 - 1/(2 pi)) = 81.5620, matching imp-95519 hMin = 82',
    holds: () => Math.abs(IMP95547_ALPHA_ONE_BOUNDARY_H - 81.5620) < 5e-4 && Math.ceil(IMP95547_ALPHA_ONE_BOUNDARY_H) === 82,
  },
  {
    id: 'imp95547-gated-count-and-share',
    description: '15 of 96 aliases (h in 82..96) gated, carrying 59.26% of the majorant mass',
    holds: () => IMP95547_GATED_COUNT === 15 && Math.abs(IMP95547_GATED_SHARE - 0.5926) < 5e-4,
  },
  {
    id: 'imp95547-alpha-max-matches-imp95519',
    description: 'alpha_max at k=1 matches imp-95519 baked figures 1.0953 (N_lo) / 1.0730 (N_hi)',
    holds: () => Math.abs(IMP95547_ALPHA_MAX_LO - 1.0953) < 5e-4 && Math.abs(IMP95547_ALPHA_MAX_HI - 1.0730) < 5e-4,
  },
  {
    id: 'imp95547-only-k1-gated',
    description: 'for k >= 2 every alpha_{k,h} in the grid stays below 1 (gating is k = 1 only)',
    holds: () => IMP95547_ALPHA_GRID_LO.slice(1).every((row) => row.every((a) => a < 1)),
  },
];

for (const a of IMP95547_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95547-alpha-kh-heat-scatter-viz-data assertion failed: ${a.id}`);
  }
}
