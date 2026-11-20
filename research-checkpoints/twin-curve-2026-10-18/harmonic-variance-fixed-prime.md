# A fixed-prime second-moment test for the clipping cost

18 October 2026. Analytic follow-up to the reviewed finite-rectangle criterion. Independently checked in an internal mathematical review. The moment estimate required below is not proved.

## 1. Quantitative clipping reduction

Let nu be the normalized left-edge harmonic measure for an individual target in the finite rectangle. Keep its exact measure; no long-height average is substituted. Let L=L_Q, mu=integral L dnu, v=integral (L-mu)^2 dnu, and c as in the original criterion. If a=c+mu>0, then

integral (c+L)_+ dnu <= a+v/(4a).                           (1)

Indeed put Y=L-mu. Pointwise (-a-Y)_+<=Y^2/(4a): in the nonzero case the difference of the right side and -a-Y is (Y+2a)^2/(4a). Combine this with (a+Y)_+=a+Y+(-a-Y)_+ and integrate.

Thus, with the original edge weights and bounds, define
Btarget=-(w_R R+w_H B)/w_L-log 2.
A sufficient finite-domain condition is

0<a<Btarget and v<4a(Btarget-a).                            (2)

This keeps the full horizontal and right-edge budgets. It asks for two actual local moments rather than a pointwise supremum. A positive Btarget and an effective numerical margin must still be demonstrated for every target; (2) provides neither automatically.

## 2. Exact first-prime covariance

Set a_p=(1-p^(-h))p^(-s0) and S(u)=sum_(p<=Q) a_p cos(u log p). The earlier bound gives L=-S+R with |R|<=C(s0). Consequently

|mu+integral S dnu|<=C(s0),
sqrt(Var_nu L)<=sqrt(Var_nu S)+C(s0).                       (3)

The second inequality is the L2 triangle inequality after centering, using Var(R)<=integral R^2<=C^2. It pays all higher prime powers uniformly.

For a target at the center height T, the rectangle and its left harmonic measure are symmetric about T. Define the real even transform
phi(lambda)=integral cos((u-T)lambda)dnu(u).
Then

integral S dnu=sum_p a_p cos(T log p) phi(log p),             (4)

Var_nu S=sum_(p,q<=Q) a_p a_q K_T(p,q),                      (5)

K_T(p,q)= [cos(T log(p/q))phi(log(p/q))
          +cos(T log(pq))phi(log(pq))]/2
          -cos(T log p)cos(T log q)phi(log p)phi(log q).

These formulas follow by multiplying cosines. They retain the actual carrier, every fixed prime coefficient, and the centering term. The covariance matrix is positive semidefinite, but individual off-diagonal entries have no fixed sign.

The diagonal contribution in (5) is at most sum_p a_p^2 <= sum_(n>=2)n^(-2s0), a finite absolute constant. Thus the remaining issue is the SIGNED off-diagonal sum, together with the mean (4), not a large diagonal or a higher-power tail. Enlarging the prime set or replacing its coefficients by arbitrary phase weights is not justified as an upper-bound improvement.

## 3. Why an immediate local mean-value estimate does not suffice

For a dyadic block P<p<=2P with weights of size P^(-s0), the ordinary Dirichlet-polynomial mean-value theorem on a carrier interval of length ell gives an allowance

(ell+P) sum_(P<p<=2P)|a_p|^2
 << (ell+P) P^(1-2s0)/log P.                               (6)

The translation to a carrier T changes coefficients by unit phases and hence does not affect this VALID upper bound. This use of a coefficient-uniform theorem does not assume the false stronger coefficient-uniform saving. It simply loses the signs in (5).

For a bounded-density local probability measure supported in the rectangle, the same theorem may be applied after bounding that density and restricting its support; this only adds its explicit density factor. If ell is logarithmic in T and P=T^alpha, the P term in (6) is

T^(alpha(2-2s0))/log T = T^(83 alpha/250)/log T,              (7)

up to fixed factors. It cannot certify a logarithmic-squared covariance allowance. This is a failure of the bound, not an actual lower bound on the variance. A more carefully weighted local theorem might improve it, but must keep the signed T-dependent correlation in (5).

Small primes can already be paid without signs: if Z=(log T)^6, the elementary prime-counting upper bound gives sum_(p<=Z)p^(-s0) << Z^(1-s0)/log Z = (log T)^(249/250)/loglog T, so their entire contribution is o(log T), and their variance is o(log^2 T). This recovers a known project scale, not a new global gain. Cross-covariances with the remaining primes can be paid by the L2 triangle inequality only AFTER the large-prime variance has been bounded.

## 4. Exact remaining candidate lemma

For every sufficiently large T and every target real part on the proposed curve, using that target's finite-rectangle harmonic measure, establish (4) with a margin placing a=c+mu inside (0,Btarget), and the actual signed covariance (5) below 4a(Btarget-a), after the explicit power-tail payment (3). Constants and onset must be effective and all target carriers covered.

A sufficient stronger version would bound the large-prime covariance by a suitably small explicit constant times log^2 T and the signed mean by the remaining logarithmic margin. A standard average over T<=u<=2T does not prove this local statement. The checked local mean-value input does not close it, and the reciprocal twin identity does not cancel the positive clipping cost.

Primary mean-value reference inspected: Teravainen, Topics in multiplicative number theory, embedded paper Almost primes in almost all short intervals, Lemma 3, printed p253 (PDF p78), https://users.utu.fi/jopete/wp-content/uploads/sites/195/2018/08/PhD_thesis_Teravainen.pdf#page=78. Formula (6) is its direct dyadic weighted application with a standard prime-counting upper bound. No new arithmetic cancellation theorem is asserted.
