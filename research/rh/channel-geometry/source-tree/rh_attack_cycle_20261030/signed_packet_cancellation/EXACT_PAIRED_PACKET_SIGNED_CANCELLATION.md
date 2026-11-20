# Exact paired-packet cancellation and a signed small-window test

30 October 2026. **New local analytic reduction; independent review pending.**

## Result and boundary

For a fixed small even envelope window, moving two reflected packets toward the ends of a growing physical window cancels BOTH the exponentially large pole/prime continuous main term and the first exponentially small pole/gamma cross term exactly. The pullback of the actual Weil form is

    J_b* H_ell J_b = H_delta - Delta_b - C_b.             (1)

Here H_delta is the actual strictly positive small-window form already covered by the accepted even endpoint; Delta_b is an explicitly localized, SIGNED actual prime-excess operator; and C_b is an explicitly positive, geometrically convergent rank-one series. There is no Mobius inverse or coefficient-to-physical Gram transfer in (1).

This is a restricted-family reduction, not positivity of that family or of the whole physical complement. The missing estimate is an upper Loewner bound on the actual signed Delta_b in the H_delta metric. PNT magnitude does not furnish it. The pole/continuous-prime cancellation itself is already in the repo's weighted-PNT normal form, and the broad-packet independent audit already matched its leading constants: the new result here is its exact two-packet, small-window, positive-Gram cross-kernel factorization and a scalar-port/complement test. A sharp physical projection-loss lemma is also proved below.

## 1. Domain, normalization, and actual prime inventory

Let 0<delta<(log 2)/2, b>delta, and ell>b+delta. Let X_delta be the complex reflection-even L2 space on (-delta,delta), with zero extension. Its logarithmic form domain consists of the vectors with

    integral log(2+|t|) |psihat(t)|^2 dt < infinity.

Use the unitary angular Fourier transform. Initially psi is even C_c^infinity; the identities extend to this form domain. Set

    (J_b psi)(x)=[psi(x+b)+psi(x-b)]/sqrt(2),
    m_alpha(psi)=integral_(-delta)^delta cosh(alpha x)psi(x)dx,
    R_psi(s)=integral_R psi(x+s)conj(psi(x))dx.

The two packet supports are disjoint, so J_b is an isometry into the even physical window (-ell,ell). For complex even psi, R_psi is real and even. The actual form is the audited normalization

    H_ell[f]=Gamma_(1/4)[f]-P_ell[f]+2|m_(1/2)(f)|^2,
    P_ell[f]=2 sum_(n<exp(2ell)) Lambda(n)/sqrt(n) R_f(log n).

A prime power at exp(2ell) contributes zero; the strict convention is harmless for the form but the inventory must be recorded consistently. Because 2delta<log 2, no nontrivial actual prime shift couples a packet to itself. For r>=log 2,

    R_(J_b psi)(r)=R_psi(r-2b)/2,
    P_ell[J_b psi]=sum_n Lambda(n)/sqrt(n) R_psi(log n-2b). (2)

Only exp(2b-2delta)<n<exp(2b+2delta) can contribute, and every such label is strictly below exp(2ell). Endpoint values of the correlations vanish. The sum retains all actual prime powers, not a continuous substitute.

On X_delta let S_s denote the clipped zero-extension translation by s. Define the bounded selfadjoint even-preserving operator

    X_b=(1/2) sum_n Lambda(n)/sqrt(n) (S_(log n-2b)+S_(log n-2b)*),
    Delta_b=X_b-exp(b)|c_(1/2)><c_(1/2)|,
    c_alpha(x)=cosh(alpha x).                           (3)

Thus X_b[psi] is exactly (2), including its coefficient 1 rather than 2. Individual X_b need not be positive semidefinite.

## 2. Exact two cancellations, with a positive residual Gram

The archimedean multiplier a_alpha(t)=Re digamma(alpha+it/2)-log pi has off-diagonal kernel

    -k_alpha(|x-y|),  k_alpha(r)=exp(-2alpha r)/(1-exp(-2r)).

Equivalently its multiplier increment is 2 integral_0^infinity k_alpha(r)(1-cos(tr))dr. The singular diagonal is retained in Gamma; only the separated cross-packet kernel is used here. Since b>delta it is bounded on the cross rectangle. For alpha=1/4,

    k_(1/4)(r)=exp(-r/2)+sum_(j>=0) exp(-(5/2+2j)r).

Reflection-evenness makes the two exponential moments at +alpha and -alpha equal, including for complex psi. Expanding the separated cross term therefore gives EXACTLY

    Gamma_(1/4)[J_b psi]
      =Gamma_(1/4)[psi]-exp(-b)|m_(1/2)(psi)|^2-C_b[psi],
    C_b=sum_(j>=0) exp(-(5+4j)b)|c_(5/2+2j)><c_(5/2+2j)| >=0. (4)

This includes the factor from the two cross terms and the 1/sqrt(2) packet normalization. Meanwhile

    2|m_(1/2)(J_b psi)|^2
      =[exp(b)+2+exp(-b)]|m_(1/2)(psi)|^2.              (5)

The exp(-b) terms in (4),(5) cancel. Finally the exact continuous main identity is

    integral_R exp(s/2)R_psi(s)ds=|m_(1/2)(psi)|^2.       (6)

Hence exp(b)|m_(1/2)(psi)|^2 is the continuous prime main integral for (2); subtracting it defines Delta_b but makes no PNT assertion. On the small window there are no primes, so

    A:=H_delta=Gamma_(1/4)+2|c_(1/2)><c_(1/2)|.

Combining (2)--(6) proves (1). In particular, the actual scale-exp(b) prime Rayleigh quotient in the frozen broad-packet obstruction cannot by itself imply a negative signed form: its main term is exactly canceled here.

All cross series converge in operator norm. For C_(b,J) retaining j=0,...,J-1, put d=b-delta>0. Since ||c_alpha||^2<=2delta exp(2alpha delta),

    0<=C_b-C_(b,J)<=epsilon_(b,J) I,
    epsilon_(b,J)=2delta exp(-(5+4J)d)/(1-exp(-4d)).       (7)

This is a GEOMETRIC remainder, not the factorial conductor-boundary remainder from the earlier co-Poisson note. One may use the exact norm delta+sinh(2alpha delta)/(2alpha) for sharper individual terms. The same formulas polarized give all cross-column entries, not just diagonal Rayleigh values. Boundedness of the cross kernel and of every finite prime sum extends (1) from the smooth core to the full logarithmic form domain.

## 3. Exact signed test and the role of the new Gram theorem

Because exp(delta)<sqrt(2)<sqrt(33/2), restriction of the internally independently replayed whole-even result gives A>=a_delta I for some a_delta>0. No numeric value of a_delta is inferred from a certificate pivot. The compressed gamma form has compact resolvent: its logarithmic Fourier weight tends to infinity, and Fourier cutoffs restricted to a finite physical window are compact. Adding bounded finite-rank terms preserves this property.

Consequently

    K_b=A^(-1/2)(Delta_b+C_b)A^(-1/2)                   (8)

is a bounded compact selfadjoint operator. The actual paired form has a strict A-relative gap epsilon>0 precisely when K_b<=(1-epsilon)I. An upper bound K_b<=I gives nonnegativity. For this compact K_b, positivity on every nonzero form-domain vector also implies some strict A-relative gap: its top spectral value cannot approach 1 without attaining it. This is a test, NOT a claim that it passes.

The current adaptive retained-Gram theorem can retain positive columns in any proposed finite matrix lower comparison and pay their exact PSD residual. It does not manufacture an upper bound on the signed Delta_b. Here the remaining positive pole correction has only ONE direction. More explicitly, put

    L_b=A-C_b-X_b, e=c_(1/2)/||c_(1/2)||, Q_m=I-|e><e|.

The actual pullback is L_b+exp(b)||c_(1/2)||^2 |e><e|. On the moment-neutral subspace ker m_(1/2), the positive correction is identically zero. If the compression

    D_m=Q_m L_b Q_m

is coercive there, the usual exact block Schur factorization says that the whole paired form is coercive if and only if

    <e,L_b e>+exp(b)||c_(1/2)||^2
        -<Q_m L_b e,D_m^(-1)Q_m L_b e> >0.              (9)

Here e belongs to the logarithmic operator domain (its zero extension has O(1/|t|) Fourier decay), so the displayed off-diagonal vector is in L2. If D_m has a nonpositive direction, no positive multiple of the pole column repairs that direction. On every finite envelope compression, the reviewed rank theorem makes this exact: a positive rank-one correction can repair at most one nonpositive direction of L_b. It is not legitimate to certify only the large pole-aligned witness and ignore the moment-neutral compression.

Formula (9) narrows the unresolved signed statement to an actual small-window neutral compression plus one scalar Schur port; it does not prove either. D_m is defined by a closed semibounded form, not by an assumed commuting moment projection.

## 4. Sharp joint physical-head projection payment

Let H be any selfadjoint operator, P a finite physical orthogonal projection with ran(P) subset Dom(H), and ||HP||<=eta. Let Q=I-P. Then the bounded selfadjoint correction

    R=PH+HP-PHP

obeys the SHARP universal bound

    ||R||<=2eta/sqrt(3).                               (10)

This replaces the rough 3eta triangle payment while retaining the joint operator.

Proof: relative to P direct-sum Q, write R=[[A0,B*],[B,0]]. The assumption gives A0^2+B*B<=eta^2 I. For lambda=2eta/sqrt(3)>0, the Schur complement of lambda I-R is bounded below by

    lambda I-A0-B*B/lambda
      >=[(A0-lambda I/2)^2+(3lambda^2/4-eta^2)I]/lambda>=0.

The same proof for -R replaces A0 by -A0. Eta=0 is immediate. Equality is attained in a two-dimensional model with A0=eta/sqrt(3), B=eta sqrt(2/3); R has eigenvalues 2eta/sqrt(3) and -eta/sqrt(3). Thus no smaller universal constant follows from ||HP|| alone.

For the accepted physical actual-E head P_ell, use its established action norm eta_ell, not a small Rayleigh quotient. Then

    J_b* Q_ell H_ell Q_ell J_b=A-Delta_b-C_b-J_b*R_ell J_b. (11)

This is the ACTUAL physical projection. It is not the gamma-coordinate projection; no T^(1/2) or T^(-1/2) complement is substituted. Every Q_ell J_b psi is in the true physical complement, and its finite-arithmetic adjoint condition is inherited by orthogonality. No global co-Poisson completion is asserted for arbitrary L2 inputs outside the previously proved multiplier domain.

If the right side of (1) is at least rho I with rho>2eta_ell/sqrt(3), then Q_ell J_b is injective and its range is a positive actual complement sector with floor at least rho-2eta_ell/sqrt(3). This gives no bound on the orthogonal complement of that sector and no coverage claim.

## 5. Concrete finite matrix gate (not run as an endpoint search)

Choose actual even envelope columns psi_1,...,psi_r in the small-window form domain. Use their physical Gram G, NOT a rational label coefficient norm. Form the Hermitian matrices

    A_ij=H_delta[psi_i,psi_j],
    D_ij=<psi_i,Delta_b psi_j>,
    C^J_ij=sum_(k=0)^(J-1) exp(-(5+4k)b) conj(m_(5/2+2k)(psi_i))m_(5/2+2k)(psi_j).

Every D entry uses the actual finite prime-power inventory from (2), and the signed exp(b) outer product is combined before enclosure. Equation (7) gives 0<=C-C^J<=epsilon_(b,J)G even for nonorthogonal columns. Thus the explicit sufficient matrix gate is

    A-D-C^J-[epsilon_(b,J)+2eta_ell/sqrt(3)]G >= rho G, rho>0. (12)

It proves precisely the positive projected finite sector, not a full complement. For approximate columns, the sign is essential: the preceding reviewed LOWER-Gram theorem applies only to a correction that is ADDED, such as +exp(b)cc*. It must NOT be used as an upper enclosure for the SUBTRACTED C_b. The exact C^J+epsilon G upper enclosure in (12) is valid. Alternatively, for C=ZZ*, a genuine bound ||R^(-1/2)(Z-Zhat)||<=e with R>0 yields the reverse-Young UPPER payment C<=(1+tau)Zhat Zhat*+(1+1/tau)e^2 R for tau>0. Entrywise upper endpoints are not Loewner bounds. For a full X_delta result one additionally needs certified omitted-envelope blocks and tails in (8) or (9). Finite positive matrices are not enough.

## 6. Exact blocker and next honest port

For fixed psi the prime-number theorem gives the leading continuous main in (2), so Delta_b[psi]=o(exp(b)) as b tends to infinity. This is far weaker than the O(1) signed upper bound needed against the fixed small-window A[psi]. For all envelopes at once, the needed Loewner/energy estimate is stronger still. Bounding the finite prime sum and exp(b) pole separately destroys (6) and returns an exponential-in-support loss. The elementary signed discrepancy magnitude alone is known not to provide the missing orientation; the repo's weighted-PNT normal form and signed-Riesz-history synthetic obstruction were inspected before this derivation.

The earlier FINITE_MOBIUS_INVERSE_COST_SURVIVES_HEAD_REMOVAL producer note derives an order-lambda inverse cost after any finite physical head removal. Its curated status is still pending independent audit, so it is background rather than an accepted dependency of the new proof; no inverse bound from it is used here. The new formula avoids that inverse entirely, but replaces its apparent conditioning problem by the explicit, unresolved actual prime-excess inequality. This is not a proof that the latter is easier or independent of RH-strength information.

The useful next port is therefore a validated JOINT matrix/relative-form upper estimate for Delta_b on moment-neutral envelopes, with the scalar feedback in (9) retained, rather than another absolute prime norm or a larger broad rational packet grid. The exact Gram C_b is already controlled by (7); it is not the asymptotic blocker. No clipped-negative aggregate, support-uniform gamma-relative constant gap, new endpoint, cofinal positivity, or RH conclusion is claimed.

The accompanying one-point triangle-envelope diagnostic independently compares literal prime translation correlations, direct separated gamma-kernel quadrature, pole integration, and (1). It is a floating diagnostic, not an interval certificate or a positivity test. A separate exact algebra check verifies sharpness of (10). Dependencies and frozen-history hashes are recorded separately.
