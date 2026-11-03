# Fresh even8/odd9 signed target flow over the reserved tail shell

The known four-dimensional old tail metrics remain positive through a region containing genuinely indefinite odd local densities. This note now evaluates the ACTUAL target forcing for even8 and odd9, rather than inferring it from that old conditioning. It proves a positive finite difference of their Schur values; it does not prove either absolute Schur value positive, add degree coverage to the existing finite work, or establish a uniform-in-degree inequality.

## 1. Target and input restrictions

For epsilon=0,1 let m_j(H)=2 integral_H^infinity u² psi(u)² g_j(u)du. The target has four old coefficients:
 A=[m_(i+j+epsilon)]_(i,j=0..3),
 b=[m_(i+4+epsilon)]_(i=0..3),
 c=m_(8+epsilon), z=-A^-1b, S=c-b^TA^-1b.
Use inward time t=1/8-H on[0,1/8]. Its local full target matrix W has entries2H²psi(H)²g_(i+j+epsilon)(H), i,j0..4, and A'=L is its old submatrix.

The even8 input state reads only m0..m7 atH=1/8. The odd9 input state reads only m1..m8. In particular, the odd9 cross moment m8 is NOT inserted as the even8 target c; each state is explicitly constructed from its own permitted old/cross indices. Neither integrated target c, an earlier target Schur certificate, nor an earlier target gain enters the flow. Local target densities g8,g9 and their derivatives are freshly evaluated as required to compute the signed source.

The prepared file contains m0..m8 because both parity cases are computed together; that file-level overlap does not change the separate state restriction. The target difference is obtained by integrating S', without assigning a starting value to S.

## 2. Exact signed derivative and rigorous flow rule

Set v=(z,1), r=Lz+l, l=b', and tvec=L'z+l'. For the actual inverse,
 S'=v^TWv,
 S'''=v^TW''v-6tvec^TA^-1r+6(A^-1r)^TL(A^-1r).   (1)
The final term is signed when L is indefinite. No local-old or local-target positivity is used in(1), or in evaluating S'. All integrated old matrices are checked positive on every whole quadrature cell.

Prime means inward time. Therefore W' is MINUS the physical-H first derivative, while W'' is the physical second derivative. The actual midpoint old/cross state is computed by integrating the first half-cell at the physical quarterpoint mid+w/4, not mid-w/4.

On each cell:
- signed partial-increment hulls enclose the whole old/cross path;
- interval4x4 LDL verifies the actual old inverse throughout;
- the midpoint state has half-cell midpoint error(w/2)^3 sup|density''|/24;
- the direct midpoint quadratic v^TWv is integrated with error w^3 sup|S'''|/24;
- endpoint old/cross moments propagate by midpoint integration with their complete second-derivative errors.
This is the same exact correlated flow identity as the prior lower-degree proof, applied to four old coefficients. The new inverse is explicitly checked; no successful lower-degree bound is substituted for it.

## 3. Complete theta derivatives through20

`theta20_density.py` extends the previously reviewed derivative16 ratio estimate. On z=pi exp2H>=pi, write psi=f1(1+r),
 r_n=A_n exp(-(n²-1)z), A_n=n²(2n²z-3)/(2z-3).
The geometric derivative bound uses
 (1/2)(1-3/(2pi))^-21<2^23,
 |D^j A_n|<=2^24 n^4 2^j j!, j<=20.
The same Stirling/Leibniz estimate then gives the conservative envelope
 |D^j r_n|<=C n^44 z^20 exp(-(n²-1)z),
 C=2^25*20!*4^20.
For n>=9 the consecutive ratio is bounded by(10/9)^44 exp(-19pi)<1/2. Hence the full omitted derivative tail is
 2C 9^44 z^20 exp(-80z).
It is inserted in every Taylor coefficient through20 before log(1+r) is formed.

The normalized product generating function uses Q_a(r)=2 sum_(positive even j)(j+a)!/j! ell_(j+a) r^j, where ell_j=ell^(j)/j!. For g0..g9 and their first/second derivatives, derivatives through20 suffice. Weight derivatives include the linear H/2 term of ell, as in the reviewed lower-degree calculation.

Beyond H=2, the same argument at z>=100 gives
 epsilon(z)=8*20!*4^20*2^44*z^20 exp(-3z),
 with both epsilon<1e-10 and20!epsilon(1+epsilon)^19<1 checked. The resulting old/cross tail bound for index j<=8 is
 (256/sqrt(pi))(2j)!9^j Z^(9/2+j)exp(-2Z), Z=pi exp4.
The largest is below1.145e-98. These are full-theta analytic tails, not empirical orbit/spatial truncations.

## 4. Removing the dominant old/cross input uncertainty

The first preparation used8000-cell ordinary midpoint quadrature on[1/8,2]. With those inputs, even16000-cell source integration was inconclusive for both targets. The independent replay confirmed that the intervals covered zero; this was not evidence of a negative gain. Refining the source mesh alone did not remove the dominant input dependency.

The successful preparation uses4000-cell corrected midpoint quadrature:
 integral_cell f = w f(mid)+w³ f''(mid)/24+error,
 |error|<=w^5 sup|f''''|/1920.                       (2)
For moment indices up to8, the required fourth derivative uses ell through20, so the same complete orbit enclosure suffices.

Specifically, with E=exp Q0,
 E'=EQ1,
 E''=E(Q2+Q1²),
 E'''=E(Q3+3Q1Q2+Q1³),
 E''''=E(Q4+4Q1Q3+3Q2²+6Q1²Q2+Q1^4).
Weight derivatives through4 are extracted from
 2(H+h)^2 psi(H)^2 exp(2 sum_(j=1)^4 ell_j h^j).
Leibniz gives density fourth derivatives as the sum overa=0..4 of binomial(4,a) weight^(4-a) times thea-th product derivative coefficient. All factorial quotients in the implementation are exact integers.

No new target moment is used to improve these inputs. The method only tightens the actual old/cross state required by the inverse.

## 5. Directed results

With corrected inputs and16000 source cells, in h/(4pi) units:

Even8:
 S(H=0)-S(H=1/8)>20,789,567,012;
 upper bound<20,792,561,646;
 explicit source-midpoint error<136,021;
 actual old top pivot throughout>60,501,703.

Odd9:
 S(H=0)-S(H=1/8)>2,292,529,955,055;
 upper bound<2,325,475,835,120;
 explicit source-midpoint error<13,852,344,157;
 actual old top pivot throughout>5,569,494,610.

Every old LDL pivot is positive on every cell. These positive gains are obtained without either starting target value. Therefore they certify improvement of the target along this shell, not absolute positivity at either endpoint.

The direct negative-source rectangle lower bounds remain0 in both cases; their upper bounds are deliberately broad. Thus we do not claim that a negative target-source segment was observed or paid in this calculation. The local OLD odd matrix is nevertheless genuinely indefinite near0 by the retained fixed-witness certificate. The finite proof handles that indefiniteness without assuming it disappears.

The4000-cell corrected-input test already resolves even8 but is inconclusive for odd9; the16000-cell test resolves both. Earlier midpoint-input files and their inconclusive statuses are preserved separately, not silently replaced.

## 6. Scope

This is a controlled correlated signed target-flow calculation with an actual four-dimensional inverse, not a conclusion from old conditioning alone. It improves the test mechanism but does not claim new finite degree coverage, a lower bound for an absolute unknown target pivot, a shifted-parameter theorem, or a uniform degree estimate. The all-degree problem remains to control the corresponding correlated signed source and inverse conditioning analytically as degree grows.
