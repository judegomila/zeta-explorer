# Weak head projector and compact-channel transfer — independent PASS

> Curated mathematical source or internal audit. All mathematical sections are retained. Historical producer headers may predate acceptance; current claim scope follows the paired audit and module, not those old workflow labels. Original and published SHA-256 identities are recorded in the dependency inventory. Internal review is not external peer review.

30 October 2026. Scoped independent analytic review of `prolate_endpoint_flow/WEAK_HEAD_OPERATOR_AND_COMPACT_CHANNEL_TRANSFER.md`, SHA256 `6fd3197cec2972e7e23fcda4719591dbfb7443f769ac9373f9ab89d88e2af6e6`. **No source repairs are required.** The prerequisite strong-edge theorem is already accepted by `STRONG_EDGE_POSITIVE_PHASE_MEASURE_AUDIT.json`, SHA256 `12a2aeaeae6479651e13f0b499a284ca21842e583a4dc064f9a8a7755a93a6d8`.

This receipt proves the fixed-W weak-projector/compact-channel transfer, including its immediate Hilbert–Schmidt trace consequence. It does not by itself accept a growing-W passage, collective channel synthesis or a Weil inequality. Those use separate estimates and receipts.

## 1. Arbitrary fixed vectors and threshold calculus

For every fixed a in L²[-1,1], the displayed Fourier identities are exact, with prefactor sqrt(c). For example, the squared L² norm of B_c* M_c a on x<=1-ε is

    ∫_{-2c}^{-cε} |F(Ea)(s)|² ds,

which tends to zero by the L² Fourier tail. Its full norm is at most ||a||; the other vector is treated at x=-1. Demodulation changes no norms or local masses. Bounded endpoint-concentrated vectors converge weakly to zero by first restricting a fixed L² testing vector to a short endpoint interval, then taking c large on its complement. This argument requires no smoothness, pointwise Fourier decay or uniformity over the entire L² unit ball. The reflected matrix coefficient is a Fourier coefficient of the L¹ product of two fixed L² vectors, so it also tends to zero.

The limiting Hardy compression is unitarily the strictly monotone logistic multiplier a(ξ). A level set a(ξ)=1/4 is a singleton and has Lebesgue measure zero; consequently its spectral projector is zero for every vector, not just for the constant vector. Strong convergence of the bounded self-adjoint T_c therefore extends to the two bounded functions h=1_[1/4,1] and g=h/sqrt(t). One can prove this without an extra spectral hypothesis: approximate these functions continuously off an arbitrarily small interval around 1/4, bound the vector norm of the error by its spectral mass there, and use continuous majorants and the vanishing limiting atom. The value of g near zero is identically zero, so there is no second discontinuity or unbounded inverse issue.

The polar identity U_c h(K_c)=B_c g(K_c), and its adjoint version, reduce the three nonidentity phase terms to pairings of the above weakly zero vectors with strongly converging functional-calculus vectors. It follows for every fixed a,b that

    Q_c=M_c*P_head,c M_c  →  Q=(1/4)1_[1/4,1](A)

weakly as operators. This is genuinely the actual positive Fourier-phase head, not the all-phase concentration head. The same proof works for any fixed threshold strictly between zero and one. Strong convergence of these projectors is impossible here: a strong limit of uniformly bounded projections would be a projection, whereas this nonzero limit has eigenvalue 1/4 on its range.

## 2. Compact sandwiches, uniformity and the HS trace consequence

A uniformly bounded weakly zero operator family Z_c gives S*Z_cS→0 in operator norm for every compact S. Approximate S in norm by finite-rank S_N; weak convergence is norm convergence on the resulting fixed finite-dimensional matrix, and the approximation errors are uniform in c. A finite net gives the same conclusion uniformly over any norm-compact family of compact operators.

For the specific finite-W kernels, |F_W|<=W, so ||S_W,r||_HS<=2W. Also

    |F_W(z-rξ)-F_W(z-r'ξ)| <= πW² |r-r'| |ξ|,
    ||S_W,r-S_W,r'||_HS <= (2π/√3)W² |r-r'|.

Thus their family is compact even in Hilbert–Schmidt norm for r in [0,1/2]. Uniformity over every integer j>=2 follows from r=1/j in this one fixed compact parameter set; no rate in c or fixed-label restriction is being smuggled in.

The same argument supplies a stronger useful *fixed-W* conclusion. If S is Hilbert–Schmidt, then S*Z_cS→0 in trace norm. Indeed, uniformly for ||Z_c||<=C,

    ||S*Z_cS-S_N*Z_cS_N||_1
      <= C (||S||_HS+||S_N||_HS)||S-S_N||_HS.

The finite-rank sandwich converges in trace norm, and HS approximation finishes the proof. The HS-compact channel family again makes this uniform in r. Taking traces gives uniform convergence of the finite-W actual channel HS squared norms as well as the operator-norm convergence explicitly stated by the producer. This is an immediate analytic consequence checked here, not a claim that arbitrary WOT limits converge in trace norm without HS sandwiches.

## 3. Exact actual-channel orientation and scaling

The defining actual map in `repo_leverage/ACTUAL_FINITE_COLLAR_CHANNEL_BESSEL_REDUCTION.md` is K:ℓ²(head)→L²(ξ), with modal kernel

    k_n(ξ)=λ^-1/2 ∫_0^W F(e_n)(λ+τ/λ)e^(-2πiξτ/j)dτ.

Substituting physical x=λz and e_n(λz)=λ^-1/2 ψ_n(z) cancels both scale factors. The result is k_n(ξ)=<ψ_n,M_c F_W(.-ξ/j)> for the convention antilinear in the first argument. This also verifies the cancellation of χ_n e_n(λ) in the producer's normalized modal notation; no small endpoint value is being divided after a limit.

The output Gram kernel is

    (KK*)(ξ,η)=Σ_n k_n(ξ) conjugate(k_n(η))
              =<M_c F_η,P_head,c M_c F_ξ>.

The kernel of S*Q_cS has ξ and η reversed. Hence KK* is the transpose, or equivalently the antiunitary complex-conjugate conjugation, of this positive Gram operator. This preserves operator norm and trace. The producer's transpose qualification is correct and necessary for this channel orientation; it is not an omitted conjugation. The same orientation holds on the ideal side.

## 4. Exact Euler transform and finite-W ideal kernel

The map J=(4π)^(-1/2) F V, with Fourier argument δ/(4π), is unitary to L²(dδ). The factor 1/2 multiplying J comes from the square root of the limiting projector weight 1/4. Substitution z=tanh u followed by z=1-2s gives exactly the coefficient 1/(4√2π) in the source's Euler integral. The Fourier exponent becomes s^(iη)(1-s)^(-iη), where η=δ/(8π); this fixes the sign.

Fresh primary verification of [DLMF 13.4.1](https://dlmf.nist.gov/13.4#E1) confirms the Euler formula and its hypotheses Re(b)>Re(a)>0. Here a=1/2+iη and b=1 satisfy them for every real δ; the normalized and ordinary Kummer functions agree because Γ(1)=1. [DLMF 5.5.3](https://dlmf.nist.gov/5.5#E3) gives Γ(1/2+iη)Γ(1/2-iη)=π/cosh(πη). Thus

    (1/2)J[e^(i2πτz)](δ)
      = [sech(δ/8)/(4√2)] Φ_δ(τ)
      = sqrt[κ(δ)(1-κ(δ))/8] Φ_δ(τ).

The coefficient at τ=0 and the normalized derivative Φ'_δ(0)=δ/2 both agree exactly. The beta integral is absolutely integrable at its two endpoints. Finite-W integration can be interchanged with this transform by the bounded finite-interval Bochner/Fubini argument, so it gives the complete displayed ideal finite-W kernel, not just its value or Taylor expansion at zero. The head becomes δ<=4log3 exactly.

Consequently the fixed-W actual and ideal channel operator squared norms, and their HS squared norms by Section 2 above, converge uniformly for every j>=2. No modal-shape approximation or differential-label tail argument is needed for this fixed-W proof.

## 5. Pins, evidence and strict scope

The independent script `prolate_strong_edge_replay/independent_weak_head_checks.py` passes eleven scalar checks, including seven exact Coulomb-series residual coefficients. Its first run encountered an audit-script symbol-assumption mismatch after converting an expression to text and back; keeping the original SymPy expression repaired that local test bookkeeping. No producer formula or source was changed. The final script and output are pinned by the companion JSON. These algebra checks are not substitutes for the analytic WOT, functional-calculus or compactness arguments above. No numerical spectral sweep was performed.

The separately pinned uniform projected-tail theorem may combine with this fixed-W result using a sequential fixed-W then W→∞ limit. That theorem and its constants are **not** re-audited or silently absorbed into this receipt. In particular the WOT assertion alone does not provide norm convergence of the projectors, a growing-collar rate, collective carrier control, the signed low-port pairing, trace-repair Schur positivity, correct gamma-complement coercivity or a global Weil floor. The present receipt closes precisely the fixed-collar operator-transfer dependency.
