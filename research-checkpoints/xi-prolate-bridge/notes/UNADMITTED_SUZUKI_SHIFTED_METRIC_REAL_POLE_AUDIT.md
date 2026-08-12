# UNADMITTED Suzuki shifted-metric and real-pole audit

## 0. Status and outcome

This note is an **UNADMITTED** audit of Masatoshi Suzuki,
*Weil's quadratic form via the screw function*,
[arXiv:2606.09096v1](https://arxiv.org/abs/2606.09096v1).  It uses the
official v1 formulas only as candidate mathematics.  The paper is not added
to a source lock, and nothing here is used by a producer, verifier, artifact,
or project-status claim.

There are two conclusions.

1. A precise real-pole convergence lemma is valid.  Reciprocals of
   real-rooted finite characteristic functions cannot converge, in the
   required contour-local meromorphic sense, to a function with a nonreal
   pole.
2. The proposed scalar de-shift

   \[
     {1\over W_a(z)}-c_a
       \longrightarrow {\xi'(1/2-iz)\over z^2\xi(1/2-iz)}                 \tag{0.1}
   \]

   is not the de-shift produced by replacing Suzuki's `A_a` by
   `A_a+c_a I` when `W_a` is in the normalization of Corollary 1.6.  In that
   normalization the exact formal correction is `c_a/z^2`, not `c_a`.
   Scalar subtraction belongs to the `A`-scale, whose unshifted multiplier
   is `xi'/xi`, without the factor `z^(-2)`.

The convergence needed by the lemma is not proved.  The source also leaves
Hilbert-scale, normalization, finite-boundary, and pole-control gaps.  Thus
the valid conditional lemma does not produce a conclusion about the zeros
of `xi`.

## 1. The two source scales and the shift sign

Suzuki uses

\[
 \widehat f(z)=\int_{\mathbb R}f(x)e^{izx}\,dx,
 \qquad D=i{d\over dx}.                                             \tag{1.1}
\]

Write

\[
 M(z)={\xi'(1/2-iz)\over\xi(1/2-iz)},
 \qquad L(z)={M(z)\over z^2}.                                      \tag{1.2}
\]

Section 8.3 of v1 writes the expression

\[
 \widehat g(z)=L(z).                                                \tag{1.3}
\]

This is not the bilateral Fourier-transform identity that the notation in
v1 suggests.  The cited paper, Suzuki,
[*Aspects of the screw function corresponding to the Riemann zeta
function*](https://arxiv.org/abs/2206.03682v4), Theorem 1.1(1) and equations
(1.2), (1.8), proves only the one-sided formula

\[
 \int_0^\infty g(t)e^{izt}\,dt=L(z),
 \qquad \operatorname{Im}z>{1\over2}.                             \tag{1.4}
\]

Indeed `g` is real and even, whereas the functional equation gives
`M(-z)=-M(z)` and hence `L(-z)=-L(z)`.  Any ordinary bilateral Fourier
transform of an even function would be even.  The positive- and
negative-half integrals converge in opposite half-planes, with no common
strip in which they can simply be added.  Thus (1.3) cannot be inserted as
an established full-line multiplier.  A distributional or hyperfunction
realization, including its boundary terms and analytic domain, would have
to be supplied separately.

The source defines, in (1.9),

\[
 T_a=A_a-\lambda I,
 \qquad \lambda<\lambda_a=\inf\operatorname{spec}A_a,              \tag{1.5}
\]

and in Section 8.3

\[
 S_a=G_a-\lambda K_a,
 \qquad K_a=(-\Delta_N)^{-1}.                                     \tag{1.6}
\]

Set `lambda=-c_a`.  Then strict positivity requires

\[
 c_a>-\lambda_a,                                                    \tag{1.7}
\]

and the exact finite-interval signs are

\[
 \boxed{T_a=A_a+c_aI,\qquad S_a=G_a+c_aK_a.}                        \tag{1.8}
\]

In particular, the plus sign survives the passage through `D`; the identity
operator does not.  The `L2` shift becomes the inverse Neumann Laplacian.

Away from zero frequency, the full-line inverse Laplacian has multiplier
`z^(-2)`.  More generally, if a legitimate bilateral realization of `G`
has multiplier `mathfrak g(z)`, then the relation through `D` gives the
following exact multiplier bookkeeping:

\[
 \begin{array}{c|c|c}
   \text{scale}&\text{unshifted}&\text{shifted by }A\mapsto A+cI\\ \hline
   A&z^2\mathfrak g&z^2\mathfrak g+c\\[2mm]
   G&\mathfrak g&\mathfrak g+c/z^2.
 \end{array}                                                       \tag{1.9}
\]

This table, unlike (1.3), is just the derivative-scale identity.  If one
**formally** inserts the one-sided analytic expression
`mathfrak g=L=M/z^2`, it gives two different inverse response factors:

\[
 R_c^A(z)={1\over M(z)+c},
 \qquad
 R_c^G(z)={1\over L(z)+c/z^2}={z^2\over M(z)+c}=z^2R_c^A(z).       \tag{1.10}
\]

Their formal de-shifts are

\[
 \boxed{{1\over R_c^A}-c=M=z^2L,}                                  \tag{1.11}
\]

and

\[
 \boxed{{1\over R_c^G}-{c\over z^2}=L
        ={\xi'(1/2-iz)\over z^2\xi(1/2-iz)}.}                      \tag{1.12}
\]

By contrast,

\[
 {1\over R_c^G}-c
   =L+c\left({1\over z^2}-1\right),                               \tag{1.13}
\]

so (0.1) is not even the formal source-normalized algebra unless an
additional renormalization is introduced and proved.  If `c_a` grows,
(1.13) is a large error on every fixed point with `z^2 != 1`; it is not a
harmless constant convention.  The parity/domain failure of (1.3) is an
earlier obstruction to promoting any of (1.10)--(1.13) to a full-line
operator identity.

### Finite-interval qualification

Equation (1.12) is formal multiplier bookkeeping, not a theorem about
`S_a`.  At finite `a`, the source kernel is

\[
 N_a(x,y)={x^2+y^2\over4a}-{|x-y|\over2}+{a\over6}.                 \tag{1.14}
\]

For mean-zero `u`, its action is the convolution with `-|x|/2` plus the
constant

\[
 {1\over4a}\int_{-a}^a y^2u(y)\,dy.                               \tag{1.15}
\]

The constant is invisible to mean-zero quadratic forms but not
automatically to a deficiency-vector normalization.  Moreover `K_a` is a
finite-interval Neumann inverse, not a translation-invariant full-line
operator.  A shifted asymptotic argument must control (1.15), the zero mode,
and the boundary extension before it may replace `K_a` by `z^(-2)`.  It
must additionally replace the one-sided transform (1.4) by a coherent
bilateral transform or work directly in the appropriate half-plane without
calling `L` a Fourier multiplier.

There is nevertheless a legal fixed-operator meaning for the correction.
After removing the constant mode, let the finite derivative
`D:V -> U` be an isomorphism, let `G=G^*`, and put

\[
 A=D^*GD,\qquad K=(DD^*)^{-1}=D^{-*}D^{-1}.             \tag{1.16}
\]

Then, exactly,

\[
 \boxed{A+cI=D^*(G+cK)D.}                             \tag{1.17}
\]

Thus `K` is positive, fixed, and independent of the spectral variable; in
a derivative eigenbasis its weights are the finite analogue of `z^(-2)`.
If `D` has a nontrivial kernel, no operator `K` can satisfy `D^*KD=I`, since
the left side annihilates `ker D`.  The zero mode must therefore be removed
or handled separately.  This finite congruence validates the operator shift,
not the scalar reciprocal subtraction in (1.12).

## 2. What Suzuki's characteristic function does and does not normalize

For fixed `a`, Theorem 1.5 defines the entire function

\[
 W(a,\theta;z)
  =(z-i)\widehat v_+(z)+e^{i\theta}(z+i)\widehat v_-(z),            \tag{2.1}
\]

where the deficiency vectors are built in the `T_a`-form Hilbert space.
The theorem states that its zeros are the eigenvalues of a self-adjoint
extension and hence are real.

Corollary 1.6 conjectures, after a further normalization, a limit to
`1/L=z^2 xi/xi'`.  Section 8.3 motivates that normalization only after
assuming the Riemann hypothesis and setting `lambda=0`.  It does not prove a
shifted identity for `lambda=-c_a`.  Even formally one has a numerator
factor coming from the two deficiency responses; `W` is not merely the bare
inverse multiplier `R_c^G`.

There are two further normalization breaks in that heuristic.  First,
substituting `widehat(v_(a,+/-))=widehat(h_(a,+/-))/widehat(g)` into (2.1)
should leave `widehat(h_(a,+/-))`, not `widehat(v_(a,+/-))`, inside the
parentheses after factoring `1/widehat(g)`.  The printed Section 8.3 display
leaves `v` there and therefore double-counts the inverse factor.  Second,
unitary equivalence of the `T_a`- and `S_a`-space differential operators
identifies their spectra, but by itself it does not identify two entire
characteristic functions with a fixed common scalar.  That missing scalar
is immaterial for zeros and decisive after taking `1/W`.

Therefore (1.10)--(1.13) are an audit that every proposed shifted formula
must pass.  They do not identify the finite characteristic function with a
Fourier multiplier.  To obtain (1.12) for normalized characteristic
functions one would still have to prove, with one fixed choice of phase and
scale, that the remaining numerator factor tends to one strongly enough to
survive reciprocal formation and subtraction of `c_a/z^2`.

The scalar de-shift is not an exact finite determinant identity.  Indeed,
let `W_0,W_c` be monic characteristic polynomials of the same positive
degree.  If

\[
 {1\over W_c(z)}-{c\over z^2}={1\over W_0(z)}          \tag{2.2}
\]

held for nonzero `c`, then every nonzero zero of either polynomial would be
a zero of the other with the same multiplicity: the correction is
holomorphic there and cannot create or cancel a pole.  Equal degrees then
force the multiplicities at zero to agree, and monicity gives `W_c=W_0`,
contradicting (2.2).  The same argument is immediate for subtraction of the
constant `c`.  A shifted Hermitian pencil instead obeys a multiplicative
resolvent-determinant identity; its dependence on `c` is nonlinear.  Hence a
matrix-level de-shift through (1.17) cannot be moved through determinant
formation as a scalar subtraction from `1/W_c`.

## 3. A precise real-pole convergence lemma

The useful complex-analytic statement does not require the unproved
operator construction.

### Lemma 3.1 (real poles are closed under contour-local convergence)

Let `Omega` be a domain in `C`.  Let `F_j` be meromorphic on `Omega`, with
every pole of every `F_j` lying on the real axis.  Let `F` be meromorphic on
`Omega`, not identically infinite.  Assume

\[
 F_j\longrightarrow F
 \quad\text{uniformly on every compact subset of }
 \Omega\setminus\operatorname{Pole}(F).                            \tag{3.1}
\]

Then every pole of `F` is real.  The same conclusion follows from locally
uniform spherical convergence on `Omega`.

**Proof.**  Suppose `z_0` is a nonreal pole of `F`, of order `m`.  Choose a
closed disk `D` centered at `z_0`, contained in `Omega` and disjoint from the
real axis, so small that

\[
 H(z)=(z-z_0)^mF(z)                                                  \tag{3.2}
\]

is holomorphic and nonzero on `D`.  Every `F_j` is holomorphic on `D`.
Convergence (3.1) on the boundary gives

\[
 H_j(z)=(z-z_0)^mF_j(z)\longrightarrow H(z)
 \quad\text{uniformly on }\partial D.                              \tag{3.3}
\]

For large `j`, Rouche's theorem says that `H_j` and `H` have the same
number of zeros in `D`.  The latter has none, while `H_j` has a zero of order
at least `m` at `z_0`, a contradiction.  For spherical convergence, the
limit is finite on `partial D`, so spherical convergence there becomes
ordinary uniform convergence after shrinking the error.  This reduces to
the preceding argument.  \(\square\)

### Corollary 3.2 (finite characteristic functions)

Let `W_j` be nonzero entire functions whose zeros are all real, and let
`q_j` be meromorphic functions whose poles are all real.  Then

\[
 F_j={1\over W_j}-q_j                                                \tag{3.4}
\]

has only real poles.  Lemma 3.1 applies to any meromorphic limit of (3.4).
This includes finite-dimensional self-adjoint characteristic polynomials
`W_j(z)=det(zI-H_j)`.  It includes either candidate correction
`q_j=c_j` or `q_j=c_j/z^2` as far as pole location is concerned, although
only the latter has the `G`-scale algebra in (1.12).

There is no cancellation of a zero of `W_j` by scalar subtraction: writing

\[
 {1\over W_j}-c_j={1-c_jW_j\over W_j}                               \tag{3.5}
\]

shows that the numerator equals one wherever `W_j=0`.

### Application to the desired target is only conditional

Let `s_0` be a zero of `xi` of multiplicity `m`, and define `z_0` by
`s_0=1/2-iz_0`.  If `z_0 != 0`, then

\[
 {\xi'(1/2-iz)\over z^2\xi(1/2-iz)}
 = {im\over z_0^2(z-z_0)}+O(1).                                   \tag{3.6}
\]

Thus every nonreal `z_0` would be a genuine nonreal simple pole; multiple
zeros do not cancel it.  Lemma 3.1 shows that a correctly normalized
real-pole sequence converging in the sense of (3.1) could not have such a
limit pole.  This explains why the convergence problem is mathematically
meaningful.  It does not establish that convergence.

## 4. Missing analytic inputs

### 4.1 Hilbert scale

Strict positivity of `T_a` gives the form space

\[
 \mathcal H_{+1}=\mathfrak D(T_a^{1/2}),
 \qquad \|u\|_{+1}=\|T_a^{1/2}u\|_2,                               \tag{4.1}
\]

embedded in `L2`, with dual `mathcal H_{-1}`.  On the full form space the
canonical map is

\[
 T_a:\mathcal H_{+1}\longrightarrow\mathcal H_{-1},                \tag{4.2}
\]

not an `L2` operator on every vector.

Section 6.2 of v1 says that continuity of
`u -> <D_a u,v>_(T_a)` in the stronger `T_a` norm implies continuity in the
weaker `L2` norm.  The implication goes in the other direction.  Adding
`c_aI` does not repair it.  A valid proof must interpret

\[
 i(T_av)'=T_ag                                                     \tag{4.3}
\]

in `mathcal H_{-1}` or distributions, prove that
`T_a^{-1}e^{+x}` and `T_a^{-1}e^{-x}` are exactly the deficiency vectors,
and establish the full adjoint domain and deficiency indices in that scale.
The printed v1 argument does not do this.

### 4.2 Characteristic normalization

Equality of the two deficiency-vector norms fixes neither a common
nonzero scalar nor all phase choices.  The equations
`T_av_+=e^x`, `T_av_-=e^(-x)` could provide a scale after the Hilbert-scale
argument is repaired, but that normalization must be reconciled explicitly
with (2.1) and with the phase `theta(a)`.

For zero locations a nonzero common factor is harmless.  For `1/W_a` it is
decisive:

\[
 {1\over \alpha_aW_a}-q_a
 ={1\over\alpha_a}{1\over W_a}-q_a.                                \tag{4.4}
\]

The source permits an exponential normalization in Corollary 1.6 but does
not prove a holomorphic nowhere-zero choice with the shifted asymptotics.
If `c_a` is large, reciprocal normalization must be accurate on the scale
needed for cancellation of `c_a/z^2`, not merely up to `o(1)` before
de-shifting.

### 4.3 Choice and growth of the shift

The source allows any `lambda<lambda_a`; equivalently, it gives existence
of `c_a>-lambda_a` at each fixed `a`.  It does not provide an explicit
source-normalized sequence `c_a`, an unconditional asymptotic bound for it,
or control of shifted deficiency vectors uniform in `a`.  Those are needed
before taking a large-interval limit.

### 4.4 Pole and convergence topology

The target `L` is meromorphic.  Besides its poles corresponding to zeros of
`xi`, the factor `z^(-2)` makes the origin a separate real point.  The cited
2023 source explicitly notes after Theorem 1.6 that `L` has a simple pole at
zero.  By contrast, the correct shifted subtraction `c_a/z^2` has a double
pole there.  Unless `c_a` tends to zero, convergence therefore requires a
matched double-principal-part contribution from `1/W_a`, leaving exactly
the simple target pole.  No such local normalization estimate is supplied
in v1.  Ordinary finite-valued uniform convergence across the target poles
is therefore the wrong topology.

The half-plane in the actual one-sided identity (1.4) is also on the wrong
side of the required continuation problem.  If a nontrivial zero is
`s_0=beta+i gamma`, then

\[
 z_0=i(s_0-1/2)=-\gamma+i(\beta-1/2),
 \qquad |\operatorname{Im}z_0|<{1\over2}.                          \tag{4.5}
\]

Thus the possible target poles lie in the central strip, while (1.4) starts
in `Im z>1/2`.  One needs controlled meromorphic continuation and convergence
across the strip boundary, not merely convergence in the original Laplace
half-plane.

Lemma 3.1 needs at least uniform convergence on every sufficiently small
circle surrounding a candidate target pole.  Pointwise convergence on the
real axis, convergence of a list of real eigenvalues, or strong resolvent
convergence without determinant/normal-family control supplies no such
statement.  Forming reciprocals also requires uniform nonvanishing control
on the chosen contours.  Any extra normalization must be holomorphic and
nowhere zero, or it can introduce poles unrelated to the self-adjoint
spectrum.

## 5. Audit verdict

The real-pole lemma is exact and useful as a formulation of a possible
future convergence gate.  The shifted-metric proposal in (0.1), however,
mixes the `A` and `G` scales.  At the level of the formal analytic symbols,
the scale-consistent alternatives are

\[
 \left({1\over R_{c_a}^A}-c_a\right){1\over z^2}=L                 \tag{5.1}
\]

or

\[
 {1\over R_{c_a}^G}-{c_a\over z^2}=L.                              \tag{5.2}
\]

Neither identity has been lifted from analytic-symbol bookkeeping to the
finite Suzuki characteristic functions.  In particular, v1's use of the
one-sided expression (1.4) as a bilateral Fourier multiplier is not
justified.  None of the convergence, Hilbert-scale, normalization,
shift-growth, or pole-control obligations is settled by
arXiv:2606.09096v1.
