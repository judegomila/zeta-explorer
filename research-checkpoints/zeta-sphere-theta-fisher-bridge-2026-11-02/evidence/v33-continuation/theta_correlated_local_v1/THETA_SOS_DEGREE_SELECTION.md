# Boundary-safe nonlinear module and the indispensable degree restriction

Status: independent analytic review PASS. This establishes a boundary-safe polynomial divergence normalization and falsifies a natural enlarged-space coercivity claim. It does not establish the all-degree selected-residual payment.

## 1. Removing a known vanishing factor, not an unknown pivot

Use the distinguished complete-theta trajectory and notation of NONLINEAR_THETA_BEZOUT_MODULE.md. Since y>0 at every finite L, introduce v=(x²−1)/y. Extend the polynomial derivation V to the constraint surface yv=x²−1 by

Vv=x(1−v)−2vz.

It preserves this constraint. Define

T0=1+3v/2,
T_(j+1)=2 V T_j+(9x/2+4z)T_j.

Then P_j=y T_j exactly, and T_j has total degree at most j+1 in (x,y,z,v). This does not divide by an unknown Schur value or by a possibly vanishing theta derivative. It divides only by the independently positive theta-constant product y.

Set mu(L)=A(L)^(1/2)y(L)². For Qhat_p=Σ c_j i^j T_j and the actual root-deletion polynomials q_j, the full budget is

h[p]=(sqrt(pi)/4)∫ mu [(L²/2)|Qhat_p|²−Σ|Qhat_qj|²] dL.       (1)

Every deletion term remains. The exact weighted divergence is now

Ghat=∂_L+V+9x/2+4z,
(mu R)'=mu Ghat R.                                         (2)

This follows from (log mu)'=x/2+2y'/y=9x/2+4z. In particular G(y²R)=y² Ghat R for the preceding module's G.

## 2. Every polynomial flux in the normalized variables has a valid boundary

This normalization makes the boundary condition automatic for a useful entire class. Let Q=e^|L|. The full theta series and reflection give, at either end,

y=16 pi² Q² exp(−pi Q)(1+o(1)),
A=pi Q(1+o(1)),
x→±1, z~∓pi Q/2, v~−1/(pi Q).

Consequently

mu~256 pi^(9/2) Q^(9/2) exp(−2pi Q).

For every polynomial R(L,x,y,z,v), mu R→0 at both ends, and mu R and mu Ghat R are integrable. The polynomial may have degree depending on n; no uniform coefficient bound is asserted. Reflection gives even A,y,v and odd x,z. No omitted theta orbit or artificial finite cutoff enters.

Thus an explicit polynomial identity on the constraint surface

(L²/2)|Qhat_p|²−Σ|Qhat_qj|²=Ghat R+S,

with a separately justified S≥0 on the distinguished theta orbit and S not identically zero, is a legitimate sufficient certificate. It need not be checked against an unproved boundary decay assertion. The source has total polynomial degree at most 2n+4 including L. The degree of the necessary R and the sign of S are not bounded here.

For comparison the old base flux becomes
R=−L T0²+(L²/2)T0T1,
S=(L²/4)(T1²−T0T2).
The known curvature bound still proves this base remainder positive. This is not a new rung or an induction. Nonpositive higher normalized jets prevent replacing the actual trajectory sign test by coefficientwise positivity.

## 3. A concrete stronger-than-positivity certificate template

The normalization makes the following finite algebraic target precise. Write C=yv−x²+1 and

g1=T1²−T0T2−17T0².

On the distinguished real theta orbit, y>0, 2+3v=2T0>0, and g1>0. The last assertion is exactly the independently established curvature k>17, since g1=T0²(k−17); it is not a next-pivot assumption. T0 positivity follows from the original positive complete profile and y>0.

For the exact degree-n selected p, seek polynomials R,J and sums of polynomial squares sigma_i satisfying the algebraic identity

Bhat_p=Ghat R+sigma0+y sigma1+(2+3v)sigma2+g1 sigma3+C J.    (5)

One explicit degree-controlled trial class is deg R≤2n+3 and each displayed term of the identity of degree≤2n+4. The coefficients of the known selected p and deletion sum are fixed inputs, not variables normalized by the missing norm. This is a sufficient, noncircular, finite polynomial identity problem, not an assertion that every positive integral has such a representation. Success would require an independently checked identity and a nonzero positive remainder on the actual orbit. The degree bounds and success for arbitrary n are UNPROVED and may fail even if RH holds.

The n=1 base flux is inside this trial class: sigma0=(sqrt(17)L T0/2)², sigma3=(L/2)², sigma1=sigma2=J=0. For n=0 the source itself is the square (L T0/sqrt(2))². These recover existing base cases only. No higher-degree SOS feasibility or uniform induction is claimed. In particular higher-jet coefficient signs are not used. The next section proves that replacing the exact degree restriction by an arbitrary finite list of orthogonality constraints would be invalid.

## 4. A tempting extension using only orthogonality is false

The new polynomial-flux class does not by itself supply a positive cone. Here is a precise obstruction, retaining the original theta F and even all finitely many known lower-prefix orthogonality constraints.

Fix a nonconstant actual monic parity residual p selected by a known positive prefix, with real simple roots r_j. Let q_j=p/(t−r_j), F=Fourier(psi), and Lambda=F'²−FF''. Fix any finite K≥0. There exists a real even polynomial r such that P=pr has the parity of p, satisfies

∫ P(t) t^k Lambda(t) dt=0  for every 0≤k≤K,                 (3)

and nevertheless

E_p[P F]=2∫|(P F)'|²−Σ_j∫|q_j r F|²<0.                    (4)

One can rescale P to be monic. The potential in (4) uses the roots of the ORIGINAL p, not all the roots of P. P is not claimed real-rooted or to be the inverse-selected residual at its larger degree. Therefore (4) is not a negative theta pivot. It disproves the proposed ambient extension “known-prefix orthogonality plus original-theta polynomial cyclic membership implies root-deletion coercivity.” The exact degree restriction remains essential.

### Proof

Use the independently reviewed logarithmic packets from ROOT_VOLTERRA_TRACE.md. Near a root r0, with x=t−r0>0, take G_epsilon(r0+x)=sqrt(x) chi(log(x/epsilon)), where chi is smooth compactly supported in (0,L0) and 2∫chi'²−(1/2)∫chi²<0. Choose L0>2pi and chi sufficiently close in H1 to its first Dirichlet sine. Each packet has negative E_p energy; the other root terms only decrease it. Reflected disjoint packets enforce the parity of p. Isolated zeros of F can be avoided even if F(r0)=0.

For any integer M we can choose M disjoint logarithmic annuli near the same root (and their reflected copies). On their span E_p is negative definite because the supports, including the supports of derivatives, are disjoint. Every linear combination vanishes in neighborhoods of all roots and all zeros of F in its support.

For such G define the finite linear constraints
ell_k(G)=∫ G(t)t^k Lambda(t)/F(t) dt.
The quotient is used only on the compact support avoiding F zeros. Take M larger than the number of constraints of the relevant parity. A nonzero combination lies in their common kernel and still has strictly negative E_p. Let f=G/(pF), extended by zero; it is real, even, smooth and compactly supported.

Fix 0<c<pi/2 and w=exp(−c|t|). The earlier weighted H1 polynomial-density argument supplies even real polynomials r_m→f in H1(w). Complete-theta Gamma decay gives
p r_m F→G in H1(R), and q_j r_m F→G/(t−r_j) in L2(R).
It also makes all functionals
L_k(r)=∫p r t^k Lambda
continuous in L2(w): their representing densities p t^k Lambda satisfy ∫|p t^k Lambda|²/w<∞. Hence L_k(r_m)→0.

Enforce these constraints exactly, not approximately. After discarding the identically zero opposite-parity constraints, the remaining functionals are linearly independent on even polynomials. Indeed a dependence would give an even exponentially integrable density p Q Lambda orthogonal to all even polynomials, with Q a nonzero polynomial of the parity of p. Analyticity of its bilateral Laplace transform then implies p Q Lambda=0 identically, impossible since Lambda is not identically zero. Thus choose finitely many fixed even polynomials b_i with an invertible matrix L_k(b_i). Subtract the unique combination of b_i cancelling L_k(r_m). Its coefficients tend to zero, so H1(w) convergence and strict negative energy persist. These corrected polynomial multiples satisfy (3) and (4).

This argument needs no unknown next-pivot sign. K is arbitrary but finite; the resulting degree of P is not bounded by K. No claim that all lower degrees below that resulting degree are orthogonal is made.

## 5. What an all-degree certificate must still prove

The boundary-safe normalized module is a useful exact algebraic setting, not a signed lower bound. An all-degree proof must construct an admissible R and an independently nonnegative S for the exact degree-n polynomial fixed by the actual prefix inverse. It cannot enlarge that class to arbitrary polynomial multiples satisfying the same finite orthogonality equations, because Section 4 gives actual-theta counterexamples in that enlarged class.

In particular, a positive-operator or SOS factorization asserting nonnegativity of this same fixed-root energy on every orthogonality-constrained cyclic vector is impossible. A degree-sensitive identity can still exist, as can an arithmetic inequality restricted to the distinguished actual residual. No such uniform identity or inequality is established in this packet, at a=0 or at positive shifts.
