# Adaptive outer cutoff: Fourier-section hyperbolicity barrier

## 0. Exact outcome and claim boundary

Fix `lambda>1` and let `X_lambda` be the real inversion-even compact-interval
prolate comparison state before the outer Fourier projection.  This note
asks whether increasing the outer cutoff `N` can force the raw anchor
polynomial \(p_{\lambda,N}\) to have `N` distinct real projective roots.

There is an exact one-way theorem.  The Fourier-section quotients converge
locally uniformly away from the squared lattice to a meromorphic quotient
of the full compact-support transform.  If a cofinal sequence of the raw
polynomials is strictly real-projective-rooted, then the square-variable
full transform is in the Laguerre--Polya class.  Thus adaptive `N` cannot
create finite hyperbolicity while leaving a fixed off-axis zero in the full
transform.

The converse is not supplied by compact convergence or by the definition of
the Laguerre--Polya class.  That definition provides some hyperbolic
polynomial approximants (equivalently the classical Jensen-polynomial
tests), whereas \(p_{\lambda,N}\) is a prescribed Fourier-cardinal numerator.
Nonreal roots can escape through projective infinity and disappear on every
fixed compact.  A separate Fourier-section stability or no-escape theorem is
therefore required.

The shifted definite-pencil gate has the same strict-real-root prerequisite:
whenever it holds, the raw polynomial is real-rooted before its negative
roots are tested against the physical half-strip.  It is not a way around
the Laguerre--Polya barrier.

No theorem below proves Laguerre--Polya membership for the actual fixed
`lambda` transform, eventual hyperbolicity of its Fourier sections, an
unbounded adaptive schedule, equation (5.2) of `DIRECT_RH_ATTACK.md`, a
Riemann-hypothesis conclusion, or a Lambda bound.  No finite diagnostic is
promoted to an enclosure.  The formal project state remains
`P0_INVALIDATED`.

The binding conventions remain those of `P0_SOURCE_LOCK.json` and
`P0_NORMALIZATION_AUDIT.md`: `L=2*log(lambda)`, centered `exp(-izt)`,
Lebesgue measure, zero extension, explicit inversion evenization, the source
normalization of `k_lambda^+`, the inclusive inventory `1<n<=lambda^2`, and
the minus sign of the prime block.

## 1. Fixed-`lambda` Fourier-section limit

Work on `I=[-L/2,L/2]` in the centered source basis

\[
 V_n(t)={(-1)^n\over\sqrt L}e^{2\pi int/L},
 \qquad V_{-n}=JV_n.                                      \tag{1.1}
\]

Write the nonzero real even state and its projections as

\[
 X=x_0V_0+\sum_{n\ge1}x_n(V_n+V_{-n}),
 \qquad X_N=P_NX.                                         \tag{1.2}
\]

Parseval gives `(x_n) in ell^2`.  Put

\[
 D_N(y)=\prod_{n=1}^N(y-n^2),                              \tag{1.3}
\]

\[
 p_N(y)=x_0D_N(y)+2y\sum_{n=1}^Nx_n
             \prod_{\substack{1\le m\le N\\m\ne n}}(y-m^2),
                                                               \tag{1.4}
\]

and, away from the squared lattice,

\[
 \Phi_N(y)={p_N(y)\over D_N(y)}
 =x_0+2y\sum_{n=1}^N{x_n\over y-n^2}.                     \tag{1.5}
\]

### Theorem 1.1 (meromorphic fixed-parameter limit)

The series

\[
 \boxed{\Phi_\infty(y)=x_0+2y\sum_{n\ge1}{x_n\over y-n^2}} \tag{1.6}
\]

converges absolutely and locally uniformly on
\(\mathbb C\setminus\{1,4,9,\ldots\}\).  On every compact set in the
`z`-plane,

\[
 \widehat {X_N}(z)\longrightarrow\widehat X(z)             \tag{1.7}
\]

uniformly, and with `s=zL/(2*pi)`, one has

\[
 \boxed{
 \widehat X(z)={\sqrt L\over\pi}{\sin(\pi s)\over s}
                    \Phi_\infty(s^2).}                    \tag{1.8}
\]

All squared-lattice values in (1.8) are removable continuations.

**Proof.**  If `K` is a compact set avoiding the squared lattice, then for
all sufficiently large `n`,

\[
 \sup_{y\in K}\left|{2yx_n\over y-n^2}\right|
 \le C_K{|x_n|\over n^2}.                                 \tag{1.9}
\]

Cauchy--Schwarz makes `sum |x_n|/n^2` finite, proving the first claim.  On a
compact `z`-set, Cauchy--Schwarz on the finite interval gives

\[
 |\widehat {X_N}(z)-\widehat X(z)|
 \le\sqrt L\,e^{(L/2)|\operatorname {Im}z|}\|X_N-X\|_2,   \tag{1.10}
\]

which tends uniformly to zero.  The exact finite transform identity applied
to (1.4), followed by the two locally uniform limits, proves (1.8).
\(\square\)

This is the correct fixed-`lambda`, \(N\to\infty\) object.  Increasing `N`
removes Fourier truncation; it does not alter the limiting compact-support
transform.

## 2. The square-variable Laguerre--Polya obstruction

Because `X` is real and even, `widehat X` is a real even entire function.
Define the branch-independent entire function

\[
 \boxed{
 \mathcal E_\lambda(y)=
 \widehat X\left({2\pi\over L}\sqrt y\right).}             \tag{2.1}
\]

The even Taylor series makes (2.1) entire in `y`.  Compact support gives

\[
 |\mathcal E_\lambda(y)|\le C e^{C|y|^{1/2}},             \tag{2.2}
\]

so its order is at most `1/2`.

### Theorem 2.1 (cofinal hyperbolicity implies Laguerre--Polya)

Suppose there is a cofinal sequence \(N_j\to\infty\) for which \(p_{N_j}\)
has `N_j` distinct roots in \(\mathbb {RP}^1\).  Then every zero of
\(\mathcal E_\lambda\) is real and

\[
 \boxed{\mathcal E_\lambda\in\mathcal {LP}.}              \tag{2.3}
\]

Equivalently, every zero of `widehat X` lies on the union of the real and
imaginary axes.

**Proof.**  If `y_0` were a nonreal zero of \(\mathcal E_\lambda\), the sine factor
in (1.8) would be nonzero there and `Phi_infinity(y_0)=0`.  Choose a small
closed disk around `y_0` which is disjoint from the real axis, the squared
lattice, and all other boundary zeros.  Theorem 1.1 and Rouche's theorem
would put a zero of every sufficiently late `Phi_(N_j)`, hence of
\(p_{N_j}\), in that disk.  This contradicts real-projective-rootedness.

Thus \(\mathcal E_\lambda\) has only real zeros.  A real entire function of order at
most `1/2` with only real zeros has a genus-zero canonical product with real
factors, and hence belongs to the Laguerre--Polya class.  Finally,
`y=(zL/(2*pi))^2` is real exactly when `z` lies on one of the two coordinate
axes.  \(\square\)

Distinctness in the finite premise is the simple-ground condition from
`FULL_SOURCE_CAUCHY_ANCHOR_FORCING_FEASIBILITY.md`.  For the one-way limit
argument, mere finite real-rootedness would already suffice.

### 2.2 What this does and does not say about `Xi`

For a fixed `lambda`, (2.3) is a property of the full compact-support
prolate transform, not a property of the finite Weil matrix.  On an
unbounded `lambda` sequence for which the already-stated normalization and
projection estimates give

\[
 4\widehat {X_\lambda}\longrightarrow\Xi
 \quad\hbox{locally uniformly in }|\operatorname {Im}z|<1/2, \tag{2.4}
\]

axis-rootedness of every approximant would force every zero of `Xi` in that
strip onto one of the axes.  The elementary positivity of `Xi` on the
closed imaginary segment removes the imaginary-axis alternative.  Thus a
cofinal adaptive theorem on such an unbounded schedule would have
Riemann-hypothesis strength; it is not a routine fixed-cutoff improvement.

For `Xi` itself, real-rootedness in its usual even spectral variable is the
classical Laguerre--Polya target.  For a finite compact transform which may
have imaginary-axis zeros, the precise LP object is the square-variable
function (2.1), not necessarily `widehat X` itself.

## 3. Why Laguerre--Polya is not a Fourier-section converse

The classical Polya--Schur characterization concerns the Taylor/Jensen
polynomials of an entire function.  The polynomials (1.4) instead interpolate
Fourier samples at the moving squared lattice.  Therefore (2.3) is a
necessary condition, not an available converse for this prescribed
sequence.

The failure of a compact-limit converse is exact.  For `R>0`, put

\[
 g_R(y)=\left(1-{y\over R+i}\right)
        \left(1-{y\over R-i}\right)
 =1-{2R\over R^2+1}y+{1\over R^2+1}y^2.             \tag{3.1}
\]

Then `g_R` is a real polynomial with the nonreal roots `R+i` and `R-i`, but

\[
 g_R\longrightarrow1                                      \tag{3.2}
\]

locally uniformly as \(R\to\infty\).  The limit `1` belongs to
\(\mathcal {LP}\).  Thus
nonreal pairs may leave every compact through projective infinity while the
limit is as strongly real-rooted as possible.

There is also no theorem saying that every individual Fourier-cardinal
section of an LP transform is hyperbolic.  On `[-pi,pi]`, take the even
indicator of `[-pi/2,pi/2]`.  Up to a nonzero scalar its transform is

\[
 F(s)={\sin(\pi s/2)\over s},
 \qquad
 E(y)={\sin(\pi\sqrt y/2)\over\sqrt y}\in\mathcal {LP}.    \tag{3.3}
\]

In the centered basis its first raw coefficients are proportional to

\[
 x_0={\pi\over2},\qquad x_1=-1,\qquad x_2=0,
 \qquad x_3={1\over3}.                                   \tag{3.4}
\]

The `N=3` numerator factors as

\[
 p_3(y)=(y-4)
 \left[\left({\pi\over2}-{4\over3}\right)y^2
 +\left({52\over3}-5\pi\right)y+{9\pi\over2}\right].   \tag{3.5}
\]

The quadratic discriminant is

\[
 {16\over9}(9\pi^2-84\pi+169)<0.                         \tag{3.6}
\]

For example, the last sign follows exactly from `157/50<pi<22/7`: the
quadratic in parentheses is decreasing on that interval and is already
negative at `157/50`.  This fixed finite counterexample does not by itself
rule out eventual hyperbolicity for that function.  It proves the required
logical point: LP membership does not turn the prescribed Fourier-section
map into a hyperbolicity preserver.

For the actual sequence, Theorem 1.1 implies the following sharp compact
statement.  If \(\mathcal E_\lambda\in\mathcal {LP}\) and its zero in a chosen compact is
simple, then all sufficiently late section zeros in a small disk around it
are real: there is exactly one, and conjugation forces it onto the real
axis.  Compact convergence leaves only

1. pairs escaping to projective infinity; and
2. conjugate pairs collapsing onto multiple real limit zeros.

Eliminating these two branches is the missing Fourier-section stability
theorem.  Neither ordinary `L2` projection convergence nor LP membership
eliminates them.

## 4. Leading coefficient and projective ill-conditioning

The leading coefficient of (1.4) is

\[
 c_N=x_0+2\sum_{n=1}^Nx_n.                                \tag{4.1}
\]

If the finite roots are `r_(1,N),...,r_(N,N)`, Vieta's formula and the
expansion of (1.5) at infinity give

\[
 \boxed{
 \sum_{j=1}^Nr_{j,N}
 =\sum_{n=1}^Nn^2-{2\sum_{n=1}^Nn^2x_n\over c_N}.}         \tag{4.2}
\]

At `c_N=0`, the homogenized polynomial has a projective root at infinity.
When `c_N` is merely tiny, (4.2) permits a very large finite root.  Dividing
the rank-one secular matrix by a binary64 reconstruction of `c_N` is then
not a certified root test.

### Proposition 4.1 (exact false-complex-root fixture)

Let `t=10^(-9)` and set

\[
 c=t^2,\qquad b=-2t(1+t),\qquad d=1,
 \qquad p(y)=cy^2+by+d.                                  \tag{4.3}
\]

Then

\[
 \operatorname {disc}p=b^2-4cd=4t^2(2t+t^2)>0,            \tag{4.4}
\]

so the two roots are real and distinct.  Its exact `N=2` raw anchor
coordinates are

\[
 x_0={d\over4},\qquad
 x_1=-{d+c+b\over6},\qquad
 x_2={16c+d+4b\over24}.                                  \tag{4.5}
\]

They satisfy (1.4) exactly and `x_0+2x_1+2x_2=c`.  If the three coordinates
are independently rounded to IEEE binary64 and (4.1) and the lower
coefficients are then reconstructed in the displayed summation order, the
computed discriminant is negative.  The exact-real polynomial is therefore
reported as a complex conjugate pair.  This is a deterministic conditioning
fixture, not an actual-source diagnostic.

Certified work near a projective-infinity branch must retain exact or ball
arithmetic for the raw coefficients and leading cancellation, or use a
Hermitian congruence/pencil whose definiteness is itself certified.

## 5. The shifted pencil has the same real-root barrier

For the diagonally forced source block, use the notation of
`DIAGONAL_ANCHOR_FORCING_SIGNED_LAPLACIAN_STRIP_GATE.md`:

Assume its nondegenerate branch
\(c_N=\langle\eta,\kappa_N\rangle\ne0\) and
\((\kappa_N)_0\ne0\).  These hypotheses deliberately exclude the projective
infinity branch from this pencil chart.

\[
 K_N=D T_{+,N}D^*,\qquad
 C_N(\sigma)=K_N+\sigma T_{-,N}.                         \tag{5.1}
\]

If some real `sigma` satisfies

\[
 C_N(\sigma)\succ0,                                      \tag{5.2}
\]

then the factorization inherited from the source commutator gives
\(C_N(\sigma)=T_{-,N}(\mathsf X_N+\sigma I)\), where
\(\mathsf X_N=DD^*-|u\rangle\langle d|\) is the odd-space anchor matrix.
Since `C_N(sigma)` is invertible,
\(T_{-,N}\) is nonsingular.  Consequently the Hermitian matrix

\[
 R_N=C_N(\sigma)^{-1/2}T_{-,N}C_N(\sigma)^{-1/2}          \tag{5.3}
\]

has real nonzero spectrum and every raw root is

\[
 y={1\over r}-\sigma,qquad r\in\operatorname {spec}R_N. \tag{5.4}
\]

Thus any cofinal shifted-definite-pencil theorem implies the premise of
Theorem 2.1, apart from possible multiplicities.  The additional half-strip
condition

\[
 (I-\sigma R_N)(I+(\delta^2-\sigma)R_N)\succeq0,
 \qquad\delta={L\over4\pi},                              \tag{5.5}
\]

only locates the already-real roots in
`(-infinity,-delta^2] union [0,infinity)`.  In the specialization
\(K_N\succ0\), it is
\(K_N+\delta^2T_{-,N}\succeq0\).

Consequently the shifted pencil may weaken a matrix positivity hypothesis,
but it does not weaken the strict-real-root analytic requirement.  Proving
it eventually at fixed `lambda` still requires the LP condition plus the
Fourier-section stability missing in Section 3.  Proving it on an unbounded
projection-convergent `lambda` schedule would supply the unresolved zero
geometry itself.

## 6. Exact remaining condition

The adaptive outer-cutoff route reduces to one of the following genuinely
new inputs.

1. Prove directly that the actual Fourier-cardinal numerators \(p_{\lambda,N}\)
   are eventually strictly hyperbolic, with the projective-infinity and
   multiple-limit branches controlled.
2. Prove \(\mathcal E_\lambda\in\mathcal {LP}\), simplicity of the relevant full-transform
   zeros, and a source-specific outer-root/no-escape theorem for (1.4).
3. Certify a cofinal shifted definite pencil and its half-strip inequality;
   by Section 5 this already contains the same real-root theorem.

Fixed-parameter `L2` convergence, fixed-compact transform convergence,
ordinary Laguerre--Polya membership, and isolated finite positive matrices
do not supply any of these uniform conclusions.  The formal state remains
`P0_INVALIDATED`.
