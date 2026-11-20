# Finite-edge phase synchronization: exact sufficient criteria

## 0. Outcome and fail-closed boundary

This note records three rigorous ways to synchronize the sign of the leading
finite-edge scalar with the negative first-minor covariance without requiring
the global hull antipode.  In the notation below they are:

1. a boundary-transversality phase with `P=0` and `V!=0`;
2. an explicit strict coefficient-dominance inequality which makes the
   covariance negative at every phase; and
3. a Laurent-polynomial divisibility criterion based on squarefreeness and
   Zariski density of the regular torus sign boundary.

The antipode condition from the frozen finite-attained-edge theorem is
sufficient, but it is not necessary.  An exact two-frequency fixture below
violates the antipode parity condition and nevertheless has

\[
 P>0,\qquad {\cal C}=PW-V^2<0.                       \tag{0.1}
\]

These criteria do **not** prove that every finite phase-locked edge has such a
phase.  The exceptional case in which every sign-changing zero of `P` is also
a zero of `V` remains open.  The fixture is an abstract finite-edge phase
calculation, not the actual zeta-zero geometry.  No assertion is made that an
actual attained zeta edge is finite, satisfies any criterion here, or has the
displayed ordinates or multiplicities.

If the actual finite attained edge did satisfy one of the criteria, the
frozen recurrence, strict-natural-grid transfer, and fourth-order residual
argument would give the same conditional negative actual first minor as in
the antipodal theorem.  That implication remains conditional on an unproved
actual-zeta edge geometry.  Nothing here proves RH or its negation, a Lambda
bound, a routing contraction, a positive full Laplacian, or equation (5.2) of
`DIRECT_RH_ATTACK.md`.  The formal state remains `P0_INVALIDATED`.

## 1. Frozen dependencies and finite-edge functions

The deductions are bound to the following exact bytes.

| Dependency | SHA-256 |
|---|---|
| `P0_SOURCE_LOCK.json` | `24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251` |
| `P0_NORMALIZATION_AUDIT.md` | `37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df` |
| `P3_SOURCE_LOCK.json` | `42976166b046f99b111861d86ac4c85f730ceb0de56b072205735cc84bea65b3` |
| `notes/FIRST_LAPLACIAN_MINOR_TURAN_BARRIER.md` | `ae87b9100f8eea9ec9feddeec7f8343197ba5c14b25b2245afb96a2deec45fb1` |
| `notes/UNIQUE_ATTAINED_EDGE_FIRST_MINOR_OBSTRUCTION.md` | `04c55777689638dff3fa7416bd4380cda0efbf02ea94d55431f4ff0c0787a28d` |
| `notes/FINITE_ATTAINED_EDGE_ANTIPODAL_TURAN_OBSTRUCTION.md` | `a8a51e9b7d115eed1e48a358fba0dab0556782a09e851d149c952fdd091bc5fc` |
| `notes/ATTAINED_RIGHT_EDGE_VECTOR_SELECTION_THEOREM.md` | `6f67349e53e761744408bfa053874ce4f79b22aac578fa6fff48fa5915e65edf` |

Assume only for the phase analysis that `B>0`, that the positive ordinates
`gamma_j` are distinct, and that `r_j>0`.  Put

\[
 \alpha_j=B+i\gamma_j,\qquad b_j=\alpha_j^{-2},
 \qquad 1\leq j\leq m,                              \tag{1.1}
\]

and let

\[
 K=\overline{\{(e^{i\gamma_1t},\ldots,e^{i\gamma_mt}):t\in\mathbb R\}}
 \subset\mathbb T^m.                               \tag{1.2}
\]

For `z in K`, define

\[
 \begin{aligned}
 P(z)&=2\Re\sum_j r_jb_jz_j,\\
 V(z)&=2\Re\sum_j r_jb_j^2z_j,\\
 W(z)&=2\Re\sum_j r_jb_j^3z_j,
 \end{aligned}\qquad
 {\cal C}(z)=P(z)W(z)-V(z)^2.                       \tag{1.3}
\]

Every coordinate character is nontrivial on `K`, and the distinct positive
ordinates prevent equality or inversion of two coordinate characters.
Consequently `P` is nonzero and has Haar mean zero.  It therefore assumes
both signs.  Along the dense one-parameter orbit, with `D=d/dt`, the
coefficient identity `(B+i*gamma_j)^2*b_j=1` gives

\[
 \boxed{(D+B)^2V=P,\qquad (D+B)^2W=V.}              \tag{1.4}
\]

## 2. Boundary transversality is sufficient

Let

\[
 \Omega_+=\{z\in K:P(z)>0\}.                       \tag{2.1}
\]

Suppose that some boundary phase `z_0 in boundary(Omega_+)` satisfies

\[
 \boxed{V(z_0)\neq0.}                              \tag{2.2}
\]

At that phase, continuity gives `P(z_0)=0`, and hence

\[
 \boxed{{\cal C}(z_0)=-V(z_0)^2<0.}                \tag{2.3}
\]

The strict inequality persists in a neighborhood of `z_0`.  Because `z_0`
is a boundary point of `Omega_+`, that neighborhood contains a phase `z_*`
with

\[
 \boxed{P(z_*)>0,\qquad {\cal C}(z_*)<0.}           \tag{2.4}
\]

This local criterion requires neither a global sign-flipping phase nor a
condition on the integer relation lattice.  It is sufficient, not necessary:
a favorable phase can also occur away from the boundary.

## 3. Exact coefficient decomposition and strict dominance

Write `P=sum_j P_j`, and similarly for `V` and `W`.  The single-orbit term is
phase independent:

\[
 P_jW_j-V_j^2
 =-4r_j^2|b_j|^2(\Im b_j)^2.                       \tag{3.1}
\]

For `j<k`, direct multiplication gives the two cross coefficients

\[
 \begin{aligned}
 A_{jk}&=r_jr_kb_jb_k(b_j-b_k)^2,\\
 D_{jk}&=r_jr_kb_j\overline {b_k}
                  (b_j-\overline {b_k})^2.
 \end{aligned}                                     \tag{3.2}
\]

Therefore the complete pointwise identity on `K` is

\[
 \boxed{
 {\cal C}(z)=-S+2\Re\sum_{j<k}
 \{A_{jk}z_jz_k+D_{jk}z_j\overline {z_k}\},}       \tag{3.3}
\]

where

\[
 S=4\sum_jr_j^2|b_j|^2(\Im b_j)^2>0.               \tag{3.4}
\]

The strictness in (3.4) follows from

\[
 \Im b_j={-2B\gamma_j\over(B^2+\gamma_j^2)^2}<0.   \tag{3.5}
\]

Taking absolute values in (3.3) yields the exact, hull-independent
sufficient condition

\[
 \boxed{
 2\sum_{j<k}\bigl(|A_{jk}|+|D_{jk}|\bigr)<S.}       \tag{3.6}
\]

Under (3.6), `C(z)<0` for every `z in K`.  Since `P` is nonzero with Haar
mean zero, it is positive somewhere, so (2.4) follows.  Condition (3.6)
includes sufficiently strong one-orbit dominance but is not asserted for an
arbitrary edge multiset.

## 4. Laurent divisibility criterion

Choose character coordinates identifying the connected hull with a torus
`K isomorphic to T^d`.  Let `k_j in Z^d` denote the character induced by its
`j`-th coordinate.  In the Laurent ring

\[
 R=\mathbb C[X_1^{\pm1},\ldots,X_d^{\pm1}],         \tag{4.1}
\]

put

\[
 \begin{aligned}
 p(X)&=\sum_jr_j\{b_jX^{k_j}+\overline {b_j}X^{-k_j}\},\\
 v(X)&=\sum_jr_j\{b_j^2X^{k_j}+\overline {b_j}^{\,2}X^{-k_j}\}.
 \end{aligned}                                     \tag{4.2}
\]

Their restrictions to the real torus are `P` and `V`.  Both have the exact
support

\[
 E=\{k_1,-k_1,\ldots,k_m,-k_m\}.                   \tag{4.3}
\]

Here is a precise algebraic sufficient criterion.  Assume:

1. `p` is squarefree in `R`; and
2. the regular torus sign boundary

\[
 Z_{\partial}^{\rm reg}
 =\{x\in\mathbb T^d:p(x)=0,\ d(p|_{\mathbb T^d})_x\neq0\}       \tag{4.4}
\]

is Zariski dense in the complete complex hypersurface
`{p=0} subset (C^*)^d`.

Then a favorable phase (2.4) exists.  Indeed, suppose otherwise.  At every
regular boundary point, approach from `p>0`.  The assumed nonnegativity of
`C` there and `C=-v^2` on `p=0` force `v=0`.  Zariski density makes `v`
vanish on the complete complex zero variety of `p`.  Squarefreeness and the
Nullstellensatz in the Laurent ring then give

\[
 p\mid v.                                           \tag{4.5}
\]

Write `v=pq`.  Exact equality of the supports in (4.3) gives

\[
 \operatorname {Newt}(v)=\operatorname {Newt}(p).
\]

On the other hand, Newton polytopes multiply by Minkowski addition:

\[
 \operatorname {Newt}(v)
 =\operatorname {Newt}(p)+\operatorname {Newt}(q). \tag{4.6}
\]

Thus `q` is a monomial.  A nonzero translation cannot preserve the bounded
polytope `conv(E)`, so the monomial exponent is zero and `q=c` is constant.
Comparison of the coefficients of `X^(k_j)` and `X^(-k_j)` would require

\[
 c=b_j=\overline {b_j},                             \tag{4.7}
\]

contradicting (3.5).  This proves the criterion.

The density hypothesis in (4.4) is substantive.  This note does not assert
that it holds for every relation lattice or every positive coefficient
vector.  In one dimension the elementary local substitute is exactly (2.2):
at least one sign-changing unit-circle root of `p` must fail to be a root of
`v`.

## 5. Rigidity of any surviving failure

The same calculation gives a sharp necessary sign pattern for any
counterexample to universal synchronization.  Suppose there is no phase
with `P>0` and `C<0`.  Then

\[
 {\cal C}\geq0\quad\hbox{on}\quad\Omega_+.          \tag{5.1}
\]

Along the one-parameter orbit write `p(t)=P(z(t))`, `v(t)=V(z(t))`, and
`w(t)=W(z(t))`.  Let `(a,b)` be a positive component of `p`, so that
`p>0` inside and `p(a)=p(b)=0`.  Continuity of (5.1), together with
`C=-v^2` at an endpoint, gives

\[
 v(a)=v(b)=0.                                      \tag{5.2}
\]

By (1.4), the transformed function `y(t)=e^(Bt)v(t)` obeys

\[
 y''(t)=e^{Bt}p(t)>0,\qquad y(a)=y(b)=0.            \tag{5.3}
\]

Strict convexity places `y` below its zero chord.  Hence

\[
 \boxed{p(t)>0\quad\Longrightarrow\quad
        v(t)<0\quad\hbox{and}\quad w(t)>0.}         \tag{5.4}
\]

The second sign follows from `p*w>=v^2>0`.  Convexity also gives
`v'(a)<0<v'(b)`.  Thus failure requires every sign-changing endpoint of
`P` to be shared by `V`, followed by the rigid sign nesting
`P>0 => V<0<W`.  The negative Haar mean of `C` alone does not rule out this
exceptional geometry.  Neither the Laurent argument nor the computations
below eliminate it in complete generality.

## 6. Exact non-antipodal favorable fixture

Take

\[
 B=1,\qquad(\gamma_1,\gamma_2)=(1,2),\qquad
 (r_1,r_2)=(1,1).                                  \tag{6.1}
\]

The primitive relation `(2,-1)` has odd coordinate sum, so the hull

\[
 K=\{(e^{it},e^{2it}):t\in\mathbb R\}              \tag{6.2}
\]

does not contain `(-1,-1)`.  Nevertheless, at `t=pi/2`,

\[
 (z_1,z_2)=(i,-1),\qquad
 b_1=-{i\over2},\qquad b_2={-3-4i\over25}.         \tag{6.3}
\]

Exact rational arithmetic gives

\[
 \boxed{
 P={31\over25},\qquad
 V={14\over625},\qquad
 W=-{16561\over62500},\qquad
 {\cal C}=-{20567\over62500}.}                    \tag{6.4}
\]

Thus the antipode is not necessary for phase synchronization.  Since the
centered zeta right edge cannot equal `B=1`, this fixture is deliberately
not an actual-zeta edge claim; it certifies only the finite-edge algebra.

## 7. Diagnostic computations and surviving open case

Finite commensurable grids and random low-rank relation lattices were
examined during discovery, and no counterexample to synchronization was
found.  Those floating computations are diagnostic only.  They are not an
exhaustive search, are not used in any proof above, and are not evidence for
an actual-zeta edge geometry.  The regression package uses exact rational
arithmetic for the mathematical fixtures and deterministic serialization
checks for the scope boundary.

The universal finite phase-locked question therefore remains open precisely
after the sufficient cases above: one must either exclude or realize a hull
on which every positive-boundary zero of `P` is shared by `V` and the nesting
(5.4) persists.  A countably infinite attained edge, the nonattained
covariance sign, higher Schur pivots, full-section connectivity, Laplacian
positivity, and routing contraction also remain outside this result.  No
checkpoint-0.85 status, replay, source lock, or artifact is changed.
