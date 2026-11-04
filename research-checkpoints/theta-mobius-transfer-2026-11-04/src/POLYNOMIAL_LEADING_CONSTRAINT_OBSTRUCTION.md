# The leading-coefficient obstruction in a natural arithmetic-to-polynomial map

2026-11-04. This note tests one explicit map, not all possible transfer mechanisms. It proves a mismatch of affine selectors with a controlled error and an accompanying carrier-frequency tradeoff. It does not identify a GCD Gram with the actual theta Gram, and proves no failure of the actual selected limit.

## 1. The explicit common-degree approximation map

Let Q_j(t)=P_j^(4)(t/2;pi/2), whose leading coefficient is 1/j!. The exact generating function gives

    exp(i xi t)=sech(xi)^8 sum_(j>=0) Q_j(t)(i tanh xi)^j.

Write E_(m,xi) for its degree-m truncation. For integer labels 1<=a<=N with N>=2 and a real center gamma, define

    L_(m,N,gamma)c=sum_(a=1)^N c_a E_(m,log a-gamma).

For m>=N-1, this map is injective: its first N Pollaczek coordinates form a diagonal rescaling of a Vandermonde matrix in the distinct numbers tanh(log a-gamma). Its leading-coefficient functional is exactly

    LC_m(Lc)=(i^m/m!) sum_a l_a c_a,
    l_a=sech(log a-gamma)^8 tanh(log a-gamma)^m.           (1)

Thus a monic degree-m condition pulls back to a nonzero multiple of the functional l, not automatically to the arithmetic endpoint functional e_N. Multiplying every image by the same monomial t^d changes the degree to d+m but leaves this functional unchanged. These are complex polynomial maps; taking real or imaginary parts need not preserve either the same arithmetic Gram or the same affine selector.

The source and derivative approximation bounds from the preceding package apply to these columns. In particular, at gamma=log N, the exact norm-tail argument gives uniformly for 1<=a<=N

    sqrt(X[E_(m,log(a/N))-exp(it log(a/N))])
      +sqrt(H[E_(m,log(a/N))-exp(it log(a/N))])
          <= C N exp(-c m/N^2).                          (1a)

To see this, put delta=1-|tanh(log(a/N))|>=2/(N^2+1). The actual Pollaczek source/derivative norms are O((j+1)^(7/2)), while sech^8=(1-r^2)^4<=16delta^4. Their tail is at most Cdelta^(-1/2)exp(-delta m/2), which yields (1a), including the exact zero-frequency column. The constants depend only on F. The whole synthesis-map error is at most C N^(3/2)exp(-c m/N^2)||c||_2 by Cauchy-Schwarz.

Thus the column errors tend rapidly to zero on the same m/(N^2 log N)->infinity regime used below. They do not change (1). Even an exact equality of pulled-back quadratic forms would not identify two different affine constraints.

## 2. Centering at the arithmetic endpoint reverses the leading constraint

The favorable Mobius response uses gamma=log N. Then the last label has frequency zero:

    E_(m,0)=1,       l_N=0   for m>=1.                  (2)

For a<N, set

    r_a=(N^2-a^2)/(N^2+a^2)>0,
    b_a=[2aN/(N^2+a^2)]^8.

Up to the common sign (-1)^m, l_a=b_a r_a^m. For every fixed N>=2,

    l/l_1 -> e_1   as m -> infinity,                    (3)

exponentially. This is the first arithmetic coordinate, rather than the last. For N>=3 a uniform elementary estimate is

    ||l/l_1-e_1||_2
       <= N^(17/2) exp(-c m/N^2).                       (4)

Indeed b_a/b_1<=a^8<=N^8 and r_a/r_1<=r_2/r_1 for a>=2, while

    1-r_2/r_1=6N^2/[(N^2+4)(N^2-1)]>=c/N^2.

The a=N term is zero, and summing at most N coordinates proves (4). For N=2 the equality l/l_1=e_1 is exact. All ratios in this section disregard only the common sign, which cannot alter an affine selector's direction.

## 3. The mismatch remains large in the exact arithmetic energy metric

Let K be the full positive GCD matrix on 1,...,N. A linear functional z has normalized selected direction

    v_z=K^(-1)z/sqrt(z* K^(-1)z),
    ||v_z||_K=1.

The normalization is by energy; the harmless scalar that sets a particular monic value does not change the direction. The exact divisor factorization gives

    (K^(-1))_(N,N)=N/phi(N),
    (K^(-1))_(1,N)=sqrt(N)mu(N)/phi(N),
    (K^(-1))_(1,1)=sum_(d<=N)mu(d)^2/phi(d)>=1.

Consequently the endpoint directions obey the exact identity

    |<v_(e_1),v_(e_N)>_K|^2
       =mu(N)^2/[phi(N)(K^(-1))_(1,1)]
       <=1/phi(N).                                    (5)

They are exactly orthogonal when N is not squarefree. In all cases their squared overlap tends to zero as N grows; for example the elementary product bound phi(N)>=sqrt(N/2) suffices.

For completeness, the inverse triangular divisor matrix has entries

    (R^(-1))_(a,d)=sqrt(a/phi(d))mu(d/a) 1_(a|d),
    K=R*R.

Hence

    ||K^(-1)||<=||R^(-1)||_F^2
       <=sum_(d<=N)sum_(a|d)a
       <=C N^2 log(N+2).                               (6)

The last step uses sum_(a|d)a=d sum_(k|d)1/k<=d(1+log d). This is a deliberately crude exact-model bound used only to quantify the constraint error, not an inference of theta selection from conditioning.

Combining (6) with (1a) also makes the approximation error uniform in the arithmetic energy metric. If f_c(t)=sum_a c_a exp(it log(a/N)), then

    sqrt(X[L_(m,N,log N)c-f_c])
       +sqrt(H[L_(m,N,log N)c-f_c])
       <=C N^(5/2)sqrt(log(N+2))exp(-c m/N^2) sqrt(K[c]). (6a)

Thus the map's source and derivative errors are explicitly small on the whole growing coefficient space, relative to K. This is an error between the exact exponential packet and its polynomial approximation; it does not say that the packet's actual Gram equals K. The affine mismatch persists despite this controlled norm approximation.

Equations (4) and (6), together with ||e_1||_(K^(-1))>=1, show that the relative dual-norm error is at most

    eta_(m,N)=C N^(19/2)sqrt(log(N+2))exp(-c m/N^2).

Whenever eta_(m,N)<=1/2, normalization in this Hilbert norm gives

    |<v_l,v_(e_N)>_K|
       <=phi(N)^(-1/2)+C eta_(m,N).                    (7)

Thus if N grows and m/(N^2 log N) tends to infinity, the common-degree centered map's image-restricted monic selected direction is asymptotically orthogonal to the audited Mobius endpoint direction, even if one grants the desired arithmetic Gram K exactly. The mismatch is not repaired by making the column approximations more accurate. At fixed N it converges to the precise non-endpoint overlap in (5).

This is a statement about the explicit map and the exact arithmetic model. It does not assert that its pulled-back actual theta Gram equals K. Such an equality or controlled relative approximation would be an additional requirement, not a premise silently supplied here.

## 4. Moving the center to favor the last coordinate introduces a carrier cost

For a fixed N and center gamma, the asymptotic largest leading-coefficient magnitude in (1) is determined by the largest |log a-gamma|. The maximum is at an endpoint of the label interval. The last coordinate strictly dominates only if

    |log N-gamma|>|gamma|,  equivalently gamma<(1/2)log N. (8)

At equality the first and last coordinates tie. When the last coordinate dominates,

    c_gamma:=log N-gamma > (1/2)log N.                  (9)

Let c^(N) be the exact fully K-selected vector with last coefficient one. Write D_N=diag(log(a/N)) and D_gamma=D_N+c_gamma I. Since (D_N c^(N))_N=0 and complete K selection is orthogonality to every older coordinate,

    K(c^(N),D_N c^(N))=0.

Using the already proved exact response R_N=sum_(p|N)(log p)^2/(p-1), one obtains

    K[D_gamma c^(N)]/K[c^(N)] = R_N+c_gamma^2.          (10)

This carrier contribution is exact, including the vanishing mixed term; it is not bounded away by a scalar approximation.

The same cost has a useful lower bound even after full reselection in the positive-sum model

    G=alpha K+beta D_gamma K D_gamma,
    J=beta D_gamma K D_gamma,   alpha>0, beta>=0.

Let u minimize G with u_N=1, and let A_0=phi(N)/N. Since (D_gamma u)_N=c_gamma, complete K minimality gives J[u]>=beta c_gamma^2 A_0. The bare selected trial gives G[u]<=A_0[alpha+beta(R_N+c_gamma^2)]. Therefore

    J[u]/G[u] >= beta c_gamma^2/
                            [alpha+beta(R_N+c_gamma^2)]. (11)

In particular, for alpha=(log T)^3, beta=log T, N=T^(theta+o(1)) with fixed theta>0, and any center satisfying (8),

    liminf J[u]/G[u] >= (theta^2/4)/(1+theta^2/4)>0,    (12)

because R_N=O(loglog^2 N)=o(log^2 T). This is a counterexample to transferring the *centered* model's vanishing response while freely moving its carrier to align the leading coefficient. It concerns the explicitly defined GCD model, not the actual theta source or actual selected polynomials.

## 5. What this rules out, and what it leaves open

For the natural common-degree Pollaczek approximation map, endpoint centering makes the polynomial leading constraint approach the first arithmetic label. Recentring so that the last label controls that constraint adds a non-negligible derivative carrier at polynomial label growth. Both conclusions are quantitative and retain the exact arithmetic metric and complete endpoint selection.

Neither conclusion proves that no alternative map can work. A successful transfer would need to control simultaneously:

- the full source and derivative forms, including growing arithmetic corrections;
- the monic affine functional, not only the vector-space dimension or Gram norm;
- the image of the entire lower polynomial-degree space, rather than just a sparse arithmetic trial space;
- any carrier compensation and its mixed terms.

In particular, triangularizing these columns or adding tiny highest-degree terms changes the affine functional, and absolute approximation accuracy alone does not control the resulting monic problem. No quantitative impossibility for every such modified map is asserted.

The actual-theta upper estimate h_n->0 and its adjacent-determinant form remain open. No frozen file, 4CT artifact, or repository is changed.
