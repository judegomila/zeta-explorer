/**
 * @fileoverview route-26-gl2-twin-ladder-2026-10-12 — roadmap route 26 (batch 7, group E): the twin ladder for GL(2) L-functions where
 * Ramanujan is known (11a, Δ, Δ·E4, and the weight-24 non-eigenform Δ·E4³ with no Euler product). One run plus one adversarial internal
 * referee pass (not refuted; severity minor; the Arb certificate script was audited line by line and every certified margin was bracketed
 * by an independent x-space Ritz upper bound). The referee corrections are applied below.
 *
 * PROVED (elementary, project-internal): (a) the Weil form of a holomorphic newform (weight k, level N, trivial character) is
 *  W(h) = (1/2π)∫σ|ĥ|², σ(t) = log N − 2 log 2π + 2 Re ψ(k/2 + it) − Σ_{log n < 2a} 2c(n) n^{−½} cos(t log n); L(f,s) is entire, so there are no
 *  pole terms. (b) N enters only as +log N‖h‖²; λ_min is concave in the rung amplitudes, so over the Ramanujan box |λ_f(p)| ≤ 2 the worst case
 *  is a vertex (worst tested vertex λ(p) = +2, two copies of the ζ rung). (c) Pointwise lemma: if c0(k,N) = log N − 2 log 2π + 2ψ(k/2) exceeds
 *  Σ_{n<e^{2a}} 4Λ(n)/√n then W ≥ 0 at support 2a for every such newform; c0(36,1) = 2.04892 > 2√2 log 2 = 1.96052, so every newform of
 *  weight ≥ 36 has W ≥ 0 at 2a ≤ log 3. (d) Bridge coercivity: σ ≥ c0 > 0 at every t iff c0 > 0; c0(k,1) > 0 for every k ≥ 14 (referee:
 *  not 16; vacuous at 14 since S_14(SL2(Z)) = 0), first level-1 cusp form Δ·E4 (c0 = 0.3555); weight 2 needs N ≥ 126; fails for ζ (−5.37),
 *  11a (−2.43), Δ (−0.27). (e) Rung reading (referee-corrected): for p ∤ N the 11a rung is 1/P_1(p^{−s}), P_1(T) = 1 − a_pT + pT² the H^1
 *  factor of Z(E_p,T) (Hasse = curve RH, route-27 type); for weight k > 2 (Δ) the rung is H^1_par(Sym^{k−2}) inside H^{k−1} of the
 *  (k−1)-dimensional Kuga–Sato variety, and Ramanujan follows from Deligne's Weil I, not from curve Hodge-index geometry.
 * CERTIFIED (Arb, python-flint 256-bit Legendre Galerkin; internal, one referee audit): W(h) ≥ c‖h‖² with c = 11a: 0.47430 (log 2),
 *  0.082536 (log 3), 3.3465e-3 (log 5), 2.3653e-4 (log 7), 4.8810e-6 (log 11), 7.2725e-7 (log 13), 3.2528e-8 (log 16); Δ: 0.084385, 1.2157e-3,
 *  2.0978e-7, 6.8856e-11 (log 2/3/5/7); Δ·E4: 0.57709, 0.071997, 9.8114e-5 (log 2/3/5). Family at 2a ≤ log 3: k = 2: N ≥ 30; 4: N ≥ 13; 6: N ≥ 8;
 *  8: N ≥ 5; 10: N ≥ 4; 12: N ≥ 3; 14–18: N ≥ 2; 20–34: every N; ≥ 36 by the lemma (minimum margin 0.027559 at (4,13)); at 2a ≤ log 4 every
 *  weight-2 newform with N ≥ 90 (margin 0.0982). The twin Δ·E4³ = 0.5171 f1 + 0.4829 f2 (no Euler product; 1012 multiplicativity failures)
 *  is certified positive at log 3 (1.2014), log 5 (0.40526), log 7 (0.0089588).
 * CONDITIONAL: Ramanujan (Deligne 1974; Eichler–Shimura + Hasse for weight 2) and modularity of elliptic curves over Q (cited); Arb digamma /
 *  Bessel / Legendre-root routines and the Gauss–Legendre error theorem (Trefethen, 64/15); Dobner 2020 (Λ ≥ 0 for the extended Selberg class),
 *  BLGHT 2011 Sato–Tate, Booker–Thorne 2014 (cited, not re-checked).
 * MEASURED: integer q-expansions and Hecke relations to 3000 (zero failures for eigenforms, failures for the twin); 11a a_p = point counts to 2000;
 *  Sato–Tate moments 11a 0.2433 / 0.1173, Δ 0.2382 / 0.1151 (predicted 1/4, 1/8); first zeros 11a 6.362614, Δ 9.222379, twin 2.655025; twin off-line
 *  zeros s = 12.18611 + 52.32047i and 12.26577 + 83.87546i (δ = 0.186, 0.266; referee Newton at 80 digits: simple zero, |L| ~ 7e-61); Ritz
 *  thresholds N0 = 27.7 (k = 2, log 3) and 81.8 (log 4).
 * HEURISTIC: margins track how low the first zero sits (uncertainty principle, not arithmetic); everything newly provable is conductor-driven
 *  (GL(1) Dirichlet families get the same trivially from |χ(p)| ≤ 1) and Euler-blind (the twin passes to log 7); GL(2) form of Conj 18.1
 *  (passivity) ⇔ GRH is an ANALOGY only (moved from proved by the referee); Faltings–Hriljac gives positivity of the Néron–Tate height, not GRH.
 *
 * Classical equivalences kept: Weil positivity at every support and ψ_f(x) = O(√x log² x) are equivalent to GRH for L(f,s), as are the 18.2 and
 * 18.4 analogues. No RH-level ladder statement becomes provable for GL(2); route-27 obstructions O1 (infinite rank) and O3 (no Hodge index across
 * rungs) unchanged. No Λ bound moves. PT Lambda <= 0.2 stands; RH open; NO QED. Import-free. ROUTE_26_ASSERTIONS recompute live: c0(k,N) by
 * digamma (signs, thresholds k ≥ 14, N ≥ 126, the k ≥ 36 lemma), Sato–Tate moments 1/4 and 1/8 by quadrature, the twin's off-line offsets, the
 * Ritz thresholds exp(−λ_min), and the certified ≤ Ritz bracketing of every stored pair.
 */

const { PI, abs, sqrt, log, exp, sin, cos } = Math;

export const ROUTE_26 = Object.freeze({
  id: 'route-26-gl2-twin-ladder-2026-10-12',
  route: 26,
  date: '2026-10-12',
  title: 'Route 26: twin ladder for GL(2) — Ramanujan is RH for each rung, not for the ladder; what becomes provable is conductor-driven and Euler-blind',
  status: 'done',
  headline: 'GL(2) twin ladders for 11a, Δ and Δ·E4 plus a weight-24 twin with no Euler product: Arb certifies Weil positivity at small support '
    + 'and a weight-by-weight family statement above level thresholds; Ramanujan (each rung\'s own RH: Hasse for weight 2, Deligne\'s Weil I for '
    + 'k > 2) makes no global ladder statement provable that is open for ζ.',

  c0: Object.freeze({ zeta: -5.37, e11a: -2.43, delta: -0.27, deltaE4: 0.3555, k14: 0.0698, w24: 1.21, k36: 2.04892, lemmaBoundLog3: 1.96052, weight2N: 126 }),
  arb: Object.freeze({
    e11a: Object.freeze([['log 2', 0.47430], ['log 3', 0.082536], ['log 5', 3.3465e-3], ['log 7', 2.3653e-4], ['log 11', 4.8810e-6], ['log 13', 7.2725e-7], ['log 16', 3.2528e-8]]),
    delta: Object.freeze([['log 2', 0.084385], ['log 3', 1.2157e-3], ['log 5', 2.0978e-7], ['log 7', 6.8856e-11]]),
    deltaE4: Object.freeze([['log 2', 0.57709], ['log 3', 0.071997], ['log 5', 9.8114e-5]]),
    twin: Object.freeze([['log 3', 1.2014], ['log 5', 0.40526], ['log 7', 0.0089588]]),
    twinLog11Floor: -1.35,
  }),
  family: Object.freeze({
    log3: Object.freeze([[2, 30], [4, 13], [6, 8], [8, 5], [10, 4], [12, 3], [14, 2], [16, 2], [18, 2]]), log3EveryN: 'k = 20..34 (Arb), k ≥ 36 (lemma)',
    minMargin: Object.freeze({ k: 4, N: 13, margin: 0.027559 }), log4Weight2: Object.freeze({ N: 90, margin: 0.0982 }),
    ritzN1WorstVertex: Object.freeze([[2, 'log 3', -3.316], [2, 'log 4', -4.394], [12, 'log 3', -0.779], [16, 'log 3', -0.274], [24, 'log 3', 0.447]]),
    ritzN0: Object.freeze({ k2log3: 27.7, k2log4: 81.8 }),
    k18N1: Object.freeze({ arbLower: Object.freeze([-0.068, -0.018]), ritzUpper: Object.freeze([-0.066, -0.0165]), deltaE6Lambda2: -1.458 }),
  }),
  // [certified lower bound, independent referee x-space Ritz upper bound]
  bracket: Object.freeze([['11a log 2', 0.47430, 0.47577], ['11a log 3', 0.082536, 0.083074], ['11a log 7', 2.3653e-4, 2.4132e-4], ['11a log 16', 3.2528e-8, 3.6428e-8],
    ['Δ log 3', 1.2157e-3, 1.2343e-3], ['Δ log 5', 2.0978e-7, 2.1860e-7], ['Δ log 7', 6.8856e-11, 7.609e-11], ['twin log 7', 8.9588e-3, 9.79e-3],
    ['(2,30,+2) log 3', 0.081699, 0.08508], ['(4,13,+2) log 3', 0.027559, 0.03054], ['(2,90,+2,+2) log 4', 0.098167, 0.10537]]),
  thresholdsSharp: Object.freeze([['(2,27,+2) log 3', -0.0203], ['(4,12,+2) log 3', -0.0495], ['(2,81,+2,+2) log 4', -2.6e-4]]),
  twin: Object.freeze({ mixing: Object.freeze([0.5171, 0.4829]), multiplicativityFailures: 1012, offline: Object.freeze([[12.18611, 52.32047], [12.26577, 83.87546]]),
    criticalLineSignChanges90: 49, thetaOverPi90: 53.13, firstZero: 2.655025 }),
  satoTate: Object.freeze({ e11a: Object.freeze([0.2433, 0.1173]), delta: Object.freeze([0.2382, 0.1151]), maxRamanujanRatio: Object.freeze({ e11a: 0.983, delta: 0.959 }) }),
  zeros: Object.freeze({ e11a: 6.362614, delta: 9.222379, zeta: 14.134725 }),

  refereeKilled: Object.freeze([
    'rung geometry overstated: the 11a rung is the H^1 numerator 1/P_1(p^{−s}) of Z(E_p,T), not "the zeta function of the reduced curve" (degree 1 at p | N); for weight k > 2 the rung is H^1_par(Sym^{k−2}) inside H^{k−1} of the (k−1)-dimensional Kuga–Sato variety, and Ramanujan is Deligne\'s Weil I, not route-27 curve Hodge-index geometry (only weight 2 is)',
    'proved → heuristic: GL(2) Conj 18.1 (passivity) ⇔ GRH is an analogy, neither derived nor cited (the Weil-criterion, ψ_f, 18.2 and 18.4 equivalences are classical and kept)',
    'threshold: c0(k,1) > 0 for every k ≥ 14 (c0(14,1) = +0.0698), not k ≥ 16; vacuous at 14 because S_14(SL2(Z)) = 0',
    '(18,1) wording: a negative certified LOWER bound is inconclusive; both vertices are negative by double-precision Ritz upper bounds (−0.066, −0.0165), so the vertex argument says nothing for Δ·E6 (λ(2) = −1.458), which needs its own certificate; level 1 at log 3 is covered for Δ, Δ·E4 and every k ≥ 20',
    '"above 2a ≈ 2.4–2.8 double precision cannot resolve the sign" describes the Fourier-side Ritz only; an x-space Legendre Ritz in double gives 3.6428e-8 at log 16 for 11a (stable to 0.1% between NB = 50 and 60)',
  ]),
  nextStep: '(1) Certify Δ·E6 (weight 18, level 1) at 2a ≤ log 3 on its own (the vertex argument fails there). (2) Find the support where the twin\'s '
    + 'Weil form first turns negative (off-line zero δ = 0.186 at γ = 52.3), using the x-space Legendre Ritz, which resolves signs in double precision '
    + 'well past 2a ≈ 2.8. (3) Optional GL(1) comparison: Dirichlet-character family thresholds (route 14) for the conductor-driven analogue.',
  files: Object.freeze(['tmp/routes-b7-r26-arb-cert.py', 'tmp/routes-b7-r26-results.json', 'tmp/routes-b7-r26-family.py', 'tmp/routes-b7-r26-family.json',
    'tmp/routes-b7-r26-xspace.py', 'tmp/routes-b7-r26-weil-scan.py', 'tmp/routes-b7-r26-twin-locate.py', 'tmp/routes-b7-r26-twin-offline-located.json',
    'tmp/routes-b7-r26-forms-lib.py', 'tmp/routes-b7-ref26-ritz.py', 'tmp/routes-b7-ref26-twin-zero.py']),
  verdict: 'No RH-level twin-ladder statement becomes provable for GL(2). Ramanujan is RH for each rung (Hasse for weight 2; Deligne\'s Weil I on the '
    + 'Kuga–Sato variety for k > 2); for ζ the rung statement is trivial, so Ramanujan supplies nothing missing for ζ. Weil positivity at every support '
    + 'and ψ_f = O(√x log² x) stay classically equivalent to GRH; route-27 obstructions O1 and O3 are unchanged. What becomes provable is '
    + 'conductor-driven (no pole terms, positive bridge delay once c0 > 0, family-uniform small-support positivity above level thresholds, '
    + 'Arb-certified) and Euler-blind (the no-Euler-product twin with numerically located off-line zeros passes the same certificates to log 7). '
    + 'Internal, one referee pass. No Λ bound moves. PT Lambda <= 0.2 stands; RH open; NO QED.',
});

const R = ROUTE_26;
const digamma = (x) => { let r = 0; let y = x; while (y < 10) { r -= 1 / y; y += 1; } const z = 1 / (y * y);
  return r + log(y) - 0.5 / y - z * (1 / 12 - z * (1 / 120 - z * (1 / 252 - z * (1 / 240 - z / 132)))); };
const c0 = (k, N) => log(N) - 2 * log(2 * PI) + 2 * digamma(k / 2);
const satoTateMoment = (m, n = 4000) => { let s = 0; const h = PI / n; // (2/π) ∫_0^π cos^m θ sin² θ dθ, Simpson
  for (let i = 0; i <= n; i += 1) { const th = i * h; s += (i === 0 || i === n ? 1 : (i % 2 ? 4 : 2)) * cos(th) ** m * sin(th) ** 2; } return ((2 / PI) * s * h) / 3; };

export const ROUTE_26_ASSERTIONS = Object.freeze([
  {
    id: 'r26-c0-values',
    holds: () => abs(c0(2, 11) - R.c0.e11a) < 5e-3 && abs(c0(12, 1) - R.c0.delta) < 7e-3 && abs(c0(16, 1) - R.c0.deltaE4) < 1e-4
      && abs(c0(14, 1) - R.c0.k14) < 1e-4 && abs(c0(24, 1) - R.c0.w24) < 5e-3 && c0(12, 1) < 0 && c0(14, 1) > 0
      && c0(2, R.c0.weight2N) > 0 && c0(2, R.c0.weight2N - 1) < 0,
    why: 'c0 = log N − 2 log 2π + 2ψ(k/2): 11a −2.432, Δ −0.264, k = 14 +0.0698 (threshold k ≥ 14, referee), Δ·E4 +0.3555, weight 24 +1.210; weight 2 positive exactly from N = 126.',
  },
  {
    id: 'r26-pointwise-lemma-k36',
    holds: () => { const bound = 4 * log(2) / sqrt(2); return abs(bound - R.c0.lemmaBoundLog3) < 1e-5 && abs(c0(36, 1) - R.c0.k36) < 1e-5
      && c0(36, 1) > bound && c0(34, 1) < bound; },
    why: 'At 2a ≤ log 3 the prime side is Σ_{n<3} 4Λ(n)/√n = 2√2 log 2 = 1.96052 < c0(36,1) = 2.04892, while c0(34,1) = 1.931 < 1.96052: the lemma starts exactly at k = 36; k = 20..34 are Arb-certified.',
  },
  {
    id: 'r26-sato-tate',
    holds: () => abs(satoTateMoment(2) - 0.25) < 1e-9 && abs(satoTateMoment(4) - 0.125) < 1e-9
      && [R.satoTate.e11a, R.satoTate.delta].every(([m2, m4]) => abs(m2 - 0.25) < 0.015 && abs(m4 - 0.125) < 0.012)
      && R.satoTate.maxRamanujanRatio.e11a < 1 && R.satoTate.maxRamanujanRatio.delta < 1,
    why: 'Sato–Tate E[x²] = 1/4, E[x⁴] = 1/8 (quadrature); measured 11a 0.2433 / 0.1173, Δ 0.2382 / 0.1151 to p ≤ 3000; Ramanujan ratios < 1.',
  },
  {
    id: 'r26-twin-offline',
    holds: () => { const t = R.twin; const offs = t.offline.map(([s]) => s - 12);
      return abs(t.mixing[0] + t.mixing[1] - 1) < 1e-9 && abs(offs[0] - 0.186) < 1e-3 && abs(offs[1] - 0.266) < 1e-3
        && t.criticalLineSignChanges90 < t.thetaOverPi90 && t.firstZero < R.zeros.e11a && R.zeros.e11a < R.zeros.delta && R.zeros.delta < R.zeros.zeta; },
    why: 'Δ·E4³ = 0.5171 f1 + 0.4829 f2 (normalised q-coefficient 1); off-line zeros at Re s − k/2 = 0.186, 0.266 (k = 24); 49 line sign changes vs θ/π = 53.13; first zeros 2.66 < 6.36 < 9.22 < 14.13 (margin ordering).',
  },
  {
    id: 'r26-family-thresholds',
    holds: () => { const f = R.family; const n0 = (lam) => exp(-lam);
      return abs(n0(-3.316) / f.ritzN0.k2log3 - 1) < 0.02 && abs(n0(-4.394) / f.ritzN0.k2log4 - 1) < 0.02
        && f.log3[0][1] > f.ritzN0.k2log3 && f.log4Weight2.N > f.ritzN0.k2log4 && f.log3.every(([, N], i, a) => i === 0 || N <= a[i - 1][1])
        && f.k18N1.ritzUpper.every((v) => v < 0) && f.k18N1.arbLower.every((v, i) => v <= f.k18N1.ritzUpper[i]) && R.thresholdsSharp.every(([, v]) => v < 0); },
    why: 'N enters as +log N‖h‖², so N0 = exp(−λ_min(N = 1)): 27.5 / 81.0 (Ritz 27.7 / 81.8) below the certified N ≥ 30 / 90; thresholds nonincreasing in k; (18,1) both vertices negative by Ritz upper bounds, so Δ·E6 is open; just-below thresholds Ritz-negative.',
  },
  {
    id: 'r26-certified-below-ritz',
    holds: () => R.bracket.every(([, lo, up]) => lo > 0 && lo <= up && up / lo < 1.2)
      && [R.arb.e11a, R.arb.delta, R.arb.deltaE4, R.arb.twin].every((rows) => rows.every(([, c], i, a) => c > 0 && (i === 0 || c < a[i - 1][1])))
      && R.family.minMargin.margin === 0.027559 && R.arb.twinLog11Floor < 0,
    why: 'Every certified lower bound sits below the referee\'s independent x-space Ritz upper bound (within 20%); margins positive and decreasing in support; twin method floor negative at log 11 (method limit, not a sign result).',
  },
  {
    id: 'r26-honest-scope',
    holds: () => R.status === 'done' && /PT Lambda <= 0\.2 stands/.test(R.verdict) && /NO QED/.test(R.verdict) && /Euler-blind/.test(R.verdict)
      && /Weil I/.test(R.verdict) && R.refereeKilled.length === 5 && R.refereeKilled.some((x) => /analogy/.test(x)),
    why: 'Ramanujan attributed per weight (Hasse / Weil I); 18.1 ⇔ GRH kept as analogy; certificates Euler-blind; no Λ change; no QED.',
  },
]);

export default ROUTE_26;
