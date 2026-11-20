# Aggregate obstruction to universal odd real-rooted debit payment

Date: 2026-11-03. Status: independent analytic audit PASS. This is a rigorous obstruction to two proposed universal payment inequalities. It does not give a negative original theta-selected Schur pivot or identify the constructed polynomials with that selected sequence.

## 1. Conclusions and exact scope

For the complete theta bridge at shift a=0, there are odd real polynomials q_N, all of whose roots are real and simple, such that

|q_N(i/2)|²=1,
h[q_N]→0,
P_(q_N,0)→0,
C_(q_N,0)→0.

Here h is the ORIGINAL signed bridge and P,C are the positive and compact-negative archimedean integrals from ALL_SHIFT_AGGREGATE_ODD_RESERVE.md. No sign of h[q_N] is assumed.

The positive half-source reserve remains bounded away from zero. Consequently the signed arithmetic debit J_N=−D_(q_N)/2 is eventually positive and

J_N/S_half[q_N]→1.

Therefore no universal inequality J≤rho S_half with a fixed rho<1 holds throughout the odd real-rooted class. In particular, the degree-one factor 6/7 cannot be extended to this entire class.

The stronger explicit-budget candidate

max(−D_q/2,0)≤P_(q,0)+π(8F(0)−1)|q(i/2)|²

is FALSE in that class. Replacing the coefficient by the smaller certified constant 173π/25 does not help. The sharper zero-shift budget also fails as a universal debit bound, as shown in Section 5.

These are aggregate counterexamples, not matching-prime comparisons. They retain the exact complete arithmetic correction via its audited contour identity.

## 2. A positive norm with unconditional theta domination

Let W(t)=exp(−κ|t|), where 0<κ<π/2, for example κ=π/4. Its scale is immaterial. Standard gamma-factor decay, with polynomial bounds for zeta and its first two derivatives on the fixed critical line, implies finite constants M_h,M_P,M_C such that

|F′(t)²−F(t)F″(t)|≤M_h W(t),
F(t)²[k_0(t)+(r_0(t))_+]≤M_P W(t),
F(t)²(−r_0(t))_+≤M_C W(t).

The final density has compact support; all are bounded near t=0. Their large-|t| bounds have exponential factor exp(−π|t|/2) times at most a fixed power and logarithm. Thus W dominates them without any zero-location assumption. W has a positive exponential moment and full real support.

Write ||q||_W²=∫q(t)²W(t)dt. Small W norm therefore makes |h|, P, and C small.

## 3. Imaginary-point evaluation is unbounded

On the real vector space of odd polynomials define the real functional

E(q)=q(i/2)/i.

Suppose E were bounded in ||·||_W. Riesz representation on the closure of the odd polynomials would give a real g∈L²(W) satisfying

E(q)=∫q(t)g(t)W(t)dt.

For sufficiently small real s, the Taylor polynomials for sin(st) converge in L²(W), because W has a positive exponential moment. Consequently

∫sin(st)g(t)W(t)dt=sinh(s/2).

The left side is holomorphic in a nonzero horizontal strip containing the entire real axis, by Cauchy–Schwarz and the exponential moment. The identity theorem extends the equality throughout that strip, hence to every real s. But the left side is bounded on the real axis by ∫|g|W<∞, whereas sinh(s/2) is unbounded. Contradiction.

Thus E is unbounded. Its norm on the finite-dimensional odd polynomial space of degrees at most 2N+1 increases to infinity. The constrained minimum

m_N=min {||q||_W² : q odd real, deg q≤2N+1, E(q)=1}

is the reciprocal square of that finite-dimensional functional norm, so m_N→0.

This proof avoids any Stieltjes-versus-Hamburger moment determinacy assumption.

## 4. The minimizers have only real roots

Write the unique minimizing polynomial as

q_N(t)=2t P_N(t²),   P_N(−1/4)=1.

Let ν be the pushforward of t²W(t)dt under x=t². It is a positive measure with full support on (0,∞) and all moments finite. Variations preserving P_N(−1/4)=1 are exactly (x+1/4)R(x), with deg R≤N−1. The variational equations therefore give

∫P_N(x)R(x)(x+1/4)dν(x)=0,   deg R≤N−1.

P_N has degree exactly N, since a smaller degree would contradict its nonzero normalization and positive norm. It is the degree-N orthogonal polynomial for the positive measure (x+1/4)dν. Its N zeros are positive and simple. Thus q_N has the simple zero 0 and N real simple ± pairs.

Since ||q_N||_W²=m_N→0, Section 2 proves all three limits in Section 1. Rescaling to monic form preserves every homogeneous inequality and ratio considered here.

The construction retains exact finite-dimensional coefficients. Specifically, in any odd basis v, its coefficient vector is G_N^(−1)e_N/(e_NᵀG_N^(−1)e_N), where G_N=∫vvᵀW and E(v)=e_N. This is an auxiliary positive-weight inverse, NOT the original bridge inverse A^(−1)b.

## 5. Why the explicit budgets fail

At zero shift the exact source formula is

S_half[q]=P_q−C_q+B_q,
B_q=2π(2c_ξ+R_q)Q,
Q=|q(i/2)|²,
R_q=Σ_(roots r)1/(r²+1/4),
c_ξ=ξ′(1)/ξ(1)>0.

For odd real-rooted q, R_q≥4, C_q≤2F(0)²Q<2Q, and B_q≥8πQ. Let C_*=π(8F(0)−1)<7π, since positivity and evenness of the complete theta profile give F(0)<F(i/2)=1.

If J=−D_q/2≤P_q+C_*Q, then h=S_half−J would satisfy

h[q]≥(8π−2−C_*)Q>(π−2)Q.

This is impossible for q_N with Q=1 and h[q_N]→0. More directly,

J_N−(P_(q_N,0)+C_*)=B_N−C_N−h[q_N]−C_*
             ≥8π−2−C_*−h[q_N]
             >π−2−h[q_N]>0

for all sufficiently large N.

The sharper zero-shift source budget is

L_N=P_(q_N,0)+B_N−2F(0)²Q.

Its exact debit excess is

J_N−L_N=2F(0)²−C_N−h[q_N]→2F(0)²>0.

Thus even retaining the exact root sum R_q does not repair that particular sufficient payment inequality.

Finally S_half[q_N]≥8π−2>0, and

J_N/S_half[q_N]=1−h[q_N]/S_half[q_N]→1.

This last conclusion requires no bound on the possibly growing pole term B_N and no knowledge of the sign of h[q_N].

## 6. What remains open

The actual original-selected residual q=p−vᵀA^(−1)b has additional theta orthogonality and inverse conditioning. The polynomials above were selected for W, not for that original signed bridge. No argument identifies them with that sequence, so this theorem does NOT refute a payment bound restricted to the actual selected residuals.

It does prove that oddness, real roots, full unbounded-support convergence, and the already-established aggregate source reserve cannot by themselves provide the missing payment. Any viable selected-residual estimate needs genuinely additional information about the original inverse and orthogonality. Using the exact identity J=S_half−h to assert J≤S_half merely restates h≥0; it supplies no independent estimate.

Companion audited sources: ALL_SHIFT_AGGREGATE_ODD_RESERVE.md; AGGREGATE_ODD_HALFSOURCE_RESERVE.md; ALL_DEGREE_PRIME_TAIL_PAYMENT_OBSTRUCTION.md. Primary gamma and xi formulas: https://dlmf.nist.gov/5.11 and https://dlmf.nist.gov/25.4; positive orthogonality and real zeros: https://dlmf.nist.gov/18.2. Research baseline remains draft PR https://github.com/judegomila/mathexplorer/pull/40 at frozen head 6c6c81697fdc527d017dc592b55bea3efa5bb31b.
