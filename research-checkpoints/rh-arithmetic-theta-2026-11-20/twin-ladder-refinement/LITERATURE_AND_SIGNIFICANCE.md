# Literature, significance, and a scalar growth criterion

Jude Gomila research checkpoint · 20 November 2026

## Status and scope

This note distinguishes published background, project-specific results, and the arithmetic step that remains open. It does **not** claim an unconditional proof of the Riemann hypothesis (RH), establish priority for the project's exact formulas, or independently revalidate every historical repository proof.

The labels used below are **IMPORTED** for established literature, **PROJECT** for results identified in the audited repository, **DERIVED** for arguments proved in this note, and **OPEN** for the missing arithmetic estimate or construction. The derived arguments are not asserted to be historically new.

## 1. Significance of the exact residual bridge

**PROJECT.** The useful content of the PR58 bridge is the identification of the actual PR48 residual with a correctly normalized Weil/Suzuki quadratic form. Accounting for the gamma, pole, constant, and prime terms matters: it determines whether the canonical residual recursion is addressing the intended RH criterion. It also supplies a concrete target against which an arithmetic Gram construction can be checked.

This is meaningful progress within the project. Its strongest defensible description is an **explicit realization and integration of an established positivity criterion**. The broad equivalences between RH, Weil positivity, screw-kernel positivity, and appropriate half-plane positivity already have prior literature. Possible distinctive contributions must instead be assessed at the level of the project's precise test family, gamma energy factorization, canonical recursion, domain statements, and finite-order estimates.

### Project source pins

| Project item | Pinned source | Relevant scope |
|---|---|---|
| PR48 residual | [`499528b487e3249c5a35602f83343aaa53cec848`](https://github.com/judegomila/mathexplorer/commit/499528b487e3249c5a35602f83343aaa53cec848), [PR48](https://github.com/judegomila/mathexplorer/pull/48) | Arithmetic residual target, including the energy expression used in the later comparison. |
| PR58 exact bridge | [`97a732d54156e119627627e2b80090d63bfa9a29`](https://github.com/judegomila/mathexplorer/tree/97a732d54156e119627627e2b80090d63bfa9a29/research-checkpoints/rh-push-2026-11-16/equivalence-and-pick/eq48), `RESULT.md` and `REFEREE.md` | Exact Weil/Suzuki identification; all-order equivalence has the stated prefix qualifications. |
| PR55 finite preservation | [`c617017e3a90562cd828e58ffc71b03afab128cc`](https://github.com/judegomila/mathexplorer/commit/c617017e3a90562cd828e58ffc71b03afab128cc), [PR55](https://github.com/judegomila/mathexplorer/pull/55) | Six-node real Pick result on its stated domain. It is a finite-order theorem, not an arbitrary-depth induction. |
| PR60 function-field transplant | [`a4b2b400018d228bd31448007b09e6b38779341c`](https://github.com/judegomila/mathexplorer/tree/a4b2b400018d228bd31448007b09e6b38779341c/research-checkpoints/rh-push-2026-11-16/direct-attacks/ff-transplant), `RESULT.md` | A reformulation of the growth target. The independent number-field estimate is still required. |

Ordinary Schur complements require invertible positive prefixes. At singular prefixes, positive semidefiniteness requires both the appropriate range condition and the Moore–Penrose Schur-complement inequality. A release must preserve these qualifications rather than silently replace semidefinite positivity by strict positivity.

## 2. Published precedents

**IMPORTED.** These sources establish the principal conceptual precedents. Their existence does not decide whether every particular formula or finite-order theorem in the project has appeared before.

| Source and date | Precise point of comparison | What this limits |
|---|---|---|
| **André Weil (1952)**, *Sur les « formules explicites » de la théorie des nombres premiers*. [Transcription of the original paper](https://denisevellachemla.eu/transc-Weil-1952.pdf). | The concluding criterion, equation (12), expresses RH through positivity of an explicit-formula distribution on autocorrelations. The paper also discusses the function-field analogy. | The general Weil-positivity target is classical. The linked document is a later transcription, not an original publisher scan. |
| **Aimo Hinkkanen (1997)**, *On functions of bounded type*, Complex Variables **34**, 119–139, [DOI](https://doi.org/10.1080/17476939708815042); **J. C. Lagarias (1999)**, *On a positivity property of the Riemann ξ-function*, Acta Arith. **89**, 217–234, [author copy](https://websites.umich.edu/~lagarias/doc/positivity.pdf), [DOI](https://doi.org/10.4064/aa-89-3-217-234). | Lagarias's introduction, equations (1.4)–(1.5), records RH equivalence to $\Re(\xi'/\xi)(s)>0$ throughout $\Re s>1/2$. It credits prior work and discusses Hinkkanen's matrix criteria, including suitable sequences far from the boundary. | Half-plane logarithmic-derivative positivity and infinite matrix tests have direct prior art. The specific account of Hinkkanen here is through Lagarias; Hinkkanen's full proof was not audited. |
| **E. Bombieri and J. C. Lagarias (1999)**, *Complements to Li's Criterion for the Riemann Hypothesis*, J. Number Theory **77**, 274–287, [author copy](https://websites.umich.edu/~lagarias/doc/bombieri.pdf), [DOI](https://doi.org/10.1006/jnth.1999.2392). | Theorem 1 gives a multiset criterion. Theorem 2 and the subsequent discussion connect an arithmetic formula for Li's coefficients with the explicit formula and Weil positivity. | An exact arithmetic positivity hierarchy can be useful without proving its signs. Li's scalar hierarchy and this project's Pick hierarchy are distinct constructions. |
| **Masatoshi Suzuki (2023)**, *Aspects of the screw function corresponding to the Riemann zeta-function*, JLMS **108**, 1448–1487; [arXiv](https://arxiv.org/abs/2206.03682), [full paper](https://arxiv.org/pdf/2206.03682), [DOI](https://doi.org/10.1112/jlms.12785). First arXiv submission: **8 June 2022**. | Theorems 1.2–1.3 give screw-kernel RH criteria. **Proposition 3.1, equation (3.8), identifies the differentiated screw form with the Weil form exactly.** Theorem 1.6 gives an equivalent bounded scalar response; Theorem 1.8 gives a Stieltjes moment determinant criterion. | This is direct prior art for the broad exact Weil–screw bridge. The project's one-sided exponential domain, normalization, and canonical realization require a more specific comparison. |
| **Masatoshi Suzuki (2026)**, *Weil's quadratic form via the screw function*, [version 4](https://arxiv.org/html/2606.09096v4), [version record](https://arxiv.org/abs/2606.09096). First submitted **8 June 2026**; version 4 **15 November 2026**. | Equation (2.9) represents the localized Weil form through derivatives of the screw kernel on a specified Sobolev domain. The proposed limiting spectral construction is conjectural. | A close contemporary operator treatment must be acknowledged. It does not provide an independently established RH proof to import. |
| **Classical Nevanlinna–Pick interpolation**, stated as Theorem 0.1 in J. Agler and J. E. McCarthy, *Nevanlinna–Pick Kernels and Localization*, [author preprint](https://arxiv.org/pdf/1610.01965). | A finite disk interpolation problem admits a Schur-class solution exactly when its Pick matrix is positive semidefinite. | Cayley transformation, normal-family compactness, and an interior accumulation set give a classical route from a finite-matrix hierarchy to a global holomorphic function. No new general interpolation principle is claimed. |

Lagarias's [2005 correction](https://www.impan.pl/shop/en/publication/transaction/download/product/81942), Acta Arith. **116**, 293–294, corrects Lemma 3.1 and a sign in equation (3.8). It does not retract the introductory RH/logarithmic-derivative equivalence.

The positive-moment viewpoint also has a direct elementary explanation. Put $F(z)=\xi(1/2+z)$ and $\mathcal F(u)=F(\sqrt u)$, which is entire because $F$ is even. Under RH,

$$
2\frac{\mathcal F'(u)}{\mathcal F(u)}
=2\sum_{\gamma>0}\frac{m_\gamma}{u+\gamma^2}.
$$

This is a Stieltjes transform of a positive measure. Conversely, a Stieltjes extension is holomorphic off the negative real axis; an off-axis centered zero $\rho$ would give a logarithmic-derivative pole at $u=\rho^2$ away from that cut. The identity theorem excludes it. This canonical-product argument is another useful equivalent formulation, not a new arithmetic bound. It is related to, but not the same statement as, a moment determinant criterion.

## 3. What the function-field analogy does and does not supply

**IMPORTED.** Bombieri's *Counting points on curves over finite fields [d'après S. A. Stepanov]* was presented in **June 1973** and published as Bourbaki exposé 430 in **1974**, pp. 234–241: [original paper](https://www.numdam.org/item/SB_1972-1973__15__234_0.pdf). Its auxiliary rational function has many zeros of controlled high multiplicity and sufficiently few poles. Frobenius and power structure participate in the construction; zero/pole counting then yields the point-count estimate. The full argument includes the steps needed to pass from the estimates to the desired zero-location conclusion.

**OPEN.** A number-field counterpart must supply an effective construction that controls the cost of imposed multiplicity. Writing a corresponding two-by-two or scalar inequality identifies the target; it does not reproduce the mechanism that proves the inequality. For a ladder of growing length, accumulated losses must remain compatible with the final arithmetic estimate. A positive Hilbert-space Gram matrix is insufficient unless it is independently matched to the correct arithmetic form, with a proved error bound.

Square-root prime-error estimates are a longstanding expression of the same difficulty. Under RH, Schoenfeld's **Theorem 10**, equation (6.2), in *Sharper bounds for the Chebyshev functions θ(x) and ψ(x). II*, Math. Comp. **30** (1976), 337–360, gives

$$
|\psi(x)-x|<\frac{\sqrt x\,\log^2x}{8\pi}
\qquad(x>73.2).
$$

His introduction places the order of this bound in the older von Koch tradition. [Original paper](https://www.ams.org/mcom/1976-30-134/S0025-5718-1976-0457374-X/S0025-5718-1976-0457374-X.pdf). A different smoothing or normalization becomes an arithmetic advance when the necessary estimate is proved, not merely when its RH consequence is identified.

## 4. A complete scalar resolvent calculation

**DERIVED.** The following proposition isolates the growth issue for the response used in the function-field comparison. Its proof uses standard properties of the completed zeta function and elementary complex analysis. It does not assume RH.

### Proposition

Let

$$
F(z)=\xi\!\left(\tfrac12+z\right),\qquad
L(z)=\frac{F'(z)}{F(z)},
$$

and fix one real number $a>1/2$. Let $\rho$ range over the centered nontrivial zeros of zeta, counted with multiplicity, and define for $t\geq0$

$$
R_a(t)=\sum_\rho\frac{e^{\rho t}}{a^2-\rho^2}.
\tag{1}
$$

Then the series is absolutely and locally uniformly convergent in $t$, and

$$
\boxed{\displaystyle
\int_0^\infty e^{-st}R_a(t)\,dt
=\frac{L(s)-(s/a)L(a)}{a^2-s^2}}
\qquad(\Re s>1/2),
\tag{2}
$$

where the apparent singularity at $s=a$ is removable.

For this one fixed $a$, the following are equivalent:

1. RH holds.
2. $R_a$ is bounded on $[0,\infty)$.
3. For every $\varepsilon>0$, there is a finite $C_{a,\varepsilon}$ such that
   $$
   |R_a(t)|\leq C_{a,\varepsilon}e^{\varepsilon t}
   \qquad(t\geq0).
   \tag{3}
   $$

Under RH one has the explicit bound

$$
|R_a(t)|\leq\frac{L(a)}a.
\tag{4}
$$

### Proof

The standard completed-zeta facts needed here are: $F$ is even, entire of order one, $F(0)\neq0$, its zeros satisfy $|\Re\rho|<1/2$, and

$$
\sum_\rho\frac1{1+|\rho|^2}<\infty.
$$

These facts give the paired canonical product and its logarithmic derivative. For the product and the functional equation, see also the introduction to [Lagarias (1999)](https://websites.umich.edu/~lagarias/doc/positivity.pdf).

Choose one representative of each pair $\{\rho,-\rho\}$, and write $m_\rho$ for its multiplicity. Pairing the genus-one factors cancels their exponential terms. Evenness cancels the remaining linear exponential factor, so

$$
F(z)=F(0)\prod_{\{\rho,-\rho\}}
\left(1-\frac{z^2}{\rho^2}\right)^{m_\rho},
\qquad
L(z)=\sum_{\{\rho,-\rho\}}
\frac{2m_\rho z}{z^2-\rho^2}.
\tag{5}
$$

The product converges locally uniformly; the logarithmic-derivative series converges locally uniformly off its poles.

Because $a>1/2$, no denominator in (1) vanishes. The zero summability above implies

$$
B_a:=\sum_\rho\frac1{|a^2-\rho^2|}<\infty.
$$

Thus $|R_a(t)|\leq B_a e^{t/2}$, and the series converges uniformly on every bounded $t$-interval. If $\sigma=\Re s>1/2$, then

$$
\sum_\rho\int_0^\infty
\frac{|e^{-(s-\rho)t}|}{|a^2-\rho^2|}\,dt
\leq\frac{B_a}{\sigma-1/2}<\infty.
$$

Absolute convergence therefore justifies termwise integration and pairing:

$$
\int_0^\infty e^{-st}R_a(t)\,dt
=\sum_{\{\rho,-\rho\}}
\frac{2m_\rho s}
{(a^2-\rho^2)(s^2-\rho^2)}.
\tag{6}
$$

Using (5), subtraction gives

$$
\begin{aligned}
L(s)-\frac{s}{a}L(a)
&=\sum_{\{\rho,-\rho\}}2m_\rho s
\left(\frac1{s^2-\rho^2}-\frac1{a^2-\rho^2}\right)\\
&=(a^2-s^2)
\sum_{\{\rho,-\rho\}}
\frac{2m_\rho s}
{(a^2-\rho^2)(s^2-\rho^2)}.
\end{aligned}
$$

This proves (2), including removability at $s=a$ by (6).

If RH holds, write the zeros as $\pm i\gamma$, with $\gamma>0$. Absolute convergence yields

$$
R_a(t)=2\sum_{\gamma>0}
\frac{m_\gamma\cos(\gamma t)}{a^2+\gamma^2},
\qquad
|R_a(t)|\leq2\sum_{\gamma>0}
\frac{m_\gamma}{a^2+\gamma^2}
=\frac{L(a)}a.
$$

This proves $1\Rightarrow2\Rightarrow3$.

Now suppose (3). Define

$$
H(s)=\int_0^\infty e^{-st}R_a(t)\,dt
\qquad(\Re s>0).
$$

On a compact subset of this half-plane, choose $\varepsilon$ smaller than its minimum real part. The resulting exponential majorant, including after multiplication by any fixed power of $t$, proves that $H$ is holomorphic. Consequently

$$
M(s)=\frac{s}{a}L(a)+(a^2-s^2)H(s)
$$

is holomorphic on $\Re s>0$. Equation (2) gives $M=L$ on $\Re s>1/2$. To avoid assuming the desired zero-free continuation, apply the identity theorem to the holomorphic function

$$
F'(s)-M(s)F(s).
$$

It vanishes on $\Re s>1/2$, hence throughout $\Re s>0$. If $F$ had a zero there of multiplicity $m\geq1$, its derivative would have order $m-1$, whereas $MF$ would have order at least $m$, a contradiction. Thus $F$ has no zero with positive real part. Evenness rules out negative real part as well, proving RH. This establishes $3\Rightarrow1$. ∎

### Interpretation of the proposition

A polynomial bound in $t$ is sufficient, but unnecessary: subexponential growth in the quantified sense (3) already suffices. The constants may depend on the one fixed $a$ and on $\varepsilon$. A bound $O(e^{ct})$ for one fixed $c>0$ does not meet (3); a positive exponential loss cannot simply be ignored.

The proposition is a resolvent and analytic-continuation reduction. Its proof is complete, but it supplies no independent estimate of $R_a$. In particular, proving (3) by assuming the desired half-plane pole exclusion would be circular.

## 5. What would count as the next substantive advance

**OPEN.** The decisive addition would be an arithmetic construction that proves the required inequality or growth bound with its normalizations and accumulated errors controlled. For a Gram-based route, positivity of the lift must be accompanied by a noncircular comparison with the identified Weil/Pick target. Fixed finite configurations with errors tending to zero suffice for the analytic transfer; a uniform spectral gap is not required.

For a multiplicity or twin-ladder route, the construction must explain why imposing the increasing conditions leaves a nonzero object and why the total cost remains within the claimed bound. Relations among transforms, changes of basis, and positive matrices do not by themselves supply that estimate.

The current work therefore supports a precise claim: **an exact project-specific realization of a classical RH criterion, finite-order results, and conditional transfer statements with an explicit arithmetic interface**. Whether a particular normalization or finite-order lemma is publishably new remains a separate literature and referee question. Whether the full route proves RH depends on the still-open arithmetic construction, not on the number of equivalent formulations assembled.
