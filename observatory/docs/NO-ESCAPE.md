# No-escape questions: tracers, zeros, and numerical evidence

The research workbench distinguishes a particle moving in a fixed field from
a zero moving as an analytic function changes. Circulation, damping, winding,
and heat-zero motion refer to different equations. They are not interchangeable
confinement mechanisms.

The implementation is in `dist/research-dynamics.js`; analytic theta jets are
in `dist/math.js`. `tests/research-dynamics.test.mjs` checks independent
high-precision derivative values, exact polynomial branches, actual heat
continuation, Fourier identities, and signed prime-power contributions.

## 1. Circulation follows modulus contours

Away from zeros and poles, put

\[
U=\log|F|,\qquad q=F'/F=a+ib.
\]

The Cauchy–Riemann equations give

\[
\nabla U=(a,-b),\qquad
\nabla\arg F=(b,a)=J\nabla U,
\qquad J(x,y)=(-y,x).
\]

The pure phase tracer equation \(\dot Z=\beta J\nabla U\) has
\(dU/dt=0\). Its trajectories stay on modulus level sets. A compact regular
level curve can therefore trap this particular tracer, but the equation has
no attracting radial component. Near a zero of multiplicity \(m\),
\(U\sim m\log r\), tangential speed is \(\beta m/r\), and radial speed is zero.

Adding a gradient component changes the model:

\[
\dot Z=-\alpha\nabla U+\beta J\nabla U,
\qquad
\dot U=-\alpha|\nabla U|^2.
\]

For \(\alpha>0\), a tracer is locally attracted to an existing zero.
This does not move the zero or establish that zeros of a changing function
stay on the critical line. Nondegenerate Brownian noise also adds a stochastic
term to \(dU\), so this deterministic monotonicity is not pathwise confinement.

An escape-speed or centrifugal-energy formula belongs to a separately
specified second-order mechanical model with mass, force, energy, and angular
momentum. The phase equation is first order: changing its positive overall
speed leaves its trajectories unchanged. A kinetic-energy barrier is not
provided by that equation.

Reference: [NIST DLMF, Cauchy–Riemann equations](https://dlmf.nist.gov/1.9.E25).

## 2. Zeros move when the function changes

For a simple zero \(F(\rho(\lambda),\lambda)=0\), implicit differentiation gives

\[
\rho'(\lambda)=-\frac{F_\lambda}{F_s}.
\]

The renderer uses

\[
F_\tau(s)=8H_\tau(-2i(s-\tfrac12)),\qquad
\partial_\tau F=\tfrac14F_{ss}.
\]

Thus

\[
\rho'_\tau=-\frac{F_{ss}}{4F_s}.
\]

With \(x=\Re\rho-\tfrac12\), \(D=x^2\), and
\(M=x\Re(F_{ss}/F_s)\),

\[
\boxed{D'_\tau=-M/2.}
\]

This is an identity at a simple zero, not a sign theorem. The reverse clock
\(u=-\tau\) changes its sign. At a multiple zero \(F_s=0\), the quotient is
undefined and the simple-root continuation must be reconsidered. The fact
that \(D'=0\) at a simple critical-line zero does not rule out a later collision.

In the theta chart the analytic second derivative is obtained by multiplying
the shifted whole-contour integrand by \(4(u+i\alpha)^2\). The implementation
retains the cross term and rotates by the same contour factor as \(F\) and
\(F_s\). It never differentiates a positive display scale. The raw derivative
API covers \(-12\le\sigma\le13\), \(|t|\le120\), \(|\tau|\le1\);
the research control bounds are smaller.

Reference: [Rodgers and Tao's de Bruijn–Newman exposition](https://terrytao.wordpress.com/2018/01/19/the-de-bruijn-newman-constant-is-non-negativ/).

## 3. Exact collision calibration

Consider forward polynomial heat:

\[
P_u(z)=e^{u\partial_z^2}[(z^2-1)(z^2-4)]
=z^4+(12u-5)z^2+(12u^2-10u+4).
\]

Initially its roots are \(\pm1,\pm2\). The discriminant of its quadratic in
\(z^2\) is \(96u^2-80u+9\), so the first collisions occur at

\[
u_*=(10-\sqrt{46})/24\approx0.134069584.
\]

At \(u=1/4\), its four roots are \(\pm\sqrt5/2\pm i/2\).
Define

\[
F_\tau(s)=P_{-\tau}(-2i(s-\tfrac12)).
\]

It obeys the renderer's heat PDE and both symmetries
\(F(1-s)=F(s)\), \(F(\bar s)=\overline{F(s)}\). Its zeros start at
\(1/2\pm i/2\), \(1/2\pm i\), and at \(\tau=-1/4\) are

\[
\boxed{\tfrac14\pm i\tfrac{\sqrt5}{4},\qquad
\tfrac34\pm i\tfrac{\sqrt5}{4}.}
\]

Also \(F_\tau(1/2)=12\tau^2+10\tau+4\ge23/12>0\). A central-anchor zero
is not needed for the departure. A simple zero retains winding \(+1\);
the colliding double zero has winding \(+2\). Total winding is conserved.

The calibration displays all four analytic branches and marks the double-zero
locations at \(\tau=-u_*\). It evaluates their positions by exact algebra;
it does not pretend Newton's method resolves the double-root singularity.
The calibration is a polynomial, not xi. It refutes confinement arguments
based only on these generic symmetries, heat normalization, and winding.

Reference for the heat construction and collision mechanism:
[Tao, Heat flow and zeroes of polynomials](https://terrytao.wordpress.com/2017/10/17/heat-flow-and-zeroes-of-polynomials/).

## 4. What an actual barrier would require

The argument principle preserves the zero count in a compact region while
the entire boundary remains zero-free. A sufficient quantitative condition is
Rouché's inequality

\[
\sup_{\partial\Omega}|F_\tau-F_0|
<\inf_{\partial\Omega}|F_0|.
\]

A disk invariant under reflection \(s\mapsto1-\bar s\), containing exactly
one zero counted with multiplicity, forces that zero onto the critical line
for a family with the corresponding symmetry. A real simple zero likewise
has a real local branch until simplicity or the other continuation hypotheses
fail. A global claim must additionally handle all zeros, collisions,
boundaries, and infinity.

The workbench's contour has 128 nodes. It reports a sampled winding and the
dimensionless sampled margin

\[
\frac{\min_j|F_0(s_j)|-\max_j|F_\tau(s_j)-F_0(s_j)|}
{\max_j|F_0(s_j)|}.
\]

These are **uncertified**. Values at finitely many nodes do not bound the
intervening arcs or the intervening heat times. Certification would need
rigorous evaluation errors and suitable derivative or interval bounds for
the full contour and parameter interval.

In the quartic calibration, the fixed contour centred at \(1/2+i/2\) with
radius \(0.35\) has initial winding 1 and winding 2 at \(\tau=-1/4\).
The second zero entered the disk; the sampled Rouché margin is negative.
There is no conflict with conservation of winding on a zero-free boundary.

Reference: [NIST DLMF, argument principle and Rouché's theorem](https://dlmf.nist.gov/1.10.iv).

## 5. Actual theta-root continuation and its limits

The actual heat mode selects the requested number of known initial xi heights
nearest the chosen \(t\), keeping initial heights below 60. It refines those
candidates at \(\tau=0\), predicts using \(-F_{ss}/(4F_s)\), then corrects
with full complex Newton steps. There is no projection to \(\sigma=1/2\).
Adaptive step reduction, a local branch radius, and a fixed iteration budget
bound the work. Failed or ill-conditioned continuation ends that branch and
reports its last resolved parameter. The chart is
\(-2\le\sigma\le3\), \(0\le t\le60\).

The displayed residual is the positional correction estimate \(|F/F_s|\),
with an additional current-frame evaluation using 768 contour intervals
instead of 384. The conditioning indicator is
\(|F_s|/(|F_s|+|F_{ss}|)\); it is a local diagnostic, not a condition-number
certificate. Small raw \(|F|\) alone is not accepted as a zero.

Frame \(k\) means exactly \(\tau=\tau_{end}k/240\). Three complete trajectory
variants are cached; frame and overlay changes reuse the same numerical
tracks. Current contour evidence is recalculated for the selected frame.
Nothing here establishes the Riemann hypothesis or a global no-collision bound.

## 6. Pulse and prime views

The pulse view applies

\[
S(\omega)=\frac{F(1/2+i\omega)-\alpha F'(1/2+i\omega)}
{F(1/2+i\omega)+\alpha F'(1/2+i\omega)}
\]

to a 256-point DFT on a period of 16. The forward Fourier sign is negative;
the inverse sign is positive. A box, two equal boxes, or a Gaussian is real
and symmetric, sampled at cell centres. For \(\alpha=0\) the multiplier is
the identity even at zeros. A resolvable common-zero quotient uses the
analytic differentiated limit; unresolved denominators are reported.
Symmetry gives unit modulus on the line where the quotient is defined, so
the finite squared norm is preserved to numerical precision. The displayed
right-tail fraction is for this finite periodic window, not an infinite-line
causality theorem or proof of half-plane contractivity.

The prime view uses signed coefficients at a fixed selected spectral height

\[
A_{p,m}(\gamma)=\log(p)p^{-m/2}\cos(\gamma m\log p),
\qquad \gamma=\text{researchT},
\]

and the chosen finite carrier rows

\[
A_{p,m}(\gamma)\cos(\gamma u-m\log(p)T),
\qquad u=\log x,\qquad T=\mathrm{frame}/8.
\]

Play advances \(T\) while \(\gamma\) and the signed coefficients stay fixed.
Bars show instantaneous per-prime totals at \(u=0\), not the coefficients.
Solo and mute refer to 1-based prime indices. Each enabled prime includes the
chosen finite powers. These are specified finite oscillators, not proved
eigenmodes. No convergence of the Euler-product logarithmic derivative on
the critical line is assumed, and signed contributions are not replaced
with nonnegative energies.
