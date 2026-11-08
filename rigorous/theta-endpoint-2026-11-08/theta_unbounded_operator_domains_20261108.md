# Unbounded theta operators: exact domains and obstructions to a Friedrichs route

Research note, 8 November 2026. This constructs the natural operator behind the theta derivative energy in a positive ambient Hilbert space, before assuming any jet positivity. It proves an unconditional failure of symmetry and of every finite-angle sectorial estimate. It also gives an exact adjoint-domain characterization and explicit graph defects caused by hypothetical off-axis zeros. A separate positive self-adjoint ground-state operator is constructed, with its mismatch to the desired jet form made explicit.

No all-order positivity or proof of RH is obtained.

## 1. A densely defined operator on an ordinary positive Hilbert space

Let

\[
\mathscr H=L^2(0,\infty),\qquad
\mathcal D_\theta=\{P(D)\kappa:P\text{ is a complex polynomial}\},
\quad D=d/du.
\]

Define

\[
\boxed{\quad
T_0\bigl(P(D)\kappa\bigr)=P(D)(u\kappa).
\quad}
\tag{1.1}
\]

This is well-defined. If `P(D)kappa` vanished on the positive half-line, analytic continuation would make it vanish on the whole line. Its Fourier transform is `P(-it/2)F(it)`. Since the entire function `F` is nonzero almost everywhere on that line, the polynomial must vanish identically.

The domain is dense in `mathscr H`. To see this, if `h` is orthogonal to every derivative of `kappa`, the analytic scalar function obtained by pairing `h` with `kappa(u-z)` has every derivative zero at the origin. It vanishes on the connected strip `|Im z|<pi/2`, hence for every real translate. Extend `h` by zero to the negative half-line. Its convolution with `kappa` is then zero on the full line, so Fourier injectivity and `F(it)!=0` almost everywhere imply `h=0`.

With the inner product linear in the second argument, the previously derived jet form is exactly

\[
\boxed{\quad
Q(P)=2\alpha\operatorname{Re}
\langle P(D)\kappa,T_0P(D)\kappa\rangle_{\mathscr H}.
\quad}
\tag{1.2}
\]

Thus the requested arbitrary-order positivity is accretivity of this specific dense operator. Equation (1.1), its domain, and (1.2) make sense without that positivity assumption.

## 2. The natural operator is not symmetric

Take `f=kappa` and `g=kappa'`. Directly from (1.1),

\[
T_0\kappa=u\kappa,\qquad
T_0\kappa'=\kappa+u\kappa'.
\]

Therefore

\[
\boxed{\quad
\langle\kappa,T_0\kappa'\rangle
-\langle T_0\kappa,\kappa'\rangle
=\int_0^\infty\kappa(u)^2du>0.
\quad}
\tag{2.1}
\]

No symmetric operator can extend `T_0`. A Friedrichs extension of `T_0` itself is therefore unavailable. Taking the real part of its quadratic form is a different operation; proving that form positive and closable would require additional work.

## 3. A full-line skew-adjoint multiplier and its exact graph core

On `L^2(R)`, use

\[
\widehat f(t)=\int_{\mathbb R}f(u)e^{itu/2}du,
\qquad
R(z)=\frac{2F'(z)}{F(z)}.
\]

The measurable boundary function `R(it)` is purely imaginary away from its discrete poles. Hence

\[
\mathsf T=\mathcal F^{-1}M_{R(it)}\mathcal F,
\qquad
\operatorname{Dom}\mathsf T
=\{f\in L^2:R(it)\widehat f(t)\in L^2\},
\tag{3.1}
\]

is a closed skew-adjoint operator, unconditionally.

For every real `a`,

\[
\mathsf T\kappa(\cdot-a)
=(u-a)\kappa(u-a).
\tag{3.2}
\]

The finite span of these translated pairs is a graph core for `mathsf T`. Indeed, write `f_hat=F(it)g(t)`. The graph norm is the `L^2` norm of `g` for the finite measure

\[
d\mu(t)=\bigl(|F(it)|^2+4|F'(it)|^2\bigr)dt
\]

up to the common Fourier normalization. Translation corresponds to the exponential `e^(ita/2)`. These exponentials span a dense subspace of `L^2(mu)`: an orthogonal vector would give a finite measure `g dmu` whose Fourier transform vanishes identically, so that measure is zero.

There is also a half-line graph-span fact that does not assume closability of `T_0`. The Hilbert-valued curve

\[
z\longmapsto
\bigl(\kappa(u-z),(u-z)\kappa(u-z)\bigr)_{u>0}
\tag{3.3}
\]

is holomorphic on `|Im z|<pi/2`. Its derivatives at zero are, up to signs, precisely the generating graph pairs of `T_0`. Analytic uniqueness therefore shows that every translated pair (3.3) with real `z`, and every finite combination of them, belongs to the closure of the graph of `T_0` in `mathscr H` direct sum `mathscr H`.

## 4. Unconditional failure of every finite-angle sectorial estimate

### Theorem

There are no finite constants `M,omega >= 0` such that

\[
\boxed{\quad
|\operatorname{Im}\langle f,T_0f\rangle|
\le M\left(\operatorname{Re}\langle f,T_0f\rangle
+\omega\|f\|_2^2\right)
\qquad(f\in\mathcal D_\theta).
\quad}
\tag{4.1}
\]

Thus `T_0` is not sectorial with half-angle strictly smaller than `pi/2`, at any finite real vertex. This statement is independent of RH.

**Proof.** Suppose (4.1) held. It is continuous in the graph pair, so Section 3 extends it to every finite combination of translated theta graph features.

Let `f` be a full-line finite combination of translates of `kappa`, and write `g=mathsf T f`. Translate the pair far to the right, restricting it to the positive half-line:

\[
f_L(u)=f(u-L),\qquad g_L(u)=g(u-L),\qquad u>0.
\]

These are allowed graph-limit pairs. As `L` tends to infinity, their norms and inner products tend to the corresponding full-line quantities. The full-line real part is zero because `mathsf T` is skew-adjoint. Thus (4.1) implies

\[
|\operatorname{Im}\langle f,\mathsf T f\rangle|
\le M\omega\|f\|_2^2.
\tag{4.2}
\]

The graph-core result extends (4.2) to all of `Dom mathsf T`.

But `R(it)=iq(t)` has an unbounded real function `q(t)`. At any known critical-line zero `i gamma` of `F`, of multiplicity `m`,

\[
R(it)=\frac{2m}{i(t-\gamma)}+O(1).
\]

Choose a nonzero Fourier-supported test function on a small interval away from, but sufficiently close to, that zero, where `q` has one sign and magnitude greater than `M omega`. It belongs to the multiplier domain and contradicts (4.2). The existence of critical-line zeros is unconditional; no simplicity assumption is needed. This proves the theorem.

This rules out a standard closed sectorial-form construction for this particular operator. It does not rule out maximal accretive realizations with angle `pi/2`, boundary-relation constructions, or a different operator whose relation to the jet form is proved independently.

## 5. Exact adjoint domain and the off-axis graph defect

For `h` in the half-line Hilbert space, let `h_tilde` denote its extension by zero to the negative half-line. Then

\[
\boxed{\begin{aligned}
\operatorname{Dom}T_0^*
={}&\{h:\widetilde h\in\operatorname{Dom}\mathsf T,
\ \mathsf T\widetilde h\text{ is supported in }[0,\infty)\},\\
T_0^*h={}&-\left.\mathsf T\widetilde h\right|_{(0,\infty)}.
\end{aligned}}
\tag{5.1}
\]

**Proof.** If `T_0^*h=k`, pairing against every derivative of `kappa` and using the analytic curve (3.3) gives, for all real `z`,

\[
\int_0^\infty (u-z)\kappa(u-z)h(u)du
=\int_0^\infty\kappa(u-z)k(u)du.
\]

Since `kappa` is even and `u kappa` is odd, this is the full-line convolution identity

\[
-(u\kappa)*\widetilde h=\kappa*\widetilde k.
\]

Fourier transformation gives `R(it) h_tilde_hat=-k_tilde_hat`, proving the forward inclusion and action in (5.1). Conversely, the right side of (5.1), together with skew-adjointness of `mathsf T`, gives the required adjoint pairing against every theta derivative.

Now suppose `rho` is any zero of `F` with `Re rho<0`. For `h` in the adjoint domain, its half-line transform

\[
\mathcal Lh(z)=\int_0^\infty h(u)e^{zu/2}du
\]

and the transform of `k=T_0^*h` are analytic in `Re z<0`. Taking the absolutely convergent bilateral Laplace transform of the convolution identity yields

\[
F(z)\mathcal Lk(z)+2F'(z)\mathcal Lh(z)=0.
\tag{5.2}
\]

At a zero of multiplicity `m`, division by `(z-rho)^(m-1)` and evaluation gives

\[
\boxed{\mathcal Lh(\rho)=0.}
\tag{5.3}
\]

This is a bounded nonzero functional on the half-line `L^2` space. Its representing vector is

\[
e_\rho(u)=e^{\overline\rho u/2},\qquad
\|e_\rho\|_2^2=-\frac1{\operatorname{Re}\rho}.
\]

Consequently the adjoint domain is not dense. Equivalently, the closure of the graph of `T_0` has the explicit nonzero multivalued direction

\[
\boxed{(0,e_\rho)\in\overline{\operatorname{Graph}T_0}.}
\tag{5.4}
\]

In concrete terms, there are theta-derivative polynomials `f_n` with `f_n -> 0` in `L^2(0,infinity)` but `T_0 f_n -> e_rho` there. This conclusion follows from the general graph identity that its multivalued part equals `(Dom T_0^*)` orthogonal complement. It can equally be read directly from the graph annihilators above.

Only one evaluation condition per distinct zero is asserted: the logarithmic derivative has a simple pole even when the zero has higher multiplicity.

## 6. Why closability cannot be assumed at the start

For completeness, in this xi setting `T_0` is closable if and only if RH. The forward implication follows from (5.4) and the symmetry of the xi zeros.

The converse has a direct domain proof. Under RH, the zero product gives `Re R(z)<0` on `Re z<0`. Put `m(z)=-R(z)`, which is analytic there with nonnegative real part. For any Hardy function `H` on the left half-plane, define

\[
H_n(z)=\frac{n}{n+m(z)}H(z).
\]

The multiplier has modulus at most one, and `m H_n` is also Hardy since `|m/(n+m)|<=1`. Thus the inverse transforms of `H_n` belong to the domain (5.1). Boundary dominated convergence gives `H_n -> H` in the Hardy norm. The adjoint domain is dense, proving closability.

This equivalence is recorded as a domain audit, not as progress toward proving RH. It shows that postulating a closed realization extending (1.1) already assumes a substantive part of the goal. The explicit defect (5.4) describes what would go wrong if off-axis zeros existed.

Distinct parity closures alone do not establish nonclosability. For the Gaussian, the even and odd cores lead respectively to `-D/(2 beta)` on `H^1(0,infinity)` and on `H^1_0(0,infinity)`; one extends the other, and the combined polynomial operator is closable. This is why a parity-only incompatibility argument would be invalid.

## 7. A genuine unconditional positive self-adjoint operator, and its mismatch

There is nevertheless a natural positive operator made from the actual theta kernel. Define

\[
m_\kappa(u)=\frac{\kappa'(u)}{\kappa(u)},\qquad
Qf=f'-m_\kappa f,
\]

on the maximal first-order domain

\[
\operatorname{Dom}Q
=\{f\in L^2:f\in AC_{\rm loc}[0,\infty),\ Qf\in L^2\}.
\tag{7.1}
\]

This operator is closed: graph convergence gives the same differential identity in distributions, hence local absolute continuity of the limit. It is densely defined because it contains compactly supported smooth functions away from zero.

Its adjoint has differential expression `-D-m_kappa` and boundary condition `g(0)=0`. The boundary term at infinity vanishes: for vectors in the two maximal differential domains the derivative of `f conjugate(g)` is integrable, and its finite endpoint limit must be zero because the product is integrable.

Therefore

\[
\boxed{
L_N=Q^*Q=-D^2+\frac{\kappa''}{\kappa}\succeq0
}
\tag{7.2}
\]

is self-adjoint. Its natural boundary condition is `(Qf)(0)=0`, which is Neumann `f'(0)=0` because `m_kappa(0)=0`.

Restricting the closed form `||Qf||^2` to `f(0)=0` gives a second nonnegative self-adjoint realization `L_D` with Dirichlet boundary. The even theta derivatives belong to the Neumann realization; the odd derivatives belong to the Dirichlet realization. They generally cannot all be put in the same one of these domains.

The key mismatch is exact. The kernel itself obeys

\[
L_N\kappa=0.
\]

Thus its power-cyclic span under `L_N` is only `span{kappa}`, while its ordinary derivative span is dense in the half-line Hilbert space. If `V=kappa''/kappa`, the formal differential identity is

\[
\boxed{
(-D^2+V)\kappa^{(n)}
=-\sum_{j=1}^n\binom nj V^{(j)}\kappa^{(n-j)}.
}
\tag{7.3}
\]

It is an operator identity in the appropriate parity realization. In particular, `L_D kappa'=-V' kappa`; successive derivative features introduce all derivatives of the potential rather than powers of one positive operator applied to its ground state.

The same construction works for any smooth positive rapidly decaying kernel, including the previously certified strongly log-concave example whose odd jet block is negative. Therefore positivity of (7.2) cannot, on its own, establish positivity of the desired jet form (1.2). A further proven relationship between the two forms is necessary.

## 8. Outcome of this operator pass

The requested ambient construction is now explicit:

- The exact target operator `T_0` has a dense domain independent of any positivity assumption, and its real quadratic form is the theta jet form.
- It is unconditionally nonsymmetric and nonsectorial at every finite-angle vertex. Standard Friedrichs and sectorial-form shortcuts do not apply to it.
- Its adjoint domain is given by the concrete support condition (5.1). Hypothetical off-axis zeros produce the explicit multivalued graph modes (5.4).
- A separate nonnegative self-adjoint theta operator exists unconditionally, but its domains and cyclic structure do not encode the target derivative hierarchy.

No uniform commutator estimate or positive realization of the complete target jet has been obtained. The remaining path must control a genuinely unbounded, nonsymmetric boundary problem, or prove a new connection to a different positive operator.

## Sources

The operator calculations are derived in this note. The theta analytic-strip estimates and the relation of the kernel to `F(z)=xi(1/2+z)` are those established in the preceding notes.

The only zeta zero-location fact used in the unconditional nonsectorial theorem is the existence of critical-line zeros, not RH or simplicity. A reference is NIST DLMF, §25.10(i): https://dlmf.nist.gov/25.10 .
