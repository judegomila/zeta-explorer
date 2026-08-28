# Shear-kernel measure audit and arithmetic-block continuation

**Date:** 2026-08-28  
**Status:** exact identities proved below; finite arithmetic diagnostics implemented; global positivity open.  
**RH status:** not proved. Full de Branges-kernel positivity for every shift remains RH-equivalent.

## 1. Purpose

This note corrects the continuum interpretation of the §25 “diagonal channel” and
replaces it with an exact paired-coordinate formula. It then records an exact
Jacobi-theta divisor-block decomposition and a rigorous framework for finite Gram
certificates with analytic tails.

The correction is structural. It does not assert that the Riemann hypothesis is
false, and it does not weaken the exact shift-bridge equivalence. It removes an
invalid proposed reduction of that equivalence.

## 2. Exact shifted de Branges kernel

Use the normalization

\[
\Xi(z)=\int_0^\infty \psi(u)\cos(zu)\,du,
\qquad E_a(z)=\Xi(z+ia)=A_a(z)-iB_a(z),
\]

so

\[
A_a(z)=\int_0^\infty\psi(u)\cosh(au)\cos(zu)\,du,
\qquad
B_a(z)=\int_0^\infty\psi(u)\sinh(au)\sin(zu)\,du.
\]

The de Branges kernel is

\[
K_a(w,z)=
\frac{\overline{A_a(w)}B_a(z)-\overline{B_a(w)}A_a(z)}
{\pi(z-\bar w)}.
\]

Equivalently, putting \(W=\bar w\),

\[
K_a(w,z)=\frac1{\pi(W-z)}
\int_0^\infty\!\int_0^\infty
\psi(u)\psi(v)C_a(W,z;u,v)\,du\,dv,
\]

where

\[
C_a=
\cosh(au)\sinh(av)\cos(zu)\sin(Wv)
-\sinh(au)\cosh(av)\sin(zu)\cos(Wv).
\]

The app convention

\[
\Xi(z)=8\int_0^\infty\Phi(u)\cos(2zu)\,du
\]

is obtained by a linear rescaling of \(u,z,a\). The measure conclusion below is
unchanged by that rescaling.

## 3. Measure-zero lemma

**Lemma 3.1.** Let \(F\in L^1((0,\infty)^2)\). Then

\[
\int\!\!\int F(u,v)\,du\,dv
=
\int\!\!\int_{u\ne v}F(u,v)\,du\,dv.
\]

**Proof.** The diagonal \(\{(u,v):u=v\}\) is a one-dimensional subset of
\(\mathbb R^2\) and has two-dimensional Lebesgue measure zero. ∎

It is algebraically true that

\[
C_a(W,z;u,u)=\frac12\sinh(2au)\sin((W-z)u).
\]

It is also true that the associated one-dimensional comparison expression

\[
K_a^{\mathrm{cmp}}(w,z)=
\frac1{2\pi}\int_0^\infty
\psi(u)^2\sinh(2au)
\frac{\sin((\bar w-z)u)}{\bar w-z}\,du
\]

is positive definite. But \(K_a^{\mathrm{cmp}}\) is not produced by restricting
the original two-dimensional Lebesgue integral to \(u=v\). Such a restriction
contributes zero. A non-zero one-dimensional contribution requires an added
delta measure or a separate exact identity.

On a mesh of width \(h\), the distinction is visible as

\[
h^2\sum_j F(jh,jh)=O(h)\longrightarrow0,
\qquad
h\sum_jF(jh,jh)=O(1).
\]

The second expression discretizes an inserted one-dimensional measure, not the
diagonal cells of the two-dimensional integral.

## 4. Exact paired-coordinate repair

Set

\[
r=\frac{u+v}{2},\qquad s=\frac{v-u}{2},\qquad
M(r,s)=\psi(r-s)\psi(r+s),
\]

and write

\[
\Delta=\bar w-z,\qquad \Sigma=\bar w+z.
\]

Pairing \(s\) and \(-s\) gives

\[
\begin{aligned}
&C_a(\bar w,z;r-s,r+s)+C_a(\bar w,z;r+s,r-s)\\
&=\sinh(2ar)\sin(\Delta r)\cos(\Sigma s)
+\sinh(2as)\sin(\Delta s)\cos(\Sigma r).
\end{aligned}
\]

Since the Jacobian is \(2\), the complete kernel is exactly

\[
\boxed{
K_a(w,z)=\frac2\pi\int_0^\infty\!\int_0^r M(r,s)
\left[
\sinh(2ar)\frac{\sin(\Delta r)}{\Delta}\cos(\Sigma s)
+\sinh(2as)\frac{\sin(\Delta s)}{\Delta}\cos(\Sigma r)
\right]ds\,dr.}
\]

This is the appropriate starting point for any positive-core comparison. One may
add and subtract \(K_a^{\mathrm{cmp}}\), but the resulting remainder is the full
difference \(K_a-K_a^{\mathrm{cmp}}\), not the literal region \(u\ne v\).

## 5. Raw antisymmetric shear is not positive

The raw factor

\[
g_a(u,v)=\psi(u)\psi(v)\sinh(a(v-u))
\]

can be written

\[
g_a(u,v)=p(u)q(v)-q(u)p(v),
\quad
p=\psi\cosh(a\cdot),\quad q=\psi\sinh(a\cdot).
\]

Therefore it has rank at most two and is skew-adjoint. Unless it vanishes,
\(ig_a\) has the eigenvalues

\[
\pm\sqrt{\|p\|^2\|q\|^2-|\langle p,q\rangle|^2}.
\]

Thus “shear positivity” cannot mean positivity of this raw operator. The
RH-equivalent object is positivity of the complete transformed de Branges kernel.

## 6. Exact theta divisor blocks

In the standard de Bruijn–Newman normalization,

\[
\Phi(u)=\sum_{n\ge1}\phi_n(u),
\]

\[
\phi_n(u)=
\left(2\pi^2n^4e^{9u}-3\pi n^2e^{5u}\right)
e^{-\pi n^2e^{4u}}.
\]

For \(u=r+s\), \(v=r-s\), \(N=nm\),

\[
\delta_{n,m}=\frac14\log\frac nm,
\qquad c=\pi Ne^{4r},
\]

direct multiplication gives

\[
\phi_n(r+s)\phi_m(r-s)
=e^{2r}c^2
\left[4c^2-12c\cosh 4(s+\delta_{n,m})+9\right]
e^{-2c\cosh 4(s+\delta_{n,m})}.
\]

Grouping ordered pairs by \(N=nm\) produces a divisor-shift comb. On the full
\(s\)-line its arithmetic phase is

\[
D_N(\xi)=
\sum_{d\mid N}e^{i\xi\delta_{d,N/d}}
=N^{-i\xi/4}\sigma_{i\xi/2}(N)
=\prod_{p^k\parallel N}
\frac{\sin((k+1)\xi\log p/4)}{\sin(\xi\log p/4)}.
\]

This is exact multiplicative structure. The index \(n\) is the Jacobi-theta
lattice index, not literally the Euler-product prime-power rung.

There is no blockwise positivity:

\[
D_p(\xi)=2\cos(\xi\log p/4)
\]

changes sign. Endpoint asymptotics also show that the \(N=1\) diagonal kernel
block changes sign at sufficiently large real frequency. Any positivity mechanism
must therefore use cancellations across different \(N\)-blocks. The modular
identity

\[
\sum_{n\ge1}\phi_n'(0)=\Phi'(0)=0
\]

is a prototype of the cancellation destroyed by termwise separation.

The simple multiplier \(D_N\) applies to the full-line density. The physical wedge
\(|s|<r\), the shear weights, and a heat factor mix the phases; they must remain in
the certified kernel calculation.

## 7. Finite Gram certification theorem

Let \(K_a^{(M)}\) be a rigorously evaluated truncation and suppose

\[
|K_a(z_j,z_k)-K_a^{(M)}(z_j,z_k)|\le\varepsilon_M
\]

for all entries of a prescribed \(J\)-node Gram matrix. Then

\[
\|G-G_M\|_2\le J\varepsilon_M.
\]

Consequently:

* if \(\lambda_{\min}(G_M)-J\varepsilon_M>0\), that finite Gram is positive;
* if \(\lambda_{\min}(G_M)+J\varepsilon_M<0\), the full kernel has a negative
  finite-Gram witness;
* otherwise the calculation is inconclusive.

The planned backend is Arb/ball quadrature for the retained blocks plus an
analytic incomplete-gamma bound for the omitted theta tail. Browser
floating-point plots are diagnostics only.

No finite list of positive Grams proves RH. A closure theorem must cover every
finite node set in the upper half-plane and every \(a>0\), or provide an exact
density/compactness argument reducing that continuum to a certified exhaustion.

## 8. Program verdict

1. The shift-bridge/de Branges equivalence survives.
2. The literal continuous diagonal/off-diagonal decomposition is retracted.
3. The bare and normalized Volterra routes remain respectively refuted and
   RH-equivalent, as recorded elsewhere in the repository.
4. The arithmetic-block decomposition is exact but not positive term by term.
5. The next non-circular result is a certified finite-Gram computation with an
   analytic tail, followed by a search for a cross-block modular domination
   theorem.

This is a repaired research program, not a proof of RH.
