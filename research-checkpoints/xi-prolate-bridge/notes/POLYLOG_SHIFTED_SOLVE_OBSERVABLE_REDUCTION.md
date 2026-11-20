# Polylogarithmic shifted solve: scalar and observable reductions

## 0. Scope and exact conclusion

This checkpoint-0.59 note attacks the still-missing estimate

\[
 \tau_U=\|(A-U I)^{-1}b\|=O(L^{-5/2}),
 \qquad L=2\log\lambda,                              \tag{0.1}
\]

for the exact source matrix and the projected, source-normalized prolate
anchor.  It does **not** prove (0.1).  It gives three exact conclusions.

1. If

   \[
   d(s)=q-s-\langle b,(A-sI)^{-1}b\rangle,
   \]

   then

   \[
   \boxed{\tau_U^2=-d'(U)-1.}                         \tag{0.2}
   \]

   Thus (0.1) is exactly the endpoint derivative claim
   `d'(U)=-1+O(L^(-5))`.  The source identities currently available do not
   prove that derivative estimate.

2. The Euclidean norm in (0.1) is stronger than the determinant argument
   needs.  This proof needs only uniform smallness of the ground correction
   under bounded real Fourier evaluation.  Under the two strict sector
   signs, define the forcing energy `E_U` and bounded-real-frequency
   leverage `L_T(U)` in Section 3.  For one fixed interval on which `Xi` is
   positive, the upper-shift certificate

   \[
   \boxed{a^2 E_U\mathcal L_T(U)\longrightarrow0}      \tag{0.3}
   \]

   implies that exact observable gate and transfers the projected anchor to
   the actual source ground transform uniformly on that interval.  Source
   real-rootedness then supplies the complete inverse-square trace and
   locally uniform determinant convergence.  No origin second-moment bound
   is needed.  The certificate (0.3) is an oriented alternative, not a
   norm-equivalent reformulation of (0.1).

3. Positivity at two isolated real points is not enough to bound the
   complete inverse-square trace.  Section 5 gives an all-real-zero even
   polynomial counterexample.  Uniform convergence on the intervening
   positive interval, or an independently proved zero-free interval, is
   essential.  The exterior Fourier lattice does not repair the two-point
   shortcut.

The source arithmetic estimate (0.3), as well as the two strict sector
signs on one unbounded schedule, remains unproved.  This note uses no zeta
zero table, no global Weil positivity assumption, and no numerical
extrapolation.  It proves no unconditional determinant limit or equation
(5.2) of `DIRECT_RH_ATTACK.md`.  The formal project state remains
`P0_INVALIDATED`.

## 1. Locked finite notation

Use the source logarithmic interval and measure

\[
 I_\lambda=[-L/2,L/2],\qquad dx,qquad L=2\log\lambda,
\]

and the source Fourier convention

\[
 \widehat v(z)=\int_{-L/2}^{L/2}v(x)e^{-izx}\,dx.     \tag{1.1}
\]

Every function is zero-extended outside `I_lambda`.  Inversion is the
reflection `Jv(x)=v(-x)`.  The arithmetic comparison state is first
evenized and then projected:

\[
 p=P_Nk_\lambda^+=a\kappa,
 \qquad \|\kappa\|=1,
 \qquad a=\|P_Nk_\lambda^+\|.                        \tag{1.2}
\]

The scalar `a` is the source normalization; it is not replaced by unit
normalization of `h_lambda`.  On schedules with `N/L^2 -> infinity`, the
proved anchor theorem gives

\[
 a\longrightarrow a_\infty\in(0,\infty),
 \qquad 4\widehat p(t)\longrightarrow\Xi(t)           \tag{1.3}
\]

locally uniformly for real `t`.

Decompose the exact inversion-even source matrix relative to the unit
anchor and its even orthogonal complement `K`:

\[
 Q_+=\begin{bmatrix}q&b^*\\ b&A\end{bmatrix}
 \quad\hbox{on}\quad \mathbb C\kappa\oplus\mathcal K. \tag{1.4}
\]

The exact source matrix is real symmetric in the locked centered basis, and
the comparison state is real even.  Choose `kappa` real; then `b,A,z_mu`
and the representatives `p,f` below are all real and inversion even.  Thus
their transforms are real on the real axis.

Let `U` be a rigorous variational upper bound for the lowest even
eigenvalue and assume the two strict signs

\[
 B:=A-U I\succ0,
 \qquad Q_--U I\succ0.                               \tag{1.5}
\]

If `mu` is the actual lowest eigenvalue, (1.5) makes it the simple global
inversion-even ground value and `mu<=U`.  Put

\[
 h=U-\mu\geq0,
 \qquad z_\mu=(A-\mu I)^{-1}b=(B+hI)^{-1}b.           \tag{1.6}
\]

The coefficient-normalized representative of the source ground line is

\[
 f=a(\kappa-z_\mu),\qquad f-p=-az_\mu.                \tag{1.7}
\]

All entries of `Q`, hence `q,b,A`, are formed only after the pole,
archimedean, and **minus-prime** blocks have been combined.  None of the
reductions below bounds a block separately.

## 2. Exact scalar derivative reduction

For real `s<min sigma(A)`, define the scalar Feshbach function

\[
 d(s)=q-s-\langle b,(A-sI)^{-1}b\rangle.              \tag{2.1}
\]

The ground equation is `d(mu)=0`.  Differentiating the resolvent, with no
finite difference or fitted eigenvalue, gives

\[
 \begin{aligned}
 d'(s)
   &=-1-\langle b,(A-sI)^{-2}b\rangle,\\
 d''(s)
   &=-2\langle b,(A-sI)^{-3}b\rangle<0
 \end{aligned}                                       \tag{2.2}
\]

when `b` is nonzero.  Evaluating at `s=U` proves (0.2):

\[
 \boxed{
 \|(A-U I)^{-1}b\|^2=-d'(U)-1.}                     \tag{2.3}
\]

This is an exact one-variable reformulation of the missing norm, but it is
not an estimate.  Concavity points in the wrong direction for obtaining an
upper bound from values of `d`.  Since `d(mu)=0` and `mu<U`,

\[
 d'(U)\leq {d(U)-d(\mu)\over U-\mu}={d(U)\over U-\mu}. \tag{2.4}
\]

Thus a secant estimate gives a lower bound on `-d'(U)`, not the required
upper bound.  Small error in the ground value or in `d(U)` therefore cannot
be silently converted into (0.1).  A complement pole close to `U`, with a
small residue, can be nearly invisible in `d(U)` while dominating
`d'(U)`.

## 3. The exact bounded-frequency graph observable

For real `t`, let

\[
 \ell_t(v)=\widehat v(t).
\]

On the inversion-even space this is the cosine-evaluation functional.  Let
`ell_t^*` be its Riesz vector and remove its anchor component:

\[
 g_t=P_\mathcal K\ell_t^*.                            \tag{3.1}
\]

Because `z_mu` belongs to `K`,
`ell_t(z_mu)=<g_t,z_mu>`.  Define the two one-inverse quadratic forms

\[
 E_U=\langle b,B^{-1}b\rangle,
 \qquad
 \mathcal L_T(U)=\sup_{|t|\leq T}
       \langle g_t,B^{-1}g_t\rangle.                 \tag{3.2}
\]

These are source-reconstructible from `q,b,A,U` and the exact Fourier
evaluation vectors.  They do not use a cached ground vector.  Notice the
distinction

\[
 E_U=\langle b,B^{-1}b\rangle,
 \qquad
 \tau_U^2=\langle b,B^{-2}b\rangle.                  \tag{3.3}
\]

The exact determinant observable is

\[
 \Omega_T
 :=a\sup_{|t|\leq T}|\ell_t(z_\mu)|
 =\sup_{|t|\leq T}|\widehat f(t)-\widehat p(t)|.     \tag{3.4}
\]

The norm hypothesis (0.1) implies `Omega_T -> 0`, since
`||ell_t||<=sqrt(L)`, `a` stays bounded, and `||z_mu||<=tau_U`.  The reverse
implication is false, as Section 6 shows.

### Lemma 3.1 (shift-monotone graph Cauchy bound)

Under `B>0` and `h>=0`,

\[
 \boxed{
 \sup_{|t|\leq T}|\ell_t(z_\mu)|
 \leq\sqrt{E_U\mathcal L_T(U)}.}                    \tag{3.5}
\]

**Proof.**  Since `B` commutes with `B+hI`,

\[
 \begin{aligned}
 |\ell_t(z_\mu)|
 &=|\langle B^{-1/2}g_t,
        B^{1/2}(B+hI)^{-1}b\rangle|\\
 &\leq \langle g_t,B^{-1}g_t\rangle^{1/2}
 \left\langle b,{B\over(B+hI)^2}b\right\rangle^{1/2}.
 \end{aligned}                                       \tag{3.6}
\]

For every positive scalar `x`, `x/(x+h)^2<=1/x`.  Functional calculus
therefore bounds the second factor by `sqrt(E_U)`.  Take the supremum in
`t`.  \(\square\)

Combining (1.7) and (3.5) yields the normalization-preserving estimate

\[
 \boxed{
 \sup_{|t|\leq T}|\widehat f(t)-\widehat p(t)|
 \leq a\sqrt{E_U\mathcal L_T(U)}.}                   \tag{3.7}
\]

The generic bound `||ell_t||<=sqrt(L)` would replace the right side by
`a*sqrt(L)*tau_U` and demand `tau_U=o(L^(-1/2))`.  Equation (3.7) retains
the orientation of the arithmetic forcing relative to the actual
bounded-frequency evaluation family.

## 4. Conditional determinant transfer from one interval

### Theorem 4.1 (one-window observable bridge)

Consider an unbounded source schedule with

\[
 \lambda_j\longrightarrow\infty,
 \qquad {N_j\over L_j^2}\longrightarrow\infty.       \tag{4.1}
\]

Assume at every sufficiently large stage:

1. the exact matrix and source-normalized anchor of Section 1 are used;
2. the two strict signs (1.5) hold; and
3. for one fixed `T>0` on which `Xi(t)>0` for `|t|<=T`, the exact
   observable satisfies

   \[
   \Omega_{T,j}\longrightarrow0.                    \tag{4.2}
   \]

   A sufficient upper-shift condition for this is

   \[
   \boxed{
   a_j^2E_{U,j}\mathcal L_{T,j}(U_j)\longrightarrow0.} \tag{4.3}
   \]

Such a positive interval exists because `Xi(0)>0` and `Xi` is continuous;
this invokes no zero table.  Also the locked real formula gives
`Xi(ib)>0` for `0<b<1/2`.  Then for every such fixed `b`,

\[
 \boxed{
 \Xi(ib){\widehat f_j(z)\over\widehat f_j(ib)}
 \longrightarrow\Xi(z)}                              \tag{4.4}
\]

locally uniformly on the whole complex plane.

**Proof.**  Equations (1.3) and (4.2) give

\[
 4\widehat f_j(t)\longrightarrow\Xi(t)              \tag{4.5}
\]

uniformly on `[-T,T]`.  Shrinking `T` once if needed, compactness gives a
positive lower bound for `Xi` there.  Hence `widehat(f_j)` is positive and
zero-free on the whole interval for all sufficiently large `j`.

The signs make the finite ground line simple and globally even.  The exact
source commutator then gives nonzero boundary normalization, and source
Theorem 5.10 applies in the shifted quotient metric.  Thus every zero of
`widehat(f_j)` is real.  Its complete half-paired multiset `R_j` contains
both the finite self-adjoint quotient roots and every exterior Fourier
lattice root

\[
 {2\pi n\over L_j},\qquad |n|>N_j.                   \tag{4.6}
\]

There is no hidden exponential factor in the following ratio.  The source
transform is even and of order at most one.  Pairing the genus-one factors
at `rho` and `-rho` gives `1-z^2/rho^2`; evenness kills the remaining
linear exponential, and division by the value at zero kills the constant.
Since the entire interval is zero-free, every factor at `T` is positive:

\[
 {\widehat f_j(T)\over\widehat f_j(0)}
 =\prod_{\rho\in R_j}\left(1-{T^2\over\rho^2}\right).
                                                               \tag{4.7}
\]

Using `-log(1-x)>=x` and (4.5),

\[
 \sum_{\rho\in R_j}{1\over\rho^2}
 \leq-{1\over T^2}
       \log {\widehat f_j(T)\over\widehat f_j(0)}
 =O(1).                                             \tag{4.8}
\]

The complete exterior lattice is included in (4.7)--(4.8); (4.1) also
makes its separate trace
`L_j^2/(4*pi^2)*sum_(n>N_j)n^(-2)` tend to zero.

Equation (4.8) makes

\[
 H_j(z)={\widehat f_j(z)\over\widehat f_j(0)}
\]

a normal family on the whole plane, because its paired products are
bounded on every compact set by
`exp(|z|^2*sum_(rho in R_j)rho^(-2))`.  Equation (4.5) identifies every
subsequential limit with `Xi(z)/Xi(0)` on `[-T,T]` and hence everywhere by
the identity theorem.  Finally `Xi(ib)!=0` for `0<b<1/2` (the corresponding
classical xi argument lies strictly between `0` and `1/2`), so normalization
at `ib` gives (4.4).  \(\square\)

Condition (4.3) is the strongest source-reconstructible upper-shift
certificate obtained here.  It is sufficient for the logically weaker
observable (4.2), but neither the certificate nor the observable is claimed
to be norm equivalent to (0.1).  The origin-jet route can also be expressed
through separate leverages for `ell_0` and the projective Wronskian
`K_0*ell_2-K_2*ell_0`, but those extra hypotheses are unnecessary once the
whole positive real interval in (4.5) is available.

## 5. Why two isolated positive values do not suffice

Fix `T=1` and a target ratio `R>0`.  For `0<epsilon<1/2`, put

\[
 D_\epsilon=(1-\epsilon^{-2})
             (1-(2\epsilon)^{-2})>0.                \tag{5.1}
\]

For sufficiently small `epsilon`, `R/D_epsilon` belongs to `(0,1)`.  Choose
`c_epsilon>1` by

\[
 1-c_\epsilon^{-2}={R\over D_\epsilon}               \tag{5.2}
\]

and define

\[
 F_\epsilon(z)=
 \left(1-{z^2\over\epsilon^2}\right)
 \left(1-{z^2\over(2\epsilon)^2}\right)
 \left(1-{z^2\over c_\epsilon^2}\right).             \tag{5.3}
\]

This is an even polynomial, so there is no exponential factor at all.  All
its zeros are real, and

\[
 F_\epsilon(0)=1,
 \qquad F_\epsilon(1)=R>0,                            \tag{5.4}
\]

but its half-paired inverse-square trace is

\[
 \sum_{\rho>0}{1\over\rho^2}
 ={5\over4\epsilon^2}+{1\over c_\epsilon^2}
 \longrightarrow\infty.                              \tag{5.5}
\]

The two small root pairs produce two sign changes inside `(0,1)`, which
the endpoint values cannot see.

Appending the exterior product

\[
 E_{L,N}(z)=\prod_{n>N}
 \left(1-{z^2\over(2\pi n/L)^2}\right)               \tag{5.6}
\]

does not fix the shortcut.  If `2*pi*(N+1)/L>1`, then `E_(L,N)(1)>0`.
Replace `R` in (5.2) by `R/E_(L,N)(1)` and take `epsilon` still smaller.
The endpoint ratio remains `R`, the complete exterior lattice is present,
and (5.5) still diverges.

The valid repair is exactly the zero-free-segment hypothesis used in
Theorem 4.1.  If an even all-real-zero function has no zero in `[-T,T]` and
is positive there, then every factor in (4.7) lies in `(0,1)` and (4.8)
follows.  Two values alone do not establish that premise.

## 6. Strictness: a high-frequency shifted-solve model

The observable gate does not imply a small Euclidean shifted solve, even
under the two sector signs.  This subsection is only a finite-dimensional
strictness model; its matrix is not asserted to have the source Cauchy
arithmetic form.

Let `L=m`, `N=m^3`, and use the centered source modes

\[
 \phi_n(x)=(-1)^nL^{-1/2}e^{2\pi i n x/L},
 \qquad
 \chi_N={\phi_N+\phi_{-N}\over\sqrt2}.               \tag{6.1}
\]

Take `kappa=phi_0`,
`K=span{chi_1,...,chi_N}`, and `U=0`.  On the complement set

\[
 B\chi_N=\chi_N,
 \qquad B\chi_n=m^{20}\chi_n\quad(1\leq n<N),
 \qquad b=m\chi_N.                                   \tag{6.2}
\]

Set `q=0` and take the odd block to be the identity.  On the only active
two-dimensional plane the even matrix is

\[
 Q_+\big|_{\operatorname{span}\{\kappa,\chi_N\}}
 =\begin{bmatrix}0&m\\m&1\end{bmatrix},
                                                               \tag{6.3}
\]

while every spectator even direction has value `m^20`.

Then `B>0`, `Q_--U>0`, and

\[
 \tau_U=\|B^{-1}b\|=m\longrightarrow\infty.          \tag{6.4}
\]

The actual even ground value and correction are

\[
 \mu={1-\sqrt{1+4m^2}\over2}<0,
 \qquad
 z_\mu={2m\over1+\sqrt{1+4m^2}}\chi_N,               \tag{6.5}
\]

so even the correction norm tends to one rather than zero.

Nevertheless, for fixed `T` and `N>=TL/pi`, direct integration of the two
centered modes gives

\[
 \sup_{|t|\leq T}|\widehat\chi_N(t)|
 \leq {2\sqrt{2L}\over\pi N}.                        \tag{6.6}
\]

Here `E_U=m^2`.  The complete spectator contribution to the leverage is at
most `L/m^20`, because real Fourier evaluation has squared norm at most
`L`.  Therefore

\[
 E_U\mathcal L_T(U)
 \leq {8m^2L\over\pi^2N^2}+{m^2L\over m^{20}}
 ={8\over\pi^2m^3}+m^{-17}\longrightarrow0,          \tag{6.7}
\]

while `tau_U=m`.  Also `N/L^2=m -> infinity`.  The model proves that no
abstract reverse implication from either (4.2) or (4.3) to (0.1) exists.
Any source proof of (0.1), if one is sought, must use additional arithmetic
structure; the
determinant bridge itself only sees the observable (4.2).

## 7. Remaining source premise

The exact sufficient ground-transfer premise isolated here is
`Omega_T -> 0`.  A narrow source-reconstructible upper-shift certificate
is:

1. prove `A-U I>0` and `Q_--U I>0` on one unbounded schedule with
   `N/L^2 -> infinity`;
2. for one fixed positive `Xi` interval, prove

   \[
   a^2\langle b,(A-U I)^{-1}b\rangle
   \sup_{|t|\leq T}
   \langle P_\mathcal K\ell_t^*,
      (A-U I)^{-1}P_\mathcal K\ell_t^*\rangle=o(1).  \tag{7.1}
   \]

Both inverses in (7.1) are of the exact combined source complement.  The
condition is not established by residual size, a generic complementary
gap, finite pilot agreement, or the scalar derivative identity (2.3).
No current source estimate proves (7.1).
