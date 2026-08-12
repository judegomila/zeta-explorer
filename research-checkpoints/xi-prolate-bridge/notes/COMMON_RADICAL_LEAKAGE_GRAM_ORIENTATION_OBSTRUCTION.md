# Common radical-leakage Gram and the Ritz/odd orientation obstruction

## 0. Scope and exact outcome

This note puts two finite objects into one exact leakage calculus:

1. the even Krylov--Ritz moment pencil at a source-derived upper shift `U`;
2. the complete live odd endpoint Schur matrix at that same `U`.

The arbitrary-vector even and odd Möbius lifts give a linear global
two-sided radical lift of every finite Fourier vector.  Consequently both
objects are compressions of the same kind of paired exterior-leakage Gram.
The paired Gram has an **absolute** positive part and a separate
aligned-versus-anti-aligned slot orientation.  The signed Weil matrix keeps
their difference; absolute sampling keeps only their sum.

This gives one sharp finite criterion.  If `A_-` is the positive absolute
leakage Gram on the odd endpoint chart and `E_-=A_--S_-` is its orientation
defect, then

\[
 Q_--UI\succ0
 \quad\Longleftrightarrow\quad
 A_--UI\succ0,
 \qquad
 \left\|(A_--UI)^{-1/2}E_-(A_--UI)^{-1/2}\right\|<1.       \tag{0.1}
\]

Thus (0.1) is a source-specific sufficient and necessary inequality which
would close `U<mu_-` without assuming global Weil positivity.  It is not
currently proved for the arithmetic matrices.

There are also two exact obstructions.

* At `U=U_m`, the lowest value of the even Ritz pencil, the analogous
  positive-base orientation quotient is either unavailable because its base
  is singular or is saturated at exactly one.  A strict contraction cannot
  hold on one common space containing the Ritz null direction.
* An exact `N=2` source-Cauchy pair below has the same two-vector even Ritz
  moment pencil, the same `U`, the same source commutator data, the same
  positive absolute Gram on every finite vector, positive even-complement
  margins, and positive odd transverse blocks.  The live odd Schur short is
  positive in one member and negative in the other.  Hence the positive
  absolute Gram, the Cauchy commutator, and this finite Ritz data do not
  determine the required orientation.

The pair is a logical finite model, not an arithmetic Weil matrix.  It does
not rule out an estimate using the actual prime locations or the actual
paired Fourier evaluations.  No nontrivial zero is assumed real, no zero
table is used, and no global Weil positivity is invoked.  No asymptotic
sector bound, weighted estimate in equation (5.2), determinant limit, or RH
conclusion is proved.  The formal project state remains `P0_INVALIDATED`.

All applications to the source matrix assemble the pole, archimedean, and
prime blocks first.  The prime block retains the minus sign in source
equation (3.19), every prime power `n<=lambda^2` is included, and no matrix
power is formed block by block.

## 1. Positive absolute sampling and its missing orientation

Work on the real finite parity spaces; complexification can be taken after
the identities are established.  Let `F_f(s)` denote the locked
Fourier--Mellin evaluation of a compact finite Fourier vector.  Group the
full zero multiset in its functional-equation and conjugation orbits.  The
ordinary two-slot sequence norm defines the positive real Gram

\[
 \mathfrak A(f,g)
 =\frac12\operatorname {Re}\sum_\rho
 \left(
 F_f(s_\rho)\overline{F_g(s_\rho)}
 +F_f(\overline{s_\rho})
       \overline{F_g(\overline{s_\rho})}
 \right).                                                   \tag{1.1}
\]

The factor `1/2` is only a normalization; twice (1.1) is the repository
seminorm `||.||_mathfrak Z^2`.  The signed spectral Weil pairing is

\[
 \mathfrak S(f,g)=\mathcal W_Z(f,g).                       \tag{1.2}
\]

Orbitwise symmetrization realizes (1.1)--(1.2) on the realification of the
two-slot sequence space as

\[
 \mathfrak A(f,g)=\langle Zf,Zg\rangle_{\mathbb R},
 \qquad
 \mathfrak S(f,g)=\langle Zf,\Sigma Zg\rangle_{\mathbb R}, \tag{1.3}
\]

where `Sigma=Sigma*=Sigma^(-1)` exchanges the two paired slots (or,
equivalently, is `diag(I,-I)` after the fixed aligned/anti-aligned rotation).
This is just the sequence Cauchy--Schwarz representation already used for
absolute sampling; it is not positivity of the Weil form.

Let `Pi_parallel=(I+Sigma)/2` and
`Pi_anti=(I-Sigma)/2`.  Then

\[
 \begin{aligned}
 \mathfrak A^\parallel(f,g)
   &=\langle Zf,\Pi_\parallel Zg\rangle_{\mathbb R},\\
 \mathfrak A^{\rm anti}(f,g)
   &=\langle Zf,\Pi_{\rm anti} Zg\rangle_{\mathbb R}
 \end{aligned}                                             \tag{1.4}
\]

are positive Grams and

\[
 \boxed{
 \mathfrak A=\mathfrak A^\parallel+\mathfrak A^{\rm anti},
 \qquad
 \mathfrak S=\mathfrak A^\parallel-\mathfrak A^{\rm anti}.}
                                                               \tag{1.5}
\]

Define the orientation defect

\[
 \mathfrak E:=\mathfrak A-\mathfrak S
              =2\mathfrak A^{\rm anti}\succeq0.             \tag{1.6}
\]

Absolute sampling controls `mathfrak A`; the sign in the finite Weil matrix
depends on the separate positive form `mathfrak E`.  The universal
inequality is only

\[
 -\mathfrak A\preceq\mathfrak S\preceq\mathfrak A.          \tag{1.7}
\]

No positive lower bound for `mathfrak S` follows from (1.7).

## 2. Linear radical lifts and the master leakage formula

The finite Möbius right inverse with its invisible central-hole correction
is linear in the target vector.  The constructions in
`notes/LOCKED_ROTATED_HIGH_GRAPH_SCHUR_REDUCTION.md` and
`notes/ODD_RADICAL_PARITY_SCHUR_REDUCTION.md` therefore give linear maps

\[
 \mathcal K_\epsilon:E_N^\epsilon\longrightarrow
       \text{global two-sided radical},
 \qquad \epsilon\in\{+,-\},                               \tag{2.1}
\]

with

\[
 C_\lambda\mathcal K_\epsilon v=v,
 \qquad
 \mathcal R_\epsilon v:=\mathcal K_\epsilon v-v
 =(1-C_\lambda)\mathcal K_\epsilon v.                     \tag{2.2}
\]

At both zero-evaluation slots,

\[
 Z\mathcal R_\epsilon v=-Zv.                              \tag{2.3}
\]

Thus the absolute and signed Grams are both lift-independent:

\[
 \begin{aligned}
 \mathfrak A(v,w)
   &=\mathfrak A(\mathcal R_\epsilon v,
                 \mathcal R_\epsilon w),\\
 \mathfrak S(v,w)
   &=\mathfrak S(\mathcal R_\epsilon v,
                 \mathcal R_\epsilon w).
 \end{aligned}                                             \tag{2.4}
\]

Let `V:X->E_N^epsilon` be any finite synthesis and let
`G_V=V^*V`.  Denote by `A_V,S_V,E_V` the matrices of
`mathfrak A,mathfrak S,mathfrak E` on the exterior columns
`mathcal R_epsilon V`.  Since the compact signed pairing is exactly the
source matrix pairing, (1.6) and (2.4) give the master identity

\[
 \boxed{
 V^*(Q_\epsilon-UI)V
   =S_V-UG_V
   =(A_V-UG_V)-E_V,
 \qquad E_V\succeq0.}                                    \tag{2.5}
\]

This is the common radical-leakage Gram representation.  It is valid in
both parities and for every real shift `U`.  The noncompact exterior vectors
are used only through their absolutely convergent paired evaluations; the
finite Weil distribution is not applied to them directly.

## 3. The even Ritz moment pencil saturates the orientation quotient

For a real unit comparison state `kappa`, define

\[
 V_m c=\sum_{j=0}^{m-1}c_jQ_+^j\kappa.                    \tag{3.1}
\]

The physical and signed matrices of this synthesis are exactly

\[
 G_m=(\nu_{i+j})_{i,j<m},
 \qquad
 H_m=(\nu_{i+j+1})_{i,j<m},
 \qquad
 \nu_j=\langle\kappa,Q_+^j\kappa\rangle.                \tag{3.2}
\]

Consequently (2.5) becomes

\[
 \boxed{H_m-UG_m=(A_m-UG_m)-E_m.}                        \tag{3.3}
\]

Before Krylov breakdown, the source-derived Ritz value is

\[
 U_m=\lambda_{\min}(H_m,G_m),                             \tag{3.4}
\]

so

\[
 M_m:=H_m-U_mG_m\succeq0,
 \qquad \ker M_m\ne\{0\}.                              \tag{3.5}
\]

Put `C_m=A_m-U_mG_m`.  Equations (3.3)--(3.5) give

\[
 C_m=M_m+E_m\succeq E_m\succeq0.                        \tag{3.6}
\]

If `C_m` is positive definite, then

\[
 0\preceq C_m^{-1/2}E_mC_m^{-1/2}\preceq I.             \tag{3.7}
\]

For a nonzero Ritz null vector `c`,
`c^*M_mc=0` and (3.6) gives `c^*C_mc=c^*E_mc`.  Hence the
top Rayleigh quotient in (3.7) is attained at one:

\[
 \boxed{\|C_m^{-1/2}E_mC_m^{-1/2}\|=1.}                 \tag{3.8}
\]

If `C_m` is singular, it is not a strict positive denominator in the first
place.  Therefore a single strict inequality

\[
 E\preceq\theta(A-UG),\qquad\theta<1,                    \tag{3.9}
\]

cannot hold on a common space containing the live Ritz null direction.  The
Ritz construction itself puts that direction exactly on the signed
boundary.  Any useful odd estimate must be proved after separating this
even null direction; it cannot be inherited from one strict contraction on
the union of the two column families.

## 4. The exact odd orientation criterion

Let

\[
 x=D\kappa\ne0,
 \qquad y=x/\|x\|,
 \qquad H_-=\mathbb Ry\oplus y^\perp,                    \tag{4.1}
\]

and let `V_-` be the corresponding orthonormal synthesis.  At the same
source-derived `U`, the source commutator gives

\[
 s_U=D(Q_+-UI)\kappa-(\delta\kappa)\beta
     =(Q_--UI)x.                                          \tag{4.2}
\]

Thus

\[
 V_-^*(Q_--UI)V_-
 =\begin{pmatrix}a_U&c_U^*\\c_U&B_U\end{pmatrix}         \tag{4.3}
\]

is exactly the live endpoint Schur matrix.  Applying (2.5) with
`G_(V_-)=I` gives

\[
 \boxed{
 \begin{pmatrix}a_U&c_U^*\\c_U&B_U\end{pmatrix}
 =(A_--UI)-E_-.}                                          \tag{4.4}
\]

Because `E_->=0`, the matrix in (4.4) is positive if and only if

\[
 C_-:=A_--UI\succ0,
 \qquad
 \rho_-:=\|C_-^{-1/2}E_-C_-^{-1/2}\|<1.                 \tag{4.5}
\]

Indeed, (4.4) is the congruence of `I-C_-^(-1/2)E_-C_-^(-1/2)` by
`C_-^(1/2)`.  Conversely, positivity of (4.4) implies
`C_-=(4.4)+E_->0` and then the same congruence gives `rho_-<1`.

Equations (4.3)--(4.5) are equivalent to

\[
 B_U\succ0,
 \qquad
 a_U-\langle c_U,B_U^{-1}c_U\rangle>0.                   \tag{4.6}
\]

The value of (4.5) is diagnostic precision: it says exactly which positive
statement would suffice.  The missing input is not another upper bound for
`A_-`; it is a strict bound for the anti-aligned leakage `E_-` relative to
the positive base `A_--UI`.

The locked Cauchy commutator is compatible with this representation but
does not supply that bound.  If `v_j=Q_+^j kappa`, then

\[
 Dv_{j+1}=Q_-Dv_j+\beta\,\delta(v_j),                     \tag{4.7}
\]

and, for every `j`,

\[
 (Q_--UI)Dv_j
 =D(Q_+-UI)v_j-\beta\,\delta(v_j).                       \tag{4.8}
\]

These are identities for the **difference**
`S=A-E`.  They do not identify `A` and `E` separately.  Taking absolute
values in (4.8) therefore loses precisely the slot orientation measured by
`rho_-`.

## 5. An exact source-Cauchy orientation twin

The following pair shows that the loss in Section 4 is real even when the
full finite source-Cauchy identities and the declared two-vector Ritz
identities are retained.

Take `N=2` and source parameters

\[
 a_0=14,\qquad a_1=13,\qquad b_1=-3,\qquad b_2=-1,        \tag{5.1}
\]

with `a_2` equal to

\[
 a_2^{\rm pass}=\frac{33}{4},
 \qquad
 a_2^{\rm fail}=8.                                      \tag{5.2}
\]

Use `a_(-n)=a_n`, `b_(-n)=-b_n`, and reconstruct the complete complex-mode
matrix from

\[
 Q_{nn}=a_n,
 \qquad
 Q_{nm}=\frac{b_n-b_m}{n-m}\quad(n\ne m).                \tag{5.3}
\]

Thus both matrices have the exact source commutator

\[
 [M,Q]=|\beta\rangle\langle\eta|
       -|\eta\rangle\langle\beta|,                      \tag{5.4}
\]

with the same `M,eta,beta`.  Only one diagonal source parameter changes.

In the normalized parity bases
`(e_0,e_1^+,e_2^+)` and `(e_1^-,e_2^-)`, the blocks are

\[
 Q_+^{(a_2)}=
 \begin{pmatrix}
 14&-3\sqrt2&-1/\sqrt2\\
 -3\sqrt2&10&2/3\\
 -1/\sqrt2&2/3&a_2-1/2
 \end{pmatrix},                                         \tag{5.5}
\]

\[
 Q_-^{(a_2)}=
 \begin{pmatrix}
 16&10/3\\
 10/3&a_2+1/2
 \end{pmatrix}.                                         \tag{5.6}
\]

Choose

\[
 \kappa=\frac{2\sqrt2\,e_0+3e_1^+}{\sqrt{17}}.          \tag{5.7}
\]

The coupling of (5.7) to `e_2^+` is exactly

\[
 \frac1{\sqrt{17}}
 \left(2\sqrt2\frac{-1}{\sqrt2}+3\frac23\right)=0.    \tag{5.8}
\]

Hence the two-vector Krylov space
`K_2=span(kappa,Qkappa)` is independent of `a_2` and lies in
`span(e_0,e_1^+)`.  This plane is **not** invariant.  With
`p=sqrt(17)kappa`, exact multiplication gives

\[
 p=(2\sqrt2,3,0),\qquad
 Qp=(19\sqrt2,18,0),\qquad
 Q^2p=(212\sqrt2,66,-7).                                \tag{5.9a}
\]

In particular, the `e_2^+` component of `Q^2kappa` is
`-7/sqrt(17)`.  The moments needed by the two-vector pencil are nevertheless
common:

\[
 \nu_0=1,\qquad
 \nu_1=\frac{130}{17},\qquad
 \nu_2=\frac{1046}{17},\qquad
 \nu_3=\frac{9244}{17}.                                \tag{5.9b}
\]

The next moment also happens to agree,
`nu_4=94293/17`, but the first higher moment that sees the changed diagonal
is

\[
 \nu_5^{\rm pass}=\frac{267487}{4},\qquad
 \nu_5^{\rm fail}=\frac{2273615}{34},\qquad
 \nu_5^{\rm pass}-\nu_5^{\rm fail}=\frac{49}{68}.       \tag{5.9c}
\]

Thus higher Krylov data distinguish the twins; no full-moment invariance is
being claimed.

For the two-vector moment pencil,

\[
 \det(H_2-zG_2)
 =\frac{882}{289}(z^2-24z+122),                         \tag{5.10}
\]

so both models have the same source-derived live value

\[
 \boxed{U=U_2=12-\sqrt{22}.}                            \tag{5.11}
\]

The even complementary direction inside `span(e_0,e_1^+)` is

\[
 w=\frac{-3e_0+2\sqrt2\,e_1^+}{\sqrt{17}}.              \tag{5.12}
\]

In the orthonormal basis `(w,e_2^+)`, the even complement is

\[
 A^{(a_2)}=
 \begin{pmatrix}
 278/17&\sqrt{34}/6\\
 \sqrt{34}/6&a_2-1/2
 \end{pmatrix}.                                         \tag{5.13}
\]

Writing `s=sqrt(22)`, the leading shifted entry is `74/17+s>0`.  The two
shifted determinants are

\[
 \det(A^{\rm pass}-UI)
 =\frac{23}{9}+\frac{7s}{68}>0,                          \tag{5.14}
\]

\[
 \det(A^{\rm fail}-UI)
 =\frac{449}{306}-\frac{5s}{34}>0.                       \tag{5.15}
\]

The last inequality follows, for example, from `449>45s`.  Thus

\[
 \alpha^{\rm pass}>U,
 \qquad
 \alpha^{\rm fail}>U.                                  \tag{5.16}
\]

Moreover `Dkappa=(3/sqrt(17))e_1^-`, so the endpoint direction is
`y=e_1^-` and the transverse direction is `e_2^-`.  The two live odd Schur
matrices have the common endpoint scalar and cross

\[
 a_U=4+s,
 \qquad c_U=10/3.                                       \tag{5.17}
\]

Their transverse entries are both positive:

\[
 B_U^{\rm pass}=s-\frac{13}{4}>0,
 \qquad
 B_U^{\rm fail}=s-\frac72>0.                            \tag{5.18}
\]

But their determinants, equivalently `B_U` times the Schur short, have
opposite signs:

\[
 \det(Q_-^{\rm pass}-UI)
 =-\frac{19}{9}+\frac{3s}{4}>0,                         \tag{5.19}
\]

\[
 \det(Q_-^{\rm fail}-UI)
 =-\frac{28}{9}+\frac{s}{2}<0.                          \tag{5.20}
\]

Thus the pass member satisfies `U<mu_-`; the fail member has positive
`B_U` but a negative live Schur short.

### 5.1 The same positive absolute Gram in both members

This final step makes the orientation loss exact rather than rhetorical.
The factorization constructed here is an **abstract paired-slot
realization** of the finite algebra.  It is not asserted to be the
arithmetic zero-evaluation map of either source-Cauchy matrix, nor to arise
from any zeta divisor.  Consequently the twin is a logical non-implication
model for the displayed Gram, radical, commutator, and finite Ritz premises
only.

Both complete matrices are positive definite, and `20I-Q` is positive
definite in both members.  This follows directly from strict diagonal
dominance of (5.5)--(5.6).  For example, the nontrivial first rows of the
two blocks of `20I-Q` obey

\[
 6>3\sqrt2+1/\sqrt2,qquad 4>10/3,                       \tag{5.21}
\]

and the remaining rows have still larger diagonal reserve.

Put, on the complete orthonormal parity space,

\[
 P_{a_2}=\frac{20I+Q^{(a_2)}}2,
 \qquad
 N_{a_2}=\frac{20I-Q^{(a_2)}}2.                          \tag{5.22}
\]

Both are positive definite.  The paired analysis

\[
 Z_{a_2}v=(P_{a_2}^{1/2}v,N_{a_2}^{1/2}v),
 \qquad
 \Sigma=\operatorname {diag}(I,-I),                     \tag{5.23}
\]

has

\[
 \boxed{
 Z_{a_2}^*Z_{a_2}=20I,
 \qquad
 Z_{a_2}^*\Sigma Z_{a_2}=Q^{(a_2)}.}                    \tag{5.24}
\]

The positive absolute Gram `20I` is therefore identical on **every** finite
vector in the two models, not merely on the Krylov chain.  Only its slot
orientation differs.

There is also an exact two-sided radical extension.  On a second exterior
copy of the finite space define

\[
 \widetilde Z_{a_2}(v,r)=Z_{a_2}(v-r).                    \tag{5.25}
\]

Then `K_v=(v,v)` is in the two-sided kernel,
`p_v=(v,0)`, `R_v=(0,v)`, and

\[
 K_v=p_v+R_v,
 \qquad
 \widetilde ZR_v=-\widetilde Zp_v.                       \tag{5.26}
\]

The finite, exterior, and mixed signed blocks are respectively
`Q,Q,-Q`, while their absolute counterparts are `20I,20I,-20I` in both
members.  This is precisely the algebra of the radical-leakage identity.

The pair therefore preserves all of the following simultaneously:

* exact source Cauchy form, inversion, and the same rank-two commutator;
* the same two-vector even moment pencil (indeed `nu_0,...,nu_4`) and live
  Ritz value, while `nu_5` explicitly differs;
* the even complementary comparison `alpha>U`;
* positive odd transverse `B_U`;
* the same positive absolute leakage Gram on every vector; and
* an exact two-sided radical extension.

It nevertheless gives opposite live odd Schur signs.  The missing datum is
the aligned/anti-aligned orientation `E_-`, not the size of `A_-`.

## 6. Exact remaining source theorem

The common leakage representation does produce a clean possible closure:
for the actual projected source-normalized state and one declared
source-derived `U`, prove the strict odd orientation contraction (4.5),
together with the separate even-complement comparison and the weighted
shifted solve.

What cannot work is a single strict positive-Gram contraction on a space
which still contains the Ritz null direction, or an inference from absolute
sampling, the Cauchy commutator, and the truncated two-vector even moment
data alone.  A successful proof must use additional source-specific
orientation--for example, a
cancellation-preserving estimate for the actual cumulative weighted-PNT
discrepancy or the actual paired Fourier carrier geometry.  The determinant
limit remains a separate obligation even after such an inequality is proved.
