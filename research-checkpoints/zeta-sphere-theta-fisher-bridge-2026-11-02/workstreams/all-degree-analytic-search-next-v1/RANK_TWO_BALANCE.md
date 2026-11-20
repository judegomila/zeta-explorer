# Balanced rank-two criterion for the residue drift

## Scope

This note sharpens the rank-one update in `DEFECT_FACTORIZATION.md`.  It is
an exact conditional reduction.  Its base-metric hypothesis is not presently
known for the complete-theta congruence, so it does not close the endpoint
inequality.

Suppose

\[
M=M_0-vd^*-dv^*, \qquad M_0\succ0, \tag{1}
\]

and put

\[
R=M_0^{-1},\quad V=v^*Rv,\quad D=d^*Rd,\quad
z=v^*Rd=C+iJ. \tag{2}
\]

After congruence by `M_0^{-1/2}`, equation (1) is the identity minus a
Hermitian operator of rank at most two.  Its at-most-two eigenvalues on the
span of `M_0^{-1/2}v` and `M_0^{-1/2}d`, before subtraction, are

\[
C\mathbin\pm\sqrt{VD-J^2}. \tag{3}
\]

Consequently

\[
\boxed{M\succeq0\quad\Longleftrightarrow\quad
C+\sqrt{VD-J^2}\leq1.} \tag{4}
\]

For the real theta data `J=0`, this becomes the two-scalar condition

\[
\boxed{C+\sqrt{VD}\leq1.} \tag{5}
\]

The same statement holds for `M_0>=0` after restricting to its range, provided
`v,d` lie in that range, with `R=M_0^dagger`.  Under this range hypothesis,
vanishing `V` or `D` means `v=0` or `d=0`, so the cross perturbation vanishes.

## Relation to the tau factorization

For every `tau>0`, set

\[
a_\tau=\frac{\sqrt\tau v-\tau^{-1/2}d}{\sqrt2},\qquad
b_\tau=\frac{\sqrt\tau v+\tau^{-1/2}d}{\sqrt2},
\qquad B_\tau=M_0+a_\tau a_\tau^*.
\]

Sherman--Morrison gives the exact identity

\[
1-b_\tau^*B_\tau^{-1}b_\tau
=
\frac{2\{(1-C)^2+J^2-VD\}}
 {2+\tau V+D/\tau-2C}. \tag{6}
\]

Thus the sign of the rank-one downdate test is independent of `tau`.  The
balanced choice

\[
\tau_*=\sqrt{D/V} \tag{7}
\]

equalizes the two whitened norms and minimizes the denominator in (6).  In
the real case `a_(tau_*)` and `b_(tau_*)` are `R`-orthogonal and

\[
b_{\tau_*}^*B_{\tau_*}^{-1}b_{\tau_*}=C+\sqrt{VD}, \tag{8}
\]

which recovers (5) directly.

The scalars `V,D,C,J`, and hence `tau_*`, are invariant under any fixed
invertible coefficient congruence.  This balancing is therefore intrinsic to
the base metric, not an artifact of the chosen LDL coordinates.

## Why this does not close the theta problem

In the actual residue decomposition,

\[
M_0=\dot H-\dot u\,e^*-e\,\dot u^*+\dot\gamma\,ee^*.
\]

No current result proves this signed congruence image positive semidefinite.
The available Christoffel positivity is in the different positive-parent
metric; it cannot be substituted for `M_0`.  The choice `tau=c^{-1}` has a
useful normalization only in the pure retained-residue sector.  It equals the
balanced value (7) only if `D=c^{-2}V`, which is not supplied by the parent
Christoffel recursion.

There is also a necessary inertia gate before any special-`tau` Gram search:
`B_tau=M_0+a_tau a_tau^*` cannot be positive semidefinite if `M_0` has two or
more negative eigenvalues.  The independent audit in
`M0_INERTIA_EQUIVALENCE_AUDIT.md` sharpens the interpretation of this gate:
on either complete parity ladder,

\[
\sup_N n_-(M_{0,N})<\infty
\quad\Longleftrightarrow\quad
f_{\rm bridge}\geq0,
\]

and the spectral sign then improves the bound to `n_-(M_(0,N))<=1`.  Hence an
all-prefix one-negative-direction theorem is endpoint-equivalent, not a
weaker intermediate lemma.  Positive **old** target blocks alone give only
the sharp generic bound `n_-(M_0)<=2`, as shown by
`M0_INERTIA_COUNTERMODEL.md`.

Therefore (4)--(8) are a clean conditional diagnostic.  At a given positive
old prefix, frozen-residue positivity is exactly the target-metric gate

\[
\sqrt{V_AD_A-J_A^2}-C_A\leq1
\]

for `M_(0,old)=A+vd^*+dv^*`, where `A` is the positive old actual target.
Here, independently of the scalars in (2),

\[
V_A=v^*A^{-1}v,\qquad D_A=d^*A^{-1}d,\qquad
v^*A^{-1}d=C_A+iJ_A.
\]

`M0_CROSS_COMPENSATION.md` rewrites the real-theta version exactly as a
single correlated Hardy/trace dual-norm inequality.
`M0_FIXED_TAU_NO_GO.md` proves that this gate must eventually fail on the
endpoint-positive branch; if the endpoint target instead develops negative
inertia, rank two cannot repair all prefixes. Assuming `M_0>=0` uniformly
would therefore be false, not merely an unresolved hypothesis.

## Pure-residue obstruction

The retained Poisson residue shows why the missing cross compensation cannot
be avoided.  Put

\[
\Gamma=\|\chi\|^2>0,\qquad A=\langle h\chi,\chi\rangle>0.
\]

In the pure `(e,d)` residue sector,

\[
M_{0,{\rm res}}=2Aee^*,\qquad v_{\rm res}=-\Gamma e.
\]

Once the finite prefix contains the two displayed coordinates (odd degrees
`1,3` or even degrees `2,4`), the documented coefficient pairs show that `e`
and `d` are linearly independent.  The following `2x2` statement is not an
assertion about a one-dimensional prefix.  In this range `d` is not in the
range of the rank-one `M_(0,res)`, so the semidefinite range extension of (4)
deliberately does not apply.  Nevertheless `B_(tau,res)` is a positive Gram on
the span of `(e,d)`, its downdate vector is in range, and direct elimination
gives

\[
\boxed{
b_{\tau,{\rm res}}^*B_{\tau,{\rm res}}^\dagger
b_{\tau,{\rm res}}
=1+\frac{\tau\Gamma^2}{A}>1.
} \tag{9}
\]

Indeed, in the coordinate basis `(e,d)`,

\[
B_{\tau,{\rm res}}=
\begin{pmatrix}
2A+\tau\Gamma^2/2&\Gamma/2\\
\Gamma/2&1/(2\tau)
\end{pmatrix},
\quad
\det B_{\tau,{\rm res}}=A/\tau,
\]

while

\[
M_{\rm res}=
\begin{pmatrix}2A&\Gamma\\\Gamma&0\end{pmatrix},
\quad \det M_{\rm res}=-\Gamma^2.
\]

Thus `1-q=-tau Gamma^2/A`.  The unconditioned normalization
`tau=Gamma^{-1}` yields `q=1+Gamma/A`; after conditioning the residue channel,
the analogous normalization is `tau=c^{-1}`.  It completes the residue square
but provably cannot make the residue-only block contractive.  The actual
corrected-feature/residue cross terms must compensate this strict
residue-only failure.
