# Exact paired-packet cancellation: independent audit

30 October 2026. **PASS for the exact identities and conditional tests.**
No uniform signed-discrepancy estimate, new positivity sector, support endpoint,
whole-complement floor or RH result is proved by this note or its diagnostic.

Final reviewed theorem SHA-256:
`b5c7843f266ce7a66f9f150cb0f625cfba0a6789c972050ac49160068417aa9f`.

## 1. Exact factors, signs and complex evenness

The two lobes are disjoint, so J_b is an isometry. For a complex even envelope,
R(-s)=R(s) by reflection and R(-s)=conjugate(R(s)) by autocorrelation; hence
R is real and even. A positive prime shift has one cross-lobe overlap with
coefficient 1/2. The two translation directions cancel that factor, giving
the stated prime coefficient **1**, not 2. Same-lobe terms vanish because
2delta<log 2. All active labels lie strictly inside the actual support cutoff.

For the separated archimedean kernel, the actual physical kernel is
`-exp(-2alpha|x-y|)/(1-exp(-2|x-y|))`, with no extra Fourier normalization
factor. At alpha=1/4 its first term contributes
`-exp(-b)|m_(1/2)|^2`; the remainder is precisely the positive series C_b
with coefficients exp(-(5+4j)b) and vectors cosh((5/2+2j)x). Evenness makes
the two exponential moments equal also for complex envelopes.

The pole expansion gives `(exp(b)+2+exp(-b))|m_(1/2)|^2`. Its exp(-b) term
cancels the first gamma cross term; exp(b) is exactly the continuous prime
main integral. Thus the remaining form is A−Delta_b−C_b with the displayed
signs. An independent derivation using the shifted 5/4 gamma symbol and the
growing-continuum kernel gives the same identity directly.

The norm estimate for each rank-one term is at most
`2delta exp(-(5+4j)(b-delta))`. Summing gives the stated **geometric** PSD
tail bound. Polarization gives all cross-column entries. Separated kernels
and finite prime sums are bounded, so the identity extends from the smooth
core to the full supported logarithmic form domain.

## 2. Domains, compact signed test and neutral Schur port

The inherited small-window form A has a positive lower bound, with no numeric
floor inferred from a pivot. Its logarithmic form weight tends to infinity;
high-frequency tails are therefore small uniformly on a bounded form ball,
while fixed-band Fourier maps on a finite physical interval are compact.
This proves compact resolvent and compactness of A^(-1/2).

Delta_b is bounded selfadjoint, not assumed PSD; C_b is positive trace class.
Therefore K_b=A^(-1/2)(Delta_b+C_b)A^(-1/2) is compact selfadjoint. The valid
criterion is the **one-sided** upper spectral bound K_b<=(1-epsilon)I, not an
unnecessary bound on ||K_b||. Pointwise strict form positivity implies such
a gap here because a compact operator cannot have positive spectral values
accumulate at 1 without 1 itself being an eigenvalue.

The moment vector c_(1/2) lies in the operator domain: its zero extension has
O(1/|t|) Fourier decay, and multiplying by the logarithmic symbol remains L2.
Thus the moment projection preserves the form domain and its off-diagonal
coupling is a genuine L2 vector. Conditional on coercivity of D_m, the scalar
Schur criterion (9) is necessary and sufficient for coercivity of the paired
form. A nonpositive neutral direction cannot be repaired by the sole pole
column. Neither D_m coercivity nor the scalar inequality is proved here.

## 3. Sharp projection loss and safe finite matrix signs

For ran(P) subset Dom(H), HP extends boundedly and PH is its adjoint. Relative
to P plus I−P, the correction is R=[[A0,B*],[B,0]], and
`A0^2+B*B<=eta^2 I`. Applying the displayed Schur calculation to both R and
−R proves `||R||<=2eta/sqrt(3)` without any commutativity assumption on B.
The two-dimensional equality model has eigenvalues 2eta/sqrt(3) and
−eta/sqrt(3), so the constant is sharp from ||HP|| alone.

For actual semibounded forms the projection preserves the form domain, so
equation (11) is exact. If an unprojected packet-sector lower bound exceeds
the projection payment, the projected sector has the claimed positive floor:
`||QJ_b psi||<=||psi||` makes the lower estimate valid in the projected
physical norm as well. No coverage of the remaining complement follows.

One sign ambiguity was corrected during audit. A lower approximation to a
positive Gram may safely replace an **added** correction, not the subtracted
C_b. The finite gate uses the correct upper enclosure C^J+epsilon G. The
newly explicit reverse-Young upper payment for approximated C_b columns is
also correct. Physical Gram G, rather than a coefficient norm, is retained.

## 4. Diagnostic and provenance boundaries

The one-point mpmath script was copied and rerun independently; its receipt
is byte-identical. It tests b=log 3 and delta=1/16, with literal prime-power
inventory 2,3,4,5,7,8,9,11. Both **8 and 9** contribute. The preliminary
producer expectation of only 9 was corrected before its saved PASS, as the
manifest records. The independent literal correlations, separated gamma
quadrature, pole moments and rank-one series agree to the reported 80-digit
floating precision. The projection-sharpness polynomial check is exact.

This is not an interval certificate. In particular, the reported negative
value of H_pair−H_envelope is not negativity of H_pair; the script never
computes a new actual positivity gate or spectrum.

All 29 source pins and four immutable failed/accepted/export pins match.
The earlier broad-packet audit already identified the leading prime/pole
constant cancellation, and the final note credits it. The finite Mobius-cost
and selfdual-exterior notes remain pending, background-only, and are not used
as accepted prerequisites. The new contribution is the exact finite-b
cross-Gram/small-window reduction and sharp projection payment, not an
unjustified arithmetic bound or a rediscovery presented as new leading-order
cancellation.

The unresolved task is a signed upper estimate for Delta_b in the actual A
metric, especially on the moment-neutral compression with its scalar Schur
feedback retained. Fixed-envelope PNT gives only o(exp(b)), not the required
uniform O(1)-scale comparison. No accepted files, packages, app/PR state or
remote state were changed in this audit.
