# Independent audit: actual-theta Pollaczek trial ratio

2026-11-04. Analytic AI-assisted audit, not external peer review or machine formalization. Frozen inputs were read but not edited.

## Verdict

PASS for the explicit parameter-four family. With Q_n(t)=P_n^(4)(t/2;pi/2), M_n=n!Q_n, H[p]=integral F²p'², and X[p]=integral (Fp'+2F'p)²,

    H[M_n]/X[M_n] = 1+O((log n)^(-2)).

This coexists with the independently audited bound X[M_n]/A_n <= exp(C log²(n+2)). It is an actual-theta trial-family boundary, not a counterexample to selected coherence and not an RH claim.

## 1. Twice-differentiated elementary zeta estimates

Euler summation with integer cutoff N gives, for Re s>0 and away from s=1, a finite Dirichlet sum, the term N^(1-s)/(s-1), an endpoint term, and an integral of a bounded periodic Bernoulli function times s x^(-s-1). Hold N fixed while differentiating up to twice in s, then choose N comparable to |t|+2 at s=1/2+it. Absolute estimation gives

    |zeta^(j)(1/2+it)| <= C_j (1+|t|)^(1/2) log^j(2+|t|),  j=0,1,2.

The integral derivatives are bounded by C(1+|s|)N^(-1/2) times the appropriate logarithmic factors; the finite sum has the same stated order. The differentiated pole term is smaller for large |t|. Compact t is handled by smoothness.

For Hardy Z(t)=exp(i theta(t))zeta(1/2+it), the standard gamma phase has theta'=O(log(2+|t|)) and theta''=O(1) globally (O(1/|t|) at infinity). Thus

    |Z|+|Z'|+|Z''| <= C(1+|t|)^(1/2)log²(2+|t|)
                         <= C'(1+|t|).

In the exact factorization F=sigma aZ, a=(t²+1/4)|Gamma(1/4+it/2)| up to a harmless positive constant. Stirling and gamma logarithmic derivatives imply a'/a and a''/a are bounded on R. Smoothness and positivity of a cover bounded t. Consequently

    |F|+|F'|+|F''| <= C a(1+|t|).

With V=2(F'²−FF''), W4=|Gamma(4+it/2)|², and a²/W4 asymptotic to a positive constant times |t|^(-7/2), this proves

    |V(t)|/W4(t) <= C(1+|t|)^(-3/2).

This argument does not divide by Z or F and has no zero-location assumption.

## 2. Potential energy bound

The audited uniform inner theorem gives W4 Q_n² <= Cn^6 on |t|<=n/4. Therefore

    integral_(|t|<=n/4) |V|Q_n²
       <= Cn^6 integral_R (1+|t|)^(-3/2)dt <= C'n^6.

The exact Pollaczek norm is

    h_n=integral_R W4 Q_n²=(4pi/2^8)Gamma(n+8)/n! = O(n^7).

On |t|>n/4 the potential ratio is at most Cn^(-3/2), so the outer integral is O(n^(11/2)). Integration by parts, justified by exponential decay, gives exactly

    X[Q_n]−H[Q_n]=integral_R VQ_n².

Hence |X[Q_n]−H[Q_n]|<=Cn^6.

## 3. Direct fixed-t Darboux proof, including the derivative error

Only lambda=4 is needed. Let t range in an arbitrary fixed compact real interval K, alpha=4+it/2, beta=4−it/2, and

    G(z,t)=(1−iz)^(-beta)(1+iz)^(-alpha).

All powers use branches analytic in |z|<1. Its coefficient of z^n is Q_n(t). The singularities are z=i and z=−i. Subtract their leading models:

    S(z,t)=2^(-beta)(1+iz)^(-alpha)
              +2^(-alpha)(1−iz)^(-beta).

Near z=i, put w=1+iz, so 1−iz=2−w. Taylor expansion of (2−w)^(-beta) shows

    G−S=O_K(|w|^(-3)),
    partial_t(G−S)=O_K(|w|^(-3)(1+|log|w||)).

The second model is bounded near this point. The corresponding statements hold near z=−i. Away from those two fixed neighborhoods both remainders are uniformly bounded. These estimates hold on circles |z|=r<1, with constants uniform as r tends to one. Bounded imaginary exponents contribute only fixed constants because arguments stay bounded.

Choose r=1−1/n, n>=2. Near either singular direction, distance is comparable to ((1−r)^2+u²)^(1/2). Therefore the circle integrals of distance^(-3) and distance^(-3)(1+|log distance|) are O(n²) and O(n² log n). Cauchy coefficient estimates, with r^(-n)=O(1), now give

    [z^n](G−S)=O_K(n²),
    [z^n]partial_t(G−S)=O_K(n² log n).

This is a direct remainder proof and does not infer derivative control from an undifferentiated real-axis asymptotic.

The first singular model has exact coefficient

    2^(-beta)i^(-n) Gamma(n+alpha)/(Gamma(alpha)Gamma(n+1)),

and the other is its conjugate for real t. Uniform gamma-ratio asymptotics on compact alpha sets, also differentiated in alpha, yield

    Q_n(t)=2^(-3)n³ Re B_n(t)+O_K(n²),
    B_n(t)=exp(−i pi n/2)exp(it log(2n)/2)/Gamma(4+it/2).

Write L_n=log(2n)/2 and psi=Gamma'/Gamma. Differentiating the exact model coefficients gives

    Q_n'(t)=2^(-3)n³ Re[(iL_n−(i/2)psi(4+it/2))B_n(t)]
                    +O_K(n² log n)
             =−2^(-3)n³ L_n Im B_n(t)+O_K(n³)+O_K(n² log n).

Thus the proposed normalization, frequency, and differentiated error are correct. The simple residual circle proof above is stated only for lambda=4; a blanket version for all positive lambda would require a separately adjusted remainder argument.

## 4. Compact derivative floor and ratio

Choose a fixed nondegenerate compact interval I on which F is nonzero; such an interval exists because F is nonzero analytic. Then

    integral_I F² (Im B_n)² -> (1/2) integral_I F²/W4 > 0.

Indeed (Im B_n)² is half |B_n|² minus half the real part of B_n². The oscillatory integral of the latter tends to zero by Riemann–Lebesgue, or is O(1/log n) by one integration by parts. The factor exp(−i pi n) is harmless. All amplitude functions on I are smooth.

The derivative expansion therefore gives

    integral_I F²Q_n'²
       = 2^(-6)n^6 L_n² [(1/2) integral_I F²/W4+o(1)]
           +O(n^6 L_n),

and H[Q_n]>=c n^6 log² n for sufficiently large n. Combined with the potential bound,

    |X/H−1| <= C/log² n.

In particular X/H is eventually bounded below by 1/2, and inversion gives H/X=1+O(log^(-2)n). The factorial monic normalization cancels from the ratio.

## Scope and sources

This establishes that exponential-scale monic near-optimality, even the explicit exp(O(log²n)) approximation factor here, is compatible with a trial derivative/source ratio tending to one. It does not establish that this family's approximation factor diverges, nor say anything decisive about the selected minimizers' ratio. In particular, it does not refute a transfer theorem requiring relative near-optimality or another additional hypothesis; it does not provide a favorable H/X trial to which such a transfer theorem could be applied.

Frozen input files:
- /workspace/shared/theta_pollaczek_trial_20261104/ACTUAL_THETA_SUBEXPONENTIAL_REFERENCE_COMPARISON.md
- /workspace/shared/theta_pollaczek_natural_20261104/UNIFORM_INNER_ENVELOPE.md
- /workspace/shared/theta_pollaczek_trial_20261104/POLLACZEK_MONIC_COMPARISON.md

Primary formula sources checked:
- https://dlmf.nist.gov/18.23 (Meixner–Pollaczek generating function)
- https://dlmf.nist.gov/25.2 (Euler–Maclaurin representation)

No frozen file or live 4CT file was modified.

## Addendum: sharp constants and stronger trial separation

Added 2026-11-04 after reading the additional independently audited input

    /workspace/shared/theta_pollaczek_natural_20261104/ARITHMETIC_SCALE_COROLLARY.md.

The following supersedes the preceding limited-input statement that divergence of X[M_n]/A_n has not been established. No change to the frozen input files is involved.

Define the absolutely convergent integrals

    I0=integral_R F²/W4 > 0,
    I1=integral_R V/W4.

Absolute convergence follows from the estimates F²/W4+|V|/W4 <= C(1+|t|)^(-3/2).

The fixed-compact Darboux expansion and oscillatory averaging above give, for each fixed compact interval J,

    integral_J F²Q_n'²/[n^6 log²(2n)] -> 2^(-9) integral_J F²/W4,
    integral_J VQ_n²/n^6 -> 2^(-7) integral_J V/W4.

These are integral limits, not pointwise limits of the oscillatory integrands. To extend them to R, use the audited uniform differentiated envelope in |t|<=n/4:

    W4 Q_n'² <= Cn^6[1+log²(n/(1+|t|))].

In this region the bracket divided by log²(2n) is uniformly bounded. Hence the normalized H integral outside a fixed compact interval but inside |t|<=n/4 is bounded by a constant times the integrable tail of F²/W4. The undifferentiated envelope gives the corresponding bound by the integrable tail of |V|/W4 for the potential integral.

For |t|>n/4, use the exact reference derivative estimate

    integral_R W4 Q_n'² <= (pi²/8)h_n=O(n^7),

and sup_(|t|>n/4) F²/W4 <= Cn^(-3/2). The outer H integral is O(n^(11/2)), negligible compared with n^6 log²(2n). The outer potential integral is likewise O(n^(11/2)), negligible compared with n^6. First let n tend to infinity with the compact interval fixed, then enlarge it. This proves

    H[Q_n]/[n^6 log²(2n)] -> 2^(-9) I0,
    (X[Q_n]−H[Q_n])/n^6 -> 2^(-7) I1.

In particular X has the same positive leading asymptotic as H, and

    log²(2n)(H[Q_n]/X[Q_n]−1) -> −4 I1/I0.

No sign assertion for I1 is needed.

For the additional comparison, distinguish the parameter-four family M_n^(4) from the natural family M_n^(9/4). The audited arithmetic-scale corollary gives

    A_n <= C b_n^(9/4) log³(n+2),
    B_n <= C b_n^(9/4) log(n+2),
    b_n^(9/4)=(4pi/2^(9/2))n!Gamma(n+9/2)
                  asymptotic to (4pi/2^(9/2))(n!)² n^(7/2).

Meanwhile the proved parameter-four asymptotic is

    X[M_n^(4)] asymptotic to 2^(-9)I0 (n!)²n^6 log²(2n),
    H[M_n^(4)] asymptotic to the same expression.

Consequently, for sufficiently large n,

    X[M_n^(4)]/A_n >= c n^(5/2)/log n -> infinity.

Thus this family is definitely not relatively near-optimal, even though the earlier reference comparison still proves the subexponential upper bound exp(C log²(n+2)). This new conclusion uses the additional natural-family upper estimate and does not follow from the original parameter-four reference comparison alone.

Finally define the *trial*, not selected, quantities

    U_n(M_n^(4))=H[M_n^(4)]−B_n,
    Delta_n(M_n^(4))=X[M_n^(4)]−B_n.

Since

    B_n/H[M_n^(4)] = O(n^(-5/2)/log n) -> 0,

both trial quantities are positive for sufficiently large n and

    U_n(M_n^(4))/Delta_n(M_n^(4)) -> 1.

Indeed their ratio differs from H/X by o(log^(-2)n), so it has the same log-squared correction limit if desired. These conclusions do not imply positivity of the selected Delta_n=A_n−B_n, and they do not determine the selected derivative mismatch. They give explicit trial-family separation only. No claim about RH follows.

## Addendum: a bad synthesis using only growing-degree favorable packets

The proposed truncation of the exact connection formula also passes. The conclusion below additionally uses the audited natural-family estimate H[Q_j^(9/4)]/X[Q_j^(9/4)] <= C/log(j+2), and its upper estimates

    X[Q_j^(9/4)] <= C(j+1)^(7/2)log³(j+2),
    H[Q_j^(9/4)] <= C(j+1)^(7/2)log(j+2).

The two generating functions differ by (1+z²)^(-7/4). Expanding that factor proves the exact finite connection

    Q_n^(4)=sum_(k=0)^floor(n/2) a_k Q_(n−2k)^(9/4),
    a_k=(-1)^k(7/4)_k/k!.

Let L_n=floor(sqrt n), let r_n consist of the terms with j=n−2k<L_n, and put R_n=Q_n^(4)−r_n. The k=0 term is retained for large n. Thus n!R_n is monic of degree n and has parity n. Every retained natural degree j is at least L_n, and hence its individual H/X ratio is at most C/log n uniformly for large n.

The removed block contains at most Csqrt n terms. Gamma-ratio estimates give |a_k|<=C(k+1)^(3/4)<=C(n+1)^(3/4), including all removed k. For either positive quadratic seminorm Y=X or Y=H, Hilbert-space Cauchy–Schwarz gives

    Y[r_n] <= m_n sum_(removed k) |a_k|² Y[Q_(n−2k)^(9/4)],

where m_n<=Csqrt n. On the removed block, j+1<=C sqrt n. Thus

    X[r_n] <= C n^(1/2) n^(1/2) n^(3/2) n^(7/4) log³(n+2)
                  = C n^(17/4)log³(n+2),
    H[r_n] <= C n^(17/4)log(n+2).

This is a coarse but sufficient bound. It does not assume cancellation in the low block, orthogonality in X, or any selected synthesis estimate.

The already proved asymptotics give both X[Q_n^(4)] and H[Q_n^(4)] asymptotic to c n^6log²(2n), c=2^(-9)I0>0. The norm triangle inequality therefore shows

    X[R_n]/X[Q_n^(4)] -> 1,
    H[R_n]/H[Q_n^(4)] -> 1,
    H[R_n]/X[R_n] -> 1.

More precisely, for either Y=X or H,

    |Y[R_n]−Y[Q_n^(4)]|
       <= 2sqrt(Y[Q_n^(4)]Y[r_n])+Y[r_n].

For X this is O(n^(41/8)log^(5/2)n+n^(17/4)log³n)=o(n^6). For H the cross-term logarithmic factor is only log^(3/2)n, so it too is o(n^6). Therefore the sharper constants survive the truncation:

    H[R_n]/[n^6log²(2n)] -> 2^(-9)I0,
    (X[R_n]−H[R_n])/n^6 -> 2^(-7)I1,
    log²(2n)(H[R_n]/X[R_n]−1) -> −4I1/I0.

Multiplication by n! transfers these conclusions to the monic family. Since X[R_n] is asymptotic to X[Q_n^(4)], the subexponential near-minimality upper bound exp(C log²(n+2)), the relative divergence lower bound c n^(5/2)/log n, and eventual positivity and limit one of the trial mismatch ratio all carry over unchanged.

This construction rules out an inference from componentwise favorable H/X ratios to favorable ratios for arbitrary actual-theta synthesis, even when every component degree grows at least like sqrt n. The full quadratic forms remain the actual X and H forms throughout. The Cauchy estimate is used only to remove an asymptotically negligible low-degree block. Nothing identifies these connection coefficients with an actual selected inverse-Gram column, so selected coherence is not contradicted or settled.

## Final-note audit: exact quadratic formulation

Read ACTUAL_SIGNED_SYNTHESIS_OBSTRUCTION.md in full on 2026-11-04. Sections 2–5 and the substantive monic/trial conclusions of sections 6–7 pass, subject to the stated independently audited natural-family inputs. The vector c is consistently identified as a constructed synthesis vector, not a selected inverse-Gram column; natural-family relative near-optimality is not refuted.

For section 5, retain the explicit index set j=n−2k>=L_n and define

    e_j=Q_j^*/sqrt(X[Q_j^*]),
    c_j=a_k sqrt(X[Q_j^*])/sqrt(X[R_n]).

All normalizations exist because X is positive definite on nonzero polynomials. The identity sum_j c_j e_j=R_n/sqrt(X[R_n]) proves c^T G c=1 and c^T J c=H[R_n]/X[R_n]->1 exactly.

The estimate

    sum_k |a_k|²(n−2k+1)^(7/2) <= Cn^6

requires no delicate convolution asymptotics: there are O(n) terms, each coefficient square is O(n^(3/2)), and the final factor is O(n^(7/2)). Restricting to retained indices only decreases this nonnegative sum. Combining it with the natural H upper bound yields

    sum_j c_j²J_jj
      = [sum_k |a_k|²H[Q_(n−2k)^*]]/X[R_n]
      <= C n^6log n/(c n^6log²n)
      <= C'/log n -> 0.

Similarly the natural X upper bound gives ||c||_2²<=C log n. Consequently the signed off-diagonal sum sum_(i!=j)c_i c_j J_ij tends to one. This does not assert each off-diagonal summand is positive. It asserts a positive limiting net correlation in the actual derivative Gram, which is exactly what the full quadratic identity establishes.

Two wording/source points were reported to the author before freezing:

1. Section 6's phrase that both families satisfy the same monic norm "and Gram estimates" could be read as asserting a conditioning theorem for the truncated hierarchy {R_n}. The argument only requires and invokes conditioning of the natural hierarchy in which R_n is synthesized. Recommended replacement: both satisfy subexponential monic near-minimality bounds, and the unfavorable family is synthesized in the same favorable, subexponentially conditioned natural hierarchy.
2. The natural hierarchy's subexponential conditioning claim should cite its specific comparison proof; NATURAL_FAMILY_RATIO.md alone does not state that matrix estimate. This is a dependency-documentation point, not a failure of the section 5 algebra.

No change to the main note, frozen inputs, or live 4CT files was made by this auditor.
