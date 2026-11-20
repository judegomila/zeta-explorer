# Actual-theta full-Gram spectral counting and an exterior-volume obstruction

2026-11-04. Analytical working investigation. The new result is a degree-effective lower spectral count for the **actual**, fully populated theta Gram pair. It is not a proof of selected derivative decay, and it is not merely the already known divergence of the selected trace. No frozen package or 4CT file is changed.

## 1. Outcome

Let

    X[p]=||Fp′+2F′p||₂²,       H[p]=||Fp′||₂²,

where F is the supplied fixed nonzero real multiple of Xi. Let G_n and J_n be these exact forms on every polynomial of degree at most n, in any common real basis, and set

    K_n=G_n^(-1/2) J_n G_n^(-1/2),
    N=n+2,   L=log N.

Every lower-degree direction and every arithmetic cross term are included. For the complete X-orthonormal selected basis q_j=P_j/sqrt(A_j), K_n is unitarily equivalent to the matrix (H(q_j,q_k))_(j,k<=n).

**Theorem.** There is an unbounded set of fixed periods T such that, for each such T, constants C_T and n_T give the following statement for every n>=n_T. The actual degree-at-most-n polynomial space contains a subspace of dimension

    D_(T,n) = (T/(8pi)) L + O(1)

on which, uniformly for nonzero p,

    |H[p]/X[p] - 1| <= C_T/L².                         (1)

There are separately even and odd subspaces of dimension

    d_(T,n) = (T/(16pi)) L + O(1),                    (2)

with the same property. Consequently, writing eigenvalues in decreasing order,

    lambda_(D_(T,n))(K_n) >= 1-C_T/L².                (3)

Only this one-sided statement about the **full** eigenvalues is claimed. A subspace whose Rayleigh quotients are near one need not produce a two-sided eigenvalue cluster in the full matrix.

For every fixed 0<epsilon<1, (3) and arbitrarily large fixed T imply

    #{j:lambda_j(K_n)>=1-epsilon}/log(n+2) -> infinity. (4)

For every fixed s>0,

    log[det(G_n+sJ_n)/det(G_n)]/log(n+2) -> infinity.  (5)

Thus the fixed-s full determinant response eventually exceeds every fixed power of n. More quantitatively, if alpha_(T,n)=1-C_T/L²>0, then for every s>=0,

    det(G_n+sJ_n)/det(G_n) >= (1+s alpha_(T,n))^D_(T,n), (6)

and every exterior-power coefficient satisfies

    tr(wedge^r K_n) >= binom(D_(T,n),r) alpha_(T,n)^r,
                                      0<=r<=D_(T,n).  (7)

This is a genuine full-Gram obstruction: no bounded or polynomial fixed-positive-s volume-response estimate, and no O(log n)-rank approximation in operator norm with error eventually below a fixed number less than one, can hold. It is compatible with a sublinear log-volume response, with density-one selected decay, and with h_n=H[q_n]->0. None of those upper conclusions is established here.

The existing all-degree lower h_n >= c N^(-1/2)L^(-11/2) already gives a stronger lower bound on tr K_n than the dimension in (3). The new content is the **number of generalized eigenvalues bounded away from zero**, its degree-effective realization, and the ensuing fixed-s/exterior-volume obstruction. The earlier trace lower bound does not by itself provide these statements when the largest generalized eigenvalue can grow with n.

## 2. Inputs and exact source identity

The supplied actual-theta bounds give

    |F(t)|²+|F′(t)|² <= C W_4(t),
    W_4(t)=|Gamma(4+it/2)|².                           (8)

F and its fixed-order derivatives have exponential decay times a polynomial. The latter follows either from the supplied theta/gamma representation and fixed-order zeta derivative bounds, or the earlier whole-strip estimates. Only continuity, sufficient decay, and the bound (8) are used below.

Integration by parts gives, for polynomials and also for bounded trigonometric polynomials,

    X[p]=H[p]+Q[p],
    Q[p]=integral_R V(t)|p(t)|² dt,
    V(t)=2(F′(t)²-F(t)F″(t)).                         (9)

For complex p, the mixed source term is
2 integral FF′ (|p|²)′; integration by parts yields (9) with the same real V. The boundary terms vanish because F and F′ decay exponentially. No sign of V is assumed, and no division by F is made. In particular every real Xi zero remains in the forms.

Exact source identities and (8) are recorded in:

- /workspace/shared/theta_nonlocal_selected_20261104/GENERATING_KERNEL_AND_SIGNED_CANCELLATION.md, Sections 1 and 3.
- /workspace/shared/theta_polynomial_comparison_20261104/GENERAL_REFERENCE_AND_NATURAL_COROLLARIES.md.

The reference Pollaczek facts used next are the same elementary generating-function and orthogonality identities used in the natural-family packages, with parameter lambda=4 rather than 9/4. Their role is only to construct genuine approximating polynomials. The theta Gram itself is never replaced by this reference Gram.

## 3. Exact high-frequency approximation by degree-n polynomials

Let

    Q_j(t)=P_j^(4)(t/2;pi/2),
    sum_(j>=0) Q_j(t) z^j
        =(1+z²)^(-4) exp(t arctan z),       |z|<1.    (10)

In L²(W_4 dt), these polynomials are orthogonal, with squared norms

    b_j = c_4 Gamma(j+8)/j!,

where c_4>0 is fixed. In particular b_j is increasing and b_j<=C(j+1)^7. Differentiating (10) in t gives the exact finite identity

    Q_j′ = sum_(odd ell<=j)
             (-1)^((ell-1)/2) Q_(j-ell)/ell.

Orthogonality, with all derivative cross terms evaluated rather than discarded, therefore gives

    ||Q_j′||_(W_4)²
       =sum_(odd ell<=j) b_(j-ell)/ell²
       <=(pi²/8)b_j.

Combining this with (8) and the triangle inequality for the actual source proves

    sqrt(X[Q_j])+sqrt(H[Q_j]) <= C(j+1)^(7/2).        (11)

For any real xi>=0, substitute z=i tanh xi in (10). Since arctan(i tanh xi)=i xi,

    exp(i xi t)
       =(cosh xi)^(-8) sum_(j>=0) Q_j(t)(i tanh xi)^j. (12)

The polynomial truncation at j=n is denoted E_(n,xi)(t). The series and its t-derivative converge locally uniformly, and (11) makes the source and derivative series converge absolutely in their respective L² norms. Thus (12) is also an identity in both seminorms used here; it is not only a formal generating function.

If 0<=xi<=L/4, put r=tanh xi. Then

    1-r = 2/(exp(2xi)+1) >= N^(-1/2),
    r^j <= exp(-j/sqrt(N)).

By (11), uniformly in this entire frequency range,

    sqrt(X[E_(n,xi)-exp(i xi t)])
       +sqrt(H[E_(n,xi)-exp(i xi t)])
       <= C sum_(j>n) (j+1)^(7/2) exp(-j/sqrt(N))
       <= C N^(9/4) exp(-c sqrt(N)) =: e_n.           (13)

For the last bound, take out exp(-n/(2sqrt(N))) and bound the remaining full sum by C(sqrt(N))^(9/2). Small degrees are absorbed in the constant. The factor (cosh xi)^(-8)<=1 can only improve the estimate.

Since Q_j has parity j, Re E_(n,xi) is even and Im E_(n,xi) is odd. They approximate cos(xi t) and sin(xi t), respectively, with the same error bound. No non-polynomial trial is used after this truncation step.

## 4. Periodization retains the full signed potential

Let Z be the real zero set of F. It is discrete and countable because F is a nonzero entire function. Call a period T>0 admissible if

    T notin {z-z′: z,z′ in Z}.

The excluded set is countable, so admissible T exist arbitrarily far out. Define the exact periodizations

    W_T(t)=sum_(k integer) F(t+kT)²,
    V_T(t)=sum_(k integer) V(t+kT).

Exponential decay gives locally uniform absolute convergence and continuous T-periodic functions. If W_T(t)=0, every nonnegative term is zero, in particular F(t)=F(t+T)=0. This contradicts admissibility. Compactness therefore gives

    m_T:=min_[0,T] W_T >0,
    v_T:=max_[0,T] |V_T| <infinity.                   (14)

This is a positive periodized value weight, not a claim that F has a positive lower bound on the real axis. Real zeros are retained exactly, and the potential V_T is still signed.

Set omega=2pi/T, and let

    a_n=ceil(L/(8omega)),
    b_n=floor(L/(4omega)),
    d_(T,n)=b_n-a_n+1.

For sufficiently large n this is a positive integer and

    d_(T,n)=T L/(16pi)+O(1).

Consider either the real cosine band or the real sine band with integer frequencies m in [a_n,b_n]. For any f in either band, the exact periodic integration formulas give

    H[f]=integral_0^T W_T |f′|²,
    Q[f]=integral_0^T V_T |f|².

Unweighted trigonometric orthogonality gives

    integral_0^T |f′|² >= (L/8)² integral_0^T |f|².

Therefore

    H[f] >= m_T(L/8)² integral_0^T |f|²,
    |Q[f]| <= v_T integral_0^T |f|²,
    |Q[f]|/H[f] <= 64 v_T/(m_T L²).                  (15)

This estimate does not scalar-average the theta arithmetic. W_T and V_T are the **exact** periodized functions; their bounds are fixed constants for each T. In particular no arithmetic m!=ell term has been removed or replaced by its mean.

For coefficients c_m in either band,

    integral_0^T |f|²=(T/2)sum |c_m|².

Equations (9) and (15) show, for sufficiently large n depending on T,

    sqrt(X[f]) >= c_T L ||c||_2,
    |H[f]/X[f]-1| <= C_T/L².                         (16)

The same statements hold for the direct sum of the two bands. Alternatively, parity makes X and H cross terms between the even and odd bands vanish exactly.

## 5. Transfer the entire bands to genuine polynomial subspaces

Replace each cosine or sine mode by the respective real or imaginary part of E_(n,m omega). The resulting linear map f -> p_n(f) takes each band into the correct parity polynomial space of degree at most n. Every frequency is at most L/4, so (13) and Cauchy–Schwarz over its d_(T,n) coefficients give

    sqrt(X[p_n(f)-f])+sqrt(H[p_n(f)-f])
         <= sqrt(d_(T,n)) e_n ||c||_2.               (17)

The source error divided by the lower source norm in (16) is at most

    C_T e_n/sqrt(L) ->0,

and the same comparison holds for H. In particular the map is injective for sufficiently large n: p_n(f)=0 would contradict the reverse triangle inequality and (16)-(17). Thus the dimensions of the two polynomial images are exactly d_(T,n).

Applying the ordinary triangle and reverse triangle inequalities to both norms in (17), and then using (16), proves on each image

    |H[p_n(f)]/X[p_n(f)]-1|
       <= C_T/L² + C_T e_n/sqrt(L)
       <= C_T′/L².                                  (18)

The final inequality holds for all sufficiently large n. Their direct sum has dimension D_(T,n)=2d_(T,n), and the same quotient bounds hold on it, because X and H are parity orthogonal. This proves (1)-(2) without requiring any statement about the actual selected coefficients.

## 6. Full selection, exterior powers, and quantified limitations

The degree-n positive source Gram is invertible. Conjugating the polynomial subspace of Section 5 by G_n^(1/2) turns its quotient bound into a Rayleigh-quotient bound for K_n. The finite-dimensional min-max principle proves (3). Since K_n>=0, at least D_(T,n) of its eigenvalues are >=alpha_(T,n)=1-C_T/L². Multiplying eigenvalue factors proves (6); summing r-fold eigenvalue products proves (7).

For any fixed epsilon>0 and any fixed admissible T, eventually alpha_(T,n)>=1-epsilon. Dividing the eigenvalue count by L and using (2) gives

    liminf_n #{lambda_j(K_n)>=1-epsilon}/L >= T/(8pi).

Admissible fixed T are arbitrarily large. For any desired finite lower bound choose T first and then n sufficiently large. This proves (4). No uniformity of m_T, v_T, C_T or n_T in T is asserted or used.

Similarly, for fixed s>0,

    liminf_n log det(I+sK_n)/L
        >= (T/(8pi))log(1+s).

Choosing arbitrarily large admissible fixed T proves (5). The proof applies separately in either complete parity space, with T/(16pi) instead of T/(8pi).

### What a low-rank approximation cannot do

Suppose R_n has rank O(log n), while ||K_n-R_n||_2<=rho<1 eventually. Choose epsilon>0 with 1-epsilon>rho. The singular-value min-max inequality for a rank-r approximation implies lambda_(r+1)(K_n)<=||K_n-R_n||_2. This contradicts (4). The same conclusion holds for self-adjoint or arbitrary R_n; K_n is positive, so its singular values equal its eigenvalues. Thus a fixed/O(log n)-rank treatment with a uniformly subunit operator error cannot replace the exact relative derivative Gram.

### What remains entirely possible

1. The constructed subspaces are not the individual selected endpoint q_n. Equation (1) cannot be used to conclude h_n is near one or bounded below by a positive constant.
2. The number in (3) is o(n) for each fixed T, and (4) gives no positive-density count. It is compatible with tr K_n=o(n), and therefore with density-one h_n->0.
3. The earlier actual all-degree h_n lower bound gives tr K_n>=c sqrt(n)log(n)^(-11/2), stronger than the present trace lower consequence. This work does not relabel that trace fact as new.
4. At the requested microscopic s_n=N^(-2)L^(-7/4), (6) yields only a lower full-volume response of order s_n D_(T,n). It supplies no vanishing upper bound for the **adjacent** selected determinant quotient a_n(s_n), and no improvement on the existing microscopic trace lower bound.
5. The statement that the full determinant grows faster than every polynomial at fixed s does not exclude log det(I+sK_n)=o(n). An eventual density-one proof through full volume would need that much sharper sublinear upper estimate, with sufficient spectral-tail control to recover tr K_n=o(n). The known polynomial bound on ||K_n|| does not make a fixed-s o(n) logarithmic determinant bound sufficient by itself.
6. The argument uses exact actual forms but only comparatively soft theta inputs. It identifies a real obstruction to proposed full-volume/low-rank mechanisms; it does not evaluate the difficult arithmetic cancellations in the selected inverse column.

## 7. Transfer to the growing exact finite-arithmetic model

The audited finite-arithmetic reduction supplies, for M=ceil(K sqrt(N log N)) and sufficiently large fixed K,

    |X_M[p]-X[p]| <= delta_n X[p],
    |H_M[p]-H[p]| <= delta_n X[p],
    delta_n=exp(-A N log N),

uniformly on degree at most n. Apply these inequalities to the actual polynomial subspaces of Section 5. If H[p]/X[p]>=alpha_(T,n), then

    H_M[p]/X_M[p] >= (alpha_(T,n)-delta_n)/(1+delta_n).

Consequently the same degree-effective eigenvalue count and determinant/exterior inequalities hold for the full finite-model pair, with this slightly smaller lower bound. Every ordered arithmetic pair 1<=m,ell<=M is retained in the finite forms, as required by the audit. The construction never differentiates a reflected finite kernel distributionally and does not omit its boundary corrections.

Read-only source:
/workspace/shared/theta_finite_arithmetic_reduction_20261104/UNIFORM_FINITE_ARITHMETIC_AUDIT.md.

## 8. Remaining upper problem

No noncircular upper bound h_n->0, no density-one upper bound, and no estimate a_n(s_n)=1+o(s_n) has been established. The exact source-selecting determinants remain the target, rather than a substitute proof.

The new obstruction is precise: the actual derivative Gram contains superlogarithmically many generalized directions of size at least 1-epsilon, realized by explicit degree-controlled parity polynomials, so its fixed-s exterior volume cannot have merely polynomial growth. A successful selected-upper proof must distinguish its one complete endpoint or obtain genuinely sublinear cumulative information while retaining these directions. Neither determinant coefficient positivity nor a finite/O(log n)-rank reduction can remove them.

This is analytical, AI-assisted work, not machine formalization or external peer review. No numerical evidence is used for any sign or asymptotic claim.


## 9. Independent analytical check

A separate AI-assisted mathematical check verified the periodization positivity, source-norm lower bound, exact lambda=4 Pollaczek expansion, seminorm convergence, degree-uniform truncation, parity dimensions, min-max direction, exterior coefficient inequality, and fixed-T-before-n limiting argument. No correction to the theorem was required. It also observed that retaining the factor (cosh xi)^(-8) in (13) improves its harmless error prefactor from N^(9/4) to N^(1/4): if delta=1-tanh xi, then (cosh xi)^(-8)=(1-r²)^4<=16 delta^4, and the tail is at most C delta^(-1/2)exp(-delta n/2). The weaker displayed error is already sufficient. This check does not certify any selected upper bound; none is claimed.
