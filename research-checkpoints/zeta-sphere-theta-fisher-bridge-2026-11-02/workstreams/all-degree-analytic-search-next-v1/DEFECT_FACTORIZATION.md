# Exact defect factorization of the paid-twin border

## Scope

This note rewrites the normalized endpoint Schur blocker as an exact
one-point contractive-extension condition. It is an arbitrary finite-grade
Hilbert-space identity. It does not prove that the condition holds at every
grade, and it has no RH conclusion by itself.

## Endpoint operators

On the parity polynomial space define

\[
Xp=2h\,p(D)\psi+p'(D)\psi,
\qquad
Yp=p'(D)\psi
\]

as vectors in `H=L^2(0,infinity;dh)`. The normalized endpoint target form is

\[
\mathfrak q(p)=\frac12\left(\|Xp\|^2-\|Yp\|^2\right). \tag{1}
\]

Let `P_old` be the previous same-parity polynomial space and suppose its
actual target block is positive. Set

\[
\mathcal M=X P_{\rm old}.
\]

Then the rule

\[
T(Xp)=Yp,\qquad p\in P_{\rm old}, \tag{2}
\]

defines a strict contraction on the finite-dimensional space `M`. Its defect
operators are

\[
D_T=(I-T^*T)^{1/2},
\qquad
D_{T^*}=(I-TT^*)^{1/2}. \tag{3}
\]

## Exact border identity

For a new polynomial `p`, put `x=Xp`, `y=Yp`,
`x_0=P_M x`, and `x_perp=(I-P_M)x`. Let `S(p)` be the Schur complement of
the old actual target block in the target block enlarged by `p`. Direct Schur
elimination gives

\[
2S(p)=
\|x\|^2-\|y\|^2
-\left\|D_T^{-1}(x_0-T^*y)\right\|^2. \tag{4}
\]

Using the standard defect intertwining identity gives the equivalent and more
revealing form

\[
\boxed{
2S(p)=
\|x_\perp\|^2
-\left\|D_{T^*}^{-1}(y-Tx_0)\right\|^2.
} \tag{5}
\]

To check (4), an old vector `m=Xq` has target inner product

\[
2\mathfrak q(q,p)
=\langle m,x\rangle-\langle Tm,y\rangle
=\langle m,x_0-T^*y\rangle,
\]

while the doubled old target metric on `M` is `D_T^2`. Its inverse Schur cost
is therefore the last term of (4). Equation (5) is the usual two-defect
completion of squares.

Consequently the missing border inequality is exactly

\[
\boxed{
\left\|D_{T^*}^{-1}
\bigl(Yp-T P_\mathcal M Xp\bigr)\right\|
\leq
\left\|(I-P_\mathcal M)Xp\right\|.
} \tag{6}
\]

This is necessary and sufficient for the enlarged block to remain positive
semidefinite; strict inequality gives a positive new pivot. It is not a
uniform strict-contraction statement.

## Relation to the forcing innovations

Let `s_j` be the old target LDL pivots and `eta_j` the forcing innovations in
that basis. Equation (6) is equivalent to the three-channel Hardy inequality

\[
\left\|
\begin{pmatrix}
Yp\\
\sqrt2\,\eta_0/\sqrt{s_0}\\
\vdots\\
\sqrt2\,\eta_{n-1}/\sqrt{s_{n-1}}
\end{pmatrix}
\right\|
\leq \|Xp\|. \tag{7}
\]

Indeed, `S>=0` is precisely

\[
\frac12(\|Xp\|^2-\|Yp\|^2)
\geq\sum_{j<n}\frac{|\eta_j|^2}{s_j}.
\]

Thus the reflected and regression-motion payments are components of one
coupled defect inequality; they are not independent debts.

## Residue and residue-drift coordinates

Let the regression residual and its opposite-parity drift have raw/corrected
splits

\[
r=\Psi_p-\rho\chi,
\qquad
k=\Psi_{p'}-\kappa\chi, \tag{8}
\]

where

\[
\rho=e_n-\sum_j\alpha_j e_j,
\qquad
\kappa=n e_{n-1}-\sum_jj\alpha_j e_{j-1}. \tag{9}
\]

Then

\[
Xp=(2h\Psi_p+\Psi_{p'})-\rho(2h\chi)-\kappa\chi,
\qquad
Yp=\Psi_{p'}-\kappa\chi. \tag{10}
\]

Thus two linked scalar coordinates, not one, enter the endpoint border. Write

\[
x=x_F+\rho x_\rho+\kappa x_\kappa,
\qquad
y=y_F+\rho y_\rho+\kappa y_\kappa
\]

for the three terms in (10), and define

\[
a_\bullet=(I-P_\mathcal M)x_\bullet,
\qquad
d_\bullet=D_{T^*}^{-1}
\bigl(y_\bullet-T P_\mathcal M x_\bullet\bigr). \tag{11}
\]

Equation (5) becomes the exact residue-motion quadratic

\[
2S(p)=
\|a_F+\rho a_\rho+\kappa a_\kappa\|^2
-\|d_F+\rho d_\rho+\kappa d_\kappa\|^2. \tag{12}
\]

This is a `3x3` Hermitian form in `(1,rho,kappa)`. Its signed cross entries are
the feature/residue compensation that must remain. The stage-1 raw-orbit pair
probes numerically obstruct the same *type* of absolute split; they do not
directly evaluate these paid-twin defect entries. Requiring the full
coefficient matrix in (12) to be positive semidefinite treats the three
coordinates as independent and is stronger than necessary. Positivity is
needed only on their actual graded theta graph.

## EGF links for the two scalar coordinates

Put

\[
B(t)=e^{5t/2-\frac32(e^{2t}-1)}.
\]

The residue EGF from `GENERATING_FUNCTION.md` satisfies the exact first-order
identity

\[
C(t)=-\left(\partial_t+\frac12\right)B(t),
\qquad
-C(t)=\left(\partial_t+\frac12\right)B(t). \tag{13}
\]

If `B(t)=sum b_j t^j/j!`, the graded residue coordinates obey

\[
e_j=b_{j+1}+\frac12b_j. \tag{14}
\]

For the shifted basis `(D+a)^j`, the residue EGF is

\[
E_a(t)=-e^{at}C(t).
\]

Consequently its endpoint derivative has coefficients

\[
d_j=je_{j-1},
\qquad
\sum_{j\geq0}d_j\frac{t^j}{j!}=-tC(t). \tag{15}
\]

The sequences `e` and `d` are not proportional, even after restricting to a
parity ladder. In the odd ladder `(e_1,d_1)=(-6,0)` and
`(e_3,d_3)=(195/2,-18)`; in the even ladder `(e_2,d_2)=(-6,-12)` and
`(e_4,d_4)=(489,390)`. The minimal uniform residue augmentation is therefore
corrected feature plus `(rho,kappa)`, not a single scalar. Neither sequence is
an independent positive moment coordinate.

## Exact rank-one downdate form

For raw Gram data `H,u,gamma` and the residue vector `e`, the corrected Gram is

\[
G=H-ue^*-eu^*+\gamma ee^*. \tag{16}
\]

Put

\[
v=u-\gamma e,
\qquad
M_0=\dot H-\dot u\,e^*-e\,\dot u^*+\dot\gamma\,ee^*.
\]

Direct differentiation, using `d=dot e`, gives

\[
\dot G=M_0-vd^*-dv^*. \tag{17}
\]

After applying the fixed congruence that forms the new residual and old
target-LDL innovations, and reusing `M_0,v,d` for their congruence images, the
left side is the exact border block

\[
M=\begin{pmatrix}
\dot\delta_n&\eta_n^*\\
\eta_n&\operatorname{diag}(s_j)
\end{pmatrix}.
\]

For every `tau>0`, define

\[
a_\tau=\frac{\sqrt\tau\,v-\tau^{-1/2}d}{\sqrt2},
\qquad
b_\tau=\frac{\sqrt\tau\,v+\tau^{-1/2}d}{\sqrt2}.
\]

Then exactly

\[
M=M_0+a_\tau a_\tau^*-b_\tau b_\tau^*. \tag{18}
\]

Thus, with `B_tau=M_0+a_tau a_tau^*`, positivity of `M` is equivalent to

\[
B_\tau\succeq0,
\qquad
b_\tau\in\operatorname{Ran}B_\tau,
\qquad
b_\tau^*B_\tau^\dagger b_\tau\leq1, \tag{19}
\]

or equivalently

\[
\begin{pmatrix}B_\tau&b_\tau\\b_\tau^*&1\end{pmatrix}\succeq0. \tag{20}
\]

This is a second exact correlated target. Generic Young/Cauchy replaces
`-vd^*-dv^*` by `-tau vv^*-tau^-1 dd^*`, discarding the favorable square
`a_tau a_tau^*` and demanding a strictly stronger inequality.

## Indefinite pure-residue block

In the actual half-line parent coordinate `chi=q/2-q'`, the pure residue part
of `dot-delta` is

\[
2A|\rho|^2+2\Gamma\operatorname{Re}(\bar\rho\kappa),
\quad
A=\langle h\chi,\chi\rangle_0>0,
\quad
\Gamma=\langle\chi,\chi\rangle_0>0.
\]

Its Hessian is

\[
\begin{pmatrix}2A&\Gamma\\\Gamma&0\end{pmatrix},
\qquad
\det=-\Gamma^2<0. \tag{21}
\]

No standalone positive scalar residue block exists. The corrected-feature
cross term must pay its negative direction. Moreover, `q/2` and `q'` are not
separate vectors in the actual parent space at the normalized endpoint; only
their cancellation `chi=q/2-q'` is admissible.

## Why generic Cauchy does not close (6)

- Replacing `D_(T*)^-1` by its operator norm requires a uniform strict old
  contraction gap. The target permits the gap to approach zero, so that route
  is unavailable.
- Cauchy in the old signed target metric is circular: its dual norm is exactly
  `sum |eta_j|^2/s_j`, the quantity that must be paid.
- Cauchy on the off-diagonal entries of (12) makes the same type of absolute
  split that loses `10^(1.39 N^2)` cancellation in the stage-1 raw-orbit pair
  probes. That observed rate is not itself a paid-twin defect estimate.
- The residue EGF is not a positive moment kernel: its initial coefficients
  already fail the corresponding Hankel positivity test.
- Full-filtration residue conditioning has no degree-uniform raw-norm bound.
  This does not alone prove the same obstruction in a fixed parity ladder, but
  it rules out a generic scalar-only payment.
- Pointwise domination is already obstructed by known local negativity. The
  needed estimate must be integrated and theta-specific.

## Refined proof target

For each new same-parity rung, construct or estimate the defect vector

\[
z_n=D_{T^*}^{-1}
\left(Yp_n-T P_\mathcal M Xp_n\right) \tag{22}
\]

and prove

\[
\|z_n\|\leq\|(I-P_\mathcal M)Xp_n\| \tag{23}
\]

while keeping the `-C(t)` residue and `-tC(t)` residue-drift terms inside
`z_n`. Equivalently, one may prove the correlated rank-one condition (19).
This is the sharpened
all-degree analytic blocker. `STAGE2_BORDER_FALSIFIER.md` specifies a bounded
finite-rung audit that can reject false estimates of (23), but finite success
cannot establish it for all grades.

Two further exact reductions are recorded separately. In
`SPECTRAL_DEFECT_CLOSURE.md`, the complete parity ladders are precisely the
signed Hankel moment problem for the first Xi Laguerre density; the next defect
is its signed Christoffel pivot, with an exact cross-parity recurrence. In
`RANK_TWO_BALANCE.md`, a positive base `M_0` reduces the rank-two drift to one
congruence-invariant scalar condition, but `M_0>=0` is unproved. The same note
shows that the pure Poisson-residue sector fails contractivity for every
balancing parameter, so corrected-feature cross compensation is indispensable.
