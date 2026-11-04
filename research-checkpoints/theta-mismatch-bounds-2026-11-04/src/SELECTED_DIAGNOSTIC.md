# Reconstructed selected-theta diagnostics

Date: 2026-11-04. Status: unvalidated numerical diagnostic, not an interval certificate or all-degree theorem.

The new standalone probe reconstructs the original full X-selected residual from the complete-series approximation, uses the actual old Q inverse, and computes U,C,V and ρ in the exact coordinates of SOURCE_COUPLING_REDUCTION.md. It does not replace the source selection by Y selection or assume enlarged target positivity.

Runs completed:

- Degrees 3–30: 240 Gauss–Legendre nodes, 90 decimal digits, 12 theta orbits.
- Degrees 3–30: 480 nodes, 120 digits, 16 orbits.
- Degrees 3–80: 560 nodes, 180 digits, 20 orbits.

Observed maxima through degree 80:

- C/U≈3.29388282329627, at degree 10; proposed cap 10/3≈3.33333333333333.
- U/(√ρΔ)≈0.54181463678604, at degree 52; proposed cap 11/20=0.55.
- UV/Δ²≈0.18281812722884, at degree 22.

Neither proposed bound was numerically falsified. These numbers do not prove either one for any degree, much less for all degrees.

The two degree 30 runs differ by at most 2.27×10⁻¹³ in C/U, 1.991×10⁻¹⁴ in the amplitude ratio, and 1.113×10⁻¹⁴ in UV/Δ². The degree 80 run's overlap through degree 30 agrees with the 480-node run within 7.26×10⁻¹⁴, 4.40×10⁻¹⁵, and 2.22×10⁻¹⁵ respectively. This is a numerical stability check, not directed error control. Degrees 31–80 have only the one completed run in this package.

Important precision caveat: Gauss–Legendre nodes and weights originate in binary64 NumPy. Derivatives, accumulated Grams, inverses, Cholesky whitening, and eigenvalues are then computed with mpmath. The many decimal places printed in raw JSON are internal arithmetic precision, not certified accuracy. No quadrature, omitted-orbit, spatial-tail, or nonlinear inverse error enclosure is supplied. The raw outputs must not be represented as finite sign certificates.

All matrix inverses in the formulas use the old prefix. The even H kernel is removed only on its known constant coordinate. The probe computes source-selected Schur quantities and old generalized eigenvalues; observed old positivity is numerical only here. No external finite theorem is silently used as an error bound.

The result reconstructs the previous undurable diagnostic at low degrees and provides an inspectable implementation. It supplies no new signed rung or all-degree claim.
