/**
 * @fileoverview RH novel Route B — the ARITHMETIC FREEZE-FLOW H_{t,τ}: first test worked to a verdict.
 *
 * Question (roadmap src/data/rh-novel-routes-roadmap-2026-09-23.js, route B). The de Bruijn heat flow
 * H_t is flow-BLIND (src/data/flow-blindness-no-go.js): it never sees the primes, so no soft
 * hypothesis can force real zeros. Route B asks for the complementary flow: a second parameter τ
 * that couples the prime field, and a Hellmann–Feynman force dρ/dτ that is a CONFINING drift toward
 * σ = ½. This module (a) fixes the two-parameter family, (b) derives the force for every coupling
 * type, (c) computes it on the first 50 zeros and on genuine OFF-LINE zeros, (d) gives the verdict.
 *
 * ── Definition (the two-parameter deformation) ──────────────────────────────────────────────────
 *   Ξ(z) = ξ(½ + iz) = ∫ Φ(u) e^{izu} du,   Φ(u) = Σ_{n≥1} φ_n(u),
 *   φ_n(u) = (2π²n⁴e^{9u/2} − 3πn²e^{5u/2}) exp(−πn²e^{2u})            (Riemann's theta profile).
 *   Term-wise transform (s = ½ + iz):   ∫ φ_n(u) e^{izu} du = ¼ γ(s) n^{−s},  γ(s) = s(s−1)π^{−s/2}Γ(s/2),
 *   so the theta modes n ARE the Dirichlet coefficients: freezing mode n = freezing the coefficient
 *   a_n = 1. Functional-equation + reality preserving freeze of a set S of coefficients:
 *   ψ_S = Σ_{n∈S} (even part of φ_n),   Ψ_S(z) = ⅛ Σ_{n∈S} [γ(s) n^{−s} + γ(1−s) n^{s−1}]   (entire, real on ℝ).
 *   H_{t,τ}(z) := ∫ e^{tu²} [Φ(u) − τ ψ_S(u)] e^{izu} du  =  H_t(z) − τ Ψ_{S,t}(z).
 *   t = heat time (soft, de Bruijn), τ = arithmetic freeze (τ = 1 removes the coefficients in S).
 *   Force at a simple zero z_k (implicit-function / Hellmann–Feynman):
 *        ∂_t z_k = Σ_{j≠k} 2/(z_k − z_j)            (heat: Coulomb repulsion of the other zeros),
 *        ∂_τ z_k = Ψ_{S,t}(z_k) / H_t'(z_k)          (arithmetic: prime/coefficient field over the local slope).
 *
 * ── Lemma M (multiplicative couplings are inert or a translation) ───────────────────────────────
 *   For ξ_τ = ξ·(1 + τF) with F meromorphic and at most a simple pole at a zero ρ:
 *     F holomorphic at ρ  ⇒  dρ/dτ = −F(ρ)ξ(ρ)/ξ'(ρ) = 0                                 (INERT);
 *     F = c·ξ'/ξ + holomorphic  ⇒  dρ/dτ = −c                                            (TRANSLATION).
 *   Consequences (all measured at ρ₁, mpmath dps 30):
 *     (M1) Euler/Beurling factor  ζ·(1−p^{−s})/(1−λ_p p^{−s})  (finite set of p, |λ_p| ≤ 1): the factor is
 *          nonvanishing in σ > 0, zeros unchanged — root shift 7.8e-31. A finite-prime "octave freeze" of the
 *          Euler product moves NOTHING; finite Euler products have no zeros at all (zeros are a collective
 *          effect of all primes through analytic continuation).
 *     (M2) Log-derivative (Λ-field) coupling  ζ·(1 + τ Σ Λ(n)n^{−s}) = ζ − τζ':  dρ/dτ = +1 exactly
 *          (measured 0.99996 at τ = 1e-4; the O(τ) remainder is second order). The prime field Σ Λ(n)n^{−s}
 *          coupled multiplicatively is the GENERATOR OF TRANSLATIONS: every zero drifts horizontally at the
 *          same rate, independent of σ — not confining, and it breaks ξ(s) = ξ(1−s).
 *     (M3) FE-symmetrized Λ-coupling  ξ·[1 + τ(F(s) + F(1−s))], F = −ζ'/ζ:  force 0 (measured 7.8e-27);
 *          FE-odd combination F(s) − F(1−s): force 2 (measured 2.000000004) = rigid translation.
 *   So no multiplicative prime coupling (Euler product, Beurling λ_p, RG octave freeze, Λ-field) exerts a
 *   confining force. Zeros can only be moved ADDITIVELY — by deforming the Dirichlet coefficients.
 *
 * ── Lemma A (the additive freeze force is a Riemann–Siegel partial sum) ────────────────────────
 *   With P(x) = ½(¼+x²)π^{−¼}|Γ(¼+ix/2)| > 0 and Hardy's Z:  Ξ(x) = −P(x)Z(x),
 *   Ψ_S(x) = −½P(x)·Z_S(x),   Z_S(x) := Σ_{n∈S} n^{−½} cos(ϑ(x) − x log n)     (ϑ = Riemann–Siegel theta).
 *   Hence at a zero γ_k:      dγ_k/dτ = Z_S(γ_k) / (2 Z'(γ_k)).
 *   Verified on the first 50 zeros × 10 coefficient sets: max relative discrepancy 1.6e-27 between the direct
 *   Ψ_S/Ξ' and the RS form. The force is REAL (|Im|/|Re| ≤ 9e-47): on-line zeros move ALONG the line.
 *   (This is why any FE/reality-preserving deformation has "σ = ½ as an exact fixed point" — an open-condition
 *   triviality shared by every real-on-ℝ pencil, not evidence of confinement. It resolves imp-95999's
 *   B-STABILITY-SIGN sub-gap by reformulation: the stability of the line can only be read on OFF-LINE
 *   configurations, and the regularized additive Λ-field source, made FE-symmetric, is Lemma M3 — force 0.)
 *
 * ── Test 1 (tangential force, first 50 zeros) ───────────────────────────────────────────────────
 *   For every set S (n=1; p=2,3,5,7; octaves [2,3],[4,7],[8,15],[16,31]; primes ≤ 31) the force
 *   alternates in sign (23–27 of 50 each sign), |force| ≤ 0.63, and the gap rates
 *   dγ_{k+1}/dτ − dγ_k/dτ are mixed (19–28 positive of 49). No monotone rearrangement.
 *
 * ── Test 2 (normal force on GENUINE off-line zeros) ────────────────────────────────────────────
 *   H_t at t < 0 is the forward heat semigroup e^{|t|∂²}Ξ (exact Gaussian convolution), and by Rodgers–Tao
 *   has non-real zeros; at t = −0.3, −0.6, −1.2 the tight low pairs are already complex. On each such zero
 *   z (Im z > 0) the heat force ∂_t Im z is NEGATIVE at every sample (control: the soft flow confines), while
 *   the arithmetic force Im ∂_τ z has NO universal sign for ANY coefficient set (offLine.confiningCounts, 17
 *   samples): n=1 is anti-confining at 15/17 (a low-height tendency, reversed in the height-117 cluster),
 *   primes ≤ 31 confining at 14/17, p=2 / p=3 / octave [4,7] flip between pairs. The soft force is signed
 *   because it is self-referential (H''/H'); the arithmetic force is a Riemann–Siegel-type phase sum.
 *
 * ── Lemma H (global confinement of a pencil = interlacing = RH-encoding) ─────────────────────────
 *   Hermite–Kakeya–Obreschkoff: Ξ − τΨ is real-rooted for ALL τ ∈ ℝ iff the zeros of Ξ and Ψ interlace.
 *   Interlacing presupposes Ξ real-rooted, i.e. RH. So an additive arithmetic pencil that is confining
 *   along its whole τ-range does not bypass RH, it CONTAINS it (τ = 0 is ζ). For the n=1 freeze the real
 *   zeros of Ψ₁ are the points ϑ(x) ≡ π/2 (mod π) ("half-Gram" lattice): interlacing with the ζ-zeros fails
 *   at the FIRST pair (interval (20.654, 25.492) holds γ₂ and γ₃; 167 of 302 intervals up to γ₃₀₀ violate).
 *   Validation of the census: the classical Gram points ϑ ≡ 0 reproduce the known first Gram-law failure at
 *   g₁₂₅/g₁₂₆ (t = 280.80, 282.45); 16 of 302 intervals violate.
 *
 * ── The mean-field pencil (the one structured lead, and why it runs the wrong way) ─────────────
 *   Since 2Ψ₁ = −P·cos ϑ is the Riemann–Siegel main term, "freeze n=1" is, up to scaling, "amplify the
 *   arithmetic terms n ≥ 2". The majority sign in Test 2 (freeze n=1 ⇒ anti-confining at 15/17) reads: the
 *   arithmetic terms n ≥ 2 are what CLUSTER the zeros (they create the tight pairs that the backward heat
 *   flow turns complex); damping them toward the regular half-Gram lattice tends to separate pairs — a
 *   tendency, not a law (it reverses in the height-117 cluster). Taken as a pencil it defines an
 *   arithmetic analogue of the de Bruijn–Newman set-up, Ξ_τ = (1−τ)Ξ + 2τΨ₁, τ ∈ [0,1], with a trivially
 *   regular endpoint — and, exactly as for H_t, the confining direction points AWAY from ζ (toward the
 *   mean field), so it cannot propagate real-rootedness back to τ = 0. See MEAN_FIELD_PENCIL for the
 *   [0,1] real-zero count on the first 50 zeros.
 *
 * ── Verdict ─────────────────────────────────────────────────────────────────────────────────────
 *   NEGATIVE for Route B as posed. (i) Every prime-field coupling that is multiplicative (Euler product,
 *   Beurling, RG octave freeze, Λ-field) has force 0 or a rigid translation — provably. (ii) The couplings
 *   that move zeros are additive coefficient deformations; their on-line force is tangential and equals a
 *   Riemann–Siegel partial sum over Z'; on off-line zeros the normal force has no universal sign for any S.
 *   (iii) The one majority tendency (damping n ≥ 2 separates pairs) confines toward the mean-field lattice,
 *   away from ζ — the de Bruijn trap again — and is not even universal. (iv) Any additive pencil confining on its whole τ-range is an
 *   interlacing statement, which presupposes RH. A provable confining ARITHMETIC drift would be an
 *   arithmetic positivity statement of Weil type — the input the no-go says is needed, not a way around it.
 *   NOT a bound; no refereed bound is changed; RH open; NO QED.
 *
 * Reproduction: tmp/route-b-freeze-flow-force.py (Lemma M, Test 1, census), tmp/route-b-negative-t-normal-force.py
 * (Test 2), tmp/route-b-meanfield-pencil.py (mean-field pencil). Import-light: literals baked, no zeros bundle.
 */

export const ROUTE_B_FREEZE_FLOW = Object.freeze({
  id: 'rh-route-b-arithmetic-freeze-flow',
  date: '2026-09-23',
  route: 'B',
  status: 'FIRST TEST DONE — VERDICT NEGATIVE (no confining arithmetic drift in the multiplicative or '
    + 'additive-coefficient class; pencil confinement = interlacing = RH-encoding); no refereed bound is changed; RH open; NO QED',

  deformation: {
    family: 'H_{t,τ}(z) = ∫ e^{tu²}[Φ(u) − τ ψ_S(u)] e^{izu} du = H_t(z) − τ Ψ_{S,t}(z)',
    modes: 'φ_n(u) = (2π²n⁴e^{9u/2} − 3πn²e^{5u/2})exp(−πn²e^{2u});  ∫φ_n e^{izu}du = ¼γ(s)n^{−s}, s=½+iz',
    freezeSource: 'Ψ_S(z) = ⅛ Σ_{n∈S}[γ(s)n^{−s} + γ(1−s)n^{s−1}]  (even part of the theta modes; FE- and reality-preserving)',
    heatForce: '∂_t z_k = Σ_{j≠k} 2/(z_k − z_j)',
    arithmeticForce: '∂_τ z_k = Ψ_{S,t}(z_k)/H_t\'(z_k);  at t=0 on the line: dγ_k/dτ = Z_S(γ_k)/(2Z\'(γ_k))',
  },

  // Lemma M numerics at ρ₁ (mpmath, dps 30).
  multiplicative: {
    eulerFactorRootShift: 7.8e-31,            // ζ(s)(1−2^{−s})/(1−0.3·2^{−s}): same zero
    logDerivativeForce: [0.9999594747, -8.2e-6], // (ζ − τζ') root shift / τ at τ=1e-4 → 1 (translation)
    feSymmetrizedLambdaForce: 7.8e-27,        // ξ[1 + τ(F(s)+F(1−s))], F=−ζ'/ζ: zero force
    feOddLambdaForce: [2.000000004, -3.3e-5], // ξ[1 + τ(F(s)−F(1−s))]: rigid translation, rate 2
    statement: 'ξ·(1+τF): F holomorphic at ρ ⇒ force 0; F = c ξ\'/ξ + hol ⇒ force −c. Euler/Beurling/RG '
      + 'octave freezes are inert; the Λ-field is the translation generator; its FE-even part has zero force.',
  },

  // Lemma A + Test 1: tangential force dγ_k/dτ on the first 50 zeros (6 sig figs), t = 0.
  rsIdentityMaxRelErr: 1.6e-27,
  forceMaxImagOverReal: 8.9e-47,

  // imp-96027: CROSS-VALIDATE Lemma A independently on HIGHER zeros and NEW coefficient sets.
  // Re-derive dγ_k/dτ = Ψ_S(γ_k)/Ξ'(γ_k) both directly and as the RS partial sum Z_S(γ_k)/(2Z'(γ_k))
  // on the zero blocks γ₅₁..γ₁₀₀ (heights 146.0–236.5) and γ₂₀₀..γ₂₀₉ (heights 396.4–410.5), across 8
  // coefficient sets that do NOT overlap the original 10 in character (squares, a lone composite, powers
  // of 2, high primes 37–97, all n≤10, octave [32,63], {1,2}, triangular). Every set on every block agrees
  // to 6.5e-27 (direct vs RS) and the force is REAL to 6.7e-47 — confirming the identity and reality are not
  // artifacts of the first-50 window. Measurement only; changes no bound; NO QED. Repro:
  // tmp/route-b-lemmaA-crossvalidate.py, mpmath dps 30.
  lemmaACrossValidation: {
    setsTested: 8,
    zerosTested: 60,
    globalMaxRelErr: 6.5e-27,
    globalMaxImagOverReal: 6.7e-47,
    newCoefficientSets: {
      squares_le_9: [1, 4, 9], composite6: [6], powers_of_2: [2, 4, 8, 16],
      primes_37_97: [37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97],
      all_le_10: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], oct5: '[32,63]', n1_plus_p2: [1, 2], triangular: [1, 3, 6, 10],
    },
    blocks: {
      zeros_51_100: { kRange: [51, 100], gammaRange: [146.0009824867655, 236.5242296658162], maxRelErr: 6.493947904485845e-27, maxImagOverReal: 6.67437528773996e-47 },
      zeros_200_209: { kRange: [200, 209], gammaRange: [396.3818542225922, 410.51386919336665], maxRelErr: 2.7698953519563178e-27, maxImagOverReal: 2.7290272871214016e-70 },
    },
    reading: 'The additive-freeze force identity dγ_k/dτ = Z_S(γ_k)/(2Z\'(γ_k)) and the reality of the on-line '
      + 'force reproduce independently on zeros 51–100 and 200–209 (heights up to ~410) across 8 fresh '
      + 'coefficient sets, at the same 1e-27 / 1e-47 levels as the first-50 census. Lemma A is height- and '
      + 'set-robust; it remains a tangential (RH-blind) drift. Measurement only; changes no bound; NO QED.',
  },
  zeros: [14.134725, 21.02204, 25.010858, 30.424876, 32.935062, 37.586178, 40.918719, 43.327073, 48.005151,
    49.773832, 52.970321, 56.446248, 59.347044, 60.831779, 65.112544, 67.079811, 69.546402, 72.067158,
    75.704691, 77.144840, 79.337375, 82.910381, 84.735493, 87.425275, 88.809111, 92.491899, 94.651344,
    95.870634, 98.831194, 101.317851, 103.725538, 105.446623, 107.168611, 111.029536, 111.874659,
    114.320221, 116.226680, 118.790783, 121.370125, 122.946829, 124.256819, 127.516684, 129.578704,
    131.087689, 133.497737, 134.756510, 138.116042, 139.736209, 141.123707, 143.111846],
  force: {
    n1: [-0.0991092, 0.0962276, -0.119588, 0.196296, -0.196454, 0.0747993, 0.0681548, -0.164159, 0.23973, -0.161615, -0.0529881, 0.0742264, 0.152515, -0.258657, 0.151234, -0.0175624, -0.0591112, -0.0578928, 0.234966, -0.118306, -0.126267, 0.122513, -0.0180401, 0.0821726, -0.195031, 0.114529, 0.171948, -0.240216, -0.00503565, 0.0414405, 0.107402, -0.0627491, -0.135746, 0.310958, -0.176607, -0.0213357, -0.0736168, 0.0174273, 0.156169, -0.000967126, -0.200691, 0.0664472, 0.106223, -0.0703708, 0.0428987, -0.150974, 0.134106, 0.102359, -0.141628, -0.0806795],
    p2: [0.225551, -0.303927, 0.238221, -0.268814, 0.252577, -0.106986, -0.0275105, 0.129725, -0.190689, 0.101496, 0.096379, -0.130776, -0.0361832, 0.151828, -0.0581891, -0.106137, 0.157551, -0.00453562, -0.186477, 0.0984127, 0.0986458, -0.029525, -0.125845, 0.112161, 0.0417718, -0.0584024, -0.187185, 0.20668, 0.0546942, -0.0840959, -0.121886, 0.165592, 0.0201626, -0.0302859, -0.122855, 0.100548, 0.067885, -0.045359, -0.153614, 0.0883597, 0.091544, 0.011423, -0.146531, 0.0136143, 0.145542, -0.0219364, -0.0512439, -0.154864, 0.150962, 0.0595473],
    p3: [-0.00782685, 0.196253, -0.0939603, -0.220303, 0.168939, 0.0234582, -0.134384, 0.141834, -0.183852, 0.200131, -0.112372, 0.11265, -0.19424, 0.166025, -0.125743, 0.161455, -0.126021, 0.0811099, -0.0775214, 0.0549949, 0.00814924, -0.0723862, 0.117663, -0.159915, 0.123204, -0.0304525, -0.0428065, 0.0875064, -0.0799906, 0.0810808, -0.0484779, -0.0240294, 0.0623598, -0.167292, 0.164308, -0.00439338, -0.0552815, 0.0742532, -0.0702574, -0.00269768, 0.0626633, -0.0708279, 0.0550991, 0.0205819, -0.117081, 0.101097, 0.00654595, -0.114933, 0.141642, -0.0549372],
    oct1: [0.217724, -0.107675, 0.144261, -0.489116, 0.421516, -0.0835274, -0.161894, 0.271559, -0.374541, 0.301627, -0.0159926, -0.0181261, -0.230423, 0.317852, -0.183932, 0.0553177, 0.0315301, 0.0765743, -0.263999, 0.153408, 0.106795, -0.101911, -0.00818268, -0.0477538, 0.164976, -0.0888549, -0.229991, 0.294186, -0.0252964, -0.00301518, -0.170364, 0.141562, 0.0825224, -0.197577, 0.041453, 0.0961546, 0.0126035, 0.0288942, -0.223871, 0.085662, 0.154207, -0.0594049, -0.0914317, 0.0341962, 0.0284611, 0.0791607, -0.0446979, -0.269796, 0.292603, 0.00461006],
    oct2: [-0.249296, -0.00720514, 0.0328506, 0.26364, -0.260344, 0.0742176, 0.158263, -0.0151868, -0.00108806, -0.0726753, 0.0679143, -0.17618, -0.155578, 0.218176, -0.126944, 0.0287528, 0.11357, 0.028111, -0.236819, 0.0544853, 0.176455, -0.102592, 0.0411022, -0.183135, 0.237108, -0.107399, -0.0165577, 0.0743143, -0.0100579, -0.0345614, 0.0785313, -0.134871, 0.138056, -0.443514, 0.500322, -0.162166, 0.0467914, -0.00124153, 0.0828816, -0.226216, 0.189281, -0.0707484, -0.0155054, 0.118375, -0.23174, 0.206155, -0.167034, 0.268556, -0.230649, 0.124766],
    oct3: [0.190492, 0.0758159, 0.00518014, 0.0509418, -0.0157427, -0.0864176, -0.0457903, -0.0571131, 0.150598, -0.0556085, 0.0161714, 0.0952474, 0.255452, -0.288412, 0.151431, -0.0751604, -0.114387, -0.0752806, 0.306051, -0.097066, -0.156116, 0.120543, 0.0457527, 0.199701, -0.135339, 0.0578789, 0.0258346, -0.00897444, 0.0379346, -0.0455178, -0.123353, 0.0513979, 0.00305006, 0.0205507, -0.266915, 0.0709256, 0.0761304, -0.073347, -0.191594, 0.172859, 0.087578, 0.0152185, -0.0757931, -0.0117874, 0.111162, -0.00636903, -0.0731403, -0.233203, 0.236672, 0.0482243],
    oct4: [0.00581822, -0.176448, -0.0421182, -0.0744608, 0.0792815, -0.0131742, -0.0643425, -0.00488372, -0.00829735, -0.0486577, 0.00196944, 0.0471203, -0.061278, -0.0188741, -0.00709236, 0.0245217, 0.0312868, 0.0170433, -0.0630341, -0.020628, -0.00838722, -0.0536277, -0.0810793, -0.0267194, -0.0531509, 0.0163936, 0.0718033, -0.112122, 0.000545158, 0.0298175, 0.122711, 0.026811, -0.0728323, 0.307834, -0.131571, 0.0210573, -0.0500856, 0.0314362, 0.155882, -0.06197, -0.248718, 0.0599706, 0.0958402, -0.0490265, 0.0456429, -0.117957, 0.143665, 0.117804, -0.180377, -0.102479],
    primes_le_31: [0.525516, -0.320318, 0.26585, -0.626462, 0.521061, -0.0320917, -0.139598, 0.379997, -0.477653, 0.332433, 0.0406273, -0.199709, -0.303436, 0.526313, -0.20827, 0.00941637, 0.16402, 0.110879, -0.415304, 0.281384, 0.153619, -0.176044, -0.11767, -0.0767766, 0.313399, -0.104849, -0.467581, 0.472319, -0.0765533, -0.0568348, -0.123574, 0.203476, 0.122469, -0.560178, 0.533405, 0.0658178, 0.0160439, 0.0402449, -0.264378, -0.063024, 0.185912, -0.0281437, -0.143431, 0.104283, -0.104213, 0.145475, -0.0850282, -0.282317, 0.369374, 0.0896268],
  },
  forceSignCounts: { n1: [23, 27], p2: [25, 25], p3: [24, 26], oct1: [26, 24], oct2: [24, 26], oct3: [27, 23], oct4: [22, 28], primes_le_31: [25, 25] },
  gapRateSignCounts: { n1: [26, 23], p2: [19, 30], p3: [22, 27], oct1: [21, 28], oct2: [28, 21], oct3: [21, 28], oct4: [26, 23], primes_le_31: [21, 28] },

  // Diagnostic only: first-order rate of the local quadratic discriminant D = −2Ξ/Ξ'' at the 49 inter-zero
  // extrema, for Ξ − τΨ_S. The HEAT control is itself mixed (28 pos / 21 neg): individual gaps do shrink
  // under the real-rootedness-preserving heat flow, so a per-extremum discriminant sign is NOT a confinement
  // certificate for any flow. Recorded to prevent re-use of this criterion.
  discriminantCensus: { heat: [28, 21], n1: [21, 28], p2: [24, 25], p3: [29, 20], p5: [25, 24], p7: [28, 21], oct1: [27, 22], oct2: [29, 20], oct3: [22, 27], oct4: [20, 29], primes_le_31: [26, 23] },

  // Test 2: genuine off-line zeros of H_t (t<0) and the normal force. Im z > 0 taken; confining ⟺ Im(∂z) < 0.
  offLine: {
    convention: 'H_t, t<0, = e^{|t|∂²}Ξ (Gaussian convolution, exact); zero z with Im z>0; heatDImz = Im(H_t\'\'/H_t\') = ∂_t Im z; dImz[S] = Im(Ψ_{S,t}(z)/H_t\'(z)) = ∂_τ Im z for the freeze Ξ−τΨ_S; confining ⟺ negative',
    sampleCount: 17,
    confiningCounts: { n1: [2, 15], p2: [8, 9], p3: [15, 2], oct2: [11, 6], primes_le_31: [14, 3] },  // [confining, anti-confining] per set over all samples
    heatConfiningCount: 17,
    samples: [
      { t: -1.2, pair: [3, 4], z: [33.4051, 0.6659], heatDImz: -1.651, dImz: { n1: 0.6596, p2: -0.8768, p3: -0.646, oct2: 0.918, primes_le_31: -1.209 } },
      { t: -1.2, pair: [7, 8], z: [43.6363, 0.6397], heatDImz: -1.781, dImz: { n1: 0.5034, p2: -0.3333, p3: -0.6136, oct2: 0.3638, primes_le_31: -0.5681 } },
      { t: -1.2, pair: [14, 15], z: [68.4601, 1.1753], heatDImz: -1.518, dImz: { n1: 0.2689, p2: 0.067, p3: -0.4455, oct2: -0.2491, primes_le_31: -0.2251 } },
      { t: -1.2, pair: [33, 34], z: [116.8311, 1.0149], heatDImz: -1.5, dImz: { n1: 0.1411, p2: 0.1128, p3: 0.1154, oct2: -0.6016, primes_le_31: 0.1231 } },
      { t: -1.2, pair: [37, 38], z: [117.7968, 0.3598], heatDImz: -4.209, dImz: { n1: -0.1828, p2: 1.3281, p3: -1.6527, oct2: 1.6664, primes_le_31: 0.6605 } },
      { t: -1.2, pair: [34, 35], z: [117.8698, 0.3305], heatDImz: -4.175, dImz: { n1: -0.3212, p2: 1.526, p3: -2.107, oct2: 2.5942, primes_le_31: 0.7808 } },
      { t: -0.6, pair: [8, 9], z: [49.8839, 0.5244], heatDImz: -2.114, dImz: { n1: 0.5483, p2: -0.3971, p3: -0.5305, oct2: 0.0989, primes_le_31: -1.0432 } },
      { t: -0.6, pair: [13, 14], z: [60.8276, 0.8], heatDImz: -1.637, dImz: { n1: 0.3429, p2: -0.1569, p3: -0.3003, oct2: -0.3115, primes_le_31: -0.6556 } },
      { t: -0.6, pair: [19, 20], z: [77.5914, 0.8351], heatDImz: -1.834, dImz: { n1: 0.3552, p2: -0.286, p3: -0.1322, oct2: -0.2957, primes_le_31: -0.6829 } },
      { t: -0.6, pair: [21, 22], z: [84.9106, 0.1958], heatDImz: -5.217, dImz: { n1: 0.6923, p2: 0.5009, p3: -0.9577, oct2: -0.7382, primes_le_31: -0.2402 } },
      { t: -0.6, pair: [24, 25], z: [88.8349, 0.8738], heatDImz: -1.66, dImz: { n1: 0.2312, p2: 0.0574, p3: -0.235, oct2: -0.3501, primes_le_31: -0.3285 } },
      { t: -0.6, pair: [23, 24], z: [95.9874, 1.0309], heatDImz: -1.851, dImz: { n1: 0.3273, p2: -0.3065, p3: -0.103, oct2: -0.0818, primes_le_31: -0.7181 } },
      { t: -0.6, pair: [43, 44], z: [131.2285, 0.6774], heatDImz: -2.109, dImz: { n1: 0.3046, p2: -0.274, p3: 0.061, oct2: -0.2388, primes_le_31: -0.4289 } },
      { t: -0.6, pair: [45, 46], z: [134.8058, 0.9761], heatDImz: -1.721, dImz: { n1: 0.1573, p2: 0.1367, p3: -0.1781, oct2: -0.3546, primes_le_31: -0.2016 } },
      { t: -0.6, pair: [48, 49], z: [141.3221, 0.0131], heatDImz: -0.375, dImz: { n1: 0.2249, p2: -0.4552, p3: -0.4448, oct2: 0.9844, primes_le_31: -0.9993 } },
      { t: -0.3, pair: [24, 25], z: [88.4831, 0.1683], heatDImz: -6.048, dImz: { n1: 0.8391, p2: 0.2234, p3: -0.8653, oct2: -1.2745, primes_le_31: -1.1852 } },
      { t: -0.3, pair: [45, 46], z: [134.4759, 0.3548], heatDImz: -3.097, dImz: { n1: 0.2833, p2: 0.2444, p3: -0.3181, oct2: -0.6411, primes_le_31: -0.3666 } },
    ],
    // imp-96028: ASSESS whether the height-117 n=1 sign reversal is a systematic height effect
    // or sampling. Cross-tabulation of the two reversed samples (sign(dImz.n1) < 0) against the
    // 15 anti-confining samples, over height / Im z / heat-force. Analysis only; no new zeros
    // generated, no bound changed, NO QED. Repro: tmp/imp-96028-assess.mjs.
    heightReversalAssessment: {
      reversedSamples: [
        { z: [117.7968, 0.3598], heatDImz: -4.209, t: -1.2, n1: -0.1828 },
        { z: [117.8698, 0.3305], heatDImz: -4.175, t: -1.2, n1: -0.3212 },
      ],
      // The two reversed pairs are a tightly-clustered adjacent doublet: heights differ by 0.073,
      // Im z by 0.03, heat force by 0.03, both at the deepest heat t=-1.2 -- effectively ONE local
      // event sampled twice, not two independent confirmations.
      clusterSpread: { dHeight: 0.073, dImz: 0.0293, dHeatDImz: 0.034, sharedT: -1.2 },
      // Systematic-law counter-tests (each FAILS a monotone predictor):
      counterTests: {
        notHeight: 'sample [33,34] at height 116.831 -- essentially the same height -- is anti-confining (n1 = +0.1411); all four samples ABOVE height 118 (131.23, 134.48, 134.81, 141.32) are anti-confining, so no monotone height threshold survives.',
        notSmallImz: 'the three smallest-Im-z samples (Im z = 0.0131, 0.1683, 0.1958) are all anti-confining; the reversed doublet (Im z = 0.33, 0.36) is not near the small-Im-z extreme.',
        notHeatForce: 'the two largest heat forces (heatDImz = -6.048 at h=88.48 and -5.217 at h=84.91) are both anti-confining; the reversed doublet ranks 3rd/4th by heat force.',
      },
      verdict: 'SAMPLING, not a systematic height effect. The reversal is a single localized adjacent-pair '
        + 'coincidence at height 117.8 / t=-1.2, and it is contradicted by an anti-confining sample at the same '
        + 'height (116.83) and by all four samples above height 118. No monotone predictor (height, Im z, or heat '
        + 'force) separates the reversed doublet from the 15 anti-confining samples. So the 15/17 anti-confining '
        + 'n=1 majority stands as a low-height TENDENCY with one local exception, not a law with a height crossover.',
      // Sub-gap: definitively settling systematic-vs-sampling needs a WIDER off-line-zero census
      // (many more t<0 zeros above height 118, plus a wider coefficient-set family evaluated at
      // each new zero). That requires re-running the heat-evolution generator with the zeros bundle,
      // which this import-light module cannot do -- literals for only 5 coefficient sets are baked.
      subGap: 'wider-offline-census: needs H_t (t<0) zeros above height 118 and dImz for a broader coefficient family, out of scope for the import-light module (heavy heat-evolution regeneration).',
    },
  },

  // Lemma H: interlacing census up to γ₃₀₀.
  interlacing: {
    halfGram: { intervals: 302, violations: 167, firstViolationInterval: [20.654044969, 25.491508215], holds: 'γ₂, γ₃ both inside' },
    classicalGram: { intervals: 302, violations: 16, firstViolationAt: [280.80242938, 282.45472082], literature: 'first Gram-law failure at g₁₂₆ ≈ 282.45 (Titchmarsh)' },
    statement: 'HKO: Ξ − τΨ real-rooted ∀τ ⟺ zeros interlace; interlacing presupposes RH. n=1 pencil fails at the first pair.',

    // imp-96021: half-Gram interlacing-violation fraction vs HEIGHT (fresh re-census over γ₁..γ₃₀₀,
    // 299 intervals; reproduces the baked aggregate 167/302 ≈ 0.55 to boundary indexing). The fraction
    // does NOT decay toward 0 with height — interlacing is never approached. Bands (lo, hi, intervals,
    // violations, fraction). Repro: tmp/route-b-interlacing-height-census.py.
    heightCensus: {
      aggregate: { intervals: 299, violations: 164, fraction: 0.5485 },
      bands: [
        [0, 100, 29, 21, 0.7241],
        [100, 200, 50, 28, 0.56],
        [200, 300, 58, 28, 0.4828],
        [300, 400, 64, 32, 0.5],
        [400, 560, 98, 55, 0.5612],
      ],
      reading: 'Violation fraction is height-flat near 0.55 (0.48–0.56 across the bands above γ=100); it does '
        + 'not trend toward 0, so the n=1 pencil is nowhere close to interlacing at any measured height.',
    },
    // Assessment: does any additive coefficient set S lower the violation fraction toward interlacing?
    // Real zeros of Ψ_S = real zeros of Z_S(x) = Σ_{n∈S} n^{−½} cos(ϑ(x) − x log n); census vs the ζ-zeros.
    // NO set lowers it: n=1 (half-Gram) is already the minimum; every added arithmetic term RAISES violations.
    coefficientSets: {
      base: 'S={1}',
      results: {
        'S={1}': { intervals: 299, violations: 164, fraction: 0.5485 },
        'S={2}': { intervals: 182, violations: 119, fraction: 0.6538 },
        'S={1,2}': { intervals: 298, violations: 216, fraction: 0.7248 },
        'S={1,2,3}': { intervals: 258, violations: 212, fraction: 0.8217 },
        'S=primes<=7': { intervals: 140, violations: 91, fraction: 0.65 },
        'S={1..5}': { intervals: 254, violations: 230, fraction: 0.9055 },
      },
      best: 'S={1}',
      reducesBelowBase: false,
      reading: 'No additive coefficient set moves the pencil toward interlacing: the least-violating lattice is '
        + 'the bare n=1 half-Gram set (0.5485); adding arithmetic terms (n≥2, primes) monotonically worsens it '
        + '(0.65–0.91). Confirms Lemma H — the additive freeze cannot be tuned to interlacing, so it is not a '
        + 'lever around RH. Measurement only; changes no bound; NO QED.',
    },
  },

  meanFieldPencil: {
    pencil: 'Ξ_τ = (1−τ)Ξ + 2τΨ₁, τ∈[0,1]; endpoint 2Ψ₁ = −P cos ϑ (Riemann–Siegel main term, half-Gram lattice)',
    psi1RealRooted: { boxZeroCount: 50, realZeroCount: 50, box: '[10,145]×[−6,6]', xiBoxZeroCount: 50, xiRealZeroCount: 50 },
    realZeroCountOnPath: { window: [10, 145], tauGrid: 0.05, xGrid: 0.05, counts: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50] },
    // imp-96023: extend the scan OFF the [0,1] leg to LOCATE where real-rootedness first breaks.
    // Xi_tau real-zero count on the first 50 (window [10,145], xGrid 0.05) over tau in [-2,3], step 0.1.
    extendedTauScan: {
      tauRange: [-2, 3], tauStep: 0.1, window: [10, 145], xGrid: 0.05,
      counts: [44, 44, 44, 46, 46, 46, 46, 46, 46, 48, 48, 48, 48, 48, 48, 50, 50, 50, 50, 50,
        50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 43, 33, 31, 25, 23, 21, 21,
        19, 17, 17, 17, 17, 17, 17, 17, 19, 18, 18],
      firstBreakBelowZero: { tau: -0.58, count: 48 },
      firstBreakAboveOne: { tau: 1.24, count: 48 },
      realRootedInterval: [-0.56, 1.22],
      reading: 'The full 50 real zeros survive across the whole confining leg [0,1] and slightly beyond, on '
        + 'tau in about (−0.56, 1.22). The FIRST break is OUTSIDE [0,1] on BOTH sides: at tau ≈ −0.58 the count '
        + 'drops to 48 (one pair goes complex; the anti-confining direction that amplifies arithmetic clustering '
        + 'while subtracting the lattice) and at tau ≈ +1.24 it drops to 48 (overshooting past the lattice). '
        + 'Degradation is monotone away from the segment (44 by tau=−2, 17 by tau≈2.4). This CONFIRMS the '
        + 'away-from-ζ reading: the pencil is real-rooted precisely on the segment joining ζ (tau=0) to the '
        + 'mean-field half-Gram lattice (tau=1), and loses real-rootedness the instant it leaves that segment — '
        + 'so no break occurs anywhere on the confining [0,1] leg and the flow carries no RH information back to tau=0.',
    },
    reading: 'No pair of the first 50 zeros goes complex along the mean-field pencil (sign-change count constant at 50 on a 0.05 grid). '
      + 'Consistent with the Test 2 majority: the τ>0 direction (toward the lattice) tends to confine. This is the arithmetic analogue of '
      + 'de Bruijn H_{1/2}: a trivially regular endpoint reached by a flow that confines AWAY from ζ, so it carries no '
      + 'RH information at τ=0 — the same trap that flow-blindness identifies for t. imp-96023: extending the scan off [0,1] '
      + 'locates the first real-rootedness break OUTSIDE the interval (tau ≈ −0.58 and ≈ +1.24), never on the confining leg — see extendedTauScan.',
  },

  nextTest:
    'The only structured signal is the mean-field direction (damping n ≥ 2 separates pairs), which points away '
    + 'from ζ. A usable lever needs the OPPOSITE: a Ψ with Ψ_t(z)/H_t\'(z) confining on every complex pair '
    + 'along a path that ENDS at ζ. In the pencil class this is interlacing (RH-strength). The honest next '
    + 'test is therefore not another coupling but the positivity statement itself: decide whether a '
    + 'bounded-support coefficient field w (LP feasibility over the tight pairs up to height T) can have '
    + 'Z_w·Z\'\' > 0 at every near-collision uniformly in T; expectation: feasible at fixed T, not uniformly '
    + '(it would be a Gram-law surrogate). Otherwise redirect the arithmetic input to Route D (Weil/Peierls).',

  references: [
    'B. Rodgers, T. Tao, The de Bruijn–Newman constant is non-negative, Forum Math. Pi 8 (2020).',
    'Hermite–Kakeya–Obreschkoff theorem (e.g. Rahman–Schmeisser, Analytic Theory of Polynomials, Thm 6.3.8).',
    'E. C. Titchmarsh, The Theory of the Riemann Zeta-Function, §10.6 (Gram\'s law and its failure).',
    'src/data/flow-blindness-no-go.js; src/data/imp-95999-route-b-hellmann-feynman-force.js.',
  ],
});

const F = ROUTE_B_FREEZE_FLOW;
const bothSigns = (arr) => arr.some((v) => v > 0) && arr.some((v) => v < 0);

export const ROUTE_B_FREEZE_FLOW_ASSERTIONS = Object.freeze([
  {
    id: 'route-b-multiplicative-couplings-inert-or-translation',
    holds: () => F.multiplicative.eulerFactorRootShift < 1e-20
      && Math.abs(F.multiplicative.logDerivativeForce[0] - 1) < 1e-3
      && F.multiplicative.feSymmetrizedLambdaForce < 1e-12
      && Math.abs(F.multiplicative.feOddLambdaForce[0] - 2) < 1e-3,
    why: 'Lemma M: Euler factor moves nothing; Λ-field = translation (rate 1); FE-even Λ-coupling has zero force; FE-odd rate 2.',
  },
  {
    id: 'route-b-force-is-riemann-siegel-partial-sum-and-tangential',
    holds: () => F.rsIdentityMaxRelErr < 1e-12 && F.forceMaxImagOverReal < 1e-12,
    why: 'Lemma A: dγ_k/dτ = Z_S(γ_k)/(2Z\'(γ_k)) to 1.6e-27; force real ⇒ on-line zeros move along the line.',
  },
  {
    id: 'route-b-lemma-a-cross-validated-higher-zeros-and-sets',
    holds: () => {
      const cv = F.lemmaACrossValidation;
      return cv.setsTested === 8 && cv.zerosTested === 60
        && cv.globalMaxRelErr < 1e-24 && cv.globalMaxImagOverReal < 1e-24
        && Object.values(cv.blocks).every((b) => b.maxRelErr < 1e-24 && b.maxImagOverReal < 1e-24)
        && cv.blocks.zeros_200_209.gammaRange[0] > 300;
    },
    why: 'imp-96027: Lemma A (dγ_k/dτ = Z_S/(2Z\') and force real) reproduces on zeros 51–100 and 200–209 across 8 new coefficient sets to 6.5e-27 / 6.7e-47 — height- and set-robust.',
  },
  {
    id: 'route-b-tangential-force-sign-indefinite-every-set',
    holds: () => Object.values(F.force).every((arr) => arr.length === 50 && bothSigns(arr)
      && arr.filter((v) => v > 0).length >= 15 && arr.filter((v) => v < 0).length >= 15)
      && Object.values(F.forceSignCounts).every(([p, n]) => p + n === 50),
    why: 'Test 1: no coefficient set gives a monotone drift on the first 50 zeros.',
  },
  {
    id: 'route-b-heat-control-confines-every-offline-sample',
    holds: () => F.offLine.samples.length >= 16 && F.offLine.samples.every((s) => s.z[1] > 0 && s.heatDImz < 0),
    why: 'Test 2 control: the soft heat force pushes every genuine complex zero toward the axis (Rodgers–Tao picture).',
  },
  {
    id: 'route-b-arithmetic-normal-force-no-universal-sign',
    holds: () => {
      const names = Object.keys(F.offLine.samples[0].dImz);
      const consistent = names.filter((k) => {
        const s = F.offLine.samples.map((x) => Math.sign(x.dImz[k]));
        return s.every((v) => v === s[0]);
      });
      return consistent.length === 0
        && names.every((k) => F.offLine.confiningCounts[k][0] + F.offLine.confiningCounts[k][1] === F.offLine.sampleCount)
        && F.offLine.samples.length === F.offLine.sampleCount;
    },
    why: 'Test 2: every coefficient set (n=1, p=2, p=3, octave [4,7], primes≤31) flips sign between complex pairs — no set confines universally.',
  },
  {
    id: 'route-b-mean-field-tendency-majority-not-law',
    holds: () => {
      const [c, a] = F.offLine.confiningCounts.n1;
      return a > c && c > 0 && F.meanFieldPencil.realZeroCountOnPath.counts.every((n) => n === 50)
        && F.meanFieldPencil.psi1RealRooted.boxZeroCount === F.meanFieldPencil.psi1RealRooted.realZeroCount;
    },
    why: 'Freezing n=1 (= amplifying the arithmetic terms toward ζ) is anti-confining in the majority but NOT all samples; the mean-field pencil keeps 50 real zeros on τ∈[0,1] and its endpoint Ψ₁ is real-rooted in the box — the confining direction points away from ζ.',
  },
  {
    id: 'route-b-interlacing-fails-and-gram-census-validated',
    holds: () => F.interlacing.halfGram.violations > 0
      && F.interlacing.halfGram.firstViolationInterval[0] < 21.022 && F.interlacing.halfGram.firstViolationInterval[1] > 25.01
      && Math.abs(F.interlacing.classicalGram.firstViolationAt[1] - 282.4547) < 1e-3,
    why: 'Lemma H: the n=1 pencil is not globally real-rooted (HKO); the census reproduces the literature first Gram-law failure at g₁₂₆.',
  },
  {
    id: 'route-b-interlacing-height-flat-and-no-set-reduces',
    holds: () => {
      const hc = F.interlacing.heightCensus;
      const cs = F.interlacing.coefficientSets;
      const highBands = hc.bands.filter(([lo]) => lo >= 100);
      const heightFlat = highBands.every(([, , , , frac]) => frac > 0.4 && frac < 0.6);
      const base = cs.results[cs.base].fraction;
      const noSetReduces = Object.values(cs.results).every((r) => r.fraction >= base) && cs.reducesBelowBase === false;
      return heightFlat && noSetReduces && cs.best === cs.base;
    },
    why: 'imp-96021: the half-Gram interlacing-violation fraction is height-flat near 0.55 (never trending to 0), and no additive coefficient set lowers it below the bare n=1 value — the pencil cannot be tuned toward interlacing.',
  },
  {
    id: 'route-b-discriminant-census-not-a-certificate',
    holds: () => F.discriminantCensus.heat[1] > 0 && Object.values(F.discriminantCensus).every(([p, n]) => p + n === 49),
    why: 'The heat control itself has negative discriminant rates at 21 of 49 extrema — the per-extremum criterion is not a confinement certificate.',
  },
  {
    id: 'route-b-honest-status',
    holds: () => /NEGATIVE/.test(F.status) && /RH open/.test(F.status) && /NO QED/.test(F.status),
    why: 'No false QED: verdict negative, RH open, no refereed bound is changed.',
  },
]);

export default ROUTE_B_FREEZE_FLOW;
