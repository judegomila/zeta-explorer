# Natural-cutoff signed ground alignment

## 0. Scope, source lock, and exact outcome

This note puts the remaining projective ground-alignment obstruction into
one cancellation-preserving arithmetic formula and sharpens the admissible
low Fourier cutoff from a large polynomial to the natural scale

\[
 M(\lambda)=\lceil\lambda\rceil .                  \tag{0.1}
\]

There are four results.

1. The exact finite forcing and complementary ground operator are written
   in the weighted-PNT-discrepancy normal form before any inverse or
   absolute value is taken.
2. The ground projective observable has equivalent inverse, adjugate,
   odd-resolvent, cumulative-discrepancy, and ordinary-Chebyshev-error
   representations.
3. The admitted Gevrey prolate estimate, used at the formal Hermite order
   `J=floor(A0*L)`, proves a superpolynomial tail already at the Fourier
   cutoff `M=ceil(lambda)`.  Conditional on the two strict sector signs, a
   bounded exact-`u` Ritz correction, and the still-unproved signed response
   `|S_M-k_(00)|=O(lambda^(-1))`, this is sufficient for the existing
   projective locally-uniform bridge.
4. An exact growing diagonal source-Cauchy family has both strict signs,
   zero Fourier tail, residual and Ritz lowering tending to zero, but a
   fixed nonzero alignment response.  Thus none of the structural identities
   proves the missing decay.

The binding finite source remains Connes--Consani--Moscovici, *Zeta
Spectral Triples*, arXiv:2511.22755v1, vendored as
`vendor/CCM-ZST-2511.22755v1.pdf`, SHA-256
`c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b`.
The finite matrix is always assembled from the complete pole minus
archimedean minus prime formula.  In particular, the minus sign on the prime
block in source equation (3.19) is retained, and every prime power
`1<n<=lambda^2`, including a possible endpoint, is inventoried.

The locked interval, measure, extension, transform, modes, and inversion are

\[
 L=2\log\lambda,\qquad I_\lambda=[-L/2,L/2],       \tag{0.2}
\]

\[
 \widehat f(z)=\int_{I_\lambda}f(t)e^{-izt}\,dt,
 \qquad
 V_n(t)={(-1)^n\over\sqrt L}e^{2\pi int/L},
 \qquad Jf(t)=f(-t),                               \tag{0.3}
\]

with Lebesgue measure and zero extension before translation.  The prolate
state is kept in its locked source normalization.  The source-lock erratum
is also retained: the printed source-normalized transform tends to `Xi/4`,
so the factor four is applied only to the final characteristic function.

No list of real zeta zeros, global Weil positivity, or unit-normalized
substitute is used.  The note proves no arithmetic sector sign, no signed
response decay for the actual Weil/prolate matrices, no full-`L2` equation
(5.2) of `DIRECT_RH_ATTACK.md`, no unconditional locally uniform limit, and
no Riemann-hypothesis conclusion.  The formal terminal state is
`P0_INVALIDATED`.

## 1. Complete signed source normal form

Let

\[
 W(e^t)=\sum_{1<n\leq e^t}{\Lambda(n)\over\sqrt n},
 \qquad
 D_\lambda(t)=W(e^t)-2(e^{t/2}-1),\quad 0\leq t\leq L. \tag{1.1}
\]

The sum is right-continuous and inclusive.  Its exact Stieltjes derivative
on `[0,L]` is

\[
 dD_\lambda(t)=
 \sum_{1<n\leq\lambda^2}{\Lambda(n)\over\sqrt n}
       \delta_{\log n}(dt)-e^{t/2}\,dt.            \tag{1.2}
\]

For the reflected zero-extension translation

\[
 (K_tf)(x)=\widetilde f(x+t)+\widetilde f(x-t),    \tag{1.3}
\]

put

\[
 T_D=\int_{[0,L]}K_t\,dD_\lambda(t).              \tag{1.4}
\]

The pole, the first archimedean Levy summand, and the continuous prime main
term cancel exactly as in the weighted-discrepancy normal form.  With

\[
 \tau(t)={e^{-5t/2}\over1-e^{-2t}},\qquad
 c_*=\psi(1/4)-\log\pi+4,                          \tag{1.5}
\]

and `A_tail` the full zero-extension Dirichlet operator for the symmetric
density `tau(|t|)dt`, the complete source operator is

\[
 \boxed{Q_\lambda=c_*I+H_D,\qquad H_D=A_{\rm tail}-T_D.} \tag{1.6}
\]

The density in (1.5) is not truncated at `L`; translations beyond the
interval contribute the boundary-killing scalar.  Formula (1.6) is an exact
combined identity, not an estimate of separate pole, archimedean, and prime
norms.

Let `Q_+` be a finite inversion-even compression, let `kappa` be the unit
source-normalized projected prolate state, and set

\[
 q=\langle\kappa,Q_+\kappa\rangle,
 \qquad {\cal K}=H_+\cap\kappa^\perp.              \tag{1.7}
\]

The signed forcing is

\[
 \boxed{
 b_D=P_{\cal K}H_D\kappa=P_{\cal K}Q_+\kappa.}    \tag{1.8}
\]

Suppose `mu` is a simple even ground, its line is not orthogonal to
`kappa`, and

\[
 B_\mu=P_{\cal K}\bigl((c_*-\mu)I+H_D\bigr)
          P_{\cal K}\big|_{\cal K}
       =P_{\cal K}(Q_+-\mu I)P_{\cal K}\big|_{\cal K}\succ0. \tag{1.9}
\]

Then the coefficient-normalized ground is exactly

\[
 \boxed{x=\kappa-B_\mu^{-1}b_D,qquad
        \langle\kappa,x\rangle=1.}                \tag{1.10}
\]

Both `b_D` and `B_mu` contain the complete signed source.  A bound obtained
by replacing (1.8) with `||A_tail*kappa||+||T_D*kappa||`, or by inserting an
absolute PNT envelope before the inverse, is not the observable below.

## 2. Natural projective observable and adjugate forms

Let `Pi=Pi_(M,+)` be the inversion-even restriction of the symmetric
centered projection onto `|n|<=M`, and put

\[
 p=\Pi\kappa,\qquad k_{00}=\|p\|^2,
 \qquad {\cal L}_M=\operatorname {Ran}\Pi\cap p^\perp. \tag{2.1}
\]

For `k_(00)>0`,

\[
 P_{{\cal L}_M}=\Pi-{pp^*\over k_{00}}.            \tag{2.2}
\]

The alignment observable is

\[
 \boxed{
 A_M=\|P_{{\cal L}_M}x\|^2
     =b_D^*B_\mu^{-1}P_{{\cal L}_M}B_\mu^{-1}b_D.} \tag{2.3}
\]

The second equality uses `P_(L_M)kappa=0`.  It is valid over a complex
Hilbert space; every transpose is a conjugate transpose.

Set

\[
 H=Q_+-\mu I,\qquad C=\operatorname {adj}H,
 \qquad c_\kappa=\kappa^*C\kappa.                  \tag{2.4}
\]

Since `H` is positive semidefinite of corank one,

\[
 C=c_\kappa xx^*,\qquad c_\kappa>0,               \tag{2.5}
\]

and therefore

\[
 \boxed{A_M={\operatorname {tr}(P_{{\cal L}_M}C)\over c_\kappa}.} \tag{2.6}
\]

The unbordered full-ambient diagonal response is

\[
 \boxed{
 S_M={\operatorname {tr}(\Pi C)\over c_\kappa}
     ={[\partial_t\det(H+t\Pi)]_{t=0}\over c_\kappa}
     =\langle x,\Pi x\rangle.}                    \tag{2.7}
\]

Let `R=I-Pi` and

\[
 h_M=\langle R\kappa,R(x-\kappa)\rangle.          \tag{2.8}
\]

Because `<kappa,x-kappa>=0`, one has
`<Pi*kappa,Pi*(x-kappa)>=-h_M`.  Orthogonal decomposition along the
anchor line and its transverse low space gives the exact complex identities

\[
 \boxed{
 \|\Pi(x-\kappa)\|^2=A_M+{|h_M|^2\over k_{00}},}  \tag{2.9}
\]

\[
 \boxed{
 S_M-k_{00}=A_M+{|h_M|^2\over k_{00}}
                 -2\operatorname {Re}h_M.}        \tag{2.10}
\]

The minus sign, modulus square, and real part are mandatory.  If
`k_(00)=0`, the quotient in (2.2), (2.9), and (2.10) is undefined; the
separate branch is `p=0`, `h_M=0`, `L_M=Ran(Pi)`, and

\[
 S_M=A_M=\|\Pi x\|^2.                              \tag{2.11}
\]

## 3. Odd-resolvent reconstruction and source cofactor normalization

Let the source mode map from the even to the odd parity sector be
`mathfrak D`, with pseudoinverse `mathfrak D^dagger`, and let

\[
 \eta=\sum_{|n|\leq N}V_n,qquad e_0=V_0,
 \qquad \beta=\mathfrak DQ_+e_0.                  \tag{3.1}
\]

The complete signed source identity is

\[
 \boxed{
 \beta=\mathfrak D(Q^{\rm pole}-Q^{\rm arch}-Q^{\rm prime})e_0
       =\mathfrak DH_De_0,}                       \tag{3.2}
\]

where the second equality uses that `mathfrak D` kills the scalar in
(1.6).  Equivalently,

\[
 \mathfrak DQ_+-Q_-\mathfrak D
       =|\beta\rangle\langle\eta|.                \tag{3.3}
\]

Assume the strict odd sign

\[
 O_\mu=Q_--\mu I\succ0.                            \tag{3.4}
\]

Then the boundary-normalized even ground reconstructed only from the odd
resolvent is

\[
 \boxed{
 \Phi_\mu=
 \left(1+\langle\eta,\mathfrak D^\dagger
                    O_\mu^{-1}\beta\rangle\right)e_0
 -\mathfrak D^\dagger O_\mu^{-1}\beta,}           \tag{3.5}
\]

with

\[
 \langle\eta,\Phi_\mu\rangle=1,
 \qquad p_\mu=\langle\kappa,\Phi_\mu\rangle\ne0,
 \qquad x={\Phi_\mu\over p_\mu}.                 \tag{3.6}
\]

Consequently,

\[
 \boxed{
 A_M={\|P_{{\cal L}_M}\Phi_\mu\|^2\over|p_\mu|^2}.} \tag{3.7}
\]

For `k_(00)>0`, this may also be serialized without constructing the
projector:

\[
 \boxed{
 A_M={\|p\wedge\Pi\Phi_\mu\|^2
          \over k_{00}|p_\mu|^2}.}                \tag{3.8}
\]

Multiplying `Phi_mu` by any nonzero scalar changes numerator and denominator
in (3.7)--(3.8) by the same factor.  Thus the nonvanishing of `p_mu` is
essential, but its size or the chosen boundary normalization does not alter
the relative rate.

The source boundary determinant identity gives

\[
 \operatorname {adj}(H)e_0=(\det O_\mu)\Phi_\mu,  \tag{3.9}
\]

and hence

\[
 \boxed{
 c_\kappa={\det(O_\mu)|p_\mu|^2
                  \over\langle e_0,\Phi_\mu\rangle}.} \tag{3.10}
\]

This factorizes the denominator in (2.7), but it does not eliminate the
ground-alignment information: the same overlap `p_mu` reappears explicitly.
A determinant sign alone also does not prove the odd inertia in (3.4).

## 4. Cumulative signed discrepancy and ordinary Chebyshev error

The inverse form (2.3) can be written as an exact signed arithmetic
quadrature.  This section records the boundary terms, which cannot be
dropped.

Define, for `t>0`,

\[
 \rho(t)={e^{-t/2}\over1-e^{-2t}},qquad
 H_0(t)=\int_t^\infty\rho(u)\,du,                  \tag{4.1}
\]

\[
 \boxed{F_\lambda(t)=D_\lambda(t)-H_0(t),\qquad0<t\leq L.} \tag{4.2}
\]

Here `rho=e^(-t/2)+tau`, so `H_0` is the full one-sided archimedean tail,
not merely the pole-cancelled density in (1.5).  The exact closed form is

\[
 H_0(t)={1\over2}\log{1+e^{-t/2}\over1-e^{-t/2}}
          +\arctan(e^{-t/2}).                     \tag{4.3}
\]

Let `psi_C(X)=sum_(n<=X) Lambda(n)` be the right-continuous ordinary
Chebyshev function and define

\[
 \boxed{
 G_\lambda(t)=e^t-\psi_C(e^t)
              -{1\over2}\log(1-e^{-2t}),\qquad0<t\leq L.} \tag{4.4}
\]

At every prime power, both `F_lambda` and the formulas below use the
inclusive right value.  Distributionally on `(0,L]`,

\[
 dG_\lambda(t)=\left(e^t-{1\over e^{2t}-1}\right)dt
                  -\sum_{1<n\leq\lambda^2}\Lambda(n)
                    \delta_{\log n}(dt).          \tag{4.5}
\]

Since

\[
 {e^{-t/2}\over e^{2t}-1}
 ={e^{-5t/2}\over1-e^{-2t}}=\tau(t),              \tag{4.6}
\]

equations (1.2), (4.1), and (4.5) give the exact signed relation

\[
 \boxed{dF_\lambda(t)=e^{-t/2}\bigl(dt-dG_\lambda(t)\bigr).} \tag{4.7}
\]

In particular, for `0<s<t<=L`,

\[
 \boxed{
 F_\lambda(t)-F_\lambda(s)
 =-\int_{(s,t]}e^{-u/2}\,dG_\lambda(u)
   +\int_s^t e^{-u/2}\,du.}                       \tag{4.8}
\]

There is no valid replacement of (4.8) by the bare pointwise expression
`F_lambda=-e^(-t/2)G_lambda`: integration by parts creates a boundary term
and a derivative of the weight.

For `v in K`, define the complete zero-extension correlation

\[
 q_v(t)=\langle v,K_t\kappa\rangle,
 \qquad w_v(t)=e^{-t/2}q_v(t),\quad0\leq t\leq L. \tag{4.9}
\]

Finite Fourier vectors make `q_v` absolutely continuous.  Orthogonality and
zero extension give

\[
 q_v(0)=2\langle v,\kappa\rangle=0,
 \qquad q_v(L)=0.                                  \tag{4.10}
\]

There is a slightly shorter cumulative form adapted directly to the
pole-cancelled normal form.  Put

\[
 H_{\rm tail}(t)=\int_t^\infty\tau(u)\,du,
 \qquad
 F_{\rm align}(t)=D_\lambda(t)-H_{\rm tail}(t).    \tag{4.10a}
\]

Because \(\rho(t)=e^{-t/2}+\tau(t)\),

\[
 \boxed{
 F_{\rm align}(t)=F_\lambda(t)+2e^{-t/2},
 \qquad dF_{\rm align}=dD_\lambda+\tau(t)\,dt
 =-e^{-t/2}dG_\lambda(t).}                        \tag{4.10b}
\]

The scalar killing part of `A_tail` also vanishes against `v`.  Combining
(1.2), (1.5), and (4.10a)--(4.10b) therefore gives

\[
\begin{aligned}
 \langle v,b_D\rangle
 &=-\int_0^Lq_v(t)\tau(t)\,dt
   -\int_{(0,L]}q_v(t)\,dD_\lambda(t)\\
 &=-\int_{(0,L]}q_v(t)\,dF_{\rm align}(t)\\
 &=\int_0^LF_{\rm align}(t)q_v'(t)\,dt\\
 &=\boxed{\int_0^Lw_v(t)\,dt
          -\int_{(0,L]}q_v(t)\,dF_\lambda(t).}    \tag{4.11}
\end{aligned}
\]

Thus, with the producer-facing correlation notation
\(C_v(t)=q_v(t)\), the simplest exact signed amplitude is
\(\int_0^L F_{\rm align}(t)C_v'(t)\,dt\).  The last line of (4.11) is the
same identity expressed with the boundary discrepancy \(F_\lambda\); the
drift term is mandatory there.

The endpoint atom at `t=L` is retained in the Stieltjes inventory even
though its matrix contribution is killed by `q_v(L)=0`.  Substitution of
(4.7), followed by Stieltjes integration by parts and (4.10), yields the
equivalent ordinary-Chebyshev-error form

\[
 \boxed{
 \langle v,b_D\rangle
 =-\int_0^LG_\lambda(t)w_v'(t)\,dt.}              \tag{4.12}
\]

The logarithmic behavior of `G_lambda` at zero is harmless because
`w_v(0)=0` and a finite Fourier correlation is Lipschitz there.

Let `(ell_j)` be any orthonormal basis of `L_M` and define

\[
 u_j=B_\mu^{-1}\ell_j.                            \tag{4.13}
\]

Self-adjointness of `B_mu` and (2.3) now give the exact
projected-resolvent quadrature

\[
\boxed{
\begin{aligned}
 A_M
 &=\sum_j|\langle u_j,b_D\rangle|^2\\
 &=\sum_j\left|
     \int_0^Lw_{u_j}(t)\,dt
      -\int_{(0,L]}q_{u_j}(t)\,dF_\lambda(t)
            \right|^2\\
 &=\sum_j\left|
      -\int_0^LG_\lambda(t)w_{u_j}'(t)\,dt
             \right|^2.
\end{aligned}}                                    \tag{4.14}
\]

Formula (4.14) is cancellation preserving within each combined amplitude.
It is not a PNT-only bound: the test vectors `u_j=B_mu^(-1)ell_j` contain
the unknown complementary inverse.  Bounding them by
`lambda_min(B_mu)^(-1)` merely restates a quantitative spectral floor.
Strict positivity supplies no uniform floor, and squaring separate absolute
prime and archimedean estimates loses the signed cancellation in (4.14).

## 5. Gevrey tail at the natural Fourier cutoff

Write the locked source-normalized logarithmic prolate state as

\[
 X_\lambda(t)=k_\lambda^+(e^t),\qquad t\in I_\lambda. \tag{5.1}
\]

We now use only the already-admitted hypotheses and conclusions of
`notes/GEVREY_PROLATE_EXPONENTIAL_REMAINDER_AUDIT.md`.  Its constants and
starting threshold are qualitative because the pinned fixed-index prolate
branch and concentration asymptotic have noncomputed thresholds.

Fix any constant `A0>0` and take the *formal Hermite order*

\[
 J=\lfloor A_0L\rfloor.                            \tag{5.2}
\]

This `J` is not the Fourier cutoff.  The Gevrey construction gives a
Fourier-invariant Hermite approximation `G_(lambda,J)` whose Hermite support
obeys

\[
 K\leq4J+4=O_{A_0}(L),                             \tag{5.3}
\]

whose coefficient norm is uniformly bounded, and for which equation (4.3)
of the Gevrey audit gives

\[
 \|X_\lambda-G_{\lambda,J}\|_2
 \leq C\lambda e^{-c\lambda^2}
   +C\lambda\left({B(J+1)\over\lambda^2}\right)^{J+1}. \tag{5.4}
\]

Because `log(lambda^2)=L`, eventually

\[
 \log(B(J+1))-L\leq-{L\over2},
 \qquad J+1>A_0L,                                  \tag{5.5}
\]

and hence, after enlarging the starting threshold,

\[
 \log\!\left[
 \lambda\left({B(J+1)\over\lambda^2}\right)^{J+1}
 \right]\leq-{A_0\over3}L^2.                     \tag{5.6}
\]

Now take the *centered Fourier cutoff*

\[
 \boxed{M=\lceil\lambda\rceil.}                  \tag{5.7}
\]

Equation (5.5) of the Gevrey audit uses

\[
 \Omega_M={2\pi(M+1)\over L}\geq{2\pi\lambda\over L}. \tag{5.8}
\]

For every fixed strip width `0<sigma<pi/4`, (5.3) gives

\[
 C_\sigma K\log(K+2)-\sigma\Omega_M
 \leq C_{A_0,\sigma}L\log L-{2\pi\sigma\lambda\over L}
 \leq-c_1{\lambda\over L}                        \tag{5.9}
\]

eventually.  Its endpoint term is a fixed polynomial in `lambda,K,M`
times `e^(-c_kappa*lambda^2)`, so it is `O(e^(-c_2*lambda^2))` here.  Combining
(5.4), (5.6), and (5.9) proves the natural-cutoff corollary

\[
 \boxed{
 \|(I-P_{\lceil\lambda\rceil})X_\lambda\|_2
       =O(e^{-c_0L^2}).}                           \tag{5.10}
\]

This is superpolynomial in `lambda`; in particular it is
`o(lambda^(-A))` for every fixed `A>0`.  No effective value of `c_0` or
certified starting `lambda` is claimed.

On the locked half-integer schedule

\[
 \lambda={2j+1\over2},\qquad
 N_{\exp}(\lambda)=2^{9600\lambda^2}
                  =2^{2400(2j+1)^2},              \tag{5.11}
\]

let

\[
 a_{\lambda,N}=\|P_NX_\lambda\|,
 \qquad \kappa={P_NX_\lambda\over a_{\lambda,N}}. \tag{5.12}
\]

The admitted projected-state theorem gives constants
`0<a_-<=a_(lambda,N)<=a_+` eventually.  Centered projections are nested, so
`M<N` eventually and

\[
\begin{aligned}
 t_\kappa
 :=\|(I-P_M)\kappa\|
 &={\|(P_N-P_M)X_\lambda\|\over a_{\lambda,N}}\\
 &\leq{\|(I-P_M)X_\lambda\|\over a_-}
 =O(e^{-c_0L^2}).                                  \tag{5.13}
\end{aligned}
\]

Thus `t_kappa=o(lambda^(-1/2))` and indeed `o(lambda^(-A))` for every fixed
`A`.  The compact-frequency condition in the projective bridge also holds:

\[
 {2\pi(M+1)\over L}\sim{2\pi\lambda\over L}
 \longrightarrow\infty,                          \tag{5.14}
\]

so it eventually exceeds `2*sqrt(B^2+eta^2)` on every fixed compact window
`|Re z|<=B`, `|Im z|<=eta<1/2`.

## 6. Conditional natural-cutoff projective bridge

The following statement isolates, rather than proves, the remaining
arithmetic lemma.

### Theorem 6.1 (conditional `M=ceil(lambda)` bridge)

Use the locked schedule (5.11)--(5.12), and suppose on an unbounded tail of
that schedule that:

1. `r=||(Q_+-qI)kappa||>0`, the mandatory lower two-vector Ritz value is
   the exact scalar `u`, and `d/r=(q-u)/r` is bounded;
2. the shifts are tested at that same exact value `U=u`, with

   \[
   P_{\kappa^\perp}(Q_+-uI)P_{\kappa^\perp}\succ0,
   \qquad Q_--uI\succ0;                            \tag{6.1}
   \]

3. `mu` is the simple even true ground used in (1.9)--(3.10); and
4. at `M=ceil(lambda)` the complete signed singular response satisfies

   \[
   \boxed{|S_M-k_{00}|=O(\lambda^{-1}).}           \tag{6.2}
   \]

Then the hypotheses of the projective low-mode bridge hold for every fixed
closed substrip `|Im z|<=eta<1/2` and every bounded real window.

**Proof.**  The exact-`u` Ritz theorem and bounded `d/r` give

\[
 \|x-\kappa\|\leq C_{\rm R}(d/r)=O(1).            \tag{6.3}
\]

The constant is a norm bound; `C_R^2` is the corresponding squared bound.
From (5.13),

\[
 |h_M|\leq t_\kappa\|x-\kappa\|
      =O(e^{-c_0L^2}),
 \qquad k_{00}=1-t_\kappa^2\geq\tfrac12           \tag{6.4}
\]

eventually.  Equation (2.10) and (6.2) imply

\[
 A_M\leq|S_M-k_{00}|+2|h_M|+{|h_M|^2\over k_{00}}
       =O(\lambda^{-1}).                           \tag{6.5}
\]

Equation (2.9) therefore gives the actual low squared error

\[
 E_M=\|P_M(x-\kappa)\|^2=O(\lambda^{-1}).         \tag{6.6}
\]

The source-normalized scale `a_(lambda,N)` is bounded.  Hence, for every
fixed `eta<1/2`, the three projective bridge rates are

\[
 \sqrt L\,\lambda^\eta\|P_NX_\lambda-X_\lambda\|
 =O(\sqrt L\,\lambda^\eta e^{-c_0L^2})\longrightarrow0, \tag{6.7}
\]

\[
 a_{\lambda,N}^2L\lambda^{2\eta}E_M
 =O(L\lambda^{2\eta-1})\longrightarrow0,          \tag{6.8}
\]

and

\[
 a_{\lambda,N}\lambda^\eta\sqrt{L/M}\,
       \|(I-P_M)(x-\kappa)\|
 =O(\lambda^{\eta-1/2}\sqrt L)\longrightarrow0.  \tag{6.9}
\]

Here (6.9) uses the bounded exact-`u` Ritz correction, not a claim that its
high tail decays.  Equations (5.14) and `M<N` supply the remaining geometric
hypotheses.  This proves the conditional bridge.  \(\square\)

The convenient response rate (6.2) can be weakened to the exact condition

\[
 L\lambda^{2\eta}|S_M-k_{00}|\longrightarrow0
 \quad\hbox{for every fixed }\eta<1/2,             \tag{6.10}
\]

provided the superpolynomial cross term (6.4) and the other assumptions are
retained.

Because (6.4) is `o(lambda^(-1))`, equations (2.10) and (3.7) give the
equivalent alignment formulation

\[
\boxed{
 |S_M-k_{00}|=O(\lambda^{-1})
 \quad\Longleftrightarrow\quad
 \|P_{{\cal L}_M}\Phi_\mu\|^2
 =O(\lambda^{-1})|\langle\kappa,\Phi_\mu\rangle|^2.} \tag{6.11}
\]

Thus `p_mu` normalization changes no exponent and introduces no extra rate;
only its nonvanishing is required.  Formula (6.11) is the unresolved
odd-resolvent ground-alignment obstruction in a natural-cutoff form.  It is
not an estimate of that obstruction.

Conditional on all four premises, the existing zero-preserving projective
characteristic functions converge locally uniformly to `Xi` on
`|Im z|<1/2`.  This conclusion is not full-`L2` convergence and does not
assert equation (5.2).  Since (6.1)--(6.2) are not proved for the actual
unbounded source schedule, this note does not establish that limit.

## 7. Exact diagonal source-Cauchy counterfamily

The response decay in (6.2) or (6.11) does not follow from Cauchy
displacement, both strict signs, small residual, small Ritz lowering, or
zero tail.

Fix `N>=2`, real `U`, and `0<epsilon<G`.  On raw modes
`0,+/-1,...,+/-N`, take zero Cauchy coefficients

\[
 b_n^{\rm C}=0,                                    \tag{7.1}
\]

and the inversion-symmetric diagonal sequence

\[
 a_0=U,\qquad a_{\pm1}=U+\epsilon,
 \qquad a_{\pm n}=U+G\quad(2\leq n\leq N).       \tag{7.2}
\]

All off-diagonal entries satisfy the exact source-Cauchy formula
`Q_(nm)=(b_n^C-b_m^C)/(n-m)=0`, and

\[
 [\mathfrak D,Q]=0,qquad\beta=0.                  \tag{7.3}
\]

In the natural parity bases,

\[
 Q_+=\operatorname {diag}(U,U+\epsilon,U+G,\ldots),
 \qquad
 Q_-=\operatorname {diag}(U+\epsilon,U+G,\ldots). \tag{7.4}
\]

The source boundary identity holds identically in `z`:

\[
 \det(Q_--zI)
 =\langle\eta,\operatorname {adj}(Q_+-zI)e_0\rangle
 =(U+\epsilon-z)(U+G-z)^{N-1}.                    \tag{7.5}
\]

Let

\[
 c={3\over5},\qquad s={4\over5},\qquad
 \kappa=ce_0+se_1^+,
 \qquad w=-se_0+ce_1^+.                           \tag{7.6}
\]

For every cutoff `1<=M<N`, the anchor has exactly zero tail.  Direct exact
calculation gives

\[
 q=U+{16\over25}\epsilon,qquad
 (Q_+-qI)\kappa={12\over25}\epsilon\,w,           \tag{7.7}
\]

\[
 r={12\over25}\epsilon,qquad
 u=\mu=U,qquad d=q-u={16\over25}\epsilon,
 \qquad {d\over r}={4\over3}.                    \tag{7.8}
\]

The exact lower-Ritz moment and correction are

\[
 \langle w,(Q_+-uI)w\rangle={9\over25}\epsilon,
 \qquad
 d\,{9\epsilon\over25}=r^2,                     \tag{7.9}
\]

\[
 z=B_u^{-1}b={4\over3}w,
 \qquad x=\kappa-z={5\over3}e_0.                 \tag{7.10}
\]

Both signs are strict:

\[
 B_u\succ0,qquad Q_--uI\succ0,                  \tag{7.11}
\]

with the displayed active even value `9*epsilon/25`, odd floor `epsilon`,
and all remaining values `G`.  Since `Pi*kappa=kappa`,

\[
 k_{00}=1,qquad h_M=0,qquad
 \Phi_\mu=e_0,qquad p_\mu={3\over5}.             \tag{7.12}
\]

Nevertheless,

\[
 \boxed{
 A_M=S_M-k_{00}
 ={\|P_{{\cal L}_M}\Phi_\mu\|^2\over|p_\mu|^2}
 ={16\over9}.}                                    \tag{7.13}
\]

Letting `epsilon` tend to zero makes both `r` and `d` tend to zero while
the normalized response remains exactly `16/9`.  The family is growing in
`N`, has exact inversion and diagonal Cauchy structure, obeys the boundary
determinant identity, and has zero projection tail.  It is a structural
counterfamily, not the pinned arithmetic Weil matrix and not the actual
source-normalized prolate state.  It proves that an arithmetic orientation
estimate, rather than another abstract displacement or positivity identity,
is necessary.

## 8. What remains and what is ruled out

The strongest currently admitted generic estimate under bounded `d/r` is

\[
 A_M\leq\|x-\kappa\|^2\leq C_{\rm R}(d/r)^2=O(1). \tag{8.1}
\]

It has no decay.  In particular:

1. Applying a PNT absolute envelope to (4.14) still leaves the inverse
   vectors `u_j`; bounding them invokes `lambda_min(B_mu)^(-1)` and is an
   equivalent spectral-floor assumption.
2. The exact signed cumulative measure has a continuous density of changing
   sign and upward prime-power jumps.  Neither it nor the finite ground has
   been proved to define a positive probability kernel, so a maximum,
   Markov, Jensen, or Doob argument is unavailable.
3. Strict even and odd positivity gives invertibility but no quantitative
   lower eigenvalue on an unbounded schedule.  The counterfamily makes this
   distinction exact.
4. The source boundary determinant reconstructs a determinant, not inertia
   or the relative orientation in (6.11).
5. A real-axis eigenvalue match, a numerical small pilot, or an assumed list
   of real zeros cannot replace locally uniform characteristic-function
   convergence.

The minimal new arithmetic theorem exposed here is therefore:

> On the locked source-normalized half-integer/exponential schedule, prove
> the exact even and odd signs at `U=u`, bounded `(q-u)/r`, nonvanishing
> `p_mu`, and the relative alignment estimate
> \[
> \|P_{{\cal L}_{\lceil\lambda\rceil}}\Phi_\mu\|^2
> \leq {C\over\lambda}|\langle\kappa,\Phi_\mu\rangle|^2
> \]
> from the complete signed arithmetic source, without a zero list or global
> Weil positivity.

The Gevrey theorem removes the projection-tail obstruction at the natural
cutoff.  It does not supply this orientation theorem.  Accordingly the
honest terminal state remains `P0_INVALIDATED`.
