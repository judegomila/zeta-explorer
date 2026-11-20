# A quantitative admissible partition, and its unpaid neighboring payment

This companion preserves the reviewed tree packet. It quantifies availability of old positive metrics in both parity ladders, conditional only on the actual known global old block. It does not prove the next global pivot or neighboring compensation.

## 1. An all-degree full-theta local error

Write z=pi exp(2u), u>=0, and ell=log psi. For z>=100 and complex |w|<=1/16,
 psi(u+w)=8 pi^2 exp(9(u+w)/2-z exp(2w)) (1-3/(2z exp(2w))) (1+r(w)),
 r(w)=sum_{n>=2} n^4 [(1-3/(2n^2 Z))/(1-3/(2Z))] exp(-(n^2-1)Z), Z=z exp(2w).
The bracket is of modulus<2. Indeed |Z|>=7z/8 and Re Z> (17/20)z, since exp(-1/8)>=7/8 and cos(1/8)>=127/128. Using n^4<=16*6^(n-2) and n^2-1>=3+5(n-2),
 |r(w)| <=32 exp(-51z/20)/(1-6 exp(-17z/4)) <1/100.
Also |3/(2Z)|<=12/(7z). The power-series logarithms of both final factors are analytic on this disk and their sum E(w) has modulus<1. Thus
 ell(u+w)=constant+9w/2-z exp(2w)+E(w),
 |[w^j]E(w)|<=16^j.                                      (1)
This is an explicit full-orbit complex bound, not a truncated orbit calculation.

The normalized moment generating series is
 exp(ell(u+i x/sqrt(8z))+ell(u-i x/sqrt(8z))-2ell(u))
 =exp(x^2/2+Delta(x)).
Its x^(2j) coefficient times (2j)! equals g_j(u)/(2z)^j. The coefficient absolute sum of Delta at x=1 is bounded, for z>=64, by
 sum_{l>=2} 2/[2^l(2l)!z^(l-1)] + sum_{l>=1}2(32/z)^l <=130/z.
Consequently, for z>=260,
 |g_j/(2z)^j-(2j-1)!!| <=500(2j)!/z, j>=1; g0=1.        (2)
Here coefficient domination by exp(x^2/2)(exp(|Delta|)-1) and exp(y)-1<=2y for0<=y<=1/2 prove the constant. This estimate holds simultaneously at every finite derivative order; no fixed-order asymptotic remainder is hidden.

## 2. Explicit positive far-tail metric

For parity epsilon=0 or1 and old basis t^(2i+epsilon),0<=i<=n, let m=2n+epsilon. After congruence by diag((2z)^(-i-epsilon/2)), the local matrix differs entrywise from the Gaussian Gram
 G_ij=(2(i+j+epsilon)-1)!!
by at most500(2m)!/z. Define
 T=sum_{i=0}^n(4i+2epsilon-1)!!,
 eta=prod_{i=0}^n (2i+epsilon)! / T^n.
The Gaussian determinant is the product of the monic Hermite norms (2i+epsilon)!, so lambda_min(G)>=eta>0. This includes n=0. Hence
 Z_loc(n,epsilon)=max(260,1000(n+1)(2m)!/eta)              (3)
ensures the congruent local old matrix>=eta I/2 for every z>=Z_loc. Integration over any nonempty interval there is positive definite. Applying (3) with n+1 instead gives positive local *target* matrices in the remote tail, without any assumption about the next original global pivot.

## 3. Actual-prefix conditioning enters the core cutoff

Let A be the already-proved global old matrix in the stated monomial coordinates, and let lambda>0 be a certified lower bound for lambda_min(A). It is not replaced by a parent norm. Formula(2) gives |g_j|<=3(2j)!(2z)^j for z>=260. The real full-theta estimate psi<=16 z^2 exp(u/2-z), u^2<=z, and du=dz/(2z) give the absolute full-line tail moment bound, when Z>=max(260,j+9/2),
 |M_j(|u|>=H)| <= C_j Z^(j+9/2) exp(-2Z),
 C_j=768 (2j)!2^j/sqrt(pi), Z=pi exp(2H).                (4)
Indeed the remaining integral has logarithmic derivative at most-1. With m=2n+epsilon and C=768(2m)!2^m/sqrt(pi), all old entries obey this bound with j replaced by m. Since log Z<=sqrt Z, for Z>=(m+9/2)^2 their absolute values are at most C exp(-Z).

Thus any Z strictly larger than
 max(Z_loc(n+1,epsilon), (m+9/2)^2, log(2(n+1)C/lambda))  (5)
produces an admissible two-leaf partition: its old tail is positive, its old core is >=lambda I/2, and its remote *target* tail is positive. H=log(Z/pi)/2. Taking a rational upper bound larger by1 removes equality issues. No unknown target moment or inverse appears in this cutoff.

For n tending to infinity at fixed parity, Stirling bounds give log Z_loc(n,epsilon)=n^2 log n+O(n^2). Thus the degree-only part of this conservative construction has H=(1/2)n^2 log n+O(n^2); actual-prefix conditioning in (5) may increase it further. This describes this chosen sufficient bound, not a necessary cutoff for theta. The factorial/Gaussian-conditioning loss in (3) is explicit. This is a degree-dependent, actual-prefix-conditioned availability bound; it is not a bound on compensation or a degree-uniform partition.

## 4. Why this does not pay the neighboring merge

Let C be this core and M any finite adjacent shell entirely in the positive-local zone. Then A_C and A_M are positive old metrics and the shell target is positive. The exact merge still reads
 S_(C+M)=s_C+s_M+(z_C-z_M)^T(A_C^-1+A_M^-1)^-1(z_C-z_M).
Neither (1)-(5) bounds s_C from below or forces a nonzero optimizer difference. In particular target positivity of M alone does not establish core-plus-shell positivity.

Moreover A_M<=A_tail in this local-positive region, so any A_C<=gamma A_M entails A_C<=gamma A_tail. The previously proved scalar-monomial theta estimates therefore still force, at H>=2,
 gamma_even >=(.003 sqrt(pi)/256) exp(2Z)/Z^(9/2),
 gamma_odd >=(.03 sqrt(pi)/4608) exp(2Z)/Z^(11/2).
The lower core masses were independently certified on the smaller existing cores and persist for these lowest scalar densities, which are positive. This is a rigorous conditioning obstruction to applying the new *remote* admissible cutoff as a cheap neighboring-payment construction. It does not exclude a much nearer admissible shell, nor a tree which first pays a signed inner core using such a nearer shell, as the finite examples already do.

The useful advance is explicit all-degree availability without next-pivot input. The remaining theta-specific task is a nearer-region signed comparison retaining the actual inverse and optimizer difference. No uniform success or new finite rung is claimed.
