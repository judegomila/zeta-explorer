# Sharper paid divisor tail at normalized a = 0

Let A=∑_{j even}a_jD^j, a_j≥0, highest order K, W(S)=∑a_j(2S)^j, B=6400(K+2)^2(K+3)^3, H=(2K+7)(3K+7). Retain the actual coefficients, and let U_k be the positive-opposite summand defined in ARITHMETIC_REMAINDER_BOUND. Write d(k)=∑_{nm=k}1 and ℓ₂(k)=∑_{nm=k}log²(n/m). The following is a deduction from its reviewed global single-orbit derivative envelope, not an independent proof of that input.

For k≥e² and 4πk≥H, substitution R=log(k)/2 and z=πk gives

|U_k| ≤ E_k := (2B/π) k^(−3/4) [d(k)+ℓ₂(k)/4] W(2πk)e^(−πk/2).  (1)

Since ℓ₂(k)≤d(k)log²k and d(k)≤2√k by pairing divisors,

E_k ≤ F(k):=(4B/π)k^(−1/4)(1+log²k/4)W(2πk)e^(−πk/2).  (2)

The log derivative of the prefactor excluding the exponential is ≤(K+1/4)/k: positivity gives (d/dk)log W(2πk)≤K/k, while (d/dk)log(1+log²k/4)≤1/(2k). Therefore for integer J≥max{e²,H/(4π),4(K+1)/π}, F(k+1)/F(k)≤q=e^(−π/4) for k≥J and

∑_{k≥J}|U_k| ≤ F(J)/(1−q).  (3)

The existing elementary envelope was 2B/π times k^(1/4) times the same remaining factors, so (2) is a factor 2/√k smaller. The geometric constants differ: the old bound uses 2, while (3) uses 1/(1−e^(−π/4))≈1.839.

For any integer M≥J one can preserve exact divisor arithmetic over an initial segment and pay only the analytic end:

∑_{k≥J}|U_k| ≤ ∑_{k=J}^{M−1} E_k + F(M)/(1−q).  (4)

All terms are explicit using the actual a_j and exact divisors. This is a certificate of magnitude, not a proof of signed core cancellation. If J also exceeds the audited degree-only sign cutoff, then the even remainder is nonnegative, while the actual odd remainder is nonpositive: the latter requires subtracting the bound when certifying a positive odd pivot. Multiply by 4π for the original pivot normalization. No claim is made for the a>0 sinh-weighted kernel, and no assumption about the next unknown pivot is used.
