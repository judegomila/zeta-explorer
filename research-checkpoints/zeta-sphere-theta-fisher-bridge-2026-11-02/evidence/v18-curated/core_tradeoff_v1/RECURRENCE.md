# Direction-matched signed-core recurrence

Finite interval tests, independent replay, and independent analytic review passed. Algebra is stated for arbitrary finite dimension under the displayed nondegeneracy assumptions. No uniform theta estimate is claimed.

## 1. Avoid multiplying unrelated worst directions
After a core inertia congruence C=diag(−N,P), define the actual shorted tail

E=Tnn−Tnp(P+Tpp)^(-1)Tpn.

The true repair criterion is E>N. The scalar sufficient bound kappa(1−eta)>1 discards alignment between the cheapest tail direction and largest coupling direction. In the reviewed odd-degree19 example, floating generalized eigenvalues of E relative to N are approximately106.65,344.59,1351.14, whereas the floating scalar product kappa(1−eta) is only about5.48. Those floating numbers motivate, but do not certify, the following stronger checked bound.

Using existing reviewed full-theta moment intervals, the new checker certifies **E>100N**, on the entire three-dimensional negative sector, after all five positive complement channels are eliminated. This strengthens the earlier complete finite repair without changing degree or shift.

## 2. Exact positive-channel update
Suppose m positive complement channels have combined block A_m=P_m+Tpp_m>0 and cross block B_m. Then E_m=Tnn−B_m A_m^(-1)B_m*. Append one positive complement channel, writing

A_(m+1)=[A_m d;d* a], B_(m+1)=[B_m b].

Let s=a−d*A_m^(-1)d>0 and u=b−B_m A_m^(-1)d. Block inversion gives the exact update

E_(m+1)=E_m−u u*/s.

For any target c>0, define R_m=E_m−cN. If R_m>0, the next reserve is positive exactly when

alpha_m=u*R_m^(-1)u/s<1.

The inverse and determinant update without losing direction alignment:

R_(m+1)^(-1)=R_m^(-1)+R_m^(-1)u u*R_m^(-1)/(s−u*R_m^(-1)u),

det R_(m+1)=det R_m(1−alpha_m).

This is a scalar conditional cost in the *current actual reserve metric*, not a raw absolute derivative bound or a product of global eigenvalue extrema.

### Executed finite check, c=100
Outward interval upper bounds for the five successive costs are

.987828, .823253, .816754, .263939, .914360,

all strictly below1. Every intermediate R_m and final E−100N is verified by interval positive LDL. These costs are not monotone and not small; there is no evidence here for a uniform summable sequence. For positivity at every finite degree, alpha_m<1 at every finite step is enough. A positive infinite determinant/coercivity margin would need additional bounds; summability must not be confused with the finite-degree goal.

## 3. Degree extension with changing core inertia
A degree extension need not keep the negative-sector dimension fixed. There is nevertheless an exact two-case recursion that avoids a fresh global eigensplit.

Given an invertible finite core matrix C and its new border [C c;c* d], use the invertible core-orthogonalizing change of basis q_new=e_new−C^(-1)c. This makes the core block diag(C,delta), delta=d−c*C^(-1)c. Apply the *same* change of basis to the actual tail; its transformed entries retain all correlations.

- If delta>0, the new channel joins the positive core complement. Its elimination uses the rank-one update in Section2. Full repair survives exactly when the associated conditional alpha<1 (assuming the combined positive complement stays positive).
- If delta<0, the new channel joins the negative sector with new cost −delta. After eliminating the old positive complement, write the enlarged shorted-tail matrix as [E u;u* tau]. For target c=1, the enlarged repair residual is [R u;u* tau+delta], where R=E−N. It is positive exactly when tau+delta−u*R^(-1)u>0. For target c, replace delta by c delta and use R_c=E−cN throughout the border Schur criterion.
- If delta=0 or a required pivot cannot be certified away from zero, this scalar recursion is not applicable as written. A nonsingular2-by-2 pivot/block update, or a different core coordinate choice, is required; no division by an uncertain core pivot is allowed.

These two exact updates provide a finite-dimensional route to scalable constants. A uniform theta proof would need to bound the positive-birth conditional costs and negative-birth conditional tail reserves, together with positivity of the actual tail/complement blocks, as degree grows. The independently established far-outer Gaussian theorem does not by itself supply these normalized conditional estimates. No such all-degree estimates have yet been proved.


## 4. Invariant full-space relative sandwich

The same interval data also directly certify, on the entire odd10-dimensional block at a=0,

−T/400 < C < T/50.

The checker evaluates positive LDL for T+400C and T−50C; T itself was independently proved positive. This yields

.9975T < C+T < 1.02T,

or spectrum(T^(-1/2) C T^(-1/2)) contained in(−.0025,.02). Thus the three negative core directions consume less than0.25percent of the **actual** tail reserve on every direction, with all lower-channel and complement couplings retained. This is a finite relative bound, not an all-degree assertion.

For a general degree J the comparable scalable target is C_J >=−epsilon_J T_J with epsilon_J<1, plus T_J>0. Unlike the separate kappa/eta bound, this criterion is invariant under every nonsingular congruence and does not combine extrema from unrelated directions. A uniform analytic bound on epsilon_J remains missing. The finite result should not be extrapolated: polynomial spaces can concentrate differently as J grows.

## 5. Sharp degree-dependent relative-cost recursion

For a fixed spatial cutoff, suppose the actual nested tail matrices T_J are positive definite. Define

epsilon_J=max(0, sup_(v!=0) −v*C_Jv/(v*T_Jv)).

This is the least nonnegative relative negative-core cost. Precisely, C_J+epsilon T_J is positive definite iff epsilon>−lambda_min(T_J^(-1/2)C_J T_J^(-1/2)). Thus epsilon=0 is allowed when C_J itself is positive definite; if the threshold is zero with a zero eigenvalue, strict positivity requires epsilon>0. Because polynomial subspaces nest, epsilon_J is **nondecreasing** in J. The small finite value cannot be assumed to improve with degree.

For a new border, write C+epsilon T=[A_e b_e;b_e* d_e], where A_e=C_old+epsilon T_old. Whenever A_e>0, let x=A_e^(-1)b_e and

s_J(epsilon)=d_e−b_e*A_e^(-1)b_e.

Then the new relative positivity condition is exactly s_J(epsilon)>0. Its derivatives are

s'_J(epsilon)=d_T−2Re(x*b_T)+x*T_old x
= tau_T+(x−r_T)*T_old(x−r_T) >=tau_T>0,

where r_T=T_old^(-1)b_T and tau_T=d_T−b_T*T_old^(-1)b_T is the actual tail conditional variance. Also

s''_J(epsilon)=−2(b_T−T_old x)*A_e^(-1)(b_T−T_old x)<=0.

Thus the border reserve is increasing and concave in the relative allowance, with an explicit strictly positive derivative lower bound from the actual tail. For any epsilon_0 with A_(epsilon_0)>0,

s_J(epsilon) >= s_J(epsilon_0)+(epsilon−epsilon_0)tau_T, epsilon>=epsilon_0.

Consequently a sufficient next allowance is

epsilon > epsilon_0 + max(0,−s_J(epsilon_0))/tau_T,

with an arbitrarily small positive slack if the right side gives equality. This is a sharp-structure, verifiable theta-dependent degree recurrence: it measures the new deficit against the actual conditional tail reserve, and retains a nonnegative mismatch term in the exact derivative. It does not replace the latter by a distant Gaussian-tail mass.

A uniform proof could bound these normalized border deficits so that allowances remain below1. A summable upper sequence with total budget<1 is one sufficient route, not a proved property and not necessary for finite-degree positivity. The unresolved premises are actual tail positivity at growing degree and uniform control of the normalized conditional deficits. No extrapolation from the degree19 certificate supplies either premise.
