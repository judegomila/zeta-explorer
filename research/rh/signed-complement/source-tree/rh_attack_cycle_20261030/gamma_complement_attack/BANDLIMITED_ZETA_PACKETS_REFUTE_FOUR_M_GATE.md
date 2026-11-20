# Bandlimited zeta packets refute the strong 4M tail gate

> Curated analytic source/review. The bundled exact-matched audit supplies the accepted scope; historical producer review-request headers are superseded. No new numerical spectrum replay is claimed. Private operational identifiers are removed, and original-to-published hashes are recorded in SOURCE_PROVENANCE.json.

## 1. Statement and exact scope

Fix M>0 and use the accepted normalization

    ell=log(lambda), X=lambda^2,
    a(t)=Re psi(5/4+it/2)-log pi,
    P_X(t)=2Re sum_(d<=X) Lambda(d)d^(-1/2+it),
    C_X(t)=2Re[(sqrt(X) X^(it)-1)/(1/2+it)],
    d_X=P_X-C_X,
    delta=(1+ell)^(-3),
    m(t)=(1-delta)(a(t)+M)-d_X(t).

Consider the natural cutoff and strong clipped tail

    T0=pi X/ell,
    v_high(t)=1_(|t|>T0)[4M-m(t)]_+.

On the fixed grid I_j=[j/ell,(j+1)/ell), put

    A_j=integral_(I_j) v_high,
    cap=M/(12ell),
    E_lambda=sum_j(A_j-cap)_+.

For every fixed theta in (1/2,1), along X=2N, N an integer tending to infinity,

    E_lambda >= c_(M,theta,phi) N^(theta-1/2) log N.       (1)

In particular the proposed E_lambda=O_M(ell) fails along this sequence, and the stronger uniform cell cap fails as well. The constant is positive and the onset is unspecified. This is a refutation of the ARITHMETIC HYPOTHESES of the strong `4M` rank-budget route, not of the valid conditional rank lemmas.

The proof constructs an actual even Fourier transform F with inverse Fourier support strictly inside [-ell,ell], such that

    ||F||_2^2 ~ 2 W log N,
    integral_R m(t)|F(t)|^2 dt = (M+o(1))||F||_2^2,
    integral_(|t|<=T0) v(t)|F(t)|^2 dt=o(||F||_2^2),
    ||F||_infinity^2 << sqrt(N),                         (2)

where W=N^theta, v=[4M-m]_+. These four facts already imply (1) by the previously accepted cell-cap inequality. Their detailed proof follows.

## 2. Fixed bandlimited envelope and physical support

Choose a fixed real even Schwartz function phi, not identically zero, with angular Fourier support in [-1,1], and normalize integral |phi(u)|^2du=1. For example take its Fourier transform to be a real even nonzero C_c^infinity(-1,1) bump and normalize. Let

    T=N, W=N^theta, R_N(t)=sum_(n<=N)n^(-1/2+it),
    D_N(t)=sum_(n<=N)(log n)n^(-1/2+it),
    F_+(t)=phi((t-N)/W) exp(-it log N/2) R_N(t),
    F(t)=F_+(t)+F_+(-t).

F is even. With either consistent unitary Fourier sign convention, its inverse Fourier support is contained in

    [-log N/2-1/W, log N/2+1/W].

Since X=2N, ell=(log N+log2)/2, this interval lies strictly inside [-ell,ell] for large N. Thus F is an admissible EVEN physical Paley--Wiener transform. It is Schwartz, and its inverse Fourier transform is smooth and compactly supported. There are no domain or sharp-endpoint issues.

The two packets are separated by 2N while their envelope scale is W=o(N). For every fixed polynomial multiplier growth and every prescribed power saving, the cross terms between F_+(t) and F_+(-t) are negligible: use |R_N|<=2sqrt N and the Schwartz estimate for at least one envelope, then increase its fixed decay exponent. The same observation controls the tails of F_+ outside [N/2,2N]. All implicit constants may depend on theta and phi, never on N. For a desired saving N^(-A), choose a fixed decay exponent larger than (A+C)/(1-theta), where C covers the displayed polynomial prefactors. No N-dependent envelope is used.

## 3. Uniform truncation past the reciprocal-length-one boundary

Uniformly on t in [N/2,2N],

    R_N(t)=zeta(1/2-it)+O(N^(-1/2)),
    D_N(t)=-zeta'(1/2-it)+O(N^(-1/2)log N).              (3)

For clarity, the usual two-sum approximate functional equation with a dual length below 1 is NOT cited outside its stated x,y>=1 range. Here is a direct Euler-summation justification.

Take y=N+1/2. Euler summation represents the difference between zeta(s) and sum_(n<=N)n^(-s) as the pole integral y^(1-s)/(s-1), a possible endpoint term of size O(y^(-Re s)), and a remainder s times an integral of the bounded periodic sawtooth against u^(-s-1), u>=y. Expand the sawtooth in its Fourier series (first Abel-regularize). For each nonzero Fourier mode k the phases have derivatives

    +/- 2pi k + t/u.

Their magnitudes are bounded below by c|k| on u>=y, because |t|<=2N and 2<2pi. Integration by parts gives the mode integral O(y^(-Re s-1)/|k|), uniformly for Re s in a fixed small neighborhood of 1/2 and Im s in a fixed small neighborhood of [-2N,-N/2]. The sawtooth Fourier coefficient is O(1/|k|), so the mode sum converges absolutely after this integration. Multiplication by |s|=O(N) leaves O(N^(-Re s)); the pole integral is also O(N^(-Re s)). This proves the first bound uniformly in a complex s-disc of radius 1/log N. Cauchy's derivative estimate on that disc proves the derivative bound in (3), since N^(-Re s) differs from N^(-1/2) there by at most an absolute factor.

The classical mean-square formula gives

    integral_0^U |zeta(1/2+it)|^2dt
      =U log(U/(2pi))+(2gamma-1)U+O(sqrt(U)log U).       (4)

Integration by parts against |phi((t-N)/W)|^2, retaining only [N/2,2N] and controlling the rest by the Schwartz tail, yields

    (1/W) integral |phi((t-N)/W)|^2 |zeta(1/2-it)|^2dt
       =log N+O(1)+O(sqrt(N)log N/W)+o(1)
       =log N+O(1).                                  (5)

In (5) zeta need only be used on [N/2,2N]; outside this interval the original finite polynomial is bounded directly. Together with (3) this proves

    (1/W) integral |F_+|^2=log N+O(1),
    ||F||_2^2=2W(log N+O(1)).                          (6)

Finally, the balanced approximate functional equation with x=y=sqrt(t/(2pi)) and |chi(1/2+it)|=1 gives the elementary convexity-size estimate |zeta(1/2+it)|<<t^(1/4) by bounding each of its two finite sums absolutely. Equations (3) and the Schwartz tail therefore give the GLOBAL bound

    ||F||_infinity^2 << sqrt N.                       (7)

Outside the two main packet intervals one uses |R_N|<=2sqrt N and enough envelope decay; inside them one uses (3) and the displayed convexity bound. No Lindelof or RH input is used.

## 4. Exact arithmetic convolution and a genuinely small finite-height tail

Let S_X(t)=sum_(d<=X)Lambda(d)d^(-1/2+it). The coefficients in S_X R_N are

    b_m=m^(-1/2) sum_(d|m,d<=X,m/d<=N)Lambda(d).

Since X=2N>=N, for m<=N this is exactly (log m)/sqrt m. For ALL m the elementary divisor identity gives

    0<=b_m<=(log m)/sqrt m.

Thus S_X R_N=D_N+B_>, where B_> has only indices m>N. Write h(u)=|phi(u)|^2. Its angular Fourier support lies in [-2,2]. Hence

    (1/W) integral h((t-N)/W)(m/n)^(it)dt=0

unless |log(m/n)|<=2/W. For m>N and n<=N this forces

    N<m<=N exp(2/W),
    n>=N exp(-2/W),
    1<=m-n<=C N/W.

At each positive integer separation j=m-n there are at most j pairs crossing the cutoff N. Each coefficient b_m/sqrt n is O(log N/N) in this range. Therefore the ENTIRE boundary-tail pairing satisfies

    |(1/W) integral h((t-N)/W) B_>(t) conjugate(R_N(t))dt|
       << (log N/N) sum_(j<=C N/W) j
       << N log N/W^2=o(1).                          (8)

All far convolution outputs are killed exactly by bandlimiting, independently of how many there are. This is not a generic mean-value error, not an equidistribution assumption, and not a claim that the tail output norm is small.

Consequently

    (1/W) integral P_X(t)|F_+(t)|^2dt
      =(2/W)Re integral h((t-N)/W)D_N(t)conjugate(R_N(t))dt
         +O(N log N/W^2).                             (9)

The replacement of D_N conjugate(R_N) by -zeta' conjugate(zeta) needs no new derivative moment theorem. The weighted Gram kernel for h has absolute value at most ||h||_1 and vanishes unless |log(m/n)|<=2/W. Each row has O(1+N/W) nonzero entries. Schur's test therefore gives

    (1/W) integral h((t-N)/W)|D_N(t)|^2dt
       << (1+N/W) sum_(n<=N)(log n)^2/n
       << (1+N/W)log^3N.

On [N/2,2N], write zeta=R_N+epsilon and -zeta'=D_N+eta, where |epsilon|<<N^(-1/2) and |eta|<<N^(-1/2)logN by (3). Expanding the product and applying Cauchy--Schwarz, (5) and the last bound gives a replacement error, after division by W, at most

    O(log^(3/2)N/sqrt W + log^(3/2)N/sqrt N)=o(1).

Outside that interval we retain the original finite polynomials, whose polynomial bounds are overwhelmed by envelope decay. No estimate for zeta or zeta' outside the main interval is required.

## 5. Functional-equation cancellation, with the correct gamma branch

Differentiating zeta(s)=chi(s)zeta(1-s), multiplying by conjugate zeta(s), and adding the conjugate identity gives on Re s=1/2

    2Re[-zeta'(1/2-it) conjugate(zeta(1/2-it))]
      =a_0(t)|zeta(1/2-it)|^2,
    a_0(t)=Re psi(1/4+it/2)-log pi.                    (10)

This identity contains no division by zeta, so it remains valid at its zeros. The recurrence psi(z+1)=psi(z)+1/z gives exactly

    a(t)-a_0(t)=4/(1+4t^2).                           (11)

Equations (3), (8)--(11) and the negligible outer tails imply

    (1/W) integral (P_X-a)|F_+|^2=o(1).                (12)

On the main packet interval |C_X(t)|<=2(sqrt X+1)/|t|=O(N^(-1/2)); its weighted contribution divided by W is O(N^(-1/2)logN). Off that interval C_X is bounded by O(sqrt X), and the envelope tail handles it. Thus

    (1/W) integral (d_X-a)|F_+|^2=o(1).                (13)

The same holds for the negative packet and their cross terms. Moreover

    integral (a+M)|F|^2=O(log N)||F||^2,
    delta log N=O((log N)^(-2)).

Therefore

    integral m|F|^2=(M+o(1))||F||^2.                  (14)

This is an averaged near-null statement for H, consistent with the already known approximate radical/head. It is not a negative-energy witness. Its crucial new feature here is physical support plus localization well ABOVE the particular proposed cutoff T0.

## 6. Low-band leakage and the aggregate contradiction

At X=2N,

    T0=2pi N/ell=o(N).

For |t|<=T0, both packet envelopes are a distance comparable to N/W from their centers. The simple bounds v(t)<=C_M sqrt N and |R_N(t)|<=2sqrt N, together with Schwartz decay, give

    integral_(|t|<=T0) v|F|^2=o(||F||^2).              (15)

The constants can absorb the bounded negative part of a. Globally, a has a lower bound and d_X=O(sqrt X), so the displayed bound on v is legitimate; it does not replace the actual signed multiplier in (14).

Pointwise [4M-m]_+>=4M-m. Hence (14),(15) yield

    integral v_high|F|^2 >=(3M-o(1))||F||^2.           (16)

Apply EXACTLY the fixed-grid decomposition from `AGGREGATE_HIGH_CELL_EXCESS_AND_FINITE_EXCEPTION_BUDGET.md`:

    g=min(1,cap/A_j)v_high on I_j,
    e=v_high-g, integral e=E_lambda.

Because F has physical support in [-ell,ell], the accepted elementary H1 cell argument gives

    integral g|F|^2<=3ell cap||F||^2=M||F||^2/4.

Subtracting from (16), then applying (6),(7), gives

    E_lambda ||F||_infinity^2
      >= integral e|F|^2
      >=(11M/4-o(1))||F||^2
      >=c_M W log N.

Thus E_lambda>=c_M N^(theta-1/2)logN, proving (1). The evenness, grid symmetry and cutoff convention agree exactly with the accepted aggregate note. No need to locate an individual prime recurrence or to estimate an individual scalar extremum arises.

## 7. What is closed and what remains open

* The constant-sized apparent advantage of the square-zero diagonal resonator r_n=n^(-1/2) at N~T is canceled by its true finite-height behavior: the derivative/functional-equation contribution is the leading term.
* Nevertheless, turning this family into a genuinely supported high-frequency packet shows that the strong `4M` cap and E_lambda=O(ell) aggregate target at T0=pi X/ell are too strong. Their rank lemmas remain valid conditional statements but their arithmetic hypotheses are false along X=2N.
* The earlier `s<(1-delta0)mu` local-negative-mass gate is NOT refuted. Here the packet averages m near M, not below a small positive s. No complement-floor claim follows either way.
* A future signed route must retain this high-frequency near-null/head sector rather than demand that its full positive `4M` clipped compression be small. Genuine signed cancellation or explicit removal of the head may survive this obstruction.

## Sources actually used

1. The classical mean-square formula (4) with its safe error is recorded as equations (1),(2) in Simonic--Starichkova, *Atkinson's formula for the mean square of zeta(s) with an explicit error term*, arXiv:2105.06821v3, https://arxiv.org/pdf/2105.06821v3 . Its original source is Ingham, *Mean-Value Theorems in the Theory of the Riemann Zeta-Function*, Proc. London Math. Soc. s2-27 (1928), 273--300, https://doi.org/10.1112/plms/s2-27.1.273 . Only the elementary classical error is needed, not any modern exponent.
2. Balanced approximate functional equation and chi normalization: NIST DLMF 25.9.1--25.9.3, https://dlmf.nist.gov/25.9 . The pointwise O(t^(1/4)) bound is obtained directly by absolute summation of its two balanced sums. The uniform long-cutoff approximation (3) is independently justified by Euler summation above, not by extending DLMF's x,y>=1 statement to y<1.
3. Gamma recurrence and functional equation are standard exact identities; the rational 5/4-minus-1/4 correction is displayed in (11). All packet, convolution-tail, support, cell-cap, and aggregate steps are proved here.
