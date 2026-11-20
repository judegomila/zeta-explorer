# Complete-theta tail, and the limit of a modular-mixture shortcut

Status: independently reviewed analytic PASS (theta_correlated_local_audit/AUDIT.md). No new finite ladder or next-pivot sign is claimed.

Use the conventions of eta_positive_primitive_v1/CORRELATED_MEAN.md. In particular
 C(r)=integral v^2 psi(r+v)psi(r-v) dv,
 C_N=P_N(-D_r^2/4)^2 C,
where the square is operator composition and P_N is the actual known monic degree-N prefix polynomial. Put z=pi exp(2r).

## 1. A complete-theta differentiated saddle

As r tends to positive infinity,
 C(r)=4 pi^3 exp(6r-2z) [1-53/(16z)+O(z^-2)].          (1)
This admits a full expansion in powers of z^-1, differentiable any fixed finite number of times. Consequently, for each fixed integer m,
 D_r^m C(r)=4 pi^3 exp(6r-2z)(-4z)^m[1+O_m(z^-1)].   (2)
Neither assertion is uniform when m grows with r.

Here is a justification including the entire theta sum and the noncentral region. On |v|<=r/2, both theta arguments tend to positive infinity. The n=m=1 product is exactly
 64 z^4 exp(r) exp(-2z cosh(2v))
   [1-(3/z)cosh(2v)+9/(4z^2)].
The remaining orbit pairs have exponent z(n^2 exp(2v)+m^2 exp(-2v)). Their minimum for n m>=2 is at least 4z. Their polynomial factors and any fixed number of r derivatives are absorbed by exponential decay; summing the full orbit tails gives an exponentially small relative error. This remains true near the ends of the central interval, where one argument is only r/2: the base exponent is already much larger than 2z.

Outside |v|<=r/2, use evenness psi(u)=psi(-u). Both the full profile and its fixed derivatives are bounded by a fixed polynomial in exp(2|u|), times exp(-pi exp(2|u|)), with an enlarged constant on bounded u. At least one argument has absolute value >=3r/2; integration of the resulting tail is polynomial-exponential times exp(-c exp(3r)), hence negligible relative to exp(-2z). This also controls arbitrary fixed differentiation under the integral.

For the central saddle, scale v=w/(2 sqrt(z)), so exp(-2z cosh(2v))=exp(-2z-w^2)[1-w^4/(12z)+O(z^-2 polynomial(w))]. The v^2 dv factor gives sqrt(pi)/(16 z^(3/2)) after Gaussian integration. The bracket contributes -3/z, while the quartic saddle correction contributes -5/(16z); together these give -53/(16z). Standard Taylor remainder bounds may be taken first on |w|<=z^epsilon for sufficiently small fixed epsilon, and the complement has a Gaussian-small bound. Expanding farther before differentiating gives the asserted fixed-order differentiated remainder. This proves (1)-(2), rather than differentiating a bare unqualified big-O statement.

## 2. A genuine theta-specific obstruction to a positive-mixture shortcut

Set G(x)=C(sqrt(x)), x>0. From the differentiated expansion,
 (log G)''(x)=[-8rz+4z-6+O((r+1)/z)]/(4r^3), r=sqrt(x). (3)
It is strictly negative for all sufficiently large r.

Every nonzero positive Laplace mixture G(x)=integral exp(-q x)dnu(q), q>=0, is log-convex where finite: G G''-(G')^2 is the nonnegative variance numerator of q. Thus the actual complete-theta G is NOT such a mixture. In particular, the hoped-for completely monotone profile in r^2 cannot be deduced from modular reflection and positivity; it is false for this profile. Equivalently, no finite positive mixture of Gaussian profiles in r can represent C exactly, nor can a positive Gaussian-mixture representation with arbitrary positive mixing measure do so.

This rules out a specific sign mechanism only. It does not show that Lambda changes sign, that C_N has a negative central mean, or that any actual pivot fails. Positive-definiteness and a positive Gaussian-mixture representation are different requirements.

## 3. What the same saddle actually gives for the signed target

For each fixed N and its actual fixed polynomial coefficients,
 C_N(r)=16^N z^(4N) C(r)[1+O_{N,P_N}(z^-1)].          (4)
Thus there exists a finite R_N beyond which C_N(r)>0. No next-pivot norm or sign enters this proof. The top derivative is D^(4N)/4^(2N); all lower polynomial terms are at least two derivative orders lower. Formula (2) gives the positive leading coefficient in (4).

This is useful only as a finite-degree tail-sign mechanism. It supplies neither an explicit growing-degree R_N nor a uniform sign window around r=0. In particular one cannot insert N=N(r) in (4).

If a quantitative fixed-degree tail estimate has independently certified such an R_N, the exact correlated representation gives the legitimate localized lower bound
 4pi E[C_N(R_s)] >= 8pi sqrt(s) integral_0^R_N C_N(r) exp(-2sqrt(s)r) dr. (5)
The omitted tail is positive, unlike the generic absolute-tail payment. A new original pivot follows only if this signed compact integral exceeds B_N/s. The unknown contact value has not been used, but the compact signed integral and actual prefix conditioning remain unpaid.

For growing degree, the needed new estimate is a quantitative version of (4) with actual coefficient control together with a lower bound on the signed compact integral in (5). Modular evenness supplies odd derivatives zero at the origin; it supplies no sign for this integral. The earlier all-degree positive-parent norm bounds do not settle it.

## 4. Why arithmetic filtering does not repair the missing sign by itself

With b=2 fixed, the audited filter and its inverse reconstruct exactly the same original psi, and hence the same C and C_N. The positive primitive is not C_N and cannot replace it. Formula (3) is an obstruction for the reconstructed complete profile, so a positive Gaussian-mixture shortcut cannot be restored merely by writing that profile as an arithmetic cancellation. A successful arithmetic argument would need to bound the signed cross-scale terms themselves; discarding them would change the target and erase the exact a=0 cancellation.

Scope: a theta-specific negative answer to the Gaussian-mixture route, and a noncircular fixed-degree positive-tail mechanism. No uniform signed mean, original next pivot, or RH result follows.

## 5. Explicit degree-dependent positivity of the central orbit region

A stronger, elementary local estimate avoids an implicit fixed-order asymptotic. Write
 L_N=P_N(-D^2/4)^2=sum_{k even,0<=k<=K} a_k D^k,
 K=4N, a_K=4^(-2N)>0.
For N>=1 set S_*=2K(9+2K), and require the actual coefficient test
 sum_{k<K}|a_k|/a_K (2S_*)^(k-K) <= 1/8.             (6)
If it fails, enlarge S_* until it holds. This uses only known prefix coefficients and is finite, but does not replace their conditioning by a universal bound.

For beta in {5,7,9}, define Q_k^beta by
 D^k[e^(beta r-S)]=e^(beta r-S)Q_k^beta(S), S'=2S.
Then Q_0=1 and Q_(k+1)=(beta-2S)Q_k+2S Q_k'. A path expansion of this recurrence gives
 |Q_k^beta(S)-(-2S)^k| <= (2S+beta+2k)^k-(2S)^k.
For S>=S_*, k<=K, the ratio of the right side to (2S)^k is at most e^(1/4)-1<1/3. Therefore for even k the Q_k are positive and bounded between (2/3)(2S)^k and (4/3)(2S)^k. Combining this with (6) yields, for beta=5,7,9,
 (1/2)a_K(2S)^K <= L_N[e^(beta r-S)]/e^(beta r-S)
                         <= (3/2)a_K(2S)^K.         (7)

For each orbit pair put z1=pi n^2 e^(2(r+v)), z2=pi m^2 e^(2(r-v)), S=z1+z2, T=z1 z2. The exact unfiltered product of its two profile summands is
 64 e^r T^2 e^-S -96 e^r TS e^-S +144 e^r T e^-S.
Its three prefactors have r exponents 9,7,5 respectively. Hence (7) shows its L_N image is at least
 e^r e^-S a_K(2S)^K [32T^2-144TS+72T],             (8)
which is positive whenever T/S>=9/2.

On the central region |v|<=r/2, these conditions hold simultaneously for ALL positive integers n,m provided
 2pi e^(2r)>=S_* and pi e^r>=9.                    (9)
Thus the complete central orbit sum, after applying the actual polynomial differential operator, is pointwise nonnegative there. No finite-orbit truncation and no unknown pivot are involved. The sum and differentiation converge locally absolutely on this region.

This is an explicit degree-sensitive central-tail mechanism: apart from the actual polynomial coefficient threshold (6), its onset scales as log K. It is NOT a sign assertion near r=0, nor a proof for the entire v integral: the noncentral region must still be paid. The differentiated saddle in Section1 shows that this payment is eventually smaller than the central contribution for each fixed N; converting it into a quantitative full-tail R_N requires explicit noncentral constants. Most importantly, the compact r integral in (5) remains signed and unproved. The estimate does not solve the original near-contact problem by moving its lower integration endpoint.
