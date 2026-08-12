# Multiscale response-cone geometry and the exact rotated-anchor Schur chart

## 0. Claim boundary and outcome

This note attacks the two inputs left open in Section 5 of
`SAME_ANCHOR_ENDPOINT_RATE_ATTACK.md`: the all-response reserve of a second
anchor and the rotation of the even Schur data to that anchor.

There are two exact conclusions.

1.  For the source response vectors

    \[
      b_\alpha=\left(1,{\sqrt2\alpha^2\over1+\alpha^2},\ldots,
      {\sqrt2\alpha^2\over N^2+\alpha^2}\right),
      \qquad 0\leq\alpha\leq\infty,
    \]

    the largest possible normalized response-cone depth is

    \[
      \boxed{\displaystyle
      \sup_{\|z\|=1}\inf_\alpha
      {\langle b_\alpha,z\rangle\over\|b_\alpha\|}
      =\Theta((1+\log(N+1))^{-1/2}).}                 \tag{0.1}
    \]

    The lower bound is realized by an explicit sum of normalized response
    vectors on a geometric scale grid.  Thus the endpoint Fejer direction,
    whose complete cone depth is at most of order `N^(-1/2)`, is not optimal.
    But a constant-depth finite anchor is impossible.

2.  Let `T=Q_+-U I` and suppose that, in the original Ritz-anchor chart,

    \[
      T=\begin{pmatrix}q-U&b^*\\ b&B\end{pmatrix},
      \qquad B>0,
      \qquad
      \chi=\langle b,B^{-1}b\rangle-(q-U)>0.          \tag{0.2}
    \]

    For every proposed unit second anchor `z=a*kappa+v`, the positivity of
    its rotated complement, its Schur surplus, and its shifted solve are
    reconstructed exactly from the original inverse metric.  In particular,

    \[
      D_z=|a-\langle b,B^{-1}v\rangle|^2
          -\chi\langle v,B^{-1}v\rangle               \tag{0.3}
    \]

    satisfies

    \[
      \boxed{B_z>0\iff D_z>0,
      \qquad \chi_z={\chi\over D_z}.}                 \tag{0.4}
    \]

    This is the cancellation-preserving rotated inverse-metric criterion
    requested by the preceding checkpoint.  It is an identity, not an
    estimate of (0.3) for the arithmetic matrix.

Combining (0.1) with the existing coefficient-reserve theorem gives a sharp
route obstruction.  Every certificate of that form necessarily obeys

\[
 {\chi_U\over g_+}=O\!\left({1\over N^2\log(N+1)}\right). \tag{0.5}
\]

An `O((log lambda)^(-5/2))` shifted solve does not imply (0.5).  The exact
remaining source input is now the sign of (0.3), the inverse-vector estimate
in (4.6) below, and the relative surplus/floor rate (0.5), all for the same
source-derived `U` and unbounded schedule.

No zero table, global Weil positivity, or real-zero assumption is used.
Nothing below proves either shifted sector sign for the arithmetic Weil
matrix, equation (5.2) of `DIRECT_RH_ATTACK.md`, locally uniform determinant
convergence, or the Riemann hypothesis.  The formal state remains
`P0_INVALIDATED`.

## 1. Uniform estimates for the response curve

Put

\[
 r_n(\alpha)={\alpha^2\over n^2+\alpha^2},
 \qquad u_\alpha={b_\alpha\over\|b_\alpha\|},           \tag{1.1}
\]

with `r_n(0)=0` and `r_n(infinity)=1`.  Define the effective scale

\[
 d(\alpha)=\min\{N,\max\{1,\alpha\}\}.                \tag{1.2}
\]

### Lemma 1.1 (norm and cross-scale bounds)

For every `N>=2` and `0<=alpha<=beta<=infinity`, ordered by effective
scale,

\[
 {d(\alpha)\over4}\leq\|b_\alpha\|^2
 \leq9d(\alpha),                                    \tag{1.3}
\]

and

\[
 0<\langle u_\alpha,u_\beta\rangle
 \leq52\sqrt{{d(\alpha)\over d(\beta)}}.            \tag{1.4}
\]

If `d(beta)/d(alpha)<=16`, then also

\[
 \langle u_\alpha,u_\beta\rangle\geq {1\over24}.     \tag{1.5}
\]

**Proof.**  For `1<=alpha<=N`, the terms with `n<=floor(alpha)` give the
lower bound in (1.3).  For the upper bound, split at `alpha` and use

\[
 \sum_{n>\alpha}r_n(\alpha)^2
 \leq\alpha^4\sum_{n>\alpha}n^{-4}
 \leq {8\alpha\over3}.                               \tag{1.6}
\]

The ranges `alpha<=1` and `alpha>=N` are immediate.  For the cross term,
split the sum at `alpha` and `beta`:

\[
 \sum_nr_n(\alpha)r_n(\beta)
 \leq \alpha+2\alpha+{8\alpha^2\over3\beta}.         \tag{1.7}
\]

Together with (1.3), this gives (1.4); the endpoint ranges only improve the
same constants.  Finally `r_n(beta)>=r_n(alpha)` coordinatewise, so

\[
 \langle b_\alpha,b_\beta\rangle\geq\|b_\alpha\|^2.
\]

Using (1.3) and the scale ratio at most sixteen gives (1.5).  The deliberately
loose constants make every endpoint case uniform.  \(\square\)

## 2. The response-cone inradius is logarithmic

For a unit real vector `z`, write

\[
 m_N(z)=\inf_{\alpha\in[0,\infty]}
             \langle u_\alpha,z\rangle,
 \qquad
 \mathfrak r_N=\sup_{\|z\|=1}m_N(z).                \tag{2.1}
\]

Only positive values matter; a maximizer may be taken in the positive span
of the response curve.

Let

\[
 J=\lfloor\log_{16}N\rfloor,
 \qquad
 \mathcal G_N=\{0,1,16,\ldots,16^J,\infty\},         \tag{2.2}
\]

with duplicates removed, and put

\[
 S_N=\sum_{\alpha\in\mathcal G_N}u_\alpha,
 \qquad z_N={S_N\over\|S_N\|}.                      \tag{2.3}
\]

### Theorem 2.1 (explicit multiscale inradius bounds)

For every `N>=2`, if `M_N=#G_N`, then

\[
 \boxed{
 {1\over24\sqrt{37M_N}}
 \leq m_N(z_N)\leq\mathfrak r_N.}                   \tag{2.4}
\]

If `J+1` denotes the number of finite grid points
`1,16,...,16^J`, then

\[
 \boxed{\mathfrak r_N\leq {6\over\sqrt{J+1}}.}      \tag{2.5}
\]

Consequently (0.1) holds.

**Proof.**  Every effective scale lies within a factor sixteen of a member
of `G_N`.  By (1.5), its normalized response has inner product at least
`1/24` with that grid member.  All other inner products are nonnegative.
Moreover (1.4), on the ratio-sixteen grid, bounds every Gram row sum by

\[
 2+104\sum_{k\geq1}4^{-k}<37.                       \tag{2.6}
\]

Thus `||S_N||^2<=37M_N`, proving (2.4).

For the upper bound, use only the finite grid `1,16,...,16^J`.  Its Gram
operator norm is at most its largest row sum, which is below `36`.  Hence,
for every unit `z` with `m_N(z)>0`,

\[
 (J+1)m_N(z)^2
 \leq\sum_{j=0}^J|\langle u_{16^j},z\rangle|^2
 \leq36.                                             \tag{2.7}
\]

Vectors with `m_N(z)<=0` cannot improve the positive lower bound in (2.4),
so taking the supremum proves (2.5).  \(\square\)

The constants in (2.4)--(2.5) are not optimized.  Their role is to prove
the scale without a numerical convex program.  The dyadic construction is
source reconstructible and contains no matrix or eigenvector data.

### Corollary 2.2 (hybrid reserve from a closed-cone base)

Let `p` be a unit vector with `m_N(p)>=0`, let `delta>0`, and define

\[
 z={p+\delta z_N\over\|p+\delta z_N\|}.             \tag{2.8}
\]

Then

\[
 m_N(z)\geq {\delta\over1+\delta}
              {1\over24\sqrt{37M_N}},
 \qquad \|z-p\|\leq2\delta.                        \tag{2.9}
\]

If a positive Fejer comparison `p` is known to satisfy
`||p-kappa_p||<=epsilon`, then

\[
 \|z-\kappa_p\|\leq\epsilon+2\delta.               \tag{2.10}
\]

This closes the purely geometric part of the hybrid-reserve problem.  It
does not prove a sufficiently cheap positive Fejer approximation on the
same schedule as the signed matrix estimates.

## 3. A universal surplus barrier for the cone certificate

Suppose the checkpoint-0.57 coefficient-reserve certificate is applied to
some anchor and succeeds.  Its transferred depth `gamma` cannot exceed the
actual response depth of the unit even ground `x`, and
`R_N(gamma)>=N^2`.  Theorem 2.1 therefore gives the necessary inequality

\[
 {\chi_U\over g_+}
 <{\gamma^2\over R_N(\gamma)}
 \leq{\mathfrak r_N^2\over N^2}
 \leq {36\over N^2(J+1)}.                           \tag{3.1}
\]

Thus even the optimally deep response-cone anchor leaves the independent
relative estimate (0.5).  This does not say the odd block is nonpositive
when (3.1) fails.  It says only that the present cone/coefficient certificate
cannot prove its sign.

On a schedule `N/L^2 -> infinity`, (3.1) is already smaller than
`O(L^(-4)/log L)` up to the excess bandwidth factor.  The shifted-solve rate
`O(L^(-5/2))` contains no information about this surplus because the exact
Ritz-spread identity in `SAME_ANCHOR_ENDPOINT_RATE_ATTACK.md` makes the two
quantities independent.

## 4. Exact rotation to a second Ritz anchor

Return to (0.2), and write the proposed unit anchor as

\[
 z=a\kappa+v,
 \qquad v\perp\kappa,
 \qquad |a|^2+\|v\|^2=1.                            \tag{4.1}
\]

Because the Schur complement of `B` in `T` equals `-chi`, the operator `T`
is invertible and has exactly one negative eigenvalue.  Put

\[
 c_z=a-\langle b,B^{-1}v\rangle,
 \qquad
 D_z=|c_z|^2-\chi\langle v,B^{-1}v\rangle.           \tag{4.2}
\]

### Theorem 4.1 (rotated inverse-metric Schur identities)

Let

\[
 T=\begin{pmatrix}a_z&b_z^*\\b_z&B_z\end{pmatrix}
 \quad\hbox{on}\quad \mathbb Cz\oplus z^\perp.       \tag{4.3}
\]

Then

\[
 \boxed{B_z>0\iff D_z>0.}                           \tag{4.4}
\]

On that branch, let `y=T^(-1)z`, `m_z=<z,y><0`, and
`P_z=I-|z><z|`.  The complete rotated data are

\[
 \boxed{
 m_z=-{D_z\over\chi},
 \qquad
 \chi_z=\langle b_z,B_z^{-1}b_z\rangle-a_z
        ={\chi\over D_z},}                          \tag{4.5}
\]

\[
 \boxed{
 \tau_z=\|B_z^{-1}b_z\|
       ={\|P_zy\|\over|m_z|},}                      \tag{4.6}
\]

and

\[
 \boxed{
 B_z^{-1}
 =P_zT^{-1}P_z-{(P_zy)(P_zy)^*\over m_z}
 \quad\hbox{on }z^\perp.}                           \tag{4.7}
\]

In particular the exact rotated complementary floor is

\[
 g_z=\left\|
 P_zT^{-1}P_z-{(P_zy)(P_zy)^*\over m_z}
 \right\|_{z^\perp}^{-1}.                           \tag{4.7a}
\]

In the original chart the inverse vector in (4.6) is exactly

\[
 y=-{c_z\over\chi}\kappa
   +B^{-1}v+{c_z\over\chi}B^{-1}b.                  \tag{4.8}
\]

**Proof.**  Block inversion in the original chart gives

\[
 \langle z,T^{-1}z\rangle
 =\langle v,B^{-1}v\rangle-{|c_z|^2\over\chi}
 =-{D_z\over\chi}.                                 \tag{4.9}
\]

Since `T` has one negative eigenvalue, the compression to `z^perp` is
positive exactly when the scalar in (4.9) is negative.  This proves (4.4).
In the rotated chart its scalar Schur complement is `1/m_z`; hence
`chi_z=-1/m_z`, proving (4.5).  The first column of the rotated block inverse
gives

\[
 P_zy=-m_zB_z^{-1}b_z,
\]

which proves (4.6).  Comparing the lower-right block of the same inverse
gives (4.7), and direct multiplication in the original chart gives (4.8).
\(\square\)

Equations (4.2) and (4.8) preserve the cancellation between the original
coupling response and the anchor rotation.  Replacing either by separate
norm bounds can lose precisely the effect the two-anchor route needs.

### 4.2 Ordinary anchor closeness does not preserve the complement sign

The inverse metric in (4.2) cannot be replaced by an unweighted angle.  Let
`0<eta<1/2` and, in the original anchor chart, take

\[
 T_\eta=\operatorname {diag}(-1,\eta^4),
 \qquad \kappa=(1,0),
 \qquad z_\eta=(\sqrt{1-\eta^2},\eta).               \tag{4.10}
\]

Here `B=eta^4>0`, `b=0`, `chi=1`, and the original shifted solve is exactly
zero.  Also `||z_eta-kappa||->0`.  Nevertheless

\[
 D_{z_\eta}=1-\eta^2-{1\over\eta^2}<0,              \tag{4.11}
\]

so the rotated complement is not positive.  Rational Pythagorean choices
give the same counterfamily with exact rational matrices and vectors.
Therefore neither a small Hilbert-space anchor perturbation nor an excellent
original solve controls `A_z-U I`: the perturbation must be small in the
`B^{-1}` metric relative to `chi`, with the oriented cancellation in
`c_z` retained.

## 5. What remains for the exact source matrix

The multiscale theorem removes one false dichotomy.  The choices are not
limited to a constant direction with endpoint overlap `N^(-1/2)` or a Fejer
endpoint direction with complete cone depth at most `N^(-1/2)`: an explicit
multiscale direction has the optimal depth `Theta((log N)^(-1/2))`.

It does not sign either source block.  A complete two-anchor proof still has
to establish, for one common source-derived `U` and one unbounded schedule,

1. a positive base state close enough to the projected prolate target that
   (2.9)--(2.10) leaves the determinant error admissible;
2. `D_z>0` in (4.2), followed by a quantitative lower bound for the floor
   reconstructed by (4.7);
3. the cancellation-preserving inverse-vector estimate (4.6)--(4.8) at the
   rate required by the determinant theorem; and
4. the relative surplus estimate (3.1), with strict slack, so that the
   shifted odd coefficient reserve applies.

The exact identities show that rotation does not manufacture a small
surplus for free: `chi_z=chi/D_z`.  Proving only Hilbert-space closeness of
the anchors, or only the polylogarithmic solve, leaves (3.1) and the sign of
`D_z` open.  Those are the precise missing arithmetic inputs after this
reduction.
