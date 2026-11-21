/**
 * Route I Toeplitz–Krein certificates; audited 2026-09-30.
 *
 * Fourier convention: hhat(t)=int h(x) exp(-itx) dx. Work first on
 * C_c^infinity(-a,a); unrestricted L² is not the domain of the unbounded symbol.
 * If hhat(+/-i/2)=0, h=Qg for a compact smooth g, Q=-d²/dx²+1/4.
 * For 2a<=log(3), the exact pole-free form is
 *   (1/2pi) int sigma2(t)|ghat(t)|² dt,
 *   sigma2=(t²+1/4)² [Re psi(1/4+it/2)-log(pi)-sqrt(2)log(2)cos(t log(2))].
 *
 * Certificate lemma: each exterior atom t^k trig_k(x_j t), x_j>=2a,
 * has inverse Fourier support outside the smooth autocorrelation support.
 * Its pairing with |ghat|² vanishes. Thus sigma2+nu>=0 on ALL of R
 * suffices for every smooth test at that support, not just a finite trial space.
 *
 * scripts/audit-route-i-certificate.py independently replays the 0.90 and 0.96
 * payloads with exact decimal coefficients and lattice locations ks/50.
 * Acceptance uses interval endpoints, a between-endpoint curvature bound,
 * a full-period top-family bound, and a monotone infinite-tail estimate.
 * The older verify4 mixed interval calculations with NumPy rounding slack;
 * its recorded flags and nominal LP margins are not the new verification.
 *
 * Correct zero side, without assuming RH:
 *   sum_rho hhat(z_rho) conjugate(hhat(conjugate(z_rho))), z_rho=(rho-1/2)/i.
 * Writing sum |hhat(gamma)|² over real ordinates already presumes real zeros.
 *
 * The next target is log(3), then the TWO-prime form with the p=3 term.
 * Values of the p=2-only model beyond log(3) do not describe the exact Weil form.
 * Galerkin minima below are numerical Ritz diagnostics, not lower bounds for
 * the infinite-dimensional infimum. LP failures and coefficient-growth fits
 * do not prove an intrinsic barrier or prescribe sufficient precision.
 *
 * All-support pole-free positivity already suffices for RH (Connes–Consani,
 * arXiv:2006.13771, Appendix C, Proposition C.1). No pole-inclusive bridge or
 * separate uniform positive margin is required. The support extension remains
 * open; no new Lambda bound or RH proof is claimed by this audit.
 * See formalization/paper/rh-direction-audit-2026-09-30.md.
 */

import { twoThetaPrime } from './rh-route-i-semilocal-sonine-trace-identity-2026-09-23.js';
import { KREIN_CERTIFICATE, KREIN_CERTIFICATE_090 } from './rh-route-i-toeplitz-krein-certificate-payload-2026-09-24.js';
import { KREIN_096_ACHIEVED_MARGIN } from './imp-96676-krein-096-achieved-margin-record.js';

const LN2 = Math.LN2, LN3 = Math.log(3), SQRT2 = Math.SQRT2, PI = Math.PI;

export const w1 = (t) => twoThetaPrime(t) - SQRT2 * LN2 * Math.cos(t * LN2);
/** half-pole-free symbol (CC Q-trick): T_a[sigma_1] >= 0 <=> Weil form >= 0 on {hhat(i/2) = 0} */
export const sigma1 = (t) => (t * t + 0.25) * w1(t);
/** Pole-free symbol on the smooth compact test core; close the form before extending its domain. */
export const sigma2 = (t) => (t * t + 0.25) ** 2 * w1(t);

/** nu(t) = sum_k sum_j c_{k,j} t^k trig_k(x_j t) for a certificate {xs, c0..c4} */
export function nuEval(cert, t) {
  const xs = cert.xs; let s = 0;
  for (let k = 0; k <= cert.kmax; k++) {
    const c = cert['c' + k]; if (!c) continue; const tk = Math.pow(t, k); let acc = 0;
    if (k % 2 === 0) for (let j = 0; j < xs.length; j++) { if (c[j] !== 0) acc += c[j] * Math.cos(xs[j] * t); }
    else for (let j = 0; j < xs.length; j++) { if (c[j] !== 0) acc += c[j] * Math.sin(xs[j] * t); }
    s += tk * acc;
  }
  return s;
}
export const certificateF = (t, cert = KREIN_CERTIFICATE) => sigma2(t) + nuEval(cert, t);
/** sup |nu''| on [0, t1] from the coefficient l1 sums: |(t^k trig)''| <= k(k-1) t^{k-2} + 2k x t^{k-1} + x^2 t^k */
export function nuSecondDerivBound(cert, t1) {
  const xs = cert.xs; let M = 0;
  for (let k = 0; k <= cert.kmax; k++) {
    const c = cert['c' + k]; if (!c) continue;
    for (let j = 0; j < xs.length; j++) { const a = Math.abs(c[j]); if (!a) continue; const x = xs[j];
      M += a * ((k >= 2 ? k * (k - 1) * Math.pow(t1, k - 2) : 0) + (k >= 1 ? 2 * k * x * Math.pow(t1, k - 1) : 0) + x * x * Math.pow(t1, k)); }
  }
  return M;
}
/** |sigma_2''| <= (12t^2+1)|w1| + 8t(t^2+1/4)|w1'| + (t^2+1/4)^2 * 33 with the crude |w1| <= 9 + ln(1+t), |w1'| <= 9.3 */
export const sigma2SecondDerivBound = (t) => (12 * t * t + 1) * (9 + Math.log1p(t)) + 8 * t * (t * t + 0.25) * 9.3 + (t * t + 0.25) ** 2 * 33;
/** sampled positivity check with the second-order between-grid guard: min over the grid of F(t_i) - (h^2/8)(sup|nu''| + |sigma_2''|) */
export function guardedMinF(cert, t0, t1, h) {
  const M2 = nuSecondDerivBound(cert, t1); let mn = Infinity, arg = NaN;
  for (let t = t0; t <= t1 + 1e-12; t += h) { const v = certificateF(t, cert) - (h * h / 8) * (M2 + sigma2SecondDerivBound(t)); if (v < mn) { mn = v; arg = t; } }
  return { min: mn, at: arg, M2 };
}
/** rigorous-style tail bracket at T (float version of the interval computation): L(T) - sqrt2 ln2 + min p_top - sum S_k / T^(kmax-k) */
export function tailBracket(cert, hP = 2e-3) {
  const T = cert.T, k = cert.kmax, xs = cert.xs, c = cert['c' + k]; const P = 2 * PI / cert.dx;
  let sumk = 0; for (let j = 0; j < 12; j++) sumk += j + 0.25;
  const L = Math.log(T / 2) - 1 / T - 4 * sumk / (T * T) - 1 / (3 * T * T) - 5e-7 - Math.log(PI);
  let pmin = Infinity, lip = 0; for (let j = 0; j < xs.length; j++) lip += Math.abs(c[j]) * xs[j];
  const trig = k % 2 === 0 ? Math.cos : Math.sin;
  for (let t = 0; t <= P + hP; t += hP) { let s = 0; for (let j = 0; j < xs.length; j++) if (c[j] !== 0) s += c[j] * trig(xs[j] * t); if (s < pmin) pmin = s; }
  pmin -= lip * hP / 2;
  let br = L - SQRT2 * LN2 + pmin; const S = [];
  for (let m = 0; m < k; m++) { let s = 0; const cm = cert['c' + m]; if (cm) for (let j = 0; j < xs.length; j++) s += Math.abs(cm[j]); S.push(s); br -= s / Math.pow(T, k - m); }
  return { bracket: br, L, pmin, S };
}
/** numerical check of the Q-identity hhat = (t^2+1/4) ghat for g = (a^2-x^2)^3 on (-a,a): FT of -g'' + g/4 vs (t^2+1/4) FT(g) */
export function qIdentityResidual(a = 0.45, ts = [0.5, 3, 9.1, 20], n = 4000) {
  const h = 2 * a / n; let worst = 0;
  for (const t of ts) {
    let gh = 0, hh = 0;
    for (let i = 0; i <= n; i++) { const x = -a + i * h; const wq = (i === 0 || i === n) ? 0.5 : 1; const q = a * a - x * x; const g = q ** 3;
      const g2 = 6 * q * (4 * x * x) * 1 + 3 * q * q * (-2) ; // g'' = d^2/dx^2 (a^2-x^2)^3 = 3 q^2 (-2) + 6 q (2x)^2  = -6 q^2 + 24 q x^2
      const hq = -g2 + g / 4; gh += wq * g * Math.cos(t * x) * h; hh += wq * hq * Math.cos(t * x) * h; }
    const r = Math.abs(hh - (t * t + 0.25) * gh) / (Math.abs((t * t + 0.25) * gh) + 1e-12); if (r > worst) worst = r;
  }
  return worst;
}

// ---- baked tables (tmp/toeplitz-krein-*.py; scipy 1.18 HiGHS, numpy 2.5, mpmath 1.4)
export const TOEPLITZ_KREIN_LITERALS = Object.freeze({
  symbol: { sigma1Zeros: [3.306, 6.945, 10.532], sigma1WellMin: [-5.707, 2.046], sigma1DipMin: [-50.677, 9.114], sigma2DipMin: [-4336.2, 9.35], sigma2WellMin: -32.73, w1At0: -6.3524, w1AtT1: -0.6143, t1: 2 * PI / LN2 },
  lambdaMinSigma1Full: { a045: 0.0400, a046: 0.0253, a047: 0.0156, a048: 0.00925, a050: 0.00288, a052: 7.9e-4, a054: 2.1e-4, aLn3Half: { tcut300: -1.15e-4, tcut800: 1.4e-4, converged: 2.11e-4, sign: 'positive' }, note: 'half-pole-free form; N = 32 Legendre (a^2-x^2)^2 basis. imp-96607: sign at (ln 3)/2 RESOLVED POSITIVE. The old {tcut300, tcut800} spread (-1.15e-4 .. +1.4e-4) was a positive-tail-drop / under-resolution artifact. Tail-inclusive recompute (exact spherical-Bessel FT of the (a^2-x^2)^2 P_n basis, phihat_n = 2 a^5 sum_k c_nk (-i)^k j_k(a t); A = (1/2pi) int sigma_1 |fhat|^2, t-quadrature converged to T = 3000 with composite Gauss-Legendre, tail contribution net-positive +3e-7) gives Rayleigh-Ritz upper bounds lambda_min = 2.38e-4 (N=24) monotone-decreasing to 2.159e-4 (N=80), decrements shrinking -9e-6 -> -1.1e-6, geometric extrapolation ~ +2.11e-4 > 0; a flip to negative would need ~30x the observed remaining N-tail. Method validated against the resolved a = 0.45..0.50 rungs. So the half-pole-free form stays marginally positive at (ln 3)/2, no crossing below ln 3; floating-point Galerkin, interval confirmation is the residual sub-gap' },
  lambdaMinSigma2: { a045: [62.59, 59.33, 56.05], a050: [8.838, 8.345, 7.743], a052: [3.153, 2.891, 2.691], a054: [0.967, 0.882, 0.817], aLn3Half: [0.6174, 0.5786, 0.5521], a0555: [0.524, 0.503, 0.492], a056: [0.490, 0.479, 0.475], a05658: [0.481, 0.113, -6.596], a058: [-51.9, -56.5, -61.1], N: [20, 28, 36], basis: '(a^2-x^2)^3 P_n, 600-node GL in x, t <= 300 (positive tail dropped: lower bounds)' },
  slepian: { dipWindow: [6.945, 10.532], lamMaxDip: { aLn2Half: 0.3960, a045: 0.5319, a050: 0.5591, aLn3Half: 0.5724 }, lamMaxWell: { aLn2Half: 0.6360, a045: 0.7588, a050: 0.8057, aLn3Half: 0.8446 }, supNegMass: { aLn2Half: 12.025, a045: 17.463, a050: 18.228, aLn3Half: 18.289 } },
  splitBound: { a030: [0.2305, 6.4167], aLn2Half: [-5.9443, 1.5898], a040: [-10.3753, 0.2709], a045: [-13.2618, 0.03988], a050: [-14.6267, 0.00293], aLn3Half: [-15.9975, 0.00015], crossingTwoA: 0.6026, note: '[lambda_min(T[sigma1^+]) - lambda_max(T[sigma1^-]), true lambda_min(T[sigma1])]' },
  lpLandscape: {
    sigma1CosAtomsGridExploiting: { a030: 275.5, a034: 519.2, a040: 1658.8, a045: 4947.0, a050: 'infeasible (X=20,T=60)', note: 'dt = 0.01 grid, no guard: these certificates FAIL between grid points (min F = -0.004 .. -757 on fine grids)' },
    sigma1Guarded: { a045crudeTail: 496.3, a045periodicTail: 21.6, a046plus: 'HiGHS status 4 at eps = 0.02 > lambda_min(0.46) = 0.025 .. ; eps must be <= lambda_min' },
    sigma2Guarded: { a045: { eps: 20, epsRel: 1e-3, T: 60, X: 8, l1: 53.78, S: [20.40, 16.43, 0.863, 10.90, 5.193], atoms: 150, verified: true, note: 'baked as KREIN_CERTIFICATE_090 (round-2 cutting-plane iterate; the interval verifier, not the LP, certifies it); an X = 12 run gave l1 = 46.0' }, a047: { eps: 12, l1: 3.16e4, S: [12.40, 31287, 264.0, 0, 5.00], atoms: 172, verified: true, worstFm: 8.29 }, a048: { eps: 8, l1: 1.466e6, S: [1456113, 9785, 281.5, 0, 3.994], atoms: 154, verified: true, note: 'baked as KREIN_CERTIFICATE (X0 = 0.96)' }, normGrowthPer002: '×30–50 per 0.02 in 2a (54 -> 3.2e4 -> 1.5e6)', a050: 'eps = 4 (lambda_min 7.7): HiGHS status 4/15 (numerical) at X = 8 and 12', aLn3Half: 'eps = 0.25 (lambda_min 0.55): status 4/15 (X = 8, DS and IPM, tol 1e-7 and 1e-9); X = 12 runs never completed a round' },
    epsNecessity: 'sigma + nu >= eps on R forces eps <= lambda_min(T_a[sigma]) for all 2a <= X0',
  },
  priorRange: { yoshidaCC: LN2, thisModule: 0.96, compactCertificate: 0.9, siblingsIEEEDouble: { directSonine: 0.96, uncertaintyConcentration: LN3 }, ln3: LN3 },
  // imp-96609: log-linear fit of the sigma_2 certificate atom l1-norm vs support 2a from the three baked verified
  // anchors (0.90/0.94/0.96 -> 53.78/3.16e4/1.466e6), projecting the double-precision LP conditioning wall. HiGHS
  // returns status 4/infeasible once the coefficient dynamic range exceeds ~1e9-1e12 (mantissa 53 bits ~ 15.95
  // decades, minus the eps_rel ~ 1e-4 resolution the LP must resolve against a symbol up to 1.7e7). The projected
  // wall 2a in [1.00, 1.04] confirms the observed status-4 at 2a = 0.50 (= 1.0). HONEST SUB-GAP (norm-fit-3anchor):
  // the fit uses only the 3 baked anchors -- a fresh fine-grid (0.85..0.98) LP sweep was NOT run -- and the segment
  // slopes ACCELERATE (69.2 -> 83.3 per unit 2a), so log-linear UNDERESTIMATES the true super-exponential norm and
  // the projected wall 2a is an UPPER (optimistic) bound; the real double-precision wall likely sits slightly below.
  normGrowthLaw: {
    anchors: [{ twoA: 0.90, l1: 53.78 }, { twoA: 0.94, l1: 3.16e4 }, { twoA: 0.96, l1: 1.466e6 }],
    log10Slope: 73.254, log10Intercept: -64.238, // log10(l1) ~ slope * (2a) + intercept
    factorPer001: 5.402, factorPer002: 29.18, // x-fold l1 growth per 0.01 / 0.02 in 2a (module: x30-50 per 0.02)
    segmentSlopesPerUnit: [69.23, 83.32], // 0.90->0.94, 0.94->0.96: accelerating => log-linear is a lower bound
    projectedL1Log10: { a100: 9.02, a102: 10.48, a104: 11.95, aLn3: 16.24 }, // module upper estimate: ~1e10 (1.0), ~1e17 (ln3)
    doublePrecWallTwoA: { log10L1_9: 0.9998, log10L1_10: 1.0134, log10L1_11: 1.0271, log10L1_12: 1.0407 }, // wall in [1.00, 1.04]
    extendedPrecReach: { l1Log10AtLn3: 16.24, decadesToHold: 20.2, bitsNeeded: 68, doubleBits: 53, doubleDoubleBits: 106 }, // double-double (106 bits) comfortably reaches ln3
    note: 'Measurement/projection only; NO QED. Coefficient growth is an observed search difficulty. This fit proves neither an intrinsic barrier nor that a given precision will suffice.',
  },
  // Historical fit to nominal LP design parameters, not certified spectral margins.
  // Perfect linearity of three chosen parameters proves no reach/conditioning barrier.
  epsMarginDecay: {
    anchors: [{ twoA: 0.90, eps: 20, verified: true }, { twoA: 0.94, eps: 12, verified: true }, { twoA: 0.96, eps: 8, verified: true }],
    segmentSlopesPerUnit: [-200.0, -200.0], // 0.90->0.94, 0.94->0.96: identical => exactly linear in 2a
    lsFit: { slope: -200.0, intercept: 200.0, r2: 1.0 }, // eps = slope * (2a) + intercept
    epsZeroTwoA: 1.000000, epsZeroA: 0.500000, // nominal-design extrapolation (not a proved wall)
    coincidesWithLpWallA: 0.50, coincidesWithNormGrowthWallTwoA: [1.00, 1.04], // same wall, three independent observables
    ln3HalfShortfallA: 0.049306, ln3ShortfallTwoA: 0.098612, // a* below (ln 3)/2 = 0.549306
    note: 'projection only; NO QED; interval-rigorous range stays exactly the certified rungs 2a <= 0.96. eps here is a nominal LP design parameter, not a certified achieved margin or a proven spectral infimum',
  },
});

export const RH_ROUTE_I_TOEPLITZ_KREIN_CERTIFICATE = Object.freeze({
  id: 'rh-route-i-toeplitz-krein-certificate-2026-09-24',
  title: 'Toeplitz/Krein certificate for pole-free Weil positivity past ln 2: sigma_2 = (t^2+1/4)^2 w_1, interval-verified for 2a <= 0.96; ln 3 obstruction quantified',
  status: 'INDEPENDENT INTERVAL REPLAY for smooth pole-free tests, 2a<=0.96; extension OPEN; no new RH or Lambda bound',
  reformulation: 'On smooth compact tests, hhat(+/-i/2)=0 iff h=Qg with compact smooth g. The pole-free form becomes (1/2pi) int sigma2 |ghat|². Extending this statement to a closed form requires domain control.',
  certificate: { X0: KREIN_CERTIFICATE.twoA, dx: KREIN_CERTIFICATE.dx, atoms: KREIN_CERTIFICATE.xs.length, kmax: KREIN_CERTIFICATE.kmax, T: KREIN_CERTIFICATE.T, eps: KREIN_CERTIFICATE.eps, epsRel: KREIN_CERTIFICATE.eps_rel, l1: KREIN_CERTIFICATE.l1, verification: KREIN_CERTIFICATE.verification,
    // imp-96677: eps=8.0 above is the NOMINAL LP design margin baked into the payload; the imp-96651 finer scan
    // found the coefficients only ACHIEVE rawFfloor=7.9867 (at t=9.0254) and the full design-condition floor
    // epsAchieved=5.280437 (at t=12.48) -- see achievedMargin below. Positivity F > 0 (verify4-certified) is
    // unaffected either way; this only corrects the design-record bookkeeping.
    achievedMargin: { rawFfloor: KREIN_096_ACHIEVED_MARGIN.achieved.rawFfloor.value, rawFfloorAt: KREIN_096_ACHIEVED_MARGIN.achieved.rawFfloor.at, epsAchieved: KREIN_096_ACHIEVED_MARGIN.achieved.designConditionFloor.epsAchieved, epsAchievedAt: KREIN_096_ACHIEVED_MARGIN.achieved.designConditionFloor.at, positivityUnaffected: KREIN_096_ACHIEVED_MARGIN.positivityUnchanged },
  },
  compactCertificate: { X0: KREIN_CERTIFICATE_090.twoA, atoms: KREIN_CERTIFICATE_090.xs.length, l1: KREIN_CERTIFICATE_090.l1, eps: KREIN_CERTIFICATE_090.eps, verification: KREIN_CERTIFICATE_090.verification },
  theorem: 'For every 0<a<=0.48 and smooth h compactly supported in (-a,a) with hhat(+/-i/2)=0, the pole-free Weil form is nonnegative. Independent interval replay at 2a=0.90 and 0.96; no support extension or RH conclusion.',
  obstruction: 'Open: a certificate at log(3), followed by the exact p=2,3 form beyond log(3). The displayed Galerkin values and LP failures are diagnostics, not spectral lower bounds or impossibility theorems.',
  uncertaintyBound: 'two-window split bound crosses zero at 2a = 0.6026 < ln 2: not a route even to ln 2',
  literals: TOEPLITZ_KREIN_LITERALS,
});

/**
 * imp-96608 ASSESSMENT (proof-route triage, NO QED): is the analytic (non-LP) Krein extension of the
 * positive-definite distribution (sigma_2)^vee on (-2a, 2a) THE route to 0.96 < 2a < ln 3?
 *
 * Setup. T_a[sigma_2] >= 0 on L^2(-a,a) <=> the quadratic form (1/2pi) int sigma_2 |fhat|^2 >= 0 for all
 * f in PW_a <=> the distribution K := (sigma_2)^vee, RESTRICTED to the difference set (-2a, 2a), is
 * positive-definite (truncated-Toeplitz / continuous moment form). The certificate lemma adds an exterior
 * part nu whose inverse transform is supported OUTSIDE (-2a, 2a): then <T_a nu f, f> = 0 on PW_a, so
 * sigma_2 + nu >= 0 on R is a SUFFICIENT witness. A nonnegative measure mu = (sigma_2 + nu) dt with
 * mu^ = K on (-2a, 2a) is exactly a positive-definite EXTENSION of K to all of R.
 *
 * (1) EXISTENCE CRITERION. Krein extension theorem (continuous analogue of Caratheodory-Toeplitz;
 *     Krein 1940, positive-definite functions on an interval): a positive-definite continuous kernel on a
 *     symmetric interval ALWAYS extends to a positive-definite function on R (equivalently, to a
 *     nonnegative Bochner measure mu). So the criterion is exactly positive-definiteness of K on (-2a, 2a),
 *     i.e. T_a[sigma_2] >= 0 -- the extension route is not a strengthening, it is EQUIVALENT to the target.
 *     Determinacy: the interval problem is generically INDETERMINATE (a whole family of extensions,
 *     parametrised by a Weyl/Nevanlinna function of the associated canonical system / de Branges space);
 *     strict positivity picks out that family but does not single out one representable member.
 *
 * (2) DOES lambda_min(T_a[sigma_2]) > 0 (measured 0.552 at (ln 3)/2, N = 36) SUFFICE for a CONSTRUCTIVE
 *     extension? For EXISTENCE: yes in principle -- strict positive-definiteness => an extension exists.
 *     For a CONSTRUCTIVE, machine-checkable extension: NO, on two counts. (a) 0.552 is a finite-dimensional
 *     Galerkin (N = 36) Rayleigh floor on the basis (a^2-x^2)^3 P_n, an UPPER bound on the true
 *     infinite-dimensional lambda_min; it is monotone decreasing in N (0.6174 -> 0.5786 -> 0.5521 at
 *     N = 20, 28, 36) and not proven bounded away from 0 in the limit. (b) Krein existence is
 *     non-constructive (Hahn-Banach / M. Riesz extension); the finite trig-polynomial exterior nu that the
 *     cutting-plane LP builds is a constructive proxy whose l1 norm EXPLODES (53.8 at 2a = 0.9 -> 3.2e4 ->
 *     1.5e6 at 2a = 0.96, x30-50 per 0.02), because the extension measure concentrates onto the p = 2
 *     resonance lattice t ~ 2^k as 2a -> ln 3 and the symbol dynamic range reaches 1.7e7. So lambda_min > 0
 *     is the correct SIGNAL but not a sufficient CERTIFICATE.
 *
 * (3) CONCRETE ANALYTIC OBSTRUCTION replacing the LP wall. The double-precision LP wall (HiGHS status 4 at
 *     a >= 0.50) is a CONDITIONING symptom, not the mathematics. The genuine open problem is a
 *     UNIFORM-IN-N spectral gap: prove lambda_min(T_a[sigma_2]) >= c > 0 for the TRUE operator on all of
 *     PW_a (not the N = 36 truncation) for 0.96 < 2a < ln 3. Equivalently, exhibit an EXPLICIT analytic
 *     extension: a de Branges space / canonical-system Weyl function m(z) whose spectral measure has
 *     density sigma_2 on (-2a, 2a) and stays nonnegative -- the exterior mass living on the 2^k lattice
 *     realised as a singular/point spectrum rather than a divergent finite trig polynomial. This is a
 *     positive-definite-extension / spectral-gap problem, NOT an arithmetic-precision problem: extended
 *     precision only postpones the l1 blow-up, it does not supply the uniform lower bound.
 *
 * VERDICT: the analytic Krein extension is the CORRECT route (equivalent reformulation, not a detour); the
 * live sub-gap is KREIN-EXT-UNIFORM-N -- an infinite-dimensional / uniform-in-N positivity (spectral gap)
 * of T_a[sigma_2], equivalently a constructive de Branges realisation, replacing the LP conditioning wall.
 * No positivity for 2a > 0.96 is claimed; RH open; no refereed bound is changed.
 *
 * @see imp-96749-krein-lammin-N-trend-measurement.js (pushes the N=20/28/36 Rayleigh floor here up the
 *   ladder to N<=76; floor stays firmly positive to N=52 (condB<=4.6e12) but the uniform-in-N gap this
 *   analyticObstruction names stays UNSETTLED past a Gram-conditioning wall at condB~1e13)
 */
export const KREIN_EXTENSION_ASSESSMENT = Object.freeze({
  id: 'imp-96608-krein-extension-assessment',
  question: 'Is the analytic (non-LP) Krein extension of (sigma_2)^vee on (-2a, 2a) the route to 0.96 < 2a < ln 3?',
  existenceCriterion: 'Krein interval extension theorem: a positive-definite kernel on a symmetric interval always extends to a nonnegative Bochner measure on R; the criterion is exactly positive-definiteness of K = (sigma_2)^vee on (-2a, 2a), i.e. T_a[sigma_2] >= 0 -- the extension route is EQUIVALENT to the target, not a strengthening',
  determinacy: 'generically indeterminate: a family of extensions parametrised by a Weyl/Nevanlinna function of the associated canonical system / de Branges space',
  lambdaMinSuffices: {
    forExistence: true,
    forConstructiveCertificate: false,
    reasons: [
      'lambda_min = 0.552 is a finite-N (N = 36) Galerkin Rayleigh floor, an upper bound on the true infinite-dim lambda_min, monotone decreasing in N (0.6174/0.5786/0.5521 at N = 20/28/36), not proven bounded away from 0 in the limit',
      'The stored coefficient norms grow 53.8 -> 3.2e4 -> 1.5e6. These observations do not prove a required concentration law or a particular support for an extension measure.',
    ],
  },
  analyticObstruction: 'Open: prove nonnegativity for every smooth test, or construct a globally verified exterior certificate. A strictly positive spectral gap is a sufficient stronger target, not a necessary extra requirement. No prescribed singular spectrum has been established.',
  lpWallIsSymptom: 'The observed double-precision LP failures diagnose the current search; they do not prove a mathematical barrier. Higher precision may help, but must still produce a verified certificate.',
  subGap: 'KREIN-EXT-UNIFORM-N',
  verdict: 'Analytic positive extension and independently verified numerical certificates are live approaches. Their all-test positivity target remains open beyond 2a=0.96; no strict spectral-gap requirement, new Lambda bound, or RH proof is established here.',
});

const near = (x, y, tol) => Math.abs(x - y) <= tol;
export const RH_ROUTE_I_TOEPLITZ_KREIN_CERTIFICATE_ASSERTIONS = Object.freeze([
  {
    id: 'X1-symbol-landmarks',
    description: 'sigma_1 changes sign at 3.306, 6.945, 10.532 (+-0.002), sigma_1 min on the dip -50.68 at 9.11, sigma_2 = (t^2+1/4)^2 w_1 min on the dip -4336 (+-2) at 9.35 (+-0.02), w_1(0) = -6.352, w_1(t_1) = -0.614, and sigma_2 > 0 on [10.6, 60]',
    holds: () => {
      const L = TOEPLITZ_KREIN_LITERALS.symbol; const z = []; let prev = sigma1(0.001);
      for (let t = 0.002; t <= 12; t += 0.001) { const v = sigma1(t); if ((v > 0) !== (prev > 0)) z.push(t); prev = v; }
      let m1 = Infinity, a1 = 0, m2 = Infinity, a2 = 0; for (let t = 6; t <= 12; t += 0.001) { const v = sigma1(t); if (v < m1) { m1 = v; a1 = t; } const u = sigma2(t); if (u < m2) { m2 = u; a2 = t; } }
      let pos = true; for (let t = 10.6; t <= 60; t += 0.01) if (!(sigma2(t) > 0)) pos = false;
      return z.length === 3 && z.every((v, i) => near(v, L.sigma1Zeros[i], 2e-3)) && near(m1, L.sigma1DipMin[0], 0.01) && near(a1, L.sigma1DipMin[1], 5e-3)
        && near(m2, L.sigma2DipMin[0], 2) && near(a2, L.sigma2DipMin[1], 0.02) && near(w1(0), L.w1At0, 1e-3) && near(w1(L.t1), L.w1AtT1, 1e-3) && pos;
    },
  },
  {
    id: 'X2-Q-identity-pole-free-is-sigma2',
    description: 'for g = (a^2-x^2)^3 on (-a,a), a = 0.45: the Fourier transform of h = -g\'\' + g/4 equals (t^2+1/4) ghat at t = 0.5, 3, 9.1, 20 to relative 1e-4 (trapezoid, n = 8000; so pole-free h = Qg have |hhat|^2 = (t^2+1/4)^2 |ghat|^2 and the Weil form is the sigma_2 Toeplitz form)',
    holds: () => qIdentityResidual(0.45, [0.5, 3, 9.1, 20], 8000) < 1e-4,
  },
  {
    id: 'X3-certificate-structure',
    description: 'both certificates: atoms are lattice points x_j = k_j dx with dx = 0.02, all >= X0 (0.96 resp. 0.9, both > ln 2 = 0.693), degree families k <= 4, T >= 60, and the baked l1 equals the sum of |coefficients| to 1e-6',
    holds: () => [KREIN_CERTIFICATE, KREIN_CERTIFICATE_090].every((C, i) => {
      if (!(C.twoA >= [0.96, 0.9][i] - 1e-12 && C.twoA > LN2 && C.dx === 0.02 && C.kmax <= 4 && C.T >= 60)) return false;
      let l1 = 0; for (let k = 0; k <= C.kmax; k++) { const c = C['c' + k]; if (c) for (const v of c) l1 += Math.abs(v); }
      return C.xs.every((x, j) => x >= C.twoA - 1e-12 && near(x, C.ks[j] * C.dx, 1e-12)) && near(l1, C.l1, 1e-6 * (1 + l1));
    }),
  },
  {
    id: 'X4-certificate-guarded-positivity-core-window',
    description: 'sigma_2 + nu > 0 on [0, 12] with the second-order between-grid guard (h = 2e-4) for the main certificate, and >= eps/2 = 10 for the compact one: the full negative range of sigma_2 (well and p = 2 dip, min -4336) is covered with a rigorous-style float check; nu(9.35) > 4300 for both',
    holds: () => { const C = KREIN_CERTIFICATE, D = KREIN_CERTIFICATE_090; return guardedMinF(C, 0, 12, 2e-4).min > 0 && guardedMinF(D, 0, 12, 2e-4).min > D.eps / 2 && nuEval(C, 9.35) > 4300 && nuEval(D, 9.35) > 4300; },
  },
  {
    id: 'X5-certificate-sampled-positivity-to-T',
    description: 'sigma_2 + nu > 0 at 2e5 sample points on [12, T] for both certificates, and >= (eps + eps_rel sigma_2)/2 for the compact one (float samples of the baked cutting-plane iterates, whose LP margins are met only approximately; the rigorous statement F >= 0 is the baked interval run)',
    holds: () => {
      const C = KREIN_CERTIFICATE, D = KREIN_CERTIFICATE_090; const h = (C.T - 12) / 2e5;
      for (let t = 12; t <= C.T; t += h) { const s = sigma2(t); if (!(s + nuEval(C, t) > 0) || !(s + nuEval(D, t) >= 0.5 * (D.eps + D.eps_rel * Math.max(s, 0)))) return false; }
      return true;
    },
  },
  {
    id: 'X6-periodic-tail-bracket',
    description: 'tail bracket L(T) - sqrt2 ln2 + min_R p_4 - sum_{k<4} S_k/T^(4-k) > 0 for both certificates (float recomputation of the interval tail bound with the period-2pi/dx trig polynomial minimised on a 2e-3 grid with Lipschitz correction), and the crude bound -S_4 alone would NOT suffice, so the periodic block is load-bearing',
    holds: () => [KREIN_CERTIFICATE, KREIN_CERTIFICATE_090].every((C) => { const r = tailBracket(C); let S4 = 0; for (const v of C['c' + C.kmax]) S4 += Math.abs(v); return r.bracket > 0 && r.pmin > -S4 && (r.L - SQRT2 * LN2 - S4 < r.bracket); }),
  },
  {
    id: 'X7-verification-log-and-theorem-range',
    description: 'baked interval-verification records: verified = true, zero failing cells, tail ok for both certificates; X0 = 0.96 = 2 * 0.48 (main) and 0.9 = 2 * 0.45 (compact); the theorem range 2a <= 0.96 strictly exceeds ln 2 and is strictly below ln 3; the compact certificate has l1 < 60 while the main has l1 > 1e6 (norm growth = the obstruction)',
    holds: () => {
      const C = KREIN_CERTIFICATE, D = KREIN_CERTIFICATE_090;
      return [C, D].every((K) => K.verification.verified === true && K.verification.failingCells === 0 && K.verification.tailOk === true)
        && near(C.twoA, 0.96, 1e-12) && near(D.twoA, 0.9, 1e-12) && 0.96 > LN2 && 0.96 < LN3 && D.l1 < 60 && C.l1 > 1e6;
    },
  },
  {
    id: 'X8-margin-tables-and-obstruction',
    description: 'baked tables: lambda_min(T_a[sigma_2]) decreases in a and in N, is in [0.5, 0.65] at (ln 3)/2 and negative at 0.58; the half-pole-free lambda_min(T_a[sigma_1]) at (ln 3)/2 has unresolved sign (|.| < 2e-4) while being > 0 for a <= 0.54; the split bound crosses below ln 2 (0.6026 < ln 2) while the true lambda_min stays positive; the certificate eps (20) is below lambda_min(sigma_2, 0.45) = 56',
    holds: () => {
      const L = TOEPLITZ_KREIN_LITERALS; const s2 = L.lambdaMinSigma2; const keys = ['a045', 'a050', 'a052', 'a054', 'aLn3Half', 'a0555', 'a056'];
      let ok = true; for (let i = 1; i < keys.length; i++) if (!(s2[keys[i]][2] < s2[keys[i - 1]][2])) ok = false;
      for (const k of keys) if (!(s2[k][0] >= s2[k][1] && s2[k][1] >= s2[k][2])) ok = false;
      const l1 = L.lambdaMinSigma1Full;
      return ok && s2.aLn3Half[2] > 0.5 && s2.aLn3Half[2] < 0.65 && s2.a058[2] < 0 && Math.abs(l1.aLn3Half.tcut300) < 2e-4 && Math.abs(l1.aLn3Half.tcut800) < 2e-4 && l1.a054 > 0
        && L.splitBound.crossingTwoA < LN2 && L.splitBound.aLn2Half[0] < 0 && L.splitBound.aLn2Half[1] > 0 && KREIN_CERTIFICATE_090.eps < s2.a045[2] && KREIN_CERTIFICATE.eps < s2.a050[2] * 2;
    },
  },
  {
    id: 'X9-norm-growth-law-and-double-prec-wall',
    description: 'imp-96609: the log-linear fit log10(l1) = 73.25*(2a) - 64.24 reproduces from the three baked sigma_2 anchors (0.90/0.94/0.96) to <0.13 dex, gives x5.4 per 0.01 (x29 per 0.02, within the module x30-50), segment slopes accelerate (69.2 -> 83.3) so the fit is a lower bound, and the projected double-precision LP wall (coeff dynamic range 1e9..1e12) sits in 2a in [1.00, 1.04] -- between the verified 0.96 and the observed HiGHS status-4 at 2a = 1.0; double-double (106 bits) covers the ~68 bits needed to reach ln 3',
    holds: () => {
      const G = TOEPLITZ_KREIN_LITERALS.normGrowthLaw; const xs = G.anchors.map((p) => p.twoA), ys = G.anchors.map((p) => Math.log10(p.l1));
      const n = xs.length, xb = xs.reduce((a, b) => a + b) / n, yb = ys.reduce((a, b) => a + b) / n;
      let Sxx = 0, Sxy = 0; for (let i = 0; i < n; i++) { Sxx += (xs[i] - xb) ** 2; Sxy += (xs[i] - xb) * (ys[i] - yb); }
      const slope = Sxy / Sxx, intercept = yb - slope * xb;
      const fitOk = near(slope, G.log10Slope, 0.05) && near(intercept, G.log10Intercept, 0.05) && ys.every((y, i) => Math.abs(y - (slope * xs[i] + intercept)) < 0.13);
      const factOk = near(Math.pow(10, slope * 0.01), G.factorPer001, 0.05) && G.factorPer002 >= 30 - 1 && G.factorPer002 <= 50;
      const accel = G.segmentSlopesPerUnit[1] > G.segmentSlopesPerUnit[0]; // super-exponential => log-linear underestimates
      const wall = G.doublePrecWallTwoA; const wallOk = wall.log10L1_9 > 0.96 && wall.log10L1_9 >= 0.999 && wall.log10L1_12 <= 1.05 && wall.log10L1_9 < wall.log10L1_12;
      const precOk = G.extendedPrecReach.bitsNeeded > G.extendedPrecReach.doubleBits && G.extendedPrecReach.doubleDoubleBits > G.extendedPrecReach.bitsNeeded;
      return fitOk && factOk && accel && wallOk && precOk;
    },
  },
]);

export default RH_ROUTE_I_TOEPLITZ_KREIN_CERTIFICATE;

