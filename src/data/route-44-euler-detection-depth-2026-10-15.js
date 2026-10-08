/**
 * @fileoverview route-44-euler-detection-depth-2026-10-15 — roadmap route 44 (batch 10, group I): Euler-detection depth against support
 * across conductors. For every pair of complex-conjugate primitive characters mod q (q = 5..49) the two real-coefficient same-gamma-factor
 * Davenport–Heilbronn-type twins F_θ = Σ Re(e^{iθ}χ(n)) n^{-s} (root number +1 and −1) are compared with their Euler arm L(s, χ) under the
 * Weil form. One worker run plus one adversarial internal referee pass (independent code: characters from the regular representation,
 * mpmath functional-equation check of all 440 twins, frequency-domain Weil matrix on 12 cases, bit-identical certificate reruns; not
 * refuted; severity minor). Referee corrections applied below (precision wording, sector split promoted to proved, censoring disclosure,
 * overshoot calibration, information-floor wording, DH λ_min value, zero-scan provenance, a script-name hazard).
 *
 * PROVED (elementary, written, internal):
 *  - Twin construction: with Λ(1−s, χ) = ε(χ)Λ(s, χ̄), real coefficients force the combination Re(e^{iθ}χ(n)) with e^{2iθ} = ω·conj(ε(χ)),
 *    unique up to real scale; two twins per conjugate pair (T+ ω = +1, T− ω = −1). q = 5 T+ is Davenport–Heilbronn (a(2)/a(1) = κ).
 *  - Sector split (REFEREE, promoted from 'conditional'): for real g = g_e + g_o the even/odd cross-correlations cancel in
 *    G(x) = ∫ g(y)g(y + x) dy, so W(g) = W(g_e) + W(g_o) for every linear functional of G. The two-sector computation is the complete
 *    real-g Weil form; no zero-symmetry argument is needed.
 *  - For 2a ≤ ln 2 the prime sum is empty, so a twin and its Euler arm have the same Weil form on [−a, a] (cannot be separated there).
 *    That ln2/2 = 0.3466 is a LOWER bound on the onset additionally needs the archimedean form to be positive on that support, which is
 *    MEASURED (scan), not proved.
 *  - A real zero β ∈ (1/2, 1) contributes −(∫ g sinh((β−1/2)x))² in the odd sector and +(∫ g cosh)² in the even sector.
 * CERTIFIED (Arb balls, rational test functions in a Gegenbauer basis, exact rational autocorrelation): W_F(g0) < 0 for 387 of 440 twins
 *  (352 at 6000 bits, 35 at 3000 bits; ball radii from below 1e-400 up to 6.5e-5 relative to ||g||², all upper bounds < 0), each giving
 *  a* ≤ A with A ∈ [0.36, 3.40]; five exact Rayleigh–Ritz subspace certificates at 8000 bits sharpen the bound below the double onset
 *  (DH ≤ 1.74, tlb-dh-blind full basis 1.72; q13.1.T+ ≤ 2.48; q19.7.T+ ≤ 2.64; q29.0.T+ ≤ 2.64; q47.4.T+ ≤ 2.83). Every twin whose double
 *  scan went negative is certified (387/387).
 * CONDITIONAL: reading onsets on the zero side assumes the classical Weil explicit formula for F_θ (validated for q = 5 by tlb-dh-blind to
 *  1.2e-13, not re-validated for other q). The certified upper bounds do not depend on it.
 * MEASURED: double-precision scan (440 twins + 220 arms, a = 0.20..3.00 step 0.02, 53 censored twins + 3 arms to 3.6); Euler arms never
 *  negative (min −4.4e-13, the floor); 306 onsets bracketed to 0.02, 81 sub-floor (double onset overshoots the certified one by 0.00–0.10
 *  on 6 subspace-calibrated T+ twins and by a median 0.16, IQR 0.07–0.24, against the fitted zero model); 53 twins (12%) blind to a = 3.6
 *  with no off-line zero σ > 0.505 below t = 120 found (winding grid H = 0.1, can miss σ ∈ (1/2, 0.505) or two zeros per cell); median
 *  onset 0.76 + 0.25 log q (0.37 unweighted); phase-matched slopes 0.21–0.31 per log q for |tan θ| ∈ [0.4, 4) on finite onsets only
 *  (censoring-biased; [0.15, 0.4) undetermined, 0.33 → 0.58 with censored twins set to 3.6; [0, 0.15) mostly censored); at a = (ln 3)/2
 *  403/440 twins positive, DH λ_min = 0.2103 (N = 48; referee 0.21029; tlb 0.2098; 0.2112 was a grid interpolation); first-failure sector
 *  odd 171 / even 150 / both 66 / none 53.
 * HEURISTIC: zero-side law a* ≈ −0.748 + 0.387 log γ − 0.278 log(β − 1/2) + 0.278 log q (rms 0.139, R² 0.883, n = 240; predicts DH 1.746);
 *  cube-root resolution model (median ratio 0.99, IQR 0.81–1.15); 'censored twins have a* > 3.6' rests on observed onset sharpness only.
 *  The five deepest certified twins (q39.3.T−, q29.12.T−, q41.16.T−, q17.2.T+, q43.5.T+; bounds 3.12–3.40) are deepest by UPPER bound
 *  only; their true onsets sit in brackets ≈ 1 wide starting at 1.88–2.32.
 *
 * Verdict: done as posed. The Weil form misses the absent Euler product of a same-gamma-factor Dirichlet twin up to a support that depends
 * mostly on the root-number phase (through the height and real part of the first off-line zero) and only weakly on conductor (≈ 0.2–0.37 per
 * log q, censoring-biased), against slope 1 for route 15's Epstein principal forms. No Λ bound moves. PT Lambda <= 0.2 stands; RH open;
 * NO QED. Import-free. ROUTE_44_ASSERTIONS recompute live: the conjugate-pair count (220 over 31 conductors) from Möbius/φ, κ for DH, the
 * tallies, the zero-side law at DH, the cube-root model at DH, the information floor and the real-zero sign rule.
 */

const { abs, log, sqrt, PI, sinh, cosh, cbrt } = Math;

export const ROUTE_44 = Object.freeze({
  id: 'route-44-euler-detection-depth-2026-10-15',
  route: 44,
  date: '2026-10-15',
  title: 'Route 44: Euler-detection depth across conductors 5–49 — 387 of 440 Dirichlet DH-type twins certified Weil-negative at a ∈ [0.36, 3.40]; onset set by root-number phase, weak conductor slope',
  status: 'done',
  headline: 'Across 440 same-gamma-factor DH-type twins of Dirichlet L-functions (conductors 5–49), the Weil form is Arb-certified negative for '
    + '387 at explicit supports a ∈ [0.36, 3.40] (upper bounds on the blindness radius a*). The onset is set mainly by the twin\'s root-number '
    + 'phase and its first off-line zero; at fixed phase it grows ≈ 0.2–0.37 per log q (censoring-biased), against slope 1 for route 15\'s '
    + 'Epstein trend. Euler arms stay positive; 53 twins (12%) stay blind to a = 3.6 (measured).',
  population: Object.freeze({ qMin: 5, qMax: 49, conductors: 31, pairs: 220, twins: 440, arms: 220 }),
  certified: Object.freeze({ twins: 387, at6000: 352, at3000: 35, subspace: 5, subspaceBits: 8000, Arange: Object.freeze([0.36, 3.40]), maxRelRadius: 6.5e-5 }),
  subspace: Object.freeze([
    Object.freeze({ twin: 'q5.0.T+ (DH)', cert: 1.74, double: 1.80, ref: 1.72 }),
    Object.freeze({ twin: 'q13.1.T+', cert: 2.48, double: 2.54 }),
    Object.freeze({ twin: 'q19.7.T+', cert: 2.64, double: 2.72 }),
    Object.freeze({ twin: 'q29.0.T+', cert: 2.64, double: 2.74 }),
    Object.freeze({ twin: 'q47.4.T+', cert: 2.83, double: 2.86 }),
  ]),
  deepest: Object.freeze([
    Object.freeze({ twin: 'q39.3.T-', ub: 3.40, bracket: Object.freeze([2.30, 3.40]) }),
    Object.freeze({ twin: 'q29.12.T-', ub: 3.36, bracket: Object.freeze([2.16, 3.36]) }),
    Object.freeze({ twin: 'q41.16.T-', ub: 3.24, bracket: Object.freeze([2.32, 3.24]) }),
    Object.freeze({ twin: 'q17.2.T+', ub: 3.20, bracket: Object.freeze([1.88, 3.20]) }),
    Object.freeze({ twin: 'q43.5.T+', ub: 3.12, bracket: Object.freeze([2.24, 3.12]) }),
  ]),
  scan: Object.freeze({ resolved: 306, subFloor: 81, censored: 53, armMin: -4.4e-13, censoredFrac: Object.freeze({ small: [1, 28], large: [28, 196] }) }),
  sectors: Object.freeze({ odd: 171, even: 150, both: 66, none: 53 }),
  routeI: Object.freeze({ a: log(3) / 2, positive: 403, negative: 37, dhLambdaMin: 0.2103, dhRef: 0.21029, dhTlb: 0.2098 }),
  realZeroTwins: Object.freeze({ count: 23, oddFirst: 14, evenFirst: 1 }),
  dhZeros: Object.freeze([[0.8085171825, 85.6993484854], [0.6508, 114.163]]),
  zeroLaw: Object.freeze({ c0: -0.748, cGamma: 0.387, cBeta: -0.278, cQ: 0.278, rms: 0.139, r2: 0.883, n: 240, dhPred: 1.746 }),
  cubeRoot: Object.freeze({ medianRatio: 0.99, iqr: Object.freeze([0.81, 1.15]) }),
  slopes: Object.freeze({ median: Object.freeze([0.25, 0.37]), phaseMatched: Object.freeze([0.21, 0.31]), band015_04: Object.freeze([0.33, 0.58]), epstein: 1 }),
  overshoot: Object.freeze({ calibrated: Object.freeze([0.00, 0.10]), calibratedN: 6, modelMedian: 0.16, modelIqr: Object.freeze([0.07, 0.24]) }),
  refereeKilled: Object.freeze([
    'precision overstated: 35 of the 387 best certificates ran at 3000 bits with relative radii up to 6.5e-5 (all still negative); the 5 subspace certificates ran at 8000 bits, so "none needed more than 6000 bits" was wrong',
    'sector split is elementary (even/odd cross-correlations cancel in G), so it is proved, not conditional on an unrefereed zero-symmetry argument (underclaim)',
    'conductor slopes are censoring-biased and fit-dependent: band [0.15, 0.4) goes 0.33 → 0.58 with censored twins at 3.6, band [0, 0.15) was omitted, the median slope is 0.25 (√n weights) or 0.37 (unweighted)',
    'double-overshoot 0.00–0.10 rests on 6 T+ twins; model-relative median overshoot is 0.16 (IQR 0.07–0.24); the five "deepest" twins are deepest by upper bound only (brackets ≈ 1 wide, 4 of 5 with no off-line zero found below 120)',
    'information floor: only indistinguishability for 2a ≤ ln 2 is proved; a* ≥ ln2/2 needs archimedean positivity there, which is measured',
    'DH λ_min at (ln 3)/2 is 0.2103 (N = 48, referee 0.21029), not the grid-interpolated 0.2112',
    'zero scan stops after the first 10-unit block with a zero; q11.0.T+ 0.6324 + 177.40i appears only in a log; "no off-line zero below 120" is a measured winding scan from σ = 0.505, not certified',
    'reproducibility: queue.py in the script directory shadows the stdlib queue module; scripts insert a non-existent path tmp/routes-b10-r44',
  ]),
  nextStep: '(1) Adversarial referee of the twin construction (done once here) and an Arb validation of the explicit formula for q ≠ 5. '
    + '(2) Push the 53 censored twins: zero scan to t ≈ 300 starting at σ = 0.5 + 1e-3, full-basis exact Rayleigh–Ritz at a ∈ [3.6, 4.5] (w_max ≈ 140). '
    + '(3) Two-sided brackets for the five deepest twins (Route-I-style dual certificates for lower bounds). (4) Real combinations of several pairs with '
    + 'the same (q, δ, ω): find the most-blind member of each family. (5) Rename queue.py before any reuse of the scripts.',
  files: Object.freeze(['tmp/routes-b10-r44-euler-depth/{chars,weil44,scan,certify44,exact44,zeros44,queue,analyze,model2,summary,final}.py',
    'tmp/routes-b10-r44-euler-depth/{route44-records,onsets,summary,model2}.json', 'tmp/routes-b10-r44-euler-depth/{certs,exact,zeros,scan-lambda,scan-ext}.jsonl',
    'tmp/routes-b10-ref44-*', 'tmp/routes-b10-ref44-rerun/']),
  verdict: 'Done as posed; map result. Weil positivity fails to see the missing Euler product of a same-gamma-factor Dirichlet twin up to a '
    + 'per-twin certified support (387 Arb upper bounds in [0.36, 3.40]); that support follows the root-number phase and, through it, the first '
    + 'off-line zero (fitted law, rms 0.14), with a weak, censoring-biased conductor slope (≈ 0.2–0.37 per log q) against route 15\'s slope 1, so '
    + 'the Dirichlet and Epstein twin families blind the Weil form by different mechanisms. Euler arms stay positive. Lower ends are measured in a '
    + 'finite basis. No Λ bound moves: the conditional value stays 0.116091488672439. PT Lambda <= 0.2 stands; RH open; NO QED.',
});

const R44 = ROUTE_44;
const mu = (n) => { let r = 1; for (let p = 2; p * p <= n; p += 1) { if (n % p === 0) { n /= p; if (n % p === 0) return 0; r = -r; } } return n > 1 ? -r : r; };
const phi = (n) => { let r = n; let m = n; for (let p = 2; p * p <= m; p += 1) { if (m % p === 0) { while (m % p === 0) m /= p; r -= r / p; } } if (m > 1) r -= r / m; return r; };
const primCount = (q) => { let s = 0; for (let d = 1; d <= q; d += 1) if (q % d === 0) s += mu(q / d) * phi(d); return s; };
const realPrim = (q) => { if (q % 2 === 1) return mu(q) !== 0 ? 1 : 0; if (q % 8 === 4 && mu(q / 4) !== 0) return 1; if (q % 16 === 8 && mu(q / 8) !== 0) return 2; return 0; };
const kappaDH = (sqrt(10 - 2 * sqrt(5)) - 2) / (sqrt(5) - 1);

export const ROUTE_44_ASSERTIONS = Object.freeze([
  {
    id: 'r44-pair-count-live',
    holds: () => { let pairs = 0; let cond = 0; let first = 0;
      for (let q = 3; q <= 49; q += 1) { const nr = primCount(q) - realPrim(q); if (nr % 2) return false; if (nr > 0) { cond += 1; pairs += nr / 2; if (!first) first = q; } }
      return pairs === R44.population.pairs && cond === R44.population.conductors && first === R44.population.qMin && 2 * pairs === R44.population.twins; },
    why: 'Primitive characters mod q (Möbius/φ) minus real primitive ones (fundamental discriminants of modulus q) give 220 conjugate pairs over 31 conductors, the first at q = 5; two twins per pair = 440.',
  },
  {
    id: 'r44-dh-kappa',
    holds: () => abs(kappaDH - 0.284079043840412) < 1e-12 && R44.dhZeros[0][0] > 0.5 && R44.dhZeros[0][1] > 85,
    why: 'q = 5 T+ is Davenport–Heilbronn: a(2)/a(1) = κ = (√(10 − 2√5) − 2)/(√5 − 1) = 0.284079…; its first off-line zero 0.8085171825 + 85.6993484854i is recovered.',
  },
  {
    id: 'r44-tallies',
    holds: () => { const c = R44.certified; const s = R44.sectors; const sc = R44.scan;
      return c.at6000 + c.at3000 === c.twins && c.twins + sc.censored === R44.population.twins && sc.resolved + sc.subFloor === c.twins
        && s.odd + s.even + s.both + s.none === R44.population.twins && s.none === sc.censored
        && R44.routeI.positive + R44.routeI.negative === R44.population.twins && sc.armMin < 0 && sc.armMin > -1e-12
        && sc.censoredFrac.small[0] / sc.censoredFrac.small[1] < 0.04 && abs(sc.censoredFrac.large[0] / sc.censoredFrac.large[1] - 0.143) < 1e-3
        && R44.realZeroTwins.oddFirst + R44.realZeroTwins.evenFirst <= R44.realZeroTwins.count; },
    why: '387 = 352 + 35 certified, 387 + 53 censored = 440, 306 resolved + 81 sub-floor = 387; sectors 171 + 150 + 66 + 53 = 440; Route I support 403 + 37 = 440; arm minimum at the double floor; censoring 3.6% (q ≤ 13) → 14.3% (q 38–49).',
  },
  {
    id: 'r44-certified-bounds',
    holds: () => { const [lo, hi] = R44.certified.Arange; const ln2h = log(2) / 2;
      return lo > ln2h && hi === 3.40 && R44.subspace.every((x) => x.cert < x.double) && abs(R44.subspace[0].cert - R44.subspace[0].ref) <= 0.02 + 1e-12
        && R44.deepest.every((x) => x.bracket[1] === x.ub && x.bracket[1] - x.bracket[0] > 0.85 && x.ub <= hi) && R44.certified.maxRelRadius < 1e-4; },
    why: 'Certified upper bounds lie in [0.36, 3.40], above the information floor ln2/2; each subspace certificate sits below its double onset; DH 1.74 is within 0.02 of tlb-dh-blind\'s 1.72; the deepest five have brackets ≈ 1 wide.',
  },
  {
    id: 'r44-zero-law-at-dh',
    holds: () => { const z = R44.zeroLaw; const [b, g] = R44.dhZeros[0]; const q = 5;
      const pred = z.c0 + z.cGamma * log(g) + z.cBeta * log(b - 0.5) + z.cQ * log(q);
      const cube = cbrt(log((q * g) / (2 * PI)) / (2 * PI * (b - 0.5) ** 2));
      return abs(pred - z.dhPred) < 0.01 && pred > R44.subspace[0].ref && cube / 1.72 > R44.cubeRoot.iqr[0] && cube / 1.72 < R44.cubeRoot.iqr[1]; },
    why: 'Heuristic zero-side law at DH (β = 0.80852, γ = 85.699, q = 5) gives ≈ 1.749 (reported 1.746 with unrounded coefficients) against the certified ≤ 1.72; the cube-root model gives 1.92, ratio 1.11, inside its IQR 0.81–1.15.',
  },
  {
    id: 'r44-real-zero-sign',
    holds: () => { const c = 0.2; const a = 1; const n = 400; let ie = 0; let io = 0;
      for (let i = 0; i < n; i += 1) { const x = -a + (2 * a * (i + 0.5)) / n; const ge = 1 - (x * x) / (a * a); const go = x * ge; ie += ge * cosh(c * x); io += go * sinh(c * x); }
      const h = (2 * a) / n; const even = (ie * h) ** 2; const odd = -((io * h) ** 2); return even > 0 && odd < 0; },
    why: 'A real zero β = 1/2 + c contributes (∫g e^{cx})(∫g e^{−cx}): +(∫g cosh)² ≥ 0 for even g, −(∫g sinh)² ≤ 0 for odd g (checked on a sample pair).',
  },
  {
    id: 'r44-slopes-below-epstein',
    holds: () => { const s = R44.slopes; return s.median[1] < s.epstein && s.phaseMatched[1] < s.epstein && s.band015_04[1] < s.epstein
      && s.band015_04[1] > s.band015_04[0] && R44.overshoot.modelMedian > R44.overshoot.calibrated[1]; },
    why: 'Every measured conductor slope (median 0.25–0.37, phase-matched 0.21–0.31, the undetermined band 0.33–0.58) is below Epstein\'s 1; the model-relative overshoot (0.16) exceeds the 6-twin calibration (≤ 0.10): numbers soft, contrast survives.',
  },
  {
    id: 'r44-honesty',
    holds: () => /PT Lambda <= 0\.2 stands/.test(R44.verdict) && /NO QED/.test(R44.verdict) && /0\.116091488672439/.test(R44.verdict)
      && R44.refereeKilled.length === 8 && R44.status === 'done',
    why: 'Verdict keeps PT Λ ≤ 0.2 as the benchmark, the conditional value unchanged, and claims no QED; eight referee corrections recorded.',
  },
]);

export default ROUTE_44;
