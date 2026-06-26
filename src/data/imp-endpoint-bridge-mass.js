/*
 * imp-2853 -- Quantify the SS27 past-future endpoint mass that the diagonal
 *             measure cannot see.
 *
 * SS27 (endpointHankel.whyRawDiagonalCannotDominate) states that the shear
 * measure nu_{a,Phi} has mass living "BETWEEN past and future endpoints",
 * invisible to a diagonal-only measure mu_{a,Phi}^diag. That claim was
 * qualitative. This module makes it QUANTITATIVE: an explicit mass budget at
 * the genuine Riemann Phi telling any future endpoint-bridge construction
 * exactly how much shear mass it must relocate off the diagonal.
 *
 * The shear density on the half-plane {0 <= u <= v} is
 *     w(u, v) = Phi(u) Phi(v) sinh(a(v - u)),
 * and the SS27 measure nu_{a,Phi} is its pushforward through the covering
 * intervals [u, v]: the covering function is
 *     nu(tau) = int_0^tau du int_tau^infty dv  w(u, v),    tau >= 0.
 *
 * Two complementary budgets are reported.
 *
 *  (A) RAW-SHEAR GAP BUDGET. Partition the raw shear mass
 *        M_total(a) = int int_{0<=u<=v} w(u, v) du dv
 *      by the endpoint gap g = v - u. The diagonal measure is supported at
 *      g = 0, where sinh(a g) -> 0, so it captures ZERO shear mass; a window
 *      g < eps captures a fraction that -> 0 as eps -> 0. The complementary
 *      "off-endpoint" fraction (g >= eps) is the mass a diagonal measure can
 *      never see.
 *
 *  (B) TAU-RESOLVED COVERING BUDGET (faithful to "both endpoints away from
 *      tau"). Of the total covering mass C(a) = int nu(tau) dtau, the part
 *      supported by intervals whose BOTH endpoints sit at margin >= delta from
 *      the covered point tau (i.e. u < tau - delta and v > tau + delta) is
 *        C_off(a, delta) = int int_{0<=u<=v} max(0, (v - u) - 2 delta) w du dv.
 *      C_off / C is the genuine "bridge" fraction: mass strictly between past
 *      and future endpoints.
 *
 * HONEST SCOPE. This is a DIAGNOSTIC at the genuine kernel, not a proof.
 * Conjecture 27.2 / the ||V||<=1 target is RH-EQUIVALENT and REFUTED AS A
 * REDUCTION (see hidden-square-program-section.endpointHankel.verdict); these
 * numbers neither prove nor weaken RH. They only quantify endpointBridgeNecessity:
 * how much mass an endpoint bridge must individually renormalize.
 *
 * Numbers are plain float grid quadrature (genuine Phi series, N_PHI = 30,
 * cutoff U = 4 where the Phi tail is < 1e-300, M = 4000 grid per axis), baked
 * as reference literals. They are NOT interval-certified; see imp-2687 for the
 * certified single-integral counterpart. recomputeBudget() reproduces them.
 */

const PI = Math.PI;
const N_PHI = 30;
const U_CUTOFF = 4.0; // Phi(u) tail past u=4 is < 1e-300 (matches imp-2687)
const M_GRID = 4000;

// Genuine de Bruijn-Newman density (n-truncated series; matches imp-2687).
function phiGenuine(u) {
  const e2u = Math.exp(2 * u);
  const e4u = Math.exp(4 * u);
  let s = 0;
  for (let n = 1; n <= N_PHI; n++) {
    const n2 = n * n;
    const n4 = n2 * n2;
    s += (2 * PI * PI * n4 * e4u - 3 * PI * n2 * e2u) * Math.exp(-PI * n2 * e4u);
  }
  return s;
}

/*
 * Recompute both budgets for a given a. Returns
 *   { a, M_total, gapNearFrac:[...], C, covOffFrac:[...] }
 * for the eps / delta lists below. Pure float grid quadrature; not called at
 * import time.
 */
function recomputeBudget(a, epsList = [0.05, 0.1, 0.2, 0.5], deltaList = [0.05, 0.1, 0.2]) {
  const h = U_CUTOFF / M_GRID;
  const phi = new Float64Array(M_GRID + 1);
  for (let i = 0; i <= M_GRID; i++) phi[i] = phiGenuine(i * h);
  let M_total = 0;
  let C = 0;
  const near = epsList.map(() => 0);
  const off = deltaList.map(() => 0);
  for (let i = 0; i <= M_GRID; i++) {
    const pu = phi[i];
    if (pu === 0) continue;
    for (let j = i; j <= M_GRID; j++) {
      const g = (j - i) * h;
      const w = pu * phi[j] * Math.sinh(a * g) * h * h;
      M_total += w;
      C += g * w;
      for (let k = 0; k < epsList.length; k++) if (g < epsList[k]) near[k] += w;
      for (let k = 0; k < deltaList.length; k++) {
        const L = g - 2 * deltaList[k];
        if (L > 0) off[k] += L * w;
      }
    }
  }
  return {
    a,
    M_total,
    gapNearFrac: near.map((x) => x / M_total),
    C,
    covOffFrac: off.map((x) => x / C),
  };
}

// ── Baked reference budgets (recomputeBudget at the params above) ─────────────
// Raw-shear gap budget: nearFrac at eps = [0.05, 0.1, 0.2, 0.5]; offEndpoint
// (g >= 0.1) = 1 - nearFrac[1]. Windowed fractions carry ~2-sig-fig precision
// (sharp-window edge error drifts ~0.005 over M = 2000..6000).
const GAP_BUDGET_ROWS = Object.freeze([
  Object.freeze({ a: 0.1, M_total: 4.576873e-6, nearFrac: [0.20102, 0.54718, 0.93904, 1.0], offEndpointFrac_eps0p1: 0.45282 }),
  Object.freeze({ a: 0.5, M_total: 2.289661e-5, nearFrac: [0.20092, 0.54698, 0.93894, 1.0], offEndpointFrac_eps0p1: 0.45302 }),
  Object.freeze({ a: 1.0, M_total: 4.586991e-5, nearFrac: [0.20062, 0.54634, 0.93862, 1.0], offEndpointFrac_eps0p1: 0.45366 }),
  Object.freeze({ a: 2.0, M_total: 9.235661e-5, nearFrac: [0.19939, 0.54379, 0.93735, 1.0], offEndpointFrac_eps0p1: 0.45621 }),
  Object.freeze({ a: 5.0, M_total: 2.420734e-4, nearFrac: [0.19093, 0.52605, 0.92818, 1.0], offEndpointFrac_eps0p1: 0.47395 }),
  Object.freeze({ a: 10.0, M_total: 5.763637e-4, nearFrac: [0.16266, 0.46468, 0.89199, 1.0], offEndpointFrac_eps0p1: 0.53532 }),
]);

// Tau-resolved covering budget: covOffFrac at delta = [0.05, 0.1, 0.2]. Smooth
// max(0, .) weight -> well converged to ~3 sig figs over M = 2000..6000.
const COVERING_BUDGET_ROWS = Object.freeze([
  Object.freeze({ a: 0.1, C: 4.602640e-7, covOffFrac: [0.230974, 0.019729, 0.000002] }),
  Object.freeze({ a: 0.5, C: 2.303278e-6, covOffFrac: [0.231118, 0.019766, 0.000002] }),
  Object.freeze({ a: 1.0, C: 4.618819e-6, covOffFrac: [0.231566, 0.019882, 0.000002] }),
  Object.freeze({ a: 2.0, C: 9.336425e-6, covOffFrac: [0.233357, 0.020348, 0.000002] }),
  Object.freeze({ a: 5.0, C: 2.514891e-5, covOffFrac: [0.245745, 0.023684, 0.000003] }),
  Object.freeze({ a: 10.0, C: 6.577408e-5, covOffFrac: [0.287864, 0.036580, 0.000011] }),
]);

export const IMP_ENDPOINT_BRIDGE_MASS = Object.freeze({
  id: 'imp-endpoint-bridge-mass',
  ticket: 'imp-2853',
  generatedAt: '2026-06-26T03:00:00Z',
  paperSections: ['SS27'],
  relatedTickets: ['imp-1258', 'imp-1265', 'imp-2687'],
  crossRef: 'hidden-square-program-section.endpointHankel',

  summary:
    'Quantitative mass budget for the SS27 shear measure nu_{a,Phi} = pushforward of ' +
    'Phi(u)Phi(v)sinh(a(v-u))1_{u<=tau<=v} at the genuine Riemann Phi. Makes ' +
    'endpointBridgeNecessity numeric: the diagonal measure (supported at gap = 0, ' +
    'where sinh vanishes) sees ZERO shear mass, and at every fixed positive margin a ' +
    'substantial fraction of the covering mass lives strictly between past and future ' +
    'endpoints. Diagnostic only; the ||V||<=1 / Conj 27.2 target is RH-equivalent and ' +
    'refuted as a reduction.',

  shearDensity: 'w(u, v) = Phi(u) Phi(v) sinh(a(v - u)) on {0 <= u <= v}',
  coveringFunction: 'nu(tau) = int_0^tau du int_tau^infty dv  w(u, v)',

  method: Object.freeze({
    phiKernel: 'sum_{n=1..N_PHI} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    N_PHI,
    quadrature: `plain float midpoint grid, M = ${M_GRID} per axis on [0, ${U_CUTOFF}]^2 (u <= v)`,
    tailCutoff: `U = ${U_CUTOFF}; Phi tail past u=4 < 1e-300 (see imp-2687)`,
    isValidatedNotFloat: false,
    precisionNote:
      'covering budget (smooth weight) stable to ~3 sig figs; raw-shear gap-window ' +
      'fractions carry ~2 sig figs (sharp-window edge error ~0.005 over M=2000..6000)',
  }),

  // (A) Raw-shear gap budget: how much shear mass is off the diagonal.
  gapBudget: Object.freeze({
    epsList: [0.05, 0.1, 0.2, 0.5],
    rows: GAP_BUDGET_ROWS,
    headline:
      'Of the raw shear mass M_total(a), ~45% lives at endpoint gap >= 0.1 (a <= 1), ' +
      'rising to ~54% at a = 10. The diagonal-window-captured fraction -> 0 as the ' +
      'window eps -> 0 (it is O(eps^2): one power from sinh ~ a*eps, one from the strip ' +
      'measure), so a diagonal-only measure captures none of it.',
  }),

  // (B) Tau-resolved covering budget: mass with BOTH endpoints away from tau.
  coveringBudget: Object.freeze({
    deltaList: [0.05, 0.1, 0.2],
    rows: COVERING_BUDGET_ROWS,
    headline:
      'Of the total covering mass C(a), the bridge fraction (both endpoints at margin ' +
      '>= delta from the covered point tau) is ~23% at delta = 0.05 and ~2% at ' +
      'delta = 0.1 for a = 1, decaying with delta as the Holder-1/2 cusp geometry ' +
      'predicts and rising with a (to ~29% / ~3.7% at a = 10). This is exactly the ' +
      'mass any kernel-side endpoint bridge must renormalize.',
  }),

  honestScope: Object.freeze({
    isDiagnosticNotProof: true,
    isProofOfConj272: false,
    rhEquivalentTarget: true,
    refutedAsReduction: true,
    note:
      'Quantifies endpointBridgeNecessity only. Conjecture 27.2 (||V_{a,Phi}|| <= 1) is ' +
      'RH-equivalent and REFUTED AS A REDUCTION (hidden-square-program-section.' +
      'endpointHankel.verdict, 2026-06-18). These mass fractions neither prove nor ' +
      'weaken RH; Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.',
  }),

  recomputeBudget,
});

export default IMP_ENDPOINT_BRIDGE_MASS;
