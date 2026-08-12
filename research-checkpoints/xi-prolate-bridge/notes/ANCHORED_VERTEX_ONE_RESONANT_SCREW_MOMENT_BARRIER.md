# Anchored vertex one: resonant screw-moment barrier

## 0. Claim boundary

This note sharpens the vertex-1 remainder in
`notes/ANCHORED_CENTRAL_DEGREE_SCREW_BARRIER.md`.  It proves an exact
Green-function identity

\[
 E_1=\sqrt L\,J_L+\omega\int_0^L\Psi(t)W_{1,L}(t)\,dt,
 \qquad \omega={2\pi\over L},                         \tag{0.1}
\]

and identifies the second term as the new source-specific moment which is
not controlled by the checkpoint-0.80 screw margin.  The same calculation
shows precisely why the polynomial--`Xi` cancellation which makes `J_L`
flat does not survive the resonant vertex-1 Green transform.

An exact synthetic combined-discrepancy family keeps the actual anchor
coordinates unchanged, has a fixed positive screw margin and `J_L=0`, but
has `d_1<0`.  The family is **not** the pinned
pole--archimedean--minus-prime source.  It proves only that the existing
anchor asymptotics, central flatness, and endpoint screw margin do not imply
the vertex-1 sign.  It makes no assertion that the actual arithmetic degree
is negative.

No actual-source vertex-1 sign, positive-graph connectivity, routing
contraction, finite real-rootedness, Riemann-hypothesis conclusion, or
Lambda bound is proved.  The formal project state remains `P0_INVALIDATED`.

The binding conventions remain those of `P0_SOURCE_LOCK.json` and
`P0_NORMALIZATION_AUDIT.md`: `L=2*log(lambda)`, centered `exp(-izt)`,
Lebesgue measure, zero extension, inversion symmetry, source normalization,
the inclusive inventory `1<n<=lambda^2`, and the minus sign of the prime
block.

## 1. Exact screw form of the vertex-1 remainder

Retain the complete scalar-deleted source discrepancy

\[
 R(t)=F_{\rm align}(t)-c_\infty,
 \qquad g(T)=\int_0^T R(t)\,dt,
 \qquad \Psi(T)=-g(T).                                \tag{1.1}
\]

Thus `R=-Psi'` almost everywhere and `Psi(0)=0`.  On `[0,L]`, put

\[
 A_n=\int_0^LR(t)\cos(n\omega t)\,dt,
 \qquad A_0=g(L),                                     \tag{1.2}
\]

and write the normalized-even projected anchor as

\[
 F_L(t):=\sqrt L\,f_N(t)
 =\sum_{j=0}^Np_j\cos(j\omega t),
 \qquad p_0=x_0,\quad p_j=2x_j\ (j\geq1).            \tag{1.3}
\]

Then

\[
 \sqrt L\,J_L=\int_0^LR(t)F_L(t)\,dt
              =\sum_{j=0}^Np_jA_j.                   \tag{1.4}
\]

For `n>=1`, improper integration by parts at zero is legitimate because
`Psi(0)=0`, and the endpoint cosine is one.  Hence

\[
 \boxed{
 A_n-g(L)=-n\omega B_n,
 \qquad B_n=\int_0^L\Psi(t)\sin(n\omega t)\,dt,
 \qquad B_0:=0.}                                      \tag{1.5}
\]

Define

\[
 Q_{1,L}(t)=\sum_{\substack{0\leq j\leq N\\j\ne1}}
 p_j{\cos(\omega t)-\cos(j\omega t)\over1-j^2},      \tag{1.6}
\]

\[
 S_{1,L}(t)=-p_1\{\cos(\omega t)-1\}+Q_{1,L}(t),     \tag{1.7}
\]

and

\[
 W_{1,L}(t)={S_{1,L}'(t)\over\omega}
 =p_1\sin(\omega t)
 +\sum_{j\ne1}p_j
 {j\sin(j\omega t)-\sin(\omega t)\over1-j^2}.       \tag{1.8}
\]

Both `S_(1,L)(0)` and `S_(1,L)(L)` vanish exactly.

### Theorem 1.1 (resonant screw-moment identity)

For every finite `N>=1`, the exact vertex-1 remainder from equations
(5.6)--(5.7) of the central screw note is

\[
 \boxed{
 E_1=\sqrt L\,J_L+{\cal M}_1(L),
 \qquad
 {\cal M}_1(L)=\omega\int_0^L\Psi(t)W_{1,L}(t)\,dt.} \tag{1.9}
\]

Consequently

\[
 \boxed{
 d_1={2p_1^2\over L}\Psi(L)
       +{2p_1\over L}
        \{\sqrt L\,J_L+{\cal M}_1(L)\}.}             \tag{1.10}
\]

**Proof.**  Equation (5.3) of the central screw note is exactly

\[
 T_1=\int_0^LR(t)Q_{1,L}(t)\,dt.                      \tag{1.11}
\]

Therefore its equation (5.7) gives

\[
 E_1=\int_0^LR(t)F_L(t)\,dt
     +\int_0^LR(t)S_{1,L}(t)\,dt.                     \tag{1.12}
\]

The first integral is (1.4).  In the second, use `R=-Psi'`; the two
boundary terms vanish by (1.7), and (1.8) gives

\[
 \int_0^LR(t)S_{1,L}(t)\,dt
 =\int_0^L\Psi(t)S_{1,L}'(t)\,dt
 =\omega\int_0^L\Psi(t)W_{1,L}(t)\,dt.               \tag{1.13}
\]

This proves (1.9).  Substituting `g(L)=-Psi(L)` into equation (5.6) of
the central screw note proves (1.10).  \(\square\)

The same identity follows directly from (1.5):

\[
 -p_1(A_1-g)+T_1
 =\omega\left\{p_1B_1+
 \sum_{j\ne1}p_j{jB_j-B_1\over1-j^2}\right\}
 ={\cal M}_1(L).                                    \tag{1.14}
\]

Thus (1.9) records the complete cancellation between `A_1-g` and `T_1`;
neither term should be estimated separately.

## 2. The exact missing theorem on the screw subsequence

On the unconditional strict-half-integer subsequence of Theorem 3.5 in the
central screw note,

\[
 \Psi(L_j)>c_{\rm screw}={1\over2T_*^2}.              \tag{2.1}
\]

The admitted fixed-mode asymptotic gives

\[
 p_{1,j}<0,
 \qquad |p_{1,j}|\asymp L_j^{-1/2},                   \tag{2.2}
\]

and the all-order convolution theorem gives

\[
 {\sqrt{L_j}J_{L_j}\over
  |p_{1,j}|\Psi(L_j)}=O_A(L_j\lambda_j^{-A})=o(1).    \tag{2.3}
\]

It follows from (1.9) that the proposed relative regularity is equivalent
to the single new moment statement

\[
 \boxed{
 {E_1\over p_1g(L)}\longrightarrow0
 \quad\Longleftrightarrow\quad
 {\omega\displaystyle\int_0^L\Psi(t)W_{1,L}(t)\,dt
  \over |p_1|\Psi(L)}\longrightarrow0}               \tag{2.4}
\]

along that subsequence.  Here `p_1*g(L)=|p_1|*Psi(L)>0` eventually.

For the sign alone, the sharp one-sided gate obtained from (1.10) is

\[
 \boxed{
 \sqrt L\,J_L+{\cal M}_1(L)<|p_1|\Psi(L)
 \quad\Longrightarrow\quad d_1>0.}                  \tag{2.5}
\]

The absolute gate in the central screw note is a convenient stronger
condition.  Neither (2.4) nor (2.5) follows from (2.1): the latter controls
one endpoint value of `Psi`, while (2.4) is a signed moment over its whole
history.

## 3. Exact resonant Green decomposition

The obstruction in (2.4) is not an artifact of the Fourier sum.  Applying
`d^2/dt^2+omega^2` termwise to (1.6) gives

\[
 \boxed{
 Q_{1,L}''+\omega^2Q_{1,L}
 =-\omega^2\{F_L-p_1\cos(\omega t)\},}                \tag{3.1}
\]

with `Q_(1,L)(0)=Q_(1,L)'(0)=0`.  Duhamel's formula is

\[
 Q_{1,L}(t)=-\omega\int_0^t
 \sin\{\omega(t-u)\}F_L(u)\,du
 +{p_1\omega t\over2}\sin(\omega t).                \tag{3.2}
\]

The anchor is symmetric about `a=L/2`.  Orthogonality and symmetry give

\[
 \int_0^LF_L(u)\cos(\omega u)\,du={Lp_1\over2},
 \qquad
 \int_0^LF_L(u)\sin(\omega u)\,du=0.                 \tag{3.3}
\]

Define the broad resonant profile

\[
 \phi_L(t)=
 \begin{cases}
 1-\cos(\omega t)+{\omega t\over2}\sin(\omega t),
       &0\leq t\leq a,\\[3pt]
 1-\cos(\omega t)+({\omega t\over2}-\pi)\sin(\omega t),
       &a\leq t\leq L,
 \end{cases}                                          \tag{3.4}
\]

and the centered localized divided difference

\[
 \ell_L(t)=
 \begin{cases}
 -\omega\displaystyle\int_0^t
       \sin\{\omega(t-u)\}F_L(u)\,du,&t\leq a,\\[6pt]
 +\omega\displaystyle\int_t^L
       \sin\{\omega(t-u)\}F_L(u)\,du,&t\geq a.
 \end{cases}                                          \tag{3.5}
\]

Equations (3.2)--(3.3) give the exact split

\[
 \boxed{S_{1,L}=p_1\phi_L+\ell_L.}                    \tag{3.6}
\]

Both summands are symmetric about `a`; `phi_L` vanishes at `0,L` and has
a derivative cusp at `a`.  Formula (3.6) is the physical-space form of the
resonant cancellation between `A_1-g` and `T_1`.

Now let `H` be one fixed formal arithmetic correction on the centered full
line, so that

\[
 \widehat H(z)=P(z^2)\Xi(z).                           \tag{3.7}
\]

The full-line model of (3.5) is the even function

\[
 \ell_{H,\omega}(x)
 =-\omega\sqrt L\int_{|x|}^\infty
 \sin\{\omega(u-|x|)\}H(u)\,du.                      \tag{3.8}
\]

### Proposition 3.1 (loss of `Xi` divisibility)

Under the centered Fourier convention,

\[
 \boxed{
 \widehat{\ell_{H,\omega}}(z)
 =\omega^2\sqrt L\,
 {\widehat H(z)-\widehat H(\omega)\over z^2-\omega^2}.} \tag{3.9}
\]

The quotient is entire, but it is generally not divisible by `Xi`.

**Proof.**  Away from zero, (3.8) satisfies

\[
 \ell_{H,\omega}''+\omega^2\ell_{H,\omega}
 =-\omega^2\sqrt L\,H.                                \tag{3.10}
\]

Its first derivative has jump
`omega^2*sqrt(L)*widehat(H)(omega)` at zero.  Taking the distributional
Fourier transform of (3.10), including that jump, gives (3.9).  The
numerator vanishes at `z=+/-omega`, so both apparent poles are removable.
At a zero `zeta` of `Xi`, distinct from `+/-omega`, (3.7)--(3.9) give

\[
 \widehat{\ell_{H,\omega}}(\zeta)
 =-\omega^2\sqrt L\,
 {P(\omega^2)\Xi(\omega)\over\zeta^2-\omega^2},       \tag{3.11}
\]

which is nonzero whenever `P(omega^2)*Xi(omega)` is nonzero.  In
particular this applies to the leading correction for all sufficiently
small positive `omega`.  \(\square\)

Lemma 3.1 of the central screw note flattened `J_L` by multiplying the
one-sided logarithmic derivative by a complete `Xi` factor.  Equation
(3.11) shows that the resonant Green operation removes that factor.  The
all-order polynomial--`Xi` tower therefore does not supply (2.4).

## 4. Why a low-frequency Taylor expansion does not close the gap

Although `omega` tends to zero, the phase `omega*t` spans the complete
interval `[0,2*pi]`.  There is no uniform small-phase region on `[0,L]`.
For example, the exact absolutely convergent moment expansion is

\[
 A_1-g(L)=\sum_{k\geq1}{(-1)^k\omega^{2k}\over(2k)!}
 \int_0^Lt^{2k}R(t)\,dt.                              \tag{4.1}
\]

Already the first signed moment obeys

\[
 \int_0^Lt^2R(t)\,dt
 =-L^2\Psi(L)+2\int_0^Lt\Psi(t)\,dt.                  \tag{4.2}
\]

Thus an endpoint margin for `Psi(L)` does not control even the first
history term.  Keeping the complete series merely repackages the same
missing moment as (1.9).  The available absolute PNT envelope is much
larger than the fixed margin (2.1), so applying absolute values to (4.1)
cannot prove (2.4).

## 5. Exact structural countermodel

The next theorem uses a synthetic final combined discrepancy.  It retains
the exact source-Cauchy coefficient formulas, but not the pinned arithmetic
function `R`.

### Theorem 5.1 (screw margin and zero central convolution do not sign vertex 1)

Fix `L>0`, `N>=2`, and any real anchor with

\[
 p_0>0,\qquad p_1<0,\qquad p_2>0.                     \tag{5.1}
\]

Choose `c>0`, put `g=-c`, and define

\[
 A_2=-{p_0g\over p_2}>0,                              \tag{5.2}
\]

\[
 \boxed{
 R_{\rm syn}(t)={g\over L}+{2A_2\over L}
                  \cos{4\pi t\over L}.}              \tag{5.3}
\]

Then

\[
 \Psi_{\rm syn}(L)=c,
 \qquad \sqrt L\,J_L=0,
 \qquad d_0=-{2p_0^2g\over L}>0,                      \tag{5.4}
\]

but

\[
 \boxed{d_1=-{8\over3L}p_0p_1g<0.}                   \tag{5.5}
\]

**Proof.**  Cosine orthogonality gives

\[
 A_0=g,\qquad A_2=-{p_0g\over p_2},\qquad
 A_j=0\quad(j\ne0,2).                                \tag{5.6}
\]

Hence

\[
 \sqrt L\,J_L=\sum_jp_jA_j=p_0g+p_2A_2=0.           \tag{5.7}
\]

The central identity gives the first degree in (5.4).  In the exact
vertex-1 formula

\[
 d_1={2p_1\over L}\sum_{j\ne1}p_j
 {A_1-j^2A_j\over1-j^2},                              \tag{5.8}
\]

only `j=2` survives.  Its contribution is

\[
 p_2{0-4A_2\over1-4}={4\over3}p_2A_2
 =-{4\over3}p_0g.                                    \tag{5.9}
\]

Equations (5.8)--(5.9) prove (5.5), whose sign follows from (5.1) and
`g<0`.  Finally, direct integration of (5.3) gives
`Psi_syn(L)=-g=c`.  \(\square\)

The corresponding exact displacement coefficients are

\[
 b_n=-{2n\over L}A_n,                                 \tag{5.10}
\]

so only `b_2=-4*A_2/L` is nonzero.  Thus this is an exact smooth
combined-displacement/source-Cauchy model, not merely a list of unrelated
moments.  It can be applied while leaving every coordinate of the actual
natural-cutoff anchor unchanged; the eventual fixed-mode signs provide
(5.1).  What it changes is precisely the locked arithmetic discrepancy.

For completeness, its vertex-1 remainder is

\[
 E_1=g\left(p_1-{4p_0\over3}\right)
 =c\left(|p_1|+{4p_0\over3}\right)
 >|p_1|\Psi(L),                                      \tag{5.11}
\]

so it fails the sharp gate (2.5) by an explicit margin even though the
central convolution vanishes exactly.

## 6. Surviving actual-source target

The next valid vertex-1 advance must prove, for the pinned complete source
and on the same favorable strict-half-integer subsequence, either the
relative moment theorem

\[
 \boxed{
 \omega_j\int_0^{L_j}\Psi(t)W_{1,L_j}(t)\,dt
 =o\bigl(|p_{1,j}|\Psi(L_j)\bigr),}                    \tag{6.1}
\]

or the weaker one-sided inequality (2.5).  This estimate must retain the
complete pole--archimedean--minus-prime cancellation.  A separate absolute
prime envelope, fixed-mode coefficient convergence, polynomial--`Xi`
divisibility before the Green transform, or the endpoint margin alone does
not supply it.

Even (6.1) would establish only the vertex-1 sign and the ratio
`d_1/d_0->4` on that subsequence.  Every higher vertex, positive-graph
connectivity, and collective routing contraction would remain open.
