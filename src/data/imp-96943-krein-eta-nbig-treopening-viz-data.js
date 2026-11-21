/**
 * @module imp-96943-krein-eta-nbig-treopening-viz-data
 *
 * imp-96943 (ux): import-light viz-data leaf for the imp-96911 shift-invert top-Ritz eta(Nbig)
 * drift and its T-reopening at 2a=ln3. Reshapes the imp-96911 Nbig-ladder and T-sensitivity
 * tables into chart-ready series (eta and floor vs Nbig at fixed T=800; eta vs T at three fixed
 * Nbig rungs, showing the plateau reopen) plus a compact summary of the coupled-(N,T) verdict.
 *
 * PRESENTATION ONLY. Every value here is reused verbatim from the imp-96911
 * IMP96911_ETA_NBIG_T800 / IMP96911_T_SENSITIVITY / IMP96911_VERDICT records; only the chart
 * reshape is new. Changes no bound, establishes no operator positivity, no RH claim; the
 * interval-rigorous certificate reach stays 2a<=0.96. No refereed bound is changed.
 * RH open. NO QED.
 *
 * @see imp-96911-krein-eta-nconvergence-scout.js (source measurement)
 *
 * Ticket: imp-96943 (ux, sonnet-4-6, low). Presentation only, RH-free; changes no bound; NO QED.
 *
 * Import-light: only re-exports/reshapes imp-96911 (itself import-light, no zeros bundle, no
 * sibling imports).
 */

import {
  IMP96911_ETA_NBIG_T800,
  IMP96911_T_SENSITIVITY,
  IMP96911_POWER_FIT_T800,
  IMP96911_VERDICT,
} from './imp-96911-krein-eta-nconvergence-scout.js';

// Nbig-ladder series at fixed T=800: eta rises / floor falls monotonically with Nbig.
export const IMP96943_ETA_NBIG_SERIES = Object.freeze(
  IMP96911_ETA_NBIG_T800.map((r) => ({
    Nbig: r.Nbig,
    eta: r.eta,
    floor: r.floor,
  })),
);

// T-reopening series: at each fixed Nbig rung, eta falls as T grows -- the Nbig=200-240 plateau
// seen at T=800 is a T-truncation ceiling, not an Nbig limit.
export const IMP96943_T_REOPENING_SERIES = Object.freeze(
  IMP96911_T_SENSITIVITY.flatMap((r) => ([
    { Nbig: r.Nbig, T: 800, eta: r.eta_T800 },
    { Nbig: r.Nbig, T: 1600, eta: r.eta_T1600 },
    { Nbig: r.Nbig, T: 3200, eta: r.eta_T3200 },
  ])),
);

export const IMP96943_POWER_FIT_SUMMARY = Object.freeze({
  pExponentPinnedAtSearchFloor: IMP96911_POWER_FIT_T800.pExponentPinnedAtSearchFloor,
  p: IMP96911_POWER_FIT_T800.p,
  rms: IMP96911_POWER_FIT_T800.rms,
  aitken_eta_inf: IMP96911_POWER_FIT_T800.aitken_eta_inf,
});

export const IMP96943_SUMMARY = Object.freeze({
  etaIsNindependentForNge12: IMP96911_VERDICT.etaIsNindependentForNge12,
  nbigPlateauIsTceiling: IMP96911_VERDICT.nbigPlateauIsTceiling,
  floorBiasOverLadder: IMP96911_VERDICT.floorBiasOverLadder,
  leakageBiasSeparableFromT: IMP96911_VERDICT.leakageBiasSeparableFromT,
  intervalRigorousReachUnchanged: IMP96911_VERDICT.intervalRigorousReachUnchanged,
  subGap: IMP96911_VERDICT.subGap,
  qed: IMP96911_VERDICT.qed,
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96943_ASSERTIONS = [
  {
    id: 'imp96943-eta-nbig-series-matches-source-length-and-is-monotone',
    holds: () => {
      const s = IMP96943_ETA_NBIG_SERIES;
      if (s.length !== IMP96911_ETA_NBIG_T800.length) return false;
      for (let i = 1; i < s.length; i++) {
        if (!(s[i].eta > s[i - 1].eta)) return false;
        if (!(s[i].floor < s[i - 1].floor)) return false;
      }
      return true;
    },
    why: 'the reshaped Nbig series must carry every source rung and preserve the eta-rises/floor-falls monotonicity of imp-96911 Finding 1.',
  },
  {
    id: 'imp96943-t-reopening-series-has-three-rows-per-nbig-falling-in-T',
    holds: () => {
      const s = IMP96943_T_REOPENING_SERIES;
      if (s.length !== IMP96911_T_SENSITIVITY.length * 3) return false;
      for (let i = 0; i < s.length; i += 3) {
        if (!(s[i].eta > s[i + 1].eta && s[i + 1].eta > s[i + 2].eta)) return false;
        if (!(s[i].Nbig === s[i + 1].Nbig && s[i + 1].Nbig === s[i + 2].Nbig)) return false;
      }
      return true;
    },
    why: 'each Nbig rung must expand to exactly three (T, eta) points (T=800,1600,3200) with eta falling as T grows, reproducing the imp-96911 Finding 3 T-reopening.',
  },
  {
    id: 'imp96943-summary-carries-no-qed-honesty-marker',
    holds: () =>
      IMP96943_SUMMARY.qed === false &&
      IMP96943_SUMMARY.intervalRigorousReachUnchanged === 0.96 &&
      IMP96943_SUMMARY.leakageBiasSeparableFromT === false &&
      typeof IMP96943_SUMMARY.subGap === 'string' && IMP96943_SUMMARY.subGap.length > 0,
    why: 'this is a presentation-only reshape: qed=false and the unchanged 2a<=0.96 reach must be carried over unchanged from imp-96911 (no QED claimed).',
  },
];

for (const a of IMP96943_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96943-krein-eta-nbig-treopening-viz-data assertion failed: ${a.id}`);
  }
}
