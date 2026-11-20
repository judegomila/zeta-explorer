# Theta zero cages: a quantitative obstruction and a cancellation-preserving replacement

Date: 2026-11-16. Status: analytic lemmas and diagnostic computations. These results do not prove RH and do not certify a new all-height zero-free strip. The formulas below use the audited PR49 normalization.

## 1. Normalization

\[
H_\tau(z)=\int_0^\infty e^{\tau u^2}\Phi(u)\cos(zu)\,du,
\qquad
H_0(z)=\frac18\xi\!\left(\frac12+\frac{iz}{2}\right),
\]

\[
\Phi(u)=\sum_{n\ge1}
\left(2\pi^2n^4e^{9u}-3\pi n^2e^{5u}\right)e^{-\pi n^2e^{4u}}.
\]

For real \(u\ge0\), every summand is positive because \(2\pi n^2e^{4u}>3\). The modular identity supplies the even extension of \(\Phi\). The series defines a holomorphic function in \(|\Im u|<\pi/8\). These are properties of the exact theta kernel; a finite theta truncation need not inherit the modular evenness away from the positive real half-line.

## 2. A proved obstruction to the unshifted absolute-moment certificate

Define the finite positive moment

\[
M_2(r)=\int_0^\infty u^2\Phi(u)\cosh(ru)\,du>0.
\]

For any real center \(x\) and any \(|w|\le r\), differentiating the entire Fourier integral and using Taylor's integral remainder gives

\[
\left|H_0(x+w)-H_0(x)-wH_0'(x)\right|
\le \frac{|w|^2}{2}M_2(r).
\tag{1}
\]

Indeed, \(|\cos((x+tw)u)|\le\cosh(ru)\) for \(0\le t\le1\). Thus the usual linear-model Rouché certificate is

\[
|H_0(x)|+\frac{r^2}{2}M_2(r)<r|H_0'(x)|.
\tag{2}
\]

At an exact real zero, any radius passing (2) necessarily obeys

\[
r<\frac{2|H_0'(x)|}{M_2(r)}\le\frac{2|H_0'(x)|}{M_2(0)}.
\tag{3}
\]

### Height dependence, without RH

For every fixed derivative order \(k\),

\[
H_0^{(k)}(x)=O_k\!\left(x^3e^{-\pi x/8}\right)
\qquad (x\to+\infty).
\tag{4}
\]

One elementary proof uses

\[
\zeta(s)=\frac{s}{s-1}-s\int_1^\infty\{v\}v^{-s-1}\,dv,
\qquad \Re s>0,
\]

which gives \(|\zeta(\sigma+it)|=O(t)\), uniformly for \(1/4\le\sigma\le3/4\). Stirling's formula in this fixed vertical strip gives

\[
|\Gamma(s/2)|=O\!\left(t^{\sigma/2-1/2}e^{-\pi t/4}\right).
\]

Multiplying by the remaining factors in \(\xi(s)\) bounds \(\xi(s)\) by \(O(t^3e^{-\pi t/4})\). A Cauchy estimate on a fixed disk about \(x\) in the \(H_0\) coordinate proves (4).

Consequently (3) admits only

\[
\boxed{r=O\!\left(x^3e^{-\pi x/8}\right).}
\tag{5}
\]

This is a restriction on this *particular sufficient certificate*, not a statement that actual zero separations are exponentially small. It proves that an absolute moment remainder discards the cancellation needed to certify cages of logarithmic or polynomial scale at high height.

Multiplying (1) by a nonzero scalar does not fix the loss: the linear term and error multiply by the same scalar. Nor does increasing to any fixed Taylor order remove the exponential mismatch: the moment envelope is independent of \(x\), while every fixed finite collection of Taylor coefficients satisfies (4).

### Diagnostic values, not interval certificates

Using 60-decimal mpmath evaluation gives \(M_2(0)\approx0.00071787325984829492297655864055100532\). At the \(n\)-th standard zeta ordinate \(\gamma_n\), the \(H_0\) zero is \(x_n=2\gamma_n\). The following table reports the logarithm of the necessary upper radius in (3):

| \(n\) | \(\gamma_n\) | \(\log_{10}|H_0'(2\gamma_n)|\) | \(\log_{10}(2|H_0'|/M_2(0))\) |
|---:|---:|---:|---:|
| 1 | 14.1347251417 | -4.0633860241 | -0.6184038050 |
| 10 | 49.7738324777 | -15.0108871764 | -11.5659049573 |
| 100 | 236.524229666 | -77.0763025252 | -73.6313203061 |
| 1000 | 1419.42248095 | -479.350779192 | -475.905796972 |

The theorem is the analytic estimate (5); these numbers only illustrate it.

## 3. An exact shifted-contour replacement

Let \(0<\eta<\pi/8\), and put \(A_\tau(u)=e^{\tau u^2}\Phi(u)\). The evenness and superexponential decay of the exact kernel justify shifting the full Fourier contour within its holomorphic strip. For every complex \(z\),

\[
\boxed{
G_{\tau,\eta}(z):=e^{\eta z}H_\tau(z)
=\frac12\int_{\mathbb R}A_\tau(u+i\eta)e^{izu}\,du.
}
\tag{6}
\]

The factor \(e^{\eta z}\) is entire and nonvanishing, so (6) preserves all zeros and their multiplicities. For real \(\tau\), conjugation and evenness also give the exact real-coefficient version

\[
G_{\tau,\eta}(z)=\int_0^\infty
\left[\Re A_\tau(u+i\eta)\cos(zu)
-\Im A_\tau(u+i\eta)\sin(zu)\right]du.
\tag{7}
\]

A fixed quadrature rule in (7) produces a holomorphic finite Fourier approximation. It is preferable to sampling a nonanalytic, moving truncation rule around a contour.

### Explicit disk majorants

Set

\[
c=\cos(4\eta)>0,\quad q=e^{-3\pi c},\quad
C(c)=(2\pi^2+3\pi)\frac{1+11q+11q^2+q^3}{(1-q)^5}.
\]

For real \(u\),

\[
|\Phi(u+i\eta)|
\le C(c)\exp\left(9|u|-\pi c e^{4|u|}\right).
\tag{8}
\]

For \(u\ge0\), use \(n^2-1\ge3(n-1)\), \(n^2\le n^4\), and \(e^{5u}\le e^{9u}\). The elementary sum \(\sum_{n\ge1}n^4q^{n-1}=(1+11q+11q^2+q^3)/(1-q)^5\) proves (8). Negative \(u\) follows from exact modular evenness and conjugation.

Suppose \(\tau\in[\tau_a,\tau_b]\), \(T=\max(\tau_b,0)\), and \(S=\max(|\tau_a|,|\tau_b|)\). On a full disk \(|z-x|\le r\),

\[
\boxed{
|G_{\tau,\eta}^{(k)}(z)|
\le C(c)e^{S\eta^2}
\int_0^\infty u^k
e^{Tu^2+(9+r)u-\pi c e^{4u}}\,du.
}
\tag{9}
\]

This is an explicit scalar, nonoscillatory integral. A tail enclosure follows exactly as in PR49: if

\[
16\pi c e^{4U}\ge2T,
\qquad a_k=4\pi c e^{4U}-2TU-(9+r)-k/U>0,
\]

then the contribution of \([U,\infty)\) to the integral in (9) is at most

\[
\frac{U^k}{a_k}
e^{TU^2+(9+r)U-\pi c e^{4U}}.
\tag{10}
\]

The new feature is the exact factor removal in (6). At height \(x\), choose a fixed value \(\eta=\pi/8-1/x\) for the entire contour and its collar (when \(x>8/\pi\)). Then \(e^{\eta x}H_0'(x)\) no longer contains the main factor \(e^{-\pi x/8}\). The majorants now worsen polynomially in \(x\), since \(c\asymp x^{-1}\), instead of introducing an uncancelled exponential mismatch. This does not prove a lower bound on the normalized derivative, and thus does not close RH.

For clarity, with a fixed disk radius \(r\) and \(\tau=0\), \(C(c)=O(c^{-5})\). Substitution \(v=\pi c e^{4u}\) shows that the integral in (9) is
\(O_r(c^{-(9+r)/4}(1+|\log c|^k))\). Thus the displayed conservative envelope is polynomial in \(1/c\), with logarithmic factors. These are not claimed to be sharp bounds.

### What remains

The contour shift is standard complex analysis, applied here to make the certificate scale correctly. It does not establish all-height nonvanishing or simplicity. Closing the cage argument still needs lower bounds on its boundary model, rigorous coverage/counts, and an analytic argument covering the unbounded height range. It does, however, rule out spending effort on the unshifted absolute-moment certificate as an all-height method.

## 4. Fixed-radius cages cannot cover all zeros individually

The Riemann-von Mangoldt count in the \(H_0\) coordinate has leading growth

\[
N_H(X)=\frac{X}{4\pi}\log\frac{X}{4\pi}-\frac{X}{4\pi}+O(\log X).
\]

Pairwise disjoint disks of radius at least a fixed \(r>0\), centered on the real axis in \([0,X]\), can number at most \(X/(2r)+O(1)\). Therefore a scheme enclosing every zero in its own such disk is impossible, even if RH is true. An all-height scheme requires shrinking radii, cluster certificates, or an analytic propagation theorem. This argument is about individual disjoint cages; it does not prohibit larger contours enclosing many zeros.

## Sources and dependencies

- Audited local source: `../reference/pr49-collective-certificate.md`, especially Sections 1 and 7.
- Audited local source: `../reference/pr56-local-to-global.md`, Section 4.1 (analytic theta strip and modular evenness).
- Gamma vertical-strip asymptotic: NIST DLMF, https://dlmf.nist.gov/5.11 (especially Eq. 5.11.9).
- Riemann-Siegel real-zero counting context: NIST DLMF, https://dlmf.nist.gov/25.10 .
- The derivative growth and shifted-contour estimates here are derived above, not quoted as a new published theorem.
