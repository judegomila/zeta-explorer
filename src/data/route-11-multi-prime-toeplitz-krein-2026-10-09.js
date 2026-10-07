/**
 * @fileoverview route-11-multi-prime-toeplitz-krein-2026-10-09 — roadmap route 11 (batch 4): the ARB-LEGE Legendre–Galerkin
 * certificate of pole-free Weil positivity of ζ, extended from one prime (2a ≤ ln 3) to several rungs n ≤ K (2, 3, 4, 5, 7, 8, 9).
 * One run plus one adversarial internal referee pass (not refuted, minor); the referee corrections are applied below.
 *
 * Outcome: Arb certifies W(h) ≥ c‖h‖² for every pole-free h ∈ L²(−a,a) at every support 2a ≤ ln 4 and 2a ≤ ln 5 (the targets) with
 * no torus floor; 2a ≤ ln 6 is also clean (crude-floor run at T = 600). The certificates for ln 7 … ln 11 use a torus floor F whose
 * branch-and-bound cover has float-rounding slivers (≤ 9e-16): they are CERTIFIED CONDITIONAL on closing that tiling gap (referee
 * re-run with inflated cubes in progress). Margins decay like 10^(−4.8·e^{2a}). The whole range is already implied by the verified
 * height (RES-T crossover 2a = 7.764), so this is a statement about the method, not about ζ.
 *
 * PROVED (elementary, project-internal):
 *  - Multi-rung symbol: for 2a ≤ ln(K+1), W(h) = (1/2π)∫ w_K |ĥ|², w_K = 2θ′ − Σ_{n≤K} β_n cos(t ln n), β_n = 2Λ(n)/√n; g = h*h̃
 *    vanishes for |u| ≥ 2a, so rungs n > K drop out and a certificate at ln(K+1) covers every smaller support (nesting).
 *  - Positive-extension freedom on the tail floor (referee rewording; this freedom is the one already used by the Route I dual
 *    certificate, "φ free outside |u| < 2a"): cosines with every frequency |u_j| ≥ 2a ("virtual rungs") leave W unchanged; the
 *    band condition is checked exactly (u = ln r, r rational, r ≥ K+1 or r ≤ 1/(K+1)).
 *  - Floor lemma: 2θ′ is increasing and real-line values of (P − f) lie in its values on the prime torus, so for |t| ≥ T,
 *    w_K + f ≥ 2θ′(T) − F whenever F ≥ sup_torus(P − f); f = 0 gives the crude floor F = Σβ_n.
 *  - Best possible floor: F ≥ λ_R = λ_max of the rung operator on L²(−a,a) (reachability of every F > λ_R via Krein's extension
 *    theorem is cited, not used).
 * CERTIFIED (python-flint/Arb; Legendre–Galerkin, Trefethen Gauss–Legendre bound with ellipse b < 1/2, row-sum ‖E‖, penalty
 *  compression γδ_c², Hilbert–Schmidt tail, exact-dyadic LDL^T; every lemma re-derived by the referee):
 *  ln 4: c = 8.5535418e-8; ln 5: c = 2.2500585e-12; ln 6: c = 6.2499618e-17 (crude floor, T = 600, N = 820). Corollary
 *  λ₁(T_a[σ₂]) ≥ c·(1/4 + (π/2a)²)²: 3.71e-11 at ln 5.
 * CONDITIONAL (certified apart from the torus-cover tiling gap; referee): ln 6 (virtual-rung floor) 6.3799459e-17, ln 7 7.1955663e-22,
 *  ln 8 4.0364230e-27, ln 9 4.5021836e-32, ln 10 7.2361021e-37, ln 11 5.6234133e-42 (‖E‖ = 3.0e-66, HS tail 4.7e-60). The ln 11
 *  reach rests on the K = 10 floor F = 3.518 (float sup 3.51606, slack 0.0019, so the inflated re-run is expected to close; not yet
 *  known). K = 7, 8, 9 floors additionally assume libm sin/cos errors below 1e-6 (float B&B, Arb re-check near target). Also cited:
 *  the classical Weil explicit formula, Trefethen's theorem, Arb correctness for digamma/Bessel/Legendre roots; the tail, η′ and
 *  compression lemmas are ported from tlb-arb-lege-2026-09-28.
 * MEASURED: matrix margin at ln 11 in [5.62e-42, ≈ 6.5e-42] (upper end a non-rigorous LDL failure at 10^−41.1875; the stored Rayleigh
 *  upper bound 1.26e-18 came from the wrong eigenvector). Independent x-side Ritz (referee, no shared code): full-form pole-free minima
 *  ≈ 1.0e-7 (ln 4), ≈ 3.2e-12 (ln 5), 10^−40.98 ≈ 1.04e-41 at ln 11 (D = 260 and 300 agree), all above the certified c, so the
 *  certificate is within ≈ 2× of the truth and the 10^(−4.8·e^{2a}) decay belongs to the form, not to the method. Fit
 *  log10 c ≈ −4.82·e^{2a} + 12.1 over e^{2a} = 3..11. λ_R / Σβ ≈ 0.35–0.40. Truncated Galerkin negative at K = 10 for T = 300, 350.
 * HEURISTIC: in-session stop at ln 11 (margin decay, floor condition T ≳ 2π·e^{λ_R}, truncation loss, unconverged 5D LP at ln 12/13);
 *  extrapolation to 2a = 7.764 gives margins near 10^−11000 and T ≈ 2π·e^70. DH analogy: dag3-dhblindln3 certified the RH-false F_DH
 *  positive on 2a ≤ ln 11, so positivity at these supports probably does not encode the Euler product.
 *
 * PT Λ ≤ 0.2 stands; localises no zero; RH open; NO QED. Import-free. ROUTE_11_ASSERTIONS recompute the crude floors Σβ_n, nesting,
 * the floor condition 2θ′(T) > F, the decay fit, the λ₁ corollary and the Ritz-above-certificate ordering live.
 */

const LOG = Math.log;
const vonMangoldt = (n) => { for (let p = 2; p <= n; p += 1) { if (n % p === 0) { let m = n; while (m % p === 0) m /= p; return m === 1 ? LOG(p) : 0; } } return 0; };
const beta = (n) => (2 * vonMangoldt(n)) / Math.sqrt(n);
const crudeFloor = (K) => { let s = 0; for (let n = 2; n <= K; n += 1) s += beta(n); return s; };
// 2θ′(t) = Re ψ(1/4 + it/2) − log π = log(t/2π) + 1/(24 t²) + O(t^-4) (Stirling); ample for T ≥ 40.
const twoThetaPrime = (t) => LOG(t / (2 * Math.PI)) + 1 / (24 * t * t);

export const ROUTE_11 = Object.freeze({
  id: 'route-11-multi-prime-toeplitz-krein-2026-10-09',
  route: 11,
  date: '2026-10-09',
  title: 'Route 11: multi-prime ARB-LEGE certifies pole-free Weil positivity to ln 5 (clean) and ln 11 (conditional on a tiling patch)',
  status: 'done',
  headline: 'Arb certifies pole-free Weil positivity of ζ with no zero input for every 2a ≤ ln 4 (c = 8.55e-8) and 2a ≤ ln 5 (c = 2.25e-12), the '
    + 'route\'s targets, and cleanly to ln 6. Supports ln 7 … ln 11 (c = 5.62e-42 at ln 11) are certified conditional on closing a float-rounding '
    + 'gap in the torus-floor cover (referee re-run in progress). Margins fall like 10^(−4.8·e^{2a}); the range is far inside the verified height, so '
    + 'this maps the method, not ζ.',

  // e^{2a} = K + 1 → certified lower bound c and tier (CERT = clean; COND = conditional on the torus-cover patch).
  certificates: Object.freeze([
    Object.freeze({ e2a: 3, K: 2, c: 6.389938668258e-4, floor: 'crude', T: 40, N: 60, tier: 'CERT', file: 'arb-cert-K2-T40-N60-Q24.json' }),
    Object.freeze({ e2a: 4, K: 3, c: 8.5535418e-8, floor: 'crude', F: null, T: 200, N: 260, tier: 'CERT', file: 'arb-cert-K3-T200-N260-Q24.json' }),
    Object.freeze({ e2a: 5, K: 4, c: 2.2500585e-12, floor: 'crude', F: null, T: 200, N: 300, tier: 'CERT', file: 'arb-cert-v2-K4-T200-N300-Q24.json' }),
    Object.freeze({ e2a: 6, K: 5, c: 6.2499618e-17, floor: 'crude', F: null, T: 600, N: 820, tier: 'CERT', file: 'crude-floor cross-check T=600' }),
    Object.freeze({ e2a: 6, K: 5, c: 6.3799459e-17, floor: 'virtual', F: 1.8812, T: 200, N: 334, tier: 'COND', file: 'arb-cert-v3-K5-T200-N334-Q40-krein.json' }),
    Object.freeze({ e2a: 7, K: 6, c: 7.1955663e-22, floor: 'virtual', F: 2.1392, T: 200, N: 354, tier: 'COND', file: 'arb-cert-v3-K6-T200-N354-Q40-krein.json' }),
    Object.freeze({ e2a: 8, K: 7, c: 4.0364230e-27, floor: 'virtual', F: 2.616, T: 200, N: 374, tier: 'COND (+ libm)', file: 'arb-cert-v4-K7-T200-N374-Q44-krein.json' }),
    Object.freeze({ e2a: 9, K: 8, c: 4.5021836e-32, floor: 'virtual', F: 2.853, T: 200, N: 390, tier: 'COND (+ libm)', file: 'arb-cert-v4-K8-T200-N390-Q52-krein.json' }),
    Object.freeze({ e2a: 10, K: 9, c: 7.2361021e-37, floor: 'virtual', F: 3.3236, T: 300, N: 560, tier: 'COND (+ libm)', file: 'arb-cert-v4-K9-T300-N560-Q64-krein.json' }),
    Object.freeze({ e2a: 11, K: 10, c: 5.6234133e-42, floor: 'virtual', F: 3.518, T: 500, N: 940, tier: 'COND', file: 'arb-cert-v6-K10-T500-N940-Q76-krein.json' }),
  ]),
  // published crude floors Σβ and best floors λ_R for e^{2a} = 3..13 (rung_norm.py; referee re-derived λ_R at 5, 6, 11, 13).
  floors: Object.freeze({
    crude: Object.freeze([0.98, 2.25, 2.94, 4.38, 4.38, 5.85, 6.34, 7.08, 7.08, 8.52, 8.52]),
    lambdaR: Object.freeze([0.49, 0.90, 1.22, 1.54, 1.78, 2.06, 2.29, 2.51, 2.70, 2.92, 3.10]),
    k10FloatSup: 3.51606,
    k10RealLineMax: 3.5142,
  }),
  ln11: Object.freeze({ Enorm: 3.04e-66, hsTail: 4.7e-60, marginUpperNonRigorousLog10: -41.1875, oddSector: 8.66e-39, virtualRungs: 129, minRungU: 2.5055 }),
  ritzReferee: Object.freeze({ ln4: 1.0e-7, ln5: 3.2e-12, ln11EvenLog10: Object.freeze({ 140: -40.85, 180: -40.94, 220: -40.96, 260: -40.98, 300: -40.98 }), ln11OddLog10: -37.85 }),
  fit: Object.freeze({ slope: -4.82, intercept: 12.12 }),
  truncationFailures: Object.freeze([{ K: 10, T: 300, c: -2.3e-11 }, { K: 10, T: 350, c: -3.44e-12 }]),
  pendingRefereeRun: 'tmp/routes-b4-ref-11-floor-inflated.py (K = 10, cubes inflated by relative 2^-30), log tmp/routes-b4-ref-11-floor-inflated-K10.log, '
    + 'result tmp/routes-b4-ref-11-floor-inflated-K10.json; at depth 3 (126,028 surviving cubes, 2,787 s) on 2026-10-07 ≈ 06:56, still running at recording time',

  refereeKilled: Object.freeze([
    '"F = 3.518 fully Arb-certified" (K = 5, 6, 10; also K = 7, 8, 9) — the torus branch-and-bound uses float centres c ± 0.5r and a float 2π, so the cubes do not tile the torus (slivers ≤ 9e-16; 238 of 256 parents); a Lipschitz patch costs ≈ 2e-13 ≫ c, so ln 7 … ln 11 are certified conditional on an inflated-cube re-run',
    '"matrix margin in [5.62e-42, 7.08e-42]" — the failing shift is 10^−41.1875 = 6.49e-42 (non-rigorous); the stored Rayleigh upper bound 1.26e-18 is from the wrong eigenvector',
    '"virtual rungs, a new zero-free device" — it is the positive-extension (Krein) freedom, already used by the Route I dual certificate; new only as an application to the tail floor',
  ]),
  nextStep: '(1) Wait for the inflated K = 10 floor run; if it closes at 3.518 the ln 11 certificate stands unchanged. (2) Same inflated run for K = 5, 6 '
    + '(and 7, 8, 9, Arb-only to drop the libm assumption). (3) Optional push to ln 13: converge the 5D virtual-rung LP (≥ 300 iterations, B&B violators as cuts), '
    + 'then arb_cert_v6.py with T ≳ 700, Q ≈ 90 (expected c ≈ 1e-50, 3–4 h, 1 worker). Not a Λ lever at any support.',
  files: Object.freeze(['tmp/routes-b4-11/arb_cert_v6.py', 'tmp/routes-b4-11/krein_sup_fullarb.py', 'tmp/routes-b4-11/krein_lp.py', 'tmp/routes-b4-11/rung_norm.py',
    'tmp/routes-b4-11/summary.json', 'tmp/routes-b4-11/arb-cert-v6-K10-T500-N940-Q76-krein.json', 'tmp/routes-b4-11/krein-lp-K10-k2-u6.0-e0.1-fullarb-3.518.json',
    'tmp/routes-b4-ref-11-xside.py', 'tmp/routes-b4-ref-11-xside-validate.py', 'tmp/routes-b4-ref-11-x-K10-D300.log', 'tmp/routes-b4-ref-11-floor-inflated.py']),
  verdict: 'Bounded question answered: pole-free Weil positivity of ζ is Arb-certified with no zero input past ln 3 to ln 4 and ln 5 (and ln 6) cleanly, and to ln 11 '
    + 'conditional on the torus-floor tiling patch; margins 10^(−4.8·e^{2a}) are near-sharp (Ritz within ≈ 2×), so the method stops near ln 11–ln 13 in practice. '
    + 'All of this lies inside the verified-height range, localises no zero and moves no Λ bound; internal referee only; novelty against the small-support '
    + 'literature unchecked. PT Lambda <= 0.2 stands; RH open; NO QED.',
});

const R = ROUTE_11;
const clean = R.certificates.filter((x) => x.tier === 'CERT');
const virt = R.certificates.filter((x) => x.floor === 'virtual');

export const ROUTE_11_ASSERTIONS = Object.freeze([
  {
    id: 'r11-crude-floors',
    holds: () => R.floors.crude.every((v, i) => Math.abs(crudeFloor(i + 2) - v) < 0.006)
      && Math.abs(crudeFloor(10) - 7.075) < 0.002 && Math.abs(beta(2) - 0.98026) < 1e-4,
    why: 'Σ_{n≤K} 2Λ(n)/√n for K = 2..12 reproduces 0.98, 2.25, 2.94, 4.38, 4.38, 5.85, 6.34, 7.08, 7.08, 8.52, 8.52 (K = 10: 7.075).',
  },
  {
    id: 'r11-floor-between-lambdaR-and-crude',
    holds: () => virt.every((x) => x.F >= R.floors.lambdaR[x.K - 2] && x.F < crudeFloor(x.K))
      && R.floors.k10FloatSup <= 3.518 && R.floors.k10RealLineMax <= R.floors.k10FloatSup
      && R.floors.lambdaR.every((l, i) => { const r = l / R.floors.crude[i]; return r > 0.33 && r < 0.53; }),
    why: 'Each virtual-rung floor F sits in [λ_R, Σβ) (e.g. 2.70 ≤ 3.518 < 7.075 at ln 11); float sup 3.51606 ≤ 3.518; real-line max ≤ torus sup.',
  },
  {
    id: 'r11-floor-condition',
    holds: () => R.certificates.every((x) => twoThetaPrime(x.T) > (x.F ?? crudeFloor(x.K))),
    why: 'Floor lemma needs 2θ′(T) > F: log(T/2π) = 3.46 (T = 200), 3.87 (300), 4.38 (500), 4.56 (600) exceed every F used (max 3.518 at T = 500).',
  },
  {
    id: 'r11-decay-and-nesting',
    holds: () => { const pts = R.certificates.filter((x) => x.tier === 'CERT' || x.floor === 'virtual').filter((x, i, a) => a.findIndex((y) => y.e2a === x.e2a) === i);
      const xs = pts.map((p) => p.e2a), ys = pts.map((p) => Math.log10(p.c)); const n = xs.length;
      const mx = xs.reduce((a, b) => a + b) / n, my = ys.reduce((a, b) => a + b) / n;
      let sxy = 0, sxx = 0; xs.forEach((x, i) => { sxy += (x - mx) * (ys[i] - my); sxx += (x - mx) ** 2; });
      const b = sxy / sxx; const mono = pts.every((p, i) => i === 0 || p.c < pts[i - 1].c);
      return n === 9 && mono && Math.abs(b - R.fit.slope) < 0.05 && Math.abs(my - b * mx - R.fit.intercept) < 0.15; },
    why: 'c decreases strictly with e^{2a} = 3..11; least squares gives log10 c ≈ −4.82·e^{2a} + 12.1 (≈ 4.8 digits per integer of e^{2a}).',
  },
  {
    id: 'r11-corollary',
    holds: () => { const lam = (x) => x.c * (0.25 + (Math.PI / LOG(x.e2a)) ** 2) ** 2;
      const l5 = lam(R.certificates[2]), l10 = lam(R.certificates[8]);
      return Math.abs(l5 / 3.71e-11 - 1) < 0.01 && Math.abs(l10 / 3.23e-36 - 1) < 0.01; },
    why: 'λ₁(T_a[σ₂]) ≥ c·(1/4 + (π/2a)²)²: 3.71e-11 at ln 5 and 3.23e-36 at ln 10.',
  },
  {
    id: 'r11-ritz-above-certificate',
    holds: () => { const c11 = R.certificates[R.certificates.length - 1].c; const ev = Object.values(R.ritzReferee.ln11EvenLog10);
      return ev.every((l) => 10 ** l >= c11) && 10 ** R.ln11.marginUpperNonRigorousLog10 > c11 && 10 ** R.ln11.marginUpperNonRigorousLog10 < 6.6e-42
        && 10 ** ev[ev.length - 1] / c11 < 2 && R.ritzReferee.ln4 >= R.certificates[1].c && R.ritzReferee.ln5 >= R.certificates[2].c
        && 10 ** R.ritzReferee.ln11OddLog10 >= R.ln11.oddSector && R.ln11.Enorm + R.ln11.hsTail < c11 * 1e-15; },
    why: 'Independent Ritz upper bounds (1.0e-7, 3.2e-12, 10^−40.98) lie above the certified c (within 2× at ln 11); the non-rigorous margin upper end 6.49e-42 replaces 7.08e-42; ‖E‖ + HS tail ≪ c.',
  },
  {
    id: 'r11-virtual-rung-band',
    holds: () => R.ln11.minRungU > LOG(11) && R.ln11.virtualRungs === 129 && clean.every((x) => x.floor === 'crude') && clean.map((x) => x.e2a).join(',') === '3,4,5,6',
    why: 'Every virtual rung has |u| ≥ 2.5055 > ln 11 = 2.3979 (exact rational check, 129 rungs); clean (no torus floor) tiers are exactly ln 3, ln 4, ln 5, ln 6 (crude floor).',
  },
  {
    id: 'r11-honest-scope',
    holds: () => R.status === 'done' && /conditional/.test(R.verdict) && /moves no Λ bound/.test(R.verdict) && /PT Lambda <= 0\.2 stands/.test(R.verdict)
      && /NO QED/.test(R.verdict) && R.certificates.filter((x) => x.e2a >= 7).every((x) => x.tier.startsWith('COND')) && /tile/.test(R.refereeKilled[0]),
    why: 'ln 7 … ln 11 graded conditional on the tiling patch; no Λ change; no QED.',
  },
]);

export default ROUTE_11;
