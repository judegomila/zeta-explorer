# Bandwidth-scale repairs and the full mean-zero deep-head Weil action

> Curated mathematical source or internal audit. All mathematical sections are retained. Historical producer headers may predate acceptance; current claim scope follows the paired audit and module, not those old workflow labels. Original and published SHA-256 identities are recorded in the dependency inventory. Internal review is not external peer review.

30 October 2026. **Producer theorem; independent review requested.** This is a separate actual-action transfer. It uses the newly accepted full-head coordinate Gram only for output normalization, not as a substitute for an energy estimate. No complement lower bound or RH conclusion is obtained.

## 1. Proposed theorem

Fix A>4, put a=lambda^(-A), and let G_(lambda,A) be the actual positive-even prolate modes with concentration deficits delta_n=1-chi_n^2<=a, intersected with mean zero. Impose NO source-origin or source-endpoint trace conditions. For the literal physical image

    F_g=S E_raw g on[-loglambda,loglambda],

the proposed estimate is, eventually,

    ||H_lambda F_g||
       <=C_A lambda^(2-A/2)(1+loglambda)^(3/2)||F_g||.  (1)

Here H_lambda is the actual fixed-support 5/4-normalized Weil operator. In particular A=6 gives O(lambda^-1 log^(3/2)lambda) on the complete mean-zero selected image, without the two previous trace deletions. The guaranteed-prefix dimension is the accepted

    lambda^2-(A/pi^2)log^2lambda+O_A(loglambda),

with only the mean condition removed. The support onset and constants are not made effective.

## 2. Two deep-head trace bounds

Use b_n=e_n(lambda), c=2pi lambda^2, k=2pi lambda, and the accepted subcritical reference r with 0<c^2-nu_r<10c. The accepted restricted spectral row is

    R_A=sum_(delta_n<=a)|b_n|^2(nu_n-nu_r)^2
         <=C_A lambda c^2 a[log(10/a)]^3.              (2)

Its proof in the accepted head-energy note did not use a source trace condition; the condition was only used afterward in assembling the modal sum.

The same argument, without the differential weight, proves

    sum_(delta_n<=a)|b_n|^2 <=C_A lambda a(1+loglambda). (3)

For completeness choose B=A+6. On lambda^(-B)<=delta<=a use the accepted bound b_n^2<=C_B lambda delta/log c, and the uniform cumulative first moment sum_(delta<=a)delta<=C(1+beta)a log(10/a), beta=O(log c). On delta<lambda^(-B), use b_n^2<=C lambda delta and the same moment bound at lambda^(-B). The latter is smaller than (3). Thus, for b=g(lambda),

    |b|^2<=C_A lambda a(1+loglambda)||g||^2.            (4)

Mean zero gives g(0)=sum(1-chi_n)g_n e_n(0). For delta<=a<1/4,

    (1-chi)^2/[chi^2(1-chi^2)]
       =delta/[chi^2(1+chi)^2] <=a.

The exact concentration-defect diagonal used in the accepted origin lemma is (K-K^2)(0,0)<=2/(pi^2lambda). Hence, for d=g(0),

    |d|^2<=2a/(pi^2lambda)||g||^2.                     (5)

The pole/origin functional is therefore smaller on the deep head than its already sufficient all-head estimate.

## 3. Repairs at width 1/(4lambda), not an arbitrarily thin width

Let w_p=1/(4lambda), and use the fixed polynomial

    rho(t)=(1-t)^4(1+4t-35t^2), 0<=t<=1.

It has rho(0)=1, rho'(0)=0, integral_0^1rho=0, and vanishes to order4 at1. Define the even endpoint profile p by

    p(s)=rho((lambda-|s|)/w_p) for lambda-w_p<=|s|<=lambda,
    p(s)=0 otherwise.

Its sharp extension has endpoint value1, but is smooth at its inner collar edge. Its elementary norms obey

    ||p||_2^2<=C/lambda, ||p'||_1<=C, ||p''||_1<=C lambda. (6)

Here p' and p'' are the ordinary derivatives on the additive interval/interior collar, not distributional derivatives of the sharp zero extension. That extension has endpoint jumps; their Fourier boundary terms and log-image variation are retained explicitly below.

Fix an even smooth eta supported in(-1,1), with eta(0)=1 and integral eta=0, and put eta_lambda(s)=eta(lambda s). Set

    v=g-bp-d eta_lambda.                               (7)

Then v is mean zero, v(0)=v(+-lambda)=0, has continuous zero extension and derivative of bounded variation, and is smooth near0. Thus it belongs to the independently accepted radical source class. Since eta_lambda is invisible to the literal finite arithmetic sum on the log window,

    F_v=F_g-b F_p,
    F_p=S E_raw p.                                    (8)

Choosing a much thinner p would not justify the same weighted-tail bound: its Fourier derivative scale grows like1/w_p. The stated bandwidth-scale choice is part of the proof, not a disposable regularization.

## 4. The repaired exterior Fourier tail keeps the small deficit factor

Normalize ||g||=1 temporarily, and put

    N_A=a[log(10/a)]^3.

Let H=F(g zero-extended), H_p=Fp, and let

    h_r(t)=H_r(t)/b_r,
    P=t^2-lambda^2, z_r(t)=sqrt(P)h_r(t), t>lambda.

The accepted complete divided-difference estimate, now with (2), gives for arbitrary g in the selected head

    |H(t)-b h_r(t)|<=C_A sqrt(N_A)lambda^(3/2)/t^2,
                                                    t>=2lambda. (9)

Indeed subtracting b h_r removes the common reference from sum g_n b_n h_n; the same Cauchy spectral row applies. This is the exact location where the old endpoint-null argument generalizes.

We next compare the reference with the actual repair. Its Liouville equation is

    z_r''+[k^2+Delta_r/P+lambda^2/P^2]z_r=0,
    Delta_r=c^2-nu_r in(0,10c).

The reference potential decreases to k^2. Its unit outgoing Fourier asymptotic is z_r(t)=sin(kt)/pi+O(t^(-1)); the subcritical Sonin identity therefore gives |z_r(t)|<=1/pi. The terminal Volterra formula, with V=Delta_r/P+lambda^2/P^2, yields

    |z_r(t)-sin(kt)/pi|
       <=(1/(pi k)) integral_t^infinity V(s)ds
       <=C lambda/t, t>=2lambda.

Here P>=3t^2/4 on that range, and Delta_r=O(lambda^2). Correcting sqrt(P) to t gives

    |h_r(t)-sin(kt)/(pi t)|<=C lambda/t^2.             (10)

The terminal formula is legitimate because V is integrable at infinity and the modal Fourier endpoint expansion fixes both outgoing asymptotics; it is not an assumed phase matching.

Twice integrating the compact endpoint profile p by parts, with its sharp endpoint term retained, gives by (6)

    |H_p(t)-sin(kt)/(pi t)|<=C lambda/t^2.             (11)

Likewise |F eta_lambda(t)|<=C lambda/t^2 for t>=lambda. Combining (4),(5),(9)--(11),

    |Fv(t)|<=C_A sqrt(N_A)lambda^(3/2)/t^2,
                                                    t>=2lambda. (12)

On the near exterior interval, Plancherel and the actual concentration deficit give

    integral_lambda^(2lambda)|H(t)|^2dt<=a/2.

Applying (6), ||eta_lambda||^2=C/lambda, and (4),(5) to (7),

    integral_lambda^(2lambda)|Fv(t)|^2dt
        <=C_A a(1+loglambda)<=C_A N_A.                (13)

There is no use of a near-edge reference envelope in (13).

Define the actual exterior radial function Uv(s)=sqrt(2lambda)exp(s/2)Fv(lambda exp s), s>=0. Equations (12)-(13) imply

    ||exp(s)R_m Uv||^2<=C_A N_A m^(-4), m>=1.          (14)

For m>=2 this is the direct t^(-2) substitution; for m=1 the near interval costs at most4 times (13) with its full-even normalization. The exact exterior tail profile of S E(v) is

    a_v=(1/(2sqrt2))sum_(m>=1)R_m Uv.

Minkowski and sum m^-2<infinity give the required complete weighted-tail estimate

    ||exp(s)a_v||^2<=C_A N_A.                          (15)

This is a norm of the two-tail profile used in the radical theorem, not merely of one additive Fourier mode.

## 5. Actual action of the endpoint-repair image

The positive additive support intervals of p(ny), n<lambda^2, are

    ((lambda-w_p)/n,lambda/n).

They are pairwise disjoint: for adjacent n,n+1 the condition is (n+1)w_p<lambda, which holds for all relevant n and lambda>=2. Restricting to the visible window preserves disjointness. The logarithmic isometry therefore gives

    ||E_raw p||^2
       <=||p||_(positive half)^2 sum_(n<lambda^2)1/n
       <=C(1+loglambda)/lambda.

Reflection averaging is contractive, so the same bound holds for F_p. For its zero extension in the log coordinate, the total variation is bounded by

    TV(F_p)<=C sqrt(lambda)sum_(n<lambda^2)n^(-1/2)
             <=C lambda^(3/2).                        (16)

To check this bound, differentiate each smooth log bump e^(x/2)p(ne^x), substitute t=ne^x, and use ||p'||_1<=C on t near lambda. Its sharp endpoint jump and any clipped window endpoint contribute at most C sqrt(lambda/n), which is already included. Reflection averaging preserves the bound.

The actual gamma multiplier satisfies |a_gamma(xi)|<=C log(2+|xi|). The BV Fourier bound is |Fhat_p(xi)|<=C TV(F_p)/|xi|. Splitting at T=lambda^5, the low-frequency part and the explicit tail integral give

    ||Gamma F_p||^2
       <=C(1+loglambda)^3/lambda
          +C lambda^3 integral_(lambda^5)^infinity
                              log^2(2+t)t^(-2)dt
       <=C(1+loglambda)^3/lambda.                     (17)

In particular F_p belongs to the actual fixed-support operator domain. The continuum operator on[-loglambda,loglambda] has norm O(lambda) by its row integral. The prime operator has norm at most2 sum_(n<lambda^2)Lambda(n)/sqrt(n)=O(lambda) by the admitted Chebyshev bound. Thus, for sufficiently large lambda,

    ||H_lambda F_p||<=C sqrt(lambda(1+loglambda)).      (18)

The old pole term is not appended: this is the same 5/4 normalization as the accepted action theorem. Equations (4),(18) show that the complete repair action costs only

    |b| ||H_lambda F_p||
       <=C_A lambda sqrt(a)(1+loglambda).             (19)

No generic operator norm O(lambda) is applied to an erroneously large triangle bound for E_raw p; disjointness in (16) is essential.

## 6. Radical action transfer and output normalization

The repaired v belongs to the accepted radical source class. The exact Carleman/continuum/prime tail-to-window theorem, whose proof depends only on that class and the weighted tail norm, gives

    ||H_lambda F_v||<=C lambda ||exp(s)a_v||
                     <=C_A lambda sqrt(N_A)||g||.    (20)

This includes both exterior tails and the full O(lambda) cross-prime charge. It is not an inference from a small quadratic energy. Since F_p and F_v are in the supported operator domain, (8) and linearity combine (19)-(20) to give

    ||H_lambda F_g||
       <=C_A lambda sqrt(a)(1+loglambda)^(3/2)||g||.   (21)

Finally the newly accepted entire mean-zero-head coordinate theorem gives

    ||F_g||>=||g||/(40sqrt2 lambda).

Dividing (21) by this actual output norm proves (1). The two source traces were repaired explicitly and their full action costs paid; no unknown ground-space identification or intertwining was used.

## 7. Boundaries of the conclusion

The theorem concerns the full supported action on this concentration-selected family. It may be used in a head/bridge argument only with that family and its exact physical image. It does not assert a small residual on the entire chi>=1/2 threshold head, which contains transition modes with order-one deficit. Nor does it infer any lower bound on the correctly transformed complement or its inverse Schur charge.

The previous trace-null A4 quadratic-energy theorem is not automatically extended here: a quadratic-energy transfer at A>3 needs its own accounting if that sharper exponent is wanted. The present complete action result requires A>4 and keeps the same rate as the accepted trace-null action theorem. Historical frozen notes and finite support certificates remain unchanged.

## Dependencies

- `POLYNOMIAL_DEFICIT_WEIL_HEAD_ENERGY_TRANSFER.md`, independently accepted: restricted spectral row and cumulative first moments; its trace conditions are not used in proving the row.
- `EXACT_RADICAL_WINDOW_IDENTITY_AND_TWO_TAIL_BRIDGE.md` and `CARLEMAN_TAIL_TO_WINDOW_WEIL_ACTION_TRANSFER.md`, independently accepted: explicit radical domain and general weighted-tail-to-window operator estimate.
- `../repo_leverage/ADDITIVE_THRESHOLD_ENDPOINT_NULL_VALUE_FRAME.md` and the admitted reference/complete divided-difference sources: outgoing reference normalization and far difference bound.
- `../gamma_complement_attack/MEAN_ZERO_ORIGIN_TRACE_AND_MOBIUS_POLE_ABSORPTION.md`: exact concentration-defect diagonal; the stronger deep cutoff form is derived above.
- `../repo_leverage/SHARP_SOURCE_POISSON_AND_ALL_HEAD_COORDINATE_CLOSURE.md`, source SHA256 `fe914fb77a89eeddf77ccc2a425f2653307a15ff84c6fe8640819ac19d2b7faa`, and independent full-head receipts: output normalization only.
