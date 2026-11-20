# Audit: frozen-residue inertia is an endpoint-equivalent closure

## Scope and normalization

This is an independent audit of the proposed all-degree inertia gate.  It is
an exact reformulation, not a positivity theorem and not an RH claim.

For one fixed parity, let `Q_N` be the actual endpoint target Gram on the
finite polynomial prefix `P_N`.  Here `Q_N` uses the same normalization as
`dot G` in equation (17) of `DEFECT_FACTORIZATION.md`; multiplying every
`Q_N` by a fixed positive scalar would not affect the conclusions below.
The frozen-residue matrix satisfies

\[
 M_{0,N}=Q_N+v_Nd_N^*+d_Nv_N^*. \tag{1}
\]

This is just the rearrangement of
`dot G=M_0-vd^*-dv^*`, before or after any invertible coefficient
congruence.  Thus no positivity has been inserted into (1).

Write

\[
 f(t)=f_{\rm bridge}(t)
 =\Xi'(t/2)^2-\Xi(t/2)\Xi''(t/2). \tag{2}
\]

The spectral identity in `SPECTRAL_DEFECT_CLOSURE.md` identifies `Q_N`, up
to its fixed positive normalization and harmless diagonal phases, with the
moment Gram of `f` on the corresponding parity prefix.

## Rank-two inertia lemma

For arbitrary vectors `v,d`, the Hermitian operator

\[
 K=vd^*+dv^* \tag{3}
\]

has at most one positive and at most one negative eigenvalue.  One quick
proof is that its quadratic form vanishes on `ker(d^*)`; a two-dimensional
strictly positive or strictly negative subspace would meet this codimension
one kernel nontrivially, a contradiction.  Equivalently, its two possible
nonzero eigenvalues are

\[
 \operatorname{Re}(v^*d)\ \mathbin\pm
 \sqrt{\|v\|^2\|d\|^2-\operatorname{Im}(v^*d)^2}, \tag{4}
\]

whose product is nonpositive by Cauchy--Schwarz.

The standard inertia inequalities consequently give

\[
 n_-(Q_N)-1\ \le n_-(M_{0,N})\le n_-(Q_N)+1. \tag{5}
\]

In particular, if the **full** target prefix `Q_N` is positive
semidefinite, then

\[
 n_-(M_{0,N})\le1. \tag{6}
\]

The word full is essential: positivity of only the preceding principal
block does not justify (6) for the enlarged prefix.

## Negative density gives unbounded negative inertia

Suppose `f(t_0)<0`.  The complete theta density is continuous and even, so
there is an open interval away from the singleton origin on which `f<0`,
together with its reflected interval.  For any integer `k`, choose `k`
disjoint pairs of smaller intervals in this negative set.  Their supported
indicator functions can be made even, or odd by changing the sign on the
reflected component.  In either parity their span is a `k`-dimensional
strictly negative subspace for the signed multiplication form

\[
 (g,h)_f=\int_{\mathbb R}f(t)g(t)\overline{h(t)}\,dt. \tag{7}
\]

Complete-theta strip decay gives an exponential moment for `|f(t)|dt`.
The analytic-annihilator argument cited in
`evidence/v18-curated/spectral_relative_limit_audit/AUDIT.md` therefore
makes even polynomials dense in the even part of `L^2(|f|dt)` and odd
polynomials dense in its odd part.  Approximate the `k` disjoint supported
functions simultaneously in that norm.  Since the form (7) has operator
norm at most one relative to `L^2(|f|dt)`, sufficiently close polynomial
approximants retain a negative-definite `k` by `k` Gram.  All finitely many
approximants lie in one finite parity prefix.  Hence

\[
 \sup_N n_-(Q_N)=\infty. \tag{8}
\]

The forced zero of every odd polynomial at `t=0` causes no exception.  If
the original negative point is the origin, continuity supplies a smaller
negative interval on the positive half-line, away from zero, to which the
same reflected construction applies.

Combining (5) and (8) gives

\[
 f(t_0)<0\quad\Longrightarrow\quad
 \sup_N n_-(M_{0,N})=\infty. \tag{9}
\]

## Exact equivalence

For either complete parity ladder, the following are equivalent:

1. `f_bridge(t)>=0` for every real `t`;
2. `Q_N>=0` for every finite prefix `N`;
3. `n_-(M_(0,N))<=1` for every finite prefix `N`;
4. `sup_N n_-(M_(0,N))<infinity`.

The equivalence of 1 and 2 is the existing signed-moment density closure.
Condition 1 implies 3 by (6), and 3 implies 4.  If 4 held while `f` were
negative anywhere, (9) would contradict 4.  Thus even an arbitrary uniform
finite bound on the frozen-residue negative inertia already forces the full
endpoint spectral sign.

This shows that an all-degree proof of `n_-(M_0)<=1` is exactly as hard, at
the endpoint level, as the target density sign.  It can be a useful
Pontryagin-space reformulation, but it is not a weaker intermediate lemma.
The stronger statement `M_0>=0` may fail even when the endpoint target is
positive; one certified-prefix negative direction would refute only that
stronger route.

## Old-prefix condition and the generic countermodel

If only an old target block `A>0` is known, its frozen-residue principal
block is

\[
 A+vd^*+dv^*. \tag{10}
\]

With

\[
 V=v^*A^{-1}v,\quad D=d^*A^{-1}d,\quad
 v^*A^{-1}d=C+iJ,
\]

whitening gives the exact condition

\[
 A+vd^*+dv^*\succeq0
 \quad\Longleftrightarrow\quad
 \sqrt{VD-J^2}-C\le1. \tag{11}
\]

For real theta data this is `sqrt(VD)-C<=1`.  If (11) were proved from
source-specific arithmetic, the next `M_0` is a one-row extension of a
positive semidefinite block and hence has at most one negative direction.
No reviewed theta identity currently supplies (11).

The separate three-dimensional generic model with a positive old target
and `n_-(M_0)=2` does not contradict the equivalence above: its enlarged
target already has a negative direction.  It correctly shows that old-block
target positivity alone cannot establish (6).  Conversely, a local bound
`n_-(M_(0,N))<=1` at a single new rung does not by itself prove `Q_N>=0`
(take the cross correction to be zero and let the one-row extension have one
negative pivot).  The equivalence is an all-prefix closure statement, not a
one-step induction.

## Audit verdict

The claimed all-degree equivalence is valid under the already documented
spectral identity, prefix compatibility, continuity, and exponential-moment
density hypotheses.  The necessary correction is conceptual: it must not be
presented as a new route from positive **old** target blocks, or as a local
next-rung criterion.  Its value is to rule out bounded-inertia shortcuts and
to isolate the genuinely new theta-specific target (11) or an equivalent
signed compensation identity.
