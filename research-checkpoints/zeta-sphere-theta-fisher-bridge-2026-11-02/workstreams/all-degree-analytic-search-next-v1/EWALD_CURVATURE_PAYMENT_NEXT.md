# Ewald curvature payment, Galerkin null modes, and a regional no-go

## Scope

`EWALD_CORRELATED_PAIRING_NEXT.md` rewrites the globally corrected paid form
as

\[
 \mathfrak q(\pi)
 =\frac12\int_0^\infty
 \{x\}(1-\{x\})J_\pi''(x)\,dx.                   \tag{1}
\]

This note attacks the actual curvature source rather than replacing it by
finite orbit data.  The residual

\[
 \pi=p-q_X+q_{Q^{-1}r}=p-q_A
\]

is formed globally throughout.

The main outcomes are:

1. `J_pi''` has exact division-free frequency, channel, and physical-space
   formulas with all residual terms assembled.
2. The corrected residual `pi` is orthogonal for the **signed target**, but it
   is not the positive `X`/Galerkin residual.  Its orthogonality creates one
   global curvature-null mode, not a regional sign.
3. Positive and negative curvature have equal total mass and equal first two
   global moments.  The payment is exactly a comparison of their fractional-
   cell locations.
4. The previous core--edge sufficient condition collapses to perfect sign
   segregation: it permits no positive curvature at an edge and no negative
   curvature in a core.
5. Cosine self-duality, the forced moments, positive old data, and Galerkin
   orthogonality do not by themselves force the payment sign.  An explicit
   self-dual theta-shaped countermodel proves this source-free obstruction.

Thus the natural coarse regional split is retired.  A surviving
degree-independent target is a stochastic placement inequality for the
positive and negative curvature measures.  That inequality is not proved
for the complete-theta residual here, so no paid sign or RH conclusion is
claimed.

## 1. Exact assembled formulas for the curvature

Retain the notation

\[
 C_x(t)=\frac12\operatorname {Re}\{K(t)x^{-s}\},
 \qquad s=\frac12-it,
 \qquad K(t)=s(s-1)\pi^{-s/2}\Gamma(s/2),          \tag{2}
\]

and let

\[
 P(t)=P_\pi(t),\qquad W(t)=|P(t)|^2.
\]

The scale derivative is explicit:

\[
 \boxed{
 \partial_x^2C_x(t)=\frac12\operatorname {Re}
 \{K(t)s(s+1)x^{-s-2}\}.}                         \tag{3}
\]

Differentiating the already assembled source gives

\[
 \boxed{
 J_\pi''(x)=\frac1\pi\int_{\mathbb R}
 \mathcal B(\Xi,\partial_x^2C_x)(t)W(t)\,dt,}    \tag{4}
\]

where

\[
 \mathcal B(A,B)=A'B'-\frac12(AB''+A''B).
\]

No derivative in (4) lands on a separately estimated feature, residue, or
mismatch term.

Two integrations by parts in `t` put every residual derivative into one
source:

\[
 \boxed{
 J_\pi''(x)=-\frac1\pi\int_{\mathbb R}
 \partial_x^2C_x(t)\,\Lambda_\pi(t)\,dt,}         \tag{5}
\]

with

\[
 \boxed{
 \Lambda_\pi
 =2\Xi''W+2\Xi'W'+\frac12\Xi W''.}              \tag{6}
\]

The exponential decay of `Xi`, together with polynomial growth of `P`, kills
all boundary terms.  Formula (5) is zero-safe and contains no quotient by
`Xi` or by an orbit transform.

### Channel form

For a real frequency profile `F`, define

\[
 \mathcal A_F P=FP',\qquad
 \mathcal B_F P=FP'+2F'P.                         \tag{7}
\]

The polarized first-order identity gives

\[
 \boxed{
 \begin{aligned}
 J_\pi''(x)=\frac1{2\pi}\operatorname {Re}
 \int_{\mathbb R}\{&
 \mathcal B_\Xi P\,
 \overline{\mathcal B_{\partial_x^2C_x}P}\\
 &-\mathcal A_\Xi P\,
 \overline{\mathcal A_{\partial_x^2C_x}P}\}\,dt.
 \end{aligned}}                                    \tag{8}
\]

This is a difference of two assembled cross-channel pairings.  Separate
Cauchy bounds on the two terms discard precisely the compensation at issue.

### Physical form

Let

\[
 R_x(u)=\frac1{16}\int_{\mathbb R}v^2
 \psi\!\left(\frac{u+v}{2}\right)
 \sigma_x\!\left(\frac{u-v}{2}\right)dv.
\]

Then

\[
 \boxed{
 J_\pi''(x)
 =2[\pi(D)\pi(-D)\,\partial_x^2R_x](0),}          \tag{9}
\]

where

\[
 \partial_x^2R_x(u)=\frac1{16}\int_{\mathbb R}v^2
 \psi\!\left(\frac{u+v}{2}\right)
 \partial_x^2\sigma_x\!\left(\frac{u-v}{2}\right)dv. \tag{10}
\]

The orbit derivative itself is

\[
 \begin{aligned}
 \partial_x^2\sigma_x(h)=\frac{x^{-5/2}}2\{&
 (\partial_h-\tfrac32)(\partial_h-\tfrac12)
 \omega_1(h+\log x)\\
 &+(\partial_h+\tfrac32)(\partial_h+\tfrac12)
 \omega_1(-h+\log x)\}.
 \end{aligned}                                     \tag{11}
\]

Equations (9)--(11) justify all `x` derivatives by ordinary rapidly decaying
correlations.  They also show why (4) must not be interpreted by separately
transforming the nonintegrable small-scale asymptotic modes.

## 2. Which Galerkin orthogonality the corrected residual has

Put

\[
 U=R_X=p-q_X,\qquad
 V=q_X-q_A=q_{Q^{-1}r},\qquad
 \pi=U+V.                                         \tag{12}
\]

Only `U` is the positive `X`-channel residual.  In the zero-safe frequency
coordinates of `GALERKIN_FACTORIZATION_NEXT.md`, it obeys

\[
 \langle\mathcal B_\Xi P_q,
          \mathcal B_\Xi P_U\rangle=0
 \qquad(q\in P_{\rm old}).                        \tag{13}
\]

The globally corrected residual generally does **not** satisfy (13):

\[
 \langle\mathcal B_\Xi P_q,
          \mathcal B_\Xi P_\pi\rangle
 =\langle\mathcal B_\Xi P_q,
          \mathcal B_\Xi P_V\rangle.             \tag{14}
\]

The right side is the mismatch correction and is not zero in general.

What `pi` does satisfy is the signed-target orthogonality

\[
 \boxed{
 \mathfrak q(q,\pi)=0
 \qquad(q\in P_{\rm old}).}                       \tag{15}
\]

This distinction is essential: applying the positive Galerkin normal
equation directly to `pi` silently drops `Q^(-1)r`.

### The exact curvature-null mode

Polarize the scale source:

\[
 J_{a,b}(x)=\frac1\pi\int_{\mathbb R}
 \mathcal B(\Xi,C_x)(t)
 P_a(t)\overline{P_b(t)}\,dt.                     \tag{16}
\]

Let

\[
 K_2(x)=\frac12\{x\}(1-\{x\}).                  \tag{17}
\]

The trapezoidal identity polarizes to

\[
 \mathfrak q(a,b)=\int_0^\infty
 K_2(x)J_{a,b}''(x)\,dx.                          \tag{18}
\]

Since `V` is old, (15) gives

\[
 \boxed{
 \int_0^\infty K_2(x)J_{\pi,V}''(x)\,dx=0.}     \tag{19}
\]

For real fixed-parity polynomials, the sources are symmetric and

\[
 J_{\pi,\pi}''
 =J_{U,U}''-J_{V,V}''+2J_{\pi,V}''.               \tag{20}
\]

Consequently

\[
 \boxed{
 \mathfrak q(\pi)=\int_0^\infty K_2(x)
 \{J_{U,U}''(x)-J_{V,V}''(x)\}\,dx.}             \tag{21}
\]

Equation (21) is the curvature-level regression payment.  The cross-source
term in (20) is null only after integration over **all** scales.  It has no
forced sign, and deleting it separately on a core or edge region is invalid.

## 3. Assembled coefficient coordinates

Choose an old basis `q_1,...,q_m`.  Define the matrix, vector, and scalar
scale sources

\[
 \mathbf J(x)=(J_{q_i,q_j}(x)),\qquad
 \mathbf j(x)=(J_{q_i,p}(x)),\qquad
 j_0(x)=J_{p,p}(x).                                \tag{22}
\]

Let

\[
 A=\mathfrak q(\mathbf q,\mathbf q)>0,\qquad
 b=\mathfrak q(\mathbf q,p),\qquad
 \alpha=A^{-1}b,\qquad
 \pi=p-\mathbf q\alpha.                           \tag{23}
\]

Then the curvature remains assembled as

\[
 \boxed{
 J_\pi''=j_0''-2\operatorname {Re}(\alpha^*\mathbf j'')
           +\alpha^*\mathbf J''\alpha.}           \tag{24}
\]

For a measurable scale region `S`, put

\[
 \mathcal T_S(F)=\int_S K_2(x)F''(x)\,dx.
\]

If `C` and `E` partition the scale line, define the regional cross defects

\[
 d_S=\mathcal T_S(\mathbf j-\mathbf J\alpha).
\]

The only cancellation supplied by Galerkin orthogonality is

\[
 \boxed{d_C+d_E=0.}                               \tag{25}
\]

There is no pointwise equality and no assertion that either regional matrix
`T_S(J)` is positive.  Turning (25) into a Cauchy payment would require
regional positivity or a diagonal-versus-cross domination estimate.  Either
one is an additional theta-specific inequality, not a consequence of the
global regression.

No regional inverse is formed in (22)--(25); `alpha` is the one global
actual-target regression already present in `pi`.

## 4. Forced cancellation moments and the exact placement criterion

Cosine self-duality gives

\[
 \int_0^\infty J_\pi(x)\cos(2\pi xy)\,dx
 =\frac12J_\pi(y),                                \tag{26}
\]

while the endpoint behavior is

\[
 J_\pi(0)=J_\pi'(0)=0,\qquad
 J_\pi^{(k)}(x)\longrightarrow0\quad(x\to\infty). \tag{27}
\]

Integration by parts gives three forced curvature moments:

\[
 \boxed{
 \int_0^\infty x^jJ_\pi''(x)\,dx=0
 \qquad(j=0,1,2).}                                \tag{28}
\]

For all `m>=1`, differentiating (26) at zero gives the higher exact relation

\[
 \boxed{
 \int_0^\infty x^{2m}J_\pi''(x)\,dx
 =\frac{(2m)(2m-1)(-1)^{m-1}}
        {2(2\pi)^{2m-2}}
 J_\pi^{(2m-2)}(0).}                              \tag{29}
\]

Also,

\[
 \int_0^\infty J_\pi''(x)\cos(2\pi xy)\,dx
 =-2\pi^2y^2J_\pi(y).                             \tag{30}
\]

Unless `J_pi` vanishes, its curvature must therefore have both signs.

Let

\[
 M=\int_0^\infty(J_\pi'')_+dx
  =\int_0^\infty(J_\pi'')_-dx.                   \tag{31}
\]

If `M>0`, normalize the two curvature parts to probability measures

\[
 d\mu_+=M^{-1}(J_\pi'')_+dx,\qquad
 d\mu_-=M^{-1}(J_\pi'')_-dx.                     \tag{32}
\]

Then (1) is exactly

\[
 \boxed{
 \mathfrak q(\pi)
 =M\{\mathbb E_{\mu_+}K_2-\mathbb E_{\mu_-}K_2\}.} \tag{33}
\]

Thus positive curvature must lie, on average, farther from the integer seams
than negative curvature.  This also gives the degree-independent bound

\[
 \boxed{
 |\mathfrak q(\pi)|
 \leq\frac1{16}\|J_\pi''\|_{L^1(0,\infty)}.}     \tag{34}
\]

Indeed, `0<=K_2<=1/8`, and the equal masses in (31) allow subtraction of the
midrange constant `1/16` before taking the absolute value.

There is a sharper support-free sufficient condition.  Put

\[
 d(x)=\min(\{x\},1-\{x\})\in[0,1/2].
\]

Since `K_2=d(1-d)/2` is increasing in `d`, the stochastic dominance

\[
 \boxed{
 \mu_+\{d\geq r\}\geq\mu_-\{d\geq r\}
 \quad(0\leq r\leq1/2)}                           \tag{35}
\]

implies `mathfrak q(pi)>=0` by the layer-cake formula.  Unlike a blockwise
sign assertion, (35) permits both curvature signs in every scale cell.  It is
a genuine degree-independent payment criterion, but is not proved here for
the theta residual.

The zero moments in (28) say additionally that `mu_+` and `mu_-` have the
same global mean and second moment.  The missing information is specifically
their distribution modulo the integer lattice.

## 5. The previous core--edge condition collapses

Fix `0<delta<1/2`, and let `C_delta` and `E_delta` be the core and edge
regions from `EWALD_CORRELATED_PAIRING_NEXT.md`.  Write

\[
 P_C=\int_{C_\delta}(J_\pi'')_+\,dx,
 \quad P_E=\int_{E_\delta}(J_\pi'')_+\,dx,
 \quad N_C=\int_{C_\delta}(J_\pi'')_-\,dx,
 \quad N_E=\int_{E_\delta}(J_\pi'')_-\,dx.
\]

The previous sufficient condition was

\[
 4a_\delta P_C\geq N_C+4a_\delta N_E,
 \qquad a_\delta=\delta(1-\delta).                \tag{36}
\]

But (31) gives

\[
 P_C+P_E=N_C+N_E.
\]

Substitution into (36) yields

\[
 -4a_\delta P_E\geq(1-4a_\delta)N_C.             \tag{37}
\]

Since `0<4a_delta<1`, (37) holds if and only if

\[
 \boxed{P_E=0,\qquad N_C=0.}                     \tag{38}
\]

Therefore that coarse condition is not a quantitative payment estimate.  It
requires perfect sign segregation almost everywhere:

- no positive curvature in any edge region;
- no negative curvature in any core region.

For example, continuity and `J_pi''(0)>0` immediately violate (38) for every
positive `delta`.  The stochastic criterion (35), rather than (36), is the
surviving regional formulation.

## 6. The exact center curvature has no forced sign

Let `varpi` denote the real residual polynomial, with
\(\varpi(-z)=\epsilon\varpi(z)\) for
\(\epsilon\in\{+1,-1\}\), and put

\[
 a=\frac52,\qquad
 \mathcal M(\lambda)=\int_{\mathbb R}\psi(h)e^{\lambda h}dh
 =2\Xi(i\lambda).                                 \tag{39}
\]

The small-scale orbit expansion begins

\[
 \sigma_x(h)=-6\pi x^2
 \{e^{5h/2}+e^{-5h/2}\}+O(x^4).                  \tag{40}
\]

Set

\[
 v_0=\varpi(a),\qquad
 v_1=\varpi'(a),\qquad
 v_2=\varpi''(a).
\]

Direct evaluation of the assembled physical pairing (9) gives

\[
 \boxed{
 J_\pi''(0)=-12\pi\epsilon\{
 2v_0^2\mathcal M''(a)+4v_0v_1\mathcal M'(a)
 +(v_0v_2+v_1^2)\mathcal M(a)\}.}                \tag{41}
\]

Although \(\mathcal M(a)\), \(\mathcal M'(a)\), and
\(\mathcal M''(a)\) are positive, the residual jet term
`v_0 v_2` has no fixed sign.  Equivalently, the bracket is

\[
 2\mathcal M(a)\,
 \mathbb E_a(v_0h+v_1)^2
 +(v_0v_2-v_1^2)\mathcal M(a),                    \tag{42}
\]

where `E_a` is expectation under the positive density proportional to
`psi(h)e^(a h)`.  Parity, positivity of `psi`, and global orthogonality do not
force the sign in (41).  A bound on the actual residual jet would be new
theta-specific input.

## 7. What signed-target orthogonality adds globally

Let `varpi` be monic of degree `N`.  The polynomial

\[
 z\varpi'(z)-N\varpi(z)
\]

has the same parity and lies in the old prefix.  Applying (15), then
integrating by parts in frequency, gives the exact virial identity

\[
 \boxed{
 \int_{\mathbb R}
 \{t f'(t)+(2N+1)f(t)\}|P_\pi(t)|^2dt=0,}         \tag{43}
\]

where

\[
 f=\Xi'^2-\Xi\Xi''.
\]

Since `varpi''` is also old,

\[
 \boxed{
 \int_{\mathbb R}f(t)P_\pi''(t)
 \overline{P_\pi(t)}dt=0.}                       \tag{44}
\]

These are genuine complete-theta constraints on the globally corrected
residual.  They are global frequency identities, however; neither localizes
the positive and negative parts of `J_pi''` modulo the scale lattice.  Turning
(43)--(44) into (35) would require a new nonlinear diagonal-versus-cross
estimate.

## 8. A rigorous obstruction to self-duality plus Galerkin alone

The obstruction can be exhibited inside the exact scale self-dual class.
Define

\[
 H(x)=\left(x^4-\frac{3}{2\pi}x^2\right)e^{-\pi x^2}. \tag{45}
\]

This is a positive multiple of the center orbit `sigma_x(0)`.  The Gaussian
Fourier identity gives

\[
 \int_0^\infty H(x)\cos(2\pi xy)dx=\frac12H(y),
 \qquad H(0)=H'(0)=\int_0^\infty H=0.             \tag{46}
\]

For every positive integer `n`,

\[
 H(n)>0,
\]

and hence the trapezoidal/Poisson identity gives

\[
 \mathcal T(H):=\int_0^\infty K_2(x)H''(x)dx
 =\sum_{n\geq1}H(n)>0.                            \tag{47}
\]

Now consider the two-coordinate matrix-valued scale source

\[
 \mathbf H(x)=
 \begin{pmatrix}H(x)&0\\0&-H(x)\end{pmatrix}.    \tag{48}
\]

Every entry obeys the same self-duality, endpoint behavior, and cancellation
moments as an assembled source.  The old one-dimensional block has positive
Gram `T(H)>0`; the new coordinate is exactly Galerkin-orthogonal to it.  Yet
its residual value is

\[
 \mathcal T(-H)<0.                                \tag{49}
\]

Thus cosine self-duality, the forced moments, positive old data, and exact
Galerkin orthogonality do not imply curvature payment.  Replacing `H` by
`-H` also reverses the scalar payment while preserving every homogeneous
self-dual identity.

The matrix (48) is not asserted to be the actual complete-theta scale Gram.
It proves a precise methodological no-go: any proof using only the structural
properties listed above is insufficient.  A successful argument must use
the specific assembled theta source (5)--(11), such as a new estimate on
`Lambda_pi`, the residual jet in (41), or the fractional placement dominance
(35).

## Resulting route status

The actual curvature has now been reduced without finite-degree escalation:

- (5)--(11) give its exact assembled complete-theta source;
- (19)--(21) identify the sole Galerkin curvature-null mode;
- (28)--(35) give all forced moments and the exact placement criterion;
- (38) rigorously retires the previous coarse core--edge condition;
- (41) shows that even the center-curvature sign needs a residual-jet bound;
- (45)--(49) prove that self-duality and Galerkin orthogonality alone cannot
  supply that bound.

The next viable lemma is therefore theta-specific: prove (35), or an
equivalent fractional-cell transport inequality, directly from the assembled
source `Lambda_pi` while retaining the mismatch term `V`.  Neither a global
moment argument nor a coarse two-region split can do so.

## Nonclaims

- The stochastic dominance (35) is sufficient but is not proved here.
- The null mode (19) has no asserted pointwise or regional sign.
- The countermodel (48) is structural, not a counterexample to the actual
  complete-theta residual.
- No blockwise inverse, finite-degree sweep, endpoint sign, or RH conclusion
  is used.
