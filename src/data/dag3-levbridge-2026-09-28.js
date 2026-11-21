/**
 * @fileoverview dag3-levbridge-2026-09-28 — Levinson bridge: the Levinson–Conrey proportion method read in twin-ladder
 * language, and a test of ladder-native (rung-truncated / Euler-product) and bridge-phase mollifiers against Conrey's
 * length-truncated μ-mollifier. Two adversarial referee passes; not refuted; corrections applied (one pass graded MAJOR
 * on framing): the finite-T κ_T tables are fixed-Q main-term proxies, not proportion statements; "worse than Conrey" is
 * measured, not proved; the collapse applies to PRIMORIAL truncation only (Radziwiłł–Soundararajan-type range-truncated
 * Euler-product mollifiers untested); most of the finite-T gap is length budget, not structure; the AFE weight-balance
 * sum is heuristic; BCY finite-T gain not attributable to the bridge; literature (Kühn–Robles–Zeindler 2019, Sono 2018,
 * CFKLT 2025) acknowledged; dictionary items are restatements of Levinson 1974 / Conrey 1989 / Farmer 1993.
 *
 * PROVED (elementary; restatements of classical facts, not new results):
 *  - Levinson's exact identity: Z(t) = 2 Re[e^{iθ(t)}(ζ + ζ'/(2θ'(t)))(1/2+it)] (from Z' real); χ(1/2+it) = e^{−2iθ(t)},
 *    Z² = ζ(s)ζ(1−s) — Z is the geometric mean of direct and dual arm; Levinson's V = ζ + ζ'/L replaces 2θ' by L.
 *  - Under Q'(x) = Q'(1−x): e^{iθ} Q(−(1/L)d/ds) ζ = Q(1/2 + (i/L) d/dt) Z + O(θ''), so Re[e^{iθ}V] = Q(1/2) Z + O(1/t)
 *    (odd powers of i d/dt are imaginary on real Z). Q(x)+Q(1−x) = const is the direct/dual weight balance.
 *  - For fixed (Q, R): the best Levinson–Conrey functional over any support restriction (primorial divisors, z-smooth,
 *    Euler products with free per-rung weights) is ≤ the best over all coefficients of length ≤ T^θ (weak inequality;
 *    says nothing about Conrey's specific μ·P mollifier).
 *  - A pure phase multiplier e^{iφ(t)} leaves |Vψ| and hence the AM-GM functional unchanged (max diff 1.8e-15). The
 *    analytic bridge multiplier χ(s + 1/2 − σ0) is NOT an admissible mollifier for the Littlewood step (poles near
 *    Re s = 1 − R/L, → 0 as σ → ∞ breaks c_1 = 1).
 *  - Σ_{h,k | P(z)} μ(h)μ(k)/[h,k] = Π_{p≤z}(1 − 1/p) (exact; recomputed below).
 * CONDITIONAL (on the Balasubramanian–Conrey–Heath-Brown twisted second moment, support ≤ T^{1/2}; arbitrary-coefficient
 *  range extends to θ < 17/33 by Bettin–Chandee–Radziwiłł): the exact primorial Euler product ψ_z = Π_{p≤z}(1 − p^{−s})
 *  has M ~ Π(1−1/p) C_R L → ∞, so its κ → −∞ at each FIXED R. The sup-over-R limit is heuristic (optimal R grows
 *  1.9 → 3.6 from T = 1e4 to 1e24).
 * MEASURED (finite-T main-term proxy, L = log T, fixed asymptotic Q; no error-term control; zeros below 6e5 are all
 *  verified, so these measure method efficiency only):
 *  - Asymptotic Conrey c reproduced: Levinson 0.34276 (R = 1.287), θ = 1/2 deg-5 Q 0.365796 (lit 0.36581), θ = 4/7 0.408953 (lit 0.4088).
 *  - Length-truncated reference (best of Conrey-optimal P and P = x), θ = 1/2, T = 1e4/1e5/1e6: 0.488/0.468/0.453;
 *    exact primorial Euler product 0.361/0.334/0.262; θ = 4/7: 0.533/0.513/0.497 vs 0.349/0.323/0.286.
 *  - Equal-length control: Conrey at y = primorial scores 0.370 vs Euler 0.361 (T = 1e4, length 30) and 0.360 vs 0.262
 *    (T = 1e6, length 210): at T = 1e4 only 0.009 of the gap is structural; at 1e6, 0.098 of 0.184.
 *  - Primorial Euler κ_T for T = 1e4..1e24: +0.361, +0.262, +0.191, +0.100, +0.028, −0.014, −0.055 (sign change 1e16–1e20);
 *    M_E/(M_none·Mertens) 1.264 → 1.083.
 *  - With Q re-optimised per family the proxy rises to 0.76–0.92 and the Levinson projection error reaches 32–89%:
 *    the proxy is meaningful only for comparisons at fixed Q.
 *  - Direct integration T = 1e4 (exact N(T,2T) = 12349): pre-AM-GM Littlewood 0.8134 for every smooth mollifier and none;
 *    after AM-GM Conrey 0.5007, Euler 0.3866, none −0.3945 (R = 1.3). Main term vs direct mean square ≤ 3.3e-4.
 *  - BCY bridge piece ψ2 at T = 1e4: +0.0216/+0.0198/+0.0164 (R = 1.3/1.5/1.9) after AM-GM, 0 before; measured against a
 *    first piece not optimised for finite T (free coefficients alone gain ≈ +0.06), so not attributable to the bridge.
 * HEURISTIC:
 *  - Sieve reading: Conrey = Selberg-type weights truncated in length; primorial Euler product = Legendre sieve truncated
 *    by prime size, removing only the Mertens fraction ~1/log log T.
 *  - NS-RIGID placement: the only non-soft Levinson input, and the only one outside the native span E_V, is the
 *    length-truncated μ-mollifier with its twisted second moment (point masses at log h ≤ θ log T, t-averaged on
 *    Re s < 1/2, evaluated with a_n = 1, multiplicativity, Kloosterman bounds for θ > 1/2). Bridge phase, dual arm,
 *    Q-operator, Littlewood + AM-GM are soft functional-equation data.
 *  - AFE weight-balance sum Re[e^{iθ}V] ≈ Σ[Q(x_n)+Q(1−x_n)] n^{−1/2} cos(θ − t log n): holds only to O(t^{−1/4});
 *    measured absolute error 0.028–0.055 at t ~ 1e4.
 *
 * Verdict: no proportion statement, no Λ movement. RH open; no refereed bound is changed; the project's Λ ≤ 0.1758354 is an
 * unreviewed computer-assisted candidate; NO QED.
 * Scripts: tmp/dag3-levbridge-{conrey-c,mainterm,mt-convergence,ladder-vs-conrey,euler-asymptotics,direct,dictionary}.py
 * (+ .json/.log); referee: tmp/dag3-levbridge-ref0-{asym,finiteT,euler}.py, tmp/dag3-levbridge-ref1-{Rscan,fairness,conreyQ}.py.
 * Import-free. ASSERTIONS recompute Levinson's asymptotic κ (Young's form, Gauss–Legendre), the Mertens identity by
 * enumeration, the Euler-sweep sign change, and the fixed-Q ordering / equal-length decomposition from baked literals.
 */

// Gauss–Legendre nodes on [0,1] (n = 20) via Newton on P_n
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
const GL = gaussLegendre01(20);

/** Young's form: c = P(1)²Q(0)² + (1/θ)∫∫ e^{2Rv}[RθP(u)Q(v) + P'(u)Q(v) + θP(u)Q'(v)]² du dv; Levinson P = x, Q = 1 − x. */
export function levinsonKappa(R, theta = 0.5) {
  let s = 0;
  for (let i = 0; i < GL.x.length; i++) for (let j = 0; j < GL.x.length; j++) {
    const u = GL.x[i], v = GL.x[j];
    const g = R * theta * u * (1 - v) + (1 - v) - theta * u;
    s += GL.w[i] * GL.w[j] * Math.exp(2 * R * v) * g * g;
  }
  const c = 1 + s / theta;
  return 1 - Math.log(c) / R;
}

export const DAG3_LEVBRIDGE = Object.freeze({
  id: 'dag3-levbridge-2026-09-28',
  date: '2026-09-28',
  title: 'Levinson bridge: ladder-native and bridge-phase mollifiers vs the length-truncated μ-mollifier',
  status:
    'MEASURED + HEURISTIC, two referee passes (one MAJOR on framing; corrections applied). Proved content is classical restatement '
    + 'plus a weak support-restriction inequality. Primorial Euler-product mollifiers score below the length-truncated reference in a '
    + 'fixed-Q main-term proxy (not a proportion statement) and collapse at fixed R conditional on BCHB; range-truncated Euler products '
    + 'untested. The one non-soft Levinson input outside E_V is the length-truncated μ-mollifier + twisted second moment (heuristic '
    + 'placement). No proportion or Λ bound moves. NO QED.',
  verdict:
    'Levinson’s method in ladder language: bridge phase, dual arm, Q-operator and Littlewood + AM-GM are soft functional-equation data; '
    + 'the length-truncated μ-mollifier with its twisted second moment is the only non-soft input and lies outside E_V (heuristic; '
    + 'consistent with NS-RIGID). Primorial (rung-truncated) Euler-product mollifiers are not a route (measured at fixed Q; conditional '
    + 'collapse). Bridge-phase multipliers are AM-GM-blind; the additive bridge piece is BCY’s ψ2 (+0.0017 asymptotically). RH open; '
    + 'no refereed bound is changed. NO QED.',
  asymptotic: {
    levinson: { theta: 0.5, R: 1.286909, kappa: 0.34276162692910 },
    conreyHalf: { theta: 0.5, kappa: 0.365796, lit: 0.36581 },
    conrey47: { theta: 4 / 7, R: 1.2913, kappa: 0.408953, lit: 0.4088 },
    literature: { bcy: 0.4105, feng: 0.4128, przz: 0.417293962 },
  },
  finiteT: {
    Ts: [1e4, 1e5, 1e6],
    half: { lengthTruncatedRef: [0.488, 0.468, 0.453], conreyAsymP: [0.475, 0.459, 0.446], eulerExact: [0.361, 0.334, 0.262],
      eulerPerRung: [0.363, 0.335, 0.263], bestPrimorial: [0.364, 0.336, 0.264], bestFull: [0.536, 0.510, 0.490], conreySmooth: [0.377, 0.376, 0.368] },
    fourSevenths: { lengthTruncatedRef: [0.533, 0.513, 0.497], conreyAsymP: [0.520, 0.504, 0.491], eulerExact: [0.349, 0.323, 0.286], bestFull: [0.581, 0.554, 0.533] },
    equalLength: [
      // T, primorial length, Conrey at y = primorial, Euler exact, Conrey at y = T^{1/2}
      [1e4, 30, 0.3697, 0.3605, 0.4754], [1e6, 210, 0.3600, 0.2624, 0.4461],
    ],
    qReoptimised: { conrey1e4: 0.818, euler1e4: 0.757, bestPrimorial1e4: 0.868, bestPrimorial1e6: 0.918, projectionErrorRange: [0.32, 0.89], fixedQProjectionError: [0.033, 0.10] },
    caveat: 'main-term proxy with L = log T and fixed asymptotic Q; not a proportion statement; θ = 4/7 restricted-support main terms not covered by a theorem',
  },
  eulerSweep: {
    Ts: [1e4, 1e6, 1e8, 1e12, 1e16, 1e20, 1e24],
    kappa: [0.361, 0.262, 0.191, 0.100, 0.028, -0.014, -0.055],
    optimalR: [1.9, 2.2, 2.5, 2.8, 3.2, 3.4, 3.6],
    ratioToMertens: [1.264, 1.083],
    scope: 'exact primorial truncation Π_{p≤z}(1 − p^{−s}), P(z) ≤ T^{1/2}; range-truncated (Radziwiłł–Soundararajan) Euler products not tested',
  },
  directT1e4: {
    exactZeroCount: 12349, R: [1.3, 1.5, 1.9],
    preAMGM: [0.8134, 0.7757, 0.6977], conreyAfterAMGM: [0.5007, 0.4896, 0.4509], eulerAfterAMGM13: 0.3866, noneAfterAMGM13: -0.3945,
    bcyGain: [0.0216, 0.0198, 0.0164], bcyPreAMGMGain: 0, mainVsDirectMaxRel: 3.3e-4,
  },
  dictionaryChecks: { bridgeIdentity: 1e-26, levinsonExact: 1.6e-26, qVersionL2thetaPrime: [3e-7, 6e-6], qVersionLlogT: [0.01, 0.11], afeSumAbsErr: [0.028, 0.055] },
  refereeCorrections: [
    'AFE weight-balance sum moved from proved to heuristic (error O(t^{−1/4}), measured 0.028–0.055); operator identity kept as proved.',
    'Finite-T reference = best of {Conrey optimal P, P = x}; P = x beats the asymptotic P at every tested T.',
    '"Ladder-native < Conrey" is measured; proved is only restricted ≤ unrestricted at fixed (Q, R).',
    'Sup-over-R collapse is heuristic; fixed-R κ → −∞ is conditional on BCHB.',
    'κ_T proxy is gameable by re-optimising Q (0.76–0.92, projection error 32–89%): comparisons valid only at fixed Q.',
    'Most of the T = 1e4 gap is length budget (equal-length Conrey 0.370 vs Euler 0.361), not structure.',
    'Scope restricted to primorial truncation; Radziwiłł–Soundararajan / Heap–Radziwiłł–Soundararajan range-truncated Euler products untested.',
    'Bridge multiplier is AM-GM-blind and not admissible for the Littlewood step; BCY finite-T +0.02 not attributable to the bridge.',
    'Literature: generalised χ-twisted mollifiers (Kühn–Robles–Zeindler 2019; Sono 2018); CFKLT 2025 on optimising Q; dictionary items restate Levinson 1974 / Conrey 1989 / Farmer 1993.',
    'Main-term Gram is numerically fragile (1e-7 shift of the evaluation point moves M from 1.81 to 36.9 at R = 0.6); original exact-point values reproduced.',
  ],
  tiers: {
    proved: ['Levinson exact identity', 'operator form Re[e^{iθ}V] = Q(1/2)Z + O(1/t) under Q\'(x) = Q\'(1−x)', 'support-restriction weak inequality', 'phase multiplier AM-GM-blind', 'Mertens identity Σ μμ/[h,k] = Π(1 − 1/p)'],
    certified: [],
    conditional: ['primorial Euler product κ → −∞ at fixed R (BCHB)'],
    measured: ['asymptotic c reproduced', 'finite-T fixed-Q proxy tables', 'equal-length control', 'Euler sweep to 1e24', 'direct T = 1e4 AM-GM loss', 'BCY finite-T gain'],
    heuristic: ['sieve reading', 'NS-RIGID placement of the μ-mollifier', 'AFE weight-balance sum', 'sup-over-R collapse'],
  },
  nextStep:
    'Test a range-truncated (Radziwiłł–Soundararajan) Euler-product mollifier in the same fixed-Q proxy before recording any Euler-product no-go; '
    + 'measure the AM-GM gap at T = 1e5, 3e5 by direct evaluation (2–3 h each); add the length-graded Möbius measure Σ μ(h)P(log(y/h)/log y)h^{−1/2}δ_{log h} '
    + 'with its twisted-second-moment Gram as a named NS-RIGID object.',
  scripts: [
    'tmp/dag3-levbridge-conrey-c.py', 'tmp/dag3-levbridge-mainterm.py', 'tmp/dag3-levbridge-mt-convergence.py', 'tmp/dag3-levbridge-ladder-vs-conrey.py',
    'tmp/dag3-levbridge-euler-asymptotics.py', 'tmp/dag3-levbridge-direct.py', 'tmp/dag3-levbridge-dictionary.py',
    'tmp/dag3-levbridge-ref0-asym.py', 'tmp/dag3-levbridge-ref0-finiteT.py', 'tmp/dag3-levbridge-ref0-euler.py',
    'tmp/dag3-levbridge-ref1-Rscan.py', 'tmp/dag3-levbridge-ref1-fairness.py', 'tmp/dag3-levbridge-ref1-conreyQ.py',
  ],
});

const M = DAG3_LEVBRIDGE;

export const DAG3_LEVBRIDGE_ASSERTIONS = Object.freeze([
  {
    id: 'levbridge-levinson-kappa-recomputed',
    holds: () => {
      // golden-section over R on [0.8, 2]
      let a = 0.8, b = 2.0; const g = (Math.sqrt(5) - 1) / 2;
      for (let i = 0; i < 80; i++) { const c = b - g * (b - a), d = a + g * (b - a); if (levinsonKappa(c) > levinsonKappa(d)) b = d; else a = c; }
      const R = (a + b) / 2, k = levinsonKappa(R);
      return Math.abs(k - M.asymptotic.levinson.kappa) < 1e-6 && Math.abs(R - M.asymptotic.levinson.R) < 2e-3;
    },
    why: 'Levinson P = x, Q = 1 − x, θ = 1/2: κ = 1 − log c / R maximised at R ≈ 1.2869 gives 0.342762 (Young’s form, Gauss–Legendre 20×20).',
  },
  {
    id: 'levbridge-mertens-identity-enumerated',
    holds: () => {
      const primes = [2, 3, 5, 7, 11];
      const divs = []; for (let m = 0; m < 1 << primes.length; m++) { let d = 1, mu = 1; primes.forEach((p, i) => { if (m >> i & 1) { d *= p; mu = -mu; } }); divs.push([d, mu]); }
      const gcdN = (x, y) => (y ? gcdN(y, x % y) : x);
      let s = 0; for (const [h, mh] of divs) for (const [k, mk] of divs) s += (mh * mk) / (h * k / gcdN(h, k));
      const prod = primes.reduce((acc, p) => acc * (1 - 1 / p), 1);
      return Math.abs(s - prod) < 1e-14;
    },
    why: 'Σ_{h,k | P(z)} μ(h)μ(k)/[h,k] = Π_{p≤z}(1 − 1/p): the primorial mollifier removes only the Mertens fraction of the leading term.',
  },
  {
    id: 'levbridge-euler-sweep-sign-change',
    holds: () => {
      const e = M.eulerSweep; const k = e.kappa;
      const dec = k.every((x, i) => i === 0 || x < k[i - 1]);
      const i16 = e.Ts.indexOf(1e16), i20 = e.Ts.indexOf(1e20);
      const rUp = e.optimalR.every((x, i) => i === 0 || x > e.optimalR[i - 1]);
      return dec && k[i16] > 0 && k[i20] < 0 && rUp && e.ratioToMertens[1] < e.ratioToMertens[0] && e.ratioToMertens[1] > 1;
    },
    why: 'Primorial Euler κ_T decreases monotonically and turns negative between 1e16 and 1e20; optimal R grows (so the sup-over-R limit is heuristic).',
  },
  {
    id: 'levbridge-fixed-Q-ordering-and-weak-inequality',
    holds: () => {
      const h = M.finiteT.half, f = M.finiteT.fourSevenths;
      const ok1 = [0, 1, 2].every((i) => h.bestFull[i] >= h.lengthTruncatedRef[i] && h.lengthTruncatedRef[i] >= h.conreyAsymP[i]
        && h.conreyAsymP[i] > h.eulerExact[i] && h.bestPrimorial[i] >= h.eulerPerRung[i] && h.eulerPerRung[i] >= h.eulerExact[i]
        && h.bestFull[i] >= h.bestPrimorial[i]);
      const ok2 = [0, 1, 2].every((i) => f.bestFull[i] >= f.lengthTruncatedRef[i] && f.lengthTruncatedRef[i] >= f.conreyAsymP[i] && f.conreyAsymP[i] > f.eulerExact[i]);
      return ok1 && ok2;
    },
    why: 'At fixed Q: best-full ≥ best-primorial ≥ per-rung ≥ exact Euler (weak inclusion inequality) and length-truncated ≥ Conrey-asym-P > Euler at every tested T, θ.',
  },
  {
    id: 'levbridge-equal-length-decomposition',
    holds: () => {
      const [a, b] = M.finiteT.equalLength;
      const s1 = a[2] - a[3], g1 = a[4] - a[3], s2 = b[2] - b[3], g2 = b[4] - b[3];
      return Math.abs(s1 - 0.0092) < 1e-3 && Math.abs(g1 - 0.1149) < 1e-3 && s1 / g1 < 0.1 && Math.abs(s2 - 0.0976) < 1e-3 && Math.abs(g2 - 0.1837) < 1e-3
        && a[1] <= Math.sqrt(a[0]) && b[1] <= Math.sqrt(b[0]) && a[1] === 2 * 3 * 5 && b[1] === 2 * 3 * 5 * 7;
    },
    why: 'At equal length (y = primorial ≤ T^{1/2}), the structural part of the Conrey–Euler gap is 0.009 of 0.115 at T = 1e4 and 0.098 of 0.184 at 1e6.',
  },
  {
    id: 'levbridge-proxy-gameable-by-Q',
    holds: () => {
      const q = M.finiteT.qReoptimised, h = M.finiteT.half;
      return q.euler1e4 > h.conreyAsymP[0] && q.conrey1e4 > q.euler1e4 && q.projectionErrorRange[0] > q.fixedQProjectionError[1];
    },
    why: 'Re-optimising Q lifts Euler (0.757) above fixed-Q Conrey (0.475) with projection error ≥ 32%: the κ_T proxy is only meaningful at fixed Q.',
  },
  {
    id: 'levbridge-amgm-loss-and-bcy',
    holds: () => {
      const d = M.directT1e4;
      return d.preAMGM.every((x, i) => x > d.conreyAfterAMGM[i]) && Math.abs(d.preAMGM[0] - d.conreyAfterAMGM[0] - 0.3127) < 1e-3
        && d.bcyPreAMGMGain === 0 && d.bcyGain.every((x) => x > 0 && x < 0.03) && M.asymptotic.literature.bcy - M.asymptotic.conrey47.lit < 0.002;
    },
    why: 'At T = 1e4 about 0.31 of the proportion is lost in the AM-GM step; the BCY bridge piece acts only there (asymptotic +0.0017).',
  },
  {
    id: 'levbridge-literature-reproduced',
    holds: () => {
      const a = M.asymptotic;
      return Math.abs(a.conreyHalf.kappa - a.conreyHalf.lit) < 2e-5 && Math.abs(a.conrey47.kappa - a.conrey47.lit) < 2e-4
        && a.literature.przz > a.literature.feng && a.literature.feng > a.literature.bcy && a.literature.bcy > a.conrey47.lit;
    },
    why: 'Conrey 0.36581 / 0.4088 reproduced; ladder BCY 0.4105 < Feng 0.4128 < PRZZ 0.417294.',
  },
  {
    id: 'levbridge-honest-scope',
    holds: () => /refereed bound is changed/i.test(M.verdict) && /NO QED/.test(M.verdict) && /NO QED/.test(M.status)
      && /not a proportion statement/.test(M.status) && /untested/.test(M.status) && M.tiers.certified.length === 0
      && /heuristic/.test(M.verdict),
    why: 'Referee corrections: proxy not a proportion statement; primorial scope; NS-RIGID placement heuristic; nothing certified.',
  },
]);

export default DAG3_LEVBRIDGE;
