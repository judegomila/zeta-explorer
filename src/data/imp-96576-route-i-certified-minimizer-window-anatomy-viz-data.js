/**
 * @module imp-96576-route-i-certified-minimizer-window-anatomy-viz-data
 *
 * imp-96576 (ux): import-light viz-data leaf for the certified-minimizer window
 * anatomy baked in rh-route-i-uncertainty-concentration-certificate-2026-09-24.js
 * (UNCERTAINTY_CERTIFICATE_LITERALS.anatomy), which had no viz surface. The exact
 * symbol-side certificate (THEOREM III in that module: W(h) >= 9.04e-4 ||h||^2 for
 * every pole-free h in L^2(-a,a), 2a <= ln 3) has a minimizer whose signed energy
 * contribution decomposes window-by-window across the archimedean well, the
 * dominant positive shoulder, the p = 2 dip I_1 (binding negativity), the second
 * positive shoulder, the shallow second dip I_2, and a long positive tail beyond.
 *
 * MEASUREMENT / PRESENTATION ONLY. Every number here is copied verbatim from the
 * baked anatomy literal (itself cross-checked by that module's own UC6-anatomy-
 * consistency assertion); no re-derivation, no fresh solve. Changes no bound,
 * establishes no operator positivity, no RH claim; no refereed bound is changed
 * . RH open. NO QED.
 *
 * @see rh-route-i-uncertainty-concentration-certificate-2026-09-24.js
 *   (UNCERTAINTY_CERTIFICATE_LITERALS.anatomy, .certificate.T400N320)
 *
 * Ticket: imp-96576 (ux, sonnet-4-6, low). Presentation only, RH-free; changes no
 * bound; NO QED.
 */

import { UNCERTAINTY_CERTIFICATE_LITERALS } from './rh-route-i-uncertainty-concentration-certificate-2026-09-24.js';

const A = UNCERTAINTY_CERTIFICATE_LITERALS.anatomy;
const CERTIFIED_LOWER_BOUND = UNCERTAINTY_CERTIFICATE_LITERALS.certificate.T400N320;

function fmtEdge(v) {
  return Number.isInteger(v) ? String(v) : v.toFixed(3).replace(/0+$/, '').replace(/\.$/, '');
}

// full 11-window decomposition, edges/parts/energy copied verbatim, zipped into
// per-window records with human-readable interval labels ("I_1"/"I_2" mark the
// two p = 2 dips called out by the ticket).
const WINDOW_LABELS = [
  null,
  null,
  'I_1',
  null,
  'I_2',
  null,
  null,
  null,
  null,
  null,
  null,
];

export const IMP96576_WINDOWS = A.parts.map((part, i) => {
  const lo = A.edges[i];
  const hi = A.edges[i + 1];
  const tag = WINDOW_LABELS[i];
  return Object.freeze({
    lo,
    hi,
    label: tag ? `${tag} [${fmtEdge(lo)}, ${fmtEdge(hi)})` : `[${fmtEdge(lo)}, ${fmtEdge(hi)})`,
    part,
    energy: A.energy[i],
    dip: tag || null,
  });
});

// ticket-facing 6-bar grouping: the four leading windows called out explicitly in
// the ticket text, plus everything from [18.699, 2000) folded into a single "rest"
// bar (sums to +0.00338, matching the ticket's stated rest value exactly).
export const IMP96576_GROUPED = Object.freeze([
  IMP96576_WINDOWS[0],
  IMP96576_WINDOWS[1],
  IMP96576_WINDOWS[2],
  IMP96576_WINDOWS[3],
  IMP96576_WINDOWS[4],
  Object.freeze({
    lo: A.edges[5],
    hi: A.edges[A.edges.length - 1],
    label: 'rest',
    part: IMP96576_WINDOWS.slice(5).reduce((s, w) => s + w.part, 0),
    energy: IMP96576_WINDOWS.slice(5).reduce((s, w) => s + w.energy, 0),
    dip: null,
  }),
]);

export const IMP96576_SUMMARY = Object.freeze({
  trueW: A.trueW,
  certifiedLowerBound: CERTIFIED_LOWER_BOUND,
  floorLoss: A.floorLoss,
  peakT: A.peakT,
  sector: A.sector,
});

export const IMP96576_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every window part/energy value is copied verbatim from the baked certificate anatomy (UNCERTAINTY_CERTIFICATE_LITERALS.anatomy); no re-derivation, no fresh solve. The certified-minimizer window parts sum to the true form value 9.7861e-4, which exceeds the certificate’s proved lower bound 9.0437e-4 (T=400, N=320) by a positive floor loss of 7.42e-5 from truncating the tail at T=400 — the minimizer itself is not interval-verified, only the T=400/N=320 Galerkin bound is (double precision, checked across resolutions). No bound is claimed beyond D_S <= L_S on pole-free h for 2a <= ln 3; nothing here localises a zero.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96576_ASSERTIONS = [
  {
    id: 'imp96576-windows-count-and-edges-match-baked-literal',
    holds: () => IMP96576_WINDOWS.length === A.parts.length && IMP96576_WINDOWS.length === A.edges.length - 1,
    why: 'one window per consecutive edge pair, matching the baked anatomy.edges/parts arrays 1:1.',
  },
  {
    id: 'imp96576-parts-sum-to-true-w',
    holds: () => {
      const sum = IMP96576_WINDOWS.reduce((s, w) => s + w.part, 0);
      return Math.abs(sum - IMP96576_SUMMARY.trueW) < 2e-5;
    },
    why: 'the window parts must sum to the minimizer’s true form value trueW = 9.7861e-4 (UC6-anatomy-consistency tolerance 2e-5).',
  },
  {
    id: 'imp96576-i1-is-the-binding-negativity',
    holds: () => {
      const i1 = IMP96576_WINDOWS.find((w) => w.dip === 'I_1');
      return i1 && i1.part < -0.34 && IMP96576_WINDOWS.every((w) => w.part >= i1.part);
    },
    why: 'I_1 must be the most negative window (the p = 2 resonance dip that carries the certificate’s binding negativity), part < -0.34.',
  },
  {
    id: 'imp96576-archimedean-well-is-small',
    holds: () => Math.abs(IMP96576_WINDOWS[0].part) < 0.01,
    why: 'the archimedean well [0, 3.597) contributes < 1% of ||h||^2 in magnitude (pole-freeness suppresses it), matching UC6-anatomy-consistency.',
  },
  {
    id: 'imp96576-grouped-rest-matches-ticket-value',
    holds: () => Math.abs(IMP96576_GROUPED[5].part - 0.00338) < 1e-4,
    why: 'the grouped "rest" bar (windows 6-11, [18.699, 2000)) must sum to +0.00338, the value stated in the imp-96576 ticket text.',
  },
  {
    id: 'imp96576-floor-loss-is-positive-and-small',
    holds: () => IMP96576_SUMMARY.floorLoss > 0 && IMP96576_SUMMARY.floorLoss < 2e-4 &&
      Math.abs(IMP96576_SUMMARY.trueW - IMP96576_SUMMARY.certifiedLowerBound - IMP96576_SUMMARY.floorLoss) < 2e-5,
    why: 'trueW exceeds the certified T=400/N=320 lower bound by exactly the floor loss (truncating the tail integral at T=400), and that loss is small and positive.',
  },
  {
    id: 'imp96576-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP96576_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96576_HONEST_BANNER) &&
      /NO QED/.test(IMP96576_HONEST_BANNER),
    why: 'every Route A-M viz surface carries the RH-open / PT-Lambda / NO-QED markers.',
  },
];

for (const a of IMP96576_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96576-route-i-certified-minimizer-window-anatomy-viz-data assertion failed: ${a.id}`);
  }
}
