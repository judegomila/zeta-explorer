# Explicit zeta packets lie asymptotically in the actual positive-E head

> Curated analytic source/review. The bundled exact-matched audit supplies the accepted scope; historical producer review-request headers are superseded. No new numerical spectrum replay is claimed. Private operational identifiers are removed, and original-to-published hashes are recorded in SOURCE_PROVENANCE.json.

## 1. Precise result

Use the packet, fixed envelope phi and fixed theta in (1/2,1) from `BANDLIMITED_ZETA_PACKETS_REFUTE_FOUR_M_GATE.md`, SHA256 `b1196415a51cd8e4eeb3308837eae34a5b9ad68fe6b84e59ca08b5ec31a7dce9`. Thus

    X=2N, lambda=sqrt(2N), ell=loglambda, W=N^theta,
    A_N(t)=phi((t-N)/W) exp(-it logN/2),
    F_N(t)=A_N(t)R_N(t)+A_N(-t)R_N(-t),
    R_N(t)=sum_(n<=N)n^(-1/2+it).

Let f_N be the inverse unitary angular Fourier transform of F_N. It is even and supported strictly inside [-ell,ell]. The accepted packet theorem gives ||f_N||^2=2W(logN+O(1)).

On additive even L2[-lambda,lambda], let

    C_lambda=P_lambda mathcalF P_lambda,
    (mathcalF v)(y)=integral_R v(u)exp(2pi iuy)du,
    a_lambda=lambda^(-4)(1+ell)^(-7),
    Pi_a=1_{chi>0,1-chi^2<=a_lambda}(C_lambda),
    G_lambda=ran(Pi_a) intersect 1-perp,
    F_lambda=E_even G_lambda.

These are exactly the signed prolate cutoff and actual image in the accepted critical-power-four action theorem. No different unsigned concentration space is substituted. Let P_head denote PHYSICAL L2 projection onto F_lambda. Then

    ||(I-P_head)f_N|| <= C_(phi,theta) sqrt(W/N),
    ||(I-P_head)f_N||/||f_N|| <= C_(phi,theta)/sqrt(N logN).  (1)

In particular the normalized packet mass outside the actual known head is O(1/(N logN)). Neither a sign nor an action bound is asserted for that small remainder after renormalizing it.

## 2. A source packet with the correct 2pi carrier

Let k be the inverse unitary angular Fourier transform of phi. Choose the original phi so k is real even C_c^infinity(-1,1); this is exactly the envelope choice already allowed in the packet theorem. Put b=logN/2 and

    p_N(x)=W exp(iN(x-b)) k(W(x-b)),
    v_N(u)=u^(-1/2)p_N(logu), u>0,
    v_N(-u)=v_N(u).

Then p_N has Fourier transform A_N. The additive source v_N is supported near the two points +/-sqrt N, with relative log width 1/W and additive width O(sqrt N/W). It vanishes near zero and near +/-lambda. Moreover

    ||v_N||_(L2(R))^2=2||p_N||_(L2(R))^2=2W.

The source phase N log(u/sqrt N) has additive Fourier carrier magnitude N/(2pi sqrt N)=sqrt N/(2pi), not sqrt N. Both the source position sqrt N and its Fourier carrier sqrt N/(2pi) lie a fixed fraction inside lambda=sqrt(2N).

Here is the needed MOVING-ENVELOPE estimate. On the positive source lobe set u=sqrt N exp(z/W), |z|<=1. Its Fourier integral, and that of the reflected lobe, have amplitude

    N^(1/4) k(z) exp(z/(2W))

and phases

    Phi_+(z)=(N/W)z+2pi y sqrt N exp(z/W),
    Phi_-(z)=(N/W)z-2pi y sqrt N exp(z/W).

For |y|>=lambda,

    |Phi_+'(z)|, |Phi_-'(z)|
       >= c (N/W)(1+|y|/sqrt N).

Their higher derivative ratios are uniformly bounded (indeed each additional derivative introduces 1/W), while the amplitude derivatives in z are uniformly bounded after factoring N^(1/4). Repeated nonstationary integration by parts therefore yields, for every fixed K,

    |mathcalF v_N(y)|
       <=C_K N^(1/4)(N/W)^(-K)(1+|y|/sqrt N)^(-K),
       |y|>=lambda.                                  (2)

At y=0 the same argument has phase derivative exactly N/W and proves

    |integral_R v_N|<=C_K N^(1/4)(N/W)^(-K).           (3)

Because theta<1 is FIXED, N/W=N^(1-theta) tends to infinity by a fixed power. Thus (2),(3) beat every prescribed power of N after choosing K large enough. This explicitly includes the W-dependent source derivatives; no fixed-amplitude assertion is being used in the original u variable.

Choose a fixed smooth even h, supported away from zero, with integral h=1, and set

    nu_N=integral v_N,
    v=v_N-nu_N h.

For large N its support remains in [-lambda,lambda]. It has EXACT mean zero and v(0)=0. Its norm is sqrt(2W)+o(1). Its Fourier tail retains all superpolynomial bounds: for every B>0, after increasing constants,

    ||1_(|y|>lambda) mathcalF v||_2
       +||1_(|y|>lambda) mathcalF v||_1 <=C_B N^(-B),
    |mathcalF v(y)|<=C_B N^(-B)(1+|y|/lambda)^(-3),
                                      |y|>lambda.     (4)

The fixed correction's Fourier transform is Schwartz, and nu_N itself beats every power, so it causes no tail loss.

## 3. Positive signed-prolate projection and exact mean repair

Write C=C_lambda, P=P_lambda, Q=I-P, and restrict to additive even functions. Here mathcalF is a selfadjoint unitary involution, not a Fourier transform with a missing 2pi. Since v=Pv,

    (I-C^2)v=P mathcalF Q mathcalF v,
    ||(I-C^2)v||<=||Q mathcalF v||.                    (5)

Take the actual positive symmetrization

    g_1=(I+C)v/2.

For a C-eigenvalue chi not in the selected positive head, the ratio of its g_1 coefficient to its (I-C^2)v coefficient is

    (1+chi)/(2(1-chi^2))=1/[2(1-chi)].

For chi<=0 this is at most1/2. For chi>0 and 1-chi^2>a_lambda it is at most1/a_lambda. Eigenvalue chi=-1, if considered, contributes zero to g_1. Hence

    ||g_1-Pi_a g_1||<=a_lambda^(-1)||(I-C^2)v||=O_B(N^(-B))

for every B, because a_lambda^(-1)=O(N^2 log^7N) is only polynomial times logarithmic.

The mean of g_1 is also superpolynomially small. Fourier inversion and v(0)=0 give integral_R mathcalF v=0, so

    integral g_1=-(1/2) integral_(|y|>lambda)mathcalF v(y)dy.

Equation(4) controls this exactly. Passing to g_2=Pi_a g_1 changes the mean by at most sqrt(2lambda)||g_2-g_1||, still superpolynomial.

To repair the mean INSIDE the selected head we need a genuine lower bound on ||Pi_a1||; it is not assumed. Let q(u)=exp(-pi u^2), whose additive Fourier transform is q, and q_lambda=Pq. Then

    ||C q_lambda-q_lambda||<=||Qq||<=C exp(-c lambda^2).

On the excluded spectrum, |1-chi|>=a_lambda/2. Therefore

    ||q_lambda-Pi_a q_lambda||<=2a_lambda^(-1)C exp(-c lambda^2).

It follows that integral Pi_a q_lambda tends to integral q=1. By Cauchy--Schwarz and bounded ||q_lambda||,

    ||Pi_a1||>=c_0>0                                  (6)

for all sufficiently large N. Define

    g=g_2-[(integral g_2)/||Pi_a1||^2] Pi_a1.

Then g belongs to the EXACT mean-zero positive head G_lambda, and

    ||g-g_1||=O_B(N^(-B))                             (7)

for every B. No source trace conditions are imposed on g, in agreement with the accepted full-source action head.

## 4. Actual finite E transfer: no condition-number shortcut

For any source w supported in [-lambda,lambda], the literal finite arithmetic map on the log window is

    E_raw w(x)=exp(x/2)sum_(n>=1)w(n exp x),
    E_even w=(E_raw w(x)+E_raw w(-x))/2.

Only n<=lambda^2 occur there. Each nth summand has operator norm at most n^(-1/2) from additive positive L2 to logarithmic L2. The triangle inequality gives the sufficient bound

    ||E_even w||<=2lambda||w||.                       (8)

Thus (7) transfers to superpolynomial output error even with the ACTUAL map. No coordinate-Gram inverse or spectral-angle assumption is used.

Since v is even, smooth, compactly supported, and has v(0)=integral v=0, ordinary Poisson summation gives on the full log line

    E_raw(mathcalF v)(x)=E_raw v(-x),
    E_even(mathcalF v)=E_even v.                       (9)

There is no pole or origin correction left in (9); the two exact zero conditions are why the earlier mean repair was made. All Fourier-side arithmetic sums are absolutely convergent here.

Replacing mathcalF v by its truncation C v=P mathcalF v in (9) costs only a superpolynomial amount on the physical log window. Indeed (4) gives, uniformly for |x|<=ell,

    exp(x/2)sum_(n exp x>lambda)|mathcalF v(n exp x)|
       <=C_B N^(-B) exp(x/2)sum_(n exp x>lambda)
                                      (1+n exp x/lambda)^(-3)
       <=C_B N^(-B)lambda exp(-x/2)
       <=C_B N^(-B)lambda^(3/2).

The L2 integration adds only sqrt(2ell). Since B is arbitrary, the result remains smaller than every prescribed power. Therefore (7)--(9) imply

    ||E_even g-E_even v||=O_B(N^(-B))                 (10)

for every B, as actual finite-window physical outputs. This is where the Fourier-compressed source and the full Fourier source are distinguished; their difference is paid explicitly, not silently discarded.

## 5. Matching the literal packet and concluding physical projection

Put p_h(x)=exp(x/2)h(exp x) and A_h=Fourier(p_h). Since v is exactly mean zero, its full arithmetic image is the critical-line zeta multiplier (the pole-subtracted Muntz identity has zero subtraction here):

    Fourier(E_raw v)(t)=zeta(1/2-it)[A_N(t)-nu_N A_h(t)].

The image belongs to L2; this also follows from the source's smoothness and its zero mean/origin. Its evenization has half the sum of this expression and its reflection. The correction nu_N zeta A_h has superpolynomial L2 norm, because A_h is fixed Schwartz and the zeta multiplier has polynomial growth.

On t in [N/2,2N], the already proved long-cutoff estimate gives

    |zeta(1/2-it)-R_N(t)|<=C N^(-1/2).

Since integral |A_N|^2=W, the squared difference norm on that interval is O(W/N). Outside it, the Schwartz envelope, |R_N|<=2sqrt N, and the unconditional bound |zeta(1/2-it)|<<1+|t|^(1/4) give an error smaller than every prescribed power. Thus, on the full log line,

    ||f_N-2E_even(full) v||<=C sqrt(W/N).              (11)

Restricting the second term to [-ell,ell] cannot increase the difference, since f_N itself is supported there. Combining (10),(11), there exists the explicit head vector

    h_N=2E_even g in F_lambda

with

    ||f_N-h_N||<=C sqrt(W/N).

Physical orthogonal projection is the best approximation in this finite-dimensional image. Equation(1) follows immediately after dividing by ||f_N||~sqrt(2WlogN).

## 6. Consequence and remaining signed problem

These packets are not merely low-energy in the abstract: their physical distance to the ACCEPTED ACTUAL near-null head tends to zero at the quantitative rate (1). Thus their large positive `4M` clipped-tail charge mostly comes from a sector already intended to be retained as the head. Removing it by a full-space positive-symbol norm bound was the wrong geometry.

What is NOT established: the sign of the normalized residual (I-P_head)f_N; a bound on its Weil action inferred from its small L2 norm; a complement floor; a principal-angle bound for arbitrary dangerous vectors; or a signed estimate for arbitrary inputs. H_lambda is unbounded, so the small L2 error cannot be converted into an action error without additional work.

The useful next route is genuinely head-projected signed compression (or its exact Schur feedback), not a lower choice of strong clipping constants. The proof here licenses projection for this explicit microlocal family only.

Dependencies: the accepted packet's uniform Euler truncation and norm; exact additive Poisson/Muntz identities already pinned in `FULL_SCATTERING_AND_FINITE_WINDOW_DEFECT_DICTIONARY.md` and the accepted actual radical source; and the definition of the accepted head in `../weil_radical_tail_attack/CRITICAL_POWER_FOUR_LOG_TUNED_ACTUAL_ACTION_HEAD.md`. The latter's action estimate is NOT used to infer membership: all projection estimates are proved independently above.
