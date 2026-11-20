# Selected form-error transfer under the polynomial source floor

2026-11-04. Precise finite-dimensional consequences of the newly audited actual-source comparison. No selected coherence, defect positivity, or RH conclusion is asserted. No frozen files are changed.

## 1. Inputs, dimensions, and coordinates

Put N=n+2 and L=log(n+2). The actual dimension is d=n+1≤N, or smaller when one restricts to a parity. Let W_*=|Gamma(9/4+it/2)|² and let

    ψ_j=M_j^*/sqrt(b_j^*)

be its orthonormal natural polynomial basis through degree n. For the actual source form X and derivative form H, denote their coordinate matrices by G and J respectively. Thus G is positive definite and J is positive semidefinite. We use the audited bounds

    G≥α_n I,       α_n=c/(N L^(3/4)),                  (1)
    d_j:=G_jj=X[M_j^*]/b_j^*≤C[log(j+2)]³≤CL³,       (2)
    J_jj=H[M_j^*]/b_j^*≤C log(j+2)≤CL.               (3)

Equation (1) is the new actual-source lower bound. Equation (2) separately uses the audited arithmetic trial upper input. Equation (3) uses the favorable-family derivative upper. No estimate in this note silently drops these dependencies. Bounds initially stated for real polynomials extend to complex coordinates by applying them separately to real and imaginary parts, since the form matrices are real symmetric.

Let P_n be the monic X-minimizer, A_n=X[P_n], and let c be the coefficient vector of p_n=P_n/sqrt(A_n). Then

    c*G c=1,       ||c||₂²≤α_n^−1≤C N L^(3/4).         (4)

For precision, in the full or parity-ordered basis, with e the last coordinate vector,

    A_n=b_n^*/(e*G^−1 e),
    c=G^−1e/sqrt(e*G^−1e).

The leading coordinate of the monic polynomial is sqrt(b_n^*), not 1. The leading coordinate of its X-normalization is sqrt(b_n^*/A_n).

## 2. Fixed-selected-column form errors

Let E be any Hermitian error matrix in these SAME W_*-orthonormal coordinates. No positivity of E is required. Then

    |c*E c|≤||E||₂ ||c||₂²≤C N L^(3/4)||E||₂.         (5)

Thus if a model approximates the derivative matrix J by J+E, while evaluating on the exact selected column c, its error in H[P_n]/A_n is bounded by (5). In particular:

    ||E||₂=o(N^−1 L^(−3/4))                            (6)

is sufficient for an o(1) normalized error. It does not say that the approximated value itself tends to zero.

More generally, for any specified positive scale s_n, the sufficient threshold is

    ||E||₂=o(s_n/[N L^(3/4)]).                         (7)

If Δ_n>0 has been established separately and s_n=Δ_n/A_n, equation (7) gives an error o(Δ_n/A_n). Equivalently the unnormalized selected form error is o(Δ_n). Neither Δ_n>0 nor a lower bound on its size follows from the present source comparison.

These are sufficient worst-case thresholds supplied by the source floor, not necessary conditions for a particular selected column or structured error. A sharper direct bound on c*E c can do better.

If every entry obeys |E_jk|≤ε_n, then

    ||E||₂≤d ε_n≤N ε_n.

Consequently the uniform-entrywise sufficient threshold is

    ε_n=o(N^−2 L^(−3/4))                               (8)

for o(1), or ε_n=o(s_n N^−2 L^(−3/4)) for o(s_n). A small number of nonzero entries per row, Frobenius control, or cancellation can improve this crude dimension factor; uniform scalar moment accuracy alone does not remove it. Raw monomial-moment errors must first be converted into the stated normalized basis; their unscaled entry bounds cannot be substituted directly into (8).

## 3. Individually source-normalized coordinates

Set D=diag(d_j^−1/2), φ_j=ψ_j/sqrt(d_j), and

    G_hat=D G D.

The coefficient vector z of the SAME polynomial p_n in the φ basis satisfies

    c=Dz,    z=D^−1c,
    z*G_hat z=1.

Using only (1) and max d_j≤CL³ gives

    G_hat≥c/[N L^(15/4)] I,
    ||z||₂²≤C N L^(15/4).                              (9)

For a Hermitian error E_hat specified in this coordinate system,

    |z*E_hat z|≤C N L^(15/4)||E_hat||₂.                (10)

Hence the spectral and entrywise sufficient thresholds are respectively

    ||E_hat||₂=o(s_n N^−1 L^(−15/4)),
    max_jk |(E_hat)_jk|=o(s_n N^−2 L^(−15/4)).         (11)

Use s_n=1 for an o(1) error. If E_hat and E describe the SAME physical form error, they obey E_hat=D E D; their numerical spectral/entrywise bounds are not interchangeable. The leading monic coordinate in this basis is sqrt(X[M_n^*]), and its source Schur value with last coordinate fixed to 1 is A_n/X[M_n^*], not A_n/b_n^*.

## 4. Perturbing the source matrix and its Schur minimum

The preceding bounds evaluate a form error on the exact selected column. They do not, by themselves, control an approximate column obtained by minimizing a perturbed source form.

There is nevertheless a direct and robust source-Schur statement. Let

    G_tilde=G+E_G,
    η=||G^−1/2 E_G G^−1/2||₂≤||E_G||₂/α_n.

If η<1, then

    (1−η)G≤G_tilde≤(1+η)G.

Minimizing over the SAME monic affine space gives

    (1−η)A_n≤A_tilde_n≤(1+η)A_n.                      (12)

Thus relative source-Schur error is at most η, even though the minimizer is reselected. The natural-coordinate sufficient condition for relative o(s_n) source-Schur error is still ||E_G||₂=o(s_n α_n). One should use this variational argument rather than claim that the old selected column is unchanged.

For a defect Δ_n=A_n−B_n involving a second minimum B_n, controlling A_n alone does not control the defect. If an INDEPENDENT estimate yields |B_tilde_n−B_n|≤η_B B_n, then

    |Δ_tilde_n−Δ_n|/A_n≤η+(B_n/A_n)η_B.                (13)

Relative o(Δ_n) accuracy requires the right side to be o(Δ_n/A_n). Any source/reference floor for G does not automatically supply the needed relative floor for the ordinary derivative minimum B_n. In particular H has a constant-polynomial nullspace; a Schur minimization for H must be formulated on the appropriate quotient or derivative space, and arbitrary Hermitian perturbations can otherwise destroy semiboundedness along the nullspace.

## 5. Reselection and evaluation of a different form

For clarity, here is a quantitative bound showing the extra issue. Let v and v_tilde be the exact and perturbed MONIC source minimizers, δv=v_tilde−v, and A=A_n. Since δv has zero leading coefficient, source orthogonality gives

    v*G δv=0.

The perturbed normal equations imply

    ||δv||_G²/A≤η²/(1−η²).

Indeed the perturbed normal equations give X[δv]=−E_G[v_tilde,δv], while X[v_tilde]=A+X[δv]. Set e=||δv||_G/sqrt(A). Relative form control gives e²≤η e sqrt(1+e²), hence e²≤η²/(1−η²), including e=0 trivially. Put ρ=η/sqrt(1−η²).

For a Hermitian target matrix J define its relative operator norm

    κ_J=||G^−1/2 J G^−1/2||₂.

If the perturbed selected vector is normalized using its OWN perturbed source value A_tilde, then

    |J[v_tilde]/A_tilde−J[v]/A|
       ≤κ_J[η+2ρ+ρ²]/(1−η).                           (14)

This follows by expanding J[v+δv]/A, using G-orthogonality only for the source energy, and using A_tilde/A∈[1−η,1+η]. If J is also perturbed by E_J, add at most

    ||E_J||₂/[α_n(1−η)]                               (15)

because the perturbed-source-normalized vector has actual G norm squared at most 1/(1−η).

Thus η→0 alone need not make a reselected derivative/source ratio accurate when κ_J grows. A sufficient condition for o(s_n) accuracy is

    κ_J η=o(s_n),    ||E_J||₂/α_n=o(s_n),    η→0.       (16)

For the actual derivative matrix, (3) and positivity give

    ||J||₂≤trace J≤C N L,
    κ_J≤||J||₂/α_n≤C N² L^(7/4).                      (17)

This supplies, for example, the conservative natural-coordinate sufficient source-error threshold

    ||E_G||₂=o(s_n N^−3 L^(−5/2))                     (18)

for the reselection contribution, together with the fixed-column target-error threshold (7). This is not claimed necessary or sharp. Direct relative-form control, a better target operator bound, or selected-vector structure may greatly improve it.

In individually X-normalized coordinates, the same invariant κ_J can be used, but η is bounded by C N L^(15/4)||E_G_hat||₂. Thus the corresponding conservative spectral threshold is o(s_n N^−3 L^(−11/2)). Again this concerns SOURCE-driven reselection, not the simpler fixed-column target error in (11).

There is a useful distinction for the positive derivative form. If one ALREADY knows that the reselected approximation has H[v_tilde]/A_tilde=o(s_n), a triangle inequality rather than the worst-case quadratic difference gives

    sqrt(H[δv]/A)≤sqrt(κ_J)ρ,
    sqrt(H[v]/A)≤sqrt(H[v_tilde]/A)+sqrt(κ_J)ρ.

Thus η→0 and κ_J η²=o(s_n) suffice to transfer that already-proved small value. With (17), a conservative natural-coordinate sufficient source-error threshold for this conditional decay transfer is

    ||E_G||₂=o(sqrt(s_n) N^−2 L^(−13/8)).              (18a)

For s_n=1 this is weaker than (18), which ensures a uniform small quadratic difference without assuming either value is already small. If the derivative form is itself approximate, one must also certify its error at the requested scale. These alternative thresholds should not be conflated. In particular no reselected approximation with a proven small derivative value is supplied by this lemma.

## 6. Favorable trial ratio versus selected normalization

The independently audited favorable natural family satisfies

    H[M_n^*]≤C b_n^* L,
    X[M_n^*]≥c b_n^* L²,
    H[M_n^*]/X[M_n^*]=O(L^−1).

The new source floor gives A_n≥c b_n^*/(N L^(3/4)), hence directly

    H[M_n^*]/A_n≤C N L^(7/4).                          (19)

This is sharper than multiplying the separate coarse overlap bound and trial ratio, but it is still a growing upper bound and is NOT a bound on H[P_n]/A_n. Minimizing X does not minimize H. Equation (19) does not assert that the actual trial quantity grows; it identifies what these particular estimates alone yield.

The arithmetic upper also gives

    X[M_n^*]/A_n≤C N L^(15/4),
    A_n/X[M_n^*]≥c/[N L^(15/4)].

These provide neither relative near-minimality nor selected derivative coherence. Polynomial conditioning makes explicit form-error requirements substantially milder than the previous exp(O(log²n)) requirements, but it does not create the missing cancellation or defect sign.

## Sources used

- ../theta_polynomial_comparison_20261104/GENERAL_REFERENCE_AND_NATURAL_COROLLARIES.md: source floor and both coordinate normalizations.
- ../theta_pollaczek_natural_20261104/ARITHMETIC_SCALE_COROLLARY.md: arithmetic trial source upper and definition of Δ_n=A_n−B_n.
- ../theta_pollaczek_natural_20261104/NATURAL_FAMILY_RATIO_AUDIT.md: derivative trial upper and favorable trial ratio.

All perturbation and coordinate statements above are proved directly here. They are finite-dimensional transfer lemmas, not a claim that a proposed arithmetic approximation has met their hypotheses.
