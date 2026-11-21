/**
 * @fileoverview route-45-multiplicative-chaos-source-tails-2026-10-15 — roadmap route 45 (batch 10, group J): random-model (multiplicative
 * chaos / Bohr–Jessen) prediction of source-floor tails at the 12 binding cells of route 46. One worker run plus one adversarial internal
 * referee pass: REFUTED in part, severity MAJOR. The worker's only 'proved' item (sup over x ≥ X−2 of the source = torus supremum, so the
 * chain needs the full torus sup because of uniformity in x) is wrong for 11 of the 12 cells: the chain's source at height x uses
 * L = log(x/4π), and for t > 0 the head amplitudes exp(t v(v − L)/4) damp as x grows. Corrections applied below; the headline (the
 * certified-floor vs Kronecker gap is certification slack that no random model can explain) survives.
 *
 * PROVED: nothing new. Referee-derived structural statement (not formalised): at t = 0 (cell 0) the head amplitudes do not depend on L and,
 *  with ψ free and N0 labels, sup_{x ≥ X−2} of the leading-order source ≥ the torus sup (Kronecker). For t > 0 (cells 50–550) the source at
 *  height x is J_{L(x)}, damped as x grows, so uniformity in x only forces a sup over a FINITE x-window per L-band (row s ∈ [0, 1/20] is
 *  x ∈ [X − 2, ≈ 1.105X]). The torus sup at L0 is forced by the chain's free-phase architecture, not by uniformity in x.
 * CERTIFIED: none in this route. Route-46 Arb lower bounds reused unchanged (cell 300: U_lo = 0.533514111339326).
 * CONDITIONAL: no Λ value changes; the conditional value 0.116091488672439 (QRH 7/8 + Raymond chain + route-P ledger) is untouched.
 * MEASURED:
 *  - Regime: σ_eff = (1 + h)/2 ∈ [0.88, 1.59] plus de Bruijn damping; labels ≤ 10 carry 93–98% and labels ≤ 30 ≥ 99% of the first-order
 *    variance at the 3 cells computed (0, 300, 550; not all 12). A finite-variance Bohr–Jessen field with a finite upper endpoint, not
 *    log-correlated: Saksman–Webb / FHK maximum asymptotics do not apply directly.
 *  - Steinhaus Monte Carlo at 12 cells (1600–2400 samples; 55,870 primes ≤ N0): mean ≈ 0, sd 0.099–0.115, q99 0.24–0.285; Kronecker lower
 *    bounds 3.7–5.1 sd above the mean; lighter-than-Gaussian tails (excess kurtosis −0.31 at cell 300). Referee rerun at cell 300 (240
 *    samples): mean 0.0068, sd 0.108, z 4.86.
 *  - Realised heights x = X + δ (mpmath phases, ψ random), cells 300/0/550, 6000 points over 1500: KS p = 0.75 / 0.49 / 0.69; max over
 *    [X − 2, X + 2] at cell 300 is 0.360 (PT's X aligns p = 2, 3, 5, 7: phases 0.122, 0.304, 0.538, 0.703 rad; J(X) = 0.3254 for every ψ).
 *  - Importance sampling at cell 300: P(J ≥ 0.30) = 6.7e-3, P(≥ 0.36) = 2.9e-4, P(≥ 0.40) = 3.1e-6, P(≥ 0.41) = 4.5e-7, P(≥ 0.42) ≈ 8e-9
 *    (5 hits, ESS 4.5, ≈ 50% relative error); local to the ±θ* basin, other near-optimal basins not searched.
 *  - Pinning at cell 300 (θ_p = θ*_p for p ≤ y): J = 0.427 / 0.437 / 0.471 / 0.506 at y = 29 / 100 / 1000 / 10^4 vs J* = 0.5335; the
 *    closed-form single-prime loss model predicts 0.110 / 0.092 / 0.061 / 0.025 against measured 0.107 / 0.097 / 0.063 / 0.027.
 *  - Real-axis family θ_p = c log p: within 0.029 / 0.048 / 0.054 of the ascent value at cells 550 / 350 / 300; at cell 0 the referee's wide
 *    scan (c ∈ [−1.5, 1.5]) gives 0.2989 at c = −0.4525, gap 0.078 (the route's 0.244 / 0.133 sat at the edge of a ±0.06 window).
 *  - REFEREE L-damping (float Adam ascent with route-46 kron.py at L = L0 + 2s; lower bounds on sup_torus J_L; activated labels n > N0
 *    omitted): cell 300 0.530 / 0.503 / 0.480 / 0.439 / 0.259 at s = 0.05 / 0.5 / 1 / 2 / 10 (J*_L0 = 0.5335); cell 550 0.441 / 0.344 at
 *    s = 0.5 / 2 (0.4961); cell 100 0.398 / 0.332 at s = 2 / 10 (0.4188); cell 0 0.3767 at s = 2 and 10 (no damping).
 *  - Gap table: Raymond cost − U_lo 0.092–0.323; P47 K0* (conditional) − U_lo −0.019 to +0.031; TA floor at cell 300 0.7426 (0.209 above).
 * HEURISTIC: large-deviation saddle model (additive single-prime losses, exact 64-point profiles p ≤ 100, closed form above): at cell 300
 *  P(J ≥ J* − δ) = 10^-11.9 / 10^-88 / 10^-513 / 10^-3289 at δ = 0.10 / 0.06 / 0.03 / 0.01; calibrated against IS to ≈ 0.002 at cell 300,
 *  up to ≈ 0.02 low at cell 550. Predicted largest J over ≈ 1e12–1e13 trials sits 0.047–0.123 below U_lo across the 12 cells (0.100 at cell
 *  300); the route counted trials over x ∈ [0, X] (framing error; the relevant window is x ∈ [X − 2, X e^{2s}] per L-band, similar size).
 *  Combined with the referee damping: at t > 0 the largest leading-order source reached at any real x ≥ X − 2 is plausibly 0.05–0.10 below
 *  U_lo (cell 300 ≈ 0.44–0.45): a candidate lever that would need a deterministic finite-window bound for x ∈ [X − 2, ≈ X e^{2 s1}] plus
 *  certified torus floors at L_lo = L0 + 2 s1. Not usable now; no Λ change follows.
 *
 * Verdict: the random model does not explain the certified-floor vs Kronecker gap (certification slack on the same free-phase torus sup); it
 * does measure a second gap, Kronecker value vs what real heights reach, which (corrected by the referee) is relevant in principle at t > 0
 * because of L-damping, but only through a deterministic finite-window argument. No refereed bound is changed; RH open; NO QED. Import-free.
 * ROUTE_45_ASSERTIONS recompute live: the L-band window, the trial count exponent, z-scores, the pinning model fit, monotone damping,
 * the gap ordering and the corrected cell-0 real-axis gap.
 */

const { abs, exp, log10 } = Math;

export const ROUTE_45 = Object.freeze({
  id: 'route-45-multiplicative-chaos-source-tails-2026-10-15',
  route: 45,
  date: '2026-10-15',
  title: 'Route 45: random-model source tails — the certified-floor gap is certification slack (not explained); realised heights stay 0.05–0.12 below Kronecker values, relevant at t > 0 only via L-damping (referee, major)',
  status: 'done',
  headline: 'A Bohr–Jessen random model of the route-46 source (finite-variance, not log-correlated at σ_eff 0.88–1.59) cannot explain the gap '
    + 'between certified floors and Kronecker values: that gap is slack between a certified upper bound and an ascent lower bound on the same '
    + 'torus supremum. The model predicts real heights near X reach 0.05–0.12 below the Kronecker lower bounds. The referee (major) showed the '
    + 'worker\'s "uniformity in x forces the torus sup" is false for t > 0: the source at height x uses L = log(x/4π) and damps, so only a finite '
    + 'x-window per L-band is forced — a candidate lever that needs a deterministic finite-window bound. No Λ change.',
  cells: 12,
  primes: 55870,
  X: 6000000185827,
  U: Object.freeze({ c0: 0.3770, c100: 0.4188, c300: 0.533514111339326, c550: 0.4961 }),
  mc: Object.freeze({ sd: Object.freeze([0.099, 0.115]), z: Object.freeze([3.7, 5.1]), q99: Object.freeze([0.24, 0.285]), refC300: Object.freeze({ mean: 0.0068, sd: 0.108, z: 4.86 }) }),
  variance: Object.freeze({ labelsLe10: Object.freeze([0.93, 0.98]), labelsLe30: 0.99, cellsComputed: Object.freeze([0, 300, 550]), sigmaEff: Object.freeze([0.88, 1.59]) }),
  heights: Object.freeze({ ks: Object.freeze([0.75, 0.49, 0.69]), maxNearX300: 0.360, JX: 0.3254, phasesX: Object.freeze([0.122, 0.304, 0.538, 0.703]) }),
  is300: Object.freeze([[0.30, 6.7e-3], [0.36, 2.9e-4], [0.40, 3.1e-6], [0.41, 4.5e-7], [0.42, 8e-9]]),
  pin300: Object.freeze({ y: Object.freeze([29, 100, 1000, 10000]), J: Object.freeze([0.427, 0.437, 0.471, 0.506]), predLoss: Object.freeze([0.110, 0.092, 0.061, 0.025]), measLoss: Object.freeze([0.107, 0.097, 0.063, 0.027]) }),
  ld300: Object.freeze([[0.10, -11.9], [0.06, -88], [0.03, -513], [0.01, -3289]]),
  predictedGap: Object.freeze([0.047, 0.051, 0.054, 0.060, 0.069, 0.076, 0.100, 0.118, 0.118, 0.102, 0.123, 0.109]),
  damping: Object.freeze({
    c300: Object.freeze([[0, 0.5335], [0.05, 0.530], [0.5, 0.503], [1, 0.480], [2, 0.439], [10, 0.259]]),
    c550: Object.freeze([[0, 0.4961], [0.5, 0.441], [2, 0.344]]),
    c100: Object.freeze([[0, 0.4188], [2, 0.398], [10, 0.332]]),
    c0: Object.freeze([[2, 0.37673], [10, 0.37672]]),
  }),
  realAxisC0: Object.freeze({ routeMax: 0.244, routeGap: 0.133, wideMax: 0.2989, cBest: -0.4525 }),
  gaps: Object.freeze({ raymond: Object.freeze([0.092, 0.323]), p47: Object.freeze([-0.019, 0.031]), ta300: 0.209 }),
  refereeKilled: Object.freeze([
    'MAJOR: "sup over x ≥ X−2 equals the torus sup, so the chain needs it" is false for t > 0 (11 of 12 cells): the source at height x uses L = log(x/4π) and its head amplitudes exp(t v(v − L)/4) damp as x grows; at fixed L-band the x-range is finite (row s ∈ [0, 1/20] ↔ x ∈ [X − 2, ≈ 1.105X])',
    'consequence: "the chain cannot use the realised-height gap" was wrong for the stated reason; the torus sup is forced by the free-phase architecture, and T1 in the next step is ≈ X e^{1..4}, not 1e100',
    'framing: trials counted over x ∈ [0, X]; the relevant window is [X − 2, X e^{2s}] per L-band (numbers survive roughly)',
    'real-axis scan at cell 0 used a ±0.06 window; wide scan gives 0.2989 (gap 0.078), not 0.244 (gap 0.133)',
    'variance shares computed at 3 cells only, not all 12; cell-300 q99 is 0.285; P(J ≥ 0.42) rests on 5 hits (ESS 4.5); LD/IS local to the ±θ* basin',
  ]),
  nextStep: '(1) Decide whether a deterministic finite-window floor is worth building: for t > 0 cells, bound sup of the leading-order source over '
    + 'x ∈ [X − 2, X e^{2 s1}] (s1 ≈ 0.5–2) by a Baker-type / linear-forms-in-logarithms or explicit-phase argument, and certify torus floors at '
    + 'L_lo = L0 + 2 s1 above it (route-46 machinery with L shifted). Include the activated labels N0 < n ≤ N(x) in the damping runs first. '
    + '(2) Otherwise close as a map; the certified-floor lever stays WOL-C on the P47 late cells (routes 46, 47). (3) Optional: IS with k = 25, 168 at '
    + 'cell 550 to calibrate the LD inverse levels.',
  files: Object.freeze(['tmp/routes-b10-r45-{core,selftest,mc,linear,logcorr,heights,pin,is,ld,realaxis,ams,summary}.py', 'tmp/routes-b10-r45-run{,2,3}.sh',
    'tmp/routes-b10-r45-out/{SUMMARY,pin_300,realaxis,logcorr,linear}.json', 'tmp/routes-b10-r45-out/ld_*.json', 'tmp/routes-b10-r45-out/is_{0,300,550}_k10.json',
    'tmp/routes-b10-ref45-{check,Lsup,cscan}.py', 'tmp/routes-b10-ref45-out/{star,run,Lsup300,Lsup2,cscan}.log']),
  verdict: 'Done; referee major correction applied. The random model does not explain the gap between certified floors and Kronecker values '
    + '(Raymond 0.09–0.32, TA 0.21 at cell 300, conditional P47 −0.02 to +0.03): that is certification slack on one free-phase torus supremum. The '
    + 'model measures a different gap — real heights near X reach 0.05–0.12 below the Kronecker lower bounds — and, because the source damps with '
    + 'L = log(x/4π) at t > 0 (referee), that gap is relevant in principle through a deterministic finite-window bound, not through probabilities. '
    + 'Not usable now; the conditional value stays 0.116091488672439. No refereed bound is changed; RH open; NO QED.',
});

const R45 = ROUTE_45;
const decreasing = (rows) => rows.every((r, i) => i === 0 || r[1] < rows[i - 1][1]);

export const ROUTE_45_ASSERTIONS = Object.freeze([
  {
    id: 'r45-l-band-window',
    holds: () => { const s1 = 1 / 20; const ratio = exp(2 * s1); return abs(ratio - 1.105) < 1e-3 && (ratio - 1) * R45.X > 5e11 && (ratio - 1) * R45.X < 7e11; },
    why: 'L = log(x/4π) = L0 + 2s ⇒ x = X e^{2s}; row s ∈ [0, 1/20] is x ∈ [X − 2, 1.105X], a finite window of ≈ 6e11 heights where Kronecker density does not apply.',
  },
  {
    id: 'r45-trial-exponent',
    holds: () => abs(-log10(0.22 * R45.X) + 12.12) < 0.01 && R45.ld300[0][1] > -12.12 && R45.ld300[1][1] < -12.12,
    why: 'log10 P = −log10(0.22·X) = −12.12 (Rice rate 0.22 per unit height); at cell 300 the LD level crosses it between δ = 0.10 (10^-11.9) and δ = 0.06 (10^-88), matching the ≈ 0.100 predicted gap.',
  },
  {
    id: 'r45-z-scores',
    holds: () => { const r = R45.mc.refC300; const z = (R45.U.c300 - r.mean) / r.sd;
      return abs(z - r.z) < 0.02 && z > R45.mc.z[0] && z < R45.mc.z[1] && R45.mc.q99[1] < R45.U.c300 - 0.2; },
    why: 'Referee MC at cell 300: (0.5335 − 0.0068)/0.108 = 4.88 ≈ 4.86, inside the 3.7–5.1 range; q99 ≤ 0.285 is > 0.2 below U_lo.',
  },
  {
    id: 'r45-pinning-model',
    holds: () => { const p = R45.pin300; return p.J.every((j, i) => abs((R45.U.c300 - j) - p.measLoss[i]) < 0.002 && abs(p.predLoss[i] - p.measLoss[i]) < 0.006)
      && decreasing(p.measLoss.map((x, i) => [i, x])); },
    why: 'J* − J(pinned ≤ y) reproduces the measured losses 0.107 / 0.097 / 0.063 / 0.027 and the single-prime model is within 0.006: ≈ 0.107 of the Kronecker value comes from aligning ≈ 55,800 primes above 29.',
  },
  {
    id: 'r45-damping-monotone',
    holds: () => { const d = R45.damping; return decreasing(d.c300) && decreasing(d.c550) && decreasing(d.c100) && abs(d.c0[0][1] - d.c0[1][1]) < 1e-4
      && d.c300[4][1] < R45.U.c300 - 0.09; },
    why: 'Referee ascent: sup_torus J_L falls with s at cells 300, 550, 100 (t > 0) and is flat at cell 0 (t = 0); at s = 2 cell 300 is 0.094 below J*_L0.',
  },
  {
    id: 'r45-tail-probabilities',
    holds: () => decreasing(R45.is300) && decreasing(R45.ld300) && R45.is300.every(([u]) => u < R45.U.c300),
    why: 'IS tail probabilities decrease with level at cell 300 and LD log-probabilities decrease as δ → 0; every IS level is below U_lo.',
  },
  {
    id: 'r45-gaps-and-real-axis',
    holds: () => { const g = R45.gaps; const pg = R45.predictedGap; const ra = R45.realAxisC0;
      return pg.length === R45.cells && Math.min(...pg) === 0.047 && Math.max(...pg) === 0.123 && g.raymond[0] > g.p47[1] && g.ta300 > Math.max(...pg)
        && abs(R45.U.c0 - ra.wideMax - 0.078) < 1e-3 && ra.wideMax > ra.routeMax; },
    why: 'Predicted realised-height gaps 0.047–0.123 over 12 cells; Raymond slack (≥ 0.092) exceeds conditional P47 slack (≤ 0.031) and TA slack 0.209 exceeds every predicted gap (different objects); cell-0 real-axis gap corrected to 0.3770 − 0.2989 = 0.078.',
  },
  {
    id: 'r45-honesty',
    holds: () => /refereed bound is changed/i.test(R45.verdict) && /NO QED/.test(R45.verdict) && /0\.116091488672439/.test(R45.verdict)
      && /MAJOR/.test(R45.refereeKilled[0]) && /finite-window/.test(R45.verdict),
    why: 'Verdict records the major referee correction, keeps PT Λ ≤ 0.2 and the conditional value, and claims no QED.',
  },
]);

export default ROUTE_45;
