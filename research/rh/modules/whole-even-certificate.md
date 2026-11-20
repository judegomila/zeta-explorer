# A complete supported even Weil certificate

## Status and scope

Accepted means internal mathematical review and the stated independent execution, not external peer review or proof-assistant formalization.

**Accepted, independently replayed:** the actual reflection-even supported Weil form is coercively positive for

\[
1<\lambda\le\lambda_*:=\sqrt{16001/1000}
 =4.00012499804693603277\ldots.
\]

The proof includes the entire infinite Fourier tail. It is not merely a positive finite matrix or a positive tail compression. The coercivity constant at this enlarged endpoint is existential; no numerical value is claimed. This is the largest endpoint certified by the completed checks in this module, **not** a claim that positivity ends there.

The later fixed test at \(\lambda=\sqrt{161/10}\) fails its sufficient lower-surrogate certificate. It does **not** prove negativity of the actual form. Further proposed repairs are outside this module’s accepted scope.

Neither result proves odd-sector positivity, ground-state simplicity, identification of a distinguished candidate, a cofinal-support bound, or RH.

## 1. The actual form and its domain

Put \(a=\log\lambda\), \(W=2a\), \(I_\lambda=[-a,a]\), and
\(H_\lambda=L^2(I_\lambda,dy)\). Every function is extended by zero outside its interval. Use the nonunitary Fourier transform

\[
\widehat f(t)=\int_{\mathbb R}f(y)e^{-ity}\,dy,
\qquad
\|f\|_2^2=\frac1{2\pi}\int_{\mathbb R}|\widehat f(t)|^2\,dt.
\]

The canonical closed form domain is

\[
\mathcal V_\lambda=
\left\{f\in H_\lambda:
\int_{\mathbb R}\log(2+|t|)|\widehat f(t)|^2\,dt<\infty\right\}.
\]

Let \(R_f(r)=\int_{\mathbb R}\overline{f(y)}f(y+r)\,dy\) and

\[
\alpha(t)=\Re\psi(5/4+it/2)-\log\pi.
\]

Here \(\psi=\Gamma'/\Gamma\) is the digamma function and \(\Lambda(n)\) is the von Mangoldt function.

The actual completed supported Weil form is

\[
\boxed{
q_\lambda[f]=\frac1{2\pi}\int_{\mathbb R}\alpha(t)|\widehat f(t)|^2\,dt
 +2\Re\int_0^W e^{r/2}R_f(r)\,dr
 -2\Re\sum_{2\le n<\lambda^2}\frac{\Lambda(n)}{\sqrt n}R_f(\log n).
}
\tag{1}
\]

Endpoint atoms contribute zero because \(R_f(W)=0\). The finite prime-translation operator and the supported continuum kernel are bounded at each fixed support. The gamma term grows logarithmically and is bounded below; therefore (1) defines the canonical closed semibounded form on the stated domain.

This is exactly the V7 normalization with
\(m(t)=\Re\psi(1/4+it/2)-\log\pi\) and the original pole kernel
\(2\cosh((x-y)/2)\). Indeed

\[
\alpha(t)-m(t)=\frac1{t^2+1/4},
\]

whose convolution kernel is \(e^{-|x-y|/2}\). Subtracting this decaying kernel from the pole kernel leaves \(e^{|x-y|/2}\), the continuum term in (1). One must not add the old pole kernel again while retaining \(\alpha\).

The associated operator \(A_\lambda\) is defined by the closed form, not by invented boundary conditions. Reflection preserves both form and domain. Write

\[
H_{\lambda,+}=\{f\in H_\lambda:f(-y)=f(y)\},\qquad
\mathcal V_{\lambda,+}=\mathcal V_\lambda\cap H_{\lambda,+}.
\]

Complex even coefficients are allowed; the proof is a Hermitian-form statement.

## 2. The certified theorem

**Theorem.** At the exact cutoff \(X_*=16001/1000\), with
\(\lambda_*=\sqrt{X_*}\), there exists \(c_*>0\) such that

\[
q_{\lambda_*}[f]\ge c_*\|f\|_2^2
\quad\text{for every }f\in\mathcal V_{\lambda_*,+}.
\tag{2}
\]

The same constant works on every smaller centered even support, hence throughout \(1<\lambda\le\lambda_*\).

### Proof: the complete actual head and tail

In the physical even box basis,

\[
e_0=W^{-1/2},\qquad
 e_k(y)=\sqrt{2/W}\cos(2\pi ky/W),\quad k\ge1,
\]

let \(P_N\) project onto indices \(0,\ldots,N\), with \(N=2048\), and set \(Q_N=I-P_N\). Finite box modes belong to the actual operator domain. The canonical form decomposition is

\[
A_{\lambda_*,+}=
\begin{pmatrix}A_h&K^*\\K&D\end{pmatrix}.
\]

Here \(D\) is the **entire infinite** tail compression and \(K\) is the actual finite-head-to-tail coupling.

The audited all-support gamma remainder and even tail-trace bounds, combined with the freshly certified whole-prime norm envelope
\(P_*=3.80364\), give

\[
D\ge L:=\operatorname{diag}_{j>N}d_j>0,
\]
\[
d_j=\alpha(2\pi j/W)-\Gamma_{\rm ref}(W)-P_*-H_K(W)/N,
\tag{3}
\]

where

\[
\Gamma_{\rm ref}(W)=1.853+\frac3{5W}
 +\frac45\frac{e^{-5W/2}}{1-e^{-2W}},\qquad
H_K(W)=\frac{W[W+2(1-e^{-W/2})]}{2\pi^2}.
\]

The digamma series makes \(d_j\) increasing for every future index; the outward initial bound is
\(d_{2049}>0.7311865968\). Thus (3) is not a sampled finite-tail minimum. The prime norm comes from an exhaustive seven-step weighted-Schur path enumeration of the full translation operator, not a finite prime matrix.

Positive inverse order gives \(D^{-1}\le L^{-1}\). The complete diagonal-inverse self-energy is split at \(J=16384\): every actual near row \(2049\le j\le16384\) is evaluated, and the infinite far rows receive an all-head upper majorant

\[
K^*D^{-1}K
\le K_{\rm near}^*L_{\rm near}^{-1}K_{\rm near}
 +P_f^*H_fP_f+\operatorname{rem}I.
\tag{4}
\]

This splits an upper majorant of the true inverse energy; it does **not** assert a near/far decomposition of \(D^{-1}\).

The actual entries include all ten active prime powers
\(2,3,4,5,7,8,9,11,13,16\). The old exact-X16 quarter/half-phase shortcuts are not used. In the far construction, the nearly resonant ratios
\(16,1/16,256,1/256\) are retained with their signed moments. Every other phase is included through a verified global Abel allowance. Forty-eight finite inverse-weight bands and the infinite final plateau are retained. The all-sequence bounds \(B=3\), \(C_\beta=13/10\), beta-error terms and geometric remainder are all justified at this support.

Define

\[
C=A_h-K_{\rm near}^*L_{\rm near}^{-1}K_{\rm near}
       -\operatorname{rem}I,
\qquad H_f=FF^*,\qquad Z=F^*P_f.
\]

The complete outward tests establish

\[
C>0,\qquad I-ZC^{-1}Z^*>0.
\tag{5}
\]

There are 2049 core pivots, 72 coefficient-factor pivots and 72 final whitened-Schur pivots; **every one passes**. The exact bordered-Schur identity gives
\(C-Z^*Z>0\). Consequently the true finite head Schur complement satisfies

\[
S=A_h-K^*D^{-1}K\ge C-Z^*Z>0.
\]

Square completion on the full form domain yields

\[
q_{\lambda_*}[x+y]
 =\langle Sx,x\rangle+q_D[y+D^{-1}Kx].
\]

The positive finite-dimensional Schur matrix has some positive minimum eigenvalue, \(D\) has a uniform positive floor, and the triangular map and its inverse are bounded. Hence the complete even form has a positive coercive lower constant. **No minimum LDL pivot is substituted for that constant.**

Finally, centered zero extension from a smaller supported even form domain preserves the norm and the actual form (1). The inequality therefore passes to every smaller support by form closure, proving the range in (2). ∎

## 3. Numerical validation and reproducibility

The arithmetic is outward Arb through `python-flint 0.9.0`, at fixed 1000-bit precision. Midpoints choose pivot permutations only; full interval signs certify positivity.

| Completed gate | Result | Minimum relative accuracy |
|---|---|---:|
| 2049-dimensional complete core | PASS | 314 bits |
| 72-dimensional coefficient factor | PASS | 939 bits |
| 72-dimensional whitened Schur matrix | PASS | 316 bits |
| All 10,437 retained-phase moments | independently recomputed | 942 bits after serialization |

Independent complete replay reproduced every non-timing matrix field, including permutation, interval strings and source/cache maps. Every scalar moment was independently regenerated with the reviewed integral and explicit infinite integration-tail bound. This is independent execution and mathematical/source review using the same Arb library—not a second arithmetic implementation or proof-assistant formalization.

The finite head has 2049 modes. The 72 far features do not make this a 72-mode verification algorithm. Nor does positivity of a Fourier tail identify a candidate complement or an actual ground eigenfunction.

The clean-checkout source/dependency manifest lists eight production Python sources, the optional old-builder actual-entry gate dependency, precise execution order and all reference hashes. Large scalar caches regenerate completely and need not be committed. Run reproduction in a disposable copy: producer scripts write their output filenames. Compare mathematical fields and key-indexed balls; elapsed times and completion-order-dependent cache file hashes need not reproduce in a fresh run.

## 4. The failed X16.1 route is retained

At the exact cutoff \(X=161/10\), fresh scalar/phase inputs and all 10,437 new-support moments pass independent review and replay. The complete producer core and coefficient factor are positive, but its first final whitened-Schur pivot is

\[
[-0.67466475329694705406237169670012908836\ldots
 \;\pm1.20\times10^{-61}].
\]

This is a strict failure of the sufficient lower surrogate, not a rounding ambiguity. Because the actual Schur matrix is only bounded **below** by that surrogate, a negative surrogate direction does not prove actual form negativity. The full failed matrix run was inspected and source-pinned, but was not independently rerun; the prerequisite and scalar-cache replays were completed. These distinctions must remain separate in an app's status display.

No pending directional repair or higher-power prerequisite is promoted to a completed whole-space certificate.

## 5. Boundary of the RH implication

A finite-support coercivity certificate cannot be extrapolated to unbounded supports. It gives no support-independent lower floor along a cofinal sequence, no actual ground-branch selection and no convergence to the distinguished zeta-related candidate. Those are separate missing family theorems. The successful endpoint and the failed next-support route are useful audited finite results; neither closes the RH gap.

## Canonical source and audit map

- Form/domain normalization: `output/pdf/rh_research_paper_v7_20261030/source/sections/06-07-spectral-bridge.tex`, first subsection; equivalent 5/4-gamma form in `frequency_sensitive_bound/FREQUENCY_BLOCK_SUPPORT_BOUND.md` and `rh_attack_cycle_20261030/actual_translation_graph/ACTUAL_JUMP_GRAPH_AND_COUNTERTERM.md`.
- Accepted theorem and complete independent audit: `rh_attack_cycle_20261030/independent_review/GENERIC_X16001_COMPLETE_EVEN_POSITIVITY_AUDIT.md` and companion JSON.
- Full majorant derivation and producer certificate: `rh_attack_cycle_20261030/support_endpoint_continuity/GENERIC_FULL_MAJORANT_METHOD.md` and `GENERIC_FULL_EVEN_CERTIFICATE.json`.
- Independent comparison: `rh_attack_cycle_20261030/independent_review/generic_full_majorant_replay_workspace/INDEPENDENT_GENERIC_REPLAY_COMPARISON.json` and `INDEPENDENT_COMPLETE_CACHE_RECOMPUTATION.json`.
- Failed next-support audit: `rh_attack_cycle_20261030/independent_review/GENERIC_X161_PARAMETERIZATION_AND_FAILED_GATE_AUDIT.md` and companion JSON.
- Failed certificate and diagnostic record: `rh_attack_cycle_20261030/support_endpoint_X161/FAILED_FULL_TEST.md`.
- Compact clean-checkout manifest: the bundled spectral reproduction manifest and `REPRODUCE.md`.
