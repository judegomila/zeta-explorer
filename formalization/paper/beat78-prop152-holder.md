# Strategy 2 for the exceptional term of Prop 15.2: Hölder, higher moments, weighted and amplified Gram bounds

Internal analysis, 2026-10-08. Branch `editorial-redesign`, nothing committed. Part of the beat-7/8 campaign; read
with `beat78-synthesis.md` and `beat78-meansquare.md` (this directory).

Source: openai/math family 003, "A Zero-Free Half-Plane Re s > 7/8" (`/tmp/qrh-verify/paper.txt`, 30 Sep 2026).
That paper is Lean-formalised by its authors and has not been refereed. Equation, lemma and section numbers below
refer to it.

Question. Can the Cauchy–Schwarz/Gram step of Prop 15.3 be replaced so that the sixth-power exceptional term
P_a^{1/6} of the additive Gram bound (Prop 15.2) enters the low bound with a smaller exponent? Candidate
replacements: Hölder with a higher (4th, 6th) moment of the row sums, or an amplified or weighted Gram bound. If
that works, carry the gain through Part II to a rational endpoint certificate. If it fails, state exactly why.

Labels used below:
* **[PROVED]**: a complete argument given here, checkable line by line.
* **[PROVED-MT]**: the main term is computed exactly. The error terms are reduced to estimates already proved
  inside Prop 15.2 of the paper; they are sketched, not written out.
* **[EXACT]**: an exact symbolic, exact rational or exact Z[ω] computation. Scripts are listed in §10.
* **[MEASURED]**: a floating-point computation in a finite model.
* **[HEURISTIC]**: exponent bookkeeping or model reasoning. Not a proof.
* **[RECALLED]**: a standard fact quoted, not re-derived here.

---

## 0. Outcome

**No reduction of the exceptional term is obtained. θ′ = 7/8 is unchanged.** PT Λ ≤ 0.2 and the recorded
conditional Λ values are unchanged. No endpoint certificate below 7/8 is produced, and none is claimed.

The obstruction has three parts.

1. **Hölder reduces to the second moment [PROVED].** Replace the Cauchy–Schwarz step of Prop 15.3 by Hölder
   with the p-th moment of the row sums A_m, for any p ≥ 2, and control the B side by Lemma 15.1. The result is
   exactly the Cauchy–Schwarz bound computed with the second-moment bound that the p-th moment implies (by the
   power-mean inequality). Hölder therefore beats Prop 15.3 only if it improves Prop 15.2's mean square itself
   (Lemma 1).
2. **That mean square cannot be improved, because P_a^{1/6} is a positive main term [PROVED-MT, EXACT,
   MEASURED].**
   * For the paper's column coefficient c_σ there is an explicit exceptional frequency class ε*, built from
     Kummer theory and sextic reciprocity. Its correlation coefficient equals 1 identically on σ × σ.
   * Every other main-term contribution is ≥ 0.
   * The Mellin factor M_w(1/6) is > 0 for every nonnegative row weight w.

   Hence Σ_m |A_m|² ≍ (Q/Y′)P_a^{1/6} (Proposition 2). This holds over the full row ball, and also over the rows
   prime to S. Those are the only rows that occur in (6.2), because ξ(m) = 0 elsewhere.

   In a finite model, the excess of the exact row mean square over its diagonal matches the predicted
   exceptional-frequency term frequency by frequency, at two sizes (§7). The same holds row class by row class
   under an S-prime restriction (§7.3).
3. **Method limit [PROVED for moment orders ≥ 2; for orders < 2, conditional on flat fourth moments].** Consider
   every bound derived from separate moment information on |A_m| and |B_m|. This includes Hölder in any
   exponents, interpolation, level-set splitting, weighted Cauchy–Schwarz with structured weights and partitions
   of the columns. Each such bound is at least (Σ|A_m|²)^{1/2}(Σ|B_m|²)^{1/2}, taken with the true sums. By part 2
   the factor P_a^{1/12} survives in full. In the 2j-th moment the exceptional structure necessarily appears as
   P_a^{j/6}, so the 2j-th root returns P_a^{1/12} (Theorem 3, Corollary 1, §5).

So the exceptional term enters the low bound only through ‖A‖₂, and any method that sees A only through
magnitudes inherits it. Removing it needs bilinear (phase) information on Σ_m A_m B_m: Strategy 1 or a different
separation. §8 states what such a step would have to deliver.

The measurements in the model (§7) show what the excess looks like:
* It is spread over the rows like an inflated variance.
* The kurtosis E|A|⁴/(E|A|²)² stays between 1.99 and 2.04 at every P. The complex-Gaussian value is 2.
* The top 1% of rows carry 5.6–5.8% of the mass. The exponential law predicts 5.6%.
* A control whose Gauss-sum phases are randomised shows no excess.

---

## 1. The step being replaced

### 1.1 Separation and Prop 15.3

**The separation (6.2).**

  I_η = (Q^{−1/2}/2π) Σ_σ ∫ Ŵ₀(iv) Σ_{m≠0} Ω(q_m/Q) ξ(m) (q_m/Q)^{−iv} A_{m,σ,v}(Y) B_{m,σ}(Z) dv.

**The additive polynomial (Section 6).**

  A_{m,σ,ν}(Y′) = Y′^{−3/2} Σ_s c_σ(s) W₁(r_s) r_s^{−1+iν} g_{χ_s}(s, −m),

with
* c_σ(s) = 1_{s∈σ} χ_s(b*)/(τ ξ(s));
* r_s = q_s/Y′;
* g_ψ(c, k) = Σ_{d mod c} ψ(d) e(kd/c).

**Scales (Section 15).** For a rescaled tuple: Q = q_{b*}X′Y′ ≍ Z^{M′}, and P_a = Y′²/Q = q_{b*}^{−1}Z^b with
b = l_y − l_x.

**The two mean squares.**
* Prop 15.2, in the form (15.7): Σ_{q_m≪Q} |A_m|² ≪ (1+|ν|)^{J_Gr} (Q/Y′) P_a^{1/6} Z^ε. This uses
  P_a²/Y′ ≪ P_a^{1/6}, which is the length condition l_y − d − 11b/6 ≥ 1/12.
* Lemma 15.1: Σ |B^J_m|² ≪ Z^{M′+ε}.

**Cauchy–Schwarz in m** gives

  Q^{−1/2} ((Q/Y′)P_a^{1/6})^{1/2} (Z^{M′})^{1/2} = r_J X′^{1/2} P_a^{1/12}.

**Tuple sum.** There are Z^d tuples, each with coefficient Z^{−3d/2}, and X′^{1/2} = X^{1/2}Z^{−d/2}. The net
exponent is f(d) = −d, as in (15.8). So the binding tuple is d = 0 (J = ∅), which is a single tuple.

**Low exponent.** l_x/2 + b/12 = 17/96 + 1/96 = 3/16 at (l_x, l_y, b) = (17/48, 23/48, 1/8). Of this, the
exceptional term contributes b/12 = 1/96 [EXACT].

### 1.2 Exponent chain with a general exceptional exponent θ [EXACT]

Suppose the step produced (Q/Y′)P_a^θ in place of (Q/Y′)P_a^{1/6}, i.e. a low exponent l_x/2 + θb/2. With
(15.9), C(s) = l_x/2 + s − 1 + h/6, and the geometry relations h = 1 − l_x + ℓ, l_x = (M − b)/2:

  σ_low(θ) = 1 − h/6 + θb/2 = 5/6 + M/12 − ℓ/6 + b(θ/2 − 1/12),

  **σ_low(θ) − 7/8 = (2M − 1 − 4ℓ)/24 + b(θ/2 − 1/12).**

On Lemma 15.1's range 2M ≥ 1 + 4ℓ, with b ≥ 0, every θ ≥ 1/6 gives σ_low ≥ 7/8. Equality holds exactly when
2M = 1 + 4ℓ and θ = 1/6 (or b = 0). This exact identity is the no-gain certificate for any method whose effective
exceptional exponent is ≥ 1/6. Strategy 2 can matter only if it produces θ < 1/6. The algebra script also runs
2000 rational spot checks of this certificate.

What θ < 1/6 would be worth [HEURISTIC; it requires every step of Part II redone; values from
`beat78-synthesis.md` §3]:
* θ = (1 − η)/6 with η = 0.1 gives 0.87393.
* θ = 0 gives about 0.8635. Without re-optimising the geometry, θ = 0 gives 1 − h/6 = 83/96 ≈ 0.86458.

---

## 2. Hölder reduces to the second moment

**Lemma 1 [PROVED].** Fix R rows, p ∈ [2, ∞] and p′ = p/(p − 1). Let U_p ≥ Σ_m |A_m|^p (for p = ∞, U_∞ ≥ max |A_m|).
Then

  |Σ_m A_m B_m| ≤ ‖A‖_p ‖B‖_{p′} ≤ U_p^{1/p} R^{1/p′−1/2} ‖B‖₂ = (U₂^{(p)})^{1/2} ‖B‖₂,  where
  U₂^{(p)} := R^{1−2/p} U_p^{2/p},

and Σ_m |A_m|² ≤ U₂^{(p)}.

*Proof.* The first inequality is Hölder. For the second, p′ ≤ 2, so Σ|B|^{p′} ≤ R^{1−p′/2}(Σ|B|²)^{p′/2}. The
equality uses 1/p′ − 1/2 = 1/2 − 1/p. The final claim is the power-mean inequality for A. ∎

So the Hölder bound is the Cauchy–Schwarz bound computed with the second-moment bound U₂^{(p)}. It is smaller than
Cauchy–Schwarz with Prop 15.2 only if U₂^{(p)} < (Q/Y′)P_a^{1/6}, that is, only if the p-th moment estimate
improves Prop 15.2.

In exponents (base Z), write α_p := log Σ|A|^p. Then

  e_H(p) = e_CS + (α_p − α_p^♭)/p,

where α_p^♭ = (1 − p/2)M′ + (p/2)(M′ − y′ + b/6) is the flat value [EXACT, Part B]. By the power mean,
α_p ≥ α_p^♭ as soon as the second moment has its main term.

**Corollary 1 [PROVED, given Proposition 2; hence PROVED-MT overall].**

  Σ_m |A_m|^{2j} ≥ R^{1−j} (Σ_m |A_m|²)^j ≫ Q · Y′^{−j} · P_a^{j/6}.

The exceptional structure enters the 2j-th moment with exponent j/6, not 1/6. After the 2j-th root it is again
P_a^{1/12}. **The hoped-for "smaller exponent" cannot occur.**

---

## 3. The exceptional term is a positive main term

### 3.1 Statement

**Proposition 2 [PROVED-MT].** Fix the following:
* the target's data (S, T, b*, ξ);
* a class σ ∈ T and a real ν;
* a rescaled tuple, with Y′ and Q as in Prop 15.3;
* a smooth weight Ω̃ ≥ 0, not identically zero, supported in the row annulus.

As Z → ∞ in the regime of Prop 15.3,

  S(Q) := Σ_m Ω̃(q_m/Q) |A_{m,σ,ν}(Y′)|² = (Q/Y′) [𝔡 + 𝔢(ν) P_a^{1/6}] (1 + o(1)),

with 𝔡 > 0 and 𝔢(ν) ≥ c₀ |∫₀^∞ W₁(r) r^{−5/6+iν} dr|² for some c₀ > 0. In particular 𝔢(0) > 0, and

  Σ_{q_m≪Q} |A_{m,σ,0}|² ≫ (Q/Y′) P_a^{1/6}.

The same asymptotic holds with the row sum restricted to m prime to S. The constant 𝔢_S(ν) of that version is
again ≥ c₀′|∫W₁(r)r^{−5/6+iν}dr|² with c₀′ > 0 (step (iv-e)). These are exactly the rows on which ξ(m) ≠ 0 in
(6.2).

**The bound (15.7) is sharp up to Z^ε, on the rows that matter.**

Status: steps (i)–(iv) and (vi) below are complete. Step (v), the error terms, is reduced to the estimates proved
in Prop 15.2 and is sketched.

### 3.2 Proof

**(i) Exact Poisson identity.** Run the proof of Prop 15.2 with Ω̃ in place of the radial majorant. This gives

  S(Q) = (Q/Y′³) Σ_{s₁,s₂} c_σ(s₁) c̄_σ(s₂) W₁(r₁)W₁(r₂) r₁^{−1+iν} r₂^{−1−iν} Σ_{k∈O} F(s₁, s₂; k) Ω̂(Q^{1/2}k/(s₁s₂)).

Here Ω̂ is the planar transform of y ↦ Ω̃(|y|²) for the pairing e and the measure dμ, and F is the full
correlation (13.6). Its argument has |·|² = Q N(k)/(q₁q₂), which is ≍ q_C q_k/P_a in the notation of Prop 15.2.

**(ii) The frequency k = 0.** By Lemma 13.3, F(s₁, s₂; 0) = φ(s₁)·1_{s₁=s₂}. This term is the diagonal,
𝔡(Q/Y′)(1 + o(1)), with 𝔡 > 0.

**(iii) Nonexceptional k ≠ 0.** Prop 15.2's argument applies verbatim. It uses only the Schwartz decay of Ω̂, not
its sign. The contribution is ≪ (Q/Y′)(P_a²/Y′)Z^ε, which is o((Q/Y′)P_a^{1/6}) by l_y − d − 11b/6 ≥ 1/12.

**(iv) Exceptional k.** These are the k with (k) = a⁶e, where e is sixth-power-free and supported on the primes
of C = (s₁, s₂) and of the fixed support. Write s_i = Cn_i. By (13.7),

  F(Cn₁, Cn₂; Ck) = χ_{n₁}(k) χ̄_{n₂}(−k) R(n₁, n₂) L_C(n₁, n₂; k).

* **(iv-a) Which (C, k) can have a main term.** Fix p | C with c := v_p(C), and suppose p divides neither
  residual.
  * By (13.8), L_C contributes χ_p(n₁/n₂)^c.
  * By (4.8), χ_{n₁}(k) χ̄_{n₂}(−k) contributes χ_p(n₁/n₂)^{v_p(k)}, times R-phases that cancel when
    φ(n₁) = φ(n₂).
  * So the dependence on the residual columns mod p is χ_p(n₁/n₂)^{c + v_p(k)}.
  * If c + v_p(k) ≢ 0 (mod 6) at some p | C, this character is nonprincipal, the complete mean vanishes, and
    there is no main term.
  * If p divides exactly one residual, the local factor P^{c−1}(P − 1)·1_{6|c}·1_{p∤k} is ≥ 0.
  * Together with the exceptional condition outside C ∪ l_fixed, a main term needs the full frequency j = Ck to
    have every good valuation divisible by six.

  *(Correction to the first draft of this note, which put the condition on c alone.)*
* **(iv-b) Local factors when the condition holds.** The local factors are P^{c−1}(P − 1) (for p | k) and
  P^{c−1}(P − 2) (for p ∤ k, 6 | c). Both are > 0.
* **(iv-c) The column coefficient.**
  * Since |χ_C(b*)| = |ξ(C)| = |τ| = 1, the C-factors cancel:
    c_σ(Cn₁) c̄_σ(Cn₂) = 1_{σ_C}(n₁) 1_{σ_C}(n₂) · χ_{n₁}(b*)ξ̄(n₁) · conj(χ_{n₂}(b*)ξ̄(n₂)), with σ_C := σ[C]^{−1}.
  * Take k = εa⁶ with (a, n₁n₂) = 1; for other a the zero masks vanish. The coefficient becomes
    1_{σ_C}(n₁)1_{σ_C}(n₂) ψ_ε(n₁) conj(ψ_ε(n₂)) · [χ̄_{n₂}(−1) R(n₁, n₂)], where ψ_ε(n) := χ_n(b*ε) ξ̄(n).
  * R factors through T (paper §6.1), and the bicharacter r of (4.4) is nondegenerate. So the class in T
    determines the square class φ(n) mod 4, and φ(n₁) = φ(n₂) on σ_C × σ_C [EXACT, Part C].
  * Moreover χ_n(−1) = R(n, n) = (−1)^f and β(v, v) = f. Hence χ̄_{n₂}(−1) R(n₁, n₂) = (−1)^{f+f} = 1 there
    [EXACT, Part C].
  * So on σ_C × σ_C the coefficient is ψ_ε(n₁) conj(ψ_ε(n₂)). This is rank one, and its mean is
    |mean_{σ_C} ψ_ε|² ≥ 0.
* **(iv-d) The sum over a.** Parametrise the exceptional k as k = ε·a⁶, with ε running over all S-units
  u·Π_{p∈S} π_p^{v_p} (all v_p ≥ 0) and a over ideals prime to S and to n₁n₂. The argument of Ω̂ is
  Q q_C q_ε q_a⁶/(q_{s₁}q_{s₂}). The sum over a is

    δ · (Q q_C q_ε/(q_{s₁}q_{s₂}))^{−1/6} · (1/6) M_Ω(1/6) + O(1),

  where
  * M_Ω(σ) := ∫₀^∞ Ω̂_rad(v) v^{σ−1} dv = K(σ) ∫₀^∞ Ω̃(t) t^{−σ} dt;
  * K(σ) = 2πΓ(σ)(4π²/3)^{−σ}/(√3 Γ(1 − σ)), with K(1/6) = 11.6422… [EXACT, Part E].

  M_Ω(1/6) > 0 whenever Ω̃ ≥ 0 is not identically zero; this is the same argument as (7.2) in the paper. The
  ε-sum converges: Σ_v Π_p q_p^{−v_p/6} < ∞.
* **Combining (iv-a)–(iv-d).** The exceptional main term is (Q/Y′)P_a^{1/6}𝔢(ν), where 𝔢(ν) is a convergent sum
  over sixth-power C and S-units ε. Each term is a product of:
  * nonnegative local factors and densities;
  * q_ε^{−1/6} and the matching power of q_C;
  * |mean_{σ_C} ψ_ε|²;
  * |∫ W₁(r) r^{−5/6+iν} dr|², from the (s₁, s₂)-sum after the factor (q_{s₁}q_{s₂})^{1/6};
  * M_Ω(1/6)/6.

  Every term is ≥ 0.

**(iv-e) Restriction to rows prime to S.** In (6.2) the factor ξ(m) vanishes unless (m, S) = 1. So the mean
square that actually enters the Cauchy–Schwarz step is over the rows prime to S.

By inclusion–exclusion,

  Σ_{(m,S)=1} = Σ_{d | b*} μ(d) Σ_{m ∈ dO}.

* **Rows divisible by π.** For π ∈ S and m = πm′, we have χ_s(−πm′) = χ_s(π)χ_s(−m′). So A_{πm′} is the same
  polynomial with column coefficient c_σ(s)·conj(χ_s(π)), evaluated at m′, on rows of norm ≍ Q/q_π. Its coherent
  classes are π·ε*𝒦₀, with 𝒦₀ := {ε : χ_•(ε) constant on σ}.
* **Ratio for one class.** Write r_π := v_π(ε) mod 6 for a coherent class ε. Comparing the two Poisson
  expansions class by class (the a-sum is the same, and the factor q_π^{1/6} comes from the rescaled Fourier
  argument), the class contributes to Σ_{m∈πO} the fraction ρ_π of its full-ball contribution, where
  * ρ_π = 1/q_π if r_π ≤ 4;
  * ρ_π = 1 if r_π = 5. Then the shifted valuation r_π + 1 wraps to 0, and the smallest frequencies on πO have
    v_π = 0.

  The computation, writing q = q_π:
  * On the full ball the π-part of the class sum is Σ_{n≥0} q^{−(r+6n)/6} = q^{−r/6}/(1 − q^{−1}).
  * On πO the row count gives a factor 1/q, the Fourier argument is rescaled by 1/q, which gives a factor q^{1/6},
    and the frequencies have v_π ≡ r + 1 (mod 6). This gives (1/q)·q^{1/6}·Σ_{v≡r+1 (6), v≥0} q^{−v/6}.
  * For r ≤ 4 that equals (1/q)·q^{−r/6}/(1 − q^{−1}).
  * For r = 5 it equals q^{−5/6}/(1 − q^{−1}), the same as the full ball.
* **Rows prime to S.** The rows prime to S therefore carry Π_{π∈S}(1 − ρ_π) of each class. That is
  Π_{π∈S}(1 − 1/q_π) for a class with every r_π ≤ 4, and 0 if some r_π = 5.
* **Such a class exists [EXACT, `beat78-prop152-holder-kummer.py`].**
  * The characters χ_s(λ³) = (λ/s)₂, χ_s(4) and χ_s(−1) depend only on s mod 4. This was checked on 6045
    moduli. So λ³, 4 and −1 lie in 𝒦₀ for every σ.
  * The class ε* of §3.3 has r_{π_p} = j_p − 1 ≤ 4 for p ∤ 6, r₂ ∈ {1, 3} and r_λ = 5.
  * Multiplying ε* by λ³ (and by 4^{±1} if needed) gives a class ε** in the same coherent coset with r_λ = 2,
    r₂ ∈ {1, 3} and every r_π ≤ 4.

So 𝔢_S(ν) ≥ Π_{π∈S}(1 − 1/q_π) × (the ε** term) > 0. In the model of §3.3 the coherent coset has 12 classes,
ε*·⟨−1, 4, λ³⟩. Four of them (v₂ ∈ {1, 3}, v_λ = 2, unit ±1) survive on rows prime to S. §7.3 checks the
mechanism numerically.

**(v) Error terms (sketch).**
* Replacing the a-sum by its integral costs O(1) against P_a^{1/6}.
* Equidistribution of primary ideals in ray classes, with smooth weights and Möbius inversion for the
  coprimality as in Prop 15.2, gives a power saving in Y′.
* Prop 15.2 already handles the dyads whose residual length N falls below the period 𝒬 by the convergent factor
  C₀^{−1/6}D₀^{−1}. Restricted to C₀D₀ > Y′^{1−δ}/P_a^{1/6}, these dyads are o(main).
* The C of (iv-a) have zero complete mean. For N ≥ 𝒬, the lattice Poisson step (15.5) makes them negligible.

None of this is written out here. It follows the structure of Prop 15.2's proof.

**(vi) Positivity.** Take C = 1 and ε = ε* from §3.3. Then ψ_{ε*} is constant on σ, so |mean_σ ψ_{ε*}|² = 1 and
𝔢(ν) ≥ c₀|∫W₁(r)r^{−5/6+iν}dr|². At ν = 0 this is > 0, because W₁ ≥ 0 and W₁ is not identically zero. ∎

### 3.3 The class ε* [PROVED; EXACT model check]

Write b* = 2·λ·Π_{p∈S, p∤6} π_p, with π_p primary; a unit factor is absorbed below. Write ξ = ξ₂ ξ_λ Π_{p∤6} ξ_p.

**(a) Primes p ∤ 6.** (O/p)^× is cyclic of order q_p − 1 ≡ 0 (mod 6). So its characters of order dividing six
are the powers of χ_{π_p} = (·/π_p)₆, and ξ_p = χ_{π_p}^{j_p} with 1 ≤ j_p ≤ 5.

Sextic reciprocity gives χ_n(π_p) = R(π_p, n)χ_{π_p}(n). This is Lemma 4.4. Its proof uses only cubic reciprocity
for coprime primary elements prime to 3, together with the Γ-table, so it applies to π_p ∈ S. Hence

  ξ̄_p(n) = χ_n(π_p)^{−j_p} λ_{φ(π_p)}(n)^{j_p},  where λ_v(n) := (−1)^{β(v, φ(n))}.

**(b) The prime p = (2).** The residue field is F₄, so ξ₂ has order 3. The proof of Lemma 4.4 shows that
χ_n(4) = (n/(−2))₃ is the order-3 character of n mod 2. So ξ₂ = χ_•(4)^{±1}.

**(c) The prime p = (λ).** Primary n satisfy n ≡ 1 (mod 3), so ξ_λ(n) = 1.

**Consequence.** On primary n outside S,

  ψ_ε(n) = χ_n(b*ε) ξ̄(n) = χ_n(ε·ε₁) · λ_{v₀}(n),  where
  ε₁ := b* · 4^{∓1} · Π_{p∤6} π_p^{−j_p}  and  v₀ := Σ_p j_p φ(π_p).

Take ε* ≡ ε₁^{−1} modulo sixth powers of S-units. Then ψ_{ε*} = λ_{v₀} on n prime to S. This depends only on the
square class, so it is constant on every class of T. The frequencies k = ε*a⁶ are exceptional, because all their
valuations outside S are divisible by six.

**Valuations of ε*.** v_{π_p}(ε*) ≡ j_p − 1 ∈ {0, …, 4} for p ∤ 6, v₂(ε*) ≡ −1 ± 2 ∈ {1, 3}, and
v_λ(ε*) ≡ −1 ≡ 5 (mod 6). Since λ³ ∈ 𝒦₀, the class ε** := ε*λ³ lies in the same coherent coset and has
v_λ ≡ 2. It is the class that survives on rows prime to S (step (iv-e)).

**Why such a class must exist [RECALLED].**
* F = Q(√−3) contains μ₆, and its S-class group is trivial.
* By Kummer theory, every character of order dividing 6 of a ray class group with conductor supported on S is
  therefore n ↦ χ_n(ε) for some S-unit ε.
* Every twist in c_σ is of this kind. The group (O/4)^× has exponent 6, and ξ and χ_•(b*) have order dividing 6.
* So some exceptional frequency always undoes these twists.

The paper's conventions supply what this argument needs:
* All fixed characters are unramified outside S.
* Prop 15.2's mean square runs over the whole row ball, S-divisible m included. There the S-supported exceptional
  frequencies are directly present.
* On the rows of (6.2), which are prime to S, the inclusion–exclusion over sublattices keeps exactly the coherent
  classes with every r_π ≤ 4 (step (iv-e)). The coset always contains one, because λ³ and 4 lie in 𝒦₀.

**Model check [EXACT, `beat78-prop152-holder-correlation.py`].**

The model datum:
* S = {2, λ, π₇, π₁₃} and b* = 2λπ₇π₁₃;
* ξ has order 3 at 2, is quadratic at λ, quadratic at π₇ and sextic at π₁₃;
* T is the ray group mod 12.

Results:
* **Search.** For each of six classes σ, a search over all 6⁵ = 7776 S-unit classes ε modulo sixth powers finds
  12 with ψ_ε constant on σ: the coset ε*·⟨−1, 4, λ³⟩. The predicted ε* is among them for every σ.
* **The identity Φ = 1.** c(s₁)c̄(s₂)F(s₁, s₂; εa⁶) = 1 holds exactly in Z[ω] on 5982 coprime pairs in σ²
  (486 of them with brute-force F), for a ∈ {1, small primes}.
* **Rank-one form.** 89 840 further cases confirm the rank-one form ψ_ε(s₁)conj(ψ_ε(s₂)) for random classes ε.
* **Conventions.** The script also checks:
  * χ_n(−1) = R(n, n) on 119 moduli;
  * sextic reciprocity with the paper's R on 4000 pairs, inert primes and prime powers included;
  * the closed form of Lemma 13.3 against the brute-force congruence sum in 240 cases, 85 of them with a shared
    prime.

### 3.4 Remark: same origin as the signal

The signal's h/6 comes from the principal row u = 1 of the probe's own Poisson expansion. Its frequencies are
H = a⁶, which give the pole of ζ_F(6z) ((7.13), (10.3)). The b/12 comes from the sixth-power frequencies k = εa⁶
in the Poisson expansion of ‖A‖².

Both are counts of sixth powers in a dual range: Z^h for the signal, P_a = Z^b for the exceptional term.
Cauchy–Schwarz halves the second count. Both also carry the Mellin factor at 1/6 of a nonnegative row weight:
M(1/6) in (7.2) for the signal, M_Ω(1/6) here.

---

## 4. Method limit

**Theorem 3 [PROVED].** Fix R rows and A, B ∈ C^R, and write 𝒜 := Σ|A_m|² and ℬ := Σ|B_m|². Let 𝒞 be any finite set
of constraints Σ|A_m|^{p_i} ≤ U_i and Σ|B_m|^{q_j} ≤ V_j with p_i, q_j ∈ [2, ∞] (the max-norm when the exponent is
∞), all of which hold for (A, B). Let Φ(𝒞) := sup{|Σ_m A′_m B′_m| : (A′, B′) satisfies 𝒞}. Then
Φ(𝒞) ≥ (𝒜ℬ)^{1/2}.

*Proof.* Put A^♭ ≡ (𝒜/R)^{1/2} and B^♭ ≡ (ℬ/R)^{1/2}. By the power mean, Σ|A^♭|^p = R^{1−p/2}𝒜^{p/2} ≤ Σ|A|^p ≤ U_i
for p ≥ 2, and max|A^♭| ≤ max|A|. The same holds for B. So (A^♭, B^♭) satisfies 𝒞, and
Σ A^♭B^♭ = (𝒜ℬ)^{1/2}. ∎

Any bound derived from 𝒞 alone is ≥ Φ(𝒞). This covers Hölder, Riesz–Thorin interpolation, dyadic level-set
decompositions and every other rearrangement-invariant argument.

By Proposition 2, 𝒜 ≫ (Q/Y′)P_a^{1/6}. This holds also when the rows are only those with ξ(m) ≠ 0, i.e. m prime
to S (step (iv-e)), so restricting the Cauchy–Schwarz step to the rows where ξ(m) ≠ 0 does not help. So after the
normalisation Q^{−1/2} the output is
≫ Q^{−1/2}(Q/Y′)^{1/2}P_a^{1/12}ℬ^{1/2}. The exceptional factor is untouched. The only remaining room is in ℬ, i.e.
in Lemma 15.1, and Lemma 15.1 already sits at the diagonal size Z^{M′} [HEURISTIC].

**Theorem 3′ [PROVED, conditional on flat fourth moments].** Assume in addition Σ|A|⁴ ≤ κ_A𝒜²/R and
Σ|B|⁴ ≤ κ_Bℬ²/R. Then constraints with exponents in [1, 2) may be added to 𝒞, and
Φ(𝒞) ≥ (κ_Aκ_B)^{−1/2}(𝒜ℬ)^{1/2}.

*Proof.* For 1 ≤ p < 2, interpolation between ‖·‖_p and ‖·‖₄ gives
‖A‖_p ≥ κ_A^{−(1/p−1/2)} R^{1/p−1/2} ‖A‖₂ [EXACT, Part G: θ = p/(4 − p)]. So the flat configuration scaled by
κ_A^{−1/2} meets every valid constraint with p ≥ 1. The same holds for B with κ_B. ∎

Status of the flat-fourth-moment hypotheses:
* **For A.** The pairing structure of §5.2 predicts κ_A = 2 + o(1) [HEURISTIC]. The model gives 1.99–2.04 at
  every P tested [MEASURED, §7].
* **For B.** B is a smoothed completed row of central-value type. Moments of the form R(log R)^c are expected
  [HEURISTIC], which costs only Z^ε.

So no sub-L² improvement of either factor is available, and none is expected.

### 4.1 The variants named in Strategy 2

* **(a) Hölder with the 4th or 6th moment of the row sums.** By Lemma 1 and Corollary 1, e_H(2j) ≥ e_CS = x′/2 + b/12.
  No gain.
* **(b) The higher moment on the B side (‖A‖_p‖B‖_{p′} with p < 2).** This needs Σ|B|^{p′} with p′ > 2, which
  Lemma 15.1 does not provide, and an ‖A‖_p below the flat value, which Theorem 3′ excludes. No gain.
* **(c) Weighted Cauchy–Schwarz, |ΣAB|² ≤ (Σλ_m^{−1}|A_m|²)(Σλ_m|B_m|²).**
  * The optimal weight λ = |A|/|B| gives (Σ|A||B|)², which Theorem 3 covers.
  * Now take structured weights: smooth in q_m/Q and arg m, or periodic in m modulo a fixed modulus, or a
    nonnegative amplifier |Σ_ℓ x_ℓψ_ℓ(m)|². The exceptional main term of Σλ_m|A_m|² is then ⟨λ⟩_ex times the
    unweighted main term, where ⟨λ⟩_ex > 0 [PROVED-MT].
    * For radial λ, ⟨λ⟩_ex = M_{λΩ̃}(1/6)/M_{Ω̃}(1/6).
    * For periodic λ with modulus L prime to S, it is the mean of λ. Poisson over each class r + LO keeps the
      untwisted frequencies with weight 1/q_L. The extra frequencies carry the twist χ_•(L)^{−1}, which is not a
      Kummer character of S-units, and are incoherent. The same holds for the sublattices m₂O. So the excess is
      equidistributed in residue classes and sublattices of moduli prime to S.
    * For moduli built from S-primes, the coherent classes are redistributed between rows according to r_π, as in
      step (iv-e). Every class with all r_π ≤ 4 still keeps a positive share on every class of rows prime to S.
  * On the B side only Lemma 15.1 is available, so Σλ|B|² ≤ (max λ)Z^{M′}. Since ⟨λ^{−1}⟩·max λ ≥ 1, there is no
    gain.
* **(d) Partitions of the columns (colouring the exceptional graph).** Each fraction d/s has ≍ P_a^{1/6}
  exceptional partners within the smoothing scale Q^{−1/2}. Take K ≍ P_a^{1/6} classes, none containing an
  exceptional pair. Then Σ_F ‖A^{(F)}‖₂ ≍ K((Q/Y′)/K)^{1/2} = P_a^{1/12}(Q/Y′)^{1/2} [EXACT algebra, Part F]. No
  gain.
* **(e) Mellin-weight engineering (a weighted Gram bound in the v-variable of (6.2)).**
  * At height v, the exceptional term carries the column factor |∫W₁(r)r^{−5/6+iv}dr|².
  * The signal carries M(1/6)Ŵ₁(1), with M(1/6) ∝ ∫W₀(t)t^{−1/6}dt (Part E and (7.2)).
  * Both column factors are low-frequency functionals of u ↦ W₁(eᵘ) at the same O(1) scale. Since W₀ ≥ 0,
    |Ŵ₀(iv)| ≥ Ŵ₀(0)/2 for |v| ≲ 1/L₀.
  * Impose vanishing moments ∫W₁(r)r^{−5/6}(log r)^j dr = 0 for j < k. This lowers the exceptional coefficient
    relative to the signal by about (cL₁/L₀)^k, where L₀, L₁ are the log-widths of W₀, W₁ [HEURISTIC]. That is a
    constant.
  * A power of Z would need L₀/L₁ ≥ Z^κ. That means either row weights spread over e^{Z^κ} scales, or column
    weights of log-width Z^{−κ}. The latter costs Z^{κJ_Gr} in the seminorm factors (1 + ·)^{J_Gr} of Prop 15.2
    and the same order in the signal factor Ŵ₁(1).
  * No exponent gain.
* **(f) The other averages in (6.2) and (15.8).**
  * The v-integral is dominated by |v| ≲ 1, where the exceptional term is present.
  * The sum over σ ∈ T is finite.
  * The binding tuple d = 0 is a single tuple, and A does not depend on the slots.

  There is nothing to amplify.
* **(g) Outside the scope of Theorem 3.** Theorem 3 does not cover arguments that use more than the magnitudes
  of A and B. Two examples:
  * Factorising A or B into shorter polynomials before applying Hölder. A has no product structure: the column
    weight W₁(q_s/Y′) does not factor, and g(s₁s₂, 1) carries the cross symbols χ_{s₁}(s₂)χ_{s₂}(s₁).
  * Using bilinear (phase) information on Σ A_m B_m.

  These are restructurings of the separation. They belong to Strategy 1 or to a different probe and are not
  analysed here.

---

## 5. Higher moments

**5.1 [PROVED, given Proposition 2]. Corollary 1.** The 2j-th moment carries P_a^{j/6}.

**5.2 Structure of the 2j-th moment [HEURISTIC].**
* **Dual range and cross symbols.** Poisson in m applied to |A_m|^{2j} has dual range Y′^{2j}/Q. For coprime
  columns,

    g(s₁, −m)⋯g(s_j, −m) · conj(g(t₁, −m)⋯g(t_j, −m)) = (product of Gauss sums) · conj(χ_{s₁⋯s_j}(−m)) χ_{t₁⋯t_j}(−m).

  The Gauss sum of the product character factors with cross symbols χ_{s_i}(s_k)χ_{s_k}(s_i) =
  R(s_i, s_k)χ_{s_i}(s_k)².
* **No single coherent sixth power.** The cubic symbols χ_{s_i}(s_k)² oscillate. So for j ≥ 2 a single
  sixth-power frequency is not coherent.
* **Pairings.** The coherent configurations are products of j pairings, each either diagonal or exceptional.
  This gives Σ|A|^{2j} ≈ j!·R·V^j with V = (1/Y′)(𝔡 + 𝔢P_a^{1/6}), which is the complex-Gaussian value. The root
  then returns P_a^{1/12}.
* **The other model.** A "coherent single sixth power" model, Σ|A|^{2j} ≈ (Q/Y′^j)(Y′^{2j}/Q)^{1/6}, would be
  worse than Cauchy–Schwarz by Q^{(j−1)/(12j)}. At M′ = 5/6 that is Z^{5/144} for j = 2 and Z^{5/108} for j = 3
  [EXACT algebra, Part B].

Either way there is no gain. The pairing model is what the measured kurtosis 2.00 ± 0.04 shows.

**5.3 What a provable fourth moment would need [EXACT exponent; literature RECALLED].**
* **The sixth-power rows.** The rows m = εa⁶, of which there are ≍ Q^{1/6}, have

    A_m = 𝔄_ε(a) := Y′^{−3/2} Σ_{(s,a)=1} c_σ(s) W₁(r_s) r_s^{−1+iν} conj(χ_s(−ε)) g_{χ_s}(s, 1).

* **What 𝔄 is.** By (4.7), g_{χ_s}(s, 1)/√q_s = μ(s)α(s)G(s)conj(γ₂(s)) on squarefree s. So 𝔄 is a Möbius-twisted
  (conjugate) cubic Gauss sum with an angular twist.
* **The requirement.** A flat fourth-moment bound would require |𝔄| ≤ Z^{−1/18} at (M′, y′, b) = (5/6, 23/48, 1/8)
  [EXACT, Part D]. That is a power saving of Y′^{−8/69}.
* **Literature.** Sieve methods for cubic Gauss sums suggest such savings may be within reach: Heath-Brown, "Kummer's
  conjecture for cubic Gauss sums" (2000), proves x^{5/6+ε} for sums over primes [RECALLED; not checked for the
  Möbius or angular versions]. This also qualifies the earlier description, in `beat78-amplifier.md` §6, of these
  sums as "bounded trivially".
* **No effect on the outcome.** Even a flat fourth moment gives Hölder = Cauchy–Schwarz (Theorem 3).

---

## 6. The B side

Lemma 15.1 bounds only Σ|B_m|². B_m is a smoothed completed cubic-theta row of central-value type, of square-root
size on average.

Hölder gains from B only if B is peaky, i.e. if its sub-L² moments fall below the flat value. Theorem 3′ excludes
that under a flat fourth moment of B, and no available estimate supplies peakiness.

A fourth moment Σ|B|⁴ ≪ Z^{M′+ε} is not available either. B_m² has length Z², against R = Z^{M′} < Z rows, which
is beyond the cubic reflection used in Lemma 15.1 [HEURISTIC].

Even if B were peaky on a sparse set E, using that would need a restriction estimate
Σ_{m∈E}|A_m|² ≪ (|E|/R)𝒜. That is the same flatness of A.

---

## 7. Measurement in a finite model

**The model [MEASURED]** (`beat78-prop152-holder-meansquare.py`, `beat78-prop152-holder-dual.py`).

  A_m = Y^{−3/2} Σ_s W(q_s/Y)(Y/q_s) g_{χ_s}(s, −m),

with:
* s running over squarefree primary s outside {2, λ}, Y/2 < q_s ≤ Y;
* W a C^∞ bump on [1/2, 1], c ≡ 1, ν = 0;
* rows m ∈ O with Q/2 ≤ q_m ≤ Q, weighted by the same bump in q_m/Q;
* P := Y²/Q, which plays the role of P_a.

The prime Gauss sums satisfy |g|² = q. The formula g(s, −m) = conj(χ_s(−m)) g(s, 1) is checked against the
definition on random rows.

**Scope.** At these sizes the exceptional frequencies are the S-units k = u2^iλ^j (a = 1). The first
nontrivial sixth power a⁶ has norm 7⁶ = 117 649, so the asymptotic P^{1/6} law is out of reach. The test is
therefore done frequency by frequency.

### 7.1 Exact comparison: excess equals the exceptional dual term

The measurement uses every row of the annulus, not a sample. The prediction is

  Σ over S-units k of Y^{−3} Σ_{s₁≠s₂ coprime} w w F(s₁, s₂; k) Ŵ(Q N(k)/(q₁q₂))/Ŵ(0),

with F from Lemma 13.3 and Ŵ the planar transform of the row weight. Its ratio Ŵ(v)/Ŵ(0) is 0.904, 0.234, −0.294
and 0.196 at v = 0.01, 0.1, 0.25 and 1. The negative values explain the negative excess at small P.

**The coherent frequencies.**
* k = ±1, ±27 (= ∓λ⁶) and ±64 (= ±2⁶) each carry 0.00314 at Y = 2000 and 0.00321 at Y = 4000, in units of
  Y × (row mean). That is about 3.6% of the diagonal each. The pair ±λ³ carries 0.00310 and 0.00318.
* These are exactly the k whose class lies in ⟨−1, λ³⟩ modulo sixth powers. In this unrestricted-column model,
  coherence requires χ_•(k) to be a function of the square class (Part C).
* The units ±ω^{±1} and similar carry ≈ 0.

The table gives Y × (excess of the weighted row mean of |A_m|² over its diagonal).

| P | rows (Y=2000) | measured | predicted | rows (Y=4000) | measured | predicted |
|---|---|---|---|---|---|---|
| 4 | 1 813 680 | −0.00197 | −0.00202 | 7 255 272 | −0.00207 | −0.00203 |
| 8 | 906 984 | −0.00178 | −0.00160 | 3 627 576 | −0.00164 | −0.00168 |
| 16 | 453 402 | +0.00052 | +0.00054 | 1 813 680 | +0.00047 | +0.00048 |
| 32 | 226 824 | +0.00430 | +0.00411 | 906 984 | +0.00390 | +0.00401 |
| 64 | 113 304 | +0.00410 | +0.00416 | 453 402 | +0.00472 | +0.00455 |
| 128 | 56 700 | +0.00314 | +0.00268 | 226 824 | +0.00330 | +0.00315 |
| 256 | 28 356 | +0.00426 | +0.00449 | 113 304 | +0.00503 | +0.00481 |
| 512 | 14 166 | +0.00725 | +0.00651 | 56 700 | +0.00560 | +0.00648 |
| 1024 | 7 074 | +0.01014 | +0.01058 | 28 356 | +0.01230 | +0.01048 |

* **Diagonals.** Y·diag = 0.08845 with 286 columns (Y = 2000) and 0.08900 with 561 columns (Y = 4000). The
  kurtosis is between 1.99 and 2.08.
* **Residual.** The residual is at most 0.0007 for Y = 2000 and at most 0.0018 for Y = 4000, largest at
  P ≥ 512. This is the nonexceptional dual frequencies, whose Prop 15.2 bound grows like P²/Y.

### 7.2 Sampled run at Y = 20000: flatness and control

The run used 2816 columns, 2265 primes and 40 000 sampled rows per P, with P from 1/16 to 4096.
* **Excess.** It is 0 within noise for P ≤ 16. It switches on at P ≈ 32, then rises to 0.0110 at P = 1024 and
  0.0101 at P = 4096, about 12% of the diagonal 0.0881. This is the same S-unit staircase as in §7.1.
* **Kurtosis.** E|A|⁴/(E|A|²)² lies between 1.989 and 2.037 at every P. The complex-Gaussian value is 2.
* **Top 1%.** The top 1% of rows carry 0.0555–0.0577 of Σ|A|². An exponential law for |A|² predicts
  (1 + ln 100)/100 = 0.0561.
* **Control.** With the Gauss sums replaced by √q_s·e^{iθ_s} for random θ_s, the excess has
  |excess|/s.e. ≤ 1.95 at every P.

### 7.3 Rows divisible by an S-prime: check of step (iv-e)

Script: `beat78-prop152-holder-sublattice.py`. The per-row excess is split between rows with λ | m and rows with
λ ∤ m.
* The predictions use the exact sublattice dual formula (Poisson over λO, S-unit frequencies, true weight Ŵ).
* The measurements are exact averages over all rows of the annulus.

Two models:
* **Untwisted, c ≡ 1.** Every coherent class has r_λ ∈ {0, 3} ≤ 4, so the prediction is equidistribution between
  the two kinds of rows.
* **Twisted, c(s) = χ_s(λ).** The coherent classes are ±λ² (r_λ = 2) and ±λ⁵ (r_λ = 5). The prediction is:
  * the ±λ⁵ class sits on λO, where it appears already through κ = ±1;
  * the λ-coprime rows see only ±λ², which has norm 9 and switches on later.

Y × (excess per row), Y = 4000 (561 columns):

| model | P | λ \| m: measured | predicted | λ ∤ m: measured | predicted |
|---|---|---|---|---|---|
| c ≡ 1 | 64 | +0.00428 | +0.00435 | +0.00494 | +0.00465 |
| c ≡ 1 | 256 | +0.00557 | +0.00457 | +0.00476 | +0.00492 |
| c ≡ 1 | 1024 | +0.01043 | +0.01016 | +0.01323 | +0.01064 |
| c = χ_s(λ) | 64 | +0.00374 | +0.00350 | −0.00512 | −0.00504 |
| c = χ_s(λ) | 256 | +0.00921 | +0.00905 | −0.00048 | −0.00008 |
| c = χ_s(λ) | 1024 | +0.00720 | +0.00820 | +0.00106 | +0.00035 |

Y = 2000 gives the same pattern with larger deviations, up to 0.004 at P = 1024, where the annulus has only
about 3500 rows. In the twisted model the class with r_λ = 5 puts its excess on the λ-divisible rows, as step
(iv-e) predicts. In the untwisted model the excess is equidistributed between the two kinds of rows.

### 7.4 Readings

1. The excess of the row mean square over its diagonal is the exceptional dual term. The two agree at two sizes
   and at every P tested.
2. The excess exists only because of Gauss-sum alignment. The randomised control has none.
3. The excess is spread over the rows like an inflated variance, not concentrated on a sparse set. This is the
   regime in which Theorem 3′ applies with κ_A ≈ 2.
4. Rows divisible by S-primes redistribute whole classes according to r_π, as computed in step (iv-e). On rows
   prime to S the classes with every r_π ≤ 4 remain (§7.3).

---

## 8. What a successful restructuring would have to deliver

* **The bound.** At the binding tuple d = 0 one would need |I_tuple| ≪ X′^{1/2}P_a^{θ/2}Z^ε with θ < 1/6, uniformly
  in the tuple. The d > 0 tuples must stay within their factor Z^{−d}.
* **Where it cannot come from.** By §§2–4 such a bound cannot come from separate moment information on A and B.
  It needs information on Σ_m A_m B_m beyond ‖A‖·‖B‖, namely phase correlation between B and the
  exceptional, pair-correlated part of A.
* **Note for Strategy 1.** The excess is not a low-rank component of the row vector A. It is a pair correlation
  of the column coefficients: clusters of aligned fractions d/s whose determinants d₁s₂ − d₂s₁ are exceptional
  (εa⁶). A subtraction scheme therefore has to act on the column side. Row restrictions to residue classes or
  sublattices of moduli prime to S keep the exceptional term in proportion (§4.1(c)). Row restrictions by
  S-primes move whole classes onto πO when r_π = 5, but the classes with all r_π ≤ 4 (for example ε**) stay on
  the rows prime to S (step (iv-e), §7.3).
* **Endpoint.** For every θ ≥ 1/6 the exact identity σ_low − 7/8 = (2M − 1 − 4ℓ)/24 + b(θ/2 − 1/12) ≥ 0 holds on
  Lemma 15.1's range (§1.2). So Strategy 2 cannot produce an endpoint certificate below 7/8 in the style of
  Lemma 20.2.

---

## 9. Status

| item | status |
|---|---|
| Lemma 1 (Hölder = Cauchy–Schwarz with the induced second moment) | PROVED |
| Corollary 1 (2j-th moment ≫ Q Y′^{−j} P_a^{j/6}) | PROVED given Prop 2, hence PROVED-MT |
| Scope of Theorem 3: magnitude-based arguments only; factorised Hölder and bilinear arguments excluded | stated (§4.1(g)) |
| Prop 2, main term: Poisson identity, exceptional coefficient, rank one, a-sum, positivity | PROVED-MT |
| Prop 2, error terms | sketched; they rely on estimates inside Prop 15.2 |
| Prop 2 on rows prime to S (step (iv-e): class ratio ρ_π; the class ε** = ε*λ³ survives) | PROVED-MT; EXACT for λ³, 4, −1 ∈ 𝒦₀ (6045 moduli); MEASURED split of the excess between λ-divisible and λ-coprime rows (§7.3) |
| (iv-a) corrected to the full-frequency condition 6 \| c_p + v_p(k) | PROVED |
| The class ε* and the identity Φ ≡ 1 on σ × σ | PROVED; EXACT model check (5982 pairs) |
| Kummer-theory explanation of why ε* exists | RECALLED |
| M_w(1/6) > 0 for nonnegative row weights | EXACT closed form; the argument of (7.2) |
| Theorem 3 (method limit, moment orders ≥ 2) | PROVED |
| Theorem 3′ (orders ≥ 1) | PROVED, conditional on flat fourth moments; for A, MEASURED κ_A ≈ 2 |
| Exponent chain and no-gain certificate σ_low − 7/8 = (2M−1−4ℓ)/24 + b(θ/2 − 1/12) | EXACT |
| Colouring algebra; coherent 2j-moment model loss Q^{(j−1)/(12j)} | EXACT algebra |
| 2j-th moment pairing structure | HEURISTIC; consistent with measurements |
| Mellin-weight engineering gives constants only | HEURISTIC scaling argument |
| Flat 4th moment of B; Lemma 15.1 at diagonal size | HEURISTIC |
| Power saving for the Möbius/angular cubic Gauss sum 𝔄 | RECALLED literature, not checked; irrelevant to the outcome |
| Excess = exceptional dual term (Y = 2000, 4000, exact); flatness (Y = 20000) | MEASURED |
| The a⁶ regime (P ≳ 7⁶·10²) | not reachable numerically |

---

## 10. Reproduction

All scripts are in `tmp/` and run with `.venv-arb/bin/python` from the repository root.

* **`beat78-prop152-holder-algebra.py`.** 24 exact checks (sympy/Fraction), about 1 s:
  * Part A: exponent chain and the no-gain certificate;
  * Part B: Hölder versus Cauchy–Schwarz;
  * Part C: the square-class bicharacter;
  * Part D: the Z^{−1/18} requirement;
  * Part E: M(1/6) > 0;
  * Part F: colouring;
  * Part G: interpolation.

  Log: `beat78-prop152-holder-algebra.log`.
* **`beat78-prop152-holder-correlation.py`.** Exact Z[ω] checks T1–T6: reciprocity, Lemma 13.3, the ε* search and
  Φ ≡ 1, and the rank-one form. About 3 s. Log: `beat78-prop152-holder-correlation.log`.
* **`beat78-prop152-holder-kummer.py`.** Checks which Kummer characters χ_s(ε) are functions of s mod 4: λ³, 4 and
  −1 are; λ, 2 and ω are not. 6045 moduli, about 20 s. Log: `beat78-prop152-holder-kummer.log`.
* **`beat78-prop152-holder-sublattice.py [Y]`.** Splits the excess between rows divisible by λ and rows prime to
  λ, for the untwisted model and the model twisted by χ_s(λ), using the exact sublattice dual formula. Outputs:
  `…-sublattice-Y2000.{log,json}` and `…-Y4000.{log,json}`.
* **`beat78-prop152-holder-dual.py [Y]`.** Exact full-annulus excess against the exceptional dual prediction.
  Outputs: `beat78-prop152-holder-dual-Y2000.{log,json}` (about 40 s) and `…-Y4000.{log,json}` (about 4.5 min).
* **`beat78-prop152-holder-meansquare.py [Y] [rows] [seed]`.** Sampled run with kurtosis, top-1% share and the
  random-phase control. Outputs: `…-meansquare-Y20000.{log,json}` (40 000 rows, seed 3, about 80 s) and
  `…-Y2000.{log,json}`.
