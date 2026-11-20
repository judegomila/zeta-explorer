# The first Ewald index moment: exact packet and a sign no-go

## Scope

For one actual residual let `q` be its real polynomial on the Fourier
line.  It has definite parity, and the endpoint derivative isolated in
`EWALD_SCALAR_CELL_TAIL_NEXT.md` is

\[
 S'(1)={1\over2\pi}\int_{\mathbb R}q(t)^2
          \mathcal B(\Xi,H_1)(t)\,dt,             \tag{1}
\]

where

\[
 \mathcal B(A,B)=A'B'-\frac12(AB''+A''B),
 \qquad
 H_1(t)=-s(2-s)\pi^{-s/2}\Gamma(s/2)\zeta(s-1),
 \quad s={1\over2}-it.                            \tag{2}
\]

This note determines the exact physical packet behind `H_1`, including
its transform normalization, domain, and parity.  The packet changes sign:
it is positive at the modular centre and negative in both sufficiently far
tails.  Therefore a proof of (1) cannot come from pointwise positivity of
the first-index-moment packet.

That is a route no-go, not an endpoint sign theorem.  The sign-changing
packet remains paired with the complete theta profile and the actual
residual differential operator.  Nothing below determines the sign of that
correlation, proves a Laguerre inequality, or proves RH.

## 1. Exact inverse transform

Use throughout

\[
 \widehat f(t)=\int_{\mathbb R}f(h)e^{-ith}\,dh,
 \qquad
 f(h)={1\over2\pi}\int_{\mathbb R}\widehat f(t)e^{ith}\,dt.   \tag{3}
\]

Initially take `Im(t)>3/2`, equivalently `Re(s)>2`, and put

\[
 g(h)=2e^{h/2}\sum_{n\geq1}n e^{-\pi n^2e^{2h}}.               \tag{4}
\]

The sum is locally normally convergent.  On this shifted line its Fourier
integral is ordinary and absolutely convergent.  The substitution
`x=e^(2h)` gives

\[
 \widehat g(t)
 =\pi^{-s/2}\Gamma(s/2)\sum_{n\geq1}n^{1-s}
 =\pi^{-s/2}\Gamma(s/2)\zeta(s-1).              \tag{5}
\]

Since Fourier transformation sends `D=d/dh` to multiplication by `it`,

\[
 (it)^2+it-\frac34=-s(2-s).                       \tag{6}
\]

Termwise differentiation in (4) is valid on compact `h` intervals.  If

\[
 z_n=\pi n^2e^{2h},
\]

then a direct calculation gives

\[
 \left(D^2+D-\frac34\right)
 \{2ne^{h/2}e^{-z_n}\}
 =8ne^{h/2}z_n(z_n-2)e^{-z_n}.                   \tag{7}
\]

Consequently define the real packet

\[
 \boxed{
 \chi(h)=8e^{h/2}\sum_{n\geq1}
             n z_n(z_n-2)e^{-z_n}.}              \tag{8}
\]

On `Im(t)>3/2`, integration by parts in (4) has no boundary term and
(5)--(7) prove `widehat(chi)=H_1`.  Section 2 proves that `chi(h)` is
`O(e^(5h/2))` as `h` tends to minus infinity and is superexponentially
small at plus infinity.  Hence its Fourier transform is holomorphic for

\[
 \operatorname {Im}t>-\frac52.                   \tag{9}
\]

The right side of (2) is holomorphic on the same open half-plane.  Indeed,
the zeta pole at `s=2` is cancelled by `2-s`, the gamma pole at `s=0` is
cancelled by `s`, and the next gamma pole is `s=-2`, precisely on the
boundary of (9).  Analytic continuation from `Im(t)>3/2` therefore yields
the normalized identity

\[
 \boxed{\widehat\chi(t)=H_1(t)\qquad
        (\operatorname {Im}t>-5/2).}              \tag{10}
\]

In particular, (10) is an ordinary Fourier identity on the real line.  It
does not require assigning a real-line transform to the exponentially
growing auxiliary function `g` itself.

## 2. An Euler--Maclaurin tail with an explicit remainder

Write `h=-H`,

\[
 a=\pi e^{-2H},\qquad \delta=\sqrt a,
 \qquad
 \phi(u)=u^3(u^2-2)e^{-u^2}.                     \tag{11}
\]

Then (8) becomes

\[
 \chi(-H)=8e^{-H/2}F(a),
 \qquad
 F(a)=\delta^{-1}\sum_{n\geq1}\phi(n\delta).    \tag{12}
\]

The continuum term vanishes exactly:

\[
 \int_0^\infty\phi(u)\,du
 ={1\over2}\int_0^\infty y(y-2)e^{-y}\,dy=0.    \tag{13}
\]

Apply Euler--Maclaurin on `[0,infinity)` through `B_6`, with its periodic
Bernoulli remainder.  Since `phi(0)=phi'(0)=0`,

\[
 F(a)=-{B_4\over4!}\,a\phi'''(0)
      -{B_6\over6!}\,a^2\phi^{(5)}(0)+\mathcal R(a)
     =-{a\over60}-{a^2\over84}+\mathcal R(a).    \tag{14}
\]

The standard remainder bound is, here,

\[
 |\mathcal R(a)|
 \leq {2\zeta(6)\over(2\pi)^6}
       a^2\|\phi^{(6)}\|_{L^1(0,\infty)}
 ={a^2\over30240}\|\phi^{(6)}\|_1.              \tag{15}
\]

For completeness, differentiating the Gaussian polynomial gives

\[
 \phi^{(6)}(u)=e^{-u^2}
 \{-10080u+40320u^3-37800u^5+12432u^7
                    -1568u^9+64u^{11}\}.        \tag{16}
\]

Using `int_0^infinity u^(2j+1)e^(-u^2)du=j!/2` term by term in the
triangle inequality yields the completely explicit bound

\[
 \|\phi^{(6)}\|_1\leq122952.                     \tag{17}
\]

Equations (14)--(17) imply

\[
 \left|F(a)+{a\over60}\right|
 \leq {367\over90}a^2.                           \tag{18}
\]

Thus `F(a)<0` whenever `0<a<3/734`; in particular,
`chi(-H)<0` when `H>(1/2)log(734*pi/3)`.  More importantly, the controlled
asymptotic is

\[
 \boxed{
 \chi(-H)=-{2\pi\over15}e^{-5H/2}
              +O(e^{-9H/2}).}                   \tag{19}
\]

This proves the negative-end decay asserted before (10), with an ordinary
Euler--Maclaurin remainder rather than a formal theta expansion.
Applying the same scaled Euler--Maclaurin formula after any fixed number of
`h` derivatives gives the corresponding exponential derivative bounds.

At the other end every summand in (8) is positive for `H>=0`, because
`pi*n^2*e^(2H)>2`.  Moreover, using `n^2>=n` to majorize the remaining
geometric power sum shows

\[
 0<\chi(H)
 =O\!\left(e^{9H/2-\pi e^{2H}}\right).           \tag{20}
\]

It is therefore negligible compared with (19).

## 3. The even packet changes sign

Hermitian symmetry in (2) gives

\[
 H_1(-t)=\overline{H_1(t)}.
\]

The real even spectral part and its physical packet are

\[
 A_1(t)=\operatorname {Re}H_1(t),
 \qquad
 \eta(h)={\chi(h)+\chi(-h)\over2},
 \qquad \widehat\eta=A_1.                        \tag{21}
\]

At the modular centre, every term is strictly positive:

\[
 \eta(0)=\chi(0)
 =8\sum_{n\geq1}n(\pi n^2)(\pi n^2-2)e^{-\pi n^2}>0.          \tag{22}
\]

By (19)--(20),

\[
 \boxed{
 \eta(H)=-{\pi\over15}e^{-5H/2}
                 +O(e^{-9H/2})<0
 \quad\hbox{for all sufficiently large }H.}     \tag{23}
\]

Evenness supplies the same negative tail at minus infinity.  Hence `eta`
has at least two real zeros and both positive and negative parts are
nonzero.  Notice also that its total mass is positive:

\[
 \int_{\mathbb R}\eta(h)\,dh=H_1(0)
 =-{3\over4}\pi^{-1/4}\Gamma(1/4)\zeta(-1/2)>0.
                                                               \tag{24}
\]

The last sign follows directly from the zeta functional equation, since
`sin(-pi/4)<0` and `zeta(3/2)>0`.  Thus the negative tails are genuine; they
are not a zero-mass normalization artefact.

## 4. Exact physical correlation for `S'(1)`

The complete theta normalization used in the Ewald notes is

\[
 \Xi(t)=\frac12\widehat\psi(t),                  \tag{25}
\]

where `psi` is real and even.  A direct convolution calculation from (3)
uses the general identity

\[
 \mathcal F^{-1}\!\left\{
 \mathcal B\!\left({1\over2}\widehat f,\widehat g\right)
 \right\}(u)
 ={1\over4}\int_{\mathbb R}(u-2x)^2f(x)g(u-x)\,dx.             \tag{26a}
\]

Taking `f=psi`, `g=eta`, and then `v=2x-u` gives

\[
 \boxed{
 \mathcal F^{-1}\{\mathcal B(\Xi,A_1)\}(u)
 =R_1(u):={1\over8}\int_{\mathbb R}v^2
 \psi\!\left({u+v\over2}\right)
 \eta\!\left({u-v\over2}\right)dv.}            \tag{26}
\]

The factor `1/8` is important.  In the notation where both Fourier legs
are one-half transforms, the corresponding factor is `1/16`; here
`A_1=widehat(eta)` has no extra one-half.

Let `D=d/du`.  Fourier inversion and (1) yield the exact endpoint identity

\[
 \boxed{
 S'(1)=\left[q(-iD)^2R_1\right](0).}             \tag{27}
\]

There is no missing factor of two: the `1/(2*pi)` in (1) is precisely the
inverse-Fourier normalization at `u=0`.

Here is the parity audit.  For either an even or an odd actual residual,
`q(-t)=+q(t)` or `q(-t)=-q(t)`, respectively, so `q(t)^2` is even.  Also

\[
 \mathcal B(\Xi,H_1)(-t)
 =\overline{\mathcal B(\Xi,H_1)(t)}.             \tag{28}
\]

The imaginary odd part therefore integrates to zero in both parity
ladders, justifying the replacement of `H_1` by `A_1` in (26)--(27).
Equivalently, `q(-iD)^2` is an even-order real differential operator for
both parities (for odd `q`, its leading real sign includes the expected
factor `(-i)^2`).

All operations in (26)--(27) are ordinary.  Equations (19)--(23) give
exponential decay of `eta` and its derivatives, while `psi` and all its
derivatives are superexponentially decreasing.  The convolution and every
finite derivative required by `q` are absolutely convergent.  No division
by `Xi`, `H_1`, or the unknown endpoint density occurs.

## 5. Exact conclusion and surviving target

Equations (21)--(23) prove the precise no-go:

\[
 \boxed{\text{the completed first-index-moment packet is not pointwise
 one-signed in physical space.}}                 \tag{29}
\]

Thus neither a claim `eta>=0` nor a claim `eta<=0` can sign the actual
endpoint derivative.  Splitting `eta=eta_+-eta_-` is exact, but (27)
contains a differentiated cross-correlation with `psi`; separate mass or
tail estimates for `eta_+` and `eta_-` do not order its two terms.

What remains is the genuinely correlated inequality

\[
 \left[q(-iD)^2
 \left\{{1\over8}\int_{\mathbb R}v^2
 \psi\!\left({u+v\over2}\right)
 \eta\!\left({u-v\over2}\right)dv\right\}
 \right]_{u=0}
 \quad\hbox{with its required endpoint sign}.    \tag{30}
\]

The sign change in `eta` does not imply that (30) is negative, positive, or
zero.  It only proves that packetwise positivity cannot replace this
complete correlation.  The accompanying standard-library checker
`src/verify_ewald_endpoint_packet.py` replays (6)--(8), the derivatives in
(14), the explicit remainder majorant (16)--(18), and a labelled numerical
diagnostic of (22)--(23).  The diagnostic is not used as proof.
