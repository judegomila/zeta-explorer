# Gaussian probes and a certified obstruction to positive theta preimages

## Results

Smoothing the box pulse gives a useful alternative formulation, but does not
make the positive-preimage argument available. For the active parameter
\(\alpha=1\), this note proves the following two statements.

1. Every nonzero Gaussian is a zero-free probe for the weighted pulse
   criterion. For each fixed \(X\ge1/2\), weighted square integrability of its
   **actual** boundary response is equivalent to RH, by the same strip
   continuation argument as for the box pulse.
2. **No nonnegative \(L^2\) function, and no nonnegative finite measure, is a
   preimage of a nonzero positive Gaussian under convolution by
   \(h_+(u)=(1+u/2)\kappa(u)\).** This second assertion is unconditional.
   Its proof uses a separately certified nonreal zero of \(D=F+F'\) in
   \(-1<\Re z<0\), positivity of the real-axis Laplace transform, and an
   explicit two-sided abscissa-of-convergence argument.

The obstruction does not exclude signed preimages. It also does not by itself
exclude sequences of nonnegative approximate preimages whose masses or norms
escape control. No sequence with a proved leakage bound tending to zero has
been constructed here.

## 1. Definitions and the smooth probe

Use

\[
F(z)=\xi(1/2+z)=\int_{\mathbb R}\kappa(u)e^{zu/2}\,du,
\qquad D=F+F',\quad N=F-F',\quad S=N/D.
\]

The theta kernel \(\kappa\) is positive and even. Let \(A\) be convolution
by \(h_+=(1+u/2)\kappa(u)\). It is a bounded operator on ordinary \(L^2\),
with Fourier symbol \(D(it)\) under the convention
\(\widehat f(t)=\int f(u)e^{itu/2}\,du\). Its adjoint has symbol \(N(it)\).
The actual boundary multiplier \(C_0\) with symbol \(S(it)\) is unitary,
and \(AC_0=A^*\). Isolated common boundary zeros do not affect this
almost-everywhere multiplier.

For \(\sigma>0\), choose the norm-one Gaussian

\[
p_\sigma(u)=(\pi\sigma^2)^{-1/4}e^{-u^2/(2\sigma^2)}.
\]

Its bilateral transform is

\[
V_\sigma(z)=(\pi\sigma^2)^{-1/4}\sqrt{2\pi}\,\sigma
                e^{\sigma^2z^2/8},
\tag{1}
\]

which has no zeros anywhere. Its weighted input norm is

\[
\int e^{Xu}|p_\sigma(u)|^2\,du=e^{\sigma^2X^2/4}.
\tag{2}
\]

For \(g_\sigma=C_0p_\sigma\), the established single-probe argument gives

\[
\boxed{\quad
\mathrm{RH}\quad\Longleftrightarrow\quad
\int e^{Xu}|g_\sigma(u)|^2\,du<\infty,
\qquad X\ge1/2.
\quad}
\tag{3}
\]

Here is the role of the probe explicitly. If the weighted norm is finite,
its bilateral transform \(Y\) belongs to the Hardy space of
\(0<\Re z<X\). In particular, for each real \(0<x<X\),
\(g_\sigma(u)e^{xu/2}\) is integrable: apply Cauchy--Schwarz separately
on the negative half-line using the ordinary norm and on the positive
half-line using the norm with weight \(e^{Xu}\). The theta features have
every exponential moment. Fubini applied to the actual convolution equation
therefore gives \(DY=NV_\sigma\) throughout that strip, without applying a
formal inverse operator. Because \(V_\sigma\) is zero-free, every denominator zero there
is removable in \(N/D\). All possible genuine right-half-plane poles lie
strictly inside \(0<\Re z<1/2\); hence the endpoint \(X=1/2\) suffices.
The previously audited xi-specific pole-free-to-inner argument then gives RH;
see the [prior Hardy analysis](https://github.com/judegomila/mathexplorer/blob/a89222f2d069f24690b2f62904d5049e9ff676ed/rigorous/theta-propagation-2026-11-08/theta_pulse_hardy_defect_20261108.md)
and the [weighted-criterion checkpoint](https://github.com/judegomila/mathexplorer/pull/43).
Conversely, under RH the actual multiplier contracts exponentially weighted
norms, and (2) gives the bound

\[
\int e^{Xu}|g_\sigma(u)|^2\,du\le e^{\sigma^2X^2/4}.
\]

This is an equivalent target, not a new proof of that bound. It removes the
box pulse's \(1/|t|\) Fourier tail from the input but does not remove zeros
or possible small values of the inverse symbol \(1/D(it)\).

## 2. Common boundary zeros must be distinguished from multiplier poles

If \(D(it_0)=0\), then a Gaussian cannot have any \(L^2\) preimage under
\(A\), even a signed one. Indeed an \(L^2\) preimage would satisfy

\[
\widehat a(t)=\frac{V_\sigma(it)}{D(it)}
\quad\text{almost everywhere}.
\]

The numerator is nonzero at \(t_0\), while the denominator has a zero of
positive finite order. The quotient is not locally square integrable there.

For this xi family, boundary zeros of \(D\) are common with \(N\), so they
are removable in the actual response symbol \(S\). Thus the output
\(C_0p_\sigma\) remains well-defined even when the preimage \(A^{-1}p_\sigma\)
does not exist in \(L^2\). Canceling common factors in \(S\) does not cancel
them in \(1/D\), the inverse needed for a theta preimage.

The positive-preimage obstruction proved next does not assume the absence
of these common zeros and does not depend on simplicity of xi zeros.

## 3. Two certified facts about the denominator

The companion interval certificate proves

\[
D(-1)\in[0.48526023880626,\;0.48526028143679]
\tag{4}
\]

and exactly one zero of \(D\) in the disk

\[
\boxed{\quad
|z-z_*|<10^{-3},\qquad
z_*=-\frac{74626947}{10^8}
       +i\frac{1461606607}{10^8}.
\quad}
\tag{5}
\]

The whole disk lies in \(-1<\Re z<0\) and \(\Im z>0\). Call its zero \(p\).
This is a zero of \(D\), not an asserted off-line zero of \(F\), and it need
not be a genuine pole after cancellation in \(N/D\). Neither distinction
weakens the preimage obstruction below.

For real \(x\), the positive tilted measure
\(\kappa(u)e^{xu/2}du/F(x)\) gives

\[
\left(\frac{F'}F\right)'(x)
=\frac14\operatorname{Var}_x(u)>0.
\tag{6}
\]

Since \(F(x)>0\), (4) and (6) imply

\[
\boxed{\quad D(x)>0\quad\text{for every real }x\ge-1.\quad}
\tag{7}
\]

The location of the zero in (5) and the absence of real zeros in (7) are
exactly the facts needed; no global description of the zeros of \(D\) is used.

## 4. From a nonnegative L2 preimage to a finite positive measure

Suppose, for contradiction, that \(a\ge0\), \(a\in L^2(\mathbb R)\), and
\(Aa=p_\sigma\). Because \(D(0)=F(0)>0\), the Fourier identity gives

\[
\widehat a(t)=R(it),\qquad R(z):=V_\sigma(z)/D(z),
\tag{8}
\]

on a neighborhood of zero, almost everywhere. The right side is analytic
there. This already forces \(a\in L^1\); the argument does not assume an
inverse transform with better decay.

For \(\epsilon>0\), Plancherel gives

\[
\int a(u)e^{-\epsilon u^2}\,du
=\int_{\mathbb R}\widehat a(t)K_\epsilon(t)\,dt,
\qquad
K_\epsilon(t)=\frac1{4\pi}\sqrt{\frac\pi\epsilon}
                    e^{-t^2/(16\epsilon)}.
\tag{9}
\]

The positive kernels \(K_\epsilon\) have integral one and concentrate at
zero. On a fixed small neighborhood of zero, (8) and continuity give the
limit \(R(0)\). Outside that neighborhood, Cauchy–Schwarz and
\(\widehat a\in L^2\) make the contribution tend to zero, since the
\(L^2\) norm of the Gaussian kernel there tends to zero. Hence the right
side of (9) tends to the finite positive number \(R(0)\).

The left side increases to \(\int a\) as \(\epsilon\downarrow0\), because
\(a\ge0\). Monotone convergence therefore proves

\[
\int a(u)\,du=R(0)<\infty.
\]

Thus \(d\mu=a(u)du\) is a finite positive measure. If the original preimage
was already assumed to be a finite positive measure, start at this point.

For completeness, \(A\) is injective on \(L^2\): its entire symbol is not
identically zero and has at most isolated zeros on the Fourier line, so
\(D(it)\widehat a(t)=0\) implies \(a=0\). The proof uses the bounded
convolution operator on its actual \(L^2\) domain, not a formal inverse.

## 5. Local analytic positivity supplies an initial convergence strip

We spell out the positive-measure input. A finite positive measure whose
Fourier transform is analytic near zero has a nontrivial exponential moment.
Here is a direct proof sufficient for this application.

For every integer \(n\ge1\), expand

\[
\int|1-e^{itu/2}|^{2n}\,d\mu(u)
\]

as a finite linear combination of the Fourier transform at integer multiples
of \(t\). Analyticity at zero shows that this is \(O(t^{2n})\), because all
lower powers cancel. Fatou's lemma, after division by \(t^{2n}\), gives the
finite moment \(\int u^{2n}d\mu\). Once that moment is finite, differentiation
under the integral identifies it with the corresponding even derivative.

If the local analytic transform is bounded by \(M_r\) on a complex circle
of radius \(r\), Cauchy's estimate gives

\[
\frac{\int u^{2n}\,d\mu(u)}{2^{2n}(2n)!}
\le\frac{M_r}{r^{2n}}.
\]

For \(0<\rho<r\), Tonelli applied to the nonnegative series for cosh yields

\[
\int\cosh(\rho u/2)\,d\mu(u)
\le M_r\sum_{n\ge0}(\rho/r)^{2n}<\infty.
\]

Since \(e^{\rho|u|/2}\le2\cosh(\rho u/2)\), both tails have an exponential
moment. Consequently

\[
M(z)=\int e^{zu/2}\,d\mu(u)
\]

is analytic in an initial strip about the imaginary axis, and (8) gives
\(D(z)M(z)=V_\sigma(z)\) there.

## 6. The two-sided abscissa argument, with both tails handled

Let \((a,b)\) be the maximal open interval of real exponential convergence
of \(M\). The preceding section gives \(a<0<b\). Positivity and standard
dominated bounds make \(M\) analytic throughout \(a<\Re z<b\), and analytic
uniqueness extends

\[
D(z)M(z)=V_\sigma(z)
\tag{10}
\]

throughout this strip.

Split the two tails:

\[
M_+(z)=\int_{[0,\infty)}e^{zu/2}\,d\mu(u),\qquad
M_-(z)=\int_{(-\infty,0)}e^{zu/2}\,d\mu(u).
\]

**Right endpoint.** Suppose \(b<\infty\). Since \(b>0\), (7) says
\(D(b)>0\), so \(V_\sigma/D\) is analytic near \(b\). The negative-tail
transform \(M_-\) is independently analytic near \(b\), because its
convergence condition is only \(\Re z>a\). Equation (10) therefore
continues \(M_+=V_\sigma/D-M_-\) analytically across its real convergence
endpoint \(b\).

That is impossible for a positive measure. To verify this last assertion
directly, choose \(x<b\) sufficiently close to \(b\). A disk of fixed small
radius centered at \(x\) lies in the presumed analytic continuation region,
and Cauchy estimates bound its Taylor coefficients by \(C r^{-n}\).
Those coefficients equal

\[
\frac1{n!}\int_{[0,\infty)}(u/2)^n e^{xu/2}\,d\mu(u)\ge0.
\]

For a positive increment \(h<r\) with \(x+h>b\), Tonelli identifies their
convergent Taylor sum with \(M_+(x+h)\). This extends real exponential
convergence beyond \(b\), a contradiction. Thus \(b=+\infty\).

**Left endpoint.** Suppose \(a\ge-1\). The positive-tail transform \(M_+\)
is independently analytic near \(a\) (in fact it is entire after the right
endpoint argument). Equation (7) also makes \(V_\sigma/D\) analytic near
\(a\). Hence \(M_-=V_\sigma/D-M_+\) analytically continues across its
left convergence endpoint. Apply exactly the positive-tail argument to the
reflected variable \(v=-u\ge0\) and the transform \(M_-(-z)\). It gives a
contradiction. Therefore \(a<-1\), or \(a=-\infty\).

We have proved actual integral convergence, not merely meromorphic
continuation, throughout \(\Re z>-1\). In particular \(M\) is analytic at
the certified zero \(p\) in (5). Evaluating (10) at \(p\) gives

\[
0=D(p)M(p)=V_\sigma(p),
\]

contradicting the zero-free Gaussian transform (1). This proves the
nonnegative-preimage obstruction. The same reasoning applies to a translated
positive Gaussian, whose transform acquires only a nonvanishing exponential
factor. A constant complex phase in a proposed preimage is fixed by its
positive mass and the Fourier identity at zero, so it cannot evade the result.

## 7. Certificate details

The companion Python script uses interval arithmetic with 35 decimal digits,
four theta terms, a positive uniform theta remainder below \(10^{-30}\), and
composite Simpson quadrature on \([0,3]\) with mesh \(1/1000\). It integrates
the exact expressions

\[
D(z)=2\int_0^\infty\kappa(u)
       [\cosh(zu/2)+(u/2)\sinh(zu/2)]\,du,
\]

\[
D'(z)=2\int_0^\infty\kappa(u)
       [(u/2)\sinh(zu/2)+(u^2/4)\cosh(zu/2)]\,du.
\]

The global theta derivative caps
\((2,9,53,376,3245)\), through order four, are proved and rechecked using
the exact polynomial recurrence already documented in the pulse-leakage
certificate. For \(w=z_*/2\), use \(|w|<15/2\), \(|\Re w|<1/2\), and
\(|\cosh(wu)|,|\sinh(wu)|\le e^{3/2}\) on \([0,3]\). Leibniz's rule gives
the explicit fourth-derivative bounds coded in the script. They yield
Simpson errors less than \(2.132\times10^{-8}\) for \(D\), and
\(3.505\times10^{-8}\) for \(D'\). The same conservative \(D\) bound
applies at the real point \(-1\).

For the spatial tails, the previously proved bound
\(\kappa(u)\le3\pi^2e^{9u/4-\pi e^u}\) gives respectively

\[
\frac{15\pi^2e^{33/4-\pi e^3}}{\pi e^3-11/4-1/5},\qquad
\frac{(45/2)\pi^2e^{33/4-\pi e^3}}{\pi e^3-11/4-2/3},
\]

both below \(10^{-20}\). These follow by writing \(u=3+v\), using
\(e^v\ge1+v\), \(2+u\le5e^{v/5}\), and
\(u+u^2/2\le(15/2)e^{2v/3}\).

Finally, uniformly for \(|\Re z|\le1\),

\[
|D''(z)|
\le\int_0^\infty\kappa(u)e^{u/2}(u^2/2+u^3/4)\,du
\]

\[
\le4e^{1/2}(1/12+1/32)
 +\frac{(9/4)\pi^2e^{11/4-\pi e}}{\pi e-23/4}
<0.780013.
\tag{11}
\]

For the first term, use \(\kappa\le2\) on \([0,1]\). For the second, write
\(u=1+v\), bound \(u^2/2+u^3/4\le(3/4)e^{3v}\), and use the theta tail
bound and \(e^v\ge1+v\).

With \(r=10^{-3}\), the certified inequalities are

\[
|D(z_*)|+\frac12\sup|D''|r^2<4.202\times10^{-7},
\qquad |D'(z_*)|r>1.15945\times10^{-6}.
\]

Rouche's theorem compares \(D\) to \(D'(z_*)(z-z_*)\) on the circle and
proves exactly one zero in (5). The calculation depends on the interval
backend's directed-rounding guarantees and is not a formal proof-assistant
verification.

## 8. Why applying A to a positive smooth input does not solve the probe problem

If one instead starts with a positive Gaussian preimage \(a\) and sets
\(f=Aa\), then the input and output are explicitly known:

\[
\widehat f(z)=D(z)\widehat a(z),\qquad
\widehat{C_0f}(z)=N(z)\widehat a(z).
\]

Both physical-space functions have every exponential square moment,
unconditionally. This follows directly from weighted Young inequalities
for the rapidly decreasing theta features and the Gaussian.

Such an input has zeros at every zero of \(D\). Those zeros cancel the
denominator in the continuation equation, so this convenient probe cannot
give the zero-free-probe implication (3). The two choices have distinct
mathematical properties: a genuine Gaussian detects the denominator, while
a Gaussian passed through \(A\) has a tractable positive preimage and loses
that detection property.

The unresolved route would need signed preimages with a justified uniform
energy estimate, or a different argument controlling the actual Gaussian or
box response. Neither positivity of a chosen preimage nor smoothing alone
supplies that missing estimate.
