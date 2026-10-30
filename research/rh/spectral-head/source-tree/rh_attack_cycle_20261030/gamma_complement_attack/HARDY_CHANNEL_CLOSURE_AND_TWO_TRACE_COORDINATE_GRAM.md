# Hardy-channel closure and a two-trace coordinate Gram theorem

> Curated mathematical source or internal audit. All mathematical sections are retained. Historical producer headers may predate acceptance; current claim scope follows the paired audit and module, not those old workflow labels. Original and published SHA-256 identities are recorded in the dependency inventory. Internal review is not external peer review.

30 October 2026. **Producer synthesis; independent review requested.** All results below concern the actual inverse-evenization coordinate map. They do not prove positivity of the Weil form, a gamma-complement floor, or the exceptional trace Schur sign. No numerical experiment is used.

## 1. Result and precise space

Let B_lambda be the actual additive positive-even finite-Fourier spectral head chi_n>=1/2, on full L2[-lambda,lambda], with the normalization of the accepted prolate packets. Set

    E_lambda=B_lambda intersect 1-perp,
    F_lambda={g in E_lambda: g(0)=g(lambda)=0}.

The functions are finite prolate combinations, so all three functionals are well defined. Mean zero is imposed first; the two source traces then cost at most two additional dimensions. No unknown Weil spectral projector is used.

There exists an unspecified lambda_0 such that for all lambda>=lambda_0 and g in F_lambda,

    2 Re <g_visible,W_lambda E_even g> >= (1/10)||g||^2,
    ||E_even g|| >= ||g||/(40 sqrt(2) lambda),
    ||E_even g||^2 >= ||g||^2/(3200 lambda^2).             (1)

Here E_even is the actual supported arithmetic E-image followed by reflection averaging, and W_lambda is its actual finite Mobius inverse coordinate map, with ||W_lambda||<=2sqrt(2)lambda. The visible inner product uses the full-even convention 2dy. The Gram conclusion is only on F_lambda. Full coordinate-pairing positivity still has an exact at-most-two-dimensional Schur problem. Actual Weil-energy estimates require their separate hypotheses and are not consequences of (1).

The new ingredient is a support-uniform actual low-label bound whose constant is strictly below the known visible-main reserve. Its proof uses a compressed Hardy projection, not a guessed AdS/CFT dictionary or an assumed positive zeta multiplier.

## 2. Exact actual channels and the weak head limit

Put c=2pi lambda^2, H=L2(-1,1), and

    K_c(x,y)=sin(c(x-y))/(pi(x-y)),
    M_c f(x)=exp(icx)f(x),
    P_c=1_{positive Fourier phase} 1_[1/4,1](K_c),
    Q_c=M_c* P_c M_c.

Let A be the negative-frequency Hardy compression to (-1,1). The frozen strong-edge and broad-WOT proofs establish

    M_c* K_c M_c <= A,
    0<=Q_c<=4A,
    Q_c -> Q=(1/4) E_A weakly,
    E_A=1_[1/4,1](A).                                   (2)

The last limit holds against arbitrary fixed L2 vectors, not just the constant vector. It uses the exact four-phase polar projector, endpoint concentration of the demodulated finite-Fourier vectors, and the absence of a spectral atom of A at1/4. No asymptotic counting remainder is differentiated.

For W>0 and |omega|<=1/2 put

    F_W,omega(x)=integral_0^W exp[2pi i tau(x-omega)]d_tau.

The actual finite-collar channel has coefficients

    k_j,c,W(xi,n)=lambda^(-1/2) integral_0^W
                  H_n(lambda+tau/lambda) exp(-2pi i xi tau/j)d_tau
                =<psi_n,M_c F_W,xi/j>,                 (3)

where psi_n(x)=sqrt(lambda)e_n(lambda x) and H_n is the Fourier transform of the zero-extended additive mode. The displayed inner product convention is conjugate-linear in its first slot; the psi_n are real. Consequently

    ||K_j,c,W||_HS^2
       =integral_-1^1 <F_W,xi/j,Q_c F_W,xi/j>d_xi.       (4)

For each FIXED W, the family {F_W,omega: |omega|<=1/2} is compact in H. Uniform boundedness and a finite-net argument upgrade (2) to uniform convergence of these quadratic forms. Thus (4) converges uniformly over ALL j>=2 to the same expression with Q. This is a trace/HS statement proved directly by the vector integrand, not an inference from operator-norm convergence of a compact sandwich.

## 3. An exact uniform projected-tail bound

For V>W, set G=F_V,omega-F_W,omega. In cycle-frequency convention the negative-frequency Fourier transform of its zero extension is

    Ghat(-v)=integral_W^V exp(-2pi i omega tau)
                    sin[2pi(tau+v)]/[pi(tau+v)]d_tau,
    v>=0.

Splitting the sine and integrating each exponential by parts, retaining BOTH finite endpoints, gives

    |Ghat(-v)| <=1/[pi^2(1-omega^2)(W+v)]
               <=4/[3pi^2(W+v)].

Hence <G,AG><=16/(9pi^4 W). Using Q_c<=4A and the xi interval of length2 proves

    ||K_j,c,V-K_j,c,W||_HS <= C_tail/sqrt(W),
    C_tail^2=128/(9pi^4),                              (5)

uniformly in c, j>=2 and V>W. The same inequality passes to the fixed-W limiting channels. This is the separately audited actual-tail estimate. It does not alter any original arithmetic integration interval: it only compares the exact source-coordinate channel operators.

## 4. Direct Hardy computation of the limiting diagonal constant

This computes the limiting half-line channel without modal differential labels, Coulomb matching, or endpoint-weight asymptotics.

Use the unitary change x=tanh u,

    (Vf)(u)=sech(u)f(tanh u).

The negative Hardy compression becomes the Fourier multiplier

    a(eta)=(1+exp(pi eta))^(-1)

under the unitary angular Fourier transform on u. Put u0=atanh(omega). In distributions on (-1,1),

    F_infinity,omega(x)
       =(1/2)delta(x-omega)+(i/(2pi))PV[1/(x-omega)].

The transformed distribution is exactly

    V F_infinity,omega
       =cosh(u0)[(1/2)delta(u-u0)
                         +(i/(2pi))PV 1/sinh(u-u0)].    (6)

The identities sech(u)/(tanh(u)-tanh(u0))=cosh(u0)/sinh(u-u0) and the delta change-of-variables verify both factors. The transform of PV[1/(pi sinh u)] has multiplier -i tanh(pi eta/2). Therefore the angular Fourier transform of (6) is

    cosh(u0) exp(-i eta u0)[1-a(eta)]/sqrt(2pi).        (7)

Although F_infinity itself is not L2, its E_A projection is L2. Indeed a>=1/4 restricts eta<=log3/pi, and

    integral_(a>=1/4) (1-a)^2 d_eta
       =(1/pi) integral_(1/4)^1 (1-a)/a d_a
       =(log4-3/4)/pi.

Thus

    (1/4)||E_A F_infinity,omega||^2
       =(log4-3/4)/[8pi^2(1-omega^2)].                 (8)

Here the left side is defined equivalently as the L2 limit of E_A F_W,omega. This identification is rigorous: E_A<=4A and the same tail estimate make the projected sequence Cauchy; meanwhile F_W converges to (6) in tempered distributions after V. Away from the central singularity, its transformed physical tail has a uniform sech(u) bound, so no endpoint mass is lost. Testing the Fourier transforms against smooth functions compactly supported strictly below log3/pi identifies the L2 limit with (7) on that half-line. Such tests are dense there; the threshold point has measure zero. This supplies an ordinary L2 meaning to every projected distribution used in (8).

Integrating (8) at omega=xi/j gives

    H_j^2=(log4-3/4) j atanh(1/j)/(4pi^2),
    H_j^2<=H^2=(log4-3/4)log3/(4pi^2), j>=2.           (9)

The maximum is at j=2: x^(-1)atanh(x) increases for 0<x<1 by its positive power series, and x=1/j. No complex branch or delta-mode normalization is left in this computation.

For any W_lambda tending to infinity, apply (5) with fixed W0, use the fixed-W0 uniform convergence from section2, and then let W0 tend to infinity. The limiting ideal tail is controlled by the same bound. This proves

    limsup_(lambda->infinity) sup_(j>=2)
                    ||K_j,c,W_lambda||_HS^2 <= H^2.     (10)

This sequential argument requires no convergence rate in (2). In particular it covers W_lambda=(1+loglambda)^6 and all polylogarithmic arithmetic labels simultaneously.

## 5. Actual collective channels and the squarefree improvement

Let w=1+loglambda, h=w^6/lambda, W=w^6, J0=2^ceil(log_2(w^8)). The accepted actual collar localization gives, for g in F_lambda and u in B_lambda,

    <u_visible,R_complete g>
        =B_low(u,g)+o(1)||u||||g||,
    B_low=-2 sum_(2<=j<J0) mu(j)/j integral_lambda^(lambda+h)
                              H_g(t)conjugate(u(t/j))dt. (11)

The error is uniform on these input/test unit balls. The exact moving upper cutoff j<=lambda*t is inactive only for the retained low labels; it was retained in the other localization estimates. All source repairs in (11) vanish because of the three stated source constraints.

Write u=Fq on [-lambda,lambda], with ||q||<=2||u||, and rescale q_tilde(xi)=sqrt(lambda)q(lambda xi). Define

    U_j=exp(-2pi i lambda^2 xi/j) K_j,c,W.

Then the literal finite-collar identity is

    B_low=-2 <q_tilde, sum_(2<=j<J0) mu(j) U_j g/j>.     (12)

Parseval gives the exact row estimates ||k_j(xi,.)||<=sqrt2 W and ||partial_xi k_j(xi,.)||<=sqrt2*pi*W^2/j. Both-endpoint integration by parts yields, for j!=l,

    ||U_j*U_l||
       <=[2W^2/pi+2W^3(1/j+1/l)]
                         /[lambda^2 |1/j-1/l|].       (13)

The block-Gram Schur error for j<J0 is at most

    epsilon_lambda=2(2W^2/pi+2W^3)J0^2(1+logJ0)/lambda^2=o(1).

Together with (10), this proves the actual direct-sum Bessel bound. Retain the actual squared Mobius weights rather than replacing them by1:

    sum_(j>=2) mu(j)^2/j^2
       = product_p(1+p^(-2))-1
       =zeta(2)/zeta(4)-1=15/pi^2-1.                  (14)

The Euler product is absolutely convergent; it uses squarefree support, not an unproved cancellation estimate. Applying (12), the factor2 from the full-even pairing and factor2 from the exact inverse-chi extension give

    |B_low(u,g)| <=[B0+o(1)]||u||||g||,
    B0=4 sqrt[H^2(15/pi^2-1)].                        (15)

The historical weaker budget using zeta(2)-1 remains correct. Equation (15) improves it without altering any frozen source or inventing label orthogonality.

## 6. Explicit margin and coordinate Gram

The accepted visible-main Jordan estimate gives, on the whole positive head,

    Re<g_visible,[(I+C_lambda)g]_visible>
       >=gamma_lambda||g||^2,
    gamma_lambda=(4sqrt3-3)/8-2/lambda.                (16)

For transparent outward bounds, use

    sqrt3>1.732, pi^2>9.86, log4<1.387, log3<1.099.

These follow from squaring, a classical elementary lower bound pi>3.141, and the positive atanh series with a geometric remainder. They imply

    gamma_infinity>.491,
    H^2<.017751, 15/pi^2-1<.522,
    B0^2<16(.017751)(.522)=.148256352<(.386)^2,
    gamma_infinity-B0>.105>1/10.                      (17)

Thus the exact complete inverse-evenization identity

    2W_lambda E_even g=[(I+C_lambda)g]_visible+R_complete g

combined with (11),(15),(16) gives the first inequality of (1), eventually, after all o(1) terms and 2/lambda are absorbed in the strict slack. Finally

    2|<g_visible,W_lambda E_even g>|
       <=4sqrt2 lambda ||g|| ||E_even g||

proves the other two inequalities of (1). The threshold lambda_0 is not made effective by this proof.

## 7. The remaining two-trace block, and no energy promotion

Let A_lambda be the positive visible-main coordinate operator on E_lambda. Define T:E_lambda->C^2 by Tg=(g(0),g(lambda)). In z=A_lambda^(1/2)g coordinates, the proven subspace is A_lambda^(1/2)kerT. Its orthogonal complement is

    ran((T A_lambda^(-1/2))*)=ran(A_lambda^(-1/2)T*),

of rank at most2. The correct coordinate Schur complement keeps the complete off-diagonal bridge and the inverse of the positive proven block; its sign is NOT supplied by (1). The Hermitian trace correction can have rank at most4, not automatically2.

This removes the need for an iterated-log concentration cutoff for this coordinate subsector: the whole maximal signed positive head works after the two source traces and the existing mean constraint. It does not shrink the actual Weil-energy transition block by itself. The separate accepted A4 quadratic-energy and A6 full-action theorems still require their own polynomial-deficit selection. No external gamma-complement estimate or cofinal support-uniform Rayleigh floor has been obtained.

## Frozen dependencies and review boundary

- `../prolate_endpoint_flow/WEAK_HEAD_OPERATOR_AND_COMPACT_CHANNEL_TRANSFER.md`, SHA256 `6fd3197cec2972e7e23fcda4719591dbfb7443f769ac9373f9ab89d88e2af6e6`; independent WOT second check in `repo_leverage/independent_review/weak_head_transfer/`.
- `../repo_leverage/UNIFORM_COLLAR_TAIL_AND_SINGLE_CHANNEL_TRANSFER.md`, SHA256 `ec540fc47064e87fbcc7beed595321d08c8b65758b14bc70e5249cd2a2139f14`; independent receipt `../independent_review/UNIFORM_COLLAR_TAIL_AND_CHANNEL_TRANSFER_AUDIT.json`.
- `../repo_leverage/ACTUAL_FINITE_COLLAR_CHANNEL_BESSEL_REDUCTION.md`, SHA256 `dce34475d13cb0f90a9dbc75ee108c4bbe336ecf2915e90e674dc5d9116f0045`.
- Accepted `CRITICAL_COLLAR_AND_EXPLICIT_FOURIER_JET_PORTS.md`, `COLLAR_RECIPROCAL_SAMPLING_AND_SMALL_LABEL_REDUCTION.md`, and `POSITIVE_CHI_CORE_PROJECTION_AND_MAIN_RESERVE.md` fix the actual arithmetic dictionary and main reserve.

The direct Hardy half-line evaluation and the squarefree final synthesis are recorded separately here for independent audit. Earlier frozen notes may still describe now-closed gates as open; their historical text is intentionally preserved.
