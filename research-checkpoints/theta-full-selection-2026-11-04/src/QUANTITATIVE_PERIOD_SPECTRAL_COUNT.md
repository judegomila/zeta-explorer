# Quantitative growing-period spectral count for the actual theta pair

2026-11-04. Supplement to FULL_GRAM_DETERMINANT_INVESTIGATION.md. The base proof is unchanged. This supplement strengthens its superlogarithmic lower count to an explicit order log(n) loglog(n), without an iterated-log denominator. It proves no upper bound for a selected endpoint or selected average.

## 1. The quantitative theorem

Let F be the exact fixed real multiple of Xi, let

    X[p]=||Fp′+2F′p||₂²,       H[p]=||Fp′||₂²,
    K_n=G_n^(-1/2) J_n G_n^(-1/2),

where G_n,J_n are the complete degree-at-most-n actual source and derivative Grams. Set

    N=n+2,       L=log N,       ell=log L.

Fix parameters

    0<a<b<1/2,       0<beta<2.

For all sufficiently large n there is a real polynomial subspace U_n, retaining both parities and contained in degree at most n, with

    dim U_n = [2 beta(b-a)/pi²+o(1)] L ell,             (1)
    sup_(0!=p in U_n) |H[p]/X[p]-1|
                      <= C L^(-(2-beta)).             (2)

Each parity contributes half the dimension, up to the harmless integer-rounding terms. All constants are fixed once F,a,b,beta are fixed; no unproved uniform lower bound for F or its periodization is assumed.

The full generalized spectrum therefore obeys

    lambda_(dim U_n)(K_n) >= 1-C L^(-(2-beta)).        (3)

For example, beta=1, a=1/8, b=1/4 gives

    dim U_n = [1/(4pi²)+o(1)] log(n+2) loglog(n+2),
    H[p]/X[p] = 1+O(1/log(n+2))                      (4)

uniformly on this subspace. More generally, for every fixed 0<gamma<2/pi² there are epsilon>0 and C such that, eventually,

    #{j:lambda_j(K_n)>=1-C L^(-epsilon)}
                           >= gamma L log L.         (5)

The constant 2/pi² is the supremum delivered by these parameter choices, not a claimed optimal spectral constant or matching asymptotic.

This is a soft exact-theta obstruction. It exploits the actual zeta minimum-modulus input and gamma envelope, not a uniquely theta-arithmetic diagonalization. The complete forms and all arithmetic cross terms remain unchanged throughout.

## 2. Why the audited local minimum-modulus lemma improves the proposed product route

The source

    /workspace/shared/theta_pollaczek_trial_20261104/
        ACTUAL_THETA_SUBEXPONENTIAL_REFERENCE_COMPARISON.md

proves in Section 2 the following uniform statement, with its proof independently checked in TWO_SIDED_COMPARISON_AUDIT.md. Put f(s)=(s-1)zeta(s). Around 2+ik, use radii

    15/8 > 7/4 > 5/3.

There are at most C log(|k|+3) zeros of f in the closed middle disk, counted with multiplicity. If |x-k|<=1/2 and the critical-line point 1/2+ix is at complex distance at least delta from each of these zeros, 0<delta<1, then

    |zeta(1/2+ix)|
        >= exp[-C log(|k|+3)(1+log(1/delta))].         (6)

The same statement holds for negative k by conjugation. The disk count comes from Jensen's formula, the polynomial Euler-summation upper bound on the larger disk, and the Euler-product lower bound at its center. Factoring the middle-disk zeros and applying Harnack to the logarithm of the remaining zero-free factor proves (6). This argument counts nearby nonreal zeros as well as real ones; RH and simplicity are not assumed.

For completeness, the geometry is |(1/2+ix)-(2+ik)|<=sqrt(5/2)<5/3. Dividing the local lower bound for f by |s-1| costs only O(log(|k|+3)) in its logarithm, already included in (6).

Thus a polynomially small delta on |x|<=R+1 costs only exp[-C log²(R+3)] for zeta. The gamma envelope then costs exp[-pi(R+1)/2] for |F|². A global canonical-product estimate exp[-C Rlog R] or exp[-C Rlog²R] is valid but unnecessarily weak for this step.

## 3. Quantitative period selection using a finite list of all relevant zeros

Fix R>=2. For every integer k with |k|<=ceil(R+2), list the zeros of f in the disk D(2+ik,7/4), with multiplicity. Let Gamma_R be the list of their imaginary parts, allowing repetitions from overlapping disks. By the local Jensen count,

    M_R:=#Gamma_R <= C_0 (R+3)log(R+3).                (7)

Every point x in [-R-1,R+1] has a nearest integer k in this range; consequently its entire local zero list required by (6) is included in Gamma_R. The list is not restricted to critical-line zeros. The variable x here is the real Fourier variable of F, hence the corresponding zero coordinate is Im(s), as required.

Choose a sufficiently small fixed c_0>0 and set

    delta_R = c_0/[(R+3)² log²(R+3)].                 (8)

Exclude from [R,R+1] the closed intervals of radius 2delta_R centered at every ordered difference gamma-gamma′, with gamma,gamma′ in Gamma_R. Their total length is at most

    4delta_R M_R² <= 4 c_0 C_0².

Choose c_0 so this is less than 1/2. The remaining set has positive measure, so choose T_R there. Then

    R<=T_R<=R+1,
    |T_R-(gamma-gamma′)|>2delta_R
                                 for all listed pairs. (9)

For any t in [0,T_R], both t and t-T_R lie in [-R-1,R+1]. They cannot both be within delta_R of Gamma_R, since subtraction would violate (9). Hence at least one of these two points, call it x, satisfies

    dist(x,Gamma_R)>=delta_R.

Ordinate separation implies the complex separation in (6). Since log(1/delta_R)=O(log(R+3)), (6) yields

    |zeta(1/2+ix)| >= exp[-C log²(R+3)].               (10)

The actual uniform gamma envelope is

    |F(x)|² >= c(1+|x|)^(7/2) exp(-pi|x|/2)
                                  |zeta(1/2+ix)|².

The fixed normalization constant is harmless. Because |x|<=R+1, (10) proves

    |F(x)|² >= exp[-pi(R+1)/2-C log²(R+3)].            (11)

Define the exact periodized weight

    W_T(t)=sum_(j integer) F(t+jT)².

It contains both terms F(t)² and F(t-T)². Equations (9)-(11) therefore establish, uniformly over the entire period,

    m_(T_R):=min_[0,T_R] W_(T_R)
          >= exp[-pi(R+1)/2-C log²(R+3)].              (12)

This proves the needed varying-period lower bound. It does not assume that real or nonreal zeros are separated, does not remove any zero from the form, and does not replace the actual weight by its average. The two alternatives t and t-T are essential to obtaining a bound at every point of the period.

## 4. Uniform control of the signed periodized potential

As in the base note, the exact integration-by-parts identity is

    X[p]=H[p]+integral_R V|p|²,
    V=2(F′²-FF″).

The actual fixed-order derivative bounds give |V(x)|<=C exp(-c|x|), after absorbing fixed polynomial factors into a smaller positive exponent. Consequently

    V_T(t)=sum_(j integer) V(t+jT),
    sup_(T>=1) ||V_T||_(L∞[0,T]) <= C_V.              (13)

For an explicit proof, reduce t modulo T into [-T/2,T/2]. The central summand is bounded by ||V||∞; the remaining distances are at least (|j|-1/2)T, and the resulting geometric tail is uniformly summable for T>=1. V_T remains signed. No positive-potential assumption is made.

## 5. Choose the growing period and construct the trigonometric subspaces

For the fixed beta in Section 1 set

    R_n=(2/pi)[beta ell-sqrt(ell)].                    (14)

This is >=2 for sufficiently large n. Apply Section 3 to R=R_n and choose T_n in [R_n,R_n+1]. Then (12) gives

    log m_(T_n)
       >= -beta ell+sqrt(ell)-pi/2-C log²(R_n+3)
       >= -beta ell

eventually, because log(R_n+3)=O(log ell) and sqrt(ell)/(log ell)² tends to infinity. Therefore

    m_(T_n) >= L^(-beta).                             (15)

This is the only place the explicit subleading subtraction sqrt(ell) in (14) is used. It absorbs the proved local minimum-modulus loss without any uniform-in-T assumption.

Put omega_n=2pi/T_n and include integer frequencies m omega_n in [aL,bL]. Each real cosine or sine space has dimension

    d_n = T_n(b-a)L/(2pi)+O(1).

Together their dimension is

    D_n=2d_n=T_n(b-a)L/pi+O(1)
       =[2beta(b-a)/pi²]L ell+O(L sqrt(ell)),          (16)

where the implicit constant is fixed. For any combination u of these modes, exact periodic integration and ordinary unweighted trigonometric orthogonality give

    H[u]=integral_0^(T_n) W_(T_n)|u′|²
         >= m_(T_n) a²L² integral_0^(T_n)|u|²,
    |X[u]-H[u]|
         <= C_V integral_0^(T_n)|u|².

Using (15),

    |X[u]-H[u]|/H[u] <= C L^(beta-2).                (17)

For large n this is less than 1/2. In terms of the real sine/cosine coefficient vector c,

    integral_0^(T_n)|u|²=(T_n/2)||c||₂²,
    sqrt(X[u]) >= c_a sqrt(m_(T_n) T_n) L||c||₂.      (18)

All cross terms with the exact W_(T_n) and V_(T_n) remain present. Only their proved uniform bounds and the ordinary unweighted Fourier basis are used in these inequalities.

## 6. Uniform polynomial approximation when the period varies

The base note gives the exact parameter-4 Pollaczek expansion

    exp(i xi t)=(cosh xi)^(-8)
                       sum_(j>=0) Q_j(t)(i tanh xi)^j,
    sqrt(X[Q_j])+sqrt(H[Q_j])<=C(j+1)^(7/2).

Let E_(n,xi) be its degree-n truncation. For 0<=xi<=bL put r=tanh xi and delta=1-r. Then

    delta >= N^(-2b),
    (cosh xi)^(-8)=(1-r²)^4<=16delta^4.

By summing the exact source/derivative norm tails,

    sqrt(X[E_(n,xi)-exp(i xi t)])
       +sqrt(H[E_(n,xi)-exp(i xi t)])
       <= Cdelta^4 sum_(j>n)(j+1)^(7/2)exp(-delta j)
       <= Cdelta^(-1/2)exp(-delta n/2)
       <= C N^b exp[-c N^(1-2b)] =: e_n.              (19)

Here b<1/2 is fixed, so the last bound decays faster than every inverse power of N. The identity and its derivative converge in the actual norms, as checked in the base note. Real and imaginary parts preserve parity and approximate the corresponding cosine and sine modes.

Replacing each of the D_n modes by its appropriate polynomial truncation gives a linear map u -> p_n(u), with

    sqrt(X[p_n(u)-u])+sqrt(H[p_n(u)-u])
                 <= sqrt(D_n)e_n||c||₂.              (20)

By (16), D_n<=C T_n L. Dividing (20) by (18), the relative source error is at most

    C e_n/sqrt(m_(T_n)L)
                 <= C e_n L^((beta-1)/2).            (21)

Thus the T_n factor cancels; the moving period does not cause an uncontrolled approximation constant. The right side is exponentially smaller than the error in (17). The reverse triangle inequality proves injectivity for sufficiently large n, and triangle inequalities in the X and H norms transfer (17) to the polynomial image. This proves (1)-(2), with separate parity images and their direct sum. No selection coefficients have been truncated.

## 7. Full-Gram and exterior consequences

The min-max argument from the base note applies to this exact polynomial image and proves (3). For any 0<gamma<2/pi² one can choose beta<2 and 0<a<b<1/2 with

    gamma < 2beta(b-a)/pi².

Then set epsilon=2-beta>0 and absorb the lower-order dimension term in (16), proving (5). The assertion concerns at least this many full eigenvalues above the threshold, not a two-sided spectral cluster.

Let alpha_n=1-C L^(-(2-beta))>0. For all s>=0 and every 0<=r<=D_n,

    det(G_n+sJ_n)/det(G_n) >= (1+s alpha_n)^D_n,
    tr(wedge^r K_n) >= binom(D_n,r) alpha_n^r.         (22)

For each fixed s>0 this gives the explicit growth lower bound

    log[det(G_n+sJ_n)/det(G_n)]
         >= [2beta(b-a)/pi²+o(1)] log(1+s)L log L.    (23)

In particular, for every 0<gamma<2/pi², the liminf of the left side divided by L log L is at least gamma log(1+s). Taking the supremum of these fixed-parameter conclusions gives the valid one-sided statement

    liminf_n log[det(G_n+sJ_n)/det(G_n)]/(L log L)
                                      >= (2/pi²)log(1+s). (24)

No upper bound or matching constant is asserted. A rank-o(L log L) approximation of K_n with uniformly subunit operator-norm error is impossible, by the same singular-value argument as the base note.

The exact finite-arithmetic relative-form transfer also applies unchanged: if |X_M-X|<=delta_n X and |H_M-H|<=delta_n X, then every constructed polynomial obeys

    H_M[p]/X_M[p] >= (alpha_n-delta_n)/(1+delta_n).

For the audited cutoff M=ceil(K sqrt(N log N)), delta_n=exp(-A N log N) is negligible here. Every arithmetic ordered-pair term remains in the finite model.

## 8. Scope, remaining upper gap, and provenance

The result supplies degree-effective lower spectral counting and an explicit exterior-volume obstruction, not a selected endpoint estimate. D_n is still o(n). Hence it does not refute h_n->0, a density-one version, or sublinear total log determinant growth. It also does not improve the already stronger actual-theta lower bound on tr K_n obtained by summing the all-degree h_n lower bound. Its new content is a quantitatively large family of generalized directions bounded close to one from below.

The full adjacent-determinant upper estimate a_n(s_n)=1+o(s_n), s_n=N^(-2)L^(-7/4), remains unproved. No RH, positive signed potential, scalar arithmetic averaging, or inverse-column localization is assumed.

The base proof received a separate analytical audit, returned as a mathematical report rather than a separate file. That check supplied the sharper tail prefactor used in (19). A separate audit of this quantitative extension checked the finite zero-list coverage, closed-interval period avoidance, squared gamma decay exponent, growing-period lower bound, uniform potential and approximation constants, dimension coefficient, and min-max direction, and found no gap. These are AI-assisted analytical checks, not external peer review or machine proof.

Only this new working supplement is written. Earlier frozen packages, the base proof, and all 4CT work are unchanged. This is AI-assisted analytical work, not external peer review or machine formalization.
