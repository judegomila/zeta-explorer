# The proved Euler-box sign bound and the proved orbit-tail bound have disjoint cutoff regimes

2026-11-02. Structural obstruction to combining two particular sufficient estimates, not a negative result for the actual head or RH. Independently reviewed; wording clarifications incorporated.

Fix0<δ<1/2. The correlated Euler-box convexity criterion uses
A_Y=Σ_(p≤Y) (logp)p^(−δ)(1+p^(−δ))/(1−p^(−δ))³.
Its right-hand cost is at least4A_Y, while the available Gamma logarithmic reserve is asymptotic to logt.

The existing corrected-Ewald contour theorem in ../relative_tail_v6/ADAPTIVE_CONTOUR_TAIL.md controls omitted pairs only after every pair with product nm≤M has been retained, with M+1≥t/(sqrt(2)π) for the explicit exponential envelope. A prime pair(1,p) has productp. Therefore an Euler box that covers every such pair must contain every primep≤M in its generating prime set, with exponent at least1. The largest required prime is asymptotic to M; hence the largest included prime is at least (1−o(1))M as M→∞. A box may also include larger primes.

For such coverage,
A_Y≥Σ_(p≤M)(logp)p^(−δ)≥M^(−δ)Σ_(p≤M)logp.
The prime number theorem implies Σ_(p≤M)logp~M, so
A_Y≥(1+o(1))M^(1−δ).
If M≥ct with fixedc>0, this exceeds logt by an unbounded factor. Thus the proved absolute-log-derivative convexity criterion cannot hold in the required product-covering regime for all sufficiently large t.

Conversely, the sign theorem's growing regime Y(t)=(logt)^η leaves primes betweenY andM for large t. By the prime number theorem (or just Bertrand's theorem), there is an omitted primep≤2Y onceY is large. Then2πp/t→0. This omitted orbit lies below, not beyond, the imaginary-order Bessel turning point, so the existing contour-tail estimate cannot be applied to it. Increasing the prime-power exponents does not insert an omitted prime.

Consequences:
1. The already proved exponential orbit-tail allowance cannot be attached to the already proved small-prime Euler-box sign result.
2. This does not show the Euler-box bridge loses positivity whenY is larger; only its sufficient absolute derivative estimate fails.
3. This does not show a different omitted-prime estimate is impossible. Such an estimate must exploit correlated oscillation inside the turning range rather than reusing the beyond-turning exponential majorant.
4. It does not rule out the existing product-cutoff head; its signed correlated lower bound remains open.

External input: the classical prime number theorem, whose statement and attribution were checked at NIST DLMF27.2.3, https://dlmf.nist.gov/27.2.E3. Partial summation gives the displayed Chebyshev-sum asymptotic. No unproved zero-free region is used.
