# Parity-weighted, degree-scaled selected dual

Status: independent analytical review PASS. The reformulation preserves strict positive feasibility but does not prove it at every degree or fixed critical shift.

## 1. A positive normalization that leaves the actual inverse unchanged

Fix n=epsilon+2N, N>=1, and a shift at which the actual old parity prefix is positive. Retain f_c,z_c,A_loc and the actual coefficients c=-A^-1b. Put
w_epsilon(u)=g_epsilon(u), so w_0=1 and w_1=g_1>17/2.
Define
F_c=f_c/w_epsilon, Z_c=z_c/w_epsilon,
drho_tilde=w_epsilon drho/E_rho w_epsilon.
Then E_(rho_tilde) Z_c=0 exactly. Integrating the local old matrix divided by w_epsilon against rho_tilde gives the old matrix divided by the same positive scalar as its cross column. The actual inverse-selected c is therefore unchanged; no auxiliary inverse is substituted.

Define the reoptimized weighted margin

T(a)=sup_v inf_(u>=0) [F_c(u)-2v^T Z_c(u)].                 (1)

All fixed-degree attainment and N+1-atom dual arguments carry over. Indeed the complete-theta asymptotics give F_c~constant Z^(2N) and the independent cross components Z_c,k have distinct leading powers Z^(N+k), k<N. The tilted actual reference measure is positive on every positive-u interval and has zero cross means. Thus the same coercivity and finite-contact argument applies without assuming the target norm positive.

## 2. Strict positive feasibility is exactly preserved

Let L be the original optimized margin. If T>0, a weighted supporting plane gives
f_c-2v^Tz_c>=T w_epsilon>=T m_epsilon,
where m_0=1 and m_1=min g_1>17/2. Hence L>=m_epsilon T>0.

Conversely if L>0, choose a plane with f_c-2v^Tz_c>=ell>0. Its ratio by w_epsilon is positive and continuous on every compact interval. At infinity the ratio tends to positive infinity because N>=1 and its leading power is Z^(2N). Its global infimum is therefore strictly positive. Thus

L>0 if and only if T>0.                                   (2)

This is equivalence of strict feasibility, not equality of the two margins or their optimizers. The complete-theta tails are essential in the converse.

For the exact original normalization, the change of probability measure also gives the fractional dual representation

L=inf_(sigma probability, E_sigma Z_c=0)
          E_sigma F_c / E_sigma(1/w_epsilon),              (3)

with finite relevant integrals. The original optimal finite-atom witness maps to one with the same support. In contrast, T is the minimum of E_sigma F_c alone. Equation (3) records the normalization cost rather than discarding it.

## 3. A degree-sensitive coefficient scale from the known prefix

Any positive scale s obtained from the known prefix is allowed. For example choose
s^2=max(1,max_(i<N)|c_i|^(1/(N-i))).
Set cbar_i=c_i/s^(2(N-i)), cbar_N=1, and
Gbar_j(u)=g_(epsilon+j)(u)/(w_epsilon(u)s^(2j)).
The scaled local expression is
Fbar=sum_(i,k=0)^N cbar_i cbar_k Gbar_(i+k)=F_c/s^(4N),
Zbar_k=sum_(i=0)^N cbar_i Gbar_(i+k)=Z_c,k/s^(2(N+k)).
Writing v_k=s^(2(N-k)) vbar_k yields

F_c-2v^T Z_c=s^(4N)[Fbar-2vbar^T Zbar].                    (4)

Thus coefficients, supporting vectors and margin can be compared in actual prefix-adapted units without any assumed fixed fraction of the target pivot. The chosen cbar coefficients have magnitude at most one. This does not bound the scaled optimizer, the local signed metric or the actual inverse uniformly in degree. The displayed max scale need not be differentiable; no smooth-flow claim is made by differentiating it.

## 4. Sharp cubic weighted asymptotic

For the actual cubic p=t^3-alpha(a)t, alpha=M_2/M_1=3a+O(1), set
X=g_2/g_1, Y=g_3/g_1.
Then
F=Y-2alpha X+alpha^2, Z_c=X-alpha.
The complete-theta estimates are X=6Z+O(1), Y=60Z^2+O(Z), uniformly after enlarging constants on the compact region. Choose v=2a. The weighted remainder is

Y-2(alpha+2a)X+alpha^2+4a alpha
 =60(Z-a/2)^2+6a^2+O(a+Z+1).                              (5)

Completing the square in the error term gives a uniform lower bound 6a^2-O(a), over every u>=0. For an upper bound, continuity and unboundedness of X give a point u_a with X(u_a)=alpha for all sufficiently large a. At that point Z=a/2+O(1), so the exact one-atom weighted-dual witness has
F(u_a)=Y(u_a)-alpha^2=6a^2+O(a).
It obeys Z_c(u_a)=0 exactly. Consequently

T(a)=6a^2+O(a).                                           (6)

For every optimal weighted supporting coefficient v_a, evaluate its remainder at Z=(1/2+delta)a and Z=(1/2-delta)a, with any fixed 0<delta<1/2. Comparing with (6) gives
2-5delta<=liminf v_a/a<=limsup v_a/a<=2+5delta.
Letting delta decrease to zero proves v_a/a->2. This optimizer differs from the original-margin optimizer, whose audited limit is 2+sqrt(10).

The actual weighted target is
E_(rho_tilde)F=E_rho f/E_rho g_1=6a^2+O(a).
Therefore T/E_(rho_tilde)F->1. By comparison, the original margin divided by its unweighted mean tends to zero like 1/a. Parity weighting removes that specific degeneracy without changing positive feasibility. This is a large-shift fixed-degree statement; it is not a claim about all-degree optimizer conditioning.

## 5. Remaining critical-shift problem

The reformulation retains every signed local g_j, the same actual selected coefficients and inverse, and the exact positive normalization. Division by g_1 cannot turn an indefinite local old block positive. The previously certified negative selected canonical remainder remains negative after division by a positive factor; no coefficientwise positivity shortcut is introduced.

At fixed critical shifts, neither a degree-uniform positive T nor a negative optimized witness is established. The formulation identifies a legitimate scale and removes one proven misleading reserve comparison; it does not supply the missing theta-specific signed inequality. No numerical degree escalation or external code is used.
