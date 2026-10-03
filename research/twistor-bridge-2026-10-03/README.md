# Twistor bridge research and signed operator certificate

This package accompanies the rigorous model view. It separates an exact wide split-twistor construction, explicitly scoped analytical obstructions, and a computer-assisted local arithmetic Hankel certificate. It does not prove the Riemann hypothesis. Literature novelty has not been assessed.

## Reproduce the scientific checks

From this directory, with the packages in requirements.txt available:

    OPENBLAS_NUM_THREADS=1 python3 signed_certificate/certify_signed_window.py
    python3 prime_threshold/certify_absolute_obstruction.py
    python3 verify_subdivision.py

The first command validates the full signed operator at a=1/4 and L=3/2, including every omitted Fourier mode. It normally takes a few seconds. It proves

    ||H_(1/4,L)|| <= 49999/50000
    I +/- H_(1/4,L) >= I/50000
    for every 1 < L <= 3/2.

The second command certifies that the operator formed with the absolute-value kernel has norm greater than one at a=1/4,L=3/2. Together these show why preserving the kernel's signs matters. The third command checks exact symbolic identities and high-precision diagnostics; those diagnostics are not themselves interval proofs.

The scripts write their results beside themselves. Their relative imports are self-contained within this package. The tested software versions are in environment.json. The independent review and exact certificate hash are in prime_threshold/signed_certificate_review/CERTIFICATE_REVIEW.md. For an independent coefficient cross-check, run that directory's beta_formula_audit.py. Its floating-point agreement is a diagnostic, separate from the interval certificate.

The complete report is twistor-bridge-continuation.tex. Its served, visually checked 11-page PDF is ../../public/papers/twistor-bridge-continuation-2026-10-03.pdf. Compile the source twice with a standard TeX Live pdflatex installation. scientific-artifact-hashes.json records the original scientific source and PDF byte hashes.

## Exact definitions and certified scopes

- xi(s) = s(s-1) pi^(-s/2) Gamma(s/2) zeta(s)/2 is entire, with xi(0)=xi(1)=1/2.
- X(w)=xi(1/2+w), and R_a(w)=X(w-a)/X(w+a) is meromorphic in w.
- The even compact picture is H=L2_even(S3), decomposed into spherical harmonics of degree 2m and dimension (2m+1)^2.
- A(w) acts on that component by b_m(w)=product_(j=1)^m (w-2j)/(w+2j). The empty product is 1.
- The exact wide arithmetic bridge is T(w)=R_(3/2)(w) A(w), with R_(3/2)(w)=xi(w-1)/xi(w+2). It is a holomorphic contraction for Re(w)>0. At w=2, A=P0 and T=(15/(2 pi^2))P0.
- For other widths, T_a=R_a A is a candidate scalar-multiplier family. The exact geometric derivation has only matched a=3/2. At regular points with Re(w)>0, its full norm is |R_a(w)| because the constant mode has b_0=1 and every angular multiplier has modulus at most 1.
- The local Hankel operator is a different object: H_(a,L)f(x)=integral_0^L h_a(xy)f(y)dy on L2((0,L),dx). The report defines the completed arithmetic kernel h_a exactly. The variable L is truncation, a is width, and w is spectral parameter.
- For every 0<a<=1 and 1<L<=exp(exp(-EulerGamma)/(8 pi)), the analytical bound is ||H_(a,L)||<=2^(-a). The endpoint is approximately 1.0225911641351626.
- At the separate fixed width a=1/4, the interval certificate extends the truncation range to 1<L<=3/2 with norm <=0.99998.
- The Hankel operator itself is signed and indefinite. The positive energy forms are I+H and I-H. A finite-L certificate does not establish a pointwise Schur bound on R_a, global canonical-system positivity, or RH.

## Geometry conventions

Let V=R4, PT=P(V)=RP3, and PT*=P(V*) be the dual projective space. Projective incidence is W(Z)=0. The group is SL(4,R), locally Spin(3,3), the conformal spin group associated with split-signature (2,2) spacetime. No particular metric of signature (2,2) is being placed on the twistor vector space V itself.

Fourier transformation intertwines even homogeneous distributions of degree -2-w on V with degree -2+w on V*. This is a meromorphic transformation of distribution spaces, not a pointwise map from a projective twistor to a dual twistor. A diagram or sampled angular modes illustrate these structures; they do not visualize every state in the infinite-dimensional representation.

## Sources and provenance

1. The prior project report, Split Twistor Bridge V2, dated 1 October 2026, pp. 2-9, supplies the homogeneous Fourier normalization, real and prime-place factors, exact width-3/2 match, and constant-mode reduction. The continuation report preserves and identifies that source; it is not a claim that the project's older toy twistor simulation already implements the construction.
2. Masatoshi Suzuki, A canonical system of differential equations arising from the Riemann zeta-function, revised 2016: https://arxiv.org/abs/1204.1827. Section 2 gives the arithmetic coefficients and kernels. Lemmas 4.2-4.4 establish the all-window Hilbert-Schmidt and strict-contraction results in the width >1/2 regime. This package's thin local results are separately proved and scoped.
3. J. C. Lagarias, Zero Spacing Distributions for Differenced L-Functions, corrected preprint, Lemma 2.1: https://arxiv.org/abs/math/0601653. This supplies the unconditional wide-shift comparison.
4. G. Olafsson, A. Pasquale, B. Rubin, Analytic and Group-Theoretic Aspects of the Cosine Transform: https://arxiv.org/abs/1209.1822. Background for the Fourier/principal-series normalization.

The continuation report and its independent reviews are dated 3 October 2026. The interval method uses mpmath.iv outward-rounded operations and explicit analytical remainder estimates; it is a reproducible computer-assisted proof, not a proof-assistant formalization. The browser's arithmetic samples are ordinary floating-point diagnostics and are never part of this certification.
