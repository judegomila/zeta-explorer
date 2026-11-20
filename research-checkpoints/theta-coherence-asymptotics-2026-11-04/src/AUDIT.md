# Audit record

Date: 2026-11-04. Independent means separately tasked AI-assisted analysis, not peer review or formal verification.

## Parameter stability and trace criterion: PASS

The auditor checked the finite old-prefix domain, exact backward Schur identity, quantitative diagonal-energy implication, actual theta moment matrix formula, and conditional trace-to-diagonal argument. The direct excess-over-Y refinement was independently verified:

Δ−E_n(δ)=δU+δ²A bᵀ(I−δK)⁻¹b,
δU≤Δ−E_n(δ)≤δU/[1−δλ_max(K)]≤δU/(1−δ).

The auditor confirmed that no enlarged target positivity or division by Xi is used. The Δ>0 premise is confined to statements involving relative ratios.

Four audit corrections were applied:

- The uniform bound concerns only the resolvent (I−δK)⁻¹, not every inverse or K†.
- Strong diagonal decay and trace-plus-regularity are sufficient, not necessary, for coherence.
- The cross-column, B/A scalar, leading coefficient, and spectral edge received distinct notation.
- Determinants consistently use the first N parity monomials, with D_0=1; B_0=0; and the relation λ_max(K)=1−ρ is restricted to nonempty old prefixes.

No actual-theta asymptotic hypothesis was established by this audit.

## Every-polynomial primitive-domain collapse: PASS

The auditor checked:

- Necessary primitive cancellation at every real zero, including all multiplicities.
- Consecutive distinct-zero intervals with arbitrarily small relative length from a zero count not bounded by O(log T).
- Eventual polynomial sign/growth bounds for every fixed degree.
- Exact integration by parts and the Dirichlet Poincaré estimate.
- Strict positivity of a sufficiently short, sufficiently high polynomial cell moment.
- Zero-total-V-moment property of each actual X-selected P_n, by parity or source orthogonality to constants.
- Absence of any old or enlarged Q-positivity assumption in the domain-collapse theorem.

The updated external arithmetic dependency was directly verified on page 1 of Bui–Conrey–Young, arXiv:1002.4127v2. N₀*(T) is explicitly the simple critical-zero count, κ* is its lower limiting proportion among all zeros, and Theorem 1.1 gives κ*≥0.4058. Together with Riemann–von Mangoldt this supplies the required distinct positive real-zero count. Those arithmetic theorems are cited dependencies, not reproved here.

The conclusion excludes this specific primitive operator for every nonzero polynomial, including the selected family. It does not make U or Δ divergent and does not disprove derivative coherence or a Schur sign.

## Preserved mathematical boundary

U_n/Δ_n→0 and a rate tied to √ρ_n remain open. No finite scan, source truncation, new target-pivot certificate, or RH conclusion occurs in this continuation.
