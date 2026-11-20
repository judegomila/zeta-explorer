# One-sided Euler-product budget for the original curve

18 October 2026. New independently reviewed derivation. The algebra below is derived here; earlier exponent and boundary estimates are explicitly conditional inputs and are not re-proved in this note. No global zero-free theorem is proved.

## 1. An exact fixed-coefficient target

Take s0=417/500, h=1/8, Q>=2, and
V_Q(s)=prod_(p<=Q) (1-p^(-s-h))/(1-p^(-s)).
For Re(s)>0 all factors are nonzero. Define their logarithms by the convergent power series. At s=s0+it,

L_Q(t)=log|1/V_Q(s)|
 =-sum_(p<=Q) sum_(j>=1) (1-p^(-jh))p^(-j s0) cos(jt log p)/j.       (1)

Put S_Q(t)=sum_(p<=Q)(1-p^(-h))p^(-s0)cos(t log p). Then

|L_Q(t)+S_Q(t)|<=C(s0),
C(s)=[2^(-2s)+2^(1-2s)/(2s-1)]/[2(1-2^(-s))], s>1/2.              (2)

Proof: 1/j<=1/2 for j>=2 and 1-p^(-jh)<=1 give a bound
sum_p p^(-2s)/(2(1-p^(-s))). Enlarge to integers n>=2, replace the denominator by 1-2^(-s), and use the decreasing-function integral bound for sum n^(-2s).

Consequently S_Q(t)>=C(s0)-epsilon log T suffices for L_Q(t)<=epsilon log T. Only the complete weighted sum at this fixed cutoff is required. There is no requirement on each prime block, each partial endpoint, arbitrary coefficients, or subsets. Every relevant carrier t must still be covered. This is a strictly weaker sufficient arithmetic request than controlling the previously proposed family of short-window energies; it is not established by that logical weakening.

## 2. A finite rectangle certificate with an averaged left boundary

Let D={s: s0<Re(s)<r, |Im(s)-T|<Y}, with T-Y>0 and r>1. Assume zeta(s+h) has no zeros on a neighborhood of the closure of D. Define
G(s)=zeta(s)/(V_Q(s)zeta(s+h))-1.
It is analytic on that neighborhood, including at zeros of zeta(s). Suppose the verified left-boundary estimate is
|zeta(s0+iu)/zeta(s0+h+iu)|<=A T^m, |u-T|<=Y.
Set c=log A+m log T and x_+=max(x,0). Then

log|G(s0+iu)|<=log 2+(c+L_Q(u))_+.                          (3)

Indeed |G|<=1+exp(c+L_Q), and log(1+exp x)<=log 2+x_+.

For any target z in D let omega_z be harmonic measure of D, w_L its mass on the left edge, and nu_z the normalized restriction to that edge. Suppose explicit upper bounds R and B for log|G| hold on the right edge and the two horizontal edges, respectively. With their harmonic masses w_R,w_H, a sufficient condition for |G(z)|<1 is exactly

w_L[log 2+ integral (c+L_Q(u))_+ dnu_z(u)] + w_R R+w_H B <0.     (4)

This follows by applying the maximum principle to log|G| and the harmonic extension of the boundary majorant. At zeros of G, log|G|=-infinity causes no difficulty (or regularize and pass to the limit). Piecewise edge values and corner values are handled by bounded limiting majorants; corners have zero harmonic measure. No infinite-strip limit is being taken.

At a zero of zeta in D, G=-1; hence (4) excludes it. To exclude a region one must verify (4) for every target z in that region, or a separately proved covering family. An average over a long set of unrelated carriers is insufficient.

The right boundary has an elementary bound. For Re(s)=r,
log[zeta(s)/(V_Q(s)zeta(s+h))]
 =sum_(p>Q,j>=1)(1-p^(-jh))p^(-js)/j.
Thus its modulus is at most
D_Q=(1-2^(-r))^(-1) sum_(n>Q) n^(-r)
 <=(1-2^(-r))^(-1) floor(Q)^(1-r)/(r-1).
Therefore |G|<=exp(D_Q)-1, and one can take R=log(exp(D_Q)-1). The bound is uniform in carrier. The horizontal bound B remains a required input; (4) does not dispense with it.

## 3. Why signed linear averaging alone does not close (4)

For every real c,L,
(c+L)_+=c+L+(-c-L)_+.                                      (5)

The last term is nonnegative and cannot be dropped from an upper bound. Even if a smoothing kernel cancels the signed mean of L, the clipping penalty remains. For example, under a two-point probability measure with L=+K and -K equally likely and K>c>=0, the mean of L is zero whereas the mean of (c+L)_+ is (c+K)/2, arbitrarily large. This example only disproves the proposed scalar inference from a mean; it makes no assertion that actual primes realize it.

A genuine alternative arithmetic input is an upper bound on this clipped harmonic average, retaining the actual fixed prime coefficients in (1). The harmonic measure depends on the target and rectangle and cannot silently be replaced by a convenient positive kernel. Full control of its nonlinear tail, or a direct bound on |G|, is needed.

## 4. Conditional exponent budgets and a cutoff obstruction

For comparison with the retained earlier method, assume that its analytic boundary/horizontal estimates have been established with left exponent m+epsilon_an+epsilon_prime, right exponent -a(r-1), and interpolation weights (r-b)/(r-s0), (b-s0)/(r-s0). This assumption is stated explicitly; (4) is the independent finite-domain certificate above.

Then the exponent is negative precisely when

epsilon_prime < a(r-1)(b-s0)/(r-b)-m-epsilon_an.                (6)

With m=533/31500, r=100, a=1/2, epsilon_an=1/100000:
* at b=21699/25000=.86796, the exact right side is 59661491/2230470900000;
* as b tends to 7/8 from below, it tends to 17703041/4995900000.
These are about 0.00002674838 and 0.003543514, respectively. The budget varies with b(T)=7/8-1/(4.896 log T); it is not a constant gain proved for the curve.

Even granting epsilon_prime=epsilon_an=0, the same interpolation requires

a > m(r-b)/[(r-1)(b-s0)].                                  (7)

At b=7/8 and r=100 this lower threshold is exactly 10309/24948, about .4132195. Letting r tend to infinity only lowers it to m/(7/8-s0)=26/63. At a smaller b>s0 the threshold is larger. Therefore a polylogarithmic cutoff, for which log Q/log T tends to zero, cannot close this particular interpolation even if its entire prime-product cost were free. Shortening the cutoff merely transfers the loss to the right-boundary approximation. This is a limitation of this sufficient method, not a lower bound on the actual prime sum or an impossibility theorem for other detectors.

## 5. Status and next arithmetic question

The new precise weaker target is (4), with (1) and the clipping penalty (5), rather than the earlier uniformly bounded family of block energies. The simpler one-sided pointwise condition (1)--(2) is also sufficient subject to the stated analytic transfer inputs. Neither arithmetic condition has been proved uniformly in height. No effective onset or coverage of the gap before an independently known baseline overtakes the proposed curve has been supplied here. The classical 4.896 theorem near Re(s)=1 does not itself transfer to this reflected curve.

General harmonic-measure reference checked: M. Prats and X. Tolsa, Harmonic measure in Euclidean spaces, Chapter 5 (28 July 2026), https://mat.uab.cat/~xtolsa/mesuraharmonica.pdf. The finite-domain inference here is also proved directly by the maximum principle as above. The zeta exponent m and boundary estimates in Section 4 are conditional project inputs; that section establishes only the stated algebraic implication, not those analytic hypotheses.
