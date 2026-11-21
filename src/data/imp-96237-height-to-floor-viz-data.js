/**
 * @module imp-96237-height-to-floor-viz-data
 *
 * imp-96237 (ux): import-light viz-data leaf for the imp-96207 height-to-floor law
 * H_required(E) = (prefactor / E)^(1/kappa_star). imp-96207 tabulated the law and
 * the three threshold rows but shipped with no chart surface.
 *
 * Reshapes the imp-96207 baked table into chart-ready log-log points (log10 H vs
 * log10 E), samples the continuous law across the plotted range using the same
 * baked (prefactor, kappa_star) verbatim -- no re-derivation -- and carries the
 * frozen T_PT baseline / floor contrast marker for the annotation.
 *
 * MEASUREMENT / PRESENTATION ONLY. Every anchor, threshold row, and sensitivity
 * value is copied verbatim from the imp-96207 baked `anchors`/`table`/`sensitivity`
 * fields; only the log-log SAMPLING (evaluating the already-derived law at plot
 * resolution) is computed here. Changes no bound, establishes no operator
 * positivity, no RH claim; no refereed bound is changed. RH open.
 * NO QED.
 *
 * @see imp-96207-verified-height-floor-law-kappa-star.js (law, anchors, table)
 *
 * Ticket: imp-96237 (ux, sonnet-4-6, medium). Presentation only, RH-free; changes no bound; NO QED.
 */

import { IMP96207_VERIFIED_HEIGHT_FLOOR_LAW_KAPPA_STAR } from './imp-96207-verified-height-floor-law-kappa-star.js';

const SRC = IMP96207_VERIFIED_HEIGHT_FLOOR_LAW_KAPPA_STAR;

const { kappaStar: KAPPA_STAR, prefactor: PREFACTOR, T_PT_baseline: T_PT_BASELINE, frozenFloorBaseline: E_TRUNC_BASELINE } = SRC.anchors;

// The three baked threshold rows, reshaped to plain (E, H) points.
export const IMP96237_THRESHOLD_POINTS = SRC.table.map((r) => ({
  targetFloor: r.targetFloor,
  requiredHeight: r.requiredHeight,
  logE: Math.log10(r.targetFloor),
  logH: Math.log10(r.requiredHeight),
}));

// Continuous law H_required(E) = (prefactor/E)^(1/kappa_star), sampled at plot
// resolution across the observed floor range (extended slightly past the
// tabulated thresholds so the line visibly spans the frozen-floor marker too).
function sampleLaw(numSamples) {
  const logEmax = Math.log10(E_TRUNC_BASELINE) + 0.3; // a touch above the frozen floor
  const logEmin = Math.min(...IMP96237_THRESHOLD_POINTS.map((p) => p.logE)) - 0.3;
  const points = [];
  for (let i = 0; i < numSamples; i += 1) {
    const logE = logEmax + ((logEmin - logEmax) * i) / (numSamples - 1);
    const E = Math.pow(10, logE);
    const H = Math.pow(PREFACTOR / E, 1 / KAPPA_STAR);
    points.push({ logE, logH: Math.log10(H) });
  }
  return points;
}

export const IMP96237_LAW_CURVE = sampleLaw(60);

// Frozen Platt-Trudgian baseline / floor contrast marker.
export const IMP96237_BASELINE_MARKER = {
  T_PT: T_PT_BASELINE,
  logT_PT: Math.log10(T_PT_BASELINE),
  frozenFloor: E_TRUNC_BASELINE,
  logFrozenFloor: Math.log10(E_TRUNC_BASELINE),
};

export const IMP96237_ANCHORS = {
  kappaStar: KAPPA_STAR,
  prefactor: PREFACTOR,
  inverseSensitivityExponent: SRC.sensitivity.inverseSensitivityExponent,
  heightDecadesPerFloorDecade: SRC.sensitivity.heightDecadesPerFloorDecade,
  perFloorDecadeHeightFactor: SRC.sensitivity.perFloorDecadeHeightFactor,
};

export const IMP96237_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: the three threshold rows '
  + '(1e-5/1e-6/1e-7) and the kappa_star=0.4/prefactor=3.0 anchors are copied verbatim from the '
  + 'imp-96207 baked table/anchors/sensitivity fields; only the log-log line samples are computed '
  + 'here (evaluating the already-derived law, not re-deriving it). No bound is claimed and no '
  + 'operator positivity is established; reaching the target floor E=0 requires H -> infinity under '
  + 'either named imp-96166 route (imp-96190 collapse).';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96237_ASSERTIONS = [
  {
    id: 'imp96237-three-threshold-points-in-decreasing-floor-order',
    holds: () => IMP96237_THRESHOLD_POINTS.length === 3
      && IMP96237_THRESHOLD_POINTS.every((p, i) => i === 0 || p.targetFloor < IMP96237_THRESHOLD_POINTS[i - 1].targetFloor),
    why: 'imp-96207 tabulates exactly three thresholds 1e-5/1e-6/1e-7 in decreasing floor order.',
  },
  {
    id: 'imp96237-log-log-line-is-straight-slope-minus-1-over-kappa',
    holds: () => {
      const p0 = IMP96237_LAW_CURVE[0];
      const p1 = IMP96237_LAW_CURVE[IMP96237_LAW_CURVE.length - 1];
      const slope = (p1.logH - p0.logH) / (p1.logE - p0.logE);
      return Math.abs(slope - -1 / KAPPA_STAR) < 1e-9;
    },
    why: 'the sampled curve must be exactly linear in log-log space with slope -1/kappa_star = -2.5 (pure evaluation, no re-fit).',
  },
  {
    id: 'imp96237-threshold-points-lie-on-sampled-law',
    holds: () => IMP96237_THRESHOLD_POINTS.every((p) => {
      // r.requiredHeight is already rounded to 4 sig figs (imp-96207 toExponential(4)),
      // so compare on that same scale rather than the exact (unrounded) power.
      const H = Math.pow(PREFACTOR / p.targetFloor, 1 / KAPPA_STAR);
      return Math.abs(Math.log10(H) - p.logH) < 1e-4;
    }),
    why: 'each baked threshold row must reproduce the continuous law evaluated at the same E, to the 4-sig-fig rounding already baked into imp-96207.',
  },
  {
    id: 'imp96237-baseline-marker-matches-frozen-floor',
    holds: () => Math.abs(IMP96237_BASELINE_MARKER.frozenFloor - 3.06e-5) < 1e-6
      && Math.abs(IMP96237_BASELINE_MARKER.T_PT - 3e12) < 1,
    why: 'the frozen imp-96166 branch-A floor contrast marker sits at T_PT=3e12, E_trunc=3.06e-5.',
  },
  {
    id: 'imp96237-anchors-are-kappa-0p4-prefactor-3',
    holds: () => Math.abs(IMP96237_ANCHORS.kappaStar - 0.4) < 1e-12
      && Math.abs(IMP96237_ANCHORS.prefactor - 3.0) < 1e-12
      && Math.abs(IMP96237_ANCHORS.heightDecadesPerFloorDecade - 2.5) < 1e-12,
    why: 'anchors are copied verbatim from the imp-96207 baked module.',
  },
];

for (const a of IMP96237_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96237-height-to-floor-viz-data assertion failed: ${a.id} (${a.why})`);
  }
}
