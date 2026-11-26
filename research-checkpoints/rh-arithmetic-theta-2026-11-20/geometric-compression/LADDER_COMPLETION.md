# Exact completion cost, the rank-one converse, and the window boundary

## Status and scope

This note supplies independently checkable mathematical consequences of the existing manuscripts. It does **not** establish RH, certify the external Lean dependency graph, or claim literature novelty for elementary determinant, interpolation, or Landau arguments. The new work here is an exact diagnosis of the proposed completion target, a quantified bridge that would be sufficient, and an explicit obstruction to an invalid shortcut.

Project inputs inspected:

- `research-checkpoints/rh-arithmetic-theta-2026-11-20/geometric-compression/RH_Geometric_Compression.tex`.
- `research-checkpoints/rh-arithmetic-theta-2026-11-20/release-v0.1/RH_Arithmetic_Theta_Completion.tex`, especially the prime-ramp Mellin transform, full-ray Landau implication, sparse Pick criterion, and asymptotic Gram transfer.
- `research-checkpoints/rh-arithmetic-theta-2026-11-20/twin-ladder-refinement/RAMP_AND_AVERAGING.md`.

External source statements below were inspected in `leanprover-community/riemann-hypothesis` at commit `c6fe94ff45b0f01acc60c13ebcbd54880f41b3c2`. Source inspection is distinct from compilation and kernel replay. The current Main endpoint is a multiplicative-window route; the separately present full-ray growth modules must not be described as its observed dependency path without additional tracing.

## 1. Exact complete cost and its irreducible part

Let \(L\) be a Euclidean lattice of positive rank \(r\), let \(M\) be a Euclidean lattice, and let \(T:L\to M\) be an injective integral map. Put

\[
 W=\operatorname{span}_{\mathbb R}T(L),\qquad
 N=M\cap W,\qquad I=[N:T(L)].
\]

The covolume of \(L\) is measured in its source metric; that of \(N\) uses the metric induced on \(W\). Let \(s_1,\ldots,s_r>0\) be the singular values of the induced real map. Define the complete Hilbert–Schmidt upper cost

\[
 \mathcal C(T)=
 \log\frac{\operatorname{covol}L}{\operatorname{covol}N}
 +\frac r2\log\left(\frac{\|T\|_{\mathrm{HS}}^2}{r}\right).
\]

### Theorem 1: exact slack identity

\[
 \boxed{\quad
 \mathcal C(T)=\log I+
 \frac r2\log\frac{r^{-1}\sum_{j=1}^r s_j^2}
 {(\prod_{j=1}^r s_j^2)^{1/r}}
 \quad}
\]

In particular, \(\mathcal C(T)\ge\log I\). Equality holds exactly when all \(s_j\) are equal, including every rank-one case.

**Proof.** The volume of the image of a source fundamental parallelepiped is both \(\operatorname{covol}L\prod_j s_j\) and \(I\operatorname{covol}N\). Hence

\[
 \log\frac{\operatorname{covol}L}{\operatorname{covol}N}
 =\log I-\frac12\sum_j\log(s_j^2).
\]

Substitute \(\|T\|_{\mathrm{HS}}^2=\sum_j s_j^2\). The inequality and equality condition are the arithmetic–geometric mean inequality. ∎

The second term is the precise cost of unequal singular values. It is not a missing arithmetic cancellation term. A more isotropic realization can remove that slack but cannot reduce the index cost.

### Theorem 2: exact minimum over unrestricted lattice realizations

For each integer \(Q\ge1\),

\[
 \boxed{\quad
 \min_{\substack{r\ge1,\ L,M,T\text{ as above}\\ I\ge Q}}
 \mathcal C(T)=\log Q.
 \quad}
\]

**Proof.** Theorem 1 gives the lower bound \(\mathcal C(T)\ge\log I\ge\log Q\). Take \(L=M=\mathbb Z\) with the standard metric and \(T(n)=Qn\). Then \(N=\mathbb Z\), \(I=Q\), both covolumes are one, and \(\|T\|_{\mathrm{HS}}=Q\); therefore \(\mathcal C(T)=\log Q\). ∎

This is a minimum, not only an infimum. It holds when the rank is free. If an independent arithmetic construction requires a prescribed rank, representation, conductor, local structure, or specific theta maps, those additional restrictions may be substantial. They must be included in the statement: existence of an arbitrary integral map alone does not express them.

If arbitrary metrics remain available, the same minimum is attained at each fixed positive rank: take \(T=\operatorname{diag}(Q,1,\ldots,1)\), standard target metric, and pullback source metric \(T^*T\). A rank restriction by itself therefore does not remove this reformulation.

## 2. Exactly which metric costs are invariant

Two different quantities should not be called invariant without qualification.

The determinant cost is exactly

\[
 \log\frac{\operatorname{covol}L}{\operatorname{covol}N}
 +\tfrac12\log\det(T^*T)=\log I.
\]

It is unchanged by **arbitrary** choices of positive source and target metrics, since the underlying lattice index is unchanged.

The Hilbert–Schmidt upper cost \(\mathcal C(T)\) is unchanged by **uniform source or target rescaling**. For example, scaling source lengths by \(a>0\) multiplies the source covolume by \(a^r\) and divides \(\|T\|_{\mathrm{HS}}^2\) by \(a^2\), so the changes cancel. The same calculation applies to uniform target rescaling.

However, \(\mathcal C(T)\) is **not** invariant under general anisotropic metric changes. For

\[
 T=\begin{pmatrix}2&0\\0&1\end{pmatrix},\qquad L=M=\mathbb Z^2,
\]

the standard metrics give \(I=2\), \(\|T\|_{\mathrm{HS}}^2=5\), and \(\mathcal C=\log(5/2)\). With source metric \(G=\operatorname{diag}(4,1)\) and standard target metric, \(T\) is isometric, the source covolume is two, and \(\|T\|_{\mathrm{HS}}^2=2\). Thus \(\mathcal C=\log2\). The change removes exactly the anisotropy slack \(\log(5/4)\).

More generally, choosing the pullback source metric makes \(T\) isometric and places the entire index cost in the covolume ratio. Metric normalization can make the geometry cleaner; it does not prove a smaller arithmetic cost.

## 3. The lattice target is equivalent to the scalar prime-ramp target

Use the project normalization, for real \(X\ge2\):

\[
 R(X)=\sum_{p^k\le X}\log p\left(\frac X{p^k}-1\right),\qquad
 M(X)=X\log X-(1+\gamma_E)X,\qquad G(X)=R(X)-M(X).
\]

Define

\[
 a_p(X)=\sum_{k:p^k\le X}\left(\frac X{p^k}-1\right),\qquad
 m(X)=\lceil\sqrt X\rceil,\qquad
 Q_{X,m}=\prod_{p\le X}p^{\lfloor m a_p(X)\rfloor}.
\]

The exact rounding ledger already established in the geometric paper is

\[
 0\le mR(X)-\log Q_{X,m}<\vartheta(X)
 \le4(\log2)X.
\]

Consider the following assertions.

**Scalar full-ray assertion (S).** For every \(\varepsilon>0\), there are \(C_\varepsilon\ge0\) and \(X_\varepsilon\) such that

\[
 G(X)\le C_\varepsilon X^{1/2+\varepsilon}
 \quad\text{for every }X\ge X_\varepsilon.
\]

**Unrestricted lattice assertion (L).** For every \(\varepsilon>0\), there are \(C_\varepsilon\ge0\) and \(X_\varepsilon\) such that, for every real \(X\ge X_\varepsilon\), some injective integral lattice map of positive rank satisfies

\[
 I\ge Q_{X,m},\qquad
 \mathcal C(T)\le mM(X)+mC_\varepsilon X^{1/2+\varepsilon}.
\]

### Theorem 3: (S) if and only if (L)

**Proof, (L) ⇒ (S).** The complete chain is

\[
 mR(X)-\vartheta(X)<\log Q_{X,m}\le\log I\le\mathcal C(T)
 \le mM(X)+mC_\varepsilon X^{1/2+\varepsilon}.
\]

Divide by \(m\ge\sqrt X\). The result is

\[
 G(X)<C_\varepsilon X^{1/2+\varepsilon}+4(\log2)\sqrt X
 \le(C_\varepsilon+4\log2)X^{1/2+\varepsilon}.
\]

**Proof, (S) ⇒ (L).** At each \(X\), use the explicit rank-one map \(n\mapsto Q_{X,m}n\). Theorem 2 gives

\[
 \mathcal C(T)=\log Q_{X,m}\le mR(X)
 \le mM(X)+mC_\varepsilon X^{1/2+\varepsilon}.
\]

The maps need not be compatible as \(X\) varies, because assertion (L) contains no such requirement. ∎

**Interpretation.** The unrestricted lattice condition is an exact reformulation of the scalar analytic target, up to a harmless rounding allowance. The hard part is an independent estimate of the cost of a specified arithmetic family. Defining the rank-one map from \(Q_{X,m}\) produces the desired divisibility immediately but leaves its cost estimate equal to the original prime-ramp problem.

### Corollary 4: these assertions are also equivalent to RH

For this analytic argument, extend the same formulas for \(R\), \(M\), and \(G\) to \(X\ge1\); the prime-power sum is empty when \(1\le X<2\). The lattice assertion continues to use \(X\ge2\).

The prior arithmetic-theta manuscript proves (S) ⇒ RH by the Mellin transform

\[
 \int_1^\infty G(X)X^{-s-1}\,dX
 =\frac{-\zeta'(s)/\zeta(s)}{s(s-1)}
 -\frac1{(s-1)^2}+\frac{1+\gamma_E}{s-1}
\]

and a one-sided Landau argument. This is a cited dependency of this corollary, not a new proof of that direction.

For completeness, the converse follows from a classical RH estimate with all normalization constants visible. Write \(E(t)=\psi(t)-t\). Under RH, Schoenfeld's Theorem 10, equation (6.2), gives

\[
 |E(t)|<\frac1{8\pi}\sqrt t(\log t)^2\qquad(t>73.2).
\]

Abel summation, or interchanging a finite sum and an integral, gives

\[
 R(X)=X\int_1^X\frac{\psi(t)}{t^2}\,dt
 =X\log X+X\int_1^X\frac{E(t)}{t^2}\,dt.
\]

The RH bound makes the integral of \(E(t)t^{-2}\) absolutely convergent. For real \(\sigma>1\),

\[
 -\frac{\zeta'(\sigma)}{\zeta(\sigma)}
 =\frac{\sigma}{\sigma-1}
 +\sigma\int_1^\infty E(t)t^{-\sigma-1}\,dt.
\]

Using \(-\zeta'/\zeta(\sigma)=1/(\sigma-1)-\gamma_E+O(\sigma-1)\) and dominated convergence as \(\sigma\downarrow1\) shows

\[
 \int_1^\infty E(t)t^{-2}\,dt=-1-\gamma_E.
\]

Consequently

\[
 \boxed{G(X)=-X\int_X^\infty E(t)t^{-2}\,dt.}
\]

Since

\[
 \int_X^\infty t^{-3/2}(\log t)^2\,dt
 =2X^{-1/2}\big((\log X)^2+4\log X+8\big),
\]

we obtain, for \(X>73.2\),

\[
 |G(X)|<\frac{\sqrt X}{4\pi}
 \big((\log X)^2+4\log X+8\big).
\]

Every positive power eventually dominates this polynomial in \(\log X\), giving (S). This establishes the asserted RH equivalence without needing the stronger \(O(\sqrt X)\) estimate.

Primary reference: Lowell Schoenfeld, *Sharper Bounds for the Chebyshev Functions θ(x) and ψ(x). II*, Mathematics of Computation **30** (1976), 337–360, Theorem 10(6.2), DOI `10.1090/S0025-5718-1976-0457374-X`; [AMS article PDF](https://www.ams.org/mcom/1976-30-134/S0025-5718-1976-0457374-X/S0025-5718-1976-0457374-X.pdf).

## 4. The precise window-to-full-ray boundary

The external source defines

\[
 \operatorname{HasWindows}(S,\lambda):
 \quad\forall y\ \exists Y\ge y\ \forall x\in[Y,Y^\lambda],\ x\in S.
\]

It separately defines `WinAll` as membership of every sufficiently large point. These have different quantifiers.

### Lemma 5: a sufficient mesh bridge

Let \(0<\theta<1\), and suppose \(G\) is \(L\)-Lipschitz on a tail. Suppose \(S\) is a set of good points with \(G(y)\le Cy^\theta\) for all sufficiently large \(y\in S\), with \(C\ge0\). If there is \(D\ge0\) such that, for every sufficiently large \(x\), some \(y\in S\) satisfies

\[
 |x-y|\le D x^\theta,
\]

then

\[
 G(x)\le(2^\theta C+LD)x^\theta
\]

for every sufficiently large \(x\).

**Proof.** Because \(\theta<1\), eventually \(Dx^\theta\le x/2\). Thus \(y\ge x/2\) is beyond the good-point threshold and \(y\le2x\). Apply

\[
 G(x)\le G(y)+L|x-y|\le C(2x)^\theta+LDx^\theta.
\]

∎

A covering sequence of windows, for example an increasing sequence \(Y_j\to\infty\) with \(Y_{j+1}\le Y_j^\lambda\), gives the bridge with \(D=0\). Alternatively, gaps bounded at the relevant \(x^\theta\) scale suffice. Mere existence of arbitrarily large windows supplies neither condition.

For the actual project ramp, a constant Lipschitz bound is available by elementary factorial/Mertens estimates. The inspected source `Formalism/ZetaNonvanishing/GzLipschitz.lean` defines \(K_0=\log4+7\), proves the piecewise derivative bound, and proves `zetaPrimeSumErrorLipschitz`. Thus Lemma 5 has a concrete natural hypothesis; its missing mesh condition cannot be discarded.

### Proposition 6: even C² regularity, bounded derivative, and ramp convexity do not repair arbitrary windows

There exists a nonnegative \(C^2\) function \(F\), with globally bounded derivative, such that:

1. \(F=0\) on arbitrarily large full windows \([Y,Y^2]\).
2. \(F\) is not \(O(x^{1/2})\), and in fact is not \(O(x^{1/2+\varepsilon})\) for any \(0<\varepsilon<1/4\).
3. \(x\log x-(1+\gamma_E)x+F(x)\) is convex on \((0,\infty)\).

**Construction and proof.** Let

\[
 Y_j=4096^{3^j},\quad X_j=16Y_j^2,\qquad
 \phi(u)=\begin{cases}(1-u^2)^3,&|u|\le1,\\0,&|u|>1,\end{cases}
\]

and define

\[
 F(x)=\sum_{j\ge0}X_j^{3/4}
 \phi\!\left(\frac{4(x-X_j)}{X_j}\right).
\]

Each support is \([12Y_j^2,20Y_j^2]\), strictly inside the gap between \([Y_j,Y_j^2]\) and \([Y_{j+1},Y_{j+1}^2]\), since \(Y_{j+1}=Y_j^3\) and \(Y_j>20\). The supports are disjoint and locally finite. The bump and its first two derivatives vanish at the support boundary, so \(F\) is \(C^2\). On \([-1,1]\), \(|\phi'|\le6\) and

\[
 \phi''(u)=-6+36u^2-30u^4\ge-6.
\]

Therefore, on the \(j\)-th support,

\[
 |F'(x)|\le24X_j^{-1/4},\qquad F''(x)\ge-96X_j^{-5/4}.
\]

Since \(X_0^{1/4}=128\), the derivative is globally at most \(3/16\). Also \(x\le5X_j/4\) there, so

\[
 \frac1x+F''(x)\ge\frac1{X_j}\left(\frac45-\frac{96}{X_j^{1/4}}\right)
 \ge\frac1{20X_j}>0.
\]

Outside the supports the second derivative of the uncentred expression is \(1/x>0\). But at each centre, \(F(X_j)=X_j^{3/4}\), so \(F(X_j)/X_j^{1/2+\varepsilon}=X_j^{1/4-\varepsilon}\to\infty\) for \(0<\varepsilon<1/4\). ∎

This is an obstruction to a generic regularity or convex-envelope argument. It is **not** a proposed prime-ramp counterexample, and it does not contradict a Landau-window theorem that uses the special meromorphic transform and its noncancelling residues.

## 5. What the inspected arithmetic source actually supplies at the analytic endpoint

| Source file | Inspected declaration | Exact relevance |
|---|---|---|
| `Formalism/SharpRestriction/GlobalSchurBounds/GeneralLinearActions/FiltrationCocycleLiftCriterion.lean` | `G`, `G_eq_Gfun` | `G` is the same centred Mangoldt ramp, including the Euler constant. The maximum in the displayed finite sum is removed by its range. |
| `Formalism/SizeWindowBrackets/GrowthBoundGivesRiemannHypothesis.lean` | `GrowthInequalityDataExists`, `GrowthBoundGivesRiemannHypothesis` | This separately available full-ray interface asks for suitable data for every sufficiently large real \(x\), for every sufficiently small positive ε. Definitions alone are not proof bodies. |
| `Formalism/SizeWindowBrackets/ChainSlopeWindows/LipschitzWeightAndMinimum.lean` | `proposition_at_point`, `proposition_final` | Actual bodies compose `growthInequality`, the size-bound algebra, and downstream implications. This is not the currently observed Main path. |
| `Formalism/SharpRestriction/RamificationFrobenius/TotientGaloisClasses/Window.lean` | `HasWindows`, `Level.FormBAt` | Encodes the distinct arbitrarily-large-window condition and the analytic theorem needed to turn it into zero-freeness. |
| `Formalism/SharpRestriction/RamificationFrobenius/TotientGaloisClasses/TopWin.lean` | `level_of_tiedWin`, `zeroFreeOn_of_tiedWin_cyc` | For a fixed analytic level Λ, chooses a small ε, obtains an auxiliary family and a bound for Λ.Gm on its windows, and applies `Λ.FormBAt`. It does not manufacture a full-ray bound. |
| `Development/AutomorphicArithmetic/CharacterBoxes/ZeroFreeAllOfTopG.lean` | `UpperTheory.Top.zeroFreeAll_of_topG` | Calls the preceding window endpoint using `level_gm_le_on_family_scales`, `formB`, and the supplied connected arithmetic families. |
| `Development/AutomorphicArithmetic/DedekindLFunctions/LandauTheorems/ZeroFreeOfRpowWindow.lean` | `Deduction.zeroFree_of_rpow_window` | Fixed `CharFamily`, fixed \(0<\theta<1\), fixed δ>0 and C, arbitrarily large windows with \(G_m\le Cy^\theta\) imply zero-freeness to the right of θ. |
| `Development/AutomorphicArithmetic/DedekindLFunctions/LandauTheorems/lemmaL.lean`, `landauWindow.lean` | `lemmaL`, `landau_window` | Actual analytic bodies use pole data, derivative coefficient estimates, nearest-pole/dichotomy machinery, and a growth contradiction. They do not rely only on continuity or convexity. Their full dependencies were not replayed here. |

The fixed-family issue needs precision. The analytic level Λ and its averaged function Λ.Gm must remain fixed while windows go to infinity. Auxiliary arithmetic families may vary with ε if `EFamC` or an equivalent identity ties their estimates back to that same Λ. Such auxiliary variation is not itself a quantifier error.

The exact conditional bridge from this source to the project is therefore:

1. Independently validate the concrete arithmetic family and its complete estimates, including the fixed-level comparison and the window existence quantifiers.
2. Independently validate or explicitly import the matching analytic window theorem.
3. Obtain the claimed zero-freeness/RH conclusion from that route.
4. Apply Corollary 4 to obtain the project full-ray ramp/lattice assertions, and the prior sparse Pick theorem to obtain all Pick prefixes.

This is a logically valid conditional connection. It is not a new direct theta-to-twin-ladder transport theorem, and it does not shorten the arithmetic work merely by putting the equivalent endpoint in lattice language.

## 6. What the twin ladder contributes, and what remains to be proved

The twin-ladder framework still contributes an exact identification of the residual sign problem, an explicit finite test space, and a clean target for geometric constructions. Under RH, its Weil identity becomes

\[
 Q_L(v)=\sum_{F(i\gamma)=0}|V(i\gamma)|^2,
\]

which gives a genuine Hilbert-space Gram realization of every finite prefix. Using that realization to establish RH would be circular because its positivity already uses the zero locations.

Two independent directions remain mathematically meaningful:

- **A specified arithmetic lattice construction.** Give the lattices, the actual maps, their integral normalization and saturation, the index/divisibility theorem, and an independently proved complete cost estimate. Theorem 1 allows geometric optimization but puts a sharp lower limit on what it can accomplish.
- **A direct arithmetic Gram comparison.** For every fixed prefix \(n\), construct Hermitian forms whose whole-form lower comparison with the project prime-truncated Pick matrix has error tending to zero. The existing transfer theorem needs convergence for each fixed \(n\), not a uniform spectral gap. Neither an isolated positive diagonal nor positivity of an averaged matrix supplies this statement.

The next release can honestly strengthen the compression paper by adding Theorems 1–3, the RH-equivalence corollary with its exact dependencies, Lemma 5, and Proposition 6. Its status should remain a conditional research reduction until one of these independently arithmetic constructions and estimates has been supplied and verified.

## 7. Reproducible finite checks

The accompanying `check_ladder_completion.py` uses exact rational and symbolic arithmetic. It checks determinant/index identities for square and embedded lattices, equality and strict-slack cases, uniform metric invariance, an explicit anisotropic metric change, prime exponent rounding for rational X, the RH-tail antiderivative, and exact support/curvature inequalities for the window obstruction.

These checks detect algebraic or normalization mistakes in finite examples. The proofs above establish the universal statements. Finite checks are neither RH verification nor a substitute for the missing arithmetic estimates.
