# UNADMITTED Suzuki operator Weyl-transfer audit

## 0. Status, question, and outcome

This note is **UNADMITTED**.  It follows up the exact finite congruence in
`notes/UNADMITTED_SUZUKI_SHIFTED_METRIC_REAL_POLE_AUDIT.md` and uses
Masatoshi Suzuki, *Weil's quadratic form via the screw function*,
[arXiv:2606.09096v1](https://arxiv.org/abs/2606.09096v1), only as a candidate
source.  Nothing here changes a source lock, producer, verifier, artifact,
ledger, README, or project status.

After deleting the derivative zero mode, there is a legal scalar transfer
function.  It is a generalized resolvent matrix element of the pencil

\[
 S_c-\zeta K=G+cK-\zeta K,                                        \tag{0.1}
\]

not a scalar subtraction from the reciprocal of a characteristic
determinant.  Its exact de-shift is the translation

\[
 \boxed{m_c(z+c)=m_0(z).}                                         \tag{0.2}
\]

Every finite pole is real.  The full resolvent trace is canonical and has
the unit pole residues of a logarithmic derivative.  A normalized boundary
matrix element does not: its residues are boundary spectral weights, and a
unit boundary vector has total residue mass one.  It cannot converge on all
pole contours to the logarithmic derivative of `xi`, whose pole divisor has
unbounded total multiplicity.

There is also a structural mismatch.  The pencil (0.1) is unitarily
equivalent to the localized Weil operator `A`.  Its poles are eigenvalues of
`A`, whereas Suzuki's conjectural zero ordinates are eigenvalues of a
self-adjoint extension of the minimal differential operator in the
`T_c`-metric.  The source proves no convergence from the former spectrum to
the latter divisor.  The metric congruence does not translate the extension
spectrum as `c` varies.

Thus this audit gives an exact operator construction and an exact
convergence criterion, but it also gives a finite-dimensional no-go for a
unit-normalized boundary substitute.  No meromorphic convergence to
`xi'/xi` or `xi'/(z^2 xi)` is proved.

## 1. Zero-mode deletion and exact whitening

Let `V` and `U` be finite-dimensional Hilbert spaces of the same dimension.
After deleting the constant mode, assume

\[
 D:V\longrightarrow U                                             \tag{1.1}
\]

is invertible.  Let `G=G^*` on `U`, and define

\[
 K=(DD^*)^{-1}=D^{-*}D^{-1}>0,
 \qquad A=D^*GD,                                                    \tag{1.2}
\]

\[
 S_c=G+cK,
 \qquad T_c=A+cI=D^*S_cD.                                         \tag{1.3}
\]

The sign and the occurrence of `K`, rather than `I`, are exact.  Put

\[
 Q=K^{1/2}D,
 \qquad H=K^{-1/2}GK^{-1/2}.                                      \tag{1.4}
\]

Then `Q` is unitary and

\[
 A=Q^*HQ,
 \qquad T_c=Q^*(H+cI)Q,                                           \tag{1.5}
\]

\[
 S_c=K^{1/2}(H+cI)K^{1/2}.                                       \tag{1.6}
\]

In particular,

\[
 S_c-(z+c)K=G-zK,                                                  \tag{1.7}
\]

and

\[
 T_c-(z+c)I=A-zI.                                                  \tag{1.8}
\]

Equations (1.7)--(1.8) are the operator-level de-shift.  They require no
positivity of `G` and no assertion about zeros of `xi`.  The only positivity
used is `K>0`, which comes from removing `ker D`.  They also show that an
exactly de-shifted resolvent contains no residual benefit from choosing
`c>0`: after recentering, it is literally the unshifted pencil resolvent.

## 2. Legal finite Weyl and trace transfers

### 2.1 Boundary matrix element

Fix a vector `beta` in the whitened space `U`.  Define

\[
 m_{c,\beta}(\zeta)
 =\left\langle\beta,(H+cI-\zeta I)^{-1}\beta\right\rangle.         \tag{2.1}
\]

Equivalently, with `b=K^(1/2) beta`,

\[
 m_{c,\beta}(\zeta)
 =\left\langle b,(S_c-\zeta K)^{-1}b\right\rangle.                \tag{2.2}
\]

If `H=sum_j lambda_j P_j`, then

\[
 m_{c,\beta}(\zeta)
 =\sum_j{\|P_j\beta\|^2\over\lambda_j+c-\zeta}.                  \tag{2.3}
\]

It follows immediately that:

1. every pole is real;
2. the residue at `lambda_j+c` is `-||P_j beta||^2`;
3. `m_(c,beta)` is a Nevanlinna function in the upper half-plane; and
4. the exact de-shift is

\[
 \boxed{m_{c,\beta}(z+c)=m_{0,\beta}(z).}                          \tag{2.4}
\]

The shift is in the spectral argument.  There is no subtraction of `c` or
`c/z^2` from the scalar function.

### 2.2 Canonical counting transfer

The basis-independent choice is the full trace

\[
 q_c(\zeta)
 =\operatorname{tr}(H+cI-\zeta I)^{-1}                            \tag{2.5}
\]

\[
 =\operatorname{tr}\!\left(K(S_c-\zeta K)^{-1}\right)
 =\operatorname{tr}(T_c-\zeta I)^{-1}.                            \tag{2.6}
\]

For

\[
 p_c(\zeta)=\det(\zeta I-T_c),                                   \tag{2.7}
\]

one has

\[
 \boxed{q_c(\zeta)=-{p_c'(\zeta)\over p_c(\zeta)},
 \qquad q_c(z+c)=q_0(z).}                                        \tag{2.8}
\]

This is not a de-shifted determinant assertion.  It is the trace of the
operator resolvent, followed by the exact pencil translation (1.7).  Its
residue at a pole is minus the eigenvalue multiplicity.

Let

\[
 X(z)=\xi(1/2-iz),
 \qquad M(z)={\xi'(1/2-iz)\over\xi(1/2-iz)}.                      \tag{2.9}
\]

Since `X'(z)=-i xi'(1/2-iz)`,

\[
 \boxed{-{X'(z)\over X(z)}=iM(z).}                                \tag{2.10}
\]

Thus `q_c`, not `1/p_c-c`, has the correct local pole normalization for a
candidate approximation to `iM`: both have residue minus the multiplicity.
If such a limit were established, the two requested targets would be
recovered by

\[
 M=-i\,q,
 \qquad {M\over z^2}=-{i\over z^2}q.                              \tag{2.11}
\]

Equation (2.11) is only a target conversion.  It is not a proved limit.

## 3. Boundary-residue no-go

The real-pole property alone does not give the counting residues in
(2.10).

### Proposition 3.1 (exact finite residue condition)

Let `C>=0` and put

\[
 m_{c,C}(\zeta)
 =\operatorname{tr}\!\left(C(H+cI-\zeta I)^{-1}\right).           \tag{3.1}
\]

At the pole `lambda+c`, its residue is

\[
 -\operatorname{tr}(CP_\lambda).                                  \tag{3.2}
\]

Therefore `m_(c,C)=q_c` if and only if

\[
 \operatorname{tr}(CP_\lambda)=\operatorname{rank}P_\lambda
 \quad\text{for every eigenspace of }H.                           \tag{3.3}
\]

For a vector observation `C=|beta><beta|` and simple spectrum, (3.3) is

\[
 |\langle e_j,\beta\rangle|^2=1\quad\text{for every }j.            \tag{3.4}
\]

In particular, a unit vector cannot satisfy (3.4) in dimension greater
than one.  A vector that does satisfy it has norm squared equal to the
dimension and is spectrally calibrated to every eigenvector.  Neither
equal-norm normalization of two deficiency vectors nor self-adjointness
provides (3.4).

**Proof.**  Formula (3.2) follows from the spectral decomposition.  Two
rational functions that vanish at infinity are equal precisely when their
principal parts at every pole agree.  This gives (3.3), and its rank-one,
simple-spectrum specialization is (3.4).  Summing (3.4) proves the norm
statement.  \(\square\)

### Corollary 3.2 (bounded boundary mass cannot count an infinite divisor)

Let `beta_j` be boundary vectors with

\[
 \sup_j\|\beta_j\|^2\leq C<\infty.                                \tag{3.5}
\]

The sum of the absolute pole residues of `m_(c_j,beta_j)` is at most `C`.
If these functions converge uniformly on disjoint small contours around
finitely many target poles, residue convergence forces the sum of the
target multiplicities on those contours to be at most `C`.  Consequently a
bounded-mass boundary sequence cannot converge contour-locally to
`-X'/X`, whose nontrivial-zero divisor has unbounded total multiplicity.

This is a finite-measure obstruction, not an assertion about the location
of those zeros.  A rescaled boundary vector with diverging norm could evade
it, but then the scale and the asymptotic flat-weight conditions (3.3) must
be proved.  Suzuki v1 supplies neither.

Multiplication by `-i/z^2` does not remove this obstruction for the second
target.  At every nonzero pole it merely multiplies both the required and
observed residues by the same known factor `-i/z_0^2`; the missing boundary
weight remains missing.  It also introduces the separate origin
normalization already identified in the preceding shifted-metric audit.

### Exact countermodel

Take

\[
 H=\operatorname{diag}(1,4,9),
 \qquad \beta=(1,2,0)^T.                                          \tag{3.6}
\]

Then

\[
 m_{c,\beta}(\zeta)
 ={1\over1+c-\zeta}+{4\over4+c-\zeta},                            \tag{3.7}
\]

while

\[
 q_c(\zeta)
 ={1\over1+c-\zeta}+{1\over4+c-\zeta}
  +{1\over9+c-\zeta}.                                            \tag{3.8}
\]

The boundary response misses one real pole and gives the wrong residue at
another, even though the pencil is Hermitian, `K>0`, and the operator
de-shift (2.4) is exact.

## 4. A precise regularized convergence obligation

The unregularized trace in (2.5) need not remain bounded when the dimension
grows.  There is a canonical base-point subtraction at the resolvent level.
Fix `eta` with `Im eta>1/2` (for example `eta=i`), so that
`Re(1/2-i eta)>1` and the target is unconditionally regular there, and
define

\[
 r_{c,\eta}(z)
 =\operatorname{tr}\!\left[
   K(S_c-(z+c)K)^{-1}
  -K(S_c-(\eta+c)K)^{-1}\right].                                  \tag{4.1}
\]

By (1.7),

\[
 \boxed{r_{c,\eta}(z)
 =\operatorname{tr}\!\left[(H-zI)^{-1}-(H-\eta I)^{-1}\right],}  \tag{4.2}
\]

so it is exactly independent of `c`.  It has real poles, the same counting
residues as `q_0`, and the normalization `r_(c,eta)(eta)=0`.

The following criterion states exactly what a growing finite sequence would
have to prove.

### Theorem 4.1 (resolvent-moment convergence gate)

Let `H_j` be finite Hermitian matrices, retain `Im eta>1/2`, and let

\[
 R_{j,\eta}=(H_j-\eta I)^{-1},                                    \tag{4.3}
\]

and suppose

\[
 \sup_j\|R_{j,\eta}\|_{\mathfrak S_2}^2
 =\sup_j\sum_k{1\over|\lambda_{j,k}-\eta|^2}<\infty.              \tag{4.4}
\]

Then the functions

\[
 r_j(z)=\operatorname{tr}\!\left[(H_j-zI)^{-1}-R_{j,\eta}\right] \tag{4.5}
\]

form a normal family on the upper half-plane.  If, for every `n>=1`,

\[
 \boxed{
 \operatorname{tr}(R_{j,\eta}^{\,n+1})
 \longrightarrow {1\over n!}
   \left.{d^n\over dz^n}\left(i{\xi'(1/2-iz)\over
                                      \xi(1/2-iz)}\right)
   \right|_{z=\eta},}                                             \tag{4.6}
\]

then the target on the right of (4.6) must extend holomorphically through
the upper half-plane, and

\[
 r_j(z)\longrightarrow
 i{\xi'(1/2-iz)\over\xi(1/2-iz)}
 -i{\xi'(1/2-i\eta)\over\xi(1/2-i\eta)}                           \tag{4.7}
\]

locally uniformly there.  The analogous lower-half-plane statement uses a
base point below the real axis.

**Proof.**  For `|z-eta|<Im(eta)`, the resolvent series gives

\[
 r_j(z)=\sum_{n\geq1}(z-\eta)^n
              \operatorname{tr}(R_{j,\eta}^{\,n+1}).              \tag{4.8}
\]

Bound (4.4) implies

\[
 \left|\operatorname{tr}(R_{j,\eta}^{\,n+1})\right|
 \leq (\operatorname{Im}\eta)^{-(n-1)}
       \|R_{j,\eta}\|_{\mathfrak S_2}^2.                         \tag{4.9}
\]

Hence (4.6) gives local uniform convergence near `eta` to the Taylor series
of the target difference in (4.7).  On a compact subset of the upper
half-plane, the resolvent identity and the Hilbert--Schmidt inequality give

\[
 |r_j(z)|
 \leq |z-\eta|\,
       \|(H_j-zI)^{-1}\|_{\mathfrak S_2}
       \|R_{j,\eta}\|_{\mathfrak S_2},                            \tag{4.10}
\]

and the first Hilbert--Schmidt norm is uniformly controlled by the second
because every `lambda_(j,k)` is real.  Montel's theorem gives normality.
Every subsequential limit agrees with (4.7) near `eta`, hence throughout
the pole-free part of the upper half-plane by the identity theorem.  A
target pole there would contradict the holomorphy and local boundedness of
the normal-family limit.  Therefore the hypotheses themselves force the
stated holomorphic continuation, and uniqueness gives convergence of the
whole sequence.  \(\square\)

The derivatives in (4.6) are obtained directly from `xi` at the safe
nonreal base point; they do not require a zero table.  Conversely, (4.6)
and (4.4) are not consequences of the finite shift identity.  They are the
new analytic burden.

Condition (4.4) is a clean sufficient normal-family hypothesis, not a claim
about the actual localized Weil operators.  If their resolvents fail this
Schatten bound, a higher or relative trace regularization with an explicitly
pinned reference operator would be required.  Such a reference and the
corresponding convergence theorem are not supplied by the Suzuki source and
cannot be chosen merely to force the target.

The phase in (4.6) is forced.  The functions in (4.5) are differences of
Nevanlinna resolvents, and the unregularized target is

\[
 Q_\xi(z)=i{\xi'(1/2-iz)\over\xi(1/2-iz)}.                         \tag{4.11}
\]

The source cited by Suzuki records that the Nevanlinna property of
`Q_xi` is itself equivalent to the missing global zero-location statement.
It may not be assumed in order to prove (4.6).

This is also a direct normal-family obstruction for boundary functions.
Every `m_(c,beta)` in (2.1) is Nevanlinna.  A locally uniform, nonconstant
limit of such functions in the upper half-plane is again Nevanlinna.
Consequently identifying that limit with `Q_xi` would itself establish the
missing Nevanlinna property; it cannot be obtained merely by citing the
self-adjointness of the finite pencils.

## 5. Why the legal transfer still has the wrong source poles

The exact pole set of (2.5) is

\[
 \operatorname{spec}H=\operatorname{spec}A.                       \tag{5.1}
\]

These are generalized eigenvalues of `G u=lambda K u`, equivalently the
eigenvalues of the localized Weil-form operator `A`.  In Suzuki v1, the
conjectural approximants to the zero ordinates instead come from
self-adjoint extensions of the minimal first-order differential operator in
the `T_c`-form Hilbert space.  Unitary equivalence between the `T_c` and
`S_c` descriptions at one fixed `c` does not identify either extension
spectrum with (5.1).

Nor does the metric shift translate an extension spectrum.  A finite model
already shows the issue.  Let a Hermitian boundary form be `B`, let
`T_c=T_0+cI>0`, and realize the metric-self-adjoint operator as

\[
 L_c=T_c^{-1}B.                                                     \tag{5.2}
\]

With

\[
 T_0=\operatorname{diag}(1,2),
 \qquad B=\operatorname{diag}(1,6),                               \tag{5.3}
\]

one has

\[
 \operatorname{spec}L_c
 =\left\{{1\over1+c},{6\over2+c}\right\},                        \tag{5.4}
\]

which is neither a common translation of `spec L_0` nor obtained by a
scalar subtraction from a characteristic reciprocal.  Extra commutation
can make a metric realization independent of `c`, but it still does not
produce the translation (0.2).  The congruence for `T_c` alone therefore
does not supply an exact de-shift for Suzuki's differential-extension
characteristic function.

Finally, the source's one-sided formula for `g` is linear in the kernel,
whereas (2.1), (2.5), and (4.1) are nonlinear inverse-operator responses.
Computing the kernel therefore does not identify any of these Weyl
functions with `Q_xi`.  Such an identification would require a new
finite-section or Wiener--Hopf theorem for

\[
 (G_a-zK_a)u=b,                                                     \tag{5.5}
\]

including boundary terms, normalization, and locally uniform meromorphic
control.  No such theorem appears in v1, and the one-sided transform cannot
be substituted for it.

## 6. Verdict

There is one legal operator-level alternative:

\[
 \boxed{
 r_{c,\eta}(z)
 =\operatorname{tr}\!\left[
 K(S_c-(z+c)K)^{-1}-K(S_c-(\eta+c)K)^{-1}\right].}                \tag{6.1}
\]

It has only real finite poles, counts their multiplicities, has a canonical
base-point normalization, and removes `c` exactly by spectral recentering.
That exactness also makes the positivity shift analytically vacuous for this
transfer: (6.1) is exactly the unshifted regularized resolvent trace.
The same construction with one boundary vector also has real poles and the
exact recentering, but it carries boundary weights and is ruled out under a
bounded/unit normalization as an approximation to the full logarithmic
derivative divisor.

No theorem in the unadmitted Suzuki sources proves that the poles in (6.1)
approach the poles of `xi'/xi`.  The precise missing inputs are the uniform
resolvent control (4.4), every source-computable moment limit (4.6), and a
new identification of the localized Weil-operator spectrum with the
desired divisor.  Replacing (6.1) by the differential-extension Weyl
function restores the conjecturally relevant poles but loses the exact
shift relation and reopens the Hilbert-scale and normalization gaps.  The
source does not provide one scalar object with both properties.
