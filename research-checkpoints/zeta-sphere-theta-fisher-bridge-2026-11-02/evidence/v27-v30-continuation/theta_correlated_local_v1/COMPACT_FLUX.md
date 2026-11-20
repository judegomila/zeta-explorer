# Exact compact-interval cancellation, using known contacts only

Independently reviewed analytic PASS. This is an exact evaluation identity, not a new sign theorem. It complements the explicit full-tail payment and records the remaining subtraction honestly.

Let kappa=2sqrt(s), L_N=sum_even a_k D^k, K=4N. Set
 b_j(kappa)=sum_(k>j) a_k kappa^(k-1-j), 0<=j<K,
 B_R(kappa)=sum_(j=0)^(K-1) b_j(kappa) C^(j)(R),
 I_R=integral_0^R C(r)e^(-kappa r)dr.
Finite repeated integration by parts gives exactly
 integral_0^R C_N(r)e^(-kappa r)dr
   =P_N(-s)^2 I_R+e^(-kappa R)B_R(kappa)-B_0(kappa). (1)
There is no unknown highest derivative in B_0: evenness kills its odd contacts, and
 C^(2j)(0)=(-4)^j mu_j/(4pi), j<=2N-1.              (2)
All these moments belong to the existing actual prefix. The original unknown pivot is C_N(0), which includes the contact C^(4N)(0); it is absent from (1)-(2).

Similarly on [R,infinity), the rapid complete-theta decay gives
 integral_R^infinity C_N(r)e^(-kappa r)dr
   =P_N(-s)^2 integral_R^infinity C(r)e^(-kappa r)dr
      -e^(-kappa R)B_R(kappa).                     (3)
Thus the finite endpoint terms cancel exactly when the intervals are joined. A positive high-derivative tail cannot be counted while silently deleting its boundary flux in the compact interval.

The known subtraction is exactly the old actual inverse cost. With rho_N=b^T C_old^-1 b from RATIONAL_SOS.md,
 B_0(kappa)=kappa P_N(-s)^2 rho_N/(16pi).            (4)
This follows either from the rational recurrence or by comparing (1)+(3) with the audited resolvent identity; it introduces no next-pivot sign. Hence the positive primitive I_R is not an independent reserve. Approximating it and B_0 separately reintroduces the amplified cancellation avoided by direct correlated integration.

Equations (1)-(3) nevertheless offer a finite-degree evaluation option with only the base positive kernel, known prefix contacts, and boundary data: use rigorous joint intervals, or a single compensated integrand, rather than discarding the negative contact term. Modular reflection provides precisely the zero odd contacts; it supplies no additional sign for the known alternating even-contact combination.

Scope: exact compact cancellation with no unknown contact assumed, but no compact signed lower bound. The main new inequality remains the explicit complete-tail estimate in PAID_NONCENTRAL_TAIL.md.
