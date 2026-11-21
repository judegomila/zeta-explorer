# Independent cross-review: arithmetic compression

Review date: 2026-11-20 (user locale). Reviewed `ARITHMETIC_FAMILY.md`, its exact checker, and the relevant external source at commit `c6fe94ff45b0f01acc60c13ebcbd54880f41b3c2`.

## Verdict

**No blocking mathematical error found in Propositions A–E or their stated finite-label specialization.** The removal of the factor (2^j) is justified with the hypotheses actually recorded. The improved logarithmic constants and the dimension-window estimate are correct. This verdict concerns the independent mathematical arguments and the bounded source correspondence; it is not a Lean replay or verification of the complete announced proof.

## Checks and necessary hypotheses

| Item | Independent assessment |
|---|---|
| CM norm and minors | Integral pairings give integral determinants. For a CM type containing one embedding from each conjugate pair, the product of squared absolute values equals the absolute field norm. The nonzero difference has a nonzero integer norm. No positive definiteness is required. |
| Packing constant 18 | Same-cell differences have modulus less than one in every complex coordinate. Product separation makes the cell map injective. With (N=\lceil2R\rceil), the tail beginning at (n=N+2) is at most (2(2R)^{3/2}/\sqrt N\le4R). The remaining (N+2<2R+3) terms give at most (9R) on nonnegative integers when (R\ge1), hence (18R) on integers. |
| Removal of (2^j) | The coordinate weight at zero is exactly one. Extending the product from nonzero coordinates to all indices (1,\ldots,j) leaves it unchanged. There is no need to sum over the (2^j) support sets. |
| Restriction injectivity | It uses all three conditions: distinct full sequences, fixed (a_0=1), and (a_l=0) for (l>j). Agreement on (1,\ldots,j) then implies equality of full sequences. Integrality alone does not imply injectivity. |
| Empty-coordinate case | For (j=0), at most one allowed sequence exists. Each kernel factor is one and the empty product bound is one. An empty label set contributes zero. No step divides by (j). |
| Exponent comparison | Since every coordinate factor is at most \(\Sigma_\sigma\ge1\) and (j\le r), the product of (j) factors is at most \(\Sigma_\sigma^r\). Taking negative third powers gives the required inequality. Its direction is correct. |
| Exact cost | For (l\le j\le r), \(e_l=l(2r+1-l)/2\) and \(\sum e_l=j(j+1)(3r+1-j)/6\). Multiplication by (2f\) and the factor (2e_l\) produce the stated (2f/3\) discriminant coefficient and (4frj\) height coefficient. |
| Uniform coarse cost | After division by (fm^2r), the four contributions are bounded by (3/2,4/C_l,2,4|C_H|\). Their sum is at most (4+4/C_l+4|C_H|\). The statement explicitly assumes (r\ge1\), so this division is legitimate. The positive-part bound on \(\log\max(1,2H)\) also handles negative (C_H\). |
| Dimension window | With (n=fk>0\), the upper factor is \((1+1/n)^n\le e\). The lower bound uses \((1-T^{-k})^f\ge1-fT^{-k}\ge1/2\), justified by (T\ge2\) and (2f\le2^k\). Exact normalization cancels (d_*,D_*,\Gamma\) correctly. |

## Source applicability

The relevant definitions were read directly in `BlockEnds.lean`, `KappaEndpoints.lean`, `KTwoCosetCount.lean`, and `KloostermanCosetSumLe.lean`.

- `absReal` uses the ordinary complex modulus multiplied by the inverse discriminant power. It does not square the modulus. Thus the proposed (s_l=\operatorname{rd}_E^{2e_l}(2H)^{2r}\) matches the source without an omitted factor of two.
- `k2sg` takes the maximum over precisely the nonzero coordinates in (1,\ldots,j\), and `k2S` multiplies these maxima over the CM-type index.
- `wl(H,l,0)=1` follows directly from those definitions. `lab_facts` and `labFacts_conc` supply integrality, fixed coordinate zero, and the zero tail. The existing `sum_prod_le` applies to the whole finite label set using restriction to (1,\ldots,j\).
- `WeightedLatticeSum.latSum` explicitly reaches the (18\)-bound before weakening it to its declared (64\)-bound. The stronger constant therefore follows from the inspected proof, but is not the existing exported theorem signature.
- The elementary `mass_corollary` proof in `OneAddInvPowLeExpOne.lean` uses the same two inequalities as Proposition E.

The improvement is for a **finite set of distinct minor-label sequences**. It does not directly bound a sum over underlying geometric objects with repeated labels. Such a sum still needs the source's multiplicity or fibre-counting argument. The report correctly retains this distinction and does not assert that the improvement verifies the Main-path row package or produces a new RH endpoint estimate.

## Checker review

The checker was rerun by invoking its individual functions without its file-writing entry point. All reported counts were reproduced: 252 product cases, 26,910 points, 16,782 points involving zero coordinates, 180 Gaussian-integer minors, 179 nonzero differences, 3,321 exponent identities, 10,560 rational coarsenings, and 711 dimension-window examples. The negative controls correctly show failure when fixed coordinate zero, the zero tail, or distinctness is removed.

These are finite sanity checks. The packing constant and the universal mathematical claims are supported by the proofs, not by the finite test counts.
