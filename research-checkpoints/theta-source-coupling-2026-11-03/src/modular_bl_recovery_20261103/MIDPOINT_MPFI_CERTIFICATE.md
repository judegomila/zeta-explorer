# Reconstructed MPFI certificate for the N=1 metric midpoint

Status: independent analytic audit and MPFI replay PASS. This rebuild does not rely on the missing previous shared snapshot. It certifies only the local theta inputs to TWO_FEATURE_METRIC_NOT_LOGCONCAVE, not an all-degree pivot.

Let ψ be the complete even theta profile. Define half-line moments
 P=∫₀∞ψ², I=∫₀∞h²ψ², K=∫₀∞h²ψ'².
For the normalized a→0 old physical pivots,
 σ₀=4I, σ₁=4K−2P, α=σ₁/σ₀,
and q=−ψ''(0)/ψ(0)=v'(0). Integration by parts and Parseval justify these identities. The owned MPFI/MPFR script check_midpoint_mpfi.py encloses

 11.38<α<12.12,   17<q<19.                                (1)

Hence both limits are positive and q>α, the only strict comparison required for the metric non-logconcavity proof. No claimed accuracy beyond (1) is needed.

## Complete-orbit and spatial errors

For h≥0 write z=πe^(2h), z_n=n²z. The complete theta orbit and its first two derivatives are

 f_n=4e^(h/2−z_n)(2z_n²−3z_n),
 f_n'=4e^(h/2−z_n)(−4z_n³+15z_n²−(15/2)z_n),
 f_n''=4e^(h/2−z_n)(8z_n⁴−56z_n³+(165/2)z_n²−(75/4)z_n).

On 0≤h≤2 and n≥3, z_n≥27. The absolute values of the polynomials for f_n and f_n' are each <5z_n³, and 4e^(h/2)<12. Since z³e^(−z) decreases there,

 ∑_{n≥3}(|f_n| or |f_n'|) ≤1900∑_{n≥3}n⁶e^(−3n²)<4·10^(−6).

The first term is <1900·3⁶/20⁹, using e³>20, and the successive ratio for n≥3 is at most (4/3)^6e^(−21)<1/1000. Thus the displayed 4·10^(−6) is a safe symmetric enclosure for each omitted profile/first-derivative tail.

For h≥2, direct orbit domination gives |ψ|,|ψ'|≤10⁵e^(13h/2)e^(−πe^(2h)); for example bound ∑n⁶e^{−(n²−1)πe^(2h)}<2. Since h²≤e^(2h), each P,I,K tail is below
 10¹⁰∫₂∞ exp(15h−2πe^(2h))dh <10^(−100),
using e⁴>54, π>3, and the logarithmic derivative bound ≤−1.

At h=0 the script sums the first four orbits for ψ and ψ''. For n≥5 the second-derivative polynomial is bounded by 9(πn²)^4 at its lower exponential endpoint, giving a remainder <10^(−15) for each quantity. For example 3600∑_{n≥5}n⁸e^(−3n²)<10^(−15). The first derivative is exactly zero by theta evenness.

## Directed interval implementation

check_midpoint_mpfi.py uses 160-bit MPFI intervals and exactly 10,000 cells of decimal width 0.0002 over [0,2]. Each binary-double grid endpoint is expanded to its adjacent floats before MPFI interval construction, enclosing the exact decimal cell. The omitted orbit and spatial tails are added as symmetric intervals; the finite integrands are evaluated over whole cells, so no derivative remainder is omitted. The live assertions are α.lo>11.38, α.hi<12.12, q.lo>17, and q.hi<19. An owned run gave outward-double enclosures α∈(11.381893982892748,12.114704211562598) and q∈(18.72690492950331,18.726904929503334).

These wider intervals are sufficient to establish q>α and hence the positive midpoint log-curvature conclusion of TWO_FEATURE_METRIC_NOT_LOGCONCAVE. No inference about an integrated commutator, any higher pivot, or RH is made.
