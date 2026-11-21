/**
 * imp-95567: import-light viz-data for the imp-95533/imp-95559 RES-T (L4)
 * detectable-height ceiling
 *   H_ceil(T, delta) = 2 pi exp(E(T, delta)),   E(T, delta) = delta^2 S(T delta)^4 T^3,
 *   S(x) = sinh(x/2)/(x/2),
 * sampled over a support grid T in [1, 8] and three displacement values
 * delta = 0.1, 0.25, 0.5 (the last is the canonical edge, beta - 1/2 = 1/2).
 * H_ceil is doubly exponential in T: ln(E) (equivalently ln ln(H_ceil/2pi)) grows
 * with T, its slope approaching the predicted 2*delta once T*delta is large enough
 * for the S(T delta) ~ e^{T delta/2}/(T delta) asymptotic to dominate the T^3
 * prefactor (imp-95559).
 *
 * Re-implements the imp-95533/imp-95559 numeric kernel standalone (no imports, no
 * 16.7MB zeros bundle) so a render-friendly chart can be baked at denser resolution.
 *
 * MEASUREMENT ONLY. Changes no bound; NO QED; no refereed bound is changed.
 *
 * @see imp-95533-res-t-standalone-lemma (source lemma: L1-L4, T_X literals)
 * @see imp-95559-res-t-moment-refined (source (L4) ceiling table + refined T_X literals this cross-checks)
 */

// S(x) = sinh(x/2)/(x/2): the sinc kernel continued to the imaginary axis (imp-95533 L1).
const Sfac = (x) => (Math.abs(x) < 1e-12 ? 1 : Math.sinh(x / 2) / (x / 2));

// Exclusion exponent E(T, delta) = delta^2 S(T delta)^4 T^3 (imp-95533 L3 / imp-95559).
const resTExponent = (T, delta) => delta * delta * Math.pow(Sfac(T * delta), 4) * T * T * T;

// First-exclusion support T_X: root of E(T, delta) = log(X / 2pi) (imp-95559 L4).
function firstExclusionSupport(X, delta) {
  const Lx = Math.log(X / (2 * Math.PI));
  let lo = 0.1;
  let hi = 100;
  for (let i = 0; i < 200; i++) {
    const m = (lo + hi) / 2;
    if (resTExponent(m, delta) > Lx) hi = m;
    else lo = m;
  }
  return (lo + hi) / 2;
}

const DELTAS = [0.1, 0.25, 0.5];
const T_LO = 1;
const T_HI = 8;
const N_GRID = 29; // step 0.25
const Tat = (i) => T_LO + ((T_HI - T_LO) * i) / (N_GRID - 1);

export const IMP95567_CURVES = DELTAS.map((delta) => ({
  delta,
  points: Array.from({ length: N_GRID }, (_, i) => {
    const T = Tat(i);
    const E = resTExponent(T, delta);
    return {
      T: Number(T.toFixed(3)),
      exponent: E,
      loglogH: Math.log(E), // ln(E) = ln ln(H_ceil / 2pi)
      log10Hceil: (Math.log(2 * Math.PI) + E) / Math.LN10,
    };
  }),
}));

// Edge-displacement (delta = 1/2) first-exclusion supports across the verified-zero
// window, cross-checking the imp-95559 literals (T_X = 3.168 / 3.882 / 4.147 / 4.355).
export const IMP95567_FIRST_EXCLUSION_EDGE = {
  delta: 0.5,
  X1e6: firstExclusionSupport(1e6, 0.5),
  X3e12: firstExclusionSupport(3e12, 0.5),
  X1p9e16: firstExclusionSupport(1.9e16, 0.5),
  X1e20: firstExclusionSupport(1e20, 0.5),
};

export const IMP95567_SUMMARY = {
  gridScope: `T in [${T_LO}, ${T_HI}] (${N_GRID} steps) x delta in {${DELTAS.join(', ')}}, re-plotting imp-95533/imp-95559`,
  ceilingLaw:
    'H_ceil(T, delta) = 2 pi exp(E), E = delta^2 S(T delta)^4 T^3, doubly exponential in T '
    + '(ln E grows with T, slope approaching 2*delta once T*delta is in the asymptotic regime)',
  verdict:
    'MEASUREMENT ONLY; changes no bound; NO QED; no refereed bound is changed. '
    + 'Re-plots the imp-95533/imp-95559 RES-T (L4) height-ceiling law at render-friendly resolution.',
};

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const relEq = (x, lit, tol) => Math.abs(x - lit) <= tol * Math.max(Math.abs(lit), 1e-300);

const IMP95567_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp95567-grid-length-matches',
    description: 'every curve has N_GRID points spanning [T_LO, T_HI]',
    holds: () => IMP95567_CURVES.every((c) => c.points.length === N_GRID)
      && IMP95567_CURVES.every((c) => c.points[0].T === T_LO && c.points[N_GRID - 1].T === T_HI),
  },
  {
    id: 'imp95567-first-exclusion-reproduces-imp95559',
    description: 'edge (delta=1/2) first-exclusion supports reproduce the imp-95559 literals to rel 1e-3',
    holds: () => relEq(IMP95567_FIRST_EXCLUSION_EDGE.X1e6, 3.1682, 1e-3)
      && relEq(IMP95567_FIRST_EXCLUSION_EDGE.X3e12, 3.8818, 1e-3)
      && relEq(IMP95567_FIRST_EXCLUSION_EDGE.X1p9e16, 4.1472, 1e-3)
      && relEq(IMP95567_FIRST_EXCLUSION_EDGE.X1e20, 4.3552, 1e-3),
  },
  {
    id: 'imp95567-doubly-exponential-slope-at-edge-delta',
    description: 'at the edge delta=1/2, dln(E)/dT approaches the predicted slope 2*delta=1 as T grows (matches imp-95559)',
    holds: () => {
      const near = Math.log(resTExponent(8, 0.5)) - Math.log(resTExponent(7, 0.5));
      const far = Math.log(resTExponent(20, 0.5)) - Math.log(resTExponent(19, 0.5));
      return near > 0.85 && near < 1.0 && far > 0.9 && far <= 1.0;
    },
  },
  {
    id: 'imp95567-larger-delta-larger-ceiling-at-fixed-T',
    description: 'at fixed T=8, larger displacement delta gives a strictly larger height ceiling (0.1 < 0.25 < 0.5)',
    holds: () => {
      const at = (delta) => IMP95567_CURVES.find((c) => c.delta === delta)
        .points.find((p) => Math.abs(p.T - 8) < 1e-6).log10Hceil;
      return at(0.1) < at(0.25) && at(0.25) < at(0.5);
    },
  },
  {
    id: 'imp95567-honesty-gate-no-qed',
    description: 'summary carries NO QED and SOTA denial markers',
    holds: () => /NO QED/.test(IMP95567_SUMMARY.verdict) && /refereed bound is changed/i.test(IMP95567_SUMMARY.verdict),
  },
];

for (const a of IMP95567_VIZ_DATA_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95567-height-ceiling-viz-data assertion failed: ${a.id}`);
  }
}
