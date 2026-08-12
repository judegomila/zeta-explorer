# Constrained-trial labelled load reserve

## 0. Scope and outcome

This note gives a finite, source-pinned certificate for deciding whether the
physical pole load `s=1` is still before the first **labelled even/odd ground
collision**.  It combines two facts that are individually insufficient:

1. the positive-even and negative-odd pole forms cancel on the one-sided
   exponential hyperplane; and
2. a strict lower bound for the labelled odd block can be tested at the
   Rayleigh energy of any vector in that hyperplane.

The resulting certificate does not need the unlabelled direct-sum determinant
and cannot be fooled by the sign of a paired Weyl function after a later
nonpole pole.  If a normalized constrained trial has energy `U` and

\[
 H_-(1)-UI\succ0,
\]

then the unit-load ground is strictly even.  More strongly, one inverse
quadratic form gives a certified interval of pole loads beyond one on which
the ground remains even.  Under the first-gap hypotheses of
`PAIRED_EXPONENTIAL_CONSTRAINED_GROUND_REDUCTION.md`, the same number is a
lower bound for the first constrained-ground collision load `s_c`.

This is an exact variational reduction, not the missing source estimate.  No
unbounded arithmetic schedule is proved to satisfy the strict odd floor.  No
zeta-zero table, assumed global Weil positivity, critical-line hypothesis, or
real-axis determinant proxy is used.  The result does not prove equation
(5.2) of `DIRECT_RH_ATTACK.md` or the Riemann hypothesis.  The formal project
state remains `P0_INVALIDATED`.

## 1. Locked finite source operator

Put

\[
 \ell=\log\lambda,\qquad L=2\ell,\qquad
 I=[-\ell,\ell],                                      \tag{1.1}
\]

use Lebesgue measure, and extend functions by zero outside `I`.  The Fourier
convention is

\[
 \widehat f(z)=\int_I f(x)e^{-izx}\,dx.               \tag{1.2}
\]

Let `E_N=E_N^+\oplus E_N^-` be the centered Fourier compression split by
inversion `Jf(x)=f(-x)`.  After subtracting the exact common scalar
`m_lambda(0)`, let

\[
 \mathscr A_N=\mathscr A_+\oplus\mathscr A_-          \tag{1.3}
\]

be the compression of the complete pole-deleted Bernstein--Levy form

\[
 \mathfrak a_\lambda(f)=
 {1\over2}\int_{\mathbb R}\!\int_{\mathbb R}
 |\widetilde f(x+h)-\widetilde f(x)|^2\,dx\,
 \nu_\lambda(dh),                                    \tag{1.4}
\]

where

\[
 \nu_\lambda(dh)=
 {e^{-|h|/2}\over1-e^{-2|h|}}\,dh
 +\sum_{1<n\leq\lambda^2}{\Lambda(n)\over\sqrt n}
   (\delta_{\log n}+\delta_{-\log n})(dh).            \tag{1.5}
\]

The endpoint is inclusive.  Every prime power `n<=lambda^2` is retained.
The positive atoms in (1.5) come from preserving the minus sign on the prime
block in source equation (3.19).  No unspecified `O(1)` scalar is permitted:

\[
 m_\lambda(0)=\psi(1/4)-\log\pi
 -2\sum_{1<n\leq\lambda^2}{\Lambda(n)\over\sqrt n}.   \tag{1.6}
\]

The mandatory projected pole vectors and their one-sided sum are

\[
 p_+=P_{E_N^+}\cosh(x/2),\qquad
 p_-=P_{E_N^-}\sinh(x/2),\qquad
 w=p_++p_-=P_{E_N}e^{x/2}.                            \tag{1.7}
\]

For the audit load `s>=0`, define

\[
 H_+(s)=\mathscr A_++2s|p_+\rangle\langle p_+|,
 \qquad
 H_-(s)=\mathscr A_--2s|p_-\rangle\langle p_-|,       \tag{1.8}
\]

and let

\[
 z_\pm(s)=\lambda_{\min}(H_\pm(s)).                  \tag{1.9}
\]

The source is the single load `s=1`.  Varying `s` is only an algebraic
audit.  Put

\[
 \mathcal K=w^\perp,
 \qquad
 C=P_{\mathcal K}\mathscr A_NP_{\mathcal K}|_{\mathcal K}.
                                                               \tag{1.10}
\]

For every `f in mathcal K`, the exact sesquilinear pole cancellation gives

\[
 \langle f,H(s)f\rangle
 =\langle f,\mathscr A_Nf\rangle,
 \qquad H(s)=H_+(s)\oplus H_-(s).                    \tag{1.11}
\]

Equivalently, the left side is independent of `s`.  This is the only reason
the trial argument below works.  Replacing `w` by an unprojected continuum
exponential would change the finite constraint and invalidate (1.11).

## 2. A labelled constrained-trial certificate

Choose any normalized real trial

\[
 \phi\in\mathcal K,\qquad \|\phi\|=1,
 \qquad U=\langle\phi,\mathscr A_N\phi\rangle.        \tag{2.1}
\]

The use of real vectors is harmless for the source matrices after the usual
real parity identification.  The complex statement follows by retaining
conjugates.

Define the labelled odd unit-load margin matrix

\[
 B_U=H_-(1)-UI
 =\mathscr A_--2|p_-\rangle\langle p_-|-UI.           \tag{2.2}
\]

### Theorem 2.1 (constrained-trial labelled load reserve)

Assume

\[
 \boxed{B_U\succ0.}                                   \tag{2.3}
\]

If `p_-` is nonzero, put

\[
 \chi_U=\langle p_-,B_U^{-1}p_-\rangle,
 \qquad
 s_{\rm trial}=1+{1\over2\chi_U}.                    \tag{2.4}
\]

Then

\[
 \boxed{z_+(s)\leq U<z_-(s)
 \quad(1\leq s<s_{\rm trial}).}                      \tag{2.5}
\]

Consequently the first labelled even/odd ground collision after load zero,
whenever the zero-load even ground is strictly below the odd ground, obeys

\[
 \boxed{s_{\rm ground}\geq
 1+{1\over2\langle p_-,B_U^{-1}p_-\rangle}>1.}       \tag{2.6}
\]

If the certified matrix floor is

\[
 B_U\succeq\delta I,\qquad\delta>0,                  \tag{2.7}
\]

then the inverse-free reserve is

\[
 \boxed{s_{\rm ground}\geq
 1+{\delta\over2\|p_-\|^2}.}                        \tag{2.8}
\]

If `p_-=0`, the odd block is independent of load; (2.5) holds for every
`s>=1` as long as (2.3) holds, and the reserve is interpreted as infinite.

**Proof.**  Write `t=s-1`.  From (2.2),

\[
 H_-(1+t)-UI=B_U-2t|p_-\rangle\langle p_-|.          \tag{2.9}
\]

Since `B_U` is positive definite, a congruence by `B_U^{-1/2}` and the
rank-one eigenvalue formula give

\[
 B_U-2t|p_-\rangle\langle p_-|\succ0
 \quad\Longleftrightarrow\quad
 1-2t\chi_U>0.                                      \tag{2.10}
\]

Thus `z_-(s)>U` throughout the interval in (2.5).  On the other hand,
(1.11) and the trial (2.1) show that the lowest eigenvalue of the direct sum
`H_+(s)\oplus H_-(s)` is at most `U` for every load.  Since its labelled odd
ground is strictly above `U`, its lowest eigenvalue must come from the even
sector.  Hence `z_+(s)<=U<z_-(s)`, proving (2.5)--(2.6).

For completeness, `z_+(s)` is nondecreasing and `z_-(s)` is nonincreasing,
so `z_-(s)-z_+(s)` is nonincreasing.  Strict even order at load zero together
with (2.5) at load one rules out an earlier collision followed by a return to
even order.  Thus the first collision really lies beyond the interval in
(2.5).

Finally, (2.7) implies

\[
 \chi_U\leq{\|p_-\|^2\over\delta},                  \tag{2.11}
\]

which proves (2.8).  \(\square\)

The theorem is deliberately one-sided.  At `s=s_trial` the odd block has an
eigenvalue equal to `U`, but the even ground can still be strictly below
`U`; therefore (2.6) is a lower bound, not an asserted collision equality.

## 3. Link to the first constrained ground

Let

\[
 \zeta=\lambda_{\min}(C).                            \tag{3.1}
\]

To identify `zeta` with the first collision energy, retain all four
first-gap hypotheses of the preceding constrained-ground note:

1. the nonpole ground `a_1` is simple and inversion even;
2. its eigenvector has nonzero overlap with `w`, equivalently with `p_+`;
3. `p_-` is nonzero; and
4. `zeta<a_2`, where `a_2` is the second eigenvalue of `mathscr A_N`.

These are location and nonexceptionality hypotheses; none is inferred from
a sign sampled after a resolvent pole.  They imply

\[
 a_1<\zeta<a_2\leq\lambda_{\min}(\mathscr A_-),       \tag{3.2}
\]

and the first constrained-ground collision is

\[
 s_c={1\over2F_-(\zeta)},\qquad
 F_-(z)=\langle p_-,(\mathscr A_--zI)^{-1}p_-\rangle.
                                                               \tag{3.3}
\]

Every constrained trial satisfies `zeta<=U`.  Condition (2.3) also implies
`mathscr A_--UI>0`, and the Sherman--Morrison identity gives

\[
 F_-(U)={\chi_U\over1+2\chi_U}.                       \tag{3.4}
\]

Since `F_-` is strictly increasing below the odd nonpole floor,

\[
 F_-(\zeta)\leq F_-(U)<{1\over2}.                    \tag{3.5}
\]

Consequently

\[
 \boxed{s_c\geq{1\over2F_-(U)}
 =1+{1\over2\chi_U}>1.}                             \tag{3.6}
\]

This is the same lower bound as (2.6), now explicitly located on the first
Weyl gap.  In particular, within the four-hypothesis domain,

\[
 \boxed{
 s_c>1\quad\Longleftrightarrow\quad
 \text{there exists a normalized `phi in w^perp` with }
 H_-(1)-\langle\phi,\mathscr A_N\phi\rangle I\succ0.}
                                                               \tag{3.7}
\]

For the reverse implication in (3.7), choose an actual constrained ground
in (2.1).  If `s_c>1`, monotonicity of the labelled odd ground gives
`z_-(1)>zeta`, so (2.3) holds with `U=zeta`.  Formula (3.7) is existentially
exact but does not manufacture a usable trial or a uniform matrix floor.

Outside the four-hypothesis domain, Theorem 2.1 still proves the labelled
sector order and a lower bound for the first sector-ground collision.  What
must not be done is rename an exceptional constrained eigenvalue as the
first collision energy without checking (3.2).

## 4. Source-explicit constrained trials

The constraint can be imposed algebraically without a cached eigenvector.
Choose real vectors `u_+ in E_N^+` and `u_- in E_N^-` and set

\[
 a_+=\langle p_+,u_+\rangle,
 \qquad a_-=\langle p_-,u_-\rangle.                  \tag{4.1}
\]

Then

\[
 g=a_-u_+-a_+u_-                                    \tag{4.2}
\]

satisfies

\[
 \langle w,g\rangle=a_-a_+-a_+a_-=0.               \tag{4.3}
\]

If `g` is nonzero, its normalized Rayleigh energy is

\[
 U_g=
 {a_-^2\langle u_+,\mathscr A_+u_+\rangle
  +a_+^2\langle u_-,\mathscr A_-u_-\rangle
 \over
  a_-^2\|u_+\|^2+a_+^2\|u_-\|^2}.                  \tag{4.4}
\]

There is a more useful load-one version.  Take normalized real sector trials
and write

\[
 \alpha=\langle p_+,u_+\rangle,\qquad
 \beta=\langle p_-,u_-\rangle,                     \tag{4.5}
\]

and assume

\[
 \alpha^2+\beta^2>0.                                \tag{4.5a}
\]

If both overlaps vanish, the construction below gives the zero vector and
no Rayleigh quotient; that case must be rejected rather than assigned an
energy.

\[
 h_+=\langle u_+,H_+(1)u_+\rangle,\qquad
 h_-=\langle u_-,H_-(1)u_-\rangle.                 \tag{4.6}
\]

The vector

\[
 g=\beta u_+-\alpha u_-\in w^\perp                 \tag{4.7}
\]

has the exact constrained energy

\[
 \boxed{
 U_g={\beta^2h_++\alpha^2h_-
       \over\alpha^2+\beta^2}.}                     \tag{4.8}
\]

Indeed, \(g\) is constrained, so its pole form is zero; alternatively the
positive-even and negative-odd pole contributions cancel directly after
inserting (4.5).  Formula (4.8) retains both sector labels and both pole
overlaps.

Suppose a separate source argument certifies

\[
 H_-(1)\succeq \ell_- I.                            \tag{4.9}
\]

Then Theorem 2.1 passes whenever

\[
 \boxed{
 \beta^2(\ell_--h_+)
 >
 \alpha^2(h_--\ell_-).}                            \tag{4.10}
\]

In that case the explicit odd floor at the constrained trial energy is

\[
 \boxed{
 \delta=\ell_--U_g
 ={\,\beta^2(\ell_--h_+)
    -\alpha^2(h_--\ell_-)
   \over\alpha^2+\beta^2}>0.}                       \tag{4.11}
\]

This exposes the practical accuracy requirement.  The even trial surplus
below the odd floor, weighted by its odd pole overlap \(\beta^2\), must
dominate the odd trial's excess above its certified floor, weighted by the
even pole overlap \(\alpha^2\).  An odd Ritz value without a lower enclosure
\(\ell_-\) does not prove (4.10).  Conversely, (4.10) can combine a
source-normalized prolate even trial with a separately enclosed odd Ritz pair
without ever storing a constrained eigenvector.

As an identity check, if the two trials are the exact unit-load sector
grounds and their pole overlaps are nonzero, then

\[
 \ell_-=h_-=z_-(1),\qquad h_+=z_+(1),               \tag{4.12}
\]

and (4.11) reduces to

\[
 \delta=
 {\beta^2\{z_-(1)-z_+(1)\}
  \over\alpha^2+\beta^2}.                           \tag{4.13}
\]

This shows existential sharpness but is not a proof strategy by itself:
inserting uncertified ground eigenvectors or assuming the sector gap in
(4.13) would be circular.  The useful implementation of (4.10) starts from
independently reconstructed trial vectors and a certified lower floor
\(\ell_-\).

A completely explicit special case uses the projected pole vectors.  Put

\[
 x=\|p_+\|^2,\quad y=\|p_-\|^2,
 \quad t_\pm=\langle p_\pm,\mathscr A_\pm p_\pm\rangle.
                                                               \tag{4.14}
\]

When `x*y>0`, the pole-balanced vector

\[
 g_0=yp_+-xp_-\in w^\perp                           \tag{4.15}
\]

has energy

\[
 \boxed{
 U_0={y^2t_++x^2t_-\over xy(x+y)}.}                 \tag{4.16}
\]

All vectors in (4.1)--(4.16) are the finite projections in (1.7), not the
unprojected hyperbolic functions.  The pole-balanced trial is a deterministic
first diagnostic; there is no theorem that it is close enough to `zeta`.

More generally, take any source-reconstructed finite trial synthesis `V`,
form the exact row `w^*V`, compute a basis for its nullspace, and solve the
Rayleigh--Ritz problem for `V^*mathscr A_N V` on that nullspace.  Every Ritz
vector so obtained obeys the constraint exactly and gives a rigorous upper
bound `zeta<=U` once its entries and Rayleigh quotient are enclosed.  A
verifier must reconstruct `V`, `w`, and `mathscr A_N` from source parameters;
it must not trust a serialized Ritz vector or a producer pass boolean.

## 5. Certifying the labelled odd floor

The matrix in (2.2) is the compression of the exact source form

\[
 \langle v,B_Uv\rangle
 =\mathfrak a_\lambda(v)
  -2|\langle p_-,v\rangle|^2-U\|v\|^2,
 \qquad v\in E_N^-.                                 \tag{5.1}
\]

Thus a direct interval `LDL^*` factorization of `B_U` is already a complete
finite certificate.  It keeps the odd label and the trial energy.  Checking
only an unlabelled determinant, or checking eigenvalue agreement on the real
axis without certified pivots, is not a substitute.

There is also an exact pole-complement route.  Put

\[
 y=\|p_-\|^2,\qquad e=p_-/\sqrt y,\qquad
 P=I-|e\rangle\langle e|,                            \tag{5.2}
\]

and decompose

\[
 B_U=
 \begin{bmatrix}a&b^*\\ b&D\end{bmatrix},           \tag{5.3}
\]

where

\[
 a=\langle e,(\mathscr A_--UI)e\rangle-2y,
 \quad b=P\mathscr A_-e,
 \quad D=P(\mathscr A_--UI)P|_{e^\perp}.             \tag{5.4}
\]

The explicit negative pole disappears from `b` and `D`.  If an independent
source estimate proves

\[
 D\succeq\kappa I,\qquad\kappa>0,                    \tag{5.5}
\]

and a source-frozen Krylov solve gives an upper bound

\[
 \langle b,D^{-1}b\rangle\leq X_k<a,                \tag{5.6}
\]

then the completion-of-squares estimate from
`ODD_KRYLOV_TRANSVERSE_CRITICAL_LOAD.md` gives

\[
 \boxed{
 B_U\succeq
 {\min\{a-X_k,\kappa\}
  \over(1+\sqrt{X_k/\kappa})^2}I.}                  \tag{5.7}
\]

Inserting this `delta` into (2.8) produces an entirely source-reconstructed
load reserve.  The independent transverse floor (5.5) remains a real theorem
obligation; Krylov convergence alone cannot create it.

All products in (5.3)--(5.7) must be formed after assembling the combined
archimedean and prime source matrix.  Taking separate absolute block norms
discards the cancellation and is not this certificate.

## 6. Sharpness and mandatory failure cases

The constants in Theorem 2.1 are sharp already for one-dimensional parity
blocks.  Take

\[
 \mathscr A_+=3,\qquad \mathscr A_-=15,
 \qquad p_+=2,\qquad p_-=1.                           \tag{6.1}
\]

Then `w=(2,1)`, a constrained unit vector is proportional to `(1,-2)`, and

\[
 U=\zeta={63\over5},\qquad
 B_U=13-{63\over5}={2\over5}.                        \tag{6.2}
\]

Hence `chi_U=5/2` and

\[
 1+{1\over2\chi_U}=1+{(2/5)\over2}={6\over5}.       \tag{6.3}
\]

The two sector grounds collide exactly at `s_c=6/5`, so both (2.6) and
(2.8) attain equality.

Strict positivity is mandatory.  With

\[
 \mathscr A_+=0,\qquad \mathscr A_-=4,
 \qquad p_+=p_-=1,                                  \tag{6.4}
\]

one has `zeta=2`, `H_-(1)=2`, and `s_c=1`.  Here `B_zeta=0`; reporting a
nonnegative floor as a pass would falsely turn equality at the source load
into a reserve.

The later-pole adversary from the constrained-ground note is also rejected.
For

\[
 \mathscr A_+=\operatorname {diag}(0,10),\quad
 \mathscr A_-=1,\quad p_+=(1,0),\quad p_-=1,          \tag{6.5}
\]

the paired Weyl function is negative again at the loaded even value `z=2`,
but that point lies beyond the odd nonpole pole at `1`.  The constrained
ground is `zeta=1/2`, while

\[
 H_-(1)-\zeta=-1-{1\over2}<0.                        \tag{6.6}
\]

Thus (2.3) fails.  The labelled matrix floor, unlike a bare paired-Weyl sign,
retains the required spectral location.

## 7. Remaining source obligation

For an explicit unbounded schedule `(lambda,N(lambda))`, one must still
construct constrained trials `phi_lambda` and prove a strict source bound

\[
 H_{-,\lambda,N}(1)-U_\lambda I
 \succeq\delta_\lambda I,
 \qquad
 U_\lambda=\langle\phi_\lambda,
                    \mathscr A_{\lambda,N}\phi_\lambda\rangle,
 \qquad \delta_\lambda>0.                            \tag{7.1}
\]

The useful quantitative target is the cancellation-preserving reserve

\[
 {1\over2\langle p_-,B_{U_\lambda}^{-1}p_-\rangle}, \tag{7.2}
\]

or the weaker explicit floor ratio

\[
 {\delta_\lambda\over2\|p_-\|^2}.                   \tag{7.3}
\]

To call the corresponding boundary the first **constrained-ground**
collision, the four first-gap hypotheses in Section 3 must also be proved.
Even a successful finite load reserve would remain only one input to the
residual--gap and projection estimates required by equation (5.2) of
`DIRECT_RH_ATTACK.md`.
