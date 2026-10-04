/**
 * @fileoverview s145-zero-conditioned-floor-2026-09-30 — Executed pick 2: does conditioning the decreasing-barrier source floor
 * on the zero equation H_t(x + i·y_Q) = 0 at the barrier height (an S-procedure multiplier) beat the uniform (Kronecker) floor
 * by a certifiable margin? Outcome (c): measured intermediate result with a precise gap. Two adversarial referee passes, both
 * minor, not refuted; the verdict (do not start an Arb certificate for this lever) is strengthened by the referees.
 *
 * Referee corrections applied:
 *  - Kernel-domain clamp in the path ODE (v = q/h² above r_max² in up to 443 steps, up to 2.06×) lowered Λ; with validity
 *    enforced U_path = 0.14406–0.14416, C_path = 0.14322–0.14327, ΔΛ from conditioning ≈ −0.0008 to −0.0009 (not −0.0007).
 *  - The re-optimised barrier path runs BELOW zeros the same torus model contains (t = 0.1125: path y 0.2971 vs zero at 0.3150;
 *    t = 0.125: 0.2130 vs 0.2170; t = 0.1375: 0.1103 vs 0.1235). Its sub-0.1435 values are an idealised-ODE artifact, not a gate
 *    pass. Model-consistent schedules (fixed schedule, all variants) give 0.1444–0.1462: the ideal Λ ≤ 0.1435 gate has NO
 *    model-consistent pass.
 *  - y_torus at t = 0.15: no zero found at any y ≥ 0.0345 (min|F|/l1 ≥ 2.1e-2); the lower bracket 0.0300 was assumed, not checked.
 *    min t + y²/2 ≈ 0.1451–0.1457 comes from the t = 0.1375 bracket (reproduces the repo torus obstruction 0.1455).
 *  - Step 3 is a phase-decoupled relaxation R_P (P-rough cofactors get free phases) evaluated by ascent, not a moment-cone/SDP
 *    relaxation. R_P is a genuine relaxation only for P < √N0 ≈ 831: 1009·1013 > N0, so R_1000 is the exact torus (55,706 primes
 *    in (1000, N0] plus the trivial cofactor 1 = 55,707 free slots) and its ~1e-5 loss holds by construction. Losses are
 *    “ascent vs ascent” measured gaps against C = 0.4516, not rigorous lower bounds.
 *  - The proposed next step’s “≈ 0.1445” is optimistic: shifting U by the P = 7 relaxation excess (0.0496) on the validity-enforced
 *    path gives 0.1450–0.1451, and that path is itself below the torus zeros; any follow-up must constrain y(t) ≥ y_torus_found(t).
 *  - s145-2-ode.py has swapped cap labels (the “conservative” cap 0.14382 uses the zero-found end and is invalid); the reported
 *    0.144408 uses the correct not-found end.
 *  - Fixed-schedule and exact replays use one cost per 0.0125 block (first record, highest h) interpolated in t: a model
 *    approximation. The ±0.002 model uncertainty is asserted, not derived.
 *
 * PROVED: nothing. CERTIFIED: nothing; one exact check — the rational replay of Raymond’s 76,491 COMPARISON_PRIMARY records
 *  reproduces 0.14939507382768755. All other replays feed float model floors (model numbers, not bounds).
 * MEASURED (float, leading-order Kronecker torus model, reflected-branch phase free, ascent/descent = lower bounds on suprema):
 *  per-cell costs and gains, torus brackets, relaxation-ladder gaps, ODE outputs (tables below).
 * HEURISTIC: the torus model itself; |F| = 0 instead of |F| ≤ ε (the true constraint enlarges the feasible set and shrinks gain).
 *
 * Verdict: outcome (c). PT Lambda <= 0.2 stands. RH open. NO QED.
 * Files: tmp/s145-2-{step0,condcell,ytorus,ode,reopt-path,pathcells,pathode,exactreplay,capmargin,cone}.py (+ .json/.out/.log);
 * referee scripts tmp/s145-2-ref0-pathcheck{,2,3,4}.py, tmp/s145-2-ref0-shift.py, tmp/s145-2-ref1-ucheck.py.
 * Import-free. ASSERTIONS recompute the per-cell gains and counts, the path-vs-torus-zero violations, the torus t + y²/2 minimum,
 * the R_P exactness threshold (sieve to N0), monotonicity of the ladder, and the model-consistent gate failure.
 */

const N0 = 690988;

export const S145_ZERO_CONDITIONED_FLOOR = Object.freeze({
  id: 's145-zero-conditioned-floor-2026-09-30',
  date: '2026-09-30',
  title: 'Zero-conditioned (S-procedure) source floor in the decreasing-barrier class: small gain, no model-consistent gate pass',
  status:
    'MEASURED (float Kronecker torus model, not certified) + HEURISTIC; outcome (c) intermediate result with a precise gap. '
    + 'Two internal referee passes (minor; corrections applied). No bound moves. NO QED.',
  headline:
    'Conditioning the joint source floor on H_t = 0 at the barrier height lowers the worst-case torus cost (t = 0.075: 0.5335 → 0.4516) '
    + 'but the gain is ≥ 0.09 in only 2 of 12 cells on Raymond’s schedule (1 of 12 on the re-optimised path) and moves Λ by ≈ −0.0008 to −0.0009. '
    + 'Every model-consistent schedule stays at 0.1444–0.1462; the ideal 0.1435 gate has no model-consistent pass.',

  fixedSchedule: Object.freeze({
    t: Object.freeze([0, 0.0125, 0.025, 0.0375, 0.05, 0.0625, 0.075, 0.0875, 0.1, 0.1125, 0.125, 0.1375]),
    U: Object.freeze([0.3770, 0.3971, 0.4188, 0.4457, 0.4569, 0.4785, 0.5335, 0.5613, 0.5487, 0.4942, 0.5191, 0.4961]),
    C: Object.freeze([0.3712, 0.3841, 0.3967, 0.4100, 0.4116, 0.4195, 0.4516, 0.4564, 0.3793]), // t ≥ 0.1125: barrier above y_torus, F cannot vanish
  }),
  pathGains: Object.freeze([0.006, 0.013, 0.022, 0.035, 0.048, 0.051, 0.065, 0.071, 0.062, 0.058, 0.058, 0.110]),
  pathBelowTorus: Object.freeze([
    { t: 0.1125, pathY: 0.2971, zeroFoundY: 0.3150 },
    { t: 0.125, pathY: 0.2130, zeroFoundY: 0.2170 },
    { t: 0.1375, pathY: 0.1103, zeroFoundY: 0.1235 },
  ]),
  torusBrackets: Object.freeze([ // [zero found at, not found at]
    { t: 0.0875, lo: 0.4887, hi: 0.4931 },
    { t: 0.1, lo: 0.4041, hi: 0.4085 },
    { t: 0.1125, lo: 0.3150, hi: 0.3195 },
    { t: 0.125, lo: 0.2170, hi: 0.2215 },
    { t: 0.1375, lo: 0.1235, hi: 0.1280 },
    { t: 0.15, lo: null, hi: 0.0345, note: 'no zero found for y ≥ 0.0345; lower end unverified' },
  ]),
  step0: Object.freeze({
    cell: { t: 0.075, h: 1.24, q: 0.30314, y: 0.5506 },
    capacityRatio: Object.freeze([[7, 1.69], [13, 1.40], [31, 1.07], [100, 0.77], [1000, 0.39]]),
    reading: 'zerocond.py tests an additive capacity implication at y below the barrier (phase-free rough parts); cond.py’s |F|/l1 ≤ 5e-4 hits are genuine near-zeros (Newton projection to < 1e-11 moves phases ≤ 0.03 rad). The two scripts agree once read as different certificate classes.',
  }),
  relaxationLadder: Object.freeze([ // P, exact primes, gap vs ascent C = 0.4516, conditioning gain seen inside R_P
    { P: 7, exactPrimes: 4, gap: 0.126, gainInside: 0.005 },
    { P: 31, exactPrimes: 11, gap: 0.098, gainInside: 0.005 },
    { P: 100, exactPrimes: 25, gap: 0.027, gainInside: 0.067 },
    { P: 300, exactPrimes: 62, gap: 0.0029, gainInside: 0.081 },
    { P: 1000, exactPrimes: 168, gap: 1e-5, gainInside: 0.082, note: 'equals the exact torus (1009·1013 > N0)' },
  ]),
  ode: Object.freeze({
    raymondRecordsExact: 0.14939507382768755,
    fixedScheduleExact: Object.freeze({ U: 0.146154, C: 0.145400, Ucap: 0.144408, Ccap: 0.144408, raymondCap: 0.144528 }),
    capMargin: Object.freeze([[1e-3, 0.14453], [1e-2, 0.14825], [5e-2, 0.149395]]),
    reoptPathAsReported: Object.freeze({ U: 0.14381, C: 0.14308 }),
    reoptPathValidityEnforced: Object.freeze({ U: [0.14406, 0.14416], C: [0.14322, 0.14327] }),
    p7ShiftOnValidPath: [0.1450, 0.1451],
    gate: 0.1435,
  }),
  nextStep:
    'Stop the conditioning lever. The larger measured slack is in the unconditional certificate: at t = 0.075 Raymond’s certified joint cost is '
    + '0.808 vs a 4-prime-head / phase-free-cofactor relaxation ascent value ≈ 0.583 and converged Kronecker 0.5335. Before quoting any Λ for that '
    + 'class, constrain the barrier path to y(t) ≥ y_torus_found(t) (or use the fixed schedule) and prove an upper bound on the free-cofactor supremum '
    + 'at one cell (an ascent value is only a lower bound). On current numbers the P = 7 class is at best borderline (0.1450–0.1451).',
  verdict:
    'Outcome (c): measured intermediate result. Conditioning is real on the multiplicative torus but worth ΔΛ ≈ −0.0008 to −0.0009; no model-consistent '
    + 'schedule passes the 0.1435 gate (0.1444–0.1462); the gain is invisible to phase-decoupled certificates with ≤ 11 exactly coupled primes. '
    + 'Do not start an Arb certificate design for the zero-conditioned floor. No bound moves. PT Lambda <= 0.2 stands. RH open. NO QED.',
});

const Z = S145_ZERO_CONDITIONED_FLOOR;

export const S145_ZERO_CONDITIONED_FLOOR_ASSERTIONS = Object.freeze([
  {
    id: 's145-zc-fixed-schedule-gains',
    holds: () => {
      const f = Z.fixedSchedule, g = f.C.map((c, i) => f.U[i] - c);
      const big = g.map((x, i) => [x, f.t[i]]).filter(([x]) => x >= 0.09).map(([, t]) => t);
      return f.t.length === 12 && f.U.length === 12 && g.every((x) => x > 0) && big.length === 2 && big[0] === 0.0875 && big[1] === 0.1
        && Math.abs(g[6] - 0.0819) < 1e-4 && big.length + (12 - f.C.length) === 5;
    },
    why: 'U − C > 0 in every zeroable cell; ≥ 0.09 only at t = 0.0875 (0.105) and 0.1 (0.169): 2 of 12 (5 counting the three torus-excluded cells); t = 0.075 gain 0.0819; target was 8 of 12.',
  },
  {
    id: 's145-zc-path-gains',
    holds: () => Z.pathGains.length === 12 && Z.pathGains.filter((x) => x >= 0.09).length === 1 && Z.pathGains[11] >= 0.09,
    why: 'On the re-optimised path only t = 0.1375 (0.110) reaches 0.09: 1 of 12; the gain shrinks when heights are re-optimised.',
  },
  {
    id: 's145-zc-path-below-torus-zeros',
    holds: () => {
      const viol = Z.pathBelowTorus.every((r) => r.pathY < r.zeroFoundY);
      const br = Z.torusBrackets.find((b) => b.t === 0.1375);
      const w = (y) => br.t + (y * y) / 2;
      const brOk = Z.pathBelowTorus.every((r) => Z.torusBrackets.find((b) => b.t === r.t).lo === r.zeroFoundY);
      const minHi = Math.min(...Z.torusBrackets.filter((b) => b.lo !== null).map((b) => b.t + (b.hi * b.hi) / 2));
      return viol && brOk && w(br.lo) > 0.1451 && w(br.lo) < 0.1452 && w(br.hi) > 0.1456 && w(br.hi) < 0.1457 && Math.abs(minHi - w(br.hi)) < 1e-12
        && Z.torusBrackets.find((b) => b.t === 0.15).lo === null;
    },
    why: 'The re-optimised path sits below model zeros at t = 0.1125, 0.125, 0.1375; min over verified brackets of t + y²/2 = 0.1451–0.1457 at t = 0.1375 (repo torus obstruction 0.1455); t = 0.15 lower end unverified.',
  },
  {
    id: 's145-zc-relaxation-exactness-threshold',
    holds: () => {
      const s = new Uint8Array(N0 + 1); let pAll = 0, p1000 = 0, p7 = 0, p31 = 0, p100 = 0, p300 = 0;
      for (let i = 2; i <= N0; i++) {
        if (s[i]) continue;
        pAll++; if (i <= 1000) p1000++; if (i <= 7) p7++; if (i <= 31) p31++; if (i <= 100) p100++; if (i <= 300) p300++;
        for (let j = i * i; j <= N0; j += i) s[j] = 1;
      }
      const L = Z.relaxationLadder;
      return 1009 * 1013 > N0 && Math.sqrt(N0) > 831 && Math.sqrt(N0) < 832
        && pAll - p1000 === 55706 && [p7, p31, p100, p300, p1000].every((n, i) => n === L[i].exactPrimes);
    },
    why: 'Sieve to N0 = 690988: 55,706 primes in (1000, N0] (+ cofactor 1 = 55,707 free slots); 1009·1013 > N0 so R_1000 is the exact torus; R_P is a genuine relaxation only for P < √N0 ≈ 831; exact-prime counts 4 / 11 / 25 / 62 / 168.',
  },
  {
    id: 's145-zc-ladder-monotone',
    holds: () => {
      const L = Z.relaxationLadder;
      return L.every((r, i) => i === 0 || (r.gap < L[i - 1].gap && r.gainInside >= L[i - 1].gainInside))
        && L[0].gainInside / L[4].gainInside < 0.1 && L[1].gap < 0.10 && L[0].gap > 0.10
        && Z.step0.capacityRatio.findIndex(([, r]) => r < 1) === 3;
    },
    why: 'Gap falls 0.126 → 1e-5 and in-relaxation gain rises 0.005 → 0.082 with P; with ≤ 11 exact primes the gain is < 10% visible; the capacity ratio crosses 1 between P = 31 and 100, where the gain reappears.',
  },
  {
    id: 's145-zc-gate-no-model-consistent-pass',
    holds: () => {
      const o = Z.ode, fs = o.fixedScheduleExact;
      const consistent = [fs.U, fs.C, fs.Ucap, fs.Ccap, fs.raymondCap, o.capMargin[0][1]];
      const dLo = o.reoptPathValidityEnforced.U[0] - o.reoptPathValidityEnforced.C[1];
      const dHi = o.reoptPathValidityEnforced.U[1] - o.reoptPathValidityEnforced.C[0];
      return consistent.every((v) => v > o.gate && v >= 0.1444 && v <= 0.1462) && dLo > 0.0007 && dHi < 0.00095
        && o.reoptPathAsReported.U < o.reoptPathValidityEnforced.U[0] && o.p7ShiftOnValidPath[0] >= 0.145
        && o.capMargin.every(([, v], i, a) => i === 0 || v > a[i - 1][1]) && Math.abs(o.capMargin[2][1] - 0.149395) < 1e-6;
    },
    why: 'Model-consistent schedules give 0.1444–0.1462 > 0.1435; validity-enforced ΔΛ = 0.0008–0.0009; the reported 0.14381 was clamp-lowered; the P = 7 shift gives ≥ 0.1450; the cap is worthless at a 0.05 exclusion margin (0.149395).',
  },
  {
    id: 's145-zc-honest-scope',
    holds: () => /PT Lambda <= 0\.2 stands/.test(Z.verdict) && /NO QED/.test(Z.verdict) && /NO QED/.test(Z.status)
      && /not certified/.test(Z.status) && /no model-consistent/.test(Z.headline) && /Do not start an Arb/.test(Z.verdict)
      && Math.abs(Z.ode.raymondRecordsExact - 0.149395073827688) < 1e-15,
    why: 'Nothing certified except the exact replay of Raymond’s records; the gate failure is stated; no bound moves.',
  },
]);

export default S145_ZERO_CONDITIONED_FLOOR;
