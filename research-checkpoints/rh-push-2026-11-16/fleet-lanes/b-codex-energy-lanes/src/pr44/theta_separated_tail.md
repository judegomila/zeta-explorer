# Uniform positivity for separated configurations in the theta tail

Research continuation, 8 November 2026. This is an analytical deduction for
the actual theta boundary kernel, with a reproducible interval check of several
explicit parameter choices. No novelty or RH-proof claim is made.

## 1. Statement

Let

\[
\kappa(t)=\sum_{n\ge1}e^{t/4-\pi n^2e^t}
\left[2(\pi n^2e^t)^2-3\pi n^2e^t\right]\quad(t\ge0),
\qquad \kappa(-t)=\kappa(t).
\]

For \(\alpha>0\), define the actual boundary-energy kernel at cutoff zero:

\[
H(U,V)=2\alpha\int_{|(U+V)/2|}^\infty
t\,\kappa\left(t-\frac{U-V}{2}\right)
\kappa\left(t+\frac{U-V}{2}\right)\,dt.
\]

Fix a minimum spacing \(\delta>0\) and a starting point \(R\ge1\). Put

\[
d_R=\frac{3e^{-R}}{2\pi},\qquad
b_R=\frac{e^{-R}}{2\pi R},\qquad
c_R=\frac{7e^{-R}}{4\pi},
\]

\[
\eta_R=(1-d_R)^{-4}
\left[\frac1{1-c_R}+\frac{b_R}{(1-c_R)^2}\right]-1,
\]

\[
\ell_\delta=\frac{4-\pi^2/3}{\delta}
\operatorname{sech}\left(\frac{4\pi}{\delta}\right),
\]

\[
E_{R,\delta}=
\frac{4\eta_R}{e^{\delta/2}-1}
+\frac{32(1+\eta_R)}{e^2R^2(e^{\delta/4}-1)}.
\]

**Theorem.** If \(E_{R,\delta}<\ell_\delta\), then for **every finite number
of points**, every configuration \(U_j\ge R\) with
\(|U_i-U_j|\ge\delta\) for distinct points, and every complex coefficient
vector \(a\),

\[
\boxed{
\sum_{i,j}\overline{a_i}a_jH(U_i,U_j)
\ge (\ell_\delta-E_{R,\delta})
\sum_i|a_i|^2H(U_i,U_i)>0
}
\]

when \(a\ne0\). The constants are independent of the number of points and
of their total span. Reflection gives the same result when all points are
at most \(-R\). Translation gives the corresponding statement at another
cutoff. The theorem does not assert positivity for a configuration mixing
the two ends.

For each fixed \(\delta>0\), an admissible \(R\) exists because
\(E_{R,\delta}\to0\), whereas \(\ell_\delta>0\). This improves the earlier
fixed-configuration tail limit to a bound uniform in cardinality, subject to
fixed separation. It does not remove the separation condition.

## 2. A uniform full-theta envelope

Write

\[
\kappa(t)=2\pi^2e^{9t/4-\pi e^t}L(t),\qquad t\ge0.
\]

The exact series gives

\[
1-\frac{3e^{-t}}{2\pi}\le L(t)\le1.
\tag{2.1}
\]

The lower bound retains only \(n=1\). For the upper bound put \(q=e^t\ge1\)
and write \(n=2+j\). Then
\(n^4\le16e^{2j}\) and \(n^2-1\ge3+4j\), so the remaining positive terms
are at most

\[
\sum_{n\ge2}n^4e^{-\pi(n^2-1)q}
\le\frac{16e^{-3\pi q}}{1-e^{2-4\pi q}}
\le\frac{3}{2\pi q}.
\]

For the final inequality, \(q e^{-3\pi q}\) decreases for \(q\ge1\) and the
denominator increases. At \(q=1\) the inequality is very loose; for example
\(3<\pi<4\) and \(e>2\) already suffice to verify it. This absorbs the
negative \(-3/(2\pi q)\) correction in the first theta term and proves (2.1).

No theta-series truncation is assumed in this envelope.

## 3. Quantitative normalized-kernel approximation

For \(U,V\ge R\), set \(\Lambda=\pi(e^U+e^V)\). Changing the integration
variable gives

\[
H(U,V)=\alpha\int_0^\infty
(U+V+2s)\kappa(U+s)\kappa(V+s)\,ds.
\]

Define the dimensionless factor

\[
J(U,V)=\frac{\Lambda H(U,V)}
{\alpha(U+V)\kappa(U)\kappa(V)}.
\]

After substituting \(q=\Lambda(e^s-1)\),

\[
J(U,V)=\int_0^\infty e^{-q}
\left(1+\frac q\Lambda\right)^{7/2}
\left[1+\frac{2\log(1+q/\Lambda)}{U+V}\right]
\frac{L(U+s)L(V+s)}{L(U)L(V)}\,dq.
\]

Here \(s=\log(1+q/\Lambda)\). By (2.1), the last ratio is between
\((1-d_R)^2\) and \((1-d_R)^{-2}\). Using
\(\log(1+x)\le x\), \(U+V\ge2R\), and
\(\Lambda\ge2\pi e^R\) yields

\[
(1-d_R)^2\le J(U,V)\le
(1-d_R)^{-2}
\left[\frac1{1-c_R}+\frac{b_R}{(1-c_R)^2}\right].
\tag{3.1}
\]

All denominators are positive for \(R\ge1\). Consequently the normalized
kernel

\[
C(U,V)=\frac{H(U,V)}{\sqrt{H(U,U)H(V,V)}}
\]

has the exact form

\[
C(U,V)=\frac{U+V}{2\sqrt{UV}}
\operatorname{sech}\left(\frac{U-V}{2}\right)
\frac{J(U,V)}{\sqrt{J(U,U)J(V,V)}}.
\]

By (3.1), the final ratio differs from one by at most \(\eta_R\). If
\(d=|U-V|\), then

\[
1\le\frac{U+V}{2\sqrt{UV}}
=\sqrt{1+\frac{d^2}{4UV}}
\le1+\frac{d^2}{8R^2}.
\]

We obtain the uniform error bound

\[
\boxed{
\left|C(U,V)-\operatorname{sech}(d/2)\right|
\le\left[\eta_R+\frac{(1+\eta_R)d^2}{8R^2}\right]
\operatorname{sech}(d/2).
}
\tag{3.2}
\]

The diagonal error is exactly zero, a fact used in the row estimates below.

## 4. Uniform lower bound for separated sech Gram matrices

The Fourier representation

\[
\operatorname{sech}(x/2)
=\int_{\mathbb R}\operatorname{sech}(\pi t)e^{ixt}\,dt
\]

follows directly by the substitution \(y=e^{2\pi t}\) and the Euler beta
integral. Thus, for \(p(t)=\sum_j a_j e^{iU_jt}\),

\[
\sum_{i,j}\overline{a_i}a_j\operatorname{sech}((U_i-U_j)/2)
=\int_{\mathbb R}\operatorname{sech}(\pi t)|p(t)|^2\,dt.
\]

Let \(T=4/\delta\) and use the triangular window
\(w_T(t)=(1-|t|/T)_+\). Its Fourier transform is

\[
\int w_T(t)e^{idt}\,dt
=T\left(\frac{\sin(Td/2)}{Td/2}\right)^2.
\]

The diagonal value is \(T\), and each off-diagonal absolute value is at most
\(4/(Td^2)\). The \(k\)-th neighbor on either side of a point is at distance
at least \(k\delta\), so each off-diagonal row sum is at most

\[
\frac8{T\delta^2}\sum_{k\ge1}\frac1{k^2}
=\frac{4\pi^2}{3T\delta^2}.
\]

Since \(\operatorname{sech}(\pi t)\ge
\operatorname{sech}(\pi T)w_T(t)\), diagonal dominance gives

\[
\sum_{i,j}\overline{a_i}a_j\operatorname{sech}((U_i-U_j)/2)
\ge\operatorname{sech}(\pi T)
\left(T-\frac{4\pi^2}{3T\delta^2}\right)\sum_i|a_i|^2
=\ell_\delta\sum_i|a_i|^2.
\tag{4.1}
\]

This is an elementary proof of the needed uniform lower bound; no unproved
sampling or interpolation assumption is used.

## 5. Controlling the actual theta correction

For \(d\ge0\),

\[
\operatorname{sech}(d/2)\le2e^{-d/2},\qquad
d^2\operatorname{sech}(d/2)\le\frac{128}{e^2}e^{-d/4}.
\]

The second inequality uses \(\sup_{d\ge0}d^2e^{-d/4}=64/e^2\).
For a separated configuration, the two-sided row sums therefore satisfy

\[
\sum_{j\ne i}\operatorname{sech}(|U_i-U_j|/2)
\le\frac4{e^{\delta/2}-1},
\]

\[
\sum_{j\ne i}|U_i-U_j|^2\operatorname{sech}(|U_i-U_j|/2)
\le\frac{256}{e^2(e^{\delta/4}-1)}.
\]

Combining these bounds with (3.2) proves that the matrix error has operator
norm at most \(E_{R,\delta}\). Subtract this error from (4.1), then undo the
positive diagonal normalization, to obtain the theorem.

## 6. Certified examples and the precise limitation

`theta_separated_tail_certificate.py` verifies all constants by directed
interval arithmetic. Conservative example choices are:

| Minimum spacing | Start R | Certified lower margin, rounded down |
|---:|---:|---:|
| 0.5 | 1,200,000 | 1.19e-11 |
| 1 | 2,000 | 1.14e-6 |
| 2 | 100 | 6.58e-4 |
| 4 | 20 | 9.01e-3 |
| 8 | 8 | 2.47e-2 |

These are bounds for the normalized matrix and hold for every cardinality.
The very large starts at small spacing reflect the conservative proof and its
loss of a uniform margin. They are not a practical discretization prescription.

As \(\delta\downarrow0\), the lower bound \(\ell_\delta\) tends to zero
exponentially. This proof supplies no fixed \(R\) for all spacings and does
not establish positivity on a continuum interval. The companion localization
theorem shows why that distinction is fundamental: positivity on any open
interval for all finite configurations would already imply global positivity
of this analytic kernel, hence the RH-strength statement.

The actual pulse preimages also require unbounded signed cancellation in the
regularization limit. This separated-family result does not control that limit.
