# A parameter optimization that strengthens the margin in "Catalan's constant is irrational"

*Note to Zhi-Wei Sun regarding arXiv:2609.04176v1. Prepared by the mathexplorer project (Jude Gomila), independently reconstructing the §6–§9 estimates.*

**Scope of verification.** The reconstruction below was carried out twice, independently, and both times reproduced your exact value of $\Lambda_{\mathrm{mid}}$ at $S=\lfloor B/20\rfloor$ — the full rational
$$\Lambda_{\mathrm{mid}}(1/20)=\tfrac{33042423784278900654572890582560690565493664595111}{187362234062518051579626183549876762148305272280000},$$
on exactly 235 cells, all 40 digits of (7.16) — which is the validation gate for the general-$\rho$ evaluation. This note verifies and optimizes the asymptotic ledger of §6–§9 only, taking the determinant construction of §2–§5, and the raw quadratic coefficient $4\rho-2\rho^2$ of (9.4) / the baseline of (8.3) (the Stirling/2-adic ledger), as you state them. It does **not** re-derive that core, and makes no independent claim about the correctness of the main theorem — only about the $\rho$-dependence of the decisive coefficient.

---

## The remark

**The decisive coefficient $\delta_0$ is far from optimal in the free ratio $\rho = S/B$.** You fix $S=\lfloor B/20\rfloor$ (i.e. $\rho=1/20$) and prove $\delta_0>0.00966$. Re-optimizing $\rho$ alone — with no change to the construction — raises the margin to
$$\delta_0 \approx 0.03872 \quad\text{at}\quad \rho^\*=1/50\ \ (S=\lfloor B/50\rfloor),$$
a factor of about **$4.01\times$**. Moreover $\delta_0(\rho)>0$ on the whole interval $\rho\in(0,\,0.05548)$, so the positivity of the decisive inequality is robust in $\rho$; the small numerical margin at $\rho=1/20$ reflects that particular (steeply suboptimal) choice — it sits on a downslope, only $\approx10\%$ above the zero-crossing at $\rho\approx0.05548$ — rather than any tightness of the method.

## The margin as a function of $\rho$

Writing the three prime-range corrections at general $\rho$, the decisive coefficient of (9.3) is
$$
\delta_0(\rho)=\Lambda_{\mathrm{mid}}(\rho)+\Delta_{>B}(\rho)-c_{\mathrm{odd}}(\rho)-\bigl(4\rho-2\rho^2\bigr),
$$
with, at general $\rho$,
$$
\Delta_{>B}(\rho)=\tfrac23\rho+\tfrac12\rho^2\quad\bigl(=\tfrac{83}{2400}\ \text{at}\ \rho=\tfrac1{20},\ =\tfrac{203}{15000}\ \text{at}\ \rho=\tfrac1{50}\bigr),
\qquad
c_{\mathrm{odd}}(\rho)=\kappa\,\rho^2,\ \ \kappa\approx2.5107,
$$
the latter because the §6 integrand $Q_0(v)$ is $\rho$-independent, so $c_{\mathrm{odd}}$ scales exactly as $\rho^2$. Hence
$$
\boxed{\;\delta_0(\rho)=\Lambda_{\mathrm{mid}}(\rho)-\tfrac{10}{3}\rho+\tfrac52\rho^2-\kappa\,\rho^2.\;}
$$
The general-$\rho$ form $\Delta_{>B}(\rho)=\tfrac23\rho+\tfrac12\rho^2$ was checked against your closed form (8.1) pointwise and in integral, and against direct finite-$B$ combinatorics.

Reconstructing the §7 integrand $\mathcal{E}_\rho(t)$ from (7.1)–(7.16) and integrating by exact rational arithmetic (subdividing at every cell boundary and every ladder-threshold event) reproduces $\Lambda_{\mathrm{mid}}(1/20)$ exactly, as above — the gate that makes the general-$\rho$ evaluation trustworthy. At $\rho=1/50$ the same computation gives $\Lambda_{\mathrm{mid}}(1/50)=0.1053937726969561\ldots$, and hence:

| $\rho=S/B$ | $\delta_0(\rho)$ |
|---|---|
| $1/20$ (as written) | $0.00966243$ |
| $1/30$ | $0.034716$ |
| $1/49$ | $0.038716$ |
| **$1/50$ (optimum)** | **$0.038723$** |
| $1/51$ | $0.038715$ |
| $1/100$ | $0.01508$ |
| $\to0^+$ | $\to0^+$ |

The maximum is a genuine interior optimum at $\rho^\*=1/50$; $\left.\tfrac{d\delta_0}{d\rho}\right|_{1/20}\approx-1.67$. $\Lambda_{\mathrm{mid}}(\rho)$ stays finite as $\rho\to0^+$ (the $A_\rho/t$ edge is integrable on $(\rho,1)$), so the optimum is not an artifact of a divergence.

## Admissibility of $\rho=1/50$

Decreasing $\rho$ only loosens the constraints:

- **§2 (Thm 2.1 rank):** the polynomial-defect argument has no $\rho$-dependence; $\mathcal{R}$ keeps full column rank $S$.
- **§5 (Thm 5.1 saturation):** at the minimizing prime power the margin $\tfrac{B}{4}-\tfrac{7S}{8}-\tfrac{21}{8}+\tfrac{3S}{K}$ is *increasing* as $S$ decreases; $S=\lfloor B/50\rfloor$ satisfies $S\le B/20$ verbatim (the chain in fact tolerates any $\rho\lesssim2/7$).
- **§8 case structure (8.1):** requires $\rho<1/3$; holds at $1/50$.
- **§7 one-layer condition** and the §6 $u=S/Q\ge1$ structure hold for any fixed $\rho>0$ at large $B$.

So $\rho=1/50$ is admissible throughout, and replacing $S=\lfloor B/20\rfloor$ by $S=\lfloor B/50\rfloor$ hardens (9.3) by the factor above.

## Reproducibility

$\mathcal{E}_\rho(t)$ and $Q_0(v)$ were reconstructed from the verbatim definitions (independently confirming your $c_{\mathrm{odd}}(1/20)=0.006276744728\ldots$ to all 39 printed digits, your $Q_0$ leading coefficient $-79/2$, and the 235 / 238 cell counts), the integrations are exact-rational, and every $\mathcal{E}_\rho$ and $Q_0$ value was cross-checked against direct finite-$B$ combinatorics from (7.2)–(7.6) / (6.16). Scripts available on request. All period / value claims rest on exact derivation rather than floating-point relation-finding.

We would of course be glad to be corrected on any of the above.
