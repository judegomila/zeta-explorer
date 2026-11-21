/**
 * @fileoverview route-49-unconditional-s-of-t-2026-10-06 — roadmap route 49 (batch 1): unconditional S(T) constants and
 * their effect on local zero counting and mirror descent. One run plus one adversarial internal referee pass (not refuted,
 * minor); the referee corrections are applied below (headline made model-dependent and conditional on Trudgian 2011).
 *
 * Outcome: given Trudgian's 2011 S_1 bound (constant quoted from memory, to be checked), an elementary sawtooth lemma gives
 * |S(t)| ≤ √(2Aρ)(1 + o(1)), 9–17% below the T ≥ e Backlund-type constants of Trudgian 2014 for T in 1e11–1e17 (5.6748 vs
 * 6.6612 at 3e12). Height-restricted constant tables in the literature have not been compared. It does not move Λ: the
 * S(T) channel is not a usable lever for mirror descent.
 *
 * PROVED (elementary; project-internal; re-derived by the internal referee):
 *  - Sawtooth lemma: if |S_1(t2) − S_1(t1)| ≤ A(t2) for 168π < t1 < t2 and ρ = θ'/π, then for δ > 0:
 *    S(t) ≤ A(t+δ)/δ + δρ(t+δ)/2 and S(t) ≥ −A(t)/δ − δρ(t)/2 (N nondecreasing; θ'' > 0 for t > 0). Optimal δ gives √(2Aρ)(1+o(1)).
 *  - Corollaries: |N(t+H) − N(t) − (θ(t+H) − θ(t))/π| ≤ S_up(t+H) + S_lo(t); zero-free gaps g ≤ (S_up + S_lo)/ρ.
 *  - Counting-input ceiling for mirror descent: p_E(Y) = 4ρ_z(π/2 − arctan((E+1)/(ρ_z Y))) — exact in the continuous relaxation
 *    only (integer counts can make the discrete minimum slightly larger; referee).
 * CERTIFIED: none.
 * CONDITIONAL: Trudgian 2011 (A = 2.067 + 0.059 log t2, t > 168π) and Trudgian 2014 (0.112 log T + 0.278 log log T + 2.510; the
 *  repo also carries a conflicting +3.385) quoted from memory; Hasanalizade–Shen–Wong 2022 and Bellotti–Wong 2024 (T ≥ e
 *  versions only). Mirror-descent figures treat ζ zero counts as if they held for H_t at t > 0 (no explicit S_t bound exists);
 *  B1 also carries the P15 hypotheses and residuals (a)–(c).
 * MEASURED: E_saw table; local counting at 3e12; Odlyzko windows (zero indices 1e12, 1e21, 1e22 = heights 2.68e11, 1.44e20,
 *  1.37e21: |S| ≤ 2.03, max gap 0.77); mirror descent at the seam: optimistic all-real model needs E ≤ 3.363 for formal Λ 0.2
 *  (proved E = 5.675 gives 0.2424); pessimistic weights give 0.2038 even at E = 0 (a 0.0038 margin in an ad hoc worst-case
 *  model; robust figures: E ≥ 1/2 → ≥ 0.2200, E ≈ 2 → 0.2628).
 * HEURISTIC: unconditional Beurling–Selberg / CCM extremal functions do not help (off-line zeros in short windows lack local
 *  density control; the correction is circular); RH-conditional S bounds are useless for Λ. Novelty not claimed (the mechanism is
 *  the one inside Turing's method).
 *
 * PT Λ ≤ 0.2 is the accepted benchmark; 0.1758354 and 0.1787854 remain computer-assisted candidates; RH open; NO QED.
 * Import-free. ROUTE_49_ASSERTIONS recompute E_saw (asymptotic θ', grid over δ), Trudgian 2014, the crossover, the gap and count
 * bounds at 3e12, and the mirror-descent threshold orderings live.
 */

const thetaPrime = (t) => 0.5 * Math.log(t / (2 * Math.PI)); // asymptotic θ'(t); corrections O(1/t²) are negligible at t ≥ 1e11
const rho = (t) => thetaPrime(t) / Math.PI;
const A2011 = (t) => 2.067 + 0.059 * Math.log(t); // Trudgian 2011 S_1 constant (quoted from memory, CONDITIONAL)
const E2014 = (T) => 0.112 * Math.log(T) + 0.278 * Math.log(Math.log(T)) + 2.510; // Trudgian 2014 (quoted from memory)
// Golden-section minimisation of a unimodal function on [lo, hi].
const gmin = (fn, lo, hi) => { const g = (Math.sqrt(5) - 1) / 2; let a = lo, b = hi; for (let i = 0; i < 200; i++) { const c = b - g * (b - a), d = a + g * (b - a); if (fn(c) < fn(d)) b = d; else a = c; } return fn((a + b) / 2); };
const sawtooth = (T) => ({ up: gmin((d) => A2011(T + d) / d + d * rho(T + d) / 2, 0.05, 10), lo: gmin((d) => A2011(T) / d + d * rho(T) / 2, 0.05, 10) });
const Esaw = (T) => { const s = sawtooth(T); return Math.max(s.up, s.lo); };

const H = (T, saw, tru) => Object.freeze({ T, saw, tru });

export const ROUTE_49 = Object.freeze({
  id: 'route-49-unconditional-s-of-t-2026-10-06',
  route: 49,
  date: '2026-10-06',
  title: 'Route 49: sawtooth S(T) bound 9–17% below Trudgian 2014 at 1e11–1e17; no Λ lever through S(T)',
  status: 'done',
  headline: 'Given Trudgian\'s 2011 S_1 constant (to be checked against the paper), an elementary sawtooth lemma gives |S(t)| ≤ √(2Aρ)(1 + o(1)), '
    + '9–17% below the T ≥ e Backlund-type constants of Trudgian 2014 for T in 1e11–1e17 (5.6748 vs 6.6612 at 3e12). In the B1 pessimistic-weight '
    + 'model no pointwise S input reaches Λ 0.2 at the seam (E = 0 gives 0.2038); in the optimistic all-real model the threshold is E ≤ 3.363 '
    + 'against the proved 5.675, and that model assumes every neighbour is real. The S(T) channel is not a usable lever.',

  // E_saw (rounded up to 4 decimals) vs Trudgian 2014 at T ≥ e.
  table: Object.freeze([
    H(2.68e11, 5.3104, 6.3663), H(3e12, 5.6748, 6.6613), H(1e13, 5.8549, 6.8075), H(1e15, 6.5366, 7.3631),
    H(7.5e16, 7.1673, 7.8794), H(1e17, 7.2091, 7.9137), H(1.37e21, 8.5801, 9.0410),
  ]),
  crossoverLogT: 67.35,
  asymptoticCoeff: 0.1370, trudgianCoeff: 0.112,
  seam: Object.freeze({ T: 3e12, countErr: 11.35, gap: 2.652, gapTrudgian: 3.113, countLower: Object.freeze({ 2: -2.79, 5: 10.05, 10: 31.45 }) }),
  odlyzko: Object.freeze({ zeroIndex: Object.freeze([1e12, 1e21, 1e22]), heights: Object.freeze([2.68e11, 1.44e20, 1.37e21]),
    sRange: 2.03, maxGap: Object.freeze([0.770, 0.404, 0.427]), maxDeltaS1: Object.freeze([1.484, 1.472, 1.492]), A: Object.freeze([3.62, 4.81, 4.94]) }),
  mirror: Object.freeze({
    optimistic: Object.freeze({ trudgian: 0.2568, sawtooth: 0.2424, E2: 0.1669, Ereq02: 3.363, EreqLane: 1.209, n1Sawtooth: 0.1971, n1Ereq02: 7.413, n1EreqLane: 3.422 }),
    pessimistic: Object.freeze({ trudgian: 0.3374, sawtooth: 0.3260, E2: 0.2628, Ehalf: 0.2200, E0: 0.2038 }),
  }),

  refereeKilled: Object.freeze([
    'headline "no pointwise S(T) input can get mirror descent below 0.2 at the seam": holds only in the pessimistic-weight model',
    'E = 0 → 0.2038 presented as robust: a 0.0038 margin in an ad hoc worst-case kernel; robust figures are E ≥ 1/2 → 0.2200',
    'headline not conditional on the Trudgian 2011 constant; comparison set limited to T ≥ e constants (height tables unchecked)',
    'counting-ceiling "proved" is exact only in the continuous relaxation',
    'Odlyzko windows labelled by zero index instead of height',
  ]),
  nextStep: '(1) Check Trudgian 2011 (2.067 + 0.059 log t2), Trudgian 2014 (+2.510 vs the repo\'s +3.385), Hasanalizade–Shen–Wong and Bellotti–Wong, '
    + 'including height-restricted tables. (2) If they hold, use min(E_Tru, E_saw) where S_Tru feeds local density floors; no verdicts change. '
    + '(3) Optional: a Hiary–Patel–Yang-based S_1 constant (≈ 10% on E_saw; no Λ effect).',
  files: Object.freeze(['tmp/routes-b1-r49-sawtooth.py', 'tmp/routes-b1-r49-sawtooth-out.json', 'tmp/routes-b1-r49-mirror.py', 'tmp/routes-b1-r49-mirror-out2.json',
    'tmp/routes-b1-r49-s1emp.py', 'tmp/routes-b1-ref49-check.py', 'tmp/routes-b1-ref49-mirror-check.py', 'src/data/rh-bridge-mirror-descent-2026-09-25.js']),
  verdict: 'Small constant gain, no Λ lever. The sawtooth lemma (proved, elementary; numerics conditional on Trudgian 2011) improves |S(T)| by '
    + '9–17% for 1e11–1e17 and up to T ≈ 1.8e29, asymptotically weaker (0.137 vs 0.112 log T). Mirror descent cannot use it: the optimistic '
    + 'all-real model needs E ≤ 3.363 (proved 5.675) and that model is close to circular; pessimistic weights stay above 0.2 even at E = 0. '
    + 'The lever remains the pointwise σ < 1 / NS-RIGID input. No refereed bound is changed; 0.1758354 and 0.1787854 remain computer-assisted '
    + 'candidates; RH open; NO QED.',
});

const R = ROUTE_49;

export const ROUTE_49_ASSERTIONS = Object.freeze([
  {
    id: 'r49-esaw-table',
    holds: () => R.table.every(({ T, saw, tru }) => { const e = Esaw(T); return e <= saw + 1e-9 && saw - e < 2e-4 && Math.abs(E2014(T) - tru) < 2e-4 && e < tru; }),
    why: 'Live: E_saw = max over the two sawtooth sides of min_δ, rounded up to 4 decimals, reproduces every row and lies below Trudgian 2014.',
  },
  {
    id: 'r49-gain-band',
    holds: () => { const g = R.table.filter((h) => h.T >= 1e11 && h.T <= 1e17).map((h) => 1 - h.saw / h.tru); return Math.min(...g) > 0.088 && Math.max(...g) < 0.17; },
    why: 'Relative gain over Trudgian 2014 is 9–17% for T in 1e11–1e17.',
  },
  {
    id: 'r49-crossover-and-asymptotics',
    holds: () => { let a = 40, b = 100; for (let i = 0; i < 50; i++) { const m = (a + b) / 2; if (Esaw(Math.exp(m)) < E2014(Math.exp(m))) a = m; else b = m; }
      return Math.abs(a - R.crossoverLogT) < 0.01 && Math.abs(Math.sqrt(0.059 / Math.PI) - R.asymptoticCoeff) < 1e-4 && R.asymptoticCoeff > R.trudgianCoeff; },
    why: 'The sawtooth bound beats Trudgian 2014 up to log T = 67.35 (T ≈ 1.8e29) and is asymptotically weaker (√(0.059/π) = 0.1370 > 0.112).',
  },
  {
    id: 'r49-seam-counting',
    holds: () => { const s = sawtooth(3e12); const err = s.up + s.lo; const r = rho(3e12);
      return Math.abs(err - R.seam.countErr) < 0.01 && Math.abs(err / r - R.seam.gap) < 1e-3
        && Object.entries(R.seam.countLower).every(([Hh, v]) => Math.abs(r * Number(Hh) - err - v) < 0.01) && R.seam.gap < R.seam.gapTrudgian; },
    why: 'At 3e12: count error ≤ 11.35, zero-free gap ≤ 2.652 (Trudgian route 3.113); certified counts ρH − err = −2.79 / 10.05 / 31.45 for H = 2 / 5 / 10.',
  },
  {
    id: 'r49-mirror-thresholds',
    holds: () => { const o = R.mirror.optimistic, p = R.mirror.pessimistic, e = R.table[1].saw;
      return e > o.Ereq02 && o.Ereq02 > o.EreqLane && o.sawtooth > 0.2 && o.E2 < 0.2 && o.n1Ereq02 > R.table[4].saw
        && [p.E0, p.Ehalf, p.E2, p.sawtooth, p.trudgian].every((x, i, arr) => x > 0.2 && (i === 0 || x > arr[i - 1]))
        && Math.abs(p.E0 - 0.2 - 0.0038) < 1e-4 && R.odlyzko.sRange < o.Ereq02; },
    why: 'Seam: proved E = 5.675 > 3.363 needed (optimistic) > 1.209 for the lane; pessimistic Λ_formal > 0.2 for every E ≥ 0 (0.2038 at E = 0); observed |S| ≈ 2 is below 3.363 only in the all-real model.',
  },
  {
    id: 'r49-odlyzko-labels',
    holds: () => R.odlyzko.heights.every((h, i) => h < R.odlyzko.zeroIndex[i]) && R.odlyzko.maxDeltaS1.every((x, i) => x < R.odlyzko.A[i])
      && R.odlyzko.heights.every((h, i) => Math.abs(A2011(h) - R.odlyzko.A[i]) < 0.01),
    why: 'Windows are labelled by height (2.68e11, 1.44e20, 1.37e21), with A_2011 at those heights 3.62 / 4.81 / 4.94 above the observed max |ΔS_1| ≈ 1.48.',
  },
  {
    id: 'r49-honest-scope',
    holds: () => /Trudgian's 2011/.test(R.headline) && /pessimistic-weight/.test(R.headline) && /refereed bound is changed/i.test(R.verdict) && /NO QED/.test(R.verdict),
    why: 'Headline conditional on the quoted constant and model-dependent; no Λ change; no QED.',
  },
]);

export default ROUTE_49;
