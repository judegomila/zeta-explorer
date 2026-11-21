/**
 * @module imp-96256-joint-anchor-sweep-viz-data
 *
 * imp-96256 (ux): import-light viz-data leaf for the imp-96227 joint (eps_a, eps_b)
 * Kato-Temple anchor sweep. imp-96238 charted the imp-96206 coupled certify region
 * at only the gap-midpoint anchor; imp-96227 swept the SAME 3-level geometry across
 * the whole admissible anchor alpha in (lam_2, lam_top) but shipped no chart surface.
 *
 * Reshapes the imp-96227 baked anchor-sweep table into three chart-ready series
 * against x = anchor alpha: the pure-bottom worst-case threshold (monotone
 * decreasing, ~1.7828e-3 at the low edge to ~5.893e-4 near lam_top), the
 * equal-split per-channel boundary tracking just below it, and a flat horizontal
 * line at the anchor-INVARIANT coupling strength sqrt(3)/2 ~ 0.8660254.
 *
 * MEASUREMENT / PRESENTATION ONLY. Every threshold value and the coupling constant
 * are copied verbatim from IMP_96227_JOINT_ANCHOR_SWEEP / IMP_96227_LITERALS
 * (imp-96227, not re-derived here); only the chart-axis reshaping is done in this
 * module. Changes no bound, establishes no operator positivity, no RH claim;
 * no refereed bound is changed. RH open. NO QED.
 *
 * @see imp-96227-route-i-kato-temple-joint-anchor-sweep.js (anchor-sweep table, literals)
 *
 * Ticket: imp-96256 (ux, sonnet-4-6, medium). Presentation only, RH-free; changes no bound; NO QED.
 */

import {
  IMP_96227_JOINT_ANCHOR_SWEEP,
  IMP_96227_LITERALS,
} from './imp-96227-route-i-kato-temple-joint-anchor-sweep.js';

const SRC = IMP_96227_LITERALS;

// The seven baked anchor rows (imp-96227), reshaped for direct plotting against alpha.
export const IMP96256_WORST_MAG_SERIES = IMP_96227_JOINT_ANCHOR_SWEEP.map((row) => ({
  alpha: row.alpha,
  worstMag: row.worstMag,
}));

export const IMP96256_EQUAL_SPLIT_SERIES = IMP_96227_JOINT_ANCHOR_SWEEP.map((row) => ({
  alpha: row.alpha,
  equalSplit: row.equalSplit,
}));

// Flat anchor-invariant coupling line at sqrt(3)/2, sampled at the same alpha grid.
export const IMP96256_COUPLING_LINE = IMP_96227_JOINT_ANCHOR_SWEEP.map((row) => ({
  alpha: row.alpha,
  tighten: row.tighten,
}));

export const IMP96256_ANCHORS = {
  lamSecondSigned: SRC.lamSecondSigned,
  lamTop: SRC.lamTop,
  midpointAnchor: SRC.midpointAnchor,
  worstMagLowEdge: SRC.worstMagLowEdge,
  worstMagMidpoint: SRC.worstMagMidpoint,
  worstMagNearTop: SRC.worstMagNearTop,
  couplingTightenRatio: SRC.couplingTightenRatio,
};

export const IMP96256_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every worst-case threshold, '
  + 'equal-split boundary, and the sqrt(3)/2 coupling constant are copied verbatim from the imp-96227 '
  + 'baked anchor-sweep table; only the chart-axis reshaping is computed here (no re-derivation, no '
  + 'new bisection). The underlying sweep uses the exact FFT-Mellin semilocal {oo,2} spectrum '
  + '(Rayleigh-Ritz N=32, not a rigorous enclosure) and a 3-level single-magnitude-per-channel '
  + 'ansatz; no bound is claimed and no operator positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const approx = (x, y, tol) => Math.abs(x - y) <= tol;

const IMP96256_ASSERTIONS = [
  {
    id: 'imp96256-worst-mag-series-matches-source-table',
    holds: () => IMP96256_WORST_MAG_SERIES.every((p, i) => approx(p.worstMag, IMP_96227_JOINT_ANCHOR_SWEEP[i].worstMag, 1e-12)
      && approx(p.alpha, IMP_96227_JOINT_ANCHOR_SWEEP[i].alpha, 1e-12)),
    why: 'the reshaped worst-case-threshold series must reproduce the imp-96227 baked table row-for-row.',
  },
  {
    id: 'imp96256-worst-mag-monotone-decreasing',
    holds: () => IMP96256_WORST_MAG_SERIES.every((p, i) => i === 0 || p.worstMag < IMP96256_WORST_MAG_SERIES[i - 1].worstMag),
    why: 'imp-96227: the pure-bottom worst-case threshold decreases monotonically as the anchor sweeps from lam_2 toward lam_top.',
  },
  {
    id: 'imp96256-equal-split-strictly-below-worst-mag',
    holds: () => IMP96256_EQUAL_SPLIT_SERIES.every((p, i) => p.equalSplit < IMP96256_WORST_MAG_SERIES[i].worstMag),
    why: 'imp-96227: the equal-split per-channel boundary tracks strictly below the pure-bottom worst-case threshold at every anchor.',
  },
  {
    id: 'imp96256-coupling-line-flat-at-sqrt3over2',
    holds: () => IMP96256_COUPLING_LINE.every((p) => approx(p.tighten, Math.sqrt(3) / 2, 1e-7))
      && approx(SRC.couplingTightenRatio, Math.sqrt(3) / 2, 1e-7),
    why: 'imp-96227: the per-channel coupling strength is anchor-invariant, flat at exactly sqrt(3)/2 across the whole gap.',
  },
  {
    id: 'imp96256-endpoints-match-literals',
    holds: () => approx(IMP96256_WORST_MAG_SERIES[IMP96256_WORST_MAG_SERIES.length - 1].worstMag, SRC.worstMagNearTop, 1e-9)
      && approx(IMP_96227_JOINT_ANCHOR_SWEEP.find((r) => approx(r.alpha, SRC.midpointAnchor, 1e-6)).worstMag, SRC.worstMagMidpoint, 1e-9),
    why: 'the near-top and midpoint series values must match the imp-96227 named literal readings.',
  },
];

for (const a of IMP96256_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96256-joint-anchor-sweep-viz-data assertion failed: ${a.id} (${a.why})`);
  }
}
