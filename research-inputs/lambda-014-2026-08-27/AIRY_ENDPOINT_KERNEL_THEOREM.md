# Retained-divisor discrete endpoint Fresnel--Airy core

## Claim boundary

This note closes the **log-to-cubic replacement error on the declared finite
endpoint core** in the early P97 architecture.  It does not prove that this
nominal core exhausts a transformed endpoint transition, bound the correlated
kernel centers, or control the complementary bulk.  Therefore it does not
certify one complete selector block, the early mantle, or
\(\Lambda\le 0.14\).

The scope is the early swept range

\[
 690988\le N\le14999999
\]

on the bottom and both vertical faces, with both one-sided charts at every
selector seam.  The parameter inequalities used below are replayed from the
complete swept-envelope certificate.

## Exact branch endpoint packet

Let \(d\mid P_{97}\), \(d\le10^6\), \(d>1\), and put

\[
 M=\left\lfloor\frac Nd\right\rfloor,
 \qquad H=\lceil N^{1/3}\rceil,
 \qquad H_d=\left\lceil\frac Hd\right\rceil.
\]

The use of \(H_d\) is a harmless integer over-cover of
\(\lceil N^{1/3}/d\rceil\).  Empty or nonpositive sites are omitted.  For
\(\epsilon\in\{-1,1\}\), write the endpoint as \(m=M-h\),
\(0\le h<H_d\).  Taylor's theorem gives

\[
 \epsilon v\log(d(M-h))
 =c-\epsilon\frac vM h-\epsilon\frac v{2M^2}h^2
   -\epsilon\frac v{3M^3}h^3+R_{d,h},                 \tag{1}
\]

\[
 |R_{d,h}|\le \frac{v h^4}{4(M-h)^4}.                  \tag{2}
\]

Choose \(q\in\mathbb Z\) nearest to \(v/M^2\).  Adding the
integer-valued phase \(\epsilon q\binom h2+\ell h\), with \(\ell\) chosen
by the same nearest-integer convention, reduces (1) to

\[
 \alpha h+\beta h^2+\chi h^3+R_{d,h},
 \qquad |\alpha|\le\frac12,quad |\beta|\le\frac14,
 \quad \chi=-\epsilon\frac v{3M^3}.                    \tag{3}
\]

For directed complex endpoint weights \(w_h\), define the finite discrete
Fresnel--Airy core

\[
 \boxed{\mathcal A_{d,N}^{\epsilon}(\alpha,\beta,\chi)
 =\sum_{0\le h<H_d}w_h e(\alpha h+\beta h^2+\chi h^3).} \tag{4}
\]

Core (4) retains every site in its declared finite index set.  It is not a
continuous stationary-phase asymptotic.  Consequently the
**stationary-approximation remainder inside this finite core is exactly
zero**.  The only analytic replacement made on those sites is the
logarithmic quartic remainder (2).

This is useful at \(v/M\in\mathbb Z\), where a first-derivative estimate is
singular but (4) is unchanged.  It does not bound any transformed tail lying
outside the declared \(0\le h<H_d\) core.

## Uniform quartic radius

Let

\[
 Q=\frac{x}{4\pi}+\frac t{16},\qquad N=\lfloor\sqrt Q\rfloor.
\]

From

\[
 s_B=s_d+\frac t2\alpha(s_d),\qquad
 v=-\frac{\Im s_B}{2\pi},
\]

the elementary bounds \(|\Im\alpha(s_d)|<4\), \(t\le33/250\), and
\(\pi>3\) give

\[
 |v-Q|<\frac{33}{250}\left(\frac13+\frac1{16}\right)
 =\frac{209}{4000}<1.                                   \tag{5}
\]

Thus \(v<(N+1)^2+1\).  If \(H_d>1\), then \(d<H\),

\[
 H_d-1<\frac Hd,
 \qquad M-H_d+1>\frac{N-2H}{d}.
\]

Equations (2) and (5) imply

\[
 |R_{d,h}|<
 \frac{((N+1)^2+1)H^4}{4(N-2H)^4}.                     \tag{6}
\]

For fixed \(H=\lceil N^{1/3}\rceil\), the right side decreases with
\(N\).  Exact enumeration of the 159 possible values \(89\le H\le247\)
finds its maximum at \((N,H)=(704970,90)\):

\[
 \frac{248492055421}{7521403563685442}<\frac1{30000}.   \tag{7}
\]

For \(H_d=1\), the only site is \(h=0\), and the phase remainder is zero.

For completeness, the first of the bounds used in (5) is replayed rather
than assumed.  Indeed

\[
 \alpha(s)=\frac1{2s}+\frac1{s-1}+\frac12\Log\frac{s}{2\pi},
 \qquad s_d=\frac{1+y-ix}{2}.
\]

The swept-envelope certificate gives \(y>0\), while
\(x\ge X_a=6000000185827\).  Hence \(\Re s_d>0\),
\(|\Im s_d|=x/2\), and the principal logarithm obeys
\(|\arg s_d|<\pi/2\).  Therefore

\[
 |\Im\alpha(s_d)|
 <\frac1x+\frac2x+\frac\pi4
 <\frac3{6000000185827}+1<4,
\]

where only \(\pi<4\) is used in the final rational gate.

## Exact site count and amplitude charge

There are 15,849 nontrivial retained divisors.  Exact squarefree
enumeration gives

\[
 \sum_{\substack{d\mid P_{97}\\1<d\le10^6}}
 \left\lceil\frac{247}{d}\right\rceil=16586.           \tag{8}
\]

Only 117 branches are multi-site anywhere in the early range; (8) is just
15,849 singleton sites plus 737 extra Airy sites.  At the hard block
\(H=89\), the count is 16,072, with only 54 multi-site branches and 223
extra sites.

The shifted heat identity is exact:

\[
 d^{-s}b_d b_m m^{-(s-(t/2)\log d)}=b_{dm}(dm)^{-s}.    \tag{9}
\]

Hence every branch endpoint site is an ordinary physical ladder
coefficient at \(n=d(M-h)\).  Every active singleton has \(n>N/2\); a
multi-site branch has \(d<H\) and \(n>N-2H>N/2\).  Therefore
\(\log n>51/4\), while \(\log n<17\).

The swept-envelope replay supplies, on the lower face,

\[
 \frac t4\le\frac{33}{1000},\quad
 \Re s_B>\frac{71}{50},\quad
 \Re s_A^{(0)}>\frac{31}{25},\quad |\gamma|<\frac3{16}. \tag{10}
\]

It also proves that the primary amplitude and the gamma-weighted reflected
amplitude do not increase on either vertical face.  Both logarithmic
profiles in (10) decrease for \(51/4\le\log n\le17\).  Directed 160- and
192-bit evaluation at \(51/4\) proves

\[
 16586\left\{
 e^{(33/1000)(51/4)^2-(71/50)(51/4)}
 +\frac3{16}e^{(33/1000)(51/4)^2-(31/25)(51/4)}
 \right\}<\frac7{50}.                                   \tag{11}
\]

Let \(\mathcal C_{\rm exact}\) be the sum, over the finite retained
\((d,h,\epsilon)\) core just defined, of the physical shifted-fibre weights
with their exact logarithmic phases.  Let \(\mathcal C_{\rm cubic}\) be the
sum over the identical finite index set and identical weights, replacing
only those phases by (3).  The scalar
\(-\widetilde b_dD_N\) part of \(J_d\), the essential cross-chart term, and
every site outside this finite core occur in neither symbol.

Then \(|e(u+r)-e(u)|\le2\pi|r|\), \(\pi<355/113\),
(7), and (11) give the common core-cubicization radius

\[
 \boxed{
 \left|\mathcal C_{\rm exact}-\mathcal C_{\rm cubic}\right|
 <2\frac{355}{113}\frac1{30000}\frac7{50}
 =\frac{497}{16950000}<\frac3{100000}.}                 \tag{12}
\]

The modulus in (12) is taken only after all retained core branches and both
ladder signs have been recombined.  Thus (12) is a valid common radius for
the declared finite core, not a claim that the kernel centers may be bounded
independently.  It is pointwise uniform for every early selector, every
point of the bottom and both vertical faces, and each one-sided seam chart;
it is **not** a radius for the entire transformed endpoint neighborhood or
for the whole selector block.

## Why the nominal width is not a proved endpoint truncation

The count (8) is an architecture ceiling, not a tail theorem.  At a primary
endpoint transition, the canonical linear term can vanish.  The allowed
canonical parameter box also contains \(\alpha=\beta=0\), for which the
cubic derivative at the nominal boundary is only of size

\[
 3|\chi|H^2\asymp\frac{H^2}{N}\asymp N^{-1/3}.
\]

At the hard block this scale is about \(89^2/690988<1/80\).  Hence a
uniform first-derivative tail estimate does not even begin at \(h=H\).
More basically, for arbitrary omitted complex weights a phase-only error
smaller than their \(\ell^1\) mass is impossible: the omitted weights can be
chosen to align after multiplication by the phases.  An amplitude-specific
correlated tail or a larger exact packet is therefore mandatory.  This is
the precise obstruction preventing (12) from being promoted to a complete
endpoint certificate.

## What remains

For the hard selector, equations (3)--(12) provide a finite 16,072-site
**core** producer, of which only 54 branch packets contain more than one
site.  The same cubicization-radius theorem applies separately to both
one-sided seam charts.  No seam-center, half-jump, or ray enclosure is
produced here.

Operationally, all of the following remain open:

1. directed value enclosures for the correlated centers
   \(\mathcal C_{\rm cubic}\), recombined before a modulus;
2. an amplitude-specific tail outside \(H_d\), all nonstationary Poisson
   frequencies, and the stationary remainders belonging to the transformed
   bulk;
3. the scalar \(-\widetilde b_dD_N\) and essential cross-chart pieces of
   every retained branch; and
4. a positive ray margin on the bottom, vertical faces, and seam centers.

This package proves no positive ray margin.  Its fail-closed status is

```text
P97_RETAINED_ENDPOINT_CORE_CUBICIZATION_CERTIFIED true
FINITE_DECLARED_CORE_STATIONARY_APPROXIMATION_REMAINDER_ZERO true
ONE_COMPLETE_SELECTOR_ENDPOINT_CORE_READY true
TRANSFORMED_ENDPOINT_TAIL_CERTIFIED false
COMPLETE_SELECTOR_ENDPOINT_CERTIFIED false
EARLY_P97_BULK_CERTIFIED false
EARLY_P97_MANTLE_CERTIFIED false
LAMBDA_LE_0_14 false
```
