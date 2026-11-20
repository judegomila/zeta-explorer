# Exact physical-head orthogonality and a growing safe complement sector

> Curated analytic source/review. The bundled exact-matched audit supplies the accepted scope; historical producer review-request headers are superseded. No new numerical spectrum replay is claimed. Private operational identifiers are removed, and original-to-published hashes are recorded in SOURCE_PROVENANCE.json.

## 1. Exact orthogonality and finite adjoint inversion

Let ell=loglambda and E=E_even be the actual finite arithmetic map from full additive-even L2[-lambda,lambda] to physical even L2[-ell,ell]. For physical even f its adjoint is

    A_f(y)=0, |y|<1/lambda,
    A_f(y)=1/(2sqrt(|y|)) sum_(n<=lambda|y|)
                  n^(-1/2) f(log(|y|/n)),
                   1/lambda<|y|<lambda.                 (1)

The factor 1/2 is required by the full-even additive norm. It follows by changing y=n exp x in each literal finite summand. Reflection averaging does not change the pairing because f is even.

For the exact positive signed deficit projector Pi_a, put G=ran(Pi_a) intersect 1-perp and F=E G. Then

    f perpendicular F  iff Pi_a A_f=c Pi_a1              (2)

for some scalar c. No T f is inserted: (2) is physical L2 orthogonality. The earlier gamma-form adjoint equation had A_(Tf) because it described a different metric/complement.

There is also a direct finite inverse of (1). Set y=exp x. The raw translation adjoint is

    (T_ar^* f)(x)=sum_(n<=lambda exp x)n^(-1/2)f(x-logn)
                =2exp(x/2) A_f(exp x).

Its exact finite Mobius inverse gives

    f(x)=2exp(x/2) sum_(d<=lambda exp x)
                              mu(d)/d A_f(exp x/d),
                              -ell<x<ell.               (3)

All sums are finite and the lower physical boundary dictates the displayed cutoff. The coefficient is mu(d)/d after the additive Jacobian, not mu(d)/sqrt d. Equations (2),(3) give a correct explicit constraint, but do not by themselves bound the joint gamma-prime form: the negative-sign and nonconcentrated source components of A_f remain uncontrolled. No frame-completeness or favorable prime-sign inference is made.

## 2. A genuine narrow-lobe safe space before projection

Set X=2N, lambda=sqrt(2N),

    b=(logN)/2,
    W=sqrt N (logN)^2,
    h=1/W,
    K=floor(N/(16pi W)).

For sufficiently large N the intervals b+[-h,h] and -b+[-h,h] are disjoint and strictly inside [-ell,ell]. Let G_K be the first K Dirichlet sine modes on [-h,h], zero-extended. Its members belong to H1(R) and obey

    ||g'||<=pi K/(2h)||g||<=N||g||/32.

For g in G_K define

    w_g(x)=2^(-1/2){exp(iN(x-b))g(x-b)
                    +exp(iN(-x-b))g(-x-b)}.              (4)

The two summands have disjoint physical support, w_g is even, and ||w_g||=||g||. Denote their K-dimensional space by W_N.

### Actual gamma lower bound

Each lobe has carrier +N or -N. Plancherel and the envelope derivative estimate give

    ||1_(|t|<N/2) what_g(t)||_2^2
       <=8N^(-2)||g'||^2<=||w_g||^2/128.                (5)

Using the accepted bounds a(t)>=log(2+|t|)-C and a(t)>=a_min, split at |t|=N/2. It follows that

    Gamma_lambda[w_g]
       >=[(127/128)logN-C]||w_g||^2.                    (6)

This is a form bound for every linear combination in W_N, not just for separate sine basis vectors.

### Actual prime correlations, including the positive possibility

For large N, 2h<log2. Thus same-lobe correlations vanish at every positive prime-power shift. Cross-lobe correlations can occur only when

    |log n-logN|<=2h.

For those shifts, Cauchy--Schwarz gives |R_w(log n)|<=||w||^2/2. The ACTUAL prime term therefore obeys

    P_prime[w]
       <=||w||^2 sum_(Nexp(-2h)<=n<=Nexp(2h)) Lambda(n)/sqrt n
       <=C logN (sqrt N h+N^(-1/2))||w||^2
       <=C/(logN)||w||^2.                              (7)

Only the elementary integer count and Lambda(n)<=logn are used. This is valid for the actual signs, even when the prime energy is positive; it is not a P<=0 cone argument. The interval lies below X=2N, and endpoint atoms are harmlessly included.

On the even physical space the accepted continuum decomposition is

    C_cont=2|cosh(x/2)><cosh(x/2)|-E_decay,
    0<=E_decay<=4I.

Thus C_cont>=-4I. Combining this with (6),(7) gives, for every w in W_N,

    H_lambda[w]>= (1/2)logN ||w||^2                   (8)

eventually. No PNT, Mellin recurrence, prime-pair correlation, or numerical spectrum is used.

## 3. Project onto the EXACT physical complement

Let P be physical projection onto the accepted critical-power-four actual-E head F, Q=I-P, and eta_lambda=O((1+ell)^(-2)) its full actual action residual:

    ||H_lambda P||<=eta_lambda.

For w in W_N, every vector belongs to the actual operator/form domain, so selfadjointness gives

    H_lambda[Qw]
      =H_lambda[w]-2Re <H_lambda Pw,w>+H_lambda[Pw]
      >=H_lambda[w]-3eta_lambda||w||^2.

Equations (8) and eta_lambda=o(1) imply

    H_lambda[Qw] >= (1/4)logN ||w||^2
                  >=(1/4)logN ||Qw||^2.                (9)

In particular Q is injective on W_N: if Qw=0, the first inequality in (9) forces w=0. Therefore

    dim(QW_N)=K asymptotic to sqrt N/[16pi(logN)^2],
    H_lambda|_(QW_N) >=(1/4)logN                       (10)

as quadratic forms. This is a genuinely growing uniformly positive subspace of the TRUE physical complement, with the actual head projection performed, not assumed negligible.

## 4. Relation to the packet residue and exact limit of the result

The earlier finite-R_N packet differs from its full corrected zeta/E-image by a small endpoint contribution at physical positions approximately +/-logN/2. Such endpoint contributions motivate (4), but the theorem does NOT assume an unproved asymptotic equality for that residual. It directly tests the actual narrow-lobe/carrier candidate and its whole low-envelope-mode span.

The candidate cannot be a negative ground direction even after physical head removal: its logarithmic gamma cost is large, while its support geometry permits only a very short interval of actual prime shifts. The continuum lower bound and actual head off-block residual are retained in (9).

This does not cover arbitrary complement vectors, broad lobes, phase-aligned long prime-jump graphs, or high-envelope modes outside G_K. Orthogonality (2) alone still gives no general sign. There is no all-complement negative-magnitude improvement, zero-free strip, or RH conclusion. The strongest unresolved task remains a joint signed gamma-prime bound on complement vectors not in such controlled support/frequency sectors; neither the adjoint inversion nor a frame-completeness assertion has supplied it.

Dependencies: accepted actual 5/4 multiplier and continuum decomposition; the exact finite-map/adjoint conventions in `EXACT_COMPLEMENT_AND_NESTED_FRAME_CROWDING.md` with metric changed explicitly to physical L2; and the accepted `../weil_radical_tail_attack/CRITICAL_POWER_FOUR_LOG_TUNED_ACTUAL_ACTION_HEAD.md` for ||H P||<=eta. All bounds (3)--(10) are derived directly above.
