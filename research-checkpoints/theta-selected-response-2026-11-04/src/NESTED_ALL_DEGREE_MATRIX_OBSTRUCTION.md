# A single nested all-degree matrix obstruction to the selected response estimate

2026-11-04. Abstract diagnostic with an explicit limitation. This is not an actual-theta counterexample. No frozen package or live 4CT file is changed.

## Result and scope

The polynomial source floor, natural diagonal bounds, uniform fixed-low/high Gram decay, positivity, and consistency under taking prefixes do **not**, by themselves, imply the selected determinant estimate

    a_n(s_n) = 1 + o(s_n),
    s_n = (n+2)^(-2) log(n+2)^(-7/4).

For either p=2 or p=3, the construction below gives one infinite real symmetric matrix pair (G,J), rather than a model changed with the degree, with all of the following properties:

1. Every finite prefix of G is positive definite, and every finite prefix of J is positive semidefinite. Opposite parities are orthogonal, and J annihilates the constant coordinate.
2. In a reference-orthonormal polynomial coordinate system, G_jj=log^p(j+e^2), while J_jj=(1/60)log(j+e^2) for j>=1.
3. There is the stronger-than-required uniform floor

       G_n >= (1/10) diag(log(j+e^2))_(0<=j<=n).

   In particular the actual numerical floor c/[(n+2)log^(3/4)(n+2)] is satisfied. The ordinary condition number is at most a fixed polylogarithm.
4. For every fixed a>0 there are C,c>0 independent of both indices such that

       |G_jk| <= C exp(a min(j,k) - c max(j,k)^(1/3)).

   The derivative Gram obeys such a bound too. The same assertion holds after rescaling to the unnormalized natural basis with reference squared norms comparable to (j+1)^(7/2).
5. On every finite prefix, J_n<=G_n/2. Thus even strict global positivity of G-J is compatible with the obstruction.
6. For the **fully selected** last column, h_n tends to 1/60 along all degrees, not merely a subsequence. Therefore

       a_n(s_n) = 1 + s_n(1/60 + o(1)).

All nonzero source and derivative cross terms in this construction are retained. The matrices are not asserted to satisfy the Pollaczek multiplication/displacement identities. Section 7 explicitly proves that they fail even the second displacement at the constant coordinate. The construction consequently does not rule out using those identities together with quantitative theta information, and it does not resolve the selected theta problem.

## 1. Define one infinite covariance matrix

Write

    L_j=log(j+e^2),       d_j=L_j^p,       p in {2,3}.

Set epsilon_0=d_0, epsilon_1=d_1, and epsilon_j=L_j for j>=2. On each parity chain define

    rho_j=sqrt(1-L_j^(1-p)),
    alpha_j=rho_j sqrt(d_j/d_(j-2)),                 j>=2.

In a real Hilbert space with an orthonormal family (e_j), set

    Y_0=sqrt(d_0)e_0,       Y_1=sqrt(d_1)e_1,
    Y_j=alpha_j Y_(j-2)+sqrt(epsilon_j)e_j,           j>=2,
    G_jk=<Y_j,Y_k>.

This defines a single infinite array. Every finite prefix is its principal submatrix; no coefficient depends on the eventual degree n. Induction gives

    G_jj=d_j,
    G_jk=0                                      if j,k have opposite parity,
    G_jk=sqrt(d_j d_k) product_(ell=j+2,j+4,...,k) rho_ell
                                                if j<=k have the same parity.  (1)

The transformation from innovations to (Y_0,...,Y_n) is invertible triangular, so G_n is positive definite.

## 2. A derivative matrix with genuine cross terms

Fix eta=1/2 and lambda=1/60. Put J_0k=J_k0=0. For j,k>=1 put

    J_jk=lambda sqrt(L_j L_k) eta^(|j-k|/2)       if j,k have the same parity,
    J_jk=0                                      otherwise.                    (2)

On each positive-index parity chain, the matrix eta^|r-s| is the covariance matrix of a stationary autoregressive sequence. Hence J is positive semidefinite. Its row-sum norm is bounded by

    1+2 sum_(r>=1) eta^r = (1+eta)/(1-eta)=3.

Writing D_n=diag(L_0,...,L_n), every prefix therefore obeys

    0<=J_n<=3 lambda D_n=(1/20)D_n.                                (3)

In particular all same-parity positive-index derivative cross terms are nonzero. They are part of the computation in Section 5, not dropped or bounded separately.

## 3. Uniform source floor and conditioning

Let B_n be the lower bidiagonal-on-each-parity matrix with diagonal 1 and entry -alpha_j at (j,j-2). The innovation relation gives exactly

    G_n^(-1)=B_n^T diag(epsilon_j^(-1)) B_n.                       (4)

For any x,

    x^T G_n^(-1)x
       =sum_(j<=n) epsilon_j^(-1)|x_j-alpha_j x_(j-2)|^2,

where missing predecessor terms are omitted. The elementary inequality |u-v|^2<=2|u|^2+2|v|^2 gives, for the coefficient of |x_j|^2,

    2/epsilon_j+2 alpha_(j+2)^2/epsilon_(j+2)
       <= (2/L_j)[1+(L_(j+2)/L_j)^(p-1)]
       <= 10/L_j.                                               (5)

For j=0,1, use epsilon_j=d_j>=L_j. At the final indices the missing second term only improves the estimate. Since L_j>=2 and L_(j+2)/L_j<2, the final constant 10 holds for both p=2 and p=3. Inverting the positive matrix inequality proves

    G_n >= (1/10)D_n >= (1/5)I.                                  (6)

Together, (3) and (6) imply

    J_n<=G_n/2,       ||G_n^(-1/2)J_nG_n^(-1/2)||<=1/2.            (7)

For completeness, formula (1) and the estimate in the next section give

    |G_jk|<=L_n^p exp[-|j-k|/(4L_n^(p-1))],        j,k<=n,

so every row sum is at most C L_n^(2p-1). Thus lambda_max(G_n)<=C L_n^(2p-1), while lambda_min(G_n)>=1/5. This is a polylogarithmic condition-number bound and is stronger than the required polynomial conditioning.

## 4. The uniform two-index wedge

For k>=j of the same parity, use log(1-u)<=-u:

    product_(ell=j+2,j+4,...,k) rho_ell
       <=exp[-(1/2)sum_ell L_ell^(1-p)]
       <=exp[-(k-j)/(4L_k^(p-1))].                              (8)

Consequently

    |G_jk|<=L_k^p exp[-(k-j)/(4L_k^(p-1))].                      (9)

Fix any a>0. If j<=k/2, then the right side of (9) is at most

    L_k^p exp[-k/(8L_k^(p-1))]<=C exp[-c k^(1/3)],

because k/log^(p-1)k grows faster than k^(1/3). If j>k/2, then

    |G_jk|<=L_k^p<=C exp[a j-c k^(1/3)]

after enlarging C for the bounded initial range. Symmetry proves the claimed two-index bound. Opposite parity entries vanish. Formula (2) gives still stronger off-diagonal decay for J.

To use the unnormalized natural basis Q_j with h_j asymptotic to a positive constant times (j+1)^(7/2), apply the fixed diagonal congruence G_jk -> sqrt(h_j h_k)G_jk, and likewise to J. Its additional polynomial factors are absorbed by the same argument in both regions. The source floor is then relative to the reference diagonal norm sum h_j|c_j|^2. Selection ratios are unchanged by this fixed basis conversion.

## 5. Compute the complete selected column exactly

Work first in the reference-orthonormal triangular basis (psi_j). For n>=2 define the leading-coordinate-one polynomial vector

    q_n=psi_n-alpha_n psi_(n-2).

Under the Gram realization, its source image is exactly sqrt(L_n)e_n. It is therefore orthogonal to **every** psi_j with j<n, not just a growing short prefix. The fully selected vector is exactly q_n, and

    X[q_n]=L_n.                                                   (10)

For n>=3, both involved derivative indices are positive, so all terms in (2) give

    H[q_n]
      =lambda[L_n+alpha_n^2 L_(n-2)
                     -2eta alpha_n sqrt(L_n L_(n-2))].            (11)

The cross term in (11) is essential and is included with its exact sign. Define

    r_n=alpha_n sqrt(L_(n-2)/L_n),
    r_n^2=(L_n/L_(n-2))^(p-1)-L_(n-2)^(1-p).

Since L_n/L_(n-2)->1 and L_(n-2)^(1-p)->0, r_n->1. Dividing (11) by (10),

    h_n=lambda(1+r_n^2-2eta r_n)
        ->2lambda(1-eta)=1/60.                                  (12)

This holds along all n, hence in both complete parity spaces. Multiplying q_n by the inverse of its leading polynomial coefficient to make it monic cancels from the ratio and changes no conclusion. Degrees zero, one, and two are harmless fixed exceptions to the displayed n>=3 formula.

For comparison, the natural individual ratios are

    J_nn/G_nn=lambda L_n^(1-p)->0.

Full endpoint selection therefore does not preserve this favorable individual ratio, despite (6), (8), and global Q positivity.

## 6. The determinant response at the requested scale

Let A_n(s) be the complete monic minimum for G_n+sJ_n, and let a_n(s)=A_n(s)/A_n(0). The exact selected spectral representation from the audited determinant-slope note applies. With kappa_n<=1/2, its secant estimate gives, uniformly in n,

    h_n-s/4 <= [a_n(s)-1]/s <=h_n,       s>0.                     (13)

Thus for any positive s_n->0, and specifically for the requested polynomial scale,

    [a_n(s_n)-1]/s_n ->1/60.                                     (14)

The determinant quotient itself consequently fails the 1+o(s_n) target. This is an evaluated all-degree countermodel, not a restatement of the slope criterion or an equivalence claimed as progress.

## 7. Explicit structural limitation: second displacement fails

The preceding construction deliberately addresses the quantitative matrix hypotheses. It cannot be substituted for the actual theta matrices. This failure can be witnessed without inspecting high degrees.

In the reference-orthonormal natural Pollaczek basis, multiplication by t is the symmetric Jacobi matrix M with

    t psi_j=beta_j psi_(j+1)+beta_(j-1)psi_(j-1),
    beta_j=sqrt((j+1)(j+9/2)).

The exact source displacement identity requires

    (M^2G-2MGM+GM^2)_00=-2W_00<0,                               (15)

where W is the positive value Gram. The finite-theta boundary correction also vanishes at this constant-coordinate second displacement.

For the present covariance, however, direct multiplication gives

    (M^2G-2MGM+GM^2)_00
      =2beta_0^2(d_0-d_1)
           +2beta_0 beta_1 sqrt(d_0(d_2-L_2))>0.                 (16)

To check the strict sign without numerical evidence, use L_0=2, L_1<9/4, L_2<5/2, d_2>=2^p, beta_0^2=9/2, and beta_0 beta_1=sqrt(99/2). Half the right side of (16) is bounded below by

    -(9/2)[(9/4)^p-2^p]+sqrt[(99/2)2^p(2^p-5/2)].

For p=2 this is sqrt(297)-153/32>0. For p=3 it is sqrt(2178)-1953/128>0. Hence (15) fails explicitly for both versions.

The selected columns here also have only two nonzero coefficients. No assertion is made that this satisfies the separate actual-theta obstruction to localized selected columns. In particular this construction is **not** a counterexample to the conjunction of every known actual-theta structural theorem.

What is established is narrower and concrete: adding the polynomial source floor and uniform two-index wedge to favorable natural diagonal ratios, nested all-degree consistency, full endpoint selection, and even a uniform positive signed gap still leaves the requested selected determinant response unforced. Any actual-theta proof must use additional structure or quantitative information that excludes this construction. No full-theta determinant estimate, selected sign theorem, selected coherence limit, or RH conclusion is proved here.

## Inputs

- /workspace/shared/theta_finite_arithmetic_sign_20261104/SELECTED_DETERMINANT_SLOPE_CRITERION.md, for the selected spectral representation and secant bound.
- /workspace/shared/theta_degree_effective_partial_selection_20261104/UNIFORM_GRAM_AND_PARTIAL_SELECTION.md, for the quantitative hypotheses being tested.
- /workspace/shared/theta_nonlocal_selected_20261104/GENERATING_KERNEL_AND_SIGNED_CANCELLATION.md, for the source displacement identity.
- /workspace/shared/theta_finite_arithmetic_sign_20261104/FINITE_BOUNDARY_DISPLACEMENT_AUDIT.md, for the finite boundary correction at the second displacement.

The construction and proofs above are analytical. A companion numerical script is only a finite-dimensional sanity check, not a proof of the asymptotic theorem or an actual-theta computation.
