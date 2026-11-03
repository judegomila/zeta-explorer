# Uniform full-theta spatial growth in the positive parent jet metric

Status: new all-degree analytic lemma with own Arb low-frequency constants; independent audit requested. This is NOT positivity of the signed bridge and does not assume RH.

## Statement
Let psi be the complete theta profile used throughout the campaign. For 0<=a<=1/2 and 0<=lambda<=1 put g(u)=e^{au+lambda u²}psi(u). For any complex polynomial p of degree at most n let f=p(-iD)g, w=n+1, H_n=log(10w), and P=integral_R |f|²du. Then
 integral_{|u|>=H_n}(1+u⁴)|f(u)|²du <= exp(-250w²) P.
Consequently
 norm(u²f)_2 <=sqrt(H_n⁴+exp(-250w²)) norm(f)_2 <(H_n²+1)norm(f)_2,
 norm(uf)_2 <(H_n+1)norm(f)_2.
The estimate is uniform over ALL coefficients, finite derivative degrees and the stated parameters. It controls raised spatial moments without invoking higher derivative norms.

The metric P is the genuine positive physical/parent Fourier L2 metric. It is NOT the signed Schur residual integral u|f|², and no lower comparison between those two metrics is asserted.

## 1. Explicit theta derivative tail bounds
For h>=0, z=pi exp(2h),
 psi^(j)(h)=4exp(h/2) sum_{m>=1}P_j(zm²)exp(-zm²),
 P_0=-3z+2z²,
 P_{j+1}=P_j/2+2z(P_j'-P_j).
The polynomial degree is j+2 and its coefficient l1 norm satisfies
 C_{j+1}<=(2j+13/2)C_j, C_0=5.
Thus for j<=n, C_j<=C_n^*=5(2n+5)^n. For z>=1, |P_j(z)|<=C_n^* z^{n+2}.

For h>=H_n, z>=300w². Consecutive terms of m^{2n+4}exp(-zm²) have ratio at most2^{2n+4}exp(-3z)<1/2. Hence, with ALL orbits retained,
 |psi^(j)(+/-h)| <=8 C_n^* exp(h/2) z^{n+2}exp(-z), j<=n.

For E(u)=exp(au+lambda u²), Cauchy's derivative estimate on the unit complex circle about +/-h gives
 |E^(r)(+/-h)| <=r! exp(h²+(5/2)h+3/2).
Leibniz and sum_{j>=0}1/j!<3 therefore give, for k<=n,
 |g^(k)(+/-h)| <=24 n! C_n^* exp(h²+3h+3/2) z^{n+2}exp(-z).
If c is the monomial coefficient vector of p, Cauchy on the finite derivative sum yields
 |f(+/-h)|² <=||c||² exp(B(h)-2z),
 B(h)=log14400+log w+n log25+4n log w+2h²+6h+3+(2n+4)log z.
Here n!<=w^n and2n+5<=5w were used.

At h=H_n, use log w<=w-1, H_n<w+2, log pi<2, log14400<10, log25<4. Then
 B(H_n)<=10w²+27w+44<=81w² < z(H_n)/2.
Also B'(h)=4h+4n+14, while (z/2)'=z. At H_n the former is at most8w+18<300w²; the difference z-B' increases thereafter. Thus B(h)<=z/2 for every h>=H_n, and
 |f(+/-h)|² <=||c||² exp(-3z/2) <=||c||²exp(-z).
This estimate has not used any spectral sign or norm coercivity.

## 2. Low-frequency positive-parent coercivity
Let F_lambda(z)=integral_0^infinity e^{lambda u²}psi(u)cos(zu)du. Define
 A0=integral_0^infinity psi(u)du,
 B0=integral_0^infinity u² e^{u²}cosh(u/2)psi(u)du.
The own-source Arb rectangle calculation check_constants.py encloses A0>1/3 and B0<1/6; actual directed bounds are stored in constants.json. It includes the complete theta orbit and spatial tails (see below).
For |t|<=1, cos(tu)>=1-t²u²/2 gives
 Re F_lambda(t+ia)>=A0-B0/2>1/4,
uniformly in a,lambda. No assertion about frequencies outside this fixed interval is needed.

For any polynomial degree<=n, elementary Chebyshev coefficient bounds give ||c||_2<=3^{n+1} sup_{[-1,1]}|p|. The Legendre reproducing kernel gives
 sup_{[-1,1]}|p|² <=(n+1)²/2 integral_{-1}^1|p|².
For completeness, the latter follows by expanding in orthogonal Legendre polynomials, using their squared norms2/(2j+1) and |P_j(x)|<=1 on[-1,1]. The bound |P_j|<=1 follows from its elementary Laplace integral representation. Standard normalization reference: https://dlmf.nist.gov/18.3 .
For the Chebyshev step, each expansion coefficient has magnitude at most2sup|p|, and coefficient l1 norms of T_j obey L_{j+1}<=2L_j+L_{j-1}, hence L_j<3^j; summing gives the stated3^{n+1} bound.

Since Fourier(g)(t)=2F_lambda(t+ia), Parseval yields
 P=(2/pi) integral_R |p(t)|²|F_lambda(t+ia)|²dt
 >= ||c||²/[4pi *9^w w²]
 > ||c||²/[16*9^w w²].
This is coefficient control in a known POSITIVE parent metric, not the unknown signed bridge metric.

## 3. Relative tail and spatial multiplication bound
For h=H_n+r, z>=300w²+600w²r and H_n<=3w. Thus the pointwise estimate from Section1 gives
 integral_{|u|>=H_n}(1+u⁴)|f|²
 <=2||c||² exp(-300w²) integral_0^infinity [1+(H_n+r)⁴]exp(-600w²r)dr
 <=3w²exp(-300w²)||c||².
Indeed the elementary integral divided by w² is at most
 82/600+108/600²+108/600³+72/600⁴+24/600⁵<1.
Combining with Section2 gives a relative tail at most
 48*9^w*w⁴exp(-300w²)P <=exp(-250w²)P,
because log48+w log9+4logw<7w<=50w². The spatial multiplication inequalities follow by splitting at H_n; u²<=1+u⁴ on the tail.

## 4. Complete-tail details for the Arb constants
On [0,3], check_constants.py uses6000 enclosing rectangles and ten theta orbits. The missing orbit sum is bounded uniformly by10^{-140}: for j=0 one may use the already conservative polynomial bound166z⁴, giving
 664 sum_{m>=11}(3m²)^5exp(-3m²)
 <=664*363^5exp(-363)/(1-10^{-20})<10^{-140}.
The ratio guard is (12/11)^10exp(-69)<10^{-20}. These numerical inequalities are checked with Arb.
For h>=3, Section1 applied at n0 gives e^{h²+h/2}psi(h)<=exp(-3z/4)<=exp(-z/2), since H_0=log10<3. Therefore both A0's tail and B0's tail are dominated by polynomial multiples of exp(-600-1200(h-3)), far below10^{-100}. The code adds symmetric radius10^{-100} to both integrals. This tail argument uses only Section1, not the low-frequency coercivity, so there is no circular dependence.

## 5. What this pays, and what remains unpaid
For F=Tg of degree n, K=T'g, L=T''g, all spatial multiplication factors in the compensated/gauged forcing can now be paid using H_n=O(log n) and the positive parent norms of F,K,L, without a higher-jet norm. For example,
 integral |u|³F² <=(H_n²+1)(H_n+1)||F||²,
 integral u²|FK| <=(H_n²+1)||F||||K||,
 integral |uFL| <=(H_n+1)||F||||L||.
These are unconditional full-theta estimates. They do NOT replace the needed comparison of positive parent/lower-rung quantities with the signed Schur surplus. A growing spatial cutoff also does not justify fixed finite-orbit approximations to high jets: every theta orbit was retained in the bounds.
