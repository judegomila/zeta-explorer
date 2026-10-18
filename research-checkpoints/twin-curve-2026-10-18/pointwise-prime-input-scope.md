# Scope of a classical fixed-coefficient pointwise input

18 October 2026. Companion to the independently reviewed one-sided Euler/harmonic criterion. This is a source-scope and scale calculation, not an impossibility theorem for the actual prime sum.

## Primary input inspected

Joni Teravainen, *Topics in multiplicative number theory*, embedded paper *Almost primes in almost all short intervals*, Lemma 8, printed page 255 (PDF page 80, zero-index 79):
https://users.utu.fi/jopete/wp-content/uploads/sites/195/2018/08/PhD_thesis_Teravainen.pdf#page=80

For a fixed number of factors with coefficients chosen from the listed arithmetic sequences, this lemma gives a pointwise bound exp(-(log N)^(1/10)) on the line Re(s)=1. Its carrier range includes exp((log N)^(1/3)) <= |t| <= N^(A log log N), for fixed A>0. The proof uses Perron inversion and a classical zero-free region. For one factor the coefficients may be the actual prime indicator. The statement is pointwise; there is no exceptional set in this particular input. Its constants/onset are not made explicit in the displayed lemma. We have not claimed this is the strongest result in the literature.

## Favorable test against the new target

Let sigma=417/500 and P=T^alpha for any fixed alpha>0. Then t near T is eventually inside that carrier range. Even grant the favorable strengthened prefix version

sup_(P<=x<=2P) |sum_(P<p<=x) p^(-1-it)| <= C exp(-(log P)^(1/10)).       (1)

We state the prefix version as an additional grant for this test, not as the exact displayed lemma. Partial summation with w(x)=(1-x^(-h))x^(1-sigma), h=1/8, then yields

|sum_(P<p<=2P) (1-p^(-h))p^(-sigma-it)|
 <= C_sigma,h P^(1-sigma) exp(-(log P)^(1/10)).                       (2)

Indeed sup |w|+integral_P^(2P)|w'| <= C_sigma,h P^(1-sigma). At P=T^alpha the logarithm of the allowance in (2) is

(83 alpha/500) log T - (alpha log T)^(1/10)+O(1).                     (3)

It exceeds log log T by an unbounded amount. Thus this input, even with the favorable endpoint grant, does not certify an O(log T) one-sided budget by bounding each weighted block separately. The right-boundary approximation independently requires a cutoff exponent above 26/63 in the idealized interpolation, so one cannot remove all fixed-power scales just to make (3) small.

This compares an available upper-bound allowance with the required allowance. It is not a lower bound on the prime sum, does not assert that a bad carrier exists, and does not rule out cancellation between blocks or the weaker clipped harmonic average. A separate mixed-cancellation estimate could still bypass the loss. Replacing exp(-(log P)^(1/10)) by any fixed inverse power of log P also fails this comparison. An arbitrary-coefficient estimate is not invoked.

## Exact remaining opportunity

The full signed sum and its harmonic clipping penalty may be much smaller than the sum of blockwise allowances. A useful next input must estimate that actual joint quantity, with constants uniform for every target carrier and with the finite rectangle's horizontal edges retained. The source just checked supplies neither this joint one-sided estimate nor an effective onset for the original curve. No stronger all-height curve follows from the present source check.
