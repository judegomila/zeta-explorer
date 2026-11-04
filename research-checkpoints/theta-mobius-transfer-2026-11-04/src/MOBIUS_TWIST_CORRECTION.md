# Möbius selection survives the full twisted arithmetic correction on a short growing Dirichlet space

2026-11-04. Analytic working note. All arithmetic cross terms and the complete changed endpoint selector are retained. This is **not** a theorem about the polynomial-degree selector of the exact theta problem.

## Results and scope

There are three increasingly concrete positive results.

1. For the ordinary corrected kernel

       M_L(a,b)=K(a,b)[L−log(ab/gcd(a,b)^2)],
       K(a,b)=gcd(a,b)/sqrt(ab),       1<=a,b<=N,

   one has M_L >= (L−log N−C)K. Its complete endpoint selector has an exact Schur-complement description. The bare Möbius vector incurs a positive diagonal correction 2 sum_(p|N) log p/(p−1), and its older-coordinate residual has squared K-dual size exactly

       R_N=sum_(p|N)(log p)^2/(p−1).

   For log N <= theta L with fixed theta<1, full reselection preserves an O_theta((1+log log(N+3))^2) centered-frequency derivative response.

2. The actual smoothly weighted ordinary zeta moment has the same conclusion, with its own fully changed endpoint selector, for N<=T^theta, any fixed theta<17/53. The loss from the published bounded-coefficient error to a K-relative operator error is at most C N log(2N), derived explicitly below.

3. A more conservative but actual derivative/source result holds. Fix a nonzero nonnegative smooth w compactly supported in (1,2), normalized by integral w=1. Put

       f_c(t)=sum_(n<=N)c_n (n/N)^(-it),
       H_T[c]=(1/T) integral w(t/T) Z(t)^2 |f_c'(t)|^2 dt,
       X_T[c]=(1/T) integral w(t/T)|Z(t)f_c'(t)+2Z'(t)f_c(t)|^2 dt.

   For N<=T^(1/100), sufficiently large T, let c_X minimize X_T on the **entire** affine space c_N=1. Then

       H_T[c_X]/X_T[c_X]
          <= C_w (1+log log(N+3))^2/(log T)^2.              (A)

   The exponent 1/100 is explicit, intentionally conservative, and not optimized. This statement uses the exact Hardy function, the full cubic arithmetic correction, a uniform shifted-moment theorem, and complete reselection. It is not merely a definition of a leading matrix model.

The boundary remains essential: X_T above selects among integer Dirichlet frequencies n<=N with one endpoint coefficient fixed. Section 9 also proves a compactly supported, nonpolynomial packet version for the exact theta forms with the gamma envelope retained. Neither selector fixes an algebraic-polynomial leading coefficient or identifies with P_n. No actual-theta polynomial upper bound follows without those additional steps.

## 1. Coordinates and exact first correction

Write h_N=log N and assume N>=2; N=1 is trivial. Let Q have columns

       (q_n)_a=sqrt(a/phi(n)) mu(n/a)  if a|n,
       (q_n)_a=0 otherwise.

The divisor factorization gives Q* K Q=I. Thus c=Qy has K[c]=||y||^2. Define

       A_0=phi(N)/N,
       c_0=sqrt(A_0)q_N,
       D=diag(log(a/N)).

The endpoint constraint is y_N=sqrt(A_0), and c_0 is the bare complete K selector. In Q coordinates multiplication by log a is

       Q^(-1) diag(log a) Q=diag(log n)+V,
       V_(d,n)=sqrt(phi(d)/phi(n)) Lambda_VM(n/d),  d|n,d<n,

with other entries zero. Therefore

       U:=Q^(-1) D Q=diag(log(n/N))+V,
       Ue_N=v_N,
       ||v_N||^2=R_N.                                     (1.1)

Here v_N is the last column of V with its zero last entry included. Prime-power quotients are all included; their totient weights sum exactly to 1/(p−1).

Use the analytic positive family

       K_alpha(a,b)=gcd(a,b)^(2alpha)/(ab)^alpha,
       A_alpha=product_(p|N)(1−p^(−2alpha)),
       (c_alpha)_a=(a/N)^alpha mu(N/a), a|N.

At alpha=1/2 one has c_alpha=c_0 and K_alpha c_alpha=A_alpha e_N. A prime denotes differentiation in alpha at 1/2. Since c_alpha'=Dc_0,

       K'c_0=A'_0 e_N−KDc_0,
       A'_0/A_0=2s_N,
       s_n=sum_(p|n) log p/(p−1).                          (1.2)

Thus c_0* K'c_0=2s_N A_0 is positive. But K'c_0 is not a multiple of e_N: it has the explicitly retained older-coordinate residual −KDc_0.

For every n define

       Q_alpha(a,n)=a^alpha mu(n/a)/sqrt(J_(2alpha)(n)), a|n,
       J_s(n)=n^s product_(p|n)(1−p^(−s)).

Then Q_alpha^T K_alpha Q_alpha=I. Differentiation at 1/2 yields the exact relative correction

       B_1:=Q* K'Q=2S−V−V*,       S=diag(s_n).             (1.3)

Indeed Q^(-1)Q_alpha'=V−S. This proves the claimed diagonal-prime-sum minus creation/adjoint representation without deleting any cross term.

## 2. A positivity bound with the correct logarithmic scale

Apply a weighted Schur estimate with omega_n=sqrt(phi(n))/n. The weighted row and column sums of V are

       r_d=sum_(m<=N/d,m>1) Lambda_VM(m)/m,
       t_n=sum_(m|n,m>1) [m phi(n/m)/phi(n)] Lambda_VM(m)
          =log n+s_n.                                    (2.1)

The exact last equality includes every prime power: for p^e||n its contribution is e log p+log p/(p−1).

The elementary estimate

       sum_(m<=x) Lambda_VM(m)/m <= log x+C                (2.2)

follows from log(k!)=sum_(m<=k)Lambda_VM(m)floor(k/m), Stirling's upper bound, and Chebyshev's psi(k)=O(k). Hence r_d+t_d<=log N+s_d+C.

For any y, weighted Young's inequality applied to each nonnegative entry of V gives

       |y*(V+V*)y| <= sum_d(r_d+t_d)|y_d|^2.

Combining this with (1.3),

       B_1 >= diag(s_d)−(log N+C)I >=−(log N+C)I,
       ||B_1|| <= log N+3s_max+C,                         (2.3)

where s_max=max_(n<=N)s_n. Consequently

       m K <= M_L <= M K,
       m=L−log N−C,
       M=L+log N+3s_max+C.                               (2.4)

Here and below inequalities are quadratic-form inequalities. Elementary Chebyshev partial summation and a split at max(3,log N) give

       s_max << 1+log log(N+3),
       R_N << (1+log log(N+3))^2.                         (2.5)

For later use, the simpler row/column estimates r_d<=2log N and t_n<=2log N give

       ||V||<=2log N,       ||U||<=3log N.                 (2.6)

For the first estimate in (2.6), one may directly use floor(N/m)>=N/(2m) in the factorial identity. No prime number theorem is needed.

## 3. Exact complete reselection for the ordinary corrected kernel

In Q coordinates write

       Q* M_L Q = [[H,−v],[−v*,L+2s_N]],

where H is the full (N−1)-dimensional older block and v=(v_N)_(n<N). If m>0, H>=mI. The unique constrained minimizer is

       y_L=sqrt(A_0)(H^(-1)v,1),
       min_(c_N=1) M_L[c]
          =A_0[L+2s_N−v*H^(-1)v].                        (3.1)

In particular

       0<=v*H^(-1)v<=R_N/m,
       K[c_L−c_0]<=A_0 R_N/m^2.                         (3.2)

This is genuine reselection over all N−1 older coordinates. The new vector generally is not supported only on divisors of N.

Using (1.1), (2.6), and (3.2),

       K[Dc_L]^(1/2)
          <=sqrt(A_0 R_N)(1+3log N/m).

Together with (2.4),

       M_L[Dc_L]/M_L[c_L]
          <=(M/m) R_N(1+3log N/m)^2.                    (3.3)

For log N<=theta L, theta<1 fixed, this is O_theta(R_N), with no Euclidean-error substitute. If a further positive-sum source G=alpha M_L+beta D M_L D is completely reselected, alpha>0, beta>=0, its selected derivative fraction is at most

       beta R_L/(alpha+beta R_L),
       R_L=M_L[Dc_L]/M_L[c_L].                           (3.4)

This follows by testing with the actual c_L and using complete M_L-minimality, rather than identifying the new selector with c_0 or c_L.

## 4. Convert a published absolute error to a growing K-relative error

A useful coefficient estimate is

       max_(n<=N) n|c_n|^2 <= C N log(2N) K[c].            (4.1)

Indeed c=Qy gives

       sqrt(n)c_n=n sum_(k<=N,n|k)mu(k/n)y_k/sqrt(phi(k)),

so Cauchy–Schwarz bounds its square by

       n^2 sum_(k<=N,n|k)1/phi(k) ||y||^2.

The elementary identity for sigma_(-1)(k) shows

       k/phi(k)<=zeta(2) sigma_(-1)(k)<=zeta(2)(1+log k).

It follows that the preceding factor is at most

       C n log(2N) [1+log(N/n)] <= C N log(2N).

This proves (4.1); no lower bound for a smallest Euclidean eigenvalue is assumed.

Bettin–Chandee–Radziwiłł, Theorem 1, gives the full ordinary main kernel and error O(T^(3/20+epsilon)N^(33/20)+T^(1/3+epsilon)) for uniformly bounded Dirichlet coefficients. Put a_n=sqrt(n)c_n and normalize by max|a_n|. By homogeneity and (4.1), the normalized moment matrix

       W_T[c]=(1/T) integral w(t/T)Z(t)^2|f_c(t)|^2dt

satisfies, uniformly for every c,

       W_T=M_L+E_0,
       L=log T+integral w(x)log(x/(2pi))dx+2gamma,
       |E_0[c]|<=eta_0 K[c],
       eta_0 << N log(2N)
          [T^(−17/20+epsilon)N^(33/20)+T^(−2/3+epsilon)]. (4.2)

The equality of the main kernel is exact, including the arithmetic logarithm. Thus eta_0 decays by a power of T if N<=T^theta, theta<17/53, with epsilon small enough.

For completeness, the same Schur proof works for W_T itself. In Q coordinates its older block is bounded below by m−eta_0, and its older endpoint column is −v+e, ||e||<=eta_0. Its actual selector c_W therefore obeys

       K[c_W−c_0]^(1/2)
          <=sqrt(A_0)(sqrt(R_N)+eta_0)/(m−eta_0),

and

       W_T[Dc_W]/W_T[c_W]
       <=(M+eta_0)/(m−eta_0)
          [sqrt(R_N)+3log N(sqrt(R_N)+eta_0)/(m−eta_0)]^2. (4.3)

This proves the actual ordinary-moment assertion in the stated range. The moment's test space, endpoint, and selector are all specified, so this is not a circular assumption about a desired selected vector.

## 5. The full Z' and Laguerre-core arithmetic correction

Pratt–Robles, Theorem 1.1, supplies a shifted version for general bounded coefficients, uniformly for complex shifts alpha,beta=O(1/log T). Its error is bounded by

       E_PR << T^epsilon
          [T^(3/20)N^(33/20)+N^(1/2)T^(1/2)].             (5.1)

Their main term, after our normalization, is the pair kernel

       K(a,b)e^(−alpha u−beta v) F_h(alpha+beta),
       u=log(a/g), v=log(b/g), g=gcd(a,b),
       ell=log(t/(2pi)), h=ell−u−v,
       F_h(s)=zeta(1+s)+e^(−hs)zeta(1−s).                 (5.2)

Interchanging u and v according to the convention for the twist makes no difference to the symmetric formulas below. The pole in (5.2) is removable. Use the Stieltjes convention

       zeta(1+s)=1/s+gamma−gamma_1 s+gamma_2 s^2/2+O(s^3).

Then

       F_h(0)=h+2gamma,
       F_h'(0)=−h^2/2−gamma h,
       F_h''(0)=h^3/3+gamma h^2−2gamma_1 h+2gamma_2.

Since |Z'|^2=|zeta'+theta'(t)zeta|^2 and theta'(t)=ell/2+O(T^(−2)), apply (partial_alpha+ell/2)(partial_beta+ell/2) to (5.2). With delta=u−v=log(a/b), the complete density is

       K(a,b)[P(h)−delta^2(h+2gamma)/4],
       P(h)=h^3/12+gamma h^2/2−2gamma_1h+2gamma_2.         (5.3)

All arithmetic powers of u,v, including the delta^2 term, remain.

Now use the exact identity

       L_Z=Z'^2−ZZ''=2Z'^2−(Z^2)''/2.

For a smooth window, integration by parts twice shows that the delta^2 ordinary-moment contribution cancels the last term of twice (5.3). The full Laguerre-core main kernel is therefore

       K(a,b)[h^3/6+gamma h^2−4gamma_1h+4gamma_2].         (5.4)

There are additional terms with derivatives of w(t/T), not omitted terms of polynomial size. They have K-relative operator size O_w((log T)^2/T), as detailed below.

In fixed Q coordinates, put B_j=Q* K_alpha^(j)|_(alpha=1/2) Q and B_0=I. The density (5.4) becomes exactly

       C_ell=(ell^3 I+3ell^2B_1+3ell B_2+B_3)/6
             +gamma(ell^2I+2ell B_1+B_2)
             −4gamma_1(ell I+B_1)+4gamma_2I.              (5.5)

This is the full cubic arithmetic correction. It is not the substitution of a leading scalar times K.

Cauchy's formula on shifts of radius c/log T costs O((log T)^2) for the two derivatives. Applying (4.1) first yields the K-relative error

       eta_PR << N log(2N) T^epsilon
          [T^(−17/20)N^(33/20)+T^(−1/2)N^(1/2)],
       derivative error << (log T)^2 eta_PR.             (5.6)

The delta^2 ordinary-moment error entering the Laguerre cancellation is also controlled: multiplication of a matrix entry by (log a−log b)^2 is the double commutator with D, whose relative norm is at most 4||U||^2 times the original relative norm. Thus it costs O((log T)^2), already allowed in (5.6). For factors ell(t)^j, expand [log T+log(x/(2pi))]^j and apply the theorem to the finitely many fixed smooth weights w(x)[log(x/(2pi))]^r. This avoids relying on unspoken uniform constants for T-dependent weight families. The scalar error is differentiated through the uniform holomorphic shifted formula, not through an unshifted asymptotic remainder. The range eta_PR=o(1) again contains every theta<17/53.

To justify the window errors, choose a fixed nonnegative smooth w_0 supported in (1,2), equal to a positive constant on the support of w and its derivatives. In any fixed range N<=T^theta, theta<17/53, the ordinary moments with w_0 are O(log T)K and derivative moments from (5.3) are O((log T)^3)K, using eta_PR=o(1) and log N=O(log T). Multiplication by the centered frequency has norm at most 3log N. Thus the terms from w'/T and w''/T^2 after integration by parts are bounded by C_w(log T)^2/T times K. Replacing theta' by ell/2 costs only O_w((log T)^2/T^2)K, by the same shifted-moment bounds and Cauchy–Schwarz. These errors are negligible in the ranges used below.

## 6. Explicit coercivity of the cubic correction for N<=T^(1/100)

Here are elementary, deliberately generous constants, so the positivity range is not left as an unspecified smallness condition:

       ||B_1||<=6h_N,
       ||B_2||<=148h_N^2,
       ||B_3||<=4972h_N^3.                               (6.1)

To verify them let C(z)=Q^(-1)Q_(1/2+z), and B(z)=Q* K_(1/2+z)Q. Then

       C(z)^T B(z) C(z)=I,
       C'(z)=L_op C(z)−C(z)J(z),
       L_op=diag(log n)+V,
       J(z)=diag(log n+sum_(p|n)log p/(p^(1+2z)−1)).

At z=0,

       ||L_op||<=3h_N, ||J||<=2h_N,
       ||J'||<=4h_N^2, ||J''||<=24h_N^3,
       C'=V−S.

The last two bounds follow from p/(p−1)^2<=2 and p(p+1)/(p−1)^3<=6, summing powers of log p. Consequently

       ||C'||<=3h_N,
       ||C''||<=(3+2)^2h_N^2+4h_N^2=29h_N^2,
       ||C'''||<=[(3+2)^3+3(3+2)4+24]h_N^3=209h_N^3.

Differentiate C^TBC=I successively. The resulting norm bounds are

       6,
       2(29)+4(3)(6)+2(3)^2=148,
       2(209)+6(29)(6)+6(3)(148)+6(29)(3)+6(3)^2(6)=4972.

This proves (6.1) with all conjugation/coordinate-change terms retained.

For r=h_N/ell, the leading cubic part of (5.5), relative to ell^3/6, differs from I by at most

       18r+444r^2+4972r^3.                               (6.2)

At r=0.0101 this is less than 1/4. If N<=T^(1/100), then r<=0.0101 throughout the fixed window for sufficiently large T. The gamma/Stieltjes terms in (5.5) are O((log T)^2), uniformly relative to K. Thus the integrated main matrix, and then the actual Laguerre-core matrix

       G_T[c]=(1/T) integral w(t/T)L_Z(t)|f_c(t)|^2dt,

satisfy, for sufficiently large T,

       (log T)^3 K/10 <= G_T <= (log T)^3 K/3.             (6.3)

The small shifted errors (5.6) and the window errors have been absorbed. No pointwise sign assertion about L_Z is required. This is positivity of its complete growing arithmetic quadratic form in the stated range.

## 7. Higher endpoint derivatives are small prime sums

Let

       ell_N=1+log log(N+3).

For each fixed j>=1,

       S_j(N)=sum_(p|N)(log p)^j/(p−1) <<_j ell_N^j.       (7.1)

An elementary proof splits at y=max(exp(2j),log N). Chebyshev partial summation bounds the small primes by O_j(log^j y). For larger primes, the decreasing function (log x)^(j−1)/(x−1) and sum_(p|N)log p<=log N give O_j(log^(j−1)y). This proves (7.1).

For the bare endpoint there is an exact generating identity

       ((e^(uD)c_0)^T K(e^(vD)c_0))/A_0
          =product_(p|N)[1+(1−p^(−u))(1−p^(−v))/(p−1)].   (7.2)

It follows by factoring the two choices of whether each prime is removed from N in the squarefree Möbius sum. Prime exponents in N cancel from this identity; they have not been excluded from the original divisor coordinates.

For any fixed k, differentiate (7.2) k times in each variable. Every nonconstant factor used must receive at least one derivative in each variable. The result is a finite positive sum of products of S_j with total degree 2k, bounded by (7.1). In particular

       K[D^k c_0] <= C_k A_0 ell_N^(2k).                 (7.3)

This includes k=1, where the exact answer is A_0R_N, and supplies all higher moments needed here.

Set v(z)=Q^(-1)c_(1/2+z)/sqrt(A_0) and a(z)=A_(1/2+z)/A_0. The exact selected identity gives

       B(z)v(z)=a(z)e_N,
       v^(k)(0)=U^k e_N,
       |a^(k)(0)|<<_k ell_N^k.                          (7.4)

The last bound follows by differentiating the finite product defining A_alpha and using (7.1). Hence

       B_j e_N=a^(j)(0)e_N
                −sum_(k=1)^j binom(j,k)B_(j−k)U^ke_N.

Using (6.1), (7.3), and B_0=I gives for j=1,2,3

       ||B_j e_N|| <<_j (1+log N)^(j−1)ell_N.            (7.5)

These are small selected-column bounds, not a claim that the whole cubic correction is small in operator norm. With Pi the projection onto all N−1 older coordinates, (5.5) and (7.5) imply

       ||Pi (Q*G_TQ)e_N|| <<_w (log T)^2 ell_N            (7.6)

throughout N<=T^(1/100). The leading ell^3I term has no older-column component, which is the essential cancellation.

## 8. Complete actual source selection and the vanishing derivative quotient

The exact identity for complex f is

       |Zf'+2Z'f|^2=Z^2|f'|^2+4Z'^2|f|^2
                         +2ZZ'(|f|^2)'.

After integration against w(t/T),

       X_T=H_T+2G_T+E_w,
       E_w[c]=−(2/T^2) integral w'(t/T)Z(t)Z'(t)|f_c(t)|^2dt.
                                                                    (8.1)

The coefficient of the error is consistent with the outer 1/T normalization. Cauchy–Schwarz with w_0 as above gives

       |E_w[c]| <<_w (log T)^2/T K[c].                   (8.2)

Let W_T be the actual ordinary moment. Since f_c'=−i f_(Dc),

       H_T[c]=W_T[Dc],
       Q*H_TQ=U*(Q*W_TQ)U.                              (8.3)

Ordinary moment bounds give ||Q*W_TQ||=O(log T). Since Ue_N=v_N and ||v_N||=sqrt(R_N),

       ||(Q*H_TQ)e_N||
          <=3log N O(log T)sqrt(R_N)
          << (log T)^2 ell_N.                           (8.4)

Combining (6.3), the positivity H_T>=0, and (8.1)-(8.4), the exact source matrix in Q coordinates satisfies

       c_w(log T)^3I <= Q*X_TQ <= C_w(log T)^3I,
       ||Pi(Q*X_TQ)e_N||<=C_w(log T)^2ell_N.              (8.5)

Write its full older block as A_X and its full older endpoint column as r_X. The endpoint constraint remains y_N=sqrt(A_0). Exact minimization gives

       y_X=sqrt(A_0)(−A_X^(-1)r_X,1),
       ||(y_X)_(n<N)||<=C_w sqrt(A_0)ell_N/log T.          (8.6)

No earlier selector is substituted for y_X. Every older coordinate is permitted to change.

Finally, from (1.1), (2.6), and (8.6),

       K[Dc_X]^(1/2)
          <=sqrt(A_0R_N)+3log N C_w sqrt(A_0)ell_N/log T
          <=C_w sqrt(A_0)ell_N.

Therefore

       H_T[c_X]<=C_w A_0(log T)ell_N^2,
       X_T[c_X]>=c_w A_0(log T)^3,

which proves (A). This proof controls the actual changed selection by a small residual column and a separately proved coercive arithmetic source. It does not assume the desired selected inequality.

## 9. A compactly supported exact-theta packet extension

One can include the actual gamma envelope without pretending that an unwindowed reciprocal-envelope function belongs to the global source domain. Choose the preceding window in the form w=eta^2, where eta is real, smooth, compactly supported in (1,2), and integral eta^2=1. On t>0 write the exact theta source as

       F(t)=sigma a(t)Z(t),       g(t)=a'(t)/a(t),

where a>0 and g is bounded on [T,2T] for large T. Define the smooth compactly supported packets

       p_c(t)=a(t)^(-1) eta(t/T) f_c(t),

extended by zero outside their support. They are admissible for the global Hermitian quadratic forms

       X_F[p]=integral_R |Fp'+2F'p|^2dt,
       H_F[p]=integral_R |Fp'|^2dt.

These packets need not be real, and are not algebraic polynomials. Direct differentiation gives the exact formulas

       Fp_c'=sigma[eta Zf_c'+(eta'/T−g eta)Zf_c],
       Fp_c'+2F'p_c
          =sigma[eta(Zf_c'+2Z'f_c)+(g eta+eta'/T)Zf_c].    (9.1)

Here eta and eta' are evaluated at t/T. In particular all gamma-envelope and cutoff-derivative terms are retained.

Let X_tilde[c]=X_F[p_c]/T and H_tilde[c]=H_F[p_c]/T. The added source summand in (9.1) has squared norm, after division by T, at most C_w(log T)K[c]: use boundedness of g and an auxiliary smooth ordinary-moment weight dominating eta^2 and (eta')^2. Since X_T<=C_w(log T)^3K, Cauchy–Schwarz bounds the entire source perturbation by

       |X_tilde[c]−X_T[c]|<=C_w(log T)^2K[c].             (9.2)

This is a uniform relative operator estimate, not an entrywise estimate. It preserves coercivity for large T, and adds at most O_w((log T)^2) to the older endpoint-column norm in (8.5).

Consequently the fully reselected minimizer c_tilde of X_tilde subject to c_N=1 has

       K[c_tilde−c_0]^(1/2)
           <=C_w sqrt(A_0)ell_N/log T,
       K[Dc_tilde]<=C_w A_0 ell_N^2,
       K[c_tilde]<=C_w A_0.

The first formula of (9.1) and the ordinary-moment upper bounds imply

       H_tilde[c_tilde]
           <=C_w(log T)(K[Dc_tilde]+K[c_tilde])
           <=C_w A_0(log T)ell_N^2.

Together with the retained source coercivity,

       H_F[p_(c_tilde)]/X_F[p_(c_tilde)]
           <=C_w ell_N^2/(log T)^2,       N<=T^(1/100).    (9.3)

Thus the same mechanism genuinely applies to the exact global theta forms on these compactly supported, nonpolynomial packet spaces, with their own complete changed endpoint selection. It does not establish the monic-polynomial statement. The construction uses only one positive-height window; no parity or real-polynomial conclusion is inferred.

## 10. What remains missing for the theta polynomial problem

The theorems above settle concrete growing arithmetic packet problems, including genuine zeta derivative correlations, the compactly supported gamma-envelope conversion, and full changed source selectors. It does not provide any of the following:

- A representation of the actual algebraic P_n as a Dirichlet packet with N<=T^(1/100), with selected errors controlled relative to the arithmetic source.
- A match between fixing c_N and fixing the leading algebraic-polynomial coefficient.
- Control of the compact region, exterior region, and cross-packet terms for the actual full theta polynomial selector. Section 9 handles the gamma envelope only on a deliberately compact packet space, not on that selector.
- A claimed extension of the conservative positivity range to arbitrary polynomial-size frequency sets.

In particular, polynomial Taylor approximation alone does not preserve the endpoint constraint or the complete older subspace. The actual selected determinant upper bound remains open.

## Sources and verification status

Primary sources inspected:

- S. Bettin, V. Chandee, M. Radziwiłł, *The mean square of the product of the Riemann zeta function with Dirichlet polynomials*, Theorem 1: https://www.math.mcgill.ca/radziwill/BCR.pdf . Used only for the ordinary uniform moment and its displayed error.
- K. Pratt, N. Robles, *Perturbed moments and a longer mollifier for critical zeros of zeta*, arXiv:1706.04593v3, Theorem 1.1 and the uniform Cauchy-differentiation observation in Section 5: https://arxiv.org/pdf/1706.04593 . Used for the uniform shifted moment with general coefficients. Formulas (5.3)-(5.5), the relative error conversion, and selection arguments are derived here.

Read-only input notes: `theta_full_selection_20261104/EXACT_GCD_ENDPOINT_SELECTION.md` and `ARITHMETIC_FREQUENCY_SEPARATION.md`.

The finite-dimensional identities and inequalities above are analytic derivations. No numerical sign test is used to establish an asymptotic or positivity assertion; the elementary evaluation of (6.2) merely certifies the explicit chosen constant. An independent AI-assisted audit of Sections 1–9 reported no substantive flaw, including the shifted coefficients, operator constants, complete reselection, and scope boundary. It is not externally peer reviewed or machine formalized. No frozen artifact, repository, or 4CT work was changed.
