/**
 * @fileoverview ns3-eulermoll-2026-09-29 — Euler-product mollifiers against the length-weighted Möbius (Conrey/Levinson)
 * mollifier at equal length T^{1/2}, in the dag3 fixed-Q twisted-second-moment main-term proxy. Settles the dag3-levbridge
 * open item "range-truncated (Radziwiłł–Soundararajan) Euler products untested". Two adversarial referee passes; not
 * refuted; one pass graded MAJOR on framing. Corrections applied:
 *  - the reference is a FIXED-polynomial reference (best of asymptotic P0 and P = x); a converged 5-coefficient finite-T
 *    Conrey optimum is higher (0.5078 / 0.4646 / 0.4255 at 1e4 / 1e6 / 1e10), so every listed gap is conservative;
 *  - the small-prime Euler tilt is a larger and more parameter-efficient finite-T lever than first reported (joint
 *    P5 + 6-prime tilt beats an 11-coefficient P by +0.0093 / +0.0057 / +0.0018), still decaying with T; at 1e16 only a
 *    fixed-R gain over Levinson exists and the tilted Levinson (0.3962) stays below the Conrey-P0 reference (0.3972);
 *  - hybrid "gap → 0, never changes sign" is heuristic; measured gap·L drifts upward 0.244 → 0.265 and depends on the
 *    normalisation (≈ 0.17 under a global h^{R/(2L)} tilt at 1e4);
 *  - sharp-edge κ → −∞ at fixed R for u > 1 is measured/heuristic (linear fit 1e10..1e14); only u = 1 is classical;
 *  - primorial κ values are measured (conditional only in their asymptotic reading);
 *  - the verdict is narrowed to Euler-product REPLACEMENTS of the Möbius coefficients; the no-go is the expected outcome
 *    (Conrey's P solves the asymptotic extremal problem; RS Euler products were built for distributional bounds, not
 *    proportions) and is recorded as numerical confirmation, not a new obstruction;
 *  - literal RS parameters: the first-interval endpoint T^{1/l1²} is ≤ 1.00012 for T ≤ 1e40 (report said ≤ 1.0001).
 *
 * PROVED (elementary):
 *  - F(a1,a2) = Σ_{h,k} c_h c_k h'^{a1} k'^{a2}/[h,k] = Σ_e W_e(a1+a2) A_e(a1) A_e(a2), h' = h/(h,k), k' = k/(h,k),
 *    W_e(u) = e^{−1} Σ_{d|e} μ(d) d^{u−1}, A_e(a) = Σ_m c_{em} m^{a−1} (any coefficients; O(y log y)). Recomputed below.
 *  - Block multiplicativity: disjoint prime-set blocks give F = Π_j F_j.
 *  - Local tilt identity: for z = p^{−1/2}e^{iφ}, φ uniform, E|(1−wz)/(1−z)|² = 1 + (1−w)²/(p−1) ≥ 1 (equality iff w = 1).
 *    Recomputed below by quadrature.
 *  - Literal RS (Inventiones 2015) parameters l1 = 2⌈100 log log T⌉, first interval (1, T^{1/l1²}] contain no prime for
 *    every T ≤ 1e40, so that construction is ψ = 1 at every height considered (asymptotic parameters inert at finite T;
 *    RS 2015 is an upper-bound device for quadratic-twist moments, not a Levinson mollifier). Recomputed below.
 * CONDITIONAL (on the Balasubramanian–Conrey–Heath-Brown twisted second moment, support ≤ T^{1/2−ε}):
 *  - every κ_T is the main term of that asymptotic with L = log T and a fixed Q; a proportion statement would also need
 *    error terms, the Littlewood step and the AM-GM step. Sharp Möbius (u = 1): P(0) ≠ 0 gives the log-divergent term,
 *    κ → −∞ at fixed R.
 * MEASURED (fixed-Q0 main-term proxy; Q0 = dag3 degree-5 Conrey-optimal Q; not a proportion statement):
 *  - engine vs dense dag3 Gram ≤ 6.0e-10 rel.; block evaluator vs engine ≤ 5.2e-13; referee's independent dense evaluator
 *    reproduces every checked entry to 4 decimals at 1e4, 1e6, 1e10.
 *  - Fixed-polynomial reference 0.4876 / 0.4530 / 0.4178 / 0.3972 (1e4 / 1e6 / 1e10 / 1e16; 1e16 exact over all
 *    60,792,694 squarefree n ≤ 1e8). Converged P5 finite-T optimum 0.5078 / 0.4646 / 0.4255 (1e4 / 1e6 / 1e10).
 *  - Range-truncated sharp best 0.4141 / 0.3188 / 0.2358 / 0.1915; sharp Möbius 0.0935 / −0.0262 / −0.1667; range-restricted
 *    Levinson (y_s = y^{2/3}) 0.4626 / 0.4305 / 0.4020 / 0.3840; RS Ω-capped blocks best 0.4141 / 0.3328 / 0.2222 / 0.1498 /
 *    0.0897 (to 1e24; 1e40 partial −0.021; θ_eff 0.404 → 0.225; 848 of 60,794 squarefree n ≤ y at 1e10); truncated-exp
 *    RS variant 0.3116 / 0.2130 / 0.0974; primorial 0.3605 / 0.2624 / 0.1408 / 0.0278; hybrid E_2 × rough Levinson 0.4601 /
 *    0.4353 / 0.4069 / 0.3884 (gap·L 0.253, 0.244, 0.251, 0.256, 0.261, 0.265 at 1e4..1e16).
 *  - Small-prime tilt: over Levinson +0.0071 / +0.0032 / +0.0012 / ≥ +0.00057 (1e16, fixed R); against converged P5:
 *    frozen-P tilt +0.0043 / +0.0042 / +0.0027, joint P5 + tilt6 +0.0133 / +0.0085 / +0.0040, P11 +0.0040 / +0.0028 / +0.0022.
 *  - Sharp-edge slope dM/dL at R = 1.5: u = 1 0.371, u = 2 0.112 (ratio 0.302 vs Dickman ρ(2) = 0.307), u = 3 0.0217.
 *  - σ0-centring (c_h → c_h h^δ) does not rescue range-truncated or sharp families (referee, 1e4); ordering unchanged
 *    under Levinson's linear Q.
 * HEURISTIC: hybrid gap → 0 like c(z0)/L without sign change; tilt gain → 0 (w_p → 1 optimal by the tilt identity); RS
 *  family optimum declines without bound (caps vs budget force β_J → 0); edge slope tracks ρ(u) (u = 3 not converged).
 *
 * Verdict: no proportion or Λ statement. RH open; no refereed bound is changed; the project's Λ ≤ 0.1758354 is an unreviewed
 * computer-assisted candidate; NO QED.
 * Scripts: tmp/ns3-eulermoll-*.{c,py} (+ .json/.jsonl/.log); referee: tmp/ns3-eulermoll-ref0-{dense,e1e10,sigma0}.py,
 * tmp/ns3-eulermoll-ref1-tiltcheck.py (+ -T1e+04/06/10.json).
 * Import-light (imports only the import-free dag3-levbridge module for Levinson's κ). ASSERTIONS recompute the gcd/Möbius
 * identity on random vectors, the tilt identity by quadrature, the literal-RS empty interval, Q(1e8) and Q(1e5), the
 * asymptotic κ for Q0 with P0 and P = x (Young's form), Dickman ρ(2), and orderings / gaps from baked literals.
 */

import { levinsonKappa } from './dag3-levbridge-2026-09-28.js';

// ---------- live helpers ----------
function gaussLegendre01(n) {
  const x = [], w = [];
  for (let i = 1; i <= n; i++) {
    let z = Math.cos(Math.PI * (i - 0.25) / (n + 0.5)), pp = 0;
    for (let it = 0; it < 100; it++) {
      let p1 = 1, p2 = 0;
      for (let j = 1; j <= n; j++) { const p3 = p2; p2 = p1; p1 = ((2 * j - 1) * z * p2 - (j - 1) * p3) / j; }
      pp = n * (z * p1 - p2) / (z * z - 1);
      const dz = p1 / pp; z -= dz; if (Math.abs(dz) < 1e-16) break;
    }
    x.push((1 - z) / 2); w.push(1 / ((1 - z * z) * pp * pp));
  }
  return { x, w };
}
const GL = gaussLegendre01(32);

function mobiusSieve(n) {
  const mu = new Int8Array(n + 1).fill(1), comp = new Uint8Array(n + 1);
  for (let p = 2; p <= n; p++) {
    if (comp[p]) continue;
    for (let m = p; m <= n; m += p) { if (m > p) comp[m] = 1; mu[m] = -mu[m]; }
    for (let m = p * p; m <= n; m += p * p) mu[m] = 0;
  }
  mu[0] = 0; return mu;
}
/** Q(x) = #{n ≤ x squarefree} = Σ_{d ≤ √x} μ(d) ⌊x/d²⌋. */
export function squarefreeCount(x) {
  const r = Math.floor(Math.sqrt(x)); const mu = mobiusSieve(r); let s = 0;
  for (let d = 1; d <= r; d++) if (mu[d]) s += mu[d] * Math.floor(x / (d * d));
  return s;
}

/** Young's form for general P, Q (coefficient arrays, power basis): c and κ = 1 − log c / R. */
const polyEv = (c, x) => c.reduceRight((a, b) => a * x + b, 0);
const polyDer = (c) => c.slice(1).map((a, i) => a * (i + 1));
function youngKappa(P, Q, R, theta = 0.5) {
  const dP = polyDer(P), dQ = polyDer(Q); let s = 0;
  for (let i = 0; i < GL.x.length; i++) for (let j = 0; j < GL.x.length; j++) {
    const u = GL.x[i], v = GL.x[j], pu = polyEv(P, u), qv = polyEv(Q, v);
    const g = R * theta * pu * qv + polyEv(dP, u) * qv + theta * pu * polyEv(dQ, v);
    s += GL.w[i] * GL.w[j] * Math.exp(2 * R * v) * g * g;
  }
  const c = polyEv(P, 1) ** 2 * polyEv(Q, 0) ** 2 + s / theta;
  return 1 - Math.log(c) / R;
}
function maxOverR(f, a = 0.5, b = 3) {
  const g = (Math.sqrt(5) - 1) / 2;
  for (let i = 0; i < 90; i++) { const c = b - g * (b - a), d = a + g * (b - a); if (f(c) > f(d)) b = d; else a = c; }
  const R = (a + b) / 2; return { R, kappa: f(R) };
}
const pAdd = (a, b) => { const n = Math.max(a.length, b.length); return Array.from({ length: n }, (_, i) => (a[i] || 0) + (b[i] || 0)); };
const pMul = (a, b) => { const r = new Array(a.length + b.length - 1).fill(0); a.forEach((x, i) => b.forEach((y, j) => { r[i + j] += x * y; })); return r; };
const pPow = (a, m) => { let r = [1]; for (let i = 0; i < m; i++) r = pMul(r, a); return r; };
/** dag3 parametrisation: P(x) = x + Σ_k pc_k x(1−x)^k; Q(y) = 1 − Σ q_m + Σ q_m (1−2y)^m, m = 1, 3, 5. */
function pFromPc(pc) { let c = [0, 1]; pc.forEach((a, j) => { c = pAdd(c, pMul([0, 1], pPow([1, -1], j + 1)).map((t) => a * t)); }); return c; }
function qFromOdd(qc) { let c = [1 - qc.reduce((a, b) => a + b, 0)]; qc.forEach((a, j) => { c = pAdd(c, pPow([1, -2], 2 * j + 1).map((t) => a * t)); }); return c; }

// deterministic PRNG for the identity check
function lcg(seed) { let s = seed >>> 0; return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296 - 0.5; }; }
const gcd = (a, b) => (b ? gcd(b, a % b) : a);

export const NS3_EULERMOLL = Object.freeze({
  id: 'ns3-eulermoll-2026-09-29',
  date: '2026-09-29',
  title: 'Euler-product mollifiers vs the length-weighted Möbius mollifier at equal length T^{1/2}',
  status:
    'MEASURED (fixed-Q0 main-term proxy, not a proportion statement) + HEURISTIC; two referee passes (one MAJOR on framing; corrections '
    + 'applied). Proved content: an exact O(y log y) evaluation identity for the twisted-second-moment main term, block multiplicativity, a '
    + 'local tilt identity, and the fact that literal RS 2015 parameters give ψ = 1 at every T ≤ 1e40. No tested Euler-product replacement of '
    + 'the Möbius coefficients reaches the length-weighted Möbius mollifier at T = 1e4..1e16; a small-prime Euler tilt of the Möbius mollifier is '
    + 'a finite-T lever that decays with T. Search space finite, Q fixed. No proportion or Λ bound moves. NO QED.',
  verdict:
    'In the fixed-Q0 main-term proxy at support T^{1/2}, no tested Euler-product replacement (range-truncated, RS-type Ω-capped blocks, '
    + 'truncated-exp, primorial, GHK-type hybrid) reaches the length-weighted Möbius mollifier at T = 1e4 to 1e16 (measured; expected, since '
    + 'Conrey’s P solves the asymptotic extremal problem and RS Euler products were built for distributional bounds). Losses: sparse support / '
    + 'length efficiency (RS θ_eff 0.404 → 0.225), sharp edges (dM/dL ≈ 0.37·ρ(u) at fixed R, heuristic for u > 1), length reallocation (hybrid, '
    + 'gap·L 0.244–0.265, drifting up; sign persistence heuristic). A multiplicative small-prime tilt gives a finite-T gain larger per parameter '
    + 'than extra polynomial degrees, decaying from +0.013 (1e4) to +0.004 (1e10) against a converged P5; w_p → 1 is optimal in the limit '
    + '(heuristic from the proved tilt identity). Main term only. RH open; no refereed bound is changed; the project’s Λ ≤ 0.1758354 is an '
    + 'unreviewed computer-assisted candidate. NO QED.',
  Ts: [1e4, 1e6, 1e10, 1e16],
  asymptotic: {
    theta: 0.5,
    Q0odd: [0.6641946276112116, -0.21764885661522648, 0.06497059406869543],
    P0pc: [-0.27812597299467534, 0.15907617555809878, -0.014808132253707671],
    conreyP0: { kappa: 0.365796, R: 1.4750 },
    levinsonPxQ0: { kappa: 0.359030, R: 1.4659 },
  },
  reference: {
    fixedPolynomial: [0.4876, 0.4530, 0.4178, 0.3972], // best of Conrey μ·P0, Levinson μ·x; 1e16 exact at y = 1e8
    levinsonPx: [0.4876, 0.4530, 0.4178, 0.395602],
    conreyP0: [0.4754, 0.4461, 0.4161, 0.397184],
    convergedP5: [0.50778, 0.46459, 0.42551], // referee Nelder–Mead, 1e4/1e6/1e10
    authorP5: [0.50355, 0.46198, 0.42399], // under-converged coordinate search (tilt2)
    squarefreeAt1e8: 60792694,
  },
  families: {
    rangeTruncSharpBest: [0.4141, 0.3188, 0.2358, 0.1915],
    sharpMobius: [0.0935, -0.0262, -0.1667],
    rangeRestrictedLevinson: [0.4626, 0.4305, 0.4020, 0.3840],
    rsBlockBest: [0.4141, 0.3328, 0.2222, 0.1498, 0.0897], // + 1e24
    rsBlockBest1e40Partial: -0.021,
    rsThetaEff: [0.404, 0.344, 0.267, 0.225],
    rsSupport1e10: { used: 848, squarefreeUpToY: 60794, structure: '8 × (1 + 14 + 91)' },
    rsTruncExp: [0.3116, 0.2130, 0.0974],
    literalRSUnmollified: [-0.071, -0.170, -0.277, -0.361],
    primorial: [0.3605, 0.2624, 0.1408, 0.0278],
    hybridE2Rough: [0.4601, 0.4353, 0.4069, 0.3884],
    hybridDoubleCounted: [0.2825, 0.2451, 0.2070],
    hybridGapL: { Ts: [1e4, 1e6, 1e10, 1e12, 1e14, 1e16], gapL: [0.253, 0.244, 0.251, 0.256, 0.261, 0.265],
      levinson1e12: 0.40805, hybrid1e12: 0.39879, levinson1e14: 0.40097, hybrid1e14: 0.39288, globalTiltGapL1e4: 0.17 },
    formalUntruncatedBeta018: { T1e10: 0.271, T1e100: 0.236, admissible: false },
  },
  tilt: {
    overLevinson: [0.0071, 0.0032, 0.0012, 0.00057],
    tiltedLevinson1e16: 0.396174,
    // referee converged comparison, 1e4 / 1e6 / 1e10
    P5: [0.50778, 0.46459, 0.42551],
    P5frozenTilt6: [0.51212, 0.46878, 0.42824],
    P5tilt6joint: [0.52111, 0.47307, 0.42950],
    P11: [0.51181, 0.46735, 0.42771],
    optimalWeights1e4Frozen: [1.046, 1.099, 1.081],
  },
  edge: { R: 1.5, slope: { u1: 0.371, u2: 0.112, u3: 0.0217 }, ratioU2: [0.302, 0.311], ratioU3: [0.059, 0.066], rho3: 0.0486 },
  sigma0Referee1e4: { deltas: ['0', 'R/(2L)', 'R/L'], levinson: [0.4876, 0.4887, 0.4594], rangeTrunc: [0.4141, 0.3736, 0.2935],
    hybrid: [0.4601, 0.4703, 0.4580], sharp: [0.0935, -0.2932, -0.7314] },
  validation: { engineVsDense: 6.0e-10, blockVsEngine: 5.2e-13, pcutTail: [7.5e-5, 7.8e-5] },
  refereeCorrections: [
    'Reference relabelled as fixed-polynomial (asymptotic P0 or P = x); converged finite-T P5 optimum 0.5078 / 0.4646 / 0.4255 added; all gaps are conservative.',
    'Tilt: "survives a parameter-matched P re-optimisation" was false as stated (5 vs 5 + 6 parameters, frozen P). Converged: joint P5 + tilt6 +0.0133 / +0.0085 / +0.0040; P11 +0.0040 / +0.0028 / +0.0022; tilt excess over P11 +0.0093 / +0.0057 / +0.0018 (decays).',
    'At 1e16 only a fixed-R gain over Levinson (+0.00057) exists; tilted Levinson 0.3962 < Conrey-P0 reference 0.3972; a Conrey-P0 tilt at 1e16 was not run.',
    'Hybrid: gap·L 0.244–0.265 drifting upward; "→ 0 without sign change" is heuristic; c(2) depends on normalisation (≈ 0.17 under a global h^{R/(2L)} tilt at 1e4).',
    'Sharp range truncation κ → −∞ at fixed R for u > 1 moved to measured/heuristic (linear fit 1e10..1e14); u = 1 (P(0) ≠ 0) stays conditional on BCHB.',
    'Primorial κ values are measured numbers (their fixed-R collapse is the conditional statement).',
    'Verdict narrowed to Euler-product REPLACEMENTS; the no-go is an expected result (Conrey P extremal; RS built for distributional bounds), recorded as numerical confirmation.',
    'Literal RS: first-interval endpoint ≤ 1.00012 (not ≤ 1.0001) for T ≤ 1e40; the construction is an upper-bound device for quadratic-twist moments.',
    'Attribution: BBLR (JEMS 2020) is a twisted-fourth-moment paper with no Euler-product mollifier; RS Inventiones 2015 vs L’Enseignement 2017 shapes both tested; KRZ 2019 / Sono 2018 / PRZZ 2020 cited from abstracts only.',
    'σ0-centred variants (c_h → c_h h^δ) checked at 1e4 by the referee: the 1/2-centred convention does not handicap the Euler families.',
  ],
  tiers: {
    proved: ['gcd/Möbius evaluation identity', 'block multiplicativity', 'local tilt identity', 'literal RS parameters give ψ = 1 for T ≤ 1e40'],
    certified: [],
    conditional: ['every κ_T is the BCHB main term (support ≤ T^{1/2−ε})', 'sharp Möbius (u = 1) κ → −∞ at fixed R'],
    measured: ['fixed-polynomial reference and converged P5', 'range-truncated / sharp / range-restricted tables', 'RS block and truncated-exp optima (lower bounds on the family supremum)',
      'primorial κ to 1e16', 'hybrid κ and gap·L to 1e16', 'tilt gains (converged referee comparison)', 'edge slopes 1e10..1e14', 'σ0-centring and linear-Q robustness'],
    heuristic: ['hybrid gap → 0 without sign change', 'tilt gain → 0', 'RS family optimum declines without bound', 'edge slope ∝ ρ(u); u > 1 fixed-R collapse'],
  },
  gaps: [
    'Single fixed Q (Q0 + linear-Q check): re-optimising Q makes the proxy gameable (dag3).',
    'RS search finite (≤ 3 capped blocks, caps ≤ 24); 1e40 partial; RS optima are lower bounds.',
    'θ = 4/7 not run (arbitrary-coefficient main term is a theorem only for θ < 1/2 or < 17/33).',
    'Sharp Möbius and z0 = 5 hybrid at 1e16 stopped for budget; 1e16 tilt is a fixed-R lower bound.',
    'No closed-form asymptotic κ for range-restricted-with-weight mollifiers (Buchstab two-piece main term not derived).',
    'Main-term proxy only: no error terms, no proportion or Λ statement.',
  ],
  nextStep:
    'Finite-T headroom is in free coefficients (converged P5 0.5078 and dag3 unconstrained 0.536 at 1e4 vs fixed-polynomial 0.4876), not in Euler '
    + 'structure. Extend the C engine to return G·c and run conjugate gradient for the constrained optimum at T = 1e10 and 1e16 (y up to 1e8): measures '
    + 'how much free-coefficient headroom survives with T and whether the small-prime tilt is its low-order projection. No proportion claim either way.',
  scripts: [
    'tmp/ns3-eulermoll-engine.c', 'tmp/ns3-eulermoll-core.py', 'tmp/ns3-eulermoll-families.py', 'tmp/ns3-eulermoll-blockeval.py', 'tmp/ns3-eulermoll-sweep.py',
    'tmp/ns3-eulermoll-T16.py', 'tmp/ns3-eulermoll-rs-search.py', 'tmp/ns3-eulermoll-rs-local.py', 'tmp/ns3-eulermoll-rs-bigcap.py', 'tmp/ns3-eulermoll-rs-chains.py',
    'tmp/ns3-eulermoll-tilt.py', 'tmp/ns3-eulermoll-tilt2.py', 'tmp/ns3-eulermoll-tilt16b.py', 'tmp/ns3-eulermoll-hybrid-gapL.py', 'tmp/ns3-eulermoll-fixedR.py',
    'tmp/ns3-eulermoll-edge-fit.py', 'tmp/ns3-eulermoll-lengthcurve.py', 'tmp/ns3-eulermoll-formal-euler.py', 'tmp/ns3-eulermoll-Qlin.py', 'tmp/ns3-eulermoll-asym.py',
    'tmp/ns3-eulermoll-summary.py', 'tmp/ns3-eulermoll-summary.json',
    'tmp/ns3-eulermoll-ref0-dense.py', 'tmp/ns3-eulermoll-ref0-e1e10.py', 'tmp/ns3-eulermoll-ref0-sigma0.py', 'tmp/ns3-eulermoll-ref1-tiltcheck.py',
  ],
});

const M = NS3_EULERMOLL;
const inc = (a) => a.every((x, i) => i === 0 || x > a[i - 1]);
const dec = (a) => a.every((x, i) => i === 0 || x < a[i - 1]);

export const NS3_EULERMOLL_ASSERTIONS = Object.freeze([
  {
    id: 'eulermoll-gcd-mobius-identity',
    holds: () => {
      const y = 48, mu = mobiusSieve(y), rnd = lcg(20260929);
      const c = Array.from({ length: y + 1 }, (_, n) => (n === 0 ? 0 : rnd()));
      for (const [a1, a2] of [[0.3, -0.2], [0.11, 0.47], [-0.4, -0.25]]) {
        let direct = 0;
        for (let h = 1; h <= y; h++) for (let k = 1; k <= y; k++) { const g = gcd(h, k); direct += c[h] * c[k] * (h / g) ** a1 * (k / g) ** a2 / (h * k / g); }
        let fast = 0; const u = a1 + a2;
        for (let e = 1; e <= y; e++) {
          let W = 0; for (let d = 1; d <= e; d++) if (e % d === 0 && mu[d]) W += mu[d] * d ** (u - 1); W /= e;
          let A1 = 0, A2 = 0; for (let m = 1; e * m <= y; m++) { A1 += c[e * m] * m ** (a1 - 1); A2 += c[e * m] * m ** (a2 - 1); }
          fast += W * A1 * A2;
        }
        if (Math.abs(direct - fast) > 1e-11 * Math.max(1, Math.abs(direct))) return false;
      }
      return true;
    },
    why: 'F = Σ c_h c_k h′^{a1} k′^{a2}/[h,k] equals Σ_e W_e(a1+a2) A_e(a1) A_e(a2) for arbitrary (non-squarefree) coefficients (random vector, n ≤ 48).',
  },
  {
    id: 'eulermoll-tilt-identity-quadrature',
    holds: () => {
      const K = 512;
      for (const p of [2, 3, 5, 13]) for (const w of [0.7, 1, 1.08, 1.4]) {
        const r = p ** -0.5; let s = 0;
        for (let j = 0; j < K; j++) {
          const ph = 2 * Math.PI * j / K, zr = r * Math.cos(ph), zi = r * Math.sin(ph);
          const nr = 1 - w * zr, ni = -w * zi, dr = 1 - zr, di = -zi;
          s += (nr * nr + ni * ni) / (dr * dr + di * di);
        }
        const exact = 1 + (1 - w) ** 2 / (p - 1);
        if (Math.abs(s / K - exact) > 1e-12 || exact < 1) return false;
      }
      return true;
    },
    why: 'E|(1 − wz)/(1 − z)|² = 1 + (1 − w)²/(p − 1) ≥ 1 with equality only at w = 1: asymptotically the tilt costs, so w_p → 1 (gain decays).',
  },
  {
    id: 'eulermoll-literal-rs-empty-first-interval',
    holds: () => {
      let maxEnd = 0;
      for (let e = 4; e <= 40; e++) {
        const L = e * Math.LN10, l1 = 2 * Math.ceil(100 * Math.log(L)), end = Math.exp(L / (l1 * l1));
        maxEnd = Math.max(maxEnd, end);
        if (!(end < 2) || !(L < 0.69 * l1 * l1)) return false;
      }
      return maxEnd <= 1.00012 && maxEnd > 1.0001;
    },
    why: 'l1 = 2⌈100 log log T⌉: the first RS interval (1, T^{1/l1²}] ends at ≤ 1.00012 for T ≤ 1e40 (corrected from 1.0001), so the literal construction is ψ = 1.',
  },
  {
    id: 'eulermoll-squarefree-counts',
    holds: () => squarefreeCount(1e8) === M.reference.squarefreeAt1e8 && squarefreeCount(1e5) === M.families.rsSupport1e10.squarefreeUpToY
      && 8 * (1 + 14 + 91) === M.families.rsSupport1e10.used && Math.abs(M.families.rsSupport1e10.used / 60794 - 0.014) < 0.001,
    why: 'Q(1e8) = 60,792,694 (the exact 1e16 reference support); Q(1e5) = 60,794 and the best RS support at 1e10 uses 848 = 8·(1+14+91) of them (1.4%).',
  },
  {
    id: 'eulermoll-asymptotic-kappa-Q0',
    holds: () => {
      const a = M.asymptotic, Q = qFromOdd(a.Q0odd);
      const c0 = maxOverR((R) => youngKappa(pFromPc(a.P0pc), Q, R));
      const cx = maxOverR((R) => youngKappa([0, 1], Q, R));
      const lev = maxOverR((R) => levinsonKappa(R), 0.8, 2);
      return Math.abs(c0.kappa - a.conreyP0.kappa) < 2e-6 && Math.abs(c0.R - a.conreyP0.R) < 2e-3
        && Math.abs(cx.kappa - a.levinsonPxQ0.kappa) < 2e-6 && Math.abs(lev.kappa - 0.342762) < 2e-6 && c0.kappa > cx.kappa && cx.kappa > lev.kappa;
    },
    why: 'Young’s form with Q0: Conrey P0 0.365796 (R 1.475) > P = x 0.359030 > Levinson P = x, Q = 1 − x 0.342762 (asymptotic, θ = 1/2).',
  },
  {
    id: 'eulermoll-no-euler-replacement-reaches-reference',
    holds: () => {
      const r = M.reference.fixedPolynomial, f = M.families;
      const below = (arr) => arr.every((x, i) => i >= r.length || x < r[i]);
      return [f.rangeTruncSharpBest, f.sharpMobius, f.rangeRestrictedLevinson, f.rsBlockBest, f.rsTruncExp, f.primorial, f.hybridE2Rough, f.hybridDoubleCounted].every(below)
        && M.reference.convergedP5.every((x, i) => x > r[i]) && dec(f.rsBlockBest) && dec(f.rsThetaEff) && f.rsBlockBest1e40Partial < 0
        && dec(f.primorial) && dec(f.rangeTruncSharpBest)
        && r.every((x, i) => i === 3 || Math.abs(x - Math.max(M.reference.levinsonPx[i], M.reference.conreyP0[i])) < 1e-9)
        && Math.abs(r[3] - 0.3972) < 1e-4 && M.reference.conreyP0[3] > M.reference.levinsonPx[3];
    },
    why: 'Every Euler replacement family is below the fixed-polynomial reference at every tested T, and the converged P5 optimum lies higher still (gaps conservative); RS optimum and θ_eff decline with T.',
  },
  {
    id: 'eulermoll-hybrid-gapL-drifts-up',
    holds: () => {
      const h = M.families.hybridGapL, lev = M.reference.levinsonPx, hy = M.families.hybridE2Rough;
      const recomputed = [[1e4, lev[0], hy[0]], [1e6, lev[1], hy[1]], [1e10, lev[2], hy[2]], [1e12, h.levinson1e12, h.hybrid1e12],
        [1e14, h.levinson1e14, h.hybrid1e14], [1e16, lev[3], hy[3]]].map(([T, a, b]) => (a - b) * Math.log(T));
      const okRe = recomputed.every((x, i) => Math.abs(x - h.gapL[i]) < 0.006);
      return okRe && h.gapL.every((x) => x > 0.24 && x < 0.27) && inc(h.gapL.slice(1)) && h.globalTiltGapL1e4 < h.gapL[0];
    },
    why: 'gap·L recomputed from baked κ: 0.253, 0.244 → 0.265 (increasing from 1e6), positive throughout; normalisation-dependent (≈ 0.17 under a global tilt), so c(z0)/L is heuristic.',
  },
  {
    id: 'eulermoll-tilt-parameter-efficient-and-decaying',
    holds: () => {
      const t = M.tilt;
      const jointGain = t.P5tilt6joint.map((x, i) => x - t.P5[i]), p11Gain = t.P11.map((x, i) => x - t.P5[i]);
      const excess = t.P5tilt6joint.map((x, i) => x - t.P11[i]), frozen = t.P5frozenTilt6.map((x, i) => x - t.P5[i]);
      const close = (a, b) => a.every((x, i) => Math.abs(x - b[i]) < 1.5e-4);
      return close(jointGain, [0.0133, 0.0085, 0.0040]) && close(p11Gain, [0.0040, 0.0028, 0.0022]) && close(excess, [0.0093, 0.0057, 0.0018])
        && close(frozen, [0.0043, 0.0042, 0.0027]) && dec(jointGain) && dec(excess) && excess.every((x) => x > 0)
        && dec(t.overLevinson) && t.tiltedLevinson1e16 < M.reference.conreyP0[3]
        && M.reference.authorP5.every((x, i) => x < M.reference.convergedP5[i]);
    },
    why: 'Joint P5 + 6-prime tilt beats P11 at equal parameter count by +0.0093 / +0.0057 / +0.0018 (decaying); at 1e16 the tilted Levinson 0.3962 stays below Conrey-P0 0.3972.',
  },
  {
    id: 'eulermoll-edge-slope-tracks-dickman',
    holds: () => {
      const rho2 = 1 - Math.LN2, e = M.edge;
      return Math.abs(rho2 - 0.3069) < 1e-4 && e.ratioU2.every((x) => Math.abs(x - rho2) < 0.01)
        && Math.abs(e.slope.u2 / e.slope.u1 - e.ratioU2[0]) < 2e-3 && e.ratioU3.every((x) => x > e.rho3);
    },
    why: 'Sharp-edge growth ratio b(2)/b(1) = 0.302–0.311 vs Dickman ρ(2) = 1 − ln 2 = 0.307; u = 3 (0.059–0.066 vs 0.049) not converged — heuristic.',
  },
  {
    id: 'eulermoll-sigma0-does-not-rescue',
    holds: () => {
      const s = M.sigma0Referee1e4;
      return [0, 1, 2].every((i) => s.levinson[i] > s.hybrid[i] && s.hybrid[i] > s.rangeTrunc[i] && s.rangeTrunc[i] > s.sharp[i])
        && Math.max(...s.rangeTrunc) === s.rangeTrunc[0] && Math.max(...s.sharp) === s.sharp[0];
    },
    why: 'Referee σ0-centring test at 1e4 (δ = 0, R/(2L), R/L): ordering Levinson > hybrid > range-truncated > sharp unchanged; δ = 0 is best for the Euler families.',
  },
  {
    id: 'eulermoll-honest-scope',
    holds: () => /refereed bound is changed/i.test(M.verdict) && /NO QED/.test(M.verdict) && /NO QED/.test(M.status)
      && /not a proportion statement/.test(M.status) && M.tiers.certified.length === 0 && /heuristic/.test(M.verdict)
      && /REPLACEMENTS/.test(M.refereeCorrections.join(' ')) && /unreviewed/.test(M.verdict),
    why: 'Main-term proxy only; nothing certified; asymptotic readings heuristic; the candidate stays an unreviewed computer-assisted candidate.',
  },
]);

export default NS3_EULERMOLL;
