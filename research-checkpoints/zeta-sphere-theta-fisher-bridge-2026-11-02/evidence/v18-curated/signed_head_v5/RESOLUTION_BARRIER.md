# What the explicit completed-parent error estimate can and cannot resolve

This is a bound-method obstruction, not a theorem that no sharper estimate exists.

Let tau=|k|/2 tend to infinity. The explicit low-integral upper bound in COMPLETED_PARENT_MARGIN.md is

 E_N=N^2 |Gamma(i tau)| exp(pi^2 N^4/tau)(6tau+6/tau+2/tau^3).

Since |Gamma(i tau)| is asymptotic to sqrt(2pi/tau)exp(-pi tau/2), its ratio to the proved N=1 margin scale tau^3 exp(-pi tau/2) is asymptotic to

 6sqrt(2pi) N^2 tau^(-5/2) exp(pi^2 N^4/tau).

Thus this bound is small for N=o((tau log tau)^(1/4)); for N=c(tau log tau)^(1/4) it is small when pi^2 c^4<2, and grows when pi^2 c^4>2. This comparison is only an error-scale calculation: no N-dependent positive-parent margin is asserted.

In contrast, the already proved absolute L1 mixed-orbit tail bound

 epsilon_N=150(2pi)^3 sum_(j>=N+1)j^4 exp(-2pi j)

can be below any polynomial(tau)exp(-pi tau/2) target only when N>=tau/4-O(log tau). Its first summand already forces this necessary condition on that particular majorant. At N comparable to tau the Bessel-series absolute bound contains exp(constant*tau^3), far outside the useful range.

Therefore merely combining the existing scalar spatial tail bound with the absolute small-argument series bound cannot extend the signed-head theorem to the full kernel at unbounded frequency. The estimates operate in disjoint resolution regimes. A useful next step requires genuinely oscillatory/relative orbit-tail control, or a uniform turning-point treatment that retains cancellations of the incomplete Mellin integrals. Replacing N by a larger finite test, without such an estimate, does not close the gap.

## An actual completion-cancellation obstruction as N increases

Fix k!=0 and 0<a<1/2. Write p=1/2+a and tau=k/2. Elementary Euler summation gives, uniformly on a small closed neighborhood of this p,

 S_N(s)=N^(1-s)/(1-s)+zeta(s)+O_s(N^(-Re s)), 0<Re s<1,

with differentiated analogues (logarithmic factors in the errors). Consequently the dominant term of T_N is its dual parent:

 T_N ~ c(a,k) N^(1+2a),
 c(a,k)=g_(1-p)(k)/(p^2+tau^2)>0.

Thus the completed normalized shear parent

 J_N=(partial_a(P_a T_N))/(128a)
     ~ [P_a c(a,k)/(64a)] N^(1+2a)log N -> +infinity.

On the other hand the exact grouped Fourier head D_N/a converges to the finite full density by the proved L1 Ewald remainder estimate. The collective axis is independent of N. If B_N denotes the *signed subtracted* low-integral contribution, so D_N/a=J_N+Ahat/a-B_N, then

                         B_N/J_N -> 1.

Hence no fixed relative gap q<1 can bound this low-integral cancellation by q J_N for all N at even one fixed nonzero frequency and positive shift. This is an exact obstruction, not merely weakness of (2). Completing all arithmetic integrals produces a divergent positive parent; its cancellation is essential renormalization. The finite N=1 theorem is unaffected, but positivity of the completed parent cannot itself become a uniformly coercive full arithmetic factorization by letting N grow.

This argument does not exclude a tailored simultaneous N=N(k) regime, nor a different correlated grouping. It identifies precisely why the untruncated completed positive parent is not a usable independent positive main term.
