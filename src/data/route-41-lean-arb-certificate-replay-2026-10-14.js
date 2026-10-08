/**
 * @fileoverview route-41-lean-arb-certificate-replay-2026-10-14 — roadmap route 41 (batch 9, group H, tool): Lean replay of the
 * finite-dimensional core of the ARB-LEGE certificate (pole-free one-prime Weil positivity at 2a ≤ ln 3). One worker run plus one
 * adversarial internal referee pass with a full independent rebuild from a sha-checked snapshot and an independent exact Python check of
 * the data against the Arb export (not refuted; severity minor: framing of "final assembly", tail only for one instance, weak negative
 * control). Corrections applied below.
 *
 * PROVED (Lean 4.34.1, Mathlib d13f23b7; formalization/lean/Route41ArbReplay/, 43 files; no sorry, no native_decide; referee rebuild all 43
 *  modules rc = 0, ≤ 2 processes, peak RSS 5.47 GB):
 *  - Generic soundness ArbReplay.Cert.lower_bound (Core.lean): if the integer checker passes (A symmetric; F = G − RᵀR diagonally dominant,
 *    Σ_j |F_ij| ≤ 2F_ii, G = 4^pc(A − sNum I) + λ c cᵀ), then for every real A' within rhoA of A/2^pA entrywise, every c' within rhoc of
 *    c/2^pc and every x with c'·x = 0: xᵀA'x ≥ (sNum/2^pA − n·rhoA − (λ/2^pA) n rhoc²)|x|². Axioms [propext, Classical.choice, Quot.sound].
 *  - Six sector certificates by decide +kernel only (*_valid: [propext, Quot.sound]): T = 200 s_even = −0.1128081667, s_odd = −0.0937440970
 *    (n = 80 for N = 160, 120 for N = 240); T = 400, N = 320 (n = 160): s_even = −0.8058722350, s_odd = −0.7770267712.
 *  - Lean-checked FINITE-DIMENSIONAL assembly inequality in Galerkin coefficients (arbLege_*_assembly): mT|x|² + xeᵀAe xe + xoᵀAo xo −
 *    (2KQ + η)|x|² ≥ c_Lean|x|² for xe ⟂ ce, xo ⟂ co and all data inside the stored Arb enclosures; c_Lean = 8.14976402379e-4 (T200 N160),
 *    8.20443697158e-4 (T200 N240), 9.0433718766e-4 (T400 N320), each > 0 by norm_num.
 *  - Tail arithmetic for (T, N) = (200, 240) ONLY (hsTail_T200N240): (2Φ²/π) Σ_{n≥240} (200a)^{2n+1}/((2n+1)!!)² ≤ 1e-60 for a = (ln 3)/2,
 *    0 ≤ Φ ≤ 8.8381 (true value ≈ 1.47e-101); stated with tsum, summability proved internally but not exported.
 *  - Negative control: the even T200 N160 certificate with s raised by 1e-6 and R kept is rejected (decide +kernel). WEAK control: a
 *    2.5e-9 margin rejects it trivially; it shows the checker is not constant-true (referee also proved ¬ ∀ C, C.Valid), not forgery resistance.
 * CERTIFIED (Arb, python-flint 0.9.0, 256-bit; not Lean): Galerkin entry balls, constraint vectors c, m_T = 0.11362861041048217, Φ, ‖KQ_N‖
 *  (2.7336e-6 N160; 3.83e-51 N240; 3.297e-11 T400), η (Arb ≈ 1e-420; Lean uses ≤ 1e-30); rhoA ≈ 7.06e-19 (T200), 1.43e-18 (T400); rhoc ≈ 3.7e-19.
 *  Referee exact check: every Arb ball lies inside the Lean enclosures; A exactly symmetric; diagonal dominance on every row (min normalised
 *  margin 2.5e-9); entries ≤ 100 bits; recomputed mT_lo + min s − 2KQ − η ≥ claimed c_Lean in all three instances.
 * CONDITIONAL: the full ARB-LEGE claim W(h) ≥ c‖h‖² for pole-free h, 2a ≤ ln 3 needs, beyond the Lean core: (i) true data inside the Arb
 *  enclosures (Arb correctness, Trefethen Thm 4.5 Gauss–Legendre error constant, Bessel/digamma enclosures); (ii) the exact parity split;
 *  (iii) the passage from |x|² to ‖h‖² — Plancherel / Legendre–Bessel, |P_N h| ≤ ‖h‖ (needs s < 0), the η' correction making the truncated
 *  coefficient vector orthogonal to c_N, and the Hilbert–Schmidt bound — all paper-level, internally refereed, not formalised. KQ is a trusted
 *  Arb number for N160 and T400 N320; η ≤ 1e-30 is trusted in every instance. c_Lean is ≈ 1e-8 below the Arb c_lower (δ = 1e-8 shift).
 * MEASURED: kernel cost (decide +kernel, user CPU, both sectors) 110.8 / 255.1 / 891.4 s for n = 80 / 120 / 160 (referee 113.6 / 254.0 /
 *  892.6 s), peak RSS 3.68 / 4.66 / 5.47 GB; dot steps 173,880 / 583,220 / 1,378,160 (≈ n³); ≈ 3–5k 100-bit multiply-adds per second
 *  (includes Mathlib load, approximate). Monolithic n = 80 check peaked at 9.45 GB and was replaced by slim imports + row blocks.
 *  native_decide (scratch, not used): 2.8 s wall vs ≈ 55 s kernel user, adds a compiler-trust axiom.
 * HEURISTIC: a kernel-only replay of the transcendental parts would take ≈ 1–5 CPU-days per instance (4–8× at T = 400); formalisation effort
 *  (digamma 2–4 weeks, spherical Bessel 1–2, Gauss–Legendre error 3–6, analytic reduction months) is the bottleneck. The certificate format
 *  ports to other PSD claims (barrier prisms, Toeplitz–Krein LP certificates).
 *
 * Verdict: a stronger trust story for one leg of a fixed-window positivity certificate; nothing about Λ or RH. PT Lambda <= 0.2 stands; RH
 * open; NO QED. Import-free. ROUTE_41_ASSERTIONS recompute live: c_Lean from mT, s and KQ; the δ = 1e-8 gap to the Arb c_lower; the HS tail
 * value 1.466e-101 and KQ ≈ 3.83e-51 for N = 240; the n³ cost scaling; the margin/size bookkeeping.
 */

const { abs, log, exp, sqrt, PI, max } = Math;

export const ROUTE_41 = Object.freeze({
  id: 'route-41-lean-arb-certificate-replay-2026-10-14',
  route: 41,
  date: '2026-10-14',
  title: 'Route 41: Lean replay of the linear-algebra core of the ARB-LEGE certificate (decide +kernel, no native_decide)',
  status: 'done',
  headline: 'A Lean soundness theorem plus kernel-checked integer certificates (decide +kernel, no native_decide) replay the linear-algebra leg of '
    + 'ARB-LEGE for (T, N) = (200, 160), (200, 240), (400, 320): a finite-dimensional assembly inequality in Galerkin coefficients with c_Lean = '
    + '8.1498e-4, 8.2044e-4, 9.0434e-4, valid for all data inside the Arb enclosures; the N = 240 tail arithmetic is also Lean-checked. '
    + 'Transcendental enclosures and the analytic reduction stay Arb/paper-trusted.',
  instances: Object.freeze([
    Object.freeze({ T: 200, N: 160, n: 80, sEven: -0.1128081667, sOdd: -0.0937440970, KQ: 2.7336e-6, cLean: 8.14976402379e-4, cArb: 8.14986392e-4, tailInLean: false, userCpu: 110.8, refUserCpu: 113.6, rssGB: 3.68, steps: 173880 }),
    Object.freeze({ T: 200, N: 240, n: 120, sEven: -0.1128081667, sOdd: -0.0937440970, KQ: 3.83e-51, cLean: 8.20443697158e-4, cArb: 8.20453687e-4, tailInLean: true, userCpu: 255.1, refUserCpu: 254.0, rssGB: 4.66, steps: 583220 }),
    Object.freeze({ T: 400, N: 320, n: 160, sEven: -0.8058722350, sOdd: -0.7770267712, KQ: 3.297e-11, cLean: 9.0433718766e-4, cArb: 9.04347178e-4, tailInLean: false, userCpu: 891.4, refUserCpu: 892.6, rssGB: 5.47, steps: 1378160 }),
  ]),
  mT200: 0.11362861041048217,
  etaLean: 1e-30,
  delta: 1e-8,
  tail: Object.freeze({ phi: 8.8381, nStart: 240, leanBound: 1e-60, mpmath: 1.466e-101 }),
  cert: Object.freeze({ maxBits: 100, ddMargin: 2.5e-9, kappa: 1e6, rhoA200: 7.06e-19, rhoA400: 1.43e-18, rhoc: 3.7e-19, monolithicRssGB: 9.45, leanFiles: 43 }),
  refereeKilled: Object.freeze([
    '"final assembly" overstated: the Lean theorems are the finite-dimensional inequality in Galerkin coefficients; |x|² → ‖h‖² (Plancherel, |P_N h| ≤ ‖h‖ with s < 0, the η\' constraint correction, the HS bound) is paper-level and trusted',
    'tail Lean-checked only for (200, 240); KQ is a trusted Arb bound for N160 and T400 N320; η ≤ 1e-30 trusted in all instances',
    'negative control is weak (raises s by 1e-6, keeps R): shows the checker is not constant-true, not forgery resistance',
    'cost/throughput figures include Mathlib load; the 3–5k steps/s rate is approximate',
  ]),
  nextStep: 'Rebuild: tmp/routes-b9-r41-run-all.sh "200 160" "200 240" "400 320" (needs /tmp/r41-leanpath.txt from `cd /tmp/qrh-verify/lean && lake env printenv '
    + 'LEAN_PATH`; builds in /tmp/r41build). Next: (1) port Core.lean to a barrier-prism or Toeplitz–Krein PSD certificate; (2) pilot a Lean enclosure of '
    + 'm_T = Re ψ(1/4 + 100i) − ln π − M_2 (Mathlib digamma + proved Stirling remainder, or a built LeanCert); (3) pilot one Galerkin entry by partition '
    + 'integration with elementary j_n and measure kernel cost; (4) Lean-check the KQ tails for N160 and T400 N320.',
  files: Object.freeze(['formalization/lean/Route41ArbReplay/{Core,LegE_cT200N160Full,LegE_cT200N240Full,LegE_cT400N320Full,TailN240,NegativeControl}.lean + Check*/Data_* (43 files)',
    'tmp/routes-b9-r41-{export,build-cert,gen-main,negative-control,summary}.py', 'tmp/routes-b9-r41-run-all.sh', 'tmp/routes-b9-r41/{summary.json,run-all-3.log,cert-*.json}',
    'tmp/routes-b9-ref41-build.sh', 'tmp/routes-b9-ref41-indep-check.py']),
  verdict: 'Done as infrastructure: the finite-dimensional core of an Arb certificate is replayed in Lean (soundness theorem with no sorry; six '
    + 'sector certificates by decide +kernel only; finite-dimensional assembly inequality in Galerkin coefficients with c_Lean up to 9.0434e-4; '
    + 'N = 240 tail arithmetic). The transcendental enclosures, m_T, Φ, KQ for N160/T400, η and the analytic Galerkin/Hilbert–Schmidt reduction '
    + 'stay Arb- or paper-trusted. A stronger trust story for one leg of a fixed-window positivity certificate; nothing about Λ or RH. '
    + 'PT Lambda <= 0.2 stands; RH open; NO QED.',
});

const R = ROUTE_41;
const hsTail = (phi, N, a = log(3) / 2, T = 200) => { // (2Φ²/π) Σ_{n≥N} (Ta)^{2n+1}/((2n+1)!!)², in log space
  const x = T * a; let ld = 0; for (let k = 1; k <= 2 * N - 1; k += 2) ld += log(k); const lt = [];
  for (let n = N; n < N + 600; n += 1) { ld += log(2 * n + 1); lt.push((2 * n + 1) * log(x) - 2 * ld); }
  const m = max(...lt); return ((2 * phi * phi) / PI) * exp(m) * lt.reduce((s, t) => s + exp(t - m), 0); };

export const ROUTE_41_ASSERTIONS = Object.freeze([
  {
    id: 'r41-cLean-recomputed-T200',
    holds: () => R.instances.slice(0, 2).every((I) => { const c = R.mT200 + Math.min(I.sEven, I.sOdd) - 2 * I.KQ - R.etaLean;
      return abs(c - I.cLean) < 2e-10 && I.cLean > 0; }),
    why: 'c_Lean = mT_lo + min(s_even, s_odd) − 2KQ − η: 0.11362861041 − 0.1128081667 − 2·2.7336e-6 = 8.149765e-4 (N160) and − 2·3.83e-51 = 8.204437e-4 (N240), matching the Lean constants (s shown to 10 decimals).',
  },
  {
    id: 'r41-delta-shift-gap',
    holds: () => R.instances.every((I) => { const gap = I.cArb - I.cLean; return gap > 0.99 * R.delta && gap < 1.01 * R.delta; }),
    why: 'Each Lean constant sits δ = 1e-8 below the Arb c_lower (8.14986e-4 / 8.20454e-4 / 9.04347e-4): the price of shifting s for an exact margin.',
  },
  {
    id: 'r41-hs-tail-live',
    holds: () => { const v = hsTail(R.tail.phi, R.tail.nStart); return abs(v / R.tail.mpmath - 1) < 0.01 && v < R.tail.leanBound && abs(sqrt(v) / R.instances[1].KQ - 1) < 0.01; },
    why: 'For a = (ln 3)/2, Φ = 8.8381: (2Φ²/π) Σ_{n≥240} (200a)^{2n+1}/((2n+1)!!)² = 1.466e-101 ≪ 1e-60 (Lean bound), √ = 3.83e-51 = KQ(N240).',
  },
  {
    id: 'r41-cost-scaling',
    holds: () => { const [a, b, c] = R.instances; const r1 = b.steps / a.steps; const r2 = c.steps / a.steps;
      return abs(r1 / (b.n / a.n) ** 3 - 1) < 0.02 && abs(r2 / (c.n / a.n) ** 3 - 1) < 0.02 && R.instances.every((I) => abs(I.refUserCpu / I.userCpu - 1) < 0.03 && I.rssGB < 5.5)
        && R.cert.monolithicRssGB > 9; },
    why: 'Kernel dot steps scale as n³ (ratios 3.354 vs 3.375 and 7.926 vs 8); referee CPU times within 3%; every split check < 5.5 GB (monolithic 9.45 GB replaced).',
  },
  {
    id: 'r41-trust-boundary',
    holds: () => R.instances.filter((I) => I.tailInLean).length === 1 && R.instances.find((I) => I.tailInLean).N === 240 && R.cert.maxBits === 100
      && R.cert.rhoA400 > R.cert.rhoA200 && /Galerkin coefficients/.test(R.verdict) && /paper-trusted/.test(R.verdict)
      && /PT Lambda <= 0\.2 stands/.test(R.verdict) && /NO QED/.test(R.verdict) && R.refereeKilled.length === 4,
    why: 'Tail in Lean for N = 240 only; assembly stated in Galerkin coefficients; transcendental and analytic legs trusted; no Λ change; no QED.',
  },
]);

export default ROUTE_41;
