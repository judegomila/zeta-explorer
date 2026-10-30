# Frequency-block support bound and its exact limitation

> Curated source/review. Mathematical formulas and proof order are retained. Operational reviewer identifiers and private executor paths were removed; the manifest records original and published hashes. Historical receipt locations refer to the original audit layout. Current accepted scope is stated in the app module; internal review is not external peer review.

25 October 2026. Unconditional analytic deduction. This is not all-support positivity, a new prime estimate, or an RH proof. No novelty claim. The exact form normalization is inherited from the checked source packet.

## 1. Setup and result

Let I=[0,W], W>=1, extend f by zero, and use the unitary transform fhat(t)=(2pi)^(-1/2) integral f(x)exp(-itx)dx. Write

 Q_W[f] = A[f] + C_W[f] - P_W[f],
 A[f] = integral a(t)|fhat(t)|^2 dt,
 a(t)=Re digamma(5/4+it/2)-log pi,
 C_W[f]=2 Re integral_0^W exp(r/2)R_f(r)dr,
 P_W[f]=2 Re sum_(2<=n<exp W) Lambda(n)n^(-1/2)R_f(log n),
 R_f(r)=integral conjugate(f(x))f(x+r)dx.

Here C_W is the continuum main kernel exp(|x-y|/2), not the original signed rank-two pole operator; its decaying-kernel correction has already been absorbed into the 5/4 gamma symbol.

For any carrier tau and any finite integer set J of cardinality M, let

 E_(W,tau,J)=span{W^(-1/2)exp(i t_j x): j in J},
 t_j=tau+2pi j/W,  T=min_(j in J)|t_j|.

Then EVERY f in E_(W,tau,J) satisfies the explicit sufficient bound

 Q_W[f] >= [a(T)-4-32 M exp(W/2)/W] ||f||^2.                 (1)

The absolute arithmetic estimate can also be capped by C exp(W/2), independently of M. Thus the useful factor is min(1,M/W), up to absolute constants.

In particular, this is a genuinely uniform, support-sensitive positive regime whenever

 a(T) >= 4+32 M exp(W/2)/W.                                (2)

For fixed M and T tending to infinity it includes

 W <= 2 log log T + 2 log log log T - K,

with any fixed K>2 log(16M), eventually in T. This saves a factor W compared with the scalar total-mass bound. Constants are deliberately elementary rather than optimized.

This does NOT cover the full high-frequency subspace. It covers any specified M Fourier-box modes, including a narrow contiguous frequency block. Combining arbitrarily many such blocks requires new cross-block control; positivity on each separate block does not supply that control.

## 2. Arithmetic proof, with constants

Orthonormality gives |f(x)|<=sqrt(M/W)||f||. Hence, for 0<=r<=W,

 |R_f(r)| <= (M/W)(W-r)||f||^2.                             (3)

An elementary Chebyshev bound sufficient here is psi(x)<=3x for x>=1. For completeness, for each prime power p^k in (m,2m], the prime p contributes at least once to the central binomial coefficient: floor(2m/p^k)-2floor(m/p^k)=1, and every other valuation contribution is nonnegative. There is at most one power of a given prime in this interval. Therefore psi(2m)-psi(m)<=log binomial(2m,m)<=2m log2. Summing at powers of two and using monotonicity gives psi(x)<=4(log2)x<3x.

Put X=exp W. Stieltjes integration by parts gives

 S_1(W)=sum_(n<X) Lambda(n)n^(-1/2)(W-log n)
       =integral_1^X psi(x)x^(-3/2)[1+(1/2)log(X/x)]dx
       <=3(4sqrt X-W-4).

Prime powers at X have zero weight, so endpoint conventions do not matter. Also

 integral_0^W exp(r/2)(W-r)dr =4sqrt X-2W-4.

Applying (3) separately to P and C therefore proves

 |(P_W-C_W)[f]| <= (2M/W)(16sqrt X-5W-16)||f||^2
                  <=32(M/W)sqrt X ||f||^2.                 (4)

Using only |R_f(r)|<=||f||^2 instead gives the explicit bound 16sqrt X: partial summation gives sum_(n<X) Lambda(n)/sqrt(n)<=6sqrt X-3, while 2 integral_0^W exp(r/2)dr=4sqrt X-4. Thus (4) can be replaced by min(32M/W,16)sqrt X. No average-in-carrier estimate or unproved prime cancellation enters (4).

## 3. Gamma energy on the same exact compact-support subspace

The checked digamma identity is

 a(t)=a(0)+integral_0^infinity k(r)(1-cos tr)dr,
 k(r)=2 exp(-5r/2)/(1-exp(-2r)).

For a single box mode, the gamma diagonal is

 A_jj=a(t_j)+integral_0^W (r/W)k(r)cos(t_jr)dr
                  +integral_W^infinity k(r)cos(t_jr)dr.

For W>=1 the absolute correction is <0.8. Indeed

 integral_0^infinity r k(r)dr
   =2 sum_(m>=0)(2m+5/2)^(-2) <=0.72,
 integral_1^infinity k(r)dr
   <=[0.8/(1-exp(-2))]exp(-5/2)<0.076.

For j!=ell, direct integration of each truncated translation gives

 A_jell = [U(t_j)-U(t_ell)]/[pi(ell-j)],
 U(t)=-(1/2)integral_0^W k(r)sin(tr)dr.                       (5)

The function k is positive decreasing and rk(r)<=1. Split its sine integral at r=1/|t|. The initial piece has absolute value <=1, and Dirichlet's decreasing-amplitude estimate bounds the remaining piece by 2. Consequently |U(t)|<=3/2, uniformly in W,t.

The discrete Hilbert matrix H_jell=1/(j-ell), j!=ell, has norm <=pi on ell^2(Z); its Fourier multiplier is i(pi-theta), up to sign. Formula (5) is a compression of the commutator -[diag U,H]/pi. Its norm is therefore <=2||U||_infinity<=3. The same bound applies to any finite subset J.

Since a(t) is even and increasing in |t| (termwise from the digamma series),

 A[f] >=[a(T)-0.8-3]||f||^2 >=[a(T)-4]||f||^2.             (6)

Combining (4) and (6) proves (1). In particular, no falsely bandlimited compact-support function is used: every vector in E is a literal function supported on I, with its actual sinc-tailed Fourier transform.

## 3a. Complete-domain gamma reduction (not just a finite-block statement)

The same calculation on all j in Z defines a bounded self-adjoint E_W with ||E_W||<4 such that

 A_W = diag_j a(tau+2pi j/W) + E_W                            (6a)

as closed forms in the complete box Fourier basis. Thus the logarithmic frequency dependence can be retained as a diagonal operator, paying only a uniform bounded gamma remainder, for every W>=1.

Here is the domain point. First (6a) is an identity on finite Fourier polynomials, and the bounded matrix remainder shows their completion has form norm equivalent to sum_j log(2+|t_j|)|c_j|^2. Smooth functions compactly supported inside I belong to that completion, since their modulated Fourier coefficients decay rapidly. Their Fourier partial sums are Cauchy in the actual gamma form by the finite-polynomial identity; closedness identifies the limit with the original smooth function. Finally C-infinity_c(I) is a form core for the zero-extension logarithmic form: inward dilation first leaves a boundary margin and converges strongly in Fourier L2 with logarithmic weight, and convolution by a smooth approximate identity inside that margin gives the desired approximants. Hence the two closed forms coincide. Equivalently, zero-extension and periodic logarithmic Sobolev energies differ by a bounded form here.

No corresponding bounded-uniform arithmetic remainder has been obtained: its norm has exponential support growth, as Section 5 explains.

## 4. Exact arithmetic cross-block structure

Define the signed sine discrepancy

 S_W(t)=sum_(n<exp W) Lambda(n)n^(-1/2)sin(t log n)
        -integral_0^W exp(r/2)sin(tr)dr.

In the same basis, the joint arithmetic operator B=P-C has

 B_jj=2 sum_(n<exp W) Lambda(n)n^(-1/2)(1-log n/W)cos(t_j log n)
      -2 integral_0^W exp(r/2)(1-r/W)cos(t_jr)dr,

 B_jell=[S_W(t_j)-S_W(t_ell)]/[pi(ell-j)]  (j!=ell).         (7)

Thus the omitted cross-block operator is a divided-difference/discrete-Hilbert commutator, not an independent collection of scalar box energies. A bound on diagonal entries or on a long-time mean square does not establish a bound on this operator. A potential weighted commutator estimate would have to control all relevant local oscillations, with the logarithmic gamma weight; it is not provided here.

## 5. The M/W gain is sharp in scale, and saturates at M comparable to W

There are absolute positive c,C such that for W large, a contiguous block with M modes, 1<=M<=cW, admits unit envelopes g with

 P_W[g] >= c (M/W) exp(W/2).                                (8)

One explicit construction uses the nonnegative Fejer polynomial F_N(2pi x/W), with N comparable to M and its exact L2 normalization. It has 2N-1 consecutive modes, and

 integral_0^W F_N(2pi x/W)^2 dx = W(2N^2+1)/(3N).

On both endpoint intervals of any sufficiently small fixed length delta, F_N>=cN whenever N<=cW. The normalized g is consequently >=c sqrt(N/W) there. For r in [W-delta,W-delta/2], the overlap of the endpoint intervals has fixed positive length, so R_g(r)>=cN/W. The prime number theorem on this fixed multiplicative shell gives

 sum_(exp(W-delta)<=n<=exp(W-delta/2)) Lambda(n)n^(-1/2)
       >=c exp(W/2)

for all sufficiently large W. This proves (8). For even M use a block containing 2N-1 comparable modes; for bounded M the constant mode already supplies the same order. For M>=cW, retain a subblock of size comparable to W to obtain c exp(W/2).

For each fixed W, simultaneous phase recurrence provides arbitrarily large tau with exp(i tau log p) arbitrarily close to one for every prime p<exp W. Prime-power phases also align. Then

 P_W[exp(i tau x)g] -> P_W[g],
 C_W[exp(i tau x)g] ->0

along a recurrence sequence; the latter is the ordinary Riemann-Lebesgue lemma applied to the integrable correlation kernel. Thus (8) is also a lower bound, up to constants, for the joint discrepancy norm on such blocks at arbitrarily late carriers.

Moreover, every individual arithmetic diagonal satisfies |B_jj|<=32 exp(W/2)/W, whereas the Fejer construction in a block M comparable to W gives ||B||>=c exp(W/2). Therefore the off-diagonal arithmetic commutator itself has norm >=c exp(W/2) for W large (after reducing c). The gap between diagonal box tests and the collective operator grows by a factor of order W. This is an actual-arithmetic obstruction, not a toy frequency grid, to upgrading diagonal positivity without cross-mode control.

This does NOT yield a negative-Q example: the gamma energy increases like log tau along those recurrences. It proves exactly the limitation needed here: support alone cannot improve the arithmetic block norm beyond min(1,M/W)exp(W/2). Any stronger all-carrier positivity statement must compare partial resonance with its carrier height, rather than infer cancellation from finite bandwidth or from a long average.

## 6. Status

Established: explicit uniform finite-mode positive regime; exact cross-block commutator; sharp scale of the support-only arithmetic estimate.

Not established: weighted arithmetic commutator bound, all-frequency positivity, an improving all-support negative-index theorem, or any new information about zeta zero locations. Standard large-sieve mean values have not been converted into an unjustified worst-block statement.

## Floating matrix check

`check_frequency_block_matrix.py` independently integrates the truncated translation matrices in x, then compares both arithmetic and gamma matrices against the divided-difference formulas. At W=3.7, tau=13.2 and indices {-3,-1,0,2,5}, maximum discrepancies were 4.35e-15 (arithmetic) and 1.03e-12 (gamma). Results are in `frequency_block_matrix_diagnostic.json`. This is only a normalization diagnostic, not an interval proof; the inequalities above are analytic.

## Next precise analytic direction, not an established estimate

Let w_j=a(t_j)+2>0 and H_jell=1/(j-ell). The natural arithmetic cross-mode norm is

 ||D_w^(-1/2)[D_S,H]D_w^(-1/2)||
   =||[D_S,H]:ell^2(w)->ell^2(w^(-1))||.

This identity is elementary. It preserves the actual logarithmic gamma weight rather than replacing it by a scalar clip. A plausible harmonic-analysis framework is a two-weight commutator theorem with Bloom weight w; the corresponding candidate oscillation quantity is

 sup_(finite integer intervals J)
 [sum_(j in J)w_j]^(-1) sum_(j in J)|S_j-(1/|J|)sum_(ell in J)S_ell|.

This is a SUPREMUM over intervals, not a long-frequency average. Even a successful discrete commutator reduction would still require new uniform arithmetic control of this quantity and suitable constants/sign information. No discrete Bloom theorem, prime bound, or positivity conclusion from it is asserted here.

Primary background for the continuous two-weight analogue: I. Holmes, M. T. Lacey, B. D. Wick, *Commutators in the Two-Weight Setting*, https://arxiv.org/abs/1506.05747 (published in Mathematische Annalen). The paper's continuous theorem is not silently substituted for the required discrete estimate.
