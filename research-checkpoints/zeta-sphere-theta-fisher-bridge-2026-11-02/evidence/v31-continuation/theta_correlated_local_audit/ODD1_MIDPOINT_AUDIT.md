# Independent odd1 midpoint arithmetic audit

PASS, 2026-11-03,6000 cells,160-bit Arb. Owned source copied and replayed in next_core_replay; odd1 output is accepted. The contemporaneous even2 branch had a separately documented regression-coordinate error and is NOT accepted from this initial source.

Odd1 reads only G00,G01,G11. The conversions E[k²]=47G00+66G01 and E[k4]=66²G11+2*47*66G01+47²G00 are exact. beta=E[k4]/(4E[k²]) is positive and defines the actual monic odd residual t(t²-beta). The positive opposite spatial operator has coefficients beta²/4,beta/8,1/64 at orders2,4,6; the actual target carries minus sign. No next odd moment G12 or next reserve is used.

For H(w)=d w²+e and T(S), differentiating exp(-S)H T twice gives exactly2dT+4dw(T'-T)S'+H[(T''-2T'+T)(S')²+S''(T'-T)], with S''=4S. The checker encloses that expression throughout each closed cell and adds width³ sup|F''|/24 to its midpoint contribution. Prefix coefficients are applied once after summing derivative-order intervals, preserving their common aggregate dependence without falsely treating them as independent exact numbers.

The same full spatial-tail argument used for even1 applies to every retained k1..63, now through order6, with actual positive coefficient upper bounds. Live comparisons establish the sign cutoff64 for K6 and all prerequisites of the geometric arithmetic remainder bound. Because the odd omitted arithmetic terms are negative, the checker subtracts their upper magnitude rather than dropping them.

Independent replay gave paid contact lower257.00212502487530227785969427737747850955744264, integration tail<2.106e-256 and arithmetic tail<5.298e-19. Hence original odd pivot>4pi*257>3084. This independently checks an already-known rung via arithmetic cancellation, not a ladder extension or uniform proof. The inherited old-contact enclosure itself was not regenerated.

The separate LOW_DIVISOR_GROUPING note also checks against the independent even1 rectangle output: the first two upper endpoints sum below-1.07 and the first three lower endpoints sum above6.07, with negligible already-paid tails. The observation does not establish a degree-uniform grouping rule or positive block form.
