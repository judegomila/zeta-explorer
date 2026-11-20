# Signed-shift admission versus the collapsing odd floor

Status: exact conditional factor audit, necessary-condition theorem, and
finite-dimensional obstruction models.  This note does not prove that the
nontrivial zeros are on the critical line, does not prove either finite Weil
sector positive on an unbounded schedule, does not prove equation (5.2) of
`DIRECT_RH_ATTACK.md`, and does not prove a determinant limit.  The formal
project state remains `P0_INVALIDATED`.

## 1. Locked objects and the only branch considered here

Put

\[
 L=2\log\lambda,
 \qquad p_N=P_NC_\lambda K,
 \qquad a_N=\|p_N\|_2,
 \qquad \kappa_N=p_N/a_N,
\]

and suppose `a_N>0`.  The state `kappa_N` is real and inversion even.  In
logarithmic coordinates it is therefore a real even function.  Write

\[
 F_N(z)=\int_{\mathbb R}\kappa_N(x)e^{-izx}\,dx.
\]

For a nontrivial zero `rho=beta+i gamma`, retain the locked parameter

\[
 s_\rho=\gamma+i(1/2-\beta).
\]

Every zero below is counted with its algebraic multiplicity.  The multiset
also retains both ordinate signs: on the critical line,
`1/2+i gamma` and `1/2-i gamma` are separate multiset entries.  This is
independent of the two evaluation slots attached to each entry.

The argument in Sections 2--4 is conditional on the all-critical-line
branch.  It is a consistency test that any successful bridge must survive;
it is not an input that may be assumed in an unconditional proof.

## 2. Exact factor two, including multiplicity

The absolutely convergent spectral form and the positive paired sampling
seminorm are, with the locked conventions,

\[
 q_N:=\langle\kappa_N,Q\kappa_N\rangle
 =\sum_\rho
   F_N(s_\rho)\overline{F_N(\overline{s_\rho})},          \tag{2.1}
\]

\[
 U_Z:=\|\kappa_N\|_{\mathfrak Z}^2
 =\sum_\rho\left(
      |F_N(s_\rho)|^2+|F_N(\overline{s_\rho})|^2
   \right).                                                \tag{2.2}
\]

On the all-critical-line branch, `s_rho=overline{s_rho}=gamma` is real.
Because `kappa_N` is real and even, `F_N(gamma)` is real.  Thus each
occurrence of a zero of multiplicity `m` contributes

\[
 mF_N(\gamma)^2
 \quad\hbox{to (2.1)},
 \qquad
 2m|F_N(\gamma)|^2
 \quad\hbox{to (2.2)}.
\]

Summing the same multiset gives the exact identity

\[
 \boxed{q_N={U_Z\over2}={\epsilon_N\over2a_N^2}\ge0,}
 \qquad
 \epsilon_N=\|R_N\|_{\mathfrak Z}^2.                     \tag{2.3}
\]

There is no further factor from the `+/- gamma` pair: both (2.1) and (2.2)
already sum those two multiset entries.  The factor two in (2.3) comes only
from the two coincident evaluation slots retained by the paired seminorm.
Consequently the signed Rayleigh scalar has no cancellation advantage over
positive zero sampling on this branch.

Off the critical line, the conjugated reflected evaluation in (2.1) is not
an absolute square, so (2.3) is unavailable.  Only the unconditional bound
`|q_N|<=U_Z` remains.

## 3. Necessary signed-shift admission inequality

Let

\[
 \mu_{-,N}=\lambda_{\min}(Q_{N,-})
\]

be the exact odd-sector floor.  Suppose a real upper shift `U_L` is proposed
with

\[
 q_N\le U_L,
 \qquad Q_{N,-}-U_LI>0.                                  \tag{3.1}
\]

The second inequality is equivalent to `U_L<mu_(-,N)`.  Hence every
Rayleigh-admitted shift satisfying (3.1) necessarily obeys

\[
 \boxed{q_N\le U_L<\mu_{-,N},\qquad q_N<\mu_{-,N}.}       \tag{3.2}
\]

On the all-critical-line branch, (2.3) also forces `U_L>=0` and

\[
 U_Z<2\mu_{-,N}.                                          \tag{3.3}
\]

If the positive sampling bound itself is used as the shift, `U_L=U_Z`, the
stronger requirement is `U_Z<mu_(-,N)`.  Choosing the signed value
`U_L=q_N` avoids only that factor-two loss: proving
`Q_(N,-)-q_N I>0` is exactly the unresolved relative odd-floor theorem, not
a way around it.  A separately proved Ritz upper bound below `q_N` would not
be covered by this necessary condition; the present note audits specifically
the proposed signed-Rayleigh admission route.

## 4. Exact fixed-degree odd annihilators

Put `alpha=2*pi/L`.  For `d>=1`, define the exact coefficients

\[
 b_{d,n}={2(-1)^{d-n}n\over(d-n)!(d+n)!},
 \qquad
 B_d^2=\sum_{n=1}^d b_{d,n}^2
 ={2d^2(4d)!\over(4d-1)(2d)!^4},                          \tag{4.1}
\]

\[
 f_d={1\over B_d}\sum_{n=1}^d b_{d,n}e_n^- .             \tag{4.2}
\]

The residue identity

\[
 \sum_{n=1}^d{b_{d,n}n\over z^2-n^2}
 ={1\over\prod_{m=1}^d(z^2-m^2)}                         \tag{4.3}
\]

gives the locked transform

\[
 \widehat f_d(t)=
 {2\sqrt{2/L}\,\alpha^{2d-1}\sin(Lt/2)
  \over B_d\prod_{m=1}^d(t^2-\alpha^2m^2)}.              \tag{4.4}
\]

The centered endpoint phase is already present in the basis `e_n^-`; no
additional `(-1)^n` may be inserted.  On the all-critical-line branch,

\[
 \boxed{
 \langle f_d,Q_\lambda f_d\rangle
 ={8\alpha^{4d-2}\over LB_d^2}
 \sum_\rho {\sin^2(\gamma_\rho L/2)
  \over\prod_{m=1}^d(\gamma_\rho^2-\alpha^2m^2)^2}
 =O_d(L^{-(4d-1)}).}                                     \tag{4.5}
\]

Apparent carrier collisions are removable.  For `d=1`, `f_1=e_1^-` and
(4.5) reads

\[
 q_1(L)={8\alpha^2\over L}
 \sum_\rho{\sin^2(\gamma_\rho L/2)
 \over(\gamma_\rho^2-\alpha^2)^2},                      \tag{4.6}
\]

\[
 q_1(L)={16\pi^2\over L^3}
 \sum_\rho{1-\cos(\gamma_\rho L)\over\gamma_\rho^4}
 +O(L^{-5}).                                              \tag{4.7}
\]

Let `N=N(L)->infinity`.  For each fixed `d`, the unit vector `f_d` belongs to
the odd compression once `N>=d`, so min--max and (4.5) give

\[
 \mu_{-,N}\le\langle f_d,Q_\lambda f_d\rangle
 \le C_dL^{-(4d-1)}                                      \tag{4.8}
\]

for a constant `C_d` and all sufficiently large `L`.  Combining (3.2) and
(4.8), every admitted nonnegative upper shift obeys

\[
 0\le q_N\le U_L<\mu_{-,N}
 \le C_dL^{-(4d-1)}.                                    \tag{4.9}
\]

for every fixed `d`, eventually.  Equivalently, for every fixed `A>0`,

\[
 q_N=O_A(L^{-A}),\qquad U_L=O_A(L^{-A}),\qquad
 U_Z=O_A(L^{-A}).                                        \tag{4.10}
\]

Thus any genuinely fixed inverse-power scale, for example an eventual lower
bound `U_L>=cL^{-A}` with `c>0`, is incompatible with admission.  Merely
proving one upper estimate `U_L=O(L^{-A})` is also insufficient, because the
actual shift might need to be much smaller.

Superpolynomial absolute decay is still not enough.  The exact comparison
that remains is

\[
 \boxed{q_N<\mu_{-,N}}
 \quad\Longleftrightarrow\quad
 \boxed{\|R_N\|_{\mathfrak Z}^2
       <2a_N^2\mu_{-,N}}                                 \tag{4.11}
\]

on the all-critical-line branch.  The right side compares two quantities
that may both be superpolynomially small; neither absolute rate determines
their ratio.

## 5. Historical baseline and the present polynomial-schedule sampler

On `N=ceil(lambda*L^3)`, the baseline projection theorem used in the live
shift audit gave only

\[
 E_N:=\|R_N^{\rm proj}\|_2=O(\lambda^{-1/2}).             \tag{5.1}
\]

After the compact-BV sampling conversion and the separate projected-state
norm lower bound, that baseline route has the scale

\[
 U_Z=O(\lambda L^3E_N^2)+o(1)=O(L^3).                    \tag{5.2}
\]

This is an upper-bound limitation, not evidence that the actual shift grows.
At the level of this conversion, obtaining `U_Z=O(L^{-M})` requires

\[
 E_N=O\!\left(
   \lambda^{-1/2}L^{-(M+3)/2}
 \right).                                                 \tag{5.3}
\]

Thus meeting (4.10) for every fixed `M` requires a log-superalgebraic
improvement over that baseline rate, or a new direct paired-zero sampling
theorem.

The separate new derivation in
`notes/FIRST_PROLATE_CORRECTION_PROJECTION_GAIN.md` identifies the first
Poisson-compatible prolate correction and obtains, non-effectively,

\[
 E_N=O((\lambda L^2)^{-1}),
 \qquad U_Z=O((\lambda L)^{-1})+o(d_6)
             =O((\lambda L)^{-1}).                       \tag{5.4}
\]

This does satisfy every fixed logarithmic power target in (5.3), and it
closes the earlier `U_Z=o(1)` projection-admission condition asymptotically.
It does not compare the resulting exponentially small numerator with the
still smaller possible odd floor.  Equation (4.11), rather than the old
absolute projection rate, is therefore the surviving obstruction.

## 6. Exact two-dimensional obstruction models

These models are logical tests, not arithmetic models of the source Weil
matrix.  They show that radicality, positivity, a small projection error,
and even mild form-norm control do not imply the relative inequality (4.11).

For `epsilon>0` and `a>0`, on a two-dimensional even space put

\[
 K=\binom1\epsilon,
 \qquad p=\binom10,
 \qquad R=K-p=\binom0\epsilon,
\]

\[
 Q_+=a
 \begin{pmatrix}
  1&-\epsilon^{-1}\\
  -\epsilon^{-1}&\epsilon^{-2}
 \end{pmatrix}
 =a\binom1{-\epsilon^{-1}}
      \begin{pmatrix}1&-\epsilon^{-1}\end{pmatrix}.      \tag{6.1}
\]

Then

\[
 Q_+\ge0,\qquad Q_+K=0,\qquad
 \|R\|_2=\epsilon,
 \qquad {\langle p,Q_+p\rangle\over\|p\|_2^2}=a,
 \qquad \|Q_+\|=a(1+\epsilon^{-2}).                     \tag{6.2}
\]

If the paired sampling Gram is represented by `G_+=2Q_+`, then `G_+K=0`
and the normalized projected state has exactly `U_Z=2a` and `q=U_Z/2=a`,
matching (2.3).  Append a one-dimensional odd block `[mu_L]`.

**Model A (small projection error does not make the shift small).**  Take

\[
 \epsilon=e^{-L/4}=\lambda^{-1/2},
 \qquad a=1,
 \qquad \mu_L=e^{-L^2}.                                  \tag{6.3}
\]

The projection error tends to zero and
`||Q_+||=1+lambda=O(lambda)`, but `q=1>mu_L`.  No shift can
satisfy `q<=U_L<mu_L`.

**Model B (superpolynomial decay does not give relative admission).**  Take

\[
 \epsilon=e^{-L/4},
 \qquad a=e^{-L},
 \qquad \mu_L=e^{-2L}.                                   \tag{6.4}
\]

Now `q=e^(-L)` and `U_Z=2e^(-L)` are smaller than every fixed inverse
power of `L`, while

\[
 \|Q_+\|=e^{-L}+e^{-L/2}\longrightarrow0.
\]

Nevertheless `q>mu_L`, so admission again fails.  Absolute decay, even with
a vanishing operator norm, does not replace the relative odd-floor estimate.

## 7. Exact remaining lemma

The signed-shift route is reduced, but not closed.  On one source-assembled
unbounded schedule it must prove the actual strict comparison

\[
 q_N<\mu_{-,N},                                           \tag{7.1}
\]

or a stronger source-specific shifted odd Schur inequality implying it,
while retaining the complete pole--archimedean--minus-prime cancellation.
The even-complement floor, the vector-specific shifted solve in equation
(5.2), and locally uniform determinant convergence remain separate open
obligations.
