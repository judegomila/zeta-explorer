# Independent audit: bandwidth-scale trace repairs and full deep-head actual action

> Curated mathematical source or internal audit. All mathematical sections are retained. Historical producer headers may predate acceptance; current claim scope follows the paired audit and module, not those old workflow labels. Original and published SHA-256 identities are recorded in the dependency inventory. Internal review is not external peer review.

30 October 2026. **PASS.** This is an independent analytic review of the actual action transfer, not an inference from the coordinate Gram theorem.

Final producer: `weil_radical_tail_attack/TRACE_REPAIRS_AT_BANDWIDTH_SCALE_AND_FULL_DEEP_HEAD_ACTION.md`, SHA256 `b1440ac746cdc6819010735b74bc78b55d44a24b82f32897c76129f3215bd1f6`.

One requested domain clarification was applied before acceptance: p' and p'' in the bump's L1 estimates are the ordinary derivatives on the additive interval/interior collars, NOT the distributional derivatives of its sharp zero extension. Its endpoint jumps are explicitly retained in the Fourier and variation arguments. No bound or theorem changed. The earlier unaccepted source hash was 3d83248bdced641981269a60824a802f722c886ab109c4fd3ea1d0b831750e4e.

## Accepted theorem and scope

Fix A>4 and let g belong to the full mean-zero positive-even prolate head with concentration deficits delta_n=1-chi_n^2<=lambda^-A. No source-origin or source-endpoint trace is deleted. For the literal supported physical output F_g=S E_raw g,

    F_g is in Dom(H_lambda),
    ||H_lambda F_g|| <= C_A lambda^(2-A/2)(1+log lambda)^(3/2)||F_g||

eventually, with unspecified onset and constants. H_lambda is the actual selfadjoint operator of the fixed-support 5/4-normalized Weil form. This is its FULL action, including components outside the chosen head, not merely a small head quadratic compression.

At A=6 the rate is O(lambda^-1 log^(3/2)lambda). A guaranteed-prefix dimension is lambda^2-(A/pi^2)log^2(lambda)+O_A(log lambda), with only the mean condition removed. The coordinate Gram makes its physical image injective.

No action estimate on all transition modes with chi>=1/2 is asserted. No correct physical/gamma-complement floor, inverse Schur charge, ground identification, cofinal Weil floor or RH conclusion follows. This does not automatically extend the sharper trace-null A4 ENERGY theorem. Historical frames, certificates and papers are unchanged.

## 1. Deep source traces are independently small

The accepted restricted spectral row

    R_A=sum_(delta<=a)|e_n(lambda)|^2(nu_n-nu_r)^2
         <=C_A lambda c^2 a log^3(10/a), a=lambda^-A

is a spectral sum; its proof never imposed a trace condition on g. Its reuse is therefore legitimate.

For the unweighted endpoint trace choose B=A+6. On lambda^-B<=delta<=a, the logarithmic leakage estimate gives b_n^2<=C_B lambda delta/log c. The uniform KRD first moment is O(a log^2 lambda); division by log c leaves O(lambda a log lambda). On deeper deficits the global b_n^2<=C lambda delta and the first moment at lambda^-B give O(lambda lambda^-B log^2 lambda), smaller than the preceding bound. Consequently

    |g(lambda)|^2 <= C_A lambda a(1+log lambda)||g||^2.

For the origin, mean zero gives g(0)=sum(1-chi_n)g_n e_n(0). If delta<=a<1/4, then chi^2>=3/4 and

    (1-chi)^2/[chi^2(1-chi^2)]
      =delta/[chi^2(1+chi)^2] <=a.

For example the denominator is at least (3/4)(3/2)^2=27/16>1. The exact physical concentration-defect diagonal (K-K^2)(0,0)<=2/(pi^2lambda) then proves

    |g(0)|^2 <=2a/(pi^2lambda)||g||^2.

This is a genuine stronger deep-head trace bound, not a generic bandwidth evaluation estimate.

## 2. The repair's exact support, width and domain

The endpoint profile uses w_p=1/(4lambda), rho=(1-t)^4(1+4t-35t^2). Direct exact checks give rho(0)=1, rho'(0)=0, integral rho=0, a fourth-order inner zero, and integral rho^2=20/143. Thus ||p||_2^2=10/(143lambda); the ordinary interior derivative estimates are ||p'||_1=O(1), ||p''||_1=O(lambda).

The sharp zero extension of p itself jumps at the two outer endpoints and is NOT globally H1. That jump is harmless here because it is never erased: it fixes the sine/t Fourier term and is included in the image variation. For b=g(lambda), d=g(0),

    v=g-bp-d eta(lambda*.)

has mean zero, zero origin and endpoint values, continuous zero extension and derivative of bounded variation. It is C2 near zero. Thus v lies in the separately audited finite-regularity radical source class. Its constants may depend on the finite support/head for the domain assertion; no uniform derivative bound is needed there.

The origin bump is supported in |s|<1/lambda and is invisible to every literal finite arithmetic sample in the physical window. Hence

    F_v=F_g-b F_p, F_p=S E_raw p

exactly. There is no uncharged origin image, change of physical support, or replacement of the canonical map. The width 1/(4lambda), rather than an arbitrarily thin regulator, is essential to the uniform Fourier estimates below.

## 3. Repaired Fourier tail: no misuse of a trace-null prolate theorem

Write h_r=H_r/b_r for the admitted subcritical same-phase reference and b=g(lambda). The complete divided-difference estimate applies to each h_n-h_r. Algebraically

    H_g-b h_r=sum g_n b_n(h_n-h_r),

whether or not b vanishes. Cauchy--Schwarz with R_A and the complete bound |h_n-h_r|<=4|nu_n-nu_r|/(k t^2) gives

    |H_g(t)-b h_r(t)| <=C_A sqrt(N_A)lambda^(3/2)/t^2,
    N_A=a log^3(10/a), t>=2lambda.

Thus the repaired nonprolate source v is not incorrectly treated as though it remained in the selected prolate band.

The normalized reference has outgoing Liouville amplitude sin(kt)/pi. Its positive decreasing potential gives |z_r|<=1/pi by the Sonin energy. Since Delta_r=c^2-nu_r=O(lambda^2), the terminal Volterra formula against the constant-frequency Green kernel yields |z_r-sin(kt)/pi|<=C lambda/t on t>=2lambda. The correction from sqrt(t^2-lambda^2) to t is O(lambda^2/t^3), bounded by O(lambda/t^2) on this range. Therefore

    |h_r(t)-sin(kt)/(pi t)|<=C lambda/t^2.

For p, both endpoints in Fourier integration by parts give exactly the same sine/t coefficient; p'(lambda)=0 and the interior second derivative costs O(lambda). Hence |H_p-sin(kt)/(pi t)|<=C lambda/t^2. The smooth origin bump obeys |F eta_lambda(t)|<=C lambda/t^2 as well.

Combining these three differences with the two deep trace bounds proves

    |Fv(t)|<=C_A sqrt(N_A)lambda^(3/2)/t^2, t>=2lambda.

On lambda<t<2lambda, the original g has exact half-line exterior concentration mass <=a||g||^2/2. Plancherel on p and eta_lambda, together with their trace coefficients, bounds the repaired mass by C_A a(1+log lambda)||g||^2<=C_A N_A||g||^2. No near-edge reference envelope or derivative sum is substituted here.

For Uv(s)=sqrt(2lambda)e^(s/2)Fv(lambda e^s), the far estimate gives |Uv(s)|^2<=C_A N_A e^-3s. Thus the exact sampler R_m gives

    ||e^s R_m Uv||^2<=C_A N_A m^-4, m>=2.

For m=1 the near interval contributes a fixed factor times the just-proved repaired exterior mass. The 2 in Uv's full-even normalization is included in that constant. The exact two-tail profile is a_v=(2sqrt(2))^-1 sum R_m Uv. Minkowski with sum m^-2<infinity then gives

    ||e^s a_v||^2<=C_A N_A||g||^2.

This is an actual complete arithmetic-tail estimate, not merely a single Fourier-mode bound or a formal weighted translation estimate outside its allowed weight range.

## 4. Disjoint arithmetic image and its actual operator-domain action

For each integer n<lambda^2 the positive additive support of p(ny) is ((lambda-w_p)/n,lambda/n). Adjacent intervals are disjoint when (n+1)w_p<lambda. With the stated width and lambda>=2, even the upper estimate (lambda^2+1)/(4lambda)<lambda suffices. Restriction to the visible window preserves disjointness.

The physical log L2 norm is therefore an orthogonal sum of these raw bumps, not the square of their triangle sum:

    ||E_raw p||^2<=||p||_(positive half)^2 sum_(n<lambda^2)1/n
                   <=C(1+log lambda)/lambda.

Reflection averaging is contractive. For the zero-extended log image, differentiating each smooth bump contributes O(sqrt(lambda/n)); its sharp outer jump and any clipped window endpoint have the same bound. Summing gives TV(F_p)=O(lambda^(3/2)). Reflection averaging does not increase this variation. All jumps are retained.

The full gamma multiplier is O(log(2+|xi|)). Below T=lambda^5, its squared L2 norm is bounded by O(log^2 lambda)||F_p||^2. Above T, the BV estimate gives O(lambda^3) integral_T^infinity log^2(2+t)t^-2 dt. These yield

    ||Gamma F_p||^2<=C(1+log lambda)^3/lambda.

In particular the full Fourier multiplier belongs to L2, establishing the actual fixed-support gamma operator-domain membership. The fixed-support continuum kernel has row norm O(lambda); the actual prime-shift norm is <=2 sum_(n<lambda^2)Lambda(n)/sqrt(n)=O(lambda) by the already admitted Chebyshev estimate. No extra old pole is appended to the 5/4 normalization. Hence

    F_p in Dom(H_lambda),
    ||H_lambda F_p||<=C sqrt(lambda(1+log lambda)).

Multiplying by |b| gives a complete repair action O_A(lambda sqrt(a)(1+log lambda))||g||, smaller than the retained logarithmic tail budget. An O(lambda) operator norm applied to an incorrect large triangle bound for E_raw p would not establish this result; disjointness is essential.

## 5. Radical action transfer, both tails and physical normalization

The independently accepted radical theorem is used only on v, which has the required finite regularity and all repaired traces. It is a continuous paired-form theorem on a declared weighted Sobolev class, NOT a global ordinary-L2 Weil closure. Its compact central restriction F_v is in the actual fixed-support operator domain.

The already audited general tail-to-window bound depends only on that legal radical identity and the weighted profile, not on v being a prolate sum. It includes the touching-boundary gamma Carleman operator (no a_v(0)=0 assumption), both continuum tails and every prime translation. In particular its genuine bound is O(lambda)||e^s a_v||; the growing cross-prime cost is retained. Therefore

    ||H_lambda F_v||<=C_A lambda sqrt(N_A)||g||.

Since F_g=F_v+b F_p and both summands are in the operator domain, linearity, the last estimate and the explicit repair action give

    ||H_lambda F_g||<=C_A lambda sqrt(a)(1+log lambda)^(3/2)||g||.

Only at this final normalization step is the separate full-head coordinate Gram used:

    ||F_g||>=||g||/(40sqrt(2)lambda).

The second factor lambda is therefore explicit. Dividing gives lambda^(2-A/2)(1+log lambda)^(3/2), and A=6 gives lambda^-1(1+log lambda)^(3/2). This controls the full physical action for every complex combination in the selected image, including its off-head component. It says nothing about the sign or size of the external complement by itself.

## Evidence and preserved boundaries

`deep_trace_repair_checks/check_repair_algebra.py` and `DEEP_TRACE_REPAIR_ALGEBRA.json` give 17 independent exact checks: rho normalization/moments/inner derivatives and L2 integral, disjoint-support slack, deep trace denominator, reference integral, sampler power, gamma logarithmic tail integral, and actual-output exponents. They are elementary symbolic checks only; no spectral computation was run. A JSON serialization issue in development was fixed by converting SymPy booleans to ordinary booleans; every mathematical check passed before and after that formatting fix.

The accompanying receipt verifies the unchanged accepted domain/row/Carleman/full-coordinate sources and pins this new final source separately. It does not overwrite the trace-null action theorem or claim the coordinate Gram alone proved an energy bound. A4-energy extension and all complement/cofinal conclusions remain outside this receipt.
