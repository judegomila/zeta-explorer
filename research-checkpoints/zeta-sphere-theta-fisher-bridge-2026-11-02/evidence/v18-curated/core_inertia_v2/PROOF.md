# Three independent negative core directions (interval certificate and independent review passed)

Scope: normalized shift **a=0**, spatial core **[0,1/16]**, full theta profile. This is not an obstruction to the full integrated kernel or RH.

Let m_n(h)=(-1)^n d_v^{2n}[psi(h-v)psi(h+v)] at v=0 and mu_n=int_0^(1/16) 2h² m_n(h)dh. The odd degree-19 core moment matrix is [mu_(i+j+1)] for 0<=i,j<=9. `witnesses.json` supplies three exact rational coefficient vectors; floating eigenvectors only select these candidates. Interval evaluation of their actual Gram matrix followed by positive LDL pivots for its negative proves negative index at least three.

## Full theta derivative enclosures
Write z=pi exp(2h). Then psi^(k)(h)=4 exp(h/2)2^(-k) sum_(n>=1) Q_k(zn²)exp(-zn²), where Q_0=2z²-3z and Q_(k+1)=(1-4z)Q_k+4z Q'_k. All polynomial coefficients are integers. Derivatives through 58 are enclosed at exact dyadic real midpoints using interval arithmetic at 100 decimal digits. Terms n<=16 are explicitly summed. Since z>=3 and deg Q_k=k+2, the absolute omitted tail is bounded by

8 exp(h/2)2^(-k) (sum|coeff Q_k|) z^(k+2)17^(2k+4)exp(-289z).

The positive majorant's successive-term ratio is at most (18/17)^120 exp(-105)<1/2, uniformly k<=58; subsequent ratios decrease. Thus the factor two tail summation is valid. For example (18/17)^120<2^120 and exp(-105)<2^(-140), using exp(3/4)>2.

## Taylor quadrature and rigorous remainder
Use 64 cells of width delta=1/1024, exact midpoint h. For each n=1,...,19, integrate the Taylor polynomial through degree20 for f_n(h)=2h² m_n(h). Only even derivatives contribute, with coefficient delta^(j+1)/(2^j (j+1)!). Product derivatives are computed from coefficients of (1-t)^(2n)(1+t)^j; the weight derivatives are 2h²,4h,4. Maximal psi derivative order is 38+20=58.

For the remainder, take complex h within R=1/20 of a midpoint, and complex v with |v|<=3/10. Then u=h±v has |Im u|<=7/20, -7/20<=Re u<=33/80. Therefore Re(pi exp(2u))>1 and |pi exp(2u)|<10. Indeed pi>3, exp(-7/10)>4/9, cos(7/10)>=151/200, whose product is151/150>1. Also pi<22/7 and exp(33/40)<3. The elementary exp bounds follow directly from its positive series and geometric tail estimates.

Furthermore 4exp(Re u/2)<6, and sum n^4 exp(-n²)<2: bound by sum n^4 2^(-n²); its first three terms total 1/2+1+81/512, and from n=4 the first term is1/256 with subsequent ratio<1/100. The n² sum is no larger. Hence |psi(u)|<6(200+30)2=2760<3000. Since |2h²|<=2(1/16+1/20)²<.026, Cauchy's v estimate yields

|f_n(h)| <= M_n=10^6 (2n)! (10/3)^(2n).

Cauchy in h bounds Taylor coefficient j by M_n/R^j. With q=delta/(2R)=5/512, the total absolute remainder on all64cells is at most

E_n=(1/16) M_n q^21/(1-q).

The checker adds the symmetric interval [-E_n,E_n] to every integrated moment. Thus no floating quadrature heuristic, finite-theta assumption, or integration-by-parts cancellation is used.

## Structural implication, from the certificate
For a core lower channel block A_c>0 of size r, inertia additivity transfers all negative core directions to its Schur complement. A binary core/tail covariance correction has form D*(A_c:A_t)D and rank at most r. Thus a three-negative core Schur residual cannot be made positive by a rank-two covariance correction alone. Actual outer-tail Schur reserve, more channels, or a richer spatial decomposition must supply the remaining repair. This does not apply a rank-two bound to continuum covariance and does not imply failure of the full integrated matrix.

The executed interval certificate has all three pivots of the negative Gram strictly positive, respectively greater than 4.32009, 0.0003767665, and 0.0000044390098. The replay checker reads the fixed rational witness file; candidate selection is separately retained in `select_witnesses.py` and is not a proof dependency.
