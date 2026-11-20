# Uniform collar tail and single-channel transfer

> Curated mathematical source or internal audit. All mathematical sections are retained. Historical producer headers may predate acceptance; current claim scope follows the paired audit and module, not those old workflow labels. Original and published SHA-256 identities are recorded in the dependency inventory. Internal review is not external peer review.

30 October 2026. **Producer proof, pending independent review.** This note combines the new endpoint-flow theorem with two exact estimates. It proposes an actual low-label norm bound, not a statement about the remaining trace Schur form, correct gamma complement, or global Weil floor. The earlier ideal-model and actual-channel notes remain unchanged.

Dependencies:

- `HARD_EDGE_LIMIT_MODEL_AND_CHANNEL_BESSEL.md`, SHA256 `0a9774113f27cddf145b5b4ee9d02703f9a54e0cefd8b3bc4a8f0f24ebe87a67`: exact compact normalized profile convergence, Laplace kernel and ideal single-channel HS budget.
- `ACTUAL_FINITE_COLLAR_CHANNEL_BESSEL_REDUCTION.md`, SHA256 `dce34475d13cb0f90a9dbc75ee108c4bbe336ecf2915e90e674dc5d9116f0045`: actual finite-collar channel definition and collective estimate.
- `../prolate_endpoint_flow/STRONG_EDGE_LIMIT_AND_POSITIVE_PHASE_MEASURE.md`, SHA256 `361f984698daa9c859db45c779bc4e78d8fdc8eb5af1cfb9008c2de98a424afe`: weak positive-phase joint endpoint measure, currently independently under review.
- The previously admitted eventual threshold bound `nu_n-c²<=3c/2` for the actual |chi_n|>=1/2 head.

## 1. Exact source-coordinate representation

Use c=2pi lambda², psi_n(x)=sqrt(lambda)e_n(lambda x), and the selected positive head chi_n>=1/2. On H=L²[-1,1], let K_c be the concentration operator with kernel sin(c(x-y))/(pi(x-y)), M_c multiplication by exp(icx), and P_c the selected-head orthogonal projector. Its eigenvalues satisfy chi_n²>=1/4, hence the exact operator order

    0<=P_c<=4K_c.                                      (1)

For W>0, |omega|<=1/2, define

    F_(W,omega)(x)=integral_0^W exp[2pi i tau(x-omega)]d_tau.

The actual channel coefficient from the preceding note is exactly

    k_(j,lambda,W)(xi,n)
      =integral_-1^1 psi_n(x) exp(icx)
                       F_(W,xi/j)(x)dx.               (2)

Indeed substitute x_physical=lambda x and t=lambda+tau/lambda into its definition; the factors lambda^(-1/2) and sqrt(lambda) cancel. The psi_n are real, so the sum of coefficient squares in (2) is ||P_c M_c F_(W,xi/j)||². No chi factor is introduced or lost.

In this section use the cycle Fourier transform fhat(s)=integral_R f(x)exp(-2pi isx)dx. After zero extension E,

    M_c* K_c M_c
      =E* F* 1_[-c/pi,0] F E
      <= A:=E* F* 1_(-infinity,0) F E.                 (3)

The inequality in (3) is exact for all c>0.

## 2. A uniform finite-to-half-line tail estimate

For V>W>0 put G=F_(V,omega)-F_(W,omega). At negative cycle frequency -v, v>=0, its zero extension has transform

    (EG)^hat(-v)
      =integral_W^V exp(-2pi i omega tau)
                    sin[2pi(tau+v)]/[pi(tau+v)]d_tau. (4)

Split the sine into its two exponentials. For either nonzero a=2pi(1-omega) or a=2pi(-1-omega), integration by parts, with both finite endpoints retained, gives

    |integral_W^V exp(ia tau)/(tau+v)d_tau|
       <=[1/(W+v)+1/(V+v)
                       +integral_W^V(tau+v)^(-2)d_tau]/|a|
       =2/[|a|(W+v)].                                 (5)

Combining the two phases yields

    |(EG)^hat(-v)|
       <=1/[pi²(1-omega²)(W+v)]
       <=4/[3pi²(W+v)].                               (6)

Therefore

    <G,A G> <=16/(9pi^4 W).

By (1)-(3), and integration over xi in[-1,1], the ACTUAL selected-head channels obey

    ||K_(j,lambda,V)-K_(j,lambda,W)||_HS²
       <= C_tail²/W,
    C_tail²=128/(9pi^4),                               (7)

uniformly lambda>0, j>=2 and V>W>0. The same bound holds for any orthogonal restriction of the source coordinates. Thus for each fixed support and label, these finite-collar channels have a Hilbert--Schmidt limit as V tends to infinity, and their distance from that auxiliary limit is <=C_tail/sqrt(W).

This auxiliary half-line channel is a mathematical comparison operator. Equation (7) does not replace u(t/j) by its finite-interval value outside the original visible collar: only the exact compact-source Fourier representation is extended in the comparison. The actual arithmetic pairing remains on its original finite interval.

## 3. Fixed-collar transfer from the endpoint measure

Let

    rho_lambda=(1/lambda)sum_(chi_n>=1/2)
                    chi_n² e_n(lambda)² delta_(delta_n),
    delta_n=(nu_n-c²)/lambda².

The endpoint-flow theorem supplies weak convergence to the finite measure

    d_rho(delta)=1_(delta<=4log3)
                  kappa(delta)[1-kappa(delta)]d_delta/8,
    kappa(delta)=(1+exp(delta/4))^(-1).                 (8)

The finite measures have mass at most2, by their bounded-vector spectral representation. Their negative tails are tight. The eventual threshold bound also gives delta_n<=3pi for all selected modes.

We need one exact global bound to pass the deep negative-delta tail through a FIXED collar. If nu_n<c², the real normalized exterior mode has the Sonin quantity

    S(t)=H_n(t)² + [P(t)/(k²t²-nu_n)]H_n'(t)²,
    P=t²-lambda², k=2pi lambda.

After factoring out its constant Fourier phase, all terms are real. The differential equation (P H_n')'+(k²t²-nu_n)H_n=0 gives

    S'(t)=-[P'/P+(k²t²-nu_n)'/(k²t²-nu_n)]
               [P/(k²t²-nu_n)]H_n'(t)² <=0.

At t=lambda, the second term tends to zero and S(lambda)=H_n(lambda)². At nu_n=c² the coefficient ratio is1/k² and H_n'(lambda)=0, giving the same conclusion. Consequently

    |H_n(lambda+tau/lambda)/H_n(lambda)|<=1
             for all tau>=0 whenever delta_n<=0.      (9)

The nonzero endpoint follows from regularity and uniqueness of the modal ODE. On each fixed compact delta interval, the exact scaled regular equation gives uniform normalized convergence to Phi_delta(tau), for tau in[0,W], with error O_(D,W)(lambda^-2), as derived in the ideal-model note.

For fixed W, write

    I_(lambda,n,W)(omega)
       =integral_0^W [H_n(lambda+tau/lambda)/H_n(lambda)]
                           exp(-2pi i omega tau)d_tau,
    I_(delta,W)(omega)
       =integral_0^W Phi_delta(tau)exp(-2pi i omega tau)d_tau.

Then exactly

    ||K_(j,lambda,W)||_HS²
       =integral_-1^1 integral |I_(lambda,n,W)(xi/j)|²
                                     d_rho_lambda d_xi. (10)

For delta<-D the integrand is at most W² by (9), so tightness controls that tail uniformly in large lambda. On[-D,3pi], compact normalized convergence and weak convergence (8) pass (10) to the ideal finite-collar integral. The limiting negative-delta profile also obeys |Phi_delta|<=1, by the same compact limit or its limiting Sonin identity.

This convergence is uniform for omega in[-1/2,1/2]. For fixed W, (9) and the compact positive-delta interval give a common bound M_W on normalized profiles. Thus |I|<=W M_W and |partial_omega I|<=pi W² M_W. The resulting squared integrals are equi-Lipschitz; a finite-grid argument upgrades pointwise convergence to uniform convergence. In particular,

    sup_(j>=2) | ||K_(j,lambda,W)||_HS²
                         -||K_(j,ideal,W)||_HS² | ->0   (11)

for each FIXED W. No moving-label asymptotic is used: all labels enter through omega=xi/j in the same fixed compact interval.

## 4. Identifying the ideal half-line limit without an improper-integral shortcut

Taking the fixed-W,V limit of the same argument in (7), the ideal finite-collar channels satisfy

    ||K_(j,ideal,V)-K_(j,ideal,W)||_HS<=C_tail/sqrt(W).

Hence they converge in Hilbert--Schmidt norm to an ideal half-line channel. The limit is the explicit Abel-Laplace kernel from the model note. To justify identification without assuming pointwise convergence of undamped integrals, for epsilon>0 use the Bochner identity

    K_(j,ideal,epsilon)
       =epsilon integral_0^infinity exp(-epsilon W)
                                      K_(j,ideal,W)d_W.

The uniform HS boundedness and Cauchy limit imply that this Abel average tends in HS norm to the same half-line channel. At each fixed delta,xi its kernel is the damped Laplace transform of Phi_delta and has the explicit boundary limit. An almost-everywhere convergent subsequence identifies the HS limit with that kernel. No finite upper boundary is discarded before its norm has been charged by (7).

Thus the admitted ideal computation gives, uniformly j>=2,

    ||K_(j,ideal,infinity)||_HS²
       =4(log4-3/4)[2j atanh(1/j)]/(32pi²)
       <=H²:=4(log4-3/4)[4atanh(1/2)]/(32pi²).         (12)

## 5. Uniform diagonal bound on the actual growing collar

Let W_lambda be ANY positive sequence tending to infinity. For every fixed W0 and all sufficiently large lambda, (7) gives

    sup_(j>=2)||K_(j,lambda,W_lambda)||_HS
       <=sup_(j>=2)||K_(j,lambda,W0)||_HS
                                      +C_tail/sqrt(W0).

Use (11), then the ideal tail bound and (12), to obtain

    limsup_(lambda->infinity) sup_(j>=2)
                       ||K_(j,lambda,W_lambda)||_HS
       <=H+2C_tail/sqrt(W0).

Finally let W0 tend to infinity. This proves the proposed ACTUAL single-channel result

    limsup_(lambda->infinity) sup_(j>=2)
                       ||K_(j,lambda,W_lambda)||_HS² <=H². (13)

The quantifiers are sequential and require no rate in the endpoint-flow theorem. This includes W_lambda=(1+loglambda)^6.

Combining (13) with the independently reviewed actual-channel Bessel reduction, for J=O((1+loglambda)^8), the literal finite low-label pairing on the established trace-null source space satisfies the proposed bound

    |B_low(u,g)|
      <=[4Hsqrt(zeta(2)-1)+o(1)]||u||||g||,
    4Hsqrt(zeta(2)-1)=0.42745366538649... .             (14)

The o(1) is support-uniform on these source/test unit balls, with no effective onset claimed. Existing actual outside-collar and middle/high-label estimates may then be combined separately, after independent audit, against the sufficient main reserve tending to a number greater than0.4910.

Equation (14), even if admitted, concerns the trace-null coordinate map. It does not remove the original origin/source-endpoint repair directions, their correctly whitened Schur coupling, the signed energy reserve, or the correct gamma-orthogonal complement requirement. It is not the global support-uniform Weil floor and does not prove RH.
