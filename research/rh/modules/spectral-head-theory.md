# An actual near-null spectral head, without deleting source traces

## Status and scope

This is an **accepted analytic theorem and a proof of its reduction to explicitly stated, independently audited analytic lemmas**. It is not a numerical spectral run or a finite-support positivity certificate. The final theorem is the critical power-four/logarithmic cutoff; the preceding bandwidth-scale repair theorem supplies its actual operator-action estimate.

The exact current source/audit pairs and proof-use dependency edges are in `research/rh/spectral-head/DEPENDENCY_INVENTORY.json`. In particular, the final source is pinned by `CRITICAL_POWER_FOUR_ACTION_HEAD_AUDIT`, with status `PASS_UNIFORM_CUTOFF_ACTUAL_ACTION_AND_RANK`; the trace-repair source is pinned by `FULL_DEEP_HEAD_TRACE_REPAIR_ACTION_AUDIT`, with status `PASS_FULL_ACTUAL_ACTION_TRANSFER`. Historical “review requested” source headers are superseded only for the exact source bytes recorded by those receipts.

The proof below states the deep channel and prolate lemmas it uses. It does not purport to re-prove their entire compact-operator and ODE foundations in this short module. Their current accepted source/audit pairs are supplied, rather than replacing them by a numerical experiment or an unspecified “spectral dictionary.” The final theorem is not conditional on an unproved complement estimate. Internal independent review is not external peer review or formal verification. Analytic source availability is **partial**: the selected current source/audit chain is bundled, but classical proofs and auxiliary scalar-check outputs referenced within audits are not exhaustively reproduced; no executable replay is claimed.

## 1. Exact spaces, maps and operator

Let \(\lambda>1\), \(\ell=\log\lambda\), and
\[
X_\lambda=L^2_{\mathrm{even}}[-\ell,\ell].
\]
All logarithmic functions are extended by zero when computing full-line Fourier transforms and correlations. For the unitary angular Fourier transform write
\[
a_\Gamma(t)=\Re\psi(5/4+it/2)-\log\pi,
\quad R_{f,h}(r)=\int\overline{f(x)}h(x+r)\,dx.
\]
Here \(\psi\) is the digamma function. The actual fixed-support Weil form is
\[
q_\lambda(f,h)=\int a_\Gamma(t)\overline{\widehat f(t)}\widehat h(t)\,dt
+\int_0^\infty e^{r/2}\{R_{f,h}(r)+R_{f,h}(-r)\}\,dr
-\sum_{n\ge2}\frac{\Lambda(n)}{\sqrt n}
 \{R_{f,h}(\log n)+R_{f,h}(-\log n)\}.
\]
On fixed support the last two terms are bounded operators; only finitely many prime-power translations have nonzero overlap. The form domain is the supported even subspace with
\(\int\log(2+|t|)|\widehat f(t)|^2dt<\infty\).
Let \(H_\lambda\) be its associated selfadjoint operator. This is the **5/4 normalization**: its continuum term already includes the old pole correction. No additional pole kernel is to be appended. No global ordinary-\(L^2\) Weil closure is asserted.

On the additive interval \([-\lambda,\lambda]\), use the finite Fourier operator
\[
(C_\lambda g)(t)=\int_{-\lambda}^{\lambda}g(s)e^{2\pi ist}\,ds.
\]
For additive sources use the distinct transform
\[
(\mathcal F_{\mathrm{add}}v)(t)=\int_{\mathbb R}v(s)e^{2\pi ist}\,ds,
\]
with the source extended by zero. This is not the angular transform of the logarithmic-window functions above. Its even prolate eigenfunctions \(e_n\) have full additive norm one, signed eigenvalues \(\chi_n\), and concentration deficits \(\delta_n=1-|\chi_n|^2\). Put \(c=2\pi\lambda^2\); the differential eigenvalue \(\nu_n\) uses
\(-((1-x^2)u')'+c^2x^2u=\nu_nu\) on \([-1,1]\).

The literal arithmetic image is
\[
(E_{\rm raw}g)(x)=e^{x/2}\sum_{1\le n<\lambda e^{-x}}g(ne^x),
\qquad F_g=E_{\rm even}g=\tfrac12(E_{\rm raw}g(x)+E_{\rm raw}g(-x)),
\quad |x|<\ell.
\]
The sum is finite. This map is neither asserted isometric nor identified with a Weil ground-space projector.

## 2. The theorem

Fix \(r>0\), set \(w=1+\log\lambda\), and define
\[
a_\lambda=\lambda^{-4}w^{-(3+2r)},\qquad
G_\lambda=\operatorname{span}\{e_n:\chi_n>0,\ \delta_n\le a_\lambda\}\cap\mathbf1^\perp,
\qquad \mathcal F_\lambda=E_{\rm even}G_\lambda.
\]
Then, for all sufficiently large \(\lambda\),
\[
\mathcal F_\lambda\subset\operatorname{Dom}(H_\lambda),\qquad
\|H_\lambda F\|\le C_r w^{-r}\|F\|\quad(F\in\mathcal F_\lambda).
\tag{T1}
\]
There are **no source-origin or source-endpoint trace constraints**. Its guaranteed dimension is
\[
\dim\mathcal F_\lambda\ge\lambda^2-\frac4{\pi^2}(\log\lambda)^2
-\frac{3+2r}{\pi^2}\log\lambda\log(1+\log\lambda)-C_r\log\lambda.
\tag{T2}
\]
The constants and support onset are not made effective. The quantifier is “for each fixed \(r\), eventually”; it does not allow \(r\) to grow with \(\lambda\).

## 3. The actual coordinate Gram: an input, not an energy theorem

The accepted all-mean-zero-head lemma is
\[
\|E_{\rm even}g\|\ge\frac{\|g\|}{40\sqrt2\lambda}
\tag{G}
\]
for every mean-zero source in the entire signed positive threshold head \(\chi_n\ge1/2\), eventually. This supplies injectivity and output normalization only.

Here is the precise mechanism behind this lemma. Let \(P_v\) retain \(\lambda^{-1}<|y|<\lambda\) in additive coordinates. The literal finite Möbius inverse and logarithmic isometry define \(L_{\rm even}\), with
\(\|L_{\rm even}g\|\le2\sqrt2\lambda\|E_{\rm even}g\|\).
Legitimate paired sharp-source Poisson summation gives
\[
2L_{\rm even}g=P_v(I+C_\lambda)g+T_{\rm even}g-g(0)r_{\rm even},
\quad r(y)=\frac{M_1(\lambda/y)}{2y},\quad M_1(R)=\sum_{d\le R}\frac{\mu(d)}d.
\]
This is an ordinary paired limit, not an assertion of absolute convergence of an unpaired Fourier lattice series.

The exact positive-head compression and double-commutator estimate yield
\[
\Re\langle P_vg,(I+C_\lambda)g\rangle
\ge\left(\frac{4\sqrt3-3}{8}-\frac2\lambda\right)\|g\|^2.
\]
The independently audited actual collar/Hardy/channel lemmas give
\[
|\langle P_vu,T_{\rm even}g\rangle|
\le(B_0+o(1))\|u\|\|g\|,
\quad B_0=4\sqrt{\frac{(\log4-3/4)\log3}{4\pi^2}
                         \left(\frac{15}{\pi^2}-1\right)}<0.386.
\]
They retain the moving arithmetic cutoff and all finite channel endpoints. The requisite foundations are the actual strong/weak head limits, finite-collar collective Bessel bound, uniform collar-tail bound, and reciprocal-sampling reduction. They do not assume favorable unknown arithmetic cancellation.

Finally \(|g(0)|^2\le8\|g\|^2/(3\pi^2\lambda)\) and
\(\|r_{\rm even}\|^2=(2\lambda)^{-1}\int_1^{\lambda^2}|M_1(R)|^2dR=o(\lambda)\)
by ordinary unconditional Mertens/PNT. Thus the **complete origin correction** is \(o(1)\|g\|\) in norm. Since the limiting main constant exceeds \(0.491\), a strict gap remains:
\(2\Re\langle P_vg,L_{\rm even}g\rangle\ge\|g\|^2/10\) eventually. Cauchy–Schwarz proves (G). A trace-block diagonal alone would not prove this estimate.

## 4. Uniform prolate estimates actually needed

For the rest of the proof take a cutoff
\[
\lambda^{-5}\le a\le\lambda^{-3}
\tag{U}
\]
and mean-zero \(g\) in the positive head with \(\delta_n\le a\). Write \(b_n=e_n(\lambda)\). A fixed positive-phase reference has \(0<c^2-\nu_{\rm ref}<10c\).

The accepted action-strip lemma states, for each fixed \(A>0\), uniformly over the threshold range \(|\chi_n|\ge1/2\) and \(\delta_n\ge\lambda^{-A}\) (hence \(\delta_n\le3/4\)),
\[
|\nu_n-c^2|\le32c\log(10/\delta_n),\qquad
|\nu_n-\nu_{\rm ref}|\le40c\log(10/\delta_n)
\]
eventually. Its constants do not depend on \(A\), though its onset may. The weighted-Prüfer lemma supplies
\(|b_n|^2\le C_A\lambda\delta_n/\log c\) on such a polynomial window; it is applied only after checking the actual differential-width hypotheses. The global one-well endpoint bound is \(|b_n|^2\le C\lambda\delta_n\).

Use **one fixed split** \(b=\lambda^{-11}\), not a parameter-dependent application of a fixed-exponent theorem. KRD layer cake gives
\[
\sum_{\delta_n\le a}\delta_n\log^2(10/\delta_n)
 \le C(1+\beta)a\log^3(10/a),\quad
\beta=\frac2{\pi^2}\log(200\lambda^2+25).
\]
On \(b\le\delta_n\le a\), the endpoint \(1/\log c\) gain cancels \(\beta=O(\log c)\). On \(\delta_n<b\), use the global endpoint bound, \(|\nu_n-\nu_{\rm ref}|\le2c^2\), and the cumulative first moment. Its row cost is at most \(C\lambda c^4\lambda^{-11}w^2\), which is \(O(\lambda^{-2}/w)\) of the target uniformly under (U). Therefore
\[
\sum_{\delta_n\le a}|b_n|^2(\nu_n-\nu_{\rm ref})^2
 \le C\lambda c^2 a w^3,
\quad |g(\lambda)|^2\le C\lambda a w\|g\|^2.
\tag{R}
\]
The same calculation without the differential weight proves the trace bound. Mean zero and the exact concentration-defect diagonal yield the sharper origin estimate
\[
|g(0)|^2\le\frac{2a}{\pi^2\lambda}\|g\|^2.
\tag{O}
\]
For clarity, (O) requires no missing origin-trace lemma. Since
\(\int e_n=\chi_ne_n(0)\), mean zero implies
\(g(0)=\sum_n(1-\chi_n)g_ne_n(0)\).
For \(\delta_n\le a<1/4\),
\((1-\chi_n)^2/[\chi_n^2(1-\chi_n^2)]\le a\).
Cauchy–Schwarz and the concentration kernel \(K=C_\lambda^2\) give
\[
|g(0)|^2\le a(K-K^2)(0,0)\|g\|^2
\le a\int_{|t|>\lambda}\frac{dt}{\pi^2t^2}\|g\|^2
=\frac{2a}{\pi^2\lambda}\|g\|^2.
\]
Thus the exact defect-diagonal calculation, compatible with the all-head Gram proof, is rederived here. No source trace is assumed zero in (R) or (O).

## 5. Pay for both source repairs at the correct bandwidth

Let \(b_g=g(\lambda)\), \(d_g=g(0)\), and \(h=1/(4\lambda)\). Set
\[
\rho(t)=(1-t)^4(1+4t-35t^2),\quad
p(s)=\rho((\lambda-|s|)/h)\quad(\lambda-h\le|s|\le\lambda),
\]
and zero elsewhere in the additive interval. Then \(p\) is even, \(p(\pm\lambda)=1\), \(p(0)=0\), and \(\int p=0\). Choose a fixed even smooth \(\eta\), supported in \((-1,1)\), with \(\eta(0)=1\), \(\int\eta=0\), and set \(\eta_\lambda(s)=\eta(\lambda s)\). Define
\[
v=g-b_gp-d_g\eta_\lambda.
\]
Now \(v(0)=v(\pm\lambda)=\int v=0\). Its zero extension is continuous with derivative of bounded variation, and it is smooth near zero. It belongs to the declared radical source class. Since \(E_{\rm raw}\eta_\lambda=0\) on the visible logarithmic window,
\[
F_v=F_g-b_gF_p.\tag{I}
\]
The repair width matters: making it arbitrarily thinner would increase the Fourier derivative cost and would not establish the same bound.

The complete divided-difference lemma and (R) bound the Fourier transform of \(g\), after subtracting its common reference outgoing wave. The subcritical reference and the actual endpoint repair each differ from \(\sin(2\pi\lambda t)/(\pi t)\) by \(O(\lambda/t^2)\) for \(t\ge2\lambda\). The reference statement follows from its integrable Liouville potential and terminal Volterra formula; the repair statement retains its sharp endpoint term in two integrations by parts. Together with (O), these give
\[
|(\mathcal F_{\mathrm{add}}v)(t)|\le C\sqrt{aw^3}\,\lambda^{3/2}t^{-2}\|g\|,
\quad t\ge2\lambda,
\]
and the exact concentration leakage plus repair norms gives
\(\int_\lambda^{2\lambda}|(\mathcal F_{\mathrm{add}}v)(t)|^2dt\le Caw^3\|g\|^2\).

All tail coordinates and weighted-tail norms below are on \(s\ge0\). The actual two-tail profile of the full evenly reflected arithmetic image is
\[
a_v(s)=\frac1{2\sqrt2}\sum_{m\ge1}R_mU_v(s),\quad
U_v(s)=\sqrt{2\lambda}e^{s/2}(\mathcal F_{\mathrm{add}}v)(\lambda e^s),\quad
R_mU(s)=m^{-1/2}U(s+\log m).
\]
The far bound gives \(\|e^sR_mU_v\|^2\le Caw^3m^{-4}\|g\|^2\); the separate near piece makes this true also for \(m=1\). Minkowski and \(\sum m^{-2}<\infty\) prove
\[
\|e^sa_v\|\le C\sqrt a\,w^{3/2}\|g\|.\tag{V}
\]
This is the complete common-domain two-tail profile, not a single additive mode.

## 6. From radical tails to the actual supported action

The accepted radical lemma defines the global *paired form* on
\(H^s(\mathbb R)\cap L^2(e^{2a_*|x|}dx)\), with \(0<s<1/2\) and \(1/2<a_*<3/2\). For the repaired source its full arithmetic image annihilates this paired form by the Weil explicit formula. Sharp supported restriction is legitimate. This argument does not assume RH or a global unweighted selfadjoint Weil operator.

The separate Carleman/continuum/prime theorem is the actual operator statement
\[
\|H_\lambda F_v\|\le C\lambda\|e^sa_v\|.
\tag{A}
\]
It includes both exterior tails and the full growing cross-prime charge. A small quadratic energy alone would not imply (A).

The physical endpoint-repair image must also be charged. The intervals supporting \(p(ny)\) are disjoint because \((n+1)h<\lambda\) for the relevant \(n<\lambda^2\). Hence
\(\|F_p\|^2\le Cw/\lambda\), while its zero-extended logarithmic total variation is \(O(\lambda^{3/2})\), including sharp jumps. The BV Fourier bound, split at frequency \(\lambda^5\), gives
\(\|\Gamma F_p\|^2\le Cw^3/\lambda\).
The bounded continuum and prime parts have norm \(O(\lambda)\), the latter by unconditional Chebyshev. Thus
\[
F_p\in\operatorname{Dom}(H_\lambda),\qquad
\|H_\lambda F_p\|\le C\sqrt{\lambda w}.
\]
By (R), its complete cost is
\(|b_g|\|H_\lambda F_p\|\le C\lambda\sqrt a\,w\|g\|\).
Combining (I), (V), and (A) proves
\[
F_g\in\operatorname{Dom}(H_\lambda),\quad
\|H_\lambda F_g\|\le C\lambda\sqrt a\,w^{3/2}\|g\|.
\]
Now and only now use the coordinate Gram (G):
\[
\frac{\|H_\lambda F_g\|}{\|F_g\|}
\le C\lambda^2\sqrt a\,w^{3/2},\qquad \lambda^{-5}\le a\le\lambda^{-3}.
\tag{U1}
\]
For fixed \(r\), \(a_\lambda\) eventually lies in this interval, and substitution yields (T1). The older fixed-\(A>4\) consequence is \(O_A(\lambda^{2-A/2}w^{3/2})\) at \(a=\lambda^{-A}\); the critical theorem is **not** obtained by silently replacing that fixed \(A\) by a varying exponent.

## 7. Rank and the physical bridge

The checked KRD guaranteed prefix consists of positive-phase labels \(n\equiv0\pmod4\) satisfying
\[
n\le\lfloor4\lambda^2\rfloor-7-\beta\log(10/a_\lambda),
\quad \beta=\frac2{\pi^2}\log(200\lambda^2+25).
\]
The concentration prefix and deficit moments use Karnik–Romberg–Davenport, Corollaries 3–4, in the stated normalization ([primary paper, v2](https://arxiv.org/pdf/2006.00427v2)). Only the mean constraint costs a dimension. Counting the labels and using injectivity from (G) proves (T2). The \(-C_r\log\lambda\) remainder is the precise lower-bound interpretation, not a claim of exact dimension.

Let \(P_{\rm phys}\) be the orthogonal **physical logarithmic \(L^2\)** projector onto \(\mathcal F_\lambda\). For fixed \(M>0\), (T1) implies
\[
P_{\rm phys}(H_\lambda+M)P_{\rm phys}
\ge(M-C_rw^{-r})P_{\rm phys},\quad
\|(I-P_{\rm phys})H_\lambda P_{\rm phys}\|\le C_rw^{-r}.
\]
These are actual head and off-head action bounds. They do not identify the physical projector with an untransformed additive or gamma-coordinate projector.

## 8. What remains unproved

Nothing above supplies a lower bound on the correctly projected complementary diagonal block or its inverse-weighted Schur charge. The entire transition head \(\chi\ge1/2\) is not claimed near-null: concentration-deficit selection is essential. The theorem gives no effective onset, no numerical endpoint floor, no global/cofinal Weil lower bound, no actual ground-space identification, and no proof of RH.

The accepted finite-support certificate and the separate signed-complement obstructions are different modules. They must not be used as substitutes for the missing complement inequality here.
