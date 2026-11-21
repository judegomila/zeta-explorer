/**
 * @fileoverview ns3-locallev-2026-09-29 — Local (window) Levinson certificates as a candidate input for the conditional
 * mirror flow-descent hypothesis H_desc-mirror (rh-bridge-mirror-descent-2026-09-25, imp-97053). Measures the shortest
 * window [T, T+H] in which a Littlewood–Levinson certificate built from computed ζ values certifies zeros on the line,
 * compares with the analytic short-interval tiers, and records why a proportion certificate cannot supply the local zero
 * surplus H_desc-mirror needs. Two adversarial referee passes, both minor; not refuted; the core computation was
 * reproduced independently at T = 1e4 (Euler–Maclaurin ζ) and spot-checked with mpmath at 1e6. Corrections applied:
 *  - the "99% of windows" row quoted as fixed-parameter is the per-window-best row; fixed (R = 1.1, θ = 1/2): 16 / 48 / 24;
 *  - step-1 cost ≤ 2 zeros per window is MEASURED (median 1.00, max 2.00), not proved; only the identity is proved;
 *  - the every-window tail model under-predicts its own T = 1e6 sample (model 28–32, observed 40 on a finer n grid), so the
 *    extrapolated 1.6e2–6e2 spacings is probably low; full range over the three fits 61–1103;
 *  - "all sampled windows 20 / 48 / 40" compares samples of different size; not a T-scaling;
 *  - close-pair failure rates rest on 4/9, 9/23, 28/93 windows (n = 8);
 *  - the functional-equation item is a structural argument about this certificate family, not a theorem;
 *  - the 1.73× surplus is model-based (imp-97053 neutral rigid-lattice Palm model), so "H_desc needs a 1.73× surplus" is
 *    heuristic; the obstruction is restated as: every sound certificate has N_0(W) ≤ N(W), the analytic tier sees only the
 *    average density, and the measured density near close pairs is neutral (1.005×);
 *  - the analytic every-window POSITIVITY tier (odd-order zero of Z in [T, T+H]: H = T^{1/6+ε}, Moser/Karatsuba, from
 *    memory) is ~1.8–2.6 orders above 8.6 spacings; the 3.8–8.3 orders figure is the positive-PROPORTION tier;
 *  - median H_min 2 vs 3 is inside the 0.06-zero quadrature floor: "2–3 spacings, T-independent";
 *  - loss-breakdown medians do not add (8 − 1.00 − 0.59 − 4.03 = 2.38 vs median result 2.30);
 *  - PRZZ proportion ≈ 0.417294 (not 0.4174); the environment had no scipy or python-flint (nothing interval-certified).
 *
 * PROVED (classical restatements):
 *  - Window Littlewood–Levinson inequality: N_0(W) ≥ (Δθ + Δ_h arg V)/π − 1 − (L/(πR))·[∫_W log|Vψ(σ0+it)| − ∫_W log|Vψ(3+it)|
 *    + ∫_{σ0}^{3}(arg Vψ(σ+it_b) − arg Vψ(σ+it_a))dσ], V = ζ + ζ'/L, σ0 = 1/2 − R/L; Jensen gives the mean-square version.
 *  - Step-1 identity: e^{iθ}(ζ + ζ'/L)(1/2+it) = (1 − θ'/L)Z(t) − iZ'(t)/L, so Re[e^{iθ}V] = (1 − θ'/L)Z. Recomputed below on a
 *    synthetic pair (the identity uses only ζ = e^{−iθ}Z and d/ds = −i d/dt).
 *  - Elementary bound: any sound certificate has N_0(W) ≤ N(W); in the imp-97053 neutral Palm model the mirror-weighted
 *    count 2.530 is below p_req = 4.37 even if every zero is real.
 * CONDITIONAL: none of the analytic tiers was re-checked against sources (no network); recalled: Selberg T^{1/2+ε} (positive
 *  proportion), Karatsuba 1984 T^{27/82+ε} (positive proportion), Hardy–Littlewood T^{1/4+ε} / Moser T^{1/6}log²T /
 *  Karatsuba T^{1/6+ε} (odd-order zero of Z), Karatsuba almost-all-T H = T^ε (average statement, MV-CAP).
 * MEASURED (float64 AFE + interpolated mpmath remainder, ζ error ~1e-7; quadrature floor ~0.06 zeros; not certified):
 *  - H_min median window 2–3 spacings at T = 1e4 / 1e5 / 1e6; fixed-parameter 99%: 16 / 48 / 24; per-window-best 99%:
 *    16 / 24 / 20; all sampled windows fixed 20 / 48 / 40, per-window best 16 / 48 / 32; actual-log certificate 3 / 4 / 5;
 *    global mean square substituted in every window: 8 / 8 / 8.
 *  - Mean certificate 0.351n − 0.99, 0.354n − 0.83, 0.363n − 0.78 (median turns positive at n ≈ 2.2–2.8); sd ≈ 0.92n^0.23,
 *    0.76n^0.40, 0.71n^0.45 (heavy lower tail). Slope consistent with the asymptotic θ = 1/2 Levinson constant.
 *  - Loss at T = 1e6, n = 8: step 1 1.00, Littlewood 0.59, Jensen 4.03 (medians); median result 2.30, κ_W = 0.288; κ_W = 0.351
 *    at n = 64. θ = 1.25 at T = 1e4 (outside every theorem): κ_W 0.646 / 0.717 at n = 8 / 96.
 *  - Close pairs (gap < 0.25 spacing), n = 8: failure 4/9, 9/23, 28/93 vs ~9–11% overall. Density within ±4 spacings of
 *    close pairs 1.005× that of all pairs (±2: 1.035; ±8: 0.999), zeros #500001..#1000000 — neutral, not 1.73×.
 *  - Functional-equation checks: reflected-arm modulus identity 5.4e-11 (1e4) / 3.8e-15 (1e6); step-1 identity 1e-25.
 * HEURISTIC: every-window extrapolation to [3e12, 7.5e16]: 165–634 spacings (T = 1e6 fit; probably low), 61–1103 across fits;
 *  polylog growth in T; the windows H_desc needs (around close pairs) are the ones where the certificate is weakest; the
 *  neutral density suggests the constant-p hypothesis H_desc-mirror is itself atypical.
 *
 * Verdict: no bound moves. RH open; no refereed bound is changed; the project's Λ ≤ 0.1758354 is an unreviewed computer-assisted
 * candidate; NO QED.
 * Scripts: tmp/ns3-locallev-{zeta,test-zeta,window,analyze,hmin,ldev,palm,closepair-density,reflection}.py (+ .json/.npz);
 * referee: tmp/ns3-locallev-ref0-{em,analyze,fixed99,mp1e6}.py, tmp/ns3-locallev-ref1-hmin.py.
 * Import-light (imports only the import-free dag3-levbridge module for Levinson's κ). ASSERTIONS recompute the analytic-tier
 * spacing counts, the Palm surplus arithmetic, the step-1 identity on a synthetic pair, the linear-fit crossings, the
 * binomial interval for the 4/9 close-pair sample, and the corrected tables' internal consistency.
 */

import { levinsonKappa } from './dag3-levbridge-2026-09-28.js';

const spacingsIn = (H, T) => H * Math.log(T / (2 * Math.PI)) / (2 * Math.PI);

/** Exact (Clopper–Pearson) 95% interval for k successes out of n, by bisection on the binomial CDF. */
function binomCdf(k, n, p) { let s = 0, t = (1 - p) ** n; for (let i = 0; i <= k; i++) { s += t; t *= ((n - i) / (i + 1)) * (p / (1 - p)); } return s; }
function clopperPearson(k, n, alpha = 0.05) {
  const bis = (f) => { let a = 0, b = 1; for (let i = 0; i < 80; i++) { const m = (a + b) / 2; if (f(m)) b = m; else a = m; } return (a + b) / 2; };
  const lo = k === 0 ? 0 : bis((p) => 1 - binomCdf(k - 1, n, p) >= alpha / 2);
  const hi = k === n ? 1 : bis((p) => binomCdf(k, n, p) <= alpha / 2);
  return [lo, hi];
}

export const NS3_LOCALLEV = Object.freeze({
  id: 'ns3-locallev-2026-09-29',
  date: '2026-09-29',
  title: 'Local Levinson certificates vs the H_desc-mirror window: length and density obstructions',
  status:
    'MEASURED (float64, not interval-certified) + HEURISTIC; two referee passes (minor; independent recomputation at T = 1e4 and mpmath spot-check '
    + 'at 1e6 reproduce the tables; corrections applied). Proved content is the classical window Littlewood–Levinson inequality, the step-1 identity '
    + 'and N_0(W) ≤ N(W). A data-driven window certificate reaches 2–3 spacings in the median window but 16–48 in the worst sampled window; analytic '
    + 'tiers sit ≥ 1.8 orders (positivity) and ≥ 3.8 orders (proportion) above the ~8.6-spacing H_desc window; a proportion certificate cannot supply '
    + 'the model-based 1.73× local surplus. No bound moves. NO QED.',
  verdict:
    'Local Levinson is not a route to H_desc-mirror, on two grounds. (1) Window length: analytic every-window tiers start at T^{1/6+ε} for positivity '
    + '(~5e2 spacings at 3e12, ~1.8 orders above 8.6) and T^{27/82+ε} for positive proportion (5.5e4 spacings, 3.8 orders; 5.9–8.3 orders for T^{1/2}); '
    + 'below that MV-CAP blocks every-window control, and the data-driven certificate is a verification computation weaker than the argument principle '
    + 'on the same data. (2) Count vs density: every sound certificate has N_0(W) ≤ N(W); the neutral Palm count 2.530 is below p_req = 4.37 even if every '
    + 'zero is real, and the measured density near close pairs is neutral (1.005×), so the required ~1.73× surplus (model-based, heuristic) is not '
    + 'supplied by any window length and appears atypical in itself. Certificates fail most often around close pairs (28/93 at n = 8, T = 1e6, vs ~11%). '
    + 'The functional equation couples each height only to itself (structural argument). RH open; no refereed bound is changed; the project’s '
    + 'Λ ≤ 0.1758354 is an unreviewed computer-assisted candidate. NO QED.',
  Ts: [1e4, 1e5, 1e6],
  sample: { zeros: [707, 2310, 5719], spans: [600, 1500, 3000], windows: [2.8e3, 9.2e3, 2.2e4], endpointStep: 0.25, droppedEndpointsFrac: 0.015 },
  hmin: {
    medianFixed: [3, 3, 2], medianPerWindow: [3, 2, 2], medianMargin1e6H2: 0.02, quadratureFloor: 0.06,
    p99Fixed: [16, 48, 24], p99PerWindow: [16, 24, 20],
    allFixed: [20, 48, 40], allFixedCoarseGrid: [20, 48, 48], allPerWindow: [16, 48, 32],
    actualLog: [3, 4, 5], globalMeanSquare: [8, 8, 8],
    worstWindow1e6: { nFail: 38, certFail: -0.357, nPass: 40, certPass: 0.417, t: 1002250 },
    fixedParamsNote: 'fixed rows use R chosen per H (best median), θ = 1/2; e.g. R = 0.8 at H = 1, 1.4 for H ≥ 64 at 1e6',
  },
  meanCert: { slope: [0.351, 0.354, 0.363], intercept: [-0.99, -0.83, -0.78], sdCoef: [0.92, 0.76, 0.71], sdExp: [0.23, 0.40, 0.45] },
  loss1e6n8: { N: 8, step1: 1.00, littlewood: 0.59, jensen: 4.03, medianResult: 2.30, kappaW: 0.288, kappaW64: 0.351, noMollifier: -6.0 },
  longMollifier1e4: { theta: 1.25, R: 0.8, kappaW8: 0.646, kappaW96: 0.717, theta1: { kappaW8: 0.554, kappaW96: 0.638 } },
  closePairs: {
    gap: 0.25, n8: { fails: [4, 9, 28], windows: [9, 23, 93], overall: [0.093, 0.093, 0.11] },
    densityRatio: { pm2: 1.035, pm4: 1.005, pm8: 0.999 }, zeroRange: '#500001..#1000000',
  },
  palm: { mirrorCountNeutral: 2.530, fracOfMean: 0.376, pReq: 4.37, surplus: 1.73, source: 'src/data/rh-bridge-mirror-descent-2026-09-25.js (C1)' },
  hdescWindowSpacings: 8.6,
  extrapolation: { fit1e6: [165, 634], fit1e5: [124, 1103], fit1e4: [61, 131], inSampleModel1e6: [28, 32], inSampleObserved1e6: 40, seam: [122, 348], firstRange1e6: [57, 77] },
  analyticTiers: [
    { name: 'odd-order zero of Z (positivity)', exponent: 1 / 6, who: 'Moser T^{1/6}log²T; Karatsuba T^{1/6+ε} (from memory)' },
    { name: 'positive proportion (Karatsuba 1984)', exponent: 27 / 82, who: 'Karatsuba, Selberg method, no explicit constant (from memory)' },
    { name: 'positive proportion (Selberg range)', exponent: 1 / 2, who: 'Selberg T^{1/2+ε}' },
  ],
  heights: [3e12, 7.5e16],
  feChecks: { reflected1e4: 5.4e-11, reflected1e6: 3.8e-15, step1: 1e-25 },
  literature: { przz: 0.417293962, conrey47: 0.4088, bcr: 17 / 33 },
  refereeCorrections: [
    '99% row: fixed (R = 1.1, θ = 1/2) 16 / 48 / 24; the 16 / 24 / 20 row is per-window-best.',
    'All sampled windows, fixed: 20 / 48 / 40 (1e6 on a finer n grid); samples differ in size (707 / 2310 / 5719 zeros), so not a T-scaling.',
    'Step 1: identity proved; ≤ 2 zeros per window measured (median 1.00, max 2.00). Non-monotone phase can exceed Δφ/π + 1.',
    'Every-window extrapolation under-predicts in-sample (model 28–32 vs observed 40 at 1e6): treat 165–634 as a probable underestimate; range across fits 61–1103.',
    'Close-pair failure rates at n = 8: 4/9, 9/23, 28/93 (4/9 has a 95% interval of roughly 14–79%).',
    'Functional-equation statement moved from proved to structural argument; the FE also enters the twisted mean square (χ-term, Q-symmetry) but gives no window-local lever beyond Z-sign counting.',
    'Obstruction restated: N_0(W) ≤ N(W); the 1.73× surplus is model-based (neutral rigid-lattice Palm model); neutral measured density (1.005×) is heuristic evidence that H_desc-mirror is atypical.',
    'Analytic positivity tier T^{1/6+ε} added (~1.8–2.6 orders above 8.6 spacings); 3.8–8.3 orders applies to the proportion tier; ε and missing explicit constants make the analytic gaps lower bounds.',
    'Median H_min "2" vs "3" is inside the quadrature floor; loss medians do not add (2.38 vs 2.30); orders-of-magnitude range for the extrapolation stated once (1.3–1.9 from the 1e6 fit).',
    'PRZZ ≈ 0.417294; environment lacked scipy and python-flint; nothing is interval-certified.',
  ],
  tiers: {
    proved: ['window Littlewood–Levinson inequality (+ Jensen)', 'step-1 identity', 'N_0(W) ≤ N(W) and 2.530 < 4.37 in the neutral Palm model'],
    certified: [],
    conditional: ['analytic short-interval tiers (recalled, not source-checked)'],
    measured: ['H_min tables at 1e4 / 1e5 / 1e6', 'mean-certificate linear law', 'loss breakdown', 'step-1 cost ≤ 2', 'long-mollifier κ_W (outside theorems)',
      'close-pair failure rates and neutral density', 'functional-equation numerical checks'],
    heuristic: ['every-window extrapolation (probably low)', 'polylog growth in T', 'the 1.73× surplus requirement (model-based)', 'H_desc-mirror atypical',
      'functional equation gives no window-local lever (structural argument)'],
  },
  gaps: [
    'Nothing interval-certified (float64 ζ, quadrature floor ~0.06 zeros).',
    'Literature from memory (no network): Karatsuba 27/82, Moser/Karatsuba 1/6, almost-all results, PRZZ.',
    'One mollifier / Q shape (P = x, Q = 1 − x); θ > 1/2 only at 1e4 and outside every theorem.',
    'Close-pair density counts zeros of ζ (t = 0), not the mirror-kernel measure of H_t at t > 0.',
  ],
  nextStep:
    'Test the H_desc-mirror constant-p hypothesis directly: evaluate the mirror-kernel weighted count around close pairs with the zeros of H_t for '
    + 't ∈ (0, 0.13] at computable heights, against p_req = 4.37 and the neutral Palm 2.530. The measured ζ-zero density (1.005×) predicts no surplus; '
    + 'a confirmed deficit would record H_desc-mirror as atypical before any further arithmetic lane is tried.',
  scripts: [
    'tmp/ns3-locallev-zeta.py', 'tmp/ns3-locallev-test-zeta.py', 'tmp/ns3-locallev-window.py', 'tmp/ns3-locallev-analyze.py', 'tmp/ns3-locallev-hmin.py',
    'tmp/ns3-locallev-ldev.py', 'tmp/ns3-locallev-palm.py', 'tmp/ns3-locallev-closepair-density.py', 'tmp/ns3-locallev-reflection.py',
    'tmp/ns3-locallev-ref0-em.py', 'tmp/ns3-locallev-ref0-analyze.py', 'tmp/ns3-locallev-ref0-fixed99.py', 'tmp/ns3-locallev-ref0-mp1e6.py', 'tmp/ns3-locallev-ref1-hmin.py',
  ],
});

const M = NS3_LOCALLEV;

export const NS3_LOCALLEV_ASSERTIONS = Object.freeze([
  {
    id: 'locallev-analytic-tier-spacings',
    holds: () => {
      const [a, b] = M.heights, w = M.hdescWindowSpacings;
      const sp = (e, T) => spacingsIn(T ** e, T);
      const k1 = sp(27 / 82, a), k2 = sp(27 / 82, b), h1 = sp(0.5, a), h2 = sp(0.5, b), s1 = sp(1 / 6, a), s2 = sp(1 / 6, b);
      const ord = (x) => Math.log10(x / w);
      return Math.abs(k1 / 5.5e4 - 1) < 0.03 && Math.abs(k2 / 2.1e6 - 1) < 0.05 && Math.abs(h1 / 7.4e6 - 1) < 0.03 && Math.abs(h2 / 1.6e9 - 1) < 0.05
        && Math.abs(s1 - 514) < 10 && Math.abs(s2 / 3.8e3 - 1) < 0.05
        && Math.abs(ord(k1) - 3.8) < 0.05 && Math.abs(ord(k2) - 5.4) < 0.05 && Math.abs(ord(h1) - 5.9) < 0.05 && Math.abs(ord(h2) - 8.3) < 0.05
        && ord(s1) > 1.7 && ord(s1) < 1.9 && ord(s2) > 2.5 && ord(s2) < 2.7;
    },
    why: 'Spacings 2π/log(T/2π): T^{27/82} = 5.5e4 / 2.1e6, T^{1/2} = 7.4e6 / 1.6e9, T^{1/6} = 514 / 3.8e3 at 3e12 / 7.5e16 → 3.8–8.3 orders (proportion), 1.8–2.6 (positivity) above 8.6.',
  },
  {
    id: 'locallev-palm-surplus-arithmetic',
    holds: () => {
      const p = M.palm;
      return Math.abs(p.pReq / p.mirrorCountNeutral - p.surplus) < 0.005 && p.mirrorCountNeutral < p.pReq
        && Math.abs(p.mirrorCountNeutral / p.fracOfMean - 6.73) < 0.02 && M.closePairs.densityRatio.pm4 < 1.05
        && M.closePairs.densityRatio.pm4 * p.mirrorCountNeutral < p.pReq;
    },
    why: '4.37 / 2.530 = 1.727: with N_0 ≤ N, even an all-real neutral configuration falls short; the measured close-pair density (1.005×) leaves the count far below p_req.',
  },
  {
    id: 'locallev-step1-identity-synthetic',
    holds: () => {
      // ζ(1/2+it) := e^{−iθ(t)} Z(t) with synthetic real θ, Z; ζ' = dζ/ds = −i dζ/dt; check e^{iθ}(ζ + ζ'/L) = (1 − θ'/L)Z − iZ'/L.
      const th = (t) => t * t / 7 + Math.sin(t), dth = (t) => 2 * t / 7 + Math.cos(t);
      const Z = (t) => Math.cos(3 * t) * (1 + 0.2 * t), dZ = (t) => -3 * Math.sin(3 * t) * (1 + 0.2 * t) + 0.2 * Math.cos(3 * t);
      const zr = (t) => Math.cos(th(t)) * Z(t), zi = (t) => -Math.sin(th(t)) * Z(t);
      const L = 9.3, h = 1e-5; let err = 0;
      for (const t of [0.3, 1.7, 2.9, 4.4]) {
        const dr = (zr(t + h) - zr(t - h)) / (2 * h), di = (zi(t + h) - zi(t - h)) / (2 * h);
        const pr = di, pi = -dr; // ζ' = −i (dr + i di) = di − i dr
        const vr = zr(t) + pr / L, vi = zi(t) + pi / L, c = Math.cos(th(t)), s = Math.sin(th(t));
        const er = c * vr - s * vi, ei = s * vr + c * vi;
        err = Math.max(err, Math.abs(er - (1 - dth(t) / L) * Z(t)), Math.abs(ei + dZ(t) / L));
      }
      return err < 1e-8;
    },
    why: 'Levinson step 1 is exact and pointwise: Re[e^{iθ}V] = (1 − θ′/L)Z; the per-window cost (≤ 2 zeros) is measured, not implied by the identity.',
  },
  {
    id: 'locallev-mean-certificate-crossing-and-levinson-constant',
    holds: () => {
      const m = M.meanCert, n0 = m.slope.map((s, i) => -m.intercept[i] / s);
      let a = 0.8, b = 2; const g = (Math.sqrt(5) - 1) / 2;
      for (let i = 0; i < 80; i++) { const c = b - g * (b - a), d = a + g * (b - a); if (levinsonKappa(c) > levinsonKappa(d)) b = d; else a = c; }
      const lev = levinsonKappa((a + b) / 2);
      return n0.every((x) => x > 2.1 && x < 2.9) && m.slope.every((s) => Math.abs(s - lev) < 0.025) && m.sdExp.every((x, i) => i === 0 || x > m.sdExp[i - 1]);
    },
    why: 'Median window turns positive at n = 0.99/0.351 … 0.78/0.363 ≈ 2.2–2.8 zeros; slopes 0.351–0.363 match Levinson’s asymptotic 0.3428 (P = x, Q = 1 − x) within 0.025; spread exponent grows with T.',
  },
  {
    id: 'locallev-corrected-tables-consistent',
    holds: () => {
      const h = M.hmin, l = M.loss1e6n8, e = M.extrapolation;
      const tableOk = [0, 1, 2].every((i) => h.medianFixed[i] <= h.p99Fixed[i] && h.p99Fixed[i] <= h.allFixed[i] && h.p99PerWindow[i] <= h.p99Fixed[i]
        && h.allPerWindow[i] <= h.allFixed[i] && h.actualLog[i] <= h.globalMeanSquare[i]);
      const medianResolved = h.medianMargin1e6H2 <= h.quadratureFloor; // 2 vs 3 not resolved
      const lossSum = l.N - l.step1 - l.littlewood - l.jensen;
      const extrapLow = e.inSampleModel1e6[1] < e.inSampleObserved1e6;
      return tableOk && medianResolved && Math.abs(lossSum - 2.38) < 1e-9 && lossSum !== l.medianResult && Math.abs(l.medianResult / l.N - l.kappaW) < 1e-3
        && extrapLow && h.worstWindow1e6.certFail < 0 && h.worstWindow1e6.certPass > 0 && h.allFixed[2] === h.worstWindow1e6.nPass
        && Math.min(e.fit1e4[0], e.fit1e5[0], e.fit1e6[0]) === 61 && Math.max(e.fit1e4[1], e.fit1e5[1], e.fit1e6[1]) === 1103;
    },
    why: 'Corrected rows are ordered (median ≤ 99% ≤ all; per-window ≤ fixed); median 2 vs 3 is inside the 0.06 floor; loss medians do not add (2.38 vs 2.30); the tail model is low in-sample (32 < 40).',
  },
  {
    id: 'locallev-close-pair-small-samples',
    holds: () => {
      const c = M.closePairs.n8, [lo, hi] = clopperPearson(c.fails[0], c.windows[0]);
      const rates = c.fails.map((k, i) => k / c.windows[i]);
      const [lo6] = clopperPearson(c.fails[2], c.windows[2]);
      return lo > 0.13 && lo < 0.16 && hi > 0.76 && hi < 0.8 && rates.every((r, i) => r > 2.5 * c.overall[i]) && lo6 > c.overall[2];
    },
    why: 'n = 8 close-pair failure rates 4/9, 9/23, 28/93 exceed the overall ~10% at every T; 4/9 has an exact (Clopper–Pearson) 95% interval ≈ 14–79%; at 1e6 the lower end (≈ 0.21) still exceeds 0.11.',
  },
  {
    id: 'locallev-honest-scope',
    holds: () => /refereed bound is changed/i.test(M.verdict) && /NO QED/.test(M.verdict) && /NO QED/.test(M.status) && M.tiers.certified.length === 0
      && /model-based/.test(M.verdict) && /not interval-certified/.test(M.status) && M.tiers.heuristic.some((x) => /1\.73/.test(x))
      && !M.tiers.proved.some((x) => /cost|functional equation gives/.test(x)) && /unreviewed/.test(M.verdict),
    why: 'Referee corrections: step-1 cost and the FE argument are not in the proved tier; the 1.73× requirement is model-based; nothing certified.',
  },
]);

export default NS3_LOCALLEV;
