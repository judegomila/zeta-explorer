# Exact graded theta feature algebra and its unbounded residue cost

## 1. One-pole closure, not an uncontrolled collection of Bell terms

On h>=0 set z_n=pi n^2 exp(2h), P_0=4z(2z-3), and P_(j+1)=2zP_j'+(1/2-2z)P_j. The single-orbit derivative feature U_j=P_j/P_0 has the unique form A_j(z)+c_j/(2z-3), deg A_j=j. Its raising operator is

 L=2z partial_z+9/2-2z+6/(2z-3).

Writing r=(2z-3)^(-1), the apparent double pole cancels exactly:

 Lr=-1-r/2.

Consequently, with A_0=1,c_0=0,

 A_(j+1)=2z A_j'+(9/2-2z)A_j
         +6[A_j(z)-A_j(3/2)]/(2z-3)-c_j,
 c_(j+1)=6A_j(3/2)-c_j/2.

The divided difference is a polynomial. This is an exact graded recurrence with one scalar residue channel. The leading coefficient of A_j is (-2)^j, so the A_j form a basis for every polynomial degree filtration.

## 2. The residue is an explicit continuous-gamma functional

For every j,

 integral_0^infinity z^(-1/2)e^(-z)P_j(z) dz=0.

For j=0 this is 8Gamma(5/2)-12Gamma(3/2)=0. Integration by parts shows the functional on P_(j+1) is -1/2 times its value on P_j; the endpoints vanish because each P_j is divisible by z.

Thus if U=A+c r is ANY linear combination through grade J, division by P_0 gives

 E[(2Z-3)A(Z)+c]=0,  Z~Gamma(3/2,1).

The gamma integration-by-parts identity E[(2Z-3)A]=2E[Z A'] yields

    U_A(z)=A(z)-ell(A)/(2z-3),
    ell(A)=2E[Z A'(Z)].                              (1)

Conversely every polynomial A of degree<=J occurs, by the triangular basis from Section 1. This characterizes the entire actual derivative-test space, not just a monotone cone, and permits complex coefficients. In monomial coordinates ell_k=2k(3/2)_k, including ell_0=0.

## 3. Exact low-rank relative cost in the positive orbit Gram

At a fixed h let p_n=f_n(h)/psi(h)>0 be the actual full-theta orbit law. Let v(z)=(1,z,...,z^J)^T, H=E_p[vv^T], u=E_p[v r], and q=E_p[r^2]. Every finite H is positive definite since the support is infinite. The actual orbit feature Gram in A-coordinates is exactly

    B=H-u ell^T-ell u^T+q ell ell^T.                 (2)

The correction has rank at most two; it cannot be discarded merely because the underlying heat transport is positive. It has the exact positive square completion

 B=(I-ell u^T H^(-1)) H (I-H^(-1)u ell^T)
      +(q-u^T H^(-1)u)ell ell^T,

where the final coefficient is nonnegative by orthogonal projection of r onto polynomials. Thus this is an automatic positive ORBIT Gram, not the signed bridge matrix.

If L_J^2=ell^T H^(-1)ell, the elementary H-relative correction bound is

 ||H^(-1/2)(B-H)H^(-1/2)|| <= 2 sqrt(q)L_J+q L_J^2.

The complete bridge lower-block metric A_complete is different from H or B. No replacement of A_complete by these positive auxiliary Grams is justified by this identity.

## 4. A theta-specific exact obstruction: the residue cost is not uniformly bounded

Fix any h>=0 and x=exp(2h). Define degree-N polynomials

    R_N(z)=product_(j=1)^N [1-z/(pi x j^2)].

They vanish on the first N actual theta orbit locations. Euler's sine product gives

 R_N(z) -> R_infinity(z)=sin(sqrt(pi z/x))/sqrt(pi z/x)

for z>=0, with the value 1 at zero. Uniform bounds sufficient for all interchanges are

 |R_N(z)| <= exp(sqrt(pi z/x)),
 |R_N'(z)| <= [pi/(6x)] exp(sqrt(pi z/x)).

They follow by taking absolute values of each factor, bounding by the corresponding infinite sinh product, and bounding the differentiated product by sum_j 1/(pi x j^2) times that product.

At every discrete orbit location z_n=pi x n^2, R_N(z_n)=0 eventually. The square bound exp(2pi n) is summable against the actual probabilities p_n, which have polynomial times exp(-pi x n^2) decay. Dominated convergence therefore gives

    ||R_N||_(L2(p)) -> 0.                            (3)

But the gamma functional in (1) does not vanish. The displayed derivative bound is integrable against z^(3/2)e^-z, so

 ell(R_N) -> 2E[Z R_infinity'(Z)]
           = -[pi/(2x)] exp(-pi/(4x)) != 0.            (4)

For verification, E[R_infinity(cZ)]=exp(-pi c/(4x)); this follows directly from its sine series and (3/2)_k/(2k+1)!=1/(4^k k!). Differentiating at c=1 proves (4), also justified by the exponential bound.

Equations (3)-(4) prove L_J is unbounded as J grows, and hence there is no degree-independent constant C such that |ell(A)|<=C||A||_(L2(p)) for all polynomial A. More strongly, for the ACTUAL derivative feature U_(R_N),

 U_(R_N) -> [pi/(2x)] exp(-pi/(4x)) r

in L2(p), a nonzero limit, while its polynomial part R_N tends to zero. Therefore B is not bounded above by any fixed multiple of H uniformly across degree. This is not merely a numerical condition-number warning: it is an explicit full-theta orbit sequence proving the missing residue is essential.

## 5. Implication and remaining target

The exact all-test recurrence reduces the differentiated heat transport to a polynomial channel and one explicitly identified gamma-residue channel. It also proves that paying that residue using only the raw discrete polynomial Gram is impossible uniformly in degree. Any viable common-anchor proof must retain the full residue channel and the actual complete bridge metric, or exploit an additional signed cancellation that controls it there. The result does NOT rule out such a proof, does not assert bridge indefiniteness, and does not revive the disproved universal spatial-tail criterion. It explains precisely why monotone-cone transport alone cannot be extended to all differentiated tests by a degree-independent norm comparison.

Parity precision: equation (1) parametrizes the full derivative filtration. A fixed even or odd differential-polynomial block corresponds to the span of the corresponding A_(2j) or A_(2j+1), not arbitrary A of that degree. The explicit R_N obstruction above is established for the full filtration; no separate same-parity obstruction is inferred without additional work. Every recurrence and exact Gram identity remains valid after restriction to either parity subspace.

## 6. Keeping the residue reduces auxiliary conditioning to three scalars

There is no need to bound the rank-two term by its norm. Set

 t=ell^T H^(-1)ell, w=u^T H^(-1)u, alpha=u^T H^(-1)ell,
 eta=q-w>=0, d=q t-2alpha.

All eigenvalues of H^(-1/2)BH^(-1/2) off the span of H^(-1/2)u and H^(-1/2)ell equal 1. The two possible exceptional eigenvalues are exactly

 lambda_+/- = 1+d/2 +/- (1/2)sqrt(d^2+4(wt-alpha^2)).

Their product is (1-alpha)^2+eta t. In a one-dimensional exceptional span the same formula adds a redundant eigenvalue 1. Thus retaining the residue exposes an exact scalar stability denominator rather than a generic high-dimensional condition number. The Cauchy inequality wt>=alpha^2 ensures the radical is real. The denominator is positive at each finite degree: eta>0 because the reciprocal r cannot agree with a polynomial at infinitely many distinct orbit points; and t>0 once J>=1 (the J=0 case is B=H).

A dimension-uniform ONE-SIDED augmented bound is also immediate:

 E_p|U_A|^2 <= 2E_p|A|^2+2q|ell(A)|^2.

This pays the otherwise unbounded residue by explicitly retaining one scalar channel. It supplies no uniform lower bound, and no estimate of the complete bridge Schur residual. To transfer it to that target one must control the actual bridge metric against this residue-augmented orbit metric, or directly use the exact exceptional eigenvalues and signed regional couplings. Neither comparison is asserted here.

## 7. The residue is precisely the modular zero-mode cancellation

The gamma functional is not an artificial conditioning device. Let

 Psi_A(h)=sum_(n>=1) e^(h/2)e^(-z_n) P_0(z_n)A(z_n),
 chi(h)=sum_(n>=1) e^(h/2)e^(-z_n)4z_n.

Then the exact derivative combination corresponding to A is Psi_A-ell(A)chi. With q(h)=e^(h/2)theta(e^(2h)), one has chi=-(D-1/2)q and psi=-(D+1/2)chi. In particular chi itself is not a decaying even profile: chi(-h)=q(h)-chi(h).

A Gaussian-polynomial Riemann-sum limit as h tends to minus infinity gives

 e^(h/2) Psi_A(h) -> ell(A),
 e^(h/2) chi(h) -> 1.

Indeed the limiting integral for the first is (1/(2sqrt(pi))) integral_0^infinity z^(-1/2)e^(-z)P_0(z)A(z) dz=ell(A); the second replaces P_0 A by 4z. Therefore the scalar residue cancels exactly the growing modular zero mode. The full derivative feature is superexponentially decaying at both ends because it equals a finite derivative combination of psi. Removing this residue would destroy that modular cancellation.

There is also an exact continuous unitary model behind the grading. For real t let g(t)=exp(-pi t^2), H_dil=1/2+t partial_t and

 f_0(t)=2(H_dil^2-1/4)g(t)=(8pi^2t^4-12pi t^2)g(t),
 f_j=H_dil^j f_0.

Under Fourier transform with phase exp(-2pi i t xi), Fourier(g)=g and Fourier H_dil=-H_dil Fourier, so Fourier(f_j)=(-1)^j f_j. Also H_dil is skew-adjoint on these Schwartz functions in continuous L2(R), and their continuous Gram is positive. The actual theta feature is the lattice sample

 psi^(j)(h)=e^(h/2)sum_(n>=1) f_j(ne^h).

Thus the exact Poisson action on the graded continuous model is unitary and preserves the two Fourier parity sectors. Transfer from this continuous positive Gram to the actual lattice-sampled complete bridge metric is a separate sampling/correlation problem; no bounded sampling operator or degree-uniform relative norm comparison is asserted. The residue obstruction in Section 4 identifies one concrete failure of a simpler comparison, not a failure of this exact Fourier representation.
