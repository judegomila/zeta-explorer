# A seam-free Ewald grouping of the complete-theta orbits

## Scope

`THETA_ORBIT_CORRELATED_NEXT.md` shows that every raw finite packet of
positive half-line theta orbits has a modular-center seam and a negative
algebraic Turan tail.  This note constructs an exact cellwise Ewald
renormalization which removes that defect at every finite stage.  Each Ewald
cell is even, real analytic, rapidly decreasing, and cancels every odd center
jet.  The series converges strongly enough that Fourier transformation,
polynomial multiplication, and the mismatch-corrected paid form may be taken
term by term.

The construction does **not** give positive blocks.  Every Ewald cell changes
sign in physical space, and its Fourier transform changes sign infinitely
often.  Thus seam cancellation solves the domain defect of raw orbit packets,
but it does not solve the positive-definiteness or paid-Schur sign.  The
surviving result is a domain-safe correlated decomposition in which the full
theta leg and the global regression must remain assembled.  No endpoint
sign, all-degree positivity, or RH conclusion is proved.

## A continuous orbit family

For `x>0` and real `h`, define

\[
 \omega_x(h)=4z_x(2z_x-3)e^{h/2-z_x},
 \qquad z_x=\pi x^2e^{2h}.                         \tag{1}
\]

At the integer points, `omega_n` is the raw orbit `phi_n` in
`THETA_ORBIT_CORRELATED_NEXT.md`.  The family has the exact translation-scale
law

\[
 \boxed{\omega_x(h)=x^{-1/2}\omega_1(h+\log x).}   \tag{2}
\]

It also has a zero continuum mean at every spatial point.  Direct integration
gives, for `b>=0`,

\[
 \boxed{
 \int_0^b\omega_x(h)\,dx
 =-4\pi b^3 e^{5h/2-\pi b^2e^{2h}}.}              \tag{3}
\]

Indeed, after `y=sqrt(pi) x e^h`, the integrand is proportional to
`y^2(2y^2-3)e^(-y^2)`, which is `-d(y^3e^(-y^2))/dy`.  Letting `b` tend to
infinity in (3) yields

\[
 \boxed{\int_0^\infty\omega_x(h)\,dx=0.}          \tag{4}
\]

Equation (4) is the continuum counterterm behind the Ewald grouping.  It
adds zero to the complete theta sum, but cancels the non-summable modular
seam carried by the discrete orbit cells.

## Cell correction and even completion

For `n>=1`, put

\[
 \beta_n(h)=\omega_n(h)-\int_{n-1}^n\omega_x(h)\,dx,              \tag{5}
\]

and symmetrize only after making the cell correction:

\[
 \boxed{
 \varepsilon_n(h)=\frac12\{\beta_n(h)+\beta_n(-h)\}.}            \tag{6}
\]

Every `epsilon_n` is an even entire function of `h`.  In particular,

\[
 \varepsilon_n^{(2j+1)}(0)=0\qquad(j\geq0),        \tag{7}
\]

so every finite packet of Ewald cells is seam-free and its cosine transform
has no algebraic boundary-jet tail.

The cells reconstruct the complete theta profile exactly.  From (4),

\[
 \sum_{n\geq1}\beta_n(h)
 =\sum_{n\geq1}\omega_n(h)-\int_0^\infty\omega_x(h)dx
 =\psi(h).                                        \tag{8}
\]

Since `psi` is even, (6) gives

\[
 \boxed{\psi(h)=\sum_{n\geq1}\varepsilon_n(h).}   \tag{9}
\]

This is not merely the raw reflected series
`sum (omega_n(h)+omega_n(-h))/2`.  That series is pointwise correct but is not
termwise summable in the Fourier/moment topology needed here; the continuum
cell subtraction in (5) is essential for that stronger summability.

There are two equivalent Euler tilings, and it is useful to make the indexing
explicit.  Put

\[
 \sigma_x(h)=\frac12\{\omega_x(h)+\omega_x(-h)\},
 \qquad I_A(h)=\int_A^\infty\sigma_x(h)dx .
\]

Equation (3) and its reflection give the ordinary closed form

\[
 I_A(h)=2\pi A^3\left{
 e^{5h/2-\pi A^2e^{2h}}+e^{-5h/2-\pi A^2e^{-2h}}
 \right\},                                        \tag{9a}
\]

with `I_0=0`.  The present note uses **left cells**,

\[
 \varepsilon_n=\sigma_n-I_{n-1}+I_n,
 \qquad
 \sum_{n=1}^N\varepsilon_n=\sum_{n=1}^N\sigma_n+I_N. \tag{9b}
\]

An equally valid right-cell convention is
`e_0=I_1`, `e_n=\sigma_n-I_n+I_(n+1)`; its completed prefixes are
`e_0+sum_(n=1)^N e_n=sum_(n=1)^N sigma_n+I_(N+1)`.  These are two shifted
Euler decompositions, not two formulas for the same individual block.  The
left convention has no separate boundary cell and leads exactly to `d_n` in
(22).  In particular, all Fourier calculations below concern the left cells
(5)--(6), not the right-cell alternative.

## Strong convergence and all-degree domain safety

The convergence in (9) is stronger than pointwise convergence.  Differentiate
(2) with respect to `x`:

\[
 \partial_x\omega_x(h)
 =x^{-3/2}\left(\partial_h-\frac12\right)
  \omega_1(h+\log x).                              \tag{10}
\]

For `n>=2`, the fundamental theorem of calculus rewrites (5) as

\[
 \beta_n(h)=\int_{n-1}^n\int_x^n
              \partial_y\omega_y(h)\,dy\,dx.      \tag{11}
\]

The base orbit and all its derivatives have exponential decay at negative
infinity and superexponential decay at positive infinity.  Hence, for every
pair of nonnegative integers `j,M`, (10)--(11) imply

\[
 \int_{\mathbb R}(1+|h|)^M
 |\partial_h^j\beta_n(h)|\,dh
 \leq C_{j,M}(1+\log n)^M(n-1)^{-3/2}.             \tag{12}
\]

The right side is summable in `n`; the first cell is treated directly using
(3).  Reflection preserves the same bound.  Therefore (9) converges
absolutely in every weighted `W^(j,1)` seminorm in (12).  Consequences include:

- all real derivatives may be summed term by term;
- the Fourier transforms and all their derivatives may be summed uniformly
  after multiplication by any fixed power of frequency;
- every finite Ewald packet and the infinite sum define all polynomial
  moment forms without a degree cutoff.

Thus the Ewald construction repairs exactly the domain failure of raw finite
orbit packets.

## Closed formulas for the cells

Equation (3) makes (5) elementary:

\[
\begin{aligned}
 \beta_n(h)={}&\omega_n(h)
 +4\pi n^3e^{5h/2-\pi n^2e^{2h}}\\
 &-4\pi(n-1)^3e^{5h/2-\pi(n-1)^2e^{2h}}.          \tag{13}
\end{aligned}
\]

The first nontrivial cell is especially simple:

\[
 \beta_1(h)=8\pi e^{5h/2-\pi e^{2h}}
                    (\pi e^{2h}-1),               \tag{14}
\]

and hence

\[
 \boxed{
\begin{aligned}
 \varepsilon_1(h)=4\pi\{&e^{5h/2-\pi e^{2h}}(\pi e^{2h}-1)\\
                         +&e^{-5h/2-\pi e^{-2h}}(\pi e^{-2h}-1)\}.
\end{aligned}}                                     \tag{15}
\]

Formula (15) is even and entire, is positive at the center,

\[
 \varepsilon_1(0)=8\pi e^{-\pi}(\pi-1)>0,         \tag{16}
\]

but has a negative tail

\[
 \varepsilon_1(h)=-4\pi e^{-5h/2}{1+o(1)\}
 \qquad(h\to+\infty).                             \tag{17}
\]

More generally, (13) gives

\[
 \varepsilon_n(h)=-2\pi(3n-1)e^{-5h/2}{1+o(1)\}
 \qquad(h\to+\infty).                             \tag{18}
\]

Although every cell has negative physical tails, its total mass is positive.
Indeed, with

\[
 c_0=\pi^{-1/4}\Gamma(5/4)>0,
\]

the full-line orbit integral is

\[
 \int_{\mathbb R}\omega_x(h)dh=-c_0x^{-1/2}.
\]

Consequently

\[
 \boxed{
 \int_{\mathbb R}\varepsilon_n(h)dh
 =-c_0\{n^{-1/2}-2(\sqrt n-\sqrt{n-1})\}>0.}       \tag{19}
\]

The inequality follows because `x^(-1/2)` is decreasing, so its average on
`[n-1,n]` is strictly larger than its right-endpoint value.  Equations
(18)--(19) show that every Ewald cell changes sign in physical space.

## Mellin--Fourier form and the zeta completion

Put

\[
 s=\frac12-it,
 \qquad
 K(t)=s(s-1)\pi^{-s/2}\Gamma(s/2).                 \tag{20}
\]

The scale law (2) and direct Mellin transformation give

\[
 \widehat{\omega_x}(t)=K(t)x^{-s}.                 \tag{21}
\]

Define the cellwise Euler remainder

\[
 d_n(s)=n^{-s}
 -\frac{n^{1-s}-(n-1)^{1-s}}{1-s}.                \tag{22}
\]

Then the even completion has the exact real transform

\[
 \boxed{
 \widehat{\varepsilon_n}(t)
 =\operatorname {Re}\{K(t)d_n(1/2-it)\}.}         \tag{23}
\]

This Fourier calculation is an ordinary Fubini step for every left cell:
`||omega_x||_1` is a constant times `x^(-1/2)`, which is integrable on each
`[n-1,n]`, including `[0,1]`.  It does not require interchanging Fourier
transformation with the non-absolutely `x`-integrable tail representation of
`I_A` from (9a).

The cell errors are summable, and Euler's representation in the critical
strip gives

\[
 \sum_{n\geq1}d_n(s)=\zeta(s),
 \qquad 0<\operatorname {Re}s<1.                  \tag{24}
\]

Since `K(t)zeta(s)=2xi(s)=2Xi(t)`, equations (23)--(24) are the Fourier form
of (9).  The continuum counterterms are therefore precisely an Ewald/Euler
realization of the analytic zeta completion; no analytic continuation is
inserted after the fact.

For the first cell, `d_1(s)=-s/(1-s)`, so (23) simplifies to

\[
 \boxed{
 \widehat{\varepsilon_1}(t)
 =\operatorname {Re}\!\left\{
 s^2\pi^{-s/2}\Gamma(s/2)\right}.}               \tag{25}
\]

This gives a closed, independently checkable first modular packet.

## Seam-free does not mean positive definite

No nonzero finite real linear combination of Ewald cells has a one-signed
Fourier transform.  To see the mechanism first, for each fixed `n`,

\[
 d_n(1/2-it)
 =n^{-1/2}e^{it\log n}\{1+O_n(t^{-1})\}.           \tag{26}
\]

Stirling's formula writes `K(t)=|K(t)|e^(i theta(t))`, with

\[
 \theta'(t)=-\frac12\log\frac{t}{2\pi}+O(t^{-1}). \tag{27}
\]

The leading phase in (23) therefore has derivative

\[
 \theta'(t)+\log n
 =-\frac12\log\frac{t}{2\pi n^2}+o(1),            \tag{28}
\]

and tends monotonically through arbitrarily many multiples of `pi` after a
finite height.  The relative error in (26) tends to zero.  Choosing successive
phase points near even and odd multiples of `pi` already proves that each
individual transform

\[
 \widehat{\varepsilon_n}(t)
\]

takes both signs infinitely often.

The same conclusion holds for every finite nonzero real packet.  Indeed, if
`F` is finite and the real coefficients `c_n` are not all zero, then after
division by the positive quantity `|K(t)|`, its normalized transform is

\[
 Q_F(t):=|K(t)|^{-1}\sum_{n\in F}c_n
 \widehat{\varepsilon_n}(t)
 =\operatorname {Re}\{e^{i\theta(t)}P(t)\}+O_F(t^{-1}),
 \qquad
 P(t)=\sum_{n\in F}c_nn^{-1/2}e^{it\log n}.        \tag{28a}
\]

Here `P` is a nonzero exponential polynomial.  Choose a fixed interval length
`L` so large that, uniformly in `T`,

\[
 \int_T^{T+L}|P(t)|^2dt\geq c_F>0;                \tag{28b}
\]

this follows by expanding the square: the diagonal is
`L sum c_n^2/n`, while every off-diagonal integral is bounded independently
of `L` and `T`.  Nonstationary integration by parts, using (27), gives

\[
 \int_T^{T+L}e^{i\theta(t)}P(t)dt=o(1),\qquad
 \int_T^{T+L}e^{2i\theta(t)}P(t)^2dt=o(1).        \tag{28c}
\]

Consequently

\[
 \int_T^{T+L}Q_F(t)dt=o(1),\qquad
 \int_T^{T+L}Q_F(t)^2dt
 =\frac12\int_T^{T+L}|P(t)|^2dt
 +\frac12\operatorname {Re}\!\int_T^{T+L}
 e^{2i\theta(t)}P(t)^2dt+o(1)
 \geq\frac{c_F}{2}+o(1).                          \tag{28d}
\]

The normalized transform is uniformly bounded.  It cannot be eventually
nonnegative, since then `Q_F^2<=C Q_F` would contradict (28d); applying the
same argument to `-Q_F` rules out eventual nonpositivity.  It therefore takes
both signs infinitely often.  Hence no nonzero finite Ewald packet is
positive definite or negative definite.  Together with (18)--(19), this
proves that an individual cell has neither a pointwise physical sign nor a
Fourier sign.  In fact every nonempty finite packet with positive cell
coefficients has a negative tail by (18) and positive total mass by (19), so
it too changes sign in physical space.

Even signed raw-orbit coefficients cannot evade a stronger seam no-go.  For
`a>0`, write

\[
 \phi_a(h)=4ae^{2h}(2ae^{2h}-3)e^{h/2-ae^{2h}}.
\]

At the negative end it has the convergent expansion

\[
 \phi_a(h)=\sum_{m\geq1}(-1)^m
 \frac{4(2m+1)}{(m-1)!}a^m e^{(2m+1/2)h}.        \tag{28e}
\]

Suppose `A=sum_(j=1)^N c_j phi_(a_j)` for distinct positive `a_j`, and all
odd derivatives of `A` vanish at zero.  Analyticity then makes `A` globally
even.  Unless every `c_j` vanishes, Vandermonde invertibility gives an
`m<=N` with `sum_j c_j a_j^m != 0`; choosing the least such `m` in (28e)
shows that `A(-H)` has a nonzero ordinary exponential leading term as
`H` tends to infinity.  But `A(H)` is superexponentially small, contradicting
evenness.  Therefore

\[
 \boxed{\text{no nonzero finite signed raw-orbit packet cancels all odd jets}.}
 \tag{28f}
\]

Similarly, a finite sum
`sum_a (c_a phi_a(h)+d_a phi_a(-h))` is even exactly when `c_a=d_a` at
each distinct `a`.  Thus raw finite seam-free blocks are precisely reflected
pairs; the Ewald continuum term is what makes a series of such completed
blocks summable in the all-degree topology.

There is also a sharp no-go for keeping the raw orbit weights positive.  Let
`G` be a subset of the positive integer orbits and recall the first seam jets

\[
 b_1>0,\qquad b_n<0\ (n\geq2),\qquad\sum_{n\geq1}b_n=0.
\]

If `1` is not in `G`, its first seam jet is negative.  If `1` is in `G` but
`G` omits any other orbit, its seam jet equals minus a nonempty sum of
negative omitted jets and is positive.  Thus the only positive orbit subset
whose first seam jet vanishes is the full set.  Nontrivial seam-free packets
must introduce signed continuum/dual terms such as (5); they cannot be a
partition of the original positive orbits.

## The surviving correlated paid decomposition

Set

\[
 E_n(t)=\frac12\widehat{\varepsilon_n}(t),
 \qquad \Xi(t)=\sum_{n\geq1}E_n(t),                \tag{29}
\]

and retain the symmetric Turan bilinear operator

\[
 \mathcal B(A,B)=A'B'-\frac12(AB''+A''B).
\]

Define

\[
 g_n^{\rm Ew}(t)=\mathcal B(\Xi,E_n)(t).           \tag{30}
\]

The strong convergence proved above gives, with all polynomial weights,

\[
 \boxed{
 \Xi'^2-\Xi\Xi''=\sum_{n\geq1}g_n^{\rm Ew}.}      \tag{31}
\]

The inverse profiles are

\[
 R_n^{\rm Ew}(u)=\frac1{16}\int_{\mathbb R}v^2
 \psi\!\left(\frac{u+v}{2}\right)
 \varepsilon_n\!\left(\frac{u-v}{2}\right)dv,   \tag{32}
\]

with `widehat(R_n^Ew)=g_n^Ew`.  Unlike the positive assembled-leg profiles
in `THETA_ORBIT_CORRELATED_NEXT.md`, the profiles (32) are signed because the
Ewald cells are signed.  Their advantage is different: every block is smooth,
rapidly decreasing, and valid at every polynomial degree.

For the actual mismatch-corrected residual

\[
 \pi=p-q_X+q_{Q^{-1}r}=p-q_A,
\]

put

\[
 \mathfrak q_n^{\rm Ew}(a,b)
 ={1\over\pi}\int_{\mathbb R}g_n^{\rm Ew}(t)
 P_a(t)\overline{P_b(t)}dt.                       \tag{33}
\]

Then the paid border has the exact all-degree decomposition

\[
 \boxed{
 A_X-B_Y-C_{XY}
 =2\sum_{n\geq1}\mathfrak q_n^{\rm Ew}(\pi,\pi).} \tag{34}
\]

Equation (34) is a correlated compensated identity, not a sum of positive
terms.  The old metric and mismatch vector must still be summed before
forming `Q^(-1)r`; blockwise regression or blockwise inversion changes
`pi`.  Thus Ewald completion removes the seam/domain obstruction but leaves
the same theta-specific sign problem in a cleaner summable coordinate system.

## Resulting route status

The Ewald cells (5)--(6) provide the requested modularly completed grouping:
every finite packet cancels every center seam jet, its Fourier data are
rapidly decreasing, and the infinite sum is legitimate against arbitrary
polynomial weights.  The explicit first block is (15)/(25).

What the construction does **not** provide is positivity.  The blocks are
necessarily signed, and both their physical profiles and Fourier transforms
change sign.  A viable continuation must therefore prove cancellation among
the terms in (34), perhaps by pairing adjacent Euler remainders or by using a
global theta arithmetic inequality.  It cannot assign a nonnegative paid
budget to each Ewald cell independently.

## Nonclaims

- The Ewald grouping proves no sign of `Xi'^2-Xi Xi''` or of a paid pivot.
- The sign changes of individual cells are not a complete-theta or RH
  counterexample.
- Equation (24) is the convergent Euler cell representation of zeta in the
  critical strip; it is not a finite certificate.
- No blockwise inverse or regression is asserted.
