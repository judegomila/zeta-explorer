/**
 * @fileoverview route-16-alpoge-furman-twin-ladder-2026-10-10 — roadmap route 16 (batch 5): numerical reproduction of the
 * Alpöge–Furman ≥ 2/3 argument (arXiv:2608.13637, preprint) and its translation into twin-ladder / NS-RIGID terms.
 * One run plus one adversarial internal referee pass (not refuted; severity minor); the referee corrections are applied below.
 *
 * The argument is not a mollifier computation. It is Montgomery's pair-correlation second moment, a rank–trace inequality and
 * Sylvester inertia, applied to a Gabor compression G of Weil's Hermitian form (family φ(u)e^{iα_k u}, support [−L/2, L/2],
 * L = log(T/2π), dimension d ~ N(T, 2T)). The route implemented that computation.
 *
 * PROVED (re-checked, elementary): Lemma 3.2 (rank–trace inequality; von Neumann trace step, x² ≥ 2x − 1, q² ≥ 4q − 4; equality case
 *  P = Π1, Q = 2Π2 has zero slack); the §6 chain and the part (ii) rearrangement 3s1 + 4(s2 + p) ≥ 4 tr G − ‖G‖²; closed forms
 *  R(ψ0) = 4/3, R(ψMT) = 1/2 + (1/√2)cot(1/√2) = 1.32749929632, so 2 − R = 0.672500703679 (= Lamzouri C0) and (3 − R)/2 = 0.836250351840;
 *  Lamzouri C2 = (1 + 2√2 + 2C0)/(3 + 2√2) = 0.88762000817; Remark 6.1: R_λ(ψ0) = 1/λ + λ/3, so H(λ) = 2 − 1/λ − λ/3 increases on (0, 1];
 *  §7.2(f): moments 1, 1, 4/3, 2, 13/4 give the Christoffel value Λ_2(0) = 5/36 exactly and 1 − 2Λ_2(0) = 13/18.
 * CERTIFIED: nothing (all numerics are double precision).
 * CONDITIONAL: the 13/18 under HL*(4) and "HL*(k) for all k gives 100%" are conditional statements of the paper (only their arithmetic
 *  reproduced). The twin-ladder translation leans on NS-RIGID (imp-95530), itself internal-referee only. The paper is a preprint
 *  (Lamzouri's independent proof arXiv:2609.02882 likewise); the peer-reviewed proportion record remains PRZZ 5/12.
 * MEASURED: explicit formula (2.11) Gram entries at T = 1000 to relative 1e-12 … 3e-10 (referee 1e-11 … 2e-9); Poisson–Gabor identity
 *  to 1e-12 including complex points; tr G = N(T, 2T) ± 1 for T = 1e3 … 2.9e5; Theorem 5.7 Frobenius main term vs zero side to 7e-4
 *  (1e3) … 1e-6 (2.9e5), e.g. ψ0 at 2.9e5: 1.415094 vs 1.415095 (referee independent build 1.41509410); finite-height ratio → R like
 *  1/L (continuum 1.3825 / 1.3425 / 1.3334 at L = 20 / 100 / 1e4); certificate values (below, both N(I) and N(I′) forms); bandwidth
 *  test (λ = 0.5, 0.75 give −0.67, 0.23 against 0.585 at λ = 1); 21 synthetic off-line configurations obey the inertia bound;
 *  optimal even window R_min = 1.3274992 with minimiser cos(√2 s) to 1.5e-8; Lemma 3.2 stress test min slack −8.9e-16 (rounding).
 *  §7.2(f) moments: on the real zeros only a finite-height trend (2.309, 3.967 at T = 3e4, still 0.31 and 0.72 above 2 and 13/4);
 *  the referee's CUE Monte Carlo (n = 200, 300 samples) gives 1, 1.3320 ± 0.0013, 1.9966 ± 0.0043, 3.2439 ± 0.0114, confirming 4/3, 2, 13/4.
 * HEURISTIC: twin-ladder placement. G is the Weil form on a height-localised Gabor family of growing dimension; NS-RIGID's native span
 *  E_V(S) (real-node exponentials, fixed dimension, height-blind Pick vectors) cannot count zeros in [T, 2T). The input outside the
 *  native span is the prime-side second moment (quartic in the test functions, Montgomery–Vaughan mean square of the critical-line
 *  Dirichlet polynomial), combined with signature counting (inertia) instead of positivity, so NS-RIGID (A4)'s PD-or-RH-false
 *  dichotomy does not apply. Limits: the same inputs hold for Davenport–Heilbronn and Epstein zeta (RH false there); bandwidth-one
 *  ceiling ≈ 0.682 (not reproduced); beyond Fourier support 1 even all of HL gives 100% of zeros, not every zero.
 *
 * Errata to the paper (harmless for Theorem A): (1) §2.2 "d = N(T, 2T) + O(L)" is false: d/N = L/(L + 2 log 2 − 1) (0.96528 at 2.9e5);
 *  §7.2 repeats it ("rank P ≤ d = N(T,2T) + O(1)"); only d = N(1 + o(1)) is used. (2) Prop 5.2 error O(N log L / L²) should read
 *  O(N log L / L) per the proof's own E2 bound; Theorem 5.7's O(1/L) then reads O(log L / L) (text-level, from the extracted PDF).
 *  Citation discrepancy unresolved: AF cite 0.6603 [Wu15] for distinct zeros, Lamzouri credits Ki–Lee 2012 with > 70%.
 *
 * No Λ bound moves. No refereed bound is changed; RH open; NO QED. Import-free. ROUTE_16_ASSERTIONS recompute the window constants, C2,
 * the Christoffel value and extreme measure, the λ-law, d/N, the N(I)/N(I′) certificate gap, the 1/L convergence and the CUE moments live.
 */

const { sqrt, tan, log, floor, PI } = Math;

export const ROUTE_16 = Object.freeze({
  id: 'route-16-alpoge-furman-twin-ladder-2026-10-10',
  route: 16,
  date: '2026-10-10',
  title: 'Route 16: Alpöge–Furman ≥ 2/3 reproduced numerically (heights 1e3–2.9e5) and placed in twin-ladder terms',
  status: 'done',
  headline: 'The Alpöge–Furman mechanism (Weil form compressed to a height-localised Gabor family; Montgomery second moment; rank–trace '
    + 'inequality; Sylvester inertia) reproduces at heights 1e3 to 2.9e5. The checked inputs agree numerically or exactly; no substantive gap '
    + 'found; two harmless errata and one citation discrepancy. The input outside NS-RIGID\'s native span is the prime-side second moment '
    + 'over a family whose dimension grows like N(T, 2T), used with signature counting rather than positivity.',

  constants: Object.freeze({ RpsiMT: 1.32749929632059, Rpsi0: 4 / 3, simpleOnLine: 0.672500703679, distinct: 0.836250351840,
    lamzouriC2: 0.88762000817, christoffel: 5 / 36, conditionalHL4: 13 / 18, ceilingBandwidthOne: 0.682, optimalWindowRmin: 1.3274992 }),
  // §7.2(f) extreme measure with a node at 0 (referee and route agree to 4 digits)
  extremeMeasure: Object.freeze({ nodes: Object.freeze([0, 0.84064, 1.78436]), weights: Object.freeze([5 / 36, 0.56853, 0.29258]) }),
  momentsClaimed: Object.freeze([1, 1, 4 / 3, 2, 13 / 4]),
  momentsZeros3e4: Object.freeze([1, 1.441, 2.309, 3.967]),
  momentsCUE: Object.freeze([[1, 0], [1.3320, 0.0013], [1.9966, 0.0043], [3.2439, 0.0114]]),
  // Frobenius ratio ‖G‖²/N(I): zero side vs prime-side main term (ψ0, w = 1)
  frobenius: Object.freeze([
    Object.freeze({ T: 1e3, zero: 1.5505237, relErr: 7e-4 }), Object.freeze({ T: 1e4, zero: 1.4619386, relErr: 7e-5 }),
    Object.freeze({ T: 1e5, zero: 1.42545013, relErr: 3e-6 }), Object.freeze({ T: 2.9e5, zero: 1.41509410, prime: 1.415095, relErr: 1e-6 }),
  ]),
  continuumMainTerm: Object.freeze([[20, 1.3825], [100, 1.34247], [1e4, 1.33342]]),
  // Certificate (4 tr G − 2N − ‖G‖²)/N(I) at T = 2.9e5. N(I) form = route's headline; N(I′) form = the paper's §6 chain (referee).
  certificate: Object.freeze([
    Object.freeze({ window: 'psi0', w: 1, NI: 0.5849, NIprime: 0.5775, asymptotic: 2 / 3, paperParameters: true }),
    Object.freeze({ window: 'psi0', w: 0.3, NI: 0.639, NIprime: 0.6317, asymptotic: 2 / 3, paperParameters: false }),
    Object.freeze({ window: 'psiMT', w: 0.3, NI: 0.643, NIprime: 0.6353, asymptotic: 0.6725, paperParameters: false }),
  ]),
  bandwidth: Object.freeze([[0.5, -0.67], [0.75, 0.23], [1, 0.585]]),
  dOverN: Object.freeze({ T: 2.9e5, d: 495692, N: 513523, ratio: 0.96528 }),
  offlineConfigs: Object.freeze({ count: 21, inertiaHolds: 21, traceAtT1000: 867.4, maxFrobeniusRatio: 2.41 }),
  lemma32: Object.freeze({ randomCases: 20000, adversarial: 295, minSlack: -8.9e-16 }),

  refereeKilled: Object.freeze([
    'headline certificate values 0.585 / 0.639 / 0.643 used N(I) in the −2N term; the paper\'s §6 chain uses N(I′): 0.5775 / 0.6317 / 0.6353 (gap 2(N(I′) − N(I))/N(I) ≈ 0.0074, vanishing asymptotically) — both forms now quoted, both main-term measurements, not finite-height theorems',
    'w = 0.3 runs are not "the stated parameters": the paper fixes w := 1 (§5.1); w = 0.3 is an admissible rescaled χ (Theorem A still applies) but a variant window',
    '§7.2(f) "moments decreasing toward 1, 4/3, 2, 13/4" was only a finite-height trend (2.309, 3.967 at 3e4); the claim is confirmed by the referee\'s CUE Monte Carlo, not by the route',
    '"record is now pair correlation 0.6725" needs the qualifier: Alpöge–Furman and Lamzouri are preprints; the peer-reviewed record remains PRZZ 5/12',
    '"every input checks numerically" too broad: off-diagonal prime terms O1, O2 and the Prop 5.4–5.5 cross terms checked only through the 1e-6 aggregate; Theorem B, the ξ′ constants 0.85838 / 0.92919, Remark 7.2 and the 0.682 ceiling not reproduced',
    'Erratum 1 incomplete: §7.2 repeats the d = N + O(1) slip; asymptotically d = N(1 − (2 log 2 − 1)/L + …)',
  ]),
  nsRigidWording: 'The class NS-RIGID leaves open now holds an unconditional (preprint, internally refereed) 2/3, or 0.6725 with the ψMT window, '
    + 'for simple on-line zeros, via a Weil-form Gabor compression plus Montgomery\'s second moment plus inertia. The peer-reviewed record remains '
    + 'PRZZ 5/12. RH is open and PT Lambda <= 0.2 is unaffected.',
  nextStep: '(1) Update the NS-RIGID loophole text (src/data/imp-95530-native-span-arithmetic-input-rigidity.js lines ≈ 144–155: "Levinson-Conrey (≥ 41.7%)", '
    + '"has no object") with the wording above, preprint-qualified. (2) Reproduce the 0.682 bandwidth-one ceiling (Lean LawN256 data or an independent LP) '
    + 'and the ξ′ constants 0.85838 / 0.92919. (3) Flow-stability test: run the Gram construction on zeros of H_t, t < 0, with a substitute prime side, to see '
    + 'whether the certificate is RH-soft in the SL2 sense as well as in the Davenport–Heilbronn sense.',
  files: Object.freeze(['tmp/routes-b5-r16-lib.py', 'tmp/routes-b5-r16-constants.py', 'tmp/routes-b5-r16-cms.py', 'tmp/routes-b5-r16-explicit-check.py',
    'tmp/routes-b5-r16-zeroside.py', 'tmp/routes-b5-r16-primeside.py', 'tmp/routes-b5-r16-asym.py', 'tmp/routes-b5-r16-lambda.py', 'tmp/routes-b5-r16-offline.py',
    'tmp/routes-b5-r16-lemma32.py', 'tmp/routes-b5-r16-analyse.py', 'tmp/routes-b5-r16-out/route16-results.json', 'tmp/routes-b5-r16-out/zeroside.jsonl',
    'tmp/routes-b5-r16-out/summary.json', 'tmp/routes-b5-ref16-gram.py', 'tmp/routes-b5-ref16-explicit.py', 'tmp/routes-b5-ref16-checks.py',
    'tmp/routes-b5-ref16-cue-moments.py', 'tmp/routes-b5-ref16-gram.jsonl']),
  verdict: 'Reproduced. The Alpöge–Furman argument (preprint) rests on a Gabor compression of Weil\'s form, Montgomery\'s second moment, a rank–trace '
    + 'lemma and inertia; explicit-formula entries, trace count, prime-side Frobenius main term, Lemma 3.2, the inertia bound and the stated constants '
    + 'check numerically or exactly (off-diagonal prime terms only in aggregate; 0.682 ceiling and Theorem B not reproduced). At T = 2.9e5 the certificate '
    + 'is 0.5775 in the paper\'s N(I′) form (0.585 with N(I)), tending to 2/3 like 1/L — main-term measurements, not finite-height theorems. In twin-ladder '
    + 'terms the result sits in the class NS-RIGID leaves open (second moment over a height-localised compression of growing dimension, plus signature '
    + 'counting). The route cannot reach RH (ceiling ≈ 0.682 at bandwidth one; 100% only under hypotheses beyond Fourier support 1). No Λ bound moves. '
    + 'No refereed bound is changed; RH open; NO QED.',
});

const R = ROUTE_16;

// exact Fraction helpers (BigInt) for the Christoffel computation
const fr = (n, d = 1n) => { const g = (a, b) => (b === 0n ? (a < 0n ? -a : a) : g(b, a % b)); const s = d < 0n ? -1n : 1n; const k = g(n, d) || 1n; return [s * n / k, s * d / k]; };
const fmul = (a, b) => fr(a[0] * b[0], a[1] * b[1]);
const fadd = (a, b) => fr(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
const fsub = (a, b) => fadd(a, [-b[0], b[1]]);
const fdiv = (a, b) => fr(a[0] * b[1], a[1] * b[0]);
const det2 = (m) => fsub(fmul(m[0][0], m[1][1]), fmul(m[0][1], m[1][0]));
const det3 = (m) => fadd(fsub(fmul(m[0][0], det2([[m[1][1], m[1][2]], [m[2][1], m[2][2]]])),
  fmul(m[0][1], det2([[m[1][0], m[1][2]], [m[2][0], m[2][2]]]))), fmul(m[0][2], det2([[m[1][0], m[1][1]], [m[2][0], m[2][1]]])));

export const ROUTE_16_ASSERTIONS = Object.freeze([
  {
    id: 'r16-window-constants',
    holds: () => { const r = 0.5 + (1 / sqrt(2)) / tan(1 / sqrt(2)); const c0 = 2 - r;
      const cMT = sqrt(2) * tan(1 / sqrt(2)) / (1 + (1 / sqrt(2)) * tan(1 / sqrt(2)));
      return Math.abs(r - R.constants.RpsiMT) < 1e-12 && Math.abs(c0 - R.constants.simpleOnLine) < 1e-11
        && Math.abs((3 - r) / 2 - R.constants.distinct) < 1e-11 && Math.abs(1 / cMT - r) < 1e-12
        && Math.abs((1 + 2 * sqrt(2) + 2 * c0) / (3 + 2 * sqrt(2)) - R.constants.lamzouriC2) < 1e-10
        && Math.abs(R.constants.optimalWindowRmin - r) < 1e-6 && Math.abs(2 - R.constants.Rpsi0 - 2 / 3) < 1e-15 && r < R.constants.Rpsi0; },
    why: 'R(ψMT) = 1/2 + (1/√2)cot(1/√2) = 1.3274992963 = 1/c_MT (Lean form √2 tan(1/√2)/(1 + tan(1/√2)/√2)); 2 − R = 0.6725 = Lamzouri C0; (3 − R)/2 = 0.83625; C2 = 0.88762; R(ψ0) = 4/3; optimal-window search hits R(ψMT) to 1e-6.',
  },
  {
    id: 'r16-christoffel-exact',
    holds: () => { const m = [fr(1n), fr(1n), fr(4n, 3n), fr(2n), fr(13n, 4n)]; const H = [[m[0], m[1], m[2]], [m[1], m[2], m[3]], [m[2], m[3], m[4]]];
      const lam = fdiv(det3(H), det2([[m[2], m[3]], [m[3], m[4]]])); const one = fsub(fr(1n), fmul(fr(2n), lam));
      const { nodes, weights } = R.extremeMeasure; const mom = (k) => nodes.reduce((s, x, i) => s + weights[i] * x ** k, 0);
      return lam[0] === 5n && lam[1] === 36n && one[0] === 13n && one[1] === 18n && Math.abs(R.constants.christoffel - 5 / 36) < 1e-15
        && [0, 1, 2, 3, 4].every((k) => Math.abs(mom(k) - R.momentsClaimed[k]) < 2e-3) && nodes.every((x) => x >= 0); },
    why: 'Hankel moments 1, 1, 4/3, 2, 13/4 give Λ_2(0) = det H / det H_minor = (5/108)/(1/3) = 5/36 exactly (BigInt fractions), 1 − 2Λ = 13/18; the extreme measure (node at 0, weights 5/36, 0.5685, 0.2926) reproduces the five moments with all nodes ≥ 0, so the one-sided bound is exact.',
  },
  {
    id: 'r16-bandwidth-law',
    holds: () => { const H = (l) => 2 - (1 / l + l / 3); const grid = Array.from({ length: 100 }, (_, i) => (i + 1) / 100);
      return grid.every((l, i) => i === 0 || H(l) > H(grid[i - 1])) && Math.abs(H(1) - 2 / 3) < 1e-15
        && R.bandwidth.every(([, c], i) => i === 0 || c > R.bandwidth[i - 1][1]); },
    why: 'R_λ(ψ0) = 1/λ + λ/3, so H(λ) = 2 − R_λ increases on (0, 1] with H(1) = 2/3; the measured certificate at 2.9e5 rises −0.67 → 0.23 → 0.585 for λ = 0.5, 0.75, 1.',
  },
  {
    id: 'r16-erratum-d-over-N',
    holds: () => { const { T, d, N, ratio } = R.dOverN; const L = log(T / (2 * PI));
      return Math.abs(floor(L * T / (2 * PI)) - d) <= 1 && Math.abs(d / N - ratio) < 1e-5 && Math.abs(L / (L + 2 * log(2) - 1) - ratio) < 1e-4
        && N - d > 100 * L; },
    why: 'd = ⌊LT/2π⌋ = 495,692 against N(T, 2T) = 513,523 at T = 2.9e5: d/N = 0.96528 = L/(L + 2 log 2 − 1); N − d ≈ 17,800 ≫ L, so "d = N + O(L)" is false (harmless: only d = N(1 + o(1)) is used).',
  },
  {
    id: 'r16-certificate-two-forms',
    holds: () => R.certificate.every((c) => c.NI > c.NIprime && Math.abs(c.NI - c.NIprime - 0.0074) < 6e-4 && c.NIprime < c.asymptotic)
      && R.certificate.filter((c) => c.paperParameters).length === 1 && R.certificate[0].w === 1 && R.certificate[0].window === 'psi0',
    why: 'N(I) and N(I′) forms differ by 2(N(I′) − N(I))/N(I) ≈ 0.0074 in every row; all below the asymptotic 2/3 or 0.6725; only ψ0 with w = 1 uses the paper\'s stated parameters.',
  },
  {
    id: 'r16-frobenius-convergence',
    holds: () => { const f = R.frobenius; const cm = R.continuumMainTerm;
      return f.every((x, i) => i === 0 || (x.zero < f[i - 1].zero && x.relErr < f[i - 1].relErr)) && Math.abs(f[3].zero / f[3].prime - 1) < 2e-6
        && cm.every(([L, v]) => { const k = (v - 4 / 3) * L; return k > 0.85 && k < 1.0; }) && f[3].zero > 4 / 3; },
    why: 'Zero-side ‖G‖²/N falls 1.5505 → 1.4151 (1e3 → 2.9e5) with prime-side agreement improving 7e-4 → 1e-6; the continuum main term satisfies (R_L − 4/3)·L ≈ 0.9 at L = 20, 100, 1e4, i.e. 1/L convergence to 4/3.',
  },
  {
    id: 'r16-cue-moments',
    holds: () => R.momentsCUE.every(([v, se], i) => Math.abs(v - R.momentsClaimed[i + 1]) <= 3 * se + 1e-12)
      && R.momentsZeros3e4.slice(1).every((v, i) => v > R.momentsClaimed[i + 2]),
    why: 'CUE Monte Carlo moments 1, 1.3320 ± 0.0013, 1.9966 ± 0.0043, 3.2439 ± 0.0114 sit within 3σ of 4/3, 2, 13/4; the finite-height zeta values (1.441, 2.309, 3.967 at 3e4) are still above, so the route alone had not shown the limit.',
  },
  {
    id: 'r16-inertia-and-lemma',
    holds: () => R.offlineConfigs.inertiaHolds === R.offlineConfigs.count && R.offlineConfigs.maxFrobeniusRatio > R.constants.Rpsi0
      && Math.abs(R.lemma32.minSlack) < 1e-14 && R.lemma32.randomCases === 20000,
    why: '21 synthetic off-line / double-zero configurations: n+(Q′) ≤ #pairs, Lemma 3.2 holds, Frobenius grows with depth (to 2.41) so deep off-line pairs only weaken the certificate; Lemma 3.2 minimum slack is rounding (−8.9e-16).',
  },
  {
    id: 'r16-honest-scope',
    holds: () => R.status === 'done' && /refereed bound is changed/i.test(R.verdict) && /NO QED/.test(R.verdict) && /preprint/.test(R.verdict)
      && /PRZZ 5\/12/.test(R.nsRigidWording) && /not finite-height theorems/.test(R.verdict) && R.constants.ceilingBandwidthOne < 0.7,
    why: 'Reproduction of a preprint; finite-height values are main-term measurements; peer-reviewed record still PRZZ 5/12; ceiling ≈ 0.682; no Λ change; no QED.',
  },
]);

export default ROUTE_16;
