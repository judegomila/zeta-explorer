# Actual Xi logarithmic curvature: source audit

2026-11-04. Targeted literature check and elementary deductions. No tail capacity bound proved, no RH assumption, no 4CT edits.

## Findings

The targeted search found no unconditional estimate proving sup B_I finite or B_I tending to zero for escaping actual-Xi cells. This is a search result, not a claim of exhaustive literature coverage.

For F(t)=Xi(t), let L_1[F]=(F')²-FF''. Away from real zeros,

    v' = 2(log|F|)'' = -2 L_1[F]/F²,
    dν = 2(-L_1[F])_+ dt/F⁴.

Consequently first Laguerre positivity everywhere would make every B_I zero. This sufficient condition is not to be asserted equivalent to RH. Csordas and Escassut exhibit f(z)=z(z²+1), with nonreal zeros but L_1[f](x)=3x⁴+1>0, illustrating why a general converse fails. Their Theorem 2.2 requires the full hierarchy of generalized Laguerre inequalities for the Laguerre–Pólya characterization, not just first order.

Primary source: https://www.numdam.org/item/AMBP_2005__12_2_331_0.pdf (pp. 332–334).

## Exact zero localization (elementary deduction from the canonical product)

List each real Xi zero r with multiplicity m_r, and each upper-half-plane Xi zero γ+iη, 0<η<1/2, with multiplicity m_(γ,η), counting its conjugate only through this pair. The genus-one product yields, locally uniformly off real zeros,

    v'(t) = -2 sum_r m_r/(t-r)²
            +4 sum_(γ,η) m_(γ,η) [η²-(t-γ)²]/[(t-γ)²+η²]².

The sums converge absolutely locally. The linear exponential factor disappears after two logarithmic derivatives. Thus

    {t:F(t)≠0 and v'(t)>0}
       ⊂ union_(γ,η) (γ-η,γ+η).

If a real-zero cell avoids this union, B_I=0. More locally, any contribution to ν is confined to this union. An off-line zero is necessary for positive curvature somewhere, but an individual pair need not force positivity: the negative terms may dominate. At the center its positive contribution is 4m/η². No universal lower bound on nonzero η is supplied by zero-free regions next to Re(s)=1.

Csordas (2014), Proposition 2.2, provides the strip-gap localization formula; Proposition 2.3 analyzes a narrow conjugate pair. Open Problem 4.7 asks for first Laguerre positivity on the whole real axis for the scaled Xi function. Normalization must be adjusted: that paper uses H(x)=Xi(x/2)/8.

Primary source: https://arxiv.org/html/1309.0055 (Propositions 2.2–2.3, Open Problem 4.7).

## Rigorous finite range, not a tail result

Platt and Trudgian rigorously verify that every zeta zero of ordinate 0<γ≤3×10¹² lies on the critical line, using interval arithmetic. The localization deduction therefore gives v'≤0, hence ν=0, on |t|≤3×10¹²−1/2 away from real zeros. All cells contained in that interval have B_I=0. This does not control escaping cells and is not a substitute for the requested analytic tail bound. It is a consequence of published rigorous computation, not a newly performed numerical scan.

Primary source: https://arxiv.org/abs/2004.09765 ; journal DOI https://doi.org/10.1112/blms.12460 .

A very recent preprint by Sra states the corresponding all-generalized-orders finite-interval conclusion, explicitly attributing the first-order case to Csordas–Ruttan–Varga (1991). No novel claim from that preprint is needed for the deductions here, and its additional positivity claims have not been independently audited.

Source: https://arxiv.org/html/2611.02944v1 (abstract and Section 4).

## Scope of the obstruction

If Xi had only finitely many nonreal zeros, the localization intervals would lie in a bounded set and every sufficiently remote cell would have B_I=0. This conditional deduction does not assert that finitely many exceptions occur. It shows why tail compactness must not be casually equated with RH.

Explicit zero-free regions adjacent to Re(s)=1 yield an upper bound on η=|Re(ρ)-1/2|, still asymptotically near 1/2, rather than a positive lower bound separating a hypothetical off-line zero from the critical line. For example Mossinghoff–Trudgian–Yang establish σ≥1−1/[55.241(log|t|)^(2/3)(loglog|t|)^(1/3)] as zero-free for |t|≥3. By symmetry this trims the pair-localization radius slightly; it supplies neither control of the 1/η² peak nor the weighted F^(-4) excess integral in B_I.

Primary source: https://arxiv.org/abs/2212.06867 .

Real-zero gap estimates alone do not determine the near-real nonreal-pair contributions or the valley weight. The existing sparse-entire countermodel at ../theta_escaping_capacity_20261104/SPARSE_ENTIRE_VALLEY_COUNTERMODEL.md gives the appropriate logical warning. No fresh quantitative gap theorem was needed or asserted in this audit.

Direct product applicability check: Csordas (2014), Section 4 immediately after (4.2), states that the scaled actual Xi function H is order one, has infinitely many real zeros, and belongs to the canonical strip-product class S(1) of Definition 1.1. Thus that same primary article supplies both product applicability and the logarithmic-derivative calculation. In the finitely-many-nonreal-zeros conditional case, discreteness of real zeros gives only finitely many cells meeting the bounded localization union. The audited fixed-cell compactness then makes R_+ a finite direct sum of compact blocks, hence compact. This is not a finite-rank claim.
