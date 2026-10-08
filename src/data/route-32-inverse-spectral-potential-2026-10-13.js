/**
 * @fileoverview route-32-inverse-spectral-potential-2026-10-13 — roadmap route 32 (batch 8, group F): inverse spectral potential reproducing
 * the zeros (Wu–Sprung type) and its regularity. MAP result with no RH implication. One run plus one adversarial internal referee pass (not
 * refuted; severity MAJOR: the continuum-residual claim and its h-scaling were a code bug; regularity/whiteness extrapolations overstated).
 * Corrections applied below.
 *
 * PROVED (elementary): (a) Abel inversion of N_sc(E) = θ(E)/π + 1 (asymptotic θ): x(V) = (√V/π) log(2V/(πe²)) + c V^{−1/2} + O(V^{−3/2}),
 *  c = −(E0/2π)(log(E0/2π) − 1) = 7/8 + O(1/E0) (because θ(E0) = −π), E0 = 9.666908077; so V_WS(x) ~ π²x²/log²x. (b) Standard 1D fact: a
 *  confining 1D Schrödinger operator has simple spectrum, so a 1D Schrödinger Hilbert–Pólya operator would force RH AND simplicity of every
 *  zero (simplicity is a separate open conjecture, logically independent of RH; the run's "stronger than RH" wording corrected).
 * CERTIFIED: nothing (IEEE-double LAPACK eigenvalues).
 * CONDITIONAL: existence of a continuum even V with exactly {γ_1..γ_N} as lowest eigenvalues (eigenvalue-moving / commutation theory,
 *  Gesztesy–Simon–Teschl, Pöschel–Trubowitz, Borg-type two-spectra; cited) — this also underlies "essentially any increasing finite sequence is
 *  the low spectrum of some even V" (moved here from 'proved'); uniqueness of an even V_∞ with full spectrum {γ_n}; W^{−1}_2 distributional
 *  potentials (Savchuk–Shkalikov, Hryniv–Mykytyuk).
 * MEASURED: Wu–Sprung V_WS reproduces the smooth points t_n (N_sc(t_n) = n − 1/2) to 8e-6 (n = 500) / 1.6e-6 (n = 2000), ground state 0.43;
 *  rms(γ_n − t_n) = 0.38686 (N = 500) / 0.33313 (N = 2000), the S(t) fluctuation. Gauss–Newton min-norm inverse from V_WS converges in 5–7
 *  iterations: max|E_n − γ_n| (DVR operator) 1.8e-10 / 2.5e-12 / 5.7e-12 / 9.1e-12 / 2.3e-11 for N = 500/1000/2000/3000/5000 (referee full-line
 *  DVR: 1.76e-10, 3.07e-12). CONTINUUM residual (referee, Whittaker-sinc interpolation, converged across 2x/3x/4x): 0.01269 (N = 500, c = 0.55),
 *  1.17e-6 (N = 500, c = 0.2), 0.0199 (N = 1000), 0.0132 (N = 2000) — about 1–2% of a spacing at c = 0.55; a cubic-spline interpolant gives 0.19 /
 *  1.25e-3, so the continuum potential depends on the interpolant. The run's 0.26/0.14/0.093 "≈ 0.1 spacing, ∝ h" came from a grid-stretch bug
 *  (h2 = x[-1]/K2 = K·h/n instead of n·h/m; relative stretch ≈ 1/(4K) ∝ h). L2 vs H1 regulariser differ by 2–4% of the fluctuation in the allowed
 *  region. Grid convergence (sinc): rms 0.080/0.019/0.012 vs dV rms 10.47. Fixed window x ∈ [8,14]: S(q = 20) = 4.58/4.47/4.53/4.55/4.49 and
 *  S(40) = 5.69/…/5.66 for N = 500…5000; variance 134/233/375/528/740 vs 2k_max = 50.8/70.8/96.9/116.1/145.3. Persistence across N (sinc):
 *  correlation 0.9985–1.0000, amplitude ratio 0.995–1.012 for q < 50, pairs 500/1000 … 3000/5000 and 500/5000. Variogram local dimension
 *  1.10 → 1.87 over lags 0.028–0.09, ≈ 2 beyond. x_osc density ≈ 0.17–0.18 on ω ∈ [0.7,1) (1/2π = 0.159); coherence with the prime-orbit sum
 *  0.01–0.15 against a noise floor ≈ 0.067 (not re-run by the referee).
 * HEURISTIC: S(q) is NOT white (adjacent-bin factor > 10: S@15 = 0.26, S@20 = 4.5, S@25 = 1.4; S@5 ≈ 0.1) and its log-log slope is not
 *  robust: α ≈ 1.09 (q ≥ 10), 0.66–0.89 (q ≥ 20), 0.51–0.53 (q ≥ 30), 0.63 from the variance growth; hence any limit of the min-norm sequence
 *  (IF it converges) would lie only in H^s_loc with s < −(0.75…1.05), possibly outside W^{−1}_2 — regularity undetermined. The band limit at
 *  2k_max(x) = 2√(E_N − V(x)) is BUILT IN (every update lies in span{ψ_n²}), not information about the zeros. Wu–Sprung's D ≈ 1.5 reads as a
 *  crossover value (local D 1 → 2), not a scale-invariant dimension — to be weighed against Ramani–Grammaticos–Caurier 1995, van Zyl–Hutchinson
 *  2003, Schumayer–van Zyl–Hutchinson 2008 (cited from memory, not checked online). The construction consumes the ordinates: no RH lever.
 *
 * Tagged [map]; no Λ bound moves. PT Lambda <= 0.2 stands; RH open; NO QED. Import-free. ROUTE_32_ASSERTIONS recompute live: E0 (asymptotic
 * and exact θ), the Abel constant c = 7/8 + 1/(48πE0) + …, the grid-stretch factor 1 − K(4K+3)/(2K+1)² ≈ 1/(4K) and the top-level shift it
 * causes, the variance-growth exponent α and Sobolev bound, the S(q) N-independence, and γ_n − t_n for the first 30 zeros.
 */

const { abs, log, atan2, PI } = Math;

export const ROUTE_32 = Object.freeze({
  id: 'route-32-inverse-spectral-potential-2026-10-13',
  route: 32,
  date: '2026-10-13',
  title: 'Route 32: inverse spectral (Wu–Sprung) potentials for the first 5000 zeros — exact discretely, ~1% of a spacing in the continuum, consume the zeros',
  status: 'done',
  headline: 'Even potentials for H = −d²/dx² + V(x) whose lowest N eigenvalues are the first N zeta ordinates are built for N = 500 … 5000: '
    + 'the discretised operator matches to 1e-10 – 2e-11, and the continuum (sinc-interpolated) operator to 0.013–0.020 (≈ 1–2% of a spacing) at '
    + 'c = 0.55 and 1.2e-6 at c = 0.2. The fluctuation V − V_WS is persistent across N (content at fixed q is N-independent) and band-limited by '
    + 'construction; its regularity class is undetermined. The construction consumes the ordinates and says nothing about RH.',
  e0: Object.freeze({ asymptotic: 9.666908077, exact: 9.66690806, abelC: 0.87569 }),
  wkb: Object.freeze({ topErr500: 8e-6, topErr2000: 1.6e-6, ground: 0.4255, rmsGammaT500: 0.38686, rmsGammaT2000: 0.33313 }),
  fitResidual: Object.freeze([[500, 1.8e-10], [1000, 2.5e-12], [2000, 5.7e-12], [3000, 9.1e-12], [5000, 2.3e-11]]),
  continuum: Object.freeze({ corrected: Object.freeze([[500, 0.55, 0.01269], [500, 0.2, 1.17e-6], [1000, 0.55, 0.0199], [2000, 0.55, 0.0132]]),
    buggy: Object.freeze([0.26216, 0.14, 0.093]), theirFftTrueSpacing: 0.01274, spline: Object.freeze([0.19, 1.25e-3]), K500: 872, gamma500: 811.1843588470 }),
  window: Object.freeze({ N: Object.freeze([500, 1000, 2000, 3000, 5000]), S20: Object.freeze([4.58, 4.47, 4.53, 4.55, 4.49]), S40: Object.freeze([5.69, 5.68, 5.66, 5.67, 5.66]),
    variance: Object.freeze([134, 233, 375, 528, 740]), twoKmax: Object.freeze([50.8, 70.8, 96.9, 116.1, 145.3]),
    slopes: Object.freeze({ q10: 1.09, q20: Object.freeze([0.66, 0.89]), q30: Object.freeze([0.51, 0.53]) }), nonWhite: Object.freeze({ S15: 0.26, S20: 4.5, S25: 1.4, S5: 0.1 }) }),
  persistenceSinc: Object.freeze({ corr: Object.freeze([0.9985, 1.0]), ampRatio: Object.freeze([0.995, 1.012]) }),

  refereeKilled: Object.freeze([
    'REFUTED: continuum residuals 0.26/0.14/0.093 (N = 500), 0.21 (N = 1000), 0.11 (N = 2000), "≈ 0.1 of a spacing" and "∝ h" — grid-stretch bug in r32_cont.py (h2 = K·h/n instead of n·h/m; stretch ≈ 1/(4K) ∝ h); their own fftinterp with the true spacing gives 0.01274',
    'corrected continuum residual 0.0127 (N = 500, c = 0.55, converged 2x–4x), 1.17e-6 (c = 0.2), 0.0199 (N = 1000), 0.0132 (N = 2000): the nextStep target "< 0.01 spacing at c = 0.2" is already met by the existing fit',
    '"the limit is a distribution, not a dimension-1.5 fractal" moved from headline/verdict to heuristic and made conditional on convergence of the min-norm sequence',
    'spectral exponent not robust (α ≈ 0.5–1.1 by fit range; 0.63 from variance growth), so s < −(0.75…1.05), not "≈ H^{−0.7}"; "inside W^{−1}_2" not supported robustly',
    '"roughly white" contradicted: S(q) varies > 10x between adjacent bins and is suppressed at low q',
    'band limit at 2k_max is built into min-norm (J^T-span) constructions, not a finding about the zeros',
    'proved list: "any increasing finite sequence is a low spectrum" rests on cited inverse-spectral theory (moved to conditional); simplicity is independent of RH, RH + simplicity is the stronger statement',
    'literature: Ramani–Grammaticos–Caurier 1995, van Zyl–Hutchinson 2003, Schumayer–van Zyl–Hutchinson 2008 not discussed (recalled, not checked online)',
    'minor: rms(γ − t_n) = 0.38686 (0.386 is rms(E_WS − γ)); "2x finer" was 1.5x (N = 1000) / 1.25x (N = 2000); persistence redone with sinc interpolation (stronger)',
  ]),
  nextStep: 'Close Route 32 as mapped with no RH lever. Optional: interval-certify the DVR-operator eigenvalues (Arb, residual/Weyl bounds) to '
    + 'turn "exact for the discrete operator" into a certified statement; test the persistence finding against a different exact construction '
    + '(Gelfand–Levitan / commutation moves with V_WS norming constants). Do not re-attempt fractal-dimension estimates of finite-N potentials.',
  files: Object.freeze(['tmp/routes-b8-r32-scripts/', 'tmp/routes-b8-r32-out/', 'tmp/routes-b8-ref32-check1.py', 'tmp/routes-b8-ref32-check2.py',
    'tmp/routes-b8-ref32-check3.py', 'tmp/routes-b8-ref32-check4.py', 'tmp/routes-b8-ref32-check5.py', 'tmp/routes-b8-ref32-check6.py', 'tmp/routes-b8-ref32-out/']),
  verdict: 'Mapping result, no RH implication. Inverse-spectral potentials for the first N zeros exist numerically up to N = 5000 (discrete '
    + 'operator to ≤ 2.3e-11; continuum to ≈ 1–2% of a spacing at c = 0.55 after the referee fixed a grid-stretch bug that had inflated it to '
    + '≈ 0.1). In the allowed region they are pinned by the N levels and converge under grid refinement; the fluctuation persists scale by scale '
    + 'as N grows. Its whiteness and limiting regularity are NOT established (spectral slope 0.5–1.1 depending on range; any limit, if it exists, '
    + 'sits below H^{−0.75}), and the 2k_max band limit is a property of min-norm updates. The phases are incoherent with the semiclassical '
    + 'prime-orbit sum. The construction consumes the zero ordinates, so it gives no lever on RH; a 1D Schrödinger Hilbert–Pólya operator '
    + 'would also force simple zeros. Internal, one referee pass (major). No Λ bound moves. PT Lambda <= 0.2 stands; RH open; NO QED.',
});

const R = ROUTE_32;
const ZEROS30 = Object.freeze([14.134725142, 21.022039639, 25.01085758, 30.424876126, 32.935061588, 37.586178159, 40.918719012, 43.327073281,
  48.005150881, 49.773832478, 52.970321478, 56.446247697, 59.347044003, 60.831778525, 65.112544048, 67.079810529, 69.546401711, 72.067157674,
  75.704690699, 77.144840069, 79.33737502, 82.910380854, 84.735492981, 87.425274613, 88.809111208, 92.491899271, 94.651344041, 95.870634228,
  98.831194218, 101.317851006]);
const thetaAsym = (t) => (t / 2) * log(t / (2 * PI)) - t / 2 - PI / 8 + 1 / (48 * t) + 7 / (5760 * t ** 3);
const cmul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const cinv = (a) => { const d = a[0] * a[0] + a[1] * a[1]; return [a[0] / d, -a[1] / d]; };
const thetaExact = (t) => { const y = t / 2; let shift = 0; for (let k = 0; k < 8; k += 1) shift += atan2(y, 0.25 + k);
  const w = [8.25, y]; const lw = [0.5 * log(w[0] * w[0] + y * y), atan2(y, w[0])]; const iw = cinv(w); const iw2 = cmul(iw, iw);
  let im = cmul([w[0] - 0.5, y], lw)[1] - y; let pw = iw; for (const c of [1 / 12, -1 / 360, 1 / 1260, -1 / 1680, 1 / 1188]) { im += c * pw[1]; pw = cmul(pw, iw2); }
  return im - shift - (t / 2) * log(PI); };
const bisect = (f, a0, b0) => { let a = a0; let b = b0; for (let i = 0; i < 200; i += 1) { const m = (a + b) / 2; if (f(a) * f(m) <= 0) b = m; else a = m; } return (a + b) / 2; };
const nsc = (th) => (E) => th(E) / PI + 1;

export const ROUTE_32_ASSERTIONS = Object.freeze([
  {
    id: 'r32-well-bottom-and-abel-constant',
    holds: () => { const e0 = bisect(nsc(thetaAsym), 5, 15); const e0x = bisect(nsc(thetaExact), 5, 15); const c = -(e0 / (2 * PI)) * (log(e0 / (2 * PI)) - 1);
      return abs(e0 - R.e0.asymptotic) < 2e-9 && abs(e0x - R.e0.exact) < 5e-8 && abs(c - (7 / 8 + 1 / (48 * PI * e0) + 7 / (5760 * PI * e0 ** 3))) < 1e-12
        && abs(c - R.e0.abelC) < 5e-6 && abs(thetaAsym(e0) + PI) < 1e-12; },
    why: 'E0 = root of θ(E)/π + 1 = 9.666908077 (asymptotic θ; exact log-gamma θ 9.66690806); θ(E0) = −π makes c = −(E0/2π)(log(E0/2π) − 1) = 7/8 + 1/(48πE0) + … = 0.87569.',
  },
  {
    id: 'r32-grid-stretch-bug',
    holds: () => { const c = R.continuum; const K = c.K500; const n = 2 * K + 1; const m = 2 * n + 1; const ratio = (K * m) / (n * n);
      const stretch = 1 - ratio; const shift = stretch * c.gamma500; const spacing = (2 * PI) / log(c.gamma500 / (2 * PI));
      return abs(stretch - (K + 1) / (n * n)) < 1e-15 && abs(stretch * 4 * K - 1) < 1e-3 && shift > 0.15 && shift < 0.4 && abs(c.buggy[0] / c.theirFftTrueSpacing) > 15
        && c.corrected.every(([, , r]) => r / spacing < 0.02) && c.corrected[1][2] < 1e-5; },
    why: 'Bug: h2 = K·h/n vs true n·h/m (n = 2K+1, m = 2n+1) stretches x by 1 − K(4K+3)/(2K+1)² = (K+1)/(2K+1)² ≈ 1/(4K) = 2.87e-4 at K = 872, shifting the top level γ_500 = 811.18 by ≈ 0.23 (reported 0.262); with the true spacing the residual is 0.0127, all corrected residuals < 2% of a spacing (mean spacing 1.29), 1.17e-6 at c = 0.2.',
  },
  {
    id: 'r32-spectral-slope-not-robust',
    holds: () => { const w = R.window; const alphaVar = log(w.variance[4] / w.variance[0]) / log(w.twoKmax[4] / w.twoKmax[0]) - 1;
      const sBound = (a) => -(1 + a) / 2; const alphas = [w.slopes.q30[0], alphaVar, w.slopes.q10];
      return abs(alphaVar - 0.63) < 0.01 && alphas.every((a, i) => i === 0 || a > alphas[i - 1]) && sBound(w.slopes.q30[0]) < -0.75 + 0.01
        && sBound(w.slopes.q10) < -1 && w.nonWhite.S20 / w.nonWhite.S15 > 10; },
    why: 'Variance ∝ (2k_max)^{1+α} gives α = 0.63; fitted slopes 0.51 (q ≥ 30) … 1.09 (q ≥ 10), so s < −(1+α)/2 ranges from −0.755 to −1.045 (past the W^{−1}_2 edge); S@20/S@15 > 10 — not white.',
  },
  {
    id: 'r32-fixed-q-persistence',
    holds: () => { const w = R.window; const spread = (a) => (Math.max(...a) - Math.min(...a)) / Math.min(...a);
      return spread(w.S20) < 0.03 && spread(w.S40) < 0.01 && w.variance.every((v, i) => i === 0 || v > w.variance[i - 1])
        && R.persistenceSinc.corr[0] > 0.998 && R.persistenceSinc.ampRatio[1] - R.persistenceSinc.ampRatio[0] < 0.02; },
    why: 'S(q = 20) and S(40) vary < 3% / < 1% across N = 500…5000 while the window variance grows with 2k_max: new levels add only finer scales; sinc persistence 0.9985–1.0000, amplitude ratio 0.995–1.012.',
  },
  {
    id: 'r32-input-is-the-fluctuation',
    holds: () => { const d = ZEROS30.map((g, i) => g - bisect((E) => thetaExact(E) / PI + 1 - (i + 1 - 0.5), g - 3, g + 3));
      const rms = Math.sqrt(d.reduce((s, x) => s + x * x, 0) / d.length);
      return d.every((x) => abs(x) < 1.5) && rms > 0.1 && rms < 0.8 && R.wkb.rmsGammaT500 > R.wkb.rmsGammaT2000
        && R.fitResidual.every(([, r]) => r < 3e-10); },
    why: 'γ_n − t_n with N_sc(t_n) = n − 1/2 (first 30 zeros, live exact θ) is the O(1) S-type fluctuation the inverse fit must encode (rms 0.387 at N = 500, 0.333 at N = 2000); all discrete fits reach ≤ 1.8e-10.',
  },
  {
    id: 'r32-honest-scope',
    holds: () => R.status === 'done' && /consumes the zero ordinates/.test(R.verdict) && /NOT established/.test(R.verdict) && /simple zeros/.test(R.verdict)
      && /PT Lambda <= 0\.2 stands/.test(R.verdict) && /NO QED/.test(R.verdict) && R.refereeKilled.length === 9 && /REFUTED/.test(R.refereeKilled[0]),
    why: 'Map result; continuum bug corrected; regularity/whiteness not established; no RH lever; no Λ change; no QED.',
  },
]);

export default ROUTE_32;
