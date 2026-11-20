# Exact dyadic pairing of the inverse-selected residual eta cost

Independently reviewed analytic PASS. This collapses the translation-correlation series into the SAME arithmetic kernels as the target. It does not prove the low-index core inequality.

Let p be the actual known even residual P_N(t²) or odd residual tQ_N(t²). Set
 T_p=p(-iD_r/2)^2,
 A_theta(r)=integral psi(r+v)psi(r-v)dv,
 a_k=T_p A_f((log k)/2), c_k=T_p C_f((log k)/2).
T_p has real coefficients. It is the previously studied positive-coefficient operator for even p, and the negative of such an operator for odd p. No unknown next norm is used.

## 1. Actual residual correlations and an exact arithmetic collapse

For g=p(-iD_u)psi, its eta-shift correlation is exactly
 C_m=Re integral g(u+mL)conjugate(g(u))du
     =T_p A_theta(mL/2), L=log2.
The unweighted midpoint divisor formula is
 A_theta(r)=sum_(k>=1)k^-1/2 d(k) A_f(r+(log k)/2).
Writing j=2^m k and q=2^-1/2 gives the exact cancellation
 q^m C_m=sum_(2^m|j)j^-1/2 d(j/2^m) a_j.           (1)
Thus the full eta cost is
 E[p]=2pi L² sum_(j>=1)j^-1/2 D_eta(j)a_j,
 D_eta(j)=3d(j)+5 sum_(m=1)^v2(j)d(j/2^m).          (2)
For j=2^v u with u odd,
 D_eta(j)=d(u)(v+1)(3+5v/2)=d(j)(3+5v/2).          (3)
The geometric scale factors have disappeared exactly, not been bounded separately. All coefficients of the actual inverse-selected p remain inside the same a_j. Fixed-degree absolute convergence follows from the established single-orbit bounds: after reindexing only polynomial/logarithmic divisor weights multiply exp(-c j). This justifies exchanging the two sums despite signed a_j.

The original target is, with the SAME a_j,c_j,
 h[p]=4pi sum_(j>=1)j^-1/2[d(j)c_j+ell_2(j)a_j/4]. (4)
Equations(2)-(4) are therefore a correlated arithmetic representation of the payment, not an auxiliary parent substitution.

## 2. Exact prime-exponent variance

If j=product_l p_l^(e_l), uniform choice among divisors makes the exponents independent uniform integers0,...,e_l. Therefore
 ell_2(j)/d(j)=(1/3)sum_l e_l(e_l+2)(log p_l)².     (5)
This can also be proved by expanding the finite divisor sum and pairing exponents e_l-a_l; all cross terms vanish.

In particular, for j=2^v u with u odd,
 ell_2(j)=(v+1)ell_2(u)
          +d(u)L² v(v+1)(v+2)/3.                  (6)
The target's dyadic variance grows quadratically in v, whereas its eta-cost weight grows linearly. This is an exact arithmetic relation; no derivative or residual correlation has been assigned a sign yet.

## 3. A rigorous high-index comparison, with the odd sign retained

Beyond the established degree-only cutoff k_K, even residuals have a_j>0,c_j>0. The per-index target H_j and payment E_j from(4) and(2) satisfy
 H_j/E_j >= [ell_2(j)/d(j)]/[2L²(3+5v/2)].         (7)
For v>=15, the dyadic term alone yields H_j>=E_j. More generally there is a coarse degree-INDEPENDENT arithmetic threshold: if j>=2^21, then
 ell_2(j)/d(j)>=L²(6+5v).                          (8)
To verify this, each odd prime is>=3>2^(3/2), and e(e+2)>=3e. Equation(5) gives
 ell_2(j)/d(j)>=L²[v(v+2)/3+(3/2)log_2 u].
For log_2 j>=21 this is at least L²(6+5v), since
 2v²-35v+153=(v-9)(2v-17)>=0
for every nonnegative INTEGER v (the two real roots8.5 and9 contain no integer strictly between). This proves(8), including boundary v=9.

Consequently for even residuals and j>=max(k_K,2^21), the original positive target contribution pays at least its entire eta subtraction contribution, index by index. This is a real high-index domination using the same residual, not filtered positivity alone.

For odd residuals, the same high-index kernels have a_j<0,c_j<0. The direction is then
 H_j<=E_j<0, equivalently |H_j|>=|E_j|.
Thus the odd negative arithmetic tail is NOT removed or made favorable by this comparison. Its previously established geometric magnitude bound must still be paid. This sign reversal is essential to any proposed twin-ladder induction.

## 4. What this localizes, and what it does not

The exact dyadic reindexing removes separate translation-correlation errors from the eta payment. It also shows that arbitrarily large arithmetic indices do not hide an uncontrolled even-rung subtraction: beyond the explicit joint threshold, the target itself pays that cost termwise. The low arithmetic core and the odd negative remainder remain genuine obligations.

The coarse2^21 threshold is a structural bound, NOT an invitation to run millions of finite terms; complete-theta decay already makes such terms negligible. The existing sharper degree-only sign cutoff and geometric tail bounds remain preferable computationally. No uniform sign for the low-index actual core, no new pivot certificate, and no all-degree filtered domination is established here.
