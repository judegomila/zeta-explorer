# Odd-resolvent Weyl reconstruction of the transverse middle solve

## 0. Claim boundary and outcome

This note uses the exact source Cauchy displacement identity to reconstruct
the constrained inversion-even resolvent from two inversion-odd resolvent
responses and a `2 by 2` scalar system.  It also identifies why the raw
low-Fourier support of the transverse observation does not by itself control
the middle short.

There are four exact conclusions.

1. On the inversion-even sector, the squared mode operator has a rank-two
   displacement with the Weil matrix.  This gives a genuine Sylvester
   identity between raw low and raw high Fourier spaces.
2. The retained middle space in the constrained complement is not a raw
   high space.  Its low projection is a scalar multiple of the projected
   comparison state.  The resulting graph term is not separated in Fourier
   index and is invisible to the raw Sylvester estimate.
3. Conditional on the two finite shifted inverses, the exact transverse
   response `Omega_h^(-1) eta_h` is reconstructed from

   \[
     (Q_- -sI)^{-1}\beta,
     \qquad
     (Q_- -sI)^{-1}D\kappa,
   \]

   and an explicit `2 by 2` scalar Weyl system.  At the actual simple-even
   ground eigenvalue, this reduces to one odd response and one exact
   projective alignment ratio.
4. An exact Cauchy-form family has zero raw low/high coupling, strict finite
   sector signs, a perfectly coercive decoupled far block, residual and Ritz
   lowering tending to zero, and nevertheless a fixed nonzero transverse
   middle response.  Thus the displacement identity and raw support alone
   do not prove the required asymptotic estimate.

The identities in Sections 1--6 apply to the actual source matrix, with all
pole, archimedean, and minus-prime contributions already combined in `Q`.
The family in Section 7 is a structural countermodel, not the arithmetic
Weil sequence and not the source-normalized prolate state.  This note proves
no shifted sign for the arithmetic matrices, no bound for the actual odd
responses, no estimate (5.5) of
`notes/THREE_SCALE_TRANSVERSE_RESOLVENT_REDUCTION.md`, no determinant limit,
and no Riemann-hypothesis conclusion.  The formal project state remains
`P0_INVALIDATED`.

The binding finite source is Connes--Consani--Moscovici, *Zeta Spectral
Triples*, arXiv:2511.22755v1, vendored as
`vendor/CCM-ZST-2511.22755v1.pdf`, SHA-256
`c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b`.
The source convention and rank-two commutator are reproduced in
`notes/SOURCE_BOUNDARY_COMMUTATOR_PROOF.md`.

## 1. Exact finite setup

Fix `lambda>1` and a finite source matrix on the modes `-N<=n<=N`.
Let

\[
 D V_n=nV_n,
 \qquad
 J V_n=V_{-n},
 \qquad
 \eta=\sum_{|n|\leq N}V_n,
 \qquad
 \beta=\sum_{|n|\leq N}b_nV_n.                 \tag{1.1}
\]

The exact Cauchy form and its source displacement identity are

\[
 Q_{nm}={b_n-b_m\over n-m}\quad(n\ne m),
 \qquad b_{-n}=-b_n,                             \tag{1.2}
\]

\[
 \boxed{
 [D,Q]=|\beta\rangle\langle\eta|
       -|\eta\rangle\langle\beta|.}             \tag{1.3}
\]

Here `[D,Q]=DQ-QD`.  All vectors and matrices needed below may be taken
real.  We use the complex Hilbert-space convention that the inner product is
antilinear in its first argument.

Let `H_+` and `H_-` be the inversion-even and inversion-odd sectors.  Fix a
unit even comparison state `kappa` and put

\[
 q=\langle\kappa,Q\kappa\rangle,
 \qquad
 \mathcal K=H_+\cap\kappa^\perp,
 \qquad
 A=P_{\mathcal K}Q|_{\mathcal K},                \tag{1.4}
\]

\[
 b=(Q-qI)\kappa\in\mathcal K.                   \tag{1.5}
\]

Let `P=P_M` be the centered raw Fourier projection onto `|n|<=M`, let

\[
 x=P\kappa\ne0,
 \qquad
 \mathcal L_M=(PH_+)\cap x^\perp,                \tag{1.6}
\]

and write `P_L=P_(mathcal L_M)`.  As proved in
`notes/THREE_SCALE_TRANSVERSE_RESOLVENT_REDUCTION.md`, the transverse
observation is exactly `P_L|_(mathcal K)`.

## 2. Squared-mode displacement and the raw Sylvester identity

The mode operator reverses inversion parity, whereas `D^2` preserves it.
This turns (1.3) into a rank-two identity internal to the even sector.

### Lemma 2.1 (even squared-mode displacement)

On `H_+`, one has

\[
 \boxed{
 [D^2,Q_+]
 =|D\beta\rangle\langle\eta|
  -|\eta\rangle\langle D\beta|.}                \tag{2.1}
\]

**Proof.**  The algebraic identity

\[
 [D^2,Q]=D[D,Q]+[D,Q]D                           \tag{2.2}
\]

and (1.3) hold on the full finite space.  If `v` is even, then `beta` and
`Dv` are odd, while `eta` and `v` are even.  Therefore

\[
 \langle\beta,v\rangle=0,
 \qquad
 \langle\eta,Dv\rangle=0.                        \tag{2.3}
\]

Substitution in (2.2), followed by self-adjointness of `D`, gives

\[
 [D^2,Q]v
 =D\beta\langle\eta,v\rangle
  -\eta\langle D\beta,v\rangle,                 \tag{2.4}
\]

which is (2.1).  \(\square\)

Let `H=I-P` on `H_+`.  Both `P` and `H` commute with `D^2`.  The raw
low-to-high block `X=PQH` consequently obeys the exact Sylvester equation

\[
 \boxed{
 D_P^2X-XD_H^2
 =|PD\beta\rangle\langle H\eta|
  -|P\eta\rangle\langle HD\beta|.}              \tag{2.5}
\]

This is the squared-node form of the source Cauchy representation.  In the
normalized parity basis

\[
 e_0^+=V_0,
 \qquad
 e_n^+={V_n+V_{-n}\over\sqrt2}\quad(n\geq1),    \tag{2.6}
\]

its off-diagonal entries are

\[
 (n^2-m^2)Q^+_{nm}=2(nb_n-mb_m)\quad(n,m>0),     \tag{2.7}
\]

and

\[
 n^2Q^+_{n0}=\sqrt2\,n b_n.                     \tag{2.8}
\]

Thus (2.5) retains the signed, cancellation-preserving source coefficients.
It controls a raw separated cross block; it is not yet an estimate for the
constrained middle short.

## 3. The exact graph term missed by raw separation

Use the low/middle/far decomposition of
`notes/THREE_SCALE_TRANSVERSE_RESOLVENT_REDUCTION.md`.  For `R>M`, let

\[
 \mathcal F_R=\mathcal K\cap P_{>R}H_+,
 \qquad
 \mathcal C_{M,R}
 =\mathcal K\ominus(\mathcal L_M\oplus\mathcal F_R).     \tag{3.1}
\]

Although `mathcal L_M` has raw low support, `mathcal C_(M,R)` is not a raw
high-Fourier space.

### Lemma 3.1 (middle graph identity)

For every `c in mathcal C_(M,R)`, there is a scalar `tau(c)` such that

\[
 Pc=\tau(c)x,
 \qquad
 \boxed{
 \tau(c)=-{\langle H\kappa,Hc\rangle\over\|x\|^2}.}     \tag{3.2}
\]

Consequently,

\[
 \boxed{
 P_LQc=\tau(c)P_LQx+P_LQHc.}                    \tag{3.3}
\]

**Proof.**  The vector `c` is orthogonal to `mathcal L_M`.  Hence its raw
low projection belongs to the orthogonal complement of `mathcal L_M` in
`PH_+`, which is the line `C*x`.  This proves the first relation in (3.2).
Since `c in mathcal K`,

\[
 0=\langle\kappa,c\rangle
  =\tau(c)\|x\|^2+\langle H\kappa,Hc\rangle,      \tag{3.4}
\]

which proves the displayed formula.  Splitting `c=Pc+Hc` proves (3.3).
\(\square\)

The second term in (3.3) is a raw separated block and is governed by (2.5).
The first term is not separated at all: it is the low scalar direction `x`
fed back through the constrained graph.  The low component of the forcing
has the parallel decomposition

\[
 P_Lb=P_LQ\kappa=P_LQx+P_LQH\kappa.              \tag{3.5}
\]

Thus the same signed row `P_LQx` occurs in both the middle coupling and the
forcing.  Cancellation may occur after multiplication by the actual middle
inverse, but neither (2.5) nor (3.2) forces it.  Far shorting changes these
rows by the explicit small terms already bounded in the three-scale note;
it does not remove the graph term.

## 4. Constrained resolvent equation

Let `s` be real and suppose that `A-sI` is invertible.  Define

\[
 z_s=(A-sI)^{-1}b,
 \qquad
 w_s=\kappa-z_s.                                  \tag{4.1}
\]

Because `z_s in mathcal K`, one has

\[
 \langle\kappa,w_s\rangle=1.                     \tag{4.2}
\]

### Lemma 4.1 (coefficient-normalized constrained equation)

There is a real scalar

\[
 d_s=q-s-\langle b,z_s\rangle                    \tag{4.3}
\]

such that

\[
 \boxed{(Q-sI)w_s=d_s\kappa.}                    \tag{4.4}
\]

**Proof.**  For every `v in mathcal K`,

\[
 \langle v,(Q-sI)z_s\rangle
 =\langle v,(A-sI)z_s\rangle
 =\langle v,b\rangle
 =\langle v,Q\kappa\rangle.                     \tag{4.5}
\]

Hence `(Q-sI)w_s` is orthogonal to `mathcal K` inside `H_+` and is therefore
a multiple of `kappa`.  Pairing with `kappa` and using (1.5) gives (4.3).
\(\square\)

Assume in addition that the odd restriction `Q_- -sI` is invertible.  Put

\[
 a_s=\langle\eta,w_s\rangle.                     \tag{4.6}
\]

Applying `D` to (4.4), using
`D(Q-sI)=(Q-sI)D+[D,Q]`, and using evenness of `w_s` gives the exact forced
odd equation

\[
 \boxed{
 (Q_- -sI)Dw_s=d_sD\kappa-a_s\beta.}             \tag{4.7}
\]

At the actual ground, (4.7) becomes the source equation
`T_-Dxi=-beta` after boundary normalization.  For general `s`, the
additional source `Dkappa` and scalar `d_s` are unavoidable.

## 5. Full odd-resolvent and scalar Weyl reconstruction

Let

\[
 R_s^-=(Q_- -sI)^{-1},
 \qquad
 u_s=R_s^-D\kappa,
 \qquad
 v_s=R_s^-\beta.                                 \tag{5.1}
\]

Define the mode pseudoinverse by

\[
 D^\dagger V_0=0,
 \qquad
 D^\dagger V_n={1\over n}V_n\quad(n\ne0).        \tag{5.2}
\]

It maps the odd sector into the even sector.  Introduce the two explicitly
boundary-normalized even vectors

\[
 \boxed{
 \Phi_s=
  \left(1+\langle\eta,D^\dagger v_s\rangle\right)V_0
  -D^\dagger v_s,}                                \tag{5.3}
\]

\[
 \boxed{
 \Psi_s=D^\dagger u_s
  -\langle\eta,D^\dagger u_s\rangle V_0.}         \tag{5.4}
\]

They satisfy

\[
 \langle\eta,\Phi_s\rangle=1,
 \qquad
 \langle\eta,\Psi_s\rangle=0,                  \tag{5.5}
\]

\[
 D\Phi_s=-v_s,
 \qquad
 D\Psi_s=u_s.                                    \tag{5.6}
\]

### Lemma 5.1 (scalar residuals)

There are real scalars

\[
 \alpha_s=\langle V_0,(Q-sI)\Phi_s\rangle,
 \qquad
 \gamma_s=
 \langle V_0,(Q-sI)\Psi_s-\kappa\rangle         \tag{5.7}
\]

such that

\[
 \boxed{(Q-sI)\Phi_s=\alpha_sV_0,}               \tag{5.8}
\]

\[
 \boxed{(Q-sI)\Psi_s-\kappa=\gamma_sV_0.}       \tag{5.9}
\]

**Proof.**  From (5.1) and (5.6),

\[
 (Q_- -sI)D\Phi_s=-\beta,
 \qquad
 (Q_- -sI)D\Psi_s=D\kappa.                      \tag{5.10}
\]

For any even `f`, (1.3) gives

\[
 [D,Q]f=\beta\langle\eta,f\rangle.               \tag{5.11}
\]

Equations (5.5), (5.10), and (5.11) show respectively that

\[
 D((Q-sI)\Phi_s)=0,
 \qquad
 D((Q-sI)\Psi_s-\kappa)=0.                       \tag{5.12}
\]

The kernel of `D` is the line `C*V_0`, proving (5.8)--(5.9).  \(\square\)

Put

\[
 p_s=\langle\kappa,\Phi_s\rangle,
 \qquad
 r_s=\langle\kappa,\Psi_s\rangle,               \tag{5.13}
\]

and define

\[
 \mathfrak D_s=p_s\gamma_s-r_s\alpha_s.          \tag{5.14}
\]

### Theorem 5.2 (odd-resolvent Weyl reconstruction)

If both `A-sI` and `Q_- -sI` are invertible, then

\[
 \boxed{\mathfrak D_s\ne0,}                       \tag{5.15}
\]

and the constrained solution (4.1) is

\[
 \boxed{
 w_s=a_s\Phi_s+d_s\Psi_s,}                       \tag{5.16}
\]

where

\[
 \boxed{
 \begin{bmatrix}
  p_s&r_s\\
  \alpha_s&\gamma_s
 \end{bmatrix}
 \begin{bmatrix}a_s\\d_s\end{bmatrix}
 =\begin{bmatrix}1\\0\end{bmatrix}.}            \tag{5.17}
\]

Equivalently,

\[
 a_s={\gamma_s\over\mathfrak D_s},
 \qquad
 d_s=-{\alpha_s\over\mathfrak D_s}.             \tag{5.18}
\]

**Proof.**  Equation (4.7) and invertibility of the odd block give

\[
 Dw_s=d_su_s-a_sv_s.                              \tag{5.19}
\]

The definitions (5.3)--(5.6), together with
`<eta,w_s>=a_s`, reconstruct the missing zero mode and prove (5.16).
Condition (4.2) supplies the first row of (5.17), while (5.8)--(5.9) and
(4.4) supply its second row.

It remains to prove that the scalar system is nonsingular.  Suppose a
homogeneous pair `(a,d)` satisfied both rows, and put
`w=a Phi_s+d Psi_s`.  Equations (5.8)--(5.9) give

\[
 (Q-sI)w=d\kappa,                                 \tag{5.20}
\]

while the first homogeneous row says `w in mathcal K`.  Projecting (5.20)
onto `mathcal K` gives `(A-sI)w=0`.  Thus `w=0`.  Equation (5.20) then gives
`d=0`; finally (5.5) gives `a=<eta,w>=0`.  The homogeneous kernel is trivial,
so (5.15) follows.  \(\square\)

Suppose now that the hypotheses of the three-scale reduction hold at
`s=U-h`.  Its exact middle elimination gives

\[
 \Omega_h^{-1}\eta_h=P_Lz_s.                     \tag{5.21}
\]

Because `P_Lkappa=0`, Theorem 5.2 yields the cancellation-preserving formula

\[
 \boxed{
 \Omega_h^{-1}\eta_h
 =-a_sP_L\Phi_s-d_sP_L\Psi_s
 ={\alpha_sP_L\Psi_s-\gamma_sP_L\Phi_s
    \over\mathfrak D_s}.}                        \tag{5.22}
\]

No triangle inequality or absolute block decomposition has been used in
(5.22).  The even middle inverse has been replaced exactly by two actual odd
resolvent responses and a scalar Weyl determinant.  This is a reduction, not
a bound: any of the two response vectors or the denominator
`mathfrak D_s` may still be badly conditioned.

## 6. Ground specialization and the exact alignment ratio

Let `mu` be a simple lowest eigenvalue of `Q`, assume its eigenvector is
even, and assume `A-mu I` is positive.  Then the ground line is not
orthogonal to `kappa`, the odd block

\[
 T_-=Q_- -\mu I                                  \tag{6.1}
\]

is positive, and the preceding construction applies at `s=mu`.  Equation
(4.4) has `d_mu=0`.  Moreover

\[
 \boxed{
 \Phi_\mu=
 \left(1+\langle\eta,D^\dagger T_-^{-1}\beta\rangle\right)V_0
 -D^\dagger T_-^{-1}\beta}                       \tag{6.2}
\]

is exactly the ground eigenvector normalized by
`<eta,Phi_mu>=1`.

Indeed, the source commutator gives

\[
 D\Phi_\mu=-T_-^{-1}\beta.                       \tag{6.3}
\]

This agrees with the nonzero-mode coefficients of the boundary-normalized
ground vector, and (5.5) fixes the remaining zero coefficient.  Therefore
`alpha_mu=0`, `p_mu=<kappa,Phi_mu>!=0`, and

\[
 w_\mu={\Phi_\mu\over\langle\kappa,\Phi_\mu\rangle}.     \tag{6.4}
\]

If `mu<=U`, then `h_mu=U-mu>=0` is included in the supremum of the
three-scale target.  At that point,

\[
 \boxed{
 \Omega_{h_\mu}^{-1}\eta_{h_\mu}
 =-{P_L\Phi_\mu\over\langle\kappa,\Phi_\mu\rangle}.}    \tag{6.5}
\]

Consequently, the proposed estimate

\[
 \sup_{h\geq0}\|\Omega_h^{-1}\eta_h\|
 =\lambda^{-1/2+o(1)}                             \tag{6.6}
\]

would in particular require the actual source-reconstructible alignment
estimate

\[
 \boxed{
 {\|P_L\Phi_\mu\|
  \over|\langle\kappa,\Phi_\mu\rangle|}
 \leq\lambda^{-1/2+o(1)}.}                        \tag{6.7}
\]

Controlling the full supremum additionally requires uniform estimates for
`Phi_s`, `Psi_s`, and `mathfrak D_s` throughout `s<=U`.  Formula (6.2)
connects this ground obstruction directly to the same shifted odd response
that appears in `notes/PAIRED_TRACE_ODD_RESOLVENT_GATE.md`.  Positivity and
source boundary nonvanishing alone do not give (6.7).

## 7. Exact Cauchy-form countermodel

The graph term in Section 3 is a genuine logical obstruction, even when the
raw Sylvester coupling vanishes identically.  Fix integers

\[
 M\geq1,
 \qquad R\geq M+1,
 \qquad N>R,                                      \tag{7.1}
\]

a real shift `U`, and constants `0<epsilon<G`.  Use the parity basis
`V_0,e_1^+,...,e_N^+` and `e_1^-,...,e_N^-`.  Choose the Cauchy coefficients

\[
 b_n^{\rm C}=0\quad(|n|\leq N)                    \tag{7.2}
\]

and the even diagonal sequence

\[
 a_0=U,
 \qquad
 a_{\pm1}=a_{\pm(M+1)}=U+\epsilon,               \tag{7.3}
\]

\[
 a_{\pm n}=U+G
 \quad\hbox{for every other }1\leq n\leq N.      \tag{7.4}
\]

Equations (1.2) make `Q` diagonal in the raw Fourier basis.  It is real
Hermitian, commutes with inversion, has exact Cauchy form, and satisfies the
source commutator with `beta=0`.  Its unique lowest eigenvalue is `U`, with
even ground vector `V_0` and

\[
 \langle\eta,V_0\rangle=1.                       \tag{7.5}
\]

Take

\[
 \kappa={V_0+e_1^++e_{M+1}^+\over\sqrt3}.        \tag{7.6}
\]

Then

\[
 q-U={2\epsilon\over3},
 \qquad
 \|(Q-qI)\kappa\|={\sqrt2\over3}\epsilon.       \tag{7.7}
\]

Both quantities tend to zero with `epsilon`.  The odd shifted block has
floor `epsilon`.  The compression `A-U I` on `mathcal K` is positive: on the
only nontrivial two-dimensional part below it has eigenvalues
`epsilon/3` and `epsilon`, while all remaining directions have value `G`.
The far block on `mathcal F_R` is exactly `G I` and every far coupling
vanishes.

The projected low state and one transverse low vector are

\[
 x={V_0+e_1^+\over\sqrt3},
 \qquad
 \ell={V_0-e_1^+\over\sqrt2}.                    \tag{7.8}
\]

The corresponding constrained middle graph vector is

\[
 c={V_0+e_1^+-2e_{M+1}^+\over\sqrt6}.            \tag{7.9}
\]

All other low and middle directions decouple from the forcing.  At `s=U`,
or equivalently `h=0`, the exact block and forcing coefficients on
`span{ell,c}` are

\[
 L={\epsilon\over2},
 \qquad
 E=-{\epsilon\over\sqrt{12}},
 \qquad
 C={5\epsilon\over6},                            \tag{7.10}
\]

\[
 f_L=-{\epsilon\over\sqrt6},
 \qquad
 f_C=-{\epsilon\over\sqrt{18}}.                 \tag{7.11}
\]

The exact middle short is therefore

\[
 \Omega_0=L-E^*C^{-1}E
 ={2\epsilon\over5},                             \tag{7.12}
\]

while its effective forcing is

\[
 \eta_0=f_L-E^*C^{-1}f_C
 =-{6\epsilon\over5\sqrt6}.                     \tag{7.13}
\]

Consequently,

\[
 \boxed{
 \Omega_0^{-1}\eta_0
 =-{3\over\sqrt6}\,\ell
 =-\sqrt{3\over2}\,\ell,}                       \tag{7.14}
\]

and

\[
 \|\Omega_0^{-1}\eta_0\|=\sqrt{3\over2}         \tag{7.15}
\]

for every `epsilon>0`.

In this model `D beta=0`, so both sides of the raw Sylvester equation (2.5)
and the complete raw low/high block vanish.  Nevertheless, the vector `c`
has a nonzero low graph component proportional to `x`, and this alone
produces the coupling in (7.10).  The exact ground specialization gives the
same result directly: `Phi_U=V_0`,
`<kappa,Phi_U>=1/sqrt3`, and

\[
 -{P_L\Phi_U\over\langle\kappa,\Phi_U\rangle}
 =-\sqrt{3\over2}\,\ell.                         \tag{7.16}
\]

The zero value of `beta` is not essential to the logical obstruction.  For
any fixed finite index set, add `t` times a nonzero odd Cauchy sequence to
(7.2), retain (7.3)--(7.4), and form all off-diagonal entries by (1.2).
Finite-dimensional continuity shows that, for sufficiently small nonzero
`t=o(epsilon)`, the simple-even ground, both strict shifted signs, the far
floor, and a transverse response bounded away from zero all persist.  On a
growing family one may choose `t` smaller than `epsilon` divided by the norm
of that finite Cauchy perturbation.  This observation does not identify the
perturbed sequence with the arithmetic source.

## 8. Exact remaining input

The squared-mode displacement does expose all raw separated coupling, but
the constrained problem also contains the scalar graph direction (3.3).
The odd reconstruction packages that direction without discarding its
cancellation.  A successful arithmetic proof along this route must now
establish, for the actual pole--archimedean--minus-prime matrix and actual
source-normalized prolate state, either

1. uniform estimates for the two odd responses in (5.1) and a lower bound
   for the scalar Weyl determinant (5.14) throughout `s<=U`; or
2. an equivalent direct estimate for (5.22), including the ground alignment
   ratio (6.7).

The countermodel proves that no argument using only exact Cauchy
displacement, inversion symmetry, boundary nonvanishing, raw low support,
far coercivity, and small residual or Ritz lowering can supply those bounds.
Additional phase-sensitive information about the actual arithmetic
coefficients and their interaction with `kappa` is necessary.
