# Original-density rigidity and a finite-degree localization certificate

Date: 2026-11-03. Independent analytic review PASS for the density, spectral-saturation, finite-degree certificate, and correction arguments. This is AI-assisted review, not peer review or a machine-formalized proof. No theta positivity or RH claim.

Fix a shift a and the original real even density ell=ell_a in the task. Assume ell is continuous, not identically zero, and ∫exp(c|t|)|ell(t)|dt<∞ for some c>0. These hypotheses hold for the complete-theta paired density, including a=0, by the Fourier contour bounds recorded in FRACTIONAL_SIEVE_DOMAIN_COLLAPSE.md. Nothing below presumes its sign. Put μ(dt)=|ell(t)|dt, H=L²(μ), and J(t)=sgn ell(t). On either parity subspace, h[f,g]=<f,Jg>_μ. J is a self-adjoint involution modulo μ-null sets.

## 1. Sharp negative spectral saturation

Let V_N be nested even (respectively odd) polynomial prefixes exhausting that parity. Let M_N be their positive μ-Gram matrix and A_N their original signed Gram matrix. Define K_N=M_N^(-1/2) A_N M_N^(-1/2). All eigenvalues lie in [-1,1].

If ell is negative anywhere, continuity and evenness give a symmetric negative open set E of positive μ-measure. For every fixed positive integer k, the kth smallest eigenvalue of K_N tends to -1 as N tends to infinity. In particular, for every ε>0 and k there is a finite N after which K_N has at least k eigenvalues below -1+ε. This holds separately for each parity.

Proof: polynomials are dense in H, and their parity projections are dense in the corresponding parity subspace. One proof of density is to take g orthogonal to all polynomials. Cauchy–Schwarz and the exponential moment make ∫g(t)e^(zt)dμ(t) holomorphic on a strip about the imaginary axis. All derivatives vanish at z=0. The identity theorem and uniqueness of the Fourier transform give g=0. Evenness of μ allows parity projection. Choose any k orthonormal parity functions supported in E and approximate their span by polynomial projections; Section 2 gives an exact quantitative certificate. The min-max principle and the lower bound K_N≥-I finish the proof.

The analogous statement at +1 holds if ell has a positive interval. Therefore, if both signs occur, every fixed number of lowest and highest normalized finite-section eigenvalues converges to -1 and +1, respectively. This is stronger than infinite negative index, although it does not supply a degree rate.

Consequently finite negative index on either parity polynomial space forces ell≥0 everywhere. For nonzero real-analytic ell, this implies that all nonzero polynomial tests are strictly positive, since a nonzero analytic density cannot vanish on an interval. Thus a Pontryagin-space construction with finitely many negative squares for this original multiplication form would already establish the desired sign. It is not a weaker intermediate target.

## 2. Computable finite-degree certificate

Choose k μ-orthonormal parity functions f_1,...,f_k supported where ell<0; normalized indicators of disjoint symmetric compact interval pairs suffice, with a sign(t) factor for odd parity. Let T:R^k→H synthesize these functions and let P_N be the μ-orthogonal projection onto V_N. Set

 B_N=T* P_N T,     b_N=λ_min(B_N).

Then B_N increases to I. If b_N>0, the polynomial space P_N range(T) has dimension k. For g=P_N Tc,

 ||g||²_μ = cᵀ B_N c,
 ||1_E g||²_μ ≥ ||T*g||² = cᵀ B_N² c,
 h[g] ≤ ||g||²_μ − 2||1_E g||²_μ
      ≤ cᵀ(B_N−2B_N²)c
      ≤ (1−2b_N)||g||²_μ.

Thus b_N>1/2 is a finite-degree certificate of at least k negative directions. More quantitatively, b_N≥1−ε/2 certifies k eigenvalues at most -1+ε.

Everything is a finite moment/integral calculation once candidate negative intervals are specified. In a monomial parity basis v, let C_N have entries ∫v_i f_j dμ. Then

 B_N = C_Nᵀ M_N^(-1) C_N.

This formula provides rigorous certificates if its integrals and smallest eigenvalue are enclosed rigorously. It is not a proof that the actual theta ell has a negative interval; none is known or asserted here. Nor is it an all-degree positive certificate.

## 3. Finite-rank and compact corrections cannot repair a negative region

Any algebraic finite-rank symmetric correction R on the polynomial vector space leaves infinite negative index: intersect a (k+rank R)-dimensional negative subspace with the kernel of the linear map defining R. The intersection has dimension at least k and R vanishes there. This statement needs no boundedness assumption on R, so it covers finite point-evaluation or derivative corrections as well as continuous ones.

More generally, if C is any compact self-adjoint operator on H, the form h[f]+<f,Cf> still has infinite negative index on each parity on which a negative region occurs. If C does not preserve parity, compress it to that parity. Indeed take an infinite orthonormal sequence supported in E; compactness makes C uniformly small on a sufficiently late finite-dimensional span of any fixed dimension k. Approximate that span by polynomials. This produces k negative directions with normalized quotient at most -1+ε. Equivalently the kth smallest finite-section eigenvalue has limsup at most -1. Equality need not hold, because a compact perturbation may create eigenvalues below -1.

The same argument works for a bounded perturbation of norm strictly less than 1 in the μ metric, even if noncompact, giving negative quotients bounded above by -1+||C||+ε. The unit threshold is sharp: adding the μ norm squared makes the density ell+|ell| nonnegative.

A finite number of independent polynomial constraints also cannot remove the infinite negative index: use the same codimension argument. In particular, imposing orthogonality to any fixed old original prefix does not help. This includes old prefixes with singular or indefinite Gram matrices, since one uses only the finite number of linear constraints, not an inverse.

## 4. What this does and does not close

These results rigorously strengthen the proposed obstruction. They prohibit hiding an original negative interval behind finite negative index, a finite-rank positive correction, or a compact μ-bounded correction. They also give an independently checkable finite-degree witness procedure conditional on finding a negative interval.

They do not control the selected next residual with a growing old prefix, establish an actual negative theta region, or produce a sufficient all-degree theta positivity estimate. The complete-theta scalar source curvature bound alone has not been converted here into a positive full-kernel factorization. An identity equivalent to h≥0 would not fill that gap.

Sources: local task inputs SELECTED_CURVATURE_REMAINDER_LEMMA.md, GAUSSIAN_PAIRED_INNOVATION_GAP.md, THETA_REFERENCE_SURPLUS_SIGN_CHANGE.md, and FRACTIONAL_SIEVE_DOMAIN_COLLAPSE.md. The proof above is elementary Hilbert-space approximation and min-max reasoning; no external research or live 4CT work was used.
