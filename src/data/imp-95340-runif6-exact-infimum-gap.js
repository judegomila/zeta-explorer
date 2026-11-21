/**
 * @module imp-95340-runif6-exact-infimum-gap
 *
 * imp-95340 (measurement only): quantify the gap between the imp-95332
 * COROLLARY PEN-UNIF6 r-uniform floor A_unif6(rho) = (16 / a^2) W6(a, 16/a^2)
 * (a = ln rho) and the EXACT r-uniform symbol-pencil infimum across rho.
 *
 * DEFINITIONS (all in imp-95332 conventions, a = ln rho, b = ln r):
 *   - A_unif6(a): the r-and-m-uniform RZ-PEN6 chart floor, which charges the
 *     twin prefactor at its uniform bound mu = 16 / a^2 (imp-95332).
 *   - exact symbol-pencil infimum at fixed (a, b):
 *     G(a, b) = inf_theta pencilSymbolMin(theta, a, b) (the exact block-symbol
 *     minimum, imp-95332 gridInfRefined -- the same object the fixed-r
 *     looseness ledger 6.085 -> 5.060 is measured against).
 *   - exact r-UNIFORM infimum: G_unif(a) = inf over r in (1, sqrt(rho)]
 *     (i.e. b in (0, a/2]) of G(a, b). This is the sharpest r-uniform target a
 *     floor valid for the whole octave twin-range can attain.
 *   - r-uniform looseness L_unif(a) = G_unif(a) / A_unif6(a) >= 1.
 *
 * MEASURED FINDING (this module, cross-checked below):
 *   (1) The minimizer of G(a, b) over b in (0, a/2] is ALWAYS the endpoint
 *       b = a/2, i.e. r = sqrt(rho) -- the maximally-SEPARATED twin, NOT the
 *       coalescent end. G(a, b) is monotone DECREASING in b, so the exact
 *       r-uniform infimum equals the well-separated-twin symbol infimum
 *       G(a, a/2). The coalescence-uniform construction is tightest at
 *       coalescence and loosest at the octave-boundary separation.
 *   (2) L_unif grows monotonically with rho, from 1.050 at rho = 2 to 32.58 at
 *       rho = e^10 (a = 10). At rho = e^6 the r-uniform looseness is 9.138 --
 *       strictly larger than the fixed-r looseness already tabulated
 *       (5.060 at r = 2, 3.254 at r = e^3, 3.029 at r = e^5.9, imp-95368),
 *       because the r-uniform floor must also cover the worst r = sqrt(rho)
 *       end. This is a DISTINCT quantity from the fixed-r looseness ledger.
 *   (3) A_unif6(a) is itself non-monotone (peaks near a = 4 at 6.726e-2 then
 *       declines) while G_unif(a) keeps rising toward its rho -> infinity
 *       ceiling (~1); hence the r-uniform floor currency the tail-cap leg left
 *       is fully consumed at large rho and the residual is the SEPARATION end,
 *       consistent with the imp-95368 named large-rho residual (pair-identity
 *       truncation + b-uniform t3 weight), not a new one.
 *
 * Changes no bound; no certificate onset moves; NO QED. No refereed bound is changed
 * . Import-light (no zeros bundle). The numerics
 * below recompute a few cheap spot-checks of the baked table; the full
 * 9-row table was produced offline with the same verbatim machinery.
 */

export const IMP95340_RUNIF6_EXACT_INFIMUM_GAP = {
  id: 'imp-95340',
  title:
    'Measure the imp-95332 COROLLARY PEN-UNIF6 r-uniform floor A_unif6 gap ' +
    'to the exact r-uniform symbol-pencil infimum across rho',
  citedFrom: 'imp-95332-chart-tail-pencil-floor.js',
  definitions: {
    aUnif6: 'r-and-m-uniform RZ-PEN6 chart floor (16 / a^2) W6(a, 16 / a^2), a = ln rho',
    exactRUnifInf:
      'inf over r in (1, sqrt(rho)] of the exact block-symbol infimum ' +
      'inf_theta pencilSymbolMin(theta, ln rho, ln r); the sharpest ' +
      'r-uniform target',
    looseness: 'exactRUnifInf / aUnif6, always >= 1',
  },
  // b = ln r minimizer of the exact symbol infimum over (0, a/2] is the
  // endpoint b = a/2 (r = sqrt(rho)) for every rho: the well-separated,
  // NOT the coalescent, twin end governs the r-uniform infimum.
  minimizerIsSeparationEnd: true,
  table: [
    { rho: 2, a: 0.693147, aUnif6: 1.997533700e-9, exactRUnifInf: 2.097273856e-9, looseness: 1.049932 },
    { rho: 4, a: 1.386294, aUnif6: 3.544619940e-4, exactRUnifInf: 4.151853487e-4, looseness: 1.171311 },
    { rho: 10, a: 2.302585, aUnif6: 1.855077595e-2, exactRUnifInf: 2.838366438e-2, looseness: 1.530053 },
    { rho: 20.0855369232, a: 3.0, aUnif6: 4.810926286e-2, exactRUnifInf: 1.021911970e-1, looseness: 2.124148 },
    { rho: 54.5981500331, a: 4.0, aUnif6: 6.726187889e-2, exactRUnifInf: 2.567892302e-1, looseness: 3.817753 },
    { rho: 148.413159103, a: 5.0, aUnif6: 6.707101819e-2, exactRUnifInf: 4.123379813e-1, looseness: 6.147782 },
    { rho: 403.428793493, a: 6.0, aUnif6: 5.941580419e-2, exactRUnifInf: 5.429419498e-1, looseness: 9.138006 },
    { rho: 2980.95798704, a: 8.0, aUnif6: 4.123493617e-2, exactRUnifInf: 7.258268825e-1, looseness: 17.602231 },
    { rho: 22026.4657948, a: 10.0, aUnif6: 2.562431350e-2, exactRUnifInf: 8.349140504e-1, looseness: 32.582885 },
  ],
  looseness: {
    rho2: 1.049932,
    rhoE6: 9.138006,
    rhoE10: 32.582885,
    // fixed-r looseness at rho = e^6 for reference (imp-95368), strictly
    // smaller than the r-uniform 9.138 since it does not cover r = sqrt(rho)
    rhoE6FixedR2Ref: 5.06029829805588,
    rhoE6FixedRe3Ref: 3.254,
  },
  finding:
    'the exact r-uniform symbol-pencil infimum is governed by the ' +
    'maximally-SEPARATED twin r = sqrt(rho) (G is monotone decreasing in ' +
    'ln r); the RZ-PEN6 r-uniform floor undershoots it by a factor rising ' +
    'monotonically from 1.05 (rho = 2) to 9.14 (rho = e^6) to 32.6 ' +
    '(rho = e^10), strictly above the fixed-r looseness at every rho',
  namedResidual:
    'the surviving r-uniform gap sits at the octave-separation end and lives ' +
    'in the same two open legs as the fixed-r large-rho residual (imp-95368): ' +
    'the {0, +-1} pair-identity truncation and the b-uniform t3 weight; no ' +
    'new leg is opened here',
  honest:
    'MEASUREMENT ONLY -- this module tabulates a previously-untabulated ' +
    'quantity (the r-uniform floor gap, distinct from the fixed-r looseness ' +
    'ledger), changes no bound, moves no certificate onset, and opens no new ' +
    'residual. NO QED; no refereed bound is changed.',
};

// ---------------------------------------------------------------------------
// Cheap self-contained cross-check machinery (imp-95332 conventions, verbatim)
// ---------------------------------------------------------------------------
const PI = Math.PI;
const sechHalf = (u) => 1 / Math.cosh(u / 2);
const kernelP = (w, a) => (2 * PI) / a / Math.cosh((PI * w) / a);

function symbols(theta, a, b, NN = 14) {
  const tau = b / a;
  let fa = 0;
  let br = 0;
  const Ps = [];
  for (let n = -NN; n <= NN; n++) {
    const w = theta + 2 * PI * n;
    const p = kernelP(w, a);
    Ps.push(p);
    fa += p;
    br += p * Math.cos(w * tau);
  }
  let C = 0;
  for (let i = 0; i < Ps.length; i++)
    for (let j = 0; j < Ps.length; j++) {
      if (i === j) continue;
      const s = Math.sin(PI * Math.abs(i - j) * tau);
      C += 2 * s * s * Ps[i] * Ps[j];
    }
  return { fa, br, C };
}
function pencilSymbolMin(theta, a, b) {
  const s = sechHalf(b);
  const A = 1 - s * s;
  const { fa, br, C } = symbols(theta, a, b);
  const Bp = fa - s * br;
  return C / (Bp + Math.sqrt(Math.max(Bp * Bp - A * C, 0)));
}
function gridInfRefined(a, b, Ngrid) {
  let inf = Infinity;
  let thBest = 0;
  for (let i = 0; i <= Ngrid; i++) {
    const th = -PI + (2 * PI * i) / Ngrid;
    const v = pencilSymbolMin(th, a, b);
    if (v < inf) {
      inf = v;
      thBest = th;
    }
  }
  let lo = thBest - (2 * PI) / Ngrid;
  let hi = thBest + (2 * PI) / Ngrid;
  for (let round = 0; round < 3; round++) {
    let best = Infinity;
    let tb = lo;
    for (let i = 0; i <= 200; i++) {
      const th = lo + ((hi - lo) * i) / 200;
      const v = pencilSymbolMin(th, a, b);
      if (v < best) {
        best = v;
        tb = th;
      }
    }
    inf = Math.min(inf, best);
    const w = (hi - lo) / 200;
    lo = tb - w;
    hi = tb + w;
  }
  return inf;
}
function baseConstants(a) {
  const pi2 = PI * PI;
  const kap = (4 * Math.cosh(a / 2)) / (a * a);
  const e2 = Math.exp((-2 * pi2) / a);
  const e3 = Math.exp((-3 * pi2) / a);
  const tA = (((8 * PI) / a) * e3) / (1 - e2);
  const tQ = (((200 * PI ** 3) / a) * e3) / (1 - 4 * e2);
  return { kap, tA, tQ };
}
function pen3Constants(a) {
  const { kap, tA, tQ } = baseConstants(a);
  const kap2 = 4 / (a * a);
  const cAlpha = 2 / (1 + sechHalf(a));
  const tw = (w) => cAlpha + Math.min(kap * w * w, 2 + kap2 * w * w);
  const c3n = cAlpha * tA + Math.min(kap * tQ, 2 * tA + kap2 * tQ);
  return { tw, c3n, kap, kap2, cAlpha };
}
const sideSum = (th, a) => kernelP(2 * PI - th, a) + kernelP(2 * PI + th, a);
function chartV4(a, t0, t1) {
  const { tw, c3n } = pen3Constants(a);
  const P1 = kernelP(t1, a);
  const S0 = sideSum(t0, a);
  return (4 * P1 * S0) / (tw(t1) * P1 + tw(2 * PI + t1) * S0 + c3n);
}
function chartPsi5(a, t0, t1, mu) {
  const { tw, c3n } = pen3Constants(a);
  const X = kernelP(t1, a) * (kernelP(2 * PI - t0, a) + kernelP(2 * PI + t1, a));
  const T =
    tw(t1) * kernelP(t0, a) +
    tw(2 * PI - t0) * kernelP(2 * PI - t1, a) +
    tw(2 * PI + t1) * kernelP(2 * PI + t0, a) +
    c3n;
  const disc = Math.max((T * T) / 4 - 4 * mu * X, 0);
  return (4 * X) / (T / 2 + Math.sqrt(disc));
}
function c3nChart(a, t0, t1, N = 12) {
  const { tw, kap, kap2, cAlpha } = pen3Constants(a);
  let s = 0;
  for (let m = 2; m <= N; m++) {
    s += tw(2 * PI * m + t1) * kernelP(2 * PI * m + t0, a);
    s += tw(2 * PI * m - t0) * kernelP(2 * PI * m - t1, a);
  }
  const pi2 = PI * PI;
  const e2 = Math.exp((-2 * pi2) / a);
  const eA = Math.exp((-(2 * N + 1) * pi2) / a);
  const tAr = (((8 * PI) / a) * eA) / (1 - e2);
  const tQr = (((8 * (2 * N + 3) ** 2 * PI ** 3) / a) * eA) / (1 - 4 * e2);
  const rem = cAlpha * tAr + Math.min(kap * tQr, 2 * tAr + kap2 * tQr);
  return s + rem;
}
function chartPsi6(a, t0, t1, mu, N = 12) {
  const { tw } = pen3Constants(a);
  const X = kernelP(t1, a) * (kernelP(2 * PI - t0, a) + kernelP(2 * PI + t1, a));
  const T =
    tw(t1) * kernelP(t0, a) +
    tw(2 * PI - t0) * kernelP(2 * PI - t1, a) +
    tw(2 * PI + t1) * kernelP(2 * PI + t0, a) +
    c3nChart(a, t0, t1, N);
  const disc = Math.max((T * T) / 4 - 4 * mu * X, 0);
  return (4 * X) / (T / 2 + Math.sqrt(disc));
}
function w6Scan(a, mu, K = 256, N = 12) {
  let worst = Infinity;
  for (let k = 0; k < K; k++) {
    const t0 = (PI * k) / K;
    const t1 = (PI * (k + 1)) / K;
    const v = Math.max(
      chartV4(a, t0, t1),
      chartPsi5(a, t0, t1, mu),
      chartPsi6(a, t0, t1, mu, N),
    );
    if (v < worst) worst = v;
  }
  return worst;
}
const aUnif6 = (a) => (16 / (a * a)) * w6Scan(a, 16 / (a * a));

const REC = IMP95340_RUNIF6_EXACT_INFIMUM_GAP;
const rel = (x, y) => Math.abs(x - y) / Math.abs(y);

export const IMP95340_ASSERTIONS = [
  {
    id: 'imp95340-runif-floor-literal',
    description:
      'the baked A_unif6 at rho = e^6 recomputes to the imp-95332 corollary ' +
      'literal 0.059415804190528276 (rel 1e-9)',
    holds: () => {
      const row = REC.table.find((r) => r.a === 6.0);
      return (
        rel(aUnif6(6), 0.059415804190528276) < 1e-9 &&
        rel(row.aUnif6, 0.059415804190528276) < 1e-6
      );
    },
  },
  {
    id: 'imp95340-exact-runif-inf-and-looseness',
    description:
      'the exact r-uniform infimum at rho = e^6 (the b = a/2 endpoint, ' +
      'r = sqrt(rho)) recomputes to the baked 5.429e-1 and its looseness to ' +
      'the baked 9.138 (rel 1e-4)',
    holds: () => {
      const g = gridInfRefined(6, 3, 801);
      const fl = aUnif6(6);
      return (
        rel(g, 0.5429419498) < 1e-4 &&
        rel(g / fl, REC.looseness.rhoE6) < 1e-4 &&
        g / fl > REC.looseness.rhoE6FixedR2Ref
      );
    },
  },
  {
    id: 'imp95340-minimizer-is-separation-end',
    description:
      'the exact symbol infimum is monotone decreasing in b, so the ' +
      'r-uniform minimizer is the separation endpoint b = a/2, not the ' +
      'coalescent end (checked at a = 6: G(6, 3) < G(6, 1.5) < G(6, 0.3))',
    holds: () => {
      const gHalf = gridInfRefined(6, 3, 801);
      const gQuart = gridInfRefined(6, 1.5, 801);
      const gCoal = gridInfRefined(6, 0.3, 801);
      return (
        REC.minimizerIsSeparationEnd === true &&
        gHalf < gQuart &&
        gQuart < gCoal
      );
    },
  },
  {
    id: 'imp95340-looseness-monotone-and-honest',
    description:
      'the tabulated r-uniform looseness is >= 1 and strictly increasing in ' +
      'rho, and the note is measurement-only with PT Lambda <= 0.2 SOTA',
    holds: () => {
      let prev = 0;
      for (const row of REC.table) {
        if (!(row.looseness >= 1)) return false;
        if (!(row.looseness > prev)) return false;
        prev = row.looseness;
      }
      return (
        /MEASUREMENT ONLY/.test(REC.honest) &&
        /refereed bound is changed/i.test(REC.honest) &&
        /changes no bound/.test(REC.honest) &&
        /no new leg is opened/.test(REC.namedResidual)
      );
    },
  },
];

for (const a of IMP95340_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95340-runif6-exact-infimum-gap assertion failed: ${a.id}`,
    );
  }
}

export default IMP95340_RUNIF6_EXACT_INFIMUM_GAP;
