# Relative odd gap: boundary pullback and endpoint Schur gate

## 0. Claim boundary and outcome

This note gives an exact finite-dimensional reduction of the comparison

\[
 q_N<\mu_{-,N},
 \qquad
 q_N=\langle\kappa_N,Q_+\kappa_N\rangle,
 \qquad
 \mu_{-,N}=\lambda_{\min}(Q_-).
\]

It uses the source Cauchy commutator before taking absolute values.  The odd
block is exactly similar to an oblique boundary compression of the even
block, and the desired comparison is exactly one endpoint-residual Schur
inequality.  This is a source-specific replacement for comparing separate
pole, archimedean, and prime norms.

The reduction does not prove the Schur inequality.  In particular, the
source commutator does not force parity interlacing, and parity interlacing
plus a simple even ground does not force the particular Rayleigh value
`q_N` below the odd floor.  Exact positive Cauchy-form countermodels are
given in Section 6.

No nontrivial zero is assumed real, no zero table is used, and no global
Weil positivity is used in the unconditional identities.  The sampling
interpretation in Section 5 is explicitly conditional on the all-critical
branch and is only a necessity diagnostic.  No signed sector floor,
equation (5.2) of `DIRECT_RH_ATTACK.md`, determinant limit, or
Riemann-hypothesis conclusion is proved.  The formal project state remains
`P0_INVALIDATED`.

## 1. Locked source displacement

Use the source modes `V_n`, `-N<=n<=N`, and put

\[
 MV_n=nV_n,
 \qquad
 \eta=\sum_{|n|\leq N}V_n,
 \qquad
 \beta=\sum_{|n|\leq N}b_nV_n.
\]

The exact finite Weil matrix has

\[
 Q_{nn}=a_n,
 \qquad
 Q_{nm}={b_n-b_m\over n-m}\quad(n\ne m),
 \qquad
 a_{-n}=a_n,\qquad b_{-n}=-b_n,                     \tag{1.1}
\]

where every `b_n` contains the complete pole--archimedean--minus-prime
distribution.  In particular, the minus sign in source equation (3.19) has
not been changed.  Entrywise multiplication by `n-m` gives

\[
 [M,Q]=|\beta\rangle\langle\eta|
       -|\eta\rangle\langle\beta|.                  \tag{1.2}
\]

Let `J V_n=V_(-n)` and write

\[
 H_+=\ker(J-I),\qquad H_-=\ker(J+I),
 \qquad Q_\pm=Q|_{H_\pm}.
\]

Then `eta` is even, `beta` is odd, and `M` exchanges the two parity
spaces.  Set

\[
 e_0=V_0,qquad
 \delta f=\langle\eta,f\rangle,qquad
 D=M|_{H_+}:H_+\longrightarrow H_- .                \tag{1.3}
\]

Thus `ker D=C e_0` and `delta(e_0)=1`.  The physical logarithmic derivative
is `(2*pi/L)D`; using the integer-mode operator only removes a common factor
from the pullback Rayleigh quotients below.

Taking the odd component of (1.2) on an even vector gives the exact identity

\[
 \boxed{DQ_+-Q_-D=|\beta\rangle\delta.}              \tag{1.4}
\]

## 2. Exact boundary pullback of the odd block

Define the boundary-zero even hyperplane and its oblique projection by

\[
 H_0=\ker\delta\subset H_+,
 \qquad R_0=I-|e_0\rangle\delta .                     \tag{2.1}
\]

The restriction

\[
 D_0:=D|_{H_0}:H_0\longrightarrow H_-               \tag{2.2}
\]

is an isomorphism.  Indeed, the two spaces have dimension `N`, and the
kernel of `D` has trivial intersection with `H_0` because `delta(e_0)=1`.

For `f in H_0`, equation (1.4) loses its rank-one right side.  Since `D`
kills the component along `e_0`,

\[
 D_0(R_0Q_+f)=DQ_+f=Q_-D_0f.                         \tag{2.3}
\]

Consequently, if

\[
 A_0=R_0Q_+|_{H_0},                                   \tag{2.4}
\]

then

\[
 \boxed{D_0A_0=Q_-D_0,
 \qquad A_0=D_0^{-1}Q_-D_0.}                         \tag{2.5}
\]

The compression in (2.4) is oblique, not orthogonal.  It is self-adjoint in
the derivative metric

\[
 \langle f,g\rangle_D=\langle D_0f,D_0g\rangle.
\]

This proves the exact variational formula

\[
 \boxed{
 \mu_{-,N}=
 \inf_{0\ne f\in H_0}
 {\langle Df,DQ_+f\rangle\over\|Df\|^2}.}           \tag{2.6}
\]

In particular, the desired relative comparison has the cancellation-
preserving form

\[
 \boxed{
 q_N<\mu_{-,N}
 \quad\Longleftrightarrow\quad
 \langle Df,D(Q_+-q_NI)f\rangle>0
 \quad(0\ne f\in H_0).}                             \tag{2.7}
\]

No pole, archimedean, or prime block has been separated in (2.7).

There is no large inverse loss hidden in the boundary primitive.  If

\[
 f=c_0V_0+\sum_{n=1}^Nc_n(V_n+V_{-n})\in H_0,
\]

then `c_0=-2 sum_n c_n`, and weighted Cauchy--Schwarz gives

\[
 \begin{aligned}
 \|f\|^2
 &=|c_0|^2+2\sum_{n=1}^N|c_n|^2\\
 &\leq
 \left(1+2\sum_{n=1}^N{1\over n^2}\right)\|Df\|^2
 \leq\left(1+{\pi^2\over3}\right)\|Df\|^2,\\
 \|Df\|&\leq N\|f\|.                                \tag{2.8}
 \end{aligned}
\]

Thus

\[
 {1\over\sqrt{1+\pi^2/3}}\leq s_{\min}(D_0)
 \leq\|D_0\|\leq N.                                  \tag{2.9}
\]

The difficulty in (2.7) is signed orientation, not inversion of the
boundary primitive.

## 3. Characteristic ratio and the missing interlacing sign

For `z` outside the two spectra, define the boundary resolvent scalar

\[
 m_N(z)=\delta(Q_+-zI)^{-1}e_0.                        \tag{3.1}
\]

Use the direct-sum coordinates `H_+=C e_0 direct-sum H_0`.  The lower-right
block of `Q_+-zI` in these coordinates is `A_0-zI`, while the `(1,1)` entry
of its inverse is exactly (3.1).  The Schur determinant formula and (2.5)
therefore give the polynomial identity

\[
 \boxed{
 \det(Q_--zI)=\det(Q_+-zI)m_N(z).}                    \tag{3.2}
\]

Apparent poles on the right cancel, so (3.2) extends through the even
eigenvalues.  If `lambda_j` and `v_j` are a real orthonormal eigensystem of
the real even block, then

\[
 m_N(z)=\sum_j{w_j\over\lambda_j-z},
 \qquad
 w_j=\langle\eta,v_j\rangle\langle v_j,e_0\rangle.   \tag{3.3}
\]

Strict positivity of all `w_j` would make `m_N` a Stieltjes function and
would force strict parity interlacing.  The source commutator proves no such
sign: its finite boundary argument gives nonvanishing of the ground
boundary pairing only after the simple-even ground hypotheses are known.
It neither signs the product in (3.3) nor treats all even eigenvectors.

Even if interlacing is proved, the particular state still has to be placed
below the first odd root.  In the first interlacing interval this is the
single signed condition `m_N(q_N)<0`, together with the assertion that
`q_N` lies before the second even eigenvalue.  Without the residue signs,
the determinant ratio alone does not control inertia.

## 4. Endpoint-residual Schur gate

Put

\[
 \kappa=\kappa_N,\qquad
 q=q_N,\qquad
 r=(Q_+-qI)\kappa,\qquad
 d=\delta\kappa,\qquad x=D\kappa.                    \tag{4.1}
\]

Assume `x` is nonzero, as in the nonconstant projected-prolate branch.
(If `x=0`, the one-vector Schur chart below is unavailable and
`Q_--qI>0` must be checked directly.)  Applying (1.4) to `kappa` gives the
exact combined endpoint-residual identity

\[
 \boxed{
 (Q_--qI)x=Dr-d\beta=:s.}                            \tag{4.2}
\]

The two terms on the right must remain combined.  In particular, bounding
`Dr` and `d beta` separately can lose the same endpoint cancellation that
created the small Rayleigh scalar.

Let

\[
 y={x\over\|x\|},\qquad P_y=I-|y\rangle\langle y|,
\]

and define

\[
 \begin{aligned}
 a_N&={\langle x,s\rangle\over\|x\|^2},\\
 c_N&={P_ys\over\|x\|},\\
 B_N&=P_y(Q_--qI)P_y|_{y^\perp}.                    \tag{4.3}
 \end{aligned}
\]

Hermiticity makes `a_N` real.  Relative to
`H_-=C y direct-sum y^perp`, the complete shifted odd block is exactly

\[
 Q_--qI=
 \begin{pmatrix}a_N&c_N^*\\c_N&B_N\end{pmatrix}.       \tag{4.4}
\]

Hence the requested comparison is equivalent to one precise source
inequality:

\[
 \boxed{
 q_N<\mu_{-,N}
 \quad\Longleftrightarrow\quad
 B_N>0
 \quad\hbox{and}\quad
 a_N-\langle c_N,B_N^{-1}c_N\rangle>0.}             \tag{4.5}
\]

Equation (4.5) is necessary and sufficient, not a norm sufficient
condition.  A coarser but sometimes useful implication is

\[
 B_N\geq\vartheta_N I,
 \qquad
 \langle x,Dr-d\beta\rangle
 >{\|P_y(Dr-d\beta)\|^2\over\vartheta_N}
 \quad\Longrightarrow\quad q_N<\mu_{-,N},           \tag{4.6}
\]

after dividing both sides consistently by `||x||^2`.  The inverse-weighted
version (4.5), rather than (4.6), is the preferred target.

For the deterministic schedule

\[
 L=2\log\lambda,
 \qquad N=\lceil\lambda L^3\rceil,                    \tag{4.7}
\]

the factor `||D||<=N` shows why an ordinary residual norm is not enough:
it can enlarge `r` by the full polynomial cutoff.  A viable theorem must
estimate the combined vector `Dr-d beta` in the `B_N^{-1}` metric, or prove
(2.7) directly.  The first-prolate-correction projection gain controls a
positive sampling scalar, but it does not supply either signed condition in
(4.5).

## 5. Conditional sampling form of the same obstruction

This section is only a consistency audit on the all-critical branch.  Let
`mathsf Z_+` and `mathsf Z_-` be the paired zero-evaluation maps on the two
parity sectors, with the repository normalization

\[
 Q_\pm={1\over2}\mathsf Z_\pm^*\mathsf Z_\pm.         \tag{5.1}
\]

Then exact radicality of the global source state gives

\[
 \mathsf Z_+p_N=-\mathsf Z_+R_N,
 \qquad p_N=a_N^{\rm state}\kappa_N.                  \tag{5.2}
\]

Consequently

\[
 \boxed{
 q_N<\mu_{-,N}
 \quad\Longleftrightarrow\quad
 \|\mathsf Z_+R_N\|^2
 <(a_N^{\rm state})^2s_{\min}(\mathsf Z_-)^2.}        \tag{5.3}
\]

This makes the relative nature of the problem explicit: superpolynomial
decay of the numerator alone does not control the ratio.

There is also an exact derivative transport.  If `f in H_0`, its zero
extension has no endpoint term under integration by parts.  Since the
integer-mode operator is `D=(L/(2*pi*i))*partial_x`, at a real zero
ordinate `gamma`,

\[
 \widehat{Df}(\gamma)={L\gamma\over2\pi}\widehat f(\gamma)
\]

up to the fixed harmless phase determined by the Fourier convention.
Therefore (2.6) becomes

\[
 \mu_{-,N}={1\over2}
 \inf_{0\ne f\in H_0}
 {\|\Gamma_L\mathsf Z_+f\|^2\over\|Df\|^2},          \tag{5.4}
\]

where `Gamma_L` multiplies every paired sample by `L*gamma/(2*pi)`.
Multiplicity-aware Paley--Wiener jet uniqueness does not by itself prove
injectivity of this repeated-value sampling map, much less a quantitative
lower frame constant.  The missing source input can therefore be stated
equivalently as either

1. the signed endpoint-residual short (4.5), or
2. a boundary-zero weighted sampling lower bound in (5.4) strong enough to
   dominate the exact radical leakage in (5.3).

Using (5.1)--(5.4) as an unconditional positivity argument would assume the
theorem being sought and is not admissible.

## 6. Exact positive Cauchy countermodels

The following are logical structural models, not matrices assembled from the
prime-power inventory.  They satisfy the exact `N=1` source algebra
(1.1)--(1.2).  In the ordered complex basis `(V_-1,V_0,V_1)`, put `b_1=t`,
`b_0=0`, `b_-1=-t`.  Then

\[
 Q=\begin{pmatrix}
 a_1&t&t\\
 t&a_0&t\\
 t&t&a_1
 \end{pmatrix},                                      \tag{6.1}
\]

the odd eigenvalue is `a_1-t`, and the normalized even block is

\[
 Q_+=\begin{pmatrix}a_0&\sqrt2t\\\sqrt2t&a_1+t\end{pmatrix}.
                                                               \tag{6.2}
\]

First take `t=1`, `a_0=3`, `a_1=2`.  The odd eigenvalue is one, while the
even eigenvalues are `3-sqrt(2)` and `3+sqrt(2)`.  Thus `Q` is positive
definite but its ground is odd.  Positive Cauchy form, Hermitian symmetry,
inversion symmetry, and the rank-one parity displacement force neither an
even ground nor parity interlacing.

For a sharper test, let `0<t<1` and take

\[
 a_0=1,qquad a_1=1+{t\over2}.                        \tag{6.3}
\]

The odd eigenvalue is

\[
 \mu_-=1-{t\over2}.                                   \tag{6.4}
\]

The even characteristic polynomial evaluated at this number is

\[
 \det(Q_+-\mu_-I)=-t^2<0.                             \tag{6.5}
\]

Both even eigenvalues are positive, so (6.5) puts the lower even eigenvalue
strictly below `mu_-`.  The global ground is therefore simple and even.
Nevertheless, for the source mode `kappa=e_0`,

\[
 q=\langle e_0,Qe_0\rangle=1>\mu_-,
 \qquad
 \|(Q-q)e_0\|^2=2t^2.                                \tag{6.6}
\]

The residual can be arbitrarily small while the desired comparison fails.
Multiplying the complete matrix by any positive scalar also makes `q`, the
odd floor, and the residual arbitrarily small without changing the failure.
Thus neither absolute smallness, positive definiteness, a simple even
ground, nor interlacing replaces the relative Schur inequality (4.5).

## 7. Exact remaining theorem

On a common unbounded schedule, the direct signed-Rayleigh route must prove

\[
 \boxed{
 B_N>0,
 \qquad
 {\langle D\kappa_N,
       D(Q_+-q_NI)\kappa_N
       -(\delta\kappa_N)\beta\rangle
  \over\|D\kappa_N\|^2}
 >\langle c_N,B_N^{-1}c_N\rangle.}                  \tag{7.1}
\]

Every quantity in (7.1) is reconstructed from the source matrix, the
source boundary vector, and the projected source-normalized state.  The
formula retains the combined pole--archimedean--minus-prime cancellation.
What is still missing is a signed transverse floor for `B_N` and an
inverse-weighted orientation estimate for the single combined endpoint
vector `Dr-(delta kappa)beta`.  Current projection, endpoint-size, and
positive-sampling estimates do not provide either one.
