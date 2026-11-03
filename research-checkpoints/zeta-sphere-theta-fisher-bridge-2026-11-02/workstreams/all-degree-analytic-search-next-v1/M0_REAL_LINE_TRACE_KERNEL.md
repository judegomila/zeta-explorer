# Real-line kernel for the correlated residue trace

## Scope

This note puts both entries of the frozen-residue functional on one real
frequency line and identifies the residue drift as a shifted first-orbit
trace.  It gives an exact finite-prefix Christoffel-kernel target.  It does
not prove the target inequality, does not assume positivity beyond a
stipulated old prefix, and has no RH conclusion.

Use the nonunitary Fourier convention

\[
 \widehat f(\nu)=\int_{\mathbb R}f(t)e^{-i\nu t}\,dt,
 \qquad
 f(t)={1\over2\pi}\int_{\mathbb R}\widehat f(\nu)e^{i\nu t}\,d\nu,
 \tag{1}
\]

and write `P(nu)=p(i nu)`.  Put

\[
 f_{\rm L}(\nu)=\Xi'(\nu)^2-\Xi(\nu)\Xi''(\nu),
 \qquad
 g(h)={\bf1}_{(0,\infty)}(h)\,h\chi(h).                 \tag{2}
\]

On a positive old target prefix the metric and the retained-residue
functional are

\[
 A(p,q)={1\over\pi}\int_{\mathbb R}f_{\rm L}(\nu)
 P(\nu)\overline{Q(\nu)}\,d\nu,
 \qquad
 v(p)={1\over2\pi}\int_{\mathbb R}
 P(\nu)\,2\Xi(\nu)\overline{\widehat g(\nu)}\,d\nu.
 \tag{3}
\]

Equation (3) is a finite polynomial identity; no global positive measure is
assumed.

## Fourier representation of the drift

The exact residue exponential generating function is

\[
 E(t)=3(1-e^{2t})
 \exp\!\left({5t\over2}-{3\over2}(e^{2t}-1)\right),
 \qquad e_j=E^{(j)}(0).                                \tag{4}
\]

The drift coefficients `d_j=j e_(j-1)` therefore have EGF `tE(t)`.  The
function `E`, and also `tE`, is Schwartz on the real line: it decays
exponentially at negative infinity and superexponentially at positive
infinity, with the same property after every derivative.  Fourier inversion
and differentiation at zero are consequently legitimate for every
polynomial.  They give the exact real-frequency formula

\[
 \boxed{
 d(p)=e(p')={1\over2\pi}\int_{\mathbb R}
 P(\nu)\,\widehat{tE}(\nu)\,d\nu,
 \qquad
 \widehat{tE}(\nu)=i\,\partial_\nu\widehat E(\nu).}
 \tag{5}
\]

Thus the off-axis atomic formula for `d` is not the only representation.
Equation (5) represents the same finite polynomial functional by an
undivided density on the real frequency line.

The transform is explicit.  With

\[
 s={5\over4}-{i\nu\over2},
\]

the substitution `x=(3/2)e^(2t)` gives

\[
 \boxed{
 \widehat E(\nu)
 ={e^{3/2}\over4}
 \left({2\over3}\right)^{5/4-i\nu/2}
 (1+2i\nu)\Gamma\!\left({5\over4}-{i\nu\over2}\right).}
 \tag{6}
\]

Equivalently,

\[
 \widehat E(\nu)
 ={e^{3/2}\over16}
 \left({2\over3}\right)^{5/4-i\nu/2}
 (1+4\nu^2)\Gamma\!\left({1\over4}-{i\nu\over2}\right),
 \tag{7}
\]

and, with `psi_0` denoting the digamma function,

\[
 \widehat{tE}(\nu)=\widehat E(\nu)
 \left\{
 {1\over2}\log{2\over3}
 +{1\over2}\psi_0\!\left({5\over4}-{i\nu\over2}\right)
 -{2\over1+2i\nu}
 \right\}.                                             \tag{8}
\]

All powers in (6)--(8) use the real logarithm of the positive base.  These
formulas contain no division by `Xi`, `zeta`, or `f_L`.

## The drift is a shifted first-orbit trace

Let

\[
 \delta={1\over2}\log{2\pi\over3},
 \qquad
 \kappa_0={e^{3/2+\delta/2}\over6},                    \tag{9}
\]

and let the first actual theta orbit of the completed profile be

\[
 \psi_1(h)=4z(2z-3)e^{h/2-z},
 \qquad z=\pi e^{2h}.                                  \tag{10}
\]

Direct substitution, using `pi e^(-2 delta)=3/2`, gives

\[
 \boxed{E(t)=-\kappa_0\psi_1(t-\delta).}               \tag{11}
\]

Since `e(p)=[p(D)E](0)`, equation (11) yields the exact physical trace

\[
 \boxed{
 e(p)=-\kappa_0[p(D)\psi_1](-\delta),
 \qquad
 d(p)=-\kappa_0[p'(D)\psi_1](-\delta).}                \tag{12}
\]

The special point `h=-delta` is precisely where the first-orbit variable is
`z=3/2`, the location exposed by the graded residue recurrence.  Therefore
the two channels in the missing inequality are an actual half-line
full-theta correlation and a derivative trace of one shifted actual theta
orbit; the latter is not an unrelated formal sequence.

## One correlated real-line numerator

For `tau>0` define, as in `M0_CROSS_COMPENSATION.md`,

\[
 \mathcal L_\tau(p)
 ={\sqrt\tau\,v(p)-\tau^{-1/2}d(p)\over\sqrt2}.         \tag{13}
\]

Equations (3) and (5) give

\[
 \boxed{
 \mathcal L_\tau(p)
 ={1\over2\pi\sqrt2}\int_{\mathbb R}P(\nu)B_\tau(\nu)\,d\nu,}
 \tag{14}
\]

where the single combined numerator is

\[
 \boxed{
 B_\tau(\nu)=
 2\sqrt\tau\,\Xi(\nu)\overline{\widehat g(\nu)}
 -\tau^{-1/2}i\,\partial_\nu\widehat E(\nu).}          \tag{15}
\]

The zero extension `g` is in `L1 cap L2`: it vanishes at the origin and
decays superexponentially at positive infinity.  Its first derivative has a
jump after zero extension, so `widehat g(nu)=O(|nu|^(-2))`; no unsupported
full-line smoothness is used.  The gamma formulas show exponential decay of
the second term in (15).  Hence (14) converges absolutely after multiplication
by any fixed polynomial.

For parity `epsilon in {0,1}`, `P(-nu)=(-1)^epsilon P(nu)`.  Only

\[
 B_\tau^{(\epsilon)}(\nu)
 ={B_\tau(\nu)+(-1)^\epsilon B_\tau(-\nu)\over2}       \tag{16}
\]

contributes to (14).  Keeping this projection is necessary when passing to a
fixed parity completion.

## Exact finite Christoffel-kernel energy

Fix one parity prefix `P_N^(epsilon)` and suppose its actual target matrix
`A_N` is positive definite.  For a coefficient basis column `b_N(z)`, define
the finite target Christoffel kernel

\[
 K_N(z,w)=b_N(z)^T A_N^{-1}\overline{b_N(w)}.           \tag{17}
\]

Applying the Riesz formula to (14) gives the exact, noncircular identity

\[
 \boxed{
 \|\mathcal L_\tau\|_{A_N^*}^2
 ={1\over8\pi^2}\int_{\mathbb R}\!\int_{\mathbb R}
 K_N(i\nu,i\mu)B_\tau^{(\epsilon)}(\nu)
 \overline{B_\tau^{(\epsilon)}(\mu)}\,d\nu\,d\mu.}
 \tag{18}
\]

This formula uses only the stipulated positive finite matrix `A_N`.  It
does not divide by the signed continuous density and does not assert an
infinite-dimensional target operator.

If a larger positive prefix is available and `phi_(N+1)` is its new target-
orthonormal polynomial, then

\[
 K_{N+1}(z,w)-K_N(z,w)
 =\phi_{N+1}(z)\overline{\phi_{N+1}(w)},               \tag{19}
\]

so, for fixed `tau`, the increment of (18) is exactly
`|L_tau(phi_(N+1))|^2`.  Equivalently, the dual Gram of `(v,d)` is
Loewner-increasing with the prefix.  It follows directly that

\[
 m_N:=\inf_{\tau>0}\|\mathcal L_\tau\|_{A_N^*}^2
 =\sqrt{V_ND_N}-C_N                                    \tag{20}
\]

is nondecreasing on any nested sequence of positive target prefixes.  The
optimized unit margin can only worsen with degree.

## Conditional divided formula and why it is not a proof

If one first assumes the full sign `f_L>=0`, the fixed-parity polynomial
density, and the required range integrability, then the limiting Riesz
formula would become

\[
 \|\mathcal L_\tau\|_{A^*}^2
 ={1\over8\pi}\int_{\mathbb R}
 {|B_\tau^{(\epsilon)}(\nu)|^2\over f_{\rm L}(\nu)}\,d\nu.
 \tag{21}
\]

Equation (21) is a useful diagnostic, but it cannot be used to prove the
endpoint sign: it presupposes the positive target completion and divides by
the density whose sign and zero behavior are the endpoint problem.  The
finite double-kernel formula (18) is the domain-safe theorem target.

There is a related de Branges identity, with the same limitation.  For the
shifted bridge `E_a(z)=Xi(z+ia)` and its standard kernel `K_a`, expansion at
`a=0` gives

\[
 \lim_{a\downarrow0}{K_a(w,z)\over a}
 =K_1(w,z)
 ={\overline{\Xi'(w)}\Xi(z)-\overline{\Xi(w)}\Xi'(z)
   \over\pi(z-\overline w)},                           \tag{22}
\]

with removable continuation on the diagonal, and

\[
 K_1(x,x)={f_{\rm L}(x)\over\pi}.                     \tag{23}
\]

This is the de Branges kernel associated formally with
`mathcal E(z)=Xi(z)+iXi'(z)`.  Treating it as a positive reproducing kernel,
or invoking a positive canonical system for it, already inserts
Hermite--Biehler/endpoint-level information.  Moreover the target moment
norm is

\[
 A(p,p)=\int_{\mathbb R}K_1(x,x)|P(x)|^2\,dx,          \tag{24}
\]

not the native de Branges norm.  Abstract de Branges reproduction therefore
does not prove (18) or its unit bound.

## Finite kernel target and its asymptotic failure

At a fixed positive old prefix, the exact noncircular gate is

\[
 \boxed{\text{for a given positive old prefix, find }\tau>0
 \text{ such that}\quad
 {1\over8\pi^2}\iint K_N(i\nu,i\mu)
 B_\tau^{(\epsilon)}(\nu)
 \overline{B_\tau^{(\epsilon)}(\mu)}\,d\nu d\mu\leq1.}
 \tag{25}
\]

Equations (11)--(18) show exactly which complete-theta correlation a proof
would have to exploit.  However, `M0_FIXED_TAU_NO_GO.md` proves that (25)
cannot hold on every prefix on the endpoint-positive branch of either parity
ladder.  Briefly, Stirling asymptotics make each parity component of the drift
numerator in (15) too large in the target dual density, while the half-line
term is lower order and cannot cancel it for any fixed finite `tau`.  Nested
compact feasible-`tau` intervals then rule out escape by a prefix-dependent
optimizer. On the complementary endpoint-negative branch, the target itself
has unbounded prefix negative inertia.

Thus (18) remains the correct finite diagnostic and exact kernel identity,
but universal frozen-residue positivity is a refuted route.  This asymptotic
failure does not assert a negative actual-target prefix, does not decide the
sign of `f_L`, and has no RH conclusion.
