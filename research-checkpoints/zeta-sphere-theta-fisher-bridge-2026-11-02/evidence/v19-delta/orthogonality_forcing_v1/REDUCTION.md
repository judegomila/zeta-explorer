# Exact Schur-orthogonality reduction of the Newman forcing

Status: new analytic identity, pending independent review. It provides a structural spatial-mean target, NOT a sign theorem.

Use g=e^{au+lambda u²}psi real. For the unique real same-parity monic Schur residual p of degree n (assuming its actual lower parity block positive), strip the common phase from p(-iD) and write the resulting real constant-coefficient parity-n operator as T(D). Let
 F=Tg, K=T'g, L=T''g,
 where primes on T differentiate its polynomial symbol, not u. The real function F differs from p(-iD)g by a unit complex constant, and K similarly differs from p'(-iD)g.

## General integration identity
For ANY real parity operator T and rapidly decaying real g,
 integral u² F K = -integral u(K²+F L).
Proof: integration by parts with [T,u²]=2uT'+T'' and [T',u²]=2uT''+T''' gives
 integral u²(Tg)(T'g)=(-1)^n integral u g[(T')²-T''T]g.
The leftover unweighted odd differential-operator forms vanish by skew-adjointness. Transfer one T' in the first term and T'' in the second. Again the unweighted opposite-parity cross forms vanish, yielding the displayed identity.

## Use ACTUAL residual orthogonality
T''g belongs to the lower same-parity feature span. Therefore actual signed Schur orthogonality gives
 integral u F L=0.
Consequently the Newman forcing defect from information_relaxation_v1 simplifies exactly to
 D=(pi/2)[integral u³F² - 2 integral uK²].
The second integral is precisely the opposite-parity derivative-rung bridge energy, not an arbitrary positive Sobolev norm. It is nonnegative only when that opposite-parity block has been independently proved positive. An isolated odd19 result does NOT supply the even18 sign.

This changes the prospective sufficient comparison into a concrete cubic spatial residual moment versus actual lower-rung energy. A bound of the former by twice the latter would give nonincreasing Schur residual along the Newman parameter. Such an inequality has NOT been proved for full theta uniformly in degree; the signed cubic moment is not a probability moment without further work.

## Diagnostic warning: equivalent integrated formulas need not give better local budgets
The self-authored floating diagnostic paid_relaxation_v2/theta_budget_reduced.py replaces the original paired forcing density by the exact reduced density u³F²-2uK² and then takes its reflected positive part. At a=.25,Lambda1 it gives budget/terminal ratios approximately n2:.67867,n3:1.24846,n4:1.81906,n5:2.21124,n6:2.53185,n7:2.99195. These are WORSE than the original commutator-paired density's ratios .33324,.60003,.89783,1.16414,1.41404,1.68681. All are floating diagnostics, not certificates.
Thus the reduction supplies an exact structural target, but simply dropping its negative local terms is not an improvement. Useful progress requires a theta-specific integrated comparison preserving the orthogonality cancellation, not an arbitrary high-jet norm or pointwise positivity shortcut.
