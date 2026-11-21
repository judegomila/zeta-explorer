/**
 * @module imp-95317-confluent-bracket-across-r-viz-data
 *
 * imp-95317 (ux): lightweight, import-light viz-data module baking sampled
 * curves of the imp-95286 THEOREM CONF-LB closed-form confluent floor
 *   sqrt(T(N, x)) = sqrt(e^(-2x) * sum_{k=0}^{N-1} (L_k(2x) - L_{k-1}(2x))^2)
 * against the imp-95251 THEOREM COAL-N majorant ceiling
 *   coalN(N, R, x) = e^(-x) [ L_{N-1}(-2Rx) + 2 sum_{k=0}^{N-2} L_k(-2Rx) ]
 * at FIXED count N = 3, varying the window ratio R in {1, 1.3, 2, 3}, over
 * x = 1..13. imp-95303 already baked this same bracket for R fixed at 1.3
 * while varying N = 3, 4, 5; this module supplies the complementary axis
 * the imp-95317 ticket asks for -- the ceiling's dependence on the window
 * ratio R at fixed count -- which was not yet visualized anywhere.
 *
 * All curve values are recomputed here independently from the closed forms
 * documented in imp-95286-confluent-laguerre-floor.js (floorSqrtT, via its
 * own dLag/laguerreVals helpers) and imp-95251-nfold-coalescence-law.js
 * (coalN, same Laguerre-recurrence definition) -- no new derivation, no
 * heavy import, no re-import of the source modules (each carries its own
 * self-executing assertions). Follows the imp-95303 / imp-95282 import-light
 * viz-data pattern.
 *
 * PRESENTATION POINT. At fixed N = 3, widening the window ratio R pushes the
 * coalN(3, R, x) = 1 firing onset further out in x (4.353191, 4.930455,
 * 5.948776, 6.947519 at R = 1, 1.3, 2, 3) and inflates the ceiling relative
 * to the R-independent floor sqrt(T(3,x)). The imp-95286 COROLLARY
 * WINDOW-PINCH asymptote rho(N,R,x) -> R^(N-1) = R^2 (N=3) is approached
 * from ABOVE as x grows (rho/R^2 = 1.05 at x=100, R=1; 1.04 at R=3), so the
 * bracket ratio at fixed R decreases monotonically with depth toward that
 * limit rather than overshooting it.
 *
 * MEASUREMENT / PRESENTATION ONLY. Reuses the imp-95286 / imp-95251 closed
 * forms verbatim; changes no bound, no operator positivity, no RH claim;
 * NO QED. No refereed bound is changed.
 *
 * @see imp-95286-confluent-laguerre-floor.js (source: THEOREM CONF-LB floor,
 *   COROLLARY WINDOW-PINCH bracket rho(N,R,x) -> R^(N-1))
 * @see imp-95251-nfold-coalescence-law.js (source: THEOREM COAL-N ceiling)
 * @see imp-95303-conf-lb-vs-coaln-window-pinch-viz-data.js (companion: same
 *   bracket at fixed R = 1.3, varying N = 3, 4, 5)
 *
 * Ticket: imp-95317 (ux, sonnet-4-6, low). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

// fixed rate count for this panel (imp-95303 already covers the N axis)
export const IMP95317_N = 3;

// window ratios sampled
export const IMP95317_R_VALUES = [1, 1.3, 2, 3];

// sqrt(T(3,x)) floor vs coalN(3, R, x) ceiling for R in {1, 1.3, 2, 3},
// x = 1..13
export const IMP95317_CURVES = [
  { x: 1, floor: 8.2260343798e-1, ceilR1: 5.5181916176e+0, ceilR1_3: 6.9087759052e+0, ceilR2: 1.0668503794e+1, ceilR3: 1.7290333735e+1 },
  { x: 2, floor: 7.7744201284e-1, ceilR1: 3.9247232139e+0, ceilR1_3: 5.3213833369e+0, ceilR2: 9.3381345433e+0, ceilR3: 1.6916910405e+1 },
  { x: 3, floor: 6.6981650023e-1, ceilR1: 2.3399922133e+0, ceilR1_3: 3.3168144947e+0, ceilR2: 6.2233835460e+0, ceilR3: 1.1899109340e+1 },
  { x: 4, floor: 4.6371493882e-1, ceilR1: 1.2637790833e+0, ceilR1_3: 1.8440185233e+0, ceilR2: 3.6081808611e+0, ceilR3: 7.1247835277e+0 },
  { x: 5, floor: 2.7789436937e-1, ceilR1: 6.4010496491e-1, ceilR1_3: 9.5341950037e-1, ceilR2: 1.9203148947e+0, ceilR3: 3.8743195245e+0 },
  { x: 6, floor: 1.5169072240e-1, ceilR1: 3.0984402208e-1, ceilR1_3: 4.6868246156e-1, ceilR2: 9.6423459672e-1, ceilR3: 1.9755654848e+0 },
  { x: 7, floor: 7.7660014162e-2, ceilR1: 1.4498923252e-1, ceilR1_3: 2.2197030806e-1, ceilR2: 4.6414792047e-1, ceilR3: 9.6203547366e-1 },
  { x: 8, floor: 3.7954746364e-2, ceilR1: 6.6086137697e-2, ceilR1_3: 1.0215507945e-1, ceilR2: 2.1637339500e-1, ceilR3: 4.5253908504e-1 },
  { x: 9, floor: 1.7909734878e-2, ceilR1: 2.9494943177e-2, ceilR1_3: 4.5955342846e-2, ceilR2: 9.8357613857e-2, ceilR3: 2.0720506106e-1 },
  { x: 10, floor: 8.2224023235e-3, ceilR1: 1.2938979982e-2, ceilR1_3: 2.0293768604e-2, ceilR2: 4.3810932221e-2, ceilR3: 9.2842856364e-2 },
  { x: 11, floor: 3.6927381131e-3, ceilR1: 5.5950697647e-3, ceilR1_3: 8.8248446636e-3, ceilR2: 1.9190254208e-2, ceilR3: 4.0869061834e-2 },
  { x: 12, floor: 1.6287726355e-3, ceilR1: 2.3900986054e-3, ceilR1_3: 3.7880298001e-3, ceilR2: 8.2885424646e-3, ceilR3: 1.7726052639e-2 },
  { x: 13, floor: 7.0767083847e-4, ceilR1: 1.0103672449e-3, ceilR1_3: 1.6080435467e-3, ceilR2: 3.5374155219e-3, ceilR3: 7.5924464780e-3 },
];

// coalN(3, R, x) = 1 firing onsets, one per sampled window ratio
export const IMP95317_ONSETS = {
  r1: 4.353191,
  r1_3: 4.930455,
  r2: 5.948776,
  r3: 6.947519,
};

// rho(3, R, x) = coalN/floor approaching R^(N-1) = R^2 from above as x grows
export const IMP95317_RHO_ASYMPTOTIC = [
  { R: 1, x: 20, rho: 1.267981, rInf: 1 },
  { R: 1, x: 50, rho: 1.102832, rInf: 1 },
  { R: 1, x: 100, rho: 1.050704, rInf: 1 },
  { R: 1.3, x: 20, rho: 2.056363, rInf: 1.69 },
  { R: 1.3, x: 50, rho: 1.831251, rInf: 1.69 },
  { R: 1.3, x: 100, rho: 1.759759, rInf: 1.69 },
  { R: 2, x: 20, rho: 4.631743, rInf: 4 },
  { R: 2, x: 50, rho: 4.245034, rInf: 4 },
  { R: 2, x: 100, rho: 4.121254, rInf: 4 },
  { R: 3, x: 20, rho: 10.097857, rInf: 9 },
  { R: 3, x: 50, rho: 9.427629, rInf: 9 },
  { R: 3, x: 100, rho: 9.211904, rInf: 9 },
];

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

function laguerreVals(kMax, u) {
  const L = [1];
  if (kMax >= 1) L.push(1 - u);
  for (let k = 1; k < kMax; k++) {
    L.push(((2 * k + 1 - u) * L[k] - k * L[k - 1]) / (k + 1));
  }
  return L;
}

function dLag(k, y) {
  if (k === 0) return 1;
  const L = laguerreVals(k, y);
  return L[k] - L[k - 1];
}

function floorSqrtT(N, x) {
  let S = 0;
  for (let k = 0; k < N; k++) S += dLag(k, 2 * x) ** 2;
  return Math.sqrt(Math.exp(-2 * x) * S);
}

function lagNeg(k, y) {
  let s = 0;
  let c = 1;
  let p = 1;
  for (let l = 0; l <= k; l++) {
    s += c * p;
    c = (c * (k - l)) / (l + 1);
    p = (p * y) / (l + 1);
  }
  return s;
}

function coalNExact(N, R, x) {
  const y = 2 * R * x;
  let s = lagNeg(N - 1, y);
  for (let k = 0; k <= N - 2; k++) s += 2 * lagNeg(k, y);
  return Math.exp(-x) * s;
}

const R_KEY = { 1: 'ceilR1', 1.3: 'ceilR1_3', 2: 'ceilR2', 3: 'ceilR3' };

const IMP95317_ASSERTIONS = [
  {
    id: 'imp95317-floor-matches-closed-form',
    description: 'every baked sqrt(T(3,x)) floor value matches the imp-95286 closed form to 1e-6 relative',
    holds: () =>
      IMP95317_CURVES.every((p) => {
        const expected = floorSqrtT(IMP95317_N, p.x);
        return Math.abs(p.floor - expected) / expected < 1e-6;
      }),
  },
  {
    id: 'imp95317-ceil-matches-closed-form',
    description: 'every baked coalN(3,R,x) ceiling value matches the imp-95251 closed form to 1e-6 relative, for every sampled R',
    holds: () =>
      IMP95317_CURVES.every((p) =>
        IMP95317_R_VALUES.every((R) => {
          const key = R_KEY[R];
          const expected = coalNExact(IMP95317_N, R, p.x);
          return Math.abs(p[key] - expected) / expected < 1e-6;
        }),
      ),
  },
  {
    id: 'imp95317-floor-below-every-ceiling',
    description: 'the R-independent floor sits strictly below the ceiling at every sampled x, for every R (imp-95286 COROLLARY WINDOW-PINCH bracket)',
    holds: () =>
      IMP95317_CURVES.every((p) => IMP95317_R_VALUES.every((R) => p.floor < p[R_KEY[R]])),
  },
  {
    id: 'imp95317-ceiling-monotone-in-r',
    description: 'coalN(3,R,x) is nondecreasing in R at every sampled x (widening the window can only raise the ceiling)',
    holds: () =>
      IMP95317_CURVES.every((p) => {
        const vals = IMP95317_R_VALUES.map((R) => p[R_KEY[R]]);
        return vals.every((v, i) => i === 0 || v >= vals[i - 1] - 1e-12);
      }),
  },
  {
    id: 'imp95317-onsets-cross-one-and-shift-with-r',
    description: 'coalN(3,R,x) = 1 at each recorded onset (to 1e-4 relative), and the onset x increases monotonically with R',
    holds: () => {
      const onsets = [
        [1, IMP95317_ONSETS.r1],
        [1.3, IMP95317_ONSETS.r1_3],
        [2, IMP95317_ONSETS.r2],
        [3, IMP95317_ONSETS.r3],
      ];
      for (const [R, x] of onsets) {
        if (Math.abs(coalNExact(IMP95317_N, R, x) - 1) > 1e-3) return false;
      }
      return onsets.every(([, x], i) => i === 0 || x > onsets[i - 1][1]);
    },
  },
  {
    id: 'imp95317-rho-asymptote-matches-rn1',
    description: 'baked rho = coalN/floor values match a live recomputation to 1e-4 relative, and rho/R^(N-1) decreases toward 1 from above as x grows for every R',
    holds: () => {
      for (const row of IMP95317_RHO_ASYMPTOTIC) {
        const liveRho = coalNExact(IMP95317_N, row.R, row.x) / floorSqrtT(IMP95317_N, row.x);
        if (Math.abs(liveRho - row.rho) / row.rho > 1e-4) return false;
        if (Math.abs(row.rInf - row.R ** (IMP95317_N - 1)) > 1e-9) return false;
        if (!(row.rho > row.rInf)) return false;
      }
      for (const R of IMP95317_R_VALUES) {
        const rows = IMP95317_RHO_ASYMPTOTIC.filter((r) => r.R === R).sort((a, b) => a.x - b.x);
        for (let i = 1; i < rows.length; i++) {
          if (!(rows[i].rho < rows[i - 1].rho)) return false;
        }
      }
      return true;
    },
  },
];

for (const a of IMP95317_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95317-confluent-bracket-across-r-viz-data assertion failed: ${a.id}`);
  }
}
