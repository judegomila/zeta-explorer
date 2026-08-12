# Moving-label carrier coframe and defect right-inverse theorem

## 0. Outcome and exact claim boundary

Let

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 L=2\log\lambda,
\]

and let `E_N^+` be the centered even log-Fourier space with cosine rows
of angular frequencies

\[
 a_k={2\pi k\over L},\qquad 0\leq k\leq N.
\]

This note closes the defect-weighted carrier gate isolated in
`REAL_WINDOW_TO_ZERO_TAIL_CARRIER_TRANSFER_BARRIER.md` on an infinite
locked schedule.  More precisely, there are constants `C_N,C_0,c>0`, an
infinite sequence of odd integers `p_A`, and a fixed sufficiently large
constant `kappa` with the following properties.  If

\[
 \begin{split}
 A&\longrightarrow\infty,\qquad
 L_A=2\log(p_A/2)\in[A,A+1],\qquad \lambda_A=p_A/2,\\
 N_A&=\lceil C_N(A+1)^2\rceil,\qquad J_A=N_A+1,\\
 K_A&=\lceil\kappa L_A^3\log L_A\rceil,\qquad
 Q_A=J_A+K_A,
 \end{split}                                             \tag{0.1}
\]

then the actual zero-integral even prolate columns with raw labels

\[
 4,8,\ldots,4Q_A                                      \tag{0.2}
\]

map onto all of `E_(N_A)^+`.  After deflation by the actual label-four
physical anchor, the columns with labels `8,...,4Q_A` map onto the whole
anchor complement.  For the exact exterior-defect metric `D`, their
basis-invariant minimum-cost right inverse satisfies

\[
 \boxed{
 {\cal R}_D(\kappa_A^\perp;Q_A,\lambda_A)
 \leq
 \exp\left\{-{2\lambda_A^2\over L_A}
             +C_0L_A^4\log L_A\right\}=o(1).}          \tag{0.3}
\]

In particular, for the nonzero two-zero carrier section `J_(L_A)` from
the barrier note,

\[
 \boxed{
 J_{L_A}\subseteq\operatorname {ran}W_{Q_A,\lambda_A},
 \qquad
 {\cal R}_D(J_{L_A};Q_A,\lambda_A)=o(1)=O(L_A).}        \tag{0.4}
\]

This is an absolute carrier statement for an actual allowed growing even
source prefix.  It is not a signed-orientation theorem.  It proves no
signed even or odd floor, no residual action estimate, no shifted solve,
no reducing or high-complement property, no equation (5.2) of
`DIRECT_RH_ATTACK.md`, no RH conclusion, and no Lambda bound.  The formal
project state remains `P0_INVALIDATED`.

The prefix in (0.2) is wide: its depth is `O(L^3 log L)`, whereas the
physical cutoff is `O(L^2)`.  The proof establishes wide-prefix
surjectivity.  It does **not** establish nonvanishing of the square
first-`J_A` determinant `D_+(p)`.

## 1. Frozen dependencies and conventions

The proof uses the following exact bytes.

| Dependency | SHA-256 |
|---|---|
| `notes/REAL_WINDOW_TO_ZERO_TAIL_CARRIER_TRANSFER_BARRIER.md` | `a2dc20c00fcc75f8696da591331554728c41a8d937f6ce3eab5eeff33cd6c73d` |
| `notes/FIXED_EVEN_PREFIX_ARITHMETIC_SYNTHESIS_THEOREM.md` | `1ef5e05f1a17ecf74e8337d16e799f81e02470ae71dc15d2b7f4fb96d42df0f4` |
| `notes/GEVREY_PROLATE_EXPONENTIAL_REMAINDER_AUDIT.md` | `384800a51ab1f9db5e1e4bb1f9c44a44de16daa0fd8c28761d0fcfa692d4259c` |
| `notes/GROWING_WINDOW_THEOREM.md` | `dad6b0a878b7eba21cbc7aa8049cf3bf89a38df766cc157a87c416e79a721ac7` |
| `notes/POLYNOMIAL_XI_RADICAL_TOWER_COVARIANCE_FLOOR_OBSTRUCTION.md` | `6281a93e4320e6c25fa09fdf942b94147a9b6aa1706b6c34dd079074d2f0ee98` |
| `P0_NORMALIZATION_AUDIT.md` | `37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df` |

The source Fourier convention is

\[
 ({\cal F}f)(y)=\int_{\mathbb R}f(x)e^{2\pi ixy}\,dx,   \tag{1.1}
\]

whereas log-Fourier angular frequency uses `exp(-itx)`.  The two are not
interchanged below.

Let `f_(n,lambda)` be the unit source prolate mode on
`[-lambda,lambda]`, zero extended, with source phase positive at zero.
Write

\[
 I_n=\int_{-\lambda}^{\lambda}f_{n,\lambda}(x)\,dx,
 \qquad d_n=1-\chi_{n,\lambda}^2.                       \tag{1.2}
\]

For `n` divisible by four, the finite Fourier phase is positive and

\[
 I_n=\chi_{n,\lambda}f_{n,\lambda}(0).                 \tag{1.3}
\]

The exact zero-integral plus columns are

\[
 c_m=e_{4m}+\rho_me_0,
 \qquad \rho_m=-{I_{4m}\over I_0},\qquad m\geq1.       \tag{1.4}
\]

Let `T_(lambda,N)` denote arithmetic transform, exact inversion
evenization, restriction to the centered logarithmic interval, and
orthogonal projection to `E_N^+`.  Put

\[
 p_m=T_{\lambda,N}c_m.                                 \tag{1.5}
\]

The actual anchor is `p_1`, and

\[
 \kappa={p_1\over\|p_1\|}.                             \tag{1.6}
\]

It is nonzero eventually by the fixed label-four limiting theorem.

## 2. A locked grid separated from every Xi zero

This section chooses the schedule used in (0.1).  It does not assume RH.
Off-critical-line zeros are included in the separation argument.

Let `Xi(z)` be the entire angular completed-zeta factor used in the
polynomial--Xi theorem.  It is an entire function of order one,
`Xi(0)!=0`, and its zeros obey

\[
 N_\Xi(R):=\#\{\zeta:\Xi(\zeta)=0,\ |\zeta|\leq R\}
 \leq C R\log(R+2).                                    \tag{2.1}
\]

Multiplicities are counted.  The standard genus-one factorization is

\[
 \Xi(z)=e^{a+bz}\prod_\zeta E_1(z/\zeta),
 \qquad E_1(w)=(1-w)e^w.                               \tag{2.2}
\]

The product may equivalently be grouped symmetrically.  Only absolute
lower estimates are used.

### Lemma 2.1 (many locked candidates)

For every sufficiently large integer `A`,

\[
 {\cal P}_A
 =\{p\geq5:p\text{ odd},\ 2\log(p/2)\in[A,A+1]\}
\]

has at least `c exp(A/2)` elements.  Consecutive locked lengths in this
interval are separated by at least `c exp(-A/2)`.

**Proof.**  The defining range for `p` is

\[
 2e^{A/2}\leq p\leq2e^{(A+1)/2}.
\]

Half of the integers, up to one endpoint, are odd.  Moreover

\[
 2\log((p+2)/p)=2\log(1+2/p)\asymp p^{-1}
 \asymp e^{-A/2}.
\]

This proves both assertions.  \(\square\)

Fix `C_N>0`, put

\[
 N_A=\lceil C_N(A+1)^2\rceil,
 \qquad \delta_A=e^{-A},                               \tag{2.3}
\]

and choose `C_R` so that

\[
 0\leq {2\pi k\over L}\leq R_A:=C_R(A+1)             \tag{2.4}
\]

whenever `L in [A,A+1]` and `0<=k<=N_A`.

Since `Xi(0)!=0`, there is a fixed `r_0>0` such that `Xi` has no zero in
`|z|<2r_0`.  Consider a zero `zeta` with

\[
 |\zeta|\leq2R_A,\qquad |\operatorname {Im}\zeta|<\delta_A.
\]

Then `|Re(zeta)|>=r_0` for large `A`.  For each `1<=k<=N_A`, the bad set

\[
 \left\{L\in[A,A+1]:
 \left|{2\pi k\over L}-\operatorname {Re}\zeta\right|
 <\delta_A\right\}                                    \tag{2.5}
\]

is empty or is one interval of length at most `C A delta_A`.  Indeed, at
a point of (2.5),

\[
 \left|{d\over dL}{2\pi k\over L}\right|
 ={2\pi k/L\over L}\geq {r_0\over2(A+1)}.             \tag{2.6}
\]

There are at most

\[
 (N_A+1)N_\Xi(2R_A)=O(A^3\log A)                       \tag{2.7}
\]

bad intervals.  Their individual lengths `O(Ae^(-A))` are eventually
smaller than the locked spacing in Lemma 2.1.  Thus they exclude at most
`O(A^3 log A)` locked candidates, while `mathcal P_A` has exponentially
many.

Choose one remaining `p_A`, and put

\[
 L_A=2\log(p_A/2).                                      \tag{2.8}
\]

If a zero in `|zeta|<=2R_A` has imaginary part of modulus at least
`delta_A`, every real number is automatically at least `delta_A` from it.
The construction therefore gives

\[
 \boxed{
 \operatorname {dist}\left({2\pi k\over L_A},
             Z(\Xi)\cap\{|z|\leq2R_A\}\right)
 \geq e^{-A},\qquad0\leq k\leq N_A.}                 \tag{2.9}
\]

Zeros outside `|z|<=2R_A` are at distance at least `R_A` from the grid.

### Lemma 2.2 (Hadamard minimum modulus on the selected grid)

There is a constant `C_Xi` such that the selected lengths satisfy

\[
 \boxed{
 H_\Xi(A):=max_{0\leq k\leq N_A}
 \log^+{1\over|\Xi(2\pi k/L_A)|}
 \leq C_\Xi A^2\log(A+2).}                            \tag{2.10}
\]

**Proof.**  Put `t=2*pi*k/L_A`.  In the finite part of (2.2), equations
(2.4) and (2.9) give

\[
 |1-t/\zeta|={|t-\zeta|\over|\zeta|}
 \geq {e^{-A}\over2R_A}.                              \tag{2.11}
\]

Also `|exp(t/zeta)|>=exp(-R_A/r_0)`.  There are
`O(R_A log(R_A+2))` finite factors, so their product has logarithm bounded
below by `-C A^2 log(A+2)`.

For `|zeta|>2R_A`, one has `|t/zeta|<=1/2` and

\[
 \log|E_1(t/\zeta)|\geq-C{|t|^2\over|\zeta|^2}.        \tag{2.12}
\]

Partial summation in (2.1) gives

\[
 \sum_{|\zeta|>2R_A}{1\over|\zeta|^2}
 \leq C{\log(R_A+2)\over R_A}.                        \tag{2.13}
\]

Thus the far product costs only `O(A log(A+2))`.  Finally the exponential
prefactor in (2.2) costs `O(A)`.  Combining these estimates proves
(2.10).  \(\square\)

For a real grid point,

\[
 \Xi(2\pi k/L)=0                                      \tag{2.14}
\]

holds exactly when `1/2+i(2*pi*k/L)` is a zeta zero, that is, when a
critical-line zero ordinate lies exactly on the grid.  Equation (2.9) is
stronger: it avoids small neighborhoods of every complex Xi zero, not
only its real zeros.

## 3. The full-Fourier ideal polynomial--Xi coframe

Let `h_n` be the unit Hermite functions in the normalization (1.1), and
put

\[
 r_j={h_{4j}(0)\over h_0(0)},\qquad
 q_j=h_{4j}-r_jh_0,\qquad j\geq1.                      \tag{3.1}
\]

Then

\[
 |r_j|\leq1,\qquad {\cal F}q_j=q_j,
 \qquad q_j(0)=\int_{\mathbb R}q_j=0.                 \tag{3.2}
\]

Define the whole-line arithmetic functions

\[
 K_j(t)={\cal E}(q_j)(e^t),\qquad
 ({\cal E}f)(x)=x^{1/2}\sum_{n\geq1}f(nx).             \tag{3.3}
\]

The polynomial--Xi calculation in the fixed-prefix theorem gives

\[
 \widehat K_j(\xi)=P_{j-1}(\xi^2)\Xi(\xi),
 \qquad \deg P_{j-1}=j-1,                              \tag{3.4}
\]

with nonzero leading coefficient.  Constants have been absorbed into
`P_(j-1)`.

The matrix in this section uses the **whole-line** Fourier values in
(3.4).  It does not yet restrict `K_j` to the centered logarithmic
interval.  For `J=N+1`, define

\[
 (A_0)_{kj}=c_{k,L}\Xi(a_k)P_{j-1}(a_k^2),
 \quad 0\leq k\leq N,\quad1\leq j\leq J,              \tag{3.5}
\]

where

\[
 c_{0,L}=L^{-1/2},\qquad c_{k,L}=\sqrt{2/L}\quad(k\geq1).
                                                               \tag{3.6}
\]

These are the orthonormal constant/cosine row normalizations.

### Lemma 3.1 (uniform polynomial coefficient bounds)

There is a constant `C_P` such that, for `0<=j<=N`, every coefficient of
`P_j` and the reciprocal of its leading coefficient are at most

\[
 \exp\{C_P(j+1)\log(j+2)\}.                            \tag{3.7}
\]

**Proof.**  For raw label `4(j+1)`, the exact Mellin polynomial is built
from

\[
 R_{4(j+1)}(s)=
 \sum_{a=0}^{2j+2}
 {(-1)^a(2j+2)!4^a\over(2j+2-a)!(2a)!}
 \prod_{\ell=0}^{a-1}(s+2\ell).                       \tag{3.8}
\]

Subtracting one supplies `s(s-1)`, and Fourier invariance rewrites the
remaining polynomial in `s(s-1)`.  Factorial comparison, followed by the
elementary coefficient bound for the products in (3.8), bounds every
coefficient by `exp(Cj log(j+2))`.  The `a=2j+2` term is the unique leading
term.  Its factorial quotient is bounded below by
`exp(-Cj log(j+2))`.  Dividing by the fixed label-four factor and changing
from `s(s-1)` to `xi^2` preserve the same class.  \(\square\)

Let `T_P` be the upper triangular coefficient matrix which changes the
monomial basis `1,x,...,x^N` to `P_0,...,P_N`.  Factoring out its diagonal,
Lemma 3.1 gives a unit upper triangular matrix `I+U` with

\[
 \|U\|\leq\exp\{CN\log(N+2)\}.                         \tag{3.9}
\]

Since `U^(N+1)=0`,

\[
 (I+U)^{-1}=I-U+U^2-\cdots+(-U)^N,                    \tag{3.10}
\]

and hence

\[
 \boxed{\log\|T_P^{-1}\|\leq C N^2\log(N+2).}        \tag{3.11}
\]

For completeness, let `V=(x_k^j)` be the monomial Vandermonde matrix at

\[
 x_k=a_k^2=\left({2\pi k\over L}\right)^2.             \tag{3.12}
\]

Here `|x_k|<=C L^2` on (0.1), while

\[
 |x_k-x_r|\geq{c\over L^2}\qquad(k\ne r).             \tag{3.13}
\]

The coefficient one-norm of the `k`th Lagrange polynomial is bounded by

\[
 {\prod_{r\ne k}(1+|x_r|)
  \over\prod_{r\ne k}|x_k-x_r|}
 \leq\exp\{CN\log(NL+2)\}.                             \tag{3.14}
\]

Thus

\[
 \log\|V^{-1}\|\leq CN\log(NL+2).                    \tag{3.15}
\]

Equations (2.10), (3.5), (3.11), and (3.15) prove the ideal conditioning
bound

\[
 \boxed{
 \log\|A_0^{-1}\|
 \leq C_*N^2\log(N+2)+H_\Xi(A)+C\log L
 \leq C_A L^4\log L.}                                 \tag{3.16}
\]

In particular `A_0` is invertible on the selected schedule.

## 4. Uniform moving-label prolate expansions

Divide the source prolate Sturm--Liouville operator by `lambda^2`.  On
`(-lambda,lambda)` its exact normalization is

\[
 A_\epsilon=H+\epsilon V,
 \qquad \epsilon=\lambda^{-2}=e^{-L},                  \tag{4.1}
\]

\[
 H=-\partial_x^2+4\pi^2x^2,
 \qquad Vf=\partial_x(x^2\partial_xf).                 \tag{4.2}
\]

The Hermite action is

\[
\begin{split}
 Vh_n={}&{\sqrt{n(n-1)(n-2)(n-3)}\over4}h_{n-4}
 -{2n^2+2n+3\over4}h_n\\
 &+{\sqrt{(n+1)(n+2)(n+3)(n+4)}\over4}h_{n+4}.
\end{split}                                             \tag{4.3}
\]

We first make spectral isolation uniform for all labels required by the
buffered construction.

### Lemma 4.1 (uniform oscillator bracketing)

Let `alpha_m(lambda)` be the ordered eigenvalues of (4.1), and let

\[
 R=4(J+2K)+4.                                          \tag{4.4}
\]

Uniformly for `0<=m<=R`,

\[
 \boxed{
 |\alpha_m(\lambda)-E_m|
 \leq C(R+1)^2\epsilon^{1/8}
       +e^{-c\lambda^2+CR},
 \qquad E_m=2\pi(2m+1).}                               \tag{4.5}
\]

Consequently adjacent exact gaps are at least `3*pi` for all sufficiently
large selected stages.

**Proof.**  Restrictions of the first `m+1` Hermite functions are trial
spaces.  Their lost Gram and energy tails are
`exp(-c lambda^2+CR)`, so min--max gives the upper half of (4.5).

For the lower half, take

\[
 X=\epsilon^{-1/8}                                     \tag{4.6}
\]

and a smooth cutoff `chi` equal to one on `[-X,X]` and zero outside
`[-2X,2X]`.  Every vector in the first `m+1` exact spectral space has
energy at most `C(R+1)`.  The potential term gives

\[
 \|1_{|x|>X}f\|_2^2\leq{C(R+1)\over X^2}\|f\|_2^2.   \tag{4.7}
\]

On the support of `chi`,

\[
 1-\epsilon x^2\geq1-4\epsilon X^2.                   \tag{4.8}
\]

The IMS identity, with the cross term split using
`eta=epsilon^(1/8)`, gives

\[
 q_H[\chi f]
 \leq(1+C(\eta+\epsilon X^2))q_\epsilon[f]
   +C(1+\eta^{-1})X^{-2}\|f\|_2^2.                    \tag{4.9}
\]

Equation (4.7) makes the cutoff map injective on the spectral trial
space.  Apply harmonic-oscillator min--max to its image and use
`R=poly(L)`, `epsilon=e^(-L)`.  This gives the lower half of (4.5), with
ample slack in the displayed `C(R+1)^2epsilon^(1/8)` term.  Since
`E_(m+1)-E_m=4*pi`, the gap assertion follows.  \(\square\)

Fix a target label `n` divisible by four and put

\[
 R_n=(H-E_n)^{-1}(1-\Pi_n).                             \tag{4.10}
\]

The usual Rayleigh--Schrodinger recursion defines normalized formal
coefficients `v_(n,r)` and eigenvalue coefficients `mu_(n,r)`.  At depth
`r`, the occupied labels lie between `max(0,n-4r)` and `n+4r`.

### Lemma 4.2 (moving-label Gevrey majorant)

There is a universal `C_G` such that

\[
 \boxed{
 \|v_{n,r}\|_2+|\mu_{n,r}|
 \leq[C_G(n+1)^2]^r r!}                                \tag{4.11}
\]

for every target and order used below.  The same class holds for formal
normalization, reciprocal, point-value, and integral coefficients.

**Proof.**  Write an output label as `n+4q`.  Formula (4.3), followed by
the oscillator gap `4*pi*|m-n|`, gives row and column sums

\[
 \|R_nV\|_{\text{depth }r}
 \leq C{(n+4|q|+4)^2\over|q|}
 \leq C((n+1)^2+r).                                    \tag{4.12}
\]

If `a_r=||v_(n,r)||`, the recursion and symmetry of `V` imply

\[
 a_r\leq C((n+1)^2+r)a_{r-1}
 +C(n+1)^2\sum_{k=1}^r a_{k-1}a_{r-k}.                \tag{4.13}
\]

Use

\[
 \sum_{k=1}^r(k-1)!(r-k)!\leq3(r-1)!                 \tag{4.14}
\]

and enlarge `C_G` once.  This closes induction in (4.11).  Formal scalar
products and reciprocals obey the same convolution inequality.  Hermite
values at zero add only a polynomial support factor, which is absorbed by
another fixed enlargement.  \(\square\)

Take `K,Q` as in (0.1), and use (4.11) uniformly for all raw targets
`n=4m`, `0<=m<=Q`.  The largest formal Hermite label is at most
`4(J+2K)`.  With

\[
 B=C[4(J+2K)+1]^2,                                     \tag{4.15}
\]

coefficient cancellation through degree `K` gives a normalized quasimode
remainder

\[
 \delta_K\leq\operatorname {poly}(J+K)
 (B\epsilon)^{K+1}(K+1)!.                              \tag{4.16}
\]

Since `J=O(L^2)` and `K=kappa L^3 log L`, Stirling's bound gives

\[
 \boxed{
 \log\delta_K
 \leq-K\{L-\log B-\log K-O(1)\}
 =-(\kappa+o(1))L^4\log L.}                            \tag{4.17}
\]

The Mehler estimate for the omitted moving endpoints is

\[
 \exp\{-c\lambda^2+C(J+2K)\}.                         \tag{4.18}
\]

Lemma 4.1 identifies each quasimode with the exact ordered prolate branch
and divides (4.16) only by a fixed gap.  Interior ellipticity gives the
same estimate at zero, up to a polynomial factor.  Thus the exact modes,
their point values, and their formal approximants all have error

\[
 \operatorname {poly}(Q)\delta_K
 +\exp\{-c\lambda^2+CQ\}.                              \tag{4.19}
\]

## 5. The total-degree buffered inverse

The purpose of the buffer `K` is to remove every lower-order moving-label
contamination, not merely the first correction.

In the residue-zero Hermite basis, write the formally normalized
eigenvector matrix as

\[
 \Phi={\mathscr H}U(\epsilon),
 \qquad {\mathscr H}=(h_0,h_4,h_8,\ldots),
 \qquad U(\epsilon)=I+\sum_{r\geq1}\epsilon^rU_r.       \tag{5.1}
\]

Formal self-adjointness and the distinct constant eigenvalues imply

\[
 U(\epsilon)^*U(\epsilon)=I                             \tag{5.2}
\]

coefficientwise.  Moreover `U_r` has index bandwidth `r`.

There are `J+1` raw Hermite targets

\[
 h_0,h_4,\ldots,h_{4J},                                \tag{5.3}
\]

with indices `0,...,J`, and `Q+1` available raw prolate modes with indices
`0,...,Q`, where `Q=J+K`.  Let `C_H` be the degree-at-most-`K` truncation
of `U(epsilon)^*`, restricted to these source rows and target columns:

\[
 C_H:\mathbb C^{J+1}\longrightarrow\mathbb C^{Q+1}.   \tag{5.4}
\]

A total-degree-at-most-`K` contribution to target index `j<=J` can use
only an actual-mode index `m` satisfying

\[
 |m-j|\leq K.                                          \tag{5.5}
\]

Therefore `m<=J+K=Q`; no omitted source row contributes through degree
`K`.  Multiplying (5.1) and (5.4), using (5.2), and then replacing formal
columns by exact prolate modes gives

\[
 \boxed{
 \left\|(f_0,f_4,\ldots,f_{4Q})C_H
       -(h_0,h_4,\ldots,h_{4J})\right\|_{\rm op}
 \leq\operatorname {poly}(Q)\delta_K
      +e^{-c\lambda^2+CQ}.}                            \tag{5.6}
\]

The decreasing majorant also gives

\[
 \|C_H\|\leq2                                          \tag{5.7}
\]

eventually.

Now define

\[
 Z:\mathbb C^J\longrightarrow\mathbb C^{J+1},
 \qquad Ze_j=e_j-r_je_0,\quad1\leq j\leq J.           \tag{5.8}
\]

By (3.2),

\[
 \|Z\|\leq\sqrt{J+1}.                                 \tag{5.9}
\]

The columns of `(f_0,...,f_(4Q))C_HZ` approximate the ideal sources
`q_1,...,q_J`.  They need not yet have exactly zero integral.  For such a
column `g`, define

\[
 Q_\lambda g=g-{\int g\over I_0}f_{0,\lambda}.         \tag{5.10}
\]

Fixed-ground convergence gives `I_0>=h_0(0)/2` eventually.  Equations
(3.2) and (5.6), Cauchy--Schwarz on an interval of length `2lambda`, and
the Gaussian tail of `q_j` show

\[
 \|Q_\lambda g-q_j\|_2
 \leq\operatorname {poly}(Q)\lambda^{1/2}\delta_K
      +e^{-c\lambda^2+CQ}.                              \tag{5.11}
\]

The source `Q_lambda g` is exactly zero-integral.  Keeping the coefficients
of the positive raw modes and eliminating the label-zero coefficient
expresses it exactly in the canonical columns (1.4).  Thus there is a
matrix

\[
 C_Z:\mathbb C^J\longrightarrow\mathbb C^Q             \tag{5.12}
\]

such that its `j`th column synthesizes `Q_lambda g`, and

\[
 \boxed{\|C_Z\|\leq2\sqrt{J+1}.}                       \tag{5.13}
\]

This is the finite-overlap inversion.  The extra `K` source rows in (5.4),
not a fixed-prefix limit, are what make its error start at degree `K+1`.

## 6. Arithmetic projection and wide-prefix surjectivity

Let

\[
 B_{\lambda,N}:\mathbb C^Q\longrightarrow E_N^+,
 \qquad B_{\lambda,N}e_m=p_m,\quad1\leq m\leq Q,      \tag{6.1}
\]

be the actual wide zero-integral synthesis.

For sources supported in `[0,lambda]`, the elementary arithmetic bound is

\[
 \|{\cal E}f\|_{L^2([-L/2,L/2])}\leq\lambda\|f\|_2.   \tag{6.2}
\]

Evenization and orthogonal projection are contractions.  Hence (5.11)
costs only the factor `lambda` after the physical map.

There is one further distinction from Section 3: `A_0` uses full-line
Fourier values, while the actual physical map first restricts to
`[-L/2,L/2]`.  The uniform Mehler bound for Hermite labels at most `4J`,
followed by Poisson symmetry using (3.2), gives

\[
 \left\|\text{restricted ideal cosine matrix}-A_0\right\|
 \leq\exp\{-c\lambda^2+CQL\}.                          \tag{6.3}
\]

This is the first point at which the restriction tail is inserted.

Combining (4.17), (5.11), and (6.2)--(6.3),

\[
 \boxed{
 \|B_{\lambda,N}C_Z-A_0\|
 \leq\exp\{-(\kappa+o(1))L^4\log L\}.}               \tag{6.4}
\]

Choose once and for all

\[
 \kappa>2C_A,                                          \tag{6.5}
\]

with a fixed additive cushion for the Gevrey constant.  Equations (3.16)
and (6.4) then give

\[
 \|A_0^{-1}(B_{\lambda,N}C_Z-A_0)\|<\tfrac12          \tag{6.6}
\]

eventually.  Thus the square synthesized matrix `B_(lambda,N)C_Z` is
invertible and

\[
 \|(B_{\lambda,N}C_Z)^{-1}\|\leq2\|A_0^{-1}\|.        \tag{6.7}
\]

Consequently the **wide** matrix `B_(lambda,N)` is onto `E_N^+`.  A
convenient right inverse is

\[
 R_{\lambda,N}
 =C_Z(B_{\lambda,N}C_Z)^{-1},                          \tag{6.8}
\]

and

\[
 \boxed{
 \log\|R_{\lambda,N}\|
 \leq C_A L^4\log L+O(\log L).}                       \tag{6.9}
\]

Nothing in this argument asserts that the first `J` canonical columns form
an invertible square.

## 7. Exact defect cost and anchor preservation

The exact exterior Fourier leakage of the raw prolate modes is diagonal:

\[
 \left\langle(1-P_\lambda){\cal F}f_{n,\lambda},
 (1-P_\lambda){\cal F}f_{m,\lambda}\right\rangle
 =d_n\delta_{nm}.                                      \tag{7.1}
\]

Therefore the full metric in the canonical zero-integral coordinates
(1.4) is

\[
 \boxed{
 D_{\rm full}
 =\operatorname {diag}(d_4,d_8,\ldots,d_{4Q})
   +d_0\rho\rho^*.}                                    \tag{7.2}
\]

The KRD leading-eigenvalue estimate from the growing-window theorem gives

\[
 d_{4m}\leq D_\lambda
 :=10\exp\left\{-{\lfloor4\lambda^2\rfloor-4Q-7
                    \over\beta_\lambda}\right\},
 \qquad
 \beta_\lambda={2\over\pi^2}\log(200\lambda^2+25).  \tag{7.3}
\]

Since `Q=poly(L)`, eventually

\[
 \boxed{D_\lambda\leq10e^{-2\lambda^2/L}.}            \tag{7.4}
\]

The point-value form of the moving-label estimate, (1.3), and
`|h_(4m)(0)|<=h_0(0)` give, with harmless slack,

\[
 |\rho_m|\leq3\qquad(1\leq m\leq Q).                  \tag{7.5}
\]

One may avoid this refinement and use Cauchy--Schwarz
`|rho_m|<=C sqrt(lambda)`; it changes only a lower-order `O(L)` term.
Using (7.5),

\[
 \boxed{\|D_{\rm full}\|\leq D_\lambda(1+9Q).}        \tag{7.6}
\]

Equations (5.13), (6.7), and (7.6) give

\[
\begin{split}
 \|D_{\rm full}^{1/2}R_{\lambda,N}\|^2
 &\leq16(J+1)(1+9Q)D_\lambda\|A_0^{-1}\|^2\\
 &\leq
 \exp\left\{-{2\lambda^2\over L}
             +C_0L^4\log L\right\}=o(1).             \tag{7.7}
\end{split}
\]

It remains to check that physical anchor deflation does not change this
source cost.  Put

\[
 \alpha_m={\langle p_1,p_m\rangle\over\|p_1\|^2},
 \qquad w_m=p_m-\alpha_mp_1,\qquad2\leq m\leq Q.       \tag{7.8}
\]

Let `v in kappa^perp`, and let

\[
 x=R_{\lambda,N}v,
 \qquad v=\sum_{m=1}^Qx_mp_m.                          \tag{7.9}
\]

Orthogonality to `p_1` forces

\[
 x_1=-\sum_{m=2}^Q\alpha_mx_m.                         \tag{7.10}
\]

Therefore

\[
 v=\sum_{m=2}^Qx_mw_m,                                 \tag{7.11}
\]

and its raw source is identically

\[
 \sum_{m=1}^Qx_mc_m
 =\sum_{m=2}^Qx_m(c_m-\alpha_mc_1).                    \tag{7.12}
\]

The two expressions in (7.12) are the same source, not merely sources
with the same physical image.  Their exterior costs are exactly equal.
Thus (7.7) proves

\[
 \boxed{
 {\cal R}_D(\kappa^\perp;Q,\lambda)
 \leq\exp\left\{-{2\lambda^2\over L}
                  +C_0L^4\log L\right\}.}             \tag{7.13}
\]

This also shows why arbitrary anchor coefficients `alpha_m` need no
separate bound.

## 8. The two-zero carrier consequence

Let `gamma_1,gamma_2` be the two individually verified critical-line zero
ordinates used in the carrier barrier, and let

\[
 n_i\in\operatorname {argmin}_{n\in\mathbb Z}
 \left|{2\pi n\over L}-\gamma_i\right|.                \tag{8.1}
\]

Then `n_i=O(L)`.  Since `N_A=Theta(A^2)` and `L_A in [A,A+1]`, both
carrier indices lie in `E_(N_A)^+` eventually.  Put

\[
 H_L=\operatorname {span}\{e_{n_1}^+,e_{n_2}^+\},
 \qquad J_L=H_L\cap\kappa^\perp.                       \tag{8.2}
\]

The carrier theorem gives `dim J_L>=1` and, for every unit `v in J_L`,

\[
 \|v\|_{\mathfrak Z}^2\geq{L\over8\pi^2}.             \tag{8.3}
\]

Equations (7.11)--(7.13) prove the actual allowed-prefix statement

\[
 \boxed{
 J_L\subseteq\operatorname {span}\{w_2,\ldots,w_Q\},
 \qquad {\cal R}_D(J_L;Q,\lambda)=o(1).}               \tag{8.4}
\]

For a minimum-cost preimage of a unit carrier vector, (8.3) and (8.4)
imply

\[
 {\|ZWx\|^2\over x^*D x}\longrightarrow\infty.        \tag{8.5}
\]

This is an absolute paired-zero carrier obstruction after exact defect
normalization.  Equation (8.5) contains no sign information.

## 9. Explicit Mobius inverse versus minimum defect cost

The full-source right inverse from the coframe audit is

\[
 (R_\lambda g)(x)
 =\sum_{n\leq\lambda/x}\mu(n){g(nx)\over\sqrt{nx}}.    \tag{9.1}
\]

For the complex carrier

\[
 g_a(u)=L^{-1/2}u^{ia},                                 \tag{9.2}
\]

its visible lift is exactly

\[
 \boxed{
 r_a(x)=L^{-1/2}x^{-1/2+ia}S_a(\lambda/x),
 \qquad
 S_a(X)=\sum_{n\leq X}\mu(n)n^{-1/2+ia}.}             \tag{9.3}
\]

Consequently

\[
 \boxed{
 \|r_a\|_{L^2(1/\lambda,\lambda)}^2
 ={1\over L}\int_1^{\lambda^2}|S_a(X)|^2{dX\over X}.} \tag{9.4}
\]

At every visible breakpoint `x_n=lambda/n` with `mu(n)!=0`,

\[
 r_a(x_n^-)-r_a(x_n^+)
 =\mu(n){g_a(\lambda)\over\sqrt\lambda}.               \tag{9.5}
\]

The Dirichlet generating function of the coefficients in (9.3) is

\[
 \sum_{n\geq1}{\mu(n)n^{-1/2+ia}\over n^z}
 ={1\over\zeta(1/2-ia+z)}.                             \tag{9.6}
\]

Thus, at a verified ordinate `a=gamma`, equation (9.6) has a pole at
`z=0`.  This is the precise weighted-Mobius/zeta-zero resonance.

Equations (9.3)--(9.6) concern one explicit unprojected full-source lift
and its source `L2` norm.  They do not supply a Tauberian lower bound for
the finite mean in (9.4).  More importantly, exterior defect is not source
`L2`: invisible central-hole corrections can change it.  The many internal
jumps in (9.5) obstruct equality with a finite analytic family before
physical projection, but they do not lower-bound the coordinate-invariant
minimum `D`-cost after finite projection.  The constructive bound (7.13)
shows that they cannot furnish such a lower bound on the selected schedule.

The same singularity appears in the ideal finite coframe in a different
form: an exact grid collision makes a row factor `Xi(a_k)` vanish.  The
locked schedule in Section 2 avoids that collision quantitatively.

## 10. Exact limitations and regression

The theorem proves:

1. an infinite locked schedule with quantitative separation from all Xi
   zeros and a polynomial minimum-modulus loss;
2. a quantitative inverse bound for the full-Fourier polynomial--Xi sample
   matrix at `N=O(L^2)`;
3. uniform moving-label spectral isolation and Gevrey recursion through a
   buffer of depth `O(L^3 log L)`;
4. exact zero-integral reconstruction by an actual wide even prolate
   prefix;
5. wide-prefix surjectivity, exact anchor preservation, and the
   defect-weighted bound (7.13); and
6. the actual carrier inclusion and `o(1)` cost in (8.4).

It does not prove the first-`J` square determinant, an `O(L^2)` source
prefix, a signed orientation, a signed sector floor, residual action,
shifted inverse control, equation (5.2), RH, or a Lambda bound.

The isolated regression is

```text
python3 -m unittest tests.test_moving_label_carrier_coframe_defect_right_inverse_theorem -v
```
