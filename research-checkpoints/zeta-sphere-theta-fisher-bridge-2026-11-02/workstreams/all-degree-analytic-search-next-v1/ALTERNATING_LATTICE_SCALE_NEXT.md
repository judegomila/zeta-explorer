# Alternating-lattice scale audit and a compact lobe certificate

## Outcome

Let

\[
 K(r)=\int_{\mathbb R}u^2\Phi(u+r)\Phi(u-r)\,du,
 \qquad
 D_\delta(r)=\sum_{n\in\mathbb Z}(-1)^nK(r+n\delta).
                                                               \tag{1}
\]

This note tests whether complete-theta modularity transfers the proved
large-spacing sign of `D_delta` to smaller spacings.  It does not.  The exact
obstructions are:

1. simultaneous modular inversion is only the reflection `u -> -u` inside
   the Ewald integral and leaves `delta` fixed;
2. additive refinement by an odd integer is closed, but gives an alternating
   combination of the coarser `D`, not a positive combination;
3. refinement by an even integer introduces the ordinary periodization, so it
   is not closed on `D` at all;
4. Poisson reciprocity changes both the kernel (`K` to `hat K`) and the lattice
   characteristic (a twist to a half-shift).  Closing it by assuming the sign
   of `hat K` assumes the unknown first Laguerre sign.

Thus the natural scale-duality closure is circular.  There is, however, a
noncircular direct-space extension of the previous large-spacing method: an
exact finite-block lobe criterion with a rigorously controlled convex tail.
It permits early lobe pairs to have the wrong sign and reduces every compact
spacing interval bounded away from zero to one finite two-parameter
inequality involving only `K` and its derivatives.  A complete-theta interval
scheme for certifying that inequality is given below.

Pointwise `D_delta >= 0` remains a stronger sufficient condition for the first
Laguerre inequality, not an equivalent reformulation.  No global sign, RH, or
all-degree claim is made.

## 1. Modular inversion fixes the lattice spacing

Write

\[
 \mathcal P(z)=\sum_{a\geq1}\pi a^2(2\pi a^2z-3)
 z^{5/4}e^{-\pi a^2z},
 \qquad \mathcal P(z)=\mathcal P(z^{-1}),          \tag{2}
\]

so that `Phi(t)=mathcal P(e^{4t})`.  The complete multiplicative-Ewald
integrand is

\[
 \mathcal E_{\delta,r}(u)=\sum_{n\in\mathbb Z}(-1)^n
 \mathcal P(e^{4(u+r+n\delta)})
 \mathcal P(e^{4(u-r-n\delta)}),                  \tag{3}
\]

and

\[
 D_\delta(r)=\int_{\mathbb R}u^2\mathcal E_{\delta,r}(u)\,du. \tag{4}
\]

Apply (2) to both factors of a term in (3).  After commuting the two scalar
factors, the result is exactly the term at `-u`:

\[
\begin{aligned}
 &\mathcal P(e^{-4(u+r+n\delta)})
  \mathcal P(e^{-4(u-r-n\delta)})\\
 &\qquad=
 \mathcal P(e^{4(-u+r+n\delta)})
 \mathcal P(e^{4(-u-r-n\delta)}).
\end{aligned}                                             \tag{5}
\]

Consequently modular inversion proves only

\[
 \mathcal E_{\delta,r}(u)=\mathcal E_{\delta,r}(-u).       \tag{6}
\]

The step `delta` is unchanged.  In the multiplicative variable
`q=e^{4 delta}`, inversion sends `q^n` to `q^{-n}`; reindexing sends `n` to
`-n` and restores the same lattice.  Equivalently it sends `delta` to
`-delta`, and

\[
 D_{-\delta}(r)=D_\delta(r)                               \tag{7}
\]

is the trivial reindexing identity.  It does not send `delta` to a positive
reciprocal or to a different positive spacing.

Inverting only one factor does not help.  In logarithmic variables it sends

\[
 (u,r+n\delta)\longmapsto(-(r+n\delta),-u),                \tag{8}
\]

so the continuous integration coordinate and the discrete lattice coordinate
are exchanged.  There is no common new integration variable independent of
`n`.  Turning (8) into a lattice identity requires a separate Fourier/Poisson
step; modular reflection alone supplies no such step.

This proves the first obstruction: the modular group acting in (3) preserves
the magnitude of the additive log-spacing.

## 2. Exact integer rescaling, and why it is not one-sided

Let

\[
 P_h(r)=\sum_{m\in\mathbb Z}K(r+mh)                       \tag{9}
\]

be the ordinary periodization.  Decompose `n=Nm+a`, with
`0 <= a <= N-1`.  If `N` is odd, then `(-1)^{Nm}=(-1)^m` and

\[
 \boxed{
 D_\delta(r)=\sum_{a=0}^{N-1}(-1)^aD_{N\delta}(r+a\delta),
 \qquad N\ \hbox{odd}.
 }                                                        \tag{10}
\]

If `N` is even, the inner twist disappears instead:

\[
 \boxed{
 D_\delta(r)=\sum_{a=0}^{N-1}(-1)^aP_{N\delta}(r+a\delta),
 \qquad N\ \hbox{even}.
 }                                                        \tag{11}
\]

The simplest even identity is

\[
 \boxed{D_\delta(r)=P_{2\delta}(r)-P_{2\delta}(r+\delta).} \tag{12}
\]

For `0 <= r <= delta/2`, evenness and periodicity rewrite the second term as
`P_{2 delta}(delta-r)`.  Thus the desired sign is exactly a midpoint comparison
inside the ordinary periodization; (12) does not prove that comparison.

For `N=3`, evenness and antiperiodicity give the especially transparent
identity

\[
 \boxed{
 D_\delta(r)=D_{3\delta}(r)
 -D_{3\delta}(\delta-r)-D_{3\delta}(\delta+r),
 \qquad 0\leq r\leq\delta/2.
 }                                                        \tag{13}
\]

All three terms on the right lie in the nonnegative half-cell if the
large-spacing theorem applies to `3 delta`.  Two of them are nevertheless
subtracted.  Positivity of the coarser lattice therefore gives no one-sided
information about the finer lattice.  One would additionally need

\[
 D_{3\delta}(r)\geq
 D_{3\delta}(\delta-r)+D_{3\delta}(\delta+r),              \tag{14}
\]

which is a new quantitative shape inequality, not a consequence of the
coarser sign.

This is an algebraic obstruction, not merely a weakness of an estimate.
Nonnegative, even, antiperiodic functions on the coarser cell can plainly be
chosen almost flat on the three displayed interior points, in which case the
right side of (13) is negative.  Hence the symmetries and the coarser
pointwise sign alone cannot imply the finer sign.  Formula (10) simply
repackages the same delicate cancellation at a larger scale.

## 3. Reciprocal Poisson scale changes the kernel and characteristic

With

\[
 \widehat K(q)=\int_{\mathbb R}K(r)e^{-iqr}\,dr,
\]

Poisson summation gives

\[
 D_\delta(r)=\frac1\delta\sum_{k\in\mathbb Z}
 e^{i(2k+1)\pi r/\delta}
 \widehat K\!\left(\frac{(2k+1)\pi}{\delta}\right).       \tag{15}
\]

Thus an alternating character in direct space becomes a half-integer shift
in frequency.  It does not become another alternating periodization.  In
theta-characteristic language, Poisson `S` exchanges the twist and the shift;
the chosen characteristic is not closed.

For the actual kernel,

\[
 \widehat K(q)=\frac1{256}
 \left\{\Xi'(q/4)^2-\Xi(q/4)\Xi''(q/4)\right\}.            \tag{16}
\]

Therefore (15) also changes `K` to the unknown Laguerre profile.  Assuming
that the coefficients in (15) are nonnegative assumes precisely the missing
first Laguerre sign.  Such an argument would be circular.

There is no hidden Fourier self-reciprocity that repairs this.  The direct
kernel has the differentiable tail asymptotic

\[
 K(r)=\frac{\pi^3}{32}e^{12|r|-2\pi e^{4|r|}}
 \left(1+O(e^{-4|r|})\right).                            \tag{17}
\]

If `hat K(q)=A K(Bq)` for nonzero constants `A,B`, then both a nonzero function
and its Fourier transform would decay faster than every Gaussian.  Choosing
Gaussian exponents beyond the Hardy uncertainty threshold would force
`K=0`, a contradiction.  Hence no dilation eigenrelation of the form needed
to close (15) exists.

Any continuous Ewald-scale self-cosine identity concerns a separate auxiliary
continuous scale.  Equations (5)-(8) show that it cannot be identified with
the discrete additive spacing in (1) without the missing Poisson/kernel
conversion.

## 4. Finite-block lobe theorem

The failure of scale closure does not prevent a direct compact-range attack.
Put

\[
 g(x)=-K'(x),\qquad x\geq0.                              \tag{18}
\]

The known monotonicity of `K` gives `g >= 0`.  The theta tail asymptotic gives
a finite `T` such that

\[
 K''(x)\geq0\quad(x\geq T),
 \qquad\hbox{equivalently}\qquad
 g\ \hbox{is nonincreasing on }[T,\infty).               \tag{19}
\]

Fix a compact spacing interval

\[
 0<a\leq\delta\leq b,                                   \tag{20}
\]

and choose any integer `M` satisfying

\[
 2Ma\geq T.                                              \tag{21}
\]

Write

\[
 \rho=\frac{2r}{\delta},\qquad
 L=\delta-2r=\delta(1-\rho),\qquad0\leq\rho\leq1,        \tag{22}
\]

and define normalized lobe averages

\[
 A_j(\delta,\rho)=\int_0^1
 g\!\left(\delta\left[j+\frac\rho2+(1-\rho)t\right]\right)dt.
                                                               \tag{23}
\]

The adjacent differences in the exact real-space expansion are

\[
 b_j(r)=K(j\delta+r)-K((j+1)\delta-r)=L A_j(\delta,\rho). \tag{24}
\]

The absolutely convergent lattice rearrangement is

\[
 D_\delta(r)=\sum_{j\geq0}(-1)^j b_j(r).                 \tag{24a}
\]

Define the finite even block

\[
 Q_M(\delta,\rho)=
 \sum_{j=0}^{2M-1}(-1)^jA_j(\delta,\rho).                \tag{25}
\]

For `j >= 2M`, every interval in (23) starts to the right of `T`.  Equal
interval lengths and (19) imply

\[
 A_{j+1}(\delta,\rho)\leq A_j(\delta,\rho).              \tag{26}
\]

The remaining infinite alternating tail therefore obeys

\[
 0\leq\sum_{j=2M}^{\infty}(-1)^jA_j
 \leq A_{2M}.                                            \tag{27}
\]

Combining (24)-(27) proves the exact two-sided compact bound

\[
 \boxed{
 Q_M(\delta,\rho)
 \leq \frac{D_\delta(\rho\delta/2)}{\delta(1-\rho)}
 \leq Q_M(\delta,\rho)+A_{2M}(\delta,\rho),
 \quad 0\leq\rho<1.
 }                                                        \tag{28}
\]

The quotient extends continuously to `rho=1`; the original `D` is exactly
zero there.  Consequently

\[
 \boxed{
 \inf_{[a,b]\times[0,1]}Q_M\geq0
 \quad\Longrightarrow\quad
 D_\delta(r)\geq0
 \ \hbox{for all }\delta\in[a,b],\ 0\leq r\leq\delta/2.
 }                                                        \tag{29}
\]

Conversely, a parameter box contained in `rho < 1` on which

\[
 \sup(Q_M+A_{2M})<0                                     \tag{30}
\]

is a rigorous counterexample box.  Neither (29) nor (30) invokes `hat K` or
the unknown Laguerre sign.

This strictly improves the pairwise decreasing-lobe test.  Individual early
pairs `b_0-b_1`, `b_2-b_3`, and so on may be negative; only their complete
finite block in (25) must be nonnegative.  The tail is handled analytically,
not by truncation.

## 5. Turning the compact criterion into a finite rigorous check

The degeneracy `D(delta/2)=0` makes a direct interval check of `D` inefficient.
The normalized `Q_M` in (25) removes the known factor `L`.

Let

\[
 B_2=\sup_{0\leq x\leq(2M+1)b}|K''(x)|.                  \tag{31}
\]

Differentiating (23) and using `g'=-K''` gives the explicit Lipschitz bounds

\[
 \boxed{
 |\partial_\delta Q_M|\leq2M^2B_2,
 \qquad
 |\partial_\rho Q_M|\leq\frac{Mb}{2}B_2.
 }                                                        \tag{32}
\]

The first constant follows from

\[
 \int_0^1\left[j+\frac\rho2+(1-\rho)t\right]dt=j+\frac12,
 \qquad
 \sum_{j=0}^{2M-1}(j+\tfrac12)=2M^2,
\]

and the second from `integral_0^1 |1/2-t| dt=1/4`.

Suppose a rectangular mesh has maximum centre-to-point radii `h_delta` and
`h_rho`, and rigorous interval evaluation at every mesh centre gives lower
endpoint at least `eta`.  Then

\[
 \eta-2M^2B_2h_\delta-\frac{Mb}{2}B_2h_\rho\geq0         \tag{33}
\]

certifies (29) on the entire compact rectangle.  An analogous upper-endpoint
test, adding the elementary derivative bounds for `A_(2M)`, certifies (30).
This is a genuinely finite compact certificate: the only infinite part is
the already signed tail (27).

## 6. Complete-theta interval bounds require no Fourier assumption

All quantities in (31)-(33) can be enclosed directly from the complete theta
series.  For `t >= 0`, put `y=pi n^2 e^{4t}`.  Termwise differentiation gives

\[
\begin{aligned}
 \Phi(t)
 &=\sum_{n\geq1}\pi n^2e^{5t-y}(2y-3),\\
 \Phi'(t)
 &=\sum_{n\geq1}\pi n^2e^{5t-y}(-8y^2+30y-15),\\
 \Phi''(t)
 &=\sum_{n\geq1}\pi n^2e^{5t-y}
 (32y^3-224y^2+330y-75).
\end{aligned}                                             \tag{34}
\]

For negative arguments use the even/odd parities of `Phi`, `Phi'`, and
`Phi''`.  After retaining the terms `n <= N`, define the zeroth-order tail by

\[
 R_N(t)=\sum_{n=N+1}^{\infty}\pi n^2
 e^{5t-\pi n^2e^{4t}}(2\pi n^2e^{4t}-3).                 \tag{35a}
\]

If `A=pi e^{4t}` and `N >= 1`, then `A >= pi`, and
`f(x)=x^4e^{-Ax^2}` is decreasing for `x >= 1`.  Hence the integral comparison

\[
 \sum_{n>N}f(n)\leq\int_N^\infty f(x)\,dx
\]

gives the explicit majorant

\[
 0\leq R_N(t)
 \leq2\pi^2e^{9t}\int_N^\infty x^4e^{-Ax^2}\,dx.         \tag{35}
\]

The derivative tails follow from the two displayed polynomials in (34), term
by term, and are finite sums of incomplete-gamma bounds of the same form.

Direct differentiation of `K` gives

\[
\begin{aligned}
 K'(r)&=\int_{\mathbb R}u^2
 \{\Phi'(u+r)\Phi(u-r)-\Phi(u+r)\Phi'(u-r)\}\,du,\\
 K''(r)&=\int_{\mathbb R}u^2
 \{\Phi''(u+r)\Phi(u-r)-2\Phi'(u+r)\Phi'(u-r)
 +\Phi(u+r)\Phi''(u-r)\}\,du.
\end{aligned}                                             \tag{36}
\]

Equations (34)-(36), with a finite interval quadrature in `u` and the same
folded-cusp exponential bound outside it, rigorously enclose `g`, `B_2`, and
every mesh value in (33).  This is direct complete-theta arithmetic; no
Fourier coefficient is assigned a sign.

## 7. What the block criterion gains, and where it stops

Noncertifying direct-quadrature scouting illustrates why the block theorem is
needed.  In Csordas' scale, near `delta=0.08` and `r=0`, the first pair was
approximately

\[
 b_0-b_1\approx-1.84\,10^{-6},
\]

while the four-lobe block was approximately

\[
 (b_0-b_1)+(b_2-b_3)\approx1.76\,10^{-5}.
\]

These decimal values are only route diagnostics, not certificates.  They do
show that demanding every lobe pair to be positive would discard a promising
intermediate regime that (29) can retain.

As the lower endpoint `a` approaches zero, condition (21) forces `M` to grow
like `1/a`, while `Q_M` becomes a beyond-all-orders cancellation.  Therefore
the compact certificate is suitable for the finite/intermediate range but
does not silently solve the small-spacing limit.  The failed modular closure
cannot be used to fill that gap.

The next concrete analytic task is now sharply bounded: choose a certified
tail-convexity threshold `T`, cover a proposed interval `[a,b]`, and prove
(33) with the direct theta enclosures (34)-(36).  Success genuinely extends
the all-point positivity regime even when early adjacent pairs fail.  Failure
with (30) produces an exact theta-specific obstruction to this stronger
sufficient route, while leaving the weighted Laguerre target logically open.
