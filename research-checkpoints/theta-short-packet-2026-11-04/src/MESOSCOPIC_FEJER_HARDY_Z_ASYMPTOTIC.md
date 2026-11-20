# Actual-theta mesoscopic Fejer packets: a weighted Hardy-Z asymptotic

Date: 2026-11-04. Status: an analytic result derived from the exact theta identities and the explicitly identified, published unconditional Hardy-Z mean-square theorems. This is AI-assisted mathematical work, not a machine-formalized or externally peer-reviewed proof. No prior package is modified.

## 1. Result and scope

Use the exact complete-theta transform F, with

    Tp = F p' + 2F' p,
    H[p] = integral_R F^2 p'^2,
    X[p] = integral_R |Tp|^2.

Let c=pi/2. Fix a parity epsilon, 0<alpha<4/pi, beta>0, a fixed integer s>=1, and

    5/12 < delta < 1/2.

There are explicit real polynomials p_n of parity epsilon and degree at most n, normalized by p_n(T_n)=1, with T_n=alpha n+O(1), and a width h_n asymptotic to a positive constant times n^delta, for which the following statements hold. Write F(t)=sigma a(t)Z(t) on t>=0, where Z is the standard real Hardy function, a>0 is the exact gamma envelope, sigma is a constant sign, and

    phi_n(u) = a(T_n+u)p_n(T_n+u)/a(T_n),   -T_n<u<infinity.

All integrals below use this exact n-dependent profile, not a substituted limiting profile:

    integral phi_n^2 Z'(T_n+u)^2 du
    --------------------------------  ~ (1/12) log^2 T_n,              (1.1)
    integral phi_n^2 Z(T_n+u)^2 du

    H[p_n]/X[p_n] ~ 3 pi^2/(16 log^2 T_n).                              (1.2)

The integrals are over the entire positive t-axis. No zeros of Xi or Z are removed, no simplicity of real zeros is assumed, and no RH is used. These polynomials are not asserted to be X-selected or orthogonal to any old prefix. The theorem is not a result for fixed-width packets, for delta<=5/12, or for a uniformly arbitrary degree-n polynomial.

The mechanism is exact and quantitative: the weight has total variation O(1), its mass is comparable to h_n, and the cumulative derivative-moment remainder costs O(n^(5/12)log^3 n). Its relative cost is therefore O(n^(5/12)/h_n), which tends to zero precisely in the stated strict range. The upper restriction delta<1/2 makes the gamma carrier asymptotically flat on the h_n scale.

## 2. Arithmetic inputs, coefficient, and source verification

Let theta_0=1515/4816+epsilon_0, with epsilon_0>0 chosen so theta_0<5/12. The inputs are, for x>=2,

    A_0(x) := integral_0^x Z(t)^2 dt
      = x[log(x/(2pi))+2gamma_0-1] + R_0(x),
    |R_0(x)| <= C_0 x^theta_0,                                        (2.1)

    A_1(x) := integral_0^x Z'(t)^2 dt
      = (x/12)P_3(log(x/(2pi))) + R_1(x),
    |R_1(x)| <= C_1 x^(5/12)log^3 x.                                  (2.2)

Here gamma_j are the Stieltjes constants and

    P_3(v)=v^3+(6gamma_0-3)v^2
              +(6-12gamma_0-24gamma_1)v
              +(12gamma_0+24gamma_1+24gamma_2-6).

In particular, differentiation of the deterministic main term, NOT of the remainder, gives the local density

    G_1(v):=P_3(v)+P_3'(v)
           = v^3+6gamma_0 v^2-24gamma_1 v+24gamma_2.                    (2.3)

Thus the coefficient of log^3 in the derivative density is exactly 1/12. It is not 1/4, and P_3 itself must not be confused with the local density G_1.

Source (2.1): Bourgain and Watt, *Decoupling for perturbed cones and mean square of |zeta(1/2+it)|*, Theorem 4, first page, https://arxiv.org/pdf/1505.04161 . The original PDF was independently inspected in this pass.

Source (2.2): M. A. Korolev and A. V. Shubin, *The Second Moment of the First Derivative of Hardy's Z-Function*, in *Trigonometric Sums and Their Applications* (2020), pp.169-182, theorem on printed p.171. Publisher identity: https://link.springer.com/chapter/10.1007/978-3-030-37904-9_9 . The original chapter text, including the theorem and its explicit polynomial, was independently read in the publicly indexed printed-volume reproduction https://www.scribd.com/document/452639340/TRIGONOMETRIA . The publisher page confirms the chapter but is paywalled; the assertion about the exact remainder is based on the accessible original chapter text, not its abstract or an aggregator summary. No authentication or paywall bypass was used.

The published theorem does support the present mesoscopic argument. A bare cumulative leading asymptotic, or Hall's older O(x^(3/4)log^(5/2)x) error for the first derivative, would not support this range. The present proof does not independently reprove Korolev-Shubin.

## 3. Exact gamma envelope and phase

If F(t)=C_F xi(1/2+it), with a fixed nonzero real normalization C_F, the identity

    xi(1/2+it)
      = -(1/2)(t^2+1/4)pi^(-1/4)|Gamma(1/4+it/2)| Z(t)

gives the exact a(t), up to |C_F|. The factor exp(i vartheta(t)) in Z(t) is the exact gamma phase. It is not approximated by a linear phase and it is never replaced by |zeta| when derivatives are taken. In particular the distinction between Z' and the derivative of |zeta| is respected.

The positive smooth envelope obeys

    a(t)^2 = C_a t^(7/2)e^(-ct)(1+O(t^(-2))),
    b(t):=a'(t)/a(t) = -c/2+7/(4t)+O(t^(-3)),
    b'(t) = -7/(4t^2)+O(t^(-4)).                                    (3.1)

It and its derivatives are smooth at t=0; b is bounded on [0,infinity). Fixed-strip estimates give a fixed exponent B and constant C such that the complete energy envelope is bounded by

    |Tp|^2+F^2p'^2+(F^2+|V|)p^2
      <= C(1+t)^B e^(-ct)(p^2+p'^2),
    V=2(F'^2-FF'').                                                   (3.2)

Likewise a^2(Z^2+Z'^2) has a bound of this form. These are only polynomial-growth upper bounds for the arithmetic factors; no lower bound at an individual real height is assumed.

## 4. Explicit polynomial and degree accounting

Put kappa=c alpha/2<1. Let k_n be the largest nonnegative integer of parity epsilon not exceeding kappa n, and set

    T=T_n=2k_n/c=alpha n+O(1),
    m=m_n=floor(beta n^(1-delta)).

Discard the finitely many n for which k_n=0 or m<2. Choose a fixed L>max(alpha,4/c), and enlarge it if a specified linear bulk requires this. Put

    x_n=T/(Ln),   vartheta_n=arccos x_n,
    d_n=sin vartheta_n,
    h=h_n=2Ln d_n/m.

Thus h~[2L sqrt(1-(alpha/L)^2)/beta]n^delta.

For Chebyshev polynomials T_j define

    K_m(x,y)=1+2 sum_(j=1)^(m-1)(1-j/m) T_j(x)T_j(y),
    E_n(x)=[K_m(x,x_n)+K_m(x,-x_n)]/m,
    q_n(t)=E_n(t/(Ln))/E_n(x_n),
    p_n(t)=(t/T)^k_n q_n(t)^s.                                      (4.1)

The kernel has the exact identity

    K_m(cos vartheta,cos eta)
       =[F_m(vartheta-eta)+F_m(vartheta+eta)]/2,
    F_m(v)=(1/m)[sin(mv/2)/sin(v/2)]^2.

The even polynomial E_n has degree at most m-1,

    0<=E_n(x)<=2 on [-1,1],
    E_n(x_n)=1/2+O(m^(-2)).                                         (4.2)

Only one of its four angular peaks is near +T. The other three stay a fixed angular distance away. Their phase-dependent values are bounded uniformly, irrespective of the values of m vartheta_n.

Since q_n is even, p_n has parity epsilon, p_n(T)=1, and

    deg p_n <= k_n+s(m-1) <= n                                     (4.3)

for all sufficiently large n. The last inequality uses m=o(n); no s-dependent linear fraction of the degree budget is consumed asymptotically.

## 5. Uniform profile bounds, including two derivatives

Fix eta>0 sufficiently small that

    I_n=[T-eta n,T+eta n] subset (0,Ln)

stays separated from the scaled endpoints and the negative mirror peak. All constants below may depend on the fixed alpha,beta,delta,s,L,eta and on the fixed envelope constants, but not on n,u, or the remote angular phases.

For u=t-T in I_n-T, set v=u/h and

    R_n(u)=a(T+u)/a(T) (1+u/T)^k_n,
    phi_n(u)=R_n(u)q_n(T+u)^s.

### 5.1 Kernel bounds

For j=0,1,2,

    |(d/du)^j q_n(T+u)|
       <= C_j h^(-j)(1+|u|/h)^(-2).                                (5.1)

To check all ranges, put r=arccos((T+u)/(Ln))-vartheta_n. On this interval |r| is comparable to |u|/n. For |u|>=h, the main peak's numerator and its first two derivatives cost at most (m/n)^j, whereas the denominator contributes (m|r|)^(-2). Differentiating that denominator gives extra factors O(1/|u|), bounded by O(1/h). For |u|<=h, the exact trigonometric sum gives O((m/n)^j). Each remote peak contributes O(m^(-2)h^(-j)), and m^(-2)<=C(1+|u|/h)^(-2) throughout I_n. Normalization in (4.2) is uniformly harmless. This argument never differentiates log q_n or divides by a kernel zero.

Leibniz's rule, including the case s=1 separately in the absent second-power term, consequently gives

    |(d/du)^j q_n(T+u)^s|
       <= C_j h^(-j)(1+|u|/h)^(-2s),   j=0,1,2.                    (5.2)

### 5.2 Carrier bounds

The exact identity k_n=cT/2 and (3.1) give

    log R_n(u)
      = k_n[log(1+u/T)-u/T]+(7/4)log(1+u/T)+O(n^(-2)).             (5.3)

The error is uniform on I_n. The first bracket is at most a negative fixed multiple of u^2/n after its k_n factor. The harmless linear term is absorbed by completing a square. Furthermore,

    R_n'/R_n=b(T+u)+k_n/(T+u)=O((1+|u|)/n),
    (R_n'/R_n)'=b'(T+u)-k_n/(T+u)^2=O(1/n).

It follows, for a fixed a_0>0, that

    |R_n^(j)(u)|<=C_j n^(-j/2)exp(-a_0 u^2/n),   j=0,1,2,          (5.4)

after decreasing a_0 as needed. Since h=o(sqrt(n)), combining (5.2)-(5.4) proves

    |phi_n^(j)(u)|
       <= C_j h^(-j)(1+|u|/h)^(-2s)exp(-a_1 u^2/n), j=0,1,2.       (5.5)

In particular, on I_n,

    integral phi_n^2 <= C h,
    integral |u|phi_n^2 <= C h^2,
    integral u^2 phi_n^2 <= C h^3,
    integral |(phi_n^2)'| <= C,
    integral phi_n'^2 <= C/h,
    integral |(phi_n'^2)'| <= C/h^2.                               (5.6)

All three polynomial moments in (5.6) are finite with these bounds already for s=1. The last bound is the estimate 2 integral |phi_n'phi_n''|. It is essential for controlling the actual H numerator.

### 5.3 Profile mass and phase error

Let

    J_s=integral_R sinc(v)^(4s)dv>0,
    sinc(v)=sin(v)/v, sinc(0)=1.

Then

    A_n:=integral_0^infinity [a(t)p_n(t)/a(T)]^2 dt
        =h[J_s+O(h^2/n+h/n+m^(-2))]
        =h J_s[1+O(h^2/n)].                                      (5.7)

Here and below the exponentially small tails are absorbed in displayed errors. For a direct justification without arithmetic-profile substitution, write

    m r/2=-v+O((h/n)v^2).

The main normalized Fejer peak is sinc(mr/2)^2/sinc(r/2)^2; the three other peaks and the normalizing denominator cause O(m^(-2)) corrections. The derivative of sinc^2 at a point comparable in magnitude to v is O((1+|v|)^(-2)). Thus, after taking the fixed power 2s, the integrated phase error is bounded by

    C(h/n) integral v^2(1+|v|)^(-4s)dv + O(m^(-2)).

The denominator sinc(r/2) costs O((h/n)^2) by the same integrable moment. Formula (5.3) gives |R_n^2-1|<=C[(u^2+|u|)/n+n^(-2)] on I_n; integrate against q_n^(2s) and use (5.6). The missing part of the limiting profile outside |v|<=eta n/h is O(m^(-(4s-1))). This proves (5.7). In particular A_n>=J_s h/2 for large n.

This limiting-profile calculation concerns an ordinary deterministic weight integral only. No unproved interchange involving Z(T+hv) or Z'(T+hv) occurs anywhere.

## 6. Full tails and endpoints

There exist C,B,rho>0, independent of n, such that

    integral_(t>=0,t notin I_n)
       {phi_n(t-T)^2[1+Z(t)^2+Z'(t)^2]
                        +phi_n'(t-T)^2[1+Z(t)^2]} dt
       <= C n^B exp(-rho n).                                     (6.1)

The same exponential statement holds for the complete theta energy in (3.2), divided by a(T)^2. It also holds for the endpoint quantities in integrations by parts below.

Here is the tail accounting. On [0,Ln], Markov's inequality applied to q_n costs only a fixed power of n. The saddle exponent relative to e^(-cT) is

    2k_n log(t/T)-c(t-T),                                         (6.2)

whose unique maximum is zero at t=T. Outside I_n it is <=-rho_0 n. Terms from differentiating the monomial replace k_n by k_n-1 and retain an exponential gap; k_n grows linearly. At t=0 all these terms vanish for large n.

For t>=Ln the elementary Chebyshev bound gives a fixed polynomial prefactor times exp of

    2k_n log(t/T)+2sm_n log(2t/(Ln))-c(t-T).                       (6.3)

At t=Ln its quotient by n tends to

    2kappa log(L/alpha)-c(L-alpha)<0.

The added Fejer term is o(n). The derivative of (6.3) is at most 2n/t-c<-c/2 for the chosen L, once the degree bound holds. Integration to infinity is therefore exponentially small. Polynomial upper bounds for Z and its fixed derivatives are enough. The positive a(T)^2 is comparable to T^(7/2)e^(-cT), so normalization adds only a fixed polynomial factor. This proves (6.1), without a local arithmetic lower bound or any removal of zeros.

One may choose I_n inside any fixed linear bulk theta n<=t<=Theta n with theta<alpha<Theta. Dividing its exterior complete energy by the explicit lower source norm in Section 8 proves exponentially small relative leakage from that bulk.

## 7. Applying cumulative moments to the n-dependent weights

Write ell=log(T/(2pi)), and define the full positive-half-line quantities

    M_n=integral phi_n^2 Z^2,
    D_n=integral phi_n^2 Z'^2,
    B_n=integral phi_n'^2 Z^2.                                    (7.1)

In these formulas the translated Z argument is T+u. On I_n, for either weight W=phi_n^2 or W=phi_n'^2, use Stieltjes integration by parts:

    integral_I W dA_j
       = integral_I W d(main term)
           +[W R_j]_(endpoints)-integral_I W' R_j.                 (7.2)

There is no differentiation of the unknown R_j. Since t is comparable to n on I_n, (5.6), (6.1), and (2.1)-(2.3) give

    M_n=A_n(ell+2gamma_0)
             +O(h^2/n+n^theta_0),                                (7.3)

    D_n=(A_n/12)G_1(ell)
             +O((h^2/n)log^2 n+n^(5/12)log^3 n),                   (7.4)

    B_n=O(h^(-1)log n+n^theta_0 h^(-2))
        =O(h^(-1)log n).                                         (7.5)

For (7.3) the density changes from its value at T by O(|u|/n); for (7.4) the change is O((|u|/n)log^2 n). Equation (5.6) accounts exactly for these errors. For (7.5) the main density is O(log n), its weight mass is O(1/h), and its remainder term costs the smaller variation O(1/h^2). Contributions outside I_n are exponentially small by (6.1).

Since A_n is comparable to h, these estimates imply

    M_n~J_s h log T,
    D_n~(J_s/12)h log^3 T,
    B_n/M_n=O(h^(-2)).                                           (7.6)

More explicitly, with constants depending only on the fixed parameters and the constants in the arithmetic inputs,

    D_n/M_n=(ell^2/12)
       [1+O(1/ell+n^(5/12)/h+n^theta_0/(h ell)+h/(n ell))].         (7.7)

Every displayed error tends to zero in the stated range. In particular the cumulative derivative remainder contributes n^(5/12)/h, not n^(5/12) times a hidden degree or number of oscillations. The bounded total variation is what prevents that loss.

### 7.1 Mesoscopic tail tightness for the actual H and X energies

For any R>=1 with Rh<=eta n, the same integration-by-parts argument on the two portions of I_n outside |u|<=Rh, using (5.5), gives

    integral_(|u|>Rh) phi_n^2 Z^2
      <= C(h log n+n^theta_0)R^(1-4s)+C n^B e^(-rho n),

    integral_(|u|>Rh) phi_n^2 Z'^2
      <= C(h+n^(5/12))log^3 n R^(1-4s)+C n^B e^(-rho n),

    integral_(|u|>Rh) phi_n'^2 Z^2
      <= C(h^(-1)log n+n^theta_0 h^(-2))R^(1-4s)
            +C n^B e^(-rho n).                                  (7.8)

The endpoints at +/-Rh cost at most the same displayed terms, since W there is bounded by its indicated scale times R^(-4s). Thus the actual H and X masses are tight on the scale h, after normalization by their full norms. This is not a statement that the mass outside a fixed multiple of h vanishes with n. It does imply negligible H and X mass outside any window n^delta' with delta'>delta. For the auxiliary |V| energy we claim the exponential linear-bulk bound only, not a sharper mesoscopic bound that would require extra information about Z''.

## 8. Exact theta operator ratio and source lower bound

There is no division by F or Z in the exact identities

    Fp_n' = sigma a(T) Z(phi_n'-b phi_n),
    Tp_n  = sigma a(T)[2phi_n Z'+(phi_n'+b phi_n)Z].                 (8.1)

Parity gives the full-line factor two. On I_n, b=-c/2+O(1/n), and b is globally bounded. The estimates for B_n and M_n give

    H[p_n]/[2a(T)^2]
      = integral Z^2(phi_n'-b phi_n)^2
      =(c^2/4)M_n[1+O(h^(-1)+n^(-1))].                           (8.2)

Indeed the derivative-square term is B_n=O(M_n/h^2), the cross term is at most a constant times sqrt(B_n M_n), and replacing b^2 by c^2/4 costs O(M_n/n) plus the exponential tail.

Put C_n=integral Z^2(phi_n'+b phi_n)^2=O(M_n). Cauchy-Schwarz, without any assumption about the sign or cancellation of the cross term, gives

    X[p_n]/[2a(T)^2]
      =4D_n+O(sqrt(D_n M_n)+M_n)
      =4D_n[1+O(1/log T)].                                      (8.3)

Combining (7.7), (8.2), and (8.3),

    H[p_n]/X[p_n]
      = [3c^2/(4 ell^2)]
        [1+O(1/ell+n^(5/12)/h+h^(-1)
                        +n^theta_0/(h ell)+h/(n ell))]
      ~3pi^2/(16 log^2 T).                                      (8.4)

The leading coefficient follows from (c^2/4)/(4*(1/12))=3c^2/4=3pi^2/16.

In particular the full source and derivative norms satisfy

    X[p_n]~(2/3)a(T)^2 J_s h log^3 T,
    H[p_n]~(c^2/2)a(T)^2 J_s h log T.                             (8.5)

For all sufficiently large n, for example,

    X[p_n] >= (J_s/3)a(T)^2 h ell^3>0.                           (8.6)

This is the requested non-negligible source norm: after the gamma exponential is removed, it has an explicit positive order h log^3 T, rather than an unspecified polynomial lower bound. With (3.1), it is comparable to T^(7/2)e^(-cT)h log^3 T. All tails used above are negligible relative to it.

## 9. Constant ledger and limitations

- k_n differs from kappa n by less than two. All height errors are therefore O(1), not an unspecified o(n).
- n must exceed a fixed threshold ensuring k_n>=2, m_n>=2, deg p_n<=n, h<=sqrt(n), and the chosen fixed interval I_n stays in (0,Ln).
- The kernel constants depend on the fixed separation of x_n from 0 and +/-1, on s, and on L. They do not depend on any arithmetic or Fejer phase.
- The carrier constants depend on fixed-order Stirling bounds and the fixed linear interval. No derivative order grows with n.
- C_0, C_1 are the fixed constants in the published moment remainders. No numerical values for these are claimed. Every subsequent O-constant is bounded in terms of them and the fixed parameters just listed; none depends on n or on unknown Xi zero locations.
- The normalization C_F cancels from H/X and from D/M. It only changes a(T)^2 in the absolute norms.
- The limiting profile is used only to compute A_n and give its lower bound. The arithmetic integrals are evaluated using their exact n-dependent weights and their variation bounds.
- At delta=5/12 with a fixed width coefficient the cited derivative theorem leaves an O(1) relative error; below it the error can be larger than the main term. This proof makes no assertion there. More generally, the same proof works for any integer frequency sequence m_n with m_n/sqrt(n) tending to infinity and m_n/n^(7/12) tending to zero, equivalently n^(5/12)=o(h_n) and h_n=o(sqrt(n)). In particular h_n=n^(5/12)L(n), with L(n) tending to infinity and L(n)=o(n^(1/12)), is also allowed. The operative conditions are n^(5/12)/h_n tending to zero and h_n^2/n tending to zero, not the power-law notation itself.
- This theorem establishes the actual-theta arithmetic scale for a new explicit family of mesoscopic packets. It neither proves nor refutes selected derivative coherence, a uniform bulk theorem down to constant width, the sign of a selected Schur excess, or the proposed 11/20 coupling constant.

## Local provenance

The exact theta normalization and operator identities are those in:

- /workspace/shared/theta_coupling_bounds_20261103/AMPLITUDE_SOBOLEV_REDUCTION.md
- /workspace/shared/theta_degree_locked_20261104/FEJER_PACKETS_AND_HARDY_Z_OBSERVABILITY.md
- /workspace/shared/theta_excess_independent_20261104/SELECTED_COMPACT_LOCALIZATION_AND_MONOMIAL_TEST.md

This note changes m from a linear-in-n frequency to a sublinear n^(1-delta) frequency. That change creates a growing mesoscopic packet width on which the verified cumulative arithmetic estimates are strong enough. No old file or live 4CT file was edited.
