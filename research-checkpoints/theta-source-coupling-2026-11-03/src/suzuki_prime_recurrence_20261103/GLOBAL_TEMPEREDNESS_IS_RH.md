# Global temperedness of the Suzuki screw function is already RH

Date: 2026-11-03. Status: independent analytic audit PASS, including direct primary-source verification; no proof-assistant formalization. This is a circularity check for a proposed global factorization, not an RH proof and not a claim that Suzuki's compact-interval results fail.

## Exact statement

Let g=-Psi be the actual continuous even screw function attached to the Riemann xi function. Then the following are equivalent:

1. RH.
2. g, regarded as a regular distribution on R, belongs to the tempered distributions S'(R).
3. g'' belongs to S'(R).

In particular, global temperedness is not a weaker unconditional assumption available for a Fourier or spectral factorization.

## Proof

Suzuki's unconditional one-sided transform identity is

    integral_0^infinity Psi(t) exp(izt) dt
      = -z^(-2) xi'(1/2-iz)/xi(1/2-iz),    Im z>1/2.

The integral converges absolutely in this half-plane. His zero expansion is

    Psi(t)=sum_gamma (1-cos(gamma t))/gamma^2,

where gamma runs over zeros of xi(1/2-iz), with multiplicity. Under RH, all gamma are nonzero real numbers: xi(1/2) is nonzero by the positive complete-theta integral. The standard zero count N(T)=O(T log T), counting multiplicity, gives sum_gamma |gamma|^(-2)<infinity. Therefore |Psi(t)|<=2 sum_gamma |gamma|^(-2) uniformly on R. A bounded continuous function defines a tempered distribution. This proves 1 implies 2.

Now suppose g is tempered. Its restriction to [0,infinity), extended by zero, is also tempered. This can be justified without multiplying a general distribution by a discontinuous function: multiply g by a smooth step equal to zero for t<=-1 and one for t>=1, then correct on the compact interval [-1,1] using the locally integrable function g. Denote the resulting distribution, supported in [0,infinity), by g_+.

The Fourier-Laplace transform of a tempered distribution supported in [0,infinity) is holomorphic for Im z>0. One direct construction chooses a smooth cutoff chi equal to one on t>=-1 and zero on t<=-2, and defines L(z)=<g_+,chi(t)exp(izt)>. For each compact subset of Im z>0, this test function and all z-derivatives decrease exponentially on the positive half-line and depend holomorphically in the Schwartz topology. Pairing therefore gives a holomorphic function L(z). No pointwise polynomial bound on g is assumed or inferred here.

For Im z>1/2 this distributional transform agrees with the absolutely convergent original integral, by smooth compact cutoff approximation and Suzuki's unconditional growth bound |g(t)|=O(exp(t/2-c sqrt(t))) as t tends to positive infinity. Consequently

    L(z)=z^(-2) xi'(1/2-iz)/xi(1/2-iz)

there. To make the continuation precise, multiply through by z^2 xi(1/2-iz). Both sides are holomorphic in Im z>0, so the ordinary identity theorem gives

    z^2 L(z) xi(1/2-iz)=xi'(1/2-iz)

on that whole connected half-plane. This rules out poles of the logarithmic derivative there.

A zero rho=beta+i gamma of xi with beta>1/2 would give a pole at

    z=i(rho-1/2)=-gamma+i(beta-1/2),

which lies in Im z>0. If the zero has multiplicity m>=1, xi'/xi has residue m in its s variable and the composition xi'(1/2-iz)/xi(1/2-iz) has residue i m in z. Writing this point as z_0, the transform would therefore have the nonzero residue i m/z_0^2. Equivalently, in the holomorphic identity above, the left side vanishes to order at least m while the right side vanishes to order exactly m-1. Such a zero is impossible. The functional equation excludes beta<1/2 as well. This proves 2 implies 1.

Differentiation preserves tempered distributions, so 2 implies 3. Conversely every tempered distribution admits a tempered antiderivative. Taking two such antiderivatives of g'' gives a tempered distribution U with U''=g''. The distribution g-U has vanishing second derivative on R and is therefore an affine polynomial. It is tempered, so g is tempered. This proves 3 implies 2.

The existence of a tempered antiderivative can also be seen directly: subtract a fixed Schwartz test function of integral one from each test function to make its integral zero, integrate that zero-integral test function, and pair with the original tempered distribution. The resulting continuous functional is a tempered primitive, up to the harmless sign convention.

## Consequence for the operator route

Suzuki's 2026 preprint says in Section 2.5: “Since g is continuous, the distributional second derivative −g″ is a tempered distribution.” This wording was verified both in the initially consulted v1 HTML and in the current v3 PDF, page 12, dated September 24, 2026 (arXiv revision September 23). Continuity alone guarantees only a distribution in D'(R), not a tempered one. For this particular g the asserted global property would already establish RH by the proof above.

This does NOT invalidate local compact-window operations. On any fixed finite interval, multiply g by a compactly supported smooth cutoff equal to one on the difference set of that interval. The cutoff is a compactly supported distribution and hence tempered; its distributional derivatives give exactly the same local convolution formulas. One can instead work throughout in D' with compactly supported tests. The issue arises only when promoting this local representation to a global tempered Fourier transform or a nonlocal factorization on all of R without additional growth control.

Thus the safe division is:

- compact-interval screw kernels and local distributional derivatives: unconditional;
- one-sided transforms in Im z>1/2: unconditional;
- global g or g'' as a tempered distribution, and holomorphic one-sided continuation throughout Im z>0: RH-level claims.

No assertion is made about whether this wording affects another theorem in the paper; that requires a separate dependency audit. It must not be used as a free hypothesis in this research program.

## Primary sources

- Suzuki, Aspects of the screw function corresponding to the Riemann zeta-function, Theorem 1.1 (transform and zero sum), Theorem 1.6 (boundedness criterion): https://arxiv.org/pdf/2206.03682 .
- Suzuki, Weil's quadratic form via the screw function, current version v3, Section 2.5, page 12, viewed 2026-11-03: https://arxiv.org/pdf/2606.09096v3 and https://arxiv.org/html/2606.09096v3#S2.SS5 . The local/global distinction above is an independent deduction, not a theorem attributed to this preprint.
- Independent audit: INDEPENDENT_TEMPEREDNESS_AUDIT.md in this directory. It independently checked the equivalence and v1 text; current-v3 attribution was additionally verified in the authoring workstream.
