# Constructive actual-spatial residue rate via shifted Laguerre polynomials

2026-11-03. New analytic strengthening of audited v4; independent review pending. No target positivity or fixed-parity claim. No numerical rungs added.

Use v4 notation Ψ_A, F_A=Ψ_A−ℓ(A)χ and actual half-line norm ||·||_t²=∫h e^(2th)|·|²dh. The audited uniform bound is

||Ψ_A||_t² <=33||A||_σ²,
||A||_σ²=∫_π∞ z^5e^(−z)|A(z)|²dz, |t|<=1/2.            (1)

## 1. An explicit polynomial sequence

Take A_N(z)=L_N^(5)(z−π), N>=4, where L denotes the standard generalized Laguerre polynomial. Its degree is exactly N, so F_A_N lies in the actual FULL derivative filtration through N.

The Laguerre generating function and the elementary gamma Laplace transform give the exact formal power series

Σ_(N>=0) ℓ(A_N)s^N
 =−3s(1−s)^(−9/2)exp[πs/(1−s)].                         (2)

Indeed E[e^(−sZ/(1−s))]=(1−s)^(3/2), while
E[(2Z−3)e^(−sZ/(1−s))]=−3s(1−s)^(3/2).
Multiplication by (1−s)^−6 exp[πs/(1−s)] proves (2). The interchange can be justified for sufficiently small |s| by gamma exponential integrability; alternatively each coefficient is a finite polynomial moment identity.

All coefficients following the minus sign in (2) are positive. Put m=floor(sqrt(N))>=2. Selecting just the j=m term of the exponential expansion and the constant term of (1−s)^−9/2 gives

|ℓ(A_N)| >=3π^m/m! · binom(N−2,m−1) >= π^m/m.           (3)

For the last inequality use N>=m²,
binom(N−2,m−1)>=(N−m)^(m−1)/(m−1)!,
m!<=m^m, (m−1)!<=m^(m−1), and
(1−1/m)^(m−1)>=1/3 (equivalently (1+1/(m−1))^(m−1)<=e<3).

## 2. A polynomial upper bound for the actual raw norm

Write x=z−π and f(x)=L_N^(5)(x). The exact connection formula is

f(x)=Σ_(k=0)^N binom(N−k+4,4)L_k^(0)(x).

The L_k^(0) are orthonormal in L²([0,∞),e^−x dx), so

||f||_0²=Σ binom(N−k+4,4)² <=(N+5)^9.                  (4)

For any polynomial g of degree at most d, the recurrence

xL_k^(0)=(2k+1)L_k^(0)−(k+1)L_(k+1)^(0)−kL_(k−1)^(0)

and its finite matrix row/column sums give ||xg||_0<=(4d+2)||g||_0. Thus ||(1+x)g||_0<=(4d+3)||g||_0. Applying this three times to f yields

||(1+x)^3 f||_0 <=[4(N+5)]^3 ||f||_0.

Since π<4, (x+π)^5<=4^5(1+x)^6, and e^−π<1, equations (4) and this bound imply

||A_N||_σ²=e^−π∫(x+π)^5e^−x f(x)²dx
 <=4^11(N+5)^15.                                       (5)

Combining (1), (3), and (5),

||Ψ_A_N||_t²/|ℓ(A_N)|²
 <=33·4^11·m²(N+5)^15/π^(2m),   m=floor√N.              (6)

This explicit bound tends to zero. Constants are deliberately conservative; no asymptotic numerical fit is used.

## 3. Quantitative Christoffel conditioning consequence

Let c_N(t)=dist_t(χ,span{ψ,ψ',...,ψ^(N)})² be the actual positive-parent conditional residue variance. Since

χ+F_A_N/ℓ(A_N)=Ψ_A_N/ℓ(A_N),

we obtain the explicit uniform estimate

0<c_N(t)<=33·4^11·m²(N+5)^15/π^(2m),  |t|<=1/2.         (7)

In particular

c_N(t)=O(N^16 exp[−2(logπ)√N])

uniformly on the stated shift interval. This is an upper bound on the vanishing conditioning floor, NOT an upper bound on the unpaid target coupling cost.

In the exact actual Christoffel recurrence from v4,

1/c_N=1/||χ||_t²+Σ_(j<=N) λ_j²/ν_j,

equation (7) supplies the quantitative lower bound

Σ_(j<=N) λ_j²/ν_j
 >= π^(2m)/[33·4^11·m²(N+5)^15]−1/||χ||_t².             (8)

For small N this bound may be negative and uninformative; its content is rigorous growing-degree divergence. It rules out a uniform positive residue-conditioning floor or a degree-independent raw-spatial payment for the residue.

## 4. Scope and unresolved target comparison

The witnesses A_N are general degree-N polynomials. They are not asserted to lie in the special A_(2j) or A_(2j+1) subspaces corresponding to one differential parity. Consequently (7)–(8) concern the FULL derivative filtration only. The target remains the parity-preserving signed Schur problem, whose actual lower-target pivots are not c_N.

The outstanding all-degree regression-action inequality still requires control of the relative forcing innovations η_(n,k)/sqrt(s_k) in the actual target metric, or equivalently the opposite-parity conditional forcing identified in v4. The constructive rate explains why throwing away or uniformly bounding the residue channel cannot supply that control; it does not disprove RH or prove failure of a properly compensated bridge.

## Standard polynomial identities checked against primary reference

Laguerre generating function: NIST DLMF §18.12.13, https://dlmf.nist.gov/18.12.E13 . Connection formula: DLMF §18.18.18, https://dlmf.nist.gov/18.18.E18 . Orthogonality/normalization and three-term recurrence: DLMF §§18.3 and18.9, https://dlmf.nist.gov/18.3 and https://dlmf.nist.gov/18.9 . The theta norm estimate and all inequalities (2)–(8) are derived above; the references do not assert the theta conclusions.
