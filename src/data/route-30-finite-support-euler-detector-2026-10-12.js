/**
 * @fileoverview route-30-finite-support-euler-detector-2026-10-12 — roadmap route 30 (batch 7, group E): a ladder-native quantity that
 * separates ζ-type Euler products from Davenport–Heilbronn at test support below the Weil-form onset 3.44. Succeeds as posed, as a
 * coefficient-multiplicativity test with no zero-location content. One run plus one adversarial internal referee pass with exact symbolic
 * and independent zero-side checks (not refuted; severity minor: scope wording). The referee corrections are applied below.
 *
 * PROVED (elementary; zero-side reading conditional on the classical explicit formula): (a) a(n mod 5) = (0, 1, κ, −κ, −1) is odd, so
 *  a(nm) = a(n)a(m) for m ≡ ±1 mod 5 and F_DH = [Euler product over p ≡ ±1 mod 5, local parameter χ(p) = ±1] × G(s), G supported on integers
 *  built from primes ≡ ±2 mod 5; hence c(n) = 0 for every non-prime-power n with a prime factor ≡ ±1 mod 5. (b) Rung moments m_k(p) = c(p^k)/log p
 *  are the coefficients of xF_p'/F_p, F_p(x) = 1/(1−x) (p ≡ 1), 1/(1+x) (p ≡ 4), (1+κx)/(1+x²) (p = 2), (1−κx)/(1+x²) (p = 3), 1 (p = 5); at p = 2,
 *  m_k = −(−κ)^k + 2[k even](−1)^{k/2}. At p ≡ ±2 the rung is a SIGNED virtual measure δ_i + δ_{−i} − P_{∓κ}(θ)dθ/2π. (c) Information floor: for
 *  2a ≤ ln 2 the prime side is empty, so no quantity separates anything. (d) Rung Toeplitz (Herglotz) test, LOCAL DEGREE 1 with unitary parameter
 *  (referee: for unitary local degree d the normalisation is m_0 = d, and the witness 2d + 2Re m_2 detects DH only for d ≤ 2): T_p^(K) =
 *  [m_{|i−j|}] ⪰ 0; DH fails: 2 + 2m_2(2) = −2(1 + κ²), λ_min(T_2^(2)) = (−κ² − √((2+κ²)² + 8κ²))/2 = −1.15558, and λ_min(T_2^(K)) ≥ −(1+κ)/(1−κ)
 *  for all K. (e) Sharp onsets RELATIVE TO FORMAL local Euler products (independent local parameters), DH bridge, degree 1, conductor 5:
 *  unitary rungs, full data: ln 2 (|c(2)| = ln 2 forced; DH κ ln 2); unitary rungs, even data or any affine test: ln 4 (realisation α_2 = κ + i√(1−κ²),
 *  α_3 = −κ + i√(1−κ²) below; convex hull disk × disk); degree 1 without Ramanujan: ln 4 (full, Hankel defect) / ln 6 (even; α_2 = κ + i√(2+2κ²),
 *  |α_2| = √(2+3κ²) = 1.497365); Euler product only: ln 6 (c(6) = 0 forced; DH (1+κ²) ln 6). Against GENUINE degree-1 L-functions with the DH
 *  bridge, Kaczorowski–Perelli (conditional, global input) already separates DH from even data just above ln 2.
 * CERTIFIED (Arb, python-flint 320 bits): κ = 0.28407904384041229603 ± 1.3e-31; closed-form m_k(p) = recursion to 1e-80 (p ≤ 31, p^k ≤ 1024);
 *  c(6) = 1.93635607662103878; U_2 = κ² − 1 = −0.91929909685; 2 + 2m_2(2) = −2.16140180630; λ_min(T^(2)) = −1.15557727532; Szegő limit −1.79360449333;
 *  Rayleigh certificates that T_p^(K) is not PSD (p = 2, K = 2..10; p = 3, K = 2..6; p = 7, 13, K = 2). Relevant below 2a = 3.44 (needs
 *  2a > K ln p): only p = 2, K = 2, 3, 4 and p = 3, K = 2, 3; the rest sit above the Weil onset. Non-prime-powers ≤ 3000 coprime to 5: 1031 with
 *  |c| < 1e-80 (Arb) and identically zero as polynomials in κ (referee exact symbolic check), 906 certified nonzero, 0 exceptions; the 247 multiples
 *  of 5 with a ±1 prime factor are also identically zero.
 * CONDITIONAL: zero-side reading via the classical Weil explicit formula (validated in tlb-dh-blind to ≤ 1.2e-13); Kaczorowski–Perelli 1999 (cited).
 * MEASURED: rung data read off DH's zeros (71 on-line + 2 off-line pairs below 130): c(2) = 0.1969085882974 at support 1.093 (error 3.2e-12; referee
 *  cos^{2M} family 4.0e-13), c(4) = −1.4422324 at support 1.606 (error 4.5e-7; referee 1.24e-7); heuristic tail estimates 2.3e-10 / 4.1e-5 (crude
 *  zero-density majorant, not rigorous); BOTH off-line pairs together contribute 7e-7 / 1.7e-4, so the detectors read the missing Euler product
 *  from the on-line zeros.
 * HEURISTIC: Weil positivity is passed by every RH-true function with the same bridge, so it flags DH only once the off-line zero is resolvable
 *  (2a ≈ 3.4–3.44); rung tests are passed by every Euler product and flag DH at the information floor — at small support, Euler detection and
 *  off-line-zero detection decouple. Rung detectors carry no RH content. At conductor 1 there is no DH-type twin with ζ's bridge (Hamburger).
 *
 * Prior art: tlb-dh-blind-2026-09-28 (coefficients.reading) already records c_DH(n) ≠ 0 on non-prime-powers (n = 6, 12, 14, …); new here are the
 * per-class sharp onsets, the Toeplitz/Hankel witnesses and the E_{±1} × G factorisation. Tagged [RH] in fifty-routes; the tag is not advanced.
 * No Λ bound moves. No refereed bound is changed; RH open; NO QED. Import-free. ROUTE_30_ASSERTIONS recompute live: κ, the c(n) recursion to 3000 with the
 * 1031 / 906 / 0 / 247 vanishing pattern, c(2), c(4), c(6), U_2, the Hankel witness, λ_min(T_2^(K)) by Jacobi for K = 1, 2, 3, 10, 40 against the
 * Szegő bound, |α_2|, and the support thresholds K ln p vs 3.44.
 */

const { abs, sqrt, log } = Math;

export const ROUTE_30 = Object.freeze({
  id: 'route-30-finite-support-euler-detector-2026-10-12',
  route: 30,
  date: '2026-10-12',
  title: 'Route 30: finite-support Euler detector — rung Toeplitz tests separate DH at ln 2 / ln 4 / ln 6, sharp relative to formal local Euler products',
  status: 'done',
  headline: 'Tests built from prime-power coefficients (the rungs) detect the missing Euler product of Davenport–Heilbronn at test support 2a just '
    + 'above ln 2 / ln 4 / ln 6, depending on the test class; the Weil-form onset is 3.44. Each threshold is sharp relative to FORMAL local Euler '
    + 'products of that class (local degree 1 for the unitary classes): below it no test in that class separates DH from such a formal product. With '
    + 'global input (Kaczorowski–Perelli, conditional), even data already separate DH just above ln 2.',

  kappa: 0.28407904384041229603,
  arb: Object.freeze({ c6: 1.9363560766210387863, U2: -0.91929909685071710873, hankel: -2.1614018062985657825, lamMinT2: -1.1555772753150526313,
    szego: -1.7936044933348411065, alpha2NonRamanujan: 1.497365255857050 }),
  lamMinT2K: Object.freeze([[1, 0.7159], [2, -1.15558], [3, -1.52188], [10, -1.73289764993927], [40, -1.78826]]),
  onsets: Object.freeze({ floor: Object.freeze(['ln 2', 2]), unitaryFull: Object.freeze(['ln 2', 2]), unitaryEvenOrAffine: Object.freeze(['ln 4', 4]),
    deg1NoRamanujanFull: Object.freeze(['ln 4', 4]), deg1NoRamanujanEven: Object.freeze(['ln 6', 6]), eulerOnly: Object.freeze(['ln 6', 6]), weilForm: 3.44, weilFormHalf: 1.72 }),
  toeplitzCerts: Object.freeze({ p2: Object.freeze([2, 10]), p3: Object.freeze([2, 6]), p7: Object.freeze([2, 2]), p13: Object.freeze([2, 2]),
    belowWeil: Object.freeze([[2, 2], [2, 3], [2, 4], [3, 2], [3, 3]]) }),
  nonPrimePower: Object.freeze({ N: 3000, zero: 1031, nonzero: 906, exceptions: 0, multiplesOf5Zero: 247 }),
  zeroSide: Object.freeze({ zeros: '71 on-line + 2 off-line pairs below t = 130',
    c2: Object.freeze({ value: 0.1969085882974, support: 1.093, error: 3.2e-12, refereeError: 4.0e-13, tailHeuristic: 2.3e-10 }),
    c4: Object.freeze({ value: -1.4422324, support: 1.606, error: 4.5e-7, refereeError: 1.24e-7, tailHeuristic: 4.1e-5 }),
    offLinePairsContribution: Object.freeze([7e-7, 1.7e-4]) }),

  refereeKilled: Object.freeze([
    'headline overclaim: sharpness holds only against FORMAL local Euler products (independent local parameters); against genuine degree-1 L-functions with the DH bridge, Kaczorowski–Perelli (conditional) gives detection from even data just above ln 2 — "formal" added to headline and verdict',
    'local degree missing: the Toeplitz test with m_0 = 1 is valid only for local degree 1; for unitary degree d the normalisation is m_0 = d (ζ² with m_0 = 1 gives [[1,2],[2,1]], not PSD) and the witness 2d + 2Re m_2 = 2d − 2(2+κ²) detects DH only for d ≤ 2; JSON key renamed even_data_unitary_degree1_toeplitz',
    'typo: non-Ramanujan |α_2| = √(2+3κ²) = 1.497365, not 1.4970',
    '"Arb confirms 1031 exactly zero" overstated: the script tests |c| < 1e-80; exactness is from the proof and the referee\'s exact symbolic check (also 247/247 multiples of 5)',
    'zero-side "tail bound" 2.3e-10 / 4.1e-5 uses a crude zero-density majorant — heuristic estimate, not a bound',
    'off-line contribution 7e-7 / 1.7e-4 is BOTH off-line pairs together, not the single zero 0.8085 + 85.699i',
    'prior art not cited: tlb-dh-blind-2026-09-28 already records c_DH(n) ≠ 0 on non-prime-powers, so the ln 6 Euler-only detector is not new',
    'irrelevant certificates: p = 2 with K ≥ 5, p = 7 and p = 13 sit above the Weil onset 3.44; only p = 2, K = 2..4 and p = 3, K = 2..3 bear on "below 3.44"',
    '"Route 30 succeeds" must sit next to "coefficient-multiplicativity test, no RH content; [RH] tag not advanced"',
  ]),
  nextStep: 'Euler-aware Weil positivity radius: minimise the Weil form over all coefficient sequences in the formal unitary degree-1 rung class '
    + '(Toeplitz-PSD per prime; conductor 5 and conductor 1) by a semidefinite program in the dag3 Legendre–Galerkin basis, and compare the class-uniform '
    + 'onset with the archimedean-only radius 0.9385 and DH\'s 1.72. This decides whether rung unitarity alone (no global functional equation) buys Weil '
    + 'positivity past the archimedean radius, the only way the rung detector could feed Route I.',
  files: Object.freeze(['tmp/routes-b7-r30-arb-cert.py', 'tmp/routes-b7-r30-arb-cert.json', 'tmp/routes-b7-r30-npp-zero-check.py', 'tmp/routes-b7-r30-zeroside.py',
    'tmp/routes-b7-r30-zeroside.json', 'tmp/routes-b7-ref30-exact.py', 'tmp/routes-b7-ref30-numeric.py', 'tmp/routes-b7-ref30-zeroside.py']),
  verdict: 'Route 30 succeeds as posed: a rung-native separating quantity exists at 2a just above ln 4 (even data; the rung Toeplitz/Hankel witness '
    + '2 + 2m_2(2) = −2(1+κ²)), or just above ln 2 with full data (|c(2)| = κ ln 2 ≠ ln 2), both read back from DH\'s on-line zeros. It is a '
    + 'coefficient-multiplicativity test with no RH content, and the [RH] tag is not advanced. Onsets are sharp relative to FORMAL local Euler products '
    + '(local degree 1 for the unitary classes); the Weil-form onset 3.44 is specific to RH-type positivity, not an information limit. Structural '
    + 'finding: F_DH = (Euler product over p ≡ ±1 mod 5) × G with signed virtual local measures at p ≡ ±2 mod 5. Internal, one referee pass. '
    + 'No Λ bound moves. No refereed bound is changed; RH open; NO QED.',
});

const R = ROUTE_30;
const KAPPA = (sqrt(10 - 2 * sqrt(5)) - 2) / (sqrt(5) - 1);
const aDH = (n) => [0, 1, KAPPA, -KAPPA, -1][n % 5];
const m2 = (k) => -((-KAPPA) ** k) + (k % 2 === 0 ? 2 * (-1) ** (k / 2) : 0);
const jacobiMin = (A) => { const n = A.length; const a = A.map((r) => r.slice());
  for (let sweep = 0; sweep < 100; sweep += 1) { let off = 0; for (let i = 0; i < n; i += 1) for (let j = i + 1; j < n; j += 1) off += a[i][j] ** 2; if (off < 1e-26) break;
    for (let p = 0; p < n; p += 1) for (let q = p + 1; q < n; q += 1) { if (abs(a[p][q]) < 1e-300) continue; const th = (a[q][q] - a[p][p]) / (2 * a[p][q]);
      const t = Math.sign(th || 1) / (abs(th) + sqrt(th * th + 1)); const c = 1 / sqrt(t * t + 1); const s = t * c;
      for (let k = 0; k < n; k += 1) { const x = a[k][p]; const y = a[k][q]; a[k][p] = c * x - s * y; a[k][q] = s * x + c * y; }
      for (let k = 0; k < n; k += 1) { const x = a[p][k]; const y = a[q][k]; a[p][k] = c * x - s * y; a[q][k] = s * x + c * y; } } }
  return Math.min(...a.map((r, i) => r[i])); };
const toeplitz = (K) => Array.from({ length: K + 1 }, (_, i) => Array.from({ length: K + 1 }, (_, j) => m2(abs(i - j))));
let cTable = null;
const cDH = () => { if (cTable) return cTable; const M = R.nonPrimePower.N; const c = new Float64Array(M + 1); // Σ_{d|n} c(d) a(n/d) = a(n) log n
  for (let n = 1; n <= M; n += 1) { let s = aDH(n) * log(n); for (let d = 1; d < n; d += 1) if (n % d === 0) s -= c[d] * aDH(n / d); c[n] = s; }
  cTable = c; return c; };
const primeFactors = (n0) => { const f = []; let n = n0; for (let p = 2; p * p <= n; p += 1) if (n % p === 0) { f.push(p); while (n % p === 0) n /= p; } if (n > 1) f.push(n); return f; };

export const ROUTE_30_ASSERTIONS = Object.freeze([
  {
    id: 'r30-kappa-and-witnesses',
    holds: () => { const k2 = KAPPA * KAPPA; const a = R.arb; return abs(KAPPA - R.kappa) < 1e-15 && abs(k2 - 1 - a.U2) < 1e-15
      && abs(2 + 2 * m2(2) - a.hankel) < 1e-14 && abs(-2 * (1 + k2) - a.hankel) < 1e-14 && abs((1 + k2) * log(6) - a.c6) < 1e-14
      && abs((-k2 - sqrt((2 + k2) ** 2 + 8 * k2)) / 2 - a.lamMinT2) < 1e-14 && abs(-(1 + KAPPA) / (1 - KAPPA) - a.szego) < 1e-14
      && abs(sqrt(2 + 3 * k2) - a.alpha2NonRamanujan) < 1e-14 && abs(Math.hypot(KAPPA, sqrt(1 - k2)) - 1) < 1e-15; },
    why: 'κ = 0.284079…; U_2 = κ² − 1 < 0; Hankel/Toeplitz witness 2 + 2m_2(2) = −2(1+κ²) = −2.1614; c(6) = (1+κ²) ln 6; λ_min(T^(2)) = −1.15558; Szegő −(1+κ)/(1−κ) = −1.79360; |α_2| = √(2+3κ²) = 1.497365; unitary realisation |κ + i√(1−κ²)| = 1.',
  },
  {
    id: 'r30-toeplitz-eigenvalues',
    holds: () => R.lamMinT2K.every(([K, v]) => { const lm = jacobiMin(toeplitz(K)); return abs(lm - v) < 5e-5 && lm >= R.arb.szego - 1e-12; })
      && jacobiMin(toeplitz(1)) > 0 && jacobiMin(toeplitz(2)) < 0 && abs(m2(0) - 1) < 1e-15,
    why: 'λ_min(T_2^(K)) by Jacobi: +0.7159 (K = 1, positive as the onset theorem requires), −1.15558, −1.52188, −1.73290, −1.78826 (K = 2, 3, 10, 40), all above the Szegő bound −1.79360; m_0 = 1 (local degree 1).',
  },
  {
    id: 'r30-rung-coefficients',
    holds: () => { const c = cDH(); return abs(c[2] - KAPPA * log(2)) < 1e-14 && abs(c[2] - R.zeroSide.c2.value) < 1e-11
      && abs(c[4] - m2(2) * log(2)) < 1e-13 && abs(c[4] - R.zeroSide.c4.value) < 1e-6 && abs(c[6] - R.arb.c6) < 1e-13
      && [2, 4, 8, 16, 32].every((q, k) => abs(c[q] / log(2) - m2(k + 1)) < 1e-11); },
    why: 'c(n) from Σ_{d|n} c(d)a(n/d) = a(n) log n: c(2) = κ ln 2 = 0.19690858829, c(4) = −(2+κ²) ln 2 = −1.44223196 (zero-side readouts 0.1969085882974 and −1.4422324), c(2^k)/ln 2 = m_k(2), c(6) = (1+κ²) ln 6.',
  },
  {
    id: 'r30-non-prime-power-pattern',
    holds: () => { const c = cDH(); let z = 0; let nz = 0; let ex = 0; let z5 = 0; const isPP = (n) => primeFactors(n).length === 1;
      for (let n = 2; n <= R.nonPrimePower.N; n += 1) { if (isPP(n)) continue; const has1 = primeFactors(n).some((p) => p % 5 === 1 || p % 5 === 4);
        if (n % 5 === 0) { if (has1 && abs(c[n]) < 1e-9) z5 += 1; continue; }
        if (has1) { if (abs(c[n]) < 1e-9) z += 1; else ex += 1; } else if (abs(c[n]) > 1e-4) nz += 1; else ex += 1; }
      const np = R.nonPrimePower; return z === np.zero && nz === np.nonzero && ex === np.exceptions && z5 === np.multiplesOf5Zero; },
    why: 'Live float check of the factorisation F_DH = E_{±1} × G to n ≤ 3000 (coprime to 5): 1031 non-prime-powers with a ±1 mod 5 factor vanish (|c| < 1e-9; exact by proof and symbolic check), 906 built from ±2 primes are nonzero (|c| > 3e-4), 0 exceptions; 247 multiples of 5 with a ±1 factor vanish.',
  },
  {
    id: 'r30-onsets-and-relevant-certs',
    holds: () => { const o = R.onsets; const w = o.weilForm; const below = [];
      for (const [p, [k0, k1]] of [[2, R.toeplitzCerts.p2], [3, R.toeplitzCerts.p3], [7, R.toeplitzCerts.p7], [13, R.toeplitzCerts.p13]])
        for (let K = k0; K <= k1; K += 1) if (K * log(p) < w) below.push([p, K]);
      return JSON.stringify(below) === JSON.stringify(R.toeplitzCerts.belowWeil) && log(o.unitaryFull[1]) < log(o.unitaryEvenOrAffine[1])
        && log(o.unitaryEvenOrAffine[1]) < log(o.eulerOnly[1]) && log(o.eulerOnly[1]) < w && abs(2 * o.weilFormHalf - w) < 1e-12
        && R.zeroSide.c2.support > log(2) && R.zeroSide.c4.support > log(4) && R.zeroSide.c4.support < w; },
    why: 'Onsets ln 2 < ln 4 < ln 6 = 1.79 < 3.44 (Weil form, a* = 1.72); a K-rung Toeplitz certificate at p needs 2a > K ln p, so only (p, K) = (2, 2..4), (3, 2..3) lie below 3.44; zero-side readouts at supports 1.093 > ln 2 and 1.606 ∈ (ln 4, 3.44).',
  },
  {
    id: 'r30-zero-side-uses-online-zeros',
    holds: () => { const z = R.zeroSide; return z.offLinePairsContribution[0] < 1e-5 && z.offLinePairsContribution[1] < 1e-3
      && z.c2.refereeError < 1e-11 && z.c4.refereeError < 1e-6 && z.c2.error < z.c2.tailHeuristic && z.c4.error < z.c4.tailHeuristic; },
    why: 'Both off-line pairs together contribute 7e-7 / 1.7e-4 to the readouts, so the detector reads the missing Euler product from the on-line zeros; errors sit below the (heuristic) tail estimates; referee reproduced with a different test family.',
  },
  {
    id: 'r30-honest-scope',
    holds: () => R.status === 'done' && /FORMAL/.test(R.headline) && /FORMAL/.test(R.verdict) && /no RH content/.test(R.verdict)
      && /\[RH\] tag is not advanced/.test(R.verdict) && /refereed bound is changed/i.test(R.verdict) && /NO QED/.test(R.verdict)
      && R.refereeKilled.length === 9 && R.refereeKilled.some((x) => /tlb-dh-blind/.test(x)),
    why: 'Sharpness scoped to formal local Euler products (local degree 1); detector is a multiplicativity test with no RH content; prior art credited; no Λ change; no QED.',
  },
]);

export default ROUTE_30;
