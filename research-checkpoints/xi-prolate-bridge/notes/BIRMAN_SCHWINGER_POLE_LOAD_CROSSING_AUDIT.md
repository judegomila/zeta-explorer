# Birman--Schwinger pole-load crossing: exact sector criterion and sharp obstruction

## 0. Scope and result

This note attacks the missing simple-even/odd-sector premise at the exact
physical decomposition isolated in
`notes/POSITIVITY_IMPROVING_SOURCE_GROUND_OBSTRUCTION.md` and
`notes/POLE_DELETED_SCALAR_RESERVE_GATE.md`.  It gives an eigenvector-free
two-resolvent formulation and a sharp monotonicity theorem for the two pole
signs.

The conclusion is a reduction and an obstruction, not the missing source
sign theorem.  In the continuum, positivity improvement of the nonpole
Levy operator starts the ground in the even sector when the pole load is
zero; a finite Fourier compression still needs the corresponding nonpole
parity order to be proved.  Once that order holds, the positive even pole
and negative odd pole move the two sector grounds monotonically toward a
crossing.  At the crossing the two Birman--Schwinger functions satisfy one
exact scalar identity.  Thus the actual arithmetic task is to prove that
the source pole load lies before that crossing.

A universal comparison using only the nonpole parity gap and the two pole
norms is proved, with its best possible constant.  A two-point irreducible
killed-jump Dirichlet model, using the exact source hyperbolic pole norms,
attains equality and has an even, double, or odd ground according to which
side of the comparison it lies.  Therefore no stronger conclusion follows
from nonpole positivity improvement, nonpole even-ground order, interval
symmetry, and the exact opposite pole signs alone.

The model is not the arithmetic source operator.  No zeta zero is assumed
real, no zero table or global Weil positivity is used, and no numerical
agreement is promoted to a theorem.  Neither shifted source sector sign,
equation (5.2) of `DIRECT_RH_ATTACK.md`, nor a determinant limit is proved.
The formal project state remains `P0_INVALIDATED`.

## 1. Locked pole-deleted blocks

Fix a finite source compression and remove the common scalar `m_0`.  In the
two inversion sectors write the exact decomposition as

\[
 H_+(1)=\mathscr A_++2|p_+\rangle\langle p_+|,
 \qquad
 H_-(1)=\mathscr A_--2|p_-\rangle\langle p_-|.       \tag{1.1}
\]

Here `mathscr A_+` and `mathscr A_-` are the parity compressions of the
same positive nonpole Bernstein--Levy form, including the archimedean
Levy density and every prime-power atom `n<=lambda^2`.  The prime block has
not had its source sign changed: its negative multiplier contribution is
what becomes the positive translation energy in `mathscr A`.  The finite
vectors are the mandatory projections of

\[
 p_+(x)=\cosh(x/2),\qquad p_-(x)=\sinh(x/2)          \tag{1.2}
\]

from the source interval

\[
 I=[-\ell,\ell],\qquad \ell=\log\lambda.             \tag{1.3}
\]

To expose what the structural information does and does not decide,
introduce a common pole load `s>=0`:

\[
 \boxed{
 H_+(s)=\mathscr A_++2s|p_+\rangle\langle p_+|,
 \qquad
 H_-(s)=\mathscr A_--2s|p_-\rangle\langle p_-|.}     \tag{1.4}
\]

The source is the single value `s=1`; varying `s` is an algebraic audit,
not a change of source normalization.  Put

\[
 a_\pm=\lambda_{\min}(\mathscr A_\pm),\qquad
 z_\pm(s)=\lambda_{\min}(H_\pm(s)),\qquad
 G(s)=z_-(s)-z_+(s).                                  \tag{1.5}
\]

The desired parity comparison at the nonpole-relative level is `G(1)>0`.
If `z_+(1)` is simple, this also places the simple even line below the odd
sector; the separate even-complement simplicity premise is still required.

## 2. Two exact secular equations

For real `z` off the corresponding nonpole spectrum define

\[
 F_\pm(z)=
 \langle p_\pm,(\mathscr A_\pm-zI)^{-1}p_\pm\rangle.
                                                               \tag{2.1}
\]

The matrix determinant lemma gives the two exact identities

\[
 \boxed{
 \det(H_+(s)-zI)
 =\det(\mathscr A_+-zI)\{1+2sF_+(z)\},}             \tag{2.2}
\]

\[
 \boxed{
 \det(H_-(s)-zI)
 =\det(\mathscr A_--zI)\{1-2sF_-(z)\}.}             \tag{2.3}
\]

Also

\[
 F_\pm'(z)=
 \|(\mathscr A_\pm-zI)^{-1}p_\pm\|^2>0             \tag{2.4}
\]

unless the pole vector is zero.  Hence, on the nonexceptional branch where
the relevant ground has nonzero pole overlap:

* `z_-(s)` is the unique root below `a_-` of
  `1-2sF_-(z)=0`;
* `z_+(s)`, when it does not coincide with an unshifted nonpole eigenvalue,
  is the first post-`a_+` root of `1+2sF_+(z)=0`.

This is the promised eigenvector-free reconstruction.  Exceptional
nonpole eigenvalues orthogonal to a pole vector remain unchanged and must
be compared directly; declaring them absent without proof would assume a
cyclicity statement not supplied by the source.

Now let `z=z_+(s)`.  The odd sector lies strictly above the even ground if
and only if

\[
 \boxed{
 \mathscr A_--zI\succ0,
 \qquad
 \delta_-(s;z):=1-2sF_-(z)>0.}                    \tag{2.5}
\]

This is the exact physical Birman--Schwinger condition, with the spectral
parameter fixed by the even secular equation

\[
 \boxed{1+2sF_+(z)=0.}                            \tag{2.6}
\]

Equations (2.5)--(2.6) are stronger as a formulation than inspecting two
independently computed lowest eigenvalues: both resolvents are reconstructed
from the pole-deleted source blocks and the projected source Riesz vectors.
They do not, by themselves, sign `delta_-`.

## 3. Pole-load monotonicity and the crossing identity

### Theorem 3.1 (monotone sector collision)

The functions `z_+(s)` and `z_-(s)` are respectively nondecreasing and
nonincreasing on `s>=0`.  Therefore `G(s)` is nonincreasing.  On every
simple branch on which both pole overlaps are nonzero,

\[
 z_+'(s)=2|\langle p_+,u_+(s)\rangle|^2,
 \qquad
 z_-'(s)=-2|\langle p_-,u_-(s)\rangle|^2,          \tag{3.1}
\]

and hence

\[
 \boxed{
 G'(s)=-2\bigl(
 |\langle p_-,u_-(s)\rangle|^2+
 |\langle p_+,u_+(s)\rangle|^2\bigr)<0.}          \tag{3.2}
\]

If `a_->a_+` and `p_-` is nonzero, then `G(0)>0` while
`G(s)<0` for all sufficiently large `s`.  Thus at least one sector crossing
occurs; under the strict-overlap hypothesis it is unique.

**Proof.**  The two form differences between pole loads `s_2>s_1` are
positive and negative semidefinite, respectively, so min--max proves the
weak monotonicity.  Formula (3.1) is Hellmann--Feynman and implies (3.2).
Finally, the Rayleigh quotient on `p_-` gives

\[
 z_-(s)\leq
 {\langle p_-,\mathscr A_-p_-\rangle\over\|p_-\|^2}
 -2s\|p_-\|^2\longrightarrow-\infty,             \tag{3.3}
\]

whereas `z_+(s)>=a_+`.  Continuity completes the proof.  \(\square\)

At a nonexceptional crossing `z_+(s_c)=z_-(s_c)=z_c`, equations
(2.2)--(2.3) give

\[
 F_+(z_c)=-{1\over2s_c},\qquad
 F_-(z_c)= {1\over2s_c}.                           \tag{3.4}
\]

Therefore

\[
 \boxed{
 F_+(z_c)+F_-(z_c)=0,
 \qquad
 s_c={1\over2F_-(z_c)}=-{1\over2F_+(z_c)}.}       \tag{3.5}
\]

This paired-resolvent identity is the smallest exact scalar crossing
equation.  On a source compression for which `G(0)>0` and the
nonexceptional strict-overlap branch has been proved, the required sector
order is precisely that its unit load lies before the first crossing:

\[
 \boxed{s_c>1.}                                    \tag{3.6}
\]

Along a simple even branch that remains below `a_-`, the live
Birman--Schwinger margin is itself strictly decreasing:

\[
 {d\over ds}\delta_-(s;z_+(s))
 =-2F_-(z_+)-2sF_-'(z_+)z_+'(s)<0.                 \tag{3.7}
\]

Thus continuation in pole strength cannot turn one finite positive check
into an unbounded source theorem without a quantitative lower bound on the
crossing load.  There is likewise no monotonicity in `lambda` here:
`mathscr A_\pm`, the interval, the prime inventory, the compression, and
both Riesz vectors all change with `lambda`.

## 4. The sharp norm-gap comparison

Let

\[
 \Delta_{\mathscr A}=a_--a_+.                         \tag{4.1}
\]

Weyl's inequalities and a trial vector in the nonpole even ground give

\[
 z_-(s)\geq a_--2s\|p_-\|^2,
 \qquad
 z_+(s)\leq a_++2s\|p_+\|^2.                       \tag{4.2}
\]

Consequently

\[
 \boxed{
 \Delta_{\mathscr A}>
 2s\bigl(\|p_+\|^2+\|p_-\|^2\bigr)
 \quad\Longrightarrow\quad G(s)>0.}              \tag{4.3}
\]

For the full source Riesz vectors on `[-ell,ell]`,

\[
 \|p_+\|^2=\sinh\ell+\ell,
 \qquad
 \|p_-\|^2=\sinh\ell-\ell,                       \tag{4.4}
\]

so the right side of (4.3) is

\[
 4s\sinh\ell=2s(\lambda-\lambda^{-1}).             \tag{4.5}
\]

Orthogonal finite projection can only reduce the two norms.  Thus (4.5) is
a valid, completely explicit sufficient threshold for every locked finite
compression.  It is not asserted for the actual source: no available
source estimate proves the nonpole parity gap in (4.1) exceeds (4.5) on an
unbounded schedule.

### Theorem 4.1 (sharpness from an irreducible killed-jump model)

The coefficient `2` multiplying the sum of squared pole norms in (4.3) is
best possible under the stated structural data.

**Proof.**  On a symmetric two-point space use the pointwise cone, let `J`
exchange the two points, and set

\[
 \mathscr A=
 \begin{pmatrix}\kappa+j&-j\\-j&\kappa+j\end{pmatrix},
 \qquad \kappa\geq0,\quad j>0.                    \tag{4.6}
\]

Its form is

\[
 \langle u,\mathscr Au\rangle
 =\kappa(|u_1|^2+|u_2|^2)+j|u_1-u_2|^2,            \tag{4.7}
\]

so it is a killed-jump Dirichlet form.  Moreover

\[
 e^{-t\mathscr A}={e^{-\kappa t}\over2}
 \begin{pmatrix}
 1+e^{-2jt}&1-e^{-2jt}\\
 1-e^{-2jt}&1+e^{-2jt}
 \end{pmatrix}                                    \tag{4.8}
\]

has strictly positive entries for every `t>0`; the semigroup is positivity
improving and its simple ground is even.

With normalized parity vectors `e_+` and `e_-`, choose pole vectors with
the exact source norms

\[
 p_+=\sqrt{\sinh\ell+\ell}\,e_+,
 \qquad
 p_-=\sqrt{\sinh\ell-\ell}\,e_-.                  \tag{4.9}
\]

The nonpole sector grounds and the loaded sector grounds are exactly

\[
 a_+=\kappa,qquad a_-=\kappa+2j,                  \tag{4.10}
\]

\[
 z_+(s)=\kappa+2s(\sinh\ell+\ell),
 \qquad
 z_-(s)=\kappa+2j-2s(\sinh\ell-\ell).             \tag{4.11}
\]

Therefore

\[
 \boxed{G(s)=2j-4s\sinh\ell.}                     \tag{4.12}
\]

The ground is even, double across parity, or odd according as
`2j` is greater than, equal to, or less than `4s sinh(ell)`.  Equality in
(4.2) holds on both sides, proving sharpness.  \(\square\)

This counterfamily retains all of the following features:

* a positive irreducible nonpole Dirichlet form;
* a positivity-improving nonpole semigroup and simple even nonpole ground;
* exact inversion parity;
* the exact positive-even and negative-odd rank-one pole signs;
* the exact full-interval hyperbolic norms of the source pole vectors.

Yet it realizes all three possible loaded parity outcomes.  It is not the
arithmetic Bernstein--Levy measure and therefore says nothing adverse about
the actual source matrices.  Its logical consequence is sharp: any proof
of `s_c>1` must use source-specific information beyond those five features,
for example a cancellation-preserving comparison of the two arithmetic
resolvents in (3.5).

## 5. What remains for the arithmetic source

The exact finite target can now be stated without a ground eigenvector,
provided the secular branch is first certified to be the loaded even
ground.  Thus every unchanged nonpole eigenvalue orthogonal to `p_+` must
either be excluded by a proved cyclicity statement or compared directly.
For one explicit unbounded schedule, assemble the source-pinned nonpole
blocks and projected pole vectors, perform that exceptional-eigenvalue
check, and locate the loaded even ground root `z` from

\[
 1+2F_+(z)=0,                                      \tag{5.1}
\]

and prove, by source-level inequalities rather than sampled eigenvalue
agreement,

\[
 \boxed{
 \mathscr A_--zI\succ0,
 \qquad 1-2F_-(z)>0.}                              \tag{5.2}
\]

The first inequality locates the certified even ground root below the
unperturbed odd floor; the second proves that the negative odd pole has not
crossed it.  Subject to the exceptional-eigenvalue check above, together
they are equivalent to the physical Birman--Schwinger condition already
identified in the source-ground obstruction note.  Equation (3.5) adds the
sharp boundary of validity and Theorem 4.1 proves why positivity improvement
alone cannot sign it.

Even after (5.2), the source program must still prove simplicity and the
strict even-complement sign at the required shifted state, and then the
real-axis ground-transfer estimate.  None of those assertions is inferred
here.
