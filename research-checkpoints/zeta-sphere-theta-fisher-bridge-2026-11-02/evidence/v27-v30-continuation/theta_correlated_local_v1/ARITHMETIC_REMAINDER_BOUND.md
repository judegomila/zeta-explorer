# Explicit arithmetic remainder payment, including the odd ladder

Independently reviewed analytic PASS. This supplies a magnitude bound in addition to the reviewed sign of the high arithmetic terms.

Let A=sum_even a_jD^j have a_j>=0, highest even order K>=2. It is either the even target L_N or the positive opposite of the odd target. Use
 W(S)=sum a_j(2S)^j,
 B_K=6400(K+2)²(K+3)³,
 H_K=(2K+7)(3K+7).
Let U_k denote its divisor summand formed with A C_f and A A_f. The original odd target uses -U_k.

For R>=1, z=pi e^(2R), 4z>=H_K, the global split at w=0 and the same single-orbit derivative bounds yield
 |A C_f(R)|, |A A_f(R)|
 <=2B_K W(2z) pi^(-3/4) z^(-1/4)e^(-z/2).         (1)
Indeed for w>=0, u=R+w>=R, w²<=u² and1<=u². Bound the large-argument derivative by T_l e^(u/2)e^(-pi e^(2u)/2), the other by M^f, and integrate exactly as before, now starting at R rather than3R/2. This accounts for the whole integral and does not presume the product has a fixed sign.

Since d(k)<=k and ell_2(k)<=k log² k, at R=(log k)/2,
 |U_k|<=F_K(k):=(2B_K/pi) k^(1/4)(1+log² k/4)
                            W(2pi k)e^(-pi k/2),  (2)
provided R>=1 and4pi k>=H_K.

The logarithmic derivative of the prefactor before e^(-pi k/2) is at most (K+3)/k. Here W has nonnegative coefficients so d log W(2pi k)/dk<=K/k, and the log-square factor contributes at most1/(2k). Thus if
 J>=max{e²,H_K/(4pi),4(K+3)/pi},
then F_K(k+1)<=e^(-pi/4)F_K(k) for all integers k>=J. Since e^(-pi/4)<1/2,
 sum_(k>=J)|U_k| <= (4B_K/pi) J^(1/4)(1+log²J/4)
                              W(2pi J)e^(-pi J/2)=: Tail_K(J). (3)
Take integer J, or round the displayed lower threshold upward. Actual coefficient conditioning remains explicitly in W; it has not been removed from the magnitude of the arithmetic remainder.

For a known signed finite partial sum of the original target through k=J-1, (3) gives a two-sided enclosure of the full normalized contact. If J is also beyond the reviewed degree-only sign cutoff, the enclosure becomes one-sided:
 - even target: contact in[Partial,Partial+Tail_K(J)];
 - odd target: contact in[Partial-Tail_K(J),Partial].
Multiplication by4pi gives the corresponding original pivot enclosure.

Consequently an odd-rung certificate must require Partial>Tail_K(J), rather than merely Partial>0. This is a genuine paid finite arithmetic certificate using only known prefix coefficients and explicit remaining terms. It is not a proof that the inequality succeeds for all degree. No new finite ladder computation is claimed.
