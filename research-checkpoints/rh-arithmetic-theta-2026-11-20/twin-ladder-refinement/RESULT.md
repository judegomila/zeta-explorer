# Twin-ladder continuation: conclusions and proof architecture

Jude Gomila research checkpoint · 20 November 2026

## Status

**This checkpoint does not prove RH.** It contains proved identities and obstructions, literature comparisons, and explicit conditional interfaces. No arithmetic construction establishing the required positivity or square-root saving has been found here. Statements derived in these notes are new additions to this project checkpoint; historical novelty is not asserted.

The three original deliverables are preserved byte for byte in [release-v0.1](../release-v0.1/). These follow-up notes supplement that snapshot. They do not silently amend the manuscript or its evidence ledger.

## 1. Does the twin ladder matter?

It matters in two precise ways.

First, the actual prime-power Hamiltonian and weight operator are

\[
\mathsf A e_{p,m}=m\log p\,e_{p,m},\qquad
\mathsf D e_{p,m}=\log p\,e_{p,m}.
\]

Their finite-rank ramp trace is exactly the weighted prime expression in the arithmetic route:

\[
\boxed{
G_\zeta(X)=\operatorname{Tr}\!\left[\mathsf D(Xe^{-\mathsf A}-I)_+\right]
-X\log X+(1+\gamma_E)X.}
\]

The formula includes the centering, whose cancellation is the unresolved estimate. Positivity of the uncentered ramp trace supplies no bound on the centered error. The character version is also derived, with the ramified-prime operator correctly treated as a contraction.

Second, the completed reflection gives an exact analytic fold. Put

\[
F(z)=\xi(1/2+z),\quad F(z)=H(z^2),\quad
m(u)=H'(u)/H(u).
\]

Evenness makes \(H\) entire of order \(1/2\). For \(u_i=x_i^2\), the project's Pick matrix has the exact decomposition

\[
P=2(D_x A D_x+B),\quad
A(u,v)=-\frac{m(u)-m(v)}{u-v},\quad
B(u,v)=\frac{um(u)-vm(v)}{u-v}.
\]

Under RH, these are positive resolvent Gram kernels. Unconditionally, an off-axis zero quartet folds to a pair of nonreal poles and contributes an indefinite rank-two kernel. The fold organizes the reflection and its obstruction; it does not remove the obstruction.

The prime ladder and the completed reflection have different roles. An analytic functional equation does not by itself define a unitary interchange of individual prime-power rungs. A future construction must specify any such operator and prove its arithmetic compatibility.

Proofs: [RAMP_AND_AVERAGING.md](RAMP_AND_AVERAGING.md), Proposition 1; [FOLDED_HEAT_ROUTE.md](FOLDED_HEAT_ROUTE.md), Propositions 1–2 and equation (8).

## 2. How significant were the earlier reductions?

The exact identification of the project's residual with the intended Weil form is useful: it verifies the target, its signs and its completion terms, and connects the residual recursion to an established criterion. Broad Weil–screw equivalence already appears explicitly in Suzuki's Proposition 3.1, equation (3.8). Half-plane logarithmic-derivative positivity and matrix criteria have earlier Hinkkanen/Lagarias precedents. This project should claim its exact specialization, normalization, and finite-order work only to the extent that those are proved; their originality requires a separate comparison.

The function-field investigation located a valid growth target. The classical function-field mechanism supplies an actual auxiliary object with high vanishing multiplicity and a sufficiently small pole cost. Merely isolating a number-field estimate with the desired RH consequence does not transplant that construction. The companion literature note proves the exact resolvent identity

\[
\int_0^\infty e^{-st}R_a(t)\,dt
=\frac{L(s)-(s/a)L(a)}{a^2-s^2},\qquad \Re s>1/2,
\]

where \(L=F'/F\), \(a>1/2\), and \(R_a(t)=\sum_\rho e^{\rho t}/(a^2-\rho^2)\). For this one fixed \(a\), subexponential growth of \(R_a\) is equivalent to RH. The argument supplies no independent subexponential estimate.

The audited six-node result is a finite-order theorem on its stated domain. It must not be described merely as checking a numerical sample, but it also does not establish arbitrary depth. The metaplectic and rank-two investigations isolate concrete norm and second-moment problems; the existing eigenrelations and row cancellations do not solve those problems.

Details and source pins: [LITERATURE_AND_SIGNIFICANCE.md](LITERATURE_AND_SIGNIFICANCE.md) and Section 6 of [RAMP_AND_AVERAGING.md](RAMP_AND_AVERAGING.md).

## 3. Concrete results of this continuation

### Exact arithmetic heat formula and its correct positivity requirement

The folded zero sum

\[
\mathcal T(t)=\sum_{\{\rho,-\rho\}}e^{\rho^2t},\qquad t>0,
\]

is defined without RH. It is the inverse Laplace transform of \(m(u)\), initially for \(u>1/4\). The heat note gives its full prime-power, gamma, pole, and constant formula, with absolute convergence and an explicit fixed-time prime-tail bound.

RH is equivalent to complete monotonicity of this heat trace: \((-1)^k\mathcal T^{(k)}(t)\ge0\) for every nonnegative integer \(k\) and every \(t>0\). The squared-variable and complete-monotonicity approach has prior literature, including Zhang; no new general criterion is claimed. A worked polynomial countercontrol shows why positivity of the heat trace alone, or complete monotonicity of \(m\) alone, is insufficient for the analogous zero-location conclusion.

### The order of cutoff limits is essential

Keep the full completion terms, but truncate the prime sum at a fixed finite \(X\). Then the resulting heat trace satisfies

\[
\mathcal T_X(t)=e^{t/4}+O_X(t^{-1/2})\quad(t\to\infty).
\]

It therefore cannot be completely monotone. For the manuscript's fixed sequence of real test rates, the corresponding Pick matrices satisfy the unconditional obstruction

\[
\boxed{\forall X<\infty\quad\exists n:\quad P_{X,n}\not\succeq0.}
\]

The proof uses the uncancelled pole of the truncated logarithmic derivative at \(z=1/2\), classical finite interpolation, and the identity theorem. This does not invalidate convergence for each fixed \(n\) as \(X\to\infty\). It rules out using one uncorrected finite-prime cutoff for every test size.

### Averaging gives a dimension factor only under the correct quantifiers

On a finite space of dimension \(D\), complete shift-and-phase averaging gives

\[
\mathbb E_W\|A^*WB\|_{\rm HS}^2
=\frac{\|A\|_{\rm HS}^2\|B\|_{\rm HS}^2}{D}.
\]

For isometric maps this is \(d_A d_B/D\), the scale sought in the source correlation condition. A selected relative word can violate the averaged bound. The actual arithmetic comparison must consequently hold for every required pair, or include a proved selection argument and all of its losses. The source maps have not been identified with this averaging model.

Two fixed unitary involutions on a complex space of dimension greater than two retain a nonzero traceless fixed operator under all generated conjugation averages. Pure two-leg parity therefore cannot supply global depolarizing mixing. This is a standard finite-dimensional fact with a narrow, explicit scope.

### Strong mixing has an energy cost

For a random-unitary channel contracting all traceless Hermitian operators by at most \(\delta<1\),

\[
\mathbb E\|[\mathsf A,U]\|_{\rm HS}^2
\ge2(1-\delta)
\left\|\mathsf A-\frac{\operatorname{Tr}\mathsf A}{D}I\right\|_{\rm HS}^2.
\]

The constant is sharp. Exact preservation of the finite simple-spectrum prime Hamiltonian instead forces the averaging unitaries to commute with it. Simultaneously moving the Hamiltonian and its weights preserves scalar traces and is outside that obstruction; a useful arithmetic construction must account for how its relative maps and observables are transported. Narrow spectral blocks reduce the variance cost but leave block observables unmixed.

Proof: [ENERGY_MIXING_TRADEOFF.md](ENERGY_MIXING_TRADEOFF.md).

## 4. Recommended proof architecture

Use the original manuscript's exact arithmetic form and fixed-sequence completion theorem as the principal analytic interface. For each fixed number \(n\) of tests, an independently constructed positive Gram form which bounds the actual arithmetic form from below up to an error \(\varepsilon_{X,n}\|b\|^2\), with \(\varepsilon_{X,n}\to0\), is sufficient. A bound uniform in \(n\), an a priori spectral gap, and one prime cutoff serving every \(n\) are not required.

The alternative growth route must prove its actual arithmetic construction and complete cost estimate. Section 9, **OPEN_THEOREM**, in the ramp note specifies one candidate mechanism: arithmetic relative maps, a comparison with their averaged cross moments for every required pair, quantified contraction with all errors allocated, the diagonal and ambient-dimension conditions, and a separate extraction of the centered ramp bound. None of those arithmetic existence or saving assertions follows from the abstract finite-dimensional averaging identity.

The fold, heat formula, parity analysis, and mixing tradeoff can serve as supporting propositions and controls. Incorporating every historical representation into the main implication would not strengthen it. The release can retain the complete evidence inventory while presenting one clear conditional route and recording alternative approaches separately.

There is presently no evidence that the arithmetic step has become routine, or that this approach yields a shorter completed proof than the external announced route. A meaningful comparison of completed proofs would require both a valid arithmetic completion here and a fully checked exposition of the external argument.

## 5. Review and reproduction

The general analytic and matrix statements are proved in the companion notes. Exact symbolic scripts check selected algebraic identities and countercontrols. They are not formal verification of the analytic arguments, the external proof, all historical repository claims, or RH.

See [REVIEW.md](REVIEW.md) for the scope of internal review and reproduction commands. The original inventory covers accessible repository and manuscript sources; it does not certify that every past chat or every historical proof was re-read.
