# Twistor bridge research and signed operator certificate

This package accompanies the rigorous model view. It separates an exact wide split-twistor construction, explicitly scoped analytical obstructions, and a computer-assisted local arithmetic Hankel certificate. It does not prove the Riemann hypothesis. Literature novelty has not been assessed.

## Reproduce the scientific checks

From this directory, with the packages in requirements.txt available:

    OPENBLAS_NUM_THREADS=1 python3 signed_certificate/certify_signed_window.py
    python3 prime_threshold/certify_absolute_obstruction.py
    python3 verify_subdivision.py
    python3 structural/verify_structure.py

The first command validates the full signed operator at a=1/4 and L=3/2, including every omitted Fourier mode. It normally takes a few seconds. It proves

    ||H_(1/4,L)|| <= 49999/50000
    I +/- H_(1/4,L) >= I/50000
    for every 1 < L <= 3/2.

The second command certifies that the operator formed with the absolute-value kernel has norm greater than one at a=1/4,L=3/2. Together these show why preserving the kernel's signs matters. The third command checks exact symbolic identities and high-precision diagnostics; those diagnostics are not themselves interval proofs.

The scripts write their results beside themselves. Their relative imports are self-contained within this package. The tested software versions are in environment.json. The independent review and exact certificate hash are in prime_threshold/signed_certificate_review/CERTIFICATE_REVIEW.md. For an independent coefficient cross-check, run that directory's beta_formula_audit.py. Its floating-point agreement is a diagnostic, separate from the interval certificate.

The complete report is twistor-bridge-continuation.tex. Its served, visually checked 19-page PDF is ../../public/papers/twistor-bridge-continuation-2026-10-03.pdf. Compile the source twice with a standard TeX Live pdflatex installation. scientific-artifact-hashes.json records the original scientific source and PDF byte hashes.

## Exact definitions and certified scopes

- xi(s) = s(s-1) pi^(-s/2) Gamma(s/2) zeta(s)/2 is entire, with xi(0)=xi(1)=1/2.
- X(w)=xi(1/2+w), and R_a(w)=X(w-a)/X(w+a) is meromorphic in w.
- The even compact picture is H=L2_even(S3), decomposed into spherical harmonics of degree 2m and dimension (2m+1)^2.
- A(w) acts on that component by b_m(w)=product_(j=1)^m (w-2j)/(w+2j). The empty product is 1.
- The exact wide arithmetic bridge is T(w)=R_(3/2)(w) A(w), with R_(3/2)(w)=xi(w-1)/xi(w+2). It is a holomorphic contraction for Re(w)>0. At w=2, A=P0 and T=(15/(2 pi^2))P0.
- For other widths, T_a=R_a A is a candidate scalar-multiplier family. Scalar Schur contractivity is nevertheless known unconditionally for every a>=1/2 by the classical wide-shift theorem. The exact geometric derivation has only matched a=3/2. At regular points with Re(w)>0, its full norm is |R_a(w)| because the constant mode has b_0=1 and every angular multiplier has modulus at most 1.
- The local Hankel operator is a different object: H_(a,L)f(x)=integral_0^L h_a(xy)f(y)dy on L2((0,L),dx). The report defines the completed arithmetic kernel h_a exactly. The variable L is truncation, a is width, and w is spectral parameter.
- For every 0<a<=1 and 1<L<=exp(exp(-EulerGamma)/(8 pi)), the analytical bound is ||H_(a,L)||<=2^(-a). The endpoint is approximately 1.0225911641351626.
- At the separate fixed width a=1/4, the interval certificate extends the truncation range to 1<L<=3/2 with norm <=0.99998.
- The analytical perturbation theorem extends this to the exact closed interval a in [12499999/50000000,12500001/50000000], or [0.24999998,0.25000002], with norm <=99999/100000 and both I +/- H >=I/100000 through L=3/2. At exactly a=1/4, the tighter point certificate still applies. The derivative bound is 1869/4<500 on a in [1/5,3/10]; the small interval is proved, not sampled.
- The Hankel operator itself is signed and indefinite. The positive energy forms are I+H and I-H. A finite-L certificate does not establish a pointwise Schur bound on R_a, global canonical-system positivity, or RH.

## Geometry conventions

Let V=R4, PT=P(V)=RP3, and PT*=P(V*) be the dual projective space. Projective incidence is W(Z)=0. The group is SL(4,R), locally Spin(3,3), the conformal spin group associated with split-signature (2,2) spacetime. No particular metric of signature (2,2) is being placed on the twistor vector space V itself.

Fourier transformation intertwines even homogeneous distributions of degree -2-w on V with degree -2+w on V*. This is a meromorphic transformation of distribution spaces, not a pointwise map from a projective twistor to a dual twistor. A diagram or sampled angular modes illustrate these structures; they do not visualize every state in the infinite-dimensional representation.

## Sources and provenance

1. The prior project report, Split Twistor Bridge V2, dated 1 October 2026, pp. 2-9, supplies the homogeneous Fourier normalization, real and prime-place factors, exact width-3/2 match, and constant-mode reduction. The continuation report preserves and identifies that source; it is not a claim that the project's older toy twistor simulation already implements the construction.
2. Masatoshi Suzuki, A canonical system of differential equations arising from the Riemann zeta-function, revised 2016: https://arxiv.org/abs/1204.1827. Section 2 gives the arithmetic coefficients and kernels. Lemmas 4.2-4.4 establish the all-window Hilbert-Schmidt and strict-contraction results in the width >1/2 regime. This package's thin local results are separately proved and scoped.
3. J. C. Lagarias, Zero Spacing Distributions for Differenced L-Functions, corrected preprint, Lemma 2.1: https://arxiv.org/abs/math/0601653. This supplies the unconditional wide-shift comparison.
4. G. Olafsson, A. Pasquale, B. Rubin, Analytic and Group-Theoretic Aspects of the Cosine Transform: https://arxiv.org/abs/1209.1822. Background for the Fourier/principal-series normalization.

Suzuki explicitly states compact self-adjointness at every positive width after Theorem 2.3 (printed p.8), with weak-singularity discussion in Section 5 (printed p.24). The report supplies proof details and does not claim this compactness result as new.

The continuation report and its independent reviews are dated 3 October 2026. The interval method uses mpmath.iv outward-rounded operations and explicit analytical remainder estimates; it is a reproducible computer-assisted proof, not a proof-assistant formalization. The browser's arithmetic samples are ordinary floating-point diagnostics and are never part of this certification.

## Structural continuation and the exact unresolved estimates

The independent audit and all-window proof are in audit/. The core report now includes the foundational real/projective Fourier, scalar incidence, prime-factor and completion calculations, with precise representation domains. In particular, the Euclidean compact-picture covariance is twisted by g -> g^(-T); the constant harmonic is K-fixed rather than a generic G-invariant representation; bounded holomorphy holds in the right half-plane, while boundary limits are strong rather than norm limits. Meromorphic continuation on distribution spaces does not give bounded invertibility of the compact operator. Individual finite-prime factors are expansive for real 0<w<1; completed passivity uses the separate wide-shift inequality.

For each fixed a>0, N_a(L)=||H_(a,L)|| is nondecreasing. A reviewed application of Suzuki Theorem 2.2 and Lemma 4.1 proves that its limit is exactly 1 if R_a is Schur, and infinity otherwise. Any finite bound C_n uniform in L separately for each a_n tending to zero would prove RH. Neither a common constant in n nor a strictly positive global gap is needed. A single fixed width has an explicit shifted-zero cancellation caveat, included in the report.

An unconditional bound is N_a(L)<=L, proved by half-unit damping of the actual arithmetic kernel. In scalar form, define E_a(u)=1-integral_0^u K_a(v)dv, with K_a(u)=exp(-u/2)q_a(u). The report proves integral_0^infinity exp(-u)|E_a(u)|^2du <=2(1-R_a(1)). Suzuki Theorem A.1(2) identifies finiteness of the unweighted integral as equivalent to Schur contractivity. Removing the truncation growth or exponential damping at widths tending to zero is still unproved.

The exact width cocycle also gives S_a(Xg)(w)=X(w)g(w+2a), a contraction semigroup on the deliberately weighted space {Xg:g in Hardy H2}. This construction works even when X has right-half-plane zeros. Its evaluation norms cancel the arithmetic ratio, so it does not prove thin passivity. A second exact reformulation asks for a contractive inclusion between two independently positive wide de Branges-Rovnyak spaces. The required comparison, including its scalar diagonal inequality, remains unproved.

The files in structural/ contain these arguments and exact identity/rational-constant checks. No statement of literature priority, global positivity, or an RH proof is made.
