# A parameter optimization that strengthens the margin in "Correlated translated probes and the bound Λ < 0.149396"

*Note to Dale James Raymond regarding the de Bruijn–Newman bound Λ < 0.149396 (Zenodo record 22867547, DOI 10.5281/zenodo.22867547). Prepared by the mathexplorer project (Jude Gomila), independently reconstructing the §6–§9 estimates.*

**(Attribution note, 2026-09-21):** this note concerns Raymond's Λ-bound paper (Zenodo 22867547), **not** Zhi-Wei Sun's separate Catalan-irrationality preprint (arXiv:2609.04176) — different author, different problem. The recipient is Dale James Raymond (ORCID 0009-0001-1682-8529); his contact is on the Zenodo record.

**Scope of verification.** The reconstruction below was carried out twice, independently, and both times reproduced your exact value of $\Lambda_{\mathrm{mid}}$ at $S=\lfloor B/20\rfloor$ — the full 235-cell rational
$$\Lambda_{\mathrm{mid}}(1/20)=\tfrac{33042423784278900654572890582560690565493664595111}{187362234062518051579626183549876762148305272280000},$$
which is the validation gate for the general-$\rho$ evaluation. In addition, an independent pass verified your §4.1 extension of the Polymath15 remainder to $-1\le\sigma\le2$ line-by-line, and reproduced §6–§12 and the certificate replay (exact layers bit-for-bit; the kernel Bernstein certificates and an independent-library ODE endpoint match). This is not peer review, and it does **not** lower the accepted bound — Platt–Trudgian $\Lambda\le0.2$ remains the rigorous SOTA.

---

## The remark

**The decisive coefficient $\delta_0$ is far from optimal in the free ratio $\rho = S/B$.** You fix $S=\lfloor B/20\rfloor$ (i.e. $\rho=1/20$) and prove $\delta_0>0.00966$. Re-optimizing $\rho$ alone — with no change to the construction — raises the margin to
$$\delta_0 \approx 0.03872 \quad\text{at}\quad \rho^\*=1/50\ \ (S=\lfloor B/50\rfloor),$$
a factor of about **$4.01\times$**. Moreover $\delta_0(\rho)>0$ on the whole interval $\rho\in(0,\,0.05548)$, so the positivity of the decisive inequality is robust in $\rho$; the small numerical margin at $\rho=1/20$ reflects that particular (steeply suboptimal) choice — it sits on a downslope, $\left.\tfrac{d\delta_0}{d\rho}\right|_{1/20}\approx-1.67$, only $\approx10\%$ above the zero-crossing at $\rho\approx0.05548$ — rather than any tightness of the method.

## The margin as a function of $\rho$

Writing the three prime-range corrections at general $\rho$, the decisive coefficient of (9.3) is
$$
\delta_0(\rho)=\Lambda_{\mathrm{mid}}(\rho)+\Delta_{>B}(\rho)-c_{\mathrm{odd}}(\rho)-\bigl(4\rho-2\rho^2\bigr),
$$
with, at general $\rho$,
$$
\Delta_{>B}(\rho)=\tfrac23\rho+\tfrac12\rho^2\quad\bigl(=\tfrac{83}{2400}\ \text{at}\ \rho=\tfrac1{20}\bigr),
\qquad
c_{\mathrm{odd}}(\rho)=\kappa\,\rho^2,\ \ \kappa\approx2.5107,
$$
the latter because the §6 integrand $Q_0(v)$ is $\rho$-independent, so $c_{\mathrm{odd}}$ scales exactly as $\rho^2$. Hence
$$
\boxed{\;\delta_0(\rho)=\Lambda_{\mathrm{mid}}(\rho)-\tfrac{10}{3}\rho+\tfrac52\rho^2-\kappa\,\rho^2.\;}
$$

| $\rho=S/B$ | $\delta_0(\rho)$ |
|---|---|
| $1/20$ (as written) | $0.00966$ |
| $1/30$ | $0.0347$ |
| $1/49$ | $0.0387$ |
| **$1/50$ (optimum)** | **$0.0387$** |
| $1/51$ | $0.0387$ |
| $1/100$ | $0.0151$ |
| $\to0^+$ | $\to0^+$ |

The maximum is a genuine interior optimum near $\rho^\*=1/50$; simply replacing $S=\lfloor B/20\rfloor$ by $S=\lfloor B/50\rfloor$ hardens (9.3) by that factor. Admissibility at $\rho=1/50$ holds throughout: §5 saturation is *easier* at smaller $S$ (its margin $\tfrac{B}{4}-\tfrac{7S}{8}-\tfrac{21}{8}+\tfrac{3S}{K}$ increases as $S$ shrinks); §8 needs only $\rho<1/3$; and the residual matrix keeps full column rank $S$.

## Reproducibility

$\mathcal{E}_\rho(t)$ and $Q_0(v)$ were reconstructed from the verbatim definitions (independently confirming your $c_{\mathrm{odd}}(1/20)=0.006276744728\ldots$ to all 39 printed digits, your $Q_0$ leading coefficient $-79/2$, and the 235 / 238 cell counts), the integrations are exact-rational, and every $\mathcal{E}_\rho$ and $Q_0$ value was cross-checked against direct finite-$B$ combinatorics. Scripts available on request. All period / value claims rest on exact derivation rather than floating-point relation-finding.

We would of course be glad to be corrected on any of the above. And, separately: your bound $\Lambda<0.149396$ lands squarely inside a floor band $[0.145,0.150]$ we had derived independently for the $t\downarrow0$ quantitative program, and your Part II exhaustion theorem matches our finding that a new (joint two-point / arithmetic) input is required below $\approx0.145$ — a nice independent convergence.
