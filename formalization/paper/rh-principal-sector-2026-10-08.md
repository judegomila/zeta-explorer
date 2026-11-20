# Principal-sector correlation follow-up — 2026-10-08

**Status: no positive exponent saving and no improvement of the imported 7/8 boundary.**

This continues [the moment-transfer audit](rh-moment-transfer-2026-10-06.md).
It completes the proposed principal-density subtraction and isolates the
remaining signed large-shift correlation with explicit uniform bounds.

## Results

For the existing Vaughan packet, group all factorizations of the same integer
before expanding its energy. With the definitions in the note:

\[
\mathcal E_{\mathrm{II}}(T)=A(T)+\mathcal C_{\le H}(T)+\mathcal C_{>H}(T),
\qquad Q(T)=e^2(T+3/2)^2(T+5/2)^3.
\]

- The diagonal satisfies `0 <= A(T) <= ||k||_2^2 Q(T)`.
- The absolute sum over `0 < |m-n| <= H` is at most `2H ||k||_2^2 Q(T)`.
- The exact principal density is `p(x) = -M_U(1) log(x) + B`, where
  `B = 1 - M_U'(1) + M_U(1) L_V(1)`. The packet already annihilates it.
- The rational-to-Eisenstein lift retains the product cutoff `ac > U`.
  Its remaining unweighted variable has only the upper bound
  `q < exp(T/25 + 3/2)`; it does not provide the two plain sums required by
  the cited matched rectangle lemma.
- At `H(T) = floor(exp(T/2))`, a signed upper bound
  `C_{>H}(T) <= M_delta exp((3/4-delta)T)` for a fixed `0 < delta < 1/4`
  is equivalent to the corresponding packet-energy bound. With the inherited
  growth identity, it would imply `Re(rho) <= 7/8-delta/2`. This estimate is unproved.

The missing step is an exact transformed coefficient identity and a compatible
uniform signed estimate, including the principal sector and reconstruction
remainder. Centering alone preserves the off-axis zero poles. The target
localizes the difficulty; it does not by itself make a new zero-free theorem.

## Research record

- [Six-page note](../../research-inputs/rh-principal-sector-2026-10-08/principal_sector.pdf)
- [TeX source](../../research-inputs/rh-principal-sector-2026-10-08/principal_sector.tex)
- [Reproduction instructions](../../research-inputs/rh-principal-sector-2026-10-08/README.md)
- [Exact checker](../../research-inputs/rh-principal-sector-2026-10-08/audit.py) and [receipt](../../research-inputs/rh-principal-sector-2026-10-08/exact_results.json)
- [512-bit Arb checker](../../research-inputs/rh-principal-sector-2026-10-08/interval_audit.py) and [receipt](../../research-inputs/rh-principal-sector-2026-10-08/interval_results.json)
- [Provenance](../../research-inputs/rh-principal-sector-2026-10-08/source_index.json) and [release hashes](../../research-inputs/rh-principal-sector-2026-10-08/manifest.json)

The exact checks pass for 16,384 coefficients, twelve Laurent models and twelve
rational Gram models, with invalid-cutoff, missing-derivative, and mismatched-mask
controls. Actual arithmetic checks at T=2,3,4 verify both the signed energy
decomposition and the centered Stieltjes representation. The far correlation
takes both signs. No bound at infinity is inferred from those samples.

The PDF was compiled twice and every page visually checked. The external Lean
project and full application build were not run; no application code changed.
The note's analytic proofs and inherited growth/bridge arguments need independent
mathematical review. The October 6 release remains unchanged.
