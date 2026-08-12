# Polynomial--Xi radical tower and fixed-window covariance-floor obstruction

## 0. Scope and exact outcome

This note audits the proposed use of all source-normalized prolate
corrections as one growing transverse radical block.  It proves an exact
limiting obstruction and finite-dimensional identities.  It does **not**
prove a growing-order transfer to a finite prolate schedule, either shifted
sector sign, the residual-ridged soft-trace target, locally uniform
determinant convergence, or the Riemann hypothesis.

There are four conclusions.

1. If

   \[
   G_j(x)={\cal E}(g_j)(e^x)
   \]

   is the (j)-th source-normalized correction from
   `ALL_ORDER_PROLATE_ARITHMETIC_FLATNESS.md`, then

   \[
   \boxed{\widehat G_j(t)=P_j(t^2)\Xi(t),\qquad
          \deg P_j=j,}                                  \tag{0.1}
   \]

   with a nonzero leading coefficient.  Constants, including the factor
   (1/4) at (j=0), are absorbed into (P_j).  Thus the first (d)
   corrections span exactly the polynomial--Xi space of degree less than
   (d).

2. On the anchor-orthogonal part of that **full prefix**, the fixed-window
   covariance floor necessarily collapses.  If

   \[
   \gamma_d(T)=\inf_{0\ne F\in {\cal R}_d\cap K_\infty^\perp}
   {\int_{-T}^T|\widehat F(t)|^2dt
    \over\int_{\mathbb R}|\widehat F(t)|^2dt},
   \qquad {\cal R}_d=\operatorname{span}\{G_0,\ldots,G_{d-1}\}, \tag{0.2}
   \]

   then, for every fixed (T>0),

   \[
   \boxed{\lim_{d\to\infty}\gamma_d(T)^{1/d}=0.}       \tag{0.3}
   \]

   In particular no orthonormal basis (Z_d) of the complete transverse
   prefix can satisfy (Z_d^*K_TZ_d\succeq cI) with one fixed (c>0).

3. Equation (0.3) does not forbid a carefully selected covariance-filtered
   subspace.  In fact polynomial--Xi radicals are dense in the even
   (L^2) space, so arbitrary fixed-dimensional, well-observed blocks
   exist.  What is missing is a quantitative construction with dimension
   comparable to (L), controlled finite-window Weil graph norm, and a
   complementary-covariance estimate.  Density in (L^2) supplies none of
   those rates.

4. The correct finite diagnostic is the joint raw pencil, not separate
   covariance and energy floors.  For a projected tower synthesis (U),
   put

   \[
   G=U^*U,\qquad C=U^*K_TU,\qquad H=U^*BU.              \tag{0.4}
   \]

   Then the exact block contribution to the soft trace is

   \[
   \boxed{{\cal L}_U(r)=r\operatorname{tr}
          \{C(H+rG)^{-1}\}.}                           \tag{0.5}
   \]

   This scalar is invariant under every invertible mixing or rescaling of
   the source columns.  A finite block pilot should serialize the three raw
   matrices and (0.5), together with the tilted complementary miss described
   in Section 6.

The Fourier transform in this note is

\[
 \widehat f(t)=\int_{\mathbb R}f(x)e^{-itx}\,dx,
 \qquad
 \|f\|_2^2={1\over2\pi}\int_{\mathbb R}|\widehat f(t)|^2dt. \tag{0.6}
\]

All global radicals use the locked source normalization.  No list of zeta
zeros and no global Weil-positivity assumption is used.  The formal project
state remains `P0_INVALIDATED`.

## 1. Triangular Mellin identification of the correction tower

The all-order recursion gives

\[
 g_j\in\operatorname{span}\{h_0,h_4,\ldots,h_{4j+4}\}, \tag{1.1}
\]

and the coefficient of (h_{4j+4}) is nonzero.  The latter is the unique
raising path displayed in equation (2.9) of
`GEVREY_PROLATE_EXPONENTIAL_REMAINDER_AUDIT.md`; formal normalization and
the label-zero branch cannot cancel it.

For (q\geq0), direct integration of the Hermite polynomial gives

\[
 \int_0^\infty h_{4q}(x)x^{s-1}dx
 =\pi^{-s/2}\Gamma(s/2)R_q(s),                         \tag{1.2}
\]

where (R_q) is a polynomial of degree (2q) with nonzero leading
coefficient.  Hence the Mellin transform of (g_j) has the same form with a
polynomial of degree exactly (2j+2).

Every (g_j) is Fourier invariant and satisfies

\[
 g_j(0)=0,\qquad\int_{\mathbb R}g_j=0.                 \tag{1.3}
\]

The two conditions give the factors (s(s-1)), while Fourier invariance
makes the remaining quotient invariant under (s\mapsto1-s).  It is
therefore a polynomial of degree (j) in
((s-1/2)^2).  Inserting (s=1/2-it) into the locked Mellin factorization

\[
 \widehat{{\cal E}(g_j)}(t)
 =\zeta(1/2-it)m_{g_j}(t)                              \tag{1.4}
\]

and comparing with the completed zeta factor proves (0.1).  The unique
highest Hermite coefficient proves that the leading coefficient of (P_j)
does not vanish.

Consequently

\[
 \boxed{
 \widehat{{\cal R}_d}
 =\{p(t^2)\Xi(t):p\in\mathbb C[y],\ \deg p<d\}.}       \tag{1.5}
\]

This is a triangular span identity.  It neither asserts convergence of the
formal prolate series nor divides by a beyond-all-orders finite residual.

## 2. The limiting covariance measure

Constants in Plancherel ratios are irrelevant, so put

\[
 d\mu(t)=|\Xi(t)|^2dt,
 \qquad M_n=\int_{\mathbb R}t^{2n}d\mu(t).             \tag{2.1}
\]

The completed gamma factor and an unconditional polynomial vertical-line
bound for zeta give

\[
 |\Xi(t)|\leq C(1+|t|)^C e^{-\pi|t|/4}.               \tag{2.2}
\]

Thus every (M_n) is finite and (mu) has a nontrivial exponential
moment.  Since (Xi) is an entire function which is not identically zero,
its real zero set is discrete and the support of (mu) is unbounded.

The anchor (K_\infty) corresponds to the constant polynomial because

\[
 \widehat K_\infty(t)=\Xi(t)/4.                       \tag{2.3}
\]

For a polynomial (p), anchor orthogonality is therefore exactly

\[
 \int_{\mathbb R}p(t^2)d\mu(t)=0.                     \tag{2.4}
\]

No zero-location information enters (2.1)--(2.4).

## 3. Explicit anchor-orthogonal low-covariance witnesses

Define

\[
 c_n={M_{n+1}\over M_n},\qquad
 p_n(t^2)=t^{2n}(t^2-c_n).                             \tag{3.1}
\]

Then (p_n) has degree (n+1) in (t^2), and

\[
 \int_{\mathbb R}p_n(t^2)d\mu(t)
 =M_{n+1}-c_nM_n=0.                                   \tag{3.2}
\]

Thus the Fourier-side function (p_n(t^2)\Xi(t)) belongs to the
anchor-orthogonal image of ({\cal R}_{n+2}).

The moment ratios (c_n) tend to infinity.  Indeed, log convexity of the
moments makes (c_n) nondecreasing.  If they were bounded by (C), then
(M_n\leq M_0C^n).  Positive mass in any interval on which
(t^2>C+\delta) would instead give
(M_n\geq m(C+\delta)^n), a contradiction.

Fix (R>T), and choose a compact interval
(I\subset\{t:R\leq|t|\leq R+\delta\}) with
(mu(I)>0).  For all sufficiently large (n),

\[
 c_n\geq2\max\{T^2,(R+\delta)^2\}.                   \tag{3.3}
\]

On ([-T,T]),

\[
 |p_n(t^2)|^2\leq {9\over4}c_n^2T^{4n},              \tag{3.4}
\]

while on (I),

\[
 |p_n(t^2)|^2\geq {1\over4}c_n^2R^{4n}.              \tag{3.5}
\]

It follows that

\[
 \boxed{
 \gamma_{n+2}(T)
 \leq9{\mu([-T,T])\over\mu(I)}
          \left({T\over R}\right)^{4n}.}             \tag{3.6}
\]

Since (R>T) is arbitrary, taking (n)-th roots in (3.6), and then
letting (R\to\infty), proves (0.3).  This is stronger than failure of a
constant floor: the complete-prefix floor is smaller than every fixed
exponential scale in its depth, with constants allowed to depend on that
scale.

The witness is exactly anchor orthogonal before any limit and retains the
combined Xi factor.  There is no triangle inequality between pole,
archimedean, and prime blocks in this argument.

## 4. What transfers to finite prolate schedules

The result in Section 3 is an unconditional statement about the limiting
global radical tower.  Its transfer to a moving finite prefix must be stated
separately.

Let (T_{\lambda,N}=P_NC_\lambda), let (kappa_{\lambda,N}) be the
actual source-normalized projected prolate anchor, and define

\[
 {\cal R}_{d,\lambda,N}
 =P_{\kappa_{\lambda,N}^\perp}T_{\lambda,N}{\cal R}_d. \tag{4.1}
\]

For every **fixed** (d), the admitted all-order projection theorem and
fixed-function arithmetic transfer give convergence of the Gram and
fixed-window covariance matrices of (4.1) to their limiting matrices.
Therefore every fixed-depth statement in Sections 1--3 transfers
eventually.

That is not a growing-depth theorem.  A precise sufficient transfer
hypothesis is the following.  Let (F_d) be the unit normalization of the
witness from (3.1), and suppose that for a declared (d=d(\lambda)) one
constructs a unit vector
(F_{d,\lambda,N}\in{\cal R}_{d,\lambda,N}) satisfying

\[
 \|F_{d,\lambda,N}-F_d\|_2\leq\eta_\lambda,
 \qquad \eta_\lambda\longrightarrow0,                \tag{4.2}
\]

where the finite vector is extended by zero and both vectors use the same
phase.  Since the fixed-window transform is a contraction,

\[
 \|{\cal A}_TF_{d,\lambda,N}\|
 \leq\sqrt{\gamma_d(T)}+\eta_\lambda.                 \tag{4.3}
\]

Thus (0.3) and (4.2) force the finite prefix covariance floor to zero.
An equivalent version allows a nonunit lift with a denominator
(1-\eta_\lambda).

No current admitted theorem proves (4.2) for a growing, whitened tower.
The Gevrey theorem controls one particular coefficient-weighted sum

\[
 \sum_{j\leq M}\lambda^{-2j}G_j,                      \tag{4.4}
\]

not every unit vector in the span of (G_0,\ldots,G_M).  The uniform
Jacobi-tail theorem certifies an individual prolate state and its Legendre
tail; it does not bound the smallest singular value of the multi-correction
synthesis or its Weil graph norm.  Therefore neither theorem may be cited
as an unconditional growing-(d) transfer of (0.3).

A direct growing-depth proof might be possible from the explicit
polynomial-Gaussian source functions, but it would have to serialize a
uniform column-synthesis enclosure and prove its error below the relevant
Gram singular scale.  That proof is not supplied here.

## 5. Density and the graph-norm obstruction

The negative prefix result does not say that every selected radical block
has poor covariance.  In fact the opposite qualitative statement is true.

### Theorem 5.1 (density)

The union of the spaces ({\cal R}_d) is dense in even
(L^2(\mathbb R)).

**Proof.**  The exponential moment in (2.2) makes polynomials in (t^2)
dense in the even part of (L^2(\mu)).  One direct proof is to take an even
function (a\in L^2(\mu)) orthogonal to all such polynomials.  The signed
measure (a\,d\mu) has an analytic bilateral Laplace transform in a strip.
All derivatives at zero vanish, so the transform, and hence the measure,
vanishes.  Multiplication by (Xi) is an isometry from (L^2(\mu)), up to
the harmless Plancherel constant, onto even (L^2(dt)): the real zeros of
(Xi) have measure zero.  Equation (1.5) completes the proof.  \(\square\)

Consequently, for every fixed (m) and (T), one may approximate (m)
orthonormal even functions whose Fourier transforms are supported in
([-T,T]) and are orthogonal to (K_\infty).  After a small Gram
correction this gives a fixed finite radical block with

\[
 K_Z\succeq(1-\delta)I.                               \tag{5.1}
\]

For each such fixed block, the admitted fixed-function radical-leakage
estimates make its finite projected (B)-compression tend to zero.
A diagonal argument therefore gives some non-effective block dimension
(m(\lambda)\to\infty) with, conditionally on (B>0), for example

\[
 K_Z\succeq\tfrac12I,qquad E_Z\preceq m(\lambda)^{-1}I. \tag{5.2}
\]

This qualitative existence statement is **not** sufficient for the soft
trace target.  It gives no lower rate for (m(\lambda)/L), no comparison
between the energy in (5.2) and the actual residual (r), and no control of
the tilted complementary term.

There is an exact finite explanation.  For fixed ((\lambda,N)), the map

\[
 T_{\lambda,N}:L^2_{\rm even}(\mathbb R)\longrightarrow E_N^+ \tag{5.3}
\]

is onto, and the radical tower is dense.  Hence

\[
 \operatorname{span}\{T_{\lambda,N}G_j:j\geq0\}=E_N^+. \tag{5.4}
\]

Some finite prefix therefore already spans the entire finite even space.
After anchor deflation it spans the complete anchor complement.  At that
depth its whitened energy matrix is exactly (B), not a small radical
leakage matrix.  Thus the two limits do not commute:

\[
 \begin{array}{ll}
 \text{fixed depth, then }\lambda\to\infty:&E_d\to0,\\
 \text{saturating depth at fixed }\lambda:&E_d=B.
 \end{array}                                           \tag{5.5}
\]

Any uniform theorem must impose and control a depth, synthesis condition,
or source graph norm.  Global radicality plus ordinary (L^2) density
cannot do so.

The tilted metric makes the loss sharper.  With

\[
 S=r(B+rI)^{-1},\qquad
 \|v\|_{S^{-1}}^2={\langle v,Bv\rangle+r\|v\|^2\over r}, \tag{5.6}
\]

an ordinary (L^2) approximation error may be amplified by
(\sqrt{1+\|B\|/r}).  Since the source residual (r) is itself
beyond all algebraic orders on the admitted schedule, ordinary density or
an unweighted principal angle is not a substitute for a tilted graph-norm
estimate.

## 6. Basis-invariant finite block and moment-capture diagnostics

Assume one finite stage with

\[
 B>0,\qquad r>0,\qquad S=r(B+rI)^{-1},\qquad
 K_T={\cal A}_T^*{\cal A}_T.                           \tag{6.1}
\]

Let (U:\mathbb C^d\to\kappa^\perp) be any injective synthesis of
projected radical columns and define the raw matrices (0.4).  Whiten with

\[
 Z=UG^{-1/2}.                                          \tag{6.2}
\]

Then

\[
 E_Z=G^{-1/2}HG^{-1/2},\qquad
 K_Z=G^{-1/2}CG^{-1/2}.                                \tag{6.3}
\]

Substitution into the tilted-block identity gives

\[
\begin{aligned}
 r\operatorname{tr}\{K_Z(E_Z+rI)^{-1}\}
 &=r\operatorname{tr}\{C(H+rG)^{-1}\},
\end{aligned}                                          \tag{6.4}
\]

which proves (0.5).  Under (U\mapsto UR), with (R) invertible, the
three raw matrices transform by simultaneous congruence and (6.4) is
unchanged.

The canonical joint soft-leverage eigenvalues are those of

\[
 (H+rG)^{-1/2}C(H+rG)^{-1/2}.                          \tag{6.5}
\]

Their sum times (r) is (0.5).  Separate spectra of (K_Z) and (E_Z)
discard their relative orientation; (6.5) does not.

There is also a sharper connection to the closed moment tail.  Let (P_m)
be the even-moment projector and (H_m=I-P_m).  Define the tilted tower
projector

\[
 \Pi_U=S^{-1/2}U(U^*S^{-1}U)^{-1}U^*S^{-1/2}.          \tag{6.6}
\]

Since

\[
 U^*S^{-1}U={H+rG\over r},                             \tag{6.7}
\]

the exact tilted moment miss is

\[
\begin{aligned}
 \chi_{U,m}
 &:=\|(I-\Pi_U)S^{1/2}P_m{\cal A}_T^*\|_{HS}^2\\
 &=\operatorname{tr}\!\left[P_mK_TP_m
   \{S-rU(H+rG)^{-1}U^*\}\right]\geq0.               \tag{6.8}
\end{aligned}
\]

The tilted-block Pythagoras and the fixed-window moment tail

\[
 \operatorname{tr}(H_mK_TH_m)\leq\tau_m(L,T)          \tag{6.9}
\]

give

\[
 \boxed{
 \operatorname{tr}(SK_T)
 \leq {\cal L}_U(r)+
       \{\sqrt{\chi_{U,m}}+\sqrt{\tau_m(L,T)}\}^2.}  \tag{6.10}
\]

Indeed, take adjoints in the complementary Hilbert--Schmidt term, split
({\cal A}_T^*=P_m{\cal A}_T^*+H_m{\cal A}_T^*), and use that both
(I-\Pi_U) and (S^{1/2}) are contractions.

Equation (6.10) is a non-tautological replacement for the impossible full-
prefix covariance floor.  A useful growing-block theorem would prove, on
one source schedule,

\[
 {\cal L}_U(r)=o(L^{-3/2}),\qquad
 \chi_{U,m}=o(L^{-3/2}),\qquad m=\lceil LT\rceil,      \tag{6.11}
\]

along with both strict shifted sector signs.  The analytic moment theorem
already makes (\tau_m) superpolynomially small.

For a finite pilot, producer and verifier should independently reconstruct
(G,C,H), the generalized covariance eigenvalues of ((C,G)), the graph
energies of ((H,G)), the joint eigenvalues (6.5), (6.4), and (6.8).  They
should also record certified Gram pivots and reject an unresolved rank.
Column rescaling and invertible column mixing are mandatory adversarial
tests: (6.4) and (6.8) must not change.

## 7. Regression and exact limitations

The isolated regression is

```text
python3 -m unittest tests.test_polynomial_xi_radical_tower_covariance_floor_obstruction -v
```

It uses an exact rational unbounded-support measure to test the moment-ratio
witness, anchor orthogonality, arbitrary outer-scale covariance bounds, and
basis invariance of (0.5).  The fixture is a structural regression for
Section 3; it is not a numerical replacement for (|\Xi|^2dt).

The exact remaining limitations are:

1. equation (0.3) rules out the complete natural prefix, not every selected
   covariance-filtered subspace;
2. existing all-order and Jacobi-tail estimates transfer fixed blocks, not
   a whitened block of depth comparable to (L);
3. a pointwise finite pencil diagnostic is not an unbounded source theorem;
4. the soft trace still requires the joint estimates (6.11) and both finite
   shifted signs; and
5. no conclusion about zeros is inferred from numerical covariance or
   eigenvalue agreement.

The precise imported inputs are
`ALL_ORDER_PROLATE_ARITHMETIC_FLATNESS.md`,
`GEVREY_PROLATE_EXPONENTIAL_REMAINDER_AUDIT.md`,
`TRANSVERSE_XI_RADICAL_MOMENT_ANGLE_OBSTRUCTION.md`,
`PROLATE_SECANT_RADICAL_BLOCK_REDUCTION.md`,
`FIXED_WINDOW_EVEN_MOMENT_SOFT_TRACE_REDUCTION.md`, and
`UNIFORM_PROLATE_JACOBI_TAIL_AND_SCHEDULE_AUDIT.md`.
