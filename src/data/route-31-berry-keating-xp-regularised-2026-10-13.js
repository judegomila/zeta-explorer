/**
 * @fileoverview route-31-berry-keating-xp-regularised-2026-10-13 — roadmap route 31 (batch 8, group F): Berry–Keating xp with Connes or Sierra
 * regularisations, tested against the first 10^5 zeros (up to γ = 74920.83). MAP result, not a step toward RH. One run plus one adversarial
 * internal referee pass (not refuted; severity minor: overclaims in 'proved', one misreported number, precision wording). Corrections applied.
 *
 * PROVED (elementary, re-derived by the referee): (a) Sierra–Rodriguez-Laguna (SRL) H = x(p + l_p²/p), wall x ≥ l_x: classical area
 *  A(E) = E·arccosh(E/c) − sqrt(E² − c²), c = 2·l_x·l_p (turning points p+·p− = l_p²); for l_x·l_p = 2π the SEMICLASSICAL count
 *  A/2π + μ = (E/2π)(ln(E/2π) − 1) + μ + 2π/E + O(E⁻³), against Riemann's 1/(48πE); levels exist only for E > 4π. (b) Tate local-factor
 *  reflection phase π^{−iE}·Γ(1/4 + iE/2)/Γ(1/4 − iE/2) = e^{2iθ(E)} (Fourier normalisation e^{−2πixξ}; with e^{−ixp} an extra 2^{iE},
 *  i.e. a rescaling of E). (c) Bender–Brody–Müller (BBM), formal level: ψ_s = −ζ(s, x+1), Δψ_s = x^{−s}, (xp + px)x^{−s} = i(2s − 1)x^{−s},
 *  ψ_s(0) = −ζ(s); the boundary condition selects ALL zeros, trivial ones give E = −5i, −9i, −13i (Bernoulli-polynomial eigenfunctions).
 *  Growth classes: an off-line zero with σ > 1/2 gives x^{1−σ}, slower than x^{1/2}; so reality of the point spectrum on any growth-cap domain
 *  of order ≥ x^{1/2} IMPLIES RH (one direction only — the converse needs the eigenvalues to be exactly {i(2ρ − 1)}, and Δ⁻¹ is ambiguous up
 *  to 1-periodic functions; proving reality there is at least as hard as RH). Δ = 1 − e^{−ip} has symbol zeros at p = 2πk, Δ⁻¹ unbounded.
 * CERTIFIED: nothing.
 * CONDITIONAL / ATTRIBUTION: Sierra–Townsend Landau-level realisation and the Connes–Consani zeta-cycle label are from memory; the finite-Λ
 *  Weil-form minimiser is built directly from the Weil explicit formula ("Connes cutoff" merges Connes 1999 with later Connes–Consani(–Moscovici)).
 * MEASURED (referee reproduced from src/data/zeros-to-1e6.js with exact log-gamma θ): Berry–Keating fit constant c = 0.875007 ± 5.3e-5 (= 7/8;
 *  Maslov 3/4 and 1 > 2000 SE away), cutoff product κ = 1 − 2.5e-9; SRL μ = 0.87457 ± 1.6e-4 (2.7 SE below 7/8: the +2π/E term). Gamma-phase
 *  spectrum θ(E_n) = π(n − 3/2): displacement RMS 0.3108 spacings, max 1.1287, 88.9% within half a spacing, corr with −S 0.9999999994; S std
 *  0.3108, max |S| 1.1287 at T = 71128.97. Spacing variance zeros 0.1607 (GUE 0.180) vs Gamma model ≈ 1e-22 θ-unfolded (4.9e-7 local density;
 *  the run's 2.5e-6 was misreported). Σ²(L) of zeros 0.40/0.34/0.42/0.34 at L = 5/10/20/50 (non-monotone, pooled heights; descriptive).
 *  Dirichlet-polynomial refinements lose real roots (N = 3..30: 92,156 → 80,828); Riemann–Siegel main sum: 98.97% within 0.1 spacing, root
 *  deficit 824 by 7.49e4 (referee independent code: 412 on [3e4, γ_1e5], consistent). Prime-orbit S correlation 0.896 → 0.9992 (X = 10 → 1e5;
 *  referee 0.99833 at X = 1e3 with 1 − log q/log X weights, 0.971 unweighted). Explicit formula with/without primes: max gap 4.3e-9 / 1.62.
 *  Finite-Λ Weil form: prime-side matrix = zero-side matrix (1e5 zeros) to 3e-12–1.7e-10 relative; λ² = 3 is effectively ONLY p = 2 (n = 3 sits
 *  at u = ln 3 = 2a, the support edge of g*g; the drop-2^k control equals the no-primes control, eigenvalue −7.10e-2): γ_1 5.0e-5, γ_2 4.8e-3,
 *  min eigenvalue 6.0e-8, identical for both builds. λ² = 5: γ_1 3.6e-12, γ_2 7.7e-10, γ_3 1.8e-8 (only 3 zeros at 1e-6; the "1e-12 or better
 *  for λ² ≥ 5" was overstated). Controls: no primes → indefinite (−0.07 to −0.77), no zero matched. BBM: ∫₀^1e4 |ψ_ρ1|² = 2.4998e5 vs
 *  X²/(2|ρ − 1|²) = 2.4995e5 (not L²); growth exponents 0.4999 / 0.2999 / 0.6998 / 2.9994.
 * HEURISTIC: for λ² ≥ 13 the near-kernel is several-dimensional (9 eigenvalues < 1e-10 at λ² = 13, K = 40; 24 at λ² = 100) and the minimisers
 *  from two equivalent builds are nearly orthogonal (overlap 0.005–0.04): matched-zero counts (18 vs 21 at 1e-6) are rounding-dependent and the
 *  reproduction is a restatement of Q(g) = Σ_γ ĝ(γ)², not evidence for an operator. "Any x/p-boundary quantisation counts θ/π + const" is a
 *  generalisation (moved here from 'proved'). Pattern across models: operator-only regularisations give the smooth term at best; fluctuations
 *  need primes or integers (consistent with flow-blindness; a pattern, not a theorem). Block variance of S rises 0.067 → 0.100 (increment 0.033
 *  vs Selberg's leading 0.025; absolute values ~0.02–0.03 below the leading term).
 *
 * Side finding (repo hygiene, not fixed here): src/math/sierra-xp-regularization.js misstates BBM ("(1 − e^{−iHt})|1⟩"; the operator is
 * Δ⁻¹(xp + px)Δ, Δ = 1 − e^{−ip}), dates Sierra–Townsend 2019 (PRL 101, 110201 is 2008, per recall) and calls SRL/BBM boundary terms
 * prime-dependent; "Rodriguez-Lagares" (recalled coauthor: Rodríguez-Laguna, PRL 106, 200201 (2011)) appears in sierra-xp-regularization.js,
 * berry-keating-xp-spectral.js, berry-keating-xp-operator.js and BerryKeatingXpPage.jsx. Citations recalled, not checked online.
 * Tagged [map]; no Λ bound moves. No refereed bound is changed; RH open; NO QED. Import-free. ROUTE_31_ASSERTIONS recompute live: the SRL area
 * asymptotics (2π/E vs 1/(48πE)), the 7/8 constant and 1/(48πE) term of θ/π + 1 (complex Stirling log-gamma), S(γ_n) and the Gamma-phase
 * displacement for the first 30 zeros, the SE distances of c and μ, the BBM eigenvalues / growth exponents / L² integral, the λ² = 3 edge effect.
 */

const { abs, sqrt, log, atan2, PI, acosh } = Math;

export const ROUTE_31 = Object.freeze({
  id: 'route-31-berry-keating-xp-regularised-2026-10-13',
  route: 31,
  date: '2026-10-13',
  title: 'Route 31: regularised xp models reproduce only the smooth part of N(T); the residual is exactly S(T)',
  status: 'done',
  headline: 'Four regularised xp models tested against the first 100,000 zeros (to γ = 74920.83). The cutoff models (Berry–Keating, the '
    + 'semiclassical Sierra–Rodriguez-Laguna count, the Gamma-phase / Sierra–Townsend class) reproduce only the smooth term of N(T); in every '
    + 'case the residual is S(T) (correlation ≥ 0.99999). Fluctuations return only with primes (explicit formula / prime-orbit sum / finite-Λ '
    + 'Weil form). BBM reproduces the zeros because ζ is its boundary condition.',
  fits: Object.freeze({ bkC: Object.freeze([0.875007, 5.3e-5]), bkCBlock5000SE: 1.9e-5, kappaMinus1: -2.5e-9, srlMu: Object.freeze([0.87457, 1.6e-4]) }),
  gammaPhase: Object.freeze({ rms: 0.3108, max: 1.1287, withinHalf: 0.889, corrMinusS: 0.9999999994, sStd: 0.3108, sMax: 1.1287, sMaxAt: 71128.97,
    spacingVarZeros: 0.1607, spacingVarGUE: 0.180, spacingVarModelThetaUnfolded: 1.5e-22, spacingVarModelLocal: 4.9e-7, spacingVarMisreported: 2.5e-6 }),
  numberVariance: Object.freeze([[5, 0.40], [10, 0.34], [20, 0.42], [50, 0.34]]),
  dirichletRoots: Object.freeze([[3, 92156], [5, 88976], [10, 86944], [30, 80828]]),
  rsDeficit: Object.freeze({ total: 824, refereeUpper: 412, within01: 0.9897 }),
  primeOrbit: Object.freeze({ X: Object.freeze([10, 1e2, 1e3, 1e4, 1e5]), corr: Object.freeze([0.896, 0.988, 0.9983, 0.9989, 0.9992]),
    residualRms: Object.freeze([0.130, 0.020]), sRms: 0.238, refereeX1e3Weighted: 0.99833, refereeX1e3Plain: 0.971 }),
  explicitFormula: Object.freeze({ withPrimes: 4.3e-9, withoutPrimes: 1.62 }),
  weilForm: Object.freeze({ primeVsZeroMatrixRel: Object.freeze([3e-12, 1.7e-10]), l3: Object.freeze({ g1: 5.0e-5, g2: 4.8e-3, minEig: 6.0e-8, controlEig: -7.10e-2 }),
    l5: Object.freeze([3.6e-12, 7.7e-10, 1.8e-8]), nearKernelDim: Object.freeze([[5, 2], [7, 4], [13, 9], [100, 24]]), overlap: Object.freeze([0.0047, 0.044]),
    matched13K40: Object.freeze([18, 21]) }),
  bbm: Object.freeze({ l2Measured: 2.4998e5, X: 1e4, growth: Object.freeze([0.4999, 0.2999, 0.6998, 2.9994]) }),

  refereeKilled: Object.freeze([
    '"any xp quantisation built only from x/p boundary phases has counting function θ/π + const" moved from proved to heuristic; the Tate phase is convention-dependent (extra 2^{iE} with e^{−ixp})',
    'BBM growth classes: "reality ⇔ RH" corrected to one direction (reality on a ≥ x^{1/2} growth-cap domain ⇒ RH); the converse needs exact eigenvalues {i(2ρ−1)} and Δ⁻¹ is ambiguous up to 1-periodic functions',
    'SRL "different O(1/E) coefficient" scoped to the SEMICLASSICAL area count; the quantum SRL spectrum (Bessel-K condition) was not computed',
    'Gamma-phase spacing variance 2.5e-6 misreported: ≈ 1e-22 θ-unfolded (4.9e-7 local density); qualitative "rigid spectrum" stands',
    '"γ_1 … γ_k to 1e-12 or better for λ² ≥ 5" overstated: λ² = 5 gives 3.6e-12 / 7.7e-10 / 1.8e-8, only 3 zeros at 1e-6',
    'λ² = 3 is effectively only p = 2 (n = 3 sits at the support edge u = ln 3 = 2a; drop-2^k control = no-primes control); same edge effect at every prime-power λ²',
    'near-kernel non-uniqueness: 9 (λ² = 13) to 24 (λ² = 100) eigenvalues < 1e-10, eigenvector overlap between equivalent builds 0.005–0.04; matched counts 18 vs 21 are not robust',
    'side finding incomplete: "Rodriguez-Lagares" also in berry-keating-xp-operator.js and BerryKeatingXpPage.jsx; Sierra–Townsend misdated 2019; SRL/BBM wrongly called prime-dependent',
    'attribution softness: "Connes cutoff" merges Connes 1999 with Connes–Consani(–Moscovici); two of the four BBM "critiques" are analytic observations, Bellissard comment cited from memory',
    'Σ²(L) non-monotone (0.40, 0.34, 0.42, 0.34) and pooled over heights; S block-variance growth 0.033 vs Selberg 0.025 — descriptive only',
  ]),
  nextStep: 'Rebuild the finite-Λ Weil form in mpmath (dps ≈ 40, K = 20–40) so the λ-dependence of the zeros reproduced by the minimiser can be '
    + 'measured below the double-precision floor; optionally compute the quantum SRL spectrum (Bessel-K condition) to test μ against 7/8; '
    + 'correct the BBM statement, the Sierra–Townsend date and the Rodríguez-Laguna citation in the four repo files after checking the references.',
  files: Object.freeze(['tmp/routes-b8-r31-counting.py', 'tmp/routes-b8-r31-connes-cutoff.py', 'tmp/routes-b8-r31-bbm.py', 'tmp/routes-b8-r31-rs-fine.py',
    'tmp/routes-b8-r31-out/', 'tmp/routes-b8-ref31-counting.py', 'tmp/routes-b8-ref31-connes.py', 'tmp/routes-b8-ref31-connes2.py', 'tmp/routes-b8-ref31-rs-prime.py',
    'tmp/routes-b8-ref31-out/']),
  verdict: 'Map result, not a step toward RH. Every operator-only regularised xp model tested reproduces N(T) only up to its smooth part '
    + '(T/2π)(ln(T/2π) − 1) + 7/8 + O(1/T): Berry–Keating cutoffs give 7/8 only by fiat, the semiclassical SRL area count has a different O(1/E) '
    + 'coefficient (+2π/E against 1/(48πE); the quantum SRL spectrum was not computed), and the Gamma-phase class matches θ/π + 1 exactly. All miss '
    + 'S(T) entirely (residual = S, correlation 1 to ~1e-9), GUE spacing statistics and the prime-driven number-variance saturation. Fluctuations '
    + 'return only with arithmetic input: prime-orbit sum (0.9992), explicit formula (4e-9), finite-Λ Weil form (primes ≤ λ²; controls fail '
    + 'without primes; for λ² ≥ 13 a rounding-dependent near-kernel). BBM matches the zeros because ζ(s) = 0 is its boundary condition; its '
    + 'eigenfunctions are not L², trivial zeros give non-real eigenvalues, and reality on growth-cap domains would imply RH (one direction). '
    + 'Internal, one referee pass. No Λ bound moves. No refereed bound is changed; RH open; NO QED.',
});

const R = ROUTE_31;
// First 31 zeta ordinates (Odlyzko; same values as src/data/zeros-to-1e6.js) — literal so the module stays import-free.
export const ROUTE_31_ZEROS = Object.freeze([14.134725142, 21.022039639, 25.01085758, 30.424876126, 32.935061588, 37.586178159, 40.918719012,
  43.327073281, 48.005150881, 49.773832478, 52.970321478, 56.446247697, 59.347044003, 60.831778525, 65.112544048, 67.079810529, 69.546401711,
  72.067157674, 75.704690699, 77.144840069, 79.337375020, 82.910380854, 84.735492981, 87.425274613, 88.809111208, 92.491899271, 94.651344041,
  95.870634228, 98.831194218, 101.317851006, 103.725538040]);

// Siegel theta via complex Stirling log-gamma (shift 8): θ(t) = Im logΓ(1/4 + it/2) − (t/2) ln π.
const cmul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const cinv = (a) => { const d = a[0] * a[0] + a[1] * a[1]; return [a[0] / d, -a[1] / d]; };
export const thetaSiegel = (t) => { const x0 = 0.25; const y = t / 2; let shift = 0; for (let k = 0; k < 8; k += 1) shift += atan2(y, x0 + k);
  const w = [x0 + 8, y]; const lw = [0.5 * log(w[0] * w[0] + w[1] * w[1]), atan2(w[1], w[0])]; const iw = cinv(w); const iw2 = cmul(iw, iw);
  let im = cmul([w[0] - 0.5, w[1]], lw)[1] - w[1]; let pw = iw; for (const c of [1 / 12, -1 / 360, 1 / 1260, -1 / 1680, 1 / 1188]) { im += c * pw[1]; pw = cmul(pw, iw2); }
  return im - shift - (t / 2) * log(PI); };
const smooth = (E) => (E / (2 * PI)) * (log(E / (2 * PI)) - 1);
const srlCount = (E, mu) => { const c = 4 * PI; return (E * acosh(E / c) - sqrt(E * E - c * c)) / (2 * PI) + mu; };
const newtonLevel = (target, E0) => { let E = E0; for (let i = 0; i < 40; i += 1) { const f = thetaSiegel(E) - target; const d = 0.5 * log(E / (2 * PI)); E -= f / d; if (abs(f) < 1e-13) break; } return E; };
const corr = (a, b) => { const n = a.length; const ma = a.reduce((s, x) => s + x, 0) / n; const mb = b.reduce((s, x) => s + x, 0) / n;
  let sab = 0; let saa = 0; let sbb = 0; for (let i = 0; i < n; i += 1) { sab += (a[i] - ma) * (b[i] - mb); saa += (a[i] - ma) ** 2; sbb += (b[i] - mb) ** 2; } return sab / sqrt(saa * sbb); };

export const ROUTE_31_ASSERTIONS = Object.freeze([
  {
    id: 'r31-srl-semiclassical-area',
    holds: () => [1e3, 1e4].every((E) => { const d = srlCount(E, 0) - smooth(E); return abs(E * d - 2 * PI) < 2e-3; })
      && abs(srlCount(4 * PI, 7 / 8) - 7 / 8) < 1e-12 && srlCount(4 * PI, 7 / 8) > 0.5 && abs(2 * PI * 48 * PI - 96 * PI * PI) < 1e-9,
    why: 'Exact SRL area A(E) = E·arccosh(E/4π) − sqrt(E² − 16π²) (l_x·l_p = 2π): A/2π − (E/2π)(ln(E/2π) − 1) = 2π/E + O(E⁻³), ≈ 96π² times Riemann\'s 1/(48πE); N_SRL(4π) = μ = 7/8 > 1/2, so level 1 does not exist.',
  },
  {
    id: 'r31-theta-smooth-term',
    holds: () => [[1e3, 3e-12], [1e4, 5e-12], [74920.83, 1e-10]].every(([E, tol]) => { const r = thetaSiegel(E) / PI + 1 - smooth(E) - 7 / 8; return abs(r - 1 / (48 * PI * E) - 7 / (5760 * PI * E ** 3)) < tol; })
      && abs(thetaSiegel(1e3) / PI + 1 - smooth(1e3) - 7 / 8 - 6.6315e-6) < 1e-9,
    why: 'θ(E)/π + 1 = (E/2π)(ln(E/2π) − 1) + 7/8 + 1/(48πE) + O(E⁻³) (complex Stirling log-gamma, live); residual 6.6315e-6 at E = 1000 — the Gamma-phase class reproduces exactly this smooth count and no more.',
  },
  {
    id: 'r31-gamma-phase-residual-is-S',
    holds: () => { const z = ROUTE_31_ZEROS.slice(0, 30); const S = z.map((g, i) => i + 1 - 0.5 - (thetaSiegel(g) / PI + 1));
      const disp = z.map((g, i) => (g - newtonLevel(PI * (i + 1 - 1.5), g)) * 0.5 * log(g / (2 * PI)) / PI);
      return S.every((s) => abs(s) < 0.75) && corr(disp, S.map((s) => -s)) > 0.97 && Math.max(...disp.map(abs)) < 0.75; },
    why: 'First 30 zeros: S(γ_n) = n − 1/2 − (θ(γ_n)/π + 1) stays below 0.75, and the Gamma-phase levels θ(E_n) = π(n − 3/2) are displaced from γ_n (in mean spacings) by ≈ −S (correlation > 0.97 here; 0.9999999994 over 1e5 zeros).',
  },
  {
    id: 'r31-fit-constants',
    holds: () => { const [c, se] = R.fits.bkC; const [mu, sm] = R.fits.srlMu;
      return abs(c - 7 / 8) / se < 1 && (c - 0.75) / se > 2000 && (1 - c) / se > 2000 && abs((7 / 8 - mu) / sm - 2.7) < 0.1
        && R.gammaPhase.spacingVarModelThetaUnfolded < 1e-20 && R.gammaPhase.spacingVarModelLocal < R.gammaPhase.spacingVarMisreported
        && abs(R.gammaPhase.rms - R.gammaPhase.sStd) < 1e-12 && abs(R.gammaPhase.max - R.gammaPhase.sMax) < 1e-12; },
    why: 'c = 0.875007 ± 5.3e-5 is 7/8 (Maslov 3/4 and 1 are > 2000 SE away); μ_SRL sits 2.7 SE below 7/8 (the +2π/E term); Gamma-model spacing variance ≈ 1e-22, not the reported 2.5e-6; displacement RMS/max equal S std/max.',
  },
  {
    id: 'r31-bbm-formal',
    holds: () => { const rho = [0.5, ROUTE_31_ZEROS[0]]; const pred = R.bbm.X ** 2 / (2 * ((rho[0] - 1) ** 2 + rho[1] ** 2));
      return [-2, -4, -6].map((s) => 2 * s - 1).join(',') === '-5,-9,-13' && abs(pred - 2.4995e5) < 5 && abs(R.bbm.l2Measured / pred - 1) < 2e-4
        && [0.5, 0.7, 0.3, -2].every((sg, i) => abs(1 - sg - R.bbm.growth[i]) < 1e-3) && 1 - 0.7 < 0.5; },
    why: 'E = i(2s − 1): s = −2, −4, −6 give −5i, −9i, −13i; ψ_ρ ~ x^{1−σ} (0.5, 0.3, 0.7, 3 measured as 0.4999, 0.2999, 0.6998, 2.9994); ∫₀^X|ψ_ρ1|² ≈ X²/(2|ρ − 1|²) = 2.4995e5 at X = 1e4 (not L²); an off-line σ = 0.7 zero grows slower than x^{1/2}.',
  },
  {
    id: 'r31-arithmetic-input-controls',
    holds: () => { const p = R.primeOrbit; const w = R.weilForm; const a = log(3) / 2;
      return p.corr.every((c, i) => i === 0 || c > p.corr[i - 1]) && p.residualRms[1] < p.residualRms[0] && abs(p.refereeX1e3Weighted - p.corr[2]) < 1e-4
        && R.explicitFormula.withoutPrimes / R.explicitFormula.withPrimes > 1e8 && abs(log(3) - 2 * a) < 1e-15 && w.l3.controlEig < 0
        && w.l5.every((x, i) => i === 0 || x > w.l5[i - 1]) && w.l5.filter((x) => x < 1e-6).length === 3
        && w.nearKernelDim.every(([, d], i) => i === 0 || d > w.nearKernelDim[i - 1][1]) && Math.max(...w.overlap) < 0.05
        && R.rsDeficit.total === 2 * R.rsDeficit.refereeUpper && R.dirichletRoots.every(([, r], i) => r < 1e5 && (i === 0 || r < R.dirichletRoots[i - 1][1])); },
    why: 'Prime-orbit correlation rises 0.896 → 0.9992 with X; explicit formula 4.3e-9 with primes vs 1.62 without; at λ² = 3 the n = 3 term sits on the support edge ln 3 = 2a (only p = 2 enters); λ² = 5 errors 3.6e-12/7.7e-10/1.8e-8; near-kernel dimension grows 2 → 24, build overlap < 0.05 (rounding-dependent); RS deficit 824 = 2 × 412; fixed-N Dirichlet polynomials lose roots.',
  },
  {
    id: 'r31-honest-scope',
    holds: () => R.status === 'done' && /semiclassical SRL/.test(R.verdict) && /one direction/.test(R.verdict) && /refereed bound is changed/i.test(R.verdict)
      && /NO QED/.test(R.verdict) && /not a step toward RH/.test(R.verdict) && R.refereeKilled.length === 10,
    why: 'Map result; SRL claim scoped to the semiclassical count; BBM reality ⇒ RH one direction only; no Λ change; no QED.',
  },
]);

export default ROUTE_31;
