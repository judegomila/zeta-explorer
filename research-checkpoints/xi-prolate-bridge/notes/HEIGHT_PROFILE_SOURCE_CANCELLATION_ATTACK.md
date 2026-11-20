# Source cancellation and a value-mesh criterion for the height profile

## 0. Claim boundary and outcome

This note attacks the source-specific cancellation left open in
`notes/HEIGHT_PROFILE_FREDHOLM_CRITERION.md`.  It proves four exact
reductions.

1.  The pole/central-lattice term, the shifted odd response, and the target
    derivative combine into one total-variation quantity:

    \[
    \int_a^b\left|{d\over ds}\log
       {\widehat\xi(is)\over\Xi(is)}\right|ds.       \tag{0.1}
    \]

    Thus the missing `A'/A` cancellation is precisely bounded-variation
    flatness of a renormalized positive odd response, not three separate
    estimates.

2.  One need not estimate `A'/A` directly.  A growing finite mesh of the
    source values

    \[
    {\Xi(ib)\widehat\xi(is)\over\widehat\xi(ib)}
    \]

    is sufficient.  The value at the left endpoint supplies the complete
    first-trace bound automatically; the remaining mesh values identify the
    normal-family limit.  In source coordinates every node is one explicit
    ratio `A(sL/(2*pi))/A(bL/(2*pi))`.

3.  There is a substantially weaker origin route.  On a schedule for which
    the projected anchor has its proved convergent origin two-jet, the
    complete shifted-ground estimate

    \[
       \|(A-U I)^{-1}b\|=O((\log\lambda)^{-5/2})         \tag{0.2}
    \]

    already proves the locally uniform determinant limit.  Big `O`, not
    little `o`, suffices: the origin two-jet supplies only the normal-family
    bound, while real-axis convergence identifies the unique limit.

4.  A direct coefficient-normalized ground-state estimate

    \[
       \varepsilon_\lambda=o(\lambda^{-b}/\log\lambda)             \tag{0.3}
    \]

    is sufficient on any one fixed interval `0<a<b<1/2`.  Hence any proved
    polynomial decay of the complete shifted solve would suffice after
    choosing `b` below its exponent.  This is strictly weaker than the
    nearly `lambda^(-1/2)` full-strip target in equation (5.2) of
    `DIRECT_RH_ATTACK.md`.

The already-proved prolate projection estimate supplies all anchor inputs in
these statements.  No current theorem gives the unbounded shifted signs,
(0.2), (0.3), or the finite-node ground wedges below for the actual Weil
matrices.  The note therefore proves no unconditional height-profile
convergence, locally uniform determinant limit, or Riemann-hypothesis
conclusion.  The formal state remains `P0_INVALIDATED`.

All finite formulas use the source Fourier sign, the true finite ground
shift, the quotient metric, the complete exterior Fourier lattice, and the
pole--archimedean--minus-prime matrix.  No zero table and no global Weil
positivity are used.

## 1. Exact finite source response

Fix one source pair `(lambda,N)` for which the lowest Weil eigenvalue is
simple and its ground line is inversion even.  Put

\[
 L=2\log\lambda .                                      \tag{1.1}
\]

Normalize the real even ground vector by `<eta,xi>=1`.  With the notation of
`notes/PAIRED_TRACE_ODD_RESOLVENT_GATE.md`,

\[
 \alpha_s={sL\over2\pi},\qquad
 A(\alpha)=1+\langle g_\alpha,
       (Q-\epsilon I)|_{H_-}^{-1}\beta\rangle>0,         \tag{1.2}
\]

and the positive imaginary-axis transform is exactly

\[
 \boxed{
 M(s):=\widehat\xi(is)
 ={2\sinh(sL/2)\over s\sqrt L}\,A(\alpha_s)>0.}         \tag{1.3}
\]

The inverse in (1.2) is the actual shifted odd Weil block.  In particular,
all source blocks and their cancellation have already been combined before
`A` is formed.

Let `R` be the complete half-paired multiset of real zeros of
`widehat(xi)`, including the exterior Fourier lattice and one copy for each
order-two zero at the origin.  Then

\[
 S(s)=\sum_{\rho\in R}{1\over\rho^2+s^2},                \tag{1.4}
\]

and paired factorization gives

\[
 {M(s)\over M(b)}
 =\prod_{\rho\in R}{\rho^2+s^2\over\rho^2+b^2},
 \qquad
 {d\over ds}\log M(s)=2sS(s).                          \tag{1.5}
\]

Omitting the exterior lattice in (1.4) changes both identities at finite
`N` and is not permitted.

## 2. The exact `A'/A` cancellation is a BV identity

Fix once and for all

\[
 0<a<b<{1\over2}.                                      \tag{2.1}
\]

Since `Xi(is)>0` on this interval, define the renormalized response

\[
 \mathcal R_{\lambda,N}(s)
 ={2\sinh(sL/2)\over s\sqrt L}
   {A(\alpha_s)\over\Xi(is)}
 ={M(s)\over\Xi(is)}>0.                                \tag{2.2}
\]

Direct differentiation, with the mandatory chain factor `L/(2*pi)`, gives

\[
\boxed{
 {d\over ds}\log\mathcal R_{\lambda,N}(s)
 ={L\over2}\coth(sL/2)-{1\over s}
 +{L\over2\pi}{A'(\alpha_s)\over A(\alpha_s)}
 -{d\over ds}\log\Xi(is).}                           \tag{2.3}
\]

Consequently the source cancellation target (5.6) of the preceding note is
exactly

\[
\boxed{
 \delta_{\lambda,N}
 =\operatorname {Var}_{[a,b]}\log\mathcal R_{\lambda,N}
 =\int_a^b\left|{d\over ds}
       \log\mathcal R_{\lambda,N}(s)\right|ds.}         \tag{2.4}
\]

This identity preserves the cancellation before taking an absolute value.
It also shows precisely why separate `O(L)` estimates for the hyperbolic
and odd-response terms cannot close the problem.

If (2.4) tends to zero, integration between `s` and `b` gives the uniform
source-response ratio

\[
 {A(\alpha_s)\over A(\alpha_b)}
 ={s\over b}{\sinh(bL/2)\over\sinh(sL/2)}
   {\Xi(is)\over\Xi(ib)}\{1+o(1)\}                     \tag{2.5}
\]

on `[a,b]`.  At every fixed `s<b`, this contains the forced exponential
compensation

\[
 {A(\alpha_s)\over A(\alpha_b)}
 ={s\over b}{\Xi(is)\over\Xi(ib)}
   e^{(b-s)L/2}\{1+o(1)\}.                              \tag{2.6}
\]

The exponentially small corrections from the two hyperbolic sines are
absorbed in `o(1)`.  Differentially, (2.3)--(2.4) require

\[
 {A'(\alpha_s)\over A(\alpha_s)}
 =-\pi\coth(sL/2)
  +{2\pi\over L}
   \left\{{1\over s}+{d\over ds}\log\Xi(is)\right\}
  +o_{L^1([a,b])}(L^{-1}).                              \tag{2.7}
\]

Equations (2.5)--(2.7) are consequences of the desired convergence, not
estimates currently known for the arithmetic response.

## 3. A growing mesh of source values is sufficient

For the finite ground transform define the scale-free normalization

\[
 G_{\lambda,N}(z)
 =\Xi(ib){\widehat\xi(z)\over\widehat\xi(ib)}.           \tag{3.1}
\]

At imaginary height `s`, (1.3) gives the root-free source formula

\[
\boxed{
 G_{\lambda,N}(is)
 =\Xi(ib){b\over s}
  {\sinh(sL/2)\over\sinh(bL/2)}
  {A(\alpha_s)\over A(\alpha_b)}.}                     \tag{3.2}
\]

Thus (3.2) needs values of one shifted odd solve, not its derivative and not
the quotient roots.

Consider a sequence of finite source pairs satisfying the simple-even
hypotheses.  At stage `j`, let

\[
 a=s_{j,0}<s_{j,1}<\cdots<s_{j,m_j}=b,
 \qquad
 h_j=\max_i(s_{j,i+1}-s_{j,i}).                         \tag{3.3}
\]

### Theorem 3.1 (source-value mesh criterion)

Suppose

\[
 h_j\longrightarrow0,
 \qquad
 \epsilon_j:=\max_i
  |G_j(is_{j,i})-\Xi(is_{j,i})|\longrightarrow0.        \tag{3.4}
\]

Then

\[
 G_j\longrightarrow\Xi                                  \tag{3.5}
\]

locally uniformly on the whole complex plane.  Moreover, the complete
height profiles satisfy

\[
 \int_a^b2s\,|S_j(s)-S_\Xi(s)|\,ds\longrightarrow0.     \tag{3.6}
\]

**Proof.**  The left endpoint is included in every mesh.  Since
`Xi(ia)>0`, (3.4) implies, eventually,

\[
 {M_j(a)\over M_j(b)}={G_j(ia)\over\Xi(ib)}\ge c>0.     \tag{3.7}
\]

The product in (1.5) lies in `(0,1]`.  Taking its logarithm and using the
monotonicity of `S_j` gives

\[
 (b^2-a^2)S_j(b)
 \le-\log {M_j(a)\over M_j(b)}
 \le-\log c.                                            \tag{3.8}
\]

Hence the complete first traces `S_j(b)` are uniformly bounded.  This is
the normal-family gate; no separate hypothesis has been inserted.

For `a<=s<=b`, termwise comparison in (1.4) gives

\[
 S_j(s)\le {b^2\over a^2}S_j(b).                        \tag{3.9}
\]

Also `0<G_j(is)<=Xi(ib)`.  Equations (1.5), (3.8), and (3.9) therefore give
a uniform Lipschitz constant on the whole interval:

\[
 \left|{d\over ds}G_j(is)\right|
 =2sS_j(s)G_j(is)
 \le2b{b^2\over a^2}\Xi(ib)\sup_jS_j(b).              \tag{3.10}
\]

The mesh hypothesis and the uniform continuity of `Xi(is)` now imply
uniform convergence on the full imaginary segment `[ia,ib]`.

Paired factorization writes

\[
 {\widehat\xi_j(z)\over\widehat\xi_j(ib)}
 =\det\{I-(z^2+b^2)K_{j,b}\},
 \quad
 \operatorname {tr}K_{j,b}=S_j(b).                     \tag{3.11}
\]

The trace bound in (3.8) makes (3.11) a normal family on the whole plane.
Every subsequential limit agrees with `Xi(z)/Xi(ib)` on the nondegenerate
imaginary segment, hence everywhere by the identity theorem.  This proves
(3.5).  Local uniform convergence of the functions and their derivatives,
together with nonvanishing on `[ia,ib]`, gives uniform convergence of the
logarithmic derivatives there.  Equations (1.5) and (2.2) then give (3.6).
\(\square\)

The theorem replaces the growing mesh of traces in the preceding criterion
by a growing mesh of source transform values.  The left endpoint value
forces the exponential response ratio (2.6); the other nodes control its
shape.  A single endpoint compensation is not enough, as Section 7 shows.

## 4. Finite projective-wedge version

The mesh theorem admits a source-ground comparison which is weaker than a
uniform compact-set wedge estimate.  Use the exact even Feshbach
decomposition

\[
 Q_+=\begin{bmatrix}q&b_0^*\\b_0&A_0\end{bmatrix}
 \quad\hbox{on}\quad\mathbb C\kappa\oplus\mathcal K,   \tag{4.1}
\]

let `U` satisfy the strict shifted even-complement and odd-sector signs, and
put

\[
 B=A_0-U I>0,qquad
 z_\mu=(A_0-\mu I)^{-1}b_0,qquad
 w=\kappa-z_\mu.                                        \tag{4.2}
\]

The line `C*w` is the actual finite ground line.  Write
`kappa_s=widehat(kappa)(is)` and `z_s=widehat(z_mu)(is)`.  At every node one
has the exact projective identity

\[
\boxed{
 \Xi(ib)\left\{{\widehat w(is)\over\widehat w(ib)}
              -{\kappa_s\over\kappa_b}\right\}
 =-{\Xi(ib)\{\kappa_bz_s-\kappa_sz_b\}
       \over(\kappa_b-z_b)\kappa_b}.}                  \tag{4.3}
\]

Define

\[
 \mathcal E_U=\langle b_0,B^{-1}b_0\rangle,             \tag{4.4}
\]

and let `L_b(U)` and `L_(s,b),wedge(U)` be the one-inverse graph leverages
of the anchor evaluation and the wedge in (4.3), as in
`notes/PROJECTIVE_WEDGE_RESOLVENT_REDUCTION.md`.  Then

\[
 |z_b|^2\le\mathcal E_U\mathcal L_b(U),
 \qquad
 |\kappa_bz_s-\kappa_sz_b|^2
 \le\mathcal E_U\mathcal L_{(s,b),\wedge}(U).           \tag{4.5}
\]

The projected prolate norm and transform theorems make `kappa_b` converge to
a nonzero constant.  It follows from (4.3)--(4.5) that Theorem 3.1 applies if

\[
 \mathcal E_{U_j}\mathcal L_b(U_j)\longrightarrow0,
 \qquad
 \max_i\mathcal E_{U_j}
       \mathcal L_{(s_{j,i},b),\wedge}(U_j)
       \longrightarrow0,                               \tag{4.6}
\]

and the source signs hold.  At each stage (4.6) contains only finitely many
observations.  It is weaker than controlling the wedge uniformly on every
complex compact set, although the number of observations must grow.  No
estimate currently proves (4.6) on an unbounded arithmetic schedule.

## 5. A polylogarithmic origin gate already closes the determinant topology

The source-value mesh is not the weakest consequence of a complete ground
solve.  The origin two-jet proved in
`notes/PROJECTED_ANCHOR_ORIGIN_JET_AND_ONE_HEIGHT_GATE.md` can be combined
with the normal-family uniqueness criterion in
`notes/LOCALLY_UNIFORM_DETERMINANT_ATTACK.md`.  The combination gives the
following stronger conditional theorem.

Let `lambda_j -> infinity`, `L_j=2 log(lambda_j)`, and assume the projection
schedule satisfies

\[
 {N_j\over L_j^2}\longrightarrow\infty.                 \tag{5.1}
\]

This is far weaker than either the quadratic-in-`lambda` or the locked
exponential schedule.  It makes the exterior-lattice first trace vanish,
implies the `N/L^(7/5)` origin-jet condition, and makes the real-axis
projection error `O(L^(3/2)/N)` tend to zero.  Let

\[
 p_j=a_j\kappa_j=P_{N_j}k_{\lambda_j}^+                \tag{5.2}
\]

be the projected prolate anchor.  Its proved origin jet says

\[
 \widehat p_j(0)\longrightarrow {\Xi(0)\over4}\ne0,
 \qquad
 {1\over2}\int x^2p_j(x)\,dx
 \longrightarrow-{\Xi''(0)\over8}.                    \tag{5.3}
\]

For clarity, (5.1) supplies every anchor assertion just used.  The exact
projection estimate and locked `delta_lambda=O(lambda^(-2))` give

\[
 e_{\lambda_j,N_j}
 =O(\lambda_j^{-1/2})+O(L_j/N_j),                     \tag{5.3a}
\]

so `sqrt(L_j)e_(lambda_j,N_j)->0` and the corrected source limit gives
`4*widehat(p_j)(t)->Xi(t)` locally uniformly for real `t`.  The norm theorem
needs only `L_j/N_j->0`, hence `a_j->a_infinity>0`.  Finally, (5.1) implies
the origin-jet condition `N_j/L_j^(7/5)->infinity`; explicitly, its Fourier
second-jet remainder is `O(L_j^(7/2)/N_j^(5/2))=o(1)`, while every
source-comparison term is a power of `L_j` times `O(lambda_j^(-1/2))` and
therefore vanishes.  Thus no additional quadratic-in-`lambda` projection
hypothesis is hidden here.

Here and below `Q_j` is the exact locked source Weil matrix, hence has the
Cauchy form and rank-two commutator recorded in
`notes/SOURCE_BOUNDARY_COMMUTATOR_PROOF.md`.  The source-normalized
fixed-index estimate `delta_lambda=O(lambda^(-2))` from locked Lemma 7.2 is
also retained.  These are theorem inputs, not consequences of the sector
signs.

Assume at every sufficiently large stage that `U_j` is a rigorous
variational upper bound for the lowest even eigenvalue and has the two
strict signs

\[
 A_j-U_jI>0,
 \qquad Q_{j,-}-U_jI>0.                                \tag{5.4}
\]

Here `A_j` is the even complementary Feshbach block; it is not the scalar
odd response `A(alpha)` from Sections 1--3.

These signs make the actual ground line simple and even.  With

\[
 z_j=(A_j-\mu_jI)^{-1}b_j,
 \qquad
 \tau_j=\|(A_j-U_jI)^{-1}b_j\|,                        \tag{5.5}
\]

the coefficient-normalized ground representative

\[
 f_j=a_j(\kappa_j-z_j)                                 \tag{5.6}
\]

satisfies

\[
 \|f_j-p_j\|_2\le a_j\tau_j.                          \tag{5.7}
\]

### Theorem 5.1 (polylogarithmic ground transfer)

Under (5.1)--(5.7), if

\[
 \boxed{\tau_j=O(L_j^{-5/2}),}                         \tag{5.8}
\]

then

\[
 \boxed{
 \Xi(ib){\widehat f_j(z)\over\widehat f_j(ib)}
 \longrightarrow\Xi(z)}                               \tag{5.9}
\]

locally uniformly on the whole complex plane, for every fixed
`0<b<1/2`.  Consequently the complete profiles converge in the sense of
(3.6).

**Proof.**  The projected norms `a_j` tend to a positive finite constant, so
(5.7)--(5.8) give

\[
 \|f_j-p_j\|_2=O(L_j^{-5/2}).                          \tag{5.10}
\]

First verify that the source determinant theorem is available.  The first
sign in (5.4), the variational inequality `mu_j<=U_j`, and interlacing show
that the lowest even eigenvalue `mu_j` is simple.  The second sign puts every
odd eigenvalue strictly above `U_j` and hence above `mu_j`.  Thus `mu_j` is
the unique global lowest eigenvalue and its line is inversion even.  For the
exact source Cauchy matrix, the commutator argument then gives the strict
boundary pairing

\[
 \langle\delta_{N_j},\xi_j\rangle\ne0.                 \tag{5.10a}
\]

Consequently source Theorem 5.10 applies in its shifted quotient metric.
It proves that the transform of `f_j`, which is merely a nonzero scalar
representative of the same line, is even and has the complete all-real zero
multiset: the `2N_j` finite self-adjoint quotient roots together with the
exterior Fourier lattice.  No quantitative lower bound in (5.10a) is used.

The origin evaluation has norm `sqrt(L_j)`, while the second-jet functional
has exact norm `L_j^(5/2)/(8 sqrt(5))`.  Equations (5.3) and (5.10) therefore
give

\[
 \widehat f_j(0)\longrightarrow{\Xi(0)\over4}\ne0,
 \qquad
 \left|{1\over2}\int x^2f_j(x)\,dx\right|=O(1).       \tag{5.11}
\]

Thus no origin zero is present for all sufficiently large `j`.  Since every
other zero of `widehat(f_j)` is real, paired factorization at zero gives

\[
 {\widehat f_j(i\sqrt t)\over\widehat f_j(0)}
 =\prod_{\rho\in R_j}\left(1+{t\over\rho^2}\right),
 \qquad
 Z_j^{(0)}:=\sum_{\rho\in R_j}{1\over\rho^2}
 ={\displaystyle\frac12\int x^2f_j(x)\,dx
   \over\widehat f_j(0)}.                              \tag{5.12}
\]

The complete zero multiset, including the exterior lattice, occurs in
(5.12).  Positivity of the product makes `Z_j^(0)>=0`, and (5.11) bounds it
uniformly.  Hence at every fixed anchor height `b`,

\[
 S_j(b)=\sum_{\rho\in R_j}{1\over\rho^2+b^2}
 \le Z_j^{(0)}=O(1).                                  \tag{5.13}
\]

This is exactly the complete normal-family first-trace bound.

It remains to identify the limit.  For every real `t`, Cauchy--Schwarz and
(5.10) give, uniformly in `t`,

\[
 |\widehat f_j(t)-\widehat p_j(t)|
 \le\sqrt{L_j}\|f_j-p_j\|_2=O(L_j^{-2})\to0.          \tag{5.14}
\]

The proved prolate projection theorem gives
`4*widehat(p_j)(t)->Xi(t)` locally uniformly on the real axis.  Therefore
`4*widehat(f_j)(t)->Xi(t)` there.

By (5.13), the paired determinants normalized at `ib` form a normal family
on the whole plane.  Let a subsequence converge to `H`, and put

\[
 c_j={\Xi(ib)\over\widehat f_j(ib)}.                    \tag{5.15}
\]

Normality bounds `c_j*widehat(f_j)(0)`.  The first limit in (5.11) therefore
bounds `c_j`; pass to a further subsequence with `c_j->c`.  Equation (5.14)
gives

\[
 H(t)={c\over4}\Xi(t)
\]

on a real interval and hence everywhere by the identity theorem.  But the
normalization gives `H(ib)=Xi(ib)`, so `c=4`.  Every subsequential limit is
therefore `Xi`, which proves (5.9).  The profile conclusion follows from
local uniform convergence of logarithmic derivatives on `[ia,ib]`.
\(\square\)

Big `O` in (5.8) is enough.  Little `o` would identify the actual ground
origin curvature with the anchor curvature, but determinant convergence
uses only boundedness of that curvature; real-axis convergence supplies the
uniqueness data.

### 5.1 Moving-height check without differentiating at the origin

The same first-trace gate can be verified without presupposing the product
derivative in (5.12).  Put `s_j=1/L_j`.  For an even difference
`d_j=f_j-p_j`,

\[
 \widehat d_j(is_j)-\widehat d_j(0)
 =\int d_j(x)\{\cosh(s_jx)-1\}\,dx.                    \tag{5.16}
\]

On `|x|<=L_j/2`, `cosh(s_jx)-1<=C s_j^2x^2`, with one
absolute constant `C`.  Hence

\[
 |\widehat d_j(is_j)-\widehat d_j(0)|
 \le {C\over\sqrt{80}}s_j^2L_j^{5/2}\|d_j\|_2
 =O(s_j^2).                                           \tag{5.17}
\]

The convergent anchor two-jet alone would **not** imply the corresponding
moving-height estimate: on an expanding interval, two signed moments do not
control the `cosh(x/L_j)-1` weight.  For the source anchor the estimate
instead follows from its proved comparison with `K` and the weighted Fourier
tail.  Put

\[
 w_j(x)=\cosh(x/L_j)-1,
 \qquad
 C_w^2=\int_{-1/2}^{1/2}(\cosh y-1)^2\,dy.             \tag{5.17a}
\]

For the centered source modes
`phi_n(x)=(-1)^n L_j^(-1/2)exp(2*pi*i*n*x/L_j)`, direct
integration gives, for `n!=0`,

\[
 \int_{-L_j/2}^{L_j/2}\phi_n(x)w_j(x)\,dx
 ={2\sqrt {L_j}\sinh(1/2)\over1+4\pi^2n^2}.           \tag{5.17b}
\]

Write `c_n=<phi_n,K>`.  The locked derivative estimate
`sum_n(2*pi*n/L_j)^2|c_n|^2<=C_*^2` and weighted
Cauchy--Schwarz give

\[
 \left|\int (I-P_{N_j})K(x)w_j(x)\,dx\right|
 \le {C_*\sinh(1/2)L_j^{3/2}
       \over\sqrt {40}\,\pi^3N_j^{5/2}}.              \tag{5.17c}
\]

Also `||w_j||_2=C_w sqrt(L_j)`, and
`w_j(x)<=C_0 x^2/L_j^2` on the source interval for one absolute
constant `C_0`.  With
`M_2(K)=int_R x^2|K(x)|dx<infinity`, the decomposition

\[
 p_j-K=P_{N_j}(f_{\lambda_j}-K)-(I-P_{N_j})K
\]

therefore yields

\[
 \begin{aligned}
 |\widehat p_j(is_j)-\widehat p_j(0)|
 &\le {C_0M_2(K)\over L_j^2}
   +C_w\sqrt {L_j}\,\mathcal A_{\lambda_j}
   +{C_*\sinh(1/2)L_j^{3/2}
       \over\sqrt {40}\,\pi^3N_j^{5/2}}\\
 &=O(L_j^{-2}).                                       \tag{5.17d}
 \end{aligned}
\]

The last line uses the locked
`mathcal A_lambda=O(lambda^(-1/2))` and (5.1).  Thus (5.17),
(5.17d), and `widehat(f_j)(0)->Xi(0)/4` yield

\[
 0\le\log{\widehat f_j(is_j)\over\widehat f_j(0)}
 =O(s_j^2).                                           \tag{5.18}
\]

The lower sign in (5.18) follows from the real-zero product and also confirms
that no hidden sign choice has entered.  Term by term,

\[
 \log(1+s_j^2/\rho^2)
 \ge {s_j^2\over\rho^2+s_j^2},                       \tag{5.19}
\]

so (5.18) implies `S_j(s_j)=O(1)`, and monotonicity gives
`S_j(b)<=S_j(s_j)=O(1)` for every fixed `b>s_j`.  This reproduces (5.13)
and explicitly handles the possible-origin-zero issue: (5.11) rules such a
zero out before the ratio in (5.18) is formed.

Theorem 5.1 is a new synthesis of already-proved anchor and determinant
facts.  Its only unproved source inputs are the common unbounded signs (5.4)
and the polylogarithmic solve bound (5.8).

## 6. A fixed-height quantitative full-state rate

There is a second route which uses a complete `L2` ground comparison but at
a much weaker rate than equation (5.2).  In centered logarithmic coordinates
`x in [-L/2,L/2]`, put

\[
 \mathcal M_f(s)=\int_{-L/2}^{L/2}f(x)e^{sx}\,dx.        \tag{6.1}
\]

The exact evaluation norms are

\[
 I_0(s)=\int_{-L/2}^{L/2}e^{2sx}dx
       ={\sinh(sL)\over s},                             \tag{6.2}
\]

\[
\begin{aligned}
 I_2(s)&=\int_{-L/2}^{L/2}x^2e^{2sx}dx\\
 &=\left({L^2\over4s}+{1\over2s^3}\right)\sinh(sL)
   -{L\over2s^2}\cosh(sL),
 \qquad I_2(s)\le {L^2\over4}I_0(s).                   \tag{6.3}
\end{aligned}
\]

Thus, for `d=f-p`,

\[
 |\mathcal M_d(s)|\le\sqrt{I_0(b)}\|d\|_2,
 \qquad
 |\mathcal M_d'(s)|\le{L\over2}\sqrt{I_0(b)}\|d\|_2
                                                               \tag{6.4}
\]

uniformly on `[a,b]`.

### Theorem 6.1 (height-specific state rate)

Let `p_j` be comparison states whose transforms and first `s`-derivatives
converge uniformly on `[a,b]` to `Xi(is)/4` and its derivative.  Let `f_j`
be nonzero scalar representatives of the finite simple-even ground lines,
chosen so that

\[
 \|f_j-p_j\|_2\le\varepsilon_j.                         \tag{6.5}
\]

If

\[
 \boxed{L_j\sqrt{I_{0,j}(b)}\,\varepsilon_j
        \longrightarrow0,}                             \tag{6.6}
\]

then the normalized ground determinants obey (3.5)--(3.6).  Since

\[
 \sqrt{I_{0,j}(b)}=O_b(\lambda_j^b),                    \tag{6.7}
\]

the simpler condition

\[
 \boxed{(\log\lambda_j)\lambda_j^b\varepsilon_j
        \longrightarrow0}                              \tag{6.8}
\]

is sufficient.

**Proof.**  The target transform is positive and bounded away from zero on
`[a,b]`.  Equations (6.4)--(6.6) show that the ground transforms and their
first derivatives converge uniformly to the same target.  For all large
`j` the ground transforms are therefore also bounded away from zero, and

\[
 {\mathcal M_{f_j}'\over\mathcal M_{f_j}}
 -{\mathcal M_{p_j}'\over\mathcal M_{p_j}}
 \longrightarrow0                                      \tag{6.9}
\]

uniformly.  The weighted profile integrand is exactly the difference of
these logarithmic derivatives.  The comparison transforms converge in
`C^1`, so (3.6) follows.  Theorem 3.1 then gives (3.5).  Formula (6.7)
follows from `L=2 log(lambda)` and (6.2). \(\square\)

For the exact Feshbach ground line, let

\[
 p_j=c_j\kappa_j,qquad
 f_j=c_j(\kappa_j-z_{\mu_j}).                        \tag{6.10}
\]

Then

\[
 \varepsilon_j=c_j\|z_{\mu_j}\|
 \le c_j\|(A_j-U_jI)^{-1}b_j\|.                       \tag{6.11}
\]

The projected norms `c_j` tend to a positive finite constant.  Hence a bound

\[
 \|(A_j-U_jI)^{-1}b_j\|=O(\lambda_j^{-\gamma})
 \quad(\gamma>0)                                      \tag{6.12}
\]

would be sufficient after fixing any `0<a<b<min(gamma,1/2)`.  Neither
(6.12) nor the required unbounded shifted signs are presently proved.

The projection part is different.  The established
`O(lambda^(-1/2))` projection error, inserted in (6.8), tends to zero for
every fixed `b<1/2`.  Thus the unresolved rate in Theorem 6.1 is entirely
the actual ground-line correction, not the prolate projection.

## 7. Exact endpoint-gate countermodel

The left endpoint in Theorem 3.1 supplies normality, but it does not identify
the limit by itself.  This failure already occurs for equal-rank even
real-rooted polynomials with rational data.

Take

\[
 a={1\over8},\qquad b={1\over4},                         \tag{7.1}
\]

and the two half-paired root-square multisets

\[
 X_+=\left\{{1\over32},{1\over8}\right\},
 \qquad
 X_-=\left\{{7\over128},{1\over16}\right\}.            \tag{7.2}
\]

For `r_x=(x+a^2)/(x+b^2)`, direct rational arithmetic gives

\[
 \{r_x:x\in X_+\}=\left\{{1\over2},{3\over4}\right\},
 \qquad
 \{r_x:x\in X_-\}=\left\{{3\over5},{5\over8}\right\}.
                                                               \tag{7.3}
\]

Therefore both normalized determinants have exactly the same endpoint
ratio

\[
 \prod_{x\in X_+}r_x
 =\prod_{x\in X_-}r_x={3\over8}.                        \tag{7.4}
\]

They have the same finite paired rank, but their anchor profiles are

\[
 S_+(b)=16,
 \qquad
 S_-(b)={248\over15}.                                  \tag{7.5}
\]

Thus their normalized determinants are different.  Both families pass the
same positive endpoint-ratio/normal-family gate, yet even their first anchor
traces disagree.  This determinant-class countermodel is not claimed to be
an arithmetic Weil matrix.  It proves that the exponential compensation at
one pair of heights cannot replace the growing source-value mesh or another
uniqueness-set condition.

## 8. Exact remaining source obligation

The height-profile branch now has two strictly source-reconstructible
options on one unbounded schedule.

1. Prove the simple-even finite ground hypotheses and the node estimates
   (3.4) through the exact response formula (3.2), or prove the finite graph
   products (4.6).
2. Alternatively, prove the strict shifted signs and the polylogarithmic
   bound (5.8).  This already closes the determinant limit by Theorem 5.1.
   The stronger positive-power decay (6.12) also works on any fixed height
   interval below that exponent.

Current prolate projection, scalar quadratic-energy cancellation, endpoint
response positivity, and finite pilot inverses prove neither option.  In
particular, positivity of `A`, the exact exponential ratio at only one pair
of heights, or agreement at finitely many fixed nodes does not control the
BV quantity (2.4).  The new reductions lower and localize the target; they
do not supply the missing arithmetic estimate.
