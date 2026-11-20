# Independent audit: the common-degree leading-constraint obstruction

2026-11-04. Read-only analytical audit of `POLYNOMIAL_LEADING_CONSTRAINT_OBSTRUCTION.md`, using the frozen `theta_full_selection_20261104/EXACT_GCD_ENDPOINT_SELECTION.md`, `FULL_GRAM_DETERMINANT_INVESTIGATION.md`, and `QUANTITATIVE_PERIOD_SPECTRAL_COUNT.md` as stated inputs. Only this new working audit is written. No frozen, repository, or 4CT artifact is changed. This is AI-assisted mathematical checking, not external peer review or machine formalization.

## Verdict

All substantive identities, powers of N, approximation bounds, metric estimates, and variational inequalities pass. In particular:

- The exact polynomial leading functional is the displayed l, not the integer endpoint e_N.
- At gamma=log N, l_N=0 and l/l_1 approaches e_1 with the claimed uniform error.
- The inverse-divisor normalization and the exact squared endpoint overlap are correct.
- The source/derivative column error is C N exp(-c m/N^2); its full synthesis error is C N^(3/2) exp(-c m/N^2).
- The dual-norm constraint error has the claimed N^(19/2) sqrt(log(N+2)) prefactor.
- The carrier contribution and its lower bound after genuine full reselection are correct, including the positive limiting lower bound at polynomial arithmetic-label growth.

The scope is correctly restricted to this explicit map and expressly defined GCD comparison models. No failure of actual theta-selected decay or impossibility of every modified map follows.

Two optional precision edits would remove edge-case or terminology ambiguity without changing a theorem: state N>=2 for the nontrivial leading-functional discussion, and call the conditional K-selected monic direction in Section 3 the **image-restricted** monic direction. The latter is already clear from the model qualification and final list of missing full-space requirements.

## 1. Exact map, leading coefficient, and injectivity

The generating function is

    sum_(j>=0) Q_j(t) z^j = (1+z^2)^(-4) exp(t arctan z).

For z=i tanh xi, one has arctan z=i xi and (1+z^2)^(-4)=cosh(xi)^8. Consequently

    exp(i xi t)=sech(xi)^8 sum_(j>=0) Q_j(t)(i tanh xi)^j

for either sign of real xi. The leading coefficient of Q_j is 1/j!: it follows directly by selecting the highest t-power in the generating function. Therefore the coefficient of t^m in the truncation is exactly

    i^m sech(xi)^8 tanh(xi)^m / m!.

No lower-j term contributes to that coefficient. This proves equation (1), including its phase and factorial.

The first N Pollaczek coefficient rows of the synthesis map are a nonzero row rescaling by powers of i and a nonzero column rescaling by sech(log a-gamma)^8 of the Vandermonde matrix in tanh(log a-gamma). The nodes are distinct for finite real gamma. For m>=N-1 this proves injectivity independently of any norm approximation.

For N>=2 the leading functional is nonzero when m>=1, because at most one frequency can be zero. For m=0 the formula is interpreted through the generating function with the zero-th power equal to one. The sole degenerate corner N=1, gamma=0, m>=1 has E_(m,0)=1 and identically zero degree-m leading functional; there is then no monic degree-m image problem. This does not affect any asymptotic assertion in the note.

Multiplying all images by t^d indeed preserves their old leading coefficient as the new degree-(m+d) coefficient. It need not preserve either pulled-back quadratic form; the note does not say it does. Taking real or imaginary parts changes the map and can change its dimension, Gram, and affine selector, as the note correctly cautions.

## 2. Actual source and derivative tail

The frozen base establishes

    |F|^2+|F'|^2 <= C |Gamma(4+it/2)|^2,
    ||Q_j||_(W_4)^2 = c_4 Gamma(j+8)/j!,
    Q_j' = sum_(odd k<=j) (-1)^((k-1)/2) Q_(j-k)/k.

Orthogonality gives

    ||Q_j'||_(W_4)^2
       = sum_(odd k<=j) ||Q_(j-k)||_(W_4)^2/k^2
       <= (pi^2/8)||Q_j||_(W_4)^2.

Thus the actual source and derivative norms are bounded by C(j+1)^(7/2). This is an actual-form majorization used for approximation, not a replacement of the actual form by a reference Gram. Absolute convergence in both norms and local convergence identify the summed series with the exponential and its derivative.

Write r=|tanh xi| and delta=1-r. For 0<delta<=1,

    sech(xi)^8=(1-r^2)^4<=16 delta^4,
    r^j<=exp(-delta j),
    sum_(j>m)(j+1)^(7/2)exp(-delta j)
       <= C delta^(-9/2)exp(-delta m/2).

The last inequality follows by extracting exp(-delta m/2) and summing the remaining half-rate exponential against the polynomial weight. Multiplication by delta^4 leaves exactly delta^(-1/2), not delta^(-9/2).

At xi=log(a/N),

    delta=2a^2/(N^2+a^2)>=2/(N^2+1).

Hence delta^(-1/2)<=C N and exp(-delta m/2)<=exp[-m/(N^2+1)], proving (1a) with an absolute positive c after adjusting C. At a=N the truncation is exactly 1, so the actual error is zero; the displayed upper bound remains valid. Negative frequencies require no new estimate, since the same absolute coefficient bounds apply.

For any synthesis coefficient vector c, the triangle inequality followed by Cauchy-Schwarz yields the extra factor sqrt(N). Therefore the claimed C N^(3/2) exp(-c m/N^2)||c||_2 synthesis bound is correct.

These are absolute errors in the actual X and H norms. They do not alone give relative errors on a possibly ill-conditioned selected affine slice, or a comparison with the GCD energy. The note does not use them in either way.

## 3. Centered leading-functional concentration

For a<N,

    r_a=(N^2-a^2)/(N^2+a^2),
    b_a=[2aN/(N^2+a^2)]^8,
    l_a=(-1)^m b_a r_a^m.

The endpoint l_N vanishes for m>=1, and all the nonzero l_a have the same sign. The sequence r_a strictly decreases with a. For N>=3,

    b_a/b_1 = [a(N^2+1)/(N^2+a^2)]^8 <=a^8<=N^8,
    1-r_2/r_1 = 6N^2/[(N^2+4)(N^2-1)].

For example, the last expression is at least 4/N^2 for N>=3. Thus every a>=2 has

    |l_a/l_1|<=N^8 exp(-4m/N^2),

with the a=N coordinate actually zero. Summing squares of at most N coordinates proves N^(17/2) exp(-c m/N^2). For N=2 only a=1 survives, so equality with e_1 is exact. The common sign and i^m factor affect neither the affine functional's direction nor absolute normalized overlaps.

## 4. Inverse-divisor normalization and K-dual angle

Define the upper triangular divisor matrix with row d and column a by

    R_(d,a)=sqrt(phi(d)/a) 1_(d|a).

Then K=R*R and the inverse has row a and column d

    (R^(-1))_(a,d)=sqrt(a/phi(d)) mu(d/a) 1_(a|d).

Multiplication checks the identity: the inner divisor sum is sum_(r|d/a)mu(r), so it is one only on the diagonal. The placement of a and phi(d) in the square root is essential and is correct in the audited note.

Since K^(-1)=R^(-1)(R^(-1))*, its three relevant entries are exactly

    (K^(-1))_(N,N)=N/phi(N),
    (K^(-1))_(1,N)=sqrt(N)mu(N)/phi(N),
    (K^(-1))_(1,1)=sum_(d<=N)mu(d)^2/phi(d).

The last sum is at least one from d=1. For functionals represented as z*c, the energy-normalized minimizing direction is K^(-1)z/sqrt(z*K^(-1)z). Here l is real, so its use agrees with the unstarred linear expression in (1), up to the common scalar already recorded. It follows that

    |<v_(e_1),v_(e_N)>_K|^2
       =mu(N)^2/[phi(N)(K^(-1))_(1,1)].

There is no missing N or phi(N) factor. Non-squarefree N gives exact orthogonality. Also phi(N)>=sqrt(N/2): in the product phi(N)^2/N, every odd-prime factor is at least one, and the smallest possible 2-factor is 1/2. Thus the overlap tends to zero for every sequence N->infinity.

For the crude inverse norm,

    ||K^(-1)|| <= ||R^(-1)||_F^2
      =sum_(d<=N)sum_(a|d) a mu(d/a)^2/phi(d)
      <=sum_(d<=N)sum_(a|d)a
      <=sum_(d<=N)d(1+log d)
      <=C N^2 log(N+2).

Taking the square root and multiplying the Euclidean constraint error N^(17/2) gives N^(19/2)sqrt(log(N+2)), exactly as claimed. Since ||e_1||_(K^(-1))>=1, this is a relative dual-norm bound. Normalization is locally Lipschitz, and for eta<=1/2 the normalized directions differ by at most C eta in K norm. Cauchy-Schwarz then gives (7).

The phrase “monic selected direction” here means selection inside the polynomial image while granting the stated pullback metric K. The full degree-at-most-m monic problem has many more lower-degree variations when m+1>N. Identifying that full affine space with the image is a further missing ingredient, already expressly listed in Section 5. An exact pullback Gram on the image would not supply that ingredient or change l into e_N.

## 5. Recentring and exact carrier response

For fixed N and gamma, exponential-in-m leading magnitude is governed by |tanh(log a-gamma)|, equivalently |log a-gamma|. The largest value occurs at one of the two endpoints. Their squared-distance difference is

    (log N-gamma)^2-gamma^2
       =log N (log N-2gamma).

For N>=2 the last endpoint dominates exactly when gamma<(log N)/2. At equality the first and last magnitudes tie, including their equal sech prefactors. Strict dominance is a fixed-N, m->infinity statement; no uniform dominance rate for gamma approaching the midpoint is claimed or needed.

For the fully K-selected endpoint c, Kc=A_0 e_N with A_0=phi(N)/N. Since (D_N c)_N=0,

    <c,D_N c>_K=0.

Writing D_gamma=D_N+c_gamma I therefore gives

    K[D_gamma c]=K[D_N c]+c_gamma^2 K[c]
                =A_0(R_N+c_gamma^2).

The mixed term vanishes by complete endpoint selection, not a sign estimate or scalar averaging. The frozen endpoint note correctly proves

    R_N=sum_(p|N)(log p)^2/(p-1)
       <=C[log log(N+3)]^2.

It retains every prime-power quotient; the p-1 denominator is its full sum.

## 6. Full reselection in the positive-sum model

With G=alpha K+beta D_gamma K D_gamma, alpha>0 and beta>=0, let u minimize G under u_N=1. This is the unique actual minimizer of G, not assumed equal to the K minimizer c.

The vector D_gamma u has endpoint c_gamma. Homogeneity of the full K endpoint minimum gives

    J[u]=beta K[D_gamma u]>=beta c_gamma^2 A_0.

The admissible trial c gives

    G[u]<=G[c]=A_0[alpha+beta(R_N+c_gamma^2)].

All quantities are nonnegative and G[u]>0; dividing a lower numerator bound by an upper denominator bound proves (11) in the stated direction. It remains valid when beta=0 or c_gamma=0.

For alpha=(log T)^3, beta=log T, put x=c_gamma^2. The lower bound is

    x/[(log T)^2+R_N+x],

which increases in x. Every center satisfying (8) has x>(log N)^2/4. If log N/log T->theta>0, then R_N/(log T)^2->0. Substituting the threshold x=(log N)^2/4 proves exactly

    liminf J[u]/G[u]>= (theta^2/4)/(1+theta^2/4)>0.

This argument allows gamma to depend on T, including carriers larger than log N; no unspoken upper bound on c_gamma is required.

## 7. Scope and remaining gap

The note proves a concrete transfer obstruction for one natural common-degree approximation and a carrier tradeoff in explicit positive GCD models. It does not prove that a different triangular map, a controlled carrier compensation, a different selected affine subspace, or an enriched approximation cannot succeed. Absolute smallness of an added highest-degree coefficient does not imply smallness of a changed monic problem, so the stated caution about such modifications is warranted.

Nor is the GCD matrix shown to equal or relatively approximate the actual pulled-back theta source. The full source and derivative arithmetic corrections and the complete polynomial lower-degree affine space remain to be controlled. Accordingly the actual-theta upper limit h_n->0 and the adjacent-determinant upper estimate remain open. No substantive mathematical correction is required.

## 8. Addendum: full growing-space approximation in the K metric

The subsequently added equation (6a) passes. Since K is positive definite,

    ||c||_2 <=sqrt(||K^(-1)||)sqrt(K[c])
             <=C N sqrt(log(N+2))sqrt(K[c]).

Combining this with the already checked Euclidean synthesis error C N^(3/2)exp(-c m/N^2)||c||_2 gives exactly

    sqrt(X[Lc-f_c])+sqrt(H[Lc-f_c])
       <=C N^(5/2)sqrt(log(N+2))exp(-c m/N^2)sqrt(K[c]).

It is uniform on the whole N-dimensional coefficient space and tends to zero in operator norm from the K coefficient metric under m/(N^2 log N)->infinity. It compares the actual source/derivative images of the exact exponential packet and its polynomial approximation; it does not identify the exact packet's actual Gram with K. Thus this strengthened norm approximation does not alter the affine-selector obstruction or provide the missing full polynomial-degree flag. The two optional precision edits in the initial verdict, N>=2 and “image-restricted,” have now also been applied to the audited note.
