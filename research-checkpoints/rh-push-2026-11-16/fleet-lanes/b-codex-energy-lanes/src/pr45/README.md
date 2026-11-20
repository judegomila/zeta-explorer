# Theta energy at arbitrary derivative order

Research continuation, **8 November 2026**, following
[PR #44](https://github.com/[user]/mathexplorer/pull/44).
This checkpoint gives exact formulas for the entire derivative hierarchy,
an analytic energy inequality for an actual theta derivative pulse, and
rigorous obstructions to three proposed shortcuts.

**The general zero-leakage and exponential-energy estimate remains open.**
No RH proof or novelty claim is made. The formulas below do not promote the
previous finite certificates to positivity at every order.

## The actual equation and the target

Use the normalization

\[
F(z)=\xi(1/2+z)=\int_{\mathbb R}\kappa(u)e^{zu/2}\,du,
\qquad
\kappa(u)=(\partial_u^2-1/16)[e^{u/4}\theta(e^u)],
\]

where \(\theta(t)=\sum_{n\in\mathbb Z}e^{-\pi n^2t}\). For \(\alpha>0\), set

\[
h_\pm(u)=(1\pm\alpha u/2)\kappa(u),\qquad
A=h_+*,\quad A^*=h_-*,\quad
S(z)=\frac{F(z)-\alpha F'(z)}{F(z)+\alpha F'(z)}.
\]

The actual unitary boundary response is
\(\widehat{C_0f}(t)=S(it)\widehat f(t)\), with
\(\widehat f(t)=\int f(u)e^{itu/2}\,du\). It solves

\[
h_+*g=h_-*f,\qquad g=C_0f.
\]

For \(Q_c=1_{(c,\infty)}\), the exact cutoff identity on theta features is

\[
\|Q_cA^*a\|_2^2-\|Q_cAa\|_2^2
=-\langle a,\mathcal H_ca\rangle,
\]

\[
H_c(u,v)=\alpha\int_c^\infty
(2r-u-v)\kappa(r-u)\kappa(r-v)\,dr.
\]

The outstanding task is positivity of the full kernel, or a sufficiently
strong estimate on the actual signed pulse preimages. The previous
[analytic-localization proof](https://github.com/[user]/mathexplorer/blob/a89222f2d069f24690b2f62904d5049e9ff676ed/rigorous/theta-propagation-2026-11-08/theta_flux_analytic_localization_20261108.md)
shows why every derivative order at one point is already the global task.

## Results in this checkpoint

| Result | What it establishes | Proof and evidence |
|---|---|---|
| Exact formulas at every derivative order | Both parity blocks are determined by derivative energies and even boundary derivatives | [All-order structure](theta_all_order_jet_structure_20261108.md) |
| Analytic derivative-pulse energy law | The first odd energy is a positive squared norm for the actual theta kernel | [Commutator and positive factor](theta_jet_commutator_20261108.md) |
| No bounded boundary-trace estimate | A uniform bounded trace repair contradicts the actual theta tail | [Trace theorem, Section 7](theta_all_order_jet_structure_20261108.md) |
| Concavity is insufficient for all orders | A fixed rational derivative combination has rigorously negative energy in a strictly concave auxiliary kernel; an analytic deformation retains the failure with superexponential decay | [Counterexample and deformation](theta_jet_commutator_20261108.md) |
| A Gaussian cannot have a positive exact theta preimage | For \(\alpha=1\), no nonnegative \(L^2\) function or finite positive measure maps to a nonzero positive Gaussian under \(A\) | [Gaussian obstruction](theta_gaussian_probe_obstruction_20261108.md) |
| A Gaussian is still a valid weighted probe | Its zero-free transform preserves the RH-equivalent weighted target; smoothing does not prove that target | [Gaussian criterion](theta_gaussian_probe_obstruction_20261108.md) |

## The two derivative ladders and their exact bridge

Let \(J_{mn}=\partial_u^m\partial_v^nH_0(0,0)\), and define

\[
a_p=(-1)^p\kappa^{(2p)}(0),\qquad
I_j=\int_0^\infty u(\kappa^{(j)}(u))^2\,du,
\]

\[
E_{pq}=\frac{(-1)^{p+q}}\alpha J_{2p,2q},\qquad
O_{pq}=\frac{(-1)^{p+q}}\alpha J_{2p+1,2q+1}.
\]

The even and odd derivative sequences give a precise algebraic version of
the two ladders. Their connection is

\[
\boxed{O_{pq}=E_{p,q+1}-(2q+1)a_pa_q.}
\]

Every even entry has the closed expression

\[
E_{pq}=2I_{p+q}+
\sum_{j=\min(p,q)}^{\max(p,q)-1}
|p+q-1-2j|\,a_j a_{p+q-1-j}.
\]

This is an exact recurrence and finite sum at every order. It does not
identify the derivative ladders with geometric spinor sections, nor supply
a positive completed Hilbert space. In fact, there is no finite constant
\(C\) satisfying

\[
\left|\sum_p c_pa_p\right|^2
\le C\sum_{p,q}\overline{c_p}E_{pq}c_q
\]

for all finite vectors. Any operator construction using that boundary trace
must therefore treat an unbounded trace and its domain explicitly.

## A positive energy law and the precise higher-order remainder

For \(b=-u\kappa/\kappa'\), smoothly extended at zero, and
\(f=P(\partial_u)\kappa\), the exact jet energy is

\[
\boxed{
Q(P)=\alpha b(0)|f(0)|^2
+\alpha\int_0^\infty b'|f|^2
-2\alpha\operatorname{Re}\int_0^\infty
\overline f\,[P(\partial_u),b]\kappa'.
}
\]

The known squared-variable concavity gives \(b'\le0\). For
\(P(\partial_u)=\partial_u\), the commutator combines with the bulk term
to give

\[
J_{11}=\alpha\|\sqrt{-b'}\,\kappa'\|_2^2>0.
\]

Thus the actual input \(f=h_+'\) and response \(g=h_-'=C_0f\) satisfy

\[
\int_0^\infty(|f|^2-|g|^2)\,du
=\alpha\|\sqrt{-b'}\,\kappa'\|_2^2>0.
\]

This is an analytic cutoff-energy contraction for a specific theta
derivative pulse. At higher degree the commutator contains
\(b'',b''',\ldots\), and its combined sign remains unproved.

The auxiliary kernel \(e^{-u^2}(3/2+\cosh u)\) satisfies both strict
ordinary log concavity and strict concavity after the square-root change
of variable. Nevertheless its exact energy at
\(P=\partial_u+\partial_u^3/5\) lies in

\[
[-0.000164464720150575,\,-0.000164464720150574].
\]

An explicit family of superexponentially decaying perturbations retains
both concavity properties and this negative direction for all sufficiently
small positive perturbations. That last statement is an analytic
continuity theorem, not a certificate for a specified numerical parameter.

## Why smoothing the input does not supply a positive preimage

For \(\alpha=1\), an interval/Rouche certificate locates exactly one zero
of \(D=F+F'\) in

\[
|z-(-0.74626947+14.61606607i)|<0.001.
\]

It also proves \(D(-1)>0.48526023\), which implies \(D(x)>0\) for every
real \(x\ge-1\). Positivity of a hypothetical preimage then forces actual
Laplace integral convergence through the certified complex zero. The
equation \(D M=V\) would make the zero-free Gaussian transform \(V\)
vanish there, a contradiction.

This is a zero of the denominator \(F+F'\) in the left half-plane. It is
not an asserted off-line xi zero, and the result is compatible with RH.
The proof excludes exact nonnegative preimages. It does not exclude signed
preimages or uncontrolled approximate sequences.

## Reproduce and review

Using Python 3.12 and `mpmath==1.3.0`:

```bash
python -m pip install -r requirements.txt
python theta_jet_concavity_obstruction_20261108.py
python theta_gaussian_preimage_obstruction_certificate_20261108.py
```

The first certificate reduces the integrals to exact rational Gaussian
moments and an explicitly bounded alternating series for erf. The second
uses interval theta sums, analytic Simpson and spatial-tail bounds, and
Rouche's theorem. Their captured replays, the denominator JSON output,
`AUDIT.md`, `validation.json`, and `MANIFEST.json` accompany the proofs.

The interval computations depend on the numerical backend's outward
rounding; they are not proof-assistant formalizations. Repository CI checks
are separate from the mathematical certificate replays.

## Remaining obligation

A successful continuation must control the full bulk-plus-commutator
expression uniformly over polynomial degree and coefficients using
additional theta-specific structure, or control the actual signed
regularized pulse energy in the limit. No such estimate is established
here. The positive derivative-pulse result and the three obstructions
specify what this continuation proves and which routes it rules out.
