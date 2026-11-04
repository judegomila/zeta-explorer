# Uniform synthesis-column locality forces fast multiplication rows

2026-11-04. Independently audited finite-dimensional lemma and application signoff. This document does not assert selected derivative coherence or any conclusion about RH.

## 1. Hypotheses and conclusions

For every N, let G_N be a real symmetric positive-definite matrix indexed by {0,...,N}, with (G_N)_{ii}=1. Let C_N be upper triangular and satisfy

    C_N^T G_N C_N = I,
    |(C_N)_{ij}| <= K exp(-gamma |i-j|^alpha)  (i <= j),

where K,gamma,alpha>0 are independent of N. Then:

1. G_N has uniform two-sided spectral bounds.
2. For any chosen 0<beta<min(alpha,1), there are D,epsilon>0 independent of N such that

       |(C_N^{-1})_{ij}| <= D exp(-epsilon |i-j|^beta).

3. Suppose B_N is a uniformly banded matrix with polynomially growing entries: for some b,P,q independent of N,

       (B_N)_{lm}=0 if |l-m|>b,
       |(B_N)_{lm}| <= P(1+l+m)^q,

   where q>=0. Then, for some D_1,eta>0 independent of N,i,j,

       |(C_N^{-1} B_N C_N)_{ij}|
          <= D_1(1+i)^q exp(-eta |i-j|^beta).

In particular, each fixed row has a uniform stretched-exponential tail. Nestedness of the C_N is not needed for any of these finite-dimensional estimates.

## 2. Decay and moments of the inverse Gram matrix

Put H_N=G_N^{-1}=C_N C_N^T. For i<=j, write d=j-i. Upper triangularity gives

    |(H_N)_{ij}|
      <= K^2 sum_{r>=0} exp[-gamma(d+r)^alpha-gamma r^alpha]
      <= B exp(-gamma d^alpha),
    B = K^2 sum_{r>=0} exp(-gamma r^alpha) < infinity.

Here (d+r)^alpha>=d^alpha for every alpha>0. Thus there is a uniform constant U with H_N<=U I, and

    S_2 = sup_{N,i} sum_j |(H_N)_{ij}| |i-j|^2 < infinity.

No lower bound for H_N has yet been assumed.

## 3. The missing lower bound: coordinate inequality and IMS localization

Since (H_N^{-1})_{ii}=1, Cauchy-Schwarz in the H_N inner product gives

    |v_i|^2
      = |(H_N^{-1/2} e_i)^T H_N^{1/2}v|^2
      <= v^T H_N v.

Consequently, if w has support cardinality at most m,

    E(w):=w^T H_N w >= ||w||_infinity^2 >= ||w||_2^2/m.

For an integer L>=1 define phi(t)=max(1-|t|,0) and, for k in Z,

    chi_k(i) = phi(i/L-k) / [sum_l phi(i/L-l)^2]^{1/2}.

Restrict the coordinate i to {0,...,N}; retain all k whose restrictions are nonzero. This preserves

    sum_k chi_k(i)^2 = 1,
    cardinality(support chi_k) <= 3L,
    sum_k |chi_k(i)-chi_k(j)|^2 <= 4|i-j|^2/L^2.

For the last bound, the unnormalized vector of tent weights has at most two nonzero entries, norm at least 1/sqrt(2), and derivative norm sqrt(2) between integer breakpoints. Its normalized vector therefore has derivative norm at most 2 and is globally 2-Lipschitz. Restriction at either finite boundary causes no loss of the partition identity or constants.

Direct expansion gives the exact IMS identity, including its sign:

    sum_k E(chi_k v)-E(v)
      = -(1/2) sum_{i,j} (H_N)_{ij} v_i v_j
                         sum_k [chi_k(i)-chi_k(j)]^2.

Taking absolute values on the right and using 2|v_i v_j|<=|v_i|^2+|v_j|^2 yields

    sum_k E(chi_k v) <= E(v)+(2S_2/L^2)||v||_2^2.

The support bound and coordinate inequality yield

    sum_k E(chi_k v) >= (1/(3L))sum_k ||chi_k v||_2^2
                     = (1/(3L))||v||_2^2.

Hence

    E(v) >= [1/(3L)-2S_2/L^2]||v||_2^2.

Choose one integer L>=max(1,12S_2), independent of N. Then

    (6L)^{-1}I <= H_N <= U I,
    U^{-1}I <= G_N <= 6L I.

This establishes the previously missing Riesz upper bound for G_N. It does not infer that bound from diag(G_N)=1 alone: the bounded second moment of H_N is essential to the argument.

## 4. Uniform stretched-exponential inverse decay

Write A_N=C_N^{-1}. The preceding bounds imply ||A_N||<=sqrt(6L). Fix 0<beta<min(alpha,1), a center j, and the diagonal matrix

    W_{ii}=exp(epsilon |i-j|^beta).

The inequality ||i-j|^beta-|k-j|^beta|<=|i-k|^beta shows that the absolute row and column sums of W C_N W^{-1}-C_N are at most

    delta(epsilon)
      = K sum_{d>=0} exp(-gamma d^alpha)[exp(epsilon d^beta)-1].

Dominated convergence gives delta(epsilon)->0 as epsilon decreases to zero. All bounds are independent of the center and N. Choose epsilon>0 so that delta(epsilon)sqrt(6L)<=1/2. The Schur bound and the inverse perturbation formula give

    ||W A_N W^{-1}|| <= 2sqrt(6L).

Taking its (i,j) entry, with j the weight center, proves

    |(A_N)_{ij}| <= 2sqrt(6L) exp(-epsilon |i-j|^beta).

This is a finite-dimensional argument; although ||W|| can grow with N, every perturbation and inverse bound used above is uniform in N.

## 5. Polynomially growing band matrices

Choose 0<eta<min(epsilon,gamma). Since alpha>beta and distances are integers,

    exp(-gamma d^alpha)<=exp(-gamma d^beta).

For |l-m|<=b, subadditivity of the beta power gives

    |i-j|^beta <= |i-l|^beta+b^beta+|m-j|^beta.

Also

    (1+l+m)^q <= const_b,q (1+i)^q(1+|l-i|)^q.

Insert these inequalities into the sum defining (A_N B_N C_N)_{ij}. Extract exp(-eta|i-j|^beta), leaving a summable factor

    (1+|l-i|)^q exp[-(epsilon-eta)|l-i|^beta]

and a factor exp[-(gamma-eta)|m-j|^beta]<=1. There are at most 2b+1 possible m for each l. Extending the remaining l sum to all integer offsets proves

    |(A_N B_N C_N)_{ij}|
      <= D_1(1+i)^q exp(-eta|i-j|^beta).

All constants are independent of the finite prefix. This proves the stated conclusions.

## 6. Application to the actual selected polynomial basis

Work in one parity and index that parity by n=0,1,... . Let e_n be the source-normalized natural polynomials, so that X[e_n]=1. Let G_N be their actual X Gram matrix. If q_n are the actual X-orthonormal selected polynomials and

    (q_0,...,q_N)=(e_0,...,e_N) C_N,

then C_N is upper triangular, C_N^T G_N C_N=I, and diag(G_N)=1. The polynomial degree ordering makes these synthesis matrices nested.

Use B_N for the ordinary coefficient truncation of multiplication by t^2 in the e basis. It is not an X-orthogonal compression. The supplied Meixner-Pollaczek recurrence and source norm sandwich give bandwidth 1 in the parity index and

    |(B_N)_{lm}| <= P(1+l+m)^3

uniformly in N. These recurrence/norm estimates are application inputs; this audit establishes their required matrix-theoretic consequence, rather than reproving that source norm sandwich.

For a fixed column n, choose N>=n+1. The polynomial q_n has natural-basis coefficients supported in indices 0,...,n, and t^2 raises the parity index by at most one. Thus t^2 q_n lies in the prefix 0,...,N. Its natural-basis coefficient vector is exactly

    B_N C_N e_n^{coordinate},

and its selected-basis coefficient vector is exactly

    C_N^{-1} B_N C_N e_n^{coordinate}.

There is no boundary error for this column, and no limiting argument is needed. Since the selected basis is X-orthonormal, its i-th coefficient is exactly

    X(t^2 q_n,q_i).

For any fixed i and sufficiently large n, take N>=max(i,n+1). Uniform synthesis-column stretched-exponential locality would therefore imply

    |X(t^2 q_n,q_i)| <= D_i exp(-eta |n-i|^beta),

and hence a stretched-exponential bound in n.

The separately supplied theorem in

    NO_FAST_SELECTED_MULTIPLICATION_TAIL.md

excludes every such bound for every nonzero fixed selected polynomial q_i, including within either parity. Its Section 1 has precisely the row orientation used here: a_n=X(hq_n,q), with h=t^2 and q=q_i. Therefore, conditional on that analytic theorem's stated actual-source/reference and simple-real-zero inputs and on the supplied natural-basis recurrence/norm bounds, uniform stretched-exponential locality of the actual synthesis matrices C_N is impossible.

Application signoff: the finite-prefix identification, parity-index degree accounting, coefficient orientation, and absence of a boundary term for N>=n+1 are correct. A separate Riesz upper assumption is unnecessary. This conclusion excludes a uniform absolute coefficient bound, not all weaker forms of localization, and makes no assertion about selected derivative coherence or RH.
