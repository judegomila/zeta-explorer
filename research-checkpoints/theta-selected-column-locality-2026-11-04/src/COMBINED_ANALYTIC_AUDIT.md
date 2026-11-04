# Combined analytic audit: uniform selected-column locality is impossible

2026-11-04. Verdict: PASS, relative to the explicitly supplied actual-source/reference and natural-family norm bounds. This is an analytic recheck by the author of the resonance note, independent of the matrix lemma's derivation; it is not external peer review or machine-formal verification.

Reviewed:

- `NO_FAST_SELECTED_MULTIPLICATION_TAIL.md`
- `MATRIX_LOCALITY_LEMMA.md`
- The actual W4 comparison and natural source-norm bounds cited in those notes.

## 1. Precise conclusion

Fix either parity ε∈{0,1}. Index the natural, individually X-normalized Pollaczek polynomials by degree d_k=ε+2k, k≥0. Let q_k be the actual X-orthonormal selected polynomial of degree d_k, with positive leading coefficient. Write q_j=Σ_(i≤j)c_(i,j)e_i.

There cannot exist constants K,γ,α>0 such that

    |c_(i,j)|≤K exp(−γ|i−j|^α)

for every 0≤i≤j. The constants must be uniform over the entire chosen parity. This is not a claim about bounds for a single finite prefix or about constants depending on the column. In the interleaved all-degree ordering, the same conclusion holds because the cross-parity coefficients vanish and same-parity degree distance is twice parity-index distance.

## 2. Matrix checks

For each finite prefix, C^TGC=I and diag G=1 imply H=G⁻¹=CC^T. The assumed triangular decay gives uniform absolute second off-diagonal moments of H. The coordinate inequality |v_i|²≤v^THv is correct because (H⁻¹)ii=1. Its use on localized vectors, followed by the stated IMS identity, gives a uniform lower bound H≥aI. No unstated uniform Riesz hypothesis is needed.

The weighted-conjugation argument is uniform in the finite prefix and its center. Choosing 0<β<min(α,1) gives inverse decay for C⁻¹. The band-matrix convolution estimate correctly absorbs polynomial growth into a weakened stretched exponential and gives fast decay in every fixed row of C⁻¹BC.

## 3. Actual natural-basis application

Let ψ_d be reference-orthonormal natural Pollaczek polynomials and s_d²=X[ψ_d]. The supplied natural estimates give c log²(d+2)≤s_d²≤C log³(d+2), after adjusting constants for finitely many small degrees; positive definiteness of X makes those adjustments legitimate.

The reference recurrence has coefficients a_d=√(d(d+7/2)), so multiplication by t² has bandwidth one in parity indices and entries O((d+1)²). Passing from ψ_d to e_d=ψ_d/s_d multiplies adjacent coefficients by s_(d±2)/s_d=O(√log(d+2)). Hence the stated polynomial bound O((k+1)^3) is valid. Normalizing monic rather than standard Pollaczek polynomials gives exactly the same e_d.

For a column n choose a prefix N≥n+1. Since t² raises polynomial degree by two, t²q_n lies in that prefix. Ordinary coefficient truncation B_N therefore has no boundary error on this column. Its selected coefficient vector is exactly C_N⁻¹B_NC_N times the n-th coordinate vector. X orthonormality identifies component i with X(t²q_n,q_i), in precisely the orientation required by the resonance theorem.

The lemma consequently gives |X(t²q_n,q_i)|≤D_i exp(−η|n−i|^β) for every fixed i. Replacing parity index n by degree ε+2n preserves stretched-exponential decay.

## 4. Analytic checks

The W4 lower source comparison bounds ||q_d||_W by exp(C log²(d+2)). The Pollaczek generating function, evaluated on radius 1−1/(d+2), bounds its reference evaluation kernel polynomially on each complex compact set. Complex Cauchy estimates then give locally uniform bounds of the form exp(C0 log²(d+2))(d+2)^(D_K) for each fixed derivative order.

A stretched-exponential selected row therefore makes R=Σb_d q_d converge normally, together with all fixed derivatives, on every complex compact set. Its source converges in L² because the selected sources are orthonormal and b∈ℓ². The local and L² limits agree, yielding TR∈L². This is sufficient for exponential integrability of FTR and F′TR, irrespective of any global growth of R. Fourier analyticity then justifies LR=f distributionally and, by smoothness, pointwise.

For the fixed row q_i, h=t² gives h′q_i=2tq_i, a nonzero polynomial. There is a simple real zero r of F outside its finite zero set. At this r, LR=f forces R(r)=0; the identity w″(r)=V(r)=2F′(r)² forces (LR)′(r)=0. But f′(r)=2F′(r)²h′(r)q_i(r)≠0. Thus the matrix consequence contradicts the analytic theorem in either parity.

## 5. Verified primary source for simple real zeros

Bui, Conrey and Young, *More than 41% of the zeros of the zeta function are on the critical line*, Acta Arithmetica 150 (2011), 35–64, Theorem 1.1, gives κ*≥0.4058. Immediately above the theorem, κ* is defined using the count of simple critical-line zeros. This is unconditional and in particular supplies infinitely many simple critical-line zeros.

Verified primary author manuscript, page 1:
https://arxiv.org/pdf/1002.4127

Stable record (version 2, 11 March 2011):
https://arxiv.org/abs/1002.4127v2

Journal DOI:
https://doi.org/10.4064/aa150-1-3

For the supplied actual theta transform, the known identity with a nonzero constant multiple of ξ(1/2+it) transfers these to simple real F zeros. The gamma and elementary factors in ξ are analytic and nonzero at these critical-line zeros, and t↦1/2+it has nonzero derivative, so multiplicity is preserved. Reflection provides zeros on both real tails, although the contradiction only needs infinitely many on one tail.

## 6. Limits

This excludes uniform absolute stretched-exponential synthesis-column locality in the actual normalized natural hierarchy. It does not exclude polynomial decay, column-dependent localization scales, signed cancellation estimates, or other nonuniform localization statements. It proves neither a positive nor a negative selected-coherence conclusion and makes no RH claim. All cross terms remain present.
