# Strong band-edge and positive-phase endpoint measure — independent PASS

> Curated mathematical source or internal audit. All mathematical sections are retained. Historical producer headers may predate acceptance; current claim scope follows the paired audit and module, not those old workflow labels. Original and published SHA-256 identities are recorded in the dependency inventory. Internal review is not external peer review.

30 October 2026. Independent analytic review plus copied and independent exact algebra checks. The reviewed producer source is `prolate_endpoint_flow/STRONG_EDGE_LIMIT_AND_POSITIVE_PHASE_MEASURE.md`, SHA256 `361f984698daa9c859db45c779bc4e78d8fdc8eb5af1cfb9008c2de98a424afe`. **No source correction is required.** This receipt accepts the weak joint endpoint spectral measure, not a growing-collar operator transfer or Weil bound. The separate differential-moment supplement is outside this receipt.

## 1. Exact finite operators and physical normalization

With the source's full additive interval and angular unitary Fourier transform, direct composition gives B*B=BB*=K and B²=RK. Entire continuation of a compactly supported Fourier transform gives injectivity of B and B*, so the polar factor is unitary, not merely a partial isometry. Normality gives U²=R and U⁴=I. The displayed four phase projectors are therefore genuine orthogonal spectral projections. They commute with the concentration and differential operators through the common prolate basis. The theorem can use the intrinsic phases and does not depend on an asymptotic ordering claim.

Fresh primary verification of [Bonami–Karoui, printed pp.229–230, Eq.(2)](https://comptes-rendus.academie-sciences.fr/mathematique/item/10.1016/j.crma.2014.01.004.pdf) confirms the differential expression, common regular prolate basis and exact factor c/(2π) multiplying the unnormalized finite Fourier square. The [second primary treatment, introduction](https://arxiv.org/html/1405.3676v2) confirms the regular, real-analytic differential eigenfunctions and increasing differential labels. Its abbreviated Fourier-square normalization is not used in place of the directly checked factor.

The natural nonnegative form realization is the regular zero-flux realization, not a Dirichlet endpoint-value realization. In the maximal differential domain, p f' has endpoint limits; the regular realization sets them to zero. This agrees with the Friedrichs extension of the initially compactly supported form: logarithmic cutoffs near either endpoint have weighted derivative energy tending to zero, since p is comparable to the endpoint distance and the cutoff energy is O(1/|log ε|). Thus constants are not excluded by a hidden Dirichlet condition. In particular, C_c∞ is contained in the operator domain. No claim that C_c∞ is an operator core for this second-order realization is needed.

The physical scaling c=2πλ² turns the finite Fourier kernel on [-λ,λ] into B exactly. Evaluating the regular eigenrelation at x=1 gives

    |<ψ_n,v_c>|² = (2π/c) κ_n |ψ_n(1)|²
                 = κ_n |e_n(λ)|²/λ.

This is an ordinary vector spectral weight, not a limiting endpoint distribution. Direct differentiation of the sinc kernel gives the rank-two coefficient 1/(2π). Parity and the endpoint relation then give κ_n'=|<ψ_n,v_c>|²/π, ∂_c logκ_n=2|ψ_n(1)|²/c and ∂_λ logκ_n=4|e_n(λ)|². None of these derivative identities is used to differentiate an asymptotic. The normalization uses the full interval throughout; there is no extra factor two from passing to an even half-interval norm.

## 2. Strong edge limit and scalar measure

Demodulation shifts the Fourier band exactly to [-2c,0]. For each fixed zero-extended L² vector, dominated convergence of the full-line multipliers proves T_c→A strongly. Uniform boundedness and polynomial approximation give f(T_c)→f(A) strongly for every continuous f on [0,1]. Operator-norm convergence is neither claimed nor needed.

The map Vf(u)=sech(u)f(tanh u) is unitary because dx=sech²u du. Both half-density factors are essential: the transformed finite Hilbert kernel is precisely PV[1/(π sinh(u-v))]. The nonlinear change of principal-value cutoff adds no diagonal term; the two transformed cutoff lengths have ratio tending to one. Pairing the positive and negative half-lines and expanding 1/sinh gives its multiplier -i tanh(πξ/2). The beta substitution t=e^{2u} gives F(sech)(ξ)=sqrt(π/2)sech(πξ/2). These signs yield the negative-Hardy compression multiplier

    a(ξ)=(1+exp(πξ))^-1,

not its complementary multiplier. The vector density (π/2)sech²(πξ/2)dξ pushes forward to exactly 2 da, with total mass two. This verifies the full bounded-vector concentration measure without a counting theorem.

## 3. The four phase measures and removal of the small-κ cutoff

The reflection vector after demodulation is exp(-2icx), weakly zero by Riemann–Lebesgue. The exact vectors B*v_c and Bv_c have uniformly bounded L² norms and mass concentrating respectively at +1 and -1. Off an ε-endpoint neighborhood, their squared mass is at most 2/(πcε); against any fixed L² test vector, the remaining endpoint interval is made small by absolute continuity of its L² integral. Multiplication by a unit-modulus demodulator does not change this argument. Thus both demodulated endpoint vectors are weakly zero.

A strongly convergent demodulated functional-calculus vector can be paired with each of these bounded weakly zero vectors. For a test f vanishing near κ=0, g=f/sqrt(κ) is bounded continuous, and the polar identities U f(K)=B g(K) and U* f(K)=B* g(K) are legitimate bounded identities. No inverse square root is applied directly to v_c. The three nonidentity phase terms vanish, leaving exactly a quarter of the full limit for every phase.

For a general continuous f, the discarded phase mass is bounded by the full positive concentration measure on a small neighborhood of zero. A continuous majorant and the already proved full limit bound its limsup by a quantity tending to zero with that neighborhood. This proves the quarter split including total mass, without a differentiated count, neighboring-eigenvalue pairing or a uniform lower spectral gap. Each phase limit is (1/2)da and has total mass 1/2.

## 4. Self-adjoint differential limit and joint convergence

Exact conjugation cancels all c² terms and gives the source's expression

    D_c = -2πi(2p∂_x+p') -(2π/c)∂_x p∂_x.

For every compactly supported smooth f, f lies in the domain of D_c: M_cf is again compactly supported smooth and lies in the regular domain of L_c. The transformed first-order expression is -4πi∂_u on C_c∞(R). This is essentially self-adjoint, for example by Fourier transformation or by the deficiency equations, whose nonzero exponential solutions fail to be in L² at one end of R. The unitary tanh map takes the stated smooth compact core onto C_c∞(R). Its closure D consequently has the stated core.

On that core D_cf→Df. The source's resolvent identity is valid on these common domain vectors, and the dense range of (D-i) on the core plus the uniform self-adjoint resolvent bound extends convergence to every vector. The same argument at -i gives strong resolvent convergence. This argument requires no semiboundedness uniform in c and no second-order operator-core assertion. Continuous C0 functional calculus follows, so products f(T_c)h(D_c) converge strongly for f continuous on [0,1] and h in C0(R).

The finite operators commute spectrally through their common basis; the limits commute because they are simultaneous Fourier multipliers after V. The limit D multiplier is 4πξ, so the concentration coordinate is exactly

    κ(δ)=(1+exp(δ/4))^-1.

The same three weak-vector pairings apply to these product tests, proving the phase-quarter split for joint compact tests. Full δ measures converge against C0 and their limiting mass is two, equal to every finite-c mass. Choosing continuous compact cutoffs whose limiting mass tends to two proves tightness, rather than assuming it from vague convergence alone. Every phase measure is dominated by the full positive measure. Tensor-product approximation on compact δ sets and this tightness give joint weak convergence against every bounded continuous G(δ,κ).

The final physical positive-phase measure is therefore exactly

    (1/λ) Σ_{χ_n>0} κ_n |e_n(λ)|² G(δ_n,κ_n)
      → (1/8) ∫ κ(δ)(1-κ(δ)) G(δ,κ(δ)) dδ.

Indeed the full δ density is (1/8)sech²(δ/8), and its quarter is (1/32)sech²(δ/8)=κ(1-κ)/8. This verifies both the logistic scale and the quarter normalization independently of the producer's scalar replay.

## 5. Sharp positive head, accepted consequences and exclusions

The positive head is phase +1 and κ≥1/4. The limiting measure gives zero mass to its boundary, so the sharp cutoff transfers by the positive-measure approximation argument. On the limiting graph this is δ≤4log3. The weighted head mass is 3/8. Multiplication by 1/κ on the selected interval is bounded, giving the unweighted endpoint mass log2. The stated fixed negative-δ tail mass, 1/[2(1+exp(D/4))], also has the correct sign and factor.

The result removes the endpoint-measure hypothesis from the cited ideal model. It proves no quantitative convergence rate, moving-collar norm approximation, growing-moment estimate, uniform modal-shape bound, signed Schur inequality, global Weil lower bound or enlarged finite-support positivity range. In particular fixed-cutoff tightness cannot by itself be substituted for a quantitative growing-window operator theorem. The separate moment supplement may provide additional information, but was not needed or accepted through this receipt.

## Replay and pinning

The producer's six exact checks were run from a copied source and script in `independent_review/prolate_strong_edge_replay/`; the resulting JSON is byte-identical to the producer output. A separate independent script checks twelve scalar items, including all sixteen phase-projector values, rank-two normalization, physical scaling, the Hilbert half-density kernel and head/tail masses. No numerical eigenvalue sweep was performed. These checks certify their algebra only; the domain, topology, weak-vector and measure arguments were reviewed analytically above. The companion JSON pins the source and evidence files by SHA256.
