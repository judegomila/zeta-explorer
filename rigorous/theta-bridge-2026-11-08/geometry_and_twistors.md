# From two cut spheres to the theta bridge

This note preserves the geometric part of the thread. Its constructions are
exact; the zero-trapping conclusion is not established.

## 1. A correct cut and cross-glue

On a single Riemann sphere, zero and infinity are distinct points. Neither a
coordinate identification nor a spinor removes the essential singularity of a
transcendental entire function at infinity. To build the proposed second sheet,
take two copies of the \(w\)-sphere, make two disjoint cuts joining the four
points \(\pm ir,\pm i/r\), and glue opposite banks between the two copies. The
result is the smooth genus-one double cover

\[
E_r:\quad \eta^2=(w^2+r^2)(w^2+r^{-2}),\qquad r>1.
\]

Riemann–Hurwitz gives \(2g-2=2(-2)+4=0\). Its differential
\(\omega=dw/\eta\) extends holomorphically and never vanishes.

Use the Cayley coordinate

\[
w=\frac{s-1}{s},\qquad s=\frac1{1-w},\qquad
X=\xi\!\left(\frac1{1-w}\right).
\]

The point \(s=0\) lies over \(w=\infty\), where \(X\) is regular. The end
\(s=\infty\) lies over \(w=1\), with two essential punctures

\[
p_\pm=(1,\pm(r+r^{-1})).
\]

Thus the function lives on the **punctured elliptic curve**
\(E_r\setminus\{p_+,p_-\}\). Compact-surface divisor theorems cannot be applied
to it as though it were meromorphic at these punctures.

## 2. Critical ovals and spinors

The critical reflection and functional-equation involution lift to

\[
R(w,\eta)=\left(1/\overline w,\overline\eta/\overline w^2\right),\qquad
I(w,\eta)=\left(1/w,\eta/w^2\right).
\]

The compact curve has two fixed ovals of \(R\) above \(|w|=1\), which is the
image of \(\Re s=1/2\). Each oval contains one of the essential punctures.
The four spin structures on a torus are square roots of its trivial canonical
bundle. Since \(I^*\omega=-\omega\), a compatible local square-root lift acts
by \(\pm i\). This provides a precise place to track spinor gluing signs; it
does not impose a positivity theorem or change the essential singularities.

## 3. What the vortex field actually does

On the complement of zeros and punctures, put

\[
U=\log|X|,\qquad j=\Im(dX/X)=*dU,\qquad
J=\Im(\overline X\,dX)=\tfrac12*d|X|^2.
\]

The metric-dual phase field moves along amplitude level sets:
\(j^\sharp(U)=0\). It circulates around a zero rather than attracting points
to it. A zero of multiplicity \(m\) has phase circulation \(2\pi m\); the
local vector-field index is \(+1\), which is a different quantity. Branch
points of the projection can introduce stagnations without being xi zeros.

In a flat local complex coordinate \(z\),

\[
dJ=2|X_z|^2\,dA.
\]

Integrating this identity requires the boundary terms around the punctures.
They cannot be discarded by compactifying the drawing. Phase flow crosses a
regular critical oval normally; amplitude descent is tangent there. Neither
fact rules out an additional zero away from the ovals.

For \(r=2\) the supplied calculation uses

\[
w=(i/r)\operatorname{sn}(z\mid r^{-4}),\qquad
\eta=\operatorname{cn}(z\mid r^{-4})\operatorname{dn}(z\mid r^{-4}).
\]

With \(K(k)\) denoting modulus notation, the common period lattice is generated
by \(4K(r^{-2})\) and \(2iK'(r^{-2})\). The program checks the curve identity
and displays the local phase/amplitude distinction near the first positive
critical zero. Its finite samples are illustrative.

## 4. The exact minitwistor connection

Define

\[
k=\frac{r-r^{-1}}{r+r^{-1}},\qquad k'=\frac2{r+r^{-1}},\qquad
c=\frac{K(k)}{r+r^{-1}},
\]

\[
\zeta=i\frac{w-1}{w+1},\qquad
\nu=\frac{2ic\eta}{(w+1)^2}.
\]

Direct substitution gives the standard charge-two monopole spectral-curve
normalization

\[
\nu^2+\frac{K(k)^2}{4}
\left[\zeta^4+2(k^2-k'^2)\zeta^2+1\right]=0.
\]

The ambient minitwistor space is \(\operatorname{Tot}\mathcal O(2)\simeq
T\mathbb{CP}^1\), the space of oriented lines in Euclidean three-space. Its
Euclidean reality map

\[
\tau(\zeta,\nu)=(-1/\overline\zeta,-\overline\nu/\overline\zeta^2)
\]

has no fixed points and differs from the critical-oval reflection
\((\zeta,\nu)\mapsto(\overline\zeta,-\overline\nu)\). Confusing these two
real structures would invalidate the claimed zero constraint.

Writing \(\Xi(t)=\xi(1/2+it)\), the scalar decorations obey

\[
X=\Xi\!\left(\frac1{2\zeta}\right),\qquad
\overline{X\circ\tau}=\Xi(\zeta/2).
\]

This is an exact pair of scalar functions with the stated reality relation.
It has not been reconstructed as a Ward field or a Nahm/Dirac zero mode.
In particular, a ratio of sections of a fixed finite-degree line bundle on a
compact elliptic curve is meromorphic with a finite divisor. The proposed xi
ratio has infinite divisors accumulating at its punctures and cannot be that
finite-dimensional section ratio. A common spin factor does not change it.

## 5. The useful link is through periods across the family

Let \(m=r^{-2}\) and choose the family parameter \(b\) by
\(e^b=K'(m)/(2K(m))\). Landen identities yield \(K'(k)/K(k)=e^{-b}\). For

\[
\theta(t)=\sum_{n\in\mathbb Z}e^{-\pi n^2t},\qquad
H(b)=e^{b/4}\theta(e^b),
\]

the exact theta/period identity is

\[
H(b)=\sqrt{\frac2\pi}\,[K(k(b))K'(k(b))]^{1/4}.
\]

Consequently

\[
\kappa=(\partial_b^2-1/16)H,\qquad
\xi(1/2+z)=\int_{\mathbb R}\kappa(b)e^{zb/2}\,db.
\]

This couples the entire torus family to the actual theta convolution problem.
The new boundary-energy identity is an analytic consequence for that kernel.
It remains meaningful without asserting a positive finite-dimensional Nahm
realization. The family parameter \(b\), the Mellin tilt \(\Re z\), and Nahm
time are distinct variables.

Primary references and their scope are listed in [SOURCES.md](SOURCES.md).
