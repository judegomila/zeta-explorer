# Independent next arithmetic diagnostics, with failed enclosures preserved

Corrected owned interval certificates independently replayed and analytically reviewed PASS. These independently check two already-known rungs through the new arithmetic mechanism; they do not extend the established finite ladder.

## 1. Prefix inputs, without next moments

For the odd test t Q1(t²), Q1(x)=x-beta,
 beta=E[k^4]/(4 E[k²]),
 E[k²]=47G00+66G01,
 E[k^4]=66²G11+2*47*66G01+47²G00.
Only old entries G00,G01,G11 are read. In particular G12, which contains the unknown next odd moment, is not accessed or used in this mode. The positive opposite operator is
 A=D6/64+(beta/8)D4+(beta²/4)D2;
the actual odd operator is -A. The interval beta is positive.

For the even test P2(x), write
 P2=(10500/16)p4+a p2+b,
 (b,a)^T=-(10500/16)G_old^-1(G02,G12)^T,
 G_old=[[G00,G01],[G01,G11]].
Then c1=-551/8+2a/33, c0=6419/16-47a/66+b,
 P2=x²+c1 x+c0.
Only old G00,G01,G11,G02,G12 are read. G22 and any next-pivot reserve are not used. The checker verifies det G_old>0, c0>0,c1<0, so all coefficients of P2(-D²/4)^2 are nonnegative.

Both modes have explicit arithmetic sign cutoff64 under the reviewed degree-only theorem (K=6 or8). For odd parity, the entire negative arithmetic remainder is subtracted using the reviewed Tail_K(64) bound, not dropped.

## 2. Failed interval forms are preserved

The odd1 original12000-cell interval-rectangle implementation had a directed paid lower endpoint about -337.071. Moving common coefficients outside the derivative-order sums improved this to -218.895 but did not certify. These are failed LOWER BOUNDS, not counterexamples or negative true pivots. Both valid odd1 failures are preserved.

An initial even2 implementation mistakenly swapped the p0 and p2 regression coordinates. Its rectangle, grouped, and midpoint outputs are INVALID for the actual target and are preserved under invalid_even2_swapped/ with an explicit status warning. The error was found before independent acceptance. The corrected code labels the first inverse component b and the second a, consistently with Section1. Only the corrected midpoint even2 replay below can be treated as a target certificate. This implementation error is distinct from the valid odd1 enclosure failures.

## 3. Rigorous midpoint rule preserving the aggregate coefficient dependence

The successful checker certify_midpoint_core.py integrates each derivative-order arithmetic sum first, then applies the same actual prefix coefficient intervals once. It uses6000 cells on0<=w<=3,160-bit Arb, and an interval second-derivative error on each cell.

For a fixed arithmetic index k, R=(log k)/2, z=pi k, S=2z cosh(2w), S'=4z sinh(2w), S''=4S. Let d=d(k), e=ell_2(k)/4 and
 T_j(S)=64z4 Q_j^9(S)-96z²S Q_j^7(S)+144z²Q_j^5(S).
The full symmetric integrand is
 F_j(w)=2k^-1/2 e^(R-S)(d w²+e)T_j(S).
Its exact second derivative is
 F_j''=2k^-1/2 e^(R-S){2dT_j+4dw(T_j'-T_j)S'
 +(dw²+e)[(T_j''-2T_j'+T_j)(S')²+4S(T_j'-T_j)]}.
Each cell of width h uses h F_j(midpoint) with error radius h³ sup|F_j''|/24. The displayed derivative is enclosed on the entire cell by interval arithmetic. Thus the improvement is rigorous quadrature, not midpoint sampling without error control.

The omitted spatial tails |w|>=3 are paid for all k=1,...,63. The geometric arithmetic remainder k>=64 is also paid for the odd target. The exact coefficient polynomial is not normalized by an unknown next norm.

## 4. Successful independently replayed results

Odd1: after subtracting its negative arithmetic remainder (<5.298e-19), the normalized contact lower endpoint is >257.002125. Hence the original odd pivot is >4pi*257>3084, using pi>3.

Even2: the normalized contact lower endpoint is >11757.119985; the omitted arithmetic remainder is positive. Hence the original even pivot is >4pi*11757>141084. Its absolute arithmetic tail bound, if desired, is <2.445e-13.

These results use only existing prefix data, not either target's known positive reserve. They verify that aggregate arithmetic cancellation and the odd-tail payment work beyond the first example. They do not establish a growing-degree sign invariant or justify extrapolation to all N.
