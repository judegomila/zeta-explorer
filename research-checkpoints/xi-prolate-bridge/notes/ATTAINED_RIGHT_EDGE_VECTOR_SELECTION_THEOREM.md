# Attained right edge: vector selection without an isolated zero line

## 0. Exact outcome and claim boundary

This note sharpens the non-RH branch of
`CENTERED_ZERO_GRAM_SIMULTANEOUS_VERTEX_SUBSEQUENCE.md`.  A fixed gap below
the rightmost centered-zero line is not needed.  Let

\[
 B=\sup_{\alpha\in Z_+}\Re\alpha .                    \tag{0.1}
\]

If RH is false, `B>0`.  If this positive supremum is attained by at least
one centered zero, then absolute summability of the paired Hadamard product
already gives

\[
 e^{-BT}\Psi(T)={\cal H}_B(T)+o(1),                  \tag{0.2}
\]

where `H_B` is a nonzero real uniformly almost-periodic function formed
from **all** zeros on the line `Re(alpha)=B`.  Zeros on lower lines may
approach `B` with no gap.  Dominated convergence absorbs them.  Almost-
periodic recurrence, the exact history-moment formula, and the natural
fixed-mode asymptotics then give an unbounded strict-half-integer sequence
on which every fixed prefix `d_0,...,d_K` is positive and
`d_k/d_0 -> 4`.

Thus the sole off-line case not covered by the present zero-side argument
is

\[
 B>0\quad\hbox{and}\quad
 \Re\alpha<B\ \hbox{for every centered zero }\alpha. \tag{0.3}
\]

In that nonattained case the extra inverse power in each history moment
does produce a genuine spectral escape: its absolute third-power majorant
is `o` of the second-power majorant.  What remains is a cancellation
problem.  Scalar Landau unboundedness supplies no comparison between the
signed sum `Psi` and either majorant.  An exact Fejer-block construction
below shows that the strip, count, conjugation, and `alpha^(-2)` coefficient
rules alone do not give a uniform signed-to-RMS peak inequality.

The Fejer block is a local analytic obstruction, not the zeta-zero set and
not a global counterexample to vector selection.  In particular, this note
does **not** prove the nonattained case, RH, graph positivity, routing,
finite hyperbolicity, `DIRECT_RH_ATTACK.md` equation (5.2), or a Lambda
bound.  It changes no source lock or project status.  The formal state
remains `P0_INVALIDATED`.

All conventions are inherited unchanged.  In particular,

\[
 \Psi(T)=\sum_{\alpha\in Z_+}
 {2\{\cosh(\alpha T)-1\}\over\alpha^2},              \tag{0.4}
\]

representatives are chosen with `Re(alpha)>=0`, conjugates are paired, and

\[
 \sum_{\alpha\in Z_+}|\alpha|^{-2}<\infty .          \tag{0.5}
\]

## 1. An attained supremum needs no lower-line gap

Assume `B>0` and let

\[
 Z_B=\{\alpha\in Z_+:\Re\alpha=B\}.                 \tag{1.1}
\]

Define

\[
 \boxed{{\cal H}_B(T)=
 \sum_{\alpha\in Z_B}{e^{i(\Im\alpha)T}\over\alpha^2}.} \tag{1.2}
\]

Conjugate pairing makes this function real.  The sum is absolutely and
uniformly convergent, hence uniformly almost periodic.

### Lemma 1.1 (gap-free edge asymptotic)

If `Z_B` is nonempty, then

\[
 \boxed{e^{-BT}\Psi(T)={\cal H}_B(T)+o(1)}            \tag{1.3}
\]

as `T->infinity`.  No number `delta>0` separating `Z_B` from the remaining
zeros is assumed.

**Proof.**  Expand one term of (0.4) as

\[
 {e^{\alpha T}+e^{-\alpha T}-2\over\alpha^2}.        \tag{1.4}
\]

After multiplication by `e^(-BT)`, the forward exponential from
`Re(alpha)=B` gives (1.2).  Its backward exponential and constant part tend
to zero absolutely.  For every zero with `Re(alpha)<B`, the forward factor
has modulus

\[
 e^{-(B-\Re\alpha)T}|\alpha|^{-2}\longrightarrow0    \tag{1.5}
\]

and is dominated by `|alpha|^(-2)`.  Equation (0.5) and dominated
convergence sum (1.5), including any sequence of lower lines accumulating
at `B`.  The backward and constant sums are handled by the same summable
majorant.  This proves (1.3).  \(\square\)

### Lemma 1.2 (positive recurrent edge values)

The function `H_B` is nonzero, has Bohr mean zero, and there are a constant
`c_B>0` and arbitrarily large real numbers `t_j` such that

\[
 \boxed{{\cal H}_B(t_j)>2c_B.}                       \tag{1.6}
\]

**Proof.**  There is no real centered zero in `0<s<1`, so every frequency
`Im(alpha)` in (1.2) is nonzero.  Hence the Bohr mean is zero.  At least one
Fourier coefficient is nonzero; equal zeros only add their positive
multiplicity, so `H_B` is not identically zero.  A nonzero real continuous
almost-periodic function of mean zero has a positive value.  Uniform
almost-periodic recurrence returns arbitrarily far to a sufficiently small
uniform neighborhood of one such translate, proving (1.6).  \(\square\)

Combining the two lemmas gives

\[
 \boxed{\Psi(t_j)>c_Be^{Bt_j}}                       \tag{1.7}
\]

eventually.

## 2. Transfer to the strict-half-integer natural grid

Choose the nearest strict half integer

\[
 \lambda_j={r_j\over2},\qquad r_j\ge5\ \hbox{odd},
 \qquad L_j=2\log\lambda_j                            \tag{2.1}
\]

to `exp(t_j/2)`.  The elementary logarithm estimate from checkpoint 0.80
gives

\[
 |L_j-t_j|\le2e^{-t_j/2}.                             \tag{2.2}
\]

The pinned PNT input gives, for some `a>0`,

\[
 |\Psi'(u)|=|R(u)|
 \le C e^{u/2}(1+u^2)e^{-a\sqrt u}                  \tag{2.3}
\]

for all sufficiently large `u` away from the harmless jump convention,
with the integrated form valid across jumps.  Therefore

\[
 |\Psi(L_j)-\Psi(t_j)|
 \le C(1+t_j^2)e^{-a\sqrt {t_j}}
 =o(e^{Bt_j}).                                      \tag{2.4}
\]

Since `B>0` and `L_j-t_j=o(1)`, (1.7) yields

\[
 \boxed{\Psi(L_j)>{c_B\over2}e^{BL_j}}              \tag{2.5}
\]

eventually.  Thus the locked grid transfer costs no right-edge gap.

## 3. Simultaneous fixed vertices on the attained-edge sequence

For fixed `k>=1`, retain the exact identities

\[
 E_k=\sqrt L\,J_L+{\cal M}_k(L),                     \tag{3.1}
\]

\[
 {\cal M}_k(L)=\sum_{\alpha\in Z_+}{1\over\alpha^3}
 \left\{\int_0^Le^{-\alpha t}S_{k,L}''(t)\,dt
       -\int_0^Le^{ \alpha t}S_{k,L}''(t)\,dt\right\}, \tag{3.2}
\]

and

\[
 \|S_{k,L}''\|_1=O_k(L^{-1}).                        \tag{3.3}
\]

### Lemma 3.1 (gap-free history bound)

If `B=max Re(alpha)>0`, then for every fixed `k`,

\[
 \boxed{|{\cal M}_k(L)|=O_k(e^{BL}/L).}              \tag{3.4}
\]

**Proof.**  Since representatives have nonnegative real part,

\[
 \left|\int_0^Le^{-\alpha t}S''(t)dt\right|
 \le\|S''\|_1,
 \qquad
 \left|\int_0^Le^{\alpha t}S''(t)dt\right|
 \le e^{(\Re\alpha)L}\|S''\|_1.                   \tag{3.5}
\]

Equations (0.5), (3.2), and (3.3) imply

\[
 |{\cal M}_k(L)|
 \le {C_k\over L}\sum_{\alpha\in Z_+}
 {1+e^{(\Re\alpha)L}\over|\alpha|^3}
 \le {C_k'e^{BL}\over L}.                           \tag{3.6}
\]

The third-power sum is finite because the centered zero set is bounded
away from zero and (0.5) holds.  \(\square\)

### Theorem 3.2 (attained-edge simultaneous vector selection)

Assume RH is false and the positive supremum `B` in (0.1) is attained.
For every fixed `K`, there is an unbounded strict-half-integer natural-
cutoff sequence (2.1) such that

\[
 \boxed{d_k(L_j)>0\qquad(0\le k\le K)}              \tag{3.7}
\]

eventually, and for each fixed `1<=k<=K`,

\[
 \boxed{{d_k(L_j)\over d_0(L_j)}\longrightarrow4.}  \tag{3.8}
\]

**Proof.**  The fixed-mode theorem gives

\[
 \sqrt L\,p_0\to C,
 \qquad \sqrt L\,p_k\to2(-1)^kC\quad(k\ge1),       \tag{3.9}
\]

with `C>0`.  From (2.5), (3.4), and (3.9), uniformly over a fixed finite
prefix,

\[
 {|{\cal M}_k(L_j)|\over|p_k|\Psi(L_j)}=O_k(L_j^{-1/2})\to0. \tag{3.10}
\]

The all-order convolution estimate `J_L=O_A(lambda^(-A))` makes
`sqrt(L)J_L/(|p_k|Psi(L))` tend to zero as well.  Insert these estimates in

\[
 d_k={2p_k^2\over L}\Psi(L)+{2p_k\over L}E_k.        \tag{3.11}
\]

This proves (3.7); (3.8) follows from (3.9)--(3.11).  \(\square\)

Theorem 3.2 strictly weakens Hypothesis R of checkpoint 0.82: an attained
right edge is sufficient even when lower zero lines accumulate at it.

## 4. Exact reduction when the right edge is not attained

Assume now that

\[
 0<B=\sup\Re\alpha,qquad \Re\alpha<B\quad\hbox{for all }\alpha. \tag{4.1}
\]

Define the positive absolute majorants

\[
 A_2(L)=\sum_{\alpha\in Z_+}{e^{(\Re\alpha)L}\over|\alpha|^2},
 \qquad
 A_3(L)=\sum_{\alpha\in Z_+}{e^{(\Re\alpha)L}\over|\alpha|^3}. \tag{4.2}
\]

### Proposition 4.1 (spectral escape gains one inverse ordinate)

Under (4.1),

\[
 \boxed{{A_3(L)\over A_2(L)}\longrightarrow0.}       \tag{4.3}
\]

**Proof.**  Fix `R`.  Discreteness makes the set `|alpha|<=R` finite, and
its largest real part `b_R` is strictly below `B`.  Choose one zero
`alpha_*` with `Re(alpha_*)>b_R`.  Its single term gives

\[
 A_2(L)\ge {e^{(\Re\alpha_*)L}\over|\alpha_*|^2},   \tag{4.4}
\]

so the contribution of `|alpha|<=R` to `A_3/A_2` tends to zero.  On the
complement, `|alpha|^(-3)<=R^(-1)|alpha|^(-2)`.  Hence

\[
 \limsup_{L\to\infty}{A_3(L)\over A_2(L)}\le {1\over R}. \tag{4.5}
\]

Let `R->infinity`.  \(\square\)

The exact history estimate becomes

\[
 |{\cal M}_k(L)|\le {C_k\over L}\{A_3(L)+O(1)\}.     \tag{4.6}
\]

The exact vector target remains

\[
 {\cal M}_k(L)=o(|p_k|\Psi(L))
 \quad(1\le k\le K),\qquad \Psi(L)>0.                \tag{4.7a}
\]

A cancellation-free sufficient scalar condition for (4.7a) is a positive
grid sequence satisfying

\[
 \boxed{A_3(L)=o(\sqrt L\,\Psi(L)).}                 \tag{4.7}
\]

The `O(1)` in (4.6) is harmless once `Psi` has a fixed positive margin.
Condition (4.7) implies all simultaneous fixed-vertex conclusions exactly
as in Section 3, but it is not necessary: the signed moments in (3.2) may
have cancellation not visible in `A_3`.

There is a useful RMS sufficient condition.  Put

\[
 Q_2(L)=\left(\sum_{\alpha\in Z_+}
 {e^{2(\Re\alpha)L}\over|\alpha|^4}\right)^{1/2}.   \tag{4.8}
\]

Cauchy--Schwarz and (0.5) give

\[
 A_3(L)\le Q_2(L)
 \left(\sum_{\alpha\in Z_+}|\alpha|^{-2}\right)^{1/2}. \tag{4.9}
\]

Thus

\[
 \boxed{Q_2(L)=o(\sqrt L\,\Psi(L)),\quad\Psi(L)>0} \tag{4.10}
\]

on an unbounded grid sequence is sufficient.  Scalar Landau proves only
`limsup Psi=+infinity`; it proves neither (4.7) nor (4.10).

## 5. A finite Fejer block defeats a universal RMS peak theorem

The failure of Landau to imply (4.10) is not repaired by a generic
coefficient-count inequality.  Let

\[
 w_j=1-{j\over n+1},qquad 1\le j\le n,              \tag{5.1}
\]

and let

\[
 F_n(\theta)={1\over n+1}
 \left|\sum_{r=0}^ne^{ir\theta}\right|^2
 =1+2\sum_{j=1}^nw_j\cos(j\theta).                  \tag{5.2}
\]

Then

\[
 -2\sum_{j=1}^nw_j\cos(j\theta)=1-F_n(\theta)\le1, \tag{5.3}
\]

while

\[
 \sum_{j=1}^nw_j^2={n(2n+1)\over6(n+1)}\sim {n\over3}. \tag{5.4}
\]

### Proposition 5.1 (admissible local centered-zero blocks)

Fix `0<b<b+delta<1/2`, an integer `n`, and `epsilon>0`.  There are `G,T`
and simple conjugate centered-zero pairs

\[
 \alpha_j=\beta_j+ijG,quad\overline{\alpha_j},
 \qquad b<\beta_j<b+\delta,                           \tag{5.5}
\]

such that, after multiplication by one positive scalar, the forward-
exponential part of their contribution to `Psi(T+theta/G)` differs
uniformly for `0<=theta<=2*pi` from `1-F_n(theta)` by less than `epsilon`.
Their ordinates are simple and sparse, and their finite contribution obeys
the strip, conjugation, count-upper-bound, and `alpha^(-2)` coefficient
rules.

**Proof.**  Choose `G` large and then choose a sufficiently large multiple
`T=2*pi*M/G`.  Put

\[
 C=bT-2\log G+\log(n+1).                            \tag{5.6}
\]

For each `j`, the strictly increasing function

\[
 u\longmapsto uT-\log(u^2+j^2G^2)                   \tag{5.7}
\]

crosses `C+log(w_j)` between `b` and `b+delta` once `T` dominates a
constant times `log(n+1)/delta`.  At `u=b` the difference from the target
is

\[
 \log {G^2\over(b^2+j^2G^2)(n+1-j)}<0,              \tag{5.7a}
\]

where `(n+1)w_j=n+1-j`; increasing `u` by `delta` adds `delta*T` up to a
bounded logarithmic correction.  Let `beta_j` be the resulting solution.
Then, exactly,

\[
 {e^{\beta_jT}\over|\alpha_j|^2}=e^Cw_j.            \tag{5.8}
\]

Because `GT` is an integer multiple of `2*pi`, the phase at
`T+theta/G` is `j*theta`.  Also

\[
 \arg(\alpha_j^{-2})=-\pi+O((jG)^{-1}),qquad
 e^{\beta_j\theta/G}=1+O_{b,\delta}(G^{-1}).         \tag{5.9}
\]

For fixed `n`, taking `G` larger makes the sum of these uniform errors less
than `epsilon`; (5.3) follows after scaling by `e^C`.  The backward
exponential and constant pieces are made smaller than `epsilon` as well by
increasing `T`.  The ordinates `jG` are distinct and the block has only
`2n` representatives through height `nG`, which is below any
`O(Y log Y)` upper count for sufficiently large `G`.  \(\square\)

Equations (5.3)--(5.4) show that the positive peak of this admissible block,
divided by its coefficient RMS, is at most

\[
 \sqrt{{6(n+1)\over n(2n+1)}}+o_G(1)=O(n^{-1/2}).    \tag{5.10}
\]

Critical-line filler zeros can be added without violating the block or a
global `O(T log T)` count.  Hence no **uniform** lower bound
`positive peak >= c*Q_2` follows merely from zero symmetry, the open strip,
the count upper bound, and the Hadamard coefficients.  This does not show
that the actual zeta-zero sum lacks some favorable sequence; it shows that
such a sequence needs arithmetic phase information beyond those generic
constraints.

## 6. Surviving exact task

The non-RH vector problem is now divided exhaustively.

1. If the positive right edge is attained, Theorem 3.2 proves simultaneous
   positivity of every fixed vertex prefix without an isolated-line gap.
2. If the edge is not attained, Proposition 4.1 proves automatic spectral
   escape, but one still needs the signed peak comparison (4.7), or the RMS
   sufficient form (4.10), on the strict-half-integer grid.
3. Proposition 5.1 rules out deriving a uniform RMS peak comparison from
   the generic strip/count/coefficient data alone.  It does not replace the
   missing actual-zeta phase theorem with a synthetic conclusion.

No current zero-free region or scalar abscissa argument decides item 2.
That nonattained-edge cancellation problem is the exact remaining
unconditional fixed-prefix selection gap.
