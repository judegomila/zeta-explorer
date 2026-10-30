# Critical power-four cutoff for the actual action head

> Curated analytic source/review. The bundled exact-matched audit supplies the accepted scope; historical producer review-request headers are superseded. No new numerical spectrum replay is claimed. Private operational identifiers are removed, and original-to-published hashes are recorded in SOURCE_PROVENANCE.json.

## 1. Exact operator, subspace, and result

Let H_lambda be the fixed-support 5/4-normalized Weil operator on X_lambda=L2_even[-loglambda,loglambda]. For an additive source g let F_g=E_even g=S E_raw g, using the literal finite arithmetic map. Put w=1+loglambda. For a fixed r>0 choose

    a_lambda=lambda^(-4) w^(-(3+2r)),
    G_lambda=span{e_n:chi_n>0,1-chi_n^2<=a_lambda} intersect 1-perp,
    F_lambda=E_even G_lambda.

No source trace is deleted. The proposed refinement is

    ||H_lambda F|| <= C w^(-r)||F||, F in F_lambda,     (1)

eventually, with unspecified onset. In particular r=2 gives the concrete cutoff lambda^(-4)w^(-7) and residual O(w^(-2)).

The accepted coordinate Gram is used only to ensure injectivity and normalize this actual output norm. It does not supply the action estimate.

## 2. Uniform cutoff form of the accepted repair proof

The final accepted bandwidth-repair source is `TRACE_REPAIRS_AT_BANDWIDTH_SCALE_AND_FULL_DEEP_HEAD_ACTION.md`, SHA256 `b1440ac746cdc6819010735b74bc78b55d44a24b82f32897c76129f3215bd1f6`. Its stated fixed-A version can be made uniform for all

    lambda^(-5)<=a<=lambda^(-3)                         (2)

without invoking an A depending on lambda. Here is the explicit verification of that quantifier change.

Use a SINGLE fixed deep split b=lambda^(-11), and the already accepted fixed-exponent endpoint/action-strip constants for exponent11. On b<=delta<=a, the restricted row proof gives

    sum b_n^2(nu_n-nu_ref)^2
       <=C lambda c^2 a[log(10/a)]^3
       <=C lambda c^2 a w^3,

because the cumulative moment factor beta=O(log c) is canceled by the logarithmic endpoint gain1/log c. On delta<b use the global endpoint estimate and the first moment, giving at most

    C lambda c^4 lambda^(-11)w^2.

Relative to lambda c^2 a w^3 this is at most C lambda^(-2)/w, since c^2=O(lambda^4) and a>=lambda^(-5). Thus the full row is uniformly bounded by C lambda c^2 a w^3 throughout (2). The same no-weight calculation gives the uniform trace bound

    |g(lambda)|^2<=C lambda a w ||g||^2.

The exact mean-zero origin bound is uniformly |g(0)|^2<=2a/(pi^2lambda)||g||^2. All remaining repair constants in the accepted proof depend only on its fixed polynomial rho, fixed eta, and the reference gap0<c^2-nu_ref<10c. Its endpoint width is still exactly1/(4lambda). No constant in those steps depends on a.

Consequently that proof establishes the UNIFORM estimate

    ||H_lambda F_g|| <=C lambda sqrt(a) w^(3/2)||g||,
    ||F_g||>=||g||/(40sqrt2lambda),

and hence

    ||H_lambda F_g||/||F_g||
                  <=C lambda^2 sqrt(a) w^(3/2)        (3)

for every mean-zero source in the selected deficit<=a head, uniformly over (2). The repaired source is only an auxiliary radical representative; F_g remains the unrepaired actual arithmetic image.

For any fixed r, a_lambda in section1 eventually lies in (2). Substitution into (3) gives lambda^2 sqrt(a_lambda)w^(3/2)=w^(-r), proving (1). This is not an application of the old fixed-A theorem with A silently tending to4.

## 3. Exact guaranteed-prefix rank

Use the independently checked KRD prefix with

    beta=(2/pi^2)log(200lambda^2+25),
    n<=floor(4lambda^2)-7-beta log(10/a_lambda),
    n divisible by4.

Its signed positive modes have the required deficit. The actual Gram makes the mean-zero output injective. Counting these labels yields

    dim F_lambda >=lambda^2-(4/pi^2)log^2lambda
       -((3+2r)/pi^2)loglambda*log(1+loglambda)
       +O_r(loglambda).                              (4)

The O term denotes a two-sided bounded counting remainder in this explicit prefix; one can equivalently state a lower bound with -C_r loglambda. Only the mean restriction costs a dimension. Thus the leading logarithmic-squared loss is4/pi^2, not the6/pi^2 of the earlier A6 choice. The smaller loglog term pays the desired vanishing action rate.

## 4. What this buys, and what it cannot buy

For any fixed shift M>0 and large lambda, the physical head compression has reserve

    <F,(H_lambda+M)F> >=(M-Cw^(-r))||F||^2.

Also the physical off-head bridge satisfies

    ||Q_phys H_lambda P_phys||<=Cw^(-r),

where P_phys is the orthogonal L2 projection onto F_lambda. These follow from the actual operator estimate (1), not from the coordinate Schur theorem. The full threshold head chi>=1/2 is NOT claimed near-null.

The correctly projected complement remains an independent operator inequality. A separate note records its precise gamma-coordinate geometry and a genuine actual-prime obstruction to termwise absolute estimates. No lower floor on that complement, cofinal support-uniform Weil lower bound, or RH conclusion follows from (1)--(4).
