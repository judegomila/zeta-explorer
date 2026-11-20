# A failed sufficient bound, repaired at the same support

## Accepted theorem

**Accepted through independent internal analytic/source review and complete replay—not external peer review or formal verification:** for the actual reflection-even supported Weil form there is a constant \(c_*>0\) such that
\[
q_\lambda[f]\ge c_*\|f\|_2^2
\qquad(1<\lambda\le\sqrt{161/10})
\]
for every even, possibly complex-valued \(f\), supported in \([-\log\lambda,\log\lambda]\), whose zero extension satisfies
\[
\int_{\mathbb R}\log(2+|t|)|\widehat f(t)|^2\,dt<\infty.
\]
The constant is existential; **no numerical coercivity floor is extracted from matrix pivots**. This is a complete infinite-dimensional even-space theorem, not an odd-space, cofinal-support or RH result.

With \(\widehat f(t)=\int f(x)e^{-itx}dx\), \(W=2\log\lambda\), and \(R_f(s)=\int\overline{f(x)}f(x+s)dx\), the precise form is
\[
q_\lambda[f]=\frac1{2\pi}\int\bigl[\Re\psi(5/4+it/2)-\log\pi\bigr]|\widehat f(t)|^2dt
+2\Re\int_0^W e^{s/2}R_f(s)ds
-2\Re\sum_{2\le n<\lambda^2}\frac{\Lambda(n)}{\sqrt n}R_f(\log n).
\]
This is the same canonical form and domain as the preceding supported-even certificate. Its 5/4 gamma normalization already accounts for the old pole correction. Endpoint atoms have zero overlap. The fixed-support form is closed and semibounded; no global unweighted Weil closure is assumed.

The distinct terminal acceptance is `GENERIC_X161_POWER8_COMPLETE_EVEN_POSITIVITY_AUDIT`. It does not rewrite the earlier accepted \(X=16001/1000\) certificate or the failed seventh-power \(X=161/10\) receipt.

## 1. What failed—and what did not

At the exact support \(X=\lambda^2=161/10\), the earlier seventh-power comparison produced a rigorously negative first whitened Schur pivot,
\[
-0.674664753296947\ldots.
\]
Its 2,049-dimensional core and 72-dimensional far coefficient factor were positive. Thus a **sufficient lower surrogate** failed. The negative pivot did not prove a negative vector of the actual Weil form.

The targeted repair keeps the physical support, all actual head entries, head–tail couplings, prime translations, phases and raw scalar moments unchanged. It reduces a conservative inverse-tail allowance. The historical failure remains recorded as a genuine failed certificate, not relabeled as a numerical mistake.

## 2. A stronger whole-prime bound

The old entire supported prime-translation norm envelope was
\[
P_{\rm old}=\frac{3805113}{10^6}=3.805113.
\]
An exact rational path enumeration for the **eighth power** of that same supported operator gives a norm upper bound below \(3.790592596\), and hence
\[
P_{\rm new}=\frac{3790593}{10^6}=3.790593,
\qquad \Delta=P_{\rm old}-P_{\rm new}
=\frac{363}{25000}=0.014520.
\]
The enumeration retains all admissible paths: 2,409,206 final rational states and 26,978 exact support breakpoints. Its weighted positive-kernel Schur bound controls the entire prime operator, not a truncated Fourier matrix. Independent replay reproduced every nontiming scalar field. The prime bound alone is not the positivity theorem.

## 3. The minimal inverse-order repair

Split the physical even box basis into the head \(k=0,\ldots,2048\) and its entire infinite tail. Let \(D\) denote the actual tail form. The already audited gamma/continuum comparison combined with the stronger prime norm gives, for **all** tail indices,
\[
D\ge\operatorname{diag}(d_{\rm new,j})>0,
\qquad d_{\rm new,j}=d_{\rm old,j}+\Delta.
\]
Its uniform tail floor exceeds \(0.7425026529\). This is a whole-tail floor, not yet the full head–tail theorem.

In the near range \(2049\le j\le16384\), use the exact improved weights \(1/d_{\rm new,j}\). For every farther index,
\[
\frac1{d_{\rm new,j}}\le\frac1{d_{\rm old,j}}\le\omega_{\rm old,j},
\]
where the old monotone step profile includes its infinite plateau. Therefore the old all-head far majorant \(P^*H_{\rm far}P+\varepsilon I\) is still valid **without changing either \(H_{\rm far}\) or \(\varepsilon\)**.

No near-resonant channel is deleted. No moment value is reinterpreted at a different support. No unproved Loewner ordering between newly assembled signed coefficient matrices is needed. The new far diagonal floor and the old reference floor used to build \(H_{\rm far}\) are reported separately.

## 4. The complete finite gate and its infinite-dimensional implication

The resulting sufficient head form is
\[
M=A_{\rm head}
-\sum_{j=2049}^{16384}\frac{K_j^*K_j}{d_{\rm new,j}}
-P^*H_{\rm far}P-\varepsilon I.
\]
It includes the complete near inverse charge and the majorized **entire** far tail. The energy anchor is zero; there is no positivity-producing rank-one lift.

Writing the core as
\(C=A_{\rm head}-\sum K_j^*K_j/d_{\rm new,j}-\varepsilon I\), factoring \(H_{\rm far}=FF^*\), and setting \(Q=F^*P\), the validated calculation checks
\[
C>0,\qquad H_{\rm far}>0,\qquad I-QC^{-1}Q^*>0.
\]
All 2,049 core pivots and both sets of 72 auxiliary pivots are strictly positive. The complete producer run took 200.31 seconds; the independent full replay took 200.24 seconds and reproduced every nontiming field, including the elimination order and source maps. Minimum retained accuracies were 264, 954 and 263 bits.

The smallest whitened pivot, approximately \(0.219924\), is a sign-check diagnostic only. The finite positive Schur lower form together with the strictly positive entire-tail comparison implies actual whole-even coercivity by the block-form Schur argument. Restriction by zero extension supplies the same existential constant for every smaller centered support. This is why neither a positive tail alone nor a positive finite head alone would have sufficed.

## 5. Reproduction and preserved evidence

The separate `research/rh/spectral-repair/` package contains only three new executable sources: the eighth-power enumerator, the minimal input wrapper, and the repaired certificate driver. It depends explicitly on the unchanged first `research/rh/spectral/` package and its pinned X161 builder/cache-generator version.

A clean replay regenerates both old and new prime receipts and all 10,437 same-support moments, checks the literal-entry/scalar/cache gates, and runs the small and complete repaired gates. It compares every regenerated moment row through the canonical key-indexed nontiming digest and compares all mathematical certificate fields. Original receipts remain separate from disposable runtime outputs. No bulk cache or discovery-factor array is required in the repository.

The frozen-direction investigation motivated this repair but is not a prerequisite of its complete sign proof. The first package remains frozen at its original accepted and failed outcomes; this follow-up supplies a distinct successful sufficient comparison and distinct independent acceptance.

The result supplies no odd-sector theorem, distinguished-ground identification, all-support bound or proof of RH. The new endpoint is an endpoint certified by these checks, not a claim that positivity stops there.
