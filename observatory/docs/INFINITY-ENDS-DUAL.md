# Infinity ends, positive display damping, and the dual conormal

These views expose spectral infinity without assigning the original field a value there. They separate the elliptic curve and its tangent hyperplanes, which are regular at the spectral punctures, from the pulled-back completed function, which is essential there.

| View | Entry URL | Meaning |
| --- | --- | --- |
| Infinity end | [?view=infinityEnd](https://zeta-view.vercel.app/?view=infinityEnd) | A local coordinate around the spectral puncture and its exact Klein partner. |
| Fixed strip ends | [?view=stripEnds](https://zeta-view.vercel.app/?view=stripEnds) | The two large-height ends with the real spectral offset retained. |
| Damped Klein display | [?view=smoothKlein](https://zeta-view.vercel.app/?view=smoothKlein) | A positive Gaussian display weight on the existing completed field. |
| Dual conormal | [?view=dualTwistor](https://zeta-view.vercel.app/?view=dualTwistor) | The projective family of tangent hyperplanes to the elliptic curve, including at its spectral punctures. |

The formulas below derive the geometry and its limits. Finite numerical evaluation and quadrature are diagnostics, not global error or tail certificates.

## 1. A coordinate at the actual spectral infinity

Retain the existing elliptic cover and lens:

\[
E_r:\quad \eta^2=(w^2+r^2)(w^2+r^{-2}),\qquad r>1,
\]

\[
u_s=s-\tfrac12=L\left(\frac1{1-w}-\frac12\right),\qquad L>0.
\]

The local coordinate at either spectral puncture is

\[
\boxed{q=1-w=\frac{L}{u_s+L/2},\qquad
u_s=L\left(\frac1q-\frac12\right).}
\]

The two points are \(p_\pm=(1,\pm(r+r^{-1}))\). They are ordinary smooth points of the curve, since neither is a branch point of the \(w\)-projection. Consequently \(q\) is a valid local holomorphic coordinate on each sheet. The point \(w=\infty\) is different: it maps to the finite spectral coordinate \(s=\tfrac12-L/2\).

The implemented polar end chart \(q=e^{-\tau+i\theta}\) resolves directions approaching \(q=0\), with \(\tau\to+\infty\). Here \(\tau\) is an end coordinate, not the heat parameter. Its finite points map to the original \(s\)-plane; it does not turn a finite evaluator cutoff into a value at infinity. Points outside the evaluator's operating window remain explicitly unavailable.

The separate sheet cylinders use the branch-free neighborhood \(|q|\le1\), or \(\tau\ge0\). The nearest branch values have \(|q|=\sqrt{1+r^{-2}}>1\). Extending a sheet cylinder through those branch values would require actual sheet continuation; two independently labelled copies of the \(q\)-plane would no longer be local coordinate neighborhoods. A Klein partner can lie outside a chosen finite end window, which is reported as a chart-coverage issue.

### Exact conjugating identification

The Klein involution is

\[
A(w,\eta)=\left(\frac1{\bar w},-\frac{\bar\eta}{\bar w^2}\right).
\]

In the end coordinate it is exactly

\[
\boxed{q_A=-\frac{\bar q}{1-\bar q},\qquad
u_s(Ap)=-\overline{u_s(p)}.}
\]

Thus \(x=\Re(s-\tfrac12)\) changes to \(-x\), while \(t=\Im s\) is unchanged. The corresponding polar formulas are

\[
\tau_A=\tau+\log|1-\bar q|,\qquad
\theta_A=\arg\left(-\frac{\bar q}{1-\bar q}\right).
\]

Only asymptotically is this the angular reflection \(\theta\mapsto\pi-\theta\). Using that approximation as an exact seam would change the quotient.

For the completed field \(F=\xi\), or its symmetric heat family,
\[
F(1-\bar s)=\overline{F(s)}.
\]
Magnitude is invariant and the local complex representative is conjugated. The two infinity lifts therefore give one puncture on the Klein quotient. A phase angle has no assigned value at that puncture. The same simple conjugating scalar rule does not hold for raw \(\zeta\).

## 2. Fixed strip ends retain the transverse offset

A limiting direction in the \(q\)-plane loses the information needed to distinguish fixed values of \(x=\sigma-\tfrac12\): all fixed-width vertical strips approach the same two directions as \(t\to\pm\infty\). The strip-end view therefore keeps \(x\) as an independent coordinate and displays the same samples in two height charts:

\[
\rho=\log|t|,\qquad y=1/t.
\]

The sign of \(t\) distinguishes the lower and upper ends. For example a logarithmic parameterization is
\[
s=\tfrac12+x+i\varepsilon e^\rho,\qquad \varepsilon\in\{-1,+1\}.
\]
Klein reflection sends \((x,\rho,\varepsilon)\) to \((-x,\rho,\varepsilon)\); it does not exchange the two ends. A display of \(-a\le x\le a\) retains the two sides of the strip and its critical line \(x=0\). The reciprocal-height endpoint \(y=0\) is a boundary marker, not an evaluated sample.

In the logarithmic chart the metric and area element are

\[
|ds|^2=dx^2+t^2d\rho^2,\qquad dA=|t|\,dx\,d\rho.
\]

Thus a complex-field Dirichlet energy on a finite strip-end rectangle is

\[
\mathcal E(F)=\frac12\int
\left(|t|\,|F_x|^2+\frac{|F_\rho|^2}{|t|}\right)\,dx\,d\rho.
\]

For holomorphic \(F\), \(F_x=F'(s)\), \(F_\rho=itF'(s)\), so this becomes \(\int |t|\,|F'(s)|^2dx\,d\rho\). Integrating the unweighted screen-pixel gradient would give a different quantity.

At a finite height cutoff, the boundary includes the transverse sides and the end caps. For either real harmonic component \(H\),

\[
\int_\Omega|\nabla H|^2\,dA
=\int_{\partial\Omega}H\,\partial_nH\,d\ell.
\]

The outward signs on \(x=a\) and \(x=-a\) are opposite; the upper and lower height caps also have opposite signs. A cutoff diagnostic must retain all these terms, or state the subset it measures. The panel's normalized finite-boundary flux is a sampled diagnostic. A sampled tail, cap flux, or stabilization as the cutoff grows is not a bound on the omitted infinite tail.

## 3. Why the original field cannot be filled in at the puncture

The completed function is entire and nonpolynomial. One direct check of the latter uses its defining gamma factor and Stirling's formula on the positive real axis: its growth is faster than every polynomial. Since \(s=L/q+(1-L)/2\), the Laurent expansion of

\[
f(q)=\xi\left(\frac{L}{q}+\frac{1-L}{2}\right)
\]

at \(q=0\) has infinitely many negative powers. It is an essential singularity. Changing coordinates, taking the geometric dual, or using a smooth drawing of the Klein bottle does not remove it.

There is also an energy obstruction. For a Laurent series \(f(q)=\sum_n a_nq^n\), angular orthogonality on an annulus gives

\[
\int_{\epsilon<|q|<b}|f'(q)|^2\,dA
=2\pi\sum_n n^2|a_n|^2
\int_\epsilon^b r^{2n-1}\,dr.
\]

Every nonzero negative-power coefficient forces divergence as \(\epsilon\downarrow0\). The full unweighted analytic-field Dirichlet energy near this puncture is therefore infinite. A finite strip can have different asymptotic behavior from a complete punctured neighborhood; a display of that strip cannot establish regularity in every direction.

This is compatible with the previous annulus calculation: the real and imaginary Dirichlet energy densities of a holomorphic field agree pointwise. Their difference is zero. They are not the signed bridge forms \(E_+-E_-\), whose parity exchanges spectral heights rather than reflecting the real offset. The full signed theta correlation, its coupling terms, and all associated tails remain the original research problem.

## 4. Positive Gaussian damping has a precise display scope

For a positive scale \(S\), define

\[
h_S(s)=\exp\left(-\frac{|s-\tfrac12|^2}{S^2}\right),\qquad
\widetilde F=h_SF.
\]

At every finite \(s\), \(h_S>0\). Consequently the finite zero locations, local orders of vanishing, and phase away from zeros are unchanged. The weight is invariant under \(s\mapsto1-\bar s\), so the completed field still obeys the conjugating Klein seam. The default display scale is \(S=120\).

In particular \(\operatorname{Im}(d\widetilde F/\widetilde F)=\operatorname{Im}(dF/F)\) wherever the field is nonzero. Damping the amplitude does not suppress the phase current or remove its zero singularities; the renderer fades the color as amplitude vanishes.

The price is explicit:

\[
\partial_{\bar s}\widetilde F
=-\frac{s-\tfrac12}{S^2}\widetilde F,
\]

which is generally nonzero. The weighted field is not holomorphic. Its derivatives, harmonicity, Dirichlet energy, and modulus balance are different. In particular,

\[
\partial_\sigma\log|\widetilde F|
=\partial_\sigma\log|F|-\frac{2(\sigma-\tfrac12)}{S^2}.
\]

The damped display must never supply derivatives, shifted-pair bridge values, Gram matrices, zero evolution, or positivity diagnostics for the original field.

### A genuine smooth extension for the weighted xi display

For \(\xi\), the Gaussian dominates its growth in every complex direction. This can be established without an RH assumption. The theta integral in DLMF 25.5.13–14 gives

\[
\xi(s)=\frac12+\frac{s(s-1)}2
\int_1^\infty
\left(v^{s/2}+v^{(1-s)/2}\right)
\frac{\omega(v)}v\,dv,\qquad
\omega(v)=\sum_{n\ge1}e^{-\pi n^2v}.
\]

For \(v\ge1\), \(\omega(v)\le Ce^{-\pi v}\). Taking \(|s|\le R\) bounds the integral by a gamma integral and yields \(\log^+|\xi(s)|=O(R\log(R+2))\). Cauchy's estimate gives the corresponding bound for every fixed derivative order. Near \(q=0\), all real derivatives of \(h_S(s(q))\xi(s(q))\) are bounded by expressions of the form

\[
C|q|^{-N}\exp\left[
-\frac{c}{|q|^2}
+\frac{C'}{|q|}\log\frac1{|q|}
\right],
\]

which tend to zero. Setting the weighted field to zero at each puncture therefore gives a \(C^\infty\), flat extension. It is a smooth extension of the **weighted display**, not an analytic continuation of \(\xi\). The added zero at infinity is a visualization artifact and receives no phase or finite-zero marker.

For a generic analytic control, this conclusion requires a suitable growth bound. The heat mode's finite damped rendering does not by itself certify such a global bound. Raw \(\zeta\)'s finite pole is also not removed by a positive weight.

The main renderer uses **displayDamping** and **displayDampingScale**; the end panel uses its local **infinityDisplay** and **infinityDampingScale** controls. The mathematical sample arrays, cache identities, raw inspected values, and research calculations retain the original field. Finite masks and the geometric puncture remain visible even when the displayed amplitude fades.

## 5. The dual object is a family of tangent hyperplanes

Write the elliptic curve as the intersection

\[
Q_1=X_1^2-X_0X_2=0,\qquad
Q_2=X_3^2-X_0^2-cX_1^2-X_2^2=0,\qquad c=r^2+r^{-2}.
\]

At a smooth point \(Z\), its two independent gradient covectors are

\[
N_1=(-Z_2,2Z_1,-Z_0,0),\qquad
N_2=(-2Z_0,-2cZ_1,-2Z_2,2Z_3).
\]

Every hyperplane containing the projective tangent line is represented by

\[
\boxed{[W]=[\lambda N_1+\mu N_2]\in(\mathbb{CP}^3)^*,
\qquad[\lambda:\mu]\in\mathbb{CP}^1.}
\]

Euler's homogeneous identity gives \(N_j\cdot Z=2Q_j(Z)=0\). A tangent representative \(T\) satisfies \(N_1\cdot T=N_2\cdot T=0\), so

\[
W\cdot Z=0,\qquad W\cdot T=0.
\]

These are **complex bilinear** incidence equations; inserting complex conjugation changes the hyperplane. A Hermitian condition such as \(\bar Z\cdot T=0\) is used only to choose a convenient horizontal representative of the projective tangent.

The curve supplies this \(\mathbb{CP}^1\) conormal family, not one canonical normal. The controls use the written quadric basis and
\[
\lambda=\cos(\theta/2),\qquad
\mu=e^{i\phi}\sin(\theta/2).
\]
Changing the basis of the two quadric equations changes these family coordinates. Normalizing \(Z\) and fixing a local phase selects display representatives; it does not add intrinsic geometric structure.

The source sphere, family sphere, and complex-coordinate dials display \(Z\), \([\lambda:\mu]\), and \(W\). They do not claim to embed a complex projective hyperplane as an ordinary plane in three-dimensional space. The geometry can be inspected at the selected point, infinity, anti-bridge, a branch point, and reciprocal-chart infinity without evaluating \(\xi\) at an undefined spectral location. Sheet selection is applied before deriving the conormal.

Calling the preset **dualTwistor** follows the app's existing twistor workbench. The construction here is the projective conormal incidence correspondence. A Penrose dual-twistor or spacetime interpretation needs additional structure; the conormal equations alone do not choose it. The dual does not inherit a new scalar \(\xi\)-field or remove its spectral singularities.

## 6. Verification and sources

The useful checks are exact coordinate round trips, the nonlinear conjugating seam, sheet pairing, fixed real offset at increasing height, finite-cutoff accounting, and conormal incidence. At every anchor, report numerical residuals rather than silently snapping a point onto a quadric or declaring a global theorem.

The local-coordinate, metric, Laurent-energy, damping, and conormal formulas are derived above. The following primary definitions and app conventions fix their inputs:

- [NIST DLMF 25.4.3–4](https://dlmf.nist.gov/25.4): the completed function and its functional equation.
- [NIST DLMF 25.5.13–14](https://dlmf.nist.gov/25.5): the theta integral used for the growth estimate.
- [NIST DLMF 5.11.3](https://dlmf.nist.gov/5.11): Stirling's gamma asymptotic.
- [Klein and annulus conventions](KLEIN-ANNULUS.md): the quotient, seam derivatives, original energy identities, and remaining bridge target.
- [Spinor and twistor conventions](SPINORS-TWISTORS.md): the chosen Hermitian and quaternionic structures of the separate existing twistor view.
