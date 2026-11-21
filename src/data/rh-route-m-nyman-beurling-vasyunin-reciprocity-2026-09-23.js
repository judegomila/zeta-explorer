/**
 * @fileoverview RH Route M FIRST-TESTED (2026-09-23): the Nyman–Beurling–Báez-Duarte criterion with the EXACT
 * Vasyunin cotangent-sum Gram matrix and the Bettin–Conrey reciprocity (period function of the weight-1
 * Eisenstein series). The route was proposed in rh-routes-jkl-non-statmech-external-input-hunt-2026-09-23.js as
 * the one un-run lead whose external source is MODULAR (an SL₂(ℤ) transformation law) rather than the
 * explicit-formula prime side every other route reduces to. Import-free; holds() assertions; literals baked from
 * tmp/rh-route-m/m1..m6 (mpmath 30–40 digits for the closed form / reciprocity / d_N cross-check, numpy float64
 * for the N = 500 Gram; every run < 4 min). NOT a bound; no refereed bound is changed; RH open; NO QED.
 *
 * SETTING (Báez-Duarte 2003, Lincei 14): ρ_k(x) = {1/(kx)} in L²(0,∞), χ = χ_(0,1]; RH ⟺ d_N → 0 with
 *   d_N² = min_c ‖χ − Σ_{k≤N} c_k ρ_k‖² = 1 − bᵀG⁻¹b,  b_k = ⟨χ,ρ_k⟩ = (log k + 1 − γ)/k.
 * Mellin–Plancherel on Re s = ½ (M[ρ(θ/x)] = −θ^s ζ(s)/s): G_{hk} = φ(log h − log k)/√(hk) with
 *   φ(u) = (1/2π)∫ e^{iut}|ζ(½+it)|² dt/(¼+t²)  — the TWISTED SECOND MOMENT with weight 1/(¼+t²),
 * and d_N² = min_D (1/2π)∫|1 + ζ(½+it)D_N(½+it)|² dt/(¼+t²): the NB distance IS a weighted-L² mollifier problem.
 *
 * VASYUNIN'S FORMULA, PINNED HERE (m1: exact piecewise integration against trigamma/logΓ/Barnes-G, 40 digits,
 * 17 coprime pairs, 3-parameter fit residual 3.1e-38): for coprime h,k, with I(h,k) := ∫_0^∞ {hv}{kv} dv/v² = hk·G_{hk},
 *   I(h,k) = (log 2π − γ)/2 · (h+k) + ½(h−k) log(k/h) − (π/2)(V(h/k) + V(k/h)),  V(h/k) = Σ_{m<k} {mh/k} cot(πm/k),
 * and G_{hk} = gcd·I(h',k')/(hk). V(h/k) = −c₀(h̄/k) (h̄h ≡ 1 mod k), c₀(a/q) := −Σ_{m<q}(m/q)cot(πma/q) (Bettin–Conrey);
 * the UNBARRED ansatz c₀(h/k)+c₀(k/h) does NOT fit (residual 0.72): the Gram sees the Estermann-inverse argument.
 *
 * HEADLINE RESULTS.
 *   (1) Baseline: d_N² log N / (2+γ−log 4π) = 1.258 (N=5) → 1.005 (N=50) → 0.998 (N=500); the N=500 distance sits ON the
 *       Burnol floor Σ_ρ 1/|ρ|² (Burnol 2002 lower bound; BCF 2013 matching upper bound under RH + Σ|ζ′(ρ)|⁻² ≪ T^{3/2−δ}).
 *       float64 (cond 9.6e5) and mpmath-30 agree to 13 digits. The log-tapered Möbius mollifier μ(k)(1−log k/log N)
 *       — asymptotically optimal by BCF — is 13.3× the optimum at N=500 (0.0990 vs 0.00742).
 *   (2) STRUCTURE: G = (rank-4 smooth part) + (cotangent matrix): the log/constant terms are Σ c_h c_k [C(1/h+1/k) +
 *       (1/k−1/h)(log k − log h)]/2-type, rank ≤ 4 EXACTLY (singular values 53.3, 49.8, 5.30, 0.273, then 4.6e-14); the
 *       cotangent matrix carries every other eigenvalue (inertia: exactly 2 negative, −51.7 and −2.83, all others equal
 *       G's to 1e-11). Scaling the cotangent part by 1−1e-3 moves d_N² 0.00742 → 0.00827; by 1−1e-2 makes 1−bᵀG⁻¹b < 0
 *       (the extended Gram [χ;ρ] stops being PSD): the modular data is rigid at the 1e-3 relative level.
 *   (3) RECIPROCITY (Bettin–Conrey IMRN 2013 Thm 1: x c(x) + c(1/x) − 1/(π Den x) = g(x) = (ix/2)ψ(x), ψ(z) =
 *       E₁(z) − z⁻¹E₁(−1/z), E₁ = 1 − 4Σd(n)e(nz)) — transcribed as c₀(h/k) + (k/h)c₀(k/h) − 1/(πh) = R(h/k), R = (i/2)ψ:
 *       verified — R converges along the golden convergents (ΔR·k² → ±0.164762) while c₀ itself grows ±0.0375k; small-z
 *       expansion R(1/k) − (k/π)(log(k/2π)+γ) = π/(36k) − π³/(5400k³) + … reproduced (0.0872664626 = π/36 to 9 digits),
 *       i.e. (i/2)ψ(x) = −(log 2πx − γ)/(πx) + (2/π)Σ_{n even} ζ(n)B_n x^{n−1}/n exactly as in BC §3.
 *   (4) THE KEY TEST — does the period function constrain G? NO, measurably: (a) truncating the Euclid/continued-fraction
 *       descent c₀^{(D)}(a/q) = R(a/q) + 1/(πa) − (q/a)c₀^{(D−1)}((q mod a)/a) at ANY depth D < 10 (max depth 12 for
 *       h̄/k, k ≤ 500) leaves G^{(D)} INDEFINITE — at D=9, 99.92% of entries are exact and ‖G⁽⁹⁾−G‖_F/‖G‖_F = 1.2e-3 yet 7
 *       eigenvalues are negative; (b) the exact chain with R replaced by its 2-term expansion (max rel err 7%,
 *       Gram rel-Frobenius 7.9e-4) has 19 negative eigenvalues. Positivity — the only thing d_N² needs — lives entirely
 *       below the 1e-3 relative scale where every period-function approximation lives (λ_min/λ_max = 1e-6 at N=500).
 *       (c) λ_min(G_N) ∝ N^{−1.92} with the SAME law as the zero-free-symbol Gram [1/max(h,k)] (dilates of χ; ratio
 *       3.7 → 5.3 for N = 50 → 500): the small eigenvalues are dilation crowding (Montgomery–Vaughan / large sieve),
 *       not zeros. (d) The RH content sits in the residual on the line: |1+ζD_N|² = 1 exactly at every zero (checked to
 *       1e-14 for 20 zeros), median 0.079 at zero-midpoints, 91% of d_N² below |t| = 400, and d_N²/Σ1/|ρ|² = 0.16063 vs
 *       1/log N = 0.16091 — each zero contributes 1/|ρ|² times the Dirichlet-polynomial resolution width 1/log N.
 *   (5) VERDICT: the modular input COLLAPSES to the mollifier lineage, at a pinpointed place: the cotangent sum is the value
 *       D(0,x) = ¼ + (i/2)c(x) of the Estermann function Σd(n)e(nx)n⁻ˢ (BC §2), i.e. the OFF-DIAGONAL term of the twisted
 *       second moment; the reciprocity is the S-transformation of E₁ = Estermann's functional equation, proven from the
 *       functional equation of ζ (BC §3–4: Mellin–Barnes with ζ(s)ζ(1−s)/sin πs, Q(1−s)=Q(s)); Estermann's FE + Kloosterman
 *       (Deshouillers–Iwaniec) is exactly the modular input Conrey 1989 used to push the mollifier length to θ < 4/7. The
 *       NB problem is that mollifier at T = O(1) with UNBOUNDED length and exact off-diagonals, so no cancellation estimate
 *       of Kloosterman type reaches d_N → 0 (that is RH); the reciprocity's operational content is BC Corollary 1 (c(x) in
 *       poly(log Den x) time) and quantum modularity — descriptive of entries, blind to positivity. No partial escape.
 */

const GAMMA_E = 0.5772156649015329;
const C_VAS = (Math.log(2 * Math.PI) - GAMMA_E) / 2;           // 0.6303307007539063
const C_BURNOL = 2 + GAMMA_E - Math.log(4 * Math.PI);           // Σ_ρ 1/|ρ|² = 0.04619141793224207

// ---------------------------------------------------------------------------------------------
// JS re-implementation of the pinned closed form (small k only; the harness recomputes the m1 pairs).
// ---------------------------------------------------------------------------------------------
const gcd = (a, b) => { while (b) [a, b] = [b, a % b]; return a; };
const cot = (x) => 1 / Math.tan(x);
/** Vasyunin sum V(h/k) = Σ_{m<k} {mh/k} cot(πm/k); V(a/1) = 0. */
export const vasyuninV = (h, k) => { if (k === 1) return 0; let s = 0; for (let m = 1; m < k; m++) s += (((m * h) % k) / k) * cot(Math.PI * m / k); return s; };
/** Bettin–Conrey c₀(a/q) = −Σ_{m<q} (m/q) cot(πma/q); 1-periodic, odd, c₀(0) = 0. */
export const bettinConreyC0 = (a, q) => { a = ((a % q) + q) % q; if (q === 1 || a === 0) return 0; let s = 0; for (let m = 1; m < q; m++) s += (m / q) * cot(Math.PI * m * a / q); return -s; };
/** I(h,k) = ∫_0^∞ {hv}{kv} dv/v² for coprime h,k (Vasyunin). */
export const vasyuninI = (h, k) => C_VAS * (h + k) + 0.5 * (h - k) * Math.log(k / h) - (Math.PI / 2) * (vasyuninV(h, k) + vasyuninV(k % h, h));
/** Gram entry ⟨ρ_h, ρ_k⟩_{L²(0,∞)}, ρ_k(x) = {1/(kx)}. */
export const nbGram = (h, k) => { const d = gcd(h, k); return d * vasyuninI(h / d, k / d) / (h * k); };
export const nbB = (k) => (Math.log(k) + 1 - GAMMA_E) / k;
/** Reciprocity remainder R(h/k) = c₀(h/k) + (k/h)c₀(k/h) − 1/(πh) = (i/2)ψ(h/k) (Bettin–Conrey Thm 1 rescaled by k/h). */
export const reciprocityR = (h, k) => bettinConreyC0(h, k) + (k / h) * bettinConreyC0(k, h) - 1 / (Math.PI * h);

export const VASYUNIN_FORMULA = Object.freeze({
  statement: 'I(h,k) = (log 2π − γ)/2·(h+k) + ½(h−k)log(k/h) − (π/2)(V(h/k) + V(k/h)), V(h/k) = Σ_{m<k}{mh/k}cot(πm/k), coprime h,k; G_{hk} = gcd·I(h′,k′)/(hk); b_k = (log k + 1 − γ)/k',
  C: C_VAS,
  // [h, k, I(h,k) exact by piecewise trigamma/logΓ/Barnes-G integration, 40-digit mpmath (m1)]
  exactPairs: Object.freeze([
    [1, 1, 1.260661401507812622954147], [1, 2, 1.544418511981746279722605], [1, 3, 1.725010408386551862945396],
    [2, 3, 2.646621055676413057964016], [1, 5, 1.962394311690244643604698], [2, 5, 3.164052341247138846888813],
    [3, 5, 4.103346554445196235854141], [3, 7, 4.635871590223963824684904], [2, 7, 3.503938631379963120606261],
    [5, 8, 6.712474989866864950124346], [3, 11, 5.317020337876581210350846], [4, 13, 6.863216508254599680676044],
    [7, 12, 9.668830122179506560262807], [5, 17, 8.663114688663388301514293], [11, 13, 13.43001747573351483081063],
    [1, 20, 2.635049603314400002411554], [7, 30, 12.96957338907003677348363],
  ]),
  fit: Object.freeze({ withVasyuninSum: { C1: 0.63033070075390631148, C2: 0.5, C3: -1.5707963267948966192, residual: 3.08e-38 },
    withUnbarredC0: { C1: 0.55414781440295547121, C2: 0.22608928086930044165, C3: 0.33329891770745469827, residual: 0.72085 },
    note: 'V(h/k) = −c₀(h̄/k) with h̄h ≡ 1 (mod k): the Gram entry uses the Estermann-inverse argument (max |V + c₀(h̄/k)| = 1.2e-11 over k ≤ 60); the unbarred combination c₀(h/k)+c₀(k/h) does not fit.' }),
  bCheck: Object.freeze([[1, 0.42278428879, 0.422784335098], [2, 0.557965734675, 0.557965757829], [7, 0.338384919692, 0.338384926308]]), // [k, quad to 3000k + tail, formula]
  // twisted second moment (1/2π)∫_{|t|≤3000} |ζ(½+it)|²(h/k)^{it}dt/(¼+t²) vs I(h,k)/√(hk); deficit = tail ≈ (log(T/2π)+2γ)/(πT) ≈ 8e-4 (m6)
  mellinIdentity: Object.freeze([[1, 1, 1.259621206, 1.260661402], [1, 2, 1.091353959, 1.092068803], [2, 3, 1.080145003, 1.080478521], [1, 5, 0.8771624355, 0.8776094159]]),
});

// ---------------------------------------------------------------------------------------------
// (1) BASELINE d_N ladder (m2 float64 Cholesky + one refinement step; m3 mpmath dps 30 cross-check)
// ---------------------------------------------------------------------------------------------
export const NB_DISTANCE_LADDER = Object.freeze({
  C_burnol: C_BURNOL,
  // [N, d_N², d_N² log N, d_N² log N / C_burnol, λ_min(G_N), cond(G_N), c_1, c_2, Q(Möbius log-taper), Q(plain Möbius)]
  rows: Object.freeze([
    [5, 3.610159981861e-02, 0.058103, 1.2579, 3.0122e-02, 8.277e+01, -0.92723, 0.85938, 1.31076, 0.04858],
    [10, 2.377186555604e-02, 0.054737, 1.1850, 9.1696e-03, 3.294e+02, -0.93945, 0.90075, 0.67148, 0.13719],
    [20, 1.650358307103e-02, 0.049440, 1.0703, 2.5956e-03, 1.353e+03, -0.95286, 0.92537, 0.41022, 0.09989],
    [30, 1.453011047414e-02, 0.049420, 1.0699, 1.2374e-03, 3.052e+03, -0.95845, 0.93452, 0.32449, 0.07122],
    [50, 1.186904886610e-02, 0.046432, 1.0052, 4.3481e-04, 9.410e+03, -0.96594, 0.94528, 0.24320, 0.05886],
    [75, 1.106494678239e-02, 0.047773, 1.0342, 2.0417e-04, 2.118e+04, -0.96823, 0.94965, 0.20171, 0.05032],
    [100, 1.018876250148e-02, 0.046921, 1.0158, 1.2024e-04, 3.725e+04, -0.97056, 0.95211, 0.17848, 0.14730],
    [150, 9.386642359844e-03, 0.047033, 1.0182, 5.5890e-05, 8.387e+04, -0.97248, 0.95409, 0.15053, 0.07036],
    [200, 8.920725383476e-03, 0.047265, 1.0232, 3.1255e-05, 1.544e+05, -0.97398, 0.95706, 0.13468, 0.26216],
    [250, 8.242844686252e-03, 0.045513, 0.9853, 2.0624e-05, 2.390e+05, -0.97587, 0.96066, 0.12526, 0.04179],
    [300, 7.994899430929e-03, 0.045601, 0.9872, 1.4512e-05, 3.454e+05, -0.97647, 0.96097, 0.11687, 0.07387],
    [350, 7.852471277006e-03, 0.045999, 0.9958, 1.0833e-05, 4.689e+05, -0.97683, 0.96146, 0.11123, 0.06951],
    [400, 7.707773753672e-03, 0.046181, 0.9998, 8.3058e-06, 6.184e+05, -0.97725, 0.96201, 0.10678, 0.06737],
    [450, 7.471325330727e-03, 0.045644, 0.9882, 6.7503e-06, 7.682e+05, -0.97806, 0.96385, 0.10283, 0.10029],
    [500, 7.419858011582e-03, 0.046112, 0.9983, 5.4599e-06, 9.577e+05, -0.97824, 0.96423, 0.09900, 0.07586],
  ]),
  // mpmath dps=30 LU (m3): [N, d_N²]
  mpmathCrossCheck: Object.freeze([[50, 0.01186904886609556611], [100, 0.010188762501477990249], [200, 0.0089207253834699650725], [300, 0.0079948994309219074694], [400, 0.0077077737536833878676], [500, 0.0074198580116021313748]]),
  spectrum500: Object.freeze({ smallest: [5.459884378251845e-06, 5.624354837105912e-06, 5.729604916843596e-06], largest: [0.5196496334441343, 1.70298869474709, 5.228866173055357], countBelow1e3: 425, trace: 8.563450305446962 }),
  literature: Object.freeze({
    baezDuarte2003: 'RH ⟺ χ_(0,1] ∈ closure of span{ρ(1/(ax)) : a ∈ ℕ} in L²(0,∞) (Lincei Rend. 14 (2003) 5–11)',
    burnol2002: 'liminf d_N² log N ≥ Σ_{Re ρ=½} m(ρ)²/|ρ|² (Adv. Math. 170 (2002) 56–70)',
    bettinConreyFarmer2013: 'RH + Σ_{|γ|≤T}|ζ′(ρ)|⁻² ≪ T^{3/2−δ} ⇒ (1/2π)∫|1 − ζV_N|²dt/(¼+t²) ~ (2+γ−log 4π)/log N with V_N = Σ_{n≤N} μ(n)(1 − log n/log N)n⁻ˢ (arXiv 1211.5191); proof is Mellin-side (residues at zeros), not via the reciprocity',
    bblsNotes3: 'Báez-Duarte–Balazard–Landreau–Saias, Adv. Math. 149 (2000) — Vasyunin formula + numerics; BBLS 2005 Ramanujan J. 9 — the multiplicative autocorrelation A(λ) = ∫{t}{λt}dt/t² = φ',
  }),
});

// ---------------------------------------------------------------------------------------------
// (2) Gram structure: rank-4 smooth part + cotangent matrix; rigidity of the cotangent part
// ---------------------------------------------------------------------------------------------
export const GRAM_STRUCTURE = Object.freeze({
  smoothPart: 'S_{hk} = C(1/h + 1/k) + ½(1/k − 1/h)(log k − log h)  for ALL pairs (the gcd factor cancels) ⇒ Σc_hc_kS_{hk} = 2C(Σc_h/h)(Σc_k) + (Σc_k log k/k)(Σc_h) − (Σc_h log h)(Σc_k/h): rank ≤ 4',
  smoothSingularValues: Object.freeze([53.289344851743174, 49.7534536075017, 5.3007557465622925, 0.27319668535680885, 4.6435892275215896e-14, 3.8134770581718183e-14]),
  cotPart: Object.freeze({ negativeEigenvalues: [-51.73915916766818, -2.8289682938089173], nextEigenvalues: [5.4599116869561616e-06, 5.624376261994123e-06], largest: 52.96814837584753, frobenius: 74.10120854387495, fullFrobenius: 5.529997674354879,
    note: 'the cotangent matrix has exactly 2 negative eigenvalues (cancelling the two big smooth singular directions) and otherwise reproduces G’s spectrum to 1e-11: G mod rank 4 IS the cotangent matrix' }),
  // scaling the cotangent part by (1−ε): [ε, PD?, 1 − bᵀG_ε⁻¹b]
  cotScaling: Object.freeze([[0, true, 0.007419858011582736], [1e-3, true, 0.00827008064699919], [1e-2, true, -0.0005293285432588224], [0.1, false, null]]),
  lambdaMinLaw: Object.freeze({ exponent250to500: 1.9174073543118484,
    // [N, λ_min of the zero-free-symbol Gram [1/max(h,k)] (dilates of χ), λ_min(G_N), ratio]
    vsChiGram: Object.freeze([[50, 0.00011691137779751658, 0.0004348060657332311, 3.7191082161933706], [100, 2.7634057060110987e-05, 0.00012024222868321946, 4.3512332778955525], [200, 6.663370407843584e-06, 3.125490352825882e-05, 4.690554721596755], [500, 1.0359532732731096e-06, 5.459884378251845e-06, 5.270396377050154]]),
    reading: 'same N^{−1.9} law with an O(1) ratio: the small eigenvalues are the dilation-crowding (log k spacing 1/N) effect of any Toeplitz-in-log Gram, independent of the zeros; d_N² ~ C/log N is a different, symbol-driven phenomenon' }),
});

// ---------------------------------------------------------------------------------------------
// (3) Bettin–Conrey reciprocity: transcription check, smoothness, expansion
// ---------------------------------------------------------------------------------------------
export const RECIPROCITY = Object.freeze({
  bettinConrey2013: 'IMRN 2013(24) 5709–5726, Thm 1: x c(x) + c(1/x) − 1/(π Den x) = g(x) := (ix/2)ψ(x), ψ(z) = E₁(z) − z⁻¹E₁(−1/z), E₁(z) = 1 − 4Σd(n)e(nz); ψ analytic on ℂ∖(−∞,0] (Lewis–Zagier period function of E(z,½)); D(0,x) = ¼ + (i/2)c(x) (Estermann); Cor. 1: c(x) computable in poly(log Den x) time',
  transcription: 'multiply by k/h at x = h/k: c₀(h/k) + (k/h)c₀(k/h) − 1/(πh) = R(h/k), R := (i/2)ψ',
  // golden-ratio convergents h/k → (√5−1)/2: [h, k, c₀(h/k), R(h/k), ΔR·k²]  (mpmath dps 30, m4)
  goldenConvergents: Object.freeze([
    [2, 3, -0.192450, -0.351605032822, -0.2996563197418193], [3, 5, 0.080325, -0.346528878590, 0.12690385579681301],
    [5, 8, -0.414214, -0.349356233443, -0.18095071057725787], [8, 13, 0.364469, -0.348416332840, 0.1588432018707506],
    [13, 21, -0.913068, -0.348795156191, -0.16706109768570446], [21, 34, 1.144805, -0.348653382945, 0.1638898725135912],
    [34, 55, -2.191236, -0.348707960275, -0.16509642322619175], [55, 89, 3.202919, -0.348687175668, 0.16463487126026338],
    [89, 144, -5.527370, -0.348695123732, -0.1648110675360105], [144, 233, 8.597110, -0.348692089163, 0.16474375183531273],
    [233, 377, -14.257672, -0.348693248458, -0.1647694619981388], [377, 610, 22.721594, -0.348692805674, 0.16475964127659484],
    [610, 987, -37.112455, -0.348692974807, -0.164763392412734], [987, 1597, 59.700860, -0.348692910205, 0.1647619595995581],
    [1597, 2584, -96.946504, -0.348692934880, -0.16476250688452043], [2584, 4181, 156.514175, -0.348692925455, 0.16476229784010696],
    [4181, 6765, -253.593868, -0.348692929055, -0.16476237768813254], [6765, 10946, 409.974855, -0.348692927680, 0.1647623471878766],
    [10946, 17711, -663.701912, -0.348692928205, -0.16476235885221166], [17711, 28657, 1073.543578, -0.348692928005, 0.1647623540971199],
  ]),
  // small-z expansion: (i/2)ψ(x) = −(log 2πx − γ)/(πx) + (2/π)Σ_{n even ≥2} ζ(n)B_n x^{n−1}/n  ⇒  R(1/k) = (k/π)(log(k/2π)+γ) + π/(36k) − π³/(5400k³) + π⁵/(119070k⁵) …
  // [k, R(1/k), (k/π)(log(k/2π)+γ), (R − leading)·k]
  smallZ: Object.freeze([[10, 3.3252670462878418, 3.3165461164917787, 0.08720929796063082], [100, 106.45989371174491, 106.45902105286056, 0.08726588843510574], [1000, 1797.5258966744902, 1797.5258094080334, 0.08726645685781596], [5000, 11549.12905812734, 11549.129040674048, 0.08726646237004036], [20000, 55021.940173165574, 55021.940168802255, 0.08726646258536172]]),
  distributionK1009: Object.freeze({ k: 1009, stdevOfC0OverK: 0.3617263606197082, maxAbsC0OverK: 1.8006933400311684, atH1: 1.8006933400311684, fracAbsBelowHalf: 0.875, note: 'c₀(h/k)/k has a heavy-tailed limiting distribution (Bettin 2015; Maier–Rassias) — the Gram’s off-diagonal is a quantum-modular, not a smooth, function of h/k' }),
});

// ---------------------------------------------------------------------------------------------
// (4) KEY TEST: period-function / Euclid-depth truncations of the Gram and the Mellin-side residual
// ---------------------------------------------------------------------------------------------
export const RECIPROCITY_STRUCTURAL_TEST = Object.freeze({
  recursion: 'c₀^{(D)}(a/q) = R(a/q) + 1/(πa) − (q/a)·c₀^{(D−1)}((q mod a)/a), c₀^{(−1)} ≡ 0; c₀^{(∞)} = c₀ exactly (Euclid chain of a/q, max depth 12 for h̄/k with k ≤ 500); G^{(D)} = rank-4 part + cot part built from V^{(D)}(h/k) = −c₀^{(D)}(h̄/k)',
  // [D, PD?, λ_min, #negative eigenvalues, ‖G^{(D)}−G‖_F/‖G‖_F, fraction of coprime (a,q), q≤500, whose h̄/k chain is exact at depth D]
  depthRows: Object.freeze([
    [0, false, -1.5550e+01, 273, 5.1372e+00, 0.0066], [1, false, -1.5568e+01, 231, 5.1204e+00, 0.0418], [2, false, -2.3903e+00, 254, 1.2559e+00, 0.1422],
    [3, false, -2.3835e+00, 242, 1.2339e+00, 0.3260], [4, false, -3.8478e-01, 237, 2.3121e-01, 0.5578], [5, false, -3.7685e-01, 230, 2.1491e-01, 0.7685],
    [6, false, -5.3458e-02, 207, 3.0212e-02, 0.9074], [7, false, -5.0123e-02, 161, 2.3521e-02, 0.9729], [8, false, -5.1350e-03, 65, 2.4609e-03, 0.9943],
    [9, false, -3.8342e-03, 7, 1.1971e-03, 0.9992], [10, true, 5.4599e-06, 0, 1.0813e-11, 1.0], [11, true, 5.4599e-06, 0, 1.0813e-11, 1.0], [12, true, 5.4599e-06, 0, 1.0813e-11, 1.0],
  ]),
  surrogate: Object.freeze({ formula: 'R_asym(z) = (γ − log 2πz)/(πz) + πz/36 (two terms of the BC expansion) inside the EXACT Euclid chain', maxAbsErrOnRationals: 0.004273188321464727, maxRelErr: 0.07035690614717359, gramRelFrobenius: 0.0007873435207327326, gramLambdaMin: -2.3367833398998946e-05, gramNegativeEigs: 19 }),
  mellinResidual: Object.freeze({ N: 500, T: 400, dt: 0.02, massBelowT: 0.006786263970884834, dN2: 0.007419858011581737, fracCaptured: 0.9146083335142102,
    windowHalfWidth: 0.48273357748200746, massNearZeros: 0.004845850062716366, fracNear: 0.7140674284859176, zerosBelowT: 110,
    atZeroNormalizedErr: 1.199040866595169e-14, midpointNormalizedMedian: 0.07939133835482659, midpointNormalizedMax: 0.6920116728491683,
    dN2OverC: 0.16063282626365558, oneOverLogN: 0.1609111924940025,
    reading: '|1 + ζD_N|²/(¼+t²) equals 1/|ρ|² at every zero (forced: ζ(ρ)=0) and is ~0.08/|s|² between zeros; d_N² = Σ_ρ|ρ|⁻² × (1/log N) to 0.2%: the residual is the mollifier’s unavoidable 1/log N-wide spike at each zero' }),
  optimalCoefficients: Object.freeze({
    // [k, c_k^{opt} at N=500, −μ(k)]
    table: Object.freeze([[1, -0.97824, -1], [2, 0.96423, 1], [3, 0.95841, 1], [4, 0.06251, 0], [5, 0.88373, 1], [6, -0.77851, -1], [7, 0.82514, 1], [8, 0.00071, 0], [9, 0.02133, 0], [10, -0.72751, -1], [11, 0.76952, 1], [12, -0.06863, 0], [13, 0.73717, 1], [14, -0.6667, -1], [15, -0.68751, -1], [16, 0.01219, 0], [17, 0.69116, 1], [18, -0.05911, 0], [19, 0.65917, 1], [20, -0.00555, 0]]),
    rmsNonSquarefree: 0.07470320353050022, rmsSquarefree: 0.36961085136984156, fracSignMatchesMinusMu: 1.0, meanRatioKle50: 0.6643413460587165, meanRatioKgt400: 0.2162216433244682,
    moebiusTaperOverOptimal500: 0.09900 / 7.419858011582e-03,
    reading: 'G⁻¹b is a Möbius mollifier with an optimised (much gentler than 1 − log k/log N) taper — the Levinson–Conrey P(·) shape optimisation; BCF prove the linear taper is asymptotically optimal, so the 13.3× gap at N = 500 is a secondary-term effect' }),
});

// ---------------------------------------------------------------------------------------------
// (5) Collapse map + verdict
// ---------------------------------------------------------------------------------------------
export const ROUTE_M_VERDICT = Object.freeze({
  key: 'M',
  status: 'FIRST-TESTED 2026-09-23 — modular input COLLAPSES to the mollifier lineage (Estermann functional equation = functional equation of ζ); no partial escape; RH open; NO QED',
  collapseChain: Object.freeze([
    { step: 1, claim: 'G_{hk} = (1/√hk)·(1/2π)∫|ζ(½+it)|²(h/k)^{it}dt/(¼+t²): the Gram is the twisted second moment with the NB weight', evidence: 'Mellin–Plancherel; numerically to the 8e-4 truncation tail for 4 pairs (VASYUNIN_FORMULA.mellinIdentity)' },
    { step: 2, claim: 'the cotangent term is the off-diagonal of that moment: V(h/k) = −c₀(h̄/k) and D(0,x) = ¼ + (i/2)c(x) with D the Estermann function Σd(n)e(nx)n⁻ˢ', evidence: 'BC §2; pinned fit (barred argument fits to 3e-38, unbarred fails)' },
    { step: 3, claim: 'the reciprocity is the z → −1/z period relation of E₁, i.e. Estermann’s functional equation; BC prove it by Mellin–Barnes with ζ(s)ζ(1−s)/sin πs and the functional equation of ζ (Q(1−s) = Q(s))', evidence: 'BC §3–4; small-z expansion with ζ(n)B_n coefficients reproduced here to 9 digits' },
    { step: 4, claim: 'Estermann’s FE + Kloosterman sums (Deshouillers–Iwaniec) is exactly the modular input already inside the mollifier lineage (Conrey 1989, θ < 4/7); NB = that mollifier at T = O(1) with unbounded length and exact off-diagonals', evidence: 'imp-1312 / levinson-mollifier-frontier-audit-2026-09.js classification + step 1' },
    { step: 5, claim: 'the input is therefore symmetry-forced (functional equation) — sweep lesson L1 (RH-blind); the RH content is the zero-pinned residual (|1+ζD_N|² = 1 at ρ), d_N² = Σ|ρ|⁻²/log N', evidence: 'RECIPROCITY_STRUCTURAL_TEST.mellinResidual (0.16063 vs 0.16091)' },
    { step: 6, claim: 'the period function cannot bound G⁻¹ or λ_min: every truncation of the SL₂(ℤ)-descent (depth < 10) and the 2-term period surrogate leave G indefinite at relative errors 1e-3, while positivity lives at λ_min/λ_max = 1e-6', evidence: 'RECIPROCITY_STRUCTURAL_TEST.depthRows / surrogate; GRAM_STRUCTURE.cotScaling (1% scaling ⇒ 1 − bᵀG⁻¹b < 0)' },
  ]),
  whatIsGenuinelyThere: Object.freeze([
    'an EXACT finite quadratic form for the NB distance (no asymptotics), whose N = 500 value already sits on the Burnol constant to 0.2%',
    'the identity G = rank-4 + cotangent matrix (all spectral content in the modular part) — descriptive, not a positivity tool',
    'BC Corollary 1: entries computable in poly(log k) time via the Euclid chain — a computational, not analytic, gain',
  ]),
  siblingAssessment: Object.freeze({
    module: 'imp-96043-route-m-nyman-beurling-first-test.js',
    relation: 'independent same-day structural assessment reaching the same identification (c₀ = Estermann value, reciprocity = Estermann FE = FE of ζ; termini = Möbius mollifier + Weil positivity). This module supplies the computation that assessment did not run: imp-96043’s burnolScaling rows are the asymptotic formula Σ|ρ|⁻²/log N itself (its assertion checks |dN2 − C/log N| < 1e-9), whereas the computed exact-Gram values are 0.011869 / 0.010189 / 0.008921 / 0.007420 at N = 50/100/200/500 (formula: 0.011808 / 0.010030 / 0.008718 / 0.007433) — the ratio 1.005 → 0.998 is a measured fact here, not an input. Convention note: imp-96043’s c₀ has the opposite sign to Bettin–Conrey’s, and its reciprocity line omits the −1/(πh) term and uses k̄; the Gram’s argument is h̄/k (barred), pinned above.',
  }),
  preciseWall: 'an UNCONDITIONAL evaluation of the Möbius-weighted double cotangent sum Σ_{h,k≤N} μ(h)μ(k)w_hw_k·gcd·V(h′/k′)/(hk) to o(1) precision would give d_N → 0 (BCF/Burnol), i.e. RH itself; the reciprocity reduces each summand to continued-fraction data of h̄/k but the μ(h)μ(k)-weighted equidistribution of that data is the Kloosterman/Estermann problem in the regime (T = O(1), N → ∞) where square-root cancellation does not suffice',
  nextStep: 'none for RH via Route M. The only non-perturbative object left is the double cotangent sum above, which is RH-equivalent to o(1) precision. Route M joins J, K, L in the wall map: wall = mollifier / Estermann-FE (a symmetry-forced input), entered through the Nyman–Beurling weight 1/(¼+t²).',
  honest: 'Nothing here is a bound or a proof. The Vasyunin Gram, its d_N ladder, the reciprocity transcription and the depth-truncation test are numerical facts at N ≤ 500 (plus 30–40-digit mpmath for the closed form and the reciprocity); the collapse identification rests on Bettin–Conrey’s own §2–4 and on the Mellin identity. No refereed bound is changed; RH open; NO QED.',
  scripts: Object.freeze(['tmp/rh-route-m/m1-vasyunin-validate.py', 'tmp/rh-route-m/m2-gram-dn.py', 'tmp/rh-route-m/m3-mp-check.py', 'tmp/rh-route-m/m4-reciprocity.py', 'tmp/rh-route-m/m5-structure.py', 'tmp/rh-route-m/m6-mellin-identity.py']),
});

export const RH_ROUTE_M = Object.freeze({
  id: 'rh-route-m-nyman-beurling-vasyunin-reciprocity', date: '2026-09-23',
  status: ROUTE_M_VERDICT.status,
  vasyunin: VASYUNIN_FORMULA, ladder: NB_DISTANCE_LADDER, structure: GRAM_STRUCTURE, reciprocity: RECIPROCITY, test: RECIPROCITY_STRUCTURAL_TEST, verdict: ROUTE_M_VERDICT,
});

// ---------------------------------------------------------------------------------------------
export const RH_ROUTE_M_ASSERTIONS = Object.freeze([
  {
    id: 'M-vasyunin-closed-form-reproduces-exact-integrals',
    holds: () => VASYUNIN_FORMULA.exactPairs.every(([h, k, I]) => Math.abs(vasyuninI(h, k) - I) < 1e-12)
      && Math.abs(VASYUNIN_FORMULA.fit.withVasyuninSum.C1 - C_VAS) < 1e-15 && Math.abs(VASYUNIN_FORMULA.fit.withVasyuninSum.C3 + Math.PI / 2) < 1e-15
      && VASYUNIN_FORMULA.fit.withVasyuninSum.residual < 1e-30 && VASYUNIN_FORMULA.fit.withUnbarredC0.residual > 0.5
      && Math.abs(vasyuninI(1, 1) - (Math.log(2 * Math.PI) - GAMMA_E)) < 1e-15,
    why: 'The JS closed form (log2π−γ)/2·(h+k) + ½(h−k)log(k/h) − (π/2)(V(h/k)+V(k/h)) reproduces 17 exact 40-digit integrals ∫{hv}{kv}dv/v² to 1e-12; I(1,1) = log 2π − γ; the unbarred c₀ ansatz fails.',
  },
  {
    id: 'M-vasyunin-sum-is-minus-c0-at-inverse-argument',
    holds: () => { for (let q = 2; q <= 40; q++) for (let a = 1; a < q; a++) { if (gcd(a, q) !== 1) continue; let inv = 1; while ((a * inv) % q !== 1) inv++; if (Math.abs(vasyuninV(a, q) + bettinConreyC0(inv, q)) > 1e-10) return false; } return true; },
    why: 'V(h/k) = −c₀(h̄/k), h̄h ≡ 1 (mod k): the Gram’s arithmetic term is the Estermann-inverse (Kloosterman-type) argument, the same object as the off-diagonal of the twisted second moment.',
  },
  {
    id: 'M-gram-diagonal-b-and-mellin-identity',
    holds: () => [1, 3, 10, 17].every((k) => Math.abs(nbGram(k, k) - (Math.log(2 * Math.PI) - GAMMA_E) / k) < 1e-15)
      && Math.abs(nbGram(6, 4) - 2 * vasyuninI(3, 2) / 24) < 1e-15 && Math.abs(nbGram(6, 4) - nbGram(4, 6)) < 1e-16
      && VASYUNIN_FORMULA.bCheck.every(([k, q, f]) => Math.abs(f - nbB(k)) < 1e-9 && Math.abs(q - f) < 1e-7)
      && VASYUNIN_FORMULA.mellinIdentity.every(([h, k, tw, I]) => Math.abs(I - vasyuninI(h, k) / Math.sqrt(h * k)) < 1e-8 && I - tw > 0 && I - tw < 1.2e-3),
    why: '‖ρ_k‖² = (log 2π − γ)/k, gcd scaling, b_k = (log k+1−γ)/k (quadrature to 1e-7), and the twisted second moment (|t| ≤ 3000) matches I(h,k)/√(hk) up to the positive O(log T/T) tail: the Gram IS the |ζ|²-weighted moment.',
  },
  {
    id: 'M-dN-sits-on-burnol-floor-and-is-precision-safe',
    holds: () => {
      const r = NB_DISTANCE_LADDER.rows;
      const monotone = r.every((row, i) => i === 0 || row[1] < r[i - 1][1]);
      const ratios = r.every(([N, d, dl, ratio]) => Math.abs(dl - d * Math.log(N)) < 1e-5 && Math.abs(ratio - dl / C_BURNOL) < 2e-3);
      const last = r[r.length - 1];
      const mp = NB_DISTANCE_LADDER.mpmathCrossCheck.every(([N, d]) => { const row = r.find((x) => x[0] === N); return row && Math.abs(row[1] - d) < 1e-12; });
      return monotone && ratios && last[0] === 500 && Math.abs(last[3] - 1) < 0.01 && r[0][3] > 1.2 && r.slice(4).every((row) => Math.abs(row[3] - 1) < 0.04) && mp && last[5] < 1e6
        && Math.abs(C_BURNOL - 0.04619141793224207) < 1e-15;
    },
    why: 'd_N² decreases monotonically, d_N² log N/Σ|ρ|⁻² = 1.26 (N=5) → within 4% of 1 for all N ≥ 50 → 0.998 at N=500; float64 (cond < 1e6) and mpmath-30 agree to 1e-12: the exact Gram puts the NB distance on the Burnol constant already at N = 500.',
  },
  {
    id: 'M-moebius-taper-far-from-optimum-but-signs-match',
    holds: () => NB_DISTANCE_LADDER.rows.every(([, d, , , , , c1, c2, taper, plain]) => taper > 10 * d && plain > d && c1 < -0.9 && c1 > -1 && c2 > 0.85 && c2 < 1)
      && RECIPROCITY_STRUCTURAL_TEST.optimalCoefficients.table.every(([k, c, mm]) => (mm === 0 ? Math.abs(c) < 0.1 : Math.sign(c) === mm && Math.abs(c) > 0.5))
      && RECIPROCITY_STRUCTURAL_TEST.optimalCoefficients.fracSignMatchesMinusMu === 1 && Math.abs(RECIPROCITY_STRUCTURAL_TEST.optimalCoefficients.moebiusTaperOverOptimal500 - 13.34) < 0.05
      && RECIPROCITY_STRUCTURAL_TEST.optimalCoefficients.meanRatioKle50 > 0.6 && RECIPROCITY_STRUCTURAL_TEST.optimalCoefficients.meanRatioKgt400 < 0.3,
    why: 'G⁻¹b is a Möbius mollifier (100% sign agreement with −μ on squarefree k, |c| < 0.1 on non-squarefree k) with an optimised taper; the BCF-optimal linear taper is 13.3× worse at N=500 (secondary terms) — NB optimal coefficients = Levinson–Conrey shape optimisation.',
  },
  {
    id: 'M-gram-is-rank4-plus-cotangent-matrix-and-cot-part-is-rigid',
    holds: () => { const s = GRAM_STRUCTURE.smoothSingularValues; return s[4] / s[0] < 1e-13 && s[3] / s[0] > 1e-3
      && GRAM_STRUCTURE.cotPart.negativeEigenvalues.length === 2 && Math.abs(GRAM_STRUCTURE.cotPart.nextEigenvalues[0] - NB_DISTANCE_LADDER.spectrum500.smallest[0]) < 1e-10
      && GRAM_STRUCTURE.cotScaling[1][2] > GRAM_STRUCTURE.cotScaling[0][2] && GRAM_STRUCTURE.cotScaling[2][2] < 0 && GRAM_STRUCTURE.cotScaling[3][1] === false; },
    why: 'The log/constant part of Vasyunin’s formula is EXACTLY rank 4 (5th singular value 4.6e-14 of 53); the cotangent matrix carries every other eigenvalue of G (2 negative, rest identical to 1e-11). Scaling it by 0.99 makes 1 − bᵀG⁻¹b negative: the modular data is rigid at 1% — no smooth surrogate can stand in for it.',
  },
  {
    id: 'M-small-eigenvalues-are-dilation-crowding-not-zeros',
    holds: () => Math.abs(GRAM_STRUCTURE.lambdaMinLaw.exponent250to500 - 1.92) < 0.05
      && GRAM_STRUCTURE.lambdaMinLaw.vsChiGram.every(([N, lc, lz, r]) => Math.abs(r - lz / lc) < 1e-9 && r > 3 && r < 6)
      && (() => { const v = GRAM_STRUCTURE.lambdaMinLaw.vsChiGram; const e = Math.log(v[0][1] / v[3][1]) / Math.log(10); return e > 1.9 && e < 2.2; })()
      && NB_DISTANCE_LADDER.spectrum500.countBelow1e3 === 425,
    why: 'λ_min(G_N) ∝ N^{−1.92} and the zero-free Gram [1/max(h,k)] of the dilates of χ follows the same law (ratio 3.7–5.3): 425 of 500 eigenvalues lie below 1e-3 for uncertainty-principle reasons; the zeros act on b, not on the spectrum floor.',
  },
  {
    id: 'M-bettin-conrey-reciprocity-transcription-verified',
    holds: () => {
      const g = RECIPROCITY.goldenConvergents;
      const recomputed = g.slice(0, 11).every(([h, k, c, R]) => Math.abs(bettinConreyC0(h, k) - c) < 2e-6 && Math.abs(reciprocityR(h, k) - R) < 2e-9);
      const smooth = g.slice(6).every(([, , , , dk2]) => Math.abs(Math.abs(dk2) - 0.164762) < 4e-4) && g.slice(6).every(([, , , , dk2], i, A) => i === 0 || Math.sign(dk2) !== Math.sign(A[i - 1][4]));
      const grows = g.slice(8).every(([, k, c]) => Math.abs(c) / k > 0.035 && Math.abs(c) / k < 0.04);
      // dk = (R − lead)·k was formed in mpmath (30 digits); re-forming it from the baked double R loses ~3e-15·R·k.
      // Four Bernoulli terms: (2/π)ζ(n)B_n/n for n = 2,4,6,8 → π/36, −π³/5400, π⁵/119070, −π⁷/1134000; the n=10 tail is 4.8e-3/k⁸.
      const sz = RECIPROCITY.smallZ.every(([k, R, lead, dk]) => Math.abs(lead - (k / Math.PI) * (Math.log(k / (2 * Math.PI)) + GAMMA_E)) < 1e-9 && Math.abs(dk - (R - lead) * k) < 3e-15 * R * k + 1e-12
        && Math.abs(dk - (Math.PI / 36 - Math.PI ** 3 / (5400 * k * k) + Math.PI ** 5 / (119070 * k ** 4) - Math.PI ** 7 / (1134000 * k ** 6))) < 1e-2 / k ** 8 + 1e-12);
      return recomputed && smooth && grows && sz && Math.abs(reciprocityR(1, 1) + 1 / Math.PI) < 1e-15;
    },
    why: 'c₀(h/k) + (k/h)c₀(k/h) − 1/(πh) = (i/2)ψ(h/k): recomputed in JS for 11 golden convergents; ΔR·k² → ±0.164762 (R differentiable) while |c₀|/k → 0.0375 (c₀ itself is not); R(1/k) = (k/π)(log(k/2π)+γ) + π/(36k) − π³/(5400k³) + O(k⁻⁵) matches BC’s expansion with ζ(n)B_n coefficients; R(1) = −1/π.',
  },
  {
    id: 'M-period-function-truncations-destroy-positivity',
    holds: () => {
      const d = RECIPROCITY_STRUCTURAL_TEST.depthRows;
      const firstPD = d.find((r) => r[1])[0];
      const indefiniteBelow = d.filter((r) => r[0] < firstPD).every((r) => r[2] < 0 && r[3] >= 7);
      const nearlyExactStillIndefinite = d.find((r) => r[0] === 9)[5] > 0.999 && d.find((r) => r[0] === 9)[4] < 1.3e-3 && d.find((r) => r[0] === 9)[3] === 7;
      const monotoneFrob = d.every((r, i) => i === 0 || r[4] <= d[i - 1][4] + 1e-12);
      const s = RECIPROCITY_STRUCTURAL_TEST.surrogate;
      return firstPD === 10 && indefiniteBelow && nearlyExactStillIndefinite && monotoneFrob && s.gramRelFrobenius < 1e-3 && s.gramNegativeEigs === 19 && s.gramLambdaMin < 0
        && Math.abs(s.maxRelErr - 0.0704) < 1e-3;
    },
    why: 'Every Euclid-depth truncation D < 10 of the reciprocity descent leaves G^{(D)} indefinite (D=9: 99.92% exact entries, rel-Frobenius 1.2e-3, 7 negative eigenvalues); the 2-term period-function surrogate (7% max rel err on R, 7.9e-4 on G) has 19 negative eigenvalues. The reciprocity describes entries at 1e-3 relative accuracy; positivity needs 1e-6.',
  },
  {
    id: 'M-residual-pinned-at-zeros-with-1-over-logN-width',
    holds: () => { const m = RECIPROCITY_STRUCTURAL_TEST.mellinResidual; return m.atZeroNormalizedErr < 1e-13 && m.midpointNormalizedMedian < 0.1 && m.midpointNormalizedMax < 1 && m.fracCaptured > 0.9 && m.fracCaptured < 1
      && Math.abs(m.dN2OverC - m.dN2 / C_BURNOL) < 1e-9 && Math.abs(m.oneOverLogN - 1 / Math.log(500)) < 1e-12 && Math.abs(m.dN2OverC / m.oneOverLogN - 1) < 0.003 && m.zerosBelowT === 110 && m.fracNear > 0.7; },
    why: '|1+ζD_N|² = 1 at each zero (forced), ~0.08 between; 91% of d_N² lies below |t| = 400; d_N²/Σ|ρ|⁻² = 1/log N to 0.2%: the NB distance is the mollifier’s resolution-limited spike at each zero — Burnol’s mechanism, no modular input.',
  },
  {
    id: 'M-honest-collapse-verdict-no-qed',
    holds: () => /COLLAPSES/.test(ROUTE_M_VERDICT.status) && /RH open/.test(ROUTE_M_VERDICT.status) && /NO QED/.test(ROUTE_M_VERDICT.status) && /no partial escape/.test(ROUTE_M_VERDICT.status)
      && ROUTE_M_VERDICT.collapseChain.length === 6 && ROUTE_M_VERDICT.collapseChain.every((s) => s.evidence.length > 20)
      && /functional equation/.test(ROUTE_M_VERDICT.collapseChain[2].claim) && /Estermann/.test(ROUTE_M_VERDICT.collapseChain[1].claim)
      && /RH itself/.test(ROUTE_M_VERDICT.preciseWall) && /none for RH/.test(ROUTE_M_VERDICT.nextStep) && /NO QED/.test(ROUTE_M_VERDICT.honest)
      && RH_ROUTE_M.status === ROUTE_M_VERDICT.status,
    why: 'No false QED: the modular reciprocity is identified (with its own authors’ proof) as the functional equation of ζ via Estermann; the deliverable is the exact Gram, its ladder on the Burnol floor, the rank-4 + cotangent identity, and the negative structural test.',
  },
]);

export default RH_ROUTE_M;
