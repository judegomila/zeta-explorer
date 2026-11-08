# Positive interpolation of the exact xi response: two nodes, a passive recurrence, and the missing induction

Research note, 8 November 2026. This gives a constructive finite-ladder
form of the remaining realization problem. An analytic theorem proves
positive interpolation for every pair of positive real nodes using the
actual theta kernel. An explicit recurrence preserves positive-realness
when its scalar pivots are positive. Positivity of every later pivot is
not proved; that all-orders statement remains RH-strength.

No novelty or RH proof claim is made. The two-node result below is an
application of the known squared-variable theta concavity. The
positive-real interpolation recurrence is a half-plane form of the
classical Schur/Pick construction.

## 1. Exact target and the positive theta input

Use

\[
F(w)=\xi(1/2+w)=\int_{\mathbb R}\kappa(u)e^{wu/2}\,du,
\qquad L(w)=F'(w)/F(w).
\]

The kernel is positive, even, smooth, and superexponentially decaying.
Its known strict squared-variable concavity is

\[
\frac{d^2}{dx^2}\log\kappa(\sqrt x)<0\qquad(x>0).
\tag{1.1}
\]

This is Csordas, *Fourier transforms of positive definite kernels and the
Riemann xi-Function*, arXiv:1309.0055v2, Theorem 4.2(b), under the exact
normalization `kappa(u)=Phi(u/4)`. The formula for Phi is equation (4.2) of
that paper. No zero-location hypothesis enters (1.1).

Set

\[
q(u)=-\frac{\kappa'(u)}{u\kappa(u)},\qquad u>0.
\tag{1.2}
\]

The known decrease of kappa gives `q>0`; (1.1) gives `q'>0`.
Indeed, if `kappa(u)=exp(-V(u^2))`, then `q=2V'(u^2)` and
`q'=4u V''(u^2)>0`. This q is the reciprocal of the earlier commutator
coefficient b; it is not the modular variable also called q in PR #46.

## 2. A covariance identity for the real xi logarithmic derivative

For `w>0`, put `theta=w/2` and define a probability measure on `(0,infinity)`
by

\[
d\nu_\theta(u)=
\frac{u\kappa(u)\sinh(\theta u)\,du}
{\int_0^\infty v\kappa(v)\sinh(\theta v)\,dv}.
\tag{2.1}
\]

All integrals below converge by the theta tail. Let

\[
I=\int_0^\infty u\kappa(u)\sinh(\theta u)\,du,
\qquad J=\int_0^\infty\kappa(u)\cosh(\theta u)\,du.
\]

Then `F(w)=2J`, `F'(w)=I`. Integration by parts, with zero boundary
terms, gives

\[
\theta J=-\int_0^\infty\kappa'(u)\sinh(\theta u)\,du
=I\,\mathbb E_{\nu_\theta}q.
\]

Consequently

\[
\boxed{\frac{L(w)}w=\frac1{4\mathbb E_{\nu_\theta}q}.}
\tag{2.2}
\]

Differentiating the normalized expectation gives the exact identity

\[
\boxed{
\frac{d}{dw}\frac{L(w)}w
=-\frac{\operatorname{Cov}_{\nu_\theta}
\bigl(q(u),u\coth(\theta u)\bigr)}
{8(\mathbb E_{\nu_\theta}q)^2}<0.
}
\tag{2.3}
\]

For the sign, both functions in the covariance are strictly increasing.
For the second one,

\[
\frac d{du}[u\coth(\theta u)]
=\frac{\sinh(2\theta u)-2\theta u}{2\sinh^2(\theta u)}>0.
\]

Strict positivity follows from the identity

\[
\operatorname{Cov}_\nu(f,g)
=\frac12\iint(f(u)-f(v))(g(u)-g(v))\,d\nu(u)d\nu(v)
\]

and the strictly positive density of nu. Differentiation under the
integrals is justified on every compact positive theta interval by
superexponential domination, also for the factors q that can be replaced
by `-kappa'/(u kappa)` in the integrands.

Independently, the tilted full-line probability density proportional to
`kappa(u) exp(wu/2)` gives

\[
L'(w)=\frac14\operatorname{Var}_w(u)>0.
\tag{2.4}
\]

Thus the actual xi target obeys, unconditionally,

\[
\boxed{L(w)>0,\qquad 0<wL'(w)<L(w)\qquad(w>0).}
\tag{2.5}
\]

These are real-axis statements, not positive-realness on a complex
half-plane.

## 3. Every two-node real-axis Pick matrix is positive

For distinct positive real nodes `x>y`, write `A=L(x)` and `B=L(y)`.
Define

\[
K(x,y)=
\begin{pmatrix}
A/x&(A+B)/(x+y)\\
(A+B)/(x+y)&B/y
\end{pmatrix}.
\tag{3.1}
\]

Its diagonal entries are positive. Its determinant factors exactly as

\[
\boxed{
\det K(x,y)=
\frac{(xA-yB)(xB-yA)}{xy(x+y)^2}>0.
}
\tag{3.2}
\]

The first numerator factor is positive because `L>0` and `L'>0`.
The second is positive because `L(w)/w` is strictly decreasing by (2.3).
This proves strict positive definiteness for every such pair of nodes,
without numerical sampling or RH.

The matrix is the two-node positive-real Pick matrix for L on the right
half-plane. This theorem supplies all two-node interpolation problems on
the positive real axis. It does not establish the three-node condition,
the corresponding condition at arbitrary complex nodes, or positivity of
the entire kernel.

## 4. An explicit positive oscillator matching exact xi data

Define

\[
\tau^2=\frac{xy(xA-yB)}{xB-yA}>0,
\qquad
C=\frac{AB(x^2-y^2)}{xB-yA}>0.
\tag{4.1}
\]

Then the rational function

\[
\boxed{L_{x,y}(z)=\frac{Cz}{z^2+\tau^2}}
\tag{4.2}
\]

interpolates the exact target at both nodes:

\[
L_{x,y}(x)=L(x),\qquad L_{x,y}(y)=L(y).
\]

It is positive-real on `Re z>0`, since

\[
L_{x,y}(z)=\frac C2\left(\frac1{z-i\tau}+
\frac1{z+i\tau}\right)
\]

has strictly positive real part there. This is a single positive
oscillator with an exact two-point fit to xi. Its frequency tau is a
parameter of an auxiliary realization, not a claimed xi zero.

For illustration only, 60-digit mpmath evaluation at `(x,y)=(2,1)` gives

\[
\tau\approx25.0718753984469711,
\qquad C\approx29.0471312180206568.
\]

The formulas and positivity proof do not depend on these diagnostics.
The model has a finite rational response and does not match the full xi
function or its logarithmic high-energy behavior.

## 5. A recurrence that preserves positivity exactly

Fix a positive real interpolation node `a` and a positive target value
`p=L(a)`. The positive-real Schur reduction is

\[
\boxed{
R_a(z)=\frac{zL(z)-ap}{zp-aL(z)}.
}
\tag{5.1}
\]

This follows by removing the half-plane Blaschke factor `(z-a)/(z+a)`
from `(L-p)/(L+p)`, then applying the inverse Cayley transform. If L is
already positive-real throughout the right half-plane, the Schwarz lemma
makes the reduced function positive-real as well, with the usual
removable-value interpretation, unless an extremal rational case causes
the interpolation to terminate. Such termination is handled separately
rather than treating an identically infinite reduction as a function.

Our real-axis theorem proves, without that global assumption,

\[
R_a(x)>0\qquad(x>0),
\]

and at the removable point

\[
\boxed{R_a(a)=\frac{p+aL'(a)}{p-aL'(a)}>0.}
\tag{5.2}
\]

For `x>a` both numerator and denominator in (5.1) are positive; for
`0<x<a` both are negative. Equation (2.5) gives the strict denominator
sign in (5.2). This does not prove the absence of complex poles of R_a.

### The inverse map gives an explicit passive construction

The inverse is

\[
\boxed{
L(z)=p\frac{zR(z)+a}{z+aR(z)}.
}
\tag{5.3}
\]

For every analytic positive-real R on the right half-plane, this formula
defines an analytic positive-real L. The denominator cannot vanish,
because `Re(z+aR)>0`. Positivity has the direct energy identity

\[
\boxed{
\Re L(z)=p\frac{
(|z|^2+a^2)\Re R(z)+a(1+|R(z)|^2)\Re z}
{|z+aR(z)|^2}>0.
}
\tag{5.4}
\]

This is an algebraic preservation theorem, not a numerical test.

Choose distinct nodes `a1,a2,...` in `[1,2]`, beginning with `a1=1`, and
define the exact successive reduced targets and pivots by

\[
L_0=L,\qquad p_j=L_{j-1}(a_j),\qquad
L_j(z)=\frac{zL_{j-1}(z)-a_jp_j}
{zp_j-a_jL_{j-1}(z)}.
\tag{5.5}
\]

Whenever the first N pivots are finite and positive, start with any
positive-real terminal function and apply (5.3) backward through those N
stages. The resulting rational function, for a rational terminal choice,
is positive-real and interpolates the original exact data at the first N
nodes. Choosing the terminal function `R(z)=z` also keeps the construction
odd and real, giving a finite lossless rational realization.

The theorem above proves positivity of p1 and p2 for any distinct first
two positive nodes. It does not prove positivity of every subsequent
pivot. Degenerate interpolation cases require the usual termination or
semidefinite treatment rather than dividing by a zero pivot.

### The precise obstruction to iterating the covariance proof

Write (5.1) as

\[
R_a(z)=\frac{zF'(z)-apF(z)}{pzF(z)-aF'(z)}.
\]

In the same bilateral transform convention, the numerator and denominator
have exact kernels

\[
\kappa_N(u)=-u\kappa'(u)-(1+ap)\kappa(u),
\]

\[
\kappa_D(u)=-2p\kappa'(u)-(a/2)u\kappa(u)
=u\kappa(u)[2p q(u)-a/2].
\tag{5.6}
\]

These are signed. In particular, `kappa_N(0)=-(1+ap)kappa(0)<0`,
whereas it is positive for sufficiently large positive u. For the second
kernel, the sign threshold is

\[
q(u)=\frac{a}{4p}=\mathbb E_{\nu_{a/2}}q.
\]

Since q is strictly increasing, this expectation lies strictly between
its endpoint values, so kappa_D changes sign on the positive half-line.
The original positive-kernel covariance proof therefore does not
automatically apply to the next reduction. A successful induction must
control these transformed signed kernels, or find a representation of the
reduced functions that preserves the required stronger structure.

## 6. Why a positive finite-ladder construction would suffice

Take nested finite node sets whose union is dense in `[1,2]`, with node 1
in every set. Suppose that for every N there is a function `G_N`, analytic
and positive-real throughout the right half-plane, that interpolates the
first N exact values `L(a_j)`. No uniform control of an infinite
Hamiltonian is assumed here.

Then the Cayley transforms

\[
S_N(z)=\frac{G_N(z)-1}{G_N(z)+1}
\]

form a bounded normal family. Their fixed value at 1 lies strictly inside
the unit disk because `G_N(1)=L(1)>0`. Every locally uniformly convergent
subsequence therefore has a Schur limit that is not identically 1. The
inverse Cayley transform gives an analytic positive-real limit `L_*` on
the entire right half-plane. For each fixed j, eventual interpolation
gives `L_*(a_j)=L(a_j)`.

The target L is unconditionally analytic in a neighborhood of `[1,2]`.
The interpolation nodes have an interior accumulation point, so analytic
uniqueness gives `L_*=L` there. The meromorphic identity theorem then
gives equality throughout the right half-plane. Any zero of F there
would force a nonremovable pole of L, contradicting analyticity of L_*.
Xi symmetry therefore gives RH.

The same uniqueness shows that all such interpolants converge locally
uniformly to the exact target if they exist for every N. The fixed
positive value at the anchor replaces a separate global tail estimate in
this compactness argument. It does not supply the missing positivity of
the interpolants.

### The exact matrix induction to target

For the chosen real nodes, form

\[
(K_N)_{ij}=\frac{L(a_i)+L(a_j)}{a_i+a_j}.
\tag{6.1}
\]

Classical Pick interpolation says that a positive-real interpolant exists
precisely when this matrix is positive semidefinite. If K_N is positive
definite, the next condition is the scalar Schur complement

\[
\boxed{
\Delta_N=
\frac{L(a_{N+1})}{a_{N+1}}-k_N^*K_N^{-1}k_N\ge0,
\quad
(k_N)_i=\frac{L(a_i)+L(a_{N+1})}{a_i+a_{N+1}}.
}
\tag{6.2}
\]

For a singular K_N the exact condition additionally requires
`k_N in Ran K_N` and uses the Moore--Penrose inverse. Entrywise positivity
of K_N is not enough. The analytic theorem in Section 3 proves the first
nontrivial extension for every pair, but no induction for all N is claimed.

This gives a concrete research target: derive from theta/prime data a
nonnegative representation or a preserved cone for every reduced pivot
or Schur complement. The passive recurrence and compactness theorem then
handle construction and convergence. More finite numerical checks alone
would not prove the needed induction.

## 7. Why safe-shift continuation does not bypass this induction

For `a>=1/2`, the shifted function `L_a(z)=L(a+z)` is unconditionally
analytic and positive-real on `Re z>0`. More generally, if

\[
\beta_* = \sup\{\Re\rho:F(\rho)=0\},
\]

then L_a is analytic and positive-real precisely for `a>=beta_*`.
The forward implication is forced by its logarithmic poles. The reverse
follows from the symmetric Hadamard product: each real-part summand
`Re[1/(a+z-rho)]` is positive when `Re(a+z)>beta_*`.
This is the classical zero-free-half-plane monotonicity underlying the
Sondow--Dumitrescu theorem.

The exact evolution is only translation:

\[
\partial_aL_a=\partial_zL_a.
\]

Its Pick kernel is

\[
K_a(z,w)=\frac{L(a+z)+\overline{L(a+w)}}{z+\bar w}.
\]

At the same outer points, the desired unshifted Pick kernel is

\[
\boxed{
K_0(a+z,a+w)=
\frac{z+\bar w}{z+\bar w+2a}K_a(z,w).
}
\tag{7.1}
\]

The scalar multiplier is not a positive kernel. At distinct real nodes
`x,y>0`, its two-by-two determinant is

\[
-\frac{a(x-y)^2(a+x+y)}
{(a+x)(a+y)(2a+x+y)^2}<0.
\tag{7.2}
\]

Consequently inward continuation is not a positivity-preserving Schur
multiplier operation. The safe outer half-plane cannot be transported to
the critical line by a generic positivity theorem. The new arithmetic or
theta estimate must enter through the exact continuation, interpolation,
or energy condition.

## Sources and verification scope

- George Csordas, *Fourier transforms of positive definite kernels and the
  Riemann xi-Function*, arXiv:1309.0055v2, Theorem 4.2(b):
  https://arxiv.org/html/1309.0055v2 . The covariance and interpolation
  formulas are derived above from that input.
- John E. McCarthy, *Pick's Theorem—What's the Big Deal?*, American
  Mathematical Monthly 110 (2003), 36–45, Theorem 1:
  https://www.math.wustl.edu/~mccarthy/public_papers/MonthlyWtbd.pdf .
  The right-half-plane form follows by Cayley transformations.
- Jonathan Sondow and Cristian Dumitrescu, *A monotonicity property of
  Riemann's xi function and a reformulation of the Riemann Hypothesis*,
  Periodica Mathematica Hungarica 60 (2010), 37–40:
  https://arxiv.org/pdf/1005.1104 .

The two determinant factorizations were checked symbolically. The
covariance constants, strict signs, and normalization were independently
checked. The optional oscillator decimals are ordinary high-precision
diagnostics, not interval certificates. All-orders pivot positivity and
the corresponding RH conclusion remain unproved.
