# Joint Euler forward/inverse pairing and its unavoidable integrated cancellation

Status: independent analytic review PASS. This treats the two directions together without cutoff normalization or Gaussian factors. It proves a quantitative obstruction to a proposed positive cross-form lemma, not a sign of the original target.

## 1. Exact joint factorization on the normalized real-axis bridge

Let F be the actual complete-theta Fourier transform and R_x the symmetric Euler multiplier over primes<=x. On R, R_x>0. Put
 G_x=R_x F, H_x=F/R_x, l_x=log R_x,
 C(G,H)=G'H'-(G''H+GH'')/2.
Direct differentiation gives the exact identity
 F'^2-FF''=C(G_x,H_x)+2(l_x')^2F^2.                       (1)
In particular every l_x'' term cancels between the forward and inverse factors. This is a full-kernel identity, with no positive target assumption and no replacement of the actual polynomial.

For every fixed real polynomial p, including any actual inverse-selected residual whose coefficients are already defined, all integrals are finite and
 h[p]=integral p^2 C(G_x,H_x)+E_x[p],
 E_x[p]=2integral p(t)^2F(t)^2(l_x'(t))^2dt>=0.             (2)
No next pivot or unknown norm is in the definition of E_x. The original real-axis target h[p] is independent of x. A sufficient candidate would be nonnegativity of the cross integral, or a lower bound on it strictly above -E_x. The first candidate is false for this actual theta pairing, as proved below; the second remains unproved.

The statements here concern the normalized shift origin. The inverse factor has poles at imaginary heights +/-1/2, so the identity is not an unrestricted operator factorization on all complex shifts. Fixed-cutoff real-axis identities and their integrability are unaffected. Rescaling G_x by a constant and H_x by its reciprocal does not change(1) or(2).

## 2. An unconditional prime asymptotic, uniform enough for the full integral

The exact logarithmic expansion gives
 l_x'(t)=2sum_(p<=x)(log p)sum_(k>=1)p^(-k/2)sin(kt log p).
The k>=2 contribution is O((log x)^2), uniformly in t, by bounding the prime sum with the corresponding integer sum. The unconditional PNT and partial summation give, for each fixed real t,
 sum_(p<=x)(log p)p^(-1/2+it)
               =x^(1/2+it)/(1/2+it)+o(sqrt(x)).            (3)
Therefore
 l_x'(t)/sqrt(x)=2Im[x^(it)/(1/2+it)]+o(1).                (4)
The error tends to zero at each fixed t. Moreover the absolute prime sum at t=0 is asymptotic to2sqrt(x), so l_x'/sqrt(x) is uniformly bounded in t and all sufficiently large x. These facts follow only from pi(x)~x/log x (NIST DLMF27.2.3, https://dlmf.nist.gov/27.2#E3 ); no critical-line zero theorem or unknown bridge positivity is used.

Since p^2F^2 is integrable, dominated convergence controls the difference of the squared expressions in(4). Squaring the main term yields
 integral p^2F^2(l_x')^2/x
 =2integral p^2F^2/(1/4+t^2)
   -2Re integral p^2F^2 exp(2it log x)/(1/2+it)^2+o(1).
The oscillatory integral tends to zero by the Riemann-Lebesgue lemma. Hence, for every fixed nonzero polynomial p,
 E_x[p]~4x I_p,
 I_p=integral_R p(t)^2F(t)^2/(1/4+t^2)dt>0.                (5)
This is an actual complete-theta integral with a known positive parent weight. It is used to quantify the explicit positive term, not to replace the signed target.

## 3. Consequence for a proposed paired positive form

Combining(2) and(5),
 integral p^2 C(G_x,H_x)=h[p]-E_x[p]~ -4x I_p.              (6)
Thus the joint cross term is strictly negative for all sufficiently large prime cutoffs, for every fixed actual residual polynomial. No sign of h[p] was assumed; only its finiteness is needed. This is stronger than a pointwise test and does not choose a new polynomial after seeing the cutoff.

The pairing does avoid the earlier normalized multiplier collapse. Its price is exact cancellation between two terms growing linearly with cutoff, leaving the original finite target. Any comparison that declares the cross term positive, or bounds its negative part by a fixed fraction below1 of E_x uniformly as x grows, is contradicted by(6). Constants used to reciprocally normalize the two factors do not change this conclusion.

This does not rule out a more delicate correlated arithmetic estimate on h[p] itself, or a cutoff chosen in a degree-dependent way. It rules out this particular hoped-for positive joint factorization. Establishing a residual margin after the cancellation is still the original analytic difficulty, not a consequence of the factorization.
