# Capture-free actual-ground parity response theorem and barrier

## 0. Exact outcome and claim boundary

This note makes one narrow connection not stated in the prior odd-response
notes.  It starts from the checkpoint-1.25 lower-Ritz actual ground

\[
 x_\lambda=\kappa-y,
 \qquad
 (A-\mu I)y=b,                                    \tag{0.1}
\]

and identifies its invariant complete Mellin response, for every complex
frequency, directly with the boundary-normalized odd source response.  It
then connects that scalar to the checkpoint-1.25 dangerous row, without
choosing a captured space or Feshbach chart.

The exact result is

\[
 \boxed{
 \mathfrak R_\lambda(z)
 =\widehat\kappa(z)
  -{K_L(z)\mathcal A_\mu(r)\over p_\mu},
 \qquad r={zL\over2\pi}.}                         \tag{0.2}
\]

Here `mathcal A_mu` is the already known shifted odd-resolvent profile and
`p_mu` is the exact ground--anchor overlap.  The new checkpoint-1.25
consequence is that its unresolved dangerous-row decay is equivalent to
decay of the right side of (0.2), after the source scale is restored.

The parity characteristic identity isolates the first directional datum not
contained in the scalar determinant:

\[
 \boxed{
 \langle\chi_r^-,\operatorname {adj}(Q_--\mu I)\beta\rangle.}    \tag{0.3}
\]

It is a mixed odd cofactor.  The odd determinant supplies its denominator,
not its phase or cancellation.  The CCM regularized determinant also gives
an exact first-order scalar differential equation for the response, but its
coefficient is the logarithmic derivative of the unknown ground determinant
itself.  A second multiplication by the mode variable introduces the
reduced inverse of the singular even ground block and a boundary-selected
ground component.  Repetition produces the full alternating Krylov tower;
it does not give a fixed-order equation with controlled coefficients.

The odd response itself is not new.  Its imaginary-axis form is already in
`notes/PAIRED_TRACE_ODD_RESOLVENT_GATE.md`, its general Weyl reconstruction
is in `notes/ODD_RESOLVENT_WEYL_RECONSTRUCTION.md`, and its complete complex
transform profile is in `notes/CAUCHY_GROUND_RESPONSE_WINDOW_REDUCTION.md`.
The content here is the invariant checkpoint-1.25 bridge, the explicit
mixed-cofactor stopping point, and the determinant/Krylov fail-closed audit.

All statements below are conditional on the same finite simple-even ground
and shifted-sector hypotheses used at checkpoint 1.25.  Those hypotheses are
not proved here.  This note proves no response decay, no strict sector sign,
no locally uniform determinant limit, no zero statement, no Riemann
hypothesis conclusion, no converse from RH, and no de Bruijn--Newman
`Lambda` bound.  The formal state remains `P0_INVALIDATED`, and the standard
eight are unchanged.

## 1. Frozen inputs and prior-art boundary

Only the following current repository bytes are imported.

| Dependency | SHA-256 |
|---|---|
| `notes/LOWER_RITZ_DANGEROUS_RESPONSE_ARITHMETIC_KREIN_RH_GATE_THEOREM.md` | `f0fd4065d6f1bafe8c119f5fcd3efe963e0da70cfe4871d3a26338f2016e2d1e` |
| `tests/test_lower_ritz_dangerous_response_arithmetic_krein_rh_gate_theorem.py` | `c9ee7fee05841b7831f9dfd3a6d5bb0bdd3431696e9122203c34e9ee9d041773` |
| `notes/SOURCE_BOUNDARY_COMMUTATOR_PROOF.md` | `d72a5e1e11e096abc25319c1bf2c2af474d11cd766b25cf83f0b6cd00d3956f0` |
| `notes/RELATIVE_ODD_GAP_ENDPOINT_SCHUR_GATE.md` | `81bc4055b644a409c10d9d06f145040e822452dc5fc9a0fc4888c63fb535f3ab` |
| `tests/test_relative_odd_gap_endpoint_schur.py` | `cee76e8a21c3406b49bd123832a4e47bacd41ebf16622cf91c69fd48ba130127` |
| `notes/DETERMINANT_LIMIT_AUDIT.md` | `1a77a7b6e7b9573c0f9f6656481af24962280959d867177fa232e8f2cfa006b0` |
| `notes/CAUCHY_GROUND_RESPONSE_WINDOW_REDUCTION.md` | `0cbf4c438f1f06ab0d972fed3ba6d1464aef2aa9888e9dc3a6aeee548e66ee4c` |
| `tests/test_cauchy_ground_response_window_reduction.py` | `bee2696c54155e2458238aac68f75c8e6dacbba173704dafeb70d8ae4df87ffd` |
| `notes/PAIRED_TRACE_ODD_RESOLVENT_GATE.md` | `1c4568a142779f0d7cab023bfb41811d10c2ccac37a505cbe7f079b972761755` |
| `notes/ODD_RESOLVENT_WEYL_RECONSTRUCTION.md` | `eaefd8dc51bbf4427fec21b559fbe6121403c8a98e5e79ccd4866e6d1d0e9923` |
| `notes/HIGHER_DERIVATIVE_BOUNDARY_KRYLOV_NO_GO.md` | `0133e6add806d1a4abdc40a6b6d8982c73054b07f22e637f214f557c31e3f700` |
| `tests/test_higher_derivative_boundary_krylov.py` | `1b5899217518f0918a9db7c83130d48c4b2e4276adbdb51ef4858be652af020e` |

The first pair fixes the actual lower-Ritz ground response and its
asymptotic equivalence to the forcing-adapted dangerous row.  The next four
entries fix the source displacement, the parity characteristic identity,
and their exact algebra tests.  The determinant audit fixes the literal CCM
regularized-determinant phase.  The remaining entries delimit the prior
odd-profile, Weyl, and Krylov results so that none is relabelled as new.

No zero table, RH premise, zero simplicity assumption, unsigned-prime
replacement, cached arithmetic matrix, or stored eigenvector is imported.

## 2. Locked finite setup

Use the checkpoint-1.25 schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 L=2\log\lambda,\qquad N=2^{9600\lambda^2}.        \tag{2.1}
\]

The finite identities below hold for every finite `lambda,N`; the schedule
enters only in the final comparison with checkpoint 1.25.  Use the source
modes `V_n`, `-N<=n<=N`, and put

\[
 DV_n=nV_n,
 \qquad
 \eta=\sum_{|n|\leq N}V_n,
 \qquad
 \beta=\sum_{|n|\leq N}b_nV_n,                    \tag{2.2}
\]

\[
 \delta f=\langle\eta,f\rangle,
 \qquad
 \delta_N=L^{-1/2}\delta.                         \tag{2.3}
\]

The inner product is antilinear in its first entry.  The complete source
matrix is formed before any inverse or determinant and obeys

\[
 [D,Q]=|\beta\rangle\langle\eta|
       -|\eta\rangle\langle\beta|.                \tag{2.4}
\]

On the inversion-even and inversion-odd sectors this gives

\[
 \boxed{DQ_+-Q_-D=|\beta\rangle\delta.}           \tag{2.5}
\]

Use the checkpoint-1.25 block decomposition

\[
 Q_+=\begin{pmatrix}q&b^*\\b&A\end{pmatrix}
 \quad\hbox{on}\quad
 \mathbb C\kappa\oplus\mathcal K,
 \qquad \|\kappa\|=1.                            \tag{2.6}
\]

Assume, but do not assert, its two strict signs.  They make the actual
ground value `mu` simple and even and make

\[
 B_\mu=A-\mu I,
 \qquad
 O_\mu=Q_--\mu I                                  \tag{2.7}
\]

invertible, with `O_mu>0`.  Define

\[
 y=B_\mu^{-1}b,
 \qquad
 x=\kappa-y.                                      \tag{2.8}
\]

Then

\[
 Q_+x=\mu x,
 \qquad
 \langle\kappa,x\rangle=1.                       \tag{2.9}
\]

Let `g_z` denote the checkpoint-1.25 anchor-removed Mellin Riesz vector.
Because `y in mathcal K`, the invariant complete response is

\[
 \boxed{
 \mathfrak R_\lambda(z)
 =\langle g_z,y\rangle
 =\widehat y(z)
 =\widehat\kappa(z)-\widehat x(z).}               \tag{2.10}
\]

No captured projection occurs in (2.10).

## 3. Mode multiplication and the actual-ground scalarization

For a finite vector

\[
 f=\sum_{|n|\leq N}\xi_nV_n,
 \qquad
 r={zL\over2\pi},                                 \tag{3.1}
\]

source equation (5.25) is

\[
 \widehat f(z)
 ={\sqrt L\over\pi}\sin(\pi r)
   \sum_{|n|\leq N}{\xi_n\over r-n}.              \tag{3.2}
\]

Set

\[
 C_L(z)={\sqrt L\over\pi}\sin(\pi r),
 \qquad
 K_L(z)={C_L(z)\over r}
 ={2\sin(zL/2)\over z\sqrt L}.                   \tag{3.3}
\]

The elementary identity `r/(r-n)=1+n/(r-n)` gives the exact multiplication
formula

\[
 \boxed{
 r\widehat f(z)=C_L(z)\delta f+\widehat{Df}(z).}   \tag{3.4}
\]

Apply (2.5) to the ground equation (2.9).  If

\[
 d=\delta x,
 \qquad
 v_\mu=O_\mu^{-1}\beta,                            \tag{3.5}
\]

then

\[
 \boxed{
 O_\mu Dx=-d\beta,
 \qquad
 Dx=-dv_\mu.}                                     \tag{3.6}
\]

The source boundary theorem gives `d!=0`.  Therefore

\[
 \Phi_\mu={x\over d},
 \qquad
 \delta\Phi_\mu=1,
 \qquad
 D\Phi_\mu=-v_\mu.                               \tag{3.7}
\]

In the normalized odd basis define, for complex `r` away from the nonzero
integer modes,

\[
 \chi_r^-
 =\sum_{n=1}^N{\sqrt2\,n\over n^2-(\overline r)^2}e_n^-,
 \qquad
 \mathcal A_\mu(r)
 =1+\langle\chi_r^-,v_\mu\rangle.                 \tag{3.8}
\]

The conjugate in the vector coefficient is required by the antilinear-first
convention; the scalar `mathcal A_mu` is meromorphic in `r`.  Equations
(3.4) and (3.7) give the already known profile identity

\[
 \boxed{
 \widehat\Phi_\mu(z)=K_L(z)\mathcal A_\mu(r).}    \tag{3.9}
\]

Put

\[
 p_\mu=\langle\kappa,\Phi_\mu\rangle.             \tag{3.10}
\]

Equation (2.9) gives `x=Phi_mu/p_mu`, so `p_mu!=0`.

### Theorem 3.1 (capture-free actual-ground response)

Under the finite checkpoint-1.25 hypotheses, for every complex `z`,

\[
 \boxed{
 \mathfrak R_\lambda(z)
 =\widehat\kappa(z)
  -{K_L(z)\mathcal A_\mu(zL/(2\pi))\over p_\mu}.} \tag{3.11}
\]

Equivalently, before division by `r`,

\[
 \boxed{
 r\{\widehat\kappa(z)-\mathfrak R_\lambda(z)\}
 ={C_L(z)\mathcal A_\mu(r)\over p_\mu}.}         \tag{3.12}
\]

This is an identity for the complete invariant response (2.10), not for a
capture-dependent summand.

The formulas have the following mandatory analytic-continuation convention.
The Cauchy sums and `mathcal A_mu` are meromorphic with apparent poles at
the retained nonzero lattice modes.  The zeros of `sin(pi r)` in `K_L`
cancel those poles.  At `r=0`, `K_L` has its removable continuous value.
Equations (3.9), (3.11), and (3.12) always mean the resulting entire
continuations, including at every retained lattice frequency.  One may not
substitute separate zero and infinite factors there.

### Corollary 3.2 (checkpoint-1.25 dangerous-row equivalence)

Let

\[
 \mathcal O_{\rho,h}(z)
 =\widetilde a_{z,h}^*S_{\rho,h}^{-1}d_h          \tag{3.13}
\]

be the checkpoint-1.25 forcing-adapted dangerous row at the actual ground
ridge.  That theorem already proves, on every fixed compact
`Omega subset {|Im z|<1/2}`,

\[
 \alpha_{\lambda,N}\sup_{z\in\Omega}
 |\mathfrak R_\lambda(z)-\mathcal O_{\rho,h}(z)|
 \longrightarrow0.                               \tag{3.14}
\]

Combining (3.11) and (3.14) gives the capture-free equivalence

\[
\boxed{
 \alpha_{\lambda,N}\sup_{z\in\Omega}
 |\mathcal O_{\rho,h}(z)|\longrightarrow0
 \quad\Longleftrightarrow\quad
 \alpha_{\lambda,N}\sup_{z\in\Omega}
 \left|\widehat\kappa(z)
 -{K_L(z)\mathcal A_\mu(r)\over p_\mu}\right|
 \longrightarrow0.}                              \tag{3.15}
\]

Corollary 3.2 proves only an equivalence with the already unresolved scalar.
It supplies no estimate for either side.

## 4. Parity determinant and the first uncontrolled mixed cofactor

Let

\[
 T_+=Q_+-\mu I.
\]

The exact parity characteristic identity is the polynomial relation

\[
 \boxed{
 \delta\operatorname {adj}(Q_+-sI)e_0
 =\det(Q_--sI).}                                  \tag{4.1}
\]

At the simple even root `s=mu`, put

\[
 w=\operatorname {adj}(T_+)e_0.                  \tag{4.2}
\]

Both sides below lie on the ground line, and (4.1) fixes their common
boundary value:

\[
 \boxed{
 w=\det(O_\mu)\Phi_\mu.}                         \tag{4.3}
\]

Using (3.7),

\[
 \boxed{
 Dw=-\operatorname {adj}(O_\mu)\beta.}           \tag{4.4}
\]

Consequently (3.4) gives the exact adjugate transform equation

\[
 \boxed{
 r\widehat w(z)
 =C_L(z)\det(O_\mu)
  -\widehat{\operatorname {adj}(O_\mu)\beta}(z).} \tag{4.5}
\]

In the meromorphic odd-profile coordinates, this is

\[
 \boxed{
 \mathcal A_\mu(r)
 =1+{\langle\chi_r^-,
        \operatorname {adj}(O_\mu)\beta\rangle
       \over\det(O_\mu)}.}                       \tag{4.6}
\]

The numerator has the two exact determinant forms

\[
\begin{aligned}
 \langle\chi_r^-,\operatorname {adj}(O_\mu)\beta\rangle
 &=-\det\begin{pmatrix}
       0&(\chi_r^-)^*\\
       \beta&O_\mu
      \end{pmatrix}\\
 &=\left.{d\over d\varepsilon}
   \det\{O_\mu+\varepsilon\beta(\chi_r^-)^*\}
   \right|_{\varepsilon=0}.
\end{aligned}
                                                               \tag{4.7}
\]

Thus it is a mixed directional cofactor, not the scalar odd determinant.
If `(nu_j,u_j)` is an orthonormal odd eigensystem of `Q_-`, then

\[
 \boxed{
 \langle\chi_r^-,O_\mu^{-1}\beta\rangle
 =\sum_j
 {\langle\chi_r^-,u_j\rangle\langle u_j,\beta\rangle
  \over\nu_j-\mu}.}                               \tag{4.8}
\]

Odd positivity signs only the denominators in (4.8).  It does not orient
the cross weights.

### Proposition 4.1 (determinant information does not fix the mixed row)

Even the complete scalar characteristic polynomial of a positive odd block
does not determine (4.7).  For example, put

\[
 O_1=\begin{pmatrix}1&0\\0&4\end{pmatrix},
 \qquad
 O_2={1\over25}\begin{pmatrix}73&-36\\-36&52\end{pmatrix}.       \tag{4.9}
\]

Both are positive and have characteristic polynomial `(1-s)(4-s)`.  But
for `beta=(1,0)^T` and `chi=(0,1)^T`,

\[
 \chi^*\operatorname {adj}(O_1)\beta=0,
 \qquad
 \chi^*\operatorname {adj}(O_2)\beta={36\over25}. \tag{4.10}
\]

This two-dimensional pair is only a linear-algebra audit of the information
content of a scalar determinant.  The exact source-Cauchy counterfamilies in
the frozen response note give the stronger source-structural warning: fixed
boundary data and any fixed finite local jet need not control a growing
response window.

Equations (4.6)--(4.8) isolate the first uncontrolled directional term.  The
additional scalar `p_mu` in (3.11) is the uncontrolled boundary-to-anchor
normalization.  Qualitative nonvanishing of either denominator is not a
uniform lower bound.

## 5. Regularized determinant and the tautological scalar ODE

The physical boundary-normalized ground is

\[
 \xi_\delta=\sqrt L\,\Phi_\mu,
 \qquad
 \delta_N(\xi_\delta)=1.                          \tag{5.1}
\]

Let

\[
 \Delta_{\lambda,N}(z)
 =\det_{\rm reg}(D_{\log}^{(\lambda,N)}-z).       \tag{5.2}
\]

With the source negative-axis spectral cut, the exact CCM identity is

\[
 \boxed{
 \Delta_{\lambda,N}(z)
 =-i\lambda^{-iz}\widehat\xi_\delta(z).}         \tag{5.3}
\]

Since `x=Phi_mu/p_mu`, equations (2.10) and (5.3) give

\[
 \boxed{
 \mathfrak R_\lambda(z)
 =\widehat\kappa(z)
 -{i\lambda^{iz}\over\sqrt L\,p_\mu}
   \Delta_{\lambda,N}(z).}                       \tag{5.4}
\]

On a zero-free open set for `Delta_(lambda,N)`, define

\[
 a_{\lambda,N}(z)
 =i\log\lambda
  +{\Delta_{\lambda,N}'(z)\over
     \Delta_{\lambda,N}(z)}.                     \tag{5.5}
\]

### Proposition 5.1 (exact scalar ODE and its scope)

The invariant response satisfies

\[
 \boxed{
 \mathfrak R_\lambda'(z)
 -a_{\lambda,N}(z)\mathfrak R_\lambda(z)
 =\widehat\kappa'(z)
  -a_{\lambda,N}(z)\widehat\kappa(z).}           \tag{5.6}
\]

At a determinant zero, (5.6) is interpreted through the globally entire
cross-multiplied identity

\[
\boxed{
 \Delta_{\lambda,N}
  \{\widehat\kappa'-\mathfrak R_\lambda'\}
 -\{i\log\lambda\,\Delta_{\lambda,N}
       +\Delta_{\lambda,N}'\}
  \{\widehat\kappa-\mathfrak R_\lambda\}=0.}     \tag{5.7}
\]

For any point `z_0` where the denominator is nonzero, the boundary scale
also cancels projectively:

\[
 \boxed{
 {\widehat\kappa(z)-\mathfrak R_\lambda(z)
  \over
  \widehat\kappa(z_0)-\mathfrak R_\lambda(z_0)}
 =\lambda^{i(z-z_0)}
  {\Delta_{\lambda,N}(z)\over
   \Delta_{\lambda,N}(z_0)}.}                    \tag{5.8}
\]

This is an exact scalar differential equation, but it is tautological for the
missing limit.  The coefficient (5.5) is the logarithmic derivative of
the unknown ground determinant.  The source theorem proves that its zeros
are real; it proves no locally uniform convergence of (5.5).  Away from
zeros of `Xi`, convergence of the properly scaled ground transform would
imply convergence of (5.5) to `Xi'/Xi`.  Conversely, such logarithmic-
derivative convergence still needs one normalization value and zero control
to recover the ground transform.  Neither input is currently available.

In particular, inserting `a_(lambda,N)` into (5.6) as if it were already a
controlled coefficient assumes the desired determinant/ground-transform
limit.  Equation (5.6) therefore proves no response decay.

## 6. Second multiplication and Krylov-tower nonclosure

The first multiplication in Section 3 passes from the even ground to the
single odd vector

\[
 v_\mu=O_\mu^{-1}\beta.                            \tag{6.1}
\]

Trying to multiply again does not close on `mathcal A_mu`.  On an odd
vector the opposite-parity part of (2.4) is

\[
 DQ_--Q_+D=-|\eta\rangle\langle\beta|.            \tag{6.2}
\]

Put

\[
 c_\mu=\langle\beta,v_\mu\rangle.
\]

Using `O_mu v_mu=beta` in (6.2) gives

\[
 \boxed{
 T_+Dv_\mu=D\beta+\eta c_\mu.}                   \tag{6.3}
\]

The operator `T_+` in (6.3) is singular with kernel `C Phi_mu`.  Let
`T_+^dagger` be its reduced inverse on the orthogonal ground complement and
put

\[
 u_0=T_+^\dagger(D\beta+\eta c_\mu).              \tag{6.4}
\]

Every solution of (6.3) is `u_0+a Phi_mu`.  The actual vector `Dv_mu` lies
in the range of `D` and therefore has zero `V_0` coefficient.  The parity
determinant identity makes `<e_0,Phi_mu>!=0`, so the selecting coefficient
is

\[
 \boxed{
 a=-{\langle e_0,u_0\rangle
       \over\langle e_0,\Phi_\mu\rangle}.}        \tag{6.5}
\]

Thus the attempted next scalar equation introduces both the reduced inverse
on the moving ground complement and a boundary/central overlap.  These are not
coefficients controlled by the odd determinant.

Further multiplications alternate the odd inverse, the singular even
reduced inverse, source derivatives, and boundary-selected ground
components.  At fixed `N`, Cayley--Hamilton eventually closes this tower,
but the order grows with `N` and its coefficients encode the full finite
matrix.  The frozen higher-derivative/Krylov theorem shows that complete
closure is a congruent rewriting of the original full gate, not a new
estimate.  A fixed number of steps leaves an uncontrolled orthogonal
complement.

Likewise, shifting `r` in the Cauchy sum replaces the coefficient list by a
shifted list.  The rank-two displacement leaves the source diagonal data
free and supplies no fixed coefficient recurrence.  Hence no
cutoff-independent scalar difference equation follows from the displacement
identity alone.

## 7. Fail-closed theorem/barrier pair

The strict exact content is the following pair.

1. **Theorem.**  Under the checkpoint-1.25 finite hypotheses, the complete
   actual-ground response and the forcing-adapted dangerous row reduce to
   the single capture-free scalar profile in (3.11)--(3.15).  Equations
   (4.5)--(4.7) and (5.4)--(5.8) are exact finite adjugate and determinant
   representations of that same invariant response.
2. **Barrier.**  The first determinant-uncontrolled datum is the mixed odd
   cofactor (0.3), followed by the anchor normalization `p_mu`.  The scalar
   ODE uses the unknown determinant logarithmic derivative, and a second
   multiplication uses the singular even reduced inverse and the central
   selector (6.5).  None has a proved arithmetic limit or decay estimate on
   the locked schedule.

Any use of this note must reject a claimed pass if it

1. treats `mathcal A_mu` or the general odd Weyl reconstruction as new;
2. replaces the mixed numerator in (4.6) by `det(O_mu)`, its characteristic
   polynomial, a rank bound, or an unsigned norm estimate;
3. divides by `p_mu`, `det(O_mu)`, `Delta_(lambda,N)(z)`, or a lattice factor
   without checking the stated nonvanishing or analytic-continuation branch;
4. reads (5.6) as an ODE with independently controlled coefficients;
5. suppresses the reduced inverse or the ground component in (6.3)--(6.5);
6. infers a fixed-order closure from a finite-dimensional
   Cayley--Hamilton identity whose order grows with `N`;
7. infers either checkpoint-1.25 strict sign, dangerous-row decay, ground
   alignment, determinant convergence, or a zero theorem from these finite
   identities; or
8. promotes the theorem/barrier pair to RH, a converse from RH, a `Lambda`
   bound, or any change in the formal state.

The first still-missing arithmetic assertion remains exactly

\[
 \boxed{
 \alpha_{\lambda,N}\sup_{z\in\Omega}
 \left|\widehat\kappa(z)
 -{K_L(z)\over p_\mu}
  \left\{1+{\langle\chi_r^-,
       \operatorname {adj}(O_\mu)\beta\rangle
       \over\det(O_\mu)}\right\}\right|
 \longrightarrow0.}                              \tag{7.1}
\]

This is equivalent to the checkpoint-1.25 dangerous-row target only after
the already proved far and captured limits and under the same unproved
strict signs.  Equation (7.1) is not proved here.

## 8. Reproduction and self-audit

Run

    python3 -B -m unittest \
      tests.test_capture_free_actual_ground_parity_response_barrier -v

The focused regression checks all frozen hashes, exact source displacement,
the actual-ground complement solve, mode multiplication, the invariant
response/profile identity, the adjugate and bordered mixed cofactor, the
isospectral determinant obstruction, the determinant-ODE signs, analytic
continuation, Krylov nonclosure, displayed TeX, ASCII hygiene, and the
fail-closed claim boundary.

This package adds only this note and its focused regression.  It changes no
standard-eight file, source lock, replay artifact, formal-status file, or Git
state.
