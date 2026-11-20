# Large-anchor mixed positivity and a uniform spatial-origin collar

Research continuation, 11 November 2026. The two mixed source signs from
PR #54 are proved here for all sufficiently large anchors on each fixed
compact spatial interval, uniformly down to the symmetry point. Combining
this with the all-anchor origin certificate gives a single positive
spatial collar on which both signs hold for every positive anchor.

The thresholds in this note are existential, not computed numerical
cutoffs. Neither the full positive quadrant nor six-node positivity is
claimed.

## 1. Definitions and fixed inputs

Use the actual theta pair `(C,kappa)` and the first canceled numerator
`n_a` of PR #54, fixed at commit
`7556c563be6845444d33b187d1ab8dc984664795`. Put

$$
p=p(a)=L(a),\quad N=n_a/\kappa,\quad H=C/\kappa,
\quad B=4C''/\kappa,\quad J=4\kappa''/\kappa,
\quad P=16C^{(4)}/\kappa,\quad Q=16\kappa^{(4)}/\kappa.
$$

The desired positive functions and their mixed determinants are

$$
f_H=(H''/H')N_t-N_{tt},\qquad
f_P=N_{tt}-(B''/B')N_t,
\qquad D_j=f_j(f_j)_{at}-(f_j)_a(f_j)_t.
\tag{1}
$$

All primes on the original ratios in (1) denote spatial derivatives.
PR #54 proves that `D_H,D_P>0` at every positive `(a,t)` is exactly
the next two-anchor source gate, including coalescent anchors.

The following fixed actual-theta inputs are used:

- `H'<0,B'>0` for positive `t`, and their nonzero normalized origin
  slopes, from the original comparison theorem.
- The global original-source signs
  `W_H,0=W_3(B',J',-H')>0` and `W_P,0=W_3(B',J',P')>0`, with strictly
  positive `t^6`-normalized origin limits, from PR #52 at commit
  `a24e261deae84bf2a06b6c33a7fbdfe95db2b803`,
  `rigorous/theta-preservation-2026-11-10/theta_preservation_global_20261110.md`.
  In particular, that proof gives `W_H,0/(64t^6)>4.39` and
  `W_P,0/(64t^6)>850000` for `0<t<=1/8`.
- The real-anchor facts `p/a -> 0`, `ap -> infinity`, and, for large
  anchors, `p>=1`, `0<ap'<1/2`. The first two are the positive-theta
  resolvent argument in PR #52; the derivative bound is the fixed
  analytic real-axis estimate in PR #53.
- The all-anchor source-origin signs, including the strictly positive
  even-anchor endpoint deflations, from PR #54.

All derivatives of `kappa` and of `B kappa=-(t kappa)'` are globally
bounded. The theta series, its superexponential tails, and evenness
give this directly for each finite derivative order.

## 2. Main theorem

For every fixed `T>0`, the following limits hold uniformly on `0<=t<=T`,
where the quotients at zero are their continuous even limits:

$$
\boxed{
\frac{a^6D_H(a,t)}{(p-ap')t^5}
\longrightarrow
\frac{W_{H,0}(t)}{-H'(t)t^5},
\qquad
\frac{a^8D_P(a,t)}{(p+ap')t^5}
\longrightarrow
\frac{W_{P,0}(t)}{B'(t)t^5}.}
\tag{2}
$$

The errors in the two uniform limits are respectively
`O_T(1/(ap))` and `O_T(p/a)`. Both limiting functions have a strictly
positive minimum on `[0,T]`. Therefore:

> For every fixed `T>0`, there exists a finite `A_T` such that
> `D_H(a,t)>0` and `D_P(a,t)>0` for every `a>=A_T` and `0<t<=T`.

Integrating the mixed logarithmic derivatives in the anchor also gives
both desired second-pair source signs for all anchor pairs `a,c>=A_T`
and `0<t<=T`, including repeated anchors.

The next sections prove the uniform error statement; a fixed-`t`
asymptotic alone would be insufficient for this theorem.

## 3. Differentiable resolvent remainders

The exact positive Laplace resolvent is

$$
N=\frac pa\frac{\mathcal P_a*\kappa}{\kappa}
-\frac1{a^2}\frac{\mathcal P_a*(B\kappa)}{\kappa},
\qquad \mathcal P_a(s)=\frac a4e^{-a|s|/2}.
\tag{3}
$$

It satisfies

$$
\mathcal P_a*g=g+\frac4{a^2}\mathcal P_a*g'',
\quad \|\mathcal P_a\|_1=1,
\quad \|\partial_a\mathcal P_a\|_1=
\frac1a\int_0^\infty|1-x|e^{-x}dx=
\frac2{ea}\le\frac2a.
\tag{4}
$$

The derivative norm in (4) is what permits differentiating the
remainder with respect to the anchor. Spatial derivative bounds alone
would not suffice for a mixed determinant.

Iterating (4) three times in the first term of (3), and twice in the
second, gives the exact identity

$$
N=\frac pa-\frac B{a^2}+\frac{pJ}{a^3}
-\frac P{a^4}+\frac{pQ}{a^5}+R,
\tag{5}
$$

$$
R=\frac{64p}{a^7}\frac{\mathcal P_a*\kappa^{(6)}}{\kappa}
-\frac{16}{a^6}\frac{\mathcal P_a*(B\kappa)^{(4)}}{\kappa}.
\tag{6}
$$

On any fixed `[-T,T]`, division by the positive `kappa` is bounded in
the required finite derivative norms. Equations (4)--(6), together with
`p'=O(1/a)`, give

$$
\|R\|_{C^6}\le C_T(p/a^7+a^{-6}),\qquad
\|R_a\|_{C^6}\le C_T(p/a^8+a^{-7}).
\tag{7}
$$

Here the constants depend only on `T` and finitely many actual theta
derivative bounds. The remainders are even functions, and (7) controls
their actual derivatives jointly. No independent entrywise error is
differentiated.

## 4. Even-variable normalization and the exact leading factors

Write `u=t^2`, and regard the original ratios and `N` as functions of
`u`. An even `C^6([-T,T])` function maps boundedly to `C^3([0,T^2])`
under this substitution. For example

$$
\partial_u g(\sqrt u)=\frac12\int_0^1g''(s\sqrt u)ds;
$$

iteration gives the higher derivative bounds. This removes the apparent
singularities of `H''/H'` and `B''/B'` at zero.

Define the fixed second-order operators

$$
\mathcal T_Hg=4\{(H_{uu}/H_u)g_u-g_{uu}\},\qquad
\mathcal T_Pg=4\{g_{uu}-(B_{uu}/B_u)g_u\}.
\tag{8}
$$

The nonzero origin slopes and the strict spatial signs imply that
`H_u,B_u` have no zero on `[0,T^2]`. Thus these operators map the
even `C^6` bounds in (7) to `C^1` bounds in `u`. Put

$$
\Phi_j=f_j/t^2=\mathcal T_jN,
\quad U_H=-\mathcal T_HB,\quad V_H=\mathcal T_HJ,
\quad U_P=\mathcal T_PJ,\quad V_P=-\mathcal T_PP.
$$

The cancellations `T_H(1)=T_P(1)=T_P(B)=0` give

$$
a^2\Phi_H=U_H+\frac pa V_H+E_H,
\qquad
\frac{a^3}{p}\Phi_P=U_P+\frac1{ap}V_P+E_P,
\tag{9}
$$

where, for sufficiently large `a`,

$$
\|E_j\|_{C^1(u)}\le C_Ta^{-2},\qquad
\|(E_j)_a\|_{C^1(u)}\le C_Ta^{-3}.
\tag{10}
$$

For the H remainder, use the terms `-T_HP/a^2+p T_HQ/a^3+a^2T_HR`
and eventually `p<=a`. For the P remainder, use
`T_PQ/a^2+(a^3/p)T_PR`, together with `p>=1` and `ap'<1/2`.
These give (10) directly, including all anchor derivatives.

Let `W_u` denote the ordinary two-column Wronskian in `u`, and let

$$
\mathcal W_H=W_{3,u}(B_u,J_u,-H_u),\qquad
\mathcal W_P=W_{3,u}(B_u,J_u,P_u).
$$

The second-order Sylvester identity gives the exact factors

$$
\boxed{
W_u(U_H,V_H)=\frac{16\mathcal W_H}{H_u}<0,
\qquad
W_u(U_P,V_P)=-\frac{16\mathcal W_P}{B_u}<0.}
\tag{11}
$$

The spatial Wronskian conversion is
`W_H,0=64t^6 mathcal W_H` and `W_P,0=64t^6 mathcal W_P`.
Also `H'=2tH_u,B'=2tB_u`. These factors are essential to the precise
limits in (2).

## 5. Uniform control of the mixed determinants

For any fixed functions `U,V` and an anchor-dependent scalar `r`, write
`F=U+rV+E`. Then the exact identity

$$
\begin{aligned}
W_u(F,F_a)={}&r'W_u(U,V)+W_u(U,E_a)
+rW_u(V,E_a)\\
&-r'W_u(V,E)+W_u(E,E_a)
\end{aligned}
\tag{12}
$$

separates the leading determinant from every remainder term. Wronskians
in (12) are bounded bilinear maps of two `C^1` functions.

For H, `r=p/a` and

$$
r'=-(p-ap')/a^2,\qquad |r'|\ge p/(2a^2)
$$

eventually. Both `r` and `r'` are bounded, and (10) makes the error in
(12) `O_T(a^{-3})`. Dividing by `|r'|` gives `O_T(1/(ap))`.

For P, `r=1/(ap)` and

$$
r'=-(p+ap')/(a^2p^2),\qquad |r'|\ge1/(a^2p).
$$

Again the error in (12) is `O_T(a^{-3})`; after division by `|r'|`
it is `O_T(p/a)`.

Multiplying a function by an anchor-only scalar multiplies its mixed
determinant by the square of that scalar. The spatial normalization is

$$
D_j=2t^5W_u(\Phi_j,\partial_a\Phi_j).
\tag{13}
$$

Substitute (9)--(12) into (13), use (11), and convert back to `t`.
This gives exactly (2), with the asserted uniform error bounds.
The limiting functions are positive for `t>0`; their origin limits
are positive because the fixed original sources have positive
`t^6` limits while `-H'/t` and `B'/t` have positive limits. Compactness
therefore gives the strictly positive minimum needed for `A_T`.

## 6. Corollary: one spatial collar works for all positive anchors

There exists a single `delta>0` such that

$$
\boxed{D_H(a,t)>0,\qquad D_P(a,t)>0
\quad\text{for every }a>0,\ 0<t\le\delta.}
\tag{14}
$$

Consequently both desired second-pair source signs hold for every
positive anchor pair, including equal anchors, throughout that same
spatial collar.

To prove this, choose any fixed `T_0>0`, for example `T_0=1/8`.
The theorem supplies a finite `A` for all `a>=A,0<t<=T_0`. It remains
to control the compact anchor segment down to zero.

Set `v=a^2`. The canceled numerator is analytic in `(v,u)` near each
point with nonnegative finite `v,u`. One way to see this is to use its
even analytic origin value. Explicitly, let

$$
E(a)=\int_0^\infty\cosh(as/2)\kappa(s)ds,\qquad
O(a)=\int_0^\infty\sinh(as/2)\kappa(s)ds.
$$

Then `p=E'/E` and

$$
n_a(0)=\frac12\{O'(a)-p(a)O(a)\}.
$$

Here `E` is even and strictly positive on the real axis, `O` is odd,
and both are entire. The displayed origin value is therefore even and
locally analytic at every nonnegative real anchor. Its spatial ODE is

$$
4n_a''=a^2n_a-(1+ap)\kappa-t\kappa',\qquad n_a'(0)=0.
$$

The coefficients and `ap` are analytic in `v` on the nonnegative real
axis. At `a=0` the initial data and ODE give `n_0=C`, hence `N(0,t)=H(t)`.
Since `T_HH=0`, `Phi_H` has an exact common factor `v` for all `u`
near the compact segment. Thus the functions

$$
\Psi_H(v,u)=\Phi_H(v,u)/v,\qquad
\Psi_P(v,u)=\Phi_P(v,u)
$$

extend analytically through `v=0`. Put

$$
\Delta_j=\Psi_j(\Psi_j)_{vu}-(\Psi_j)_v(\Psi_j)_u.
$$

The PR #54 source-origin certificates give `Delta_H(v,0)>0` and
`Delta_P(v,0)>0` for every finite `v>=0`. In its notation these are
`Omega_H/v^2` and `Omega_P`. At `v=0` strictness is part of the
compact certificate: it gives respectively the conservative lower
bounds `1.49e-19` and `1.37e-12` for `a<=100`, including the endpoint.
The infinite-anchor origin theorem supplies the remaining finite
anchors when `A>100`.

Continuity and compactness on `0<=v<=A^2` now give `eta>0` such that
both `Delta_j` are positive for `0<=u<=eta` throughout this entire
anchor segment. The exact endpoint factors are

$$
D_H=4a^5t^5\Delta_H(a^2,t^2),\qquad
D_P=4at^5\Delta_P(a^2,t^2).
\tag{15}
$$

Choose `delta=min(T_0,sqrt(eta))` and combine the compact segment with
the large-anchor theorem. This proves (14) with one spatial width for
all positive anchors. No tiny-anchor or tiny-spatial numerical sample
is substituted for either limiting argument.

## 7. Scope and reproduction

The result closes the large-anchor boundary on each fixed spatial
compact interval and strengthens the individual origin limits to a
uniform all-anchor spatial collar. It does not supply numerical values
for `A_T` or `delta`, and it does not control joint escape
`a,t -> infinity`. These boundary estimates alone do not prove the
global mixed inequalities. In this checkpoint the separate scalar-source
certificates and oriented compensation theorem close those inequalities
and imply third full preservation and six-node positivity; see
`theta_third_preservation_global_20261111.md` for that global proof.

Run `python theta_mixed_anchor_tail_20261111.py` to replay the exact
factor and normalization checks. The accompanying code does not read
diagnostic samples. Positivity inputs are the explicitly cited fixed
theta theorems; the new unbounded-anchor limits and the collar are
analytic consequences proved above.
