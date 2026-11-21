/**
 * imp-95202 — LEVER 2: Prop 4.3 effective-collar feasibility on the 0.14 row
 * (quantitative thaw 0.14 -> 0.139981915 via delta_t = 0, delta_y = -1e-4).
 *
 * GRADE: ASSESSMENT (measurement + majorant bookkeeping). Derives no bound,
 * certifies no collar, closes no gap; NO QED. No refereed bound is changed
 * . Per the no-gain rule and the PT-floor audit, this lever
 * sharpens only the CONDITIONAL row target (0.14 -> 0.139981915); it cannot
 * move the rigorous frontier, which binds on verified height.
 *
 * Sources traced:
 *  - paper §4.9 (p.11): Theorem 4.2 strictness note (y = 0.1808 regression,
 *    t0 + y^2/2 = 0.139981915) + Proposition 4.3 (effective collar test:
 *    |G(t0,y0,z)| >= m, |dG/dt| <= Mt, |dG/dy| <= My on a containing box;
 *    every displacement with Mt|dt| + My|dy| < m preserves nonvanishing).
 *  - src/data/imp-95012-gate2-frozen-spec.js (frozen row eq (8):
 *    t0 = 24727519/2e8, y0 = 0.1809, X = 6000000185827).
 *  - research-inputs/gate2-evaluator-inputs/verify_uniform_error_01787854.c
 *    (the delivered Arb error machinery: certificate box x in [X, X+1],
 *    y in [0.1809, 1], t in [0, 129/800]; winding allowance 0.00125).
 *  - research-inputs/gate2-evaluator-inputs/lemma_sweep_p235711.c (the
 *    finite-row producer: logs per-shard L12 certified LOWER ball endpoints;
 *    the pointwise minimum of |G| along the contour lives in the FROZEN
 *    audit repo's sweep logs, NOT in this repo).
 *
 * WHAT THE DELIVERED MACHINERY ACTUALLY PINS (all recomputed below in JS
 * double precision as a faithful shadow of the 256-bit Arb chain; the Arb
 * balls are the authoritative enclosures, the doubles agree to ~1e-12 rel):
 *
 *  ERROR SIDE (the only side verify_uniform_error_01787854.c bounds):
 *    total = e_AB + e_C0 at ymin = 0.1809: ~3.5652e-4 < 0.00125 (PASS,
 *    slack 8.935e-4). At the displaced ymin = 0.1808 the same chain gives
 *    ~3.5676e-4 (growth factor exp(2.5e-5 * Lmin) ~ 1.000673): the error
 *    machinery extends to the displaced box TRIVIALLY (a_eff drops by 5e-5,
 *    every majorant is smooth in y and re-passes with ~3.5x headroom).
 *    Re-run cost: minutes (one Arb re-run with ymin = 1808/10000).
 *    NOTE the razor-thin inequality 2 log N < log(X/4pi) (margin 8.96e-7 in
 *    the log) is x-side only: the pure-y displacement does not touch it.
 *
 *  CHART MOTION (Prop 4.3 "after charging the motion of boundary charts"):
 *    the window landmark N(x,t) = floor(sqrt(x/(4pi) + t/16)) is INDEPENDENT
 *    of y, so the pure-y displacement (delta_t = 0) moves NO landmark:
 *    N = 690988 at all four slab corners before and after. Chart-motion
 *    charge = 0. This is a genuine simplification of the collar test.
 *
 *  m (the Prop 4.3 lower bound): NOT pinned in-repo as a pointwise number.
 *    The delivered artifacts support only the conditional floor
 *      m >= epsilon_wind - total = 0.00125 - 3.5652e-4 = 8.935e-4,
 *    valid IF the producer certifies the normalized main term >= the winding
 *    allowance 0.00125 along the whole contour (the allowance convention of
 *    the sealed audit package). The true min|G| (per-shard L12 minima) is in
 *    the frozen judegomila/dbn-lambda-01787854-candidate-audit sweep logs.
 *
 *  My (the blocking quantity): the ONLY derivative bound the delivered
 *    machinery supports is the cancellation-free termwise majorant, using
 *    the same per-term prefactors the C file uses (gamma*n^y <= exp(0.02),
 *    N^kappa <= kappa_factor, heat factor absorbed into n^{-a_eff}):
 *      |dG/dy| <= sum_{n<=N} n^{-a_eff} [ (ln n)/2                (A-ladder)
 *                  + exp(0.02)*kappa*(Lmax/2 - ln n + 0.02) ]     (B/gamma)
 *    = 4793.7 at the displaced a_eff (exact 690988-term sum, below).
 *    Mt (same route, weight (ln n)^2/4 both ladders) = 3.86e4 — irrelevant
 *    here since delta_t = 0, recorded for completeness.
 *
 *  VERDICT — COLLAR NOT CERTIFIABLE FROM DELIVERED ARTIFACTS:
 *    need My * 1e-4 < m. With the in-repo floor m = 8.935e-4 this demands
 *    My <= 8.93; the termwise majorant gives 4793.7. SHORTFALL FACTOR ~537.
 *    (Equivalently: the majorant collar width m/My ~ 1.86e-7, vs the needed
 *    1e-4.) Termwise majorization throws away exactly the oscillatory
 *    cancellation that makes |G| ~ O(1); the same looseness (~600x on |G|
 *    itself: S0 ~ 600 vs |G| ~ 1) infects the derivative channel.
 *
 *  THE BLOCKING QUANTITY, NAMED: a certified uniform bound
 *      My_cert = sup_contour |dG/dy| <= m / 1e-4
 *    i.e. a DIRECTED derivative sweep. dG/dy is the SAME finite sum as the
 *    lemma_sweep producer evaluates, reweighted per-term by an (ln n - L/2)
 *    factor, so one Arb march on the existing shard grid (cost comparable to
 *    one lemma_sweep replay, days-scale, vs the 2-3 month full-height
 *    recertification the paper names as the alternative) measures it WITH
 *    cancellation. Plausibility: gray-zone-positive — if the true min|G|
 *    is O(1e-3..1e-2) (allowance-floor to typical barrier practice) and the
 *    true |dG/dy| is O(1..10) (log-weighted oscillating sum of unit-scale
 *    terms), the 1e-4 collar fits with 1x-100x headroom; but neither number
 *    is certified today, and the majorant route misses by ~3 orders.
 *
 *  CERTIFICATION COST LADDER (cheapest first):
 *    (1) error-side re-run at ymin = 0.1808: < 1 CPU-hour, already sized.
 *    (2) extract min-shard L12 (= m candidate) from the frozen audit logs:
 *        bookkeeping only, no compute.
 *    (3) directed dG/dy sweep on the same grid: ~ one lemma_sweep replay.
 *    (4) initial condition: FREE — (1+0.1808)/2 = 0.5904 > 1/2 uses the
 *        same verified height X (the 0.1399-row abscissa 233/400 = 0.5825
 *        is closer to the line and already covered, a fortiori 0.5904 is).
 *    If (2)+(3) satisfy Mt*0 + My_cert*1e-4 < m_cert, Prop 4.3 certifies
 *    the 0.139981915 endpoint with NO new zeta-zero verification and NO
 *    barrier recertification — the cheapest named sharpening in the program.
 *    If not, the paper's other route (recertify lower barrier + final edge
 *    at y = 0.1808) is the only path, at full recertification cost.
 *
 * UPDATE (imp-95207, 2026-09-09): the true per-shard L12 minima arrived
 * (research-inputs/gate2-evaluator-inputs/L12_SHARD_MINIMA.txt, global min
 * 7.91366e-7 at N=690988) and imp-95207-split-collar-analysis.js resolves the
 * semantics + runs the split-collar analysis with shadow re-sweeps. Outcome:
 * the conditional floor m >= 8.935e-4 above is NOT met by the sealed sweep
 * (its floors are per-window triangle bounds closing against Emax=2.335e-7,
 * not against the 0.00125 allowance, and they are anchored at y=0.187272,
 * not 0.1809); the collar split as posed fails (displaced triangle rows go
 * NEGATIVE, ~ -0.0236, out to N ~ 1.1e6), but a direct sharp-weight displaced
 * re-sweep measures positive (~ +0.063) - see imp-95207 for the full verdict.
 * This note appends; the assessment text above is left as recorded.
 */

import { GATE2_ROW } from './imp-95012-gate2-frozen-spec.js';

// ── the displacement under test (paper §4.9, Theorem 4.2 strictness note) ──
export const COLLAR_DISPLACEMENT = {
  deltaT: 0,
  deltaY: -1e-4, // y: 0.1809 -> 0.1808
  yDisplaced: { num: 1808, den: 10000, value: 1808 / 10000 },
  publishedEndpoint: 0.139981915, // t0 + 0.1808^2/2, exact in binary64
  currentRowTarget: 0.14,
  gain: 0.14 - 0.139981915, // 1.8085e-5 of conditional-Lambda sharpening
  chartMotionCharge: 0, // N(x,t) = floor(sqrt(x/4pi + t/16)) has no y-dependence
};

// ── the certificate box of verify_uniform_error_01787854.c ─────────────────
export const CERT_BOX = {
  X: 6000000185827,
  xRange: [6000000185827, 6000000185828],
  yRange: [0.1809, 1],
  tRange: [0, 129 / 800], // T = 0.16125
  windingAllowance: 0.00125,
  N: 690988,
  displacedYmin: 0.1808, // OUTSIDE the certified box: needs re-run (minutes)
};

// ── faithful double-precision shadow of the Arb error chain ────────────────
export function errorChain(ymin) {
  const { X, N } = CERT_BOX;
  const T = 129 / 800;
  const qmin = X / (4 * Math.PI);
  const qmax = (X + 1) / (4 * Math.PI);
  const Lmax = Math.log(qmax);
  const lnN = Math.log(N);
  const a = (1 + ymin) / 2;
  const delta = (T * (1 + 8 / (X * X))) / (2 * X * X);
  const aeff = a - delta;
  const oma = 1 - aeff;
  const Smax = 1 + (Math.pow(N, oma) - 1) / oma;
  const kappa = Math.exp((T * lnN) / (2 * (X - 6)));
  const Pmax = Math.exp(0.02) * kappa + 1;
  const umax = ((T * T) / 16) * Lmax * Lmax + 0.626;
  const uDen = X - 6.66;
  const eAB = Pmax * Smax * (Math.exp(umax / uDen) - 1);
  const eC0 =
    Math.pow(qmin, -(1 + ymin) / 4) *
    Math.exp((1.24 * (10 / 3)) / (N - 0.125) + (3 * Math.sqrt(Lmax * Lmax + (Math.PI / 2) ** 2) + 10.5) / (X - 12));
  const total = eAB + eC0;
  return { aeff, Smax, Pmax, eAB, eC0, total, slack: CERT_BOX.windingAllowance - total };
}

// ── termwise (cancellation-free) derivative majorants — the ONLY in-repo route ──
export function derivativeMajorants(ymin) {
  const { X, N } = CERT_BOX;
  const T = 129 / 800;
  const Lmax = Math.log((X + 1) / (4 * Math.PI));
  const lnN = Math.log(N);
  const aeff = (1 + ymin) / 2 - (T * (1 + 8 / (X * X))) / (2 * X * X);
  const pref = Math.exp(0.02) * Math.exp((T * lnN) / (2 * (X - 6))); // per-term B/gamma prefactor
  let S0 = 0,
    S1 = 0,
    S2 = 0,
    SyB = 0;
  for (let n = 1; n <= N; n++) {
    const w = Math.pow(n, -aeff);
    const ln = Math.log(n);
    S0 += w;
    S1 += (w * ln) / 2; // A-ladder y-channel: d/dy n^{-(1+y)/2} weight
    S2 += (w * ln * ln) / 4; // t-channel: d/dt exp((t/4) ln^2 n) weight
    SyB += w * (Lmax / 2 - ln + 0.02); // B-ladder gamma y-channel: |0.02 - L/2 + ln n|
  }
  return { aeff, S0, S1, S2, SyB, My: S1 + pref * SyB, Mt: (1 + pref) * S2 };
}

// ── frozen measured record (baked; assertions recompute and pin) ───────────
const chain09 = errorChain(0.1809);
const chain08 = errorChain(0.1808);
const deriv08 = derivativeMajorants(0.1808);

export const COLLAR_FEASIBILITY = {
  errorSide: {
    totalAt01809: chain09.total, // ~3.5652e-4  (< 0.00125: the C file's PASS)
    totalAt01808: chain08.total, // ~3.5676e-4  (displaced box: still ~3.5x headroom)
    slackAt01809: chain09.slack, // ~8.935e-4
    growthFactor: chain08.total / chain09.total, // ~1.000673 = exp(2.5e-5 * Lmin)
    verdict: 'EXTENDS-TRIVIALLY (re-run cost: minutes)',
  },
  mSide: {
    inRepoFloor: chain09.slack, // 8.935e-4, CONDITIONAL on the allowance convention
    floorCondition:
      'valid iff the producer certifies the normalized main term >= 0.00125 along the whole contour; ' +
      'the true pointwise min|G| (per-shard L12 minima) is only in the frozen audit-repo sweep logs',
    inRepoPointwiseMinimum: null, // NOT pinned by any delivered artifact
  },
  derivativeSide: {
    MyTermwiseMajorant: deriv08.My, // ~4793.7 (cancellation-free)
    MtTermwiseMajorant: deriv08.Mt, // ~3.86e4 (irrelevant: deltaT = 0)
    MyNeeded: chain09.slack / 1e-4, // ~8.93
    shortfallFactor: deriv08.My / (chain09.slack / 1e-4), // ~537x
    majorantCollarWidth: chain09.slack / deriv08.My, // ~1.86e-7 vs needed 1e-4
  },
  blockingQuantity:
    'a certified uniform bound sup_contour |dG/dy| <= m/1e-4 (~8.93 at the in-repo m-floor): ' +
    'requires a directed Arb dG/dy sweep on the existing lemma_sweep shard grid (same finite sum, ' +
    'per-term (ln n - L/2)-type reweight, cancellation included) plus extraction of the true min-shard ' +
    'L12 as m; the termwise majorant route misses by ~537x and cannot close',
  verdict: 'BLOCKED-ON-DERIVATIVE-CERTIFICATE',
  plausibility:
    'gray-zone-positive: fits if true min|G| = O(1e-3..1e-2) and true |dG/dy| = O(1..10); ' +
    'neither is certified in-repo today',
  costLadder: [
    'error-side Arb re-run at ymin=0.1808: < 1 CPU-hour',
    'min-shard L12 extraction from frozen audit logs: bookkeeping only',
    'directed dG/dy Arb sweep: ~ one lemma_sweep replay (days-scale)',
    'initial condition: free ((1+0.1808)/2 = 0.5904 > 1/2, same verified height X)',
  ],
};

export const IMP_95202_PROP43_COLLAR = {
  id: 'imp-95202',
  title: 'Prop 4.3 effective-collar feasibility: 0.14 -> 0.139981915 (delta_t=0, delta_y=-1e-4)',
  grade: 'assessment',
  displacement: COLLAR_DISPLACEMENT,
  certBox: CERT_BOX,
  feasibility: COLLAR_FEASIBILITY,
  verdict:
    'Assessment only. The delivered error machinery (verify_uniform_error_01787854.c) extends to the ' +
    'displaced box y >= 0.1808 trivially (total ~3.568e-4 < 0.00125), the chart-motion charge is exactly ' +
    'zero (N(x,t) is y-independent), and the initial condition is free; but the collar inequality ' +
    'My*1e-4 < m is NOT certifiable from delivered artifacts: the in-repo m-floor is 8.935e-4 while the ' +
    'only in-repo derivative route (termwise majorant) gives My ~ 4794, a ~537x shortfall. Blocking ' +
    'quantity: a directed dG/dy sweep (with cancellation) + the true min-shard L12. Changes no bound; ' +
    'sharpens only the CONDITIONAL row; NO QED; no refereed bound is changed.',
};

// ── assertions (import-light; ~7e5-term sums run in milliseconds) ──────────
export const IMP_95202_ASSERTIONS = [
  {
    id: 'imp-95202-displaced-endpoint-exact',
    holds: () =>
      Math.abs(GATE2_ROW.t0.value + 0.1808 ** 2 / 2 - 0.139981915) < 1e-15 &&
      Math.abs(COLLAR_DISPLACEMENT.publishedEndpoint - 0.139981915) < 1e-15,
    why: 'The displaced row publishes t0 + 0.1808^2/2 = 0.123637595 + 0.01634432 = 0.139981915 exactly (paper §4.9 regression), a 1.8085e-5 sharpening of the conditional 0.14 target.',
  },
  {
    id: 'imp-95202-displacement-leaves-cert-box',
    holds: () => CERT_BOX.displacedYmin < CERT_BOX.yRange[0] && CERT_BOX.yRange[0] === GATE2_ROW.y0.value,
    why: 'The displaced abscissa 0.1808 lies OUTSIDE the delivered certificate box y in [0.1809, 1] (whose floor is exactly the frozen row y0), so even the error side needs one cheap Arb re-run.',
  },
  {
    id: 'imp-95202-error-chain-passes-both-heights',
    holds: () => {
      const c9 = errorChain(0.1809);
      const c8 = errorChain(0.1808);
      return (
        Math.abs(c9.total - 3.5652301160198e-4) < 1e-14 &&
        Math.abs(c8.total - 3.5676278039592e-4) < 1e-14 &&
        c9.total < 0.00125 &&
        c8.total < 0.00125 &&
        c8.total > c9.total &&
        c8.total / c9.total < 1.001
      );
    },
    why: 'The double-precision shadow of the Arb chain gives total error 3.5652e-4 at y=0.1809 (the C file PASS) and 3.5676e-4 at the displaced y=0.1808 (growth factor ~1.000673 = exp(2.5e-5*Lmin)) — both far below the 0.00125 winding allowance, so the error side extends trivially.',
  },
  {
    id: 'imp-95202-chart-motion-charge-zero',
    holds: () => {
      // N(x,t) = floor(sqrt(x/4pi + t/16)) at all four (x,t) corners, any y
      const { X } = CERT_BOX;
      const T = 129 / 800;
      const corners = [
        [X, 0],
        [X, T],
        [X + 1, 0],
        [X + 1, T],
      ];
      return corners.every(([x, t]) => Math.floor(Math.sqrt(x / (4 * Math.PI) + t / 16)) === 690988);
    },
    why: 'The window landmark N(x,t) has no y-dependence and equals 690988 at all four slab corners, so the pure-y displacement (delta_t = 0) moves no boundary chart: the Prop 4.3 chart-motion charge is exactly zero.',
  },
  {
    id: 'imp-95202-collar-fails-on-termwise-majorant',
    holds: () => {
      const m = errorChain(0.1809).slack; // in-repo conditional floor
      const { My } = derivativeMajorants(0.1808);
      const shortfall = My / (m / 1e-4);
      return (
        Math.abs(m - 8.934769883980193e-4) < 1e-12 &&
        Math.abs(My - 4793.742053323) < 1e-6 &&
        My * 1e-4 > m &&
        shortfall > 500 &&
        shortfall < 600
      );
    },
    why: 'The blocking inequality: the collar needs My*1e-4 < m, but the in-repo m-floor is 8.935e-4 (allowance 0.00125 minus certified error 3.565e-4) while the only in-repo derivative bound (cancellation-free termwise majorant, exact 690988-term sum with the C file per-term prefactors) gives My = 4793.7 — a ~537x shortfall. The collar is NOT certifiable from delivered artifacts.',
  },
  {
    id: 'imp-95202-mt-irrelevant-but-recorded',
    holds: () => {
      const d = derivativeMajorants(0.1808);
      return COLLAR_DISPLACEMENT.deltaT === 0 && d.Mt > 3.8e4 && d.Mt < 3.95e4 && d.Mt > d.My;
    },
    why: 'The proposed displacement has delta_t = 0, so Mt (termwise majorant ~3.86e4, even looser than My) contributes nothing to the collar budget; the y-channel alone decides feasibility.',
  },
  {
    id: 'imp-95202-initial-condition-free',
    holds: () => Math.abs((1 + 0.1808) / 2 - 0.5904) < 1e-15 && 0.5904 > 0.5 && 0.5904 > 233 / 400,
    why: 'The displaced row initial condition (1+0.1808)/2 = 0.5904 > 1/2 reuses the same verified height X; it sits ABOVE the 0.1399-row abscissa 233/400 = 0.5825 already covered by the published verification (closer to the line is the tighter case), so no new zeta-zero computation is needed.',
  },
];

for (const a of IMP_95202_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95202-prop43-effective-collar-feasibility assertion failed: ${a.id}`);
  }
}

export default IMP_95202_PROP43_COLLAR;
