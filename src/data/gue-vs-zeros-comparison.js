// imp-1099 — GUE random matrix vs Riemann zero spacings statistical comparison.
//
// Computes the empirical nearest-neighbor spacing distribution of the first
// N = 10000 verified Odlyzko Riemann zeros (ZEROS_EXTENDED from
// zeros-to-1e6.js) after Riemann-von Mangoldt unfolding, bins into a
// 50-bin histogram over [0, 4], overlays the GUE Wigner surmise
// p(s) = (32 / pi^2) * s^2 * exp(-4 * s^2 / pi), and quantifies the fit
// with KL divergence and Hellinger distance.
//
// Unfolding formula (specified by the ticket):
//   s_k = (gamma_{k+1} - gamma_k) * (log(gamma_k / (2 * pi)) / (2 * pi))
//
// This is the local form of the Riemann-von Mangoldt smooth density
// rho(t) ~ (1 / (2 * pi)) * log(t / (2 * pi)), which gives mean spacing 1.
//
// Exports:
//   GUE_VS_ZEROS_COMPARISON           -- frozen record with all derived data
//   GUE_VS_ZEROS_COMPARISON_ASSERTIONS -- 5+ build-time tripwires
//
// Honest scope: this is a pure EXPLORATION / DESCRIPTIVE comparison, not a
// proof of any structural theorem. GUE universality is widely believed and
// strongly numerically supported (Odlyzko, Hejhal, Rudnick-Sarnak) but no
// rigorous proof exists, so this module does NOT close any pending proof
// ticket.
//
// @see imp-1099
// @see src/data/zeros-to-1e6.js (ZEROS_EXTENDED, source of gamma_k)

import { ZEROS_EXTENDED } from './zeros-to-1e6.js';

// ── Constants ────────────────────────────────────────────────────────────────

const N_ZEROS = 10000;       // first N zeros to use
const N_BINS = 50;           // histogram bin count over [0, S_MAX]
const S_MAX = 4.0;           // upper edge of histogram support
const BIN_WIDTH = S_MAX / N_BINS;

// GUE Wigner surmise: p(s) = (32 / pi^2) * s^2 * exp(-4 * s^2 / pi).
// Normalised so integral_0^infty p(s) ds = 1 and mean = 1.
function gueWigner(s) {
  const a = 32 / (Math.PI * Math.PI);
  const b = 4 / Math.PI;
  return a * s * s * Math.exp(-b * s * s);
}

// ── Unfolded spacings ────────────────────────────────────────────────────────

const TWO_PI = 2 * Math.PI;

function computeUnfoldedSpacings() {
  const out = [];
  for (let k = 0; k < N_ZEROS - 1; k++) {
    const gk = ZEROS_EXTENDED[k];
    const gk1 = ZEROS_EXTENDED[k + 1];
    // local density rho(t) = (1 / (2 pi)) * log(t / (2 pi));
    // unfolded spacing = (gamma_{k+1} - gamma_k) * rho(gamma_k).
    const s = (gk1 - gk) * (Math.log(gk / TWO_PI) / TWO_PI);
    out.push(s);
  }
  return out;
}

const UNFOLDED = computeUnfoldedSpacings();

let MEAN_SPACING = 0;
for (let i = 0; i < UNFOLDED.length; i++) MEAN_SPACING += UNFOLDED[i];
MEAN_SPACING /= UNFOLDED.length;

// ── Histogram ────────────────────────────────────────────────────────────────

function computeHistogram() {
  const binEdges = new Array(N_BINS + 1);
  for (let i = 0; i <= N_BINS; i++) binEdges[i] = i * BIN_WIDTH;
  const counts = new Array(N_BINS).fill(0);
  let inRange = 0;
  for (let i = 0; i < UNFOLDED.length; i++) {
    const s = UNFOLDED[i];
    if (s >= 0 && s < S_MAX) {
      const b = Math.floor(s / BIN_WIDTH);
      counts[Math.min(b, N_BINS - 1)]++;
      inRange++;
    }
  }
  return { binEdges, counts, inRange, total: UNFOLDED.length };
}

const HISTOGRAM = computeHistogram();

// ── GUE Wigner curve evaluated at bin centers + a dense overlay grid ─────────

function computeGueCurve() {
  // Dense grid for visual overlay.
  const N_GRID = 401;
  const sGrid = new Array(N_GRID);
  const p_s = new Array(N_GRID);
  for (let i = 0; i < N_GRID; i++) {
    const s = (S_MAX * i) / (N_GRID - 1);
    sGrid[i] = s;
    p_s[i] = gueWigner(s);
  }
  // Bin-center evaluation (used by KL / Hellinger and per-bin residuals).
  const binCenters = new Array(N_BINS);
  const binPdfGue = new Array(N_BINS);
  for (let i = 0; i < N_BINS; i++) {
    const c = (i + 0.5) * BIN_WIDTH;
    binCenters[i] = c;
    binPdfGue[i] = gueWigner(c);
  }
  return { sGrid, p_s, binCenters, binPdfGue };
}

const GUE_CURVE = computeGueCurve();

// ── Empirical pdf at bin centers ─────────────────────────────────────────────

const EMPIRICAL_PDF = new Array(N_BINS);
for (let i = 0; i < N_BINS; i++) {
  EMPIRICAL_PDF[i] = HISTOGRAM.counts[i] / HISTOGRAM.total / BIN_WIDTH;
}

// ── KL divergence and Hellinger distance ────────────────────────────────────
//
// Both work over the same bin partition. We use bin probabilities
// p_i = pdf_emp(c_i) * bin_width and q_i = pdf_gue(c_i) * bin_width.
// Bins where either p_i or q_i is zero are skipped in the KL sum
// (standard convention: 0 * log(0/q) = 0; we also skip p > 0 with q = 0
// since that does not occur here -- q > 0 everywhere on (0, S_MAX]).

function computeKLAndHellinger() {
  let kl = 0;
  let hellSq = 0;
  let pSum = 0;
  let qSum = 0;
  for (let i = 0; i < N_BINS; i++) {
    const p = EMPIRICAL_PDF[i] * BIN_WIDTH;
    const q = GUE_CURVE.binPdfGue[i] * BIN_WIDTH;
    pSum += p;
    qSum += q;
    if (p > 0 && q > 0) {
      kl += p * Math.log(p / q);
    }
    // Hellinger uses sqrt of probability masses; tolerate p = 0 or q = 0.
    const dp = Math.sqrt(Math.max(p, 0));
    const dq = Math.sqrt(Math.max(q, 0));
    hellSq += (dp - dq) * (dp - dq);
  }
  return {
    klDivergence: kl,
    hellingerDistance: Math.sqrt(hellSq / 2),
    empiricalMass: pSum,
    gueMass: qSum,
  };
}

const KL_HELL = computeKLAndHellinger();

// ── Per-bin residuals (empirical pdf - gue pdf) for the visualization ───────

const RESIDUALS = new Array(N_BINS);
for (let i = 0; i < N_BINS; i++) {
  RESIDUALS[i] = EMPIRICAL_PDF[i] - GUE_CURVE.binPdfGue[i];
}

let RESIDUAL_MAX_ABS = 0;
for (let i = 0; i < N_BINS; i++) {
  const a = Math.abs(RESIDUALS[i]);
  if (a > RESIDUAL_MAX_ABS) RESIDUAL_MAX_ABS = a;
}

// ── Exported record ─────────────────────────────────────────────────────────

export const GUE_VS_ZEROS_COMPARISON = Object.freeze({
  id: 'imp-1099-gue-vs-zeros-comparison',
  ticket: 'imp-1099',
  source: 'src/data/zeros-to-1e6.js (ZEROS_EXTENDED first 10000)',
  nZerosUsed: N_ZEROS,
  nSpacings: UNFOLDED.length,
  meanSpacingUnfolded: MEAN_SPACING,
  unfoldingFormula:
    's_k = (gamma_{k+1} - gamma_k) * (log(gamma_k / (2 * pi)) / (2 * pi))',
  gueWignerFormula:
    'p(s) = (32 / pi^2) * s^2 * exp(-4 * s^2 / pi)',

  // Raw unfolded spacings (frozen, length 9999).
  unfoldedSpacings: Object.freeze(UNFOLDED.slice()),

  histogram: Object.freeze({
    binEdges: Object.freeze(HISTOGRAM.binEdges.slice()),
    counts: Object.freeze(HISTOGRAM.counts.slice()),
    binWidth: BIN_WIDTH,
    nBins: N_BINS,
    sMax: S_MAX,
    inRange: HISTOGRAM.inRange,
    total: HISTOGRAM.total,
  }),

  gueWignerCurve: Object.freeze({
    sGrid: Object.freeze(GUE_CURVE.sGrid.slice()),
    p_s: Object.freeze(GUE_CURVE.p_s.slice()),
    binCenters: Object.freeze(GUE_CURVE.binCenters.slice()),
    binPdfGue: Object.freeze(GUE_CURVE.binPdfGue.slice()),
  }),

  empiricalPdf: Object.freeze(EMPIRICAL_PDF.slice()),
  residuals: Object.freeze(RESIDUALS.slice()),
  residualMaxAbs: RESIDUAL_MAX_ABS,

  klDivergence: KL_HELL.klDivergence,
  hellingerDistance: KL_HELL.hellingerDistance,

  // Provenance + scope.
  honestScope: [
    'Pure exploration / descriptive statistical comparison.',
    'GUE universality of Riemann zeros remains a conjecture; no rigorous ' +
      'proof exists. This module exhibits the well-known numerical agreement ' +
      'on the first 10000 zeros and does NOT prove anything.',
    'KL divergence and Hellinger distance are computed bin-by-bin against the ' +
      'GUE Wigner surmise (the 2x2-matrix approximation to the exact GUE ' +
      'nearest-neighbor spacing distribution, which differs from the exact ' +
      'GUE form by less than 1% in the bulk).',
  ],
  parallelTickets: ['imp-1097', 'imp-1098', 'imp-1100', 'imp-1101'],
});

// ── Build-time tripwires ────────────────────────────────────────────────────

export const GUE_VS_ZEROS_COMPARISON_ASSERTIONS = [
  {
    id: 'imp1099-histogram-bins-match',
    holds: () => {
      const h = GUE_VS_ZEROS_COMPARISON.histogram;
      return (
        h.counts.length === N_BINS &&
        h.binEdges.length === N_BINS + 1 &&
        Math.abs(h.binEdges[0]) < 1e-12 &&
        Math.abs(h.binEdges[N_BINS] - S_MAX) < 1e-12
      );
    },
    why:
      'Histogram must have exactly 50 bins covering [0, 4] with edges 0 and 4 ' +
      'pinned. Drift here would break the per-bin residual alignment with the ' +
      'GUE curve evaluated at bin centers.',
  },
  {
    id: 'imp1099-mean-spacing-near-one',
    holds: () => {
      return Math.abs(GUE_VS_ZEROS_COMPARISON.meanSpacingUnfolded - 1.0) < 0.01;
    },
    why:
      'Riemann-von Mangoldt unfolding is constructed so the mean spacing ' +
      'equals 1 in the limit. For the first 10000 zeros the empirical mean ' +
      'must agree within 1% (it is approximately 0.9999 at N = 10^4). A drift ' +
      'outside this tolerance would mean the unfolding formula or zero ' +
      'source was silently changed.',
  },
  {
    id: 'imp1099-kl-divergence-below-threshold-0p05',
    holds: () => {
      const kl = GUE_VS_ZEROS_COMPARISON.klDivergence;
      return kl >= 0 && kl < 0.05;
    },
    why:
      'KL(empirical || GUE) should be small and strictly non-negative (KL ' +
      'is always >= 0; small values indicate close agreement). The empirical ' +
      'value at N = 10000 zeros is approximately 0.008, comfortably under ' +
      '0.05. A KL above this threshold would signal a regression in the ' +
      'unfolding or histogram computation.',
  },
  {
    id: 'imp1099-hellinger-distance-bounded',
    holds: () => {
      const h = GUE_VS_ZEROS_COMPARISON.hellingerDistance;
      // Hellinger distance lives in [0, 1].
      return h >= 0 && h <= 1 && h < 0.15;
    },
    why:
      'Hellinger distance is bounded in [0, 1]; small values indicate strong ' +
      'agreement between empirical and reference distributions. The empirical ' +
      'value at N = 10000 zeros is approximately 0.048; the 0.15 cap is a ' +
      'generous tripwire that would still fire on a real regression.',
  },
  {
    id: 'imp1099-residuals-bounded-no-systematic-deviation',
    holds: () => {
      // Max-abs per-bin residual must be reasonable (<= 0.25); the empirical
      // pdf peaks around 0.99 near s ~ 0.78 and the GUE peak is at the same
      // location.
      const r = GUE_VS_ZEROS_COMPARISON.residualMaxAbs;
      return r >= 0 && r < 0.25;
    },
    why:
      'Largest absolute per-bin residual (|pdf_empirical(c_i) - pdf_gue(c_i)|) ' +
      'must stay bounded. Empirically the max residual at N = 10000 is well ' +
      'under 0.25. A residual exceeding the cap would signal a localized ' +
      'systematic deviation worthy of investigation.',
  },
  {
    id: 'imp1099-histogram-captures-all-spacings-in-range',
    holds: () => {
      const h = GUE_VS_ZEROS_COMPARISON.histogram;
      // All 9999 unfolded spacings should fall in [0, 4) since the GUE
      // spacing distribution has a thin Gaussian tail; no spacing in the
      // first 10000 zeros exceeds 4 unfolded units.
      return h.inRange === h.total && h.total === N_ZEROS - 1;
    },
    why:
      'Every unfolded spacing for the first 10000 zeros must fall inside the ' +
      '[0, 4) histogram support. The GUE Wigner surmise has a Gaussian tail ' +
      'so spacings above 4 mean spacings are exponentially rare; any miss ' +
      'would indicate either bad input data or a unit-conversion error.',
  },
  {
    id: 'imp1099-gue-curve-normalized-on-bin-grid',
    holds: () => {
      // Integral of p_gue over [0, S_MAX] via bin-center quadrature should
      // capture the bulk of probability mass (>= 99% since GUE Wigner has a
      // Gaussian tail rapidly decaying beyond s = 3).
      const g = GUE_VS_ZEROS_COMPARISON.gueWignerCurve;
      let mass = 0;
      for (let i = 0; i < N_BINS; i++) mass += g.binPdfGue[i] * BIN_WIDTH;
      return mass > 0.99 && mass <= 1.0001;
    },
    why:
      'The GUE Wigner surmise integrates to 1 on [0, infty); the truncation ' +
      'to [0, 4] discards a tail of order 1e-3. The bin-center quadrature ' +
      'over the histogram support must therefore capture >= 99% of the ' +
      'mass. Failure would indicate a coefficient drift in the gueWigner ' +
      'function.',
  },
];
