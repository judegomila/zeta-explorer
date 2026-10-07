/**
 * @fileoverview route-50-kkl-lambda-curve-2026-10-08 — roadmap route 50 (batch 3): Λ as a function of the Ki–Kim–Lee constant c
 * and a verified height X, using route 20's explicit KKL theorem for hypothesis (ii) of Polymath15 Thm 1.2. One run plus one
 * adversarial internal referee pass (not refuted, minor); the referee corrections are applied below.
 *
 * Outcome: Λ ≤ t0 + y0²/2 with t0 the smallest certified t_lo having x0(t_lo) + SP ≤ X (step function; SP < 0.47). The uniform-c
 * formula t0 = c/log((X − 0.47)/4π) is an idealisation (c(t) runs 5.31–5.84). To beat route 3's 0.145465618111039 at PT height c must
 * drop to ≤ 3.912 (−29% from the method's ≈ 5.53). The route-20 triangle-inequality method cannot reach c ≤ 3.912 at any height:
 * c > 4.9144 is Arb-proved for every x0 ≥ X_PT. It can beat route P only with verified height X ≥ 4.63e17 plus a barrier there,
 * both uncomputed. Route 50 is closed as a Λ lever at PT height for the current technique.
 *
 * PROVED (elementary, given Polymath15 Thm 1.2 and route 20's theorem; project-internal): the composition (KKL supplies (ii) for every
 *  y0 > 0; still needs (i) RH to X/2 and (iii) a barrier at X), and the de Bruijn reading (verified real zeros of H_{t0} up to
 *  x0 + SP ⇒ Λ ≤ t0). Floor for the method, uniform in height: every term of D(1/2; t, L) is ≥ n^{−1/2−tL/4}; Arb gives
 *  Σ_{n=2}^{690988} n^{−1.7286} = 1.0000095 > 1 and N(X) ≥ 690988 for X ≥ X_PT, so D(1/2) < 1 fails whenever t·log(x0/4π) ≤ 4.9144
 *  (asymptotically 4(s0 − 1/2) = 4.91459, ζ(s0) = 2). At PT height D(1/2; 0.2163, L_PT) = 1.000559 > 1 (Arb, N = 690988), D decreasing
 *  in t; continuity line (referee addition): D is decreasing in L at fixed N, N-jumps add nonnegative terms, and the 5.6e-4 margin
 *  dominates the variation over |Δx| ≤ 0.47 (ΔL ≈ 1e-13). This is a statement about the method only.
 * CERTIFIED (Arb 128 bit, route-20 certify.py unchanged apart from new rows; conditional on Polymath15 Thm 1.3 and de Bruijn Thm 13;
 *  referee re-ran all five exactly): t_lo = 0.145 → x0 = 4.62778e17; 0.175 → 1.42226e15; 0.178 → 8.84483e14; 0.1995 → 4.33802e13;
 *  0.21 → 1.24286e13; route-20 row t = 0.20 re-certified (4.0650e13); negative control t = 0.145 at L0 = 38.09 fails as intended.
 * CONDITIONAL: every Λ value from the step function needs RH to X/2 and a barrier at X (neither computed above X_PT). The X values per
 *  target are sufficient (certified rows), not necessary: Λ ≤ 0.2 is certified at X ≥ 4.07e13 (y0 → 0), 0.1787854 at 8.84e14,
 *  0.1758354 at 1.42e15, sub-route-3 (0.1453125 with y0 = 0.025) at 4.63e17. At X_PT only t = 0.217 applies (weaker than PT).
 * MEASURED: float method limits L*(0.1) = 53.0664, L*(0.15) = 36.996, L*(0.145) = 38.114; t*(X_PT) = 0.216336, t*(4.07e13) = 0.19984,
 *  t*(1e15) = 0.17703; c*(t) 5.307 (t = 0.10) → 5.53 (0.145) → 5.818 (t*(X_PT)). Required c at X_PT: 0.2 → 5.378; 0.1787854 → 4.808;
 *  0.1758354 → 4.729; route 3 → 3.9118 (y0 → 0) / 3.9034 (y0 = 0.025); factor 0.7076 against the method.
 * HEURISTIC: route 20's Euler-mollified floor crosses at t ≈ 0.176 at X_PT (effective c ≈ 4.73), still ≈ 21% above 3.912.
 *
 * PT Λ ≤ 0.2 stands; RH open; NO QED. Import-free. ROUTE_50_ASSERTIONS recompute L_PT, the required c values, the floor partial sums
 * on both sides of 4.9144, D at t = 0.2163 / 0.2164, ζ(s0) = 2, c = t·log(x0/4π) on the certified rows and the step function.
 */

const FOUR_PI = 4 * Math.PI;
const X_PT = 6000000185827;
const SP = 0.47;

export const ROUTE_50 = Object.freeze({
  id: 'route-50-kkl-lambda-curve-2026-10-08',
  route: 50,
  date: '2026-10-08',
  title: 'Route 50: Λ(c, X) from the explicit KKL constant; beating route P at PT height needs c ≤ 3.912, the method is floored at c > 4.9144',
  status: 'done',
  headline: 'Λ ≤ t0 + y0²/2 with t0 the smallest certified t_lo having x0(t_lo) + SP ≤ X (step function; the uniform-c formula c/log((X − SP)/4π) is an '
    + 'idealisation). Beating route 3\'s 0.145465618111039 at PT height needs c ≤ 3.912, 29% below the method\'s ≈ 5.53; the triangle-inequality '
    + 'method cannot reach c ≤ 3.912 at any height (c > 4.9144 Arb-proved for x0 ≥ X_PT).',

  targets: Object.freeze({ route3: 0.145465618111039, route1: 0.145694083872924, route5: 0.145620383931826, pt: 0.2, base: 0.1787854, yTransfer: 0.1758354 }),
  requiredC: Object.freeze({ route3: 3.911826, route3y025: 3.903422, route1: 3.91797, route5: 3.91599, pt: 5.37835, base: 4.80785, yTransfer: 4.72852 }),
  LPT: 26.89175637,
  floor: Object.freeze({ c: 4.9144, partialSum: 1.00000953214, cAbove: 4.9145, partialSumAbove: 0.99996410, s0: 1.72864723899818, asymptotic: 4.914589, N: 690988 }),
  ptFailure: Object.freeze({ t: 0.2163, D: 1.00055943, tNext: 0.2164, Dnext: 0.99899925 }),
  newRows: Object.freeze([
    Object.freeze({ t: 0.145, x0: 4.62778e17, L0: 38.145, margin: 0.00244463 }),
    Object.freeze({ t: 0.175, x0: 1.42226e15, margin: 0.00399181 }),
    Object.freeze({ t: 0.178, x0: 8.84483e14, margin: 0.00422652 }),
    Object.freeze({ t: 0.1995, x0: 4.33802e13, margin: 0.00314330 }),
    Object.freeze({ t: 0.21, x0: 1.24286e13, margin: 0.00516293 }),
  ]),
  reCertified: Object.freeze({ t: 0.2, x0: 4.0650e13 }),
  negativeControl: Object.freeze({ t: 0.145, L0: 38.09, exactLimit: 38.114, certified: false }),
  stepFunction: Object.freeze([[X_PT, 0.217], [2e13, 0.21], [4.07e13, 0.20], [1e14, 0.1995], [1e15, 0.178], [1e16, 0.17], [1e17, 0.16], [5e17, 0.145],
    [1e20, 0.13], [1e22, 0.12], [1.5e24, 0.10]]),
  methodLimit: Object.freeze({ cAt: Object.freeze([[0.10, 5.307], [0.145, 5.53], [0.20, 5.757], [0.216336, 5.818]]), tStarPT: 0.216336, reductionFactor: 0.7076 }),
  heuristicMollifiedC: 4.73,

  refereeKilled: Object.freeze([
    '"cannot close the gap at any height" — read literally false: at X ≥ 4.63e17 the same method gives a sub-route-3 value (0.1453125, conditional); what is proved is that it cannot reach c ≤ 3.912, so it cannot beat route P at PT height',
    'X values per target ("0.2 needs X ≥ 4.07e13", "0.1787854 needs 8.84e14") — sufficient (certified rows), not necessary; float method limits are slightly lower (t*(4.07e13) = 0.19984)',
    'headline formula with one constant c — c(t) varies 5.31–5.84; the step function is the certified object',
    'PT-height obstruction at L_PT exactly — the certificate samples within SP < 0.47 of X_PT; continuity line added (D decreasing in L, N-jumps add nonnegative terms, margin 5.6e-4)',
    'de Bruijn reading needs verification up to x0 + SP, not x0 (negligible)',
  ]),
  nextStep: 'Treat route 50 as closed at PT height for the current technique. The only lever left is a KKL block lemma that keeps cancellation (mollified F_B '
    + 'with second-order vertical-edge control) reaching effective c ≈ 3.91 at L = 26.9 (≈ 0.82× the heuristic mollified 4.73). Optional: independent '
    + 'referee on the 4.9144 floor argument and the five rows.',
  files: Object.freeze(['tmp/routes-b3-50-curve.py', 'tmp/routes-b3-50-table.py', 'tmp/routes-b3-50-out/table.json', 'tmp/routes-b3-50-kkl/certify.py',
    'tmp/routes-b3-50-kkl/certify.log', 'tmp/routes-b3-50-kkl/out_t0.145.json', 'tmp/routes-b3-ref-50-check.py', 'tmp/routes-b3-ref-50-cert/']),
  verdict: 'Λ ≤ t0 + y0²/2 from the certified KKL step function (uniform-c curve c/log((X − 0.47)/4π) as idealisation) replaces only hypothesis (ii); it '
    + 'still needs RH to X/2 and a barrier at X. Beating route P at PT height needs c ≤ 3.912 (−29% from ≈ 5.53); the triangle-inequality method cannot '
    + 'reach c ≤ 3.912 at any height (c > 4.9144 Arb-proved for x0 ≥ X_PT), so it beats route P only with verified height X ≥ 4.63e17 plus a barrier '
    + 'there, both uncomputed. Route 50 is closed at PT height for the current technique. PT Lambda <= 0.2 stands; RH open; NO QED.',
});

const R = ROUTE_50;
const L = (X) => Math.log((X - SP) / FOUR_PI);
export const lambdaKKL = (c, X, y0 = 0) => c / L(X) + (y0 * y0) / 2;
const powSum = (s, N) => { let acc = 0; for (let n = N; n >= 2; n--) acc += Math.exp(-s * Math.log(n)); return acc; };
const Dsum = (t, x, N) => { const Lx = Math.log(x / FOUR_PI); let s = 0; for (let n = N; n >= 2; n--) { const ln = Math.log(n); s += Math.exp(-(0.5 + (t / 4) * (Lx - ln)) * ln); } return s; };
const zeta = (s) => { const N = 2000; let acc = 0; for (let n = N - 1; n >= 1; n--) acc += n ** -s; // Euler–Maclaurin tail from N
  return acc + N ** (1 - s) / (s - 1) + N ** -s / 2 + (s * N ** (-s - 1)) / 12 - (s * (s + 1) * (s + 2) * N ** (-s - 3)) / 720; };

export const ROUTE_50_ASSERTIONS = Object.freeze([
  {
    id: 'r50-required-c',
    holds: () => { const l = L(X_PT); const t = R.targets; const q = R.requiredC;
      return Math.abs(l - R.LPT) < 1e-7 && Math.abs(t.route3 * l - q.route3) < 2e-6 && Math.abs((t.route3 - 0.025 ** 2 / 2) * l - q.route3y025) < 2e-6
        && Math.abs(t.route1 * l - q.route1) < 1e-5 && Math.abs(t.route5 * l - q.route5) < 1e-5 && Math.abs(t.pt * l - q.pt) < 1e-5
        && Math.abs(t.base * l - q.base) < 1e-5 && Math.abs(t.yTransfer * l - q.yTransfer) < 1e-5
        && Math.abs(q.route3 / 5.5287 - R.methodLimit.reductionFactor) < 1e-4; },
    why: 'L_PT = log((X_PT − 0.47)/4π) = 26.89175637; required c = target·L_PT: 3.911826 (route 3), 3.903422 (y0 = 0.025), 5.37835 (0.2), 4.80785, 4.72852; factor 3.9118/5.5287 = 0.7076.',
  },
  {
    id: 'r50-lambda-curve',
    holds: () => Math.abs(lambdaKKL(R.requiredC.route3, X_PT) - R.targets.route3) < 1e-7
      && lambdaKKL(R.floor.c, X_PT) > R.targets.route3 && Math.abs(FOUR_PI * Math.exp(R.floor.c / R.targets.route3) / 5.9e15 - 1) < 0.01
      && Math.abs(FOUR_PI * Math.exp(R.floor.c / 0.2) / 5.9e11 - 1) < 0.02,
    why: 'Λ(c, X) = c/log((X − 0.47)/4π) + y0²/2 reproduces route 3 at c = 3.9118; at the floor c = 4.9144 one needs X ≈ 5.9e15 for route 3 and 5.9e11 for 0.2.',
  },
  {
    id: 'r50-floor-partial-sums',
    holds: () => { const f = R.floor; const a = powSum(0.5 + f.c / 4, f.N); const b = powSum(0.5 + f.cAbove / 4, f.N);
      return a > 1 && Math.abs(a - f.partialSum) < 1e-9 && b < 1 && Math.abs(b - f.partialSumAbove) < 1e-8; },
    why: 'Float recomputation of the Arb floor: Σ_{n=2}^{690988} n^{−(1/2 + c/4)} = 1.0000095 > 1 at c = 4.9144 and 0.99996 < 1 at 4.9145 (sharp at the 4th decimal).',
  },
  {
    id: 'r50-asymptotic-floor',
    holds: () => Math.abs(zeta(R.floor.s0) - 2) < 1e-9 && Math.abs(4 * (R.floor.s0 - 0.5) - R.floor.asymptotic) < 1e-6 && R.floor.c < R.floor.asymptotic,
    why: 'ζ(s0) = 2 at s0 = 1.728647239 (Euler–Maclaurin), so the N → ∞ floor is 4(s0 − 1/2) = 4.914589 > 4.9144.',
  },
  {
    id: 'r50-pt-height-failure',
    holds: () => { const p = R.ptFailure; const d1 = Dsum(p.t, X_PT, 690988); const d2 = Dsum(p.tNext, X_PT, 690988);
      return d1 > 1 && Math.abs(d1 - p.D) < 1e-6 && d2 < 1 && Math.abs(d2 - p.Dnext) < 1e-6 && Math.abs(Dsum(p.t, X_PT + SP, 690988) - d1) < 1e-9; },
    why: 'D(1/2; 0.2163, L_PT) = 1.000559 > 1 and D(0.2164) = 0.998999 < 1; moving x by 0.47 changes D by < 1e-9 ≪ the 5.6e-4 margin (referee continuity line).',
  },
  {
    id: 'r50-rows-c-band',
    holds: () => { const rows = [...R.newRows, R.reCertified]; const c = (r) => r.t * Math.log(r.x0 / FOUR_PI);
      return rows.every((r) => c(r) > R.floor.c && c(r) > 5.3 && c(r) < 5.84) && Math.abs(Math.log(R.newRows[0].x0 / FOUR_PI) - R.newRows[0].L0) < 1e-3
        && R.newRows[0].L0 > R.negativeControl.exactLimit && R.negativeControl.L0 < R.negativeControl.exactLimit && R.newRows.every((r) => r.margin > 0)
        && Math.abs(c(R.newRows[0]) - 5.531) < 0.002; },
    why: 'Every certified row has c = t·log(x0/4π) ∈ (5.3, 5.84), above the 4.9144 floor; t = 0.145 row L0 = 38.145 > exact limit 38.114 > failing control 38.09.',
  },
  {
    id: 'r50-step-function',
    holds: () => { const s = R.stepFunction; const rows = [...R.newRows, R.reCertified];
      const mono = s.every((v, i) => i === 0 || (v[0] > s[i - 1][0] && v[1] < s[i - 1][1]));
      const consistent = rows.every((r) => { const e = s.find(([, t]) => t === r.t); return !e || r.x0 + SP <= e[0]; });
      return mono && consistent && s[0][1] > R.targets.pt && s.find(([, t]) => t === 0.145)[0] / X_PT > 7.7e4 && 0.145 + 0.025 ** 2 / 2 < R.targets.route3; },
    why: 'Step function monotone; each row\'s x0 + SP fits under its tabulated X; at X_PT t0 = 0.217 > 0.2; sub-route-3 (0.1453125) only from X = 5e17 ≈ 8.3e4 × X_PT.',
  },
  {
    id: 'r50-honest-scope',
    holds: () => R.status === 'done' && /closed at PT height/.test(R.verdict) && /PT Lambda <= 0\.2 stands/.test(R.verdict) && /NO QED/.test(R.verdict)
      && /sufficient/.test(R.refereeKilled[1]) && R.heuristicMollifiedC > R.requiredC.route3,
    why: 'Method-only obstruction; X thresholds graded sufficient; even the heuristic mollified c ≈ 4.73 is above 3.912; no QED.',
  },
]);

export default ROUTE_50;
