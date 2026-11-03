# Endpoint Turan density as a theta conditional-variance profile

## Scope

This note gives an unconditional real-space representation of

\[
 L_1[\Xi](t)=\Xi'(t)^2-\Xi(t)\Xi''(t)
\]

and records exactly what would be needed to prove its sign.  The resulting
profile is pointwise positive, but its required positive definiteness is
equivalent to the original endpoint sign.  Thus the representation is a
domain-safe reduction and a guardrail against circular square
factorizations, not a proof of endpoint positivity or RH.

Use the nonunitary Fourier convention

\[
 \widehat\psi(t)=\int_{\mathbb R}\psi(h)e^{-ith}\,dh=2\Xi(t).
 \tag{1}
\]

The complete theta profile is even and strictly positive.  Indeed, for
`h>=0`, with `z_n=pi n^2 e^(2h)`,

\[
 \psi(h)=\sum_{n\geq1}4z_n(2z_n-3)e^{h/2-z_n}>0,
 \tag{2}
\]

because `z_n>=pi>3/2`; modular evenness then gives positivity on the whole
line.  Its derivatives have faster-than-Gaussian decay.

## Exact double-theta formula

Put `F=widehat psi=2Xi`.  Differentiation under the Fourier integral gives

\[
\begin{aligned}
 F'(t)^2-F(t)F''(t)
 &=\iint_{\mathbb R^2}(k^2-hk)\psi(h)\psi(k)
     e^{-it(h+k)}\,dh\,dk\\
 &=\frac12\iint_{\mathbb R^2}(h-k)^2\psi(h)\psi(k)
     e^{-it(h+k)}\,dh\,dk.
\end{aligned}
\tag{3}
\]

The second equality is symmetrization in `h,k`.  Since `F=2Xi`, the endpoint
density is therefore

\[
 \boxed{
 L_1[\Xi](t)=\frac18\iint_{\mathbb R^2}
 (h-k)^2\psi(h)\psi(k)e^{-it(h+k)}\,dh\,dk.}
 \tag{4}
\]

With `u=h+k`, `v=h-k`, define

\[
 \boxed{
 R(u)=\frac1{16}\int_{\mathbb R}v^2
 \psi\!\left(\frac{u+v}{2}\right)
 \psi\!\left(\frac{u-v}{2}\right)\,dv.}
 \tag{5}
\]

Then `R` is even, strictly positive, smooth and rapidly decreasing, and

\[
 \boxed{L_1[\Xi](t)=\widehat R(t).}                 \tag{6}
\]

This agrees exactly with the associated-kernel normalization already used
in the campaign.  If

\[
 \mathcal M_1(a)=\int_0^\infty h^2\psi(h-a)\psi(h+a)\,dh,
\]

then the changes `u=2a`, `v=2h` and evenness give

\[
 R(2a)=\mathcal M_1(a),\qquad
 L_1[\Xi](t)=4\int_0^\infty\mathcal M_1(a)
 \cos(2ta)\,da.                                    \tag{7}
\]

All interchanges above are absolute because the complete theta profile is
Schwartz with stronger real-axis decay.

## Conditional-variance interpretation

Formula (5) has a precise probabilistic meaning that does not assign a
positive measure to the oscillatory Fourier variable.  Let

\[
 Z=\int_{\mathbb R}\psi,
\]

and let `X,Y` be independent random variables with density `psi/Z`.  Write
`c=psi*psi` and `S=X+Y`.  By symmetry,

\[
 \mathbb E[X\mid S=u]=\frac u2.
\]

Changing from `v` to `x=(u+v)/2` in (5) yields

\[
\begin{aligned}
 R(u)
 &=\frac18\int_{\mathbb R}(2x-u)^2
       \psi(x)\psi(u-x)\,dx\\
 &=\boxed{\frac12c(u)\operatorname{Var}(X\mid S=u)}\\
 &=\frac{Z^2}{2}p_S(u)\operatorname{Var}(X\mid S=u).
\end{aligned}
\tag{8}
\]

Thus the first Xi Laguerre density is the characteristic transform of a
positive conditional-variance profile.  This is not itself a variance in
frequency and gives no pointwise sign for its Fourier transform.

## The exact positive-definiteness and square-factorization gate

Because `R` is a continuous integrable function, Bochner/Fourier inversion
gives the exact equivalence

\[
 \boxed{
 L_1[\Xi](t)\geq0\ \hbox{for every real }t
 \quad\Longleftrightarrow\quad
 R\ \hbox{is positive definite}.}
 \tag{9}
\]

Pointwise positivity of `R`, including its conditional-variance form (8), is
strictly weaker than positive definiteness.

The same observation closes an apparent square shortcut.  There exists an
`A in L2(R)` such that

\[
 R=A*\widetilde A,
 \qquad \widetilde A(u)=\overline{A(-u)},             \tag{10}
\]

if and only if (9) holds.  The forward implication follows by Fourier
transforming (10).  Conversely, if `widehat R=L_1[Xi]>=0`, then
`sqrt(widehat R) in L2` because
`integral widehat R=2pi R(0)<infinity`; inverse Fourier transformation gives
an `A` satisfying (10).  Consequently, proposing an unspecified
autocorrelation factor for (5) merely renames the missing endpoint theorem.
A useful factorization would have to be constructed from independently
controlled theta or arithmetic data.

## Two unconditional guardrails

### Positive interaction density is not enough

The failure is visible in an exact generic model.  Take the positive even
Gaussian mixture

\[
 \psi_G(u)=\frac{e^{-u^2/4}}{2\sqrt\pi}
 +\frac{e^3e^{-u^2/16}}{4\sqrt\pi}.
\]

Its transform is

\[
 F_G(t)=e^{-t^2}+e^3e^{-4t^2}.
\]

At `t=1`,

\[
 F_G=\frac2e,\qquad F_G'=-\frac{10}e,
 \qquad F_G''=\frac{58}e,
\]

so

\[
 F_G'^2-F_GF_G''=-\frac{16}{e^2}<0.                 \tag{11}
\]

Nevertheless, repeating (5) with `psi_G` gives a strictly positive
interaction profile whose Fourier value at `t=1` is `-4/e^2` in the
normalization (5).  This exact example rules out any argument using only
positivity, evenness, analyticity and rapid decay of the input or positivity
of the double-theta integrand.  It is not a counterexample involving the
actual theta profile.

### No positive Gaussian-mixture factorization

The actual `R` decays faster than every Gaussian.  For each `A>0`, the theta
decay gives `psi(x)<=C_A exp(-A x^2)`, hence from (5)

\[
 0<R(u)\leq C'_A e^{-A u^2/2}.                       \tag{12}
\]

If a nonzero positive measure `mu` satisfied

\[
 R(u)=\int_0^\infty e^{-s u^2}\,d\mu(s),             \tag{13}
\]

then some finite `S` would have `mu([0,S])>0`, giving
`R(u)>=mu([0,S])e^{-S u^2}`, contrary to (12) with a larger Gaussian rate.
Therefore `R(sqrt(x))` is not completely monotone and the Schoenberg
positive-Gaussian-mixture route cannot prove (9).  This does not obstruct a
general positive-definite or autocorrelation representation.

## Relation to de Branges phase and RH

Let

\[
 \mathcal E(t)=\Xi(t)+i\Xi'(t).
\]

Where `mathcal E` is nonzero,

\[
 -\frac d{dt}\arg\mathcal E(t)
 =\frac{\Xi'(t)^2-\Xi(t)\Xi''(t)}
        {\Xi(t)^2+\Xi'(t)^2}.                        \tag{14}
\]

Thus (9) is exactly monotonicity of the boundary phase, or nonnegativity of
the diagonal first-shift de Branges kernel.  Invoking a positive de Branges
space or Hermite--Biehler property to prove (14) is circular at this level;
the Hermite--Biehler statement for this Xi-derived function is an RH-level
input.  Conversely, the single first Laguerre inequality (9) must not be
advertised as equivalent to RH.  The established all-orders criterion uses
`L_n[Xi]>=0` for every `n` and every real height; (9) is only its first
nontrivial member.

## Resulting route status

The endpoint Turan route has one exact theta-specific target:

\[
 \mathcal M_1\ \hbox{(equivalently `R`) is positive definite}.
\]

The conditional-variance identity (8) may help design a source-specific
proof, but ordinary variance inequalities control the pointwise size of `R`,
not all coupled translation Grams required by (9).  Neither pointwise theta
positivity, a Gaussian envelope, an unspecified square root, nor boundary
de Branges language closes that gap.  No endpoint sign, all-degree bridge
positivity, or RH conclusion is claimed here.
