# Heat-compatible fiber freezing and the exact missing theorem

Date: 3 October 2026. Status: exact compatibility identities and conditional transfer theorem; no new upper bound for the de Bruijn–Newman constant is certified here. This note supplements the audited four-dimensional projective/dual model. It does not modify or publish that model.

## 1. Main result

There is an exact heat lift with a frozen angular fiber. It retains the entire scalar problem. There is also an exact correction for nonconstant angular intertwiners. Neither gives a new zero-free region for free.

A sufficient completion contract is now precise:

> Fix a heat time t₀ and a strip half-width a₀ in the centered xi variable. For a sequence of distinct aₙ>a₀ tending to a₀, derive globally holomorphic right-half-plane transfer families whose specified scalar coefficients equal X_{t₀}(w−aₙ)/X_{t₀}(w+aₙ). Then Λ≤t₀+2a₀².

Boundedness or passivity is a useful way to supply holomorphy but is stronger than this implication needs. Identity with the scalar ratios is essential. A single fixed-width ratio needs an additional non-cancellation theorem; merely deleting its poles by cancellation can hide forbidden scalar zeros.

For t₀=0.123637595 and a₀=0.1, this contract gives Λ≤0.143637595<0.145. These numbers specify a conditional target, not an established result. The alternative direct scalar completion is a certified global strip |Im z|≤0.2 for H_{0.123637595}.

## 2. Normalization audit, with two independent derivations

Use exactly the Polymath normalization:

H_t(z)=∫₀^∞ e^{t u²} Φ(u) cos(zu) du,

Φ(u)=Σ_{n≥1}(2π²n⁴e^{9u}−3πn²e^{5u}) exp(−πn²e^{4u}),

H₀(z)=ξ(1/2+iz/2)/8.

Set

X_t(w)=8H_t(−2iw),     X₀(w)=ξ(1/2+w).

The chain rule gives

∂_w²X_t(w)=−32 H_t''(−2iw),
∂_tX_t(w)=−8 H_t''(−2iw)=(1/4)∂_w²X_t(w).

The integral independently gives

X_t(w)=8∫₀^∞ e^{t u²}Φ(u)cosh(2wu)du,

and ∂_w² cosh(2wu)=4u²cosh(2wu), giving the same generator L=(1/4)∂_w².

For t>0 the exact Gaussian formula is

X_t(w)=(πt)^(−1/2)∫_R exp(−v²/t) X₀(w+v) dv.

The Gaussian moment identity E exp(2uV)=exp(tu²), for V of variance t/2, proves it. Super-exponential decay of Φ and sub-Gaussian growth of X₀ on horizontal lines justify Fubini and differentiation. Thus positive heat time mixes the real parts of the Mellin weight w. It does not act on a single weight by scalar multiplication.

With q=2u and even extension of Φ,

X_t(w)=2∫_R Φ(q/2) exp(tq²/4) exp(wq) dq.

This is a rigorous bilateral Laplace/Mellin-density model. The factor exp(tq²/4) is unbounded on unweighted L²(dq) for t>0, although the displayed theta density lies in its domain for every real t. On w=iτ the heat evolution corresponds to the backward diffusion generator −(1/4)∂_τ². The passive angular Hilbert structure therefore does not automatically make this heat evolution a bounded contraction semigroup.

Heat time t, centered-variable strip width a, harmonic index m, spatial line L, and finite Hankel truncation length are different parameters. None may be identified merely by using the same letter.

## 3. What the fibers actually are

The underlying geometry is V=R⁴, projective twistor space P(V), dual P(V*), and spacetime Gr(2,V). For a plane L⊂V the incidence fiber is P(L), a projective line. The following possible freezes are mathematically different.

### 3.1 Angular K-type freeze

In the compact picture H=L²_even(S³), let H_m=Y_{2m}(S³), dim H_m=(2m+1)², and let P_m be the orthogonal harmonic projection. The normalized geometric transform is

A(w)|_{H_m}=b_m(w)I,

b_m(w)=∏_{j=1}^m (w−2j)/(w+2j),     b₀=1.

The spaces H_m are SO(4)-types, not SL(4,R)-invariant subrepresentations at generic weight. They are constant subspaces of the chosen compact-picture Hilbert space. Every fixed P_m commutes with L=(1/4)∂_w². For a scalar section X_t(w)e₀ with normalized constant harmonic e₀, P₀ preserves the full scalar function exactly.

Consequently, angular freezing can reduce bookkeeping, but cannot by itself improve a scalar zero-free estimate. If the constant mode is removed, recovery of the original scalar is lost unless a new, independently proved observable supplies it.

### 3.2 Freeze the Mellin weight w=w*

Evaluation at one weight is not closed under heat. At t=0 the two entire functions 1 and 1+(w−w*)² have the same value at w*, but their time derivatives under L there are 0 and 1/2. No evolution depending only on the frozen value can reproduce general heat flow.

For the raw homogeneous section f_w(rω)=r^(−2−w)h(ω), applying parameter heat pointwise gives

e^{tL} f_w(rω)=exp(t(log r)²/4) r^(−2−w)h(ω).

For t>0 its ratio under r↦cr depends on r, since the extra factor is

exp((t/4)(2 log c log r+(log c)²)).

It is no longer a section of the same fixed projective density character. A heat-compatible model must enlarge from one homogeneous weight to a suitable family/distribution of weights or to log-radius data. This is a direct calculation, not a general impossibility theorem for such enlarged models.

### 3.3 Freeze an incidence line P(L)

A line integral is defined on smooth sections with the correct density weight. At the special weight w=0 it is the audited scalar X-ray/incidence transform. A single line does not determine the original angular function. Moreover, restriction to a fixed circle in S³ is not a bounded functional on the model's L²(S³): functions concentrated in an ε-tube around that circle can have unit L² norm and line integrals of order ε^(−1). A stronger trace/Sobolev domain or a smoothed observation must be supplied before an L² passivity argument can use it.

Fixing a spacetime line therefore neither produces the scalar arithmetic coefficient nor justifies a bounded observation. Weighted incidence for all heat-mixed parameters needs its own definition. It cannot be inferred from the w=0 scalar incidence theorem.

### 3.4 Freeze prime rungs

Finite-place spherical-vector choices are extra arithmetic choices in the model. Truncating primes changes the scalar function. The missing prime contribution must appear as an exact remainder with a bound or as part of an exact correlated integral. It does not vanish under geometric freezing.

For a finite Dirichlet polynomial D(s)=Σ_{n≤N}c_n n^(−s),

e^{(t/4)∂_s²}D(s)=Σ_{n≤N}c_n exp((t/4)(log n)²)n^(−s).

The new factor is not multiplicative:

exp((t/4)(log(mn))²)
=exp((t/4)(log m)²)exp((t/4)(log n)²)exp((t/2)log m log n).

Independent heat evolution of Euler factors misses the cross term even for coprime m,n. In the infinite formal Dirichlet series, exp((t/4)(log n)²)n^(−s) fails to tend to zero for every fixed s and t>0. Even the single-prime power series has the analogous k² growth. Thus this finite-polynomial identity is not a convergent positive-time Euler/Dirichlet representation of X_t. One needs a valid completed contour/heat representation and a controlled remainder.

Where a finite product admits a valid Gaussian integral, its heat is the expectation of the product at one shared Gaussian shift, not the product of expectations at independent shifts. This is the required correlation structure.

## 4. Exact heat/intertwiner compatibility and its limits

Let A(w) be the audited angular family, and let f_t solve ∂_tf_t=Lf_t on a common differentiable domain. Direct differentiation gives

[L,A]f=(1/2)A′f′+(1/4)A″f,

(∂_t−L)(Af_t)=−(1/2)A′f_t′−(1/4)A″f_t.                 (4.1)

There is a sharp local no-go statement: a pointwise multiplier G(t,w) that carries every solution of ∂_tf=Lf to another solution of that same free heat equation must be constant in both w and t. Test first on f=1 to get ∂_tG=(1/4)G″, then on f=w to get G′=0, and hence ∂_tG=0. This rules out a nonconstant pointwise geometric multiplier as a universal free-heat intertwiner; it does not rule out corrected generators, enlarged spaces, or a formula valid only for one distinguished arithmetic section.

This identity is exact on finite harmonic sums and, where justified, on common operator domains. It is not a claim that the meromorphic A has a globally defined Gaussian heat integral. Its poles at negative even weights can obstruct such an integral, and A(w) does not have a bounded inverse on the full H when Re w>0.

For m=1,

b₁=(w−2)/(w+2),     b₁′=4/(w+2)²,     b₁″=−8/(w+2)³,

so the correction in (4.1) is

−2f_t′/(w+2)²+2f_t/(w+2)³.

It is nonzero in general. For m=0 both derivatives vanish, but the scalar X_t remains untouched. This is the clean division: a frozen constant angular sector is heat-compatible and arithmetically unchanged; a nonconstant geometric sector incurs an explicit correction.

On a finite harmonic truncation away from zeros and poles of A, put C=A′A^(−1). The exact conjugated generator is

L_A=A L A^(−1)
=(1/4)∂_w²−(1/2)C∂_w+(1/4)(C²−C′).                  (4.2)

Then g_t=Af_t solves ∂_tg_t=L_Ag_t. This provides a constructive corrected lift, not a new scalar estimate. Globally, the degeneracies at positive even weights and unbounded inverse in the full compact picture prevent blindly promoting (4.2) to a bounded gauge equivalence.

If a projection P=P(t,w) itself varies, the exact residual is

(∂_t−L)(Pf_t)=(∂_tP)f_t−(1/2)P′f_t′−(1/4)P″f_t.

A moving or spectrally varying freeze must include these terms. A constant projection has no such terms but may still lose the scalar observation.

For the completed heat ratio

R_{t,a}(w)=X_t(w−a)/X_t(w+a),

let D=X_t(w+a). Wherever D≠0, quotient differentiation yields

∂_tR_{t,a}=(1/4)R_{t,a}″+(1/2)(D′/D)R_{t,a}′.        (4.3)

Thus R_{t,a} is not obtained by simply applying free heat to R_{0,a}. Its drift involves the denominator logarithmic derivative and becomes singular at denominator zeros. Likewise, defining T_{t,a}=R_{t,a}A is an exact formula, but does not by itself establish holomorphy or contractivity.

## 5. An exact frozen lift that is available now

Let e₀ be the normalized constant harmonic and define

F_t(w)=X_t(w)e₀,     ℓ(f)=⟨f,e₀⟩.

Then

∂_tF_t=LF_t,     AF_t=F_t,     ℓ(F_t)=X_t,

and F_t is given by the rigorous theta/Gaussian formulas above. This is a fully specified, zero-preserving, heat-compatible constant-fiber lift. It is an embedding of the arithmetic function into the geometry, not a derivation of its zero-free strip from geometry.

On Re w>0 away from scalar poles,

||R_{t,a}(w)A(w)||=|R_{t,a}(w)|,

because ||A(w)||=1 and A(w)e₀=e₀. Hence no contractivity theorem for that family can avoid the scalar inequality. Changing higher harmonics while leaving this normalization cannot improve the inequality tested by e₀.

A nonzero scalar input/output coefficient is not interchangeable with a determinant or spectrum. The zeros of b_m at w=2,4,…,2m are geometric degeneracies, not zeros of X_t: the displayed positive theta integral gives X_t(w)>0 for real w and real t. On a finite angular truncation of total dimension d, det(X_t A)=X_t^d times the explicitly known product of geometric factors. An uncorrected determinant therefore introduces spurious geometric zeros and multiplicities. Any alternative lift must specify which object recovers X_t and prove that correspondence, including removal of geometric divisors and multiplicities if zero counting is used. Relative determinants or rigged/Sobolev-space constructions are possible research targets, not constructions already established here.

## 6. Exact Schur/Feshbach reduction for a proposed freeze

Suppose a proposed bounded analytic operator pencil M(w) acts on a fixed Hilbert space H=P H⊕Q H, Q=I−P, with fixed orthogonal P. Write

M=[ A  B ; C  D ],

where D=QMQ is boundedly invertible throughout the region being certified. The exact effective frozen operator is

F=A−BD^(−1)C,

not A. Direct block multiplication gives

M=[ I  BD^(−1) ; 0  I ] [ F  0 ; 0  D ] [ I  0 ; D^(−1)C  I ].

Thus M is invertible exactly when F is invertible. Kernels correspond by u↦u−D^(−1)Cu. If P has finite rank, nonvanishing det F is a finite-dimensional certificate once D-invertibility is proved. In an analytic Fredholm setting, the analytic invertible factors preserve local characteristic multiplicities; no unsupported ordinary infinite-dimensional determinant identity is needed.

When P has finite rank, a directly checkable sufficient estimate is

σ_min(A)>||B||·||D^(−1)||·||C||.

For general P, require A to be boundedly invertible and ||A^(−1)||·||B||·||D^(−1)||·||C||<1. These criteria follow by a Neumann-series argument after factoring A. Omitting BD^(−1)C is justified only if it vanishes or is rigorously dominated. Uniform tail invertibility, coupling bounds, and their parameter domains are part of the certificate.

For the current diagonal angular transfer A(w), harmonic projection makes B=C=0. This is an exact observed-block compression; it is not a full invertibility reduction unless the discarded block is separately proved invertible on appropriately chosen spaces. In fact, on an infinite angular tail in the present H, b_m(w)→0 for Re w>0, so the discarded block has no bounded inverse; at positive even weights it has an actual kernel. Keeping e₀ keeps exactly the scalar R_{t,a}; deleting e₀ loses the scalar norm obstruction. A useful nontrivial Feshbach reduction would need a different, explicitly identified arithmetic operator pencil or justified spaces.

There is currently no proved identity of the form “M_t(w) noninvertible iff X_t(w)=0” in this heat extension. If a determinant is used instead, the required identity is D_t(w)=g_t(w)X_t(w) with g_t holomorphic and nowhere zero on the certified region, together with the trace/Fredholm assumptions that make D_t legitimate. This is what prevents zero loss or spectral pollution. The finite-window Hankel operators at a≤1/2 are not automatically trace class or Hilbert–Schmidt, so a formal ordinary Fredholm determinant cannot be inserted.

## 7. The exact completion theorem

### Theorem (coefficient-to-strip completion)

Let X be a nonzero even entire function. Let aₙ be distinct positive numbers converging to a₀≥0, with aₙ>a₀. Suppose, for every n, the meromorphic quotient

Rₙ(w)=X(w−aₙ)/X(w+aₙ)

extends holomorphically to Re w>0. Then every zero λ of X satisfies |Re λ|≤a₀.

It suffices to construct a holomorphic operator family Sₙ on Re w>0 with fixed bounded input/output maps ℓₙ,vₙ and prove

ℓₙ Sₙ(w)vₙ=Rₙ(w)

on any nonempty open subset of that half-plane where the denominator is nonzero. Meromorphic identity continuation supplies the required holomorphic extension. Contractive Sₙ is one sufficient, stronger hypothesis.

### Proof

Suppose X(λ)=0 and Re λ>a₀. For all sufficiently large n, wₙ=λ−aₙ lies in Re w>0. Holomorphy of Rₙ at wₙ forces X(λ−2aₙ)=0, with at least the multiplicity needed to cancel its denominator zero. The distinct zeros λ−2aₙ converge to the finite point λ−2a₀. The identity theorem then makes X identically zero, a contradiction. Evenness excludes Re λ<−a₀. The coefficient statement follows from the meromorphic identity theorem. Conversely, if all zeros satisfy |Re λ|≤a₀, then X(w+a) has no zeros in Re w>0 for every a>a₀. Every corresponding quotient is therefore holomorphic there. Thus the scalar holomorphy criterion is equivalent to the strip, not a weaker conjecture obtained for free. ∎

Applied to X=X_{t₀}, the substitution w=iz/2 identifies |Re w|≤a₀ with |Im z|≤2a₀. De Bruijn's strip-shrinking theorem gives

Λ≤t₀+(2a₀)²/2=t₀+2a₀².

For a₀=0 the conclusion already says H_{t₀} has only real zeros. No uniform operator bound in n is required. No strict global contraction gap is required. What is required is exact scalar identity plus global holomorphy for the sequence.

### Why one width is insufficient

Let P(w)=(w²−a²)(w²−9a²). Then exactly

P(w−a)/P(w+a)=(w−4a)/(w+4a),

a right-half-plane Schur function, although P has a zero at 3a. To make the hidden zeros nonreal, use P(w−iγ)P(w+iγ), γ≠0; the ratio becomes a product of two Schur factors and still has hidden zeros of real part 3a. This is a counterexample to a generic logical inference, not a claim about xi.

A single-width replacement is sufficient if one separately proves that every zero λ with Re λ>a has X(λ−2a)≠0, or proves another applicable non-cancellation condition. Such a condition is missing in the current model.

## 8. What would finish the numerical target, concretely

For the target t₀=0.123637595, y₀=0.2 (a₀=0.1), any one of these complete routes is sufficient:

1. Direct scalar strip: rigorously exclude H_{t₀}(x+iy)=0 for all real x and y>0.2.
2. Existing Polymath barrier pipeline: certify all initial, moving-barrier, and final-half-line hypotheses with complete finite boxes, analytic tails, interval rounding, and verified normalization. A local final-time interval or a few finite Hankel windows is not the final half-line.
3. Transfer model: prove the coefficient-to-strip theorem's exact identities and global holomorphy for a sequence aₙ↓0.1. If using a freeze, retain its exact Feshbach correction, tail invertibility, and heat correction terms.

In particular, the old signed-window bound at heat time zero, arithmetic width a=1/4, and finite Hankel length at most 3/2 supplies none of these global positive-time requirements by itself. The heat-deformed kernel and its all-window boundedness criterion would need to be established anew before importing the earlier t=0 Suzuki reduction.

The accompanying scalar certificate report audits the actual barrier and final-half-line certificate ledger. This mathematical note does not assert that those certificates are complete. It isolates precisely what a successful fiber method must supply and which transformations are already justified.

## 9. Verification and sources

`verify_identities.py` checks the commutator and conjugated generator for m=0,…,8, the ratio drift, the m=1 correction, the cancellation counterexample, Mellin-mode evolution, prime cross term, block factorization, and exact target arithmetic. These are symbolic identity checks only. They do not certify a global analytic bound.

Primary source for the normalization and existing heat/strip theorem: D. H. J. Polymath, *Effective approximation of heat flow evolution of the Riemann ξ function, and a new upper bound for the de Bruijn–Newman constant*, arXiv:1904.12438v2, equations (1), (3), (4), (34)–(35), Theorem 3.2, and Proposition 3.3. https://arxiv.org/html/1904.12438v2

The notation and geometric multipliers are taken from the local audited model and checked algebraically here. The compatibility calculations, freeze counterexamples, block factorization application, and coefficient-to-strip proof above are explicit deductions; no literature-priority claim is made.
