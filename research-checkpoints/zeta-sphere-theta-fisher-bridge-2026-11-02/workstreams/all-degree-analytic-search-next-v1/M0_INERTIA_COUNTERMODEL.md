# Sharp generic inertia bound and a local `M_0` countermodel

## Scope and nonclaim

This is theorem-design work for the residue-drift factorization.  It is **not**
a counterexample to the complete-theta identities, the endpoint inequality, or
RH.  The model below preserves the corrected/raw Gram algebra, a positive
parent Gram, an arbitrary prescribed residue vector `e`, an arbitrary
prescribed drift vector `d` with nonzero old part, and the old/new filtration.
It does not impose the complete-theta differential ladder, modular transform,
or divisor-orbit arithmetic.  Its purpose is to identify exactly which extra
theta-specific statement is required.

At one fixed parity rung write

\[
 Q_N:=\dot G_N,\qquad
 M_{0,N}:=\dot H_N-\dot u_Ne_N^*-e_N\dot u_N^*
              +\dot\gamma_Ne_Ne_N^*,
\]

and put `v_N=u_N-gamma_N e_N`, `d_N=dot e_N`.  The exact differentiated
correction identity is

\[
 \boxed{Q_N=M_{0,N}-v_Nd_N^*-d_Nv_N^*.} \tag{1}
\]

The notation `Q_N` in this note is the actual endpoint target `dot G_N`, not
the positive undifferentiated parent `G_N`.

## Full endpoint versus old-prefix positivity

The two hypotheses below must not be conflated.

### Positive full endpoint

If the full target is already positive semidefinite,

\[
 Q_N\succeq0,
\]

then

\[
 \boxed{n_-(M_{0,N})\leq1.} \tag{2}
\]

Indeed, the Hermitian cross matrix

\[
 K_N=v_Nd_N^*+d_Nv_N^*
\]

has at most one negative eigenvalue.  If `v_N,d_N` are independent, its two
possibly nonzero eigenvalues have opposite signs; in the dependent cases it
has rank at most one or is semidefinite of one sign.  Since
`M_(0,N)=Q_N+K_N`, adding the positive semidefinite `Q_N` cannot increase the
negative index.  This is an a posteriori consequence of the desired endpoint
positivity, not a route to proving it.

### Merely positive old target block

Suppose instead that only the old principal target block is known positive,

\[
 Q_{N-1}\succ0. \tag{3}
\]

Because `Q_N` is a one-coordinate extension of `Q_(N-1)`, interlacing gives
`n_-(Q_N)<=1`.  Combining this with `n_-(K_N)<=1` gives only

\[
 \boxed{n_-(M_{0,N})\leq2.} \tag{4}
\]

The bound (4), rather than (2), is the sharp generic consequence of an
inductive old-prefix hypothesis.  The next construction attains equality.

## Exact-coordinate countermodel with two negative directions

Let the old dimension be `r>=1`.  Fix any real positive definite old target
matrix `A`, any residue vector

\[
 e=(e_o,e_n)\in\mathbb R^{r+1},
\]

and any drift vector

\[
 d=(d_o,d_n)\in\mathbb R^{r+1},\qquad d_o\ne0.
\]

Set

\[
 s=d_o^TA^{-1}d_o>0. \tag{5}
\]

Choose

\[
 \lambda>{1\over2s},\qquad
 L>{\lambda^2d_n^2s\over2\lambda s-1}, \tag{6}
\]

and define, in the original old/new coordinates,

\[
 Q_N=\begin{pmatrix}A&0\\0&-L\end{pmatrix},
 \qquad
 v=(-\lambda d_o,0). \tag{7}
\]

Thus `Q_(N-1)=A>0` while `Q_N` has exactly one negative direction.  From
(1),

\[
 M_{0,N}=Q_N+vd^T+dv^T
 =\begin{pmatrix}
 B&c\\c^T&-L
 \end{pmatrix}, \tag{8}
\]

where

\[
 B=A-2\lambda d_od_o^T,
 \qquad c=-\lambda d_nd_o. \tag{9}
\]

Whitening `A` shows that `B` has exactly one negative eigenvalue: its only
possibly nonpositive whitened eigenvalue is `1-2 lambda s<0`.  Sherman--
Morrison gives

\[
 d_o^TB^{-1}d_o={s\over1-2\lambda s},
\]

so the last Schur complement of (8) is

\[
 -L-c^TB^{-1}c
 =-L+{\lambda^2d_n^2s\over2\lambda s-1}<0. \tag{10}
\]

Schur inertia applied to (8)--(10) therefore yields

\[
 \boxed{n_-(M_{0,N})=2.} \tag{11}
\]

This construction uses the prescribed `e,d` without a coordinate change.
It applies to any theta parity rung for which the old part of the documented
drift vector is nonzero.  In particular, the displayed even pair already has
old drift `d_2=-12`, while on the odd ladder the old drift is nonzero once the
prefix contains degrees `1,3` (`d=(0,-18,...)`).  This preserves those exact
coefficient values but does not claim that the freely chosen `Q_N,v` arise
from the theta differential source.

The same proof works over `C` with transposes replaced by adjoints,
`d_n^2` replaced by `|d_n|^2`, and real `lambda>0`; in that notation the
old-to-new column is `c=-lambda overline(d_n)d_o`, with `c^*` in the opposite
corner.

## Positive-parent Hilbert realization

The matrices above are not merely formal.  They admit a local `C^1`
realization satisfying all raw/corrected Gram identities and strict parent
positivity.

Choose `gamma>||v||^2`, put

\[
 G(t)=I+tQ_N,\qquad e(t)=e+td,
\]

and keep `v,gamma` constant.  For sufficiently small `|t|`,

\[
 \mathcal P(t)=\begin{pmatrix}G(t)&v\\v^*&\gamma\end{pmatrix}\succ0. \tag{12}
\]

For example, fix a vector `chi` with `||chi||^2=gamma` and choose vectors
`F_i(t)` with joint Gram (12), so that

\[
 \langle F_i(t),F_j(t)\rangle=G_{ij}(t),\qquad
 \langle F_i(t),\chi\rangle=v_i.
\]

Such a smooth choice follows by taking a smooth Cholesky factor of
`G(t)-vv^*/gamma>0`.  Define

\[
 \Psi_i(t)=F_i(t)+e_i(t)\chi.
\]

Then, with `H=Gram(Psi)` and `u=<Psi,chi>`,

\[
 u=v+\gamma e,
 \qquad
 H=G+ve^*+ev^*+\gamma ee^*, \tag{13}
\]

and hence

\[
 G=H-ue^*-eu^*+\gamma ee^*. \tag{14}
\]

Differentiating (13), using `dot v=dot gamma=0` and `dot e=d`, gives

\[
 \dot H=Q_N+vd^*+dv^*+\gamma(de^*+ed^*),
 \qquad \dot u=\gamma d.
\]

Substitution in the definition of `M_0` gives exactly

\[
 M_{0,N}=Q_N+vd^*+dv^*,
\]

as required.  Thus the corrected parent `G(t)` and the augmented raw Gram are
strictly positive near `t=0`, even though (11) holds.

Only the first jet of `e(t)` was used.  Therefore `e+td` may be replaced by
the actual analytic finite-prefix residue curve extracted from
`E_t(z)=-e^{tz}C(z)`, which has the same prescribed values
`dot e_j(0)=j e_(j-1)`.  This preserves the complete theta residue/drift EGF
on the selected coordinates without changing (8)--(11).  What remains free,
and hence what prevents this from being a theta counterexample, is the
differential/modular evolution of the corrected features `F_i(t)`.

## Small explicit example

Take old dimension two and

\[
 Q_2=I_2,\quad
 Q_3=\operatorname{diag}(1,1,-1),\quad
 d=(1,0,0),\quad v=(-1,0,0),\quad e=(0,1,0),\quad\gamma=2.
\]

Then

\[
 M_{0,3}=Q_3+vd^T+dv^T
          =\operatorname{diag}(-1,1,-1), \tag{15}
\]

so the old target is positive but `M_(0,3)` has two negative directions.  At
`t=0`, the augmented parent (12) has eigenvalues

\[
 1,\quad1,\quad{3-\sqrt5\over2},\quad{3+\sqrt5\over2},
\]

all positive.  One completely explicit realization in `R^4` is

\[
 \begin{aligned}
 \chi&=\sqrt2 f_4,\\
 F_1(t)&=\sqrt{1/2+t}\,f_1-2^{-1/2}f_4,\\
 F_2(t)&=\sqrt{1+t}\,f_2,\\
 F_3(t)&=\sqrt{1-t}\,f_3,\\
 e(t)&=(t,1,0),\qquad \Psi_i(t)=F_i(t)+e_i(t)\chi.
 \end{aligned} \tag{16}
\]

## The exact old-prefix gate that excludes the model

Let

\[
 A:=Q_{N-1}\succ0,\qquad R=A^{-1},
\]

and restrict `v,d` to the old prefix.  Define the congruence-invariant
scalars

\[
 V=v^*Rv,\qquad D=d^*Rd,\qquad v^*Rd=C+iJ. \tag{17}
\]

The old principal block is

\[
 (M_{0,N})_{\rm old}=A+vd^*+dv^*. \tag{18}
\]

After whitening by `A^(-1/2)`, the two possibly nonzero eigenvalues of the
cross term are

\[
 C\mathbin\pm\sqrt{VD-J^2}. \tag{19}
\]

Consequently

\[
 \boxed{
 (M_{0,N})_{\rm old}\succeq0
 \quad\Longleftrightarrow\quad
 \sqrt{VD-J^2}-C\leq1.} \tag{20}
\]

For the real theta data this is

\[
 \boxed{\sqrt{VD}-C\leq1.} \tag{21}
\]

If (20) holds, `M_(0,N)` is a one-coordinate extension of a positive
semidefinite matrix, so interlacing gives `n_-(M_(0,N))<=1`.  The explicit
example violates (21): `V=D=1`, `C=-1`, and `sqrt(VD)-C=2`.

For an invertible old-basis change `S`,

\[
 A\mapsto S^*AS,\qquad v\mapsto S^*v,\qquad d\mapsto S^*d.
\]

Equations (18)--(21) and the scalars `V,D,C,J` are unchanged.  Thus whitening
is only a proof device; the condition is not a favorable-coordinate
artifact.  The exact-coordinate construction above was given before
whitening so that prescribed residue/drift coefficients are retained.

## Theta-specific status of the gate

In the exact spatial notation, on an old same-parity polynomial prefix,

\[
 F_p=p(D)\psi=\Psi_p-e(p)\chi,
 \quad d(p)=e(p'),
\]

\[
 X_0p=2hF_p+\Psi_{p'},
 \qquad Y_0p=\Psi_{p'},
\]

and

\[
 M_0(p,q)={1\over2}
 \bigl(\langle X_0p,X_0q\rangle-
       \langle Y_0p,Y_0q\rangle\bigr),
 \qquad v(p)=\langle hF_p,\chi\rangle. \tag{22}
\]

Therefore (20) is exactly positivity of the raw-drift form (22) on the old
prefix, equivalently

\[
 \|Y_0p\|\leq\|X_0p\|
 \quad\hbox{for every old-prefix }p. \tag{23}
\]

No present parent-positivity, Poisson-residue, or scalar divisor identity
implies (23).  In particular, positive conditioning of the actual target
`A=Q_(N-1)` does not imply (20).  A proof would need a theta-specific
matrix-level signed compensation estimate retaining the corrected-feature /
residue cross terms.  Conversely, proving (23) over every degree would be a
very strong statement: via the spectral representation of `M_0`, it cannot be
treated as an innocuous generic inertia lemma.

No numerical value of (21) for an actual theta prefix is asserted here.  Such
a value requires reconstructing `M_0,v,d` in one common exact convention and
then solving only against the already positive actual target block `A`; it
must not be inferred from finite target conditioning.

The independent `M0_INERTIA_EQUIVALENCE_AUDIT.md` sharpens the global warning:
on either complete parity ladder, any uniform finite bound on
`n_-(M_(0,N))` is endpoint-equivalent to nonnegativity of the bridge density.
Thus (2) is useful as an audit consequence and (20) as an exact local gate,
but neither is presently a generic shortcut to the all-degree target.

## Conclusion

Positive full endpoint target `Q_N` does imply `n_-(M_(0,N))<=1`, but this is
already downstream of the desired endpoint result.  Under the inductively
available hypothesis `Q_(N-1)>0`, the sharp structure-free bound is two, and
the positive-parent Gram model above attains it while preserving arbitrary
exact `e,d` data.  The missing theta-specific input can be stated precisely
as the old-prefix inequality (20), or equivalently the raw-drift contraction
(23).
