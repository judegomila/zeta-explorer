# Direct Gaussian output: contour corrections, exact domains, and a sharp weight threshold

## Status and new conclusions

This note works with the actual output of the unitary boundary multiplier.
It does not invert convolution by the theta kernel and does not construct
signed or positive inverse preimages. It uses the unconditional coprime
Blaschke quotient established in `theta_pulse_hardy_defect_20261108.md`.

The new conclusions are:

1. Gaussian damping permits an exact contour shift for the actual xi
   multiplier, with a rigorously convergent **grouped residue correction**.
   Absolute convergence of individual residues is not asserted.
2. The solution obtained on an outer vertical line has all positive weighted
   norms with exponent at least one half, unconditionally. It solves the same
   theta convolution equation as the actual output, but is an ordinary L2
   function if and only if RH holds. If genuine right-half-plane poles exist,
   its failure is necessarily at the left spatial end.
3. For every Gaussian width, the supremum of the admissible positive
   exponential weights of the actual output is exactly the infimum of the
   real parts of the genuine right-half-plane poles. This threshold is
   unchanged by any finite amount of Gaussian heat smoothing. No assertion
   is made about convergence at the threshold itself.

These statements identify the exact correction and domain obligation in a
direct contour/energy approach. They do not prove that the correction vanishes.

## 1. Conventions and the already established factorization

Let

\[
F(z)=\xi(1/2+z)=\int_{\mathbb R}\kappa(u)e^{zu/2}\,du,
\qquad \alpha>0,
\]

\[
D=F+\alpha F',\qquad N=F-\alpha F',\qquad S=N/D.
\]

All common factors in the quotient are canceled. In particular, common
boundary zeros are removable in \(S\). Put

\[
h_\pm(u)=(1\pm\alpha u/2)\kappa(u),\qquad A=h_+*,
\qquad A^*=h_-*.
\]

The Fourier convention and inverse convention are

\[
\widehat f(t)=\int f(u)e^{itu/2}\,du,
\qquad f(u)=\frac1{4\pi}\int\widehat f(t)e^{-itu/2}\,dt.
\]

The actual multiplier \(C_0\), with symbol \(S(it)\), is unitary on ordinary
\(L^2\), and \(AC_0=A^*\). The preceding Hardy note proves unconditionally

\[
S(z)=\frac{B_+(z)}{B_-(z)},
\tag{1.1}
\]

where the two Blaschke products are coprime. The zeros of \(B_-\), including
multiplicity, are exactly the genuine poles of \(S\) in \(\Re z>0\).
Write such a pole as \(p=\rho+i\tau\). They satisfy

\[
0<\rho<1/2,\qquad n(T)=O(T\log(T+2)),\qquad
\sum_p\frac{\rho}{1+|p|^2}<\infty.
\tag{1.2}
\]

These are statements about the reduced quotient, not about all zeros of
the uncanceled denominator. This distinction will matter in the growth bounds.

For \(\sigma>0\), use the norm-one Gaussian and its entire transform

\[
p_\sigma(u)=c_\sigma e^{-u^2/(2\sigma^2)},\qquad
c_\sigma=(\pi\sigma^2)^{-1/4},
\]

\[
V_\sigma(z)=c_\sigma\sqrt{2\pi}\,\sigma e^{\sigma^2z^2/8}.
\tag{1.3}
\]

The actual output is \(g_\sigma=C_0p_\sigma\). Its Fourier integrand is
absolutely integrable because \(|S(it)|=1\) and \(V_\sigma(it)\) is a
Gaussian. Thus its inverse Fourier integral gives a continuous pointwise
representative, as well as the actual ordinary-L2 output.

## 2. The outer-line contraction is unconditional

For clarity, its proof uses only the established open critical strip for xi
zeros, not RH. Write the even Hadamard product using one representative
\(\lambda\) of each pair \(\{\lambda,-\lambda\}\) of zeros of \(F\):

\[
F(z)=F(0)\prod_{\{\lambda,-\lambda\}}
       (1-z^2/\lambda^2).
\]

Every zero satisfies \(|\Re\lambda|<1/2\), and the paired product gives
the locally absolutely convergent logarithmic derivative

\[
\frac{F'}F(z)=
\sum_{\{\lambda,-\lambda\}}
\left(\frac1{z-\lambda}+\frac1{z+\lambda}\right).
\tag{2.1}
\]

For \(\Re z\ge1/2\), each summand has strictly positive real part.
Therefore \(\Re(F'/F)>0\), \(D\ne0\), and

\[
|S(z)|=
\left|\frac{1-\alpha F'(z)/F(z)}{1+\alpha F'(z)/F(z)}\right|<1.
\tag{2.2}
\]

Fix \(X\ge1/2\). Define the outer-line function by its absolutely
convergent integral:

\[
g_{\sigma,X}^{\rm out}(u)
=\frac1{4\pi}\int_{\mathbb R}
S(X+it)V_\sigma(X+it)e^{-(X+it)u/2}\,dt.
\tag{2.3}
\]

Plancherel and (2.2) give

\[
\boxed{\quad
\int e^{Xu}|g_{\sigma,X}^{\rm out}(u)|^2\,du
\le \int e^{Xu}|p_\sigma(u)|^2\,du
=e^{\sigma^2X^2/4}.
\quad}
\tag{2.4}
\]

This is a bound for the explicitly defined outer-line solution. It has not
identified that solution with the actual boundary response.

There are no poles between any two lines with real part at least one half.
Gaussian decay and (2.2) let their contours be shifted directly. Thus
\(g_{\sigma,X}^{\rm out}\) is independent of \(X\ge1/2\). Denote this common
function by \(g_\sigma^{\rm out}\). Inequality (2.4) holds for this one
function for every such \(X\).

Its pointwise bound is also explicit:

\[
|g_\sigma^{\rm out}(u)|
\le c_\sigma e^{\sigma^2X^2/8-Xu/2},\qquad X\ge1/2.
\tag{2.5}
\]

For \(u\ge\sigma^2/4\), optimize at \(X=2u/\sigma^2\) to obtain

\[
|g_\sigma^{\rm out}(u)|\le p_\sigma(u).
\tag{2.6}
\]

The very strong decay at this spatial end is therefore available
unconditionally for the outer-line solution. Its behavior at the other end
must still be checked before identifying it with an ordinary-L2 output.

## 3. Good horizontal contours and grouped convergence

We justify a contour shift through all genuine poles. For a normalized
Blaschke factor,

\[
|b_p(x+it)|^2
=\frac{(x-\rho)^2+(t-\tau)^2}
       {(x+\rho)^2+(t-\tau)^2}.
\tag{3.1}
\]

Fix a finite \(X\ge1/2\). For each sufficiently large integer \(n\), count
the poles with \(|\tau|\le2n+4\), including multiplicity, and call this
number \(N_n=O(n\log n)\). Choose

\[
\delta_n=\frac1{8(N_n+1)}.
\]

Removing intervals of radius \(\delta_n\) around the relevant pole
ordinates and their negatives removes less than half the length of
\([n,n+1]\). There is therefore \(T_n\in[n,n+1]\) whose positive and
negative horizontal lines stay at least \(\delta_n\) away in imaginary
part from every such pole. In particular \(\delta_n\gg1/(n\log n)\).

For \(0\le x\le X\), each pole with \(|\tau|\le2n+4\) satisfies on those
lines

\[
|b_p(x\pm iT_n)|^{-1}
\le \frac{C_X(n+1)}{\delta_n}.
\]

The sum of their logarithms is therefore \(O_X(n(\log n)^2)\).
For the remaining poles, \(|T_n\mp\tau|\ge|\tau|/2\), and (3.1) gives

\[
-\log|b_p(x\pm iT_n)|
\le\frac{8X\rho}{\tau^2}.
\]

The latter terms have a summable bound by (1.2). Since \(|B_+|\le1\),
the reduced quotient obeys

\[
\boxed{\quad
\sup_{0\le x\le X}|S(x\pm iT_n)|
\le\exp\bigl(C_X n(\log n)^2+C_X\bigr).
\quad}
\tag{3.2}
\]

The Gaussian factor has magnitude

\[
|V_\sigma(x\pm iT_n)|
=c_\sigma\sqrt{2\pi}\,\sigma
  e^{\sigma^2(x^2-T_n^2)/8}.
\]

Its negative quadratic exponent dominates (3.2). The horizontal contour
integrals consequently tend to zero, uniformly for \(u\) in compact real
sets in the inverse-transform integrand. The same argument is uniform when
\(\sigma\) varies over a compact subset of \((0,\infty)\).

This proves the needed convergence without bounding individual residues.
Very close poles can make such individual bounds misleading; the finite
residue sums enclosed by these good contours are the objects controlled here.

## 4. Exact direct-output correction

Shift the upward-oriented imaginary line to the upward-oriented line at
\(X\ge1/2\). With our inverse factor \(1/(4\pi i)\), the rectangle has
clockwise orientation. The resulting identity is

\[
\boxed{\quad
g_\sigma(u)=g_\sigma^{\rm out}(u)-R_\sigma(u),
\quad}
\tag{4.1}
\]

where

\[
\boxed{\quad
R_\sigma(u)=\frac12\lim_{n\to\infty}
\sum_{\substack{p\text{ genuine pole of }S\\
                 0<\Re p<X,\ |\Im p|<T_n}}
\operatorname*{Res}_{z=p}
\left[S(z)V_\sigma(z)e^{-zu/2}\right].
\quad}
\tag{4.2}
\]

All genuine right-half-plane poles lie strictly left of one half, so the
same poles are enclosed for every \(X\ge1/2\). The grouped sum converges
locally uniformly in \(u\), by Section 3 and the absolutely convergent two
vertical integrals. It is independent of which good-height sequence is used,
because its limit is the uniquely defined difference in (4.1).

Multiplicity is included through the residue operation. A pole of order
\(m\) contributes a polynomial of degree at most \(m-1\) in \(u\), times
\(e^{-pu/2}\). The nonvanishing Gaussian factor preserves the order of
every genuine pole. Nevertheless, no inference from independent signs of
individual residue terms is made.

**Vanishing criterion.** The correction vanishes identically if and only if
there are no genuine right-half-plane poles.

If there are no poles, the sum is empty. Conversely, suppose \(R_\sigma=0\).
Then the actual ordinary-L2 response equals \(g_\sigma^{\rm out}\) and has
the weighted norm in (2.4). Its bilateral transform is analytic in
\(0<\Re z<X\). At each interior real part \(x\), Cauchy--Schwarz gives

\[
\|e^{xu/2}g_\sigma\|_1
\le \frac{\|g_\sigma\|_2}{\sqrt x}
 +\frac{\|e^{Xu/2}g_\sigma\|_2}{\sqrt{X-x}}.
\tag{4.3}
\]

Both theta kernels are also integrable with that weight. Consequently the
actual convolution equation and Fubini give \(DY=NV_\sigma\) directly in
the strip. Since \(V_\sigma\) is zero-free, a genuine pole
is impossible. This proves the converse without presuming independent
convergence or linear independence of an infinite collection of residues.

For this xi family, the previously audited pole-free-to-inner argument
identifies that pole-free condition with RH.

## 5. Exact domains of the two convolution solutions

Both functions in (4.1) solve the physical theta equation

\[
A g=A^*p_\sigma.
\tag{5.1}
\]

For \(g_\sigma\), this is the ordinary-L2 identity \(AC_0=A^*\).
For \(g_\sigma^{\rm out}\), fix \(X\ge1/2\) and set
\(h_X=e^{Xu/2}g_\sigma^{\rm out}\in L^2\). The tilted convolution kernel
\(e^{Xu/2}h_+(u)\) is in \(L^1\). Its bounded L2 convolution has symbol
\(D(X+it)\), and the defining outer-line identity gives

\[
D(X+it)\widehat h_X(t)
=N(X+it)V_\sigma(X+it).
\]

Weighted Young inequalities therefore prove (5.1) in the actual weighted
L2 space. The convolution also converges pointwise absolutely: (2.5) at
\(X=1/2\) bounds the outer function by a constant times \(e^{-u/4}\),
whereas \(h_+\) decays faster than every exponential.

For the actual output, absolute Fourier inversion gives
\(|g_\sigma(u)|\le c_\sigma\). Thus

\[
|R_\sigma(u)|
\le c_\sigma\left(1+e^{\sigma^2/32-u/4}\right).
\tag{5.2}
\]

The difference is a smooth function with controlled exponential growth at
the negative end, and its convolution with \(h_+\) is absolutely convergent.
Subtracting the two legitimate equations proves

\[
A R_\sigma=0
\tag{5.3}
\]

pointwise. This is a nullsolution in an enlarged growth domain. There is no
nonzero ordinary-L2 nullsolution, because \(D(it)\ne0\) almost everywhere.

The domain distinction can be stated sharply:

\[
\boxed{\quad
g_\sigma^{\rm out}\in L^2(\mathbb R)
\quad\Longleftrightarrow\quad \mathrm{RH}.
\quad}
\tag{5.4}
\]

Indeed, if the outer solution were in ordinary L2, injectivity of \(A\)
there and (5.1) would identify it with the actual output. Section 4 then
excludes the poles. Conversely, without poles (4.1) identifies it with that
ordinary-L2 output. The existing xi-specific criterion supplies the last
equivalence with RH.

The outer solution is always square integrable at the positive end by (2.4)
or (2.6). Hence if genuine poles exist, it necessarily fails square
integrability at the negative end. Positivity on the shifted vertical line
has not controlled both spatial ends in the same domain.

## 6. Sharp Gaussian weight threshold

Let \(\mathcal P\) be the multiset of genuine right-half-plane poles of the
reduced quotient, and define

\[
d=\inf_{p\in\mathcal P}\Re p,
\qquad d=+\infty\ \text{if }\mathcal P=\varnothing.
\tag{6.1}
\]

For every \(\sigma>0\), put

\[
E_\sigma(X)=\int_{\mathbb R}e^{Xu}|g_\sigma(u)|^2\,du.
\]

**Threshold theorem.**

\[
\boxed{\quad
\begin{array}{ll}
E_\sigma(X)<\infty,&0<X<d,\\[2pt]
E_\sigma(X)=\infty,&X>d.
\end{array}
\quad}
\tag{6.2}
\]

In particular,

\[
\sup\{X\ge0:E_\sigma(X)<\infty\}=d,
\tag{6.3}
\]

with the stated conventions. This result does not assert either outcome at
\(X=d\).

**Proof of finiteness below the threshold.** If there are no poles, \(S\)
is inner and the weighted contraction gives the conclusion for every
positive weight. Otherwise, fix \(0<X<d\) and let \(\delta=d-X>0\).
All canceled common denominator zeros have already been removed from the
factorization (1.1). Thus every factor of \(B_-\) has \(\rho-x\ge\delta\)
for \(0\le x\le X\). Formula (3.1) gives

\[
-\log|b_p(x+it)|
\le\frac{2x\rho}{(\rho-x)^2+(t-\tau)^2}
\le\frac{2X\rho}{\delta^2+(t-\tau)^2}.
\tag{6.4}
\]

For poles with \(|\tau|\le2(|t|+1)\), use the denominator bound
\(\delta^2\), \(\rho<1/2\), and the zero count in (1.2). For the remaining
poles use \(|t-\tau|\ge|\tau|/2\) and the Blaschke sum. Summation yields

\[
\sup_{0\le x\le X}|S(x+it)|
\le\exp\bigl(C_{X,\delta}(1+|t|)\log(2+|t|)\bigr).
\tag{6.5}
\]

Every fixed Gaussian dominates this growth. There are no genuine poles in
the strip, so its damped contour shifts to \(X\) with no residue correction.
The vertical integrand is square integrable. Plancherel therefore proves
\(e^{Xu/2}g_\sigma\in L^2\), as an actual function, not merely a continued
symbol.

**Proof of divergence above the threshold.** If \(X>d\), some genuine pole
has real part strictly between zero and \(X\). Finite \(E_\sigma(X)\),
together with ordinary L2 membership, would give an analytic strip transform
\(Y\) and, by the weighted L1 estimate (4.3) and Fubini, the identity
\(DY=NV_\sigma\). At that pole the denominator
has strictly higher order than the numerator, and \(V_\sigma\) does not
vanish. This contradicts analyticity of \(Y\). Thus the weighted energy
is infinite.

If \(d=0\), the theorem says that no positive exponential weight is
admissible. If \(0<d<\infty\), it identifies the exact open range of
admissible weights. Both statements are independent of Gaussian width.

## 7. Consequence for heat smoothing and the remaining energy task

For the mass-one heat kernel

\[
G_t(u)=(4\pi t)^{-1/2}e^{-u^2/(4t)},\qquad t>0,
\]

the bilateral transform is \(e^{tz^2/4}\), which is everywhere nonzero.
The actual output \(C_0G_t\) solves the heat equation in \(t\), since the
Fourier multiplier commutes with the heat semigroup. Changing \(t\) changes
the nonzero Gaussian multiplier of each genuine pole, and can greatly
suppress contributions at large imaginary height. It does not remove a
pole or change the threshold (6.3) at any finite positive time.

Accordingly, the outer-line energy bound (2.4) cannot be transferred to the
actual response by invoking Gaussian smoothness alone. The missing term is
the explicitly defined grouped correction (4.2); if it is nonzero, the
outer solution pays for its favorable positive-end behavior by leaving the
ordinary-L2 domain at the other end.

The unresolved mathematical obligation is to prove that this correction
vanishes, or equivalently to establish a domain-preserving energy estimate
for the actual response. The contour calculation supplies the exact domain
and residue statement; it supplies no positivity theorem that forces the
genuine-pole set to be empty.
