# Short-packet Hardy-Z frequency audit

Date: 2026-11-04. Status: one unconditional absolute derivative lower bound, an unconditional mesoscopic implication of the already-verified cumulative inputs, and a precise unresolved constant-width relative-observability problem. No proof or counterexample to actual-selected coherence is claimed.

## 1. Findings

For the degree-locked Fejer packets in

`/workspace/shared/theta_degree_locked_20261104/FEJER_PACKETS_AND_HARDY_Z_OBSERVABILITY.md`,

there is a genuine theta-specific consequence of the Riemann-Siegel formula. After making the fixed packet bandwidth sufficiently small and the fixed kernel power sufficiently large, one has

\[
 D_n:=\int_{|u|\le n^\delta}\phi_n(u)^2 Z'(T_n+u)^2\,du
 \ \ge\ (2+o(1))\vartheta'(T_n)^2
       \int_{\mathbb R}\operatorname{sinc}(\omega_nu)^{4s}\,du
 \asymp \log^2 n.                                      \tag{1.1}
\]

Here any fixed \(0<\delta<1/2\) is allowed, with a sufficiently large fixed \(s\), and

\[
 \omega_n=\frac{m_n}{2Ln\sqrt{1-x_n^2}}\longrightarrow\omega>0.
\]

This is a bound for the **actual** \(\phi_n\), not an unsupported relative substitution of its limiting profile. The proof below uses an absolute weighted approximation, integration by parts, and isolation of the \(m=1\) Riemann-Siegel term. It does not differentiate an unspecified big-O remainder.

The result does **not** give

\[
 \frac{D_n}{M_n}\longrightarrow\infty,
 \qquad
 M_n:=\int_{|u|\le n^\delta}\phi_n(u)^2 Z(T_n+u)^2\,du.     \tag{1.2}
\]

The unresolved issue is an upper control of low-frequency arithmetic mass, or another genuinely relative estimate. A large absolute derivative norm is compatible with a still larger mass norm. No such uniform low-frequency estimate, and no counterexample using the actual zeta coefficients, was established in this audit.

Riemann-Siegel does not supply a growing frequency gap at zero. Its local frequencies extend from approximately \(\tfrac12\log T\) down to \(O(T^{-1/2})\). Thus a frequency-support argument by itself cannot prove (1.2). Section 4 gives a rigorous counterexample to that *methodological inference*, not to the theta statement.

The cumulative moment inputs do give the expected derivative/mass ratio \(\tfrac1{12}\log^2T\) for fixed-shape, slowly varying weights of width \(H\) when \(H/T^{5/12}\to\infty\). They do not give it for the fixed-scale carrier in (1.2).

## 2. An exact local-frequency model with an absolute error

Write \(\vartheta\) for the Riemann-Siegel phase, to distinguish it from the bulk endpoint parameter. Put

\[
 N=\lfloor\sqrt{T/(2\pi)}\rfloor,\qquad
 \lambda_m=\vartheta'(T)-\log m,
\]

\[
 P_T(u)=2\sum_{m\le N}\frac{1}{\sqrt m}
       \cos\bigl(\vartheta(T)-T\log m+\lambda_m u\bigr).   \tag{2.1}
\]

The classical approximate functional equation gives

\[
 Z(t)=2\sum_{m\le\sqrt{t/(2\pi)}}m^{-1/2}
       \cos(\vartheta(t)-t\log m)+O(t^{-1/4}).             \tag{2.2}
\]

An accessible primary research source stating a uniform version of the underlying approximate functional equation is Cormac O'Sullivan, *A generalization of the Riemann-Siegel formula*, Theorems 1.1–1.2. Its Theorem 1.4 gives the more precise symmetric Riemann-Siegel expansion. Only (2.2), not its higher correction terms, is needed here. [Author's paper](https://fsw01.bcc.cuny.edu/cormac.osullivan/Research/Riemann-Siegel-2nd-revision.pdf).

Stirling's formula gives

\[
 \vartheta'(T)=\tfrac12\log(T/(2\pi))+O(T^{-2}),\qquad
 \vartheta''(t)=O(T^{-1})\quad(t\asymp T).                \tag{2.3}
\]

If \(|u|\le H=o(\sqrt T)\), the cutoff in (2.2) differs from \(N\) by at most a bounded number of terms, each \(O(T^{-1/4})\). The phase linearization error is \(O(u^2/T)\); and

\[
 \sum_{m\le N}m^{-1/2}=O(T^{1/4}).
\]

Consequently, uniformly throughout that interval,

\[
 Z(T+u)=P_T(u)+O(T^{-1/4}+u^2T^{-3/4}).                  \tag{2.4}
\]

The same formula gives the sufficient crude bound

\[
 |Z(T+u)|\ll T^{1/4}\quad(|u|\le H),\qquad
 |P_T(u)|\ll T^{1/4}\quad(u\in\mathbb R).                \tag{2.5}
\]

No derivative estimate is needed for the argument in Section 3.

The frequencies satisfy

\[
 \lambda_1\sim\tfrac12\log T,\qquad
 \lambda_1-\lambda_m=\log m,
\]

\[
 -O(T^{-2})\le\lambda_N\le O(T^{-1/2}),\qquad
 \lambda_m-\lambda_{m+1}=\log(1+1/m).                    \tag{2.6}
\]

In particular, gaps between adjacent modes near the cutoff are of order \(T^{-1/2}\), and there are modes arbitrarily close to zero. The small possible negative error in \(\lambda_N\) is harmless and is not replaced by an unjustified strict positivity assertion.

## 3. Absolute derivative lower bound for the actual degree-locked packets

### 3.1 Parameters and an explicit weight comparison

Use the notation and the exact polynomial construction of the source note:

\[
 T=T_n\asymp n,\quad x_n=T_n/(Ln),\quad d_n=\sqrt{1-x_n^2},
 \quad m=m_n,\quad k_n=cT_n/2,
\]

\[
 \phi_n(u)=R_n(u) B_n(u)^s,
\]

\[
 R_n(u)=\frac{a(T_n+u)}{a(T_n)}(1+u/T_n)^{k_n},\qquad
 B_n(u)=\frac{E_n((T_n+u)/(Ln))}{E_n(x_n)}.
\]

Let \(H=n^\delta\), where \(0<\delta<1/2\) is fixed. Define

\[
 b_n(u)=\operatorname{sinc}(\omega_nu)^2,
 \quad\psi_n(u)=b_n(u)^s,
 \quad w_n(u)=\phi_n(u)^2,
 \quad w_n^*(u)=\psi_n(u)^2.
\]

All parameters except \(n\) are fixed. In particular, \(\omega_n\) is bounded above and below by positive constants. By decreasing \(\beta\), or increasing the fixed \(L\), arrange

\[
 4s\omega_n\le B<\log 2                              \tag{3.1}
\]

for all sufficiently large \(n\). This is compatible with the degree budget, including the additional carrier-pair degree reserve in Section 6A of the source note. Notice the convention: \(2s\omega_n\) is the Fourier bandwidth of \(\psi_n\); \(4s\omega_n\) is the bandwidth of the squared weight \(w_n^*\).

The following absolute comparison holds uniformly for \(|u|\le H\):

\[
 |w_n-w_n^*|+|w_n'-(w_n^*)'|
   \le\frac Cn(1+|u|)^{-4s+2}.                          \tag{3.2}
\]

Here is a direct verification, including the dependence needed for weighted integration. Let

\[
 v(u)=\arccos(x_n+u/(Ln))-\arccos x_n.
\]

Then

\[
 v=-u/(Ln d_n)+O(u^2/n^2),\quad
 mv/2=-\omega_nu+O(u^2/n),\quad
 (mv/2)'=-\omega_n+O(|u|/n).
\]

The main Fejer peak, after normalization, equals

\[
 \operatorname{sinc}(mv/2)^2
 \left(\frac{v/2}{\sin(v/2)}\right)^2(1+O(n^{-2}));
\]

the three remote peaks, and their first derivatives in \(u\), are \(O(n^{-2})\). For \(f(z)=\operatorname{sinc}(z)^2\), the real-axis bounds

\[
 |f(z)|+|f'(z)|+|f''(z)|\le C(1+|z|)^{-2}
\]

give

\[
 |B_n-b_n|+|B_n'-b_n'|\le C/n,
\]

while each of \(B_n,B_n',b_n,b_n'\) is bounded by \(C(1+|u|)^{-2}\). Taking the fixed \(s\)-th powers therefore gives

\[
 |B_n^s-b_n^s|+|(B_n^s)'-(b_n^s)'|
 \le Cn^{-1}(1+|u|)^{-2s+2}.                            \tag{3.3}
\]

The gamma envelope and the exact equality \(k_n=cT_n/2\) imply

\[
 |R_n-1|\le C(1+|u|)^2/n,\quad
 |R_n'|\le C(1+|u|)/n,
\]

throughout \(|u|\le n^\delta\). The exponential cancellation in \(R_n\) is essential here. Combining these bounds proves the corresponding estimate for \(\phi_n-\psi_n\), and multiplication by the decaying factors \(\phi_n,\phi_n',\psi_n,\psi_n'\) proves (3.2).

This argument uses the moving \(\omega_n\), so it does not require an unstated \(O(1/n)\) rate for \(x_n\to\alpha/L\). The integral of the right side of (3.2) is \(O(1/n)\) for every integer \(s\ge1\).

### 3.2 Fourier isolation without differentiating a remainder

Use the Fourier convention \(\widehat w(\xi)=\int w(u)e^{-i\xi u}\,du\). Set

\[
 W_n=\int_{\mathbb R}w_n^*(u)\,du\longrightarrow W>0,
 \quad\lambda=\vartheta'(T_n),\quad
 \chi(u)=\vartheta(T_n)+\lambda u.
\]

Because \(w_n^*=\operatorname{sinc}(\omega_nu)^{4s}\), both \(\widehat {w_n^*}\) and \(\widehat{(w_n^*)'}\) are supported in \([-4s\omega_n,4s\omega_n]\). The difference frequency between the \(m=1\) mode and any \(m\ge2\) mode is \(\log m\ge\log2\), outside that support. Every sum frequency \(\lambda+\lambda_m\) also lies outside it for large \(n\). Thus exact termwise integration of the finite sum gives

\[
 \int_{\mathbb R}w_n^*(u)P_{T_n}'(u)\sin\chi(u)\,du
       =-\lambda W_n,                                  \tag{3.4}
\]

\[
 \int_{\mathbb R}w_n^*(u)\sin^2\chi(u)\,du=W_n/2.       \tag{3.5}
\]

To transfer (3.4), integrate the actual derivative once by parts:

\[
 \int_{-H}^{H}w_n Z'(T_n+u)\sin\chi\,du
 = [w_nZ(T_n+u)\sin\chi]_{-H}^{H}
 -\int_{-H}^{H}(w_n'\sin\chi+\lambda w_n\cos\chi)
                   Z(T_n+u)\,du.                       \tag{3.6}
\]

Equations (2.4), (2.5), and (3.2) control all errors on the right absolutely. More explicitly:

* Replacing \(w_n,w_n'\) by \(w_n^*,(w_n^*)'\) costs \(O((1+\lambda)n^{-3/4})\).
* Replacing \(Z(T_n+u)\) by \(P_{T_n}(u)\) costs \(O((1+\lambda)T_n^{-1/4})\). The integrals of \((1+u^2)(|w_n^*|+|(w_n^*)'|)\) are uniformly bounded for \(s\ge1\).
* Extending the resulting polynomial integrals from \([-H,H]\) to \(\mathbb R\) costs \(O((1+\lambda)T_n^{1/4}H^{1-4s})\).
* The boundary term in (3.6) is \(O(T_n^{1/4}H^{-4s})\).

Choose the fixed power so that

\[
 (4s-1)\delta>1/4.                                    \tag{3.7}
\]

All these errors tend to zero, even with their logarithmic factors. Therefore

\[
 \int_{-H}^{H}w_n Z'(T_n+u)\sin\chi\,du
       =-\lambda W_n+o(1).                             \tag{3.8}
\]

Likewise (3.2), (3.5), and the elementary weight tail bound give

\[
 \int_{-H}^{H}w_n\sin^2\chi\,du=W_n/2+o(1).            \tag{3.9}
\]

Cauchy-Schwarz in \(L^2(w_n\,du)\) now proves (1.1). Real zeros of \(Z\), including multiple zeros, have not been deleted, divided out, or treated as singularities.

The same argument with \(Z\cos\chi\), without integration by parts, gives the harmless companion lower bound

\[
 M_n\ge(2+o(1))W_n.                                    \tag{3.10}
\]

It gives no upper bound for \(M_n\) of the size needed in (1.2). The completely elementary upper bound \(M_n\ll T_n^{1/2}\), obtained from (2.5), is much too weak: together with (1.1) it yields only \(D_n/M_n\gg T_n^{-1/2}\log^2T_n\).

### 3.3 Scope of the new lower bound

The proof is uniform over the specified explicit packet families with fixed parameters satisfying (3.1), (3.7). It is not a lower bound for every arbitrary degree-\(n\) polynomial packet. It concerns the exact \(n^\delta\) windows in the source note. Neither (1.1) nor that note proves that a fixed bounded interval contains most of the actual arithmetic energy.

## 4. Why the full local-frequency list is not an observability proof

For every fixed \(A>0\), the modes satisfying \(0\lesssim\lambda_m\le A\) include

\[
 e^{-A+o(1)}\sqrt{T/(2\pi)}\le m\le\sqrt{T/(2\pi)}.
\]

There are order \(\sqrt T\) such modes. Their diagonal coefficient mass is only

\[
 \sum_{e^{-A}N\lesssim m\le N}\frac1m=A+O(1),
\]

but the fixed-width weighted norm is not its diagonal approximation. If

\[
 S(u)=\sum_m c_m e^{i\lambda_m u},
\]

then exactly

\[
 \int w(u)|S(u)|^2\,du
   =\sum_{m,k}c_m\overline{c_k}\,
                  \widehat w(\lambda_k-\lambda_m).       \tag{4.1}
\]

For \(Z\), one must also retain the positive/negative frequency cross terms. For a fixed-bandwidth squared sinc weight, many off-diagonal factors in (4.1) are nonzero: adjacent differences are \(\asymp T^{-1/2}\), not larger than the fixed Fourier support. Positivity of the total Gram form does not make those individual terms negligible, and a diagonal estimate is not an upper bound.

Here is a rigorous obstruction to a coefficient-free inference. Retain both an isolated high mode and one of the actual frequency locations nearest zero, but choose different coefficients:

\[
 Y_T(u)=2\cos(\lambda_1u)+A_T\cos(\lambda_Nu),
 \qquad A_T=(\log T)^2.
\]

For any fixed integrable nonnegative squared-sinc weight of sufficiently small Fourier bandwidth, high/low cross terms vanish for large \(T\), and dominated convergence gives

\[
 \int wY_T^2\sim A_T^2\int w,
 \qquad
 \int w(Y_T')^2
       =2\lambda_1^2\int w+o(\lambda_1^2).
\]

Indeed the low-mode derivative contribution is at most \(A_T^2\lambda_N^2\int w=o(1)\). Hence the ratio tends to zero, even though the isolated high mode gives an absolute derivative lower bound of order \(\log^2T\).

This example changes the zeta coefficients. It is **not** an actual-theta counterexample. Its precise force is that neither the frequency locations nor the isolated \(m=1\) contribution implies the desired relative divergence. The arithmetic coefficients and their off-diagonal interactions must enter an additional argument.

An exact Poisson or Riemann-Siegel transformation is an identity. To complete the argument it would have to produce, and then bound, the remaining endpoint-frequency contribution or an equivalent relative error. Merely invoking that identity does not establish a bound for it.

## 5. One concrete sufficient low-frequency target

This subsection records a potentially useful stronger arithmetic target, not a proved estimate and not a replacement of the selected problem by an allegedly easier equivalent statement.

For a diagnostic envelope with no real zeros, take

\[
 q(u)=\operatorname{sinc}(\omega u)^2
       +\operatorname{sinc}(\omega u-\pi/2)^2,
 \qquad\phi(u)=q(u)^s.
\]

The sine and cosine numerators have no common zero, so \(q>0\). Direct estimates give \(q(u)\asymp(1+u^2)^{-1}\) and \(|\phi'|\le C\phi\). Its Fourier support is contained in \([-2s\omega,2s\omega]\). For large fixed \(s\), put

\[
 f_T(u)=\phi(u)Z(T+u),\quad M_T=\|f_T\|_2^2,
 \quad D_T=\|\phi Z'(T+\cdot)\|_2^2.
\]

Using sufficiently small \(\omega\), the isolated-mode argument also gives \(D_T\gg\log^2T\) for this envelope. Let \(P_{\le R}\) denote the orthogonal Fourier projection to \(|\xi|\le R\). The following additional statement would suffice:

\[
 \text{For every fixed }R>0,\qquad
 \|P_{\le R}f_T\|_2^2=o(\log^2T),
 \quad\text{uniformly as }T\to\infty.                   \tag{5.1}
\]

To see this, Parseval and \(\|f_T'\|_2\le\sqrt{D_T}+C\sqrt{M_T}\) imply

\[
 M_T\le\|P_{\le R}f_T\|_2^2
           +\frac{2D_T+2C^2M_T}{R^2}.
\]

For \(R^2>4C^2\), divide by \(D_T\), first let \(T\to\infty\), then let \(R\to\infty\). This gives \(M_T/D_T\to0\).

After freezing Riemann-Siegel, the Fourier projection in (5.1) receives contributions only from modes with

\[
 |\lambda_m|\le R+2s\omega,
\]

up to a small absolute approximation error obtained by (2.4) and the envelope's polynomial decay. Thus (5.1) asks for a specific endpoint Dirichlet-sum estimate with the actual phases \(e^{i\vartheta(T)-iT\log m}\). It is not supplied by the total coefficient square sum, zero counts, or global moments.

No proof of (5.1) was found. Also, this positive diagnostic envelope has not here been realized by the same fixed-parity degree-locked polynomial construction. It identifies a sufficient analytic mechanism but is not silently substituted for the actual \(\phi_n\).

## 6. What the cumulative moments do prove on mesoscopic scales

Use the two unconditional inputs already verified in

`/workspace/shared/theta_excess_independent_20261104/SELECTED_COMPACT_LOCALIZATION_AND_MONOMIAL_TEST.md`, Section 4:

\[
 \int_0^x Z(t)^2dt
   =x\bigl(\log(x/(2\pi))+2\gamma-1\bigr)+O(x^{\theta_0}),
 \qquad\theta_0<5/12,
\]

\[
 \int_0^x Z'(t)^2dt
   =\frac{x}{12}P_3(\log(x/(2\pi)))
           +O(x^{5/12}\log^3x),                         \tag{6.1}
\]

where \(P_3\) is monic. The derivative input is Korolev–Shubin, theorem on printed p.171 of their 2020 chapter. The publisher confirms the chapter and its error-term subject; this audit relies on the prior package's verification of the theorem text, rather than claiming that the publisher abstract itself displays the exponent. [Publisher](https://link.springer.com/chapter/10.1007/978-3-030-37904-9_9). For the first input, Bourgain–Watt's Theorem 4 provides a permissible \(\theta_0\). [Paper](https://arxiv.org/pdf/1505.04161).

Let \(v\ge0\) be a fixed nonzero \(C_c^1(\mathbb R)\) function, \(V_0=\int v>0\), and let \(H=o(T)\). Stieltjes integration by parts gives

\[
 \int v((t-T)/H)Z(t)^2dt
   =HV_0\bigl(\log T+O(1+H/T)\bigr)+O_v(T^{\theta_0}),
\]

\[
 \int v((t-T)/H)Z'(t)^2dt
   =HV_0\bigl(\tfrac1{12}\log^3T+O(\log^2T)
                                  +O((H/T)\log^2T)\bigr)
        +O_v(T^{5/12}\log^3T).                          \tag{6.2}
\]

The cumulative-error contribution has no extra factor of \(H\):

\[
 \left|\int v((t-T)/H)dE(t)\right|
 \le \sup_{t\asymp T}|E(t)|\int|v'(u)|du.
\]

It follows that whenever \(H/T^{5/12}\to\infty\),

\[
 \frac{\int v((t-T)/H)Z'(t)^2dt}
      {\int v((t-T)/H)Z(t)^2dt}
       \sim\frac1{12}\log^2T.                          \tag{6.3}
\]

This is a uniform-in-center mesoscopic consequence, with a fixed regular weight shape. It does not cover width \(H=O(1)\). Nor does it cover the fixed-scale sinc carrier merely because the integration domain was enlarged to \(|u|\le n^\delta\): that enlargement does not make the weight slowly varying on scale \(n^\delta\).

For a fixed-scale weight, integration by parts against the same derivative cumulative remainder produces an absolute error of order \(T^{5/12}\log^3T\), whereas the expected derivative weighted main term is only of order \(\log^3T\). No relative estimate follows.

## 7. Literature scope checks and exclusions

* Ivić's *On certain moments of Hardy's function Z(t) over short intervals* explicitly assumes RH throughout. Its stated short intervals satisfy \(H\ge T^\alpha\) for fixed \(\alpha>0\). These results therefore cannot supply the requested unconditional fixed-scale inequality. [Author's paper, p.1 and Theorems 1–2](https://arxiv.org/pdf/1612.01698).
* The official MSJ 2019 summary of Minamide–Tanigawa's talk states a cumulative error \(O(T^{1/2}(\log T)^{2k+1})\). That checked statement is not an improvement over the \(5/12\) derivative input used above and is not a fixed-width relative estimate. [Official meeting summary, item 36](https://www.mathsoc.jp/en/assets/file/meeting/kanazawa19sept/program/summary19sept_en_20190731.pdf).
* Jutila's 2015 paper studies short-interval signed means in a mean-square sense over a longer interval. The publisher's abstract does not assert a uniform estimate at every center. It cannot be promoted to one without an additional theorem. [Publisher abstract](https://www.sciencedirect.com/science/article/pii/S0019357715000658).
* Bui–Hall's 2023 work proves positive-proportion sign statements for products of fixed derivatives and states cumulative mixed-derivative mean formulas. Those statements do not give pointwise-in-center packet observability. [Research paper, introduction and Theorems 1–2](https://londmathsoc.onlinelibrary.wiley.com/doi/full/10.1112/blms.12859).

These checks are not a claim that every possible relevant paper has been exhausted. The mathematical conclusion is narrower and precise: the verified inputs and the exact local-frequency mechanism developed here do not establish (1.2).

No use has been made of RH, positivity of the signed theta potential, an assumed bulk coercivity inequality, an inverse generalized gap, singular splitting of \(F'/F\), total complex-zero counts as a substitute for real-axis energy, or numerical scans. Cumulative moments are used only for the explicitly mesoscopic statements, not to infer fixed-profile observability. An estimate only for almost all centers would not control a predetermined or selected exceptional sequence without an additional argument.

## 8. Consequence for actual-selected coherence

The source note proves that a proposed uniform degree-locked bulk coercivity theorem would force (1.2) for the explicit carrier-pair tests. This audit adds the nontrivial absolute lower bound (1.1), but it does not discharge that necessary relative condition. The packets have also not been shown to coincide with the X-selected polynomial or to be orthogonal to the old polynomial prefix.

Accordingly:

1. There is a valid theta-specific local-frequency fact: an isolated Riemann-Siegel high mode forces absolute packet derivative energy of order at least \(\log^2n\).
2. There is no completed uniform fixed-scale derivative/mass divergence proof here.
3. There is no actual-theta counterexample here.
4. A selected-only argument may still bypass the uniform packet problem, but requires new control tied to selection or to the actual arithmetic coefficient correlations.

All work was written to this fresh directory. Prior frozen packages were not modified. The argument is an AI-assisted analytical derivation, not machine-formalized or externally peer-reviewed.
