# Paired exponential Weyl function and constrained-ground reduction

## 0. Scope and conclusion

This note continues the source-specific pole-load attack in
`BIRMAN_SCHWINGER_POLE_LOAD_CROSSING_AUDIT.md` and
`PAIRED_RESOLVENT_FOLDED_HANKEL_OBSTRUCTION.md`.  It uses one fact not used
there: the mandatory projected pole vectors are the two parity components
of a **single** projected exponential.

For every locked finite compression, the paired function

\[
 F_+(z)+F_-(z)
\]

is exactly one diagonal Weyl function of the common pole-deleted source
operator.  Its first nonexceptional zero is the lowest eigenvalue of that
operator compressed to the orthogonal complement of the projected
exponential `exp(x/2)`.  More strongly, the positive-even and negative-odd pole forms
cancel identically after compression to this codimension-one space.  The
compressed operator and its lowest eigenvalue are therefore independent of
the audit pole load.

On the nonexceptional first branch, that constrained eigenvalue is exactly
the energy of the first even/odd ground collision.  The crossing load can
be recovered either from one positive odd resolvent or directly from the
constrained eigenpair.  At the collision energy the full determinant ratio
is a perfect square.  Hence an unseparated determinant detects the
collision but loses which side of it contains the source load.

This is a finite, source-pinned equivalence and a sharper target, not the
missing sign theorem.  The source task is now to prove that the unit load is
smaller than the crossing load reconstructed from the constrained ground.
No estimate in this note proves
that assertion on an unbounded schedule.  The exceptional case in which
the constrained eigenvalue is already a nonpole eigenvalue must be checked
directly and is not discarded by a cyclicity assumption.

The complete nonpole operator below retains the archimedean Levy density
and every prime-power atom `n<=lambda^2`.  The endpoint is inclusive.  The
minus sign on the prime block in source equation (3.19) is unchanged; it is
what turns the pole-deleted prime contribution into the positive
translation energy used here.  No zero table, assumed global Weil
positivity, or real-axis proxy for a determinant limit is used.  The result
does not prove equation (5.2) of `DIRECT_RH_ATTACK.md` or an asymptotic
bridge.  The formal project state remains `P0_INVALIDATED`.

## 1. Locked finite operator and the one-sided exponential

Put

\[
 \ell=\log\lambda,\qquad L=2\ell,\qquad
 I=[-\ell,\ell],                                      \tag{1.1}
\]

use Lebesgue measure, and extend functions by zero outside `I`.  Let `E_N`
be the full centered Fourier compression and let `Jf(x)=f(-x)`.  Its parity
decomposition is

\[
 E_N=E_N^+\oplus E_N^- .                              \tag{1.2}
\]

Let `mathscr A_N` be the finite compression of the common pole-deleted
Bernstein--Levy operator, after removal of an irrelevant common scalar.  In
the notation of the preceding folded-Hankel note its form is the compression
of

\[
 {1\over2}\int_{\mathbb R}\!\int_{\mathbb R}
 |\widetilde f(x+h)-\widetilde f(x)|^2\,dx\,
 \nu_\lambda(dh),                                     \tag{1.3}
\]

where

\[
 \nu_\lambda(dh)=
 {e^{-|h|/2}\over1-e^{-2|h|}}\,dh
 +\sum_{1<n\leq\lambda^2}{\Lambda(n)\over\sqrt n}
  (\delta_{\log n}+\delta_{-\log n})(dh).             \tag{1.4}
\]

Thus `mathscr A_N` is self-adjoint, nonnegative, and commutes with `J`.
Write

\[
 \mathscr A_N=\mathscr A_+\oplus\mathscr A_- .         \tag{1.5}
\]

The Fourier convention is

\[
 \widehat f(z)=\int_I f(x)e^{-izx}\,dx .               \tag{1.6}
\]

Consequently the Riesz vector of evaluation at `z=i/2` is the orthogonal
projection of `e^{x/2}`.  Define

\[
 w=P_{E_N}e^{x/2},\qquad
 p_+=P_{E_N^+}\cosh(x/2),\qquad
 p_-=P_{E_N^-}\sinh(x/2).                             \tag{1.7}
\]

Because the Fourier projection commutes with inversion,

\[
 \boxed{w=p_++p_-.}                                    \tag{1.8}
\]

The projections in (1.7) are mandatory.  Replacing them by the continuum
functions changes the finite pole matrices.

For an audit load `s>=0`, the two loaded blocks and their full direct sum
are

\[
 H_+(s)=\mathscr A_++2s|p_+\rangle\langle p_+|,
 \qquad
 H_-(s)=\mathscr A_--2s|p_-\rangle\langle p_-|,         \tag{1.9}
\]

\[
 H(s)=H_+(s)\oplus H_-(s)
     =\mathscr A_N+s\mathcal P,                        \tag{1.10}
\]

with

\[
 \mathcal P=2|p_+\rangle\langle p_+|
            -2|p_-\rangle\langle p_-|.                \tag{1.11}
\]

The source is the single value `s=1`.

## 2. The paired resolvent is one Weyl function

For real or complex `z` off the nonpole spectra, retain

\[
 F_\pm(z)=
 \langle p_\pm,(\mathscr A_\pm-zI)^{-1}p_\pm\rangle.   \tag{2.1}
\]

### Theorem 2.1 (one-sided exponential collapse)

One has the exact identity

\[
 \boxed{
 F_+(z)+F_-(z)
 =\langle w,(\mathscr A_N-zI)^{-1}w\rangle.}           \tag{2.2}
\]

**Proof.**  The resolvent of `mathscr A_N` is block diagonal in parity.
Insert (1.8).  The two cross terms vanish because the parity sectors are
orthogonal, leaving exactly (2.1).  \(\square\)

This identity is not a replacement of the source by a continuum operator.
It holds after the same finite orthogonal projection has been applied to
the operator and all three Riesz vectors.

Let

\[
 \mathcal K=w^\perp,\qquad
 C=P_{\mathcal K}\mathscr A_NP_{\mathcal K}|_{\mathcal K}.
                                                               \tag{2.3}
\]

In an orthonormal basis beginning with `w/||w||`, the cofactor formula gives

\[
 \boxed{
 F_+(z)+F_-(z)
 =\|w\|^2\,{\det(C-zI)\over\det(\mathscr A_N-zI)}.}   \tag{2.4}
\]

Thus the zeros of the paired resolvent are constrained nonpole
eigenvalues, subject to the usual cancellation when such an eigenvalue is
also an eigenvalue of the full nonpole matrix.  Formula (2.4) is an exact
determinant-ratio representation; it does not use a cached eigenvector.

For real `z` off the nonpole spectrum, differentiation gives

\[
 \boxed{
 {d\over dz}\{F_+(z)+F_-(z)\}
 =\|(\mathscr A_N-zI)^{-1}w\|^2>0.}                    \tag{2.5}
\]

Thus the paired function is strictly increasing on every common spectral
gap.  If the nonpole ground `a_1` is simple and has nonzero `w` overlap, it
tends to minus infinity as `z` decreases to `a_1` from above.  Hence any
zero in `(a_1,a_2)` is unique.  Section 4 proves that, in the
nonexceptional domain, this unique zero is `zeta`.

## 3. Exact pole cancellation on the exponential hyperplane

### Theorem 3.1 (load-independent constrained compression)

For every `s` and all `u,v in mathcal K`,

\[
 \boxed{\langle u,\mathcal Pv\rangle=0,}               \tag{3.1}
\]

and hence

\[
 \boxed{
 P_{\mathcal K}H(s)P_{\mathcal K}|_{\mathcal K}=C.}   \tag{3.2}
\]

**Proof.**  Write `u=u_++u_-` and set

\[
 a_u=\langle p_+,u_+\rangle,
 \qquad b_u=\langle p_-,u_-\rangle.                   \tag{3.3}
\]

Equation (1.8) and `u perpendicular w` give `b_u=-a_u`; similarly
`b_v=-a_v`.  Therefore

\[
 \langle u,\mathcal Pv\rangle
 =2\overline{a_u}a_v-2\overline{b_u}b_v=0.             \tag{3.4}
\]

Compression of (1.10) now proves (3.2).  \(\square\)

The cancellation is sesquilinear, not merely a zero Rayleigh quotient.
It mixes the two parity sectors through the one-sided exponential
constraint.  In particular, it does not contradict the signed folded
Hankel obstruction to a global Loewner comparison.

For later use, (3.4) also gives the uncompressed action

\[
 \boxed{\mathcal Pu=2a_u w\quad(u\in\mathcal K).}       \tag{3.5}
\]

Every arithmetic atom in (1.4) remains in `C`; only the explicit opposite
pole ranks cancel.

Since `<w,f>=hat(f)(i/2)` for `f in E_N`, Theorem 3.1 also gives the exact
source variational formula

\[
 \boxed{
 \zeta=\min_{\substack{f\in E_N,\ \|f\|=1\\
                        \widehat f(i/2)=0}}
 {1\over2}\int_{\mathbb R}\!\int_{\mathbb R}
 |\widetilde f(x+h)-\widetilde f(x)|^2\,dx\,
 \nu_\lambda(dh).}                                    \tag{3.6}
\]

Thus `zeta` is a one-sided Mellin-zero Poincare constant for the complete
nonpole source measure.  It is still a finite-compression quantity: the
minimization is over `E_N`, not over the full continuum form domain.

## 4. The first constrained ground is the first collision energy

Let the eigenvalues of `mathscr A_N` be

\[
 a_1<a_2\leq\cdots,                                    \tag{4.1}
\]

and assume the following finite facts have been proved rather than inferred
from continuum positivity:

1. `a_1` is simple and inversion even;
2. its eigenvector is not orthogonal to `p_+`, equivalently to `w`; and
3. `p_-` is nonzero; and
4. with

   \[
    \zeta=\lambda_{\min}(C),                            \tag{4.2}
   \]

   one has the nonexceptional inequality `zeta<a_2`.

The min--max principle gives

\[
 \boxed{a_1<\zeta<a_2.}                                \tag{4.3}
\]

The first inequality is strict because the simple `a_1` eigenvector is not
in `w^perp`; the second is hypothesis 4.  Since `zeta` is not in the
spectrum of `mathscr A_N`, equations (2.2)--(2.4) imply

\[
 F_+(\zeta)+F_-(\zeta)=0.                              \tag{4.4}
\]

Let `a_-` be the bottom of `mathscr A_-`.  Since `a_2<=a_-`, (4.3) gives
`mathscr A_- - zeta I>0`, and hence

\[
 \tau:=F_-(\zeta)>0,
 \qquad F_+(\zeta)=-\tau.                              \tag{4.5}
\]

### Theorem 4.1 (first-crossing reconstruction)

Under the four hypotheses above, the first even/odd ground collision is
at

\[
 \boxed{
 s_c={1\over2F_-(\zeta)}=-{1\over2F_+(\zeta)}>0,}       \tag{4.6}
\]

and its common energy is exactly `zeta`:

\[
 \boxed{
 \lambda_{\min}(H_+(s_c))
 =\lambda_{\min}(H_-(s_c))=\zeta.}                    \tag{4.7}
\]

**Proof.**  At the load (4.6), the two rank-one secular factors at
`z=zeta` are

\[
 1+2s_cF_+(\zeta)=0,
 \qquad
 1-2s_cF_-(\zeta)=0.                                  \tag{4.8}
\]

Because `zeta` lies strictly between the simple full nonpole ground and
`a_2`, the even root is the first rank-one-updated eigenvalue and the odd
root is the unique rank-one-lowered eigenvalue below `a_-`.  They are
therefore the two sector grounds.  Both secular roots are simple and their
pole overlaps are nonzero by (4.5).  Hellmann--Feynman consequently gives
a strictly negative derivative for the odd-minus-even ground gap at
`s=s_c`.

Globally, the even ground is nondecreasing and the odd ground is
nonincreasing, so their difference is nonincreasing even across branch
switches.  Local strict decrease through zero at `s_c` makes the gap
positive immediately to its left and negative immediately to its right;
global weak monotonicity extends those signs to every smaller and larger
load.  Thus `s_c` is the first and unique ground collision.  This argument
allows unchanged pole-orthogonal sector eigenvalues away from the crossing;
it does not silently assume their absence.  \(\square\)

The result also has an inverse-free form.  Choose a real constrained ground
`phi in K`.  Since `zeta` is nonexceptional,

\[
 (\mathscr A_N-\zeta I)\phi=\gamma w,
 \qquad \gamma\ne0.                                    \tag{4.9}
\]

Put `alpha=<p_+,phi_+>`.  Equations (3.5) and (4.9) give

\[
 (H(s)-\zeta I)\phi=(\gamma+2s\alpha)w.                \tag{4.10}
\]

After choosing the sign of `phi` so that `gamma>0`, one has `alpha<0` and

\[
 \boxed{s_c=-{\gamma\over2\alpha}.}                    \tag{4.11}
\]

Thus the missing source sign is one orientation scalar of the actual
constrained ground, not a norm of the signed Hankel difference.

## 5. Equivalent unit-load tests

Let `z_+(1)` be the nonexceptional loaded even ground, so

\[
 1+2F_+(z_+(1))=0.                                    \tag{5.1}
\]

Within the domain of Theorem 4.1, the following statements are equivalent:

\[
\begin{array}{ll}
\text{(i)}&\lambda_{\min}(H_-(1))>
             \lambda_{\min}(H_+(1)),\\[1mm]
\text{(ii)}&s_c>1,\\[1mm]
\text{(iii)}&z_+(1)<\zeta,\\[1mm]
\text{(iv)}&\mathscr A_--z_+(1)I\succ0
 \quad\hbox{and}\quad
 F_+(z_+(1))+F_-(z_+(1))<0,\\[1mm]
\text{(v)}&2F_-(\zeta)<1,\\[1mm]
\text{(vi)}&\gamma+2\alpha>0
 \quad\text{when `gamma>0` in (4.9).}
\end{array}                                             \tag{5.2}
\]

The equivalence of (i)--(iii) follows from the global weak monotonicity and
the locally strict crossing conclusion of Theorem 4.1 together with (4.7);
unchanged pole-orthogonal levels need not move.  A nonexceptional even
ground root lies below the second even nonpole level.  The first condition
in (iv) therefore puts `z_+(1)` below
`a_2=min(lambda_2(mathscr A_+),lambda_1(mathscr A_-))`.  On `(a_1,a_2)`,
the Weyl function (2.2) is strictly increasing and has its unique zero at
`zeta`, proving (iii)--(iv).  Equation (4.6) proves (ii)--(v), and (4.11)
proves (ii)--(vi).

The spectral-location condition in (iv) is indispensable.  After another
nonpole pole, the paired Weyl function can be negative again even when
`z_+(1)>zeta`; its sign alone does not identify the first gap.  Thus the
correct statement retains both pieces of the physical Birman--Schwinger
test rather than using an unlabelled scalar proxy.

In particular, (iii) automatically puts `z_+(1)` below `a_2` and hence
below the nonpole odd floor.  It then supplies both pieces of the physical
Birman--Schwinger test, not merely its scalar factor.  None of (5.2) has yet
been established for the actual arithmetic family on an unbounded
schedule.

## 6. Perfect-square determinant and the lost orientation

At `z=zeta`, the determinant lemmas and (4.5) give

\[
\begin{aligned}
 {\det(H(s)-\zeta I)\over
  \det(\mathscr A_N-\zeta I)}
 &=(1+2sF_+(\zeta))(1-2sF_-(\zeta))\\
 &=\left(1-{s\over s_c}\right)^2.
\end{aligned}                                           \tag{6.1}
\]

Hence

\[
 \boxed{
 {\det(H(s)-\zeta I)\over
  \det(\mathscr A_N-\zeta I)}
 =\left(1-{s\over s_c}\right)^2.}                     \tag{6.2}
\]

Equation (6.2) is the determinant ratio of the **full direct-sum** loaded
operator `H_+(s) direct-sum H_-(s)` to the full direct-sum nonpole operator.
It is not the quotient of the even determinant by the odd determinant.

The double zero is the parity collision.  It also proves a precise
determinant-only obstruction: at the source load the full ratio is
nonnegative whether `s_c` is above or below one.  Squaring has erased the
orientation required in (5.2).  One must retain a labelled sector factor,
for example

\[
 {\det(H_-(1)-\zeta I)\over
  \det(\mathscr A_--\zeta I)}
 =1-2F_-(\zeta),                                      \tag{6.3}
\]

or the signed constrained residual in (4.10).  Real-axis agreement of the
unlabelled determinant cannot substitute for this sign.

## 7. Exact moment and continued-fraction target

The one-Weyl-function reduction also gives a canonical Krylov target.  Put

\[
 e_0={w\over\|w\|},\qquad
 \mu_k=\langle e_0,\mathscr A_N^k e_0\rangle
 \quad(k\geq0).                                      \tag{7.1}
\]

These are moments of the positive spectral measure

\[
 d\omega(t)=
 \sum_j|\langle\phi_j,e_0\rangle|^2\delta_{a_j}(dt),  \tag{7.2}
\]

where `phi_j` are nonpole eigenvectors.  In particular,

\[
 {F_+(z)+F_-(z)\over\|w\|^2}
 =\int{d\omega(t)\over t-z}.                          \tag{7.3}
\]

Run exact Lanczos from `e_0`.  On its cyclic subspace the matrix of
`mathscr A_N` is the Jacobi matrix

\[
 \mathcal J=
 \begin{bmatrix}
 \alpha_0&\beta_1&&\\
 \beta_1&\alpha_1&\ddots&\\
 &\ddots&\ddots&\beta_{d-1}\\
 &&\beta_{d-1}&\alpha_{d-1}
 \end{bmatrix},                                      \tag{7.4}
\]

and

\[
 {F_+(z)+F_-(z)\over\|w\|^2}
 ={1\over
 \alpha_0-z-\cfrac{\beta_1^2}{
 \alpha_1-z-\cfrac{\beta_2^2}{\ddots-
 \cfrac{\beta_{d-1}^2}{\alpha_{d-1}-z}}}}}.          \tag{7.5}
\]

All coefficients are reconstructed from the combined source moments by
Gram--Schmidt.  The first ones are

\[
 \alpha_0=\mu_1,
 \qquad
 \beta_1^2=\mu_2-\mu_1^2,                             \tag{7.6}
\]

and, when `beta_1` is nonzero,

\[
 \alpha_1=
 {\mu_3-2\mu_1\mu_2+\mu_1^3
  \over\mu_2-\mu_1^2}.                               \tag{7.7}
\]

If `w` is cyclic, deleting the first row and column of `mathcal J` gives an
exact matrix representation of `C`, and

\[
 \boxed{
 \zeta=\lambda_{\min}(\mathcal J_{1: ,1:}).}          \tag{7.8}
\]

Without cyclicity, the invariant orthogonal complement of the Krylov space
must be compared directly.  This is the same exceptional-eigenvalue caveat
as in (2.4), not permission to discard an unseen sector.

Equation (7.8) is an exact finite moment target, but a fixed moment prefix
does not have the direction needed for the source theorem.  The leading
`r by r` principal submatrix of the trailing Jacobi matrix gives

\[
 \lambda_{\min}(\mathcal J_{1: ,1:})
 \leq
 \lambda_{\min}(\mathcal J_{1:r,1:r}),                \tag{7.9}
\]

so it is an **upper** Ritz bound for `zeta`.  Proving `z_+(1)<zeta`
requires a lower bound for the complete trailing matrix, or an explicit
tail Schur estimate.  A finite number of moments, with no tail control,
cannot be promoted to the required inequality.

The moments in (7.1) must be formed from the already combined nonpole
matrix.  Taking separate archimedean and prime absolute moments would omit
their mixed products and would not reconstruct (7.5).

## 8. Exceptional branch and continuum caveats

If `zeta=a_2`, the constrained eigenvalue may also be a nonpole eigenvalue.
Then the numerator and denominator in (2.4) can share a zero, the resolvent
at `zeta` need not exist, and an eigenvector orthogonal to a pole vector can
remain unchanged under the rank-one update.  The correct procedure is to
compare that eigenvalue and its pole overlap directly.  Deleting it by
assuming cyclicity would be an additional unproved source hypothesis.

Likewise, (1.3) is the source continuum form used to reconstruct the finite
matrix, but Theorems 2.1--4.1 concern the actual finite compression and its
actual projected exponential.  A continuum constrained minimizer is not a
finite Fourier vector.  No finite conclusion is inferred from continuum
Galerkin density without a separate quantitative theorem.

Finally, the pointwise positive cone does not directly solve the new
constrained problem.  In the continuum,

\[
 \{f:\langle e^{x/2},f\rangle=0\}
 \cap L^2(I)_+=\{0\}.                                \tag{8.1}
\]

For `f in E_N`, orthogonality to `w=P_{E_N}e^{x/2}` is the same scalar
condition.  Thus the exponential hyperplane is not a pointwise sublattice,
even though the uncompressed nonpole Levy operator has a positive form.
The remaining estimate must use the actual arithmetic constrained ground
or an equivalent labelled-sector resolvent, with the pole--archimedean--
prime cancellation intact.
