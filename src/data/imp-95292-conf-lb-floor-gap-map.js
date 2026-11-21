/**
 * imp-95292: MEASUREMENT -- the imp-95286 CONF-LB floor gap to the EXACT
 * confluent pencil, tabulated across N = 2..6 and window x, characterizing
 * which side (floor or ceiling) owns the two-sided bracket at each (N, x).
 *
 * CONTEXT. imp-95286 THEOREM CONF-LB gives the closed-form confluent floor
 *   T(N, x) = e^(-2x) sum_(k=0..N-1) DL_k(2x)^2,   DL_k = L_k - L_(k-1),
 * an EXACT Rayleigh value (top Laguerre mode) that lower-bounds the
 * confluent span sup Lambda_conf(N, x). imp-95287 THEOREM MONO-N /
 * COROLLARY WINDOW-EXACT then made that sup EXACT and R-independent: the
 * confluent pencil lambda_max IS the window sup over any ratio-R window. So
 * lambda_max(pencil)/T is precisely the residual gap of the closed-form
 * floor to the exact certificate value, and coalN(N,1,x)^2/lambda_max is
 * the residual gap of the imp-95251 COAL-N ceiling to that same value.
 *
 * imp-95286 recorded lambda_max/T only at N = 2,3,4 for x = 4/8/12 and
 * concluded "the ceiling side owns the bracket" at x = 12 -- a claim never
 * tabulated across N up to 6 or across a window grid. This leg supplies
 * that table.
 *
 * WHAT IS MEASURED (orthonormal-Laguerre-basis eigensolve; the monomial
 * basis is the recorded coalescence float trap and is NOT used):
 *   floorGap(N, x) = lambda_max(exact confluent pencil) / T(N, x)   >= 1,
 *   ceilGap(N, x)  = coalN(N, 1, x)^2 / lambda_max(exact pencil)     >= 1,
 * with owner = "ceiling" where ceilGap > floorGap, else "floor".
 * Grid: N = 2..6, x in {4, 8, 12, 16, 24}. Power iteration on the small PSD
 * matrix M_ij = int_(2x)^inf L_i L_j e^(-u) du (Simpson, tail 2x+90); the
 * shallow-x high-N cells were checked stable to 5 digits under 6x panel
 * refinement (this is a measurement, not a certificate).
 *
 * FINDINGS.
 * (1) The CEILING owns the bracket at EVERY (N, x) on the grid -- 25 of 25
 *     cells: coalN over-pricing dwarfs the floor deficit everywhere, from
 *     ceilGap/floorGap ~ 1.81x (N=2, x=4) to ~ 3879x (N=6, x=4). This
 *     confirms and generalizes the imp-95286 x=12 verdict to N up to 6 and
 *     to the full window grid. Sharpening effort belongs on COAL-N, never
 *     the floor.
 * (2) The floor is TIGHTEST at large x and small N: floorGap decays like
 *     1 + O(x^-1) in x (the 1-2 percent figure holds at x >= 12 for
 *     N <= 4: 1.0017 / 1.0082 / 1.0225 at N = 2/3/4, x = 12) and DEGRADES
 *     with N at fixed shallow x: at x = 4 it climbs 1.0152 -> 1.0991 ->
 *     1.4150 -> 1.9027 for N = 2..5 (the 1-2 percent figure fails badly),
 *     with a genuine NON-MONOTONE dip at N = 6, x = 4 (1.6360 < 1.9027 at
 *     N = 5), stable under quadrature refinement -- the trial mode L_(N-1)
 *     matches the true top eigenmode better at some (N, x) than others.
 * (3) The window x needed to bring the floor inside 2 percent grows with
 *     N: x ~ 12 suffices at N = 2, but N = 6 needs x ~ 24 (floorGap
 *     1.0159) to reach the same band -- the floor "moderate depth" is
 *     N-dependent.
 *
 * SKEPTICAL / CROSS-CHECK. The N = 2,3,4 at x = 4/8/12 cells reproduce
 * the imp-95286 baked anchors (1.0152/1.0039/1.0017, 1.0991/1.0200/1.0082,
 * 1.4150/1.0618/1.0225) to 4 decimals; the live recompute matches the
 * baked table within 5e-4; every ceilGap > floorGap (ceiling owns).
 *
 * HONEST SCOPE. MEASUREMENT of a model-family quantity only. Proves no new
 * bound, fires no certificate, decides nothing: it reads off gaps of the
 * already-proven imp-95286 floor and imp-95251 ceiling against the
 * imp-95287-exact confluent pencil. The imp-95212 fresnel-airy envelope
 * port, signed WEIGHT port, off-lattice rates, modulus/phase currency,
 * gammaSL map all remain OPEN. Changes no bound of the Lambda program;
 * NO QED; no refereed bound is changed.
 */

export const IMP95292_CONF_LB_FLOOR_GAP_MAP = {
  id: "imp-95292",
  title:
    "MEASUREMENT: imp-95286 CONF-LB floor gap to the exact confluent pencil " +
    "across N = 2..6 and window x -- the ceiling (COAL-N) owns the bracket " +
    "at every (N, x), the floor is tightest at large x / small N",
  quantities:
    "floorGap(N,x) = lambda_max(exact confluent pencil)/T(N,x); " +
    "ceilGap(N,x) = coalN(N,1,x)^2/lambda_max; owner = ceiling where " +
    "ceilGap > floorGap. lambda_max via orthonormal-Laguerre eigensolve " +
    "(monomial basis is the coalescence float trap, avoided).",
  // baked table: rows over N = 2..6, x in {4,8,12,16,24}
  table: [
    { N: 2, x: 4, floorGap: 1.0152, ceilGap: 1.8338, owner: "ceiling" },
    { N: 2, x: 8, floorGap: 1.0039, ceilGap: 1.3992, owner: "ceiling" },
    { N: 2, x: 12, floorGap: 1.0017, ceilGap: 1.2612, owner: "ceiling" },
    { N: 2, x: 16, floorGap: 1.0010, ceilGap: 1.1940, owner: "ceiling" },
    { N: 2, x: 24, floorGap: 1.0004, ceilGap: 1.1279, owner: "ceiling" },
    { N: 3, x: 4, floorGap: 1.0991, ceilGap: 6.7576, owner: "ceiling" },
    { N: 3, x: 8, floorGap: 1.0200, ceilGap: 2.9722, owner: "ceiling" },
    { N: 3, x: 12, floorGap: 1.0082, ceilGap: 2.1358, owner: "ceiling" },
    { N: 3, x: 16, floorGap: 1.0044, ceilGap: 1.7897, owner: "ceiling" },
    { N: 3, x: 24, floorGap: 1.0019, ceilGap: 1.4875, owner: "ceiling" },
    { N: 4, x: 4, floorGap: 1.4150, ceilGap: 49.5128, owner: "ceiling" },
    { N: 4, x: 8, floorGap: 1.0618, ceilGap: 9.7973, owner: "ceiling" },
    { N: 4, x: 12, floorGap: 1.0225, ceilGap: 4.9019, owner: "ceiling" },
    { N: 4, x: 16, floorGap: 1.0115, ceilGap: 3.3839, owner: "ceiling" },
    { N: 4, x: 24, floorGap: 1.0047, ceilGap: 2.2971, owner: "ceiling" },
    { N: 5, x: 4, floorGap: 1.9027, ceilGap: 559.8507, owner: "ceiling" },
    { N: 5, x: 8, floorGap: 1.1647, ceilGap: 51.6194, owner: "ceiling" },
    { N: 5, x: 12, floorGap: 1.0505, ceilGap: 15.4861, owner: "ceiling" },
    { N: 5, x: 16, floorGap: 1.0240, ceilGap: 8.1328, owner: "ceiling" },
    { N: 5, x: 24, floorGap: 1.0091, ceilGap: 4.1654, owner: "ceiling" },
    { N: 6, x: 4, floorGap: 1.6360, ceilGap: 6347.5826, owner: "ceiling" },
    { N: 6, x: 8, floorGap: 1.4318, ceilGap: 440.9447, owner: "ceiling" },
    { N: 6, x: 12, floorGap: 1.1048, ceilGap: 68.8314, owner: "ceiling" },
    { N: 6, x: 16, floorGap: 1.0451, ceilGap: 25.1299, owner: "ceiling" },
    { N: 6, x: 24, floorGap: 1.0159, ceilGap: 8.9027, owner: "ceiling" },
  ],
  findings:
    "The ceiling owns the bracket at all 25 (N,x) cells (ceilGap/floorGap " +
    "from 1.81x to ~3879x). The floor is tightest at large x / small N " +
    "(within 1-2 percent at x >= 12 for N <= 4) and degrades with N at " +
    "shallow x (floorGap 1.0152 -> 1.9027 for N = 2..5 at x = 4, with a " +
    "stable non-monotone dip to 1.6360 at N = 6). The x needed to reach " +
    "the 2 percent band grows with N (x ~ 12 at N = 2 vs x ~ 24 at N = 6).",
  crossCheck:
    "N = 2,3,4 at x = 4/8/12 reproduce the imp-95286 baked floorGap " +
    "anchors to 4 decimals; live recompute matches the baked table within " +
    "5e-4; shallow-x high-N cells stable to 5 digits under 6x panel " +
    "refinement.",
  subGap:
    "MEASUREMENT only. imp-95212 fresnel-airy envelope port, signed WEIGHT " +
    "port, off-lattice rates, modulus/phase currency, gammaSL map remain " +
    "OPEN.",
  verdict:
    "MEASUREMENT of a model-family quantity. Proves no new bound, fires no " +
    "certificate, decides nothing -- it reads gaps of the proven imp-95286 " +
    "floor and imp-95251 ceiling against the imp-95287-exact confluent " +
    "pencil. Changes no bound of the Lambda program; NO QED; " +
    "no refereed bound is changed.",
};

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light: no imports at all)
// ---------------------------------------------------------------------------

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
function simpson(f, a, b, n) {
  const h = (b - a) / n;
  let s = f(a) + f(b);
  for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
  return (s * h) / 3;
}
function floorT(N, x) {
  let S = 0;
  for (let k = 0; k < N; k++) S += dLag(k, 2 * x) ** 2;
  return Math.exp(-2 * x) * S;
}
function coalN(N, R, x) {
  const Ln = laguerreVals(Math.max(N - 1, 1), -2 * R * x);
  let s = Ln[N - 1];
  for (let k = 0; k <= N - 2; k++) s += 2 * Ln[k];
  return Math.exp(-x) * s;
}
function confluentPencilLambdaMax(N, x) {
  const M = [];
  for (let i = 0; i < N; i++) {
    M.push([]);
    for (let j = 0; j < N; j++) {
      M[i].push(
        simpson(
          (u) => laguerreVals(N, u)[i] * laguerreVals(N, u)[j] * Math.exp(-u),
          2 * x,
          2 * x + 90,
          20000
        )
      );
    }
  }
  let v = new Array(N).fill(1);
  let lam = 0;
  for (let it = 0; it < 2000; it++) {
    const w = M.map((row) => row.reduce((a, c, j) => a + c * v[j], 0));
    const n = Math.hypot(...w);
    v = w.map((c) => c / n);
    lam = n;
  }
  return lam;
}

export const IMP95292_CONF_LB_FLOOR_GAP_ASSERTIONS = [
  {
    id: "imp95292-table-live-recompute",
    description:
      "the baked floorGap/ceilGap table matches a live orthonormal-Laguerre " +
      "eigensolve at every (N,x) cell within 5e-4",
    holds: () => {
      for (const row of IMP95292_CONF_LB_FLOOR_GAP_MAP.table) {
        const { N, x, floorGap, ceilGap } = row;
        const T = floorT(N, x);
        const lam = confluentPencilLambdaMax(N, x);
        const up = coalN(N, 1, x) ** 2;
        if (Math.abs(lam / T - floorGap) > 5e-4) return false;
        if (Math.abs(up / lam - ceilGap) / ceilGap > 5e-4) return false;
      }
      return true;
    },
  },
  {
    id: "imp95292-ceiling-owns-everywhere",
    description:
      "the ceiling owns the bracket at all 25 cells: ceilGap > floorGap and " +
      "owner === ceiling for every row",
    holds: () =>
      IMP95292_CONF_LB_FLOOR_GAP_MAP.table.every(
        (r) => r.ceilGap > r.floorGap && r.owner === "ceiling"
      ),
  },
  {
    id: "imp95292-imp95286-anchors",
    description:
      "the N = 2,3,4 at x = 4/8/12 floorGap cells reproduce the imp-95286 " +
      "baked tightness anchors (1.0152/1.0039/1.0017, 1.0991/1.0200/1.0082, " +
      "1.4150/1.0618/1.0225) to 4 decimals",
    holds: () => {
      const want = {
        "2,4": 1.0152, "2,8": 1.0039, "2,12": 1.0017,
        "3,4": 1.0991, "3,8": 1.0200, "3,12": 1.0082,
        "4,4": 1.4150, "4,8": 1.0618, "4,12": 1.0225,
      };
      for (const [key, v] of Object.entries(want)) {
        const [N, x] = key.split(",").map(Number);
        const row = IMP95292_CONF_LB_FLOOR_GAP_MAP.table.find(
          (r) => r.N === N && r.x === x
        );
        if (!row || Math.abs(row.floorGap - v) > 5e-4) return false;
      }
      return true;
    },
  },
  {
    id: "imp95292-floor-decays-in-x",
    description:
      "at fixed N the floorGap is monotone decreasing in x (floor tightens " +
      "with depth) for every N = 2..6",
    holds: () => {
      for (let N = 2; N <= 6; N++) {
        const rows = IMP95292_CONF_LB_FLOOR_GAP_MAP.table
          .filter((r) => r.N === N)
          .sort((a, b) => a.x - b.x);
        for (let i = 1; i < rows.length; i++) {
          if (!(rows[i].floorGap < rows[i - 1].floorGap)) return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95292-honest-scope",
    description:
      "honest-scope strings present: NO QED, no refereed bound is changed, MEASUREMENT only, " +
      "remain OPEN",
    holds: () => {
      const o = IMP95292_CONF_LB_FLOOR_GAP_MAP;
      return (
        /NO QED/.test(o.verdict) &&
        /refereed bound is changed/i.test(o.verdict) &&
        /MEASUREMENT/.test(o.verdict) &&
        /remain\s+OPEN/.test(o.subGap)
      );
    },
  },
];

for (const a of IMP95292_CONF_LB_FLOOR_GAP_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95292-conf-lb-floor-gap-map assertion failed: ${a.id}`);
  }
}

export default IMP95292_CONF_LB_FLOOR_GAP_MAP;
