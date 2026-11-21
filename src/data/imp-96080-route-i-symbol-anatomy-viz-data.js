/**
 * @module imp-96080-route-i-symbol-anatomy-viz-data
 *
 * imp-96080 (content): import-light viz-data leaf for RH Route I's high-resolution
 * pencil map (rh-route-i-pencil-highres-map-2026-09-23.js), which computes the
 * Toeplitz symbol w(t) = 2 theta_prime(t) - m_2(t) of Arch - P_2 = L_S - D_S and the
 * mu_max(a; k=0) crossing of the semilocal S = {oo, 2} pencil, but had no viz surface
 * for either.
 *
 * Two things are plotted here:
 *   (1) the symbol w(t) itself, sampled directly from the source module's exported
 *       weilSymbol(t) = twoThetaPrime(t) - m2(t) (an exact closed-form function, not a
 *       fit or an empirical curve) over t in [0, 60], alongside the six baked p = 2
 *       resonance windows (widths 1.730 -> 0.650, depths -2.981 -> -1.188) and the
 *       archimedean negative window [0, 3.597) (min -8.719), all copied verbatim from
 *       PENCIL_HIGHRES_LITERALS.symbol;
 *   (2) the mu_max(a; k=0) column of the baked N=128 grid (PENCIL_HIGHRES_LITERALS.gridN128),
 *       showing the crossing of 1 at a* = 0.56578 (2a* = ln 3 + 0.033), copied verbatim,
 *       with the (ln 3)/2 boundary and the crossing point marked.
 *
 * MEASUREMENT / PRESENTATION ONLY. The w(t) samples are a direct evaluation of the
 * honest closed-form symbol already exercised by that module's own PH0 assertion
 * (signChanges(weilSymbol, ...)); no re-derivation of the Toeplitz forms, no fresh
 * pencil solve. Changes no bound, establishes no operator positivity, no RH claim;
 * no refereed bound is changed. RH open. NO QED.
 *
 * @see rh-route-i-pencil-highres-map-2026-09-23.js
 *   (weilSymbol, PENCIL_HIGHRES_LITERALS.symbol, PENCIL_HIGHRES_LITERALS.gridN128, .crossing)
 *
 * Ticket: imp-96080 (content, sonnet-4-6, medium). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import {
  weilSymbol,
  PENCIL_HIGHRES_LITERALS,
} from './rh-route-i-pencil-highres-map-2026-09-23.js';

const LN3 = Math.log(3);

// w(t) sampled directly from the source module's exact closed-form symbol.
const T_MAX = 60;
const T_STEP = 0.1;
export const IMP96080_SYMBOL_CURVE = (() => {
  const pts = [];
  for (let t = 0; t <= T_MAX + 1e-9; t += T_STEP) {
    pts.push({ t: Number(t.toFixed(2)), w: weilSymbol(t) });
  }
  return pts;
})();

// archimedean negative window + six p=2 resonance windows, copied verbatim.
export const IMP96080_ARCH_WINDOW = { ...PENCIL_HIGHRES_LITERALS.symbol.archWindow };
export const IMP96080_RESONANCE_WINDOWS = PENCIL_HIGHRES_LITERALS.symbol.resonanceWindows.map(
  ([k, tk, lo, hi, width, minW, intW, ratio]) => ({ k, tk, lo, hi, width, minW, intW, ratio })
);

// mu_max(a; k=0) column of the baked N=128 grid, plus the crossing point.
export const IMP96080_MU_MAX_CURVE = PENCIL_HIGHRES_LITERALS.gridN128.map((row) => ({
  a: row[0],
  muMax: row[1],
}));
export const IMP96080_CROSSING = Object.freeze({
  aStar: PENCIL_HIGHRES_LITERALS.crossing.aStarExtrapolated,
  twoAStar: PENCIL_HIGHRES_LITERALS.crossing.twoAStar,
  ln3: LN3,
  ln3Half: LN3 / 2,
  marginAtLn3Half: 1 - 0.997160,
});

export const IMP96080_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: the w(t) curve is a direct evaluation of the source module’s own exact closed-form weilSymbol (no re-derivation of the Toeplitz forms); the resonance windows and mu_max(a) column are copied verbatim from PENCIL_HIGHRES_LITERALS; no bound is claimed and no operator positivity is established. The 5-decimal a* = 0.56578 shown on the crossing chart is a Richardson extrapolation from N = 64..192 (a* = 0.565770 +- 3.3e-6, imp-96064); it is NOT confirmed by any assembly at N >= 224, where the compressed pole-free L_S loses positivity (imp-96106) and the pencil eigenvalues become unreliable, so the 5th decimal should be read as extrapolated, not as converged past N = 192.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96080_ASSERTIONS = [
  {
    id: 'imp96080-symbol-curve-matches-archimedean-window',
    holds: () => {
      const w0 = IMP96080_SYMBOL_CURVE[0].w;
      return Math.abs(w0 - IMP96080_ARCH_WINDOW.minW) < 1e-3 && w0 < 0;
    },
    why: 'w(0) computed directly from weilSymbol must match the baked archimedean-window minimum -8.719 (they are the same quantity, one baked, one freshly evaluated).',
  },
  {
    id: 'imp96080-symbol-curve-negative-inside-every-baked-window',
    holds: () =>
      IMP96080_RESONANCE_WINDOWS.every((r) => {
        const near = IMP96080_SYMBOL_CURVE.filter((p) => p.t >= r.lo - 0.05 && p.t <= r.hi + 0.05);
        return near.length > 0 && near.some((p) => p.w < 0) && Math.min(...near.map((p) => p.w)) <= r.minW + 0.05;
      }) &&
      IMP96080_SYMBOL_CURVE.filter((p) => p.t < IMP96080_ARCH_WINDOW.hi).every((p) => p.w < 0),
    why: 'every baked resonance window [lo,hi] and the archimedean window [0, hi) must contain negative freshly-sampled w(t), reproducing (not just citing) the source module’s sign-window structure.',
  },
  {
    id: 'imp96080-resonance-windows-shrink-and-agree-with-baked-depths',
    holds: () =>
      IMP96080_RESONANCE_WINDOWS.every((r, i) => i === 0 || r.width < IMP96080_RESONANCE_WINDOWS[i - 1].width) &&
      IMP96080_RESONANCE_WINDOWS.every((r) => r.ratio > 3 && r.ratio < 10) &&
      IMP96080_RESONANCE_WINDOWS.length === 6,
    why: 'the six p=2 resonance windows narrow monotonically (1.730 -> 0.650) and the deltahat_S/Lhat_S ratio at each t_k stays in the baked 3.27-9.13 range.',
  },
  {
    id: 'imp96080-mu-max-crosses-one-past-ln3-half',
    holds: () => {
      const rows = IMP96080_MU_MAX_CURVE;
      const belowLn3Half = rows.filter((r) => r.a <= IMP96080_CROSSING.ln3Half + 1e-6);
      const above = rows.filter((r) => r.a > 0.56);
      return (
        belowLn3Half.every((r) => r.muMax < 1) &&
        above.some((r) => r.muMax > 1) &&
        IMP96080_CROSSING.aStar > IMP96080_CROSSING.ln3Half &&
        Math.abs(2 * IMP96080_CROSSING.aStar - IMP96080_CROSSING.twoAStar) < 1e-3 &&
        IMP96080_CROSSING.twoAStar > IMP96080_CROSSING.ln3
      );
    },
    why: 'the k=0 mu_max column stays below 1 through (ln3)/2 (margin ~2.8e-3), then crosses 1 at a* = 0.56578, past (ln3)/2 but only 0.033 past ln3/2 in the 2a coordinate.',
  },
  {
    id: 'imp96080-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP96080_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96080_HONEST_BANNER) &&
      /NO QED/.test(IMP96080_HONEST_BANNER),
    why: 'every Route A-M viz surface carries the RH-open / PT-Lambda / NO-QED markers.',
  },
];

for (const a of IMP96080_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96080-route-i-symbol-anatomy-viz-data assertion failed: ${a.id}`);
  }
}
