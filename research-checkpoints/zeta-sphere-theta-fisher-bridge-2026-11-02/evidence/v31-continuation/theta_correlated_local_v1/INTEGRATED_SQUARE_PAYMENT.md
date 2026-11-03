# Integrated square payments for the next odd and even families

Independent analytic and64000-cell numerical replay PASS. These are structural tests of already-known cubic and quartic families, not new ladder degrees or an all-order proof.

Use w(u)=u²psi(u)² on the full real line. Set k=(log psi)'', and write k2=k'', k4=k'''', k6=k''''''. Define local moments
 g0=1,
 g1=-k/2,
 g2=3k²/4+k2/8,
 g3=-15k³/8-15k k2/16-k4/32,
 g4=105k^4/16+105k²k2/16+35k2²/64+7k k4/16+k6/128.
These follow exactly by differentiating psi(u+r)psi(u-r); global moments are Mj=integral w gj=mu_j/(4pi).

The previously proved inequalities k<-17 and4k²+k2>1254 give g1>17/2 and s2:=g2-g1²>1254/8. Only these *old* local blocks are assumed positive below. No sign of the next local remainder is assumed.

## 1. Odd cubic family

For p=t³-beta t put
 r3(u)=g3-g2²/g1,
 beta_*(u)=g2/g1,
 beta_bar=M2/M1.
Exact completion and integration give
 h[p]/(4pi)=M1(beta-beta_bar)²+R3+V3,
 R3=integral w r3,
 V3=integral w g1(beta_*-beta_bar)²>=0.              (1)
The actual global prefix-selected residual uses beta_bar. Its Schur margin is
 S3=M3-M2²/M1=R3+V3.
The numerator and denominator in beta_bar are actual known lower moments, not a next-pivot normalization. Negative local r3, if present, stay in R3 and can be paid by positive regions or V3.

## 2. Even quartic family

For p=t4+c t²+d let z=(d,c)^T,
 A(u)=[[1,g1],[g1,g2]], b(u)=(g2,g3)^T,
 z_*(u)=-A(u)^(-1)b(u), r4=g4-b^T A^(-1)b.
Equivalently r4=g4-g2²-(g3-g1g2)²/s2.
Let Abar=integral w A and Bbar=integral w b, zbar=-Abar^(-1)Bbar. Then
 h[p]/(4pi)=(z-zbar)^T Abar(z-zbar)+R4+V4,
 R4=integral w r4,
 V4=integral w(z_*-zbar)^T A(z_*-zbar)>=0.           (2)
Here S4=R4+V4 equals the true integrated Schur expression
 M4-M2²/M0-(M3-M1 M2/M0)²/(M2-M1²/M0).
The actual old inverse is preserved. The variance term is not a replacement parent norm: it arises by exact integration of the known local quadratic forms.

## 3. Full-theta integrated certificate

`check_integrated_square_payment.py` integrates M0..M4,R3,R4 directly as signed interval quantities on u in[0,2], using the even factor2 and interval rectangles. It does NOT check or demand r3>=0 or r4>=0 at every point, and does not replace either remainder by its positive part. It uses a stable complete-orbit series for ell=log psi through derivative8. Both local old denominators and actual integrated old inverses are checked positive.

For z=pi exp(2u), r=sum_(n>=2)A_n exp(-(n²-1)z), A_n=n4+3n²(n²-1)/(2z-3). The geometric proof in THETA_CURVATURE_PAYMENT extends through derivative8. Since
 (1/2)(1-3/(2pi))^-9<400 and3*400/pi<512,
 |D^j A_n|<=512 n4 2^j j!, j<=8.
Leibniz with |D^l exp(-dz)|<=4^l l!(dz)^l exp(-dz) yields
 |D^j r_n|<=C n20 z8 exp(-(n²-1)z),
 C=1024*8!*4^8.
The n>=9 ratio is <=(10/9)^20 exp(-19pi)<1/2. Thus all omitted derivative orders0..8 are bounded by
                   2C*9^20*z8 exp(-80z).           (3)
The checker adds this error divided by j! to each Taylor coefficient before taking log(1+r). Included orbit indices are n2..8; this is not an uncontrolled finite-orbit approximation.

## 4. Entire spatial-tail envelopes

For z>=100 the derivative estimate on A_n improves to2 n4 2^j j! for every j<=8, since(1/2)(1-3/200)^-9<1. Therefore all derivatives D^j r are bounded by
 epsilon(z)=8*8!*4^8*2^20*z8 exp(-3z)<1e-10.
The envelope decreases on z>=100. The logarithmic composition formula bounds |D^j log(1+r)| by j! epsilon(1+epsilon)^(j-1)<1 for j<=8. Using the single-orbit logarithm,
 |ell^(j)|<=2^j z+2^j(j-1)!a/(1-a)^j+1
            <2^(j+2)j!z,
 a=3/(2z), j=2,...,8. The displayed rational comparison is checked at100 and improves as z grows.

The even-derivative generating function then bounds
 |gj|<=(2j)! (9z)^j, j=1,...,4.                     (4)
Indeed after the4^-j scaling each exponent coefficient has magnitude<=8z; the jth coefficient of exp(8z x/(1-x)) is at most8z(1+8z)^(j-1)<=(9z)^j. Explicit constants for g0..g4 are1,18,1944,524880,264539520 times z^j.

Using g1>17/2 and s2>1254/8 in the exact rational expressions,
 |r3|<=5e6 z4,
 |r4|<=4e9 z6.                                    (5)
For example the r4 constant bounds264539520+1944²+(524880+18*1944)²/(1254/8), which is below4e9. No next remainder sign enters these bounds.

Also psi<=16 exp(u/2)z²exp(-z), and u²<=z for z>=100. The full two-sided omitted integral past u=2 of a quantity bounded by B z^d is at most
 (256/sqrt(pi)) B Z^(9/2+d) exp(-2Z),
 Z=pi exp4>100,                                   (6)
because du=dz/(2z), evenness supplies the factor2, and the remaining integral is bounded by its starting value when Z>=9/2+d. All seven explicit errors are retained symmetrically, even though some signs could be improved.

## 5. Results and honest interpretation

The8000-cell run already certifies R3>269,R4>10453 and positive true Schur margins. Its subtraction intervals for V3,V4 are too wide to resolve strictly positive quantitative gains; mathematical nonnegativity still follows from(1)-(2). This failed quantitative resolution is preserved.

The64000-cell run gives directed lower bounds R3>275.31, R4>11644.67, S3>287.59, S4>12983.08, V3>10.54, and V4>1001.67. These are in the normalized h/(4pi) units. Final directed values are recorded in `integrated_square_payment_64000.json`; short Arb display strings should not replace those endpoints. No finite success is extrapolated. The formulas demonstrate an integrated payment with the exact global inverse, and keep all signed central and tail contributions. They do not establish that local negative contributions actually occur at these low degrees, nor claim that an unobserved negative region was paid.

The method's limitation is explicit: positivity of the required old local A is proved here only for the small blocks used. Assuming it for arbitrarily high old degree would revive the disproved all-degree pointwise-PSD shortcut. If an old local block becomes indefinite, the exact decomposition can still be written where invertible, but its variation term no longer has a free nonnegative sign. Higher-degree progress must control that signed term, or use a different genuinely integrated metric. Equations(1)-(2) alone do not close that gap.
