# Additive-norm value frame on the maximal positive Fourier head

> Curated mathematical source or internal audit. All mathematical sections are retained. Historical producer headers may predate acceptance; current claim scope follows the paired audit and module, not those old workflow labels. Original and published SHA-256 identities are recorded in the dependency inventory. Internal review is not external peer review.

30 October 2026. **Analytic derivation independently reviewed; receipt pinned separately.** No signed arithmetic inequality is claimed. This is a new additive-input-norm estimate, not the old exterior-deficit-whitened theorem.

## 1. Statement and the metric distinction

Put `c=2pi lambda²`, `k=2pi lambda`, `S=2c/pi`, and

    beta=(2/pi²)log(100c/pi+25).

Let `B_lambda=span{h_n:n divisible by4, chi_n>=1/2}`, with h_n orthonormal in additive L²([-lambda,lambda]), zero extended. Write

    f=sum a_n h_n,  ||f||add²=sum|a_n|²,
    e_n=h_n(lambda), d_n=1-chi_n²,
    eta(f)=sum a_ne_n, H=Ff.

Define the exact exterior isometry into the DEFICIT norm by

    Uf(s)=sqrt(2lambda)e^(s/2)H(lambda e^s), s>=0,
    ||Uf||²=D(f)=sum d_n|a_n|²<=||f||add².

For all sufficiently large lambda (unknown onset), all real |y|<1/2, all M>=2, and all f in B_lambda with eta(f)=0,

    integral_(log M)^infinity e^(2ys)|Uf(s)|² ds
       <= C(1+beta)^3 M^(-3+2y)||f||add².                 (1)

With `R_m g(s)=1_(s>=0)m^(-1/2)g(s+log m)` and `M_yg=e^(ys)g`,

    ||M_yR_mU|ker eta||_(add->L²)²
       <= C(1+beta)^3 m^(-4), m>=1.                      (2)

The corresponding centered value sampler ledger has bound

    (sum_j sqrt(|W_j| F_(W_j,y,ADD)^ctr))²
       <= C lambda(1+beta)^3, W_j=[2^j,2^(j+1)) cap N.   (3)

Here `F_(W,y,ADD)^ctr` is defined as the squared operator norm of the centered row synthesis in section6, on `ell²(W;ker eta,||.||add)`. It is NOT the deficit-whitened block Gram denoted by similar notation in the frozen repository theorem. The absolute C is uniform in lambda, y, M and the number of retained modes. Thus the flat order-c modal count is removed for this VALUE estimate. The input norm on the right is ADDITIVE; replacing it by D(f) is not licensed. No derivative/translation estimate, origin repair, nonmodal column, signed edge bound, or gamma-complement lower bound is supplied.

## 2. Admitted eventual spectral range

The separately frozen and independently audited `EVENTUAL_THRESHOLD_SONIN_EXTENSION.md` proves that every threshold mode eventually satisfies

    0<=nu_n<=c²+3c/2.                                    (4)

This is uniform over the whole moving head, with unspecified onset. Work henceforth at lambda>=2 beyond that onset.

## 3. Endpoint-to-leakage bound survives the one-well extension

For an individual Fourier exterior H_n, set P=t²-lambda², z=sqrt(P)H_n and

    Q=k²+(c²-nu_n)/P+lambda²/P²,
    Henergy=|z|²+|z'|²/Q,
    A=|e_n|/pi.

The endpoint Fourier asymptotics give Henergy(infinity)=A². For nu<=c² the potential decreases; for nu>c² it has one minimum Qmin>=7k²/16. On t>=2lambda, direct substitution gives

    k²/2 <= Q <= 3k²/2,
    |Q'|/(4Q)<=1/(3lambda).                              (5)

For clarity, a crude bound proving the derivative assertion is

    |Q'|/(4Q)
      <=2/(9lambda)+1/(6pi lambda³)+1/(27pi²lambda^5)
      <=1/(3lambda).

Using `Henergy'=-Q'|z'|²/Q²` and `(Q Henergy)'=Q'|z|²`, one obtains everywhere on this far range

    Henergy>=A²/4.                                       (6)

Indeed the subcritical case has `QHenergy>=k²A²`; the supercritical range after the minimum has Henergy>=A²; before the minimum, `QHenergy>=Qmin Henergy(tmin)>=Qmin A²` and Q<=3k²/2. The last ratio is at least7/24>1/4.

Choose the real mode phase and Prüfer variables `z=r sin theta`, `z'=r sqrt(Q)cos theta`. Equation (5) implies

    k/2<=theta'<=2k.

On [2lambda,3lambda], the phase length is at least k lambda/2, so change of variables with its endpoint error gives

    integral sin²theta dt >=lambda/8-1/(4k)>=lambda/16.

Since r²>=A²/4 and P<=8lambda² there,

    d_n/2=integral_lambda^infinity |H_n(t)|²dt
          >= A²/(512lambda).

Thus the old constant remains valid on the larger eventual range:

    e_n² <=256pi² lambda d_n.                            (7)

This derivation uses the FOURIER transform exterior, not its chi-divided analytic continuation; no extra chi factor belongs in (7).

## 4. A uniform spectral-difference row from deficit weights

Choose the reference label

    r=4 floor((floor S-1)/4).

It lies less than five labels below S, and the concentration midpoint bound gives chi_r²>=1/2. Exact elliptic-action quantization implies nu_r<c² and

    c²-nu_r<10c.                                        (8)

For n>=2 with nu_n<c², the extended action

    J(v,c)=(2/pi) integral_0^min(1,sqrt(v)/c)
                   sqrt[(v-c²x²)/(1-x²)]dx

satisfies `n<J(nu_n,c)<n+1` and `J_v>=1/(2c)` below c². Hence

    c²-nu_n<2c(S-n).

The uniform leading-side KRD deficit bound implies

    S-n <=8+beta log(10/d_n).                            (9)

If n is above its specified leading-side index range, then S-n<1 and (9) is automatic. For n=0,1, the elementary estimate c²-nu_n<=c² and lambda>=2 imply the same ensuing upper bound, since `2c(S-n)>=c²`. Combining (4), (8), (9),

    |nu_n-nu_r| <= c[26+2beta log(10/d_n)]
                 <=12c(1+beta)log(10/d_n).               (10)

No fixed-ratio-band O(log c) count is needed here. The UNIFORM cumulative KRD theorem and layer cake give

    sum_(d_n<=1/2) sqrt(d_n)
      <=2^(-1/2){beta[log20+2]+7}.

On the head's remaining range 1/2<d_n<=3/4, its cardinality is at most `beta log(80/3)+9` (the two endpoint allowances are harmless). Since

    d log²(10/d)<=7sqrt(d), 0<d<=3/4,

we get the explicit safe aggregate

    sum_head d_n log²(10/d_n)<=128(1+beta).               (11)

All sign/parity classes may be counted on the left when applying the cumulative theorem, so restricting to n divisible by4 only helps. These estimates hold for arbitrarily deep deficits; there is no loglambda cutoff in j.

Equations (7), (10), (11) yield

    R_lambda:=sum_head e_n²(nu_n-nu_r)²
       <= C0 lambda c²(1+beta)^3,
    C0=256*pi²*144*128.                                  (12)

The deficit factors in (11)-(12) are essential. Dividing them away would restore the old large-rank problem.

## 5. Complete far-tail divided differences

Put `F_n=H_n/e_n`; all same-phase normalized profiles have common outgoing asymptotic `sqrt(P)F_n=sin(kt)/pi+O(t^-1)`. For two distinct labels,

    W_nr=(F_n-F_r)/(nu_n-nu_r),
    (P W_nr')'+(k²t²-nu_r)W_nr=F_n.                     (13)

After multiplication by sqrt(P), the forcing is F_n/sqrt(P). The one-well energy controls both unit-amplitude outgoing homogeneous solutions by4/sqrt7. On t>=2lambda their derivatives are at most `sqrt(24/7) k<2k`. Their Wronskian is k; therefore their outgoing Green kernel is bounded by `32/(7k)<5/k`, and its t derivative by `32sqrt(3/2)/7<6`. Also

    |F_n(t)|<=4/[pi sqrt7 sqrt(P)],
    integral_t^infinity ds/P(s)<=4/(3t).

The zero-outgoing-amplitude Green formula for (13) consequently gives the safe bounds

    |F_n(t)-F_r(t)|<=4|nu_n-nu_r|/(k t²),
    |F_n'(t)-F_r'(t)|<=10|nu_n-nu_r|/t²,
    t>=2lambda.                                         (14)

These estimate the COMPLETE divided difference; no endpoint-jet truncation is made. The Green solution exists by the ordinary Jost construction because Q-k² is integrable at infinity; the canceled Fourier asymptotics remove its homogeneous outgoing part.

Global endpoint nullity, without separate nulling in each deficit band, gives

    H(t)=sum a_ne_n(F_n(t)-F_r(t)).

Cauchy–Schwarz in ADDITIVE coefficients and (12)-(14) imply

    |H(t)|²<=16 R_lambda ||f||add²/(k²t^4).

Since `|Uf(s)|²=2t|H(t)|²`, t=lambda e^s and c=k lambda,

    |Uf(s)|²<=32 C0(1+beta)^3 e^(-3s)||f||add²,
    s>=log2.                                            (15)

Integration proves (1).

## 6. Samplers, including the hard first sampler for VALUES

The exact change of variable is

    ||M_yR_mUf||²
      =m^(-1-2y) integral_(log m)^infinity e^(2yt)|Uf(t)|²dt.

For m>=2, (1) gives the m^-4 decay in (2), with a constant uniform for |y|<1/2. For m=1, split at log2. On the near interval e^(2ys)<=2 and the exact exterior norm gives a bound2||f||add². On the far interval apply (15). Thus (2) also holds at m=1 without importing any low-index radial derivative argument.

For centered two-branch maps `A_(m,y)=(lambda^y M_yR_mU,lambda^(-y) M_(-y)R_mU)`, their squared norm is at most `C lambda(1+beta)^3 m^-4`, because lambda>=1 and |2y|<1. Define the ADDITIVE-metric row synthesis

    T_(W,y,ADD):ell²(W;ker eta,||.||add)->L² directsum L²,
    (f_m)_(m in W) ->sum_(m in W) A_(m,y) f_m,
    F_(W,y,ADD)^ctr=||T_(W,y,ADD)||².

Ordinary Cauchy–Schwarz in the SAMPLER index then gives `F_(W,y,ADD)^ctr<=C lambda(1+beta)^3 sum_(m in W)m^-4`. Summing dyadic windows yields (3), since their square-root contributions decay geometrically as2^-j. If one uses the repository's raw profile `Phi=U/(2sqrt2)` rather than U, the corresponding UNWHITENED additive Gram has the additional factor1/8. No comparison with the repository's deficit-whitened Gram is asserted.

## 7. Exact limits on reuse

The old repo theorem `GROWING_LOW_PREFIX_ENDPOINT_NULL_WEIGHTED_TAIL_FRAME_THEOREM.md` cannot simply be applied to a narrow high-index band. Its Q controls the maximum label, not just the number of labels; its hard-edge derivative proof uses nu/c²<<1 and superpolynomially small deficits. The argument above REPLACES its value-frame proof by a deficit-weighted additive metric argument.

This does not prove the old theorem in its exterior-whitened norm. It also does not control the translation modulus at m=1: the near-edge derivative graph has not been replaced. Even (3) remains a positive absolute frame bound of polylogarithmic size, not a small signed defect budget. Complete Poisson repairs, trace directions outside ker eta, the actual mean constraint, origin bumps, arithmetic inversion and correct gamma-orthogonality must all be retained in any subsequent application.
