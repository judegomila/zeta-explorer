/**
 * @fileoverview route-35-certified-li-coefficients-2026-10-13 — roadmap route 35 (batch 8, group F): certified Li coefficients to large n,
 * compared with Keiper–Li asymptotics. Mapping / calibration result. One run plus one adversarial internal referee pass with a separately
 * coded Arb computation (not refuted; severity minor: convention-dependent constant, attribution, selective decomposition, wrong bucket).
 * Corrections applied below.
 *
 * PROVED: nothing new. Formula checks (re-derived by the referee): λ_n = n[z^n] log ξ(1/(1−z)); ξ(s) = (s−1)π^{−s/2}Γ(1+s/2)ζ(s), ξ(0) = 1/2;
 *  osc_1 = λ_1 − λ_1^arch = γ_E exactly (ψ(3/2) = 2 − γ_E − 2 log 2).
 * CERTIFIED (Arb ball arithmetic, FLINT 3.6; the C program reproduces the Arb/FLINT keiper_li example by F. Johansson — a reproduction, not an
 *  independent method): λ_n > 0 for EVERY 1 ≤ n ≤ 10^4 (arb_is_positive on all 10^4 balls; largest radius 1.5e-189 at n = 10^4; 10764 bits, 180 s,
 *  3.9 GB). λ_1 = 0.02309570896612103381431… (the minimum), λ_100 = 118.60377537679133, λ_1000 = 2326.0531616864664574, λ_10000 =
 *  34736.579732241613740. Runs at 4344 and 10764 bits agree on all 40 printed digits for n ≤ 4000. Referee: a second, separately coded Arb
 *  computation (python-flint, expansion at s = 1/(1−z) with the deflated zeta, no functional equation, no compose step) certifies λ_n > 0 for
 *  n ≤ 8500 and agrees with the run to all 35 printed digits (max relative difference 4.9e-35); λ^arch agrees to 5e-21. The archimedean part
 *  λ_n^arch = n[z^n](lgamma(1+s/2) − (s/2)log π) at s = 1/(1−z) is enclosed for n ≤ 10^4, so osc_n = λ_n − λ_n^arch is certified
 *  (osc_2000 = +10.7685, osc_10000 = −12.5651).
 * CONDITIONAL: the openai/math family-003 zero-free region Re s > 7/8 (claimed, Lean-formalised, rebuilt in the repo) gives only
 *  |1 − 1/ρ|² ≤ 1 + O(1/γ²): no all-n Li positivity, no route to RH. RH ⇔ λ_n ≥ 0 for ALL n (Li; Bombieri–Lagarias).
 * MEASURED: zero-sum cross-check Σ 2(1 − cos nθ_γ), θ_γ = 2 arctan(1/(2γ)), over 10^6 Odlyzko zeros + tanh-sinh smooth tail + boundary term
 *  (N(T) − N_0(T) = 0.4287), error bar Trudgian 4.72·f(T): max deviation 4.19e-8 at n = 9800 over 396 values of n (bar up to 1.31e-3).
 *  Archimedean asymptotics, WITH THE Γ(1+s/2) SPLIT: λ_n^arch − [(n/2)log n + c·n] = 3/4 − 1/(24n) + O(n⁻²) (fitted, not derived from
 *  Stirling; deviation ≈ 4e-9 at n = 100), c = (γ_E − 1 − log 2π)/2 = −1.1303307007539063 (intrinsic). With the Γ(s/2) split the constant is
 *  −1/4 (the two splits differ by n[z^n] log(s/2) = 1 for n ≥ 1): the constant term is convention-dependent. osc_n: dyadic-window maxima
 *  0.87 … 19.32 = (0.15–0.26)·√n_max; envelope growth exponents average 0.497 but range 0.04–1.09 (last window [8192, 10^4] is not a doubling);
 *  99 sign changes, osc < 0 for 3741 n ≤ 10^4, window means +0.59…+1.34. Decomposition of osc_n by zero cutoff (detrend {1, n, n log n, n²}) is
 *  NOT stable: on n ∈ [100, 1000] R² = 0.71 (γ ≤ 26), 0.003 (γ ≤ 50), −10.1 (γ ≤ 100), 0.992 (γ ≤ 1000, coefficient 1.002); on [1000, 10^4]
 *  0.81 (γ ≤ 100), −99 (γ ≤ 500), −873 (γ ≤ 1000). Only the γ ≤ 1000 / n ≤ 1000 point is a clean confirmation.
 * HEURISTIC / SKETCH (unconditional, not 'conditional'): RH verified to height T (3e12, Platt–Trudgian) plus zero-counting bounds implies
 *  λ_n > 0 for n well below T² (pairing ρ with 1 − ρ̄ makes the tail above T O(n² log T/T)); an off-line zero contributes ≈ exp(n(1−2β)/(2γ²))
 *  only once n ≳ γ² log n ≈ 10^25; not made rigorous here. √n vs √n log n cannot be told apart at n ≤ 10^4. Runtime ~n^2.7 / memory ~n²
 *  unverified; the "1.05n bits" figure is specific to the s = 0 + compose path (the deflated-zeta path needs ≈ 0.54n + O(1) bits: referee N = 8500
 *  at 5900 bits, 83 s, 4.4 GB), so n = 2·10^4 is cheaper than the stated 15 GB.
 *
 * Literature (recall, not checked online): Johansson's 2015 rigorous Hurwitz-zeta paper reports λ_n for n ≤ 10^5 — the n ≤ 10^4 range here
 * is not new. Tagged [map]; no Λ bound moves. PT Lambda <= 0.2 stands; RH open; NO QED. Import-free. ROUTE_35_ASSERTIONS recompute live: λ_1
 * and osc_1 = γ_E, c, λ_n^arch for n ≤ 60 from Hurwitz-zeta Taylor coefficients (matching the Arb file) and its 3/4 − 1/(24n) law, the exact
 * −1 shift to the Γ(s/2) convention, λ_1…λ_3 from 31 zeros + tail, osc_10000, and the envelope ratios.
 */

const { abs, sqrt, log, atan, cos, PI } = Math;

export const ROUTE_35 = Object.freeze({
  id: 'route-35-certified-li-coefficients-2026-10-13',
  route: 35,
  date: '2026-10-13',
  title: 'Route 35: Li coefficients certified positive for every n ≤ 10^4 (Arb; reproduces Johansson\'s keiper_li) — calibration data, not an RH route',
  status: 'done',
  headline: 'Arb certifies λ_n > 0 for every 1 ≤ n ≤ 10,000 (largest radius 1.5e-189); a separately coded Arb run confirms n ≤ 8500 to 35 digits '
    + 'and a 10^6-zero sum matches to 4.2e-8. With the Γ(1+s/2) split, λ_n = (n/2)log n + c·n + 3/4 + osc_n + O(1/n) (the constant is −1/4 with '
    + 'Γ(s/2)), and |osc_n| ≈ (0.15–0.26)·√n. This reproduces the Arb keiper_li example (Johansson; n ≤ 10^5 reported in 2015, per recall).',
  lambda: Object.freeze({ 1: 0.02309570896612103381431, 2: 0.09234573522804667038572848619206788677413, 3: 0.2076389205543248037914920466178032069826,
    100: 118.60377537679133, 1000: 2326.0531616864664574, 10000: 34736.579732241613740 }),
  arch: Object.freeze({ 1: -0.554119955935411826792201842176, 2: -0.874539361734653826230092309367, 20: 8.09862405929422426763913298525,
    50: 42.0332068028135289605436850993, 100: 117.975022561543123777627759959, 10000: 34749.1448481751839030890921602 }),
  maxRadius: 1.5006e-189,
  osc: Object.freeze({ 2000: 10.7685, 10000: -12.5651159336 }),
  c: -1.1303307007539063115,
  refereeConventionResidual: Object.freeze({ n: 1000, gamma1PlusHalfS: 0.74996, gammaHalfS: -0.25004 }),
  zeroSum: Object.freeze({ maxDev: 4.19e-8, atN: 9800, nValues: 396, maxBar: 1.31e-3, DT: 0.4287 }),
  envelope: Object.freeze({ windows: Object.freeze([[16, 32], [32, 64], [64, 128], [128, 256], [256, 512], [512, 1024], [1024, 2048], [2048, 4096], [4096, 8192], [8192, 10000]]),
    maxAbs: Object.freeze([0.87, 1.51, 2.29, 3.85, 3.96, 8.43, 11.12, 13.52, 18.19, 19.32]),
    growthExponents: Object.freeze([0.791, 0.599, 0.749, 0.0395, 1.090, 0.400, 0.282, 0.428, 0.0868]) }),
  signs: Object.freeze({ changes: 99, negative: 3741 }),
  decompositionR2: Object.freeze({ low: Object.freeze([[26, 0.71], [50, 0.003], [100, -10.1], [1000, 0.992]]), high: Object.freeze([[100, 0.81], [500, -99], [1000, -873]]) }),
  bits: Object.freeze({ composePath: Object.freeze([[4000, 4344], [10000, 10764]]), deflatedPath: Object.freeze([[6500, 5000], [8500, 5900]]) }),

  refereeKilled: Object.freeze([
    'constant 3/4 is convention-dependent (Γ(1+s/2) split; −1/4 with Γ(s/2), checked at n = 100, 1000, 3000) and fitted, not derived; residual deviates ≈ 4e-9 from 3/4 − 1/(24n) at n = 100',
    'attribution: method and file name reproduce the Arb/FLINT keiper_li example (Johansson); his 2015 paper reports n ≤ 10^5 (recall) — a reproduction, not an "own program" or new range',
    'osc decomposition reported selectively: R² is non-monotone and negative at intermediate cutoffs (−10.1, −99, −873); only γ ≤ 1000 / n ≤ 1000 (0.992) is clean',
    'envelope growth exponents range 0.04–1.09 (mean 0.497); last window not a doubling; "consistent with O(√n log n)" is very weak evidence',
    'wrong bucket: "λ_n > 0 for n ≤ 10^4 follows from RH verified to 3e12" is an unconditional sketch, not conditional; the sketch omits pairing ρ with 1 − ρ̄',
    'resource claim method-specific: deflated-zeta expansion needs ≈ 0.54n bits (N = 8500 at 5900 bits, 83 s, 4.4 GB), so n = 2·10^4 needs less than 15 GB',
    'runtime ~n^2.7 and memory ~n² scalings not verified',
  ]),
  nextStep: 'Go past n = 10^4 with the deflated-zeta expansion at s = 1/(1−z) (≈ 0.54n bits; n = 2·10^4 at ≈ 11k bits) on a machine with ≥ 16 GB '
    + 'free, or cite Johansson\'s n ≤ 10^5 data; optional: turn the "RH to height T ⇒ λ_n > 0 for n ≪ T²" sketch into an explicit, interval-checked '
    + 'tail bound (with the ρ ↔ 1 − ρ̄ pairing).',
  files: Object.freeze(['tmp/routes-b8-r35-li/keiper_li.c', 'tmp/routes-b8-r35-li/li_arch.c', 'tmp/routes-b8-r35-li/li_N10000.txt', 'tmp/routes-b8-r35-li/li_N4000.txt',
    'tmp/routes-b8-r35-li/li_arch_N10000.txt', 'tmp/routes-b8-r35-li/zerosum_check.py', 'tmp/routes-b8-r35-li/zerosum.json', 'tmp/routes-b8-r35-li/analysis.json',
    'tmp/routes-b8-r35-li/osc_decomp2.json', 'tmp/routes-b8-ref35-indep.py', 'tmp/routes-b8-ref35-indep-{200,1500,5000,6500,8500}.txt']),
  verdict: 'Mapping / calibration result; no lever on RH. λ_n > 0 is Arb-certified for every n ≤ 10^4 (reproducing Johansson\'s keiper_li; '
    + 'a separately coded Arb run confirms n ≤ 8500, and a 10^6-zero sum agrees to 4e-8). With the Γ(1+s/2) split the archimedean part is '
    + '(n/2)log n + c·n + 3/4 − 1/(24n) (constant convention-dependent: −1/4 with Γ(s/2)), and the arithmetic part osc_n grows like ≈ 0.2·√n, '
    + 'which fits RH but cannot distinguish √n from √n log n. Positivity on any finite range is weaker than what the verified zero height already '
    + 'implies (unconditional sketch). Internal, one referee pass. No Λ bound moves. PT Lambda <= 0.2 stands; RH open; NO QED.',
});

const R = ROUTE_35;
const EG = 0.5772156649015329;
const ZEROS31 = Object.freeze([14.134725142, 21.022039639, 25.01085758, 30.424876126, 32.935061588, 37.586178159, 40.918719012, 43.327073281,
  48.005150881, 49.773832478, 52.970321478, 56.446247697, 59.347044003, 60.831778525, 65.112544048, 67.079810529, 69.546401711, 72.067157674,
  75.704690699, 77.144840069, 79.33737502, 82.910380854, 84.735492981, 87.425274613, 88.809111208, 92.491899271, 94.651344041, 95.870634228,
  98.831194218, 101.317851006, 103.72553804]);
// Hurwitz ζ(k, a), k ≥ 2, by Euler–Maclaurin (30 terms + 7 Bernoulli corrections)
const hurwitz = (k, a) => { const M = 30; let s = 0; for (let m = 0; m < M; m += 1) s += (a + m) ** -k; const x = a + M; s += x ** (1 - k) / (k - 1) + 0.5 * x ** -k;
  const B = [1 / 6, -1 / 30, 1 / 42, -1 / 30, 5 / 66, -691 / 2730, 7 / 6]; let fact = 1; let rising = k;
  for (let j = 1; j <= 7; j += 1) { if (j > 1) rising *= (k + 2 * j - 3) * (k + 2 * j - 2); fact *= (2 * j - 1) * (2 * j); s += (B[j - 1] / fact) * rising * x ** (-k - 2 * j + 1); } return s; };
// λ_n^arch = n Σ_k b_k C(n−1, k−1), b_k = Taylor coefficients of lgamma(shift + s/2) − (s/2)log π at s = 1 (shift 1: Γ(1+s/2); shift 0: Γ(s/2))
const lambdaArch = (n, shift = 1) => { const a = shift === 1 ? 1.5 : 0.5; const psi = shift === 1 ? 2 - EG - 2 * log(2) : -EG - 2 * log(2);
  const b = [0, psi / 2 - log(PI) / 2]; for (let k = 2; k <= n; k += 1) b.push(((-1) ** k * hurwitz(k, a)) / (k * 2 ** k));
  let s = 0; let C = 1; for (let k = 1; k <= n; k += 1) { s += b[k] * C; C = (C * (n - k)) / k; } return n * s; };
const law = (n) => (n / 2) * log(n) + R.c * n + 0.75 - 1 / (24 * n);
const N0 = (T) => ((T / 2) * log(T / (2 * PI)) - T / 2 - PI / 8 + 1 / (48 * T)) / PI + 1;

export const ROUTE_35_ASSERTIONS = Object.freeze([
  {
    id: 'r35-lambda1-and-osc1',
    holds: () => { const lam1 = 1 + EG / 2 - log(4 * PI) / 2; const arch1 = (2 - EG - 2 * log(2)) / 2 - log(PI) / 2;
      return abs(lam1 - R.lambda[1]) < 1e-16 && abs(arch1 - R.arch[1]) < 1e-15 && abs(lam1 - arch1 - EG) < 1e-15 && abs((EG - 1 - log(2 * PI)) / 2 - R.c) < 1e-15; },
    why: 'λ_1 = 1 + γ_E/2 − log(4π)/2 = 0.0230957089661210; λ_1^arch = ψ(3/2)/2 − log(π)/2 = −0.5541199559354118; osc_1 = γ_E exactly; c = (γ_E − 1 − log 2π)/2.',
  },
  {
    id: 'r35-archimedean-law-live',
    holds: () => [[2, 1e-14], [20, 1e-12], [50, 1e-9]].every(([n, tol]) => abs(lambdaArch(n) - R.arch[n]) < tol)
      && [20, 30, 40, 50, 60].every((n) => abs(lambdaArch(n) - law(n)) < 3e-6) && abs(R.arch[100] - law(100)) < 1e-8 && abs(R.arch[10000] - law(10000)) < 1e-8,
    why: 'λ_n^arch from Hurwitz-zeta Taylor coefficients at s = 1 composed with s − 1 = z/(1−z) (live, n ≤ 60) matches the Arb file (n = 2, 20, 50) and satisfies (n/2)log n + c·n + 3/4 − 1/(24n) to < 3e-6; the stored Arb values at n = 100 and 10^4 satisfy it to < 1e-8.',
  },
  {
    id: 'r35-constant-is-convention',
    holds: () => [1, 2, 5, 10, 15].every((n) => abs(lambdaArch(n, 0) - lambdaArch(n, 1) + 1) < 1e-9)
      && abs(R.refereeConventionResidual.gamma1PlusHalfS - R.refereeConventionResidual.gammaHalfS - 1) < 1e-4,
    why: 'log Γ(1 + s/2) = log(s/2) + log Γ(s/2) and n[z^n] log s at s = 1/(1−z) equals 1, so the Γ(s/2) split shifts every λ_n^arch by exactly −1 (live, n = 1…15; the Γ(s/2) Taylor series loses ≈ n log10 2 digits in double precision): constant 3/4 ↔ −1/4 (referee 0.74996 vs −0.25004 at n = 1000).',
  },
  {
    id: 'r35-li-from-zeros',
    holds: () => { const T = (ZEROS31[29] + ZEROS31[30]) / 2; const z = ZEROS31.slice(0, 30);
      return [1, 2, 3].every((n) => { const head = z.reduce((s, g) => s + 2 * (1 - cos(2 * n * atan(1 / (2 * g)))), 0);
        const tail = (n * n * (log(T / (2 * PI)) + 1)) / (2 * PI * T) - ((n * n) / (T * T)) * (30 - N0(T)); return abs(head + tail - R.lambda[n]) < 2e-6 * n * n; }); },
    why: 'λ_n = Σ_{γ>0} 2(1 − cos nθ_γ), θ_γ = 2 arctan(1/(2γ)): 30 zeros + smooth tail n²(log(T/2π) + 1)/(2πT) + boundary term reproduce the certified λ_1, λ_2, λ_3 to < 2e-6·n².',
  },
  {
    id: 'r35-certified-values-and-osc',
    holds: () => { const L = R.lambda; const oscTop = L[10000] - R.arch[10000];
      return [1, 2, 3, 100, 1000, 10000].every((n) => L[n] > 0) && L[1] < L[2] && abs(oscTop - R.osc[10000]) < 1e-9 && abs(L[10000] - law(10000) - R.osc[10000]) < 1e-6
        && R.maxRadius < 1e-188 && R.zeroSum.maxDev < R.zeroSum.maxBar / 1e4 && R.bits.composePath.every(([n, b]) => b / n > 1.05)
        && R.bits.deflatedPath.every(([n, b]) => b / n < 0.8); },
    why: 'Certified λ_n > 0 (λ_1 the minimum); osc_10000 = λ − λ^arch = −12.5651159 (also from the 3/4 − 1/(24n) law); zero-sum deviation 4.2e-8 ≪ bar 1.3e-3; compose path uses > 1.05n bits, deflated path < 0.8n.',
  },
  {
    id: 'r35-envelope-and-decomposition',
    holds: () => { const e = R.envelope; const ratios = e.maxAbs.map((m, i) => m / sqrt(e.windows[i][1])); const g = e.growthExponents;
      const meanG = g.reduce((a, b) => a + b, 0) / g.length; const d = R.decompositionR2;
      return ratios.every((r) => r > 0.15 && r < 0.27) && abs(meanG - 0.497) < 0.005 && Math.min(...g) < 0.05 && Math.max(...g) > 1.05
        && d.low.some(([, r2]) => r2 < 0) && d.high.some(([, r2]) => r2 < 0) && d.low[3][1] > 0.99; },
    why: 'max|osc|/√n_max ∈ (0.15, 0.27) in all 10 windows; envelope exponents average 0.497 but span 0.04–1.09; the zero-cutoff decomposition has negative R² at intermediate cutoffs, only γ ≤ 1000 on n ≤ 1000 is clean (0.992).',
  },
  {
    id: 'r35-honest-scope',
    holds: () => R.status === 'done' && /Johansson/.test(R.verdict) && /convention-dependent/.test(R.verdict) && /unconditional sketch/.test(R.verdict)
      && /PT Lambda <= 0\.2 stands/.test(R.verdict) && /NO QED/.test(R.verdict) && R.refereeKilled.length === 7,
    why: 'Calibration data; reproduction credited; constant convention-dependent; finite-range positivity weaker than the verified height; no Λ change; no QED.',
  },
]);

export default ROUTE_35;
