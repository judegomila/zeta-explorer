# Lower-Ritz dangerous-response arithmetic Krein RH-gate theorem

## 0. Exact outcome and claim boundary

Use the locked schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 L=2\log\lambda,\qquad N=2^{9600\lambda^2}.          \tag{0.1}
\]

Write the complete inversion-even source block as

\[
 Q_+=\begin{pmatrix}q&b^*\\b&A\end{pmatrix}
 \quad\hbox{on}\quad {\mathbb C}\kappa\oplus\mathcal K,
 \qquad \|\kappa\|=1,                              \tag{0.2}
\]

and let `u` be the genuine lower two-vector Ritz value.  Put

\[
 t=q-u>0,\qquad B_u=A-uI.                            \tag{0.3}
\]

This theorem is conditional on the two still-unproved strict sector signs

\[
 \boxed{B_u\succ0,\qquad Q_--uI\succ0.}             \tag{0.4}
\]

They make the actual ground value `mu` simple, global, and inversion even.
Put

\[
 h=u-\mu\geq0,\qquad B_\mu=A-\mu I=B_u+hI,
 \qquad y=B_\mu^{-1}b.                              \tag{0.5}
\]

Let

\[
 p_{\lambda,N}=P_Nk_\lambda^+
   =\alpha_{\lambda,N}\kappa,\qquad
 f_{\lambda,N}=\alpha_{\lambda,N}(\kappa-y)        \tag{0.6}
\]

be respectively the exact source-normalized projected anchor and the
coefficient-normalized actual ground representative.  If `g_z` is the
anchor-removed Mellin Riesz vector, define the complete ground response

\[
 \mathfrak R_\lambda(z)=g_z^*B_\mu^{-1}b.           \tag{0.7}
\]

The first conclusion is the exact transform identity

\[
 \boxed{
 \widehat p_{\lambda,N}(z)-\widehat f_{\lambda,N}(z)
 =\alpha_{\lambda,N}\mathfrak R_\lambda(z).}        \tag{0.8}
\]

At the actual ground ridge, the strict ground-ridge theorem gives

\[
 \alpha_{\lambda,N}\sup_{z\in\Omega}
 \left|\mathfrak R_\lambda(z)-
 \widetilde a_{z,h}^*S_{\rho,h}^{-1}d_h\right|
 \longrightarrow0                                  \tag{0.9}
\]

on every fixed compact `Omega` in `|Im z|<1/2`.  Consequently the sole
remaining dangerous-row target is asymptotically equivalent to actual
ground-transform alignment:

\[
\boxed{
 \alpha_{\lambda,N}\sup_{z\in\Omega}
 \left|\widetilde a_{z,h}^*S_{\rho,h}^{-1}d_h\right|
 \longrightarrow0
 \quad\Longleftrightarrow\quad
 \sup_{z\in\Omega}
 |\widehat f_{\lambda,N}(z)-\widehat p_{\lambda,N}(z)|
 \longrightarrow0.}                                \tag{0.10}
\]

This is an equivalence after the already proved far and captured response
limits, not a new Cauchy--Schwarz sufficient condition.

The same response has three cancellation-preserving arithmetic forms.

1.  It is one resolvent row of the exact weighted-PNT discrepancy operator.
2.  It is the solution row of the full boundary-gauged multiplier equation,
    with every prime power through `n<=lambda^2` still present.
3.  It is the Mellin observation of the solution to an unconditional
    centered-zero Krein interpolation system.

These forms are derived below.  They isolate the first missing arithmetic
lemma without replacing it by rank, floor, phase-volume, or absolute-prime
bounds.

There is an exact RH-strength consequence.  If (0.4) and the left side of
(0.10) hold eventually on one unbounded locked schedule for every compact
`Omega` in the open strip, then

\[
 4\widehat f_{\lambda,N}\longrightarrow\Xi
 \quad\hbox{locally uniformly on }|\operatorname {Im}z|<\tfrac12. \tag{0.11}
\]

Every finite transform on the left has only real zeros by the source
determinant theorem.  The real-rooted limit lemma therefore gives RH.  In
particular, under `not RH`, either a strict sign in (0.4) fails infinitely
often or the dangerous response fails to vanish on at least one compact
strip set.

This theorem does not prove (0.4), (0.10), a determinant limit, a zero
statement, RH, or a de Bruijn--Newman `Lambda` bound.  It proves no converse
from RH to either finite gate.  The formal state remains `P0_INVALIDATED`,
and the standard eight are unchanged.

## 1. Frozen inputs

Only the following repository bytes are imported.

| Dependency | SHA-256 |
|---|---|
| `notes/LOWER_RITZ_GROUND_RIDGE_FORCING_ADAPTED_DANGEROUS_RESPONSE_BARRIER.md` | `acb5f56fb97e1ad54b95328beb555effa0e89b1569540915728b5b6959a2d122` |
| `tests/test_lower_ritz_ground_ridge_forcing_adapted_dangerous_response_barrier.py` | `b8f4f76a801bfc989086dd08d41c96006d05e7a9806635bd6a0df2bc05647049` |
| `notes/LOWER_RITZ_RESIDUAL_INVERSE_SPREAD_DETERMINANT_SPLIT_THEOREM.md` | `0e905dbb849d1a7cbf9a8906831d9c192c75bd953c10bf13329ea94dcee788a3` |
| `tests/test_lower_ritz_residual_inverse_spread_determinant_split_theorem.py` | `8cc310388b33f6ee075060f56c3b084867c68f66cae8aee64567ab9cab11e36b` |
| `notes/WEIGHTED_PNT_DISCREPANCY_NORMAL_FORM.md` | `eda566d5a2867d28f5218a89a48cc95c30fe74491fb11bb74b86c7fb6ed68ac6` |
| `tests/test_pnt_discrepancy_normal_form.py` | `9cf8bd06ee9e26ebdb3c56b878b1f3ba3ed54156a65f5110b7d353c017ba9c52` |
| `notes/GROWING_ACTUAL_SYMBOL_BOUNDARY_GAUGE_PHASE_ANGLE_BARRIER.md` | `de8a95d46fdaf393208124b7813637333c1e309e457473f893c3fd51b66138b1` |
| `tests/test_growing_actual_symbol_boundary_gauge_phase_angle_barrier.py` | `6307665100baacf47aeab2d2fa023287eb7f61efa52504095ba8b69f99bd5878` |
| `notes/GROWING_SIGNED_DISCREPANCY_CENTERED_ZERO_KREIN_FACTORIZATION_BARRIER.md` | `0257bb5582700fada40fc2a6c6ba578a09fad94e11eb4fa0f72a525c80bd04c9` |
| `tests/test_growing_signed_discrepancy_centered_zero_krein_factorization_barrier.py` | `b34f647f320e2e19b614ced03959d152895f6d91a864e4717e43accc7546f533` |
| `DIRECT_RH_ATTACK.md` | `b8c5eb77013f00d9a48aa24c244c4a1d1d86957eab041e28282927d7d55c0fa2` |

The first pair supplies the actual-ridge three-level response split and the
proved negligibility of the far and captured observations.  The second pair
fixes the source normalization and coefficient-normalized ground.  The next
three pairs fix, respectively, the complete weighted-PNT discrepancy, the
boundary gauge of the actual multiplier, and the centered-zero Krein
factorization.  The final file fixes the real-rooted determinant theorem,
the projected-anchor limit, and the real-rooted limit lemma.

No zero table, RH premise, zero simplicity assumption, unsigned prime
replacement, or stored ground eigenvector is used.

## 2. Exact ground-transform and dangerous-row equivalence

The lower Ritz value is a variational upper bound for the lowest even
eigenvalue.  Under the first sign in (0.4), interlacing leaves at most one
even eigenvalue below `u`; under the second sign, no odd eigenvalue lies
there.  Thus `mu<=u` is the unique simple global ground value.

The complementary equation for an anchor-coefficient-one ground vector is

\[
 (A-\mu I)y=b,\qquad
 \binom{1}{-y}\text{ is a }\mu\text{-eigenvector}.  \tag{2.1}
\]

Multiplying by the source scale gives (0.6).  Because `y` belongs to
`mathcal K`, removing the anchor from the Mellin Riesz vector changes no
pairing:

\[
 \widehat y(z)=\langle g_z,y\rangle
 =g_z^*B_\mu^{-1}b.                                \tag{2.2}
\]

Equations (0.6) and (2.2) prove (0.8).

The ridge-specific far and captured factorizations give the exact finite
identity

\[
\begin{aligned}
 \mathfrak R_\lambda(z)
 ={}&g_{F,z}^*H_{F,h}^{-1}b_F
   +a_{C,z,h}^*P_h^{-1}c_h\\
 &+\widetilde a_{z,h}^*S_{\rho,h}^{-1}d_h.
\end{aligned}                                      \tag{2.3}
\]

For every fixed compact `Omega` with
`max_(z in Omega)|Im z|<1/2`, the first two terms satisfy

\[
 \alpha_{\lambda,N}\sup_{z\in\Omega}
 \left|g_{F,z}^*H_{F,h}^{-1}b_F
       +a_{C,z,h}^*P_h^{-1}c_h\right|
 \longrightarrow0.                                 \tag{2.4}
\]

Taking suprema in (2.3), using the two triangle inequalities in opposite
directions, and applying (0.8) proves (0.9)--(0.10).  No observation
leverage is estimated in this argument.

## 3. Exact weighted-PNT discrepancy resolvent

Define the weighted discrepancy on `[0,L]` by

\[
 D_\lambda(s)=
 \sum_{1<n\leq e^s}{\Lambda(n)\over\sqrt n}
       -2(e^{s/2}-1),                               \tag{3.1}
\]

and the reflected translation operator

\[
 T_D=\int_{[0,L]}K_s\,dD_\lambda(s).                \tag{3.2}
\]

The endpoint in (3.1) is inclusive.  Let `A_tail` be the complete
Archimedean tail Dirichlet operator and put

\[
 c_*=4-\gamma-{\pi\over2}-3\log2-\log\pi,
 \qquad H_\lambda=A_{\rm tail}-T_D.                 \tag{3.3}
\]

The exact pole--main--Archimedean cancellation theorem is

\[
 \boxed{Q_\lambda=c_*I+H_\lambda.}                 \tag{3.4}
\]

Let `P_K` be the orthogonal projector onto `mathcal K`.  Since
`P_K kappa=0`, the scalar in (3.4) disappears from the forcing but not from
the inverse:

\[
 \boxed{
 B_\mu=P_K\{(c_*-\mu)I+H_\lambda\}P_K,
 \qquad b=P_KH_\lambda\kappa.}                    \tag{3.5}
\]

Therefore the complete response is exactly

\[
\boxed{
 \mathfrak R_\lambda(z)=
 \left\langle g_z,
 \left[P_K\{(c_*-\mu)I+A_{\rm tail}-T_D\}P_K\right]^{-1}
 P_K(A_{\rm tail}-T_D)\kappa\right\rangle.}       \tag{3.6}
\]

Equation (3.6) is the first missing arithmetic row in a
cancellation-preserving normal form.  It keeps the signed Stieltjes measure
`dD_lambda` inside both the forcing and the inverse.  Estimating `T_D` or
its prime atoms separately before inversion would be a different and
strictly coarser problem.

For later comparison, finite-dimensional Cramer's rule gives the exact
mixed-minor identity

\[
 \boxed{
 \mathfrak R_\lambda(z)
 ={g_z^*\operatorname {adj}(B_\mu)b\over\det B_\mu}
 =-{\det\begin{pmatrix}0&g_z^*\\b&B_\mu\end{pmatrix}
       \over\det B_\mu}.}                           \tag{3.7}
\]

Thus the task is a signed mixed-minor cancellation relative to the actual
complement determinant.  A lower bound for `det B_mu`, a rank estimate, or
an upper bound for the two rows separately does not give that cancellation.

## 4. Full actual-symbol boundary-gauge equation

The complete multiplier is

\[
 m_\lambda(\tau)=
 \operatorname {Re}\psi\!\left({1\over4}+{i\tau\over2}\right)
 -\log\pi
 -2\sum_{1<n\leq\lambda^2}{\Lambda(n)\over\sqrt n}
                  \cos(\tau\log n).                \tag{4.1}
\]

Zero-extension compression annihilates the critical boundary character,
so the full actual-symbol gauge

\[
 r_\lambda(\tau)=m_\lambda(\tau)+4\lambda\cos(L\tau) \tag{4.2}
\]

has exactly the same compressed operator.  For parity
`epsilon in {+1,-1}` and finite source vectors `v,w` in that parity,
polarization of the boundary-gauge identity gives

\[
\boxed{
\begin{aligned}
 \langle v,(Q_{\lambda,\epsilon}-\mu I)w\rangle
 ={}&\int_{\mathbb R}r_\lambda(\tau)
       \overline{\widehat v(\tau)}\widehat w(\tau)
                         {d\tau\over2\pi}\\
 &+2\epsilon\,
   \overline{\langle p_\epsilon,v\rangle}
             \langle p_\epsilon,w\rangle
   -\mu\langle v,w\rangle.
\end{aligned}}                                      \tag{4.3}
\]

Here `p_+(x)=cosh(x/2)` and `p_-(x)=sinh(x/2)`.  Applying (4.3) to the
equation `B_mu y=b` gives, for every `v in mathcal K`,

\[
\boxed{
\begin{aligned}
 &\int_{\mathbb R}r_\lambda(\tau)
       \overline{\widehat v(\tau)}\widehat y(\tau)
                         {d\tau\over2\pi}
 +2\overline{\langle p_+,v\rangle}\langle p_+,y\rangle
 -\mu\langle v,y\rangle\\
 &\qquad=
 \int_{\mathbb R}r_\lambda(\tau)
       \overline{\widehat v(\tau)}\widehat\kappa(\tau)
                         {d\tau\over2\pi}
 +2\overline{\langle p_+,v\rangle}
             \langle p_+,\kappa\rangle.
\end{aligned}}                                      \tag{4.4}
\]

This is the full-symbol equation whose solution is observed in (0.7).
The local PNT cancellation `r_lambda(z/L)=o(lambda)` does not estimate its
global inverse.  The boundary character in (4.2) is an exact gauge and
cannot supply a reserve after compression.

## 5. Unconditional centered-zero Krein interpolation

Let

\[
 \Xi_c(s)=\xi(1/2+s),\qquad
 A_v(\zeta)=\int_{I_L}v(x)e^{-\zeta x}\,dx,         \tag{5.1}
\]

and let `mathfrak p` run through the centered nontrivial-zero multiset
modulo `zeta mapsto -zeta`, with multiplicity.  The exact complete form is

\[
\boxed{
 \langle v,Q_{\lambda,\epsilon}w\rangle
 =2\epsilon\sum_{\mathfrak p}
 \overline{A_v(\overline\zeta_{\mathfrak p})}
 A_w(\zeta_{\mathfrak p}).}                        \tag{5.2}
\]

The series is absolutely convergent for the finite Fourier vectors here.
Equation (5.2) is unconditional.  An off-axis quartet contributes a Krein
block of signature `(1,1)`; it is not replaced by a positive zero-sampling
Gram.

Substituting `B_mu y=b` into (5.2) gives the exact centered-zero resolvent
system

\[
\boxed{
 2\sum_{\mathfrak p}
 \overline{A_v(\overline\zeta_{\mathfrak p})}
 A_y(\zeta_{\mathfrak p})
 -\mu\langle v,y\rangle
 =2\sum_{\mathfrak p}
 \overline{A_v(\overline\zeta_{\mathfrak p})}
 A_\kappa(\zeta_{\mathfrak p})}                    \tag{5.3}
\]

for every `v in mathcal K`.  Equivalently, `x=kappa-y` is the
anchor-coefficient-one ground vector and satisfies

\[
 \boxed{
 2\sum_{\mathfrak p}
 \overline{A_v(\overline\zeta_{\mathfrak p})}
 A_x(\zeta_{\mathfrak p})
 =\mu\langle v,x\rangle}                            \tag{5.4}
\]

for every even finite source vector `v`.  The missing row limit is exactly
the assertion that the Mellin observations of the solution
`y=kappa-x` vanish after source normalization.  Thus centered-zero
factorization turns (3.6) into a finite Krein interpolation problem, but it
does not orient or solve that problem.

## 6. The strict signs in the same three arithmetic languages

The two finite signs are not auxiliary generic matrix hypotheses.  They
are exact signed-arithmetic infima.  Define

\[
\begin{aligned}
 \beta_{+,u}
 &=\inf_{\substack{v\in\mathcal K\\\|v\|=1}}
   \{c_*-u+\langle v,A_{\rm tail}v\rangle
                 -\langle v,T_Dv\rangle\},\\
 \beta_{-,u}
 &=\inf_{\substack{w\in H_-\\\|w\|=1}}
   \{c_*-u+\langle w,A_{\rm tail}w\rangle
                 -\langle w,T_Dw\rangle\}.
\end{aligned}                                      \tag{6.1}
\]

Then

\[
 \boxed{
 B_u\succ0\ \hbox{and}\ Q_--uI\succ0
 \quad\Longleftrightarrow\quad
 \beta_{+,u}>0\ \hbox{and}\ \beta_{-,u}>0.}       \tag{6.2}
\]

Using the actual-symbol gauge, the same numbers are

\[
\begin{aligned}
 \beta_{+,u}
 &=\inf_{\substack{v\in\mathcal K\\\|v\|=1}}
 \left\{\int_{\mathbb R}r_\lambda|\widehat v|^2
             {d\tau\over2\pi}
       +2|\langle p_+,v\rangle|^2-u\right\},\\
 \beta_{-,u}
 &=\inf_{\substack{w\in H_-\\\|w\|=1}}
 \left\{\int_{\mathbb R}r_\lambda|\widehat w|^2
             {d\tau\over2\pi}
       -2|\langle p_-,w\rangle|^2-u\right\}.
\end{aligned}                                      \tag{6.3}
\]

Using centered zeros, they are

\[
\begin{aligned}
 \beta_{+,u}
 &=\inf_{\substack{v\in\mathcal K\\\|v\|=1}}
 \left\{2\sum_{\mathfrak p}
 \overline{A_v(\overline\zeta_{\mathfrak p})}
 A_v(\zeta_{\mathfrak p})-u\right\},\\
 \beta_{-,u}
 &=\inf_{\substack{w\in H_-\\\|w\|=1}}
 \left\{-2\sum_{\mathfrak p}
 \overline{A_w(\overline\zeta_{\mathfrak p})}
 A_w(\zeta_{\mathfrak p})-u\right\}.
\end{aligned}                                      \tag{6.4}
\]

Equations (6.1), (6.3), and (6.4) are identical finite quantities, not
three estimates.  They show exactly what a proof of (0.4) must orient: the
complete signed discrepancy, equivalently the full boundary-gauged symbol,
equivalently the restricted centered-zero Krein form in both parities.

## 7. Phase-volume coordinates and the invariant mixed row

At the actual ridge, the forcing-adapted dangerous space is

\[
 \mathcal D_{\rho,h}
 =\operatorname {Ran}(\mathsf G_h^*\Pi_q)
       +\operatorname {span}\{\rho_{1,h}\},         \tag{7.1}
\]

and the frozen phase-volume estimate supplies only

\[
 \dim\mathcal D_{\rho,h}
 \leq\operatorname {rank}\Pi_q+1
 \leq\exp(O(\lambda))+1.                            \tag{7.2}
\]

The adapted safe forcing vanishes exactly.  After its elimination the
remaining row is

\[
 \mathcal O_{\rho,h}(z)
 =\widetilde a_{z,h}^*S_{\rho,h}^{-1}d_h.           \tag{7.3}
\]

It too is one exact mixed-minor quotient:

\[
 \boxed{
 \mathcal O_{\rho,h}(z)
 ={\widetilde a_{z,h}^*
       \operatorname {adj}(S_{\rho,h})d_h
       \over\det S_{\rho,h}}
 =-{\det\begin{pmatrix}
       0&\widetilde a_{z,h}^*\\d_h&S_{\rho,h}
      \end{pmatrix}\over\det S_{\rho,h}}.}         \tag{7.4}
\]

The Gaussian factorizations leading from (3.7) to (7.4) preserve the
scalar response exactly and separate only the two already negligible
terms in (2.3).  Phase volume controls the order of the final determinant,
not the phase of its mixed numerator relative to its denominator.  This is
why an exponential rank bound, even with a fixed safe floor, does not prove
(0.10).

## 8. RH-strength gate and exact contrapositive

Assume along an unbounded locked schedule that:

1. both strict signs (0.4) hold eventually; and
2. for every compact `Omega` in `|Im z|<1/2`, the dangerous row in the
   left side of (0.10) tends to zero.

By (0.10),

\[
 \widehat f_{\lambda,N}-\widehat p_{\lambda,N}
 \longrightarrow0                                  \tag{8.1}
\]

locally uniformly in the strip.  The frozen projected-anchor theorem gives

\[
 4\widehat p_{\lambda,N}\longrightarrow\Xi          \tag{8.2}
\]

there.  Hence (0.11) follows.

The strict signs make `f_(lambda,N)` a nonzero multiple of the unique
simple global even ground.  The exact source commutator theorem makes its
boundary coefficient nonzero, and the source determinant theorem gives
only real zeros for `widehat f_(lambda,N)`.  Applying the real-rooted limit
lemma to (0.11) proves RH.

The logical contrapositive is the rigorous obstruction statement

\[
\boxed{
 \neg RH\ \Longrightarrow\
 \begin{cases}
 \text{at least one strict sign in (0.4) fails infinitely often,}\quad
 \text{or}\\
 \text{there is a compact }\Omega\subset\{|\operatorname {Im}z|<1/2\}
 \text{ for which}\\
 \displaystyle
 \limsup\alpha_{\lambda,N}\sup_{z\in\Omega}
 \left|\widetilde a_{z,h}^*S_{\rho,h}^{-1}d_h\right|>0.
 \end{cases}}                                      \tag{8.3}
\]

Thus the remaining row and signs form an RH-strength signed-arithmetic gate.
This does not say that RH implies either finite condition.  It says
that a proof of the conditions on the actual matrices would already be a
proof of RH, and identifies the precise cancellation-preserving objects on
which such a proof must act.

## 9. Strict stopping point

The sole response lemma can now be stated without any Feshbach coordinate:

\[
\boxed{
 \alpha_{\lambda,N}\sup_{z\in\Omega}
 \left|\left\langle g_z,
 \left[P_K\{(c_*-\mu)I+A_{\rm tail}-T_D\}P_K\right]^{-1}
 P_K(A_{\rm tail}-T_D)\kappa\right\rangle\right|
 \longrightarrow0.}                                \tag{9.1}
\]

Together with the two positive infima (6.1), equation (9.1) is the first
missing actual-arithmetic lemma.  It is equivalent to the dangerous-row
target by (0.9), and it has the multiplier and centered-zero forms
(4.4) and (5.3).  Generic rank/floor estimates are already known not to
prove it; splitting the prime and Archimedean blocks before inversion would
discard the cancellation it asks for.

No standard-eight file, source lock, replay output, or formal-status file is
changed.

## 10. Reproduction

Run

    python3 -B -m unittest \
      tests.test_lower_ritz_dangerous_response_arithmetic_krein_rh_gate_theorem -v

The regression checks all frozen hashes, exact ground-transform alignment,
the weighted-discrepancy resolvent and mixed-minor identities, the
boundary-gauge equation, centered-zero interpolation algebra, both strict
sign normal forms, the three-level response equivalence, displayed TeX,
ASCII hygiene, and the fail-closed RH-strength scope.
