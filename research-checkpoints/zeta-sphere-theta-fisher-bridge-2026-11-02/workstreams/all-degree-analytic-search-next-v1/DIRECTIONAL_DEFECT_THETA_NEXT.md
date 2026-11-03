# The directional sampling defect in complete-theta orbit coordinates

## Scope and outcome

Let `mathcal A` be the complete positive parent in the canonical zero split,
let `mathcal N=B^*B` be the sum of all local negative-quartet pieces, and let
`phi_N` be the monic `mathcal A`-orthogonal residual over the old same-parity
prefix `V`.  In the notation of `THETA_MISMATCH_SPECTRUM_NEXT.md`, put

\[
 \alpha=\mathcal A[\phi_N],\qquad z=B\phi_N,
 \qquad C=B|_V
\tag{1}
\]

after `mathcal A`-orthonormalizing `V`.  The desired one-column extension is

\[
 |\langle z,g\rangle|^2
 \leq \alpha\{\|g\|^2-\|C^*g\|^2\}
 \qquad(g\in\mathcal K).
\tag{2}
\]

This note inserts the *actual complete-theta source* into every factor in
(2).  There are two concrete outcomes.

1. Every entire quotient in `B` is the Fourier transform of the complete
   modular theta kernel convolved with an explicit shifted Green kernel.
   This gives a division-free, all-orbit formula for the directional
   amplitude and for the old inverse feedback.
2. A rigorous source-specific obstruction appears.  Any nonempty finite
   packet of positive theta orbits gives an algebraic quotient tail.  The
   positive exterior reserve paired with that quotient is then infinite at
   sufficiently high polynomial degree (already degree three for every
   natural first-`M` packet).  Thus finite-orbit positivity, first-orbit
   domination, or an orbitwise Cauchy majorant cannot prove (2): those
   operations leave the compact sampling term defined while destroying the
   positive parent which supplies `alpha`.

The surviving statement is an exact all-orbit theta--quartet correlation
inequality, displayed in (20) below.  It is target-equivalent, not a proof of
its sign.  No finite-height certificate, generic spectral-gap estimate, Xi
pivot sign, or RH claim is made.

## 1. The entire zero quotient is a theta Green transform

Use the Fourier convention

\[
 \widehat u(t)=\int_{\mathbb R}u(h)e^{-ith}\,dh.
\tag{3}
\]

The complete theta profile and its positive half-line orbits are

\[
 \psi(h)=\sum_{n\geq1}\phi_n^{\rm e}(h),
 \qquad
 \phi_n^{\rm e}(h)=\phi_n(|h|),
\tag{4}
\]

\[
 \phi_n(h)=4z_n(2z_n-3)e^{h/2-z_n},
 \qquad z_n=\pi n^2e^{2h}\quad(h\geq0).
\tag{5}
\]

Modular completion makes the sum in (4) smooth and even, and

\[
 F(t):=2\Xi(t)=\widehat\psi(t).
\tag{6}
\]

Fix one member `a+ib,a-ib` of a hypothetical off-line quartet, with
`b>0`, and retain the removable entire quotient

\[
 H_{a,b}(t)={F(t)\over(t-a)^2+b^2}.
\tag{7}
\]

Define

\[
 k_{a,b}(h)={1\over2b}e^{-b|h|+iah},
 \qquad u_{a,b}=k_{a,b}*\psi.
\tag{8}
\]

Since

\[
 \widehat{k_{a,b}}(t)={1\over(t-a)^2+b^2},
\]

the exact real-axis quotient identity is

\[
 \boxed{H_{a,b}=\widehat{u_{a,b}}.}
\tag{9}
\]

This is not an approximation to the removable quotient.  It is the same
function on the real axis, obtained from the actual complete-theta source.
The orbit expansion stays assembled as

\[
 u_{a,b}=\sum_{n\geq1}u_{a,b;n},
 \qquad
 u_{a,b;n}=k_{a,b}*\phi_n^{\rm e},
\tag{10}
\]

and, with

\[
 C_n(t)=\int_0^\infty\phi_n(h)\cos(th)\,dh,
\]

\[
 \boxed{
 \widehat{u_{a,b;n}}(t)
 ={2C_n(t)\over(t-a)^2+b^2},\qquad
 H_{a,b}(t)=\sum_{n\geq1}
 {2C_n(t)\over(t-a)^2+b^2}.}
\tag{11}
\]

The series is locally uniform on the real axis; the Gaussian decay in the
orbit index justifies (10)--(11) on every compact sampling interval.  The
functional-equation mirror is also retained exactly:

\[
 u_{-a,b}=\overline{u_{a,b}},
 \qquad H_{-a,b}(t)=H_{a,b}(-t).
\tag{12}
\]

Thus (9)--(12), rather than a zero-free surrogate or a first-orbit model,
are the relevant modular/orbit coordinates for `B`.

## 2. Sampling, direct penalty, and inverse feedback remain one object

For a fixed parity `epsilon`, write

\[
 \widetilde p(t)=i^{-\epsilon}p(it)\in\mathbb R[t].
\]

Index the canonically folded negative intervals by `j`, including their
exact multiplicities and fixed normalization constants.  A concrete
realization of the sampling factor is

\[
 (Bp)_j(t)=\kappa_j^{1/2}\mathbf1_{|t-a_j|<b_j}
 \widetilde p(t)H_{a_j,b_j}(t)
 \{b_j^2-(t-a_j)^2\}^{1/2},
\tag{13}
\]

where `kappa_j>0` absorbs precisely that canonical normalization and
multiplicity.  Hence, for `g=(g_j)_j` in the sampling direct sum,

\[
 \boxed{
 \langle B\phi_N,g\rangle
 =\sum_j\kappa_j^{1/2}\int_{|t-a_j|<b_j}
 \widetilde\phi_N(t)\widehat{u_{a_j,b_j}}(t)
 \{b_j^2-(t-a_j)^2\}^{1/2}\overline{g_j(t)}\,dt.}
\tag{14}
\]

The all-orbit sum in (11) is taken **before** the modulus, the quartet sum,
or Cauchy--Schwarz.  Formula (14) is the requested complete-theta expression
for the left side of (2).

Let

\[
 \mathfrak q=\mathcal A-\mathcal N.
\]

Write `P_p(t)=p(it)`.  The fixed parity phase cancels in its quadratic
products.  The same complete source gives the undivided Turan form

\[
 \mathfrak q(p,q)={1\over\pi}\int_{\mathbb R}
 f(t)P_p(t)\overline{P_q(t)}\,dt,
 \qquad f=\Xi'^2-\Xi\Xi'',
\tag{15}
\]

and the domain-safe assembled-leg orbit identity from
`THETA_ORBIT_CORRELATED_NEXT.md` is

\[
 f=\sum_{n\geq1}\mathcal B(\Xi,C_n),
\tag{16}
\]

with the complete `Xi` leg kept intact.  In particular the direct sampling
penalty is not discarded:

\[
 \boxed{
 \alpha=\mathcal A[\phi_N]
 =\mathfrak q[\phi_N]+\|z\|^2.}
\tag{17}
\]

Put `h=C^*z`.  The push-through identity gives the exact assembled payment

\[
\begin{aligned}
 \langle z,(I-CC^*)^{-1}z\rangle
 &=\|z\|^2+
   h^*(I-C^*C)^{-1}h,\\
 \alpha-\langle z,(I-CC^*)^{-1}z\rangle
 &=\mathfrak q[\phi_N]-
   h^*(I-C^*C)^{-1}h.
\end{aligned}
\tag{18}
\]

For (19)--(20), assume the old prefix `V` is nonzero.  If `V={0}`, the
inverse-feedback term is absent and the extension condition must instead be
read as the separate scalar base condition

\[
 \alpha\geq\|z\|^2
 \quad\Longleftrightarrow\quad
 \mathfrak q[\phi_N]\geq0,                       \tag{18a}
\]

by (17).  In that empty-prefix case the variational supremum below is empty
and the family (20) is vacuous, so it is not by itself equivalent to (18a).

Thus the direct penalty `||z||^2` and the inverse feedback have not been
estimated separately; the former cancels *exactly* against its occurrence in
the positive parent.  In unwhitened old-prefix coordinates, the remaining
feedback has the basis-free variational form

\[
 \boxed{
 h^*(I-C^*C)^{-1}h
 =\sup_{0\ne v\in V}
 { |\mathcal N(v,\phi_N)|^2\over\mathfrak q[v]}.}
\tag{19}
\]

Consequently (2) is equivalent to the following explicit all-orbit
theta--quartet inequality:

\[
 \boxed{
 \left|\sum_j\kappa_j\int_{|t-a_j|<b_j}
 \widetilde v(t)\widetilde\phi_N(t)
 |\widehat{u_{a_j,b_j}}(t)|^2
 \{b_j^2-(t-a_j)^2\}\,dt\right|^2
 \leq
 \mathfrak q[v]\,\mathfrak q[\phi_N]
 \quad(v\in V).}
\tag{20}
\]

Both factors on the right of (20) are the undivided complete-theta integral
(15)--(16); every `u` on the left is the complete modular sum (10), and all
quartets remain inside the single scalar product.  Equation (20) is a useful
noncircular *specification* of the missing arithmetic lemma, but its truth is
exactly the next Schur sign.  Invoking Cauchy in the signed form
`mathfrak q` would assume the conclusion.

## 3. Finite theta packets destroy the exterior reserve

The Green formula gives a sharp obstruction to the most immediate proposed
proof of (20).

**Finite-packet quotient theorem.**  Let `S` be any nonempty finite set of
positive theta-orbit indices and put

\[
 A_S(h)=\sum_{n\in S}\phi_n(h)\quad(h\geq0),
 \qquad C_S(t)=\int_0^\infty A_S(h)\cos(th)\,dh.
\tag{21}
\]

Let `2r+1` be the first odd order for which
`A_S^(2r+1)(0+)` is nonzero.  Such an order always exists.  For the packet
quotient

\[
 H_{a,b;S}(t)={2C_S(t)\over(t-a)^2+b^2},
\tag{22}
\]

there is a nonzero real constant `c_S` such that

\[
 C_S(t)=c_St^{-2r-2}+O(t^{-2r-4}),
 \qquad
 H_{a,b;S}(t)=2c_St^{-2r-4}{1+O(t^{-1})\}.
\tag{23}
\]

Therefore, for every nonzero polynomial `p` of degree `d>=2r+3`, the
positive exterior term paired with the same quotient diverges:

\[
 \boxed{
 \int_{|t-a|>b}|\widetilde p(t)|^2|H_{a,b;S}(t)|^2
 \{(t-a)^2-b^2\}\,dt=+\infty.}
\tag{24}
\]

**Proof.**  If every odd right derivative of `A_S` vanished at the modular
center, analyticity would make its analytic continuation even.  But the
explicit orbit formula gives

\[
 A_S(h)=-12e^{5h/2}\sum_{n\in S}\pi n^2+O(e^{9h/2})
 \quad(h\to-\infty),
\tag{25}
\]

whereas `A_S(-h)` is super-exponentially small.  This contradiction proves
the existence of `r`.  Repeated integration by parts in (21), using the
vanishing lower odd jets and the rapid decay at positive infinity, gives the
first asymptotic in (23).  Division by the quadratic gives the second.  If
`ell` is the leading coefficient of `p`, the integrand in (24) is

\[
 4|\ell|^2c_S^2|t|^{2d-4r-6}\{1+o(1)\}.
\tag{26}
\]

For `d>=2r+3` the exponent is at least zero, so either exterior ray already
has infinite integral.  This proves (24). \(\square\)

For the natural packet `S={1,...,M}`, the first uncancelled center jet is
already the first derivative.  Indeed

\[
 b_n:=\phi_n'(0+)
 =e^{-\pi n^2}
 \{-16(\pi n^2)^3+60(\pi n^2)^2-30\pi n^2\},
\tag{27}
\]

and modular smoothness gives

\[
 B_M:=\sum_{n=1}^M b_n=-\sum_{n>M}b_n>0.
\tag{28}
\]

Thus `r=0`, `C_S(t)=-B_Mt^-2+O(t^-4)`, and (24) diverges for every degree
`d>=3`.

## 4. Consequence for the directional defect route

The local negative interval in (13) is compact.  Hence replacing the full
quotient by `H_(a,b;S)` leaves its sampling integral finite at every fixed
degree.  The *same* replacement in the coupled exterior positive piece,
however, gives (24).  This asymmetry identifies precisely what an
orbit-truncated argument loses:

\[
 \text{compact negative sample survives,}
 \qquad
 \text{positive parent }\alpha\text{ ceases to exist.}
\]

There is no repair by a positive orbitwise Cauchy majorant.  Each individual
orbit has a nonzero first center derivative, so its self exterior norm is
already infinite for `d>=3`.  The actual quotient is finite because the
complete modular identities

\[
 \sum_{n\geq1}\phi_n^{(2k+1)}(0+)=0
 \qquad(k\geq0)
\tag{29}
\]

cancel every algebraic tail *before* the square in the exterior density is
formed.  Replacing
`|sum_n H_(a,b;n)|^2` by a positive sum of `|H_(a,b;n)|^2` removes exactly
those cross-orbit cancellations.

More generally, a packet whose first uncancelled odd jet has order `2r+1`
is domain-safe only through degree `2r+2`.  An all-degree packet must cancel
all odd center jets.  No nonempty finite packet can do so by (25); a viable
group must be an infinite, modularly complete theta group.

Therefore the next legitimate attack on (2) cannot be:

- a first-orbit or finite-orbit approximation to `B`;
- separate positive estimates for the orbit summands of `H`;
- a finite packet used for `z` while `alpha` is borrowed from the complete
  parent; or
- a bound of `h` followed by a generic lower bound for `I-C^*C`.

It must prove (20), or an equivalent form of (2), after the complete orbit
sum, the direct negative penalty, the positive exterior/background reserve,
and the old inverse feedback have all been assembled.  The Green identity
(9) supplies the exact theta arithmetic for that task; theorem (24) shows
why the modular completion cannot be relaxed.

## Self-audit and nonclaims

- Fourier constants in (8)--(11) follow directly from
  `widehat(exp(-b|h|)/(2b))=1/(t^2+b^2)` under (3).
- The mirror identity (12) uses only real evenness of `psi` and `F`.
- Equation (18) is the exact push-through identity; equation (19) is the
  Rayleigh formula in the old signed metric.  No smallest-eigenvalue or
  spectral-gap replacement occurs.
- The exterior factor in (24) is the same positive factor obtained by
  splitting the exact quartet contribution outside its negative interval.
  Its `t^2` leading growth is included in the exponent (26).
- The obstruction is analytic and all-degree.  No finite zero height or
  numerical degree replay is used.
- Equation (20) is target-equivalent.  Neither the Green representation nor
  the finite-packet obstruction proves its sign, any new Xi Laguerre pivot,
  or RH.
