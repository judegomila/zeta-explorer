# Every nonzero fixed sieve fraction loses the all-degree positive domain

Date: 2026-11-03. Status: independent analytic audit PASS, including the unconditional extension and both parity ladders. This is AI-assisted review, not peer review or a machine-formalized proof. This is an obstruction theorem for altered theta forms. It does not produce a negative original selected Schur complement and does not prove or disprove RH.

## Main results

Fix an interior shift 0 <= a < 1/2. Let h_a be the original complete-theta bridge, D_a the full integrated prime correction, and S_a = h_a - D_a/2 the half-source, with the normalization in the source notes below.

For EVERY fixed real theta != 0, the fractional-source form

    T_theta = h_a - theta D_a

has both positive and negative finite-degree real odd polynomial directions. More strongly, both signs are unbounded relative to the positive real-axis norm

    ||q||_W^2 = integral_R q(t)^2 exp(-pi |t|/4) dt.

The conclusion is unchanged by adding any quadratic form bounded in this norm. Thus replacing the half sieve by a smaller fixed positive fraction cannot give an all-degree positive source.

If the original odd bridge blocks A_N are positive definite at every degree, the whitened arithmetic matrices

    K_N = A_N^(-1/2) D_N A_N^(-1/2)

satisfy

    lambda_max(K_N) -> +infinity,
    lambda_min(K_N) -> -infinity.

Consequently any real sequence theta_N for which A_N - theta_N D_N stays positive definite must tend to zero. This includes degree-dependent fractions with either sign. It is stronger than merely showing that the half-source crosses its domain boundary.

The unbounded directions can also be chosen orthogonal, in the original bridge, to ANY FIXED finite positive old prefix. They are not claimed to be the next residual selected by the entire old prefix at their own increasing degrees.

All statements below are first proved for odd polynomials. Section 9 proves the even-parity extension, so the interior conclusions also hold on the full polynomial ladder. The positive Abel-endpoint statement remains odd-only.

## 1. Exact inputs and bounded real-axis terms

Write F(z) = 2 xi(1/2 + iz), and, for real odd polynomials q,

    h_a[q] = integral q(t)^2 ell_a(t) dt,
    ell_a(t) = -Im(F'(t+ia) conjugate(F(t+ia))) / a    (a>0),
    ell_0(t) = F'(t)^2 - F(t) F''(t).

The audited paired contour identity is

    S_a[q] = G_a[q] + J_a[q],
    D_a[q] = 2h_a[q] - 2G_a[q] - 2J_a[q],
    G_a[q] = integral q(t)^2 |F(t+ia)|^2 g_a(t) dt.

For each FIXED interior a, there are finite constants C_h,C_G such that

    |ell_a(t)| <= C_h W(t),
    |F(t+ia)|^2 |g_a(t)| <= C_G W(t),
    W(t) = exp(-pi |t|/4).

These are unconditional bounds. For example, shift the Fourier contour of the complete theta profile to any height v with pi/8 < v < pi/4. The theta profile and its polynomially weighted derivatives decay doubly exponentially on those horizontal lines. This gives |F^(j)(t+ia)| <= C_(a,v,j) exp(-v|t|), j<=2. The fixed-interior g_a is bounded near the real origin and has at most polynomial growth at infinity. Alternatively use the standard gamma factor and fixed-strip zeta derivative bounds. Therefore h_a and G_a, and their polarized bilinear forms, are bounded on L^2(W).

There is no uniform claim as a approaches the boundary and no degree-dependent constant is hidden: the polynomial is handled only through its W norm.

## 2. The compulsory indefinite imaginary-point form

For 0 < a < 1/2, put b_+ = 1/2+a and b_- = 1/2-a and define the real functionals

    E_+(q) = q(i b_+)/i,
    E_-(q) = q(i b_-)/i.

The residue term is exactly

    J_a[q] = (2pi/a) [xi(1+2a) E_+(q)^2 - xi(1-2a) E_-(q)^2].

Both coefficients xi(1+2a) and xi(1-2a) are positive, by the positive complete-theta Laplace representation. Hence this is an indefinite quadratic form on the two jet values.

At a=0 put E(q)=q(i/2)/i, B(q)=q'(i/2), and c=xi'(1)/xi(1). Then

    J_0[q] = 4pi [c E(q)^2 + E(q)B(q)].

Its real symmetric two-by-two matrix has determinant -4pi^2, so it is also indefinite. In particular, setting E=1 and B=-c +/- 1/(4pi) gives J_0=+/-1. At a>0, prescribe

    (E_+,E_-) = (sqrt(a/(2pi xi(1+2a))),0)   to get J_a=+1,
    (E_+,E_-) = (0,sqrt(a/(2pi xi(1-2a))))   to get J_a=-1.

All these are fixed real target values for the selected shift.

## 3. Joint interpolation with arbitrarily small real-axis norm

Let V_N be the real odd polynomials of degree at most 2N+1. For either of the two-functional systems in Section 2, every nonzero real linear combination is unbounded on the polynomial space in L^2(W).

Here is a short proof. If such a combination were bounded, let g be its Riesz representative. Taylor polynomials of sin(st) converge in L^2(W) for sufficiently small real s. The sine transform integral sin(st)g(t)W(t)dt would equal, on an interval,

    alpha sinh(b_+s) + beta sinh(b_-s)      (a>0),
    alpha sinh(s/2) + beta s cosh(s/2)     (a=0).

The transform is holomorphic in a nonzero horizontal strip containing the whole real axis, by the exponential moment of W and Cauchy-Schwarz. The identity theorem extends the equality to every real s. But the transform is bounded there, whereas each displayed nonzero combination is unbounded. Contradiction.

In nested W-orthonormal bases, let L_N be the two-row jet matrix and Q_N=L_N L_N^T its Gram matrix. Once both functionals are independent, Q_N is positive definite and increases in Loewner order. Moreover lambda_min(Q_N)->infinity: otherwise choose unit minimizing directions along a subsequence and pass to a nonzero limiting direction; each fixed finite prefix would then bound that same nonzero combination, contradicting its unboundedness.

It follows that the minimum W norm squared with prescribed jet values y is

    m_N(y) = y^T Q_N^(-1)y -> 0.

Thus, for either sign, there exist finite odd polynomials q_N^+ and q_N^- with EXACT jet values giving J_a[q_N^+]=1 and J_a[q_N^-]=-1, while both W norms tend to zero. All quantities h_a[q_N^+/-] and G_a[q_N^+/-] consequently tend to zero.

## 4. Failure of every fixed nonzero fractional source

The exact paired identity gives

    T_theta[q] = (1-2theta)h_a[q] + 2theta G_a[q] + 2theta J_a[q].

On the two interpolating sequences,

    T_theta[q_N^+] -> 2theta,
    T_theta[q_N^-] -> -2theta.

For theta != 0, one limit is strictly positive and the other strictly negative. Dividing by W norm squared proves both Rayleigh-quotient divergences. Any W-bounded quadratic perturbation tends to zero on these same sequences, so it cannot remove the obstruction.

This is a statement about the actual complete theta forms, not an arbitrary matrix model, and uses no zero-location premise.

A useful rigidity statement follows. A fixed linear pairing

    P_(alpha,beta) = alpha S_a + beta D_a/2
                  = beta h_a + (alpha-beta)(G_a+J_a)

is indefinite whenever alpha != beta. Thus exact equal weighting is the ONLY line in the span of the half-source and half-arithmetic forms that could be nonnegative on all odd polynomials. Equal weighting just returns alpha h_a; its desired positivity remains unproved. An equivalent identity is not offered as a proof.

## 5. Divergence of both whitened arithmetic extremes

Now make the CONDITIONAL assumption A_N>0 for every N, where A_N is the original h_a Gram matrix on V_N. This is used only to define the positive original metric; it is not asserted as a theorem.

For the two interpolating sequences,

    h_a[q_N^+/-] > 0 and h_a[q_N^+/-] -> 0,
    D_a[q_N^+] -> -2,
    D_a[q_N^-] -> +2.

Therefore

    D_a[q_N^+]/h_a[q_N^+] -> -infinity,
    D_a[q_N^-]/h_a[q_N^-] -> +infinity.

The generalized variational characterization of eigenvalues proves the claimed lambda_min and lambda_max divergence. These extrema are monotone under enlargement of V_N, because they are the infimum and supremum of the SAME Rayleigh quotient on nested spaces. No identification of matrix square roots across degrees is needed.

For all sufficiently large N the positivity domain is exactly

    1/lambda_min(K_N) < theta_N < 1/lambda_max(K_N).

Both endpoints tend to zero, from below and above respectively. Hence theta_N->0 for every sequence remaining in the domain. This conclusion does not require theta_N to have a fixed sign.

No quantitative rate is supplied; obtaining one requires quantitative interpolation and bounded-form estimates.

## 6. The obstruction survives every fixed old orthogonality constraint

Fix a finite real odd basis v whose original Gram matrix A=h_a[v,v] is positive definite. For either interpolating sequence set

    r_N = q_N - v^T A^(-1) h_a[v,q_N].

Then h_a[v,r_N]=0 exactly. By boundedness of the bilinear h_a form, h_a[v,q_N]->0 componentwise. Thus the correction coefficients tend to zero, ||r_N||_W->0, and each jet of the fixed finite correction tends to zero. It follows that J_a[r_N]->+1 or -1, respectively, and all conclusions of Section 4 persist on this fixed old-orthogonal subspace.

The same argument works for arbitrary fixed finite W-continuous real-axis constraints when there is a fixed correction system solving them. It does not control a number of constraints increasing with N. That missing moving-prefix control is precisely why these witnesses are not the actual next selected residuals.

## 7. Boundary, scope, and consequence for further work

The interval is strictly interior. At a=1/2, b_-=0 and oddness forces E_-=0, so the indefinite two-evaluation mechanism disappears. The already-audited half-source is positive there. No claim in this note extends the interior fractional-source classification to that endpoint.

The constructions need not have only real roots. They do not contradict the positive half-source reserve on the odd real-rooted class. They do rule out all-degree positive RESELECTION of any nonzero fixed fractional source, because such reselection requires positivity on the full old polynomial span, not merely on one family of residuals.

The result does not say that all degree-dependent fractional methods are impossible: fractions shrinking to zero are not ruled out. But they forfeit a fixed source deformation and still require a genuinely new estimate on the actual full-prefix-selected residual. Exact pole cancellation must be performed before seeking a bounded, degree-uniform comparison of the paired form.

No original negative pivot, new positive ladder rung, numerical root verification, or all-degree RH proof is claimed. No live 4CT code was read or run. No external repository state was changed.

## 8. Unconditional shrinking domain and no scalar repair of an original failure

The shrinking-domain result does not actually require positive original blocks. Fix an arbitrary epsilon>0. Section 3 supplies two FIXED finite-degree odd polynomials u,v with

    D_a[u]>0, D_a[v]<0,
    |h_a[u]/D_a[u]|<epsilon,
    |h_a[v]/D_a[v]|<epsilon.

Once an odd prefix V_N contains both witnesses, positivity of h_a-theta D_a on V_N requires

    h_a[v]/D_a[v] < theta < h_a[u]/D_a[u].

Hence |theta|<epsilon. This implication does not presume that the admissible interval is nonempty, or that either original value is positive.

Therefore, if N_j tends to infinity and some real theta_j makes h_a-theta_j D_a positive definite on V_(N_j), then theta_j->0. For each FIXED odd polynomial q, positivity eventually gives

    h_a[q] - theta_j D_a[q] > 0.

Passing to the limit proves h_a[q]>=0. Thus positive scalar-source blocks at arbitrarily high degrees force all-degree nonnegativity of the original odd form. This is a conditional implication, not a verification of that antecedent.

Conversely, if an original odd polynomial r had h_a[r]=-delta<0, choose epsilon with epsilon |D_a[r]|<delta. Put r and the two preceding witnesses in a common finite prefix V_M. For every N>=M any proposed positive modified form would force |theta|<epsilon, but

    (h_a-theta D_a)[r] <= -delta + epsilon |D_a[r]| < 0.

So no real scalar theta can make any of those larger prefixes positive. This is a structural no-repair result, not a construction of an original negative witness.

## 9. Even parity and the full polynomial ladder

The same theorem holds separately on the real EVEN polynomial spaces U_N of degree at most 2N. At a>0 take E_b(q)=q(ib), which is real for even real q. Directly from the same contour residues,

    J_a[q] = -(2pi/a)[xi(1+2a)E_+(q)^2-xi(1-2a)E_-(q)^2].

At a=0 take E=q(i/2) and B=q'(i/2)/i, both real. For H_q(s)=4xi(s)^2q(-i(s-1/2))^2,

    H_q'(1)=2c E^2-2EB,
    J_0[q]=-2pi H_q'(1)=4pi(EB-cE^2).

Each jet form is indefinite. For joint interpolation use the Taylor polynomials of cos(st), rather than sin(st). Any bounded combination would have a bounded real-axis cosine transform equal, by holomorphic continuation, to

    alpha cosh(b_+s)+beta cosh(b_-s)     (a>0),
    alpha cosh(s/2)-beta s sinh(s/2)    (a=0).

Every nonzero such combination is unbounded. The Gram argument of Section 3 applies unchanged. Therefore Sections 4 through 6 and 8 all hold separately for the even ladder too.

The h_a density is even in t, and every integrated prime term has the even density |F(t+ia)|^2 cos(mt log p); hence h_a and D_a have vanishing even-odd cross terms. The interior results consequently extend to full polynomial spaces: any nonzero fixed fraction is indefinite; positive original full prefixes imply both whitened arithmetic spectral extremes diverge; arbitrary positive modified prefixes force their fractions to zero and original nonnegativity; an original negative witness implies eventual impossibility of any scalar repair.

No even-parity endpoint conclusion is made. At a=1/2, even polynomials need not vanish at zero, so neither the lower pole term nor the archimedean delta is killed. The separately proved odd half-source endpoint positivity must not be transferred to this setting.

## Sources and access record

Local audited inputs, read in full:

- /workspace/shared/prime_signed_recurrence_20261103/HALFSOURCE_INTERIOR_DOMAIN_OBSTRUCTION.md
- /workspace/shared/prime_signed_recurrence_20261103/ALL_SHIFT_AGGREGATE_ODD_RESERVE.md
- /workspace/shared/prime_signed_recurrence_20261103/TILTED_ALL_PRIME_DIVISOR_RECURRENCE.md
- /workspace/shared/prime_signed_recurrence_20261103/NONEMPTY_PREFIX_PAID_DEBIT_BARRIER.md

These identify the frozen research baseline as MathExplorer draft PR #40, head 6c6c81697fdc527d017dc592b55bea3efa5bb31b:
https://github.com/judegomila/mathexplorer/pull/40

A fresh GitHub connector read failed with "Transport closed"; a public web read returned a cache miss. Therefore the current PR head was not independently verified in this pass. The proof uses the readable frozen local identities above, not an assertion about an unseen latest diff.

Primary standard formulas checked on 2026-11-03:
https://dlmf.nist.gov/25.4 (xi definition and functional equation)
https://dlmf.nist.gov/5.11 (gamma-factor asymptotics)
