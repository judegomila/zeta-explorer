# Anchored central degree: exact screw reduction and sign barrier

## 0. Claim boundary

This note reduces the central weighted-Loewner vertex degree of the actual
source-normalized prolate anchor to one classical scalar screw function.  It
does so without separating the pole, archimedean, and prime contributions.
The exact outcome is

\[
 d_0={2x_0\over\sqrt L}J_L-{2x_0^2\over L}g(L),          \tag{0.1}
\]

where `J_L` is an arithmetic-prolate convolution which is flat to every
fixed inverse power on the admitted natural cutoff, while `g` is the
primitive of the scalar-deleted complete source discrepancy.  Thus the
first possible non-flat sign is the sign of `-g(L)`, not the sign of a
separately bounded prime or archimedean term.

An eventual-nonnegative Laplace argument, combined with the locked global
zero count, proves unconditionally that `-g(L)` has one fixed positive
margin on infinitely many strict-half-integer log lengths.  Consequently
the actual natural-cutoff central degree `d_0` is positive on an unbounded
subsequence.  This is a central-vertex theorem only; it is not a full
schedule or full-graph sign theorem.

The pointwise assertion `g(L)<=0` for every positive `L` is not proved.
Masatoshi Suzuki, *Aspects of the screw function corresponding to the
Riemann zeta function*, arXiv:2206.03682v4, identifies the same one-sided
transform and records its pointwise sign as an RH-equivalent criterion.
That paper is explicitly **UNADMITTED** in `SOURCES.md`; it is context only
and is not a dependency of any theorem below.  The Laplace identity and all
finite-source formulas used here are derived directly from the locked
source.

The note also gives an exact vertex-1 identity, but proves no sign for it.
It proves no positive-graph connectivity, routing contraction, finite
real-rootedness, shrinking-collar equality, `DIRECT_RH_ATTACK.md` equation
(5.2), Riemann-hypothesis conclusion, or Lambda bound.  The formal project
state remains `P0_INVALIDATED`.

The binding conventions are those of `P0_SOURCE_LOCK.json` and
`P0_NORMALIZATION_AUDIT.md`: `L=2*log(lambda)`, centered `exp(-izt)`,
Lebesgue measure, zero extension, inversion symmetry, source normalization,
the inclusive inventory `1<n<=lambda^2`, and the minus sign of the prime
block.

## 1. Scalar-deleted complete source and its exact Laplace transform

For `t>0`, extend the already-used complete discrepancy to the half-line by

\[
 D(t)=\sum_{1<n\leq e^t}{\Lambda(n)\over\sqrt n}
          -2(e^{t/2}-1),                                  \tag{1.1}
\]

\[
 \tau(t)={e^{-5t/2}\over1-e^{-2t}},\qquad
 H_{\rm tail}(t)=\int_t^\infty\tau(u)\,du,                \tag{1.2}
\]

\[
 F_{\rm align}(t)=D(t)-H_{\rm tail}(t).                  \tag{1.3}
\]

On a finite source interval `[0,L]`, these are exactly the quantities in
`notes/ACTUAL_SOURCE_ANCHORED_ROUTING_VERTEX_OBSTRUCTION.md`; the prime sum
automatically stops at `n<=exp(L)=lambda^2`.

Put

\[
 c_\infty={1\over2}\{\psi(1/4)-\log\pi+4\}
 ={c_*\over2},\qquad
 R(t)=F_{\rm align}(t)-c_\infty.                         \tag{1.4}
\]

The value is source independent.  The identity
`psi(1/4)=-gamma-pi/2-3*log(2)` also shows

\[
 c_\infty=2-\frac\gamma2-\frac\pi4
 -\frac32\log2-\frac12\log\pi<0.                       \tag{1.5}
\]

### Theorem 1.1 (exact half-plane identity)

Let

\[
 \xi_R(s)={1\over2}s(s-1)\pi^{-s/2}\Gamma(s/2)\zeta(s).
                                                                    \tag{1.6}
\]

For every complex `q` with `Re(q)>1/2`, with no continuation inserted into
the defining integral,

\[
 \boxed{
 \int_0^\infty e^{-qt}F_{\rm align}(t)\,dt
 ={1\over q}\left\{c_\infty-
 {\xi_R'\over\xi_R}\left({1\over2}+q\right)\right\}.}  \tag{1.7}
\]

Consequently,

\[
 \boxed{
 \int_0^\infty e^{-qt}R(t)\,dt
 =-{1\over q}{\xi_R'\over\xi_R}\left({1\over2}+q\right).} \tag{1.8}
\]

**Proof.**  Start with real `q>1/2`.  Absolute convergence and Tonelli
applied to the nonnegative prime inventory give, with `s=1/2+q`,

\[
 \int_0^\infty e^{-qt}
 \sum_{1<n\leq e^t}{\Lambda(n)\over\sqrt n}\,dt
 =-{1\over q}{\zeta'\over\zeta}(s).                    \tag{1.9}
\]

The continuous main term contributes

\[
 -{2\over q-1/2}+{2\over q}.                            \tag{1.10}
\]

Since

\[
 \tau(t)=\sum_{k\geq0}e^{-\alpha_kt},\qquad
 \alpha_k=2k+{5\over2},                                \tag{1.11}
\]

Fubini gives

\[
 \int_0^\infty e^{-qt}H_{\rm tail}(t)\,dt
 =\sum_{k\geq0}{1\over\alpha_k(\alpha_k+q)}
 ={\psi(5/4+q/2)-\psi(5/4)\over2q}.                    \tag{1.12}
\]

Use `psi(z+1)=psi(z)+1/z`, `psi(5/4)=psi(1/4)+4`, and

\[
 {\xi_R'\over\xi_R}(s)
 ={1\over s}+{1\over s-1}-{1\over2}\log\pi
 +{1\over2}\psi(s/2)+{\zeta'\over\zeta}(s).           \tag{1.13}
\]

After multiplication by `q`, the rational pole terms reduce exactly by

\[
 -{2q\over q-1/2}+2=-{1\over q-1/2}.                   \tag{1.14}
\]

Equations (1.9)--(1.14) leave `c_infty-xi_R'/xi_R`, proving
(1.7) on the real ray.  Both defining integrals converge locally uniformly
and are holomorphic on `Re(q)>1/2`; the right sides are holomorphic there
because `Re(1/2+q)>1`.  The identity theorem extends (1.7) to that full
half-plane.  Subtracting the transform of the constant in (1.4) proves
(1.8) there as well.  \(\square\)

Define the primitive

\[
 \boxed{g(T)=\int_0^T R(t)\,dt.}                        \tag{1.15}
\]

Absolute Fubini integration gives the exact one-sided screw transform

\[
 \boxed{
 \int_0^\infty e^{-qT}g(T)\,dT
 =-{1\over q^2}{\xi_R'\over\xi_R}
        \left({1\over2}+q\right),\qquad \Re q>{1\over2}.} \tag{1.16}
\]

No zero expansion is needed to evaluate `g` at a finite `T`.  Directly from
(1.1)--(1.4),

\[
\boxed{
\begin{aligned}
 g(T)={}&\sum_{1<n\leq e^T}{\Lambda(n)\over\sqrt n}(T-\log n)
       -4(e^{T/2}-1)+2T-c_\infty T\\
 &-\sum_{k\geq0}{1-e^{-\alpha_kT}\over\alpha_k^2},
 \qquad \alpha_k=2k+{5\over2}.
\end{aligned}}                                                   \tag{1.17}
\]

The inclusive convention at `n=e^T` is harmless in (1.17), where its
factor `T-log(n)` is zero, but remains mandatory in the source inventory.

## 2. Exact central-degree decomposition

On `[0,L]`, write the real projected even anchor as

\[
 f_N(t)={1\over\sqrt L}
 \left(x_0+2\sum_{n=1}^Nx_n\cos{2\pi nt\over L}\right). \tag{2.1}
\]

Set

\[
 A_n(L)=\int_0^L R(t)\cos{2\pi nt\over L}\,dt,
 \qquad A_0(L)=g(L),                                    \tag{2.2}
\]

\[
 J_L=\int_0^LR(t)f_N(t)\,dt.                            \tag{2.3}
\]

The constant deletion in (1.4) does not change any nonzero cosine
coefficient.  Since `sin(2*pi*n*t/L)` vanishes at both endpoints, the exact
Stieltjes coefficient formula and improper integration by parts give

\[
 \boxed{b_n=-{2n\over L}A_n(L),\qquad n\geq1.}           \tag{2.4}
\]

The logarithmic lower endpoint is killed by the sine primitive exactly as
in the checkpoint-0.79 vertex theorem.

### Theorem 2.1 (central screw identity)

For every finite `N>=1`,

\[
 \boxed{
 d_0={2x_0\over\sqrt L}J_L-{2x_0^2\over L}g(L).}        \tag{2.5}
\]

**Proof.**  Equations (2.1)--(2.3) give

\[
 \sqrt L\,J_L=x_0g(L)+2\sum_{n=1}^Nx_nA_n(L).          \tag{2.6}
\]

Use (2.4) in the exact degree
`d_0=-2*x_0*sum_(n>=1)b_n*x_n/n`, then substitute (2.6).
This proves (2.5).  \(\square\)

In particular, once `x_0>0`, the exact sufficient margin is

\[
 \boxed{
 g(L)<0,\qquad
 |J_L|<{x_0\over\sqrt L}\,[-g(L)]
 \quad\Longrightarrow\quad d_0>0.}                    \tag{2.7}
\]

This is a cancellation-preserving condition.  It does not replace `J_L`
or `g(L)` by separate absolute prime and archimedean envelopes.

## 3. The Xi-divisible convolution is flat

Put `a=L/2` and let

\[
 K(u)=E(h)(e^u),\qquad \widehat K(z)={\Xi(z)\over4},
 \qquad \Xi(z)=\xi_R(1/2+iz).                           \tag{3.1}
\]

The locked kernel `K` is even and decreases faster than every exponential.

### Lemma 3.1 (pole-cancelled even convolution)

Let `H` be one of the admitted formal arithmetic corrections, so that `H`
is real, even, rapidly decreasing and

\[
 \widehat H(z)=P(z^2)\Xi(z)                              \tag{3.2}
\]

for a real polynomial `P`.  Then the absolutely convergent convolution

\[
 {\cal C}_H(a)=\int_0^\infty R(t)
       \{H(a-t)+H(a+t)\}\,dt                            \tag{3.3}
\]

has centered Fourier transform

\[
 \boxed{\widehat{{\cal C}_H}(z)
       ={2P(z^2)\Xi'(z)\over z}.}                       \tag{3.4}
\]

The quotient at zero is removable.  In particular, `C_H(a)` decreases
faster than every fixed exponential as `a->infinity`.  For the leading
kernel `P=1/4`,

\[
 \boxed{
 \int_0^\infty R(t)\{K(a-t)+K(a+t)\}\,dt
 =-2\int_a^\infty uK(u)\,du.}                           \tag{3.5}
\]

**Proof.**  In the lower half-plane `Im(z)<-1/2`, put `q=iz` in (1.8).
The locked Fourier sign gives

\[
 \int_0^\infty R(t)e^{-izt}\,dt
 ={\Xi'(z)\over z\Xi(z)}.                              \tag{3.6}
\]

For `H(a-t)`, insert Fourier inversion on a horizontal line below the
critical boundary.  For `H(a+t)`, use the reflected line above it.  Since
`Xi` is even, `Xi'(z)/(z*Xi(z))` is even.  Multiplication by (3.2) cancels
every zero of `Xi` before either contour is moved.  The remaining integrand
`P(z^2)*Xi'(z)/z` is entire; the completed gamma factor and the rapid decay
of `H` justify moving both contours to the real line.  The two equal
contributions give (3.4), with no zero-location assumption.

For `P=1/4`, let

\[
 S(a)=-2\int_{|a|}^\infty uK(u)\,du.
\]

Then `S'(a)=2*a*K(a)` and, under the centered Fourier convention,
`widehat(S)=2*widehat(K)'/z=Xi'/(2z)`, which is (3.4) for `P=1/4`.
This proves (3.5).  Polynomial multiplication in (3.4), differentiation,
and the same tail primitive preserve faster-than-exponential decay for
every fixed `P`.  \(\square\)

### Theorem 3.2 (actual natural-cutoff flatness)

Let

\[
 M(\lambda)=\lceil\lambda\rceil,
 \qquad f_\lambda=P_{M(\lambda)}X_\lambda              \tag{3.7}
\]

be the admitted source-normalized projected prolate anchor, shifted from
`[-L/2,L/2]` to `[0,L]` in (2.1).  Then

\[
 \boxed{J_L=O_A(\lambda^{-A})
 \quad\hbox{for every fixed }A>0.}                      \tag{3.8}
\]

**Proof.**  Fix the requested `A`.  Equation (5.5) of
`notes/ALL_ORDER_PROLATE_ARITHMETIC_FLATNESS.md` gives, at any chosen fixed
depth `r`,

\[
 X_\lambda=\sum_{j=0}^r\lambda^{-2j}G_j
       +O_{L^2}(\lambda^{-2r-1}).                       \tag{3.9}
\]

The natural-cutoff estimate (3.7) of
`notes/NATURAL_CUTOFF_NEGATIVE_REAL_ROOT_EXCLUSION.md` is
`||(I-P_M)X_lambda||_2=O(exp(-cL^2))`, and its equation (3.10) gives
`widehat(G_j)=P_j(z^2)Xi(z)`.  Thus the projected anchor differs in `L2`
from the same fixed finite sum by an arbitrarily large inverse power after
choosing `r`.

The elementary bound

\[
 \sum_{n\leq e^t}{\Lambda(n)\over\sqrt n}
 =O((1+t)e^{t/2})                                      \tag{3.10}
\]

and the logarithmic behavior of `H_tail` at zero give

\[
 \|R\|_{L^2(0,L)}=O(\lambda\,\operatorname {poly}(L)). \tag{3.11}
\]

Choose `r` large enough to pay this single factor by Cauchy--Schwarz.
For each of the finitely many `G_j`, Lemma 3.1 makes the full even
convolution flat.  The difference between that convolution and the
truncated integral on `[0,L]` consists of `t>L` and reflected `a+t` tails;
(3.10) and the faster-than-exponential decay of `G_j` make both smaller
than every fixed inverse power of `lambda`.  Summing the fixed finite
expansion proves (3.8).  \(\square\)

The fixed-mode source theorem also gives

\[
 \sqrt L\,x_0\longrightarrow C={\Xi(0)\over4}>0.       \tag{3.12}
\]

Combining (2.5), (3.8), and (3.12) yields the unconditional absolute
reduction

\[
 \boxed{
 d_0=-{2x_0^2\over L}g(L)+O_A(\lambda^{-A})
 \quad\hbox{for every fixed }A>0,}                      \tag{3.13}
\]

where changing `A` changes the implicit constant and starting threshold.
Equation (3.13) is not a sign theorem when `g(L)` may be arbitrarily close
to zero.

### Corollary 3.3 (precise subsequence margin gate)

On any unbounded natural-cutoff subsequence for which

\[
 \boxed{
 g(L_j)<0,qquad
 {\sqrt{L_j}|J_{L_j}|\over
  x_{0,j}[-g(L_j)]}<1}                                \tag{3.14}
\]

eventually, one has `d_(0,j)>0`.  In view of (3.8) and (3.12), the simpler
condition

\[
 \boxed{-g(L_j)\geq\lambda_j^{-B}}                    \tag{3.15}
\]

for one fixed `B>0` is sufficient.  Neither (3.14) nor (3.15) is asserted
on the full natural schedule.

Put

\[
 \boxed{\Psi(T)=-g(T).}                                  \tag{3.16}
\]

Thus (1.16) is equivalently

\[
 \int_0^\infty e^{-qT}\Psi(T)\,dT
 ={1\over q^2}{\xi_R'\over\xi_R}\left({1\over2}+q\right),
 \qquad \Re q>{1\over2}.                              \tag{3.17}
\]

The next elementary lemma is the only Tauberian input.

### Lemma 3.4 (eventual-nonnegative Laplace barrier)

Let `h` be locally integrable and eventually nonnegative on the half-line.
If its tail Laplace transform has a finite real abscissa of convergence
`sigma_c`, then that transform cannot be holomorphic in a neighborhood of
the real point `sigma_c`.

**Proof.**  Delete the initial compact interval.  Suppose `H` is holomorphic
in a disk of radius `r>0` about `sigma_c`, and put
`a=sigma_c+r/4`.  The union of that disk and the convergence half-plane
contains the disk of radius `r/2` about `a`.  Differentiation under the
absolutely convergent integral gives

\[
 (-1)^nH^{(n)}(a)=\int h(t)e^{-at}t^n\,dt\geq0.
\]

Choose `0<epsilon<r/4` and set `z=r/4+epsilon<r/2`.
Taylor convergence at `a-z`, followed by Tonelli, gives

\[
\begin{aligned}
 H(a-z)
 &=\sum_{n\geq0}{z^n\over n!}
     \int h(t)e^{-at}t^n\,dt\\
 &=\int h(t)e^{-(a-z)t}\,dt.
\end{aligned}
\]

Thus the defining integral converges at
`a-z=sigma_c-epsilon`, contradicting the abscissa.  Restoring the compact
interval adds an entire function.  \(\square\)

### Theorem 3.5 (unconditional strict-half-integer screw margin)

Set

\[
 T_*=30\,610\,046\,000,
 \qquad c_{\rm screw}={1\over2T_*^2}.                   \tag{3.18}
\]

There are odd integers `p_j->infinity` such that, with

\[
 \lambda_j={p_j\over2},\qquad
 L_j=2\log\lambda_j,
\]

one has

\[
 \boxed{\Psi(L_j)=-g(L_j)>c_{\rm screw}.}              \tag{3.19}
\]

This theorem is unconditional.  Its proof is a law-of-the-excluded-middle
argument; it neither decides RH nor assumes a pointwise sign for `g`.

**Proof.**  First, the locked Hasanalizade--Shen--Wong count gives at least
one nontrivial zero with positive ordinate at most `T_*`.  Indeed, with the
notation of `notes/ZERO_SAMPLING_SOURCE_AUDIT.md`,

\[
 N(T_*)\geq M(T_*)-{1\over8}-R(T_*)>0.                 \tag{3.20}
\]

The last inequality can be checked without floating point.  The elementary
bounds `pi<22/7` and `2<e<3` give
`log(T_*)<35`, `log(log(T_*))<6`, and
`log(T_*/(2*pi*e))>1`.  Therefore

\[
 M(T_*)-{1\over8}-R(T_*)
 >{7T_*\over44}-{1\over8}
 -\left({13\over125}35+{129\over500}6+{937\over100}\right)>0. \tag{3.21}
\]

Suppose first that RH is true.  The elementary eta sign used below gives
`zeta(1/2)<0`; all other real factors in (1.6), including
`(1/2)(1/2-1)`, then give `xi_R(1/2)>0`.  Thus no centered zero
`gamma=0` occurs.  The locked count `N(T)=O(T*log(T))`, with multiplicity,
also gives

\[
 \sum_{\gamma>0}\gamma^{-2}<\infty.                    \tag{3.22}
\]

on dyadic ordinate blocks the summand total is `O(k/2^k)`.  Pairing the
centered Hadamard product and using (3.17) therefore gives, absolutely and
compact-uniformly in real `t`,

\[
 \Psi(t)=2\sum_{\gamma>0}{1-\cos(\gamma t)\over\gamma^2}.
                                                               \tag{3.23}
\]

The sum includes multiplicity.  Its Cesaro mean tends

\[
 A=2\sum_{\gamma>0}{1\over\gamma^2}\geq{2\over T_*^2}. \tag{3.24}
\]

Consequently there are arbitrarily large `t` with
`Psi(t)>A/2>=1/T_*^2`.

Suppose instead that RH is false.  Functional-equation reflection supplies
a zero `rho` with

\[
 s_0=\rho-{1\over2},\qquad 0<b:=\Re s_0<{1\over2}.     \tag{3.25}
\]

If `Psi` were bounded above eventually, choose `C` and `T` so that
`h(t)=C-Psi(t)>=0` for `t>=T`.  For `Re(s)>1/2`, its tail transform is

\[
 H(s)={Ce^{-sT}\over s}
 -{1\over s^2}{\xi_R'\over\xi_R}\left({1\over2}+s\right)
 +\int_0^T e^{-st}\Psi(t)\,dt.                         \tag{3.26}
\]

The Fiori--Kadiri--Swidinsky PNT bound pinned in `P3_SOURCE_LOCK.json` and
partial summation in (1.1) give, for some `a>0`,

\[
 |R(u)|\leq C_1e^{u/2}(1+u^2)e^{-a\sqrt u}             \tag{3.27}
\]

for all sufficiently large `u`; the same type of bound holds for `Psi`.
Thus the abscissa `sigma_c` satisfies `sigma_c<=1/2`, allowing initially
the value `-infinity`.  The pole at `s_0` in (3.26) forces
`sigma_c>=b`: otherwise the defining tail transform would be holomorphic at
`s_0`, and the identity theorem would remove that pole.  Hence `sigma_c` is
finite and

\[
 \boxed{0<b\leq\sigma_c\leq1/2}.                      \tag{3.28}
\]

On the other hand, the continued right side of (3.26) is holomorphic at the
real point `sigma_c`.  For `0<s<1`, the alternating eta series is positive
and `1-2^(1-s)<0`, so `zeta(s)<0`; at `s=1`, `xi_R(1)=1/2`.
Hence `xi_R(1/2+sigma_c)` is nonzero.  This contradicts Lemma 3.4.
Therefore

\[
 \limsup_{t\to\infty}\Psi(t)=+\infty                 \tag{3.29}
\]

in the non-RH case.  In either case there are arbitrarily large `t_j` with
`Psi(t_j)>1/T_*^2`.

Choose a nearest strict half-integer `lambda_j` to `e^(t_j/2)`.  For large
`j` it has the required form `p_j/2` with odd `p_j>=5`, and the elementary
logarithm inequalities `log(1+x)<=x` and
`-log(1-x)<=x/(1-x)` give

\[
 |L_j-t_j|\leq2e^{-t_j/2}.                              \tag{3.30}
\]

Since `Psi` is locally absolutely continuous with `Psi'=-R` almost
everywhere, (3.27) yields

\[
 |\Psi(L_j)-\Psi(t_j)|
 \leq C_2(1+t_j^2)e^{-a\sqrt {t_j}}=o(1).              \tag{3.31}
\]

Pass to points for which the last quantity is less than `1/(2*T_*^2)`.
Equation (3.19) follows.  \(\square\)

### Corollary 3.6 (actual central degree on the screw subsequence)

For the natural cutoff `M(lambda)=ceil(lambda)`, the subsequence in Theorem
3.5 satisfies

\[
 \boxed{d_0(\lambda_j)>0\quad\hbox{for all sufficiently large }j.} \tag{3.32}
\]

Indeed, (3.8), (3.12), and (3.19) give

\[
 {\sqrt {L_j}|J_{L_j}|\over
  x_{0,j}[-g(L_j)]}=O_A(L_j\lambda_j^{-A})\longrightarrow0,
\]

so the exact gate (3.14) applies.  This establishes an unbounded central
sign subsequence, not positivity at every large parameter.

## 4. Why the global scalar sign remains an RH barrier

There is a self-contained conditional check of all signs.  Assume RH and
write the nonzero critical-line ordinates as `+/-gamma`, with multiplicity.
The centered paired Hadamard product gives, first for a finite symmetric
zero set and then by its canonical limit,

\[
 {\xi_R'\over\xi_R}(1/2+q)
 =2q\sum_{\gamma>0}{1\over q^2+\gamma^2}.              \tag{4.1}
\]

Substitution in (1.16), or termwise inversion for a finite zero set followed
by the canonical limit, gives

\[
 \boxed{
 g(T)=-2\sum_{\gamma>0}{1-\cos(\gamma T)\over\gamma^2}
 \leq0\qquad\hbox{under RH}.}                          \tag{4.2}
\]

Formula (4.2) is used only inside the RH branch of the unconditional case
split in Theorem 3.5.  If a zero is off the critical line, its centered
exponent has nonzero real part and the positive `1-cos` representation is
unavailable.  Replacing the canonical complex zero sum by (4.2) outside
that branch would assume the desired zero location.

The unadmitted Suzuki paper cited in Section 0 proves that pointwise
nonpositivity of this same `g` for every real `T` is equivalent to RH.  This
explains, but does not supply, the missing sign.  In particular, an absolute
PNT bound, the positivity of `K`, or monotonicity of the archimedean tail
cannot turn (3.13) into a global sign theorem.

## 5. Exact vertex-1 companion identity

Use the normalized-even weighted-Loewner coordinates

\[
 p_0=x_0,\qquad p_n=2x_n\quad(n\geq1).                  \tag{5.1}
\]

Equation (2.4) in the checkpoint-0.79 vertex formula gives, after no
approximation,

\[
 d_1={2p_1\over L}
 \sum_{j\ne1}p_j{A_1-j^2A_j\over1-j^2}.               \tag{5.2}
\]

Define

\[
 T_1=\sum_{j\ne1}p_j{A_1-A_j\over1-j^2}.              \tag{5.3}
\]

Since

\[
 {A_1-j^2A_j\over1-j^2}
 =A_j+{A_1-A_j\over1-j^2},                            \tag{5.4}
\]

and `sqrt(L)*J_L=sum_j p_j*A_j`, one obtains the exact identity

\[
 \boxed{
 d_1={2p_1\over L}\{\sqrt L\,J_L-p_1A_1+T_1\}.}      \tag{5.5}
\]

Equivalently,

\[
 d_1=-{2p_1^2\over L}g(L)+{2p_1\over L}E_1,           \tag{5.6}
\]

\[
 E_1=\sqrt L\,J_L-p_1\{A_1-g(L)\}+T_1.              \tag{5.7}
\]

Thus a precise sufficient condition, independent of the sign of `p_1`, is

\[
 \boxed{
 g(L)<0,qquad |E_1|<|p_1|[-g(L)]
 \quad\Longrightarrow\quad d_1>0.}                   \tag{5.8}
\]

The admitted fixed-mode asymptotic gives `p_1/p_0->-2`.  Therefore, on a
subsequence satisfying (3.14) together with

\[
 {E_1\over p_1g(L)}\longrightarrow0,                  \tag{5.9}
\]

one would have

\[
 {d_1\over d_0}\longrightarrow
 {p_1^2\over p_0^2}=4.                                \tag{5.10}
\]

Neither the low-frequency screw difference `A_1-g(L)` nor the collective
term `T_1` is controlled by the current source locks.  Equations
(5.8)--(5.10) are conditional reductions, not actual-source sign claims.

## 6. Surviving task

The central vertex now has a rigorous positive sign on the unbounded
strict-half-integer subsequence of Theorem 3.5.  What survives is:

1. for vertex 1, prove (5.8), for example through the relative
   regularity (5.9);
2. address every remaining vertex, positive-graph connectivity,
   and the collective routing contraction.

Theorem 3.5 is existential and its threshold is ineffective; it does not
prove `g(T)<=0` for every `T` or identify all favorable grid points.  The
exact cancellation in this note decides the central degree only on its
selected subsequence.  No vertex-1 sign or routing consequence follows.
The formal state remains `P0_INVALIDATED`.
