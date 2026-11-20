# The H5 signed `c5` payment: exact scalarization and a wedge-loss no-go

## Scope and outcome

This note attacks equation (44) of `H5_RATIO_AVERAGE_NEXT.md` without
discarding either signed regional diagonal.  It obtains three exact results.

1. The wedge lower bound used in that equation loses an explicit square.  At
   the mass-balanced cutoff its left side is exactly the true integrated H5
   Schur pivot minus `delta_*^2 a^2`.  Thus equation (44) is strictly stronger
   than the target whenever the proved projective separation is nonzero.
2. Eliminating the old H5 block in the opposite order gives a scalar,
   source-specific decomposition.  The newest `c5` contribution remains
   assembled with the variance of the actual ratio `c4/c3`; the only
   explicitly subtracted term is one old-prefix coupling cost.
3. Ratio ordering, exact mass balance, positive regional old blocks, and even
   pointwise positivity of the bottom `[[c3,c4],[c4,c5]]` minors do not imply
   the payment.  A two-region exact countermodel satisfies all those abstract
   properties and has a negative target pivot.

The recent Planat--Sole second-level concavity theorem does not directly
control the missing `c5` term: after the campaign normalization it is a
four-jet radial inequality, while `c5` contains the independent tenth spatial
jet.  Additional Jacobi/theta identities could still be useful, but the
published concavity inequality alone does not fill this gap.

No new theta H5 certificate, all-degree sign, first Xi--Laguerre sign, or RH
claim is made.

## 1. Global H5 notation

Put

\[
 M_j=2\int_0^\infty h^2c_j(h)\,dh,
 \qquad 1\le j\le5.                               \tag{1}
\]

For the odd H5 extension the old block, border, and newest diagonal are

\[
 A=\begin{pmatrix}M_1&M_2\\M_2&M_3\end{pmatrix}>0,
 \qquad b=\binom{M_3}{M_4},
 \qquad d=M_5.                                    \tag{2}
\]

The exact target is

\[
 \boxed{\mathcal S_5=M_5-b^*A^{-1}b.}             \tag{3}
\]

All complete-theta decay and differentiations needed for (1) are already
audited.  Only the known old H3 block `A>0` is assumed here; no sign of
`mathcal S_5` is used below.

For a core--tail split write

\[
 u_C=A^{-1/2}b_C,\quad u_T=A^{-1/2}b_T,
 \quad a_C=\|u_C\|,\quad a_T=\|u_T\|,
 \quad g=u_C^*u_T.                                \tag{4}
\]

The actual theta vectors are real.  Put

\[
 \delta=1-\frac{g}{a_Ca_T},\qquad
 \Delta=a_C^2a_T^2-g^2.                          \tag{5}
\]

## 2. The exact square discarded by the wedge estimate

The exact two-region angular reserve is

\[
 \Gamma=2(a_Ca_T-g)=2\delta a_Ca_T.              \tag{6}
\]

The projective determinant bound used in the previous note replaces it by

\[
 W={\Delta\over a_Ca_T}
   =a_Ca_T-{g^2\over a_Ca_T}.                     \tag{7}
\]

There is no hidden constant in this replacement.  Direct subtraction gives

\[
 \boxed{
 \Gamma-W
 ={(a_Ca_T-g)^2\over a_Ca_T}
 =\delta^2a_Ca_T.}                               \tag{8}
\]

The optimized scalar-anchor identity is

\[
 \mathcal S_5=M_5-(a_C+a_T)^2+\Gamma.             \tag{9}
\]

Therefore the corresponding wedge-budget expression is exactly

\[
 \boxed{
 M_5-(a_C+a_T)^2+W
 =\mathcal S_5-\delta^2a_Ca_T.}                  \tag{10}
\]

At the balanced cutoff of `H5_RATIO_AVERAGE_NEXT.md`,
`a_C=a_T=a`, and the exact wedge formula there is

\[
 W=
 {m_C^2m_T^2(\overline{\mathcal R}_T-
                  \overline{\mathcal R}_C)^2
  \over \det(A)a^2}.                              \tag{11}
\]

Consequently the entire left side of its equation (44) is

\[
 \boxed{\operatorname{LHS}_{44}
       =\mathcal S_5-\delta_*^2a^2.}              \tag{12}
\]

Strict ratio ordering proves `delta_*>0`; it therefore makes (44) a strict
quantitative strengthening of H5 positivity.  This does not invalidate the
sufficient condition, but it shows that the wedge relaxation is not the place
to seek a free payment.  A sharp continuation should retain the exact inner
product `g`, rather than replace it by `Delta` alone.

## 3. Exact scalarization of the signed `c5` budget

Eliminate the second coordinate of `A` first.  Define the positive old scalar

\[
 P_0=M_1-{M_2^2\over M_3}>0.                     \tag{13}
\]

Completing the square in the exact old inverse gives

\[
 \boxed{
 b^*A^{-1}b
 ={M_4^2\over M_3}
 +{(M_3-M_2M_4/M_3)^2\over P_0}.}                \tag{14}
\]

The second term is determined entirely by the old integrated block and the
actual border.  Denote it by

\[
 E_5={ (M_3-M_2M_4/M_3)^2\over
             M_1-M_2^2/M_3}.                     \tag{15}
\]

Pointwise H3 positivity gives `c3(h)>0`.  Introduce the complete-theta
probability measure and the two actual scalar functions

\[
 d\nu(h)={2h^2c_3(h)\over M_3}\,dh,
 \qquad \mathcal R(h)={c_4(h)\over c_3(h)},       \tag{16}
\]

\[
 \mathcal P_5(h)
 ={c_5(h)\over c_3(h)}-\mathcal R(h)^2
 ={c_3(h)c_5(h)-c_4(h)^2\over c_3(h)^2}.          \tag{17}
\]

No sign of `mathcal P_5` is assumed.  From (1) and (16)--(17),

\[
 \begin{aligned}
 M_5-{M_4^2\over M_3}
 &=\int_0^\infty2h^2c_3(h)\mathcal P_5(h)\,dh\\
 &\quad+M_3\operatorname{Var}_\nu(\mathcal R).
 \end{aligned}                                    \tag{18}
\]

Combining (3), (14), and (18) yields the exact combined-vector identity

\[
 \boxed{
 \mathcal S_5=
 \int_0^\infty2h^2c_3\mathcal P_5\,dh
 +M_3\operatorname{Var}_\nu(\mathcal R)-E_5.}    \tag{19}
\]

The variance can equivalently be kept as the correlated double integral

\[
 M_3\operatorname{Var}_\nu(\mathcal R)
 ={1\over2M_3}\iint
 (2h^2c_3(h))(2k^2c_3(k))
 [\mathcal R(h)-\mathcal R(k)]^2\,dh\,dk.         \tag{20}
\]

The strict monotonicity theorem for `mathcal R=c4/c3` proves that (20) is
strictly positive.  It supplies no lower bound against `E_5`, and it gives no
sign to the first term of (19).  Equations (12) and (19) show that the precise
stronger target behind (44) is

\[
 \boxed{
 \int_0^\infty2h^2c_3\mathcal P_5\,dh
 +M_3\operatorname{Var}_\nu(\mathcal R)
 \ge E_5+\delta_*^2a^2.}                         \tag{21}
\]

This is noncircular: every term is explicit complete-theta arithmetic, and no
target sign is inserted.  It also explains exactly why estimating `c5` and the
ratio variance separately can be too lossy.  Their sum is the bottom Schur
margin; it should be bounded as one object.

## 4. An exact no-go for ratio ordering plus bottom Turan positivity

Even adding `mathcal P_5>=0` pointwise would not close (21) from abstract
geometry.  The following two-region model is exact.

Set

\[
 A=\begin{pmatrix}1/4&3/8\\3/8&1\end{pmatrix},
 \qquad A_C=A_T={A\over2}.                        \tag{22}
\]

Then `det(A)=7/64>0`.  Let

\[
 m_C=m_T={1\over2},\qquad
 \mathcal R_C=1<2=\mathcal R_T,                  \tag{23}
\]

\[
 b_C={1\over2}\binom{1}{1},\qquad
 b_T={1\over2}\binom{1}{2},                     \tag{24}
\]

and choose the newest regional diagonals at bottom-Turan equality,

\[
 d_C=m_C\mathcal R_C^2={1\over2},
 \qquad d_T=m_T\mathcal R_T^2=2.                 \tag{25}
\]

Thus both regional old blocks are positive, the ratio is strictly ordered,
and each bottom matrix

\[
 \begin{pmatrix}m_E&m_E\mathcal R_E\\
 m_E\mathcal R_E&d_E\end{pmatrix}
\]

is positive semidefinite with determinant zero.  Since

\[
 A^{-1}=\begin{pmatrix}64/7&-24/7\\-24/7&16/7\end{pmatrix},
\]

one obtains exactly

\[
 q_C=q_T={8\over7},\qquad g={6\over7},
 \qquad\delta={1\over4}.                         \tag{26}
\]

The split is perfectly mass-balanced in the global whitening.  Nevertheless,

\[
 \boxed{\mathcal S=d_C+d_T-(b_C+b_T)^*A^{-1}(b_C+b_T)
       ={5\over2}-4=-{3\over2}<0,}               \tag{27}
\]

and the wedge expression is

\[
 \boxed{\operatorname{LHS}_{44}
 ={5\over2}-{32\over7}+{1\over2}
 =-{11\over7}<0.}                                \tag{28}
\]

This model is not a theta profile and is not an H5 or RH counterexample.  It
proves a method limitation: strict `c4/c3` ordering, balance, positive old
regional metrics, and bottom `c3c5-c4^2>=0` still do not control the old-prefix
coupling `E_5`.  A successful proof of (21) must use additional quantitative
complete-theta information.

## 5. What the Planat--Sole theorem does and does not control

Planat and Sole prove strict log-concavity of the first Laguerre expression
of

\[
 s(t)=\Phi(\sqrt t),
 \qquad f(t)=s'(t)^2-s(t)s''(t)                  \tag{29}
\]

for the classical Riemann theta kernel; see
<https://arxiv.org/abs/2608.19160>.  The campaign normalization is

\[
 \psi(2r)=4\Phi(r).
\]

Putting `h=2sqrt(t)` and writing

\[
 \ell=\log\psi,\qquad X=-\ell'',\qquad
 Y=\ell^{(4)},\qquad B=\ell'+hX,                  \tag{30}
\]

gives the exact transfer

\[
 \boxed{
 f(h^2/4)
 ={\psi'(h)^2-\psi(h)\psi''(h)+\psi(h)\psi'(h)/h
   \over4h^2}
 ={2c_1(h)+\psi(h)\psi'(h)/h\over4h^2}
 ={\psi(h)^2B(h)\over4h^3}.}                     \tag{31}
\]

The proved first-level concavity gives `B>0`.  Since
`d/dt=(2/h)d/dh`, direct differentiation of (31) shows that

\[
 \boxed{
 (\log f)''(t)<0
 \quad\Longleftrightarrow\quad
 2B+{h^2Y\over B}+{h^3(X')^2\over B^2}-{6\over h}>0
 \qquad(h>0).}                                    \tag{32}
\]

This exact cone uses the spatial log jet only through order four.  By
contrast, `mathcal P_5` contains `c5`, and

\[
 c_5(h)=-{1\over512}\psi(h)\psi^{(10)}(h)
          +\text{terms using lower derivatives}.                 \tag{33}
\]

This is a genuine information separation.  Fix `h_0>0` and put

\[
 q(h)=(h^2-h_0^2)^{10}e^{-h^2},\qquad
 \psi_\lambda(h)=\psi(h)e^{\lambda q(h)}.          \tag{34}
\]

The perturbed profile is even, positive, real analytic, and Schwartz.  At
`h_0`,

\[
 q^{(j)}(h_0)=0\quad(0\le j<10),\qquad
 q^{(10)}(h_0)=10!(2h_0)^{10}e^{-h_0^2}>0.         \tag{35}
\]

Thus the Planat--Sole cone (32) and `c1,...,c4` are unchanged at `h_0`,
whereas

\[
 c_{5,\lambda}(h_0)
 =c_5(h_0)-{\psi(h_0)^2\lambda q^{(10)}(h_0)\over512}.            \tag{36}
\]

Every finite `lambda` retains the strict cone inequality on some
neighborhood of `h_0` by continuity.  Therefore the scalar concavity
inequality by itself has no formal local implication for the sign or size
required in (21).

The perturbation (34) is not asserted to preserve the theta differential
equation, modularity, or the global theorem.  The point is narrower: importing
only Planat--Sole's concluded concavity inequality cannot pay `c5`.  Their
Jacobi phase-space machinery contains additional source-specific identities;
an extension of that machinery to (21) remains a legitimate, but presently
unproved, direction.

## 6. Diagnostic scale and the next exact target

A noncertifying full-theta quadrature, using the same normalization as (1),
gives approximately

\[
 \begin{gathered}
 M_1=0.3692731,\quad M_2=12.82039,\quad
 M_3=734.8380,\\
 M_4=58871.1622,\quad M_5=6116300.1952,\\
 \mathcal S_5\simeq813221.713.
 \end{gathered}                                                   \tag{37}
\]

At the exploratory balanced cutoff `H_*=0.328708...`, it gives

\[
 a^2\simeq1.3506623\cdot10^6,\qquad
 \delta_*\simeq0.0368599,\qquad
 \delta_*^2a^2\simeq1835.08,                     \tag{38}
\]

so (12) reproduces the earlier diagnostic
`LHS_44 approximately 811386.63`.  It also finds the signed bottom-residual
integral in (19) positive, approximately `1.1657e6`.  These decimals are route
diagnostics only: they are not interval enclosures and are not used in any
claim above.

The next theorem-shaped target is (21), preferably with the exact angle rather
than the wedge relaxation.  Two possible source-specific inputs are now
sharply separated:

1. a direct lower bound for the assembled bottom Schur quantity in (18), not
   separate absolute bounds for `c5` and `c4^2/c3`;
2. a Jacobi phase-space or modular identity that compares that quantity with
   the explicit old coupling `E_5`.

Monotonicity of `c4/c3`, the second-level kernel concavity theorem, and generic
bottom-Turan positivity do not provide either comparison on their own.

## Nonclaims

- Equations (12), (19), and (21) are exact reductions, not H5 positivity
  proofs.
- The algebraic model (22)--(28) is not generated by the complete theta
  profile and does not challenge the established finite H5 theorem.
- The diagnostics (37)--(38) are not certificates.
- No finite-order result here is extrapolated to the all-degree ladder or RH.
