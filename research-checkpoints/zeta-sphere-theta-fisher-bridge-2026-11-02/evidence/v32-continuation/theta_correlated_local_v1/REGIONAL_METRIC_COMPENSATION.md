# Quantitative regional compensation and its degree/split limits

Independent analytic review and all four numerical replays PASS. Finite tests cover existing even6 and odd7 normalized rungs, with exact full-theta error bounds. No higher target is certified here.

## 1. Common normal-equation imbalance gives a usable bound

Let A_C,A_T be actual positive regional old matrices, z_C,z_T their regional regression coefficients, and zbar the actual global old-inverse solution. Define
 e=A_C(z_C-zbar)=-A_T(z_T-zbar).
This identity is the global normal equation. Therefore
 V_C=e^T A_C^-1 e,
 V_T=e^T A_T^-1 e,
 V=V_C+V_T.
If the actual matrices satisfy A_C<=gamma A_T, inverse order gives A_T^-1<=gamma A_C^-1 and consequently
             V_C>=V/(1+gamma).                     (1)
No matrix commutation, diagonal-parent substitution, or target-norm normalization is used. The matrices and e depend only on old moments and target cross columns, not the unknown top target entry. The negative debit s_C itself still contains that target entry and must be bounded honestly.

A sufficient core-payment test is
 s_C+V/(1+gamma)>0.                                (2)
It is stronger than the exact s_C+V_C>0 test and is not asserted necessary. The full target is always s_C+s_T+V; tail reserve remains available even if(2) fails.

## 2. Both parity ladders pass a finite actual-metric test

`check_regional_metric_domination.py` forms gamma A_T-A_C from the actual interval old moments and certifies positive LDL pivots. Gamma is selected from a discrete power-of-two grid; the first passing tested value is a certified upper comparison, **not** the optimal generalized eigenvalue ratio. Failed smaller tests are inconclusive, not certified lower bounds.

At the1/8 split:
- Odd7: gamma=1/8; s_C<0 but s_C+V/(1+gamma)>118863888.
- Even6: gamma=1/4; -743414<s_C<-735368, V>2873874, and s_C+V/(1+gamma)>1555686. Full combined margin>63384141.
Units are h/(4pi). The even6 calculation uses the old even basis1,t²,t⁴, moments M0..M6, and the same independently checked midpoint/full-orbit machinery; it does not borrow a target reserve. The moment-index shift is explicit in the source.

At the1/2 split, both odd7 and even6 have positive regional target remainders, and gamma=128 is certified in each old metric. This does not establish that128 is sharp; it demonstrates how differently the same proof's actual metric bound behaves with the split. The fourth case is stored separately in `degree6_half_partition_4000.json`.

## 3. A rigorous obstruction to reusing the same split at the next degree

At1/8, the odd7 and even6 central target blocks each have one negative direction: old regional positivity plus s_C<0 proves this by Schur congruence. These *target* blocks become the *old* central matrices at the next odd9 and even8 rung. Therefore they are not positive metrics there. The same1/8 positive-metric argument cannot be iterated even one further step in either ladder.

At1/2, both regional odd7 and even6 target blocks are positive definite. Thus they do supply valid old regional metrics for odd9 and even8, respectively. This is only a statement about known old blocks. No next target columns, entries or Schur signs are calculated or inferred.

For a fixed split and one parity, as long as the nested regional old blocks remain positive, the optimal comparison
 gamma_n=sup_(q in olddegree_n, q nonzero) Q_C(q)/Q_T(q)
is nondecreasing with degree, simply because the polynomial spaces are nested. This does not apply across different parity spaces. If a regional block loses positivity, the positive-metric comparison stops being available rather than extending by continuity through an indefinite inverse.

## 4. Moving the split outward has an explicit theta cost

There cannot be a split-independent comparison constant as the cutoff H tends to infinity. This can be quantified without any high-degree or target assumption. Put Z=pi exp(2H), H>=2. The already-proved complete-theta moment envelopes imply
 M0_tail <=(256/sqrt(pi)) Z^(9/2) exp(-2Z),
 M1_tail <=(4608/sqrt(pi)) Z^(11/2) exp(-2Z).
The actual1/8 core intervals give M0_core>.003 and M1_core>.03. These scalar core masses only increase as H grows: g0=1 and g1=-k/2>0. Hence any valid positive-old-metric comparison A_C<=gamma A_T must satisfy
 even: gamma >= (.003 sqrt(pi)/256) exp(2Z)/Z^(9/2),
 odd:  gamma >= (.03 sqrt(pi)/4608) exp(2Z)/Z^(11/2). (3)
Use the lowest monomial1 or t in the Rayleigh quotient. This conclusion is conditional only on the regional old metrics being positive and the comparison being proposed; it does not assume their positivity at all degrees. It shows a concrete, complete-theta cost of moving an adaptive split outward. It does not compare that cost with an unproved degree-uniform bound for e or s_C.

## 5. Generic positivity does not force this payment allocation

A simple exact matrix counterexample prevents an unjustified shortcut. Take scalar old blocks A_C=A_T=1, b_C=b_T=0, and target entries c_C=-1,c_T=2. The core target matrix diag(1,-1) is indefinite; the tail diag(1,2) and their sum diag(2,1) are positive definite. Yet z_C=z_T=zbar=0, V_C=V_T=0, so the core debit is paid entirely by the tail target reserve, not by regression mismatch. Gamma=1 does not create a nonzero correction.

This is an abstract matrix counterexample, not a theta counterexample. It establishes that(2) is sufficient rather than logically required by positive global target and positive regional old metrics. In the actual theta examples the verified nonzero e supplies the payment; the matrix identity alone cannot do so.

## 6. Remaining uniform task

The useful quantitative theorem is(1), demonstrated in both actual parity ladders. Uniform closure still needs an adaptive partition whose old metrics remain valid and a joint bound on its true source debit, cross-column imbalance and tail reserve. Fixed-split reuse is already disproved at the next old rung, while moving the split outward incurs(3). Neither the finite successes nor the variance identity provide that joint degree-dependent estimate.
