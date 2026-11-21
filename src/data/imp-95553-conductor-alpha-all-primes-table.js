/**
 * imp-95553 - Tabulate the conductor-rescaled Montgomery frequency
 *   alpha_C = log u_{k,h} / log(p T/2 pi)
 * across all 25 sieving primes p <= 97 at both RS-window endpoints
 * (N_lo = 690988, N_hi = 54799999), generalizing the p = 97 table that
 * imp-95534 LEVER 2 exhibited for a single prime.
 *
 * BACKGROUND. imp-95519 section 4 finds that under the ZETA scale log T the
 * k = 1 aliases with h close to p acquire a Montgomery frequency
 *     alpha_T = log u_{k,h} / log T > 1,
 * outside the range |alpha| <= 1 where Montgomery/Ozluk evaluate F(alpha) on
 * RH. imp-95534 LEVER 2 shows that the section-3 Gauss-Plancherel import
 * actually attaches these aliases to zeros of L(s, chi mod p), whose canonical
 * pair-correlation frequency uses the ANALYTIC-CONDUCTOR density
 * (1/2 pi) log(p T/2 pi), i.e. alpha_C, not log T. For p = 97 all 15 alpha_T > 1
 * aliases fall into alpha_C in [0.914, 1.000], the floor alias landing at
 * alpha_C = 1 exactly. imp-95534 tabulated this for p = 97 ONLY; imp-95553
 * measures it for every sieving prime.
 *
 * THE GENERAL STRUCTURE (why every prime behaves like p = 97). For the Poisson
 * mode k = 1 the stationary point is u_{1,h} = v/(1 - h/p) = p v/(p - h), which
 * increases monotonically in h and attains its MAXIMUM at the floor alias
 * h = p - 1, where u_{1,p-1} = p v = p T/2 pi = the analytic conductor EXACTLY.
 * Hence for every prime and every k = 1 alias u_{1,h} <= p v, so
 *     alpha_C = log u_{1,h} / log(p v) <= 1
 * with equality only at the floor alias. (For k >= 2, u_{k,h} = v/(k - h/p) < v
 * < T, so alpha_T < 1 already - no k >= 2 alias is ever out of range.) The
 * alpha_T > 1 threshold is h/p > 1 - 1/(2 pi) ~ 0.8408, so the per-prime count
 * of out-of-range aliases grows roughly like (1/(2 pi)) p; summed over the 25
 * primes it is 156 at each window end.
 *
 * MEASURED RESULT. At N_lo and at N_hi, across all 25 primes:
 *   - 156 k = 1 aliases sit at alpha_T > 1 under the zeta scale (the p = 97 row
 *     contributes 15, matching imp-95534);
 *   - ALL 156 move to alpha_C <= 1 under the conductor scale (residual count
 *     strictly above 1 is 0 for every prime);
 *   - the floor alias of every prime lands at alpha_C = 1 to machine precision
 *     (worst |alpha_C(floor) - 1| ~ 2.2e-16), confirming the exact identity
 *     u_{1,p-1} = p v for all p, not just p = 97.
 * RESIDUAL MAJORANT-MASS SHARE STILL > 1 UNDER alpha_C: 0 for every prime, hence
 * 0 in aggregate - the conductor rescaling pulls the ENTIRE out-of-range mass in,
 * independent of how the majorant weights the individual aliases, because the
 * per-alias bound alpha_C <= 1 is uniform over h.
 *
 * WHAT THIS DOES NOT DO. As imp-95534 already records, pulling the mass in-range
 * is a RELABELING, not a rescue: the binding walls (mean-square-vs-pointwise,
 * GRH-height-boundedness, and the alpha_C = 1 boundary degeneracy at the floor
 * alias) survive the rescaling untouched. This module only extends the alpha_C
 * table from one prime to all 25; it changes no bound. NO QED; no refereed bound is changed
 * ; RH open.
 *
 * Import-light: no zeros bundle, no sibling imports. All literals re-derived
 * from the imp-95519 stationary-point equation and the imp-95534 alpha formulas.
 */

const TWO_PI = 2 * Math.PI;
const T0 = 24727519 / 200000000; // 0.123637595
const N_LO = 690988;
const N_HI = 54799999;

// 25 sieving primes p <= 97
const PRIMES = Object.freeze([
  2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97,
]);

const xOfN = (N) => 4 * Math.PI * N * N - T0 / 16;
const heightT = (N) => xOfN(N) / 2;
const stationaryV = (N) => heightT(N) / TWO_PI; // v = x/(4 pi) ~ N^2

// stationary-point location of the (k, h) packet (imp-95519 eq 15)
const uOfKH = (k, h, p, N) => stationaryV(N) / (k - h / p);
// zeta-scale Montgomery frequency (imp-95519 section 4): normalized by log T
const alphaT = (k, h, p, N) => Math.log(uOfKH(k, h, p, N)) / Math.log(heightT(N));
// analytic-conductor scale for L(s, chi mod p): p v = p T/2 pi
const conductorScale = (p, N) => p * stationaryV(N);
const alphaC = (k, h, p, N) => Math.log(uOfKH(k, h, p, N)) / Math.log(conductorScale(p, N));

// per-prime measurement at one window endpoint (k = 1 Poisson mode, all h)
function primeRow(p, N) {
  const cond = conductorScale(p, N);
  let overT = 0; // aliases with alpha_T > 1 (zeta scale, out of Montgomery range)
  let overC = 0; // aliases still with alpha_C > 1 (conductor scale)
  let maxC = 0;
  let minMovedC = Infinity; // smallest alpha_C among the alpha_T > 1 aliases
  for (let h = 1; h <= p - 1; h++) {
    const aT = alphaT(1, h, p, N);
    const aC = alphaC(1, h, p, N);
    if (aT > 1) {
      overT += 1;
      if (aC < minMovedC) minMovedC = aC;
    }
    if (aC > 1 + 1e-9) overC += 1;
    if (aC > maxC) maxC = aC;
  }
  const uFloor = uOfKH(1, p - 1, p, N);
  const floorAlphaC = Math.log(uFloor) / Math.log(cond);
  const floorMatchRel = Math.abs(uFloor - cond) / cond; // u_{1,p-1} = p v exactly?
  return {
    p,
    overT,
    overC,
    maxAlphaC: maxC,
    floorAlphaC,
    floorMatchRel,
    minMovedAlphaC: Number.isFinite(minMovedC) ? minMovedC : null,
  };
}

function buildTable(N) {
  const rows = PRIMES.map((p) => primeRow(p, N));
  const totalOverT = rows.reduce((s, r) => s + r.overT, 0);
  const totalOverC = rows.reduce((s, r) => s + r.overC, 0);
  const worstFloorErr = rows.reduce((m, r) => Math.max(m, Math.abs(r.floorAlphaC - 1)), 0);
  const worstMatchRel = rows.reduce((m, r) => Math.max(m, r.floorMatchRel), 0);
  return { rows, totalOverT, totalOverC, worstFloorErr, worstMatchRel };
}

const TABLE_LO = buildTable(N_LO);
const TABLE_HI = buildTable(N_HI);

export const IMP95553_CONDUCTOR_ALPHA_ALL_PRIMES = Object.freeze({
  ticket: 'imp-95553',
  date: '2026-09-22',
  source:
    'imp-95534 LEVER 2 (conductor rescaling alpha_C for p = 97); imp-95519 section 4 (zeta-scale alpha_T > 1 gating) and section 3 (Gauss-Plancherel L(s, chi mod p) import)',
  question:
    'Does the imp-95534 p = 97 result (all alpha_T > 1 aliases fall to alpha_C in [0.914, 1.000] under the analytic-conductor scale, floor alias exactly 1) hold across all 25 sieving primes p <= 97 at both RS-window endpoints, and what residual majorant-mass share stays alpha_C > 1',

  windowEndpoints: { N_LO, N_HI },
  primeCount: PRIMES.length,

  generalMechanism:
    'For k = 1, u_{1,h} = p v/(p - h) is monotone increasing in h with maximum u_{1,p-1} = p v = p T/2 pi = the analytic conductor exactly, so alpha_C = log u/log(p v) <= 1 for every k = 1 alias of every prime (equality at the floor alias). For k >= 2, u < v < T so alpha_T < 1 already. Hence no width or prime choice leaves any alias with alpha_C > 1.',

  tableLo: TABLE_LO,
  tableHi: TABLE_HI,

  aggregate: {
    aliasesOverAlphaT_lo: TABLE_LO.totalOverT, // 156
    aliasesOverAlphaT_hi: TABLE_HI.totalOverT, // 156
    aliasesStillOverAlphaC_lo: TABLE_LO.totalOverC, // 0
    aliasesStillOverAlphaC_hi: TABLE_HI.totalOverC, // 0
    residualMassShareOverAlphaC:
      'ZERO for every prime and in aggregate: the per-alias bound alpha_C <= 1 is uniform over h, so no majorant weighting can leave any mass above alpha_C = 1.',
    worstFloorDeviationFromOne: Math.max(TABLE_LO.worstFloorErr, TABLE_HI.worstFloorErr),
  },

  netVerdict:
    'The imp-95534 conductor rescaling generalizes cleanly: across all 25 sieving primes p <= 97, at both window endpoints, 156 k = 1 aliases sit at alpha_T > 1 under the zeta scale and ALL 156 move to alpha_C <= 1 under the analytic-conductor scale, the floor alias of every prime landing at alpha_C = 1 to machine precision (u_{1,p-1} = p v exactly). The residual majorant-mass share still above alpha_C = 1 is 0 for every prime. As imp-95534 records this is a RELABELING, not a rescue - the mean-square-vs-pointwise gap, the GRH height deficit, and the alpha_C = 1 boundary degeneracy survive untouched. No bound changes; NO QED; no refereed bound is changed; RH open.',

  promotesBound: false,
  isRigorous: true,
  rigorScope:
    'The monotonicity of u_{1,h} in h, the exact identity u_{1,p-1} = p v, and the resulting uniform bound alpha_C <= 1 are elementary and exact; the per-prime counts are finite computations at two fixed window endpoints. This is a numerical generalization of the imp-95534 p = 97 table, not a new theorem that a bound exists.',
});

export const IMP95553_CONDUCTOR_ALPHA_ALL_PRIMES_ASSERTIONS = Object.freeze([
  {
    id: 'imp95553-twenty-five-primes',
    description: 'exactly 25 sieving primes p <= 97 are tabulated',
    holds: () => PRIMES.length === 25 && PRIMES[0] === 2 && PRIMES[PRIMES.length - 1] === 97,
  },
  {
    id: 'imp95553-p97-row-matches-imp95534',
    description: 'the p = 97 row reproduces imp-95534: 15 alpha_T > 1 aliases, 0 still > 1 under alpha_C',
    holds: () => {
      const r = TABLE_LO.rows.find((x) => x.p === 97);
      return r && r.overT === 15 && r.overC === 0;
    },
  },
  {
    id: 'imp95553-all-aliases-pulled-in-range',
    description: 'every alpha_T > 1 alias of every prime moves to alpha_C <= 1 at both window ends (0 residual)',
    holds: () =>
      TABLE_LO.totalOverT === 156 &&
      TABLE_HI.totalOverT === 156 &&
      TABLE_LO.totalOverC === 0 &&
      TABLE_HI.totalOverC === 0,
  },
  {
    id: 'imp95553-floor-alias-exactly-one',
    description: 'the floor alias of every prime lands at alpha_C = 1 to machine precision (u_{1,p-1} = p v)',
    holds: () => TABLE_LO.worstFloorErr < 1e-12 && TABLE_HI.worstFloorErr < 1e-12 && TABLE_LO.worstMatchRel < 1e-12,
  },
  {
    id: 'imp95553-max-alphaC-never-exceeds-one',
    description: 'no prime has any alias with alpha_C above 1 (max alpha_C per row <= 1 within float tol)',
    holds: () =>
      TABLE_LO.rows.every((r) => r.maxAlphaC <= 1 + 1e-9) &&
      TABLE_HI.rows.every((r) => r.maxAlphaC <= 1 + 1e-9),
  },
  {
    id: 'imp95553-honesty-gate-no-qed',
    description: 'assessment only: promotes no bound, NO QED, no refereed bound is changed',
    holds: () =>
      IMP95553_CONDUCTOR_ALPHA_ALL_PRIMES.promotesBound === false &&
      /NO QED/.test(IMP95553_CONDUCTOR_ALPHA_ALL_PRIMES.netVerdict) &&
      /refereed bound is changed/i.test(IMP95553_CONDUCTOR_ALPHA_ALL_PRIMES.netVerdict),
  },
]);

for (const a of IMP95553_CONDUCTOR_ALPHA_ALL_PRIMES_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95553-conductor-alpha-all-primes-table assertion failed: ${a.id}`);
  }
}

export default IMP95553_CONDUCTOR_ALPHA_ALL_PRIMES;
