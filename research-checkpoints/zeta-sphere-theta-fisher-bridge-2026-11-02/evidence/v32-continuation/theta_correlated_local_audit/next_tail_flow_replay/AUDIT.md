# Next-target inward tail flow: implementation review

2026-11-03. Review/replay underway; no final sign acceptance yet. Independent copies of owned code retained here. No acquired code execution.

The derivative20 extension preserves the prior ratio method. The geometric bound on rational amplitude derivatives uses exponent21, yielding an amplitude majorant2^24*n^4*2^j*j! through j20. Stirling/Leibniz then gives C=2^25*20!*4^20 times n^44*z^20*exp(-(n^2-1)z). The n>=9 ratio assertion bounds the complete omitted sum by2C*9^44*z^20*exp(-80z). These derivative enclosures are divided by j! before adding to power-series coefficients, as required. The normalized midpoint log series through degree18, together with first/second physical derivatives, needs log derivatives through20 and supplies g0..g9.

At z>=100 the improved amplitude bound and full n>=2 geometric tail give the stated epsilon; the explicit20!*epsilon*(1+epsilon)^19<1 controls log-composition derivatives. The moment spatial-tail envelope is the audited (256/sqrt(pi))(2j)!9^j Z^(j+9/2)exp(-2Z), with Z=pi exp4, now through j8 for old/cross input. Its logarithmic endpoint integration condition holds. Every omitted spatial/orbit contribution is included symmetrically.

Initial tail preparation independently integrates H=1/8 to2 with midpoint second-derivative errors, then adds the entire spatial tail. It shares M0..M8 between parities; even8 reads only M0..M7 and odd9 M1..M8. Their target moments M8/M9 respectively do not enter their own optimizer.

For inward time t=1/8-H, B'=local density, its first time derivative is minus the physical derivative, and its second is the unchanged physical second derivative. The code implements that minus sign in t=L'z+l'. The midpoint-state half-step is centered at physical mid+w/4 because the path traverses decreasing H. Signed partial-increment hulls and midpoint propagation are otherwise unchanged. The general4 LDL and inverse use actual old matrices; target density is evaluated directly, with no local target sign assumption. The exact S''' error formula remains valid without local PSD.

Independent8000-tail/16000-flow replay completed. Implementation checks passed and actual old4 path pivots stayed positive, but BOTH target gain intervals are INCONCLUSIVE:
- even8: approximately[-5.054240271e9,4.663638463e10], midpoint error upper142012.292, old top pivot >60,485,446.
- odd9: approximately[-4.568279005e13,5.030085361e13], midpoint error upper1.4686284681e10, old top pivot >5,562,052,726.
Both positive_gain and negative_gain flags are false. Initial tail moment spatial error max<1.145e-98. The explicit flow midpoint errors are much smaller than total output widths; this is an enclosure limitation dominated by remaining data/inverse/dependency widths, not evidence of negative target gain. Negative-source-integral lower bounds remain zero. No target sign or finite ladder advance accepted. Final standalone author proof is still pending; this record accepts the inspected formulas/enclosure mechanism and faithfully records the failed sign resolution only.
