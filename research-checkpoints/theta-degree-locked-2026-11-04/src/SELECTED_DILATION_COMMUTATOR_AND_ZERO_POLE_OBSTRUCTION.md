# Selected dilation, a mismatch lower bound, and the real-zero pole obstruction

Date: 2026-11-04. Status: exact finite-degree identities and a one-sided estimate, with an explicit obstruction to a proposed coercive use. This does **not** prove actual-theta derivative coherence, and it does not give an actual-selected counterexample. No RH, pointwise sign of V, enlarged Q positivity, or inverse-gap estimate is assumed. The only use of old-prefix Q positivity is identified in Section 4. All real Xi zeros are retained.

## 1. Setup and domain

Use the exact actual-theta transform F from the prior reduction. It is real, even, entire, and has exponential decay, up to polynomial factors, together with every fixed-order derivative on the real line. Define

    T p = F p′ + 2F′ p,
    w = F²,
    V = 2(F′² − FF″),
    X(p,q) = ∫(T p)(T q) = ∫(w p′q′ + Vpq),
    H(p,q) = ∫w p′q′.

Every integral is over R unless specified. Integration by parts with polynomial arguments is legitimate; no singular quotient is used to define any form. Higher derivatives appearing below are covered by the same fixed-strip Cauchy-estimate argument as F′ and F″.

Fix parity and n. Let E_n be the full lower same-parity polynomial prefix. Let P=P_n be monic of degree n and X-orthogonal to E_n, and set A=X[P]>0. X is positive definite independently of any Q assumption.

For n≥1, write π=π_(n−1) for the monic ordinary w-orthogonal polynomial and

    B = n²||π||²_w,
    U = ||P′−nπ||²_w,
    Δ = A−B.

At n=0 set B=U=0; no polynomial π_(−1) is used. The conclusions concerning ratios require Δ>0 explicitly. No such positivity is proved here.

## 2. Complete endpoint selection gives an exact dilation identity

Put D=t∂t and R=(D−n)P. The leading term cancels, so R∈E_n. Consequently

    X(P,DP) = nA.                                           (2.1)

For every real s the polynomial

    P_s(t) = e^(−ns) P(e^s t)

is monic of the same degree and parity, and P_s−P∈E_n. Thus the stronger finite identity is

    X(P,P_s)=A,
    X[P_s]−A = X[P_s−P] ≥ 0.                               (2.2)

This is genuine use of the complete endpoint, not orthogonality to an arbitrarily shorter prefix. It is still a variational identity, not an asymptotic estimate.

A change of variables gives

    X[P_s]
      = e^(−(2n−1)s) ∫w(e^(−s)t) P′(t)² dt
        + e^(−(2n+1)s) ∫V(e^(−s)t) P(t)² dt.              (2.3)

Differentiating at s=0, or integrating (2.1) by parts, yields the zero-division-free virial identity

    2nA = ∫(w−tw′)P′² − ∫(V+tV′)P².                      (2.4)

Differentiating twice, and using X(P,(D−n)²P)=0, yields

    2X[R]
      = ∫[(2n−1)²w +(4n−1)tw′ +t²w″]P′²
        + ∫[(2n+1)²V +(4n+3)tV′ +t²V″]P².               (2.5)

The entire right side of (2.5) is nonnegative. Its displayed summands need not be nonnegative. In particular neither (2.4) nor (2.5) licenses discarding selected arithmetic terms.

If n≥2 and P=t^n+c_n t^(n−2)+…, the minimization property one degree-step lower gives an additional elementary bound:

    X[P_s]−A ≥ c_n²(e^(−2s)−1)² A_(n−2),
    X[R] ≥ 4c_n² A_(n−2).                                 (2.6)

Here A_(n−2) is the positive X norm of the monic selected polynomial of degree n−2. This controls dilation curvature from below. It does not control U from above or make the next coefficient match that of π.

## 3. Positive-source formulation and multiplication warning

The first-order commutator is an exact differential identity:

    [T,D]p = (F−tF′)p′ − 2tF″p.                            (3.1)

Set S=TP. Since ∫S(tS′)=−A/2, equations (2.1) and (3.1) give

    (n+1/2)A
      = ∫S[(F−tF′)P′−2tF″P].                            (3.2)

Unlike a formula involving F′/F, (3.2) remains an ordinary absolutely convergent integral at every real Xi zero.

Multiplication is not self-adjoint for the Sobolev form:

    X(tp,q)−X(p,tq) = ∫w(pq′−p′q),
    X(t²p,q)−X(p,t²q) = 2∫tw(pq′−p′q).                    (3.3)

Thus the standard Jacobi-matrix/three-term-recurrence argument for a positive scalar measure cannot be imported for the selected X polynomials. These identities do not rule out other structured recurrences; they only show that the usual scalar-measure argument is unavailable.

## 4. A genuine degree-locked estimate, in the lower-bound direction

Define the derivative virial defect

    L = (n−1/2)H[P] + (1/2)∫tw′P′².                        (4.1)

Integration by parts gives

    H(P,R) = −L.                                          (4.2)

The derivative R′ belongs to the ordinary w-polynomial prefix below π. Therefore its inner product with π vanishes, and

    H(P,R) = ∫w(P′−nπ)R′.

Cauchy–Schwarz proves the actual selected inequality

    U ≥ L²/H[R]                 if H[R]>0.                (4.3)

If H[R]=0, then L=0 and this test is vacuous. No Q positivity is needed for (4.3).

If, and only where, Q=X−H is positive definite on the finite old prefix E_n, then R∈E_n implies H[R]≤X[R]. Consequently

    U ≥ L²/X[R]                 if X[R]>0.                (4.4)

The denominator is exactly half the monic-dilation curvature in (2.5). The inequality does not contain an inverse old generalized gap. Under the same old-prefix assumption H[R]≤X[R] is the only positivity step used here.

Whenever Δ>0, a necessary consequence of U/Δ→0 is

    L²/(H[R]Δ) → 0

along nonvacuous degrees. If one instead has L²≥c Δ H[R] along infinitely many degrees, for fixed c>0, then (4.3) would refute coherence along those degrees. No such actual-theta lower bound for L is proved.

This is not an upper-bound route in disguise: one old derivative test captures at most part of the projected derivative norm. The implication is one-way. The ordinary w-selected π itself has

    ∫tw′π² = −(2n−1)||π||²_w,

so exact derivative coherence P′=nπ makes L vanish, as it should. Conversely L=0 alone does not force U=0.

## 5. Why the tempting F′/F source virial is not domain-safe

Away from zeros, write ℓ=F′/F. Algebraically (3.1) can be rewritten as

    [T,D]P = (1−tℓ)S + (tV/F−2F′)P.                       (5.1)

It is incorrect to regard the two resulting integrals on the right of

    (n+1/2)A = ∫(1−tℓ)S² + ∫(tV/F−2F′)PS                (5.2)

as separately defined Lebesgue integrals. Equation (5.2) is only a combined-integrand identity unless separate integrability is independently established.

Indeed, let r≠0 be a simple real zero of F, put x=t−r, write F(r+x)=c x+O(x²), c≠0, and suppose P(r)≠0. Then

    ℓ(r+x)=1/x+O(1),
    S(r+x)=2cP(r)+O(x),
    V(r+x)=2c²+O(x).

The two apparent singular contributions are exactly

    −tℓS² = −4r c²P(r)²/x + O(1),
    (tV/F)PS = +4r c²P(r)²/x + O(1).                       (5.3)

Each has infinite absolute integral on every neighborhood of r. The poles cancel in their sum, recovering the smooth integrand in (3.2). At a multiple zero of multiplicity m, the analogous leading order is x^(2m−3); the simple-zero case is the nonintegrable one.

The prior supplied zero-escape input gives unbounded simple real Xi zeros unconditionally. A nonzero finite polynomial can vanish at only finitely many of them. Hence for every nonzero polynomial P the separated logarithmic-derivative integrals have this local defect at some, in fact infinitely many, real zeros. No exceptional alignment of the selected zeros removes it.

A chosen symmetric principal-value prescription might assign values to the separated terms, but it is not the original positive energy integral and supplies no positivity inequality. In particular, retaining only a purported positive zero contribution, or using Cauchy–Schwarz on ℓS as if it were in L², is invalid. This obstruction already occurs at actual simple real zeros; it is unrelated to RH or to the treatment of nonreal zeros.

## 6. The gamma-only split is safe and exposes the remaining selected term

Write the exact theta transform as F=aZ, absorbing the irrelevant fixed sign into Z, where a>0 is its smooth even gamma envelope and Z is the real Hardy function. Up to a positive normalization constant,

    a(t) = (t²+1/4)|Γ(1/4+it/2)|,
    g(t) = a′(t)/a(t).

The omitted positive factor includes π^(−1/4) and the theta normalization; it does not affect g. Since a has no real zeros, this division is harmless. In particular

    g(t)=−(π/4)sgn(t)+7/(4t)+O(|t|^(−3))

as |t|→∞. Define the entirely nonsingular arithmetic commutator

    C_Z[P] = at[Z′P′ + 2Z″P + 2gZ′P].                      (6.1)

A direct substitution in (3.1) gives

    [T,D]P = −tg S + FP′ − 2tg′FP − C_Z[P].               (6.2)

Consequently

    (n+1/2)A
      = ∫(−tg)S² + ⟨S,FP′⟩
        −2⟨S,tg′FP⟩ − ⟨S,C_Z[P]⟩.                       (6.3)

Every term is absolutely convergent, including across all real zeros of F. Let

    b(t)=−tg(t)−π|t|/4+7/4.

This is bounded on R and tends to zero at infinity. The degree-sensitive radial identity is then

    (n+9/4)A
      = (π/4)∫|t|S² + ∫bS² + ⟨S,FP′⟩
        −2⟨S,tg′FP⟩ − ⟨S,C_Z[P]⟩.                       (6.4)

For example it gives the fully valid finite inequality

    | (π/4)∫|t|S²/A − (n+9/4) |
      ≤ ||b||∞ + sqrt(H[P]/A)
        + 2||tg′FP||₂/sqrt(A) + ||C_Z[P]||₂/sqrt(A).        (6.5)

Unlike a scalar moment replacement, (6.4) retains the actual selected polynomial and every arithmetic term. But the last two normalized norms have not been controlled here. Even a bounded estimate for them sufficient to localize the first source moment would not by itself compare U with Δ.

There is a precise pointwise sign obstruction for the arithmetic correlation. At a simple nonzero zero r of Z, its integrand is

    S(r)C_Z[P](r)
      = 2a(r)²r Z′(r)²P(r)P′(r)
        +4a(r)²r Z′(r)[Z″(r)+g(r)Z′(r)]P(r)².             (6.6)

As a quadratic expression in the polynomial jet (P(r),P′(r)), it is indefinite because the coefficient of P(r)P′(r) is nonzero and there is no P′(r)² term. Polynomial jets at a nonzero r can be independently prescribed within either parity once the degree is large enough. This observation excludes a pointwise nonnegative replacement of the arithmetic term on the polynomial domain. It does not prove that its integral has either sign on the selected family, and it is not a counterexample involving P_n.

A bound for the actual selected correlation ⟨TP_n,C_Z[P_n]⟩ must therefore come from additional global structure or correlated arithmetic control. The gamma envelope alone supplies neither its sign nor a small relative bound. Integrating its Z″ term by parts only moves derivatives to P_n and the other weights; the resulting identities return to (2.4) rather than making this correlation disappear.

## 7. Outcome and exact boundary

The degree constraint does yield new, exact information:

1. The monic-dilation norm has its global minimum at the selected polynomial, with the exact defect and curvature in (2.2)–(2.5).
2. Its first derivative yields the source virial (3.2), with n fixed by the actual polynomial degree.
3. Its lowering direction supplies the rigorous mismatch lower bound (4.3), strengthened to the curvature denominator (4.4) when the stipulated finite old Q prefix is positive.
4. A safe gamma split gives the explicit degree-versus-source-radius identity (6.4).

None supplies the required upper estimate U=o(Δ). The direct logarithmic-derivative route fails as a separated-integral argument at actual simple real zeros. The safe route leaves the genuinely selected arithmetic commutator (6.1), for which neither a favorable sign nor a useful relative estimate has been established. Discarding it would be an unsupported averaging step, not a consequence of endpoint orthogonality.

Thus this investigation locates a precise analytic obstruction rather than declaring a no-go theorem for all commutator methods. A future actual-theta bound on the selected arithmetic correlation, together with control adequate at the Δ scale, could still make the dilation identities useful. The present formulas do not prove Δ>0, coherence, or the quantitative constant tied to the old gap.

## Inputs and verification scope

Read-only inputs:

- `/workspace/shared/theta_selected_escape_20261104/README.md`
- `/workspace/shared/theta_excess_independent_20261104/SELECTED_COMPACT_LOCALIZATION_AND_MONOMIAL_TEST.md`
- `/workspace/shared/theta_coherence_asymptotics_20261104/PARAMETER_STABILITY_AND_TRACE.md`
- `/workspace/shared/theta_coupling_bounds_20261103/AMPLITUDE_SOBOLEV_REDUCTION.md`

The gamma asymptotic and the existence of unbounded simple real Xi zeros are the already supplied inputs. All displayed selected identities and inequalities above follow directly from finite-dimensional selection, polynomial differentiation, and integration by parts. This is AI-assisted analytical work, not a machine-formalized proof or an external peer review. No literature-novelty claim is made. No frozen package, live 4CT file, repository, or external service was changed.

A reproducible algebra sanity check is provided in `check_selected_dilation_identities.py`. For the explicit test F=(t²−1)exp(−t²/2), it computes the exact selected polynomials and verifies (2.4), (2.5), (3.2), (4.2), and the cross-multiplied inequality (4.3) at n=0,…,8 in exact rational arithmetic after dividing all Gaussian integrals by sqrt(π). It passed. This checks signs and factors, not the actual-theta asymptotic claim; the analytic proofs above do not depend on this example.
