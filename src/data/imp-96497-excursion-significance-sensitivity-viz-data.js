/**
 * @module imp-96497-excursion-significance-sensitivity-viz-data
 *
 * imp-96497 (ux): import-light viz-data leaf for the imp-96452 excursion-significance
 * sensitivity assessment. imp-96452 quantified what would lift the ~1.9-sigma excursion
 * confidence (cited but never charted by imp-96430/imp-96128/imp-96184) to a clean 2-sigma,
 * and separately noted the conservative-vs-corrected gap from the imp-96128 anti-correlation
 * model -- but shipped no chart. This leaf reshapes those baked literals into two small
 * bar series: (1) window count n_w vs the z-score it produces, holding the measured dip
 * depth fixed, across the three named scenarios (naive/current, 2-sigma target,
 * correlation-corrected); (2) the +24-window / +8.12% gap to the 2-sigma target.
 *
 * No re-derivation: every plotted number is copied verbatim from
 * IMP96452_EXCURSION_CONFIDENCE_2SIGMA_REACH.
 *
 * MEASUREMENT / PRESENTATION ONLY. Does not close any gap, changes no bound, asserts no
 * operator positivity. The ~1.9-sigma figure is a lower bound on a single fixed-data-ceiling
 * dip (T = 1.5e5, dip window fully interior to the existing 10^6-ordinate set) -- reaching
 * 2-sigma needs a DEEPER excursion from new interior data, not more verified-zero height.
 * RH open; NO QED; no refereed bound is changed; the zero-side route stays
 * PCC/GRH-gated.
 *
 * @see imp-96452-excursion-confidence-2sigma-reach.js (source of every literal plotted here)
 *
 * Ticket: imp-96497 (ux, sonnet-4-6, medium). Presentation only, RH-free; changes no bound; NO QED.
 */

import { IMP96452_EXCURSION_CONFIDENCE_2SIGMA_REACH } from './imp-96452-excursion-confidence-2sigma-reach.js';

const DRIVING = IMP96452_EXCURSION_CONFIDENCE_2SIGMA_REACH.drivingInputs;
const REACH = IMP96452_EXCURSION_CONFIDENCE_2SIGMA_REACH.twoSigmaReach;
const CONTEXT = IMP96452_EXCURSION_CONFIDENCE_2SIGMA_REACH.conservativeQuotingContext;

// Three named scenarios at the T = 1.5e5 dip, dip depth (relErr) held fixed throughout.
// Window count n_w and z-score both copied verbatim from the imp-96452 baked record.
export const IMP96497_SCENARIOS = Object.freeze([
  Object.freeze({
    key: 'naive',
    label: 'naive (n_w), cited',
    nW: DRIVING.windowCount_nW,
    z: DRIVING.zCurrent,
  }),
  Object.freeze({
    key: 'target',
    label: '2-sigma target',
    nW: REACH.nWindowsNeeded,
    z: REACH.zTarget,
  }),
  Object.freeze({
    key: 'corrected',
    label: 'anti-correlation-corrected (n_eff)',
    nW: CONTEXT.nEff,
    z: CONTEXT.zEffNaive,
  }),
]);

export const IMP96497_EXCURSION_DEPTH = Object.freeze({
  relErr: DRIVING.excursionDepth_relErr,
  label: 'dip depth relErr (held fixed across all three scenarios)',
});

export const IMP96497_TWO_SIGMA_GAP = Object.freeze({
  nWCurrent: DRIVING.windowCount_nW,
  nWNeeded: REACH.nWindowsNeeded,
  extraWindows: REACH.extraWindows,
  windowIncreasePct: REACH.windowIncreasePct,
});

export const IMP96497_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every n_w/z-score/window-gap '
  + 'value is copied verbatim from the imp-96452 baked reach record; only the bar layout is computed '
  + 'here (no re-derivation). The naive ~1.9-sigma is a lower bound on a single fixed-data-ceiling dip '
  + '(T = 1.5e5, window fully interior to the existing 10^6-ordinate set); reaching 2-sigma needs a '
  + 'DEEPER excursion from new interior data, not more verified-zero height. Changes no bound, '
  + 'establishes no operator positivity.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const approx = (x, y, tol) => Math.abs(x - y) <= tol;

const IMP96497_ASSERTIONS = [
  {
    id: 'imp96497-three-scenarios-present',
    holds: () => IMP96497_SCENARIOS.length === 3
      && IMP96497_SCENARIOS.every((s) => typeof s.nW === 'number' && typeof s.z === 'number' && s.nW > 0 && s.z > 0),
    why: 'exactly three named scenarios (naive, 2-sigma target, correlation-corrected), each with a positive n_w and z.',
  },
  {
    id: 'imp96497-z-monotone-in-nw',
    holds: () => {
      const byNw = [...IMP96497_SCENARIOS].sort((a, b) => a.nW - b.nW);
      for (let i = 1; i < byNw.length; i++) {
        if (byNw[i].z < byNw[i - 1].z) return false;
      }
      return true;
    },
    why: 'z scales as sqrt(n_w) at fixed dip depth, so larger n_w must never yield a smaller z across the three scenarios.',
  },
  {
    id: 'imp96497-naive-scenario-matches-source',
    holds: () => {
      const naive = IMP96497_SCENARIOS.find((s) => s.key === 'naive');
      return naive.nW === 291 && approx(naive.z, 1.9234217, 1e-6);
    },
    why: 'the naive scenario must reproduce the imp-96452/imp-96089 cited n_w = 291, z ~= 1.9234 exactly.',
  },
  {
    id: 'imp96497-target-scenario-matches-source',
    holds: () => {
      const target = IMP96497_SCENARIOS.find((s) => s.key === 'target');
      return target.nW === 315 && target.z === 2.0;
    },
    why: 'the 2-sigma target scenario must reproduce the imp-96452 n_w >= 315 reach at z = 2.0 exactly.',
  },
  {
    id: 'imp96497-corrected-scenario-matches-source',
    holds: () => {
      const corrected = IMP96497_SCENARIOS.find((s) => s.key === 'corrected');
      return approx(corrected.nW, 794.8, 1) && corrected.z > 3.0;
    },
    why: 'the correlation-corrected scenario must reproduce the imp-96128 n_eff ~= 795 and the resulting z ~= 3.18 (imp-96452).',
  },
  {
    id: 'imp96497-two-sigma-gap-matches-source',
    holds: () => IMP96497_TWO_SIGMA_GAP.extraWindows === 24
      && approx(IMP96497_TWO_SIGMA_GAP.windowIncreasePct, 8.1212, 1e-3),
    why: 'the +24-window / +8.12% gap to the 2-sigma target must match the imp-96452 baked reach record exactly.',
  },
  {
    id: 'imp96497-honest-banner-carries-status',
    holds: () => /RH open/.test(IMP96497_HONEST_BANNER)
      && /NO QED/.test(IMP96497_HONEST_BANNER)
      && /lower bound/.test(IMP96497_HONEST_BANNER),
    why: 'honesty gate: measurement/presentation only, no RH claim, the ~1.9-sigma figure stays framed as a conservative lower bound.',
  },
];

for (const a of IMP96497_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96497-excursion-significance-sensitivity-viz-data assertion failed: ${a.id} (${a.why})`);
  }
}
