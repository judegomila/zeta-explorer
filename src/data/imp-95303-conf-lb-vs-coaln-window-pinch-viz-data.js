/**
 * @module imp-95303-conf-lb-vs-coaln-window-pinch-viz-data
 *
 * imp-95303 (ux): lightweight, import-light viz-data module baking sampled
 * curves of the imp-95286 THEOREM CONF-LB closed-form confluent floor
 *   sqrt(T(N, x)) = sqrt(e^(-2x) * sum_{k=0}^{N-1} (L_k(2x) - L_{k-1}(2x))^2)
 * against the imp-95251 THEOREM COAL-N majorant ceiling
 *   coalN(N, R, x) = e^(-x) [ L_{N-1}(-2Rx) + 2 sum_{k=0}^{N-2} L_k(-2Rx) ]
 * at window ratio R = 1.3, for N = 3, 4, 5, over x = 1..13. This is the
 * imp-95286 COROLLARY WINDOW-PINCH bracket sqrt(T(N,x)) <= window sup <=
 * coalN(N,R,x): both curves are baked here so the shrinking (in relative
 * terms) gap between floor and ceiling can be read directly off the chart,
 * together with the coalN(N,1.3,x) = 1 firing-onset markers recorded in
 * imp-95286 (x = 4.930455, 7.896539, 10.940699 at N = 3, 4, 5).
 *
 * All curve values are recomputed here independently from the closed forms
 * documented in imp-95286-confluent-laguerre-floor.js (floorT, via its own
 * dLag/laguerreVals helpers) and imp-95251-nfold-coalescence-law.js (coalN,
 * same Laguerre-recurrence definition) -- no new derivation, no heavy
 * import, no re-import of the source modules (each carries its own
 * self-executing assertions). Follows the imp-95282 / imp-95279 import-light
 * viz-data pattern.
 *
 * PRESENTATION POINT. For every sampled x and every N in {3, 4, 5}, the
 * floor sqrt(T(N,x)) sits strictly below the ceiling coalN(N,1.3,x), and the
 * ratio coalN/sqrt(T) at the point where the ceiling crosses 1 (the imp-95251
 * firing onset) is exactly the imp-95286 baked overpricingCapAtOnsets:
 * 3.460619 (N=3), 6.151212 (N=4), 10.898085 (N=5) -- the bracket is tightest
 * (in this normalized sense) at N = 3 and loosens as N grows, matching the
 * imp-95286 asymptotic rho(N,R,x) -> R^(N-1).
 *
 * MEASUREMENT / PRESENTATION ONLY. Reuses the imp-95286 / imp-95251 closed
 * forms verbatim; changes no bound, no operator positivity, no RH claim;
 * NO QED. No refereed bound is changed.
 *
 * @see imp-95286-confluent-laguerre-floor.js (source: THEOREM CONF-LB floor,
 *   COROLLARY WINDOW-PINCH bracket, overpricingCapAtOnsets)
 * @see imp-95251-nfold-coalescence-law.js (source: THEOREM COAL-N ceiling)
 *
 * Ticket: imp-95303 (ux, sonnet-4-6, low). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

// window ratio used throughout (imp-95286 firing-onset convention)
export const IMP95303_WINDOW_RATIO = 1.3;

// sqrt(T(N,x)) floor vs coalN(N, 1.3, x) ceiling, N = 3, 4, 5, x = 1..13
export const IMP95303_CURVES = [
  { x: 1, n3Floor: 8.2260343798e-1, n3Ceil: 6.9087759052e+0, n4Floor: 8.5838536273e-1, n4Ceil: 1.8478339077e+1, n5Floor: 8.9273425258e-1, n5Ceil: 4.3189070919e+1 },
  { x: 2, n3Floor: 7.7744201284e-1, n3Ceil: 5.3213833369e+0, n4Floor: 7.9810852591e-1, n4Ceil: 1.9601240636e+1, n5Floor: 8.1825323399e-1, n5Ceil: 6.1246397457e+1 },
  { x: 3, n3Floor: 6.6981650023e-1, n3Ceil: 3.3168144947e+0, n4Floor: 7.3340931432e-1, n4Ceil: 1.5353933588e+1, n5Floor: 7.9191180108e-1, n5Ceil: 5.9170008974e+1 },
  { x: 4, n3Floor: 4.6371493882e-1, n3Ceil: 1.8440185233e+0, n4Floor: 7.0970310622e-1, n4Ceil: 1.0228869165e+1, n5Floor: 7.1138176179e-1, n5Ceil: 4.6610096956e+1 },
  { x: 5, n3Floor: 2.7789436937e-1, n3Ceil: 9.5341950037e-1, n4Floor: 5.8657989976e-1, n4Ceil: 6.1494996278e+0, n5Floor: 6.9990013409e-1, n5Ceil: 3.2254833032e+1 },
  { x: 6, n3Floor: 1.5169072240e-1, n3Ceil: 4.6868246156e-1, n4Floor: 4.1537408091e-1, n4Ceil: 3.4418366324e+0, n5Floor: 6.5439526923e-1, n5Ceil: 2.0390727020e+1 },
  { x: 7, n3Floor: 7.7660014162e-2, n3Ceil: 2.2197030806e-1, n4Floor: 2.6280786995e-1, n4Ceil: 1.8271026349e+0, n5Floor: 5.3312212068e-1, n5Ceil: 1.2054269894e+1 },
  { x: 7.896539, n3Floor: 4.0945935155e-2, n3Ceil: 1.1082183645e-1, n4Floor: 1.6256954477e-1, n4Ceil: 9.9999965793e-1, n5Floor: 3.9949634798e-1, n5Ceil: 7.1971917946e+0 },
  { x: 8, n3Floor: 3.7954746364e-2, n3Ceil: 1.0215507945e-1, n4Floor: 1.5327183496e-1, n4Ceil: 9.3111633198e-1, n5Floor: 3.8434344638e-1, n5Ceil: 6.7656938321e+0 },
  { x: 9, n3Floor: 1.7909734878e-2, n3Ceil: 4.5955342846e-2, n4Floor: 8.4119602347e-2, n4Ceil: 4.5932931625e-1, n5Floor: 2.5213359919e-1, n5Ceil: 3.6432802207e+0 },
  { x: 10, n3Floor: 8.2224023235e-3, n3Ceil: 2.0293768604e-2, n4Floor: 4.4055373326e-2, n4Ceil: 2.2065879196e-1, n5Floor: 1.5384139764e-1, n5Ceil: 1.8965215326e+0 },
  { x: 10.940699, n3Floor: 3.8743401043e-3, n3Ceil: 9.2751280610e-3, n4Floor: 2.3173570844e-2, n4Ceil: 1.0849722380e-1, n5Floor: 9.1759182441e-2, n5Ceil: 9.9999989694e-1 },
  { x: 11, n3Floor: 3.6927381131e-3, n3Ceil: 8.8248446636e-3, n4Floor: 2.2232584784e-2, n4Ceil: 1.0368821145e-1, n5Floor: 8.8689699448e-2, n5Ceil: 9.5973678153e-1 },
  { x: 12, n3Floor: 1.6287726355e-3, n3Ceil: 3.7880298001e-3, n4Floor: 1.0887185409e-2, n4Ceil: 4.7822174279e-2, n5Floor: 4.8858381415e-2, n5Ceil: 4.7418778721e-1 },
  { x: 13, n3Floor: 7.0767083847e-4, n3Ceil: 1.6080435467e-3, n4Floor: 5.2004189311e-3, n4Ceil: 2.1706045764e-2, n5Floor: 2.5934358938e-2, n5Ceil: 2.2952153326e-1 },
];

// coalN(N, 1.3, x) = 1 firing onsets recorded in imp-95286, with the
// baked overpricing cap rho = coalN/sqrt(T) at that onset
export const IMP95303_ONSETS = {
  n3: { x: 4.930455, rho: 3.460619 },
  n4: { x: 7.896539, rho: 6.151212 },
  n5: { x: 10.940699, rho: 10.898085 },
};

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

function coalNExact(N, R, x) {
  const Ln = laguerreVals(Math.max(N - 1, 1), -2 * R * x);
  let s = Ln[N - 1];
  for (let k = 0; k <= N - 2; k++) s += 2 * Ln[k];
  return Math.exp(-x) * s;
}

const IMP95303_ASSERTIONS = [
  {
    id: 'imp95303-floor-matches-closed-form',
    description: 'every baked sqrt(T(N,x)) floor value matches the imp-95286 closed form to 1e-6 relative, N in {3,4,5}',
    holds: () =>
      IMP95303_CURVES.every((p) =>
        [3, 4, 5].every((N) => {
          const key = `n${N}Floor`;
          const expected = floorSqrtT(N, p.x);
          return Math.abs(p[key] - expected) / expected < 1e-6;
        }),
      ),
  },
  {
    id: 'imp95303-ceil-matches-closed-form',
    description: 'every baked coalN(N,1.3,x) ceiling value matches the imp-95251 closed form to 1e-6 relative, N in {3,4,5}',
    holds: () =>
      IMP95303_CURVES.every((p) =>
        [3, 4, 5].every((N) => {
          const key = `n${N}Ceil`;
          const expected = coalNExact(N, IMP95303_WINDOW_RATIO, p.x);
          return Math.abs(p[key] - expected) / expected < 1e-6;
        }),
      ),
  },
  {
    id: 'imp95303-floor-below-ceiling',
    description: 'the floor sits strictly below the ceiling at every sampled x, for every N in {3,4,5} (imp-95286 COROLLARY WINDOW-PINCH bracket)',
    holds: () =>
      IMP95303_CURVES.every((p) => [3, 4, 5].every((N) => p[`n${N}Floor`] < p[`n${N}Ceil`])),
  },
  {
    id: 'imp95303-onsets-reproduce-overpricing-cap',
    description: 'the recorded onset rho = coalN(N,1.3,x)/sqrt(T(N,x)) reproduces the imp-95286 baked overpricingCapAtOnsets to 1e-4 relative, N in {3,4,5}',
    holds: () =>
      [
        [3, IMP95303_ONSETS.n3],
        [4, IMP95303_ONSETS.n4],
        [5, IMP95303_ONSETS.n5],
      ].every(([N, o]) => {
        const live = coalNExact(N, IMP95303_WINDOW_RATIO, o.x) / floorSqrtT(N, o.x);
        return Math.abs(live - o.rho) / o.rho < 1e-4;
      }),
  },
  {
    id: 'imp95303-ceiling-crosses-one-at-onset',
    description: 'coalN(N,1.3,x) equals 1 (to 1e-4 relative) at each recorded onset x -- the firing-onset definition',
    holds: () =>
      [
        [3, IMP95303_ONSETS.n3],
        [4, IMP95303_ONSETS.n4],
        [5, IMP95303_ONSETS.n5],
      ].every(([N, o]) => Math.abs(coalNExact(N, IMP95303_WINDOW_RATIO, o.x) - 1) < 1e-3),
  },
];

for (const a of IMP95303_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95303-conf-lb-vs-coaln-window-pinch-viz-data assertion failed: ${a.id}`);
  }
}
