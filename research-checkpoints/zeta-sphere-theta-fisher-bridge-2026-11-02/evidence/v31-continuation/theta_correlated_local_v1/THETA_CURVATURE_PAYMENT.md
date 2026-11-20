# A correlated complete-theta square payment at degree two

Independent analytic review and independent compact interval replay PASS. This is a structural proof at an already-known rung, not a new ladder extension or an all-degree argument.

Put ell=log psi and k=ell''. The complete positive even theta profile is unchanged. For every real alpha and p(t)=t²-alpha, exact differentiation of
 psi(u+r)psi(u-r)=psi(u)² exp(2 sum_(j>=1)ell^(2j)(u)r^(2j)/(2j)!)
gives
 h[p]/(4pi)=integral u²psi(u)²[(alpha+k/2)²+(4k²+k'')/8]du.   (1)
Equivalently this follows by integration by parts from the root-deletion energy identity. All boundary terms vanish by complete-theta decay and evenness. The actual inverse-selected alpha is included, but no value or sign of a next pivot is assumed.

We prove the full-theta pointwise bound
                 4k(u)²+k''(u)>1254, for every real u.       (2)
Consequently (1) is strictly positive, even uniformly for every real alpha. In particular h[p]>(1254/8)h[1], where h[1]=4pi integral u²psi². This establishes a correlated compensation without separate Y or D positivity.

## 0. Common-metric identity for both actual parity ladders

For any real polynomial p, integration by parts on the real Fourier axis gives
 h[p]=2||(pF)'||_2²+integral (p p''-(p')²)F².
If p is the actual current-prefix-selected monic polynomial, its real simple roots r_j follow from the positive known prefix Jacobi matrix, not a next-pivot assumption. Then
 h[p]=2||(pF)'||_2²-sum_j||[p/(t-r_j)]F||_2².       (3)
Both parity ladders are included, with all root-deletion costs retained. Under Parseval this is2pi times
 2 integral u²|p(-iD)psi|²-sum_j integral|[p/(t-r_j)](-iD)psi|².
The quotient polynomials are known lower-degree expressions, but their positive-parent norms cannot be substituted for the signed target. Formula(1) supplies an actual theta payment for degree2; no analogous uniform domination of the sum in(3) has been proved. In the initial odd case p=t, the same integration by parts gives h/(2pi)=-integral u²psi² k>0 using k<-17.

## 1. Stable complete-orbit logarithmic differentiation

For u>=0 set z=pi exp(2u), D=2z d/dz. Write psi=f1(1+r),
 r=sum_(n>=2) r_n,
 r_n=A_n(z) exp(-(n²-1)z),
 A_n=n²(2n²z-3)/(2z-3)=n^4+3n²(n²-1)/(2z-3).
All r_n are positive. The single-orbit curvature and its second derivative are
 k1=-4z-24z/(2z-3)²,
 k1''=-16z-96z(4z²+24z+9)/(2z-3)^4.
If delta=log(1+r), then k=k1+delta'', k''=k1''+delta''''.
The exact delta derivatives are evaluated from r,...,D4r by the ordinary logarithmic quotient formulas.

In the compact checker, each r_n and its first four derivatives are formed using score differences. The needed derivatives of 6/(2z-3)-2z are
 -24z/(2z-3)²-4z,
 48z(2z+3)/(2z-3)³-8z,
 -96z(4z²+24z+9)/(2z-3)^4-16z.
For v=D log r_n and x=Dv,y=D²v,w=D³v, the derivative multipliers are
 1, v, v²+x, v³+3vx+y, v4+6v²x+3x²+4vy+w.
This avoids unstable cancellation of large raw psi derivatives.

## 2. Uniform derivative tail, with all constants

For 0<=j<=4 and z>=pi, expand
 1/(2z-3)=(1/(2z))sum_(l>=0)(3/(2z))^l.
Since sum_(l>=0)(l+1)^j x^l <= j!/(1-x)^(j+1),
 |D^j(1/(2z-3))| <= [2^j j!/(2z)](1-3/(2z))^(-j-1).
The elementary interval check (1/2)(1-3/(2pi))^-5<14 gives
 |D^j A_n| <=16 n^4 2^j j!,                         (3)
including j=0 separately. For j>=1 use3*14/pi<16; for j=0 use A_n<2n4.

Let d=n²-1. For 0<=l<=4, the Stirling-number formula gives
 |D^l exp(-dz)| <=4^l l!(dz)^l exp(-dz),             (4)
because D^l=2^l sum Stirling(l,m) z^m partial_z^m, dz>=1, and the Bell number is <=l!. Leibniz and sum_(i=0)^j(2dz)^(-i)<=2 yield
 |D^j r_n| <=32 n^4 j!4^j(n²z)^j exp(-(n²-1)z)
            <=196608 n^12 z4 exp(-(n²-1)z).         (5)
For n>=9 the consecutive-term ratio is at most(10/9)^12 exp(-19pi)<1/2. Therefore the omitted n>=9 derivative tail, for every j<=4, is at most
       393216*9^12*z4 exp(-80z).                   (6)
This is a full-theta derivative bound, not a fixed-orbit approximation assumption.

## 3. Compact interval certificate

`check_theta_curvature_square.py` uses 160-bit Arb on4000 closed cells covering u in[0,1], each of width1/4000. It sums r_n and derivatives for n2..8 and adds the symmetric error (6) to each derivative. The denominator1+r is checked positive before computing delta'',delta''''. Its smallest directed lower bound for4k²+k'' exceeds1254.97168. `theta_curvature_square.json` records the precise bound.

The interval output is independently reproducible; no external certificate program is executed. The older naive raw-psi derivative scheme is preserved as a failed enclosure attempt, not a counterexample.

## 4. Analytic entire outer tail

For z>=20, improve (3) to |D^j A_n|<=2 n4 2^j j!. For j>=1 use(1/2)(1-3/40)^-5<1 and3/z<=3/20; j0 follows directly. The same Leibniz proof improves196608 in(5) to24576. For n>=2 the consecutive ratio is <=(3/2)^12 exp(-5z)<1/2, hence
 |D^j r| <=201326592 z4 exp(-3z) <=epsilon<3e-13,
 for all j<=4. The displayed envelope decreases for z>=20.
Since r>=0,
 |delta''|<=epsilon+epsilon²,
 |delta''''|<=epsilon+7epsilon²+12epsilon³+6epsilon4<1e-12.
Also
 96z(4z²+24z+9)/(2z-3)^4 <=3, z>=20,
by evaluating its decreasing normalized expression at20. Thus k<=-4z+1 and k''>=-16z-4. Consequently
 4k²+k'' >=4(4z-1)²-16z-4>1254, z>=20.
The compact interval reaches z=pi e²>20, so the regions overlap. Evenness covers negative u.

## 5. Exact scope and higher-degree obstruction

The identity is correlated: the negative Y component seen in actual even1 is paid within a square plus a positive *complete-theta* curvature remainder. It neither discards the negative arithmetic terms nor relies on filtered positivity or an unknown target norm.

This does not validate local positivity at every degree. Higher-degree polynomial source matrices arise from the same exponential even-derivative generating function, involving ell^(6),ell^(8),... . Demanding all of those local matrices be PSD returns to the already-disproved universal pointwise/tail positivity shortcut. The next task would require a genuinely integrated compensation mechanism, or explicit control of only the particular inverse-selected direction; (2) alone supplies neither. No all-degree inference is made.
