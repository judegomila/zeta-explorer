# Independent audit: additive endpoint-null value frame

> Curated mathematical source or internal audit. All mathematical sections are retained. Historical producer headers may predate acceptance; current claim scope follows the paired audit and module, not those old workflow labels. Original and published SHA-256 identities are recorded in the dependency inventory. Internal review is not external peer review.

30 October 2026. **PASS for the eventual ADDITIVE-norm value statement, with unknown onset and the producer's explicit exclusions.**

Frozen producer: `repo_leverage/ADDITIVE_THRESHOLD_ENDPOINT_NULL_VALUE_FRAME.md`, SHA256 `62cff67c897596caf6dfab6f8b09a1e71975aafe6ff643f33aec6ff2fe794b4c`.

The eventual range `0<=nu_n<=c^2+3c/2` is taken from the separately frozen and independently audited threshold/Sonin packet. This receipt checks the additional endpoint-leakage, complete divided-difference, additive synthesis, and first-sampler arguments. No numerical experiment is used.

## 1. Fourier normalization and exact metric

Here `c=2pi lambda^2`, `k=2pi lambda`, and the zero-extended additive-orthonormal h_n have physical truncated-Fourier eigenvalues chi_n. Thus the Fourier exterior H_n, not its chi-divided analytic continuation, has positive-half-line leakage

    integral_lambda^infinity |H_n(t)|^2 dt=(1-chi_n^2)/2=d_n/2.

For an even combination f the change of variables `t=lambda exp(s)` gives exactly

    integral_0^infinity |Uf(s)|^2 ds
       =2 integral_lambda^infinity |Ff(t)|^2 dt
       =sum d_n |a_n|^2 <=sum |a_n|^2.

All scalar spectral weights and coefficient Cauchy--Schwarz estimates in the producer have the correct physical normalization. The final result is not an estimate in the exterior-deficit-whitened input norm.

## 2. Endpoint-to-leakage constant

For `P=t^2-lambda^2`, `z=sqrt(P)H_n`, the potential is

    Q=k^2+(c^2-nu_n)/P+lambda^2/P^2.

The common Fourier endpoint asymptotic gives the limiting energy `A^2=|h_n(lambda)|^2/pi^2`. There is no chi denominator. The admitted spectral range gives the exact one-well lower bound `Q_min>=7k^2/16` in the supercritical case.

On `t>=2lambda`, direct differentiation gives the stated bounds `k^2/2<=Q<=3k^2/2`. Bounding `|c^2-nu_n|` by `c^2+3c/2`, and using that t/P^2 and t/P^3 decrease, gives precisely

    |Q'|/(4Q)
      <=2/(9lambda)+1/(6pi lambda^3)+1/(27pi^2 lambda^5)
      <=1/(3lambda),  lambda>=2.

For `E=|z|^2+|z'|^2/Q`, the identities `E'=-Q'|z'|^2/Q^2` and `(QE)'=Q'|z|^2` prove the needed LOWER bound `E>=A^2/4`. In the subcritical case `QE>=k^2 A^2`. After a supercritical minimum, `E>=A^2`; before it, `QE>=Q_min E(t_min)>=Q_min A^2`, giving `E>=7A^2/24` in the far range. All directions of monotonicity are correct.

For real mode phase, `z=r sin(theta)`, `z'=r sqrt(Q) cos(theta)` gives

    theta'=sqrt(Q)+(Q'/(4Q))sin(2theta),
    k/2<=theta'<=2k.

Changing variable to theta on `[2lambda,3lambda]` therefore yields

    integral sin^2(theta) dt
       >=lambda/8-1/(4k)>=lambda/16.

Since `r^2>=A^2/4` and `P<=8lambda^2` there, `d_n/2>=A^2/(512lambda)`. Consequently

    |h_n(lambda)|^2<=256pi^2 lambda d_n.              (A)

The constant and both factors of two check. An arbitrary complex combination is handled later by coefficient Cauchy--Schwarz, not by applying this real-mode Prüfer argument to the combination.

## 3. Spectral-difference row

The reference label `r=4 floor((floor S-1)/4)` is positive-even, qualifying, and strictly subcritical, with `0<c^2-nu_r<10c`; the strict assertion also holds if `r+1=S`. The separate `dyadic_deficit/SPECTRAL_RANGE_AUDIT.md` checks this using the extended BK action on both sides of c^2, including the n>=2 restriction and elementary n=0,1 exceptions.

The stronger admitted eventual upper range permits the producer's convenient bound

    |nu_n-nu_r|<=c[26+2beta log(10/d_n)]
                    <=12c(1+beta)log(10/d_n).

The independent all-depth moment estimate in `dyadic_deficit/DYADIC_DEFICIT_BANDS_AND_MOMENTS.md` is `sum_H d_n log^2(10/d_n)<=60beta+100`, which in particular proves the producer's weaker `128(1+beta)` bound. No new local-band count, fixed-epsilon asymptotic, or maximum modal-count estimate is required for this step.

Multiplication with (A) proves the row estimate with exactly the advertised safe constant

    sum_head |h_n(lambda)|^2 |nu_n-nu_r|^2
       <=C0 lambda c^2(1+beta)^3,
    C0=256pi^2*144*128.                               (B)

## 4. Complete divided differences and Green bounds

Every regular prolate endpoint is nonzero. With `F_n=H_n/h_n(lambda)`, the common asymptotic is

    sqrt(P)F_n=sin(kt)/pi+O(t^-1),
    (sqrt(P)F_n)'=k cos(kt)/pi+O(t^-1).

For `W=(F_n-F_r)/(nu_n-nu_r)`, direct subtraction gives

    (P W')'+(k^2 t^2-nu_r)W=F_n.

The transformation `Z=sqrt(P)W` gives forcing `F_n/sqrt(P)`, not F_n/P or any other factor. The reference potential has real sine/cosine Jost solutions with Wronskian of magnitude k. The same energy bound gives each solution absolute value at most `4/sqrt7`; its far derivative is at most `sqrt(24/7) k`. Hence its Green kernel and t derivative are bounded by `32/(7k)<5/k` and `32sqrt(3/2)/7<6`, respectively.

The Fourier-mode envelope is `|F_n|<=4/(pi sqrt7 sqrt(P))`. On `t>=2lambda`,

    integral_t^infinity ds/P(s)<=4/(3t),
    sqrt(P)>=sqrt3*t/2.

These give the value coefficient `160/(3pi sqrt21)<4` in

    |F_n-F_r|<=4|nu_n-nu_r|/(k t^2).                  (C)

For clarity, independently differentiating Z/sqrt(P) gives the derivative coefficient

    64/(pi sqrt21)+640/(9pi sqrt21*k*t)<5<10,

because `kt>=4pi lambda^2>=16pi`. Thus the producer's derivative constant 10 is also safe, although a near-edge derivative theorem does not follow from this far-range bound.

The potentials differ from k^2 by an integrable function at infinity, so their ordinary Jost solutions exist. The divided difference has zero outgoing sine AND cosine amplitudes, including derivative asymptotics; its absolutely convergent Green integral is therefore the complete solution. There is no omitted homogeneous term or finite endpoint-jet approximation.

## 5. Global endpoint-null combination, all samplers, and ledger

The single condition `sum a_n h_n(lambda)=0` removes F_r from the ENTIRE sum. Cauchy--Schwarz in the additive coefficients, (B), and (C) give

    |Ff(t)|^2<=16 R_lambda ||f||add^2/(k^2 t^4).

Multiplying by 2t and using `c=k lambda` gives exactly

    |Uf(s)|^2<=32C0(1+beta)^3 exp(-3s)||f||add^2,
    s>=log2.

Integration against exp(2ys) has denominator `3-2y>2`, uniformly for real `|y|<1/2`, and proves the producer's far-tail bound. The exact sampler change of variables contributes `m^(-1-2y)`; this cancels the y-dependence of the tail exponent and gives m^-4.

At m=1, the near interval `[0,log2]` is bounded by `2||Uf||^2<=2||f||add^2`, and the far interval uses the pointwise bound. No radial derivative or low-index approximation is needed for this VALUE estimate.

The repaired notation `F_(W,y,ADD)^ctr` explicitly denotes row synthesis on `ell^2(W;ker eta,||.||add)`. Each two-branch sampler has squared norm at most `C lambda(1+beta)^3 m^-4`. Cauchy--Schwarz in the sampler index proves the corresponding block bound by the sum of these numbers. For the dyadic window W_j, `|W_j|=2^j` and `sum_(m in W_j)m^-4<=2^(-3j)`, so the ledger's square-root terms decay as 2^-j and are summable. The raw repository profile `Phi=U/(2sqrt2)` introduces exactly 1/8 in its UNWHITENED Gram.

## 6. Accepted scope and remaining limits

Accepted: an eventual, dimension-uniform, additive-input endpoint-null VALUE frame on the full positive Fourier threshold head; complete far divided differences; the hard first sampler for values; and a centered additive ledger of size `C lambda(1+beta)^3`.

Not accepted or claimed: an evaluated onset, a deficit-whitened frame, a near-edge derivative/translation modulus, removal of origin or mean repairs, trace directions outside ker eta, signed arithmetic cancellation, gamma-orthogonality, a small defect budget, Gram/Weil positivity, or RH. The stated upper bound is not the signed estimate needed to close those later steps. No old low-prefix theorem has been applied merely because a high-index band has small cardinality.

The frozen producer makes these distinctions explicitly. No unresolved mathematical defect in the stated additive value theorem was found.
