# The first odd theta norm bound from uniform orbit dominance

## Scope and outcome

The first odd instance of the two-generator Sobolev criterion asks for

\[
 \boxed{
 \|\psi\|_2^2\|\psi''\|_2^2
 \leq 5\|\psi'\|_2^4,}                                      \tag{1}
\]

where

\[
 W(t)=\widehat\psi(t)=\int_{\mathbb R}\psi(h)e^{-ith}dh
 =2\Xi(t).                                                     \tag{2}
\]

This note proves (1) directly from the complete Jacobi-theta orbit
arithmetic.  The proof is global and analytic: it uses exact
upper-incomplete-gamma formulas for the first orbit and a uniform bound for
the sum of every remaining orbit.  There is no sampled-height quadrature,
finite orbit truncation promoted to a theorem, or floating-point sign step.

The result is not the first Xi Laguerre inequality in disguise.  It is a
reverse fourth-moment estimate for the positive measure `W^2dt`, whereas
the Xi Laguerre expression uses `W'^2-WW''`.  Two exact Fourier-positive
models below show that neither condition implies the other in the ambient
positive-source class.

Consequently the first odd five-scalar auxiliary is now closed for the
actual complete-theta source.  This proves only that fixed sufficient
criterion at `(N,epsilon)=(0,1)`; it proves no higher rung, pointwise first
Xi Laguerre sign, or RH statement.

## 1. Exact form of the obligation

Put

\[
 A=\int_{\mathbb R}W^2dt,\qquad
 C=\int_{\mathbb R}t^2W^2dt,\qquad
 D=\int_{\mathbb R}t^4W^2dt.                                  \tag{3}
\]

At the first odd rung `q=t`, equation (24) of
`THETA_SOBOLEV_AUXILIARY_NEXT.md` is exactly

\[
 AD\leq5C^2.                                                   \tag{4}
\]

With the nonunitary convention (2), Plancherel gives

\[
 A=2\pi\|\psi\|_2^2,\qquad
 C=2\pi\|\psi'\|_2^2,\qquad
 D=2\pi\|\psi''\|_2^2.                                      \tag{5}
\]

Thus (4) and (1) are identical, with every `2 pi` factor canceled.

There are two other useful exact readings.  Define the autocorrelation

\[
 K(x)=\int_{\mathbb R}\psi(h)\psi(h+x)dh
 ={1\over2\pi}\int_{\mathbb R}W(t)^2e^{itx}dt.                 \tag{6}
\]

Then (1) is the local fourth-order condition

\[
 K(0)K^{(4)}(0)\leq5K''(0)^2.                                 \tag{7}
\]

Alternatively, let `rho=psi^2/||psi||_2^2`, `ell=log psi`, and

\[
 X=-\ell'',\qquad Y=\ell^{(4)}.
\]

The Bell-fiber identities give

\[
 {\|\psi'\|_2^2\over\|\psi\|_2^2}
 ={1\over2}\mathbb E_\rho X,\qquad
 {\|\psi''\|_2^2\over\|\psi\|_2^2}
 ={1\over16}\mathbb E_\rho(2Y+12X^2).                         \tag{8}
\]

Hence (1) is also

\[
 \boxed{
 \mathbb E_\rho Y+6\operatorname {Var}_\rho(X)
 \leq4(\mathbb E_\rho X)^2.}                                 \tag{9}
\]

Ordinary log concavity and the known pointwise bottom Bell inequalities do
not give the upper-variance estimate (9).  The proof below instead retains
the actual orbit scale.

## 2. Complete-theta derivative orbits

For `h>=0`, write

\[
 z_n=\pi n^2e^{2h},\qquad
 \phi_n(h)=4e^{h/2}P_0(z_n)e^{-z_n},\qquad
 \psi(h)=\sum_{n\geq1}\phi_n(h),                               \tag{10}
\]

where

\[
 P_0(z)=2z^2-3z.
\]

Differentiation preserves the orbit form:

\[
 \phi_n^{(j)}(h)=4e^{h/2}P_j(z_n)e^{-z_n},\qquad
 P_{j+1}={P_j\over2}+2z(P_j'-P_j).                             \tag{11}
\]

The three polynomials needed here are

\[
 \begin{aligned}
 P_0(z)&=2z^2-3z,\\
 P_1(z)&=-4z^3+15z^2-{15\over2}z,\\
 P_2(z)&=8z^4-56z^3+{165\over2}z^2-{75\over4}z.
 \end{aligned}                                                 \tag{12}
\]

All differentiated orbit sums converge locally uniformly and in every
weighted norm used below.  Modular completion makes `psi` even, so for
`j=0,1,2`,

\[
 \|\psi^{(j)}\|_{L^2(\mathbb R)}^2
 =2\|\psi^{(j)}\|_{L^2(0,\infty)}^2.                          \tag{13}
\]

The common factor two cancels from (1).  It is therefore enough to work on
the positive half-line.

Set

\[
 a_j=\|\phi_1^{(j)}\|_{L^2(0,\infty)},\qquad
 r_j=\left\|\sum_{n\geq2}\phi_n^{(j)}\right\|_{L^2(0,\infty)}.
                                                                    \tag{14}
\]

Minkowski and the reverse triangle inequality give

\[
 \begin{aligned}
 \|\psi\|_{2,+}&\leq a_0+r_0,\\
 \|\psi'\|_{2,+}&\geq a_1-r_1,\\
 \|\psi''\|_{2,+}&\leq a_2+r_2.
 \end{aligned}                                                 \tag{15}
\]

The middle line keeps the complete modular seam cancellation: no derivative
orbit is asserted positive.  It only bounds the `L^2` size of the assembled
tail before using the reverse triangle inequality.

## 3. Exact first-orbit bounds

For the first orbit, the change of variable `z=pi e^(2h)` gives

\[
 a_j^2={8\over\sqrt\pi}\int_\pi^\infty
 z^{-1/2}P_j(z)^2e^{-2z}dz.                                  \tag{16}
\]

These are exact upper-incomplete-gamma values.  To make the bounds below
auditable without numerical quadrature, put

\[
 E=\operatorname {erfc}(\sqrt{2\pi}).
\]

Repeated use of

\[
 I_k:=\int_\pi^\infty z^{k-1/2}e^{-2z}dz
 ={1\over2}\pi^{k-1/2}e^{-2\pi}+{2k-1\over4}I_{k-1}          \tag{17}
\]

reduces (16) to

\[
 a_j^2=e^{-2\pi}Q_j(\pi)+c_jE,                               \tag{18}
\]

where

\[
 \begin{array}{c|c|l}
 j&c_j&Q_j(x)\\ \hline
 0&33\sqrt2/16&
 16x^3-20x^2+11x+33/4\\[1mm]
 1&585\sqrt2/32&
 64x^5-304x^4+456x^3-102x^2+(195/2)x+585/8\\[1mm]
 2&22455\sqrt2/64&
 256x^7-2624x^6+9296x^5-12596x^4+7284x^3
 +372x^2+(7485/4)x+22455/16.
 \end{array}                                                   \tag{19}
\]

No special-function black box is needed for the sign estimates.  One
integration by parts in `I_0` gives the elementary Mills bounds

\[
 {e^{-2\pi}\over\sqrt2\,\pi}
 \left(1-{1\over4\pi}\right)
 <E< {e^{-2\pi}\over\sqrt2\,\pi}.                            \tag{20}
\]

For completeness, the rational enclosures used in (18)--(20) are

\[
 {314159\over100000}<\pi<{3927\over1250},
 \qquad 535<e^{2\pi}<536.                                    \tag{21}
\]

The exponential bounds follow from the Taylor series with its positive
remainder bounded geometrically after the twentieth term.  Substitution in
(18)--(20), using rational outward rounding, gives

\[
 \boxed{
 a_0^2<{13\over20},\qquad
 a_1^2>{13\over2},\qquad
 a_2^2<197.}                                                   \tag{22}
\]

Here is an equivalent direct check of the direction of every enclosure:

\[
 \begin{aligned}
 a_0^2&<e^{-2\pi}\left\{Q_0(\pi)+{33\over16\pi}\right\},\\
 a_1^2&>e^{-2\pi}\left\{Q_1(\pi)
 +{585\over32\pi}\left(1-{1\over4\pi}\right)\right\},\\
 a_2^2&<e^{-2\pi}\left\{Q_2(\pi)+{22455\over64\pi}\right\}.
 \end{aligned}                                                 \tag{23}
\]

The rational bounds (21) make the three right sides respectively less than
`13/20`, greater than `13/2`, and less than `197`.  Thus (22) is a finite
exact evaluation of three explicit integrals, not a sampled approximation.
In particular,

\[
 a_0<{81\over100},\qquad a_1>{5\over2},\qquad a_2<15.          \tag{24}
\]

## 4. Uniform all-orbit tail

For `n>=2`, one has `z_n>=4pi>12`.  On this whole domain, (12) gives the
division-free polynomial bounds

\[
 |P_0(z)|<2z^2,\qquad |P_1(z)|<4z^3,\qquad
 |P_2(z)|<8z^4.                                                \tag{25}
\]

For the last inequality, `P_2(z)>0` when `z>=12`, while
`8z^4-P_2(z)>0`; the first two inequalities follow directly from their
factored quadratics.  Put

\[
 (K_0,d_0)=(2,2),\qquad(K_1,d_1)=(4,3),\qquad(K_2,d_2)=(8,4).
\]

Changing variables separately in each orbit gives

\[
 \|\phi_n^{(j)}\|_{2,+}^2
 ={8\over n\sqrt\pi}\int_{\pi n^2}^\infty
 z^{-1/2}P_j(z)^2e^{-2z}dz.                                  \tag{26}
\]

For `p>0` and `a>p/2`, logarithmic differentiation gives the elementary tail
estimate

\[
 \int_a^\infty z^pe^{-2z}dz
 \leq {a^pe^{-2a}\over 2-p/a}.                                \tag{27}
\]

Combining (25)--(27) yields

\[
 \|\phi_n^{(j)}\|_{2,+}\leq b_{j,n}:=
 {\sqrt8K_j\pi^{d_j-1/2}n^{2d_j-1}e^{-\pi n^2}
  \over
  \sqrt{2-(2d_j-1/2)/(\pi n^2)}}.                             \tag{28}
\]

The following rational bounds are sufficient:

\[
 \begin{array}{c|c|c}
 j&b_{j,2}&2b_{j,3}\\ \hline
 0&<7/10000&<10^{-8}\\
 1&<9/500&<10^{-7}\\
 2&<47/100&<10^{-5}.
 \end{array}                                                   \tag{29}
\]

They follow directly from (21), (28), and

\[
 e^{4\pi}>286000,\qquad e^{9\pi}>1.8\mathbin{\cdot}10^{12}, \tag{30}
\]

again by the positive Taylor series with a rational remainder bound.  For
`n>=3`, the ratio of consecutive right sides in (28) is at most

\[
 \left({n+1\over n}\right)^7e^{-\pi(2n+1)}
 \leq\left({4\over3}\right)^7e^{-7\pi}< {1\over2};            \tag{31}
\]

the square-root denominator only decreases this ratio.  Thus the sum from
`n=3` onward is less than `2b_(j,3)`.  Minkowski, (29), and (31) now give the
uniform complete-tail bounds

\[
 \boxed{
 r_0<{1\over1000},\qquad
 r_1<{1\over50},\qquad
 r_2<{1\over2}.}                                                \tag{32}
\]

Every theta index `n>=2` is included in (32); it is not an orbit truncation.

## 5. Closing the rational norm inequality

Equations (15), (24), and (32) imply

\[
 \begin{aligned}
 \|\psi\|_{2,+}&<{81\over100}+{1\over1000}
 ={811\over1000},\\
 \|\psi'\|_{2,+}&>{5\over2}-{1\over50}
 ={62\over25},\\
 \|\psi''\|_{2,+}&<15+{1\over2}={31\over2}.
 \end{aligned}                                                 \tag{33}
\]

The remaining comparison is wholly rational:

\[
 5\left({62\over25}\right)^4
 -\left({811\over1000}{31\over2}\right)^2
 ={622392611\over20000000}>0.                                 \tag{34}
\]

Therefore

\[
 \|\psi\|_{2,+}^2\|\psi''\|_{2,+}^2
 <5\|\psi'\|_{2,+}^4.
\]

Using (13) proves the strict whole-line form of (1), and hence the first odd
five-scalar condition (4).

## 6. This is not the first Xi Laguerre sign

Let

\[
 J_W=W'^2-WW''=4\{\Xi'^2-\Xi\Xi''\}.                          \tag{35}
\]

The first odd target pivot is

\[
 \mathcal S_{0,1}
 ={1\over4\pi}\int_{\mathbb R}t^2J_W(t)dt
 ={1\over\pi}\int_{\mathbb R}t^2
       \{\Xi'^2-\Xi\Xi''\}dt.                               \tag{36}
\]

Thus (1) is a sufficient auxiliary route to (36), not a rewriting of its
integrand or its signed moment.  The distinction is strict even among
positive Fourier sources.

### The norm inequality need not imply the Laguerre sign

Take

\[
 W(t)=e^{-t^2}+16e^{-4t^2}.                                   \tag{37}
\]

Its inverse Fourier transform is a positive even Gaussian sum.  The
probability measure proportional to `W^2dt` is a centered Gaussian mixture
whose component variances lie in `[1/16,1/4]`.  If `S` is the mixed variance,

\[
 {AD\over C^2}=3{\mathbb E S^2\over(\mathbb E S)^2}
 \leq {3(M+m)^2\over4Mm}={75\over16}<5                       \tag{38}
\]

by the elementary Kantorovich bound, with `m=1/16`, `M=1/4`.
Nevertheless, at

\[
 t_0^2={\log16\over3},
\]

the two summands in (37) agree and

\[
 (\log W)''(t_0)=-5+3\log16>0.
\]

Hence `J_W(t_0)=-W(t_0)^2 (log W)''(t_0)<0`.

### The global Laguerre sign need not imply the norm inequality

For `epsilon>0`, define

\[
 \begin{aligned}
 V_\epsilon(t)
 &=t\operatorname {erf}(t/\epsilon)
   +{\epsilon\over\sqrt\pi}e^{-t^2/\epsilon^2},\\
 W_\epsilon(t)&=e^{-V_\epsilon(t)/2}.
 \end{aligned}                                                 \tag{39}
\]

Then

\[
 V_\epsilon''(t)={2\over\sqrt\pi\epsilon}e^{-t^2/\epsilon^2}>0,
 \qquad
 W_\epsilon'^2-W_\epsilon W_\epsilon''
 ={V_\epsilon''\over2}W_\epsilon^2>0.                        \tag{40}
\]

Moreover

\[
 V_\epsilon(t)-V_\epsilon(0)
 ={2\over\pi}\int_0^\infty
 {1-\cos(tx)\over x^2}e^{-\epsilon^2x^2/4}dx                 \tag{41}
\]

is conditionally negative definite.  Therefore `W_epsilon` is positive
definite; since it is Schwartz, its inverse Fourier transform is a
nonnegative even Schwartz source.

As `epsilon` tends to zero, `V_epsilon(t)` converges pointwise to `abs(t)`
and in fact `V_epsilon(t)>=abs(t)`: for `t>0`, the difference
`V_epsilon(t)-t` has derivative `erf(t/epsilon)-1<0` and tends to zero at
infinity; evenness handles `t<0`.  Dominated convergence gives

\[
 A_\epsilon\longrightarrow2,\qquad
 C_\epsilon\longrightarrow4,\qquad
 D_\epsilon\longrightarrow48.
\]

Consequently

\[
 A_\epsilon D_\epsilon-5C_\epsilon^2\longrightarrow16>0,     \tag{42}
\]

so (4) fails for every sufficiently small positive `epsilon`, despite the
strict global sign in (40).

Equations (37)--(42) prove that the norm theorem is neither equivalent to
nor a consequence of the known first-Laguerre formulations.  The successful
proof in Sections 2--5 genuinely uses the complete Jacobi orbit scale.

## Self-audit and nonclaims

- The factor `2 pi` in (5) is the nonunitary Plancherel factor.  It cancels
  from (4), rather than being absorbed into any norm.
- The derivative polynomials in (12) were obtained twice from the recurrence
  (11); substituting them into (16) and using (17) reproduces (18)--(19).
- The lower bound for `||psi'||_(2,+)` is a reverse triangle inequality on
  the fully summed tail.  No sign is assigned to `P_1` at the modular seam.
- The tail estimate (32) contains every orbit `n>=2`; (31) is the uniform
  summation step.
- The strict rational gap (34), not a rounded diagnostic, proves (1).
- The two independence models concern the ambient Fourier-positive source
  class, not the actual Jacobi theta profile and not RH counterexamples.
- No higher-rung five-scalar inequality, global sign of
  `Xi'^2-Xi Xi''`, all-degree moment theorem, or RH conclusion is claimed.
