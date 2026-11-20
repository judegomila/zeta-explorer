# The first Laguerre expression along de Bruijn--Newman flow

## Scope

This note tests a natural transport idea: start in de Bruijn's large-time
regime, where the deformed Xi function has only real zeros and hence satisfies
the first Laguerre inequality, and use a maximum principle to carry that sign
back to time zero.

The divided logarithmic curvature does satisfy a favorable parabolic equation
in the required time direction on every fixed zero-free cylinder.  The route
nevertheless does not cross a zero collision.  At a generic double collision
the undivided Turan density has an exact negative source, and immediately
after the collision the divided curvature has a negative pocket of size
`-1/s`.  Excluding every topology-changing collision all the way to time zero
is a sufficient route to the de Bruijn--Newman all-real-zero assertion, hence
RH in the Riemann case, not a weaker proof of the first Laguerre sign.

No global first-Laguerre inequality, collision exclusion, endpoint moment
sign, or RH conclusion is proved.

Primary convention: Brad Rodgers and Terence Tao, *The de Bruijn--Newman
constant is non-negative*, arXiv:1801.05914:
<https://arxiv.org/abs/1801.05914>.

## Time convention and normalization

Use the standard de Bruijn--Newman family

\[
 H_\tau(x)=\int_0^\infty e^{\tau u^2}\Phi(u)\cos(xu)\,du.       \tag{1}
\]

In the Rodgers--Tao normalization,

\[
 H_0(x)={1\over8}\xi\!\left({1\over2}+{ix\over2}\right)
       ={1\over8}\Xi(x/2).                                    \tag{2}
\]

Consequently, if

\[
 \mathcal T_\tau=H_{\tau,x}^2-H_\tau H_{\tau,xx},              \tag{3}
\]

then the workstream's first Xi Laguerre density is

\[
 \boxed{
 \Xi'(\nu)^2-\Xi(\nu)\Xi''(\nu)
 =256\,\mathcal T_0(2\nu).}                                   \tag{4}
\]

Differentiating (1) fixes the time orientation:

\[
 \boxed{\partial_\tau H_\tau=-\partial_x^2H_\tau.}             \tag{5}
\]

Thus increasing `tau` is backward heat in the spatial variable.  It moves
toward the real-zero regime: all zeros of `H_tau` are real exactly for
`tau>=Lambda`, and de Bruijn's theorem supplies this at least for
`tau>=1/2`.  Transport from that regime to `tau=0` decreases `tau`.

Fix a starting time `T` and put

\[
 s=T-\tau,
 \qquad \widetilde H_s=H_{T-s}.                                \tag{6}
\]

Then the desired transport direction is ordinary forward heat:

\[
 \partial_s\widetilde H_s=\partial_x^2\widetilde H_s.           \tag{7}
\]

## Exact divided-curvature equation

On a component where `H_tau` is nonzero, define

\[
 p=\partial_x\log|H_\tau|={H_{\tau,x}\over H_\tau},
 \qquad
 q=-\partial_x^2\log|H_\tau|
   ={\mathcal T_\tau\over H_\tau^2}.                           \tag{8}
\]

Since

\[
 \partial_\tau\log|H_\tau|
 =-{H_{\tau,xx}\over H_\tau}
 =q-p^2,                                                        \tag{9}
\]

direct differentiation gives the exact coupled equations

\[
 \boxed{
 \partial_\tau p=q_x+2pq,}                                    \tag{10}
\]

\[
 \boxed{
 \partial_\tau q=-q_{xx}-2p q_x+2q^2.}                         \tag{11}
\]

In the required reverse-time coordinate (6), the curvature equation is

\[
 \boxed{
 \partial_s q=q_{xx}+2p q_x-2q^2,}                             \tag{12}
\]

with `p` and `q` evaluated for `widetilde H_s`.

Equation (12) has the right formal sign for a local comparison principle.
On a compact zero-free cylinder with smooth drift `2p`, the zero function is
a solution.  At a first interior contact from above one has

\[
 q=0,
 \qquad q_x=0,
 \qquad q_{xx}\geq0,
\]

so (12) gives `q_s>=0`.  Therefore nonnegativity is transported on a fixed
component as long as its zero boundaries remain simple and do not collide.
Near a simple real zero `a(s)`, one has

\[
 q(s,x)={1\over(x-a(s))^2}+O(1),                                \tag{13}
\]

so the moving boundary is positive and singular.  Truncating away from the
zero curves gives the ordinary parabolic comparison argument on every
collision-free slab.

This local fact is not the desired global theorem: the component topology is
precisely what can change as `tau` decreases.

## Exact undivided equation

The divided equation is unavailable at zeros, so retain the smooth entire
quantity (3).  A direct calculation from (5) gives

\[
\begin{aligned}
 \partial_\tau\mathcal T_\tau
 &=-2H_xH_{xxx}+H_{xx}^2+H H_{xxxx},\\
 \partial_x^2\mathcal T_\tau
 &=H_{xx}^2-HH_{xxxx}.
\end{aligned}                                                   \tag{14}
\]

Hence

\[
 \boxed{
 \partial_\tau\mathcal T_\tau
 =-\partial_x^2\mathcal T_\tau
  +2\{H_{xx}^2-H_xH_{xxx}\}.}                                 \tag{15}
\]

The braces are the first Laguerre expression of the derivative `H_x`.  In
the forward coordinate `s=T-tau`,

\[
 \boxed{
 \partial_s\mathcal T
 =\partial_x^2\mathcal T
  -2\{H_{xx}^2-H_xH_{xxx}\}.}                                 \tag{16}
\]

Unlike (12), equation (16) is not a positivity-preserving scalar heat
equation.  Even in the all-real-zero regime the forcing in braces is
nonnegative, so it enters (16) with the unfavorable sign.  At an ordinary
interior zero of `mathcal T`, it need not vanish.

## The collision source

Suppose a generic collision occurs at `(tau_0,a)`:

\[
 H_{\tau_0}(a)=H_{\tau_0,x}(a)=0,
 \qquad H_{\tau_0,xx}(a)=2A\ne0.                               \tag{17}
\]

Put `y=x-a` and `delta=tau-tau_0`.  Equation (5) and Taylor expansion give
the universal local normal form

\[
 H_\tau(x)
 =A\{y^2-2\delta\}
  +O(|y|^3+|\delta y|+\delta^2).                               \tag{18}
\]

For `delta>0` the two zeros are real to leading order,
\(y=\pm\sqrt{2\delta}\).  For `delta<0` they have left the real line as a
conjugate pair.

Above the collision, the leading divided curvature is

\[
 q(\tau,x)
 ={2(y^2+2\delta)\over(y^2-2\delta)^2}.                         \tag{19}
\]

Below it, write `s=tau_0-tau>0`.  Uniformly for
`|y|<=C sqrt(s)`, with fixed `C`,

\[
 \boxed{
 q(\tau,x)
 ={2(y^2-2s)\over(y^2+2s)^2}+O(s^{-1/2}).}                     \tag{20}
\]

In particular,

\[
 q(\tau,a)=-{1\over s}+O(s^{-1/2})<0                           \tag{21}
\]

for sufficiently small `s>0`.  The collision creates a negative interval
of spatial width comparable with `sqrt(s)`.

The undivided calculation is even more direct.  At the collision point,

\[
 \mathcal T=\mathcal T_x=0,
 \qquad
 \mathcal T_{xx}=H_{xx}^2,
 \qquad
 H_{xx}^2-H_xH_{xxx}=H_{xx}^2.                                \tag{22}
\]

Therefore (16) gives the exact one-sided source

\[
 \boxed{
 \partial_s\mathcal T(0,a)=-H_{xx}(\tau_0,a)^2<0.}             \tag{23}
\]

The minimal polynomial model

\[
 H_\tau(x)=x^2-2(\tau-\tau_0)                                 \tag{24}
\]

solves (5) exactly.  It has real zeros above `tau_0`, but below the collision

\[
 \mathcal T=2x^2-4(\tau_0-\tau),                              \tag{25}
\]

so neither the PDE nor the real-zero initial sign can prevent the new
negative pocket.

The same topology term is visible directly in a local canonical factor.  If
a pair is `a+-ib`, write near its real center

\[
 H(x)=\{(x-a)^2+b^2\}G(x),
 \qquad G(a)\ne0.
\]

Then

\[
 q(a)=-{2\over b^2}-\{\log|G|\}''(a).                          \tag{26}
\]

At a double collision `b^2=2s+o(s)`, so the singular term in (26) is
`-1/s+o(1/s)` and dominates every separated-zero background.  This is the
heat-flow version of the reciprocal-square compensation obstruction.

## Zero dynamics and why the direction matters

For a simple real zero `x_k(tau)`, differentiating
`H_tau(x_k(tau))=0` and using (5) gives

\[
 x_k'(\tau)={H_{xx}\over H_x}(\tau,x_k).                         \tag{27}
\]

In the canonical product this is the principal-value dynamics

\[
 \boxed{
 x_k'(\tau)=2\operatorname {p.v.}
 \sum_{j\ne k}{1\over x_k-x_j}.}                              \tag{28}
\]

Thus increasing `tau` is repulsive and separates real zeros.  The desired
transport to zero decreases `tau`; it reverses (28), makes neighboring zeros
attractive, and runs toward collisions.  For an isolated colliding pair
`a+-r(tau)`, the mutual term gives

\[
 r'(\tau)={1\over r}+O(1),
 \qquad
 r(\tau)^2=2(\tau-\tau_0)+o(\tau-\tau_0),                       \tag{29}
\]

in agreement with (18).

## Route verdict

The maximum-principle idea has an exact but limited statement:

1. `q>=0` propagates in the decreasing-`tau` direction on every
   collision-free zero component.
2. The comparison theorem stops when zero components merge.  The divided
   drift becomes singular, while the undivided equation has the strictly
   negative collision source (23).
3. A generic double collision immediately violates the desired sign by
   (20)--(21).  The theta kernel does not add a local corrective term to
   either exact PDE.

Avoiding every collision between a de Bruijn time `T>=1/2` and time zero
keeps every zero real at time zero.  It therefore suffices to prove
`Lambda<=0`, which is RH for the Riemann family.  This collision-free
continuation through the closed endpoint can be stronger than the bare
all-real assertion, because a multiple real zero at `tau=0` is compatible
with `Lambda<=0`.  Rodgers--Tao prove the opposite unconditional bound
`Lambda>=0`; thus a collision-exclusion barrier reaching zero would establish
`Lambda=0`, not merely the first Laguerre inequality.

This makes the straightforward heat-transport route strictly stronger than
the present target.  A more refined theta argument could in principle analyze
special higher-multiplicity collisions or prove that a negative pocket later
recovers before time zero.  Equations (12) and (16) provide no such barrier:
after a sign is lost, their nonlinear/forced terms do not give monotonic
recovery.  Any successful argument of that kind would require new nonlocal
theta arithmetic, not the parabolic maximum principle alone.

## Nonclaims

- The local collision model is not evidence that the actual Riemann flow has
  a collision at positive time.
- A nonreal zero at some intermediate time is not proved here to force a
  negative first Laguerre density at time zero; the negative pocket need not
  be permanent under further evolution.
- Special higher-multiplicity collisions require their own heat-polynomial
  analysis.  The generic double collision suffices to invalidate an
  unqualified maximum-principle crossing argument, not to classify every
  possible topology change.
- First Laguerre positivity at time zero is not asserted to imply RH.
- No numerical zero height, de Bruijn--Newman bound, endpoint sign, or RH
  theorem is extended.
