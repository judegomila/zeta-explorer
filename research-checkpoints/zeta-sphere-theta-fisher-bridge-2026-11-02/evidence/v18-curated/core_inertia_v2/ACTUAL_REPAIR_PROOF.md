# Actual tail-reserve repair on the certified three-dimensional core subspace

Status: interval computation and independent full replay/analytic audit passed.

Scope remains normalized a=0, core [0,1/16], first two odd channels eliminated, and the fixed three-dimensional rational residual witness space Z. This is not positivity of the entire degree19 matrix, nor an all-shift or all-degree claim.

## Reflected identity
The full zero-shift moments satisfy, for n>=1,

mu_n=4^n [2 int_0^infty h²(psi^(n))² dh − n int_0^infty (psi^(n−1))² dh].

For n=0 retain only the first term. This follows from the reflected small-shift square identity with p=D^n and integration by parts int h f'f=−(1/2)int f². Boundary terms vanish at h=0 and at infinity. The 4^n normalization is essential and agrees directly with the n=1,2 derivative calculation.

## Certified reflected quadrature
The new checker independently integrates this expression on [0,3] using768cells of width1/256 and Taylor degree20. It uses full-theta derivatives through39, with the same exact polynomial recurrence and full infinite theta-tail enclosure as the core certificate. Weight derivatives are exactly differentiated. All arithmetic is interval arithmetic at100decimal digits.

For h in complex disks radius R=1/20 around the real midpoints and |v|<=3/10, u=h+v obeys |Imu|<=.35 and -.35<=Reu<=3.35. For z=pi exp(2u), Re z>1 and |z|<=4Re z/3. Put y=n² Re z. Then

|(2z²n^4−3zn²)exp(−zn²)| <= [(32/9)y²+4y]exp(−y).

Use y²exp(−y/2)<=16/e²<3, y exp(−y/2)<=2/e<1 and sum exp(−n²/2)<2. Also 4exp(Reu/2)<24. Therefore |psi(u)|<704<1000 uniformly on this rectangle.

Cauchy in v yields |psi^(n)(h)|<=1000 n! r^(-n), r=3/10. Since 2|h|²<20, the reflected density is bounded in each h-disk by

M_n=10^6 4^n [20(n!)²r^(-2n)+n((n−1)!)²r^(-2n+2)],

with second term omitted at n=0. The global Taylor remainder is bounded by 3 M_n q^21/(1−q), q=delta/(2R)=5/128. This is explicitly added to each moment interval.

## Infinite spatial tail
For real h>=3, z=pi exp(2h)>1200. Let B_k=2^(-k)sum|coeff Q_k|. The full theta sum is bounded by twice its polynomial-exponential n=1 majorant (successive ratios are <1/2). Thus

|psi^(k)(h)| <=8 exp(h/2) B_k z^(k+2)exp(−z).

Using exp(h)<=z, h²<=z², dh=dz/(2z), and for p<=44

int_1200^infty z^p exp(−2z)dz <=1200^p exp(−2400)

(the logarithmic derivative is at most −2+p/1200<−1), the total omitted density is bounded by

64·4^n B_n² 1200^(2n+6)exp(−2400)
+32n·4^n B_(n−1)² 1200^(2n+2)exp(−2400).

The checker adds this symmetric bound as well.

## Actual Schur repair
Subtract the certified core moments from the certified full moments to form the actual tail T, without uncertain numerical cancellation. Check positivity of Ac,At before inversion. Compute the exact Schur components and binary covariance term using interval matrix arithmetic. Restrict to the fixed rational residual witness coordinates Z. Positive LDL pivots of Z*St Z and Z*(Sc+St+covariance)Z certify actual tail positivity and complete repair on this three-dimensional space. No extrapolation to its complement is permitted.

A stronger optional check tests Z*(St+600 Sc)Z>0. As Z*Sc Z<0 is already certified, success would prove actual tail reserve exceeds600times the negative core Schur cost on the entire three-dimensional witness space, even before adding nonnegative covariance.

The executed factor600 test passed with LDL lower pivots5285.2602327492,2.2374829820,0.0050766487862. This certifies the stated restricted inequality with independent verification of the checker and analytic bounds.

Certificate chaining: when reloading100-digit decimal moment endpoints, the evaluator expands each interval by ±10^(-90)(1+|lower|+|upper|), computed outward in interval arithmetic. This dominates endpoint decimal serialization rounding and is negligible compared with all reported margins.
