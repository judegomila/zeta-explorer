# Uniform two-index theta Gram decay and a degree-effective partially selected counterfamily

2026-11-04. Analytic derivation/audit. This concerns the actual theta source. It is NOT a fully selected counterexample, an RH claim, or a change to frozen/live 4CT work.

## 1. Inputs and notation

Let Q_j=P_j^(9/4)(t/2;pi/2), W_*=|Gamma(9/4+it/2)|², h_j=||Q_j||²_(W_*)~(j+1)^(7/2), and T p=Fp'+2F'p. Set X[p]=||Tp||², H[p]=||Fp'||², V=2(F'²-FF''), and J_abs[p]=integral |V| |p|². All mixed terms are retained.

Read-only inputs:

- ../theta_nonlocal_selected_20261104/GENERATING_KERNEL_AND_SIGNED_CANCELLATION.md, Sections 1–2: exact bivariate kernel and theta convolution.
- ../theta_selected_relative_locality_20261104/FIXED_ROW_STRETCHED_EXPONENTIAL.md: double-exponential strip estimates and Gevrey-3 argument.
- ../theta_pollaczek_transfer_20261104/ACTUAL_SIGNED_SYNTHESIS_OBSTRUCTION.md: lambda=4 asymptotic, connection formula, and natural diagonal bounds.
- ../theta_polynomial_comparison_20261104/GENERAL_REFERENCE_AND_NATURAL_COROLLARIES.md: X[p]>=c/((d+2)log^(3/4)(d+2)) ||p||²_(W_*) for deg p<=d.
- ../theta_pollaczek_trial_20261104/NATURAL_GAMMA_REFERENCE.md: derivative and multiplication operators in the reference norm.

## 2. Uniform two-index bound

There exist fixed r0 in (0,1) and C,c>0 such that

    |X(Q_k,Q_j)| <= C r0^(-j) exp(-c k^(1/3)),  j,k>=0.       (1)

This is a uniform wedge estimate, not a useful bound near the diagonal.

Use bilinear complexification. Put a(z)=arctan z and C(z)=(1+z²)^(-9/4), with branches normalized at zero. The exact kernel is

    K(z,v)=C(z)C(v)[N(a(z)+a(v))+a(z)a(v)L(a(z)+a(v))],
    L(s)=integral F²e^(st),   N(s)=integral Ve^(st).

The theta convolution proves, for every sigma<pi/2,

    |L(s)|+|N(s)| <= C_sigma exp(-c_sigma exp(|Im s|)),
                                            |Re s|<=sigma.

Polynomial factors in the convolution variables are absorbed into its double-exponential decay. Choose r0=tan(pi/32). Then |Re a(v)|<=pi/32 and |Im a(v)|<=atanh(r0) uniformly on |v|<=r0. For z on the unit circle away from ±i, |Re a(z)|=pi/4. Near either endpoint zeta=±i, continuation to disks of radius epsilon |z-zeta| can be chosen uniformly so that |Re a(z)|<=3pi/8. Thus |Re(a(z)+a(v))|<=13pi/32<pi/2. The imaginary displacement a(v) is bounded.

Writing delta=|z-zeta|, the exact logarithmic formula for arctan gives exp(|Im a(z)|)>=c delta^(-1/2). The kernel therefore obeys uniformly for |v|<=r0, in those relative complex disks,

    |K(z,v)| <= C delta^(-9/4)(1+|log delta|)
                             exp(-c delta^(-1/2)).

The logarithm is absorbed by decreasing c. On the remaining boundary arcs there is a uniform analytic neighborhood. Cauchy derivative estimates in complex angle and optimization in delta give

    sup_(|v|<=r0) ||partial_theta^ell K(e^(i theta),v)||_infinity
         <= C A^ell (ell!)³.

Integration by parts in theta, optimized at ell~k^(1/3), gives uniformly in v

    |[z^k]K(z,v)| <= C exp(-c k^(1/3)).

Cauchy coefficient extraction on |v|=r0 proves (1). All constants are independent of both indices. The original joint series converges on compact subdisks by the strict Laplace margin; the boundary continuation argument computes those same Taylor coefficients. Symmetry also gives the bound with j,k exchanged.

## 3. A high-index bad synthesis

Let L_n=ceil(n^(3/4)) and

    a_k=(-1)^k (7/4)_k/k!,
    R_n=sum_(n-2k>=L_n) a_k Q_(n-2k).

The exact connection formula is Q_n^4=R_n+r_n, where r_n consists of indices j<L_n. Every polynomial here has parity n and R_n has leading coefficient 1/n!. Since |a_k|<=C(k+1)^(3/4), the natural diagonal bounds and the Hilbert–Schmidt inequality yield

    X[r_n] <= C n^(3/2) L_n^(11/2) log³(n+2)
             =O(n^(45/8)log³ n),
    H[r_n] <= C n^(3/2) L_n^(11/2) log(n+2).

The known actual-theta Darboux result gives X[Q_n^4],H[Q_n^4]~C_F n^6 log²(2n), with C_F>0. For either positive quadratic form Y=X,H,

    |Y[Q_n^4-r_n]-Y[Q_n^4]|
       <=2 sqrt(Y[Q_n^4]Y[r_n])+Y[r_n]
       =O(n^(93/16)log^(5/2)n)+O(n^(45/8)log³n)=o(n^6).

Consequently

    X[R_n]~H[R_n]~C_F n^6 log²(2n),
    H[R_n]/X[R_n] ->1.                                  (2)

The retained natural components individually have H[Q_j]/X[Q_j]=O(1/log n). The original coefficient-weighted diagonal derivative sum and coefficient-norm conclusions remain valid, since restricting the sum only improves their upper bounds.

## 4. Absolute potential: an extra argument is necessary and available

The signed identity X-H alone does NOT bound J_abs. Here is a direct proof, using no additional Hardy moment theorem.

Elementary Euler summation gives |zeta^(r)(1/2+it)|<=C(1+|t|)^(1/2)log^r(2+|t|), r=0,1,2. Differentiating the Hardy phase preserves these bounds for Z^(r). Since F=aZ, a² is comparable to W_*, and a'/a,a''/a are bounded,

    |V(t)| <= C(1+|t|)log²(2+|t|) W_*(t)
            <= C(1+|t|)^(5/4) W_*(t).                   (3)

Do not first loosen |Z^(r)| to O(1+|t|), which loses a needed power. Exact reference orthogonality gives

    ||r_n||²_(W_*) <= C n^(3/2)L_n^(9/2).

For deg p<L, the reference multiplication recurrence gives ||tp||_(W_*)<=CL||p||_(W_*). Hölder interpolation between moments zero and two implies

    integral (1+|t|)^(5/4)W_*|p|² <= C L^(5/4)||p||²_(W_*).

Therefore

    J_abs[r_n] <= C n^(3/2)L_n^(23/4)=O(n^(93/16))=o(n^6).

The lambda=4 inner envelope, integrability of |V|/W_4, and its exterior-tail bound already prove J_abs[Q_n^4]=O(n^6). Cauchy–Schwarz in the positive measure |V|dt now gives

    J_abs[R_n]<=2J_abs[Q_n^4]+2J_abs[r_n]=O(n^6),
    J_abs[R_n]/X[R_n]=O(log^(-2)n).                       (4)

## 5. Exponentially small overlap with a growing prefix

Let a0=log(1/r0). By (1) and sum |a_k|<=C n^(7/4),

    |X(R_n,Q_j)|<=C n^(7/4) exp(a0 j-c L_n^(1/3)).

Since L_n^(1/3)>=n^(1/4), choose fixed c0>0 with a0 c0<c/2 and set m_n=floor(c0 n^(1/4)). For all 0<=j<=m_n,

    |X(R_n,Q_j)|<=C n^(7/4)exp(-c n^(1/4)/2).            (5)

Parity makes opposite-parity overlaps exactly zero. This is exponential smallness in n^(1/4), uniformly over the growing prefix, before any projection.

## 6. Exact partial selection and derivative stability

Let E_m be the polynomials of degree at most m=m_n, and let u_n be the exact X-orthogonal projection of R_n onto E_m. Define

    Rtilde_n=R_n-u_n.

Then Rtilde_n has degree n, leading coefficient 1/n!, parity n, and

    X(Rtilde_n,q)=0 for every deg q<=m_n.                (6)

To quantify the projection use psi_j=Q_j/sqrt(h_j), the W_*-orthonormal basis, and G_m=(X(psi_i,psi_j)). Let g_j=X(R_n,psi_j). Since h_j is uniformly bounded below, (5) implies ||g||²<=poly(n)exp(-c n^(1/4)). The polynomial floor gives ||G_m^(-1)||<=C(m+2)log^(3/4)(m+2), so

    X[u_n]=g*G_m^(-1)g<=poly(n)exp(-c n^(1/4)).          (7)

The reference derivative estimate and elementary F²<=C(1+t²)W_* give H[p]<=C(m+2)^3||p||²_(W_*). Combining with the same source floor yields

    H[p]<=C(m+2)^4log^(3/4)(m+2)X[p],   deg p<=m.

Likewise (3) gives J_abs[p]<=C(m+2)^(9/4)log^(3/4)(m+2)X[p]. Thus H[u_n] and J_abs[u_n] are exponentially small up to polynomial factors. Positive-form Cauchy–Schwarz controls every mixed term with R_n. Hence (2) and (4) remain true for Rtilde_n. In X one has additionally the exact Pythagoras identity X[Rtilde_n]=X[R_n]-X[u_n].

## 7. Polynomial monic near-minimality, and the boundary of the conclusion

Set S_n=n!Rtilde_n. Then

    X[S_n]~C_F(n!)²n^6log²(2n).

For the actual fully selected monic minimum A_n, the natural trial upper and polynomial lower comparison give

    c b_n/((n+2)log^(3/4)(n+2)) <= A_n
      <=C b_n log³(n+2),
    b_n~C(n!)²n^(7/2).

Therefore

    c n^(5/2)/log n <= X[S_n]/A_n
                       <=C n^(7/2)log^(11/4)n.          (8)

The family is exactly X-orthogonal through degree floor(c0 n^(1/4)), has polynomial monic norm ratio, and H[S_n]/X[S_n]->1. It remains very far from relative minimality: the ratio in (8) diverges. Projection adds only a negligible low-degree component, so after projection the statement that *every* basis component has growing index no longer holds; that statement applies to R_n before projection. The full derivative and source conclusions do hold after projection.

This disproves a generic implication from polynomial near-minimality plus an n^(1/4)-sized orthogonality prefix to derivative coherence. It does not identify S_n with the degree-n selected polynomial, does not cover orthogonality to every lower degree, and proves no selected defect sign, Q positivity, or RH statement.
