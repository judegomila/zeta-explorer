# Diagonal anchor forcing, signed Laplacian, and strip gate

## 0. Claim boundary

This is a finite, theorem-only source-Cauchy package.  Given a real even
anchor whose displayed Fourier coordinates are nonzero and a fixed requested
eigenvalue, it subtracts the unique shell diagonal which makes that anchor an
exact eigenvector; changing the requested eigenvalue only changes the scalar
gauge described below.  The shifted even block is then congruent to a signed
graph Laplacian.  Its complete inertia is governed by an effective-resistance
matrix when the positive-edge graph is connected.  Under the stated
conditions \(c\ne0\) and nonsingular \(T_-\), the
same diagonal in the odd block gives an exact Hermitian parity pencil whose
generalized eigenvalues are the roots of the raw anchor polynomial.

The resulting identities are reductions, not sign estimates.  They prove no
actual-source signed-Laplacian inequality on an unbounded schedule, no
simultaneous nonvanishing of all coordinates up to a growing cutoff, no
projection-convergent strip exclusion, no instance of equation (5.2) of
`DIRECT_RH_ATTACK.md`, and no Riemann-hypothesis conclusion.  No finite
decimal row or numerical pilot is used.  The auxiliary diagonal below is not
inserted into the pinned pole--archimedean--minus-prime assembly and is not
identified with a Weil matrix at another source parameter.  The formal
project state remains `P0_INVALIDATED`.

The binding finite conventions remain those of `P0_SOURCE_LOCK.json` and
`P0_NORMALIZATION_AUDIT.md`.  In particular,

\[
 L=2\log\lambda,
 \qquad
 \widehat f(z)=\int_{-L/2}^{L/2}f(t)e^{-izt}\,dt,
 \qquad JV_n=V_{-n},
\tag{0.1}
\]

and the complete source matrix retains every prime power
\(1<n\le\lambda^2\) and the minus sign on the prime block.  Nothing below uses a
zero table or assumes global Weil positivity.

## 1. Source-Cauchy block and the forced shell diagonal

Let `Q` be a real inversion-symmetric source-Cauchy matrix on the modes
`-N,...,N`:

\[
 Q_{nn}=a_n,
 \qquad
 Q_{nm}={b_n-b_m\over n-m}\quad(n\ne m),
 \qquad a_{-n}=a_n,\quad b_{-n}=-b_n.
\tag{1.1}
\]

Use the normalized parity bases

\[
 e_0^+=V_0,
 \qquad e_n^+={V_n+V_{-n}\over\sqrt2},
 \qquad e_n^-={V_n-V_{-n}\over\sqrt2}.
\tag{1.2}
\]

Write

\[
 A=Q_+,
 \qquad G_0=Q_-,
 \qquad
 \kappa=\sum_{j=0}^N\kappa_j e_j^+.
\tag{1.3}
\]

Before making any coordinate division, define

\[
 w_{ij}=-A_{ij}\kappa_i\kappa_j\quad(0\le i<j\le N)
\tag{1.3a}
\]

and let \(L_w\) be the corresponding signed Laplacian.  For \(N\ge1\), the
division-free strict gate

\[
 \boxed{L_w\succeq0,\qquad\ker L_w=\mathbb C\mathbf1}
\tag{1.3b}
\]

itself forces every \(\kappa_i\ne0\).  Indeed, if \(\kappa_i=0\), every edge
incident to vertex \(i\) has weight zero, so that vertex is isolated and
\(e_i\in\ker L_w\), contrary to (1.3b).  Thus all-coordinate nonvanishing can
either be assumed directly or obtained as a consequence of the strict gate.

Whenever all coordinates are nonzero, fix a real scalar `mu` and define

\[
 h_j={(A\kappa)_j\over\kappa_j}-\mu.
\tag{1.4}
\]

Let `H` be the inversion-even raw shell diagonal with value `h_0` at mode
zero and value `h_j` at both modes `+/-j`.  Put

\[
 B=Q-H,
 \qquad T=B-\mu I,
 \qquad T_+=A-\operatorname {diag}(h)-\mu I,
 \qquad T_-=G_0-\operatorname {diag}(h_1,\ldots,h_N)-\mu I.
\tag{1.5}
\]

Then

\[
 \boxed{T_+\kappa=0.}
\tag{1.6}
\]

For fixed \(\mu\), (1.4) is the unique shell diagonal for which
\((Q-H)_+\kappa=\mu\kappa\).  Replacing \(\mu\) by \(\mu+a\) replaces
\(H\) by \(H-aI\), so the shifted operator \(T\) is independent of this
scalar gauge.  The diagonal modification changes no off-diagonal Cauchy
coefficient `b_n`.  Since a raw shell diagonal commutes with the mode
operator, it also changes no source commutator.

## 2. Exact signed-Laplacian representation

### Theorem 2.1 (ground-state transform without a sign assumption)

For `0<=i<j<=N`, recall the division-free real edge weights

\[
 \boxed{w_{ij}=-A_{ij}\kappa_i\kappa_j.}
\tag{2.1}
\]

For every `f=(f_0,...,f_N)` and
`z=diag(kappa_0,...,kappa_N)f`, one has

\[
 \boxed{
 \langle z,T_+z\rangle
 =\sum_{0\le i<j\le N}w_{ij}|f_i-f_j|^2.}
\tag{2.2}
\]

Equivalently, if `L_w` is the signed Laplacian with off-diagonal entries
`(L_w)_(ij)=-w_(ij)` and diagonal entries
`(L_w)_(ii)=sum_(j!=i)w_(ij)`, then

\[
 \boxed{
 \operatorname {diag}(\kappa)T_+
 \operatorname {diag}(\kappa)=L_w.}
\tag{2.3}
\]

Consequently

\[
 \operatorname {inertia}(T_+)=\operatorname {inertia}(L_w),
\tag{2.4}
\]

and the forced anchor is a lowest even eigenvector exactly when
`L_w` is positive semidefinite.  It is a simple lowest even eigenvector
exactly when \(L_w\) is positive semidefinite with kernel
\(\mathbb C\mathbf 1\).

**Proof.**  The off-diagonal entries of `T_+` are those of `A`, while
(1.4)--(1.5) give

\[
 (T_+)_{ii}=-\sum_{j\ne i}A_{ij}{\kappa_j\over\kappa_i}.
\tag{2.5}
\]

Substitution of `z_i=kappa_i f_i` and symmetrization over `i,j` give
(2.2).  Equation (2.3) follows entrywise, and (2.4) is Sylvester inertia
under the invertible diagonal congruence.  \(\square\)

The easy sufficient condition \(w_{ij}\ge0\) on every edge is not necessary.
Negative edges can be retained when the complete signed network remains
positive on \(\mathbf 1^\perp\).

### Theorem 2.2 (effective-resistance inertia formula)

Separate the positive and negative edges and orient them arbitrarily.  Let

\[
 L_+=C_+W_+C_+^*,
 \qquad
 L_w=L_+-C_-W_-C_-^*,
\tag{2.6}
\]

where `W_+` and `W_-` contain the positive magnitudes.  Assume the positive
edge graph is connected, so `L_+` is positive definite on `1^perp`.  Define
the negative-edge effective-resistance matrix

\[
 \boxed{
 \mathcal R_-=W_-^{1/2}C_-^*L_+^\dagger
 C_-W_-^{1/2}.}
\tag{2.7}
\]

Then, with eigenvalues counted with multiplicity,

\[
 \boxed{
 n_-(T_+)=\#\{\rho\in\operatorname {spec}(\mathcal R_-):\rho>1\},}
\tag{2.8}
\]

and

\[
 \boxed{
 \dim\ker T_+=1+\#\{\rho\in\operatorname {spec}(\mathcal R_-):\rho=1\}.}
\tag{2.9}
\]

In particular, with one negative edge of magnitude `q` between vertices
`r,s`,

\[
 \boxed{
 T_+\succeq0
 \quad\Longleftrightarrow\quad
 q\,R_{\rm eff}^{(+)}(r,s)\le1.}
\tag{2.10}
\]

Equality creates one additional zero direction; strict inequality leaves
only the anchor kernel.

**Proof.**  Restrict to `1^perp` and conjugate by the positive square root
of `L_+`.  The resulting matrix is

\[
 I-UU^*,
 \qquad
 U=L_+^{-1/2}C_-W_-^{1/2}.
\tag{2.11}
\]

The nonzero eigenvalues of \(UU^*\) are those of
\(U^*U=\mathcal R_-\).
Equations (2.8)--(2.9) follow, and the one-edge specialization is (2.10).
\(\square\)

## 3. The actual-source edge weights and what current bounds omit

Write the real raw even coefficients as

\[
 \kappa=x_0V_0+\sum_{n=1}^Nx_n(V_n+V_{-n}),
 \qquad
 \kappa_0=x_0,\quad \kappa_n=\sqrt2x_n.
\tag{3.1}
\]

The exact even source-Cauchy entries are

\[
 A_{0n}={\sqrt2b_n\over n},
 \qquad
 A_{nm}=2{nb_n-mb_m\over n^2-m^2}\quad(n\ne m,\ n,m\ge1).
\tag{3.2}
\]

Therefore the forced actual-source graph weights are exactly

\[
 \boxed{
 w_{0n}=-2{b_n\over n}x_0x_n,}
\tag{3.3}
\]

\[
 \boxed{
 w_{nm}=-4{nb_n-mb_m\over n^2-m^2}x_nx_m
 \quad(n\ne m,\ n,m\ge1).}
\tag{3.4}
\]

These formulas use the `b_n` of the complete combined
pole--archimedean--minus-prime matrix.  They do not replace that combination
by separate positive pieces.

The original diagonal entries cancel identically:

\[
 (T_+)_{ii}=-\sum_{j\ne i}A_{ij}{\kappa_j\over\kappa_i}.
\tag{3.5}
\]

Thus the admitted logarithmic lower bound for the source diagonal `a_n`
does not control the right-hand side of (2.8) or imply
\(\mathcal R_-\preceq I\), while a magnitude bound for `b_n` does not sign
the divided differences in (3.3)--(3.4).  The prime sine phases and the
anchor coordinate signs are both variable.  Fixed-mode anchor asymptotics
prove eventual nonvanishing for each fixed coordinate separately; they do
not prove simultaneous nonvanishing of every coordinate through a growing
cutoff.  Hence (1.4) itself remains conditional on the displayed
all-coordinate hypothesis.

## 4. Exact source parity pencil

Let

\[
 De_0^+=0,
 \qquad De_n^+=ne_n^-,
 \qquad
 \eta=e_0^++\sqrt2\sum_{n=1}^Ne_n^+.
\tag{4.1}
\]

The shell diagonal commutes across the two parity actions of `D`, so the
source commutator remains

\[
 DT_+-T_-D=|\beta\rangle\langle\eta|.
\tag{4.2}
\]

Assume additionally

\[
 c=\langle\eta,\kappa\rangle\ne0,
 \qquad \kappa_0\ne0.
\tag{4.3}
\]

Define on the odd space

\[
 u={D\kappa\over c},
 \qquad d=D\eta,
 \qquad
 X=D D^*-|u\rangle\langle d|,
 \qquad
 K=DT_+D^*.
\tag{4.4}
\]

### Theorem 4.1 (source factorization and anchor polynomial)

One has

\[
 \boxed{T_-u=-\beta,}
 \qquad
 \boxed{K=T_-X.}
\tag{4.5}
\]

The raw-mode polynomial

\[
 p_\kappa(y)=x_0\prod_{m=1}^N(y-m^2)
 +2y\sum_{n=1}^Nx_n
       \prod_{\substack{1\le m\le N\\m\ne n}}(y-m^2)
\tag{4.6}
\]

satisfies

\[
 \boxed{p_\kappa(y)=c\det(yI-X).}
\tag{4.7}
\]

**Proof.**  Apply (4.2) to `kappa` and use `T_+kappa=0` to obtain the
first identity in (4.5).  Multiply (4.2) on the right by `D*`, substitute
`beta=-T_-u`, and obtain the second.

In the odd basis,

\[
 u_n={\sqrt2n x_n\over c},
 \qquad d_n=\sqrt2n.
\tag{4.8}
\]

The matrix determinant lemma gives

\[
 \det(yI-X)
 =\prod_{m=1}^N(y-m^2)
 \left(1+2\sum_{n=1}^N{n^2x_n\over c(y-n^2)}\right),
\tag{4.9}
\]

which is (4.6) divided by its leading coefficient
\(c=x_0+2\sum_nx_n\).  \(\square\)

Whenever \(T_-\) is nonsingular, the source factorization also gives the
exact Hermitian-pencil identity

\[
 \boxed{
 \det(K-yT_-)=(-1)^N{\det T_-\over c}\,p_\kappa(y).}
\tag{4.10}
\]

If the anchor kernel of `T_+` is simple, then `K` is congruent to the form
induced by `T_+` on the even quotient.  Indeed, `D*` maps the odd space
isomorphically onto the zero-central-coordinate hyperplane, and
\(\kappa_0\ne0\) makes that hyperplane a complement to the anchor line.

When \(T_-\) and \(K\) are nonsingular, \(X=T_-^{-1}K\) is self-adjoint in the
possibly indefinite \(T_-\) metric.  Every nonreal conjugate pair of roots of
\(p_\kappa\) consumes one positive and one negative metric direction.  Thus the
number of conjugate pairs, counted algebraically in the upper half-plane,
is at most

\[
 \boxed{
 \min\{n_+(T_-),n_-(T_-),n_+(K),n_-(K)\}.}
\tag{4.11}
\]

This is only a count.  It gives no lower bound for the distance of those
roots from the physical strip.

## 5. A shifted definite-pencil strip criterion

For a root `y=A+iB`, put

\[
 v(y)=\left({|y|-A\over2}\right)^{1/2}.
\tag{5.1}
\]

The square roots `s` of `y` have `|Im s|=v(y)`, and the physical transform
variable is `z=(2*pi/L)s`.  Hence the open half-strip threshold is

\[
 \boxed{\delta={L\over4\pi}.}
\tag{5.2}
\]

For the centered modes fixed in (0.1), with the raw coefficients of (3.1)
and \(s=zL/(2\pi)\), the exact transform formula is

\[
 \boxed{
 \widehat\kappa(z)
 = {\sqrt L\over\pi}{\sin(\pi s)\over s}
   {p_\kappa(s^2)\over\prod_{m=1}^N(s^2-m^2)}.}
\tag{5.2a}
\]

This is the raw formula of `EVEN_SECTOR_CROSS_ROOT_LIMIT_BRIDGE.md`; all
lattice values are interpreted by continuity.  A lattice cancellation can
only retain or remove a real zero.  Consequently every nonreal zero of the
finite transform comes from a root \(y=s^2\) of \(p_\kappa\), and every
nonreal square root of a nonlattice root gives such a transform zero.
A real root is admissible exactly when it belongs to
\(( -\infty,-\delta^2]\cup[0,\infty)\).

### Theorem 5.1 (definite shifted pencil)

Continue under (4.3), and assume that for some real `sigma`,

\[
 C=K+\sigma T_-\succ0.
\tag{5.3}
\]

Put

\[
 R=C^{-1/2}T_-C^{-1/2}.
\tag{5.4}
\]

Then `R` is nonsingular Hermitian, every root of `p_kappa` is real, and if
`r` ranges over `spec(R)`, the roots are

\[
 \boxed{y={1\over r}-\sigma.}
\tag{5.5}
\]

Moreover, by (5.2a), the finite transform has no nonreal zero in
`|Im z|<1/2` if and only if

\[
 \boxed{
 (I-\sigma R)\bigl(I+(\delta^2-\sigma)R\bigr)\succeq0.}
\tag{5.6}
\]

**Proof.**  From (4.5),

\[
 K-yT_-=C-(y+\sigma)T_-.
\tag{5.7}
\]

Congruence by `C^(-1/2)` turns this into
`I-(y+sigma)R`.  Positivity of `C` and the factorization
`C=T_-(X+sigma I)` force `T_-`, and hence `R`, to be nonsingular.  This
proves (5.5) and, by (4.10), real-rootedness of \(p_\kappa\).  For real `y`,
strip exclusion is exactly
`y(y+delta^2)>=0`.  Substituting (5.5) and multiplying by the positive
number `r^2` gives

\[
 (1-\sigma r)(1+(\delta^2-\sigma)r)\ge0,
\tag{5.8}
\]

which is equivalent to (5.6) by spectral calculus.  \(\square\)

Two useful specializations are:

1. If \(K\succ0\), take \(\sigma=0\).  Then (5.6) is exactly

   \[
    \boxed{K+\delta^2T_-\succeq0.}
   \tag{5.9}
   \]

   This permits negative odd directions whose associated imaginary roots
   lie beyond the strip.

2. If \(T_-\succ0\), put
   \(Y=T_-^{-1/2}KT_-^{-1/2}\).  The roots are the eigenvalues of \(Y\), and
   strip exclusion is exactly

   \[
    \boxed{Y(Y+\delta^2I)\succeq0,}
   \tag{5.10}
   \]

   equivalently

   \[
   \boxed{KT_-^{-1}K+\delta^2K\succeq0.}
   \tag{5.11}
   \]

The strict graph gate does not by itself give this stronger finite-strip
conclusion.  For \(N=1\), take \(b_1=q>0\), zero raw diagonal, and

\[
 x_0=1,
 \qquad x_1=-{1+\tau\over2\tau},
 \qquad q,\tau>0.
\tag{5.12}
\]

After forcing the shell diagonal,

\[
 \boxed{
 w_{01}={q(1+\tau)\over\tau}>0,
 \qquad p_\kappa(y)=-{y+\tau\over\tau},}
\tag{5.13}
\]

so \(T_+\succeq0\) has the anchor as its simple kernel for every \(\tau>0\).
In the one-dimensional odd space,

\[
 \boxed{
 K={2q\tau\over1+\tau},
 \qquad T_-=-{2q\over1+\tau},
 \qquad K+\delta^2T_-={2q(\tau-\delta^2)\over1+\tau}.}
\tag{5.14}
\]

Thus \(0<\tau<\delta^2\) passes the strict graph gate but has the root
\(-\tau\), hence a finite imaginary zero inside the half-strip.  The shifted
pencil is an alternative gate with a stronger finite-strip conclusion; it is
not needed by the axis-rooted locally uniform limit route below.

The shifted gates are weaker than positivity of the complete forced matrix.
They are still unproved for the actual source on an unbounded schedule.  They
also deliberately exclude complex `y`-roots; complex roots can be harmless
when they lie beyond the physical parabola, so the gates are sufficient and
not necessary for finite-strip exclusion.

## 6. Identical-inertia inside/outside counterfamily

Fix `N=2` and a real parameter `t>0`.  Define raw even coefficients

\[
 x_0={t^2\over4},
 \qquad
 x_1=-{1+t^2\over6},
 \qquad
 x_2={16+t^2\over24}.
\tag{6.1}
\]

They are all nonzero and

\[
 x_0+2x_1+2x_2=1.
\tag{6.2}
\]

The interpolation identities at `0,1,4` give exactly

\[
 \boxed{p_t(y)=y^2+t^2,}
\tag{6.3}
\]

with roots `+/-i t`.

Take the exact source-Cauchy parameters

\[
 b_1=1,
 \qquad b_2=0,
 \qquad a_0=a_1=a_2=0,
\tag{6.4}
\]

extend by inversion, and force the diagonal by (1.4).  The only nonzero
off-diagonal edges of the even graph are

\[
 \boxed{
 w_{01}=-2x_0x_1>0,
 \qquad
 w_{12}={4\over3}x_1x_2<0.}
\tag{6.5}
\]

This is a signed tree.  Its reduced incidence matrix is invertible, so the
even quotient inertia is exactly `(1,1)`, with the anchor as the simple zero
eigenvector.  The parity factorization has nonsingular `K` and
`det X=t^2>0`.  Since `X` has a nonreal pair, `T_-` cannot be definite; in
dimension two its inertia is also exactly `(1,1)`.

Nevertheless,

\[
 v(\mathord\pm it)^2={t\over2}.
\tag{6.6}
\]

For the same physical `delta` in (5.2), choose

\[
 t=\delta^2
 \quad\hbox{or}\quad
 t=4\delta^2.
\tag{6.7}
\]

The first family has \(v=\delta/\sqrt2<\delta\), so its nonreal transform zeros
lie inside the open half-strip.  The second has
\(v=\sqrt2\,\delta>\delta\), so they lie outside.  Both parity inertias and all
source-Cauchy structural hypotheses are identical.  Therefore inertia,
source displacement, nonzero anchor coordinates, and a simple forced
eigenline do not imply a quantitative strip bound.

This is a structural source-Cauchy family, not a pinned arithmetic Weil
matrix.

## 7. Exact remaining target and non-implications

For a source-selected, projection-convergent unbounded schedule with
\(N\ge1\), the clean division-free arithmetic premise is

\[
 \boxed{
 w_{ij}=-A_{ij}\kappa_i\kappa_j,
 \qquad L_w\succeq0,
 \qquad\ker L_w=\mathbb C\mathbf1.}
\tag{7.1}
\]

This single strict signed-Laplacian premise first forces every anchor
coordinate to be nonzero by (1.3b), then makes (1.4) well-defined, and then
makes the anchor the simple lowest even eigenvector of the forced
source-Cauchy block.  The finite theorem and degenerate-boundary closure in
`EVEN_SECTOR_CROSS_ROOT_LIMIT_BRIDGE.md` therefore make every corresponding
transform axis-rooted.  Combined with the local-uniform prolate-anchor
transform bridge recorded in `PROJECTIVE_LOW_MODE_DETERMINANT_BRIDGE.md`, the
axis-rooted Hurwitz lemma in the even-sector note would force every zero of
\(\Xi\) in the open half-strip to be real.  Thus (7.1), on a schedule meeting
those already stated convergence hypotheses, is by itself sufficient for
the conditional RH route.  It does not assert that (7.1) holds for the
actual source.

When the positive-edge graph is connected, Theorem 2.2 gives the equivalent
strict effective-resistance target

\[
 \boxed{\mathcal R_-\prec I.}
\tag{7.2}
\]

The non-strict inequality \(\mathcal R_-\preceq I\) gives only
\(L_w\succeq0\) and permits additional kernel directions at eigenvalue one.
Without the connected positive-edge hypothesis, neither effective-resistance
formulation is available as stated.  A definite shifted pencil satisfying
(5.6), or a direct parabolic exclusion allowing complex roots beyond
\(v(y)=\delta\), is an alternative target with a stronger finite-strip
conclusion, not an additional premise required by the axis-rooted limit
route.

No current repository theorem proves (7.1), (7.2), or either stronger
finite-strip alternative for the pinned matrices on an unbounded schedule.
In particular:

- logarithmic high-mode coercivity is removed by the exact cancellation
  (3.5);
- absolute bounds for `b_n` do not determine the signs or effective
  resistances in (3.3)--(3.4);
- a bounded Morse index only bounds the number of complex pairs through
  (4.11), not their height;
- fixed-mode anchor asymptotics do not justify every division in (1.4) on a
  growing schedule; and
- the known fixed-`N=2` anchor limit has polynomial `y^2+y+4`, so no
  positivity theorem valid for every finite projection can hold.

The last fixed-rank obstruction is not projection-convergent and therefore
does not disprove a successful growing-cutoff theorem.  Conversely, proving
the strict actual-source gate would supply the missing zero geometry rather
than follow formally from source-Cauchy structure.  This package records the
conditional route without promoting the gate to an established sign or the
route to an RH proof.
