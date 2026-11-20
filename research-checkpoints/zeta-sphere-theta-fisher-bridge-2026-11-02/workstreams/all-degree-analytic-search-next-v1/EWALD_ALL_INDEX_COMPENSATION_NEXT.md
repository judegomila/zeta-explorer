# All-index Ewald compensation: Poisson boundary trace and Abel-packet barriers

## Scope and outcome

`EWALD_WEIGHTED_PIVOT_NEXT.md` gives the exact scalar coordinates

\[
 \mathfrak q(\pi)
 =\sum_{k\geq1}W_k\Delta^2[kJ_\pi(k)]
 =\int_0^1\mathcal A_\pi(z)\,dz,
 \qquad
 \Delta a_k=a_k-a_{k+1},\quad
 W_k=(k+1)H_k-k,\quad
 H_k=\sum_{j=1}^k{1\over j}.                     \tag{1}
\]

The present note tests whether the second coordinate has an all-index
positivity mechanism.  The corrected residual `pi` and its continuous-scale
source `J_pi` remain assembled throughout.  Four exact conclusions result.

1. The whole Abel path has a direct Poisson--ceiling kernel in the scale
   variable.  Its derivative is an explicit signed seam-versus-cell kernel;
   no polylogarithm or finite Ewald truncation is needed to state it.
2. The Euler-renormalized polylogarithm has an ordinary all-index Laplace
   formula on `0<Re(s)<1`, but its positive real Laplace weight does not
   become a positive source after multiplication by the completed gamma
   factor.  Pulling that weight through Fourier inversion loses essential
   oscillatory cancellation.
3. Every interior Abel-damped complete-theta Ewald packet, and its radial
   derivative, changes sign in both physical space and Fourier space.  This
   extends the earlier finite-packet obstruction to the full infinite Abel
   family `0<z<1`.
4. Pointwise Abel monotonicity is not necessary for a positive scalar pivot,
   even in the real even Fourier-`+1` Schwartz endpoint class.  An existing
   explicit source has positive pivot but a strictly negative initial Abel
   derivative.

Thus an Abel proof cannot be a positive-source or pointwise-monotonicity
argument.  The surviving target is an integrated, sign-changing correlated
trace inequality, with the endpoint taken after the complete correlation.
No such inequality is proved here for the complete-theta Galerkin residual;
in particular, no first Xi Laguerre sign, all-degree theorem, or RH conclusion
is claimed.

## 1. The exact Poisson--ceiling kernel

For the actual globally corrected residual, retain

\[
 \pi=p-q_X+q_{Q^{-1}r}=p-q_A                         \tag{2}
\]

and the audited scale source

\[
 J_\pi\in\mathcal S(\mathbb R;\mathbb R),\qquad
 J_\pi(-x)=J_\pi(x),\qquad
 \widehat J_\pi=J_\pi,\qquad J_\pi(0)=0.           \tag{3}
\]

In particular,

\[
 \int_0^\infty J_\pi(x)\,dx=0,
 \qquad
 \int_0^\infty J_\pi(x)\cos(2\pi mx)\,dx
 ={1\over2}J_\pi(m).                               \tag{4}
\]

Let

\[
 e_n(\pi)=J_\pi(n)-\int_{n-1}^nJ_\pi(x)\,dx,
 \qquad
 \mathcal S_\pi(z)=\sum_{n\geq1}e_n(\pi)z^n,
 \qquad 0\leq z<1.                                \tag{5}
\]

The coefficients are rapidly decreasing, so this scalar series is smooth
through `z=1`.  Define the period-one Poisson kernel

\[
 \mathcal P_z(x)
 ={1-z^2\over1-2z\cos(2\pi x)+z^2}
 =1+2\sum_{m\geq1}z^m\cos(2\pi mx).               \tag{6}
\]

Absolute convergence and (4) give

\[
 \sum_{m\geq1}z^mJ_\pi(m)
 =\int_0^\infty \mathcal P_z(x)J_\pi(x)\,dx.      \tag{7}
\]

On the other hand,

\[
 \sum_{n\geq1}z^n\int_{n-1}^nJ_\pi(x)\,dx
 =\int_0^\infty z^{\lceil x\rceil}J_\pi(x)\,dx,  \tag{8}
\]

where the values at integer endpoints are irrelevant.  Combining (5), (7),
and (8) gives the promised all-index identity

\[
 \boxed{
 \mathcal S_\pi(z)
 =\int_0^\infty
 \{\mathcal P_z(x)-z^{\lceil x\rceil}\}J_\pi(x)\,dx.} \tag{9}
\]

This formula retains the same complete residual in both terms.  At `z=0`,
the kernel is one and (4) gives `S_pi(0)=0`.  As `z` increases to one,
`mathcal P_z` tends distributionally to the integer Dirac comb, while
`z^(ceil x)` tends to one.  Therefore

\[
 \lim_{z\uparrow1}\mathcal S_\pi(z)
 =\sum_{m\geq1}J_\pi(m)-\int_0^\infty J_\pi(x)\,dx
 =\mathfrak q(\pi).                                \tag{10}
\]

The half-mass convention at zero is immaterial because `J_pi(0)=0`.
Equation (10) shows explicitly that the endpoint is a seam boundary trace;
pointwise convergence of the kernel away from the seams is not the relevant
limit.

There is a companion harmonic interpretation.  Periodize the assembled
source,

\[
 \rho_\pi(u)=\sum_{k\in\mathbb Z}J_\pi(k+u)
 =\sum_{m\in\mathbb Z}J_\pi(m)e^{2\pi imu}.        \tag{11}
\]

Its circle mean is `J_pi(0)=0`, and

\[
 2\sum_{m\geq1}z^mJ_\pi(m)
 =\int_0^1\mathcal P_z(u)\rho_\pi(u)\,du,
 \qquad
 \rho_\pi(0)=2\mathfrak q(\pi).                  \tag{12}
\]

Thus the scalar sign is the value at one point of a signed zero-mean theta
periodization.  The Poisson maximum principle supplies no sign without an
additional source-specific ordering of that boundary data.

## 2. The radial derivative is an intrinsically signed kernel

For `0<z<1`, differentiation under the integral in (9) is ordinary and gives

\[
 \boxed{
 \mathcal A_\pi(z)=\mathcal S_\pi'(z)
 =\int_0^\infty \mathcal G_z(x)J_\pi(x)\,dx,}     \tag{13}
\]

where

\[
 \boxed{
 \mathcal G_z(x)
 ={2\{(1+z^2)\cos(2\pi x)-2z\}
   \over\{1-2z\cos(2\pi x)+z^2\}^2}
 -\lceil x\rceil z^{\lceil x\rceil-1}.}          \tag{14}
\]

The sign geometry is exact.  At every half integer,

\[
 \mathcal G_z(m+1/2)
 =-{2\over(1+z)^2}-(m+1)z^m<0.                   \tag{15}
\]

Immediately to the right of a sufficiently large integer, the first term
in (14) is arbitrarily close to `2/(1-z)^2`, while the ceiling term is
`(m+1)z^m`, which tends to zero.  Hence `G_z` is positive there.  Moreover,
on every open unit cell,

\[
 \int_m^{m+1}\mathcal G_z(x)\,dx=-(m+1)z^m<0,    \tag{16}
\]

because the Poisson kernel has cell average one, independent of `z`.
The radial derivative therefore consists of positive seam spikes and a
negative cell-average budget at every scale.  Its sign cannot be read from a
pointwise positive kernel.

Equations (13)--(16) do not show that `A_pi(z)` is negative for an actual
theta residual: `J_pi` is itself signed, and its complete correlation can
compensate the two regions.  They do show exactly what a source-specific
argument must control.  A separate estimate of the seam and cell terms would
discard the same all-index compensation as a finite Ewald truncation.

## 3. An all-index Laplace formula and its domain guardrail

Retain

\[
 s={1\over2}-it,
 \qquad
 d_n(s)=n^{-s}-{n^{1-s}-(n-1)^{1-s}\over1-s},
 \qquad 0<\operatorname {Re}s<1.                 \tag{17}
\]

Writing the second term as the integral of `x^(-s)` gives

\[
 d_n(s)
 =-s\int_0^1u(n-1+u)^{-s-1}\,du.                \tag{18}
\]

Use the Laplace formula for the last power and sum the geometric series in
`n`.  For `0<=z<1` this yields the ordinary convergent integral

\[
 \boxed{
 D(z,s)=\sum_{n\geq1}z^nd_n(s)
 =-{z\over\Gamma(s)}\int_0^\infty
 {y^{s-2}\{1-(1+y)e^{-y}\}\over1-ze^{-y}}\,dy.} \tag{19}
\]

Indeed,

\[
 \int_0^1ue^{-uy}\,du={1-(1+y)e^{-y}\over y^2}. \tag{20}
\]

For fixed `z<1`, the integrand in (19) is integrable at zero and infinity on
the stated strip.  At `z=1`, the numerator is `y^2/2+O(y^3)` and the extra
denominator is `y+O(y^2)`, so ordinary dominated passage is valid exactly
for `0<Re(s)<1`; it recovers

\[
 \lim_{z\uparrow1}D(z,s)=\zeta(s).               \tag{21}
\]

For `0<=z<1`, differentiating (19) gives

\[
 \boxed{
 \partial_zD(z,s)
 =-{1\over\Gamma(s)}\int_0^\infty
 {y^{s-2}\{1-(1+y)e^{-y}\}\over(1-ze^{-y})^2}\,dy.} \tag{22}
\]

The real Laplace weight in braces is positive for `y>0`.  This does **not**
turn (22) into a positive theta mixture on the critical line.  The completed
multiplier is

\[
 {K(t)\over\Gamma(s)}
 ={s(s-1)\pi^{-s/2}\Gamma(s/2)\over\Gamma(s)},   \tag{23}
\]

whose magnitude has exponential growth after the gamma quotient is split
from the Mellin integral.  The decay of the original product comes from
oscillation in the complete Mellin integral.  Consequently, the fixed-`y`
factor does not even furnish an ordinary tempered inverse-Fourier source;
pulling the positive `y`-weight through Fourier inversion is not a valid
positive-mixture argument.  The Ewald combination must be retained before
Fourier inversion.

There is also no source-level derivative at the endpoint in (22): at `z=1`
the integrand behaves as `y^(s-2)` near zero and is not integrable on the
critical strip.  The scalar derivative `A_pi(1)` nevertheless exists because
the already-correlated coefficients `e_n(pi)` are rapidly decreasing.  This
is another reason the endpoint must be taken after complete correlation.

## 4. Every interior Abel packet is signed in both domains

Let `epsilon_n` be the audited left Ewald cells,

\[
 \varepsilon_n=\sigma_n-\int_{n-1}^n\sigma_x\,dx,
 \qquad
 \psi=\sum_{n\geq1}\varepsilon_n,                \tag{24}
\]

and define the infinite Abel packet

\[
 \Sigma_z(h)=\sum_{n\geq1}z^n\varepsilon_n(h),
 \qquad 0<z<1.                                    \tag{25}
\]

The exponential coefficient makes (25) convergent in every weighted
Sobolev seminorm used by the all-degree moment problem.  Its transform is

\[
 \widehat\Sigma_z(t)=\operatorname {Re}\{K(t)D(z,1/2-it)\}. \tag{26}
\]

### Physical-space sign change

Each cell has positive mass

\[
 \mu_n:=\int_{\mathbb R}\varepsilon_n(h)\,dh
 =-c_0\{n^{-1/2}-2(\sqrt n-\sqrt{n-1})\}>0,
 \qquad c_0=\pi^{-1/4}\Gamma(5/4),               \tag{27}
\]

and tail

\[
 \varepsilon_n(h)=-2\pi(3n-1)e^{-5h/2}\{1+o(1)\}
 \qquad(h\to+\infty).                            \tag{28}
\]

The closed cell formulas and the exponential `z`-weight justify dominated
summation of this tail.  Hence

\[
 \int_{\mathbb R}\Sigma_z(h)\,dh
 =\sum_{n\geq1}z^n\mu_n>0,                       \tag{29}
\]

while

\[
 \boxed{
 \Sigma_z(h)
 =-2\pi{z(2+z)\over(1-z)^2}e^{-5h/2}\{1+o(1)\}<0} \tag{30}
\]

for all sufficiently large `h`.  Thus every `Sigma_z` changes sign.

The same conclusion holds for its radial derivative.  Its mass is

\[
 \int_{\mathbb R}\partial_z\Sigma_z(h)\,dh
 =\sum_{n\geq1}nz^{n-1}\mu_n>0,                  \tag{31}
\]

but its tail is

\[
 \boxed{
 \partial_z\Sigma_z(h)
 =-4\pi{1+2z\over(1-z)^3}e^{-5h/2}\{1+o(1)\}<0.} \tag{32}
\]

At `z=0`, the right derivative is the already signed first cell
`epsilon_1`.  The divergence of the coefficients in (30)--(32) as `z`
approaches one exhibits a genuine endpoint boundary layer: the limiting
complete source `psi` is positive and superexponentially decaying, but that
positivity is not uniform along the Abel packets.

### Fourier-space sign change

The Fourier obstruction is equally sharp.  For `r in {0,1}`, put

\[
 D_r(z,s)=\partial_z^rD(z,s),
 \qquad
 c_{n,0}(z)=z^n,
 \qquad
 c_{n,1}(z)=nz^{n-1}.                             \tag{33}
\]

For fixed `0<z<1`, equations (17)--(18) give, uniformly as `t` tends to
positive infinity,

\[
 D_r(z,1/2-it)
 =P_{r,z}(t)+O_z(t^{-1}),                         \tag{34}
\]

where

\[
 P_{r,z}(t)=\sum_{n\geq1}c_{n,r}(z)n^{-1/2}
 e^{it\log n}.                                   \tag{35}
\]

Both coefficient sequences are absolutely summable, and `P_(r,z)` is a
nonzero uniformly almost-periodic function.  Write

\[
 K(t)=|K(t)|e^{i\theta(t)},
 \qquad
 \theta'(t)=-{1\over2}\log{t\over2\pi}+O(t^{-1}). \tag{36}
\]

We record the standard chirped-phase argument because it controls the
infinite Abel packet, not merely a finite truncation.  Absolute summability
permits a finite truncation of (35) with arbitrarily small uniform tail.
Expanding the square of that finite exponential polynomial and choosing one
fixed sufficiently large interval length `L` gives constants `delta>0` and
`T_0` such that

\[
 \int_T^{T+L}|P_{r,z}(t)|^2dt\geq\delta
 \qquad(T\geq T_0).                              \tag{37}
\]

For every fixed finite truncation, nonstationary integration by parts using
(36) gives

\[
 \int_T^{T+L}e^{i\theta(t)}P_{r,z}(t)dt=o(1),
 \qquad
 \int_T^{T+L}e^{2i\theta(t)}P_{r,z}(t)^2dt=o(1). \tag{38}
\]

The absolutely summable tails then extend (38) to the full series.  From
(34), the bounded normalized transform

\[
 Q_{r,z}(t)=|K(t)|^{-1}
 \operatorname {Re}\{K(t)D_r(z,1/2-it)\}         \tag{39}
\]

has interval mean tending to zero, while (37)--(38) give an interval
mean-square bounded below.  If `Q_(r,z)` were eventually nonnegative, its
boundedness would imply `Q_(r,z)^2<=C Q_(r,z)` and contradict those two
facts.  Applying the same argument to `-Q_(r,z)` rules out eventual
nonpositivity.  Therefore

\[
 \boxed{
 \widehat\Sigma_z(t)\ \text{and}\
 \partial_z\widehat\Sigma_z(t)
 \text{ each take both signs infinitely often}.} \tag{40}
\]

Thus neither the complete interior Abel packet nor its radial increment is a
positive-definite block.  This is an all-index, source-specific obstruction;
it is stronger than the earlier statement about nonzero finite Ewald
packets.

## 5. Abel monotonicity is strictly stronger than the scalar target

The failure of positive source blocks does not logically exclude a positive
correlated scalar `A_pi(z)`.  Pointwise scalar monotonicity is nevertheless
not necessary, even under all the generic endpoint constraints.

Use the explicit real even Fourier-`+1` Schwartz source from
`EWALD_FRACTIONAL_PLACEMENT_NEXT.md`,

\[
 J_*=H+14G_8+4G_{12},                             \tag{41}
\]

which satisfies `J_*(0)=0` and the forced moments.  The audited direct bounds
there give

\[
 \mathfrak q_*:=\sum_{n\geq1}J_*(n)>0.0089.       \tag{42}
\]

At the initial Abel point, however,

\[
 \mathcal A_*(0)=e_1(*)
 =J_*(1)-\int_0^1J_*(x)\,dx
 ={e^{-\pi}\over60\pi^5}N(\pi),                 \tag{43}
\]

where

\[
\begin{aligned}
 N(p)={}&64p^8-416p^7-112p^6+860p^5-3900p^4\\
       &-1320p^3+98010p^2+31185p-155925.
\end{aligned}                                    \tag{44}
\]

This sign can be checked with rational arithmetic only.  Using
`3.1415<pi<3.1416`, evaluate the positive monomials at the upper endpoint and
the negative monomials at the lower endpoint.  The resulting rigorous upper
bound is

\[
 N(\pi)
 <-{934933404677485676085504077222563
       \over195312500000000000000000000000}
 <-4786.                                         \tag{45}
\]

Consequently

\[
 \boxed{
 \mathcal A_*(0)<0,
 \qquad
 \int_0^1\mathcal A_*(z)\,dz=\mathfrak q_*>0.0089.} \tag{46}
\]

The source `J_*` is not an actual complete-theta residual, so (46) does not
refute theta-specific Abel monotonicity.  It proves the precise route
classification: monotonicity does not follow from evenness, self-duality,
the zero endpoint, Schwartz decay, or the forced curvature moments, and it is
strictly stronger than the scalar target.

## 6. The surviving correlated trace target

Let `W=|P_pi|^2` and define the already assembled residual source

\[
 \Lambda_\pi
 =2\Xi''W+2\Xi'W'+{1\over2}\Xi W''.             \tag{47}
\]

For

\[
 \mathcal E_z(t)={1\over2}
 \operatorname {Re}\{K(t)D(z,1/2-it)\},          \tag{48}
\]

two integrations by parts in frequency give the safe scalar identity

\[
 \boxed{
 \mathcal A_\pi(z)
 =-{1\over\pi}\int_{\mathbb R}
 \partial_z\mathcal E_z(t)\Lambda_\pi(t)\,dt,
 \qquad0\leq z<1.}                               \tag{49}
\]

All polynomial derivatives, the mismatch correction, and the full theta leg
remain inside (47)--(49).  Equations (22), (32), and (40) rule out calling
`partial_z E_z` a positive mixture or a positive block.  Equation (46) rules
out requiring the scalar integrand in `z` to be nonnegative as a necessary
mechanism.

The exact live Ewald obligation is therefore the integrated trace inequality

\[
 \boxed{
 -{1\over\pi}\int_0^1
 \left\{\int_{\mathbb R}
 \partial_z\mathcal E_z(t)\Lambda_\pi(t)\,dt\right\}dz
 \geq0,}                                         \tag{50}
\]

where the endpoint is taken after the inner complete correlation.  Equation
(50) is the target pivot in a sign-changing coordinate, not a new proof.  A
noncircular continuation must supply a complete-theta comparison that pays
the negative Abel regions by the positive ones after correlation--for
example, a degree/residual-dependent integrated domination for the pair
`(partial_z E_z,Lambda_pi)`.  It cannot arise from a finite set of cells, a
positive Laplace weight before Fourier inversion, or pointwise Abel
monotonicity.

## Nonclaims

- The Poisson--ceiling and Laplace formulas are exact reorganizations; they
  do not sign the endpoint.
- The sign-change theorem concerns the complete-theta Abel source packets.
  It does not by itself determine the sign of their Turan correlation with
  `Xi` or of any actual Galerkin pivot.
- The source `J_*` is a generic self-dual countermodel, not Xi, theta, zeta,
  or an RH counterexample.
- The rigorous rational check in (45) classifies pointwise monotonicity only;
  it is not a finite certificate for the all-index theta target.
- No finite computation is extrapolated to an all-degree or RH conclusion.
