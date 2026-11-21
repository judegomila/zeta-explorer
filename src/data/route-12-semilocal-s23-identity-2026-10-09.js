/**
 * @fileoverview route-12-semilocal-s23-identity-2026-10-09 — roadmap route 12 (batch 4): the semilocal Sonine trace identity for
 * S = {∞, 2, 3}, and whether the remainder share D_S/L_S on the pole-free Weil minimiser falls as primes are added.
 * One run plus one adversarial internal referee pass (not refuted, minor); the referee corrections are applied below.
 *
 * Outcome: NO. On [ln 3, ln 4] the remainder share is 99.71% … 99.99997% for S = {∞,2}, {∞,2,3} and {∞,2,3,5} alike. Referee framing
 * (applied): on the unit-norm W-minimiser h0, 1 − share = W(h0)/L_S(h0) = λ_W/L_S(h0) holds BY DEFINITION for any decomposition
 * W = L_S − D_S, and L_S(h0) ≥ min_t L̂_S > 0 keeps L_S(h0) = O(0.3); so this metric is close to 1 by construction whenever λ_W is
 * small and cannot separate one S from another. The negative answer is a statement about this metric at cutoff Λ = 1, not evidence
 * about Connes' S → all primes, Λ → ∞ limit.
 *
 * DERIVED (algebraic, conditional on the CC 2021 trace-class framework; not re-proved here):
 *  - F_S η(w) = Σ_{a,b ≥ −1} c_2(a) c_3(b) η̂(2^a 3^b w), c_p(k) = 1 − 1/p (k ≥ 0), −1/p (k = −1); Mellin multiplier ρ_2(s)ρ_3(s) with
 *    ρ_p(s) = (1 − p^{s−1})/(1 − p^{−s}), |ρ_p| = 1 on Re s = 1/2 (checked by hand; recomputed live below).
 *  - L_S = W_∞ + W_2 + W_3 + D_S with kernel δ_S(ρ) = 2ρ^{1/2} Σ_{q,q′} c_q c_q′ [si(qρ + q′) + si(|qρ − q′|)]; for g-support < ln 4
 *    the Weil form is W = L_S − D_S exactly (no leftover P_3).
 *  The matrix identity L23 = W + D23 holds by construction (defect ≈ 1e-16) and tests nothing; the independent evidence for the
 *  identity is the measured trace-side positivity below.
 * CERTIFIED: nothing.
 * MEASURED (Legendre Galerkin on pole-free L²(−a,a), spike-graded quadrature; referee re-ran the authors' code and an independent
 *  tanh-sinh δ_S):
 *  - Trace side: L̂_{S23}(0) = δ̂(0) − 11.7205 = +0.10 (authors' mesh, δ̂(0) = 11.8208) to +0.12 (referee tanh-sinh, the gap is u ∈ [10, 14]);
 *    positive on [0, 30]; single-prime L̂_{S3}(0) = +0.0504 (referee 0.0508–0.0510), L̂_{S2}(0) = 0.0650 (referee 0.06515);
 *    λ_min(L_S23) = 0.175–0.225, λ_min(L_S235) = 0.22–0.26 in the Galerkin space. Not a certificate.
 *  - Share S23 at 2a = 0.8 / 1.0 / ln 3 / ln 4: 0.57966 / 0.965964 / 0.9971369 / 0.99999967 (S2: 0.60234 / 0.967100 / 0.9971396 / 0.99999965).
 *  - (1 − share)_S23 / (1 − share)_S2: 1.057 (0.8), 1.0345 (1.0), 1.0009 at ln 3 (S23 slightly HIGHER there), then 0.994 → 0.9265 on
 *    (ln 3, ln 4]; N-stable to 4–5 digits (N = 32 and 40: 0.92648 / 0.92649). S235 (coarse mesh, ±2%): 1.07–1.09× the S2 value.
 *  - λ_W is a Rayleigh–Ritz upper bound: λ_W(ln 3) ≤ 9.486e-4, λ_W(ln 4) ≤ 1.04e-7 (N = 40); absolute 1 − share near ln 4 moves ≈ 20%
 *    from N = 24 to 32 and 1.3% from 32 to 40, so only the ratio is converged to the stated digits.
 *  - L_S(h0) on [ln 3, ln 4]: S2 0.300–0.333, S23 0.324–0.332, S235 0.280–0.305 (the 0.36 in the run headline was the 2a = 1.0 value).
 *  - λ_min(D_S23) at 2a = 0.8 tends to ≈ 0 or below with N (+0.0046, +0.0030, +0.0012, −0.0000557 at N = 24/32/40/48): the claimed
 *    "D_S23 positive definite at 0.8" was a truncation artefact; CC's sufficient condition D_S ≤ 0 fails (λ_max ≈ 1.8–2.4).
 *  - The module rh-route-i-semilocal-sonine-trace-identity-2026-09-23 returns δ_S23 low by a factor ≈ 2 (0.774853 vs 1.549873 at √2,
 *    ratio 2.0002; a residual ~1e-4 difference beyond the factor 2 is not explained); its assertion I6 is ratio-based and still holds.
 * HEURISTIC: enlarging S at Λ = 1 is not a lever toward Connes' program with this metric; the remaining S-independent content is the
 *  inequality D_S ≤ L_S itself (or a different cutoff/architecture).
 *
 * No refereed bound is changed; RH open; NO QED. Import-free. ROUTE_12_ASSERTIONS recompute |ρ_p| = 1, the Tate series Σ c_p(k)p^{−ks} = ρ_p, the share ↔ λ_W/L_S
 * consistency, the S23/S2 ratios, the δ̂_S23(0) piece sums and the D_S23 sign drift live.
 */

// complex helpers
const cx = (re, im = 0) => ({ re, im });
const cmul = (a, b) => cx(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
const cdiv = (a, b) => { const d = b.re * b.re + b.im * b.im; return cx((a.re * b.re + a.im * b.im) / d, (a.im * b.re - a.re * b.im) / d); };
const cabs = (a) => Math.hypot(a.re, a.im);
const cpow = (p, s) => { const m = p ** s.re, ph = s.im * Math.log(p); return cx(m * Math.cos(ph), m * Math.sin(ph)); }; // p^s, p > 0
const rhoTate = (p, s) => cdiv(cx(1 - cpow(p, cx(s.re - 1, s.im)).re, -cpow(p, cx(s.re - 1, s.im)).im), cx(1 - cpow(p, cx(-s.re, -s.im)).re, -cpow(p, cx(-s.re, -s.im)).im));

export const ROUTE_12 = Object.freeze({
  id: 'route-12-semilocal-s23-identity-2026-10-09',
  route: 12,
  date: '2026-10-09',
  title: 'Route 12: S = {∞,2,3} semilocal identity written and tested; the remainder share does not fall as primes are added',
  status: 'done',
  headline: 'The S = {∞,2,3} trace identity was derived and its trace side tested positive (L̂(0) ≈ +0.10 to +0.12, measured). Adding p = 3 (or p = 5) '
    + 'leaves the remainder share on the pole-free Weil minimiser at 99.71%–99.99997% over [ln 3, ln 4]. That share equals 1 − λ_W/L_S(h0) by definition '
    + 'and L_S(h0) stays ≈ 0.3, so this metric cannot distinguish one S from another; at cutoff Λ = 1 enlarging S is not a lever.',

  shares: Object.freeze({
    twoA: Object.freeze(['0.8', '1.0', 'ln3', 'ln4']),
    S23: Object.freeze([0.57966, 0.965964, 0.9971369, 1 - 3.258e-7]),
    S2: Object.freeze([0.60234, 0.967100, 0.9971396, 1 - 3.517e-7]),
    ratioReported: Object.freeze([1.057, 1.0345, 1.0009, 0.9265]),
  }),
  lambdaW: Object.freeze({ ln3N32: 9.52e-4, ln3N40: 9.486e-4, ln4N32: 1.0555e-7, ln4N40: 1.0421e-7 }),
  LSh0: Object.freeze({ S2: Object.freeze([0.300, 0.333]), S23: Object.freeze([0.324, 0.332]), S235: Object.freeze([0.280, 0.305]), S23ln4N32: 0.32398 }),
  multiplier: Object.freeze({
    threshold: 11.7205, deltaHatAuthors: 11.8208, S3: 0.0504, S3Referee: Object.freeze([0.050833, 0.050965]), S2Module: 0.0650, S2Referee: 0.065145,
    // δ̂_S23(0) pieces (2∫ over each u-interval), referee tanh-sinh vs authors' mesh
    intervals: Object.freeze(['[0,ln4]', '[ln4,3]', '[3,4]', '[4,6]', '[6,8]', '[8,10]', '[10,14]']),
    referee: Object.freeze([6.100556, 3.000755, 1.052707, 1.093313, 0.389546, 0.136932, 0.063550]),
    authors: Object.freeze([6.100549, 3.000845, 1.052848, 1.093723, 0.389445, 0.136973, 0.042809]),
  }),
  dsMinAt08: Object.freeze({ 24: 4.6e-3, 32: 3.0e-3, 40: 1.2e-3, 48: -5.57e-5 }),
  moduleNormalisation: Object.freeze([[0.774853, 1.549873], [0.900005, 1.800172], [5.4464, 10.8929]]),

  refereeKilled: Object.freeze([
    '"structural reason: share pinned at 1 − λ_W/L_S(h0)" presented as a finding — it holds by definition for any decomposition on the W-minimiser; the only input is L_S(h0) = O(0.3), which follows from min L̂_S > 0',
    '"D_S23 positive definite at 2a = 0.8 (λ_min = +0.0030)" — Galerkin truncation artefact: +0.0046, +0.0030, +0.0012, −0.0000557 at N = 24/32/40/48',
    '"proved" bucket — algebraic derivations conditional on the CC trace-class framework; L23 = W + D23 holds by construction and tests nothing',
    'L̂_S23(0) = +0.100 ± 0.02 — quadrature-sensitive; referee tanh-sinh gives ≈ 0.12 (difference on u ∈ [10, 14]); sign robust, error not rigorous',
    '"4-digit N-stability" of λ_W and the absolute 1 − share — only the S23/S2 ratio is N-stable; the absolute 1 − share at ln 4 moves 20% from N = 24 to 32',
    'wording: at exactly ln 3 the S23 1 − share is 0.09% higher than S2 (not lower); μ_max matches the share to ≈ 1.3e-5 relative at 2a = 1.0 (not 6–7 digits); L_S(h0) range on [ln 3, ln 4] is 0.280–0.333 (not 0.28–0.36)',
  ]),
  nextStep: 'Close route 12 (negative at Λ = 1 for this metric). Optional cleanup: fix the δ_S23 normalisation in '
    + 'src/data/rh-route-i-semilocal-sonine-trace-identity-2026-09-23.js (absolute s23 literals only; I6 is ratio-based) and explain the residual 1e-4. '
    + 'A metric that can separate S would compare D_S and L_S directly (pencil μ_max on the whole space, not on h0), or change the cutoff Λ.',
  files: Object.freeze(['tmp/routes-b4-12-s23/summary.json', 'tmp/routes-b4-12-s23/delta.py', 'tmp/routes-b4-12-s23/galerkin.mjs', 'tmp/routes-b4-12-s23/galerkin-fin-N32.log',
    'tmp/routes-b4-12-s23/galerkin-s235-N32.log', 'tmp/routes-b4-12-s23/mult_t0.py', 'tmp/routes-b4-ref-12-work/refdelta.py', 'tmp/routes-b4-ref-12-work/job_ts23.py']),
  verdict: 'No: adding p = 3 (and p = 5) does not shrink the remainder share on the pole-free Weil minimiser (99.71% at ln 3, 99.99997% at ln 4 for every S tested). '
    + 'The share equals 1 − λ_W/L_S(h0) by definition and L_S(h0) ≈ 0.3 is bounded below by the positive trace multiplier, so this metric is near 1 for every S and '
    + 'says nothing about Connes\' Λ → ∞ limit. The S = {∞,2,3} identity is derived (conditional on the CC framework) and its trace side is positive in measurement only; '
    + 'nothing is certified. No refereed bound is changed; RH open; NO QED.',
});

const R = ROUTE_12;
const sum = (xs) => xs.reduce((a, b) => a + b, 0);

export const ROUTE_12_ASSERTIONS = Object.freeze([
  {
    id: 'r12-tate-unimodular',
    holds: () => [2, 3, 5].every((p) => [0, 0.7, 3.1, 14.13, 100].every((t) => Math.abs(cabs(rhoTate(p, cx(0.5, t))) - 1) < 1e-12))
      && Math.abs(cabs(cmul(rhoTate(2, cx(0.5, 9)), rhoTate(3, cx(0.5, 9)))) - 1) < 1e-12 && Math.abs(cabs(rhoTate(2, cx(0.8, 2))) - 1) > 1e-3,
    why: '|ρ_p(1/2 + it)| = 1 for p = 2, 3, 5 (numerator and denominator are complex conjugates), so |ρ_2ρ_3| = 1 on the line; off the line it is not unimodular.',
  },
  {
    id: 'r12-tate-series',
    holds: () => [2, 3, 5].every((p) => [cx(0.5, 0), cx(0.5, 4.2), cx(0.9, -7)].every((s) => {
      const x = cpow(p, cx(-s.re, -s.im)); let acc = cdiv(cx(-1 / p), x); let xk = cx(1);
      for (let k = 0; k < 400; k += 1) { acc = cx(acc.re + (1 - 1 / p) * xk.re, acc.im + (1 - 1 / p) * xk.im); xk = cmul(xk, x); }
      const r = rhoTate(p, s); return Math.hypot(acc.re - r.re, acc.im - r.im) < 1e-9; })),
    why: 'Σ_{k≥−1} c_p(k) p^{−ks} with c_p(k) = 1 − 1/p (k ≥ 0), −1/p (k = −1) sums to the Tate factor ρ_p(s) = (1 − p^{s−1})/(1 − p^{−s}) (Re s > 0).',
  },
  {
    id: 'r12-share-identity',
    holds: () => { const L23 = R.lambdaW.ln4N32 / (1 - R.shares.S23[3]); const L23ln3 = R.lambdaW.ln3N32 / (1 - R.shares.S23[2]);
      const L2ln3 = R.lambdaW.ln3N32 / (1 - R.shares.S2[2]);
      return Math.abs(L23 - R.LSh0.S23ln4N32) < 2e-4 && L23ln3 > 0.32 && L23ln3 < 0.334 && L2ln3 > R.LSh0.S2[0] && L2ln3 < 0.334; },
    why: '1 − share = λ_W/L_S(h0): 1.0555e-7/3.258e-7 = 0.32398 at ln 4 (S23); 9.52e-4/2.863e-3 ≈ 0.333 at ln 3 — the identity holds by definition, so these are consistency checks.',
  },
  {
    id: 'r12-ratios',
    holds: () => R.shares.ratioReported.every((r, i) => Math.abs((1 - R.shares.S23[i]) / (1 - R.shares.S2[i]) - r) < 2e-3)
      && (1 - R.shares.S23[2]) > (1 - R.shares.S2[2]) && (1 - R.shares.S23[3]) < (1 - R.shares.S2[3]),
    why: '(1 − share)_S23/(1 − share)_S2 = 1.057, 1.0345, 1.0009, 0.9265: higher at ln 3, lower (by up to 7.4%) only on (ln 3, ln 4].',
  },
  {
    id: 'r12-multiplier-pieces',
    holds: () => { const r = sum(R.multiplier.referee), a = sum(R.multiplier.authors); const tail = R.multiplier.deltaHatAuthors - a;
      const lhatA = R.multiplier.deltaHatAuthors - R.multiplier.threshold, lhatR = r + tail - R.multiplier.threshold;
      return tail > 0 && tail < 0.01 && Math.abs(lhatA - 0.1003) < 1e-3 && lhatR > 0.115 && lhatR < 0.125
        && R.multiplier.referee.slice(0, 6).every((x, i) => Math.abs(x - R.multiplier.authors[i]) < 5e-4) && Math.abs(R.multiplier.referee[6] - R.multiplier.authors[6]) > 0.02; },
    why: 'δ̂_S23(0) pieces: authors 11.8172 + tail 0.0036 = 11.8208 → L̂(0) = +0.100; referee pieces 11.8374 (+ same tail) → ≈ +0.121; they agree to 5e-4 except on [10, 14].',
  },
  {
    id: 'r12-ds-sign-drift',
    holds: () => { const v = Object.values(R.dsMinAt08); return v.every((x, i) => i === 0 || x < v[i - 1]) && v[v.length - 1] < 0; },
    why: 'λ_min(D_S23) at 2a = 0.8 decreases with N (24/32/40/48) and is negative at N = 48: no positive definiteness.',
  },
  {
    id: 'r12-module-factor-two',
    holds: () => R.moduleNormalisation.every(([m, t]) => Math.abs(t / m - 2) < 3e-4) && R.lambdaW.ln4N40 < R.lambdaW.ln4N32 && R.lambdaW.ln3N40 < R.lambdaW.ln3N32,
    why: 'Module δ_S23 = true δ_S23 / 2 (ratio 2.0002, 2.0002, 2.0000); Ritz upper bounds on λ_W decrease with N (N = 40 below N = 32).',
  },
  {
    id: 'r12-honest-scope',
    holds: () => R.status === 'done' && /by definition/.test(R.verdict) && /nothing is certified/.test(R.verdict) && /refereed bound is changed/i.test(R.verdict)
      && /NO QED/.test(R.verdict) && /artefact/.test(R.refereeKilled[1]),
    why: 'Negative answer stated as a property of this metric at Λ = 1; nothing certified; no QED.',
  },
]);

export default ROUTE_12;
