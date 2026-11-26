# Internal independent review of the explicit theta-kernel construction

Date: 21 November 2026.

**Verdict.** The exact transform, Gaussian-weighted density argument, Gaussian comparison identity, and fixed polynomial differential-channel obstruction in `RH_Direct_Geometric_Attempt.tex` are mathematically valid under the stated normalization and theta decay. They do not prove positive definiteness of the complete kernel or RH. No historical novelty claim is made.

## 1. Exact transform and all constants

Let the actual Riemann theta kernel be the smooth even positive function

\[
\kappa(t)=\sum_{m\ge1}(2\pi^2m^4e^{9t/4}-3\pi m^2e^{5t/4})e^{-\pi m^2e^t}
\quad(t\ge0),
\]

with

\[
F(z)=\xi(1/2+z)=\int_{\mathbb R}\kappa(t)e^{zt/2}\,dt.
\]

Write \(v=(t+u)/2\), \(w=(t-u)/2\), and define

\[
\mathcal K(t,u)=\frac12\int_{|v|}^{\infty}r\kappa(r+w)\kappa(r-w)\,dr.
\]

For each fixed \(w\), the product \(\kappa(r+w)\kappa(r-w)\) is even in \(r\). Its product with \(r\) is odd. Thus the lower endpoint may equivalently be \(v\), including negative \(v\); the signed integral from \(v\) to \(|v|\) is zero. This gives a smooth formula across \(v=0\), although the displayed absolute value initially hides that smoothness.

Because \(\partial_t+\partial_u=\partial_v\),

\[
(\partial_t+\partial_u)\mathcal K(t,u)
=-\frac{t+u}{4}\kappa(t)\kappa(u).
\]

Integrating this identity against \(e^{xt/2+yu/2}\) and moving the derivatives onto that exponential gives

\[
\frac{x+y}{2}\iint\mathcal K(t,u)e^{xt/2+yu/2}\,dt\,du
=\frac14\iint(t+u)\kappa(t)\kappa(u)e^{xt/2+yu/2}\,dt\,du.
\]

Since \(F'(x)=\frac12\int t\kappa(t)e^{xt/2}\,dt\), the right side equals
\(\frac12[F'(x)F(y)+F(x)F'(y)]\). Therefore, for real \(x,y>0\),

\[
\boxed{\iint\mathcal K(t,u)e^{xt/2+yu/2}\,dt\,du
=\frac{F'(x)F(y)+F(x)F'(y)}{x+y}.}
\]

The denominator normalization by \(F(x_i)F(x_j)>0\) produces exactly the user's Pick matrix \(P_{ij}=(L(x_i)+L(x_j))/(x_i+x_j)\), where \(L=F'/F\). Thus the transform includes every mixed term; it is not merely a diagonal or trace identity.

## 2. Decay, boundaries and continuity

The Riemann theta series and its derivatives have doubly exponential tails. In particular \(\kappa(t)\le C\exp(-c e^{|t|})\), with constants that may be reduced/enlarged after polynomial factors are absorbed. For \(M=\max(|t|,|u|)=|v|+|w|\), one of \(|r+w|,|r-w|\) equals \(r+|w|\) when \(r\ge0\). Boundedness of the other factor then gives

\[
|\mathcal K(t,u)|\le C_1\int_{|v|}^\infty r e^{-c e^{r+|w|}}\,dr
\le C_2(1+M)e^{-c_2e^M}.
\]

For the last inequality put \(r=|v|+h\), use \(e^h\ge1+h\), and integrate \((|v|+h)e^{-c e^M h}\). This estimate dominates any fixed exponential weight in \(t,u\), proves the vanishing integration-by-parts boundaries, and justifies continuous dependence on the parameters. The same reasoning with derivative tails justifies the differentiated identities.

The kernel is real, symmetric, invariant under \((t,u)\mapsto(-t,-u)\), and strictly positive at every individual pair of real points. These statements do **not** assert positive definiteness.

## 3. Why the sparse tests detect the complete kernel

Put \(\omega(t)=e^{-t^2}\) and \(d\mu=\omega\,dt\). Define on \(L^2(\mu)\) the integral operator with kernel

\[
A(t,u)=\frac{\mathcal K(t,u)}{\omega(t)\omega(u)}.
\]

Its Hilbert--Schmidt norm is finite because

\[
\iint |A(t,u)|^2\,d\mu(t)d\mu(u)
=\iint |\mathcal K(t,u)|^2e^{t^2+u^2}\,dt\,du<\infty.
\]

Its quadratic form is exactly \(\iint\overline{f(t)}\mathcal K(t,u)f(u)\,dt\,du\), with no remaining weight factors. The operator is bounded and self-adjoint.

For \(x_j=1+1/(j+1)\), the span of \(e^{x_jt/2}\) is dense in \(L^2(\mu)\). If \(h\) is orthogonal to the span, then

\[
Z(z)=\int\overline{h(t)}e^{zt/2}\,d\mu(t)
\]

is entire. Cauchy--Schwarz bounds it on compact subsets, and the same argument applied to \(|t|^k e^{zt/2}\) justifies every complex derivative. It vanishes at \(x_j\to1\), hence identically. Its restriction to the imaginary axis is the Fourier transform of \(\overline h\omega\in L^1\); Fourier uniqueness implies \(h=0\).

If every sparse Pick prefix is PSD, the exact transform and invertible diagonal normalization make \(A\) nonnegative on the dense exponential span. Boundedness extends nonnegativity to every \(L^2(\mu)\) test. For any finite point set \(t_i\) and coefficients \(c_i\), choose smooth bumps of unweighted integral one approaching the point masses and use their linear combination as a test. Each bump belongs to \(L^2(\mu)\), and continuity of \(\mathcal K\) makes the quadratic forms converge to \(\sum\overline c_i c_j\mathcal K(t_i,t_j)\). This proves positive definiteness of the kernel.

Conversely, a continuous positive-definite kernel gives nonnegative integrals on continuous compactly supported tests by Riemann-sum approximation. Such tests are dense in \(L^2(\mu)\), and boundedness again extends positivity. In particular it holds on the exponential span, giving all sparse Pick prefixes. Combining this with the prior manuscript's explicit sparse criterion proves the stated equivalence to RH.

This is an exact reformulation. It does not establish the positive-definiteness premise.

## 4. The Gaussian comparison is exact, but its proposed sign fails

The signed-endpoint expression gives

\[
\mathcal K(t,u)=\frac14\int_0^\infty(t+u+2s)\kappa(t+s)\kappa(u+s)\,ds.
\]

For any \(\alpha>0\), put \(d_\alpha(t)=t+\kappa'(t)/(2\alpha\kappa(t))\). Then

\[
\mathcal K(t,u)=\frac{\kappa(t)\kappa(u)}{8\alpha}
+\frac14\int_0^\infty[d_\alpha(t+s)+d_\alpha(u+s)]\kappa(t+s)\kappa(u+s)\,ds.
\]

The coefficient \(1/(8\alpha)\) follows by integrating the derivative of \(\kappa(t+s)\kappa(u+s)\). For a Gaussian \(\kappa(t)=B e^{-\alpha t^2}\), \(d_\alpha\equiv0\), and the entire kernel is a rank-one Gram kernel.

The natural attempted proof would declare the remainder positive for the actual theta kernel. The general obstruction below proves that this cannot work for any fixed \(\alpha>0\), independently of the separate interval certificate at the origin.

## 5. Fixed polynomial differential channels cannot be positive summands

For every nonzero complex polynomial \(p\), let \(g=p(\partial_t)\kappa\). The kernel \(\mathcal K-cg\otimes\overline g\) fails to be positive definite for every \(c>0\).

Indeed, repeated integration by parts gives

\[
\int g(t)e^{xt/2}\,dt=p(-x/2)F(x).
\]

If the subtraction were positive definite, testing it on compact cutoffs of \(e^{xt/2}\) and passing to the limit would give

\[
\frac{L(x)}x\ge c|p(-x/2)|^2\qquad(x>0).
\]

The completed logarithmic derivative has the unconditional real-axis expansion

\[
L(x)=\tfrac12\log(x/(2\pi))+O(x^{-1}),
\]

obtained from the digamma asymptotic and the absolutely convergent Euler series for large positive real argument. Thus \(L(x)/x\to0\), whereas a nonzero polynomial has modulus bounded away from zero, or tending to infinity, on a sufficiently remote negative real ray. This is a contradiction.

The same Gaussian-weighted density proof applies after this smooth rank-one subtraction, so the obstruction is also detected by some finite sparse prefix. For complex \(p\), the exact subtracted matrix is \(cqq^*\), with \(q_j=p(-x_j/2)\).

**Scope:** this excludes fixed positive channels built from constant-coefficient polynomial derivatives of \(\kappa\). It does not exclude variable-coefficient channels, nonlocal features, or constructions depending on the chosen finite test family. This scope correction was applied to the abstract before release: the missing factorization must lie outside this excluded class; no claim is made that every local construction has been ruled out.

## 6. Review conclusion

No error was found in the transform constants, density argument, Gaussian identity, or polynomial-channel obstruction. Their universal claims are supported by the displayed analytic proofs, not by finite sampled positivity. The direct construction now specifies a concrete theta kernel whose full positive definiteness would finish the route; that theorem remains unproved. The valid substantive result of the attempt is the exact kernel representation together with a rigorous obstruction to a natural and precisely delimited class of proposed positive factorizations.

## 7. Cross-review of the independent prime-delay construction

I also reviewed `PRIME_DELAY_GEOMETRY.md`. Its prime-delay square identity and sparse-space obstruction are correct.

For \(v(t)=\sum b_j e^{-x_jt}\), \(x_*>1/2\), and \(1/2<a<2x_*-1/2\), expanding

\[
\Lambda(n)n^{a-1/2}\|S_{\log n}v-n^{-a}v\|_2^2
\]

gives the cross term \(-2\Lambda(n)n^{-1/2}\Re C_v(\log n)\) with exactly the required coefficient. The two positive diagonal terms sum respectively to

\[
\int_0^\infty B_a(t)|v(t)|^2\,dt,
\qquad
\Gamma_a\|v\|_2^2.
\]

The first sum converges because its majorant is a constant times \(\sum\Lambda(n)n^{-(2x_*-a+1/2)}\), whose exponent is greater than one. The second converges because \(a+1/2>1\). Thus the stated parameter interval is sufficient and nonempty, and the square expansion is an equality of finite quantities. The subsequent ground-state substitution gives the edge coefficient \(\Lambda(n)n^{-(a+1/2)}\), as stated.

The unbounded-potential proposition is also valid on the exact project sparse space. The largest power of two below \(e^t\) gives \(B_1(t)\ge(\log2)e^{t/2}/\sqrt2\) for \(t\ge\log2\). For \(w_m=t^m e^{-t}\), the ratio of the weighted and ordinary squared norms is \((4/3)^{2m+1}\), before removing the bounded initial interval. That removal costs at most \(\sqrt2\) in the normalized ratio.

For fixed \(m\), take divided differences at \(x_N,\ldots,x_{N+m}\). The Hermite--Genocchi integral formula, multiplied by \((-1)^m m!\), gives functions bounded by \(t^m e^{-t}\) and converging pointwise to it as \(N\to\infty\). The bound \(B_1(t)\le t e^{3t/2}\) makes the squared dominating function integrable in both norms. Hence dominated convergence transfers the unbounded ratios to finite combinations of the actual sparse nodes. Each such combination lies in a finite prefix, with unused coefficients set to zero.

This proves failure of a uniform estimate by a fixed multiple of the ordinary \(L^2\) norm. Its scope is correctly restricted: it does not exclude the desired coupled bound using the gamma energy, pole functional, and complete prime-gradient energy. No correction is required to the arithmetic note.
