# Screened feedback collapses to the ground origin coefficient

## 0. Claim boundary

This is a finite-dimensional theorem-only note.  It sharpens the screened
identity in `SCREENED_NEAR_NULL_FORCING_RESPONSE.md` by evaluating its
rank-one determinant exactly.  The result is

\[
 \boxed{1-\gamma={\kappa _0\alpha\over\xi _0}
                 ={\kappa _0\over x_0}.}             \tag{0.1}
\]

Here `xi` is a unit simple even ground vector,
`alpha=<kappa,xi>`, `xi_0=<e_0,xi>`, and
`x=xi/alpha` is the coefficient-normalized ground.  Thus the feedback
denominator is not an independent cancellation quantity.  It is exactly the
anchor origin coefficient divided by the coefficient-normalized ground
origin.

This identity does **not** prove the missing actual-source overlap or
alignment estimate.  It proves no shifted-sector sign on an unbounded
schedule, equation (5.2) of `DIRECT_RH_ATTACK.md`, locally uniform
determinant convergence, or the Riemann hypothesis.  The formal state remains
`P0_INVALIDATED`.

No zero table, assumed global Weil positivity, cached eigensystem, or
real-axis determinant substitute is used.  In the arithmetic specialization,
the matrix and forcing always retain the complete pole--archimedean--minus-
prime source, including every prime power `1<n<=lambda^2`.  The locked
conventions remain

\[
 L=2\log\lambda,\qquad
 \widehat f(z)=\int_{-L/2}^{L/2}f(t)e^{-izt}\,dt,
 \qquad JV_n=V_{-n},                                \tag{0.2}
\]

with Lebesgue measure, zero extension, the source-normalized prolate state,
and the `Xi/4` correction applied only where the normalization audit permits.

Throughout, inner products are antilinear in the first variable and linear
in the second.  Adjoint and determinant conjugations below are therefore
essential, even though the locked arithmetic matrices and anchor are real.

## 1. Finite hypotheses and fail-closed gates

Let `H_+` and `H_-` be complex Hilbert spaces of dimensions `N+1` and `N`.
Fix `e_0 in H_+`, a boundary vector `eta`, and a parity derivative
`D:H_+ -> H_-` such that

\[
 \delta(z)=\langle\eta,z\rangle,\qquad
 \delta(e_0)=1,\qquad \ker D=\mathbb C e_0.        \tag{1.1}
\]

Let

\[
 A=Q_+-\mu I,\qquad O=Q_--\mu I                  \tag{1.2}
\]

and assume the exact source commutator

\[
 DA-OD=|\beta\rangle\delta.                       \tag{1.3}
\]

The finite theorem requires all of the following.

1. `A=A*` is positive semidefinite of corank one.  Thus `mu` is a simple
   even ground value.
2. `O=O^*` is invertible.  The arithmetic rate corollary uses the stronger
   gate `O>0`.
3. The ground is boundary visible.  Its boundary-normalized representative
   `Phi` satisfies

   \[
    A\Phi=0,\qquad\delta(\Phi)=1.                  \tag{1.4}
   \]

4. `kappa` is a unit vector, `K=kappa^perp`, and

   \[
    \kappa _0=\langle e_0,\kappa\rangle\ne0,
    \qquad p=\langle\kappa,\Phi\rangle\ne0,
    \qquad \Phi _0=\langle e_0,\Phi\rangle\ne0.  \tag{1.5}
   \]

5. The compression

   \[
    B=P_{\mathcal K}A|_{\mathcal K}               \tag{1.6}
   \]

   is positive definite.  This follows from items 1 and 4, but is retained
   as an explicit implementation gate.
6. For `H_0=ker(delta)`, the locked boundary primitive

   \[
    D_0=D|_{\mathcal H_0}:\mathcal H_0\longrightarrow H_- \tag{1.7}
   \]

   is an isomorphism, and the source relative-determinant identity

   \[
    \det O=\langle\eta,\operatorname {adj}(A)e_0\rangle
                                                               \tag{1.8}
   \]

   holds.

Under these hypotheses `D|_K` is an isomorphism: a vector in its kernel is
a multiple of `e_0`, and membership in `K` then forces that multiple to
vanish because `kappa_0!=0`.

Every division and inverse below is conditional on these finite gates.  A
singular `O`, `B`, `D_0`, or `D|_K`; a multiple even ground; a boundary-
invisible ground; or a zero `kappa_0`, `p`, or `Phi_0` is a failed branch,
not a limiting pass.  A nonpositive odd complementary gap is likewise not a
rate-certificate branch.  One determinant sign is never substituted for an
inertia check.

## 2. Screened transport and its complex determinant

Define the oblique projection onto `K` along the ground line by

\[
 P_{\kappa,\Phi}z
 =z-\Phi{\langle\kappa,z\rangle\over p}            \tag{2.1}
\]

and the screened odd primitive

\[
 \mathcal R=P_{\kappa,\Phi}D_0^{-1}O^{-1}:H_-\to K.
                                                               \tag{2.2}
\]

In the block chart `H_+=C kappa direct-sum K`, put

\[
 b=P_KA\kappa,\qquad u=\mathcal R D\kappa,
 \qquad \gamma=\langle u,b\rangle.                \tag{2.3}
\]

The screened transport theorem gives

\[
 I_K=\mathcal R(D|_K)B+u b^*,\qquad
 b^*z=\langle b,z\rangle.                         \tag{2.4}
\]

Because `b^*u=<b,u>=overline(gamma)`, the complex matrix determinant lemma
gives

\[
 \boxed{
  \det\!\bigl(\mathcal R(D|_K)B\bigr)
   =1-\overline\gamma.}                           \tag{2.5}
\]

It would be wrong to put `1-gamma` on the right of (2.5) before taking the
complex conjugate.

## 3. The oblique derivative determinant `G`

Set

\[
 G=P_{\kappa,\Phi}D_0^{-1}(D|_K):K\to K.          \tag{3.1}
\]

### Lemma 3.1 (exact `G` determinant)

For every `z in K`,

\[
 \boxed{
 Gz=z+\left({\overline{\kappa _0}\over p}\Phi-e_0\right)
                 \delta(z),
 \qquad
 \det G={\overline{\kappa _0}\over p}.}          \tag{3.2}
\]

**Proof.**  Since `delta(e_0)=1`,

\[
 D_0^{-1}Dz=z-\delta(z)e_0.                       \tag{3.3}
\]

Moreover `z perpendicular kappa` gives

\[
 \langle\kappa,z-\delta(z)e_0\rangle
 =-\overline{\kappa _0}\,\delta(z).              \tag{3.4}
\]

Applying (2.1) proves the vector formula.  Its rank-one perturbation vector
lies in `K`, and the determinant lemma gives

\[
 1+\delta\!\left({\overline{\kappa _0}\over p}\Phi-e_0\right)
 ={\overline{\kappa _0}\over p},                 \tag{3.5}
\]

using `delta(Phi)=delta(e_0)=1`.  \(\square\)

Both the bar on `kappa_0` and the unbarred source overlap
`p=<kappa,Phi>` are forced by the antilinear-first convention.

## 4. Source-relative determinant and exact feedback phase

The source identity (1.8) and boundary normalization imply

\[
 \boxed{\operatorname {adj}(A)e_0=(\det O)\Phi.}  \tag{4.1}
\]

Indeed, both sides lie on the one-dimensional ground line and have the same
boundary value.  Since `A` is Hermitian of corank one, `adj(A)` is Hermitian
of rank one; since the self-adjoint invertible `O` has real nonzero
determinant, (4.1) consequently makes `Phi_0` real.  Compression to the unit
anchor complement gives

\[
 \boxed{
  \det B=\langle\kappa,\operatorname {adj}(A)\kappa\rangle
        ={\det(O)|p|^2\over\Phi _0}.}              \tag{4.2}
\]

Self-adjointness of `O` makes `det(O)` real.  Under `O>0`, positivity of `B`
makes `Phi_0>0`.  Without the odd positivity gate, (4.2) is still an
algebraic identity but supplies no inertia statement.

Choose arbitrary bases in the intermediate `N`-dimensional spaces.  The
basis-dependent determinants of `P_{kappa,Phi}D_0^(-1)` and `D|_K` cancel
between the two compositions, so

\[
\begin{aligned}
 \det\!\bigl(\mathcal R(D|_K)B\bigr)
 &=\det(G){\det B\over\det O}\\
 &={\overline{\kappa _0}\over p}
   {|p|^2\over\Phi _0}
  ={\overline{\kappa _0p}\over\Phi _0}.          \tag{4.3}
\end{aligned}
\]

Combining (2.5) and (4.3), and then conjugating, proves the main theorem.

### Theorem 4.1 (feedback--origin collapse)

Under all hypotheses of Section 1,

\[
 \boxed{
  1-\overline\gamma={\overline{\kappa _0p}\over\Phi _0},
  \qquad
  1-\gamma={\kappa _0p\over\Phi _0}.}             \tag{4.4}
\]

Let `xi` be any unit vector on the ground line and put

\[
 \alpha=\langle\kappa,\xi\rangle,qquad
 \xi _0=\langle e_0,\xi\rangle.                  \tag{4.5}
\]

Then `alpha` and `xi_0` are nonzero and

\[
 \boxed{1-\gamma={\kappa _0\alpha\over\xi _0}.} \tag{4.6}
\]

Equivalently, for the coefficient-normalized ground

\[
 x={\Phi\over p}={\xi\over\alpha},qquad
 \langle\kappa,x\rangle=1,qquad x_0=\langle e_0,x\rangle,
                                                               \tag{4.7}
\]

one has

\[
 \boxed{1-\gamma={\kappa _0\over x_0}.}           \tag{4.8}
\]

**Proof.**  If `d=delta(xi)`, then `Phi=xi/d`,
`p=alpha/d`, and `Phi_0=xi_0/d`.  Their quotient in (4.4) is therefore
`alpha/xi_0`.  Equation (4.8) is the same identity after division by
`alpha`.  \(\square\)

Thus nonvanishing of the finite feedback determinant is no longer a separate
mystery under the stated gates.  Quantitative control is exactly origin and
ground-overlap control.  In particular, a claimed feedback reserve which
does not account for the decay of `kappa_0` is misnormalized.

## 5. Adjoint transport collapses the complete source amplitude

Taking adjoints in (2.4) and applying the result to `b` gives

\[
 D_K^*\mathcal R^*b=(1-\gamma)B^{-1}b,
 \qquad D_K=D|_K.                                  \tag{5.1}
\]

The coefficient-normalized ground equation is

\[
 x=\kappa-B^{-1}b.                                \tag{5.2}
\]

Consequently, for every `z in K`,

\[
\begin{aligned}
 \langle\mathcal R Dz,b\rangle
 &=\langle z,D_K^*\mathcal R^*b\rangle\\
 &=-(1-\gamma)\langle z,x\rangle\\
 &=\boxed{-{\kappa _0\over\xi _0}\langle z,\xi\rangle}.
                                                               \tag{5.3}
\end{aligned}
\]

In the arithmetic specialization the left side is the complete source
amplitude

\[
 \mathfrak F_\lambda(\mathcal R Dz)
 =-\int_0^L G_\lambda(t)
       \left(e^{-t/2}q_{\mathcal R Dz}(t)\right)'dt,            \tag{5.4}
\]

where

\[
 G_\lambda(t)=e^t-\psi_C(e^t)
 -{1\over2}\log(1-e^{-2t}).                       \tag{5.5}
\]

The function `psi_C` is right-continuous and includes the endpoint
`n=lambda^2` when it is a prime power.  Formula (5.3) is obtained only after
the pole, archimedean, and minus-prime terms have been combined.  It does not
authorize three separate absolute estimates.

If `Lcal` is any subspace of `K`, (5.1)--(5.3) also give the vector identity

\[
 \boxed{
 P_{\mathcal L}D_K^*\mathcal R^*b
 =-{\kappa _0\over\xi _0}P_{\mathcal L}\xi.}     \tag{5.6}
\]

This is the adjoint transport collapse: the screened forcing vector is
exactly the projected ground vector times one origin scalar.

## 6. Exact cluster identity

Let `(r_j)` be the Euclidean orthonormal generalized right modes in
`Lcal`, with positive generalized eigenvalues `theta_j`, as in the harmonic
Schur construction.  Define

\[
 a_j=\langle r_j,B^{-1}b\rangle,qquad
 c_j=\langle\mathcal R D r_j,b\rangle.             \tag{6.1}
\]

Equations (4.6), (5.2), and (5.3) give, mode by mode,

\[
 \boxed{
 a_j=-{\langle r_j,\xi\rangle\over\alpha},
 \qquad
 c_j=-{\kappa _0\over\xi _0}\langle r_j,\xi\rangle,
 \qquad
 (1-\gamma)a_j=c_j.}                              \tag{6.2}
\]

For `tau>0`, let `P_<=tau^r` be the orthogonal projector onto the span of
the modes with `theta_j<=tau`.  Then the low screened term is not merely
bounded by the projective ground mass; it is identical to it:

\[
 \boxed{
 {\sum_{\theta_j\leq\tau}|c_j|^2\over|1-\gamma|^2}
 ={\|P_{\leq\tau}^rP_{\mathcal L}\xi\|^2\over|\alpha|^2}.}
                                                               \tag{6.3}
\]

For the full cluster,

\[
 \boxed{
 A_M={\|P_{\mathcal L}\xi\|^2\over|\alpha|^2}.} \tag{6.4}
\]

The complementary forcing energy is likewise

\[
 \boxed{
 \beta_0=\sum_j\theta_j|a_j|^2
 ={1\over|\alpha|^2}
   \sum_j\theta_j|\langle r_j,\xi\rangle|^2.}    \tag{6.5}
\]

Therefore screening supplies no additional low-cluster cancellation beyond
ground orientation.  Any useful low-cluster rate is exactly a projective
ground-alignment statement, and the complementary-energy estimate remains a
separate weighted version of that same arithmetic geometry.

## 7. Actual anchor-origin corollary

For the locked projected source-normalized prolate anchor, let
`kappa_0=<e_0,kappa>`.  The origin functional in
`PROJECTED_ANCHOR_ORIGIN_JET_AND_ONE_HEIGHT_GATE.md` satisfies exactly

\[
 \ell_0(\kappa)=\sqrt L\,\kappa _0.                \tag{7.1}
\]

On every admitted integer schedule

\[
 {N(\lambda)\over L^{7/5}}\longrightarrow\infty, \tag{7.2}
\]

the existing qualitative theorem gives

\[
 \sqrt L\,\kappa _0\longrightarrow
 K_\infty:={\Xi(0)\over4a_\infty}>0.             \tag{7.3}
\]

### Corollary 7.1 (subpolynomial overlap implies subpolynomial feedback)

Assume the finite hypotheses of Section 1 at every point of a common
unbounded schedule, require the rate-branch gate `O>0`, and assume
additionally

\[
 |\alpha|^{-1}=\lambda^{o(1)}.                    \tag{7.4}
\]

Then

\[
 \boxed{|1-\gamma|^{-1}=\lambda^{o(1)}.}          \tag{7.5}
\]

More explicitly, for every fixed `0<epsilon<K_infinity` and all sufficiently
large schedule points,

\[
 |1-\gamma|^{-1}
 ={|\xi_0|\over|\kappa_0||\alpha|}
 \leq {\sqrt L\over(K_\infty-\epsilon)|\alpha|}. \tag{7.6}
\]

**Proof.**  Unit normalization gives `|xi_0|<=1`; (7.3) supplies the lower
bound for `|kappa_0|`; and `sqrt(L)=lambda^(o(1))`.  \(\square\)

This is the strongest feedback conclusion supplied by the currently
admitted theorems.  It does not give a uniform positive constant reserve:
the known anchor coefficient itself is asymptotic to
`K_infinity/sqrt(L)`.  More importantly, no admitted actual-source theorem
proves (7.4).  Checkpoint 0.74 identifies (7.4) with the still-open canonical
mixed-projector overlap lower bound.  The feedback denominator has therefore
collapsed into an already isolated arithmetic obligation; it has not solved
that obligation.

## 8. Exact adversarial regressions

### 8.1 A Gaussian-rational complex phase fixture

The complex phase in (4.4) is testable without transcendental arithmetic.
Take

\[
 A={1\over5}\begin{pmatrix}1&2\\2&4\end{pmatrix},
 \quad O={2\over5},\quad D=(0,1),\quad
 \eta=(1,1),\quad\beta={2\over5},                \tag{8.1}
\]

so that `DA-OD=beta eta*`.  The boundary-normalized ground is
`Phi=(2,-1)`, with `Phi_0=2`, and

\[
 \operatorname {adj}(A)e_0=O\Phi.                \tag{8.2}
\]

Let

\[
 q={3+4i\over5},\qquad
 \kappa=q\left({3\over5},{4i\over5}\right),
 \qquad w=\left({4i\over5},{3\over5}\right).     \tag{8.3}
\]

Then `kappa` and `w` are unit, `w perpendicular kappa`, and exact arithmetic
in `Q(i)` gives

\[
 B={52\over125},\qquad
 \det G={9-6i\over26},\qquad
 {\det B\over\det O}={26\over25},                \tag{8.4}
\]

and hence

\[
 1-\overline\gamma={9-6i\over25},\qquad
 \gamma={16-6i\over25},\qquad
 1-\gamma={9+6i\over25}
 ={\kappa_0\langle\kappa,\Phi\rangle\over\Phi_0}.
                                                               \tag{8.5}
\]

Replacing `1-overline(gamma)` by `1-gamma` in the determinant, replacing
`overline(kappa_0)` by `kappa_0` in `det G`, or reversing
`<kappa,Phi>` to `<Phi,kappa>` fails this exact fixture.  The common phase
`q` also verifies that the final product in (4.4) is gauge invariant.

This is a finite commutator fixture, not a pinned arithmetic Weil matrix.

### 8.2 Exact nonzero-displacement source-Cauchy family

Fix `epsilon>0` and use the exact `N=1` source-Cauchy data

\[
 Q_+={\varepsilon\over5}
       \begin{pmatrix}1&2\\2&4\end{pmatrix},
 \quad
 Q_-={\varepsilon(4-2\sqrt2)\over5}>0,
 \quad D=(0,1),\quad\eta=(1,\sqrt2),
 \quad\beta={2\varepsilon\over5}.                \tag{8.6}
\]

These blocks come from

\[
 a_0={\varepsilon\over5},\quad
 a_1={\varepsilon(4-\sqrt2)\over5},\quad
 b_1^{\rm C}={\sqrt2\varepsilon\over5},\quad
 b_{-1}^{\rm C}=-b_1^{\rm C},                    \tag{8.7}
\]

through `Q_nm=(b_n^C-b_m^C)/(n-m)` off the diagonal.  Thus inversion and
the nonzero source displacement are exact.  The unit ground is

\[
 \xi={1\over\sqrt5}(-2,1),\qquad
 \xi_0=-{2\over\sqrt5},                           \tag{8.8}
\]

and its boundary value is nonzero.

For a rational parameter `s>0`, define the rational unit-circle anchor and
its complement by

\[
 \kappa_s=(k_0,k_1)
 =\left({2s\over1+s^2},{1-s^2\over1+s^2}\right),
 \qquad r_s=(-k_1,k_0).                            \tag{8.9}
\]

Put

\[
 d_s=k_1-2k_0,\qquad e_s=2k_1+k_0.                \tag{8.10}
\]

Whenever `s!=0` and `d_s!=0`, every finite gate above holds and exact
calculation gives

\[
\begin{aligned}
 B_s&={\varepsilon d_s^2\over5},
 &\alpha_s&={d_s\over\sqrt5},\\
 1-\gamma_s&=-{k_0d_s\over2},
 &c_s&={k_0e_s\over2},\\
 a_s&={c_s\over1-\gamma_s}=-{e_s\over d_s},
 &A_M&={e_s^2\over d_s^2}.                        \tag{8.11}
\end{aligned}
\]

At `s=1/3` this is the checkpoint-0.74 fixture

\[
 1-\gamma={3\over25},\qquad c={33\over50},
 \qquad a={11\over2},\qquad A_M={121\over4}.     \tag{8.12}
\]

For rational `s->0`, both `1-gamma_s` and `c_s` tend to zero while
`a_s->-2` and `A_M->4`.  For rational `s` tending to the positive root of
`1-s^2-4s=0`, the overlap `alpha_s` tends to zero and `A_M` diverges.  Thus
even the exact source-Cauchy class, strict odd sign, simple global even
ground, nonzero displacement, and complete determinant identities provide
neither a uniform feedback reserve nor the missing overlap/alignment rate.

This family is a logical source-class countermodel.  Its coefficients are
not the pinned pole, gamma, and prime-power coefficients, and its anchors are
not asserted to be the projected prolate anchors.

## 9. Remaining arithmetic statement

The screened near-null bottleneck now has no independent denominator lemma.
On the actual projected-anchor schedule it reduces exactly to two source
orientation questions:

\[
 |\alpha|^{-1}=\lambda^{o(1)},
 \qquad
 {\|P_{\leq\tau}^rP_{\mathcal L}\xi\|^2\over|\alpha|^2}
     =O(\lambda^{-1})                              \tag{9.1}
\]

with the separately weighted complementary version encoded by (6.5).  The
first gives the subpolynomial feedback loss through Corollary 7.1; the second
is exactly the low-cluster projective alignment rate.  Neither follows from
the determinant, the Herglotz/odd-resolvent structure, source whitening, or
the finite source-Cauchy identities currently admitted.
