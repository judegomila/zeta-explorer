# Nonlocal spectral structure of the signed base `M_0`

## Scope and outcome

This note identifies the exact Fourier structure of the **pre-congruence**
finite-prefix form

\[
M_0=\dot H-\dot u\,e^*-e\,\dot u^*+\dot\gamma\,ee^*.
\tag{1}
\]

The result is

\[
\boxed{
M_0=Q+vd^*+dv^*,}
\tag{2}
\]

where `Q` is the actual Xi--Laguerre multiplier, `v` is a one-sided
complete-theta boundary functional, and `d=e circ derivative` is the exact
residue-drift functional.  Thus `M_0` is a scalar multiplier plus a nonlocal
rank-two kernel, not a second scalar multiplier.

The companion
[`M0_INERTIA_EQUIVALENCE_AUDIT.md`](M0_INERTIA_EQUIVALENCE_AUDIT.md)
proves that, on either complete parity ladder, any uniform finite bound on
the negative inertia of the finite-prefix `M_0` matrices is equivalent to
the target endpoint Laguerre sign.  In particular, the tempting bound
`n_-(M_0)<=1` is target-equivalent, while all-prefix `M_0>=0` is a stronger
sufficient assertion.  No such positivity is proved here, and there is no
RH conclusion.

## 1. The two inner products and the factor of `h`

Two pairings occur.  Write

\[
(f,g)_{L^2}=\int_0^\infty f(h)\overline{g(h)}\,dh,
\qquad
\langle f,g\rangle_0
=\int_0^\infty h f(h)\overline{g(h)}\,dh. \tag{3}
\]

The second is the actual endpoint positive-parent pairing.  The parent path
is

\[
\langle f,g\rangle_a
=\int_0^\infty h e^{2ah}f(h)\overline{g(h)}\,dh,
\qquad |a|\leq\frac12. \tag{4}
\]

For a polynomial channel `p`, let

\[
F_p=p(D)\psi=\Psi_p-e(p)\chi, \tag{5}
\]

where `Psi_p` is the raw half-line theta feature and `e(p)` is its exact
residue coordinate.  At `a=0`,

\[
H(p,q)=\langle\Psi_p,\Psi_q\rangle_0,
\quad u(p)=\langle\Psi_p,\chi\rangle_0,
\quad \gamma=\langle\chi,\chi\rangle_0. \tag{6}
\]

Therefore

\[
G=H-ue^*-eu^*+\gamma ee^*,
\qquad v=u-\gamma e, \tag{7}
\]

and the exact functional represented by `v` is

\[
\boxed{
v(p)=\langle F_p,\chi\rangle_0
=\int_0^\infty h\,[p(D)\psi](h)\overline{\chi(h)}\,dh.}
\tag{8}
\]

This reconciles the notation in the pure-residue calculation.  There,

\[
\Gamma=\|\chi\|_0^2=\int_0^\infty h|\chi|^2,
\qquad
A=\langle h\chi,\chi\rangle_0
=\int_0^\infty h^2|\chi|^2. \tag{9}
\]

Thus the formal pure-residue feature `F_p=-e(p)chi` gives
`v_res=-Gamma e`.  There is no missing `h`: it is already part of the parent
pairing in (3).

For the shifted basis `(D+a)^j`, the residue EGF is

\[
E_a(t)=-e^{at}C(t).
\]

Its derivative is the algebraic polynomial functional

\[
\boxed{
d(p)=e(p'),\qquad d_j=je_{j-1},
\qquad \sum_{j\geq0}d_j\frac{t^j}{j!}=-tC(t).}
\tag{10}
\]

The documented residue pairs show that `e` and `d` are not proportional on
either parity ladder.  No identity reducing the separate parent-correlation
functional `v` to `d` is supplied by the residue EGF.

## 2. Exact frozen-residue factorization

Define the actual endpoint pair

\[
Yp=F_{p'},
\qquad Xp=2hF_p+F_{p'}, \tag{11}
\]

and the pair obtained when the residue coordinate is frozen while the shift
is differentiated,

\[
Y_0p=\Psi_{p'}=F_{p'}+d(p)\chi,
\qquad X_0p=2hF_p+\Psi_{p'}. \tag{12}
\]

Hermitian polarization gives

\[
\begin{aligned}
\mathfrak q(p,q)
 &=\frac12\{(Xp,Xq)_{L^2}-(Yp,Yq)_{L^2}\},\\
\mathfrak m_0(p,q)
 &=\frac12\{(X_0p,X_0q)_{L^2}-(Y_0p,Y_0q)_{L^2}\}.
\end{aligned} \tag{13}
\]

The terms quadratic in `d chi` cancel between the two signed squares.  Since
`X-Y=2hF`, the remaining cross terms are exactly

\[
\boxed{
\mathfrak m_0(p,q)
=\mathfrak q(p,q)
+v(p)\overline{d(q)}+d(p)\overline{v(q)}.}
\tag{14}
\]

This is (2), and rearranging gives the documented identity

\[
Q=M_0-vd^*-dv^*. \tag{15}
\]

As a factor check, in the formal pure-residue sector `Y_0p=0` and
`X_0p=-2e(p)hchi`, so

\[
\mathfrak m_{0,{\rm res}}(p,p)
=\frac12\|-2e(p)h\chi\|_{L^2}^2
=2A|e(p)|^2. \tag{16}
\]

Equations (8), (9), and (16) reproduce exactly
`v_res=-Gamma e` and `M_(0,res)=2Aee^*` from
[`RANK_TWO_BALANCE.md`](RANK_TWO_BALANCE.md).  The complementary physical
derivation is recorded in
[`M0_SPATIAL_FACTORIZATION.md`](M0_SPATIAL_FACTORIZATION.md).

## 3. Exact Fourier kernel

Use the nonunitary convention

\[
\widehat f(\nu)=\int_{\mathbb R}f(h)e^{-i\nu h}\,dh,
\qquad \widehat\psi(\nu)=2\Xi(\nu). \tag{17}
\]

For fixed-parity polynomials, the actual target form is

\[
\boxed{
\mathfrak q(p,q)
=\frac1\pi\int_{\mathbb R}
L_1[\Xi](\nu)p(i\nu)\overline{q(i\nu)}\,d\nu,}
\qquad
L_1[\Xi]=\Xi'^2-\Xi\Xi''. \tag{18}
\]

This is the diagonal multiplier.  To express `v`, put

\[
g(h)={\bf1}_{(0,\infty)}(h)\,h\chi(h). \tag{19}
\]

Zero extension to the line, (8), and Plancherel yield

\[
\boxed{
v(p)=\frac1{2\pi}\int_{\mathbb R}
p(i\nu)\,2\Xi(\nu)\,
\overline{\widehat g(\nu)}\,d\nu.}
\tag{20}
\]

For `P(ν)=p(iν)`, define the algebraic functional

\[
\Lambda_d[P]=d(p)=e(p'). \tag{21}
\]

On monomials this is

\[
\Lambda_d[(i\nu)^j]=je_{j-1}, \tag{22}
\]

with generating series (10).  No `L^2` representer for `Lambda_d` in the
signed target geometry is assumed or needed.

Combining (14), (18), and (20)--(21) gives the exact spectral form

\[
\boxed{
\begin{aligned}
\mathfrak m_0(P,Q)
={}&\frac1\pi\int_{\mathbb R}
L_1[\Xi](\nu)P(\nu)\overline{Q(\nu)}\,d\nu\\
&+\ell_v[P]\,\overline{\Lambda_d[Q]}
 +\Lambda_d[P]\,\overline{\ell_v[Q]},
\end{aligned}}
\tag{23}
\]

where

\[
\ell_v[P]=\frac1{2\pi}\int_{\mathbb R}
P(\nu)2\Xi(\nu)\overline{\widehat g(\nu)}\,d\nu. \tag{24}
\]

In distributional kernel notation, (23) has the structure

\[
K_{M_0}(\nu,\mu)
=\frac1\pi L_1[\Xi](\nu)\delta(\nu-\mu)
+\ell_v\otimes\Lambda_d^*
+\Lambda_d\otimes\ell_v^*. \tag{25}
\]

The first term is diagonal in frequency.  The other two take global
functionals of `P` and `Q`, couple different frequencies, and have rank at
most two on every finite prefix.  They are not pointwise multiplication by
a scalar density.  Thus no second density `m_0(ν)` exists in the present
derivation whose pointwise sign would decide `M_0>=0`.

The one-sided qualification in (19) is essential.  The residue profile is
not a complete-line parity function:

\[
\chi(-h)=q(h)-\chi(h). \tag{26}
\]

Accordingly, replacing (20) by a full-line Fourier transform of `chi` would
drop the modular boundary term that the residue was introduced to retain.

## 4. What the inertia theorem says about possible proof routes

For a finite prefix, let

\[
R_N=v_Nd_N^*+d_Nv_N^*. \tag{27}
\]

This Hermitian rank-two form has at most one positive and at most one
negative eigenvalue.  Hence

\[
|n_-(M_{0,N})-n_-(Q_N)|\leq1. \tag{28}
\]

The independent audit combines (28) with separate even/odd polynomial
density for the continuous bridge density.  If that density is negative on
any open set, the target moment forms have arbitrarily large negative
subspaces in either parity; a fixed-rank correction cannot hide them.
Consequently

\[
\boxed{
f_{\rm bridge}\geq0
\quad\Longleftrightarrow\quad
n_-(M_{0,N})\leq1\text{ for every }N
\quad\Longleftrightarrow\quad
\sup_N n_-(M_{0,N})<\infty.}
\tag{29}
\]

The full proof, including the fixed-parity density approximation, is in
[`M0_INERTIA_EQUIVALENCE_AUDIT.md`](M0_INERTIA_EQUIVALENCE_AUDIT.md).

Therefore:

- an all-degree bound `n_-(M_0)<=1` is target-equivalent, not a weaker
  intermediate lemma;
- all-prefix `M_0>=0` implies the target sign and is therefore a stronger
  sufficient condition;
- the target sign alone yields only `n_-(M_0)<=1`.  It does not imply
  `M_0>=0` from (2).  Abstractly, `Q=0`, `v=(1,0)^T`, and `d=(0,1)^T` give
  a one-negative-direction `M_0`.  This is an algebraic non-converse, not an
  actual-theta counterexample.

## 5. A source-specific sufficient inequality, not a result

Equation (13) isolates one genuinely noncircular formulation of the stronger
route:

\[
\boxed{
\|\Psi_{p'}\|_{L^2(0,\infty)}
\leq
\|2h\,p(D)\psi+\Psi_{p'}\|_{L^2(0,\infty)}
\quad\text{for every fixed-parity polynomial }p.}
\tag{30}
\]

Equivalently,

\[
\operatorname{Re}(hF_p,\Psi_{p'})_{L^2}
\geq-\|hF_p\|_{L^2}^2. \tag{31}
\]

This is exactly all-prefix `M_0>=0`.  It is noncircular only in the sense
that it is stated directly in complete-theta/residue data, without assuming
or dividing by the Laguerre density.  It is stronger than the target,
presently unproved, and not claimed to be easier.  The indefinite
pure-residue sector shows that any attempt must retain the signed
corrected-feature/residue compensation; a separate absolute payment of the
residue drift is not justified.

## 6. Domain, pole, range, and congruence caveats

1. **Finite forms first.**  Equations (23)--(29) concern finite polynomial
   prefixes.  They do not assert that `M_0` closes to a bounded or
   self-adjoint operator on an infinite target Hilbert space.  In particular,
   continuity of the algebraic functional `Lambda_d` in a putative target
   norm is not automatic.
2. **Pre-congruence versus target LDL.**  `M_(0,N)` here is the restriction
   in raw/corrected polynomial coordinates.  An existing fixed invertible
   coefficient congruence preserves (2), rank, and inertia.  The particular
   target-LDL congruence requires its stipulated nonzero/positive old target
   block and must not be constructed across a singular prefix.
3. **Pseudoinverse range.**  Whitening by `M_0^{-1}` requires positive
   definiteness.  If `M_0` is merely semidefinite, replacing the inverse by
   `M_0^dagger` additionally requires `v,d in Ran(M_0)`.  The pure-residue
   sector explicitly fails the corresponding range condition for `d`.
   None of these assumptions enters (23) or the inertia theorem.
4. **Use the undivided Xi expression.**  Away from zeros, (18) can be
   rewritten using `Xi'/Xi`, but that logarithmic derivative has poles at
   zeros of `Xi`.  The global multiplier is the entire, undivided
   combination `Xi'^2-Xi Xi''`.  A supersymmetric factorization through
   `Xi'/Xi` has genuine domain issues and supplies no unconditional
   positivity.
5. **Keep the one-sided transform.**  Equation (20) uses the zero extension
   of `hchi` from the positive half-line.  It assumes neither full-line decay
   nor parity for `chi`, and it introduces no division by the target density.

## Source links

- [`DEFECT_FACTORIZATION.md`](DEFECT_FACTORIZATION.md), equations (13)--(17),
  for the residue EGF and exact rank-two derivative identity.
- [`SPECTRAL_DEFECT_CLOSURE.md`](SPECTRAL_DEFECT_CLOSURE.md), equations
  (3)--(5) and (15), for the Xi--Laguerre multiplier, density closure, and
  warning about `Xi'/Xi`.
- [`M0_SPATIAL_FACTORIZATION.md`](M0_SPATIAL_FACTORIZATION.md) for the
  frozen-residue physical-space factorization and factor audit.
- [`M0_INERTIA_EQUIVALENCE_AUDIT.md`](M0_INERTIA_EQUIVALENCE_AUDIT.md) for
  the all-prefix inertia theorem and fixed-parity density proof.
- [`RANK_TWO_BALANCE.md`](RANK_TWO_BALANCE.md) for the pseudoinverse range
  caveat and pure-residue normalization.
- [`ACTUAL_RESIDUE_RICCATI.md`](../../evidence/v20-v26-continuation/fisher_bridge_v4/ACTUAL_RESIDUE_RICCATI.md)
  for the actual `h`-weighted parent metric and corrected Gram.
- [`GRADED_RESIDUE.md`](../../evidence/v18-curated/graded_theta_residue_v1/GRADED_RESIDUE.md)
  for the exact residue functional and non-parity identity for `chi`.
