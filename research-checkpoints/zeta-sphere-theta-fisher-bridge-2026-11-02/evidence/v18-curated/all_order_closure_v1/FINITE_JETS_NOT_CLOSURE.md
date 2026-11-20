# Arbitrarily many finite jet certificates plus a Gaussian envelope do not close the hierarchy

Auxiliary exact obstruction, not a counterexample to theta or RH. For every fixed finite jet order J there is an even positive analytic profile φ with log φ″≤−24 such that all C_a/ a confluent matrices through J are strictly positive uniformly 0≤a≤1/2, yet C_(1/4) is not positive definite.

Take β=16, b=16, and φ_ε(u)=exp(−βu²)(1+ε cos(bu)), 0<ε≤1/33. Then
(log φ_ε)″≤−2β+εb²/(1−ε)≤−24.
Therefore its bridge kernel obeys 0<C_a(v)≤C_a(0)exp(−24v²). The cosine transform, up to a harmless positive constant, is
F(z)=exp(−z²/(4β))(1+q cosh(dz)), q=ε exp(−b²/(4β))=εe^−4, d=b/(2β)=1/2.

At ε=0, C_a(v)/a is a positive scalar times exp(−2βv²), including the removable a=0 limit. Its finite confluent matrices are strictly positive. Their entries depend continuously on (ε,a) uniformly on compact a∈[0,1/2], since the profiles and their finitely many derivatives have a common Gaussian dominator. Compactness supplies, for each fixed J, ε_J>0 such that all these finite matrices remain strictly positive for 0<ε<ε_J. This is an existence statement, not an explicit numerical ε_J bound.

Nevertheless choose t_ε>0 with q cosh(dt_ε)=1, and a=1/4. Put x=da=1/8. Direct differentiation gives

(1/2)∂_a|F(t_ε+ia)|² / exp((a²−t_ε²)/(2β))
 = (a/β)(1+cos x)−(aq²/(2β))sin²x−d sin x(1+q²cos x).

Because cos x>0 and sin x≥x−x³/6, this is at most
2a/β−d(x−x³/6)=1/32−(1/16−1/6144)=−191/6144<0.

Thus the Fourier transform of the bridge kernel is negative there. As ε→0 this bad height escapes to infinity, while any prescribed finite jet information remains positive.

This shows why a proof using only any finite initial segment of the jets, analytic regularity, and strong Gaussian envelope cannot establish all-order closure. A modular identity, an integrated all-degree inequality, or another genuinely additional property must enter. The example is Gaussian-decaying rather than the superexponential theta profile, and does not preserve the theta modular relation. No conclusion about θ or RH follows from this counterexample.
