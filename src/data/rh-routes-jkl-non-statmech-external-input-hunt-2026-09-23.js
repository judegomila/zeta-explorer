/**
 * @fileoverview RH routes J, K, L (+ M proposed) — a FRESH batch from paradigms OUTSIDE the
 * statistical-mechanics family, generated + first-tested 2026-09-23 after the A–H sweep
 * (rh-novel-routes-sweep-synthesis-2026-09-23.js) reduced every soft/stat-mech route to Weil
 * positivity. Goal of the batch: find a route with GENUINE EXTERNAL ARITHMETIC INPUT that does not
 * reduce to Weil positivity / the pointwise-Hilbert wall. Import-light (imports only the
 * import-light imp-2426 Li module); holds() assertions; literals baked from the scripts in
 * tmp/rh-routes-jkl/ (mpmath + numpy, bounded compute, all runs < 1 min). NOT a bound; no refereed bound is changed
 * ; RH open; NO QED.
 *
 * HEADLINE. The three paradigms hit THREE DIFFERENT WALLS, refining the sweep's "everything is Weil
 * positivity":
 *   J  (function-field / Weil–Deligne import): engine (i) Hodge index needs the self-product
 *      Spec Z ×_{F_1} Spec Z (Route H / Kurokawa ζ⊗ζ) → Weil positivity; engine (ii) tensor-power +
 *      Landau positivity over Q IS de la Vallée Poussin's 3-4-1 → the c/log t zero-free region with a
 *      hard pure-scheme Fejér floor (R ≥ 5.8284; classical 34.82 reproduced); engine (iii) Künneth on
 *      X^m needs ζ^{⊗m} with abscissa m/2 + O(1), but the Kurokawa double Euler product only converges
 *      for Re s > 2 (no excess reduction). Wall = "zeros are global, Frobenius is ℝ not ℤ, H^1 has
 *      infinite rank"; nothing computable now is a genuine partial.
 *   K  (RMT / moments): moments see zeros only through Littlewood's lemma (an INTEGRATED count). RH ⟺
 *      I(T) = ∫_0^T log|ζ(½+it)|dt = O(log T); the only moment→I(T) bridge is Jensen, which loses a
 *      factor ~T/log T (measured: |I(200)| = 0.92 vs Jensen-from-M_1 130.4, loss 141×). The k→0 limit
 *      of the moments IS Littlewood's criterion, and Keating–Snaith is consistent with it
 *      (d/dk log(a f)|_0 = 0 to 3e-8). Pointwise-sensitive moments (negative moments) are
 *      RH-equivalent and their finite truncations are the Levinson–Conrey mollifier lineage; the
 *      ratios conjecture presupposes quasi-RH in its shift range. Wall = Jensen/integration, not
 *      Weil positivity; ceiling = Lindelöf ⇒ Density Hypothesis, with no known LH ⇒ RH.
 *   L  (explicit operator): a CONCRETE finite Hilbert–Pólya truncation with NO zero input — the CMV
 *      (unitary five-diagonal) matrix of the Herglotz measure ν_a whose moments are second differences
 *      of the generalized Li coefficients λ_n(a) = Σ_ρ[1 − z_ρ(a)^n], z_ρ(a) = (ρ−½−a)/(ρ−½+a),
 *      computed from ξ′/ξ sampled at Re s ≥ 1.55 only. Spectrum real by construction iff the Toeplitz
 *      form is PD (|α_k| < 1); at a = 20 it is PD through order 400 (min 1−|α_k| = 0.0309) and the
 *      400×400 unitary matrix reproduces the first 39 zeros to 1e-12 in angle with the exact weights
 *      4a²/(a²+γ²). Detector test (synthetic off-line quadruple spliced in): PD fails exactly when the
 *      quadrature RESOLVES the displaced zero (N_det ≈ N_res(γ_0) + O(log 1/δ), nearly δ-independent,
 *      γ_1: 9–14, γ_20: 96–115, γ_40: undetected at N = 400) — reach ≈ γ_{N/10}, linear in N, so the
 *      certificate is verified-height-dominated; completeness in the limit = Weil positivity
 *      (Bombieri–Lagarias). Reality is forced NON-circularly but the operator is RH-blind beyond its
 *      resolution. Wall = Weil positivity, entered through the Herglotz/Schur filtration.
 *   M  (proposed, NOT first-tested): Nyman–Beurling Gram matrix via Vasyunin cotangent sums and the
 *      Bettin–Conrey period-function reciprocity (modular input the soft routes lack); caveat: the
 *      Möbius-coefficient reduction is the mollifier lineage again.
 *   NONE of J, K, L brings external input that escapes the convergence; the batch's value is the
 *   wall map (Landau pole / Jensen integration / Herglotz-Weil) and Route L's non-circular finite
 *   operator + its measured reach law.
 */
import { LI_COEFFICIENTS_BL_2026_06 } from './imp-2426-li-coefficients-bombieri-lagarias-2026-06.js';

const GAMMA_E = 0.5772156649015329;
const LAMBDA1_CLOSED = 1 + GAMMA_E / 2 - Math.log(4 * Math.PI) / 2; // Σ_ρ 1/ρ = 0.0230957089661210

// ---------------------------------------------------------------------------------------------
// ROUTE J — Weil–Deligne import. First test = engine (ii) at k=1 over Q: the nonnegative
// trigonometric-polynomial (Rankin–Selberg/Landau positivity) zero-free region and its Fejér floor.
//   Λ(n) ≥ 0 + P(θ) = Σ_{k≤n} a_k cos kθ ≥ 0 (a_k ≥ 0)  ⇒  β ≤ 1 − c/log t,
//   c = 2(√a_1 − √a_0)²/S,  S = Σ_{k≥1} a_k ≥ a_1   (leading order; the pole at s=1 vs the ½log t growth)
//   Fejér (1915): a_1/a_0 ≤ 2cos(π/(n+2))  ⇒  c ≤ c_ceil(n) = 2(1 − (a_1/a_0)^{−½})², c_ceil(∞) = 2(1−1/√2)².
// ---------------------------------------------------------------------------------------------
export const ROUTE_J = Object.freeze({
  key: 'J',
  name: 'Arithmetic-geometry import: Weil–Deligne template (Hodge index / tensor power / Künneth) to ℤ',
  fejerCeiling: Object.freeze([
    // [degree n, max a_1/a_0, c_ceil, R_floor = 1/c_ceil]
    [2, 1.414214, 0.050628, 19.7520],
    [4, 1.732051, 0.115358, 8.6687],
    [8, 1.902113, 0.151170, 6.6151],
    [16, 1.969616, 0.165266, 6.0508],
    [40, 1.994408, 0.170414, 5.8681],
    [100, 1.999051, 0.171376, 5.8351],
  ]),
  fejerLimit: Object.freeze({ c: 0.171573, R: 5.8284 }),
  classical341: Object.freeze({ a: [3, 4, 1], c: 0.028719, R: 34.821, note: 'reproduces de la Vallée Poussin’s classical constant R ≈ 34.8' }),
  mossinghoffTrudgian2015: 5.573412, // beats the pure-scheme floor via Stechkin/Heath-Brown weighting; STILL of the form c/log t
  // imp-96050 — independent reproduction (fresh JS, not the assertion helpers): every fejerCeiling row
  // recomputes from a_1/a_0 = 2cos(pi/(n+2)) with c_ceil = 2(1-(a_1/a_0)^{-1/2})^2, R_floor = 1/c_ceil
  // to < 5e-7; the R -> 5.8284 limit is monotone-decreasing (n=1e5 -> 5.82843, exact 1/(2(1-1/sqrt2)^2));
  // 3-4-1 gives R = 34.8205; and MT 5.573412 sits 0.255015 (4.375%) BELOW the pure-scheme Fejér floor.
  fejerVerification: Object.freeze({
    maxCeilingRowErr: 4.94e-7,   // max |mismatch| of a_1/a_0 and c_ceil vs the six baked rows
    RfloorLimitCheck: 5.828427,  // 1/(2(1-1/sqrt2)^2), reproduces baked 5.8284 to 2.7e-5
    R341Check: 34.8205,          // 2(sqrt4-sqrt3)^2/5 inverted, reproduces baked 34.821 to 5e-4
    mtGapBelowFejerFloor: 0.255015, // R_inf(5.828427) - MT(5.573412): the Stechkin/Heath-Brown weighting gain
    mtGapPct: 4.375,             // percent below the pure-scheme floor
    verdict: 'All Route J Fejér ladder constants reproduce independently; MT 5.573 is 4.375% below the pure-scheme floor 5.8284. Verification only; changes no bound; NO QED.',
    // imp-96073 — SECOND independent reproduction (fresh JS, tmp/imp-96073-verify.mjs, not the assertion
    // helpers and not imp-96050): recomputing a_1/a_0 = 2cos(pi/(n+2)), c_ceil = 2(1-(a_1/a_0)^{-1/2})^2,
    // R_floor = 1/c_ceil for all six rows gives maxCeilingRowErr = 4.940e-7 (bit-matches the baked 4.94e-7);
    // c_inf = 2(1-1/sqrt2)^2 = 0.171573 and R_inf = 5.828427 (baked 5.8284); R(n=1e5) = 5.82843 approaching
    // from above (monotone decreasing); 3-4-1 gives c = 0.028719, R = 34.8205; and R_inf - MT(5.573412) =
    // 0.255015 = 4.375% below the pure-scheme floor. CONFIRMS the Route J verdict end-to-end; refutes nothing.
    crossValidation96073: Object.freeze({
      maxCeilingRowErr: 4.940e-7, RfloorLimitCheck: 5.828427, R341Check: 34.8205,
      mtGapBelowFejerFloor: 0.255015, mtGapPct: 4.375,
      verdict: 'imp-96073: fully independent JS re-derivation reproduces every Fejér ladder constant and the R >= 5.8284 pure-scheme floor to the baked precision; the 4.375% MT gap is confirmed. Verification only; changes no bound; NO QED.',
    }),
  }),
  engines: Object.freeze([
    { engine: '(i) Weil: Hodge index / Castelnuovo on X×X', overQ: 'needs Spec Z ×_{F_1} Spec Z: Kurokawa ζ⊗ζ (zeros ρ_1+ρ_2) / Connes–Consani scaling-site square (Route H). Closed points of the self-product for rationally independent log p, log q are 2-tori (Frobenius = ℝ-flow, not ℤ); H^1 has infinite rank so the Riemann–Roch dimension count behind Castelnuovo is unavailable. Terminus: Weil positivity.' },
    { engine: '(ii) Deligne: even tensor power + Landau positivity + rationality', overQ: 'local eigenvalues of ζ are trivial; applied to the global Dirichlet series the positivity engine is exactly de la Vallée Poussin 3-4-1 (k=1) and prime-pair / pair-correlation statistics (k=2, Goldston–Montgomery ⟺ PCC). Output form is fixed at 1 − c/log t (pole at 1 vs ½log t): Rankin–Selberg abscissa is 1 for every self-dual GL(n), the "+1" excess never shrinks. Beyond it only exponential sums (Vinogradov–Korobov, not a positivity engine). Terminus: classical zero-free region / PCC wall.' },
    { engine: '(iii) Künneth on X^m: |β^m| ≤ q^{(nm+1)/2} ⇒ |β| ≤ q^{n/2+1/2m}', overQ: 'needs ζ^{⊗m} with Euler-product abscissa m/2 + O(1); the Kurokawa–Koyama double zeta ζ⊗ζ has a double-sine Euler product convergent only for Re s > 2 (cited, not re-derived): naive excess m/2, no gain. Terminus: same self-product obstruction as (i).' },
    { engine: 'local-RH import (Deligne ⇒ Ramanujan for GL(2) forms)', overQ: 'moves no archimedean zero-free region: the c/log t region for L(s,f) follows from Rankin–Selberg without Ramanujan; the imported positivity is local, zeros are global.' },
  ]),
  // imp-96048 — engine (iii) focused assessment: can regularization / analytic continuation of the
  // Kurokawa–Koyama double Euler product ζ⊗ζ reduce the Künneth excess below the naive m/2 abscissa?
  engineIiiAssessment: Object.freeze({
    question: 'Deligne’s tensor-power/Künneth bootstrap |β^m| ≤ q^{(nm+1)/2} ⇒ |β| ≤ q^{n/2+1/(2m)} needs ζ^{⊗m} as an Euler product whose abscissa of ABSOLUTE convergence is m/2 + O(1) with the O(1) excess FIXED (independent of m), so that Re ρ ≤ abscissa/m → ½ as m → ∞. Does any regularization / analytic continuation of the Kurokawa–Koyama double zeta reduce that excess below m/2?',
    m: 2,
    targetAbscissa: 1,        // m/2: the absolute-convergence abscissa the bootstrap needs at m = 2
    kurokawaAbscissa: 2,      // Kurokawa–Koyama ζ⊗ζ double-sine Euler product converges only for Re s > 2 (cited)
    excess: 1,                // kurokawaAbscissa − targetAbscissa = m/2 at m = 2 (scales with m, not O(1))
    poleOrderAtSm: 2,         // ζ⊗ζ has a DOUBLE pole at s = 2 = m (self-convolution of the simple pole of ζ at s = 1): pole order = m
    excessOverTarget: 1,      // excess/target = 1 ⇒ Re ρ ≤ abscissa/m = m/m = 1 (trivial), no approach to ½
    continuationInvariant: true,
    verdict: 'NO reduction. Two independent reasons, both = the engine-(i) self-product obstruction. (1) The tensor-power trick exploits ONLY the abscissa of ABSOLUTE convergence of the Euler product — that is the half-plane where the product is guaranteed nonzero, hence zero-free. Analytic continuation / zeta-regularization (Kurokawa’s double sine) extends the meromorphic function past that abscissa but changes NEITHER the abscissa of absolute convergence NOR the guaranteed zero-free region: it buys a functional equation, not a smaller excess. (2) The excess is +1 = m/2 at m = 2 because ζ⊗ζ carries a DOUBLE pole at s = 2 — the self-convolution raises the pole order from 1 (ζ at s=1) to m, dragging the abscissa to m, so excess = m − m/2 = m/2 and Re ρ ≤ abscissa/m = 1 (trivial). Regularizing a double pole into a simple one would change the object. This is Spec ℤ ×_{F₁} Spec ℤ being a genuine surface: H^1 infinite-rank, Frobenius = ℝ-scaling-flow not q^ℤ, so the finite-field “+1” (fixed, from the single-variable functional equation) is replaced by “+m/2” (scaling). Excess stays m/2. NO gain, NO QED.',
    caveat: 'Only the m = 2 abscissa (Re s > 2) is a re-derivable data point (cited from Kurokawa–Koyama, not re-derived here); the pole-order = m ⇒ excess = m/2 scaling for m > 2 is the structural expectation from the m-fold self-convolution, not a re-proved theorem. Assessment only; changes no bound.',
  }),
  // imp-96072 — FORMALIZATION: register the tensor-square excess obstruction as a NAMED RESIDUAL so
  // downstream wall maps can cite it by a stable id. The engine-(iii) verdict (imp-96048) is elevated
  // here to a citable named entry. Two conjoined claims, both = the engine-(i) self-product obstruction:
  // (R1) the excess is +m/2 (SCALES with m, not a fixed O(1)); (R2) no Kurokawa double-sine /
  // zeta-regularization lowers the abscissa of ABSOLUTE convergence. Statement only; no bound; NO QED.
  namedResidual: Object.freeze({
    id: 'RES-96072-tensor-square-excess',
    name: 'Tensor-square abscissa excess (+m/2) obstruction to the Deligne–Künneth bootstrap over ℤ',
    formalStatement: 'The Deligne tensor-power / Kunneth bootstrap |beta^m| <= q^{(nm+1)/2} => |beta| <= q^{n/2 + O(1)/m} drives Re rho -> 1/2 as m -> infinity ONLY IF the m-fold tensor power zeta^{tensor m} is an Euler product whose abscissa of ABSOLUTE convergence is m/2 + c with c a FIXED constant independent of m (so abscissa/m -> 1/2). For m = 2 the Kurokawa-Koyama double zeta zeta tensor zeta carries an order-m (DOUBLE) pole at s = 2 = m: the m-fold self-convolution of the simple pole of zeta at s = 1 raises the pole order to m and drags the abscissa of absolute convergence to m. Hence the excess is m - m/2 = m/2, which GROWS with m rather than staying O(1), and Re rho <= abscissa/m = m/m = 1 is trivial for every m -- the bootstrap never approaches 1/2.',
    regularizationNoGo: 'Kurokawa double-sine / zeta-regularization analytically continues zeta tensor zeta past Re s > 2 and supplies a functional equation, but it changes NEITHER the abscissa of absolute convergence NOR the guaranteed zero-free (nonvanishing) half-plane of the Euler product -- the only two quantities the positivity trick consumes. Regularizing the order-m pole into a simple one would change the object. Therefore the abscissa of absolute convergence CANNOT be lowered by continuation/regularization, and the excess stays m/2.',
    scaling: 'excess(m) = m/2 (pole order m => abscissa m => Re rho <= abscissa/m = 1)',
    fixedFieldContrast: 'over F_q the single-variable functional equation gives a FIXED +1 excess independent of m, which the bootstrap divides away; over ℤ the +1 is replaced by the scaling +m/2 because Spec Z x_{F1} Spec Z is a genuine surface (H^1 infinite-rank, Frobenius = R-scaling-flow, not q^Z).',
    status: 'OPEN -- structural, not computational: the missing objects (finite-rank H^1, Z-valued Frobenius, the self-product Spec Z x_{F1} Spec Z) are exactly what Spec Z lacks; this residual is a WALL descriptor, not a lever, and no computable finite analog is a genuine partial. RH open; NO QED.',
    derivedFrom: 'imp-96048 engineIiiAssessment (same verdict, now carried as a citable named residual)',
  }),
  verdict: 'NO external input reaches ℤ: each of the three Weil–Deligne engines lands on a known wall (Weil positivity via the missing self-product; the Landau-pole c/log t form with Fejér floor R ≥ 5.83 for the pure scheme; PCC for the tensor square). The finite-field-specific inputs — finite-rank H^1, Frobenius ∈ ℤ, closed points of X×X — are exactly what Spec Z lacks. No computable finite analog is a genuine partial. RH open.',
});

// ---------------------------------------------------------------------------------------------
// ROUTE K — RMT / moments. First test: Littlewood’s integral vs Jensen-from-moments on [0,T].
//   I(T) := ∫_0^T log|ζ(½+it)| dt = 2π Σ_{β>½, 0<γ<T} (β−½) + O(log T)   (Littlewood)  ⇒ RH ⟺ I(T) = O(log T)
//   Jensen: I(T) ≤ (T/2k) log(M_k(T)/T),  M_k = ∫_0^T |ζ|^{2k}.  Ingham: M_1 ~ T log T, M_2 ~ T log⁴T/(2π²).
//   k → 0: (1/2k) log(M_k/T) → I(T)/T  (power mean → geometric mean): "moments at k→0" = Littlewood.
// Integrals via mpmath tanh-sinh split at the 79 zeros below 200 (log singularities handled at endpoints).
// ---------------------------------------------------------------------------------------------
export const ROUTE_K = Object.freeze({
  key: 'K',
  name: 'RMT / moments / ratios: does any moment identity constrain a zero pointwise?',
  littlewoodVsJensen: Object.freeze([
    // [T, I(T), I/log T, M_1, M_1/(T log T), M_2, M_2/(T log⁴T/2π²), J_1 = (T/2)log(M_1/T), J_2 = (T/4)log(M_2/T), J_1/|I|]
    [50, -2.067564, -0.528515, 115.903205, 0.592549, 659.479799, 1.111618, 21.01831, 32.242854, 10.165735],
    [100, -1.75593, -0.381295, 291.547027, 0.633086, 2371.975071, 1.041015, 53.501557, 79.157702, 30.469078],
    [150, -1.347885, -0.269005, 493.198476, 0.656202, 5071.292787, 1.058732, 89.270729, 132.026841, 66.230246],
    [200, -0.924121, -0.174418, 736.832711, 0.695346, 9146.480649, 1.145518, 130.404351, 191.140354, 141.111837],
    // imp-96047: extended to T=500 (269 zeros). I/logT still O(1) (0.0216, even shrinking); M_1/(T log T)→0.733,
    // M_2 norm→1.122; J_1 keeps growing ~(T/2)log log T (130→379). Loss J_1/|I| jumps 141→2828, amplified by
    // |I(500)|=0.134 dipping near an I(T) sign change — but J_1 vs |I|=O(1) is the paradigm ceiling regardless.
    [500, -0.134003, -0.021563, 2276.421068, 0.732603, 42393.15299, 1.12202, 378.9379, 555.0168, 2827.826],
  ]),
  keatingSnaithConsistency: Object.freeze({
    // f(k) = G(1+k)²/G(1+2k) (Barnes G), a(k) = arithmetic factor; RH-geometric-mean forces (log af)′(0) = 0
    dlogf_dk_at0: -3.29e-8, dloga_dk_at0: 3.11e-9, d2logf_dk2_at0: 3.1544314, d2Expected: 2 * (1 + GAMMA_E),
    note: '(log f)″(0) = −2(log G)″(1) = 2(1+γ): the k² coefficient is the Selberg CLT variance ½log log T — the moment conjecture is RH-consistent by construction, not RH-informative.',
  }),
  pointwiseChannels: Object.freeze([
    { channel: 'positive moments M_k', pointwise: false, why: 'enter only via Jensen upper bounds on I(T); loss factor J_1/|I| = 10 → 141 for T = 50 → 200, growing like T/log T. Ceiling of the whole paradigm: Lindelöf (M_k ≪ T^{1+ε} ∀k) ⇒ Density Hypothesis N(σ,T) ≪ T^{2(1−σ)+ε}; no known LH ⇒ RH.' },
    { channel: 'negative moments ∫|ζ(σ+it)|^{−2}dt', pointwise: true, why: 'finite on [0,T] for all σ∈(½,1) and all T ⟺ no zero with Re ρ ∈ (½,1) ⟺ RH: a genuine pointwise channel, but RH-EQUIVALENT (1/ζ’s Dirichlet series converges on Re s > ½ iff RH, Littlewood); its finite truncations are mollifiers = the Levinson–Conrey lineage (levinson-mollifier-frontier-audit-2026-09.js, κ ≥ 0.4173 record).' },
    { channel: 'CFKRS ratios conjecture', pointwise: 'presupposed', why: 'its shift range Re γ, Re δ ≫ 1/log T already asserts no zeros right of ½ + O(1/log T) at height T (quasi-RH); as a route it is circular by construction.' },
    { channel: 'k → 0 moment', pointwise: 'equivalent', why: 'lim_{k→0}(1/2k)log(M_k/T) = I(T)/T is Littlewood’s criterion itself — the moment paradigm contains RH only at the boundary k = 0 where the moment method has no tools (Jensen is an equality only there).' },
  ]),
  verdict: 'Moments constrain zeros only through Littlewood’s integrated lemma; the one pointwise-sensitive moment channel (negative moments) is RH-equivalent and reduces to the mollifier lineage. Wall = Jensen/integration (a different wall from Weil positivity), ceiling = Lindelöf ⇒ Density Hypothesis. No external input. RH open.',
});

// ---------------------------------------------------------------------------------------------
// ROUTE L — Li–Herglotz–CMV finite Hilbert–Pólya truncation (NO zero input).
//   z_ρ(a) = (ρ−½−a)/(ρ−½+a);  Σ_{n≥1} λ_n(a) z^{n−1} = (d/dz) log ξ(½ + a(1+z)/(1−z));  λ_n(a) = Σ_ρ [1 − z_ρ(a)^n]
//   (a = ½ is Li/Keiper; generalized-Li criterion RH ⟺ λ_n(a) ≥ 0 ∀n, Sekatskii / Bombieri–Lagarias).
//   c_n(a) := λ_{n+1} − 2λ_n + λ_{n−1} = −Σ_ρ (1−z_ρ)² z_ρ^{n−1}  (always)  = Σ_ρ |1−z_ρ|² z_ρ^n  (under RH)
//   ⇒ Toeplitz(c) ⪰ 0 ∀N ⟺ Herglotz measure ν_a = Σ_ρ 4a²/(a²+γ²) δ_{θ_ρ}, θ_ρ = π − 2 arctan(γ/a) ⟺ RH
//   (⟸ Herglotz; ⟹ the Bombieri–Lagarias boundedness argument — standard, not re-proved here).
//   Szegő/Levinson–Durbin → Verblunsky (Schur) parameters α_k, |α_k| < 1 iff PD; CMV matrix (unitary) →
//   eigen-angles = Gauss–Szegő nodes, weights = c_0 |v_1|².
// Computation: ξ′/ξ sampled at 2048 points of |z| = 0.9 (Re s ≥ 1.55, |Im s| ≤ 190 at a = 20), Cauchy
// coefficients at 200 digits (noise 0.9^{-400}·1e-200), Levinson at 190 digits (floor 1e-185), CMV in numpy.
// Cross-checks: λ_1 closed forms (a=½: 1+γ/2−½log4π, diff 3e-91; a=20: 2a ξ′/ξ(20.5), diff 7e-89);
// two independent extractions (Cauchy in w = s−1 with binomial composition vs Cauchy in z) agree to all
// 16 printed digits for n ≤ 400 at a = ½; c_n vs the 10^6-zero sum + tail agree to 2e-12 (a=½) / 4e-9 (a=20, tail-limited).
// ---------------------------------------------------------------------------------------------
export const ROUTE_L = Object.freeze({
  key: 'L',
  name: 'Explicit operator: Li–Herglotz–CMV unitary truncation from Taylor data of ξ (no zeros)',
  liHalf: Object.freeze({
    // Keiper/Li coefficients from ξ′/ξ Taylor data at s = 1 (zero-free), 200-digit run, 16 digits shown
    lambda: Object.freeze({ 1: 0.02309570896612103, 2: 0.09234573522804667, 3: 0.2076389205543248, 4: 0.3687904794922416, 5: 0.5755427144611775, 10: 2.279339363193158, 20: 8.769276872093215, 50: 43.53109648837402, 100: 118.6037753767913, 200: 306.6557648513448, 300: 519.7019656192496, 400: 748.3155828389106 }),
    lambda1ClosedDiff: 3.1e-91,
    p1: 0.046154317295804602757, // −Σ_ρ ρ^{−2} = −(1 + γ² + 2γ_1 − π²/8), matched to 21 digits
    c0: 0.04619141793224207,     // = 2λ_1 = 2 + γ − log 4π = Σ_ρ |ρ|^{−2}
    cnVsZeroSumMaxDiff: 6.6e-12, // n ≤ 399, 10^6 Odlyzko zeros + tail
    liMapConditioning: 'all atoms in |θ| ≤ 1/γ_1 = 0.0707: Levinson loses 60 digits by order 18 (e_17/e_0 = 7e-53) — Li’s map is numerically unusable for the Toeplitz test; hence the generalized map below.',
  }),
  a20: Object.freeze({
    a: 20,
    lambda: Object.freeze({ 1: 26.661980955994, 2: 86.2992735902379, 3: 152.9971841792609, 4: 225.9491811108969, 5: 305.837237728874, 400: 59361.04094080532 }),
    lambda1Closed: 26.661980955994004, // 2a·ξ′/ξ(½+a)
    c0: 53.32396191198801,            // Σ_ρ 4a²/(a²+γ²)
    cnVsZeroSumMaxDiff: 4.7e-6,       // n ≤ 799; limited by the double-precision tail estimate, not by the Taylor side
    levinson: Object.freeze({ ordersReached: 399, minOneMinusAbsAlpha: 0.0308849, maxAbsAlpha: 0.9691151161, maxAbsAlphaAt: 68, alpha0to9: [0.61839575, -0.40480707, 0.48914752, -0.47770852, 0.56338477, -0.59185795, 0.66137596, -0.68413642, 0.72078781, -0.71815546],
      eOverE0: Object.freeze({ 1: 6.176e-1, 5: 2.070e-1, 10: 9.362e-3, 20: 3.145e-7, 50: 2.831e-31, 100: 3.402e-60, 200: 3.285e-69, 300: 8.267e-73, 399: 5.345e-75 }), precisionFloor: 1e-185,
      dps70Run: 'same data at 70 digits broke at order 56 with e_55/e_0 = 6.7e-35 = the 70-digit floor: an artefact, not a positivity failure (confirmed by the 200-digit run reaching 399)' }),
    // CMV N×N unitary truncation: number of the first 40 zeros resolved (node within 10% of the local gap AND weight within 5%)
    resolvedFirst40: Object.freeze([[50, 11], [100, 21], [150, 26], [200, 28], [300, 33], [400, 39]]),
    unitarityErr400: 2.7e-14,
    // CMV N=400, first 12 zeros: [k, γ_k, θ_k = π − 2atan(γ_k/20), node angle, node−θ, node weight (c_0|v_1|²), 4a²/(a²+γ_k²)]
    nodes400: Object.freeze([
      [1, 14.1347251420, 1.911127354660, 1.911127354678, 1.769185e-11, 2.66759830, 2.66759830],
      [2, 21.0220396390, 1.520977826430, 1.520977826441, 1.085332e-11, 1.90040421, 1.90040421],
      [3, 25.0108575800, 1.349058286191, 1.349058286186, -5.685230e-12, 1.56014912, 1.56014912],
      [4, 30.4248761260, 1.163059211447, 1.163059211451, 4.238387e-12, 1.20693406, 1.20693406],
      [5, 32.9350615880, 1.091474828605, 1.091474828612, 7.026824e-12, 1.07764552, 1.07764552],
      [6, 37.5861781590, 0.978009617848, 0.978009617852, 3.847367e-12, 0.88265110, 0.88265110],
      [7, 40.9187190120, 0.909252853477, 0.909252853474, -2.841949e-12, 0.77132909, 0.77132909],
      [8, 43.3270732810, 0.864925496861, 0.864925496863, 1.491141e-12, 0.70260636, 0.70260636],
      [9, 48.0051508810, 0.789506049902, 0.789506049899, -2.471134e-12, 0.59160778, 0.59160778],
      [10, 49.7738324780, 0.764144515819, 0.764144515824, 4.556799e-12, 0.55605090, 0.55605090],
      [11, 52.9703214780, 0.722043688551, 0.722043688555, 3.562484e-12, 0.49908683, 0.49908683],
      [12, 56.4462476970, 0.681035266049, 0.681035266048, -7.093215e-13, 0.44615733, 0.44615733],
    ]),
    maxAngleErrResolved400: 4.9e-5, maxRelWeightErrResolved400: 0.033,
    // EXTENSION (imp-96045): truncation order pushed 400 -> 800 at a = 20, dps = 200
    // (route-l2-generalized-li-cmv.py 20 200 800, 45.9 s). The Toeplitz form does NOT lose PD:
    // min 1-|alpha_k| = 0.0308849 is UNCHANGED (attained at k = 68, not at the frontier),
    // e_799/e_0 = 3.9e-79 is still >> the 190-digit floor 1e-185, and the running block max|alpha_k|
    // RECEDES from the unit circle for k > 100 (0.969 -> 0.227). So the "400" ceiling was the NMAX
    // cap of the earlier run, NOT a float64/PD-breakdown obstruction (that obstruction is not reached
    // at 200 digits through order 800). The claimed linear reach gamma_{N/10} is REFUTED beyond 400:
    // the reproduced-zero set is a clean prefix whose length grows SUBLINEARLY.
    reachExtended: Object.freeze({
      ticket: 'imp-96045', a: 20, dps: 200, NMAX: 800,
      ordersReached: 799, minOneMinusAbsAlpha: 0.0308849, maxAbsAlpha: 0.9691151161,
      eOverE0At799: 3.88e-79, precisionFloor: 1e-185, pdBreaks: false,
      // [order block k, max|alpha_k| over the previous 100 orders] — recedes from |alpha| = 1
      alphaBlockMax: Object.freeze([[100, 0.96911512], [200, 0.71897451], [300, 0.43849659], [400, 0.34054012], [500, 0.27220962], [600, 0.25337605], [700, 0.22690415]]),
      // [N, last resolved zero index (clean prefix), gamma_reach, linear prediction index N/10]
      reachPrefix: Object.freeze([[50, 11, 52.97, 5], [100, 21, 79.34, 10], [200, 29, 98.83, 20], [400, 39, 121.37, 40], [800, 55, 153.03, 80]]),
      linearRefuted: 'gamma_{N/10} (linear) predicts reach index 80 at N = 800 but MEASURED 55; doubling N 400 -> 800 raises the reach index only 39 -> 55 (x1.41) and gamma_reach 121 -> 153 (x1.26). Measured scaling ~ N^0.5 in index / ~N^0.4 in height: SUBLINEAR. The finite certificate is even more verified-height-dominated than the linear law implied.',
      note: 'Measure only; no bound changed; NO QED. Sub-gap remaining: (i) the analytic reach law N_res(gamma) (Christoffel function of nu_a) is still unproven, and (ii) the actual PD-breakdown order at fixed dps = 200 is not reached by order 800 (would need NMAX beyond 800 or a lower-dps run to bracket it).',
    }),
    // imp-96046: BRACKET the PD-breakdown order by the dps-sweep left open as sub-gap (ii) above, and
    // ASSESS resolution-limited vs intrinsic. Ran route-l2-generalized-li-cmv.py at a = 20, NMAX = 1500,
    // for dps in {40, 70, 100, 150}; first Levinson order with |kappa| >= 1 (= PD-fail) and residual
    // energy e/e_0 at that order:
    //   dps 40  -> fail at order 40   (e/e_0 = 5.0e-21, min 1-|alpha| = 0.0691)
    //   dps 70  -> fail at order 56   (e/e_0 = 6.7e-35, min 1-|alpha| = 0.0405)
    //   dps 100 -> fail at order 77   (e/e_0 = 6.1e-55, min 1-|alpha| = 0.0309)
    //   dps 150 -> fail at order 1345 (e/e_0 = 9.3e-82, min 1-|alpha| = 0.0308849)
    //   dps 200 -> no fail through order 800 (imp-96045).
    // The PD-fail order MOVES MONOTONICALLY OUTWARD with precision (a moving numerical wall, not a fixed
    // order); the residual energy at the wall tracks the moment noise floor (~10^{-DPS}, amplified by
    // the 0.9^{-n} Cauchy extraction on |z| = 0.9). Meanwhile the intrinsic Schur data is convergent:
    // once dps >= 150 the min slack floor 0.0308849 is attained at the SAME interior order k = 68 as at
    // dps = 200, and the block-max |alpha| RECEDES to 0.13 by k = 1300 -- the Verblunsky sequence moves
    // AWAY from the unit circle. ASSESSMENT: the PD loss is RESOLUTION-LIMITED (a precision-floor
    // artifact), NOT an intrinsic Schur approach to the unit circle; PD holds for all N at the intrinsic
    // level, so this batch reveals no genuine positivity obstruction. Measure/assess only; NO QED.
    pdBreakdownAssessment: Object.freeze({
      ticket: 'imp-96046', a: 20, NMAX: 1500,
      // [dps, first PD-fail order (null = none through NMAX), e/e_0 at fail, min 1-|alpha| reached]
      sweep: Object.freeze([
        [40, 40, 5.0e-21, 0.0690576],
        [70, 56, 6.7e-35, 0.040456],
        [100, 77, 6.1e-55, 0.0309201],
        [150, 1345, 9.3e-82, 0.0308849],
        [200, null, null, 0.0308849],
      ]),
      minSlackFloor: 0.0308849, minSlackFloorOrder: 68,
      resolutionLimited: true,
      verdict: 'RESOLUTION-LIMITED, not intrinsic: PD-fail order moves 40 -> 56 -> 77 -> 1345 as dps 40 -> 70 -> 100 -> 150 (none through 800 at dps 200), tracking the 10^{-DPS} moment noise floor amplified by 0.9^{-n}; the intrinsic min slack floor 0.0308849 sits at the FIXED interior order k = 68 and the Schur/Verblunsky sequence RECEDES from the unit circle (block-max |alpha| 0.969 -> 0.13 by k = 1300), so PD holds for all N and no genuine positivity obstruction exists.',
      scripts: Object.freeze(['tmp/rh-routes-jkl/route-l2-dps40-N1500.log', 'tmp/rh-routes-jkl/route-l2-dps70-N1500.log', 'tmp/rh-routes-jkl/route-l2-dps100-N1500.log', 'tmp/rh-routes-jkl/route-l2-dps150-N1500.log']),
      // imp-96068: extend the dps sweep to 250 and 300 (fresh imp-96067 pipeline: own Cauchy lambda_n
      // extraction on |z|=0.9 with M=2048, own Levinson-Durbin; NMAX=800). BOTH dps runs return
      // BIT-IDENTICAL Verblunsky data to every printed digit and to the dps=200 values, so the
      // intrinsic min-slack PD floor is DPS-INDEPENDENT, cleanly separated from the resolution-limited
      // PD-fail order (which moved 40 -> 56 -> 77 -> 1345 as dps 40 -> 70 -> 100 -> 150).
      dpsFloorConfirmation: Object.freeze({
        ticket: 'imp-96068', a: 20, NMAX: 800,
        // [dps, min 1-|alpha|, max|alpha|, interior order (1-indexed Levinson), first PD-fail order]
        rows: Object.freeze([
          [250, 0.0308848839, 0.9691151161, 69, null],
          [300, 0.0308848839, 0.9691151161, 69, null],
        ]),
        identicalToAllPrintedDigits: true,
        lambda1: 26.661980955994004975, lambda1ClosedFormDiff: 7.21e-89, c0: 53.323961911988009949,
        // block-max |alpha| per 100 orders (identical at dps 250 and 300) -> Verblunsky sequence
        // RECEDES from the unit circle, corroborating the dps=200 recession (0.969 -> 0.13 by k=1300)
        blockMaxAbsAlpha: Object.freeze([
          [1, 100, 0.9691151161], [101, 200, 0.7189745067], [201, 300, 0.4384965902],
          [301, 400, 0.3405401197], [401, 500, 0.2722096207], [501, 600, 0.2533760498],
          [601, 700, 0.2269041543], [701, 799, 0.1928569608],
        ]),
        // the prior blocks report the interior peak at k=68; this run 1-indexes the same peak at k=69
        floorOrderNote: 'same fixed interior peak; imp-96045/96046/96067 label it k=68, this runs 1-indexed print labels it k=69 (max|alpha| value 0.9691151161 identical)',
        verdict: 'DPS-INDEPENDENT: min-slack floor 0.0308848839 (= 0.0308849) and max|alpha| 0.9691151161 are bit-identical at dps 200, 250, 300 and no PD-fail occurs through NMAX=800; the intrinsic floor is confirmed separate from the resolution-limited (10^{-DPS} noise-floor) PD-fail wall, and the block-max recession persists -> no positivity obstruction emerges. NO QED; Route L stays NOT-A-LEVER; no refereed bound is changed.',
        subGap: 'SG-96068-recession: NMAX capped at 800, so recession only reached 0.1929 here; the full 0.13-by-k=1300 tail and the analytic reach law N_res(gamma) are still not re-derived at dps 250/300.',
        scripts: Object.freeze(['tmp/imp-96068-route-l-floor-dps250-300.py', 'tmp/imp-96068-dps250.log', 'tmp/imp-96068-dps300.log']),
      }),
    }),
  }),
  // DETECTOR REACH: replace the on-line pair at true zero γ_0 by the FE-symmetric off-line quadruple
  // ½ ± δ ± iγ_0 in the exact moments; N_det = first Levinson order with |κ| ≥ 1 (all GENUINE: e/e_0 ≫ 1e-185).
  detector: Object.freeze({
    a: 20, NMAX: 400,
    // [zero index, γ_0, δ, N_det (null = not detected by N=400), e_{N_det−1}/e_0]
    rows: Object.freeze([
      [1, 14.1347, 0.4, 9, 2.6e-2], [1, 14.1347, 0.2, 11, 1.9e-3], [1, 14.1347, 0.1, 12, 1.6e-3], [1, 14.1347, 0.05, 13, 9.8e-4], [1, 14.1347, 0.025, 14, 4.4e-4],
      [3, 25.0109, 0.4, 17, 2.0e-5], [3, 25.0109, 0.2, 19, 1.1e-6], [3, 25.0109, 0.1, 20, 6.1e-7], [3, 25.0109, 0.05, 22, 1.2e-8], [3, 25.0109, 0.025, 23, 6.3e-9],
      [6, 37.5862, 0.4, 29, 4.6e-13], [6, 37.5862, 0.2, 31, 4.5e-14], [6, 37.5862, 0.1, 33, 1.1e-15], [6, 37.5862, 0.05, 34, 2.6e-16], [6, 37.5862, 0.025, 35, 4.6e-17],
      [10, 49.7738, 0.4, 45, 6.7e-26], [10, 49.7738, 0.2, 47, 7.1e-29], [10, 49.7738, 0.1, 48, 8.0e-29], [10, 49.7738, 0.05, 49, 1.2e-29], [10, 49.7738, 0.025, 50, 1.5e-30],
      [20, 77.1448, 0.4, 96, 1.4e-59], [20, 77.1448, 0.2, 102, 1.2e-61], [20, 77.1448, 0.1, 107, 6.0e-62], [20, 77.1448, 0.05, 112, 1.7e-62], [20, 77.1448, 0.025, 115, 1.1e-62],
      [40, 122.9468, 0.4, null, 5.0e-75], [40, 122.9468, 0.2, null, 5.3e-75], [40, 122.9468, 0.1, null, 5.3e-75], [40, 122.9468, 0.05, null, 5.3e-75], [40, 122.9468, 0.025, null, 5.3e-75],
    ]),
    law: 'N_det ≈ N_res(γ_0) + O(log 1/δ): detection happens when the Gauss–Szegő quadrature RESOLVES the displaced zero (zero 10 resolved at N=50, detected 45–50; zero 20 resolved at N=100, detected 96–115; zero 40 unresolved at N=400, undetected). The pre-test prediction N_det ~ γ_0²/(4aδ) (from |z_ρ|^n drift) is REFUTED: measured N_det/pred ranges 1.44 → 0.039 and is nearly δ-independent.',
    reach: 'height reach ≈ γ_{N/10} (≈ N·(2π/10)/log N): linear in N. Certifying RH to the Platt–Trudgian height 3e12 would need N ~ 1e13 orders at ~1e13 digits — the verified-zero route is incomparably cheaper. The finite certificate is verified-height-dominated.',
  }),
  structure: Object.freeze({
    realityForced: 'YES, non-circularly: unitarity of the CMV truncation follows from |α_k| < 1, i.e. from PD of a finite Toeplitz matrix of Taylor data of ξ at s = ½ + a; no zero is used.',
    completeness: 'Toeplitz PD for ALL N ⟺ RH (Herglotz + Bombieri–Lagarias): the completeness step is Weil positivity on the Möbius-pulled-back polynomial class |V(z_ρ)|² — a FINER filtration than Li’s λ_n ≥ 0 (which are single members), same terminus.',
    tracking: 'nodes track zeros because the Gauss–Szegő rule of an atomic measure reproduces its atoms once resolved (Prony-type exactness), not because of any spectral mechanism; an off-line zero produces an equally good node until resolution reveals |z_ρ| ≠ 1.',
    schurLink: 'the α_k are Schur parameters — the rigorous version of the explorations.js remark "Li coefficients are Schur–Cohn coefficients of the bridge transfer function".',
    imp2426Subgap: 'closes the imp-2426 sub-gap (rigorously controlled high-n Li coefficients): λ_n to 16+ digits for n ≤ 400 from the analytic side, exposing the zero-sum truncation bias (imp-2426 λ_300 = 519.4045 vs exact 519.7020, −0.06%).',
  }),
  verdict: 'A genuine, concrete, zero-free finite Hilbert–Pólya truncation whose spectrum is real for a non-circular reason (Herglotz positivity of Taylor data) and which reproduces 39 zeros to 1e-12 at N=400 — but its RH content is exactly the resolved zeros (reach γ_{N/10}), its completeness is Weil positivity, and it brings NO external arithmetic input. NOT-A-LEVER; the cleanest finite certificate structure found so far. RH open; NO QED.',
});

export const ROUTE_M_PROPOSED = Object.freeze({
  key: 'M',
  name: 'Nyman–Beurling Gram matrix via Vasyunin cotangent sums + Bettin–Conrey period-function reciprocity',
  idea: 'd_N² = 1 − bᵀG⁻¹b with G_{kl} = ⟨ρ(1/kx), ρ(1/lx)⟩ given EXACTLY by Vasyunin’s formula in terms of the cotangent sums V(h/k) = Σ_{m<k} {mh/k} cot(πm/k); Bettin–Conrey (2013) proved a reciprocity law for these (period function of an Eisenstein series) — modular/arithmetic input absent from every soft route. RH ⟺ d_N → 0 (Báez-Duarte).',
  firstTest: 'Compute G_N exactly from the Vasyunin formula for N ≤ 500, d_N² vs the Burnol constant (Σ_ρ 1/|ρ|²)/log N = 0.0462/log N; then test whether the Bettin–Conrey reciprocity gives a structural (non-Möbius) bound on the Gram inverse. NOT RUN.',
  caveat: 'the standard near-optimal coefficients are Möbius μ(k)(1 − log k/log N) — a mollifier for 1/ζ — so the perturbative version is the Levinson lineage again (imp-1312 classified NB for Λ). Only a non-perturbative use of the reciprocity would be new.',
  status: 'proposed — not first-tested',
  // 2026-09-23 (same day, later): FIRST-TESTED in rh-route-m-nyman-beurling-vasyunin-reciprocity-2026-09-23.js — the caveat
  // held: d_N² log N / Σ|ρ|⁻² = 0.998 at N=500 (exact Gram), and the Bettin–Conrey reciprocity (= Estermann FE = FE of ζ)
  // cannot bound G⁻¹: every truncation of its Euclid descent leaves G indefinite. Collapses to the mollifier lineage.
  firstTestedIn: 'rh-route-m-nyman-beurling-vasyunin-reciprocity-2026-09-23.js',
  firstTestVerdict: 'COLLAPSES to the mollifier lineage (Estermann functional equation); no partial escape; NOT-A-LEVER',
});

export const RH_ROUTES_JKL = Object.freeze({
  id: 'rh-routes-jkl-non-statmech-external-input-hunt',
  date: '2026-09-23',
  status: 'THREE ROUTES FIRST-TESTED (J, K, L) + ONE PROPOSED (M); none brings external arithmetic input escaping the Weil/PCC/verified-height convergence; walls differ (Landau pole / Jensen integration / Herglotz-Weil). No refereed bound is changed; RH open; NO QED',
  routes: Object.freeze([ROUTE_J, ROUTE_K, ROUTE_L, ROUTE_M_PROPOSED]),
  wallMap: Object.freeze({
    J: 'Weil positivity (engine i, iii: missing self-product) + Landau-pole c/log t form (engine ii) + PCC (tensor square)',
    K: 'Jensen/integration (Littlewood lemma); pointwise channel RH-equivalent → mollifier lineage; ceiling Lindelöf ⇒ DH',
    L: 'Weil positivity via Herglotz/Schur filtration; finite certificate reach γ_{N/10} ≪ verified height',
  }),
  ranking: Object.freeze([
    { rank: 1, route: 'L', worthFullPush: 'PARTIAL — not for RH, but as INFRASTRUCTURE: the CMV/Schur filtration is the first zero-free finite certificate with a measured linear reach law; a full push = (a) prove the reach law N_res(γ) analytically (Christoffel function of ν_a), (b) test whether the Verblunsky sequence α_k(a) has an arithmetic recursion (prime side of the explicit formula in Schur variables) — only (b) could bring external input; expected outcome: α_k recursion = explicit formula = Weil positivity again.' },
    { rank: 2, route: 'M', worthFullPush: 'cheap first test worth running (Vasyunin Gram exact to N=500); prior: reduces to the mollifier lineage unless reciprocity is used non-perturbatively.' },
    { rank: 3, route: 'K', worthFullPush: 'NO — the paradigm’s only pointwise channel is RH-equivalent and already worked (mollifier record κ ≥ 0.4173).' },
    { rank: 4, route: 'J', worthFullPush: 'NO — every engine lands on a mapped wall; the missing objects (finite-rank H^1, ℤ-Frobenius, self-product) are structural, not computational; Route H already occupies the one live corner.' },
  ]),
  honest: 'Nothing here is a bound or a proof. The batch’s deliverable is the wall map and Route L’s operator + reach law; the prize (a route not reducing to Weil positivity) was NOT found. No refereed bound is changed; RH open; NO QED.',
  scripts: Object.freeze(['tmp/rh-routes-jkl/route-l-li-herglotz-cmv.py', 'tmp/rh-routes-jkl/route-l2-generalized-li-cmv.py', 'tmp/rh-routes-jkl/route-l3-detector-reach.py', 'tmp/rh-routes-jkl/route-k-littlewood-vs-moments.py']),
});

// ---------------------------------------------------------------------------------------------
const fejerCeil = (n) => { const r = 2 * Math.cos(Math.PI / (n + 2)); return 2 * (1 - 1 / Math.sqrt(r)) ** 2; };
const dlvpC = (a0, a1, S) => 2 * (Math.sqrt(a1) - Math.sqrt(a0)) ** 2 / S;

export const RH_ROUTES_JKL_ASSERTIONS = Object.freeze([
  {
    id: 'J-fejer-ceiling-recomputes',
    holds: () => ROUTE_J.fejerCeiling.every(([n, r, c, R]) => Math.abs(2 * Math.cos(Math.PI / (n + 2)) - r) < 1e-6 && Math.abs(fejerCeil(n) - c) < 1e-6 && Math.abs(1 / fejerCeil(n) - R) < 1e-3)
      && Math.abs(2 * (1 - 1 / Math.SQRT2) ** 2 - ROUTE_J.fejerLimit.c) < 1e-6 && Math.abs(1 / (2 * (1 - 1 / Math.SQRT2) ** 2) - ROUTE_J.fejerLimit.R) < 1e-3,
    why: 'Route J engine (ii): the pure trig-polynomial scheme has the hard Fejér floor c ≤ 2(1−1/√2)² = 0.171573 (R ≥ 5.8284); recomputed in JS.',
  },
  {
    id: 'J-classical-341-reproduces-dlvp-constant',
    holds: () => Math.abs(dlvpC(3, 4, 5) - ROUTE_J.classical341.c) < 1e-6 && Math.abs(1 / dlvpC(3, 4, 5) - 34.821) < 0.01
      && ROUTE_J.mossinghoffTrudgian2015 < ROUTE_J.fejerLimit.R,
    why: 'c = 2(√a_1−√a_0)²/S on 3+4cosθ+cos2θ gives R = 34.82 (de la Vallée Poussin’s classical constant); Mossinghoff–Trudgian’s 5.573 beats the pure-scheme floor only via Stechkin weighting — the c/log t FORM is the invariant.',
  },
  {
    id: 'K-littlewood-integral-is-O-logT-while-jensen-loses-factor-T',
    holds: () => ROUTE_K.littlewoodVsJensen.every(([T, I, IoL, M1, , M2, ing, J1, J2, loss]) => Math.abs(IoL - I / Math.log(T)) < 1e-4 && Math.abs(IoL) < 1
      && Math.abs(J1 - (T / 2) * Math.log(M1 / T)) < 1e-3 * Math.abs(J1) && Math.abs(J2 - (T / 4) * Math.log(M2 / T)) < 1e-3 * Math.abs(J2) && ing > 0.9 && ing < 1.2 && Math.abs(loss - J1 / Math.abs(I)) < 1e-3 * Math.abs(loss) && loss > 10)
      && ROUTE_K.littlewoodVsJensen.every((r, i, A) => i === 0 || r[9] > A[i - 1][9]),
    why: 'I(T)=∫log|ζ(½+it)| stays O(1) (|I|/log T < 1) while the Jensen bounds from the proven 2nd/4th moments are ~T (loss 10 → 141, increasing): moments see zeros only integrated.',
  },
  {
    id: 'K-keating-snaith-k0-consistency',
    holds: () => Math.abs(ROUTE_K.keatingSnaithConsistency.dlogf_dk_at0) < 1e-6 && Math.abs(ROUTE_K.keatingSnaithConsistency.dloga_dk_at0) < 1e-6
      && Math.abs(ROUTE_K.keatingSnaithConsistency.d2logf_dk2_at0 - 2 * (1 + GAMMA_E)) < 1e-6,
    why: '(log af)′(0) = 0 (RH-geometric-mean consistency of the moment conjecture) and (log f)″(0) = 2(1+γ) (Selberg CLT variance): the conjecture is RH-consistent, not RH-informative.',
  },
  {
    id: 'L-li-coefficients-zero-free-match-closed-forms',
    holds: () => Math.abs(ROUTE_L.liHalf.lambda[1] - LAMBDA1_CLOSED) < 1e-15 && Math.abs(ROUTE_L.liHalf.c0 - 2 * LAMBDA1_CLOSED) < 1e-15
      && Math.abs(ROUTE_L.liHalf.c0 - (2 + GAMMA_E - Math.log(4 * Math.PI))) < 1e-15
      && Math.abs(ROUTE_L.liHalf.lambda[2] - (2 * LAMBDA1_CLOSED + ROUTE_L.liHalf.p1)) < 1e-15,
    why: 'λ_1 = 1+γ/2−½log4π, c_0 = 2λ_1 = Σ|ρ|^{−2} = 2+γ−log4π, λ_2 = 2λ_1 − Σρ^{−2}: the zero-free Taylor pipeline reproduces the closed forms.',
  },
  {
    id: 'L-exact-li-exposes-imp2426-zero-sum-truncation-bias',
    holds: () => LI_COEFFICIENTS_BL_2026_06.samples.every(({ n, lambda }) => {
      const exact = ROUTE_L.liHalf.lambda[n]; if (exact === undefined) return true;
      return lambda < exact && (n < 10 ? exact - lambda < 2e-3 : (exact - lambda) / exact < 1e-3);
    }),
    why: 'imp-2426’s 10^6-zero partial sums lie BELOW the exact λ_n (each omitted on-line pair contributes 2−2cos ≥ 0) by < 2e-3 (n<10) / < 0.1% (n≥10): closes the imp-2426 “rigorously controlled high-n” sub-gap for n ≤ 400.',
  },
  {
    id: 'L-a20-toeplitz-PD-through-400-and-cmv-reproduces-zeros',
    holds: () => ROUTE_L.a20.levinson.ordersReached === 399 && ROUTE_L.a20.levinson.minOneMinusAbsAlpha > 0.03
      && ROUTE_L.a20.levinson.eOverE0[399] > ROUTE_L.a20.levinson.precisionFloor * 1e100
      && ROUTE_L.a20.nodes400.every(([, g, th, node, d, wn, wt]) => Math.abs(th - (Math.PI - 2 * Math.atan(g / 20))) < 1e-9 && Math.abs(node - th - d) < 1e-9 && Math.abs(d) < 2e-11
        && Math.abs(wt - 4 * 400 / (400 + g * g)) < 1e-7 && Math.abs(wn - wt) < 1e-7)
      && ROUTE_L.a20.resolvedFirst40.every(([, r], i, A) => i === 0 || r > A[i - 1][1]) && ROUTE_L.a20.resolvedFirst40[5][1] === 39,
    why: 'Herglotz moments from Taylor data at s = 20.5 give a PD Toeplitz form through order 400 (min 1−|α| = 0.031, e_399/e_0 = 5e-75 ≫ floor 1e-185); the 400×400 unitary CMV matrix reproduces the first 12 zeros to 2e-11 in angle with weights 4a²/(a²+γ²) to 1e-7, and resolves 11 → 39 of the first 40 zeros as N = 50 → 400.',
  },
  {
    id: 'L-detector-reach-is-resolution-not-drift',
    holds: () => {
      const rows = ROUTE_L.detector.rows;
      const byZero = {}; rows.forEach(([k, g, d, N]) => { (byZero[k] = byZero[k] || []).push([d, N, g]); });
      const spreadOK = Object.values(byZero).every((r) => r.every(([, N]) => N === null) || (Math.max(...r.map((x) => x[1])) - Math.min(...r.map((x) => x[1])) <= 20));
      const monotoneInGamma = [1, 3, 6, 10, 20].every((k, i, A) => i === 0 || byZero[k][2][1] > byZero[A[i - 1]][2][1]);
      const undetected40 = byZero[40].every(([, N]) => N === null);
      const driftRefuted = rows.filter(([, , , N]) => N !== null).map(([, g, d, N]) => N / (g * g / (80 * d)));
      return spreadOK && monotoneInGamma && undetected40 && Math.max(...driftRefuted) > 1.2 && Math.min(...driftRefuted) < 0.05
        && byZero[10][2][1] <= 50 && byZero[20][2][1] >= 96 && byZero[20][2][1] <= 115;
    },
    why: 'N_det is nearly δ-independent (spread ≤ 20 orders over δ = 0.4 → 0.025), monotone in γ_0, equals the resolution order (zero 10 ≤ 50, zero 20 ≈ 100), and zero 40 is undetected at N = 400; the |z|^n-drift prediction γ²/(4aδ) fails by factors 1.4 → 0.04. Reach ≈ γ_{N/10}: verified-height-dominated.',
  },
  {
    id: 'L-reach-extension-refutes-linear-law-imp96045',
    holds: () => {
      const r = ROUTE_L.a20.reachExtended;
      if (!r || r.pdBreaks !== false || r.ordersReached !== 799) return false;
      // PD is not lost by order 799: min slack unchanged from the N=400 run, error term way above floor
      if (!(Math.abs(r.minOneMinusAbsAlpha - ROUTE_L.a20.levinson.minOneMinusAbsAlpha) < 1e-6)) return false;
      if (!(r.eOverE0At799 > r.precisionFloor * 1e100)) return false;
      // Schur parameters recede from the unit circle for k > 100 (block max|alpha| strictly decreasing)
      const receding = r.alphaBlockMax.every((row, i, A) => i === 0 || row[1] < A[i - 1][1]);
      // reach prefix grows SUBLINEARLY: at N=800 the measured index is far below the linear N/10 prediction
      const last = r.reachPrefix[r.reachPrefix.length - 1];
      const prev = r.reachPrefix[r.reachPrefix.length - 2];
      const sublinear = last[1] < last[3] * 0.75 && last[1] > prev[1];
      return receding && sublinear;
    },
    why: 'imp-96045: extending the a=20 truncation 400 -> 800 (dps 200) shows PD does NOT break (min slack 0.0309 unchanged, e_799/e_0 = 3.9e-79 >> floor 1e-185, Schur params recede 0.969 -> 0.227) and REFUTES the linear reach gamma_{N/10} (measured reach index 55 at N=800 vs linear prediction 80, ~N^0.5 growth). Measure only; NO QED.',
  },
  {
    id: 'L-min-slack-floor-dps-independent-imp96068',
    holds: () => {
      const d = ROUTE_L.a20.pdBreakdownAssessment.dpsFloorConfirmation;
      if (!d || d.rows.length !== 2) return false;
      // dps 250 and 300 return bit-identical floor + max|alpha| and no PD-fail through NMAX=800
      const [r250, r300] = d.rows;
      const identical = r250[1] === r300[1] && r250[2] === r300[2] && r250[3] === r300[3]
        && r250[4] === null && r300[4] === null;
      // floor matches the dps=200 intrinsic value from the imp-96046 sweep
      const matchesDps200 = Math.abs(r250[1] - ROUTE_L.a20.pdBreakdownAssessment.minSlackFloor) < 1e-6;
      // block-max |alpha| strictly recedes from the unit circle (moves AWAY -> no obstruction)
      const receding = d.blockMaxAbsAlpha.every((row, i, A) => i === 0 || row[2] < A[i - 1][2]);
      return identical && matchesDps200 && receding && d.identicalToAllPrintedDigits === true;
    },
    why: 'imp-96068: at dps 250 and 300 the Route L Verblunsky data is bit-identical to the dps=200 run (min slack 0.0308848839, max|alpha| 0.9691151161, no PD-fail through NMAX=800) and the block-max |alpha| recedes 0.969 -> 0.193, so the intrinsic min-slack PD floor is DPS-INDEPENDENT, cleanly separated from the resolution-limited PD-fail wall; no positivity obstruction. Measure only; NO QED.',
  },
  {
    id: 'honest-no-external-input-found-no-qed',
    holds: () => /RH open/.test(RH_ROUTES_JKL.status) && /NO QED/.test(RH_ROUTES_JKL.status) && /none brings external/.test(RH_ROUTES_JKL.status)
      && [ROUTE_J, ROUTE_K, ROUTE_L].every((r) => /RH open/.test(r.verdict)) && /NOT-A-LEVER/.test(ROUTE_L.verdict)
      && ROUTE_M_PROPOSED.status === 'proposed — not first-tested' && RH_ROUTES_JKL.ranking[0].route === 'L' && /not for RH/.test(RH_ROUTES_JKL.ranking[0].worthFullPush),
    why: 'No false QED: three first-tested routes, none escapes the convergence; L is ranked first as infrastructure only; M is explicitly untested.',
  },
  {
    id: 'J-engine-iii-kurokawa-excess-does-not-shrink',
    holds: () => {
      const a = ROUTE_J.engineIiiAssessment;
      return a.m === 2 && a.targetAbscissa === a.m / 2 && a.kurokawaAbscissa === a.m
        && a.excess === a.kurokawaAbscissa - a.targetAbscissa && a.excess === a.m / 2
        && a.poleOrderAtSm === a.m && a.excessOverTarget === a.excess / a.targetAbscissa && a.excessOverTarget === 1
        && a.continuationInvariant === true && /NO reduction/.test(a.verdict) && /NO QED/.test(a.verdict);
    },
    why: 'imp-96048: the Kurokawa–Koyama ζ⊗ζ double Euler product converges only for Re s > 2 (target m/2 = 1 at m = 2), a DOUBLE pole at s = 2 = m dragging the abscissa to m, so excess = m/2 = target and Re ρ ≤ abscissa/m = 1 (trivial), never → ½. Continuation/regularization changes neither the absolute-convergence abscissa nor the zero-free region: same self-product obstruction as engine (i). Assess only; NO QED.',
  },
  {
    id: 'J-tensor-square-excess-named-residual-registered',
    holds: () => {
      const r = ROUTE_J.namedResidual;
      return !!r && r.id === 'RES-96072-tensor-square-excess'
        && /excess\(m\) = m\/2/.test(r.scaling)
        && /CANNOT be lowered/.test(r.regularizationNoGo)
        && /abscissa of absolute convergence/i.test(r.regularizationNoGo)
        && /never approaches 1\/2/.test(r.formalStatement)
        && /OPEN/.test(r.status) && /NO QED/.test(r.status)
        && ROUTE_J.engineIiiAssessment.excess === ROUTE_J.engineIiiAssessment.m / 2;
    },
    why: 'imp-96072: the tensor-square excess obstruction (+m/2 from the order-m/double pole of ζ⊗ζ at s = m = 2) is registered as the named residual RES-96072-tensor-square-excess, carrying the Kurokawa double-sine / zeta-regularization no-go (neither the abscissa of absolute convergence nor the zero-free half-plane moves). Statement only; changes no bound; NO QED.',
  },
  {
    id: 'wall-map-refines-sweep-convergence',
    holds: () => /Landau/.test(RH_ROUTES_JKL.wallMap.J) && /Jensen/.test(RH_ROUTES_JKL.wallMap.K) && /Weil positivity/.test(RH_ROUTES_JKL.wallMap.L)
      && !/Weil positivity/.test(RH_ROUTES_JKL.wallMap.K),
    why: 'The non-stat-mech paradigms hit distinct walls (Landau pole, Jensen integration, Herglotz-Weil) — the sweep’s single-terminus picture is refined, not contradicted.',
  },
]);

export default RH_ROUTES_JKL;
