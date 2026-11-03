# The precise nonempty-prefix barrier and an inverse-preserving transport identity

Date: 2026-11-03. Status: independent analytic audit PASS for the Schur transport formulas. The formulas are standard finite-dimensional Schur algebra applied to the complete-theta arithmetic forms, not a new theta positivity theorem. No uniform signed estimate for nonempty prefixes is proved.

## 1. Why the degree-one proof does not iterate

The paid base proof used two independent estimates:

h_a[t]>3,                0<−D_t(a)/2<18.

Both exploit facts special to q=t.

1. Its spectral parent norm becomes exactly π∫exp(−2au)v′ψ² after integration by parts. The global source floor v′>17 therefore yields a positive reserve. For higher derivative polynomials, integration by parts produces additional signed higher derivatives of log ψ. The scalar curvature floor does not bound these terms. Existing strong-curvature countermodels in the research baseline already rule out a generic all-degree inference from that floor alone.
2. The arithmetic debit uses only −A″_{f,a}/4. Two Bessel differentiations give the explicit degree-six polynomial majorant and a uniformly signed tail from the first arithmetic index j=2. At selected degree n, T_q has order 2n and includes every coefficient of the actual old-inverse-selected q. The Bessel derivative recurrence produces higher signed polynomials. A degree-only eventual-sign cutoff is available in the earlier work, but it does not bound the signed core below that cutoff.
3. At q=t there are no old regressors. At a nonempty prefix, q=p−vᵀA⁻¹b. Its coefficients cannot be bounded by replacing A with a positive parent, and its half-sieved-source regression generally differs from its original regression.

Thus the missing all-degree step is not further convergence at infinity. It is a quantitative signed comparison on the actual finite core with those old-inverse coefficients and the higher source terms retained. The following identity exposes that comparison exactly.

## 2. Original and arithmetic blocks

Fix a shift a, one parity, a finite old basis v, and a monic new polynomial p. Let the complete original bridge and the integrated full-prime correction have blocks

H = [[A,b],[bᵀ,c]],           D = [[E,d],[dᵀ,f]],
A>0.

D is defined by the convergent complete-theta arithmetic formula; it has no assumed sign. At a=1/2 use its paired Abel value. Define

x=A⁻¹b,
q=p−vᵀx,
s_0=c−bᵀA⁻¹b,
D_0=D[q]=f−2xᵀd+xᵀEx,
r=d−Ex.                                                        (1)

Here s_0 is the unknown new original Schur complement. No inverse of that new pivot appears.

For θ≥0, consider the form H_θ=H−θD and set
A_θ=A−θE.
When A_θ>0, define its own selected residual q_θ and Schur complement s_θ. Exact completion of squares gives

x_θ=x−θA_θ⁻¹r,
s_θ=s_0−θD_0−θ²rᵀA_θ⁻¹r.                                    (2)

The same-original-q source and the reselected source are different:

H_θ[q]=s_0−θD_0=s_θ+M_θ,
M_θ=θ²rᵀA_θ⁻¹r≥0.                                            (3)

At θ=1/2, H_θ[q] is the half-sieved source used in the fixed-residual arithmetic identity. Reselecting it introduces the full old-inverse mismatch M_θ. Dropping this distinction changes the comparison.

## 3. Exact domain and a quantitative bound preserving conditioning

Whiten with the original signed old metric:

K=A^(−1/2)EA^(−1/2),
z=A^(−1/2)r,
λ_−=λ_min(K), λ_+=λ_max(K).

Then

A_θ>0 iff I−θK>0,
M_θ=θ²zᵀ(I−θK)⁻¹z
   =θ²∫[1/(1−θλ)]dμ_(z,K)(λ).                                (4)

For θ≥0 with 1−θλ_+>0, the fully explicit noncircular bounds are

θ²||z||²/(1−θλ_−) ≤ M_θ ≤ θ²||z||²/(1−θλ_+).                    (5)

These retain the actual old signed inverse and the prime-covariance direction r. They do not replace it by a positive-parent norm. A half-sieve source regression is domain-safe exactly when λ_+<2. Original A>0 alone does not imply this.

A smaller θ can always be chosen from the known old matrix: for λ_+>0 take θ≤1/(2λ_+), and for λ_+≤0 any finite θ≥0 remains in this positive-old-block domain. This ensures the regression exists, not that the new source Schur complement is positive. Changing θ also forfeits the exact arithmetic cancellation particular to θ=1/2.

The directional resolvent in (4), rather than a global inverse norm, is the appropriate object if near-null old modes are present. No theta-specific uniform bound for its spectral measure is established here.

## 4. Concavity and exact covariance transport

Differentiating in θ, at fixed shift a and fixed original basis, gives

s_θ′=−D[q_θ],
s_θ″=−2r_θᵀA_θ⁻¹r_θ≤0,
r_θ=d−Ex_θ.                                                    (6)

Thus the reselected source pivot is concave on its positive-old-block interval. Its curvature is precisely an inverse-weighted arithmetic covariance, not a free positive source margin. These identities make no positivity assertion about s_θ.

## 5. Which genuinely independent estimates would suffice

Suppose, at a chosen θ≥0 in the valid domain, one independently proves

s_θ≥L_θ,
max(−D_0,0)≤B_θ,
M_θ≥m_θ,
L_θ+m_θ>θB_θ.                                                  (7)

Then (2) proves s_0>0. A legitimate old-data-only choice for m_θ is the lower bound in (5), or a sharper directional estimate from (4).

Important scope:
- L_θ must bound the RESELECTED source s_θ. If it instead bounds the fixed-original-q source H_θ[q], adding m_θ double-counts the mismatch.
- The lower bound L_θ and debit bound B_θ must come from independent theta/arithmetic estimates. Simply substituting the exact unknown quantities into (7) and assuming the final comparison restates s_0>0.
- A uniform strict fractional gap is not required by the original theorem target. Any proposed all-degree proof must justify its chosen margins rather than impose a stronger gap without evidence.

The remaining new-diagonal information is explicit: M_θ depends on A,E,b,d, but not on c or f. Old inverse control therefore cannot by itself determine the sign of the diagonal debit f contained in D_0, nor the new source diagonal c−θf.

## 6. Algebraic obstruction to conditioning-only payment

This is a diagnostic matrix model, NOT the actual theta form.

Fix any nonempty old dimension and B>1. Take

A=I, E=0, b=d=0, f=−2B, c=1−B.

At θ=1/2,

A_θ=I, r=0, M_θ=0,
H_θ=diag(I,1)>0,
s_0=1−B<0.

Thus perfectly conditioned old inverses, zero arithmetic covariance mismatch, and even positive definite FULL half-source do not pay an arbitrarily large negative diagonal arithmetic debit. The missing ingredient has to constrain that diagonal debit in correlation with the actual theta source. This example does not refute such an arithmetic lemma; it proves only that old conditioning and source positivity alone cannot supply it.

## 7. Research conclusion

A valid all-degree organizational identity and an explicit direction-preserving mismatch estimate are now available. They isolate the new core requirement without using the unknown next pivot. No signed theta inequality controlling L_θ and B_θ for every actual nonempty-prefix residual has been found.

The degree-one source argument cannot simply be iterated: its scalar curvature reduction, low derivative order, and absence of regression mismatch are exactly the three features lost. New work should target the joint diagonal source/debit estimate in (7), while retaining the directional inverse data in (4), rather than generating additional low-degree examples or treating convergence and conditioning as the missing sign proof.

Companions: TILTED_ALL_PRIME_DIVISOR_RECURRENCE.md, ODD_BASE_SIGNED_DEBIT_PAYMENT.md, and the baseline PAID_SCHUR_NEXT.md in draft PR #40.
