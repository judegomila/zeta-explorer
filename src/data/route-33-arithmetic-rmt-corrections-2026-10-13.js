/**
 * @fileoverview route-33-arithmetic-rmt-corrections-2026-10-13 — roadmap route 33 (batch 8, group F): arithmetic (Bogomolny–Keating) corrections
 * to random-matrix pair statistics on high zeros. Mapping result: the prime signal is detected at amplitude 1. One run plus one adversarial
 * internal referee pass with an independent pipeline (not refuted; severity minor: scope/precision framing, one refuted heuristic sub-claim).
 * Corrections applied below.
 *
 * PROVED: nothing new. Identities used: G1(r) = (ζ'/ζ)'(1+ir) − B(ir) = Σ_{n=p^k} log²p·n^{−1−ir} (re-derived; s = 2 residual 7.8e-6 = the
 *  prime tail beyond 2e6); A'(0) = 0, so the BK series in L has no 1/L term.
 * CERTIFIED: nothing. FLINT/Platt windows at 1e10–1e13 are interval balls with Turing-anchored indices (max radius 2.1e-5–9.2e-5; 134–336 zeros
 *  per window above 1e-6), but every statistic is floating-point.
 * CONDITIONAL: the BK prediction is the Conrey–Snaith ratios-conjecture form (1/4π²)[L² + 2((ζ'/ζ)'(1+ir) − B(ir) + (t/2π)^{−ir}ζ(1+ir)ζ(1−ir)A(ir))];
 *  its oscillating part (Hardy–Littlewood factor A) has no proof. The Montgomery-range theorem (RH, supp f̂ ⊂ (−1,1)) does NOT cover the measured
 *  0.01-wide-bin statistics over r ≤ 60 (Fourier support far outside (−1,1)); the run's "theorem under RH up to lower-order terms" needs a precise
 *  citation or is an expectation. The determinantal-BK closure K = sgn(sinc)·√(1 − R2_BK) is a model, not a valid DPP globally.
 * MEASURED (referee reproduced the core with independent code): Λ_B = γ0² + 2γ1 + Σ_p log²p/(p − 1)² = 0.1875462328 + 1.3856048 = 1.5731511
 *  (primes ≤ 1e8 plus PNT tail 1.9e-7; the run's 1.57314332 truncated at 2e6 is low by 7.7e-6). Data − GUE = a·(BK − GUE): a = 1.0000 ± 0.0008
 *  over 8 windows (χ² 3.5/7) — the four zeros6 bands (T = 5.5e4–8.7e5) carry 99.2% of the weight; the four FLINT/Platt windows at 1e10–1e13 alone
 *  give 1.0086 ± 0.0088; Odlyzko blocks at 2.7e11 / 1.4e20 / 1.4e21 are low-statistics checks within 2.3σ. Per-term: diagonal 0.9999 ± 0.0008,
 *  oscillating 1.0023 ± 0.0031, Hardy–Littlewood a_A = 1.0032 ± 0.0067 (high windows 0.9999 ± 0.0143) vs GUE-null leakage 0.13–0.15 ± 0.02–0.03
 *  (≥ 35σ). Per-prime amplitudes n = 2…13 ≈ 1 (fits hold the rest of the BK template fixed; on GUE the same fit gives 0.4–4.5 by template
 *  degeneracy, so the right null is a_n = 0: all detected > 20σ even at 1e10–1e13). Fourier spikes at u = log n resolve only well-separated n
 *  (2, 3, 5, 7, 11, 13); e.g. n = 5: 5.227 ± 0.002 (BK 5.228) at T ≈ 8.7e5. Low-zero dips at r = γ_k: 32/32 within 2.5σ (γ1 at 1e12: −0.0076 ±
 *  0.0002 vs −0.0075), localised. Small gaps: P(s < 0.2) matches F_GUE + ∫ΔR2 (first-order; fine at s < 0.2, partly an approximation match at
 *  s < 0.5). Gap variance does not follow BBLM at L ≤ 28: (V − V_GUE)/(dV/dε·ε) = a + b/L, a = 0.784 ± 0.019, b = −3.5 ± 0.2 (a = 1 forced: χ² 145).
 *  Route-23 link: Q + 1 = c·12Λ_B/L², c = 0.441 ± 0.008 (χ² 6.2/7, L = 9–28; high windows alone 0.410 ± 0.057); weighted mean Q + 1 at 1e10–1e13
 *  = 0.0134 ± 0.0019 (7σ); a 1/L law fixed at T ≈ 1e6 gives χ² 70 on the 4 high points; GUE controls Q = −0.9925/−1.0021/−1.0059 (unbiased).
 *  Q(J) saturates at J = 2–3 explicit neighbours (Δ = 0.047/0.058/0.061 at L 11.8; 0.010/0.013/0.015 at 1e12). Determinantal-BK P(s < 1),
 *  converged (m = 192–384, h = 1e-3): fails at L ≤ 12 (14–24σ) but only 3.0/2.3/1.4/1.2σ at L = 21.2/23.5/25.8/28.1 — the run's "fails at every
 *  height" (unconverged m = 48) is refuted.
 * HEURISTIC: attributing Q + 1 to arithmetic 3-point corrections is interpretation; J-flatness beyond 3 is EXPECTED (D weights far neighbours
 *  by ≈ g²/x², the dips at x ≈ 27–58 could contribute ≈ 1e-4), so it does not by itself show the long-range BK structure is irrelevant — the
 *  logical point (E[g·D] needs the gap/third-point law, not R2) stands. The 1/L³ term in V plausibly comes from Im P ≈ −2.3r (size estimate only).
 *  Jackknife errors agree with between-block scatter (referee: 0.0039 vs 0.0030; 0.044 vs 0.044).
 *
 * Prior art in-repo: route 23 (src/data/route-23-ht-vs-dyson-bm-2026-10-11.js) recalled Λ_B = 1.57314 and measured Q + 1 at T ≈ 1e6; this
 * route re-derives Λ_B and extends the 1/L² law to 1e13. Tagged [map]; no Λ bound moves. No refereed bound is changed; RH open; NO QED. Import-free.
 * ROUTE_33_ASSERTIONS recompute live: Λ_B from a prime sieve to 2e6 plus the PNT tail, the inverse-variance a_BK combination and its weight split,
 * the Q + 1 = c·12Λ_B/L² weighted fit (8 windows and high windows), the 1/L-law χ², and the converged determinantal-BK σ-distances.
 */

const { abs, sqrt, log } = Math;

export const ROUTE_33 = Object.freeze({
  id: 'route-33-arithmetic-rmt-corrections-2026-10-13',
  route: 33,
  date: '2026-10-13',
  title: 'Route 33: the departure of zeta-zero pair correlation from GUE is the Bogomolny–Keating arithmetic correction at amplitude 1',
  status: 'done',
  headline: 'Data − GUE = a·(BK − GUE) with a = 1.0000 ± 0.0008 over 8 windows (the zeros6 bands at T = 5.5e4–8.7e5 carry 99.2% of the weight; '
    + 'the FLINT/Platt windows at 1e10–1e13 alone give 1.0086 ± 0.0088). The Hardy–Littlewood factor, the well-separated prime-power spikes and '
    + 'the low-zero dips are each detected. Route 23\'s Q + 1 follows a 1/L² law (c = 0.441 ± 0.008) out to L = 28 and saturates at 2–3 neighbours.',
  lambdaB: Object.freeze({ gamma0sq2gamma1: 0.1875462328, primeSum1e8: 1.3856048, value: 1.5731511, runValue2e6: 1.5731433192816584, stieltjesGamma1: -0.0728158454836767 }),
  // [label, T, L, a_BK, err, Q, Q_err, F10, F10_err]
  windows: Object.freeze([
    Object.freeze(['z6_a', 5.73e4, 9.119022574025681, 0.9990032755355567, 0.0019413953308470243, -0.8945151071329185, 0.0038025366137041505, 0.5332770507949909, 0.0006367752110559399]),
    Object.freeze(['z6_b', 2.03e5, 10.380726134885878, 1.0002790124903422, 0.0017778150757338758, -0.9253327933681262, 0.0030776919107419996, 0.5321328468086272, 0.00043493234691720597]),
    Object.freeze(['z6_c', 4.52e5, 11.18417840516148, 0.9999050012812232, 0.0019757278769568067, -0.9343926138382774, 0.002388307919609198, 0.5312359246914692, 0.00035865742831265565]),
    Object.freeze(['z6_d', 8.68e5, 11.83662946060704, 1.0001496495658169, 0.0012335373808026616, -0.940638628868451, 0.001995130356082445, 0.5312311574173936, 0.00026534854481992094]),
    Object.freeze(['h1e10', 1e10, 21.187979752938052, 0.9937655999179404, 0.015065401469835595, -0.9873295776077403, 0.003860748757934312, 0.532062094975302, 0.00044228882655292115]),
    Object.freeze(['h1e11', 1e11, 23.490559458876643, 1.024539336144487, 0.016957198506596646, -0.9816020126022237, 0.003512455751273786, 0.5321792656529969, 0.0004376428993800529]),
    Object.freeze(['h1e12', 1e12, 25.79314409511624, 1.003856008160808, 0.01813067069810191, -0.9871445405284702, 0.004148602183313404, 0.5324647221316863, 0.00047102642742070976]),
    Object.freeze(['h1e13', 1e13, 28.095729147030763, 1.0203881377503516, 0.02225452092168453, -0.9908634607660176, 0.0036181759512281244, 0.5325583525386974, 0.00043035702027148943]),
  ]),
  lowStatBlocks: Object.freeze([['od3', 2.68e11, 0.8711654973019989, 0.1035913339600803], ['od4', 1.44e20, 0.717735087508479, 0.20394317863640055], ['od5', 1.37e21, 0.9661634700298741, 0.19044600434665196]]),
  detbkP1converged: Object.freeze([0.53339, 0.53321, 0.53311, 0.53309]),
  detbkP1unconverged1e10: 0.53513,
  hardyLittlewood: Object.freeze({ aA: Object.freeze([1.0032, 0.0067]), high: Object.freeze([0.9999, 0.0143]), nullLeak: Object.freeze([0.14, 0.024]) }),
  spike5: Object.freeze({ T: 8.7e5, value: 5.227, err: 0.002, bk: 5.228 }),
  variance: Object.freeze({ a: 0.784, aErr: 0.019, b: -3.5, chi2: 11.4, chi2Forced: 145, lambdaFromV: Object.freeze([1.03, 1.16, 1.17, 1.14]) }),
  qJ: Object.freeze({ L118: Object.freeze([0.047, 0.058, 0.061]), T1e12: Object.freeze([0.010, 0.013, 0.015]) }),

  refereeKilled: Object.freeze([
    'headline scope: 1.0000 ± 0.0008 is 8 windows (not 11) and is effectively a T ≤ 1.13e6 result (1e10–1e13 carry 0.84% of the weight; alone 1.0086 ± 0.0088); od4/od5 at 1.4e20–1.4e21 are not inside "5e4 to 1e13"',
    'Λ_B quoted to 8 digits (1.57314332) but truncated at primes ≤ 2e6: corrected 1.5731511 (primes ≤ 1e8 + tail 1.9e-7), low by 7.7e-6; fits unaffected',
    'REFUTED sub-claim: determinantal-BK "fails for P(s<1) at every height" used unconverged quadrature (m = 48, h = 1e-4 across the kink); converged it fails only at L ≤ 12 (14–24σ), 3.0/2.3/1.4/1.2σ at L = 21–28',
    'per-prime amplitudes are template-conditional (rest of BK held fixed; GUE gives a_n = 0.4–4.5 by degeneracy); the correct null a_n = 0 still gives > 20σ detections',
    '"each spike n = 2…31 detected individually" overstated: u-resolution ≈ 0.2 leaves 7/8, 16/17, 23/25/27, 29/31 unresolved; n ≥ 16 rests on the parametric fit with no GUE-null run',
    'Hardy–Littlewood separation "> 60σ" depends on the error used; with the null\'s own jackknife ≈ 35–40σ',
    'Montgomery-range "theorem under RH" uncited and the measured narrow-bin statistics lie outside supp f̂ ⊂ (−1,1)',
    'small-gap agreement uses the first-order F_GUE + ∫ΔR2 approximation (fine at s < 0.2; partly an approximation match at s < 0.5)',
    'J-saturation does not demonstrate that long-range BK structure is irrelevant: D weights far neighbours by ≈ g²/x², so flatness is expected',
  ]),
  nextStep: 'Compute the BK / ratios-conjecture 3-point correction (Bogomolny–Keating 1995 or Conrey–Snaith n-correlation) and evaluate E[g·D_J] at '
    + 'J = 3 with continuum tail from local Janossy densities, to compare with c = 0.441 ± 0.008; expand BK to O(1/L³) (including the r-linear Im P '
    + 'term) through the gap probability to explain a = 0.78 in the gap variance. Resume: tmp/routes-b8-r33-run.sh, run2.sh, run3.sh, then '
    + 'routes-b8-r33-summary.py and routes-b8-r33-qJ.py (< 10 min, each waits while load > 40).',
  files: Object.freeze(['tmp/routes-b8-r33-bk.py', 'tmp/routes-b8-r33-pairs.py', 'tmp/routes-b8-r33-fit.py', 'tmp/routes-b8-r33-nn.py', 'tmp/routes-b8-r33-detbk.py',
    'tmp/routes-b8-r33-qJ.py', 'tmp/routes-b8-r33-summary.py', 'tmp/routes-b8-r33-run.sh', 'tmp/routes-b8-r33-run2.sh', 'tmp/routes-b8-r33-run3.sh', 'tmp/routes-b8-r33-out/',
    'tmp/routes-b8-ref33-indep.py', 'tmp/routes-b8-ref33-light.py', 'tmp/routes-b8-ref33-detbk-conv.py', 'tmp/routes-b8-ref33-run.sh', 'tmp/routes-b8-ref33-out/']),
  verdict: 'Mapping result; no progress on Λ or RH. The pair-correlation departure of the zeros from GUE is the (conjectural, ratios-conjecture) '
    + 'BK arithmetic correction at amplitude 1.0000 ± 0.0008, dominated by T ≤ 1.13e6 (1.0086 ± 0.0088 at 1e10–1e13). The Hardy–Littlewood factor '
    + 'A, the well-separated prime-power spikes and the low-zero dips are detected with amplitudes consistent with 1. BBLM\'s O(1/L²) effective-N '
    + 'truncation does not describe the gap variance at L ≤ 28. Route 23\'s Q + 1 keeps its 1/L² law (c = 0.441 ± 0.008) to 1e13 and is local '
    + '(saturated at J = 2–3); explaining it needs 3-point arithmetic correlations, not computed here. Internal, one referee pass. Nothing '
    + 'certified; no Λ bound moves. No refereed bound is changed; RH open; NO QED.',
});

const R = ROUTE_33;
const EULER_GAMMA = 0.5772156649015329;
let primeSumCache = null;
const primeSum = (P) => { if (primeSumCache && primeSumCache[0] === P) return primeSumCache[1]; const sieve = new Uint8Array(P + 1); let s = 0;
  for (let i = 2; i <= P; i += 1) { if (sieve[i]) continue; const l = log(i); s += (l * l) / ((i - 1) * (i - 1)); for (let j = i * i; j <= P; j += i) sieve[j] = 1; }
  primeSumCache = [P, s]; return s; };
const wmean = (vals, errs) => { const w = errs.map((e) => 1 / (e * e)); const sw = w.reduce((a, b) => a + b, 0);
  const m = vals.reduce((a, v, i) => a + w[i] * v, 0) / sw; return [m, 1 / sqrt(sw), w.map((x) => x / sw)]; };
// weighted LS through the origin: y = c·x
const fitThroughOrigin = (x, y, e) => { let sxx = 0; let sxy = 0; for (let i = 0; i < x.length; i += 1) { const w = 1 / (e[i] * e[i]); sxx += w * x[i] * x[i]; sxy += w * x[i] * y[i]; }
  const c = sxy / sxx; const chi2 = x.reduce((a, xi, i) => a + ((y[i] - c * xi) / e[i]) ** 2, 0); return [c, 1 / sqrt(sxx), chi2]; };

export const ROUTE_33_ASSERTIONS = Object.freeze([
  {
    id: 'r33-lambda-b-live',
    holds: () => { const P = 2e6; const s = primeSum(P); const tail = (log(P) + 1) / P; const lb = R.lambdaB;
      const g = EULER_GAMMA * EULER_GAMMA + 2 * lb.stieltjesGamma1;
      return abs(g - lb.gamma0sq2gamma1) < 1e-10 && abs(s + g - lb.runValue2e6) < 2e-7 && abs(s + tail - lb.primeSum1e8) < 3e-7
        && abs(s + tail + g - lb.value) < 3e-7 && abs(lb.value - lb.runValue2e6 - 7.7e-6) < 3e-7; },
    why: 'γ0² + 2γ1 = 0.1875462328; Σ_{p ≤ 2e6} log²p/(p−1)² (live sieve) reproduces the run\'s 1.5731433; adding the PNT tail (log P + 1)/P = 7.75e-6 gives 1.3856048 and Λ_B = 1.5731511 (referee, primes ≤ 1e8).',
  },
  {
    id: 'r33-abk-combination-weights',
    holds: () => { const w = R.windows; const [m, e, wf] = wmean(w.map((x) => x[3]), w.map((x) => x[4]));
      const chi2 = w.reduce((a, x) => a + ((x[3] - m) / x[4]) ** 2, 0); const hiFrac = wf.slice(4).reduce((a, b) => a + b, 0);
      const [mh, eh] = wmean(w.slice(4).map((x) => x[3]), w.slice(4).map((x) => x[4]));
      return abs(m - 1) < 5e-5 && abs(e - 0.0008) < 5e-5 && abs(chi2 - 3.5) < 0.2 && abs(hiFrac - 0.0084) < 3e-4 && abs(mh - 1.0086) < 2e-4 && abs(eh - 0.0088) < 2e-4
        && R.lowStatBlocks.every(([, , a, s]) => abs(a - 1) / s < 2.3); },
    why: 'Inverse-variance combination over 8 windows: a_BK = 1.0000 ± 0.0008 (χ² 3.5/7), but 1e10–1e13 carry only 0.84% of the weight (alone 1.0086 ± 0.0088); Odlyzko blocks within 2.3σ.',
  },
  {
    id: 'r33-q-plus-one-law',
    holds: () => { const w = R.windows; const lb = R.lambdaB.runValue2e6; const x = w.map((r) => (12 * lb) / (r[2] * r[2])); const y = w.map((r) => r[5] + 1); const e = w.map((r) => r[6]);
      const [c, ce, chi2] = fitThroughOrigin(x, y, e); const [ch, che] = fitThroughOrigin(x.slice(4), y.slice(4), e.slice(4));
      const [qm, qe] = wmean(y.slice(4), e.slice(4)); const d = w[3]; const chiL = w.slice(4).reduce((a, r) => a + ((r[5] + 1 - (d[5] + 1) * d[2] / r[2]) / r[6]) ** 2, 0);
      return abs(c - 0.441) < 0.002 && abs(ce - 0.008) < 0.001 && abs(chi2 - 6.2) < 0.2 && abs(ch - 0.410) < 0.003 && abs(che - 0.057) < 0.002
        && abs(qm - 0.0134) < 2e-4 && abs(qe - 0.0019) < 1e-4 && qm / qe > 7 && abs(chiL - 70) < 2; },
    why: 'Weighted fit Q + 1 = c·12Λ_B/L²: c = 0.441 ± 0.008 (χ² 6.2/7) over L = 9–28, 0.410 ± 0.057 from 1e10–1e13; weighted Q + 1 there 0.0134 ± 0.0019 (7σ); a 1/L law fixed at z6_d gives χ² ≈ 70 on the 4 high windows.',
  },
  {
    id: 'r33-detbk-converged-not-every-height',
    holds: () => { const hi = R.windows.slice(4); const sig = hi.map((r, i) => (R.detbkP1converged[i] - r[7]) / r[8]); const want = [3.0, 2.3, 1.4, 1.2];
      return sig.every((s, i) => abs(s - want[i]) < 0.1) && (R.detbkP1unconverged1e10 - hi[0][7]) / hi[0][8] > 6; },
    why: 'Converged determinantal-BK P(s<1) sits 3.0/2.3/1.4/1.2σ from the data at L = 21.2/23.5/25.8/28.1 (live from stored F10 ± err); the unconverged 0.53513 had looked like ≈ 7σ.',
  },
  {
    id: 'r33-signals-and-variance',
    holds: () => { const h = R.hardyLittlewood; const s5 = R.spike5; const v = R.variance;
      return (h.high[0] - h.nullLeak[0]) / Math.hypot(h.high[1], h.nullLeak[1]) > 30 && abs(s5.value - s5.bk) / s5.err < 1 && abs(v.a - 1) / v.aErr > 10
        && v.chi2Forced / v.chi2 > 10 && v.lambdaFromV.every((l) => l < R.lambdaB.value) && R.qJ.L118[2] - R.qJ.L118[0] < R.qJ.L118[0]
        && R.qJ.T1e12.every((q, i) => i === 0 || q >= R.qJ.T1e12[i - 1]); },
    why: 'Hardy–Littlewood factor ≥ 30σ above the GUE leakage even with high-window errors; n = 5 spike 5.227 ± 0.002 vs BK 5.228; gap-variance a = 0.784 is > 10σ from BBLM\'s 1; Λ fitted from V stays below Λ_B; Q(J) mostly from J = 1 and saturated by J = 3.',
  },
  {
    id: 'r33-honest-scope',
    holds: () => R.status === 'done' && /T ≤ 1\.13e6/.test(R.verdict) && /conjectural/.test(R.verdict) && /refereed bound is changed/i.test(R.verdict)
      && /NO QED/.test(R.verdict) && R.refereeKilled.length === 9 && R.refereeKilled.some((x) => /REFUTED/.test(x)),
    why: 'Mapping result; BK is conjectural (ratios conjecture); the amplitude-1 statement is dominated by T ≤ 1.13e6; no Λ change; no QED.',
  },
]);

export default ROUTE_33;
