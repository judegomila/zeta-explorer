# Locked half-power far-Schur graph reduction

## 0. Claim boundary

This note places the far boundary at the exact half-power of the locked
Fourier cutoff.  The resulting far block has a floor of order `lambda^2`,
while its Schur shear into the retained block is bounded by a constant.  It
also gives the exact far-shorted sampling map governing the graph-observability
constant.

This is a finite-dimensional reduction.  The existing compact-window
absolute-sampling theorem closes the far sampling inverse at the stronger
scale `O((1+log(lambda))/sqrt(lambda))`.  It does not prove positivity of the
retained Schur complement or the cancellation-preserving retained sampling
inverse.  An exact two-dimensional countermodel shows that the already-proved
quotient action, even when combined with a signed Loewner lower comparison,
does not imply the required retained graph estimate without an additional
orientation theorem.

No zero table or global Weil positivity is used.  This proves neither the
strict sector signs, equation (5.2), locally uniform determinant convergence,
nor the Riemann hypothesis.  The formal project state remains
`P0_INVALIDATED`.

## 1. Exact half-power split

On the locked grid put

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},
 \qquad
 N=2^{2400p^2}=2^{9600\lambda^2},
 \qquad
 R=2^{1200p^2}=\sqrt N.                                \tag{1.1}
\]

Let `H_+` be the exact finite inversion-even space, let `kappa in H_+` be
the normalized projected comparison state, and put

\[
 K=H_+\cap\kappa^\perp,
 \qquad
 B_+=A-U I\quad\hbox{on }K,                              \tag{1.2}
\]

where `A` is the complete even-complement compression and `U=U_Z=o(d_6)`
is the admitted live upper shift.  Equivalently, by the exact weighted-PNT
normal form,

\[
 B_+=\left.\Pi_K
 \bigl((c_*-U)I+A_{\rm tail}-T_D\bigr)\Pi_K\right|_K.    \tag{1.3}
\]

Let `P_>R^+` be the even Fourier projection onto labels `R<n<=N`, and
define

\[
 F=K\cap\operatorname {ran}P_{>R}^+,
 \qquad
 Y=K\ominus F.                                           \tag{1.4}
\]

Since `dim(K)=N` and the raw high-even space has dimension `N-R`,

\[
 \boxed{\dim Y\leq R+1=\sqrt N+1.}                       \tag{1.5}
\]

If a previously controlled physical low space `K_L` is to be retained, one
may instead intersect `F` with `K_L^perp`; then the right side of (1.5)
increases only by `dim(K_L)=O(lambda^2)`.

Relative to `K=Y direct-sum F`, write

\[
 B_+=
 \begin{bmatrix}
  D&\Gamma^*\\
  \Gamma&H
 \end{bmatrix}.                                           \tag{1.6}
\]

The exact high-mode theorem gives

\[
 \boxed{H\succeq G_R I_F,}                               \tag{1.7}
\]

where

\[
 G_R=\log{R+1\over2}-{1\over2\pi(R+1)}
      -C_a(\lambda)-c_\lambda-U.                         \tag{1.8}
\]

Because `C_a(lambda)+c_lambda=O(lambda*log(lambda))`, equations
(1.1) and (1.8) give

\[
 \boxed{
 G_R=4800(\log2)\lambda^2+o(\lambda^2)>0}                \tag{1.9}
\]

eventually.  The source Cauchy representation also gives

\[
 \|\Gamma\|
 \leq K_{\lambda,N}:=\log(N+2)+C_{|a|}(\lambda)+c_\lambda.
                                                                    \tag{1.10}
\]

Thus, with

\[
 \mathscr S=H^{-1}\Gamma,
\]

one has

\[
 \boxed{\|\mathscr S\|\leq{K_{\lambda,N}\over G_R}=2+o(1).}
                                                                    \tag{1.11}
\]

For clarity in (1.10), the scalar shift has no cross block.  Moreover,
`F` is contained in `ran(P_>R^+)`, so the high-row diagonal contribution
sees only `|n|>R` and is bounded by `log(N+2)+C_|a|(lambda)`; the remaining
Cauchy commutator has norm at most `c_lambda`.  This proves (1.10) even
though `Y` is not the raw low Fourier space.

The half-power location is what makes the shear bounded: both
`K_(lambda,N)` and `G_R` have leading order `log N`, with ratio two.

## 2. Exact sign and floor transfer

Define the far-shorted retained operator

\[
 \Sigma=D-\Gamma^*H^{-1}\Gamma.                          \tag{2.1}
\]

### Theorem 2.1 (constant-shear sign reduction)

For all sufficiently large locked parameters,

\[
 \boxed{
 \operatorname {inertia}(B_+)
 =\operatorname {inertia}(\Sigma)+(\dim F,0,0).}          \tag{2.2}
\]

Here inertia tuples are ordered as `(n_+,n_-,n_0)`.

In particular,

\[
 \boxed{B_+\succ0\quad\Longleftrightarrow\quad\Sigma\succ0.}
                                                                    \tag{2.3}
\]

If `Sigma>=sigma*I_Y` with `sigma>0`, then

\[
 \boxed{
 B_+\succeq
 {\min\{\sigma,G_R\}\over\phi(\|\mathscr S\|)^2}I_K,
 \qquad
 \phi(t)={\sqrt{t^2+4}+t\over2}.}                       \tag{2.4}
\]

**Proof.**  The exact shear factorization is

\[
 B_+=
 \begin{bmatrix}I&\mathscr S^*\\0&I\end{bmatrix}
 \begin{bmatrix}\Sigma&0\\0&H\end{bmatrix}
 \begin{bmatrix}I&0\\\mathscr S&I\end{bmatrix}.       \tag{2.5}
\]

Since `H>0`, congruence proves (2.2)--(2.3).  The norm of either triangular
shear, and of its inverse, is at most `phi(||mathscr S||)`.  Applying the
inverse norm to (2.5) proves (2.4).  \(\square\)

Unlike a unit-floor far split with a growing shear, (1.11) makes the loss in
(2.4) an absolute constant.  The theorem does not supply `sigma` or the sign
of `Sigma`.

## 3. Exact far-shorted graph map

Let

\[
 \mathsf Z=[\mathsf Z_Y,\mathsf Z_F]:Y\oplus F\longrightarrow\mathcal Z
\]

be the paired-sampling analysis, so `G_+=mathsf Z^*mathsf Z`.  Define the
effective retained sampling map

\[
 \boxed{\mathsf Z_{\rm eff}=\mathsf Z_Y-\mathsf Z_F\mathscr S.}
                                                                    \tag{3.1}
\]

### Theorem 3.1 (exact graph-Schur factorization)

If `Sigma>0`, then

\[
 \boxed{
 \mathsf ZB_+^{-1}
 =\left[
   \mathsf Z_{\rm eff}\Sigma^{-1},
   \mathsf Z_FH^{-1}
    -\mathsf Z_{\rm eff}\Sigma^{-1}\mathscr S^*
  \right].}                                               \tag{3.2}
\]

Consequently,

\[
 \boxed{
 \mathfrak C(B_+,G_+)^{1/2}
 \leq\sqrt{1+\|\mathscr S\|^2}\,
       \|\mathsf Z_{\rm eff}\Sigma^{-1}\|
      +\|\mathsf Z_FH^{-1}\|.}                          \tag{3.3}
\]

**Proof.**  Invert (2.5), multiply on the left by
`[mathsf Z_Y,mathsf Z_F]`, and collect the first factor as (3.1).  This gives
(3.2).  Split the row operator in (3.2) into

\[
 [\mathsf Z_{\rm eff}\Sigma^{-1},
  -\mathsf Z_{\rm eff}\Sigma^{-1}\mathscr S^*]
 +[0,\mathsf Z_FH^{-1}]
\]

and use the triangle inequality for operator norms.  \(\square\)

### Theorem 3.2 (the far sampling inverse is already negligible)

On the locked schedule (1.1),

\[
 \boxed{
 \|\mathsf Z_FH^{-1}\|
 \leq {\sqrt{B_{\rm abs}(\lambda,N)}\over G_R}
 =O\!\left({1+\log\lambda\over\sqrt\lambda}\right).}    \tag{3.4}
\]

Here `B_abs(lambda,N)` is the explicit constant in equation (4.3) of
`notes/FULL_EXTERIOR_SAMPLING_FALLBACK.md`.  In particular, the far term is
smaller than the required graph scale and is no longer an open estimate.

**Proof.**  The compact-window absolute-sampling theorem applies to every
unit vector in `E_N`, sectorwise and with the paired sampling convention.
Since `F` is a subspace of the even part of `E_N`,

\[
 \|\mathsf Z_F\|^2\leq B_{\rm abs}(\lambda,N).             \tag{3.5}
\]

The high-block floor (1.7) gives `||H^(-1)||<=G_R^(-1)`, so submultiplicativity
proves the first inequality in (3.4).

It remains only to evaluate the already explicit constant on the locked
schedule.  For `lambda>=5/2`, `L=2 log(lambda)>1` and

\[
 V_N^0+{3\over4}\sqrt L\leq 10N,
 \qquad
 \log(H_N+2)\leq2\log N+\log102.                          \tag{3.6}
\]

Indeed `sqrt(2N+1)<=sqrt(3N)<=sqrt(3)N` and
`sqrt(L)>=sqrt(2 log(5/2))`; these bounds make the first two terms smaller
than `7.3N`, while the last endpoint term is smaller than `N` on this
schedule.  Since
`log N=9600(log 2)lambda^2`, the exact formula for `B_abs` therefore gives

\[
 B_{\rm abs}(\lambda,N)
 =O\!\left(\lambda^3(1+\log\lambda)^2\right).             \tag{3.7}
\]

Equation (1.9) gives `G_R` of order `lambda^2`, proving the final estimate
in (3.4).  No zero reality, Weil positivity, or lower sampling inequality is
used.  \(\square\)

By (1.11), the global target in
`notes/SIGNED_GRAPH_OBSERVABILITY_REDUCTION.md` follows if the right side of
(3.3) is

\[
 O\!\left(
 {\lambda^2\sqrt{\operatorname {polylog}(\lambda)}
  \over\sqrt{d_8}}
 \right).                                                \tag{3.8}
\]

Equation (3.1) retains cancellation between direct retained sampling and
sampling returned through the far solve.  Theorem 3.2 closes the second term
in (3.3); the first, cancellation-preserving retained term is not currently
bounded at the scale (3.8).

### Theorem 3.3 (sampling-free retained signed target)

Let `K_L` be the admitted low physical range in `K`, let `Delta_L>0` be the
block-quotient metric of `notes/BLOCK_QUOTIENT_ACTION_THEOREM.md`, and put

\[
 K_H=K\ominus K_L,
 \qquad
 \Delta=\Delta_L\oplus I_{K_H}.                         \tag{3.9}
\]

Define the `B_+`-harmonic lift of the retained space by

\[
 \mathsf E:Y\longrightarrow K=Y\oplus F,
 \qquad
 \mathsf Ey=(y,-\mathscr Sy),                            \tag{3.10}
\]

and pull the squared positive quotient metric back to `Y`:

\[
 \boxed{
 \mathcal D_Y=(\mathsf E^*\Delta^2\mathsf E)^{1/2}>0.}   \tag{3.11}
\]

Then the already-proved positive-sampling estimates imply

\[
 \boxed{
 \|\mathsf Z_{\rm eff}\mathcal D_Y^{-1}\|^2
 \leq\|\mathsf Z\Delta^{-1}\|^2
 =O\!\left(
 {\lambda^3\operatorname {polylog}(\lambda)\over d_8}
 \right).}                                               \tag{3.12}
\]

Consequently, after Theorem 3.2, the complete graph target (3.8) follows
from the two retained signed statements

\[
 \boxed{
 \Sigma\succ0,
 \qquad
 \|\mathcal D_Y\Sigma^{-1}\|
 =O\!\left(\lambda^{1/2}
             \operatorname {polylog}(\lambda)
       \right).}                                         \tag{3.13}
\]

The unspecified polylogarithmic powers in (3.12)--(3.13) may be combined
into the one allowed in (3.8).

**Proof.**  Equation (4.6) of the block-quotient theorem gives

\[
 \|\mathsf Z|_{K_L}\Delta_L^{-1}\|^2
 =O\!\left({\lambda^3\operatorname {polylog}(\lambda)
             \over d_8}\right).
\]

On `K_H`, the compact-window theorem gives
`||mathsf Z|_(K_H)||^2<=B_abs(lambda,N)`.  The row-operator identity, with
the low/high sampling cross terms retained, therefore yields

\[
 \|\mathsf Z\Delta^{-1}\|^2
 \leq
 O\!\left({\lambda^3\operatorname {polylog}(\lambda)
             \over d_8}\right)
 +B_{\rm abs}(\lambda,N).
                                                               \tag{3.14}
\]

Equation (3.7) and `0<d_8<1` absorb the last term into the first.

Next, `mathsf Z_eff=mathsf Z mathsf E` by (3.1) and (3.10), while

\[
 (\Delta\mathsf E\mathcal D_Y^{-1})^*
 (\Delta\mathsf E\mathcal D_Y^{-1})=I_Y.              \tag{3.15}
\]

Thus `Delta mathsf E mathcal D_Y^(-1)` is an isometry and

\[
 \mathsf Z_{\rm eff}\mathcal D_Y^{-1}
 =\mathsf Z\Delta^{-1}
   (\Delta\mathsf E\mathcal D_Y^{-1}),                 \tag{3.16}
\]

which proves (3.12).  Finally,

\[
 \mathsf Z_{\rm eff}\Sigma^{-1}
 =(\mathsf Z_{\rm eff}\mathcal D_Y^{-1})
   (\mathcal D_Y\Sigma^{-1}).                          \tag{3.17}
\]

Equations (3.12)--(3.13) give the first term of (3.3) at the scale (3.8),
and Theorem 3.2 gives the second.  \(\square\)

The metric (3.11) is not a replacement for the signed operator.  It records
the already-proved positive sampling geometry after the exact far return;
all missing sign and inverse orientation remain in (3.13).

## 4. Why quotient action plus a form floor is insufficient

The following exact model isolates the remaining noncommutative orientation.
For `0<r<1`, `t>0`, and `C>0`, put

\[
 \Delta=t\begin{bmatrix}r&0\\0&1\end{bmatrix},
 \qquad
 P=\begin{bmatrix}1/2&1/4\\1/4&1/2\end{bmatrix},        \tag{4.1}
\]

\[
 B=t\begin{bmatrix}\sqrt r&0\\0&1\end{bmatrix}
 P^{-1}
 \begin{bmatrix}\sqrt r&0\\0&1\end{bmatrix},
 \qquad
 \mathsf Z=\sqrt{Ct}\begin{bmatrix}0&1\end{bmatrix}.    \tag{4.2}
\]

Since `0<P<=I`,

\[
 \boxed{B\succeq\Delta,
 \qquad G:=\mathsf Z^*\mathsf Z\preceq C\Delta.}        \tag{4.3}
\]

Direct inversion gives

\[
 \boxed{
 \|\mathsf Z\Delta^{-1}\|^2={C\over t},
 \qquad
 \|\mathsf ZB^{-1}\|^2
 ={C\over t}\left({1\over16r}+{1\over4}\right).}       \tag{4.4}
\]

Take

\[
 t=d_8,
 \qquad r=\lambda^{-2},
 \qquad C=\lambda^3\operatorname {polylog}(\lambda).     \tag{4.5}
\]

Then

\[
 \|\Delta^{-1}\|={\lambda^2\over d_8},
 \qquad
 \|\mathsf Z\Delta^{-1}\|^2
 ={\lambda^3\operatorname {polylog}(\lambda)\over d_8}, \tag{4.6}
\]

matching the proved low quotient-action scales, but

\[
 \boxed{
 \mathfrak C(B,G)
 =\Theta\!\left(
 {\lambda^5\operatorname {polylog}(\lambda)\over d_8}
 \right),}                                               \tag{4.7}
\]

one power of `lambda` larger than the sufficient target.  Thus a signed
Loewner comparison `B>=mu*Delta`, even combined with the known quotient
action of `Delta`, cannot by itself prove graph observability.  The missing
input must preserve the relative orientation of `B`, `G`, and the small
directions of the retained Schur complement.

## 5. Remaining theorem

The half-power split removes the conditioning loss from the far shear, and
Theorem 3.2 closes the far sampling inverse.  The remaining source-specific
tasks are:

1. prove `Sigma>0` for the actual complete pole--archimedean--minus-prime
   operator; and
2. prove the sampling-free signed inverse-energy estimate in (3.13), or a
   sharper vector-specific substitute.

Magnitude-only PNT envelopes and a scalar form floor do not provide these
orientations.  The exact identities above reduce the problem but do not
establish either remaining signed estimate.
